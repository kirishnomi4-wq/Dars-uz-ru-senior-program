// F-1015-124: telefon maketlari — ramka uslubi imzosi + surat (faqat o'qiydi). Har ekranning boshlang'ich holati, 1280×773.
// node telolch.mjs <outdir> <kalitlar> [par=4]  → outdir/tel.jsonl + outdir/<kalit>-s<n>-<i>.png
// Telefon: eni 110–340, bo'yi/eni 1.55–2.4, burchak ≥ 16px, qorong'i fon YOKI ≥ 4px ramka.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, KEYS, PAR = '4'] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const PROBE = () => {
  const lum = (c) => { const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(c); if (!m || (m[4] !== undefined && +m[4] < 0.5)) return null; return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255; };
  const res = []; let i = 0;
  for (const e of document.querySelectorAll('.stage-content *')) {
    const r = e.getBoundingClientRect(); if (r.width < 110 || r.width > 340) continue;
    const k = r.height / r.width; if (k < 1.55 || k > 2.4) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const rad = parseFloat(cs.borderTopLeftRadius); if (rad < 16) continue;
    const bw = parseFloat(cs.borderTopWidth); const L = lum(cs.backgroundColor);
    if (!(L !== null && L < 0.25) && !(bw >= 4)) continue;
    if (e.parentElement && e.parentElement.closest('[data-tel]')) continue;
    e.setAttribute('data-tel', String(i));
    const notch = [...e.querySelectorAll('*')].some(n => { const q = n.getBoundingClientRect(); return q.width > 30 && q.width < r.width * 0.5 && q.height < 18 && q.top - r.top < 30 && Math.abs((q.left + q.right) / 2 - (r.left + r.right) / 2) < 8; });
    res.push({ i, cls: (e.className || '').toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), rad: Math.round(rad), bw: Math.round(bw), pad: cs.paddingTop, bg: cs.backgroundColor, bc: cs.borderTopColor, notch, shadow: cs.boxShadow !== 'none' });
    i++;
  }
  return res;
};
const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(500);
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(500); }
    let info = await p.evaluate(() => { let total = 0; for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const m = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (m) { total = +m[2]; break; } }
      let lid = null; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } } return { total, lid }; });
    if (!info.lid) { await p.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash/ }).first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400);
      info.lid = await p.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; }); }
    if (!info.lid || !info.total) { appendFileSync(OUT + '/tel.jsonl', JSON.stringify({ key, err: 'lid/total' }) + '\n'); return; }
    for (let s = 0; s < info.total; s++) {
      await p.evaluate(([id, sc, tt]) => localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })), [info.lid, s, info.total]);
      await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(1100);
      const t = await p.evaluate(PROBE);
      for (const x of t) await p.locator(`[data-tel="${x.i}"]`).first().screenshot({ path: `${OUT}/${key}-s${s}-${x.i}.png` }).catch(() => {});
      if (t.length) appendFileSync(OUT + '/tel.jsonl', JSON.stringify({ key, s, t }) + '\n');
    }
  } catch (e) { appendFileSync(OUT + '/tel.jsonl', JSON.stringify({ key, err: String(e.message).slice(0, 80) }) + '\n'); }
  finally { await ctx.close(); }
};
const q = [...keys];
await Promise.all(Array.from({ length: +PAR }, async () => { while (q.length) await one(q.shift()); }));
await b.close();
console.log('tayyor');
