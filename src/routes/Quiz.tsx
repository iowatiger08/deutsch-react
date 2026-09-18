/**
 * Quiz (route "/quiz") — ports quiz.html's flashcard logic to React state.
 *
 * Shuffle, flip, grade, "practice missed", keyboard 1/2/Space. The deck is built
 * from the in-memory store (cards needing both sides) instead of /api/search, and
 * the category list is derived from the store instead of /api/categories.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { categoriesOf } from '../lib/search';
import type { Entry } from '../lib/types';

type Direction = 'de-en' | 'en-de';

function shuffle<T>(a: T[]): T[] {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz() {
  const { entries } = useStore();
  const categories = useMemo(() => categoriesOf(entries), [entries]);

  const [direction, setDirection] = useState<Direction>('de-en');
  const [category, setCategory] = useState('');

  const [deck, setDeck] = useState<Entry[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [missed, setMissed] = useState<Entry[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  // Build (or rebuild) the deck from the current category filter.
  const buildDeck = useCallback(() => {
    const pool = entries.filter(
      (e) => e.german && e.english && (category === '' || e.category === category),
    );
    setDeck(shuffle(pool));
    setIdx(0);
    setRight(0);
    setWrong(0);
    setMissed([]);
    setFlipped(false);
  }, [entries, category]);

  // Initial deck + rebuild whenever the category (or data) changes.
  useEffect(() => {
    buildDeck();
  }, [buildDeck]);

  const total = deck.length;
  const finished = total > 0 && idx >= total;
  const current = !finished ? deck[idx] : undefined;
  const deFirst = direction === 'de-en';

  const front = current ? (deFirst ? current.german : current.english) : '';
  const back = current ? (deFirst ? current.english : current.german) : '';

  const flip = useCallback(() => {
    if (idx >= deck.length) return;
    setFlipped((f) => !f);
  }, [idx, deck.length]);

  const grade = useCallback(
    (known: boolean) => {
      if (idx >= deck.length) return;
      if (known) setRight((r) => r + 1);
      else {
        setWrong((w) => w + 1);
        setMissed((m) => [...m, deck[idx]]);
      }
      setIdx((i) => i + 1);
      setFlipped(false);
    },
    [idx, deck],
  );

  const practiceMissed = useCallback(() => {
    setDeck(shuffle(missed));
    setIdx(0);
    setRight(0);
    setWrong(0);
    setMissed([]);
    setFlipped(false);
  }, [missed]);

  // Keyboard: 1 = didn't know, 2 = knew it — only while the answer is showing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!flipped || finished) return;
      if (e.key === '1') grade(false);
      else if (e.key === '2') grade(true);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [flipped, finished, grade]);

  function onCardKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flip();
    }
  }

  const scoreText = total
    ? `Karte ${Math.min(idx + 1, total)} / ${total} · ✓ ${right} · ✗ ${wrong}`
    : 'Keine Karten in dieser Kategorie.';

  const gradedTotal = right + wrong;
  const pct = gradedTotal ? Math.round((right / gradedTotal) * 100) : 0;

  return (
    <main className="wrap">
      <section className="quiz-controls">
        <div className="quiz-row">
          <label>
            Richtung
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value as Direction);
                setFlipped(false);
              }}
            >
              <option value="de-en">Deutsch → English</option>
              <option value="en-de">English → Deutsch</option>
            </select>
          </label>
          <label>
            Kategorie
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Alle</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button className="btn add" onClick={buildDeck}>
            ↻ Neu mischen
          </button>
        </div>
        <div className="quiz-score">{scoreText}</div>
      </section>

      <section className="quiz-stage">
        {!finished && (
          <>
            <div
              ref={cardRef}
              className={`flashcard${flipped ? ' flipped' : ''}`}
              role="button"
              tabIndex={0}
              aria-label="Karte umdrehen"
              onClick={flip}
              onKeyDown={onCardKeyDown}
            >
              <div className="flashcard-inner">
                <div className="flashcard-face front">
                  <span>{total ? front : 'Keine Karten…'}</span>
                </div>
                <div className="flashcard-face back">
                  <span>{back}</span>
                </div>
              </div>
            </div>
            <p className="card-hint">Klicke die Karte oder drücke Leertaste zum Umdrehen.</p>
            {flipped && (
              <div className="quiz-actions">
                <button className="btn grade wrong" onClick={() => grade(false)}>
                  ✗ Nochmal üben
                </button>
                <button className="btn grade right" onClick={() => grade(true)}>
                  ✓ Gewusst
                </button>
              </div>
            )}
          </>
        )}

        {finished && (
          <div className="quiz-done">
            <h2>Fertig! 🎉</h2>
            <p>
              {right} von {gradedTotal} gewusst ({pct}%).
            </p>
            {missed.length > 0 && (
              <button className="btn add" onClick={practiceMissed}>
                {missed.length} schwierige Karten üben
              </button>
            )}{' '}
            <button className="btn add" onClick={buildDeck}>
              Alles neu mischen
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
