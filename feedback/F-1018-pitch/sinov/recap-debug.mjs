import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m8d11-pitch-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript((id) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: 10, maxReached: 10, answers: {}, earned: [], startedAt: Date.now(), total: 11, savedAt: Date.now() })); }, ID);
const p = await ctx.newPage(); await p.goto('file://' + OUT + '/m811-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(3000);
console.log(await p.evaluate(() => {
  const li = document.querySelector('.recap li'); const ul = document.querySelector('.recap');
  const cs = li && getComputedStyle(li);
  let kf = []; for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (r.type === 7) kf.push(r.name); } catch (e) {} }
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  return { liCount: document.querySelectorAll('.recap li').length, ulDisplay: ul && getComputedStyle(ul).display, opacity: cs && cs.opacity, anim: cs && cs.animationName, dur: cs && cs.animationDuration, fill: cs && cs.animationFillMode, kfHasFadeInUp: kf.includes('fade-in-up'), reduced: rm, liText: li && li.innerText.slice(0, 60), rect: li && JSON.stringify(li.getBoundingClientRect()) };
}));
await p.screenshot({ path: OUT + '/m811-uz/s10-recap.png' }); await b.close();
