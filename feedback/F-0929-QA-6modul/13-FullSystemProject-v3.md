# 6-Modul (LMS: 8-Modul) · 13-dars «Loyiha kuni: to'liq tizim» — MD v3 (172-qonun qolipi, G3)

Fayl: `src/6-Modull/FullSystemProjectLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** (21 edi) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: `13-FullSystemProject-v2.md` · qolip namunasi: `feedback/F-1002-mexanizm/05-BotAiProject-v2.md` (`ScreenBlok`) · uslub: `01-SystemArchitecture-v3.md`.
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi — `.jsx` ga hozir tegilmaydi.
⚠️ Ballik testlarda to'g'ri javob O'RNI o'zgarmaydi (3-ekran A — eski s4 · 5-ekran D — eski s9; arena kaliti o'zgarmaydi).
Menyu nomi (205): «Loyiha kuni: to'liq tizim» — App.jsx bilan bir xil, o'zgarmaydi. Oldingi: 12-dars PM «Bugun qaysi ish boshlanadi?» · keyingi: 14-dars PM «Raqamingiz nimani isbotlaydi?».
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60. Sarlavha yonidagi `(NN)` — belgilar soni.

---

## A. Darsning tayanchi

1. **Bitta natija.** Dars oxirida o'quvchining tizimi serverda ishlaydi: web, mobil ilova va bot bitta Backend orqali bitta Database'ga yozadi,
   har buyurtma admin chatiga keladi. Natija 1-ekranda ko'rsatiladi, 3 blokda quriladi, 6-ekranda sanaladi.
2. **1-dars g'oyasining yakuni.** «Ko'p kirish yo'li, bitta tizim» 1-darsda xaritada chizilgan (10 va 12-ekran: «Shu tizimni 13-darsda to'liq qurasiz»);
   bugun o'sha xarita haqiqiy repo'da ishlaydi.
3. **Atamalar (bir ma'no — bir so'z, 1-dars v3 bilan bir xil):** kirish yo'li (web · mobil · bot; «kanal» — yo'q) · Backend · Database («baza» — yo'q) ·
   ulanish joyi (eski so'z olingan, D8) · test jadvali («matritsa» — yo'q) · end-to-end test (4-ekranda harakatdan keyin nomlanadi, T-011) · admin xabari ·
   deploy (serverga joylash — bot darslarida o'tilgan) · ishga tushirish.
4. **Texnik aniqlik (repo bo'yicha, taxmin emas).** Web va mobil Backend'ga `POST /buyurtma` so'rovi bilan keladi. Bot Backend'ning ichida ishlaydi —
   `BuyurtmaService.yoz` ni to'g'ridan chaqiradi (`telegram.service.ts`). Botdagi AI (Gemini, bot darslaridagi agent) ham buyurtmani `saveOrder` asbobi orqali
   o'sha `yoz` bilan yozadi (`agent.service.ts`). Demak hamma yo'lga kerak qoida `yoz` ichida turishi kerak — darsning markaziy xatosi shundan chiqadi (4-ekran, A2).
   🔴 v2 dagi «AI buyurtma yo'lida emas» repo'da noto'g'ri — olindi.
5. **Metafora yo'q** (shahar — 1-dars qarori). Rol «tizim arxitektori» olindi (ortiqcha matn, 109). «1-bosqich yakuniy loyihasi» — faqat yakun ekranida.
6. **Amaliyot bloki** — 5-Modul qolipi (05-v2 A-2…A-6): 4 qadam, «Bajardim» qulfi, prompt qutisi `{…}` + «Nusxalash», o'ngda kutilgan natija (namuna AvtoPizza),
   xato bo'lsa bitta gap «Shu xato chiqdi: {xato}. Tuzat.», pastda ortda qolgan qatori. Prompt — AI'ga buyruq, sen-formada (T-002).
7. **Matn o'lchovi (162/164, §225):** sarlavha ≤55, Mentor ≤2 gap va sarlavhani takrorlamaydi, xulosa ≤110, hook javobi ≤120, xato izohi ≤60.
   Yuzada emoji yo'q (185); ✓ ✗ → × — belgilar.

---

## Darsning ipi va bitta vizual

- **Hook:** uch qism alohida sinalgan → «birga ishlashini qanday tekshirasiz?»
- **Ip (ot-shaklda, §224):** Yig'ish → Sinash → Xatoni topish → Tuzatish → Ishga tushirish.
- **Namuna:** AvtoPizza (bot darslari, 8 va 11-darslar bilan bir ip). O'quvchi — o'z g'oyasi; kutilgan natija AvtoPizza bilan ko'rsatiladi.
- **Bitta vizual — tizim xaritasi** (1-dars `SysMap` qayta ishlatiladi; 13-dars to'plami bitta manbada — 180):
  - yuqorida uch kirish yo'li — brauzer (web), telefon ramkasi (mobil), Telegram chat (bot), hammasida AvtoPizza;
  - o'rtada **Backend** — server qutisi, ichida ikki kichik joy: `POST /buyurtma` va `yoz`;
  - pastda **Database** — `buyurtmalar` jadvali (`# · pitsa · manzil`, A1 dan keyin `kirish` ustuni ham);
  - o'ngda **Admin chati** (Telegram), bot yonida **AI** (Gemini) tuguni.
  - Holatlar: kulrang (sinalmagan) → oq (ishlayapti) → accent (joriy) → yashil (o'tdi) → qizil (uzildi). Konvert — buyurtma.
  - **Test jadvali** — xaritaning jadval ko'rinishi, xarita ostida: 3 qator (Web · Mobil · Bot) × 4 ustun (Yuborildi · Database'da · Admin xabari · Mijozga tasdiq).
    Har katak xaritadagi bitta chiziq: katak qizil bo'lsa, o'sha chiziq ham qizil.
  - Ishlatiladi: 0 (xarita tug'iladi) · 1 (tayyor holat) · 2 (yo'llar `yoz` da uchrashadi) · 4 (test jadvali) · A1–A3 (kutilgan natija: jadval, admin chati).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Uch qism birga ishlashini qanday tekshirasiz?** (45)
