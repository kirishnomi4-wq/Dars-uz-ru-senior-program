// F-1015-229…236: 5-dars (m9-05) oraliq holatlar. W=390, LANG_DARS=ru.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, T = W < 500 ? 'm' : 'd', LANG = process.env.LANG_DARS || 'uz';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-229-keyin/';
import { mkdirSync } from 'node:fs'; mkdirSync(D, { recursive: true });
const FIN = { goya: "oshxona menyusini oldindan ko'rsatadigan bot", final: 'a', muammoGapi: "Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.", bolaklar: {}, dalil: { a: { takror: 4, belgi: 3 }, b: { takror: 2, belgi: 1 } }, qiyin: {}, yozuvlarSoni: { a: 5, b: 4 }, keyin: { goya: 'maydon navbati jadvali', sabab: '' }, vaqtincha: true, savedAt: Date.now() };
const PRD = { muammo: "Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.", dalil: "5 intervyu. Muammo takrorlandi: 4 / 5. Harakat belgisi: 3 / 5.", kim: "9-sinf o'quvchilari, tanaffusda oshxonaga boradiganlar", yechim: "Bot ertalab oshxona menyusini va narxini yuboradi.", funksiyalar: ['Menyu yuborish', 'Narx', "Tugadi belgisi"], qilmaymiz: 'buyurtma berish', keyin: ['navbat uzunligi'], boshRaqam: 'Haftada botni ochganlar soni', tekshiruv: null, tuzatish: null, savedAt: Date.now() };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(sc, ls = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls, LANG]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem('ccProgress:pm-m9d5-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls, LANG]);
  await p.goto('http://localhost:5300/#/lesson/m9-05', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(900); return { p, ctx };
}
const sh = async (p, n, full) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } if (full) { await p.setViewportSize({ width: W, height: 1700 }); await p.waitForTimeout(300); } await p.screenshot({ path: `${D}${T}-${LANG}-${n}.jpg`, type: 'jpeg', quality: 70 }); if (full) await p.setViewportSize({ width: W, height: H }); };
const bos = async (p, sel, t = 800) => { const l = p.locator(sel).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + sel)); await p.waitForTimeout(t); } else err.push('yoq ' + sel); };
const matn = async (p, re, t = 800) => { const l = p.getByText(re).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + re)); await p.waitForTimeout(t); } else err.push('yoq ' + re); };
let o;
o = await och(0); await sh(o.p, 's0a'); await o.p.locator('.lesson-root .q-variant').nth(1).click({ force: true }).catch(() => err.push('s0')); await o.p.waitForTimeout(1800); await sh(o.p, 's0b'); await o.ctx.close();
o = await och(1); await o.p.waitForTimeout(1500); await sh(o.p, 's1'); await o.ctx.close();
o = await och(2); await sh(o.p, 's2a'); await bos(o.p, '.lesson-root .pr-bash .q-chip >> nth=1', 1000); await sh(o.p, 's2b', 1); await bos(o.p, '.lesson-root .pr-qsavol', 1400); await sh(o.p, 's2c', 1); await bos(o.p, '.lesson-root .pr-qsavol', 1400); await bos(o.p, '.lesson-root .pr-qsavol', 4000); await sh(o.p, 's2d', 1); await o.ctx.close();
o = await och(4); await sh(o.p, 's4a', 1); await matn(o.p, /^Keyin$|^Потом$/, 900); await sh(o.p, 's4b-xato', 1); await matn(o.p, /^Qilmaymiz$|^Не делаем$/, 1200); await sh(o.p, 's4c', 1); await o.ctx.close();
o = await och(8); await sh(o.p, 's8a'); await bos(o.p, '.lesson-root .pr-bash .q-chip >> nth=1', 1000); await sh(o.p, 's8b', 1); await matn(o.p, /^Ha$|^Да$/, 1200); await sh(o.p, 's8c', 1); await o.ctx.close();
o = await och(9, { 'pm-m9d4-final': FIN }); await sh(o.p, 's9a', 1); await matn(o.p, /^Saqlash$|^Сохранить$/, 1200); await sh(o.p, 's9b', 1); await o.ctx.close();
o = await och(10, { 'pm-m9d4-final': FIN, 'pm-m9d5-prd': PRD }); await sh(o.p, 's10a', 1); await matn(o.p, /Yo'q — tuzataman|Нет — исправлю/, 1000); await sh(o.p, 's10b', 1); await o.ctx.close();
console.log('xato', err); await b.close();
