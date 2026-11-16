/**
 * ─────────────────────────────────────────────────────────────
 * Taneční škola Nový Jičín – přihlášky v Google Tabulce
 * ─────────────────────────────────────────────────────────────
 * Tento skript patří do Google Tabulky školy (Rozšíření → Apps Script).
 * Přijímá přihlášky z formuláře na webu a obsluhuje administraci.
 *
 * Správci = lidé, se kterými je tabulka nasdílená s právem úprav (Sdílet → Editor).
 * Přihlašují se kódem, který jim skript pošle e-mailem. Žádná hesla.
 *
 * Postup nastavení je v README.md webu (část „Přihlášky – Google Tabulka“).
 * Po každé úpravě tohoto skriptu: Nasadit → Spravovat nasazení → upravit → Verze: Nová verze.
 */

// ───── Nastavení (měnit jen tyto hodnoty) ─────────────────────

/** Kam posílat upozornění na novou přihlášku. Prázdné = vlastník tabulky. Více adres oddělte čárkou. */
const NOTIFY_EMAIL = '';

/** Adresa administrace – odkaz v e-mailech. Po přechodu na vlastní doménu změňte. */
const ADMIN_URL = 'https://tanecnigit.github.io/web1/admin/';

/** Jak dlouho zůstane správce přihlášený (dny). */
const SESSION_DAYS = 180;

// ───── Struktura tabulky ──────────────────────────────────────
// Sloupce se hledají podle názvu – pořadí v tabulce může být libovolné.
// Názvy v prvním řádku ale neměňte.

const SHEET_NAME = 'Přihlášky';

const COLUMNS = {
  created_at: 'Přijato',
  jmeno: 'Jméno',
  prijmeni: 'Příjmení',
  datum_narozeni: 'Datum narození',
  skola: 'Škola',
  adresa: 'Adresa',
  email: 'E-mail',
  telefon: 'Telefon',
  poznamka: 'Poznámka',
  stav: 'Stav',
  interni_poznamka: 'Interní poznámka',
  id: 'ID',
};

const STATUSES = {
  nova: 'Nová',
  zaplaceno: 'Zaplaceno',
  zarazen: 'Zařazen/a',
  odhlasen: 'Odhlášen/a',
};

// ───── Jednorázová příprava tabulky ───────────────────────────

