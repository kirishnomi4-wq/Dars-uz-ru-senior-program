import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [OUT, ID, sc, tot, pre, x, t] of [
  ['/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar/m1202-uz', 'pm-m12d2-v2', 2, 10, 'sp', 'Ilovaning', 'Bitta tashkilotchi'],
  ['/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar/m1205-uz', 'pm-m12d5-v2', 2, 9, 'gv', 'Pitchdan oldin', 'Pitch tugagandan']]) {
  const m = await b.newContext({ viewport: { width: 390, height: 844 } }); await m.route(/^https?:\/\//, r => r.abort());
  await m.addInitScript(([id, sc, tot]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() })); }, [ID, sc, tot]);
  const p = await m.newPage(); await p.goto('file://' + OUT + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  await (await p.$$('.q-bashorat button'))[0].click(); await p.waitForTimeout(800);
  const top = () => p.evaluate((pr) => { const e = document.querySelector('.' + pr + '-qr'); const i = document.querySelector('.' + pr + '-sahna-iz'); return { savol: e && Math.round(e.getBoundingClientRect().top), izoh: i && Math.round(i.getBoundingClientRect().top) }; }, pre);
  console.log(ID, 'boshida', JSON.stringify(await top()));
  await p.locator('.' + pre + '-qr-v button', { hasText: t }).click(); await p.waitForTimeout(8000);
  console.log(ID, '1-javobdan keyin', JSON.stringify(await top()));
  await p.screenshot({ path: OUT + '/t-390-savol.png' });
}
await b.close();
