import { open, setCode, shot } from './t-lib.mjs';
const CASES = [
  ['alert', `<script>var t=Date.now();alert('hi');document.body.innerHTML='after-alert '+(Date.now()-t)+'ms'</script>`],
  ['confirm/prompt', `<script>var r=confirm('?');var q=prompt('?');document.body.innerHTML='c='+r+' p='+q</script>`],
  ['window.open', `<script>var w=window.open('https://example.com/');document.body.innerHTML=w?'OPENED':'BLOCKED'</script>`],
  ['window.open x5 in click', `<button id=b>b</button><script>document.getElementById('b').onclick=function(){for(var i=0;i<5;i++)window.open('https://example.com/?'+i)}</script>`],
  ['meta refresh', `<meta http-equiv="refresh" content="0;url=https://example.com/"><p>meta</p>`],
  ['location.href self', `<p>self</p><script>setTimeout(()=>{location.href='https://example.com/'},100)</script>`],
  ['location.reload', `<p>rl</p><script>setTimeout(()=>location.reload(),100)</script>`],
  ['cookie/origin', `<script>document.body.innerHTML='origin='+location.origin+' cookie='+(function(){try{return document.cookie}catch(e){return 'ERR '+e.message}})()+' ls='+(function(){try{return !!localStorage}catch(e){return 'ERR '+e.name}})()</script>`],
  ['video/audio/iframe', `<video id=v controls src="x.mp4"></video><audio controls src="x.mp3"></audio><iframe id=if src="https://example.com/"></iframe><iframe id=if2 srcdoc="<p>inner</p>"></iframe>`],
  ['history.back', `<p>hb</p><script>setTimeout(()=>history.back(),100)</script>`],
  ['parent postMessage flood', `<script>for(var i=0;i<5000;i++)parent.postMessage({__hcConsole:true,nonce:1,level:'log',text:'x'+i},'*');document.body.innerHTML='flooded'</script>`],
];
const { b, p, errs, ctx } = await open();
const popups = []; ctx.on('page', pg => popups.push('P')); 
for (const [name, code] of CASES) {
  popups.length = 0; errs.length = 0;
  await setCode(p, code); await p.waitForTimeout(1500);
  if (name.includes('click')) { const fr = p.frames().find(f => f.url() === 'about:srcdoc'); try { await fr.click('#b'); } catch(e){ console.log('clickerr', e.message.slice(0,80)); } await p.waitForTimeout(1200); }
  const frs = p.frames().map(f => f.url());
  const fr = p.frames().find(f => f.url() === 'about:srcdoc' && f.parentFrame() === p.mainFrame());
  let inner = null; try { inner = await fr.evaluate(() => document.body.innerText.slice(0,150) + ' | ' + document.readyState); } catch (e) { inner = 'ERR ' + e.message.slice(0,80); }
  console.log(name, JSON.stringify({ url: p.url(), inner, frames: frs, popups: popups.length, errs: errs.map(e=>e.slice(0,110)) }));
}
await shot(p, 'shot-sec-media.png');
await b.close();
