// K-K 3: modul-global __lang — ikki kompilyator, til almashish, handler ichidagi tr()
import { open, mount, unmount, setCode, val, chips, state, rerender } from './t-contract-lib.mjs';
const { b, p, take } = await open();
const TASK = (t) => `({ lang:'${t}', task:{ title:{uz:'UZ-SARLAVHA',ru:'RU-ZAGOLOVOK'}, files:[{name:'index.html',lang:'html',starter:{uz:'<!-- UZ starter -->',ru:'<!-- RU starter -->'}}], requirements:[{id:'h',label:{uz:'h1 (uz)',ru:'h1 (ru)'},check:C.has('h1')}] } })`;

// A) ikki root: A=uz, B=ru bir sahifada
await mount(p, TASK('uz'), '({})', 'A'); await mount(p, TASK('ru'), '({})', 'B');
const st = async (id) => { const s = await state(p, id); const c = await chips(p, id); return { title: s.title, next: s.nextText, code: await val(p, id), chip: c[0].label, hint: c[0].hint, status: s.status }; };
console.log('A(uz) after B(ru) mounted:', JSON.stringify(await st('A')));
console.log('B(ru):', JSON.stringify(await st('B')));
// A ga yozamiz → A qayta render bo'ladi → __lang=uz; B ga tegmaymiz. Keyin B'da hint (chip title) qaysi tilda?
await setCode(p, '<p>x</p>', 'A'); await p.waitForTimeout(500);
console.log('A yozildi (uz):', JSON.stringify(await st('A')));
console.log('B tegilmadi — hint tili?:', JSON.stringify(await st('B')));
// Endi B'da «Qaytadan» 2 bosish (event-handler ichida tr(f.starter)) — oxirgi render A(uz) bo'lgan → B starteri qaysi tilda?
await setCode(p, '<p>x</p>', 'A'); await p.waitForTimeout(300);   // A oxirgi render bo'lsin
await p.click('#B .hc-bottom .hc-ghost:not(:first-child)'); await p.waitForTimeout(80); await p.click('#B .hc-bottom .hc-ghost.armed'); await p.waitForTimeout(200);
console.log('B Qaytadan (A oxirgi render edi) → B kodi=', JSON.stringify(await val(p, 'B')), 'B status=', (await state(p, 'B')).status);
// A ga yozamiz, so'ng B'da HTML linter xabari (useMemo render vaqtida) — B render qilinmaguncha eski
await setCode(p, '<h1>bad', 'B'); await p.waitForTimeout(1200);
console.log('B linter xabari (ru kutiladi):', (await state(p, 'B')).msg);
await unmount(p, 'A'); await unmount(p, 'B');

// B) til almashish (bir root, rerender lang uz→ru): starter/kod qanday
await mount(p, TASK('uz')); console.log('uz mount:', JSON.stringify(await st('root')));
await rerender(p, TASK('ru')); await p.waitForTimeout(300);
console.log('rerender ru → ', JSON.stringify(await st('root')));
// Qaytadan (ru rejimda) → starter qaysi tilda?
await p.click('.hc-bottom .hc-ghost:not(:first-child)'); await p.waitForTimeout(80); await p.click('.hc-bottom .hc-ghost.armed'); await p.waitForTimeout(200);
console.log('ru rejimda Qaytadan → kod=', JSON.stringify(await val(p)));
// C) starterCode {uz,ru} + storageKey: uz'da saqlab, ru bilan qayta ochish → tarjima emas, saqlangan (kutilgan)
await unmount(p); await p.evaluate(() => localStorage.clear());
await mount(p, "({ lang:'uz', storageKey:'L', starterCode:{uz:'UZ-S',ru:'RU-S'}, task:{title:'x',requirements:[]} })"); await p.waitForTimeout(600); await unmount(p);
await mount(p, "({ lang:'ru', storageKey:'L', starterCode:{uz:'UZ-S',ru:'RU-S'}, task:{title:'x',requirements:[]} })");
console.log('C uz saqlandi → ru ochildi → kod=', JSON.stringify(await val(p)), '(o\'quvchi hech narsa yozmagan edi, lekin uz-starter saqlangan)');
console.log('log:', take());
await b.close();
