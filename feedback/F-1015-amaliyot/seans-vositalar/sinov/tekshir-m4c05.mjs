// F-1015-355 · m4c-05 AiPipelineProjectLesson sinovi (7 ekran): kirish · reja · a1 Copilot bilan tuzatish o'yini · a2 KitobShop qizil testi (Keep tuzog'i, Undo, follow-up, npm test, push) · s15 tartib · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4c04.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/4c-Modull/AiPipelineProjectLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'cicd-ai-pipeline-4c-05-v18';
const page = OUT + '/sinov-m4c05.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .am-chip, .ci-tablo, .cp-siz, .cp-javob p, .cp-rad, .ai-badge, .cp-chat-h, .ag-tek-q span, .pick-row, .ql-xabar')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kirish = async (p) => { await p.click('.stage-content button.btn-soft').catch(() => {}); await p.waitForTimeout(2500); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400); };
const oyin = async (p) => {
  await p.click('button.btn:has-text("Jurnalni ochish")'); await p.waitForTimeout(900);
  await p.click('.btn-soft:has-text("narx.js 8")'); await p.waitForTimeout(400);
  await p.click('button.btn:has-text("solishtirish")'); await p.waitForTimeout(400);
  await p.click('.pick-row >> nth=1'); await p.waitForTimeout(400);
  await p.click('button.btn:has-text("Number(chegirma)")'); await p.waitForTimeout(400);
  await p.click('button.btn:has-text("lentaga")'); await p.waitForTimeout(900); await bayram(p);
};
const tartib = async (p) => { for (const t of ["Jurnalni o'zingiz", "Copilot'ga aniq", 'Taklifni jurnal', "To'g'ri tuzatasiz", 'Qayta lentaga']) { await p.click(`.dd-chip:not(.in):has-text("${t}")`, { force: true }); await p.waitForTimeout(250); } await p.waitForTimeout(700); await bayram(p); };
const copilot = async (p) => { await p.click('.am-saqla:has-text("Promptni yuborish")'); await p.click('.am-chip:has-text("Undo")'); await p.click('.am-saqla:has-text("Aniqlashtiruvchi")'); await p.click('.am-chip:has-text("Keep")'); await p.click('.am-saqla:has-text("git push")'); await p.waitForTimeout(300); };
const davomOchiq = (p) => p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled);
const matn = (p) => p.innerText('.stage-content');
{
  const old = { screen: 12, maxReached: 15, answers: { 4: { correct: true, picked: 0 } }, earned: ['logReader'], startedAt: Date.now() - 600000, total: 20, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 20) → 01/07', (await raqam(p)) === '01/07', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/07): Copilot, Antigravity yo\'q', (await raqam(p)) === '01/07' && !(await p.innerText('body')).includes('Antigravity'));
  await kirish(p);
  ok('kirish: Davom ochiq, javob Copilot haqida', await davomOchiq(p) && (await matn(p)).includes('Copilot'));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await matn(p);
  ok('reja (02/07): Copilot Chat, 2 blok, lenta, Antigravity/yordamchi yo\'q', (await raqam(p)) === '02/07' && rj.includes('Copilot Chat') && !/Antigravity|yordamchi/i.test(rj) && await p.evaluate(() => document.querySelectorAll('.am-blok-qator li').length === 2));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  const tt = await p.innerText('.am-tayyor-l');
  ok('reja: tayyorlaning — ci.yml, npm test, Ctrl+Alt+I, «Agent»', tt.includes('ci.yml') && tt.includes('npm test') && tt.includes('Ctrl+Alt+I') && tt.includes('«Agent»'));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  ok('a1 (03/07): Copilot bilan tuzatish o\'yini', (await raqam(p)) === '03/07' && /Amaliyot 1/i.test(await p.innerText('body')));
  await oyin(p);
  ok('a1: yashil — Davom ochiq, Copilot nomi', await davomOchiq(p) && (await matn(p)).includes("Copilot'ning"));
  await kk('a1'); await nx(p); await p.waitForTimeout(700); await bayram(p);
  ok('a2 (04/07): qizil jurnal order.spec.ts, Expected 20000 / Received 10002, CI failing', (await raqam(p)) === '04/07' && (await p.innerText('.rj-oyna')).includes('Received: 10002') && (await p.innerText('.ci-tablo')).includes('failing'));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok('a2: 1-prompt nusxalanadi (jurnal + «Sababini top»)', (await p.evaluate(() => navigator.clipboard.readText())).includes('Expected: 20000') && (await p.evaluate(() => navigator.clipboard.readText())).includes('Sababini top va tuzat'));
  await p.click('.am-saqla:has-text("Promptni yuborish")'); await p.waitForTimeout(300);
  ok('a2: 1-javob testni o\'zgartiradi (order.spec.ts diff)', (await p.innerText('.cp-chat')).includes('toBe(10002)'));
  await p.click('.am-chip:has-text("Keep")'); await p.waitForTimeout(300);
  ok('a2: Keep → ogohlantirish (10 002 so\'m, Undo bosing)', (await p.innerText('.ql-xabar.xato')).includes('Undo'));
  await kk('a2-tuzoq'); await surat(p, '1280-02-a2-tuzoq');
  await p.click('.am-chip:has-text("Undo")'); await p.waitForTimeout(300);
  ok('a2: Undo → rad etildi, o\'ngda aniqlashtiruvchi so\'rov', (await p.innerText('.cp-chat')).includes('Rad etildi') && /aniqlashtiruvchi/i.test(await p.innerText('.am-karta:has(.am-masalan) .flow-label')));
  await p.click('.am-karta:has(.am-masalan) button.am-nusxa'); await p.waitForTimeout(250);
  ok("a2: follow-up nusxasi «Testni o'zgartirma»", (await p.evaluate(() => navigator.clipboard.readText())).startsWith("Testni o'zgartirma"));
  await p.click('.am-saqla:has-text("Aniqlashtiruvchi")'); await p.waitForTimeout(300);
  ok('a2: 2-javob order.ts ni tuzatadi (+ → *)', (await p.innerText('.cp-chat')).includes('return price * quantity;'));
  await p.click('.am-chip:has-text("Undo")'); await p.waitForTimeout(200);
  ok("a2: 2-javobda Undo → «bu safar to'g'ri» izohi", (await p.innerText('.cp-chat')).includes("to'g'ri"));
  await p.click('.am-chip:has-text("Keep")'); await p.waitForTimeout(300);
  ok('a2: Keep → npm test PASS', (await p.innerText('.cp-chat')).includes('PASS  order.spec.ts'));
  await p.click('.am-saqla:has-text("git push")'); await p.waitForTimeout(300);
  ok('a2: push → CI passing, 4 ✓', (await p.innerText('.ci-tablo')).includes('passing') && (await p.innerText('.rj-oyna')).includes('npm run build'));
  for (let i = 0; i < 3; i++) await p.click(`.ag-tek-q >> nth=${i}`);
  ok('a2: tekshiruv 3 band belgilanadi', await p.evaluate(() => [...document.querySelectorAll('.ag-tek-q input')].filter(x => x.checked).length === 3));
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await p.waitForTimeout(700); await bayram(p);
  ok('s15 (05/07): tartib', (await raqam(p)) === '05/07');
  await tartib(p);
  ok('s15: tartib to\'g\'ri — Davom ochiq', await davomOchiq(p));
  await kk('s15'); await nx(p); await p.waitForTimeout(800);
  ok('podium (06/07)', (await raqam(p)) === '06/07'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (07/07)', (await raqam(p)) === '07/07');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await matn(p);
  ok('yakun: uyga vazifa KitobShop + Copilot Chat; 3/3 nishon; Antigravity yo\'q', yk.includes('KitobShop') && yk.includes('Copilot Chat') && yk.includes('3/3') && !yk.includes('Antigravity'), yk.slice(-500).replace(/\n/g, ' / '));
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
    if (i === 3) await copilot(p);
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