- Mentor: Web va mobil ilovani shu modulda, botni bot darslarida qurgansiz — har biri alohida sinalgan. Bugun ular bitta tizim bo'lib ishlashi kerak.
- Maket (chap): uch kirish yo'li maketi yonma-yon — brauzer, telefon, Telegram chat (AvtoPizza, «Pepperoni · Buyurtma»); har birining ostida kichik yashil
  yorliq «alohida ✓». Pastda bitta Backend tuguni — hali hech narsaga ulanmagan.
- Variantlar (radio):
  - Har birini yana alohida sinab ko'raman
  - Buyurtmani boshidan oxirigacha kuzataman
  - Kodini o'qib, xato yo'qligini ko'raman
- Javob — 2-variant: **Aynan!** Bugun har kirish yo'lidan buyurtma berib, uni admin xabarigacha kuzatamiz. (81)
- Javob — 1-variant: **Qiziq fikr!** Alohida sinovda qismlar ulangan joy ko'rinmaydi. Bugun buyurtmani oxirigacha kuzatamiz. (99)
- Javob — 3-variant: **Qiziq fikr!** Kod o'qish foydali, lekin ulanish xatosi tizim ishlaganda chiqadi. Bugun buyurtmani oxirigacha kuzatamiz. (117)
- **Harakat → Vizual o'zgarish:** variant tanlanadi → uchala maketdan Backend'ga chiziq chiziladi, ostida Database, o'ngda Admin chati paydo bo'ladi —
  tizim xaritasi shu yerda tug'iladi; hamma chiziq kulrang (birga hali sinalmagan).
- Jonli: sof so'rovnoma — `correct: false` hammaga, maqtov yo'q (J-026).
✎ v2 sarlavha «Hamma qism tayyor. Ishga tushirishdan oldingi oxirgi qadam nima?» (64, 2 qator) → savol + maket · olti qism ro'yxati (emoji) → uch maket (185) ·
«Darrov e'lon qilamiz» olindi (§221) · Mentor 3 gap → 2 · javoblar 150–170 → ≤120 · ma'no saqlandi: avval butun oqimni sinash.

## 1 · Bugun quramiz  ← QReja
- Eyebrow: Reja
- Sarlavha: **Dars oxirida tizimingiz shunday ishlaydi.** (41)
- Mentor: Bu AvtoPizza — namuna; sizniki o'z g'oyangiz bilan bo'ladi, qadamlar esa bir xil.
- Chapda «Dars oxirida …»: tizim xaritasi (hamma chiziq yashil, Backend ustida yorliq «server») va Admin chati «AvtoPizza · admin»:
  - #71 · web · Pepperoni · Chilonzor, 12-uy
  - #72 · mobil · Margarita · Yunusobod, 4-uy
  - #73 · bot · Pishloqli · Sergeli, 7-uy
- O'ngda 3 qadam (bosilmaydi, P-015):
  - 01 · Yig'ish — uch kirish yo'li bitta jadvalga yozadi · teg `kirish`
  - 02 · Sinash va tuzatish — test jadvali qizil katakni ko'rsatadi · teg `TEST.md`
  - 03 · Ishga tushirish — Backend serverda, web va mobil unga ulanadi · teg `Render`
- Pastki qator (mono, kichik): repo `TelegramBotNest` · boshlang'ich holat `dars-6-13-start` · tayyor namuna `dars-6-13-done`
- **Harakat → Vizual o'zgarish:** bosiladigan narsa yo'q (reja); xaritada konvert uch yo'ldan navbat bilan Backend'ga, undan Database va Admin chatiga yuradi,
  admin chatida qator ajralib kiradi (jonli maket, DE-200).
