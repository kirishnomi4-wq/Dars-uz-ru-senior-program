// Runtime harness: sandbox, nonce, konsol yo'naltirish, xato-satri, cheklar
import { open, chips } from './tc-lib.mjs';
const { b, p, log } = await open();

const mkTask = (reqsSrc, jsStarter = '', htmlStarter = '<button id="btn">Bos</button><p id="out">0</p>') => `({
  title: 'tc-rt', requirements: ${reqsSrc},
  files: [
    { name: 'index.html', lang: 'html', starter: ${JSON.stringify(htmlStarter)} },
    { name: 'style.css', lang: 'css', starter: '' },
    { name: 'script.js', lang: 'js', starter: ${JSON.stringify(jsStarter)} },
  ],
})`;
async function mountJs(reqsSrc, js, html) {
  await p.evaluate((src) => { const C = window.HC.checks; localStorage.clear(); localStorage.setItem('tc-secret', 'SIR'); window.__events = []; return window.mountHC({ task: eval(src), lang: 'uz' }); }, mkTask(reqsSrc, js, html));
  await p.waitForSelector('.hc-root textarea.hc-code');
  await p.waitForTimeout(1200);
}
const consoleLines = () => p.$$eval('.hc-console-line', els => els.map(e => e.className.replace('hc-console-line ', '') + '|' + e.textContent));
const alive = async () => { try { return await Promise.race([p.evaluate(() => 1 + 1), new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 3000))]); } catch (e) { return e.message; } };

// A) SANDBOX: parent/top/localStorage/alert/prompt/top navigation
await mountJs(`[{ id:'r1', label:'log', check: C.logs('Salom') }]`, `
console.log('Salom');
try { console.log('LS:', localStorage.getItem('tc-secret')); } catch(e){ console.log('LS-ERR:' + e.name); }
try { console.log('PARENT-DOC:', parent.document.title); } catch(e){ console.log('PARENT-ERR:' + e.name); }
try { console.log('TOP-LS:', top.localStorage.getItem('tc-secret')); } catch(e){ console.log('TOP-ERR:' + e.name); }
try { console.log('ORIGIN:', location.origin, 'sandbox-origin', window.origin); } catch(e){ console.log('ORIGIN-ERR:' + e.name); }
try { console.log('COOKIE:', document.cookie); } catch(e){ console.log('COOKIE-ERR:' + e.name); }
try { var r = alert('salom'); console.log('ALERT-RETURNED', String(r)); } catch(e){ console.log('ALERT-ERR:' + e.name); }
try { var pr = prompt('ism?'); console.log('PROMPT:', String(pr)); } catch(e){ console.log('PROMPT-ERR:' + e.name); }
try { var cf = confirm('rozimisiz?'); console.log('CONFIRM:', String(cf)); } catch(e){ console.log('CONFIRM-ERR:' + e.name); }
try { top.location.href = 'http://127.0.0.1:4517/?hacked=1'; console.log('TOPNAV-NOERR'); } catch(e){ console.log('TOPNAV-ERR:' + e.name); }
try { parent.postMessage({__hcConsole:true, nonce:1, level:'log', text:'FORGED-CONSOLE'}, '*'); } catch(e){}
console.log({a:1,b:[1,2]}, [1,'x'], null, undefined, function f(){}, 12n, Symbol('s'), document.body, new Map([[1,2]]));
console.error('xato-matn'); console.warn('ogoh'); console.info('info'); console.debug('debug'); console.table([1]);
console.log('%s dunyo', 'salom');
var circ = {}; circ.self = circ; console.log(circ);
`);
console.log('[A] chips', await chips(p));
console.log('[A] console', await consoleLines());
console.log('[A] page url', p.url(), 'events', await p.evaluate(() => window.__events));

