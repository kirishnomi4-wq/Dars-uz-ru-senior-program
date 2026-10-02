// verify-fixed — darsni LMS CSS (Tailwind) bilan ochadi, ekrandagi qatorlarni bosib «tuzatilgan» holatga yetkazadi
// va o'lchaydi: .is-fixed qator oqimda (static), ota-blokdan chiqmagan, qo'shni qator ustiga tushmagan; ✓ belgi qirqilmagan;
// lesson-root ichida birorta ham `fixed` sinfi qolmagan.   node verify-fixed.mjs <fayl.jsx> <ekran-idx> [...]
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/kali/Desktop/internetLesson';
const HERE = new URL('.', import.meta.url).pathname; // vositalar papkasi (lms-host.css shu yerda)
const SP = process.env.LMS_OUT || '/tmp/lms-tekshir'; // chiqish: bundle, skrinshot
const jobs = []; { const a = process.argv.slice(2); for (let i = 0; i < a.length; i += 2) jobs.push([a[i], Number(a[i + 1])]); }

async function bundle(file) {
  const dir = join(SP, 'vf', basename(file, '.jsx')); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'entry.jsx'), `import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(file))};
const q = new URLSearchParams(location.search);
const s = Number(q.get('s') || 0), id = q.get('id') || '', total = Number(q.get('total') || 0);
try { localStorage.clear(); localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() })); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: q.get('lang') || 'uz' }));
`);
  await esbuild.build({ entryPoints: [join(dir, 'entry.jsx')], bundle: true, outfile: join(dir, 'bundle.js'), format: 'iife', platform: 'browser', target: 'es2020',
    jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
    loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.gif': 'dataurl', '.webp': 'dataurl', '.mp3': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.MODE': '"production"', 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true', '__DARS_API_URL__': '""' },
    absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')] });
  copyFileSync(join(HERE, 'lms-host.css'), join(dir, 'host.css'));
  writeFileSync(join(dir, 'index.html'), `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="host.css"></head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  return join(dir, 'index.html');
}

// sahifa ichida: bosiladigan nomzodlar (navigatsiyasiz) — qatorlar + tugmalar
const PICK = () => {
  const root = document.querySelector('.lesson-root') || document.body;
  const bad = (el) => el.closest('nav,.nav,.stage-nav,.ach-counter,.zoom-btn,.live-badge,footer') || /orqaga|keyingi dars|davom etish|назад|продолж|qaytadan|заново|yakunla/i.test(el.innerText || '');
  const rows = [...root.querySelectorAll('.dbg-line,.sxm-row,.tbl-row,.ev-row,.vsc-line,button:not([disabled]),[role=button]')]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 8 && r.height > 8 && !bad(el); });
  return rows;
};
const PROBE = () => {
  const root = document.querySelector('.lesson-root') || document.body;
  const stray = [...root.querySelectorAll('*')].filter(e => e.classList && e.classList.contains('fixed')).map(e => e.className);
  const out = [];
  for (const el of root.querySelectorAll('.is-fixed')) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const par = el.parentElement.getBoundingClientRect();
    const sib = [...el.parentElement.children].filter(x => x !== el).map(x => x.getBoundingClientRect());
    const overlap = sib.some(b => b.height > 4 && Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top) > 3 && Math.min(r.right, b.right) - Math.max(r.left, b.left) > 3);
    const badge = el.querySelector('.dbg-badge');
    const box = el.closest('.dbg-code');
    let badgeCut = null;
    if (badge && box) { const b = badge.getBoundingClientRect(), c = box.getBoundingClientRect(); badgeCut = b.right > c.right + 1 || b.width < 8; }
    out.push({ cls: el.className.trim().slice(0, 40), pos: cs.position, w: Math.round(r.width), parW: Math.round(par.width), outX: Math.round(Math.max(0, r.right - par.right, par.left - r.left)), overlap, badge: badge ? badge.textContent : null, badgeCut });
  }
  return { stray, fixed: out };
};

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const res = [];
for (const [file, s] of jobs) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
  const total = ((/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '').split('\n').filter(l => /\{\s*id\s*:/.test(l)).length;
  const html = await bundle(file);
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await ctx.route(/^https?:\/\//, r => r.abort());
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message.slice(0, 100)));
  await page.goto(pathToFileURL(html).href + `?s=${s}&id=${encodeURIComponent(lessonId)}&total=${total}&lang=${process.env.LANG_ || "uz"}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 15000 }); await page.waitForTimeout(1200);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /tkazib yuborish/.test(x.innerText)); if (b) b.click(); });
  await page.waitForTimeout(400);
  let found = null, clicks = 0, strayEver = [];
  for (let round = 0; round < 5 && !found; round++) {
    const n = await page.evaluate(`(${PICK})().length`);
    for (let i = 0; i < n && !found; i++) {
      const ok = await page.evaluate(`(() => { const r = (${PICK})(); const el = r[${i}]; if (!el) return false; el.setAttribute('data-vf','1'); el.click(); return true; })()`);
      if (!ok) break; clicks++;
      await page.waitForTimeout(260);
      const p = await page.evaluate(`(${PROBE})()`);
      if (p.stray.length) strayEver.push(...p.stray);
      if (p.fixed.length) { await page.waitForTimeout(900); found = await page.evaluate(`(${PROBE})()`); }
    }
  }
  await page.screenshot({ path: join(SP, 'vf', `${basename(file, '.jsx')}-s${s}.png`) });
  await ctx.close();
  const f = found ? found.fixed : [];
  const okAll = found && f.every(x => x.pos === 'static' && x.outX <= 1 && !x.overlap && x.badgeCut !== true) && !strayEver.length && !errs.length;
  res.push({ file: basename(file), s, reached: !!found, ok: !!okAll, clicks, rows: f, stray: [...new Set(strayEver)], errs });
  console.log(`${okAll ? 'OK  ' : (found ? 'XATO' : 'YETMADI')}  ${basename(file)} idx${s}  bosish=${clicks}  ${f.map(x => `[${x.cls}] pos=${x.pos} w=${x.w}/${x.parW} chiqish=${x.outX} ustma=${x.overlap}${x.badge != null ? ` belgi=«${x.badge}» qirqilgan=${x.badgeCut}` : ''}`).join(' ; ')}${errs.length ? ' ERR ' + errs.join('|') : ''}`);
}
await browser.close();
writeFileSync(join(SP, 'vf', 'natija.json'), JSON.stringify(res, null, 1));
