// Artifact sahifasini lokal ko'rish: skelet bilan o'rab, namunalarni qadam-baqadam suratga oladi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const [DIR, OUT, MODE = 'demos'] = process.argv.slice(2);
const body = fs.readFileSync(`${DIR}/jonli-sahna.html`, 'utf8');
fs.writeFileSync(`${DIR}/preview.html`, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const open = async (w, h, scheme) => { const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme || 'light' }); p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); await p.goto(`file://${DIR}/preview.html`, { waitUntil: 'load' }); await p.waitForTimeout(900); return p; };
if (MODE === 'demos') {
  const p = await open(1280, 900);
  const steps = { dA: [1, 2, 3, 4, 5, 6], dB: [1, 2, 3, 4, 5, 6, 7, 8], dC: [1, 2, 3, 4, 5, 6, 7] };
  const only = (process.env.ONLY || 'dA,dB,dC').split(',');
  for (const id of only) {
    const shot = p.locator(`#${id} .shot`); await shot.scrollIntoViewIfNeeded();
    for (const s of steps[id]) {
      if (s > 1) await p.click(`#${id}-next`);
      if (id === 'dC' && s === 1) { await p.waitForTimeout(300); await shot.screenshot({ path: `${OUT}/${id}-1a.jpg`, type: 'jpeg', quality: 80 }); await p.click('#c-clk'); }
      await p.waitForTimeout(1500);
      await shot.screenshot({ path: `${OUT}/${id}-${s}.jpg`, type: 'jpeg', quality: 80 });
    }
  }
  await p.locator('#cover-shot').scrollIntoViewIfNeeded(); await p.locator('#cover-shot').screenshot({ path: `${OUT}/cover.jpg`, type: 'jpeg', quality: 80 });
}
if (MODE === 'page') {
  for (const [w, h, sc, n] of [[1280, 900, 'light', 'page-l'], [400, 800, 'light', 'page-m'], [1280, 900, 'dark', 'page-d']]) {
    const p = await open(w, h, sc); await p.screenshot({ path: `${OUT}/${n}.jpg`, type: 'jpeg', quality: 60, fullPage: true });
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (ov > 0) errs.push(`${n}: gorizontal toshish ${ov}px`);
  }
}
console.log(JSON.stringify({ errs: errs.slice(0, 8) })); await b.close();
