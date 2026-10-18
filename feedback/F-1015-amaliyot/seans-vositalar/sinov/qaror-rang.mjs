// Qaror sahifasi uchun: eski accent matn vs to'qroq variant (CSS ustidan qo'yiladi, fayllarga tegilmaydi)
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const OUT = process.argv[2];
const CASES = [
  { k: 'm212', file: 'src/2-Modull/PracticeLesson4.jsx', id: 'practice-04-mvp-deploy-v18', total: 8, screen: 5, sel: '.dd', css: '.dd-chip{color:#B3361A !important;border-color:#B3361A !important}' },
  { k: 'm311', file: 'src/3-Modull/ReactRouterPracticeLesson.jsx', id: 'react-router-practice-p2-v18', total: 8, screen: 2, sel: '.bp-window', css: '.navlink.on{background:#B3361A !important}.u-path{color:#B3361A !important}' },
  { k: 'm408', file: 'src/4-Modull/BackendCrudPracticeLesson.jsx', id: 'backend-crud-practice-p1-v18', total: 8, screen: 1, sel: '.bp-window', css: '.pm-method{filter:brightness(0.72)}' }
];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const c of CASES) {
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/' + c.file)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, write: false, logLevel: 'silent' });
  const page = `${OUT}/${c.k}.html`;
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  for (const v of ['eski', 'yangi']) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 2 });
    const prog = { screen: c.screen, maxReached: c.total - 1, answers: {}, earned: [], startedAt: Date.now(), total: c.total, savedAt: Date.now() };
    await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); }, [c.id, prog]);
    const p = await ctx.newPage();
    await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1200);
    if (c.k === 'm311') { await p.click('.navlink >> nth=2'); await p.waitForTimeout(300); }
    if (v === 'yangi') await p.addStyleTag({ content: c.css });
    await p.waitForTimeout(300);
    await p.locator(c.sel).first().screenshot({ path: `${OUT}/${c.k}-${v}.png` });
    await ctx.close();
  }
}
await b.close();
console.log('ok');
