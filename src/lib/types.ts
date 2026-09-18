/** A single German/English translation. Mirrors the Java `TranslationEntry`. */
export interface Entry {
  /** Stable client-side id (array index at seed time; max+1 for new adds). */
  id: number;
  german: string;
  english: string;
  category: string;
  sourcePage: number;
}

/** The seed/export shape — same as `entries.json`, without the client id. */
export type SeedEntry = Omit<Entry, 'id'>;

export type SortField = 'german' | 'english' | 'category' | 'sourcePage';
export type SortDir = 'asc' | 'desc';
/** '200' | '500' | 'all' — matches the limit toggle. */
export type Limit = string;

export interface SearchParams {
  q?: string;
  category?: string;
  sort?: SortField;
  dir?: SortDir;
  limit?: Limit;
}
