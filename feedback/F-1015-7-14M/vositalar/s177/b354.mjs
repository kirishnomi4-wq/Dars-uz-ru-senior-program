import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const { KEY, LID } = process.env; const N = +process.env.N; const sc = +process.env.EKRAN;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
await p.addInitScript(([sc, LID, N]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('pm-m9d8-platforma', JSON.stringify({ trek: 'web' })); localStorage.setItem(`ccProgress:${LID}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: N, savedAt: Date.now() })); }, [sc, LID, N]);
await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
await p.waitForTimeout(1500);
const bos = async () => { const t = p.locator('.q-blok-q.joriy .q-btn').last(); await t.click(); await p.waitForTimeout(500); };
let qadam = await p.locator('.q-blok-q.bajarildi').count();
for (let k = 0; k < 6; k++) {
  const inp = await p.locator('.q-blok-q.joriy input, .q-blok-q.joriy textarea').count();
  await bos();
  const xato = await p.locator('.q-blok-q.joriy .q-blok-xato').count();
  const keyin = await p.locator('.q-blok-q.bajarildi').count();
  console.log(`qadam ${qadam + 1}: maydon ${inp} · bosildi → ${keyin > qadam ? "o'tdi" : "to'xtadi"} · xato ${xato}`);
  if (keyin === qadam && inp) { await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-354-keyin.jpg', type: 'jpeg', quality: 70 });
    for (const el of await p.locator('.q-blok-q.joriy input, .q-blok-q.joriy textarea').all()) await el.fill('test qator');
    await bos(); const k2 = await p.locator('.q-blok-q.bajarildi').count(); console.log(`  to'ldirilgach → ${k2 > qadam ? "o'tdi" : "to'xtadi"}`); qadam = k2; continue; }
  qadam = keyin; if (!(await p.locator('.q-blok-q.joriy').count())) break;
}
await b.close();
