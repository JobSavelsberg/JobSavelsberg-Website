// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://jobsavelsberg.com",
    integrations: [svelte()],
    vite: {
        plugins: [tailwindcss()],
    },
    prefetch: true,
});
