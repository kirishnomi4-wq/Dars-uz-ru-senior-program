import { open, mount, unmount, setCode, val, state, ls, rerender } from './t-contract-lib.mjs';
const { b, p, take } = await open();
await p.evaluate(() => { localStorage.setItem('kA', JSON.stringify({ codes: { 'index.html': 'A-KOD' } })); localStorage.setItem('kB', JSON.stringify({ codes: { 'index.html': 'B-KOD' } })); });
await mount(p, "({ storageKey:'kA', task:{ title:'S', requirements:[] } })");
await p.evaluate(() => { window.__renders = 0; });
await rerender(p, "({ storageKey:'kB', task:{ title:'S', requirements:[] } })"); await p.waitForTimeout(600);
console.log('8 storageKey kA→kB (haqiqiy rerender, renders=' + await p.evaluate(() => window.__renders) + ') → kod=', JSON.stringify(await val(p)), 'kB=', await p.evaluate(() => localStorage.getItem('kB')), take());
await b.close();
