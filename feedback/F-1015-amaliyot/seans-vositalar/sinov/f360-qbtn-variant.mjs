// F-1015-360 · asosiy tugma (.q-btn, src/qolip) rang variantlari — fayl o'zgarmaydi, CSS sahifaga yuklanadi. Chaqirish: node …/f360-qbtn-variant.mjs <chiqish-papka>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/HtmlPractice.jsx';
const OUT = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/m108.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const V = {
  A: '',
  B: '.q-btn:not(.q-2){background:#D93A16!important;border-color:#D93A16!important}',
  C: '.q-btn:not(.q-2){background:#C93412!important;border-color:#C93412!important}',
  D: '.q-btn:not(.q-2){color:#1A1A1A!important}',
  E: '.q-btn:not(.q-2){font-size:19px!important;font-weight:800!important;padding:11px 20px!important}',
};
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [n, css] of Object.entries(V)) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 2 });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const id = 'html-practice-portfolio-v2';
  await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 2, maxReached: 2, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, id);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + page); await p.waitForSelector('.am-maydon input', { timeout: 15000 }); await p.waitForTimeout(700);
  if (css) await p.addStyleTag({ content: css });
  const inp = p.locator('.am-maydon input'); await inp.nth(0).fill('Jasur Aliyev'); await inp.nth(1).fill('Boshlovchi dasturchi'); await inp.nth(2).fill("HTML o'rganyapman."); await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/${n}-sahifa.png` });
  const btn = p.locator('button.q-btn:has-text("Saqlash")'); const bb = await btn.boundingBox();
  const k = await btn.evaluate(el => getComputedStyle(el).backgroundColor + ' / ' + getComputedStyle(el).color);
  await p.screenshot({ path: `${OUT}/${n}-yaqin.png`, clip: { x: bb.x - 260, y: bb.y - 120, width: bb.width + 300, height: bb.height + 150 } });
  console.log(n, id, k, 'xato:', errs.length);
  await ctx.close();
}
await b.close();
