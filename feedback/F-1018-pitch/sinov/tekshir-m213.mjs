// F-1018-03 · m2-13 PmLesson6 (11 ekran) oqim-sinovi: kirish → reja → so'z-elagi → uch qatlam → pitch matni (ccDokon) → test → bitta gap → sherik → sayt kamchiligi → natijalar → yakun.
// Chaqirish: node feedback/F-1018-pitch/sinov/tekshir-m213.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/2-Modull/PmLesson6.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'pm-m2d13-v2';
const page = OUT + '/sinov-m213.html';
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = [];
const ok = (nom, shart, izoh = '') => { natija.push(`${shart ? '✅' : '❌'} ${nom}${izoh ? ' — ' + izoh : ''}`); };
async function och(seed, w = 1280, h = 820) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript((s) => { if (!sessionStorage.getItem('__ok')) { localStorage.clear(); sessionStorage.setItem('__ok', '1'); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } } }, seed);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
  return { p, ctx, errs };
}
const raqam = (p) => p.evaluate(() => { const m = document.body.innerText.match(/\b(\d\d)\s*\/\s*(\d\d)\b/); return m ? `${m[1]}/${m[2]}` : '?'; });
const self = { ['liveSession:' + ID]: JSON.stringify({ mode: 'self' }) };
const DOKON = { nom: "Lavash do'koni", havola: 'lavash-dokoni.netlify.app', katalog: [{ n: 'Lavash', p: '25 000', t: 'ovqat' }] };
const nxBtn = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const nx = async (p) => { const r = await nxBtn(p); if (r && !r.d) await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop().click()); await p.waitForTimeout(700); return r; };
const bayram = async (p) => { await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300); };
const surat = (p, n) => p.screenshot({ path: `${OUT}/shots/${n}.png` });
const txt = (p) => p.innerText('.stage-content');

