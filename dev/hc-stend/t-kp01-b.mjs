import { open, setCode } from './t-lib.mjs';
const st = async (p) => ({ frames: p.frames().map(f => f.url()).filter(u=>u!=='http://127.0.0.1:4517/'), iframes: await p.$$eval('iframe', e => e.length), hung: (await p.$$eval('.hc-hung', e => e.length)) });
const ftext = async (p) => { const frs = p.frames().filter(f => f.parentFrame() === p.mainFrame()); const out = []; for (const fr of frs) { try { out.push(await Promise.race([fr.evaluate(() => document.body && document.body.innerText.slice(0, 30)), new Promise(r => setTimeout(() => r('(HUNG)'), 2000))])); } catch (e) { out.push('ERR ' + e.message.slice(0, 30)); } } return out; };
let { b, p } = await open();
await p.evaluate(() => { window.__done = []; addEventListener('message', e => { if (e.data && e.data.__hcDone) window.__done.push(e.data.nonce); }); });
await setCode(p, '<h1>A</h1>'); await p.waitForTimeout(1000); console.log('0 sog\'lom:', await st(p), await ftext(p), 'done:', await p.evaluate(()=>window.__done));
await setCode(p, '<h1>A</h1><script>while(true){}</script>'); await p.waitForTimeout(500);
for (const t of [1,2,3,4,5,6,8]) { await p.waitForTimeout(t===1?500:1000); console.log(`hang +${t}s:`, await st(p), 'done:', await p.evaluate(()=>window.__done.length)); }
await setCode(p, '<h1>B</h1>'); await p.waitForTimeout(2000); console.log('fix +2s:', await st(p), await ftext(p), 'done:', await p.evaluate(()=>window.__done));
await b.close();
