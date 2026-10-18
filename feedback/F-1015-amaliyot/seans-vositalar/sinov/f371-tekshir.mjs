// F-1015-371/372 · har praktikaning har ekranida: (a) ikki ustunli joyda chap/o'ng birinchi BLOK tepasi farqi (yorliqdan keyingi), (b) «Qadamlar» oynasi ochilib-yopilishi; pageerror.
// Chaqirish: node …/f371-tekshir.mjs <chiqish> <fayl...>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, ...FILES] = process.argv; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let yomon = 0;
for (const f of FILES) {
  const FILE = ROOT + '/' + f; const nom = f.split('/').pop().replace('.jsx', '');
  const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/)[1];
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const page = `${OUT}/${nom}.html`; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  const seed = (ctx, s, t) => ctx.addInitScript(([id, s, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (s >= 0) localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, maxReached: s, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, s, t]);
  let JAMI = 0;
  { const ctx = await b.newContext(); await ctx.route(/^https?:\/\//, (r) => r.abort()); await seed(ctx, -1, 0); const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1100); JAMI = +((await p.evaluate(() => (document.body.innerText.match(/\b\d\d\s*\/\s*(\d\d)\b/) || [])[1])) || 0); await ctx.close(); }
  const qator = [];
  for (let i = 0; i < JAMI; i++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort()); await seed(ctx, i, JAMI);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForTimeout(1000);
    const tekis = await p.evaluate(() => {
      const out = [];
      for (const sp of document.querySelectorAll('.stage-content .split')) {
        const cols = [...sp.children].filter(c => c.classList.contains('col')); if (cols.length !== 2) continue;
        const blok = (c) => { const k = [...c.children].find(x => !x.classList.contains('flow-label') && x.offsetHeight > 0); return k ? Math.round(k.getBoundingClientRect().top) : null; };
        const a = blok(cols[0]), bb = blok(cols[1]);
        const lbl = cols.map(c => c.firstElementChild?.classList.contains('flow-label'));
        if (a != null && bb != null && lbl[0] !== lbl[1]) out.push(Math.abs(a - bb));
      }
      return out;
    });
    let qt = '';
    if (await p.$('.am-qt-btn')) {
      await p.click('.am-qt-btn'); await p.waitForTimeout(450);
      const o = await p.evaluate(() => { const d = document.querySelector('.am-tt-oyna'); return d ? d.querySelectorAll('.am-qadam li').length : 0; });
      await p.keyboard.press('Escape'); await p.waitForTimeout(250);
      const yop = await p.evaluate(() => !document.querySelector('.am-tt-oyna') && /am-qt-btn/.test(document.activeElement?.className || ''));
      qt = o > 0 && yop ? `qadam✓${o}` : `qadam✗(${o},${yop})`; if (!(o > 0 && yop)) yomon++;
    }
    const tk = tekis.length ? 'tekis ' + tekis.join('/') : '';
    if (tekis.some(x => x > 2)) yomon++;
    if (errs.length) yomon++;
    if (tk || qt || errs.length) qator.push(`${i + 1}:${[tk, qt, errs.length ? 'XATO ' + errs[0].slice(0, 60) : ''].filter(Boolean).join(' ')}`);
    await ctx.close();
  }
  console.log(nom.padEnd(32), qator.join(' · '));
}
await b.close(); console.log('yomon:', yomon);
