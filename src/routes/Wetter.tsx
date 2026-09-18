/**
 * Wetter & Nachrichten (route "/wetter") — ports wetter.html.
 *
 * Fetches same-origin /api/wetter and /api/nachrichten (served by the Lambda via
 * CloudFront in production). Offline / no backend → a friendly error message;
 * the PWA runtime cache (added later) will serve the last-seen response instead.
 */
import { useEffect, useState } from 'react';

interface ForecastDay {
  datum: string;
  symbol: string;
  beschreibung: string;
  maxTemp: number;
  minTemp: number;
}

interface CityWeather {
  ort: string;
  fehler?: string;
  symbol: string;
  temperatur: number;
  beschreibung: string;
  gefuehlt: number;
  luftfeuchtigkeit: number;
  windGeschwindigkeit: number;
  vorhersage?: ForecastDay[];
}

interface NewsItem {
  titel: string;
  link: string;
  datum?: string;
}

interface NewsGroup {
  titel: string;
  fehler?: string;
  eintraege?: NewsItem[];
}

const round = (n: number) => Math.round(n);

function WeatherCard({ w }: { w: CityWeather }) {
  if (w.fehler) {
    return (
      <article className="wx-card">
        <h3>{w.ort}</h3>
        <p className="wx-error">{w.fehler}</p>
      </article>
    );
  }
  return (
    <article className="wx-card">
      <h3>{w.ort}</h3>
      <div className="wx-now">
        <span className="wx-sym">{w.symbol}</span>
        <div>
          <div className="wx-temp">{round(w.temperatur)}°C</div>
          <div className="wx-desc">{w.beschreibung}</div>
        </div>
      </div>
      <ul className="wx-meta">
        <li>
          Gefühlt: <b>{round(w.gefuehlt)}°C</b>
        </li>
        <li>
          Luftfeuchte: <b>{w.luftfeuchtigkeit}%</b>
        </li>
        <li>
          Wind: <b>{round(w.windGeschwindigkeit)} km/h</b>
        </li>
      </ul>
      <div className="wx-forecast">
        {(w.vorhersage || []).map((d, i) => (
          <div className="wx-day" key={i}>
            <span className="wx-day-name">{d.datum}</span>
            <span className="wx-day-sym" title={d.beschreibung}>
              {d.symbol}
            </span>
            <span className="wx-day-temp">
              {round(d.maxTemp)}° / {round(d.minTemp)}°
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function NewsCard({ g }: { g: NewsGroup }) {
  let inner;
  if (g.fehler) {
    inner = <p className="wx-error">{g.fehler}</p>;
  } else if (!g.eintraege || g.eintraege.length === 0) {
    inner = <p className="muted">Keine Schlagzeilen.</p>;
  } else {
    inner = (
      <ul className="news-list">
        {g.eintraege.map((n, i) => (
          <li key={i}>
            <a href={n.link} target="_blank" rel="noopener noreferrer">
              {n.titel}
            </a>
            {n.datum ? <span className="news-date">{n.datum}</span> : null}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <article className="news-card">
      <h3>{g.titel}</h3>
      {inner}
    </article>
  );
}

export default function Wetter() {
  const [weather, setWeather] = useState<CityWeather[] | null>(null);
  const [news, setNews] = useState<NewsGroup[] | null>(null);
  const [wxError, setWxError] = useState(false);
  const [newsError, setNewsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/wetter')
      .then((r) => r.json())
      .then((d: CityWeather[]) => !cancelled && setWeather(d))
      .catch(() => !cancelled && setWxError(true));
    fetch('/api/nachrichten')
      .then((r) => r.json())
      .then((d: NewsGroup[]) => !cancelled && setNews(d))
      .catch(() => !cancelled && setNewsError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="wrap">
      <section>
        <h2 className="section-title">🌤️ Wetter</h2>
        <div className="wx-grid">
          {wxError ? (
            <p className="wx-error">Wetter konnte nicht geladen werden.</p>
          ) : weather === null ? (
            <p className="muted">Wetter wird geladen…</p>
          ) : (
            weather.map((w, i) => <WeatherCard w={w} key={i} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title">📰 Nachrichten</h2>
        <div className="news-grid">
          {newsError ? (
            <p className="wx-error">Nachrichten konnten nicht geladen werden.</p>
          ) : news === null ? (
            <p className="muted">Nachrichten werden geladen…</p>
          ) : (
            news.map((g, i) => <NewsCard g={g} key={i} />)
          )}
        </div>
      </section>
    </main>
  );
}
