// F-1015-320 · m1-08 HtmlPractice sinovi: eski progress · oqim (forma → Saqlash → prompt → Tahrirlash) · nishonlar · s5 · a4 · yakun · kontrast · 390 px · suratlar
// Chaqirish (repo ildizidan): node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m108.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/HtmlPractice.jsx';
const OUT = process.argv[2];
const LANG = process.argv[3] || 'uz';
mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: ${JSON.stringify(LANG)}, onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'html-practice-portfolio-v2';
const page = OUT + '/sinov-m108.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = [];
const ok = (nom, shart, izoh = '') => { natija.push(`${shart ? '✅' : '❌'} ${nom}${izoh ? ' — ' + izoh : ''}`); };
async function och(seed, w = 1280, h = 820, clear = true) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript(([s, c]) => { if (c && !sessionStorage.getItem('__ok')) { localStorage.clear(); sessionStorage.setItem('__ok', '1'); } for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, [seed, clear]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
  return { p, ctx, errs };
}
const raqam = (p) => p.evaluate(() => { const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/); return m ? `${m[1]}/${m[2]}` : '?'; });
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }) };
const nx = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); return b ? b.innerText.trim() : '-'; });
const nxFaol = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); return !!b && !b.disabled; });
const bayramYop = async (p) => { await p.waitForTimeout(700); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(400); };
const kontrast = (p) => p.evaluate(() => {
  const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
  const bgOf = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const out = [];
  for (const el of document.querySelectorAll('.qcode, .am-masalan, .am-osti, .am-izoh, .am-band li, .am-qadam li, .am-maydon span, .am-input, .am-satr, .am-loyiha-nom, .am-tayyor-l li, .am-tayyor-s, .am-tayyor-ok, .am-soni, .q-yorliq, .q-btn, .q-reja-t, .q-reja-teg, .pf-h1, .pf-h2, .pf-p, .pf-menu-s, .pf-pochta-s, .pf-foot, .mentor-msg')) {
    if (!el.offsetParent || !el.innerText.trim()) continue;
    if (el.disabled) continue; // faol bo'lmagan tugma — WCAG istisno
    const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
    const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 24) + '»', k: Math.round(k * 100) / 100 });
  }
  return out;
});
const surat = (p, nom) => p.screenshot({ path: `${OUT}/shots/${nom}.png`, fullPage: false });

// 1) ESKI PROGRESS: 13 ekranli dars, 10-ekranda saqlangan
{
  const old = { screen: 10, maxReached: 12, answers: { 4: { correct: true, picked: 2 }, 7: { correct: true, picked: 3 } }, earned: ['built'], startedAt: Date.now() - 600000, total: 13, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  const r = await raqam(p); const txt = (await p.evaluate(() => document.querySelector('.stage-content')?.innerText || '')).trim();
  ok('eski progress (total 13, screen 10) → 01/09', r === '01/09', r);
  ok("eski progress: ekran bo'sh emas", txt.length > 40, `${txt.length} belgi`);
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
  const bad = { screen: 25, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() };
  const o2 = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(bad) });
  ok('total 9, screen 25 → 09/09 (clamp)', (await raqam(o2.p)) === '09/09', await raqam(o2.p));
  ok("clamp: pageerror yo'q", o2.errs.length === 0, o2.errs.join(' | '));
  await o2.ctx.close();
}

