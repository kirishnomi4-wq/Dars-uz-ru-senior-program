// F-1015-341 · m2-11 PracticeLesson3 sinovi (8 ekran): a1 «Do'konni yig'ing» (sudrash, bosish, bog'liqlik, kaskad, 4 ta joy, REJA.md; F-1015-342) · a2 katalog + toifa · a3 qidiruv · yakun · nishon · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m211b.mjs <chiqish-papka-absolut>
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
  // F-1015-359: .ql-chip b — oq yozuvli gradient chip (foydalanuvchi qarori 1-A, m212 kabi) kontrast ro'yxatidan chiqarildi
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});


const R = (i) => `.rj-qator >> nth=${i}`;
const chipBox = (p, nom) => p.locator(`.ql-chip:has-text("${nom}")`).boundingBox();
async function sudra(p, nom, zona) {
  const c = await chipBox(p, nom); const z = await p.locator(`[data-zona="${zona}"]`).boundingBox();
  await p.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await p.mouse.down();
  await p.mouse.move(c.x + c.width / 2 + 20, c.y + c.height / 2 + 15, { steps: 4 });
  await p.mouse.move(z.x + z.width / 2, z.y + z.height - 14, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(650);
}
async function bos(p, nom, zona) { await p.click(`.ql-chip:has-text("${nom}")`); await p.waitForTimeout(120); await p.click(`[data-zona="${zona}"] .ql-zona-h`); await p.waitForTimeout(600); }
const ustun = (p, z) => p.evaluate((z) => [...document.querySelectorAll(`[data-zona="${z}"] .ql-chip b`)].map(x => x.innerText), z);
const xabar = (p) => p.evaluate(() => document.querySelector('.ql-xabar')?.innerText || '');
// 1) ESKI PROGRESS (19 ekran)
{
  const old = { screen: 14, maxReached: 18, answers: { 4: { correct: true, picked: 0 } }, earned: ['mvp'], startedAt: Date.now() - 600000, total: 19, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old), ccDokon: JSON.stringify({ reja: [{ t: 'eski', b: 'shart' }], mahsulot: [{ n: 'A', p: '1' }] }) });
  ok('eski progress (total 19) + eski ccDokon → 01/08', (await raqam(p)) === '01/08', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  await p.click('button.btn:has-text("yuborish")'); await p.waitForTimeout(1700);
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400);
  await nx(p); await p.waitForTimeout(700);
  ok("reja (02/08): namunada 6 karta, toifa tugmalari va qidiruv; 3 blok", (await raqam(p)) === '02/08' && await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 6 && !!document.querySelector('.dk-filtr') && !!document.querySelector('.dk-qidir') && document.querySelector('.am-reja-k').innerText.includes('Katalog va toifa tugmalari') && document.querySelector('.am-reja-k').innerText.includes('Qidiruv')));
  await p.click('.dk-tf:has-text("Shirinlik")'); await p.waitForTimeout(300);
  ok('reja: namunada «Shirinlik» → 2 karta', await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 2));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning ichida script.js', (await p.innerText('.am-tayyor-l')).includes('script.js'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok("a1 (03/08): 8 qism qatorda, maket «Bo'sh sahifa», Saqlash yopiq", (await raqam(p)) === '03/08' && await p.evaluate(() => document.querySelectorAll('[data-zona="pool"] .ql-chip').length === 8 && !!document.querySelector('.dk-bosh-sahifa') && document.querySelector('.am-saqla').disabled));
  ok("a1: sarlavha «4 ta qism tanlang», «Shart»da 4 bo'sh joy, daqiqa yo'q", (await p.innerText('.stage-content')).includes('4 ta qism tanlang') && !(await p.innerText('.stage-content')).includes('daqiqa') && await p.evaluate(() => document.querySelectorAll('[data-zona="shart"] .ql-joy').length === 4 && document.querySelector('.ql-sanoq').innerText === '0 / 4'));
  await surat(p, '1280-02-a1-bosh');
  await bos(p, 'Savat', 'shart');
  ok("a1: «Savat» bo'sh «Shart»ga — rad + sabab", (await ustun(p, 'shart')).length === 0 && (await xabar(p)).includes("Avval «Kartochkalar» kerak — savatga nima qo'shasiz?"), await xabar(p));
  await sudra(p, "Mahsulot ro'yxati", 'shart');
  ok("a1: sudrab «Mahsulot ro'yxati» → Shart; maketda oddiy ro'yxat (6 qator)", JSON.stringify(await ustun(p, 'shart')) === JSON.stringify(["Mahsulot ro'yxati"]) && await p.evaluate(() => document.querySelectorAll('.dk-royxat li').length === 6 && !document.querySelector('.dk-karta')), JSON.stringify(await ustun(p, 'shart')));
  await bos(p, 'Kartochkalar', 'shart');
  ok('a1: «Kartochkalar» → maketda 6 karta (pop)', await p.evaluate(() => document.querySelectorAll('.dk-karta.dk-pop').length === 6 && !document.querySelector('.dk-royxat')));
  await sudra(p, 'Toifa tugmalari', 'shart'); await bos(p, 'Qidiruv', 'shart');
  ok("a1: toifa tugmalari + qidiruv maketda; 4 / 4, bo'sh joy qolmadi", await p.evaluate(() => !!document.querySelector('.dk-filtr.dk-kir') && !!document.querySelector('.dk-qidir') && document.querySelector('.ql-sanoq').innerText === '4 / 4' && !document.querySelector('.ql-joy')));
  await surat(p, '1280-03-a1-4ta');
  await bos(p, 'Savat', 'shart');
  ok("a1: 5-qism («Savat») — rad, «4 ta joy band», Shart 4 ta qoladi", (await xabar(p)).includes('4 ta joy band') && (await ustun(p, 'shart')).length === 4 && await p.evaluate(() => !document.querySelector('.dk-savat')), await xabar(p));
  await surat(p, '1280-04-a1-band');
  await sudra(p, 'Savat', 'keyin');
  await bos(p, 'Kartochkalar', 'keyin');
  ok("a1: «Kartochkalar» → Keyin — tayanganlar ham ko'chdi (kaskad)", JSON.stringify(await ustun(p, 'shart')) === JSON.stringify(["Mahsulot ro'yxati"]) && (await ustun(p, 'keyin')).length === 4 && (await xabar(p)).includes("ham ko'chdi — ular «Kartochkalar»siz ishlamaydi"), await xabar(p));
  await surat(p, '1280-05-a1-kaskad');
  await sudra(p, 'Kartochkalar', 'shart'); await sudra(p, 'Toifa tugmalari', 'shart'); await bos(p, 'Qidiruv', 'shart');
  await sudra(p, 'Sevimli', 'keyin'); await bos(p, "To'lov", 'keyin');
  ok('a1: bitta qism qatorda qoldi — Saqlash «yana 1 ta»', (await p.innerText('.am-saqla')).includes('yana 1 ta'), await p.innerText('.am-saqla'));
  await sudra(p, 'Akkaunt bilan kirish', 'keyin');
  ok('a1: hammasi joylandi — Saqlash ochiq; Shart tartibi 1–4', !(await p.evaluate(() => document.querySelector('.am-saqla').disabled)) && JSON.stringify(await ustun(p, 'shart')) === JSON.stringify(["Mahsulot ro'yxati", 'Kartochkalar', 'Toifa tugmalari', 'Qidiruv']), JSON.stringify(await ustun(p, 'shart')) + ' / ' + JSON.stringify(await ustun(p, 'keyin')));
  await sudra(p, 'Qidiruv', 'keyin');
  ok("a1: 3 ta qismda — Saqlash yopiq, «yana 1 ta bo'sh joy»", await p.evaluate(() => document.querySelector('.am-saqla').disabled && document.querySelectorAll('.ql-joy').length === 1) && (await p.innerText('.am-saqla')).includes("yana 1 ta bo'sh joy"), await p.innerText('.am-saqla'));
  await sudra(p, 'Sevimli', 'shart'); await p.click('.am-saqla'); await p.waitForTimeout(600);
  ok("a1: boshqa reja (Sevimli) ham saqlanadi + «Darsda ... quramiz» eslatmasi", (await p.innerText('.rj-body')).includes('4. Sevimli') && (await p.evaluate(() => document.querySelector('.am-ochil .ql-xabar.info')?.innerText || '')).includes("Darsda «Toifa tugmalari» va «Qidiruv»ni quramiz"));
  await p.click('button.am-nusxa:has-text("Tahrirlash")'); await p.waitForTimeout(400);
  await sudra(p, 'Sevimli', 'keyin'); await sudra(p, 'Qidiruv', 'shart');
  await kk('a1-taxta'); await surat(p, '1280-06-a1-tayyor');
  await p.click('.am-saqla'); await p.waitForTimeout(600);
  const rj = await p.innerText('.rj-body');
  ok("a1: saqlangach REJA.md — Shart 1–4 daqiqasiz; Keyin 4 ta; eslatma yo'q", rj.includes('## Shart (MVP)') && !rj.includes('daqiqa') && /1\. Mahsulot ro'yxati\s+2\. Kartochkalar\s+3\. Toifa tugmalari\s+4\. Qidiruv/.test(rj) && (rj.match(/^- /gm) || []).length === 4 && await p.evaluate(() => !document.querySelector('.am-ochil .ql-xabar')), rj.replace(/\n/g, ' / '));
  await p.click('button.am-nusxa:has-text("REJA.md ni nusxalash")'); await p.waitForTimeout(250);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok('a1: nusxa — markdown reja', clip.startsWith("# Mini-do'kon — reja") && clip.includes("## Shart (MVP)\n1. Mahsulot ro'yxati\n2. Kartochkalar\n") && clip.includes('## Keyin\n- '), JSON.stringify(clip));
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a1: qadamlar tugmada (3)', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 3)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  await p.fill('.dk-qidir', 'sho'); await p.waitForTimeout(300);
  ok('a1: maketdagi qidiruv ishlaydi («sho» → Shokolad)', await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 1 && document.querySelector('.dk-karta b').innerText === 'Shokolad'));
  await kk('a1'); await surat(p, '1280-07-a1-saqlandi');
  await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  ok("a1: qayta yuklansa — o'sha ekran va reja saqlangan", (await raqam(p)) === '03/08' && (await p.innerText('.rj-body')).includes('4. Qidiruv'));
  await p.click('button.am-nusxa:has-text("Tahrirlash")'); await p.waitForTimeout(400);
  ok('a1: Tahrirlash — taxta qaytadi, ustunlar saqlangan', (await ustun(p, 'shart')).length === 4 && (await ustun(p, 'keyin')).length === 4);
  await nx(p); await bayram(p);
  // a2
  ok("a2 (04/08): 6 qator, «? do'kon nomi», 2 bo'sh karta, toifa tugmalari bor, qidiruv yo'q", (await raqam(p)) === '04/08' && await p.evaluate(() => document.querySelectorAll('.rj-qator').length === 6 && document.querySelector('.dk-h1').innerText.includes("do'kon nomi") && document.querySelectorAll('.dk-karta').length === 2 && !!document.querySelector('.dk-filtr') && !document.querySelector('.dk-qidir')));
  await p.click(".am-chip:has-text(\"Maktab mini-do'koni\")"); await p.waitForTimeout(200);
  const mh = [['Ruchka', '3000', 'oquv'], ['Kitob', '35 000', 'oquv'], ['Sharbat', "6000 so'm", 'oquv'], ['Bloknot', '8 000', 'oquv']];
  for (let i = 0; i < 4; i++) { await p.fill(`${R(i)} >> .am-input >> nth=0`, mh[i][0]); await p.fill(`${R(i)} >> .am-input >> nth=1`, mh[i][1]); await p.selectOption(`${R(i)} >> select`, mh[i][2]); }
  await p.waitForTimeout(200);
  ok('a2: 4 mahsulot, lekin bitta toifa — Saqlash yopiq', await p.evaluate(() => document.querySelector('.am-saqla').disabled));
  await p.selectOption(`${R(2)} >> select`, 'ichimlik'); await p.waitForTimeout(250);
  ok('a2: 2 xil toifa — Saqlash ochiq', !(await p.evaluate(() => document.querySelector('.am-saqla').disabled)));
  await p.click('.dk-tf:has-text("Ichimlik")'); await p.waitForTimeout(300);
  ok("a2: maketda «Ichimlik» → faqat Sharbat; so'm takrorlanmaydi", await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 1 && document.querySelector('.dk-karta b').innerText === 'Sharbat' && document.querySelector('.dk-narx').innerText === "6000 so'm"));
  await p.click('.dk-tf:has-text("Hammasi")');
  await p.click('.am-saqla'); await p.waitForTimeout(600);
  const pm2 = await p.innerText('.am-masalan');
  ok('a2: prompt — massiv, for, if, toifalar, savat/qidiruvsiz', pm2.startsWith("Maktab mini-do'koni uchun bitta sahifali do'kon yasa.") && pm2.includes('massivda tursin — har biri { nom, narx, toifa }') && pm2.includes("- Ruchka, 3000 so'm, O'quv") && pm2.includes("- Sharbat, 6000 so'm, Ichimlik") && pm2.includes('for sikli') && pm2.includes("Hammasi, O'quv, Ichimlik. Bosilganda if bilan") && pm2.includes("savat va qidiruv qo'shma"), pm2.replace(/\n/g, ' / '));
  await kk('a2'); await surat(p, '1280-08-a2'); await nx(p); await bayram(p);
  // a3
  ok("a3 (05/08): o'quvchi katalogi (4), qidiruv + Copilot belgisi", (await raqam(p)) === '05/08' && await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 4 && document.querySelector('.dk-karta b').innerText === 'Ruchka' && !!document.querySelector('.dk-qidir') && document.querySelector('.dk-rel .dk-teg')?.innerText === 'Copilot'));
  await p.fill('.dk-qidir', 'kit'); await p.waitForTimeout(300);
  ok('a3: «kit» → Kitob', await p.evaluate(() => document.querySelectorAll('.dk-karta').length === 1 && document.querySelector('.dk-karta b').innerText === 'Kitob'));
  await p.fill('.dk-qidir', 'zzz'); await p.waitForTimeout(300);
  ok('a3: topilmasa — «Hech narsa topilmadi»', (await p.innerText('.dk-body')).includes('Hech narsa topilmadi'));
  await p.fill('.dk-qidir', '');
  await p.click('.am-kod >> nth=0 >> button.am-nusxa'); await p.waitForTimeout(200);
  const c1 = await p.evaluate(() => navigator.clipboard.readText());
  await p.click('.am-kod >> nth=1 >> button.am-nusxa'); await p.waitForTimeout(200);
  const c2 = await p.evaluate(() => navigator.clipboard.readText());
  ok('a3: ikki izoh nusxalanadi (HTML input, JS qidiruv)', c1.includes('id="qidiruv"') && c2.startsWith('// qidiruv'), c1 + ' | ' + c2);
  ok('a3: 4 qadam, «Taklif chiqmadimi?»', await p.evaluate(() => document.querySelectorAll('.am-qadam li').length === 4 && !!document.querySelector('.am-yordam')));
  await kk('a3'); await surat(p, '1280-09-a3'); await nx(p); await bayram(p);
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon', cnt === '3', `hisoblagich ${cnt}`);
  ok("s4 (06/08) «MVP nima degani?»", (await raqam(p)) === '06/08' && (await p.innerText('.stage-content')).includes('MVP nima degani'));
  await p.click('button.option >> nth=1'); await p.waitForTimeout(300);
  await p.click('button.option >> nth=0'); await p.waitForTimeout(400);
  await nx(p); await p.waitForTimeout(800);
  ok('podium (07/08)', (await raqam(p)) === '07/08'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (08/08)', (await raqam(p)) === '08/08');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: massiv/for/if, Copilot izohdan funksiya, uyga vazifa Sevimli + savat prompti", yk.includes('Mahsulotlar massivda') && yk.includes('Copilot izohdan funksiya yozadi') && yk.includes('Sevimli') && yk.includes('Savat uchun prompt') && !/Bitta qadam — bitta so'rov|Antigravity|agent/i.test(yk));
  ok('yakun: nishonlar 3/4', yk.includes('3/4'));
  await surat(p, '1280-10-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal });
  ok('onFinished: 0/1', fin && fin.tq === 1 && fin.ca === 0 && fin.ft === 1, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
// 3) 390 px (bosish bilan) + test birinchi urinishda to'g'ri → 4/4, onFinished 1/1
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 8; i++) {
    if (i === 0) { await p.click('button.btn:has-text("yuborish")'); await p.waitForTimeout(1700); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(300); }
    if (i === 2) { for (const n of ["Mahsulot ro'yxati", 'Kartochkalar', 'Toifa tugmalari', 'Qidiruv']) await bos(p, n, 'shart'); for (const n of ['Sevimli', 'Savat', "To'lov", 'Akkaunt bilan kirish']) await bos(p, n, 'keyin'); await surat(p, '390-2-taxta'); await p.click('.am-saqla'); await p.waitForTimeout(500); }
    if (i === 3) { await p.click('.am-chip >> nth=0'); for (let j = 0; j < 4; j++) { await p.fill(`${R(j)} >> .am-input >> nth=0`, 'Mahsulot ' + (j + 1)); await p.fill(`${R(j)} >> .am-input >> nth=1`, '5 000'); await p.selectOption(`${R(j)} >> select`, j < 2 ? 'oquv' : 'shirinlik'); } await p.click('.am-saqla'); await p.waitForTimeout(500); }
    if (i === 5) { await p.click('button.option >> nth=0'); await p.waitForTimeout(300); await bayram(p); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 7) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (8 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: test birinchi urinishda to'g'ri — nishonlar 4/4", (await p.innerText('.stage-content')).includes('4/4'));
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers });
  ok('390: onFinished 1/1', fin && fin.tq === 1 && fin.ca === 1, JSON.stringify(fin));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
writeFileSync(OUT + '/natija-m211b.txt', natija.join('\n') + '\n');
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
