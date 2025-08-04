// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://the1031center.com',
  output: 'server',
  adapter: netlify(),
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(), 
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
      // Customize per-page settings
      customPages: [
        'https://the1031center.com/',
        'https://the1031center.com/calculator',
        'https://the1031center.com/complete-guide-1031-exchanges',
        'https://the1031center.com/contact'
      ]
    })
  ]
});