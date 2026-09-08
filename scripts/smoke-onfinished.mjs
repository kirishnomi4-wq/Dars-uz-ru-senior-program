// smoke-onfinished — darsni «self» rejimida oxirgi ekranga seed qilib, yakun tugmasini bosadi va onFinished payload'ini ushlaydi:
// TZ §4 detallari (lang, questions[], achievements[]) bormi. Ishlatish: CHROME=… node scripts/smoke-onfinished.mjs src/1-Modull/InternetLesson.jsx
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const file = process.argv[2] || 'src/1-Modull/InternetLesson.jsx';
const src = readFileSync(file, 'utf8');
const lessonId = /lessonId:\s*'([^']+)'/.exec(src)[1];
const metaBody = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
const rows = metaBody.split('\n').filter((l) => /\{\s*id:/.test(l));
const total = rows.length;
const scoredIdx = rows.map((l, i) => (/scored:\s*true/.test(l) ? i : -1)).filter((i) => i >= 0);
const achId = (/const ACHIEVEMENTS\s*=\s*\{\s*\n?\s*([A-Za-z0-9_]+):/.exec(src) || [])[1];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
  window.__payload = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__payload = p; } }));`,
  resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl' }, define: { __DARS_API_URL__: '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
// seed: oxirgi ekran + ikki scored savolga javob (biri to'g'ri, biri noto'g'ri) + bitta yutuq
const answers = {};
scoredIdx.slice(0, 2).forEach((i, k) => { answers[i] = { question: `Savol ${i}`, options: ['A', 'B', 'C', 'D'], correctIndex: 1, correctAnswer: 'B', picked: k === 0 ? 1 : 0, studentAnswer: k === 0 ? 'B' : 'A', correct: k === 0, solved: k === 0 }; });
const seed = `localStorage.setItem('liveSession:${lessonId}','{"mode":"self"}');localStorage.setItem('ccProgress:${lessonId}',JSON.stringify({screen:${total - 1},answers:${JSON.stringify(answers)},earned:${JSON.stringify(achId ? [achId] : [])},startedAt:Date.now()-60000,total:${total},savedAt:Date.now()}));`;
const TMP = mkdtempSync(join(tmpdir(), 'onfin-')); const page = join(TMP, 'p.html');
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const p = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
await p.goto('file://' + page, { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(800);
// yakun tugmasi: matni bo'yicha
const btn = p.locator('button', { hasText: /yakunla|tugat|finish|завершить|закончить/i }).first();
let clicked = false;
if (await btn.count()) {
  await btn.evaluate((el) => el.click()); clicked = true; await p.waitForTimeout(700); // overlay (nishon-bayram / tur) ustida bo'lsa ham
  // ikkinchi qadam: yakun-oynasidagi «Tamom / Готово» (InternetLesson naqshi: showDone → onFinish)
  const done = p.locator('button', { hasText: /^\s*(tamom|готово|done)\s*$/i }).first();
  if (await done.count()) { await done.evaluate((el) => el.click()); await p.waitForTimeout(700); }
}
const payload = await p.evaluate(() => window.__payload);
const text = await p.evaluate(() => (document.querySelector('.lesson-root')?.innerText || '').slice(0, 120).replace(/\s+/g, ' '));
await browser.close();
console.log(`dars: ${file} · total ${total} · scored ${scoredIdx.length} · tugma bosildi: ${clicked} · pageerror: ${errs.length}`);
if (!payload) { console.log('onFinished KELMADI. Ekran matni:', text); process.exit(1); }
const d = { lang: payload.lang, questions: payload.questions, achievements: payload.achievements };
console.log('lang:', d.lang, '· questions:', d.questions?.length, '· achievements:', d.achievements?.length, '· eski maydonlar:', ['lessonId','correctAnswers','totalQuestions','answers'].every((k) => k in payload));
console.log(JSON.stringify(d, null, 1).slice(0, 1500));
process.exit(d.questions && d.achievements && d.lang ? 0 : 1);
