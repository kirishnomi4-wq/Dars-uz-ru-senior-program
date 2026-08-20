import { open, setCode, shot } from './t-lib.mjs';
const lines = (p) => p.$$eval('.hc-console-line', els => els.map(e => e.textContent));
const getFrame = (p) => p.frames().find(f => f.url() === 'about:srcdoc' && f.parentFrame() === p.mainFrame());
const frameText = async (p) => { const fr = getFrame(p); if (!fr) return '(no srcdoc frame)'; try { return await Promise.race([fr.evaluate(() => document.body.innerText.slice(0, 60)), new Promise(r => setTimeout(() => r('(HUNG)'), 2000))]); } catch (e) { return 'ERR ' + e.message.slice(0, 60); } };
// 1) HTML-only LIVE rejim: bola <script>while(true){}</script> yozadi
let { b, p, errs } = await open();
await setCode(p, '<h1>A</h1><script>while(true){}</script>'); await p.waitForTimeout(1500);
console.log('live hung:', await frameText(p));
await setCode(p, '<h1>B tuzatildi</h1>'); 
for (let i = 1; i <= 8; i++) { await p.waitForTimeout(5000); const t = await frameText(p); console.log(`  after ${i*5}s:`, t); if (!t.includes('HUNG')) break; }
console.log('main alive:', await Promise.race([p.evaluate(() => 'ok'), new Promise(r=>setTimeout(()=>r('HUNG'),3000))]), '| chips:', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
// remount tiklaydimi?
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'uz' }); }); await p.waitForSelector('.hc-code'); await p.waitForTimeout(1500);
console.log('after remount frame:', await frameText(p), '| iframes:', await p.$$eval('iframe', e => e.length), '| editor value:', (await p.$eval('.hc-code', e => e.value)).slice(0,30));
// Endi tugma bosishlari — Qaytadan, Davom etish ishlaydimi
await b.close();
// 2) hasRuntime task: yashirin tekshiruv-iframe ham qotadimi -> chiplar?
({ b, p, errs } = await open({ props: { lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<button id="b">Bos</button><p id="o"></p>' },
  { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ { id: 'r1', label: 'log 5', check: { logs: 5 } } ] } } }));
await p.click('.hc-tab:has-text("script.js")'); await setCode(p, 'console.log(5)'); await p.waitForTimeout(1200);
console.log('runtime chip ok?', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
await setCode(p, 'console.log(5); while(true){}'); await p.waitForTimeout(1500);
console.log('runtime chip after hang (no run):', await p.$$eval('.hc-chip', e => e.map(x => x.className)), 'iframes:', await p.$$eval('iframe', e => e.length));
await setCode(p, 'console.log(5)'); await p.waitForTimeout(6000);
console.log('runtime chip after fix (6s):', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
await b.close();
