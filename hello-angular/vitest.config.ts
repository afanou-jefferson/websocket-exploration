import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['**/*.spec.ts'],
  },
  resolve: {
    alias: {
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js'
    }
  }
});
