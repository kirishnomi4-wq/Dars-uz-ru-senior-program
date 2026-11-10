// v4 (majburiy) va v3 da: oxirgi ekranda yakun tugmasini bosish → ✕ yozuvi chiqadimi (faqat v4)
import { build } from '/home/kali/Desktop/internetLesson/node_modules/esbuild/lib/main.js';
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', SP = process.argv[2];
const force = { name: 'v4', setup(b) { b.onLoad({ filter: /src[\\/]live[\\/]resultSchema\.js$/ }, (a) => { let s = readFileSync(a.path, 'utf8');
  s = s.replace('export function isV4(lessonId) {', 'export function isV4(lessonId) { return true;').replace("export const getDarsApi = (lessonId) => darsApi.get(lessonId) || null;", "export const getDarsApi = (lessonId) => darsApi.get(lessonId) || { attempt_id: 'x', session_key: null, lesson_version: 'vT', v2: true };");
  return { contents: s, loader: 'js' }; }); } };
const totalOf = (src) => [...(((/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1]) || '').matchAll(/\{\s*id:\s*'[^']+'/g)].length;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let bad = 0;
for (const [file, v4] of [['src/1-Modull/CssLesson1.jsx', true], ['src/1-Modull/CssLesson1.jsx', false], ['src/1-Modull/InternetLesson.jsx', true]]) {
  const src = readFileSync(`${ROOT}/${file}`, 'utf8'); const lid = /lessonId:\s*'([^']+)'/.exec(src)[1]; const total = totalOf(src);
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/' + file)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { (window.__of = window.__of || []).push(p); } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], plugins: v4 ? [force] : [], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, define: { __DARS_API_URL__: '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const f = `${SP}/exit-${v4}-${lid}.html`;
  writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>for(const r of ['mentor','learner','student','self'])localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('liveSession:${lid}','{"mode":"self"}');localStorage.setItem('ccProgress:${lid}',JSON.stringify({screen:${total - 1},answers:{},earned:[],startedAt:Date.now()-60000,total:${total},savedAt:Date.now()}));<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);
  const p = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + f); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(2500);
  const before = await p.evaluate(() => !!document.querySelector('[data-live=exit-hint]'));
  // m1-01: avval «Darsni yakunlash» (oyna), keyin FinishBtn
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /yakunlash/i.test(x.innerText) && !x.closest('[data-live^=finish]') && x.getAttribute('data-live') !== 'finish' && x.getAttribute('data-live') !== 'finish-done'); if (b && !document.querySelector('[data-live^=finish]')) b.click(); });
  await p.waitForTimeout(600);
  await p.evaluate(() => { const b = document.querySelector('[data-live^=finish]'); if (b) b.click(); });
  await p.waitForTimeout(800);
  const hint = await p.evaluate(() => document.querySelector('[data-live=exit-hint]')?.innerText || null);
  await p.screenshot({ path: `${SP}/exit-${v4}-${lid}.png` });
  const ok = v4 ? (!before && !!hint && /✕/.test(hint)) : !hint;
  if (!ok || errs.length) bad++;
  console.log(`${ok && !errs.length ? '✓' : '✗'} ${lid} v4=${v4} · bosishdan oldin ${before} · keyin: ${hint ? JSON.stringify(hint) : 'yo\'q'} · onFinished ${await p.evaluate(() => (window.__of || []).length)} · xato ${errs.length}`);
}
await browser.close(); process.exit(bad ? 1 : 0);
