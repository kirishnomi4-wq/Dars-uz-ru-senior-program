import { open, mount, setCode, chips } from './t-contract-lib.mjs';
const { b, p, take } = await open();
const T = (starter) => `({ task:{ title:'X', files:[{name:'app.js',lang:'js',starter:'${starter}'}], requirements:[{id:'l',label:'log 7',check:C.logs('7')}] } })`;
await mount(p, T('console.log(1)'), '({})', 'A');
await mount(p, T('console.log(7)'), '({})', 'B');
await p.waitForTimeout(1500);
console.log('A (log 1 — qizil kutiladi):', JSON.stringify(await chips(p, 'A')));
console.log('B (log 7 — yashil kutiladi):', JSON.stringify(await chips(p, 'B')));
// B ga yozamiz (nonce 2), A tegilmaydi (nonce 1)
await setCode(p, 'console.log(8)', 'B'); await p.waitForTimeout(1500);
console.log('B log 8 → B:', JSON.stringify(await chips(p, 'B')), 'A:', JSON.stringify(await chips(p, 'A')));
// A ga yozamiz (nonce 2 → B'ning 2 bilan bir xil), B'ga yozamiz keyin
await setCode(p, 'console.log(2)', 'A'); await p.waitForTimeout(400); await setCode(p, 'console.log(7)', 'B'); await p.waitForTimeout(1500);
console.log('A nonce2 log2, B nonce3 log7 → A:', JSON.stringify(await chips(p, 'A')), 'B:', JSON.stringify(await chips(p, 'B')));
// konsol satrlari ham aralashadimi
console.log('A console:', JSON.stringify(await p.$$eval('#A .hc-console-line', e => e.map(x => x.textContent))), 'B console:', JSON.stringify(await p.$$eval('#B .hc-console-line', e => e.map(x => x.textContent))), take());
await b.close();
