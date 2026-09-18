/**
 * IndexedDB-backed persistence for the entry array — replaces H2 + JPA.
 *
 * The dataset is tiny (~1.5k entries, 184 KB) and already de-duplicated, so the
 * whole thing lives in memory and is persisted as one IndexedDB value. Add/edit/
 * delete are pure functions returning a new array; the store context writes the
 * whole array back after each mutation.
 */
import { get, set } from 'idb-keyval';
// Bundled snapshot exported from the authoritative H2 database (not the old
// bootstrap entries.json). Regenerate via the H2 dump when the DB changes.
import seed from '../data/seed.json';
import type { Entry, SeedEntry } from './types';
import { key as normKey, merge as normMerge } from './normalize';

const ENTRIES_KEY = 'entries';
const SCHEMA_KEY = 'schemaVersion';
export const SCHEMA_VERSION = 1;

/** Editable fields sent from the UI. Mirrors `EntryController.EntryForm`. */
export interface EntryForm {
  german: string;
  english: string;
  category: string;
  sourcePage: number;
}

/** Seed the array from the bundled JSON, stamping a stable id per row (index). */
function seedEntries(): Entry[] {
  return (seed as SeedEntry[]).map((e, i) => ({ id: i, ...e }));
}

/** Read the array once at startup; seed on first run. */
export async function loadEntries(): Promise<Entry[]> {
  const existing = await get<Entry[]>(ENTRIES_KEY);
  if (existing && existing.length > 0) return existing;
  const seeded = seedEntries();
  await set(ENTRIES_KEY, seeded);
  await set(SCHEMA_KEY, SCHEMA_VERSION);
  return seeded;
}

/** Persist the whole array (184 KB writes are trivial). */
export async function saveEntries(entries: Entry[]): Promise<void> {
  await set(ENTRIES_KEY, entries);
}

function nextId(entries: Entry[]): number {
  return entries.reduce((max, e) => Math.max(max, e.id), -1) + 1;
}

/** Trim + validate a form the way `EntryController.apply` did. Throws on empty German. */
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
 * Add an entry, folding into an existing same-word row if one exists (mirrors
 * `EntryController.create`). Returns the new array.
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

/** Replace an existing entry's editable fields by id. Mirrors `EntryController.update`. */
export function updateEntry(entries: Entry[], id: number, form: EntryForm): Entry[] {
  const clean = normalizeForm(form);
  return entries.map((e) => (e.id === id ? { ...e, ...clean } : e));
}

/** Remove an entry by id. */
export function deleteEntry(entries: Entry[], id: number): Entry[] {
  return entries.filter((e) => e.id !== id);
}

/** Download the current array as `entries.json` (same shape as the seed, id stripped). */
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
