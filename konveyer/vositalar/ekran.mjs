// ekran — bitta darsni bir marta yig'ib, tanlangan ekranlarni (bosishlar bilan) suratga oladi (6-Modul pilotida yozilgan, 04.10 konveyerga).
//   node konveyer/vositalar/ekran.mjs <fayl.jsx> <chiqish-papka> "<idx>[:sel|sel*N|text=Matn]" …   (env: W, H, SHOT_LANG)
//   Masalan: W=393 H=852 node konveyer/vositalar/ekran.mjs src/6-Modull/X.jsx $S/x 3 "3:.q-variant*2"
//   Hamma ekranni ketma-ket olish uchun — shots.mjs (CLICK, EVAL, FULL imkoniyatlari bilan).
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
const PROJ = '/home/kali/Desktop/internetLesson';
const req = createRequire(PROJ + '/package.json');
const { build } = req('esbuild');
const { chromium } = req('playwright-core');
process.chdir(PROJ);
const [target, OUT, ...specs] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const metaBlock = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src);
const total = (metaBlock[1].match(/\{\s*id:/g) || []).length;
const res = await build({
  stdin: { contents: `import React from 'react';import { createRoot } from 'react-dom/client';import Lesson from ${JSON.stringify(resolve(target))};
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: ${JSON.stringify(process.env.SHOT_LANG || 'uz')} }));`,
    resolveDir: PROJ, sourcefile: 'e.jsx', loader: 'jsx' },
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});
const html = join(OUT, '_p-' + basename(target, '.jsx') + (process.env.W||'') + '.html');
writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const W = Number(process.env.W || 1280), H = Number(process.env.H || 773);
for (const spec of specs) {
  const [idxS, clicks = ''] = spec.split(':');
  const idx = Number(idxS);
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  await ctx.addInitScript(([lid, s, t]) => {
    localStorage.setItem('liveSession:' + lid, '{"mode":"self"}');
    localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() }));
  }, [lessonId, idx, total]);
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
  await pg.goto('file://' + html, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => errs.push('no root'));
  await pg.waitForTimeout(900);
  const gate = pg.getByText(/Kodsiz, o'zim ko'raman|Без кода/).first();
  if (await gate.isVisible().catch(() => false)) { await gate.click(); await pg.waitForTimeout(900); }
  for (const sel of clicks.split('|').filter(Boolean)) {
    const n = /\*(\d+)$/.exec(sel); const s = sel.replace(/\*\d+$/, '');
    for (let k = 0; k < (n ? +n[1] : 1); k++) {
      try { await pg.locator(s).first().click({ timeout: 3000 }); await pg.waitForTimeout(500); } catch { errs.push('click? ' + s); break; }
    }
  }
  await pg.waitForTimeout(400);
  await pg.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running' || a.effect?.getTiming?.().iterations === Infinity), null, { timeout: 5000 }).catch(() => {});
  const f = join(OUT, `${basename(target, '.jsx')}-s${String(idx + 1).padStart(2, '0')}${clicks ? '-c' : ''}${W < 600 ? '-mob' : ''}.png`);
  await pg.screenshot({ path: f });
  const info = await pg.evaluate(() => {
    const t = document.querySelector('.h-title, h1, h2'); return (t?.innerText || '').slice(0, 90).replace(/\n/g, ' / ');
  });
  console.log(basename(f), '|', info, errs.length ? '| ERR ' + errs.join('; ') : '');
  await ctx.close();
}
await browser.close();
