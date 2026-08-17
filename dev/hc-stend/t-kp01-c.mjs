import { open, setCode } from './t-lib.mjs';
const st = async (p) => ({ iframes: await p.$$eval('iframe', e => e.length), hung: await p.$$eval('.hc-hung', e => e.length), chips: await p.$$eval('.hc-chip', e => e.map(x => x.className)), hint: (await p.$$eval('.hc-hint', e => e.map(x => x.textContent.slice(0,50)))) });
// runtime shart + JS fayl (qo'lda rejim) — yashirin tekshiruv-iframe qotadi
let { b, p } = await open({ props: { lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<p id="o">x</p>' }, { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ { id: 'r1', label: 'log 5', logs: 5 } ] } } });
await p.click('.hc-tab:has-text("script.js")'); await setCode(p, 'console.log(5)'); await p.waitForTimeout(1500);
console.log('a sog\'lom:', await st(p));
await setCode(p, 'let i=0;\nwhile(i<3){}'); await p.waitForTimeout(1500); console.log('b qotgan (1.5s):', await st(p));
await p.waitForTimeout(4500); console.log('c watchdog (6s):', await st(p));
await p.waitForTimeout(4500); console.log('d 2-urinish o\'tdi (8.5s):', await st(p));
await setCode(p, 'let i=0;\nwhile(i<3){i++}\nconsole.log(5)'); await p.waitForTimeout(2500);
console.log('e tuzatilgach (2.5s):', await st(p));
// tez tuzatish: qotgan → 1s ichida tuzatildi
await setCode(p, 'while(true){}'); await p.waitForTimeout(800);
await setCode(p, 'console.log(5)'); await p.waitForTimeout(6500);
console.log('f tez tuzatilgan (7.3s):', await st(p));
await b.close();
