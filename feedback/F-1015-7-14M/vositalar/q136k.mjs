// F-1015-136/138 tashxisi (faqat o'qiydi): (136) yonma-yon tugmalar — ikkalasida outline bo'lsa, halqalar orasidagi bo'shliq;
// (138) kartochka (.fc-card) o'lchami. Har ekranning boshlang'ich holati, 1280×773. node q136.mjs <out.jsonl> <kalitlar> [par=4]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, KEYS, PAR = '4'] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const PROBE = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(e).visibility !== 'hidden'; };
  const halqa = (e) => { const c = getComputedStyle(e); const w = c.outlineStyle !== 'none' ? parseFloat(c.outlineWidth) || 0 : 0; return w ? w + (parseFloat(c.outlineOffset) || 0) : 0; };
  const btn = [...document.querySelectorAll('.stage-content button')].filter(vis);
  const juft = [];
  for (let i = 0; i < btn.length; i++) for (let j = i + 1; j < btn.length; j++) {
    const a = btn[i], c = btn[j]; if (a.parentElement !== c.parentElement) continue;
    const ha = halqa(a), hc = halqa(c); if (!ha && !hc) continue;
    const ra = a.getBoundingClientRect(), rc = c.getBoundingClientRect();
    if (Math.abs(ra.top - rc.top) > 6) continue;
    const gap = Math.min(Math.abs(rc.left - ra.right), Math.abs(ra.left - rc.right));
    juft.push({ ka: (a.className||'').toString().slice(0,60), kp: (a.parentElement.className||'').toString(), pg: getComputedStyle(a.parentElement).gap, a: a.innerText.trim().slice(0, 24), c: c.innerText.trim().slice(0, 24), gap: Math.round(gap), bosh: Math.round(gap - ha - hc), ota: (a.parentElement.className || '').toString().slice(0, 30) });
  }
  const fc = [...document.querySelectorAll('.fc-card')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
  const fcw = [...document.querySelectorAll('.fc')].filter(vis).map(e => Math.round(e.getBoundingClientRect().width));
  return { juft: juft.filter(x => x.bosh < 6), fc, fcw };
};
const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
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
      const r = await p.evaluate(PROBE);
      if (r.juft.length || r.fc.length) appendFileSync(OUT, JSON.stringify({ key, lid: info.lid, s, total: info.total, ...r }) + '\n');
    }
  } catch (e) { appendFileSync(OUT, JSON.stringify({ key, err: String(e.message).slice(0, 80) }) + '\n'); }
  finally { await ctx.close(); }
};
const q = [...keys]; await Promise.all(Array.from({ length: +PAR }, async () => { while (q.length) await one(q.shift()); }));
await b.close(); console.log('tayyor');