// 1) ESKI PROGRESS (v1, 18 ekran) → v2 toza
{
  const old = { screen: 9, maxReached: 12, answers: { 3: { correct: true } }, earned: ['jargon'], startedAt: Date.now() - 600000, total: 18, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:pm-m2d13-v1']: JSON.stringify(old) });
  ok('eski v1 progress → 01/11', (await raqam(p)) === '01/11', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM
{
  const { p, ctx, errs } = await och({ ...self, ccDokon: JSON.stringify(DOKON) });
  try {
  ok('01/11 kirish', (await raqam(p)) === '01/11');
  await p.click('.hk-play'); await p.waitForTimeout(4500);
  await p.click('.hook-option >> nth=0').catch(() => {}); await p.waitForTimeout(400);
  await surat(p, '00-kirish'); await nx(p);
  ok('02/11 reja: «ikki marta ovoz chiqarib» + «saytingizni tekshirasiz»', (await raqam(p)) === '02/11' && (await txt(p)).includes('ikki marta ovoz chiqarib') && (await txt(p)).includes('saytingizni tekshirasiz'));
  await nx(p);
  // s2 so'z-elagi
  ok("03/11 so'z-elagi", (await raqam(p)) === '03/11' && (await p.$$('.sv-w')).length > 3);
  for (const el of await p.$$('.sv-w')) { await el.click().catch(() => {}); await p.waitForTimeout(220); }   // har so'z bir marta: kasbiy so'z → hit, oddiy so'z → neutral
  ok("so'z-elagi: 3 so'z topildi → Davom", (await nxBtn(p)).t === 'Davom etish' && (await p.$$('.sv-w.hit')).length === 3, `hit ${(await p.$$('.sv-w.hit')).length}`);
  await bayram(p); await nx(p);
  // s3 uch qatlam
  ok("04/11 o'xshatish", (await raqam(p)) === '04/11' && (await p.$('.l3-card')) !== null);
  for (let card = 0; card < 3; card++) {   // har kartada variantlarni tartib bilan sinab, to'g'risi topilgach karta almashadi
    const nm = await p.evaluate(() => document.querySelector('.l3-name')?.innerText || '');
    for (let k = 0; k < 4; k++) { await p.click(`.l3-opt >> nth=${k}`).catch(() => {}); await p.waitForTimeout(450); const nm2 = await p.evaluate(() => document.querySelector('.l3-name')?.innerText || ''); if (nm2 !== nm) break; }
  }
  ok("o'xshatish: 3 qatlam → Davom", (await nxBtn(p)).t === 'Davom etish');
  await nx(p);
  // s4 pitch matni
  ok("05/11 pitch matni: do'kon eslatmasi (ccDokon)", (await raqam(p)) === '05/11' && (await txt(p)).includes("Lavash do'koni") && (await txt(p)).includes('lavash-dokoni.netlify.app'));
  const JAV = ["Maktab yonidagi o'quvchilar", "Narxni bilish uchun do'konga kirish kerak edi", "Sayt bugungi narxlarni telefon ekranida ko'rsatadi", "Bosh sahifa peshtaxtaga o'xshaydi", "Menyu rasmlarini jumagacha yuborishingizni so'rayman"];
  for (const j of JAV) { await p.fill('.wk-in', j); await p.waitForTimeout(250); await p.click('.wk-save'); await p.waitForTimeout(400); }
  ok("pitch matni: 5 bo'lak saqlandi → Davom", (await nxBtn(p)).t === 'Davom etish' && (await txt(p)).includes("Besh bo'lak tayyor"));
  await surat(p, '04-pitch'); await bayram(p); await nx(p);
  // s5 test (final)
  ok('06/11 test: «tushunmadim»', (await raqam(p)) === '06/11' && (await txt(p)).includes('tushunmadim'));
  await p.click('button:has-text("Gaplaringiz orasida")'); await p.waitForTimeout(700); await bayram(p);
  ok("test: to'g'ri izoh", (await txt(p)).includes('kasbiy so'));
  await nx(p);
  // s6 bitta gap
  ok("07/11 bitta gap: o'z pitchidan yig'ildi", (await raqam(p)) === '07/11' && (await txt(p)).includes("Maktab yonidagi o'quvchilar") && (await txt(p)).includes('peshtaxta'));
  await surat(p, '06-gap'); await nx(p);
  // s7 sherik
  ok('08/11 yoddan ayting: 3 hukm tugmasi', (await raqam(p)) === '08/11' && (await p.$$('.pv-verdicts .chip')).length === 3 && (await nxBtn(p)).d === true);
  await p.click('.pv-verdicts .chip >> nth=0'); await p.waitForTimeout(500);
  ok('sherik «Tushundim» → Davom', (await nxBtn(p)).t === 'Davom etish');
  await bayram(p); await nx(p);
  // s8 sayt
  ok("09/11 sayt: do'kon nomi + havola tugmasi + 3 karta", (await raqam(p)) === '09/11' && /lavash do'koni/i.test(await txt(p)) && await p.evaluate(() => document.querySelector('a.st-och')?.getAttribute('href') === 'https://lavash-dokoni.netlify.app') && (await p.$$('.st-card')).length === 3 && (await nxBtn(p)).t.includes('(0/3)'));
  await p.click('.st-card >> nth=0 >> button:has-text("Joyida")'); await p.click('.st-card >> nth=1 >> button:has-text("Kamchilik")'); await p.waitForTimeout(300);
  ok("sayt: ✗ → yo'riq + «To'g'riladim»", (await txt(p)).includes("VS Code da to'g'rilang") && (await p.$(".st-card >> nth=1 >> button:has-text(\"To'g'riladim\")")) !== null);
  await p.click('.st-tip-btn'); await p.waitForTimeout(250);
  ok("sayt: Gemini so'rov namunasi (script.js bilan)", (await txt(p)).includes('script.js kodim'));
  await surat(p, '08-sayt');
  await p.click(".st-card >> nth=1 >> button:has-text(\"To'g'riladim\")"); await p.click('.st-card >> nth=2 >> button:has-text("Joyida")'); await p.waitForTimeout(400);
  ok('sayt: 3/3 → Davom', (await nxBtn(p)).t === 'Davom etish' && (await p.$$('.st-ok')).length === 3);
  await bayram(p); await nx(p);
  // s9 podium
  ok('10/11 natijalar', (await raqam(p)) === '10/11');
  await nx(p);
  // s10 yakun
  const t10 = await txt(p);
  ok('11/11 yakun: nishonlar 4/4 (jargon, plain, ear, site)', (await raqam(p)) === '11/11' && (await p.$$('.ach-badge.got')).length === 4 && t10.includes('Site Checked!'), `${(await p.$$('.ach-badge.got')).length}/4`);
  await surat(p, '10-yakun');
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Yakunlash/.test(x.innerText)); b && b.click(); }); await p.waitForTimeout(900);
  const fin = await p.evaluate(() => window.__fin);
  ok('onFinished: 1 ballik savol (final 1/1), passed', !!fin && fin.totalQuestions === 1 && fin.finalTotal === 1 && fin.passed === true, fin ? `tq ${fin.totalQuestions} fin ${fin.finalScore}/${fin.finalTotal}` : "yo'q");
  } catch (e) { ok('OQIM UZILDI', false, `${await raqam(p)} · ${String(e.message).split('\n')[0].slice(0, 80)} · tugma ${JSON.stringify(await nxBtn(p))}`); await surat(p, 'XATO'); }
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2b) kod-mosligi: RECAPS kaliti test indeksi, INLINE_KEYS, screens 11
{
  const src = readFileSync(FILE, 'utf8');
  const keys = src.match(/^const RECAPS = \{([\s\S]*?)\n\};/m)[1].match(/^\s{2}(\d+): \{/gm).map(x => x.trim().replace(/[^0-9]/g, ''));
  const metaIdx = src.slice(src.indexOf('const SCREEN_META'), src.indexOf('const TOTAL_SCREENS')).split('\n').findIndex(l => l.includes("'MCScreen'")) - 1;
  ok('RECAPS kaliti = test indeksi', keys.length === 1 && Number(keys[0]) === metaIdx, `RECAPS {${keys}} · test ${metaIdx}`);
  ok('INLINE_KEYS = { s5: 0, ustaxona: -1 }', src.match(/const INLINE_KEYS = \{([^}]*)\}/)[1].trim() === 's5: 0, ustaxona: -1');
  ok('screens 11 = SCREEN_META 11', src.match(/const screens = \[([^\]]*)\]/)[1].split(',').length === 11 && (src.slice(src.indexOf('const SCREEN_META'), src.indexOf('const TOTAL_SCREENS')).match(/\{ id: 's/g) || []).length === 11);
  ok('HtmlCompiler importi yo\'q · ScreenFlashcards yo\'q · KODING_KEY yo\'q', !src.includes('HtmlCompiler') && !src.includes('ScreenFlashcards') && !src.includes('KODING_KEY'));
}
// 3) 390 px — o'zgargan/yangi ekranlar
{
  const PITCH = { kim: "Maktab yonidagi o'quvchilar", muammo: 'Narxni bilish qiyin edi', qiladi: "Narxlarni telefonda ko'rsatadi", ishlaydi: 'Peshtaxtaga o\'xshaydi', soraym: 'Rasmlarni yuboring' };
  for (const i of [1, 4, 6, 7, 8]) {
    const prog = { screen: i, maxReached: 10, answers: {}, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() };
    const { p, ctx, errs } = await och({ ...self, ['ccProgress:' + ID]: JSON.stringify(prog), ccDokon: JSON.stringify(DOKON), 'pm-m2d13-pitch': JSON.stringify(PITCH) }, 390, 760);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth <= 392 && [...document.querySelectorAll('.stage-content *')].every(e => e.getBoundingClientRect().right <= 392));
    ok(`390px ekran ${i + 1}: toshish yo'q, xato 0`, sw && errs.length === 0, errs.join(' | '));
    await p.screenshot({ path: `${OUT}/shots/390-${i + 1}.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
const o = natija.filter(x => x.startsWith('✅')).length;
writeFileSync(OUT + '/natija-m213.txt', natija.join('\n') + `\n\n${o}/${natija.length}\n`);
console.log(natija.join('\n')); console.log(`\n${o}/${natija.length}`);
