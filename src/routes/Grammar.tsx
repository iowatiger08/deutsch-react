/**
 * Grammar (route "/grammar") — ports grammar.html.
 *
 * Static conjugation / declension charts as JSX, a chart-nav jump menu, the
 * gallery of the 33 study-sheet PNGs (served from /pages), and a click-to-enlarge
 * lightbox (click or Esc to close).
 */
import { useEffect, useState } from 'react';

// The 33 study-sheet pages live in public/pages as page-01.png … page-33.png.
const PAGE_IMAGES = Array.from(
  { length: 33 },
  (_, i) => `/pages/page-${String(i + 1).padStart(2, '0')}.png`,
);

export default function Grammar() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <main className="wrap">
      <section className="reference">
        <nav className="chart-nav">
          <a href="#artikel">Artikel &amp; Genus</a>
          <a href="#regelmaessig">Regelmäßige Verben</a>
          <a href="#unregelmaessig">sein · haben · werden · möchten</a>
          <a href="#praeteritum">Präteritum</a>
          <a href="#modal">Modalverben</a>
          <a href="#stark">Starke Verben</a>
          <a href="#perfekt">Perfekt</a>
          <a href="#partizip">Partizip II</a>
          <a href="#praeteritum-voll">Präteritum (Formen)</a>
          <a href="#plusquamperfekt">Plusquamperfekt</a>
        </nav>

        {/* ARTICLES & GENDER */}
        <h2 className="section-title" id="artikel">
          🔤 Artikel &amp; Genus <span className="muted">— gender article variations</span>
        </h2>

        <div className="chart-block">
          <h3>
            Bestimmter Artikel <span className="gloss">(definite — “the”)</span>
          </h3>
          <p className="hint">
            Same word, four cases. Watch how <b>der</b> shifts by case and gender.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Kasus</th>
                  <th>Maskulin</th>
                  <th>Feminin</th>
                  <th>Neutrum</th>
                  <th>Plural</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Nominativ</th>
                  <td className="de-form">der</td>
                  <td className="de-form">die</td>
                  <td className="de-form">das</td>
                  <td className="de-form">die</td>
                </tr>
                <tr>
                  <th scope="row">Akkusativ</th>
                  <td className="de-form">den</td>
                  <td className="de-form">die</td>
                  <td className="de-form">das</td>
                  <td className="de-form">die</td>
                </tr>
                <tr>
                  <th scope="row">Dativ</th>
                  <td className="de-form">dem</td>
                  <td className="de-form">der</td>
                  <td className="de-form">dem</td>
                  <td className="de-form">den</td>
                </tr>
                <tr>
                  <th scope="row">Genitiv</th>
                  <td className="de-form">des</td>
                  <td className="de-form">der</td>
                  <td className="de-form">des</td>
                  <td className="de-form">der</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-block">
          <h3>
            Unbestimmter Artikel „ein“ &amp; Verneinung „kein“ <span className="gloss">(a / no)</span>
          </h3>
          <p className="hint">
            Each cell shows <b>ein</b>-form&nbsp;/&nbsp;<b>kein</b>-form. „ein“ has no plural; „kein“
            does.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Kasus</th>
                  <th>Maskulin</th>
                  <th>Feminin</th>
                  <th>Neutrum</th>
                  <th>Plural</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Nominativ</th>
                  <td className="de-form">ein / kein</td>
                  <td className="de-form">eine / keine</td>
                  <td className="de-form">ein / kein</td>
                  <td className="de-form">— / keine</td>
                </tr>
                <tr>
                  <th scope="row">Akkusativ</th>
                  <td className="de-form">einen / keinen</td>
                  <td className="de-form">eine / keine</td>
                  <td className="de-form">ein / kein</td>
                  <td className="de-form">— / keine</td>
                </tr>
                <tr>
                  <th scope="row">Dativ</th>
                  <td className="de-form">einem / keinem</td>
                  <td className="de-form">einer / keiner</td>
                  <td className="de-form">einem / keinem</td>
                  <td className="de-form">— / keinen</td>
                </tr>
                <tr>
                  <th scope="row">Genitiv</th>
                  <td className="de-form">eines / keines</td>
                  <td className="de-form">einer / keiner</td>
                  <td className="de-form">eines / keines</td>
                  <td className="de-form">— / keiner</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-block">
          <h3>
            Personalpronomen <span className="gloss">(personal pronouns by case)</span>
          </h3>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Kasus</th>
                  <th>ich</th>
                  <th>du</th>
                  <th>er</th>
                  <th>sie</th>
                  <th>es</th>
                  <th>wir</th>
                  <th>ihr</th>
                  <th>sie/Sie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Nominativ</th>
                  <td className="de-form">ich</td>
                  <td className="de-form">du</td>
                  <td className="de-form">er</td>
                  <td className="de-form">sie</td>
                  <td className="de-form">es</td>
                  <td className="de-form">wir</td>
                  <td className="de-form">ihr</td>
                  <td className="de-form">sie/Sie</td>
                </tr>
                <tr>
                  <th scope="row">Akkusativ</th>
                  <td className="de-form">mich</td>
                  <td className="de-form">dich</td>
                  <td className="de-form">ihn</td>
                  <td className="de-form">sie</td>
                  <td className="de-form">es</td>
                  <td className="de-form">uns</td>
                  <td className="de-form">euch</td>
                  <td className="de-form">sie/Sie</td>
                </tr>
                <tr>
                  <th scope="row">Dativ</th>
                  <td className="de-form">mir</td>
                  <td className="de-form">dir</td>
                  <td className="de-form">ihm</td>
                  <td className="de-form">ihr</td>
                  <td className="de-form">ihm</td>
                  <td className="de-form">uns</td>
                  <td className="de-form">euch</td>
                  <td className="de-form">ihnen/Ihnen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* REGULAR VERBS */}
        <h2 className="section-title" id="regelmaessig">
          ✍️ Verben — Präsens <span className="muted">— basic verb conjugation</span>
        </h2>

        <div className="chart-block">
          <h3>
            Regelmäßige (schwache) Verben <span className="gloss">(regular — present tense)</span>
          </h3>
          <p className="hint">
            Drop <b>-en</b> from the infinitive, add the ending. Examples: <i>spielen</i> (to play),{' '}
            <i>machen</i> (to do), <i>wohnen</i> (to live).
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>Endung</th>
                  <th>spielen</th>
                  <th>machen</th>
                  <th>wohnen</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ich</th>
                  <td className="ending">-e</td>
                  <td className="de-form">spiele</td>
                  <td className="de-form">mache</td>
                  <td className="de-form">wohne</td>
                </tr>
                <tr>
                  <th scope="row">du</th>
                  <td className="ending">-st</td>
                  <td className="de-form">spielst</td>
                  <td className="de-form">machst</td>
                  <td className="de-form">wohnst</td>
                </tr>
                <tr>
                  <th scope="row">er/sie/es</th>
                  <td className="ending">-t</td>
                  <td className="de-form">spielt</td>
                  <td className="de-form">macht</td>
                  <td className="de-form">wohnt</td>
                </tr>
                <tr>
                  <th scope="row">wir</th>
                  <td className="ending">-en</td>
                  <td className="de-form">spielen</td>
                  <td className="de-form">machen</td>
                  <td className="de-form">wohnen</td>
                </tr>
                <tr>
                  <th scope="row">ihr</th>
                  <td className="ending">-t</td>
                  <td className="de-form">spielt</td>
                  <td className="de-form">macht</td>
                  <td className="de-form">wohnt</td>
                </tr>
                <tr>
                  <th scope="row">sie/Sie</th>
                  <td className="ending">-en</td>
                  <td className="de-form">spielen</td>
                  <td className="de-form">machen</td>
                  <td className="de-form">wohnen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* IRREGULAR: sein / haben / werden */}
        <div className="chart-block" id="unregelmaessig">
          <h3>
            Unregelmäßig: <i>sein</i>, <i>haben</i>, <i>werden</i> und <i>möchten</i>{' '}
            <span className="gloss">(the essential irregulars — present)</span>
          </h3>
          <p className="hint">
            The most common irregular verbs. <i>sein</i> = to be, <i>haben</i> = to have,{' '}
            <i>werden</i> = to become / will, <i>möchten</i> = would like (the polite Konjunktiv II
            of <i>mögen</i> — see <a href="#modal">Modalverben</a>).
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>
                    sein <span className="gloss">(to be)</span>
                  </th>
                  <th>
                    haben <span className="gloss">(to have)</span>
                  </th>
                  <th>
                    werden <span className="gloss">(to become)</span>
                  </th>
                  <th>
                    möchten <span className="gloss">(would like)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ich</th>
                  <td className="de-form">bin</td>
                  <td className="de-form">habe</td>
                  <td className="de-form">werde</td>
                  <td className="de-form">möchte</td>
                </tr>
                <tr>
                  <th scope="row">du</th>
                  <td className="de-form">bist</td>
                  <td className="de-form">hast</td>
                  <td className="de-form">wirst</td>
                  <td className="de-form">möchtest</td>
                </tr>
                <tr>
                  <th scope="row">er/sie/es</th>
                  <td className="de-form">ist</td>
                  <td className="de-form">hat</td>
                  <td className="de-form">wird</td>
                  <td className="de-form">möchte</td>
                </tr>
                <tr>
                  <th scope="row">wir</th>
                  <td className="de-form">sind</td>
                  <td className="de-form">haben</td>
                  <td className="de-form">werden</td>
                  <td className="de-form">möchten</td>
                </tr>
                <tr>
                  <th scope="row">ihr</th>
                  <td className="de-form">seid</td>
                  <td className="de-form">habt</td>
                  <td className="de-form">werdet</td>
                  <td className="de-form">möchtet</td>
                </tr>
                <tr>
                  <th scope="row">sie/Sie</th>
                  <td className="de-form">sind</td>
                  <td className="de-form">haben</td>
                  <td className="de-form">werden</td>
                  <td className="de-form">möchten</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PRÄTERITUM sein / haben */}
        <div className="chart-block" id="praeteritum">
          <h3>
            Präteritum: <i>sein</i> &amp; <i>haben</i>{' '}
            <span className="gloss">(simple past — very common)</span>
          </h3>
          <p className="hint">
            These two are used in the simple past far more than most verbs — worth memorizing.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>
                    sein → <i>war</i>
                  </th>
                  <th>
                    haben → <i>hatte</i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ich</th>
                  <td className="de-form">war</td>
                  <td className="de-form">hatte</td>
                </tr>
                <tr>
                  <th scope="row">du</th>
                  <td className="de-form">warst</td>
                  <td className="de-form">hattest</td>
                </tr>
                <tr>
                  <th scope="row">er/sie/es</th>
                  <td className="de-form">war</td>
                  <td className="de-form">hatte</td>
                </tr>
                <tr>
                  <th scope="row">wir</th>
                  <td className="de-form">waren</td>
                  <td className="de-form">hatten</td>
                </tr>
                <tr>
                  <th scope="row">ihr</th>
                  <td className="de-form">wart</td>
                  <td className="de-form">hattet</td>
                </tr>
                <tr>
                  <th scope="row">sie/Sie</th>
                  <td className="de-form">waren</td>
                  <td className="de-form">hatten</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL VERBS */}
        <div className="chart-block" id="modal">
          <h3>
            Modalverben <span className="gloss">(modal verbs — present)</span>
          </h3>
          <p className="hint">
            Note the vowel change in the singular and the identical <b>ich</b>/<b>er</b> forms.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>
                    können <span className="gloss">(can)</span>
                  </th>
                  <th>
                    müssen <span className="gloss">(must)</span>
                  </th>
                  <th>
                    wollen <span className="gloss">(want)</span>
                  </th>
                  <th>
                    sollen <span className="gloss">(should)</span>
                  </th>
                  <th>
                    dürfen <span className="gloss">(may)</span>
                  </th>
                  <th>
                    mögen <span className="gloss">(like)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ich</th>
                  <td className="de-form">kann</td>
                  <td className="de-form">muss</td>
                  <td className="de-form">will</td>
                  <td className="de-form">soll</td>
                  <td className="de-form">darf</td>
                  <td className="de-form">mag</td>
                </tr>
                <tr>
                  <th scope="row">du</th>
                  <td className="de-form">kannst</td>
                  <td className="de-form">musst</td>
                  <td className="de-form">willst</td>
                  <td className="de-form">sollst</td>
                  <td className="de-form">darfst</td>
                  <td className="de-form">magst</td>
                </tr>
                <tr>
                  <th scope="row">er/sie/es</th>
                  <td className="de-form">kann</td>
                  <td className="de-form">muss</td>
                  <td className="de-form">will</td>
                  <td className="de-form">soll</td>
                  <td className="de-form">darf</td>
                  <td className="de-form">mag</td>
                </tr>
                <tr>
                  <th scope="row">wir</th>
                  <td className="de-form">können</td>
                  <td className="de-form">müssen</td>
                  <td className="de-form">wollen</td>
                  <td className="de-form">sollen</td>
                  <td className="de-form">dürfen</td>
                  <td className="de-form">mögen</td>
                </tr>
                <tr>
                  <th scope="row">ihr</th>
                  <td className="de-form">könnt</td>
                  <td className="de-form">müsst</td>
                  <td className="de-form">wollt</td>
                  <td className="de-form">sollt</td>
                  <td className="de-form">dürft</td>
                  <td className="de-form">mögt</td>
                </tr>
                <tr>
                  <th scope="row">sie/Sie</th>
                  <td className="de-form">können</td>
                  <td className="de-form">müssen</td>
                  <td className="de-form">wollen</td>
                  <td className="de-form">sollen</td>
                  <td className="de-form">dürfen</td>
                  <td className="de-form">mögen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* STRONG / STEM-CHANGING VERBS */}
        <div className="chart-block" id="stark">
          <h3>
            Starke Verben mit Vokalwechsel{' '}
            <span className="gloss">(strong verbs — stem vowel change in du / er)</span>
          </h3>
          <p className="hint">
            The stem vowel changes only in the <b>du</b> and <b>er/sie/es</b> forms.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>
                    fahren <span className="gloss">(a→ä)</span>
                  </th>
                  <th>
                    essen <span className="gloss">(e→i)</span>
                  </th>
                  <th>
                    sehen <span className="gloss">(e→ie)</span>
                  </th>
                  <th>
                    nehmen <span className="gloss">(to take)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ich</th>
                  <td className="de-form">fahre</td>
                  <td className="de-form">esse</td>
                  <td className="de-form">sehe</td>
                  <td className="de-form">nehme</td>
                </tr>
                <tr>
                  <th scope="row">du</th>
                  <td className="de-form hl">fährst</td>
                  <td className="de-form hl">isst</td>
                  <td className="de-form hl">siehst</td>
                  <td className="de-form hl">nimmst</td>
                </tr>
                <tr>
                  <th scope="row">er/sie/es</th>
                  <td className="de-form hl">fährt</td>
                  <td className="de-form hl">isst</td>
                  <td className="de-form hl">sieht</td>
                  <td className="de-form hl">nimmt</td>
                </tr>
                <tr>
                  <th scope="row">wir</th>
                  <td className="de-form">fahren</td>
                  <td className="de-form">essen</td>
                  <td className="de-form">sehen</td>
                  <td className="de-form">nehmen</td>
                </tr>
                <tr>
                  <th scope="row">ihr</th>
                  <td className="de-form">fahrt</td>
                  <td className="de-form">esst</td>
                  <td className="de-form">seht</td>
                  <td className="de-form">nehmt</td>
                </tr>
                <tr>
                  <th scope="row">sie/Sie</th>
                  <td className="de-form">fahren</td>
                  <td className="de-form">essen</td>
                  <td className="de-form">sehen</td>
                  <td className="de-form">nehmen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PAST / COMPOUND TENSES */}
        <h2 className="section-title" id="perfekt">
          🕐 Vergangenheit <span className="muted">— past &amp; compound tenses</span>
        </h2>

        <div className="chart-block">
          <h3>
            Perfekt <span className="gloss">(present perfect — the spoken past)</span>
          </h3>
          <p className="hint">
            Present tense of <b>haben</b> or <b>sein</b> + the Partizip II, which goes to the end of
            the clause. Use <b>sein</b> for verbs of motion / change of state; <b>haben</b> otherwise.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>
                    machen → <i>habe … gemacht</i>
                  </th>
                  <th>
                    gehen → <i>bin … gegangen</i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['ich', 'habe', 'bin'],
                    ['du', 'hast', 'bist'],
                    ['er/sie/es', 'hat', 'ist'],
                    ['wir', 'haben', 'sind'],
                    ['ihr', 'habt', 'seid'],
                    ['sie/Sie', 'haben', 'sind'],
                  ] as [string, string, string][]
                ).map(([pron, hAux, sAux]) => (
                  <tr key={pron}>
                    <th scope="row">{pron}</th>
                    <td>
                      <span className="ending">{hAux}</span>{' '}
                      <span className="de-form hl">gemacht</span>
                    </td>
                    <td>
                      <span className="ending">{sAux}</span>{' '}
                      <span className="de-form hl">gegangen</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-block" id="partizip">
          <h3>
            Partizip II — Bildung <span className="gloss">(past-participle formation)</span>
          </h3>
          <p className="hint">
            Verbs ending in <b>-ieren</b> and inseparable prefixes (be-, ver-, ent-…) take <b>no</b>{' '}
            <i>ge-</i>. Separable prefixes insert it: aufmachen → auf<b>ge</b>macht.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Typ</th>
                  <th>Muster</th>
                  <th>Beispiel</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Regelmäßig</th>
                  <td className="ending">ge- + Stamm + -t</td>
                  <td>
                    machen → <span className="de-form hl">gemacht</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Stark</th>
                  <td className="ending">ge- + Stamm(+Vokal) + -en</td>
                  <td>
                    sehen → <span className="de-form hl">gesehen</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Gemischt</th>
                  <td className="ending">ge- + neuer Stamm + -t</td>
                  <td>
                    bringen → <span className="de-form hl">gebracht</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">kein ge-</th>
                  <td className="ending">Stamm + -t / -en</td>
                  <td>
                    studieren → <span className="de-form hl">studiert</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: 14 }}>
            Häufige Partizipien{' '}
            <span className="gloss">
              (common participles — infinitive · auxiliary · Partizip II)
            </span>
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Infinitiv</th>
                  <th>Hilfsverb</th>
                  <th>Partizip II</th>
                  <th>English</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['sein', 'sein', 'gewesen', 'been'],
                    ['haben', 'haben', 'gehabt', 'had'],
                    ['werden', 'sein', 'geworden', 'become'],
                    ['gehen', 'sein', 'gegangen', 'gone'],
                    ['fahren', 'sein', 'gefahren', 'driven / gone'],
                    ['kommen', 'sein', 'gekommen', 'come'],
                    ['bleiben', 'sein', 'geblieben', 'stayed'],
                    ['essen', 'haben', 'gegessen', 'eaten'],
                    ['trinken', 'haben', 'getrunken', 'drunk'],
                    ['sehen', 'haben', 'gesehen', 'seen'],
                    ['nehmen', 'haben', 'genommen', 'taken'],
                    ['geben', 'haben', 'gegeben', 'given'],
                    ['sprechen', 'haben', 'gesprochen', 'spoken'],
                    ['schreiben', 'haben', 'geschrieben', 'written'],
                    ['lesen', 'haben', 'gelesen', 'read'],
                    ['finden', 'haben', 'gefunden', 'found'],
                    ['bringen', 'haben', 'gebracht', 'brought'],
                    ['denken', 'haben', 'gedacht', 'thought'],
                  ] as [string, string, string, string][]
                ).map(([inf, aux, part, en]) => (
                  <tr key={inf}>
                    <th scope="row">{inf}</th>
                    <td className="ending">{aux}</td>
                    <td className="de-form">{part}</td>
                    <td className="gloss">{en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-block" id="praeteritum-voll">
          <h3>
            Präteritum — Formen <span className="gloss">(simple past — written / narrative)</span>
          </h3>
          <p className="hint">
            Weak verbs insert <b>-te-</b>; strong verbs change the stem vowel and take <b>no ending</b>{' '}
            in ich / er.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>Endung (schwach)</th>
                  <th>machen</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['ich', '-te', 'machte'],
                    ['du', '-test', 'machtest'],
                    ['er/sie/es', '-te', 'machte'],
                    ['wir', '-ten', 'machten'],
                    ['ihr', '-tet', 'machtet'],
                    ['sie/Sie', '-ten', 'machten'],
                  ] as [string, string, string][]
                ).map(([pron, end, form]) => (
                  <tr key={pron}>
                    <th scope="row">{pron}</th>
                    <td className="ending">{end}</td>
                    <td className="de-form">{form}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: 14 }}>
            Starke Verben — Stamm (ich / er){' '}
            <span className="gloss">then add —, -st, —, -en, -t, -en</span>
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Infinitiv</th>
                  <th>Präteritum (ich/er)</th>
                  <th>English</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['gehen', 'ging', 'went'],
                    ['fahren', 'fuhr', 'drove'],
                    ['kommen', 'kam', 'came'],
                    ['sehen', 'sah', 'saw'],
                    ['essen', 'aß', 'ate'],
                    ['nehmen', 'nahm', 'took'],
                    ['geben', 'gab', 'gave'],
                    ['sprechen', 'sprach', 'spoke'],
                    ['finden', 'fand', 'found'],
                    ['schreiben', 'schrieb', 'wrote'],
                  ] as [string, string, string][]
                ).map(([inf, prat, en]) => (
                  <tr key={inf}>
                    <th scope="row">{inf}</th>
                    <td className="de-form hl">{prat}</td>
                    <td className="gloss">{en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: 14 }}>
            Modalverben im Präteritum <span className="gloss">(lose the umlaut)</span>
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>können→konnte</th>
                  <th>müssen→musste</th>
                  <th>wollen→wollte</th>
                  <th>dürfen→durfte</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['ich', 'konnte', 'musste', 'wollte', 'durfte'],
                    ['du', 'konntest', 'musstest', 'wolltest', 'durftest'],
                    ['er/sie/es', 'konnte', 'musste', 'wollte', 'durfte'],
                    ['wir', 'konnten', 'mussten', 'wollten', 'durften'],
                    ['ihr', 'konntet', 'musstet', 'wolltet', 'durftet'],
                    ['sie/Sie', 'konnten', 'mussten', 'wollten', 'durften'],
                  ] as [string, string, string, string, string][]
                ).map(([pron, k, m, w, d]) => (
                  <tr key={pron}>
                    <th scope="row">{pron}</th>
                    <td className="de-form">{k}</td>
                    <td className="de-form">{m}</td>
                    <td className="de-form">{w}</td>
                    <td className="de-form">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-block" id="plusquamperfekt">
          <h3>
            Plusquamperfekt <span className="gloss">(past perfect — “had done”)</span>
          </h3>
          <p className="hint">
            The Präteritum of <b>haben</b>/<b>sein</b> (hatte / war) + Partizip II. Same auxiliary
            rules as the Perfekt.
          </p>
          <div className="chart-wrap">
            <table className="chart">
              <thead>
                <tr>
                  <th>Pronomen</th>
                  <th>
                    machen → <i>hatte … gemacht</i>
                  </th>
                  <th>
                    gehen → <i>war … gegangen</i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['ich', 'hatte', 'war'],
                    ['du', 'hattest', 'warst'],
                    ['er/sie/es', 'hatte', 'war'],
                    ['wir', 'hatten', 'waren'],
                    ['ihr', 'hattet', 'wart'],
                    ['sie/Sie', 'hatten', 'waren'],
                  ] as [string, string, string][]
                ).map(([pron, hAux, sAux]) => (
                  <tr key={pron}>
                    <th scope="row">{pron}</th>
                    <td>
                      <span className="ending">{hAux}</span>{' '}
                      <span className="de-form hl">gemacht</span>
                    </td>
                    <td>
                      <span className="ending">{sAux}</span>{' '}
                      <span className="de-form hl">gegangen</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grammar">
        <h2 className="section-title">
          📄 Original-Studienblätter <span className="muted">— PDF pages, click to enlarge</span>
        </h2>
        <div className="grammar-grid">
          {PAGE_IMAGES.map((img, i) => (
            <figure className="page-thumb" key={img} onClick={() => setLightbox(img)}>
              <img src={img} alt={`Study sheet page ${i + 1}`} loading="lazy" />
              <figcaption>Page {i + 1}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img id="lightbox-img" src={lightbox} alt="Enlarged study sheet page" />
        </div>
      )}
    </main>
  );
}
