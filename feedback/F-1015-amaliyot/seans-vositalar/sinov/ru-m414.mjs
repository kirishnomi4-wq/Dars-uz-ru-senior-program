// F-1015-351 · m4-14 RU yurish: 8 ekran — pageerror, [object Object], lotin-o'zbekcha qoldiq
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4-Modull/FullstackFeedbackLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/ru', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'fullstack-feedback-p4-v18';
const page = OUT + '/ru.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*)\b/i;
const out = [];
for (let i = 0; i < 8; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 7, answers: { 0: { picked: 'b' }, 5: { picked: 'confirm', correct: true, solved: true } }, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (!sessionStorage.getItem('x')) { localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); sessionStorage.setItem('x', 1); } }, [ID, prog]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  if (i === 1) { await (async (sel) => { await p.click(sel); await p.waitForTimeout(350); const ot = await p.innerText('.am-tt-oyna').catch(() => ''); const q = ot.split('\n').filter(l => UZ.test(l)); if (q.length) out.push('    oyna uz-qoldiq: ' + q.slice(0, 2).join(' ‖ ')); await p.keyboard.press('Escape'); await p.waitForTimeout(250); })('.am-tt-btn'); /* F-1015-372: oyna */ await p.waitForTimeout(200); }
  if (i === 2) { await p.fill('.am-input >> nth=0', 'Кнопка маленькая'); await p.click('.am-chip >> nth=0'); await p.fill('.am-input >> nth=1', 'Классно'); await p.click('.am-chip >> nth=3'); await p.waitForTimeout(300); }
  if (i === 3) { await p.click('.vcard >> nth=0'); await p.waitForTimeout(300); await p.click('.quad >> nth=2', { force: true }); await p.waitForTimeout(400); }
  if (i === 4) { await p.click('.spot.busy >> nth=0'); await (async (sel) => { await p.click(sel); await p.waitForTimeout(350); const ot = await p.innerText('.am-tt-oyna').catch(() => ''); const q = ot.split('\n').filter(l => UZ.test(l)); if (q.length) out.push('    oyna uz-qoldiq: ' + q.slice(0, 2).join(' ‖ ')); await p.keyboard.press('Escape'); await p.waitForTimeout(250); })('.am-qt-btn'); /* F-1015-372: oyna */ await p.waitForTimeout(300); }
  if (i === 7) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); }
  const txt = await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText);
  const qoldiq = txt.split('\n').filter(l => UZ.test(l) && !/[{<]|mailto|index\.html|Gemini|Live Server|gemini\.google|setGames|games|yangi|Route|Link|useParams|navigate|pool|SELECT|INSERT|UPDATE|DELETE|nom|narx|fetch|cors|CORS|localhost/.test(l));
  out.push(`${String(i + 1).padStart(2, '0')}: err ${errs.length}${errs.length ? ' ' + errs.join('|') : ''} · obj ${txt.includes('[object Object]')} · uz-qoldiq ${qoldiq.length}${qoldiq.length ? ' → ' + qoldiq.slice(0, 3).join(' ‖ ') : ''}`);
  await p.screenshot({ path: `${OUT}/ru/${i}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log(out.join('\n'));
