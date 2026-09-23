/**
 * Vocabulary sync client — talks to the DynamoDB-backed `/api/entries` endpoint
 * (same-origin, so no CORS preflight). The whole entry array is read/written in
 * one shot, mirroring the server's single-item storage model.
 *
 * Reads are public. Writes require the owner's Cognito ID token and carry the
 * `updatedAt` the client last saw, so the server can reject a stale overwrite
 * (optimistic concurrency) instead of silently clobbering another device's edit.
 *
 * Failures are typed so callers can tell them apart: `AuthError` (401/403),
 * `ConflictError` (409, someone else wrote first), or a generic `ApiError` for
 * any other non-2xx. A bare network failure is *not* an ApiError — the raw
 * `fetch` rejection propagates, and callers treat that (and only that) as
 * "offline, queue it".
 */
import type { Entry } from './types';

const ENTRIES_URL = '/api/entries';

export interface EntriesPayload {
  entries: Entry[];
  updatedAt: string | null;
}

/** A non-2xx HTTP response from the API (as opposed to a network failure). */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** 401/403 — not signed in, not the owner, or an expired token. */
export class AuthError extends ApiError {
  constructor(message = 'Nicht berechtigt oder Sitzung abgelaufen — bitte erneut anmelden.') {
    super(401, message);
  }
}

/** 409 — the server copy changed since the client last loaded it. */
export class ConflictError extends ApiError {
  constructor(message = 'Die Einträge wurden anderswo geändert — bitte neu laden und erneut versuchen.') {
    super(409, message);
  }
}

/** Fetch the full entry array. Throws on non-2xx; the caller falls back to cache. */
export async function fetchEntries(): Promise<EntriesPayload> {
  const res = await fetch(ENTRIES_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new ApiError(res.status, `GET /api/entries failed (HTTP ${res.status})`);
  const data = await res.json();
  return {
    entries: Array.isArray(data?.entries) ? (data.entries as Entry[]) : [],
    updatedAt: (data?.updatedAt as string) ?? null,
  };
}

/**
 * Replace the whole server-side array. Requires the owner's ID token and the
 * `baseUpdatedAt` the client last saw (null if it never synced). The server does
 * a conditional write against that base:
 * - 401/403 → `AuthError`; 409 → `ConflictError`; other non-2xx → `ApiError`.
 * - network failure → the underlying `fetch` rejection propagates (caller queues).
 */
export async function putEntries(
  entries: Entry[],
  token: string,
  baseUpdatedAt: string | null,
): Promise<{ updatedAt: string }> {
  const res = await fetch(ENTRIES_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ entries, baseUpdatedAt }),
  });
  if (res.ok) return (await res.json()) as { updatedAt: string };

  // Non-2xx: surface a typed error, preferring the server's error text.
  let msg = `PUT /api/entries failed (HTTP ${res.status})`;
  try {
    const body = await res.json();
    if (body?.error) msg = body.error;
  } catch {
    /* no JSON body */
  }
  if (res.status === 401 || res.status === 403) throw new AuthError(msg);
  if (res.status === 409) throw new ConflictError(msg);
  throw new ApiError(res.status, msg);
}
