import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // amazon-cognito-identity-js pulls in `buffer`, which references `global`.
  define: { global: 'globalThis' },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['german-flag.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Deutsch — Study Reference',
        short_name: 'Deutsch',
        description:
          'Offline German ↔ English study reference: searchable vocabulary, grammar charts, and a flashcard quiz.',
        lang: 'de',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell, icons, the flag, and the 33 grammar PNGs
        // (~5.8 MB) so the reference UI works fully offline. Vocabulary itself is
        // fetched from /api/entries and mirrored to IndexedDB (see lib/store.ts).
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Client-side routes deep-link to index.html.
        navigateFallback: '/index.html',
        // Don't hijack the API paths with the SPA fallback.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Live weather/news: serve network first, fall back to the last-seen
            // response when offline so a plane/no-wifi session still renders.
            urlPattern: /\/api\/(wetter|nachrichten)\b/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-wetter-nachrichten',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Vocabulary: network-first so edits show immediately, with the last
            // good response kept for offline reads. The store also mirrors to
            // IndexedDB, so this is a belt-and-suspenders offline layer.
            urlPattern: /\/api\/entries\b/,
            method: 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-entries',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