- Tugmalar: Orqaga · Boshlaymiz
✎ v2 1-ekran (5 qadam, «Bugungi maqsad» bloki, «Siz — tizim arxitektori») + 13-ekran «bir o'quvchining yo'li» (YIG'DI · SINADI · TUZATDI · ISHGA TUSHIRDI)
→ tayyor natija + 3 qadam · sarlavha 2 qator → 1.

## 2 · Tushuncha 1 — bitta yozish joyi  ← QTushuncha
- Eyebrow: Tushuncha · bitta yozish joyi
- Sarlavha: **Buyurtma qaysi yo'ldan kelsa ham, qayerda yoziladi?** (51)
- Mentor: Uchala kirish yo'li bitta jadvalga yozadi, farq yo'lning o'rtasida. Har yo'ldan bitta buyurtma yuboring.
- Bashorat (ballsiz, 181): **Bot buyurtmasi ham `POST /buyurtma` dan o'tadimi?** · Ha, uchalasi ham o'tadi · Yo'q, bot boshqacha keladi
- Vizual: tizim xaritasi; Backend qutisi ochiq — ichida `POST /buyurtma` va `yoz` joylari; Database jadvali bo'sh.
- **Harakat → Vizual o'zgarish:** maketdagi «Buyurtma» bosiladi (brauzer, telefon yoki chat) →
  - web / mobil: konvert maketdan `POST /buyurtma` ga, undan `yoz` ga, undan Database'ga; chiziq ustida so'rov bir lahza ko'rinadi `{ pitsa, manzil }`;
    jadvalda yangi qator ajralib kiradi (`#61 · Pepperoni` / `#62 · Margarita`), qator o'z maketi rangida bir lahza yonadi;
  - bot: konvert chatdan Backend ichiga kiradi va `POST /buyurtma` ni chetlab, to'g'ridan `yoz` ga boradi — `POST /buyurtma` kulrang qoladi; jadvalda `#63 · Pishloqli`.
  - 3/3 da uchala chiziq `yoz` tugunida uchrashadi, u yashil yonadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: bot `POST /buyurtma` ni chetlab o'tadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Uchala yo'l bitta `yoz` da uchrashadi. Hamma yo'lga kerak qoida shu yerga yozilishi kerak. (88)
- Tugma (pastki): Har yo'ldan yuboring (N/3) → Davom etish
- Tugagach (199): harakat paneli yopiladi, xarita butun enga chiqadi, `yoz` tuguni fokusda.
✎ v2 2-ekran (6 matn-karta «Bularning hammasi bilan ishladingiz») + 3-ekran («[kanal] kanali» karta) + 6-ekran («Buyurtma yo'li · jonli») → bitta harakat:
o'quvchi buyurtma yuboradi, xaritada yo'l ko'rinadi (DE-184; F-1004-36 sinfi — chap ro'yxat → o'ng matn yo'q) · 🔴 «AI buyurtma yo'lida emas» olindi (A-4) ·
xulosa 140 → 88 · bashorat qo'shildi.

## A1 · Amaliyot 1 — yig'ish  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 1 · yig'ish
- Sarlavha: **Uchala yo'l bitta jadvalga yozsin.** (34)
- Mentor: Hozir jadval buyurtma qaysi yo'ldan kelganini bilmaydi, test esa shuni so'raydi. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. Uchta terminal: `npm run start:dev` (Backend va bot) · `cd web && npm run dev` ·
     `cd mobile && npx expo start` (telefonda Expo Go). «Telegram bot ulandi» chiqsin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > **{jadval nomi}** jadvaliga `kirish` ustuni qo'sh: qiymati `web`, `mobil` yoki `bot`, eski qatorlar uchun `bot`.
     > **{so'rov yo'li}** uni so'rovdan olsin; `web/` va `mobile/` o'z qiymatini yuborsin, bot va AI yozgan buyurtma `bot` bo'lsin.
     > Boshqa joyga tegma.
  3. **Ishga tushirish** — uchala terminal xatosiz: Backend o'zi qayta yuklanadi, web va Expo sahifani yangilaydi. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — brauzer, telefon va Telegramdan bittadan buyurtma bering. Neon'dagi **SQL Editor**'da:
     `SELECT id, kirish, pitsa FROM buyurtmalar ORDER BY id DESC LIMIT 3;` — uch qator, uch xil `kirish`.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)» — jadval-karta (Neon · SQL Editor):
  | id | kirish | pitsa |
  |---|---|---|
  | 63 | bot | Pishloqli |
  | 62 | mobil | Margarita |
  | 61 | web | Pepperoni |
