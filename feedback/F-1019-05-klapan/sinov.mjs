// F-1019-05 · klapan ochilganda: tugma «Davom etish», «Qolganini keyinroq…» qatori yo'q. node feedback/F-1019-05-klapan/sinov.mjs <suratlar> <Dars:lessonId:ekranlar>...
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const arg of process.argv.slice(3)) {
  const [k, ID, ekr, TOT] = arg.split(':');
  for (const sc of ekr.split(',').map(Number)) {
    const errs = [];
    const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
    await ctx.addInitScript(([id, sc, tot]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: Number(tot), savedAt: Date.now() })); }, [ID, sc, TOT]);
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.clock.install();
    await p.goto('file://' + OUT + '/' + k + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.clock.runFor(1500);
    const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? (b.disabled ? '(yopiq) ' : '') + b.innerText.trim() : '-'; });
    const oldin = await nav();
    await p.clock.runFor(125000); await p.waitForTimeout(300);
    const keyin = await nav(); const qator = await p.evaluate(() => document.body.innerText.includes('Qolganini keyinroq'));
    console.log(`${k} s${sc}: oldin «${oldin.slice(0, 50)}» → 125 s dan keyin «${keyin.slice(0, 50)}» · eski qator: ${qator} · pageerror ${errs.length}`);
    await ctx.close();
  }
}
await b.close();
