// F-1019-08: m12-08 Screen2 «Savol-javob» — bashorat → 3 savol (ikki javob kartasi); bo'sh «1:00» katak ko'rinmasligi
import { chromium } from 'playwright-core';
const [page, W] = [process.argv[2], +(process.argv[3] || 1280)];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript(() => { if (sessionStorage.getItem('_b')) return; sessionStorage.setItem('_b', 1); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:pm-m12d8-v2', JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:pm-m12d8-v2', JSON.stringify({ screen: 2, maxReached: 2, answers: {}, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() })); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1000);
const h = () => p.evaluate(() => ({ kat: [...document.querySelectorAll('.fp-kat')].map(x => x.className.replace('fp-kat ', '')), nav: [...document.querySelectorAll('.stage-nav button')].pop().innerText }));
await p.locator('.q-bashorat button').first().click(); await p.waitForTimeout(900);
console.log('bashoratdan keyin', JSON.stringify(await h()));
for (let n = 0; n < 3; n++) {
  const c = await p.$$('button.fp-jk'); let ok = false;
  for (const x of c) { await x.click(); await p.waitForTimeout(1900); const hh = await h(); if (hh.kat.filter(k => k.startsWith('ok')).length > n) { ok = true; break; } }
  console.log(`savol ${n + 1}:`, ok ? 'to\'g\'ri topildi' : 'TOPILMADI', JSON.stringify(await h()));
  if (n === 0) await p.screenshot({ path: page.replace('_p.html', `sj-${W}-1.png`) });
}
await p.waitForTimeout(1500); await p.screenshot({ path: page.replace('_p.html', `sj-${W}-oxir.png`), fullPage: true });
console.log('oxiri', JSON.stringify(await h()), 'pageerror', errs.length, errs.join('|'));
await b.close();