- **Harakat → Vizual o'zgarish:** «Bajardim» → chapdagi qadam ✓, keyingisi ochiladi; 4/4 da qadam paneli yopiladi, kutilgan natija fokusga (199).
- Hammasi bajarilgach (yashil): Uch yo'l — bitta jadval. Endi har yo'lni oxirigacha sinaymiz. (61)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-13-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 16-ekran «Amaliyot · VS Code» 1–3-bosqichi (backend'ni ishga tushirish, buyurtma berish, bazada tekshirish) → haqiqiy repo ustida, Antigravity bilan ·
`npm run dev` (backend uchun noto'g'ri edi — repo'da `start:dev`) tuzatildi · «Database'da» tekshiruvi — aniq SQL qatori.

## 3 · 1-savol ✅ (jonli ball)  ← QTest · kalit **A** (eski s4: 0)
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Web, mobil va bot nega bitta tizim?** (35)
  - ✔ Uchalasi bitta Backend va Database'ga yozadi
  - Uchalasi bitta dasturlash tilida yozilgan
  - Uchalasi bitta kompyuterda ishga tushadi
  - Uchalasining tugma va ranglari bir xil
- To'g'ri izohi: Kirish yo'li uchta, buyurtma esa bitta `yoz` orqali bitta jadvalga tushadi.
- Xato izohlari (≤60):
  - B: Bir tilda yozilgan ikki ilova ham alohida tizim bo'ladi.
  - C: Mobil ilova telefonda ishlaydi, lekin tizim baribir bitta.
  - D: Ko'rinish tizimni bog'lamaydi — ular nimaga yozadi?
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Eski 4-ekran (1-savol). «kanal» → «kirish yo'li», «baza» → «Database» · variantlar bir shaklda («Uchalasi …») va uzunligi teng · to'g'ri izohi
182 → bitta gap, «To'g'ri!» so'zisiz · D xato izohi javobni aytardi («umumiy backend va baza») → savolga aylandi (S-010). Kalit o'rni (A) o'zgarmadi.

## 4 · Tushuncha 2 — test jadvali  ← QTushuncha
- Eyebrow: Tushuncha · test jadvali
- Sarlavha: **Qaysi yo'l buyurtmani oxirigacha yetkazmaydi?** (45)
- Mentor: Har qism alohida ishlagan edi — endi buyurtmani har yo'ldan oxirigacha kuzatamiz. Qator nomini bosing.
- Bashorat (ballsiz, 181): **Nechta katak qizil bo'ladi?** · Hech biri · Bir-ikkitasi · Yarmidan ko'pi
- Vizual: tizim xaritasi + ostida test jadvali (Web · Mobil · Bot × Yuborildi · Database'da · Admin xabari · Mijozga tasdiq), hamma katak kulrang.
- **Harakat → Vizual o'zgarish:** qator nomini bosish → konvert o'sha yo'ldan yuradi; har qadamda xaritadagi chiziq va jadvaldagi katak birga yashil yonadi.
  Bot qatorida konvert `yoz` dan Admin chatiga yetmaydi: chiziq qizil uziladi, «Admin xabari» katagi qizil, admin chatida yangi qator yo'q; qolgan kataklar yashil.
  Qizil katak ostida bir qator: «Admin chatida bot buyurtmasi yo'q.» (34)
- Natija qatori: «Taxminingiz: … · haqiqatda: bitta qizil — Bot × Admin xabari».
- Xulosa: Har yo'lni oxirigacha sinash end-to-end test deyiladi. Bu jadvalda u bitta xatoni topdi. (88)
- Tugma (pastki): Har qatorni sinang (N/3) → Davom etish
- Tugagach (199): harakat paneli yopiladi, xarita va jadval butun enga; qizil chiziq bir lahza miltillaydi.
✎ v2 5-ekran (end-to-end 5 qadam, «Bosing»), 8-ekran (4 ulanish joyi kartasi) va 9-ekran («Testni ishga tushiring» — kataklar o'zi yashil bo'lardi) →
o'quvchi har qatorni o'zi yurgizadi, katak = xaritadagi chiziq (DE-184) · 🔴 qizil katak «Mobil × Bot xabar» → «Bot × Admin xabari» — repo'dagi haqiqiy sabab
(web va mobil `POST /buyurtma` dan o'tadi, bot o'tmaydi; A-4) · «🐞 XATO TOPILDI» olindi (185) · atama harakatdan keyin (T-011) · xulosa 117 → 88 ·
v2 «12 katakli matritsa — bugungi loyiha uchun» → «Bu jadvalda» (T-043).

## A2 · Amaliyot 2 — sinash va tuzatish  `(≈25 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 2 · sinash va tuzatish
- Sarlavha: **Test jadvalini to'ldiring, qizil katakni tuzating.** (50)
- Mentor: Sizning tizimingizda qizil katak boshqa joyda chiqishi mumkin — jadvalni o'zingiz to'ldiring. «1 · Sinash»dan boshlang.
- Qadamlar:
  1. **Sinash** — har yo'ldan bitta buyurtma bering. `TEST.md` dagi har katakka ✓ yoki ✗ qo'ying: «Database'da» — Neon'dagi `SELECT`,
     «Admin xabari» — admin chati, «Mijozga tasdiq» — mijoz ko'rgan javob.
  2. **Tuzatish prompti** — qizil katakni aniq yozing, «Nusxalash», Antigravity'ga:
     > Test jadvalida qizil katak: **{kirish yo'li}** × **{qadam}**. Boshqa yo'llarda bu qadam ishlaydi.
     > Avval tushuntir: bu qadam kodda qayerda va nega **{kirish yo'li}** unga yetib bormaydi.
     > Keyin faqat shu joyni tuzat: qoida hamma yo'l uchun bitta joyda bo'lsin.
  3. **O'qish va ishga tushirish** — AI tushuntirishini o'qing: sabab jadvaldagi qizil katakka mos keladimi? Terminal xatosiz. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Qayta sinash** — o'sha yo'ldan yana buyurtma bering va `TEST.md` ni qayta to'ldiring — hamma katak yashil. Botga erkin matn ham yozing:
     «2 ta Margarita, Chilonzor 12» — AI yozgan buyurtma ham admin chatiga kelsin.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - Antigravity (AI izohi): Admin xabari `buyurtma.controller.ts` da, `POST /buyurtma` ichida yuboriladi. Bot `yoz` ni to'g'ridan chaqiradi, shuning uchun
    xabar ketmaydi. Xabarni `BuyurtmaService.yoz` ichiga ko'chirdim.
  - Admin chati: `#64 · bot · Pishloqli · Sergeli, 7-uy` · `#65 · bot · 2 × Margarita · Chilonzor, 12-uy`
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 4/4 da panel yopiladi, o'ngdagi admin chati fokusga, yangi xabarlar ajralib kiradi (199).
- Hammasi bajarilgach (yashil): Jadval to'liq yashil: xabar endi hamma yo'l uchun bitta joyda. (62)
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-13-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 11-ekran «Xatoni tuzatish · jonli» (XATO → SABAB: 3 ehtimol → TUZATISH → QAYTA SINOV, 4 matn-karta) → haqiqiy tizimda: sababni AI tushuntiradi,
o'quvchi o'qib tekshiradi (diagnostika fikri promptda: «avval tushuntir, keyin faqat shu joyni») · v2 16-ekran 4–5-bosqichi (bot xabari, qizil katak) shu yerda ·
2-ekran xulosasi («qoida shu joyda yoziladi») amalda ishlatiladi.

## 5 · 2-savol ✅ (jonli ball)  ← QTest · kalit **D** (eski s9: 3)
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Bot buyurtmasi Database'da bor, admin xabar olmadi. Xato qayerda?** (65 — `h-ask`, ikki qism, 9 so'z — S-001)
  - Tokenda — bot Telegram'ga ulanmagan
  - Gemini'da — AI kaliti tugab qolgan
  - Mijozda — manzilni xato kiritgan
  - ✔ Bot yo'lida — xabar kodiga yetmaydi
- To'g'ri izohi: Bot kirish yo'li xabar yoziladigan joyni chetlab o'tadi — ulanish joyi shu.
- Xato izohlari (≤60):
  - A: Token ishlayapti — buyurtmani aynan bot qabul qildi.
  - B: Buyurtma yozildi — AI qatnashgan bo'lsa ham, ishini qildi.
  - C: Xato manzil ham xabarda chiqardi — xabar esa yo'q.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Eski 10-ekran (3-savol «Ulanish joyidagi xatolarni qanday topamiz?») → vaziyat-savol: o'quvchi jadval faktlarini o'qib, ulanish joyini topadi ·
eski variantlar («Umuman sinamasdan…») bir xil yanglishni takrorlardi → har biri alohida yanglish tasavvur (S-004): token, AI, mijoz ·
«end-to-end» faqat izohda edi — endi hech qaysi variantda kalit so'z yo'q. Kalit o'rni (D) o'zgarmadi.

## A3 · Amaliyot 3 — ishga tushirish  `(≈15 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 3 · ishga tushirish
- Sarlavha: **Tizimni serverga chiqaring va qayta sinang.** (43)
- Mentor: Laptop yopilsa, tizim to'xtaydi — serverda u mijozlar uchun ishlaydi. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — render.com'da o'z `TelegramBotNest` xizmatingizni oching (bot darslarida joylagansiz). **Environment** bo'limiga `ADMIN_CHAT_ID` qo'shing —
     qiymati `.env` dan. Maxfiy qiymatlar faqat `.env` va Render'da turadi: kodda ham, GitHub'da ham emas.
  2. **Prompt** — server manzilini yozing, «Nusxalash», Antigravity'ga:
     > `web/` va `mobile/` dagi Backend manzilini **{Render manzilingiz}** ga almashtir.
     > Manzil har birida bitta joyda tursin. Boshqa joyga tegma.
  3. **Ishga tushirish** — `git push`: Render o'zi qayta joylaydi, loglarda «Telegram bot ulandi (webhook)» chiqsin. Laptopdagi Backend'ni to'xtating (Ctrl+C) —
     bitta token ikki joyda ishlamaydi. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefonda Expo Go, brauzerda web, Telegramda bot: har biridan buyurtma bering va `TEST.md` ni server uchun qayta to'ldiring.
     Birinchi javob 30–60 soniya kechikishi mumkin — bepul server uyg'onadi.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - Render loglari (terminal maketi): `Server 10000-portda ishlayapti` · `Telegram bot ulandi (webhook)`
  - Admin chati: `#71 · web · Pepperoni · Chilonzor, 12-uy` · `#72 · mobil · Margarita · Yunusobod, 4-uy` · `#73 · bot · Pishloqli · Sergeli, 7-uy`
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 4/4 da panel yopiladi, admin chati fokusga, uch xabar navbat bilan kiradi (199).
- Hammasi bajarilgach (yashil): Tizim serverda: uch kirish yo'li, bitta Backend, bitta Database. (64)
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-13-done` (Render manzilini o'zingiznikiga almashtiring)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 12-ekran «Ishga tushirish ro'yxati» (4 band: sozlama · test yashil · mobil telefonda · Backend serverda) → 4 qadam bo'lib bajariladi ·
`.env` xavfsizlik qoidasi (frontend kodiga emas, GitHub'ga emas) 1-qadamda · «24/7», «ship», «🚀 Ishga tushirishga tayyor!» yo'q ·
v2 8-ekran ulanish joylari (backend manzili, `BOT_TOKEN`) — 3-qadamdagi haqiqiy holat (manzil, bitta token).

## 6 · Natijalar (podium) — o'zgarmaydi
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 1 — Bitta tizim · 2 — Ulanish joyidagi xato

## 7 · Yakun  ← QYakun (+ QKartochka)
- Eyebrow: 1-bosqich yakuniy loyihasi
- Belgi: ✓ Tizim ishlayapti
- Sarlavha: **Endi tizimni yig'ib, sinab, ishga tushira olasiz.** (49)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Web, mobil va bot bitta Backend orqali bitta Database'ga yozsa — bu bitta tizim.
  - Hamma kirish yo'liga kerak qoida yo'llar uchrashgan joyda yoziladi.
  - End-to-end test qaysi yo'l, qaysi qadamda buzilganini ko'rsatadi.
- Kartochkalar (shu ekranda, `QKartochka`; eyebrow «Takrorlash») — pastdagi jadval.
- Uyga vazifa (`uyga`):
  - **Sinang** — tizimingizni bir tanishingizga bering: u uch yo'ldan buyurtma berib, `TEST.md` ni o'zi to'ldirsin.
  - **Sanang** — Neon'da: `SELECT kirish, COUNT(*) FROM buyurtmalar GROUP BY kirish;` — qaysi yo'ldan nechta buyurtma keldi.
  - **Olib keling** — shu sonlarni yozib, keyingi darsga olib keling.
- Keyingi dars — PM: **Raqamingiz nimani isbotlaydi?** Tizimingiz ishlaganini Demo Day sahnasida bitta raqam bilan ko'rsatasiz.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
✎ v2 15-ekran «Qoida» + 18 (podium yorliqlari) + 19 (kartochkalar) + 20 (yakun) → bitta yakun (5-Modul namunasi) · «Endi siz bilasiz» 5 → 3 (jarayon formulasi
reja va kartochkada bor — §216) · «🎓 … Siz buni qila olasiz» va «🚀» qatorlari olindi (185, kafolat) · uyga vazifa 14-dars bilan bog'landi (14-v2 9-ekran:
«Tizimingiz shu ishni bajarganini qaysi raqam ko'rsatadi?») · sarlavha 57 → 49.

### Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Web, mobil va bot qaysi qismga ulanadi? | Bitta Backend'ga | Kirish yo'li uchta, tizim bitta |
| Nega web va bot bir xil buyurtmalarni ko'radi? | Database bitta | Hamma buyurtma `buyurtmalar` jadvalida |
| Jadval buyurtma qaysi yo'ldan kelganini qayerdan biladi? | `kirish` ustunidan | Qiymati: web, mobil yoki bot |
| Bot buyurtmasi `POST /buyurtma` dan o'tadimi? | Yo'q | Bot Backend ichida — `yoz` ni to'g'ridan chaqiradi |
| Hamma yo'lga kerak qoida qayerda yoziladi? | Yo'llar uchrashgan joyda | Namunada — `BuyurtmaService.yoz` ichida |
| Bitta amalni boshidan oxirigacha sinash nima deyiladi? | End-to-end test | Buyurtmadan admin xabari va tasdiqqacha |
| Qaysi yo'l qaysi qadamda buzilganini nima ko'rsatadi? | Test jadvali | Har yo'l × har qadam — bitta katak |
| Qismlar alohida ishlaydi, birga ishlamaydi — xato qayerda? | Ulanish joyida | Integratsiya xatosi shunday bo'ladi |
| Qizil katakni AI'ga qanday yozasiz? | Yo'l × qadam va qolgani ishlashi | Avval sabab, keyin faqat shu joy |
| Botdagi AI buyurtmani qanday yozadi? | Asbob chaqiradi, Backend yozadi | `saveOrder` — o'sha `yoz` bilan |
| Tizimni serverga joylash nima deyiladi? | Deploy | Namunada — Render, `git push` bilan |
| `ADMIN_CHAT_ID` kabi maxfiy qiymatlar qayerda turadi? | `.env` va Render'da | Kodda va GitHub'da emas |

✎ v2 12 kartadan: «AI buyurtma oqimida ishtirok etadimi? — Yo'q» (repo'da noto'g'ri) → AI asbob orqali yozadi · «Ishga tushirishdan oldin jadval…» va
«jarayon formulasi» → yakun/arena'da bor, o'rniga `kirish` ustuni va «bot `POST /buyurtma` dan o'tmaydi» (darsning yangi bilimi) · «kanal», «baza» → atamalar (A-3).

---

## Nishonlar (3)
- **One System** — Uch kirish yo'li bitta tizim ekanini topdingiz (3-ekran, 1-savol)
- **Seam Finder** — Xato qaysi ulanish joyida ekanini topdingiz (5-ekran, 2-savol)
- **Launch Ready** — Uch amaliyot blokini oxirigacha bajardingiz (A3 «Bajardim» oxirgisi) — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
✎ 4 → 3: «End to End» (eski s5b testi) olindi — ekrani yo'q; «Launch Ready» test emas, amaliyot uchun (memory `nishon-bonus-qismaslik`, 5-dars Bot Builder kabi).

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Uch yo'l — bitta tizim»
   - `kirish: 'web' | 'mobil' | 'bot'` · Uch kirish yo'li — Web, mobil va bot bitta Backend'ga keladi.
   - `BuyurtmaService.yoz(…)` · Bitta yozish joyi — Uchala yo'l bitta `yoz` da uchrashadi.
   - `FROM buyurtmalar` · Bitta jadval — Hamma buyurtma bitta Database'da turadi.
   - Sinfga savol: Nega web, mobil va bot — bitta tizim?
2. 2-savol (5-ekran) — «Xato — ulanish joyida»
   - `Bot × Admin xabari ✗` · Qizil katak — Qaysi yo'l, qaysi qadam buzilganini ko'rsatadi.
   - `POST /buyurtma → xabar` · Sabab — Xabar bitta yo'lda yozilgan, bot uni chetlab o'tadi.
   - `yoz(…) → xabar` · Kichik tuzatish — Qoida yo'llar uchrashgan joyga ko'chadi.
   - Sinfga savol: Bot buyurtmasi bor, admin xabari yo'q — xato qayerda?
✎ v2 4 oyna → 2 (ballik testlar 2 ta) · emoji (🧩🗄️🔀🐞🎯🔧) → kod qatori.

## Jonli viktorina (arena, 12 savol) — ✔ o'rni o'zgarmaydi (3/3/3/3), faqat matn
1. Web, mobil va bot nega «bitta tizim» deyiladi? ✔ Uchalasi bitta Backend va Database bilan ishlaydi · Har birining o'z alohida Database'i bor · Ular alohida ishlaydi, bir-biriga bog'liq emas · Faqat ranglari va logotipi bir-biriga o'xshaydi
2. Jadval buyurtma qaysi yo'ldan kelganini qanday biladi? ✔ Kirish ustunidagi qiymatdan · Buyurtma raqamining kattaligidan · Manzil qatorining uzunligidan · Buyurtma berilgan vaqtdan
3. End-to-end test nimani sinaydi? Bitta funksiyani alohida holda · Sahifa ranglari va dizaynini · ✔ Bitta amalning barcha qadamlarini · Backend kodini o'qib chiqib
4. Integratsiya xatosi qayerda bo'ladi? ✔ Qismlar ulangan joyda · Faqat frontend rangida · Hech qachon paydo bo'lmaydi · Faqat Database ichida
5. Test jadvalida bitta qizil katak nimani bildiradi? Hammasi ishlayapti — xato yo'q · ✔ O'sha yo'l × qadamda xato bor · Dizayn ishlari tugadi · Database juda tez ishlayapti
6. Ulanish joyidagi xatoni qanday tuzatamiz? Butun tizimni noldan qayta yozamiz · Umuman e'tibor bermay qo'yamiz · ✔ Sababini topib, kichik tuzatish qilamiz · Faqat tugma rangini o'zgartiramiz
7. Ishga tushirishdan oldin nima shart? Hech narsa — hozir chiqaramiz · ✔ Oqim sinalgan, sozlamalar to'g'ri · Ko'proq rang va bezak qo'shilgan · Logotip va nom tayyor bo'lgan
8. «Deploy» nima demak? Kodni butunlay o'chirish · Chiroyli dizayn chizish · ✔ Tizimni serverga joylashtirish · Yangi dasturlash tilini o'rganish
9. Mobil buyurtma admin chatiga keladimi? Yo'q — admin faqat botdagini ko'radi · Faqat qo'lda yuborilganda keladi · Mobil ilovada admin umuman yo'q · ✔ Keladi — xabar bitta joyda yoziladi
10. Tizimga yangi kirish yo'li (mobil) qo'shishning oson yo'li? Butun tizimni noldan qayta yozish · ✔ Ilovani yozib, o'sha Backend'ga ulash · Mobil uchun alohida Database qurish · Mobil uchun yangi Backend yozish
11. Botdagi AI buyurtma bilan nima qiladi? O'zida buyurtmalarni doimiy saqlaydi · Backend'ni chetlab Database'ga yozadi · Hech qanday chegarasiz qaror qiladi · ✔ Asbob chaqiradi, buyurtmani Backend yozadi
12. To'liq tizimni yetkazish tartibi qanday? Ishga tushirish → sinash → yig'ish → tuzatish → xatoni topish · Sinash → yig'ish → ishga tushirish → xatoni topish → tuzatish · Tuzatish → xatoni topish → sinash → yig'ish → ishga tushirish · ✔ Yig'ish → sinash → xatoni topish → tuzatish → ishga tushirish
✎ 2-savol («Ko'p kirish yo'li…» — 1-savolning takrori) → `kirish` ustuni · 9-savol («boshqa kanalda ko'rinadimi?» — bot `/buyurtmalarim` faqat o'z buyurtmasini
ko'rsatadi, javob noaniq edi) → admin xabari · 🔴 11-savol: «Buyurtmani bazaga o'zi yozadi» tuzoq-varianti repo'da yarim rost edi (agent `saveOrder`) →
«Backend'ni chetlab yozadi» (rad etiladigan qism aniq), to'g'risi — asbob orqali · 7-savol «SHART» (katta harf), «darrov» (§221) · «kanal», «baza» → atamalar.

**Fon so'zlari** (R-008; kodda {uz, ru}): arena — frontend · backend · Database · end-to-end · deploy · buyurtma · kirish yo'li · ulanish joyi · tizim · `.env` ·
test jadvali (o'yin qatlami belgilari 🧩 🖥️ 🤖 🚀 qoladi) · uyga vazifa banneri — amaliyot · loyiha · mashq · natija (o'zgarmaydi).
✎ «baza», «ko'p kanal», «ulanish» → «Database», «kirish yo'li», «ulanish joyi» (T-014).

---

## KOD — razrabotkada o'zgaradigan narsalar
1. `SCREEN_META` 21 → 11: hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary. `INLINE_KEYS` 5 → 2:
   3-ekran **0** (eski s4) · 5-ekran **3** (eski s9). `RECAPS`, `Q_LABELS`, `ACH_TRIGGERS` — yangi indekslar bilan (S-025).
2. **Amaliyot bloki** (A1–A3): 5-Modul `ScreenBlok` + `PromptBox` (`BotAiProjectLesson.jsx`). O'ngdagi natija uch turda: jadval-karta (A1), AI izohi + admin chati (A2),
   terminal-log + admin chati (A3) — `TgChat` va kichik `JadvalKarta`/`LogKarta` maketlari. «Bajardim» → `PRACTICE_BASE`.
3. **Tizim xaritasi:** 1-dars `SysMap` + 13-dars to'plami (`SYS_NODES`: uch kirish yo'li, Backend ichida `POST /buyurtma` va `yoz`, Database jadvali, Admin chati, AI);
   `TestJadval` xarita bilan bitta manbadan (katak ↔ chiziq). `// qolip-maket:` e'loni.
4. Ekran turlari: 0 `QKirish` (maket + radio) · 1 `QReja` · 2, 4 `QTushuncha` (`zoom`, `tugadi`, `QBashorat`, `QTaxmin`) · 3, 5 `QTest` · 7 `QYakun` + `QKartochka`.
5. Nishonlar 4 → 3 (`ACHIEVEMENTS`): One System (3-ekran), Seam Finder (5-ekran), Launch Ready (A3 oxirgi «Bajardim», bonus).
6. `QUIZ_BANK`: 2, 9, 11-savol matni yangi; 1, 4, 5, 7, 10 — atamalar; ✔ o'rni o'zgarmaydi (q23 3/3/3/3).
7. `FULL_FLASHCARDS` 12 — yangi matn; `HOMEWORK` 3 band; keyingi dars qatori; `QZ_BG_SHAPES` so'zlari {uz, ru}.
8. O'lik kod olinadi: `ScreenLivePractice`/`ScreenPractice`, yakuniy `DragDrop` (eski 17-ekran), eski 2, 3, 5, 6, 7, 8, 10, 11, 13, 14-ekran komponentlari.
9. `narrow` faqat 3, 5, 6-ekranlarda (171).
10. Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 warn · `lint:emoji` (qolip) 0 · `lint-qolip` 0 error · surat 1280 + 390.
11. ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `TelegramBotNest` ga nima qo'shiladi (teglar `dars-6-13-start` / `dars-6-13-done`)
1. **`dars-6-13-start`** = 11-darsning tayyor holati: Backend (bot, AI-agent, `buyurtmalar`) + 8-darsdan `web/`, `GET /menyu`, `POST /buyurtma`,
   admin xabari (`ADMIN_CHAT_ID`) **faqat `POST /buyurtma` ichida** + 9–11-darslardan `mobile/` (Expo, Backend manzili bitta joyda).
   `buyurtmalar.telegram_id` web va mobil uchun bo'sh bo'la oladi (8-darsda). Bot yo'li admin xabarini olmaydi — bu A2 da topiladigan haqiqiy ulanish xatosi.
2. **`TEST.md`** (start tegida, bo'sh): 3 qator (Web · Mobil · Bot) × 4 ustun (Yuborildi · Database'da · Admin xabari · Mijozga tasdiq) + har ustun nimani
   tekshirishi bir qatorda (SQL qatori, admin chati, mijoz javobi).
3. **A1:** `Buyurtma` entity'ga `kirish` ustuni (`varchar`, standart `'bot'` — eski qatorlar uchun; `synchronize: true` o'zi qo'shadi); `POST /buyurtma` uni so'rovdan oladi;
   `web/` va `mobile/` so'rovida `kirish`; bot (`telegram.service.ts`) va agent (`saveOrder`) `'bot'` yozadi.
4. **A2:** admin xabari `buyurtma.controller.ts` dan `BuyurtmaService.yoz` ichiga ko'chadi; shakli `#{id} · {kirish} · {pitsa} · {manzil}`; `TEST.md` to'ldirilgan namuna (hammasi ✓).
5. **A3:** `web/` va `mobile/` dagi Backend manzili — Render manzili (done tegida namuna manzil `https://SIZNING-XIZMAT.onrender.com`); README «Serverga joylash»
   bo'limiga `ADMIN_CHAT_ID` qatori; «Darslar va teglar» jadvaliga 6-Modul qatorlari (8, 11, 13).
6. Teg `dars-6-13-done` — A1–A3 oxiri (shu MD'dagi AvtoPizza namunasi), MD tasdiqlangach yoziladi.

---

## Savollar (foydalanuvchi hal qiladi)
1. Ortda qolgan qatori: A1 va A2 da `dars-6-13-start`, A3 da `dars-6-13-done` (topshiriqda hammasi `done`) — **tavsiya: shunday**, `done` A2 dagi xatoni oldindan tuzatib qo'yadi.
2. G3 repo ketma-ketligi: 13-darsning bot xatosi 8-darsda admin xabari `POST /buyurtma` ichida yozilishiga tayanadi; `web/`, `mobile/`, `GET /menyu`, `POST /buyurtma` nomlari
   8, 9–11-darslar MD'lari bilan bir xil bo'lishi kerak — **tavsiya: asosiy seans G2/G3 «REPO» ro'yxatlarini bitta jadvalda solishtiradi.**
3. AI nomi: 1-dars xaritasida «AI · Claude», repo'da Gemini — 13-dars repo bo'yicha «Gemini» deydi — **tavsiya: shunday** (1-darsni keyin «AI» deb umumlashtirish mumkin).
4. Web serverga chiqmaydi (frontend deploy kursda o'tilmagan): Backend serverda, web laptopdan unga ulanadi — **tavsiya: shunday**, web deploy — Demo Day oldidan alohida.

---

## GATE M — o'z tekshiruvim
- ✓ Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (12 PM «Bugun qaysi ish boshlanadi?» · 14 PM «Raqamingiz nimani isbotlaydi?»; nom o'zgarmaydi)
- ✓ Bitta misol-ip (AvtoPizza, bot darslari va 8/11 bilan bir) · metafora yo'q · bitta vizual dars bo'yi — tizim xaritasi + uning test jadvali
- ✓ Har tushuncha-ekranda «Harakat → Vizual o'zgarish» (2, 4; hook va bloklarda ham) — matn-karta yo'q
- ✓ Sarlavhalar 34–51 (≤55), bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosalar 61–88 · hook javoblari 81–117 · xato izohlari ≤60
  (2-savol matni 65 — `h-ask` savoli, sarlavha emas; S-001 bo'yicha 9 so'z)
- ✓ Atamalar 1-dars v3 bilan bir xil (kirish yo'li, Backend, Database, ulanish joyi) · siz-forma; formula ot-shaklda; prompt sen-formada (T-002)
- ✓ Testlar: variantlar bir shaklda, uzunligi yaqin; kalit so'z faqat to'g'rida emas («ulanmagan» A da ham, «bitta» hammasida) · ✔ o'rni: A va D o'zgarmagan
- ✓ Final DnD yo'q (172 qolipi; tartib arena 12-savolda) — uya izohi masalasi yo'q
- ✓ Emoji yo'q (arena belgilari, nishon medali — o'yin qatlami) · kafolat gaplari olindi («24/7», «darrov», «Siz buni qila olasiz»)
- ✓ Ichki kodlar yo'q («bot darslarida», «8-darsda» — modul raqamisiz) · tarixiy voqea yo'q · «KOD» (11) va «REPO» (6) ro'yxati to'liq
- ✓ Karta T · P · S ko'rildi: T-011 (end-to-end harakatdan keyin) · T-014 (kanal/baza/matritsa → bitta so'z) · T-043 («bu jadvalda») · T-045 (AI modeli repo bo'yicha
  to'g'rilandi) · P-052/P-067 (bitta vizual, harakat) · P-059 (blok 4 qadam; A2 da «Sinash → Tuzatish prompti → O'qish → Qayta sinash» — 05-v2 A3 kabi moslangan) ·
  P-064 (bashorat 2, 4) · P-025 (uyga vazifa 3 qadam, yakunda) · S-001/S-004/S-010 (2-savol vaziyatli, har xato alohida yanglish, izoh javobni aytmaydi) · S-026 (recap — kod qatori)
- ✗ (ochiq) Sarlavha/Mentor uzunligi `lint:olchov` bilan kodda o'lchanadi — MD'dagi sonlar qo'lda sanalgan; ru — 6-RU bosqichida
