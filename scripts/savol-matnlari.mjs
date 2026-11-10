#!/usr/bin/env node
// ============================================================================
//  savol-matnlari (F-1105-03 S9, 09.11.2026) — har darsning test savollari matnini (uz + ru) HAQIQIY brauzerdan oladi.
//
//  Nega: savol matni darsning o'z kodida (172 xil komponent) — statik o'qib bo'lmaydi. Dars o'zi bosishda
//  `live.recordAttempt(…, { question, options, picked, correct, lang })` ni chaqiradi; shu chaqiruv serverga ketadigan matn.
//  Skript darsni esbuild bilan yig'adi (bundle ichida `src/live/resultDetails.js` dagi `logAttempt` ga BITTA qator qo'shiladi —
//  fayl o'zi o'zgarmaydi), har test ekranini ikki tilda ochadi, variantni bosadi va o'sha matnni yozib oladi.
//  Arena savollari (`quiz-N`) bu yerda emas — `codestrike-savollar/` (QUIZ_BANK) dan, `savol-kalitlari.mjs` qo'shadi.
//
//  Ishlatish: CHROME=/usr/bin/google-chrome node scripts/savol-matnlari.mjs [--out <fayl.json>] [--only <qism>] [fayl.jsx…]
//    fayl berilmasa — LMS_REESTR.json dagi 172 dars.
//  Natija: { at, lessons: { <lessonId>: { src, screens: { <question_id>: { screen_idx, uz: {question, options}, ru: {…} } }, missing: [...] } } }
//  Darslarga (src/) TEGMAYDI.
// ============================================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const OUT = opt('--out', 'SAVOL_MATNLARI.json');
const ONLY = opt('--only', null);
const argFiles = args.filter((a, i) => !a.startsWith('--') && !['--out', '--only'].includes(args[i - 1]));
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const files = (argFiles.length ? argFiles : [...new Set(Object.values(reestr).map((d) => d.src))]).filter((f) => !ONLY || f.includes(ONLY)).sort();
const NAV = /^(keyingi|orqaga|далее|назад|davom|продолж|boshla|начать|yakunla|заверш|tekshir|провер|qaytadan|заново|→|←|‹|›|×|✕)/i;

function parseLesson(file) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
  const metaBody = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const screens = [...metaBody.matchAll(/\{\s*id:\s*'([^']+)'([^}]*)\}/g)].map((m) => ({ id: m[1], scored: /scored:\s*true/.test(m[2]) }));
  const keyBody = (/const INLINE_KEYS\s*=\s*\{([^}]*)\}/.exec(src) || [])[1] || '';
  const keys = Object.fromEntries([...keyBody.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)/g)].map((m) => [m[1], Number(m[2])]));
  return { lessonId, screens, keys };
}

const tap = {
  name: 'savol-tap',
  setup(b) {
    b.onLoad({ filter: /src[\\/]live[\\/]resultDetails\.js$/ }, (a) => {
      const s = readFileSync(a.path, 'utf8');
      const head = 'export function logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs } = {}) {';
      if (!s.includes(head)) throw new Error('logAttempt imzosi o\'zgargan — savol-matnlari.mjs ni yangilang');
      return { contents: s.replace(head, head + ' try { (window.__qt || (window.__qt = [])).push({ screenIdx, texts: texts || null }); } catch {}'), loader: 'js' };
    });
  },
};

