/**
 * In-memory search/filter/sort over the entry array.
 *
 * Ports `SearchController` + `TranslationRepository.search`: category takes
 * precedence over the query (exactly like the server's branch order), the
 * results are sorted by the chosen field/direction, then capped by the limit.
 */
import type { Entry, Limit, SearchParams, SortDir, SortField } from './types';

const SORTABLE: readonly SortField[] = ['german', 'english', 'category', 'sourcePage'];
const ALL = 100_000;

function parseLimit(limit: Limit | undefined): number {
  if (limit == null || limit.trim() === '' || limit.toLowerCase() === 'all') return ALL;
  const n = parseInt(limit.trim(), 10);
  if (Number.isNaN(n)) return ALL;
  return Math.min(Math.max(n, 1), ALL);
}

function compare(a: Entry, b: Entry, field: SortField, dir: SortDir): number {
  let cmp: number;
  if (field === 'sourcePage') {
    cmp = a.sourcePage - b.sourcePage;
  } else {
    cmp = (a[field] ?? '').localeCompare(b[field] ?? '', 'de', { sensitivity: 'base' });
  }
  return dir === 'desc' ? -cmp : cmp;
}

export function search(entries: Entry[], params: SearchParams = {}): Entry[] {
  const field: SortField = SORTABLE.includes(params.sort as SortField)
    ? (params.sort as SortField)
    : 'german';
  const dir: SortDir = params.dir?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  const max = parseLimit(params.limit);
  const category = params.category?.trim() ?? '';
  const q = (params.q ?? '').trim();

  let matched: Entry[];
  if (category !== '') {
    matched = entries.filter((e) => e.category === category);
  } else if (q === '') {
    matched = entries.slice();
  } else {
    const needle = q.toLowerCase();
    matched = entries.filter(
      (e) =>
        (e.german ?? '').toLowerCase().includes(needle) ||
        (e.english ?? '').toLowerCase().includes(needle),
    );
  }

  matched.sort((a, b) => compare(a, b, field, dir));
  return matched.slice(0, max);
}

/** Distinct, sorted category names — replaces `/api/categories`. */
export function categoriesOf(entries: Entry[]): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    if (e.category != null && e.category.trim() !== '') set.add(e.category);
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'de'));
}
