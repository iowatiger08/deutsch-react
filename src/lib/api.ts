/**
 * Vocabulary sync client — talks to the DynamoDB-backed `/api/entries` endpoint
 * (same-origin, so no CORS preflight). The whole entry array is read/written in
 * one shot, mirroring the server's single-item storage model.
 *
 * Reads are public. Writes require the owner's Cognito ID token; the Lambda
 * verifies it, so a rejected write throws `AuthError` (distinct from a plain
 * network failure, which callers treat as "offline, queue it").
 */
import type { Entry } from './types';

const ENTRIES_URL = '/api/entries';

export interface EntriesPayload {
  entries: Entry[];
  updatedAt: string | null;
}

/** Thrown when the server rejects a write as unauthenticated/forbidden (401/403). */
export class AuthError extends Error {}

/** Fetch the full entry array. Throws on non-2xx; the caller falls back to cache. */
export async function fetchEntries(): Promise<EntriesPayload> {
  const res = await fetch(ENTRIES_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET /api/entries failed (HTTP ${res.status})`);
  const data = await res.json();
  return {
    entries: Array.isArray(data?.entries) ? (data.entries as Entry[]) : [],
    updatedAt: (data?.updatedAt as string) ?? null,
  };
}

/**
 * Replace the whole server-side array. Requires the owner's ID token.
 * - 401/403 → `AuthError` (not signed in / not the owner / expired token).
 * - other non-2xx → generic `Error`.
 * - network failure → the underlying `fetch` rejection propagates (caller queues).
 */
export async function putEntries(entries: Entry[], token: string): Promise<{ updatedAt: string }> {
  const res = await fetch(ENTRIES_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ entries }),
  });
  if (res.status === 401 || res.status === 403) {
    throw new AuthError('Nicht berechtigt oder Sitzung abgelaufen — bitte erneut anmelden.');
  }
  if (!res.ok) {
    let msg = `PUT /api/entries failed (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return (await res.json()) as { updatedAt: string };
}
