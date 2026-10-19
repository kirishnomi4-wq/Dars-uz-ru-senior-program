// F-1019-06 · m4c-01 s5, s6, s7, s11 (DE 213.22): passiv «har birini bosing» → qaror qadamlari tekshiruvi.
// Avval: SHOT_LANG=uz node konveyer/vositalar/shots.mjs src/4c-Modull/CiCdIntroLesson.jsx feedback/F-1019-04-passiv/suratlar/m4c01b-uz 5,6,7,11
// Ishga tushirish: node feedback/F-1019-04-passiv/sinov/m4c01b.mjs
import { chromium } from 'playwright-core';
const SUR = '/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar/m4c01b-uz';
const ID = 'cicd-intro-4c-01-v18';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (screen, extra = {}, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, ex]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: 20, savedAt: Date.now() })); for (const [k, v] of Object.entries(ex)) localStorage.setItem(k, v); }, [ID, screen, extra]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + SUR + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const qaror = async (p, togri, xato, nom) => {
  const savol = await p.innerText('.qr-s');
  await p.locator('.qr-v button', { hasText: xato }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.qr .qr-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.qr-v button', { hasText: xato }).isDisabled();
  const navX = await nav(p);
  await p.locator('.qr-v button', { hasText: togri }).click(); await p.waitForTimeout(500);
  const keyingi = await p.innerText('.qr-s').catch(() => "(savol yo'q — tugadi)");
  log(`  ${nom}. «${savol}» xato «${xato}» → «${izoh}» (tugma yopildi: ${yopiq}, nav: ${navX}) → to'g'ri «${togri}» → ${keyingi === savol ? "QADAM O'ZGARMADI!" : 'keyingi qadam'}`);
};
const qaytish = async (p, screen, sel) => {
  const j = JSON.parse((await p.evaluate((id) => localStorage.getItem('ccProgress:' + id), ID)) || '{}');
  log(`  saqlangan javob [${screen}]: ${JSON.stringify((j.answers || {})[screen])}`);
  const q = await ochish(screen, { ['ccProgress:' + ID]: JSON.stringify({ ...j, screen, maxReached: Math.max(j.maxReached || 0, screen) }) });
  log(`  qaytganda: nav=${await nav(q)} · savol bor: ${!!(await q.$('.qr'))} · xulosa: ${!!(await q.$('.frame-success'))} · ✓: ${await q.$$eval(sel, a => a.filter(x => x.innerText.includes('✓')).length)}`);
  await q.screenshot({ path: `${SUR}/t${screen}-qaytish.png` });
};
const ekran = async (screen, nom, sel, qadamlar, xatoSurat) => {
  log(`s${screen} «${nom}»`);
  const p = await ochish(screen);
  log(`  boshida: nav=${await nav(p)} · bosiladigan karta: ${(await p.$$('button.vcard, button.itm-card, button.pipe-step')).length}`);
  for (let i = 0; i < qadamlar.length; i++) {
    if (i === xatoSurat) { await p.locator('.qr-v button', { hasText: qadamlar[i][1] }).click(); await p.waitForTimeout(250); await p.screenshot({ path: `${SUR}/t${screen}-xato.png` }); await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(700); for (let k = 0; k < i; k++) { await p.locator('.qr-v button', { hasText: qadamlar[k][0] }).click(); await p.waitForTimeout(400); } }
    await qaror(p, qadamlar[i][0], qadamlar[i][1], i + 1);
  }
  await p.waitForTimeout(500);
  log(`  oxiri: nav=${await nav(p)} · ✓: ${await p.$$eval(sel, a => a.filter(x => x.innerText.includes('✓')).length)} · xulosa: ${!!(await p.$('.frame-success'))} · savol qoldi: ${!!(await p.$('.qr'))}`);
  await p.screenshot({ path: `${SUR}/t${screen}-tugadi.png` });
  await qaytish(p, screen, sel);
  const m = await ochish(screen, {}, 390, 844);
  if (qadamlar.length) { await m.locator('.qr-v button', { hasText: qadamlar[0][0] }).click(); await m.waitForTimeout(400); }
  const sw = await m.evaluate(() => document.documentElement.scrollWidth);
  log(`  390 px: gorizontal aylantirish: ${sw > 390 ? 'BOR ' + sw : "yo'q"}`);
  await m.screenshot({ path: `${SUR}/t${screen}-390.png`, fullPage: true });
};

await ekran(5, 'CI — uch chamadon', '.cj-items .itm-card', [
  ['Kod yuborilishi bilan darhol', 'Hafta oxirida'],
  ['Hamma bir xil sharoitda sinaladi', "Lentaning o'zi buzilgan"],
  ["Har kimning kodi umumiy loyihaga", 'Uchala dasturchi bitta']
], 1);
await ekran(6, 'CD — kim uchiradi', '.vcard', [
  ['Siz tasdiqlaguningizcha', "O'zi darhol internetga"],
  ["Hech kim, lenta o'zi", 'Jamoa rahbari'],
  ['Yetkazish: tasdiqdan keyin', 'Deployment: tasdiqsiz']
], 2);
await ekran(7, 'Lenta nuqtalari', '.pipe-step', [
  ['npm install', 'npm run build'],
  ['npm test', 'eslint .'],
  ['eslint .', 'npm start'],
  ['npm run build', 'npm run preview'],
  ['Faqat tekshirilgan yuk', 'Tartibning hech qanday']
], 0);
await ekran(11, 'Nega avtomatlashtiramiz', '.vcard', [
  ["Hamma nuqtani o'zi", "Ba'zi nuqtalarni"],
  ['Avvalgi ishlab turgan', 'Xatosi bilan chiqqan'],
  ['Lenta hammasini bir xil', "Har kim o'z kodini"]
], 1);
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
