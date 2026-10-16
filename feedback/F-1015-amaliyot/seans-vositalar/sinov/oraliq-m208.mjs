import { build } from 'esbuild'; import { chromium } from 'playwright-core'; import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', OUT = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/src/2-Modull/PracticeLesson1.jsx')}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' }, write: false, logLevel: 'silent' });
writeFileSync(OUT + '/or.html', `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const sc of [2, 6]) { const ctx = await b.newContext({ viewport: { width: 1920, height: 960 } }); await ctx.route(/^https?:\/\//, x => x.abort());
  await ctx.addInitScript((sc) => { for (const k of ['mentor','learner','student','self']) localStorage.setItem('inetOnboarded_'+k,'1'); localStorage.setItem('liveSession:practice-01-jonlantirish-v18', JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:practice-01-jonlantirish-v18', JSON.stringify({ screen: sc, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, sc);
  const p = await ctx.newPage(); await p.goto('file://' + OUT + '/or.html'); await p.waitForTimeout(2600);
  const g = await p.evaluate(() => { const h = document.querySelector('.screen > .head'); const s = h.nextElementSibling; return Math.round(s.getBoundingClientRect().top - h.getBoundingClientRect().bottom); });
  console.log(`ekran ${sc + 1}: sarlavha → bloklar oralig'i ${g}px`); await p.screenshot({ path: `${OUT}/oraliq-${sc}.png` }); await ctx.close(); }
await b.close();
