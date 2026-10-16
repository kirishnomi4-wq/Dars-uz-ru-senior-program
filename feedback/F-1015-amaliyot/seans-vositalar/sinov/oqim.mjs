import { chromium } from 'playwright-core';
const [page, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
async function ekr(w, h, scr, ish, nom) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript((s) => { localStorage.clear(); localStorage.setItem('liveSession:css-practice-portfolio-v3', '{"mode":"self"}'); localStorage.setItem('ccProgress:css-practice-portfolio-v3', JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, scr);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForSelector('.ds'); await p.waitForTimeout(1500);
  if (ish) await ish(p); await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/${nom}.png` }); console.log(nom, errs.length ? errs : 'ok'); await ctx.close();
}
const tol = async (p) => { const i = p.locator('.am-maydon input'); await i.nth(0).fill('Sport vaqti'); await i.nth(1).fill("Seksiya vaqtini telefon qilib so'rash kerak"); await i.nth(2).fill("mashg'ulot jadvali, narx, murabbiy"); };
await ekr(1280, 820, 2, tol, 'a1-toldi');
await ekr(1280, 820, 3, async (p) => { await p.click('.am-uslub-btn >> nth=2'); }, 'a2-qorongi');
await ekr(1280, 820, 4, async (p) => { await p.evaluate(() => localStorage.setItem('ccDemoDay', JSON.stringify({ uslub: 'gradient' }))); await p.reload(); await p.waitForSelector('.ds'); }, 'a3-gradient');
await ekr(390, 844, 1, null, 'm-s1');
await ekr(390, 844, 2, tol, 'm-a1');
await b.close();
