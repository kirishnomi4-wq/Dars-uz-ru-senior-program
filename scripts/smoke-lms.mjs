// ============================================================
//  smoke-lms — YIG'ILGAN LMS faylini HAQIQIY brauzerda ochib tekshiradi.
//
//  Nega kerak: esbuild va jsx-lint faqat sintaksis/naqshni ko'radi. «Ishga
//  tushmadi» sinfidagi xatolar (`tr is not defined`, ikkita React, buzilgan
//  import) faqat render paytida chiqadi. Bu skript LMS o'rnida turadi:
//  bitta .jsx faylni oladi → React bilan kompilyatsiya qiladi → brauzerda
//  ochadi → `.lesson-root` chizilganini va xato yo'qligini tekshiradi.
//
//  Ishlatish:
//    node scripts/smoke-lms.mjs lms/JsVarsLesson.jsx js-vars-01-v18
//    node scripts/smoke-lms.mjs                       — hamma yig'ilgan fayl
// ============================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, readdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Kali: CHROME=/usr/bin/google-chrome
const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
const TMP = mkdtempSync(join(tmpdir(), 'lms-smoke-'));

// Dars ID'sini faylning o'zidan olamiz (LESSON_META) — qo'lda yozish shart emas
const idOf = (file) =>
  (/lessonId:\s*['"]([^'"]+)['"]/.exec(readFileSync(file, 'utf8')) || [])[1] || '';

const args = process.argv.slice(2);
// html-compiler.jsx (tashqi modul) va *.shared.jsx (tashqi-modulli darslar) bu
// smoke'ga mos emas — ular scripts/smoke-shared.mjs bilan tekshiriladi.
// Chiqish MODUL-papkalariga bo'lingan (lms/3-M, lms/4-M, lms/5-M) — shuning uchun
// ildiz ham, papkalar ham ko'riladi (2026-08-25). Usiz papkadagi darslar JIMGINA
// tekshiruvdan tushib qolardi: `.endsWith('.jsx')` papka nomiga tushmaydi, xato ham bermaydi.
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? walk(dir + '/' + d.name)
    : (d.name.endsWith('.jsx') && d.name !== 'html-compiler.jsx' && !d.name.endsWith('.shared.jsx'))
      ? [dir + '/' + d.name] : []);
const targets = args.length ? [args[0].replace(/\\/g, '/')] : walk(process.env.LMS_DIR || 'lms'); // LMS_DIR — mashq papkasi

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

