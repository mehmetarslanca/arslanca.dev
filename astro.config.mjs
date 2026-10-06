import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arslanca.dev',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !/\/(resume|404|work\/edip)\/$/.test(page) })],
  markdown: { shikiConfig: { theme: 'github-dark', wrap: true } },
});
