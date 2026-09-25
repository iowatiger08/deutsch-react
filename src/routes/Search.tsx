/**
 * Search page (route "/") — ports index.html + its inline JS + app.js.
 *
 * Search box (150 ms debounce), a category dropdown, sortable headers, limit toggle,
 * and inline add/edit/delete against the local IndexedDB store. The server-only
 * "⏻ Beenden" button is gone; an Export / Import control takes its place as the
 * backup story.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { categoriesOf, search } from '../lib/search';
import { exportEntries, parseImport, type EntryForm } from '../lib/store';
import { key as normKey } from '../lib/normalize';
import { currentAllowedUser, signIn, signOut } from '../lib/auth';
import type { SortDir, SortField } from '../lib/types';

const OTHER = '__other';
const emptyDraft: EntryForm = { german: '', english: '', category: '', sourcePage: 0 };

type EditingId = number | 'new' | null;

export default function Search() {
  const { entries, add, update, remove, replaceAll } = useStore();

  const [rawQ, setRawQ] = useState('');
  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortField, setSortField] = useState<SortField>('german');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [limit, setLimit] = useState('all');
  const [editingId, setEditingId] = useState<EditingId>(null);
  const [draft, setDraft] = useState<EntryForm>(emptyDraft);
  // Edit guard: locked by default. Unlocking requires signing in as the allowed
  // Cognito user; once authenticated the lock toggles freely for the session.
  const [unlocked, setUnlocked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const firstEditRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => categoriesOf(entries), [entries]);

  // 150 ms debounce on the search box (matches the original setTimeout).
  useEffect(() => {
    const t = setTimeout(() => setQ(rawQ), 150);
    return () => clearTimeout(t);
  }, [rawQ]);

  const results = useMemo(
    () => search(entries, { q, category: activeCategory, sort: sortField, dir: sortDir, limit }),
    [entries, q, activeCategory, sortField, sortDir, limit],
  );

  const capped = limit !== 'all' && results.length === Number(limit);
  const meta = results.length
    ? `${results.length} result${results.length === 1 ? '' : 's'}${capped ? ' (limited)' : ''}`
    : editingId === 'new'
      ? 'Adding a new entry…'
      : 'No matches.';

  // Focus the first field when an edit/add row appears.
  useEffect(() => {
    if (editingId !== null) firstEditRef.current?.focus();
  }, [editingId]);

  // On load, note whether a valid session for the allowed user already exists.
  useEffect(() => {
    currentAllowedUser().then(setAuthed);
  }, []);

  async function toggleLock() {
    if (unlocked) {
      setUnlocked(false);
      setEditingId(null); // locking cancels any in-progress edit
      return;
    }
    // Re-validate the session live at unlock time. This avoids trusting a stale
    // `authed` flag (token may have expired) and sidesteps the mount-time race
    // where a valid cached session hasn't been checked yet.
    const ok = await currentAllowedUser();
    setAuthed(ok);
    if (ok) setUnlocked(true);
    else setShowLogin(true); // must sign in to unlock
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    try {
      await signIn(loginEmail, loginPassword);
      setAuthed(true);
      setUnlocked(true);
      setShowLogin(false);
      setLoginPassword('');
    } catch (err) {
      setLoginError((err as Error).message || 'Anmeldung fehlgeschlagen.');
    } finally {
      setLoginBusy(false);
    }
  }

  function logout() {
    signOut();
    setAuthed(false);
    setUnlocked(false);
    setEditingId(null);
  }

  function startAdd() {
    if (!unlocked) return;
    setDraft({ ...emptyDraft, category: categories[0] ?? '' });
    setEditingId('new');
  }

  function startEdit(id: number) {
    if (!unlocked) return;
    const e = entries.find((x) => x.id === id);
    if (!e) return;
    setDraft({ german: e.german, english: e.english, category: e.category, sourcePage: e.sourcePage });
    setEditingId(id);
  }

  function cancel() {
    setEditingId(null);
  }

  async function save() {
    if (!draft.german.trim()) {
      alert('German term is required.');
      return;
    }
    try {
      if (editingId === 'new') {
        // Warn on a likely duplicate (same article-/case-/whitespace-normalized
        // German). Confirm merges the gloss into the existing row; cancel aborts.
        const k = normKey(draft.german);
        const dup = entries.find((e) => normKey(e.german) === k);
        if (
          dup &&
          !confirm(
            `This looks like an existing entry:\n\n„${dup.german}" — ${dup.english || '—'}\n\n` +
              `Merge your gloss into it?`,
          )
        ) {
          return;
        }
        await add(draft);
      } else if (typeof editingId === 'number') {
        await update(editingId, draft);
      }
      setEditingId(null);
    } catch (err) {
      alert('Save failed: ' + (err as Error).message);
    }
  }

  async function del(id: number) {
    if (!unlocked) return;
    if (!confirm('Delete this entry?')) return;
    await remove(id);
  }

  function toggleSort(field: SortField) {
    if (field === sortField) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-importing the same file
    if (!file || !unlocked) return;
    if (!confirm('Import replaces all current entries. Continue?')) return;
    try {
      const imported = await parseImport(file);
      await replaceAll(imported);
      setActiveCategory('');
      setEditingId(null);
    } catch (err) {
      alert('Import failed: ' + (err as Error).message);
    }
  }

  const arrow = (field: SortField) => (field === sortField ? (sortDir === 'asc' ? '▲' : '▼') : '');
  const selectValue = categories.includes(draft.category) || draft.category === '' ? draft.category : OTHER;
  const showCustomCat = draft.category !== '' && !categories.includes(draft.category);

  function onEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }

  function editRow(id: EditingId) {
    return (
      <tr key={typeof id === 'number' ? id : 'new'} className="editing" onKeyDown={onEditKeyDown}>
        <td>
          <input
            ref={firstEditRef}
            className="edit-de"
            placeholder="German"
            value={draft.german}
            onChange={(e) => setDraft((d) => ({ ...d, german: e.target.value }))}
          />
        </td>
        <td>
          <input
            className="edit-en"
            placeholder="English"
            value={draft.english}
            onChange={(e) => setDraft((d) => ({ ...d, english: e.target.value }))}
          />
        </td>
        <td>
          <select
            className="edit-cat"
            value={selectValue}
            onChange={(e) =>
              setDraft((d) => ({ ...d, category: e.target.value === OTHER ? '' : e.target.value }))
            }
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={OTHER}>Other…</option>
          </select>
          {(selectValue === OTHER || showCustomCat) && (
            <input
              className="edit-cat-other"
              placeholder="Category name"
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            />
          )}
        </td>
        <td className="pg">
          <input
            className="edit-pg"
            type="number"
            min={0}
            style={{ width: 52 }}
            value={draft.sourcePage}
            onChange={(e) => setDraft((d) => ({ ...d, sourcePage: parseInt(e.target.value, 10) || 0 }))}
          />
        </td>
        <td className="act">
          <button className="icon-btn save" title="Save" onClick={save}>
            ✔
          </button>
          <button className="icon-btn cancel" title="Cancel" onClick={cancel}>
            ✕
          </button>
        </td>
      </tr>
    );
  }

  return (
    <main className="wrap">
      <section className="search-panel">
        <input
          type="search"
          id="q"
          placeholder="Search German or English… e.g. waiter, Kellner, danke"
          autoComplete="off"
          autoFocus
          value={rawQ}
          onChange={(e) => setRawQ(e.target.value)}
        />
        <div className="cat-filter">
          <label className="cat-label" htmlFor="cat-select">
            Category
          </label>
          <select
            className="cat-select"
            id="cat-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="result-bar">
          <p className="result-meta" id="meta">
            {meta}
          </p>
          <div className="controls">
            <div className="action-buttons">
              <button
                className={`btn lock${unlocked ? ' unlocked' : ''}`}
                onClick={toggleLock}
                title={unlocked ? 'Bearbeiten sperren' : 'Bearbeiten entsperren'}
              >
                {unlocked ? '🔓' : '🔒'} Bearbeiten
              </button>
              <button className="btn add" onClick={startAdd} disabled={!unlocked}>
                + Add entry
              </button>
              <button
                className="btn"
                onClick={() => exportEntries(entries)}
                disabled={!unlocked}
              >
                ⬇ Export
              </button>
              <button
                className="btn"
                onClick={() => fileRef.current?.click()}
                disabled={!unlocked}
              >
                ⬆ Import
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={onImportFile}
              />
              {authed && (
                <button className="btn" onClick={logout} title="Abmelden">
                  ⎋ Abmelden
                </button>
              )}
            </div>
            <div className="limit-toggle" id="limit-toggle">
              <span className="limit-label">Show</span>
              {['200', '500', 'all'].map((l) => (
                <button
                  key={l}
                  className={`lim${limit === l ? ' active' : ''}`}
                  onClick={() => setLimit(l)}
                >
                  {l === 'all' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="table-scroll">
          <table id="results">
            <thead>
              <tr>
                {(
                  [
                    ['german', 'German', ''],
                    ['english', 'English', ''],
                    ['category', 'Category', ''],
                    ['sourcePage', 'Page', 'pg'],
                  ] as [SortField, string, string][]
                ).map(([field, label, cls]) => (
                  <th
                    key={field}
                    className={`sortable ${cls}${sortField === field ? ' sorted' : ''}`}
                    data-arrow={arrow(field)}
                    onClick={() => toggleSort(field)}
                  >
                    {label}
                  </th>
                ))}
                <th className="act"></th>
              </tr>
            </thead>
            <tbody id="rows">
              {editingId === 'new' && editRow('new')}
              {results.map((e) =>
                e.id === editingId ? (
                  editRow(e.id)
                ) : (
                  <tr key={e.id} data-id={e.id}>
                    <td className="de">{e.german}</td>
                    <td>{e.english || <span className="muted">—</span>}</td>
                    <td className="cat">{e.category}</td>
                    <td className="pg">{e.sourcePage}</td>
                    <td className="act">
                      <button
                        className="icon-btn edit"
                        title="Edit"
                        onClick={() => startEdit(e.id)}
                        disabled={!unlocked}
                      >
                        ✎
                      </button>
                      <button
                        className="icon-btn del"
                        title="Delete"
                        onClick={() => del(e.id)}
                        disabled={!unlocked}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sign-in gate for the edit lock. */}
      {showLogin && (
        <div
          className="login-overlay"
          onClick={() => {
            if (!loginBusy) setShowLogin(false);
          }}
        >
          <form className="login-card" onClick={(e) => e.stopPropagation()} onSubmit={submitLogin}>
            <h3>🔒 Bearbeiten entsperren</h3>
            <p className="hint">Melde dich an, um Einträge zu bearbeiten.</p>
            <label>
              E-Mail
              <input
                type="email"
                autoComplete="username"
                autoFocus
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Passwort
              <input
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </label>
            {loginError && <p className="login-error">{loginError}</p>}
            <div className="login-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setShowLogin(false)}
                disabled={loginBusy}
              >
                Abbrechen
              </button>
              <button type="submit" className="btn add" disabled={loginBusy}>
                {loginBusy ? 'Anmelden…' : 'Anmelden'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating add button — stays reachable while scrolling the list. */}
      <button
        className="fab-add"
        onClick={startAdd}
        disabled={!unlocked}
        aria-label="Add entry"
        title={unlocked ? 'Eintrag hinzufügen' : 'Zum Bearbeiten oben entsperren'}
      >
        +
      </button>
    </main>
  );
}
