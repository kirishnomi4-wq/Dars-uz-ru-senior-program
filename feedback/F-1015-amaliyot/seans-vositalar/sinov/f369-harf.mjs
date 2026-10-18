// F-1015-369 · yakuniy savollarda harf qoidasi: [fayl, ekran, yozuv, kutilgan: 'otdi' | 'izoh' | 'yoq']. Chaqirish: node …/f369-harf.mjs <chiqish>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const OUT = process.argv[2];
const T = [
  ['src/3-Modull/ReactCrudPracticeLesson.jsx', [
    ['setGames(games.filter(g => g.id !== id))', 'otdi'], ['setgames(games.filter(g => g.id !== id))', 'izoh'], ['setGames(games.Filter(g => g.id !== id));', 'izoh'], ['<GameCard name="minecraft" />', 'yoq']]],
  ['src/3-Modull/ReactRouterPracticeLesson.jsx', [
    ['<Route path="/add" element={<AddPage />} />', 'otdi'], ["<Route path='/Add' element={<AddPage />} />", 'otdi'], ['<Route path="/ADD" element={<AddPage/>} />', 'otdi'], ['<Route path="/add" element={<addPage />} />', 'izoh']]],
  ['src/3-Modull/ReactProjectDayLesson.jsx', [
    ['b.price * b.days', 'otdi'], ['b.days * b.car.price', 'otdi'], ['b.Price * b.days', 'izoh'], ['b.price + b.days', 'yoq']]],
];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let jami = 0, ok = 0;
for (const [f, cases] of T) {
  const FILE = ROOT + '/' + f; const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/)[1];
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const page = `${OUT}/${f.split('/').pop()}.html`; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  for (const [yozuv, kut] of cases) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
    await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 5, maxReached: 5, answers: {}, earned: [], startedAt: Date.now(), total: 8, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, ID);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForTimeout(900);
    if (!(await p.$('.vsc-input'))) { console.log('❌', f, 'yakuniy ekran 6/8 da emas'); await ctx.close(); continue; }
    await p.fill('.vsc-input', yozuv); await p.waitForTimeout(500);
    const h = await p.evaluate(() => ({ otdi: !!document.querySelector('.frame-success'), izoh: [...document.querySelectorAll('.frame-warn')].some(e => /harfni farqlaydi/.test(e.innerText)) }));
    const natija = h.otdi ? 'otdi' : h.izoh ? 'izoh' : 'yoq';
    jami++; if (natija === kut && !errs.length) ok++;
    console.log(natija === kut ? '✅' : '❌', f.split('/').pop(), JSON.stringify(yozuv), '→', natija, '(kutilgan', kut + ')', errs.length ? 'XATO ' + errs[0] : '');
    await ctx.close();
  }
}
await b.close(); console.log(`${ok}/${jami}`);
