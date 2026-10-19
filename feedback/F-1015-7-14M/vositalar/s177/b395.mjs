import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const cases = [['m12-04', 'm12-04-v1', 12, 8, null], ['m11-05', 'm11-05-v1', 12, 3, null], ['m9-07', 'm9-07-v1', 18, 16, null], ['m12-03', 'm12-03-v1', 19, 13, null]];
for (const W of [1280, 390]) for (const [key, lid, n, sc, hook] of cases) {
  const ctx = await b.newContext({ viewport: { width: W, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const err = []; p.on('pageerror', e => err.push(e.message));
  await p.addInitScript(([sc, lid, n]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: n, savedAt: Date.now() })); }, [sc, lid, n]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  await p.locator('[data-live=self]').first().click({ timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(1200); const c = p.locator('.q-bashorat .q-chip:not([disabled])').first(); if (await c.count()) { await c.click(); await p.waitForTimeout(800); }
  await p.waitForTimeout(2200);
  const r = await p.evaluate(() => [...document.querySelectorAll('.zoomable')].map(z => (z.querySelector(':scope > .zoom-btn') ? 'BOR' : 'yoq') + ':' + Math.round(z.getBoundingClientRect().width)));
  console.log(W, key, 's' + sc, JSON.stringify(r), err.slice(0, 1).join(''));
  await ctx.close();
}
await b.close();
