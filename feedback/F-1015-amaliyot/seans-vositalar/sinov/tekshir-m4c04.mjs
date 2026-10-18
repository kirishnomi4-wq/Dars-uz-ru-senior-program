// F-1015-354 · m4c-04 FullPipelineProjectLesson sinovi (8 ekran): kirish · reja · a1 lenta quruvchisi · a2 KitobShop ci.yml + push maketi · a3 qizil jurnal · s12 · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4c04.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4c-Modull/FullPipelineProjectLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'cicd-full-pipeline-4c-03-v18';
const page = OUT + '/sinov-m4c04.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .ci-row span, .ci-row code, .ci-tablo, .ci-v')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { await p.click('.stage-content button.btn-soft').catch(() => {}); await p.waitForTimeout(2500); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400); };
const quruvchi = async (p) => { const n = await p.locator('.vcard').count(); for (let i = 0; i < n; i++) { await p.locator('.vcard').nth(i).click().catch(() => {}); await p.waitForTimeout(150); } for (const t of ["Yig'ish", 'Skaner', "O'lcham ramkasi", "O'rash", 'Uchirish']) { await p.click(`.dd-chip:not(.in):has-text("${t}")`, { force: true }); await p.waitForTimeout(250); } await p.waitForTimeout(500); await p.click('button.btn:has-text("git push")'); await p.waitForTimeout(5000); await bayram(p); };
const jurnal = async (p) => { await p.click('.dbg-line >> nth=2'); await p.waitForTimeout(800); await bayram(p); };
const kod = (p) => p.evaluate(() => [...document.querySelectorAll('.rj-oyna')].pop()?.innerText || '');
const davomOchiq = (p) => p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled);
const holatlar = (p) => p.evaluate(() => [...document.querySelectorAll('.ci-panel')].pop() ? [...[...document.querySelectorAll('.ci-panel')].pop().querySelectorAll('.ci-row')].map(r => r.className.replace('ci-row ci-', '')).join(',') : '');
{
  const old = { screen: 10, maxReached: 13, answers: { 2: { correct: true, picked: 1 } }, earned: ['blackBox'], startedAt: Date.now() - 600000, total: 18, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 18) → 01/08', (await raqam(p)) === '01/08', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/08)', (await raqam(p)) === '01/08');
  await kirish(p);
  ok('kirish: Davom ochiq', await davomOchiq(p));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await p.innerText('.stage-content');
  ok("reja (02/08): KitobShop, lenta paneli, 3 blok, maket", (await raqam(p)) === '02/08' && rj.includes("KitobShop'ga") && await p.evaluate(() => document.querySelectorAll('.am-blok-qator li').length === 3) && (await holatlar(p)) === 'ok,ok,ok,ok,maket');
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning — git push, npm test, npm run lint', (await p.innerText('.am-tayyor-l')).includes('git push') && (await p.innerText('.am-tayyor-l')).includes('npm run lint'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  ok('a1 (03/08): lenta quruvchisi', (await raqam(p)) === '03/08' && /Amaliyot 1/i.test(await p.innerText('body')));
  await quruvchi(p);
  ok('a1: tizildi va push — Davom ochiq', await davomOchiq(p));
  await kk('a1'); await nx(p); await bayram(p);
  ok('a2 (04/08): ci.yml (checkout, setup-node, npm ci, test, lint, build), 5 kutish', (await raqam(p)) === '04/08' && (await holatlar(p)) === 'kut,kut,kut,kut,kut' && await p.evaluate(() => { const t = [...document.querySelectorAll('.am-masalan')].map(x => x.innerText).join('\n'); return t.includes('actions/checkout@v4') && t.includes('actions/setup-node@v4') && t.includes('npm ci') && t.includes('npm run lint') && t.includes('npm run build'); }));
  await p.click('.am-saqla:has-text("git push")'); await p.waitForTimeout(3000);
  ok('a2: push → 4 ✓ + uchirish maket, TABLO passing', (await holatlar(p)) === 'ok,ok,ok,ok,maket' && (await p.innerText('.ci-tablo')).includes('passing'), await holatlar(p));
  await p.click('.am-chip:has-text("Lint xatosini")'); await p.click('.am-saqla:has-text("git push")'); await p.waitForTimeout(3000);
  const k2 = await kod(p);
  ok('a2: lint xatosi → lint ✗, build va uchirish o\'tkazildi, TABLO failing, jurnalda xato', (await holatlar(p)) === 'ok,ok,fail,skip,skip' && (await p.innerText('.ci-tablo')).includes('failing') && k2.includes("never used"), (await holatlar(p)) + ' / ' + k2.replace(/\n/g, ' | '));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok('a2: ci.yml nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())).startsWith('name: CI\non: push'));
  await kk('a2'); await surat(p, '1280-02-a2'); await nx(p); await bayram(p);
  ok('a3 (05/08): qizil jurnal', (await raqam(p)) === '05/08' && /Amaliyot 3/i.test(await p.innerText('body')));
  await jurnal(p);
  ok('a3: sabab topildi — Davom ochiq', await davomOchiq(p));
  await kk('a3'); await nx(p); await p.waitForTimeout(700);
  ok('s12 (06/08): yakuniy savol, 3 nishon', (await raqam(p)) === '06/08' && (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '3');
  await p.click('button.option >> nth=1'); await p.waitForTimeout(500); await bayram(p);
  await kk('s12'); await nx(p); await p.waitForTimeout(800);
  ok('podium (07/08)', (await raqam(p)) === '07/08'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (08/08)', (await raqam(p)) === '08/08');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa KitobShop; 4/4", yk.includes("KitobShop'ga ci.yml") && yk.includes('4/4'), yk.slice(-400).replace(/\n/g, ' / '));
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
  for (let i = 0; i < 8; i++) {
    if (i === 0) await kirish(p);
    if (i === 2) await quruvchi(p);
    if (i === 3) { await p.click('.am-saqla:has-text("git push")'); await p.waitForTimeout(3000); }
    if (i === 4) await jurnal(p);
    if (i === 5) { await p.click('button.option >> nth=1'); await p.waitForTimeout(400); await bayram(p); }
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
