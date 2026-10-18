import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, S, LID] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.addInitScript(lid => { try { localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: 6, answers: {}, earned: [], missed: [], total: 17, savedAt: Date.now() })); } catch {} }, LID);
await p.goto('https://coddycamp-9modul.vercel.app/#m7-01', { waitUntil: 'domcontentloaded', timeout: 30000 });
await p.waitForTimeout(3000);
const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 3000 }).catch(()=>{}); await p.waitForTimeout(1200); }
const davom = p.getByText(/Davom ettirish|Qolgan joydan/); if (await davom.count()) { await davom.first().click({ timeout: 3000 }).catch(()=>{}); await p.waitForTimeout(1200); }
console.log('ekran', await p.evaluate(() => (document.body.innerText.match(/(\d\d) \/ 17/)||[])[1]));
await p.screenshot({ path: S + '/a.png' });
const zb = p.locator('.zoom-btn').first(); console.log('zoom-btn', await zb.count());
await zb.click({ timeout: 3000 }).catch(e => console.log('click err', e.message.slice(0,80))); await p.waitForTimeout(900);
await p.screenshot({ path: S + '/b.png' });
console.log(await p.evaluate(() => {
  const z = document.querySelector('.zoom-on'); if (!z) return 'no zoom-on';
  const r = z.getBoundingClientRect(); const bd = document.querySelector('.zoom-backdrop')?.getBoundingClientRect();
  const out = ['popup ' + JSON.stringify([r.x|0, r.y|0, r.width|0, r.height|0]) + ' backdrop ' + JSON.stringify(bd && [bd.x|0, bd.y|0, bd.width|0, bd.height|0])];
  for (let e = z.parentElement; e; e = e.parentElement) { const c = getComputedStyle(e);
    const f = ['transform','filter','contain','backdropFilter','willChange','perspective','containerType','animationName','overflow'].map(k => [k, c[k]]).filter(([k,v]) => v && !['none','normal','visible','auto'].includes(v));
    if (f.length) out.push(String(e.className).slice(0,60) + ' :: ' + f.map(x=>x.join('=')).join(' ; ')); }
  return out.join('\n');
}));
await b.close();
