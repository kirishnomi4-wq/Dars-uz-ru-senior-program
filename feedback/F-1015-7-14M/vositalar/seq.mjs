import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, KEY, LID, TOT, S, SEQ, KUT = '5200'] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
await p.addInitScript(([l, s, t]) => localStorage.setItem('ccProgress:' + l, JSON.stringify({ screen: +s, answers: {}, earned: [], total: +t, savedAt: Date.now() })), [LID, S, TOT]);
await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
await p.waitForTimeout(1500);
for (const r of SEQ.split('|')) { try { await p.getByRole('button', { name: new RegExp(r) }).first().click({ timeout: 8000 }); } catch { errs.push('BOSILMADI ' + r); } await p.waitForTimeout(+KUT); }
await p.waitForTimeout(2500);
await p.screenshot({ path: OUT, type: 'jpeg', quality: 75, fullPage: true });
console.log(errs.join(' | ') || 'JS xato 0'); await b.close();
