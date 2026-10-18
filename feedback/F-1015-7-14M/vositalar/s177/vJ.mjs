// Javob-seed bilan surat (yakun holati): KEY LID N EKRAN=8 ANSWERS='{"8":{"correct":true,"taxmin":"bitta"}}' OUT=… [W=390] [LANG_DARS=ru] node vJ.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, LANG = process.env.LANG_DARS || 'uz', T = (W < 500 ? 'm' : 'd') + '-' + LANG;
const { KEY, LID, OUT } = process.env; const N = +process.env.N; const EK = process.env.EKRAN.split(',').map(Number); const ANS = JSON.parse(process.env.ANSWERS || '{}');
const D = `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/${OUT}/`; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
for (const sc of EK) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push('s' + sc + ': ' + e.message));
  await p.addInitScript(([sc, LANG, LID, N, ANS]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem(`ccProgress:${LID}`, JSON.stringify({ screen: sc, answers: ANS, earned: [], total: N, savedAt: Date.now() })); }, [sc, LANG, LID, N, ANS]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => err.push('root yoq'));
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1800); const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); }
  if (process.env.FULL) { await p.setViewportSize({ width: W, height: 1400 }); await p.waitForTimeout(300); }
  await p.screenshot({ path: `${D}${T}-s${sc}${process.env.TAG || ''}.jpg`, type: 'jpeg', quality: 70 }); await ctx.close();
}
console.log('xato', err); await b.close();
