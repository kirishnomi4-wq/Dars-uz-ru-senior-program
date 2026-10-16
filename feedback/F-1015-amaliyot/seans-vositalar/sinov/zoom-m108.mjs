// F-1015-321/323 · ⛶ oynasi (s0, s1, a3) va test eni — 1920×960 surat + o'lchov
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', OUT = process.argv[2]; mkdirSync(OUT + '/zoom', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(ROOT + '/src/1-Modull/HtmlPractice.jsx')};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/zoom.html'; const ID = 'html-practice-portfolio-v2';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [i, nom] of [[0, 's0'], [1, 's1'], [4, 'a3'], [5, 's5']]) {
  const ctx = await b.newContext({ viewport: { width: 1920, height: 960 } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, i]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); localStorage.setItem('ccPortfolio', JSON.stringify({ rang: "ko'k" })); }, [ID, i]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1200);
  if (nom === 's5') {
    const w = await p.evaluate(() => Math.round(document.querySelector('.q-test-v').getBoundingClientRect().width));
    await p.click('.q-test-v >> nth=3'); await p.waitForTimeout(400);
    console.log(`s5: variant eni ${w}px · bosildi: ${(await p.innerText('.stage-content')).includes('topmasa, joyida qoladi')} · err ${errs.length}`);
    await p.screenshot({ path: `${OUT}/zoom/${nom}.png` }); await ctx.close(); continue;
  }
  await p.click('.zoom-btn >> nth=0'); await p.waitForTimeout(600);
  const m = await p.evaluate(() => { const z = document.querySelector('.zoom-on'); const bd = z.querySelector('.pf-body'); return { w: Math.round(z.getBoundingClientRect().width), h: Math.round(z.getBoundingClientRect().height), zSkrol: z.scrollHeight > z.clientHeight + 1, bodySkrol: bd ? bd.scrollHeight > bd.clientHeight + 1 : null, footer: !!z.querySelector('[data-pf="footer"]') }; });
  console.log(`${nom}: oyna ${m.w}×${m.h} · oyna skroli ${m.zSkrol} · sayt skroli ${m.bodySkrol} · footer ${m.footer} · err ${errs.length}`);
  await p.screenshot({ path: `${OUT}/zoom/${nom}.png` }); await ctx.close();
}
await b.close();
