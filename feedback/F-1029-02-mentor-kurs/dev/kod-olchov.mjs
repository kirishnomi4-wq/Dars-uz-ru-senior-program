// Kod oynasi o'lchovi (F-1103-04, 03.11): har ekran, har bo'lak (ovozsiz) — 1) kod paneli eniga sig'maydimi (scrollWidth > clientWidth),
// 2) VS Code oynasi o'ng ustunning 70% dan tormi (yonida boshqa ustun bor). Eng yomon qiymat har ekran uchun.
// ISHLATISH (dev :5333 yoniq): DARS=tgpg-01 node dev/kod-olchov.mjs 1920x1080   → stdout TSV: dars · ekran · kesilgan(px) · qaysi fayl · ide-ulush(%) · ide-soni
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [size] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const DARS = process.env.DARS || 'tgpg-01';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const url = (i) => `http://localhost:5333/mentor-kurs.html?dars=${DARS}&s=${i}`;
await page.goto(url(0), { waitUntil: 'load' });
await page.waitForSelector('.mk-stage', { timeout: 30000 });
const total = await page.evaluate(() => { const m = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/); return m ? Number(m[2]) : 0; });
const probe = () => page.evaluate(() => {
  let cut = 0, file = '', share = 100, ides = 0;
  for (const p of document.querySelectorAll('.mk-panel')) {
    const d = p.scrollWidth - p.clientWidth;
    if (d > cut) { cut = d; const fn = p.querySelector('.fn'); file = fn ? fn.textContent : (p.closest('.mk-ide') ? 'ide' : 'panel'); }
  }
  const body = document.querySelector('.mk-body');
  const col = body && body.children[1];
  if (col) {
    const cw = col.getBoundingClientRect().width;
    for (const ide of col.querySelectorAll('.mk-ide')) {
      ides++;
      const w = ide.getBoundingClientRect().width;
      if (w > 0) share = Math.min(share, Math.round((w / cw) * 100));
    }
  }
  return { cut, file, share, ides };
});
for (let i = 0; i < total; i++) {
  await page.goto(url(i), { waitUntil: 'load' });
  await page.waitForSelector('.mk-stage');
  await page.waitForTimeout(250);
  const mute = await page.$('.mk-audio button'); if (mute) await mute.click();
  let worst = { cut: 0, file: '', share: 100, ides: 0 };
  for (let t = 0; t < 45; t++) {
    await page.waitForTimeout(300);
    const r = await probe();
    if (r.cut > worst.cut) { worst.cut = r.cut; worst.file = r.file; }
    if (r.ides) { worst.ides = Math.max(worst.ides, r.ides); worst.share = Math.min(worst.share, r.share); }
    const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click(); continue; }
    const man = await page.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) { await man.click(); continue; }
    const st = await page.evaluate(() => { const b = [...document.querySelectorAll('.mk-nav button')].pop(); const dd = [...document.querySelectorAll('.mk-dots i')]; return { ready: b && !b.disabled, on: dd.findIndex((x) => x.classList.contains('on')), n: dd.length }; });
    if (st.ready || (st.n > 0 && st.on === st.n - 1 && t > 3)) break;
  }
  // tekshiruv: to'g'ri javobgacha bosish (isbot paneli ham o'lchanadi)
  const o = await page.$$('.mk-opt');
  for (const b of o) { try { if (await b.isDisabled()) continue; await b.click({ timeout: 1500 }); await page.waitForTimeout(400); if (await page.$('.mk-opt.ok')) break; } catch (e) {} }
  const r = await probe();
  if (r.cut > worst.cut) { worst.cut = r.cut; worst.file = r.file; }
  if (r.ides) { worst.ides = Math.max(worst.ides, r.ides); worst.share = Math.min(worst.share, r.share); }
  console.log([DARS, i + 1, worst.cut, worst.file, worst.ides ? worst.share : '', worst.ides].join('\t'));
}
await browser.close();
