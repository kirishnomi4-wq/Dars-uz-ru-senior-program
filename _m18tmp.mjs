import { chromium } from 'playwright-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const LID = process.env.LID || 'pm-m4c6-v1';
const SC = Number(process.argv[2] || 4);
const KUN = process.argv[3] || '{"dayDone":true,"picked":[1,3,10]}';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await ctx.addInitScript(([lid, sc, kun]) => {
  try {
    localStorage.setItem('liveSession:' + lid, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('pm-m4c6-kun', kun);
    localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: 16, savedAt: Date.now() }));
  } catch {}
}, [LID, SC, KUN]);
const page = await ctx.newPage();
page.on('pageerror', e => console.log('ERR', e.message.slice(0,120)));
await page.goto('http://localhost:5173/#/lesson/m4c-06', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.lesson-root', { timeout: 20000 });
await page.waitForTimeout(2500);
const r = await page.evaluate(() => {
  const out = {};
  const sc = document.querySelector('.screen');
  out.h2 = document.querySelector('.screen h2')?.innerText;
  const cands = [...document.querySelectorAll('.lesson-root *')].filter(e => e.scrollHeight - e.clientHeight > 2 && /auto|scroll/.test(getComputedStyle(e).overflowY));
  out.scrollers = cands.map(e => ({ cls: e.className.toString().slice(0,40), over: e.scrollHeight - e.clientHeight }));
  if (sc) out.screen = { sh: sc.scrollHeight, h: Math.round(sc.getBoundingClientRect().height), bottom: Math.round(sc.getBoundingClientRect().bottom) };
  const xul = document.querySelector('.xul');
  if (xul) { const b = xul.getBoundingClientRect(); out.xul = { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) }; }
  out.vh = window.innerHeight;
  out.blocks = [...(sc?.children||[])].map(e => ({ c: e.className.toString().slice(0,30), h: Math.round(e.getBoundingClientRect().height) }));
  return out;
});
console.log(JSON.stringify(r));
await page.screenshot({ path: process.env.SHOT || 'C:/Users/ADMIN/AppData/Local/Temp/s4.png' });
await browser.close();
