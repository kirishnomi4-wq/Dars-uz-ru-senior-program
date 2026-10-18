// F-1015-370 · «Avval tayyorlaning» oynasi — har praktikada: tugmani topadi, bosadi → oyna markazda, qoplama butun ekranda, Esc yopadi, fokus qaytadi, pageerror 0; surat.
// Chaqirish: node …/f370-oyna.mjs <chiqish> <fayl...>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, ...FILES] = process.argv; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let ok = 0;
for (const f of FILES) {
  const FILE = ROOT + '/' + f; const nom = f.split('/').pop().replace('.jsx', '');
  const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/)[1];
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const page = `${OUT}/${nom}.html`; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  const seed = async (ctx, s, t) => ctx.addInitScript(([id, s, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); if (s >= 0) localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, maxReached: s, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, s, t]);
  let JAMI = 0;
  { const ctx = await b.newContext(); await ctx.route(/^https?:\/\//, (r) => r.abort()); await seed(ctx, -1, 0); const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1100);
    JAMI = +((await p.evaluate(() => (document.body.innerText.match(/\b\d\d\s*\/\s*(\d\d)\b/) || [])[1])) || 0); await ctx.close(); }
  let natija = null;
  for (let i = 0; i < JAMI && !natija; i++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort()); await seed(ctx, i, JAMI);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForTimeout(1100);
    if (await p.$('.am-tt-btn')) {
      await p.click('.am-tt-btn'); await p.waitForTimeout(500);
      const o = await p.evaluate(() => { const d = document.querySelector('.am-tt-oyna'), bd = document.querySelector('.zoom-backdrop'); if (!d) return null; const r = d.getBoundingClientRect(), q = bd.getBoundingClientRect(); return { markaz: Math.abs((r.left + r.right) / 2 - innerWidth / 2) < 30 && Math.abs((r.top + r.bottom) / 2 - innerHeight / 2) < 60, qoplama: q.width >= innerWidth - 2 && q.height >= innerHeight - 2, qadam: d.querySelectorAll('.am-tayyor-l li').length, fokus: document.activeElement?.className }; });
      await p.screenshot({ path: `${OUT}/${nom}.png` });
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
      const yop = await p.evaluate(() => ({ yopildi: !document.querySelector('.am-tt-oyna'), fokus: document.activeElement?.className }));
      natija = { ekran: i + 1, ...o, ...yop, errs: errs.length };
      const tugri = o && o.markaz && o.qoplama && o.qadam > 0 && /am-tt-yop/.test(o.fokus) && yop.yopildi && /am-tt-btn/.test(yop.fokus) && !errs.length;
      if (tugri) ok++;
      console.log(tugri ? '✅' : '❌', nom, JSON.stringify(natija));
    }
    await ctx.close();
  }
  if (!natija) console.log('❌', nom, 'tugma topilmadi', JAMI);
}
await b.close(); console.log(`${ok}/${FILES.length}`);
