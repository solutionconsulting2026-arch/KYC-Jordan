import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative asset paths so the build works under GitHub Pages' /KYC-Jordan/ subpath
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
});
