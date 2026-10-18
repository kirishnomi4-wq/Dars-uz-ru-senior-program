import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
await p.addInitScript(() => localStorage.setItem('ccProgress:pm-m10d10-v1', JSON.stringify({ screen: 10, answers: {}, earned: [], total: 16, savedAt: Date.now() })));
await p.goto('http://localhost:5300/#/lesson/m10-10', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
await p.waitForTimeout(1500);
const inps = p.locator('.uc-karta input:not([type=date])');
await inps.nth(0).fill('20'); await inps.nth(1).fill('6');
await p.getByRole('button', { name: /^Database$/ }).first().click();
await p.getByRole('button', { name: /^Saqlash$/ }).first().click(); await p.waitForTimeout(800);
const s2 = p.getByRole('button', { name: /^Saqlash$/ }); if (await s2.count()) { await s2.first().click().catch(() => {}); }
await p.waitForTimeout(1500);
await p.screenshot({ path: process.argv[2], type: 'jpeg', quality: 75 });
console.log(errs.join(' | ') || 'JS xato 0'); await b.close();
