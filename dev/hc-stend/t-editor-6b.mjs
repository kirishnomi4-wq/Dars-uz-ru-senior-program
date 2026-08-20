import { open, shot } from './t-lib.mjs';
const props = { lang: 'uz', task: { title: 'Uch fayl', requirements: [{ tag: 'h1' }], files: [
  { name: 'index.html', lang: 'html', starter: '<h1>Boshi</h1>\n' }, { name: 'style.css', lang: 'css', starter: 'h1{}' }, { name: 'script.js', lang: 'js', starter: '' } ] } };
for (const w of [390, 430, 600, 768]) {
  const { b, p } = await open({ url: 'http://127.0.0.1:4517/t-mobile.html', props, context: { viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true } });
  const r = await p.evaluate(() => { const t = document.querySelector('.hc-tabs').getBoundingClientRect(); return { tabsW: Math.round(t.width), tabs: [...document.querySelectorAll('.hc-tab')].map(e => { const r = e.getBoundingClientRect(); return { n: e.textContent, l: Math.round(r.left), r: Math.round(r.right), vis: r.right <= t.right + 1 }; }) }; });
  console.log(w, JSON.stringify(r));
  if (w === 390) await shot(p, 'e6e-phone-3files.png');
  await b.close();
}
// desktop 1400 but with narrow split (30%) → tabs bar overflow?
const { b, p } = await open({ props });
await p.evaluate(() => { localStorage.setItem('hcSplit', '0.3'); });
await p.evaluate((props) => window.mountHC(props), props);
await p.waitForTimeout(200);
const r = await p.evaluate(() => { const t = document.querySelector('.hc-tabs').getBoundingClientRect(); return { tabsW: Math.round(t.width), tabs: [...document.querySelectorAll('.hc-tab')].map(e => { const r = e.getBoundingClientRect(); return { n: e.textContent, l: Math.round(r.left), r: Math.round(r.right), vis: r.right <= t.right + 1 }; }) }; });
console.log('desktop split 0.3:', JSON.stringify(r));
await shot(p, 'e6f-desktop-split30.png');
await b.close();
