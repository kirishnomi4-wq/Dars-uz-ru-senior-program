// F-1018-09 · m10-12 Screen11 4-qadam (2-raund) tekshiruvi. Chaqirish: node feedback/F-1018-pitch/sinov/raund2-m1012.mjs <shots-papka (m1012-uz/_p.html bor)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m10d12-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ochish = async (prog) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, pr]) => {
    for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
    localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('ccProgress:' + id, pr);
  }, [ID, JSON.stringify(prog)]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/m1012-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Davom|Qayta ayting|Bitta bo/.test(x.innerText)).pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const log = (x) => console.log(x);
const varaq = [{ bolak: 'muammo', belgi: '✓', izoh: '', tuzatildi: false }, { bolak: 'yechim', belgi: '✗', izoh: 'nima qilishi tushunarsiz', tuzatildi: true }, { bolak: 'demo', belgi: '✓', izoh: '', tuzatildi: false }, { bolak: 'raqamlar', belgi: '✓', izoh: '', tuzatildi: false }, { bolak: 'keyingi', belgi: '✓', izoh: '', tuzatildi: false }];
let p = await ochish({ screen: 7, maxReached: 7, answers: { 7: { stage: 'juftlik', screenIdx: 7, qadam: 2, vaqt: 280, varaq, solved: true, picked: true, correct: true } }, earned: ['livePitch', 'partFixed'], startedAt: Date.now(), total: 11, savedAt: Date.now() });
log('s11 tuzatilgan: ' + JSON.stringify(await nav(p)) + ' · 2-raund bloki: ' + !!(await p.$('.gp-s11-qayta')) + ' · mentor: ' + (await p.innerText('.mentor-txt, .q-mentor, .mentor').catch(() => '?')).slice(0, 70));
await p.screenshot({ path: OUT + '/m1012-uz/s07-raund2.png' });
await p.click('.gp-s11-qayta button'); await p.waitForTimeout(1500);
log('taymer yurdi: ' + (await p.innerText('.gp-s11-qayta')).replace(/\n/g, ' ').slice(0, 130));
await p.click('.gp-s11-qayta button'); await p.waitForTimeout(700);
log("to'xtagach: " + JSON.stringify(await nav(p)) + ' · xulosa: ' + (await p.$$('.gp-s11-qayta .q-xulosa')).length + ' · nishon toast: ' + !!(await p.$('.acu-overlay')));
const prog = await p.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
log('saqlandi: earned=' + JSON.stringify(prog.earned) + ' · answers[7].qayta=' + (prog.answers && prog.answers[7] && prog.answers[7].qayta));
if (await p.$('.acu-overlay')) { await p.click('.acu-overlay'); await p.waitForTimeout(400); }
await p.screenshot({ path: OUT + '/m1012-uz/s07-raund2-tugadi.png' });
const p2 = await ochish({ ...prog, screen: 7 });
log('qayta ochildi: ' + JSON.stringify(await nav(p2)) + ' · xulosa: ' + (await p2.$$('.gp-s11-qayta .q-xulosa')).length);
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
