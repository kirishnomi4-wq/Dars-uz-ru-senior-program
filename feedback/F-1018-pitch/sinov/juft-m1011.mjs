// F-1018-08 · m10-11 ScreenJuftlik tekshiruvi (tuzatilgan pitch sherikka 2 daq → «Dalil bor/yo'q» → Davom, nishon, tiklanish). Chaqirish: node feedback/F-1018-pitch/sinov/juft-m1011.mjs <shots-papka>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m10d11-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const NATIJA = { davolar: [
  { id: 'd1', bolak: 'muammo', gap: "Men so'ragan 5 o'yinchidan 4 tasida odam yetmagan", dalil: { son: '4 / 5', yozuv: null, manba: 'intervyu', qachon: '11-Modul' }, qaror: 'qoldi', yangiGap: null },
  { id: 'd2', bolak: 'yechim', gap: "O'yinchilarga ilova yoqdi", dalil: { son: '17 / 46', yozuv: null, manba: 'sanoq', qachon: 'bu hafta' }, qaror: 'qayta-yozildi', yangiGap: 'Ilovani ochgan 46 qurilmadan 17 tasi ikki kundan keyin yana ochdi' },
  { id: 'd3', bolak: 'keyingi', gap: 'Bir oyda 200 kishi bo\'ladi', dalil: null, qaror: 'olib-tashlandi', yangiGap: null }
], bolaklar: { muammo: "O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida odam yetmagan.", yechim: 'Ilova o\'yinni e\'lon qiladi. Ilovani ochgan 46 qurilmadan 17 tasi ikki kundan keyin yana ochdi.', demo: 'Shanba 18:00 · «Boraman».', keyingi: 'Keyingi hafta uchta o\'yin e\'lon qilaman.' }, savedAt: Date.now() };
const ochish = async (prog, natija) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, pr, nt]) => {
    for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
    localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('ccProgress:' + id, pr);
    if (nt) localStorage.setItem('pm-m10d11-pitch', nt);
  }, [ID, JSON.stringify(prog), natija ? JSON.stringify(natija) : null]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/m1011-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Davom|2 daqiqada ayting|Har gapni belgilang/.test(x.innerText)).pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const log = (x) => console.log(x);
const prog0 = { screen: 8, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() };
// 1) pitch saqlanmagan holat
let p = await ochish(prog0, null);
log('pitch yo\'q: ' + JSON.stringify(await nav(p)) + ' · qaytish tugmasi: ' + !!(await p.$('text=Pitchni saqlashga qaytish')));
// 2) pitch bor
p = await ochish(prog0, NATIJA);
log('boshida: ' + JSON.stringify(await nav(p)) + ' · gaplar: ' + (await p.$$('.pd-jf-q')).length + ' (kutilgan 2: olib tashlangan sanalmaydi) · chip yopiq: ' + (await p.$eval('.pd-jf-q button', b => b.disabled)));
await p.screenshot({ path: OUT + '/m1011-uz/s08-boshida.png' });
await p.click('text=2 daqiqani boshlash'); await p.waitForTimeout(1300);
log('taymer: ' + (await p.innerText('.pd-jf-tmr')).replace(/\n/g, ' ').slice(0, 80));
await p.click("text=To'xtatish"); await p.waitForTimeout(400);
log("to'xtagach: " + JSON.stringify(await nav(p)) + ' · chip ochiq: ' + !(await p.$eval('.pd-jf-q button', b => b.disabled)));
const q = await p.$$('.pd-jf-q');
await (await q[0].$('text=Dalil bor')).click(); await p.waitForTimeout(200);
await (await q[1].$("text=Dalil yo'q")).click(); await p.waitForTimeout(700);
log('belgilangach: ' + JSON.stringify(await nav(p)) + ' · xulosa: ' + (await p.innerText('.pd-jf-on .q-xulosa').catch(() => 'YO\'Q')).slice(0, 90) + ' · nishon toast: ' + !!(await p.$('.acu-overlay')));
if (await p.$('.acu-overlay')) { await p.click('.acu-overlay'); await p.waitForTimeout(400); }
await p.screenshot({ path: OUT + '/m1011-uz/s08-tugadi.png' });
const prog = await p.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
const nat = await p.evaluate(() => JSON.parse(localStorage.getItem('pm-m10d11-pitch') || '{}'));
log('saqlandi: earned=' + JSON.stringify(prog.earned) + ' · answers[8]=' + JSON.stringify(prog.answers[8] && { vaqt: prog.answers[8].vaqt, belgi: prog.answers[8].belgi, yoqSoni: prog.answers[8].yoqSoni }) + ' · artefakt juftlik=' + JSON.stringify(nat.juftlik && nat.juftlik.belgi));
const p2 = await ochish({ ...prog, screen: 8 }, nat);
log('qayta ochildi: ' + JSON.stringify(await nav(p2)) + ' · bor/yoq: ' + (await p2.$$('.pd-jf-q.bor')).length + '/' + (await p2.$$('.pd-jf-q.yoq')).length);
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
