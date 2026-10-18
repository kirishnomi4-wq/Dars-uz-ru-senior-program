// har kalit: oxirgi 2 ekran (Natijalar + Yakun) surati; lessonId va jami avtomatik
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, KEYS, BACK = '2'] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const KEY of KEYS.split(',')) {
  let ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); let p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('cc_lang', 'uz'));
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('ccProgress:')); const m = document.body.innerText.match(/\b(\d{2}) \/ (\d{2})\b/); let t = 0; try { t = JSON.parse(localStorage.getItem(k)).total; } catch {} return { lid: k && k.slice(11), tot: t || (m ? +m[2] : 0) }; });
  await ctx.close();
  if (!info.lid || !info.tot) { console.log(KEY, 'topilmadi', JSON.stringify(info)); continue; }
  for (let d = +BACK; d >= 1; d--) {
    const s = info.tot - d;
    ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); p = await ctx.newPage();
    await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [info.lid, s, info.tot]);
    await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 2000 }).catch(() => {}); }
    await p.waitForTimeout(1800);
    await p.keyboard.press('Escape').catch(() => {});
    await p.screenshot({ path: `${OUT}/${KEY}-s${s}.jpg`, type: 'jpeg', quality: 70, fullPage: true });
    await ctx.close();
  }
  console.log(KEY, info.lid, info.tot);
}
await b.close();