// Brauzer ichida: matni yukdagi matnga teng eng kichik element → .lesson-root dan bola-indekslar yo'li
function findPaths({ q, opts }) {
  const norm = (x) => String(x ?? '').replace(/[`*]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const root = document.querySelector('.lesson-root');
  if (!root) return null;
  const pathOf = (el) => { const p = []; while (el && el !== root) { const par = el.parentElement; if (!par) return null; p.unshift([...par.children].indexOf(el)); el = par; } return el === root ? p : null; };
  const all = [...root.querySelectorAll('*')].filter((e) => e.offsetParent !== null || e.getClientRects().length);
  const find = (t, pool) => {
    const n = norm(t); if (!n) return null;
    const eq = pool.filter((e) => norm(e.innerText) === n);
    if (!eq.length) return null;
    eq.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length); // eng ichkisi emas — matnni to'liq o'raydigan eng kichigi
    return pathOf(eq[0]);
  };
  // Savol: ekrandagi matn yukdagidan farq qilishi mumkin (tirnoq, backtik, qo'shimcha so'z) — so'z to'plami o'xshashligi (Dice ≥ 0.6),
  // uzunligi 0.5–2× ; eng o'xshashi, teng bo'lsa — eng kichik element. Variant tugmalari ichidagilar hisobga olinmaydi.
  const words = (x) => new Set(norm(x).replace(/['"‘’«»“”()?.,:;!—–-]/g, ' ').split(' ').filter(Boolean));
  const fuzzy = (t) => {
    const W = words(t), L = norm(t).length; if (!W.size) return null;
    let best = null, bs = 0, bn = Infinity;
    for (const e of all) {
      if (e.closest('button')) continue;
      const tx = norm(e.innerText); if (tx.length < L * 0.5 || tx.length > L * 2) continue;
      const E = words(tx); let k = 0; for (const w of W) if (E.has(w)) k++;
      const sc = (2 * k) / (W.size + E.size), n = e.querySelectorAll('*').length;
      if (sc > bs + 1e-9 || (Math.abs(sc - bs) < 1e-9 && n < bn)) { best = e; bs = sc; bn = n; }
    }
    return bs >= 0.6 ? pathOf(best) : null;
  };
  const qp = find(q, all) || fuzzy(q);
  const op = opts.map((o) => find(o, [...root.querySelectorAll('button, [role="button"], label, li')]) || find(o, all));
  return { q: qp, opts: op };
}
function readPaths(paths) {
  const root = document.querySelector('.lesson-root');
  const at = (p) => { if (!p) return null; let el = root; for (const i of p) { el = el?.children?.[i]; if (!el) return null; } return (el.innerText || '').replace(/\s+/g, ' ').trim() || null; };
  return { question: at(paths.q), options: (paths.opts || []).map(at) };
}

const TMP = mkdtempSync(join(tmpdir(), 'savol-'));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { rmSync(TMP, { recursive: true, force: true }); process.exit(130); });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const out = { at: new Date().toISOString(), lessons: {} };
let qOk = 0, qMiss = 0;
const t0 = Date.now();

for (const file of files) {
  const L = parseLesson(file);
  const mcq = L.screens.map((s, i) => ({ ...s, i })).filter((s) => s.scored && Number.isInteger(L.keys[s.id]) && L.keys[s.id] >= 0);
  const rec = { src: file, screens: {}, missing: [] };
  out.lessons[L.lessonId || file] = rec;
  if (!L.lessonId || !mcq.length) { rec.note = !L.lessonId ? 'lessonId yo\'q' : 'test ekrani yo\'q'; console.log(`· ${file}: ${rec.note}`); continue; }
  let bundle;
  try {
    const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
      createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang || 'uz', onFinished: () => {} }));`,
      resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')], plugins: [tap],
      loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
      define: { __DARS_API_URL__: '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
    bundle = res.outputFiles[0].text;
  } catch (e) { rec.note = 'esbuild: ' + String(e.message).slice(0, 160); console.log(`✗ ${file}: esbuild`); continue; }
  const total = L.screens.length;
  for (const lang of ['uz', 'ru']) {
    const page = join(TMP, `${basename(file, '.jsx')}-${lang}.html`);
    writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>window.__lang=${JSON.stringify(lang)};window.__qt=[];for(const r of ['mentor','learner','student','self'])localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('liveLang',${JSON.stringify(lang)});localStorage.setItem('cc_lang',${JSON.stringify(lang)});localStorage.setItem('liveSession:${L.lessonId}','{"mode":"self"}');const __s=new URLSearchParams(location.search).get('s');if(__s!==null)localStorage.setItem('ccProgress:${L.lessonId}',JSON.stringify({screen:Number(__s),answers:{},earned:[],startedAt:Date.now(),total:${total},savedAt:Date.now()}));<\/script><script>${bundle}<\/script></body></html>`);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    const p = await ctx.newPage();
    for (const s of mcq) {
      try {
        await p.goto(`file://${page}?s=${s.i}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(600);
        let got = null;
        const n = await p.evaluate(() => document.querySelectorAll('.lesson-root button').length);
        for (let k = 0; k < n && k < 40 && !got; k++) {
          const clicked = await p.evaluate(([k, navSrc]) => {
            const nav = new RegExp(navSrc, 'i');
            const b = [...document.querySelectorAll('.lesson-root button')][k];
            if (!b || b.disabled) return false;
            const t = (b.innerText || '').trim();
            if (!t || nav.test(t)) return false;
            b.click(); return true;
          }, [k, NAV.source]);
          if (!clicked) continue;
          await p.waitForTimeout(120);
          got = await p.evaluate((i) => (window.__qt || []).find((x) => x.screenIdx === i && x.texts && x.texts.question) || null, s.i);
        }
        if (got) {
          const r = rec.screens[s.id] || (rec.screens[s.id] = { screen_idx: s.i, key: L.keys[s.id] });
          r[lang] = { question: got.texts.question, options: got.texts.options || [], lang_reported: got.texts.lang || null };
          // 10.11 (F-1109-07): EKRANDA ko'ringan matn. Ko'p darslar analitikaga doim o'zbekcha matn beradi (RU_I18N_SPEC «UZ-etalon»),
          // shuning uchun ruscha matn yukdan emas, ekrandan olinadi: uz o'tishda savol/variant turgan element yo'li topiladi,
          // ru o'tishda AYNAN o'sha yo'ldan o'qiladi (komponent daraxti ikki tilda bir xil).
          if (lang === 'uz') r._paths = await p.evaluate(findPaths, { q: got.texts.question, opts: got.texts.options || [] });
          if (r._paths) r[lang].shown = await p.evaluate(readPaths, r._paths);
        }
      } catch { /* quyida missing */ }
    }
    await ctx.close();
  }
  for (const s of mcq) {
    const r = rec.screens[s.id];
    if (r && r.uz && r.ru) qOk++; else { qMiss++; rec.missing.push({ id: s.id, uz: !!r?.uz, ru: !!r?.ru }); }
  }
  console.log(`${rec.missing.length ? '△' : '✓'} ${L.lessonId} · ${mcq.length - rec.missing.length}/${mcq.length}${rec.missing.length ? ' · yo\'q: ' + rec.missing.map((m) => m.id).join(',') : ''}`);
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
for (const l of Object.values(out.lessons)) for (const r of Object.values(l.screens || {})) delete r._paths;
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`\n===== savollar ikki tilda: ${qOk} · yetishmadi: ${qMiss} · ${files.length} dars · ${((Date.now() - t0) / 1000).toFixed(0)} s → ${OUT}`);
