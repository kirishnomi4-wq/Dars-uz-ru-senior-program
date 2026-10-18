// F-1018-13 · m9-16 QA F-1015-344…347 tekshiruvi. Chaqirish: node feedback/F-1018-pitch/sinov/qa344-347-m916.mjs <suratlar/m916>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m9d16-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ochish = async (prog, w = 1280, h = 820) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, pr]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, pr); }, [ID, JSON.stringify(prog)]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/m916-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const pr = (screen, answers = {}) => ({ screen, maxReached: screen, answers, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() });
const mentor = (p) => p.innerText('.mentor').catch(() => '?');
const log = (x) => console.log(x);
// 344
let p = await ochish(pr(4), 390, 844);
await (await p.$$('.q-bashorat button'))[0].click(); await p.waitForTimeout(1200);
log('344 qadamlar: ' + JSON.stringify(await p.$$eval('.pt-qq > *', a => a.map(x => x.innerText.trim()))) + ' · mentor: ' + (await mentor(p)).replace(/\n/g, ' ').slice(0, 90));
await p.screenshot({ path: OUT + '/m916-uz/qa344-390.png' });
await p.click('.pt-qq button'); await p.waitForTimeout(400);
log('344 bosilgach mentor: ' + (await mentor(p)).replace(/\n/g, ' ').slice(0, 80));
await p.waitForTimeout(3000);
log('344 2-qadamda: ' + JSON.stringify(await p.$$eval('.pt-qq > *', a => a.map(x => x.innerText.trim()))) + ' · mentor: ' + (await mentor(p)).replace(/\n/g, ' ').slice(0, 90));
// 345
p = await ochish(pr(7));
await p.locator('button', { hasText: '3 daqiqani boshlash' }).click(); await p.waitForTimeout(1200);
await p.locator('.pt-tmr button', { hasText: "To'xtatish" }).click(); await p.waitForTimeout(400);
log('345 1-bosish (1 s): ' + (await p.innerText('.pt-tmr')).replace(/\n/g, ' '));
await p.screenshot({ path: OUT + '/m916-uz/qa345-erta.png' });
await p.locator('button', { hasText: "Baribir to'xtatish" }).click(); await p.waitForTimeout(500);
log('345 2-bosish: varaq faol=' + !!(await p.$('.pt-vq-bel')) + ' · mentor: ' + (await mentor(p)).replace(/\n/g, ' ').slice(0, 70));
// 346
const varaq = [{ qism: 'muammo', belgi: '✗', izoh: 'dalil son emas', tuzatildi: false }, { qism: 'yechim', belgi: '✓', izoh: '', tuzatildi: false }, { qism: 'demo', belgi: '✓', izoh: '', tuzatildi: false }, { qism: 'keyingi', belgi: '✓', izoh: '', tuzatildi: false }];
p = await ochish(pr(7, { 7: { stage: 'juftlik', screenIdx: 7, qadam: 2, vaqt: 170, varaq, solved: false, correct: true, picked: true } }));
log('346 Tuzatish belgisi: ' + (await p.$$('.pt-vq-tuz')).length + ' · xira: ' + (await p.$$('.pt-vq-q.xira')).length + ' · mentor: ' + (await mentor(p)).replace(/\n/g, ' ').slice(0, 90));
await p.screenshot({ path: OUT + '/m916-uz/qa346-tuzating.png' });
await p.click('.pt-vq-bos'); await p.waitForTimeout(500);
log('346 ochilgach mentor: ' + (await mentor(p)).replace(/\n/g, ' ').slice(0, 90));
await p.screenshot({ path: OUT + '/m916-uz/qa346-ochiq.png' });
// 347
p = await ochish(pr(6));
log('347 savol: ' + (await p.innerText('h2.h-ask')).replace(/\n/g, ' ') + ' · vizual: ' + !!(await p.$('.pt-yv')));
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
