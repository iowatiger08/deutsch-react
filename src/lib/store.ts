/**
 * Vocabulary persistence — DynamoDB-backed via `/api/entries`, with IndexedDB as
 * an offline mirror.
 *
 * The dataset is tiny (~1.6k entries, ~200 KB) and already de-duplicated, so the
 * whole array lives in memory and is read/written in one shot. Reads come from
 * the server (public); when offline we fall back to the last-synced IndexedDB
 * copy. Writes go to the server with the owner's ID token; a write made while
 * offline is cached and flagged dirty (an outbox) and replayed on reconnect.
 *
 * Add/edit/delete are pure functions returning a new array; the store context
 * writes the whole array back after each mutation.
 */
import { get, set } from 'idb-keyval';
import type { Entry, SeedEntry } from './types';
import { key as normKey, merge as normMerge } from './normalize';
import { fetchEntries, putEntries, ApiError, AuthError, ConflictError } from './api';
import { getIdToken } from './auth';

const ENTRIES_KEY = 'entries'; // last-synced offline mirror
const DIRTY_KEY = 'entriesDirty'; // set when a local change hasn't reached the server
const UPDATED_AT_KEY = 'entriesUpdatedAt'; // server version we last synced (optimistic-concurrency base)

/** Editable fields sent from the UI. Mirrors the server's entry shape. */
export interface EntryForm {
  german: string;
  english: string;
  category: string;
  sourcePage: number;
}

/**
 * Load the array. Server is the source of truth; on network failure fall back to
 * the last-synced IndexedDB mirror (empty on a first-ever offline visit — there
 * is no bundled seed). A pending local change (dirty) wins over the server copy
 * so an offline edit isn't lost on the next load before it flushes.
 */
export async function loadEntries(): Promise<Entry[]> {
  const [cached, dirty] = await Promise.all([
    get<Entry[]>(ENTRIES_KEY).then((v) => v ?? []),
    get<boolean>(DIRTY_KEY).then((v) => v ?? false),
  ]);
  if (dirty) {
    void flushOutbox(); // try to push the pending change; keep showing local meanwhile
    return cached; // may be empty (e.g. a queued delete-all) — that's the pending truth
  }
  try {
    const { entries, updatedAt } = await fetchEntries();
    await Promise.all([set(ENTRIES_KEY, entries), set(UPDATED_AT_KEY, updatedAt)]);
    return entries;
  } catch {
    return cached; // offline: show the last-synced copy (may be empty)
  }
}

/**
 * Persist the whole array. Attempts the server write first (owner token + the
 * `updatedAt` we last synced, for optimistic concurrency), and only mirrors to
 * IndexedDB on success or on a genuine offline failure — never for a rejected
 * write, so the mirror always reflects a saved-or-queued state.
 *
 * - Success → mirror + advance the version + clear dirty.
 * - `ApiError` (auth / conflict / other HTTP rejection) → rethrow untouched so
 *   the caller can revert the optimistic UI and alert.
 * - Bare network failure → mirror + set dirty (queued for reconnect).
 */
export async function saveEntries(entries: Entry[]): Promise<void> {
  const token = await getIdToken();
  if (!token) throw new AuthError('Nicht angemeldet — bitte anmelden, um zu speichern.');
  const base = (await get<string>(UPDATED_AT_KEY)) ?? null;
  try {
    const { updatedAt } = await putEntries(entries, token, base);
    await Promise.all([
      set(ENTRIES_KEY, entries),
      set(UPDATED_AT_KEY, updatedAt),
      set(DIRTY_KEY, false),
    ]);
  } catch (err) {
    if (err instanceof ApiError) throw err; // server rejected — surface it, leave the mirror alone
    await Promise.all([set(ENTRIES_KEY, entries), set(DIRTY_KEY, true)]); // offline → queue
  }
}

/** Replay a queued offline change once back online. No-op if nothing is pending. */
export async function flushOutbox(): Promise<void> {
  if (!(await get<boolean>(DIRTY_KEY))) return;
  const token = await getIdToken();
  if (!token) return; // only the owner can flush; try again next time
  const [entries, base] = await Promise.all([
    get<Entry[]>(ENTRIES_KEY).then((v) => v ?? []),
    get<string>(UPDATED_AT_KEY).then((v) => v ?? null),
  ]);
  try {
    const { updatedAt } = await putEntries(entries, token, base);
    await Promise.all([set(UPDATED_AT_KEY, updatedAt), set(DIRTY_KEY, false)]);
  } catch (err) {
    if (err instanceof ConflictError) {
      // The server moved while we were offline. We can't safely merge a whole-array
      // overwrite, so adopt the server copy (dropping this queued edit) rather than
      // clobber newer data — a rare single-owner edge. Better than an infinite retry.
      try {
        const { entries: fresh, updatedAt } = await fetchEntries();
        await Promise.all([
          set(ENTRIES_KEY, fresh),
          set(UPDATED_AT_KEY, updatedAt),
          set(DIRTY_KEY, false),
        ]);
      } catch {
        /* still offline — leave dirty and retry later */
      }
    }
    /* network/auth failure → leave dirty for the next attempt */
  }
}

function nextId(entries: Entry[]): number {
  return entries.reduce((max, e) => Math.max(max, e.id), -1) + 1;
}

/** Trim + validate a form the way the server's `cleanEntry` does. Throws on empty German. */
function normalizeForm(form: EntryForm): EntryForm {
  const german = (form.german ?? '').trim();
  if (german === '') throw new Error('German term is required');
  return {
    german,
    english: (form.english ?? '').trim(),
    category: (form.category ?? '').trim(),
    sourcePage: form.sourcePage || 0,
  };
}

/**
 * Add an entry, folding into an existing same-word row if one exists. Returns the
 * new array.
 */
export function addEntry(entries: Entry[], form: EntryForm): Entry[] {
  const clean = normalizeForm(form);
  const k = normKey(clean.german);
  const existing = entries.filter((e) => normKey(e.german) === k);

  if (existing.length > 0) {
    const merged = normMerge([...existing, clean]);
    const survivorId = existing[0].id;
    return entries.map((e) => (e.id === survivorId ? { ...e, ...merged } : e));
  }
  return [...entries, { id: nextId(entries), ...clean }];
}

/** Replace an existing entry's editable fields by id. */
export function updateEntry(entries: Entry[], id: number, form: EntryForm): Entry[] {
  const clean = normalizeForm(form);
  return entries.map((e) => (e.id === id ? { ...e, ...clean } : e));
}

/** Remove an entry by id. */
export function deleteEntry(entries: Entry[], id: number): Entry[] {
  return entries.filter((e) => e.id !== id);
}

/** Download the current array as `entries.json` (server shape, id stripped). */
export function exportEntries(entries: Entry[]): void {
  const seedShape: SeedEntry[] = entries.map(({ german, english, category, sourcePage }) => ({
    german,
    english,
    category,
    sourcePage,
  }));
  const blob = new Blob([JSON.stringify(seedShape, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'entries.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Parse an imported JSON file into a fresh Entry array (ids reassigned by index). */
export async function parseImport(file: File): Promise<Entry[]> {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error('Expected a JSON array of entries');
  return data.map((e: Partial<SeedEntry>, i: number) => ({
    id: i,
    german: String(e.german ?? ''),
    english: String(e.english ?? ''),
    category: String(e.category ?? ''),
    sourcePage: Number(e.sourcePage ?? 0) || 0,
  }));
}
