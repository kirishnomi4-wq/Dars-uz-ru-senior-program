// F-1015-344 · m3-07 ReactCrudPracticeLesson sinovi (8 ekran): kirish · reja (CRUD namuna) · a1 qo'shish + kod oynasi · a2 TOP/o'chirish + prompt · a3 push xatosi · s14 yakuniy · podium · yakun · nishon · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m307.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/3-Modull/ReactCrudPracticeLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'react-crud-practice-p1-v18';
const page = OUT + '/sinov-m307.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .cardbtn, .am-chip')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kod = (p) => p.evaluate(() => [...document.querySelectorAll('.rj-oyna')].pop()?.innerText || '');
const kartalar = (p) => p.evaluate(() => [...document.querySelectorAll('.roname')].map(x => x.innerText));
// 1) ESKI PROGRESS (22 ekran)
{
  const old = { screen: 15, maxReached: 17, answers: { 4: { correct: true, picked: 1 } }, earned: ['builder'], startedAt: Date.now() - 600000, total: 22, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 22) → 01/08', (await raqam(p)) === '01/08', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  ok('kirish (01/08)', (await raqam(p)) === '01/08');
  await p.click('.cardx >> nth=0').catch(() => {}); await p.waitForTimeout(500);
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400);
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  ok("reja (02/08): sarlavha, CRUD jadvali 4, 3 blok, Antigravity yo'q", (await raqam(p)) === '02/08' && (await p.innerText('.stage-content')).includes("Bugun ro'yxat jonlanadi") && await p.evaluate(() => document.querySelectorAll('.cr-jadval li').length === 4 && document.querySelectorAll('.am-blok-qator li').length === 3) && !/Antigravity/.test(await p.innerText('.stage-content')));
  ok("reja: namunada 3 o'yin", (await kartalar(p)).length === 3);
  await p.click('.stage-content button.chip-on'); await p.waitForTimeout(300);
  ok("reja: «+ O'yin qo'shish» → 4 ta, Piggy", (await kartalar(p)).length === 4 && (await kartalar(p)).includes('Piggy'));
  await p.click('.cardbtn:has-text("TOP") >> nth=0'); await p.waitForTimeout(300);
  ok('reja: TOP → belgisi chiqdi', await p.evaluate(() => document.querySelectorAll('.topbadge').length === 1));
  await p.click('.cardx >> nth=1'); await p.waitForTimeout(300);
  ok("reja: ✕ → 3 ta, Blox Fruits yo'q", (await kartalar(p)).length === 3 && !(await kartalar(p)).includes('Blox Fruits'));
  await p.click('.am-tt-btn'); await p.waitForTimeout(300);
  ok('reja: tayyorlaning — 3 qadam, robo-games, npm run dev', await p.evaluate(() => document.querySelectorAll('.am-tayyor-l li').length === 3 && document.querySelector('.am-tayyor-l').innerText.includes('npm run dev') && document.querySelector('.am-tayyor-l').innerText.includes('robo-games')));
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok("a1 (03/08): 2 o'yin, 4 tanlov, kod — games 2 ta, 5 qadam", (await raqam(p)) === '03/08' && (await kartalar(p)).length === 2 && await p.evaluate(() => document.querySelectorAll('.am-chips .am-chip').length === 4 && document.querySelectorAll('.am-qadam li').length === 5) && (await kod(p)).includes('games = ["Adopt Me!", "Blox Fruits"];'));
  await p.click('.am-chip:has-text("Piggy")'); await p.waitForTimeout(400);
  const k1 = await kod(p);
  ok("a1: Piggy → 3 ta, kod: setGames([...games, {…}]) va games 3 ta", (await kartalar(p)).length === 3 && k1.includes('setGames([...games, { id: 5, name: "Piggy" }]);') && k1.includes('games = ["Adopt Me!", "Blox Fruits", "Piggy"];') && k1.includes('games.length = 3'), k1.replace(/\n/g, ' / '));
  for (const n of ['Tower of Hell', 'Bee Swarm', 'Pet Sim 99']) { await p.click(`.am-chip:has-text("${n}")`); await p.waitForTimeout(150); }
  ok('a1: hammasi qo\'shilgach — «Boshidan»', (await kartalar(p)).length === 6 && await p.evaluate(() => document.querySelector('.am-chips').innerText.includes('Boshidan')));
  await p.click('.am-yordam summary'); await p.waitForTimeout(200);
  ok('a1: yordam kodi — setGames([...games, yangi])', (await p.innerText('.am-yordam')).includes('setGames([...games, yangi]);'));
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  // a2
  ok("a2 (04/08): 4 o'yin, TOP va ✕ tugmalari", (await raqam(p)) === '04/08' && (await kartalar(p)).length === 4 && await p.evaluate(() => document.querySelectorAll('.cardx').length === 4));
  await p.click('.rocard:has(.roname:text-is("Blox Fruits")) .cardbtn:has-text("TOP")'); await p.waitForTimeout(300);
  const k2 = await kod(p);
  ok('a2: TOP → map + {...g}, top: ["Blox Fruits"]', k2.includes('setGames(games.map(g => g.id === 2 ? { ...g, top: !g.top } : g));') && k2.includes('top: ["Blox Fruits"];') && await p.evaluate(() => document.querySelectorAll('.topbadge').length === 1), k2.replace(/\n/g, ' / '));
  await p.click('.rocard:has(.roname:text-is("Brookhaven")) .cardx'); await p.waitForTimeout(300);
  const k3 = await kod(p);
  ok('a2: ✕ → filter, 3 ta', k3.includes('setGames(games.filter(g => g.id !== 3));') && k3.includes('games.length = 3') && (await kartalar(p)).length === 3, k3.replace(/\n/g, ' / '));
  const pm = await promptMatn(p);
  ok('a2: prompt — robo-games, map {...g}, confirm, filter, push/splice yo\'q, kod joyi', pm.startsWith("React loyihamga (robo-games) ikkita amal qo'sh.") && pm.includes('{ ...g, top: !g.top }') && pm.includes('confirm("Rostdan o\'chirilsinmi?")') && pm.includes('games.filter(g => g.id !== id)') && pm.includes('push, splice yo\'q') && pm.includes('{App.jsx va GameCard.jsx kodini shu yerga qo\'ying}'), pm.replace(/\n/g, ' / '));
  ok('a2: tekshirish 3 band', await p.evaluate(() => document.querySelectorAll('.am-band li').length === 3));
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  ok('a1–a2: 1 nishon (Full CRUD!)', (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '1');
  // a3 — push xatosi
  ok('a3 (05/08): AI xatosi ekrani', (await raqam(p)) === '05/08' && (await p.innerText('body')).includes('AMALIYOT 3') || (await p.innerText('body')).includes('Amaliyot 3'));
  await p.locator('xpath=//*[starts-with(normalize-space(.), "games.") and contains(., "push")]').last().click(); await p.waitForTimeout(400);
  await p.click('button.btn:has-text("setGames([...games, yangi])")'); await p.waitForTimeout(500); await bayram(p);
  await kk('a3'); await surat(p, '1280-04-a3');
  ok('a3: tuzatildi — Davom ochiq, 2 nishon', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled && document.querySelector('.ach-counter b')?.innerText === '2'));
  await nx(p); await p.waitForTimeout(700);
  ok('s14 (06/08): yakuniy', (await raqam(p)) === '06/08');
  await p.fill('.vsc-input', 'setGames(games.filter(g => g.id !== id))'); await p.waitForTimeout(600); await bayram(p);
  ok("s14: to'g'ri — Davom ochiq", await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('s14'); await nx(p); await p.waitForTimeout(800);
  ok('podium (07/08)', (await raqam(p)) === '07/08'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (08/08)', (await raqam(p)) === '08/08');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa — like (map), bo'sh nom, robo-games; Antigravity yo'q; 4/4", yk.includes('robo-games loyihangizda') && yk.includes('like') && yk.includes("Bo'sh nom") && !/Antigravity|agent/i.test(yk) && yk.includes('4/4'), yk.slice(-500).replace(/\n/g, ' / '));
  await kk('yakun'); await surat(p, '1280-05-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop()?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers });
  ok('onFinished: 1/1', fin && fin.tq === 1 && fin.ca === 1, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
// 3) 390 px
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 8; i++) {
    if (i === 0) { await p.click('.cardx >> nth=0').catch(() => {}); await p.waitForTimeout(400); await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300); }
    if (i === 2) { await p.click('.am-chip:has-text("Piggy")'); await p.waitForTimeout(200); }
    if (i === 3) { await p.click('.cardbtn:has-text("TOP") >> nth=0'); await p.waitForTimeout(200); }
    if (i === 4) { await p.locator('xpath=//*[starts-with(normalize-space(.), "games.") and contains(., "push")]').last().click(); await p.waitForTimeout(300); await p.click('button.btn:has-text("setGames([...games, yangi])")'); await p.waitForTimeout(400); await bayram(p); }
    if (i === 5) { await p.fill('.vsc-input', 'setGames(games.filter(g => g.id !== id))'); await p.waitForTimeout(500); await bayram(p); }
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
