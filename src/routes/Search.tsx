/**
 * Search page (route "/") — ports index.html + its inline JS + app.js.
 *
 * Search box (150 ms debounce), category chips, sortable headers, limit toggle,
 * and inline add/edit/delete against the local IndexedDB store. The server-only
 * "⏻ Beenden" button is gone; an Export / Import control takes its place as the
 * backup story.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { categoriesOf, search } from '../lib/search';
import { exportEntries, parseImport, type EntryForm } from '../lib/store';
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

  function startAdd() {
    setDraft({ ...emptyDraft, category: categories[0] ?? '' });
    setEditingId('new');
  }

  function startEdit(id: number) {
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
      if (editingId === 'new') await add(draft);
      else if (typeof editingId === 'number') await update(editingId, draft);
      setEditingId(null);
    } catch (err) {
      alert('Save failed: ' + (err as Error).message);
    }
  }

  async function del(id: number) {
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
    if (!file) return;
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
        <div className="chips" id="chips">
          <button
            className={`chip${activeCategory === '' ? ' active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`chip${activeCategory === c ? ' active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="result-bar">
          <p className="result-meta" id="meta">
            {meta}
          </p>
          <div className="controls">
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
            <button className="btn add" onClick={startAdd}>
              + Add entry
            </button>
            <button className="btn" onClick={() => exportEntries(entries)}>
              ⬇ Export
            </button>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              ⬆ Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={onImportFile}
            />
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
                      <button className="icon-btn edit" title="Edit" onClick={() => startEdit(e.id)}>
                        ✎
                      </button>
                      <button className="icon-btn del" title="Delete" onClick={() => del(e.id)}>
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
    </main>
  );
}
