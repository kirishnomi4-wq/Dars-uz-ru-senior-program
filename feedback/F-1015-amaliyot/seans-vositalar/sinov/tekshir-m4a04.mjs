// F-1015-353 · m4a-04 NestArchPracticeLesson sinovi (9 ekran): kirish · reja · a1 aniq buyruq · a2 Copilot agent playbook · a3 @Roles · a4 eshik sinovi · s15 · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4a04.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4a-Modull/NestArchPracticeLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'nest-arch-practice-4a-03-v18';
const page = OUT + '/sinov-m4a04.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .ag-tek-q span, .swg-path, .swg-sum')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { await p.click('.swg-head >> nth=1').catch(() => {}); await p.waitForTimeout(200); await p.click('button:has-text("Try it out")').catch(() => {}); await p.waitForTimeout(400); await p.click('.hook-option >> nth=0'); await p.waitForTimeout(400); };
const buyruq = async (p) => { await p.click('.vcard >> nth=2'); await p.waitForTimeout(4200); };
const roles = async (p) => { const want = ['public', 'public', 'public', 'admin', 'admin', 'admin']; for (let i = 0; i < 6; i++) { await p.click(`.auth-row >> nth=${i} >> .auth-btn >> nth=${want[i] === 'public' ? 0 : 1}`); await p.waitForTimeout(150); } await p.waitForTimeout(400); await bayram(p); };
const eshik = async (p) => { const n = await p.locator('.dr-cell').count(); for (let i = 0; i < n; i++) { await p.locator('.dr-cell').nth(i).click({ force: true }).catch(() => {}); await p.waitForTimeout(120); } await p.waitForTimeout(300); await p.locator('.ai-line').nth(1).click({ force: true }).catch(() => {}); await p.waitForTimeout(400); await p.click('button.btn:not([disabled])', { timeout: 3000 }).catch(() => {}); await p.waitForTimeout(800); await bayram(p); };
const davomOchiq = (p) => p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled);
{
  const old = { screen: 12, maxReached: 15, answers: { 5: { correct: true, picked: 2 } }, earned: ['guard'], startedAt: Date.now() - 600000, total: 23, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 23) → 01/09', (await raqam(p)) === '01/09', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/09)', (await raqam(p)) === '01/09');
  await kirish(p);
  ok('kirish: Davom ochiq', await davomOchiq(p));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await p.innerText('.stage-content');
  ok("reja (02/09): agent bilan, 3 resurs, 4 blok, Swagger 7 eshik", (await raqam(p)) === '02/09' && rj.includes('agent') && await p.evaluate(() => document.querySelectorAll('.cr-jadval li').length === 3 && document.querySelectorAll('.am-blok-qator li').length === 4 && document.querySelectorAll('.swg-row').length === 7) && !/Antigravity/.test(rj));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok("reja: tayyorlaning — start:dev, Ctrl+Alt+I, «Agent»", (await p.innerText('.am-tayyor-l')).includes('npm run start:dev') && (await p.innerText('.am-tayyor-l')).includes('Ctrl+Alt+I') && (await p.innerText('.am-tayyor-l')).includes('«Agent»'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  ok('a1 (03/09): aniq buyruq', (await raqam(p)) === '03/09' && /Amaliyot 1/i.test(await p.innerText('body')));
  await buyruq(p);
  ok('a1: 3-buyruq — Davom ochiq', await davomOchiq(p));
  await kk('a1'); await nx(p); await bayram(p);
  ok('a2 (04/09): Category playbook, 4 band tekshiruv', (await raqam(p)) === '04/09' && (await p.innerText('.am-masalan')).startsWith("Category resursini qo'sh: Entity (name)") && await p.evaluate(() => document.querySelectorAll('.ag-tek-q').length === 4));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok('a2: playbook nusxalanadi', (await p.evaluate(() => navigator.clipboard.readText())).includes("AppModule'ga ula"));
  for (let i = 0; i < 4; i++) await p.click(`.ag-tek-q >> nth=${i}`);
  await p.waitForTimeout(200);
  ok('a2: Category tekshirildi — 1/3, chip ✓', (await p.innerText('.ql-xabar.info')).includes('1 / 3') && (await p.innerText('.am-chips')).includes('✓ Category'));
  await p.click('.am-chip:has-text("Book")'); await p.waitForTimeout(200);
  const bk = await p.innerText('.am-masalan');
  ok('a2: Book playbook — @ManyToOne, featured, @Roles', bk.includes('@ManyToOne') && bk.includes('GET /book/featured') && bk.includes("@Roles('admin')") && await p.evaluate(() => [...document.querySelectorAll('.ag-tek-q input')].every(x => !x.checked)));
  await p.click('.am-chip:has-text("Order")'); await p.waitForTimeout(200);
  ok("a2: Order playbook — POST /order ochiq, GET /order admin", (await p.innerText('.am-masalan')).includes('POST /order — ochiq') && (await p.innerText('.am-masalan')).includes("GET /order — @Roles('admin')"));
  await p.click('.am-qt-btn'); await p.waitForTimeout(200);
  ok('a2: qadamlar 4 (Keep/Undo)', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 4 && document.querySelector('.am-tt-oyna').innerText.includes('Keep'))); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  await kk('a2'); await surat(p, '1280-02-a2'); await nx(p); await bayram(p);
  ok('a3 (05/09): @Roles', (await raqam(p)) === '05/09' && /Amaliyot 3/i.test(await p.innerText('body')));
  await roles(p);
  ok('a3: 6 eshik to\'g\'ri — Davom ochiq', await davomOchiq(p));
  await kk('a3'); await nx(p); await bayram(p);
  ok('a4 (06/09): eshik sinovi', (await raqam(p)) === '06/09' && /Amaliyot 4/i.test(await p.innerText('body')));
  await eshik(p);
  ok('a4: tuzatildi — Davom ochiq', await davomOchiq(p));
  await kk('a4'); await surat(p, '1280-03-a4'); await nx(p); await p.waitForTimeout(700);
  ok('s15 (07/09): test', (await raqam(p)) === '07/09');
  await p.click('button.option >> nth=1'); await p.waitForTimeout(500); await bayram(p);
  await kk('s15'); await nx(p); await p.waitForTimeout(800);
  ok('podium (08/09)', (await raqam(p)) === '08/09'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa Copilot playbook; 4/4", yk.includes('Copilot agentiga') && yk.includes('4/4'), yk.slice(-400).replace(/\n/g, ' / '));
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
    if (i === 2) await buyruq(p);
    if (i === 4) await roles(p);
    if (i === 5) await eshik(p);
    if (i === 6) { await p.click('button.option >> nth=1'); await p.waitForTimeout(400); await bayram(p); }
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
