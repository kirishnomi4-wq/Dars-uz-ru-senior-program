import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
const F = (html = '', css, js) => { const f = [{ name: 'index.html', lang: 'html', starter: html }]; if (css != null) f.push({ name: 'style.css', lang: 'css', starter: css }); if (js != null) f.push({ name: 'script.js', lang: 'js', starter: js }); return f; };
async function mountSrc(reqSrc, files, wait = 1400) {
  await p.evaluate(({ reqSrc, files }) => { const C = window.HC.checks; window.unmountHC(); document.getElementById('root').innerHTML = ''; window.mountHC({ task: { title: 'tc-shot', requirements: eval(reqSrc), files }, lang: 'uz' }); }, { reqSrc, files });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(wait);
}
await mountSrc(`[{ id:'c', label:'h1 rangi #ff0000', check: C.cssValue('h1','color','#ff0000') }, { id:'m', label:'h1 margin 0 auto', check: C.cssValue('h1','margin','0 auto') }, { id:'b', label:'a border-bottom', check: C.cssProp('a','border-bottom') }, { id:'t', label:'a text-decoration', check: C.cssProp('a','text-decoration') }, { id:'me', label:'@media h1 font-size', check: C.cssProp('h1','font-size') }]`,
  F('<h1>Salom</h1><a href="#">havola</a>', 'h1 { color: #ff0000; margin: 0 auto; }\na { border-bottom: 1px solid red; text-decoration: none; }\n@media (max-width: 600px) { h1 { font-size: 2em; } }'));
await p.click('text=style.css'); await p.waitForTimeout(300);
await p.screenshot({ path: 'tc-shot-css-false-negative.png' });
await mountSrc(`[{ id:'h', label:'h1', check: C.text('h1') }]`, F('<h1>Salom</h1>\n<script>\n  let s = "<b>salom";\n</script>'));
await p.screenshot({ path: 'tc-shot-lint-script.png' });
await mountSrc(`[{ id:'a', label:'addEventListener', check: C.js(/addEventListener/) }]`, F('<button id="btn">x</button>', '', "const link = 'http://t.me/x'; btn.addEventListener('click', f);"));
await p.click('text=script.js'); await p.waitForTimeout(300);
await p.screenshot({ path: 'tc-shot-js-url-comment.png' });
await mountSrc(`[{ id:'r1', label:'konsolda 999', check: C.logs('999') }, { id:'r2', label:'f funksiya', check: C.evalEquals('typeof f','function') }]`,
  F('', '', `setTimeout(function(){ var res={}; for(var i=0;i<20;i++){res['r'+i]=true;} res.r1=true; res.r2=true; for (var n=1;n<200;n++){ parent.postMessage({__hcReport:true, nonce:n, results:res}, '*'); } }, 400);`), 1800);
await p.click('text=script.js'); await p.waitForTimeout(300);
await p.screenshot({ path: 'tc-shot-forged-report.png' });
await mountSrc(`[{ id:'l', label:'konsolda ok', check: C.logs('ok') }]`, F('<p id="p">x</p>', '', `console.log('ok');\nconsole.log(document.getElementById('p'));\n\n\nnull.foo;`));
await p.screenshot({ path: 'tc-shot-console.png' });
await b.close();
