// F-1017-225 · tuzatishdan KEYIN: yakun ekranida (1) solo: «Yakunlash» → «Yakunlandi ✓» + xabar, onFinished 1 marta;
// (2) mentor-rejim, tarmoq yo'q: CODE STRIKE → xabar + mashq arenasi; (3) o'quvchi-rejim, arena yopiq: tugma xira, o'zgarmagan.
// node feedback/F-1017-mentor-2-6M/vositalar/yakun-sinov-225.mjs <OUT> <fayl> [yakun-ekran-idx] [jami-ekran]
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, f, IDXA, TOTALA] = process.argv;
mkdirSync(OUT, { recursive: true });
const FILE = ROOT + '/' + f;
const src = readFileSync(FILE, 'utf8');
const id = (src.match(/lessonId:\s*['"]([^'"]+)['"]/) || [])[1];
// yakun ekrani = screens ro'yxatining oxirgisi
const scr = (src.match(/const screens = \[([^\]]*)\]/) || [])[1];
const TOTAL = TOTALA ? +TOTALA : (scr ? scr.split(',').filter(x => x.trim()).length : 0);
const IDX = IDXA ? +IDXA : TOTAL - 1;
const nom = f.split('/').pop().replace('.jsx', '');
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
window.__fin = []; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => window.__fin.push(p && p.lessonId) }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl', '.mp4': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'error' });
const page = `${OUT}/${nom}-yakun.html`;
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const open = async (session) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript(([id, i, t, session]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify(session)); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: i, total: t, answers: {}, earned: [], startedAt: Date.now(), savedAt: Date.now() })); for (const r of ['mentor', 'learner', 'student', 'self']) localStorage.setItem('inetOnboarded_' + r, '1'); }, [id, IDX, TOTAL, session]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForTimeout(1500); return p;
};
const snap = (p) => p.evaluate(() => { const t = document.querySelector('[data-live="toast"]'); const fb = document.querySelector('[data-live^="finish"]'); const cap = document.querySelector('.cs-cap'); return { finBtn: fb ? fb.textContent.trim() + (fb.disabled ? ' [o\'chiq]' : '') : null, finState: fb ? fb.dataset.live : null, toast: t && t.style.opacity === '1' ? t.textContent : null, arena: !!document.querySelector('.qz-arena, .qa-root, [class*="arena"]'), arenaTitle: (document.querySelector('.qz-arena h1, .qz-arena h2, .qa-root h1, .qa-root h2, [class*="arena"] h2') || {}).textContent || null, csDisabled: cap ? cap.className.includes('disabled') || cap.getAttribute('aria-disabled') === 'true' : null, fin: window.__fin.length }; });
const out = { nom, id, IDX, TOTAL };
// 1) solo
let p = await open({ mode: 'self' });
out.solo0 = await snap(p);
let fbtn = p.locator('[data-live="finish"]').first();
// InternetLesson: yakun tugmasi «🎉 Darsni yakunlash» kartasi ichida («Tamom») — avval karta ochiladi
if (!(await fbtn.count())) { const dy = p.locator('button', { hasText: 'Darsni yakunlash' }).first(); if (await dy.count()) { await dy.click({ timeout: 3000 }); await p.waitForTimeout(700); fbtn = p.locator('[data-live="finish"]').first(); } }
if (await fbtn.count()) { await fbtn.click({ timeout: 4000 }); await p.waitForTimeout(600); await fbtn.click({ timeout: 2000, force: true }).catch(() => {}); await p.waitForTimeout(400); }
out.solo1 = await snap(p); await p.screenshot({ path: `${OUT}/${nom}-1-solo-yakunlash.png` });
// 2) mentor, tarmoq yo'q → CODE STRIKE
p = await open({ mode: 'mentor', pin: '483920', token: 'x' });
out.mentor0 = await snap(p);
const cap = p.locator('.cs-cap').first();
if (await cap.count()) { await cap.click({ timeout: 4000 }); await p.waitForTimeout(1800); }
out.mentor1 = await snap(p); await p.screenshot({ path: `${OUT}/${nom}-2-mentor-codestrike.png` });
// 3) o'quvchi, arena yopiq
p = await open({ mode: 'student', pin: '483920', playerId: 1, playerToken: 'y', nickname: 'Ali', lastScreen: IDX, maxScreen: IDX });
out.student0 = await snap(p);
const cap2 = p.locator('.cs-cap').first();
if (await cap2.count()) { await cap2.click({ timeout: 2000, force: true }).catch(() => {}); await p.waitForTimeout(800); }
out.student1 = await snap(p); await p.screenshot({ path: `${OUT}/${nom}-3-student.png` });
if (errs.length) out.pageerror = [...new Set(errs)];
console.log(JSON.stringify(out, null, 1));
await b.close();
