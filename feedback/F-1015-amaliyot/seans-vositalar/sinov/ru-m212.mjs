// F-1015-343 · m2-12 RU yurish: 8 ekran (o'quvchi katalogi bilan) — pageerror, [object Object], lotin-o'zbekcha qoldiq; a1 savat, a2 xato ovi, a3 havola
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson4.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/ru', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-04-mvp-deploy-v18';
const page = OUT + '/ru.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*)\b/i;
const out = [];
const KAT = { nom: 'Наш магазин', katalog: [{ n: 'Ручка', p: '3000', t: 'oquv' }, { n: 'Сок', p: '6000', t: 'ichimlik' }, { n: 'Тетрадь', p: '5 000', t: 'oquv' }], rejaShart: ['royxat', 'karta', 'filtr', 'qidiruv'] };
for (let i = 0; i < 8; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 7, answers: { 0: { picked: 'a' }, 5: { picked: 0, correct: true, solved: true } }, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr, kat]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (!sessionStorage.getItem('x')) { localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); localStorage.setItem('ccDokon', JSON.stringify(kat)); sessionStorage.setItem('x', 1); } }, [ID, prog, KAT]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const sv = (nom) => p.click(`.dk-karta:has(b:text-is("${nom}")) .dk-savatga`);
  if (i === 0) { await sv('Ручка'); await p.waitForTimeout(300); }
  if (i === 1) { await sv('Сок'); await p.click('.am-tt-btn'); await p.waitForTimeout(400); const ot = await p.innerText('.am-tt-oyna'); out.push('    oyna (F-1015-362): ' + ot.replace(/\n/g, ' ⏎ ') + ' · uz-qoldiq ' + ot.split('\n').filter(l => UZ.test(l)).length); await p.screenshot({ path: `${OUT}/ru/1-oyna.png` }); await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
  if (i === 2 && await p.$('.pk-kor')) { await p.click('.pk-kor'); await p.waitForTimeout(350); out.push('    prompt oynada (F-1015-385): ' + (await p.innerText('.am-tt-oyna .am-masalan')).replace(/\n/g, ' ').slice(0, 160)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); }
  if (i === 2) { await sv('Ручка'); await sv('Сок'); await (async (sel) => { await p.click(sel); await p.waitForTimeout(350); const ot = await p.innerText('.am-tt-oyna').catch(() => ''); const q = ot.split('\n').filter(l => UZ.test(l)); if (q.length) out.push('    oyna uz-qoldiq: ' + q.slice(0, 2).join(' ‖ ')); await p.keyboard.press('Escape'); await p.waitForTimeout(250); })('.am-qt-btn'); /* F-1015-372: oyna */ await p.waitForTimeout(300); out.push('    kod: ' + (await p.innerText('.sk-oyna')).replace(/\n/g, ' ⏎ ')); }
  if (i === 3) { await sv('Ручка'); await sv('Сок'); await p.waitForTimeout(200); await p.click('.am-chip >> nth=1'); await p.waitForTimeout(300); await p.click('.bk-q >> nth=6'); await p.waitForTimeout(200); out.push('    q7: ' + await p.innerText('.ql-xabar.xato')); await p.click('.bk-q >> nth=1'); await p.waitForTimeout(200); await p.click('.am-saqla'); await p.waitForTimeout(400); await (async (sel) => { await p.click(sel); await p.waitForTimeout(350); const ot = await p.innerText('.am-tt-oyna').catch(() => ''); const q = ot.split('\n').filter(l => UZ.test(l)); if (q.length) out.push('    oyna uz-qoldiq: ' + q.slice(0, 2).join(' ‖ ')); await p.keyboard.press('Escape'); await p.waitForTimeout(250); })('.am-qt-btn'); /* F-1015-372: oyna */ }
  if (i === 4) { await p.fill('.am-input', 'https://nash-magazin.netlify.app'); await p.click('.am-saqla'); await p.waitForTimeout(400); }
  if (i === 7) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); }
  const txt = await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText);
  const qoldiq = txt.split('\n').filter(l => UZ.test(l) && !/[{<]|mailto|index\.html|Gemini|Live Server|gemini\.google|savat|jami/.test(l));
  out.push(`${String(i + 1).padStart(2, '0')}: err ${errs.length}${errs.length ? ' ' + errs.join('|') : ''} · obj ${txt.includes('[object Object]')} · uz-qoldiq ${qoldiq.length}${qoldiq.length ? ' → ' + qoldiq.slice(0, 3).join(' ‖ ') : ''}`);
  await p.screenshot({ path: `${OUT}/ru/${i}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log(out.join('\n'));
