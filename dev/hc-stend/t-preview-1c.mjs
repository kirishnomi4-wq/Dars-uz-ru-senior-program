import { open, setCode, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const fu = () => p.frames().map(f => f.url());
await setCode(p, '<p>hb</p><script>setTimeout(()=>history.back(),100)</script>'); await p.waitForTimeout(1500);
console.log('after back:', fu());
await shot(p, 'shot-history-back.png');
for (let i = 0; i < 3; i++) { await setCode(p, '<h1>Salom ' + i + '</h1>'); await p.waitForTimeout(900); console.log('after edit', i, fu()); }
await p.evaluate(() => window.unmountHC()); await p.evaluate(() => window.mountHC({ lang: 'uz' })); await p.waitForSelector('.hc-code'); await p.waitForTimeout(800);
console.log('after remount:', fu());
// history.forward / go(0)? / location.replace('about:blank')
await setCode(p, '<p>x</p><script>setTimeout(()=>location.replace("about:blank"),100)</script>'); await p.waitForTimeout(1200); console.log('about:blank:', fu());
await setCode(p, '<h1>again</h1>'); await p.waitForTimeout(900); console.log('after edit:', fu());
// javascript: url
await setCode(p, '<a id=a href="javascript:document.body.innerHTML=\'JSURL\'">j</a><script>setTimeout(()=>document.getElementById("a").click(),50)</script>'); await p.waitForTimeout(1200);
const fr = p.frames().find(f => f.url() === 'about:srcdoc'); console.log('jsurl:', fr ? await fr.evaluate(()=>document.body.innerText) : fu());
await b.close();
