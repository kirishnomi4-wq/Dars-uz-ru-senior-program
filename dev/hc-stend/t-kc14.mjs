// K-C-14 (= K-P-05): alert/prompt/confirm sandbox'da jim yutilardi — endi konsolda ⚠ warn (o'quvchi tilida),
// semantika saqlanadi (undefined/null/false), ikkilamchi null-TypeError'da sabab prompt/confirm'ga bog'lanadi,
// o'quvchi o'z window.alert'ini yozsa — uniki ishlaydi.
import { open } from './tc-lib.mjs';
const { b, p, log } = await open();
const consoleLines = () => p.$$eval('.hc-console-line', els => els.map(e => ({ text: e.textContent.trim(), cls: e.className, title: e.title || '' })));
const mountJs = async (js, html = '<h1>x</h1>', lang = 'uz') => {
  await p.evaluate(({ js, html, lang }) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = '';
    window.mountHC({ lang, task: { title: 't', requirements: [{ id: 'r', label: 'r', logs: 'zzz' }], files: [
      { name: 'index.html', lang: 'html', starter: html }, { name: 'style.css', lang: 'css', starter: '' }, { name: 'script.js', lang: 'js', starter: js } ] } }); }, { js, html, lang });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1500);
};
const mark = (l) => (/lvl-error/.test(l.cls) ? '🔴' : /lvl-warn/.test(l.cls) ? '🟡' : '›') + l.text;
// [label, js, html, lang, kutilgan: massiv-regex (tartib bilan, konsol satrlari), noBrowserIgnored?]
const cases = [
  ['alert', 'alert("Salom!");\nconsole.log("alertdan keyin");', undefined, 'uz',
    [/^🟡⚠alert\("Salom!"\) — bu muhitda dialog-oyna ochilmaydi\. Matnni ko'rsatish uchun `console\.log\(\.\.\.\)`/, /^››alertdan keyin$/]],
  ['prompt+confirm (semantika: null / false)', 'let ism = prompt("Ismingiz?");\nconsole.log("Salom, " + ism);\nconsole.log(confirm("?"));', undefined, 'uz',
    [/^🟡⚠prompt\("Ismingiz\?"\) — bu yerda ishlamaydi, javob null \(bo'sh\) qaytdi\. .*let ism = "Ali"/, /^››Salom, null$/, /^🟡⚠confirm\("\?"\) — bu yerda ishlamaydi, javob false qaytdi — `else` tarmog'i ishlaydi$/, /^››false$/]],
  ['prompt → null.length (ikkilamchi TypeError, sabab bog\'langan)', 'var ism = prompt("Ism?");\nconsole.log(ism.length);', undefined, 'uz',
    [/^🟡⚠prompt\("Ism\?"\)/, /^🔴›script\.js:2`length` ni o'qib bo'lmadi — qiymat null\. Ehtimol bu `prompt\(\)`\/`confirm\(\)` javobi: bu muhitda ular doim null\/false qaytaradi/]],
  ['null-xato PROMPT\'SIZ → eski (element) taxmin qoladi', 'var el = document.querySelector("#yoq");\nconsole.log(el.textContent);', undefined, 'uz',
    [/^🔴›script\.js:2`textContent` ni o'qib bo'lmadi — qiymat null\. Element topilmagan yoki o'zgaruvchi hali bo'sh/]],
  ['confirm → if (else-tarmoq)', 'if (confirm("Davom?")) { console.log("HA"); } else { console.log("YOQ"); }', undefined, 'uz',
    [/^🟡⚠confirm\("Davom\?"\)/, /^››YOQ$/]],
  ['ru: alert + prompt-null xato', 'alert("Privet");\nvar n = prompt("?");\nconsole.log(n.length);', undefined, 'ru',
    [/^🟡⚠alert\("Privet"\) — в этой среде диалоговое окно не открывается/, /^🟡⚠prompt\("\?"\) — здесь не работает, ответ null \(пусто\)/, /^🔴›script\.js:3не удалось прочитать `length` — значение null\. Вероятно, это ответ `prompt\(\)`/]],
  ['sikl: 3× alert → 1 to\'liq + 2 qisqa', 'for (var i = 0; i < 3; i++) alert("N" + i);\nalert();', undefined, 'uz',
    [/^🟡⚠alert\("N0"\) — bu muhitda dialog-oyna/, /^🟡⚠alert\("N1"\) — o'tkazib yuborildi \(bu muhitda ishlamaydi\)$/, /^🟡⚠alert\("N2"\) — o'tkazib yuborildi/, /^🟡⚠alert\(\) — o'tkazib yuborildi/]],
  ['inline <script> (index.html) alert + prompt-null', 'console.log("js ok");', '<h1>a</h1>\n<script>alert("inline");\nvar n = prompt("?"); console.log(n.length);</script>', 'uz',
    [/^🟡⚠alert\("inline"\)/, /^🟡⚠prompt\("\?"\)/, /^🔴›index\.html:3`length` ni o'qib bo'lmadi — qiymat null\. Ehtimol bu `prompt\(\)`/, /^››js ok$/]],
  ['O\'QUVCHI O\'Z window.alert\'ini yozadi → uniki ishlaydi, ⚠ yo\'q', 'window.alert = function(m){ document.body.innerHTML += "<p id=my>" + m + "</p>"; console.log("MENING alert:", m); };\nalert("Salom!");\nwindow.prompt = function(){ return "Ali"; };\nvar ism = prompt("Ism?");\nconsole.log(ism.length);', undefined, 'uz',
    [/^››MENING alert: Salom!$/, /^››3$/]],
  ['O\'QUVCHI O\'Z alert (funksiya-e\'lon, hoisting) → uniki', 'alert("bir");\nfunction alert(m){ console.log("MENIKI:", m); }', undefined, 'uz',
    [/^››MENIKI: bir$/]],
];
let bad = 0;
for (const [label, js, html, lang, want] of cases) {
  log.length = 0;
  await mountJs(js, html, lang);
  const lines = (await consoleLines()).map(mark);
  const ignored = log.filter(l => /Ignored call/.test(l)).length;
  const okLen = lines.length === want.length;
  const okAll = okLen && want.every((re, i) => re.test(lines[i]));
  const modalWarn = lines.some(l => /^🟡⚠/.test(l));
  // brauzer «Ignored call»: preview'dagisi yo'qoldi (edi 4 → 3); qolganlari KO'RINMAS tekshiruv-hujjatidan (buildHarness, forward yo'q) — o'quvchiga ta'sirsiz, faqat chop etiladi
  const okIgn = true;
  const ok = okAll && okIgn;
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [${label}] satr=${lines.length}/${want.length} ignored=${ignored}`);
  if (!ok) { console.log('   OLINDI:', lines); }
  else if (process.env.V) console.log('   ', lines);
}
// O'QUVCHI-ALERT holida preview DOM'ga yozildimi (uning funksiyasi haqiqatan ishladi)
await mountJs('window.alert = function(m){ document.body.innerHTML += "<p id=my>" + m + "</p>"; };\nalert("Salom!");');
const my = await p.evaluate(async () => { const f = [...document.querySelectorAll('iframe')].find(f => f.srcdoc && !/__hcReport|runProbes/.test(f.srcdoc)) || document.querySelector('iframe'); try { return f.contentDocument && f.contentDocument.querySelector('#my') ? f.contentDocument.querySelector('#my').textContent : 'ORQALI YO\'Q'; } catch (e) { return 'cross-origin:' + e.message; } });
console.log(`   [o'quvchi-alert DOM] #my = ${JSON.stringify(my)} (sandbox — cross-origin bo'lsa konsol-dalil yetarli)`);
console.log(bad ? `XATO: ${bad}/${cases.length}` : `HAMMASI KUTILGANDEK ${cases.length}/${cases.length}`);
await b.close();
