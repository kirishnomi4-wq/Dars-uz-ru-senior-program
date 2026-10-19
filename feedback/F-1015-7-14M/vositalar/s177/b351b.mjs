// F-1015-351 keyin: taxmindan oldin (sahna yo'q) → birinchi chip bosiladi → sahna kirib keladimi? Surat + o'lchov
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';
const S = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/748450ec-6330-484f-82b4-09062baf27c7/scratchpad/';
const roy = Object.fromEntries(JSON.parse(readFileSync(S + 'b351-royxat.json', 'utf8')).map(r => [r.key, r]));
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-351-keyin/'; mkdirSync(D, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const spec of process.env.EK.split(' ')) {
  const [key, s] = spec.split(':'); const sc = +s; const r = roy[key];
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const err = []; p.on('pageerror', e => err.push(e.message));
  await p.addInitScript(([sc, lid, n]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', screenIdx: 0, picked: 'a', correct: false } }, earned: [], total: n, savedAt: Date.now() })); }, [sc, r.lid, r.n]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1500);
  const chip = p.locator('.q-bashorat .q-chip:not([disabled])').first();
  let bosildi = false; if (await chip.count()) { await chip.click().catch(() => {}); bosildi = true; }
  await p.waitForTimeout(1500);
  const kirdi = await p.evaluate(() => !!document.querySelector('.q-kir') || !!document.querySelector('.q-split .q-col *, .q-col .zoomable'));
  await p.screenshot({ path: `${D}d-uz-s${sc}-${key}.jpg`, type: 'jpeg', quality: 70 });
  console.log(key, sc, 'bosildi', bosildi, 'sahna', kirdi, err.slice(0, 1).join(''));
  await ctx.close();
}
await b.close();
