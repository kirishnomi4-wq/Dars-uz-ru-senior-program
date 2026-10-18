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
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const painted = (e) => {
    if (/^(IMG|SVG|CANVAS|VIDEO|svg)$/.test(e.tagName)) return true;
    const cs = getComputedStyle(e);
    if (!/rgba\([^)]*,\s*0\)|transparent/.test(cs.backgroundColor)) return true;
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
    if (parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0) return true;
    if (cs.boxShadow && cs.boxShadow !== 'none') return true;
    return [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  };
  const out = [];
  for (const z of document.querySelectorAll('.stage-content .zoomable:not(.z-empty):not(.zoom-on)')) {
    if (!vis(z)) continue;
    const btn = z.querySelector(':scope > .zoom-btn'); if (!btn || !vis(btn)) continue;
    const zr = z.getBoundingClientRect(), br = btn.getBoundingClientRect();
    let L = 1e9, T = 1e9, R = -1e9, B = -1e9, n = 0, yaqin = 1e9;
    const dist = (r) => { const dx = Math.max(0, r.left - br.right, br.left - r.right); const dy = Math.max(0, r.top - br.bottom, br.top - r.bottom); return Math.hypot(dx, dy); };
    for (const e of z.querySelectorAll('*')) {
      if (e.closest('.zoom-btn') || !vis(e) || !painted(e)) continue;
      if (e.closest('svg') && e.tagName !== 'svg') continue;
      const r = e.getBoundingClientRect();
      if (r.width >= zr.width - 2 && r.height >= zr.height - 40) continue; // zoomable'ning o'z foni/ramkasi
      yaqin = Math.min(yaqin, dist(r));
      L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, Math.min(r.right, zr.right)); B = Math.max(B, r.bottom); n++;
    }
    if (!n) continue;
    const mark = Math.abs((L + R) / 2 - (zr.left + zr.right) / 2) < 16 && (R - L) < zr.width - 60;
    // yonma-yon ustunli ota
    let qator = null, a = z;
    for (let d = 0; d < 4 && a.parentElement; d++) {
      const p = a.parentElement; const cs = getComputedStyle(p);
      const kids = [...p.children].filter(vis);
      const yon = kids.filter(k => k !== a && Math.abs(k.getBoundingClientRect().top - a.getBoundingClientRect().top) < a.getBoundingClientRect().height && (k.getBoundingClientRect().left >= a.getBoundingClientRect().right - 4 || k.getBoundingClientRect().right <= a.getBoundingClientRect().left + 4));
      if ((cs.display.includes('flex') && !cs.flexDirection.startsWith('column') || cs.display.includes('grid')) && yon.length) {
        const s = yon[0]; const sr = s.getBoundingClientRect();
        // qo'shni ustundagi birinchi chizilgan element tepasi
        let st = 1e9; for (const e of [s, ...s.querySelectorAll('*')]) { if (!vis(e) || !painted(e)) continue; st = Math.min(st, e.getBoundingClientRect().top); }
        qator = { ai: cs.alignItems, tepaFarq: st > 1e8 ? null : Math.round(T - st), zH: Math.round(a.getBoundingClientRect().height), sH: Math.round(sr.height), cls: (p.className || '').toString().slice(0, 40) };
        break;
      }
      a = p;
    }
    out.push({ cls: (z.parentElement.className || '').toString().slice(0, 40), zw: Math.round(zr.width), cw: Math.round(R - L), gapR: Math.round(zr.right - R), yaqin: Math.round(yaqin), gapT: Math.round(T - br.bottom), mark, qator,
      pastda: Math.round(B - (document.querySelector('.stage-nav')?.getBoundingClientRect().top ?? innerHeight)) });
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
