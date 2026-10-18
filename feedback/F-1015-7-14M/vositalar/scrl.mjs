import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, KEY, LID, TOT, LIST, LANG = 'uz'] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const s of LIST.split(',')) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 100)));
  await p.addInitScript(([lid, sc, tt, LG]) => { try { localStorage.setItem('cc_lang', LG); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: +sc, answers: {}, earned: [], total: +tt, savedAt: Date.now() })); } catch {} }, [LID, s, TOT, LANG]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz|Без кода/); if (await kir.count()) { await kir.first().click({ timeout: 2000 }).catch(() => {}); }
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/${KEY}-${LANG}-s${s}.jpg`, type: 'jpeg', quality: 75 });
  console.log(s, 'ok', errs.join(' | ')); await ctx.close();
}
await b.close();
