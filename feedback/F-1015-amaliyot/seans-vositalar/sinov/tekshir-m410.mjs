// F-1015-349 · m4-10 FullstackConnectPracticeLesson sinovi (8 ekran): kirish · reja · a1 fetch manzili · a2 CORS · a3 maydonlar/holat/forma · s14 test · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m410.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4-Modull/FullstackConnectPracticeLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'fullstack-connect-practice-p2-v18';
const page = OUT + '/sinov-m410.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .bk-url span, .db-row span, .pm-status, .json')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { if (await p.$('.k0-och')) { await p.click('.k0-och'); await p.waitForTimeout(700); } await p.click('button.chip:has-text("Yangil")'); await p.waitForTimeout(900); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300); };
const cors = async (p) => { await p.click('button.btn:has-text("ishga tushirish")'); await p.waitForTimeout(2600); await p.click('button.btn:has-text("app.use(cors())")'); await p.waitForTimeout(1800); await bayram(p); };
const kod = (p) => p.evaluate(() => [...document.querySelectorAll('.rj-oyna')].pop()?.innerText || '');
const kartalar = (p) => p.evaluate(() => [...document.querySelectorAll('.scard-name')].map(x => x.innerText));
{
  const old = { screen: 12, maxReached: 15, answers: { 4: { correct: true, picked: 2 } }, earned: ['connected'], startedAt: Date.now() - 600000, total: 20, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 20) → 01/10', (await raqam(p)) === '01/10', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/10)', (await raqam(p)) === '01/10');
  ok("kirish 1-bosqich: jonli sahna (vitrina 3 · ombor 4, Spark yo'lda) + «Saytni ochamiz» (sayt, baza, savol yo'q)", await p.evaluate(() => !!document.querySelector('.us-sahna') && document.querySelectorAll('.us-panel').length === 2 && !!document.querySelector('.us-paket') && !!document.querySelector('.k0-och') && !document.querySelector('.db') && !document.querySelector('.hook-option')));
  await p.click('.k0-och'); await p.waitForTimeout(700);
  ok("kirish 2-bosqich: sim vizuali ketdi; sayt + baza; savol hali yo'q", await p.evaluate(() => !document.querySelector('.us-sahna') && !!document.querySelector('.db') && !!document.querySelector('.bp-window, .win') && !document.querySelector('.hook-option')));
  await surat(p, '1280-00b-kirish-2');
  await p.click('button.chip:has-text("Yangil")'); await p.waitForTimeout(900);
  ok('kirish: yangilangach savol pastdan keldi (3 variant)', await p.evaluate(() => document.querySelectorAll('.k0-savol .hook-option').length === 3));
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300); // kirish() endi qayta bosmaydi
  // (kirish yuqorida bosqichma-bosqich bajarildi — F-1015-386)
  ok('kirish: Davom ochiq', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await p.innerText('.stage-content');
  ok("reja (02/10): gaplashadi, :5173/:3000, Spark namunada, 5 blok (F-1015-390), Antigravity yo'q", (await raqam(p)) === '02/10' && rj.includes('gaplashadi') && rj.includes(':5173') && rj.includes(':3000') && (await kartalar(p)).includes('Chevrolet Spark') && await p.evaluate(() => document.querySelectorAll('.am-blok-qator li').length === 5) && !/Antigravity/i.test(rj));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning — node server.js, npm run dev', (await p.innerText('.am-tayyor-l')).includes('node server.js') && (await p.innerText('.am-tayyor-l')).includes('npm run dev'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  ok("a1 (03/10): eski fayl — 3 mashina, Spark yo'q", (await raqam(p)) === '03/10' && (await kartalar(p)).length === 3 && !(await kartalar(p)).includes('Chevrolet Spark'));
  await p.click('.am-chip:has-text("localhost:3000")'); await p.waitForTimeout(300);
  ok('a1: server manzili — xato holati + CORS konsoli', (await p.innerText('.stage-content')).includes('blocked by CORS policy') && await p.evaluate(() => !!document.querySelector('.site-msg.err')));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok('a1: yangi qator nusxasi', (await p.evaluate(() => navigator.clipboard.readText())) === "fetch('http://localhost:3000/api/cars')");
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  ok('a2 (04/10): CORS — Amaliyot 2', (await raqam(p)) === '04/10' && /Amaliyot 2/i.test(await p.innerText('body')));
  await cors(p);
  ok('a2: tuzatildi — Davom ochiq', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  // F-1015-387: a3 maydonlar + 3 holat · a4 qo'shish formasi
  const ongda = (p) => p.evaluate(() => { const k = [...document.querySelectorAll('.rj-oyna')].pop(); const pk = document.querySelector('.pk-karta'); return !!k && !!pk && k.closest('.col') === pk.closest('.col'); });
  ok('a3 (05/10): 4 mashina (Spark bilan), forma yo\'q', (await raqam(p)) === '05/10' && (await kartalar(p)).length === 4 && !(await p.$('.fs-forma')));
  await p.click('.am-chip:text-is("Yuklanmoqda")'); await p.waitForTimeout(200);
  ok('a3: Yuklanmoqda → skelet, kod setYuklanmoqda', await p.evaluate(() => !!document.querySelector('.scard.skel')) && (await kod(p)).includes('setYuklanmoqda(true);'));
  await p.click('.am-chip:text-is("Xato")'); await p.waitForTimeout(200);
  ok("a3: Xato → «yuklab bo'lmadi»", await p.evaluate(() => !!document.querySelector('.site-msg.err')));
  await p.click('.am-chip:text-is("Tayyor")'); await p.waitForTimeout(200);
  const pm3 = await promptMatn(p);
  ok("a3: prompt — { id, nom, narx, yil }, 3 holat; POST/forma yo'q", pm3.includes('{ id, nom, narx, yil }') && pm3.includes('«Yuklanmoqda...»') && pm3.includes("«Ma'lumotni yuklab bo'lmadi»") && !pm3.includes('POST') && !/forma/i.test(pm3), pm3.replace(/\n/g, ' / '));
  ok("a3: kod oynasi o'ngda; «Tekshiring» 2 band", await ongda(p) && await p.evaluate(() => document.querySelectorAll('.am-band li').length === 2));
  await kk('a3'); await surat(p, '1280-04-a3'); await nx(p); await bayram(p);
  ok("a4 (06/10): forma, bo'sh — Qo'shish yopiq", (await raqam(p)) === '06/10' && await p.evaluate(() => document.querySelector('.fs-forma .am-saqla').disabled));
  await p.fill('.fs-forma .am-input >> nth=0', 'Chevrolet Tracker'); await p.fill('.fs-forma .am-input >> nth=1', '450000'); await p.click('.fs-forma .am-saqla'); await p.waitForTimeout(400);
  const k = await kod(p);
  ok("a4: Qo'shish → 5 mashina, yangi, kod POST", (await kartalar(p)).length === 5 && (await kartalar(p)).includes('Chevrolet Tracker') && k.includes("method: 'POST'") && k.includes('cars.length = 5'), k.replace(/\n/g, ' / '));
  const pm4 = await promptMatn(p);
  ok("a4: prompt — forma, POST, Content-Type, qayta fetch, kod joyi; holatlar yo'q", pm4.includes('POST') && pm4.includes('Content-Type: application/json') && pm4.includes('qayta fetch') && pm4.includes("{Home.jsx kodini shu yerga qo'ying}") && !pm4.includes('Yuklanmoqda'), pm4.replace(/\n/g, ' / '));
  ok("a4: kod oynasi o'ngda; «Tekshiring» 2 band", await ongda(p) && await p.evaluate(() => document.querySelectorAll('.am-band li').length === 2));
  await kk('a4'); await surat(p, '1280-04b-a4'); await nx(p); await bayram(p);
  // F-1015-390: mustaqil ish
  ok("mi (07/10): mustaqil ish — 3 maydon, ixcham qator «0/3», nusxalash yopiq, katta prompt qutisi va «Qadamlar» yo'q (F-1015-391)", (await raqam(p)) === '07/10' && /Mustaqil ish/i.test(await p.innerText('body')) && await p.evaluate(() => document.querySelectorAll('.am-maydon input').length === 3 && document.querySelector('button.am-nusxa').disabled && /0\/3/.test(document.querySelector('.mi-pq-h').innerText) && !document.querySelector('.am-masalan') && document.querySelectorAll('.am-qt-btn').length === 1));
  ok('mi: sahifa aylantirishsiz sig\'adi', await p.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 2), await p.evaluate(() => document.documentElement.scrollHeight + '/' + innerHeight));
  await p.click('.mi-ot'); await p.waitForTimeout(300);
  ok('mi: «Qabul shartlari» oynada — 3 band + «Tez tugatganlarga»', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-band li').length === 3 && /Tez tugatganlarga/.test(document.querySelector('.am-tt-oyna .mi-tez')?.innerText || '')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await p.click('.mi-x >> nth=0'); await p.waitForTimeout(200); await p.click('.mi-tg:not(.mi-x) >> nth=0'); await p.waitForTimeout(200);
  ok("mi: namuna — ✕ o'chiradi (3 qator), Narx → 480 000", await p.evaluate(() => document.querySelectorAll('.mi-qator').length === 3 && document.querySelector('.mi-narx').innerText === '480 000'));
  { const inp = p.locator('.am-maydon input'); await inp.nth(0).fill("har kartochkaga o'chirish tugmasi"); await inp.nth(1).fill('Home.jsx kartochkalarida'); await p.waitForTimeout(200);
    ok("mi: 2 maydon — «2/3», nusxalash yopiq, prompt joy belgisi {qanday}", await p.evaluate(() => document.querySelector('button.am-nusxa').disabled && /2\/3/.test(document.querySelector('.mi-pq-h').innerText)) && (await promptMatn(p)).includes('{qanday}'));
    await inp.nth(2).fill("DELETE yuborib ro'yxatni qayta olsin"); await p.waitForTimeout(200); }
  const pmi = await promptMatn(p);
  ok('mi: «✓ Prompt tayyor»', /Prompt tayyor/.test(await p.innerText('.mi-pq-h')));
  ok("mi: prompt o'quvchi gaplaridan yig'iladi, nusxalash ochiq", pmi.includes("qo'sh: har kartochkaga o'chirish tugmasi.") && pmi.includes('Qayerda: Home.jsx kartochkalarida.') && pmi.includes("Qanday ishlashi kerak: DELETE yuborib ro'yxatni qayta olsin.") && await p.evaluate(() => !document.querySelector('button.am-nusxa').disabled), pmi.replace(/\n/g, ' / '));
  await p.click('button.am-nusxa'); await p.waitForTimeout(250);
  ok('mi: nusxa — to\'liq prompt', (await p.evaluate(() => navigator.clipboard.readText())) === pmi);
  ok('mi: yozganlari saqlanadi (ccAvtoMustaqil)', await p.evaluate(() => JSON.parse(localStorage.getItem('ccAvtoMustaqil') || '{}').qanday === "DELETE yuborib ro'yxatni qayta olsin"));
  await kk('mi'); await surat(p, '1280-04c-mi'); await nx(p); await p.waitForTimeout(700);
  ok('a1–a4: 3 nishon', (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '3');
  ok('s14 (08/10): test', (await raqam(p)) === '08/10');
  await p.click('button.option >> nth=0'); await p.waitForTimeout(500); await bayram(p);
  await kk('s14'); await nx(p); await p.waitForTimeout(800);
  ok('podium (09/10)', (await raqam(p)) === '09/10'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (10/10)', (await raqam(p)) === '10/10');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa — avto-ijara, qidiruv + GET :id (F-1015-390); Antigravity yo'q; 4/4", yk.includes('avto-ijara loyihangizda') && yk.includes('GET /api/cars/:id') && !yk.includes("DELETE so'rov") && !/Antigravity/i.test(yk) && yk.includes('4/4'), yk.slice(-400).replace(/\n/g, ' / '));
  await kk('yakun'); await surat(p, '1280-05-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers });
  ok('onFinished: 1/1', fin && fin.tq === 1 && fin.ca === 1, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 10; i++) {
    if (i === 0) await kirish(p);
    if (i === 2) { await p.click('.am-chip:has-text("localhost:3000")'); await p.waitForTimeout(200); }
    if (i === 3) await cors(p);
    if (i === 5) { await p.fill('.fs-forma .am-input >> nth=0', 'Tracker'); await p.fill('.fs-forma .am-input >> nth=1', '450000'); await p.click('.fs-forma .am-saqla'); await p.waitForTimeout(300); }
    if (i === 7) { await p.click('button.option >> nth=0'); await p.waitForTimeout(400); await bayram(p); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 9) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (10 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{ // F-1015-387: RECAPS 6 — testda «📖 Eslatma» → «Ulangandan keyin — serverdan»
  const seed = { ...self, ['ccProgress:' + ID]: JSON.stringify({ screen: 7, maxReached: 7, answers: {}, earned: [], startedAt: Date.now(), total: 10, savedAt: Date.now() }) };
  const { p, ctx } = await och(seed);
  await p.click('button.option >> nth=1'); await p.waitForTimeout(600);
  const bor = !!(await p.$('.rc-open-mini')); if (bor) { await p.click('.rc-open-mini'); await p.waitForTimeout(500); }
  ok("s14: xato javobdan keyin «📖 Eslatma» → «Ulangandan keyin — serverdan»", bor && /Ulangandan keyin/.test(await p.evaluate(() => document.body.innerText)), bor ? '' : "tugma yo'q");
  await ctx.close();
}
await b.close();
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
