// ISHLATISH (serverlar: tts :5332, vite :5333): node e2e-ovozli-otish.mjs 1920 1080 [uz|ru]  — muqovadan oxirigacha, ovoz 16×; PROOF/FINAL_C darsga moslanadi
// Mentor Nest-1: ovoz bilan (16×) muqovadan oxirigacha to'liq o'tish — amaliyot, tekshiruv, sinov, onFinished.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const W = +(process.argv[2] || 1920), H = +(process.argv[3] || 1080);
const LANG = process.argv[4] === 'ru' ? 'ru' : 'uz'; // F-1030-38
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await b.newPage({ viewport: { width: W, height: H } });
const errs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
// Ovoz 16× tezlikda (playbackRate har play'da)
await page.addInitScript(() => { const p = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { this.playbackRate = 16; return p.call(this); }; });
const DARS = process.env.DARS || 'nest-01'; // DARS=nest-02 node e2e-ovozli-otish.mjs …
await page.goto(`http://localhost:5333/mentor-kurs.html?dars=${DARS}&lang=${LANG}`, { waitUntil: 'load' });
await page.click(LANG === 'ru' ? 'text=Начать' : 'text=Boshlash');
const CFG = {
  'nest-01': { PROOF: { 6: '11.0.10', 12: 'Mapped {/, GET} route', 22: 'Car with id 99 not found', 30: 'CarsController, CarsService, cars.module.ts' }, FINAL_C: [1, 2, 1, 1, 0, 1, 0, 1], REQ: 20, TEST: 38, LAST: 39 },
  'nest-02': { PROOF: { 4: '[Nest] 4120  - 10/31/2026, 2:12:07 PM     LOG [NestApplication] Nest application successfully started', 15: '3b9f1c2a', 19: '7e5d0a91', 23: 'CarService, CarEntityRepository, car.module.ts' }, FINAL_C: [1, 3, 0, 2, 1, 0, 3, 2], REQ: 13, TEST: 28, LAST: 29 } // F-1031-09: 29 ekran,
}[DARS];
const { PROOF, FINAL_C } = CFG;
const screenNo = () => page.evaluate(() => parseInt((document.querySelector('.mk-count') || {}).textContent || '0', 10));
const nextBtn = () => page.$('.mk-nav .mk-btn:last-child');
const log = [];
let last = 0, t0 = Date.now(), lockedAtEntry = null;
for (let iter = 0; iter < 4000; iter++) {
  const n = await screenNo();
  if (n !== last) {
    if (last) log.push({ ekran: last, soniya: Math.round((Date.now() - t0) / 1000), kirishdaQulf: lockedAtEntry });
    last = n; t0 = Date.now();
    await page.waitForTimeout(150);
    const nb = await nextBtn(); lockedAtEntry = nb ? await nb.isDisabled() : null;
  }
  if (Date.now() - t0 > 240000) { log.push({ ekran: n, QOTDI: true }); break; }
  // o'ylab ko'ring savoli
  const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click(); await page.waitForTimeout(200); continue; }
  // amaliyot: katakchalar + isbot
  if (PROOF[n]) {
    for (const c of await page.$$('.mk-step input[type=checkbox]')) if (!(await c.isChecked())) await c.click();
    const inp = await page.$('.mk-input'); if (inp && (await inp.inputValue()) !== PROOF[n]) await inp.fill(PROOF[n]);
  }
  // so'rov tugmalari ekrani (Nest-1: 20, Nest-2: 13)
  if (n === CFG.REQ) for (const r of await page.$$('.mk-req button')) await r.click();
  // variantli tekshiruv: to'g'risini topguncha
  const opts = await page.$$('.mk-opt:not([disabled])');
  if (opts.length && n !== CFG.TEST) { await opts[0].click(); await page.waitForTimeout(400); continue; }
  // qaysi satr xato: topguncha
  const ln = await page.$$('.mk-ln.clk:not(.bad)');
  if (ln.length) { for (const l of ln) { const t = (await l.textContent()).trim(); if (t.replace(/^\d+/, '').trim()) { await l.click(); break; } } await page.waitForTimeout(400); continue; }
  // yakuniy sinov
  if (n === CFG.TEST) {
    const q = await page.$$('.mk-opt'); const eyebrow = await page.$eval('.mk-eyebrow', (e) => e.textContent).catch(() => '');
    const m = /(\d+) \/ 8/.exec(eyebrow);
    if (q.length && m && !(await q[0].isDisabled())) { await q[FINAL_C[+m[1] - 1]].click(); await page.waitForTimeout(300); continue; }
    const nx = await page.$('button:has-text("Keyingi savol"), button:has-text("Natijani ko\'rish"), button:has-text("Следующий вопрос"), button:has-text("Посмотреть результат")'); if (nx) { await nx.click(); await page.waitForTimeout(300); continue; }
  }
  const nb = await nextBtn();
  if (nb && !(await nb.isDisabled())) {
    if (n === CFG.LAST) { await nb.click(); await page.waitForTimeout(500); log.push({ ekran: CFG.LAST, soniya: Math.round((Date.now() - t0) / 1000), kirishdaQulf: lockedAtEntry }); break; }
    await nb.click(); await page.waitForTimeout(300); continue;
  }
  await page.waitForTimeout(300);
}
const fin = await page.evaluate(() => window.__onFinished || null);
console.log(JSON.stringify(log));
console.log('onFinished:', fin ? JSON.stringify({ passed: fin.passed, testPassed: fin.testPassed, practiceDone: fin.practiceDone, correctAnswers: fin.correctAnswers, totalQuestions: fin.totalQuestions, finalAttempts: fin.finalAttempts, checks: fin.checks.length, answers: fin.answers.length, durationSec: fin.durationSec }) : 'YO\'Q');
console.log('xatolar:', JSON.stringify(errs.slice(0, 15)));
await b.close();
