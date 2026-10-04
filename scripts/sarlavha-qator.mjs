#!/usr/bin/env node
// ============================================================================
// SARLAVHA-QATOR — 164-qonun ekran-darvozasi (F-1002-75, 2026-10-02): har ekran sarlavhasi (`.h-title`)
// 1280x800 da, uz va ru rejimda BITTA qatorga sig'adimi — brauzerda o'lchaydi (belgi sanog'i taxminiy:
// 36px serif shriftda kirill va «→» keng, 46 belgilik ru sarlavha ham buzildi). `lint:olchov` — oldindan
// belgi-tekshiruv (uz ≤55, ru ≤60); bu skript — yakuniy hukm. Sekin (~1 daqiqa/dars), shuning uchun gates'da
// emas — modul oxiri darvozasi (MEXANIZM 2-bosqich, `lint:layout` bilan bir qatorda).
// Ikki sinov: 2-dars a171852 (s1 uz/ru 2 qator) — topadi; tuzatilgan — jim.
//
// Ishlatish:  CHROME=/usr/bin/google-chrome node scripts/sarlavha-qator.mjs <fayl.jsx> [fayl…]
// Chiqish kodi: 2 qatorli sarlavha bo'lsa → 1
// ============================================================================
import { chromium } from 'playwright-core';
import { build } from 'esbuild';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const FILES = process.argv.slice(2);
if (!FILES.length) { console.log('Ishlatish: node scripts/sarlavha-qator.mjs <fayl.jsx> [fayl…]'); process.exit(2); }
const TMP = mkdtempSync(join(tmpdir(), 'ttl-'));
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
let bad = 0;
for (const file of FILES) {
const src = (await import('node:fs')).readFileSync(file, 'utf8');
const metaBlk = (src.match(/const SCREEN_META = \[([\s\S]*?)\n\];/) || [, ''])[1];
const total = (metaBlk.match(/\{ id:/g) || []).length;
const lessonId = (src.match(/lessonId:\s*'([^']+)'/) || [])[1];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from '${process.cwd()}/${file}'; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__LANG }));`, resolveDir: process.cwd(), loader: 'jsx' },
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, bundle: true, format: 'iife', jsx: 'automatic', write: false, logLevel: 'silent' });
const out = [];
for (const lang of ['uz', 'ru']) for (let sc = 0; sc < total; sc++) {
  const page = join(TMP, `p-${lang}-${sc}.html`);
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>window.__LANG='${lang}';localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');localStorage.setItem('ccProgress:${lessonId}',JSON.stringify({screen:${sc},answers:{},earned:[],startedAt:Date.now(),total:${total},savedAt:Date.now()}));localStorage.setItem('ccLang','${lang}');localStorage.setItem('lang','${lang}');<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('file://' + page); await p.waitForTimeout(700);
  const r = await p.evaluate(() => { const h = document.querySelector('.h-title'); if (!h) return null; const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize) * 1.2; return { lines: Math.round(h.getBoundingClientRect().height / lh), t: h.textContent.slice(0, 60) }; });
  if (r && r.lines > 1) out.push(`${lang} s${sc}: ${r.lines} qator — ${r.t}`);
  await p.close();
}
bad += out.length;
console.log(file.split('/').pop(), `(${total} ekran)`, out.length ? '\n  ' + out.join('\n  ') : '— hammasi 1 qator');
}
await b.close();
console.log(`\nsarlavha-qator: ${FILES.length} fayl · ${bad} ta 2 qatorli sarlavha (1280x800, uz+ru)`);
process.exit(bad ? 1 : 0);
