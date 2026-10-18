// Umumiy: darsni N-ekranda ochib, tugmalarni ketma-ket bosib surat oladi.
// node bos.mjs outdir kalit lessonId jami ekran nom "re1|re2|..."  (re — tugma nomi regex; "#4" — 4-chi tugma emas, faqat nom)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, KEY, LID, TOT, S, NOM, SEQ = ''] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
await p.addInitScript(([lid, sc, tt]) => { try { localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: +sc, answers: {}, earned: [], total: +tt, savedAt: Date.now() })); } catch {} }, [LID, S, TOT]);
await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
await p.waitForTimeout(1500);
for (const r of SEQ.split('|').filter(Boolean)) {
  try { await p.getByRole('button', { name: new RegExp(r) }).first().click({ timeout: 3000 }); } catch (e) { errs.push('BOSILMADI ' + r); }
  await p.waitForTimeout(700);
}
await p.waitForTimeout(+(process.env.KUT || 1200));
await p.screenshot({ path: `${OUT}/${KEY}-${NOM}.jpg`, type: 'jpeg', quality: 75 });
console.log(KEY, NOM, errs.join(' | ') || 'ok'); await b.close();
