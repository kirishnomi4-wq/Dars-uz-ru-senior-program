// sayt-smoke — modul QA saytining har darsi uz va ru da ochiladimi (pageerror yo'q, .lesson-root chizildi).
// 5-Modul site-smoke + live-smoke birlashtirildi (04.10, konveyer).
//   Lokal (build'dan keyin):  SAYT_DIR=dist-m5 KEYS=m5-01,m5-02 node konveyer/vositalar/sayt-smoke.mjs
//   Jonli (deploy'dan keyin): SAYT_URL=https://coddycamp-5modul.vercel.app KEYS=m5-01,m5-02 node konveyer/vositalar/sayt-smoke.mjs
// Chiqish kodi: birorta dars ochilmasa yoki pageerror bo'lsa — 1.
import { chromium } from 'playwright-core';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';

const KEYS = (process.env.KEYS || '').split(',').map(s => s.trim()).filter(Boolean);
if (!KEYS.length) { console.log('KEYS bering: KEYS=m5-01,m5-02,…'); process.exit(2); }
const URL0 = process.env.SAYT_URL;
const DIR = process.env.SAYT_DIR && path.resolve(process.env.SAYT_DIR);
if (!URL0 && !DIR) { console.log('SAYT_URL (jonli) yoki SAYT_DIR (lokal dist) bering'); process.exit(2); }
const PORT = 5391;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
let srv = null;
if (!URL0) {
  srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    const f = path.join(DIR, p); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(PORT);
}
const base = URL0 || `http://localhost:${PORT}`;
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
let bad = 0;
for (const lang of ['uz', 'ru']) {
  for (const k of KEYS) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); const pg = await ctx.newPage(); const errs = [];
    pg.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
    await pg.addInitScript(l => { localStorage.setItem('cc_lang', l); }, lang);
    await pg.goto(`${base}/#/${k}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
    let ok = true; try { await pg.waitForSelector('.lesson-root', { timeout: 15000 }); } catch { ok = false; }
    const h = ok ? await pg.locator('.lesson-root h1, .lesson-root h2').first().innerText().catch(() => '') : '';
    if (!ok || errs.length) bad++;
    console.log(lang, k, ok ? 'ochildi' : 'OCHILMADI', errs.length ? 'XATO ' + errs.join('|') : '', (h || '').slice(0, 50).replace(/\n/g, ' '));
    await ctx.close();
  }
}
await b.close(); if (srv) srv.close();
console.log(bad ? `NUQSON: ${bad} holat` : `TOZA: ${KEYS.length * 2}/${KEYS.length * 2}`);
process.exit(bad ? 1 : 0);
