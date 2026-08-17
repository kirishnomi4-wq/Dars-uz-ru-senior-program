import { open, setCode } from './t-lib.mjs';
const st = async (p) => ({ iframes: await p.$$eval('iframe', e => e.length), hung: await p.$$eval('.hc-hung', e => e.map(x => x.textContent.slice(0, 40))), chips: await p.$$eval('.hc-chip', e => e.map(x => x.className)) });
const frameText = async (p) => { const fr = p.frames().find(f => f.url() === 'about:srcdoc' && f.parentFrame() === p.mainFrame()); if (!fr) return '(no frame)'; try { return await Promise.race([fr.evaluate(() => document.body.innerText.slice(0, 40)), new Promise(r => setTimeout(() => r('(HUNG)'), 2000))]); } catch (e) { return 'ERR ' + e.message.slice(0, 40); } };
// 1) HTML-only jonli rejim
let { b, p } = await open();
await setCode(p, '<h1>A</h1><script>while(true){}</script>');
await p.waitForTimeout(1500); console.log('1a qotgan (1.5s):', await frameText(p), await st(p));
await p.waitForTimeout(3000); console.log('1b watchdog (4.5s):', await frameText(p), await st(p));
await p.waitForTimeout(3500); console.log('1c ikkinchi urinish (8s):', await frameText(p), await st(p));
await setCode(p, '<h1>B tuzatildi</h1>'); await p.waitForTimeout(1500);
console.log('1d tuzatilgach (1.5s):', await frameText(p), await st(p));
// 2) qotgan → 3s ichida tuzatildi
await setCode(p, '<h1>C</h1><script>while(true){}</script>'); await p.waitForTimeout(1200);
await setCode(p, '<h1>D tez tuzatildi</h1>'); await p.waitForTimeout(4500);
console.log('2  tez tuzatilgan (5.7s):', await frameText(p), await st(p));
await b.close();
// 3) runtime shart + JS fayl (qo'lda rejim): yashirin tekshiruv-iframe
({ b, p } = await open({ props: { lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<p id="o">x</p>' }, { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ { id: 'r1', label: 'log 5', check: { logs: 5 } } ] } } }));
await p.click('.hc-tab:has-text("script.js")'); await setCode(p, 'console.log(5)'); await p.waitForTimeout(1200);
console.log('3a sog\'lom:', await st(p));
await setCode(p, 'let i=0;\nwhile(i<3){}'); await p.waitForTimeout(1500); console.log('3b qotgan (1.5s):', await st(p));
await p.waitForTimeout(3200); console.log('3c watchdog (4.7s):', await st(p), 'hint:', await p.$$eval('.hc-chip', e => e.map(x => x.getAttribute('title')||'').join('|')).then(s=>s.slice(0,80)));
await setCode(p, 'let i=0;\nwhile(i<3){i++}\nconsole.log(5)'); await p.waitForTimeout(2500);
console.log('3d tuzatilgach (2.5s):', await st(p));
await b.close();
