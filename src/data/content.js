/*
 * Veškerý obsah webu na jednom místě.
 * Údaje označené `TODO:` v podkladech chyběly – doplňte je, než web zveřejníte.
 * Meta popis a strukturovaná data (JSON-LD) se skládají z těchto údajů automaticky.
 */

import groupPhoto from '../assets/photos/skupina.jpg';
import photoPistecka from '../assets/photos/lektor-pistecka.png';
import photoPetrekova from '../assets/photos/lektor-petrekova.jpg';
import photoPetrek from '../assets/photos/lektor-petrek.jpg';

export const site = {
  name: 'Taneční škola Nový Jičín',
  courseName: 'Základní kurz taneční a společenské výchovy',
  since: 1996,
  url: 'https://www.tanecninovyjicin.cz', // TODO: ověřit finální doménu
  title: 'Taneční škola Nový Jičín | Základní kurz taneční a společenské výchovy',
  description:
    'Taneční kurzy pro středoškoláky v Novém Jičíně od roku 1996. 12 lekcí, každé pondělí 18:00–20:00, zahájení 14. 9. 2026, cena 2 500 Kč za osobu.',
};

export const course = {
  startDate: '2026-09-14',
  startLabel: '14. září 2026',
  startShort: '14. 9. 2026',
  day: 'každé pondělí',
  time: '18:00–20:00',
  lessons: 12,
  extendedLesson: 6,
  finalLesson: 12,
  price: '2 500 Kč',
  priceValue: 2500,
  priceNote: 'za osobu',
  // TODO: výše zápisného (zálohy) a platební údaje (číslo účtu) nejsou v podkladech uvedeny
  deposit: null,
  depositPlaceholder: 'Výši zápisného a platební údaje vám sdělíme po přijetí přihlášky.',
  stornoDeadline: '30. 6. 2026',
};

export const venue = {
  name: 'Závodní klub PO Lighting Czech',
  formerly: 'dříve Varroc, Visteon-Autopal, Autopal',
  city: 'Nový Jičín',
  // TODO: doplnit přesnou adresu sálu – v podkladech chybí
  address: null,
  addressPlaceholder: 'Přesnou adresu sálu doplníme.',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Závodní klub PO Lighting Czech, Nový Jičín'),
};

export const contact = {
  person: 'Eduard Petřek',
  role: 'Přihlášky a platby',
  ico: '24390950',
  phone: '603 558 449',
  phoneHref: 'tel:+420603558449',
  email: 'info@tanecninovyjicin.cz',
};

/* Odeslání přihlášky:
 * – je-li vyplněn `endpoint` (např. Formspree, Netlify Forms nebo vlastní skript), formulář se odešle POSTem jako JSON,
 * – jinak se otevře e-mailový klient s předvyplněnou zprávou na `contact.email`.
 */
export const signupForm = {
  endpoint: null, // TODO: doplnit URL pro příjem přihlášek
};

export const nav = [
  { href: '#kurz', label: 'Kurz' },
  { href: '#termin', label: 'Termín a cena' },
  { href: '#lektori', label: 'Lektoři' },
  { href: '#otazky', label: 'Otázky' },
  { href: '#kontakt', label: 'Kontakt' },
];

export const cta = { href: '#prihlaska', label: 'Chci přihlášku' };

export const hero = {
  titleLines: ['Taneční Škola', 'Nový Jičín'],
  lead: 'Základní kurz taneční a společenské výchovy pro studenty středních škol.',
};

export const intro = {
  title: 'Vážení mladí přátelé,',
  paragraphs: [
    'nastal čas, kdy začínáte uvažovat o tanečních v příštím školním roce. Rádi vás přivítáme v našem základním kurzu taneční a společenské výchovy.',
    'Kurz má dvanáct lekcí včetně prodloužené (6. lekce) a závěrečné (12. lekce). Scházíme se jednou týdně, vždy v pondělí od 18:00 do 20:00, v sále Závodního klubu PO Lighting Czech v Novém Jičíně.',
  ],
  image: {
    src: groupPhoto,
    alt: 'Účastníci tanečního kurzu ve společenském oblečení při společném focení v sále',
  },
};

export const facts = [
  { value: String(site.since), label: 'učíme taneční v Novém Jičíně' },
  { value: '12', label: 'lekcí včetně prodloužené a závěrečné' },
  { value: '2 h', label: 'výuky každé pondělí večer' },
  { value: '3', label: 'zkušení lektoři' },
];

export const curriculum = {
  title: 'Co se u nás naučíte',
  lead: 'Kromě tanců si projdeme i základní pravidla společenského chování – ověříte si, jak vystupovat na veřejnosti a ve společnosti.',
  items: [
    {
      icon: 'standard',
      tone: 'pink',
      title: 'Standardní tance',
      text: 'Základy klasických párových tanců, správné držení, vedení a pohyb po parketu.',
    },
    {
      icon: 'latin',
      tone: 'sky',
      title: 'Latinskoamerické tance',
      text: 'Rytmus, energie a radost z pohybu – základní kroky a figury latinskoamerických tanců.',
    },
    {
      icon: 'folk',
      tone: 'violet',
      title: 'Národně-společenské tance',
      text: 'Tance, které na žádném českém plese nesmí chybět.',
    },
    {
      icon: 'etiquette',
      tone: 'peach',
      title: 'Společenské chování',
      text: 'Základní pravidla etikety: jak se představit, vyzvat k tanci a vystupovat ve společnosti s jistotou.',
    },
  ],
};

export const audience = {
  title: 'Pro koho je kurz',
  text: 'Kurz navštěvují studenti středních škol nejen z Nového Jičína, ale také z Kopřivnice, Příbora, Frenštátu pod Radhoštěm a dalších míst v okolí.',
  places: ['Nový Jičín', 'Kopřivnice', 'Příbor', 'Frenštát p. R.'],
};

