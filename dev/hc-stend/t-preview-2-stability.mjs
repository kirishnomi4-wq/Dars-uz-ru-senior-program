// K-P sinov 2: barqarorlik — cheksiz sikl, rekursiya, katta DOM, xato-satr, konsol
import { open, setCode, shot } from './t-lib.mjs';
const TASK = { title: { uz: 'JS sinov', ru: 'JS' }, files: [
  { name: 'index.html', lang: 'html', starter: '<h1>Salom</h1><button id="b">Bos</button><p id="o"></p>' },
  { name: 'style.css', lang: 'css', starter: 'h1{color:red}' },
  { name: 'script.js', lang: 'js', starter: 'console.log("start")' },
], requirements: [ { id: 'h1', label: 'h1', check: { has: 'h1' } } ] };
async function tab(p, name) { await p.click(`.hc-tab:has-text("${name}")`); await p.waitForTimeout(100); }
async function run(p) { await p.click('.hc-mini'); await p.waitForTimeout(900); }
const lines = (p) => p.$$eval('.hc-console-line', els => els.map(e => e.className.replace('hc-console-line ', '') + '|' + e.textContent.slice(0, 90)));
const frameText = async (p) => { const fr = p.frames().find(f => f.url() === 'about:srcdoc' && f.parentFrame() === p.mainFrame()); try { return await Promise.race([fr.evaluate(() => document.body.innerText.slice(0, 100)), new Promise(r => setTimeout(() => r('(TIMEOUT-frame-hung)'), 2000))]); } catch (e) { return 'ERR ' + e.message.slice(0, 60); } };
const alive = async (p) => { const t = Date.now(); const r = await Promise.race([p.evaluate(() => 1 + 1), new Promise(r => setTimeout(() => r('HUNG'), 3000))]); return r === 'HUNG' ? 'MAIN HUNG' : `main ok ${Date.now() - t}ms`; };

let { b, p, errs } = await open({ props: { lang: 'uz', task: TASK } });
await p.waitForTimeout(600);
console.log('initial console:', await lines(p), '| stale badge:', await p.$eval('.hc-pane-bar', e => e.textContent));
await tab(p, 'script.js');

const JS_CASES = [
  ['throw', 'console.log("a");\nconsole.log("b");\nthrow new Error("Mening xatom");\nconsole.log("c")'],
  ['syntax error', 'console.log("a")\nlet x = ;\nconsole.log("b")'],
  ['ReferenceError line 3', 'console.log(1);\nconsole.log(2);\nfoo();'],
  ['error in click handler', 'document.getElementById("b").onclick=function(){ bar(); }'],
  ['types', 'console.log({a:1,b:[1,2]}, [1,2,3], undefined, null, 42, "str", true, function f(){}, Symbol("s"), 10n, new Date(0), new Map([[1,2]]), NaN, -0, document.body, window)'],
  ['levels', 'console.log("log");console.info("info");console.warn("warn");console.error("error");console.debug("debug");console.table([1,2]);console.dir({x:1});console.clear();console.log("after clear")'],
  ['long 10000', 'console.log("X".repeat(10000))'],
  ['1000 logs', 'for(let i=0;i<1000;i++)console.log("satr",i)'],
  ['circular', 'const o={};o.self=o;console.log(o)'],
  ['multiline', 'console.log("qator1\nqator2\n  bo\'sh joy   ")'],
  ['promise reject', 'Promise.reject(new Error("rejected!"));setTimeout(()=>{throw new Error("async xato")},50)'],
  ['document.write', 'document.write("<h2>DW</h2>");console.log("dw done")'],
  ['big DOM 100000', 'const t=Date.now();for(let i=0;i<100000;i++){const d=document.createElement("div");d.textContent=i;document.body.appendChild(d)}console.log("done",Date.now()-t,"ms")'],
  ['recursion', 'function f(){f()} f(); console.log("after")'],
  ['setInterval x100', 'for(let i=0;i<100;i++)setInterval(()=>console.log("tick"),10)'],
  ['error object', 'console.error(new Error("obj xato"));console.log(new TypeError("t"))'],
];
for (const [name, code] of JS_CASES) {
  await setCode(p, code); await run(p);
  await p.waitForTimeout(500);
  const ls = await lines(p);
  console.log('\n## ' + name, '| lines:', ls.length, '| main:', await alive(p));
  console.log(ls.slice(0, 6).join('\n'), ls.length > 6 ? '\n... last: ' + ls[ls.length - 1] : '');
  console.log('frame:', (await frameText(p)).replace(/\n/g, '⏎').slice(0, 80), '| pane bar:', await p.$eval('.hc-pane-bar', e => e.textContent), '| pageerrs:', errs.splice(0).map(e => e.slice(0, 80)));
  if (name === 'setInterval x100') { await p.waitForTimeout(1500); console.log('after 1.5s more lines:', (await lines(p)).length); }
  if (name === 'throw') await shot(p, 'shot-console-throw.png');
  if (name === 'types') await shot(p, 'shot-console-types.png');
  if (name === '1000 logs') await shot(p, 'shot-console-1000.png');
}
// while(true)
console.log('\n## while(true)');
await setCode(p, 'console.log("before");while(true){}');
const t0 = Date.now(); await p.click('.hc-mini');
await p.waitForTimeout(3000);
console.log('main:', await alive(p), '| lines:', await lines(p), '| typing possible?');
const t1 = Date.now(); await p.click('.hc-code').catch(e => console.log('click err')); await p.keyboard.type('x'); console.log('typed in', Date.now() - t1, 'ms; value tail:', (await p.$eval('.hc-code', e => e.value)).slice(-5));
console.log('tab switch:'); await tab(p, 'index.html'); await setCode(p, '<h1>Yangi</h1>'); await p.waitForTimeout(800); console.log('chips:', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
await shot(p, 'shot-while-true.png');
// Re-run — does new doc replace the hung one?
await tab(p, 'script.js'); await setCode(p, 'console.log("tirik")'); await run(p); await p.waitForTimeout(1500);
console.log('after fix + run: lines', await lines(p), 'frame:', await frameText(p), 'main:', await alive(p));
await b.close();
