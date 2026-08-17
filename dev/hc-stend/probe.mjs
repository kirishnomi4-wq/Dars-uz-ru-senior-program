import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const b = await chromium.launch({ executablePath: CHROME, headless: true }); const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type()==='error') errs.push('CONSOLE ' + m.text()); });
await p.goto('http://127.0.0.1:4517/'); await p.evaluate(() => window.mountHC({ lang: 'uz' }));
await p.waitForSelector('.hc-root textarea.hc-code', { timeout: 10000 });
await p.click('.hc-code'); await p.keyboard.type('<h1>Salom</h1>'); await p.waitForTimeout(800);
console.log('chips:', await p.$$eval('.hc-top *', els => els.map(e=>e.className).filter(c=>/chip|req|done|ok/.test(c)).slice(0,6)));
console.log('errors:', errs); await p.screenshot({ path: 'probe.png' }); await b.close();