/** Spusťte jednou ručně (v editoru vyberte funkci „setup“ → Spustit). Lze spustit i opakovaně. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Europe/Prague');
  ss.setSpreadsheetLocale('cs_CZ');

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet.getLastRow() > 0) sheet = ss.insertSheet();
    sheet.setName(SHEET_NAME);
  }

  const headers = Object.values(COLUMNS);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  const map = columnMap_(sheet);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold').setBackground('#f3f3f3');

  // Přijato jako datum a čas
  sheet.getRange(2, map.created_at, sheet.getMaxRows() - 1, 1).setNumberFormat('d. m. yyyy h:mm');

  // Stav jako výběr z nabídky
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.values(STATUSES), true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, map.stav, sheet.getMaxRows() - 1, 1).setDataValidation(rule);

  // Řádek s názvy sloupců jen s varováním při úpravě (aby se omylem nepřepsal)
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).protect().setDescription('Názvy sloupců – neměnit').setWarningOnly(true);

  sheet.setColumnWidth(map.id, 80);
  secret_(); // vytvoří tajný klíč pro přihlašování

  return 'Hotovo – tabulka je připravená.';
}

// ───── Vstupní body webové aplikace ───────────────────────────

function doGet() {
  return json_({ ok: true, app: 'prihlasky' });
}

function doPost(e) {
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (req.action) {
      case 'submit':
        return json_(submit_(req.data || {}));
      case 'requestCode':
        return json_(requestCode_(req.email));
      case 'verifyCode':
        return json_(verifyCode_(req.email, req.code));
      case 'list':
        return json_(withAdmin_(req.token, (email) => ({ ok: true, email, rows: list_() })));
      case 'update':
        return json_(withAdmin_(req.token, () => update_(req.id, req.changes || {})));
      case 'delete':
        return json_(withAdmin_(req.token, () => remove_(req.id)));
      default:
        return json_({ ok: false, error: 'unknown' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

// ───── Přihláška z webu ───────────────────────────────────────

function submit_(d) {
  // Past na roboty – tváříme se, že je vše v pořádku
  if (str_(d.web)) return { ok: true };

  const data = {
    jmeno: str_(d.jmeno),
    prijmeni: str_(d.prijmeni),
    datum_narozeni: str_(d.datum_narozeni),
    skola: str_(d.skola),
    adresa: str_(d.adresa),
    email: str_(d.email),
    telefon: str_(d.telefon),
    poznamka: str_(d.poznamka),
  };

  const born = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.datum_narozeni);
  const valid =
    d.souhlas === true &&
    len_(data.jmeno, 1, 100) &&
    len_(data.prijmeni, 1, 100) &&
    len_(data.skola, 1, 200) &&
    len_(data.adresa, 1, 300) &&
    len_(data.email, 3, 200) &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) &&
    data.telefon.replace(/\D/g, '').length >= 9 &&
    len_(data.telefon, 9, 30) &&
    data.poznamka.length <= 2000 &&
    born &&
    Number(born[1]) >= 1900 &&
    new Date(data.datum_narozeni) <= new Date();
  if (!valid) return { ok: false, error: 'invalid' };

  // Ochrana proti zahlcení – nejvýš 40 přihlášek za 10 minut
  const cache = CacheService.getScriptCache();
  const count = Number(cache.get('submits') || 0);
  if (count >= 40) return { ok: false, error: 'rate' };
  cache.put('submits', String(count + 1), 600);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = sheet_();
    const map = columnMap_(sheet);
    const row = new Array(sheet.getLastColumn()).fill('');
    const values = Object.assign({}, data, {
      datum_narozeni: `${Number(born[3])}. ${Number(born[2])}. ${born[1]}`,
      stav: STATUSES.nova,
      interni_poznamka: '',
      id: Utilities.getUuid().slice(0, 8),
    });
    Object.keys(COLUMNS).forEach((key) => {
      if (key === 'created_at') row[map[key] - 1] = new Date();
      else if (key === 'stav') row[map[key] - 1] = values[key];
      else row[map[key] - 1] = text_(values[key]);
    });
    sheet.appendRow(row);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  notify_(data);
  return { ok: true };
}

function notify_(d) {
  try {
    const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    MailApp.sendEmail({
      to,
      replyTo: d.email,
      name: 'Přihlášky – Taneční škola',
      subject: `Nová přihláška: ${d.jmeno} ${d.prijmeni}`,
      body: [
        `Přišla nová přihláška do tanečního kurzu.`,
        ``,
        `Jméno: ${d.jmeno} ${d.prijmeni}`,
        `Škola: ${d.skola}`,
        `E-mail: ${d.email}`,
        `Telefon: ${d.telefon}`,
        d.poznamka ? `Poznámka: ${d.poznamka}` : null,
        ``,
        `Všechny přihlášky: ${ADMIN_URL}`,
        `(Odpovědí na tento e-mail napíšete přímo uchazeči.)`,
      ]
        .filter((l) => l !== null)
        .join('\n'),
    });
  } catch (err) {
    console.error('Upozornění se nepodařilo odeslat', err);
  }
}

// ───── Přihlášení správce kódem z e-mailu ─────────────────────

function requestCode_(rawEmail) {
  const email = str_(rawEmail).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'invalid' };

  const cache = CacheService.getScriptCache();
  const sent = Number(cache.get(`rl:${email}`) || 0);
  if (sent >= 5) return { ok: false, error: 'rate' };
  cache.put(`rl:${email}`, String(sent + 1), 3600);

  // Kdo nemá tabulku nasdílenou, kód nedostane (odpověď je stejná, aby nešlo zjišťovat správce)
  if (!isAdmin_(email)) return { ok: true };

  const code = String(Math.floor(100000 + Math.random() * 900000));
  cache.put(`code:${email}`, JSON.stringify({ code, tries: 0 }), 600);

  MailApp.sendEmail({
    to: email,
    name: 'Přihlášky – Taneční škola',
    subject: `Kód pro přihlášení: ${code}`,
    body: [
      `Váš kód pro přihlášení do administrace přihlášek:`,
      ``,
      `    ${code}`,
      ``,
      `Kód platí 10 minut. Pokud jste o něj nežádali, e-mail ignorujte.`,
      ADMIN_URL,
    ].join('\n'),
  });
  return { ok: true };
}

function verifyCode_(rawEmail, rawCode) {
  const email = str_(rawEmail).toLowerCase();
  const code = str_(rawCode).replace(/\D/g, '');
  const cache = CacheService.getScriptCache();
  const stored = cache.get(`code:${email}`);
  if (!stored) return { ok: false, error: 'expired' };

  const entry = JSON.parse(stored);
  if (entry.code !== code) {
    entry.tries += 1;
    if (entry.tries >= 5) cache.remove(`code:${email}`);
    else cache.put(`code:${email}`, JSON.stringify(entry), 600);
    return { ok: false, error: entry.tries >= 5 ? 'expired' : 'code' };
  }

  cache.remove(`code:${email}`);
  if (!isAdmin_(email)) return { ok: false, error: 'auth' };
  return { ok: true, email, token: makeToken_(email) };
}

function withAdmin_(token, fn) {
  const email = readToken_(token);
  // Oprávnění se ověřuje při každém požadavku – odebráním ze sdílení přístup hned zanikne
  if (!email || !isAdmin_(email)) return { ok: false, error: 'auth' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return fn(email);
  } finally {
    lock.releaseLock();
  }
}

function isAdmin_(email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const emails = ss.getEditors().map((u) => u.getEmail());
  const owner = ss.getOwner();
  if (owner) emails.push(owner.getEmail());
  emails.push(Session.getEffectiveUser().getEmail());
  return emails.some((e) => e && e.toLowerCase() === email);
}

function makeToken_(email) {
  const payload = Utilities.base64EncodeWebSafe(
    JSON.stringify({ e: email, x: Date.now() + SESSION_DAYS * 864e5 }),
    Utilities.Charset.UTF_8,
  );
  return `${payload}.${sign_(payload)}`;
}

function readToken_(token) {
  const parts = str_(token).split('.');
  if (parts.length !== 2 || sign_(parts[0]) !== parts[1]) return null;
  try {
    const data = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString('UTF-8'));
    return data.x > Date.now() ? String(data.e) : null;
  } catch (err) {
    return null;
  }
}

function sign_(payload) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(payload, secret_()));
}

function secret_() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('SECRET');
  if (!secret) {
    secret = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('SECRET', secret);
  }
  return secret;
}

/** Odhlásí všechny správce na všech zařízeních (spustit ručně v editoru, např. při ztrátě telefonu). */
function logoutEveryone() {
  PropertiesService.getScriptProperties().deleteProperty('SECRET');
  secret_();
  return 'Všichni správci byli odhlášeni.';
}

