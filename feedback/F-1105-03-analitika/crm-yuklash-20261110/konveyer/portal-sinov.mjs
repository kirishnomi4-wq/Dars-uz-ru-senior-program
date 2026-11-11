// Portal sinovi: yig'ilgan darsda «Avval tayyorlaning» tugmasini topib bosadi → oyna (.am-tt-oyna) .lesson-root ichida,
// .stage-content dan TASHQARIDA chizilganini va konsolda xato yo'qligini tekshiradi. Faqat o'qish.
import { build } from '/home/kali/Desktop/internetLesson/node_modules/esbuild/lib/main.js';
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
const ROOT = '/home/kali/Desktop/internetLesson';
const TMP = mkdtempSync(join(tmpdir(), 'portal-'));
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const f of process.argv.slice(2)) {
  const src = readFileSync(f, 'utf8');
  const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
  const reactDom = /from\s*["']react-dom["']/.test(src);
  const res = await build({ stdin: { contents: `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport Lesson from ${JSON.stringify(resolve(f))};\ncreateRoot(document.getElementById('root')).render(React.createElement(Lesson, {lang:'uz'}));\n`, resolveDir: ROOT, sourcefile: 'p.jsx', loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [join(ROOT, 'node_modules')], write: false, logLevel: 'silent', define: { 'process.env.NODE_ENV': '"production"' } });
  let topildi = null; const xatolar = [];
  for (let i = 0; i < 1 && !topildi; i++) {
    const p = join(TMP, `${basename(f)}-${i}.html`);
    writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><div id="root"></div><script>localStorage.setItem('ccProgress:${lessonId}', JSON.stringify({screen:${i},answers:{},earned:[],startedAt:Date.now(),total:40,savedAt:Date.now()}));<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => xatolar.push(String(e.message).slice(0, 120)));
    await pg.route(/^https?:\/\//, r => r.abort());
    await pg.goto('file://' + p, { waitUntil: 'load' }); await pg.waitForTimeout(700);
    const solo = pg.locator('button', { hasText: 'mustaqil' }).first(); if (await solo.count()) { await solo.click().catch(() => {}); await pg.waitForTimeout(700); }
    const btn = pg.locator('.am-tt-btn').first();
    for (let k = 0; k < 20 && !(await btn.count() && await btn.isVisible()); k++) { const nx = pg.locator('.stage-nav button:not([disabled])').last(); if (!(await nx.count()) || /tanlang|выберите/i.test(await nx.innerText())) { const opt = pg.locator('.stage-content button:not([disabled]), .stage-content [role=radio]').first(); if (await opt.count()) { await opt.click({ timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(500); } continue; } await nx.click({ timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(600); }
    await pg.screenshot({ path: "/tmp/claude-1000/-home-kali-Desktop-internetLesson/a3e0b52e-a97c-4f68-b0b3-b3f0f940f5c7/scratchpad/portal-" + basename(f) + ".png" });
    console.log("tugmalar:", JSON.stringify(await pg.evaluate(() => [...document.querySelectorAll("button")].slice(0, 12).map(b => b.className.slice(0, 20) + ":" + b.textContent.trim().slice(0, 20)))));
    if (await btn.count() && await btn.isVisible()) {
      await btn.click(); await pg.waitForTimeout(500);
      topildi = await pg.evaluate(() => { const o = document.querySelector('.am-tt-oyna'); if (!o) return {ekran: null, oyna: false};
        const r = o.getBoundingClientRect(); return {oyna: true, lessonRootIchida: !!o.closest('.lesson-root'), stageContentIchida: !!o.closest('.stage-content'), backdrop: !!document.querySelector('.zoom-backdrop'), markaz: Math.round(r.left + r.width / 2), eni: Math.round(r.width) }; });
      topildi.ekran = i;
      // Escape bilan yopiladimi
      await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
      topildi.yopildi = !(await pg.locator('.am-tt-oyna').count());
    }
    await ctx.close();
  }
  console.log(basename(f), 'react-dom importi:', reactDom, '·', JSON.stringify(topildi), '· xato:', xatolar.length ? xatolar.slice(0, 3) : 0);
}
await b.close();
