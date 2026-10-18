// Jonli QA saytidan bitta ekran surati: SAYT=https://… KEY=m9-05 LID=pm-m9d5-v1 N=16 EKRAN=9 OUT=… node sayt-ekran.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const { SAYT, KEY, LID, OUT } = process.env; const N = +process.env.N, EK = process.env.EKRAN.split(',').map(Number);
const D = `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/${OUT}/`; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const sc of EK) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([sc, LID, N]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${LID}`, JSON.stringify({ screen: sc, answers: {}, earned: [], total: N, savedAt: Date.now() })); }, [sc, LID, N]);
  await p.goto(`${SAYT}/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 }).catch(() => console.log('root yoq'));
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1500); const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); }
  await p.screenshot({ path: `${D}sayt-s${sc}.jpg`, type: 'jpeg', quality: 70 }); await ctx.close();
}
await b.close(); console.log('ok');
