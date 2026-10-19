// ============================================================
//  smoke-preview (F-1015) — LMS «Bilimlar bazasi» preview'ini HAQIQIY brauzerda tekshiradi.
//
//  Har dars ikki marta ochiladi (bir xil sahifa, bir xil eski holat):
//    · NAZORAT — preview'siz, liveToken bilan: dars avvalgidek dars-api'ga boradi (so'rovlar > 0) —
//      bu hisoblagich haqiqatan ishlayotganini ko'rsatadi;
//    · PREVIEW — LMS kontraktidagi proplar: visitMode="preview", previewRunId, liveToken (preview ustun bo'lishi kerak).
//  Brauzerga oldindan eski jonli mentor sessiyasi (liveSession), o'quvchi progressi va LMS kaliti yoziladi.
//  PREVIEW'da kutiladi: dars-api'ga 0 so'rov · PIN-oyna va mentor paneli yo'q · «Oldindan ko'rish» belgisi ·
//  localStorage + sessionStorage to'liq surati o'zgarmagan.
//
//  Ishlatish:
//    CHROME=/usr/bin/google-chrome node scripts/smoke-preview.mjs src/1-Modull/InternetLesson.jsx [boshqa darslar…]
//  Dars avval build-lms bilan vaqtinchalik papkaga yig'iladi (lms/ ga tegilmaydi).
//  `fayl=src-yo'l` — build-lms --as (masalan arxiv/…/CssPractice.jsx=src/1-Modull/CssPractice.jsx).
//  SHARED_SPEC=<kompilyator URL> — shared variant; tashqi modul lokal lms/html-compiler.jsx ga yo'naltiriladi (smoke-shared kabi).
// ============================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { buildBaza } from './preview-baza-build.mjs';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', R = '\x1b[0m';
const TMP = mkdtempSync(join(tmpdir(), 'lms-preview-'));
// Yig'ma YOPIQ lokal portga qaraydi: nazorat (preview'siz) so'rovlari sanaladi, lekin hech qayerga (prodga ham) yetmaydi (F-1015-14)
const API_URL = 'http://127.0.0.1:9';
process.env.DARS_API_URL = API_URL;
const RUN_ID = '7be2c261-5db1-4fb6-9265-b9da22e077e6';
const FAKE_JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWVudG9yIn0.x'; // role: mentor — imzosiz, faqat sinov

const targets = process.argv.slice(2);
if (!targets.length) { console.log(`${RED}Dars fayli kerak${R}`); process.exit(1); }

const findOut = (dir, name) => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? findOut(join(dir, d.name), name) : (d.name === name ? [join(dir, d.name)] : []));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let bad = 0;

