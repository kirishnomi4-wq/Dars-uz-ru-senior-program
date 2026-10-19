import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-371-keyin/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:m11-05-v1', JSON.stringify({ screen: 2, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 12, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m11-05', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
await p.waitForTimeout(1200);
await p.locator('.q-bashorat .q-chip').nth(1).click(); await p.waitForTimeout(800);
await p.screenshot({ path: D + 's2-1-qaror.jpg', type: 'jpeg', quality: 72 });
const nomlar = ['Ikki marta yuborish', 'Kechiktirib yuborish', 'Rad etish (mashq)', "Noto'g'ri imzo"]; const javob = ['Buzadi', 'Buzmaydi', 'Buzmaydi', 'Buzadi'];
for (let i = 0; i < 4; i++) {
  await p.getByRole('button', { name: javob[i], exact: true }).click(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: nomlar[i] }).first().click(); await p.waitForTimeout(i === 1 ? 7500 : 5500);
  console.log(i + 1, (await p.locator('.pd-chip-n').innerText().catch(() => '-')).replace(/\s+/g, ' '));
  if (i === 1) await p.screenshot({ path: D + 's2-2-chip.jpg', type: 'jpeg', quality: 72 });
}
await p.waitForTimeout(1500);
console.log('yakun:', await p.locator('.pd-qar-j').innerText().catch(() => '-'), '| nav:', (await p.locator('.stage-nav').innerText()).replace(/\s+/g, ' '));
await p.screenshot({ path: D + 's2-3-yakun.jpg', type: 'jpeg', quality: 72 });
console.log('xatolar', err); await b.close();
