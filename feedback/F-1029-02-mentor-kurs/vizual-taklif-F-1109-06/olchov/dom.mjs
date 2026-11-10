import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [DARS, s] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto(`https://coddycamp-mentor-kurs.vercel.app/mentor-kurs.html?dars=${DARS}&s=${s}`, { waitUntil: 'load' }); await p.waitForSelector('.mk-stage');
const m = await p.$('.mk-audio button'); if (m) await m.click();
for (let t = 0; t < 40; t++) { await p.waitForTimeout(300); const k = await p.$('button:text-matches("^(Keyingi qadam)")'); if (k) { await k.click(); continue; } const r = await p.evaluate(() => { const bb = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); return bb && !bb.disabled; }); if (r) break; }
const out = await p.evaluate(() => { const st = document.querySelector('.mk-stage'); const cs = getComputedStyle(st); const body = getComputedStyle(document.body);
  return { html: st.outerHTML.slice(0, 2500), font: body.fontFamily, mono: getComputedStyle(document.querySelector('code') || st).fontFamily, stageBg: cs.backgroundColor, rect: JSON.stringify(st.getBoundingClientRect()) }; });
console.log(JSON.stringify(out, null, 1)); await b.close();