// 2) OQIM
{
  const { p, ctx, errs } = await och(self);
  const K = [];
  const kk = async (e) => K.push(...(await kontrast(p)).map(x => ({ ...x, e })));
  await kk('s0'); await surat(p, '1280-0-s0');
  await p.click('.q-variant >> nth=1'); await p.waitForTimeout(500);
  ok('s0: to\'g\'ri javob — «Aynan!»', (await p.innerText('.stage-content')).includes('Aynan!'));
  await nx(p); await p.waitForTimeout(600); ok('s0 → s1', (await raqam(p)) === '02/09');
  await kk('s1'); await surat(p, '1280-1-s1');
  ok('s1: «Avval tayyorlaning» (3 qadam) + 3 blok', await p.evaluate(() => document.querySelectorAll('.am-tayyor-l li').length === 3 && document.querySelectorAll('.q-reja-k').length === 3));
  ok('s1: «Avval tayyorlaning» — reja ustida', await p.evaluate(() => document.querySelector('.am-tayyor').getBoundingClientRect().top < document.querySelector('.q-split').getBoundingClientRect().top));
  await nx(p); await p.waitForTimeout(600);
  // a1
  ok('a1 ochildi, «Davom etish» faol', (await raqam(p)) === '03/09' && await nxFaol(p), await raqam(p));
  ok('a1: boshida faqat forma (3 maydon, prompt yopiq)', await p.evaluate(() => !document.querySelector('.am-masalan') && document.querySelectorAll('.am-maydon input').length === 3));
  ok("a1: o'ngda Qadamlar (4) + kutilgan natija", await p.evaluate(() => document.querySelectorAll('.am-qadam li').length === 4 && !!document.querySelector('.pf-win.xom')));
  const sq = () => p.evaluate(() => { const b = [...document.querySelectorAll('button.q-btn')].find(x => /Saqlash|to'ldiring/.test(x.innerText)); return b ? { t: b.innerText, d: b.disabled } : null; });
  ok("a1: bo'sh forma — «Uchala qatorni to'ldiring», faol emas", JSON.stringify(await sq()) === JSON.stringify({ t: "Uchala qatorni to'ldiring", d: true }), JSON.stringify(await sq()));
  await kk('a1-bosh'); await surat(p, '1280-2-a1-bosh');
  { const inp = p.locator('.am-maydon input'); await inp.nth(0).fill('Jasur Aliyev'); await inp.nth(1).fill("Boshlovchi dasturchi"); await inp.nth(2).fill("HTML o'rganyapman. Futbolni yaxshi ko'raman."); await p.waitForTimeout(300); }
  ok("a1: to'lgach ham «Saqlash»siz prompt yopiq", await p.evaluate(() => !document.querySelector('.am-masalan')));
  await p.click('button.q-btn:has-text("Saqlash")'); await p.waitForTimeout(700);
  ok("a1: saqlangach forma yig'ildi", await p.evaluate(() => !document.querySelector('.am-maydon') && document.querySelector('.am-loyiha-nom')?.innerText === 'Jasur Aliyev'));
  let pm = await p.innerText('.am-masalan');
  ok("a1: prompt — o'quvchi yozgani bilan", pm.includes('ismim — Jasur Aliyev') && pm.includes("Futbolni yaxshi ko'raman") && pm.includes('<section id="men">'));
  await p.click('button:has-text("Promptni nusxalash")'); await p.waitForTimeout(250);
  ok('a1: nusxalash — to\'liq prompt', (await p.evaluate(() => navigator.clipboard.readText())) === pm);
  await kk('a1-tayyor'); await surat(p, '1280-2-a1-tayyor');
  await p.click('button:has-text("Tahrirlash")'); await p.waitForTimeout(300);
  await p.locator('.am-maydon input').nth(0).fill('Jasur Aliyev Jr'); await p.waitForTimeout(300);
  ok('a1: tahrirlashda prompt jonli yangilanadi', (await p.innerText('.am-masalan')).includes('ismim — Jasur Aliyev Jr'));
  await p.click('button.q-btn:has-text("Saqlash")'); await p.waitForTimeout(300);
  ok("a1: namuna kodi / «Bajardim» yo'q", await p.evaluate(() => !/Namuna kodini|Bajardim/.test(document.body.innerText)));
  const pf = await p.evaluate(() => JSON.parse(localStorage.getItem('ccPortfolio')));
  ok('a1: ccPortfolio ga yozildi', pf && pf.ism === 'Jasur Aliyev Jr' && pf.a1Saqlangan === true, JSON.stringify(pf).slice(0, 90));
  await nx(p); await bayramYop(p);
  // a2
  ok('a2 ochildi', (await raqam(p)) === '04/09', await raqam(p));
  ok('a2: 4 maydon + xavfsizlik izohi', await p.evaluate(() => document.querySelectorAll('.am-maydon input').length === 4 && document.body.innerText.includes('Haqiqiy telefon raqamingiz')));
  { const inp = p.locator('.am-maydon input'); await inp.nth(0).fill('Birinchi HTML sahifam'); await inp.nth(1).fill('Ro\'yxatdan o\'tish formasi'); await inp.nth(2).fill('Kartochka'); await inp.nth(3).fill('jasur@mail.uz'); await p.waitForTimeout(200); }
  await p.click('button.q-btn:has-text("Saqlash")'); await p.waitForTimeout(700);
  pm = await p.innerText('.am-masalan');
  ok('a2: prompt — loyihalar, pochta, a1 dagi ism', pm.includes('Birinchi HTML sahifam; Ro\'yxatdan o\'tish formasi; Kartochka') && pm.includes('jasur@mail.uz (mailto:)') && pm.includes('<footer>: Jasur Aliyev Jr, 2026') && pm.includes('#aloqa'));
  await kk('a2'); await surat(p, '1280-3-a2');
  await nx(p); await bayramYop(p);
  // a3
  ok('a3 ochildi', (await raqam(p)) === '05/09', await raqam(p));
  ok('a3: rang yozilmaguncha prompt yopiq', await p.evaluate(() => !document.querySelector('.am-masalan')));
  await p.locator('.am-maydon input').nth(0).fill("ko'k"); await p.waitForTimeout(500);
  pm = await p.innerText('.am-masalan');
  ok('a3: prompt — rang bilan, faqat style.css', pm.includes("Asosiy rang — ko'k") && pm.includes("faqat style.css'ni yoz"));
  ok('a3: qadamlar (3) + dizaynli namuna', await p.evaluate(() => document.querySelectorAll('.am-qadam li').length === 3 && !!document.querySelector('.pf-win.uslub')));
  await kk('a3'); await surat(p, '1280-4-a3');
  await nx(p); await bayramYop(p);
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon', cnt === '3', `hisoblagich ${cnt}`);
  // s5
  ok('s5 ochildi', (await raqam(p)) === '06/09', await raqam(p));
  ok("s5: standart test (tor, mentor qatorisiz) — F-1015-324", await p.evaluate(() => !!document.querySelector('.stage-content.narrow') && !document.querySelector('.stage-content .mentor')));
  await kk('s5'); await surat(p, '1280-5-s5');
  await p.click('.q-test-v >> nth=0'); await p.waitForTimeout(300);
  ok('s5: A xato — izoh', (await p.innerText('.stage-content')).includes("bo'lmasa ham ishlaydi"));
  await p.click('.q-test-v >> nth=3'); await p.waitForTimeout(300);
  ok("s5: D to'g'ri — izoh", (await p.innerText('.stage-content')).includes('topmasa, joyida qoladi'));
  await nx(p); await p.waitForTimeout(600);
  // a4
  ok('s5 → a4 yaxshilash', (await raqam(p)) === '07/09' && (await p.innerText('.stage-content')).includes('tekshiring va yaxshilang'));
  ok('a4: boshida prompt yopiq, ro\'yxat 5 band', await p.evaluate(() => !document.querySelector('.am-masalan') && document.querySelectorAll('.am-band li').length === 5));
  { const yi = p.locator('.am-maydon input'); await yi.nth(0).fill('menyu havolalari yopishib turibdi'); await yi.nth(1).fill("havolalar orasida bo'sh joy bo'lsin"); await p.waitForTimeout(600); }
  ok('a4: prompt — yozilgan kamchilik bilan', (await p.innerText('.am-masalan')).includes('menyu havolalari yopishib turibdi'));
  await kk('a4'); await surat(p, '1280-6-a4');
  await p.click('button.q-btn:has-text("Keyingi kamchilik")'); await p.waitForTimeout(500);
  ok('a4: «Keyingi kamchilik» — tozalandi, hisob 1', await p.evaluate(() => [...document.querySelectorAll('.am-maydon input')].every(i => !i.value) && document.querySelector('.am-soni')?.innerText === 'Yaxshilandi: 1'));
  await nx(p); await p.waitForTimeout(800);
  ok("a4 → podium (kartochkalar yo'q)", (await raqam(p)) === '08/09'); await surat(p, '1280-7-podium');
  await nx(p); await p.waitForTimeout(1500); await bayramYop(p);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  const yk = await p.innerText('.stage-content');
  ok('yakun: 4 band takrorlash, eski «bo\'laklar tartibi» qatori yo\'q', yk.includes("faqat style.css") && yk.includes("ro'yxat bo'yicha") && !yk.includes('kodda yozilgan tartibda'));
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const hw = await p.innerText('.stage-content');
  ok('yakun: keyingi dars — CSS Praktika, Demo Day', hw.includes('Demo Day saytingizni boshlaysiz'));
  ok('yakun: suzuvchi so\'zlarda uslub bor', await p.evaluate(() => { const t = document.querySelector('.hw-tok'); return !!t && getComputedStyle(t).position === 'absolute'; }));
  await surat(p, '1280-8-yakun');
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Yakunlash'))?.click()); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal, ism: JSON.stringify(window.__fin).includes('Jasur') });
  ok('onFinished: 1 savol, birinchi urinish xato → 0/1; ism LMS\'ga ketmaydi', fin && fin.tq === 1 && fin.ca === 0 && fin.ft === 1 && !fin.ism, JSON.stringify(fin));
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  const past = K.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${K.length} element)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  writeFileSync(OUT + '/kontrast-m108.json', JSON.stringify(K, null, 1));
  // qayta yuklash: saqlangan forma yig'ilgan holda qaytadimi
  await p.evaluate(() => localStorage.setItem('ccProgress:html-practice-portfolio-v2', JSON.stringify({ screen: 2, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })));
  await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  ok("qayta yuklash: a1 yig'ilgan, prompt bor", (await raqam(p)) === '03/09' && await p.evaluate(() => document.querySelector('.am-loyiha-nom')?.innerText === 'Jasur Aliyev Jr' && !!document.querySelector('.am-masalan')), await raqam(p));
  await ctx.close();
}

// 3) 390 px — gorizontal toshish + suratlar
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 9; i++) {
    if (i === 0) { await p.click('.q-variant >> nth=1'); await p.waitForTimeout(300); }
    if (i === 2) { const inp = p.locator('.am-maydon input'); await inp.nth(0).fill('Jasur Aliyev'); await inp.nth(1).fill('Boshlovchi dasturchi'); await inp.nth(2).fill("HTML o'rganyapman. Futbol."); await p.click('button.q-btn:has-text("Saqlash")'); await p.waitForTimeout(500); }
    if (i === 5) { await p.click('.q-test-v >> nth=3'); await p.waitForTimeout(300); }
    const w = await p.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (w > 0) tosh.push(`${i + 1}: ${w}px`);
    await surat(p, `390-${i}`);
    if (i === 1) ok('390: «Avval tayyorlaning» birinchi', await p.evaluate(() => document.querySelector('.am-tayyor').getBoundingClientRect().top < document.querySelector('.q-split').getBoundingClientRect().top));
    if (i < 8) { await nx(p); await p.waitForTimeout(900); await bayramYop(p); }
  }
  ok('390: gorizontal toshish yo\'q (9 ekran)', tosh.length === 0, tosh.join(', '));
  ok("390: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
writeFileSync(OUT + `/natija-m108-${LANG}.txt`, natija.join('\n') + '\n');
console.log(natija.join('\n'));
console.log(`\n${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
