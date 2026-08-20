import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open();
await p.evaluate(() => { window.unmountHC(); return window.mountHC({ lang: 'uz', task: { title: 't', files: [ { name: 'index.html', lang: 'html', starter: '<p id="o">salom</p>' }, { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ { id: 'r1', label: 'log 5', check: window.HC.checks.logs(5) }, { id: 'r2', label: 'toggle', check: window.HC.checks.toggle('#b', '#o', 'A', 'B') } ] } }); });
await p.waitForSelector('.hc-code'); await p.click('.hc-tab:has-text("script.js")');
// bola JS'da: nonce'ni taxmin qilib hisobotni soxtalashtirish (id'lar darsdan ma'lum deb faraz)
await setCode(p, 'setTimeout(()=>{for(let n=1;n<300;n++)parent.postMessage({__hcReport:true,nonce:n,results:{r1:true,r2:true}},"*")},600)'); await p.waitForTimeout(2500);
console.log('spoof chips (▶ bosilmagan, yashirin iframe o`zi ishlaydi):', await p.$$eval('.hc-chip', e => e.map(x => x.className)), '| Davom etish disabled?', await p.$eval('.hc-next', e => e.disabled));
// harness ichidagi nonce'ni o'qish ham mumkin: document.scripts
await setCode(p, 'const s=[...document.scripts].map(x=>x.textContent).join("");const m=s.match(/nonce:(\d+)/);parent.postMessage({__hcReport:true,nonce:m?+m[1]:0,results:{r1:true,r2:true}},"*")'); await p.waitForTimeout(1500);
console.log('nonce o`qib spoof:', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
await b.close();
