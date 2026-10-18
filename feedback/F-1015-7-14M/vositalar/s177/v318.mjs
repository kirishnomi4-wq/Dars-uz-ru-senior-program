// F-1015-318…324 keyin-suratlari: m11-05 s3/s8 (trek+ulgur), m11-06 s2/s4, m11-07 s4, m11-09 s4, m12-12 s6. W=390 / LANG_DARS=ru
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, LANG = process.env.LANG_DARS || 'uz', T = (W < 500 ? 'm' : 'd') + '-' + LANG;
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-318-keyin/'; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(key, lid, n, sc) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(key + ' s' + sc + ': ' + e.message));
  await p.addInitScript(([sc, LANG, lid, n]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: {}, earned: [], total: n, savedAt: Date.now() })); }, [sc, LANG, lid, n]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => err.push(key + ' root yoq'));
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200); const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); }
  return { p, ctx };
}
const sh = async (p, n) => { await p.screenshot({ path: `${D}${T}-${n}.jpg`, type: 'jpeg', quality: 70 }); };
const tug = async (p, re) => { const l = p.getByRole('button', { name: re }); if (await l.count()) { await l.first().click(); await p.waitForTimeout(800); } else err.push('tugma yoq ' + re); };
let o;
o = await och('m11-05', 'm11-05-v1', 12, 3); await sh(o.p, 'm11-05-s3'); await o.p.locator('details.q-blok-ulgur summary').first().click().catch(() => err.push('ulgur yoq')); await o.p.waitForTimeout(400); await sh(o.p, 'm11-05-s3-ulgur'); await o.ctx.close();
o = await och('m11-05', 'm11-05-v1', 12, 8); await sh(o.p, 'm11-05-s8'); await o.ctx.close();
o = await och('m11-06', 'pm-m11d6-v1', 12, 2); await sh(o.p, 'm11-06-s2'); await o.ctx.close();
o = await och('m11-06', 'pm-m11d6-v1', 12, 4); await sh(o.p, 'm11-06-s4'); await o.ctx.close();
o = await och('m11-07', 'pm-m11d7-v1', 12, 4); await sh(o.p, 'm11-07-s4a'); await tug(o.p, /Real ishga tushirishda|При реальном запуске/); await sh(o.p, 'm11-07-s4b'); await o.ctx.close();
o = await och('m11-09', 'pm-m11d9-v1', 12, 4); await o.p.locator('.lesson-root .q-bashorat .q-chip').nth(0).click(); await o.p.waitForTimeout(1300); await sh(o.p, 'm11-09-s4b'); await o.ctx.close();
o = await och('m12-12', 'pm-m12d12-v1', 12, 6); await sh(o.p, 'm12-12-s6a');
await o.p.locator('.nx-sav .q-chip').first().click(); await o.p.waitForTimeout(500); await tug(o.p, /^(Keyingi|Дальше)$/); await sh(o.p, 'm12-12-s6b');
await o.p.locator('.nx-sav input').first().fill(LANG === 'ru' ? 'три организатора подтвердили' : "uch tashkilotchi yozma tasdiq berdi"); await tug(o.p, /^(Keyingi|Дальше)$/); await sh(o.p, 'm12-12-s6c'); await o.ctx.close();
console.log('xato', err); await b.close();
