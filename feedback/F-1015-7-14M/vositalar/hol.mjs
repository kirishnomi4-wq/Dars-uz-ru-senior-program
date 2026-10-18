import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
// node hol.mjs OUT LANG  — holatli suratlar: s9 (matritsa tugagan), s11 (2- va 3-qadam), s7 (Web yuborilgan)
const [,, OUT, LANG = 'uz'] = process.argv;
const LID = 'full-system-06-13-v18', KEY = 'm6-13', TOT = 21;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
async function och(sc, answers) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt, LG, ans]) => { try { localStorage.setItem('cc_lang', LG); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: +sc, answers: ans, earned: [], total: +tt, savedAt: Date.now() })); } catch {} }, [LID, sc, TOT, LANG, answers]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz|Без кода/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(2000); return { ctx, p };
}
{ const { ctx, p } = await och(9, { 9: { correct: true, picked: true } }); await p.screenshot({ path: `${OUT}/${KEY}-${LANG}-s9-tugagan.jpg`, type: 'jpeg', quality: 75 }); await ctx.close(); }
{ const { ctx, p } = await och(11, {}); const bt = p.locator('.btn').first(); await bt.click(); await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/${KEY}-${LANG}-s11-sabab.jpg`, type: 'jpeg', quality: 75 });
  await p.locator('.btn').first().click(); await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/${KEY}-${LANG}-s11-tuzatish.jpg`, type: 'jpeg', quality: 75 }); await ctx.close(); }
if (LANG === 'uz') { const { ctx, p } = await och(7, {}); await p.locator('.btn').first().click(); await p.waitForTimeout(1800);
  await p.screenshot({ path: `${OUT}/${KEY}-${LANG}-s7-yuborildi.jpg`, type: 'jpeg', quality: 75 }); await ctx.close(); }
await b.close(); console.log('ok');
