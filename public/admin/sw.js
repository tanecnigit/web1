// Service worker administrace – umožní instalaci jako aplikace.
// Nic neukládá do mezipaměti (data o přihláškách vždy jdou přímo ze sítě),
// jen při výpadku připojení ukáže srozumitelnou hlášku místo chyby prohlížeče.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const offline = `<!doctype html><html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Bez připojení</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#fff;
font:16px/1.5 system-ui,sans-serif;text-align:center;padding:1.5rem}p{color:#8a8a8a}
button{margin-top:1rem;padding:.7rem 1.2rem;border:0;border-radius:10px;background:#fff;color:#000;font:inherit}</style>
</head><body><div><h1>Jste offline</h1><p>Přihlášky se načtou, jakmile bude telefon připojený k internetu.</p>
<button onclick="location.reload()">Zkusit znovu</button></div></body></html>`;

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(
      () => new Response(offline, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }),
    ),
  );
});
