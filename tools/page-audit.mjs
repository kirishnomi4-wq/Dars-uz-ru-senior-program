#!/usr/bin/env node
// ============================================================================
// PAGE-AUDIT — darsni brauzerda ekranma-ekran ochib, bridge-tozalik qoidalarini O'LCHAYDI (2026-09-26).
// Tuzatmaydi — faqat ro'yxat beradi (foydalanuvchi: «to'liq qarab chiqib, nimalar qilishimizni spiskasi bilan kel»).
//
//   node tools/page-audit.mjs <lesson.jsx> [--out=<dir>] [--clicks=4] [--lang=uz] [--shots]
//
// Har ekran: (0) boshlang'ich holat + (1..N) birinchi bosiladigan variant/kartalarni ketma-ket bosib chiqilgan holatlar.
// O'lchovlar (har holatda):
//   INP   — maydon (input/textarea) TEPASIDA alohida yorliq-matn turibdi (bridge 48/52/54: savol maydon ICHIDA bo'lsin)
//   INP2  — yorliq ham, placeholder ham bor va ma'nosi bir xil (ikki marta aytilgan)
//   ALIGN — 2–4 ustunli qatorda ustunlarning birinchi qutisi (ustun karta bo'lsa — o'zi) har xil balandlikdan boshlanadi (bridge 38–40), farq > 6px
//   SCROLL— hujjat YOKI ichki aylanuvchi quti 1280×800 ga sig'maydi (26.09: ichki quti ham o'lchanadi)
//   DUP   — bir sahifada bir ma'noni beruvchi ikki matn-blok (so'z-o'zak Jaccard ≥ 0.5 yoki biri ikkinchisini o'z ichiga oladi)
// ============================================================================
import { chromium } from 'playwright-core';
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const argv = process.argv.slice(2);
const opts = Object.fromEntries(argv.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v === undefined ? true : v]; }));
const file = argv.find(a => !a.startsWith('--'));
if (!file) { console.log('fayl kerak'); process.exit(1); }
const CLICKS = Number(opts.clicks ?? 4);
const LANG = opts.lang || 'uz';
const src = readFileSync(file, 'utf8');
const lessonId = (/lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const sm = /const\s+SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src);
const metaRows = sm ? [...sm[1].matchAll(/\{\s*id\s*:\s*'([^']+)'[^}]*?type\s*:\s*'([^']+)'[^}]*?template\s*:\s*'([^']+)'/g)].map(m => ({ id: m[1], type: m[2], template: m[3] })) : [];
const total = metaRows.length;
const outDir = resolve(opts.out || join(process.env.CLAUDE_SCRATCHPAD || '/tmp', 'page-audit', basename(file, '.jsx')));
mkdirSync(outDir, { recursive: true });

async function bundle() {
  const entry = join(outDir, 'entry.jsx');
  writeFileSync(entry, `import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(file))};
const q = new URLSearchParams(location.search);
const lang = q.get('lang') || 'uz', s = Number(q.get('s') || 0), id = q.get('id') || '', total = Number(q.get('total') || 0);
try { localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() }));
  localStorage.setItem('cc_lang', lang); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang }));
`);
  await esbuild.build({
    entryPoints: [entry], bundle: true, outfile: join(outDir, 'bundle.js'), format: 'iife', platform: 'browser', target: 'es2020',
    jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
    loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.gif': 'dataurl', '.webp': 'dataurl', '.mp3': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.MODE': '"production"', 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true', '__DARS_API_URL__': '""' },
    absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
  });
  const css = existsSync(join(outDir, 'bundle.css')) ? '<link rel="stylesheet" href="bundle.css">' : '';
  const html = join(outDir, 'index.html');
  writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8">${css}</head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  return html;
}

