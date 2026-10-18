// F-1017-208 · HtmlCompiler storageKey isboti: CssLesson1 TASK_COLOR ni mentor kaliti bilan ochish → yozish → yopish (unmount) → qayta ochish → kod joyidami?
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', OUT = process.argv[2];
const plug = { name: 'x', setup(b) { b.onLoad({ filter: /CssLesson1\.jsx$/ }, (a) => ({ contents: readFileSync(a.path, 'utf8') + '\nexport const __T = { TASK_COLOR, codeKeyOf, LESSON_META };\n', loader: 'jsx' })); } };
const entry = `import React from 'react'; import { createRoot } from 'react-dom/client';
import HtmlCompiler from ${JSON.stringify(ROOT + '/src/compilator/HtmlCompiler.jsx')};
import { __T } from ${JSON.stringify(ROOT + '/src/1-Modull/CssLesson1.jsx')};
const root = createRoot(document.getElementById('root'));
window.__key = __T.codeKeyOf(__T.LESSON_META.lessonId, 'mentor-s11');
window.__mount = (withKey) => root.render(React.createElement(HtmlCompiler, { key: Date.now(), task: __T.TASK_COLOR, lang: 'uz', storageKey: withKey ? window.__key : undefined, onContinue: () => {}, onBack: () => {} }));
window.__unmount = () => root.render(null);`;
const res = await build({ stdin: { contents: entry, resolveDir: ROOT, loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', plugins: [plug], nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl', '.mp4': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'error' });
const page = OUT + '/saqlov.html'; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await (await br.newContext()).newPage(); await p.goto('file://' + page); await p.waitForTimeout(500);
const KOD = 'h1 { color: tomato; background-color: gold; }';
const run = async (withKey) => {
  await p.evaluate((k) => window.__mount(k), withKey); await p.waitForTimeout(400);
  await p.click('text=style.css'); await p.waitForTimeout(200);
  await p.fill('textarea', KOD); await p.waitForTimeout(700);           // 400 ms saqlov o'tsin
  await p.evaluate(() => window.__unmount()); await p.waitForTimeout(200); // kuzatishga o'tgandek
  await p.evaluate((k) => window.__mount(k), withKey); await p.waitForTimeout(400);
  await p.click('text=style.css'); await p.waitForTimeout(200);
  return p.inputValue('textarea');
};
const a = await run(false), b = await run(true);
const ls = await p.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('ccCode:')));
console.log('storageKey YO‘Q → qayta ochganda:', JSON.stringify(a.slice(0, 60)));
console.log('storageKey BOR → qayta ochganda:', JSON.stringify(b.slice(0, 60)), b === KOD ? '✅ SAQLANDI' : '❌');
console.log('localStorage kalitlari:', ls);
await br.close();
