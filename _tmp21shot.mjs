// vaqtinchalik: PmLesson21 ekran-skrinshotlari (dizayn ko'rigi)
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = 'src/5-Modull/PmLesson21.jsx';
const OUT = process.env.SHOTDIR;
const W = Number(process.env.W || 1440), H = Number(process.env.H || 900);
const src = readFileSync(target, 'utf8');
const lessonId = 'pm-m5d11-v1';
const total = 16;
const R3 = [
  { savol: 'Uy vazifasini oxirgi marta qachon unutgansiz?', eshitgan: "O'tgan payshanba kuni guruhni kech ochdim" },
  { savol: "O'sha kuni vazifani qanday topdingiz?", eshitgan: 'Dugonamga yozdim, u rasmini tashladi' },
  { savol: 'Botni oxirgi marta qachon ochgansiz?', eshitgan: "Kecha kechqurun, dars jadvalini ko'rdim" },
];
const KUNLAR3 = [{ kun: 1, kelgan: 9, qaytgan: 4 }, { kun: 2, kelgan: 7, qaytgan: 4 }, { kun: 3, kelgan: 6, qaytgan: 5 }];
const ANSWERS = {
  0: { stage: 'hook', screenIdx: 0, picked: 0, correct: false },
  4: { stage: 'kun', solved: true, correct: true, kun: 5, elon: true },
  8: { stage: 'practice', solved: true, correct: true, kunlar: KUNLAR3 },
  9: { stage: 'belgi', solved: true, correct: true, qator: 4 },
  10: { stage: 'koding', solved: true, correct: true },
};
const TMP = mkdtempSync(join(tmpdir(), 'sh21-'));
const res = await build({
  stdin: { contents: `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport L from ${JSON.stringify(resolve(target).split(String.fromCharCode(92)).join('/'))};\ncreateRoot(document.getElementById("root")).render(React.createElement(L, { lang: "uz" }));`, resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});
const bundle = res.outputFiles[0].text;
const arg = process.argv.slice(2);
const screens = arg.length && /^[0-9,]+$/.test(arg[0]) ? arg[0].split(',').map(Number) : [...Array(total).keys()];
const FINAL = arg.includes('--final');
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
for (const s of screens) {
  const ans = FINAL ? ANSWERS : { 0: ANSWERS[0] };
  const prog = JSON.stringify({ screen: s, answers: FINAL ? ANSWERS : {}, earned: FINAL ? ['dayTwo','countKeeper','twoInARow','codeCounter'] : [], startedAt: Date.now(), total, savedAt: Date.now() });
  const seed = `localStorage.clear();localStorage.setItem("liveSession:${lessonId}",'{"mode":"self"}');localStorage.setItem("ccProgress:${lessonId}",${JSON.stringify(prog)});` +
    (FINAL ? `localStorage.setItem("pm-m5d8-javoblar",${JSON.stringify(JSON.stringify({ javoblar: R3, savedAt: Date.now() }))});localStorage.setItem("pm-m5d11-kun",'{"kun":5,"elon":true}');localStorage.setItem("pm-m5d11-code",'{"gpick":"g2","done":true,"open":false}');localStorage.setItem("pm-m5d11-hw-target","toliq");` : `localStorage.setItem("pm-m5d8-javoblar",${JSON.stringify(JSON.stringify({ javoblar: R3, savedAt: Date.now() }))});`);
  const page = join(TMP, `p${s}.html`);
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${bundle}<\/script></body></html>`, 'utf8');
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 90)));
  await pg.goto('file:///' + page.split(String.fromCharCode(92)).join('/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await pg.waitForSelector('.lesson-root', { timeout: 15000 });
  await pg.waitForTimeout(1500);
  if (FINAL) {
    if (s === 2) { for (const sel of ['.acc-h']) { const n = await pg.locator(sel).count(); for (let i = 0; i < n; i++) { await pg.locator(sel).nth(i).click({ timeout: 800 }).catch(()=>{}); await pg.waitForTimeout(250); } } }
    if (s === 4) { for (let k = 0; k < 6; k++) { await pg.locator('.ctl-btn').click({ timeout: 900 }).catch(()=>{}); await pg.waitForTimeout(1200); } }
    if (s === 6) { for (let k = 0; k < 12; k++) { const b = pg.locator('.k5-next, .kp-bet button, .ks-next').first(); if (await b.count() && await b.isVisible().catch(()=>0)) { await b.click({timeout:600}).catch(()=>{}); await pg.waitForTimeout(400); } } }
    if (s === 8) { for (let d = 0; d < 3; d++) { if (!await pg.locator('.reflect-input.num').count()) break; await pg.locator('.reflect-input.num').first().fill(String(9 - d)); await pg.locator('.reflect-input.num').nth(1).fill(String(4)); await pg.locator('.wsp-save').click({timeout:900}).catch(()=>{}); await pg.waitForTimeout(400); } }
    if (s === 9) { for (let r = 0; r < 4; r++) { const cells = pg.locator('.mrk-cell.cur.yashil'); const n = await cells.count(); for (let i = 0; i < n; i++) await cells.nth(i).click({timeout:500}).catch(()=>{}); await pg.locator('.mrk-go .wsp-save').click({timeout:800}).catch(()=>{}); await pg.waitForTimeout(500); await pg.locator('.bdone .wsp-save').click({timeout:800}).catch(()=>{}); await pg.waitForTimeout(500); } }
    if (s === 10 && process.env.KOD) { await pg.locator('.kod-launch-btn').click({timeout:1500}).catch(()=>{}); await pg.waitForTimeout(2000); }
    if (s === 15) { await pg.locator('.hw-big').click({timeout:900}).catch(()=>{}); await pg.waitForTimeout(1200); }
    await pg.waitForTimeout(900);
  }
  const sc = await pg.evaluate(() => { const st = document.querySelector('.stage-content'); return st ? st.scrollHeight - st.clientHeight : -1; });
  console.log('s' + s + ' skroll=' + sc);
  await pg.screenshot({ path: `${OUT}/${W}-s${s}${FINAL ? '-yakun' : ''}.png` });
  if (errs.length) console.log('s' + s + ' XATO: ' + errs.join('|'));
  await pg.close();
}
await browser.close();
console.log('tayyor');
