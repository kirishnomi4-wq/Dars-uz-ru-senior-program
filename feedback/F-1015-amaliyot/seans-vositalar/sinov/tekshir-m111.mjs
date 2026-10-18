// F-1015-328/329 · m1-11 DeployLesson sinovi (11 ekran): eski progress · CSS Praktika ipi · a1 forma → prompt · a2 animatsiya jonli · Netlify · onFinished · kontrast · 390 px · suratlar
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m111.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/DeployLesson.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'netlify-deploy-v19';
const page = OUT + '/sinov-m111.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = [];
const ok = (nom, shart, izoh = '') => { natija.push(`${shart ? '✅' : '❌'} ${nom}${izoh ? ' — ' + izoh : ''}`); };
const CSS_IP = { uslub: 'qorongi', css: { nom: 'Sport vaqti', muammo: "seksiya vaqtini telefon qilib so'rash kerak", talab: 'jadval, narx', saqlangan: true } };
async function och(seed, w = 1280, h = 820) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__ok')) { localStorage.clear(); sessionStorage.setItem('__ok', '1'); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); } for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, seed);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
  return { p, ctx, errs };
}
const raqam = (p) => p.evaluate(() => { const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/); return m ? `${m[1]}/${m[2]}` : '?'; });
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }), ccDemoDay: JSON.stringify(CSS_IP) };
const nx = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); return b ? b.innerText.trim() : '-'; });
const nxT = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const bayram = async (p) => { await p.waitForTimeout(600); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300); };
const surat = (p, n) => p.screenshot({ path: `${OUT}/shots/${n}.png` });
const kontrast = (p) => p.evaluate(() => {
  const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
  const bgOf = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const out = [];
  for (const el of document.querySelectorAll('.am-masalan, .am-osti, .am-band li, .am-qadam li, .am-maydon span, .am-input, .am-loyiha-nom, .am-hw li, .am-tayyor-l li, .am-uslub-btn b, .am-uslub-btn span, .am-nusxa, .am-saqla, .ds-h1, .ds-p, .ds-h2, .ds-tag, .ds-tugma, .ds-nav, .ds-ft, .flow-label')) {
    if (!el.offsetParent || !el.innerText.trim() || el.disabled) continue;
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 22) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});

