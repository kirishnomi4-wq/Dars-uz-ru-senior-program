// s4 / s9 grapheme o'lchovi
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const SL = String.fromCharCode(92), NL = String.fromCharCode(10);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = 'src/5-Modull/PmLesson21.jsx';
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const total = ((/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src))[1].match(/\{\s*id:/g) || []).length;
const CASES = [
  ['s4-boshi',   4, {}, null],
  ['s4-3kun',    4, { 4: { stage: 'kun', screenIdx: 4, kun: 3 } }, null],
  ['s4-done',    4, { 4: { stage: 'kun', screenIdx: 4, kun: 5, elon: true, solved: true, correct: true } }, null],
  ['s9-boshi',   9, {}, null],
  ['s9-xato',    9, {}, 'xato'],
  ['s9-done',    9, { 9: { stage: 'belgi', screenIdx: 9, qator: 4, solved: true, correct: true } }, null],
];
const TMP = mkdtempSync(join(tmpdir(), 'g49-'));
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
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const out = [];
for (const [nom, scr, answers, act] of CASES) {
  const prog = JSON.stringify({ screen: scr, answers, earned: [], startedAt: Date.now(), total, savedAt: Date.now() });
  const seed = 'localStorage.setItem("liveSession:' + lessonId + '",' + JSON.stringify('{"mode":"self"}') + ');' +
    'localStorage.setItem("ccProgress:' + lessonId + '",' + JSON.stringify(prog) + ');';
  const p = join(TMP, 'g' + nom + '.html');
  writeFileSync(p, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + '</' + 'script><script>' + bundle + '</' + 'script></body></html>', 'utf8');
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.log('XATO ' + nom + ': ' + e.message.slice(0, 90)));
  await pg.goto('file:///' + p.split(SL).join('/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await pg.waitForSelector('.lesson-root', { timeout: 15000 });
  await pg.waitForTimeout(1000);
  if (act === 'xato') {
    const cells = pg.locator('.lesson-root .mrk-cell.cur.yashil:not([disabled])');
    await cells.nth(0).click();
    await pg.waitForTimeout(200);
    await pg.locator('.lesson-root .wsp-save').first().click();
    await pg.waitForTimeout(700);
  }
  await pg.waitForTimeout(300);
  const t = await pg.evaluate(() => {
    const st = document.querySelector('.stage-content');
    const txt = st ? st.innerText : '';
    const ph = [...document.querySelectorAll('.stage-content input[placeholder], .stage-content textarea[placeholder]')].map(e => e.placeholder).join(' ');
    return { txt, ph };
  });
  const seg = new Intl.Segmenter('uz', { granularity: 'grapheme' });
  const cnt = s => [...seg.segment(s.replace(/\s+/g, ' ').trim())].length;
  out.push({ nom, stage: cnt(t.txt), phold: cnt(t.ph), jami: cnt(t.txt) + cnt(t.ph), txt: t.txt.replace(/\n/g, ' | ') });
  await pg.close();
}
for (const o of out) console.log(o.nom + ': stage=' + o.stage + ' +ph=' + o.phold + ' → JAMI ' + o.jami);
for (const o of out) console.log(NL + '--- ' + o.nom + ' ---' + NL + o.txt);
await browser.close();
