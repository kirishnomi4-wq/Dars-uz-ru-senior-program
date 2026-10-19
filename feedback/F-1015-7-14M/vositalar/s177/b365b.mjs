import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m11d2-v1', JSON.stringify({ screen: 4, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 15, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m11-02', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
await p.waitForTimeout(1200); await p.locator('.q-bashorat .q-chip').first().click(); await p.waitForTimeout(900);
for (let i = 0; i < 5; i++) { await p.getByRole('button', { name: i % 2 ? 'Mos keladi' : 'Hozir mos emas', exact: true }).click(); await p.waitForTimeout(2300); const k = p.getByRole('button', { name: /Keyingi yo'l/ }); if (await k.count()) { await k.click(); await p.waitForTimeout(700); } }
await p.waitForTimeout(2000);
console.log('yakun:', await p.locator('.ms-qaror-j').innerText().catch(() => '-'), 'xato', err);
await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-365-pilot-3-yakun.jpg', type: 'jpeg', quality: 72 });
await b.close();
