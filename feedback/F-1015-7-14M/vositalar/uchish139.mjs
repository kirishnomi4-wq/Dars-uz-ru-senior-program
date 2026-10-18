import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
await p.addInitScript(() => localStorage.setItem('ccProgress:m8-09-v1', JSON.stringify({ screen: 5, answers: {}, earned: [], total: 12, savedAt: Date.now() })));
await p.goto('http://localhost:5300/#/lesson/m8-09'); await p.waitForSelector('.lesson-root'); const k = p.getByText(/Kodsiz/); if (await k.count()) await k.first().click().catch(() => {}); await p.waitForTimeout(2000);
const ch = p.locator('.pr-qadam .q-chip'); const n = await ch.count(); let t = null;
for (let i = 0; i < n; i++) { const tx = await ch.nth(i).innerText(); if (/bandlar ro/.test(tx)) t = ch.nth(i); }
await t.click(); const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-139-keyin'; 
await p.waitForTimeout(120); await p.screenshot({ path: D + '/m8-09-s6-uchish-1.jpg', type: 'jpeg', quality: 80 });
await p.waitForTimeout(150); await p.screenshot({ path: D + '/m8-09-s6-uchish-2.jpg', type: 'jpeg', quality: 80 });
await p.waitForTimeout(600); await p.screenshot({ path: D + '/m8-09-s6-uchish-3.jpg', type: 'jpeg', quality: 80 });
console.log(n, await p.locator('.pr-uchar').count()); await b.close();
