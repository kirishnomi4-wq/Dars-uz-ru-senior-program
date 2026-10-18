// Umumiy: yakuniy MD uchun darsning har ekranidagi uz matn (Qadamlar/yordam ochiq, «Avval tayyorlaning» oynasi alohida). Chaqirish: node …/uz-matn-umumiy.mjs <fayl> <chiqish>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, F, OUT] = process.argv; mkdirSync(OUT, { recursive: true });
const FILE = ROOT + '/' + F; const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/)[1];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/uz.html'; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const seed = (ctx, s, t) => ctx.addInitScript(([id, s, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (s >= 0) localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, maxReached: t - 1, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, s, t]);
let JAMI = 0;
{ const ctx = await b.newContext(); await ctx.route(/^https?:\/\//, (r) => r.abort()); await seed(ctx, -1, 0); const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1100); JAMI = +((await p.evaluate(() => (document.body.innerText.match(/\b\d\d\s*\/\s*(\d\d)\b/) || [])[1])) || 0); await ctx.close(); }
const out = [`# ${F} · lessonId ${ID} · ${JAMI} ekran`];
for (let i = 0; i < JAMI; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort()); await seed(ctx, i, JAMI);
  const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1100);
  if (await p.$('.am-tt-btn')) { await p.click('.am-tt-btn'); await p.waitForTimeout(400); out.push(`\n===== ${i} oyna «Avval tayyorlaning» =====\n` + await p.innerText('.am-tt-oyna')); await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  if (await p.$('.pk-kor')) { await p.click('.pk-kor'); await p.waitForTimeout(400); out.push(`\n===== ${i} oyna «Prompt» =====\n` + await p.innerText('.am-tt-oyna')); await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  for (const s of ['.am-qt-btn', 'details:not([open]) > summary']) { const l = p.locator(s); for (let k = 0; k < await l.count(); k++) await l.nth(k).click().catch(() => {}); }
  await p.waitForTimeout(300);
  out.push(`\n===== ${i} =====\n` + await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText));
  if (i === JAMI - 1) { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); out.push(`\n===== ${i} uyga =====\n` + await p.evaluate(() => (document.querySelector('.hw-modal, .hw-sheet, [role=dialog]') || document.body).innerText)); }
  await ctx.close();
}
await b.close(); writeFileSync(OUT + '/uz-matn.txt', out.join('\n')); console.log('ok', JAMI);
