import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 773 } });
for (const [u, n] of [['https://www.w3schools.com/js/js_if_else.asp', 'w3-js-if'], ['https://www.w3schools.com/html/html_paragraphs.asp', 'w3-html-p']]) {
  await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('err', e.message.slice(0, 60)));
  await p.waitForTimeout(2500);
  await p.evaluate(() => { for (const s of ['#snigel-cmp-framework', '.fc-consent-root', '#accept-choices']) document.querySelectorAll(s).forEach(e => e.remove()); });
  const box = await p.evaluate(() => { const m = document.querySelector('#main'); if (!m) return null; const r = m.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width }; });
  await p.screenshot({ path: process.argv[2] + '/' + n + '.jpg', type: 'jpeg', quality: 75, fullPage: false, clip: box ? { x: box.x, y: Math.max(0, box.y - 10), width: Math.min(box.w, 900), height: 760 } : undefined });
  console.log(n, 'ok', JSON.stringify(box));
}
await b.close();
