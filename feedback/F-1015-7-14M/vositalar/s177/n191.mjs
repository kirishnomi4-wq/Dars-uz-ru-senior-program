import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const err = [];
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-191-keyin/';
async function och(sc) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  p.on('pageerror', e => err.push(sc + ': ' + e.message));
  await p.addInitScript(([sc]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m9d2-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); }, [sc]);
  await p.goto('http://localhost:5300/#/lesson/m9-02', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(900); return { p, ctx };
}
let o = await och(10);
const sanoq = await o.p.locator('.lesson-root').evaluate(r => (r.innerText.match(/\d\s*\/\s*\d(?!\d)/g) || []).slice(0, 4));
console.log('s10 sanoq matnlari', sanoq);
await o.p.locator('.lesson-root .ri-s10-t .q-chip').nth(1).click(); await o.p.waitForTimeout(1500);
const bayram = await o.p.locator('.lesson-root').evaluate(r => /Pair Review/.test(r.innerText));
console.log('s10 dan keyin "Pair Review" matni bormi:', bayram);
await o.p.screenshot({ path: D + 's10b.jpg', type: 'jpeg', quality: 70 });
// Natijalar (s13?) — ekran indeksini topish: SCREEN_META podium
for (const sc of [13, 14]) { const q = await och(sc); const t = await q.p.locator('.lesson-root').evaluate(r => r.innerText.slice(0, 1200)); if (/Nishonlar/.test(t)) { console.log('ekran', sc, t.match(/Nishonlar[^\n]*/)[0], '| Pair Review bormi:', /Pair Review/.test(t)); await q.p.screenshot({ path: D + `s${sc}-natijalar.jpg`, type: 'jpeg', quality: 70 }); } await q.ctx.close(); }
const y = await och(15); const ty = await y.p.locator('.lesson-root').evaluate(r => r.innerText); console.log('yakun: Pair Review bormi:', /Pair Review/.test(ty), '| nishon soni matni:', (ty.match(/[Nn]ishon[^\n]*/g) || []).slice(0, 3));
await y.p.screenshot({ path: D + 's15-yakun.jpg', type: 'jpeg', quality: 70, fullPage: true }); await y.ctx.close();
console.log('xato', err); await b.close();
