// _scroll20.mjs — 58/60-qonun o'lchovi: har ekran BOSHLANG'ICH va YAKUN holatida skroll
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const SL = String.fromCharCode(92), NL = String.fromCharCode(10);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = process.argv[2] || '';
const only = process.argv[3] && /^[0-9,]+$/.test(process.argv[3]) ? process.argv[3].split(',').map(Number) : null;
const DEEP = process.argv.includes('--deep');
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const total = ((/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src))[1].match(/\{\s*id:/g) || []).length;
const ACH = src.split(NL).filter(l => l.includes('icon:') && l.includes('name:') && l.includes('desc:')).map(l => l.trim().split(':')[0].trim());
const R3 = [
  { savol: "Uy vazifasini oxirgi marta qachon unutgansiz?", eshitgan: "O'tgan payshanba kuni guruhni kech ochdim" },
  { savol: "O'sha kuni vazifani qanday topdingiz?", eshitgan: "Dugonamga yozdim, u rasmini tashladi" },
  { savol: "Botni oxirgi marta qachon ochgansiz?", eshitgan: "Kecha kechqurun, dars jadvalini ko'rdim" },
];
const EXTRA = {
  'pm-m5d8-stol': JSON.stringify({ asked: [0, 1, 2, 3], yozuv: 1 }),
  'pm-m5d8-elak': JSON.stringify({ elak: { e1: 'otdi', e2: 'hali', e3: 'ichida', e4: 'otdi' } }),
  'pm-m5d8-draft': JSON.stringify({ list: R3, savol: '', eshitgan: '', berildi: false }),
  'pm-m5d8-code': JSON.stringify({ gateOk: true, done: true }),
  'pm-m5d8-hw-target': 'toliq',
};
const ANSWERS = {
  4: { stage: 'stol', solved: true, correct: true, asked: [0, 1, 2, 3], yozuv: 1 },
  8: { stage: 'javoblar', solved: true, correct: true, javoblar: R3 },
  9: { stage: 'elak', solved: true, correct: true, tanlov: { e1: 'otdi', e2: 'hali', e3: 'ichida', e4: 'otdi' }, hammasi: true },
  10: { stage: 'koding', solved: true, correct: true },
};
const SHOTDIR = process.env.SHOTDIR || '.';
const TMP = mkdtempSync(join(tmpdir(), 'scr-'));
const res = await build({
  stdin: {
    contents: 'import React from "react";' + NL + 'import { createRoot } from "react-dom/client";' + NL +
      'import Lesson from ' + JSON.stringify(resolve(target).split(SL).join('/')) + ';' + NL +
      'createRoot(document.getElementById("root")).render(React.createElement(Lesson, { lang: "uz" }));',
    resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx',
  },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});
