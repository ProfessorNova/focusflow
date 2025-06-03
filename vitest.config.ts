import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
// import { defineProject } from "vitest/config"; Use project in upcoming version 3.2 - also replace workspace
// https://main.vitest.dev/guide/projects.html#running-tests

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    test: {
        workspace: [
            'packages/*',
            {
                extends: true,          // Extends root specifications
                test: {
                    name: 'unit',

                    hookTimeout: 30000,
                    testTimeout: 30000,
                    globals: true,

                    include: [
                        'tests/**/*.{spec,test}.ts',
                    ],
                    exclude: [
                        'tests/UI-E2E-tests/**/*.{spec,test}.ts',
                        'tests/BDD/**/*.{spec,test}.ts',
                    ],
                    environment: 'node',
                },
            },
            // Doesnt work but dont know why
            // Docs are unclear
            {
                extends: true,
                test: {
                    name: 'browser',

                    hookTimeout: 30000,
                    testTimeout: 30000,
                    globals: true,
                    css: true,

                    include: [
                        'tests/UI-E2E-tests/**/*.{spec,test}.ts',
                    ],
                    browser: {
                        provider: 'playwright', // or 'webdriverio'
                        enabled: true,
                        // headless: true,
                        instances: [
                            { browser: 'chromium' },
                        ],
                    },
                },
            },
        ],
    },
});
