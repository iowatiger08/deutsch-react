/**
 * Study sheets (route "/studienblaetter") — ports studienblaetter.html.
 *
 * The gallery of the 33 study-sheet PNGs (served from /pages) with a
 * click-to-enlarge lightbox (click or Esc to close). These used to sit at the
 * bottom of /grammar; they moved here so that page is charts only.
 */
import { useEffect, useState } from 'react';

// The 33 study-sheet pages live in public/pages as page-01.png … page-33.png.
const PAGE_IMAGES = Array.from(
  { length: 33 },
  (_, i) => `/pages/page-${String(i + 1).padStart(2, '0')}.png`,
);

export default function StudySheets() {
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
