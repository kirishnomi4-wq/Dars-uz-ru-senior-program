// F-1015-336/337 · m2-09 PracticeLesson2 sinovi (9 ekran): eski progress · kirish (AI, «Aslida») · reja · a1 4 qism (maket jonli) · a2 iteratsiya · a3 Copilot · s7 · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m209.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson2.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-02-ai-promo-v18';
const page = OUT + '/sinov-m209.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = [];
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
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }) };
const nx = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); return b ? b.innerText.trim() : '-'; });
const bayram = async (p) => { await p.waitForTimeout(600); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300); };
const surat = (p, n) => p.screenshot({ path: `${OUT}/shots/${n}.png` });
const kontrast = (p) => p.evaluate(() => {
  const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
  const bgOf = (el) => { let e = el; while (e) { const cs = getComputedStyle(e); const c = cs.backgroundColor; if (cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage)) { const m = cs.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{6}/i); if (m) return m[0]; } if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const out = [];
  for (const el of document.querySelectorAll('.am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});

// 1) ESKI PROGRESS (19 ekran)
{
  const old = { screen: 14, maxReached: 18, answers: { 4: { correct: true, picked: 0 } }, earned: ['prompt'], startedAt: Date.now() - 600000, total: 19, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 19) → 01/09', (await raqam(p)) === '01/09', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  const s0 = await p.innerText('.stage-content');
  ok("s0: «AI'ga yuborish», agent yo'q", s0.includes("AI'ga yuboring") && !/agent/i.test(s0));
  await p.click('button.btn:has-text("yuborish")'); await p.waitForTimeout(1700);
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400);
  const h0 = await p.innerText('.stage-content');
  ok("s0: noto'g'ri javobga «Aslida», «stil» yo'q", h0.includes('Aslida,') && !h0.includes("To'g'ri!") && !/\bstil/.test(h0), (h0.match(/(Mavzu[^\n]*aytmadingiz)/) || [''])[0]);
  await nx(p); await p.waitForTimeout(700);
  ok('reja (02/09) — «Avval tayyorlaning» yopiq; 4 qism va 4 blok BITTA kartada; «Promo sahifa» izohi', (await raqam(p)) === '02/09' && await p.evaluate(() => !!document.querySelector('.am-tt.am-tt-nafas') && !document.querySelector('.am-tayyor-l') && document.querySelectorAll('.am-reja-k .am-qism').length === 4 && document.querySelectorAll('.am-reja-k .am-blok-qator li').length === 4 && document.body.innerText.includes("odamlarni chaqiradigan bitta sahifa")));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: bosilsa 3 qadam (promo papka, Gemini, Copilot)', await p.evaluate(() => document.querySelectorAll('.am-tayyor-l li').length === 3 && document.body.innerText.includes('promo')));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok('a1 (03/09) — boshida maketda «?» joylar va «rang aytilmadi»', (await raqam(p)) === '03/09' && await p.evaluate(() => document.querySelectorAll('.pm-yoq').length === 2 && document.querySelectorAll('.pm-karta-yoq').length === 3 && document.body.innerText.includes('rang aytilmadi')));
  await surat(p, '1280-02-a1-bosh');
  await p.click('.am-chip:has-text("Kibersport turniri")'); await p.waitForTimeout(200);
  ok('a1: misol chipi mavzuni yozadi — maket sarlavhasi jonli', (await p.inputValue('.am-input >> nth=0')) === 'Kibersport turniri' && (await p.innerText('.pm-h1')) === 'Kibersport turniri');
  await p.click('.am-chip:has-text("Quvnoq")'); await p.click('.am-chip:has-text("Binafsha")'); await p.waitForTimeout(200);
  ok('a1: uslub va rang maketda (pm-quvnoq, binafsha)', await p.evaluate(() => { const d = document.querySelector('.pm-sayt'); return d.className.includes('pm-quvnoq') && d.style.getPropertyValue('--pm') === '#6d28d9'; }));
  ok("a1: 4 qism to'lmaguncha Saqlash yopiq", await p.evaluate(() => document.querySelector('.am-saqla').disabled));
  await p.fill('.am-input >> nth=1', "Jamoani yozdirish"); await p.fill('.am-input >> nth=2', '1-noyabr, maktab zali, noutbuk'); await p.waitForTimeout(250);
  ok('a1: kartalar maketda (3)', await p.evaluate(() => [...document.querySelectorAll('.pm-karta')].filter(x => !x.className.includes('yoq')).length === 3));
  await p.click('.am-saqla'); await p.waitForTimeout(600);
  const pm1 = await p.innerText('.am-masalan');
  ok('a1: prompt — 4 qism bilan', pm1.includes('Kibersport turniri uchun promo sahifa') && pm1.includes('Uslubi quvnoq, asosiy rang binafsha') && pm1.includes('«Jamoani yozdirish» tugmasi') && pm1.includes('1-noyabr, maktab zali, noutbuk'));
  await p.click('button:has-text("Tahrirlash")'); await p.waitForTimeout(300);
  await p.fill('.am-input >> nth=1', "Ro'yxatdan o'tish"); await p.waitForTimeout(300);
  ok('a1: tahrirlashda prompt jonli yangilanadi', (await p.innerText('.am-masalan')).includes("«Ro'yxatdan o'tish» tugmasi"));
  await p.click('.am-saqla'); await p.waitForTimeout(300);
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a1: qadamlar tugmada (4)', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 4)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  // a2
  ok('a2 (04/09) — iteratsiya, prompt yopiq', (await raqam(p)) === '04/09' && !(await p.$('.am-masalan')));
  await p.fill('.am-maydon input >> nth=0', 'tugma juda kichik'); await p.fill('.am-maydon input >> nth=1', "kattaroq va to'q yashil bo'lsin"); await p.waitForTimeout(400);
  ok('a2: prompt — kamchilik bilan', (await p.innerText('.am-masalan')).includes('Yoqmagani: tugma juda kichik'));
  await p.click('.am-saqla'); await p.waitForTimeout(300);
  ok('a2: «Keyingi kamchilik» → Yaxshilandi: 1', (await p.innerText('.am-soni')) === 'Yaxshilandi: 1');
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  // a3
  ok('a3 (05/09) — Copilot, maketda Qoidalar va o\'quvchi mavzusi', (await raqam(p)) === '05/09' && await p.evaluate(() => !!document.querySelector('.pm-qoida') && document.querySelector('.pm-h1').innerText === 'Kibersport turniri'));
  await p.click('.am-kod button.am-nusxa'); await p.waitForTimeout(250);
  ok('a3: izoh nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())).includes("qoidalar bo'limi"));
  await kk('a3'); await surat(p, '1280-04-a3'); await nx(p); await bayram(p);
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon', cnt === '3', `hisoblagich ${cnt}`);
  // s7
  ok('s7 (06/09) «eng aniq», mentor qatorisiz', (await raqam(p)) === '06/09' && (await p.innerText('.stage-content')).includes('eng aniq') && !(await p.$('.stage-content .mentor')));
  const uz = await p.evaluate(() => [...document.querySelectorAll('button.option')].map(b => b.innerText.replace(/^[A-D]\s*/, '').trim().length));
  ok("s7: to'g'ri variant eng uzun emas", uz.length === 4 && uz[1] <= Math.max(uz[0], uz[2], uz[3]) * 1.2, JSON.stringify(uz));
  await p.click('button.option >> nth=0'); await p.waitForTimeout(300);
  ok("s7: A xato — izoh", (await p.innerText('.stage-content')).includes('Mavzu ham, rang ham aytilmagan'));
  await p.click('button.option >> nth=1'); await p.waitForTimeout(400);
  ok("s7: B to'g'ri — «to'rt qism»", (await p.innerText('.stage-content')).includes("to'rt qism bor"));
  await surat(p, '1280-05-s7'); await nx(p); await p.waitForTimeout(800);
  // a4 wow (F-1015-337)
  ok('a4 wow (07/09) — 4 effekt, prompt yopiq, maketda o\'quvchi mavzusi', (await raqam(p)) === '07/09' && await p.evaluate(() => document.querySelectorAll('.am-uslub-btn').length === 4 && !document.querySelector('.am-masalan') && document.querySelector('.pm-h1').innerText === 'Kibersport turniri'));
  await p.click('.am-uslub-btn >> nth=0'); await p.waitForTimeout(400);
  const t1 = await p.evaluate(() => [...document.querySelectorAll('.pm-taymer b')].map(b => b.innerText).join(':')); await p.waitForTimeout(1300);
  const t2 = await p.evaluate(() => [...document.querySelectorAll('.pm-taymer b')].map(b => b.innerText).join(':'));
  ok('a4: taymer — 4 son, har soniyada yuradi', t1.split(':').length === 4 && t1 !== t2, `${t1} → ${t2}`);
  await p.click('.am-uslub-btn >> nth=1'); await p.waitForTimeout(900);
  const k1 = await p.evaluate(() => document.querySelectorAll('.pm-konf').length);
  await p.waitForTimeout(2200); await p.click('.pm-tugma-btn'); await p.waitForTimeout(250);
  const k2 = await p.evaluate(() => document.querySelectorAll('.pm-konf').length);
  ok('a4: konfetti — o\'zi bir marta, tugma bosilsa yana sochiladi', k1 >= 20 && k2 >= 20, `${k1} / ${k2}`);
  await p.click('.am-uslub-btn >> nth=2'); await p.waitForTimeout(400);
  ok('a4: zarrachalar (16) — animatsiyada', await p.evaluate(() => { const z = document.querySelectorAll('.pm-zarra'); return z.length === 16 && getComputedStyle(z[0]).animationName === 'pm-suz'; }));
  await p.click('.am-uslub-btn >> nth=3'); await p.waitForTimeout(400);
  { const bx = await p.evaluate(() => { const r = document.querySelector('.pm-karta').getBoundingClientRect(); return { x: r.left + 12, y: r.top + 10 }; }); await p.mouse.move(bx.x - 30, bx.y - 30); await p.mouse.move(bx.x, bx.y, { steps: 4 }); await p.waitForTimeout(250); }
  ok('a4: 3D kartalar — sichqoncha ostida egiladi', await p.evaluate(() => document.querySelector('.pm-kartalar').classList.contains('pm-egil') && /rotateY/.test(document.querySelector('.pm-karta').style.transform)));
  const pm4 = await p.innerText('.am-masalan');
  ok('a4: prompt — script.js, reduced-motion, tanlangan effekt', pm4.includes("script.js fayliga yoz") && pm4.includes('prefers-reduced-motion') && pm4.includes('3D egilsin'));
  await kk('a4'); await surat(p, '1280-06-a4'); await nx(p); await p.waitForTimeout(800);
  ok("podium (08/09) — kartochkalar yo'q", (await raqam(p)) === '08/09'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: 4 qism, Copilot, uyga vazifa, Antigravity/ingredient yo'q", yk.includes('4 qism') && yk.includes('Copilot') && yk.includes('Ikkinchi promo sahifa') && !/Antigravity|ingredient/i.test(yk));
  ok('yakun: bitta «Uyga vazifa» tugmasi', await p.evaluate(() => document.querySelectorAll('.hw-big').length === 1));
  await surat(p, '1280-07-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal });
  ok('onFinished: 1 savol, birinchi urinish xato → 0/1', fin && fin.tq === 1 && fin.ca === 0 && fin.ft === 1, JSON.stringify(fin));
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
    if (i === 0) { await p.click('button.btn:has-text("yuborish")'); await p.waitForTimeout(1700); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(300); }
    if (i === 2) { await p.click('.am-chip >> nth=0'); await p.click('.am-chip:has-text("Zamonaviy")'); await p.click('.am-chip:has-text("Ko\'k")'); await p.fill('.am-input >> nth=1', 'Yozilish'); await p.fill('.am-input >> nth=2', 'sana, joy, sovrin'); await p.click('.am-saqla'); await p.waitForTimeout(500); }
    if (i === 5) { await p.click('button.option >> nth=1'); await p.waitForTimeout(300); await bayram(p); }
    if (i === 6) { await p.click('.am-uslub-btn >> nth=0'); await p.waitForTimeout(400); }
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
writeFileSync(OUT + '/natija-m209.txt', natija.join('\n') + '\n');
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
