/**
 * "Das Gedeck" — a labeled top-down diagram of a table setting.
 *
 * Same approach as BodyFigure: the SVG is embedded as raw markup with inline
 * presentation attributes on every element, so the plate/cutlery/labels render
 * correctly even if the stylesheet is cached/stale.
 */
const SVG = `
<svg class="body-figure" viewBox="0 0 660 390" role="img"
     aria-label="Gedeck mit beschrifteten Teilen: Serviette, Gabel, Teller, Messer, Löffel, Glas"
     font-family="inherit">
  <defs>
    <marker id="arrowT" markerWidth="9" markerHeight="9" refX="7" refY="3"
            orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent, #ffcc4d)"></path>
    </marker>
  </defs>

  <!-- Platte (plate) -->
  <circle cx="330" cy="220" r="86" fill="var(--panel-2, #1e222b)" stroke="var(--muted, #8b93a4)" stroke-width="2"></circle>
  <circle cx="330" cy="220" r="66" fill="none" stroke="var(--muted, #8b93a4)" stroke-width="1.4"></circle>

  <!-- Serviette (napkin) -->
  <rect x="74" y="168" width="70" height="104" rx="7" fill="#26303f" stroke="var(--muted, #8b93a4)" stroke-width="1.6"></rect>
  <line x1="88" y1="180" x2="88" y2="260" stroke="var(--muted, #8b93a4)" stroke-width="1"></line>
  <line x1="100" y1="180" x2="100" y2="260" stroke="var(--muted, #8b93a4)" stroke-width="1"></line>

  <!-- Gabel (fork) -->
  <rect x="188" y="238" width="16" height="86" rx="7" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="1.2"></rect>
  <rect x="186" y="196" width="20" height="48" rx="7" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="1.2"></rect>
  <rect x="187" y="168" width="3.6" height="34" rx="1.5" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="0.8"></rect>
  <rect x="192.6" y="168" width="3.6" height="34" rx="1.5" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="0.8"></rect>
  <rect x="198.2" y="168" width="3.6" height="34" rx="1.5" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="0.8"></rect>
  <rect x="203.8" y="168" width="3.6" height="34" rx="1.5" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="0.8"></rect>

  <!-- Messer (knife) -->
  <rect x="444" y="238" width="16" height="86" rx="7" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="1.2"></rect>
  <path d="M447 242 L447 178 Q447 170 455 174 L460 236 Q460 242 455 242 Z"
        fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="1.2"></path>

  <!-- Löffel (spoon) -->
  <rect x="484" y="238" width="12" height="86" rx="6" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="1.2"></rect>
  <ellipse cx="490" cy="205" rx="14" ry="24" fill="#c4c9d2" stroke="var(--muted, #8b93a4)" stroke-width="1.2"></ellipse>

  <!-- Glas (glass) -->
  <path d="M480 66 L520 66 L514 108 Q500 122 486 108 Z"
        fill="rgba(150,180,220,0.22)" stroke="var(--muted, #8b93a4)" stroke-width="1.6"></path>
  <rect x="498" y="118" width="4" height="26" fill="var(--muted, #8b93a4)"></rect>
  <ellipse cx="500" cy="148" rx="16" ry="4.5" fill="none" stroke="var(--muted, #8b93a4)" stroke-width="1.6"></ellipse>

  <!-- Leader lines -->
  <g stroke="var(--accent, #ffcc4d)" stroke-width="1.6">
    <line class="leader" x1="108" y1="74" x2="108" y2="164" marker-end="url(#arrowT)"></line>
    <line class="leader" x1="196" y1="74" x2="196" y2="163" marker-end="url(#arrowT)"></line>
    <line class="leader" x1="548" y1="96" x2="522" y2="94" marker-end="url(#arrowT)"></line>
    <line class="leader" x1="548" y1="205" x2="506" y2="205" marker-end="url(#arrowT)"></line>
    <line class="leader" x1="320" y1="340" x2="320" y2="308" marker-end="url(#arrowT)"></line>
    <line class="leader" x1="452" y1="340" x2="452" y2="326" marker-end="url(#arrowT)"></line>
  </g>

  <!-- Labels -->
  <g fill="var(--de, #ffd97a)" font-weight="600" font-size="15" text-anchor="middle">
    <text class="lbl-de" x="108" y="50">die Serviette <tspan class="lbl-en" x="108" dy="16" fill="var(--muted, #8b93a4)" font-size="12">napkin</tspan></text>
    <text class="lbl-de" x="196" y="50">die Gabel <tspan class="lbl-en" x="196" dy="16" fill="var(--muted, #8b93a4)" font-size="12">fork</tspan></text>
    <text class="lbl-de" x="320" y="360">der Teller <tspan class="lbl-en" x="320" dy="16" fill="var(--muted, #8b93a4)" font-size="12">plate</tspan></text>
    <text class="lbl-de" x="452" y="360">das Messer <tspan class="lbl-en" x="452" dy="16" fill="var(--muted, #8b93a4)" font-size="12">knife</tspan></text>
  </g>
  <g fill="var(--de, #ffd97a)" font-weight="600" font-size="15" text-anchor="start">
    <text class="lbl-de" x="556" y="92">das Glas <tspan class="lbl-en" x="556" dy="16" fill="var(--muted, #8b93a4)" font-size="12">glass</tspan></text>
    <text class="lbl-de" x="556" y="201">der Löffel <tspan class="lbl-en" x="556" dy="16" fill="var(--muted, #8b93a4)" font-size="12">spoon</tspan></text>
  </g>
</svg>`;

export default function TableSetting() {
  return <div dangerouslySetInnerHTML={{ __html: SVG }} />;
}
