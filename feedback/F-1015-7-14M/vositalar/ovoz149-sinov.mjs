import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const yur = async (key, lid, sc, tot, matn) => {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  await p.addInitScript(([l, s, t]) => { localStorage.setItem('ccProgress:' + l, JSON.stringify({ screen: +s, answers: {}, earned: [], total: +t, savedAt: Date.now() }));
    const O = window.AudioContext; window.__osc = 0; window.AudioContext = class extends O { createOscillator() { window.__osc++; return super.createOscillator(); } }; }, [lid, sc, tot]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`); await p.waitForSelector('.lesson-root'); const k = p.getByText(/Kodsiz/); if (await k.count()) await k.first().click().catch(() => {}); await p.waitForTimeout(1500);
  await p.getByText(matn).first().click(); await p.waitForTimeout(600);
  const osc1 = await p.evaluate(() => window.__osc); const tug = await p.locator('.q-ovoz').count();
  if (tug) await p.locator('.q-ovoz').first().click(); const ls = await p.evaluate(() => localStorage.getItem('cc_ovoz'));
  await p.screenshot({ path: `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-139-keyin/${key}-ovoz.jpg`, type: 'jpeg', quality: 75 });
  console.log(key, 'oscillator:', osc1, 'tugma:', tug, 'cc_ovoz:', ls);
};
await yur('m8-09', 'm8-09-v1', 4, 12, 'Yangilanadi, chunki yangi push qilindi');
await yur('m5-01', 'pm-m5d1-v1', 0, 14, 'xxx').catch(e => console.log('m5-01', e.message.slice(0, 60)));
await b.close();
