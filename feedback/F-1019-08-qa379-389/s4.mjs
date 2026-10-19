// F-1019-08: m12-05 Screen4 «Tuzatishlar ro'yxati» — har kartada xato variant (sabab + yopiladi) → to'g'ri; ro'yxat qatori paydo bo'ladi; bo'sh uya yo'q
import { chromium } from 'playwright-core';
const [page, W] = [process.argv[2], +(process.argv[3] || 1280)];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript(() => { if (sessionStorage.getItem('_b')) return; sessionStorage.setItem('_b', 1); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:pm-m12d5-v2', JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:pm-m12d5-v2', JSON.stringify({ screen: 3, maxReached: 3, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1000);
const holat = () => p.evaluate(() => ({ bosh: document.querySelectorAll('.gv-r-q.bosh').length, qator: document.querySelectorAll('.gv-royxat .gv-r-q').length, kulrang: !!document.querySelector('.gv-royxat .gv-v-bosh'), nav: [...document.querySelectorAll('.stage-nav button')].pop().innerText }));
console.log('boshida', JSON.stringify(await holat()));
const TOGRI = [1, 0, 2];
for (let n = 0; n < 3; n++) {
  const v = await p.$$('.gv-var'); const x = TOGRI[n] === 0 ? 1 : 0;
  await v[x].click(); await p.waitForTimeout(300);
  const sabab = await p.innerText('.gv-karta .q-xato').catch(() => "YO'Q"); const yop = await v[x].isDisabled();
  await v[TOGRI[n]].click(); await p.waitForTimeout(1600);
  console.log(`karta ${n + 1}: xato → «${sabab}» yopildi ${yop} · keyin`, JSON.stringify(await holat()));
  if (n === 0) await p.screenshot({ path: page.replace('_p.html', `s4-${W}-1.png`) });
}
await p.waitForTimeout(1500); await p.screenshot({ path: page.replace('_p.html', `s4-${W}-oxir.png`), fullPage: true });
console.log('oxiri', JSON.stringify(await holat()), 'pageerror', errs.length, errs.join('|'));
await b.close();
