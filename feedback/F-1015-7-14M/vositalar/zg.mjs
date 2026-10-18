import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, S, KEY, LID, SCR, W, H, TAG] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: +W, height: +H } });
await p.addInitScript(([lid, s, tot]) => { try { localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: +s, answers: {}, earned: [], missed: [], total: +tot, savedAt: Date.now() })); } catch {} }, [LID, SCR, process.env.TOT||17]);
await p.goto('https://coddycamp-9modul.vercel.app/#' + KEY, { waitUntil: 'domcontentloaded', timeout: 30000 });
await p.waitForTimeout(3000);
const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 3000 }).catch(()=>{}); await p.waitForTimeout(2500); }
console.log(TAG, 'ekran', await p.evaluate(() => (document.body.innerText.match(/(\d\d) \/ \d\d/)||[])[0]));
const zb = p.locator('.zoom-btn:visible').first(); console.log('zoom-btn', await zb.count());
await zb.click({ timeout: 3000 }).catch(e => console.log('click err', e.message.slice(0,60))); await p.waitForTimeout(1000);
await p.screenshot({ path: `${S}/${TAG}.png` });
console.log(await p.evaluate(() => {
  const z = document.querySelector('.zoom-on'); if (!z) return 'no zoom-on';
  const r = z.getBoundingClientRect(); const bd = document.querySelector('.zoom-backdrop')?.getBoundingClientRect();
  const cs = getComputedStyle(z);
  const out = ['popup ' + JSON.stringify([r.x|0, r.y|0, r.width|0, r.height|0]) + ' pos=' + cs.position + ' backdrop ' + JSON.stringify(bd && [bd.x|0, bd.y|0, bd.width|0, bd.height|0])];
  for (let e = z.parentElement; e; e = e.parentElement) { const c = getComputedStyle(e);
    const f = ['transform','filter','contain','backdropFilter','willChange','perspective','containerType','animationName'].map(k => [k, c[k]]).filter(([k,v]) => v && !['none','normal','auto'].includes(v));
    if (f.length) out.push(String(e.className).slice(0,50) + ' :: ' + f.map(x=>x.join('=')).join(' ; ')); }
  return out.join('\n');
}));
await b.close();
