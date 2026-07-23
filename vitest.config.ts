import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.{ts,tsx}'],
    // Each test file gets a fresh module registry so the side-effectful
    // store modules (store.ts / entityStore.ts) re-run their init on import.
    restoreMocks: true,
  },
});
