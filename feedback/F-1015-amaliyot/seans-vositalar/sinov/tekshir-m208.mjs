// F-1015-332 · m2-08 PracticeLesson1 sinovi (9 ekran): eski progress · jonli sayt namunasi (rejim, like, tabrik, 3 vosita) · Screen15 (F-1016-01) · nishonlar · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m208.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson1.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-01-jonlantirish-v18';
const page = OUT + '/sinov-m208.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = [];
const promptMatn = async (p) => { if (await p.$('.pk-kor')) { await p.click('.pk-kor'); await p.waitForTimeout(350); const t = await p.innerText('.am-tt-oyna .am-masalan'); await p.keyboard.press('Escape'); await p.waitForTimeout(250); return t; } return p.innerText('.am-masalan'); }; // F-1015-385: doimiy prompt — oynada
const ok = (nom, shart, izoh = '') => { natija.push(`${shart ? '✅' : '❌'} ${nom}${izoh ? ' — ' + izoh : ''}`); };
async function och(seed, w = 1280, h = 820) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__ok')) { localStorage.clear(); sessionStorage.setItem('__ok', '1'); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); } for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, seed);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
  return { p, ctx, errs };
}
const raqam = (p) => p.evaluate(() => { const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/); return m ? `${m[1]}/${m[2]}` : '?'; });
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }), ccDemoDay: JSON.stringify({ uslub: 'yorqin', css: { nom: 'Sport vaqti', saqlangan: true } }) };
const nx = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); return b ? b.innerText.trim() : '-'; });
const bayram = async (p) => { await p.waitForTimeout(600); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300); };
const surat = (p, n) => p.screenshot({ path: `${OUT}/shots/${n}.png` });
const dsCls = (p) => p.evaluate(() => [...document.querySelectorAll('.js-sayt')].pop()?.className || '');
const kontrast = (p) => p.evaluate(() => {
  const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
  const bgOf = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const out = [];
  for (const el of document.querySelectorAll('.am-masalan, .am-osti, .am-qadam li, .am-tayyor-l li, .am-uslub-btn b, .am-uslub-btn span, .am-nusxa, .am-blok-teg, .js-btn, .js-son, .js-tabrik, .js-salom, .js-xato, .js-ok, .js-menyu span, .ds-h1, .ds-p, .ds-tag, .ds-tugma, .ds-nav, .ds-ft, .flow-label, .am-qt-btn')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});

// 1) ESKI PROGRESS (19 ekran)
{
  const old = { screen: 15, maxReached: 18, answers: { 4: { correct: true, picked: 1 } }, earned: ['spark'], startedAt: Date.now() - 600000, total: 19, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 19, screen 15) → 01/09', (await raqam(p)) === '01/09', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  for (let i = 0; i < 3; i++) { await p.click('.site-like'); await p.waitForTimeout(200); }
  await p.waitForTimeout(400); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(400);
  await nx(p); await p.waitForTimeout(700);
  ok('s0 → reja (02/09)', (await raqam(p)) === '02/09', await raqam(p));
  const rj = await p.innerText('.stage-content');
  ok("reja: «Avval tayyorlaning» yopiq tugma, nafas oladi (F-1015-334)", await p.evaluate(() => !!document.querySelector('.am-tt.am-tt-nafas') && !document.querySelector('.am-tayyor-l') && getComputedStyle(document.querySelector('.am-tt')).opacity === '1'));
  await p.click('.am-tt-btn'); await p.waitForTimeout(400);
  const rj2 = await p.innerText('.am-tt-oyna'); // F-1015-370: qadamlar oynada
  ok('reja: bosilsa 3 qadam (Copilot o\'rnatish bilan), nafas to\'xtaydi · 3 blok', rj.includes('JavaScript') && rj2.includes('GitHub Copilot') && await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-tayyor-l li').length === 3 && !document.querySelector('.am-tt-nafas') && document.querySelectorAll('.am-blok-ro li').length === 3)); await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok('a1 ochildi (03/09)', (await raqam(p)) === '03/09', await raqam(p));
  const pm1 = await promptMatn(p);
  ok('a1: prompt — tungi rejim, script.js, .tungi', pm1.includes('tungi rejim tugmasini') && pm1.includes('script.js') && pm1.includes('.tungi'));
  const c0 = await dsCls(p); await p.click('.js-sayt .js-btn:has-text("Tungi rejim")'); await p.waitForTimeout(300); const c1 = await dsCls(p);
  await p.click('.js-sayt .js-btn:has-text("Kunduzgi rejim")'); await p.waitForTimeout(300); const c2 = await dsCls(p);
  ok('a1: namunada tungi rejim ishlaydi (yorqin → qorongi → yorqin)', c0.includes('ds-yorqin') && c1.includes('ds-qorongi') && c2.includes('ds-yorqin'), `${c0} | ${c1} | ${c2}`);
  ok('a1: qadamlar tugmada yopiq', await p.evaluate(() => !!document.querySelector('.am-qt') && !document.querySelector('.am-qt .am-qadam')));
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a1: tugma bosilsa 3 qadam', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 3)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  // a2
  ok('a2 ochildi (04/09) · mentor — Copilot', (await raqam(p)) === '04/09' && (await p.innerText('.stage-content')).includes("Copilot'ga yozasiz"), await raqam(p));
  ok('a2: 2 ta nusxa bloki + 3 qadam', await p.evaluate(() => document.querySelectorAll('.am-kod').length === 2 && document.querySelectorAll('.am-qadam li').length === 3));
  await p.click('.am-kod >> nth=1 >> button.am-nusxa'); await p.waitForTimeout(250);
  ok('a2: izoh nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())) === '// like tugmasi bosilsa son 1 ga oshsin');
  for (let i = 0; i < 3; i++) { await p.click('.js-sayt .js-like'); await p.waitForTimeout(120); }
  ok('a2: namunada like — son 3', (await p.innerText('.js-son')) === '3');
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  // a3
  ok("a3 ochildi (05/09) — AI'siz", (await raqam(p)) === '05/09' && (await p.innerText('.stage-content')).includes("o'zingiz"), await raqam(p));
  for (let i = 0; i < 9; i++) await p.click('.js-sayt .js-like');
  ok("a3: 9 da tabrik yo'q", !(await p.$('.js-tabrik')));
  await p.click('.js-sayt .js-like'); await p.waitForTimeout(400);
  ok('a3: 10 da «Rahmat! 10 like»', (await p.innerText('.js-tabrik')) === 'Rahmat! 10 like');
  await kk('a3'); await surat(p, '1280-04-a3'); await nx(p); await bayram(p);
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon', cnt === '3', `hisoblagich ${cnt}`);
  // s15 (F-1016-01)
  ok('s15 «Oxirgi sinov» (06/09)', (await raqam(p)) === '06/09' && (await p.innerText('.stage-content')).includes('Oxirgi sinov'), await raqam(p));
  await p.click('button.chip >> nth=1'); await p.waitForTimeout(200); await p.click('button.chip >> nth=3'); await p.waitForTimeout(300); // hover + rang (xato)
  ok("s15: hover + rang — tugma qulfsiz, «Mukammal!» yo'q (mentor tuzatishi)", await p.evaluate(() => { const b = [...document.querySelectorAll('button.site-btn')].pop(); return !!b && !b.disabled && !document.body.innerText.includes('Mukammal!'); }));
  await p.click('button.chip >> nth=0'); await p.waitForTimeout(500);
  ok("s15: bosish + rang — «Mukammal!», «Davom etish» ochiq", await p.evaluate(() => document.body.innerText.includes('Mukammal!') && ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await surat(p, '1280-05-s15'); await nx(p); await p.waitForTimeout(700);
  // a4
  ok('a4 ochildi (07/09), prompt yopiq', (await raqam(p)) === '07/09' && !(await p.$('.am-masalan')), await raqam(p));
  await p.click('.am-uslub-btn >> nth=0'); await p.waitForTimeout(400);
  await p.click('.js-menyu-btn'); await p.waitForTimeout(300);
  ok('a4: menyu — bosilsa ochiladi', await p.evaluate(() => document.querySelectorAll('.js-menyu span').length === 4));
  await p.click('.js-menyu-btn'); await p.waitForTimeout(300);
  ok('a4: menyu — yana bosilsa yopiladi', !(await p.$('.js-menyu')));
  await p.click('.am-uslub-btn >> nth=1'); await p.waitForTimeout(400);
  await p.fill('.js-sayt .js-input', 'Ali'); await p.waitForTimeout(200);
  ok('a4: jonli salom — «Salom, Ali!»', (await p.innerText('.js-salom')) === 'Salom, Ali!');
  await p.click('.am-uslub-btn >> nth=2'); await p.waitForTimeout(400);
  await p.click('.js-sayt button[type=submit]'); await p.waitForTimeout(200);
  const x1 = await p.$('.js-xato');
  await p.fill('.js-sayt .js-input', 'ali@mail.uz'); await p.click('.js-sayt button[type=submit]'); await p.waitForTimeout(200);
  ok('a4: forma — bo\'sh → xato, to\'liq → rahmat', !!x1 && (await p.innerText('.js-ok')).includes('Rahmat'));
  const pm4 = await promptMatn(p);
  ok('a4: prompt — tanlangan vosita (forma), script.js', pm4.includes('Pochtani yozing') && pm4.includes("script.js ga qo'sh"));
  await kk('a4'); await surat(p, '1280-06-a4'); await nx(p); await p.waitForTimeout(800);
  ok('podium (08/09)', (await raqam(p)) === '08/09'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  const yk = await p.innerText('.stage-content');
  ok("yakun: takrorlash (Copilot, if (son === 10)), Antigravity yo'q", yk.includes('Copilot') && yk.includes('son === 10') && !yk.includes('Antigravity'));
  ok('yakun: bitta «Uyga vazifa» tugmasi (kompilyator tugmasi yo\'q)', await p.evaluate(() => document.querySelectorAll('.hw-big').length === 1));
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const hw = await p.innerText('.stage-content');
  ok('yakun: uyga vazifa — vosita, Netlify yangilash, keyingi dars', hw.includes('Yana bitta vosita') && hw.includes('Deploys') && hw.includes('Praktika 2'));
  await surat(p, '1280-08-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /Yakunlash|Tugatish|Завершить/.test(b.innerText) && b.className.includes('btn-white-accent'))?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal });
  ok('onFinished: 1 savol (s15), birinchi urinish xato → 0/1', fin && fin.tq === 1 && fin.ft === 1 && fin.ca === 0, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
// 3) 390 px
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 9; i++) {
    if (i === 0) { for (let k = 0; k < 3; k++) { await p.click('.site-like'); await p.waitForTimeout(150); } await p.waitForTimeout(400); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(300); }
    if (i === 5) { await p.click('button.chip >> nth=0'); await p.click('button.chip >> nth=3'); await p.waitForTimeout(400); }
    if (i === 6) { await p.click('.am-uslub-btn >> nth=2'); await p.waitForTimeout(300); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 8) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (9 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
writeFileSync(OUT + '/natija-m208.txt', natija.join('\n') + '\n');
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
