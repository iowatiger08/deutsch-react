/**
 * Normalization and merge rules for collapsing duplicate German entries.
 *
 * Ports `GermanNormalizer.java` so add-dedup in the browser behaves exactly like
 * the server did: two rows are "the same word" when their keys match, and a group
 * of same-word rows fuses into one canonical entry.
 */
import type { SeedEntry } from './types';

/** Leading definite article ("der ", "Die ", "das " …), with its trailing space. */
const LEADING_ARTICLE = /^(der|die|das)\s+/i;
const WHITESPACE = /\s+/g;

/**
 * Grouping key: two German terms collapse into one entry when their keys match.
 * Lower-cased, whitespace-collapsed, with any leading der/die/das stripped.
 */
export function key(german: string | null | undefined): string {
  if (german == null) return '';
  let g = german.trim().replace(WHITESPACE, ' ');
  g = g.replace(LEADING_ARTICLE, '');
  return g.toLocaleLowerCase('de');
}

/** The lower-cased definite article (der/die/das) if the term starts with one, else null. */
export function article(german: string | null | undefined): string | null {
  if (german == null) return null;
  const m = german.trim().match(LEADING_ARTICLE);
  return m ? m[1].toLocaleLowerCase('de') : null;
}

export function hasArticle(german: string | null | undefined): boolean {
  return article(german) !== null;
}

type GermanRow = Pick<SeedEntry, 'german' | 'english' | 'category' | 'sourcePage'>;

/**
 * Collapse a group of same-word entries into a single merged entry.
 * Returns a fresh seed-shaped object; the caller decides how to persist it.
 */
export function merge(group: GermanRow[]): SeedEntry {
  if (!group || group.length === 0) {
    throw new Error('Cannot merge an empty group');
  }
  return {
    german: canonicalGerman(group),
    english: mergeGlosses(group),
    category: dominantCategory(group),
    sourcePage: earliestPage(group),
  };
}

function startsUpper(s: string): boolean {
  return s.length > 0 && s[0] !== s[0].toLocaleLowerCase('de') && s[0] === s[0].toLocaleUpperCase('de');
}

function bareNounOf(german: string): string {
  const g = german.trim().replace(WHITESPACE, ' ');
  return g.replace(LEADING_ARTICLE, '');
}

/** The bare noun taken from the most carefully-cased variant in the group. */
function bareNoun(group: GermanRow[]): string {
  const upper = group.map((e) => bareNounOf(e.german)).find((n) => startsUpper(n));
  return upper ?? bareNounOf(group[0].german);
}

/** Uppercase the first letter, leave the rest untouched. */
function capitalizeNoun(noun: string): string {
  if (noun.length === 0 || startsUpper(noun)) return noun;
  return noun[0].toLocaleUpperCase('de') + noun.slice(1);
}

/**
 * Canonical German term. If any variant carries an article, use the articled form
 * ("<lowercase article> <Capitalized noun>") to preserve gender; else the best bare form.
 * Conflicting articles are merged (warned) preferring the variant with a capitalized noun.
 */
function canonicalGerman(group: GermanRow[]): string {
  const byArticle = new Map<string, GermanRow>();
  for (const e of group) {
    const a = article(e.german);
    if (a != null && !byArticle.has(a)) byArticle.set(a, e);
  }

  const noun = capitalizeNoun(bareNoun(group));

  if (byArticle.size === 0) return noun;

  let chosen: string;
  if (byArticle.size > 1) {
    const preferred = [...byArticle.entries()].find(([, v]) => startsUpper(bareNounOf(v.german)));
    chosen = preferred ? preferred[0] : byArticle.keys().next().value!;
    console.warn(
      `Conflicting articles [${[...byArticle.keys()].join(', ')}] for '${noun}' — ` +
        `merged as '${chosen} ${noun}'; verify gender manually.`,
    );
  } else {
    chosen = byArticle.keys().next().value!;
  }
  return `${chosen} ${noun}`;
}

/** Union of distinct non-blank English glosses (case-insensitive), joined with "; ". */
function mergeGlosses(group: GermanRow[]): string {
  const seen = new Map<string, string>();
  for (const e of group) {
    const english = e.english;
    if (english == null) continue;
    const gloss = english.trim();
    if (gloss.length === 0) continue;
    const k = gloss.toLowerCase();
    if (!seen.has(k)) seen.set(k, gloss);
  }
  return [...seen.values()].join('; ');
}

/** Most frequent non-empty category; ties broken by first-seen order. */
function dominantCategory(group: GermanRow[]): string {
  const counts = new Map<string, number>();
  for (const e of group) {
    const c = e.category;
    if (c != null && c.trim().length > 0) {
      const t = c.trim();
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  let best: string | null = null;
  let bestCount = -1;
  for (const [c, n] of counts) {
    if (n > bestCount) {
      best = c;
      bestCount = n;
    }
  }
  return best ?? '';
}

function earliestPage(group: GermanRow[]): number {
  const pages = group.map((e) => e.sourcePage).filter((p) => p > 0);
  return pages.length ? Math.min(...pages) : 0;
}
