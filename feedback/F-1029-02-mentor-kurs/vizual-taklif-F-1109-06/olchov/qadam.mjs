import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [DARS, N, OUT] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto(`https://coddycamp-mentor-kurs.vercel.app/mentor-kurs.html?dars=${DARS}&s=${N - 1}`, { waitUntil: 'load' }); await p.waitForSelector('.mk-stage');
const m = await p.$('.mk-audio button'); if (m) await m.click();
for (let k = 0; k < 8; k++) { await p.waitForTimeout(1800); await p.screenshot({ path: `${OUT}-q${k}.png` }); const nx = await p.$('button:text-matches("^(Keyingi qadam)")'); if (!nx) break; await nx.click(); }
await b.close();
