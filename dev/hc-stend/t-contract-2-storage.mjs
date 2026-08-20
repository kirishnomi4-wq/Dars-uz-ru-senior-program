// K-K 2: holat-saqlov (storageKey / localStorage)
import { open, mount, unmount, setCode, val, chips, state, ls, R } from './t-contract-lib.mjs';
const { b, p, take } = await open();
const T1 = "({ storageKey:'k1', starterCode:'<p>S1</p>', task:{ title:'S', requirements:[] } })";

// 1) yoz → unmount → mount: tiklanadimi
await mount(p, T1); await setCode(p, '<h1>yozdim</h1>'); await p.waitForTimeout(600); await unmount(p);
console.log('1 saqlov:', JSON.stringify(await ls(p)));
await mount(p, T1); console.log('1 tiklandi:', JSON.stringify(await val(p)), take());

// 2) starter O'ZGARDI (dars yangilandi) — eski saqlov ustunmi?
await unmount(p); await mount(p, "({ storageKey:'k1', starterCode:'<p>S2-YANGI</p>', task:{ title:'S', requirements:[] } })");
console.log('2 starter o\'zgardi → kod=', JSON.stringify(await val(p)));

// 3) fayllar to'plami o'zgardi → tashlanadimi
await unmount(p); await mount(p, "({ storageKey:'k1', task:{ title:'S', files:[{name:'index.html',lang:'html',starter:'A'},{name:'style.css',lang:'css',starter:'B'}], requirements:[] } })");
console.log('3 fayl to\'plami o\'zgardi → kod=', JSON.stringify(await val(p)), 'tabs=', (await state(p)).tabs);
// 3b) bir xil nomlar, boshqa tartib/lang
await p.evaluate(() => localStorage.setItem('k3', JSON.stringify({ codes: { 'style.css': 'CSS-SAVED', 'index.html': 'HTML-SAVED' }, savedAt: Date.now() })));
await unmount(p); await mount(p, "({ storageKey:'k3', task:{ title:'S', files:[{name:'index.html',lang:'html',starter:'A'},{name:'style.css',lang:'css',starter:'B'}], requirements:[] } })");
console.log('3b tartib boshqa, nomlar bir xil → kod=', JSON.stringify(await val(p)));

// 4) savedAt TTL: 3 oy oldingi
await p.evaluate(() => localStorage.setItem('k4', JSON.stringify({ codes: { 'index.html': 'ESKI-3-OY' }, savedAt: Date.now() - 90 * 864e5 })));
await unmount(p); await mount(p, "({ storageKey:'k4', task:{ title:'S', requirements:[] } })");
console.log('4 savedAt 3 oy → kod=', JSON.stringify(await val(p)));
// 4b) savedAt yo'q / buzuq JSON / codes qiymati string emas
await p.evaluate(() => { localStorage.setItem('k5', '{oops'); localStorage.setItem('k6', JSON.stringify({ codes: { 'index.html': 123 } })); localStorage.setItem('k7', JSON.stringify({ codes: { 'index.html': null } })); localStorage.setItem('k8', JSON.stringify({ codes: { 'index.html': { a: 1 } } })); localStorage.setItem('k9', JSON.stringify([1,2])); });
for (const k of ['k5', 'k6', 'k7', 'k8', 'k9']) { await unmount(p); try { await mount(p, `({ storageKey:'${k}', task:{ title:'S', requirements:[] } })`); console.log(`4b ${k} → kod=`, JSON.stringify(await val(p)), 'hl=', (await p.$eval('.hc-hl', e => e.textContent)).slice(0, 30), take()); } catch (e) { console.log(`4b ${k} → CRASH`, e.message.slice(0, 120), take()); } }

// 5) localStorage to'lgan / o'chirilgan → xato tashlamaydimi
await unmount(p);
await p.evaluate(() => { const orig = Storage.prototype.setItem; window.__origSet = orig; Storage.prototype.setItem = function () { throw new DOMException('QuotaExceededError', 'QuotaExceededError'); }; });
await mount(p, T1); await setCode(p, '<h1>quota</h1>'); await p.waitForTimeout(700);
console.log('5 quota throw → log=', take(), 'kod=', JSON.stringify(await val(p)));
await p.evaluate(() => { Storage.prototype.setItem = window.__origSet; });
// 5b) localStorage umuman yo'q (getter throw — Safari private eski / sandbox iframe)
await unmount(p);
await p.evaluate(() => { window.__lsDesc = Object.getOwnPropertyDescriptor(window, 'localStorage'); Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('SecurityError', 'SecurityError'); } }); });
try { await mount(p, T1); await setCode(p, '<h1>nols</h1>'); await p.waitForTimeout(700); console.log('5b localStorage getter throw → OK, log=', take()); } catch (e) { console.log('5b localStorage getter throw → CRASH', e.message.slice(0, 100), take()); }
await p.evaluate(() => { Object.defineProperty(window, 'localStorage', window.__lsDesc); });

