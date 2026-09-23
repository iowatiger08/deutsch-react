/** Terms (route "/terms") — terms of use for this personal study app.
 *  Placeholder wording; edit freely to match the main site's terms. */
export default function Terms() {
  return (
    <main className="wrap">
      <section className="vocab-panel wide about-panel">
        <h2>
          📄 Nutzungsbedingungen <span className="gloss">(terms of use)</span>
        </h2>
        <p className="lead">
          Diese App wird <b>kostenlos und „wie besehen“</b> zu Bildungs- und Sprachlernzwecken
          bereitgestellt.
        </p>
        <p className="gloss">
          This app is provided <b>free of charge and “as is”</b> for educational and
          language-learning purposes.
        </p>
        <p>
          Die Inhalte dienen nur als Lernreferenz und stellen keine professionelle Übersetzung oder
          Beratung dar. Es wird keine Gewähr für Richtigkeit, Vollständigkeit oder Verfügbarkeit
          übernommen. Die Nutzung erfolgt auf eigene Verantwortung.
        </p>
        <p className="gloss">
          The content is a study reference only and is not professional translation or advice. No
          warranty is given as to accuracy, completeness, or availability. Use is at your own risk.
        </p>
        <p>
          Es werden keine personenbezogenen Daten zu Werbezwecken erhoben oder weitergegeben. Fragen?
          Siehe die{' '}
          <a href="https://tigersndragons.com/" target="_blank" rel="noopener noreferrer">
            Hauptseite
          </a>
          .
        </p>
        <p className="gloss">
          No personal data is collected or shared for advertising. Questions? See the{' '}
          <a href="https://tigersndragons.com/" target="_blank" rel="noopener noreferrer">
            main site
          </a>
          .
        </p>
      </section>
    </main>
  );
}
