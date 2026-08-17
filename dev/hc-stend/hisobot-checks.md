# HtmlCompiler — TEKSHIRUV-MOTORI sinov hisoboti (checks · specToCheck · parseCss · lintHtml · runtime harness)

Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (tahrirlanmadi) · Stend: `dev/hc-stend/` (http://127.0.0.1:4517/)
Skriptlar: `tc-lib.mjs` (ichki funksiyalarni manbadan kesib sahifaga in'ektsiya qiladi → `window.__X`), `tc-1-builders.mjs` (444 hol), `tc-2-lint.mjs` (322 hol), `tc-3-css.mjs`, `tc-4-runtime.mjs`, `tc-5-spec.mjs`, `tc-6-confirm.mjs` (2-tasdiq), `tc-7-shots.mjs` (skrinshotlar). Xom chiqishlar: `tc-1-out.txt`, `tc-1-compact.txt`, `tc-2-out.txt`, `tc-2-compact.txt`.
Har topilma ikki yo'l bilan tasdiqlangan: (1) ichki funksiyani to'g'ridan-to'g'ri chaqirib, (2) haqiqiy komponentda (`mountHC` + chip/`.hc-err`/`Davom etish` holati).

## Qisqa jadval

| Og'irlik | Soni | ID lar |
|---|---|---|
| 🔴 kritik | 2 | K-C-01, K-C-02 |
| 🟠 muhim | 8 | K-C-03 … K-C-10 |
| 🟡 mayda | 15 | K-C-11 … K-C-25 |
| 🔵 taklif/hujjat | 8 | K-C-26 … K-C-33 |
| **Jami** | **33** | |

## Nima sinaldi (to'liq manzara)

**checks builders (has/text/attr/attrs/nested/count/cssProp/cssValue/js/custom, 444 hol):**
- ✓ o'tdi: `has` — katta harf `<H1>`, `<h1 >`, izoh ichidagi teg (topilmaydi — to'g'ri), `<pre>` ichidagi entity, `<textarea>`/`<script>` ichidagi teg (DOM-parser to'g'ri ishlaydi), bo'sh `<h1></h1>`, yopilmagan `<h1>x`, `<h1/>`, `<title>`, yaroqsiz selektor (yiqilmaydi, `false`), `<p><div>` (parser p ni yopadi — to'g'ri), `<ul><li>a<li>b</ul>`, `<html><body>` to'liq hujjat, `<form><form>`.
- ✓ o'tdi: `text` — bo'sh, faqat probel, `&nbsp;`, ichma-ich `<h1><b>x</b></h1>`, ichida faqat `<img>`/`<br>`/izoh (bo'sh — to'g'ri), entity `&amp;`, yopilmagan `<p>Salom`.
- ✓ o'tdi: `attr`/`attrs` — `alt=""`, qiymatsiz `alt`, `alt="  "`, `HREF` katta harf, tirnoqsiz/bir tirnoq, `equals` probelli qiymat, `<IMG SRC ALT>`, `href="#"` (bor hisoblanadi).
- ✓ o'tdi: `nested` — descendant, `<p><div>`/`<p><ul>`/`<a><a>` (parser to'g'ri), `<table><tr><td>` (tbody), `<li>` tashqarida.
- ✓ o'tdi: `count` — 3/3, 2/3, izohdagi `<li>` sanalmaydi, yopilmagan `<li>` ketma-ket, ichma-ich `<p><p><p>`, `count:'3'` satr.
- ✓ o'tdi: `cssProp/cssValue` — `h1, p {}` guruh, `h1,p{}`, `!important`, izoh ichidagi qoida (topilmaydi — to'g'ri), qiymat/xossa atrofidagi probel, `COLOR:` katta harf xossa, `H1{}` katta harf selektor (CSSOM kichraytiradi), `.Card` vs `.card` (farqlanadi — to'g'ri), `display:flex`, `text-align:center`, `gap`, `padding`, `border`, `border-radius`, `list-style→list-style-type`, `place-items`, `transition`, `overflow`, `font`, `flex`, `inset`, `grid-template*`, `--custom`, `a:hover`, `a::before`, `#id`, `ul li a`, `h1.big`, `h1 > .big`, `@import`/`@charset`/`@font-face` dan keyingi qoida topiladi, yopilmagan izoh (`/*`) — keyingisi yo'qoladi (CSS semantikasi), bo'sh CSS.
- ✓ o'tdi: `js` — oddiy regex, `//` va `/* */` izoh ichidagi kod hisobga olinmaydi, `const`/`var` vs `let` farqi, `console.log(` vs `console. log(`, bo'sh/undefined js, `addEventListener('click'` vs `onclick=`.
- ✓ o'tdi: `custom` — funksiya `true`/satr/`false`/`throw` (→ «tekshirishda xatolik»).

**specToCheck / buildLabel / normalizeReq / runOne (UI orqali, 70 hol):** ✓ o'tdi: `tag`, `tag+text`, `tag+attr(+equals)`, `tag+attrs`, `tag+child`/`nested`, `tag+count`, `sel`, `css{sel,prop}`/`{value}`, `js` (regex va oddiy satr), `logs` (5/0/''/false/null), `eval+equals`, `click+read+expect`, `toggle+a+b`, noma'lum kalit (→ «shart aniqlanmadi», yiqilmaydi), bo'sh `{}`, `hint` `{uz,ru}` va satr — ikkala tilda to'g'ri chiqadi, avto-label 12 turi UZ va RU da to'g'ri, eski `re:` uslubi (izoh olib tashlanadi, hint RU), eski `check:` funksiya + `hint` obyekt, `requirements: []` (0/0), `count:0`, id-siz ikki bir xil `tag` (avto-id `h10`/`h11` — to'qnashmaydi).

**parseCss:** ✓ o'tdi: vaqtinchalik `<style>` sahifaga TA'SIR QILMAYDI (body fon, `.hc-root{display:none}` yozilganda ham `display:flex` qoladi — o'lchandi), 100 marta chaqirilganda `<style>` teg qolib ketmaydi (1→1), yaroqsiz `@import` da ham `el.remove()` chaqiriladi, `url()` (background/cursor/content/list-style/font-face) TARMOQ SO'ROVI YUBORMAYDI (element ulanmagani uchun) — faqat `@import` yuboradi (quyida topilma).

**lintHtml (322 hol):** ✓ o'tdi: barcha «to'g'ri HTML» namunalarida 0 xato — doctype+html, `<ul><li>a<li>b</ul>`, `<p>a<p>b`, `<p>a<div>`, ixtiyoriy yopiladigan `td/tr/option/dt/dd/thead/tbody`, `<br>`/`<br/>`/`<br />`, void teglar, izoh ichidagi teg/`>`/`--`, atribut ichidagi `>`/`<`/`</a>`, aralash tirnoq, matndagi apostrof/tirnoq/`2 < 3`/`<=`/`<3`, entity, `<pre>`, svg self-closing, custom element, `<template>`, ko'p qatorli atributlar, tirnoqsiz atribut, bo'sh atribut, katta/aralash harf `<H1></h1>`, `</h1 >`, `<li>` ichida `<ul><li>`, `<p>` yopilmay `</div>/</section>/</body>/<h1>/<ul>/<table>`, `<b><p>z</b>`. Xato holatlar to'g'ri ushlanadi va satr raqami to'g'ri: yopilmagan `<h1>`, `</h1>` yolg'iz, `<b><i>x</b></i>` (2 xato), yopilmagan tirnoq/izoh/`<!`, `<h1 <p>`, `<img ... ` oxirida, `<ul>…</ol>` typo, `<img>x</img>`, `</br>`, `<div><div></div>`, ko'p qatorli holatlarda L2/L3/L5 raqamlari to'g'ri, `<h1>x</h2>` (2 xabar: `</h2>` mos emas + `<h1>` ochiq).

**Runtime harness (iframe):** ✓ o'tdi: sandbox — `localStorage`/`document.cookie`/`parent.document`/`top.localStorage` → SecurityError, `top.location=` bloklanadi, `origin: null`; harness `load` dan keyin ishlaydi (`window.addEventListener('load', …)` ichidagi log ushlanadi); `document.write` bilan birga ishlaydi; `throw` dan keyingi/oldingi log ushlanadi; `eval_equals` `var`/`let`/`typeof`/xato tashlaydigan ifoda; `click_text` (textContent, `innerHTML='<b>7</b>'`), boshidan matn bo'lsa o'tmaydi (JS-siz o'tmaslik — dizayn); `toggle` (Kunduz/Tun, «Kunduz rejimi» qo'shimchali); `while(true){}` — SAHIFA QOTMAYDI (Chrome sandbox-iframe alohida jarayonda), keyingi tahrir yangi iframe bilan tiklanadi; konsol: `log/info/warn/error` darajalari, ko'p argument, obyekt/massiv JSON, `null`/`undefined`, `Uncaught ReferenceError`/`SyntaxError` matni chiqadi; forged konsol xabari matn sifatida (XSS yo'q) chiqadi.

---

## Topilmalar

### K-C-01 · `cssValue` — hex rang va CSSOM tomonidan qayta yozilgan qiymatlar HECH QACHON mos kelmaydi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:406–411 (`cssValue`), 552–555 (`getPropertyValue` — CSSOM serializatsiyasi)
- Qanday takrorlash: `C.cssValue('h1','color','#ff0000')` + CSS `h1{color:#ff0000}` → qizil. Xuddi shunday: `#fff`/`#FFF`/`#ffffff`/`white` ↔ `#fff`, `hsl(...)`, `rgba(0,0,0,.5)` (`rgba(0, 0, 0, 0.5)` bo'lib qoladi), `margin:0` (→`0px`), `margin:0 auto` (→`0px auto`), `inset:0`, `flex:1` (→`1 1 0%`), `transition:all .3s` (→`0.3s`), `flex-flow:row wrap` (→`wrap`), `list-style:none inside` (→`inside none`), `box-shadow:0 0 3px red` (→`red 0px 0px 3px`), `font-weight:bold` ✓ lekin `700`≠`bold`, `url(x.png)` (→`url("x.png")`), `currentColor` (→`currentcolor`), `background:#eee`, `text-decoration:none`, `border-bottom:1px solid red`, `outline:none`, `overflow-x` ↔ `overflow`. Skript: `tc-1-builders.mjs` (NOTE-lar), `tc-6-confirm.mjs` [6].
- Kutilgan: o'quvchi aynan so'ralgan qiymatni yozsa — yashil. · Kuzatilgan: 0/5 (skrinshot), maslahat «`h1` da `color: #ff0000` yozing» — o'quvchi allaqachon yozgan.
- Dalil: `tc-shot-css-false-negative.png`; `tc-1-compact.txt` (cssValue: #FFF/#ffffff/margin 0/inset/flex 1/transition/box-shadow qatorlari); `tc-6-confirm.mjs` chiqishi `[6 css value/prop UI] c:RED m:RED b:RED t:RED f:RED bgc:RED tr:RED`.
- Izoh: Hozirgi darslar faqat kalit-so'z qiymatlar (`flex`, `center`, `column`) ishlatgani uchun yashirin turibdi. Har qanday rang-hex, `0`, uzunlik-tartib yoki qisqa-xossa qiymati bilan yoziladigan yangi shart o'quvchini boshi berk ko'chaga qamaydi («to'g'ri yozdim, nega qizil?»). `cssValue` da qiymatni «aynan» solishtirish CSSOM ning normallashtirilgan ko'rinishiga qarshi.

### K-C-02 · Runtime natijasini o'quvchi kodi SOXTALASHTIRA oladi (postMessage, `e.source`/origin tekshiruvi yo'q, nonce = oddiy sanoq)  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1016–1026 (`onMsg`: faqat `d.__hcReport && d.nonce === nonceRef.current`), 839 (`nonce` iframe'ga ochiq yuboriladi), 962–964 (`nonceRef` 0 dan sanaladi)
- Qanday takrorlash: script.js: `setTimeout(()=>{ var r={}; for(var i=0;i<20;i++) r['r'+i]=true; for(var n=1;n<200;n++) parent.postMessage({__hcReport:true,nonce:n,results:r},'*'); },400)` — id berilmagan runtime shartlar avto-id `r0..rN` oladi. Kechiktirish shart (haqiqiy harness hisobotidan KEYIN kelishi kerak; kechiktirmasa haqiqiy hisobot ustidan yozadi — `tc-4` [C forge] o'tmadi, `tc-6` [1]/[1b] o'tdi).
- Kutilgan: faqat tekshiruv-iframe'idan (`e.source === checkIframe.contentWindow`) kelgan hisobot qabul qilinishi. · Kuzatilgan: barcha runtime chiplar yashil, «Davom etish» ochiq (`next {disabled:false}`), hech qanday `console.log`/funksiya yozilmagan.
- Dalil: `tc-shot-forged-report.png`; `tc-6-confirm.mjs` chiqishi `[1 delayed forge] chips ok:true ok:true next {disabled:false}`, `[1b auto-id forge]` ham.
- Izoh: Ikkala iframe ham `origin: null` — origin bilan farqlab bo'lmaydi, lekin `e.source` bilan bo'ladi. Konsol-xabar (`__hcConsole`) uchun ham xuddi shu (forged matn konsolda 2 marta chiqadi — preview va tekshiruv iframe'idan). O'quvchilar orasida «hack-snippet» tarqalsa butun JS-modul shartlari ma'nosiz bo'ladi. (Qo'shimcha: `window.__logs=['999']` yozib `logs()` ni ham aldash mumkin — `tc-4` [C __logs].)

### K-C-03 · `js` shartida satr ichidagi `//` (URL!) qatorning qolganini «izoh» deb o'chiradi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:354–357 (`stripJsComments` — satr/regex/template literal hisobga olinmaydi)
- Qanday takrorlash: `C.js(/addEventListener/)` + script.js: `const link = 'http://t.me/x'; btn.addEventListener('click', f);` → qizil. Keyingi qatorga o'tkazilsa yashil (`tc-6` [4b]). Shuningdek satrdagi `"/*"` keyingi `*/` gacha hammani yeydi; `"http://x"` dan keyingi kod yo'qoladi.
- Kutilgan: yashil. · Kuzatilgan: «Skriptda kerakli qism topilmadi».
- Dalil: `tc-shot-js-url-comment.png`; `tc-6-confirm.mjs` `[4 // in string] ok:false`, `[4c // realistic] ok:false`; `tc-1-compact.txt` js: URL/`/*` qatorlari.
- Izoh: URL-satrlar (`img.src="https://…"`, `fetch("https://…")`, `href`) JS darslarida tabiiy; o'quvchi bir qatorda yozsa shart sababsiz qizil qoladi va maslahat noto'g'ri yo'naltiradi.

### K-C-04 · `cssProp` — ro'yxatda bo'lmagan qisqa xossalar va `@media`/`@supports`/`@layer` ichidagi qoidalar topilmaydi (yolg'on-salbiy)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:548–549 (`.filter(r => r.style)` — `CSSMediaRule` tushib qoladi, ichiga kirilmaydi), 561–563 (qisqa-xossa ro'yxati cheklangan; `'gridArea'` camelCase — hech qachon ishlamaydi)
- Qanday takrorlash: `cssProp('a','border-bottom')` + `a{border-bottom:1px solid red}` → qizil; xuddi shunday `text-decoration`, `outline`, `border-color/width/style`, `columns`, `animation`, `grid-area`, `-webkit-text-stroke`; `cssProp('h1','font-size')` + `@media (max-width:600px){h1{font-size:2em}}` → qizil.
- Kutilgan: yashil. · Kuzatilgan: «`a` uchun `border-bottom` xossasini yozing» (yozilgan bo'lsa ham).
- Dalil: `tc-6-confirm.mjs` `[6] bo:RED td:RED ga:RED me:RED`; `tc-shot-css-false-negative.png` (3,4,5-chiplar); `tc-1-compact.txt` cssProp: text-decoration/outline/columns/border-width/animation/border-bottom/grid-area/gridArea/@media/@supports/@layer.
- Izoh: Ro'yxat qo'lda to'ldirilgan (F-0809-04 dan keyin), CSS-modul kengaygan sari yana «kulrang qolib qamalish» sinfi qaytadi; responsive (`@media`) darsi umuman tekshirib bo'lmaydi.

### K-C-05 · `specToCheck` — `js:` kaliti SATR bo'lsa `new RegExp` maxsus belgida yiqiladi → butun kompilyator OQ EKRAN  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:465 (`new RegExp(s.js)` — ekranlanmaydi), 919–922 (`useMemo` render ichida — xato React daraxtini yiqitadi, error boundary yo'q)
- Qanday takrorlash: `requirements: [{ js: 'console.log(' }]` yoki `{ js: 'alert(' }` → `#root` bo'sh, konsolda `Invalid regular expression: /console.log(/: Unterminated group` + React «An error occurred in the <HtmlCompiler> component».
- Kutilgan: satr = oddiy matn-qidiruv (yoki aniq xato-xabar). · Kuzatilgan: dars ekrani butunlay yo'qoladi.
- Dalil: `tc-5-spec.mjs` `[js string maxsus belgi "console.log("] {"mounted":false,"root":""}`, `tc-6` [7] `root=""`. Qo'shimcha: `{js:'a.b'}` `aXb` ga ham mos keladi, `{js:'arr[0]'}` `arr[0]` ni topmaydi (regex sifatida o'qiladi).
- Izoh: Hujjat (446–457) satr-variantni taqiqlamaydi; muallif tabiiy ravishda `js: 'console.log('` yozadi va o'quvchi oq ekran ko'radi. Hozirgi darslarda satr-`js` ishlatilmagan.

### K-C-06 · `@import` bo'lgan o'quvchi CSS'i DARS SAHIFASI (top-level, sandbox'siz) nomidan tarmoq so'rovi yuboradi — har tugma bosishda  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:543–545 (`document.head.appendChild(el)` — asosiy hujjat), 1041–1052 (har `css` o'zgarishida qayta chaqiriladi)
- Qanday takrorlash: style.css ga `@import url("http://127.0.0.1:4517/tc-imp-a.css");` yozib 5 ta probel qo'shish → 6 ta HTTP so'rov (`page.on('request')`), so'rov dars-origin'idan (cookie/credential bilan) ketadi; `https://example.invalid/…` ham so'raladi (`ERR_NAME_NOT_RESOLVED`).
- Kutilgan: tekshiruv-parslash tarmoqqa chiqmasin (yoki hech bo'lmasa sandbox ichida). · Kuzatilgan: `[css-net] @import url: newRequests=[".../tc-import-1.css"]`, `[12 @import per keystroke] requests: 6`.
- Dalil: `tc-3-css.mjs` va `tc-6-confirm.mjs` [12] chiqishlari.
- Izoh: `url()` lar (background/cursor/font-face) ulanmagan element tufayli so'ralmaydi — faqat `@import`. Xavf: LMS ichida ishlaganda o'quvchi CSS'i orqali dars-domen nomidan ixtiyoriy URL «ping» qilinadi (kuzatuv/SSRF-sinf), keystroke-tezligida.

### K-C-07 · `js` shartida `/g` bayroqli regex — natija har tugma bosishda YONIB-O'CHADI (lastIndex holati)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:414–415 (`re.test(...)` — global regex holatli)
- Qanday takrorlash: `C.js(/x/g)` + script.js `x`, keyin oxiriga probel qo'shib boriladi → chip: `false, true, false, true, false, true` (`tc-6` [3]); `/x/` bilan: `true,true,true,true` ([3b]). To'g'ridan-to'g'ri: `check(ctx)` 1-chaqiriq `true`, 2-chaqiriq `false` (`tc-1` «/g bayroqli regex», `!!R2DIFF`).
- Kutilgan: barqaror. · Kuzatilgan: chip miltillaydi, «Davom etish» tasodifiy ochiladi/yopiladi.
- Dalil: `tc-6-confirm.mjs` `[3 /g regex] ok-ketma-ketligi [false,true,false,true,false,true]`.
- Izoh: Hozirgi darslarda `/g` ishlatilmagan (grep 0), lekin muallif «hammasini top» ma'nosida `/g` qo'shsa darrov namoyon bo'ladi va tashxisi qiyin.

### K-C-08 · `cssValue` da qiymat RAQAM (`2`, `0`) bo'lsa — `norm(val).trim` yiqiladi → «tekshirishda xatolik»  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:349 (`norm` faqat satr), 408 (`norm(val)`), 463 (`specToCheck` `value` ni satrga aylantirmaydi), 756–758 (catch → umumiy xato)
- Qanday takrorlash: `C.cssValue('h1','z-index',2)` yoki `{ css:{sel:'h1',prop:'z-index',value:2} }` + `h1{z-index:2}` → chip «tekshirishda xatolik». (`value: 0` — `equals`/`norm(0)` → `'0'||''`… `0` falsy → `norm('')` → `''` ≠ `'0px'` → «yozing» maslahati; ya'ni ikkalasi ham hech qachon o'tmaydi.)
- Kutilgan: raqam qiymat satrga keltirilib solishtirilishi (`logs`/`evalEquals` da `String()` bor, bu yerda yo'q). · Kuzatilgan: «tekshirishda xatolik» — o'quvchi uchun ma'nosiz.
- Dalil: `tc-1` «cssValue: value = raqam (number tipida) => THROW: (s || "").trim is not a function»; `tc-5` `[css value son (number)] hint:"tekshirishda xatolik"`; `tc-6` [6] `z:RED(tekshirishda xatolik)`.

### K-C-09 · Xato-satr raqami ko'rsatilmaydi (`Uncaught ReferenceError: foo is not defined` — QAYERDA?)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:791 (`send('error',[e.message])` — `e.lineno`/`e.colno` tashlab yuboriladi; `wrapDoc` da JS `<script>` ichida — satr raqamlari `script.js` ga mos ham emas)
- Qanday takrorlash: script.js 5-qatorda `foo();` → konsol: `›Uncaught ReferenceError: foo is not defined` (satr yo'q); 8-qatorda `null.foo;` → `Cannot read properties of null (reading 'foo')` (satr yo'q); sintaksis xatosi ham satrsiz.
- Kutilgan: hech bo'lmaganda `script.js:5`. · Kuzatilgan: faqat matn.
- Dalil: `tc-shot-console.png`; `tc-4` [B], `tc-6` [9].
- Izoh: 13 yoshli o'quvchi «qayerda xato?» savoliga javob topolmaydi — HTML-linter satr beradi, JS esa yo'q; ayniqsa `Davom etish` yopiq turganda.

### K-C-10 · `lintHtml` inline `<script>`/`<textarea>` ICHINI HTML deb tekshiradi → to'g'ri kodga soxta xato va «Davom etish» yopiladi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:637–727 (raw-text elementlar `script/style/textarea/title` uchun maxsus rejim yo'q)
- Qanday takrorlash: `<h1>Salom</h1>\n<script>\nlet s = "<b>salom";\n</script>` → «⚠ Qator 3: `<b>` yopilmagan — `</b>` kutilgan, `</script>` keldi», `Davom etish` disabled (title: «Sintaksis xatosi tuzatilsa ochiladi»); `if(a<b){}` → «`<b` tegi `>` bilan yopilmagan»; `for(i=0;i<a.length;i++)` → «`<a` tegi …»; `var s="</div>"` → «`</div>` mos ochuvchi tegga ega emas»; `<script>var s="<!--"</script>` → «Izoh yopilmagan»; `<textarea><b>salom</textarea>` → xato. (`<style>` ichidagi `a>b{}` va `<!--` — o'tadi.)
- Kutilgan: 0 xato (brauzer `<script>` ichini matn deb oladi). · Kuzatilgan: qizil xato, tugma yopiq.
- Dalil: `tc-shot-lint-script.png`; `tc-6` [5b] `next {disabled:true}`, [5c]; `tc-2-compact.txt` «<script> ichida …» qatorlari (~20 hol).
- Izoh: Hozirgi darslar JS ni alohida faylga yozdiradi, lekin o'quvchi (yoki 1-modul HTML darsi) `<script>` ni HTML ichiga qo'ysa, to'g'ri kod bilan qamalib qoladi; `<textarea>` forma-darsida real.

### K-C-11 · `logs()` — substring qidiruv: `999` ↔ `1999`, `10` ↔ `100`, `'1 2 3'` ↔ literal `console.log('1 2 3')`  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:805–807 (`indexOf`)
- Qanday takrorlash: `C.logs('999')` + `console.log(1999)` → yashil; `C.logs('1 2 3')` + `console.log('1 2 3')` (siklsiz) → yashil.
- Kutilgan: (dizayn qarori) · Kuzatilgan: yolg'on-ijobiy. Teskarisi: `console.log(i + ' ')` (oxirida probel) yoki `'Son: ' + i` → qizil (`tc-4` [C trailing space], [C prefixed]).
- Dalil: `tc-4-runtime.mjs` [C substring 1999] ok:true, [C literal] ok:true.

### K-C-12 · `attr`/`text`/`attrs` faqat BIRINCHI mos elementni ko'radi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:365–387 (`x.$(sel)` = `querySelector`)
- Qanday takrorlash: `<a>menyu</a>\n<a href="about.html">Biz haqimizda</a>` + `C.attr('a','href')` → qizil «`a` da `href="..."` to'ldiring»; `<p></p><p>Matn bor</p>` + `C.text('p')` → qizil «ichi bo'sh».
- Kutilgan: kamida bitta mos element yetadi (yoki maslahat «birinchi `<a>`»ni aniq aytsin). · Kuzatilgan: to'g'ri element bo'lsa ham qizil.
- Dalil: `tc-6` [8 first-element-only].

### K-C-13 · Cheksiz/uzoq sikl — chip abadiy «ishga tushirilmoqda…», sabab aytilmaydi; preview + tekshiruv iframe'lari ketma-ket ishlaydi (vaqt 3× uzayadi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1067–1069 (natija kelmasa taym-aut yo'q), 843 (`setTimeout(runProbes,50)`)
- Qanday takrorlash: `while(true){}` → sahifa TIRIK (✓), chip «ishga tushirilmoqda…» abadiy; `4 s band sikl` → chip 12,5 s dan keyin yashil (`tc-6` [2]: 2,5/4,5/…/10,5 s pending, 12,5 s ok) — sabab: preview va tekshiruv iframe'lari bir jarayonda navbat bilan bajariladi.
- Kutilgan: N sekunddan keyin «kod tugamadi — cheksiz sikl bo'lishi mumkin». · Kuzatilgan: jim.
- Dalil: `tc-4` [D loop], `tc-6` [2 busy4s].

### K-C-14 · `alert()`/`prompt()`/`confirm()` sandbox'da JIM o'chirilgan (`allow-modals` yo'q) — o'quvchiga hech qanday xabar yo'q  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1851, 1886 (`sandbox` bayroqlari)
- Qanday takrorlash: `alert('Salom!'); var ism = prompt('Isming?'); console.log('ok', ism);` → ekranda hech narsa, konsolda `ok null` (Chrome konsolida: «Ignored call to 'alert()'. The document is sandboxed…» — o'quvchi ko'rmaydi).
- Kutilgan: yoki ishlashi, yoki «bu muhitda alert ishlamaydi — console.log ishlating» ogohi. · Kuzatilgan: jim.
- Dalil: `tc-4` [A] `ALERT-RETURNED undefined`, `PROMPT: null`, `CONFIRM: false`; `tc-6` [10].
- Izoh: Darslarda `alert/prompt` shart sifatida ishlatilmagan (grep), lekin o'quvchi YouTube'dan o'rganib yozishi tabiiy.

### K-C-15 · O'quvchi JS'ida `"</script>"` satri butun natija-hujjatni buzadi (`Uncaught SyntaxError`)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:900 (`<script>${js || ''}<\/script>` — `</script` ekranlanmaydi; CSS uchun ham `</style>`)
- Qanday takrorlash: `var s = "<script>alert(1)</script>"; console.log('ok');` → konsol «Invalid or unexpected token», `logs('ok')` qizil. (`"<p>salom</p>"` — muammosiz.)
- Dalil: `tc-4` [C </script> in js], `tc-6` [11b].

### K-C-16 · Konsolda DOM-element `{}`, `Map` `{}`, aylanma obyekt `[object Object]`, `%s` format ishlamaydi, `console.debug/table` chiqmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:782 (`fmt` — `JSON.stringify` yoki `String`), 787 (`['log','info','warn','error']`)
- Qanday takrorlash: `console.log(document.getElementById('p'))` → `{}`; `console.log('%s dunyo','salom')` → `%s dunyo salom`; `console.debug('x')` → yo'q.
- Dalil: `tc-4` [A] konsol qatori `{"a":1,"b":[1,2]} [1,"x"] null undefined function f(){} 12 Symbol(s) {} {}`; `tc-6` [9] `›{}`.
- Izoh: DOM darsida `console.log(element)` — eng birinchi «tekshirib ko'rish» usuli; `{}` chalg'itadi.

### K-C-17 · `click_text`/`toggle` — asinxron DOM (`setTimeout(…,0)`), `input.value`, «kutilgan matn boshidan bor», «A matni B ichida» hollari hech qachon o'tmaydi, maslahat sababini aytmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:811–834
- Qanday takrorlash: click handler ichida `setTimeout(()=>out.textContent='7',0)` → qizil; `<input id="out">` + `.value='7'` → qizil (faqat `textContent`); `domAfterClick('#like','#son','1')` + `<p id="son">Layklar: 10</p>` (`'1'` allaqachon bor) → hech qachon o'tmaydi; `toggle('#b','#b','Kun','Kunduz')` (A ⊂ B) → hech qachon o'tmaydi. Hammasida maslahat: «natija kutilgancha emas».
- Dalil: `tc-4` [C click async setTimeout 0], [C click input value]; `tc-6` [13], [14].

### K-C-18 · Bir xil `id` li ikki runtime shart — ikkalasi ham qizil (natija ustma-ust yoziladi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:837 (`out[p.id]=ok`), 1069–1071 (`runtimeResults[r.id]`)
- Qanday takrorlash: `[{id:'x',logs:'A'},{id:'x',logs:'B'}]` + `console.log('A')` → 0/2 (id-siz variantda 1/2 — to'g'ri).
- Dalil: `tc-5` `[id takror runtime aniq id bir xil] 0/2`.

### K-C-19 · `lintHtml` — `<head>` yopilmasa (`<title>x</title>\n<body>`) va `<html>`/`<body>` yopilmasa xato + «Davom etish» yopiq (HTML'da bu teglarning yopilishi ixtiyoriy)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:587 (`OPTIONAL_CLOSE` da `html/head/body` yo'q)
- Qanday takrorlash: `<!DOCTYPE html>\n<html>\n<head>\n<title>x</title>\n<body>\n<h1>Salom</h1>\n</body>\n</html>` → «⚠ Qator 3: `<head>` yopilmagan — `</head>` kutilgan, `</html>` keldi», tugma yopiq.
- Dalil: `tc-6` [5e] `next {disabled:true}`; `tc-2-compact.txt` «<html><head><body> yopilmagan» (3 xato).
- Izoh: Pedagogik jihatdan «yoping» deyish o'rinli bo'lishi mumkin — lekin xabar «yopilmagan — `</html>` keldi» ko'rinishida chalkash va brauzer bu kodni to'g'ri ko'rsatadi.

### K-C-20 · `lintHtml` — tirnoqsiz atribut `/` bilan tugasa (`<a href=a/>x</a>`) self-closing deb olinadi → soxta «Ortiqcha yopuvchi teg `</a>`»  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:709 (`c === '/' && src[j+1] === '>'` — tirnoqsiz qiymat ichida ham)
- Qanday takrorlash: `<h1>Salom</h1>\n<a href=a/>x</a>` → «⚠ Qator 2: Ortiqcha yopuvchi teg `</a>`», tugma yopiq. Brauzer: `href="a/"`, `<a>` ochiq.
- Dalil: `tc-6` [5f]; `tc-2-compact.txt` «tirnoqsiz atribut ichida / oxirida».

### K-C-21 · `lintHtml` — `<div/>`, `<h1/>`, `<p/>`, `<span/>`, `<script/>` self-closing deb qabul qilinadi (brauzer ochiq qoldiradi) — xato o'tkazib yuboriladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:722 (`!selfClose && !VOID_TAGS.has` — void bo'lmagan teg uchun ham `/>` yopadi)
- Qanday takrorlash: `<h1>Salom</h1>\n<div/>\n<p>x</p>` → 0 xato, lekin brauzerda `<div>` ochiq qoladi (`<p>` uning ichida); `<script/>alert(1)` → 0 xato, brauzerda `<script>` qolgan hujjatni yutadi.
- Dalil: `tc-6` [5g] `err null`; `tc-2-compact.txt` «<h1/>x», «<div/>x», «<script/>».

### K-C-22 · `cssProp/cssValue` selektor-solishtiruv «aynan matn»: `nav>a` ↔ `nav > a`, `input[type=text]` ↔ `input[type="text"]`, `DIV` so'rovi ↔ `div`, `h1, p` guruh-so'rov hech qachon mos kelmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:400, 408 (`r.selector.split(',').map(norm).includes(norm(selector))`)
- Qanday takrorlash: `cssValue('h1>.big','color','red')` + `h1 > .big{color:red}` → qizil; `cssProp('input[type=text]','color')` + `input[type=text]{}` → qizil (CSSOM `[type="text"]` yozadi); `cssProp('h1, p','text-align')` → qizil (so'rov guruh, split qilingan bo'laklar bilan solishtiriladi); `cssProp('DIV',…)` → qizil (o'quvchi `DIV{}` yozsa esa o'tadi).
- Dalil: `tc-1-compact.txt` cssProp/cssValue: `nav > a` (o'quvchi probelsiz yozsa ✓, so'rov probelsiz bo'lsa ✗), `[type=text]`, `h1,p`, `DIV`, `h1>.big`.

### K-C-23 · CSS uchun sintaksis-linter YO'Q: yopilmagan `{`, ortiqcha `}`, `;` yo'qligi, `//` izoh — jim, faqat shart «yozing» deb turadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:541–571 (parseCss — CSSOM kechirimchi, xato haqida signal yo'q); HTML uchun 637 dan linter bor, CSS/JS uchun yo'q
- Qanday takrorlash: `h1{color:red}} \n h1{text-align:center}` → ortiqcha `}` keyingi qoidani yutadi → «`h1` da `text-align: center` yozing»; `h1{\n// markazga\ntext-align:center}` → `//` keyingi deklaratsiyani yeydi; `p{color:red\nh1{text-align:center}` (yopilmagan) → CSS-nesting sifatida `p h1` bo'lib ketadi; `color:red text-align:center` (`;` yo'q) → ikkalasi ham yo'qoladi. O'quvchi «to'g'ri yozdim» deb o'ylaydi.
- Dalil: `tc-1-compact.txt` «text-align center, boshida/ichida …» seriyasi (30+ hol).
- Izoh: Faqat tashxis — CSS-linter kiritish jarayon-qarori.

### K-C-24 · `check` funksiyasi `{uz,ru}` obyekt qaytarsa — maslahat BO'SH chiqadi (`tr` qilinmaydi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:748 (`typeof r === 'string' ? r : tr(req.hint)`)
- Qanday takrorlash: `check: () => ({uz:'U-obj', ru:'R-obj'})` → chip qizil, hint `''`, `.hc-hint` yo'q. (`hint:` maydoni obyekt bo'lsa ✓ ishlaydi — F-0809-04.)
- Dalil: `tc-5` `[check {uz,ru} obyekt qaytarsa] hint:""`.

### K-C-25 · Ko'p faylli task'da faqat BIRINCHI `css`/`js` fayl tekshiriladi; HTML ichidagi `<style>`/`<script>` `cssProp`/`js` uchun ko'rinmaydi, lekin `logs` uchun ko'rinadi (nomuvofiq)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:951–955 (`byLang` — `find`), 1041–1052 (`ctx.js/css` faqat fayl-manba)
- Qanday takrorlash: `[a.js:'', b.js:'alert(1)']` + `C.js(/alert/)` → qizil; `<style>h1{color:red}</style>` (CSS fayl yo'q) + `cssProp('h1','color')` → qizil; `<script>console.log("A")</script>` + `logs('A')` → yashil.
- Dalil: `tc-5` `[ikkita js fayl…]`, `[CSS fayli yo'q…]`, `[JS fayli yo'q, logs shart] ok:true`.

### K-C-26 · Hujjatlashtirilmagan ustuvorlik: `{tag, count, text}` → faqat `count`; `{tag, attr, text}` → faqat `attr`; `{tag, attr, attrs}` → `attrs`; `text:'salom'` qiymati e'tiborga olinmaydi; `sel`+`tag` → `tag`  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:470–477 (if-zanjiri), 446–457 (izoh)
- Dalil: `tc-5` `[tag+count+text] ok:true` (bo'sh `<li>` lar), `[tag+attr+text] ok:true` (bo'sh `<a href>`), `[tag+text:"salom"] ok:true` (`<h1>boshqa</h1>`).

### K-C-27 · `eval` shartida `equals` berilmasa ifoda `undefined` bo'lganda o'tadi; `click` da `read`/`expect` yo'q bo'lsa `'undefined'` bilan solishtiriladi; `toggle` da `a/b` yo'q → label «undefined ⇄ undefined»; `css:{}` → label «CSS: undefined { undefined }»  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:466–469, 485–489
- Dalil: `tc-5` `[eval equals yo'q] ok:true`, `[click expect yo'q] label "bosilsa «undefined»" ok:true`, `[toggle a/b yo'q]`, `[css bo'sh obyekt]`.

### K-C-28 · `attr(..., equals)` katta-kichik harfga sezgir (`type="EMAIL"` ≠ `email`), `has('input[type="email"]')` esa sezgir emas — ikki shart bir xil HTML'ga qarama-qarshi javob beradi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:377
- Dalil: `tc-1-compact.txt` «attr: equals katta harf EMAIL» ✗ va «has: atribut selektor input[type=email]» ✓.

### K-C-29 · `attrs: []` va `count: 0` har doim yashil (bo'sh shart)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:385–386, 394–395
- Dalil: `tc-5` `[attrs bo'sh] ok:true`, `[count = 0] ok:true`.

### K-C-30 · `text` — `​` (zero-width) va `<h1><script>x</script></h1>` «matn bor» hisoblanadi; `display:none` matn ham  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:368 (`textContent`)
- Dalil: `tc-1-compact.txt` text: zero-width/script/style/display:none.

### K-C-31 · `js` — satr/template literal ichidagi kod ham «bor» hisoblanadi (`console.log("let x")` → `let\s+x` ✓)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:354–357
- Dalil: `tc-1-compact.txt` «js: satr ichida "let x" => true», «template literal => true».

### K-C-32 · Runtime probe faqat `load`+50 ms da bir marta ishlaydi — `setTimeout(…,200)`/`fetch`/`console.info` natijalari ushlanmaydi, sabab aytilmaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:843–845, 769 (faqat `console.log` ushlanadi)
- Dalil: `tc-4` [C async 200ms] ok:false, [C console.info] ok:false.

### K-C-33 · `lintHtml` — `<!--->`/`<!-->` (spec bo'yicha bo'sh izoh) «Izoh yopilmagan»; `<p>x</ p>` → «`</>` mos ochuvchi tegga ega emas» (bo'sh nom); `<_a>` → «`</>`»  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:652–655, 666–669
- Dalil: `tc-2-compact.txt` «<!--->», «<!-->», «<p>x</ p>», «<_a>x</_a>».

---

## Xavfsizlik xulosasi (qisqa)
- Sandbox (`allow-scripts allow-popups allow-popups-to-escape-sandbox`, tekshiruv-iframe: `allow-scripts`) — `allow-same-origin` YO'Q ✓: o'quvchi kodi darsning `localStorage`/cookie/DOM'iga chiqa olmaydi, `top` ni navigatsiya qila olmaydi (o'lchandi: hammasi `SecurityError`).
- Ochiq nuqtalar: K-C-02 (natija/konsol xabarini soxtalashtirish — `e.source` tekshiruvi yo'q), K-C-06 (`@import` orqali dars-origin nomidan tarmoq so'rovi), K-C-13 (band sikl — sahifa qotmaydi, lekin CPU/iframe navbat).
