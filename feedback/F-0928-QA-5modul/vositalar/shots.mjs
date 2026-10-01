// Darsning barcha ekranlarini bitta brauzerda ketma-ket suratga oladi (shot-screen.mjs naqshi).
//   SHOT_LANG=uz SHOT_W=1280 SHOT_H=820 node shots.mjs <fayl.jsx> <chiqish-papka> [ekranlar: 0,3,5 | hammasi]
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const target = process.argv[2];
const outDir = process.argv[3];
mkdirSync(outDir, { recursive: true });
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
const metaBlock = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src);
const total = metaBlock ? (metaBlock[1].match(/\{\s*id:/g) || []).length : 0;
if (!lessonId || !total) { console.log('lessonId yoki SCREEN_META topilmadi'); process.exit(1); }
const list = process.argv[4] ? process.argv[4].split(',').map(Number) : [...Array(total).keys()];

const res = await build({
  stdin: {
    contents: `import React from 'react';import { createRoot } from 'react-dom/client';import Lesson from ${JSON.stringify(resolve(target))};
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: ${JSON.stringify(process.env.SHOT_LANG || 'uz')} }));`,
    resolveDir: process.env.RDIR || '/home/kali/Desktop/internetLesson', sourcefile: 'e.jsx', loader: 'jsx',
  },
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});
const page = join(outDir, '_p.html');
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`, 'utf8');

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.SHOT_W || 1280), height: Number(process.env.SHOT_H || 820) } });
for (const s of list) {
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 140)));
  await pg.addInitScript(([id, scr, tot]) => {
    localStorage.clear();
    localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
    localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: scr, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() }));
  }, [lessonId, s, total]);
  await pg.goto('file://' + page, { waitUntil: 'domcontentloaded', timeout: 20000 });
  try { await pg.waitForSelector('.lesson-root', { timeout: 15000 }); } catch { errs.push('lesson-root yo\'q'); }
  await pg.waitForTimeout(Number(process.env.SHOT_WAIT || 1500));
  for (const sel of (process.env.CLICK || '').split(',').map((x) => x.trim()).filter(Boolean)) {
    try { await pg.locator(sel).first().click({ timeout: 4000 }); await pg.waitForTimeout(Number(process.env.CLICK_WAIT || 900)); } catch { errs.push('CLICK topilmadi: ' + sel); }
  }
  if (process.env.EVAL) console.log(JSON.stringify(await pg.evaluate(new Function(process.env.EVAL))));
  const f = join(outDir, `s${String(s).padStart(2, '0')}${process.env.TAG ? '-' + process.env.TAG : ''}.png`);
  await pg.screenshot({ path: f, fullPage: process.env.FULL === '1' });
  console.log(`s${s}/${total} xato: ${errs.length ? errs.join(' | ') : "yo'q"}`);
  await pg.close();
}
await browser.close();
