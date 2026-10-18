// F-1015-279…283: m10-10 keyingi holat suratlari (oraliq holatlar). W=390 mobil, LANG_DARS=ru.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, LANG = process.env.LANG_DARS || 'uz', T = (W < 500 ? 'm' : 'd') + '-' + LANG;
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-292-keyin/'; mkdirSync(D, { recursive: true });
const FIN = { goya: "oshxona menyusini oldindan ko'rsatadigan bot", final: 'a', muammoGapi: 'Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.', savedAt: Date.now() };
const HIS = { royxat: { soni: 23, sinfdosh: 6, manba: 'Database', sana: '2026-10-18', oldin: 'birinchi' }, asosiy: { soni: 11, manba: 'Database', sana: '2026-10-18', oldin: 'birinchi' }, bosh: { nima: "haftada bot ochganlar", soni: 9, manba: 'Database', sana: '2026-10-18' }, qaytgan: { birinchi: 20, keyingi: 8, foiz: 40, davr: '3 kun · 2 kun', manba: 'Database', sana: '2026-10-18' }, savedAt: Date.now() };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(sc, ls = {}, answers = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push('s' + sc + ': ' + e.message));
  await p.addInitScript(([sc, LS, LANG, answers]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem('ccProgress:pm-m10d7-v1', JSON.stringify({ screen: sc, answers, earned: [], total: 12, savedAt: Date.now() })); for (const [k, v] of Object.entries(LS)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls, LANG, answers]);
  await p.goto('http://localhost:5300/#/lesson/m10-07', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200); return { p, ctx };
}
const sh = async (p, n) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } const h = await p.evaluate(() => document.documentElement.scrollHeight); await p.setViewportSize({ width: W, height: Math.min(1700, Math.max(H, h)) }); await p.waitForTimeout(250); await p.screenshot({ path: `${D}${T}-${n}.jpg`, type: 'jpeg', quality: 70 }); };
const bash = async (p, i) => { const l = p.locator('.lesson-root .q-bashorat .q-chip').nth(i); if (await l.count()) { await l.click(); await p.waitForTimeout(1300); } else err.push('bash yoq'); };
const tug = async (p, re) => { const l = p.getByRole('button', { name: re }); if (await l.count()) { await l.first().click(); await p.waitForTimeout(700); } else err.push('tugma yoq ' + re); };
let o;
for (const [sc, i] of [[2, 1], [4, 2]]) { o = await och(sc, {}); await sh(o.p, `s${sc}a`); await bash(o.p, i); await sh(o.p, `s${sc}b`); await o.ctx.close(); }
console.log('xato', err); await b.close();
