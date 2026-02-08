import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hallucinaut.github.io',
  base: '/unit_692/',
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap()
  ],
  image: {
    domains: ['images.unsplash.com'],
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
  },
});