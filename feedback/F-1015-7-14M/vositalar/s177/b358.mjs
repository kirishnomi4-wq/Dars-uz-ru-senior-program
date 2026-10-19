import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
await p.addInitScript(() => { localStorage.setItem('cc_lang', 'uz');
  localStorage.setItem('pm-m10d1-lending', JSON.stringify({ nom: 'Maydon Jamoa', sarlavha: 'Mahalla futboliga jamoani bir joyda yigʻing', osti: "Oʻyinni e'lon qiling — kim qoʻshilgani koʻrinadi", tugma: 'Qoʻshilmoqchiman', foydalar: ['Bir bosishda jamoadasiz'], savedAt: Date.now() }));
  localStorage.setItem('ccProgress:pm-m10d1-v1', JSON.stringify({ screen: 10, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: 16, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m10-01', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
await p.locator('[data-live=self]').first().click({ timeout: 6000 }).catch(() => {});
await p.waitForTimeout(1500);
await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-358-boshi.jpg', type: 'jpeg', quality: 70 }); await p.getByText('5 soniyani boshlash').click({ timeout: 5000 }); await p.waitForTimeout(6000);
const inp = p.locator('.ld-inp'); await inp.fill('sdfkjkadfsfjds'); await p.getByText('Saqlash').click(); await p.waitForTimeout(400);
console.log('xato chiqdi:', await p.locator('.ld-s10-xato').count());
await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-358-xato.jpg', type: 'jpeg', quality: 70 });
for (const t of ['Futbol jamoasi', 'mahalla bolalari uchun', 'roʻyxatdan oʻtish']) { await inp.fill(t); await p.getByText('Saqlash').click(); await p.waitForTimeout(400); }
await p.getByText('Ochish').click(); await p.waitForTimeout(1200);
console.log('takliflar:', await p.locator('.ld-taklif').allInnerTexts());
await p.screenshot({ path: '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-358-taklif.jpg', type: 'jpeg', quality: 70 });
await b.close();
