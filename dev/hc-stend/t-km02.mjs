import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const [w, lang] of [[1400,'ru'],[1400,'uz'],[1100,'ru'],[768,'ru'],[480,'uz']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } }); const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4517/'); await p.evaluate((lang) => window.mountHC({ lang }), lang); await p.waitForSelector('.hc-code');
  await p.fill('.hc-code', '<h1>Salom</h2>\n<p>x</b>'); await p.waitForTimeout(1200);
  const r = await p.$eval('.hc-err', e => { const t = e.querySelector('.hc-err-text'), m = e.querySelector('.hc-err-more'); const inb = (x) => { const a = x.getBoundingClientRect(), pr = e.getBoundingClientRect(); return a.right <= pr.right + 1 && a.width > 0; }; return { text: t.textContent.slice(0, 50), cut: t.scrollWidth > t.clientWidth, more: m ? m.textContent : '(yo\'q)', moreVisible: m ? inb(m) : false, title: e.title.split('\n')[0].slice(0, 60) }; });
  console.log(`${w} ${lang}:`, r);
  await p.screenshot({ path: `km02-${w}-${lang}.png`, clip: { x: 0, y: 0, width: w, height: 260 } }); await ctx.close();
}
await b.close();
