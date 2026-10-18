// F-1015-361 · .dd-chip gradient — har darsda birinchi sudrash ekranini topib suratga oladi (pageerror ham). Chaqirish: node …/f361-dd-surat.mjs <chiqish-papka> <fayl...>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, ...FILES] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const f of FILES) {
  const FILE = ROOT + '/' + f; const nom = f.split('/').pop().replace('.jsx', '');
  const id = (readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/) || [])[1];
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl', '.mp4': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const page = `${OUT}/${nom}.html`;
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  let topildi = -1, errs = [];
  let JAMI = 0;
  { const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
    await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, id);
    const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1200);
    JAMI = +((await p.evaluate(() => (document.body.innerText.match(/\b\d\d\s*\/\s*(\d\d)\b/) || [])[1])) || 0); await ctx.close(); }
  for (let i = 1; i < JAMI && topildi < 0; i++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
    await ctx.route(/^https?:\/\//, (r) => r.abort());
    await ctx.addInitScript(([id, i, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: i, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [id, i, JAMI]);
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    await p.goto('file://' + page); await p.waitForTimeout(1100);
    const bor = await p.evaluate(() => { const c = [...document.querySelectorAll('.dd-chip')].find(x => x.offsetParent); if (!c) return null; c.scrollIntoView({ block: 'center' }); const cs = getComputedStyle(c); return { bg: cs.backgroundImage.slice(0, 40), col: cs.color, w: c.scrollWidth > c.clientWidth + 2 }; });
    const raqam = await p.evaluate(() => (document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/) || [])[0] || '?');
    if (bor) { topildi = i; await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}/${nom}.png` }); console.log(nom, 'ekran', raqam, JSON.stringify(bor)); }
    await ctx.close();
  }
  if (topildi < 0) console.log(nom, 'jami', JAMI, 'dd-chip ekrani topilmadi (holatga bog\'liq bo\'lishi mumkin)');
  if (errs.length) console.log(nom, 'pageerror:', [...new Set(errs)].join(' | '));
}
await b.close();
