// F-1019-04 · m1-14 (HtmlTakrorlashLesson) s0 «Bu sahifa nimalardan yig'ilgan?» — ketma-ket qaror qadamlari (DE 213.22) sinovi.
// Avval: SHOT_LANG=uz node konveyer/vositalar/shots.mjs src/1-Modull/HtmlTakrorlashLesson.jsx <SUR>/m1-14-uz 0
// node feedback/F-1019-04-passiv/sinov/m1-14.mjs <SUR>
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const SUR = process.argv[2]; const PAGE = SUR + '/m1-14-uz/_p.html'; const OUT = SUR + '/m1-14-sinov'; const ID = 'html-takrorlash-01-05-v2';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (screen, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc]) => { if (sessionStorage.getItem('_ok')) return; sessionStorage.setItem('_ok', '1'); localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: 18, savedAt: Date.now() })); }, [ID, screen]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + PAGE); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1500); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const holat = (p) => p.$$eval('.anat-part', a => a.map(x => x.className.replace('anat-part', '').trim() || '-').join(' '));
const qaror = async (p, togri, xato, nom) => {
  const oldin = await holat(p);
  await p.locator('.card .chip', { hasText: xato }).first().click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.card .anat-why').catch(() => "YO'Q");
  const yopiq = await p.locator('.card .chip', { hasText: xato }).first().isDisabled();
  await p.locator('.card .chip').filter({ hasText: new RegExp('^' + togri.replace(/[<>]/g, m => m) + '$') }).first().click(); await p.waitForTimeout(500);
  log(`  ${nom}: qismlar [${oldin}] · xato ${xato} → «${izoh}» (tugma yopildi: ${yopiq}) → to'g'ri ${togri} → [${await holat(p)}]`);
};
let p = await ochish(0);
log('s0 boshida: nav=' + await nav(p) + ' · qism teglari: ' + await p.$$eval('.anat-part', a => a.map(x => x.tagName).join(',')) + ' · karta: ' + !!(await p.$('.card .chip')));
await qaror(p, '<h1>', '<li>', '1 sarlavha');
await p.locator('.card .chip', { hasText: '<ul>' }).click(); await p.waitForTimeout(300);
await p.screenshot({ path: OUT + '/s0-2-xato.png' });
await qaror(p, '<p>', '<img>', '2 matn');
await qaror(p, '<ul>', '<a>', "3 ro'yxat");
await qaror(p, '<a>', '<p>', '4 havola');
await p.waitForTimeout(600);
log('s0 oxiri: nav=' + await nav(p) + ' · xulosa: ' + !!(await p.$('.frame-success')) + ' · ✓ yorliqlar: ' + (await p.$$('.anat-tag')).length);
await p.screenshot({ path: OUT + '/s0-tugadi.png' });
await p.locator('.stage-nav button', { hasText: 'Davom etish' }).click(); await p.waitForTimeout(1000);
await p.locator('.stage-nav button', { hasText: 'Orqaga' }).first().click(); await p.waitForTimeout(1000);
log('  qaytganda: nav=' + await nav(p) + ' · savol kartasi: ' + !!(await p.$('.card .chip')) + ' · ✓ yorliqlar: ' + (await p.$$('.anat-tag')).length);
await p.reload(); await p.waitForTimeout(1600);
log('  qayta yuklanganda: ekran=' + await p.innerText('.stage-header').then(t => t.split('\n')[0]).catch(() => '?') + ' · nav=' + await nav(p) + ' · ✓ yorliqlar: ' + (await p.$$('.anat-tag')).length);
const pm = await ochish(0, 390, 844); await pm.screenshot({ path: OUT + '/s0-390.png', fullPage: true });
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs.join(' | ') : ''));
await b.close();
