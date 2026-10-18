import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, S, LID] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.addInitScript(lid => { try { localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: 5, answers: {}, earned: [], missed: [], total: 17, savedAt: Date.now() })); } catch {} }, LID);
await p.goto('https://coddycamp-9modul.vercel.app/#m7-01', { waitUntil: 'domcontentloaded', timeout: 30000 });
await p.waitForTimeout(3000);
const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 3000 }).catch(()=>{}); await p.waitForTimeout(1200); }
const davom = p.getByText(/Davom ettirish|Qolgan joydan/); if (await davom.count()) { await davom.first().click({ timeout: 3000 }).catch(()=>{}); await p.waitForTimeout(1200); }
const nb = await p.evaluate(() => [...document.querySelectorAll('button')].filter(x=>x.offsetParent).map(x=>x.innerText.trim().slice(0,25)).join(' | ')); console.log('tugmalar:', nb);
for (let i=0;i<8;i++){ const e=await p.evaluate(() => (document.body.innerText.match(/(\d\d) \/ 17/)||[])[1]); if(e==='07') break;
  const nx=p.locator('button:not([disabled])').filter({ hasText: /davom|keyingi|tekshir|javob/i }).last();
  if (await nx.count()) { await nx.click({timeout:2000}).catch(()=>{}); } else { const v=p.locator('button:has(.q-test-harf)'); const n=await v.count(); console.log('variant',n); if(n) await v.nth(1).click({timeout:2000}).catch(()=>{}); }
  await p.screenshot({path: '/tmp/claude-1000/-home-kali-Desktop-internetLesson/2556e370-06da-4079-9a9c-3c745bf46435/scratchpad/s'+i+'.png'}); await p.waitForTimeout(900); }
console.log('ekran', await p.evaluate(() => (document.body.innerText.match(/(\d\d) \/ 17/)||[])[1]));
await p.screenshot({ path: S + '/a.png' });
const zb = p.locator('.zoom-btn').first(); console.log('zoom-btn', await zb.count());
await zb.click({ timeout: 3000 }).catch(e => console.log('click err', e.message.slice(0,80))); await p.waitForTimeout(900);
await p.screenshot({ path: S + '/d.png' });
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
