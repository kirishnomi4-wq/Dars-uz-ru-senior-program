import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await (await b.newContext({ viewport: { width: 1280, height: 820 } })).newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
await p.goto('http://localhost:5173/#/lesson/m1-10'); await p.waitForTimeout(4000);
console.log((await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300)); console.log('pageerror', JSON.stringify(errs));
await b.close();
