/** Temporary stand-in for routes not yet ported (Vokabeln, Quiz, Grammar, Wetter, About).
 *  Each is filled in during later migration steps. */
export default function Placeholder({ title }: { title: string }) {
  return (
    <main className="wrap">
      <section className="search-panel">
        <h2>{title}</h2>
        <p className="result-meta">Coming soon — this page is still being ported to React.</p>
      </section>
    </main>
  );
}
