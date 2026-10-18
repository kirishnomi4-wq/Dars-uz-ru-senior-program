// F-1015-247…252: 15-dars (m9-15) va 16-dars (m9-16) keyingi holat suratlari.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
const W = 1280, H = 773, LANG = process.env.LANG_DARS || 'uz';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-247-keyin/'; mkdirSync(D, { recursive: true });
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
const sh = async (p, n) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } await p.setViewportSize({ width: W, height: 1500 }); await p.waitForTimeout(300); await p.screenshot({ path: `${D}${n}.jpg`, type: 'jpeg', quality: 70 }); };
const bash = async (p, i = 0) => { const l = p.locator('.lesson-root .q-bashorat .q-chip, .lesson-root .q-variantlar .q-chip').nth(i); if (await l.count()) { await l.click().catch(() => err.push('bash')); await p.waitForTimeout(1200); } else err.push('bash yoq'); };
let o;
o = await och('m9-15', 'pm-m9d15-v1', 12, 2); await sh(o.p, 'm15-s2'); await o.ctx.close();
o = await och('m9-15', 'pm-m9d15-v1', 12, 3); await sh(o.p, 'm15-s3'); await o.ctx.close();
o = await och('m9-16', 'pm-m9d16-v1', 16, 2); await sh(o.p, 'm16-s2a'); await bash(o.p, 1); await sh(o.p, 'm16-s2b'); await o.ctx.close();
o = await och('m9-16', 'pm-m9d16-v1', 16, 4); await sh(o.p, 'm16-s4a'); await bash(o.p, 1); await sh(o.p, 'm16-s4b'); await o.ctx.close();
o = await och('m9-16', 'pm-m9d16-v1', 16, 8); await sh(o.p, 'm16-s8a'); await bash(o.p, 2); await sh(o.p, 'm16-s8b'); await o.ctx.close();
console.log('xato', err); await b.close();
