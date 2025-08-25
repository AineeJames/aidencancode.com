// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";
import { remarkModifiedTime } from './remark-modified-time.mjs';
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  output: "server",

  markdown: {
    remarkPlugins: [remarkModifiedTime, remarkReadingTime],
    shikiConfig: {
      theme: "gruvbox-dark-medium"
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [db()],
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
