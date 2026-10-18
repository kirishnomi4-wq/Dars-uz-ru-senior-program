import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.goto('https://coddycamp-9modul.vercel.app/#m7-01', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click(); await p.waitForTimeout(800); }
const ekran = () => p.evaluate(() => (document.body.innerText.match(/(\d\d) \/ 17/)||[])[1]);
for (let i = 0; i < 60; i++) {
  const e = await ekran(); if (e === '07') break;
  const navs = await p.evaluate(() => [...document.querySelectorAll('button')].filter(x => x.offsetParent).map(x => (x.disabled?'[D]':'') + x.className + '|' + x.innerText.trim().slice(0,30)));
  if (i < 2) console.log(e, JSON.stringify(navs));
  const nx = p.locator('.nav-next, .q-nav-next, button.primary, button.btn-primary').filter({ hasNot: p.locator('[disabled]') }).last();
  const dis = await nx.isDisabled().catch(() => true);
  if (!dis) { await nx.click().catch(()=>{}); }
  else { for (const sel of ['.q-variant','.q-test-v','.q-chip','.pp-bos','.pp-kirit','.q-btn','[role=radio]','.ak-q']) { const l=p.locator(sel); const n=await l.count(); for(let k=0;k<Math.min(n,12);k++) await l.nth(k).click({timeout:500}).catch(()=>{}); } }
  await p.waitForTimeout(600);
}
console.log('yetdi', await ekran());
await p.screenshot({ path: process.argv[2] + '/a.png' });
await p.locator('.zoom-btn').first().click(); await p.waitForTimeout(900);
await p.screenshot({ path: process.argv[2] + '/b.png' });
console.log(await p.evaluate(() => {
  const z = document.querySelector('.zoom-on'); if (!z) return 'no zoom-on';
  const r = z.getBoundingClientRect(); const out = ['rect ' + JSON.stringify([r.x|0, r.y|0, r.width|0, r.height|0])];
  for (let e = z.parentElement; e; e = e.parentElement) { const c = getComputedStyle(e);
    const f = ['transform','filter','contain','backdropFilter','willChange','perspective','containerType','overflow','zoom','animationName'].map(k => [k, c[k]]).filter(([k,v]) => v && !['none','normal','visible','auto','1'].includes(v));
    if (f.length) out.push((e.className||e.tagName) + ' :: ' + f.map(x=>x.join('=')).join(' ; ')); }
  return out.join('\n');
}));
await b.close();
