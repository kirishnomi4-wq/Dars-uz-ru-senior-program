// F-1015-279…283: m10-10 keyingi holat suratlari (oraliq holatlar). W=390 mobil, LANG_DARS=ru.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, LANG = process.env.LANG_DARS || 'uz', T = (W < 500 ? 'm' : 'd') + '-' + LANG;
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-279-keyin/'; mkdirSync(D, { recursive: true });
const FIN = { goya: "oshxona menyusini oldindan ko'rsatadigan bot", final: 'a', muammoGapi: 'Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.', savedAt: Date.now() };
const HIS = { royxat: { soni: 23, sinfdosh: 6, manba: 'Database', sana: '2026-10-18', oldin: 'birinchi' }, asosiy: { soni: 11, manba: 'Database', sana: '2026-10-18', oldin: 'birinchi' }, bosh: { nima: "haftada bot ochganlar", soni: 9, manba: 'Database', sana: '2026-10-18' }, qaytgan: { birinchi: 20, keyingi: 8, foiz: 40, davr: '3 kun · 2 kun', manba: 'Database', sana: '2026-10-18' }, savedAt: Date.now() };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(sc, ls = {}, answers = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push('s' + sc + ': ' + e.message));
  await p.addInitScript(([sc, LS, LANG, answers]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem('ccProgress:pm-m10d10-v1', JSON.stringify({ screen: sc, answers, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(LS)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls, LANG, answers]);
  await p.goto('http://localhost:5300/#/lesson/m10-10', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200); return { p, ctx };
}
const sh = async (p, n) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } const h = await p.evaluate(() => document.documentElement.scrollHeight); await p.setViewportSize({ width: W, height: Math.min(1700, Math.max(H, h)) }); await p.waitForTimeout(250); await p.screenshot({ path: `${D}${T}-${n}.jpg`, type: 'jpeg', quality: 70 }); };
const bash = async (p, i) => { const l = p.locator('.lesson-root .q-bashorat .q-chip').nth(i); if (await l.count()) { await l.click(); await p.waitForTimeout(1300); } else err.push('bash yoq'); };
const tug = async (p, re) => { const l = p.getByRole('button', { name: re }); if (await l.count()) { await l.first().click(); await p.waitForTimeout(700); } else err.push('tugma yoq ' + re); };
let o;
o = await och(2, { 'pm-m9d4-final': FIN }); await sh(o.p, 's2a'); await bash(o.p, 2); await sh(o.p, 's2b'); await o.ctx.close();
o = await och(4, { 'pm-m9d4-final': FIN }); await sh(o.p, 's4a'); await bash(o.p, 2); await sh(o.p, 's4b'); await o.ctx.close();
o = await och(9, { 'pm-m9d4-final': FIN }); await sh(o.p, 's9a'); await tug(o.p, /^namuna$/); await sh(o.p, 's9b'); await tug(o.p, /Yordam|Подсказка/); await sh(o.p, 's9c'); await o.ctx.close();
o = await och(10, { 'pm-m9d4-final': FIN }); await sh(o.p, 's10a');
await o.p.locator('.uc-sav input').first().fill('23'); await tug(o.p, /^(Keyingi|Дальше)$/); await sh(o.p, 's10b');
await tug(o.p, /^Database$/); await sh(o.p, 's10c'); await tug(o.p, /^(Keyingi|Дальше)$/); await sh(o.p, 's10d'); await o.ctx.close();
const ANS = { 11: { stage: 'practice', screenIdx: 11, jav: ['ha', 'ha', 'ha'], natijaT: 'qabul', solved: true, picked: true, correct: true, zi: 0 } };
o = await och(11, { 'pm-m9d4-final': FIN, 'pm-m10d10-hisobot': HIS }, ANS); await sh(o.p, 's11a');
const bg = o.p.locator('.uc-tanlov').nth(2); if (await bg.count()) { await bg.click(); await o.p.waitForTimeout(600); } else err.push('bogin yoq'); await sh(o.p, 's11b'); await o.ctx.close();
console.log('xato', err); await b.close();
