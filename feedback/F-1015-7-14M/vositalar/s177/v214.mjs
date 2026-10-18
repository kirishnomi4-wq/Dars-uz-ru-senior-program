// F-1015-214…220: 4-dars (m9-04) YANGI holat suratlari — W=390 mobil, LANG_DARS=ru.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, T = W < 500 ? 'm' : 'd', LANG = process.env.LANG_DARS || 'uz';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-214-keyin/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
const SH3 = { goyalar: [{ matn: "oshxona menyusini oldindan ko'rsatadigan bot", kim: 'sinfdoshlar', bolak: 'oshxonada navbatda turganingiz' }, { matn: 'maydon navbati jadvali', kim: 'sinfdoshlar', bolak: 'maydon izlaganingiz' }], savollar: ['a', 'b', 'c', 'd', 'e'],
  yozuvlar: [{ goya: 0, kim: 'sinfdosh', oxirgi: 'kecha, 20 daqiqa turdim', qanday: 'oldinroq chiqdim', qiyin: 'nima borligini bilmayman', hozir: 'hech narsa', belgi: 'ha', tur: null }], savedAt: Date.now() };
const DOSKA = { a: { nom: "oshxona menyusini oldindan ko'rsatadigan bot", N: 5, n: 4, m: 3, qiyin: 'nima borligini bilmaydi', qn: 3, saqlandi: true }, b: { nom: 'maydon navbati jadvali', N: 4, n: 2, m: 1, qiyin: 'maydon band', qn: 2, saqlandi: true } };
const A9 = { 9: { stage: 'sanoq', screenIdx: 9, practice: 'doska', correct: true, picked: true, solved: true, doska: DOSKA } };
async function och(sc, ls = {}, answers = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls, answers, LANG]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem('ccProgress:pm-m9d4-v1', JSON.stringify({ screen: sc, answers, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls, answers, LANG]);
  await p.goto('http://localhost:5300/#/lesson/m9-04', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {}); else { const k2 = p.getByText(/Kodsiz/); if (await k2.count()) await k2.first().click({ timeout: 1500 }).catch(() => {}); }
  await p.waitForTimeout(900); return { p, ctx };
}
const yop = async (p) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(500); } };
const sh = async (p, n, full) => { await yop(p); if (full) { await p.setViewportSize({ width: W, height: 1900 }); await p.waitForTimeout(350); } await p.screenshot({ path: `${D}${T}-${LANG}-${n}.jpg`, type: 'jpeg', quality: 72 }); if (full) await p.setViewportSize({ width: W, height: H }); };
const bos = async (p, sel, t = 700) => { const l = p.locator(sel).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + sel)); await p.waitForTimeout(t); return true; } err.push('yoq ' + sel); return false; };
const yoz = async (p, sel, txt) => { const l = p.locator(sel).first(); if (await l.count()) { await l.fill(txt); await p.waitForTimeout(200); } else err.push('yoq ' + sel); };
const matn = async (p, re, t = 900) => { const l = p.getByText(re).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + re)); await p.waitForTimeout(t); } else err.push('yoq ' + re); };
let o;
o = await och(0); await sh(o.p, 's0a'); await bos(o.p, '.lesson-root .q-variantlar-kol button, .lesson-root .q-kirish button, .lesson-root label:has(input[type=radio])', 1500); await sh(o.p, 's0b'); await o.ctx.close();
o = await och(1); await o.p.waitForTimeout(1800); await sh(o.p, 's1'); await o.ctx.close();
o = await och(2); await sh(o.p, 's2a'); await bos(o.p, '.lesson-root .fi-bash .q-chip >> nth=1', 900); await sh(o.p, 's2b');
await matn(o.p, /Yozuvlarga qarang|Посмотреть записи/, 1000); await sh(o.p, 's2c', 1); await matn(o.p, /Keyingi savol|Следующий вопрос/, 900); await sh(o.p, 's2d');
await matn(o.p, /Yozuvlarga qarang|Посмотреть записи/, 900); await matn(o.p, /Keyingi savol|Следующий вопрос/, 900); await matn(o.p, /Yozuvlarga qarang|Посмотреть записи/, 900); await sh(o.p, 's2e', 1);
await matn(o.p, /Doskani ko'rish|Показать доску/, 2500); await sh(o.p, 's2f-tugadi', 1); await o.ctx.close();
o = await och(4); await sh(o.p, 's4a'); await bos(o.p, '.lesson-root .fi-bash .q-chip >> nth=1', 900); await bos(o.p, '.lesson-root .fi-savol', 1400); await sh(o.p, 's4b', 1);
await matn(o.p, /Kim belgilaganini ko'ring|Посмотрите, кто назначил/, 1600); await sh(o.p, 's4c', 1); await o.p.waitForTimeout(3000); await sh(o.p, 's4d-tugadi', 1); await o.ctx.close();
o = await och(6); await sh(o.p, 's6a'); await bos(o.p, '.lesson-root .fi-bash .q-chip >> nth=0', 900); await sh(o.p, 's6b'); await o.ctx.close();
o = await och(8); await sh(o.p, 's8a'); await bos(o.p, '.lesson-root .fi-goya-b >> nth=1', 1000); await sh(o.p, 's8b'); await o.p.waitForTimeout(2600); await sh(o.p, 's8c', 1);
await bos(o.p, '.lesson-root .fi-tanlov-c >> nth=0', 900); await sh(o.p, 's8d-xato', 1); await bos(o.p, '.lesson-root .fi-tanlov-c >> nth=1', 1600);
await bos(o.p, '.lesson-root .fi-tanlov-c >> nth=0', 1600); await sh(o.p, 's8e', 1); await bos(o.p, '.lesson-root .fi-tanlov-c >> nth=2', 2000); await sh(o.p, 's8f', 1); await o.p.waitForTimeout(2600); await sh(o.p, 's8g-tugadi', 1); await o.ctx.close();
o = await och(9, { 'pm-m9d3-intervyu': SH3 }); await sh(o.p, 's9a'); await bos(o.p, '.lesson-root .fi-st .q-chip >> nth=4', 700); await sh(o.p, 's9b'); await bos(o.p, '.lesson-root .fi-st .q-chip >> nth=3', 700); await bos(o.p, '.lesson-root .fi-st .q-chip >> nth=3', 700); await sh(o.p, 's9c');
await matn(o.p, /^Saqlash$|^Сохранить$/, 800); await sh(o.p, 's9d-xato'); await yoz(o.p, '.lesson-root .fi-s9-q.joriy .fi-inp', 'nima borligini bilmaydi'); await bos(o.p, '.lesson-root .fi-s9-q.joriy .fi-st .q-chip >> nth=2', 700); await sh(o.p, 's9e');
await matn(o.p, /^Saqlash$|^Сохранить$/, 1200); await sh(o.p, 's9f-2goya'); await o.ctx.close();
o = await och(9); await sh(o.p, 's9z-kalitsiz'); await o.ctx.close();
o = await och(10, { 'pm-m9d3-intervyu': SH3 }, A9); await sh(o.p, 's10a'); await bos(o.p, '.lesson-root .fi-goya-b.katta >> nth=1', 1200); await sh(o.p, 's10b', 1);
await matn(o.p, /^Saqlash$|^Сохранить$/, 800); await sh(o.p, 's10c-xato', 1); await yoz(o.p, '.lesson-root .fi-s10-ogoh .fi-inp', 'menga shu qiziq'); await yoz(o.p, '.lesson-root .fi-fk-q.joriy .fi-inp', "O'yinchilar"); await matn(o.p, /Keyingi qator|Следующая строка/, 700); await sh(o.p, 's10d', 1);
await yoz(o.p, '.lesson-root .fi-fk-q.joriy .fi-inp', 'shanba kuni'); await matn(o.p, /Keyingi qator|Следующая строка/, 700); await yoz(o.p, '.lesson-root .fi-fk-q.joriy .fi-inp', "maydon band bo'lganidan qiynaladi"); await sh(o.p, 's10e', 1);
await matn(o.p, /^Saqlash$|^Сохранить$/, 2000); await sh(o.p, 's10f', 1); await o.ctx.close();
o = await och(15, { 'pm-m9d3-intervyu': SH3 }, A9); await sh(o.p, 's15', 1); await o.ctx.close();
console.log('xato', err); await b.close();
