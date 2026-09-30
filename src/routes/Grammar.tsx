/**
 * Grammar (route "/grammar") — ports grammar.html.
 *
 * Static conjugation / declension charts plus the Wortbildung and Satzbau
 * panels, as JSX, with a chart-nav jump menu. The 33 study-sheet scans have
 * their own route — see StudySheets.tsx.
 */
export default function Grammar() {
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
          <a href="#praefixe">Präfixe</a>
          <a href="#suffixe">Suffixe</a>
          <a href="#konjunktionen">Konjunktionen</a>
          <a href="#fragewoerter">Fragewörter</a>
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

        {/* WORD FORMATION: PREFIXES & SUFFIXES */}
        <h2 className="section-title" id="wortbildung">🧩 Wortbildung <span className="muted">— prefixes &amp; suffixes</span></h2>

        <div className="chart-block" id="praefixe">
            <h3>Trennbare Präfixe <span className="gloss">(separable prefixes — stressed, split off in main clauses)</span></h3>
            <p className="hint">The prefix is stressed and jumps to the <b>end of the clause</b>: <i>aufstehen</i> → ich stehe um 7 Uhr <b>auf</b>. In the Partizip II the <i>ge-</i> slots between prefix and stem: auf<b>ge</b>standen.</p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Präfix</th><th>Bedeutung</th><th>Verb</th><th>Beispiel</th><th>English</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="ending">an-</th><td className="gloss">at / on, starting</td><td className="de-form">anfangen</td><td>Der Film fängt um acht <span className="de-form hl">an</span>.</td><td className="gloss">The film starts at eight.</td></tr>
                    <tr><th scope="row" className="ending">auf-</th><td className="gloss">up / open</td><td className="de-form">aufstehen</td><td>Ich stehe früh <span className="de-form hl">auf</span>.</td><td className="gloss">I get up early.</td></tr>
                    <tr><th scope="row" className="ending">aus-</th><td className="gloss">out / off</td><td className="de-form">ausgehen</td><td>Wir gehen heute Abend <span className="de-form hl">aus</span>.</td><td className="gloss">We're going out tonight.</td></tr>
                    <tr><th scope="row" className="ending">ein-</th><td className="gloss">in / into</td><td className="de-form">einkaufen</td><td>Sie kauft im Supermarkt <span className="de-form hl">ein</span>.</td><td className="gloss">She shops at the supermarket.</td></tr>
                    <tr><th scope="row" className="ending">mit-</th><td className="gloss">along / with</td><td className="de-form">mitkommen</td><td>Kommst du <span className="de-form hl">mit</span>?</td><td className="gloss">Are you coming along?</td></tr>
                    <tr><th scope="row" className="ending">ab-</th><td className="gloss">off / away, departing</td><td className="de-form">abfahren</td><td>Der Zug fährt um zehn <span className="de-form hl">ab</span>.</td><td className="gloss">The train departs at ten.</td></tr>
                    <tr><th scope="row" className="ending">zu-</th><td className="gloss">closed / shut</td><td className="de-form">zumachen</td><td>Mach bitte die Tür <span className="de-form hl">zu</span>.</td><td className="gloss">Please close the door.</td></tr>
                    <tr><th scope="row" className="ending">vor-</th><td className="gloss">before / forward</td><td className="de-form">vorstellen</td><td>Ich stelle mich <span className="de-form hl">vor</span>.</td><td className="gloss">I'll introduce myself.</td></tr>
                    <tr><th scope="row" className="ending">nach-</th><td className="gloss">after / behind</td><td className="de-form">nachdenken</td><td>Er denkt lange <span className="de-form hl">nach</span>.</td><td className="gloss">He thinks it over at length.</td></tr>
                    <tr><th scope="row" className="ending">zurück-</th><td className="gloss">back</td><td className="de-form">zurückkommen</td><td>Sie kommt morgen <span className="de-form hl">zurück</span>.</td><td className="gloss">She's coming back tomorrow.</td></tr>
                    <tr><th scope="row" className="ending">weg-</th><td className="gloss">away</td><td className="de-form">weggehen</td><td>Geh bitte <span className="de-form hl">weg</span>!</td><td className="gloss">Please go away!</td></tr>
                    <tr><th scope="row" className="ending">fern-</th><td className="gloss">far / tele-</td><td className="de-form">fernsehen</td><td>Wir sehen abends <span className="de-form hl">fern</span>.</td><td className="gloss">We watch TV in the evening.</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="hint" style={{ marginTop: 14 }}>Untrennbare Präfixe <span className="gloss">(inseparable — unstressed, never split, and no <i>ge-</i> in the Partizip II)</span></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Präfix</th><th>Bedeutung</th><th>Verb</th><th>Beispiel</th><th>Partizip II</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="ending">be-</th><td className="gloss">makes the verb take a direct object</td><td className="de-form">besuchen</td><td>Ich <span className="de-form hl">besuche</span> meine Oma.</td><td className="de-form">besucht</td></tr>
                    <tr><th scope="row" className="ending">ver-</th><td className="gloss">away, wrongly, change of state</td><td className="de-form">verstehen</td><td>Ich <span className="de-form hl">verstehe</span> dich nicht.</td><td className="de-form">verstanden</td></tr>
                    <tr><th scope="row" className="ending">er-</th><td className="gloss">achieving / completing</td><td className="de-form">erklären</td><td>Er <span className="de-form hl">erklärt</span> die Regel.</td><td className="de-form">erklärt</td></tr>
                    <tr><th scope="row" className="ending">ent-</th><td className="gloss">removing / away from</td><td className="de-form">entscheiden</td><td>Wir <span className="de-form hl">entscheiden</span> morgen.</td><td className="de-form">entschieden</td></tr>
                    <tr><th scope="row" className="ending">ge-</th><td className="gloss">(no fixed sense)</td><td className="de-form">gehören</td><td>Das Buch <span className="de-form hl">gehört</span> mir.</td><td className="de-form">gehört</td></tr>
                    <tr><th scope="row" className="ending">emp-</th><td className="gloss">(no fixed sense)</td><td className="de-form">empfehlen</td><td>Ich <span className="de-form hl">empfehle</span> den Fisch.</td><td className="de-form">empfohlen</td></tr>
                    <tr><th scope="row" className="ending">miss-</th><td className="gloss">wrongly / badly</td><td className="de-form">missverstehen</td><td>Du <span className="de-form hl">missverstehst</span> mich.</td><td className="de-form">missverstanden</td></tr>
                    <tr><th scope="row" className="ending">zer-</th><td className="gloss">to pieces</td><td className="de-form">zerbrechen</td><td>Das Glas <span className="de-form hl">zerbricht</span>.</td><td className="de-form">zerbrochen</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="hint" style={{ marginTop: 14 }}>Präfixe bei Nomen &amp; Adjektiven <span className="gloss">(prefixes that build new nouns and adjectives)</span></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Präfix</th><th>Bedeutung</th><th>Beispiel</th><th>English</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="ending">un-</th><td className="gloss">not (negation)</td><td className="de-form">unmöglich · unfreundlich</td><td className="gloss">impossible · unfriendly</td></tr>
                    <tr><th scope="row" className="ending">haupt-</th><td className="gloss">main / chief</td><td className="de-form">der Hauptbahnhof</td><td className="gloss">the main station</td></tr>
                    <tr><th scope="row" className="ending">ur-</th><td className="gloss">original / one generation back</td><td className="de-form">die Urgroßmutter</td><td className="gloss">great-grandmother</td></tr>
                    <tr><th scope="row" className="ending">miss-</th><td className="gloss">mis- / failed</td><td className="de-form">der Misserfolg</td><td className="gloss">the failure</td></tr>
                    <tr><th scope="row" className="ending">vor-</th><td className="gloss">pre- / fore-</td><td className="de-form">die Vorspeise</td><td className="gloss">the starter / appetiser</td></tr>
                    <tr><th scope="row" className="ending">mit-</th><td className="gloss">fellow / co-</td><td className="de-form">der Mitarbeiter</td><td className="gloss">the co-worker</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div className="chart-block" id="suffixe">
            <h3>Suffixe — Nomen <span className="gloss">(noun endings: the ending tells you the gender)</span></h3>
            <p className="hint">These endings are the most reliable gender rules in German — learn the suffix and the article comes free.</p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Suffix</th><th>Genus</th><th>Beispiel</th><th>English</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="ending">-ung</th><td className="de-form hl">die</td><td className="de-form">die Wohnung · die Zeitung</td><td className="gloss">apartment · newspaper</td></tr>
                    <tr><th scope="row" className="ending">-heit</th><td className="de-form hl">die</td><td className="de-form">die Freiheit</td><td className="gloss">freedom</td></tr>
                    <tr><th scope="row" className="ending">-keit</th><td className="de-form hl">die</td><td className="de-form">die Möglichkeit</td><td className="gloss">possibility</td></tr>
                    <tr><th scope="row" className="ending">-schaft</th><td className="de-form hl">die</td><td className="de-form">die Freundschaft</td><td className="gloss">friendship</td></tr>
                    <tr><th scope="row" className="ending">-tion</th><td className="de-form hl">die</td><td className="de-form">die Information</td><td className="gloss">information</td></tr>
                    <tr><th scope="row" className="ending">-ei</th><td className="de-form hl">die</td><td className="de-form">die Bäckerei</td><td className="gloss">bakery</td></tr>
                    <tr><th scope="row" className="ending">-in</th><td className="de-form hl">die</td><td className="de-form">die Lehrerin</td><td className="gloss">(female) teacher</td></tr>
                    <tr><th scope="row" className="ending">-er</th><td className="de-form hl">der</td><td className="de-form">der Lehrer · der Computer</td><td className="gloss">teacher · computer</td></tr>
                    <tr><th scope="row" className="ending">-ling</th><td className="de-form hl">der</td><td className="de-form">der Frühling</td><td className="gloss">spring</td></tr>
                    <tr><th scope="row" className="ending">-ismus</th><td className="de-form hl">der</td><td className="de-form">der Kapitalismus</td><td className="gloss">capitalism</td></tr>
                    <tr><th scope="row" className="ending">-or</th><td className="de-form hl">der</td><td className="de-form">der Motor</td><td className="gloss">engine</td></tr>
                    <tr><th scope="row" className="ending">-chen</th><td className="de-form hl">das</td><td className="de-form">das Mädchen · das Brötchen</td><td className="gloss">girl · bread roll</td></tr>
                    <tr><th scope="row" className="ending">-lein</th><td className="de-form hl">das</td><td className="de-form">das Büchlein</td><td className="gloss">little book</td></tr>
                    <tr><th scope="row" className="ending">-ment</th><td className="de-form hl">das</td><td className="de-form">das Dokument</td><td className="gloss">document</td></tr>
                    <tr><th scope="row" className="ending">-nis</th><td className="de-form hl">das</td><td className="de-form">das Ergebnis</td><td className="gloss">result</td></tr>
                    <tr><th scope="row" className="ending">-tum</th><td className="de-form hl">das</td><td className="de-form">das Eigentum</td><td className="gloss">property</td></tr>
                    <tr><th scope="row" className="ending">-um</th><td className="de-form hl">das</td><td className="de-form">das Museum</td><td className="gloss">museum</td></tr>
                    </tbody>
                </table>
            </div>
            <p className="hint" style={{ marginTop: 14 }}>Die Verkleinerung mit <b>-chen</b>/<b>-lein</b> ist immer <b>das</b> — auch bei Personen: <i>das Mädchen</i>. Ein Umlaut kommt oft dazu: Hund → das Hündchen.</p>

            <p className="hint" style={{ marginTop: 14 }}>Suffixe — Adjektive &amp; Verben <span className="gloss">(adjective and verb endings)</span></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Suffix</th><th>Bedeutung</th><th>Beispiel</th><th>English</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="ending">-ig</th><td className="gloss">having the quality of</td><td className="de-form">windig · wichtig</td><td className="gloss">windy · important</td></tr>
                    <tr><th scope="row" className="ending">-lich</th><td className="gloss">-ly / -like</td><td className="de-form">freundlich · täglich</td><td className="gloss">friendly · daily</td></tr>
                    <tr><th scope="row" className="ending">-isch</th><td className="gloss">-ic / -ish, languages</td><td className="de-form">praktisch · englisch</td><td className="gloss">practical · English</td></tr>
                    <tr><th scope="row" className="ending">-bar</th><td className="gloss">-able / -ible</td><td className="de-form">machbar · essbar</td><td className="gloss">doable · edible</td></tr>
                    <tr><th scope="row" className="ending">-los</th><td className="gloss">-less (without)</td><td className="de-form">arbeitslos · hoffnungslos</td><td className="gloss">unemployed · hopeless</td></tr>
                    <tr><th scope="row" className="ending">-voll</th><td className="gloss">full of</td><td className="de-form">wertvoll</td><td className="gloss">valuable</td></tr>
                    <tr><th scope="row" className="ending">-reich</th><td className="gloss">rich in</td><td className="de-form">erfolgreich</td><td className="gloss">successful</td></tr>
                    <tr><th scope="row" className="ending">-sam</th><td className="gloss">tending to</td><td className="de-form">langsam · sparsam</td><td className="gloss">slow · thrifty</td></tr>
                    <tr><th scope="row" className="ending">-haft</th><td className="gloss">having the nature of</td><td className="de-form">lebhaft</td><td className="gloss">lively</td></tr>
                    <tr><th scope="row" className="ending">-ieren</th><td className="gloss">verbs from loanwords — <b>no</b> <i>ge-</i> in the Partizip II</td><td className="de-form">studieren → studiert</td><td className="gloss">to study → studied</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* SENTENCE STRUCTURE: CONJUNCTIONS & QUESTION WORDS */}
        <h2 className="section-title" id="satzbau">🔗 Satzbau <span className="muted">— conjunctions &amp; question words</span></h2>

        <div className="chart-block" id="konjunktionen">
            <h3>Konjunktionen — Position 0 <span className="gloss">(coordinating — word order does <b>not</b> change)</span></h3>
            <p className="hint">Only five, and they sit <i>outside</i> the clause they join, so the verb stays in second position. Mnemonic: <b>A·D·U·S·O</b> — aber, denn, und, sondern, oder.</p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Konjunktion</th><th>English</th><th>Beispiel</th><th>Übersetzung</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="de-form">und</th><td className="gloss">and</td><td>Ich lerne Deutsch <span className="de-form hl">und</span> ich <span className="vb">höre</span> Musik.</td><td className="gloss">I'm learning German and listening to music.</td></tr>
                    <tr><th scope="row" className="de-form">aber</th><td className="gloss">but</td><td>Es regnet, <span className="de-form hl">aber</span> wir <span className="vb">gehen</span> spazieren.</td><td className="gloss">It's raining, but we're going for a walk.</td></tr>
                    <tr><th scope="row" className="de-form">oder</th><td className="gloss">or</td><td>Möchtest du Kaffee <span className="de-form hl">oder</span> <span className="vb">trinkst</span> du Tee?</td><td className="gloss">Would you like coffee or are you drinking tea?</td></tr>
                    <tr><th scope="row" className="de-form">denn</th><td className="gloss">because / for</td><td>Ich bleibe zu Hause, <span className="de-form hl">denn</span> ich <span className="vb">bin</span> müde.</td><td className="gloss">I'm staying home because I'm tired.</td></tr>
                    <tr><th scope="row" className="de-form">sondern</th><td className="gloss">but rather</td><td>Er kommt nicht heute, <span className="de-form hl">sondern</span> er <span className="vb">kommt</span> morgen.</td><td className="gloss">He's not coming today but tomorrow.</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="hint" style={{ marginTop: 14 }}>Nebensatz-Konjunktionen <span className="gloss">(subordinating — the verb moves to the <b>end</b> of the clause)</span></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Konjunktion</th><th>English</th><th>Beispiel</th><th>Übersetzung</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="de-form">weil</th><td className="gloss">because</td><td>Ich bleibe zu Hause, <span className="de-form hl">weil</span> ich müde <span className="vb">bin</span>.</td><td className="gloss">I'm staying home because I'm tired.</td></tr>
                    <tr><th scope="row" className="de-form">dass</th><td className="gloss">that</td><td>Ich glaube, <span className="de-form hl">dass</span> er recht <span className="vb">hat</span>.</td><td className="gloss">I think that he's right.</td></tr>
                    <tr><th scope="row" className="de-form">wenn</th><td className="gloss">if / whenever</td><td><span className="de-form hl">Wenn</span> es <span className="vb">regnet</span>, bleiben wir zu Hause.</td><td className="gloss">If it rains, we stay home.</td></tr>
                    <tr><th scope="row" className="de-form">als</th><td className="gloss">when (one past event)</td><td><span className="de-form hl">Als</span> ich Kind <span className="vb">war</span>, wohnte ich in Berlin.</td><td className="gloss">When I was a child I lived in Berlin.</td></tr>
                    <tr><th scope="row" className="de-form">ob</th><td className="gloss">whether / if</td><td>Ich weiß nicht, <span className="de-form hl">ob</span> er <span className="vb">kommt</span>.</td><td className="gloss">I don't know whether he's coming.</td></tr>
                    <tr><th scope="row" className="de-form">obwohl</th><td className="gloss">although</td><td>Ich gehe aus, <span className="de-form hl">obwohl</span> ich müde <span className="vb">bin</span>.</td><td className="gloss">I'm going out although I'm tired.</td></tr>
                    <tr><th scope="row" className="de-form">damit</th><td className="gloss">so that</td><td>Ich lerne viel, <span className="de-form hl">damit</span> ich die Prüfung <span className="vb">bestehe</span>.</td><td className="gloss">I study a lot so that I pass the exam.</td></tr>
                    <tr><th scope="row" className="de-form">bevor</th><td className="gloss">before</td><td><span className="de-form hl">Bevor</span> ich <span className="vb">gehe</span>, trinke ich Kaffee.</td><td className="gloss">Before I leave I drink coffee.</td></tr>
                    <tr><th scope="row" className="de-form">nachdem</th><td className="gloss">after</td><td><span className="de-form hl">Nachdem</span> wir gegessen <span className="vb">hatten</span>, gingen wir.</td><td className="gloss">After we had eaten we left.</td></tr>
                    <tr><th scope="row" className="de-form">während</th><td className="gloss">while</td><td><span className="de-form hl">Während</span> sie <span className="vb">kocht</span>, lese ich.</td><td className="gloss">While she cooks I read.</td></tr>
                    <tr><th scope="row" className="de-form">bis</th><td className="gloss">until</td><td>Wir warten, <span className="de-form hl">bis</span> der Bus <span className="vb">kommt</span>.</td><td className="gloss">We'll wait until the bus comes.</td></tr>
                    <tr><th scope="row" className="de-form">seit / seitdem</th><td className="gloss">since</td><td><span className="de-form hl">Seit</span> ich hier <span className="vb">wohne</span>, bin ich glücklich.</td><td className="gloss">Since I've lived here I've been happy.</td></tr>
                    <tr><th scope="row" className="de-form">sobald</th><td className="gloss">as soon as</td><td><span className="de-form hl">Sobald</span> ich fertig <span className="vb">bin</span>, rufe ich an.</td><td className="gloss">As soon as I'm done I'll call.</td></tr>
                    <tr><th scope="row" className="de-form">falls</th><td className="gloss">in case</td><td><span className="de-form hl">Falls</span> du Zeit <span className="vb">hast</span>, komm vorbei.</td><td className="gloss">In case you have time, drop by.</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="hint" style={{ marginTop: 14 }}>Verbindungsadverbien <span className="gloss">(connecting adverbs — they take position 1, so the verb comes straight after)</span></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Adverb</th><th>English</th><th>Beispiel</th><th>Übersetzung</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="de-form">deshalb / darum</th><td className="gloss">therefore</td><td>Ich bin müde, <span className="de-form hl">deshalb</span> <span className="vb">bleibe</span> ich zu Hause.</td><td className="gloss">I'm tired, so I'm staying home.</td></tr>
                    <tr><th scope="row" className="de-form">trotzdem</th><td className="gloss">nevertheless</td><td>Es regnet, <span className="de-form hl">trotzdem</span> <span className="vb">gehen</span> wir raus.</td><td className="gloss">It's raining; even so we're going out.</td></tr>
                    <tr><th scope="row" className="de-form">dann</th><td className="gloss">then</td><td>Zuerst esse ich, <span className="de-form hl">dann</span> <span className="vb">lerne</span> ich.</td><td className="gloss">First I eat, then I study.</td></tr>
                    <tr><th scope="row" className="de-form">außerdem</th><td className="gloss">besides</td><td>Es ist teuer, <span className="de-form hl">außerdem</span> <span className="vb">ist</span> es weit.</td><td className="gloss">It's expensive; besides, it's far.</td></tr>
                    <tr><th scope="row" className="de-form">also</th><td className="gloss">so / thus</td><td>Der Laden ist zu, <span className="de-form hl">also</span> <span className="vb">kochen</span> wir.</td><td className="gloss">The shop is shut, so we'll cook.</td></tr>
                    </tbody>
                </table>
            </div>
            <p className="hint" style={{ marginTop: 14 }}><b>Achtung:</b> <i>denn</i> und <i>weil</i> heißen beide „because“ — aber <i>denn</i> lässt das Verb an Position 2, <i>weil</i> schickt es ans Ende: „…, <b>denn</b> ich <b>bin</b> müde“ vs. „…, <b>weil</b> ich müde <b>bin</b>“.</p>
        </div>

        <div className="chart-block" id="fragewoerter">
            <h3>Fragewörter <span className="gloss">(question words — the W-Fragen)</span></h3>
            <p className="hint">In a W-Frage the question word is position 1 and the <b>verb comes second</b>: <i>Wann <b>kommt</b> der Zug?</i> A yes/no question puts the verb first instead: <i><b>Kommt</b> der Zug?</i></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Fragewort</th><th>English</th><th>Beispiel</th><th>Übersetzung</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="de-form">Wer?</th><td className="gloss">who <span className="ending">(Nom.)</span></td><td><span className="de-form hl">Wer</span> ist das?</td><td className="gloss">Who is that?</td></tr>
                    <tr><th scope="row" className="de-form">Wen?</th><td className="gloss">whom <span className="ending">(Akk.)</span></td><td><span className="de-form hl">Wen</span> siehst du?</td><td className="gloss">Whom do you see?</td></tr>
                    <tr><th scope="row" className="de-form">Wem?</th><td className="gloss">to whom <span className="ending">(Dat.)</span></td><td><span className="de-form hl">Wem</span> hilfst du?</td><td className="gloss">Whom are you helping?</td></tr>
                    <tr><th scope="row" className="de-form">Wessen?</th><td className="gloss">whose <span className="ending">(Gen.)</span></td><td><span className="de-form hl">Wessen</span> Buch ist das?</td><td className="gloss">Whose book is that?</td></tr>
                    <tr><th scope="row" className="de-form">Was?</th><td className="gloss">what</td><td><span className="de-form hl">Was</span> machst du heute?</td><td className="gloss">What are you doing today?</td></tr>
                    <tr><th scope="row" className="de-form">Wo?</th><td className="gloss">where (location)</td><td><span className="de-form hl">Wo</span> wohnst du?</td><td className="gloss">Where do you live?</td></tr>
                    <tr><th scope="row" className="de-form">Wohin?</th><td className="gloss">where to</td><td><span className="de-form hl">Wohin</span> gehst du?</td><td className="gloss">Where are you going?</td></tr>
                    <tr><th scope="row" className="de-form">Woher?</th><td className="gloss">where from</td><td><span className="de-form hl">Woher</span> kommst du?</td><td className="gloss">Where are you from?</td></tr>
                    <tr><th scope="row" className="de-form">Wann?</th><td className="gloss">when</td><td><span className="de-form hl">Wann</span> kommt der Zug?</td><td className="gloss">When does the train come?</td></tr>
                    <tr><th scope="row" className="de-form">Warum?</th><td className="gloss">why</td><td><span className="de-form hl">Warum</span> lernst du Deutsch?</td><td className="gloss">Why are you learning German?</td></tr>
                    <tr><th scope="row" className="de-form">Wieso? / Weshalb?</th><td className="gloss">why (how come)</td><td><span className="de-form hl">Wieso</span> fragst du?</td><td className="gloss">How come you're asking?</td></tr>
                    <tr><th scope="row" className="de-form">Wie?</th><td className="gloss">how</td><td><span className="de-form hl">Wie</span> geht es dir?</td><td className="gloss">How are you?</td></tr>
                    <tr><th scope="row" className="de-form">Wie viel?</th><td className="gloss">how much</td><td><span className="de-form hl">Wie viel</span> kostet das?</td><td className="gloss">How much does that cost?</td></tr>
                    <tr><th scope="row" className="de-form">Wie viele?</th><td className="gloss">how many</td><td><span className="de-form hl">Wie viele</span> Geschwister hast du?</td><td className="gloss">How many siblings do you have?</td></tr>
                    <tr><th scope="row" className="de-form">Wie lange?</th><td className="gloss">how long</td><td><span className="de-form hl">Wie lange</span> wohnst du hier?</td><td className="gloss">How long have you lived here?</td></tr>
                    <tr><th scope="row" className="de-form">Wie oft?</th><td className="gloss">how often</td><td><span className="de-form hl">Wie oft</span> spielst du Tennis?</td><td className="gloss">How often do you play tennis?</td></tr>
                    <tr><th scope="row" className="de-form">Welcher/-e/-es?</th><td className="gloss">which (declines like <i>der</i>)</td><td><span className="de-form hl">Welches</span> Buch liest du?</td><td className="gloss">Which book are you reading?</td></tr>
                    <tr><th scope="row" className="de-form">Was für ein…?</th><td className="gloss">what kind of</td><td><span className="de-form hl">Was für ein</span> Auto hast du?</td><td className="gloss">What kind of car do you have?</td></tr>
                    </tbody>
                </table>
            </div>

            <p className="hint" style={{ marginTop: 14 }}>wo- + Präposition <span className="gloss">(asking about a thing rather than a person — an extra <i>-r-</i> appears before a vowel)</span></p>
            <div className="chart-wrap">
                <table className="chart wordy">
                    <thead>
                    <tr><th>Fragewort</th><th>English</th><th>Beispiel</th><th>Übersetzung</th></tr>
                    </thead>
                    <tbody>
                    <tr><th scope="row" className="de-form">Womit?</th><td className="gloss">with what</td><td><span className="de-form hl">Womit</span> schreibst du?</td><td className="gloss">What are you writing with?</td></tr>
                    <tr><th scope="row" className="de-form">Wofür?</th><td className="gloss">what for</td><td><span className="de-form hl">Wofür</span> ist das?</td><td className="gloss">What is that for?</td></tr>
                    <tr><th scope="row" className="de-form">Worüber?</th><td className="gloss">about what</td><td><span className="de-form hl">Worüber</span> sprichst du?</td><td className="gloss">What are you talking about?</td></tr>
                    <tr><th scope="row" className="de-form">Woran?</th><td className="gloss">of / on what</td><td><span className="de-form hl">Woran</span> denkst du?</td><td className="gloss">What are you thinking about?</td></tr>
                    <tr><th scope="row" className="de-form">Worauf?</th><td className="gloss">for / on what</td><td><span className="de-form hl">Worauf</span> wartest du?</td><td className="gloss">What are you waiting for?</td></tr>
                    <tr><th scope="row" className="de-form">Wovon?</th><td className="gloss">of / from what</td><td><span className="de-form hl">Wovon</span> lebt er?</td><td className="gloss">What does he live on?</td></tr>
                    </tbody>
                </table>
            </div>
            <p className="hint" style={{ marginTop: 14 }}>Bei Personen bleibt die Präposition vorn: <i>Mit <b>wem</b> sprichst du?</i> — aber bei Sachen: <i><b>Womit</b> schreibst du?</i></p>
        </div>
      </section>

    </main>
  );
}
