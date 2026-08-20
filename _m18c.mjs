import { chromium } from 'playwright-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const LID = 'pm-m4c6-v1';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await c.addInitScript((lid) => {
  localStorage.setItem('liveSession:' + lid, JSON.stringify({ mode: 'self' }));
  localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: 8, answers: {}, earned: [], startedAt: Date.now(), total: 16, savedAt: Date.now() }));
}, LID);
const p = await c.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 90)));
await p.goto('http://localhost:5173/#/lesson/m4c-06', { waitUntil: 'domcontentloaded' });
await p.waitForSelector('.lesson-root', { timeout: 20000 });
await p.waitForTimeout(1000);
for (let i = 0; i < 3; i++) {
  await p.fill('.num-in', '5');
  await p.waitForTimeout(200);
  await p.fill('.reflect-input:not(.num-in)', 'kirgan odam kutib yopib ketadi');
  await p.waitForTimeout(200);
  await p.click('.wsp-save');
  await p.waitForTimeout(400);
}
await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(() => { const e = document.querySelector('.wsp-list'); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), inView: b.top >= 0 && b.bottom <= innerHeight, over: (document.querySelector('.stage-content')||{}).scrollHeight - (document.querySelector('.stage-content')||{}).clientHeight }; })));
console.log('ERRS', errs);
await browser.close();
