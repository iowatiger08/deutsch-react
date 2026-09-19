/**
 * Weather + news proxy Lambda — ports WeatherService and NewsService.
 *
 * Two routes behind a Lambda Function URL (wired to CloudFront as /api/*):
 *   GET /api/wetter       → [CityWeather]  (Open-Meteo, German labels)
 *   GET /api/nachrichten  → [NewsGroup]    (DW + Google News DE, RSS)
 *
 * The browser could call Open-Meteo directly, but the RSS feeds send no CORS
 * headers, so both go through here to keep the client on a single same-origin
 * /api/*. Per-feed try/catch so one bad feed doesn't sink the page.
 */
import { XMLParser } from 'fast-xml-parser';

// ---- Weather (ports WeatherService) ---------------------------------------

const LOCATIONS = [
  { name: 'Des Moines, Iowa', latitude: 41.6005, longitude: -93.6091 },
  { name: 'Hamburg, Deutschland', latitude: 53.5511, longitude: 9.9937 },
];

/** German descriptions for WMO weather interpretation codes. */
const WMO = {
  0: 'Klarer Himmel',
  1: 'Überwiegend klar',
  2: 'Teilweise bewölkt',
  3: 'Bedeckt',
  45: 'Nebel',
  48: 'Reifnebel',
  51: 'Leichter Nieselregen',
  53: 'Mäßiger Nieselregen',
  55: 'Starker Nieselregen',
  56: 'Leichter gefrierender Nieselregen',
  57: 'Starker gefrierender Nieselregen',
  61: 'Leichter Regen',
  63: 'Mäßiger Regen',
  65: 'Starker Regen',
  66: 'Leichter gefrierender Regen',
  67: 'Starker gefrierender Regen',
  71: 'Leichter Schneefall',
  73: 'Mäßiger Schneefall',
  75: 'Starker Schneefall',
  77: 'Schneegriesel',
  80: 'Leichte Regenschauer',
  81: 'Mäßige Regenschauer',
  82: 'Heftige Regenschauer',
  85: 'Leichte Schneeschauer',
  86: 'Starke Schneeschauer',
  95: 'Gewitter',
  96: 'Gewitter mit leichtem Hagel',
  99: 'Gewitter mit starkem Hagel',
};

const describe = (code) => WMO[code] ?? 'Unbekannt';

function symbol(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

/** ISO date (yyyy-MM-dd) → German weekday label, e.g. "Mi. 17.09." */
function formatDay(iso) {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    const days = ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'];
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun
    const wd = days[(dow + 6) % 7];
    const pad = (n) => String(n).padStart(2, '0');
    return `${wd} ${pad(d)}.${pad(m)}.`;
  } catch {
    return iso;
  }
}

function weatherError(loc, msg) {
  return {
    ort: loc.name,
    temperatur: 0,
    gefuehlt: 0,
    luftfeuchtigkeit: 0,
    windGeschwindigkeit: 0,
    beschreibung: '—',
    symbol: '❓',
    vorhersage: [],
    fehler: msg,
  };
}

async function fetchWeather(loc) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${loc.latitude}&longitude=${loc.longitude}` +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
    '&timezone=auto&forecast_days=4';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.status !== 200) {
      return weatherError(loc, `Wetterdienst nicht erreichbar (HTTP ${res.status}).`);
    }
    const root = await res.json();
    // A 200 with no current block means the payload is unusable — surface it as
    // an error rather than fabricating a "0 °C, Klarer Himmel" card.
    if (!root.current || root.current.temperature_2m == null) {
      return weatherError(loc, 'Unvollständige Wetterdaten vom Wetterdienst.');
    }
    const cur = root.current;
    const daily = root.daily ?? {};
    const times = daily.time ?? [];
    const vorhersage = times.map((t, i) => {
      const dCode = daily.weather_code?.[i] ?? 0;
      return {
        datum: formatDay(t),
        maxTemp: daily.temperature_2m_max?.[i] ?? 0,
        minTemp: daily.temperature_2m_min?.[i] ?? 0,
        beschreibung: describe(dCode),
        symbol: symbol(dCode),
      };
    });
    const code = cur.weather_code ?? 0;
    return {
      ort: loc.name,
      temperatur: cur.temperature_2m ?? 0,
      gefuehlt: cur.apparent_temperature ?? 0,
      luftfeuchtigkeit: cur.relative_humidity_2m ?? 0,
      windGeschwindigkeit: cur.wind_speed_10m ?? 0,
      beschreibung: describe(code),
      symbol: symbol(code),
      vorhersage,
      fehler: null,
    };
  } catch (ex) {
    return weatherError(loc, `Wetter konnte nicht geladen werden: ${ex.message}`);
  }
}

const getWeather = () => Promise.all(LOCATIONS.map(fetchWeather));

// ---- News (ports NewsService) ---------------------------------------------

const googleNews = (query) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=de&gl=DE&ceid=DE:de`;

