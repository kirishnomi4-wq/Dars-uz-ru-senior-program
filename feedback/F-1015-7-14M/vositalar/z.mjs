import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await p.goto('https://coddycamp-9modul.vercel.app/#m7-01', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click(); await p.waitForTimeout(800); }
for (let i = 0; i < 25; i++) {
  const t = await p.evaluate(() => document.body.innerText);
  if (t.includes('boshqalarga ham')) break;
  const nx = p.locator('button:has-text("→"):not([disabled])').last();
  const ctr = await p.evaluate(() => (document.body.innerText.match(/(\d\d) \/ 17/)||[])[1]); console.log('ekran', ctr);
  if (!(await nx.count())) { console.log('no next at', i); break; }
  // quiz/answer screens: click first option if next disabled
  await nx.click({ timeout: 2000 }).catch(async () => { for (const sel of ['.q-variant','.q-test-v','.q-chip','.q-btn','[role=radio]']) { const l=p.locator(sel); const n=await l.count(); for(let k=0;k<n;k++) await l.nth(k).click({timeout:800}).catch(()=>{}); } });
  await p.waitForTimeout(700);
}
await p.screenshot({ path: process.argv[2] + '/a.png' });
const zb = p.locator('.zoom-btn').first(); console.log('zoom-btn', await zb.count());
await zb.click(); await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[2] + '/b.png' });
console.log(await p.evaluate(() => {
  const z = document.querySelector('.zoom-on'); if (!z) return 'no zoom-on';
  const r = z.getBoundingClientRect(); const out = ['rect ' + JSON.stringify([r.x|0, r.y|0, r.width|0, r.height|0])];
  for (let e = z.parentElement; e; e = e.parentElement) { const c = getComputedStyle(e);
    const f = ['transform','filter','contain','backdropFilter','willChange','perspective','containerType','overflow','zoom'].map(k => [k, c[k]]).filter(([k,v]) => v && !['none','normal','visible','auto','1'].includes(v));
    if (f.length) out.push((e.className||e.tagName) + ' :: ' + f.map(x=>x.join('=')).join(' ; ')); }
  return out.join('\n');
}));
await b.close();
