import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
const ID = process.argv[3];
await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 1, maxReached: 1, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, ID);
const p = await ctx.newPage(); await p.goto('file://' + process.argv[2]); await p.waitForTimeout(1500);
console.log(await p.evaluate(() => { const t = document.querySelector('.am-tayyor'); const bt = document.querySelector('.am-tt-btn'); const cs = getComputedStyle(t), cb = getComputedStyle(bt); return { tayyorBg: cs.backgroundColor, btnBg: cb.backgroundColor, hover: bt.matches(':hover'), fokus: document.activeElement === bt, anim: cs.animationName }; }));
await b.close();
