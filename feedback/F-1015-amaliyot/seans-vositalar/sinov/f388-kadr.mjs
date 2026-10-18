// F-1015-388 · kirish sahnasi kadrlari: har 0.5 s da surat (animatsiya ko'rinishini tekshirish). Chaqirish: node …/f388-kadr.mjs <html> <chiqish> [kenglik]
import { chromium } from 'playwright-core';
const [,, PAGE, OUT, W = '1280'] = process.argv; const ID = 'fullstack-connect-practice-p2-v18';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: +W, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, ID);
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + PAGE); await p.waitForTimeout(900);
const box = await p.locator('.us-sahna').boundingBox();
for (let k = 0; k < 8; k++) { await p.screenshot({ path: `${OUT}/kadr-${W}-${k}.png`, clip: { x: box.x - 10, y: box.y - 10, width: box.width + 20, height: box.height + 70 } }); await p.waitForTimeout(450); }
console.log('xato', errs.length, JSON.stringify(box));
await b.close();
