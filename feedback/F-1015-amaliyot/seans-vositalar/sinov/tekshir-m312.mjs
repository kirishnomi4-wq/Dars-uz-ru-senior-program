// F-1015-346 · m3-12 ReactProjectDayLesson sinovi (8 ekran): kirish · reja (AvtoIjara namunasi) · a1 katalog + mashina sahifasi · a2 ijara + jami · a3 kun xatosi · s14 yakuniy · podium · yakun · onFinished · kontrast · 390 px
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m312.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/3-Modull/ReactProjectDayLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'react-project-day-p3-v18';
const page = OUT + '/sinov-m312.html';
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
  for (const el of document.querySelectorAll('.rj-li, .rj-h1, .rj-h2, .rj-fayl, .dk-h1, .dk-karta b, .dk-narx, .dk-yoq, .dk-url, .dk-teg, .am-qoida-m, .ql-chip b, .ql-joy .ql-n, .ql-sanoq, .ql-zona-h, .ql-xabar, .ql-bosh, .dk-tf, .dk-toifa, .dk-pill, .dk-savatga, .dk-royxat li, .dk-bosh-sahifa, .dk-yoq-t, .dk-qidir, .am-tayyor-ok, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon > span, .am-input, .am-chip, .am-qism, .am-satr, .am-loyiha-nom, .am-nusxa, .am-saqla, .am-blok-teg, .pm-h1, .pm-p, .pm-tugma, .pm-karta, .pm-izoh, .pm-h2, .pm-qoida li, .pm-ft, .flow-label, .am-qt-btn, .pm-taymer b, .pm-taymer small, .am-blok-teg, .dk-jami-q, .dk-savat-l li, .dk-jami-bosh, .dk-tozala, .bk-t, .bk-n, .sk-izoh, .sk-k, .dp-havola, .rj-ok, .rj-bugun, .hook-ack, .hook-option, .am-osti, .cr-jadval li, .cr-son, .roname, .av-link, .av-url, .av-kun b, .av-ijara-l li, .av-jami, .am-chip')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});




