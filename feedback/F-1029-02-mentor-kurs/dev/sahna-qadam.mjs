// Har qadamda toshishni o'lchaydi (F-1125-01, 26.11, M61): sahna-olchov.mjs faqat oxirgi holatni ko'radi, bu esa ovoz bilan qadamma-qadam
// («Keyingi qadam» har 1,3 s; «Buzamiz» .n1-act birinchi qadamda bosiladi). Ishlatish (tts :5332, vite :5333 yoki BASE=<sayt>):
//   DARS=nest-02 [TIL=ru] [OUT=<papka> — har qadam surati] node dev/sahna-qadam.mjs 1280x720 19   (oxirgi raqam — s, noldan)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [size, idx] = process.argv.slice(2); const [W, H] = size.split('x').map(Number); const i = Number(idx);
const D = process.env.DARS, ru = process.env.TIL === 'ru';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: W, height: H } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 100)));
await p.goto(`${process.env.BASE || 'http://localhost:5333'}/mentor-kurs.html?dars=${D}&s=${i}${ru ? '&lang=ru' : ''}`, { waitUntil: 'load' });
await p.waitForSelector('.mk-stage', { timeout: 30000 }); await p.waitForTimeout(300);

const meas = () => p.evaluate(() => { const out = []; const st = document.querySelector('.mk-stage'); if (st && st.scrollHeight > st.clientHeight + 2) out.push(['stage', st.scrollHeight - st.clientHeight]);
  for (const el of document.querySelectorAll('.mk-body, .mk-body *')) { const cs = getComputedStyle(el); if (!/auto|scroll/.test(cs.overflowY)) continue; const d = el.scrollHeight - el.clientHeight; if (d > 2) out.push([String(el.className).split(' ')[0] || el.tagName, d]); }
  const d = [...document.querySelectorAll('.mk-dots i')]; return { on: d.findIndex((x) => x.classList.contains('on')), n: d.length, o: out.sort((a, b) => b[1] - a[1]).slice(0, 3) }; });
const tag = (k, m) => console.log([D + (ru ? '-ru' : ''), i + 1, k, m.o.length ? m.o.map((x) => x.join(':')).join(' ') : '0'].join('\t'));
tag('qadam 1 (bosishdan oldin)', await meas());
{ const act = await p.$('.n1-act'); if (act) { await act.click({ timeout: 1500 }).catch(() => {}); } }
let prev = -1;
for (let t = 0; t < 120; t++) {
  await p.waitForTimeout(1300);
  const m = await meas();
  tag('qadam ' + (m.on + 1) + '/' + m.n + (m.on === prev ? ' (yana)' : ''), m);
  if (process.env.OUT) await p.screenshot({ path: `${process.env.OUT}/${D}-${i + 1}-${W}${ru ? '-ru' : ''}-q${m.on + 1}.png` });
  if (m.n > 0 && m.on === m.n - 1) break;
  prev = m.on;
  const ask = await p.$('.mk-ask .row button'); if (ask) { await ask.click({ timeout: 1500 }).catch(() => {}); continue; }
  const man = await p.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) await man.click({ timeout: 1500 }).catch(() => {});
}
if (errs.length) console.log('XATO', errs.join(' | '));
await b.close();
