// parseCss — tarmoq so'rovi ketadimi (@import/url), sahifaga ta'sir qiladimi, tozalanadimi
import { open, mount, setCode } from './tc-lib.mjs';
const { b, p, log } = await open();
const reqs = [];
p.on('request', r => { if (!/bundle\.js|127\.0\.0\.1:4517\/$/.test(r.url())) reqs.push(r.url()); });

// 1) to'g'ridan-to'g'ri parseCss (top-level document)
const CSS_CASES = [
  ['@import url', '@import url("http://127.0.0.1:4517/tc-import-1.css"); h1{color:red}'],
  ['@import string', '@import "http://127.0.0.1:4517/tc-import-2.css"; h1{color:red}'],
  ['body background url', 'body{background:url(http://127.0.0.1:4517/tc-bg-body.png)}'],
  ['* background url', '*{background-image:url(http://127.0.0.1:4517/tc-bg-star.png)}'],
  ['.hc-root cursor url', '.hc-root{cursor:url(http://127.0.0.1:4517/tc-cursor.png),auto}'],
  ['@font-face', '@font-face{font-family:TcX;src:url(http://127.0.0.1:4517/tc-font.woff2)} body{font-family:TcX}'],
  ['content url', 'body::before{content:url(http://127.0.0.1:4517/tc-content.png)}'],
  ['list-style-image', 'li{list-style-image:url(http://127.0.0.1:4517/tc-li.png)}'],
  ['@import external host', '@import url("https://example.invalid/tc-ext.css");'],
];
for (const [name, css] of CSS_CASES) {
  const before = reqs.length;
  const r = await p.evaluate((css) => { const t0 = performance.now(); const r = window.__X.parseCss(css); return { n: r.length, ms: +(performance.now() - t0).toFixed(1), styles: document.querySelectorAll('style').length }; }, css);
  await p.waitForTimeout(700);
  console.log(`[css-net] ${name}: rules=${r.n} ms=${r.ms} styleTags=${r.styles} newRequests=${JSON.stringify(reqs.slice(before))}`);
}
// 2) UI orqali (haqiqiy component) — CSS faylli task
const task = {
  title: 'tc-css', requirements: [{ id: 'c1', label: 'css', check: { __fake: 1 } }],
  files: [
    { name: 'index.html', lang: 'html', starter: '<h1>Salom</h1>' },
    { name: 'style.css', lang: 'css', starter: '' },
  ],
};
// check funksiyasi kerak — window.HC.checks orqali
await p.evaluate(() => {
  window.__tcTask = {
    title: 'tc-css',
    requirements: [{ id: 'c1', label: 'h1 rang', check: window.HC.checks.cssProp('h1', 'color') }],
    files: [
      { name: 'index.html', lang: 'html', starter: '<h1>Salom</h1>' },
      { name: 'style.css', lang: 'css', starter: '' },
    ],
  };
});
await p.evaluate(() => window.mountHC({ task: window.__tcTask, lang: 'uz' }));
await p.waitForSelector('.hc-root textarea.hc-code');
// style.css tabiga o'tish
const tabs = await p.$$eval('.hc-root button, .hc-root [role=tab]', els => els.map(e => e.textContent.trim()));
console.log('tabs:', tabs.filter(t => /css|html|js/i.test(t)));
await p.click('text=style.css');
await p.waitForTimeout(200);
const before = reqs.length;
const bodyBgBefore = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
await setCode(p, '@import url("http://127.0.0.1:4517/tc-ui-import.css");\nbody{background:red url(http://127.0.0.1:4517/tc-ui-body.png)}\n.hc-root{display:none}\nh1{color:red}');
await p.waitForTimeout(1500);
const after = await p.evaluate(() => ({ bodyBg: getComputedStyle(document.body).backgroundColor, rootDisplay: getComputedStyle(document.querySelector('.hc-root')).display, styleTags: document.querySelectorAll('head > style').length, chips: [...document.querySelectorAll('.hc-chip')].map(e => e.className) }));
console.log('[css-ui] bodyBgBefore', bodyBgBefore, 'after', after, 'newRequests', JSON.stringify(reqs.slice(before)));
await p.screenshot({ path: 'tc-3-css-ui.png' });
// 3) tez-tez chaqirilganda style teg qolib ketmaydimi (100 marta)
const leak = await p.evaluate(() => { const n0 = document.querySelectorAll('style').length; for (let i = 0; i < 100; i++) window.__X.parseCss('h1{color:red}'); return { n0, n1: document.querySelectorAll('style').length }; });
console.log('[css-leak]', leak);
// 4) parseCss ichida exception — el.remove() chaqiriladimi? (sheet null bo'lsa) — cssRules ga kirish xatosi
const exc = await p.evaluate(() => { const n0 = document.querySelectorAll('style').length; let r; try { r = window.__X.parseCss('@import url("https://example.invalid/x.css"); h1{color:red}'); } catch (e) { r = 'THROW ' + e.message; } return { r, n1: document.querySelectorAll('style').length, n0 }; });
console.log('[css-exc]', JSON.stringify(exc));
console.log('log:', log.filter(l => !/DevTools/.test(l)));
await b.close();
