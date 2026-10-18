// F-1015-275 (m9-16 s10 «Yordam» karta ichida) va F-1015-276 (m9-06 s0 chiplar karta ichida tekis) keyingi suratlar.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, LANG = process.env.LANG_DARS || 'uz', T = (W < 500 ? 'm' : 'd') + '-' + LANG;
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-275-keyin/'; mkdirSync(D, { recursive: true });
const FIN = { goya: "oshxona menyusini oldindan ko'rsatadigan bot", final: 'a', muammoGapi: "Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.", bolaklar: {}, dalil: { a: { takror: 4, belgi: 3 }, b: { takror: 2, belgi: 1 } }, qiyin: {}, yozuvlarSoni: { a: 5, b: 4 }, keyin: { goya: 'maydon navbati jadvali', sabab: '' }, vaqtincha: false, savedAt: Date.now() };
const PRD = { muammo: FIN.muammoGapi, dalil: "5 intervyu. Muammo takrorlandi: 4 / 5. Harakat belgisi: 3 / 5.", kim: "9-sinf", yechim: "Bot ertalab menyuni yuboradi.", funksiyalar: ['Menyu yuborish', 'Narx', 'Tugadi belgisi'], qilmaymiz: 'buyurtma', keyin: ['navbat uzunligi'], boshRaqam: 'Haftada botni ochganlar', tekshiruv: 'qabul', tuzatish: null, savedAt: Date.now() };
const LS = { 'pm-m9d4-final': FIN, 'pm-m9d5-prd': PRD };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(key, lid, n, sc) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(key + sc + ': ' + e.message));
  await p.addInitScript(([sc, LS, LANG, lid, n]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: {}, earned: [], total: n, savedAt: Date.now() })); for (const [k, v] of Object.entries(LS)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, LS, LANG, lid, n]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200); return { p, ctx };
}
const sh = async (p, n, full = true) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } if (full) { await p.setViewportSize({ width: W, height: 1500 }); await p.waitForTimeout(300); } await p.screenshot({ path: `${D}${T}-${n}.jpg`, type: 'jpeg', quality: 70 }); };
let o;
if (!process.env.FAQAT06) {
o = await och('m9-16', 'pm-m9d16-v1', 16, 10); await sh(o.p, 'm16-s10a');
const y = o.p.getByRole('button', { name: /Yordam|Подсказка/ }); if (await y.count()) { await y.first().click(); await o.p.waitForTimeout(600); } else err.push('yordam yoq');
await sh(o.p, 'm16-s10b'); await o.ctx.close(); }
// m9-06 s0: tanlovdan keyin chiplar
o = await och('m9-06', 'pm-m9d6-v1', 16, 0); await sh(o.p, 'm06-s0a', false);
const v = o.p.locator('.lesson-root .q-variant').first(); if (await v.count()) { await v.click(); await o.p.waitForTimeout(2600); } else err.push('variant yoq');
await sh(o.p, 'm06-s0b', false); await o.ctx.close();
console.log('xato', err); await b.close();
