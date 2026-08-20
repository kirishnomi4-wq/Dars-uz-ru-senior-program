import { open, setCode, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const fu = () => p.frames().map(f => f.url());
await setCode(p, '<p>self</p><script>setTimeout(()=>{location.href="https://example.com/"},100)</script>'); await p.waitForTimeout(1500); console.log('nav:', fu());
await setCode(p, '<h1>Salom</h1>'); await p.waitForTimeout(900); console.log('edit:', fu());
await setCode(p, '<p>hb</p><script>setTimeout(()=>history.back(),100)</script>'); await p.waitForTimeout(1500); console.log('back:', fu());
await shot(p, 'shot-history-back.png');
for (let i = 0; i < 4; i++) { await setCode(p, '<h1>Salom ' + i + '</h1>'); await p.waitForTimeout(1200); console.log('after edit', i, fu()); }
await shot(p, 'shot-history-back-2.png');
console.log(errs);
await b.close();
