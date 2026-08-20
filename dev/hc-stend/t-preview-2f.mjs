import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open();
await p.evaluate(() => { window.unmountHC(); return window.mountHC({ lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<p id="o">salom</p>' }, { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ { id: 'r1', label: 'log 5', check: window.HC.checks.logs(5) } ] } }); });
await p.waitForSelector('.hc-code'); await p.click('.hc-tab:has-text("script.js")');
await setCode(p, 'console.log(5); while(true){}'); await p.waitForTimeout(1500);   // faqat yashirin iframe qotadi (▶ bosilmadi)
await setCode(p, 'console.log("tirik")'); await p.click('.hc-mini'); await p.waitForTimeout(3000);
console.log('visible preview after hidden hang: console lines', await p.$$eval('.hc-console-line', e => e.map(x => x.textContent)), 'iframes', await p.$$eval('iframe', e => e.length));
const frs = p.frames().filter(f => f.parentFrame() === p.mainFrame());
for (const f of frs) { console.log(' frame', f.name(), await Promise.race([f.evaluate(() => document.body.innerText.slice(0,30)), new Promise(r=>setTimeout(()=>r('(HUNG)'),2000))]).catch(e=>'ERR')); }
await b.close();
