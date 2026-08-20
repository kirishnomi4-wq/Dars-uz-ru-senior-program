import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const BS = String.fromCharCode(92);
const CLS = '<' + '/script>';
const fwd = (p) => p.split(BS).join('/');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const target of ['src/6-Modull/PmLesson22.jsx','src/6-Modull/PmLesson23.jsx','src/6-Modull/PmLesson24.jsx']) {
  const src = readFileSync(target, 'utf8');
  const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
  const total = ((/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src))[1].match(/\{\s*id:/g) || []).length;
  const TMP = mkdtempSync(join(tmpdir(), 'cmp-'));
  const entry = ["import React from 'react';","import { createRoot } from 'react-dom/client';",'import Lesson from ' + JSON.stringify(fwd(resolve(target))) + ';',"createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: 'uz' }));"].join('\n');
  const res = await build({ stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent' });
  for (const [w,h] of [[1366,768]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    const seed = "localStorage.clear();localStorage.setItem('liveSession:" + lessonId + "','{\"mode\":\"self\"}');"
      + "localStorage.setItem('ccProgress:" + lessonId + "', JSON.stringify({ screen: " + (total-1) + ", answers: {}, earned: [], startedAt: Date.now(), total: " + total + ", savedAt: Date.now() }));";
    const page = join(TMP, 'x'+w+'.html');
    writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + CLS + '<script>' + res.outputFiles[0].text + CLS + '</body></html>', 'utf8');
    await pg.goto('file:///' + fwd(page), { waitUntil: 'domcontentloaded', timeout: 25000 });
    await pg.waitForSelector('.lesson-root', { timeout: 15000 });
    await pg.waitForTimeout(600);
    const before = await pg.evaluate(() => { const s=document.querySelector('.stage-content'); return s? s.scrollHeight-s.clientHeight : -1; });
    const b = await pg.$('.hw-big'); if (b) { await b.click({timeout:1500}).catch(()=>{}); await pg.waitForTimeout(900); }
    const c = await pg.$('.hw-chip'); if (c) { await c.click({timeout:1500}).catch(()=>{}); await pg.waitForTimeout(700); }
    const after = await pg.evaluate(() => { const s=document.querySelector('.stage-content'); const scr=document.querySelector('.screen'); const st=s.scrollTop; const cardTop=(document.querySelector('.card.fade-step')||{getBoundingClientRect:()=>({top:-1,bottom:-1})}).getBoundingClientRect(); const parts=[...scr.children].map(e=>((e.className||'').toString().split(' ')[0]||e.tagName)+':'+Math.round(e.getBoundingClientRect().height)); return { d: s? s.scrollHeight-s.clientHeight : -1, parts, sh: scr.getBoundingClientRect().height, st, cardTop: Math.round(cardTop.top), cardBot: Math.round(cardTop.bottom), ih: window.innerHeight }; });
    console.log(target.split('/').pop().padEnd(24), w+'x'+h, 'yopiq=+'+Math.max(0,before), 'ochiq=+'+Math.max(0,after.d), 'screen='+Math.round(after.sh), after.parts.join(' | '), '| scrollTop='+after.st, 'kartaTop='+after.cardTop, 'kartaBot='+after.cardBot, 'vh='+after.ih);
    await pg.close(); await ctx.close();
  }
}
await browser.close();
