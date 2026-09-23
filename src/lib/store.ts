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
import type { Entry } from './types';
import type { SeedEntry } from './types';
import { key as normKey, merge as normMerge } from './normalize';
import { fetchEntries, putEntries, AuthError } from './api';
import { getIdToken } from './auth';

const ENTRIES_KEY = 'entries'; // last-synced offline mirror
const DIRTY_KEY = 'entriesDirty'; // set when a local change hasn't reached the server

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
  const cached = (await get<Entry[]>(ENTRIES_KEY)) ?? [];
  const dirty = (await get<boolean>(DIRTY_KEY)) ?? false;
  if (dirty && cached.length > 0) {
    void flushOutbox(); // try to push the pending change; keep showing local meanwhile
    return cached;
  }
  try {
    const { entries } = await fetchEntries();
    await set(ENTRIES_KEY, entries);
    return entries;
  } catch {
    return cached; // offline: show the last-synced copy (may be empty)
  }
}

/**
 * Persist the whole array. Writes through to the server with the owner's token;
 * always mirrors to IndexedDB. A network failure is swallowed and queued (dirty);
 * an auth/validation rejection throws so the UI can surface it.
 */
export async function saveEntries(entries: Entry[]): Promise<void> {
  await set(ENTRIES_KEY, entries); // optimistic local mirror
  const token = await getIdToken();
  if (!token) throw new AuthError('Nicht angemeldet — bitte anmelden, um zu speichern.');
  try {
    await putEntries(entries, token);
    await set(DIRTY_KEY, false);
  } catch (err) {
    if (err instanceof AuthError) throw err; // real rejection — let the UI alert
    if (err instanceof Error && err.message.startsWith('PUT /api/entries failed')) throw err;
    await set(DIRTY_KEY, true); // network failure → queue for reconnect
  }
}

/** Replay a queued offline change once back online. No-op if nothing is pending. */
export async function flushOutbox(): Promise<void> {
  if (!(await get<boolean>(DIRTY_KEY))) return;
  const token = await getIdToken();
  if (!token) return; // only the owner can flush; try again next time
  const entries = (await get<Entry[]>(ENTRIES_KEY)) ?? [];
  try {
    await putEntries(entries, token);
    await set(DIRTY_KEY, false);
  } catch {
    /* still offline or rejected — leave dirty for the next attempt */
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
