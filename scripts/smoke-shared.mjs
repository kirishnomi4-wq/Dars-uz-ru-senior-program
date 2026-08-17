// ============================================================
//  smoke-shared — TASHQI MODUL + SHARED DARS juftligini haqiqiy brauzerda,
//  LMS muhitini taqlid qilib tekshiradi (har nashrdan oldingi avto-tekshiruv —
//  TZ v2 9-bo'limdagi va'damiz).
//
//  LMS taqlidi qanday: brauzer import-xaritasi (importmap) LMS resolverining
//  o'rnida turadi — `react` va modul-spec bir joydan yechiladi, ya'ni dars ham,
//  tashqi modul ham AYNAN BITTA React nusxasini oladi (T-2 sharti).
//
//    react            → lokal ESM wrapper (bitta vendor-bundle ustidan)
//    react-dom/client → o'sha vendor-bundle ustidan
//    @shared/html-compiler (yoki URL-spec) → lms/html-compiler.jsx
//    dars             → lms/<Name>.shared.jsx
//
//  Tekshiruvlar:
//    1) modul eksportlari: default(function) · checks.bor ishlaydi · HC_NASHR
//    2) dars ochiladi (.lesson-root), konsol 0 xato
//    3) KOMPILYATOR qatlami ochiladi (ccPractice seed) va tugma bosilganda
//       matn teriladi — hook'lar ishlayapti, ya'ni React BITTA nusxada
//
//  Ishlatish:
//    node scripts/smoke-shared.mjs                          — JsVarsLesson.shared
//    node scripts/smoke-shared.mjs lms/Boshqa.shared.jsx "@shared/html-compiler"
// ============================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync, copyFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

const lessonFile = (process.argv[2] || 'lms/JsVarsLesson.shared.jsx').replace(/\\/g, '/');
const MODULE_FILE = 'lms/html-compiler.jsx';
// Spec darsdagi import satridan O'ZI aniqlanadi (qo'lda adashtirib bo'lmaydi)
const lessonSrc = readFileSync(lessonFile, 'utf8');
const spec = process.argv[3]
  || (/^import\s+HtmlCompiler.*?from\s+["']([^"']+)["']/m.exec(lessonSrc) || [])[1];
if (!spec) { console.log(`${RED}Darsdan kompilyator-spec topilmadi${R}`); process.exit(1); }
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(lessonSrc) || [])[1] || '';

const TMP = mkdtempSync(join(tmpdir(), 'shared-smoke-'));

// ── 1) Vendor: react + react-dom/client BITTA bundle'da (bitta nusxa kafolati) ──
// REACT_DIR muhit-o'zgaruvchisi berilsa — react O'SHA papkadan olinadi.
// LMS'da React 18.3.1 turibdi (2026-08-13 da o'lchandi), bizda 19 — modul
// ikkalasida ham sinalishi kerak: REACT_DIR=<react@18 o'rnatilgan papka>.
const vendor = await build({
  stdin: {
    contents: `
import React from 'react';
import { createRoot } from 'react-dom/client';
export { React, createRoot };
`,
    resolveDir: process.env.REACT_DIR || process.cwd(), sourcefile: 'vendor-entry.js', loader: 'js',
  },
  bundle: true, format: 'esm', platform: 'browser', charset: 'utf8',
  write: false, logLevel: 'silent',
});
writeFileSync(join(TMP, 'vendor.js'), vendor.outputFiles[0].text, 'utf8');

// `react` va `react-dom/client` — vendor ustidagi yupqa ESM yuzlar
writeFileSync(join(TMP, 'react.js'), `
import { React } from './vendor.js';
export default React;
export const { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback,
  useReducer, useContext, createContext, createElement, cloneElement, Fragment,
  isValidElement, Children, memo, forwardRef, useId, version } = React;
`, 'utf8');
writeFileSync(join(TMP, 'react-dom-client.js'), `
import { createRoot } from './vendor.js';
export { createRoot };
export default { createRoot };
`, 'utf8');

// ── 2) Modul — o'z holicha (sof ESM, JSX yo'q); dars — JSX'dan kompilyatsiya ──
// LMS quvurining taqlidi: dars faylini LMS o'zi kompilyatsiya qiladi (shu sabab
// build-lms `jsx: 'preserve'` bilan yig'adi), tashqi modul esa XOM holda bajariladi.
copyFileSync(MODULE_FILE, join(TMP, 'shared-module.js'));
const lessonJs = await build({
  entryPoints: [lessonFile],
  bundle: false,                    // faqat transform — importlar tegilmaydi
  format: 'esm',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  charset: 'utf8',
  write: false,
  logLevel: 'silent',
});
writeFileSync(join(TMP, 'lesson.js'), lessonJs.outputFiles[0].text, 'utf8');

// ── 3) Sahifa: importmap = LMS resolverining o'rnida ──
const importMap = {
  imports: {
    'react': './react.js',
    'react-dom/client': './react-dom-client.js',
    [spec]: './shared-module.js',
  },
};
const entry = `
import Modul, * as M from ${JSON.stringify(spec)};
import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from './lesson.js';

window.__smoke = {
  defaultType: typeof Modul,
  eksportlar: Object.keys(M).sort().join(','),
  nashr: M.HC_NASHR || '',
  checksBor: (() => { try { return typeof M.checks.has === 'function' && typeof M.checks.has('h1') === 'function'; } catch { return false; } })(),
  reactVersiya: React.version,
};
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: 'uz' }));
`;
writeFileSync(join(TMP, 'entry.js'), entry, 'utf8');

