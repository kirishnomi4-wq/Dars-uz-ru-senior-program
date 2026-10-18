// 9-ekran (indeks 8) bajarilmagan: 65 s kutamiz → klapan «Davom etish»ni ochadimi → oldinga → orqaga → yana yopiqmi.
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const file = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(file)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const src = readFileSync(file, 'utf8');
const id = /lessonId:\s*['"]([^'"]+)['"]/.exec(src)[1];
const total = (/SCREEN_META\d* = \[([\s\S]*?)\n\];/.exec(src)[1].match(/\{\s*id:/g) || []).length;
const metaBody = /SCREEN_META\d* = \[([\s\S]*?)\n\];/.exec(src)[1];
const ents = metaBody.split('\n').filter(l => /\{\s*id:/.test(l));
let K = process.argv[3] ? Number(process.argv[3]) : ents.findIndex((l, i) => i >= 2 && /type:\s*'test'/.test(l));
const answers = {}; for (let i = 0; i < K; i++) answers[i] = { correct: true, picked: 0, solved: true };
const prog = { screen: K, answers, earned: [], startedAt: Date.now() - 60000, total, savedAt: Date.now() };
const seed = `for(const r of ['mentor','learner','student','self']){localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('hcOnboarded_'+r,'1');}localStorage.setItem('liveLang','uz');` +
  `localStorage.setItem('liveSession:${id}','{"mode":"mentor","pin":"123456","token":"t"}');localStorage.setItem('ccProgress:${id}',${JSON.stringify(JSON.stringify(prog))});`;
const page = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/ef50c8c9-7b19-4855-ab6c-df0d6fda3a06/scratchpad/nav/mentor-' + id + '.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route(/^https?:\/\//, (r) => r.abort());
const p = await ctx.newPage();
await p.route(/\/players\//, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[{"id":"p1","nickname":"Ali"}]' }));
await p.route(/\/answers\//, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(2500);
const info = () => p.evaluate(() => {
  const nx = [...document.querySelectorAll('button.btn-white-accent')].pop();
  const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/);
  return `${m ? m[1] : '?'}: «${nx ? nx.innerText.trim().slice(0, 45) : '-'}» ${nx && nx.disabled ? 'YOPIQ' : 'ochiq'}`;
});
const out = ['K=' + K, await info()];
const rv = p.locator('button.mstats-reveal');
if (await rv.count()) { await rv.first().click(); await p.waitForTimeout(600); out.push('ochish→ ' + await info()); } else out.push('ochish tugmasi YOQ');
try { await p.locator('button.btn-white-accent').last().click({ timeout: 4000 }); await p.waitForTimeout(700); out.push('oldinga→ ' + await info()); } catch { out.push('oldinga BOSILMADI'); }
try { await p.locator('button:not([disabled])', { hasText: /orqaga/i }).last().click({ timeout: 4000 }); await p.waitForTimeout(700); out.push('orqaga→ ' + await info()); } catch { out.push('orqaga BOSILMADI'); }
console.log(out.join(' | ')); console.log('pageerror', JSON.stringify(errs));
await b.close();
