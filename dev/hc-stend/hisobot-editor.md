# HtmlCompiler — KOD-MUHARRIR qatlami sinov-hisoboti

- Sana: 2026-08-17 · Manba: `src/compilator/HtmlCompiler.jsx` (2155 satr) · Stend: `dev/hc-stend/` (React 19, esbuild-bundle, Chrome headless, playwright-core)
- Rejim: kod o'qildi + har holat haqiqiy brauzerda bajarildi; har topilma kamida 2 marta takrorlandi (skript qayta yurgizilib).
- Skriptlar: `t-lib.mjs` (yordamchi), `t-editor-1-hl.mjs`, `t-editor-1b-scrollbar.mjs`, `t-editor-1c-misalign.mjs`, `t-editor-2-menu.mjs`, `t-editor-2b.mjs`, `t-editor-3-keys.mjs`, `t-editor-3b-undo.mjs`, `t-editor-4-fmt.mjs`, `t-editor-4b.mjs`, `t-editor-5-tabs.mjs`, `t-editor-6-touch.mjs`, `t-editor-6b.mjs`, `t-editor-6c.mjs`, `t-editor-6d.mjs`, `t-editor-7-a11y.mjs`, `t-editor-7b.mjs`, `t-editor-8-misc.mjs`, `t-editor-8b-perf.mjs`, `t-editor-9-jsgt.mjs`, `t-editor-10.mjs`. Sensor-sinov uchun `t-mobile.html` (stend `index.html`da `<meta viewport>` yo'q edi — telefon emulyatsiyasi 980px layout berardi; real ilovada meta bor deb hisoblandi).
- Eslatma: stend oflayn — Google Fonts (JetBrains Mono) yuklanmadi, tizim monoshrifti ishladi. Textarea va rang-qatlam bir xil shriftda bo'lgani uchun tekislik-o'lchovlariga ta'sir qilmaydi.

## Jadval

| Og'irlik | Soni | ID'lar |
|---|---|---|
| 🔴 kritik | 1 | K-E-01 |
| 🟠 muhim | 5 | K-E-02 … K-E-06 |
| 🟡 mayda | 16 | K-E-07 … K-E-22 |
| 🔵 taklif | 3 | K-E-23 … K-E-25 |
| **Jami** | **25** | |

## Nima sinaldi (to'liq manzara)

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

## Topilmalar

### K-E-01 · Fayl-tablar (index.html / style.css / script.js) tor panelda ko'rinmaydi va bosib bo'lmaydi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1972 (`.hc-tabs{display:flex;gap:4px;overflow:hidden}` — min-width yo'q, flex-shrink standart), 1711–1734 (bar tarkibi: dots + tabs + tools + «Ishga tushirish»)
- Qanday takrorlash: 3 faylli task (`files: index.html/style.css/script.js`) bilan mount → oyna eni 1024px (yoki 1366px), yoki 1400px'da chegarani 30% ga sudrash, yoki telefon 390–430px.
- Kutilgan: uch tab ham ko'rinadi (yoki gorizontal suriladi) · Kuzatilgan: 390/430px — `.hc-tabs` eni 0/32px, uchala tab ham yashirin; 600px — faqat index.html; 1024px — hammasi yashirin (tabs 96px, birinchi tab 106px kerak); 1100 — 1 ta; 1280/1366 — 2 ta, `script.js` «script.» bo'lib qirqiladi; 1400px + split 30% — hammasi yashirin. Bir faylli darsda ham telefonda «index.html» yozuvi yo'qoladi.
- Dalil: `t-editor-6b.mjs`, `t-editor-6c.mjs` chiqishi (`{"tabsW":0,"vis":[false,false,false]}` @390; `@1024 vis:[false,false,false]`), skrinshotlar `e6e-phone-3files.png`, `e6f-desktop-split30.png`, `e6g-1366-tabs.png`
- Izoh: Ko'p faylli (CSS/JS) darslarda o'quvchi telefon/planshet yoki 1024–1100px noutbukda style.css/script.js'ga umuman o'ta olmaydi — shartlar bajarilmaydi. Tor panelda «Ishga tushirish» va ↶↷✨ tugmalari joyni oladi, tablar esa 0 gacha qisiladi.

### K-E-02 · Gorizontal scrollbar bo'lganda pastki qatorlarda rang-qatlam, gutter va joriy-qator chizig'i 15px siljiydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1988–1991 (`.hc-hl` overflow:hidden, `.hc-code` overflow:auto), 1210–1215 (`syncScroll` faqat scrollTop nusxalaydi), 1135–1145 (`updateCurLine` textarea scrollTop bilan)
- Qanday takrorlash: 40 qator yozing, 1-qatorni ekrandan uzunroq qiling (`<p>` ichida uzun matn — o'quvchida tez-tez); sichqoncha g'ildiragi bilan ENG PASTGA suring.
- Kutilgan: matn (kursor) va rangli harflar ustma-ust · Kuzatilgan: textarea gorizontal scrollbar tufayli 15px pastroq (clientHeight 469 vs 484), maks scrollTop 519, `.hc-hl` va gutter esa faqat 504 gacha suriladi → oxirgi ~15 qatorda rangli harflar va qator-raqamlari haqiqiy matndan 15px pastda; joriy-qator chizig'i ikki raqam orasida; holat-satri «Qator 60», gutter esa kursor yonida 59 ni ko'rsatadi.
- Dalil: `t-editor-1b-scrollbar.mjs` («bottom: st ta/hl/gut 991 980 980»), `t-editor-1c-misalign.mjs` («519 504 504»), skrinshot `e1k-misalign-crop.png` (textarea matni oq rangda ochib ko'rsatilgan — ikki qatlam 15px farq bilan), `e1k-caret-end.png`.
- Izoh: Muharrirning bosh va'dasi — «harflar kursordan siljimaydi» — buziladi; o'quvchi bosgan joyi bilan ko'rgan harfi bir xil emas, xato-qatorni sanashi buziladi. Uzun `<p>` matni + pastga surish — 1-modulda oddiy holat.

### K-E-03 · «Chiroyli» inline teglarni alohida qatorga chiqarib, ko'rinadigan bo'shliq qo'shadi — natija (preview) o'zgaradi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:263–286 (har teg/matn tuguni alohida qatorga), 250–253 (`domFingerprint` bo'shliqni normallashtiradi — shuning uchun tutmaydi), 205–207 (kontrakt: «MA'NOGA TEGMAYDI»)
- Qanday takrorlash: `<p>Salom <b>dunyo</b>. Keyingi gap <a href="#">link</a>!</p>` yozing → «✨ Chiroyli».
- Kutilgan: qisqa xatboshi bir qatorda qoladi yoki natija o'zgarmaydi · Kuzatilgan: 7 qatorga bo'linadi (`Salom` / `<b>dunyo</b>` / `. Keyingi gap` / `<a…>link</a>` / `!`), preview matni «Salom dunyo. Keyingi gap link!» → «Salom dunyo . Keyingi gap link !» (nuqta va undov oldida bo'shliq paydo bo'ldi). `<p>a<br>b</p>` ham 5 qatorga.
- Dalil: `t-editor-4b.mjs` («src render: "Salom dunyo. Keyingi gap link!"» vs «preview after fmt: "Salom dunyo . Keyingi gap link !"»), skrinshot `e4-inline-format.png`.
- Izoh: O'quvchi «chiroyli» tugmasini bosib, sahifasida tinish belgilaridan oldin bo'shliq paydo bo'lganini ko'radi va sababini tushunmaydi; kontraktdagi «ma'noga tegmaydi» kafolati ko'rinishga nisbatan bajarilmaydi. Oddiy gapli `<p>` 5–7 qatorga aylanishi ham 13 yoshli uchun «chiroyli» emas.

### K-E-04 · JS (va CSS) faylida ham HTML avto-yopish ishlaydi: `if (i<len && j>` → `</len>` tushadi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1476–1503 (`e.key === '>'` bloki `activeLang` bilan chegaralanmagan; `"`-blok 1508 da esa `activeLang==='html'` sharti bor)
- Qanday takrorlash: 3-faylli task, `script.js` tabida yozing: `if (i<len && j>`.
- Kutilgan: faqat `>` · Kuzatilgan: `if (i<len && j></len>)` — kursor `>` dan keyin, orqasida `</len>` paydo bo'ldi. `if (a<b) { c>` → `c>}` (qavs juftligi bilan birga). CSS `ul>li{` — o'tdi (`<` yo'q).
- Dalil: `t-editor-9-jsgt.mjs` chiqishi.
- Izoh: JS darslarida `a<b && c>d` shakl tez uchraydi; o'quvchi HTML tegini ko'rib chalg'iydi, sintaksis xato chiqadi.

### K-E-05 · Tanlangan matn ustida Tab — tanlov O'CHIB, o'rniga 2 probel qoladi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1429–1456 (`put(el,'  ',s+2)` tanlovni tekshirmaydi)
- Qanday takrorlash: `a\nb\nc` yozing → Ctrl+A → Tab.
- Kutilgan: qatorlar chekintiriladi (VS Code odati) yoki hech narsa · Kuzatilgan: butun kod o'chib, `"  "` qoladi (Ctrl+Z qaytaradi, lekin o'quvchi buni bilmasa — vahima).
- Dalil: `t-editor-3-keys.mjs` («3a Tab with selection: {"s":2,"e":2,"v":"  "}»).
- Izoh: «Hammasini belgilab, chekintiraman» — tabiiy harakat; natijada kod «yo'qoladi».

### K-E-06 · Juft-teg qayta nomlashdan keyin Ctrl+Z bir qadamda faqat yopuvchini qaytaradi — `<h2>…</h>` nomuvofiq holat, kursor yopuvchi tegga sakraydi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1328–1360 (`maybeLinkedRename` alohida `insertText` — alohida undo-qadam)
- Qanday takrorlash: `<h1>Salom</h1>`, kursor `1` dan keyin, Backspace, `2` yozing (→ `<h2>Salom</h2>`), Ctrl+Z.
- Kutilgan: `<h1>Salom</h1>` (yoki hech bo'lmasa juft mos holat) · Kuzatilgan: 1-Ctrl+Z → `<h2>Salom</h>` (yopuvchi teg tanlangan holda, kursor oxirga sakraydi); 2-Ctrl+Z → `<h>Salom</h>`; ya'ni har qadamda nomuvofiq juft.
- Dalil: `t-editor-3-keys.mjs` («3c Ctrl+Z after rename: {"s":9,"e":13,"v":"<h2>Salom</h>"}»).
- Izoh: Ctrl+Z bosgan bola linter xatosi + kursor sakrashini ko'radi; «bekor qilish» ishonchsiz tuyuladi.

### K-E-07 · Menyu ochiq holda Shift+Enter (yoki `<p ` + Enter) → yangi qatordan keyin atribut-menyu darrov ochiladi, keyingi Enter `class=""` qo'yadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1277 (`mAttr` regex'ida `\s` yangi qatorga ham mos keladi), 1390 (Shift+Enter «chiqish yo'li» izohi)
- Qanday takrorlash: bo'sh muharrir → `<p` → Shift+Enter → Enter.
- Kutilgan: ikki yangi qator · Kuzatilgan: Shift+Enter dan keyin `class`/`id` menyusi ochiq; Enter → `<p\nclass=""`. `<p ` + Enter → `<p class=""`.
- Dalil: `t-editor-2b.mjs` («2k after Shift+Enter menu: class,id», «then Enter: "<p\nclass=\"\""»).
- Izoh: «Chiqish yo'li» aslida boshqa menyuga olib kiradi; kam uchraydi, lekin double-action tuzog'i.

### K-E-08 · Ctrl+Z har bosishda faqat BITTA harfni qaytaradi (oddiy textarea so'z-guruhini qaytaradi)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1744–1764 (controlled `<textarea value=…>` + har harfda `setCaretPos`/`setCodes` re-render)
- Qanday takrorlash: `salom dunyo yaxshi` yozing (18 harf) → Ctrl+Z.
- Kutilgan: bir bosishda so'z/guruh qaytadi · Kuzatilgan: `salom dunyo yaxsh` (1 harf); sahifadagi oddiy `<textarea>`da bir Ctrl+Z hammasini qaytardi.
- Dalil: `t-editor-3b-undo.mjs` («typed 18 chars, Ctrl+Z x1 → "salom dunyo yaxsh"», «plain textarea Ctrl+Z x1 → ""»).
- Izoh: Xato gapni qaytarish uchun 18 marta bosish kerak; ↶ tugmasi ham xuddi shunday.

### K-E-09 · «Chiroyli» xabari noto'g'ri holatlarda «Avval sintaksis xatosini tuzating» deydi; tugallanmagan hujjatni esa formatlab yuboradi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1576 (null → bitta umumiy xabar), 256–257, 208 (izoh: «tugallanmagan teg … bo'lsa ham null»), 263–286 (yopilmagan `<div><p>a` formatlanadi)
- Qanday takrorlash: (a) bo'sh muharrir → ✨; (b) `<div><pre>a</pre></div>` → ✨; (c) `<p>1 < 2</p>` → ✨; (d) `<div><p>a` → ✨.
- Kutilgan: (a–c) sababga mos xabar (bo'sh / `<pre>` qo'llanmaydi / matndagi `<`), (d) null yoki xabar · Kuzatilgan: (a–c) hammasi «Avval sintaksis xatosini tuzating» — sintaksis xatosi yo'q; (d) `<div>\n  <p>\n    a` deb formatlandi.
- Dalil: `t-editor-4b.mjs` (pre/empty/lone< → «Avval sintaksis…»; unclosed → val `"<div>\n  <p>\n    a"`).
- Izoh: Bola bo'sh muharrirda «sintaksis xatosi» deb o'qib qidiradi; `1 < 2` matni brauzerda to'g'ri ishlaydi, lekin «xato» deyiladi.

### K-E-10 · «Chiroyli»dan keyin kursor va scroll hujjat boshiga ketadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1581 (`setSelectionRange(0,0)`)
- Qanday takrorlash: 50 ta `<div><p>…</p></div>` bir qatorda → kursor o'rtada → ✨.
- Kutilgan: kursor taxminan o'sha joyda · Kuzatilgan: kursor 0, scrollTop 0 (150 qatorli hujjat boshiga).
- Dalil: `t-editor-4-fmt.mjs` («4u after format long: {"st":0,"s":0,"lines":150}», «4u caret after fmt: s:0»).
- Izoh: Uzun kodda yozayotgan joyini qayta topishi kerak.

### K-E-11 · «Chiroyli» bo'sh juftni ikki qatorga bo'ladi: `<p></p>` → `<p>\n</p>`  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:275–283 (bir qatorda qoldirish sharti `a.t==='text'` talab qiladi — bo'sh juftda text tuguni yo'q)
- Qanday takrorlash: menyu orqali `<p></p>` va `<div></div>` qo'ying → ✨.
- Kutilgan: `<p></p>` bir qatorda · Kuzatilgan: `<p>\n</p>\n<div>\n</div>`.
- Dalil: `t-editor-4-fmt.mjs` («emptyp → "<p>\n</p>\n<div>\n</div>"»).
- Izoh: Menyu bilan endigina qo'yilgan juft «buzilib» ko'rinadi.

### K-E-12 · Ustun raqami va menyu x-o'rni UTF-16/monoshrift taxminiga tayanadi: emoji va tab belgisi noto'g'ri sanaladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1152–1155 (`col = before.length - lastIndexOf('\n')`), 1235–1238 (`col * cw`)
- Qanday takrorlash: `<p>😀 a</p>` — kursor emojidan keyin; `\t\t\t\tx` — oxirida; `<p>😀😀😀😀😀😀 <`.
- Kutilgan: Ustun 5 / Ustun 9 (tab-size 2) / menyu kursor ostida · Kuzatilgan: «Ustun 6» (emoji 2 birlik), «Ustun 3» (4 ta tab 4 ustun deb), menyu emoji satrida 14px chapda, 4 tabdan keyin 34px chapda; ZWJ-emoji satrida «Ustun 26» (ko'rinishi ~18).
- Dalil: `t-editor-7-a11y.mjs` (7a), `t-editor-8-misc.mjs` (8b: `menuX 155 / caretX 169`, `54 / 88`), skrinshot `e8b-menu-x.png`.
- Izoh: Xato-xabari «Qator N» ni ko'rsatadi (ustun emas), shuning uchun ta'sir kichik; menyu siljishi ko'zga tashlanadi.

### K-E-13 · Teg nomi to'liq o'chirilib qayta yozilsa juft yangilanmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1334–1337 (`mo` eski nomni topolmasa — chiqadi)
- Qanday takrorlash: `<p>a</p>`, kursor `p` dan keyin, Backspace (`<>a</p>`), `h1` yozing.
- Kutilgan: `<h1>a</h1>` · Kuzatilgan: `<h1>a</p>`.
- Dalil: `t-editor-3-keys.mjs` («3f retype h1: "<h1>a</p>"»).
- Izoh: «Nomni o'chirib qaytadan yozish» — bola uchun eng tabiiy tahrir yo'li; natijada linter xatosi.

### K-E-14 · Katta harfli teg `<P>` → `<P></p>` aralash registr  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1498–1502 (`name` lowercase qilinib juftga yoziladi)
- Qanday takrorlash: `<P>` yozing.
- Kutilgan: `<P></P>` (yoki ikkalasi kichik) · Kuzatilgan: `<P></p>`.
- Dalil: `t-editor-3-keys.mjs` («3e uppercase P: "<P></p>"»).
- Izoh: CapsLock yoqilgan bolada juft «bir xil emas» — «juftni bir xil yoz» sabog'iga zid.

### K-E-15 · Atribut qiymati ichida `>` yozilsa avto-yopish otiladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1493–1502 (`inner` regex tirnoqni hisobga olmaydi)
- Qanday takrorlash: `<a href="a>` yozing (davomida `b">` yozmoqchi).
- Kutilgan: faqat `>` · Kuzatilgan: `<a href="a></a>` va davomi `<a href="a>b"></a>"`.
- Dalil: `t-editor-3-keys.mjs` («3e attr contains >: "<a href=\"a>b\"></a>\""»).
- Izoh: Kam uchraydi (title/URL ichida `>`), lekin bo'lganda kod «o'zi buziladi».

### K-E-16 · Yolg'iz so'z-menyu: teg bo'lmagan oddiy so'z (`Bu`, `a`, `Ol`) + Enter → teg tushib qoladi; kursor so'zga ko'chirilganda ham menyu ochiladi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1288–1295 (bare-so'z filtri faqat prefiks bo'yicha; `<div>`/`<section>`/yuqori daraja himoyalanmagan — TEXT_TAGS ro'yxati 605–608), 1751 (`onSelect` → `refreshMenu`)
- Qanday takrorlash: `<div>` ichida yangi qatorda `Bu` yozing → Enter (yangi qator kutib); yoki `<section>` ichida `a` → Enter; yoki `Ol` → Enter.
- Kutilgan: yangi qator · Kuzatilgan: `<button></button>`, `<a href=""></a>`, `<ol>\n  <li></li>…</ol>` tushadi. Shuningdek: `p` yozilgan qatorga sichqoncha/strelka bilan kursor kelsa (yozmasdan) ham menyu ochiladi.
- Dalil: `t-editor-10.mjs` («"<div>\n  Bu" menu true → Enter → "<div>\n  <button></button>"»), `t-editor-2-menu.mjs` (2p).
- Izoh: `<p>` ichida himoya bor (inTextTag), lekin `<div>`/`<body>` darajasida matn yozayotgan bola («Bu mening sahifam» ni qatorlarga bo'lib) tasodifan teg oladi.

### K-E-17 · Klaviatura fokus-tuzog'i: textarea'dan Tab/Shift+Tab/Esc/Ctrl+Tab bilan chiqib bo'lmaydi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1429 (Tab har doim `preventDefault`), 1445–1451 (Shift+Tab ham), Esc faqat menyuga
- Qanday takrorlash: muharrirga fokus → Tab / Shift+Tab / Esc+Tab / Ctrl+Tab.
- Kutilgan: qandaydir yo'l bilan keyingi tugmaga («Ishga tushirish», «Davom etish») o'tish · Kuzatilgan: fokus doim `hc-code`; faqat sichqoncha bilan chiqiladi. Boshqa tugmalar (tab, ↶↷, ✨, ▶) fokus-halqa bilan Tab-tartibda ✓.
- Dalil: `t-editor-7b.mjs` («Esc+Tab from textarea → hc-code», «Ctrl+Tab → hc-code»).
- Izoh: Klaviatura-foydalanuvchi/ekran-o'quvchi «Davom etish»ga yetolmaydi; kod-muharrirlarda odatiy, lekin chiqish yo'li ko'rsatilmagan.

### K-E-18 · «Qaytadan»: 8 soniyadan keyin qaytarish yo'li yo'q — Ctrl+Z ham qaytarmaydi, saqlov ham ustidan yozilgan  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1614–1634 (`setCodes` — brauzer tarixidan tashqari; `restoreTimerRef` 8000ms), 944–948 (400ms saqlov)
- Qanday takrorlash: kod yozing → «Qaytadan» ×2 → 8.3 s kuting → Ctrl+Z / localStorage'ga qarang.
- Kutilgan: qaytarish yo'li qolishi · Kuzatilgan: «↶ Qaytarish» yo'qoldi, Ctrl+Z starter'ni qaytaradi (`<!-- Bu yerga yozing -->`), localStorage'da starter.
- Dalil: `t-editor-5-tabs.mjs` («5d restore btn after 8.3s? false», «Ctrl+Z after reset: "<h1>Boshi</h1>\n"» — starter), `t-editor-3b-undo.mjs`.
- Izoh: Ikki bosqichli tasdiq bor, lekin 8 s — bola boshqa narsaga chalg'igan bo'lsa ish butunlay yo'q.

### K-E-19 · 20 000 belgidan oshganda ranglash jimgina o'chadi — xabar yo'q  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:195–199 (`HL_MAX`, `esc(src)`)
- Qanday takrorlash: 19 998 belgili kod → yana 3 belgi yozing.
- Kutilgan: bironta yozuv (holat-satrida yoki xabar maydonida) · Kuzatilgan: barcha ranglar bir zumda oq matnga aylanadi, xabar maydoni eski hint'ni ko'rsatadi.
- Dalil: `t-editor-8-misc.mjs` («8d 19998 tokens? true», «8d 20001 tokens? false msg "💡 …"»), `e1d-hlmax.png`.
- Izoh: Bola «muharrir buzildi» deb o'ylashi mumkin; darslarda 20k kam uchraydi.

### K-E-20 · Fayl-tab bosilganda fokus tugmada qoladi; tab tugmalarida `type`/`role`/`aria-selected` yo'q  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1715–1721
- Qanday takrorlash: `style.css` tabini bosing → yozishni boshlang.
- Kutilgan: fokus muharrirda (VS Code odati) yoki tab `role=tab aria-selected` · Kuzatilgan: `document.activeElement = hc-tab active`, yozilgan harflar hech qayerga tushmaydi; attributlar `type:null, aria:null, role:null` (panetabs'da esa `role=tab aria-selected` bor — nomuvofiq).
- Dalil: `t-editor-5-tabs.mjs` («5a focus after tab click: hc-tab active», «5f tab btn attrs»).
- Izoh: Har tab almashishda qo'shimcha bosish; ekran-o'quvchi tabni «tugma» deb o'qiydi.

### K-E-21 · `<h|>` holatida menyudan tanlash ortiqcha `>` qoldiradi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1303–1324 (`acceptMenu` kursordan keyingi `>`ni hisobga olmaydi)
- Qanday takrorlash: `<>` yozing, kursorni `<` bilan `>` orasiga qo'ying, `h` → Enter.
- Kutilgan: `<h1></h1>` · Kuzatilgan: `<h1></h1>>`.
- Dalil: `t-editor-8-misc.mjs` («8e Enter → "<h1></h1>>"»).
- Izoh: Kam uchraydi.

### K-E-22 · Tokenizator chekkalari: CSS string ichidagi `: ; { }` buziladi, `@media` ichidagi selektor atribut rangida, JS `1.5e3`/regex literal  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:143–165 (hlCss tirnoqni bilmaydi; `inBlock` bir darajali), 186–188 (raqam `[\d.]`), 168–193 (regex-literal yo'q); 99–141 (`<script>` ichidagi `a<b` teg deb bo'yaladi)
- Qanday takrorlash: `window.HC.highlight(...)` bilan: `a::before{content:"a:b;{}"}`, `@media (max-width:600px){ .a{color:red} }`, `let x = 1.5e3; /ab+c/g`, `<script>if(a<b){}</script>`.
- Kutilgan: string yaxlit yashil; `.a` selektor rangida; `1.5e3` yaxlit raqam · Kuzatilgan: `"a` yashil, `:` punct, `b` yashil, `;{}` punct, `"` teg-rangda; `.a` sariq (attr); `1.5` binafsha, `e3` oq; `a<b` da `b` teg-rangda. Matn o'zi buzilmaydi (faqat rang).
- Dalil: `t-editor-1-hl.mjs` (1j css3/css2/js/html).
- Izoh: Faqat rang; darslarda kam uchraydi (content:"…" ba'zi CSS darslarida).

### K-E-23 · Soft-wrap yo'q — uzun `<p>` matni gorizontal scroll talab qiladi (ayniqsa telefonda)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1990 (`white-space:pre`), 1744 (`wrap` atributi yo'q)
- Qanday takrorlash: 390px telefonda `<p>` ichiga 2–3 gap yozing.
- Kutilgan/Kuzatilgan: matn o'ngga cho'ziladi, o'qish uchun surish kerak (bu K-E-02 ni ham keltirib chiqaradi).
- Dalil: `e1a-longline.png` (surilganda matn gutter raqamlariga tegib turadi).
- Izoh: Faqat kuzatuv; joriy dizayn qarori.

### K-E-24 · Textarea'da `aria-label` yo'q  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1744–1764
- Kuzatilgan: `aria-label=null`, `<label for>` yo'q; faqat placeholder («Kodingizni shu yerga yozing…») — u yozilgach yo'qoladi.
- Dalil: `t-editor-7-a11y.mjs` (7c).

### K-E-25 · Belgi eni bir marta o'lchanadi — web-shrift (JetBrains Mono) keyin yuklansa menyu x-o'rni eskirgan enda qoladi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1225–1233 (`charWRef` faqat fontSize o'zgarganda 0 lanadi), 1920 (`@import` Google Fonts)
- Qanday takrorlash: stendda tekshirib bo'lmadi (oflayn — shrift kelmaydi); kod-o'qishdan tashxis: birinchi `<` fallback-shriftda o'lchanadi, keyin JetBrains Mono kelsa `cw` yangilanmaydi.
- Izoh: Faqat kesh yo'q birinchi ochilishda, sekin internetda; keyingi tahrirlarda ham saqlanib qoladi (sahifa yangilanguncha).

---

## Skrinshotlar (dev/hc-stend/)
`e1a-longline.png`, `e1b-tab.png`, `e1c-unicode.png`, `e1d-hlmax.png`, `e1e-bottom.png`, `e1e-endtype.png`, `e1f-fontplus.png`, `e1g-arrowscroll.png`, `e1i-empty.png`, `e1k-scrollbar-bottom.png`, `e1k-scrollbar-right.png`, `e1k-caret-end.png`, `e1k-misalign-crop.png`, `e2a-menu-lt.png`, `e2f-menu-bottom.png`, `e2f-menu-right.png`, `e2q-menu-last.png`, `e4-inline-format.png`, `e5d-armed.png`, `e6a-phone.png`, `e6a-phone-menu.png`, `e6a-phone-result.png`, `e6b-tablet.png`, `e6c-tablet-land.png`, `e6d-narrow-mouse.png`, `e6e-phone-3files.png`, `e6f-desktop-split30.png`, `e6g-1366-tabs.png`, `e7-focusring-undo.png`, `e8b-menu-x.png`.
