// F-1018-01 · m1-12 PmLesson3 (9 ekran) oqim-sinovi: kirish → reja → muammo+birinchi savol → yechim+demo → test → repetitsiya 1 → juftlik → podium → yakun.
// Chaqirish (repo ildizidan): node feedback/F-1018-pitch/sinov/tekshir-m112.mjs <chiqish-papka-absolut>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const FILE = ROOT + '/src/1-Modull/PmLesson3.jsx';
const OUT = process.argv[2]; mkdirSync(OUT + '/shots', { recursive: true });
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)};
  window.__fin = null; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: (p) => { window.__fin = p; } }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const ID = 'pm-pitch-03-v20';
const page = OUT + '/sinov-m112.html';
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
const nxBtn = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button.btn-white-accent')].pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const nx = async (p) => { const r = await nxBtn(p); if (r && !r.d) await p.evaluate(() => [...document.querySelectorAll('button.btn-white-accent')].pop().click()); await p.waitForTimeout(700); return r; };
const bayram = async (p) => { await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300); };
const surat = (p, n) => p.screenshot({ path: `${OUT}/shots/${n}.png` });
const txt = (p) => p.innerText('.stage-content');

// 1) ESKI PROGRESS (v19, 17 ekran) → yangi kalit v20, toza boshlanadi
{
  const old = { screen: 11, maxReached: 14, answers: { 3: { correct: true } }, earned: ['finder'], startedAt: Date.now() - 600000, total: 17, savedAt: Date.now() };
  const { p, ctx, errs } = await och({ ...self, ['ccProgress:pm-pitch-03-v19']: JSON.stringify(old) });
  ok('eski v19 progress → 01/10', (await raqam(p)) === '01/10', await raqam(p));
  ok("eski progress: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2) OQIM — Deploy darsidan kelgan manzil bilan
{
  const { p, ctx, errs } = await och({ ...self, ccPitch3: JSON.stringify({ link: 'kitob-dokoni.netlify.app' }) });
  // s0
  ok('01/10 kirish', (await raqam(p)) === '01/10');
  await p.click('.chip:has-text("Jonli")').catch(() => {}); await p.waitForTimeout(200);
  await p.evaluate(() => [...document.querySelectorAll('.chip')].forEach(c => c.click())); await p.waitForTimeout(300);
  await p.click('.hook-option >> nth=1'); await p.waitForTimeout(400);
  ok('kirish: javob qisqa (hook-ack ≤ 120)', await p.evaluate(() => { const a = document.querySelector('.hook-ack'); return !!a && a.innerText.length <= 120; }));
  await surat(p, '00-kirish'); await nx(p);
  // s1
  ok('02/10 reja: «ikki ekranda yozasiz», 4 qadam', (await raqam(p)) === '02/10' && (await txt(p)).includes('ikki ekranda yozasiz') && (await txt(p)).includes('Sherigingiz bilan savol-javob'));
  await nx(p);
  // s2
  ok('03/10 muammo: sayt turi tanlanmagan — tugma «Sayt turingizni tanlang»', (await raqam(p)) === '03/10' && (await nxBtn(p)).t.includes('Sayt turingizni'));
  await p.click('.kind-card >> nth=0'); await p.waitForTimeout(300);
  for (let i = 0; i < 3; i++) { await p.click(`.pf-row >> nth=${i} >> .pf-chip >> nth=0`); await p.waitForTimeout(300); }
  const t2 = await txt(p);
  ok('muammo: gap yig\'ildi + birinchi savol maydoni chiqdi, tugma (3/4)', /saytingiz nima uchun kerak/i.test(t2) && t2.includes('birinchi savolingizni yozing') && (await p.$('.fld-ta')) !== null && (await nxBtn(p)).t.includes('(3/4)'));
  ok('muammo: mikrofon yo\'q', !(await txt(p)).includes('ovoz chiqarib ayting'));
  await p.fill('.fld-ta', "Kerakli kitobni qidirib, do'konma-do'kon yurganmisiz?"); await p.waitForTimeout(400);
  ok('muammo: 4/4 → «Davom etish»', (await nxBtn(p)).t === 'Davom etish');
  await surat(p, '02-muammo'); await bayram(p); await nx(p);
  // s3
  ok('04/10 yechim+demo: 2 ustun, tugma «Bitta jumla yozing»', (await raqam(p)) === '04/10' && (await p.$$('.one-tab')).length === 4 && (await p.$$('.dstep')).length === 3 && (await nxBtn(p)).t === 'Bitta jumla yozing');
  await p.click('.one-tab >> nth=0'); await p.waitForTimeout(250);
  ok('yechim: namuna jumlasi chiqdi', (await p.$('.one-line')) !== null);
  await p.fill('.fld-ta', 'Saytim — kerakli kitobni bir joydan topib, narxini ko\'rasiz.'); await p.waitForTimeout(400);
  ok('yechim yozildi → tugma «Qadamlarni oching (0/3)»', (await nxBtn(p)).t.includes('(0/3)'));
  for (let i = 0; i < 3; i++) { await p.click(`.dstep >> nth=${i}`); await p.waitForTimeout(250); }
  await p.waitForTimeout(400);
  ok('demo 3/3: manzil maydoni Deploy darsidan to\'lgan', await p.evaluate(() => document.querySelector('.s6-link input')?.value === 'kitob-dokoni.netlify.app'));
  ok('demo 3/3 → «Davom etish»', (await nxBtn(p)).t === 'Davom etish');
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('ccPitch3')));
  ok('saqlov: 6 blok to\'la (qildim/keyin tayyor gap)', !!(st.ilgak && st.muammo && st.yechim && st.demo && st.qildim && st.keyin), JSON.stringify({ qildim: (st.qildim || '').slice(0, 40), keyin: (st.keyin || '').slice(0, 40) }));
  await surat(p, '03-yechim-demo'); await nx(p);
  // s4 test
  ok('05/10 test: jonli demo savoli', (await raqam(p)) === '05/10' && (await txt(p)).includes('nimani'));
  await p.click('button:has-text("Saytning o\'zini")'); await p.waitForTimeout(700); await bayram(p); await p.waitForTimeout(400);
  ok('test: to\'g\'ri javob izohi', (await txt(p)).includes('eng kuchli dalil'));
  await surat(p, '04-test'); await nx(p);
  // s5 repetitsiya 1
  ok('06/10 repetitsiya: nutq kartasi 6 qator, taymer, tugma «Sherik bilan mashqqa»', (await raqam(p)) === '06/10' && (await p.$$('.tp-row')).length === 6 && (await p.$('.stg')) !== null && (await nxBtn(p)).t.includes('Sherik bilan'));
  ok('repetitsiya: mentor «HTML», «CSS» demang', (await txt(p)).includes('«HTML», «CSS» demang'));
  await surat(p, '05-repetitsiya'); await bayram(p); await nx(p);
  // s6 juftlik
  ok('07/10 juftlik: 3 karta, tugma (0/3)', (await raqam(p)) === '07/10' && (await p.$$('.qa-card')).length === 3 && (await nxBtn(p)).t.includes('(0/3)'));
  await p.click('.qa-tip-btn >> nth=2'); await p.waitForTimeout(300);
  ok('juftlik: 3-karta maslahati — o\'quvchining o\'z muammo gapi', (await p.innerText('.qa-tip')).includes(st.muammo.slice(0, 20)));
  await surat(p, '06-juftlik-maslahat');
  for (let i = 0; i < 3; i++) { await p.click('.qa-said >> nth=0'); await p.waitForTimeout(250); }
  ok('juftlik: 3/3 → «o\'rin almashing» + Davom', (await txt(p)).includes("o'rin almashing") && (await nxBtn(p)).t === 'Davom etish' && (await p.$$('.qa-ok')).length === 3);
  await surat(p, '06-juftlik'); await bayram(p); await nx(p);
  // s7 sayt kamchiligi
  ok('08/10 sayt: havola tugmasi (Deploy manzili), 3 karta, tugma (0/3)', (await raqam(p)) === '08/10' && await p.evaluate(() => document.querySelector('a.sayt-och')?.getAttribute('href') === 'https://kitob-dokoni.netlify.app') && (await p.$$('.sayt-card')).length === 3 && (await nxBtn(p)).t.includes('(0/3)'));
  await p.click('.sayt-card >> nth=0 >> button:has-text("Joyida")'); await p.click('.sayt-card >> nth=1 >> button:has-text("Kamchilik")'); await p.waitForTimeout(300);
  ok("sayt: ✗ → to'g'rilash yo'rig'i + «To'g'riladim»", (await txt(p)).includes("VS Code da to'g'rilang") && (await p.$(".sayt-card >> nth=1 >> button:has-text(\"To'g'riladim\")")) !== null);
  await p.click('.qa-tip-btn'); await p.waitForTimeout(250);
  ok("sayt: Gemini so'rov namunasi ochildi", (await txt(p)).includes("Faqat o'zgartiriladigan qatorlarni"));
  await surat(p, '07-sayt');
  await p.click(".sayt-card >> nth=1 >> button:has-text(\"To'g'riladim\")"); await p.click('.sayt-card >> nth=2 >> button:has-text("Joyida")'); await p.waitForTimeout(400);
  ok('sayt: 3/3 → Davom', (await nxBtn(p)).t === 'Davom etish' && (await p.$$('.qa-ok')).length === 3);
  await nx(p);
  // s7 podium
  ok('09/10 natijalar', (await raqam(p)) === '09/10');
  await surat(p, '07-podium'); await nx(p);
  // s8 yakun
  const t8 = await txt(p);
  ok('10/10 yakun: nutq kartasi + manzil + 4 band + nishonlar', (await raqam(p)) === '10/10' && (await p.$('.dd-card')) !== null && t8.includes('kitob-dokoni.netlify.app') && (await p.$$('.recap li')).length === 4 && t8.includes('Answer Ready!'));
  const got = await p.$$('.ach-badge.got');
  ok('yakun: nishonlar 5/5 (finder, demoman, stage, answers, graduate)', got.length === 5, `${got.length}/5`);
  await surat(p, '08-yakun');
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Yakunlash/.test(x.innerText)); b && b.click(); }); await p.waitForTimeout(900);
  const fin = await p.evaluate(() => window.__fin);
  ok('onFinished: 2 ballik savol, final 1/1, passed', !!fin && fin.totalQuestions === 2 && fin.finalTotal === 1 && fin.passed === true, fin ? `tq ${fin.totalQuestions} fin ${fin.finalScore}/${fin.finalTotal}` : 'yo\'q');
  ok("oqim: pageerror yo'q", errs.length === 0, errs.join(' | '));
  await ctx.close();
}
// 2b) RECAPS 4 — kalit test ekraniga (indeks 4) ulangan: RecapOverlay faqat mentor-statistikasidan ochiladi (kodda hasRecap = !!RECAPS[screen])
{
  const src = (await import('node:fs')).readFileSync(FILE, 'utf8');
  const keys = src.match(/^const RECAPS = \{([\s\S]*?)\n\};/m)[1].match(/^\s{2}(\d+): \{/gm).map(x => x.trim().replace(/[^0-9]/g, ''));
    const metaIdx = src.slice(src.indexOf('const SCREEN_META'), src.indexOf('const TOTAL_SCREENS')).split('\n').findIndex(l => l.includes("'MCScreen'")) - 1;
  ok('RECAPS kaliti = test ekrani indeksi', keys.length === 1 && Number(keys[0]) === metaIdx, `RECAPS {${keys}} · test indeks ${metaIdx}`);
  const qk = src.match(/const INLINE_KEYS = \{([^}]*)\}/)[1];
  ok('INLINE_KEYS = { s4: 2, s5: -1 }', qk.trim() === 's4: 2, s5: -1', qk.trim());
}
// 3) 390 px — yangi/o'zgargan ekranlar (gorizontal skroll yo'q)
{
  for (const i of [2, 3, 5, 6, 7]) {
    const prog = { screen: i, maxReached: 9, answers: {}, earned: [], startedAt: Date.now(), total: 10, savedAt: Date.now() };
    const seed = { ...self, ['ccProgress:' + ID]: JSON.stringify(prog), ccPitch3: JSON.stringify({ kind: 'shop', who: 'Sinfdoshlarim', pain: 'kitob topolmasdi', help: 'kitobni bir joydan topadi', muammo: 'Sinfdoshlarim kitob topolmasdi. Mening saytim kitobni bir joydan topadi.', ilgak: 'Kitob qidirganmisiz?', yechim: 'Saytim kitobni topadi.', demo: 'Ochaman.', qildim: 'Tuzdim.', keyin: 'JS.' }) };
    const { p, ctx, errs } = await och(seed, 390, 760);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth <= 392 && [...document.querySelectorAll('.stage-content *')].every(e => e.getBoundingClientRect().right <= 392));
    ok(`390px ekran ${i + 1}: gorizontal toshish yo'q, xato 0`, sw && errs.length === 0, errs.join(' | '));
    await p.screenshot({ path: `${OUT}/shots/390-${i + 1}.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
const o = natija.filter(x => x.startsWith('✅')).length;
writeFileSync(OUT + '/natija-m112.txt', natija.join('\n') + `\n\n${o}/${natija.length}\n`);
console.log(natija.join('\n')); console.log(`\n${o}/${natija.length}`);