// ───── Administrace: seznam, úpravy, mazání ───────────────────

function list_() {
  const sheet = sheet_();
  const map = columnMap_(sheet);
  const last = sheet.getLastRow();
  if (last < 2) return [];

  const values = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();
  const labels = invert_(STATUSES);
  const rows = [];

  values.forEach((v, i) => {
    const get = (key) => v[map[key] - 1];
    const filled = ['jmeno', 'prijmeni', 'email', 'telefon'].some((k) => str_(get(k)));
    if (!filled) return;

    // Řádek přidaný ručně bez ID dostane ID automaticky
    let id = str_(get('id'));
    if (!id) {
      id = Utilities.getUuid().slice(0, 8);
      sheet.getRange(i + 2, map.id).setValue(id);
    }

    const created = get('created_at');
    const stav = str_(get('stav'));
    rows.push({
      id,
      created_at: created instanceof Date ? created.toISOString() : str_(created),
      jmeno: cell_(get('jmeno')),
      prijmeni: cell_(get('prijmeni')),
      datum_narozeni: cell_(get('datum_narozeni')),
      skola: cell_(get('skola')),
      adresa: cell_(get('adresa')),
      email: cell_(get('email')),
      telefon: cell_(get('telefon')),
      poznamka: cell_(get('poznamka')),
      stav: labels[stav] || stav || 'nova',
      interni_poznamka: cell_(get('interni_poznamka')),
    });
  });

  // Nejnovější nahoře
  return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

function update_(id, changes) {
  const sheet = sheet_();
  const map = columnMap_(sheet);
  const row = findRow_(sheet, map, id);
  if (!row) return { ok: false, error: 'missing' };

  if ('stav' in changes) {
    if (!STATUSES[changes.stav]) return { ok: false, error: 'invalid' };
    sheet.getRange(row, map.stav).setValue(STATUSES[changes.stav]);
  }
  if ('interni_poznamka' in changes) {
    const note = str_(changes.interni_poznamka);
    if (note.length > 2000) return { ok: false, error: 'invalid' };
    sheet.getRange(row, map.interni_poznamka).setValue(text_(note));
  }
  return { ok: true };
}

function remove_(id) {
  const sheet = sheet_();
  const row = findRow_(sheet, columnMap_(sheet), id);
  if (!row) return { ok: false, error: 'missing' };
  sheet.deleteRow(row);
  return { ok: true };
}

// ───── Pomocné funkce ─────────────────────────────────────────

function sheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Chybí list „${SHEET_NAME}“ – spusťte funkci setup.`);
  return sheet;
}

/** { klíč: číslo sloupce } podle názvů v prvním řádku; chybějící sloupec se doplní na konec. */
function columnMap_(sheet) {
  const width = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, width).getValues()[0].map((h) => str_(h));
  const map = {};
  Object.keys(COLUMNS).forEach((key) => {
    let index = headers.indexOf(COLUMNS[key]);
    if (index === -1) {
      index = headers.length;
      headers.push(COLUMNS[key]);
      sheet.getRange(1, index + 1).setValue(COLUMNS[key]);
    }
    map[key] = index + 1;
  });
  return map;
}

function findRow_(sheet, map, id) {
  const value = str_(id);
  if (!value) return 0;
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const match = sheet
    .getRange(2, map.id, last - 1, 1)
    .createTextFinder(value)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

/** Text vždy jako text – apostrof zabrání tomu, aby tabulka z hodnoty udělala vzorec, číslo nebo datum. */
function text_(value) {
  const s = str_(value);
  return s ? `'${s}` : '';
}

function cell_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, 'Europe/Prague', 'd. M. yyyy');
  return str_(value);
}

function str_(value) {
  return value == null ? '' : String(value).trim();
}

function len_(s, min, max) {
  return s.length >= min && s.length <= max;
}

function invert_(obj) {
  const out = {};
  Object.keys(obj).forEach((k) => (out[obj[k]] = k));
  return out;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
