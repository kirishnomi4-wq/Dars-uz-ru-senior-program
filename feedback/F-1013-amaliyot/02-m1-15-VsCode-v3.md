# 2-Modul (kod: 1-Modul) · 9-dars «VS Code» — MD v3 (o'zgargan ekranlar)

Fayl: `src/1-Modull/VsCodeLesson.jsx` · kalit `m1-15` · **19 → 20 ekran** (kod darsi, 20 ekrangacha — 172.1) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: 13.10 qarorlari — ish tartibi **VS Code + gemini.google.com + aniq prompt**; Antigravity ixtiyoriy (rasmiy FAQ: 18 yoshdan kichiklarga yopiq);
2-Modul tartibi o'zgardi: m1-07 CSS layout → **m1-15 VS Code** → m1-08 HTML Praktika (1-bosqich ✅).
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: `s4:1 · s8:2 · s11:0 · s13: yozma`; arena ✔ `1·0·2·3·1·2·0·3·0·3·1·2` — faqat 4 savolda variant matni (pastda).
Menyu nomi (DE-205): App.jsx `m1-15` — «VS Code» (osti: «o'rnatish, Emmet, Live Server, jonli card») · oldingi m1-07 «CSS: layout, flexbox, DevTools» · keyingi m1-08 «HTML Praktika — Portfolio sayt».

---

## A. Darsning tayanchi — nima o'zgaradi va nega

1. **Yangi ko'nikma — aniq prompt bilan ishlash.** Darsning 6 qadamiga 7-qadam qo'shiladi: o'quvchi o'z kompyuteridagi `my-site` loyihasida
   **gemini.google.com**'ga tayyor aniq prompt beradi, kelgan kodni o'qib `index.html` va `style.css` ga qo'yadi, Live Server'da tekshiradi.
   Keyingi dars (HTML Praktika) va undan keyingi amaliyotlar shu ish tartibida boradi — bu darsda u birinchi marta, kichik card ustida o'rganiladi.
2. **Nega Gemini veb-sayt, Antigravity emas** (o'quvchiga aytilmaydi, mentor uchun): Google akkaunti O'zbekistonda 13 yoshdan (Google Accounts: ro'yxatda yo'q
   mamlakatlarda — 13), Gemini veb-ilovasi O'zbekistonda ishlaydi va o'zbek tilini biladi (Gemini Help, mamlakatlar ro'yxati). Antigravity — 18+ (rasmiy FAQ).
   Darsda «18 yoshman deb yozing» qadami yo'q va bo'lmaydi.
3. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **prompt** — AI'ga yoziladigan aniq vazifa matni. Birinchi chiqqanda: «AI'ga yoziladigan bunday matn prompt deyiladi» (T-011 — avval hodisa, keyin nom).
   - **aniq prompt** — nima kerakligi, qaysi faylga va nima bo'lmasligi yozilgan prompt. «zo'r prompt», «yaxshi so'rov» — ishlatilmaydi.
   - **Gemini** — «gemini.google.com» (memory `sinfda-gemini`). «chatbot», «sun'iy intellekt dasturi» — yo'q; «AI» qoladi (oldingi darslar bilan bir xil).
   - **kod bloki** — Gemini javobidagi kod qutisi. Fayl nomlari: `index.html`, `style.css` (darsdagi kabi).
4. **Xavfsizlik (bitta qator, darsda):** Gemini'ga parol, telefon raqami va uy manzilini yozmang. Kodni o'qimasdan faylga qo'ymang.
5. **Tekshiruv:** Gemini sayti tugmalarining nomi interfeys tiliga qarab o'zgaradi — darsda tugma nomi emas, joyi va belgisi aytiladi
   («o'ng yuqoridagi kirish tugmasi», «kod bloki ustidagi nusxalash belgisi»). **Mentor darsdan oldin bir marta o'z akkauntida tekshiradi** (P-028).

## O'zgarmaydigan ekranlar
0 Kirish · 2 O'rnatish · 3 Oyna bilan tanishuv · 4 1-savol · 5 Papka · 6 Emmet · 7 Live Server · 8 2-savol · 9 Card HTML · 10 Card CSS · 11 3-savol ·
12 Tezkor tugmalar · (yangi 13) · 14 Yakuniy sinov «Go Live» · 16 Demo Day loyihasi · 17 Podium · 18 Kartochkalar — matni o'zgarmaydi.
**KOD:** yangi ekran 13-o'ringa kirgani uchun `RECAPS`/`Q_LABELS` dagi indeks-kalitlar (eski 13 → 14) suriladi; `INLINE_KEYS` id bo'yicha — o'zgarmaydi.

---

## 1 · Maqsad — 7 qadam  ← o'zgaradi
- Sarlavha: **Bugun o'z kompyuteringizda birinchi sahifangizni yasaysiz.** (o'zgarmaydi)
- Mentor: Mana shu card — o'zingiz haqingizdagi kichkina sahifa. Dars oxirida u o'z kompyuteringizda ishlaydi. Unga 7 qadamda yetib boramiz.
- Qadamlar (7):
  1. VS Code'ni yuklab o'rnatamiz
  2. Oynasi bilan tanishamiz
  3. Papka ochib, fayllar yaratamiz
  4. Jonli serverni yoqamiz
  5. Card HTML'ini yig'amiz
  6. Card'ga stil beramiz
  7. **AI'ga aniq prompt bilan card'ni boyitamiz**  ← yangi
- Yorliq: «7 qadam» · telefon tugmasi «Bugungi 7 qadamni ko'rish»
✎ 6 → 7 qadam (yangi blok rejada ko'rinsin, P-015).

## 13 · AI bilan: aniq prompt  ← YANGI ekran (o'rnatish ekranlari qolipida: chapda 3 ko'rinish, o'ngda «Bajardim» qadamlari)
- Eyebrow: 7-qadam · AI bilan
- Sarlavha: **AI card'ingizni qanday boyitadi?** (36)
- Mentor: Bu qadamni ham o'z kompyuteringizda bajarasiz. AI'ga yoziladigan aniq vazifa matni **prompt** deyiladi — qanchalik aniq yozsangiz, natija shunchalik siz kutgandek chiqadi.
- Chap — 3 ko'rinish (chip-tugmalar «1 · Gemini» · «2 · Prompt» · «3 · Faylga»), har biri chizilgan maket (emoji emas):
  - **1 · Gemini** — brauzer oynasi `gemini.google.com`: o'ng yuqorida kirish tugmasi (halqa bilan ajratilgan), pastda yozish maydoni.
    Ostidagi izoh: «O'z Google akkauntingiz bilan kiring. Akkauntingiz bo'lmasa — mentorga ayting.»
  - **2 · Prompt** — yozish maydonida tayyor prompt (pastdagi matn), o'ngda yuborish strelkasi.
  - **3 · Faylga** — Gemini javobi: ikkita kod bloki, har birining tepasida nomi (`index.html`, `style.css`) va nusxalash belgisi (halqa bilan);
    yonida VS Code'dagi `my-site` papkasi — strelka kod blokidan mos faylga.
- O'ng — qadamlar (har birida «Bajardim», bittadan; o'rnatish ekranlaridagi `StepChecklist`):
  1. **gemini.google.com'ni oching va kiring** — o'z Google akkauntingiz bilan. *Izoh:* parol, telefon raqami va uy manzilini Gemini'ga yozmang.
  2. **Promptni yuboring** — `{…}` joylarni o'zingiz haqingizda to'ldiring («Nusxalash» tugmasi bor):
     > Menga shaxsiy card yasab ber. Ikki fayl kerak: index.html va style.css.
     > Cardda: ismim — {ismingiz}, kim bo'lmoqchiman — {orzu-kasbingiz}, 3 ta hobbim — {hobbi 1}, {hobbi 2}, {hobbi 3}.
     > Card sahifa markazida tursin, burchaklari yumaloq, ostida yengil soya bo'lsin.
     > index.html'da style.css <link> bilan ulangan bo'lsin.
     > Faqat HTML va CSS ishlat, JavaScript kerak emas. Har faylni alohida kod blokida ber.
     *Izoh:* prompt — o'quvchining AI'ga buyrug'i, shuning uchun sen-formada (T-002).
  3. **Kodni faylga qo'ying** — `index.html` kod blokini nusxalab, VS Code'dagi `index.html` ga qo'ying (eskisining o'rniga); `style.css` ni ham shunday. `Ctrl+S`.
     *Izoh:* qo'yishdan oldin o'qing: `<link>` qatori bormi, ismingiz to'g'ri yozilganmi.
  4. **Live Server'da tekshiring** — brauzerda card markazda, ismingiz, orzu-kasbingiz va 3 ta hobbingiz ko'rinadi.
     *Xato yoki kutganingizdek chiqmasa* — Gemini'ga ko'rganingizni aniq yozing: «Card markazda emas, chap chetda turibdi. Markazga qo'y.» («ishlamayapti» emas).
- Pastda ixtiyoriy qator (kichik, kulrang): «18 yoshdan katta bo'lsangiz yoki ota-onangiz o'z akkaunti bilan kirib bersa, shu ishni Antigravity dasturida ham qilish mumkin — ixtiyoriy.»
- Hammasi belgilangach (yashil): Prompt aniq bo'lsa, AI siz kutgan card'ni beradi — siz esa uni o'qib, tekshirib, faylga qo'yasiz. (≈105)
- Tugma: Qadamlarni belgilang → Davom etish
- Jonli: mentor proyektorda qulfsiz (F-1012); o'quvchining «Bajardim»lari — mentor panelida (o'rnatish ekranlaridagi naqsh).
✎ Yangi ekran. Joyi: tezkor tugmalardan keyin, yakuniy «Go Live» sinovidan oldin — o'quvchi card'ni qo'lda yasab bo'lgan, endi uni AI bilan boyitadi.

## 15 · Final — card tayyor  ← bitta qator o'zgaradi
- Ro'yxatning 5-bandi: «O'z ismingiz yozilgan yashil card» → **«AI bilan boyitilgan o'z card'ingiz»** (AI bergan card yashil bo'lmasligi mumkin — F-1013 halollik).
- Qolgani o'zgarmaydi.

## 19 · Yakun  ← o'zgaradi
- «Endi siz bilasiz» ro'yxatiga bitta band: **«AI'ga aniq prompt yozib, kodini o'qib faylga qo'yish»** (5 → 6 band).
- Uyga vazifa (card, VS Code'da; skrinshot platformaga — o'zgarmaydi), bandlar:
  1. ~~Hobbi ro'yxati~~ (endi darsda AI bilan qo'shiladi) → **O'zgartirish so'rovi** — Gemini'ga card uchun bitta aniq so'rov yozing (masalan: «Card ostiga Telegram havolasini qo'sh»), natijani Live Server'da tekshiring
  2. Havola — Telegram yoki sevimli saytingizga `a href` (o'zgarmaydi)
  3. Rang tajribasi — fonni boshqa rangga o'zgartirib ko'ring (o'zgarmaydi)
  4. Sahifa nomi — `title` ichiga ismingizni yozing (o'zgarmaydi)
  **KOD:** `HOMEWORK` eksporti (LMS) ham shu 4 band bilan.
- «Keyingi dars» tugmasi — o'zgarmaydi (keyingi dars nomi aytilmaydi).

## Kartochkalar — soni o'zgarmaydi, bittasi almashadi
- Yangi: **Old:** AI'ga yoziladigan aniq vazifa matni nima deyiladi? · **Orqa:** Prompt · **Izoh:** nima kerak, qaysi faylga, nima bo'lmasin — aniq yoziladi
- Almashadigan: hozirgi kartochkalardan biri (eng yaqin takror) — quruvchi kod bilan solishtirib tanlaydi va jurnalga yozadi. **KOD**

## Arena (12) — o'rni o'zgarmaydi, 4 savolda variant matni (`tell` darvozasi qarzi)
- 1-savol «eng ko'p ishlatadigan kod redaktori» — «VS Code» atama ko'rinishida yolg'iz: chalg'ituvchilar ham dastur nomi bo'lib qoladi, lekin shakl tenglashtiriladi (**KOD**: `lint-tell` bilan).
- 4-savol «Live Server nima?» — to'g'ri variant eng uzun (×1.56): variantlar uzunligi tenglashtiriladi.
- 5-savol «Go Live qayerda?» — qavs faqat to'g'rida («(status bar)»): qavs olinadi.
- 7-savol «5500 nima?» — tire faqat to'g'rida («Port — …»): tire olinadi.

---

## «KOD» ro'yxati
1. `SCREEN_META` — 20 element; yangi `{ id: 'sai', type: 'exploration' }` 13-o'ringa. `RECAPS`/`Q_LABELS` indeks-kalitlari (≥13) +1. `INLINE_KEYS` o'zgarmaydi.
2. Yangi ekran — `ScreenInstall` naqshida (`VIEWS` chiplari + `BrowserWin` maketlari + `StepChecklist`); prompt qutisida «Nusxalash» (clipboard, rad etilsa — matn belgilanadi).
3. Maqsad ekrani 7 qadam; final 5-band; yakun «Endi siz bilasiz» +1; uyga vazifa 1-band; `HOMEWORK` eksporti.
4. Kartochka: bitta almashadi. Arena: 4 savol variant matni, ✔ o'rni o'zgarmaydi (`git diff` bilan).
5. Tekshiruv: `npm run gates -- src/1-Modull/VsCodeLesson.jsx` · `lint:jsx` · navtest2 (self) · mentor sinovi · smoke-onfinished · 20 ekran surati (1280 va 390).
   `emoji` darvozasi — pastdagi savol javobiga qarab.

## GATE M — o'zim belgiladim
- [x] Oldingi/keyingi dars App.jsx bilan mos (13.10 dan: m1-07 → **m1-15** → m1-08)
- [x] Bitta misol-ip — o'quvchining card'i; yangi blok shu card ustida
- [x] Yangi atama «prompt» hodisadan keyin tug'iladi (T-011); sarlavhada yangi atama yo'q (sarlavha «AI card'ingizni qanday boyitadi?»)
- [x] Sarlavha ≤55 (36) · Mentor ≤2 gap · yashil xulosa ≤110 (≈105)
- [x] Tashqi bog'liqlik halol: akkaunt bo'lmasa — mentorga; tugma nomlari emas, joyi aytiladi; mentor oldindan tekshiradi (P-026, P-028)
- [x] Kafolat gapi yo'q («har doim», «100%»); xavfsizlik qatori bor
- [x] Testlar va arena ✔ o'rni o'zgarmaydi

## Siz hal qiladigan savollar (GATE M)
1. **`emoji` darvozasi (eski qarz).** Emoji'lar asosan umumiy qismlarda: mentor paneli, arena, podium, takrorlash oynasi — ular 1–4-Modulning ko'p eski darslarida bir xil.
   A (tavsiya): bu darsda faqat o'zim tekkan ekranlar emojisiz; umumiy qismlar — `KATTA_TOZALASH.md` ga yoziladi, hamma darsda bir yo'la.
   B: shu darsning hamma emoji'sini hozir tozalash (boshqa darslardan farq qilib qoladi).
2. **Yangi ekran joyi.** A (tavsiya): tezkor tugmalardan keyin, yakuniy sinovdan oldin (card qo'lda tayyor — endi AI bilan boyitiladi).
   B: Card CSS ekranidan keyin darhol (6-qadamning davomi sifatida).
3. **Gemini'ga kirish uchun akkaunt.** A (tavsiya): o'quvchining o'z Gmail'i (13+); akkaunti yo'q o'quvchi mentorga aytadi va qo'shni bilan juftlikda ishlaydi.
   B: darsdan oldin hamma o'quvchida Gmail borligini mentor tekshiradi (darsdan oldingi uyga vazifa).

---

## ⚙ Qurishda aniqlangan joylar (2026-10-13 16:04) — kod shu holatda
1. **13-ekran qadam izohlari qisqartirildi** (1280×820 ga sig'ishi uchun): 3-qadam — «Har kod blokini VS Code'dagi o'z fayliga qo'ying va `Ctrl+S` bosing. Avval o'qing: `<link>` qatori bormi?»;
   4-qadam — «Card markazda, ismingiz va 3 ta hobbingiz ko'rinadi. Boshqacha chiqsa, ko'rganingizni aniq yozing: «Card chap chetda turibdi. Markazga qo'y.»». Yashil xulosa — MD'dagidek.
2. **Prompt** «Nusxalash» bilan olinadi (prompt qutisi 2-ko'rinishda); `{…}` joylar ajralib turadi.
3. **Kartochka:** «127.0.0.1:5500 dagi 5500 nima? → Eshik raqami (port)» o'rniga «AI'ga yoziladigan aniq vazifa matni nima deyiladi? → Prompt» (port — dars mavzusidan tashqari tafsilot; 127.0.0.1 kartasi qoldi).
4. **Arena variantlari (✔ o'rni o'zgarmagan, `lint:tell` 0):** 1-savol `Photoshop`·`Paint` → `Excel`·`PowerPoint`; 4-savol uzunliklar tenglashdi
   («Sahifani jonli ochadigan dastur»); 5-savol «Pastdagi ko'k status bar chizig'ida» (qavssiz); 7-savol «Port, ya'ni eshik raqami» (tiresiz).
5. **Emoji:** yangi ekran emojisiz; qolgan 7 error eski qismlarda → `KATTA_TOZALASH.md` F-1013-E (q0 A).
