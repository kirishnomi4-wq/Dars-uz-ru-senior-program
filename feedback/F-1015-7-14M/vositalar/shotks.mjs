import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync } from 'node:fs';
const [,, OUT, LIST, CLICK = ''] = process.argv;
const items = JSON.parse(readFileSync(LIST, 'utf8'));
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const [key, s, total] of items) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, deviceScaleFactor: 0.75, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(500);
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400); }
  let lid = await p.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; });
  if (!lid) { await p.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash/ }).first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400);
    lid = await p.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; }); }
  await p.evaluate(([id, sc, tt]) => localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })), [lid, s, total]);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/${key}-s${s}.jpg`, type: 'jpeg', quality: 72 });
  if (CLICK) { for (let k = 0; k < 3; k++) { const bt = p.locator('.stage-content button:visible').filter({ hasNotText: /Orqaga|Davom|Keyingi|Yakunlash|Boshlaymiz|Qaytadan/ }).nth(k); if (!(await bt.count())) break; await bt.click({ timeout: 800 }).catch(() => {}); await p.waitForTimeout(500); }
    await p.screenshot({ path: `${OUT}/${key}-s${s}-keyin.jpg`, type: 'jpeg', quality: 72 }); }
  console.log(key, s, 'ok'); await ctx.close();
}
await b.close();