// 6) 400ms debounce: yozib 100ms ichida unmount
await unmount(p); await p.evaluate(() => localStorage.clear());
await mount(p, T1); await setCode(p, '<h1>abc</h1>'); await p.waitForTimeout(600);
await p.keyboard.type('XYZ'); await p.waitForTimeout(100); await unmount(p);
console.log('6 debounce 100ms → saqlov=', JSON.stringify(await ls(p)));

// 7) «Qaytadan» (2 bosish) saqlovni tozalaydimi
await mount(p, T1); await setCode(p, '<h1>reset-oldi</h1>'); await p.waitForTimeout(600);
await p.click('.hc-bottom .hc-ghost:not(:first-child)'); await p.waitForTimeout(100); await p.click('.hc-bottom .hc-ghost.armed'); await p.waitForTimeout(600);
console.log('7 Qaytadan → kod=', JSON.stringify(await val(p)), 'saqlov=', JSON.stringify(await ls(p)));
// 7b) Qaytadan → 100ms ichida unmount (Qaytarish tugmasi bilan yo'qoladi?)
await mount(p, T1); await setCode(p, '<h1>reset-oldi-2</h1>'); await p.waitForTimeout(600);
await p.click('.hc-bottom .hc-ghost:not(:first-child)'); await p.waitForTimeout(100); await p.click('.hc-bottom .hc-ghost.armed'); await p.waitForTimeout(100); await unmount(p);
console.log('7b Qaytadan+100ms unmount → saqlov=', JSON.stringify(await ls(p)));
// 7c) Qaytadan → 500ms → unmount (Qaytarish tugmasi ko'rinib turgan holda)
await mount(p, T1); await setCode(p, '<h1>reset-oldi-3</h1>'); await p.waitForTimeout(600);
await p.click('.hc-bottom .hc-ghost:not(:first-child)'); await p.waitForTimeout(100); await p.click('.hc-bottom .hc-ghost.armed'); await p.waitForTimeout(500); await unmount(p);
console.log('7c Qaytadan+500ms unmount → saqlov=', JSON.stringify(await ls(p)));

// 8) storageKey o'zgarsa (bir xil mount ichida) — kod almashadimi
await unmount(p); await p.evaluate(() => { localStorage.setItem('kA', JSON.stringify({ codes: { 'index.html': 'A-KOD' } })); localStorage.setItem('kB', JSON.stringify({ codes: { 'index.html': 'B-KOD' } })); });
await mount(p, "({ storageKey:'kA', task:{ title:'S', requirements:[] } })");
await p.evaluate(() => window.rerenderAt('root', { storageKey: 'kB', task: { title: 'S', requirements: [] } })); await p.waitForTimeout(600);
console.log('8 storageKey kA→kB rerender → kod=', JSON.stringify(await val(p)), 'kB=', await p.evaluate(() => localStorage.getItem('kB')));

// 9) storageKey yo'q → hech narsa saqlanmaydi (kutilgan) — lekin hcFont/hcSplit global
await unmount(p); await p.evaluate(() => localStorage.clear());
await mount(p, "({ task:{ title:'S', requirements:[] } })"); await setCode(p, 'x'); await p.waitForTimeout(600);
console.log('9 storageKey yo\'q → ls=', JSON.stringify(await ls(p)));

// 10) saqlangan qiymat hajmi: 5 MB kod → quota
await unmount(p); await p.evaluate(() => localStorage.clear());
await mount(p, T1);
await p.evaluate(() => { const ta = document.querySelector('.hc-code'); const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; setter.call(ta, 'x'.repeat(3 * 1024 * 1024)); ta.dispatchEvent(new Event('input', { bubbles: true })); });
await p.waitForTimeout(1500); console.log('10 3MB kod → ls kalitlari=', Object.keys(await ls(p)), 'log=', take());
await b.close();
