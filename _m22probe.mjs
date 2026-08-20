import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const BS = String.fromCharCode(92);
const CLS = '<' + '/script>';
const fwd = (p) => p.split(BS).join('/');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = 'src/6-Modull/PmLesson22.jsx';
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const total = ((/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src))[1].match(/\{\s*id:/g) || []).length;
const TMP = mkdtempSync(join(tmpdir(), 'm22-'));
const entry = ["import React from 'react';","import { createRoot } from 'react-dom/client';",'import Lesson from ' + JSON.stringify(fwd(resolve(target))) + ';',"createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: 'uz' }));"].join('\n');
const res = await build({ stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent' });
const L = "Odamlar do" + String.fromCharCode(39) + "konga kelib, kerakli narsani topa olmay qaytib ketadi va boshqa joydan oladi";
const clickAll = async (pg, sel, n) => { const els = await pg.$$(sel); for (const e of els.slice(0, n ?? els.length)) { await e.click({ timeout: 1200 }).catch(()=>{}); await pg.waitForTimeout(200); } };
const c1 = async (pg, sel) => { const e = await pg.$(sel); if (e) { await e.click({ timeout: 1500 }).catch(()=>{}); await pg.waitForTimeout(260); } };
const typeSave = async (pg, txt) => { await pg.fill('.reflect-input', txt).catch(()=>{}); await pg.waitForTimeout(120); await c1(pg, '.wsp-save'); };
const CASES = [
  ["s0 hook javob berilgan", 0, async p => { await c1(p, '.hopt'); }],
  ["s1 maqsad", 1, async () => {}],
  ["s2 ikki karta ochiq", 2, async p => { await clickAll(p, '.dfc'); }],
  ["s3 test reveal", 3, async p => { await c1(p, '.option'); }],
  ["s4 yadro toliq", 4, async p => { await c1(p, '.s4-run'); await clickAll(p, '.sbtn'); await c1(p, '.s4-run'); }],
  ["s5 test reveal", 5, async p => { await c1(p, '.option'); }],
  ["s6 keys oxirgi bosqich", 6, async p => { for (let i=0;i<7;i++){ await c1(p, '.kp-chip'); await c1(p, '.btn-white-accent'); } }],
  ["s7 test reveal", 7, async p => { await c1(p, '.option'); }],
  ["s8 yozish BOSH", 8, async () => {}],
  ["s8 yozish YARIM 2/4", 8, async p => { await typeSave(p, L); await typeSave(p, L); }],
  ["s8 yozish TOLIQ + yordam ochiq", 8, async p => { for(let i=0;i<3;i++) await typeSave(p, L); await typeSave(p, L + " 10 tadan 2 taga"); await p.waitForTimeout(900); await c1(p,'.acu-overlay'); await clickAll(p, '.wsx-toggle'); }],
  ["s9 tekshiruv 1-varaq xato", 9, async p => { await clickAll(p, '.vcell', 1); await c1(p, '.wsx-toggle'); }],
  ["s9 tekshiruv TOLIQ", 9, async p => { for (const k of [2,1]) { const c=await p.$$('.vcell'); if(c[k]) await c[k].click().catch(()=>{}); await p.waitForTimeout(300); await c1(p,'.wsp-save'); } await c1(p,'.clean-btn'); await c1(p,'.wsp-save'); await p.waitForTimeout(900); await c1(p,'.acu-overlay'); }],
  ["s10 koding darvoza", 10, async () => {}],
  ["s10 koding kod ochiq + yordam", 10, async p => { const b=await p.$$('.gt-b'); if(b[1]) await b[1].click().catch(()=>{}); await p.waitForTimeout(400); await c1(p,'.wsx-toggle'); }],
  ["s10 koding 2-tab", 10, async p => { const b=await p.$$('.gt-b'); if(b[1]) await b[1].click().catch(()=>{}); await p.waitForTimeout(400); const t=await p.$$('.vsc-step'); if(t[1]) await t[1].click().catch(()=>{}); }],
  ["s11 yakuniy test reveal", 11, async p => { await c1(p, '.option'); }],
  ["s12 refleksiya yozilgan", 12, async p => { await p.fill('.reflect-input', L).catch(()=>{}); }],
  ["s13 podium", 13, async () => {}],
  ["s14 flashcard aylantirilgan", 14, async p => { await c1(p, '.fc-card'); }],
  ["s15 yakun uy-vazifa ochiq", 15, async p => { await c1(p, '.hw-big'); await p.waitForTimeout(700); await c1(p, '.hw-chip'); }],
];
const VIEWPORTS = [[1440, 900], [1280, 800]];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const bad = [];
for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const [nom, scr, fn] of CASES) {
    const pg = await ctx.newPage();
    const seed = "localStorage.clear();localStorage.setItem('liveSession:" + lessonId + "','{\"mode\":\"self\"}');"
      + "localStorage.setItem('ccProgress:" + lessonId + "', JSON.stringify({ screen: " + scr + ", answers: {}, earned: [], startedAt: Date.now(), total: " + total + ", savedAt: Date.now() }));";
    const page = join(TMP, 'p' + w + '_' + nom.replace(/[^a-z0-9]/gi, '') + '.html');
    writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + CLS + '<script>' + res.outputFiles[0].text + CLS + '</body></html>', 'utf8');
    await pg.goto('file:///' + fwd(page), { waitUntil: 'domcontentloaded', timeout: 25000 });
    await pg.waitForSelector('.lesson-root', { timeout: 15000 });
    await pg.waitForTimeout(600);
    await fn(pg);
    await pg.waitForTimeout(700);
    const m = await pg.evaluate(() => {
      const sc = document.querySelector('.stage-content');
      const out = { sc: sc ? sc.scrollHeight - sc.clientHeight : -1, ov: [], inner: [] };
      const scr2 = document.querySelector('.screen');
      if (scr2) { const ch = [...scr2.children].map(e => ({ n: (e.className||e.tagName).toString().slice(0,26), r: e.getBoundingClientRect() })).filter(x => x.r.height > 0);
        for (let i = 1; i < ch.length; i++) if (ch[i-1].r.bottom > ch[i].r.top + 1) out.ov.push(ch[i-1].n + ' > ' + ch[i].n + ' (+' + Math.round(ch[i-1].r.bottom - ch[i].r.top) + 'px)'); }
      document.querySelectorAll('*').forEach(el => { const d = el.scrollHeight - el.clientHeight; if (d > 2 && el.clientHeight > 0 && !el.classList.contains('stage-content')) out.inner.push(String(el.className||el.tagName).slice(0,28) + '+' + d); });
      return out;
    });
    const flag = (m.sc > 0 || m.ov.length) ? 'X ' : '  ';
    const line = flag + w + 'x' + h + ' [' + nom + '] SC=+' + Math.max(0, m.sc) + (m.ov.length ? ' USTMA-UST: ' + m.ov.join('; ') : '') + (m.inner.length ? ' ichki:[' + m.inner.slice(0,4).join(', ') + ']' : '');
    console.log(line);
    if (m.sc > 0 || m.ov.length) bad.push(line);
    await pg.close();
  }
  await ctx.close();
}
await browser.close();
console.log(bad.length ? 'JAMI MUAMMO: ' + bad.length : 'TOZA - skroll 0, ustma-ust 0');
