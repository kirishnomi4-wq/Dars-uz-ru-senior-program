// K-C-11: window.__logs orqali soxta hisobot — qayta chiqarish/tasdiq
import { open, chips } from './tc-lib.mjs';
const { b, p, log } = await open();
const mkTask = (reqsSrc, js) => `({ title:'kc11', requirements:${reqsSrc}, files:[
  { name:'index.html', lang:'html', starter:'<p id="out">0</p>' },
  { name:'style.css', lang:'css', starter:'' },
  { name:'script.js', lang:'js', starter:${JSON.stringify(js)} } ] })`;
async function run(label, reqs, js, expect) {
  await p.evaluate((src) => { const C = window.HC.checks; return window.mountHC({ task: eval(src), lang: 'uz' }); }, mkTask(reqs, js));
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1500);
  const c = await chips(p); const ok = c[0].ok;
  console.log(`${ok === expect ? '✓' : '✗ KUTILMAGAN'} [${label}] chip=${ok ? 'yashil' : 'qizil'} (kutilgan ${expect ? 'yashil' : 'qizil'})`);
}
const R = `[{ id:'r1', label:'log 999', check: C.logs('999') }]`;
await run('halol console.log(999)', R, `console.log(999);`, true);
await run('halol sikl', R, `for(var i=0;i<1000;i++){} console.log(i-1);`, true);
await run('halol obyekt', R, `console.log({n:999});`, true);
await run('log yo\'q', R, `var x=999;`, false);
await run('spoof: __logs = [...]', R, `window.__logs = ['999'];`, false);
await run('spoof: __logs.push', R, `try{window.__logs.push('999');}catch(e){}`, false);
await run('spoof: defineProperty __logs getter', R, `Object.defineProperty(window,'__logs',{get(){return ['999'];}});`, false);
await run('spoof: __hcLogs = fn', R, `try{window.__hcLogs=function(){return ['999']};}catch(e){}`, false);
await run('spoof: defineProperty __hcLogs', R, `try{Object.defineProperty(window,'__hcLogs',{value:function(){return ['999']}});}catch(e){}`, false);
await run('spoof: __hcLogs().push', R, `try{window.__hcLogs().push('999');}catch(e){}`, false);
await run('spoof: console.log override', R, `console.log=function(){}; console.log('999');`, false);
await run('zahar: Array.prototype.push', R, `Array.prototype.push=function(){this[this.length]='999';return this.length;}; console.log('x');`, false);
await run('zahar: String.prototype.indexOf→0', R, `String.prototype.indexOf=function(){return 0;}; console.log('x');`, false);
await run('zahar: Array.prototype.join', R, `Array.prototype.join=function(){return '999';}; console.log('x');`, false);
await run('zahar: Array.prototype.some→true', R, `Array.prototype.some=function(){return true;}; console.log('x');`, false);
await b.close();