// 1) ESKI PROGRESS (17 ekran)
{
  const old = { screen: 13, maxReached: 16, answers: { 6: { correct: true, picked: 2 } }, earned: ['filefind'], startedAt: Date.now() - 600000, total: 17, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  ok('eski progress (total 17, screen 13) → 01/11', (await raqam(p)) === '01/11', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = []; const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400);
  ok('s0: javob qisqa — «Bugun saytni internetga chiqarib, havola olasiz.» (216-qonun, F-1015-393)', (await p.innerText('.hook-ack')).includes('Bugun saytni internetga chiqarib, havola olasiz.') && (await p.innerText('.hook-ack')).length <= 120);
  await surat(p, '1280-00-s0'); await nx(p); await p.waitForTimeout(600);
  ok('s0 → reja', (await raqam(p)) === '02/11');
  const rj = await p.innerText('.stage-content');
  ok('reja: «Saytingizni davom ettirasiz» + «Avval tayyorlaning» (3)', rj.includes('Saytingizni davom ettirasiz') && !rj.includes('yasaysiz') && await (async () => { await p.click('.am-tt-btn'); await p.waitForTimeout(400); const _tt = await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-tayyor-l li').length); await p.keyboard.press('Escape'); await p.waitForTimeout(250); return _tt === 3; })()); // F-1015-370: oynada
  await kk('reja'); await surat(p, '1280-01-reja'); await nx(p); await p.waitForTimeout(700);
  // a1
  ok('a1 ochildi, «Davom etish» faol', (await raqam(p)) === '03/11' && !(await nxT(p)).d, await raqam(p));
  const inp = p.locator('.am-karta input.am-input');
  ok('a1: mentor gapi — qaysi sahifalar (misol bilan)', (await p.innerText('.stage-content')).includes('yana qaysi sahifalar') && (await p.innerText('.stage-content')).includes('Jadval, Ustozlar, Aloqa'));
  ok('a1: loyiha nomi CSS Praktikadan (Sport vaqti)', (await inp.nth(0).inputValue()) === 'Sport vaqti');
  ok('a1: 1 + 3×2 maydon, prompt yopiq', (await inp.count()) === 7 && !(await p.$('.am-masalan')));
  ok("a1: o'ngda faqat Qadamlar (4), sayt rasmi yo'q (F-1015-329)", await p.evaluate(() => document.querySelectorAll('.am-qadam li').length === 4 && !document.querySelector('.ds')));
  await kk('a1-bosh'); await surat(p, '1280-02-a1-bosh');
  const yoz = [['Jadval', "har kunning mashg'ulotlari"], ['Murabbiylar', 'har murabbiy va sport turi'], ['Aloqa', 'telefon va manzil']];
  for (let i = 0; i < 3; i++) { await inp.nth(1 + i * 2).fill(yoz[i][0]); await inp.nth(2 + i * 2).fill(yoz[i][1]); }
  await p.waitForTimeout(200);
  ok("a1: to'lgach ham «Saqlash»siz prompt yopiq", !(await p.$('.am-masalan')));
  await p.click('.am-saqla'); await p.waitForTimeout(700);
  const pm1 = await p.innerText('.am-masalan');
  ok('a1: prompt — loyiha va 3 sahifa bilan', pm1.includes('Loyiham — «Sport vaqti»') && pm1.includes("– «Jadval» — har kunning mashg'ulotlari;") && pm1.includes('– «Aloqa» — telefon va manzil;') && pm1.includes('index.html dagi menyuni ham yangila'));
  ok("a1: yig'ildi — 4 sahifa ro'yxati", await p.evaluate(() => document.querySelectorAll('.am-hw li').length === 4 && !document.querySelector('.am-sahifa')));
  await p.click('button:has-text("Promptni nusxalash")'); await p.waitForTimeout(250);
  ok('a1: nusxalash — to\'liq prompt', (await p.evaluate(() => navigator.clipboard.readText())) === pm1);
  await kk('a1-tayyor'); await surat(p, '1280-02-a1-tayyor');
  await p.click('button:has-text("Tahrirlash")'); await p.waitForTimeout(300);
  await p.locator('.am-karta input.am-input').nth(5).fill('Aloqa va manzil'); await p.waitForTimeout(300);
  ok('a1: tahrirlashda prompt jonli yangilanadi', (await p.innerText('.am-masalan')).includes('– «Aloqa va manzil» — telefon va manzil;'));
  await p.click('.am-saqla'); await p.waitForTimeout(300);
  const st = await p.evaluate(() => ({ d: JSON.parse(localStorage.getItem('ccDemoDay')), pr: JSON.parse(localStorage.getItem('cc-deploy-project') || 'null') }));
  ok('a1: ccDemoDay.deploy + cc-deploy-project yozildi, CSS ipi saqlandi', st.d.deploy && st.d.deploy.saqlangan && st.d.css.nom === 'Sport vaqti' && st.pr && st.pr.sahifalar.length === 4, JSON.stringify(st.pr).slice(0, 100));
  await nx(p); await p.waitForTimeout(700);
  // a2
  ok('a2 ochildi', (await raqam(p)) === '04/11', await raqam(p));
  ok('a2: 4 animatsiya, tanlanmaguncha prompt yopiq', await p.evaluate(() => document.querySelectorAll('.am-uslub-btn').length === 4 && !document.querySelector('.am-masalan')));
  for (const [i, id] of [[3, 'yozuv'], [0, 'paydo'], [2, 'fon'], [1, 'karta']]) {
    await p.click(`.am-uslub-btn >> nth=${i}`); await p.waitForTimeout(450);
    const holat = await p.evaluate((id) => { const d = document.querySelector('.ds'); const an = id === 'yozuv' ? getComputedStyle(d.querySelector('.ds-h1')).animationName : id === 'paydo' ? getComputedStyle(d.querySelector('.ds-karta')).animationName : id === 'fon' ? getComputedStyle(d.querySelector('.ds-hero')).animationName : getComputedStyle(d.querySelector('.ds-karta')).animationName; return { cls: d.className, an }; }, id);
    ok(`a2: «${id}» — maketda jonli (${holat.an})`, holat.cls.includes('dsa-' + id) && holat.an && holat.an !== 'none', holat.cls);
    if (id === 'yozuv') { await p.waitForTimeout(900); await surat(p, '1280-03-a2-yozuv'); }
  }
  const pm2 = await p.innerText('.am-masalan');
  ok("a2: prompt — tanlangan animatsiya, faqat style.css, reduced-motion", pm2.includes("faqat style.css'ni o'zgartir") && pm2.includes("Sichqoncha kartaga kelganda") && pm2.includes('prefers-reduced-motion'));
  ok("a2: qadamlar yopiq tugmada, o'ngda namuna ostida (F-1015-330)", await p.evaluate(() => { const t = document.querySelector('.am-qt'); const col = t && t.closest('.col'); return !!t && !t.querySelector('.am-qadam') && !!col && !!col.querySelector('.ds') && (col.querySelector('.ds').compareDocumentPosition(t) & 4) > 0; }));
  await p.click('.am-qt-btn'); await p.waitForTimeout(400);
  ok('a2: tugma bosilsa 3 qadam ochiladi', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 3)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  await kk('a2'); await surat(p, '1280-03-a2');
  await nx(p); await p.waitForTimeout(700);
  // a3 scroll (F-1015-329)
  ok('a3 scroll ochildi', (await raqam(p)) === '05/11' && (await p.innerText('.stage-content')).includes('aylantirilganda'), await raqam(p));
  ok('a3: 4 effekt, tanlanmaguncha prompt yopiq', await p.evaluate(() => document.querySelectorAll('.am-uslub-btn').length === 4 && !document.querySelector('.am-masalan')));
  for (const [i, id] of [[0, 'paydo'], [1, 'fon'], [2, 'chiziq'], [3, 'parallaks']]) {
    await p.click(`.am-uslub-btn >> nth=${i}`); await p.waitForTimeout(1600);
    const h = await p.evaluate(() => { const d = document.querySelector('.ds'); const o = d.querySelector('.sm-oyna'); return { cls: d.className, top: Math.round(o.scrollTop), kor: d.querySelectorAll('.sm-blok.kor').length, gizli: [...d.querySelectorAll('.sm-blok')].filter(b => getComputedStyle(b).opacity === '0').length, bg: getComputedStyle(o).backgroundColor, ch: Math.round(d.querySelector('.sm-chiziq').getBoundingClientRect().width), chD: getComputedStyle(d.querySelector('.sm-chiziq')).display, tr: getComputedStyle(d.querySelector('.sm-ill')).transform }; });
    const ishlar = id === 'paydo' ? (h.kor >= 1 && h.top > 0) : id === 'fon' ? /rgb/.test(h.bg) && h.top > 0 : id === 'chiziq' ? (h.chD === 'block' && h.ch > 0) : (h.tr !== 'none');
    ok(`a3: «${id}» — namuna o'zi aylanadi va effekt ko'rinadi`, h.cls.includes('smt-' + id) && ishlar, JSON.stringify(h).slice(0, 160));
    if (id === 'chiziq') await surat(p, '1280-04-a3-chiziq');
  }
  await p.click('.am-qt-btn'); await p.waitForTimeout(400);
  ok('a3: qadamlar tugmasi — 3 qadam ochiladi', await p.evaluate(() => document.querySelectorAll('.am-tt-oyna .am-qadam li').length === 3)); await p.keyboard.press('Escape'); await p.waitForTimeout(250); // F-1015-372: «Qadamlar» oynada
  const pm3 = await p.innerText('.am-masalan');
  ok('a3: prompt — sof CSS (animation-timeline), JavaScript ishlatma', pm3.includes('animation-timeline') && pm3.includes('JavaScript ishlatma') && pm3.includes('Parallaks') === false && pm3.includes('sekinroq siljisin'));
  await kk('a3'); await surat(p, '1280-04-a3');
  await nx(p); await p.waitForTimeout(700);
  // Netlify tushuntirish
  ok('6: Netlify tushuntirish', (await raqam(p)) === '06/11' && (await p.innerText('.stage-content')).includes('qayerda'), await raqam(p));
  await p.click('button.btn:has-text("Boshlash")'); await p.waitForTimeout(2800);
  await surat(p, '1280-05-netlify'); await nx(p); await p.waitForTimeout(600);
  ok('7: «Netlify nima qiladi?»', (await raqam(p)) === '07/11' && (await p.innerText('.stage-content')).includes('Netlify nima qiladi'));
  await p.click('button.option >> nth=1'); await p.waitForTimeout(300); await p.click('button.option >> nth=0'); await p.waitForTimeout(400); await bayram(p); await nx(p); await p.waitForTimeout(600);
  ok("«bosh sahifa fayli» testi yo'q (F-1015-329)", !(await p.innerText('.stage-content')).includes('bosh sahifasi fayli'));
  // sdrop
  ok("8: Netlify'ga yuklash — 5 qadam (kirish + yuklash)", (await raqam(p)) === '08/11' && (await p.innerText('.stage-content')).includes("internetga chiqaring"), await raqam(p));
  ok('8: «Davom etish» qadamlarsiz yopiq', (await nxT(p)).d === true, JSON.stringify(await nxT(p)));
  await surat(p, '1280-05-drop');
  for (let i = 0; i < 5; i++) { await p.click('.dsx-btn'); await p.waitForTimeout(350); }
  await p.fill('input.text-input', 'https://sport-vaqti.netlify.app'); await p.click('button.btn:has-text("Saqlash")'); await p.waitForTimeout(300);
  const lnk = await p.evaluate(() => ({ u: localStorage.getItem('cc-site-url'), pitch: JSON.parse(localStorage.getItem('ccPitch3') || '{}').link }));
  ok('8: havola saqlandi (cc-site-url + ccPitch3.link)', lnk.u === 'https://sport-vaqti.netlify.app' && lnk.pitch === lnk.u, JSON.stringify(lnk));
  await kk('drop'); await nx(p); await p.waitForTimeout(600);
  ok('9: yakuniy savol', (await raqam(p)) === '09/11');
  await p.click('button.option >> nth=3'); await p.waitForTimeout(400); await bayram(p); await nx(p); await p.waitForTimeout(900);
  ok('10: podium', (await raqam(p)) === '10/11');
  await nx(p); await p.waitForTimeout(1500); await bayram(p);
  ok("kartochkalar ekrani yo'q (F-1015-329)", !(await p.$('.fc-card')));
  ok('11: yakun', (await raqam(p)) === '11/11');
  const yk = await p.innerText('.stage-content');
  ok('yakun: takrorlash — sahifalar, animatsiya va scroll', yk.includes("qolgan sahifalarni qo'shish") && yk.includes('scroll effekti'));
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const hw = await p.innerText('.stage-content');
  ok('yakun: uyga vazifa — 4 band + havola', hw.includes('Saytni yangilang') && hw.includes('Havolani yuboring') && hw.includes('https://sport-vaqti.netlify.app'));
  await surat(p, '1280-11-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Yakunlash'))?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal, passed: window.__fin.passed });
  ok('onFinished: 2 savol, 1/2 (s2 birinchi urinish xato)', fin && fin.tq === 2 && fin.ca === 1 && fin.ft === 1, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  await ctx.close();
}
// 3) CSS Praktikasiz (ip yo'q) — bo'sh nom, uslub standart
{
  const { p, ctx, errs } = await och({ ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }), ['ccProgress:' + ID]: JSON.stringify({ screen: 2, maxReached: 2, answers: {}, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() }) });
  ok("ip yo'q: a1 nomi bo'sh", (await p.locator('.am-karta input.am-input').nth(0).inputValue()) === '');
  ok("ip yo'q: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 4) 390 px
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 11; i++) {
    if (i === 0) { await p.click('.hook-option >> nth=1'); await p.waitForTimeout(300); }
    if (i === 3 || i === 4) { await p.click('.am-uslub-btn >> nth=0'); await p.waitForTimeout(300); }
    if (i === 5) { await p.click('button.btn:has-text("Boshlash")'); await p.waitForTimeout(2800); }
    if (i === 6) { await p.click('button.option >> nth=0'); await p.waitForTimeout(300); await bayram(p); }
    if (i === 7) { for (let k = 0; k < 5; k++) { await p.click('.dsx-btn'); await p.waitForTimeout(250); } }
    if (i === 8) { await p.click('button.option >> nth=3'); await p.waitForTimeout(300); await bayram(p); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${String(i).padStart(2, '0')}`);
    if (i < 10) { await nx(p); await p.waitForTimeout(800); await bayram(p); }
  }
  ok("390: gorizontal toshish yo'q (11 ekran)", tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
writeFileSync(OUT + '/natija-m111.txt', natija.join('\n') + '\n');
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