const kod = (p) => p.evaluate(() => [...document.querySelectorAll('.rj-oyna')].pop()?.innerText || '');
const jamiT = (p) => p.innerText('.av-jami b').then(t => t.replace(/\u00A0/g, ' '));
const url = (p) => p.evaluate(() => document.querySelector('.av-url b')?.innerText || '');
const kirish = async (p) => { const n = await p.locator('.vcard').count(); for (let k = 0; k < n; k++) { await p.click(`.vcard >> nth=${k}`); await p.waitForTimeout(150); } await p.click('.hook-option >> nth=0'); await p.waitForTimeout(300); };
const xato = async (p) => { await p.click('.ai-line:has-text("s + b.car.price")'); await p.waitForTimeout(400); await p.click('button:has-text("* b.days")'); await p.waitForTimeout(500); await bayram(p); };
{
  const old = { screen: 15, maxReached: 17, answers: { 4: { correct: true, picked: 2 } }, earned: ['lead'], startedAt: Date.now() - 600000, total: 23, savedAt: Date.now() };
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
  ok('kirish: Davom ochiq', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('kirish'); await nx(p); await p.waitForTimeout(700);
  const rj = await p.innerText('.stage-content');
  ok("reja (02/09): AvtoIjara, 3 sahifa, 4 blok, Antigravity/agent yo'q", (await raqam(p)) === '02/09' && rj.includes('AvtoIjara saytini qurasiz') && await p.evaluate(() => document.querySelectorAll('.cr-jadval li').length === 3 && document.querySelectorAll('.am-blok-qator li').length === 4) && !/Antigravity|agent/i.test(rj));
  await p.click('.rocard >> nth=0'); await p.waitForTimeout(300); await p.click('.av-kb[aria-label="+"]'); await p.waitForTimeout(150);
  await p.click('.am-saqla:has-text("Ijaraga olish")'); await p.waitForTimeout(300);
  ok("reja: namuna — Cobalt 4 kun → /bookings, jami 1 120 000 so'm", (await url(p)) === '/bookings' && (await jamiT(p)) === "1 120 000 so'm", await p.innerText('.av-jami').catch(() => '-'));
  await p.click('.am-tt-btn'); await p.waitForTimeout(400);
  ok('reja: tayyorlaning — npm create vite avto-ijara, router', (await p.innerText('.am-tayyor-l')).includes('npm create vite@latest avto-ijara') && (await p.innerText('.am-tayyor-l')).includes('react-router-dom')); await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // F-1015-376: 9 ekran — a1 katalog · a2 mashina+kun · a3 ijaralar+jami
  ok('a1 (03/09): katalog 4, cars.json kichik karta, kod — cars.length = 4', (await raqam(p)) === '03/09' && await p.evaluate(() => document.querySelectorAll('.rocard').length === 4 && !!document.querySelector('.av-json-k') && !document.querySelector('.av-json-k .am-masalan')) && (await kod(p)).includes('cars.length = 4;'));
  await p.click('.am-chip:has-text("Qayta yuklash")'); await p.waitForTimeout(250);
  ok('a1: qayta yuklash — «Yuklanmoqda...», fetch qatori', (await p.innerText('.stage-content')).includes('Yuklanmoqda...') && (await kod(p)).includes('fetch("/cars.json");'));
  await p.waitForTimeout(1100);
  ok('a1: yuklangach 4 kartochka, setCars', await p.evaluate(() => document.querySelectorAll('.rocard').length === 4) && (await kod(p)).includes('setCars(data);'));
  await p.click('.av-json-k button.am-nusxa'); await p.waitForTimeout(250);
  const cj = await p.evaluate(() => navigator.clipboard.readText());
  let jsonOk = false; try { const a = JSON.parse(cj); jsonOk = a.length === 4 && a[1].name === 'Chevrolet Malibu' && a[1].price === 520000; } catch {}
  ok('a1: cars.json nusxasi — haqiqiy JSON, 4 mashina', jsonOk, cj.slice(0, 80));
  await p.click('.av-json-kor'); await p.waitForTimeout(400);
  ok("a1: cars.json «Ko'rish» — oynada JSON", await p.evaluate(() => (document.querySelector('.am-tt-oyna .av-json')?.innerText || '').includes('"Chevrolet Malibu"')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  const pm1 = await promptMatn(p);
  ok("a1: prompt — faqat katalog (fetch, useEffect, Yuklanmoqda), /car/:id yo'q, ≤4 qator", pm1.includes('public/cars.json dan fetch') && pm1.includes('useEffect + useState') && pm1.includes('Yuklanmoqda') && !pm1.includes('/car/:id') && pm1.split('\n').length <= 4, pm1.replace(/\n/g, ' / '));
  ok('a1: «Tekshiring» 2 band — ilova ostida', await p.evaluate(() => { const t = document.querySelector('.am-band'); return !!t && t.querySelectorAll('li').length === 2 && t.closest('.col') === document.querySelector('.av-url').closest('.col'); }));
  await kk('a1'); await surat(p, '1280-02-a1'); await nx(p); await bayram(p);
  ok('a2 (04/09): Bosh sahifadan boshlanadi', (await raqam(p)) === '04/09' && (await url(p)) === '/');
  await p.click('.rocard >> nth=1'); await p.waitForTimeout(300);
  const k1 = await kod(p);
  ok('a2: Malibu → /car/2, useParams "2", find, 520000 * 3 = 1560000', (await url(p)) === '/car/2' && k1.includes('// "2"') && k1.includes('// "Chevrolet Malibu"') && k1.includes('// 520000 * 3 = 1560000'), k1.replace(/\n/g, ' / '));
  await p.click('.av-kb[aria-label="−"]'); await p.click('.av-kb[aria-label="−"]'); await p.waitForTimeout(250);
  ok('a2: kun 1 dan pastga tushmaydi, narx 520 000', (await p.innerText('.av-kun b')).startsWith('1 ') && await p.evaluate(() => document.querySelector('.av-kb[aria-label="−"]').disabled) && (await p.innerText('.av-narx')).replace(/ /g, ' ').includes("= 520 000 so'm") && (await kod(p)).includes('setDays(1);'));
  const pm2 = await promptMatn(p);
  ok("a2: prompt — /car/:id, useParams, find, Link, «−» va «+»; bookings yo'q", pm2.includes('/car/:id') && pm2.includes('useParams') && pm2.includes('find') && pm2.includes('<Link>') && pm2.includes('«−» va «+»') && !pm2.includes('bookings'), pm2.replace(/\n/g, ' / '));
  ok('a2: «Tekshiring» 3 band, hisobsiz', await p.evaluate(() => { const t = document.querySelector('.am-band'); return t.querySelectorAll('li').length === 3 && !/\d{3}\s\d{3}/.test(t.innerText); }));
  await kk('a2'); await surat(p, '1280-03-a2'); await nx(p); await bayram(p);
  ok('a3 (05/09): Cobalt sahifasi, 3 kun', (await raqam(p)) === '05/09' && (await url(p)) === '/car/1');
  await p.click('.av-kb[aria-label="−"]'); await p.waitForTimeout(150);
  await p.click('.am-saqla:has-text("Ijaraga olish")'); await p.waitForTimeout(300);
  await p.click('.av-link:has-text("Bosh")'); await p.waitForTimeout(200); await p.click('.rocard >> nth=1'); await p.waitForTimeout(200);
  await p.click('.am-saqla:has-text("Ijaraga olish")'); await p.waitForTimeout(400);
  const k2 = await kod(p);
  ok("a3: Cobalt 2 kun + Malibu 3 kun → /bookings, jami 2 120 000 so'm, kod for", (await url(p)) === '/bookings' && (await jamiT(p)) === "2 120 000 so'm" && k2.includes('jami = 2120000;') && k2.includes('for: 280000*2 + 520000*3') && k2.includes('setBookings([...bookings, { name: "Chevrolet Malibu", price: 520000, days: 3 }]);'), k2.replace(/\n/g, ' / '));
  const pm3 = await promptMatn(p);
  ok("a3: prompt — setBookings, /bookings, for, kod joyi; useParams yo'q", pm3.includes('setBookings([...bookings, { id, name, price, days }])') && pm3.includes('/bookings') && pm3.includes('for sikli') && pm3.includes("{App.jsx va sahifalar kodini shu yerga qo'ying}") && !pm3.includes('useParams'), pm3.replace(/\n/g, ' / '));
  ok('a3: «Tekshiring» 3 band, hisobsiz', await p.evaluate(() => { const t = document.querySelector('.am-band'); return t.querySelectorAll('li').length === 3 && !/\d{3}\s\d{3}/.test(t.innerText); }));
  await kk('a3'); await surat(p, '1280-03b-a3'); await nx(p); await bayram(p);
  ok('a1–a3: 2 nishon', (await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText)) === '2');
  const a3t = await p.innerText('body');
  ok("a4 (06/09): AI xatosi, «agent» yo'q", (await raqam(p)) === '06/09' && /Amaliyot 4/i.test(a3t) && !/\bagent/i.test(await p.innerText('.stage-content')));
  ok("a3: mentor — Malibu + Cobalt, 2 120 000 va 800 000 so'm; jami ✗ 800 000", (await p.innerText('.stage-content')).includes("jami 2 120 000 so'm bo'lishi kerak, lekin 800 000 so'm") && (await p.innerText('.stage-content')).replace(/\u00A0/g, ' ').includes("800 000 so'm ✗"));
  await xato(p);
  ok("a3: tuzatilgach jami 2 120 000 so'm, ✗ yo'q", ((t) => t.includes("1 560 000 so'm") && t.includes("2 120 000 so'm") && !t.includes("800 000 so'm ✗"))((await p.innerText('.stage-content')).replace(/\u00A0/g, ' ')));
  await kk('a3'); await surat(p, '1280-04-a3');
  ok('a3: tuzatildi — Davom ochiq, 3 nishon', await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled && document.querySelector('.ach-counter b')?.innerText === '3'));
  await nx(p); await p.waitForTimeout(700);
  ok('s14 (07/09): yakuniy', (await raqam(p)) === '07/09');
  await p.fill('.vsc-input', 'b.price * b.days'); await p.waitForTimeout(600); await bayram(p);
  ok("s14: natija — Malibu 1 560 000 + Cobalt 560 000 = 2 120 000 so'm", ((t) => t.includes('Chevrolet Malibu') && t.includes("1 560 000 so'm") && t.includes("560 000 so'm") && t.includes("2 120 000 so'm"))((await p.innerText('.stage-content')).replace(/\u00A0/g, ' ')));
  ok("s14: to'g'ri — Davom ochiq", await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled));
  await kk('s14'); await nx(p); await p.waitForTimeout(800);
  ok('podium (08/09)', (await raqam(p)) === '08/09'); await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const yk = await p.innerText('.stage-content');
  ok("yakun: uyga vazifa — mashina qo'shish, bekor qilish, avto-ijara; Antigravity yo'q; 4/4", yk.includes('avto-ijara loyihangizda') && yk.includes("Mashina qo'shish") && yk.includes('Ijarani bekor qilish') && !/Antigravity|agent/i.test(yk) && yk.includes('4/4'), yk.slice(-400).replace(/\n/g, ' / '));
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
    if (i === 3) { await p.click('.rocard >> nth=0'); await p.waitForTimeout(200); }
    if (i === 4) { await p.click('.am-saqla:has-text("Ijaraga olish")'); await p.waitForTimeout(300); }
    if (i === 5) await xato(p);
    if (i === 6) { await p.fill('.vsc-input', 'b.price * b.days'); await p.waitForTimeout(500); await bayram(p); }
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
