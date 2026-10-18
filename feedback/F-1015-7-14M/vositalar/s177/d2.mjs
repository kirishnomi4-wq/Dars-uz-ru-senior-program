import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const err = [];
const G = { goyalar: [["tanaffusda oshxonada navbat uzun, ovqatga ulgurmaymiz", "oshxona menyusini oldindan ko'rsatadigan bot"], ["uy vazifasi chatda yo'qolib qoladi", "vazifalar bitta joyda turadigan sahifa"], ["maydonga borsak band bo'ladi", "maydon bo'sh vaqtlari jadvali"], ["eski darsliklarni kimga berishni bilmaymiz", "darslik almashish e'lonlari"], ["avtobusda o'rindiq topilmaydi", "avtobusdagi bo'sh joylar xaritasi"]].map(([m, y]) => ({ muammo: m, kim: 'sinfdoshlar', yechim: y, manba: 'kuzatuv' })), savedAt: 1 };
async function och(sc, ls = {}) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m9d2-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls]);
  await p.goto('http://localhost:5300/#/lesson/m9-02', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(900); return { p, ctx };
}
const sh = (p, n) => p.screenshot({ path: `d2/${n}.jpg`, type: 'jpeg', quality: 72 });
let o = await och(4);
for (let i = 0; i < 5; i++) { const bt = o.p.locator('.lesson-root button.ri-halqa, .lesson-root .ri-ust-b:not([disabled]), .lesson-root th button').first(); if (await bt.count()) await bt.click().catch(() => {}); await o.p.waitForTimeout(900); if (i === 1) await sh(o.p, 's4a'); }
await o.p.waitForTimeout(2500); await sh(o.p, 's4b'); await o.ctx.close();
o = await och(8, { 'pm-m9d1-goyalar': G }); await sh(o.p, 's8a'); await o.ctx.close();
o = await och(9, { 'pm-m9d1-goyalar': G, 'pm-m9d2-rice': { otdi: [0, 1, 2, 3] } }); await sh(o.p, 's9a'); await o.ctx.close();
o = await och(10, { 'pm-m9d1-goyalar': G }); const c = o.p.locator('.lesson-root button').filter({ hasText: /Qamrov|80/ }).first(); if (await c.count()) await c.click().catch(() => {}); await o.p.waitForTimeout(1200); await sh(o.p, 's10a'); await o.ctx.close();
console.log('xato', err); await b.close();
