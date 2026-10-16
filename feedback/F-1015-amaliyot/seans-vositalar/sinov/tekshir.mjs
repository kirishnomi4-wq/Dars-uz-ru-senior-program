// m1-10 pilot sinovi: eski progress · kontrast · blok oqimi · nusxa · s16
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/CssPractice.jsx';
const OUT = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'css-practice-portfolio-v3';
const page = OUT + '/sinov.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = [];
const ok = (nom, shart, izoh = '') => { natija.push(`${shart ? '✅' : '❌'} ${nom}${izoh ? ' — ' + izoh : ''}`); };
async function och(seed, w = 1280, h = 820) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript((s) => { localStorage.clear(); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
  return { p, ctx, errs };
}
const raqam = (p) => p.evaluate(() => { const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/); return m ? `${m[1]}/${m[2]}` : '?'; });
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }) };

// 1) ESKI PROGRESS: 20 ekranli dars, 15-ekranda saqlangan
{
  const old = { screen: 15, maxReached: 19, answers: { 4: { correct: true, picked: 0 }, 15: { picked: 'x' } }, earned: ['color', 'layout'], startedAt: Date.now() - 600000, total: 20, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(old) });
  const r = await raqam(p); const txt = (await p.evaluate(() => document.querySelector('.stage-content')?.innerText || '')).trim();
  ok('eski progress (total 20, screen 15) → 0-ekran', r === '01/09', r);
  ok('eski progress: ekran bo\'sh emas', txt.length > 40, `${txt.length} belgi`);
  ok('eski progress: pageerror yo\'q', errs.length === 0, errs.join(' | '));
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('eski progress: eski nishonlar ko\'chmadi', cnt === '0', `hisoblagich ${cnt}`);
  // screen 25 (chegaradan tashqari) ham — total mos bo'lsa ham clamp
  await ctx.close();
  const bad = { screen: 25, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() };
  const o2 = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(bad) });
  ok('total 9, screen 25 → oxirgi ekran (clamp)', (await raqam(o2.p)) === '09/09', await raqam(o2.p));
  ok('clamp: pageerror yo\'q', o2.errs.length === 0, o2.errs.join(' | '));
  await o2.ctx.close();
}

