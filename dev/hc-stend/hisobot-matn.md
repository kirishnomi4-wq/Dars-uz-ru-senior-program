# HC kompilyator — MATN va i18n sinov-hisoboti (metodist + o'quvchi-ko'zi)

- Sana: 2026-08-17 · Fayl: `src/compilator/HtmlCompiler.jsx` (2155 satr, TAHRIRLANMAGAN)
- Stend: `dev/hc-stend/` · skriptlar `t-i18n-1-shots.mjs` (skrinshotlar `i18n-*.png`, xom chiqish `t-i18n-1-out.txt`), `t-i18n-2-switch.mjs` (bir instansiyada uz→ru; yordamchi stend-fayllar `entry-i18n.jsx` + `build-i18n.mjs` + `bundle-i18n.js` + `i18n.html`)
- Qonun-manba: `MATN_ETALONI.md` (1–8 bo'lim, lug'at), `MATN_KORPUS.md` (0–9), `til-lint-rules.json` (74 qoida)

## Jadval

| Og'irlik | Soni |
|---|---|
| 🔴 kritik | 3 |
| 🟠 muhim | 8 |
| 🟡 mayda | 13 |
| 🔵 taklif | 6 |
| **Jami** | **30** |

## Nima sinaldi

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

## Topilmalar

