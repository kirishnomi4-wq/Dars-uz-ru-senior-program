// smoke-hw — uy-vazifa yig'malarini (lms/**/*.homework.shared.jsx) haqiqiy brauzerda ochadi: root chizildimi, konsol/sahifa xatosi yo'qmi, uz+ru.
//   CHROME=/usr/bin/google-chrome node scripts/smoke-hw.mjs lms/5-M/PmLesson11.homework.shared.jsx [...]
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
const files = process.argv.slice(2);
const TMP = mkdtempSync(join(tmpdir(), 'hw-smoke-'));
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
let bad = 0;
for (const [i, f] of files.entries()) {
  const res = await build({
    stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import HW, { HOMEWORK } from ${JSON.stringify(resolve(f))};
      window.__hw = HOMEWORK; const lang = new URLSearchParams(location.search).get('lang') || 'uz';
      createRoot(document.getElementById('root')).render(React.createElement(HW, { lang, onFinished: (p) => { window.__payload = p; } }));`,
      resolveDir: process.cwd(), sourcefile: 'entry.jsx', loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')], charset: 'utf8', write: false, logLevel: 'silent',
  });
  const page = join(TMP, `p${i}.html`);
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  const out = [];
  for (const lang of ['uz', 'ru']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e.message).slice(0, 100)));
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon|Download the React|net::ERR/i.test(m.text())) errs.push('CONSOLE: ' + m.text().slice(0, 100)); });
    let info = { root: false, text: 0, hw: null };
    try {
      await p.goto('file://' + page + `?lang=${lang}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await p.waitForSelector('.hw-root, .lesson-root, #root > *', { timeout: 15000 });
      await p.waitForTimeout(600);
      info = await p.evaluate(() => ({ root: !!document.querySelector('#root > *'), text: (document.body.innerText || '').trim().length, hw: window.__hw ? { id: window.__hw.id || window.__hw.lessonId || null, keys: Object.keys(window.__hw).slice(0, 6) } : null }));
    } catch (e) { errs.push('YUKLANMADI: ' + String(e.message).split('\n')[0].slice(0, 100)); }
    await ctx.close();
    out.push({ lang, ...info, errs });
  }
  const ok = out.every((o) => o.root && o.text > 40 && !o.errs.length);
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} ${basename(f).padEnd(34)} uz:${out[0].text} belgi · ru:${out[1].text} belgi · HOMEWORK: ${JSON.stringify(out[0].hw)}`);
  for (const o of out) for (const e of o.errs) console.log(`     [${o.lang}] ${e}`);
}
await browser.close();
console.log(bad ? `\n${bad} ta sindi` : '\nHammasi ochildi');
process.exit(bad ? 1 : 0);
