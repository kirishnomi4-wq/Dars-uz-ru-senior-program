// Do/posle: jonli darsning brauzerdagi NUSXASIDA .mk-scene ichini almashtirib suratga oladi. Dars fayllariga tegmaydi.
// node inject.mjs <dars> <ekran-1dan> <mock.html> <chiqish-prefiks>
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'fs';
const [DARS, N, MOCK, OUT] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
await p.goto(`https://coddycamp-mentor-kurs.vercel.app/mentor-kurs.html?dars=${DARS}&s=${N - 1}`, { waitUntil: 'load' }); await p.waitForSelector('.mk-stage');
const m = await p.$('.mk-audio button'); if (m) await m.click();
for (let t = 0; t < 40; t++) { await p.waitForTimeout(300); const a = await p.$('.mk-ask .row button'); if (a) { await a.click(); continue; } const k = await p.$('button:text-matches("^(Keyingi qadam)")'); if (k) { await k.click(); continue; } const r = await p.evaluate(() => { const bb = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); return bb && !bb.disabled; }); if (r) break; }
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}-oldin.png` });
const css = fs.readFileSync(new URL('./z.css', import.meta.url), 'utf8');
const html = '<style>' + css + '</style>' + fs.readFileSync(MOCK, 'utf8');
await p.evaluate((h) => { const sc = document.querySelector('.mk-scene'); sc.innerHTML = h; }, html);
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}-keyin.png` });
const info = await p.evaluate(() => { const sc = document.querySelector('.mk-scene'); const r = sc.getBoundingClientRect(); return { font: getComputedStyle(sc).fontFamily, rect: [r.x, r.y, r.width, r.height].map(Math.round), over: sc.scrollHeight - sc.clientHeight }; });
console.log(JSON.stringify(info));
await b.close();
