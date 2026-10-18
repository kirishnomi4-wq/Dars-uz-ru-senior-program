// 14-M «keyin» suratlari (213.7): har EKRAN uchun a (taxmindan oldin) va b (chip bosilgach). Ishlatish:
//   KEY=m12-02 LID=pm-m12d2-v1 N=15 OUT=F-1015-306-keyin EKRAN=2,6 [CHIP=0] [W=390] [LANG_DARS=ru] node vB.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, LANG = process.env.LANG_DARS || 'uz', T = (W < 500 ? 'm' : 'd') + '-' + LANG;
const KEY = process.env.KEY, LID = process.env.LID, N = +(process.env.N || 12), OUT = process.env.OUT, CHIP = +(process.env.CHIP || 0);
const EK = process.env.EKRAN.split(',').map(Number);
const D = `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/${OUT}/`; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
for (const sc of EK) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push('s' + sc + ': ' + e.message));
  await p.addInitScript(([sc, LANG, LID, N]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem(`ccProgress:${LID}`, JSON.stringify({ screen: sc, answers: {}, earned: [], total: N, savedAt: Date.now() })); }, [sc, LANG, LID, N]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => err.push('s' + sc + ' lesson-root yoq'));
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200);
  const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); }
  await p.screenshot({ path: `${D}${T}-s${sc}a.jpg`, type: 'jpeg', quality: 70 });
  const l = p.locator('.lesson-root .q-bashorat .q-chip').nth(CHIP);
  if (await l.count()) { await l.click(); await p.waitForTimeout(1400); } else err.push('s' + sc + ' bash yoq');
  await p.screenshot({ path: `${D}${T}-s${sc}b.jpg`, type: 'jpeg', quality: 70 });
  await ctx.close();
}
console.log('xato', err); await b.close();
