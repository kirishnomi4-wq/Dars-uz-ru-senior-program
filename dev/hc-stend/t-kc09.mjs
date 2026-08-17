// K-C-09 (= K-P-04): JS xato-satri — konsolda fayl:satr (ofset AYIRILGAN), o'quvchi tilida matn, lug'atda yo'q xato → xom inglizcha,
// bosilsa kursor o'sha qatorga; til almashuvi (K-M-01 mexanizmi)
import { open } from './tc-lib.mjs';
const { b, p } = await open();
const consoleLines = () => p.$$eval('.hc-console-line', els => els.map(e => ({ text: e.textContent.trim(), title: e.title || '', pos: e.querySelector('.hc-console-pos')?.textContent || '' })));
const mountJs = async (js, css = '', html = '<h1>x</h1>', lang = 'uz') => {
  await p.evaluate(({ js, css, html, lang }) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = '';
    window.mountHC({ lang, task: { title: 't', requirements: [{ id: 'r', label: 'r', logs: 'zzz' }], files: [
      { name: 'index.html', lang: 'html', starter: html }, { name: 'style.css', lang: 'css', starter: css }, { name: 'script.js', lang: 'js', starter: js } ] } }); }, { js, css, html, lang });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1500);
};
const PROBE = "window.addEventListener('error',function(e){console.log('LINENO',e.lineno)});\n";
// [label, js, css, html, lang, kutilgan pos, kutilgan matn-regex]
const cases = [
  ['ReferenceError 3-qator', PROBE + 'console.log(1);\nfoo();', '', undefined, 'uz', 'script.js:3', /`foo` aniqlanmagan/],
  ['ReferenceError 3-qator, CSS 10 qator', PROBE + 'console.log(1);\nfoo();', 'h1{color:red}\n'.repeat(10), undefined, 'uz', 'script.js:3', /`foo` aniqlanmagan/],
  ['ReferenceError 3-qator, HTML 6 qator', PROBE + 'console.log(1);\nfoo();', '', '<h1>a</h1>\n<p>b</p>\n<p>c</p>\n<p>d</p>\n<p>e</p>\n<p>f</p>', 'uz', 'script.js:3', /`foo` aniqlanmagan/],
  ['TypeError null 4-qator', PROBE + 'var a = null;\nconsole.log(2);\na.foo;', '', undefined, 'uz', 'script.js:4', /`foo` ni o'qib bo'lmadi — qiymat null/],
  ['SyntaxError 2-qator (yopilmagan qavs)', 'console.log(1);\nif (a {\n}', '', undefined, 'uz', 'script.js:2', /kutilmagan belgi `\{`/],
  ['throw 2-qator', PROBE + 'throw new Error("mening xatom");', '', undefined, 'uz', 'script.js:2', /xato: mening xatom/],
  ['is not a function 2-qator', PROBE + 'var x = 5; x();', '', undefined, 'uz', 'script.js:2', /`x` funksiya emas/],
  ['RU rejim ReferenceError', PROBE + 'console.log(1);\nfoo();', '', undefined, 'ru', 'script.js:3', /`foo` не определено/],
  ['FALLBACK: lug\'atda YO\'Q xato (RangeError) 2-qator', PROBE + 'new Array(-1);', '', undefined, 'uz', 'script.js:2', /^›script\.js:2RangeError: Invalid array length$/],
  ['FALLBACK: DOMException (lug\'atda yo\'q)', PROBE + 'document.querySelector("###");', '', undefined, 'uz', 'script.js:2', /SyntaxError: Failed to execute 'querySelector'/],
  ['index.html ichidagi inline <script> 2-qator', 'console.log("js ok");', '', '<h1>a</h1>\n<script>bar();</script>', 'uz', 'index.html:2', /`bar` aniqlanmagan/],
];
let bad = 0;
for (const [label, js, css, html, lang, wantPos, wantRe] of cases) {
  await mountJs(js, css, html, lang);
  const lines = await consoleLines();
  const err = lines.find(l => /lvl-error|script\.js:|index\.html:/.test(l.pos + l.text) && l.pos) || lines.find(l => /Error|xato|ошибка/.test(l.text)) || { text: '', pos: '', title: '' };
  const probe = lines.find(l => /^›LINENO/.test(l.text))?.text || '';
  const ok = err.pos === wantPos && wantRe.test(err.text) && err.title.length > 0;
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [${label}] pos=${err.pos} (kutilgan ${wantPos}) matn="${err.text.slice(0, 95)}" title="${err.title.slice(0, 50)}" ${probe}`);
}
// JUMP: xato-satr bosilsa faol fayl script.js + kursor 3-qatorda
await mountJs('console.log(1);\nconsole.log(2);\nfoo();\nconsole.log(4);');
await p.$$eval('.hc-tab', els => { const t = els.find(e => /index\.html/.test(e.textContent)); if (t) t.click(); });
await p.waitForTimeout(200);
await p.click('.hc-console-line.has-pos'); await p.waitForTimeout(300);
const jump = await p.evaluate(() => { const ta = document.querySelector('.hc-root textarea.hc-code'); const before = ta.value.slice(0, ta.selectionStart); return { activeTab: [...document.querySelectorAll('.hc-tab')].find(e => /active|is-active|on/.test(e.className))?.textContent.trim(), line: before.split('\n').length, code: ta.value.slice(0, 20) }; });
const jumpOk = /console\.log\(1\)/.test(jump.code) && jump.line === 3;
if (!jumpOk) bad++;
console.log(`${jumpOk ? '✓' : '✗ KUTILMAGAN'} [JUMP] bosilgach faol fayl=${JSON.stringify(jump.activeTab)} kod-boshi=${JSON.stringify(jump.code)} kursor-qator=${jump.line} (kutilgan 3, script.js)`);
// TIL ALMASHUVI: uz'da xato bor, keyin ru'ga o'tish → konsol matni ruscha (qayta ishga tushirmasdan)
await mountJs('foo();');
const uzTxt = (await consoleLines()).find(l => l.pos)?.text || '';
const switched = await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(e => /^(RU|УЗ|UZ|Ру|Ру́с|РУ)$/i.test(e.textContent.trim()) || /lang/i.test(e.className)); if (b) { b.click(); return b.textContent.trim(); } return null; });
await p.waitForTimeout(400);
let ruTxt = (await consoleLines()).find(l => l.pos)?.text || '';
let how = 'tugma:' + switched;
if (!/не определено/.test(ruTxt)) { // stendda til-tugma bo'lmasa — lang prop bilan qayta render (React re-render, konsol holati saqlanadi)
  await p.evaluate(() => window.mountHC({ lang: 'ru', task: { title: 't', requirements: [{ id: 'r', label: 'r', logs: 'zzz' }], files: [{ name: 'index.html', lang: 'html', starter: '<h1>x</h1>' }, { name: 'style.css', lang: 'css', starter: '' }, { name: 'script.js', lang: 'js', starter: 'foo();' }] } }));
  await p.waitForTimeout(1500); ruTxt = (await consoleLines()).find(l => l.pos)?.text || ''; how = 'lang-prop bilan qayta mount';
}
const swOk = /aniqlanmagan/.test(uzTxt) && /не определено/.test(ruTxt);
if (!swOk) bad++;
console.log(`${swOk ? '✓' : '✗ KUTILMAGAN'} [TIL] uz="${uzTxt.slice(0, 40)}…" → ru="${ruTxt.slice(0, 40)}…" (${how})`);
console.log(bad ? `XATO: ${bad}/${cases.length + 2}` : `HAMMASI KUTILGANDEK ${cases.length + 2}/${cases.length + 2}`);
await b.close();
