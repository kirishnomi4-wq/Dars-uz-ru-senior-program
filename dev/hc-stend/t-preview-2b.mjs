import { open, setCode, shot } from './t-lib.mjs';
const TASK = { title: 'JS sinov', files: [
  { name: 'index.html', lang: 'html', starter: '<h1>Salom</h1><button id="b">Bos</button><p id="o"></p>' },
  { name: 'style.css', lang: 'css', starter: 'h1{color:red}' },
  { name: 'script.js', lang: 'js', starter: 'console.log("start")' },
], requirements: [] };
async function tab(p, name) { await p.click(`.hc-tab:has-text("${name}")`); await p.waitForTimeout(100); }
async function run(p) { await p.click('.hc-mini'); await p.waitForTimeout(900); }
const lines = (p) => p.$$eval('.hc-console-line', els => els.map(e => e.className.replace('hc-console-line ', '') + '|' + e.textContent));
const getFrame = (p) => p.frames().find(f => f.url() === 'about:srcdoc' && f.parentFrame() === p.mainFrame());
const frameText = async (p) => { const fr = getFrame(p); if (!fr) return '(no srcdoc frame: ' + p.frames().map(f=>f.url()) + ')'; try { return await Promise.race([fr.evaluate(() => document.body.innerText.slice(0, 100)), new Promise(r => setTimeout(() => r('(TIMEOUT-frame-hung)'), 2500))]); } catch (e) { return 'ERR ' + e.message.slice(0, 60); } };
let { b, p, errs } = await open({ props: { lang: 'uz', task: TASK } });
await tab(p, 'script.js');
// click handler error
await setCode(p, 'document.getElementById("b").onclick=function(){ bar(); }'); await run(p);
await getFrame(p).click('#b'); await p.waitForTimeout(400); console.log('click-handler error lines:', await lines(p));
// types full
await setCode(p, 'console.log({a:1,b:[1,2]}, undefined, null, function f(){}, new Date(0), new Map([[1,2]]), new Set([1]), NaN, -0, document.body, window, /re/g, [undefined,null], {u:undefined})'); await run(p); console.log('types:', await lines(p));
await setCode(p, 'console.log(window)'); await run(p); console.log('window:', await lines(p));
await setCode(p, 'console.log("a", "b"); console.log(); console.log(""); console.log(" ")'); await run(p); console.log('multi/empty:', JSON.stringify(await lines(p)));
// script injection
await setCode(p, 'console.log("</script><h2>INJ</h2>")'); await run(p); console.log('</script> in JS:', await lines(p), '| frame:', await frameText(p));
await tab(p, 'style.css'); await setCode(p, 'h1{color:blue} </style><h2>CSSINJ</h2><style>'); await run(p); console.log('</style> in CSS: frame', await frameText(p));
await setCode(p, 'h1{color:blue}');
await tab(p, 'index.html'); await setCode(p, '<!doctype html><html><head><title>T</title><style>body{background:yellow}</style></head><body><h1>Full doc</h1></body></html>'); await run(p);
console.log('full doc: frame', await frameText(p), 'bg:', await getFrame(p).evaluate(() => getComputedStyle(document.body).backgroundColor + ' pad=' + getComputedStyle(document.body).padding));
await setCode(p, '<h1>Salom</h1><script>console.log("inline html script")</script>'); await run(p); console.log('inline html script -> console:', await lines(p));
// while(true) recovery
await tab(p, 'script.js'); await setCode(p, 'console.log("before");while(true){}'); await p.click('.hc-mini'); await p.waitForTimeout(2500);
console.log('hung: lines', await lines(p), 'frame:', await frameText(p));
await setCode(p, 'console.log("tirik")'); const t = Date.now(); await p.click('.hc-mini');
for (let i = 0; i < 12; i++) { await p.waitForTimeout(1000); const l = await lines(p); if (l.some(x => x.includes('tirik'))) { console.log('recovered after', Date.now() - t, 'ms', l); break; } if (i === 11) console.log('NOT recovered after 12s; lines', l, 'frame:', await frameText(p)); }
// stale mark and live badge
await setCode(p, 'console.log("x2")'); await p.waitForTimeout(600); console.log('badge after edit (no run):', await p.$eval('.hc-preview-pane .hc-pane-bar', e => e.textContent));
await b.close();
