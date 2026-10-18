// F-1018-05 · m7-12 Screen12 ikkinchi raund tekshiruvi (qator yozilgach «Qayta ayting» bloki va tugma). Chaqirish: node feedback/F-1018-pitch/sinov/raund2-m712.mjs <shots-papka (m712-uz/_p.html bor)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'm7-12-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript((id) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: 7, maxReached: 7, answers: {}, earned: [], startedAt: Date.now(), total: 10, savedAt: Date.now() })); }, ID);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + OUT + '/m712-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Davom|Qayta ayting/.test(x.innerText)).pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const out = [];
out.push('boshida: ' + JSON.stringify(await nav()) + ' · 2-raund bloki: ' + !!(await p.$('.ps-s12-qayta')));
const inp = await p.$('textarea, input[type=text]'); await inp.fill("Dilnoza — kitob topolmagan o'quvchi"); await p.waitForTimeout(500);
out.push('qator yozilgach: ' + JSON.stringify(await nav()) + ' · 2-raund bloki: ' + !!(await p.$('.ps-s12-qayta')) + ' · taymerlar: ' + (await p.$$('.ps-taymer')).length);
await p.screenshot({ path: OUT + '/m712-uz/s07-raund2.png' });
// 2-taymerni boshlash va 60 s kutmasdan: tugmani bosib, holat matni
await p.click('.ps-s12-qayta button'); await p.waitForTimeout(400);
out.push('2-taymer yurdi: ' + (await p.innerText('.ps-s12-qayta')).replace(/\n/g,' ').slice(0, 120));
out.push('pageerror: ' + errs.length);
console.log(out.join('\n')); await b.close();
