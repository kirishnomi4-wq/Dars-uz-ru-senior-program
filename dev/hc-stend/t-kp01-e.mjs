import { open, setCode } from './t-lib.mjs';
let { b, p } = await open();
await p.evaluate(() => { window.__log = []; const t0 = Date.now(); addEventListener('message', e => { if (e.data && (e.data.__hcDone)) window.__log.push([Date.now()-t0, 'done', e.data.nonce]); });
  const obs = new MutationObserver(() => { const n = document.querySelectorAll('iframe').length, h = document.querySelectorAll('.hc-hung').length; const last = window.__log[window.__log.length-1]; if (!last || last[1] !== 'dom' || last[2] !== n || last[3] !== h) window.__log.push([Date.now()-t0, 'dom', n, h]); }); obs.observe(document.body, { childList: true, subtree: true }); });
await setCode(p, '<h1>C</h1><script>while(true){}</script>'); await p.waitForTimeout(800);
await p.evaluate(() => window.__log.push(['---- D typing']));
await setCode(p, '<h1>D tez tuzatildi</h1>'); await p.waitForTimeout(6000);
console.log(JSON.stringify(await p.evaluate(() => window.__log)));
await b.close();
