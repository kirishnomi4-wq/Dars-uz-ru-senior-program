// F-1018-06 · m8-11 Screen13 (tuzatish) 2-raund tekshiruvi: slayd tuzatilgach «Qayta ayting (1 daqiqa)» bloki, taymer, Davom ochilishi.
// Chaqirish: node feedback/F-1018-pitch/sinov/raund2-m811.mjs <shots-papka (m811-uz/_p.html bor)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m8d11-pitch-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript((id) => {
  for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
  localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }));
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 8, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() }));
  // s11/s12 artefakti: besh slayd + varaq (Yechim ✗)
  localStorage.setItem('pm-m8d11-pitch', JSON.stringify({
    slaydlar: { muammo: { raqam: '12 tadan 9', hikoya: 'Dilnoza lavash buyurtma qilolmadi' }, yechim: 'Sayt', foydalanuvchi: 'Sinovda tugmani topolmadi', raqamlar: { bosh: { nima: 'haftada 6 dan 11 ga', oldin: null, hozir: null }, ab: { a: '', b: '' }, halolGap: 'bir hafta sanaldi' }, keyingi: 'keyingi oy 20 ta' },
    varaq: [{ slayd: 'muammo', belgi: '✓', izoh: '' }, { slayd: 'yechim', belgi: '✗', izoh: 'nima qilishi tushunarsiz' }, { slayd: 'foydalanuvchi', belgi: '✓', izoh: '' }, { slayd: 'raqamlar', belgi: '✓', izoh: '' }, { slayd: 'keyingi', belgi: '✓', izoh: '' }],
    vaqt: 280, savedAt: Date.now()
  }));
}, ID);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + OUT + '/m811-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Davom|Qayta ayting|Bitta slaydni/.test(x.innerText)).pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const out = [];
out.push('boshida: ' + JSON.stringify(await nav()) + ' · 2-raund bloki: ' + !!(await p.$('.pr-s13-qayta')));
// Yechim slaydi formasi ochiq (✗) — matnni o'zgartirib «Slaydga chiqarish»
const ta = await p.$('.pr-s13-ong textarea, .pr-s13-ong input[type=text]');
if (!ta) out.push('❌ forma topilmadi');
else { await ta.fill('Sayt bir bosishda lavash buyurtma qiladi'); await p.waitForTimeout(300); await p.click('text=Slaydga chiqarish'); await p.waitForTimeout(900); }
out.push('tuzatilgach: ' + JSON.stringify(await nav()) + ' · 2-raund bloki: ' + !!(await p.$('.pr-s13-qayta')));
if (await p.$('.acu-overlay')) { await p.click('.acu-overlay'); await p.waitForTimeout(500); }
await p.screenshot({ path: OUT + '/m811-uz/s08-raund2.png' });
await p.click('.pr-s13-qayta button'); await p.waitForTimeout(1500);
out.push('taymer yurdi: ' + (await p.innerText('.pr-s13-qayta')).replace(/\n/g, ' ').slice(0, 140));
await p.click('.pr-s13-qayta button'); await p.waitForTimeout(600);
out.push("to'xtagach: " + JSON.stringify(await nav()) + ' · xulosa: ' + (await p.$$('.pr-s13-qayta .q-xulosa')).length + ' · nishon toast: ' + !!(await p.$('.acu-overlay')));
if (await p.$('.acu-overlay')) { await p.click('.acu-overlay'); await p.waitForTimeout(500); }
await p.screenshot({ path: OUT + '/m811-uz/s08-raund2-tugadi.png' });
// yakun — recap ko'rinadimi (fade)
await p.click('text=Davom etish'); await p.waitForTimeout(700); await p.click('text=Davom etish').catch(() => {}); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + '/m811-uz/s10-yakun.png' });
const prog = await p.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
out.push('saqlandi: earned=' + JSON.stringify(prog.earned) + ' · answers[8].qayta=' + (prog.answers && prog.answers[8] && prog.answers[8].qayta));
// qayta ochish — saqlangan progress bilan yangi kontekst (addInitScript reload'da progressni qayta yozadi, shuning uchun alohida)
const pitch = await p.evaluate(() => localStorage.getItem('pm-m8d11-pitch'));
const ctx2 = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx2.route(/^https?:\/\//, r => r.abort());
await ctx2.addInitScript(([id, pr, pt]) => { for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ ...JSON.parse(pr), screen: 8 })); localStorage.setItem('pm-m8d11-pitch', pt); }, [ID, JSON.stringify(prog), pitch]);
const p2 = await ctx2.newPage(); p2.on('pageerror', e => errs.push(e.message));
await p2.goto('file://' + OUT + '/m811-uz/_p.html'); await p2.waitForSelector('.lesson-root'); await p2.waitForTimeout(900);
const nav2 = await p2.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Davom|Qayta ayting|Bitta slaydni/.test(x.innerText)).pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
out.push('qayta ochildi: ' + JSON.stringify(nav2) + ' · xulosa: ' + (await p2.$$('.pr-s13-qayta .q-xulosa')).length + ' · taymer: ' + (await p2.innerText('.pr-s13-qayta .pr-soat-v')).trim());
out.push('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
console.log(out.join('\n')); await b.close();
