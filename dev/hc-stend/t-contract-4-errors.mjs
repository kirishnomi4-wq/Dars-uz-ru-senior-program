// K-K 4: xatoga chidamlilik + StrictMode
import { open, mount, unmount, setCode, val, chips, state, events } from './t-contract-lib.mjs';
const { b, p, take } = await open();
const tryMount = async (name, props, opts) => {
  try { await mount(p, props, opts); const s = await state(p); const c = await chips(p); console.log(`${name}: OK`, JSON.stringify({ count: s.count, chips: c, tabs: s.tabs, next: s.nextDisabled }), 'log=', take()); return true; }
  catch (e) { console.log(`${name}: CRASH`, take().slice(0, 2)); return false; }
};
await tryMount('1 check throw', "({ task:{ title:'x', requirements:[{id:'x',label:'x',check:()=>{throw new Error('boom')}}] } })");
await setCode(p, '<h1>a</h1>'); await p.waitForTimeout(400); console.log('   yozgandan keyin:', JSON.stringify(await chips(p)), take());
await tryMount('1b check throw ISHGA TUSHIRISH (runtime eval throw)', "({ task:{ title:'x', files:[{name:'app.js',lang:'js',starter:'throw new Error(\"boom\")'}], requirements:[{id:'x',label:'x',check:C.evalEquals('undefinedVar.x','1')}] } })");
await p.waitForTimeout(1200); console.log('   1b 1.2s keyin:', JSON.stringify(await chips(p)), take());
await tryMount('2 check string (funksiya emas)', "({ task:{ title:'x', requirements:[{id:'x',label:'x',check:'C.has(h1)'}] } })");
await tryMount('3 requirements[0]=null', "({ task:{ title:'x', requirements:[null] } })");
await tryMount('3b requirements = obyekt (massiv emas)', "({ task:{ title:'x', requirements:{a:1} } })");
await tryMount('3c requirements = string', "({ task:{ title:'x', requirements:'h1' } })");
await tryMount('4 task=null', "({ task:null })");
await tryMount('4b task=\"str\"', "({ task:'x' })");
await tryMount('5 files[0] name yo\'q', "({ task:{ title:'x', files:[{lang:'html',starter:'<p>a</p>'}], requirements:[] } })");
await tryMount('5b files[0] lang yo\'q', "({ task:{ title:'x', files:[{name:'a.txt',starter:'<p>a</p>'}], requirements:[{id:'h',label:'p',check:C.has('p')}] } })");
await tryMount('5c files = obyekt', "({ task:{ title:'x', files:{name:'a'}, requirements:[] } })");
await tryMount('5d files=[null]', "({ task:{ title:'x', files:[null], requirements:[] } })");
await tryMount('6 starter = funksiya', "({ task:{ title:'x', files:[{name:'index.html',lang:'html',starter:()=>'<p>f</p>'}], requirements:[] } })");
console.log('   kod=', JSON.stringify(await val(p)));
await tryMount('6b starter = raqam', "({ task:{ title:'x', files:[{name:'index.html',lang:'html',starter:42}], requirements:[] } })");
await tryMount('6c starterCode = raqam', "({ starterCode: 42, task:{ title:'x', requirements:[] } })");
await tryMount('7 check {uz,ru} obyekt qaytaradi (hint yo\'qoladimi)', "({ lang:'ru', task:{ title:'x', requirements:[{id:'x',label:'x',check:()=>({uz:'UZ-MASLAHAT',ru:'RU-MASLAHAT'})}] } })");
await tryMount('7b check false + hint {uz,ru}', "({ lang:'ru', task:{ title:'x', requirements:[{id:'x',label:'x',hint:{uz:'UZ-H',ru:'RU-H'},check:()=>false}] } })");
await tryMount('7c check JSX qaytaradi', "({ task:{ title:'x', requirements:[{id:'x',label:'x',check:()=>h('b',null,'JSX-HINT')}] } })");
await tryMount('7d check 1 (truthy, true emas) qaytaradi', "({ task:{ title:'x', requirements:[{id:'x',label:'x',check:()=>1}] } })");
await tryMount('7e check Promise qaytaradi (async)', "({ task:{ title:'x', requirements:[{id:'x',label:'x',check:async()=>true}] } })");
await tryMount('8 previewCss raqam / previewUrl JSX', "({ task:{ title:'x', previewCss: 5, previewUrl: h('i',null,'jsx-url'), requirements:[] } })");
await tryMount('9 label = null, id = 0', "({ task:{ title:'x', requirements:[{id:0,label:null,check:C.has('h1')},{id:'',label:undefined,check:C.has('p')}] } })");
await tryMount('10 runtime + files JS yo\'q (html faqat) — logs sharti', "({ task:{ title:'x', requirements:[{id:'l',label:'log',check:C.logs('1')}] } })");
await setCode(p, '<script>console.log(1)</script>'); await p.waitForTimeout(1200); console.log('   1.2s:', JSON.stringify(await chips(p)), take());

// StrictMode: effektlar 2 marta — konsol satrlari ikkilanadimi, message-listener ikki marta qo'shiladimi
await mount(p, "({ task:{ title:'S', files:[{name:'app.js',lang:'js',starter:'console.log(\"salom\")'}], requirements:[{id:'l',label:'log',check:C.logs('salom')}] } })", "({ strict:true })");
await p.waitForTimeout(1500);
const cons = await p.$$eval('.hc-console-line', els => els.map(e => e.textContent));
console.log('StrictMode: konsol satrlari=', JSON.stringify(cons), 'chips=', JSON.stringify(await chips(p)), 'listeners(message)=', await p.evaluate(() => (typeof getEventListeners === 'function' ? getEventListeners(window).message?.length : 'n/a')), take());
await p.click('.hc-mini'); await p.waitForTimeout(800);
console.log('StrictMode ▶ keyin konsol=', JSON.stringify(await p.$$eval('.hc-console-line', els => els.map(e => e.textContent))));
// StrictMode: yozish + saqlov
await mount(p, "({ storageKey:'SM', task:{ title:'S', requirements:[] } })", "({ strict:true })");
await setCode(p, '<p>strict</p>'); await p.waitForTimeout(600); console.log('StrictMode saqlov=', await p.evaluate(() => localStorage.getItem('SM')), take());
await b.close();
