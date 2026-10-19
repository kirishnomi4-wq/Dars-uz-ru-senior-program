import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const W of [1280, 390]) {
const ctx = await b.newContext({ viewport: { width: W, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('pm-m9d8-platforma', JSON.stringify({ trek: 'mobil' })); localStorage.setItem('ccProgress:m12-04-v1', JSON.stringify({ screen: 8, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 12, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m12-04', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
await p.waitForTimeout(1200);
for (let i = 0; i < 3; i++) { await p.locator('.q-blok-q.joriy .q-btn').last().click().catch(() => {}); await p.waitForTimeout(400); }
const t = await p.evaluate(() => { const c = document.querySelector('.q-blok-q.joriy'); if (!c) return 'joriy yoq'; const r = c.getBoundingClientRect(); let n = 0; c.querySelectorAll('*').forEach(e => { if (e.getBoundingClientRect().right > r.right + 2) n++; }); return n; });
console.log(W, 'kartadan chiqqan elementlar:', t);
await p.locator('.q-blok-q.joriy').scrollIntoViewIfNeeded().catch(() => {});
await p.screenshot({ path: `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-384-keyin-${W}.jpg`, type: 'jpeg', quality: 72 }); await ctx.close(); }
await b.close();
