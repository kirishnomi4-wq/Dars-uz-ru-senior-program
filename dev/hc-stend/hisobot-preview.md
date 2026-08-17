# HC natija-oynasi · konsol · runtime · xavfsizlik — sinov hisoboti

Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (2155 satr) · Stend: `dev/hc-stend/` (Chrome headless, playwright-core)
Skriptlar: `t-preview-1-security.mjs`, `t-preview-1b…1g.mjs`, `t-preview-2-stability.mjs`, `t-preview-2b…2f.mjs`, `t-preview-3-console.mjs`, `t-preview-3b.mjs`, `t-preview-4-render.mjs`, `t-preview-4b.mjs`, `t-preview-5-previewurl.mjs`, `t-preview-7-layout.mjs`, `t-preview-7b.mjs`, `t-preview-8-leak.mjs`, `t-preview-9-reverify.mjs`. Skrinshotlar `shot-*.png` shu papkada.
Hech narsa tahrirlanmadi (na `src/`, na `scripts/`). Har topilma kamida 2 marta bajarilib tasdiqlandi.

## Jadval

| Og'irlik | Soni | ID'lar |
|---|---|---|
| 🔴 kritik | 1 | K-P-01 |
| 🟠 muhim | 12 | K-P-02 … K-P-13 |
| 🟡 mayda | 10 | K-P-14 … K-P-23 |
| 🔵 taklif/kuzatuv | 4 | K-P-24 … K-P-27 |
| **Jami** | **27** | |

## Nima sinaldi (✓ o'tdi = kamchilik topilmadi)

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

## Topilmalar

