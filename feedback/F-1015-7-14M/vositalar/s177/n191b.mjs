import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const sc of [12, 13, 14]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 } }); const p = await ctx.newPage();
  await p.addInitScript(([sc]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:pm-m9d2-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 16, savedAt: Date.now() })); }, [sc]);
  await p.goto('http://localhost:5300/#/lesson/m9-02', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1200);
  const t = await p.locator('.lesson-root').evaluate(r => r.innerText);
  const m = t.match(/Nishonlar[^\n]*/); if (m) { console.log('ekran', sc, m[0], '| Pair Review:', /Pair Review/.test(t)); await p.screenshot({ path: `/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-191-keyin/s${sc}-natijalar.jpg`, type: 'jpeg', quality: 70 }); }
  await ctx.close();
}
await b.close();
