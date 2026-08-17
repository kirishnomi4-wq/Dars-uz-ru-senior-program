import { open, setCode } from './t-lib.mjs';
const st = async (p) => ({ iframes: await p.$$eval('iframe', e => e.length), hung: await p.$$eval('.hc-hung', e => e.length) });
const ftext = async (p) => { const frs = p.frames().filter(f => f.parentFrame() === p.mainFrame()); const out = []; for (const fr of frs) { try { out.push(await Promise.race([fr.evaluate(() => document.body && document.body.innerText.slice(0, 30)), new Promise(r => setTimeout(() => r('(HUNG)'), 2000))])); } catch (e) { out.push('ERR'); } } return out; };
let { b, p } = await open();
await setCode(p, '<h1>C</h1><script>while(true){}</script>'); await p.waitForTimeout(800);
await setCode(p, '<h1>D tez tuzatildi</h1>');
for (const t of [1,2,3,4,5,7]) { await p.waitForTimeout(t===1?1000:1000); console.log(`fix +${t}s:`, await st(p), await ftext(p)); }
await b.close();
