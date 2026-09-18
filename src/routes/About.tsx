/** Über / About (route "/about") — ports about.html. Educational-purpose disclaimer. */
export default function About() {
  return (
    <main className="wrap">
      <section className="vocab-panel wide about-panel">
        <h2>
          ℹ️ Über diese App <span className="gloss">(about)</span>
        </h2>
        <p className="lead">
          Diese App dient{' '}
          <b>ausschließlich Bildungs- und Sprachlernzwecken — keine andere Absicht.</b>
        </p>
        <p className="gloss">
          This application exists{' '}
          <b>solely for educational and language-learning purposes — no other intent.</b>
        </p>
        <p>
          Es handelt sich um eine persönliche Referenz zum Deutschlernen: Wortschatz,
          Grammatik-Übersichten, ein Flashcard-Quiz sowie Wetter- und Nachrichten-Übungen. Alle
          Inhalte sind als sachliche Lernmaterialien gedacht — Vokabellisten und Erklärungen, nicht
          mehr.
        </p>
        <p className="gloss">
          THIS is a personal reference for learning German — vocabulary, grammar charts, a flashcard
          quiz, and weather/news practice. Everything here is plain study material: word lists and
          explanations, nothing more.
        </p>
        <p>
          Einzelne Bereiche enthalten Wortschatz für Erwachsene (18+) und sind ausdrücklich als
          Sprachreferenz für erwachsene Lernende gedacht. Sie beschreiben ausschließlich
          einvernehmliches Verhalten zwischen Erwachsenen und stellen weder Pornografie noch eine
          Anleitung dar.
        </p>
        <p className="gloss">
          Some sections contain adult (18+) vocabulary and are intended strictly as a language
          reference for adult learners. They describe only consensual activity between adults and are
          neither pornography nor instructional content.
        </p>
      </section>
    </main>
  );
}
