/**
 * "Der Körper" silhouette — ported verbatim from vokabeln.html.
 *
 * The SVG is embedded as raw markup (not converted to JSX) so its inline
 * presentation attributes (fill/stroke/font on every element) survive exactly.
 * That is deliberate: relying on CSS classes alone left the silhouette black,
 * the labels invisible, and the arrow stems missing when the stylesheet was
 * cached/stale. The inline attributes are the belt-and-suspenders guarantee.
 */
const SVG = `
<svg class="body-figure" viewBox="0 0 600 740" role="img"
     aria-label="Menschliche Silhouette mit beschrifteten Körperteilen"
     font-family="inherit">
    <defs>
        <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3"
                orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent, #ffcc4d)"></path>
        </marker>
    </defs>

    <circle class="silhouette" cx="300" cy="70" r="40"
            fill="var(--panel-2, #1e222b)" stroke="var(--muted, #8b93a4)" stroke-width="2"></circle>
    <path class="silhouette" fill="var(--panel-2, #1e222b)" stroke="var(--muted, #8b93a4)" stroke-width="2"
        d="M 285 112 L 218 150 L 192 285 L 180 395 L 214 388
        L 246 180 L 256 335 L 240 372 L 246 545 L 250 695 L 232 712 L 280 712
        L 286 440 L 300 430 L 314 440 L 320 712 L 368 712 L 350 695 L 354 545
        L 360 372 L 344 335 L 354 180 L 386 388 L 420 395 L 408 285 L 382 150 L 315 112 Z"></path>

    <g stroke="var(--accent, #ffcc4d)" stroke-width="1.6">
        <line class="leader" x1="182" y1="36"  x2="280" y2="36"  marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="78"  x2="286" y2="62"  marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="120" x2="300" y2="73"  marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="162" x2="298" y2="87"  marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="214" x2="224" y2="152" marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="300" x2="198" y2="258" marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="400" x2="188" y2="390" marker-end="url(#arrow)"></line>
        <line class="leader" x1="182" y1="560" x2="270" y2="560" marker-end="url(#arrow)"></line>
    </g>
    <g text-anchor="end" fill="var(--de, #ffd97a)" font-weight="600" font-size="15">
        <text class="lbl-de" x="176" y="40">das Haar <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">hair</tspan></text>
        <text class="lbl-de" x="176" y="82">das Auge <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">eye</tspan><tspan class="lbl-act" x="176" dy="17" fill="var(--accent, #ffcc4d)" font-size="12.5" font-style="italic" font-weight="500">→ suchen</tspan></text>
        <text class="lbl-de" x="176" y="124">die Nase <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">nose</tspan><tspan class="lbl-act" x="176" dy="17" fill="var(--accent, #ffcc4d)" font-size="12.5" font-style="italic" font-weight="500">→ atmen, riechen</tspan></text>
        <text class="lbl-de" x="176" y="166">der Mund <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">mouth</tspan><tspan class="lbl-act" x="176" dy="17" fill="var(--accent, #ffcc4d)" font-size="12.5" font-style="italic" font-weight="500">→ sprechen, schmecken</tspan></text>
        <text class="lbl-de" x="176" y="218">die Schulter <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">shoulder</tspan></text>
        <text class="lbl-de" x="176" y="304">der Arm <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">arm</tspan></text>
        <text class="lbl-de" x="176" y="404">die Hand <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">hand</tspan></text>
        <text class="lbl-de" x="176" y="564">das Bein <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">leg</tspan></text>
    </g>

    <g stroke="var(--accent, #ffcc4d)" stroke-width="1.6">
        <line class="leader" x1="418" y1="40"  x2="324" y2="48"  marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="90"  x2="338" y2="72"  marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="150" x2="312" y2="120" marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="230" x2="312" y2="210" marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="330" x2="312" y2="320" marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="400" x2="416" y2="392" marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="545" x2="348" y2="545" marker-end="url(#arrow)"></line>
        <line class="leader" x1="418" y1="700" x2="352" y2="702" marker-end="url(#arrow)"></line>
    </g>
    <g fill="var(--de, #ffd97a)" font-weight="600" font-size="15">
        <text class="lbl-de" x="424" y="44">der Kopf <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">head</tspan></text>
        <text class="lbl-de" x="424" y="94">das Ohr <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">ear</tspan><tspan class="lbl-act" x="424" dy="17" fill="var(--accent, #ffcc4d)" font-size="12.5" font-style="italic" font-weight="500">→ hören</tspan></text>
        <text class="lbl-de" x="424" y="154">der Hals <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">neck / throat</tspan><tspan class="lbl-act" x="424" dy="17" fill="var(--accent, #ffcc4d)" font-size="12.5" font-style="italic" font-weight="500">→ schlucken</tspan></text>
        <text class="lbl-de" x="424" y="234">die Brust <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">chest</tspan></text>
        <text class="lbl-de" x="424" y="334">der Bauch <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">belly</tspan></text>
        <text class="lbl-de" x="424" y="404">der Finger <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">finger</tspan><tspan class="lbl-act" x="424" dy="17" fill="var(--accent, #ffcc4d)" font-size="12.5" font-style="italic" font-weight="500">→ fühlen, berühren</tspan></text>
        <text class="lbl-de" x="424" y="549">das Knie <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">knee</tspan></text>
        <text class="lbl-de" x="424" y="704">der Fuß <tspan class="lbl-en" fill="var(--muted, #8b93a4)" font-size="12">foot</tspan></text>
    </g>
</svg>`;

export default function BodyFigure() {
  return <div dangerouslySetInnerHTML={{ __html: SVG }} />;
}
