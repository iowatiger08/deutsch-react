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
- [ ] Vokabeln, Quiz, Grammar, Wetter (stubbed, ported in later steps).
- [ ] PWA offline service worker + installable manifest.
- [ ] `/api/*` weather + news Lambda; S3 + CloudFront deploy.

## Architecture

- `src/lib/normalize.ts` — ports `GermanNormalizer` (article-aware dedup key + merge).
- `src/lib/search.ts` — ports `SearchController` + repo search/sort/limit semantics.
- `src/lib/store.ts` — IndexedDB seed/load/mutate + export/import.
- `src/store/StoreContext.tsx` — in-memory store shared via React context.
