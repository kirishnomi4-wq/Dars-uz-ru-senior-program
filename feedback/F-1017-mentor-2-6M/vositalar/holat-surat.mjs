// F-1017-202 · bitta ekranda tugma bosib, chipni oddiy va tanlangan holatda suratga oladi. node … <OUT> <fayl> <ekran-index> <bosiladigan tugma matni|-> <selektor> <nom>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, f, IDX, BTN, SEL, NOM] = process.argv;
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
if (BTN !== '-') { await p.locator('button:not([disabled])', { hasText: BTN }).first().click({ timeout: 5000 }).catch(async e => { await p.screenshot({ path: OUT + '/xato.png' }); console.log('KLIK', String(e.message).split('\n').slice(0,6).join(' ')); process.exit(1); }); await p.waitForTimeout(1700); }
const c = p.locator(SEL).first();
const info = async () => c.evaluate(el => { const cs = getComputedStyle(el); return { bg: cs.backgroundImage.slice(0, 50), col: cs.color, sh: cs.boxShadow.slice(0, 60) }; });
await c.scrollIntoViewIfNeeded(); await p.mouse.move(5, 5); await p.waitForTimeout(400);
console.log(NOM, 'oddiy', JSON.stringify(await info())); await p.screenshot({ path: `${OUT}/${NOM}.png` });
await c.click(); await p.mouse.move(5, 5); await p.waitForTimeout(400);
console.log(NOM, 'tanlangan', JSON.stringify(await info())); await p.screenshot({ path: `${OUT}/${NOM}-tanlangan.png` });
if (errs.length) console.log('pageerror:', errs.join(' | '));
await b.close();
