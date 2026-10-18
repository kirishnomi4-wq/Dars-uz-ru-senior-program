// F-1015-151: matn bo'yalgan qutisidan (fon/chegara) chiqib ketgan joylar — tash > 1px (qutidan tashqarida) yoki ichki chekka (padding) ga kirib ketgan. Til: LANG env.
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
  const boy = (n) => { const c = getComputedStyle(n), g = c.backgroundColor.match(/[\d.]+/g); return (g && (g.length < 4 || Number(g[3]) > 0.05)) || parseFloat(c.borderTopWidth) > 0 || parseFloat(c.borderLeftWidth) > 0; };
  const out = []; const root = document.querySelector('.stage-content') || document.body;
  const rng = document.createRange();
  for (const t of root.querySelectorAll('*')) {
    if (!vis(t) || t.closest('.zoom-btn, svg, .mentor-wrap')) continue;
    const tn = [...t.childNodes].filter(c => c.nodeType === 3 && c.textContent.trim()); if (!tn.length) continue;
    let k = t, d = 0; while (k && d < 4 && !boy(k)) { k = k.parentElement; d++; }
    if (!k || !boy(k) || k === root) continue;
    const kr = k.getBoundingClientRect(); const cs = getComputedStyle(k);
    const pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
    let R = -1e9, L = 1e9; for (const n of tn) { rng.selectNodeContents(n); for (const r of rng.getClientRects()) { if (r.width < 1) continue; R = Math.max(R, r.right); L = Math.min(L, r.left); } }
    if (R < -1e8) continue;
    const ich = kr.right - pr; const tash = R - kr.right; const yaqin = ich - R;
    if (tash > 1 || (pr >= 4 && yaqin < -1)) out.push({ el: t.tagName.toLowerCase() + '.' + (t.className || '').toString().split(' ')[0], quti: (k.className || '').toString().split(' ')[0], tash: Math.round(tash), ichki: Math.round(yaqin), txt: t.textContent.trim().slice(0, 40) });
  }
  return out.slice(0, 20);
};
const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.addInitScript((lg) => { try { localStorage.setItem('cc_lang', lg); } catch {} }, process.env.LANG_DARS || 'ru');
  try {
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(500);
    const kir = p.getByText(/Kodsiz|Без кода/); if (await kir.count()) { await kir.first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(500); }
    let info = await p.evaluate(() => { let total = 0; for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const m = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (m) { total = +m[2]; break; } }
      let lid = null; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } } return { total, lid }; });
    if (!info.lid) { await p.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash|Продолжить|Начать/ }).first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400);
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
