# Deutsch — React (offline)

A static **Vite + React + TypeScript** rebuild of the Deutsch German/English study
reference. No server: the vocabulary lives in the browser (**IndexedDB**), so search,
add/edit/delete, quiz, and the grammar reference all work fully offline. Edits are
backed up via **JSON export/import**.

This is the offline migration of the original Spring Boot + Thymeleaf + H2 app; see
`docs/react-offline-migration-plan.md` in the source project for the full plan.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/  (static site)
npm run preview  # serve the production build
```

## Data

`src/data/seed.json` is a snapshot **exported from the authoritative H2 database**
(the single source of truth), not the old bootstrap `entries.json`. On first load it
seeds IndexedDB; after that the local store is authoritative and the seed is only used
to bootstrap a fresh browser. Use **Export** on the Search page to back up your edits
and **Import** to move them between devices.

## Status

Migration in progress:

- [x] Search (`/`) — search, category chips, sortable columns, limit toggle, inline
      add/edit/delete with article-aware dedup on add, Export/Import.
- [x] Vokabeln (`/vokabeln`) — days/months/seasons/weather/colors tables, the
      "Der Körper" body figure (verbatim inline-styled SVG), Queer & LGBTQ+ panel,
      and the sticky anchor menubar.
- [x] Quiz (`/quiz`) — flashcards from the local store: shuffle, flip, grade,
      practice-missed, keyboard 1/2/Space, direction + category filter.
- [x] Grammar (`/grammar`) — conjugation/declension charts, chart-nav jump menu,
      33-page study-sheet gallery with click-to-enlarge lightbox.
- [x] Wetter (`/wetter`) — weather + news cards fetching same-origin `/api/*`,
      degrading gracefully when offline / no backend.
- [x] About (`/about`) — educational-purpose disclaimer.
- [x] PWA — `vite-plugin-pwa`: precache app shell + seed + 33 grammar PNGs,
      NetworkFirst runtime cache for `/api/*`, installable manifest + icons.
- [x] `/api/*` weather + news Lambda (`infra/lambda/`) — ports WeatherService +
      NewsService; verified against live Open-Meteo + RSS feeds.
- [x] Deployed to AWS — **live at https://deutsch.tigersndragons.com/** (S3 +
      CloudFront, Lambda behind API Gateway; scripts + runbook in `infra/`).

## Architecture

- `src/lib/normalize.ts` — ports `GermanNormalizer` (article-aware dedup key + merge).
- `src/lib/search.ts` — ports `SearchController` + repo search/sort/limit semantics.
- `src/lib/store.ts` — IndexedDB seed/load/mutate + export/import.
- `src/store/StoreContext.tsx` — in-memory store shared via React context.
