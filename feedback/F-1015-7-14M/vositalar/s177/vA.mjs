// Umumiy «oldin» suratlari: har ekranning boshlang'ich holati. Ishlatish:
//   KEY=m9-05 LID=pm-m9d5-v1 N=16 OUT=F-1015-229-m9-05-oldin [W=390] [LANG_DARS=ru] [EKRAN=0,2,4] node vA.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, T = W < 500 ? 'm' : 'd', LANG = process.env.LANG_DARS || 'uz';
const KEY = process.env.KEY, LID = process.env.LID, N = +(process.env.N || 16), OUT = process.env.OUT;
const EK = process.env.EKRAN ? process.env.EKRAN.split(',').map(Number) : [...Array(N)].map((_, i) => i);
const D = `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/${OUT}/`;
import { mkdirSync } from 'node:fs'; mkdirSync(D, { recursive: true });
// Oldingi darslar yozgan kalitlar (o'quvchi ma'lumoti)
const G = { goyalar: [["tanaffusda oshxonada navbat uzun", "oshxona menyusini oldindan ko'rsatadigan bot"], ["uy vazifasi chatda yo'qolib qoladi", "vazifalar bitta joyda turadigan sahifa"], ["maydonga navbat yo'q", "maydon navbati jadvali"], ["sinfda kim nimani olib kelishi noma'lum", "sinf chat ro'yxati"], ["eski kitoblar uyda yotadi", "eski kitoblar almashinuvi"]].map(([muammo, yechim], i) => ({ i, muammo, kim: 'sinfdoshlar', yechim, manba: 'kuzatuv' })), savedAt: Date.now() };
const RICE = { otdi: [0, 1, 2, 3], ikkita: [0, 2], baho: [{ goya: 0, qamrov: 60, tasir: 1, ishonch: 1, mehnat: 2, rice: 30 }, { goya: 2, qamrov: 60, tasir: 1, ishonch: 0.5, mehnat: 4, rice: 7.5 }] };
const SH3 = { goyalar: [{ matn: "oshxona menyusini oldindan ko'rsatadigan bot", kim: 'sinfdoshlar', bolak: 'oshxonada navbatda turganingiz' }, { matn: 'maydon navbati jadvali', kim: 'sinfdoshlar', bolak: 'maydon izlaganingiz' }], savollar: ['a', 'b', 'c', 'd', 'e'], yozuvlar: [{ goya: 0, kim: 'sinfdosh', oxirgi: 'kecha, 20 daqiqa turdim', qanday: 'oldinroq chiqdim', qiyin: 'nima borligini bilmayman', hozir: 'hech narsa', belgi: 'ha', tur: null }], savedAt: Date.now() };
const FIN = { goya: "oshxona menyusini oldindan ko'rsatadigan bot", final: 'a', muammoGapi: "Sinfdoshlar tanaffusda oshxonada nima borligini bilmay navbatda turishda qiynaladi.", bolaklar: { kim: 'Sinfdoshlar', qachon: 'tanaffusda', nima: 'oshxonada nima borligini bilmay navbatda turishda qiynaladi' }, dalil: { a: { takror: 4, belgi: 3 }, b: { takror: 2, belgi: 1 } }, qiyin: { a: { matn: 'nima borligini bilmaydi', n: 3 }, b: { matn: 'maydon band', n: 2 } }, yozuvlarSoni: { a: 5, b: 4 }, keyin: { goya: 'maydon navbati jadvali', sabab: '' }, vaqtincha: true, savedAt: Date.now() };
const LS = { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': RICE, 'pm-m9d3-intervyu': SH3, 'pm-m9d4-final': FIN };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
for (const sc of EK) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, LS, LANG, LID, N]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem(`ccProgress:${LID}`, JSON.stringify({ screen: sc, answers: {}, earned: [], total: N, savedAt: Date.now() })); for (const [k, v] of Object.entries(LS)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, LS, LANG, LID, N]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => err.push('root ' + sc));
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {}); else { const k2 = p.getByText(/Kodsiz/); if (await k2.count()) await k2.first().click({ timeout: 1500 }).catch(() => {}); }
  await p.waitForTimeout(1600);
  const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(400); }
  if (process.env.FULL) { await p.setViewportSize({ width: W, height: 1600 }); await p.waitForTimeout(300); }
  await p.screenshot({ path: `${D}${T}-${LANG}-s${String(sc).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70 });
  await ctx.close();
}
console.log('xato', err); await b.close();
