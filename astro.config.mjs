// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";
import { remarkReadingTime } from './remark-reading-time.mjs';
import expressiveCode from "astro-expressive-code";

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
      themes: ["gruvbox-dark-medium"],
      frames: {
        showCopyToClipboardButton: true,
      }
    }),
  ],
  adapter: netlify(),

  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist",
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono"
    }]
  }
});
