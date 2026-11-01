import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: ověřit finální doménu (stejná hodnota je v src/data/content.js → site.url)
  site: 'https://www.tanecninovyjicin.cz',
  server: { host: '127.0.0.1', port: 4321 },
});
