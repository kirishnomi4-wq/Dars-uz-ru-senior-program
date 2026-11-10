// Umumiy surat skripti (02.11, F-1102-22 da yozilgan): BASE/DARS/OUT/jobs; CSS=<fayl> uslub ustidan, LEN=1 gap uzunligi data-len, cover:true muqova. Rasmlar artifact 2oFH2GkLbK1xmSu6eR3FzW da.
// ISHLATISH (serverlar yoqiq bo'lsin): node dev/surat-ekran.mjs <base-url> <dars> <out-papka> '<jobs-json>'
// jobs: [{s:<0-based ekran>, name:"...", acts:["wait","mc:0","lc:3","trouble","check","proof:matn","shot:suffix","seg"]}]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const [BASE, DARS, OUT, JOBS] = process.argv.slice(2);
const PAGE = process.env.PAGE || 'mentor-kurs.html'; // F-1103-02: boshqa sahifa (demo)
const jobs = JSON.parse(JOBS);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await b.newPage({ viewport: { width: Number(process.env.VW) || 1600, height: Number(process.env.VH) || 900 } }); // VW/VH — o'lcham (F-1103-04)
await page.addInitScript(() => { const p = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { this.playbackRate = 16; return p.call(this); }; });
const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
const CSS = process.env.CSS ? fs.readFileSync(process.env.CSS, 'utf8') : '';
if (process.env.LEN) await page.addInitScript(() => { const tag = () => document.querySelectorAll('.mk-key,.mk-title').forEach((el) => { const n = (el.textContent || '').trim().length; el.setAttribute('data-len', n <= 70 ? 'short' : n <= 110 ? 'mid' : 'long'); }); const start = () => { tag(); new MutationObserver(tag).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); }; if (document.readyState !== 'loading') start(); else window.addEventListener('DOMContentLoaded', start, { once: true }); });
const applyCss = async () => { if (CSS) await page.addStyleTag({ content: CSS }); };
const dot = () => page.evaluate(() => { const d = [...document.querySelectorAll('.mk-dots i')]; return { n: d.length, on: d.findIndex((x) => x.classList.contains('on')) }; });
const busy = () => page.$('text=ustoz gapiryapti');
const ask = async () => { const a = await page.$('.mk-ask .row button'); if (a) { await a.click(); await page.waitForTimeout(300); return true; } return false; };
const waitAll = async (onSeg) => {
  const t0 = Date.now(); let seen = -1;
  while (Date.now() - t0 < 90000) {
    const d = await dot(); if (d.n === 0) { await page.waitForTimeout(600); return; }
    if (d.on > seen) { seen = d.on; if (onSeg) { await page.waitForTimeout(700); await onSeg(seen); } }
    if (await ask()) continue;
    if (seen >= d.n - 1 && !(await busy())) { await page.waitForTimeout(500); return; }
    await page.waitForTimeout(120);
  }
};
const res = [];
for (const j of jobs) {
  await page.goto(j.cover ? `${BASE}/${PAGE}?dars=${DARS}` : `${BASE}/${PAGE}?dars=${DARS}&s=${j.s}`, { waitUntil: 'load' });
  await page.waitForSelector(j.cover ? '.mk-cover' : '.mk-stage', { timeout: 15000 }).catch(() => {});
  await applyCss(); await page.waitForTimeout(500);
  let k = 0;
  const shot = async (suffix) => { const f = `${j.name}${suffix ? '-' + suffix : ''}.jpg`; await page.screenshot({ path: `${OUT}/${f}`, type: 'jpeg', quality: 72 }); res.push(f); k++; };
  for (const a of j.acts) {
    const [cmd, arg] = a.split(':');
    if (cmd === 'wait') await waitAll();
    else if (cmd === 'seg') await waitAll((i) => shot(`seg${i + 1}`));
    else if (cmd === 'mc') { const o = await page.$$('.mk-opt'); if (o[+arg]) { await o[+arg].click(); await page.waitForTimeout(1600); } else res.push(`!mk-opt ${arg} yo'q`); }
    else if (cmd === 'lc') { const l = await page.$$('.mk-ln.clk'); if (l[+arg]) { await l[+arg].click(); await page.waitForTimeout(1600); } else res.push(`!mk-ln ${arg} yo'q (${l.length})`); }
    else if (cmd === 'trouble') { const t = (await page.$('.mk-trouble button')) || (await page.$('.mk-trouble')) || (await page.$('span.q')); if (t) { await t.click(); await page.waitForTimeout(900); } else res.push('!trouble yo\'q'); }
    else if (cmd === 'check') { for (const c of await page.$$('.mk-step input[type=checkbox]')) if (!(await c.isChecked())) await c.click(); await page.waitForTimeout(400); }
    else if (cmd === 'proof') { const i = await page.$('.mk-input'); if (i) { await i.fill(a.slice(6)); await page.waitForTimeout(900); } }
    else if (cmd === 'esc') { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
    else if (cmd === 'pause') await page.waitForTimeout(+arg || 1000);
    else if (cmd === 'shot') await shot(arg || '');
  }
  if (k === 0) await shot('');
}
console.log(JSON.stringify({ files: res, errs: errs.slice(0, 5) }));
await b.close();
