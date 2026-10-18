import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const err = [];
const GOYA = (n) => ({ goyalar: Array.from({ length: n }, (_, i) => ({ muammo: ["tanaffusda oshxonada navbat uzun, ovqatga ulgurmaymiz", "uy vazifasi chatda yo'qolib qoladi", "maydonga borsak band bo'ladi", "eski darsliklarni kimga berishni bilmaymiz", "avtobusda o'rindiq topilmaydi"][i], kim: "sinfdoshlar", yechim: ["oshxona menyusini oldindan ko'rsatadigan bot", "vazifalar bitta joyda turadigan sahifa", "maydon bo'sh vaqtlari jadvali", "darslik almashish e'lonlari", "avtobusdagi bo'sh joylar xaritasi"][i], manba: ['kuzatuv', 'royxat', 'keyin', 'royxat', 'kuzatuv'][i] })), savedAt: 1 });
async function och(sc, ls = {}) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc, ls]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m9d1-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); }, [sc, ls]);
  await p.goto('http://localhost:5300/#/lesson/m9-01', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(900); return { p, ctx };
}
const sh = (p, n) => p.screenshot({ path: `d189/${n}.jpg`, type: 'jpeg', quality: 72 });
let o = await och(4);
await sh(o.p, 'a0');
await o.p.locator('.ti-my-tug .q-chip').nth(1).click(); await o.p.waitForTimeout(300); await o.p.locator('.ti-my-amal button').click(); await o.p.waitForTimeout(400); await sh(o.p, 'a1');
await o.p.locator('.ti-my-tug .q-chip').nth(0).click(); await o.p.waitForTimeout(300); await sh(o.p, 'a2'); await o.p.locator('.ti-my-amal button').click(); await o.p.waitForTimeout(400);
await o.p.locator('.ti-my-tug .q-chip').nth(1).click(); await o.p.waitForTimeout(300); await o.p.locator('.ti-my-amal button').click(); await o.p.waitForTimeout(400); await sh(o.p, 'a3');
await o.p.locator('.ti-my-tug .q-chip').nth(0).click(); await o.p.waitForTimeout(300); await o.p.locator('.ti-my-amal button').click(); await o.p.waitForTimeout(1500); await sh(o.p, 'a4'); await o.ctx.close();
o = await och(9); await sh(o.p, 'b0'); await o.ctx.close();
o = await och(9, { 'pm-m9d1-goyalar': GOYA(2) }); await o.p.locator('.ti-src-ro .q-chip').nth(2).click(); await o.p.waitForTimeout(400); await sh(o.p, 'b1'); await o.ctx.close();
o = await och(9, { 'pm-m9d1-goyalar': GOYA(5) }); await o.p.waitForTimeout(800); await o.p.mouse.click(640, 400); await o.p.waitForTimeout(1200); await o.p.mouse.click(640, 400); await o.p.waitForTimeout(1200); await sh(o.p, 'b2'); await o.ctx.close();
console.log('xato', err); await b.close();
