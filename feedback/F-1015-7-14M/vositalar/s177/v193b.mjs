import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, T = W < 500 ? 'm' : 'd', LANG = process.env.LANG_DARS || 'uz';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-193-keyin/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
const G = { goyalar: [["tanaffusda oshxonada navbat uzun", "oshxona menyusini oldindan ko'rsatadigan bot"], ["uy vazifasi chatda yo'qolib qoladi", "vazifalar bitta joyda turadigan sahifa"], ["maydonga navbat yo'q", "maydon navbati jadvali"], ["sinfda kim nimani olib kelishi noma'lum", "sinf chat ro'yxati"], ["eski kitoblar uyda yotadi", "eski kitoblar almashinuvi"]].map(([muammo, yechim], i) => ({ i, muammo, kim: "sinfdoshlar", yechim, manba: 'kuzatuv' })), savedAt: Date.now() };
const S8_1 = { stage: 'ustaxona', correct: true, picked: true, solved: true, javob: { 0: [1, 1, 1], 1: [1, 0], 2: [0], 3: [1, 1, 0], 4: [1, 0] }, otdi: [0], sabablar: { 1: ['', '5 tanish topa olmayman'], 2: ['pul yoki yetkazib berish kerak'], 3: ['', '', 'menga qiziq emas'], 4: ['', 'bunday odamlarni bilmayman'] } };
const S8_2 = { ...S8_1, javob: { ...S8_1.javob, 2: [1, 1, 1] }, otdi: [0, 2], sabablar: { ...S8_1.sabablar, 2: [] } };
const RICE2 = { otdi: [0, 2], baho: [{ goya: 0, qamrov: 60, tasir: 1, ishonch: 0.5, mehnat: 4, rice: 7.5 }, { goya: 2, qamrov: 30, tasir: 1, ishonch: 1, mehnat: 4, rice: 7.5 }] };
const RICE4 = { otdi: [0, 1, 2, 3], baho: [{ goya: 0, qamrov: 60, tasir: 1, ishonch: 1, mehnat: 2, rice: 30 }, { goya: 1, qamrov: 30, tasir: 2, ishonch: 0.8, mehnat: 5, rice: 9.6 }, { goya: 2, qamrov: 60, tasir: 1, ishonch: 0.5, mehnat: 4, rice: 7.5 }, { goya: 3, qamrov: 30, tasir: 1, ishonch: 1, mehnat: 4, rice: 7.5 }] };
async function och(sc, ls = {}, answers = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls, answers, LANG]) => { localStorage.setItem('cc_lang', LANG); localStorage.setItem('ccProgress:pm-m9d2-v1', JSON.stringify({ screen: sc, answers, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls, answers, LANG]);
  await p.goto('http://localhost:5300/#/lesson/m9-02', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {}); else { const k2 = p.getByText(/Kodsiz/); if (await k2.count()) await k2.first().click({ timeout: 1500 }).catch(() => {}); }
  await p.waitForTimeout(900); return { p, ctx };
}
const yop = async (p) => { const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(500); } };
const sh = async (p, n, full) => { await yop(p); if (full) { await p.setViewportSize({ width: W, height: 1700 }); await p.waitForTimeout(350); } await p.screenshot({ path: `${D}${T}-${LANG}-${n}.jpg`, type: 'jpeg', quality: 72 }); if (full) await p.setViewportSize({ width: W, height: H }); };
const bos = async (p, sel, t = 700) => { const l = p.locator(sel).first(); if (await l.count()) { await l.click().catch(() => err.push('click ' + sel)); await p.waitForTimeout(t); return true; } err.push('yoq ' + sel); return false; };
let o;
o = await och(8, { 'pm-m9d1-goyalar': G }, { 8: S8_1 }); await o.p.waitForTimeout(600); await sh(o.p, 's8-1otdi', 1); await o.ctx.close();
o = await och(8, { 'pm-m9d1-goyalar': G }, { 8: S8_2 }); await o.p.waitForTimeout(600); await sh(o.p, 's8-2otdi', 1); await o.ctx.close();
o = await och(9, { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': RICE2 }); await o.p.waitForTimeout(800); await sh(o.p, 's9-2teng', 1); await o.ctx.close();
o = await och(9, { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': RICE4 }); await o.p.waitForTimeout(800); await sh(o.p, 's9-4', 1); await o.ctx.close();
o = await och(11, { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': RICE2 }); await bos(o.p, '.lesson-root .ri-darvoza .q-chip >> nth=0', 900); await sh(o.p, 's11-2', 1); await o.ctx.close();
console.log('xato', err); await b.close();
