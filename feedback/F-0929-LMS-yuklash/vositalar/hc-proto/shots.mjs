import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = '/home/kali/Desktop/internetLesson';
const D = new URL('.', import.meta.url).pathname;
const B = join(D, 'build'); mkdirSync(B, { recursive: true }); mkdirSync(join(D, 'img'), { recursive: true });
for (const [nm, src] of [['hoz', ROOT + '/src/compilator/HtmlCompiler.jsx'], ['proto', D + 'HtmlCompiler.jsx']]) {
  writeFileSync(join(B, nm + '.jsx'), `import React from 'react';
import { createRoot } from 'react-dom/client';
const q = new URLSearchParams(location.search);
const allow = q.get('allow');
if (allow === 'html1') window.__PROTO_ALLOW = ['html','head','title','body','h1','h2','h3','h4','p','a','ul','ol','li','strong','em','br'];
const task = { title: q.get('t') || 'Praktika', brief: q.get('b') || '', requirements: [], files: [{ name: 'index.html', lang: 'html', starter: '' }] };
try { localStorage.clear(); } catch {}
import('${src}').then((m) => createRoot(document.getElementById('root')).render(React.createElement(m.default, { lang: 'uz', task })));
`);
  await esbuild.build({ entryPoints: [join(B, nm + '.jsx')], bundle: true, outfile: join(B, nm + '.js'), format: 'iife', platform: 'browser', target: 'es2020', jsx: 'automatic', logLevel: 'silent', charset: 'utf8', define: { 'process.env.NODE_ENV': '"production"' }, absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')] });
  writeFileSync(join(B, nm + '.html'), `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="host.css"></head><body><div id="root"></div><script src="${nm}.js"></script></body></html>`);
}
copyFileSync(ROOT + '/feedback/F-0929-LMS-yuklash/vositalar/lms-host-Cxf12j0x.css', join(B, 'host.css'));
const SH = [
  ['hoz-fo', 'hoz', '', '<fo'],
  ['hoz-divtab', 'hoz', '', '<div>h1{Tab}'],
  ['hoz-formtab', 'hoz', '', 'form{Tab}'],
  ['A-fo', 'proto', '', '<fo'],
  ['A-div', 'proto', '', '<div>h'],
  ['A-divtab', 'proto', '', '<div>h1{Tab}'],
  ['A-ptext', 'proto', '', '<p>ol'],
  ['A-form', 'proto', '', 'form{Tab}{Enter}input{Tab}'],
  ['B-ul-oldin', 'proto', '', 'ul>li*3'],
  ['B-ul', 'proto', '', 'ul>li*3{Tab}'],
  ['B-bang', 'proto', '', '!{Tab}'],
  ['B-card', 'proto', '', 'div.card{Tab}'],
  ['S15-A', 'proto', '', '<s'],
  ['S15-B', 'proto', 'html1', '<s'],
];
const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const pg = await br.newPage({ viewport: { width: 1366, height: 768 } });
const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
for (const [name, build, allow, seq] of SH) {
  await pg.goto('file://' + join(B, build + '.html') + (allow ? '?allow=' + allow : '')); await pg.waitForSelector('textarea.hc-code');
  await pg.click('textarea.hc-code');
  for (const p of seq.split(/(\{Tab\}|\{Enter\})/).filter(Boolean)) {
    if (p === '{Tab}') await pg.keyboard.press('Tab'); else if (p === '{Enter}') await pg.keyboard.press('Enter'); else await pg.keyboard.type(p, { delay: 30 });
  }
  await pg.waitForTimeout(250);
  const r = await pg.evaluate(() => { const ta = document.querySelector('textarea.hc-code'); const m = document.querySelector('.hc-menu'); return { v: ta.value, menu: m ? [...m.querySelectorAll('.hc-menu-k')].map((x) => x.textContent).join(' ') : '-' }; });
  await pg.screenshot({ path: join(D, 'img', name + '.png'), clip: { x: 30, y: 203, width: 642, height: 360 } });
  console.log(name.padEnd(12), JSON.stringify(r.v).padEnd(70), r.menu);
}
console.log('pageerror', errs);
await br.close();