// ---------------------------------------------------------------- sahifa ichida ishlaydigan o'lchov
function measure() {
  const root = document.querySelector('.lesson-root') || document.body;
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05 && !el.closest('[aria-hidden="true"],.cc-ghost'); };
  const txt = (el) => (el.innerText || '').replace(/\s+/g, ' ').trim();
  const out = { inp: [], align: [], dup: [], scroll: 0, loud: [] };
  const skip = (el) => el.closest('nav,.nav,.stage-nav,.topbar,.progress,.ach-counter,.mentor-stats,.mstats,.live-badge,.zoom-btn,.fc-bar,.qz-hud,.cs-hud,footer');
  // ---- INP
  for (const inp of root.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]),textarea')) {
    if (!vis(inp)) continue;
    const ir = inp.getBoundingClientRect();
    const ph = (inp.getAttribute('placeholder') || '').trim();
    // tepadagi yaqin matn: ota-bobolardagi oldingi aka-uka elementlar, 70px ichida, qisqa
    let lab = null;
    let node = inp;
    for (let up = 0; up < 3 && node && !lab; up++) {
      let sib = node.previousElementSibling;
      while (sib && !lab) {
        if (vis(sib)) {
          const r = sib.getBoundingClientRect(); const t = txt(sib);
          if (t && t.length <= 110 && r.bottom <= ir.top + 4 && ir.top - r.bottom < 70 && !sib.querySelector('input,textarea,button') && !/mentor|rcp-step/i.test(sib.className) && !sib.closest('.rcp-step-h')) lab = { t, gap: Math.round(ir.top - r.bottom) };
          break;
        }
        sib = sib.previousElementSibling;
      }
      node = node.parentElement;
    }
    if (lab) out.inp.push({ label: lab.t.slice(0, 90), ph: ph.slice(0, 90), gap: lab.gap });
  }
  // ---- ALIGN: yonma-yon turgan ikki ustun
  const boxyEl = (n) => { const cs = getComputedStyle(n);
    return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0; };
  const firstBox = (col) => {
    // Ustunning o'zi karta bo'lsa — kartaning tepasi solishtiriladi (26.09: ichki quti emas)
    const cr = col.getBoundingClientRect();
    if (boxyEl(col) && cr.height >= 36) return { top: cr.top, el: (col.className || col.tagName).toString().slice(0, 40) };
    const walker = document.createTreeWalker(col, NodeFilter.SHOW_ELEMENT);
    let n = walker.currentNode;
    while (n) {
      if (n !== col && vis(n)) {
        const r = n.getBoundingClientRect();
        if (boxyEl(n) && r.height >= 36 && r.width >= cr.width * 0.55) return { top: r.top, el: (n.className || n.tagName).toString().slice(0, 40) };
      }
      n = walker.nextNode();
    }
    return null;
  };
  // 2–4 ustunli qator (26.09: avval faqat 2 ustun, kenglik ≥260, chegara 10px edi — 3 ustunli qatorlar ko'rilmasdi)
  const seen = new Set();
  for (const el of root.querySelectorAll('div,section')) {
    if (!vis(el) || skip(el)) continue;
    const kids = [...el.children].filter(vis);
    if (kids.length < 2 || kids.length > 4) continue;
    const rs = kids.map(k => k.getBoundingClientRect());
    if (rs.some(r => r.width < 180)) continue;
    let row = true;
    for (let i = 1; i < rs.length; i++) if (rs[i].left < rs[i - 1].right - 4 || Math.abs(rs[i].top - rs[0].top) > 400) row = false;
    if (!row) continue; // yonma-yon emas (yoki 2×2 to'r)
    const fs = kids.map(firstBox);
    if (fs.some(f => !f)) continue;
    const tops = fs.map(f => f.top);
    const d = Math.round(Math.max(...tops) - Math.min(...tops));
    const key = Math.round(rs[0].top) + ':' + Math.round(rs[1].left);
    if (d > 6 && !seen.has(key)) { seen.add(key); out.align.push({ diff: d, cols: kids.length, left: fs[0].el, right: fs[fs.length - 1].el, y: Math.round(Math.min(...tops)), row: (el.className || el.tagName).toString().slice(0, 40), kids: kids.map(k => (k.className || k.tagName).toString().slice(0, 30) + '@' + Math.round(k.getBoundingClientRect().top)), tops: tops.map(Math.round) }); }
  }
  // ---- DUP
  const blocks = [];
  for (const el of root.querySelectorAll('h1,h2,h3,p,li,button,label,span,div')) {
    if (!vis(el) || skip(el)) continue;
    if (el.querySelector('p,li,h1,h2,h3,div,button')) continue; // barg-blok
    if (el.tagName !== 'BUTTON' && el.closest('button,[role=button]')) continue; // tugma ichidagi bo'lak — tugma o'zi olinadi
    const t = txt(el); if (t.length < 18 || t.length > 420) continue;
    blocks.push({ el, t, cls: (el.className || el.tagName).toString().slice(0, 30), mentor: !!el.closest('.mentor,.mentor-bubble,[class*=mentor]') });
  }
  const stem = (w) => w.toLowerCase().replace(/[^a-zЀ-ӿ0-9ʻ'’]/g, '').replace(/[ʻ'’]/g, '').slice(0, 5);
  const STOP = new Set(['va', 'bu', 'u', 'bir', 'bilan', 'uchu', 'ham', 'emas', 'yoki', 'keyi', 'har', 'shu', 'nima', 'qand', 'siz', 'sizn', 'the', 'и', 'в', 'не', 'на', 'это', 'с', 'что', 'как', 'для', 'по']);
  const sets = blocks.map(b => new Set(b.t.split(/\s+/).map(stem).filter(w => w.length >= 3 && !STOP.has(w))));
  for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
    const A = sets[i], B = sets[j]; if (A.size < 4 || B.size < 4) continue;
    const ei = blocks[i].el, ej = blocks[j].el;
    if (ei.contains(ej) || ej.contains(ei)) continue;                       // bitta element ichma-ich (tugma > span)
    const ci = ei.closest('button,[role=button],label,li'), cj = ej.closest('button,[role=button],label,li');
    if (ci && ci === cj) continue;                                           // bitta tugma/variant ichidagi qismlar
    let inter = 0; for (const w of A) if (B.has(w)) inter++;
    const jac = inter / (A.size + B.size - inter);
    const cont = inter / Math.min(A.size, B.size);
    if (jac >= 0.5 || cont >= 0.8) out.dup.push({ score: Math.round(Math.max(jac, cont * 0.9) * 100) / 100, a: blocks[i].t.slice(0, 110), b: blocks[j].t.slice(0, 110), am: blocks[i].mentor, bm: blocks[j].mentor });
  }
  // ---- LOUD: dizaynni buzadigan baland (to'yingan, o'rta-to'q) katta fon — foydalanuvchi 26.09: «juda baland rangli … olib tashla»
  const hsl = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(',').map(Number); if (a < 0.6) return null;
    const R = r / 255, G = g / 255, B = b / 255, mx = Math.max(R, G, B), mn = Math.min(R, G, B), l = (mx + mn) / 2, d = mx - mn;
    const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); return { s: sat, l }; };
  const loudSeen = new Set();
  for (const el of root.querySelectorAll('div,section,li,span,p,label,button')) {
    if (!vis(el) || skip(el) || /(^|\s)(btn|rc-btn|lp-done-btn|btn-soft|ais-link|kod-launch-btn|fc-btn)(\s|$)/.test(el.className || '') || el.closest('.editor,.code-box,.vsc,.term,.tg-chat,.phone,.k-slide,.qz-,.fc-card,.cs-')) continue;
    const r = el.getBoundingClientRect(); const area = r.width * r.height; if (area < 12000) continue;
    const c = hsl(getComputedStyle(el).backgroundColor); if (!c) continue;
    if (c.s > 0.45 && c.l > 0.2 && c.l < 0.72) { const k = (el.className || el.tagName).toString().slice(0, 40); if (!loudSeen.has(k)) { loudSeen.add(k); out.loud.push({ cls: k, bg: getComputedStyle(el).backgroundColor, area: Math.round(area / 1000) + 'k', txt: txt(el).slice(0, 50) }); } }
  }
  // ---- ZBTN: ⛶ bo'sh ustun ustida osilib turibdi (pilot sabog'i, 159-qonun 3-band — ramka olingach ⛶ yolg'iz qoladi)
  for (const zb of document.querySelectorAll('.zoom-btn')) {
    if (!vis(zb)) continue; const r = zb.getBoundingClientRect(); const zr = zb.closest('.zoomable')?.getBoundingClientRect(); if (!zr) continue;
    const box = new Set(['zoomable', 'split', 'col', 'screen', 'stage', 'lesson-root']);
    const zel = zb.closest('.zoomable'); const isBox = (el) => el === zb || zb.contains(el) || el.contains(zel) || el === document.body || el === document.documentElement || [...el.classList].some(c => box.has(c) || /^(split|col|screen|stage|zoomable)/.test(c));
    // «siyoh»: ko'rinadigan narsa — matn, media/maydon, yoki fon/chegara (bo'sh o'ram-div hisoblanmaydi)
    const isInk = (el) => { if (/^(IMG|SVG|svg|CANVAS|INPUT|TEXTAREA|BUTTON|VIDEO|path|rect|circle)$/.test(el.tagName)) return true;
      if ((el.textContent || '').trim()) return true; const cs = getComputedStyle(el); const bg = cs.backgroundColor.match(/[\d.]+/g);
      return (bg && (bg.length < 4 || Number(bg[3]) > 0.05)) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none'; };
    let hit = false;
    for (let y = r.top; y < Math.min(r.top + 220, zr.bottom) && !hit; y += 18) for (const x of [r.left - 30, r.left - 140]) {
      if (x < zr.left) continue; const els = document.elementsFromPoint(x, y); const h = els.find(el => !isBox(el) && isInk(el)); if (h) { hit = true; out.zdbg = (h.className || h.tagName).toString().slice(0, 40); break; }
    }
    if (!hit) out.zbtn = (out.zbtn || 0) + 1;
  }
  out.scroll = Math.max(0, Math.round(document.documentElement.scrollHeight - innerHeight));
  // Dars kontenti ichki qutida aylanadi — hujjat balandligi doim 800 chiqadi (26.09: PmLesson12 s0 izoh bloki tugmalar orqasida qolgan, SCROLL=0 edi)
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (!/(auto|scroll)/.test(cs.overflowY) || el.clientHeight < 200) continue;
    if (!el.querySelector('h1, .title')) continue; // faqat asosiy dars qutisi — kod/chat oynasining o'z aylanishi emas
    out.scroll = Math.max(out.scroll, Math.round(el.scrollHeight - el.clientHeight));
  }
  return out;
}

