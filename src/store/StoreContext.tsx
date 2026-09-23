/**
 * In-memory entry store, loaded once from IndexedDB and shared via context.
 * All reads (search, quiz deck, category chips) run against `entries`; every
 * mutation updates state and writes the whole array back to IndexedDB.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Entry } from '../lib/types';
import {
  addEntry,
  deleteEntry,
  flushOutbox,
  loadEntries,
  saveEntries,
  updateEntry,
  type EntryForm,
} from '../lib/store';

interface StoreValue {
  entries: Entry[];
  loading: boolean;
  add: (form: EntryForm) => Promise<void>;
  update: (id: number, form: EntryForm) => Promise<void>;
  remove: (id: number) => Promise<void>;
  replaceAll: (entries: Entry[]) => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadEntries().then((loaded) => {
      if (!cancelled) {
        setEntries(loaded);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // When connectivity returns, replay any queued offline edit, then re-sync from
  // the server so the view reflects the authoritative copy.
  useEffect(() => {
    let cancelled = false;
    async function onOnline() {
      await flushOutbox();
      const fresh = await loadEntries();
      if (!cancelled) setEntries(fresh);
    }
    window.addEventListener('online', onOnline);
    return () => {
      cancelled = true;
      window.removeEventListener('online', onOnline);
    };
  }, []);

  const commit = useCallback(async (next: Entry[]) => {
    setEntries(next); // optimistic
    try {
      await saveEntries(next);
    } catch (err) {
      // The server rejected the write (auth / conflict / other HTTP error). Drop
      // the optimistic change by re-syncing to the authoritative copy, then let
      // the caller surface the error. (A bare offline failure does not throw —
      // saveEntries queues it — so the optimistic state stays put in that case.)
      try {
        const fresh = await loadEntries();
        setEntries(fresh);
      } catch {
        /* offline: keep the optimistic state until reconnect */
      }
      throw err;
    }
  }, []);

  const add = useCallback(
    (form: EntryForm) => commit(addEntry(entries, form)),
    [entries, commit],
  );
  const update = useCallback(
    (id: number, form: EntryForm) => commit(updateEntry(entries, id, form)),
    [entries, commit],
  );
  const remove = useCallback((id: number) => commit(deleteEntry(entries, id)), [entries, commit]);
  const replaceAll = useCallback((next: Entry[]) => commit(next), [commit]);

  const value = useMemo<StoreValue>(
    () => ({ entries, loading, add, update, remove, replaceAll }),
    [entries, loading, add, update, remove, replaceAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
