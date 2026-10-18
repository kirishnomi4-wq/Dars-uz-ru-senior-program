// F-1017-225 · Yakun ekranida CODE STRIKE va «Yakunlash ✓» solo (self) rejimda nima qiladi — dalil.
// node feedback/F-1017-mentor-2-6M/vositalar/yakun-sinov.mjs <OUT> <fayl> <yakun-ekran-idx> <jami-ekran>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, f, IDX, TOTAL] = process.argv;
const FILE = ROOT + '/' + f;
const id = (readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/) || [])[1];
const nom = f.split('/').pop().replace('.jsx', '');
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
window.__fin = []; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => window.__fin.push(p && p.lessonId) }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl', '.mp4': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'error' });
const page = `${OUT}/${nom}-yakun.html`;
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
await ctx.addInitScript(([id, i, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: i, total: t, answers: {}, earned: [], startedAt: Date.now(), savedAt: Date.now() })); for (const r of ['mentor', 'learner', 'student', 'self']) localStorage.setItem('inetOnboarded_' + r, '1'); }, [id, +IDX, +TOTAL]);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
await p.goto('file://' + page); await p.waitForTimeout(1500);
const snap = async () => p.evaluate(() => ({ cap: [...document.querySelectorAll('.cs-cap')].map(c => c.className), arena: !!document.querySelector('.qz-arena, .qa-root, .arena, [class*="arena"]'), text: document.body.innerText.slice(0, 80).replace(/\n/g, ' '), fin: window.__fin.length }));
console.log('0 boshlang\'ich:', JSON.stringify(await snap()));
await p.screenshot({ path: `${OUT}/${nom}-0-yakun.png` });
// 1) CODE STRIKE bannerini bosish
const cap = p.locator('.cs-cap').first();
if (await cap.count()) { await cap.click({ timeout: 4000 }); await p.waitForTimeout(1800); }
console.log('1 CODE STRIKE bosildi:', JSON.stringify(await snap()));
await p.screenshot({ path: `${OUT}/${nom}-1-codestrike.png` });
// 2) yangi varaq — «Yakunlash ✓»
const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
await p2.goto('file://' + page); await p2.waitForTimeout(1500);
const before = await p2.evaluate(() => document.body.innerText.length);
await p2.locator('button', { hasText: 'Yakunlash' }).first().click({ timeout: 4000 }); await p2.waitForTimeout(1500);
const after = await p2.evaluate(() => ({ len: document.body.innerText.length, fin: window.__fin, prog: localStorage.getItem('ccProgress:' + (document.body.dataset.x || '')) }));
console.log('2 Yakunlash bosildi: matn uzunligi', before, '→', after.len, '| onFinished chaqirildi:', JSON.stringify(after.fin));
await p2.screenshot({ path: `${OUT}/${nom}-2-yakunlash.png` });
if (errs.length) console.log('pageerror:', [...new Set(errs)].join(' | '));
await b.close();