### K-M-01 · Til almashganda maslahat va linter-xabari eski tilda qoladi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1042-1053 (`results` useMemo — `[html, css, js, reqs]`), :1059 (`htmlErrors` useMemo — `[lintSrc]`), :915 (`__lang` render-vaqtida o'rnatiladi)
- Matn: ru rejimda ekranda «⚠ Строка 1: `</h2>` mos ochuvchi tegga ega emas (xato yoki typo)» va chip-title «`<p>` ichiga bir-ikki gap yozing», «`<img>` da `src` va `alt` ikkalasini to'ldiring»
- Muammo: `runOne`/`lintHtml` ichidagi `tr()` natijasi memo'da qotib qoladi; `lang` propi o'zgarsa (kod o'zgarmasa) memo qayta hisoblanmaydi — aralash tilli qator (rus so'z + o'zbek gap) chiqadi. Kod bitta belgiga tegilgach to'g'rilanadi. Til-tugmasi bor LMS/darsda o'quvchi buni ko'radi.
- Dalil: `t-i18n-2-switch.mjs` chiqishi — «RU holat (lang almashgach, kod tegilmagan)»: err = `⚠ Строка 1: \`</h2>\` mos ochuvchi tegga ega emas…`, chipTitles uz; «kod tegilgandan keyin» — ru. Skrinshot `i18n-switch-ru.png`.

### K-M-02 · Xato-xabari 1400px da ham kesiladi, «+N» hisoblagich yo'qoladi  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:1947 (`.hc-err … max-width:76ch; white-space:nowrap; text-overflow:ellipsis`), :1684-1687 (`+{n}` badge xabar ichida)
- Matn: «⚠ Строка 1: У `</h2>` нет парного открывающего тега (ошибка или опечат…» (ru, 1400px), «⚠ Qator 1: `</h2>` mos ochuvchi tegga ega emas (xato yo…» (uz, 480px)
- Muammo: ruscha linter-xabarlari o'zbekchadan uzunroq (kirill + monoshrift) — desktopda ham oxiri kesiladi va xabar ichidagi «+1» (yana xato bor) belgisi umuman ko'rinmay qoladi: o'quvchi ikkinchi xato borligini bilmaydi. Tooltip yo'q (button title — «Bosing — kursor…»), ya'ni to'liq matnni o'qishning yo'li yo'q. 768/480 px da uz ham kesiladi.
- Dalil: `t-i18n-1-out.txt` `cut:` qatorlari — ru 1400: sw=621 cw=568; ru 1100: sw=621 cw=568; uz 480: sw=546 cw=454. Skrinshotlar `i18n-ru-1400-2-error.png` (uz nusxasida «+1» ko'rinadi, ru nusxasida yo'q), `i18n-uz-480-2-error.png`.

### K-M-03 · «Rasm topilmadi» qutisi ru rejimda o'zbekcha  ·  Og'irlik: 🔴 kritik
- Qayer: src/compilator/HtmlCompiler.jsx:879-880 (`IMG_FALLBACK` — literal `'rasm topilmadi — <code>src</code> manzilini tekshiring'`, `'alt matni yozilmagan'`), :886 (`<html lang="uz">`)
- Matn: «rasm topilmadi — src manzilini tekshiring» / «alt matni yozilmagan» — `tr()` dan o'tmagan yagona ko'rinadigan o'quvchi-matn
- Muammo: i18n to'liq emas — ru o'quvchi natija-oynasida o'zbekcha izoh ko'radi (bu qat'iy o'quvchi-matn: aynan `alt` nima uchun kerakligini o'rgatuvchi quti). Preview-hujjatning `lang` atributi ham doim `uz`.
- Dalil: `t-i18n-1-out.txt`: «ru · img-fallback iframe matni: “…mushukrasm topilmadi — src manzilini tekshiring” · lang attr: uz». Skrinshot `i18n-ru-1400-2-error.png` (o'ng panel).

### K-M-04 · Backtick belgisi ekranda ko'rinib turadi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1691 (`💡 {firstHint}` — tekis matn), :1686 (`{shownErrors[0].msg}`), :1671 (chip `title`), hamma `checks.*`/`lintHtml`/`DEFAULT_TASK` maslahatlari (masalan :531-533, :362-415, :660-717)
- Matn: «💡 Напишите текст заголовка внутри `<h1>`», «💡 `button` uchun `color` xossasini yozing», «⚠ Qator 4: `<b>` ochiq qoldi — `</b>` bilan yoping»
- Muammo: MATN_ETALONI 4-bo'lim «Kod atamalari prozada ajralib tursin — `.mono`/`.qcode` bilan; test-izohlarda fmtCode+backtick». Bu yerda backtick xom holda chiqadi — 13 yoshli bola «`» belgisini kodning qismi deb o'ylashi mumkin (`<h1>` ni «`<h1>`» deb yozib ko'radi). Formatlash yo'q.
- Dalil: skrinshotlar `i18n-ru-1400-10-js-task.png` (maslahat qatori), `i18n-ru-1400-5-menu.png` (💡 qatori), `i18n-uz-1400-2-error.png` (xato qatori).

### K-M-05 · «xatboshi» — lug'atda taqiqlangan so'z  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:303 (`TAG_MENU` p)
- Matn: «matn xatboshisi»
- Muammo: MATN_ETALONI 3-bo'lim lug'ati, birinchi qator: «xatboshi → matn (paragraf) — bola bilmaydigan eski atama». Shu faylning o'zida `DEFAULT_TASK` «<p> — matn (paragraf)» deydi — bir tushuncha ikki nom (1-bo'lim «Bir tushuncha — bir nom»).
- Dalil: `t-i18n-1-out.txt` menu: `"<p>matn xatboshisi"`; skrinshot `i18n-uz-1400-5-menu.png`.

### K-M-06 · «xossa» ↔ CSS darslarida «xususiyat»  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:402 (`cssProp` hint), :410 (`cssValue`) — 6 o'rin
- Matn: «`button` uchun `color` xossasini yozing»
- Muammo: CssLesson1/2, CssPractice, PracticeLesson2-4 o'quvchiga CSS property'ni «xususiyat (property)» deb o'rgatadi (CssLesson1.jsx:623, 627); kompilyator esa «xossa» deydi — atama izchilligi buzilgan (MATN_ETALONI 1-bo'lim «Bir tushuncha — bir nom», 4-bo'lim «Matn ↔ ko'rgazma mos»). Bola darsda o'rganmagan so'zni maslahatda ko'radi.
- Dalil: `t-i18n-1-out.txt` (uz-1400 · js-task boshi) chipTitles[1]; `grep -rl xususiyat src` → CssLesson1/2, CssPractice va boshqalar.

### K-M-07 · «sintaksis» izohsiz — lug'at bandi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1576 («Avval sintaksis xatosini tuzating»), :1651 («Shartlar bajarildi — sintaksis xatosi qoldi (yuqorida)»), :1906 («Sintaksis xatosi tuzatilsa ochiladi»)
- Matn: yuqoridagi 3 qator
- Muammo: MATN_ETALONI lug'ati: «sintaksis (izohsiz) → yozilish qoidasi / shakl — metafora bilan kiritiladi». Kompilyator umumiy modul — 1-Modul boshidagi bola bu so'zni birinchi marta shu yerda ko'rishi mumkin, izoh yo'q.
- Dalil: skrinshot `i18n-uz-1400-2-error.png` (pastki holat-satri), `i18n-uz-1400-9b-pretty-syntax.png`.

### K-M-08 · «typo» — o'zbek gapda inglizcha so'z, «ega emas» — kalka  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:689
- Matn: «`</h2>` mos ochuvchi tegga ega emas (xato yoki typo)»
- Muammo: MATN_ETALONI 1-bo'lim (jargon yo'q, ingliz so'zi izohsiz); «ega emas» — kantselyarit-kalka (rus «не имеет»); ru varianti «нет парного…» tabiiy, uz varianti esa hujjat-tili. Ekranda eng ko'p chiqadigan linter-xabarlaridan biri (yopish-typo — bolalarning eng ko'p xatosi).
- Dalil: skrinshot `i18n-uz-1400-2-error.png`; `t-i18n-1-out.txt` err.

### K-M-09 · Standart maslahatlar harakat-ko'rsatma emas, ichki-jargon oqib chiqadi  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:362, 367, 374, 384 («`h1` topilmadi» oilasi), :415 («Skriptda kerakli qism topilmadi»), :1071 («natija kutilgancha emas»), :480 («shart aniqlanmadi»), :757 («tekshirishda xatolik»)
- Matn: «`img` topilmadi», «`a` topilmadi», «Skriptda kerakli qism topilmadi», «natija kutilgancha emas», «shart aniqlanmadi», ru: «условие не распознано», «результат не такой, как ожидалось»
- Muammo: 13 yoshli o'quvchi uchun maslahat = «nima qilay?» javobi bo'lishi kerak (MATN_ETALONI 7-B.1 TOPSHIRIQ — buyruq; KORPUS 8 «tuzoq-izoh oxiri HARAKATGA chaqiradi»). «topilmadi/kutilgancha emas/aniqlanmadi» — hech qanday harakat aytmaydi; «shart aniqlanmadi», «tekshirishda xatolik», «условие не распознано» — dasturchi-tili, o'quvchiga tegishli emas. «skript» — izohsiz atama. `DEFAULT_TASK` da hint'lar yaxshi (harakat: «…yozing/to'ldiring»), lekin deklarativ shart bergan darslar aynan shu standartlarga qoladi.
- Dalil: `t-i18n-1-out.txt` (uz-1400 · js-task boshi) chipTitles: `"\`img\` topilmadi","\`a\` topilmadi","natija kutilgancha emas"…,"shart aniqlanmadi"`; skrinshot `i18n-uz-1400-10-js-task.png`.

### K-M-10 · Standart maslahatda teg `h1` ko'rinishida, yorliqda `<h1>` ko'rinishida  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:362-410 (`\`${sel}\``) ↔ :493-498 (`buildLabel` `<${sel}>`), :531-533 (`DEFAULT_TASK` «`<h1>`»)
- Matn: chip «<img> — src, alt», maslahati «`img` topilmadi»; chip «<li> внутри <ul>», maslahati «поместите `li` внутрь `ul`»
- Muammo: bir shart ikki xil ko'rinishda ataladi — o'quvchi «img» so'zini tegdan (`<img>`) farqlamaydi, ayniqsa «`li` ni `ul` ichiga joylang» ko'rinishida (MATN_ETALONI 1-bo'lim «bir tushuncha — bir nom»; 4-bo'lim «matn ↔ ko'rgazma mos»). Selektor `.card`/`#btn` bo'lganda qavs bo'lmasligi to'g'ri — lekin oddiy teg-nomida farq ko'zga tashlanadi.
- Dalil: `t-i18n-1-out.txt` (uz/ru-1400 · js-task boshi) chips ↔ chipTitles.

### K-M-11 · Ru rejimda «LIVE», uz rejimda «JONLI» — tarjima siyosati bir xil emas  ·  Og'irlik: 🟠 muhim
- Qayer: src/compilator/HtmlCompiler.jsx:1846 (`tr({ uz: 'jonli', ru: 'live' })`), :1857 («🖥️ Console» — ikkala tilda inglizcha), :1850/1885 (iframe `title="natija"`, `"tekshiruv"` — faqat uz)
- Matn: uz «JONLI» / ru «LIVE»; «🖥️ Console» (uz-da ham); iframe title «natija»
- Muammo: bir nishonda uz tarjima qilingan, ru inglizcha qoldirilgan; konsol sarlavhasi ikkala tilda inglizcha, holbuki chip-yorliq «konsolda «5»» / «в консоли» deydi (bir tushuncha — bir nom: «Console» ↔ «konsol»). Iframe title (skrinrider uchun) faqat o'zbekcha.
- Dalil: `t-i18n-1-out.txt` live: `["live"]` (ru), `["jonli"]` (uz); consoleTitle `["🖥️ Console"]`; iframeTitle `["natija","tekshiruv"]` (ru rejimda ham).

### K-M-12 · «Orqaga» ikki ma'noda: navigatsiya-tugma va undo-tugma  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1892 («← Orqaga»), :1726 (undo `title`/`aria-label` «Orqaga qaytarish»)
- Matn: «← Orqaga» (oldingi ekranga) va «↶ Orqaga qaytarish (Ctrl+Z)» (kod tahririni bekor qilish)
- Muammo: MATN_ETALONI 6-bo'lim «matn ↔ UI mosligi» — dars-matni «Orqaga tugmasini bosing» desa, o'quvchi ikkita «Orqaga»dan qaysi birini bosishini bilmaydi. Ru'da ham «Вернуть» uch vazifada: redo (`Вернуть (Ctrl+Y)`), «Qaytarish» (`↶ Вернуть`), reset-title («Вернуть код к начальному виду»).
- Dalil: `t-i18n-1-out.txt` tools/ghost/status qatorlari (uz-1400 · reset-done: status «Kod tozalandi. ↶ Qaytarish», tools «↷|Qaytarilganni tiklash|Tiklash»).

### K-M-13 · Sarlavha-brief'da qo'shtirnoq turi boshqa (“ ” ↔ « »)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:527
- Matn: «Hammasi yashil bo'lsa — “Davom etish” ochiladi.» (uz) ↔ shu faylning boshqa uz-satrlari «Natija», «5» (:486, :488, :1654) va ru «Продолжить»
- Muammo: MATN_ETALONI 5-bo'lim yozuv-tozaligi (bir xil belgi); faylda faqat shu joyda “ ” ishlatilgan.
- Dalil: `grep -an '“' src/compilator/HtmlCompiler.jsx` → faqat 527-satr; skrinshot `i18n-uz-1400-1-empty.png`.

### K-M-14 · «Chiroyli» — tugma sifat, harakat-oti emas; «chekintiradi» izohsiz  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1731
- Matn: «✨ Chiroyli» (title: «Kodni chiroyli chekintiradi»)
- Muammo: MATN_ETALONI 6-bo'lim «Tugma = neytral harakat oti» («Yaratish», «Tozalash»); «Chiroyli» nima qilishini aytmaydi (720px dan tor ekranda faqat «✨» qoladi, title esa sensor qurilmada ochilmaydi). «chekintiradi» — bola bilmaydigan fe'l (izohsiz). Ru «Красиво» ham xuddi shu tur.
- Dalil: skrinshot `i18n-ru-480-1-empty.png` (faqat ✨), `t-i18n-1-out.txt` tools.

### K-M-15 · Ru «подвал страницы» — dasturchi-slengi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:312 (`TAG_MENU` footer), :309 (header «шапка страницы»)
- Matn: «подвал страницы»
- Muammo: 13 yoshli rus tilli bola «подвал» = yerto'la; sahifa «pasti» ma'nosi frontend-slengidan. Uz varianti «sahifa pasti» — sodda; ru varianti undan qiyinroq (ikki til bir darajada bo'lishi kerak).
- Dalil: `t-i18n-1-out.txt` menu (ru-1400 · menu).

### K-M-16 · «xira maslahat» (placeholder ta'rifi) — o'quvchi uchun mavhum  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:323 (`ATTR_MENU` input placeholder)
- Matn: «xira maslahat» (ru: «подсказка»)
- Muammo: «xira» + «maslahat» — placeholder nimaligini aytmaydi (o'quvchi hali `input` ni ko'rmagan); MATN_ETALONI 4-bo'lim «har atama izohlanadi»; ru varianti «подсказка» ham «maydondagi kulrang namuna» ma'nosini bermaydi.
- Dalil: kod-o'qish (menyu faqat `<input ` yozilganda chiqadi).

### K-M-17 · «`<! ... >` yopilmagan» — bola tushunmaydigan xabar  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:660
- Matn: «`<! ... >` yopilmagan» / «`<! ... >` не закрыт»
- Muammo: `<!doctype` yoki chala izoh yozilganda chiqadi; «<! ... >» belgilar to'plami o'quvchiga hech narsa demaydi, harakat yo'q (MATN_ETALONI 7-B.1).
- Dalil: kod-o'qish (linter shoxi); atEnd bo'lgani uchun faqat kursor boshqa joyga o'tsa ko'rinadi.

### K-M-18 · «`<h1>` ichida tirnoq (") yopilmagan» — qavs ichidagi belgi o'qishni buzadi  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:713
- Matn: «`<img>` ichida tirnoq (") yopilmagan»
- Muammo: `(")` — qavs ichida yolg'iz tirnoq; monoshriftda «(") yopilmagan» bola uchun tirnoq-qavs chalkashligi. Boshqa xabarlarda belgi backtick ichida (`>`), bu yerda qavsda — bir xil emas.
- Dalil: kod-o'qish (:713, ru «Кавычка (") внутри …»).

### K-M-19 · Yakuniy xabar quruq: «Barcha shartlar bajarildi!»  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1648
- Matn: «✓ Barcha shartlar bajarildi!» / «Все условия выполнены!»
- Muammo: MATN_ETALONI 7-bo'lim «Muvaffaqiyat xabari — samimiy, aniq ("Zo'r! Sahifangizga rasm qo'shdingiz." — quruq "Bajarildi" emas)»; KORPUS 0.7 «g'alaba bayram». Bu — kompilyatorning yagona g'alaba-nuqtasi.
- Dalil: skrinshot `i18n-uz-1100-4-pass.png`.

### K-M-20 · Ru «остался синтаксис (см. выше)» — grammatik chala ibora  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1651
- Matn: «Условия выполнены — остался синтаксис (см. выше)»
- Muammo: «остался синтаксис» rus tilida ma'nosiz (sintaksis qolmaydi, xato qoladi); mashina-tarjimaga o'xshaydi. «(см. выше)» qisqartma ham 13 yoshli o'quvchi uchun hujjat-tili.
- Dalil: skrinshot `i18n-ru-1400-2-error.png` (pastki holat-satri).

### K-M-21 · «ishga tushirilmoqda…» maslahat sifatida  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:741, :1070
- Matn: «ishga tushirilmoqda…» / «запускается…»
- Muammo: runtime-shart tekshirilguncha chip-tooltip va 💡 qatorida shu chiqadi — o'quvchi «nima qilay?» deb ochsa, hech narsa demaydi; majhul nisbat («tushirilmoqda») kantselyarit-ohang.
- Dalil: kod-o'qish; JS-topshiriq stendida (`i18n-*-10-js-task.png`) 300 ms dan keyin «natija kutilgancha emas»ga almashadi.

### K-M-22 · Deklarativ yorliqlar belgi-formula shaklida  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:487 («`${s.a} ⇄ ${s.b}`»), :489 («`${s.eval} = ${s.equals}`»), :485 («CSS: sel { prop }»), :490 («JS namunasi»/«фрагмент JS»)
- Matn: chip «on ⇄ off», «typeof f = function», «JS namunasi», «CSS: button { color }»
- Muammo: MATN_ETALONI 43a («belgi-formula o'quvchi-matnda taqiq — to'liq gap bilan», `til-lint` `belgi-formula` qoidasi ≠ uchun); «⇄» va «typeof f = function» o'quvchi uchun o'qib bo'lmaydi; «JS namunasi» — nima yozish kerakligini aytmaydi. Bu yorliqlar dars `label` bermaganda chiqadi.
- Dalil: skrinshot `i18n-ru-1400-10-js-task.png` chips 3, 6, 7.

### K-M-23 · Sensor qurilmada fayl-tab nomi kesiladi («index.»)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1973 (`.hc-tab` — `white-space:nowrap`, ota-`.hc-tabs` overflow), :2138 (`pointer:coarse` da tab kattalashadi)
- Matn: «index.html» → «index.»
- Muammo: 820px + `pointer:coarse` (planshet) da nom kesiladi — bola qaysi faylda ekanini o'qiy olmaydi. Matn emas, lekin ko'rinish-matn muvofiqligi.
- Dalil: skrinshot `i18n-ru-14-touch.png`, `i18n-uz-14-touch.png` (chap yuqori).

### K-M-24 · 14 shartli topshiriqda kompilyator ekranga sig'maydi (1400×900)  ·  Og'irlik: 🟡 mayda
- Qayer: src/compilator/HtmlCompiler.jsx:1938 (`.hc-checklist` flex-wrap), :1927 (`.hc-root height:100dvh; overflow:hidden`)
- Matn: —
- Muammo: chiplar 2 qatorga o'ralganda `.hc-root` scrollHeight 918 > clientHeight 900 — pastki 18px kesiladi, overflow:hidden bo'lgani uchun surib bo'lmaydi. Ko'p shartli darslarda ru yorliqlar uzunroq — tezroq o'raladi.
- Dalil: `t-i18n-1-out.txt` (uz/ru-1400 · js-task) rootOverflow `{"sh":918,"ch":900}`; skrinshot `i18n-ru-1400-10-js-task.png`.

### K-M-25 · Boshlang'ich izoh (starter) til almashganda eski tilda qoladi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:934 (`useState(() => … tr(f.starter))`), :520 (`DEFAULT_FILES` starter)
- Matn: «<!-- Bu yerga yozing -->» ru rejimga o'tganda ham muharrirda turadi (faqat «Qaytadan» dan keyin «<!-- Пишите здесь -->»)
- Muammo: starter — o'quvchi kodi hisoblanadi, shuning uchun almashtirmaslik ataylab bo'lishi mumkin; lekin bola hali hech narsa yozmagan bo'lsa, o'zbekcha izoh ru ekranida turadi.
- Dalil: `t-i18n-2-switch.mjs` («Qaytadan» dan keyin starter ru bo'ldi; undan oldin kod o'zgarmagan).

### K-M-26 · Chip-maslahati faqat sichqoncha-hover'da (title) — sensor qurilmada 2-,3-shart maslahati o'qilmaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1671 (`title={merged[i]?.hint}`), :1691 (faqat `firstHint`)
- Matn: —
- Muammo: 💡 qatorida faqat BIRINCHI bajarilmagan shart maslahati; qolganlari `title` da — planshetda ochilmaydi. O'quvchi 2-shartga o'tganida ko'rsatma yo'q (agar 1-si hali bajarilmagan bo'lsa).
- Dalil: `i18n-*-14-touch.png` (touch), `t-i18n-1-out.txt` hint (faqat 1 ta).

### K-M-27 · Xato-xabari to'liq monoshriftda (kirill proza ham)  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1947 (`.hc-err font-family:'JetBrains Mono'`)
- Matn: «⚠ Строка 1: У `</h2>` нет парного открывающего тега…»
- Muammo: butun xabar (kirill proza ham) monoshriftda — o'qish sekin, uzunlik ~30% ortadi (K-M-02 kesilishiga hissa qo'shadi). Kod-bo'lak mono, gap oddiy shrift bo'lsa muvofiqroq (MATN_ETALONI 4: kod atamasi ajralib tursin, proza emas).
- Dalil: skrinshot `i18n-ru-1400-2-error.png`.

### K-M-28 · Rasm-fallback ikonkasi monoxrom/tofu ko'rinishi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:877 (`🖼` — «rasm ramkasi» emoji)
- Matn: —
- Muammo: skrinshotda belgi rangli emoji emas, ramkali qora-oq glif ko'rinishida — bola «buzuq belgi» deb o'qishi mumkin, holbuki quti aynan «buzuq emas» tuyg'usi uchun qo'yilgan. Headless-shrift muhitiga bog'liq bo'lishi mumkin — real qurilmada tekshirish kerak.
- Dalil: skrinshot `i18n-uz-1100-4-pass.png` (o'ng panel).

### K-M-29 · «Ichkariga surish» (⇥ sensor tugmasi) va «A−/A+» — faqat title, sensor qurilmada o'qilmaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1799, :1808-1813
- Matn: «Ichkariga surish» (ru «Отступ»), «A−» / «A+»
- Muammo: sensor-panel tugmasi `title` faqat hover'da; ekranda «⇥» — bola bu belgini bilmaydi. Uz «Ichkariga surish» (harakat) ↔ ru «Отступ» (ot) — bir tushuncha ikki grammatik shakl. Kichik.
- Dalil: skrinshot `i18n-uz-14-touch.png` (pastki qator, o'ng chekka).

### K-M-30 · «Kod allaqachon chiroyli 👍» — «chiroyli» so'zi kodni baholaydi  ·  Og'irlik: 🔵 taklif
- Qayer: src/compilator/HtmlCompiler.jsx:1577
- Matn: «Kod allaqachon chiroyli 👍» / «Код уже аккуратный 👍»
- Muammo: ru «аккуратный» (tartibli) aniq; uz «chiroyli» — estetik baho, «chekinish to'g'ri» ma'nosini bermaydi; «Chiroyli» tugmasi bilan birga bir atama-oilasi (K-M-14).
- Dalil: skrinshot `i18n-uz-1400-9-pretty-note.png`.

---

## Qo'shimcha kuzatuvlar (topilma emas — ✓ o'tdi)
- Siz-forma: hamma buyruqlar «-ing» shaklida («yozing», «to'ldiring», «bosing», «yoping»); sen-forma yo'q.
- Ru asosiy tugma/holat matnlari tabiiy: «Выполняйте условия — результат виден справа», «Весь код сотрётся — нажмите кнопку ещё раз», «Тяните — изменится ширина панелей», «Код очищен. ↶ Вернуть».
- 768/480 px da tugmalar («Продолжить →», «← Назад», «Заново») kesilmaydi (`cut` ro'yxatida faqat `.hc-err`).
- Taklif-ro'yxati tavsiflari (`.hc-menu-d`) 246px kenglikka sig'adi (ellipsis ishga tushmadi).
- «Qaytadan» ikki bosqichi va «Qaytarish» ikkala tilda to'liq tarjima qilingan.
- Bo'sh holatda ko'rsatma bor (💡), xato bosilsa kursor qatorga tushadi, `+N` mantiqi bor (ko'rinishi K-M-02).
