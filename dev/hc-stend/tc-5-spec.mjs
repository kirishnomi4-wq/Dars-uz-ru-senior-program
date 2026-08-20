// specToCheck / buildLabel / normalizeReq / runOne — deklarativ shartlar UI orqali
import { open, chips, errBox } from './tc-lib.mjs';
const { b, p, log } = await open();
const pageErr = [];
p.on('pageerror', e => pageErr.push(e.message));

async function run(reqs, files, lang = 'uz', wait = 900) {
  const ok = await p.evaluate(({ reqs, files, lang }) => {
    try {
      window.unmountHC();
      document.getElementById('root').innerHTML = '';
      return window.mountHC({ task: { title: 'tc-spec', requirements: reqs, files }, lang });
    } catch (e) { return 'MOUNT-THROW ' + e.message; }
  }, { reqs, files, lang });
  await p.waitForTimeout(wait);
  const has = await p.$('.hc-root');
  if (!has) return { mounted: false, ok, pageErr: pageErr.splice(0) };
  return { mounted: true, chips: await chips(p), err: await errBox(p), hint: await p.$eval('.hc-hint', e => e.textContent).catch(() => null), pageErr: pageErr.splice(0) };
}
const F = (html = '', css, js) => {
  const f = [{ name: 'index.html', lang: 'html', starter: html }];
  if (css != null) f.push({ name: 'style.css', lang: 'css', starter: css });
  if (js != null) f.push({ name: 'script.js', lang: 'js', starter: js });
  return f;
};
const CASES = [
  // [nom, reqs, files, lang]
  ['tag', [{ tag: 'h1' }], F('<h1>x</h1>')],
  ['tag yo\'q', [{ tag: 'h1' }], F('<p>x</p>')],
  ['tag+text', [{ tag: 'h1', text: true }], F('<h1></h1>')],
  ['tag+text ok', [{ tag: 'h1', text: true }], F('<h1>x</h1>')],
  ['tag+text:"salom" (matn qiymati e\'tiborga olinadimi?)', [{ tag: 'h1', text: 'salom' }], F('<h1>boshqa</h1>')],
  ['tag+attr', [{ tag: 'a', attr: 'href' }], F('<a href="">x</a>')],
  ['tag+attr+equals', [{ tag: 'input', attr: 'type', equals: 'email' }], F('<input type="text">')],
  ['tag+attrs', [{ tag: 'img', attrs: ['src', 'alt'] }], F('<img src="a">')],
  ['tag+child', [{ tag: 'ul', child: 'li' }], F('<ul></ul>')],
  ['tag+nested', [{ tag: 'ul', nested: 'li' }], F('<ul><li>x</li></ul>')],
  ['tag+count', [{ tag: 'li', count: 3 }], F('<ul><li>1</li><li>2</li></ul>')],
  ['tag+count+text (qaysi ustun?)', [{ tag: 'li', count: 3, text: true }], F('<ul><li></li><li></li><li></li></ul>')],
  ['tag+attr+text (qaysi ustun?)', [{ tag: 'a', attr: 'href', text: true }], F('<a href="x"></a>')],
  ['sel (tag o\'rniga)', [{ sel: '.card' }], F('<div class="card">x</div>')],
  ['sel+tag ikkalasi', [{ sel: '.card', tag: 'div' }], F('<span class="card">x</span>')],
  ['css prop', [{ css: { sel: 'h1', prop: 'color' } }], F('<h1>x</h1>', 'h1{color:red}')],
  ['css value', [{ css: { sel: 'h1', prop: 'color', value: 'red' } }], F('<h1>x</h1>', 'h1{color:blue}')],
  ['css value #fff (hex)', [{ css: { sel: 'h1', prop: 'color', value: '#fff' } }], F('<h1>x</h1>', 'h1{color:#fff}')],
  ['css value margin 0', [{ css: { sel: 'h1', prop: 'margin', value: '0' } }], F('<h1>x</h1>', 'h1{margin:0}')],
  ['css value son (number)', [{ css: { sel: 'h1', prop: 'z-index', value: 2 } }], F('<h1>x</h1>', 'h1{z-index:2}')],
  ['css value son 0 (number)', [{ css: { sel: 'h1', prop: 'margin', value: 0 } }], F('<h1>x</h1>', 'h1{margin:0}')],
  ['css bo\'sh obyekt', [{ css: {} }], F('<h1>x</h1>', 'h1{color:red}')],
  ['js regex', [{ js: /let\s+x/ }], F('', '', 'let x = 1')],
  ['js string', [{ js: 'let\\s+x' }], F('', '', 'let x = 1')],
  ['js string maxsus belgi "console.log("', [{ js: 'console.log(' }], F('', '', 'console.log(1)')],
  ['js string "alert("', [{ js: 'alert(' }], F('', '', 'alert(1)')],
  ['js string "arr[0]"', [{ js: 'arr[0]' }], F('', '', 'arr[0]')],
  ['js string "a+b"', [{ js: 'a+b' }], F('', '', 'a+b')],
  ['js string "a.b"', [{ js: 'a.b' }], F('', '', 'aXb')],
  ['js regex /g', [{ js: /x/g }], F('', '', 'x')],
  ['logs 5', [{ logs: 5 }], F('', '', 'console.log(5)')],
  ['logs 0', [{ logs: 0 }], F('', '', 'console.log(0)')],
  ['logs "" (bo\'sh)', [{ logs: '' }], F('', '', 'console.log("")')],
  ['logs false', [{ logs: false }], F('', '', 'console.log(false)')],
  ['logs null', [{ logs: null }], F('', '', 'console.log(null)')],
  ['eval', [{ eval: 'typeof f', equals: 'function' }], F('', '', 'function f(){}')],
  ['eval equals son', [{ eval: '1+1', equals: 2 }], F('', '', '')],
  ['eval equals yo\'q', [{ eval: 'x' }], F('', '', 'var x')],
  ['eval bo\'sh satr', [{ eval: '' }], F('', '', '')],
  ['click', [{ click: '#b', read: '#o', expect: 'Salom' }], F('<button id="b">b</button><p id="o"></p>', '', 'document.getElementById("b").onclick=function(){document.getElementById("o").textContent="Salom"}')],
  ['click read yo\'q', [{ click: '#b', expect: 'Salom' }], F('<button id="b">b</button><p id="o"></p>', '', 'document.getElementById("b").onclick=function(){document.getElementById("o").textContent="Salom"}')],
  ['click expect yo\'q', [{ click: '#b', read: '#o' }], F('<button id="b">b</button><p id="o"></p>', '', 'document.getElementById("b").onclick=function(){document.getElementById("o").textContent="undefined"}')],
  ['toggle', [{ toggle: '#b', a: 'Kun', b: 'Tun' }], F('<button id="b">Kun</button>', '', 'var b=document.getElementById("b");b.onclick=function(){b.textContent=b.textContent==="Kun"?"Tun":"Kun"}')],
  ['toggle a/b yo\'q', [{ toggle: '#b' }], F('<button id="b">Kun</button>', '', '')],
  ['noma\'lum kalit', [{ foo: 'bar' }], F('<h1>x</h1>')],
  ['bo\'sh obyekt', [{}], F('<h1>x</h1>')],
  ['hint uz/ru obyekt (uz)', [{ tag: 'h1', hint: { uz: 'UZ-maslahat', ru: 'RU-maslahat' } }], F('<p>x</p>'), 'uz'],
  ['hint uz/ru obyekt (ru)', [{ tag: 'h1', hint: { uz: 'UZ-maslahat', ru: 'RU-maslahat' } }], F('<p>x</p>'), 'ru'],
  ['hint satr (ru)', [{ tag: 'h1', hint: 'faqat-satr' }], F('<p>x</p>'), 'ru'],
  ['label avto (ru)', [{ tag: 'h1', text: true }, { tag: 'li', count: 2 }, { css: { sel: 'h1', prop: 'color' } }, { logs: 5 }, { click: '#b', read: '#o', expect: 'S' }, { toggle: '#b', a: 'A', b: 'B' }, { eval: 'x', equals: 1 }, { js: /x/ }, { tag: 'ul', child: 'li' }, { tag: 'img', attrs: ['src'] }, { tag: 'a', attr: 'href' }, {}], F('<p>x</p>', '', ''), 'ru'],
  ['label avto (uz)', [{ tag: 'h1', text: true }, { tag: 'li', count: 2 }, { css: { sel: 'h1', prop: 'color' } }, { logs: 5 }, { click: '#b', read: '#o', expect: 'S' }, { toggle: '#b', a: 'A', b: 'B' }, { eval: 'x', equals: 1 }, { js: /x/ }, { tag: 'ul', child: 'li' }, { tag: 'img', attrs: ['src'] }, { tag: 'a', attr: 'href' }, {}], F('<p>x</p>', '', ''), 'uz'],
  ['id takror (ikki shart id-siz, bir xil tag)', [{ tag: 'h1' }, { tag: 'h1', text: true }], F('<h1>x</h1>')],
  ['id takror runtime (ikkita logs)', [{ logs: 'A' }, { logs: 'B' }], F('', '', 'console.log("A")')],
  ['id takror runtime aniq id bir xil', [{ id: 'x', logs: 'A' }, { id: 'x', logs: 'B' }], F('', '', 'console.log("A")')],
  ['eski re: (regex HTML)', [{ re: /<h1>/, label: 'h1 re', hint: { uz: 'h1 yozing', ru: 'напишите h1' } }], F('<!-- <h1> -->'), 'ru'],
  ['eski check + hint obyekt', [{ label: 'x', check: (x) => x.$('h1') ? true : 'topilmadi', hint: { uz: 'U', ru: 'R' } }], F('<p>x</p>'), 'ru'],
  ['check false qaytarsa (true emas, satr emas)', [{ label: 'x', check: () => false, hint: { uz: 'U-false', ru: 'R-false' } }], F('<p>x</p>'), 'ru'],
  ['check throw', [{ label: 'x', check: () => { throw new Error('boom'); } }], F('<p>x</p>'), 'ru'],
  ['check {uz,ru} obyekt qaytarsa', [{ label: 'x', check: () => ({ uz: 'U-obj', ru: 'R-obj' }) }], F('<p>x</p>'), 'ru'],
  ['requirements bo\'sh', [], F('<p>x</p>')],
  ['tag selektor yaroqsiz "h1["', [{ tag: 'h1[' }], F('<h1>x</h1>')],
  ['tag = raqam', [{ tag: 5 }], F('<h1>x</h1>')],
  ['count = "3" satr', [{ tag: 'li', count: '3' }], F('<li>1</li><li>2</li>')],
  ['count = 0', [{ tag: 'li', count: 0 }], F('')],
  ['attrs bo\'sh', [{ tag: 'img', attrs: [] }], F('<img>')],
  ['attr + attrs birga', [{ tag: 'img', attr: 'alt', attrs: ['src'] }], F('<img src="a">')],
  ['CSS fayli yo\'q, css shart', [{ css: { sel: 'h1', prop: 'color' } }], F('<style>h1{color:red}</style><h1>x</h1>')],
  ['JS fayli yo\'q, js shart', [{ js: /alert/ }], F('<script>alert(1)</script>')],
  ['JS fayli yo\'q, logs shart', [{ logs: 'A' }], F('<script>console.log("A")</script>')],
  ['ikkita js fayl — 2-si tekshirilmaydi?', [{ js: /alert/ }], [{ name: 'index.html', lang: 'html', starter: '' }, { name: 'a.js', lang: 'js', starter: '' }, { name: 'b.js', lang: 'js', starter: 'alert(1)' }]],
  ['ikkita css fayl — 2-si tekshirilmaydi?', [{ css: { sel: 'h1', prop: 'color' } }], [{ name: 'index.html', lang: 'html', starter: '<h1>x</h1>' }, { name: 'a.css', lang: 'css', starter: '' }, { name: 'b.css', lang: 'css', starter: 'h1{color:red}' }]],
];
for (const [name, reqs, files, lang] of CASES) {
  // funksiya/regex parametrlar evaluate orqali o'tmaydi — serializatsiya: manba-satr
  const ser = JSON.stringify(reqs, (k, v) => v instanceof RegExp ? { __re: v.source, __f: v.flags } : typeof v === 'function' ? { __fn: v.toString() } : v);
  const res = await p.evaluate(async ({ ser, files, lang }) => {
    const reqs = JSON.parse(ser, (k, v) => v && v.__re != null ? new RegExp(v.__re, v.__f) : v && v.__fn ? eval('(' + v.__fn + ')') : v);
    try {
      window.unmountHC(); document.getElementById('root').innerHTML = '';
      window.mountHC({ task: { title: 'tc-spec', requirements: reqs, files }, lang });
    } catch (e) { return { mountThrow: e.message }; }
    return null;
  }, { ser, files, lang: lang || 'uz' });
  await p.waitForTimeout(files.some(f => f.lang === 'js') ? 1300 : 700);
  const has = await p.$('.hc-root .hc-chip, .hc-root .hc-count');
  const out = has ? { chips: await chips(p), hint: await p.$eval('.hc-hint', e => e.textContent).catch(() => null), count: await p.$eval('.hc-count', e => e.textContent).catch(() => null) } : { mounted: false, root: await p.$eval('#root', e => e.innerHTML.slice(0, 120)).catch(() => 'no-root') };
  console.log(`[${name}] ${JSON.stringify({ ...res, ...out, pageErr: pageErr.splice(0) })}`);
}
await b.close();
