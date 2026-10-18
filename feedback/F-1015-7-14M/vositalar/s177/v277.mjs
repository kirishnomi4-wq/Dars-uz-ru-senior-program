// F-1015-277: m10-11 2-ekran — «Dalil bor» bosilgach manba oynasi «3 / 3» (eski 4 / 5).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-277-keyin/'; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
p.on('pageerror', e => err.push(e.message));
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m10d11-v1', JSON.stringify({ screen: 2, answers: {}, earned: [], total: 12, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m10-11', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
await p.waitForTimeout(1200);
const bt = p.getByRole('button', { name: /^Dalil bor/ }); if (await bt.count()) { await bt.first().click(); await p.waitForTimeout(2200); } else err.push('Dalil bor yoq');
await p.setViewportSize({ width: 1280, height: 1400 }); await p.waitForTimeout(300);
await p.screenshot({ path: `${D}d-uz-s2-dalil.jpg`, type: 'jpeg', quality: 70 });
console.log('xato', err); await b.close();
