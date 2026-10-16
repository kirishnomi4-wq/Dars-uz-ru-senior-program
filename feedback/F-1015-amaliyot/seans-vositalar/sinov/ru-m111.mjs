// F-1015-320 · m1-11 RU yurish: har ekran (progress bilan) — pageerror, [object Object], lotin-o'zbekcha qoldiq; a1/a2/a3 forma → ruscha prompt
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/DeployLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/ru', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'netlify-deploy-v19';
const page = OUT + '/ru.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*)\b/i;
const out = [];
for (let i = 0; i < 11; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 10, answers: { 0: { picked: 'b' }, 5: { picked: 3, correct: true, solved: true } }, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (!sessionStorage.getItem('x')) { localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); sessionStorage.setItem('x', 1); } }, [ID, prog]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const inp = p.locator('input.am-input');
  const n = await inp.count();
  for (let k = 0; k < n; k++) await inp.nth(k).fill(k === n - 1 && false ? '' : 'Тест ' + (k + 1));
  if (i === 3 || i === 4) { await p.click('.am-uslub-btn >> nth=3'); await p.waitForTimeout(300); }
  if (n) { await p.waitForTimeout(200); await p.evaluate(() => { const bt = [...document.querySelectorAll('button.q-btn, button.am-saqla')].find(x => x.innerText.includes('Сохранить')); bt && bt.click(); }); await p.waitForTimeout(500); }
  if (i === 10) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); }
  const txt = await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText);
  const qoldiq = txt.split('\n').filter(l => UZ.test(l) && !/[{<]|mailto|index\.html|Gemini|Live Server|gemini\.google/.test(l));
  out.push(`${String(i + 1).padStart(2, '0')}: err ${errs.length}${errs.length ? ' ' + errs.join('|') : ''} · obj ${txt.includes('[object Object]')} · uz-qoldiq ${qoldiq.length}${qoldiq.length ? ' → ' + qoldiq.slice(0, 3).join(' ‖ ') : ''}`);
  await p.screenshot({ path: `${OUT}/ru/${i}.png` });
  if (i >= 2 && i <= 4) out.push('    prompt: ' + ((await p.evaluate(() => document.querySelector('.am-masalan')?.innerText || '—')).replace(/\n/g, ' ⏎ ').slice(0, 260)));
  await ctx.close();
}
await b.close();
console.log(out.join('\n'));
