// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import db from "@astrojs/db";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",

  markdown: {
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
