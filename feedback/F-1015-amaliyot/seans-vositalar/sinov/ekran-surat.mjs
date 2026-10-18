// Umumiy: dars faylining berilgan ekranlarini (indeks) 1280×820 da suratga oladi. Chaqirish: node …/ekran-surat.mjs <fayl> <chiqish-papka> <nom> 1,2,3 [kenglik]
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, F, OUT, NOM, LIST, W = '1280'] = process.argv; mkdirSync(OUT, { recursive: true });
const FILE = F.startsWith('/') ? F : ROOT + '/' + F;
const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/)[1];
const virt = { name: 'v', setup(b) { b.onResolve({ filter: /^VIRT$/ }, () => ({ path: 'v', namespace: 'v' })); b.onLoad({ filter: /.*/, namespace: 'v' }, () => ({ contents: readFileSync(FILE, 'utf8'), loader: 'jsx', resolveDir: process.env.RDIR || FILE.replace(/\/[^/]+$/, '') })); } };
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from 'VIRT'; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', plugins: [virt], nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = `${OUT}/${NOM}.html`;
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let JAMI = 0;
{ const ctx = await b.newContext(); await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, ID);
  const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1200);
  JAMI = +((await p.evaluate(() => (document.body.innerText.match(/\b\d\d\s*\/\s*(\d\d)\b/) || [])[1])) || 0); await ctx.close(); }
for (const i of LIST.split(',').map(Number)) {
  const ctx = await b.newContext({ viewport: { width: +W, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript(([id, i, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: i, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, i, JAMI]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + page); await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}/${NOM}-${i}.png` });
  const h = await p.evaluate(() => { const c = document.querySelector('.stage-content'); return c ? [c.scrollHeight, c.clientHeight] : null; });
  console.log(NOM, i, 'xato', errs.length, 'balandlik', JSON.stringify(h));
  await ctx.close();
}
await b.close();
