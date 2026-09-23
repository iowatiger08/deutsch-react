/**
 * Vokabeln (route "/vokabeln") — ports vokabeln.html.
 *
 * Static reference: days / months / seasons / weather / colors tables, the
 * "Der Körper" body panel (see BodyFigure), and the Queer & LGBTQ+ panel, with
 * a sticky anchor menubar jumping to each panel.
 */
import { Link } from 'react-router-dom';
import BodyFigure from '../components/BodyFigure';
import TableSetting from '../components/TableSetting';

const TAGE: [string, string][] = [
  ['Montag', 'Monday'],
  ['Dienstag', 'Tuesday'],
  ['Mittwoch', 'Wednesday'],
  ['Donnerstag', 'Thursday'],
  ['Freitag', 'Friday'],
  ['Samstag', 'Saturday'],
  ['Sonntag', 'Sunday'],
];

const MONATE: [string, string][] = [
  ['Januar', 'January'],
  ['Februar', 'February'],
  ['März', 'March'],
  ['April', 'April'],
  ['Mai', 'May'],
  ['Juni', 'June'],
  ['Juli', 'July'],
  ['August', 'August'],
  ['September', 'September'],
  ['Oktober', 'October'],
  ['November', 'November'],
  ['Dezember', 'December'],
];

const JAHRESZEITEN: [string, string][] = [
  ['der Frühling', 'spring'],
  ['der Sommer', 'summer'],
  ['der Herbst', 'autumn / fall'],
  ['der Winter', 'winter'],
];

// [noun, gloss, adjective, adjGloss]
const WETTER: [string, string, string, string][] = [
  ['die Sonne', 'sun', 'sonnig', 'sunny'],
  ['der Regen', 'rain', 'regnerisch', 'rainy'],
  ['der Schnee', 'snow', 'verschneit', 'snowy'],
  ['die Wolke', 'cloud', 'bewölkt', 'cloudy'],
  ['der Wind', 'wind', 'windig', 'windy'],
  ['der Nebel', 'fog', 'neblig', 'foggy'],
  ['das Gewitter', 'thunderstorm', 'warm', 'warm'],
  ['der Sturm', 'storm', 'kalt', 'cold'],
  ['der Hagel', 'hail', 'heiß', 'hot'],
  ['die Temperatur', 'temperature', 'kühl', 'cool'],
];

// [colorLeft, deLeft, enLeft, colorRight, deRight, enRight]
const FARBEN: [string, string, string, string, string, string][] = [
  ['#e5322b', 'rot', 'red', '#7d4bd6', 'violett', 'violet'],
  ['#e8862e', 'orange', 'orange', '#8b5a2b', 'braun', 'brown'],
  ['#f4d03f', 'gelb', 'yellow', '#e8dcc0', 'beige', 'beige'],
  ['#3fae5a', 'grün', 'green', '#8b93a4', 'grau', 'gray'],
  ['#6cc4f5', 'hellblau', 'light blue', '#111318', 'schwarz', 'black'],
  ['#3b7de3', 'blau', 'blue', '#f5f6f8', 'weiß', 'white'],
  ['#1f3a93', 'dunkelblau', 'dark blue', '#d4af37', 'gold', 'gold'],
  ['#8e44ad', 'lila', 'purple', '#c0c4cc', 'silber', 'silver'],
  ['#f48fb1', 'rosa', 'pink', '#29c1b6', 'türkis', 'turquoise'],
];

// [deLeft, enLeft, deRight, enRight]
const QUEER: [string, string, string, string][] = [
  ['queer', 'queer', 'die sexuelle Orientierung', 'sexual orientation'],
  ['schwul', 'gay (male)', 'die Geschlechtsidentität', 'gender identity'],
  ['lesbisch', 'lesbian', 'das Geschlecht', 'gender / sex'],
  ['bisexuell', 'bisexual', 'das Pronomen', 'pronoun'],
  ['pansexuell', 'pansexual', 'das Coming-out', 'coming out'],
  ['asexuell', 'asexual', 'die Regenbogenfahne', 'rainbow flag'],
  ['transgeschlechtlich', 'transgender', 'der Christopher Street Day', 'Pride march (CSD)'],
  ['nicht-binär', 'non-binary', 'die Ehe für alle', 'marriage equality'],
  ['intergeschlechtlich', 'intersex', 'die Vielfalt', 'diversity'],
  ['cisgeschlechtlich', 'cisgender', 'die Akzeptanz', 'acceptance'],
  ['homosexuell', 'homosexual', 'die queere Gemeinschaft', 'the queer community'],
  ['heterosexuell', 'heterosexual / straight', 'die Homophobie', 'homophobia'],
];

