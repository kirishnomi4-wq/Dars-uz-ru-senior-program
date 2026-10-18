// F-1015-237…243: 6-dars (m9-06) oraliq holatlar. W=390, LANG_DARS=ru.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, T = W < 500 ? 'm' : 'd', LANG = process.env.LANG_DARS || 'uz';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-237-keyin/';
import { mkdirSync } from 'node:fs'; mkdirSync(D, { recursive: true });
const PRD = { muammo: "Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.", dalil: "5 intervyu. Muammo takrorlandi: 4 / 5.", kim: "9-sinf", yechim: "Bot menyuni yuboradi.", funksiyalar: ['Menyu yuborish', 'Narx', 'Tugadi belgisi'], qilmaymiz: 'buyurtma', keyin: ['navbat uzunligi'], boshRaqam: 'Haftada botni ochganlar', tekshiruv: 'qabul', tuzatish: null, savedAt: Date.now() };
const ISH = (nom, turi, q, t, i, m) => ({ nom, qamrov: q, tasir: t, ishonch: i, mehnat: m, rice: Math.round(q * t * i / m), ufq: null, turi, sabab: '' });
const RM = { ishlar: [ISH('Menyu yuborish', 'asosiy', 60, 3, 0.8, 2), ISH('Narx', 'asosiy', 60, 2, 0.5, 1), ISH('Tugadi belgisi', 'asosiy', 60, 1, 0.8, 1), ISH('Navbat uzunligi', 'keyin', 60, 1, 0.5, 3)], hozir: [], savedAt: Date.now() };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
async function och(sc, ls = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls, LANG]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem('ccProgress:pm-m9d6-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls, LANG]);
  await p.goto('http://localhost:5300/#/lesson/m9-06', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {}); else { const k2 = p.getByText(/Kodsiz/); if (await k2.count()) await k2.first().click({ timeout: 1500 }).catch(() => {}); }
  await p.waitForTimeout(1200); return { p, ctx };
}
const sh = async (p, n, full) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); } if (full) { await p.setViewportSize({ width: W, height: 1700 }); await p.waitForTimeout(300); } await p.screenshot({ path: `${D}${T}-${LANG}-${n}.jpg`, type: 'jpeg', quality: 70 }); if (full) await p.setViewportSize({ width: W, height: H }); };
const bos = async (p, sel, t = 800) => { const l = p.locator(sel).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + sel)); await p.waitForTimeout(t); } else err.push('yoq ' + sel); };
const matn = async (p, re, t = 800) => { const l = p.getByText(re).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + re)); await p.waitForTimeout(t); } else err.push('yoq ' + re); };
let o;
o = await och(0); await sh(o.p, 's0a'); await o.p.locator('.lesson-root .q-variant').nth(0).click({ force: true }).catch(() => err.push('s0')); await o.p.waitForTimeout(2200); await sh(o.p, 's0b'); await o.ctx.close();
o = await och(1); await o.p.waitForTimeout(1500); await sh(o.p, 's1'); await o.ctx.close();
o = await och(2); await sh(o.p, 's2a'); await bos(o.p, '.lesson-root .rm-bash .q-chip >> nth=0', 1200); await sh(o.p, 's2b', 1); await o.ctx.close();
o = await och(4); await sh(o.p, 's4a'); await bos(o.p, '.lesson-root .rm-bash .q-chip >> nth=1', 1200); await sh(o.p, 's4b', 1); await o.ctx.close();
o = await och(8, { 'pm-m9d5-prd': PRD }); await sh(o.p, 's8a', 1); await o.ctx.close();
o = await och(9, { 'pm-m9d5-prd': PRD, 'pm-m9d6-roadmap': RM }); await sh(o.p, 's9a', 1); await bos(o.p, '.lesson-root .rm-s9-b .q-chip >> nth=1', 500); await bos(o.p, '.lesson-root .rm-s9-b .rm-fq:nth-of-type(2) .q-chip >> nth=1', 500); await sh(o.p, 's9b', 1); await matn(o.p, /^Saqlash$|^Сохранить$/, 800); await matn(o.p, /^Ochish$|^Открыть$/, 1200); await sh(o.p, 's9c', 1); await o.ctx.close();
o = await och(10, { 'pm-m9d5-prd': PRD, 'pm-m9d6-roadmap': RM }); await sh(o.p, 's10a', 1); await bos(o.p, '.lesson-root .rm-ufq-t .q-chip >> nth=0', 1200); await sh(o.p, 's10b', 1); await o.ctx.close();
console.log('xato', err); await b.close();
