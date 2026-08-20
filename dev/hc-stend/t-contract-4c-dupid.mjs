import { open, mount, setCode, chips } from './t-contract-lib.mjs';
const { b, p, take } = await open();
await mount(p, "({ task:{ title:'X', files:[{name:'app.js',lang:'js',starter:'console.log(7)'}], requirements:[{id:'l',label:'log 7',check:C.logs('7')},{id:'l',label:'log 9',check:C.logs('9')}] } })");
await p.waitForTimeout(1500);
console.log('takror id (l,l): chips=', JSON.stringify(await chips(p)), 'log=', take().map(x=>x.slice(0,80)));
await b.close();
