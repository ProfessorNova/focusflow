/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    hookTimeout: 30000,
    testTimeout: 30000,

    coverage: {
      provider: "v8",          
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: ["node_modules/", "tests/"],
      all: true,
    },
  },
  // cloudflare protocol 
  build: {
    rollupOptions: {
      external: ['cloudflare:sockets'],
    },
  },
});