// bosiladigan variant/kartalar (navigatsiya tugmalari emas)
async function clickables(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.lesson-root') || document.body;
    const bad = (el) => el.closest('nav,.nav,.stage-nav,.ach-counter,.zoom-btn,.live-badge,.mentor,footer') || /orqaga|davom|keyingi|назад|далее|продолж|boshlaymiz|yakun/i.test(el.innerText || '');
    const els = [...root.querySelectorAll('button:not([disabled]),[role=button]')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 20 && r.height > 16 && getComputedStyle(el).visibility !== 'hidden' && !bad(el); });
    els.forEach((el, i) => el.setAttribute('data-pa', String(i)));
    return els.length;
  });
}

async function main() {
  if (!lessonId || !total) { console.log('lessonId/SCREEN_META topilmadi'); process.exit(1); }
  const html = await bundle();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const res = [];
  const SKIP_T = /^(MCScreen)$/; const SKIP_TY = /^(stats|flashcards|summary|practice)$/;
  for (let s = 0; s < total; s++) {
    const m = metaRows[s] || {};
    if (SKIP_T.test(m.template || '') || SKIP_TY.test(m.type || '')) continue;
    const url = pathToFileURL(html).href + `?lang=${LANG}&s=${s}&id=${encodeURIComponent(lessonId)}&total=${total}`;
    const agg = { s, id: m.id, type: m.type, inp: new Map(), align: new Map(), dup: new Map(), loud: new Map(), scroll: 0, zbtn0: 0, states: 0, err: null };
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }); // 26.09: 'load' tashqi rasmni kutardi (go.coddycamp.uz sekin) — .lesson-root pastda kutiladi
      await page.waitForSelector('.lesson-root', { timeout: 15000 });
      await page.waitForTimeout(1600);
      const take = async () => {
        const o = await page.evaluate(measure); agg.states++;
        for (const x of o.inp) agg.inp.set(x.label + '|' + x.ph, x);
        for (const x of o.align) agg.align.set(x.left + '|' + x.right + '|' + x.y, x);
        for (const x of o.dup) agg.dup.set(x.a + '|' + x.b, x);
        for (const x of o.loud) agg.loud.set(x.cls, x);
        agg.scroll = Math.max(agg.scroll, o.scroll);
        if (agg.states === 1) agg.zbtn0 = o.zbtn || 0; // faqat boshlang'ich holat: bosishdan oldin
      };
      await take();
      if (opts.shots) await page.screenshot({ path: join(outDir, `s${String(s).padStart(2, '0')}-0.png`) });
      for (let c = 0; c < CLICKS; c++) {
        const n = await clickables(page); if (!n) break;
        const idx = Math.min(c, n - 1);
        try { await page.click(`[data-pa="${idx}"]`, { timeout: 1500 }); } catch { break; }
        await page.waitForTimeout(900);
        await take();
      }
      if (opts.shots) await page.screenshot({ path: join(outDir, `s${String(s).padStart(2, '0')}-z.png`) });
    } catch (e) { agg.err = String(e.message).split('\n')[0].slice(0, 120); }
    res.push({ ...agg, inp: [...agg.inp.values()], loud: [...agg.loud.values()], align: [...agg.align.values()], dup: [...agg.dup.values()].sort((a, b) => b.score - a.score) });
    process.stdout.write(`\r  s${s} ✓   `);
  }
  await browser.close();
  writeFileSync(join(outDir, 'audit.json'), JSON.stringify({ file, lessonId, lang: LANG, res }, null, 1));
  const t = { inp: 0, align: 0, dup: 0, scroll: 0, loud: 0, zbtn: 0 };
  for (const r of res) { t.inp += r.inp.length; t.align += r.align.length; t.dup += r.dup.length; t.loud += r.loud.length; if (r.scroll > 40) t.scroll++; if (r.zbtn0) t.zbtn++; }
  console.log(`\n${basename(file)}  ekran=${res.length}  INP=${t.inp}  ALIGN=${t.align}  DUP=${t.dup}  LOUD=${t.loud}  SCROLL=${t.scroll}  ZBTN=${t.zbtn}  → ${join(outDir, 'audit.json')}`);
}
main().catch(e => { console.error(e); process.exit(1); });
