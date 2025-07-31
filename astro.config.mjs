// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://national1031center.com',
  
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
        'https://national1031center.com/',
        'https://national1031center.com/calculator',
        'https://national1031center.com/complete-guide-1031-exchanges',
        'https://national1031center.com/contact'
      ]
    })
  ]
});