// Sahna toshib ketishini o'lchash (F-1103-04, 03.11): har ekranning OXIRGI holatida (segmentlar ovozsiz o'tkaziladi)
// 26.11 (F-1125-01): hamma .click() — timeout + .catch (qayta chizilgan element yiqitmasin; ekran-sweep va ovoz-matnlar tungi QA da yiqilgan)
// aylanuvchi konteynerlar (overflow auto/scroll) ichida scrollHeight > clientHeight bo'lsa — toshgan; .mk-stage ham tekshiriladi.
// ISHLATISH (dev :5333 yoniq): DARS=pg-02 node dev/sahna-olchov.mjs 1920x1080 [0,1,2,…]   → stdout TSV: dars · ekran · toshgan(px) · qayer · segment-soni
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [size, list] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const DARS = process.env.DARS || 'pg-02';
const CLICK = { 'nest-02': { 13: 12 }, 'pg-01': { 16: 2 }, 'pg-02': { 21: 3 }, 'jest-01': { 10: 4, 19: 11 }, /* 26.11 F-1125-01: 20-ekran LineCheck (45-satr) */ 'jest-02': { 13: 7, 21: 9 }, /* 26.11 F-1125-01: 22-ekran Tekshiruv 5 (13-satr) */ 'cicd-01': { 15: 7, 19: 7 }, /* 26.11 F-1125-01: 20-ekran LineCheck (17-satr) */ 'cicd-02': { 14: 10 }, 'tgpg-01': { 21: 1, 24: 3 }, /* 26.11 F-1125-01: 25-ekran Tekshiruv 5 (28-satr) */ 'ws1-01': { 10: 8 }, 'ws2-01': { 10: 8 }, 'wh-01': { 13: 1 }, 'nest-01': { 18: 10, 26: 7 } }[DARS] || {};
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(`${process.env.BASE || "http://localhost:5333"}/mentor-kurs.html?dars=${DARS}&s=0${process.env.TIL === "ru" ? "&lang=ru" : ""}`, { waitUntil: 'load' });
await page.waitForSelector('.mk-stage', { timeout: 20000 });
const total = await page.evaluate(() => { const m = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/); return m ? Number(m[2]) : 0; });
const idxs = list ? list.split(',').map(Number) : Array.from({ length: total }, (_, i) => i);
for (const i of idxs) {
  await page.goto(`${process.env.BASE || "http://localhost:5333"}/mentor-kurs.html?dars=${DARS}&s=${i}${process.env.TIL === "ru" ? "&lang=ru" : ""}`, { waitUntil: 'load' });
  await page.waitForSelector('.mk-stage');
  await page.waitForTimeout(250);
  const mute = await page.$('.mk-audio button'); if (mute) await mute.click({ timeout: 3000 }).catch(() => {});
  let segs = 0;
  for (let t = 0; t < 40; t++) {
    await page.waitForTimeout(300);
    const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click({ timeout: 3000 }).catch(() => {}); continue; }
    const man = await page.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) { await man.click({ timeout: 3000 }).catch(() => {}); continue; }
    const st = await page.evaluate(() => { const b = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); const d = [...document.querySelectorAll('.mk-dots i')]; return { ready: b && !b.disabled, on: d.findIndex((x) => x.classList.contains('on')), n: d.length }; });
    segs = st.n;
    if (st.ready || (st.n > 0 && st.on === st.n - 1 && t > 3)) break;
  }
  if (CLICK[i] != null) { const ln = await page.$$('.mk-ln.clk'); if (ln[CLICK[i]]) { await ln[CLICK[i]].click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(700); } }
  else { const o = await page.$$('.mk-opt'); for (const b of o) { if (await b.isDisabled()) continue; await b.click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500); if (await page.$('.mk-opt.ok')) break; } }
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const out = [];
    const stage = document.querySelector('.mk-stage');
    if (stage && stage.scrollHeight > stage.clientHeight + 2) out.push(['mk-stage', stage.scrollHeight - stage.clientHeight]);
    for (const el of document.querySelectorAll('.mk-body, .mk-body *')) {
      const cs = getComputedStyle(el); if (!/auto|scroll/.test(cs.overflowY)) continue;
      const d = el.scrollHeight - el.clientHeight; if (d > 2) out.push([(el.className && String(el.className).split(' ').slice(0, 2).join('.')) || el.tagName, d]);
    }
    out.sort((a, b) => b[1] - a[1]);
    return out.slice(0, 3);
  });
  const worst = r[0] ? r[0][1] : 0;
  console.log([DARS, i + 1, worst, r.map((x) => `${x[0]}:${x[1]}`).join(' '), segs].join('\t'));
}
await browser.close();
