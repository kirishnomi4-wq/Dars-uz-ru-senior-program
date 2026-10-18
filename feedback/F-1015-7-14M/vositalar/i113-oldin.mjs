// F-1015-113: m7-01 bosilgandan keyingi holat suratlari (s2 · s3 · s5 · s6 bashorat · s9 saralash)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const OUT = process.argv[2];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const och = async (s) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await p.addInitScript((sc) => { try { localStorage.setItem('ccProgress:pm-m7d1-v1', JSON.stringify({ screen: sc, answers: {}, earned: [], total: 17, savedAt: Date.now() })); } catch {} }, s);
  await p.goto('http://localhost:5300/#/lesson/m7-01', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(1500); return { ctx, p, errs };
};
const bos = async (p, re) => { const el = p.locator('.stage-content').getByRole('button', { name: re }).first(); await el.click({ timeout: 3000 }); await p.waitForTimeout(500); };
const shot = async (p, n, errs) => { await p.screenshot({ path: `${OUT}/m7-01-${n}.jpg`, type: 'jpeg', quality: 75 }); console.log(n, errs.join(' | ') || 'ok'); };
{ const { ctx, p, errs } = await och(2); await bos(p, /^2$/); await bos(p, /Sizsiz bir kun/); await p.waitForTimeout(3000); await shot(p, 's2-keyin', errs); await ctx.close(); }
{ const { ctx, p, errs } = await och(3); await bos(p, /uy vazifasini/); await p.waitForTimeout(1500); await shot(p, 's3-keyin', errs); await ctx.close(); }
{ const { ctx, p, errs } = await och(5); await bos(p, /do'konma-do'kon/); await p.waitForTimeout(1500); await shot(p, 's5-keyin', errs); await ctx.close(); }
{ const { ctx, p, errs } = await och(6); for (let i = 0; i < 2; i++) await p.getByRole('button', { name: /Keyingi bosqich/ }).click(); await p.waitForTimeout(500); await bos(p, /Minglab/); await p.waitForTimeout(800); await shot(p, 's6-bashorat', errs); await ctx.close(); }
{ const { ctx, p, errs } = await och(9); await bos(p, /^4$/); for (const r of [/Ro.yxatga/, /Chiqarib/]) { await bos(p, r); await p.waitForTimeout(600); } await shot(p, 's9-saralash', errs); await ctx.close(); }
await b.close();
