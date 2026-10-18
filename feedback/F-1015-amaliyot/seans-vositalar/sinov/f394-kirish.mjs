// F-1015-394 · 216-qonun sinovi: har darsda kirishda variant bosiladi → `.hook-ack` qisqa (≤ 120), «Bugun…» bor, pageerror yo'q (uz + ru)
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/f394-kirish.mjs <chiqish-papka> src/…/A.jsx src/…/B.jsx …
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [OUT, ...FILES] = process.argv.slice(2); mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let jami = 0, otdi = 0;
for (const rel of FILES) for (const lang of ['uz', 'ru']) {
  jami++;
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/' + rel)};
    createRoot(document.getElementById('root')).render(React.createElement(L, { lang: '${lang}' }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent', define: { 'process.env.NODE_ENV': '"production"' } });
  const page = `${OUT}/k-${rel.replace(/[/.]/g, '_')}-${lang}.html`;
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.addInitScript(() => { localStorage.clear(); for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } }); // onboarding o'tkazib yuboriladi
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + page, { timeout: 90000 }); await p.waitForTimeout(900);
  const solo = p.locator('button', { hasText: /Kodsiz|Без кода/ }); if (await solo.count()) { await solo.first().click(); await p.waitForTimeout(800); } // «Darsga qo'shilish» — mustaqil rejim
  let ack = '';
  const bosilgan = new Set();
  for (let k = 0; k < 18 && !ack; k++) {
    const opt = await p.$('.hook-option:not([disabled])');
    if (opt) { await opt.click(); await p.waitForTimeout(500); ack = (await p.$('.hook-ack')) ? (await p.innerText('.hook-ack')).trim() : ''; break; }
    // savol hali yopiq — bo'sh maydonni to'ldiramiz va sahnadagi tugmalarni navbat bilan bosamiz (⛶ va variantlarsiz)
    const hint = await p.$('.stage-content .taphint:not([disabled])'); if (hint) { await hint.click({ force: true, timeout: 2000 }).catch(() => {}); await p.waitForTimeout(700); continue; } // «bosing» belgisi bor tugma — birinchi; doim pulsatsiyada, shuning uchun force
    for (const inp of await p.$$('.stage-content input:not([disabled]), .stage-content textarea')) { if (!(await inp.inputValue())) await inp.fill('salom dunyo').catch(() => {}); }
    const els = await p.$$('.stage-content button:not(.hook-option):not(.zoom-btn):not([disabled]), .stage-content .paper, .stage-content [role="button"], .stage-content .vcard, .stage-content .messy');
    let bosdi = false;
    for (const [n, el] of els.entries()) { const kalit = n + ':' + (await el.innerText().catch(() => '')); if (bosilgan.has(kalit)) continue; bosilgan.add(kalit); await el.click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(700); bosdi = true; break; }
    if (!bosdi) { bosilgan.clear(); await p.waitForTimeout(900); } // animatsiya tugashini kutamiz
  }
  const bugun = lang === 'uz' ? /Bugun/ : /Сегодня/;
  const ok = !!ack && ack.length <= 120 && bugun.test(ack) && !errs.length;
  if (ok) otdi++;
  console.log(`${ok ? '✅' : '❌'} ${rel} [${lang}] ${ack.length} · ${ack.replace(/\n/g, ' ')}${errs.length ? ' · ERR ' + errs.join(' | ') : ''}`);
  await ctx.close();
}
await b.close();
console.log(`${otdi}/${jami}`);
