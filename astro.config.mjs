import { defineConfig } from 'astro/config';

// Adresu webu a podadresář lze přepsat proměnnými prostředí – využívá je nasazení na GitHub Pages
// (https://tanecnigit.github.io/web1/). Na vlastní doméně se nenastavují.
export default defineConfig({
  // TODO: ověřit finální doménu (stejná hodnota je v src/data/content.js → site.url)
  site: process.env.SITE_URL ?? 'https://www.tanecninovyjicin.cz',
  base: process.env.BASE_PATH ?? '/',
  server: { host: '127.0.0.1', port: 4321 },
});
