// F-1015 tungi avtopilot: qurilgan darslar haqiqiy Vite serverida (App orqali) ochiladimi — pageerror, .lesson-root, ekran raqami
import { chromium } from 'playwright-core';
const KEYS = ['m1-10', 'm2-11', 'm2-12', 'm3-07', 'm3-11', 'm3-12', 'm3-13', 'm4-08', 'm4-10', 'm4-13', 'm4-14', 'm4a-04', 'm4c-01', 'm4c-04', 'm4c-05', 'm4c-07'];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const k of KEYS) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.addInitScript(() => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
  await p.goto('http://localhost:5173/#/lesson/' + k, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /o.zim/i.test(x.innerText)); b && b.click(); });
  await p.waitForTimeout(1500);
  const root = await p.locator('.lesson-root').count();
  const txt = (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
  const m = txt.match(/\b(\d\d)\s*\/\s*(\d\d)\b/);
  console.log(`${k}: root ${root} · ${m ? m[0] : 'raqam yo\'q'} · err ${errs.length}${errs.length ? ' ' + errs.join(' | ') : ''} · ${txt.slice(0, 80)}`);
  await ctx.close();
}
await b.close();
