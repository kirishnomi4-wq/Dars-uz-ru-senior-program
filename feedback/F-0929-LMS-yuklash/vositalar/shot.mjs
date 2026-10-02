// shot — LMS paket faylini brauzerda ochib, harakatlar ketma-ketligini bajaradi va skrinshot oladi.
// LMS=1 bo'lsa LMS sahifasining haqiqiy CSS'i (lms/host.css, Tailwind) ulanadi.
//   node shot.mjs <fayl.jsx> <ekran> <chiqish-prefiks> '<actions JSON>' '[seed JSON]'
//   actions: {click|text|focus|type|press|log|wait|shot} — focus/type/log F-1001-91 da qo'shildi (press avvaldan bor edi)
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/kali/Desktop/internetLesson';
const HERE = new URL('.', import.meta.url).pathname; // vositalar papkasi (lms-host.css shu yerda)
const SP = process.env.LMS_OUT || '/tmp/lms-tekshir'; // chiqish: bundle, skrinshot
const [file, sArg, prefix, actJson, seedJson] = process.argv.slice(2);
const actions = JSON.parse(actJson || '[]');
const seed = JSON.parse(seedJson || '{}');
const src = readFileSync(file, 'utf8');
const lessonId = (/lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
const total = ((/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '').split(/\n/).filter(l => /id\s*:/.test(l)).length;
const dir = join(SP, 'shotbuild', prefix.replace(/\W+/g, '_')); mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'entry.jsx'), `import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(file))};
const q = new URLSearchParams(location.search);
const s = Number(q.get('s') || 0), id = q.get('id') || '', total = Number(q.get('total') || 0);
try { localStorage.clear(); localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() }));
  const seed = ${JSON.stringify(seed)}; for (const k in seed) localStorage.setItem(k, typeof seed[k] === 'string' ? seed[k] : JSON.stringify(seed[k])); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: q.get('lang') || 'uz' }));
`);
await esbuild.build({
  entryPoints: [join(dir, 'entry.jsx')], bundle: true, outfile: join(dir, 'bundle.js'), format: 'iife', platform: 'browser', target: 'es2020',
  jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
  loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.gif': 'dataurl', '.webp': 'dataurl', '.mp3': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', '__DARS_API_URL__': '""' },
  absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
});
copyFileSync(join(HERE, 'lms-host.css'), join(dir, 'host.css'));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const mode of ['toza', 'lms']) {
  writeFileSync(join(dir, `${mode}.html`), `<!doctype html><html><head><meta charset="utf-8">${mode === 'lms' ? '<link rel="stylesheet" href="host.css">' : ''}</head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  await ctx.route(/^https?:\/\//, r => r.abort());
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(pathToFileURL(join(dir, `${mode}.html`)).href + `?lang=${process.env.LANG_ || 'uz'}&s=${sArg}&id=${encodeURIComponent(lessonId)}&total=${total}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 15000 });
  await page.waitForTimeout(1200);
  let n = 0;
  for (const a of actions) {
    try {
      if (a.click) await page.locator(a.click).first().click({ timeout: 3000 });
      if (a.text) await page.getByText(a.text, { exact: false }).first().click({ timeout: 3000 });
      if (a.focus) await page.locator(a.focus).first().click({ timeout: 3000 });      // masalan 'textarea.hc-code'
      if (a.type) await page.keyboard.type(a.type, { delay: 30 });                     // F-1001-91: yozish
      if (a.fill) await page.locator(a.fill).first().fill(a.value, { timeout: 3000 });
      if (a.press) await page.keyboard.press(a.press);
      if (a.log) console.log('   ' + mode + ' ' + a.log + ' → ' + JSON.stringify(await page.evaluate(() => (document.querySelector('textarea.hc-code') || {}).value ?? null)));
    } catch (e) { errs.push('action ' + JSON.stringify(a) + ': ' + e.message.split('\n')[0]); }
    await page.waitForTimeout(a.wait || 700);
    if (a.shot) { await page.screenshot({ path: `${SP}/${prefix}-${mode}-${a.shot}.png` }); n++; }
    if (a.probe) { const r = await page.evaluate(a.probe); console.log(mode, 'probe', a.shot || '', JSON.stringify(r)); }
  }
  console.log(mode, 'skrinshot:', n, errs.length ? 'XATO: ' + errs.join(' | ') : '');
  await ctx.close();
}
await browser.close();
