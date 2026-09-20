#!/usr/bin/env node
// ============================================================
//  smoke-rejim — darsni TO'RT rejimda ochib, chizilishini va xatosizligini tekshiradi (F-0921-02).
//
//  Nega kerak: `mentor` va jonli `student` rejimlari shu paytgacha faqat KOD O'QISH bilan tekshirilgan
//  (SINOV_PROTOKOLI eslatmasi). Dushanbadan darslar boshlanadi — mentor ekranida yiqilish bo'lsa,
//  buni sinfda bilish juda qimmat. Bu skript rejimni `liveSession:<darsId>` urug'i bilan qo'yadi
//  (dars shu saqlovdan rejimni tiklaydi) va sahifa xatosiz chizilishini tasdiqlaydi.
//
//  Rejimlar: self (kodsiz) · mentor (PIN paneli) · student (jonli o'quvchi) · solo (uyda)
//  Tekshiradi: `.lesson-root` bor, matn bo'sh emas, konsol/sahifa xatosi yo'q; mentor rejimida
//  jonli panel ko'rinadi (PIN yoki mentor tugmalari).
//
//  Ishlatish: CHROME=/usr/bin/google-chrome node scripts/smoke-rejim.mjs [--lang uz|ru] [fayl…]
// ============================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const LANG = opt('--lang', 'uz');
const TARGETS = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--lang');
if (!TARGETS.length) { console.error('fayl kerak'); process.exit(2); }

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', R = '\x1b[0m';
const TMP = mkdtempSync(join(tmpdir(), 'rejim-'));
process.on('exit', () => rmSync(TMP, { recursive: true, force: true }));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));

const SEEDS = {
  self: '{"mode":"self"}',
  mentor: '{"mode":"mentor","pin":"424242","token":"probe-mentor-token"}',
  student: '{"mode":"student","pin":"424242","playerId":"probe-p","playerToken":"probe-t","nickname":"Sinov"}',
  solo: '{"mode":"solo","pin":"424243","playerId":"probe-s","playerToken":"probe-t","attemptId":"probe-a"}',
};

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
let ok = 0, bad = 0;

for (const file of TARGETS) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
  if (!lessonId) { console.log(`${DIM}– ${basename(file)}: lessonId yo'q — o'tkazildi${R}`); continue; }
  let bundle;
  try {
    const res = await build({
      stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
        createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang || 'uz', onFinished: () => {} }));`,
        resolveDir: process.cwd(), sourcefile: 'r.jsx', loader: 'jsx' },
      bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
      loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
      define: { __DARS_API_URL__: '"http://127.0.0.1:9"' }, // server yo'q — so'rovlar jim yiqilishi kerak
      charset: 'utf8', write: false, logLevel: 'silent',
    });
    bundle = res.outputFiles[0].text;
  } catch (e) { bad++; console.log(`${RED}✗${R} ${basename(file)}: esbuild ${String(e.message).split('\n')[0].slice(0, 90)}`); continue; }

  const problems = [];
  for (const [rejim, seed] of Object.entries(SEEDS)) {
    const page = join(TMP, `${basename(file, '.jsx')}-${rejim}.html`);
    writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>window.__lang=${JSON.stringify(LANG)};localStorage.clear();localStorage.setItem('liveSession:${lessonId}',${JSON.stringify(seed)});localStorage.setItem('liveLang',${JSON.stringify(LANG)});<\/script><script>${bundle}<\/script></body></html>`);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 110)));
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(m.text())) errs.push('konsol: ' + m.text().slice(0, 90)); });
    try {
      await p.goto('file://' + page, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('.lesson-root', { timeout: 15000 });
      await p.waitForTimeout(1200);
      const info = await p.evaluate(() => ({
        text: (document.querySelector('.lesson-root')?.innerText || '').trim().length,
        live: !!document.querySelector('.live-bar, .mentor-bar, .lv-bar, [class*="live"], [class*="mentor"]'),
      }));
      if (info.text < 40) problems.push(`${rejim}: matn bo'sh (${info.text} belgi)`);
      if (rejim === 'mentor' && !info.live) problems.push('mentor: jonli panel ko\'rinmadi');
      if (errs.length) problems.push(`${rejim}: ${errs[0]}`);
    } catch (e) { problems.push(`${rejim}: ${String(e.message).split('\n')[0].slice(0, 90)}`); }
    await ctx.close();
  }
  if (problems.length) { bad++; console.log(`${RED}✗${R} ${basename(file, '.jsx')} — ${problems.join(' · ')}`); }
  else { ok++; console.log(`${GRN}✓${R} ${basename(file, '.jsx')} ${DIM}· self · mentor · student · solo${R}`); }
}

await browser.close();
console.log(`\n===== ${ok}/${ok + bad} dars to'rt rejimda toza`);
process.exit(bad ? 1 : 0);
