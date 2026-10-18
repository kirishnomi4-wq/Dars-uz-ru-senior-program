import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
await p.addInitScript(() => { localStorage.setItem('ccProgress:pm-m9d16-v1', JSON.stringify({ screen: 10, answers: {}, earned: [], total: 16, savedAt: Date.now() })); });
await p.goto('http://localhost:5300/#/lesson/m9-16', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
await p.waitForTimeout(1500);
const ta = p.locator('.lesson-root textarea');
console.log('maydon', await ta.count());
await ta.nth(0).fill("O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda qiynaladi");
await ta.nth(1).fill("5 kishidan 4 tasida oxirgi o'yinda shunday bo'lgan, 3 tasi sinovga kun belgiladi");
await p.getByRole('button', { name: /^Saqlash$/ }).first().click(); await p.waitForTimeout(800);
const again = p.getByRole('button', { name: /^Saqlash$/ }); if (await again.count()) { /* ogohlantirishdan keyin ikkinchi bosish */ }
await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[2], type: 'jpeg', quality: 75 });
console.log('tugma:', await p.locator('.nav-next, button').filter({ hasText: /bo'lakni yozing/ }).first().innerText().catch(() => '?'));
console.log(errs.join(' | ') || 'JS xato 0'); await b.close();
