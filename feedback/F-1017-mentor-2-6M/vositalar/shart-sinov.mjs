// F-1017-205 · LMS 2–6 kompilyator praktikalari SHARTLARINI haqiqiy HtmlCompiler'da sinash.
// Darslar diskda o'zgarmaydi: esbuild plagini xotirada `export const __T = {...}` qo'shadi.
// Har holat: yechim → qaysi shart yashil (hc-chip.ok) + «Davom etish» ochiqmi (hc-next).
// node feedback/F-1017-mentor-2-6M/vositalar/shart-sinov.mjs <chiqish.json>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
import { CASES } from './shart-holatlar.mjs';

const ROOT = '/home/kali/Desktop/internetLesson';
const OUT = process.argv[2] || '/tmp/shart-sinov.json';
const FILES = [...new Set(CASES.map(c => c.f))];
const NAMES = {};
for (const c of CASES) (NAMES[c.f] ||= new Set()).add(c.t), (c.extra || []).forEach(x => NAMES[c.f].add(x));

const plug = {
  name: 'export-tasks',
  setup(b) {
    b.onLoad({ filter: /src\/.*\.jsx$/ }, (a) => {
      const rel = a.path.replace(ROOT + '/', '');
      if (!NAMES[rel]) return undefined;
      const src = readFileSync(a.path, 'utf8');
      return { contents: src + `\nexport const __T = { ${[...NAMES[rel]].join(', ')} };\n`, loader: 'jsx' };
    });
  },
};
const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import HtmlCompiler from ${JSON.stringify(ROOT + '/src/compilator/HtmlCompiler.jsx')};
${FILES.map((f, i) => `import { __T as T${i} } from ${JSON.stringify(ROOT + '/' + f)};`).join('\n')}
const T = { ${FILES.map((f, i) => `${JSON.stringify(f)}: T${i}`).join(', ')} };
const root = createRoot(document.getElementById('root'));
let n = 0;
window.__run = (f, t, codes, mk) => {
  const L = T[f]; let task = L[t];
  if (mk) task = L[t](mk.helper ? L[mk.helper](codes[mk.file]) : codes[mk.file]);
  let starterCode;
  if (Array.isArray(task.files) && task.files.length) task = { ...task, files: task.files.map(x => ({ ...x, starter: codes[x.name] != null ? codes[x.name] : x.starter })) };
  else starterCode = codes.html;
  root.render(React.createElement(HtmlCompiler, { key: ++n, task, starterCode, lang: 'uz', onContinue: () => {}, onBack: () => {} }));
};`;
const res = await build({ stdin: { contents: entry, resolveDir: ROOT, loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', plugins: [plug],
  nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl', '.mp4': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'error' });
const page = OUT.replace(/\.json$/, '.html');
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);

const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route(/^https?:\/\//, (r) => r.abort());
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
await p.goto('file://' + page); await p.waitForTimeout(800);
const out = [];
for (const c of CASES) {
  await p.evaluate(([f, t, codes, mk]) => window.__run(f, t, codes, mk), [c.f, c.t, c.codes, c.mk || null]);
  let r;
  for (let k = 0; k < 20; k++) {
    await p.waitForTimeout(250);
    r = await p.evaluate(() => {
      const chips = [...document.querySelectorAll('.hc-chip')];
      return { ok: chips.map(x => x.classList.contains('ok')), labels: chips.map(x => x.textContent.replace(/^\s*(✓|\d+)/, '').trim()), hints: chips.map(x => x.getAttribute('title') || ''), next: !document.querySelector('.hc-next')?.disabled };
    });
    if (k > 6 && !r.hints.some(h => /ishga tushirilmoqda/.test(h))) break;
  }
  const passed = r.next;
  const verdict = (c.want === 'pass') === passed ? 'OK' : (c.want === 'pass' ? 'QATTIQ' : 'BOSH');
  out.push({ f: c.f.split('/').pop().replace('.jsx', ''), t: c.t, case: c.name, want: c.want, next: r.next, ok: r.ok, labels: r.labels, hints: r.hints, verdict });
  console.log(`${verdict.padEnd(6)} ${c.f.split('/').pop().replace('.jsx', '').padEnd(22)} ${c.t.padEnd(18)} ${c.want.padEnd(4)} ${r.ok.map(x => x ? '✓' : '·').join('')}  ${c.name}`);
}
if (errs.length) console.log('pageerror:', [...new Set(errs)].join(' | '));
writeFileSync(OUT, JSON.stringify(out, null, 1));
await br.close();