const FEEDS = [
  { titel: 'Deutsche Welle (dw.de)', url: 'https://rss.dw.com/rdf/rss-de-all' },
  { titel: 'Des Moines, Iowa', url: googleNews('"Des Moines" Iowa') },
  { titel: 'Hamburg, Deutschland', url: googleNews('Hamburg') },
];

const MAX_ITEMS = 8;

// removeNSPrefix maps rdf:RDF→RDF and dc:date→date so RSS 1.0 (DW) and RSS 2.0
// (Google News) parse the same way. Attributes are kept (attributeNamePrefix
// "@_") so Atom <link href="…"> can be read; elements without attributes still
// come through as plain strings, and asText handles the "#text" wrapper.
const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, trimValues: true });

const asText = (v) => {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object' && '#text' in v) return String(v['#text']).trim();
  return String(v).trim();
};

const firstNonBlank = (...vals) => vals.map(asText).find((s) => s) ?? '';

// Link extraction that covers RSS (<link>text</link>) and Atom
// (<link href="…" rel="alternate"/>, possibly several per entry).
function linkOne(l) {
  if (l == null) return '';
  if (typeof l === 'string') return l.trim();
  if (typeof l === 'object') return String(l['@_href'] ?? l['#text'] ?? '').trim();
  return String(l).trim();
}

function linkOf(it) {
  const l = it.link;
  if (Array.isArray(l)) {
    const alt = l.find((x) => x && x['@_rel'] === 'alternate') ?? l.find((x) => linkOne(x)) ?? l[0];
    return linkOne(alt);
  }
  return linkOne(l);
}

function parseItems(xml) {
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item ?? doc?.RDF?.item ?? doc?.feed?.entry ?? [];
  const items = Array.isArray(raw) ? raw : [raw];
  const out = [];
  for (const it of items) {
    if (out.length >= MAX_ITEMS) break;
    const titel = asText(it.title);
    if (!titel) continue;
    out.push({
      titel,
      link: linkOf(it),
      datum: firstNonBlank(it.pubDate, it.date),
    });
  }
  return out;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Mozilla/5.0 (Deutsch-Study-App)',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (res.status !== 200) {
      return { titel: feed.titel, eintraege: [], fehler: `Feed nicht erreichbar (HTTP ${res.status}).` };
    }
    return { titel: feed.titel, eintraege: parseItems(await res.text()), fehler: null };
  } catch (ex) {
    return {
      titel: feed.titel,
      eintraege: [],
      fehler: `Nachrichten konnten nicht geladen werden: ${ex.message}`,
    };
  }
}

const getNews = () => Promise.all(FEEDS.map(fetchFeed));

// ---- Lambda Function URL handler ------------------------------------------

// Shared response headers. no-store keeps browsers/intermediaries from serving
// stale weather/news; the PWA's own NetworkFirst cache (Cache Storage, not the
// HTTP cache) still holds the last response for offline. Permissive CORS so the
// endpoint can be curl-tested directly and error bodies are readable.
const CORS_JSON = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const respond = (statusCode, body) => ({
  statusCode,
  headers: CORS_JSON,
  body: JSON.stringify(body),
});

export async function handler(event) {
  const path = event?.requestContext?.http?.path ?? event?.rawPath ?? '';
  if (path.endsWith('/api/wetter')) return respond(200, await getWeather());
  if (path.endsWith('/api/nachrichten')) return respond(200, await getNews());
  return respond(404, { error: `Not found: ${path}` });
}
