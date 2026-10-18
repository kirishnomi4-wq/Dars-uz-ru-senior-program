// F-1015-341 · m2-11 RU yurish (a1 taxta bosish bilan, a2 toifa tanlovi): har ekran (progress bilan) — pageerror, [object Object], lotin-o'zbekcha qoldiq; a1 reja / a2 katalog forma → ruscha matn
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson3.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/ru', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-03-decompose-v18';
const page = OUT + '/ru.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*)\b/i;
const out = [];
for (let i = 0; i < 8; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 7, answers: { 0: { picked: 'b' }, 5: { picked: 0, correct: true } }, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (!sessionStorage.getItem('x')) { localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); sessionStorage.setItem('x', 1); } }, [ID, prog]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const inp = p.locator('.rj-qator input');
  const n = await inp.count();
  for (let k = 0; k < n; k++) await inp.nth(k).fill(i === 3 && k % 2 ? '5 000' : 'Тест ' + (k + 1));
  if (i === 2) { const bos = async (nom, z) => { await p.click(`.ql-chip:has-text("${nom}")`); await p.click(`[data-zona="${z}"] .ql-zona-h`); await p.waitForTimeout(450); };
    await bos('Корзина', 'shart'); out.push('    rad: ' + await p.evaluate(() => document.querySelector('.ql-xabar')?.innerText));
    for (const n of ['Список товаров', 'Карточки', 'Кнопки категорий', 'Поиск', 'Корзина']) await bos(n, 'shart'); out.push('    oshdi: ' + await p.evaluate(() => document.querySelector('.ql-xabar')?.innerText));
    await bos('Карточки', 'keyin'); out.push('    kaskad: ' + await p.evaluate(() => document.querySelector('.ql-xabar')?.innerText));
    for (const n of ['Карточки', 'Кнопки категорий', 'Поиск']) await bos(n, 'shart'); for (const n of ['Избранное', 'Оплата', 'Вход в аккаунт']) await bos(n, 'keyin');
    await p.screenshot({ path: `${OUT}/ru/2-taxta.png` }); }
  if (i === 3) { await p.click('.am-chip >> nth=0'); for (let k = 0; k < 6; k++) await p.selectOption(`.rj-qator >> nth=${k} >> select`, k < 3 ? 'oquv' : 'ichimlik'); }
  if (n) { await p.waitForTimeout(200); await p.evaluate(() => { const bt = [...document.querySelectorAll('button.q-btn, button.am-saqla')].find(x => x.innerText.includes('Сохранить')); bt && bt.click(); }); await p.waitForTimeout(500); }
  if (i === 7) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); }
  const txt = await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText);
  const qoldiq = txt.split('\n').filter(l => UZ.test(l) && !/[{<]|mailto|index\.html|Gemini|Live Server|gemini\.google/.test(l));
  out.push(`${String(i + 1).padStart(2, '0')}: err ${errs.length}${errs.length ? ' ' + errs.join('|') : ''} · obj ${txt.includes('[object Object]')} · uz-qoldiq ${qoldiq.length}${qoldiq.length ? ' → ' + qoldiq.slice(0, 3).join(' ‖ ') : ''}`);
  await p.screenshot({ path: `${OUT}/ru/${i}.png` });
  if (i === 2 || i === 3) out.push('    matn: ' + ((await p.evaluate(() => (i => i === 2 ? document.querySelector('.rj-body')?.innerText : document.querySelector('.am-masalan')?.innerText)(location.hash, document.querySelector('.rj-oyna') ? 2 : 3) || '—')).replace(/\n/g, ' ⏎ ').slice(0, 260)));
  await ctx.close();
}
await b.close();
console.log(out.join('\n'));
