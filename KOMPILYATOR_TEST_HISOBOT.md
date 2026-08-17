# KOMPILYATOR — CHUQUR TEST HISOBOTI (faqat tashxis, tuzatish YO'Q)

**Sana:** 2026-08-17 · **Manba:** `src/compilator/HtmlCompiler.jsx` (2155 qator — TEGILMAGAN) ·
**LMS'dagi nusxa:** `lms/html-compiler.jsx` = `f9e30f4a….jsx` (bayt-bayt bir xil, HC_NASHR 2026-08-13)
**Usul:** 5 mustaqil sinovchi, har biri o'z yo'nalishida kodni o'qidi **va** haqiqiy Chrome'da
stendda (`dev/hc-stend/`, kompilyator yakka holda, React 19) sinadi; har topilma ikki marta
qayta ishlab tasdiqlangan. Yechim taklif qilinmagan — qaror foydalanuvchiniki.
Stend-skriptlar va skrinshotlar: `dev/hc-stend/` (t-*.mjs, tc-*.mjs, *.png, *-out.txt).

---

## 1. Umumiy manzara

| Yo'nalish | Hisobot (asl) | 🔴 kritik | 🟠 muhim | 🟡 mayda | 🔵 taklif | Jami |
|---|---|---|---|---|---|---|
| C — Tekshiruv-motori (`checks`, linter, CSS-parser, runtime-probelar) | §A | 2 | 8 | 15 | 8 | 33 |
| E — Muharrir (bo'yash, avto-to'ldirish, klaviatura, «Chiroyli», tablar) | §B | 1 | 5 | 16 | 3 | 25 |
| P — Natija-oynasi / runtime / xavfsizlik / layout | §C | 1 | 12 | 10 | 4 | 27 |
| M — Til / matn / i18n / o'quvchi-tushunarlilik | §D | 3 | 8 | 13 | 6 | 30 |
| K — Kontrakt / holat-saqlov / darslar-integratsiya / tashqi-modul | §E | 0 | 8 | 9 | 10 | 27 |
| **Jami (xom)** | | **7** | **41** | **63** | **31** | **142** |

