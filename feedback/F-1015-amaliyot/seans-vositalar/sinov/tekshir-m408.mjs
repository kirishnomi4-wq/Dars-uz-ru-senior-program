// F-1015-348 · m4-08 BackendCrudPracticeLesson sinovi (8 ekran): kirish · reja · a1 sxema (SQL) · a2 server (Postman maketi + prompt) · a3 price xatosi · s12 test · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m408.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4-Modull/BackendCrudPracticeLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'backend-crud-practice-p1-v18';
const page = OUT + '/sinov-m408.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .bk-url span, .db-row span, .pm-status, .json')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { await p.click('button.chip:has-text("Mashina")'); await p.waitForTimeout(500); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300); };
const xato = async (p) => { await p.click('.ai-line:has-text("nom, price, yil")'); await p.waitForTimeout(400); await p.click('button.btn:has-text("price → narx")'); await p.waitForTimeout(600); await bayram(p); };
const kod = (p) => p.evaluate(() => [...document.querySelectorAll('.rj-oyna')].pop()?.innerText || '');
const sql = (p) => p.evaluate(() => [...document.querySelectorAll('.am-karta')].find(k => /sql · psql/i.test(k.innerText))?.querySelector('.am-masalan')?.innerText || '');
const qatorlar = (p) => p.evaluate(() => document.querySelectorAll('.db-row:not(.db-head)').length);
{
  const old = { screen: 12, maxReached: 15, answers: { 4: { correct: true, picked: 1 } }, earned: ['blueprint'], startedAt: Date.now() - 600000, total: 19, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 19) → 01/09', (await raqam(p)) === '01/09', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/09)', (await raqam(p)) === '01/09');
  await kirish(p);
  ok('kirish: Davom ochiq', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await p.innerText('.stage-content');
  ok("reja (02/09): backend sarlavhasi («yashaydi» yo'q), GET javobi, zanjir, 4 blok, Antigravity yo'q", (await raqam(p)) === '02/09' && rj.includes('backendini') && !/yashaydi/.test(rj) && rj.includes('"Chevrolet Cobalt"') && await p.evaluate(() => document.querySelectorAll('.bk-zanjir .qcode').length === 4 && document.querySelectorAll('.am-blok-qator li').length === 4) && !/Antigravity/i.test(rj));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning — npm install express pg, psql', (await p.innerText('.am-tayyor-l')).includes('npm install express pg') && (await p.innerText('.am-tayyor-l')).includes('psql -U postgres')); await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  const s1 = await sql(p);
  ok('a1 (03/09): SQL — id, nom, narx; INSERT 2 qator; SELECT', (await raqam(p)) === '03/09' && s1.includes('id SERIAL PRIMARY KEY,\n  nom TEXT,\n  narx INTEGER\n);') && s1.includes("('Chevrolet Cobalt', 280000)") && s1.includes("('Kia K5', 610000)") && s1.includes('SELECT * FROM cars;'), s1.replace(/\n/g, ' / '));
  await p.click('.am-chip:has-text("yil")'); await p.click('.am-chip:has-text("bandmi")'); await p.waitForTimeout(200);
  const s2 = await sql(p);
  ok('a1: yil + bandmi → CREATE da 4 ustun, INSERT da bandmi yo\'q', s2.includes('yil INTEGER,\n  bandmi BOOLEAN') && s2.includes('INSERT INTO cars (nom, narx, yil)') && s2.includes("('Chevrolet Malibu', 520000, 2023)"), s2.replace(/\n/g, ' / '));
  await p.click('.am-chip:has-text("narx —")'); await p.waitForTimeout(200);
  ok('a1: narx olib tashlanmaydi — xabar', (await p.innerText('.ql-xabar.xato')).includes('shart') && (await sql(p)).includes('narx INTEGER'));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok('a1: SQL nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())).startsWith('CREATE TABLE cars ('));
  ok("a1: psql qadamlari sahifada emas — «Qadamlar» oynasida", await p.evaluate(() => !/psql -U postgres/.test(document.querySelector('.stage-content').innerText)) && await (async () => { await p.click('.am-qt-btn'); await p.waitForTimeout(350); const t = await p.innerText('.am-tt-oyna'); await p.keyboard.press('Escape'); await p.waitForTimeout(250); return t.includes('psql -U postgres'); })());
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  // F-1015-384: a2 server + GET · a3 POST/PUT/DELETE; prompt yig'iq, kod oynasi o'ngda, jadval qisqaradi
  const ongda = (p) => p.evaluate(() => { const k = [...document.querySelectorAll('.rj-oyna')].pop(); const pk = document.querySelector('.pk-karta'); return !!k && !!pk && k.closest('.col') === pk.closest('.col') && k.closest('.col') !== document.querySelector('.db').closest('.col'); });
  const promptOyna = async (p) => { await p.click('.pk-kor'); await p.waitForTimeout(400); const t = await p.innerText('.am-tt-oyna .am-masalan'); await p.keyboard.press('Escape'); await p.waitForTimeout(250); return t; };
  ok('a2 (04/09): server va o\'qish — 3 qator, faqat GET', (await raqam(p)) === '04/09' && (await qatorlar(p)) === 3 && await p.evaluate(() => !document.querySelector('.am-chip') && /GET/.test(document.querySelector('.bk-url').innerText)));
  ok("a2: prompt yig'iq — matn ochiq emas, birinchi qator ko'rinadi", await p.evaluate(() => !document.querySelector('.pk-karta .am-masalan') && /avto-ijara-server/.test(document.querySelector('.pk-bosh')?.innerText || '')));
  ok("a2: kod oynasi o'ngda (prompt bilan), jadval chapda", await ongda(p));
  await p.click('.bk-send'); await p.waitForTimeout(300);
  ok("a2: GET → 200, JSON, kod SELECT", (await p.innerText('.pm-status')).includes('200') && (await kod(p)).includes("pool.query('SELECT * FROM cars')"));
  const pm2 = await promptOyna(p);
  ok("a2: prompt (oynada) — Pool, GET, 500, port 3000; POST/PUT/DELETE yo'q", pm2.includes("pg'dan Pool") && pm2.includes('GET /api/cars') && pm2.includes('status 500') && pm2.includes('Port 3000') && !/POST|PUT|DELETE/.test(pm2), pm2.replace(/\n/g, ' / '));
  ok('a2: «Tekshiring» 2 band, hisobsiz', await p.evaluate(() => { const t = document.querySelector('.am-band'); return t.querySelectorAll('li').length === 2 && !/\d{3}\s\d{3}/.test(t.innerText); }));
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  ok('a3 (05/09): yozish — POST, PUT, DELETE', (await raqam(p)) === '05/09' && await p.evaluate(() => [...document.querySelectorAll('.am-chip')].map(c => c.innerText).join(',') === 'POST,PUT,DELETE'));
  await p.click('.bk-send'); await p.waitForTimeout(300);
  ok('a3: POST → 201, 4 qator (Chevrolet Spark), $1 $2 $3', (await p.innerText('.pm-status')).includes('201') && (await qatorlar(p)) === 4 && (await p.innerText('.db')).includes('Chevrolet Spark') && (await kod(p)).includes('VALUES ($1, $2, $3)'));
  for (let k = 0; k < 3; k++) { await p.click('.bk-send'); await p.waitForTimeout(150); }
  ok("a3: 7 qator — jadval qisqaradi (3 + «yana 3 qator» + oxirgisi)", await p.evaluate(() => document.querySelector('.db-cap').innerText.includes('7') && document.querySelectorAll('.db-row:not(.db-head)').length === 5 && /yana 3 qator/.test(document.querySelector('.db-kesik')?.innerText || '')));
  await p.click('.am-chip:text-is("PUT")'); await p.click('.bk-send'); await p.waitForTimeout(300);
  ok('a3: PUT /2 → Malibu 480 000', (await p.innerText('.db')).includes('480 000') && (await kod(p)).includes('WHERE id = $2'));
  await p.click('.am-chip:text-is("DELETE")'); await p.click('.bk-send'); await p.waitForTimeout(300);
  ok("a3: DELETE /1 → Cobalt yo'q", !(await p.innerText('.db')).includes('Cobalt'));
  await p.click('.bk-send'); await p.waitForTimeout(300);
  ok('a3: ikkinchi DELETE → 404', (await p.innerText('.pm-status')).includes('404'));
  const pm3 = await promptOyna(p);
  ok("a3: prompt — express.json, POST, PUT, DELETE, faqat $1 $2, kod joyi; Pool yo'q", pm3.includes('app.use(express.json())') && pm3.includes('POST /api/cars') && pm3.includes('PUT /api/cars/:id') && pm3.includes('DELETE /api/cars/:id') && pm3.includes('faqat $1, $2') && pm3.includes('{server.js kodini shu yerga qo\'ying}') && !pm3.includes('Pool'), pm3.replace(/\n/g, ' / '));
  ok("a3: kod oynasi o'ngda", await ongda(p));
  ok('a3: «Tekshiring» 3 band, hisobsiz', await p.evaluate(() => { const t = document.querySelector('.am-band'); return t.querySelectorAll('li').length === 3 && !/\d{3}\s\d{3}/.test(t.innerText); }));
  await kk('a3'); await surat(p, '1280-03b-a3'); await nx(p); await bayram(p);
  ok('a1–a3: 2 nishon', (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '2');
  ok('a4 (06/09): price xatosi, Amaliyot 4', (await raqam(p)) === '06/09' && /Amaliyot 4/i.test(await p.innerText('body')));
  await xato(p);
  ok('a4: tuzatildi — Davom ochiq, 3 nishon', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled && document.querySelector('.ach-counter b')?.innerText === '3'));
  await kk('a3'); await surat(p, '1280-04-a3'); await nx(p); await p.waitForTimeout(700);
  ok('s12 (07/09): pool.query savoli', (await raqam(p)) === '07/09' && (await p.innerText('.stage-content')).includes('pool.query'));
  await p.click('button.option >> nth=0'); await p.waitForTimeout(500); await bayram(p);
  await kk('s12'); await nx(p); await p.waitForTimeout(800);
  ok('podium (08/09)', (await raqam(p)) === '08/09'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa — avto-ijara-server, GET /:id; Antigravity yo'q; 4/4", yk.includes('avto-ijara-server loyihangizda') && yk.includes('GET /api/cars/:id') && !/Antigravity/i.test(yk) && yk.includes('4/4'), yk.slice(-400).replace(/\n/g, ' / '));
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
  for (let i = 0; i < 9; i++) {
    if (i === 0) await kirish(p);
    if (i === 3) { await p.click('.bk-send'); await p.waitForTimeout(300); }
    if (i === 4) { await p.click('.bk-send'); await p.waitForTimeout(300); }
    if (i === 5) await xato(p);
    if (i === 6) { await p.click('button.option >> nth=0'); await p.waitForTimeout(400); await bayram(p); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 8) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (9 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{ // F-1015-384: RECAPS 6 — yakuniy savolda «Eslatma — Ko'prik va xavfsizlik» (eski «O'qish — GET» emas)
  const seed = { ...self, ['ccProgress:' + ID]: JSON.stringify({ screen: 6, maxReached: 6, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() }) };
  const { p, ctx } = await och(seed);
  await p.click('button.option >> nth=1'); await p.waitForTimeout(600);
  const bor = !!(await p.$('.rc-open-mini')); if (bor) { await p.click('.rc-open-mini'); await p.waitForTimeout(500); }
  const t = await p.evaluate(() => document.body.innerText);
  ok("s12: xato javobdan keyin «📖 Eslatma» → «Ko'prik va xavfsizlik» (eski «O'qish — GET» emas)", bor && /Ko'prik va xavfsizlik/.test(t) && !/O'qish — GET/.test(t), bor ? '' : 'tugma yo\'q');
  await ctx.close();
}
await b.close();
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
