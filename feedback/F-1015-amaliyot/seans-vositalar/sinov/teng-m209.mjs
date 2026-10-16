import { build } from 'esbuild'; import { chromium } from 'playwright-core'; import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', OUT = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/src/2-Modull/PracticeLesson2.jsx')}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' }, write: false, logLevel: 'silent' });
writeFileSync(OUT + '/teng.html', `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [w, h] of [[1920, 960], [390, 844]]) { const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, x => x.abort());
  await ctx.addInitScript(() => { for (const k of ['mentor','learner','student','self']) localStorage.setItem('inetOnboarded_'+k,'1'); localStorage.setItem('liveSession:practice-02-ai-promo-v18', JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:practice-02-ai-promo-v18', JSON.stringify({ screen: 1, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); });
  const p = await ctx.newPage(); await p.goto('file://' + OUT + '/teng.html'); await p.waitForTimeout(2600);
  const m = await p.evaluate(() => ({ chap: Math.round(document.querySelector('.pm-sayt').getBoundingClientRect().top), ong: Math.round(document.querySelector('.am-reja-k').getBoundingClientRect().top), sarlavha: document.querySelector('.h-title').innerText, tosh: document.documentElement.scrollWidth - innerWidth }));
  console.log(w, JSON.stringify(m)); await p.screenshot({ path: `${OUT}/teng-${w}.png` }); await ctx.close(); }
await b.close();
