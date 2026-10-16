import { chromium } from 'playwright-core';
const page = process.argv[2];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [w, scr] of [[390, 0], [390, 5], [1280, 0], [1280, 5]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 } });
  await ctx.addInitScript(([s]) => { localStorage.clear(); localStorage.setItem('liveSession:css-practice-portfolio-v3', '{"mode":"self"}'); localStorage.setItem('ccProgress:css-practice-portfolio-v3', JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, [scr]);
  const p = await ctx.newPage(); const t0 = Date.now(); let done = null;
  p.on('requestfinished', r => { if (r.url().includes('c7b7116')) done = Date.now() - t0; });
  p.on('requestfailed', r => { if (r.url().includes('c7b7116')) done = 'FAIL ' + r.failure()?.errorText; });
  await p.goto('file://' + page); await p.waitForSelector('.lesson-root');
  const at = async () => p.evaluate(() => [...document.querySelectorAll('.mentor-ava img')].map(i => ({ src: i.src.slice(-20), complete: i.complete, nw: i.naturalWidth })));
  const a1 = await at(); await p.waitForTimeout(6000); const a2 = await at();
  console.log(`${w}px s${scr}: darhol`, JSON.stringify(a1), '| 6s keyin', JSON.stringify(a2), '| so\'rov', done);
  await ctx.close();
}
await b.close();