async function one(target, i) {
  const lessonId = args[1] || idOf(target);
  const page404 = join(TMP, `page${i}.html`);

  // 1) LMS o'rnida: faylni React bilan birga kompilyatsiya qilamiz.
  //    `stdin.resolveDir` = loyiha ildizi — `react` shu yerdagi node_modules'dan topiladi.
  const res = await build({
    stdin: {
      contents: `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(target).replace(/\\/g, '/'))};
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: 'uz' }));
`,
      resolveDir: process.cwd(),
      sourcefile: 'smoke-entry.jsx',
      loader: 'jsx',
    },
    bundle: true, format: 'iife', jsx: 'automatic',
    nodePaths: [resolve('node_modules')], // fayl repo tashqarisida (mashq-papka) bo'lsa ham react shu yerdan
    charset: 'utf8', write: false, logLevel: 'silent',
  });

  const mkPage = (seed) =>
    `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div>` +
    `<script>localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');${seed}<\/script>` +
    `<script>${res.outputFiles[0].text}<\/script></body></html>`;

  writeFileSync(page404, mkPage(''), 'utf8');
  // 2-tekshiruv sahifalari: saqlangan holat bilan ochiladi — shunda dars yuklanishi
  // bilan KOMPILYATOR qatlamini chizadi. Kompilyatorga yetishning IKKI naqshi bor
  // (2026-08-25: PM naqshi smoke-shared.mjs dan ko'chirildi — usiz PmLesson1/2/3/4/9/
  // 11/13/15/17 «KOMPILYATOR OCHILMADI» berardi, holbuki darsning o'zi butun edi):
  //   · texnik darslar: `ccPractice:<id>` = {kind:'hw'} — uy-vazifa oqimi kompilyatorni ochadi
  //   · PM darslar (hw yo'q): KODING-ekranga sakrash (ccProgress) + `<KODING_KEY>` = {open:true}
  const lessonSrc = readFileSync(target, 'utf8');
  const kodingKey = (/KODING_KEY\d*\s*=\s*['"]([^'"]+)['"]/.exec(lessonSrc) || [])[1];
  const metaBody = (/SCREEN_META\d*\s*=\s*\[([\s\S]*?)\n\];/.exec(lessonSrc) || [])[1] || '';
  const metaRows = metaBody.split('\n').filter((l) => /\{\s*id:/.test(l));
  const kodingIdx = metaRows.findIndex((l) => /type:\s*['"]koding['"]/.test(l));
  // KODING-ekran `type:'koding'` deb belgilanmagan darslar — nomzodlar: practice-qatorlar
  // OXIRIDAN (KODING odatda oxirgi praktika); birinchi ochilgan nomzod yetadi.
  const kodingCandidates = kodingIdx !== -1 ? [kodingIdx]
    : metaRows.map((l, k) => (/type:\s*['"]practice['"]/.test(l) ? k : -1)).filter((k) => k !== -1).reverse();
  const seedFor = (idx) => (kodingKey && idx !== -1)
    ? `localStorage.setItem('ccProgress:${lessonId}',JSON.stringify({screen:${idx},answers:{},earned:[],startedAt:Date.now(),total:${metaRows.length},savedAt:Date.now()}));` +
      `localStorage.setItem(${JSON.stringify(kodingKey)},'{"open":true}');`
    : `localStorage.setItem('ccPractice:${lessonId}','{"kind":"hw"}')`;
  // Uchinchi yo'l (2026-09-08, VsCodeLesson): dars `ccPractice` {kind:'hw'} ni ATAYLAB bekor qiladi (uy-vazifa
  // kompilyatorda emas) — kompilyator faqat dars-ichi praktikasi (PRACTICE_AFTER[N]) orqali ochiladi. Seed: darsning
  // o'zi yozadigan shakl {kind:'sN', screen:N} → qayta-yuklash effekti praktikani tiklaydi (F-0801-01).
  const practiceAfterBody = (/(?:const|let|var) PRACTICE_AFTER\d*\s*=\s*\{([\s\S]*?)\n\};/.exec(lessonSrc) || [])[1] || ''; // yig'mada esbuild const→var qiladi
  const practiceAfterScreen = (/^\s*(\d+)\s*:/m.exec(practiceAfterBody) || [])[1];
  const seeds = (kodingKey && kodingCandidates.length ? kodingCandidates : [-1]).map(seedFor);
  if (practiceAfterScreen !== undefined) seeds.push(`localStorage.setItem('ccPractice:${lessonId}',JSON.stringify({kind:'s${practiceAfterScreen}',screen:${practiceAfterScreen}}))`);
  const compilerPages = seeds.map((seed, k) => {
    const p = join(TMP, `page${i}-compiler${k || ''}.html`);
    writeFileSync(p, mkPage(seed), 'utf8');
    return p;
  });

  // 2) Brauzerda ochamiz
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e.message).slice(0, 110)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/favicon|Download the React|Failed to load resource|net::ERR|preload/i.test(t)) return;
    errs.push('CONSOLE: ' + t.slice(0, 110));
  });

  let out = { root: false, text: 0 };
  const shot = join(TMP, basename(target) + '.png');
  try {
    await page.goto('file:///' + page404.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForSelector('.lesson-root', { timeout: 15000 });
    await page.waitForTimeout(700);
    out = await page.evaluate(() => ({
      root: !!document.querySelector('.lesson-root'),
      text: (document.querySelector('.lesson-root')?.innerText || '').trim().length,
    }));
    await page.screenshot({ path: shot });
  } catch (e) {
    errs.push('YUKLANMADI: ' + String(e.message).split('\n')[0].slice(0, 110));
  }

  // ── 3) KOMPILYATOR qatlami ochiladimi (yig'uvning butun ma'nosi shu) ──
  // Kompilyatorsiz darslar (Internet/Git/Deploy/JsIntro/Practice2-4 — bundle'da HtmlCompiler yo'q): 3-qadam
  // o'tkaziladi, dars-ochilish + xato-yo'qligi yetadi (2026-08-17, yakuniy yig'ish).
  const noCompiler = !/hc-root/.test(readFileSync(target, 'utf8').replace(/^\/\/.*$/gm, ''));   // izoh-sarlavhasiz (u HtmlCompiler'ni har doim tilga oladi)
  let hc = noCompiler;
  const shotHc = join(TMP, basename(target) + '-kompilyator.png');
  if (noCompiler) { /* o'tkazildi */ } else {
    let last = '';
    for (const cp of compilerPages) {            // nomzod-urug'lar: birinchi ochilgani yetadi
      const p2 = await ctx.newPage();
      const before = errs.length;
      p2.on('pageerror', (e) => errs.push('PAGEERROR(kompilyator): ' + String(e.message).slice(0, 110)));
      try {
        await p2.goto('file:///' + cp.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
        await p2.waitForSelector('.hc-root', { timeout: compilerPages.length > 1 ? 8000 : 15000 });
        await p2.waitForTimeout(600);
        hc = await p2.evaluate(() => !!document.querySelector('.hc-root textarea.hc-code'));
        await p2.screenshot({ path: shotHc });
      } catch (e) {
        last = 'KOMPILYATOR OCHILMADI: ' + String(e.message).split('\n')[0].slice(0, 90);
      }
      await p2.close();
      if (hc) break;
      errs.length = before;                      // ochilmagan nomzodning xatolari hisobga olinmaydi
    }
    if (!hc && last) errs.push(last);
  }
  await ctx.close();

  const ok = out.root && out.text > 20 && hc && !errs.length;
  console.log(`  ${ok ? GRN + '✓' : RED + '✗'}${R} ${basename(target).padEnd(26)} ` +
    `${DIM}dars: ${out.root ? 'ha' : "yo'q"} (${out.text} belgi) · kompilyator: ${noCompiler ? 'kutilmaydi' : hc ? 'ha' : "yo'q"}${R}`);
  if (errs.length) errs.forEach((e) => console.log(`     ${RED}${e}${R}`));
  else console.log(`     ${DIM}skrinshot: ${shot}${R}`);
  return ok;
}

console.log(`${B}LMS fayllari brauzerda tekshirilmoqda${R} ${DIM}(${targets.length} ta)${R}\n`);
let bad = 0;
for (let i = 0; i < targets.length; i++) if (!(await one(targets[i], i))) bad++;
await browser.close();
console.log(bad ? `\n${RED}${bad} ta fayl sindi${R}` : `\n${GRN}Hammasi ishlaydi${R}`);
process.exit(bad ? 1 : 0);
