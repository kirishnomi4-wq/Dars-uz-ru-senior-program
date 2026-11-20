// Nest-1 ekranlarini har segmentda suratga oladi; act (yonib turgan so'z) va ask (o'ylab ko'ring) ni o'zi bosadi.
// node n1-surat.mjs <out> <ekranlar 0-based, vergul bilan> [VW VH] [lang]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const [OUT, LIST, VW = '1600', VH = '900', LANG = 'uz'] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await b.newPage({ viewport: { width: +VW, height: +VH } });
await page.addInitScript(() => { const p = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { this.playbackRate = 3; return p.call(this); }; });
const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
const ovf = () => page.evaluate(() => { const r = []; document.querySelectorAll('.mk-scene, .mk-ide-main').forEach((e) => { const d = e.scrollHeight - e.clientHeight; if (d > 4) r.push((e.className.split(' ')[0]) + ':' + d); }); const w = document.documentElement.scrollWidth - document.documentElement.clientWidth; if (w > 0) r.push('sahifa-eni:' + w);
  if (window.scrollY > 0 || document.scrollingElement.scrollTop > 0) r.push('SAHIFA-SILJIGAN');
  document.querySelectorAll('.mk-ln.hl').forEach((l) => { let n = l.parentElement; while (n && !(n.scrollHeight > n.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(n).overflowY))) n = n.parentElement; if (!n) return; const a = l.getBoundingClientRect(), b = n.getBoundingClientRect(); if (a.bottom > b.bottom + 2 || a.top < b.top - 2) r.push('YASHIRIN-YORITILGAN'); });
  return r.join(' '); });
const OV = [];
const dot = () => page.evaluate(() => { const d = [...document.querySelectorAll('.mk-dots i')]; return { n: d.length, on: d.findIndex((x) => x.classList.contains('on')) }; });
const res = [];
for (const s of LIST.split(',').map(Number)) {
  await page.goto(`http://localhost:5333/mentor-kurs.html?dars=${process.env.DARS || 'nest-01'}&s=${s}&lang=${LANG}`, { waitUntil: 'load' });
  await page.waitForSelector('.mk-stage', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(700);
  const name = `e${String(s + 1).padStart(2, '0')}-${VW}`;
  let seen = -1; const t0 = Date.now(); let actDone = false;
  while (Date.now() - t0 < 120000) {
    const d = await dot();
    if (d.n === 0) { await page.waitForTimeout(800); await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 72 }); res.push(name); break; }
    if (d.on > seen) { seen = d.on; await page.waitForTimeout(1300); await page.screenshot({ path: `${OUT}/${name}-s${seen + 1}.jpg`, type: 'jpeg', quality: 72 }); res.push(`${name}-s${seen + 1}`); const o = await ovf(); if (o) OV.push(`${name}-s${seen + 1} ${o}`); }
    const hint = await page.$('.n1-acthint');
    if (hint && !actDone) { const a = await page.$('.n1-act'); if (a) { await a.click(); actDone = true; await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/${name}-s${seen + 1}-bosildi.jpg`, type: 'jpeg', quality: 72 }); res.push('bosildi'); } }
    const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click(); await page.waitForTimeout(300); }
    const busy = await page.$('text=ustoz gapiryapti');
    if (seen >= d.n - 1 && !busy) { await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/${name}-oxir.jpg`, type: 'jpeg', quality: 72 }); res.push(`${name}-oxir`); const o = await ovf(); if (o) OV.push(`${name}-oxir ${o}`); break; }
    await page.waitForTimeout(150);
  }
}
console.log(JSON.stringify({ n: res.length, errs: errs.slice(0, 5), toshish: OV }));
await b.close();
