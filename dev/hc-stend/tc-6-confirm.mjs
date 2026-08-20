// Ikkinchi tasdiq: gumon -> fakt
import { open, chips, errBox, setCode } from './tc-lib.mjs';
const { b, p, log } = await open();
const pageErr = []; p.on('pageerror', e => pageErr.push(e.message));
const F = (html = '', css, js) => { const f = [{ name: 'index.html', lang: 'html', starter: html }]; if (css != null) f.push({ name: 'style.css', lang: 'css', starter: css }); if (js != null) f.push({ name: 'script.js', lang: 'js', starter: js }); return f; };
async function mountSrc(reqSrc, files, lang = 'uz', wait = 1200) {
  await p.evaluate(({ reqSrc, files, lang }) => { const C = window.HC.checks; window.unmountHC(); document.getElementById('root').innerHTML = ''; window.__events = []; window.mountHC({ task: { title: 'tc6', requirements: eval(reqSrc), files }, lang }); }, { reqSrc, files, lang });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(wait);
}
const nextBtn = () => p.$eval('.hc-next', e => ({ disabled: e.disabled, title: e.title }));
const status = () => p.$eval('.hc-status', e => e.textContent).catch(() => null);

// 1) Delayed forged report (nonce brute) — cheat/security
await mountSrc(`[{ id:'r1', label:'log 999', check: C.logs('999') }, { id:'r2', label:'eval', check: C.evalEquals('typeof f','function') }]`,
  F('', '', `setTimeout(function(){ for (var n=1;n<200;n++){ try{ parent.postMessage({__hcReport:true, nonce:n, results:{r1:true,r2:true}}, '*'); }catch(e){} } }, 400);`), 'uz', 1800);
console.log('[1 delayed forge] chips', await chips(p), 'next', await nextBtn());
// 1b) hidden id-lar: r0/r1 avto id (id berilmagan runtime) — brute id ham
await mountSrc(`[{ label:'log 999', check: C.logs('999') }, { label:'eval', check: C.evalEquals('typeof f','function') }]`,
  F('', '', `setTimeout(function(){ var res={}; for(var i=0;i<20;i++){res['r'+i]=true;} for (var n=1;n<200;n++){ try{ parent.postMessage({__hcReport:true, nonce:n, results:res}, '*'); }catch(e){} } }, 400);`), 'uz', 1800);
console.log('[1b auto-id forge] chips', await chips(p), 'next', await nextBtn());

// 2) 6s busy loop — oxir-oqibat yashil bo'ladimi (ikki iframe ketma-ket ishlaydimi)
await mountSrc(`[{ id:'r1', label:'log', check: C.logs('X') }]`, F('', '', `var t=Date.now(); while(Date.now()-t<4000){} console.log('X');`), 'uz', 500);
for (const ms of [2000, 4000, 6000, 8000, 10000, 12000]) { await p.waitForTimeout(2000); console.log(`[2 busy4s] t=${ms + 500}ms chips`, JSON.stringify(await chips(p))); }
// preview'ni ham hisobga olib: preview iframe va check iframe bir jarayondami?
const procInfo = await p.evaluate(() => [...document.querySelectorAll('iframe')].map(f => f.getAttribute('sandbox') + ' | ' + f.title));
console.log('[2 iframes]', procInfo);

// 3) /g regex flip-flop — har tugma bosishda o'zgaradimi
await mountSrc(`[{ id:'g', label:'g-regex', check: C.js(/x/g) }]`, F('', '', 'x'), 'uz', 800);
await p.click('text=script.js'); await p.waitForTimeout(200);
const seq = [];
for (let i = 0; i < 6; i++) { await p.click('.hc-code'); await p.keyboard.press('End'); await p.keyboard.type(' '); await p.waitForTimeout(150); seq.push((await chips(p))[0].ok); }
console.log('[3 /g regex] ok-ketma-ketligi', seq);
// 3b) oddiy regex bilan nazorat
await mountSrc(`[{ id:'g', label:'regex', check: C.js(/x/) }]`, F('', '', 'x'), 'uz', 800);
await p.click('text=script.js'); await p.waitForTimeout(200);
const seq2 = [];
for (let i = 0; i < 4; i++) { await p.click('.hc-code'); await p.keyboard.press('End'); await p.keyboard.type(' '); await p.waitForTimeout(150); seq2.push((await chips(p))[0].ok); }
console.log('[3b plain regex] ok-ketma-ketligi', seq2);