// 2) OQIM: s0 → s1 → a1 → a2 → a3 (nishonlar) → s16 (xato → to'g'ri) + kontrast + nusxa
{
  const { p, ctx, errs } = await och(self);
  const kontrast = () => p.evaluate(() => {
    const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
    const bgOf = (el) => { let e = el; while (e) { const cs = getComputedStyle(e); const c = cs.backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
    const out = [];
    for (const el of document.querySelectorAll('.qcode, code, .am-masalan, .am-osti, .am-band li, .am-qadam li, .am-namuna, .am-uslub-btn, .am-nusxa, .ds-tag, .ds-h1, .ds-h2, .ds-p, .ds-tugma, .ds-nav, .ds-logo, .ds-ft, .mentor-msg')) {
      if (!el.offsetParent) continue;
      const fg = L(getComputedStyle(el).color).l; const bg = L(bgOf(el)).l;
      const k = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      out.push({ s: (el.className || el.tagName) + ' «' + el.innerText.slice(0, 24) + '»', k: Math.round(k * 100) / 100 });
    }
    return out;
  });
  const hammaK = [];
  const nx = () => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); return b ? b.innerText.trim() : '-'; });
  hammaK.push(...(await kontrast()).map(x => ({ ...x, e: 's0' })));
  const joy = () => p.evaluate(() => { const r = document.querySelector('.ds').getBoundingClientRect(); return Math.round(r.top) + ',' + Math.round(r.left) + ',' + Math.round(r.height); });
  const j0 = await joy();
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(500);
  ok('s0: javobdan keyin maket siljimadi', (await joy()) === j0, j0 + ' → ' + (await joy()));
  ok('s0: maket — namuna matn', (await p.innerText('.ds')).includes("To'garak jadvali endi telefoningizda"));
  ok('s0: xato javobga «Qiziq fikr!»', (await p.innerText('.stage-content')).includes('Qiziq fikr!'));
  await nx(); await p.waitForTimeout(500); ok('s0 → s1', (await raqam(p)) === '02/09');
  hammaK.push(...(await kontrast()).map(x => ({ ...x, e: 's1' })));
  ok("s1: «Avval tayyorlaning» kartasi (3 qadam)", await p.evaluate(() => document.querySelectorAll('.am-tayyor-l li').length === 3));
  ok("s1: eski g'oya-banki yo'q", await p.evaluate(() => !document.querySelector('.am-bank')));
  await nx(); await p.waitForTimeout(500);
  for (const [n, kut] of [['a1', '03/09'], ['a2', '04/09'], ['a3', '05/09']]) {
    ok(`${n} ochildi, «Davom etish» faol`, (await raqam(p)) === kut && await p.evaluate(() => ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled), await raqam(p));
    hammaK.push(...(await kontrast()).map(x => ({ ...x, e: n })));
    if (n === 'a1') {
      ok('a1: boshida faqat forma (prompt yopiq)', await p.evaluate(() => !document.querySelector('.am-masalan') && document.querySelectorAll('.am-maydon input').length === 3));
      const inp = p.locator('.am-maydon input');
      await inp.nth(0).fill("Sport vaqti"); await inp.nth(1).fill("Seksiya vaqtini telefon qilib so'rash kerak"); await p.waitForTimeout(200);
      ok('a1: 2 qator to\'lganda prompt hali yopiq', await p.evaluate(() => !document.querySelector('.am-masalan')));
      await inp.nth(2).fill("mashg'ulot jadvali, narx, murabbiy"); await p.waitForTimeout(300);
      ok("a1: 3 qator to'lgach ham «Saqlash»siz prompt yopiq", await p.evaluate(() => !document.querySelector('.am-masalan')));
      ok('a1: o\'ngda Qadamlar (maket yo\'q)', await p.evaluate(() => !document.querySelector('.ds') && document.querySelectorAll('.am-qadam li').length === 4));
      await p.click('.am-saqla'); await p.waitForTimeout(700);
      ok("a1: saqlangach forma yig'ildi (inputlar yo'q, nom ko'rinadi)", await p.evaluate(() => !document.querySelector('.am-maydon') && document.querySelector('.am-loyiha-nom')?.innerText === 'Sport vaqti'));
      const pm = await p.innerText('.am-masalan');
      ok('a1: prompt — o\'quvchi yozgani bilan', pm.includes('«Sport vaqti»') && pm.includes("mashg'ulot jadvali, narx, murabbiy"));
      ok('a1: «Prompt tayyor» qatori', (await p.innerText('.stage-content')).includes('Prompt tayyor'));
      await p.click('button:has-text("Promptni nusxalash")'); await p.waitForTimeout(200); const pc = await p.evaluate(() => navigator.clipboard.readText()); ok('a1: «Promptni nusxalash» — to\'liq prompt', pc.includes('class nomi') && pc.includes('Sport vaqti'), pc.slice(0, 50));
      await p.click('button:has-text("Tahrirlash")'); await p.waitForTimeout(300);
      await p.locator('.am-maydon input').nth(0).fill('Sport vaqti PRO'); await p.waitForTimeout(300);
      ok('a1: tahrirlashda prompt jonli yangilanadi', (await p.innerText('.am-masalan')).includes('«Sport vaqti PRO»'));
      await p.click('.am-saqla'); await p.waitForTimeout(400);
      ok("a1: «Namuna kodini nusxalash» yo'q", await p.evaluate(() => !document.body.innerText.includes('Namuna kodini')));
      const dd2 = await p.evaluate(() => JSON.parse(localStorage.getItem('ccDemoDay')));
      ok('a1: ccDemoDay ga yozildi (css + yechim)', dd2.css && dd2.css.nom === 'Sport vaqti PRO' && dd2.yechim === 'Sport vaqti PRO' && dd2.css.saqlangan === true, JSON.stringify(dd2).slice(0, 90));
    }
    if (n === 'a2') { ok('a2: uslub tanlanmaguncha prompt yopiq', await p.evaluate(() => !document.querySelector('.am-masalan'))); await p.click('.am-uslub-btn >> nth=2'); await p.waitForTimeout(200); const u = await p.evaluate(() => JSON.parse(localStorage.getItem('ccDemoDay')).uslub); ok('a2: uslub saqlandi (qorongi)', u === 'qorongi', u); ok("a2: prompt uslubga mos (Poppins, #0f172a)", (await p.innerText('.am-masalan')).includes('Poppins') && (await p.innerText('.am-masalan')).includes('#0f172a')); ok('a2: maket qorong\'i', await p.evaluate(() => !!document.querySelector('.ds-qorongi'))); }
    ok(`${n}: «Ortda qoldingizmi» yo'q`, await p.evaluate(() => !document.querySelector('.am-namuna')));
    await nx(); await p.waitForTimeout(1600);
    await p.evaluate(() => { document.querySelectorAll('.acu-root, .ach-celebrate, [class*="acu-"]').forEach(e => e.closest('[class*="acu"]')?.click?.()); });
    await p.mouse.click(5, 5); await p.waitForTimeout(400);
  }
  const cnt = await p.evaluate(() => document.querySelector('.ach-counter b')?.innerText);
  ok('a1–a3: 3 nishon (Kick Off, Styled, Color Master)', cnt === '3', `hisoblagich ${cnt}`);
  ok('s16 ochildi', (await raqam(p)) === '06/09', await raqam(p));
  hammaK.push(...(await kontrast()).map(x => ({ ...x, e: 's16' })));
  await p.click('button.option >> nth=0'); await p.waitForTimeout(300);
  const t1 = await p.innerText('.stage-content');
  ok('s16: A xato — izoh', t1.includes("matnni joylaydi, kartochkalarni emas"));
  await p.click('button.option >> nth=2'); await p.waitForTimeout(300);
  ok('s16: C to\'g\'ri — izoh', (await p.innerText('.stage-content')).includes('bir qatorga tizadi'));
  await nx(); await p.waitForTimeout(600); ok('s16 → a4 yaxshilash', (await raqam(p)) === '07/09' && (await p.innerText('.stage-content')).includes('tekshiring va yaxshilang'));
  ok('a4: boshida prompt yopiq', await p.evaluate(() => !document.querySelector('.am-masalan')));
  { const yi = p.locator('.am-maydon input'); await yi.nth(0).fill("telefonda kartalar sig'mayapti"); await yi.nth(1).fill('kartalar ustma-ust tursin'); await p.waitForTimeout(600); }
  ok('a4: prompt — yozilgan kamchilik bilan', (await p.innerText('.am-masalan')).includes("telefonda kartalar sig'mayapti"));
  await p.click('.am-saqla'); await p.waitForTimeout(500);
  ok('a4: «Keyingi kamchilik» — maydonlar tozalandi, hisob 1', await p.evaluate(() => [...document.querySelectorAll('.am-maydon input')].every(i => !i.value) && document.querySelector('.am-soni')?.innerText.includes('1')));
  await nx(); await p.waitForTimeout(600); ok('a4 → podium (kartochkalar yo\'q)', (await raqam(p)) === '08/09');
  await nx(); await p.waitForTimeout(1800); await p.mouse.click(5, 5); await p.waitForTimeout(500);
  ok('yakun (09/09)', (await raqam(p)) === '09/09');
  await p.evaluate(() => document.querySelector('.hw-big')?.click()); await p.waitForTimeout(900);
  const hw = await p.innerText('.stage-content');
  ok('yakun: uyga vazifa VS Code + skrinshot, kompilyator yo\'q', hw.includes('3 sahifa') && hw.includes('skrinshotini') && !hw.includes('kompilyator'));
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.innerText.includes('Tugatish'))?.click()); await p.waitForTimeout(400);
  const fin = await p.evaluate(() => window.__fin && { tq: window.__fin.totalQuestions, ca: window.__fin.correctAnswers, ft: window.__fin.finalTotal, passed: window.__fin.passed });
  ok('onFinished: 1 savol, birinchi urinish xato → 0/1', fin && fin.tq === 1 && fin.ca === 0 && fin.ft === 1, JSON.stringify(fin));
  ok('oqim: pageerror yo\'q', errs.length === 0, errs.join(' | '));
  const past = hammaK.filter(x => x.k < 4.5);
  ok(`kontrast ≥ 4.5 (${hammaK.length} element, 6 ekran)`, past.length === 0, past.map(x => `${x.e} ${x.s} ${x.k}`).join(' | '));
  writeFileSync(OUT + '/kontrast.json', JSON.stringify(hammaK, null, 1));
  await ctx.close();
}
// 3) 390 px — gorizontal toshish
{
  const { p, ctx, errs } = await och(self, 390, 844);
  const tosh = [];
  for (let i = 0; i < 6; i++) {
    const w = await p.evaluate(() => { const s = document.querySelector('.stage-content'); return s ? s.scrollWidth - s.clientWidth : 0; });
    if (w > 2) tosh.push(`${i}:${w}px`);
    if (i === 0) await p.click('.hook-option >> nth=0');
    await p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); if (b && !b.disabled) b.click(); }); await p.waitForTimeout(1500); await p.mouse.click(5, 5); await p.waitForTimeout(300);
  }
  ok('390 px: gorizontal toshish yo\'q (s0–s16)', tosh.length === 0, tosh.join(' '));
  ok('390 px: pageerror yo\'q', errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await b.close();
console.log(natija.join('\n'));
