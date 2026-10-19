import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('pm-m9d8-platforma', JSON.stringify({ trek: 'web' })); localStorage.setItem('ccProgress:m12-03-v1', JSON.stringify({ screen: 13, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 19, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m12-03', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
await p.waitForTimeout(1300);
for (let i = 0; i < 4; i++) { const k = p.locator('.q-blok-q.joriy .q-btn').last(); if (!(await p.locator('.tz-ok').count())) { await k.click().catch(() => {}); await p.waitForTimeout(500); } }
const inp = p.locator('.tz-ok input'); console.log('maydon', await inp.count());
const v1 = ['23', '323', '23', '2323', '']; for (let i = 0; i < 5; i++) await inp.nth(i).fill(v1[i]);
await p.locator('.tz-ok-amal .q-btn').click(); await p.waitForTimeout(300); console.log('1:', await p.locator('.tz-ok-x').innerText().catch(() => '-'));
await inp.nth(4).fill('480'); await p.locator('.tz-ok-amal .q-btn').click(); await p.waitForTimeout(300); console.log('2:', await p.locator('.tz-ok-x').innerText().catch(() => '-'));
await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-381-keyin.jpg', type: 'jpeg', quality: 72 });
await inp.nth(1).fill('3,2'); await p.locator('.tz-ok-amal .q-btn').click(); await p.waitForTimeout(300); console.log('3:', await p.locator('.tz-ok-x').count(), await p.locator('.tz-ok-ok').innerText().catch(() => '-'), 'xato', err);
await b.close();