const SHARED_SPEC = process.env.SHARED_SPEC || null;
for (const arg of targets) {
  const [src, asPath] = arg.split('=');
  const outDir = join(TMP, 'lms');
  // MUTATSIYA: BAZA_LIVE=<o'zgarishsiz src/live nusxasi> — o'ramsiz, baza kod bilan (src/live joyida qoladi)
  if (process.env.BAZA_LIVE) await buildBaza(src, join(outDir, basename(src)), process.env.BAZA_LIVE);
  else execFileSync(process.execPath, ['scripts/build-lms.mjs', ...(SHARED_SPEC ? ['--shared', SHARED_SPEC] : []), src, ...(asPath ? ['--as', asPath] : [])], { env: { ...process.env, LMS_OUT_DIR: outDir, DARS_API_URL: API_URL }, stdio: 'pipe' });
  const outName = basename(asPath || src).replace(/\.jsx$/, SHARED_SPEC ? '.shared.jsx' : '.jsx');
  const built = findOut(outDir, outName)[0];
  if (!built) throw new Error(`yig'ma topilmadi: ${outName}`);
  const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(readFileSync(built, 'utf8')) || [])[1] || '';
  const res = await build({
    stdin: {
      contents: `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport Lesson from ${JSON.stringify(resolve(built))};\n` +
        `window.__finished = 0;\ncreateRoot(document.getElementById('root')).render(React.createElement(Lesson, window.__PROPS));\n`,
      resolveDir: process.cwd(), sourcefile: 'preview-entry.jsx', loader: 'jsx',
    },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')], charset: 'utf8', write: false, logLevel: 'silent',
    // shared: tashqi kompilyator-modul URL'i → lokal nusxa (LMS resolveri o'rnida; tarmoqqa chiqilmaydi)
    plugins: SHARED_SPEC ? [{ name: 'shared-local', setup(b) { b.onResolve({ filter: /^https:\/\/go\.coddycamp\.uz\/uploads\/course_artifacts\// }, () => ({ path: resolve('lms/html-compiler.jsx') })); } }] : [],
  });
  const seed =
    `localStorage.setItem('liveSession:${lessonId}', JSON.stringify({mode:'mentor',pin:'123456',token:'eski'}));` +
    `localStorage.setItem('ccProgress:${lessonId}', JSON.stringify({screen:3,answers:{},earned:[],startedAt:Date.now(),total:20,savedAt:Date.now()}));` +
    `localStorage.setItem('lmsAuth','lms-kaliti');sessionStorage.setItem('ld-tahrir','eski');` +
    // Dars yuklanishidan OLDINGI to'liq surat (localStorage + sessionStorage) — keyingisi bilan solishtiriladi
    `window.__snap=function(){var f=function(s){var o={};Object.keys(s).forEach(function(k){o[k]=s[k];});return o;};return JSON.stringify({l:f(localStorage),s:f(sessionStorage)});};window.__before=window.__snap();`;
  const page = (props) => {
    const p = join(TMP, `${basename(built)}-${props.visitMode ? 'preview' : 'nazorat'}.html`);
    writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div>` +
      `<script>${seed}window.__PROPS=Object.assign(${JSON.stringify(props)},{onFinished:function(){window.__finished++;}});<\/script>` +
      `<script>${res.outputFiles[0].text}<\/script></body></html>`, 'utf8');
    return p;
  };

  const runOne = async (props) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    const reqs = [], errs = [];
    pg.on('request', (r) => { if (r.url().startsWith(API_URL)) reqs.push(r.method() + ' ' + r.url().slice(API_URL.length)); });
    pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 110)));
    pg.on('request', (r) => { if (/(dars-api|school-api|lms)\.coddycamp\.uz/.test(r.url())) errs.push('PROD so\'rov: ' + r.url().slice(0, 80)); }); // F-1015-14
    await pg.goto('file://' + page(props), { waitUntil: 'domcontentloaded' });
    await pg.waitForSelector('.lesson-root, .hw-root', { timeout: 15000 }).catch(() => errs.push('dars chizilmadi'));
    await pg.waitForTimeout(3000); // heartbeat / join so'rovlari ulgursin
    const st = await pg.evaluate(() => ({
      badge: (document.querySelector('.live-badge')?.innerText || '').trim(),
      previewBadge: !!document.querySelector('[data-live="badge-preview"]'),
      pin: !!document.querySelector('input[placeholder="483 920"]'),
      mentorUi: /Kod:\s*\d|Ko'rsatish|Erkin qilish|Natijani ochish/.test(document.body.innerText || ''),
      storeSame: window.__before === window.__snap(),
      // Haqiqiy saqlov: nomli xossa orqali — getItem qatlamidan o'tmaydi
      real: Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage[k]])),
    }));
    await pg.screenshot({ path: join(TMP, `${basename(built)}-${props.visitMode ? 'preview' : 'nazorat'}.png`) });
    await ctx.close();
    return { ...st, reqs, errs };
  };

  const ctl = await runOne({ lang: 'uz', liveToken: FAKE_JWT });
  const pre = await runOne({ lang: 'uz', liveToken: FAKE_JWT, visitMode: 'preview', previewRunId: RUN_ID });

  const realBefore = { live: JSON.stringify({ mode: 'mentor', pin: '123456', token: 'eski' }) };
  const checks = [
    ['nazorat: dars-api so\'rovlari bor (hisoblagich ishlaydi)', ctl.reqs.length > 0],
    ['preview: dars-api so\'rovi 0', pre.reqs.length === 0],
    ['preview: «Oldindan ko\'rish» belgisi', pre.previewBadge],
    ['preview: PIN-oyna yo\'q', !pre.pin],
    ['nazorat: mentor paneli bor (tekshiruv ishlaydi)', ctl.mentorUi],
    ['preview: mentor paneli yo\'q', !pre.mentorUi],
    ['preview: localStorage + sessionStorage o\'zgarmagan (to\'liq surat)', pre.storeSame],
    ['preview: haqiqiy liveSession o\'zgarmagan', pre.real[`liveSession:${lessonId}`] === realBefore.live],
    ['preview: LMS kaliti joyida', pre.real.lmsAuth === 'lms-kaliti'],
    ['preview: xato yo\'q', pre.errs.length === 0],
    ['nazorat: xato yo\'q', ctl.errs.length === 0],
  ];
  const fail = checks.filter(([, ok]) => !ok);
  if (fail.length) bad++;
  console.log(`${fail.length ? RED + '✗' : GRN + '✓'}${R} ${basename(built)} ${DIM}(${lessonId}${asPath ? ' · --as' : ''})${R}`);
  for (const [t, ok] of checks) console.log(`    ${ok ? GRN + '✓' : RED + '✗'}${R} ${t}`);
  console.log(`    ${DIM}nazorat belgisi: «${ctl.badge}» · so'rovlar: ${ctl.reqs.slice(0, 3).join(', ')}${ctl.reqs.length > 3 ? ' …' : ''}${R}`);
  console.log(`    ${DIM}preview belgisi: «${pre.badge}»${pre.errs.length ? ' · xato: ' + pre.errs.join(' | ') : ''}${ctl.errs.length ? ' · nazorat xato: ' + ctl.errs.join(' | ') : ''}${R}`);
}
await browser.close();
console.log(`\n${DIM}Skrinshotlar: ${TMP}${R}`);
process.exit(bad ? 1 : 0);
