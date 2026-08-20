// K-K 1: kontrakt — proplar chegaraviy hollari
import { open, mount, unmount, setCode, val, chips, state, events, rerender, R } from './t-contract-lib.mjs';
const { b, p, take } = await open();
const mk = async (props, opts) => { await mount(p, props, opts); const st = await state(p); const ch = await chips(p); return { st, ch, log: take() }; };
const nextTitle = () => p.$eval('.hc-next', e => e.title);

let r = await mk('({})');
console.log('A default:', r.st.title, r.st.count, r.st.tabs, JSON.stringify(r.st.placeholder), 'code=', JSON.stringify(await val(p)), r.log);
r = await mk("({ task: { title: 'B', requirements: [] } })");
console.log('B reqs=[]:', r.st.count, 'nextDisabled=', r.st.nextDisabled, 'status=', r.st.status, 'nextTitle=', await nextTitle(), r.log);
r = await mk("({ task: { title: 'C' } })");
console.log('C no reqs:', r.st.count, 'nextDisabled=', r.st.nextDisabled, r.log);
r = await mk("({ task: { title: 'D', files: [], requirements: [] }, starterCode: '<p>D</p>' })");
console.log('D files=[]:', r.st.tabs, 'code=', JSON.stringify(await val(p)), r.log);
r = await mk("({ task: { title: 'E', files: [{ name: 'a.html', lang: 'html', starter: 'ONE' }, { name: 'a.html', lang: 'css', starter: 'TWO' }], requirements: [] } })");
console.log('E dup names:', r.st.tabs, 'code=', JSON.stringify(await val(p)), 'log=', r.log);
await p.click('.hc-tab:nth-child(2)'); await p.waitForTimeout(100); console.log('   E after click tab2: code=', JSON.stringify(await val(p)), 'active=', await p.$$eval('.hc-tab.active', e => e.length));
r = await mk("({ lang: 'en' })"); console.log('F lang=en:', r.st.title, r.st.nextText, r.log);
r = await mk("({ lang: undefined })"); console.log('F lang=undefined:', r.st.title, r.log);
r = await mk("({ lang: 'ru' })"); console.log('F lang=ru:', r.st.title, r.st.nextText, JSON.stringify(r.st.placeholder), r.log);
r = await mk("({ lang: 'RU' })"); console.log('F lang=RU:', r.st.title, r.log);
r = await mk("({ starterCode: '<p>STARTER</p>', task: { title: 'G', requirements: [], files: [{ name: 'index.html', lang: 'html', starter: '<p>FILES</p>' }] } })");
console.log('G starter+files:', JSON.stringify(await val(p)), r.log);
r = await mk("({ starterCode: '<p>STARTER</p>', task: { title: 'G2', requirements: [], files: [] } })");
console.log('G2 starter+files=[]:', JSON.stringify(await val(p)), r.log);
r = await mk("({ lang:'ru', starterCode: {uz:'UZ-S', ru:'RU-S'}, task: { title: 'G3', requirements: [] } })");
console.log('G3 starterCode={uz,ru} lang=ru:', JSON.stringify(await val(p)), r.log);
// H: onContinue yo'q
r = await mk("({ onContinue: undefined, task: { title: 'H', requirements: [{ id:'h1', label:'h1', check: C.has('h1') }] } })");
await setCode(p, '<h1>x</h1>'); await p.waitForTimeout(400);
console.log("H onContinue yo'q: nextDisabled=", (await state(p)).nextDisabled);
await p.click('.hc-next'); await p.waitForTimeout(100); console.log('   H click -> events=', JSON.stringify(await events(p)), 'log=', take());
r = await mk("({ task: { title: 'H2', files:[{name:'index.html',lang:'html',starter:''},{name:'style.css',lang:'css',starter:'a{}'}], requirements: [{ id:'h1', label:'h1', check: C.has('h1') }] } })");
await setCode(p, '<h1>x</h1>'); await p.waitForTimeout(400); await p.click('.hc-next'); await p.waitForTimeout(100);
console.log('H2 payload=', JSON.stringify(await events(p)));
r = await mk("({ onBack: undefined, task: { title: 'I', requirements: [] } })");
console.log("I onBack yo'q: firstBottom=", JSON.stringify(r.st.firstBottom), r.log);
r = await mk("({ lang:'ru', task: { eyebrow: h('b', null, 'JSX-EYE'), title: {uz:'UZ-T', ru:'RU-T'}, brief: 'STR-BRIEF', requirements: [] } })");
console.log('J JSX/obj/str:', r.st.eyebrow, r.st.title, r.st.brief, r.log);
r = await mk("({ lang:'ru', task: { eyebrow: {uz:'E-UZ'}, title: {ru:'only-ru'}, brief: {uz:'', ru:''}, requirements: [] } })");
console.log('J2 partial:', JSON.stringify(r.st.eyebrow), r.st.title, JSON.stringify(r.st.brief), r.log);
r = await mk("({ task: { requirements: [] } })");
console.log("J3 title yo'q:", JSON.stringify(r.st.title), 'eyebrow=', r.st.eyebrow, r.log);
r = await mk("({ task: { title: 0, brief: 0, eyebrow: 0, requirements: [] } })");
console.log('J4 title=0 (raqam):', JSON.stringify(r.st.title), JSON.stringify(r.st.brief), r.log);
r = await mk("({ lang:'ru', task: { title:'P', previewUrl: {uz:'sayt.uz', ru:'sait.ru'}, requirements: [] } })");
console.log('P previewUrl obj:', r.st.url, r.st.paneName, r.log);
r = await mk("({ task: { title:'L', requirements: [ { check: C.has('h1') }, { check: C.has('p') }, { label: h('i',null,'JSX-LBL'), check: C.has('a') } ] } })");
console.log('L labels:', JSON.stringify(r.ch), r.log);
// K: task har renderda YANGI obyekt (inline) — ota 300ms da qayta-render; runtime shart bilan
r = await mk("({ })", "({ rerenderMs: 300, inlineTask: { title:'K', files:[{name:'app.js',lang:'js',starter:'console.log(1)'}], requirements: [ { id:'l', label:'log 1', check: C.logs('1') }, { id:'s', label:'src', check: C.js(/console/) } ] } })");
const probe = () => p.evaluate(async () => {
  const fr = document.querySelector('iframe[title="tekshiruv"]'); let n = 0, flick = 0; let last = fr && fr.getAttribute('srcdoc');
  const chip = document.querySelector('.hc-chip'); let lastOk = chip.classList.contains('ok');
  const t0 = Date.now(); while (Date.now() - t0 < 3000) { await new Promise(r => setTimeout(r, 20)); const f = document.querySelector('iframe[title="tekshiruv"]'); const s = f && f.getAttribute('srcdoc'); if (s !== last) { n++; last = s; } const ok = document.querySelector('.hc-chip').classList.contains('ok'); if (ok !== lastOk) { flick++; lastOk = ok; } }
  return { checkIframeReloads: n, chipFlicker: flick, renders: window.__renders };
});
console.log('K inline task rerender 300ms -> 3s ichida:', JSON.stringify(await probe()), 'chips=', JSON.stringify(await chips(p)), take());
r = await mk("({ task: { title:'K2', files:[{name:'app.js',lang:'js',starter:'console.log(1)'}], requirements: [ { id:'l', label:'log 1', check: C.logs('1') } ] } })", "({ rerenderMs: 300 })");
console.log('K2 nazorat (barqaror task) 3s:', JSON.stringify(await probe()), 'chips=', JSON.stringify(await chips(p)), take());
await b.close();
