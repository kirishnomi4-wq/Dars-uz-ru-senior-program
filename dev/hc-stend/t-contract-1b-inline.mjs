// K-K 1b: inline task (har renderda yangi) + ota qayta-render tez (250ms) — runtime shart yashil bo'ladimi?
import { open, mount, setCode, chips, R } from './t-contract-lib.mjs';
const { b, p, take } = await open();
for (const ms of [250, 400, 1000]) {
  await mount(p, "({ })", `({ rerenderMs: ${ms}, inlineTask: { title:'K', files:[{name:'app.js',lang:'js',starter:'// boshi'}], requirements: [ { id:'l', label:'log 7', check: C.logs('7') } ] } })`);
  await setCode(p, 'console.log(7)');
  const t0 = Date.now(); let ok = false, hints = new Set();
  while (Date.now() - t0 < 6000) { const c = await chips(p); hints.add(c[0].hint); if (c[0].ok) { ok = true; break; } await p.waitForTimeout(100); }
  console.log(`rerender=${ms}ms → yashil=${ok} (${Date.now() - t0}ms), hintlar=${JSON.stringify([...hints])}`, take());
}
// nazorat: barqaror task, rerender 250
await mount(p, "({ task: { title:'K', files:[{name:'app.js',lang:'js',starter:'// boshi'}], requirements: [ { id:'l', label:'log 7', check: C.logs('7') } ] } })", "({ rerenderMs: 250 })");
await setCode(p, 'console.log(7)');
{ const t0 = Date.now(); let ok = false; while (Date.now() - t0 < 6000) { const c = await chips(p); if (c[0].ok) { ok = true; break; } await p.waitForTimeout(100); } console.log(`nazorat barqaror task rerender=250 → yashil=${ok} (${Date.now() - t0}ms)`); }
// sinxron shart (C.has) inline: yashil bo'ladimi (results useMemo reqs ga bog'liq — har render qayta hisob)
await mount(p, "({ })", "({ rerenderMs: 250, inlineTask: { title:'K', requirements: [ { id:'h', label:'h1', check: C.has('h1') } ] } })");
await setCode(p, '<h1>a</h1>'); await p.waitForTimeout(600); console.log('inline sinxron shart:', JSON.stringify(await chips(p)));
await b.close();
