// F-1018-01 · m1-12 RU yurish: 9 ekran — pageerror, [object Object], lotin-o'zbekcha qoldiq. Chaqirish: node feedback/F-1018-pitch/sinov/ru-m112.mjs <chiqish-papka>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/PmLesson3.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/ru', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'pm-pitch-03-v20';
const page = OUT + '/ru.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|Davom|Saqlash|Tahrirlash|Keyingi|haqida|ustoz\w*|nutq\w*|sayt\w*)\b/i;
const out = [];
const PITCH = { kind: 'shop', who: 'Мои одноклассники', pain: 'не находили книгу', help: 'находит книгу в одном месте', muammo: 'Мои одноклассники не находили книгу. Мой сайт находит книгу в одном месте.', ilgak: 'Вы искали книгу?', yechim: 'Мой сайт находит книгу.', demo: 'Открываю сайт.', qildim: 'Разделы придумал сам.', keyin: 'Выучу JavaScript.', link: 'kitob.netlify.app' };
for (let i = 0; i < 10; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const prog = { screen: i, maxReached: 9, answers: { 0: { picked: 'b' }, 4: { picked: 2, correct: true } }, earned: [], startedAt: Date.now(), total: 10, savedAt: Date.now() };
  await ctx.addInitScript(([id, pr, pitch]) => { for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify(pr)); localStorage.setItem('ccPitch3', JSON.stringify(pitch)); }, [ID, prog, PITCH]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  if (i === 0) { try { await p.evaluate(() => [...document.querySelectorAll('.chip')].forEach(c => c.click())); await p.waitForTimeout(500); /* javob seed'da (picked b) — variant qulf */ await p.waitForTimeout(400); } catch (e) { errs.push('harakat ' + 0 + ': ' + String(e.message).split('\n')[0].slice(0, 90)); } }
  if (i === 2) { await p.click('.kind-card >> nth=0'); await p.waitForTimeout(300); for (let k = 0; k < 3; k++) { await p.click(`.pf-row >> nth=${k} >> .pf-chip >> nth=0`); await p.waitForTimeout(250); } }
  if (i === 3) { try { await p.click('.one-tab >> nth=0'); for (let k = 0; k < 3; k++) await p.click(`.dstep >> nth=${k}`); await p.waitForTimeout(400); } catch (e) { errs.push('harakat ' + 3 + ': ' + String(e.message).split('\n')[0].slice(0, 90)); } }
  if (i === 6) { await p.click('.qa-tip-btn >> nth=0'); await p.click('.qa-said >> nth=0'); await p.waitForTimeout(300); }
  if (i === 7) { try { await p.click('.sayt-card >> nth=0 >> .sayt-bad'); await p.click('.qa-tip-btn'); await p.waitForTimeout(300); } catch (e) { errs.push('harakat 7: ' + String(e.message).split('\n')[0].slice(0, 90)); } }
  if (i === 9) { try { await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(800); } catch (e) { errs.push('harakat ' + 8 + ': ' + String(e.message).split('\n')[0].slice(0, 90)); } }
  const txt = await p.evaluate(() => (document.querySelector('.stage-content') || document.body).innerText);
  const qoldiq = txt.split('\n').filter(l => UZ.test(l) && !/[{<]|netlify|YouTube|Telegram|Taksi|Bozor|Ready!|Finder!|Level Up!/.test(l));
  out.push(`${String(i + 1).padStart(2, '0')}: err ${errs.length}${errs.length ? ' ' + errs.join('|') : ''} · obj ${txt.includes('[object Object]')} · uz-qoldiq ${qoldiq.length}${qoldiq.length ? ' → ' + qoldiq.slice(0, 3).join(' ‖ ').slice(0, 160) : ''}`);
  await p.screenshot({ path: `${OUT}/ru/${i}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log(out.join('\n'));
