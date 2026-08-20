import { chromium } from 'playwright-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const LID = 'pm-m4c6-v1';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const errs = [];
async function goto(sc, pre) {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await c.addInitScript(([lid, s, p]) => {
    localStorage.setItem('liveSession:' + lid, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: 16, savedAt: Date.now() }));
    Object.entries(p || {}).forEach(([k, v]) => localStorage.setItem(k, v));
  }, [LID, sc, pre]);
  const pg = await c.newPage();
  pg.on('pageerror', e => errs.push('s' + sc + ': ' + e.message.slice(0, 90)));
  await pg.goto('http://localhost:5173/#/lesson/m4c-06', { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('.lesson-root', { timeout: 20000 });
  await pg.waitForTimeout(1200);
  return pg;
}
const vis = (pg, sel) => pg.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), inView: b.top >= 0 && b.bottom <= window.innerHeight }; }, sel);

// s2: ikkala kartani bosish -> xulosa ko'rinadimi
let p = await goto(2);
for (const b of await p.$$('.dfc')) { await b.click(); await p.waitForTimeout(200); }
await p.waitForTimeout(900);
console.log('s2 .xul', JSON.stringify(await vis(p, '.xul')));

// s4: jurnal tugmasi done holatda ochiladimi
p = await goto(4, { 'pm-m4c6-kun': '{"dayDone":true,"picked":[1,3,10]}' });
console.log('s4 fakt soni (yopiq)', await p.$$eval('.fakt', e => e.length), '| tugma', await p.$eval('.fakts-more', e => e.innerText.trim()));
await p.click('.fakts-more'); await p.waitForTimeout(300);
console.log('s4 fakt soni (ochiq)', await p.$$eval('.fakt', e => e.length), '| tugma', await p.$eval('.fakts-more', e => e.innerText.trim()));
await p.click('.fakts-more'); await p.waitForTimeout(300);
console.log('s4 qayta yopildi ->', await p.$$eval('.fakt', e => e.length));

// s9: to'rt signalga yo'l -> bdone ko'rinadimi
p = await goto(9);
for (let i = 0; i < 4; i++) {
  await p.click('.yolb'); await p.waitForTimeout(350);
  const nx = await p.$('.nextsig'); if (nx) { await nx.click(); await p.waitForTimeout(300); }
}
await p.waitForTimeout(900);
console.log('s9 .bdone', JSON.stringify(await vis(p, '.bdone')));

// s15: uy-vazifa kartasi
p = await goto(15);
await p.click('.hw-big'); await p.waitForTimeout(1400);
console.log('s15 HwCard', JSON.stringify(await vis(p, '.hw-big-wrap + div')));
console.log('ERRS', errs);
await browser.close();