export const lessonPlan = {
  title: 'Jak kurz probíhá',
  lead: 'Dvanáct pondělních večerů po dvou hodinách. Dvě lekce jsou slavnostní – prodloužená v polovině kurzu a závěrečná na jeho konci.',
  steps: [
    { from: 1, to: 5, range: '1.–5. lekce', title: 'Pravidelná výuka', text: 'Základní kroky tanců a pravidla společenského chování.' },
    { from: 6, to: 6, range: '6. lekce', title: 'Prodloužená', text: 'Slavnostní lekce v polovině kurzu.', highlight: true },
    { from: 7, to: 11, range: '7.–11. lekce', title: 'Pravidelná výuka', text: 'Pokračování výuky tanců a společenského chování.' },
    { from: 12, to: 12, range: '12. lekce', title: 'Závěrečná', text: 'Slavnostní zakončení celého kurzu.', highlight: true },
  ],
};

export const lecturers = {
  title: 'Lektoři kurzu',
  lead: 'Základní kurz taneční a společenské výchovy v Novém Jičíně vyučujeme již od roku 1996. Kurz vedou bývalí soutěžní tanečníci, kteří se dnes věnují trénování.',
  people: [
    {
      name: 'Bc. Miroslava Pístecká',
      // TODO: ověřit přiřazení fotografie (soubor 301ab711-….png)
      photo: photoPistecka,
      role: 'Vede kurz od roku 1996',
      bio: 'Soutěžně tancovala a je zakladatelkou Tanečního klubu Fokus Nový Jičín, kde působila jako hlavní trenérka.',
    },
    {
      name: 'Radana Petřeková',
      // TODO: ověřit přiřazení fotografie (soubor e8588374….jpeg)
      photo: photoPetrekova,
      role: 'Lektorka od roku 2006',
      bio: 'Po ukončení soutěžní činnosti se věnuje trénování.',
    },
    {
      name: 'Eduard Petřek',
      photo: photoPetrek,
      role: 'Lektor od roku 2006',
      bio: 'Po ukončení soutěžní činnosti se věnuje trénování. Má na starosti přihlášky a platby.',
    },
  ],
};

export const signup = {
  lead: 'Vyplňte přihlášku a my se vám ozveme s dalšími informacemi. Místo v kurzu je potvrzené ve chvíli, kdy je na náš účet připsáno zápisné.',
};

export const terms = {
  storno: {
    title: 'Storno podmínky',
    items: [
      'Žák je do kurzu zařazen ve chvíli, kdy je na účet připsáno zápisné (záloha).',
      'Při odhlášení do 30. 6. 2026 vracíme celou zaplacenou částku včetně zálohy.',
      'Při odhlášení po zařazení do kurzu a po 30. 6. 2026 se zápisné rovná stornovacímu poplatku.',
      'Po zahájení kurzu se kurzovné již nevrací.',
    ],
  },
  gdpr: {
    title: 'Ochrana osobních údajů (GDPR)',
    items: [
      'Zpracováváme tyto osobní údaje: jméno, příjmení, adresu, e-mail, číslo mobilního telefonu, datum narození a školu (dále jen „kontaktní údaje“).',
      'Kontaktní údaje uchováváme a neposkytujeme je třetím stranám, a to ani za úplatu. Po skončení kurzu je na vyžádání smažeme.',
      'Odesláním přihlášky souhlasíte s pořizováním zvukových a obrazových záznamů a fotografií pro prezentaci taneční školy na webových stránkách a sociálních sítích.',
    ],
  },
  liability: {
    title: 'Odpovědnost za škody',
    items: [
      'Účastníci odpovídají za škody, které způsobí na vybavení sálu, hudební aparatuře nebo vybavení hudebníků – ať už nešťastnou náhodou, nezodpovědným chováním, či úmyslně.',
    ],
  },
  agreement:
    'Odesláním přihlášky souhlasíte se storno podmínkami, zpracováním osobních údajů (GDPR) a podmínkami odpovědnosti za škody.',
};

export const faq = {
  title: 'Na co se často ptáte',
  items: [
    {
      q: 'Kdy a kde kurz probíhá?',
      a: 'Každé pondělí od 18:00 do 20:00 v sále Závodního klubu PO Lighting Czech (dříve Varroc, Visteon-Autopal, Autopal) v Novém Jičíně. První lekce je 14. září 2026.',
    },
    {
      q: 'Kolik lekcí kurz má?',
      a: 'Celkem dvanáct, včetně prodloužené (6. lekce) a závěrečné (12. lekce).',
    },
    {
      q: 'Kolik kurz stojí?',
      a: 'Cena kurzu je 2 500 Kč za osobu.',
    },
    {
      q: 'Kdy je moje místo v kurzu potvrzené?',
      a: 'Do kurzu jste zařazeni ve chvíli, kdy je na náš účet připsáno zápisné (záloha). Informace k platbě vám poskytne Eduard Petřek.',
    },
    {
      q: 'Co když se budu muset odhlásit?',
      a: 'Při odhlášení do 30. 6. 2026 vracíme celou částku včetně zálohy. Po tomto datu se zápisné rovná stornovacímu poplatku a po zahájení kurzu se kurzovné již nevrací.',
    },
    {
      q: 'Kdo kurz navštěvuje?',
      a: 'Především studenti středních škol z Nového Jičína a okolí – například z Kopřivnice, Příbora nebo Frenštátu pod Radhoštěm.',
    },
  ],
};

export const closing = {
  lines: ['Uvidíme se', 'na parketu.'],
};
