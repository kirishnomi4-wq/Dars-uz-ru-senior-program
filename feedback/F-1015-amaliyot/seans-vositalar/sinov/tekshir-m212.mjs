// F-1015-343 · m2-12 PracticeLesson4 sinovi (8 ekran): kirish (o'quvchi katalogi, «Savatga» o'lik) · reja (REJA.md) · a1 savat + jami + kod oynasi · a2 xato ovi · a3 Netlify havola · s15 tartib · yakun · nishon · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m212.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PracticeLesson4.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'practice-04-mvp-deploy-v18';
const page = OUT + '/sinov-m212.html';
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
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }) };
const nx = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); return b ? b.innerText.trim() : '-'; });
const bayram = async (p) => { await p.waitForTimeout(600); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300); };
const surat = (p, n) => p.screenshot({ path: `${OUT}/shots/${n}.png` });
const kontrast = (p) => p.evaluate(() => {
  const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
  const bgOf = (el) => { let e = el; while (e) { const cs = getComputedStyle(e); const c = cs.backgroundColor; if (cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage)) { const m = cs.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{6}/i); if (m) return m[0]; } if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const out = [];
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});



const KAT = { nom: "Bizning do'kon", katalog: [{ n: 'Ruchka', p: '3000', t: 'oquv' }, { n: 'Kitob', p: '35 000', t: 'oquv' }, { n: 'Sharbat', p: "6000 so'm", t: 'ichimlik' }, { n: 'Bloknot', p: '8 000', t: 'oquv' }, { n: '', p: '', t: '' }, { n: '', p: '', t: '' }], katSaqlangan: true, rejaShart: ['royxat', 'karta', 'filtr', 'qidiruv'], rejaKeyin: ['sevimli', 'savat', 'tolov', 'akkaunt'], rejaSaqlangan: true };
const savatga = (p, nom) => p.click(`.dk-karta:has(b:text-is("${nom}")) .dk-savatga`);
const jami = (p) => p.evaluate(() => document.querySelector('.dk-jami-q b')?.innerText || '');
const pill = (p) => p.evaluate(() => document.querySelector('.dk-savat')?.innerText || '');
const BESH = ["G'oyani bo'lakla (reja)", "MVP'ni belgila", 'AI bilan qur', 'Natijani tekshir', 'Deploy qil'];
const tartib = async (p) => { for (const t of BESH) { await p.click(`.dd-pool .dd-chip:text-is("${t}")`); await p.waitForTimeout(250); } await p.waitForTimeout(500); };
// 1) ESKI PROGRESS (19 ekran)
{
  const old = { screen: 11, maxReached: 14, answers: { 4: { correct: true, picked: 0 } }, earned: ['builder'], startedAt: Date.now() - 600000, total: 19, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 19) → 01/08', (await raqam(p)) === '01/08', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM — m2-11 dagi katalog bilan
{
  const { p, ctx, errs } = await och({ ...self, ccDokon: JSON.stringify(KAT) });
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok("kirish (01/08): o'quvchi katalogi — nom, 4 karta, savat yo'q", (await raqam(p)) === '01/08' && await p.evaluate(() => document.querySelector('.dk-h1').innerText === "Bizning do'kon" && document.querySelectorAll('.dk-karta').length === 4 && !document.querySelector('.dk-savat') && !document.querySelector('.dk-jami')));
  ok("kirish: «qurgan katalogingiz», Kitob 35 000 so'm", (await p.innerText('.stage-content')).includes('qurgan katalogingiz') && (await p.innerText('.dk-grid')).includes("35 000 so'm"));
  ok('kirish: savol hali yo\'q, Davom yopiq', await p.evaluate(() => !document.querySelector('.hook-option') && [...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await surat(p, '1280-00-kirish');
  await savatga(p, 'Ruchka'); await p.waitForTimeout(150);
  ok('kirish: «Savatga» — silkinadi, «Hech narsa bo\'lmadi», savol chiqdi', await p.evaluate(() => !!document.querySelector('.dk-savatga.ql-silk')) && (await p.innerText('.stage-content')).includes("Hech narsa bo'lmadi") && await p.evaluate(() => document.querySelectorAll('.hook-option').length === 3));
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300);
  { const ack = await p.locator('.hook-ack').last().innerText(); // 1-si — «Hech narsa bo'lmadi» xabari
    ok('kirish: noto\'g\'ri variant — o\'z javobi + «Bugun…» (216-qonun)', /bosilganni eslab qolmaydi|bosilgani eslanmaydi/.test(ack) && ack.includes('Bugun JavaScript bilan savat') && ack.length <= 120, ack); }
  await kk('kirish'); await surat(p, '1280-01-kirish-javob'); await nx(p); await p.waitForTimeout(700);
  // reja
  ok("reja (02/08): REJA.md — 4 ✓, Bugun, Keyin'da Savat yo'q", (await raqam(p)) === '02/08' && await p.evaluate(() => document.querySelectorAll('.rj-ok').length === 4 && document.querySelector('.rj-body').innerText.includes('## Bugun') && !document.querySelector('.rj-yoq').innerText.includes('Savat') && document.querySelector('.rj-yoq').innerText.includes('Sevimli')));
  await p.click('button.am-nusxa:has-text("Yangisini nusxalash")'); await p.waitForTimeout(250);
  const rc = await p.evaluate(() => navigator.clipboard.readText());
  ok('reja: yangi REJA.md nusxasi', rc.includes("1. Mahsulot ro'yxati ✓") && rc.includes('## Bugun\n- Savat va jami narx\n- Deploy') && rc.includes('## Keyin\n- Sevimli\n'), JSON.stringify(rc));
  await savatga(p, 'Kitob'); await p.waitForTimeout(300);
  ok("reja: namunada savat ishlaydi — 1, 35 000 so'm", (await pill(p)) === 'Savat · 1' && (await jami(p)) === "35 000 so'm", (await pill(p)) + ' / ' + (await jami(p)));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning — 3 qadam, netlify', await p.evaluate(() => document.querySelectorAll('.am-tayyor-l li').length === 3 && document.querySelector('.am-tayyor-l').innerText.includes('netlify.com')));
  await kk('reja'); await surat(p, '1280-02-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok('a1 (03/08): kod oynasi — savat = [], jami = 0', (await raqam(p)) === '03/08' && await p.evaluate(() => document.querySelector('.sk-oyna').innerText.includes('savat = [];') && document.querySelector('.sk-oyna').innerText.includes('jami = 0;')));
  await savatga(p, 'Ruchka'); await p.waitForTimeout(200); await savatga(p, 'Sharbat'); await p.waitForTimeout(400);
  const ko = await p.innerText('.sk-oyna');
  ok("a1: 2 ta — pill 2, jami 9 000 so'm, kod: push, massiv, for yig'indisi", (await pill(p)) === 'Savat · 2' && (await jami(p)) === "9 000 so'm" && ko.includes('savat.push("Sharbat");') && ko.includes('savat = ["Ruchka", "Sharbat"];') && ko.includes('savat.length = 2') && ko.includes('jami = 9000;') && ko.includes('for: 3000 + 6000'), ko.replace(/\n/g, ' / '));
  await surat(p, '1280-03-a1');
  await p.click('.dk-tozala'); await p.waitForTimeout(300);
  ok('a1: Tozalash — savat = [], «Savat bo\'sh»', (await p.innerText('.sk-oyna')).includes('savat = [];') && (await p.innerText('.dk-jami')).includes("Savat bo'sh"));
  await p.click('.dk-tf:has-text("Ichimlik")'); await p.waitForTimeout(200); await savatga(p, 'Sharbat'); await p.waitForTimeout(200);
  ok('a1: toifa tugmasidan keyin ham savat ishlaydi', (await pill(p)) === 'Savat · 1');
  const pm1 = await promptMatn(p);
  ok('a1: prompt — nom, let savat, push, savat.length, jamiHisobla + for', pm1.startsWith("«Bizning do'kon» do'konimga savat va jami narx qo'sh.") && pm1.includes('let savat = [];') && pm1.includes('savat.push()') && pm1.includes('savat.length') && pm1.includes('jamiHisobla() funksiyasi for sikli bilan') && pm1.includes("{index.html, style.css va script.js kodini shu yerga qo'ying}"), pm1.replace(/\n/g, ' / '));
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a1: qadamlar 4', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 4)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  await kk('a1'); await nx(p); await bayram(p);
  // a2
  ok("a2 (04/08): bo'limlar yopiq — avval 2 ta mahsulot", (await raqam(p)) === '04/08' && await p.evaluate(() => [...document.querySelectorAll('.am-chip')].every(b => b.disabled) && !document.querySelector('.bk-oyna')));
  await savatga(p, 'Ruchka'); await p.waitForTimeout(200); await savatga(p, 'Sharbat'); await p.waitForTimeout(300);
  ok("a2: xato jami — «030006000 so'm», qizil", (await jami(p)) === "030006000 so'm" && await p.evaluate(() => !!document.querySelector('.dk-jami-xato')), await jami(p));
  await p.click('.am-chip:has-text("Savat soni")'); await p.waitForTimeout(250);
  ok('a2: «Savat soni» — xato emas', (await p.innerText('.ql-xabar.xato')).includes("Soni to'g'ri"));
  await p.click('.am-chip:has-text("Jami narx")'); await p.waitForTimeout(400);
  ok("a2: «Jami narx» — to'g'ri, 3000 + 6000 → 9 000; kod 9 qator, narx qo'shtirnoqda", (await p.innerText('.ql-xabar.info')).includes("3000 + 6000 bo'lsa, 9 000") && await p.evaluate(() => document.querySelectorAll('.bk-q').length === 9 && document.querySelectorAll(".bk-q")[2].innerText.includes("nom: \"Sharbat\", narx: \"6000\"")));
  await p.click('.bk-q >> nth=6'); await p.waitForTimeout(250);
  ok('a2: 7-qator — «Massivga qarang»', (await p.innerText('.ql-xabar.xato')).includes('Massivga qarang'));
  await p.click('.bk-q >> nth=1'); await p.waitForTimeout(250);
  ok("a2: 2-qator — topildi, matn va son tushuntirildi", await p.evaluate(() => !!document.querySelector('.bk-q.bk-topildi')) && (await p.innerText('.stage-content')).includes('0 + "3000" = "03000"'));
  await surat(p, '1280-04-a2-topildi');
  await p.click('.am-saqla:has-text("Qo\'shtirnoqni olib tashlash")'); await p.waitForTimeout(400);
  ok("a2: tuzatildi — jami 9 000 so'm, kodda narx: 3000, «Tuzaldi!»", (await jami(p)) === "9 000 so'm" && await p.evaluate(() => document.querySelectorAll('.bk-q.bk-tuzaldi').length === 2 && document.querySelectorAll('.bk-q')[1].innerText.includes('narx: 3000 }') && !document.querySelector('.dk-jami-xato')) && (await p.innerText('.stage-content')).includes('Tuzaldi!'));
  const pm2a = await promptMatn(p);
  ok('a2: prompt — bo\'sh maydonlar {…} bilan', pm2a.includes("Nima bo'ldi: {nima bo'ldi}") && pm2a.includes('{script.js kodini shu yerga qo\'ying}'), pm2a.replace(/\n/g, ' / '));
  await p.fill('.am-maydon >> nth=0 >> input', "Savat 3 deb turibdi, 2 ta qo'shdim"); await p.fill('.am-maydon >> nth=1 >> input', "Savat 2 bo'lsin"); await p.waitForTimeout(200);
  const pm2 = await promptMatn(p);
  ok('a2: prompt — maydonlardan, faqat shu joyni tuzat', pm2.startsWith("Do'konimda xato bor — faqat shu joyni tuzat") && pm2.includes("Nima bo'ldi: Savat 3 deb turibdi, 2 ta qo'shdim") && pm2.includes("Nima bo'lishi kerak: Savat 2 bo'lsin"), pm2.replace(/\n/g, ' / '));
  ok("a2: o'z do'konini tekshirish — 3 band", await p.evaluate(() => document.querySelectorAll('.am-band li').length === 3));
  await kk('a2'); await surat(p, '1280-05-a2-tuzaldi'); await nx(p); await bayram(p);
  // a3
  ok("a3 (05/08): 5 qadam, Saqlash yopiq, maket — mini-dokon.netlify.app", (await raqam(p)) === '05/08' && await p.evaluate(() => document.querySelectorAll('.am-qadam li').length === 5 && document.querySelector('.am-saqla').disabled && document.querySelector('.dk-url').innerText === 'mini-dokon.netlify.app'));
  await p.fill('.am-input', 'bizning dokon'); await p.waitForTimeout(150);
  ok('a3: havola emas — Saqlash yopiq', await p.evaluate(() => document.querySelector('.am-saqla').disabled));
  await p.fill('.am-input', 'https://bizning-dokon.vercel.app'); await p.waitForTimeout(150);
  ok('a3: boshqa domen — ochiq, lekin .netlify.app eslatmasi', !(await p.evaluate(() => document.querySelector('.am-saqla').disabled)) && (await p.innerText('.stage-content')).includes('.netlify.app bilan tugaydi'));
  await p.fill('.am-input', ' https://bizning-dokon.netlify.app '); await p.waitForTimeout(150);
  await p.click('.am-saqla'); await p.waitForTimeout(500);
  ok("a3: saqlandi — karta, havola, xabar, maket manzili", await p.evaluate(() => document.querySelector('.dp-havola')?.getAttribute('href') === 'https://bizning-dokon.netlify.app' && document.querySelector('.dk-url').innerText === 'bizning-dokon.netlify.app' && JSON.parse(localStorage.getItem('ccDokon')).havola === 'https://bizning-dokon.netlify.app') && (await p.innerText('.dp-karta')).includes("Mening do'konim: https://bizning-dokon.netlify.app — savatga"));
  await p.click('button.am-nusxa:has-text("Xabarni nusxalash")'); await p.waitForTimeout(250);
  ok('a3: xabar nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())).startsWith("Mening do'konim: https://bizning-dokon.netlify.app"));
  await kk('a3'); await surat(p, '1280-06-a3');
  await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  ok("a3: qayta yuklansa — o'sha ekran, karta saqlangan", (await raqam(p)) === '05/08' && await p.evaluate(() => !!document.querySelector('.dp-havola')));
  await nx(p); await bayram(p);
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon', cnt === '3', `hisoblagich ${cnt}`);
  ok('s15 (06/08): 5 qadam tartibi', (await raqam(p)) === '06/08' && (await p.innerText('.stage-content')).includes('bir xil 5 qadam'));
  await tartib(p); await bayram(p);
  ok("s15: birinchi urinishda to'g'ri — Davom ochiq", await p.evaluate(() => !!document.querySelector('.dd-done') && ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('s15'); await nx(p); await p.waitForTimeout(800);
  ok('podium (07/08)', (await raqam(p)) === '07/08'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (08/08)', (await raqam(p)) === '08/08');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: massiv/push, for, matn-son, aniq xato, Netlify; uyga vazifa «Buyurtma berish»; Antigravity yo'q", yk.includes('push bilan') && yk.includes('for sikli') && yk.includes('"3000" — matn') && yk.includes("Netlify'ga tashlab") && yk.includes('«Buyurtma berish»') && yk.includes('mini-dokon papkasida') && !/Antigravity|agent/i.test(yk));
  ok('yakun: nishonlar 4/4, 1/1 to\'g\'ri', yk.includes('4/4') && yk.includes("1/1 to'g'ri"));
  await kk('yakun'); await surat(p, '1280-07-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal });
  ok('onFinished: 1/1', fin && fin.tq === 1 && fin.ca === 1, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
// 3) 390 px — katalogsiz (namuna), hamma ekran
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  ok("390 namuna: «Maktab mini-do'koni», 6 karta, «O'tgan darsdagi katalog»", await p.evaluate(() => document.querySelector('.dk-h1').innerText === "Maktab mini-do'koni" && document.querySelectorAll('.dk-karta').length === 6) && (await p.innerText('.stage-content')).includes("O'tgan darsdagi katalog"));
  for (let i = 0; i < 8; i++) {
    if (i === 0) { await savatga(p, 'Ruchka'); await p.waitForTimeout(200); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(300); }
    if (i === 3) { await savatga(p, 'Ruchka'); await savatga(p, "Chizg'ich"); await p.waitForTimeout(200); await p.click('.am-chip:has-text("Jami narx")'); await p.waitForTimeout(300); await p.click('.bk-q >> nth=2'); await p.waitForTimeout(200); await surat(p, '390-3-kod'); }
    if (i === 5) { await tartib(p); await bayram(p); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 7) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (8 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
