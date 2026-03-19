import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Test2/',
  server: {
    // Disable HMR in production-like environments
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
