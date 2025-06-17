/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    hookTimeout: 30000,
    testTimeout: 30000,
  },
  // cloudflare protocol
  // Trying to externalize cloudflare protocol
  build: {
    rollupOptions: {
      external: ['cloudflare:sockets'],
    },
  },
});