### K-P-01 · Cheksiz sikl butun runtime'ni qotiradi va ▶/tahrir TIKLAMAYDI  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1848–1852 (`<iframe srcDoc={doc}>`), 1882–1889 (yashirin tekshiruv-iframe, jonli), 992–1012 (debounce → `setCheckDoc`), 1592–1599 (`runNow`)
- Qanday takrorlash:
  1. JS-fayli bor dars, `checks.logs(5)` runtime-shart. `script.js` tabida yozing: `let i=0;` Enter `while(i<3){` — muharrir `}` ni o'zi qo'yadi → matn `while(i<3){}` (t-preview-2e.mjs: `value after typing '{': "let i=0;\nwhile(i<3){}"`).
  2. 300 ms dan keyin yashirin tekshiruv-iframe shu kodni ishga tushiradi → cheksiz sikl.
  3. Kodni tuzating (`i++` qo'shing), 6 s kuting → chip yashil bo'lmaydi. ▶ bosing → konsol bo'sh, natija yangilanmaydi.
  4. HTML-only jonli rejimda ham: `<h1>A</h1><script>while(true){}</script>` yozing, keyin `<h1>B</h1>` ga almashtiring — 40 s kuzatildi, frame «HUNG» (t-preview-2c.mjs).
- Kutilgan: bola kodni tuzatgach preview/chiplar tiklanadi yoki hech bo'lmasa «kod qotib qoldi» xabari · Kuzatilgan: hamma iframe (ko'rinadigan + yashirin — bir null-origin jarayonda) abadiy qotadi; `srcdoc` almashtirish navigatsiyani boshlay olmaydi; hech qanday xabar yo'q; konsolda hatto sikldan OLDINGI `console.log("before")` ham chiqmaydi. Faqat `unmountHC()+mountHC()` (darsdan chiqib-kirish / sahifa reload) tiklaydi (t-preview-8-leak.mjs oxiri).
- Dalil: t-preview-2c.mjs chiqishi (`after 40s: (HUNG)`), t-preview-2d.mjs (`after fix 6s: chip [ 'hc-chip ' ]`), t-preview-2f.mjs (`visible preview after hidden hang: console lines []`, ikkala frame `(HUNG)`). Skrinshot olib bo'lmadi — Playwright screenshot ham qotgan frame'ni kutib timeout beradi (`shot-while-true` yo'q).
- Izoh: `while`/`for` sikllarini o'rganayotgan bola uchun ODATIY oraliq holat (`{` avtoyopilishi, `i++` unutish, `while(x<5)` teskari shart). Undan keyin ✓ belgilar hech qachon yonmaydi, «Davom etish» ochilmaydi, bola «men to'g'ri yozdim-ku» deb qoladi; LMS'da darsdan chiqib qayta kirish kerakligini hech kim aytmaydi.

### K-P-02 · `<a href="#…">` va nisbiy havola LMS sahifasini yangi tabda ochadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:890 (`<base target="_blank">`), 1851 (`allow-popups allow-popups-to-escape-sandbox`)
- Qanday takrorlash: HTML: `<a id=a href="#bolim2">2-bo'lim</a> …<h2 id="bolim2">` → previewda havolani bosing. Yoki `<a href="page2.html">`.
- Kutilgan: sahifa ichida `#bolim2` ga suriladi (yoki hech bo'lmasa iframe ichida qoladi) · Kuzatilgan: yangi tab ochiladi, manzili `http://127.0.0.1:4517/#bolim2` (= OTA/LMS URL + hash; srcdoc'ning base URL'i ota sahifaniki), iframe scrollY=0 qoladi. `page2.html` → `http://127.0.0.1:4517/page2.html` (LMS-domenidagi 404) yangi tabda.
- Dalil: t-preview-4b.mjs (`anchor #: popups ['popup:http://127.0.0.1:4517/#pastki'] … scrollY 0`), t-preview-9-reverify.mjs R1, `shot-anchor.png`.
- Izoh: «Havolalar/navigatsiya» darsida bola o'z sahifasidagi ichki havolani bosadi — butun LMS yangi tabda ochiladi (ikkinchi seans, kutilmagan ekran). Sandboxdan chiqqan (`escape-sandbox`) yangi tab to'liq huquqli.

### K-P-03 · Har preview-yangilanish brauzer tarixiga yozuv qo'shadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1848–1852 (`srcDoc={doc}` atribut-almashtirish = iframe navigatsiya), 994–1000
- Qanday takrorlash: HTML jonli rejimda 11 ta harfni 450 ms oraliqda yozing; CDP `Page.getNavigationHistory` yoki `history.length` ni oling.
- Kutilgan: kompilyator ichidagi ish tarixga tushmaydi · Kuzatilgan: `history.length` 2 → 7 (5 tahrir) → 16 (11 harf): HAR yangilanish +1 yozuv (`entries` hammasi LMS URL'i). Top-oynada `history.back()` chaqirilsa sahifa emas, iframe oldingi srcdoc holatiga qaytadi (matn `Salom 2 qo\`shimcha` — editor bilan mos kelmaydi).
- Dalil: t-preview-1e.mjs, t-preview-1f.mjs chiqishi.
- Izoh: LMS'da bola 50 harf yozgach brauzer «Orqaga» tugmasi 50 marta iframe'ni aylanadi (yoki LMS o'zining `history.back()` bilan «Orqaga» qilsa — darsdan chiqmaydi, faqat preview eskiga qaytadi). Editor va natija bir-biriga mos kelmay qoladi.

### K-P-04 · Xato-satri raqamsiz, inglizcha, `lineno` 54 satrga siljigan  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:791 (`send('error',[e.message])` — faqat message), 885–905 (`wrapDoc`: bola JS hujjatning ~55-satridan boshlanadi)
- Qanday takrolash: JS: `console.log(1);\nconsole.log(2);\nfoo();` → ▶.
- Kutilgan: «3-qator: foo aniqlanmagan» kabi joy ko'rsatkichi · Kuzatilgan: `Uncaught ReferenceError: foo is not defined` — qator yo'q; sinov `window.addEventListener('error', e=>console.log(e.lineno))` → `LINENO 57` (bola 3-qatori). Xabar brauzerning inglizcha matni, RU/UZ emas. Konsol xato-satrini bosib qatorga sakrab bo'lmaydi (HTML-linter `jumpToLine` bor, konsolda yo'q).
- Dalil: t-preview-2-stability.mjs (`throw`, `ReferenceError` bloklari), t-preview-3b.mjs (`LINENO 57 COL 1`), `shot-console-throw.png`.
- Izoh: 13 yoshli bola «foo is not defined» ni tarjima qilib, qatorni o'zi qidiradi.

### K-P-05 · `alert/prompt/confirm` jimgina yutiladi — panelda hech xabar yo'q  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1851 (`allow-modals` yo'q — to'g'ri xavfsizlik qarori), 776–793 (`CONSOLE_FORWARD` — brauzerning «Ignored call to alert()» ogohlantirishi ushlanmaydi)
- Qanday takrorlash: JS: `alert("Salom!"); console.log("alertdan keyin")` → ▶. `let ism = prompt("Ismingiz?"); console.log("Salom, "+ism); console.log(confirm("?"))`.
- Kutilgan: yoki oyna chiqadi, yoki panelda «alert bu yerda ishlamaydi» · Kuzatilgan: hech narsa; panelda faqat `alertdan keyin`; `Salom, null`, `false`. HTML-only rejimda umuman iz yo'q.
- Dalil: t-preview-3b.mjs (`alert JS rejim: ['›alertdan keyin']`, `prompt/confirm: ['›Salom, null','›false']`), t-preview-1b.mjs (`after-alert 1ms`).
- Izoh: `alert("Salom dunyo")` — ko'p bolaning birinchi JS qatori. «Ishlamayapti» + sababsiz.

### K-P-06 · Konsol 200 satrda jim to'xtaydi, auto-scroll yo'q  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1034 (`prev.length >= 200 ? prev : …`), 1862–1874 (panel), 2039 (`.hc-console-body`)
- Qanday takrorlash: `for(let i=1;i<=500;i++)console.log("qator",i)` → ▶. `setInterval(()=>console.log("tick"),10)` → ▶, 1.5 s kuting.
- Kutilgan: «…300 satr yashirildi» kabi belgi; yangi satrlar ko'rinishi uchun panel pastga suriladi · Kuzatilgan: 200 satr, oxirgisi `qator 200`, hech qanday «kesildi» belgisi; `scrollTop: 0` — bola birinchi satrlarni ko'radi, oxirgilari ko'rinmaydi; setInterval — 200 dan keyin panel «o'lgan»dek, dastur esa davom etyapti.
- Dalil: t-preview-2-stability.mjs (`1000 logs | lines: 200`, `after 1.5s more lines: 200`), t-preview-3-console.mjs (`300 log → panel: {st:0, sh:5171, ch:152, n:200}`), t-preview-9 R3, `shot-console-1000.png`.
- Izoh: sikl-darslarida bola `i` ni 200 dan keyin ko'rmaydi va «sikl 200 da to'xtadi» deb o'ylashi mumkin.

### K-P-07 · Error/Map/Set/Date/DOM obyektlar `{}` / `[object Object]` bo'lib chiqadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:782 (`fmt`: `JSON.stringify(a)`), 769–771 (`CONSOLE_CAPTURE` xuddi shunday)
- Qanday takrorlash: `try{JSON.parse("{bad")}catch(e){console.error(e);console.log("xato:",e)}`; `console.log(new Map([[1,2]]), new Set([1]), new Date(0), document.body, [undefined,null], {u:undefined})`; `const o={};o.self=o;console.log(o)`.
- Kutilgan: `SyntaxError: Unexpected token b…`, `Map(1) {1 => 2}`, `<body>` kabi ma'noli chiqish · Kuzatilgan: `{}` `xato: {}` (Error → JSON `{}`), Map/Set/body → `{}`, Date → `"1970-01-01T00:00:00.000Z"` (qo'shtirnoq bilan), `[undefined,null]` → `[null,null]`, `{u:undefined}` → `{}`, siklik obyekt → `[object Object]`, `console.error(new Error("obj xato"))` → `{}`.
- Dalil: t-preview-2b.mjs (`types:` satri), t-preview-2-stability.mjs (`error object` bloki), t-preview-9 R4.
- Izoh: `catch(e){console.log(e)}` — xatoni ushlashni o'rgatishda panel `{}` ko'rsatadi; bola xato matnini ko'rmaydi.

### K-P-08 · `</script>` JS-satr ichida (va `</style>` CSS'da) hujjatni buzadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:900 (`<script>${js || ''}<\/script>` — ekranlanmagan inyeksiya), 892–893 (`<style>…${css}</style>`)
- Qanday takrorlash: JS: `document.getElementById("o").innerHTML="<b>qalin</b>"; console.log("</script>")` → ▶. CSS: `h1{color:blue} </style><h2>CSSINJ</h2><style>`.
- Kutilgan: satr sifatida chiqadi · Kuzatilgan: skript o'sha joyda uziladi — konsol `Uncaught SyntaxError: Invalid or unexpected token`, natijada `")` matni ko'rinadi, `innerHTML` bajarilmaydi; CSS holatida `CSSINJ` sarlavhasi sahifaning tepasida paydo bo'ladi. HTML faylidagi `<script>` da ham xuddi shu (`inline html script` sinovida ikkinchi SyntaxError shu sabab).
- Dalil: t-preview-2b.mjs (`</script> in JS`, `</style> in CSS`), t-preview-9 R2, `shot-script-inject.png`.
- Izoh: «HTML'ni JS'dan yozish» (`innerHTML`, template) darslarida bola satr ichida teg yozadi — `</script>` uchrashi realistik.

### K-P-09 · IMG_FALLBACK matni va `<html lang>` faqat o'zbekcha  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:869–883 (`IMG_FALLBACK` — `'rasm topilmadi — <code>src</code> manzilini tekshiring'`, `'alt matni yozilmagan'` qattiq yozilgan), 886 (`<html lang="uz">`), 1850 (`title="natija"`)
- Qanday takrorlash: `mountHC({lang:'ru'})`, HTML: `<img src="x.png" alt="Яблоко">`.
- Kutilgan: rus darsda «изображение не найдено — проверьте src» · Kuzatilgan: `🖼 / Яблоко / rasm topilmadi — src manzilini tekshiring`, `documentElement.lang === "uz"`.
- Dalil: t-preview-4b.mjs (`RU fallback:` satri).
- Izoh: RU-o'quvchi natija oynasida o'zbekcha ko'rsatma ko'radi (RU_I18N_SPEC buzilishi).

### K-P-10 · baseStyle bola yozmagan uslubni «bo'yab» qo'yadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:850–860 (`body{padding:24px; font-family:-apple-system…; line-height:1.6}`, `h1{font-family:Georgia,serif}`, `img{max-width:100%;border-radius:12px;display:block;margin:10px 0}`, `p{margin:0 0 12px}`, `li:empty{display:none}`)
- Qanday takrorlash: HTML: `<h1>Sarlavha</h1><p>Matn</p><img src="x.png" alt="rasm"><ul><li>a</li><li></li></ul>`, CSS bo'sh; keyin bola CSS: `body{margin:0} h1{margin:0}`.
- Kutilgan: bola yozmagan narsa — brauzer standarti (Times, 8px margin, to'rtburchak rasm) · Kuzatilgan: body padding 24px (bola `body{margin:0}` yozsa ham 24px qoladi — «nega bo'sh joy ketmadi?»), h1 Georgia serif (bola sans yozganda h1 hali serif), img 12px yumaloq burchak + `display:block` (matn yonidagi rasm qatorga tushmaydi), `<li></li>` yashirin (`li:empty`), `p` standart margin o'zgargan. previewCss bo'lmagan oddiy HTML/CSS darsida ham shunday.
- Dalil: t-preview-4-render.mjs (`baseStyle:` va `bola override:` bloklari), `shot-basestyle.png`.
- Izoh: «CSS'siz sahifa qanday ko'rinadi → CSS nima o'zgartiradi» sabog'i buziladi: bola `border-radius` yozmasdan yumaloq rasm ko'radi, `padding` tushunchasini o'zi yozmagan 24px bilan chalkashtiradi. (Ataylab dizayn bo'lsa — hech joyda tushuntirilmagan.)

### K-P-11 · `__hcReport` soxtalashtirish — nonce oddiy hisoblagich, `origin/source` tekshirilmaydi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1015–1026 (`onMsg`: faqat `d.__hcReport && d.nonce === nonceRef.current`), 966 (`nonceRef` 1 dan boshlanadi), 839
- Qanday takrorlash: runtime-shartli dars (`checks.logs(5)`, `checks.toggle(...)`), `script.js`: `setTimeout(()=>{for(let n=1;n<300;n++)parent.postMessage({__hcReport:true,nonce:n,results:{r1:true,r2:true}},"*")},600)` (id'lar dars-manbasida ochiq). ▶ bosish shart emas — yashirin iframe o'zi ishlaydi.
- Kutilgan: chiplar o'zgarmaydi · Kuzatilgan: 2/2 chip yashil, `Davom etish` `disabled=false` — hech qanday shart bajarilmagan. (Darhol yuborilsa harness 50 ms dan keyin haqiqiy natija bilan ustidan yozadi — shu sabab `setTimeout` kerak.)
- Dalil: t-preview-1g.mjs (`spoof chips … ['hc-chip ok','hc-chip ok'] | Davom etish disabled? false`).
- Izoh: LMS'da «Davom etish» = progress/ball; nonce 1..N va `e.source`/`e.origin` tekshirilmagani uchun boshqa iframe/kengaytma ham hisobot yubora oladi.

### K-P-12 · 600 px balandlikda sarlavha va «Davom etish» kesiladi (100dvh + overflow:hidden)  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:1924–1929 (`.hc-root{height:calc(100dvh/var(--lz,1)); justify-content:center; overflow:hidden}`), 1953 (`.hc-split{height:calc(62dvh/…)}`)
- Qanday takrorlash: viewport 1024×600 (1366×768 noutbuk + brauzer-panel + taskbar ≈ 600–650 px), 3 faylli dars, LMS-qobiq `position:fixed;inset:0`.
- Kutilgan: hamma boshqaruv ko'rinadi (kerak bo'lsa ichki scroll) · Kuzatilgan: sarlavha «Layout» yuqoridan kesilgan, pastda «Davom etish» tugmasining yarmi ekrandan tashqarida (`.hc-bottom` top=563, height=48, viewport 600), scroll yo'q (overflow:hidden). 1366×768 da toza.
- Dalil: `shot-layout-1024x600-short.png`, t-preview-7-layout.mjs (`bottom: "975x48@563"`).
- Izoh: maktab noutbuklarida odatiy balandlik; bola «Davom etish» ni ko'rmaydi/bosolmaydi.

### K-P-13 · Jonli rejimda har tahrirda natija scroll'i 0 ga qaytadi  ·  Og'irlik: 🟠 muhim
- Qayer: HtmlCompiler.jsx:994–996 (`setDoc(mkDoc())` → to'liq qayta yuklash), 1848–1852
- Qanday takrorlash: HTML: `<h1>Top</h1>` + 200 ta `<p>` + `<h2 id=end>`, previewni pastga suring (scrollY 7181), muharrirda bitta belgi qo'shing.
- Kutilgan: bola tahrir qilayotgan joyi ko'rinib turadi · Kuzatilgan: scrollY 7181 → 0 har harfda.
- Dalil: t-preview-4-render.mjs (`scroll before 7181 after edit 0`).
- Izoh: uzun sahifaning pastini yozayotgan bola natijani ko'rish uchun har harfdan keyin qayta suradi.

### K-P-14 · «▶ Ishga tushirish» HTML/CSS (jonli) rejimida hech narsa qilmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1734 (tugma doim ko'rsatiladi), 1592–1596 (`runNow`: `setDoc(mkDoc())` — jonli rejimda doc allaqachon shu satr → React atributni o'zgartirmaydi → iframe qayta yuklanmaydi)
- Qanday takrorlash: HTML-only dars, `framenavigated` sanang, ▶ bosing.
- Kutilgan: qayta yuklash (masalan `<script>` yoki animatsiyani qaytadan ko'rish) yoki tugma yashirin · Kuzatilgan: navigatsiya = 0, hech qanday vizual javob; «JONLI» nishoni yonida «Ishga tushirish» tugmasi — bola nega ikkalasi kerakligini tushunmaydi.
- Dalil: t-preview-4-render.mjs (`▶ HTML rejimda: navigatsiya = 0`).

### K-P-15 · JS (qo'lda) rejimda ham «JONLI/LIVE» nishoni ko'rsatiladi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1844–1846 (`stale ? … : <span className="hc-live">jonli`), 990 (`manualRun = showConsole`)
- Qanday takrorlash: JS-fayli bor dars, ▶ bosgandan keyin panel-bar.
- Kutilgan: qo'lda rejimda «jonli» so'zi noto'g'ri (yozganda o'zgarmaydi) · Kuzatilgan: `● JONLI` pulsatsiya bilan; tahrirdan keyin «eskirdi · ▶ bosing» — ikkalasi bir joyda almashib turadi.
- Dalil: `shot-console-throw.png` (JONLI + ▶ tugmasi bir vaqtda), t-preview-3-console.mjs.

### K-P-16 · `console.clear/table/dir/debug/group` panelga tushmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:787 (`['log','info','warn','error']` ro'yxati)
- Qanday takrorlash: `console.debug("d");console.table([1,2]);console.dir({x:1});console.clear();console.log("after clear")`.
- Kutilgan: clear paneli tozalaydi, boshqalari hech bo'lmasa `log` kabi chiqadi · Kuzatilgan: faqat log/info/warn/error; `console.clear()` hech narsa qilmaydi (`after clear` eskilardan keyin qo'shiladi).
- Dalil: t-preview-2-stability.mjs (`levels` bloki: 5 satr, `after clear` oxirida).

### K-P-17 · `window.open` spam — bosishda 5 ta yangi tab  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1851 (`allow-popups allow-popups-to-escape-sandbox`)
- Qanday takrorlash: `<button id=b>` + `onclick=()=>{for(i<5)window.open('https://example.com/?'+i)}` → previewda tugmani bosing.
- Kuzatilgan: 5 ta tab (sandbox'dan tashqarida, to'liq huquqli). Foydalanuvchi ishorasi bo'lmasa headless'da ham ochildi (real Chrome popup-bloker to'sishi mumkin).
- Dalil: t-preview-1b.mjs (`window.open x5 in click … popups: 5`).

### K-P-18 · `meta refresh` / `location.href` previewni tashqi saytga olib ketadi; `history.back()` oldingi tashqi sahifaga qaytaradi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1848–1852 (o'z-navigatsiya sandbox'da ruxsat), K-P-03 bilan bog'liq
- Qanday takrorlash: `<meta http-equiv="refresh" content="0;url=https://example.com/">` yoki `location.href='https://example.com/'`; keyin `<h1>Salom</h1>`; keyin `<script>history.back()</script>`.
- Kuzatilgan: natija oynasida `https://example.com/` (sandbox ichida, `X-Frame-Options` ruxsat bersa) ; keyingi tahrir srcdoc'ni qaytaradi; `history.back()` bola kodidan → oyna yana example.com ga qaytadi (frame tarixi saqlanib qoladi).
- Dalil: t-preview-1b.mjs (`meta refresh … frames: […,'https://example.com/']`), t-preview-1d.mjs (`back: […,'https://example.com/']`).
- Izoh: bola YouTube/o'yin saytini natija oynasida ochishi mumkin (agar sayt iframe'ga ruxsat bersa).

### K-P-19 · IMG_FALLBACK: JS `src` ni tuzatsa ham quti qoladi, rasm yashirin  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:872–873 (`el.dataset.hcFb='1'; el.style.display='none'` — `load` da qaytarilmaydi)
- Qanday takrorlash: `<img id=i src="a.png" alt="A"><script>setTimeout(()=>{i.src="data:image/gif;base64,R0lGOD…"},200)</script>`.
- Kuzatilgan: rasm yuklandi (`naturalWidth 1`) lekin `display:none`, «rasm topilmadi» qutisi turibdi.
- Dalil: t-preview-4-render.mjs (`keyin src o'zgardi (JS) {"fb":["🖼 / A / rasm topilmadi…"],"imgs":["none true 1x1"]}`).
- Izoh: «rasm galereyasi / slayder» JS-darslarida (src almashadi) birinchi noto'g'ri src rasmni abadiy yashiradi.

### K-P-20 · HTML-only rejimda `<script>` xatolari va `console.log` umuman ko'rinmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:970 (`showConsole = files.some(f=>f.lang==='js')`), 895 (`CONSOLE_FORWARD` faqat consoleNonce bo'lsa)
- Qanday takrorlash: 1-modul darsi (faqat index.html): `<h1>A</h1><script>console.log("salom"); alert("hi"); foo()</script>`.
- Kuzatilgan: konsol paneli yo'q, xato belgisi yo'q, holat-satri «Shartlarni bajaring…»; bola `<script>` yozgan bo'lsa ham hech qanday fikr-mulohaza yo'q.
- Dalil: t-preview-3b.mjs (oxirgi blok).

### K-P-21 · Uzun `previewUrl` «…» siz kesiladi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1963 (`.hc-url{display:flex; … text-overflow:ellipsis}` — flex-konteynerdagi matn-tugun anonim flex-element bo'lgani uchun `text-overflow` ishlamaydi), 1838 (matn to'g'ridan-to'g'ri span ichida)
- Qanday takrorlash: `previewUrl: 'https://juda-uzun-manzil-…?ref=…session=…'` (150+ belgi), 1400 px.
- Kuzatilgan: `scrollWidth 1153 / width 501`, matn `…/menyu/k` da qirqilgan, uch nuqta yo'q (`shot-previewurl-long.png`).

### K-P-22 · Telefon 360×584 (manzil-satri ochiq): natija oynasi 117 px  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:2034 (`.hc-console{height:34%;min-height:96px}`), 2103–2107 (tab rejimi)
- Qanday takrorlash: viewport 360×584, isMobile, JS-fayli bor dars, «Natija» tabi.
- Kuzatilgan: preview 256 px = frame 117 px + konsol 96 px; `<h1>` + `<p>` dan boshqasi ko'rinmaydi. 375×667 da frame 181 px.
- Dalil: `shot-layout-m-360x640-urlbar-natija.png`, t-preview-7b.mjs.

### K-P-23 · `__hcConsole` — istalgan oyna panelga yoza oladi  ·  Og'irlik: 🟡 mayda
- Qayer: HtmlCompiler.jsx:1030–1035 (`d.__hcConsole && d.nonce === consoleNonceRef.current`, `e.source` tekshirilmaydi)
- Qanday takrorlash: bola HTML ichidagi `<iframe srcdoc="<script>parent.parent.postMessage({__hcConsole:true,nonce:N,level:'error',text:'…'},'*')</script>">` yoki brauzer-kengaytma. (Nonce'ni taxmin qilish oson — 1..N.)
- Izoh: xavf past (faqat ko'rinish), K-P-11 bilan bir ildiz.

### K-P-24 · previewCss `!important` bilan bola CSS'ini bloklashi mumkin — qoida yo'q  ·  Og'irlik: 🔵 taklif
- Qayer: HtmlCompiler.jsx:891–893 (tartib to'g'ri: baseStyle → previewCss → bola), 976 (izoh «bola baribir ustidan yoza oladi» — `!important` bilan bu yolg'on bo'ladi)
- Dalil: t-preview-5-previewurl.mjs (`p bg rgb(1,2,3)` previewCss `!important` bola `rgb(9,9,9)` ni yengdi).
- Izoh: dars-mualliflari uchun etalonda «previewCss'da `!important` yo'q» qoidasi yo'q.

### K-P-25 · `@import` Google Fonts har mount'da (offline/CSP)  ·  Og'irlik: 🔵 taklif
- Qayer: HtmlCompiler.jsx:1920
- Izoh: LMS `Content-Security-Policy` `style-src`/`font-src` cheklasa shrift tushmaydi (fallback system-ui bor — sinmaydi); internetsiz sinfda har ochilishda so'rov ketadi.

### K-P-26 · StyleTag komponent daraxtida — bir sahifada 2 kompilyator = 2 nusxa `<style>`  ·  Og'irlik: 🔵 kuzatuv
- Qayer: HtmlCompiler.jsx:1661 (`<StyleTag/>` `.hc-root` ichida), 1917
- Kuzatilgan (kod + stend): `<style>` `.hc-root` DIV ichida (head emas); unmount'da o'chadi ✓ (20× sinov: 1→0); ikkita instansiya bo'lsa ikkita bir xil `<style>` (zararsiz, faqat @import 2 marta). Global to'qnashuv yo'q — hamma selektor `.hc-` prefiksli ✓.
- Dalil: t-preview-8-leak.mjs (`style location: hc-root / DIV`, `after final unmount {"styles":0…}`).

### K-P-27 · Ko'lamdan tashqari kuzatuvlar (boshqa agentga)  ·  Og'irlik: 🔵
- `requirements: []` bo'lsa tepada `0/0` qizil hisoblagich chiqadi (`shot-previewurl-long.png`).
- Deklarativ `{ logs: 5 }` runtime-probe yaratmaydi (yashirin iframe yo'q, chip hech qachon ✓ bo'lmaydi); `checks.logs(5)` funksiya-shakli ishlaydi (t-preview-2d.mjs: `decl chip: ['hc-chip '] iframes: 1` vs `fn chip: ['hc-chip ok'] iframes: 2`). Deklarativ `{tag:'h1', text:true}` → «shart aniqlanmadi».
- 1024×600 da editor-bar'da `style.css`/`app.js` tablari ko'rinmaydi (faqat `index.html`) — `shot-layout-1024x600-short.png`.
