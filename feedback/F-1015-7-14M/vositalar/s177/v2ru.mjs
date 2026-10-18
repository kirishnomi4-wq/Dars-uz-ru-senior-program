import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.env.W || 1280), H = W < 500 ? 844 : 773, T = W < 500 ? 'm' : 'd';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const err = [];
const G = { goyalar: [["tanaffusda oshxonada navbat uzun, ovqatga ulgurmaymiz", "oshxona menyusini oldindan ko'rsatadigan bot"], ["uy vazifasi chatda yo'qolib qoladi", "vazifalar bitta joyda turadigan sahifa"], ["maydonga borsak band bo'ladi", "maydon bo'sh vaqtlari jadvali"], ["eski darsliklarni kimga berishni bilmaymiz", "darslik almashish e'lonlari"], ["avtobusda o'rindiq topilmaydi", "avtobusdagi bo'sh joylar xaritasi"]].map(([m, y]) => ({ muammo: m, kim: 'sinfdoshlar', yechim: y, manba: 'kuzatuv' })), savedAt: 1 };
const RICE4 = { otdi: [0, 1, 2, 3], baho: [{ goya: 0, qamrov: 100, tasir: 1, ishonch: 0.8, mehnat: 3, rice: 26.67 }, { goya: 1, qamrov: 30, tasir: 2, ishonch: 0.5, mehnat: 2, rice: 15 }, { goya: 2, qamrov: 60, tasir: 1, ishonch: 0.5, mehnat: 2, rice: 15 }, { goya: 3, qamrov: 10, tasir: 0.5, ishonch: 0.5, mehnat: 1, rice: 2.5 }], uchta: [0, 1, 2], ikkita: [0, 1] };
async function och(sc, ls = {}, mode) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls]) => { localStorage.setItem('cc_lang', 'ru'); localStorage.setItem('ccProgress:pm-m9d2-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls]);
  await p.goto('http://localhost:5300/#/lesson/m9-02', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.locator("[data-live=self]"); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(900); return { p, ctx };
}
const sh = async (p, n, full) => { if (full) { await p.setViewportSize({ width: W, height: 1700 }); await p.waitForTimeout(400); } await p.screenshot({ path: `v2ru/${T}-${n}.jpg`, type: 'jpeg', quality: 70 }); if (full) await p.setViewportSize({ width: W, height: H }); };
const bos = async (p, sel, t = 700) => { const l = p.locator(sel).first(); if (await l.count()) { await l.click().catch(e => err.push('click ' + sel)); await p.waitForTimeout(t); return true; } err.push('yoq ' + sel); return false; };
let o = await och(0); await sh(o.p, 's0a'); await bos(o.p, '.lesson-root .q-variant, .lesson-root [role=radio], .lesson-root .q-chip'); await o.p.waitForTimeout(600); await sh(o.p, 's0b'); await o.ctx.close();
o = await och(1); await o.p.waitForTimeout(1200); await sh(o.p, 's1'); await o.ctx.close();
o = await och(2); await sh(o.p, 's2a'); await bos(o.p, '.lesson-root .ri-bash .q-chip >> nth=1');
await bos(o.p, '.lesson-root button.ri-sv', 1400); await sh(o.p, 's2b'); await bos(o.p, '.lesson-root button.ri-sv', 1400); await bos(o.p, '.lesson-root button.ri-sv', 3000); await sh(o.p, 's2c', 1); await o.ctx.close();
o = await och(4); await sh(o.p, 's4a'); await bos(o.p, '.lesson-root button.ri-s4-sav'); await bos(o.p, '.lesson-root button.ri-s4-sav'); await sh(o.p, 's4b');
await bos(o.p, '.lesson-root button.ri-s4-sav'); await bos(o.p, '.lesson-root button.ri-s4-sav', 1000); await sh(o.p, 's4c', 1);
await bos(o.p, '.lesson-root .ri-s4-bash .q-chip >> nth=0', 3200); await sh(o.p, 's4d', 1); await o.ctx.close();
o = await och(5); await sh(o.p, 's5'); await o.ctx.close();
o = await och(9, { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': { otdi: [0, 1, 2, 3] } }); await sh(o.p, 's9a');
await bos(o.p, '.lesson-root .ri-jt .q-chip >> nth=1'); await bos(o.p, '.lesson-root .ri-jt .q-chip >> nth=2'); await sh(o.p, 's9b');
await bos(o.p, '.lesson-root .ri-jt .q-chip >> nth=1'); await bos(o.p, '.lesson-root .ri-jt .q-chip >> nth=5'); await sh(o.p, 's9c', 1);
await bos(o.p, '.lesson-root .ri-amal button >> nth=0'); await sh(o.p, 's9c2', 1); await bos(o.p, '.lesson-root .ri-amal button >> nth=1', 900); await sh(o.p, 's9d', 1);
for (let g = 0; g < 3; g++) { for (const n of [2, 1, 0, 3]) await bos(o.p, `.lesson-root .ri-jt .q-chip >> nth=${n}`, 350); await bos(o.p, '.lesson-root .ri-amal button >> nth=1', 900); }
await o.p.waitForTimeout(800); await sh(o.p, 's9e', 1); await bos(o.p, '.lesson-root .ri-int >> nth=2', 700); await sh(o.p, 's9f', 1); await o.ctx.close();
o = await och(10); await sh(o.p, 's10a'); await bos(o.p, '.lesson-root .ri-s10-t .q-chip >> nth=1', 1500); await sh(o.p, 's10b', 1); await o.ctx.close();
o = await och(11, { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': RICE4 }); await bos(o.p, '.lesson-root .ri-darvoza .q-chip >> nth=0', 900); await sh(o.p, 's11', 1); await o.ctx.close();
o = await och(11); await bos(o.p, '.lesson-root .ri-darvoza .q-chip >> nth=0', 900); await sh(o.p, 's11m'); await o.ctx.close();
o = await och(8, { 'pm-m9d1-goyalar': G }); await sh(o.p, 's8'); await o.ctx.close();
console.log('xato', err); await b.close();