// [de, en] pairs for the "An der Bar" panel — ordering phrases and drinks/snacks.
const BAR_PHRASEN: [string, string][] = [
  ['Was darf es sein?', "What can I get you?"],
  ['Ich hätte gern ein Bier.', "I'd like a beer."],
  ['Ein Glas Wein, bitte.', 'A glass of wine, please.'],
  ['Was haben Sie vom Fass?', 'What do you have on tap?'],
  ['Was können Sie empfehlen?', 'What do you recommend?'],
  ['Ich nehme dasselbe.', "I'll have the same."],
  ['Noch eins, bitte!', 'One more, please!'],
  ['Eine Runde für alle!', 'A round for everyone!'],
  ['Zahlen, bitte!', 'The bill, please!'],
  ['Stimmt so.', 'Keep the change.'],
  ['Prost! / Zum Wohl!', 'Cheers!'],
  ['Auf ex!', 'Bottoms up!'],
];

const BIER: [string, string][] = [
  ['das Bier', 'beer'],
  ['das Pils', 'pilsner'],
  ['das Helle', 'pale lager'],
  ['das Weizen / Weißbier', 'wheat beer'],
  ['das Dunkle', 'dark lager'],
  ['vom Fass', 'on tap / draft'],
  ['die Maß', 'one-litre mug'],
  ['das Radler', 'shandy (beer + lemonade)'],
  ['das alkoholfreie Bier', 'non-alcoholic beer'],
];

const WEIN: [string, string][] = [
  ['der Rotwein', 'red wine'],
  ['der Weißwein', 'white wine'],
  ['der Roséwein', 'rosé wine'],
  ['der Sekt', 'sparkling wine'],
  ['die Weinschorle', 'wine spritzer'],
  ['trocken', 'dry'],
  ['halbtrocken', 'medium-dry'],
  ['lieblich / süß', 'sweet'],
  ['das Glas / die Flasche', 'glass / bottle'],
];

const SCHNAPS: [string, string][] = [
  ['der Schnaps', 'schnapps / spirit'],
  ['der Kurze', 'a shot'],
  ['der Wodka', 'vodka'],
  ['der Korn', 'grain schnapps'],
  ['Berliner Luft', 'peppermint schnapps (Berlin)'],
  ['Rumpleminze', 'strong peppermint schnapps'],
  ['der Jägermeister', 'herbal liqueur (Jägermeister)'],
  ['der Obstler', 'fruit schnapps'],
  ['der Kräuterlikör', 'herbal liqueur'],
];

const SNACKS: [string, string][] = [
  ['die Vorspeise', 'appetizer / starter'],
  ['die Brezel', 'pretzel'],
  ['die Currywurst', 'curried sausage'],
  ['die Pommes (frites)', 'fries'],
  ['die Nüsse', 'nuts'],
  ['die Oliven', 'olives'],
  ['der Käseteller', 'cheese plate'],
  ['die Brotzeit', 'cold snack platter'],
];

function PairTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="chart">
      <tbody>
        {rows.map(([de, en]) => (
          <tr key={de}>
            <td className="de-form">{de}</td>
            <td className="gloss">{en}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Vokabeln() {
  return (
    <main className="wrap">
      <nav className="anchor-menu" aria-label="Schnellzugriff auf Panels">
        <a href="#tage">📅 Tage</a>
        <a href="#monate">🗓️ Monate</a>
        <a href="#jahreszeiten">🍂 Jahreszeiten</a>
        <a href="#wetter">🌦️ Wetter</a>
        <a href="#farben">🎨 Farben</a>
        <a href="#koerper">🧍 Körper</a>
        <a href="#gedeck">🍽️ Gedeck</a>
        <a href="#bar">🍻 An der Bar</a>
        <a href="#queer">🏳️‍🌈 Queer</a>
      </nav>

      <div className="vocab-grid">
        <section className="vocab-panel" id="tage">
          <h2>
            📅 Tage der Woche <span className="gloss">(days of the week)</span>
          </h2>
          <PairTable rows={TAGE} />
          <p className="hint">
            Alle Tage sind maskulin: <b>der</b> Montag. „am Montag“ = on Monday.
          </p>
        </section>

        <section className="vocab-panel" id="monate">
          <h2>
            🗓️ Monate <span className="gloss">(months)</span>
          </h2>
          <PairTable rows={MONATE} />
          <p className="hint">
            Auch maskulin: <b>der</b> Januar. „im Mai“ = in May.
          </p>
        </section>

        <section className="vocab-panel" id="jahreszeiten">
          <h2>
            🍂 Jahreszeiten <span className="gloss">(seasons)</span>
          </h2>
          <PairTable rows={JAHRESZEITEN} />
          <p className="hint">„im Sommer“ = in summer.</p>
        </section>

        <section className="vocab-panel wide" id="wetter">
          <h2>
            🌦️ Wetter <span className="gloss">(weather)</span>
          </h2>
          <table className="chart">
            <tbody>
              {WETTER.map(([noun, gloss, adj, adjGloss]) => (
                <tr key={noun}>
                  <td className="de-form">{noun}</td>
                  <td className="gloss">{gloss}</td>
                  <td className="de-form">{adj}</td>
                  <td className="gloss">{adjGloss}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint">
            Frage: „Wie ist das Wetter?“ — Antwort: „Es ist sonnig / es regnet / es schneit.“
            Live-Wetter unter{' '}
            <Link className="inline-link" to="/wetter">
              Wetter &amp; Nachrichten
            </Link>
            .
          </p>
        </section>

        <section className="vocab-panel wide" id="farben">
          <h2>
            🎨 Farben <span className="gloss">(colors)</span>
          </h2>
          <table className="chart">
            <tbody>
              {FARBEN.map(([cL, deL, enL, cR, deR, enR]) => (
                <tr key={deL}>
                  <td className="sw">
                    <span className="swatch" style={{ background: cL }} />
                  </td>
                  <td className="de-form">{deL}</td>
                  <td className="gloss">{enL}</td>
                  <td className="sw">
                    <span className="swatch" style={{ background: cR }} />
                  </td>
                  <td className="de-form">{deR}</td>
                  <td className="gloss">{enR}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint">
            „Welche Farbe ist das?“ = What color is that? — Farben sind Adjektive: „ein{' '}
            <b>rotes</b> Auto“, „die <b>blaue</b> Tür“. „<b>hell-</b>“ = light, „<b>dunkel-</b>“ =
            dark.
          </p>
        </section>

        <section className="vocab-panel wide" id="koerper">
          <h2>
            🧍 Der Körper <span className="gloss">(the human body)</span>
          </h2>
          <BodyFigure />
          <p className="hint">
            Frage: „Wo tut es weh?“ = Where does it hurt? — „Mein Kopf tut weh.“ = My head hurts.
            Merke die Artikel: <b>der</b> (m.), <b>die</b> (f.), <b>das</b> (n.).
          </p>
        </section>

        <section className="vocab-panel wide" id="gedeck">
          <h2>
            🍽️ Das Gedeck <span className="gloss">(a table setting)</span>
          </h2>
          <TableSetting />
          <p className="hint">
            „Der Tisch ist gedeckt.“ = The table is set. Merke: <b>der Teller</b> = the plate you
            eat from; <b>die Platte</b> = a serving platter („kalte Platte"). „Guten Appetit!“
          </p>
        </section>

        <section className="vocab-panel wide" id="bar">
          <h2>
            🍻 An der Bar <span className="gloss">(at the bar — ordering drinks)</span>
          </h2>

          <h3>
            Bestellen &amp; Fragen <span className="gloss">(ordering &amp; questions)</span>
          </h3>
          <PairTable rows={BAR_PHRASEN} />

          <h3>
            🍺 Bier <span className="gloss">(beer)</span>
          </h3>
          <PairTable rows={BIER} />

          <h3>
            🍷 Wein <span className="gloss">(wine)</span>
          </h3>
          <PairTable rows={WEIN} />

          <h3>
            🥃 Schnaps &amp; Kurze <span className="gloss">(shots &amp; spirits)</span>
          </h3>
          <PairTable rows={SCHNAPS} />

          <h3>
            🥨 Vorspeisen &amp; Snacks <span className="gloss">(appetizers &amp; snacks)</span>
          </h3>
          <PairTable rows={SNACKS} />

          <p className="hint">
            „Prost!“ / „Zum Wohl!“ = Cheers! — beim Anstoßen in die Augen schauen (look each other in
            the eye when clinking glasses). „Was darf es sein?“ = What'll it be? „Zahlen, bitte!“ =
            The bill, please! „Stimmt so.“ = Keep the change.
          </p>
        </section>

        <section className="vocab-panel wide" id="queer">
          <h2>
            🏳️‍🌈 Queer &amp; LGBTQ+{' '}
            <span className="gloss">(Identität &amp; Gemeinschaft / identity &amp; community)</span>
          </h2>
          <table className="chart">
            <tbody>
              {QUEER.map(([deL, enL, deR, enR]) => (
                <tr key={deL}>
                  <td className="de-form">{deL}</td>
                  <td className="gloss">{enL}</td>
                  <td className="de-form">{deR}</td>
                  <td className="gloss">{enR}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint">
            Left column: Adjektive der Orientierung/Identität (adjectives — no article). Right
            column: Nomen mit Artikel. „Ich bin …“ = I am …; „meine Pronomen sind …“ = my pronouns
            are …
          </p>
        </section>
      </div>
    </main>
  );
}
