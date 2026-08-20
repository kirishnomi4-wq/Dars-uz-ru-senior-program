import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const SL = String.fromCharCode(92), NL = String.fromCharCode(10), Q = String.fromCharCode(34);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = 'src/5-Modull/PmLesson21.jsx';
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const total = ((/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src))[1].match(/\{\s*id:/g) || []).length;
const res = await build({ stdin: { contents: 'import React from "react";' + NL + 'import { createRoot } from "react-dom/client";' + NL + 'import Lesson from ' + JSON.stringify(resolve(target).split(SL).join('/')) + ';' + NL + 'createRoot(document.getElementById("root")).render(React.createElement(Lesson, { lang: "uz" }));', resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent' });
const bundle = res.outputFiles[0].text;
const TMP = mkdtempSync(join(tmpdir(), 's9-'));
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const open = async (qator) => {
  const answers = qator ? { 9: { stage: 'belgi', screenIdx: 9, qator } } : {};
  const prog = JSON.stringify({ screen: 9, answers, earned: [], startedAt: Date.now(), total, savedAt: Date.now() });
  const seed = 'localStorage.setItem(' + Q + 'liveSession:' + lessonId + Q + ',' + JSON.stringify('{"mode":"self"}') + ');'
    + 'localStorage.setItem(' + Q + 'ccProgress:' + lessonId + Q + ',' + JSON.stringify(prog) + ');';
  const p = join(TMP, 's' + (qator || 0) + '.html');
  writeFileSync(p, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + '</' + 'script><script>' + bundle + '</' + 'script></body></html>', 'utf8');
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.log('XATO: ' + e.message.slice(0, 80)));
  await pg.goto('file:///' + p.split(SL).join('/'), { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('.lesson-root');
  await pg.waitForTimeout(900);
  return pg;
};
const legend = pg => pg.$$eval('.mrk-key', els => els.map(e => e.innerText.trim()));
const fb = pg => pg.$eval('.sfb', e => e.innerText.trim()).catch(() => '(sfb yoq)');
const cases = [
  ['ORTIQCHA · Aziz 1+2', 0, [1, 2], false],
  ['KAM · Dilnoza faqat 3', 1, [3], false],
  ['BOSH · Aziz qaytmagan', 0, [], true],
  ['ORTIQCHA · Shohrux 1', 2, [1], false],
  ['TOGRI · Aziz 2', 0, [2], false],
];
for (const [nom, qator, kunlar, bosh] of cases) {
  const pg = await open(qator);
  const leg0 = await legend(pg);
  for (const k of kunlar) {
    const cells = await pg.$$('.mrk-grid .mrk-cell.cur');
    await cells[k - 1].click();
  }
  await pg.waitForTimeout(150);
  if (bosh) await pg.click('.mrk-go .btn-soft'); else await pg.click('.mrk-go .wsp-save');
  await pg.waitForTimeout(500);
  console.log(nom);
  console.log('   javob: ' + (await fb(pg)));
  console.log('   legenda: ' + JSON.stringify(leg0) + ' -> ' + JSON.stringify(await legend(pg)));
  console.log('   mrk-go: ' + ((await pg.$('.mrk-go')) ? 'bor' : 'yoq'));
  await pg.close();
}
await browser.close();
