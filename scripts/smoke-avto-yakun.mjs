#!/usr/bin/env node
// ============================================================================
//  smoke-avto-yakun (F-1105-03 L2, 10.11.2026) — 25-kontrakt §8: «yangi JSX onFinished ni oxirgi ekranda AVTOMATIK chaqiradi».
//  Har darsni haqiqiy brauzerda OXIRGI ekranda ochadi (hech narsa bosilmaydi) va `onFinished` o'zi chaqirilishini kutadi.
//  Server bog'lanishi taqlid qilinadi: bundle ichida `src/live/resultSchema.js` da isV4 → true, bog'lanish → soxta urinish
//  (fayl o'zi o'zgarmaydi). Yuk: schema_version 2, dars_api, codestrike yo'q bo'lishi shart.
//  Ishlatish: CHROME=/usr/bin/google-chrome node scripts/smoke-avto-yakun.mjs [--lang uz|ru] [--only <qism>] [fayl.jsx…]
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
const LANG = opt('--lang', 'uz');
const ONLY = opt('--only', null);
const argFiles = args.filter((a, i) => !a.startsWith('--') && !['--lang', '--only'].includes(args[i - 1]));
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const files = (argFiles.length ? argFiles : [...new Set(Object.values(reestr).map((d) => d.src))]).filter((f) => !ONLY || f.includes(ONLY)).sort();

const force = {
  name: 'v4-majburiy',
  setup(b) {
    b.onLoad({ filter: /src[\\/]live[\\/]resultSchema\.js$/ }, (a) => {
      let s = readFileSync(a.path, 'utf8');
      const rep = [
        ['export function isV4(lessonId) {', 'export function isV4(lessonId) { return true;'],
        ['export const getDarsApi = (lessonId) => darsApi.get(lessonId) || null;', "export const getDarsApi = (lessonId) => darsApi.get(lessonId) || { attempt_id: 'avto-sinov', session_key: null, lesson_version: 'vT', v2: true };"],
        ['export const autoFinishReady = () => autoLesson !== null && isV4(autoLesson) && atEnd.has(autoLesson) && !autoFired.has(autoKey());', 'export const autoFinishReady = () => atEnd.size > 0 && !autoFired.has(autoKey());'],
      ];
      for (const [x, y] of rep) { if (!s.includes(x)) throw new Error('resultSchema.js o\'zgargan — smoke-avto-yakun.mjs ni yangilang: ' + x.slice(0, 50)); s = s.replace(x, y); }
      return { contents: s, loader: 'js' };
    });
  },
};
const totalOf = (src) => { const body = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || ''; return [...body.matchAll(/\{\s*id:\s*'[^']+'/g)].length; };

const TMP = mkdtempSync(join(tmpdir(), 'avto-'));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { rmSync(TMP, { recursive: true, force: true }); process.exit(130); });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const bad = [];
let good = 0;
const t0 = Date.now();
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
  const total = totalOf(src);
  if (!lessonId || !total) { bad.push({ file, why: 'lessonId/SCREEN_META yo\'q' }); continue; }
  let bundle;
  try {
    const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
      createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang || 'uz', onFinished: (p) => { (window.__of = window.__of || []).push(p); } }));`,
      resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')], plugins: [force],
      loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
      define: { __DARS_API_URL__: '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
    bundle = res.outputFiles[0].text;
  } catch (e) { bad.push({ file, why: 'esbuild: ' + String(e.message).slice(0, 120) }); continue; }
  const page = join(TMP, `${basename(file, '.jsx')}.html`);
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>window.__lang=${JSON.stringify(LANG)};for(const r of ['mentor','learner','student','self'])localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('liveLang',${JSON.stringify(LANG)});localStorage.setItem('cc_lang',${JSON.stringify(LANG)});localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');localStorage.setItem('ccProgress:${lessonId}',JSON.stringify({screen:${total - 1},answers:{},earned:[],startedAt:Date.now()-60000,total:${total},savedAt:Date.now()}));<\/script><script>${bundle}<\/script></body></html>`);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 100)));
  let r = null;
  try {
    await p.goto(`file://${page}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await p.waitForSelector('.lesson-root', { timeout: 15000 });
    for (let i = 0; i < 16; i++) { await p.waitForTimeout(250); r = await p.evaluate(() => ({ n: (window.__of || []).length, y: (window.__of || [])[0] || null, fin: !!document.querySelector('[data-live^="finish"]') })); if (r.n) break; }
  } catch (e) { errs.push(String(e.message).slice(0, 100)); }
  await ctx.close();
  const y = r?.y;
  const ok = r && r.n === 1 && y && y.schema_version === 2 && y.dars_api?.attempt_id === 'avto-sinov' && !('codestrike' in y) && !errs.length;
  if (ok) good++;
  else bad.push({ file, lessonId, why: !r ? 'ochilmadi' : r.n > 1 ? `onFinished ${r.n} marta` : !r.n ? (r.fin ? 'tugma bor, avto chaqirilmadi' : 'oxirgi ekranda yakun tugmasi yo\'q (avto chaqirilmadi)') : `yuk: schema ${y?.schema_version}, codestrike ${y && 'codestrike' in y}`, errs });
  process.stdout.write(ok ? '.' : '✗');
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
console.log(`\n\n===== avto-yakun (${LANG}): ${good}/${files.length} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
for (const b of bad) console.log(`✗ ${b.file} — ${b.why}${b.errs?.length ? ' · xato: ' + b.errs.join(' | ') : ''}`);
process.exit(bad.length ? 1 : 0);