const bundle = res.outputFiles[0].text;
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const SELS = process.argv.includes('--hwonly') ? ['.hw-big', '.hw-chip'] : ['.hopt', '.dfc', '.qcard', '.wq-row', '.elakb', '.nextsig', '.option', '.tap', '.acc-h', '.flip', '.rfb', '.fc-card', '.hw-big', '.hw-chip', '.vsc-run', '.kd-opt', '.gate-opt'];
const rows = [];
for (const [w, h] of [[1920, 1080], [1366, 768]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (let s = 0; s < total; s++) {
    if (only && !only.includes(s)) continue;
    const seedLines = Object.entries(EXTRA).map(([k, v]) => 'localStorage.setItem(' + JSON.stringify(k) + ',' + JSON.stringify(v) + ');').join('');
    const prog = JSON.stringify({ screen: s, answers: ANSWERS, earned: ACH, startedAt: Date.now(), total, savedAt: Date.now() });
    const seed = 'localStorage.setItem("liveSession:' + lessonId + '",' + JSON.stringify('{"mode":"self"}') + ');' +
      'localStorage.setItem("ccProgress:' + lessonId + '",' + JSON.stringify(prog) + ');' + seedLines;
    const page = join(TMP, 'p' + w + '_' + s + '.html');
    writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + '</' + 'script><script>' + bundle + '</' + 'script></body></html>', 'utf8');
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push(String(e.message).slice(0, 90)));
    await pg.goto('file:///' + page.split(SL).join('/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
    await pg.waitForSelector('.lesson-root', { timeout: 15000 });
    await pg.waitForTimeout(1800);
    const m = () => pg.evaluate(() => {
      const st = document.querySelector('.stage-content');
      const el = document.scrollingElement || document.documentElement;
      return { doc: el.scrollHeight - el.clientHeight, stage: st ? st.scrollHeight - st.clientHeight : -1 };
    });
    const a0 = await m();
    if (process.argv.includes('--dump0')) { const kids = await pg.evaluate(() => { const sc=document.querySelector('.stage-content > .screen'); const st=document.querySelector('.stage-content'); const o=[['stageH='+st.clientHeight+' screenH='+Math.round(sc.getBoundingClientRect().height)+' scroll='+(st.scrollHeight-st.clientHeight)+' gap='+getComputedStyle(sc).gap,0]]; for (const c of sc.children){const r=c.getBoundingClientRect(); o.push([String(c.className).slice(0,34), Math.round(r.height)]);} const g=document.querySelector('.ach-grid'); if(g) o.push(['ach-grid', Math.round(g.getBoundingClientRect().height)]); const b=document.querySelector('.ach-badge'); if(b) o.push(['ach-badge', Math.round(b.getBoundingClientRect().height)]); return o; }); console.log(kids.map(k=>'   '+k[0]+' = '+k[1]).join(NL)); }
    if (process.argv.includes('--shot0')) await pg.screenshot({ path: SHOTDIR + '/' + w + '-s' + s + '-boshi.png' });
    let a1 = a0;
    for (let pass = 0; pass < (DEEP ? 3 : 1); pass++) {
      for (const sel of SELS) {
        const n = await pg.locator('.lesson-root ' + sel).count();
        for (let i = 0; i < n; i++) {
          const el = pg.locator('.lesson-root ' + sel).nth(i);
          if (await el.isVisible().catch(() => 0) && await el.isEnabled().catch(() => 0)) {
            await el.click({ timeout: 900 }).catch(() => {});
            await pg.waitForTimeout(sel === '.hw-big' ? 750 : 220);
          }
        }
      }
    }
    await pg.waitForTimeout(800);
    a1 = await m();
    if (process.argv.includes('--probe')) { const p = await pg.evaluate(() => { const st=document.querySelector('.stage-content'); const r=st.getBoundingClientRect(); const lim=r.top+st.clientHeight; const out=[]; st.querySelectorAll('*').forEach(el=>{ const b=el.getBoundingClientRect(); const cs=getComputedStyle(el); if (b.bottom > lim + 0.5 && cs.position !== 'fixed') out.push(String(el.className).slice(0,30)+'|'+cs.position+'|+'+Math.round(b.bottom-lim)); }); return { stageScroll: st.scrollHeight-st.clientHeight, out: out.slice(0,14) }; }); console.log(JSON.stringify(p)); }
    if (process.argv.includes('--dump')) { const kids = await pg.evaluate(() => { const sc=document.querySelector('.stage-content > .screen'); const st=document.querySelector('.stage-content'); const o=[['stageH='+st.clientHeight+' screenH='+Math.round(sc.getBoundingClientRect().height)+' contentH='+sc.scrollHeight+' gap='+getComputedStyle(sc).gap,0]]; for (const c of sc.children){const r=c.getBoundingClientRect(); o.push([String(c.className).slice(0,40), Math.round(r.height)+' top'+Math.round(r.top)]);} return o; }); console.log(kids.map(k=>'   '+k[0]+' = '+k[1]).join(NL)); }
    if (process.argv.includes('--shot')) { await pg.screenshot({ path: SHOTDIR + '/' + w + '-s' + s + '-yakun' + '.png' }); }
    rows.push(w + 'x' + h + ' s' + s + ': boshlangich ' + a0.stage + ' · yakun ' + a1.stage + (a0.doc || a1.doc ? ' DOC:' + a0.doc + '/' + a1.doc : '') + (errs.length ? ' XATO:' + errs.join('|') : ''));
    await pg.close();
  }
  await ctx.close();
}
console.log(rows.join(NL));
const bad = rows.filter(r => !/boshlangich 0 . yakun 0/.test(r));
console.log(NL + (bad.length ? 'NUQSON: ' + bad.length : 'HAMMASI 0 — 58-qonun toza'));
await browser.close();
