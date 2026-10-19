// Ko'p ekran surati: LIST = "key|lid|n|sc|holat" (holat: j = jarayon (1-chip), b = bosh, d = tugagan seed)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/' + process.env.OUT + '/'; mkdirSync(D, { recursive: true });
const W = +(process.env.W || 1280);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const it of process.env.LIST.trim().split(/\s+/)) {
  const [key, lid, n, s, h] = it.split('|'); const sc = +s;
  const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const err = []; p.on('pageerror', e => err.push(e.message));
  const ans = { 0: { stage: 'hook', picked: 'a' } }; if (h === 'd') ans[sc] = { correct: true, picked: true, solved: true, saqlandi: true, stage: 'tushuncha', screenIdx: sc };
  await p.addInitScript(([sc, lid, n, ans]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: ans, earned: [], total: n, savedAt: Date.now() })); }, [sc, lid, +n, ans]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  await p.locator('[data-live=self]').first().click({ timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(1300);
  if (h === 'j') { const c = p.locator('.q-bashorat .q-chip:not([disabled])').first(); if (await c.count()) { await c.click().catch(() => {}); await p.waitForTimeout(1300); } }
  if (process.env.FULL) { await p.setViewportSize({ width: W, height: 1500 }); await p.waitForTimeout(300); }
  await p.screenshot({ path: `${D}${key}-s${sc}-${h}${W < 500 ? '-m' : ''}.jpg`, type: 'jpeg', quality: 68 });
  console.log(key, sc, h, err.slice(0, 1).join(''));
  await ctx.close();
}
await b.close();
