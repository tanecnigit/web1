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

- **Data jsou v Google Tabulce** v Google účtu školy. Formulář na webu posílá přihlášky skriptu u tabulky (`apps-script/Code.gs`), ten je zapíše jako nový řádek a pošle škole e-mail „Nová přihláška“.
- **Adresa skriptu** je v `src/data/backend.js` (je veřejná, patří do webu).
- **Administrace:** `/admin` (na GitHub Pages `/web1/admin/`): seznam přihlášek, hledání, filtr a změna stavu, interní poznámky, export do Excelu (CSV) a mazání. Vše se zapisuje přímo do tabulky; úpravy provedené v tabulce se v administraci ukážou po obnovení.
- **Kdo je správce:** každý, s kým je tabulka nasdílená jako *Editor* (a vlastník). Přidat: v tabulce *Sdílet* → zadat e-mail → *Editor*. Odebrat: tamtéž odebrat, přístup zanikne okamžitě.
- **Přihlášení:** správce zadá svůj e-mail a dostane šestimístný kód (platí 10 minut). Pak zůstane přihlášený 180 dní. Žádná hesla.
- **Aplikace v mobilu:** administraci jde přidat na plochu telefonu jako aplikaci „Přihlášky“ (`public/admin/manifest.webmanifest`). Android/Chrome: ⋮ → *Nainstalovat aplikaci*. iPhone/Safari: Sdílet → *Přidat na plochu*.

### Co se v tabulce smí

- Řadit, filtrovat, barvit, přidávat vlastní sloupce, mazat řádky, měnit stav i poznámky – administrace si to přečte.
- **Neměnit názvy sloupců v prvním řádku** (jsou chráněné varováním) a neměnit hodnoty ve sloupci *ID*.

### Nastavení (jednorázově, v Google účtu školy)

1. Na [sheets.new](https://sheets.new) vytvořte tabulku a pojmenujte ji např. „Přihlášky – taneční kurz“.
2. V tabulce *Rozšíření → Apps Script*. Smažte předvyplněný kód, vložte celý obsah `apps-script/Code.gs` a uložte (Ctrl+S). Projekt pojmenujte „Přihlášky“.
3. Nahoře vyberte funkci **setup** → *Spustit*. Google se zeptá na oprávnění: vyberte účet → „Google tuto aplikaci neověřil“ → *Rozšířená nastavení* → *Přejít na Přihlášky* → *Povolit*. (Jde o váš vlastní skript, varování se ukáže jen jednou.)
4. *Nasadit → Nové nasazení* → ozubené kolo → *Webová aplikace*. **Spustit jako: Já**, **Kdo má přístup: Kdokoli** → *Nasadit*. Zkopírujte adresu webové aplikace (končí na `/exec`).
5. Adresu vložte do `src/data/backend.js` (`scriptUrl`) a web znovu nasaďte.
6. V tabulce *Sdílet* přidejte jako *Editor* všechny, kdo mají vidět přihlášky.

**Po úpravě skriptu** je potřeba nová verze nasazení: *Nasadit → Spravovat nasazení* → tužka → *Verze: Nová verze* → *Nasadit* (adresa zůstane stejná).

**Změna domény webu:** v `apps-script/Code.gs` upravit `ADMIN_URL` (odkaz v e-mailech) a nasadit novou verzi.

**Ztracený telefon:** v Apps Scriptu spustit funkci `logoutEveryone` – odhlásí všechny správce na všech zařízeních.

**Účet Google školy:** Google maže osobní účty nepoužité 2 roky. Otevření tabulky nebo Gmailu se počítá jako použití, takže při kurzu jednou ročně to nehrozí. Doporučujeme v účtu nastavit záložní e-mail (přijdou na něj případná upozornění).

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
