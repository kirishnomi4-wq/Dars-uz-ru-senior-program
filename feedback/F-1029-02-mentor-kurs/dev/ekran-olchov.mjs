// ISHLATISH: node ekran-olchov.mjs <chiqish-papka> 1280x720 0,1,2,… [uz|ru]  — ?s=N, ovozsiz; sahifa-siljigan · yashirin-yoritilgan · nav
// Mentor darsi: ?s=N bilan har ekranni ochib, oxirgi holatini suratga oladi (autoplay rad → segmentlar ovozsiz o'tadi)
// node shots.mjs <outdir> <W>x<H> <idx,idx,...>   (idx 0-based)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [out, size, list] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const idxs = list.split(',').map(Number);
const LANG = process.argv[5] === 'ru' ? 'ru' : 'uz'; // F-1030-38
const DARS = process.env.DARS || 'nest-01'; // DARS=nest-02 node ekran-olchov.mjs …
const CLICK = DARS === 'nest-02' ? { 13: 12 } : DARS === 'pg-01' ? { 16: 2 } : DARS === 'pg-02' ? { 21: 3 } : DARS === 'jest-01' ? { 10: 5 } : DARS === 'jest-02' ? { 10: 1 } : DARS === 'cicd-01' ? { 12: 10 } : DARS === 'cicd-02' ? { 10: 10 } : DARS === 'tgpg-01' ? { 15: 2 } : DARS === 'ws1-01' ? { 7: 4 } : DARS === 'ws2-01' ? { 7: 2 } : DARS === 'wh-01' ? { 7: 5 } : { 18: 10, 26: 7 }; // LineCheck: to'g'ri satr (0-based)
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
for (const i of idxs) {
  await page.goto(`http://localhost:5333/mentor-kurs.html?dars=${DARS}&s=${i}&lang=${LANG}`, { waitUntil: 'load' }); await page.waitForSelector('.mk-stage');
  await page.waitForTimeout(300);
  const mute = await page.$('.mk-audio button'); if (mute) await mute.click(); // ovoz o'chiq: segmentlar 0.4 s da o'tadi
  for (let t = 0; t < 26; t++) {
    await page.waitForTimeout(400);
    const ask = await page.$('.mk-ask .row button');
    if (ask) { await ask.click(); continue; }
    const man = await page.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")');
    if (man) { await man.click(); continue; }
  }
  if (CLICK[i] != null) { const ln = await page.$$('.mk-ln.clk'); if (ln[CLICK[i]]) { await ln[CLICK[i]].click(); await page.waitForTimeout(900); } }
  const st = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); const stage = document.querySelector('.mk-stage');
    // yoritilgan satr ko'rinadimi: har .mk-ln.hl uchun barcha aylanuvchi ota-konteynerlar ichida
    const hidden = [...document.querySelectorAll('.mk-ln.hl')].filter((l) => { const r = l.getBoundingClientRect(); for (let n = l.parentElement; n && n !== document.body; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if (o === 'auto' || o === 'hidden' || o === 'scroll') { const q = n.getBoundingClientRect(); if (r.bottom > q.bottom + 2 || r.top < q.top - 2) return true; } } return false; }).length;
    const nav = document.querySelector('.mk-nav').getBoundingClientRect();
    return { next: b && !b.disabled, stageScroll: stage ? stage.scrollTop : 0, hlHidden: hidden, navOk: nav.bottom <= innerHeight + 1 };
  });
  await page.screenshot({ path: `${out}/s${String(i + 1).padStart(2, '0')}.png` });
  console.log(`ekran ${i + 1}: davom=${st.next ? 'ochiq' : 'yopiq'} sahifa-siljigan=${st.stageScroll} yashirin-yoritilgan=${st.hlHidden} nav=${st.navOk ? 'ok' : 'KESILGAN'}`);
}
console.log('xatolar:', errs.filter((e) => !/autoplay|interrupted|play\(\)/.test(e)).slice(0, 10));
await browser.close();
