# Taneční škola Nový Jičín – web

Statický web postavený na [Astro](https://astro.build). Výstupem je čisté HTML/CSS s minimem JavaScriptu.

## Spuštění

```bash
npm install
npm run dev      # vývojový server na http://127.0.0.1:4321
npm run build    # produkční build do složky dist/
```

## Kde co upravit

- **Texty, termíny, ceny, kontakty:** `src/data/content.js` (jediné místo s obsahem; meta popis i JSON-LD se z něj skládají).
- **Doména:** `site.url` v `src/data/content.js`, `site` v `astro.config.mjs`, `public/robots.txt` a `public/sitemap.xml`.
- **Sekce stránky:** `src/components/sections/*.astro`, pořadí v `src/pages/index.astro`.
- **Barvy, písma, mezery:** tokeny na začátku `src/styles/global.css`.
- **Fotky:** `src/assets/photos/` – Astro z nich při buildu generuje AVIF/WebP v několika velikostech.
- **Originální podklady:** `_podklady/` (nepublikuje se).

## Výkon, kompatibilita a SEO

- **Animovaný gradient** se spouští až po načtení stránky a jen když je vidět. Na slabých zařízeních, v úsporném režimu dat a při vypnutých animacích je statický. Bez hardwarové akcelerace grafiky nebo bez WebGL se místo něj zobrazí CSS gradient.
- **Obrázky** se generují v AVIF/WebP v několika velikostech (JPG jako záloha). Fonty jsou lokální a ty pro nadpis se načítají přednostně.
- **Bez JavaScriptu** je obsah celý čitelný a formulář s přihláškou zůstává dostupný.
- **SEO:** title, description, canonical, Open Graph a Twitter karty. Strukturovaná data obsahují WebSite, DanceSchool, Course a FAQPage (časté dotazy se mohou zobrazit přímo ve výsledcích Googlu). Dále `sitemap.xml`, `robots.txt` a `site.webmanifest`.
- **Hosting:** `public/.htaccess` (Apache – komprese a cache) a `public/_headers` (Netlify / Cloudflare Pages). Na jiném hostingu se ignorují.

## Chybějící údaje (hledejte `TODO:` v kódu)

- výše zápisného (zálohy) a platební údaje / číslo účtu,
- přesná adresa sálu (Závodní klub PO Lighting Czech),
- příjem přihlášek (`signupForm.endpoint`) – dokud není vyplněn, formulář otevře e-mail s vyplněnou přihláškou,
- ověření finální domény,
- ověření přiřazení fotek lektorek (Pístecká / Petřeková).
