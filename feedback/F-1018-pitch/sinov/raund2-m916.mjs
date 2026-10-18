// F-1018-07 · m9-16 Screen11 4-qadam (2-raund) + ScreenIlova tekshiruvi. Chaqirish: node feedback/F-1018-pitch/sinov/raund2-m916.mjs <shots-papka (m916-uz/_p.html bor)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m9d16-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ochish = async (prog, pitchJson) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, pr, pj]) => {
    for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
    localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('ccProgress:' + id, pr);
    localStorage.setItem('pm-m9d16-pitch', pj || JSON.stringify({ muammo: { gap: 'Mahalla maydonida futbolga odam yetmaydi', dalil: '6 tadan 4 tasi — ish bilan' }, yechim: "Ilova o'yinni e'lon qiladi va kelganlarni sanaydi", demo: { harakat: "Shanba 18:00 · «Boraman»", tuzatish: 'Tugma kattalashtirildi', son: '' }, keyingi: 'Keyingi hafta 3 ta o\'yin', vaqt: 170, varaq: [{ qism: 'muammo', belgi: '✓', izoh: '', tuzatildi: false }, { qism: 'yechim', belgi: '✗', izoh: 'nima qilishi tushunarsiz', tuzatildi: true }, { qism: 'demo', belgi: '✓', izoh: '', tuzatildi: false }, { qism: 'keyingi', belgi: '✓', izoh: '', tuzatildi: false }], savedAt: Date.now() }));
  }, [ID, JSON.stringify(prog), pitchJson || null]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/m916-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Davom|Qayta ayting|Bitta bo|Tekshiring/.test(x.innerText)).pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const out = { push: (x) => console.log(x) };
// s11 (indeks 7): bo'lak tuzatilgan holat (solved) — 2-raund kutilmoqda
const varaq = [{ qism: 'muammo', belgi: '✓', izoh: '', tuzatildi: false }, { qism: 'yechim', belgi: '✗', izoh: 'nima qilishi tushunarsiz', tuzatildi: true }, { qism: 'demo', belgi: '✓', izoh: '', tuzatildi: false }, { qism: 'keyingi', belgi: '✓', izoh: '', tuzatildi: false }];
let p = await ochish({ screen: 7, maxReached: 7, answers: { 7: { stage: 'juftlik', screenIdx: 7, solved: true, correct: true, picked: true, qadam: 2, vaqt: 170, varaq, nishon: ['threeMinutes', 'fixedIt'] } }, earned: ['threeMinutes', 'fixedIt'], startedAt: Date.now(), total: 11, savedAt: Date.now() });
out.push('s11 tuzatilgan: ' + JSON.stringify(await nav(p)) + ' · 2-raund bloki: ' + !!(await p.$('.pt-s11-qayta')));
await p.screenshot({ path: OUT + '/m916-uz/s07-raund2.png' });
await p.click('.pt-s11-qayta button'); await p.waitForTimeout(1500);
out.push('taymer yurdi: ' + (await p.innerText('.pt-s11-qayta')).replace(/\n/g, ' ').slice(0, 130));
await p.click('.pt-s11-qayta button'); await p.waitForTimeout(700);
out.push("to'xtagach: " + JSON.stringify(await nav(p)) + ' · xulosa: ' + (await p.$$('.pt-s11-qayta .q-xulosa')).length + ' · nishon toast: ' + !!(await p.$('.acu-overlay')));
let prog = await p.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
out.push('saqlandi: earned=' + JSON.stringify(prog.earned) + ' · answers[7].qayta=' + (prog.answers && prog.answers[7] && prog.answers[7].qayta));
if (await p.$('.acu-overlay')) { await p.click('.acu-overlay'); await p.waitForTimeout(500); }
await p.screenshot({ path: OUT + '/m916-uz/s07-raund2-tugadi.png' });
// qayta ochish — tiklanadi
let p2 = await ochish({ ...prog, screen: 7 });
out.push('qayta ochildi: ' + JSON.stringify(await nav(p2)) + ' · xulosa: ' + (await p2.$$('.pt-s11-qayta .q-xulosa')).length);
// ilova sahifasi (indeks 8)
await p2.locator('button', { hasText: 'Davom etish' }).last().click(); await p2.waitForTimeout(800);
out.push('ilova boshida: ' + JSON.stringify(await nav(p2)) + ' · kartalar: ' + (await p2.$$('.pt-ilova-k')).length + ' · havola tugmasi: ' + !!(await p2.$('.pt-ilova-och')));
await p2.fill('.pt-ilova-ch input', 'mening-ilovam.onrender.com'); await p2.waitForTimeout(300);
out.push('manzil yozilgach havola: ' + (await p2.getAttribute('.pt-ilova-och', 'href')));
const kartalar = await p2.$$('.pt-ilova-k');
await (await kartalar[0].$('text=✓ Joyida')).click(); await p2.waitForTimeout(200);
await (await kartalar[1].$('text=✗ Kamchilik bor')).click(); await p2.waitForTimeout(300);
out.push('1 ✓, 2 ✗: ' + JSON.stringify(await nav(p2)) + ' · tuzatish ko\'rsatmasi: ' + !!(await p2.$('.pt-ilova-k.bad .pt-ilova-pr')));
await p2.click("text=✓ To'g'rilandi"); await p2.waitForTimeout(200);
await (await kartalar[2].$('text=✓ Joyida')).click(); await p2.waitForTimeout(600);
out.push('3/3: ' + JSON.stringify(await nav(p2)) + ' · xulosa: ' + (await p2.$$('.pt-ilova-on .q-xulosa')).length);
await p2.screenshot({ path: OUT + '/m916-uz/s08-ilova-tugadi.png' });
prog = await p2.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
const pitch = await p2.evaluate(() => JSON.parse(localStorage.getItem('pm-m9d16-pitch') || '{}'));
out.push('saqlandi: answers[8].ilova=' + JSON.stringify(prog.answers && prog.answers[8] && prog.answers[8].ilova) + ' · artefakt ilova=' + pitch.ilova + ' · qayta=' + pitch.qayta);
let p3 = await ochish({ ...prog, screen: 8 }, JSON.stringify(pitch));
out.push('ilova qayta ochildi: ' + JSON.stringify(await nav(p3)) + ' · havola: ' + (await p3.getAttribute('.pt-ilova-och', 'href')));
out.push('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
