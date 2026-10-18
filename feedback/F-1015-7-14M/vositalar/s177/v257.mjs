// F-1015-257…259: 8-dars (m9-08) keyingi holat suratlari.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = 1280, H = 773, LANG = process.env.LANG_DARS || 'uz';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-257-keyin/'; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(key, lid, n, sc) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(key + sc + ': ' + e.message));
  await p.addInitScript(([sc, LANG, lid, n]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: {}, earned: [], total: n, savedAt: Date.now() })); }, [sc, LANG, lid, n]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200); return { p, ctx };
}
const sh = async (p, n) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } await p.setViewportSize({ width: W, height: 1100 }); await p.waitForTimeout(300); await p.screenshot({ path: `${D}${n}.jpg`, type: 'jpeg', quality: 70 }); };
const bos = async (p, sel, i = 0) => { const l = p.locator(sel).nth(i); if (await l.count()) { await l.click().catch(() => err.push('click ' + sel)); await p.waitForTimeout(1200); } else err.push('yoq ' + sel); };
let o;
o = await och('m9-08', 'm9-08-v1', 20, 0); await sh(o.p, 'm8-s0'); await o.ctx.close();
o = await och('m9-08', 'm9-08-v1', 20, 1); await o.p.waitForTimeout(1500); await sh(o.p, 'm8-s1'); await o.ctx.close();
o = await och('m9-08', 'm9-08-v1', 20, 2); await sh(o.p, 'm8-s2a'); await bos(o.p, '.lesson-root .pc-navbat-k .q-chip', 2); await sh(o.p, 'm8-s2b'); await o.ctx.close();
o = await och('m9-08', 'm9-08-v1', 20, 6); await sh(o.p, 'm8-s6a'); await bos(o.p, '.lesson-root .pc-navbat-k .q-chip', 1); await sh(o.p, 'm8-s6b'); await o.ctx.close();
o = await och('m9-08', 'm9-08-v1', 20, 10); await sh(o.p, 'm8-s10a'); await bos(o.p, '.lesson-root .pc-navbat-k .q-chip', 1); await sh(o.p, 'm8-s10b'); await o.ctx.close();
o = await och('m9-08', 'm9-08-v1', 20, 12); await sh(o.p, 'm8-s12'); await o.ctx.close();
o = await och('m9-08', 'm9-08-v1', 20, 13); await sh(o.p, 'm8-s13'); await o.ctx.close();
console.log('xato', err); await b.close();
