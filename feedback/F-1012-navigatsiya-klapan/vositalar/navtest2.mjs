// Bajarilgan ekranlar (0..K-1) saqlovda turibdi, dars K-ekranda ochiladi → «Orqaga» bilan 0 gacha → har ekranda «Davom etish» holati.
// Keyin oldinga qaytib boramiz. Kod o'zgarmaydi, tarmoq yopiq.
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [file, mode = 'self', K = '8'] = process.argv.slice(2);
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(file)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const src = (await import('node:fs')).readFileSync(file, 'utf8');
const id = /lessonId:\s*['"]([^'"]+)['"]/.exec(src)[1];
const total = (/SCREEN_META\d* = \[([\s\S]*?)\n\];/.exec(src)[1].match(/\{\s*id:/g) || []).length;
const answers = {}; for (let i = 0; i < Number(K); i++) answers[i] = { correct: true, picked: 0, solved: true };
const prog = { screen: Number(K), answers, earned: [], startedAt: Date.now() - 60000, total, savedAt: Date.now() };
const seed = `for(const r of ['mentor','learner','student','self']){localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('hcOnboarded_'+r,'1');}localStorage.setItem('liveLang','uz');` +
  `localStorage.setItem('liveSession:${id}',${JSON.stringify(JSON.stringify({ mode }))});localStorage.setItem('ccProgress:${id}',${JSON.stringify(JSON.stringify(prog))});`;
const page = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/ef50c8c9-7b19-4855-ab6c-df0d6fda3a06/scratchpad/nav/' + id + '.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route(/^https?:\/\//, (r) => r.abort());
const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push((e.message + ' @ ' + (e.stack||'').split('\n').slice(1,3).join(' | ')).slice(0, 400)));
await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(1500);
const info = () => p.evaluate(() => {
  const nx = [...document.querySelectorAll('button.btn-white-accent')].pop();
  const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/);
  return { n: m ? m[1] : '?', t: nx ? nx.innerText.trim().slice(0, 45) : '-', dis: nx ? nx.disabled : null };
});
console.log('ochildi:', JSON.stringify(await info()));
const rows = [];
for (let s = 0; s < Number(K) + 1; s++) {
  const back = p.locator('button:not([disabled])', { hasText: /orqaga/i }).last();
  if (!(await back.count())) { rows.push('orqaga tugmasi yo\'q'); break; }
  await back.click(); await p.waitForTimeout(700);
  const i = await info(); rows.push(`orqaga → ${i.n}: «${i.t}» ${i.dis ? 'YOPIQ ❌' : 'ochiq ✅'}`);
  if (i.n === '01') break;
}
console.log(rows.join('\n'));
const fw = [];
for (let s = 0; s < Number(K); s++) {
  const i0 = await info(); if (i0.dis) { fw.push(`oldinga to'xtadi: ${i0.n} «${i0.t}» YOPIQ`); break; }
  try { await p.locator('button.btn-white-accent').last().click({ timeout: 5000 }); } catch (e) { fw.push(`oldinga BOSILMADI ${i0.n} «${i0.t}»: ${e.message.split('\n').filter(l => /intercepts|not enabled|not visible|detached/.test(l)).slice(0,1).join('')}`); break; }
  await p.waitForTimeout(700);
  const i = await info(); fw.push(`oldinga → ${i.n}: «${i.t}» ${i.dis ? 'YOPIQ' : 'ochiq'}`);
}
console.log(fw.join('\n'));
console.log('pageerror', errs);
await b.close();
