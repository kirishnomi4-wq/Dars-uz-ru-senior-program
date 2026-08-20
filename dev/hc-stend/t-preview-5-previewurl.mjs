import { open, setCode, shot } from './t-lib.mjs';
const getFrame = (p) => p.frames().find(f => f.parentFrame() === p.mainFrame() && f.url() !== 'about:blank');
let { b, p, errs } = await open({ props: { lang: 'uz', task: { title: 'PM', previewUrl: { uz: 'https://lavash-toshkent.uz/menyu', ru: 'https://lavash-toshkent.uz/menu' }, previewCss: 'h1{color:rgb(128,0,128)} p{background:rgb(1,2,3)!important} body{padding:0}',
  files: [ { name: 'index.html', lang: 'html', starter: '<h1>Menyu</h1><p>Lavash</p>' }, { name: 'style.css', lang: 'css', starter: '' } ], requirements: [] } } });
await p.waitForTimeout(500);
console.log('bar:', await p.$eval('.hc-preview-pane .hc-pane-bar', e => e.textContent), '| url el width/overflow:', await p.$eval('.hc-url', e => ({ w: e.getBoundingClientRect().width, sw: e.scrollWidth, text: e.textContent })));
const g = (s, pr) => getFrame(p).evaluate(([s, pr]) => getComputedStyle(document.querySelector(s))[pr], [s, pr]);
await p.waitForTimeout(800); console.log('frames', p.frames().map(f=>f.url()));
console.log('previewCss only: h1', await g('h1','color'), 'p bg', await g('p','backgroundColor'), 'body pad', await g('body','padding'));
await p.click('.hc-tab:has-text("style.css")'); await setCode(p, 'h1{color:rgb(0,128,0)} p{background:rgb(9,9,9)} body{padding:40px}'); await p.waitForTimeout(800);
console.log('bola CSS keyin: h1', await g('h1','color'), '(kutilgan 0,128,0)', 'p bg', await g('p','backgroundColor'), '(previewCss !important → 1,2,3 qoladi)', 'body pad', await g('body','padding'));
await shot(p, 'shot-previewurl.png');
// uzun URL
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'uz', task: { title: 'PM', previewUrl: 'https://juda-uzun-manzil-lavash-toshkent-shahar-chilonzor-tumani.uz/menyu/kategoriya/lavash-classic-katta-porsiya?ref=instagram&utm_campaign=yoz2026&session=abcdef1234567890', files: [ { name: 'index.html', lang: 'html', starter: '<h1>M</h1>' } ], requirements: [] } }); });
await p.waitForSelector('.hc-code'); await p.waitForTimeout(400);
console.log('long url:', await p.$eval('.hc-url', e => ({ w: Math.round(e.getBoundingClientRect().width), sw: e.scrollWidth, overflow: getComputedStyle(e).textOverflow })), 'bar w', await p.$eval('.hc-preview-pane .hc-pane-bar', e => Math.round(e.getBoundingClientRect().width)), 'live visible?', await p.$eval('.hc-live', e => e.getBoundingClientRect().width > 0));
await shot(p, 'shot-previewurl-long.png');
// stale + previewUrl in JS mode
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'ru', task: { title: 'PM', previewUrl: 'https://lavash.uz', files: [ { name: 'index.html', lang: 'html', starter: '<h1>M</h1>' }, { name: 'app.js', lang: 'js', starter: 'console.log(1)' } ], requirements: [] } }); });
await p.waitForSelector('.hc-code'); await p.click('.hc-tab:has-text("app.js")'); await setCode(p, 'console.log(2)'); await p.waitForTimeout(700);
console.log('ru+js bar:', await p.$eval('.hc-preview-pane .hc-pane-bar', e => e.textContent));
await b.close();
