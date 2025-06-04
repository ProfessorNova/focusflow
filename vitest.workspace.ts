import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vitest.config.ts',
  {
    extends: 'vitest.config.ts',
    test: {
      name: "ui",
      css: true,
      globals: true,

      include: [
        'tests/UI-E2E-tests/**/*.{spec,test}.ts',
      ],
      setupFiles: ['tests/setup.ts'],
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        // https://vitest.dev/guide/browser/playwright
        instances: [
          { browser: 'chromium' },
        ],
      },
    },
  },
])
