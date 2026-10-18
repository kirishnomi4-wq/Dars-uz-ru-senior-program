// F-1015-366 · m3-07: reja oynasi, a1 (3 qo'shish → nur, Mentor yig'ildi), a2 (boshida, TOP → nur, nusxa → yig'ilish). Chaqirish: node …/f366-surat.mjs <chiqish>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/3-Modull/ReactCrudPracticeLesson.jsx';
const OUT = process.argv[2];
const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*'([^']+)'/)[1];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/m307.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
async function och(s, w = 1280) { const ctx = await b.newContext({ viewport: { width: w, height: 820 }, permissions: ['clipboard-read', 'clipboard-write'] }); await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript(([id, s]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, maxReached: s, answers: {}, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, s]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForTimeout(1300); return { p, ctx, errs }; }
const sh = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` });
const holat = (p) => p.evaluate(() => { const k = [...document.querySelectorAll('.rj-oyna')].pop().getBoundingClientRect(); return { mentorYigildi: document.querySelector('.mentor').classList.contains('is-collapsed'), kodTepa: Math.round(k.top), kodPast: Math.round(k.bottom), ekran: innerHeight }; });
{ const { p, ctx, errs } = await och(1); await p.click('.am-tt-btn'); await p.waitForTimeout(500); await sh(p, '1-reja-oyna'); await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('reja oyna yopildi', !(await p.$('.am-tt-oyna')), 'xato', errs.length); await ctx.close(); }
{ const { p, ctx, errs } = await och(2); for (let k = 0; k < 3; k++) { await p.locator('.am-chip').first().click(); await p.waitForTimeout(200); } await p.waitForTimeout(500); await sh(p, '2-a1-3-qoshildi'); console.log('a1', JSON.stringify(await holat(p)), 'xato', errs.length); await ctx.close(); }
{ const { p, ctx, errs } = await och(3); await sh(p, '3-a2-boshida');
  await p.locator('button:has-text("TOP")').first().click(); await p.waitForTimeout(600); await sh(p, '4-a2-top'); console.log('a2 TOP', JSON.stringify(await holat(p)));
  await p.click('button.am-nusxa'); await p.waitForTimeout(1300); await p.locator('.stage-content').evaluate(e => e.scrollTo(0, 0)); await p.waitForTimeout(300); await sh(p, '5-a2-yigildi'); console.log('a2 nusxa', JSON.stringify(await holat(p)), 'xato', errs.length); await ctx.close(); }
await b.close();
