import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PWA (vite-plugin-pwa) is added in a later migration step.
export default defineConfig({
  plugins: [react()],
});
