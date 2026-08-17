# HC-KONTRAKT SINOVI — hisobot (arxitektor-ko'zi)

- Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (2155 satr, TAHRIRLANMADI) · Tashqi modul: `lms/html-compiler.jsx` (nashr 2026-08-13)
- Stend: `dev/hc-stend/contract.html` + `bundle-contract.js` (`entry-contract.jsx` — createRoot/StrictMode/ikki-root/qayta-render qobig'i, `build-contract.mjs`)
- Skriptlar: `t-contract-lib.mjs`, `t-contract-1-props.mjs`, `t-contract-1b-inline.mjs`, `t-contract-2-storage.mjs`, `t-contract-2b.mjs`, `t-contract-3-lang.mjs`, `t-contract-3b.mjs`, `t-contract-3c.mjs`, `t-contract-3d.mjs`, `t-contract-4-errors.mjs`, `t-contract-4b-spoof.mjs`, `t-contract-4c-dupid.mjs` — hammasi qayta ishga tushirilib tasdiqlangan (har topilma 2 marta).

## Jadval

| Og'irlik | Soni |
|---|---|
| 🔴 kritik | 0 |
| 🟠 muhim | 8 |
| 🟡 mayda | 9 |
| 🔵 taklif | 10 |
| **Jami** | **27** |

## Nima sinaldi

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

## Darslar-audit jadvali

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

## TOPILMALAR

### K-K-01 · `requirements` bo'sh/yo'q → «Davom etish» hech qachon ochilmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1078 (`allPassed = reqs.length > 0 && …`), :1698–1705 (status), :1898–1905 (tugma title)
- Qanday takrorlash: `mountHC({task:{title:'B', requirements:[]}})` yoki `{title:'C'}` (requirements yo'q)
- Kutilgan: shartsiz topshiriq (erkin mashq / mentor-demo) — tugma yo ochiq, yo aniq sabab · Kuzatilgan: `0/0`, tugma `disabled`, status «Shartlarni bajaring — natija o'ngda ko'rinadi», title «Barcha shartlar bajarilsa ochiladi» — bajaradigan shart yo'q, boshi berk ko'cha
- Dalil: t-contract-1-props.mjs → `B reqs=[]: 0/0 nextDisabled= true …`, `C no reqs: 0/0 nextDisabled= true`
- Izoh: kontrakt-izohda (satr 11) requirements ixtiyoriymi-majburiymi aytilmagan.

### K-K-02 · Takror fayl nomlari → React key-xato, ikkala tab «active», birinchi fayl yo'qoladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:930 (`Object.fromEntries(files.map…)` — nom bo'yicha kalit), :1713–1721 (`key={f.name}`)
- Qanday takrorlash: `files:[{name:'a.html',lang:'html',starter:'ONE'},{name:'a.html',lang:'css',starter:'TWO'}]`
- Kutilgan: kontrakt-darajasida ogohlantirish yoki noyoblashtirish · Kuzatilgan: konsolda `Encountered two children with the same key`, tabs `['a.html','a.html']`, ikkala tab `.active` (2 ta), kod = `TWO` (ONE yo'q), tab bosilsa o'zgarmaydi
- Dalil: t-contract-1-props.mjs → `E dup names …`, `E after click tab2: code="TWO" active=2`
- Izoh: fayl nomi = ichki identifikator; hujjatda «nomlar noyob bo'lsin» sharti yozilmagan.

### K-K-03 · `lang` noto'g'ri qiymat (`'en'`, `'RU'`) jimgina `uz`ga tushadi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:914 (`__lang = (lang === 'ru' ? 'ru' : 'uz')`)
- Qanday takrorlash: `mountHC({lang:'en'})`, `mountHC({lang:'RU'})`
- Kutilgan: LMS noto'g'ri kod bersa — hech bo'lmasa konsol-ogohlantirish · Kuzatilgan: jim uz (`'RU'` katta harf ham uz)
- Dalil: t-contract-1-props.mjs → `F lang=en: O'z sahifangizni quring`, `F lang=RU: O'z sahifangizni quring`

### K-K-04 · `starterCode` + `task.files` birga → `starterCode` jim e'tiborsiz; 4 PM darsda o'lik prop  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:923–928; src/3-Modull/PmLesson9.jsx:1816, src/4-Modull/PmLesson11.jsx:1761, src/4-Modull/PmLesson13.jsx:1813, src/4a-Modull/PmLesson15.jsx:1813 (`starterCode={code || KOD_STARTER}` + `KOD_TASK.files`)
- Qanday takrorlash: `mountHC({starterCode:'<p>STARTER</p>', task:{files:[{name:'index.html',lang:'html',starter:'<p>FILES</p>'}]}})`
- Kutilgan: hujjatda ustunlik yozilgan bo'lishi · Kuzatilgan: kod = `<p>FILES</p>` (files ustun); `files:[]` bo'lsa starterCode ustun
- Dalil: t-contract-1-props.mjs → `G starter+files: "<p>FILES</p>"`, `G2 starter+files=[]: "<p>STARTER</p>"`
- Izoh: PmLesson9/11/13/15 dagi `starterCode={code || …}` hech qachon ishlamaydi — dars-muallifi «lesson-level `code` starter bo'ladi» deb o'ylashi mumkin, aslida faqat storageKey-saqlov tiklaydi.

### K-K-05 · `task` har renderda YANGI obyekt + ota tez qayta-render → runtime-shartlar hech qachon yashil bo'lmaydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:918–921 (`useMemo(…,[task.requirements])`), :963–967 (`runtimeProbes` ← reqs), :992–1013 (effekt deps `runtimeProbes`, 300 ms setTimeout + cleanup)
- Qanday takrorlash: ota-komponent `task={{…, requirements:[…]}}` inline yozadi va o'zi 250 ms da qayta-render bo'ladi (jonli-sessiya polling, timer, input) — `t-contract-1b-inline.mjs`
- Kutilgan: shart bir marta tekshirilib yashil bo'ladi · Kuzatilgan: har renderda `reqs`→`runtimeProbes` yangi → effekt qayta → 300 ms taymer cleanup bilan o'chadi → yashirin iframe HECH qurilmaydi; chip 6 s davomida «ishga tushirilmoqda…»; 400 ms da — yashil, lekin oraliqda «natija kutilgancha emas» yolg'on-qizil miltillaydi; 1000 ms — normal. Sinxron shartlar (`C.has`) ta'sirlanmaydi
- Dalil: `rerender=250ms → yashil=false (6062ms), hintlar=["ishga tushirilmoqda…"]` · `rerender=400ms → yashil=true, hintlar=["ishga tushirilmoqda…","natija kutilgancha emas",""]` · nazorat (barqaror task, 250 ms) → yashil 438 ms
- Izoh: darslarda task modul-konstanta — hozir tegmaydi. LMS/tashqi integrator uchun «task obyekti barqaror (useMemo/const) bo'lsin» sharti kontraktda YO'Q (satr 1–30).

### K-K-06 · `task.files` unmount'siz almashsa — «arvoh fayl»: aktiv tab yo'q, yozilgan kod hech qayerga tushmaydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:950 (`useState(files[0].name)` — faqat init), :930 (`codes` faqat init), :1088 (`setActiveCode` eski `active`ga yozadi), :1746
- Qanday takrorlash: `mount({task:T1 (index.html)})` → `rerender({task:T3 (app.js)})` (bir root, unmount yo'q) — `t-contract-3c.mjs`
- Kutilgan: yangi fayllar bilan qayta boshlanadi yoki hujjatda «task almashsa `key` bering» · Kuzatilgan: tabs `['app.js']`, `.hc-tab.active` = 0, textarea'da eski `<i>y</i>`, holat-qatori `index.html`, yozilgan `console.log(9)` preview'ga tushmaydi (`byLang('js')` = codes['app.js'] = starter)
- Dalil: `files almashdi (unmount yo'q): tabs=[app.js] active tab soni=0 kod="<i>y</i>" sb-file=index.html` · `yozildi → preview srcdoc ichida console.log(9)=false`
- Izoh: darslarda praktika→praktika o'tish `setPractice(null)` orqali (unmount) — hozir tegmaydi; LMS bitta mount'da topshiriqni almashtirsa buziladi.

### K-K-07 · `storageKey` runtime'da almashsa — eski kod yangi kalitga YOZILADI (boshqa saqlovni ustidan bosadi)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:930–939 (o'qish faqat init), :944–948 (`useEffect([codes, storageKey])` — kalit o'zgarsa darhol yozadi)
- Qanday takrorlash: `kA={A-KOD}`, `kB={B-KOD}` saqlangan; `mount({storageKey:'kA'})` → `rerender({storageKey:'kB'})` (unmount yo'q) — `t-contract-2b.mjs`
- Kutilgan: kB'dagi kod o'qiladi yoki hech bo'lmasa kB buzilmaydi · Kuzatilgan: muharrirda `A-KOD` qoladi, 400 ms dan keyin `kB = {codes:{index.html:'A-KOD'}}` — B-KOD YO'QOLDI
- Dalil: `8 storageKey kA→kB (haqiqiy rerender, renders=1) → kod="A-KOD" kB={"codes":{"index.html":"A-KOD"}…}`
- Izoh: K-K-06 bilan bir ildiz (mount-vaqtidagi proplar «muzlaydi», lekin yozuv-effekt jonli).

### K-K-08 · Starter/topshiriq o'zgarsa (dars yangilansa) eski saqlov ustun — o'quvchi eskirgan kodni ko'radi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:930–939 (faqat fayl-NOMLARI solishtiriladi; starter/requirements/versiya solishtirilmaydi)
- Qanday takrorlash: `storageKey:'k1', starterCode:'<p>S1</p>'` bilan yoz → unmount → `starterCode:'<p>S2-YANGI</p>'` bilan mount
- Kutilgan: hujjat izohi (satr 928–929) «topshiriq o'zgargan bo'lsa saqlov e'tiborsiz» deydi — starter ham «topshiriq»ning qismi · Kuzatilgan: kod = `<h1>yozdim</h1>` (eski); o'quvchi bir harf ham yozmagan bo'lsa ham starter saqlanadi (K-K-21 bilan birga: uz-starter → ru'da ochilsa uz-starter chiqadi)
- Dalil: t-contract-2-storage.mjs → `2 starter o'zgardi → kod="<h1>yozdim</h1>"`; t-contract-3-lang.mjs → `C uz saqlandi → ru ochildi → kod="UZ-S"`
- Izoh: PM darslarda starter = butun kontent (`[KIM]/[MUAMMO]` shablon) va kalitda versiya yo'q (`pm-m1d2-koding:code`) — shablon matni tuzatilsa eski o'quvchilar eskisini ko'radi. Texnik darslarda kalit `lessonId` versiyali (`html-01-v17`) — versiya ko'tarilsa eski kod BUTUNLAY tashlanadi (teskari muammo, K-K-15).

### K-K-09 · `savedAt` yoziladi, lekin HECH QAYERDA o'qilmaydi — TTL yo'q, 3 oylik kod tiklanadi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:66 (yozish), :930–939 (o'qishda ishlatilmaydi) — `savedAt` manbada 1 marta
- Qanday takrorlash: `localStorage.k4 = {codes:{index.html:'ESKI-3-OY'}, savedAt: Date.now()-90 kun}` → mount
- Kutilgan: hujjatda TTL-siyosat (yoki «cheksiz» deb aytilishi) · Kuzatilgan: `ESKI-3-OY` tiklanadi
- Dalil: `4 savedAt 3 oy → kod="ESKI-3-OY"`

### K-K-10 · Saqlovda kod qiymati string bo'lmasa (raqam/obyekt) → butun kompilyator OQ EKRAN (ErrorBoundary yo'q)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:65 (`codesRead` faqat tashqi obyektni tekshiradi), :939 (`{...fresh, ...s.codes}` — qiymat turi tekshirilmaydi), keyin `.match is not a function` (highlight/lint)
- Qanday takrorlash: `localStorage.k6 = {codes:{index.html:123}}` yoki `{codes:{index.html:{a:1}}}` → mount
- Kutilgan: yaroqsiz qiymat → starter · Kuzatilgan: `PAGEERROR (codes[active] ?? "").match is not a function`, React: «An error occurred in the <HtmlCompiler> component. Consider adding an error boundary», `.hc-root` chizilmaydi; `null` qiymat esa `''` bo'lib o'tadi
- Dalil: t-contract-2-storage.mjs → `4b k6 → CRASH …`, `4b k8 → CRASH …`, `4b k7 → kod=""`
- Izoh: `src/` da birorta ErrorBoundary yo'q (`componentDidCatch|getDerivedStateFromError` grep = 0) — kompilyator qulasa butun dars/App oq ekran, va reload ham yordam bermaydi (saqlov buzuq qolaveradi). Ehtimoli past (kalitni faqat kompilyator yozadi), zarari yuqori.

### K-K-11 · 400 ms debounce: yozib 100 ms ichida unmount → oxirgi belgilar yo'qoladi (unmount'da flush yo'q)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:944–948 (`setTimeout(…,400)` + cleanup `clearTimeout` — unmount'da yozmasdan bekor qiladi); `pagehide/beforeunload` ishlovchisi yo'q
- Qanday takrorlash: `<h1>abc</h1>` yoz → 600 ms kut → `XYZ` yoz → 100 ms → unmount (LMS'da «Nazad»/tab yopish tez bosilsa)
- Kutilgan: 102-qonun (F-0801-01) — «yozilgan kod yo'qolmasin» · Kuzatilgan: saqlov `{"index.html":"<h1>abc</h1>"}` — `XYZ` yo'q
- Dalil: `6 debounce 100ms → saqlov= {…"<h1>abc</h1>"…}`; `7b Qaytadan+100ms unmount` — teskari tomoni: «Qaytadan» ham 400 ms ichida unmount bo'lsa eski kod qoladi (nomuvofiq xulq)

### K-K-12 · `hcFont`/`hcSplit` — nomsiz global kalitlar, `storageKey` bo'lmasa ham yoziladi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1158–1175
- Qanday takrorlash: `mountHC({task:{requirements:[]}})` (storageKey yo'q) → `Object.keys(localStorage)`
- Kutilgan: LMS localStorage'ida modul-prefiks (`hc:`) yoki hujjatlashtirilgan · Kuzatilgan: `["hcSplit","hcFont"]` — LMS bilan bir nom-makonda; ikki xil sayt/LMS bir domenda bo'lsa to'qnashadi
- Dalil: `9 storageKey yo'q → ls= {"hcSplit":"0.5","hcFont":"14"}`

### K-K-13 · Bir sahifada ikki kompilyator — runtime-hisobot va konsol-satrlar ARALASHADI (nonce nusxa-identifikatorsiz)  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1016–1039 (`d.nonce === nonceRef.current` — har nusxada 1 dan boshlanadi; `e.source`/`e.origin` tekshirilmaydi), :779–793, :795–847
- Qanday takrorlash: `mountAt('A', logs('7'), starter console.log(1))` + `mountAt('B', …, starter console.log(7))` — `t-contract-3d.mjs`
- Kutilgan: A qizil, B yashil · Kuzatilgan: A ham YASHIL (B iframe'ining hisoboti nonce=1 bilan A'ga tushdi); A konsolida `›1, ›7` (B'ning satri); keyin nonce'lar farqlansa to'g'rilanadi
- Dalil: `A (log 1 — qizil kutiladi): [{"ok":true…}]`, `A console: ["›1","›7"]`
- Izoh: hozirgi darslarda bir vaqtda faqat bitta nusxa (overlay). LMS bir sahifada 2+ nusxa ochsa (masalan «ro'yxat»/«solishtirish») noto'g'ri «Davom etish».

### K-K-14 · O'quvchi kodi runtime-hisobotni SOXTALASHTIRA oladi → hamma chip yashil, «Davom etish» ochiladi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1016–1027 (`__hcReport` — `e.source`/`origin`/imzo tekshiruvi yo'q; nonce o'quvchi kodi bilan bir iframe'da, harnessga qadar `${js}` yuklanadi (satr 900–902))
- Qanday takrorlash: `app.js`: `setTimeout(()=>{for(let n=1;n<50;n++)parent.postMessage({__hcReport:true,nonce:n,results:{l:true,e:true}},'*')},600)` — `t-contract-4b-spoof.mjs`
- Kutilgan: shartlar `logs('7')`, `evalEquals('x','1')` bajarilmagan → qizil · Kuzatilgan: ikkalasi ✓ yashil, `nextDisabled=false` (haqiqiy harness-hisobotdan 600 ms keyin ustidan yozdi; kechikmasdan yuborilsa harness ustun keladi)
- Dalil: `spoof (log 7 yo'q, x yo'q): [{"ok":true…},{"ok":true…}] nextDisabled= false`
- Izoh: sinxron shartlar (`C.has`, `C.js`) DOMParser'da — soxtalab bo'lmaydi. Jonli-sessiyada `done()` → `live.submitAnswer(…, true)` — «bajardim» signali halol emas bo'lib qolishi mumkin. Test-halollik tamoyili nuqtai nazaridan hisobga olinsin.

### K-K-15 · Texnik darslarda kalit `lessonId` versiyali → versiya ko'tarilsa saqlov yetim qoladi (o'quvchi kodi «yo'qoladi», localStorage o'sadi)  ·  Og'irlik: 🔵 taklif
- Qayer: src/1-Modull/Htmllesson1.jsx:80 (`ccCode:${lessonId}:${kind}`), lessonId `html-01-v17` (…v16, v18 tarixiy); kompilyatorda tozalash/migratsiya yo'q
- Qanday takrorlash: statik (grep) — `git log` bo'yicha lessonId'lar v16→v17→v18 o'zgargan
- Kutilgan: kalit-siyosat hujjatda · Kuzatilgan: har versiya-o'zgarishda `ccCode:*-vN:*` kalitlari qoladi va o'qilmaydi
- Dalil: `codeKeyOf` grep — 18 darsda bir xil naqsh; kompilyatorda faqat `codesRead/codesWrite` (o'chirish yo'q)

### K-K-16 · `onPractice(entry.task)` LMS-yo'li starter/lang/storageKey'siz — kontrakt yarim uzatiladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/1-Modull/Htmllesson1.jsx:3324, :3334; JsVarsLesson.jsx:2728,2736; jami 15 darsda (`grep onPractice(`) — DARS_ETALON.md:545 naqshi
- Qanday takrorlash: statik — `Promise.resolve(onPractice(entry.task))` faqat `task`ni beradi; `entry.starter` (Htmllesson1/2, HtmlTakrorlash, HtmlPractice — `starterCode`-rejim, `{uz,ru}` obyekt), `codeKeyOf(...)`, `__lang` uzatilmaydi
- Kutilgan: LMS ham `<HtmlCompiler task starterCode storageKey lang>` to'liq kontrakt bilan ochadi · Kuzatilgan: LMS starter/til/saqlov-kalitni o'zi topib olishi kerak; hozir starterlar asosan `<!-- Bu yerga yozing -->` (zarar kichik), lekin `files`siz darslar uchun starter YO'QOLADI
- Dalil: t-contract audit-skript (`onPractice-yo'li` ustuni) + Htmllesson1.jsx:3095 `STARTER_HEADINGS = {uz:…, ru:…}` task'dan tashqarida
- Izoh: `App.jsx` `onPractice` bermaydi (grep=0) — bu yo'l hozir o'lik; LMS TZ (shared-modul) darsning O'ZI `<HtmlCompiler>` chizishini nazarda tutadi. Ikki integratsiya-yo'li bir vaqtda mavjud — kontrakt-hujjatda qaysi biri amalda ekani aytilmagan.

### K-K-17 · PmLesson9/11/13/15 — `lang="uz"` qattiq yozilgan  ·  Og'irlik: 🔵 taklif
- Qayer: src/3-Modull/PmLesson9.jsx:1816, src/4-Modull/PmLesson11.jsx:1761, src/4-Modull/PmLesson13.jsx:1813, src/4a-Modull/PmLesson15.jsx:1813
- Qanday takrorlash: statik (grep) — bu darslar hozir uz-only (`ru:` = 0), shuning uchun HOZIR xato emas
- Kutilgan: `lang={__lang}` yagona naqsh (18 boshqa darsdagidek) · Kuzatilgan: dars ruslashtirilganda kompilyator uz qolib ketadi (RU i18n konvensiyasi bo'yicha «PmLesson1/2 navbatda» — shu darslar ham navbatda bo'lsa xato bo'ladi)

### K-K-18 · MentorPracticeOverlay demo — storageKey yo'q: watch↔demo almashsa mentor kodi o'chadi  ·  Og'irlik: 🔵 taklif
- Qayer: src/1-Modull/Htmllesson1.jsx:926 (va 17 darsda xuddi shu qator)
- Qanday takrorlash: mentor «Doskada yozib ko'rsatish» → yozadi → «Orqaga» (watch) → yana «demo»
- Kutilgan: ataylab bo'lsa — izohda aytilsin · Kuzatilgan: kompilyator unmount → starter'dan boshlanadi (K-K-11 bilan bog'liq emas — kalit umuman yo'q)

### K-K-19 · Modul-global `__lang`: ikki nusxa bir sahifada — RU nusxaning tugma-xabari UZ chiqadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:33 (`let __lang`), :914 (render'da o'rnatiladi), :1571–1577 (`prettify` → `note(tr(...))` — event-handler'da `tr`)
- Qanday takrorlash: A(uz), B(ru); B'ga yoz; A'ga yoz (A oxirgi render → `__lang='uz'`); B'ning ✨ tugmasi (`onMouseDown preventDefault` — B render bo'lmaydi) — `t-contract-3b.mjs`
- Kutilgan: «Код уже аккуратный 👍» · Kuzatilgan: «Kod allaqachon chiroyli 👍» (uz) RU kompilyatorda
- Dalil: `B(ru) ✨ note matni: "Kod allaqachon chiroyli 👍"`
- Izoh: render-vaqtidagi `tr` to'g'ri; faqat renderdan tashqari (handler/timer) `tr` xavfli. Kontrakt-izoh (satr 20–22) «modul-darajali __lang» naqshini «darslardagi bilan bir xil» deb oqlaydi — lekin darsda bitta til, bu yerda nusxa-boshiga til.

### K-K-20 · `lang` runtime'da almashsa — chip-maslahatlar (hint) ESKI tilda qoladi (kod o'zgarmaguncha)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1042–1052 (`results = useMemo(…,[html,css,js,reqs])` — `lang` deps'da yo'q; `checks.*` maslahat matnini tekshiruv paytida `tr()` qiladi)
- Qanday takrorlash: barqaror `task`, `mount({lang:'uz'})` → `rerender({lang:'ru'})`, kod tegilmagan — `t-contract-3c.mjs`
- Kutilgan: hamma matn ru · Kuzatilgan: sarlavha/label/status ru, lekin hint `"\`h1\` topilmadi"`, `P-UZ` (uz); kod o'zgargach ru
- Dalil: `ru rerender (task barqaror, kod o'zgarmagan) → chips: […hint:"\`h1\` topilmadi"…,"P-UZ"]`

### K-K-21 · `lang` almashsa — starter-kod eski tilda qoladi (`useState(() => tr(f.starter))` bir marta)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:930–931
- Qanday takrorlash: `mount({lang:'uz', starter:{uz,ru}})` → `rerender({lang:'ru'})` — `t-contract-3-lang.mjs`
- Kutilgan: o'quvchi tegmagan bo'lsa ru-starter · Kuzatilgan: `<!-- UZ starter -->` qoladi; «Qaytadan» bosilsa ru-starter (handler-vaqtidagi `tr` yangi tilni oladi)
- Dalil: `rerender ru → code:"<!-- UZ starter -->"`, `ru rejimda Qaytadan → kod="<!-- RU starter -->"`
- Izoh: PmLesson1 izohi (satr 1937–1939) buni biladi va IKKALA til-belgisini qidiradi (UNION-check) — ya'ni muammo darsda «aylanib o'tilgan», kompilyatorda hal etilmagan; boshqa darslar aylanib o'tmagan.

### K-K-22 · `previewCss` runtime'da o'zgarsa preview yangilanmaydi (effekt deps'da yo'q)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:978 (`mkDoc` `task.previewCss`ni yopib oladi), :992–1013 (deps: `[sig, html, css, js, hasRuntime, runtimeProbes, manualRun]`)
- Qanday takrorlash: `rerender({task:{...T, previewCss:'body{background:blue}'}})` — `t-contract-3c.mjs`
- Kutilgan: yangi uslub · Kuzatilgan: `blue=false`; kod o'zgargach `blue=true`
- Dalil: `previewCss red→blue rerender: oldin red=true keyin blue=false / kod o'zgargach blue=true`

### K-K-23 · SSR/DOM'siz render — `DOMParser is not defined` (module import OK, render emas)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1043 (`new DOMParser()` render ichida, guard'siz), :541–545 (`parseCss` → `document`), :1 (`useLayoutEffect` — SSR ogohlantirish)
- Qanday takrorlash: Node: `renderToString(createElement(default,{lang:'ru'}))`
- Kutilgan: LMS SSR/pre-render qilmasa muammo emas — lekin kontraktda «faqat brauzer» sharti yozilsin · Kuzatilgan: `SSR CRASH: DOMParser is not defined`; `import` o'zi muvaffaqiyatli (top-level DOM yo'q)
- Dalil: `_ssr.mjs` (vaqtinchalik) → `node import OK; exports: [HC_NASHR, checks, default, formatHtml, highlight]` · `SSR CRASH: DOMParser is not defined`

### K-K-24 · Modul ichida `@import fonts.googleapis.com` — har mount'da tashqi tarmoq-so'rov  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1920 (`StyleTag` → `@import url('https://fonts.googleapis.com/…')`); lms/html-compiler.jsx (1 marta)
- Qanday takrorlash: statik (grep) — `fonts.googleapis`
- Kutilgan: LMS TZ «modul o'zini o'zi ta'minlaydi (faqat react)» — shrift ham shu ruhda hujjatlashtirilsin/CSP'da ruxsat · Kuzatilgan: oflayn/CSP-bloklangan LMS'da xato yo'q, lekin shrift Manrope/JetBrains → tizim; StyleTag har nusxada 20 KB `<style>` qo'shadi (o'lchamning 21%: 20 424 / 96 180 bayt)
- Izoh: modul o'lchami: 96 KB — CSS 20.4 KB, TAG/ATTR/SNIPPET menyular 2.9 KB, DEFAULT_TASK 1.1 KB, izohlar deyarli olib tashlangan (35 satr). O'lik top-level kod topilmadi; `HC_CODE.gutter` kaliti ishlatilmaydi (1 satr).

### K-K-25 · `check` throw qilsa — chip abadiy qizil, xato JIM yutiladi (konsolga chiqmaydi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:737–760 (`catch {}` — `console.error`/`warn` yo'q)
- Qanday takrorlash: `requirements:[{id:'x',label:'x',check:()=>{throw new Error('boom')}}]`
- Kutilgan: qulamasin ✓ + dars-muallifi xatoni ko'rsin · Kuzatilgan: hint «tekshirishda xatolik», konsol toza — muallif nima buzilganini bilmaydi; o'quvchi shartni hech qachon bajarolmaydi
- Dalil: t-contract-4-errors.mjs → `1 check throw: OK … hint:"tekshirishda xatolik" log=[]`

### K-K-26 · `requirements`/`files`/`task` yaroqsiz shakl → ErrorBoundary'siz OQ EKRAN  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:919 (`normalizeReq(null)` → `req.check`), :919 (`.map` massiv-bo'lmaganda), :906 (`task=null` — default faqat `undefined`ga ishlaydi), :930 (`files:[null]` → `f.name`)
- Qanday takrorlash: `task:null` · `requirements:[null]` · `requirements:{a:1}` · `requirements:'h1'` · `files:[null]`
- Kutilgan: yaroqsiz kirish → yiqilmaslik yoki aniq xato · Kuzatilgan: 5 holatning hammasi `PAGEERROR … Cannot read properties of null / .map is not a function` + React «Consider adding an error boundary», `.hc-root` chizilmaydi
- Dalil: t-contract-4-errors.mjs → `3 requirements[0]=null: CRASH`, `3b`, `3c`, `4 task=null: CRASH`, `5d files=[null]: CRASH`
- Izoh: LMS'da task JSON/DB'dan kelsa `null` ehtimoli real. `task='x'` (string) esa yiqilmaydi (0/0).

### K-K-27 · `check` qaytargan `{uz,ru}`/JSX/`1`/Promise — maslahat YO'QOLADI yoki hech qachon yashil bo'lmaydi (kontrakt qat'iy, hujjatda aytilmagan)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:746–749 (`r === true` qat'iy; `typeof r === 'string' ? r : tr(req.hint)`), :414 (`custom: (fn) => fn` — izoh «true | "maslahat"»)
- Qanday takrorlash: `check:()=>({uz:'UZ',ru:'RU'})` · `()=>h('b',null,'JSX')` · `()=>1` · `async()=>true`
- Kutilgan: hujjatlashtirilgan xulq · Kuzatilgan: obyekt/JSX → hint `""` (yo'qoldi, `req.hint` ham yo'q); `1` → qizil, hintsiz; Promise → abadiy qizil. `hint:{uz,ru}` + `check:()=>false` esa to'g'ri (`RU-H`) ✓; takror `id` (`l`,`l`) → runtime natija ustma-ust: bajarilgan shart ham qizil + key-xato ×4
- Dalil: t-contract-4-errors.mjs `7, 7c, 7d, 7e`; t-contract-4c-dupid.mjs → `chips=[…"1log 7" ok:false…]`
- Izoh: darslardagi 7 ta `C.custom` hammasi string qaytaradi (VsCode/PM — `tr(...)` bilan) — hozir tegmaydi; keyingi dars-mualliflari uchun kontrakt-band kerak.

---
Yakun: 27 topilma — 🔴 0 · 🟠 8 (K-K-05, 06, 07, 10, 11, 13, 14, 26) · 🟡 9 (K-K-01, 02, 08, 16, 19, 20, 21, 25, 27) · 🔵 10 (K-K-03, 04, 09, 12, 15, 17, 18, 22, 23, 24). Yechim taklif qilinmadi (faqat tashxis).
