// F-1019-07 · umumiy Qaror sinovi: har qadamda avval xato variant(lar) (sabab + tugma yopiladi), keyin to'g'ri; oxirida «Davom etish».
// Telefonda (390) har to'g'ri javobdan keyin keyingi savol ekranda ko'rinadimi — o'lchaydi.
// node qaror.mjs <dars.jsx> <ekran> <til> <kenglik> [chiqish-papka]
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
const [fayl, ekranS, til = 'uz', wS = '1280', out = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/7c14e2db-9337-41c2-872f-143cd83111dd/scratchpad/q07'] = process.argv.slice(2);
const EKRAN = +ekranS, W = +wS, H = W < 500 ? 844 : 860;
const src = readFileSync(fayl, 'utf8');
const ID = /lessonId:\s*['"]([^'"]+)['"]/.exec(src)[1];
const TOTAL = (/const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src)[1].match(/\{\s*id:/g) || []).length;
const dir = join(out, ID + '-' + til); mkdirSync(dir, { recursive: true });
const page = join(dir, '_p.html');
const res = await build({ stdin: { contents: `import React from 'react';import { createRoot } from 'react-dom/client';import Lesson from ${JSON.stringify(resolve(fayl))};
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: ${JSON.stringify(til)} }));`, resolveDir: '/home/kali/Desktop/internetLesson', sourcefile: 'e.jsx', loader: 'jsx' },
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent' });
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: W, height: H } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript(([id, sc, tot]) => { if (sessionStorage.getItem('_bir')) return; sessionStorage.setItem('_bir', '1'); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() })); }, [ID, EKRAN, TOTAL]);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1000);
const log = (x) => console.log(x);
const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const SAV = 'p.qr-s, p[class$="-qr-s"]';
const joy = () => p.evaluate((sel) => { const s = document.querySelector(sel); if (!s) return null; const q = s.parentElement.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom), h: innerHeight }; }, SAV);
// F-1019-08 (213.23a): ko'rinadigan bo'sh uya/katak — punktir chegarali yoki «bosh/joy/uzuq» klassli, matnsiz element
const boshlar = () => p.evaluate(() => { const r = []; for (const e of document.querySelectorAll('.lesson-root *')) { const st = getComputedStyle(e); const b = e.getBoundingClientRect(); if (b.width < 24 || b.height < 14 || st.visibility === 'hidden' || st.display === 'none' || +st.opacity === 0) continue; const cls = typeof e.className === 'string' ? e.className : ''; const dashed = st.borderTopStyle === 'dashed' || st.borderLeftStyle === 'dashed'; const nom = /(^|[ -])(bosh|joy|uzuq|empty)( |$)/.test(cls); const t = (e.innerText || '').replace(/[\s\d·.…:]/g, ''); const yorliqli = /(^|[ -])bosh( |$)/.test(cls) && t.length < 25 && !e.querySelector('input, textarea'); if (((dashed || nom) && t.length < 2 || yorliqli) && !e.closest('button, .q-bashorat, .stage-nav, .q-reja')) r.push((yorliqli && t.length >= 2 ? 'yorliqli:' : '') + (cls.split(' ').slice(0, 2).join('.') || e.tagName)); } return r; });
const k = `${ID} s${EKRAN} ${til}${W < 500 ? '-390' : ''}`;
log(`== ${k} · eyebrow: ${await p.innerText('.stage-eyebrow, .eyebrow').catch(() => '?')}`);
log('  boshida nav: ' + await nav());
if (await p.$('.q-bashorat button')) { await p.locator('.q-bashorat button').first().click(); await p.waitForTimeout(900); }
let qadam = 0, xatolar = 0, korinmadi = 0;
{ const bb = await boshlar(); if (bb.length) log('  BO\'SH (boshida): ' + bb.length + ' ' + [...new Set(bb)].join(',')); }
await p.screenshot({ path: join(dir, `s${EKRAN}-${W}-0.png`), fullPage: W >= 500 });
for (let guard = 0; guard < 8; guard++) {
  const sv = await p.$(SAV); if (!sv) break;
  const savol = (await sv.innerText()).trim();
  const j0 = await joy();
  const btns = await sv.$$('xpath=..//*[contains(@class,"qr-v")]//button');
  let topildi = false; const xatoT = [];
  for (let i = 0; i < btns.length; i++) {
    if (await btns[i].isDisabled()) continue;
    const t = (await btns[i].innerText()).trim();
    const xOld = await p.$$eval('[class$="-qr"] .q-xato, [class*="-qr "] .q-xato, .qr .qr-xato', a => a.map(x => x.innerText).join('|'));
    await btns[i].click(); await p.waitForTimeout(260);
    const xNew = await p.$$eval('[class$="-qr"] .q-xato, [class*="-qr "] .q-xato, .qr .qr-xato', a => a.map(x => x.innerText).join('|'));
    if (xNew && xNew !== xOld) { const yop = await btns[i].isDisabled(); xatoT.push(`«${t}» → «${xNew}» (${xNew.length} b., yopildi: ${yop})`); xatolar++; continue; }
    topildi = true; qadam++;
    log(`  ${qadam}. «${savol}» [savol top ${j0 && j0.top}]`); xatoT.forEach(x => log('     ✗ ' + x)); log(`     ✓ «${t}» · nav: ${await nav()}`);
    break;
  }
  if (!topildi) { log('  !! to\'g\'ri variant topilmadi: ' + savol); break; }
  // keyingi savol yoki tugash kutiladi
  for (let w = 0; w < 30; w++) { await p.waitForTimeout(300); const s2 = await p.$(SAV); const t2 = s2 ? (await s2.innerText()).trim() : null; if (t2 !== savol) break; }
  await p.waitForTimeout(700);
  const j = await joy();
  if (j && W < 500) { const ok = j.top >= 0 && j.top < j.h - 80; if (!ok) korinmadi++; log(`     telefonda keyingi savol: top ${j.top} / ekran ${j.h} → ${ok ? 'ko\'rinadi' : 'KO\'RINMAYDI'}`); }
  { const bb = await boshlar(); if (bb.length) log('     BO\'SH: ' + bb.length + ' ' + [...new Set(bb)].join(',')); }
  await p.screenshot({ path: join(dir, `s${EKRAN}-${W}-${qadam}.png`), fullPage: W >= 500 });
}
await p.waitForTimeout(7000);
log(`  tugadi: qadam ${qadam}, xato tanlov ${xatolar} · nav: ${await nav()} · xulosa: ${!!(await p.$('.q-xulosa'))}`);
await p.screenshot({ path: join(dir, `s${EKRAN}-${W}-oxir.png`), fullPage: true });
// qaytish: keyingi ekran → orqaga
const nb = p.locator('.stage-nav button').last(); if (await nb.isEnabled()) { await nb.click(); await p.waitForTimeout(900); await p.locator('.stage-nav button').first().click(); await p.waitForTimeout(1500); log(`  qaytganda: nav ${await nav()} · savol: ${!!(await p.$(SAV))} · xulosa: ${!!(await p.$('.q-xulosa'))}`); }
const gor = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
log(`  gorizontal aylantirish: ${gor} · telefonda ko'rinmagan savol: ${korinmadi} · pageerror: ${errs.length}${errs.length ? ' ' + errs.join(' | ') : ''}`);
await b.close();
