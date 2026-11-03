// ISHLATISH (serverlar: tts :5332, vite :5333): node dev/surat-segment.mjs <chiqish-papka> [0,1,…] — Nest-2: har ekranning har segmenti suratga olinadi (ko'rik sahifasi uchun)
// Ovoz 4× tezlikda ijro etiladi; segment almashganda (.mk-dots i.on) 0.8 s kutib suratga olinadi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const out = process.argv[2];
// Darsga xos: DARS=pg-01 node dev/surat-segment.mjs … (standart — nest-02)
const DARS = process.env.DARS || 'nest-02';
const CFG = {
  'nest-02': { N: 29, MC: { 6: 1, 17: 2, 21: 0 }, LC: { 13: 12 }, REQ: 12, TEST: 27 },
  'pg-01': { N: 29, MC: { 5: 2, 13: 0, 21: 1 }, LC: { 16: 2 }, REQ: -1, TEST: 27 },
  'pg-02': { N: 28, MC: { 5: 0, 8: 2, 12: 1 }, LC: { 21: 3 }, REQ: -1, TEST: 26 },
  'jest-01': { N: 26, MC: { 3: 2, 14: 1, 18: 3 }, LC: { 10: 5 }, REQ: -1, TEST: 24 },
  'jest-02': { N: 24, MC: { 3: 1, 14: 0, 17: 2 }, LC: { 10: 1 }, REQ: -1, TEST: 22 },
  'cicd-01': { N: 25, MC: { 4: 2, 17: 1, 20: 0 }, LC: { 12: 10 }, REQ: -1, TEST: 23 },
  'cicd-02': { N: 25, MC: { 4: 1, 14: 2, 19: 3 }, LC: { 10: 10 }, REQ: -1, TEST: 23 },
  'tgpg-01': { N: 25, MC: { 4: 1, 7: 2, 20: 3 }, LC: { 15: 2 }, REQ: -1, TEST: 23 },
  'ws1-01': { N: 22, MC: { 3: 3, 11: 2, 15: 0 }, LC: { 7: 4 }, REQ: -1, TEST: 20 },
  'ws2-01': { N: 20, MC: { 5: 1, 10: 0, 14: 2 }, LC: { 7: 2 }, REQ: -1, TEST: 18 },
  'wh-01': { N: 20, MC: { 3: 2, 11: 3, 15: 1 }, LC: { 7: 5 }, REQ: -1, TEST: 18 },
}[DARS];
const only = process.argv[3] ? process.argv[3].split(',').map(Number) : [...Array(CFG.N).keys()];
const MC = CFG.MC; // tekshiruv: to'g'ri variant (0-based ekran → variant)
const LC = CFG.LC; // qaysi satr: to'g'ri satr
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await page.addInitScript(() => { const p = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { this.playbackRate = 4; return p.call(this); }; });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
const mf = `${out}/manifest.json`;
const manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
const shot = async (i, k) => { const f = `s${String(i + 1).padStart(2, '0')}-${k}.jpg`; await page.screenshot({ path: `${out}/${f}`, type: 'jpeg', quality: 68 }); manifest[i + 1].push(f); };
const dot = () => page.evaluate(() => { const d = [...document.querySelectorAll('.mk-dots i')]; return { n: d.length, on: d.findIndex((x) => x.classList.contains('on')) }; });
const nextOpen = () => page.evaluate(() => { const x = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); return !!x && !x.disabled; });
for (const i of only) {
  manifest[i + 1] = [];
  await page.goto(`http://localhost:5333/mentor-kurs.html?dars=${DARS}&s=${i}`, { waitUntil: 'load' });
  await page.waitForSelector('.mk-stage'); await page.waitForTimeout(400);
  let k = 0, seen = -1; const t0 = Date.now();
  while (Date.now() - t0 < 90000) {
    const d = await dot();
    if (d.n === 0) break; // segmentsiz ekran (sinov)
    if (d.on > seen) { seen = d.on; await page.waitForTimeout(800); await shot(i, k++); }
    const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click(); await page.waitForTimeout(300); continue; }
    if (seen >= d.n - 1 && (await nextOpen() || Date.now() - t0 > 60000)) break;
    if (seen >= d.n - 1) { const busy = await page.$('text=ustoz gapiryapti'); if (!busy) { await page.waitForTimeout(600); break; } }
    await page.waitForTimeout(120);
  }
  if (k === 0) { await page.waitForTimeout(800); await shot(i, k++); }
  if (MC[i] != null) { const o = await page.$$('.mk-opt'); if (o[MC[i]]) { await o[MC[i]].click(); await page.waitForTimeout(1500); await shot(i, k++); } }
  if (LC[i] != null) { const l = await page.$$('.mk-ln.clk'); if (l[LC[i]]) { await l[LC[i]].click(); await page.waitForTimeout(1500); await shot(i, k++); } }
  if (i === CFG.REQ) { const r = await page.$$('.mk-req button'); if (r.length) { await r[r.length - 1].click(); await page.waitForTimeout(900); await shot(i, k++); } }
  if (i === CFG.TEST) { const o = await page.$$('.mk-opt'); if (o[1]) { await o[1].click(); await page.waitForTimeout(1200); await shot(i, k++); } }
  console.log(`ekran ${i + 1}: ${k} surat`);
  fs.writeFileSync(mf, JSON.stringify(manifest));
}
console.log('xatolar:', errs.slice(0, 5));
await b.close();
