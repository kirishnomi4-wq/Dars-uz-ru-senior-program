import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript(() => { localStorage.clear(); localStorage.setItem('liveSession:css-practice-portfolio-v3', '{"mode":"self"}'); });
const p = await ctx.newPage(); await p.goto('file://' + process.argv[2]); await p.waitForSelector('.hook-option');
for (const t of [500, 1500, 3000]) { await p.waitForTimeout(t === 500 ? 500 : 1000); console.log(t, await p.evaluate(() => [...document.querySelectorAll('.hook-option')].map(e => getComputedStyle(e).opacity + '/' + getComputedStyle(e).animationName + '/' + e.disabled).join(' | '))); }
await b.close();
