// F-1018-03 · m2-13 RU yurish: 11 ekran — pageerror, [object Object], lotin-o'zbekcha qoldiq. Chaqirish: node feedback/F-1018-pitch/sinov/ru-m213.mjs <chiqish-papka>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PmLesson6.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/ru213', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'pm-m2d13-v2';
const page = OUT + '/ru213.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*|pitch\w*|sayt\w*|do'kon\w*)\b/i;
const out = [];
const DOKON = { nom: 'Лавашная', havola: 'lavash-dokoni.netlify.app' };
const PITCH = { kim: 'Ученики рядом со школой', muammo: 'Узнать цену было трудно', qiladi: 'Показывает цены на телефоне', ishlaydi: 'Похоже на прилавок', soraym: 'Прошу прислать фото' };
for (let i = 0; i < 11; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 10, answers: { 0: { picked: 'a' }, 5: { picked: 0, correct: true } }, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr, dk, pt]) => { for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); localStorage.setItem('ccDokon', JSON.stringify(dk)); localStorage.setItem('pm-m2d13-pitch', JSON.stringify(pt)); }, [ID, prog, DOKON, PITCH]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const act = async (fn) => { try { await fn(); } catch (e) { errs.push('harakat ' + i + ': ' + String(e.message).split('\n')[0].slice(0, 90)); } };
  if (i === 2) await act(async () => { for (const el of await p.$$('.sv-w')) { await el.click().catch(() => {}); await p.waitForTimeout(200); } });
  if (i === 3) await act(async () => { for (let c = 0; c < 3; c++) { const nm = await p.evaluate(() => document.querySelector('.l3-name')?.innerText || ''); for (let k = 0; k < 4; k++) { await p.click(`.l3-opt >> nth=${k}`).catch(() => {}); await p.waitForTimeout(350); if ((await p.evaluate(() => document.querySelector('.l3-name')?.innerText || '')) !== nm) break; } } });
  if (i === 7) await act(async () => { await p.click('.pv-verdicts .chip >> nth=1'); await p.waitForTimeout(300); });
  if (i === 8) await act(async () => { await p.click('.st-card >> nth=0 >> .st-bad'); await p.click('.st-tip-btn'); await p.waitForTimeout(300); });
  if (i === 10) await act(async () => { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); });
  const txt = await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText);
  const qoldiq = txt.split('\n').filter(l => UZ.test(l) && !/[{<]|netlify|Buster!|Talker!|Ear!|Checked!|lavash|^pitch$/i.test(l)   /* 'pitch' — eski dekor-token (1539/1692-qator), F-1018 dan oldin ham bor */);
  out.push(`${String(i + 1).padStart(2, '0')}: err ${errs.length}${errs.length ? ' ' + errs.join('|') : ''} · obj ${txt.includes('[object Object]')} · uz-qoldiq ${qoldiq.length}${qoldiq.length ? ' → ' + qoldiq.slice(0, 3).join(' ‖ ').slice(0, 160) : ''}`);
  await p.screenshot({ path: `${OUT}/ru213/${i}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log(out.join('\n'));
