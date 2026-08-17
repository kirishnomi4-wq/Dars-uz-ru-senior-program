// №14: K-P-06 (500 satr + hisoblagich + scroll-lock), K-P-07=K-C-16 (obyekt ko'rinishi, chuqurlik/circular/limit),
// K-P-16 (debug/dir/group/table/clear; clear harness-chipga tegmaydi — K-C-11 zanjiri)
import { open } from './tc-lib.mjs';
const { b, p } = await open();
const lines = () => p.$$eval('.hc-console-line', els => els.map(e => e.textContent.trim()));
const panel = () => p.$eval('.hc-console-body', e => ({ st: e.scrollTop, sh: e.scrollHeight, ch: e.clientHeight, n: e.querySelectorAll('.hc-console-line').length }));
const count = () => p.$eval('.hc-console-count', e => e.textContent.trim()).catch(() => '');
const newBtn = () => p.$eval('.hc-console-new', e => e.textContent.trim()).catch(() => '');
const chips = () => p.$$eval('.hc-chip', els => els.map(e => (e.classList.contains('ok') ? '✓' : '✗') + e.textContent.trim().slice(0, 30)));
const atBottom = (P) => P.sh - P.st - P.ch < 8;
const mount = async (js, req = [{ id: 'r', label: 'log salom', logs: 'salom' }], lang = 'uz') => {
  await p.evaluate(({ js, req, lang }) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = '';
    window.mountHC({ lang, task: { title: 't', requirements: req, files: [
      { name: 'index.html', lang: 'html', starter: '<h1 id="p" class="big">x</h1>' }, { name: 'style.css', lang: 'css', starter: '' }, { name: 'script.js', lang: 'js', starter: js } ] } }); }, { js, req, lang });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1600);
};
let bad = 0; const T = (ok, label, info = '') => { if (!ok) bad++; console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [${label}] ${info}`); };

// ── K-P-06
await mount('for (let i = 1; i <= 800; i++) console.log("qator", i);');
let L = await lines(), P = await panel(), C = await count();
T(L.length === 500 && L.at(-1) === '›qator 800' && L[0] === '›qator 301', 'limit 500: oxirgi 500 saqlanadi', `n=${L.length} birinchi="${L[0]}" oxirgi="${L.at(-1)}"`);
T(/^500 · eng eski 300 yashirildi$/.test(C), 'hisoblagich «500 · eng eski 300 yashirildi»', `"${C}"`);
T(atBottom(P), 'auto-scroll: pastda', `st=${P.st} sh=${P.sh} ch=${P.ch}`);
await mount('setInterval(() => console.log("tick"), 10);'); await p.waitForTimeout(1200); P = await panel();
T(P.sh - P.st - P.ch < 60 && P.n > 50, 'setInterval: yangi loglar ko\'rinadi (pastda)', `n=${P.n} st=${P.st} sh=${P.sh}`);
await mount('for (let i = 1; i <= 60; i++) console.log("eski", i);\nsetTimeout(() => { for (let i = 1; i <= 30; i++) console.log("yangi", i); }, 2600);');
await p.$eval('.hc-console-body', e => { e.scrollTop = 0; e.dispatchEvent(new Event('scroll')); });   // o'quvchi tepaga surdi
await p.waitForTimeout(2000); P = await panel(); let NB = await newBtn();
T(P.st === 0 && P.n === 90 && /↓ yangi 30/.test(NB), 'scroll-lock: tepada o\'qiyotganda surilmaydi + «↓ yangi 30»', `st=${P.st} n=${P.n} tugma="${NB}"`);
await p.click('.hc-console-new'); await p.waitForTimeout(200); P = await panel(); NB = await newBtn();
T(atBottom(P) && NB === '', '«↓ yangi» bosilsa pastga, tugma yo\'qoladi', `st=${P.st} sh=${P.sh} tugma="${NB}"`);
await mount('for (let i = 1; i <= 60; i++) console.log("eski", i);\nsetTimeout(() => { for (let i = 1; i <= 30; i++) console.log("yangi", i); }, 2600);');
await p.$eval('.hc-console-body', e => { e.scrollTop = 0; e.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(1800);
await p.$eval('.hc-console-body', e => { e.scrollTop = e.scrollHeight; e.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(200); NB = await newBtn();
T(NB === '', 'o\'quvchi o\'zi pastga surdi → «yangi» o\'chadi, lock qaytadi', `tugma="${NB}"`);
await mount('setInterval(() => console.log("tick"), 10);'); await p.waitForTimeout(600); const c1 = await count();
await mount('setInterval(() => console.log("tick"), 10);', undefined, 'ru'); await p.waitForTimeout(400); await p.waitForTimeout(400); const cr = await count();
T(/^\d+$/.test(c1) && /^\d+/.test(cr), 'hisoblagich (dropped=0) faqat son', `uz="${c1}" ru="${cr}"`);

// ── K-P-07 / K-C-16
await mount(`try{JSON.parse("{bad")}catch(e){console.error(e);console.log("xato:",e)}
console.log(new Map([[1,2]]), new Set([1]), new Date(0), document.body, document.getElementById("p"), [undefined,null], {u:undefined}, 5n);
const o={a:1};o.self=o;console.log(o);
console.log('%s dunyo, %d yosh', 'salom', 13);
const deep={l1:{l2:{l3:{l4:{l5:'chuqur'}}}}};console.log(deep);
const big=[];for(let i=0;i<20000;i++)big.push({i,name:'x'+i});console.log(big);
console.log(function f(){}, Symbol('s'), null, undefined, NaN, -0, "matn", ["ichki", 1]);
const m=new Map();for(let i=0;i<70;i++)m.set(i,i);console.log(m);`);
L = await lines();
T(/^›SyntaxError: /.test(L[0]) && /^›xato: SyntaxError: /.test(L[1]), 'Error → name: message', `"${L[0]?.slice(0, 60)}"`);
T(L[2] === '›Map(1) {1 => 2} Set(1) {1} 1970-01-01T00:00:00.000Z <body> <h1 id="p" class="big"> [undefined, null] {u: undefined} 5n', 'Map/Set/Date/DOM/undefined/bigint', `"${L[2]}"`);
T(L[3] === '›{a: 1, self: [Circular]}', 'circular → [Circular]', `"${L[3]}"`);
T(L[4] === '›salom dunyo, 13 yosh', '%s/%d format', `"${L[4]}"`);
T(L[5] === '›{l1: {l2: {l3: {…}}}}', 'chuqurlik 3 → {…}', `"${L[5]}"`);
T(L[6].length < 4100 && /… \+19950\]/.test(L[6]) && !/\(\+\d+ belgi\)/.test(L[6]), '20 000 massiv → 50 element + «… +19950», satr < 4100', `len=${L[6].length} oxiri="${L[6].slice(-30)}"`);
T(L[7] === '›ƒ f() Symbol(s) null undefined NaN -0 matn ["ichki", 1]', 'ƒ/Symbol/-0/ichki satr tirnoqli', `"${L[7]}"`);
T(/^›Map\(70\) \{0 => 0, .* 49 => 49, … \+20\}$/.test(L[8]), 'Map 70 → 50 + «… +20»', `"${L[8].slice(0, 30)}…${L[8].slice(-20)}"`);
await mount('const s="x".repeat(9000); console.log(s);'); L = await lines();
T(L[0].length < 4100 && /… \(\+5000 belgi\)$/.test(L[0]), '9000 belgili satr → 4000 + «… (+5000 belgi)»', `len=${L[0].length}`);
const t1 = Date.now(); await p.click('.hc-root textarea.hc-code'); await p.keyboard.type('x'); await p.waitForTimeout(50); const typeMs = Date.now() - t1;
T(typeMs < 400, 'katta log\'dan keyin yozish tez', `${typeMs} ms`);

// ── K-P-16
await mount(`console.log("salom");
console.debug("d");console.dir({x:1});console.group("guruh");console.log("ichida");console.groupEnd();console.log("tashqarida");
console.table([{a:1,b:2},{a:3,b:4}]);
console.table(Array.from({length:300},(_,i)=>({i})));
console.table("oddiy");`);
L = await lines();
T(L[1] === '›d' && L[2] === '›{x: 1}', 'debug/dir → log', `"${L[1]}" "${L[2]}"`);
T(L[3] === '›▼ guruh' && /^›\s{2}ichida$/.test(await p.$$eval('.hc-console-line', els => els[4].textContent.replace(/^\s+/, ''))) && L[5] === '›tashqarida', 'group → ▼ + chekinish, groupEnd → yo\'q', `"${L[3]}" "${L[4]}" "${L[5]}"`);
const t2 = L[6].split('\n');
T(t2.length === 4 && /\(index\) │ a +│ b/.test(t2[0]) && /^0 +│ 1 +│ 2/.test(t2[2]), 'table 2 qator', JSON.stringify(t2));
const t3 = L[7].split('\n');
T(t3.length === 23 && /… \+280 qator$/.test(t3[22]), 'table 300 → 20 qator + «… +280 qator»', `satr=${t3.length} oxiri="${t3[22]}"`);
T(L[8] === '›oddiy', 'table(satr) → log', `"${L[8]}"`);
await mount(`console.log("salom");\nconsole.log("bir");\nsetTimeout(()=>{console.clear();console.log("after clear");},600);`);
L = await lines(); const CH = await chips();
T(L.length === 2 && /console\.clear\(\) — tozalandi/.test(L[0]) && L[1] === '›after clear', 'clear → panel tozalandi + chiziq + keyingi log', JSON.stringify(L));
T(CH[0] === '✓✓log salom', 'clear harness-chipga TEGMAYDI (logs:"salom" clear\'dan oldin) → yashil', JSON.stringify(CH));
await mount(`console.log("salom");\nconsole.clear();`, undefined, 'ru'); L = await lines();
T(/console\.clear\(\) — очищено/.test(L[0]), 'clear ru', JSON.stringify(L));
// tozalash tugmasi (parent) hali ishlaydi
await mount('console.log("a");'); await p.click('.hc-console-clear'); await p.waitForTimeout(100); L = await lines();
T(L.length === 0, '«tozalash» tugmasi ishlaydi', `n=${L.length}`);
console.log(bad ? `XATO: ${bad}` : `HAMMASI KUTILGANDEK (${bad} xato)`);
await b.close();
