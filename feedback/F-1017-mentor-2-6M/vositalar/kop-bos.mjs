// F-1017-204 · bitta ekranda bir nechta tugmani ketma-ket bosib suratga oladi. node … <OUT> <fayl> <ekran> <nom> <tugma1> [tugma2…]   (TOTAL env)
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, f, IDX, NOM, ...BTNS] = process.argv;
const FILE = ROOT + '/' + f;
const id = (readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/) || [])[1];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl', '.mp4': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = `${OUT}/${NOM}.html`;
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
await ctx.addInitScript(([id, i, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: i, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [id, +IDX, +(process.env.TOTAL || 30)]);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
await p.goto('file://' + page); await p.waitForTimeout(1200);
if (process.env.FILL) { await p.locator('textarea, input:not([type]), input[type="text"]').first().fill(process.env.FILL); await p.waitForTimeout(500); }
for (const t of BTNS) { await p.locator('button:not([disabled])', { hasText: t }).first().click({ timeout: 5000 }); await p.waitForTimeout(500); }
await p.mouse.move(5, 5); await p.waitForTimeout(+(process.env.WAIT || 600)); await p.screenshot({ path: `${OUT}/${NOM}.png` });
console.log(NOM, 'ok', errs.length ? 'pageerror: ' + errs.join(' | ') : '');
await b.close();
