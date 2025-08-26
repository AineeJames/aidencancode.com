// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";
import { remarkReadingTime } from "./remark-reading-time.mjs";
import expressiveCode from "astro-expressive-code";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    db(),
    expressiveCode({
      themes: ["github-dark-high-contrast"],
      frames: {
        showCopyToClipboardButton: true,
      },
    }),
    icon(),
  ],
  adapter: netlify(),

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
