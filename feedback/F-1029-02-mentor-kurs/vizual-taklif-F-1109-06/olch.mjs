// Vizual audit (F-1109-06): har ekran oxirgi holatida — sahna to'lganligi, vizual turlari, surat. Faqat o'qiydi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [DARS, OUT] = process.argv.slice(2);
const BASE = 'https://coddycamp-mentor-kurs.vercel.app/mentor-kurs.html';
const W = 1280, H = 720;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await b.newPage({ viewport: { width: W, height: H } });
await page.goto(`${BASE}?dars=${DARS}&s=0`, { waitUntil: 'load' }); await page.waitForSelector('.mk-stage', { timeout: 30000 });
const total = await page.evaluate(() => { const m = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/); return m ? Number(m[2]) : 0; });
for (let i = 0; i < total; i++) {
  await page.goto(`${BASE}?dars=${DARS}&s=${i}`, { waitUntil: 'load' }); await page.waitForSelector('.mk-stage'); await page.waitForTimeout(250);
  const mute = await page.$('.mk-audio button'); if (mute) await mute.click();
  for (let t = 0; t < 40; t++) {
    await page.waitForTimeout(300);
    const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click(); continue; }
    const man = await page.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) { await man.click(); continue; }
    const st = await page.evaluate(() => { const bb = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); const d = [...document.querySelectorAll('.mk-dots i')]; return { ready: bb && !bb.disabled, on: d.findIndex((x) => x.classList.contains('on')), n: d.length }; });
    if (st.ready || (st.n > 0 && st.on === st.n - 1 && t > 3)) break;
  }
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const st = document.querySelector('.mk-stage'); if (!st) return null;
    const R = st.getBoundingClientRect();
    const vis = (e) => { const c = getComputedStyle(e); const q = e.getBoundingClientRect(); return c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0.05 && q.width > 4 && q.height > 4; };
    // sahnaning yuqori darajadagi bloklari (bitta o'ram bo'lsa ichiga tushamiz)
    let top = [...st.children].filter(vis);
    while (top.length === 1 && top[0].children.length) { const k = [...top[0].children].filter(vis); if (!k.length) break; const q = top[0].getBoundingClientRect(); if (q.height < R.height * 0.9 && q.width < R.width * 0.9) break; top = k; }
    let area = 0, maxB = R.top, maxR = R.left;
    for (const e of top) { const q = e.getBoundingClientRect(); const w = Math.min(q.right, R.right) - Math.max(q.left, R.left), h = Math.min(q.bottom, R.bottom) - Math.max(q.top, R.top); if (w > 0 && h > 0) area += w * h; maxB = Math.max(maxB, q.bottom); maxR = Math.max(maxR, q.right); }
    const all = [...st.querySelectorAll('*')].filter(vis);
    const has = (sel) => all.some((e) => e.matches(sel));
    const dark = all.filter((e) => { const c = getComputedStyle(e).backgroundColor.match(/\d+/g); return c && c.length >= 3 && (+c[0] + +c[1] + +c[2]) < 120 && (c[3] === undefined || +c[3] > 0.5) && e.getBoundingClientRect().height > 40; }).length;
    const kinds = [];
    if (has('svg:not(svg svg), canvas')) kinds.push('sxema');
    if (has('img')) kinds.push('rasm');
    if (has('table') || all.some((e) => /grid|tbl|table|row/.test(String(e.className)) && e.children.length >= 3 && getComputedStyle(e).display.includes('grid'))) kinds.push('jadval');
    if (dark) kinds.push('kod/terminal');
    if (has('.mk-opt')) kinds.push('test');
    if (has('input, textarea')) kinds.push('amaliyot');
    const txt = (st.innerText || '').replace(/\s+/g, ' ').trim().length;
    const say = document.querySelector('.mk-say, .mk-left, .mk-key');
    return { rect: [R.left, R.top, R.width, R.height].map(Math.round), fill: Math.round(100 * area / (R.width * R.height)), bottom: Math.round(100 * (maxB - R.top) / R.height), kinds: kinds.join('+') || 'faqat-matn', txt, title: (document.querySelector('h1,h2') || {}).innerText || '' };
  });
  await page.screenshot({ path: `${OUT}/${DARS}-${String(i + 1).padStart(2, '0')}.png`, type: 'png' });
  console.log([DARS, i + 1, r ? r.rect.join(',') : '-', r ? r.kinds : '-', r ? r.txt : 0, (r ? r.title : '').replace(/\s+/g, ' ').slice(0, 80)].join('\t'));
}
await b.close();
