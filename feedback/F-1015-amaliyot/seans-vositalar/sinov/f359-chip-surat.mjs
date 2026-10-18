import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, SRC, OUT, NOM] = process.argv;
const virt = { name: 'v', setup(b) { b.onResolve({ filter: /^VIRT$/ }, () => ({ path: 'v', namespace: 'v' })); b.onLoad({ filter: /.*/, namespace: 'v' }, () => ({ contents: readFileSync(SRC, 'utf8'), loader: 'jsx', resolveDir: ROOT + '/src/2-Modull' })); } };
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from 'VIRT'; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', plugins: [virt], nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/' + NOM + '.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const ID = 'practice-03-decompose-v18';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
await ctx.route(/^https?:\/\//, (r) => r.abort());
await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 2, maxReached: 2, answers: {}, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, ID);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + page); await p.waitForSelector('.ql-chip', { timeout: 15000 }); await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}/${NOM}-1.png` });
// 2 tasini shartga joylash (bosish yo'li), 1 tasini tanlab qoldirish
for (let k = 0; k < 2; k++) { await p.locator('.ql-zona-pool .ql-chip').first().click(); await p.locator('.ql-zona-shart').click(); await p.waitForTimeout(250); }
await p.locator('.ql-zona-pool .ql-chip').first().click(); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/${NOM}-2.png` });
const el = await p.locator('.ql-zona-pool').boundingBox(); console.log(NOM, 'xato:', errs.length, JSON.stringify(el));
await b.close();
