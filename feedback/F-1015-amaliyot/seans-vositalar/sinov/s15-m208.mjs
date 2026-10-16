// F-1015-333 · m2-08 Screen15 («Oxirgi sinov», F-1016-01) — 9 juftlik (3 hodisa × 3 reaksiya): tugma qulfi, bosish/hover natijasi, «Mukammal!», kod oynasi
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', OUT = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/src/2-Modull/PracticeLesson1.jsx')};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/s15.html'; const ID = 'practice-01-jonlantirish-v18';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const EV = ['Bosilganda (click)', 'Hover', 'Aylantirilganda'], RE = ["Rangni o'zgartir", "Sahifani o'chir", 'Hech narsa'];
let xato = 0;
for (let e = 0; e < 3; e++) for (let r = 0; r < 3; r++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, x => x.abort());
  await ctx.addInitScript((id) => { for (const k of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+k,'1'); localStorage.setItem('hcOnboarded_'+k,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 5, maxReached: 5, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, ID);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', x => errs.push(x.message));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  await p.click(`button.chip:has-text("${EV[e]}")`); await p.waitForTimeout(150); await p.click(`button.chip:has-text("${RE[r]}")`); await p.waitForTimeout(300);
  const btn = p.locator('button.site-btn').last();
  const qulf = await btn.isDisabled();
  const kod = (await p.locator('.codebox').innerText()).split('\n')[0];
  await btn.hover(); await p.waitForTimeout(450);
  const hoverTxt = await p.locator('.stage-content').innerText();
  if (!(await p.$('button.site-btn:has-text("Qaytarish")'))) { await p.locator('button.site-btn').last().click(); await p.waitForTimeout(450); }
  const txt = await p.locator('.stage-content').innerText();
  const rang = /Sahifa rangi: TO'Q SARIQ/.test(txt) || /Sahifa rangi: TO'Q SARIQ/.test(hoverTxt);
  const ochdi = /Sahifa o'chdi/.test(txt) || /Sahifa o'chdi/.test(hoverTxt);
  const muk = txt.includes('Mukammal!');
  const davom = await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled);
  const kutil = { qulf: false, muk: e === 0 && r === 0, davom: e === 0 && r === 0, rang: r === 0 && e !== 2, ochdi: r === 1 && e !== 2 };
  const t = !qulf === !kutil.qulf && muk === kutil.muk && davom === kutil.davom && rang === kutil.rang && ochdi === kutil.ochdi && errs.length === 0;
  if (!t) xato++;
  const izoh = (txt.match(/(Bosdingiz[^\n]*|Ishladi[^\n]*|Hech narsa o'zgarmadi[^\n]*|Sahifa o'chdi[^\n]*|Tugmani bosing[^\n]*)/) || [''])[0].slice(0, 70);
  console.log(`${t ? '✅' : '❌'} ${EV[e]} + ${RE[r]}: qulf=${qulf} · rang=${rang} · o'chdi=${ochdi} · Mukammal=${muk} · Davom=${davom} · kod «${kod.trim()}» · «${izoh}»`);
  await ctx.close();
}
await b.close();
console.log(xato ? `\n${xato} ta mos kelmadi` : '\n9/9 kutilgandek');
