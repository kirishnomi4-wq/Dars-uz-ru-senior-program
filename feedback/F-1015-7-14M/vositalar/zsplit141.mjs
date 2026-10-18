// F-1015-141 (Z2): .q-split ustunlari — balandlik va pastdagi bo'sh joy (bosh), sahifa balandligi. Oldin/keyin solishtiriladi.
// F-1015-125/126/127: ⛶ va kontent munosabati o'lchovi (faqat o'qiydi). Har ekranning boshlang'ich holati, 1280×773.
// node zoomolch.mjs <out.jsonl> <kalitlar> [par=4]
// Har ko'rinadigan .zoomable (bo'sh emas) uchun: zr — zoomable, cr — ichidagi CHIZILGAN kontent birlashmasi (⛶ dan tashqari),
// gapR — kontent o'ng chetidan zoomable o'ng chetigacha (⛶ shu yerda turadi), mark — kontent zoomable o'rtasidami,
// qator — yonma-yon ustunli ota (flex/grid) bo'lsa: align-items va qo'shni ustun bilan tepa farqi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, KEYS, PAR = '4'] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const PROBE = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(e).visibility !== 'hidden'; };
  const out = [];
  for (const sp of document.querySelectorAll('.q-split')) {
    if (!vis(sp)) continue;
    const kol = [...sp.children].filter(vis).map(c => {
      const r = c.getBoundingClientRect(); let ich = r.top;
      for (const d of c.querySelectorAll('*')) { if (!vis(d) || d.children.length) continue; const b = d.getBoundingClientRect(); if (b.bottom > ich && b.bottom <= r.bottom + 1) ich = b.bottom; }
      return { h: Math.round(r.height), bosh: Math.round(r.bottom - ich) };
    });
    out.push({ kol, sahifa: Math.round(document.querySelector('.stage-content')?.scrollHeight || 0) });
  }
  return out;
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
    if (!info.lid || !info.total) { appendFileSync(OUT, JSON.stringify({ key, err: 'lid/total' }) + '\n'); return; }
    for (let s = 0; s < info.total; s++) {
      await p.evaluate(([id, sc, tt]) => localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })), [info.lid, s, info.total]);
      await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(1100);
      const z = await p.evaluate(PROBE);
      if (z.length) appendFileSync(OUT, JSON.stringify({ key, lid: info.lid, s, total: info.total, z }) + '\n');
    }
  } catch (e) { appendFileSync(OUT, JSON.stringify({ key, err: String(e.message).slice(0, 80) }) + '\n'); }
  finally { await ctx.close(); }
};
const q = [...keys];
await Promise.all(Array.from({ length: +PAR }, async () => { while (q.length) await one(q.shift()); }));
await b.close();
console.log('tayyor');
