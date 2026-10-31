// ISHLATISH (serverlar: tts :5332, vite :5333): node dev/surat-segment.mjs <chiqish-papka> [0,1,…] — Nest-2: har ekranning har segmenti suratga olinadi (ko'rik sahifasi uchun)
// Ovoz 4× tezlikda ijro etiladi; segment almashganda (.mk-dots i.on) 0.8 s kutib suratga olinadi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const out = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(',').map(Number) : [...Array(29).keys()];
const MC = { 6: 1, 17: 2, 21: 0 }; // tekshiruv: to'g'ri variant (0-based ekran → variant)
const LC = { 13: 12 };            // qaysi satr: to'g'ri satr
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
  await page.goto(`http://localhost:5333/mentor-kurs.html?dars=nest-02&s=${i}`, { waitUntil: 'load' });
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
  if (i === 12) { const r = await page.$$('.mk-req button'); if (r.length) { await r[r.length - 1].click(); await page.waitForTimeout(900); await shot(i, k++); } }
  if (i === 27) { const o = await page.$$('.mk-opt'); if (o[1]) { await o[1].click(); await page.waitForTimeout(1200); await shot(i, k++); } }
  console.log(`ekran ${i + 1}: ${k} surat`);
  fs.writeFileSync(mf, JSON.stringify(manifest));
}
console.log('xatolar:', errs.slice(0, 5));
await b.close();
