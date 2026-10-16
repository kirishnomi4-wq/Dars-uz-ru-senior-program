import { chromium } from 'playwright-core';
const [page, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
async function ekr(w, h, scr, ish, nom) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript((s) => { localStorage.clear(); localStorage.setItem('liveSession:css-practice-portfolio-v3', '{"mode":"self"}'); localStorage.setItem('ccProgress:css-practice-portfolio-v3', JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, scr);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForSelector('.stage'); await p.waitForTimeout(2000);
  if (ish) await ish(p); await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/${nom}.png` }); console.log(nom, errs.length ? errs : 'ok'); await ctx.close();
}
const tol = async (p) => { const i = p.locator('.am-maydon input'); await i.nth(0).fill('Sport vaqti'); await i.nth(1).fill("Seksiya vaqtini telefon qilib so'rash kerak"); await i.nth(2).fill("mashg'ulot jadvali, narx, murabbiy"); };
await ekr(1280, 820, 2, null, 'a1-bosh');
await ekr(1280, 820, 2, async (p) => { await tol(p); await p.click('.am-saqla'); }, 'a1-saqlandi');
await ekr(1280, 820, 6, null, 'a4-bosh');
await ekr(1280, 820, 6, async (p) => { const i = p.locator('.am-maydon input'); await i.nth(0).fill("telefonda kartalar sig'mayapti"); await i.nth(1).fill('kartalar ustma-ust tursin'); }, 'a4-toldi');
await ekr(390, 844, 2, async (p) => { await tol(p); await p.click('.am-saqla'); }, 'm-a1');
await b.close();
