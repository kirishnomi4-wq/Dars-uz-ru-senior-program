// F-1015-356 · m4c-07 FullProPipelineLesson sinovi (7 ekran): kirish · reja · a1 ishonchli lenta o'yini · a2 KitobShop ci.yml (matrix 22/24, cache, secrets) + push maketi · s15 tartib · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4c04.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4c-Modull/FullProPipelineLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'full-pro-pipeline-4c-04-v18';
const page = OUT + '/sinov-m4c07.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .ci-row span, .ci-row code, .ci-tablo, .ci-v, .ql-xabar, .vseen, .vlbl')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { await p.click('.stage-content button.btn-soft').catch(() => {}); await p.waitForTimeout(2500); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400); };
const oyin = async (p) => { for (let i = 0; i < 4; i++) { await p.click(`.vcard >> nth=${i}`); await p.waitForTimeout(200); } await p.click('button.btn:has-text("rollback")'); await p.waitForTimeout(900); await bayram(p); };
const tartib = async (p) => { for (const t of ['git push —', 'Lenta —', 'Staging —', "Staging'da tekshirish", 'Production —']) { await p.click(`.dd-chip:not(.in):has-text("${t}")`, { force: true }); await p.waitForTimeout(250); } await p.waitForTimeout(700); await bayram(p); };
const davomOchiq = (p) => p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled);
const matn = (p) => p.innerText('.stage-content');
const holat = (p) => p.evaluate(() => [...[...document.querySelectorAll('.ci-panel')].pop().querySelectorAll('.ci-row')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).join(' | '));
{
  // F-1015-358 (qaror 11-A): production tekshirishdan oldin → ogohlantirish; tuzatilgach Eslatma — 5 bosqichli zanjir
  const st = { screen: 4, maxReached: 4, answers: {}, earned: [], startedAt: Date.now() - 600000, total: 7, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(st) });
  ok('s15 xato: 05/07 ochildi', (await raqam(p)) === '05/07', await raqam(p));
  for (const t of ['git push —', 'Lenta —', 'Staging —', 'Production —', "Staging'da tekshirish"]) { await p.click(`.dd-chip:not(.in):has-text("${t}")`, { force: true }); await p.waitForTimeout(250); }
  await p.waitForTimeout(500);
  ok("s15 xato: «Sinov reysisiz…» ogohlantirishi", (await matn(p)).includes('Sinov reysisiz haqiqiy reysga chiqib ketdi'));
  for (const t of ["Staging'da tekshirish", 'Production —']) { await p.click(`.dd-chip.in:has-text("${t}")`, { force: true }); await p.waitForTimeout(250); }
  for (const t of ["Staging'da tekshirish", 'Production —']) { await p.click(`.dd-chip:not(.in):has-text("${t}")`, { force: true }); await p.waitForTimeout(250); }
  await p.waitForTimeout(700); await bayram(p);
  const yt = await matn(p);
  ok('s15 tuzatildi: Push → Lenta → Staging → Tekshirish → Production', yt.includes('Push → Lenta → Staging → Tekshirish → Production'), yt.slice(-300).replace(/\n/g, ' / '));
  await p.click('.rc-open-mini'); await p.waitForTimeout(400);
  for (let i = 0; i < 2; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(250); }
  const zanjir = await p.evaluate(() => [...document.querySelectorAll('.rc-overlay .rc-chip')].map(e => e.innerText.trim()).join(' > '));
  ok('Eslatma: 5 bosqich (Push > Lenta > Staging > Tekshirish > Production)', zanjir === 'Push > Lenta > Staging > Tekshirish > Production', zanjir);
  await surat(p, '1280-04-s15-eslatma');
  ok("s15 xato: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const old = { screen: 12, maxReached: 15, answers: { 4: { correct: true, picked: 1 } }, earned: ['multiRunner'], startedAt: Date.now() - 600000, total: 20, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 20, eski nishon) → 01/07', (await raqam(p)) === '01/07', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/07)', (await raqam(p)) === '01/07');
  await kirish(p);
  ok('kirish: Davom ochiq, Node 24 / 22 hikoyasi', await davomOchiq(p) && (await matn(p)).includes('Node 24') && (await matn(p)).includes('Node 22'));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  ok('reja (02/07): KitobShop, 2 blok, panel lenta (22) va (24) passing', (await raqam(p)) === '02/07' && (await matn(p)).includes('KitobShop') && await p.evaluate(() => document.querySelectorAll('.am-blok-qator li').length === 2) && (await holat(p)).includes('lenta (22)') && (await p.innerText('.ci-tablo')).includes('passing'));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  const tt = await p.innerText('.am-tayyor-l');
  ok('reja: tayyorlaning — ci.yml, JWT_SECRET, Settings', tt.includes('ci.yml') && tt.includes('JWT_SECRET') && tt.includes('Settings'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  ok('a1 (03/07): ishonchli lenta (maket), production buzuq yuk', (await raqam(p)) === '03/07' && /Amaliyot 1/i.test(await p.innerText('body')) && (await matn(p)).includes("production'dagi buzuq"));
  await oyin(p);
  ok('a1: rollback — Davom ochiq', await davomOchiq(p));
  await kk('a1'); await nx(p); await p.waitForTimeout(700); await bayram(p);
  ok('a2 (04/07): ci.yml — matrix [22, 24], secrets.JWT_SECRET, cache: npm', (await raqam(p)) === '04/07' && await p.evaluate(() => { const t = document.querySelector('.am-masalan').innerText; return t.includes('node: [22, 24]') && t.includes('${{ secrets.JWT_SECRET }}') && t.includes('cache: npm') && t.includes('${{ matrix.node }}'); }));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok('a2: ci.yml nusxalanadi (${{ }} buzilmagan)', (await p.evaluate(() => navigator.clipboard.readText())).includes('JWT_SECRET: ${{ secrets.JWT_SECRET }}'));
  await p.click('.am-saqla'); await p.waitForTimeout(300);
  const j1 = await p.innerText('.rj-oyna');
  ok('a2: 1-push — 2 ish yashil, kesh topilmadi, npm ci 38s, kalit ***', (await holat(p)).includes('1m 04s') && j1.includes('kesh topilmadi') && j1.includes('38s') && j1.includes('JWT_SECRET: ***'), j1.replace(/\n/g, ' | '));
  await p.click('.am-saqla'); await p.waitForTimeout(300);
  const j2 = await p.innerText('.rj-oyna');
  ok("a2: 2-push — kesh tiklandi, npm ci 6s, ish 33s, xabar", j2.includes('kesh tiklandi') && j2.includes('6s') && (await holat(p)).includes('33s') && (await p.innerText('.ql-xabar.info')).includes('38s → 6s'));
  await p.click('.am-chip'); await p.waitForTimeout(300);
  ok('a2: kalit ochiq → jurnalda qiymat, ogohlantirish (secrets)', (await p.innerText('.rj-oyna')).includes('kitob-sir-2026') && (await p.innerText('.ql-xabar.xato')).includes('secrets.JWT_SECRET'));
  await kk('a2-ochiq'); await surat(p, '1280-02-a2-ochiq');
  await p.click('.am-chip'); await p.waitForTimeout(200);
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await p.waitForTimeout(700); await bayram(p);
  ok('s15 (05/07): tartib', (await raqam(p)) === '05/07');
  await tartib(p);
  ok("s15: tartib to'g'ri — Davom ochiq", await davomOchiq(p));
  await kk('s15'); await nx(p); await p.waitForTimeout(800);
  ok('podium (06/07)', (await raqam(p)) === '06/07'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (07/07)', (await raqam(p)) === '07/07');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await matn(p);
  ok('yakun: uyga vazifa KitobShop + kesh o\'lchash; 3/3 nishon', yk.includes("KitobShop ci.yml'iga") && yk.includes('npm ci vaqtini') && yk.includes('3/3'), yk.slice(-500).replace(/\n/g, ' / '));
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
  for (let i = 0; i < 7; i++) {
    if (i === 0) await kirish(p);
    if (i === 2) await oyin(p);
    if (i === 3) { await p.click('.am-saqla'); await p.click('.am-saqla'); await p.waitForTimeout(300); }
    if (i === 4) await tartib(p);
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i < 6) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (7 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