Takrorlar (bir muammoni ikki sinovchi turli tomondan ko'rgan) 2-bo'limda birlashtirilgan —
**noyob muammolar ≈ 125.**

### Nima YAXSHI ishlaydi (tasdiqlangan)
- **Xavfsizlik-poydevor:** iframe `sandbox` da `allow-same-origin` YO'Q — o'quvchi kodi darsning
  `localStorage`/cookie/DOM'iga chiqa olmaydi, `top` ni navigatsiya qila olmaydi (hammasi
  `SecurityError`, o'lchandi). `parent.postMessage` 5000 marta — React qotmadi.
- **HTML-linter aniq:** 322 holdan «to'g'ri HTML» namunalarining hammasi 0 xato; xato hollarda
  satr raqami to'g'ri.
- **checks builders asosiy hollarda to'g'ri:** 444 holdan katta qismi ✓ (katta harf, izoh ichidagi
  teg, `<pre>`, entity, guruh-selektor, `!important`, izoh ichidagi CSS/JS…).
- **i18n juftlik 115/115** (uz↔ru), `lint:til` toza, kirill/apostrof/sen-forma yo'q.
- **Xotira oqmaydi:** 20× mount/unmount — listener 40/40, timer tozalanadi, `<style>` 1→0,
  iframe 2→0; barcha CSS-selektorlar `.hc-` prefiksli (LMS bilan to'qnashmaydi).
- `parseCss` vaqtinchalik `<style>` sahifaga ta'sir qilmaydi, `url()` tarmoqqa chiqmaydi.
- `specToCheck` hujjatlashtirilgan 12 tur ham UZ, ham RU da to'g'ri; noma'lum kalitda yiqilmaydi.

---

## 2. ENG MUHIMLARI — birlashtirilgan ustuvor ro'yxat

Og'irlik = birlashtirilgan hukm (bir necha sinovchi ko'rgan bo'lsa, eng og'iri).

| # | Muammo (qisqa) | Og'irlik | Kim ko'rdi | Nima uchun muhim |
|---|---|---|---|---|
| 1 | **Cheksiz sikl** (`while(i<3){}` — `{` avto-yopilishi bilan ODATIY oraliq holat) natija-oynasi va yashirin tekshiruv-iframe'ni **abadiy qotiradi; kod tuzatilgach ham tiklanmaydi**, xabar yo'q, faqat darsdan chiqib-kirish tiklaydi. (checks-sinovchi «tiklanadi» degan edi — qayta sinovda RAD: 40 s HUNG, tuzatishdan keyin 6 s — chip yashil bo'lmadi.) | 🔴 | K-P-01 (+K-C-13) | Sikl darsida har ikkinchi bola shu holatga tushadi |
| 2 | **`cssValue` — hex-rang, `0`, qisqa-xossa qiymatlari HECH QACHON o'tmaydi** (CSSOM `#ff0000`→`rgb(255,0,0)`, `margin:0`→`0px`, `flex:1`→`1 1 0%`). Hozirgi darslar faqat kalit-so'z (`flex`,`center`) ishlatgani uchun yashirin. | 🔴 | K-C-01 (+K-C-08 raqam-qiymat → «tekshirishda xatolik», K-C-22 selektor-matn) | Har qanday yangi rang/uzunlik sharti bolani boshi berk ko'chaga qamaydi |
| 3 | **Runtime-hisobotni o'quvchi kodi soxtalashtira oladi** — `postMessage({__hcReport…})` kechiktirilgan, `e.source`/origin tekshirilmaydi, nonce = 0 dan sanoq → hamma chip yashil, «Davom etish» ochiq. Konsol-satr ham (`__hcConsole`). | 🔴 | K-C-02 = K-P-11 = K-K-14 (+K-P-23) | «Hack-snippet» tarqalsa JS-modul shartlari ma'nosiz |
| 4 | **Fayl-tablar (index.html/style.css/script.js) tor panelda ko'rinmaydi** — 1024–1366 px va telefonda bosib bo'lmaydi | 🔴 | K-E-01 (+K-M-23) | Noutbuk-sinfda CSS/JS tabiga o'ta olmaydi |
| 5 | **Til almashganda** chip-maslahat, linter-xabari, starter-izoh eski tilda qoladi (`__lang` modul-global + `useState` bir marta); rasm-fallback qutisi va `<html lang>` faqat o'zbekcha | 🔴 | K-M-01 = K-K-20, K-M-25 = K-K-21, K-M-03 = K-P-09, K-K-19 | RU-o'quvchi o'zbekcha maslahat ko'radi |
| 6 | **Xato-xabari (linter) 1400 px da ham kesiladi**, «+N» hisoblagich yo'qoladi | 🔴 | K-M-02 | Bola xatoning davomini o'qiy olmaydi |
| 7 | **`<script>`/`<textarea>` ichini linter HTML deb tekshiradi** → `if(a<b)` / `"<b>salom"` da soxta xato, «Davom etish» yopiladi | 🟠 | K-C-10 | To'g'ri kod bilan qamalish |
| 8 | **`//` URL-satr** (`'http://…'`) `js` shartida qolgan kodni «izoh» deb yeydi; `/g` regex miltillaydi | 🟠 | K-C-03, K-C-07 | JS darsida URL tabiiy |
| 9 | **`cssProp` — ro'yxatdan tashqari qisqa xossalar (`border-bottom`, `text-decoration`, `outline`, `grid-area`) va `@media` ichidagi qoidalar topilmaydi** | 🟠 | K-C-04 | Responsive dars tekshirib bo'lmaydi |
| 10 | **OQ EKRAN sinfi (ErrorBoundary yo'q):** `js:'console.log('` satr-spec (RegExp), saqlovda string bo'lmagan qiymat, yaroqsiz `task/files/requirements` → butun dars yo'qoladi | 🟠 | K-C-05, K-K-10, K-K-26 | Muallif-xatosi = o'quvchiga oq ekran |
| 11 | **`@import` o'quvchi CSS'ida — dars-origin nomidan (sandbox'siz) har tugma bosishda tarmoq so'rovi**; modul o'zi ham har mount'da Google Fonts `@import` | 🟠 | K-C-06, K-P-25 = K-K-24 | LMS ichida SSRF-sinf/kuzatuv; offline/CSP |
| 12 | **JS xato-satri raqamsiz** (`Uncaught ReferenceError: foo is not defined` — QAYERDA?), `lineno` 54 satrga siljigan, inglizcha | 🟠 | K-C-09 = K-P-04 | HTML'da satr bor, JS'da yo'q |
| 13 | **`alert/prompt/confirm` jim yutiladi** (xabar yo'q, `prompt` → `null`) | 🟠 | K-C-14 = K-P-05 | YouTube'dan o'rgangan bola tushunmaydi |
| 14 | **Konsol-panel:** 200 satrda jim to'xtaydi, auto-scroll yo'q; DOM/Error/Map obyektlar `{}`; `console.debug/table/clear` yo'q | 🟠 | K-P-06, K-P-07 = K-C-16, K-P-16 | DOM darsida `console.log(element)` = `{}` |
| 15 | **`"</script>"` JS-satr ichida hujjatni buzadi** (`</style>` CSS'da ham) | 🟠 | K-C-15 = K-P-08 | |
| 16 | **`<a href="#…">`/nisbiy havola LMS sahifasini yangi tabda ochadi; har preview-yangilanish brauzer tarixiga yozuv** (Orqaga tugmasi ishlamay qoladi); `meta refresh`/`location.href` tashqi saytga | 🟠 | K-P-02, K-P-03, K-P-18, K-P-17 | LMS ichida navigatsiya buziladi |
| 17 | **baseStyle bola yozmagan uslubni «bo'yab» qo'yadi** (standart shrift/rang/margin) — bola nega bunday ko'rinishini tushunmaydi | 🟠 | K-P-10 | CSS darsida chalkash |
| 18 | **Layout:** 600 px balandlikda sarlavha va «Davom etish» kesiladi (100dvh+overflow:hidden); jonli rejimda har tahrirda natija-scroll 0 ga qaytadi; 14 shartli task sig'maydi | 🟠 | K-P-12, K-P-13, K-M-24 | |
| 19 | **Muharrir:** gorizontal scroll'da bo'yash-qatlam/gutter 15 px siljiydi; «Chiroyli» inline teglarni bo'lib NATIJANI o'zgartiradi; JS/CSS faylida HTML avto-yopish (`i<len && j>` → `</len>`); tanlov ustida Tab tanlovni o'chiradi; juft-teg rename undo nomuvofiq | 🟠 | K-E-02…06 | |
| 20 | **Holat-saqlov:** 400 ms debounce — «Nazad» tez bosilsa oxirgi belgilar yo'qoladi; `task`/`storageKey` runtime'da almashsa eski kod yangi kalitga yoziladi / «arvoh fayl»; `task` har renderda yangi obyekt bo'lsa runtime-shartlar hech qachon yashil bo'lmaydi | 🟠 | K-K-11, K-K-06, K-K-07, K-K-05 | Darsdagi ishlatishga bog'liq |
| 21 | **Bir sahifada ikki kompilyator** — runtime-hisobot va konsol aralashadi (nonce nusxa-identifikatorsiz), `<style>` 2 nusxa | 🟠 | K-K-13 = K-P-26 | Mentor-overlay + o'quvchi-kompilyator birga bo'lsa |
| 22 | **Matn:** backtick ` ekranda ko'rinadi; «xatboshi» (lug'at-taqiq), «xossa»↔«xususiyat» (CSS darslari bilan nomuvofiq), «sintaksis» izohsiz, «typo», «ega emas» (kalka); standart maslahatlar harakat-ko'rsatma emas; `h1` ↔ `<h1>` nomlash; JONLI/LIVE siyosati | 🟠 | K-M-04…11 | MATN_ETALONI |

Qolgan 🟡/🔵 topilmalar (≈90) — quyidagi to'liq bo'limlarda, har biri satr-raqami va dalil bilan.

### Birlashtirilgan takrorlar (bir muammo — bir necha ID)
K-C-02 = K-P-11 = K-K-14 (spoof) · K-C-09 = K-P-04 (xato-satr) · K-C-14 = K-P-05 (alert) ·
K-C-15 = K-P-08 (`</script>`) · K-C-16 = K-P-07 (konsol obyekt) · K-M-03 = K-P-09 (IMG_FALLBACK uz) ·
K-M-01 = K-K-20 (til almashuvi hint) · K-M-25 = K-K-21 (starter tili) · K-P-25 = K-K-24 (Google Fonts) ·
K-P-26 ≈ K-K-13 (ikki nusxa) · K-C-13 ⊂ K-P-01 (cheksiz sikl — ZIDDIYAT hal: qotadi, tiklanmaydi) ·
K-E-01 ≈ K-M-23 (tab ko'rinmaydi/kesiladi) · K-C-05 + K-K-10 + K-K-26 (oq-ekran sinfi) ·
K-K-27 ≈ K-C-24 (`check` `{uz,ru}` qaytarsa hint bo'sh).

---

## 3. Sinov-qamrovi (nima tekshirildi — to'liq ro'yxat har bo'lim boshida)
- C: 444 builder-hol + 322 lint-hol + 70 spec-hol + CSS-parser + runtime (sikl, throw, forge, sandbox, konsol)
- E: bo'yash-sinxron (uzun satr, tab, emoji, kirill, 20k+), menyu (trigger, filtr, Enter/Esc/strelka, pozitsiya), klaviatura (Tab, Enter-indent, undo/redo, avto-yopish), «Chiroyli» (ma'no-saqlash, kursor), tablar/reset/saqlov, sensor-rejim 390 px, holat-satri, a11y
- P: sandbox-eskeyp, alert/modal, navigatsiya, cheksiz sikl/rekursiya/katta DOM, konsol yuklama, debounce, IMG_FALLBACK, previewUrl/previewCss, StyleTag/oqish, layout 360–2560 px
- M: 115 uz/ru juftlik, `lint:til`, MATN_ETALONI lug'at, til-almashuv, kesilish 768/1100/1400 px, o'quvchi-tushunarlilik
- K: props chegaralari, storageKey/TTL/debounce/reset, 21 dars audit (storageKey·lang·previewUrl·builderlar), `__lang`, StrictMode, tashqi-modul (98 KB, importlar), xatoga chidamlilik

---
---

# §A — TEKSHIRUV-MOTORI (asl: `dev/hc-stend/hisobot-checks.md`)

## HtmlCompiler — TEKSHIRUV-MOTORI sinov hisoboti (checks · specToCheck · parseCss · lintHtml · runtime harness)

Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (tahrirlanmadi) · Stend: `dev/hc-stend/` (http://127.0.0.1:4517/)
Skriptlar: `tc-lib.mjs` (ichki funksiyalarni manbadan kesib sahifaga in'ektsiya qiladi → `window.__X`), `tc-1-builders.mjs` (444 hol), `tc-2-lint.mjs` (322 hol), `tc-3-css.mjs`, `tc-4-runtime.mjs`, `tc-5-spec.mjs`, `tc-6-confirm.mjs` (2-tasdiq), `tc-7-shots.mjs` (skrinshotlar). Xom chiqishlar: `tc-1-out.txt`, `tc-1-compact.txt`, `tc-2-out.txt`, `tc-2-compact.txt`.
Har topilma ikki yo'l bilan tasdiqlangan: (1) ichki funksiyani to'g'ridan-to'g'ri chaqirib, (2) haqiqiy komponentda (`mountHC` + chip/`.hc-err`/`Davom etish` holati).

### Qisqa jadval

| Og'irlik | Soni | ID lar |
|---|---|---|
| 🔴 kritik | 2 | K-C-01, K-C-02 |
| 🟠 muhim | 8 | K-C-03 … K-C-10 |
| 🟡 mayda | 15 | K-C-11 … K-C-25 |
| 🔵 taklif/hujjat | 8 | K-C-26 … K-C-33 |
| **Jami** | **33** | |

### Nima sinaldi (to'liq manzara)

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

### Topilmalar

#### K-C-01 · `cssValue` — hex rang va CSSOM tomonidan qayta yozilgan qiymatlar HECH QACHON mos kelmaydi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:406–411 (`cssValue`), 552–555 (`getPropertyValue` — CSSOM serializatsiyasi)
- Qanday takrorlash: `C.cssValue('h1','color','#ff0000')` + CSS `h1{color:#ff0000}` → qizil. Xuddi shunday: `#fff`/`#FFF`/`#ffffff`/`white` ↔ `#fff`, `hsl(...)`, `rgba(0,0,0,.5)` (`rgba(0, 0, 0, 0.5)` bo'lib qoladi), `margin:0` (→`0px`), `margin:0 auto` (→`0px auto`), `inset:0`, `flex:1` (→`1 1 0%`), `transition:all .3s` (→`0.3s`), `flex-flow:row wrap` (→`wrap`), `list-style:none inside` (→`inside none`), `box-shadow:0 0 3px red` (→`red 0px 0px 3px`), `font-weight:bold` ✓ lekin `700`≠`bold`, `url(x.png)` (→`url("x.png")`), `currentColor` (→`currentcolor`), `background:#eee`, `text-decoration:none`, `border-bottom:1px solid red`, `outline:none`, `overflow-x` ↔ `overflow`. Skript: `tc-1-builders.mjs` (NOTE-lar), `tc-6-confirm.mjs` [6].
- Kutilgan: o'quvchi aynan so'ralgan qiymatni yozsa — yashil. · Kuzatilgan: 0/5 (skrinshot), maslahat «`h1` da `color: #ff0000` yozing» — o'quvchi allaqachon yozgan.
- Dalil: `tc-shot-css-false-negative.png`; `tc-1-compact.txt` (cssValue: #FFF/#ffffff/margin 0/inset/flex 1/transition/box-shadow qatorlari); `tc-6-confirm.mjs` chiqishi `[6 css value/prop UI] c:RED m:RED b:RED t:RED f:RED bgc:RED tr:RED`.
- Izoh: Hozirgi darslar faqat kalit-so'z qiymatlar (`flex`, `center`, `column`) ishlatgani uchun yashirin turibdi. Har qanday rang-hex, `0`, uzunlik-tartib yoki qisqa-xossa qiymati bilan yoziladigan yangi shart o'quvchini boshi berk ko'chaga qamaydi («to'g'ri yozdim, nega qizil?»). `cssValue` da qiymatni «aynan» solishtirish CSSOM ning normallashtirilgan ko'rinishiga qarshi.

#### K-C-02 · Runtime natijasini o'quvchi kodi SOXTALASHTIRA oladi (postMessage, `e.source`/origin tekshiruvi yo'q, nonce = oddiy sanoq)  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1016–1026 (`onMsg`: faqat `d.__hcReport && d.nonce === nonceRef.current`), 839 (`nonce` iframe'ga ochiq yuboriladi), 962–964 (`nonceRef` 0 dan sanaladi)
- Qanday takrorlash: script.js: `setTimeout(()=>{ var r={}; for(var i=0;i<20;i++) r['r'+i]=true; for(var n=1;n<200;n++) parent.postMessage({__hcReport:true,nonce:n,results:r},'*'); },400)` — id berilmagan runtime shartlar avto-id `r0..rN` oladi. Kechiktirish shart (haqiqiy harness hisobotidan KEYIN kelishi kerak; kechiktirmasa haqiqiy hisobot ustidan yozadi — `tc-4` [C forge] o'tmadi, `tc-6` [1]/[1b] o'tdi).
- Kutilgan: faqat tekshiruv-iframe'idan (`e.source === checkIframe.contentWindow`) kelgan hisobot qabul qilinishi. · Kuzatilgan: barcha runtime chiplar yashil, «Davom etish» ochiq (`next {disabled:false}`), hech qanday `console.log`/funksiya yozilmagan.
- Dalil: `tc-shot-forged-report.png`; `tc-6-confirm.mjs` chiqishi `[1 delayed forge] chips ok:true ok:true next {disabled:false}`, `[1b auto-id forge]` ham.
- Izoh: Ikkala iframe ham `origin: null` — origin bilan farqlab bo'lmaydi, lekin `e.source` bilan bo'ladi. Konsol-xabar (`__hcConsole`) uchun ham xuddi shu (forged matn konsolda 2 marta chiqadi — preview va tekshiruv iframe'idan). O'quvchilar orasida «hack-snippet» tarqalsa butun JS-modul shartlari ma'nosiz bo'ladi. (Qo'shimcha: `window.__logs=['999']` yozib `logs()` ni ham aldash mumkin — `tc-4` [C __logs].)

#### K-C-03 · `js` shartida satr ichidagi `//` (URL!) qatorning qolganini «izoh» deb o'chiradi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:354–357 (`stripJsComments` — satr/regex/template literal hisobga olinmaydi)
- Qanday takrorlash: `C.js(/addEventListener/)` + script.js: `const link = 'http://t.me/x'; btn.addEventListener('click', f);` → qizil. Keyingi qatorga o'tkazilsa yashil (`tc-6` [4b]). Shuningdek satrdagi `"/*"` keyingi `*/` gacha hammani yeydi; `"http://x"` dan keyingi kod yo'qoladi.
- Kutilgan: yashil. · Kuzatilgan: «Skriptda kerakli qism topilmadi».
- Dalil: `tc-shot-js-url-comment.png`; `tc-6-confirm.mjs` `[4 // in string] ok:false`, `[4c // realistic] ok:false`; `tc-1-compact.txt` js: URL/`/*` qatorlari.
- Izoh: URL-satrlar (`img.src="https://…"`, `fetch("https://…")`, `href`) JS darslarida tabiiy; o'quvchi bir qatorda yozsa shart sababsiz qizil qoladi va maslahat noto'g'ri yo'naltiradi.

#### K-C-04 · `cssProp` — ro'yxatda bo'lmagan qisqa xossalar va `@media`/`@supports`/`@layer` ichidagi qoidalar topilmaydi (yolg'on-salbiy)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:548–549 (`.filter(r => r.style)` — `CSSMediaRule` tushib qoladi, ichiga kirilmaydi), 561–563 (qisqa-xossa ro'yxati cheklangan; `'gridArea'` camelCase — hech qachon ishlamaydi)
- Qanday takrorlash: `cssProp('a','border-bottom')` + `a{border-bottom:1px solid red}` → qizil; xuddi shunday `text-decoration`, `outline`, `border-color/width/style`, `columns`, `animation`, `grid-area`, `-webkit-text-stroke`; `cssProp('h1','font-size')` + `@media (max-width:600px){h1{font-size:2em}}` → qizil.
- Kutilgan: yashil. · Kuzatilgan: «`a` uchun `border-bottom` xossasini yozing» (yozilgan bo'lsa ham).
- Dalil: `tc-6-confirm.mjs` `[6] bo:RED td:RED ga:RED me:RED`; `tc-shot-css-false-negative.png` (3,4,5-chiplar); `tc-1-compact.txt` cssProp: text-decoration/outline/columns/border-width/animation/border-bottom/grid-area/gridArea/@media/@supports/@layer.
- Izoh: Ro'yxat qo'lda to'ldirilgan (F-0809-04 dan keyin), CSS-modul kengaygan sari yana «kulrang qolib qamalish» sinfi qaytadi; responsive (`@media`) darsi umuman tekshirib bo'lmaydi.

#### K-C-05 · `specToCheck` — `js:` kaliti SATR bo'lsa `new RegExp` maxsus belgida yiqiladi → butun kompilyator OQ EKRAN  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:465 (`new RegExp(s.js)` — ekranlanmaydi), 919–922 (`useMemo` render ichida — xato React daraxtini yiqitadi, error boundary yo'q)
- Qanday takrorlash: `requirements: [{ js: 'console.log(' }]` yoki `{ js: 'alert(' }` → `#root` bo'sh, konsolda `Invalid regular expression: /console.log(/: Unterminated group` + React «An error occurred in the <HtmlCompiler> component».
- Kutilgan: satr = oddiy matn-qidiruv (yoki aniq xato-xabar). · Kuzatilgan: dars ekrani butunlay yo'qoladi.
- Dalil: `tc-5-spec.mjs` `[js string maxsus belgi "console.log("] {"mounted":false,"root":""}`, `tc-6` [7] `root=""`. Qo'shimcha: `{js:'a.b'}` `aXb` ga ham mos keladi, `{js:'arr[0]'}` `arr[0]` ni topmaydi (regex sifatida o'qiladi).
- Izoh: Hujjat (446–457) satr-variantni taqiqlamaydi; muallif tabiiy ravishda `js: 'console.log('` yozadi va o'quvchi oq ekran ko'radi. Hozirgi darslarda satr-`js` ishlatilmagan.

#### K-C-06 · `@import` bo'lgan o'quvchi CSS'i DARS SAHIFASI (top-level, sandbox'siz) nomidan tarmoq so'rovi yuboradi — har tugma bosishda  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:543–545 (`document.head.appendChild(el)` — asosiy hujjat), 1041–1052 (har `css` o'zgarishida qayta chaqiriladi)
- Qanday takrorlash: style.css ga `@import url("http://127.0.0.1:4517/tc-imp-a.css");` yozib 5 ta probel qo'shish → 6 ta HTTP so'rov (`page.on('request')`), so'rov dars-origin'idan (cookie/credential bilan) ketadi; `https://example.invalid/…` ham so'raladi (`ERR_NAME_NOT_RESOLVED`).
- Kutilgan: tekshiruv-parslash tarmoqqa chiqmasin (yoki hech bo'lmasa sandbox ichida). · Kuzatilgan: `[css-net] @import url: newRequests=[".../tc-import-1.css"]`, `[12 @import per keystroke] requests: 6`.
- Dalil: `tc-3-css.mjs` va `tc-6-confirm.mjs` [12] chiqishlari.
- Izoh: `url()` lar (background/cursor/font-face) ulanmagan element tufayli so'ralmaydi — faqat `@import`. Xavf: LMS ichida ishlaganda o'quvchi CSS'i orqali dars-domen nomidan ixtiyoriy URL «ping» qilinadi (kuzatuv/SSRF-sinf), keystroke-tezligida.

#### K-C-07 · `js` shartida `/g` bayroqli regex — natija har tugma bosishda YONIB-O'CHADI (lastIndex holati)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:414–415 (`re.test(...)` — global regex holatli)
- Qanday takrorlash: `C.js(/x/g)` + script.js `x`, keyin oxiriga probel qo'shib boriladi → chip: `false, true, false, true, false, true` (`tc-6` [3]); `/x/` bilan: `true,true,true,true` ([3b]). To'g'ridan-to'g'ri: `check(ctx)` 1-chaqiriq `true`, 2-chaqiriq `false` (`tc-1` «/g bayroqli regex», `!!R2DIFF`).
- Kutilgan: barqaror. · Kuzatilgan: chip miltillaydi, «Davom etish» tasodifiy ochiladi/yopiladi.
- Dalil: `tc-6-confirm.mjs` `[3 /g regex] ok-ketma-ketligi [false,true,false,true,false,true]`.
- Izoh: Hozirgi darslarda `/g` ishlatilmagan (grep 0), lekin muallif «hammasini top» ma'nosida `/g` qo'shsa darrov namoyon bo'ladi va tashxisi qiyin.

#### K-C-08 · `cssValue` da qiymat RAQAM (`2`, `0`) bo'lsa — `norm(val).trim` yiqiladi → «tekshirishda xatolik»  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:349 (`norm` faqat satr), 408 (`norm(val)`), 463 (`specToCheck` `value` ni satrga aylantirmaydi), 756–758 (catch → umumiy xato)
- Qanday takrorlash: `C.cssValue('h1','z-index',2)` yoki `{ css:{sel:'h1',prop:'z-index',value:2} }` + `h1{z-index:2}` → chip «tekshirishda xatolik». (`value: 0` — `equals`/`norm(0)` → `'0'||''`… `0` falsy → `norm('')` → `''` ≠ `'0px'` → «yozing» maslahati; ya'ni ikkalasi ham hech qachon o'tmaydi.)
- Kutilgan: raqam qiymat satrga keltirilib solishtirilishi (`logs`/`evalEquals` da `String()` bor, bu yerda yo'q). · Kuzatilgan: «tekshirishda xatolik» — o'quvchi uchun ma'nosiz.
- Dalil: `tc-1` «cssValue: value = raqam (number tipida) => THROW: (s || "").trim is not a function»; `tc-5` `[css value son (number)] hint:"tekshirishda xatolik"`; `tc-6` [6] `z:RED(tekshirishda xatolik)`.

#### K-C-09 · Xato-satr raqami ko'rsatilmaydi (`Uncaught ReferenceError: foo is not defined` — QAYERDA?)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:791 (`send('error',[e.message])` — `e.lineno`/`e.colno` tashlab yuboriladi; `wrapDoc` da JS `<script>` ichida — satr raqamlari `script.js` ga mos ham emas)
- Qanday takrorlash: script.js 5-qatorda `foo();` → konsol: `›Uncaught ReferenceError: foo is not defined` (satr yo'q); 8-qatorda `null.foo;` → `Cannot read properties of null (reading 'foo')` (satr yo'q); sintaksis xatosi ham satrsiz.
- Kutilgan: hech bo'lmaganda `script.js:5`. · Kuzatilgan: faqat matn.
- Dalil: `tc-shot-console.png`; `tc-4` [B], `tc-6` [9].
- Izoh: 13 yoshli o'quvchi «qayerda xato?» savoliga javob topolmaydi — HTML-linter satr beradi, JS esa yo'q; ayniqsa `Davom etish` yopiq turganda.

#### K-C-10 · `lintHtml` inline `<script>`/`<textarea>` ICHINI HTML deb tekshiradi → to'g'ri kodga soxta xato va «Davom etish» yopiladi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:637–727 (raw-text elementlar `script/style/textarea/title` uchun maxsus rejim yo'q)
- Qanday takrorlash: `<h1>Salom</h1>\n<script>\nlet s = "<b>salom";\n</script>` → «⚠ Qator 3: `<b>` yopilmagan — `</b>` kutilgan, `</script>` keldi», `Davom etish` disabled (title: «Sintaksis xatosi tuzatilsa ochiladi»); `if(a<b){}` → «`<b` tegi `>` bilan yopilmagan»; `for(i=0;i<a.length;i++)` → «`<a` tegi …»; `var s="</div>"` → «`</div>` mos ochuvchi tegga ega emas»; `<script>var s="<!--"</script>` → «Izoh yopilmagan»; `<textarea><b>salom</textarea>` → xato. (`<style>` ichidagi `a>b{}` va `<!--` — o'tadi.)
- Kutilgan: 0 xato (brauzer `<script>` ichini matn deb oladi). · Kuzatilgan: qizil xato, tugma yopiq.
- Dalil: `tc-shot-lint-script.png`; `tc-6` [5b] `next {disabled:true}`, [5c]; `tc-2-compact.txt` «<script> ichida …» qatorlari (~20 hol).
- Izoh: Hozirgi darslar JS ni alohida faylga yozdiradi, lekin o'quvchi (yoki 1-modul HTML darsi) `<script>` ni HTML ichiga qo'ysa, to'g'ri kod bilan qamalib qoladi; `<textarea>` forma-darsida real.

#### K-C-11 · `logs()` — substring qidiruv: `999` ↔ `1999`, `10` ↔ `100`, `'1 2 3'` ↔ literal `console.log('1 2 3')`  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:805–807 (`indexOf`)
- Qanday takrorlash: `C.logs('999')` + `console.log(1999)` → yashil; `C.logs('1 2 3')` + `console.log('1 2 3')` (siklsiz) → yashil.
- Kutilgan: (dizayn qarori) · Kuzatilgan: yolg'on-ijobiy. Teskarisi: `console.log(i + ' ')` (oxirida probel) yoki `'Son: ' + i` → qizil (`tc-4` [C trailing space], [C prefixed]).
- Dalil: `tc-4-runtime.mjs` [C substring 1999] ok:true, [C literal] ok:true.

#### K-C-12 · `attr`/`text`/`attrs` faqat BIRINCHI mos elementni ko'radi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:365–387 (`x.$(sel)` = `querySelector`)
- Qanday takrorlash: `<a>menyu</a>\n<a href="about.html">Biz haqimizda</a>` + `C.attr('a','href')` → qizil «`a` da `href="..."` to'ldiring»; `<p></p><p>Matn bor</p>` + `C.text('p')` → qizil «ichi bo'sh».
- Kutilgan: kamida bitta mos element yetadi (yoki maslahat «birinchi `<a>`»ni aniq aytsin). · Kuzatilgan: to'g'ri element bo'lsa ham qizil.
- Dalil: `tc-6` [8 first-element-only].

#### K-C-13 · Cheksiz/uzoq sikl — chip abadiy «ishga tushirilmoqda…», sabab aytilmaydi; preview + tekshiruv iframe'lari ketma-ket ishlaydi (vaqt 3× uzayadi)  ·  Og'irlik: 🟡 mayda
> ⚠️ **Bosh-muharrir tuzatishi:** bu banddagi «keyingi tahrir yangi iframe bilan tiklanadi» degan gap qayta sinovda (`t-preview-2c.mjs`) RAD etildi — tuzatilgandan keyin ham iframe qotgan qoladi. Yakuniy hukm: **K-P-01 (🔴 kritik)**.
- Qayer: src/compilator/HtmlCompiler.jsx:1067–1069 (natija kelmasa taym-aut yo'q), 843 (`setTimeout(runProbes,50)`)
- Qanday takrorlash: `while(true){}` → sahifa TIRIK (✓), chip «ishga tushirilmoqda…» abadiy; `4 s band sikl` → chip 12,5 s dan keyin yashil (`tc-6` [2]: 2,5/4,5/…/10,5 s pending, 12,5 s ok) — sabab: preview va tekshiruv iframe'lari bir jarayonda navbat bilan bajariladi.
- Kutilgan: N sekunddan keyin «kod tugamadi — cheksiz sikl bo'lishi mumkin». · Kuzatilgan: jim.
- Dalil: `tc-4` [D loop], `tc-6` [2 busy4s].

#### K-C-14 · `alert()`/`prompt()`/`confirm()` sandbox'da JIM o'chirilgan (`allow-modals` yo'q) — o'quvchiga hech qanday xabar yo'q  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1851, 1886 (`sandbox` bayroqlari)
- Qanday takrorlash: `alert('Salom!'); var ism = prompt('Isming?'); console.log('ok', ism);` → ekranda hech narsa, konsolda `ok null` (Chrome konsolida: «Ignored call to 'alert()'. The document is sandboxed…» — o'quvchi ko'rmaydi).
- Kutilgan: yoki ishlashi, yoki «bu muhitda alert ishlamaydi — console.log ishlating» ogohi. · Kuzatilgan: jim.
- Dalil: `tc-4` [A] `ALERT-RETURNED undefined`, `PROMPT: null`, `CONFIRM: false`; `tc-6` [10].
- Izoh: Darslarda `alert/prompt` shart sifatida ishlatilmagan (grep), lekin o'quvchi YouTube'dan o'rganib yozishi tabiiy.

#### K-C-15 · O'quvchi JS'ida `"</script>"` satri butun natija-hujjatni buzadi (`Uncaught SyntaxError`)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:900 (`<script>${js || ''}<\/script>` — `</script` ekranlanmaydi; CSS uchun ham `</style>`)
- Qanday takrorlash: `var s = "<script>alert(1)</script>"; console.log('ok');` → konsol «Invalid or unexpected token», `logs('ok')` qizil. (`"<p>salom</p>"` — muammosiz.)
- Dalil: `tc-4` [C </script> in js], `tc-6` [11b].

#### K-C-16 · Konsolda DOM-element `{}`, `Map` `{}`, aylanma obyekt `[object Object]`, `%s` format ishlamaydi, `console.debug/table` chiqmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:782 (`fmt` — `JSON.stringify` yoki `String`), 787 (`['log','info','warn','error']`)
- Qanday takrorlash: `console.log(document.getElementById('p'))` → `{}`; `console.log('%s dunyo','salom')` → `%s dunyo salom`; `console.debug('x')` → yo'q.
- Dalil: `tc-4` [A] konsol qatori `{"a":1,"b":[1,2]} [1,"x"] null undefined function f(){} 12 Symbol(s) {} {}`; `tc-6` [9] `›{}`.
- Izoh: DOM darsida `console.log(element)` — eng birinchi «tekshirib ko'rish» usuli; `{}` chalg'itadi.

#### K-C-17 · `click_text`/`toggle` — asinxron DOM (`setTimeout(…,0)`), `input.value`, «kutilgan matn boshidan bor», «A matni B ichida» hollari hech qachon o'tmaydi, maslahat sababini aytmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:811–834
- Qanday takrorlash: click handler ichida `setTimeout(()=>out.textContent='7',0)` → qizil; `<input id="out">` + `.value='7'` → qizil (faqat `textContent`); `domAfterClick('#like','#son','1')` + `<p id="son">Layklar: 10</p>` (`'1'` allaqachon bor) → hech qachon o'tmaydi; `toggle('#b','#b','Kun','Kunduz')` (A ⊂ B) → hech qachon o'tmaydi. Hammasida maslahat: «natija kutilgancha emas».
- Dalil: `tc-4` [C click async setTimeout 0], [C click input value]; `tc-6` [13], [14].

#### K-C-18 · Bir xil `id` li ikki runtime shart — ikkalasi ham qizil (natija ustma-ust yoziladi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:837 (`out[p.id]=ok`), 1069–1071 (`runtimeResults[r.id]`)
- Qanday takrorlash: `[{id:'x',logs:'A'},{id:'x',logs:'B'}]` + `console.log('A')` → 0/2 (id-siz variantda 1/2 — to'g'ri).
- Dalil: `tc-5` `[id takror runtime aniq id bir xil] 0/2`.

#### K-C-19 · `lintHtml` — `<head>` yopilmasa (`<title>x</title>\n<body>`) va `<html>`/`<body>` yopilmasa xato + «Davom etish» yopiq (HTML'da bu teglarning yopilishi ixtiyoriy)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:587 (`OPTIONAL_CLOSE` da `html/head/body` yo'q)
- Qanday takrorlash: `<!DOCTYPE html>\n<html>\n<head>\n<title>x</title>\n<body>\n<h1>Salom</h1>\n</body>\n</html>` → «⚠ Qator 3: `<head>` yopilmagan — `</head>` kutilgan, `</html>` keldi», tugma yopiq.
- Dalil: `tc-6` [5e] `next {disabled:true}`; `tc-2-compact.txt` «<html><head><body> yopilmagan» (3 xato).
- Izoh: Pedagogik jihatdan «yoping» deyish o'rinli bo'lishi mumkin — lekin xabar «yopilmagan — `</html>` keldi» ko'rinishida chalkash va brauzer bu kodni to'g'ri ko'rsatadi.

#### K-C-20 · `lintHtml` — tirnoqsiz atribut `/` bilan tugasa (`<a href=a/>x</a>`) self-closing deb olinadi → soxta «Ortiqcha yopuvchi teg `</a>`»  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:709 (`c === '/' && src[j+1] === '>'` — tirnoqsiz qiymat ichida ham)
- Qanday takrorlash: `<h1>Salom</h1>\n<a href=a/>x</a>` → «⚠ Qator 2: Ortiqcha yopuvchi teg `</a>`», tugma yopiq. Brauzer: `href="a/"`, `<a>` ochiq.
- Dalil: `tc-6` [5f]; `tc-2-compact.txt` «tirnoqsiz atribut ichida / oxirida».

#### K-C-21 · `lintHtml` — `<div/>`, `<h1/>`, `<p/>`, `<span/>`, `<script/>` self-closing deb qabul qilinadi (brauzer ochiq qoldiradi) — xato o'tkazib yuboriladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:722 (`!selfClose && !VOID_TAGS.has` — void bo'lmagan teg uchun ham `/>` yopadi)
- Qanday takrorlash: `<h1>Salom</h1>\n<div/>\n<p>x</p>` → 0 xato, lekin brauzerda `<div>` ochiq qoladi (`<p>` uning ichida); `<script/>alert(1)` → 0 xato, brauzerda `<script>` qolgan hujjatni yutadi.
- Dalil: `tc-6` [5g] `err null`; `tc-2-compact.txt` «<h1/>x», «<div/>x», «<script/>».

#### K-C-22 · `cssProp/cssValue` selektor-solishtiruv «aynan matn»: `nav>a` ↔ `nav > a`, `input[type=text]` ↔ `input[type="text"]`, `DIV` so'rovi ↔ `div`, `h1, p` guruh-so'rov hech qachon mos kelmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:400, 408 (`r.selector.split(',').map(norm).includes(norm(selector))`)
- Qanday takrorlash: `cssValue('h1>.big','color','red')` + `h1 > .big{color:red}` → qizil; `cssProp('input[type=text]','color')` + `input[type=text]{}` → qizil (CSSOM `[type="text"]` yozadi); `cssProp('h1, p','text-align')` → qizil (so'rov guruh, split qilingan bo'laklar bilan solishtiriladi); `cssProp('DIV',…)` → qizil (o'quvchi `DIV{}` yozsa esa o'tadi).
- Dalil: `tc-1-compact.txt` cssProp/cssValue: `nav > a` (o'quvchi probelsiz yozsa ✓, so'rov probelsiz bo'lsa ✗), `[type=text]`, `h1,p`, `DIV`, `h1>.big`.

#### K-C-23 · CSS uchun sintaksis-linter YO'Q: yopilmagan `{`, ortiqcha `}`, `;` yo'qligi, `//` izoh — jim, faqat shart «yozing» deb turadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:541–571 (parseCss — CSSOM kechirimchi, xato haqida signal yo'q); HTML uchun 637 dan linter bor, CSS/JS uchun yo'q
- Qanday takrorlash: `h1{color:red}} \n h1{text-align:center}` → ortiqcha `}` keyingi qoidani yutadi → «`h1` da `text-align: center` yozing»; `h1{\n// markazga\ntext-align:center}` → `//` keyingi deklaratsiyani yeydi; `p{color:red\nh1{text-align:center}` (yopilmagan) → CSS-nesting sifatida `p h1` bo'lib ketadi; `color:red text-align:center` (`;` yo'q) → ikkalasi ham yo'qoladi. O'quvchi «to'g'ri yozdim» deb o'ylaydi.
- Dalil: `tc-1-compact.txt` «text-align center, boshida/ichida …» seriyasi (30+ hol).
- Izoh: Faqat tashxis — CSS-linter kiritish jarayon-qarori.

#### K-C-24 · `check` funksiyasi `{uz,ru}` obyekt qaytarsa — maslahat BO'SH chiqadi (`tr` qilinmaydi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:748 (`typeof r === 'string' ? r : tr(req.hint)`)
- Qanday takrorlash: `check: () => ({uz:'U-obj', ru:'R-obj'})` → chip qizil, hint `''`, `.hc-hint` yo'q. (`hint:` maydoni obyekt bo'lsa ✓ ishlaydi — F-0809-04.)
- Dalil: `tc-5` `[check {uz,ru} obyekt qaytarsa] hint:""`.

#### K-C-25 · Ko'p faylli task'da faqat BIRINCHI `css`/`js` fayl tekshiriladi; HTML ichidagi `<style>`/`<script>` `cssProp`/`js` uchun ko'rinmaydi, lekin `logs` uchun ko'rinadi (nomuvofiq)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:951–955 (`byLang` — `find`), 1041–1052 (`ctx.js/css` faqat fayl-manba)
- Qanday takrorlash: `[a.js:'', b.js:'alert(1)']` + `C.js(/alert/)` → qizil; `<style>h1{color:red}</style>` (CSS fayl yo'q) + `cssProp('h1','color')` → qizil; `<script>console.log("A")</script>` + `logs('A')` → yashil.
- Dalil: `tc-5` `[ikkita js fayl…]`, `[CSS fayli yo'q…]`, `[JS fayli yo'q, logs shart] ok:true`.

#### K-C-26 · Hujjatlashtirilmagan ustuvorlik: `{tag, count, text}` → faqat `count`; `{tag, attr, text}` → faqat `attr`; `{tag, attr, attrs}` → `attrs`; `text:'salom'` qiymati e'tiborga olinmaydi; `sel`+`tag` → `tag`  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:470–477 (if-zanjiri), 446–457 (izoh)
- Dalil: `tc-5` `[tag+count+text] ok:true` (bo'sh `<li>` lar), `[tag+attr+text] ok:true` (bo'sh `<a href>`), `[tag+text:"salom"] ok:true` (`<h1>boshqa</h1>`).

#### K-C-27 · `eval` shartida `equals` berilmasa ifoda `undefined` bo'lganda o'tadi; `click` da `read`/`expect` yo'q bo'lsa `'undefined'` bilan solishtiriladi; `toggle` da `a/b` yo'q → label «undefined ⇄ undefined»; `css:{}` → label «CSS: undefined { undefined }»  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:466–469, 485–489
- Dalil: `tc-5` `[eval equals yo'q] ok:true`, `[click expect yo'q] label "bosilsa «undefined»" ok:true`, `[toggle a/b yo'q]`, `[css bo'sh obyekt]`.

#### K-C-28 · `attr(..., equals)` katta-kichik harfga sezgir (`type="EMAIL"` ≠ `email`), `has('input[type="email"]')` esa sezgir emas — ikki shart bir xil HTML'ga qarama-qarshi javob beradi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:377
- Dalil: `tc-1-compact.txt` «attr: equals katta harf EMAIL» ✗ va «has: atribut selektor input[type=email]» ✓.

#### K-C-29 · `attrs: []` va `count: 0` har doim yashil (bo'sh shart)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:385–386, 394–395
- Dalil: `tc-5` `[attrs bo'sh] ok:true`, `[count = 0] ok:true`.

#### K-C-30 · `text` — `​` (zero-width) va `<h1><script>x</script></h1>` «matn bor» hisoblanadi; `display:none` matn ham  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:368 (`textContent`)
- Dalil: `tc-1-compact.txt` text: zero-width/script/style/display:none.

#### K-C-31 · `js` — satr/template literal ichidagi kod ham «bor» hisoblanadi (`console.log("let x")` → `let\s+x` ✓)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:354–357
- Dalil: `tc-1-compact.txt` «js: satr ichida "let x" => true», «template literal => true».

#### K-C-32 · Runtime probe faqat `load`+50 ms da bir marta ishlaydi — `setTimeout(…,200)`/`fetch`/`console.info` natijalari ushlanmaydi, sabab aytilmaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:843–845, 769 (faqat `console.log` ushlanadi)
- Dalil: `tc-4` [C async 200ms] ok:false, [C console.info] ok:false.

#### K-C-33 · `lintHtml` — `<!--->`/`<!-->` (spec bo'yicha bo'sh izoh) «Izoh yopilmagan»; `<p>x</ p>` → «`</>` mos ochuvchi tegga ega emas» (bo'sh nom); `<_a>` → «`</>`»  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:652–655, 666–669
- Dalil: `tc-2-compact.txt` «<!--->», «<!-->», «<p>x</ p>», «<_a>x</_a>».

---

### Xavfsizlik xulosasi (qisqa)
- Sandbox (`allow-scripts allow-popups allow-popups-to-escape-sandbox`, tekshiruv-iframe: `allow-scripts`) — `allow-same-origin` YO'Q ✓: o'quvchi kodi darsning `localStorage`/cookie/DOM'iga chiqa olmaydi, `top` ni navigatsiya qila olmaydi (o'lchandi: hammasi `SecurityError`).
- Ochiq nuqtalar: K-C-02 (natija/konsol xabarini soxtalashtirish — `e.source` tekshiruvi yo'q), K-C-06 (`@import` orqali dars-origin nomidan tarmoq so'rovi), K-C-13 (band sikl — sahifa qotmaydi, lekin CPU/iframe navbat).


---
---

# §B — MUHARRIR (asl: `dev/hc-stend/hisobot-editor.md`)

## HtmlCompiler — KOD-MUHARRIR qatlami sinov-hisoboti

- Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (2155 satr) · Stend: `dev/hc-stend/` (React 19, esbuild-bundle, Chrome headless, playwright-core)
- Rejim: kod o'qildi + har holat haqiqiy brauzerda bajarildi; har topilma kamida 2 marta takrorlandi (skript qayta yurgizilib).
- Skriptlar: `t-lib.mjs` (yordamchi), `t-editor-1-hl.mjs`, `t-editor-1b-scrollbar.mjs`, `t-editor-1c-misalign.mjs`, `t-editor-2-menu.mjs`, `t-editor-2b.mjs`, `t-editor-3-keys.mjs`, `t-editor-3b-undo.mjs`, `t-editor-4-fmt.mjs`, `t-editor-4b.mjs`, `t-editor-5-tabs.mjs`, `t-editor-6-touch.mjs`, `t-editor-6b.mjs`, `t-editor-6c.mjs`, `t-editor-6d.mjs`, `t-editor-7-a11y.mjs`, `t-editor-7b.mjs`, `t-editor-8-misc.mjs`, `t-editor-8b-perf.mjs`, `t-editor-9-jsgt.mjs`, `t-editor-10.mjs`. Sensor-sinov uchun `t-mobile.html` (stend `index.html`da `<meta viewport>` yo'q edi — telefon emulyatsiyasi 980px layout berardi; real ilovada meta bor deb hisoblandi).
- Eslatma: stend oflayn — Google Fonts (JetBrains Mono) yuklanmadi, tizim monoshrifti ishladi. Textarea va rang-qatlam bir xil shriftda bo'lgani uchun tekislik-o'lchovlariga ta'sir qilmaydi.

### Jadval

| Og'irlik | Soni | ID'lar |
|---|---|---|
| 🔴 kritik | 1 | K-E-01 |
| 🟠 muhim | 5 | K-E-02 … K-E-06 |
| 🟡 mayda | 16 | K-E-07 … K-E-22 |
| 🔵 taklif | 3 | K-E-23 … K-E-25 |
| **Jami** | **25** | |

### Nima sinaldi (to'liq manzara)

**1. Bo'yash qatlami ↔ textarea**
- ✓ o'tdi — shrift/o'lcham/line-height/padding/tab-size/white-space/letter-spacing/font-feature-settings `.hc-hl` va `.hc-code`da AYNAN bir xil (o'lchandi).
- ✓ o'tdi — uzun satr, gorizontal scroll: `scrollLeft` sinxron (300↔300, 1225↔1225).
- ✓ o'tdi — tab belgisi (`tab-size:2` ikkalasida), emoji, kirill, o'zbek apostroflari (’ ʼ '), ZWJ-emoji: qator kengliklari piksel-aniq teng; `<` `&` `&lt;` escape to'g'ri (`hl.textContent === value + '\n'`).
- ✓ o'tdi — oxirgi bo'sh qator (gutter 61 qator, scrollHeight ta/hl/gut = 1488/1488/1488), oxirida yozish, strelka bilan 40 qator pastga surish (368/368/368).
- ✓ o'tdi — A−/A+ dan keyin fs/lh/gutter sinxron (17px/28.9px), 12…20 chegarasi, `hcFont` saqlanadi.
- ✓ o'tdi — bo'sh holatda placeholder, `hl = "\n"`.
- ✓ o'tdi — HL_MAX chegarasi (19 997 belgi ranglanadi, 20 001 — ranglanmaydi).
- ✗ K-E-02 (gorizontal scrollbar bo'lganda pastda siljish), K-E-19 (HL_MAX jim), K-E-22 (tokenizator chekkalari), K-E-23 (wrap yo'q).

**2. Taklif-menyu**
- ✓ o'tdi — `<` ochadi (19 band, 1-si tanlangan), filtr `<h`→4, `<h1`→1; `<H` katta harf ham; Enter/Tab tanlaydi, yangi qator QO'SHILMAYDI (double-action yo'q); Esc yopadi va keyingi tahrirgacha jim; ArrowDown/Up aylanadi (0→18), keyup'da idx saqlanadi; sichqoncha bilan bosish; ro'yxat oxirgi band ko'rinadi (avto-scroll).
- ✓ o'tdi — kursor `<h1>|</h1>` ichida (s=4); `<br>` juftsiz; SNIPPETS: `ul`/`ol` (indent saqlanadi, kursor 1-`<li>` ichida), `a` (`href="|"`), `img` (`src="|"`).
- ✓ o'tdi — yolg'iz `h` qatorda ochiladi; `<p>Bugun ol` ichida OCHILMAYDI (inTextTag), `<li>a` ichida ochilmaydi; `</` va `</p` ochilmaydi; `h1| salom` (so'zdan keyin matn) ochilmaydi.
- ✓ o'tdi — atribut-menyu: `<a href="x" ` → class,id (href chiqarib tashlangan), `<img ` → src,alt,class,id, `<p cl`→class, `<p class="` yopiladi.
- ✓ o'tdi — menyu chegaradan chiqmaydi: pastki qatorda `up` sinfi (tepaga), o'ng chetda x=373 (quti 624), telefonda 246px quti 331px ichida.
- ✓ o'tdi — blur (tashqariga bosish) menyuni yopadi; CSS/JS faylida `<` menyu ochmaydi.
- ✗ K-E-07 (Shift+Enter → atribut-menyu), K-E-12 (x-koordinata emoji/tab), K-E-16 (yolg'iz so'z + Enter tuzog'i), K-E-21 (`<h|>`), K-E-25.

**3. Klaviatura**
- ✓ o'tdi — Tab: 2 probel, fokus chiqmaydi; Shift+Tab 2/1 probelni oladi, Home'da ham; Enter avto-indent (oldingi qator kabi), `<div>|</div>` → 3 qator, `{|}` CSS/JS → 3 qator, faqat `{` → chuqurroq; Enter o'rta satrda; Enter tanlov ustida — standart.
- ✓ o'tdi — Ctrl+Z/Ctrl+Y ishlaydi; ↶/↷ tugmalari fokusni muharrirga qaytarib brauzer-undo bilan bir xil tarixda; undo'dan keyin yozish davom etsa tarix buzilmaydi; Ctrl+Shift+Z redo; Tab/Enter/avto-yopish/Ctrl+/ dan keyin Ctrl+Z bir qadamda qaytaradi; Ctrl+A.
- ✓ o'tdi — avto-yopish: `<p>`, atributli, ichma-ich, `<p>a<b>`; void (`<br>`, `<img>`) juftsiz; `<!-- -->` yo'q; `2 > 1` matn; qo'lda yozilgan `</p>` mavjud juftni yutadi (`<p>abc</p>`), juftsiz holda ham; `<p|Salom` + `>` → `<p></p>Salom`; ko'p qatorli teg; `</h1|>` tugatish.
- ✓ o'tdi — `"` juftlik faqat teg ichida, ustidan o'tish, matnda oddiy; Backspace `""` ichida ikkalasini o'chiradi (html/css/js), `()` `{}` ham; CSS/JS `{`→`{}`, `(`→`()`, `)` ustidan o'tish, tanlovni `"` bilan o'rash, apostrof so'z ichida juftlanmaydi (`o'zim`).
- ✓ o'tdi — Ctrl+/ HTML/CSS/JS izoh qo'yish/olish, tanlangan qatorlar; bo'sh qatorda hech narsa.
- ✓ o'tdi — juft tegni birga qayta nomlash (`h1→h2`, `div→divs` ichida `<p>` bo'lsa ham to'g'ri, ikki `<p>` dan birinchisi).
- ✓ o'tdi — CRLF qo'yilsa `\n` ga aylanadi, gutter to'g'ri sanaydi.
- ✗ K-E-04 (JS'da `>` avto-yopish), K-E-05 (tanlov ustida Tab), K-E-06 (rename-undo), K-E-08 (undo-granulyarlik), K-E-13, K-E-14, K-E-15, K-E-17.

**4. «Chiroyli» (formatHtml)**
- ✓ o'tdi — bloklar to'g'ri chekintiriladi (div/h1/p, ul/li, doctype/html/head/body, izoh, self-closing, katta harf); `<pre>`/`<textarea>` → null; tugallanmagan `<` (`>` yo'q) → null; atribut ichidagi `>`/`<` buzmaydi; `&lt;` entity saqlanadi; `<script>if(a<b)` → null; 100 dan uzun `<h1>` matni alohida qatorga; Ctrl+Z formatni to'liq qaytaradi; «Kod allaqachon chiroyli 👍» xabari; CSS/JS tabda tugma yashirin.
- ✗ K-E-03 (inline teg — ko'rinadigan bo'shliq), K-E-09 (xabarlar/tugallanmagan), K-E-10 (kursor/scroll), K-E-11 (`<p></p>`).

**5. Fayl-tablar / saqlov / «Qaytadan»**
- ✓ o'tdi — 3 fayl: har tab kodi saqlanadi; til/rang-qatlam/holat-satri (`css`, `style.css`) to'g'ri; ru/uz starter `tr()`; `storageKey` 400ms'da saqlaydi va reload'da tiklanadi; fayl-to'plam o'zgarsa saqlov e'tiborsiz; «Qaytadan» 2 bosqich (⚠ Rostdanmi? + qizil xabar), 4 s da qurollanish tushadi, blur'da ham; HAMMA faylni tiklaydi; 8 s davomida «↶ Qaytarish» — hamma faylni qaytaradi; onContinue `{codes, code}` bilan, onBack.
- ✗ K-E-01 (tablar ko'rinmaydi), K-E-18 (8 s dan keyin qaytarib bo'lmaydi), K-E-20 (fokus/aria).

**6. Sensor-rejim** (`hasTouch+isMobile`, 390/430/600/768/820/1024 px)
- ✓ o'tdi — `pointer:coarse` → TOUCH_KEYS paneli (html/css/js to'plami tilga qarab), 38px tugmalar, tor telefonda qisqaradi (39px), qirqilmaydi; tugma bosilganda belgi kursor joyiga tushadi (0 → `<`, 2 → `/`), fokus muharrirda qoladi, `⇥` 2 probel; menyu «Bosib tanlang» yozuvi, tap bilan tanlash; 390px: Kod/Natija tab-almashish, panellar ustma-ust EMAS, gorizontal sahifa-scroll yo'q (docW=390), holat-satri yashirin, chiplar gorizontal suriladi; 800px sichqoncha → panel yo'q, tab-rejim bor; 1024 landshaft planshet → yonma-yon + panel.
- ✗ K-E-01 (telefonda tablar 0px).

**7. Holat-satri / gutter**
- ✓ o'tdi — Qator/Ustun kirillda to'g'ri (13 belgi → Ustun 14), sichqoncha bosishda yangilanadi, tab almashganda qayta hisoblanadi; gutter scroll bilan sinxron (oddiy holatda), 120 qatorda kengayadi.
- ✗ K-E-12 (emoji/tab ustuni), K-E-02 (scrollbar holati).

**8. Fokus / a11y**
- ✓ o'tdi — ↶/↷/A−/A+ da aria-label+title, «Chiroyli»/«Ishga tushirish»/«Qaytadan»/«Davom etish» title; tugmalarda standart fokus-halqa ko'rinadi (`outline:auto`); menyu `role=listbox/option`, `aria-selected`; Esc menyuni yopadi; iframe title.
- ✗ K-E-17 (fokus-tuzoq), K-E-20, K-E-24.

**Ishlash tezligi (ma'lumot):** 5k belgi — 33 ms/harf, 14k — 64 ms, 24k (ranglash o'chgan) — 50 ms (dev-build, headless; ikki rAF ichida). `highlight()` 14k uchun 0.9 ms.

---

### Topilmalar

#### K-E-01 · Fayl-tablar (index.html / style.css / script.js) tor panelda ko'rinmaydi va bosib bo'lmaydi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1972 (`.hc-tabs{display:flex;gap:4px;overflow:hidden}` — min-width yo'q, flex-shrink standart), 1711–1734 (bar tarkibi: dots + tabs + tools + «Ishga tushirish»)
- Qanday takrorlash: 3 faylli task (`files: index.html/style.css/script.js`) bilan mount → oyna eni 1024px (yoki 1366px), yoki 1400px'da chegarani 30% ga sudrash, yoki telefon 390–430px.
- Kutilgan: uch tab ham ko'rinadi (yoki gorizontal suriladi) · Kuzatilgan: 390/430px — `.hc-tabs` eni 0/32px, uchala tab ham yashirin; 600px — faqat index.html; 1024px — hammasi yashirin (tabs 96px, birinchi tab 106px kerak); 1100 — 1 ta; 1280/1366 — 2 ta, `script.js` «script.» bo'lib qirqiladi; 1400px + split 30% — hammasi yashirin. Bir faylli darsda ham telefonda «index.html» yozuvi yo'qoladi.
- Dalil: `t-editor-6b.mjs`, `t-editor-6c.mjs` chiqishi (`{"tabsW":0,"vis":[false,false,false]}` @390; `@1024 vis:[false,false,false]`), skrinshotlar `e6e-phone-3files.png`, `e6f-desktop-split30.png`, `e6g-1366-tabs.png`
- Izoh: Ko'p faylli (CSS/JS) darslarda o'quvchi telefon/planshet yoki 1024–1100px noutbukda style.css/script.js'ga umuman o'ta olmaydi — shartlar bajarilmaydi. Tor panelda «Ishga tushirish» va ↶↷✨ tugmalari joyni oladi, tablar esa 0 gacha qisiladi.

#### K-E-02 · Gorizontal scrollbar bo'lganda pastki qatorlarda rang-qatlam, gutter va joriy-qator chizig'i 15px siljiydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1988–1991 (`.hc-hl` overflow:hidden, `.hc-code` overflow:auto), 1210–1215 (`syncScroll` faqat scrollTop nusxalaydi), 1135–1145 (`updateCurLine` textarea scrollTop bilan)
- Qanday takrorlash: 40 qator yozing, 1-qatorni ekrandan uzunroq qiling (`<p>` ichida uzun matn — o'quvchida tez-tez); sichqoncha g'ildiragi bilan ENG PASTGA suring.
- Kutilgan: matn (kursor) va rangli harflar ustma-ust · Kuzatilgan: textarea gorizontal scrollbar tufayli 15px pastroq (clientHeight 469 vs 484), maks scrollTop 519, `.hc-hl` va gutter esa faqat 504 gacha suriladi → oxirgi ~15 qatorda rangli harflar va qator-raqamlari haqiqiy matndan 15px pastda; joriy-qator chizig'i ikki raqam orasida; holat-satri «Qator 60», gutter esa kursor yonida 59 ni ko'rsatadi.
- Dalil: `t-editor-1b-scrollbar.mjs` («bottom: st ta/hl/gut 991 980 980»), `t-editor-1c-misalign.mjs` («519 504 504»), skrinshot `e1k-misalign-crop.png` (textarea matni oq rangda ochib ko'rsatilgan — ikki qatlam 15px farq bilan), `e1k-caret-end.png`.
- Izoh: Muharrirning bosh va'dasi — «harflar kursordan siljimaydi» — buziladi; o'quvchi bosgan joyi bilan ko'rgan harfi bir xil emas, xato-qatorni sanashi buziladi. Uzun `<p>` matni + pastga surish — 1-modulda oddiy holat.

#### K-E-03 · «Chiroyli» inline teglarni alohida qatorga chiqarib, ko'rinadigan bo'shliq qo'shadi — natija (preview) o'zgaradi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:263–286 (har teg/matn tuguni alohida qatorga), 250–253 (`domFingerprint` bo'shliqni normallashtiradi — shuning uchun tutmaydi), 205–207 (kontrakt: «MA'NOGA TEGMAYDI»)
- Qanday takrorlash: `<p>Salom <b>dunyo</b>. Keyingi gap <a href="#">link</a>!</p>` yozing → «✨ Chiroyli».
- Kutilgan: qisqa xatboshi bir qatorda qoladi yoki natija o'zgarmaydi · Kuzatilgan: 7 qatorga bo'linadi (`Salom` / `<b>dunyo</b>` / `. Keyingi gap` / `<a…>link</a>` / `!`), preview matni «Salom dunyo. Keyingi gap link!» → «Salom dunyo . Keyingi gap link !» (nuqta va undov oldida bo'shliq paydo bo'ldi). `<p>a<br>b</p>` ham 5 qatorga.
- Dalil: `t-editor-4b.mjs` («src render: "Salom dunyo. Keyingi gap link!"» vs «preview after fmt: "Salom dunyo . Keyingi gap link !"»), skrinshot `e4-inline-format.png`.
- Izoh: O'quvchi «chiroyli» tugmasini bosib, sahifasida tinish belgilaridan oldin bo'shliq paydo bo'lganini ko'radi va sababini tushunmaydi; kontraktdagi «ma'noga tegmaydi» kafolati ko'rinishga nisbatan bajarilmaydi. Oddiy gapli `<p>` 5–7 qatorga aylanishi ham 13 yoshli uchun «chiroyli» emas.

#### K-E-04 · JS (va CSS) faylida ham HTML avto-yopish ishlaydi: `if (i<len && j>` → `</len>` tushadi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1476–1503 (`e.key === '>'` bloki `activeLang` bilan chegaralanmagan; `"`-blok 1508 da esa `activeLang==='html'` sharti bor)
- Qanday takrorlash: 3-faylli task, `script.js` tabida yozing: `if (i<len && j>`.
- Kutilgan: faqat `>` · Kuzatilgan: `if (i<len && j></len>)` — kursor `>` dan keyin, orqasida `</len>` paydo bo'ldi. `if (a<b) { c>` → `c>}` (qavs juftligi bilan birga). CSS `ul>li{` — o'tdi (`<` yo'q).
- Dalil: `t-editor-9-jsgt.mjs` chiqishi.
- Izoh: JS darslarida `a<b && c>d` shakl tez uchraydi; o'quvchi HTML tegini ko'rib chalg'iydi, sintaksis xato chiqadi.

#### K-E-05 · Tanlangan matn ustida Tab — tanlov O'CHIB, o'rniga 2 probel qoladi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1429–1456 (`put(el,'  ',s+2)` tanlovni tekshirmaydi)
- Qanday takrorlash: `a\nb\nc` yozing → Ctrl+A → Tab.
- Kutilgan: qatorlar chekintiriladi (VS Code odati) yoki hech narsa · Kuzatilgan: butun kod o'chib, `"  "` qoladi (Ctrl+Z qaytaradi, lekin o'quvchi buni bilmasa — vahima).
- Dalil: `t-editor-3-keys.mjs` («3a Tab with selection: {"s":2,"e":2,"v":"  "}»).
- Izoh: «Hammasini belgilab, chekintiraman» — tabiiy harakat; natijada kod «yo'qoladi».

#### K-E-06 · Juft-teg qayta nomlashdan keyin Ctrl+Z bir qadamda faqat yopuvchini qaytaradi — `<h2>…</h>` nomuvofiq holat, kursor yopuvchi tegga sakraydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1328–1360 (`maybeLinkedRename` alohida `insertText` — alohida undo-qadam)
- Qanday takrorlash: `<h1>Salom</h1>`, kursor `1` dan keyin, Backspace, `2` yozing (→ `<h2>Salom</h2>`), Ctrl+Z.
- Kutilgan: `<h1>Salom</h1>` (yoki hech bo'lmasa juft mos holat) · Kuzatilgan: 1-Ctrl+Z → `<h2>Salom</h>` (yopuvchi teg tanlangan holda, kursor oxirga sakraydi); 2-Ctrl+Z → `<h>Salom</h>`; ya'ni har qadamda nomuvofiq juft.
- Dalil: `t-editor-3-keys.mjs` («3c Ctrl+Z after rename: {"s":9,"e":13,"v":"<h2>Salom</h>"}»).
- Izoh: Ctrl+Z bosgan bola linter xatosi + kursor sakrashini ko'radi; «bekor qilish» ishonchsiz tuyuladi.

#### K-E-07 · Menyu ochiq holda Shift+Enter (yoki `<p ` + Enter) → yangi qatordan keyin atribut-menyu darrov ochiladi, keyingi Enter `class=""` qo'yadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1277 (`mAttr` regex'ida `\s` yangi qatorga ham mos keladi), 1390 (Shift+Enter «chiqish yo'li» izohi)
- Qanday takrorlash: bo'sh muharrir → `<p` → Shift+Enter → Enter.
- Kutilgan: ikki yangi qator · Kuzatilgan: Shift+Enter dan keyin `class`/`id` menyusi ochiq; Enter → `<p\nclass=""`. `<p ` + Enter → `<p class=""`.
- Dalil: `t-editor-2b.mjs` («2k after Shift+Enter menu: class,id», «then Enter: "<p\nclass=\"\""»).
- Izoh: «Chiqish yo'li» aslida boshqa menyuga olib kiradi; kam uchraydi, lekin double-action tuzog'i.

#### K-E-08 · Ctrl+Z har bosishda faqat BITTA harfni qaytaradi (oddiy textarea so'z-guruhini qaytaradi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1744–1764 (controlled `<textarea value=…>` + har harfda `setCaretPos`/`setCodes` re-render)
- Qanday takrorlash: `salom dunyo yaxshi` yozing (18 harf) → Ctrl+Z.
- Kutilgan: bir bosishda so'z/guruh qaytadi · Kuzatilgan: `salom dunyo yaxsh` (1 harf); sahifadagi oddiy `<textarea>`da bir Ctrl+Z hammasini qaytardi.
- Dalil: `t-editor-3b-undo.mjs` («typed 18 chars, Ctrl+Z x1 → "salom dunyo yaxsh"», «plain textarea Ctrl+Z x1 → ""»).
- Izoh: Xato gapni qaytarish uchun 18 marta bosish kerak; ↶ tugmasi ham xuddi shunday.

#### K-E-09 · «Chiroyli» xabari noto'g'ri holatlarda «Avval sintaksis xatosini tuzating» deydi; tugallanmagan hujjatni esa formatlab yuboradi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1576 (null → bitta umumiy xabar), 256–257, 208 (izoh: «tugallanmagan teg … bo'lsa ham null»), 263–286 (yopilmagan `<div><p>a` formatlanadi)
- Qanday takrorlash: (a) bo'sh muharrir → ✨; (b) `<div><pre>a</pre></div>` → ✨; (c) `<p>1 < 2</p>` → ✨; (d) `<div><p>a` → ✨.
- Kutilgan: (a–c) sababga mos xabar (bo'sh / `<pre>` qo'llanmaydi / matndagi `<`), (d) null yoki xabar · Kuzatilgan: (a–c) hammasi «Avval sintaksis xatosini tuzating» — sintaksis xatosi yo'q; (d) `<div>\n  <p>\n    a` deb formatlandi.
- Dalil: `t-editor-4b.mjs` (pre/empty/lone< → «Avval sintaksis…»; unclosed → val `"<div>\n  <p>\n    a"`).
- Izoh: Bola bo'sh muharrirda «sintaksis xatosi» deb o'qib qidiradi; `1 < 2` matni brauzerda to'g'ri ishlaydi, lekin «xato» deyiladi.

#### K-E-10 · «Chiroyli»dan keyin kursor va scroll hujjat boshiga ketadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1581 (`setSelectionRange(0,0)`)
- Qanday takrorlash: 50 ta `<div><p>…</p></div>` bir qatorda → kursor o'rtada → ✨.
- Kutilgan: kursor taxminan o'sha joyda · Kuzatilgan: kursor 0, scrollTop 0 (150 qatorli hujjat boshiga).
- Dalil: `t-editor-4-fmt.mjs` («4u after format long: {"st":0,"s":0,"lines":150}», «4u caret after fmt: s:0»).
- Izoh: Uzun kodda yozayotgan joyini qayta topishi kerak.

#### K-E-11 · «Chiroyli» bo'sh juftni ikki qatorga bo'ladi: `<p></p>` → `<p>\n</p>`  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:275–283 (bir qatorda qoldirish sharti `a.t==='text'` talab qiladi — bo'sh juftda text tuguni yo'q)
- Qanday takrorlash: menyu orqali `<p></p>` va `<div></div>` qo'ying → ✨.
- Kutilgan: `<p></p>` bir qatorda · Kuzatilgan: `<p>\n</p>\n<div>\n</div>`.
- Dalil: `t-editor-4-fmt.mjs` («emptyp → "<p>\n</p>\n<div>\n</div>"»).
- Izoh: Menyu bilan endigina qo'yilgan juft «buzilib» ko'rinadi.

#### K-E-12 · Ustun raqami va menyu x-o'rni UTF-16/monoshrift taxminiga tayanadi: emoji va tab belgisi noto'g'ri sanaladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1152–1155 (`col = before.length - lastIndexOf('\n')`), 1235–1238 (`col * cw`)
- Qanday takrorlash: `<p>😀 a</p>` — kursor emojidan keyin; `\t\t\t\tx` — oxirida; `<p>😀😀😀😀😀😀 <`.
- Kutilgan: Ustun 5 / Ustun 9 (tab-size 2) / menyu kursor ostida · Kuzatilgan: «Ustun 6» (emoji 2 birlik), «Ustun 3» (4 ta tab 4 ustun deb), menyu emoji satrida 14px chapda, 4 tabdan keyin 34px chapda; ZWJ-emoji satrida «Ustun 26» (ko'rinishi ~18).
- Dalil: `t-editor-7-a11y.mjs` (7a), `t-editor-8-misc.mjs` (8b: `menuX 155 / caretX 169`, `54 / 88`), skrinshot `e8b-menu-x.png`.
- Izoh: Xato-xabari «Qator N» ni ko'rsatadi (ustun emas), shuning uchun ta'sir kichik; menyu siljishi ko'zga tashlanadi.

#### K-E-13 · Teg nomi to'liq o'chirilib qayta yozilsa juft yangilanmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1334–1337 (`mo` eski nomni topolmasa — chiqadi)
- Qanday takrorlash: `<p>a</p>`, kursor `p` dan keyin, Backspace (`<>a</p>`), `h1` yozing.
- Kutilgan: `<h1>a</h1>` · Kuzatilgan: `<h1>a</p>`.
- Dalil: `t-editor-3-keys.mjs` («3f retype h1: "<h1>a</p>"»).
- Izoh: «Nomni o'chirib qaytadan yozish» — bola uchun eng tabiiy tahrir yo'li; natijada linter xatosi.

#### K-E-14 · Katta harfli teg `<P>` → `<P></p>` aralash registr  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1498–1502 (`name` lowercase qilinib juftga yoziladi)
- Qanday takrorlash: `<P>` yozing.
- Kutilgan: `<P></P>` (yoki ikkalasi kichik) · Kuzatilgan: `<P></p>`.
- Dalil: `t-editor-3-keys.mjs` («3e uppercase P: "<P></p>"»).
- Izoh: CapsLock yoqilgan bolada juft «bir xil emas» — «juftni bir xil yoz» sabog'iga zid.

#### K-E-15 · Atribut qiymati ichida `>` yozilsa avto-yopish otiladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1493–1502 (`inner` regex tirnoqni hisobga olmaydi)
- Qanday takrorlash: `<a href="a>` yozing (davomida `b">` yozmoqchi).
- Kutilgan: faqat `>` · Kuzatilgan: `<a href="a></a>` va davomi `<a href="a>b"></a>"`.
- Dalil: `t-editor-3-keys.mjs` («3e attr contains >: "<a href=\"a>b\"></a>\""»).
- Izoh: Kam uchraydi (title/URL ichida `>`), lekin bo'lganda kod «o'zi buziladi».

#### K-E-16 · Yolg'iz so'z-menyu: teg bo'lmagan oddiy so'z (`Bu`, `a`, `Ol`) + Enter → teg tushib qoladi; kursor so'zga ko'chirilganda ham menyu ochiladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1288–1295 (bare-so'z filtri faqat prefiks bo'yicha; `<div>`/`<section>`/yuqori daraja himoyalanmagan — TEXT_TAGS ro'yxati 605–608), 1751 (`onSelect` → `refreshMenu`)
- Qanday takrorlash: `<div>` ichida yangi qatorda `Bu` yozing → Enter (yangi qator kutib); yoki `<section>` ichida `a` → Enter; yoki `Ol` → Enter.
- Kutilgan: yangi qator · Kuzatilgan: `<button></button>`, `<a href=""></a>`, `<ol>\n  <li></li>…</ol>` tushadi. Shuningdek: `p` yozilgan qatorga sichqoncha/strelka bilan kursor kelsa (yozmasdan) ham menyu ochiladi.
- Dalil: `t-editor-10.mjs` («"<div>\n  Bu" menu true → Enter → "<div>\n  <button></button>"»), `t-editor-2-menu.mjs` (2p).
- Izoh: `<p>` ichida himoya bor (inTextTag), lekin `<div>`/`<body>` darajasida matn yozayotgan bola («Bu mening sahifam» ni qatorlarga bo'lib) tasodifan teg oladi.

#### K-E-17 · Klaviatura fokus-tuzog'i: textarea'dan Tab/Shift+Tab/Esc/Ctrl+Tab bilan chiqib bo'lmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1429 (Tab har doim `preventDefault`), 1445–1451 (Shift+Tab ham), Esc faqat menyuga
- Qanday takrorlash: muharrirga fokus → Tab / Shift+Tab / Esc+Tab / Ctrl+Tab.
- Kutilgan: qandaydir yo'l bilan keyingi tugmaga («Ishga tushirish», «Davom etish») o'tish · Kuzatilgan: fokus doim `hc-code`; faqat sichqoncha bilan chiqiladi. Boshqa tugmalar (tab, ↶↷, ✨, ▶) fokus-halqa bilan Tab-tartibda ✓.
- Dalil: `t-editor-7b.mjs` («Esc+Tab from textarea → hc-code», «Ctrl+Tab → hc-code»).
- Izoh: Klaviatura-foydalanuvchi/ekran-o'quvchi «Davom etish»ga yetolmaydi; kod-muharrirlarda odatiy, lekin chiqish yo'li ko'rsatilmagan.

#### K-E-18 · «Qaytadan»: 8 soniyadan keyin qaytarish yo'li yo'q — Ctrl+Z ham qaytarmaydi, saqlov ham ustidan yozilgan  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1614–1634 (`setCodes` — brauzer tarixidan tashqari; `restoreTimerRef` 8000ms), 944–948 (400ms saqlov)
- Qanday takrorlash: kod yozing → «Qaytadan» ×2 → 8.3 s kuting → Ctrl+Z / localStorage'ga qarang.
- Kutilgan: qaytarish yo'li qolishi · Kuzatilgan: «↶ Qaytarish» yo'qoldi, Ctrl+Z starter'ni qaytaradi (`<!-- Bu yerga yozing -->`), localStorage'da starter.
- Dalil: `t-editor-5-tabs.mjs` («5d restore btn after 8.3s? false», «Ctrl+Z after reset: "<h1>Boshi</h1>\n"» — starter), `t-editor-3b-undo.mjs`.
- Izoh: Ikki bosqichli tasdiq bor, lekin 8 s — bola boshqa narsaga chalg'igan bo'lsa ish butunlay yo'q.

#### K-E-19 · 20 000 belgidan oshganda ranglash jimgina o'chadi — xabar yo'q  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:195–199 (`HL_MAX`, `esc(src)`)
- Qanday takrorlash: 19 998 belgili kod → yana 3 belgi yozing.
- Kutilgan: bironta yozuv (holat-satrida yoki xabar maydonida) · Kuzatilgan: barcha ranglar bir zumda oq matnga aylanadi, xabar maydoni eski hint'ni ko'rsatadi.
- Dalil: `t-editor-8-misc.mjs` («8d 19998 tokens? true», «8d 20001 tokens? false msg "💡 …"»), `e1d-hlmax.png`.
- Izoh: Bola «muharrir buzildi» deb o'ylashi mumkin; darslarda 20k kam uchraydi.

#### K-E-20 · Fayl-tab bosilganda fokus tugmada qoladi; tab tugmalarida `type`/`role`/`aria-selected` yo'q  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1715–1721
- Qanday takrorlash: `style.css` tabini bosing → yozishni boshlang.
- Kutilgan: fokus muharrirda (VS Code odati) yoki tab `role=tab aria-selected` · Kuzatilgan: `document.activeElement = hc-tab active`, yozilgan harflar hech qayerga tushmaydi; attributlar `type:null, aria:null, role:null` (panetabs'da esa `role=tab aria-selected` bor — nomuvofiq).
- Dalil: `t-editor-5-tabs.mjs` («5a focus after tab click: hc-tab active», «5f tab btn attrs»).
- Izoh: Har tab almashishda qo'shimcha bosish; ekran-o'quvchi tabni «tugma» deb o'qiydi.

#### K-E-21 · `<h|>` holatida menyudan tanlash ortiqcha `>` qoldiradi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1303–1324 (`acceptMenu` kursordan keyingi `>`ni hisobga olmaydi)
- Qanday takrorlash: `<>` yozing, kursorni `<` bilan `>` orasiga qo'ying, `h` → Enter.
- Kutilgan: `<h1></h1>` · Kuzatilgan: `<h1></h1>>`.
- Dalil: `t-editor-8-misc.mjs` («8e Enter → "<h1></h1>>"»).
- Izoh: Kam uchraydi.

#### K-E-22 · Tokenizator chekkalari: CSS string ichidagi `: ; { }` buziladi, `@media` ichidagi selektor atribut rangida, JS `1.5e3`/regex literal  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:143–165 (hlCss tirnoqni bilmaydi; `inBlock` bir darajali), 186–188 (raqam `[\d.]`), 168–193 (regex-literal yo'q); 99–141 (`<script>` ichidagi `a<b` teg deb bo'yaladi)
- Qanday takrorlash: `window.HC.highlight(...)` bilan: `a::before{content:"a:b;{}"}`, `@media (max-width:600px){ .a{color:red} }`, `let x = 1.5e3; /ab+c/g`, `<script>if(a<b){}</script>`.
- Kutilgan: string yaxlit yashil; `.a` selektor rangida; `1.5e3` yaxlit raqam · Kuzatilgan: `"a` yashil, `:` punct, `b` yashil, `;{}` punct, `"` teg-rangda; `.a` sariq (attr); `1.5` binafsha, `e3` oq; `a<b` da `b` teg-rangda. Matn o'zi buzilmaydi (faqat rang).
- Dalil: `t-editor-1-hl.mjs` (1j css3/css2/js/html).
- Izoh: Faqat rang; darslarda kam uchraydi (content:"…" ba'zi CSS darslarida).

#### K-E-23 · Soft-wrap yo'q — uzun `<p>` matni gorizontal scroll talab qiladi (ayniqsa telefonda)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1990 (`white-space:pre`), 1744 (`wrap` atributi yo'q)
- Qanday takrorlash: 390px telefonda `<p>` ichiga 2–3 gap yozing.
- Kutilgan/Kuzatilgan: matn o'ngga cho'ziladi, o'qish uchun surish kerak (bu K-E-02 ni ham keltirib chiqaradi).
- Dalil: `e1a-longline.png` (surilganda matn gutter raqamlariga tegib turadi).
- Izoh: Faqat kuzatuv; joriy dizayn qarori.

#### K-E-24 · Textarea'da `aria-label` yo'q  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1744–1764
- Kuzatilgan: `aria-label=null`, `<label for>` yo'q; faqat placeholder («Kodingizni shu yerga yozing…») — u yozilgach yo'qoladi.
- Dalil: `t-editor-7-a11y.mjs` (7c).

#### K-E-25 · Belgi eni bir marta o'lchanadi — web-shrift (JetBrains Mono) keyin yuklansa menyu x-o'rni eskirgan enda qoladi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1225–1233 (`charWRef` faqat fontSize o'zgarganda 0 lanadi), 1920 (`@import` Google Fonts)
- Qanday takrorlash: stendda tekshirib bo'lmadi (oflayn — shrift kelmaydi); kod-o'qishdan tashxis: birinchi `<` fallback-shriftda o'lchanadi, keyin JetBrains Mono kelsa `cw` yangilanmaydi.
- Izoh: Faqat kesh yo'q birinchi ochilishda, sekin internetda; keyingi tahrirlarda ham saqlanib qoladi (sahifa yangilanguncha).

---

### Skrinshotlar (dev/hc-stend/)
`e1a-longline.png`, `e1b-tab.png`, `e1c-unicode.png`, `e1d-hlmax.png`, `e1e-bottom.png`, `e1e-endtype.png`, `e1f-fontplus.png`, `e1g-arrowscroll.png`, `e1i-empty.png`, `e1k-scrollbar-bottom.png`, `e1k-scrollbar-right.png`, `e1k-caret-end.png`, `e1k-misalign-crop.png`, `e2a-menu-lt.png`, `e2f-menu-bottom.png`, `e2f-menu-right.png`, `e2q-menu-last.png`, `e4-inline-format.png`, `e5d-armed.png`, `e6a-phone.png`, `e6a-phone-menu.png`, `e6a-phone-result.png`, `e6b-tablet.png`, `e6c-tablet-land.png`, `e6d-narrow-mouse.png`, `e6e-phone-3files.png`, `e6f-desktop-split30.png`, `e6g-1366-tabs.png`, `e7-focusring-undo.png`, `e8b-menu-x.png`.


---
---

# §C — NATIJA-OYNASI / RUNTIME / XAVFSIZLIK (asl: `dev/hc-stend/hisobot-preview.md`)

## HC natija-oynasi · konsol · runtime · xavfsizlik — sinov hisoboti

Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (2155 satr) · Stend: `dev/hc-stend/` (Chrome headless, playwright-core)
Skriptlar: `t-preview-1-security.mjs`, `t-preview-1b…1g.mjs`, `t-preview-2-stability.mjs`, `t-preview-2b…2f.mjs`, `t-preview-3-console.mjs`, `t-preview-3b.mjs`, `t-preview-4-render.mjs`, `t-preview-4b.mjs`, `t-preview-5-previewurl.mjs`, `t-preview-7-layout.mjs`, `t-preview-7b.mjs`, `t-preview-8-leak.mjs`, `t-preview-9-reverify.mjs`. Skrinshotlar `shot-*.png` shu papkada.
Hech narsa tahrirlanmadi (na `src/`, na `scripts/`). Har topilma kamida 2 marta bajarilib tasdiqlandi.

### Jadval

| Og'irlik | Soni | ID'lar |
|---|---|---|
| 🔴 kritik | 1 | K-P-01 |
| 🟠 muhim | 12 | K-P-02 … K-P-13 |
| 🟡 mayda | 10 | K-P-14 … K-P-23 |
| 🔵 taklif/kuzatuv | 4 | K-P-24 … K-P-27 |
| **Jami** | **27** | |

### Nima sinaldi (✓ o'tdi = kamchilik topilmadi)

**Sandbox / xavfsizlik** — `sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"` (1851-satr), yashirin tekshiruv-iframe `sandbox="allow-scripts"` (1886):
- ✓ `parent.localStorage.setItem` → SecurityError, ota localStorage o'zgarmadi
- ✓ `parent.document.body.innerHTML=''` → bloklandi, `.hc-root` tirik
- ✓ `top.location=` / `<a target=_top>` / `<a target=_parent>` / `<form target=_top>` → «allow-top-navigation is not set», LMS sahifasi joyida
- ✓ `<form action>` submit → «allow-forms is not set», bloklandi
- ✓ `document.cookie`, `sessionStorage`, `localStorage` iframe ichida → SecurityError; `location.origin === "null"`
- ✓ `fetch('http://127.0.0.1:4517/')` → CORS (origin null) bloklandi
- ✓ `alert/confirm/prompt` → sahifani BLOKLAMAYDI (allow-modals yo'q) — lekin jim yutiladi, qarang K-P-05
- ✓ `location.reload()` iframe ichida → faqat iframe qayta yuklandi
- ✓ `<video>/<audio>/<iframe src=… >/<iframe srcdoc>` — ruxsat, ichki iframe yuklanadi
- ✓ `parent.postMessage` 5000 marta → React qotmadi
- ✓ Nonce: 5 marta tez ▶ → faqat oxirgi run'ning logi chiqdi (eski/yangi aralashmadi)
- ✗ K-P-02, K-P-03, K-P-11, K-P-17, K-P-18, K-P-23

**Barqarorlik**:
- ✓ `while(true){}` — ASOSIY React oynasi tirik qoladi (yozish 55 ms, chiplar ishlaydi, `p.evaluate` 1 ms) — sandboxed frame alohida jarayonda
- ✓ Rekursiya `function f(){f()}f()` → «Uncaught RangeError: Maximum call stack size exceeded» panelda
- ✓ 100 000 `<div>` → 66 ms, tirik; `document.write` → ishlaydi, konsol keladi
- ✓ `setInterval` ×100 → panel 200 satrda to'xtaydi, sahifa tirik
- ✓ `throw`, SyntaxError, ReferenceError, click-handler xatosi, `setTimeout` ichidagi xato → panelda qizil satr; JS xatosida HTML baribir ko'rinadi (bo'sh qolmaydi)
- ✓ Bola `window.onerror=…` yoki `console.log=…` ustidan yozsa harness buzilmaydi
- ✗ K-P-01, K-P-04, K-P-06, K-P-07, K-P-08

**Konsol-panel**: ✓ har ▶ da tozalanadi (`runNow` → `setConsoleLines([])`); ✓ HTML tahriri konsolni o'chirmaydi, «eskirdi · ▶ bosing» yonadi; ✓ «tozalash» tugmasi ishlaydi, bo'sh matn qaytadi; ✓ log/info/warn/error rang bilan farqlanadi (`lvl-*`); ✓ 10 000 belgi bir satr — o'raladi (wrap), gorizontal scroll yo'q; ✓ ko'p argument bo'sh joy bilan; ✓ `console.log()` bo'sh satr. ✗ K-P-06, K-P-07, K-P-16, K-P-20.

**Render-vaqti**: ✓ debounce 300 ms (994-satr): 47 belgi 40 ms/belgi → 1 iframe yuklash; 400 ms/belgi → har belgida 1 (dizayn); ✓ JS-fayli bor darsda qo'lda rejim (▶) va «eskirdi» nishoni; ✓ IMG_FALLBACK: tashqi yo'q URL / nisbiy yo'l / bo'sh src / alt yo'q → tushuntiruvchi quti, `<img>` DOM'da qoladi (display:none); data: va ishlaydigan URL → quti yo'q; ikkita buzuq → ikkita quti; `<img alt>` (srcsiz) → quti yo'q. ✗ K-P-09, K-P-10, K-P-13, K-P-14, K-P-15, K-P-19.

**previewUrl / previewCss**: ✓ manzil-satri, 3 nuqta, «●» qulf, RU/UZ tarjima; ✓ ustuvorlik `baseStyle → previewCss → bola CSS` haqiqatan shunday (bola `h1{color:green}` previewCss `purple` ni yengdi; `body{padding}` ham); ✓ previewCss `!important` bola CSS'ni yengadi (kutilgan CSS-qoida). ✗ K-P-21, K-P-24.

**StyleTag / xotira**: ✓ barcha selektorlar `.hc-` prefiksli (`*`, `body`, `button` global emas — faqat `.hc-root *`, `.hc-panetabs button`); ✓ 20× mount/unmount: `message` listener add=40/rem=40, timer set=120/cleared=164, `<style>` 1→0, `<iframe>` 2→0, `.hc-root` 0, heap 5→7 MB; ✓ `document.head` da qoldiq `<style>` yo'q (parseCss o'zinikini olib tashlaydi); ✓ unmount+mount qotgan iframe'ni tiklaydi (yangi jarayon). ✗ K-P-25, K-P-26.

**Layout** (LMS-qobiq `position:fixed;inset:0` emulyatsiya, viewport meta bilan): ✓ 768×1024, 1366×768, 2560×1440 (max-width 1740 markazda), 412×915, 375×667 — gorizontal scroll yo'q, tab-rejim (Kod/Natija) ishlaydi. ✗ K-P-12, K-P-22.

---

### Topilmalar

#### K-P-01 · Cheksiz sikl butun runtime'ni qotiradi va ▶/tahrir TIKLAMAYDI  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1848–1852 (`<iframe srcDoc={doc}>`), 1882–1889 (yashirin tekshiruv-iframe, jonli), 992–1012 (debounce → `setCheckDoc`), 1592–1599 (`runNow`)
- Qanday takrorlash:
  1. JS-fayli bor dars, `checks.logs(5)` runtime-shart. `script.js` tabida yozing: `let i=0;` Enter `while(i<3){` — muharrir `}` ni o'zi qo'yadi → matn `while(i<3){}` (t-preview-2e.mjs: `value after typing '{': "let i=0;\nwhile(i<3){}"`).
  2. 300 ms dan keyin yashirin tekshiruv-iframe shu kodni ishga tushiradi → cheksiz sikl.
  3. Kodni tuzating (`i++` qo'shing), 6 s kuting → chip yashil bo'lmaydi. ▶ bosing → konsol bo'sh, natija yangilanmaydi.
  4. HTML-only jonli rejimda ham: `<h1>A</h1><script>while(true){}</script>` yozing, keyin `<h1>B</h1>` ga almashtiring — 40 s kuzatildi, frame «HUNG» (t-preview-2c.mjs).
- Kutilgan: bola kodni tuzatgach preview/chiplar tiklanadi yoki hech bo'lmasa «kod qotib qoldi» xabari · Kuzatilgan: hamma iframe (ko'rinadigan + yashirin — bir null-origin jarayonda) abadiy qotadi; `srcdoc` almashtirish navigatsiyani boshlay olmaydi; hech qanday xabar yo'q; konsolda hatto sikldan OLDINGI `console.log("before")` ham chiqmaydi. Faqat `unmountHC()+mountHC()` (darsdan chiqib-kirish / sahifa reload) tiklaydi (t-preview-8-leak.mjs oxiri).
- Dalil: t-preview-2c.mjs chiqishi (`after 40s: (HUNG)`), t-preview-2d.mjs (`after fix 6s: chip [ 'hc-chip ' ]`), t-preview-2f.mjs (`visible preview after hidden hang: console lines []`, ikkala frame `(HUNG)`). Skrinshot olib bo'lmadi — Playwright screenshot ham qotgan frame'ni kutib timeout beradi (`shot-while-true` yo'q).
- Izoh: `while`/`for` sikllarini o'rganayotgan bola uchun ODATIY oraliq holat (`{` avtoyopilishi, `i++` unutish, `while(x<5)` teskari shart). Undan keyin ✓ belgilar hech qachon yonmaydi, «Davom etish» ochilmaydi, bola «men to'g'ri yozdim-ku» deb qoladi; LMS'da darsdan chiqib qayta kirish kerakligini hech kim aytmaydi.

#### K-P-02 · `<a href="#…">` va nisbiy havola LMS sahifasini yangi tabda ochadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:890 (`<base target="_blank">`), 1851 (`allow-popups allow-popups-to-escape-sandbox`)
- Qanday takrorlash: HTML: `<a id=a href="#bolim2">2-bo'lim</a> …<h2 id="bolim2">` → previewda havolani bosing. Yoki `<a href="page2.html">`.
- Kutilgan: sahifa ichida `#bolim2` ga suriladi (yoki hech bo'lmasa iframe ichida qoladi) · Kuzatilgan: yangi tab ochiladi, manzili `http://127.0.0.1:4517/#bolim2` (= OTA/LMS URL + hash; srcdoc'ning base URL'i ota sahifaniki), iframe scrollY=0 qoladi. `page2.html` → `http://127.0.0.1:4517/page2.html` (LMS-domenidagi 404) yangi tabda.
- Dalil: t-preview-4b.mjs (`anchor #: popups ['popup:http://127.0.0.1:4517/#pastki'] … scrollY 0`), t-preview-9-reverify.mjs R1, `shot-anchor.png`.
- Izoh: «Havolalar/navigatsiya» darsida bola o'z sahifasidagi ichki havolani bosadi — butun LMS yangi tabda ochiladi (ikkinchi seans, kutilmagan ekran). Sandboxdan chiqqan (`escape-sandbox`) yangi tab to'liq huquqli.

#### K-P-03 · Har preview-yangilanish brauzer tarixiga yozuv qo'shadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1848–1852 (`srcDoc={doc}` atribut-almashtirish = iframe navigatsiya), 994–1000
- Qanday takrorlash: HTML jonli rejimda 11 ta harfni 450 ms oraliqda yozing; CDP `Page.getNavigationHistory` yoki `history.length` ni oling.
- Kutilgan: kompilyator ichidagi ish tarixga tushmaydi · Kuzatilgan: `history.length` 2 → 7 (5 tahrir) → 16 (11 harf): HAR yangilanish +1 yozuv (`entries` hammasi LMS URL'i). Top-oynada `history.back()` chaqirilsa sahifa emas, iframe oldingi srcdoc holatiga qaytadi (matn `Salom 2 qo\`shimcha` — editor bilan mos kelmaydi).
- Dalil: t-preview-1e.mjs, t-preview-1f.mjs chiqishi.
- Izoh: LMS'da bola 50 harf yozgach brauzer «Orqaga» tugmasi 50 marta iframe'ni aylanadi (yoki LMS o'zining `history.back()` bilan «Orqaga» qilsa — darsdan chiqmaydi, faqat preview eskiga qaytadi). Editor va natija bir-biriga mos kelmay qoladi.

#### K-P-04 · Xato-satri raqamsiz, inglizcha, `lineno` 54 satrga siljigan  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:791 (`send('error',[e.message])` — faqat message), 885–905 (`wrapDoc`: bola JS hujjatning ~55-satridan boshlanadi)
- Qanday takrolash: JS: `console.log(1);\nconsole.log(2);\nfoo();` → ▶.
- Kutilgan: «3-qator: foo aniqlanmagan» kabi joy ko'rsatkichi · Kuzatilgan: `Uncaught ReferenceError: foo is not defined` — qator yo'q; sinov `window.addEventListener('error', e=>console.log(e.lineno))` → `LINENO 57` (bola 3-qatori). Xabar brauzerning inglizcha matni, RU/UZ emas. Konsol xato-satrini bosib qatorga sakrab bo'lmaydi (HTML-linter `jumpToLine` bor, konsolda yo'q).
- Dalil: t-preview-2-stability.mjs (`throw`, `ReferenceError` bloklari), t-preview-3b.mjs (`LINENO 57 COL 1`), `shot-console-throw.png`.
- Izoh: 13 yoshli bola «foo is not defined» ni tarjima qilib, qatorni o'zi qidiradi.

#### K-P-05 · `alert/prompt/confirm` jimgina yutiladi — panelda hech xabar yo'q  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1851 (`allow-modals` yo'q — to'g'ri xavfsizlik qarori), 776–793 (`CONSOLE_FORWARD` — brauzerning «Ignored call to alert()» ogohlantirishi ushlanmaydi)
- Qanday takrorlash: JS: `alert("Salom!"); console.log("alertdan keyin")` → ▶. `let ism = prompt("Ismingiz?"); console.log("Salom, "+ism); console.log(confirm("?"))`.
- Kutilgan: yoki oyna chiqadi, yoki panelda «alert bu yerda ishlamaydi» · Kuzatilgan: hech narsa; panelda faqat `alertdan keyin`; `Salom, null`, `false`. HTML-only rejimda umuman iz yo'q.
- Dalil: t-preview-3b.mjs (`alert JS rejim: ['›alertdan keyin']`, `prompt/confirm: ['›Salom, null','›false']`), t-preview-1b.mjs (`after-alert 1ms`).
- Izoh: `alert("Salom dunyo")` — ko'p bolaning birinchi JS qatori. «Ishlamayapti» + sababsiz.

#### K-P-06 · Konsol 200 satrda jim to'xtaydi, auto-scroll yo'q  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1034 (`prev.length >= 200 ? prev : …`), 1862–1874 (panel), 2039 (`.hc-console-body`)
- Qanday takrorlash: `for(let i=1;i<=500;i++)console.log("qator",i)` → ▶. `setInterval(()=>console.log("tick"),10)` → ▶, 1.5 s kuting.
- Kutilgan: «…300 satr yashirildi» kabi belgi; yangi satrlar ko'rinishi uchun panel pastga suriladi · Kuzatilgan: 200 satr, oxirgisi `qator 200`, hech qanday «kesildi» belgisi; `scrollTop: 0` — bola birinchi satrlarni ko'radi, oxirgilari ko'rinmaydi; setInterval — 200 dan keyin panel «o'lgan»dek, dastur esa davom etyapti.
- Dalil: t-preview-2-stability.mjs (`1000 logs | lines: 200`, `after 1.5s more lines: 200`), t-preview-3-console.mjs (`300 log → panel: {st:0, sh:5171, ch:152, n:200}`), t-preview-9 R3, `shot-console-1000.png`.
- Izoh: sikl-darslarida bola `i` ni 200 dan keyin ko'rmaydi va «sikl 200 da to'xtadi» deb o'ylashi mumkin.

#### K-P-07 · Error/Map/Set/Date/DOM obyektlar `{}` / `[object Object]` bo'lib chiqadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:782 (`fmt`: `JSON.stringify(a)`), 769–771 (`CONSOLE_CAPTURE` xuddi shunday)
- Qanday takrorlash: `try{JSON.parse("{bad")}catch(e){console.error(e);console.log("xato:",e)}`; `console.log(new Map([[1,2]]), new Set([1]), new Date(0), document.body, [undefined,null], {u:undefined})`; `const o={};o.self=o;console.log(o)`.
- Kutilgan: `SyntaxError: Unexpected token b…`, `Map(1) {1 => 2}`, `<body>` kabi ma'noli chiqish · Kuzatilgan: `{}` `xato: {}` (Error → JSON `{}`), Map/Set/body → `{}`, Date → `"1970-01-01T00:00:00.000Z"` (qo'shtirnoq bilan), `[undefined,null]` → `[null,null]`, `{u:undefined}` → `{}`, siklik obyekt → `[object Object]`, `console.error(new Error("obj xato"))` → `{}`.
- Dalil: t-preview-2b.mjs (`types:` satri), t-preview-2-stability.mjs (`error object` bloki), t-preview-9 R4.
- Izoh: `catch(e){console.log(e)}` — xatoni ushlashni o'rgatishda panel `{}` ko'rsatadi; bola xato matnini ko'rmaydi.

#### K-P-08 · `</script>` JS-satr ichida (va `</style>` CSS'da) hujjatni buzadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:900 (`<script>${js || ''}<\/script>` — ekranlanmagan inyeksiya), 892–893 (`<style>…${css}</style>`)
- Qanday takrorlash: JS: `document.getElementById("o").innerHTML="<b>qalin</b>"; console.log("</script>")` → ▶. CSS: `h1{color:blue} </style><h2>CSSINJ</h2><style>`.
- Kutilgan: satr sifatida chiqadi · Kuzatilgan: skript o'sha joyda uziladi — konsol `Uncaught SyntaxError: Invalid or unexpected token`, natijada `")` matni ko'rinadi, `innerHTML` bajarilmaydi; CSS holatida `CSSINJ` sarlavhasi sahifaning tepasida paydo bo'ladi. HTML faylidagi `<script>` da ham xuddi shu (`inline html script` sinovida ikkinchi SyntaxError shu sabab).
- Dalil: t-preview-2b.mjs (`</script> in JS`, `</style> in CSS`), t-preview-9 R2, `shot-script-inject.png`.
- Izoh: «HTML'ni JS'dan yozish» (`innerHTML`, template) darslarida bola satr ichida teg yozadi — `</script>` uchrashi realistik.

#### K-P-09 · IMG_FALLBACK matni va `<html lang>` faqat o'zbekcha  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:869–883 (`IMG_FALLBACK` — `'rasm topilmadi — <code>src</code> manzilini tekshiring'`, `'alt matni yozilmagan'` qattiq yozilgan), 886 (`<html lang="uz">`), 1850 (`title="natija"`)
- Qanday takrorlash: `mountHC({lang:'ru'})`, HTML: `<img src="x.png" alt="Яблоко">`.
- Kutilgan: rus darsda «изображение не найдено — проверьте src» · Kuzatilgan: `🖼 / Яблоко / rasm topilmadi — src manzilini tekshiring`, `documentElement.lang === "uz"`.
- Dalil: t-preview-4b.mjs (`RU fallback:` satri).
- Izoh: RU-o'quvchi natija oynasida o'zbekcha ko'rsatma ko'radi (RU_I18N_SPEC buzilishi).

#### K-P-10 · baseStyle bola yozmagan uslubni «bo'yab» qo'yadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:850–860 (`body{padding:24px; font-family:-apple-system…; line-height:1.6}`, `h1{font-family:Georgia,serif}`, `img{max-width:100%;border-radius:12px;display:block;margin:10px 0}`, `p{margin:0 0 12px}`, `li:empty{display:none}`)
- Qanday takrorlash: HTML: `<h1>Sarlavha</h1><p>Matn</p><img src="x.png" alt="rasm"><ul><li>a</li><li></li></ul>`, CSS bo'sh; keyin bola CSS: `body{margin:0} h1{margin:0}`.
- Kutilgan: bola yozmagan narsa — brauzer standarti (Times, 8px margin, to'rtburchak rasm) · Kuzatilgan: body padding 24px (bola `body{margin:0}` yozsa ham 24px qoladi — «nega bo'sh joy ketmadi?»), h1 Georgia serif (bola sans yozganda h1 hali serif), img 12px yumaloq burchak + `display:block` (matn yonidagi rasm qatorga tushmaydi), `<li></li>` yashirin (`li:empty`), `p` standart margin o'zgargan. previewCss bo'lmagan oddiy HTML/CSS darsida ham shunday.
- Dalil: t-preview-4-render.mjs (`baseStyle:` va `bola override:` bloklari), `shot-basestyle.png`.
- Izoh: «CSS'siz sahifa qanday ko'rinadi → CSS nima o'zgartiradi» sabog'i buziladi: bola `border-radius` yozmasdan yumaloq rasm ko'radi, `padding` tushunchasini o'zi yozmagan 24px bilan chalkashtiradi. (Ataylab dizayn bo'lsa — hech joyda tushuntirilmagan.)

#### K-P-11 · `__hcReport` soxtalashtirish — nonce oddiy hisoblagich, `origin/source` tekshirilmaydi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1015–1026 (`onMsg`: faqat `d.__hcReport && d.nonce === nonceRef.current`), 966 (`nonceRef` 1 dan boshlanadi), 839
- Qanday takrorlash: runtime-shartli dars (`checks.logs(5)`, `checks.toggle(...)`), `script.js`: `setTimeout(()=>{for(let n=1;n<300;n++)parent.postMessage({__hcReport:true,nonce:n,results:{r1:true,r2:true}},"*")},600)` (id'lar dars-manbasida ochiq). ▶ bosish shart emas — yashirin iframe o'zi ishlaydi.
- Kutilgan: chiplar o'zgarmaydi · Kuzatilgan: 2/2 chip yashil, `Davom etish` `disabled=false` — hech qanday shart bajarilmagan. (Darhol yuborilsa harness 50 ms dan keyin haqiqiy natija bilan ustidan yozadi — shu sabab `setTimeout` kerak.)
- Dalil: t-preview-1g.mjs (`spoof chips … ['hc-chip ok','hc-chip ok'] | Davom etish disabled? false`).
- Izoh: LMS'da «Davom etish» = progress/ball; nonce 1..N va `e.source`/`e.origin` tekshirilmagani uchun boshqa iframe/kengaytma ham hisobot yubora oladi.

#### K-P-12 · 600 px balandlikda sarlavha va «Davom etish» kesiladi (100dvh + overflow:hidden)  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1924–1929 (`.hc-root{height:calc(100dvh/var(--lz,1)); justify-content:center; overflow:hidden}`), 1953 (`.hc-split{height:calc(62dvh/…)}`)
- Qanday takrorlash: viewport 1024×600 (1366×768 noutbuk + brauzer-panel + taskbar ≈ 600–650 px), 3 faylli dars, LMS-qobiq `position:fixed;inset:0`.
- Kutilgan: hamma boshqaruv ko'rinadi (kerak bo'lsa ichki scroll) · Kuzatilgan: sarlavha «Layout» yuqoridan kesilgan, pastda «Davom etish» tugmasining yarmi ekrandan tashqarida (`.hc-bottom` top=563, height=48, viewport 600), scroll yo'q (overflow:hidden). 1366×768 da toza.
- Dalil: `shot-layout-1024x600-short.png`, t-preview-7-layout.mjs (`bottom: "975x48@563"`).
- Izoh: maktab noutbuklarida odatiy balandlik; bola «Davom etish» ni ko'rmaydi/bosolmaydi.

#### K-P-13 · Jonli rejimda har tahrirda natija scroll'i 0 ga qaytadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:994–996 (`setDoc(mkDoc())` → to'liq qayta yuklash), 1848–1852
- Qanday takrorlash: HTML: `<h1>Top</h1>` + 200 ta `<p>` + `<h2 id=end>`, previewni pastga suring (scrollY 7181), muharrirda bitta belgi qo'shing.
- Kutilgan: bola tahrir qilayotgan joyi ko'rinib turadi · Kuzatilgan: scrollY 7181 → 0 har harfda.
- Dalil: t-preview-4-render.mjs (`scroll before 7181 after edit 0`).
- Izoh: uzun sahifaning pastini yozayotgan bola natijani ko'rish uchun har harfdan keyin qayta suradi.

#### K-P-14 · «▶ Ishga tushirish» HTML/CSS (jonli) rejimida hech narsa qilmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1734 (tugma doim ko'rsatiladi), 1592–1596 (`runNow`: `setDoc(mkDoc())` — jonli rejimda doc allaqachon shu satr → React atributni o'zgartirmaydi → iframe qayta yuklanmaydi)
- Qanday takrorlash: HTML-only dars, `framenavigated` sanang, ▶ bosing.
- Kutilgan: qayta yuklash (masalan `<script>` yoki animatsiyani qaytadan ko'rish) yoki tugma yashirin · Kuzatilgan: navigatsiya = 0, hech qanday vizual javob; «JONLI» nishoni yonida «Ishga tushirish» tugmasi — bola nega ikkalasi kerakligini tushunmaydi.
- Dalil: t-preview-4-render.mjs (`▶ HTML rejimda: navigatsiya = 0`).

#### K-P-15 · JS (qo'lda) rejimda ham «JONLI/LIVE» nishoni ko'rsatiladi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1844–1846 (`stale ? … : <span className="hc-live">jonli`), 990 (`manualRun = showConsole`)
- Qanday takrorlash: JS-fayli bor dars, ▶ bosgandan keyin panel-bar.
- Kutilgan: qo'lda rejimda «jonli» so'zi noto'g'ri (yozganda o'zgarmaydi) · Kuzatilgan: `● JONLI` pulsatsiya bilan; tahrirdan keyin «eskirdi · ▶ bosing» — ikkalasi bir joyda almashib turadi.
- Dalil: `shot-console-throw.png` (JONLI + ▶ tugmasi bir vaqtda), t-preview-3-console.mjs.

#### K-P-16 · `console.clear/table/dir/debug/group` panelga tushmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:787 (`['log','info','warn','error']` ro'yxati)
- Qanday takrorlash: `console.debug("d");console.table([1,2]);console.dir({x:1});console.clear();console.log("after clear")`.
- Kutilgan: clear paneli tozalaydi, boshqalari hech bo'lmasa `log` kabi chiqadi · Kuzatilgan: faqat log/info/warn/error; `console.clear()` hech narsa qilmaydi (`after clear` eskilardan keyin qo'shiladi).
- Dalil: t-preview-2-stability.mjs (`levels` bloki: 5 satr, `after clear` oxirida).

#### K-P-17 · `window.open` spam — bosishda 5 ta yangi tab  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1851 (`allow-popups allow-popups-to-escape-sandbox`)
- Qanday takrorlash: `<button id=b>` + `onclick=()=>{for(i<5)window.open('https://example.com/?'+i)}` → previewda tugmani bosing.
- Kuzatilgan: 5 ta tab (sandbox'dan tashqarida, to'liq huquqli). Foydalanuvchi ishorasi bo'lmasa headless'da ham ochildi (real Chrome popup-bloker to'sishi mumkin).
- Dalil: t-preview-1b.mjs (`window.open x5 in click … popups: 5`).

#### K-P-18 · `meta refresh` / `location.href` previewni tashqi saytga olib ketadi; `history.back()` oldingi tashqi sahifaga qaytaradi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1848–1852 (o'z-navigatsiya sandbox'da ruxsat), K-P-03 bilan bog'liq
- Qanday takrorlash: `<meta http-equiv="refresh" content="0;url=https://example.com/">` yoki `location.href='https://example.com/'`; keyin `<h1>Salom</h1>`; keyin `<script>history.back()</script>`.
- Kuzatilgan: natija oynasida `https://example.com/` (sandbox ichida, `X-Frame-Options` ruxsat bersa) ; keyingi tahrir srcdoc'ni qaytaradi; `history.back()` bola kodidan → oyna yana example.com ga qaytadi (frame tarixi saqlanib qoladi).
- Dalil: t-preview-1b.mjs (`meta refresh … frames: […,'https://example.com/']`), t-preview-1d.mjs (`back: […,'https://example.com/']`).
- Izoh: bola YouTube/o'yin saytini natija oynasida ochishi mumkin (agar sayt iframe'ga ruxsat bersa).

#### K-P-19 · IMG_FALLBACK: JS `src` ni tuzatsa ham quti qoladi, rasm yashirin  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:872–873 (`el.dataset.hcFb='1'; el.style.display='none'` — `load` da qaytarilmaydi)
- Qanday takrorlash: `<img id=i src="a.png" alt="A"><script>setTimeout(()=>{i.src="data:image/gif;base64,R0lGOD…"},200)</script>`.
- Kuzatilgan: rasm yuklandi (`naturalWidth 1`) lekin `display:none`, «rasm topilmadi» qutisi turibdi.
- Dalil: t-preview-4-render.mjs (`keyin src o'zgardi (JS) {"fb":["🖼 / A / rasm topilmadi…"],"imgs":["none true 1x1"]}`).
- Izoh: «rasm galereyasi / slayder» JS-darslarida (src almashadi) birinchi noto'g'ri src rasmni abadiy yashiradi.

#### K-P-20 · HTML-only rejimda `<script>` xatolari va `console.log` umuman ko'rinmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:970 (`showConsole = files.some(f=>f.lang==='js')`), 895 (`CONSOLE_FORWARD` faqat consoleNonce bo'lsa)
- Qanday takrorlash: 1-modul darsi (faqat index.html): `<h1>A</h1><script>console.log("salom"); alert("hi"); foo()</script>`.
- Kuzatilgan: konsol paneli yo'q, xato belgisi yo'q, holat-satri «Shartlarni bajaring…»; bola `<script>` yozgan bo'lsa ham hech qanday fikr-mulohaza yo'q.
- Dalil: t-preview-3b.mjs (oxirgi blok).

#### K-P-21 · Uzun `previewUrl` «…» siz kesiladi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1963 (`.hc-url{display:flex; … text-overflow:ellipsis}` — flex-konteynerdagi matn-tugun anonim flex-element bo'lgani uchun `text-overflow` ishlamaydi), 1838 (matn to'g'ridan-to'g'ri span ichida)
- Qanday takrorlash: `previewUrl: 'https://juda-uzun-manzil-…?ref=…session=…'` (150+ belgi), 1400 px.
- Kuzatilgan: `scrollWidth 1153 / width 501`, matn `…/menyu/k` da qirqilgan, uch nuqta yo'q (`shot-previewurl-long.png`).

#### K-P-22 · Telefon 360×584 (manzil-satri ochiq): natija oynasi 117 px  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:2034 (`.hc-console{height:34%;min-height:96px}`), 2103–2107 (tab rejimi)
- Qanday takrorlash: viewport 360×584, isMobile, JS-fayli bor dars, «Natija» tabi.
- Kuzatilgan: preview 256 px = frame 117 px + konsol 96 px; `<h1>` + `<p>` dan boshqasi ko'rinmaydi. 375×667 da frame 181 px.
- Dalil: `shot-layout-m-360x640-urlbar-natija.png`, t-preview-7b.mjs.

#### K-P-23 · `__hcConsole` — istalgan oyna panelga yoza oladi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1030–1035 (`d.__hcConsole && d.nonce === consoleNonceRef.current`, `e.source` tekshirilmaydi)
- Qanday takrorlash: bola HTML ichidagi `<iframe srcdoc="<script>parent.parent.postMessage({__hcConsole:true,nonce:N,level:'error',text:'…'},'*')</script>">` yoki brauzer-kengaytma. (Nonce'ni taxmin qilish oson — 1..N.)
- Izoh: xavf past (faqat ko'rinish), K-P-11 bilan bir ildiz.

#### K-P-24 · previewCss `!important` bilan bola CSS'ini bloklashi mumkin — qoida yo'q  ·  Og'irlik: 🔵 taklif
- Qayer: HtmlCompiler.jsx:891–893 (tartib to'g'ri: baseStyle → previewCss → bola), 976 (izoh «bola baribir ustidan yoza oladi» — `!important` bilan bu yolg'on bo'ladi)
- Dalil: t-preview-5-previewurl.mjs (`p bg rgb(1,2,3)` previewCss `!important` bola `rgb(9,9,9)` ni yengdi).
- Izoh: dars-mualliflari uchun etalonda «previewCss'da `!important` yo'q» qoidasi yo'q.

#### K-P-25 · `@import` Google Fonts har mount'da (offline/CSP)  ·  Og'irlik: 🔵 taklif
- Qayer: HtmlCompiler.jsx:1920
- Izoh: LMS `Content-Security-Policy` `style-src`/`font-src` cheklasa shrift tushmaydi (fallback system-ui bor — sinmaydi); internetsiz sinfda har ochilishda so'rov ketadi.

#### K-P-26 · StyleTag komponent daraxtida — bir sahifada 2 kompilyator = 2 nusxa `<style>`  ·  Og'irlik: 🔵 kuzatuv
- Qayer: HtmlCompiler.jsx:1661 (`<StyleTag/>` `.hc-root` ichida), 1917
- Kuzatilgan (kod + stend): `<style>` `.hc-root` DIV ichida (head emas); unmount'da o'chadi ✓ (20× sinov: 1→0); ikkita instansiya bo'lsa ikkita bir xil `<style>` (zararsiz, faqat @import 2 marta). Global to'qnashuv yo'q — hamma selektor `.hc-` prefiksli ✓.
- Dalil: t-preview-8-leak.mjs (`style location: hc-root / DIV`, `after final unmount {"styles":0…}`).

#### K-P-27 · Ko'lamdan tashqari kuzatuvlar (boshqa agentga)  ·  Og'irlik: 🔵
- `requirements: []` bo'lsa tepada `0/0` qizil hisoblagich chiqadi (`shot-previewurl-long.png`).
- Deklarativ `{ logs: 5 }` runtime-probe yaratmaydi (yashirin iframe yo'q, chip hech qachon ✓ bo'lmaydi); `checks.logs(5)` funksiya-shakli ishlaydi (t-preview-2d.mjs: `decl chip: ['hc-chip '] iframes: 1` vs `fn chip: ['hc-chip ok'] iframes: 2`). Deklarativ `{tag:'h1', text:true}` → «shart aniqlanmadi».
- 1024×600 da editor-bar'da `style.css`/`app.js` tablari ko'rinmaydi (faqat `index.html`) — `shot-layout-1024x600-short.png`.


---
---

# §D — TIL / MATN / I18N (asl: `dev/hc-stend/hisobot-matn.md`)

## HC kompilyator — MATN va i18n sinov-hisoboti (metodist + o'quvchi-ko'zi)

- Sana: 2026-08-17 · Fayl: `src/compilator/HtmlCompiler.jsx` (2155 satr, TAHRIRLANMAGAN)
- Stend: `dev/hc-stend/` · skriptlar `t-i18n-1-shots.mjs` (skrinshotlar `i18n-*.png`, xom chiqish `t-i18n-1-out.txt`), `t-i18n-2-switch.mjs` (bir instansiyada uz→ru; yordamchi stend-fayllar `entry-i18n.jsx` + `build-i18n.mjs` + `bundle-i18n.js` + `i18n.html`)
- Qonun-manba: `MATN_ETALONI.md` (1–8 bo'lim, lug'at), `MATN_KORPUS.md` (0–9), `til-lint-rules.json` (74 qoida)

### Jadval

| Og'irlik | Soni |
|---|---|
| 🔴 kritik | 3 |
| 🟠 muhim | 8 |
| 🟡 mayda | 13 |
| 🔵 taklif | 6 |
| **Jami** | **30** |

### Nima sinaldi

| # | Sinov | Natija |
|---|---|---|
| 1 | `npm run lint:til src/compilator/HtmlCompiler.jsx` | ✓ o'tdi — «TOZA, 74 qoida, 0 topilma» |
| 2 | Kirill lotin-matnda (`[Ѐ-ӿ]` faqat `ru:` qatorlarida) | ✓ o'tdi |
| 3 | Qiyshiq apostrof (‘ ’ ʻ) | ✓ o'tdi (faqat ASCII `'`) |
| 4 | `uz:`/`ru:` juftlik soni (115/115) — hech qaysi `tr({...})` yarim emas | ✓ o'tdi |
| 5 | Sen-forma / «daftar» / personaj-nom / «sir»-uslub / «chip»/«slot» so'zi o'quvchi-matnda / «chala» / «buzuq» | ✓ o'tdi (yo'q) |
| 6 | 1400 · 1100 · 768 · 480 px, uz+ru: bo'sh holat, xato, «shart bajarildi–sintaksis qoldi», hammasi o'tdi, teg-ro'yxati, atribut-ro'yxati, «Qaytadan» 2 qadam + «Qaytarish», «Chiroyli» eslatmalari, JS-topshiriq (konsol, «eskirdi»), previewUrl, rasm-fallback, sensor-panel (`pointer:coarse`) — 100+ skrinshot | Topilmalar quyida |
| 7 | Bir instansiyada `lang` uz→ru almashuvi (kod tegilmagan) | ✗ 2 joy eski tilda qoladi (K-M-01) |
| 8 | Bo'sh holatda ko'rsatma bormi | ✓ o'tdi — «💡 `<h1>` ichiga sarlavha matnini yozing» darrov chiqadi |
| 9 | Hammasi bajarilganda xabar | ✓ chiqadi («✓ Barcha shartlar bajarildi!») — ohang bo'yicha K-M-19 |
| 10 | Xato QAYERDA ko'rsatiladi | ✓ tepada, bitta qator, bosilsa kursor qatorga tushadi; ammo kesiladi (K-M-02) |
| 11 | Konsol-xatolar/pageerror (har mount) | ✓ 0 |
| 12 | Gorizontal sahifa-overflow (docOverflow) barcha enlarda | ✓ yo'q |
| 13 | Tugma yozuvlari («Продолжить →», «← Назад», «Заново», «Запустить») 480 px gacha kesilmaydi | ✓ o'tdi |

---

### Topilmalar

#### K-M-01 · Til almashganda maslahat va linter-xabari eski tilda qoladi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1042-1053 (`results` useMemo — `[html, css, js, reqs]`), :1059 (`htmlErrors` useMemo — `[lintSrc]`), :915 (`__lang` render-vaqtida o'rnatiladi)
- Matn: ru rejimda ekranda «⚠ Строка 1: `</h2>` mos ochuvchi tegga ega emas (xato yoki typo)» va chip-title «`<p>` ichiga bir-ikki gap yozing», «`<img>` da `src` va `alt` ikkalasini to'ldiring»
- Muammo: `runOne`/`lintHtml` ichidagi `tr()` natijasi memo'da qotib qoladi; `lang` propi o'zgarsa (kod o'zgarmasa) memo qayta hisoblanmaydi — aralash tilli qator (rus so'z + o'zbek gap) chiqadi. Kod bitta belgiga tegilgach to'g'rilanadi. Til-tugmasi bor LMS/darsda o'quvchi buni ko'radi.
- Dalil: `t-i18n-2-switch.mjs` chiqishi — «RU holat (lang almashgach, kod tegilmagan)»: err = `⚠ Строка 1: \`</h2>\` mos ochuvchi tegga ega emas…`, chipTitles uz; «kod tegilgandan keyin» — ru. Skrinshot `i18n-switch-ru.png`.

#### K-M-02 · Xato-xabari 1400px da ham kesiladi, «+N» hisoblagich yo'qoladi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1947 (`.hc-err … max-width:76ch; white-space:nowrap; text-overflow:ellipsis`), :1684-1687 (`+{n}` badge xabar ichida)
- Matn: «⚠ Строка 1: У `</h2>` нет парного открывающего тега (ошибка или опечат…» (ru, 1400px), «⚠ Qator 1: `</h2>` mos ochuvchi tegga ega emas (xato yo…» (uz, 480px)
- Muammo: ruscha linter-xabarlari o'zbekchadan uzunroq (kirill + monoshrift) — desktopda ham oxiri kesiladi va xabar ichidagi «+1» (yana xato bor) belgisi umuman ko'rinmay qoladi: o'quvchi ikkinchi xato borligini bilmaydi. Tooltip yo'q (button title — «Bosing — kursor…»), ya'ni to'liq matnni o'qishning yo'li yo'q. 768/480 px da uz ham kesiladi.
- Dalil: `t-i18n-1-out.txt` `cut:` qatorlari — ru 1400: sw=621 cw=568; ru 1100: sw=621 cw=568; uz 480: sw=546 cw=454. Skrinshotlar `i18n-ru-1400-2-error.png` (uz nusxasida «+1» ko'rinadi, ru nusxasida yo'q), `i18n-uz-480-2-error.png`.

#### K-M-03 · «Rasm topilmadi» qutisi ru rejimda o'zbekcha  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:879-880 (`IMG_FALLBACK` — literal `'rasm topilmadi — <code>src</code> manzilini tekshiring'`, `'alt matni yozilmagan'`), :886 (`<html lang="uz">`)
- Matn: «rasm topilmadi — src manzilini tekshiring» / «alt matni yozilmagan» — `tr()` dan o'tmagan yagona ko'rinadigan o'quvchi-matn
- Muammo: i18n to'liq emas — ru o'quvchi natija-oynasida o'zbekcha izoh ko'radi (bu qat'iy o'quvchi-matn: aynan `alt` nima uchun kerakligini o'rgatuvchi quti). Preview-hujjatning `lang` atributi ham doim `uz`.
- Dalil: `t-i18n-1-out.txt`: «ru · img-fallback iframe matni: “…mushukrasm topilmadi — src manzilini tekshiring” · lang attr: uz». Skrinshot `i18n-ru-1400-2-error.png` (o'ng panel).

#### K-M-04 · Backtick belgisi ekranda ko'rinib turadi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1691 (`💡 {firstHint}` — tekis matn), :1686 (`{shownErrors[0].msg}`), :1671 (chip `title`), hamma `checks.*`/`lintHtml`/`DEFAULT_TASK` maslahatlari (masalan :531-533, :362-415, :660-717)
- Matn: «💡 Напишите текст заголовка внутри `<h1>`», «💡 `button` uchun `color` xossasini yozing», «⚠ Qator 4: `<b>` ochiq qoldi — `</b>` bilan yoping»
- Muammo: MATN_ETALONI 4-bo'lim «Kod atamalari prozada ajralib tursin — `.mono`/`.qcode` bilan; test-izohlarda fmtCode+backtick». Bu yerda backtick xom holda chiqadi — 13 yoshli bola «`» belgisini kodning qismi deb o'ylashi mumkin (`<h1>` ni «`<h1>`» deb yozib ko'radi). Formatlash yo'q.
- Dalil: skrinshotlar `i18n-ru-1400-10-js-task.png` (maslahat qatori), `i18n-ru-1400-5-menu.png` (💡 qatori), `i18n-uz-1400-2-error.png` (xato qatori).

#### K-M-05 · «xatboshi» — lug'atda taqiqlangan so'z  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:303 (`TAG_MENU` p)
- Matn: «matn xatboshisi»
- Muammo: MATN_ETALONI 3-bo'lim lug'ati, birinchi qator: «xatboshi → matn (paragraf) — bola bilmaydigan eski atama». Shu faylning o'zida `DEFAULT_TASK` «<p> — matn (paragraf)» deydi — bir tushuncha ikki nom (1-bo'lim «Bir tushuncha — bir nom»).
- Dalil: `t-i18n-1-out.txt` menu: `"<p>matn xatboshisi"`; skrinshot `i18n-uz-1400-5-menu.png`.

#### K-M-06 · «xossa» ↔ CSS darslarida «xususiyat»  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:402 (`cssProp` hint), :410 (`cssValue`) — 6 o'rin
- Matn: «`button` uchun `color` xossasini yozing»
- Muammo: CssLesson1/2, CssPractice, PracticeLesson2-4 o'quvchiga CSS property'ni «xususiyat (property)» deb o'rgatadi (CssLesson1.jsx:623, 627); kompilyator esa «xossa» deydi — atama izchilligi buzilgan (MATN_ETALONI 1-bo'lim «Bir tushuncha — bir nom», 4-bo'lim «Matn ↔ ko'rgazma mos»). Bola darsda o'rganmagan so'zni maslahatda ko'radi.
- Dalil: `t-i18n-1-out.txt` (uz-1400 · js-task boshi) chipTitles[1]; `grep -rl xususiyat src` → CssLesson1/2, CssPractice va boshqalar.

#### K-M-07 · «sintaksis» izohsiz — lug'at bandi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1576 («Avval sintaksis xatosini tuzating»), :1651 («Shartlar bajarildi — sintaksis xatosi qoldi (yuqorida)»), :1906 («Sintaksis xatosi tuzatilsa ochiladi»)
- Matn: yuqoridagi 3 qator
- Muammo: MATN_ETALONI lug'ati: «sintaksis (izohsiz) → yozilish qoidasi / shakl — metafora bilan kiritiladi». Kompilyator umumiy modul — 1-Modul boshidagi bola bu so'zni birinchi marta shu yerda ko'rishi mumkin, izoh yo'q.
- Dalil: skrinshot `i18n-uz-1400-2-error.png` (pastki holat-satri), `i18n-uz-1400-9b-pretty-syntax.png`.

#### K-M-08 · «typo» — o'zbek gapda inglizcha so'z, «ega emas» — kalka  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:689
- Matn: «`</h2>` mos ochuvchi tegga ega emas (xato yoki typo)»
- Muammo: MATN_ETALONI 1-bo'lim (jargon yo'q, ingliz so'zi izohsiz); «ega emas» — kantselyarit-kalka (rus «не имеет»); ru varianti «нет парного…» tabiiy, uz varianti esa hujjat-tili. Ekranda eng ko'p chiqadigan linter-xabarlaridan biri (yopish-typo — bolalarning eng ko'p xatosi).
- Dalil: skrinshot `i18n-uz-1400-2-error.png`; `t-i18n-1-out.txt` err.

#### K-M-09 · Standart maslahatlar harakat-ko'rsatma emas, ichki-jargon oqib chiqadi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:362, 367, 374, 384 («`h1` topilmadi» oilasi), :415 («Skriptda kerakli qism topilmadi»), :1071 («natija kutilgancha emas»), :480 («shart aniqlanmadi»), :757 («tekshirishda xatolik»)
- Matn: «`img` topilmadi», «`a` topilmadi», «Skriptda kerakli qism topilmadi», «natija kutilgancha emas», «shart aniqlanmadi», ru: «условие не распознано», «результат не такой, как ожидалось»
- Muammo: 13 yoshli o'quvchi uchun maslahat = «nima qilay?» javobi bo'lishi kerak (MATN_ETALONI 7-B.1 TOPSHIRIQ — buyruq; KORPUS 8 «tuzoq-izoh oxiri HARAKATGA chaqiradi»). «topilmadi/kutilgancha emas/aniqlanmadi» — hech qanday harakat aytmaydi; «shart aniqlanmadi», «tekshirishda xatolik», «условие не распознано» — dasturchi-tili, o'quvchiga tegishli emas. «skript» — izohsiz atama. `DEFAULT_TASK` da hint'lar yaxshi (harakat: «…yozing/to'ldiring»), lekin deklarativ shart bergan darslar aynan shu standartlarga qoladi.
- Dalil: `t-i18n-1-out.txt` (uz-1400 · js-task boshi) chipTitles: `"\`img\` topilmadi","\`a\` topilmadi","natija kutilgancha emas"…,"shart aniqlanmadi"`; skrinshot `i18n-uz-1400-10-js-task.png`.

#### K-M-10 · Standart maslahatda teg `h1` ko'rinishida, yorliqda `<h1>` ko'rinishida  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:362-410 (`\`${sel}\``) ↔ :493-498 (`buildLabel` `<${sel}>`), :531-533 (`DEFAULT_TASK` «`<h1>`»)
- Matn: chip «<img> — src, alt», maslahati «`img` topilmadi»; chip «<li> внутри <ul>», maslahati «поместите `li` внутрь `ul`»
- Muammo: bir shart ikki xil ko'rinishda ataladi — o'quvchi «img» so'zini tegdan (`<img>`) farqlamaydi, ayniqsa «`li` ni `ul` ichiga joylang» ko'rinishida (MATN_ETALONI 1-bo'lim «bir tushuncha — bir nom»; 4-bo'lim «matn ↔ ko'rgazma mos»). Selektor `.card`/`#btn` bo'lganda qavs bo'lmasligi to'g'ri — lekin oddiy teg-nomida farq ko'zga tashlanadi.
- Dalil: `t-i18n-1-out.txt` (uz/ru-1400 · js-task boshi) chips ↔ chipTitles.

#### K-M-11 · Ru rejimda «LIVE», uz rejimda «JONLI» — tarjima siyosati bir xil emas  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1846 (`tr({ uz: 'jonli', ru: 'live' })`), :1857 («🖥️ Console» — ikkala tilda inglizcha), :1850/1885 (iframe `title="natija"`, `"tekshiruv"` — faqat uz)
- Matn: uz «JONLI» / ru «LIVE»; «🖥️ Console» (uz-da ham); iframe title «natija»
- Muammo: bir nishonda uz tarjima qilingan, ru inglizcha qoldirilgan; konsol sarlavhasi ikkala tilda inglizcha, holbuki chip-yorliq «konsolda «5»» / «в консоли» deydi (bir tushuncha — bir nom: «Console» ↔ «konsol»). Iframe title (skrinrider uchun) faqat o'zbekcha.
- Dalil: `t-i18n-1-out.txt` live: `["live"]` (ru), `["jonli"]` (uz); consoleTitle `["🖥️ Console"]`; iframeTitle `["natija","tekshiruv"]` (ru rejimda ham).

#### K-M-12 · «Orqaga» ikki ma'noda: navigatsiya-tugma va undo-tugma  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1892 («← Orqaga»), :1726 (undo `title`/`aria-label` «Orqaga qaytarish»)
- Matn: «← Orqaga» (oldingi ekranga) va «↶ Orqaga qaytarish (Ctrl+Z)» (kod tahririni bekor qilish)
- Muammo: MATN_ETALONI 6-bo'lim «matn ↔ UI mosligi» — dars-matni «Orqaga tugmasini bosing» desa, o'quvchi ikkita «Orqaga»dan qaysi birini bosishini bilmaydi. Ru'da ham «Вернуть» uch vazifada: redo (`Вернуть (Ctrl+Y)`), «Qaytarish» (`↶ Вернуть`), reset-title («Вернуть код к начальному виду»).
- Dalil: `t-i18n-1-out.txt` tools/ghost/status qatorlari (uz-1400 · reset-done: status «Kod tozalandi. ↶ Qaytarish», tools «↷|Qaytarilganni tiklash|Tiklash»).

#### K-M-13 · Sarlavha-brief'da qo'shtirnoq turi boshqa (“ ” ↔ « »)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:527
- Matn: «Hammasi yashil bo'lsa — “Davom etish” ochiladi.» (uz) ↔ shu faylning boshqa uz-satrlari «Natija», «5» (:486, :488, :1654) va ru «Продолжить»
- Muammo: MATN_ETALONI 5-bo'lim yozuv-tozaligi (bir xil belgi); faylda faqat shu joyda “ ” ishlatilgan.
- Dalil: `grep -an '“' src/compilator/HtmlCompiler.jsx` → faqat 527-satr; skrinshot `i18n-uz-1400-1-empty.png`.

#### K-M-14 · «Chiroyli» — tugma sifat, harakat-oti emas; «chekintiradi» izohsiz  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1731
- Matn: «✨ Chiroyli» (title: «Kodni chiroyli chekintiradi»)
- Muammo: MATN_ETALONI 6-bo'lim «Tugma = neytral harakat oti» («Yaratish», «Tozalash»); «Chiroyli» nima qilishini aytmaydi (720px dan tor ekranda faqat «✨» qoladi, title esa sensor qurilmada ochilmaydi). «chekintiradi» — bola bilmaydigan fe'l (izohsiz). Ru «Красиво» ham xuddi shu tur.
- Dalil: skrinshot `i18n-ru-480-1-empty.png` (faqat ✨), `t-i18n-1-out.txt` tools.

#### K-M-15 · Ru «подвал страницы» — dasturchi-slengi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:312 (`TAG_MENU` footer), :309 (header «шапка страницы»)
- Matn: «подвал страницы»
- Muammo: 13 yoshli rus tilli bola «подвал» = yerto'la; sahifa «pasti» ma'nosi frontend-slengidan. Uz varianti «sahifa pasti» — sodda; ru varianti undan qiyinroq (ikki til bir darajada bo'lishi kerak).
- Dalil: `t-i18n-1-out.txt` menu (ru-1400 · menu).

#### K-M-16 · «xira maslahat» (placeholder ta'rifi) — o'quvchi uchun mavhum  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:323 (`ATTR_MENU` input placeholder)
- Matn: «xira maslahat» (ru: «подсказка»)
- Muammo: «xira» + «maslahat» — placeholder nimaligini aytmaydi (o'quvchi hali `input` ni ko'rmagan); MATN_ETALONI 4-bo'lim «har atama izohlanadi»; ru varianti «подсказка» ham «maydondagi kulrang namuna» ma'nosini bermaydi.
- Dalil: kod-o'qish (menyu faqat `<input ` yozilganda chiqadi).

#### K-M-17 · «`<! ... >` yopilmagan» — bola tushunmaydigan xabar  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:660
- Matn: «`<! ... >` yopilmagan» / «`<! ... >` не закрыт»
- Muammo: `<!doctype` yoki chala izoh yozilganda chiqadi; «<! ... >» belgilar to'plami o'quvchiga hech narsa demaydi, harakat yo'q (MATN_ETALONI 7-B.1).
- Dalil: kod-o'qish (linter shoxi); atEnd bo'lgani uchun faqat kursor boshqa joyga o'tsa ko'rinadi.

#### K-M-18 · «`<h1>` ichida tirnoq (") yopilmagan» — qavs ichidagi belgi o'qishni buzadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:713
- Matn: «`<img>` ichida tirnoq (") yopilmagan»
- Muammo: `(")` — qavs ichida yolg'iz tirnoq; monoshriftda «(") yopilmagan» bola uchun tirnoq-qavs chalkashligi. Boshqa xabarlarda belgi backtick ichida (`>`), bu yerda qavsda — bir xil emas.
- Dalil: kod-o'qish (:713, ru «Кавычка (") внутри …»).

#### K-M-19 · Yakuniy xabar quruq: «Barcha shartlar bajarildi!»  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1648
- Matn: «✓ Barcha shartlar bajarildi!» / «Все условия выполнены!»
- Muammo: MATN_ETALONI 7-bo'lim «Muvaffaqiyat xabari — samimiy, aniq ("Zo'r! Sahifangizga rasm qo'shdingiz." — quruq "Bajarildi" emas)»; KORPUS 0.7 «g'alaba bayram». Bu — kompilyatorning yagona g'alaba-nuqtasi.
- Dalil: skrinshot `i18n-uz-1100-4-pass.png`.

#### K-M-20 · Ru «остался синтаксис (см. выше)» — grammatik chala ibora  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1651
- Matn: «Условия выполнены — остался синтаксис (см. выше)»
- Muammo: «остался синтаксис» rus tilida ma'nosiz (sintaksis qolmaydi, xato qoladi); mashina-tarjimaga o'xshaydi. «(см. выше)» qisqartma ham 13 yoshli o'quvchi uchun hujjat-tili.
- Dalil: skrinshot `i18n-ru-1400-2-error.png` (pastki holat-satri).

#### K-M-21 · «ishga tushirilmoqda…» maslahat sifatida  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:741, :1070
- Matn: «ishga tushirilmoqda…» / «запускается…»
- Muammo: runtime-shart tekshirilguncha chip-tooltip va 💡 qatorida shu chiqadi — o'quvchi «nima qilay?» deb ochsa, hech narsa demaydi; majhul nisbat («tushirilmoqda») kantselyarit-ohang.
- Dalil: kod-o'qish; JS-topshiriq stendida (`i18n-*-10-js-task.png`) 300 ms dan keyin «natija kutilgancha emas»ga almashadi.

#### K-M-22 · Deklarativ yorliqlar belgi-formula shaklida  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:487 («`${s.a} ⇄ ${s.b}`»), :489 («`${s.eval} = ${s.equals}`»), :485 («CSS: sel { prop }»), :490 («JS namunasi»/«фрагмент JS»)
- Matn: chip «on ⇄ off», «typeof f = function», «JS namunasi», «CSS: button { color }»
- Muammo: MATN_ETALONI 43a («belgi-formula o'quvchi-matnda taqiq — to'liq gap bilan», `til-lint` `belgi-formula` qoidasi ≠ uchun); «⇄» va «typeof f = function» o'quvchi uchun o'qib bo'lmaydi; «JS namunasi» — nima yozish kerakligini aytmaydi. Bu yorliqlar dars `label` bermaganda chiqadi.
- Dalil: skrinshot `i18n-ru-1400-10-js-task.png` chips 3, 6, 7.

#### K-M-23 · Sensor qurilmada fayl-tab nomi kesiladi («index.»)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1973 (`.hc-tab` — `white-space:nowrap`, ota-`.hc-tabs` overflow), :2138 (`pointer:coarse` da tab kattalashadi)
- Matn: «index.html» → «index.»
- Muammo: 820px + `pointer:coarse` (planshet) da nom kesiladi — bola qaysi faylda ekanini o'qiy olmaydi. Matn emas, lekin ko'rinish-matn muvofiqligi.
- Dalil: skrinshot `i18n-ru-14-touch.png`, `i18n-uz-14-touch.png` (chap yuqori).

#### K-M-24 · 14 shartli topshiriqda kompilyator ekranga sig'maydi (1400×900)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1938 (`.hc-checklist` flex-wrap), :1927 (`.hc-root height:100dvh; overflow:hidden`)
- Matn: —
- Muammo: chiplar 2 qatorga o'ralganda `.hc-root` scrollHeight 918 > clientHeight 900 — pastki 18px kesiladi, overflow:hidden bo'lgani uchun surib bo'lmaydi. Ko'p shartli darslarda ru yorliqlar uzunroq — tezroq o'raladi.
- Dalil: `t-i18n-1-out.txt` (uz/ru-1400 · js-task) rootOverflow `{"sh":918,"ch":900}`; skrinshot `i18n-ru-1400-10-js-task.png`.

#### K-M-25 · Boshlang'ich izoh (starter) til almashganda eski tilda qoladi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:934 (`useState(() => … tr(f.starter))`), :520 (`DEFAULT_FILES` starter)
- Matn: «<!-- Bu yerga yozing -->» ru rejimga o'tganda ham muharrirda turadi (faqat «Qaytadan» dan keyin «<!-- Пишите здесь -->»)
- Muammo: starter — o'quvchi kodi hisoblanadi, shuning uchun almashtirmaslik ataylab bo'lishi mumkin; lekin bola hali hech narsa yozmagan bo'lsa, o'zbekcha izoh ru ekranida turadi.
- Dalil: `t-i18n-2-switch.mjs` («Qaytadan» dan keyin starter ru bo'ldi; undan oldin kod o'zgarmagan).

#### K-M-26 · Chip-maslahati faqat sichqoncha-hover'da (title) — sensor qurilmada 2-,3-shart maslahati o'qilmaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1671 (`title={merged[i]?.hint}`), :1691 (faqat `firstHint`)
- Matn: —
- Muammo: 💡 qatorida faqat BIRINCHI bajarilmagan shart maslahati; qolganlari `title` da — planshetda ochilmaydi. O'quvchi 2-shartga o'tganida ko'rsatma yo'q (agar 1-si hali bajarilmagan bo'lsa).
- Dalil: `i18n-*-14-touch.png` (touch), `t-i18n-1-out.txt` hint (faqat 1 ta).

#### K-M-27 · Xato-xabari to'liq monoshriftda (kirill proza ham)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1947 (`.hc-err font-family:'JetBrains Mono'`)
- Matn: «⚠ Строка 1: У `</h2>` нет парного открывающего тега…»
- Muammo: butun xabar (kirill proza ham) monoshriftda — o'qish sekin, uzunlik ~30% ortadi (K-M-02 kesilishiga hissa qo'shadi). Kod-bo'lak mono, gap oddiy shrift bo'lsa muvofiqroq (MATN_ETALONI 4: kod atamasi ajralib tursin, proza emas).
- Dalil: skrinshot `i18n-ru-1400-2-error.png`.

#### K-M-28 · Rasm-fallback ikonkasi monoxrom/tofu ko'rinishi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:877 (`🖼` — «rasm ramkasi» emoji)
- Matn: —
- Muammo: skrinshotda belgi rangli emoji emas, ramkali qora-oq glif ko'rinishida — bola «buzuq belgi» deb o'qishi mumkin, holbuki quti aynan «buzuq emas» tuyg'usi uchun qo'yilgan. Headless-shrift muhitiga bog'liq bo'lishi mumkin — real qurilmada tekshirish kerak.
- Dalil: skrinshot `i18n-uz-1100-4-pass.png` (o'ng panel).

#### K-M-29 · «Ichkariga surish» (⇥ sensor tugmasi) va «A−/A+» — faqat title, sensor qurilmada o'qilmaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1799, :1808-1813
- Matn: «Ichkariga surish» (ru «Отступ»), «A−» / «A+»
- Muammo: sensor-panel tugmasi `title` faqat hover'da; ekranda «⇥» — bola bu belgini bilmaydi. Uz «Ichkariga surish» (harakat) ↔ ru «Отступ» (ot) — bir tushuncha ikki grammatik shakl. Kichik.
- Dalil: skrinshot `i18n-uz-14-touch.png` (pastki qator, o'ng chekka).

#### K-M-30 · «Kod allaqachon chiroyli 👍» — «chiroyli» so'zi kodni baholaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1577
- Matn: «Kod allaqachon chiroyli 👍» / «Код уже аккуратный 👍»
- Muammo: ru «аккуратный» (tartibli) aniq; uz «chiroyli» — estetik baho, «chekinish to'g'ri» ma'nosini bermaydi; «Chiroyli» tugmasi bilan birga bir atama-oilasi (K-M-14).
- Dalil: skrinshot `i18n-uz-1400-9-pretty-note.png`.

---

### Qo'shimcha kuzatuvlar (topilma emas — ✓ o'tdi)
- Siz-forma: hamma buyruqlar «-ing» shaklida («yozing», «to'ldiring», «bosing», «yoping»); sen-forma yo'q.
- Ru asosiy tugma/holat matnlari tabiiy: «Выполняйте условия — результат виден справа», «Весь код сотрётся — нажмите кнопку ещё раз», «Тяните — изменится ширина панелей», «Код очищен. ↶ Вернуть».
- 768/480 px da tugmalar («Продолжить →», «← Назад», «Заново») kesilmaydi (`cut` ro'yxatida faqat `.hc-err`).
- Taklif-ro'yxati tavsiflari (`.hc-menu-d`) 246px kenglikka sig'adi (ellipsis ishga tushmadi).
- «Qaytadan» ikki bosqichi va «Qaytarish» ikkala tilda to'liq tarjima qilingan.
- Bo'sh holatda ko'rsatma bor (💡), xato bosilsa kursor qatorga tushadi, `+N` mantiqi bor (ko'rinishi K-M-02).


---
---

# §E — KONTRAKT / HOLAT-SAQLOV / DARSLAR (asl: `dev/hc-stend/hisobot-kontrakt.md`)

## HC-KONTRAKT SINOVI — hisobot (arxitektor-ko'zi)

- Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (2155 satr, TAHRIRLANMADI) · Tashqi modul: `lms/html-compiler.jsx` (nashr 2026-08-13)
- Stend: `dev/hc-stend/contract.html` + `bundle-contract.js` (`entry-contract.jsx` — createRoot/StrictMode/ikki-root/qayta-render qobig'i, `build-contract.mjs`)
- Skriptlar: `t-contract-lib.mjs`, `t-contract-1-props.mjs`, `t-contract-1b-inline.mjs`, `t-contract-2-storage.mjs`, `t-contract-2b.mjs`, `t-contract-3-lang.mjs`, `t-contract-3b.mjs`, `t-contract-3c.mjs`, `t-contract-3d.mjs`, `t-contract-4-errors.mjs`, `t-contract-4b-spoof.mjs`, `t-contract-4c-dupid.mjs` — hammasi qayta ishga tushirilib tasdiqlangan (har topilma 2 marta).

### Jadval

| Og'irlik | Soni |
|---|---|
| 🔴 kritik | 0 |
| 🟠 muhim | 8 |
| 🟡 mayda | 9 |
| 🔵 taklif | 10 |
| **Jami** | **27** |

### Nima sinaldi

**Kontrakt (proplar)**
- ✓ o'tdi — `task` yo'q → DEFAULT_TASK (3 shart, index.html, uz-starter, uz-placeholder)
- ✓ o'tdi — `task` string bo'lsa (`'x'`) → yiqilmaydi (0/0)
- ✓ o'tdi — `lang='ru'` → barcha UI-matn/placeholder/hint ru; `lang` yo'q → uz
- ✓ o'tdi — `starterCode` `{uz,ru}` obyekt bo'lsa ham `tr()` orqali to'g'ri (hujjatda faqat string deyilgan)
- ✓ o'tdi — `onContinue` yo'q → tugma bosilsa jim (xato yo'q); `onContinue` payload `{codes:{...}, code:html}` to'g'ri
- ✓ o'tdi — `onBack` yo'q → «Orqaga» ko'rinmaydi
- ✓ o'tdi — eyebrow/title/brief: JSX · `{uz,ru}` · string · qisman `{uz}` · yo'q · raqam — yiqilmaydi
- ✓ o'tdi — `previewUrl` `{uz,ru}` → tr bilan; label yo'q → faqat raqam; id yo'q → `r0,r1`
- ✓ o'tdi — `files[0].lang` yo'q → `html` deb olinadi; `files` obyekt (massiv emas) → DEFAULT_FILES
- ✓ o'tdi — runtime-shart (`C.logs`) faqat HTML fayl bo'lganda ham ishlaydi (inline `<script>`)
- ✗ K-K-01, 02, 03, 04, 05, 06, 07 (quyida)

**Holat-saqlov**
- ✓ o'tdi — storageKey bilan yoz → unmount → mount: kod tiklanadi (`{codes, savedAt}`)
- ✓ o'tdi — fayl-to'plami o'zgarsa (nom/soni) saqlov tashlanadi; tartib boshqa, nomlar bir xil → tiklanadi
- ✓ o'tdi — buzuq JSON / massiv / `null` qiymat → starter'ga tushadi
- ✓ o'tdi — `localStorage.setItem` QuotaExceeded tashlasa → xato yo'q, kod muharrirda qoladi
- ✓ o'tdi — `window.localStorage` getter SecurityError tashlasa (Safari private) → xato yo'q
- ✓ o'tdi — 3 MB kod → saqlanadi
- ✓ o'tdi — «Qaytadan» 2-bosishdan 400 ms keyin saqlovga STARTER yoziladi; 8 s «Qaytarish» faqat xotirada (nusxa `snapRef`)
- ✓ o'tdi — storageKey yo'q → kod saqlanmaydi (faqat `hcFont`/`hcSplit`)
- ✓ o'tdi — darslardagi storageKey'lar takrorlanmaydi (`ccCode:<lessonId>:s<N>|hw`, `pm-m*-*:code` — hammasi noyob)
- ✓ o'tdi — StrictMode: effektlar 2 marta bo'lsa ham konsol-satr ikkilanmaydi, saqlov to'g'ri, xato yo'q
- ✗ K-K-08, 09, 10, 11, 12, 13, 14, 15

**Darslar-integratsiya**
- ✓ o'tdi — 22 dars-faylda `<HtmlCompiler` 39 chaqiriq — HAMMASIDA `lang` propi bor (ruscha darsda o'zbek kompilyator chiqmaydi)
- ✓ o'tdi — ishlatilgan 14 builder (`C.text/js/logs/cssProp/evalEquals/has/attr/cssValue/custom/nested/count/domAfterClick/attrs/toggle`) hammasi `checks`da bor
- ✓ o'tdi — darslarda `task` obyektlari modul-darajali konstanta (har renderda yangi emas); requirement-id'lar bir task ichida takrorlanmaydi
- ✓ o'tdi — deklarativ (data) shart-uslubi va `re:` eski uslub darslarda UMUMAN ishlatilmaydi (aralash joy yo'q)
- ✗ K-K-16, 17, 18

**Modul-global til / ikki nusxa**
- ✓ o'tdi — bir sahifada A(uz)+B(ru): render-vaqtidagi barcha `tr()` (sarlavha, chip, status, linter) o'z tilida
- ✗ K-K-19, 20, 21

**Tashqi-modul (LMS)**
- ✓ o'tdi — `lms/html-compiler.jsx`: yagona `import ... from "react"`, JSX yo'q (34 `React.createElement`), `process.env`/`import.meta`/`require` yo'q, `HC_NASHR='2026-08-13'` bor
- ✓ o'tdi — Node'da (`window`siz) modul import bo'ladi — top-level DOM chaqirig'i yo'q; `useMedia` guard'li
- ✓ o'tdi — modul manba bilan AYNAN (qayta yig'ib diff: 95 524 bayt = 95 524 bayt, farq yo'q)
- ✓ o'tdi — o'lik top-level identifikator yo'q (`DEFAULT_FILES` 2 marta — ishlatiladi); `HC_T`/`HC_CODE` kalitlari ishlatiladi (`HC_CODE.gutter`dan tashqari)
- ✗ K-K-22, 23, 24

**Xatoga chidamlilik**
- ✓ o'tdi — `check` throw qilsa → butun kompilyator qulamaydi (`runOne` try/catch → «tekshirishda xatolik»)
- ✓ o'tdi — runtime kod (`throw`) → «natija kutilgancha emas», qulash yo'q
- ✓ o'tdi — `check` string bo'lsa → «shart aniqlanmadi»; starter funksiya/raqam → `''`/yiqilmaydi; `starterCode` raqam → yiqilmaydi; `previewCss` raqam → yiqilmaydi
- ✗ K-K-25, 26, 27

### Darslar-audit jadvali

| Dars | lessonId / KODING_KEY | storageKey (demo / praktika) | lang | ru? | previewUrl/Css | rejim | builderlar | onPractice-yo'li |
|---|---|---|---|---|---|---|---|---|
| CssLesson1 | css-01-v17 | — / practice.codeKey | `__lang` | ✓ | —/— | files | cssProp, cssValue | ✓ |
| CssLesson2 | css-02-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | cssValue, cssProp | ✓ |
| CssPractice | css-practice-portfolio-v3 | — / practice.codeKey | `__lang` | ✓ | —/— | files | cssProp, cssValue | ✓ |
| Htmllesson1 | html-01-v17 | — / practice.codeKey | `__lang` | ✓ | —/— | starterCode | text, attr, count | ✓ |
| Htmllesson2 | html-02-v16 | — / practice.codeKey | `__lang` | ✓ | —/— | starterCode | attr, has, nested, text, attrs | ✓ |
| HtmlPractice | html-practice-portfolio-v2 | — / practice.codeKey | `uiLang` / `lang` | ✓ | —/— | starterCode | text, has, count, attr | ✓ |
| HtmlTakrorlashLesson | html-takrorlash-01-05-v2 | — / practice.codeKey | `__lang` | ✓ | —/— | starterCode | text, nested, count, attr, attrs | ✓ |
| VsCodeLesson | vscode-start-01-v1 | — / practice.codeKey | `__lang` | ✓ | —/— | files | has, nested, custom, cssProp | ✓ |
| PmLesson1 | pm-m1d2-koding | `${KODING_KEY}:code` | `__lang` | ✓ | ✓/✓ | starterCode | custom | — |
| PmLesson2 | pm-m1d6-koding | `${KODING_KEY}:code` | `__lang` | ✓ | ✓/✓ | starterCode | custom | — |
| PmLesson3 | pm-m1d14-koding | `${KODING_KEY}:code` | `__lang` | ✓ | ✓/✓ | starterCode | custom | — |
| PmLesson4 | pm-m2d2-koding | `${KODING_KEY}:code` | `__lang` | ✓ | ✓/✓ | starterCode | custom | — |
| JsConditionsLesson | js-cond-01-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | js, logs | ✓ |
| JsFunctionsLesson | js-functions-01-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | js, logs | ✓ |
| JsLoopsLesson | js-loops-01-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | js, logs | ✓ |
| JsVarsLesson | js-vars-01-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | js, logs | ✓ |
| PeanStackLesson | pean-stack-01-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | js, logs | ✓ |
| PracticeLesson1 | practice-01-jonlantirish-v18 | — / practice.codeKey | `__lang` | ✓ | —/— | files | has, domAfterClick, toggle, js | ✓ |
| PmLesson9 | pm-m3d10-code | `${KODING_KEY}:code` | `"uz"` qattiq | uz-only | —/— | files (+starterCode o'lik) | evalEquals | — |
| PmLesson11 | pm-m4d2-code | `${KODING_KEY}:code` | `"uz"` qattiq | uz-only | —/— | files (+starterCode o'lik) | evalEquals, custom | — |
| PmLesson13 | pm-m4d12-code | `${KODING_KEY}:code` | `"uz"` qattiq | uz-only | —/— | files (+starterCode o'lik) | evalEquals | — |
| PmLesson15 | pm-m4a2-code | `${KODING_KEY}:code` | `"uz"` qattiq | uz-only | —/— | files (+starterCode o'lik) | evalEquals | — |

«—» storageKey = `MentorPracticeOverlay` demo-rejimi (mentor doskada yechadi — saqlov ataylab yo'q; watch↔demo almashsa mentor kodi yo'qoladi, mayda).

---

### TOPILMALAR

#### K-K-01 · `requirements` bo'sh/yo'q → «Davom etish» hech qachon ochilmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1078 (`allPassed = reqs.length > 0 && …`), :1698–1705 (status), :1898–1905 (tugma title)
- Qanday takrorlash: `mountHC({task:{title:'B', requirements:[]}})` yoki `{title:'C'}` (requirements yo'q)
- Kutilgan: shartsiz topshiriq (erkin mashq / mentor-demo) — tugma yo ochiq, yo aniq sabab · Kuzatilgan: `0/0`, tugma `disabled`, status «Shartlarni bajaring — natija o'ngda ko'rinadi», title «Barcha shartlar bajarilsa ochiladi» — bajaradigan shart yo'q, boshi berk ko'cha
- Dalil: t-contract-1-props.mjs → `B reqs=[]: 0/0 nextDisabled= true …`, `C no reqs: 0/0 nextDisabled= true`
- Izoh: kontrakt-izohda (satr 11) requirements ixtiyoriymi-majburiymi aytilmagan.

#### K-K-02 · Takror fayl nomlari → React key-xato, ikkala tab «active», birinchi fayl yo'qoladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:930 (`Object.fromEntries(files.map…)` — nom bo'yicha kalit), :1713–1721 (`key={f.name}`)
- Qanday takrorlash: `files:[{name:'a.html',lang:'html',starter:'ONE'},{name:'a.html',lang:'css',starter:'TWO'}]`
- Kutilgan: kontrakt-darajasida ogohlantirish yoki noyoblashtirish · Kuzatilgan: konsolda `Encountered two children with the same key`, tabs `['a.html','a.html']`, ikkala tab `.active` (2 ta), kod = `TWO` (ONE yo'q), tab bosilsa o'zgarmaydi
- Dalil: t-contract-1-props.mjs → `E dup names …`, `E after click tab2: code="TWO" active=2`
- Izoh: fayl nomi = ichki identifikator; hujjatda «nomlar noyob bo'lsin» sharti yozilmagan.

#### K-K-03 · `lang` noto'g'ri qiymat (`'en'`, `'RU'`) jimgina `uz`ga tushadi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:914 (`__lang = (lang === 'ru' ? 'ru' : 'uz')`)
- Qanday takrorlash: `mountHC({lang:'en'})`, `mountHC({lang:'RU'})`
- Kutilgan: LMS noto'g'ri kod bersa — hech bo'lmasa konsol-ogohlantirish · Kuzatilgan: jim uz (`'RU'` katta harf ham uz)
- Dalil: t-contract-1-props.mjs → `F lang=en: O'z sahifangizni quring`, `F lang=RU: O'z sahifangizni quring`

#### K-K-04 · `starterCode` + `task.files` birga → `starterCode` jim e'tiborsiz; 4 PM darsda o'lik prop  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:923–928; src/3-Modull/PmLesson9.jsx:1816, src/4-Modull/PmLesson11.jsx:1761, src/4-Modull/PmLesson13.jsx:1813, src/4a-Modull/PmLesson15.jsx:1813 (`starterCode={code || KOD_STARTER}` + `KOD_TASK.files`)
- Qanday takrorlash: `mountHC({starterCode:'<p>STARTER</p>', task:{files:[{name:'index.html',lang:'html',starter:'<p>FILES</p>'}]}})`
- Kutilgan: hujjatda ustunlik yozilgan bo'lishi · Kuzatilgan: kod = `<p>FILES</p>` (files ustun); `files:[]` bo'lsa starterCode ustun
- Dalil: t-contract-1-props.mjs → `G starter+files: "<p>FILES</p>"`, `G2 starter+files=[]: "<p>STARTER</p>"`
- Izoh: PmLesson9/11/13/15 dagi `starterCode={code || …}` hech qachon ishlamaydi — dars-muallifi «lesson-level `code` starter bo'ladi» deb o'ylashi mumkin, aslida faqat storageKey-saqlov tiklaydi.

#### K-K-05 · `task` har renderda YANGI obyekt + ota tez qayta-render → runtime-shartlar hech qachon yashil bo'lmaydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:918–921 (`useMemo(…,[task.requirements])`), :963–967 (`runtimeProbes` ← reqs), :992–1013 (effekt deps `runtimeProbes`, 300 ms setTimeout + cleanup)
- Qanday takrorlash: ota-komponent `task={{…, requirements:[…]}}` inline yozadi va o'zi 250 ms da qayta-render bo'ladi (jonli-sessiya polling, timer, input) — `t-contract-1b-inline.mjs`
- Kutilgan: shart bir marta tekshirilib yashil bo'ladi · Kuzatilgan: har renderda `reqs`→`runtimeProbes` yangi → effekt qayta → 300 ms taymer cleanup bilan o'chadi → yashirin iframe HECH qurilmaydi; chip 6 s davomida «ishga tushirilmoqda…»; 400 ms da — yashil, lekin oraliqda «natija kutilgancha emas» yolg'on-qizil miltillaydi; 1000 ms — normal. Sinxron shartlar (`C.has`) ta'sirlanmaydi
- Dalil: `rerender=250ms → yashil=false (6062ms), hintlar=["ishga tushirilmoqda…"]` · `rerender=400ms → yashil=true, hintlar=["ishga tushirilmoqda…","natija kutilgancha emas",""]` · nazorat (barqaror task, 250 ms) → yashil 438 ms
- Izoh: darslarda task modul-konstanta — hozir tegmaydi. LMS/tashqi integrator uchun «task obyekti barqaror (useMemo/const) bo'lsin» sharti kontraktda YO'Q (satr 1–30).

#### K-K-06 · `task.files` unmount'siz almashsa — «arvoh fayl»: aktiv tab yo'q, yozilgan kod hech qayerga tushmaydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:950 (`useState(files[0].name)` — faqat init), :930 (`codes` faqat init), :1088 (`setActiveCode` eski `active`ga yozadi), :1746
- Qanday takrorlash: `mount({task:T1 (index.html)})` → `rerender({task:T3 (app.js)})` (bir root, unmount yo'q) — `t-contract-3c.mjs`
- Kutilgan: yangi fayllar bilan qayta boshlanadi yoki hujjatda «task almashsa `key` bering» · Kuzatilgan: tabs `['app.js']`, `.hc-tab.active` = 0, textarea'da eski `<i>y</i>`, holat-qatori `index.html`, yozilgan `console.log(9)` preview'ga tushmaydi (`byLang('js')` = codes['app.js'] = starter)
- Dalil: `files almashdi (unmount yo'q): tabs=[app.js] active tab soni=0 kod="<i>y</i>" sb-file=index.html` · `yozildi → preview srcdoc ichida console.log(9)=false`
- Izoh: darslarda praktika→praktika o'tish `setPractice(null)` orqali (unmount) — hozir tegmaydi; LMS bitta mount'da topshiriqni almashtirsa buziladi.

#### K-K-07 · `storageKey` runtime'da almashsa — eski kod yangi kalitga YOZILADI (boshqa saqlovni ustidan bosadi)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:930–939 (o'qish faqat init), :944–948 (`useEffect([codes, storageKey])` — kalit o'zgarsa darhol yozadi)
- Qanday takrorlash: `kA={A-KOD}`, `kB={B-KOD}` saqlangan; `mount({storageKey:'kA'})` → `rerender({storageKey:'kB'})` (unmount yo'q) — `t-contract-2b.mjs`
- Kutilgan: kB'dagi kod o'qiladi yoki hech bo'lmasa kB buzilmaydi · Kuzatilgan: muharrirda `A-KOD` qoladi, 400 ms dan keyin `kB = {codes:{index.html:'A-KOD'}}` — B-KOD YO'QOLDI
- Dalil: `8 storageKey kA→kB (haqiqiy rerender, renders=1) → kod="A-KOD" kB={"codes":{"index.html":"A-KOD"}…}`
- Izoh: K-K-06 bilan bir ildiz (mount-vaqtidagi proplar «muzlaydi», lekin yozuv-effekt jonli).

#### K-K-08 · Starter/topshiriq o'zgarsa (dars yangilansa) eski saqlov ustun — o'quvchi eskirgan kodni ko'radi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:930–939 (faqat fayl-NOMLARI solishtiriladi; starter/requirements/versiya solishtirilmaydi)
- Qanday takrorlash: `storageKey:'k1', starterCode:'<p>S1</p>'` bilan yoz → unmount → `starterCode:'<p>S2-YANGI</p>'` bilan mount
- Kutilgan: hujjat izohi (satr 928–929) «topshiriq o'zgargan bo'lsa saqlov e'tiborsiz» deydi — starter ham «topshiriq»ning qismi · Kuzatilgan: kod = `<h1>yozdim</h1>` (eski); o'quvchi bir harf ham yozmagan bo'lsa ham starter saqlanadi (K-K-21 bilan birga: uz-starter → ru'da ochilsa uz-starter chiqadi)
- Dalil: t-contract-2-storage.mjs → `2 starter o'zgardi → kod="<h1>yozdim</h1>"`; t-contract-3-lang.mjs → `C uz saqlandi → ru ochildi → kod="UZ-S"`
- Izoh: PM darslarda starter = butun kontent (`[KIM]/[MUAMMO]` shablon) va kalitda versiya yo'q (`pm-m1d2-koding:code`) — shablon matni tuzatilsa eski o'quvchilar eskisini ko'radi. Texnik darslarda kalit `lessonId` versiyali (`html-01-v17`) — versiya ko'tarilsa eski kod BUTUNLAY tashlanadi (teskari muammo, K-K-15).

#### K-K-09 · `savedAt` yoziladi, lekin HECH QAYERDA o'qilmaydi — TTL yo'q, 3 oylik kod tiklanadi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:66 (yozish), :930–939 (o'qishda ishlatilmaydi) — `savedAt` manbada 1 marta
- Qanday takrorlash: `localStorage.k4 = {codes:{index.html:'ESKI-3-OY'}, savedAt: Date.now()-90 kun}` → mount
- Kutilgan: hujjatda TTL-siyosat (yoki «cheksiz» deb aytilishi) · Kuzatilgan: `ESKI-3-OY` tiklanadi
- Dalil: `4 savedAt 3 oy → kod="ESKI-3-OY"`

#### K-K-10 · Saqlovda kod qiymati string bo'lmasa (raqam/obyekt) → butun kompilyator OQ EKRAN (ErrorBoundary yo'q)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:65 (`codesRead` faqat tashqi obyektni tekshiradi), :939 (`{...fresh, ...s.codes}` — qiymat turi tekshirilmaydi), keyin `.match is not a function` (highlight/lint)
- Qanday takrorlash: `localStorage.k6 = {codes:{index.html:123}}` yoki `{codes:{index.html:{a:1}}}` → mount
- Kutilgan: yaroqsiz qiymat → starter · Kuzatilgan: `PAGEERROR (codes[active] ?? "").match is not a function`, React: «An error occurred in the <HtmlCompiler> component. Consider adding an error boundary», `.hc-root` chizilmaydi; `null` qiymat esa `''` bo'lib o'tadi
- Dalil: t-contract-2-storage.mjs → `4b k6 → CRASH …`, `4b k8 → CRASH …`, `4b k7 → kod=""`
- Izoh: `src/` da birorta ErrorBoundary yo'q (`componentDidCatch|getDerivedStateFromError` grep = 0) — kompilyator qulasa butun dars/App oq ekran, va reload ham yordam bermaydi (saqlov buzuq qolaveradi). Ehtimoli past (kalitni faqat kompilyator yozadi), zarari yuqori.

#### K-K-11 · 400 ms debounce: yozib 100 ms ichida unmount → oxirgi belgilar yo'qoladi (unmount'da flush yo'q)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:944–948 (`setTimeout(…,400)` + cleanup `clearTimeout` — unmount'da yozmasdan bekor qiladi); `pagehide/beforeunload` ishlovchisi yo'q
- Qanday takrorlash: `<h1>abc</h1>` yoz → 600 ms kut → `XYZ` yoz → 100 ms → unmount (LMS'da «Nazad»/tab yopish tez bosilsa)
- Kutilgan: 102-qonun (F-0801-01) — «yozilgan kod yo'qolmasin» · Kuzatilgan: saqlov `{"index.html":"<h1>abc</h1>"}` — `XYZ` yo'q
- Dalil: `6 debounce 100ms → saqlov= {…"<h1>abc</h1>"…}`; `7b Qaytadan+100ms unmount` — teskari tomoni: «Qaytadan» ham 400 ms ichida unmount bo'lsa eski kod qoladi (nomuvofiq xulq)

#### K-K-12 · `hcFont`/`hcSplit` — nomsiz global kalitlar, `storageKey` bo'lmasa ham yoziladi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1158–1175
- Qanday takrorlash: `mountHC({task:{requirements:[]}})` (storageKey yo'q) → `Object.keys(localStorage)`
- Kutilgan: LMS localStorage'ida modul-prefiks (`hc:`) yoki hujjatlashtirilgan · Kuzatilgan: `["hcSplit","hcFont"]` — LMS bilan bir nom-makonda; ikki xil sayt/LMS bir domenda bo'lsa to'qnashadi
- Dalil: `9 storageKey yo'q → ls= {"hcSplit":"0.5","hcFont":"14"}`

#### K-K-13 · Bir sahifada ikki kompilyator — runtime-hisobot va konsol-satrlar ARALASHADI (nonce nusxa-identifikatorsiz)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1016–1039 (`d.nonce === nonceRef.current` — har nusxada 1 dan boshlanadi; `e.source`/`e.origin` tekshirilmaydi), :779–793, :795–847
- Qanday takrorlash: `mountAt('A', logs('7'), starter console.log(1))` + `mountAt('B', …, starter console.log(7))` — `t-contract-3d.mjs`
- Kutilgan: A qizil, B yashil · Kuzatilgan: A ham YASHIL (B iframe'ining hisoboti nonce=1 bilan A'ga tushdi); A konsolida `›1, ›7` (B'ning satri); keyin nonce'lar farqlansa to'g'rilanadi
- Dalil: `A (log 1 — qizil kutiladi): [{"ok":true…}]`, `A console: ["›1","›7"]`
- Izoh: hozirgi darslarda bir vaqtda faqat bitta nusxa (overlay). LMS bir sahifada 2+ nusxa ochsa (masalan «ro'yxat»/«solishtirish») noto'g'ri «Davom etish».

#### K-K-14 · O'quvchi kodi runtime-hisobotni SOXTALASHTIRA oladi → hamma chip yashil, «Davom etish» ochiladi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1016–1027 (`__hcReport` — `e.source`/`origin`/imzo tekshiruvi yo'q; nonce o'quvchi kodi bilan bir iframe'da, harnessga qadar `${js}` yuklanadi (satr 900–902))
- Qanday takrorlash: `app.js`: `setTimeout(()=>{for(let n=1;n<50;n++)parent.postMessage({__hcReport:true,nonce:n,results:{l:true,e:true}},'*')},600)` — `t-contract-4b-spoof.mjs`
- Kutilgan: shartlar `logs('7')`, `evalEquals('x','1')` bajarilmagan → qizil · Kuzatilgan: ikkalasi ✓ yashil, `nextDisabled=false` (haqiqiy harness-hisobotdan 600 ms keyin ustidan yozdi; kechikmasdan yuborilsa harness ustun keladi)
- Dalil: `spoof (log 7 yo'q, x yo'q): [{"ok":true…},{"ok":true…}] nextDisabled= false`
- Izoh: sinxron shartlar (`C.has`, `C.js`) DOMParser'da — soxtalab bo'lmaydi. Jonli-sessiyada `done()` → `live.submitAnswer(…, true)` — «bajardim» signali halol emas bo'lib qolishi mumkin. Test-halollik tamoyili nuqtai nazaridan hisobga olinsin.

#### K-K-15 · Texnik darslarda kalit `lessonId` versiyali → versiya ko'tarilsa saqlov yetim qoladi (o'quvchi kodi «yo'qoladi», localStorage o'sadi)  ·  Og'irlik: 🔵 taklif
- Qayer: src/1-Modull/Htmllesson1.jsx:80 (`ccCode:${lessonId}:${kind}`), lessonId `html-01-v17` (…v16, v18 tarixiy); kompilyatorda tozalash/migratsiya yo'q
- Qanday takrorlash: statik (grep) — `git log` bo'yicha lessonId'lar v16→v17→v18 o'zgargan
- Kutilgan: kalit-siyosat hujjatda · Kuzatilgan: har versiya-o'zgarishda `ccCode:*-vN:*` kalitlari qoladi va o'qilmaydi
- Dalil: `codeKeyOf` grep — 18 darsda bir xil naqsh; kompilyatorda faqat `codesRead/codesWrite` (o'chirish yo'q)

#### K-K-16 · `onPractice(entry.task)` LMS-yo'li starter/lang/storageKey'siz — kontrakt yarim uzatiladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/1-Modull/Htmllesson1.jsx:3324, :3334; JsVarsLesson.jsx:2728,2736; jami 15 darsda (`grep onPractice(`) — DARS_ETALON.md:545 naqshi
- Qanday takrorlash: statik — `Promise.resolve(onPractice(entry.task))` faqat `task`ni beradi; `entry.starter` (Htmllesson1/2, HtmlTakrorlash, HtmlPractice — `starterCode`-rejim, `{uz,ru}` obyekt), `codeKeyOf(...)`, `__lang` uzatilmaydi
- Kutilgan: LMS ham `<HtmlCompiler task starterCode storageKey lang>` to'liq kontrakt bilan ochadi · Kuzatilgan: LMS starter/til/saqlov-kalitni o'zi topib olishi kerak; hozir starterlar asosan `<!-- Bu yerga yozing -->` (zarar kichik), lekin `files`siz darslar uchun starter YO'QOLADI
- Dalil: t-contract audit-skript (`onPractice-yo'li` ustuni) + Htmllesson1.jsx:3095 `STARTER_HEADINGS = {uz:…, ru:…}` task'dan tashqarida
- Izoh: `App.jsx` `onPractice` bermaydi (grep=0) — bu yo'l hozir o'lik; LMS TZ (shared-modul) darsning O'ZI `<HtmlCompiler>` chizishini nazarda tutadi. Ikki integratsiya-yo'li bir vaqtda mavjud — kontrakt-hujjatda qaysi biri amalda ekani aytilmagan.

#### K-K-17 · PmLesson9/11/13/15 — `lang="uz"` qattiq yozilgan  ·  Og'irlik: 🔵 taklif
- Qayer: src/3-Modull/PmLesson9.jsx:1816, src/4-Modull/PmLesson11.jsx:1761, src/4-Modull/PmLesson13.jsx:1813, src/4a-Modull/PmLesson15.jsx:1813
- Qanday takrorlash: statik (grep) — bu darslar hozir uz-only (`ru:` = 0), shuning uchun HOZIR xato emas
- Kutilgan: `lang={__lang}` yagona naqsh (18 boshqa darsdagidek) · Kuzatilgan: dars ruslashtirilganda kompilyator uz qolib ketadi (RU i18n konvensiyasi bo'yicha «PmLesson1/2 navbatda» — shu darslar ham navbatda bo'lsa xato bo'ladi)

#### K-K-18 · MentorPracticeOverlay demo — storageKey yo'q: watch↔demo almashsa mentor kodi o'chadi  ·  Og'irlik: 🔵 taklif
- Qayer: src/1-Modull/Htmllesson1.jsx:926 (va 17 darsda xuddi shu qator)
- Qanday takrorlash: mentor «Doskada yozib ko'rsatish» → yozadi → «Orqaga» (watch) → yana «demo»
- Kutilgan: ataylab bo'lsa — izohda aytilsin · Kuzatilgan: kompilyator unmount → starter'dan boshlanadi (K-K-11 bilan bog'liq emas — kalit umuman yo'q)

#### K-K-19 · Modul-global `__lang`: ikki nusxa bir sahifada — RU nusxaning tugma-xabari UZ chiqadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:33 (`let __lang`), :914 (render'da o'rnatiladi), :1571–1577 (`prettify` → `note(tr(...))` — event-handler'da `tr`)
- Qanday takrorlash: A(uz), B(ru); B'ga yoz; A'ga yoz (A oxirgi render → `__lang='uz'`); B'ning ✨ tugmasi (`onMouseDown preventDefault` — B render bo'lmaydi) — `t-contract-3b.mjs`
- Kutilgan: «Код уже аккуратный 👍» · Kuzatilgan: «Kod allaqachon chiroyli 👍» (uz) RU kompilyatorda
- Dalil: `B(ru) ✨ note matni: "Kod allaqachon chiroyli 👍"`
- Izoh: render-vaqtidagi `tr` to'g'ri; faqat renderdan tashqari (handler/timer) `tr` xavfli. Kontrakt-izoh (satr 20–22) «modul-darajali __lang» naqshini «darslardagi bilan bir xil» deb oqlaydi — lekin darsda bitta til, bu yerda nusxa-boshiga til.

#### K-K-20 · `lang` runtime'da almashsa — chip-maslahatlar (hint) ESKI tilda qoladi (kod o'zgarmaguncha)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1042–1052 (`results = useMemo(…,[html,css,js,reqs])` — `lang` deps'da yo'q; `checks.*` maslahat matnini tekshiruv paytida `tr()` qiladi)
- Qanday takrorlash: barqaror `task`, `mount({lang:'uz'})` → `rerender({lang:'ru'})`, kod tegilmagan — `t-contract-3c.mjs`
- Kutilgan: hamma matn ru · Kuzatilgan: sarlavha/label/status ru, lekin hint `"\`h1\` topilmadi"`, `P-UZ` (uz); kod o'zgargach ru
- Dalil: `ru rerender (task barqaror, kod o'zgarmagan) → chips: […hint:"\`h1\` topilmadi"…,"P-UZ"]`

#### K-K-21 · `lang` almashsa — starter-kod eski tilda qoladi (`useState(() => tr(f.starter))` bir marta)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:930–931
- Qanday takrorlash: `mount({lang:'uz', starter:{uz,ru}})` → `rerender({lang:'ru'})` — `t-contract-3-lang.mjs`
- Kutilgan: o'quvchi tegmagan bo'lsa ru-starter · Kuzatilgan: `<!-- UZ starter -->` qoladi; «Qaytadan» bosilsa ru-starter (handler-vaqtidagi `tr` yangi tilni oladi)
- Dalil: `rerender ru → code:"<!-- UZ starter -->"`, `ru rejimda Qaytadan → kod="<!-- RU starter -->"`
- Izoh: PmLesson1 izohi (satr 1937–1939) buni biladi va IKKALA til-belgisini qidiradi (UNION-check) — ya'ni muammo darsda «aylanib o'tilgan», kompilyatorda hal etilmagan; boshqa darslar aylanib o'tmagan.

#### K-K-22 · `previewCss` runtime'da o'zgarsa preview yangilanmaydi (effekt deps'da yo'q)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:978 (`mkDoc` `task.previewCss`ni yopib oladi), :992–1013 (deps: `[sig, html, css, js, hasRuntime, runtimeProbes, manualRun]`)
- Qanday takrorlash: `rerender({task:{...T, previewCss:'body{background:blue}'}})` — `t-contract-3c.mjs`
- Kutilgan: yangi uslub · Kuzatilgan: `blue=false`; kod o'zgargach `blue=true`
- Dalil: `previewCss red→blue rerender: oldin red=true keyin blue=false / kod o'zgargach blue=true`

#### K-K-23 · SSR/DOM'siz render — `DOMParser is not defined` (module import OK, render emas)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1043 (`new DOMParser()` render ichida, guard'siz), :541–545 (`parseCss` → `document`), :1 (`useLayoutEffect` — SSR ogohlantirish)
- Qanday takrorlash: Node: `renderToString(createElement(default,{lang:'ru'}))`
- Kutilgan: LMS SSR/pre-render qilmasa muammo emas — lekin kontraktda «faqat brauzer» sharti yozilsin · Kuzatilgan: `SSR CRASH: DOMParser is not defined`; `import` o'zi muvaffaqiyatli (top-level DOM yo'q)
- Dalil: `_ssr.mjs` (vaqtinchalik) → `node import OK; exports: [HC_NASHR, checks, default, formatHtml, highlight]` · `SSR CRASH: DOMParser is not defined`

#### K-K-24 · Modul ichida `@import fonts.googleapis.com` — har mount'da tashqi tarmoq-so'rov  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1920 (`StyleTag` → `@import url('https://fonts.googleapis.com/…')`); lms/html-compiler.jsx (1 marta)
- Qanday takrorlash: statik (grep) — `fonts.googleapis`
- Kutilgan: LMS TZ «modul o'zini o'zi ta'minlaydi (faqat react)» — shrift ham shu ruhda hujjatlashtirilsin/CSP'da ruxsat · Kuzatilgan: oflayn/CSP-bloklangan LMS'da xato yo'q, lekin shrift Manrope/JetBrains → tizim; StyleTag har nusxada 20 KB `<style>` qo'shadi (o'lchamning 21%: 20 424 / 96 180 bayt)
- Izoh: modul o'lchami: 96 KB — CSS 20.4 KB, TAG/ATTR/SNIPPET menyular 2.9 KB, DEFAULT_TASK 1.1 KB, izohlar deyarli olib tashlangan (35 satr). O'lik top-level kod topilmadi; `HC_CODE.gutter` kaliti ishlatilmaydi (1 satr).

#### K-K-25 · `check` throw qilsa — chip abadiy qizil, xato JIM yutiladi (konsolga chiqmaydi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:737–760 (`catch {}` — `console.error`/`warn` yo'q)
- Qanday takrorlash: `requirements:[{id:'x',label:'x',check:()=>{throw new Error('boom')}}]`
- Kutilgan: qulamasin ✓ + dars-muallifi xatoni ko'rsin · Kuzatilgan: hint «tekshirishda xatolik», konsol toza — muallif nima buzilganini bilmaydi; o'quvchi shartni hech qachon bajarolmaydi
- Dalil: t-contract-4-errors.mjs → `1 check throw: OK … hint:"tekshirishda xatolik" log=[]`

#### K-K-26 · `requirements`/`files`/`task` yaroqsiz shakl → ErrorBoundary'siz OQ EKRAN  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:919 (`normalizeReq(null)` → `req.check`), :919 (`.map` massiv-bo'lmaganda), :906 (`task=null` — default faqat `undefined`ga ishlaydi), :930 (`files:[null]` → `f.name`)
- Qanday takrorlash: `task:null` · `requirements:[null]` · `requirements:{a:1}` · `requirements:'h1'` · `files:[null]`
- Kutilgan: yaroqsiz kirish → yiqilmaslik yoki aniq xato · Kuzatilgan: 5 holatning hammasi `PAGEERROR … Cannot read properties of null / .map is not a function` + React «Consider adding an error boundary», `.hc-root` chizilmaydi
- Dalil: t-contract-4-errors.mjs → `3 requirements[0]=null: CRASH`, `3b`, `3c`, `4 task=null: CRASH`, `5d files=[null]: CRASH`
- Izoh: LMS'da task JSON/DB'dan kelsa `null` ehtimoli real. `task='x'` (string) esa yiqilmaydi (0/0).

#### K-K-27 · `check` qaytargan `{uz,ru}`/JSX/`1`/Promise — maslahat YO'QOLADI yoki hech qachon yashil bo'lmaydi (kontrakt qat'iy, hujjatda aytilmagan)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:746–749 (`r === true` qat'iy; `typeof r === 'string' ? r : tr(req.hint)`), :414 (`custom: (fn) => fn` — izoh «true | "maslahat"»)
- Qanday takrorlash: `check:()=>({uz:'UZ',ru:'RU'})` · `()=>h('b',null,'JSX')` · `()=>1` · `async()=>true`
- Kutilgan: hujjatlashtirilgan xulq · Kuzatilgan: obyekt/JSX → hint `""` (yo'qoldi, `req.hint` ham yo'q); `1` → qizil, hintsiz; Promise → abadiy qizil. `hint:{uz,ru}` + `check:()=>false` esa to'g'ri (`RU-H`) ✓; takror `id` (`l`,`l`) → runtime natija ustma-ust: bajarilgan shart ham qizil + key-xato ×4
- Dalil: t-contract-4-errors.mjs `7, 7c, 7d, 7e`; t-contract-4c-dupid.mjs → `chips=[…"1log 7" ok:false…]`
- Izoh: darslardagi 7 ta `C.custom` hammasi string qaytaradi (VsCode/PM — `tr(...)` bilan) — hozir tegmaydi; keyingi dars-mualliflari uchun kontrakt-band kerak.

---
Yakun: 27 topilma — 🔴 0 · 🟠 8 (K-K-05, 06, 07, 10, 11, 13, 14, 26) · 🟡 9 (K-K-01, 02, 08, 16, 19, 20, 21, 25, 27) · 🔵 10 (K-K-03, 04, 09, 12, 15, 17, 18, 22, 23, 24). Yechim taklif qilinmadi (faqat tashxis).

