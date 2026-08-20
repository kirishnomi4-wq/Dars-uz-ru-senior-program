// K-P sinov 1: iframe xavfsizligi — o'quvchi kodi ota-oynaga chiqa oladimi?
import { open, setCode, shot } from './t-lib.mjs';

const CASES = [
  ['parent.localStorage', `<script>try{parent.localStorage.setItem('x','1');document.body.innerHTML='OK-LS'}catch(e){document.body.innerHTML='ERR:'+e.message}</script>`],
  ['parent.document', `<script>try{parent.document.body.innerHTML='';document.body.innerHTML='OK-DOC'}catch(e){document.body.innerHTML='ERR:'+e.message}</script>`],
  ['top.location', `<script>try{top.location='https://example.com/';document.body.innerHTML='OK-TOP'}catch(e){document.body.innerHTML='ERR:'+e.message}</script>`],
  ['a target=_top', `<a id=a href="https://example.com/" target="_top">go</a><script>setTimeout(()=>document.getElementById('a').click(),50)</script>`],
  ['a target=_parent', `<a id=a href="https://example.com/" target="_parent">go</a><script>setTimeout(()=>document.getElementById('a').click(),50)</script>`],
  ['a default (base _blank)', `<a id=a href="https://example.com/">go</a><script>setTimeout(()=>document.getElementById('a').click(),50)</script>`],
  ['form submit', `<form id=f action="https://example.com/"><input name=q value=1></form><script>setTimeout(()=>document.getElementById('f').submit(),50)</script>`],
  ['form submit target=_top', `<form id=f action="https://example.com/" target="_top"><input name=q value=1></form><script>setTimeout(()=>{try{document.getElementById('f').submit()}catch(e){document.body.innerHTML='ERR:'+e.message}},50)</script>`],
  ['meta refresh', `<meta http-equiv="refresh" content="0;url=https://example.com/"><p>meta</p>`],
  ['window.open', `<script>var w=window.open('https://example.com/');document.body.innerHTML=w?'OPENED':'BLOCKED'</script>`],
  ['alert', `<script>var t=Date.now();alert('hi');document.body.innerHTML='after-alert '+(Date.now()-t)+'ms'</script>`],
  ['confirm/prompt', `<script>var r=confirm('?');var q=prompt('?');document.body.innerHTML='c='+r+' p='+q</script>`],
  ['location.reload', `<p>rl</p><script>if(!sessionStorage.x){}try{setTimeout(()=>location.reload(),100)}catch(e){document.body.innerHTML='ERR:'+e.message}</script>`],
  ['location.href self', `<p>self</p><script>setTimeout(()=>{location.href='https://example.com/'},100)</script>`],
  ['postMessage spoof console', `<script>parent.postMessage({__hcConsole:true,nonce:1,level:'error',text:'SPOOF'},'*');parent.postMessage({__hcReport:true,nonce:1,results:{}},'*')</script>`],
  ['fetch/XHR', `<script>fetch('http://127.0.0.1:4517/').then(r=>r.text()).then(t=>document.body.innerHTML='FETCH-OK '+t.length).catch(e=>document.body.innerHTML='FETCH-ERR '+e.message)</script>`],
  ['cookie/origin', `<script>document.body.innerHTML='origin='+location.origin+' cookie='+(function(){try{return document.cookie}catch(e){return 'ERR '+e.message}})()+' ls='+(function(){try{return !!localStorage}catch(e){return 'ERR '+e.name}})()</script>`],
  ['video/audio/iframe', `<video id=v controls src="x.mp4"></video><audio controls src="x.mp3"></audio><iframe id=if src="https://example.com/"></iframe><iframe id=if2 srcdoc="<p>inner</p>"></iframe>`],
];

const { b, p, errs, ctx } = await open();
const dialogs = []; p.on('dialog', d => { dialogs.push(d.type() + ':' + d.message()); d.dismiss(); });
const popups = []; ctx.on('page', pg => popups.push(pg.url() || '(new page)'));
const out = [];
for (const [name, code] of CASES) {
  dialogs.length = 0; popups.length = 0;
  await p.evaluate(() => { localStorage.removeItem('x'); window.__navs = 0; });
  await setCode(p, code);
  await p.waitForTimeout(1200);
  const info = await p.evaluate(async () => {
    const fr = document.querySelector('iframe.hc-frame');
    let inner = null;
    try { inner = fr.contentDocument && fr.contentDocument.body ? fr.contentDocument.body.innerText.slice(0, 120) : '(cross-origin: contentDocument null)'; } catch (e) { inner = 'ERR ' + e.message; }
    return {
      url: location.href, ls: localStorage.getItem('x'), rootAlive: !!document.querySelector('.hc-root'),
      inner, consoleLines: [...document.querySelectorAll('.hc-console-line')].map(e => e.textContent).slice(0, 3),
      iframeCount: document.querySelectorAll('iframe').length,
    };
  }).catch(e => ({ evalErr: e.message }));
  out.push({ name, ...info, dialogs: [...dialogs], popups: [...popups], errs: errs.splice(0) });
  console.log(name, JSON.stringify(out[out.length - 1]));
  if (!info.rootAlive || info.evalErr) { console.log('!! page broke — reopen'); await p.goto('http://127.0.0.1:4517/'); await p.evaluate(() => window.mountHC({ lang: 'uz' })); await p.waitForSelector('.hc-code'); }
}
await shot(p, 'shot-sec-last.png');
await b.close();