// 4) URL "//" izoh muammosi UI'da
await mountSrc(`[{ id:'a', label:'alert', check: C.js(/alert\\(/) }]`, F('', '', 'const u = "https://example.com/x"; alert(1);'), 'uz', 800);
console.log('[4 // in string] chips', await chips(p));
await mountSrc(`[{ id:'a', label:'alert', check: C.js(/alert\\(/) }]`, F('', '', 'const u = "https://example.com/x";\nalert(1);'), 'uz', 800);
console.log('[4b // in string, next line] chips', await chips(p));
await mountSrc(`[{ id:'a', label:'addEventListener', check: C.js(/addEventListener/) }]`, F('', '', "const link = 'http://t.me/x'; btn.addEventListener('click', f);"), 'uz', 800);
console.log('[4c // realistic] chips', await chips(p));

// 5) inline <script> HTML linter soxta xato -> Davom etish yopiq
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<h1>Salom</h1>\n<script>\nfor (let i = 0; i<3; i++) { console.log(i); }\n</script>'), 'uz', 1500);
console.log('[5 inline script lint] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn(), 'status', await status());
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<h1>Salom</h1>\n<script>\nlet s = "<b>salom";\n</script>'), 'uz', 1500);
console.log('[5b inline script "<b>"] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn());
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<h1>Salom</h1>\n<textarea>\n<b>salom\n</textarea>'), 'uz', 1500);
console.log('[5c textarea] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn());
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<p>2 < 3 va a<b</p><h1>Salom</h1>'), 'uz', 1500);
console.log('[5d a<b in text] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn());
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<!DOCTYPE html>\n<html>\n<head>\n<title>x</title>\n<body>\n<h1>Salom</h1>\n</body>\n</html>'), 'uz', 1500);
console.log('[5e head not closed] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn());
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<h1>Salom</h1>\n<a href=a/>x</a>'), 'uz', 1500);
console.log('[5f href=a/ unquoted] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn());
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<h1>Salom</h1>\n<div/>\n<p>x</p>'), 'uz', 1500);
console.log('[5g <div/>] chips', await chips(p), 'err', await errBox(p), 'next', await nextBtn(), 'preview-doc-h1-count', await p.evaluate(() => { const f = document.querySelector('iframe.hc-frame'); return f.contentDocument ? 'same-origin?!' : 'opaque'; }));

// 6) cssValue numeric UI (tasdiq) + hex + margin (tasdiq 2)
await mountSrc(`[{ id:'z', label:'z', check: C.cssValue('h1','z-index', 2) }, { id:'m', label:'m', check: C.cssValue('h1','margin','0 auto') }, { id:'c', label:'c', check: C.cssValue('h1','color','#ff0000') }, { id:'b', label:'b', check: C.cssValue('h1','border-bottom','1px solid red') }, { id:'t', label:'t', check: C.cssValue('a','text-decoration','none') }, { id:'f', label:'f', check: C.cssValue('.r','flex','1') }, { id:'w', label:'w', check: C.cssValue('h1','font-weight','bold') }, { id:'bg', label:'bg', check: C.cssProp('h1','background') }, { id:'bgc', label:'bgc', check: C.cssValue('h1','background-color','#eee') }, { id:'tr', label:'tr', check: C.cssValue('a','transition','all .3s') }, { id:'bo', label:'bo', check: C.cssProp('a','border-bottom') }, { id:'td', label:'td', check: C.cssProp('a','text-decoration') }, { id:'ga', label:'ga', check: C.cssProp('.r','grid-area') }, { id:'me', label:'me', check: C.cssProp('h1','font-size') }]`,
  F('<h1>x</h1><a>l</a><div class="r"></div>', 'h1{z-index:2;margin:0 auto;color:#ff0000;border-bottom:1px solid red;font-weight:bold;background:#eee;background-color:#eee} a{text-decoration:none;transition:all .3s;border-bottom:1px solid red} .r{flex:1;grid-area:x} @media (max-width:600px){h1{font-size:2em}}'), 'uz', 800);
console.log('[6 css value/prop UI]', (await chips(p)).map(c => `${c.label.replace(/^\d|✓/, '')}:${c.ok ? 'OK' : 'RED(' + c.hint + ')'}`).join(' | '));

// 7) js string spec crash — butun komponent oq ekran (tasdiq: dars sahifasi)
await p.evaluate(() => { window.unmountHC(); document.getElementById('root').innerHTML = ''; try { window.mountHC({ task: { title: 't', requirements: [{ js: 'console.log(' }], files: [{ name: 'index.html', lang: 'html', starter: '' }, { name: 'script.js', lang: 'js', starter: '' }] }, lang: 'uz' }); } catch (e) { window.__mountErr = e.message; } });
await p.waitForTimeout(700);
console.log('[7 js string crash] root=', JSON.stringify(await p.$eval('#root', e => e.innerHTML.slice(0, 80))), 'pageErr', pageErr.splice(0));

// 8) attr/text faqat birinchi element — UI (ikkinchi <a> to'g'ri, birinchisi bo'sh)
await mountSrc(`[{ id:'a', label:'a href', check: C.attr('a','href') }, { id:'t', label:'p text', check: C.text('p') }]`, F('<a>menyu</a>\n<a href="about.html">Biz haqimizda</a>\n<p></p>\n<p>Matn bor</p>'), 'uz', 800);
console.log('[8 first-element-only] chips', await chips(p));

// 9) console.log obyektlar/xato satri — 2-tasdiq
await mountSrc(`[{ id:'l', label:'l', check: C.logs('ok') }]`, F('<p id="p">x</p>', '', `console.log('ok');\nconsole.log(document.getElementById('p'));\nconsole.log([1,[2,3]], {a:{b:1}});\nconsole.log('a', 1, true, null, undefined);\n\n\n\nnull.foo;`), 'uz', 1300);
console.log('[9 console]', await p.$$eval('.hc-console-line', els => els.map(e => e.textContent)));

// 10) alert / prompt UI: konsolda hech narsa yo'q, statusda ham
await mountSrc(`[{ id:'l', label:'l', check: C.logs('ok') }]`, F('', '', `alert('Salom!'); var ism = prompt('Isming?'); console.log('ok', ism);`), 'uz', 1300);
console.log('[10 alert/prompt]', await p.$$eval('.hc-console-line', els => els.map(e => e.textContent)), 'chips', await chips(p));

// 11) </script> ichida JS
await mountSrc(`[{ id:'l', label:'l', check: C.logs('ok') }]`, F('<div id="d"></div>', '', `document.getElementById('d').innerHTML = "<p>salom</p>"; console.log('ok');`), 'uz', 1300);
console.log('[11a innerHTML <p>] chips', await chips(p));
await mountSrc(`[{ id:'l', label:'l', check: C.logs('ok') }]`, F('<div id="d"></div>', '', `var s = "<script>alert(1)</script>"; console.log('ok');`), 'uz', 1300);
console.log('[11b "</script>" in string] chips', await chips(p), await p.$$eval('.hc-console-line', els => els.map(e => e.textContent)));

// 12) @import har tugmada qayta so'raladimi
const reqs = []; p.on('request', r => { if (/tc-imp-/.test(r.url())) reqs.push(r.url()); });
await mountSrc(`[{ id:'c', label:'c', check: C.cssProp('h1','color') }]`, F('<h1>x</h1>', '@import url("http://127.0.0.1:4517/tc-imp-a.css");\nh1{color:red}'), 'uz', 800);
await p.click('text=style.css'); await p.waitForTimeout(200);
for (let i = 0; i < 5; i++) { await p.click('.hc-code'); await p.keyboard.press('End'); await p.keyboard.type(' '); await p.waitForTimeout(400); }
await p.waitForTimeout(800);
console.log('[12 @import per keystroke] requests:', reqs.length, reqs.slice(0, 3));

// 13) toggle: A matn B ichida (Kun / Kunduz)
await mountSrc(`[{ id:'t', label:'t', check: C.toggle('#b','#b','Kun','Kunduz') }]`, F('<button id="b">Kun</button>', '', `var b=document.getElementById('b'); b.onclick=function(){ b.textContent = b.textContent==='Kun' ? 'Kunduz' : 'Kun'; };`), 'uz', 1300);
console.log('[13 toggle A in B] chips', await chips(p));

// 14) domAfterClick — sahifada matn boshidan bor (masalan starter matni «1» ni o'z ichiga oladi)
await mountSrc(`[{ id:'t', label:'t', check: C.domAfterClick('#like','#son','1') }]`, F('<button id="like">❤</button><p id="son">Layklar: 10</p>', '', `var n=10; document.getElementById('like').onclick=function(){ n++; document.getElementById('son').textContent='Layklar: '+n; };`), 'uz', 1300);
console.log('[14 click expected substring already present] chips', await chips(p));

console.log('pageErr', pageErr, 'log', log.filter(l => /error/.test(l) && !/DevTools|ERR_NAME|Ignored call|net::/.test(l)).slice(0, 10));
await b.close();
