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

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
const TMP = mkdtempSync(join(tmpdir(), 'lms-smoke-'));

// Dars ID'sini faylning o'zidan olamiz (LESSON_META) — qo'lda yozish shart emas
const idOf = (file) =>
  (/lessonId:\s*['"]([^'"]+)['"]/.exec(readFileSync(file, 'utf8')) || [])[1] || '';

const args = process.argv.slice(2);
// html-compiler.jsx (tashqi modul) va *.shared.jsx (tashqi-modulli darslar) bu
// smoke'ga mos emas — ular scripts/smoke-shared.mjs bilan tekshiriladi.
const targets = args.length
  ? [args[0].replace(/\\/g, '/')]
  : readdirSync('lms')
    .filter((f) => f.endsWith('.jsx') && f !== 'html-compiler.jsx' && !f.endsWith('.shared.jsx'))
    .map((f) => 'lms/' + f);

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
    charset: 'utf8', write: false, logLevel: 'silent',
  });

  const mkPage = (seed) =>
    `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div>` +
    `<script>localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');${seed}<\/script>` +
    `<script>${res.outputFiles[0].text}<\/script></body></html>`;

  writeFileSync(page404, mkPage(''), 'utf8');
  // 2-tekshiruv sahifasi: saqlangan praktika-holati bilan ochiladi — shunda dars
  // yuklanishi bilan KOMPILYATOR qatlamini chizadi (aynan biz qo'shgan qism).
  const pageCompiler = join(TMP, `page${i}-compiler.html`);
  writeFileSync(pageCompiler, mkPage(`localStorage.setItem('ccPractice:${lessonId}','{"kind":"hw"}')`), 'utf8');

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
  let hc = false;
  const shotHc = join(TMP, basename(target) + '-kompilyator.png');
  try {
    const p2 = await ctx.newPage();
    p2.on('pageerror', (e) => errs.push('PAGEERROR(kompilyator): ' + String(e.message).slice(0, 110)));
    await p2.goto('file:///' + pageCompiler.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
    await p2.waitForSelector('.hc-root', { timeout: 15000 });
    await p2.waitForTimeout(600);
    hc = await p2.evaluate(() => !!document.querySelector('.hc-root textarea.hc-code'));
    await p2.screenshot({ path: shotHc });
  } catch (e) {
    errs.push('KOMPILYATOR OCHILMADI: ' + String(e.message).split('\n')[0].slice(0, 90));
  }
  await ctx.close();

  const ok = out.root && out.text > 20 && hc && !errs.length;
  console.log(`  ${ok ? GRN + '✓' : RED + '✗'}${R} ${basename(target).padEnd(26)} ` +
    `${DIM}dars: ${out.root ? 'ha' : "yo'q"} (${out.text} belgi) · kompilyator: ${hc ? 'ha' : "yo'q"}${R}`);
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
