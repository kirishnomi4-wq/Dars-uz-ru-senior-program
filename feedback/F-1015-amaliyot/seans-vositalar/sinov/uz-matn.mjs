// umumiy: node uz-matn.mjs OUT src/fayl.jsx lessonId ekranSoni · F-1015-341 · m2-11 RU yurish (a1 taxta bosish bilan, a2 toifa tanlovi): har ekran (progress bilan) — pageerror, [object Object], lotin-o'zbekcha qoldiq; a1 reja / a2 katalog forma → ruscha matn
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/' + process.argv[3]; const NS = +process.argv[5];
const OUT = process.argv[2]; mkdirSync(OUT + '/ru', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: "uz", onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = process.argv[4];
const page = OUT + '/ru.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*)\b/i;
const out = [];
for (let i = 0; i < NS; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: NS - 1, answers: {}, earned: [], startedAt: Date.now(), total: NS, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (!sessionStorage.getItem('x')) { localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); sessionStorage.setItem('x', 1); } }, [ID, prog]);
  const p = await ctx.newPage();
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const dump = async (t) => out.push(`\n===== ${i} ${t} =====\n` + await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText));
  for (const s of ['.am-tt-btn', '.am-qt-btn', '.mentor-toggle']) { const l = p.locator(s); for (let k = 0; k < await l.count(); k++) await l.nth(k).click().catch(() => {}); }
  await p.waitForTimeout(300);
  await dump('bosh');
  if (false) { await p.click('button.btn:has-text("yuborish")').catch(() => {}); await p.waitForTimeout(1800); await dump('yuborildi'); await p.click('.hook-option >> nth=1').catch(() => {}); await p.waitForTimeout(400); await dump('javob'); }
  if (false) {
    const bos = async (n, z) => { await p.click(`.ql-chip:has-text("${n}")`); await p.waitForTimeout(100); await p.click(`[data-zona="${z}"] .ql-zona-h`); await p.waitForTimeout(500); };
    for (const n of ["Mahsulot ro'yxati", 'Kartochkalar', 'Toifa tugmalari', 'Qidiruv']) await bos(n, 'shart');
    for (const n of ['Sevimli', 'Savat', "To'lov", 'Akkaunt bilan kirish']) await bos(n, 'keyin');
    await p.click('.am-saqla'); await p.waitForTimeout(500); await dump('saqlandi');
  }
  if (false) {
    const inp = p.locator('.rj-qator input'); await p.locator('.am-input').first().fill("Maktab mini-do'koni").catch(() => {});
    await dump('forma');
  }
  if (i === NS - 1) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); await dump('uyga'); }
  await ctx.close();
}
await b.close();
writeFileSync(OUT + '/uz-matn.txt', out.join('\n'));
console.log('ok');
