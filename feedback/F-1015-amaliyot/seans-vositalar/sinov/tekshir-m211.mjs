// F-1015-340 · m2-11 PracticeLesson3 sinovi (8 ekran): eski progress · kirish (AI) · reja · a1 REJA.md (shart/keyin/↑, maket jonli, saqlov) · a2 katalog prompt · a3 Copilot · s4 · yakun · onFinished · nishonlar · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m211.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson3.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-03-decompose-v18';
const page = OUT + '/sinov-m211.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .rj-up, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});


const R = (p, i) => `.rj-qator >> nth=${i}`;
// 1) ESKI PROGRESS (19 ekran)
{
  const old = { screen: 14, maxReached: 18, answers: { 4: { correct: true, picked: 0 } }, earned: ['mvp'], startedAt: Date.now() - 600000, total: 19, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 19) → 01/08', (await raqam(p)) === '01/08', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  const s0 = await p.innerText('.stage-content');
  ok("s0: «AI'ga yuborish», agent yo'q", s0.includes("AI'ga yuborish") && !/agent/i.test(s0));
  await p.click('button.btn:has-text("yuborish")'); await p.waitForTimeout(400);
  ok("s0: qurilayotganda «AI quryapti», agent yo'q", !/agent/i.test(await p.innerText('.stage-content')));
  await p.waitForTimeout(1400);
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400);
  ok("s0: noto'g'ri javobga «Aslida»", (await p.innerText('.stage-content')).includes('Aslida'));
  await nx(p); await p.waitForTimeout(700);
  ok("reja (02/08) — tayyorlaning yopiq va nafasda; qoida + 3 blok bitta kartada; namunada 6 mahsulot", (await raqam(p)) === '02/08' && await p.evaluate(() => !!document.querySelector('.am-tt.am-tt-nafas') && !document.querySelector('.am-tayyor-l') && document.querySelectorAll('.am-reja-k .am-blok-qator li').length === 3 && document.querySelector('.am-qoida-m').innerText.includes("Avval bo'laklang") && document.querySelectorAll('.dk-karta').length === 6));
  const r0 = await p.innerText('.stage-content');
  ok("reja: sarlavha «qaysi qadamdan», arxitektor/Antigravity yo'q", r0.includes('qaysi qadamdan') && !/arxitektor|Antigravity|agent/i.test(r0));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: bosilsa 3 qadam (mini-dokon + REJA.md, Gemini, Copilot)', await p.evaluate(() => document.querySelectorAll('.am-tayyor-l li').length === 3 && document.querySelector('.am-tayyor-l').innerText.includes('mini-dokon') && document.querySelector('.am-tayyor-l').innerText.includes('REJA.md')));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok("a1 (03/08) — REJA.md maketida «?» (2), 6 qator, Saqlash yopiq", (await raqam(p)) === '03/08' && await p.evaluate(() => document.querySelectorAll('.rj-body .rj-yoq').length === 2 && document.querySelectorAll('.rj-qator').length === 6 && document.querySelector('.am-saqla').disabled));
  await surat(p, '1280-02-a1-bosh');
  const yoz = [['Mahsulotlar va narxlar', 'Shart'], ['Savat', 'Shart'], ['Qidiruv', 'Keyin'], ['Jami narx', null]];
  for (let i = 0; i < 4; i++) { await p.fill(`${R(p, i)} >> .am-input`, yoz[i][0]); if (yoz[i][1]) await p.click(`${R(p, i)} >> button.am-chip:has-text("${yoz[i][1]}")`); }
  await p.waitForTimeout(250);
  ok("a1: belgisiz qadam bo'lsa — maketda «? belgi qo'yilmagan», Saqlash yopiq", await p.evaluate(() => document.querySelector('.rj-body').innerText.includes("belgi qo'yilmagan") && document.querySelector('.am-saqla').disabled));
  await p.click(`${R(p, 3)} >> button.am-chip:has-text("Shart")`); await p.waitForTimeout(150);
  await p.click(`${R(p, 3)} >> button.rj-up`); await p.waitForTimeout(250);
  const rj = await p.innerText('.rj-body');
  ok('a1: ↑ tartiblaydi — Shart: 1 Mahsulotlar, 2 Savat, 3 Jami narx; Keyin: Qidiruv', /1\. Mahsulotlar va narxlar\s+2\. Savat\s+3\. Jami narx\s+## Keyin\s+- Qidiruv/.test(rj), rj.replace(/\n/g, ' / '));
  ok("a1: 1-qator ↑ yopiq; to'liq bo'lgach Saqlash ochiq", await p.evaluate(() => document.querySelector('.rj-up').disabled && !document.querySelector('.am-saqla').disabled));
  await p.click('.am-saqla'); await p.waitForTimeout(600);
  ok("a1: saqlangach — «Shart: 3 · Keyin: 1», nusxa tugmasi, matn takrorlanmaydi (faqat maketda)", (await p.innerText('.stage-content')).includes('Shart: 3 · Keyin: 1') && !(await p.$('.am-kod')) && !(await p.$('.am-masalan')));
  await p.click('button.am-nusxa:has-text("REJA.md ni nusxalash")'); await p.waitForTimeout(250);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok('a1: nusxa — markdown reja', clip.startsWith("# Mini-do'kon — reja") && clip.includes('## Shart (MVP)\n1. Mahsulotlar va narxlar\n2. Savat\n3. Jami narx') && clip.includes('## Keyin\n- Qidiruv'), JSON.stringify(clip));
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a1: qadamlar tugmada (4)', await p.evaluate(() => document.querySelectorAll('.am-qt .am-qadam li').length === 4));
  await kk('a1'); await surat(p, '1280-03-a1');
  await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  ok("a1: qayta yuklansa — o'sha ekran va reja saqlangan", (await raqam(p)) === '03/08' && (await p.innerText('.stage-content')).includes('Shart: 3 · Keyin: 1'));
  await nx(p); await bayram(p);
  // a2
  ok("a2 (04/08) — maketda «? do'kon nomi», 4 karta «?», prompt yo'q", (await raqam(p)) === '04/08' && await p.evaluate(() => document.querySelector('.dk-h1').innerText.includes("do'kon nomi") && document.querySelectorAll('.dk-karta').length === 4 && !document.querySelector('.am-masalan')));
  await p.click(".am-chip:has-text(\"Maktab mini-do'koni\")"); await p.waitForTimeout(200);
  ok('a2: nom chipi — maket sarlavhasi jonli', (await p.innerText('.dk-h1')) === "Maktab mini-do'koni");
  const mh = [['Ruchka', '3000'], ['Kitob', '35 000'], ['Sumka', "90000 so'm"], ['Bloknot', '8 000']];
  for (let i = 0; i < 3; i++) { await p.fill(`${R(p, i)} >> .am-input >> nth=0`, mh[i][0]); await p.fill(`${R(p, i)} >> .am-input >> nth=1`, mh[i][1]); }
  ok("a2: 4-mahsulotsiz Saqlash yopiq", await p.evaluate(() => document.querySelector('.am-saqla').disabled));
  await p.fill(`${R(p, 3)} >> .am-input >> nth=0`, mh[3][0]); await p.fill(`${R(p, 3)} >> .am-input >> nth=1`, mh[3][1]); await p.waitForTimeout(250);
  const nr = await p.evaluate(() => [...document.querySelectorAll('.dk-narx')].map(x => x.innerText));
  ok("a2: maketda narxlar (so'm takrorlanmaydi)", nr.length === 4 && nr[2] === "90000 so'm" && nr[0] === "3000 so'm", JSON.stringify(nr));
  await p.click('.am-saqla'); await p.waitForTimeout(600);
  const pm2 = await p.innerText('.am-masalan');
  ok('a2: prompt — faqat 1-qadam, savatsiz', pm2.includes("Maktab mini-do'koni uchun sahifa yasa: 4 ta mahsulot — Ruchka (3000 so'm), Kitob (35 000 so'm), Sumka (90000 so'm), Bloknot (8 000 so'm).") && pm2.includes("savat va tugmalar qo'shma") && pm2.includes("index.html va style.css'ni alohida"), pm2.replace(/\n/g, ' / '));
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a2: qadamlar tugmada (4)', await p.evaluate(() => document.querySelectorAll('.am-qt .am-qadam li').length === 4));
  await kk('a2'); await surat(p, '1280-04-a2'); await nx(p); await bayram(p);
  // a3
  ok("a3 (05/08) — maketda o'quvchi do'koni + 2 Copilot karta", (await raqam(p)) === '05/08' && await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 6 && document.querySelectorAll('.dk-yangi').length === 2 && document.querySelector('.dk-h1').innerText === "Maktab mini-do'koni" && document.querySelector('.dk-karta b').innerText === 'Ruchka'));
  await p.click('.am-kod button.am-nusxa'); await p.waitForTimeout(250);
  ok('a3: izoh nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())).includes("Sharbat, 6 000 so'm"));
  ok('a3: 4 qadam, «Taklif chiqmadimi?»', await p.evaluate(() => document.querySelectorAll('.am-qadam li').length === 4 && !!document.querySelector('.am-yordam')));
  await kk('a3'); await surat(p, '1280-05-a3'); await nx(p); await bayram(p);
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon', cnt === '3', `hisoblagich ${cnt}`);
  // s4
  const t4 = await p.innerText('.stage-content');
  ok("s4 (06/08) «MVP nima degani?», mentor qatorisiz, skeytbord yo'q", (await raqam(p)) === '06/08' && t4.includes('MVP nima degani') && !(await p.$('.stage-content .mentor')) && !/skeytbord/i.test(t4));
  await p.click('button.option >> nth=1'); await p.waitForTimeout(300);
  ok('s4: B xato — izoh', (await p.innerText('.stage-content')).includes('Chiroyli dizayn keyin'));
  await p.click('button.option >> nth=0'); await p.waitForTimeout(400);
  ok("s4: A to'g'ri", (await p.innerText('.stage-content')).includes('ishlaydigan birinchi versiya'));
  await surat(p, '1280-06-s4'); await nx(p); await p.waitForTimeout(800);
  ok("podium (07/08) — kartochkalar yo'q", (await raqam(p)) === '07/08'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (08/08)', (await raqam(p)) === '08/08');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: reja bilan, «Bitta qadam», uyga vazifa (savat prompti), Antigravity/arxitektor yo'q", yk.includes('reja bilan') && yk.includes("Bitta qadam — bitta so'rov") && yk.includes('Savat uchun prompt') && yk.includes('mini-dokon papkasida') && !/Antigravity|arxitektor|agent/i.test(yk));
  ok('yakun: nishonlar 3/4 (test birinchi urinishda xato)', yk.includes('3/4'));
  await surat(p, '1280-07-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal });
  ok('onFinished: 1 savol, birinchi urinish xato → 0/1', fin && fin.tq === 1 && fin.ca === 0 && fin.ft === 1, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
// 3) 390 px + test birinchi urinishda to'g'ri → 4/4, onFinished 1/1
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 8; i++) {
    if (i === 0) { await p.click('button.btn:has-text("yuborish")'); await p.waitForTimeout(1700); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(300); }
    if (i === 2) { for (let j = 0; j < 4; j++) { await p.fill(`${R(p, j)} >> .am-input`, ['Mahsulotlar', 'Savat', 'Jami', 'Login'][j]); await p.click(`${R(p, j)} >> button.am-chip:has-text("${j < 3 ? 'Shart' : 'Keyin'}")`); } await p.click('.am-saqla'); await p.waitForTimeout(500); }
    if (i === 3) { await p.click('.am-chip >> nth=0'); for (let j = 0; j < 4; j++) { await p.fill(`${R(p, j)} >> .am-input >> nth=0`, 'Mahsulot ' + (j + 1)); await p.fill(`${R(p, j)} >> .am-input >> nth=1`, '5 000'); } await p.click('.am-saqla'); await p.waitForTimeout(500); }
    if (i === 5) { await p.click('button.option >> nth=0'); await p.waitForTimeout(300); await bayram(p); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 7) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (8 ekran)", tosh.length === 0, tosh.join(', '));
  ok('390: test birinchi urinishda to\'g\'ri — nishonlar 4/4', (await p.innerText('.stage-content')).includes('4/4'));
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers });
  ok('390: onFinished 1/1', fin && fin.tq === 1 && fin.ca === 1, JSON.stringify(fin));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
writeFileSync(OUT + '/natija-m211.txt', natija.join('\n') + '\n');
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
