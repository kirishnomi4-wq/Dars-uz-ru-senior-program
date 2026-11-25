// F-1125-01 · Nest-1 amaliyot ekranlarini tekshiradi: «Boshqacha chiqdimi?» oynasi (surat + sig'ishi) va isbot maydoni.
// node amaliyot-tekshir.mjs <out> [VW VH] [lang]      (dev :5333 yoniq bo'lsin)
// Ekranlar (0-based): 5 = 1-amaliyot, 11 = 2-amaliyot, 21 = 3-amaliyot. Isbot: 5-ekranda 12.0.15 ✓ · 11.0.10 ✗.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const [OUT, VW = '1600', VH = '900', LANG = 'uz'] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await b.newPage({ viewport: { width: +VW, height: +VH } });
await page.addInitScript(() => { const p = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { this.playbackRate = 16; return p.call(this); }; });
const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => { if (m.type() === 'error' && /\[ru\]/.test(m.text())) errs.push(m.text()); });
const res = {};
for (const s of [5, 11, 21]) {
  await page.goto(`http://localhost:5333/mentor-kurs.html?dars=nest-01&s=${s}&lang=${LANG}`, { waitUntil: 'load' });
  await page.waitForSelector('.mk-stage', { timeout: 15000 });
  // jadval tugmasi tableAt segmentida ochiladi — ovoz (16×) yetib borguncha kutamiz; ovoz bo'lmasa «Keyingi qadam» bosiladi
  const t0 = Date.now();
  while (Date.now() - t0 < 150000 && !(await page.$('.mk-trbtn'))) {
    const man = await page.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) await man.click();
    await page.waitForTimeout(300);
  }
  const btn = await page.$('.mk-trbtn');
  const r = { tugma: !!btn };
  if (btn) {
    r.tugmaMatni = (await btn.innerText()).replace(/\s+/g, ' ');
    await btn.click(); await page.waitForSelector('.mk-modal', { timeout: 5000 });
    await page.waitForTimeout(500);
    r.oyna = await page.evaluate(() => {
      const m = document.querySelector('.mk-modal'); const box = m.firstElementChild; const rc = box.getBoundingClientRect();
      const sc = [...box.querySelectorAll('*')].filter((e) => e.scrollHeight - e.clientHeight > 4 && /auto|scroll/.test(getComputedStyle(e).overflowY)).map((e) => e.className + ':' + (e.scrollHeight - e.clientHeight));
      const rows = [...box.querySelectorAll('tr, .row, li')].length;
      return { eni: Math.round(rc.width), boyi: Math.round(rc.height), ekrandan_chiqdi: rc.bottom > innerHeight || rc.top < 0 || rc.right > innerWidth, ichki_aylanish: sc, matn: box.innerText.replace(/\s+/g, ' ').slice(0, 1400) };
    });
    await page.screenshot({ path: `${OUT}/e${String(s + 1).padStart(2, '0')}-oyna-${VW}-${LANG}.jpg`, type: 'jpeg', quality: 78 });
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  }
  if (s === 5) {
    const inp = await page.$('.mk-input');
    const holat = async () => page.evaluate(() => ({ karta: document.querySelector('.mk-card') ? document.querySelector('.mk-card').innerText.replace(/\s+/g, ' ') : '', need: document.querySelector('.mk-input').classList.contains('need') }));
    await inp.fill('11.0.10'); await page.waitForTimeout(200); r.isbot_11 = await holat();
    await inp.fill('12.0.15'); await page.waitForTimeout(200); r.isbot_12 = await holat();
    await inp.fill('v12.1.0'); await page.waitForTimeout(200); r.isbot_v12 = await holat();
    await inp.fill('13.0.0'); await page.waitForTimeout(200); r.isbot_13 = await holat();
    await inp.fill('12.0.15'); await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/e06-isbot-${VW}-${LANG}.jpg`, type: 'jpeg', quality: 78 });
  }
  res['ekran' + (s + 1)] = r;
}
console.log(JSON.stringify({ lang: LANG, vw: VW, errs: errs.slice(0, 5), res }, null, 1));
await b.close();
