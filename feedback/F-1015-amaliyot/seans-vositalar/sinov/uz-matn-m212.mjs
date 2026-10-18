// F-1015-366 · m2-12 yakuniy MD uchun uz matn yig'ish (8 ekran + oyna, a1 nusxa/yig'ilish, a2 xato ovi to'liq, a3 havola, uyga vazifa). Chaqirish: node …/uz-matn-m212.mjs <chiqish-papka>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson4.jsx';
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: "uz", onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-04-mvp-deploy-v18';
const page = OUT + '/uz.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const out = [];
for (let i = 0; i < 8; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 7, answers: { 0: { picked: 'a' }, 5: { picked: 0, correct: true, solved: true } }, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (!sessionStorage.getItem('x')) { localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); sessionStorage.setItem('x', 1); } }, [ID, prog]);
  const p = await ctx.newPage();
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const dump = async (t, sel = '.stage-content') => out.push(`\n===== ${i} ${t} =====\n` + await p.evaluate((s) => (document.querySelector(s) || document.body).innerText, sel));
  const sv = (k) => p.locator('.dk-savatga').nth(k).click();
  if (i === 1) { await p.click('.am-tt-btn'); await p.waitForTimeout(400); await dump('tayyorlaning-oyna', '.am-tt-oyna'); await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  for (const s of ['.am-qt-btn']) { const l = p.locator(s); for (let k = 0; k < await l.count(); k++) await l.nth(k).click().catch(() => {}); }
  await p.waitForTimeout(300);
  await dump('bosh');
  if (i === 0) { await sv(0).catch(() => {}); await p.waitForTimeout(500); await dump('savatga'); await p.click('.hook-option >> nth=0').catch(() => {}); await p.waitForTimeout(500); await dump('javob'); }
  if (i === 2) { await sv(0); await sv(2); await p.waitForTimeout(300); await dump('2-savatga'); await p.click('button.am-nusxa'); await p.waitForTimeout(1200); await dump('nusxalangach'); }
  if (i === 3) {
    await sv(0); await sv(2); await p.waitForTimeout(300); await dump('2-qoshildi');
    await p.click('.am-chip >> nth=0'); await p.waitForTimeout(300); await dump('savat-soni');
    await p.click('.am-chip >> nth=1'); await p.waitForTimeout(400); await dump('jami');
    await p.click('.bk-q >> nth=6'); await p.waitForTimeout(300); await dump('7-qator');
    await p.click('.bk-q >> nth=1'); await p.waitForTimeout(300); await dump('2-qator');
    await p.click('.am-saqla'); await p.waitForTimeout(400); await dump('tuzatildi');
  }
  if (i === 4) { await p.fill('.am-input', 'https://maktab-dokon.netlify.app'); await p.click('.am-saqla'); await p.waitForTimeout(400); await dump('saqlandi'); }
  if (i === 7) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); await dump('uyga'); }
  await ctx.close();
}
await b.close();
writeFileSync(OUT + '/uz-matn.txt', out.join('\n'));
console.log('ok');
