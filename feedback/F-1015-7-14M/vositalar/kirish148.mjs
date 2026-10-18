// F-1015-148 supurish: har darsning 1-ekrani QKirish bo'lsa — surat (0.5) + maket va o'ng ustun eni, balandlik.
// node kirish148.mjs <outdir> <kalitlar> [par]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, KEYS, PAR = '4'] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, deviceScaleFactor: 0.5, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
    const k = p.getByText(/Kodsiz/); if (await k.count()) await k.first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(1500);
    const m = await p.evaluate(() => { const q = document.querySelector('.q-kirish .q-split'); if (!q) return null; const c = q.children[0].getBoundingClientRect(); const v = q.children[1].getBoundingClientRect(); return { maket: Math.round(c.width), ong: Math.round(v.width), h: Math.round(Math.max(c.height, v.height)) }; });
    if (m) { await p.screenshot({ path: `${OUT}/${key}.jpg`, type: 'jpeg', quality: 70 }); appendFileSync(`${OUT}/olchov.jsonl`, JSON.stringify({ key, ...m }) + '\n'); }
  } catch (e) { appendFileSync(`${OUT}/olchov.jsonl`, JSON.stringify({ key, err: String(e.message).slice(0, 60) }) + '\n'); }
  finally { await ctx.close(); }
};
const q = KEYS.split(','); await Promise.all(Array.from({ length: +PAR }, async () => { while (q.length) await one(q.shift()); })); await b.close(); console.log('tayyor');
