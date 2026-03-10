import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      instances: [
        { browser: 'chromium' }
      ],
    },
    include: ['**/*.spec.ts'],
  },
  resolve: {
    alias: {
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js'
    }
  }
});
