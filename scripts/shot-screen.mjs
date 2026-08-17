// ============================================================
//  shot-screen — dars faylining AYNAN BIR EKRANINI brauzerda ochib skrinshot oladi.
//  Dizayn-tuzatishni ko'z bilan tekshirish uchun: ekranga qo'lda 12 marta bosib
//  bormaydi — saqlangan progress (`ccProgress`) orqali to'g'ridan-to'g'ri ochiladi.
//
//  Ishlatish:
//    node scripts/shot-screen.mjs src/1-Modull/VsCodeLesson.jsx 12
// ============================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = (process.argv[2] || '').replace(/\\/g, '/');
const screen = Number(process.argv[3] ?? 0);
if (!target) { console.log('fayl kerak'); process.exit(1); }

const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
// SCREEN_META uzunligi = TOTAL_SCREENS
const metaBlock = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src);
const total = metaBlock ? (metaBlock[1].match(/\{\s*id:/g) || []).length : 0;
if (!lessonId || !total) { console.log('lessonId yoki SCREEN_META topilmadi'); process.exit(1); }

const TMP = mkdtempSync(join(tmpdir(), 'shot-'));
const res = await build({
  stdin: {
    contents: `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(target).replace(/\\/g, '/'))};
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: 'uz' }));
`,
    resolveDir: process.cwd(), sourcefile: 'shot-entry.jsx', loader: 'jsx',
  },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});

const seed = `
localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');
localStorage.setItem('ccProgress:${lessonId}', JSON.stringify({
  screen: ${screen}, answers: {}, earned: [], startedAt: Date.now(),
  total: ${total}, savedAt: Date.now()
}));`;
const page = join(TMP, 'p.html');
writeFileSync(page,
  `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div>` +
  `<script>${seed}<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`, 'utf8');

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg = await ctx.newPage();
const errs = [];
pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 110)));
await pg.goto('file:///' + page.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
await pg.waitForSelector('.lesson-root', { timeout: 15000 });
await pg.waitForTimeout(900);
const shot = join(TMP, `${basename(target, '.jsx')}-s${screen}.png`);
await pg.screenshot({ path: shot });
console.log('ekran:', screen, '/', total, '· xato:', errs.length ? errs.join(' | ') : "yo'q");
console.log(shot);
await browser.close();
