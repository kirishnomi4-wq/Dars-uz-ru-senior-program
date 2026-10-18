// F-1015-124 (T1): telefon ramkasining ichki tuzilmasi — birinchi ko'rinadigan bola (klass, fon, padding, balandlik) va
// ekran mazmuni ramkaga sig'adimi (scrollHeight > clientHeight — kesilish, 131). Faqat o'qiydi.
// node telich.mjs <out.jsonl> "<kalit>:<lid>:<jami>:<ekran>,..."
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, LIST] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const PROBE = () => {
  const lum = (c) => { const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(c); if (!m || (m[4] !== undefined && +m[4] < 0.5)) return null; return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255; };
  const res = [];
  for (const e of document.querySelectorAll('.stage-content *')) {
    const r = e.getBoundingClientRect(); if (r.width < 110 || r.width > 340) continue; const k = r.height / r.width; if (k < 1.55 || k > 2.4) continue;
    const cs = getComputedStyle(e); if (parseFloat(cs.borderTopLeftRadius) < 16) continue; const L = lum(cs.backgroundColor);
    if (!(L !== null && L < 0.25) && !(parseFloat(cs.borderTopWidth) >= 4)) continue;
    if (e.parentElement.closest('[data-ti]')) continue; e.setAttribute('data-ti', '1');
    const kids = [...e.children].filter(c => c.getBoundingClientRect().height > 2).map(c => { const q = getComputedStyle(c); const rr = c.getBoundingClientRect();
      return { cls: (c.className || '').toString().slice(0, 40), tag: c.tagName, h: Math.round(rr.height), bg: q.backgroundColor, pad: q.padding, pos: q.position, ov: q.overflow, kesik: c.scrollHeight > c.clientHeight + 2 }; });
    res.push({ cls: (e.className || '').toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), pad: cs.padding, ov: cs.overflow, kesik: e.scrollHeight > e.clientHeight + 2, kids });
  }
  return res;
};
for (const it of LIST.split(',')) {
  const [KEY, LID, TOT, S] = it.split(':');
  const ctx = await b.newContext({ viewport: { width: 1280, height: 790 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt]) => { try { localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: +sc, answers: {}, earned: [], total: +tt, savedAt: Date.now() })); } catch {} }, [LID, S, TOT]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(3500);
  const t = await p.evaluate(PROBE);
  appendFileSync(OUT, JSON.stringify({ key: KEY, s: +S, t }) + '\n');
  if (process.env.SURAT) { let i = 0; for (const el of await p.locator('[data-ti]').all()) await el.screenshot({ path: `${process.env.SURAT}/${KEY}-s${S}-${i++}.png` }).catch(() => {}); }
  await ctx.close();
}
await b.close();
