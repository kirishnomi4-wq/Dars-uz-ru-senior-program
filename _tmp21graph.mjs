// s8 grapheme o'lchovi: 1-kun / 2-kun / 3-kun holatlari
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const SL = String.fromCharCode(92), NL = String.fromCharCode(10);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = process.argv[2] || 'src/5-Modull/PmLesson21.jsx';
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const total = ((/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src))[1].match(/\{\s*id:/g) || []).length;
const R3 = [
  { savol: "Uy vazifasini oxirgi marta qachon unutgansiz?", eshitgan: "O'tgan payshanba kuni guruhni kech ochdim" },
  { savol: "O'sha kuni vazifani qanday topdingiz?", eshitgan: "Dugonamga yozdim, u rasmini tashladi" },
  { savol: "Botni oxirgi marta qachon ochgansiz?", eshitgan: "Kecha kechqurun, dars jadvalini ko'rdim" },
];
const EXTRA = {
  'pm-m5d8-javoblar': JSON.stringify({ javoblar: R3.map(r => ({ savol: r.savol, eshitgan: r.eshitgan })), savedAt: Date.now() }),
  'pm-m5d11-hook-choice': 'ayta',
  'pm-m5d11-kun': JSON.stringify({ kun: 5, elon: true, savedAt: Date.now() }),
};
const K = [{ kun: 1, kelgan: 9, qaytgan: 4 }, { kun: 2, kelgan: 7, qaytgan: 4 }, { kun: 3, kelgan: 6, qaytgan: 5 }];
const CASES = [['1-kun', [], null], ['1-kun+son', [], 'type1'], ['saqlagach', [], 'save1'], ['2-kun', K.slice(0, 1), null], ['3-kun', K.slice(0, 2), null], ['yakun', K, null]];
const TMP = mkdtempSync(join(tmpdir(), 'grf-'));
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
for (const [nom, kunlar, act] of CASES) {
  const answers = { 0: { stage: 'hook', screenIdx: 0, picked: 0, correct: false }, 4: { stage: 'kun', solved: true, correct: true, kun: 5, elon: true } };
  if (kunlar.length) answers[8] = { stage: 'practice', screenIdx: 8, kunlar, solved: kunlar.length >= 3, correct: true };
  const seedLines = Object.entries(EXTRA).map(([k, v]) => 'localStorage.setItem(' + JSON.stringify(k) + ',' + JSON.stringify(v) + ');').join('');
  const prog = JSON.stringify({ screen: 8, answers, earned: [], startedAt: Date.now(), total, savedAt: Date.now() });
  const seed = 'localStorage.setItem("liveSession:' + lessonId + '",' + JSON.stringify('{"mode":"self"}') + ');' +
    'localStorage.setItem("ccProgress:' + lessonId + '",' + JSON.stringify(prog) + ');' + seedLines;
  const p = join(TMP, 'g' + nom + '.html');
  writeFileSync(p, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + '</' + 'script><script>' + bundle + '</' + 'script></body></html>', 'utf8');
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.log('XATO ' + nom + ': ' + e.message.slice(0, 90)));
  await pg.goto('file:///' + p.split(SL).join('/'), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await pg.waitForSelector('.lesson-root', { timeout: 15000 });
  await pg.waitForTimeout(1200);
  if (act) {
    const inp = pg.locator('.lesson-root .reflect-input.num');
    await inp.nth(0).fill('9');
    if (act === 'save1') { await inp.nth(1).fill('4'); await pg.waitForTimeout(200); await pg.locator('.lesson-root .wsp-save').click(); }
    await pg.waitForTimeout(900);
  }
  await pg.waitForTimeout(400);
  const t = await pg.evaluate(() => {
    const st = document.querySelector('.stage-content');
    const txt = st ? st.innerText : '';
    const tas = st.querySelector('.tasma'); const ph = [...document.querySelectorAll('.stage-content input[placeholder], .stage-content textarea[placeholder]')].map(e => e.placeholder).join(' ');
    return { txt, ph, tas: tas ? tas.innerText : '' };
  });
  const seg = new Intl.Segmenter('uz', { granularity: 'grapheme' });
  const cnt = s => [...seg.segment(s.replace(/\s+/g, ' ').trim())].length;
  out.push({ nom, stage: cnt(t.txt), phold: cnt(t.ph), jami: cnt(t.txt) + cnt(t.ph), tas: cnt(t.tas), txt: t.txt.replace(/\n/g, ' | ') });
  await pg.close();
}
for (const o of out) console.log(o.nom + ': stage=' + o.stage + ' +placeholder=' + o.phold + ' → JAMI ' + o.jami + ' · tasmasiz ' + (o.jami - o.tas));
for (const o of out) console.log(NL + "--- " + o.nom + " ---" + NL + o.txt);
await browser.close();
