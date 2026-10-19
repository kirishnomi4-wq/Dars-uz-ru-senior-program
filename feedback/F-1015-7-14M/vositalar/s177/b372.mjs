import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-372-hozir/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const sc of [2, 3]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript((sc) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m12d1-v2', JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 10, savedAt: Date.now() })); }, sc);
  await p.goto('http://localhost:5300/#/lesson/m12-01', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
  await p.waitForTimeout(1200); await p.locator('.q-bashorat .q-chip').first().click().catch(() => {}); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${D}d-uz-s${sc}-taxmin.jpg`, type: 'jpeg', quality: 72 }); await ctx.close();
}
await b.close(); console.log('ok');
