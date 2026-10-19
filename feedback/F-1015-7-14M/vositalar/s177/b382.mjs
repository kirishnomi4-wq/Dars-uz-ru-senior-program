import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:m12-03-v1', JSON.stringify({ screen: 2, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 19, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m12-03', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
await p.waitForTimeout(1200); await p.locator('.q-bashorat .q-chip').nth(2).click(); await p.waitForTimeout(1500);
await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-382-hozir-s2.jpg', type: 'jpeg', quality: 72 }); await b.close();
