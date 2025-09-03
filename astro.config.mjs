// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";
import { remarkReadingTime } from "./remark-reading-time.mjs";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import og from "astro-og";

import favicons from "astro-favicons";

// https://astro.build/config
export default defineConfig({
  site: "https://aidencancode.com",

  markdown: {
    remarkPlugins: [remarkReadingTime],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [db(), expressiveCode({
    themes: ["github-dark-high-contrast"],
    frames: {
      showCopyToClipboardButton: true,
    },
  }), icon(), svelte(), og(), favicons()],

  adapter: netlify(),

  session: {
    cookie: "session-cookie",
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Geist",
        cssVariable: "--font-geist",
      },
      {
        provider: fontProviders.google(),
        name: "Geist Mono",
        cssVariable: "--font-geist-mono",
      },
    ],
  },
});