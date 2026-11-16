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

## Přihlášky a administrace

- Formulář ukládá přihlášky do databáze **Supabase** (`src/data/supabase.js` – veřejná adresa a veřejný klíč, region EU).
- Struktura databáze a pravidla přístupu: `supabase/schema.sql`. Návštěvník smí přihlášku jen odeslat; číst, upravovat a mazat je smí jen účet zapsaný v tabulce `admins`.
- Administrace: `/admin` (na GitHub Pages `/web1/admin/`) – přihlášení e-mailem a heslem, seznam přihlášek, hledání, filtr a změna stavu, interní poznámky, export do Excelu (CSV) a mazání.
- **Aplikace v mobilu:** administraci jde přidat na plochu telefonu jako samostatnou aplikaci „Přihlášky“ (manifest `public/admin/manifest.webmanifest`). Android/Chrome: ⋮ → *Přidat na plochu / Nainstalovat aplikaci*. iPhone/Safari: Sdílet → *Přidat na plochu*.
- Nový administrátor: Supabase → Authentication → Users → Add user, pak spustit příkaz z konce `supabase/schema.sql`.
- Veřejná registrace účtů je v Supabase vypnutá. Klíč `service_role` / secret do webu nikdy nepatří.

### Buzení databáze (aby mimo sezónu neusnula)

- Bezplatný Supabase uspí projekt po týdnu bez aktivity. Úloha `.github/workflows/keepalive.yml` proto každé 3 dny pošle jeden neškodný dotaz (nic nečte ani nezapisuje) a zkontroluje, že web běží.
- **Když něco selže, přijde e-mail od GitHubu** („Run failed: Buzení databáze“). Pak stačí v Supabase otevřít projekt a případně kliknout na *Restore*. Data se uspáním neztrácí.
- Ručně spustit: GitHub → Actions → *Buzení databáze* → *Run workflow*.

### Kontrola jednou ročně (třeba v srpnu, před přihláškami)

1. GitHub → Actions → *Buzení databáze*: poslední běhy mají zelenou fajfku. Pokud je nahoře žlutý pruh „This scheduled workflow is disabled“, klikněte na *Enable workflow*.
2. Přihlásit se do administrace a ověřit, že se načtou přihlášky.
3. Odeslat zkušební přihlášku z webu a pak ji v administraci smazat.
4. Smazat přihlášky z minulého roku (nejdřív *Export do Excelu*, pokud je chcete schovat).

## Výkon, kompatibilita a SEO

- **Animovaný gradient** se spouští až po načtení stránky a jen když je vidět. Na slabých zařízeních, v úsporném režimu dat a při vypnutých animacích je statický. Bez hardwarové akcelerace grafiky nebo bez WebGL se místo něj zobrazí CSS gradient.
- **Obrázky** se generují v AVIF/WebP v několika velikostech (JPG jako záloha). Fonty jsou lokální a ty pro nadpis se načítají přednostně.
- **Bez JavaScriptu** je obsah celý čitelný; odeslání formuláře JavaScript vyžaduje, kontakty pro přihlášku telefonem či e-mailem jsou hned vedle formuláře.
- **SEO:** title, description, canonical, Open Graph a Twitter karty. Strukturovaná data obsahují WebSite, DanceSchool, Course a FAQPage (časté dotazy se mohou zobrazit přímo ve výsledcích Googlu). Dále `sitemap.xml`, `robots.txt` a `site.webmanifest`.
- **Hosting:** `public/.htaccess` (Apache – komprese a cache) a `public/_headers` (Netlify / Cloudflare Pages). Na jiném hostingu se ignorují.

## Chybějící údaje (hledejte `TODO:` v kódu)

- výše zápisného (zálohy) a platební údaje / číslo účtu,
- přesná adresa sálu (Závodní klub PO Lighting Czech),
- ověření finální domény,
- ověření přiřazení fotek lektorek (Pístecká / Petřeková).
