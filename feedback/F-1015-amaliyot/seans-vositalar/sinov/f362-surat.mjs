// F-1015-362/363 · m2-12 surat: reja (Tayyorlaning yopiq/oyna) · a1 (boshida, Savatga → nur, nusxa → yig'ilish, Ko'rish → qayta). Chaqirish: node …/f362-surat.mjs <chiqish-papka>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson4.jsx';
const OUT = process.argv[2];
const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*'([^']+)'/)[1];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/m212.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
async function och(screen, w = 1280, h = 820) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript(([id, s]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, maxReached: s, answers: {}, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, screen]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + page); await p.waitForTimeout(1300);
  return { p, ctx, errs };
}
const sh = (p, n) => p.screenshot({ path: `${OUT}/${n}.png` });
{ const { p, ctx, errs } = await och(1);
  await sh(p, '1-reja-yopiq');
  await p.click('.am-tt-btn'); await p.waitForTimeout(500); await sh(p, '2-reja-oyna');
  const f1 = await p.evaluate(() => document.activeElement?.className);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const f2 = await p.evaluate(() => ({ oyna: !!document.querySelector('.am-tt-oyna'), fokus: document.activeElement?.className }));
  await p.click('.am-tt-btn'); await p.waitForTimeout(400); await p.mouse.click(20, 400); await p.waitForTimeout(300);
  const f3 = await p.evaluate(() => !!document.querySelector('.am-tt-oyna'));
  console.log('reja: ochilganda fokus', f1, '| Esc', JSON.stringify(f2), '| fon bosilgach oyna', f3, '| xato', errs.length);
  await ctx.close(); }
{ const { p, ctx, errs } = await och(2);
  await sh(p, '3-a1-boshida');
  await p.locator('.dk-savatga, button:has-text("Savatga")').first().click(); await p.waitForTimeout(250); await sh(p, '4-a1-savatga-nur');
  await p.waitForTimeout(700); console.log('F-1015-364 Savatga → mentor', await p.evaluate(() => { const m = document.querySelector('.mentor'); const k = document.querySelector('.sk-oyna').getBoundingClientRect(); return { yigildi: m.classList.contains('is-collapsed'), kodPast: Math.round(k.bottom), ekran: innerHeight }; })); await sh(p, '4b-a1-mentor-yigildi');
  await p.click('.mentor'); await p.waitForTimeout(500); console.log('mentor bosilsa ochiladi', await p.evaluate(() => !document.querySelector('.mentor').classList.contains('is-collapsed')));
  await p.click('button.am-nusxa:has-text("Promptni nusxalash")'); await p.waitForTimeout(1300); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200); await sh(p, '5-a1-yigilgan');
  for (let k = 0; k < 3; k++) { await p.locator('button:has-text("Savatga")').nth(k + 1).click(); await p.waitForTimeout(150); }
  await p.waitForTimeout(150); await sh(p, '6-a1-yana-savatga');
  await p.click('.am-yig'); await p.waitForTimeout(500); await sh(p, '7-a1-kor');
  console.log('a1 xato', errs.length, errs.join('|'));
  await ctx.close(); }
{ const { p, ctx, errs } = await och(1, 390, 800); await p.click('.am-tt-btn'); await p.waitForTimeout(500); await sh(p, '8-390-oyna'); await ctx.close();
  const o = await och(2, 390, 800); await o.p.click('button.am-nusxa:has-text("Promptni nusxalash")'); await o.p.waitForTimeout(1200); await o.p.locator('button:has-text("Savatga")').first().click(); await o.p.waitForTimeout(400); await sh(o.p, '9-390-a1'); await o.ctx.close(); }
await b.close();
