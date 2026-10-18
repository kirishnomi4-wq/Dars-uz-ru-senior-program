// F-1015-350 · m4-13 FullstackProjectDayLesson sinovi (9 ekran): kirish · reja · a1 baza · a2 server · a3 panel · a4 JOIN · s16 · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m413.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4-Modull/FullstackProjectDayLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'fullstack-projectday-p3-v18';
const page = OUT + '/sinov-m413.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .db-row span, .spot-num, .guard-title, .gst, .guard-sum')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { await p.click('.paper'); await p.waitForTimeout(600); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300); };
const join = async (p) => { await p.click('button.btn:has-text("JOIN bilan")'); await p.waitForTimeout(1200); await bayram(p); };
const kod = (p) => p.evaluate(() => [...document.querySelectorAll('.rj-oyna')].pop()?.innerText || '');
const spot = (p, r) => p.click(`.spot:has(.spot-num:text-is("${r}"))`);
{
  const old = { screen: 14, maxReached: 18, answers: { 4: { correct: true, picked: 2 } }, earned: ['architect'], startedAt: Date.now() - 600000, total: 25, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 25) → 01/09', (await raqam(p)) === '01/09', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/09)', (await raqam(p)) === '01/09');
  await kirish(p);
  ok('kirish: Davom ochiq', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  { const ack = await p.innerText('.hook-ack'); // F-1015-392: qisqa javob — variantga bitta gap + «Bugun…»
    ok('kirish: javob qisqa (≤ 120 belgi), «Bugun…» qatori, «daftar» yo\'q, ⛶ yo\'q', ack.length <= 120 && ack.includes('Bugun qorovul uchun panel') && !/daftar/i.test(await p.innerText('.stage-content')) && !(await p.$('.stage-content .zoom-btn, .stage-content .zoomable')), ack); }
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await p.innerText('.stage-content');
  ok("reja (02/09): panel namunasi, 2 jadval, 4 blok, Antigravity/agent yo'q", (await raqam(p)) === '02/09' && rj.includes('stoyanka paneli') && rj.includes('sessiyalar') && await p.evaluate(() => document.querySelectorAll('.am-blok-qator li').length === 4 && document.querySelectorAll('.spot').length === 8) && !/Antigravity|agent/i.test(rj));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning — express pg cors, vite avto-stoyanka', (await p.innerText('.am-tayyor-l')).includes('npm install express pg cors') && (await p.innerText('.am-tayyor-l')).includes('avto-stoyanka'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  ok('a1 (03/09): A2 tanlangan — 2 sessiya, kod WHERE joy_id = 2', (await raqam(p)) === '03/09' && (await kod(p)).includes('WHERE joy_id = 2;') && (await kod(p)).includes('2 ta sessiya'));
  await spot(p, 'B1'); await p.waitForTimeout(300);
  ok('a1: B1 → joy_id = 5, 1 sessiya', (await kod(p)).includes('WHERE joy_id = 5;') && (await kod(p)).includes('1 ta sessiya'));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  const sq = await p.evaluate(() => navigator.clipboard.readText());
  ok('a1: SQL — 2 jadval, REFERENCES, 8 joy', sq.includes('CREATE TABLE joylar') && sq.includes('joy_id INTEGER REFERENCES joylar(id)') && sq.includes("('B4')"), sq.slice(0, 60));
  ok('a1: Terminal qadamlari oynada (ro\'yxat yo\'q), sahifa aylantirishsiz', !(await p.$('.am-qadam')) && !!(await p.$('.am-qt-btn')) && await p.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 2), await p.evaluate(() => document.documentElement.scrollHeight + '/' + innerHeight));
  await p.click('.am-qt-btn'); await p.waitForTimeout(300);
  ok('a1: oyna — 4 qadam, INSERT qatori oynadan chiqmaydi', await p.evaluate(() => { const o = document.querySelector('.am-tt-oyna'); return !!o && o.querySelectorAll('li').length === 4 && o.scrollWidth <= o.clientWidth + 1; }));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  ok('a2 (04/09): server', (await raqam(p)) === '04/09');
  await spot(p, 'A1'); await p.waitForTimeout(300);
  const k1 = await kod(p);
  ok('a2: A1 kirish → UPDATE bandmi = true + INSERT sessiya', k1.includes('UPDATE joylar SET bandmi = true WHERE id = 1;') && k1.includes('INSERT INTO sessiyalar (joy_id, mashina) VALUES (1,'), k1.replace(/\n/g, ' / '));
  await spot(p, 'A2'); await p.waitForTimeout(300);
  const k2 = await kod(p);
  ok("a2: A2 chiqish → bandmi = false + tolov, tushum 10 000", k2.includes('UPDATE joylar SET bandmi = false WHERE id = 2;') && k2.includes('chiqqan IS NULL') && (await p.innerText('.guard-sum')).includes('10 000'), k2.replace(/\n/g, ' / '));
  const pm = await promptMatn(p);
  ok('a2: prompt — 4 endpoint, chiqqan IS NULL, SUM, cors', pm.includes('GET /api/joylar') && pm.includes('POST /api/kirish') && pm.includes('PUT /api/chiqish/:joy_id') && pm.includes('chiqqan IS NULL') && pm.includes('SUM') && pm.includes('cors'), pm.replace(/\n/g, ' / '));
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  ok('a3 (05/09): panel, tushum 20 000', (await raqam(p)) === '05/09' && (await p.innerText('.guard-sum')).includes('20 000'));
  await spot(p, 'A3'); await p.waitForTimeout(300);
  ok("a3: bo'sh joy → forma, bo'sh raqamda yopiq", await p.evaluate(() => document.querySelector('.fs-forma .am-saqla').disabled));
  await p.fill('.fs-forma .am-input', '01a777aa'); await p.click('.fs-forma .am-saqla'); await p.waitForTimeout(300);
  ok('a3: Kirgizish → A3 band, raqam katta harfda, kod POST', (await p.innerText('.pgrid')).includes('01A777AA') && (await kod(p)).includes("method: 'POST'"));
  await spot(p, 'A3'); await p.waitForTimeout(200); await p.click('.fs-forma .am-saqla'); await p.waitForTimeout(300);
  ok('a3: Chiqarish → tushum 30 000, kod PUT', (await p.innerText('.guard-sum')).includes('30 000') && (await kod(p)).includes("method: 'PUT'"));
  const pm3 = await promptMatn(p);
  ok("a3: prompt — fetch joylar/tushum, BO'SH/BAND, forma POST, PUT, qayta yuklash", pm3.includes('GET /api/joylar va GET /api/tushum') && pm3.includes("«BO'SH»") && pm3.includes('POST /api/kirish') && pm3.includes('PUT /api/chiqish/:joy_id') && pm3.includes('qayta yuklansin'), pm3.replace(/\n/g, ' / '));
  await kk('a3'); await surat(p, '1280-04-a3'); await nx(p); await bayram(p);
  ok('a1–a3: 2 nishon', (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '2');
  ok('a4 (06/09): JOIN — Amaliyot 4', (await raqam(p)) === '06/09' && /Amaliyot 4/i.test(await p.innerText('body')));
  await join(p);
  ok('a4: JOIN bajarildi — Davom ochiq', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('a4'); await nx(p); await bayram(p); await p.waitForTimeout(500);
  ok('s16 (07/09): yakuniy, 3 nishon', (await raqam(p)) === '07/09' && (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '3');
  await p.fill('.vsc-input', 'sessiyalar.joy_id = joylar.id'); await p.waitForTimeout(600); await bayram(p);
  ok("s16: to'g'ri — Davom ochiq", await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('s16'); await nx(p); await p.waitForTimeout(800);
  ok('podium (08/09)', (await raqam(p)) === '08/09'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa avto-stoyanka (Gemini), Antigravity/agent yo'q, 4/4", yk.includes('avto-stoyanka loyihangizda') && !/Antigravity|\bagent/i.test(yk) && yk.includes('4/4'), yk.slice(-300).replace(/\n/g, ' / '));
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
    if (i === 3) { await spot(p, 'A1'); await p.waitForTimeout(200); }
    if (i === 4) { await spot(p, 'A3'); await p.waitForTimeout(200); await p.fill('.fs-forma .am-input', '01A1'); }
    if (i === 5) await join(p);
    if (i === 6) { await p.fill('.vsc-input', 'sessiyalar.joy_id = joylar.id'); await p.waitForTimeout(500); await bayram(p); }
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
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