const mkPage = (name, seed) => {
  const p = join(TMP, name);
  writeFileSync(p,
    `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div>` +
    `<script>localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');${seed}<\/script>` +
    `<script type="importmap">${JSON.stringify(importMap)}<\/script>` +
    `<script type="module" src="./entry.js"><\/script></body></html>`, 'utf8');
  return p;
};
const pageLesson = mkPage('lesson.html', '');
const pageCompiler = mkPage('compiler.html', `localStorage.setItem('ccPractice:${lessonId}','{"kind":"hw"}')`);

// ── 4) Lokal HTTP-server: file:// da module-skriptlar CORS bilan to'siladi ──
const MIME = { html: 'text/html', js: 'text/javascript', json: 'application/json' };
const server = createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0].replace(/^\//, '')) || 'lesson.html';
  try {
    const body = readFileSync(join(TMP, name));
    res.writeHead(200, { 'Content-Type': (MIME[name.split('.').pop()] || 'text/plain') + '; charset=utf-8' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('yo\'q: ' + name);
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// ── 5) Brauzer ──
console.log(`${B}SHARED smoke${R} ${DIM}dars: ${basename(lessonFile)} · modul: ${MODULE_FILE} · spec: ${spec}${R}\n`);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const errs = [];
const hook = (page, tag) => {
  page.on('pageerror', (e) => errs.push(`PAGEERROR(${tag}): ` + String(e.message).slice(0, 130)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/favicon|Download the React|Failed to load resource|net::ERR|preload/i.test(t)) return;
    errs.push(`CONSOLE(${tag}): ` + t.slice(0, 130));
  });
};
let ok = true;
const T = (name, cond, extra = '') => {
  console.log(`  ${cond ? GRN + '✓' : RED + '✗'}${R} ${name}${extra ? `  ${DIM}${extra}${R}` : ''}`);
  if (!cond) ok = false;
};

// A: modul eksportlari + dars renderi
const p1 = await ctx.newPage(); hook(p1, 'dars');
await p1.goto(`${BASE}/lesson.html`, { waitUntil: 'domcontentloaded', timeout: 20000 });
try { await p1.waitForSelector('.lesson-root', { timeout: 15000 }); } catch { /* pastda T() aytadi */ }
await p1.waitForTimeout(700);
const sm = await p1.evaluate(() => window.__smoke || {});
const lessonOk = await p1.evaluate(() => ({
  root: !!document.querySelector('.lesson-root'),
  text: (document.querySelector('.lesson-root')?.innerText || '').trim().length,
}));
T('modul default — function', sm.defaultType === 'function', sm.defaultType);
T('checks.has fabrikasi ishlaydi', sm.checksBor === true);
T('HC_NASHR o\'qildi', !!sm.nashr, sm.nashr);
T('dars ochildi (.lesson-root)', lessonOk.root && lessonOk.text > 20, `${lessonOk.text} belgi · React ${sm.reactVersiya}`);
await p1.screenshot({ path: join(TMP, 'dars.png') });

// B: kompilyator qatlami + hook-sinovi (BITTA React isboti)
const p2 = await ctx.newPage(); hook(p2, 'kompilyator');
await p2.goto(`${BASE}/compiler.html`, { waitUntil: 'domcontentloaded', timeout: 20000 });
let hcOpen = false, hcTyped = false;
try {
  await p2.waitForSelector('.hc-root textarea.hc-code', { timeout: 15000 });
  hcOpen = true;
  // Yozish = setState = hook. Ikki React bo'lsa shu yerda «Invalid hook call» qulaydi.
  // Matn `// salom` — HTML'da ham, JS'da ham yaroqli (aktiv fayl tili noma'lum;
  // JS fayliga `<h1>` yozilsa preview haqli ravishda sintaksis-xato beradi).
  await p2.click('.hc-code');
  await p2.keyboard.type('// salom');
  await p2.waitForTimeout(300);
  hcTyped = (await p2.inputValue('.hc-code')).includes('// salom');
} catch { /* pastda T() aytadi */ }
T('KOMPILYATOR qatlami ochildi (tashqi moduldan)', hcOpen);
T('yozish ishladi — hook OK, React BITTA nusxada', hcTyped);
await p2.screenshot({ path: join(TMP, 'kompilyator.png') });

T('konsol/sahifa xatosi yo\'q', errs.length === 0);
if (errs.length) errs.forEach((e) => console.log(`     ${RED}${e}${R}`));
console.log(`\n${DIM}skrinshotlar: ${TMP}${R}`);
console.log(ok && !errs.length ? `${GRN}${B}SHARED JUFTLIK ISHLAYDI${R}` : `${RED}${B}SINDI — yuqoridagi ✗ larga qarang${R}`);
await browser.close();
server.close();
process.exit(ok && !errs.length ? 0 : 1);
