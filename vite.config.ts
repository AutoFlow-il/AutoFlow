import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Disable HMR in production-like environments
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
