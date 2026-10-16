import { chromium } from 'playwright-core';
const [page, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [w, h, scr, u, nom] of [[1280, 820, 0, null, 's0'], [1280, 820, 3, 'minimal', 'a2-min'], [1280, 820, 3, 'qorongi', 'a2-qor'], [1280, 820, 3, 'gradient', 'a2-gra'], [1280, 820, 4, 'qorongi', 'a3-qor'], [1280, 820, 2, null, 'a1-xom'], [390, 844, 0, null, 'm-s0']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([s, u]) => { localStorage.clear(); localStorage.setItem('liveSession:css-practice-portfolio-v3', '{"mode":"self"}'); if (u) localStorage.setItem('ccDemoDay', JSON.stringify({ uslub: u })); localStorage.setItem('ccProgress:css-practice-portfolio-v3', JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, [scr, u]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForSelector('.ds'); await p.waitForTimeout(2200);
  const el = await p.$('.ds'); await el.screenshot({ path: `${out}/${nom}.png` }); console.log(nom, errs.length ? errs : 'ok'); await ctx.close();
}
await b.close();