// B) XATO SATRI: throw & ReferenceError
await mountJs(`[{ id:'r1', label:'log', check: C.logs('B') }]`, `console.log('B');\n\n\nfoo();\nconsole.log('keyin');`);
console.log('[B] console', await consoleLines(), 'chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log', check: C.logs('B') }]`, `console.log('B');\nlet x = ;`);
console.log('[B2 syntax] console', await consoleLines(), 'chips', await chips(p));

// C) NONCE forging & harness cheats — o'quvchi kodi
await mountJs(`[{ id:'r1', label:'log 999', check: C.logs('999') }, { id:'r2', label:'click', check: C.domAfterClick('#btn','#out','7') }, { id:'r3', label:'eval', check: C.evalEquals('typeof f','function') }]`,
  `for (var n=1;n<50;n++){ try{ parent.postMessage({__hcReport:true, nonce:n, results:{r1:true,r2:true,r3:true}}, '*'); }catch(e){} }`);
console.log('[C forge] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log 999', check: C.logs('999') }]`, `window.__logs = ['999'];`);
console.log('[C __logs] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log 999', check: C.logs('999') }]`, `console.log(1999);`);
console.log('[C substring 1999] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log 1 2 3', check: C.logs('1 2 3') }]`, `for(var i=1;i<=3;i++) console.log(i + ' ');`);
console.log('[C trailing space] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log 1 2 3', check: C.logs('1 2 3') }]`, `for(var i=1;i<=3;i++) console.log('Son: ' + i);`);
console.log('[C prefixed] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log 1 2 3', check: C.logs('1 2 3') }]`, `console.log('1 2 3');`);
console.log('[C literal] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }]`, `console.info('Salom');`);
console.log('[C console.info] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }]`, `setTimeout(function(){ console.log('Salom'); }, 200);`);
await p.waitForTimeout(600);
console.log('[C async 200ms] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }]`, `window.addEventListener('load', function(){ console.log('Salom'); });`);
console.log('[C onload] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }]`, `document.write('<b>x</b>'); console.log('Salom');`);
console.log('[C document.write] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }]`, `const s = "</script>"; console.log('Salom');`);
console.log('[C </script> in js] chips', await chips(p), 'console', await consoleLines());
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }]`, `console.log('Salom'); throw new Error('boom');`);
console.log('[C throw after log] chips', await chips(p));
await mountJs(`[{ id:'r1', label:'log Salom', check: C.logs('Salom') }, { id:'r2', label:'eval', check: C.evalEquals('x', '5') }, { id:'r3', label:'eval let', check: C.evalEquals('y', '6') }, { id:'r4', label:'eval undefined', check: C.evalEquals('typeof zzz', 'undefined') }, { id:'r5', label:'eval throws', check: C.evalEquals('zzz', 'undefined') }]`, `var x = 5; let y = 6; console.log('Salom');`);
console.log('[C eval var/let/undefined] chips', await chips(p));
// click_text: matn boshidan bor bo'lsa
await mountJs(`[{ id:'r2', label:'click', check: C.domAfterClick('#btn','#out','7') }]`, `document.getElementById('btn').onclick = function(){ document.getElementById('out').textContent = '7'; };`, '<button id="btn">Bos</button><p id="out">7</p>');
console.log('[C click already-7] chips', await chips(p));
await mountJs(`[{ id:'r2', label:'click', check: C.domAfterClick('#btn','#out','7') }]`, `document.getElementById('btn').addEventListener('click', function(){ document.getElementById('out').textContent = '7'; });`);
console.log('[C click ok] chips', await chips(p));
await mountJs(`[{ id:'r2', label:'click', check: C.domAfterClick('#btn','#out','7') }]`, `document.getElementById('btn').addEventListener('click', function(){ setTimeout(function(){ document.getElementById('out').textContent = '7'; }, 0); });`);
console.log('[C click async setTimeout 0] chips', await chips(p));
await mountJs(`[{ id:'r2', label:'click', check: C.domAfterClick('#btn','#out','7') }]`, `document.getElementById('btn').addEventListener('click', function(){ document.getElementById('out').innerHTML = '<b>7</b>'; });`);
console.log('[C click innerHTML] chips', await chips(p));
await mountJs(`[{ id:'r2', label:'click', check: C.domAfterClick('#btn','#out','7') }]`, `document.getElementById('btn').addEventListener('click', function(){ document.getElementById('out').value = '7'; });`, '<button id="btn">Bos</button><input id="out" value="0">');
console.log('[C click input value] chips', await chips(p));
// toggle
await mountJs(`[{ id:'t', label:'toggle', check: C.toggle('#rejim','#rejim','Kunduz','Tun') }]`, `var b=document.getElementById('rejim'); b.onclick=function(){ b.textContent = b.textContent==='Kunduz' ? 'Tun' : 'Kunduz'; };`, '<button id="rejim">Kunduz</button>');
console.log('[C toggle ok] chips', await chips(p));
await mountJs(`[{ id:'t', label:'toggle', check: C.toggle('#rejim','#rejim','Kunduz','Tun') }]`, `var b=document.getElementById('rejim'); b.onclick=function(){ b.textContent = b.textContent==='Kunduz rejimi' ? 'Tun rejimi' : 'Kunduz rejimi'; };`, '<button id="rejim">Kunduz rejimi</button>');
console.log('[C toggle with suffix] chips', await chips(p));
await mountJs(`[{ id:'t', label:'toggle', check: C.toggle('#rejim','#rejim','Kun','Tun') }]`, `var b=document.getElementById('rejim'); b.onclick=function(){ b.textContent = b.textContent==='Kunduz' ? 'Tunduz' : 'Kunduz'; };`, '<button id="rejim">Kunduz</button>');
console.log('[C toggle substring Kun/Tun] chips', await chips(p));

// D) INFINITE LOOP — sahifa qotib qoladimi?
await mountJs(`[{ id:'r1', label:'log', check: C.logs('X') }]`, `console.log('X'); while(true){}`);
console.log('[D loop] alive?', await alive(), 'chips', await chips(p).catch(e => 'ERR ' + e.message));
await p.waitForTimeout(3000);
console.log('[D loop 3s later] alive?', await alive());
// yana yozish — yangi iframe
await mountJs(`[{ id:'r1', label:'log', check: C.logs('Y') }]`, `console.log('Y');`);
console.log('[D after loop remount] alive?', await alive(), 'chips', await chips(p).catch(e => 'ERR ' + e.message));
// while(true) uzunroq: 6 s davomida sahifa
await mountJs(`[{ id:'r1', label:'log', check: C.logs('X') }]`, `var t=Date.now(); while(Date.now()-t<6000){} console.log('X');`);
const t0 = Date.now(); const a1 = await alive(); console.log('[D 6s busy] alive?', a1, 'took', Date.now() - t0, 'ms');
await p.waitForTimeout(6500);
console.log('[D 6s busy after] chips', await chips(p));

console.log('log:', log.filter(l => !/DevTools|ERR_NAME/.test(l)).slice(0, 30));
await b.close();
