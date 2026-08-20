import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open({ props: { lang: 'uz', task: { title: 'C', files: [ { name: 'index.html', lang: 'html', starter: '<button id=b>Bos</button>' }, { name: 'app.js', lang: 'js', starter: '' } ], requirements: [] } } });
await p.click('.hc-tab:has-text("app.js")');
const body = () => p.$eval('.hc-console-body', e => ({ st: e.scrollTop, sh: e.scrollHeight, ch: e.clientHeight, n: e.querySelectorAll('.hc-console-line').length }));
await setCode(p, 'for(let i=0;i<300;i++)console.log("satr",i)'); await p.click('.hc-mini'); await p.waitForTimeout(1200);
console.log('300 log → panel:', await body(), '(auto-scroll pastga? st+ch==sh bo\'lsa ha)');
// tugma bosilganda yangi log — panel qayerda turadi
await setCode(p, 'document.getElementById("b").onclick=()=>console.log("bosildi", Date.now())'); await p.click('.hc-mini'); await p.waitForTimeout(800);
const fr = p.frames().find(f => f.parentFrame() === p.mainFrame());
for (let i = 0; i < 3; i++) { await fr.click('#b'); await p.waitForTimeout(150); }
console.log('click logs:', await p.$$eval('.hc-console-line', e => e.map(x => x.textContent.slice(0, 30))));
// yangi run — eski loglar tozalanadimi
await p.click('.hc-mini'); await p.waitForTimeout(600); console.log('after re-run:', await p.$$eval('.hc-console-line', e => e.length), '(0 kutiladi)');
// HTML tahriri (JS rejimda) konsolni tozalaydimi? — yo'q, faqat stale
await p.click('.hc-tab:has-text("index.html")'); await p.click('.hc-code'); await p.keyboard.press('End'); await p.keyboard.type('<p>x</p>'); await p.waitForTimeout(700);
console.log('after html edit: bar', await p.$eval('.hc-preview-pane .hc-pane-bar', e => e.textContent), '| lines', await p.$$eval('.hc-console-line', e => e.length));
// tozalash tugmasi
await p.click('.hc-mini'); await fr.click('#b').catch(()=>{}); await p.waitForTimeout(300);
const fr2 = p.frames().find(f => f.parentFrame() === p.mainFrame()); await fr2.click('#b'); await p.waitForTimeout(300);
console.log('lines before clear', await p.$$eval('.hc-console-line', e => e.length)); await p.click('.hc-console-clear'); await p.waitForTimeout(200); console.log('after clear', await p.$$eval('.hc-console-line', e => e.length), 'empty text:', await p.$eval('.hc-console-empty', e => e.textContent).catch(()=>null));
// uzun bitta satr — panel gorizontal scroll?
await p.click('.hc-tab:has-text("app.js")'); await setCode(p, 'console.log("A".repeat(3000)); console.log("https://juda-uzun-manzil-".repeat(20))'); await p.click('.hc-mini'); await p.waitForTimeout(800);
console.log('long line: body scrollWidth vs clientWidth', await p.$eval('.hc-console-body', e => e.scrollWidth + '/' + e.clientWidth), 'line height', await p.$eval('.hc-console-line', e => Math.round(e.getBoundingClientRect().height)));
await shot(p, 'shot-console-long.png');
// stale ko'rsatkichi va tugma HTML/CSS: manual rejimda CSS o'zgarsa preview yangilanmaydi
await p.click('.hc-tab:has-text("app.js")'); await setCode(p, 'console.log("k")'); await p.click('.hc-mini'); await p.waitForTimeout(500);
await b.close();
