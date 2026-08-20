import { open, mount, setCode, chips, state } from './t-contract-lib.mjs';
const { b, p, take } = await open();
await mount(p, "({ task:{ title:'X', files:[{name:'app.js',lang:'js',starter:'// boshi'}], requirements:[{id:'l',label:'log 7',check:C.logs('7')},{id:'e',label:'x=1',check:C.evalEquals('x','1')}] } })");
await setCode(p, "setTimeout(()=>{for(let n=1;n<50;n++)parent.postMessage({__hcReport:true,nonce:n,results:{l:true,e:true}},'*');},600);"); await p.waitForTimeout(1500);
console.log('spoof (log 7 yo\'q, x yo\'q):', JSON.stringify(await chips(p)), 'nextDisabled=', (await state(p)).nextDisabled, take());
await b.close();
