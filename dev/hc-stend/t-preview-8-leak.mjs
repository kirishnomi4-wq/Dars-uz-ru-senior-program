import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open();
await p.evaluate(() => {
  window.__ls = { add: 0, rem: 0, types: {} };
  const oa = window.addEventListener.bind(window), or = window.removeEventListener.bind(window);
  window.addEventListener = (t, f, o) => { window.__ls.add++; window.__ls.types[t] = (window.__ls.types[t] || 0) + 1; return oa(t, f, o); };
  window.removeEventListener = (t, f, o) => { window.__ls.rem++; window.__ls.types[t] = (window.__ls.types[t] || 0) - 1; return or(t, f, o); };
  window.__timers = { set: 0, cleared: 0 }; const os = window.setTimeout, oc = window.clearTimeout;
  window.setTimeout = (...a) => { window.__timers.set++; return os(...a); }; window.clearTimeout = (id) => { window.__timers.cleared++; return oc(id); };
});
const snap = () => p.evaluate(() => ({ styles: document.querySelectorAll('style').length, hcStyles: [...document.querySelectorAll('style')].filter(s => s.textContent.includes('.hc-root')).length, iframes: document.querySelectorAll('iframe').length, roots: document.querySelectorAll('.hc-root').length, ls: window.__ls, timers: window.__timers, mem: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB' : null }));
console.log('start', JSON.stringify(await snap()));
for (let i = 0; i < 20; i++) {
  await p.evaluate(() => window.unmountHC());
  await p.evaluate(() => window.mountHC({ lang: 'uz', storageKey: 'leak-test', task: { title: 't', files: [ { name: 'index.html', lang: 'html', starter: '<h1>x</h1>' }, { name: 'app.js', lang: 'js', starter: 'console.log(1)' } ], requirements: [ { id: 'r', label: 'l', check: window.HC.checks.logs(1) } ] } }));
  await p.waitForSelector('.hc-code'); await p.click('.hc-code'); await p.keyboard.type('a'); await p.waitForTimeout(150);
}
await p.waitForTimeout(800);
console.log('after 20 mount+type (mounted)', JSON.stringify(await snap()));
await p.evaluate(() => window.unmountHC()); await p.waitForTimeout(600);
console.log('after final unmount', JSON.stringify(await snap()));
// yig'ilib qolgan <style> parseCss'dan? head'dagi style'lar
console.log('head styles:', await p.evaluate(() => [...document.head.querySelectorAll('style')].map(s => s.textContent.slice(0, 40))));
// StyleTag ikki nusxa? (bitta komponent = bitta style; ikkitasi bo'lsa 2) — bitta root, faqat mulohaza. Style tag qayerda?
await p.evaluate(() => window.mountHC({ lang: 'uz' })); await p.waitForSelector('.hc-code');
console.log('style location:', await p.evaluate(() => { const s = [...document.querySelectorAll('style')].find(s => s.textContent.includes('.hc-root')); return s ? s.parentElement.className + ' / ' + s.parentElement.tagName : 'none'; }));
// while(true) qotgach unmount+mount tiklaydimi (to'g'ri frame-tekshiruv bilan)
const child = () => p.frames().find(f => f.parentFrame() === p.mainFrame());
const ft = async () => { const f = child(); if (!f) return '(no frame)'; try { return await Promise.race([f.evaluate(() => document.body.innerText.slice(0, 40)), new Promise(r => setTimeout(() => r('(HUNG)'), 2500))]); } catch (e) { return 'ERR ' + e.message.slice(0, 50); } };
await setCode(p, '<h1>Q</h1><script>while(true){}</script>'); await p.waitForTimeout(1500); console.log('hung:', await ft());
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'uz' }); }); await p.waitForSelector('.hc-code'); await setCode(p, '<h1>Yangi</h1>'); await p.waitForTimeout(2500);
console.log('after remount + edit:', await ft(), 'main alive:', await p.evaluate(() => 'ok'));
await b.close();
