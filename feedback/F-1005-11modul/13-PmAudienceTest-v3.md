# 11-Modul · 13-dars (PM + amaliyot) «Uch foydalanuvchidan keyin nimani tuzatasiz?» — MD v3

Fayl: `src/9-Modull/PmAudienceTestLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m9-13` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; tayanch 4 «PM+PRAKT») · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, yozilgani ixcham qatorga uchadi) · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q ·
ekranda ≤ 3 blok · telefon maketi chapda, jadval o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 8-ekran — **D** (`3`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 383–385, DE-205): `m9-12` «Loyiha kuni: 2-asosiy funksiya» → **`m9-13` «Uch foydalanuvchidan keyin nimani tuzatasiz?»** (osti: «auditoriya bilan sinov va shu darsda tuzatish», `type: 'PM'`) → `m9-14` «Loyiha kuni: 3-asosiy funksiya».
Tur (PM-005): **gibrid — PM qismi 2-tur (sof PM: artefakt — o'z sinov yozuvining sanog'i va tanlangan to'xtash) + amaliyot (repo)**. Namuna tuzilmasi — 9-Modul `06-PmAnalyticsDayOne-v3.md` (PM+PRAKT, 12 ekran).
Keys — **K10 Cyberpunk 2077** (tayanch 5, faqat bank matni). REPO — `maydon-jamoa` (`m11-dars-13-start` → `m11-dars-13-done`).
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 (yozuvi yo'q o'quvchilarga dars boshida sinfdosh bilan sinov ≈ 10) · 2–4-ekranlar ≈ 15 · o'z sanog'i ≈ 10 · A1 ≈ 22 · A2 ≈ 18 · yakuniy savol, podium, kartochkalar, arena ≈ 15.
Manba: `00-MODUL-TAYANCH.md` (1.8 — sinov vazifasi, uch kishidagi to'xtashlar, eng muhimi va tuzatish — AYNAN · 9.2 namuna o'yinlar · 3 — teg `m11-dars-13-done` · 4 — PM+PRAKT, talab zinapoyasi «13 — A1 tayyor + bitta joy, A2 bitta qator» ·
5 — K10 · 7 — takroriy xatolar · 8 — `pm-m9d13-sinov` · 9.29–9.38 — ro'yxat tartibi, karta shakli, «Hisobdan chiqish», namuna qo'shilganlar, `SINOV.md`) · `GATE_M_JAVOB.md` (Qaror-0 6, 16, 17) · `MD_TOPSHIRIQ_2.md` 13-band · 9-Modul `10-PmUsabilityTest-v3.md`, `11-MvpIteration-v3.md` va ularning FILTR fayllari (ko'prik, takrorlanmaydi).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «GIBRID: auditoriyadan 3 kishi bilan sinov → eng muhimi shu darsda tuzatiladi → yaxshilangan versiya»):**
   o'quvchi 12-dars uyga vazifasidagi sinov yozuvlarini (yozuv yo'q bo'lsa — dars boshidagi sinfdosh sinovini) sanaydi, bitta to'xtashni tanlaydi, uni o'z ilovasida agent bilan tuzatadi
   va yangi odam bilan qayta sinaydi. Saqlanadi: `pm-m9d13-sinov` (15, 16-darslar o'qiydi). Repo'da: tuzatish + `SINOV.md`. Mentor misoli — teg `m11-dars-13-done`.
2. **Bugungi asosiy fikr (P-013):** Bu darsda ko'p kishida takrorlangan va vazifaga to'sqinlik qilgan to'xtash birinchi tuzatiladi, keyin yangi odam bilan qayta sinaladi.
   (Yakunda ScoreRing ostida, `small`; kartochkalarda so'zma-so'z yo'q.)
3. **9-Moduldan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; 9-Modul `m7-10`, `m7-11` — bir ekran ichida bir gap bilan eslatiladi):**
   - **sinov** — real odam ilovani ishlatadi, siz kuzatasiz (tayanch 2: «sinov — faqat real odam bilan»). Sinovda tushuntirmaysiz, yechimni ko'rsatib bermaysiz.
   - **sinov vazifasi** — odamga beriladigan bitta gap: u nimaga erishsin. Mentor misolida (tayanch 1.8, aynan): **«Shanba soat 18:00 dagi o'yinga qo'shiling.»**
   - **to'xtash** — odam keyingi qadamni topishda qiynalgan joy: jim qolishi, uzoq qidirishi yoki noto'g'ri joyni bosishi mumkin (9-Modul `m7-10` ta'rifi, so'zma-so'z).
   - **kuzatuv yozuvi** — sinovda odam nima qilgani va qayerda to'xtagani — vaqti bilan (9-Modul shabloni: tepada vazifa, qatorlar «vaqt · nima qildi», to'xtash qatori — yorliq «to'xtadi»).
   - **qayta sinov** — tuzatishdan keyin o'sha vazifa bilan yana sinov (9-Modul `m7-11`). **«Keyin» ro'yxati** — hozir tuzatilmaydigan to'xtashlar navbati (tayanch 1.8: «qolgan ikkitasi — «keyin» ro'yxatiga»).
   - **talab** (qayerda · nima qilsin · nima buzilmasin) · **agent** (Antigravity) · **prompt** · **tekshirish** (o'z ishini ko'rish) — tayanch 2.
4. **Bugun yangi — ikki savol (atama emas, oddiy savol; 9-Modulda bitta odam edi, bugun uch kishi):**
   - **«To'xtash nechta kishida takrorlandi?»** — **sanoq** («3 / 3» — 3 kishidan 3 tasi). «Sanoq» — 4-darsdagi «takrorlangan javoblar sanog'i» bilan bir so'z (ko'prik — 2-ekran Mentorida, bir gap).
   - **«Kishi vazifani bajara oldimi?»** — har yozuvda alohida: **bajardi / bajarmadi**; yig'indi qatori «Vazifani bajardi: 2 / 3».
   - Ikkalasi birga (bu darsda): ko'p kishida takrorlangan **va** vazifaga to'sqinlik qilgan to'xtash — birinchi. Cheklov (tayanch 7.1): «Uch kishi — kichik son: sanoq tanlovga yordam beradi, isbot emas.»
     «Vazifaga to'sqinlik qildi» — 9-Modul `m7-11` so'zi (o'sha darsdagi «Vazifaga ta'siri» ustuni).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - sinovdagi odam — sanoqda **kishi** («1-kishi», «3 kishidan 3 tasi»; tayanch 1.8 shakli); Mentor misolida — **o'yinchi** («1-o'yinchi»; mahsulot roli, tayanch 2). «Odam» — faqat 9-Modul iboralarida
     (sinov va to'xtash ta'rifi, «yangi odam»); qayta sinov yozuvida — «yangi odam / oldin ko'rgan odam» (13-FILTR 11). «Sinovchi», «respondent», «foydalanuvchi» (dars nomidan tashqari) — yo'q.
   - **sinov** — faqat real odam bilan; o'z ilovangizni o'zingiz ko'rish — **tekshirish** (A1 4-qadam). «Sinab ko'rish» sinov ma'nosida yo'q (kartochka ekranining platforma sarlavhasi bundan mustasno).
   - **xato** — faqat K10 keysida (bank tili: «ko'p xato bilan chiqarilgan»); «bug», «bag», «nosozlik» — yo'q. Testdagi mag'lubiyat — «Adashdingiz».
   - **«maydon»** — faqat futbol maydoni («Mahalla maydoni»); forma joyi — «qator». **«jamoa»** — faqat futbol jamoasi. «Maydon Jamoa» — mahsulot nomi (4-darsdan).
   - **Ishlatilmaydi:** usability test, task success, pattern, bug, prioritet, respondent, «sinab ko'rish» (sinov ma'nosida), «hukm».
6. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** to'xtashlar sanog'i 3 / 3 · 1 / 3 · 1 / 3 (tayanch 1.8, aynan) · namuna o'yinlar 9.2 (Shanba 18:00 · Mahalla maydoni · 8 / 10 · Shanba 20:00 · Maktab maydoni · 6 / 10 ·
   Yakshanba 10:00 · Park maydoni · 4 / 8 · Yakshanba 17:00 · Mahalla maydoni · 9 / 10). Uch o'yinchining kuzatuv yozuvi (vaqtlar), «Vazifani bajardi: 2 / 3» va qayta sinov natijasi — tayanch 1.8 (13-FILTR 1, 27).
   Cyberpunk 2077 — raqamsiz (bank), faqat yil va muddat: «2020-yil dekabr», «qariyb yarim yil».
7. **Keys — K10 Cyberpunk 2077 (tayanch 5, bank matni aynan):** «O'yin konsollarda ko'p xato bilan chiqarilgan; pulni qaytarish to'lqini; Sony o'yinni PlayStation Store'dan qariyb yarim yilga olib qo'ygan (2020-yil dekabr). Raqamsiz.»
   Ko'prik: sinov — chiqarishdan oldin (umumiy gap; Cyberpunk haqida «kim, qachon ko'rdi» — bankda yo'q, aytilmaydi — 13-FILTR 16–17). Bankdan tashqari fakt (sotuv soni, kompaniya ichidagi qaror, yangilanishlar) yo'q (PM-016, PM-018).
8. **Ikkinchi misol faqat testda (P-002), o'sha olamdan:** 3-ekran — «Maydon Jamoa»da boshqa vazifa (o'yin e'lon qilish). Boshqa mahsulot yo'q. Metafora yo'q.
9. **Amaliyot bloki (tayanch 4, 9.1):** o'quvchi 4 qadamning hammasini **o'z repo'sida, o'z mahsuloti va trekida** bajaradi; Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam» ortida — to'liq prompt);
   5-qadam yo'q. **Talab zinapoyasi (tayanch 4, aynan):** A1 — tayyor talab + bitta joy (tuzatish: «Nima qilsin») · A2 — bitta qator («Nima buzilmasin»).
   Talabdagi boshqa joylar 5-ekrandagi o'quvchi yozuvidan **oldindan to'ldiriladi** (tahrirlanadi; 9.12 naqshi). Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
   Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori, `.env` qiymatlari va token yuborilmaydi — 9.81) Push odati: `git status` → `git add <fayl>` (`git add .` emas) → commit → `git push`. «Ortda qoldingizmi» — `m11-dars-13-done` (9.10).
10. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; telefon, do'kon, televizor maketlari chizilgan (CSS/SVG), logotip yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Matn o'lchovi (python bilan sanalgan, qavsda): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 11, 12-darslarda «Maydon Jamoa»ga e'lon, qo'shilish va o'yin kuni tasdiq qurildi; 12-dars uyida Mentor ilovani auditoriyadan uch o'yinchiga berdi. Bugun — shu uch yozuv.
- **Dars ipi:** 0 — uch o'yinchi to'xtagan, birinchi nimani tuzatasiz (ballsiz) → 2 — uch yozuv sanaladi: qaysi to'xtash takrorlandi, kim vazifani bajara olmadi → birinchisi tanlanadi →
  3 — test: boshqa vazifada ikki savol → 4 — Cyberpunk 2077: xato chiqarishdan keyin ko'rinsa → 5 — o'quvchi o'z yozuvlarini sanaydi va birinchisini tanlaydi →
  A1 — o'z ilovasida tuzatadi → A2 — yozuv repo'ga, yangi odam bilan qayta sinov → 8 — yakuniy savol: bitta qayta sinov nimani aytadi → podium → kartochkalar → yakun.
- **Bitta vizual — «Sinov sanog'i»** (`SINOV_MAYDON` const → `SinovSanoq`, dars bo'yi, 163/180):
  - **chapda telefon** — «Maydon Jamoa» (nom o'z rangida, telefon ramkasida), «O'yinlar» ekrani. Ikki holat (bitta manba):
    *sinovdagi* (`m11-dars-12-done`; tayanch 1.8 va 9.29: `GET /oyinlar` — `yaratilgan` tartibida, oxirgi e'lon tepada; karta shakli — 9.30) — «Yakshanba, 17:00» · Mahalla maydoni · 9 / 10 →
    «Yakshanba, 10:00» · Park maydoni · 4 / 8 → «Shanba, 20:00» · Maktab maydoni · 6 / 10 → «Shanba, 18:00» · Mahalla maydoni · 8 / 10 (to'rtinchi karta telefon ekranining pastki chetidan yarim chiqib turadi);
    *tuzatilgan* (`m11-dars-13-done`) — sarlavha «Shanba»: 18:00 · Mahalla maydoni · 8 / 10 · 20:00 · Maktab maydoni · 6 / 10 · sarlavha «Yakshanba»: 10:00 · Park maydoni · 4 / 8 · 17:00 · Mahalla maydoni · 9 / 10.
    To'xtash joyida qizil nuqta; bir joyda bir nechta bo'lsa — nuqta kattalashadi, ichida son. «O'yin» ekrani (tafsilot, «Qo'shilaman») — 3-o'yinchi yozuvida bir lahza.
  - **o'ngda sanoq jadvali** — ustunlar «To'xtash · Nechta kishida · Navbat»; ostida bitta qator «Vazifani bajardi: N / 3». Qator holatlari: kirib keladi (sirg'alib, ~1 s yashil) → son sanab o'sadi →
    ★ «Birinchi» (accent) → kulrang «Keyin» → yashil «tuzatildi» (A2 dan keyin).
  - **yozuv kartasi** (o'ngda, jadval ustida, bir vaqtda bittasi): «1-o'yinchi» · vazifa qatori · «vaqt · nima qildi» qatorlari, to'xtash qatori accent va yorliq «to'xtadi»; sanalgach ixcham qatorga yig'iladi «1-o'yinchi · 2 to'xtash · bajardi ✓».
  - Ishlatiladi: 0 (yopiq yozuvlar) · 1 (o'zi o'ynaydi) · 2 (to'liq) · 5 (o'quvchining o'z sanog'i — telefonsiz, bitta ustun) · A1 o'ngi (*tuzatilgan* telefon) · A2 o'ngi (`SINOV.md` fayl-kartasi — o'sha ma'lumotdan) · 8 (kichik).
    K10 sahnasi (4-ekran) — o'z maketi (PM-029). `prefers-reduced-motion` da nuqta, qator va son harakatsiz, holatlar bir zumda almashadi.
- **Mentor misolining uch kuzatuv yozuvi** (`SINOV_MAYDON.yozuvlar`; yozuvlar, «2 / 3» va vazifa — tayanch 1.8, 13-FILTR 1; sinov namuna qo'shilganlar holatidan boshlangan — 9.36; har sinovdan oldin Mentor «Hisobdan chiqish»ni bosgan,
  o'yinchi namuna ism va namuna telefon bilan ro'yxatdan o'tgan — 9.34; vaqt «O'yinlar» ochilgandan; qo'shilganlar Database'da qolgan: 1-o'yinchidan keyin «9 / 10», 3-o'yinchidan keyin «10 / 10»):

| Kim | Vaqt · nima qildi (to'xtash — **qalin**) | Vazifa |
|---|---|---|
| 1-o'yinchi | 0:00 · Ilovani ochdi: ro'yxat boshida yakshanba o'yinlari · **0:03–0:38 · Shanba o'yinini qidirib, tepadagi kartalarni qayta o'qidi** · 0:38 · Pastga surib, «Shanba, 18:00» ni topdi va ochdi · **0:41–0:55 · «8 / 10» ga qarab so'radi: «Bu nima — hisobmi?»** · 0:58 · «Qo'shilaman» ni bosdi | bajardi |
| 2-o'yinchi | 0:00 · Ilovani ochdi · **0:03–1:20 · Shanba o'yinini qidirdi, yakshanba kartalarini ochib-yopdi** · 1:20 · «Shanbaga o'yin yo'q ekan» dedi va telefonni qaytardi | bajarmadi |
| 3-o'yinchi | 0:00 · Ilovani ochdi · **0:04–0:50 · Shanba o'yinini qidirdi: «Shanba, 20:00» ni ochib, orqaga qaytdi** · 0:50 · «Shanba, 18:00» ni topdi, «Qo'shilaman» ni bosdi · **1:00–1:25 · «Kelishimni qayerda bildiraman?» deb so'radi** | bajardi |

- **Sanoq (tayanch 1.8, aynan; jadvalda qisqa nom, sababi — A1 talabida):**

| To'xtash | Nechta kishida | Navbat |
|---|---|---|
| Shanba 18:00 dagi o'yinni topishda to'xtadi (sababi: e'lonlar qo'shilgan vaqti bo'yicha turibdi, kun bo'yicha emas) | 3 / 3 (1, 2, 3) | ★ Birinchi — tuzatiladi |
| «8 / 10» nimani bildirishini so'radi | 1 / 3 (1) | Keyin |
| «Kelaman» tugmasi nega yo'qligini tushunmadi (u faqat o'yin kuni chiqadi) | 1 / 3 (3) | Keyin |
Vazifani bajardi: 2 / 3 — bajarmagan 2-o'yinchi faqat birinchi to'xtashda qolgan.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Uch foydalanuvchidan keyin nimani tuzatasiz?** (44) — dars nomi (DE-205)
- Mentor: Mentor misolida «Maydon Jamoa»ni auditoriyadan uch o'yinchi sinadi va har biri qayerdadir to'xtadi. O'zingizga yaqin javobni belgilang.
- Maket (chap): «Maydon Jamoa» telefoni — «O'yinlar» *sinovdagi* holatda; tepasida vazifa qatori «Vazifa: «Shanba soat 18:00 dagi o'yinga qo'shiling.»».
  Telefon yonida uchta yopiq yozuv-karta: «1-o'yinchi» · «2-o'yinchi» · «3-o'yinchi» (matnsiz).
- Variantlar (radio, o'ng; bir uzunlikda):
  - Ko'p kishi to'xtagan joyni (25)
  - Vazifani to'xtatgan joyni (25)
  - Eng oson tuzatiladigan joyni (28)
- Javob (uchalasida bir xil, maqtovsiz — J-026, P-016): Har birining o'z sababi bor. Bugun uch yozuvni sanab, qaysi biri birinchi ekanini o'zingiz topasiz. (99)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent halqada qoladi; uch yozuv-karta navbat bilan (100 ms) ochiladi va ichida qizil to'xtash belgilari yonadi — matnsiz: 2 · 1 · 2.
  Qaysi to'xtash takrorlangani yopiq qoladi (2-ekran kashfiyoti, P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: shu ekranda qo'l ko'tartirib so'rang: «Uyda kim sinov o'tkazdi?» Yozuvi yo'qlar Reja ekranida sinfdosh bilan sinov o'tkazadi (1-ekran eslatmasi).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun sinovdagi eng muhim to'xtash tuzatiladi.** (46)
- Mentor: Kodni Antigravity agenti o'zgartiradi: siz talab yozasiz va natijani yangi odam bilan qayta sinaysiz.
- Chap — «Dars oxirida: auditoriya bilan sinov va shu darsda tuzatish» (App.jsx osti, P-015) + vizual o'zi o'ynaydi (DE-200): *sinovdagi* telefon → ro'yxat tepasida uchta qizil nuqta bitta joyga yig'iladi →
  kartalar o'z joyiga uchib, ro'yxat qayta tartiblanadi (*tuzatilgan*, sarlavhalar matnsiz kulrang chiziq — 2-ekran va A1 kashfiyotini ochmaydi) → ostida yashil qator «Qayta sinov: vazifa bajarildi».
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Har to'xtash nechta kishida takrorlanganini sanaysiz · `sanoq`
  - 02 · Kim vazifani bajara olmaganini ko'rib, birinchisini tanlaysiz · `birinchi`
  - 03 · Tanlangan to'xtashni o'z ilovangizda tuzatasiz · `tuzatish`
  - 04 · Tuzatishni yangi odam bilan qayta sinaysiz · `qayta sinov`
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m11-dars-13-start` · namuna `m11-dars-13-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Pastki qator 2 (kichik, faqat yozuvi yo'qlar uchun): Yozuvingiz yo'qmi? Hozir sinfdoshingiz bilan sinang: «Hisobdan chiqish» — u namuna ism va telefon bilan ro'yxatdan o'tadi. (122)
- Harakat yo'q (reja ekrani) — vizual o'zi o'ynaydi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi (dars boshidagi sinov — GATE_M_JAVOB 16): yozuvi yo'q o'quvchilarni uchlik guruhga bo'ling — har ilovani qolgan ikkitasi 3 daqiqadan sinaydi (≈ 10 daqiqa; vaqt yetmasa — juftlikda: bitta yozuv ham yetadi, 5-mashqda «1 kishi»), vazifa — ilovaning asosiy harakati
  (12-dars uyga vazifasidagidek). Har sinovdan oldin ilova egasi «Hisobdan chiqish»ni bosadi, sinfdosh namuna ism va namuna telefon bilan ro'yxatdan o'tadi — o'z raqamini yozmaydi, har sinovchiga boshqa raqam (9.34, 9.88);
  shunda har sinovchi asosiy harakatni o'zi ko'radi. Yozuvi borlar shu paytda sinfdoshining ilovasini sinashi mumkin. Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi (9-Modul qoidasi). Sinfdosh auditoriyadan bo'lmasa — bu mashq (5-mashqda «mashq» deb belgilanadi); real sinov — uyda.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); reja ta'rif aytmaydi va «birinchi» qaysi biri ekanini ochmaydi (P-015).

## 2 · Uch yozuvni sanash  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · sanoq
- Sarlavha: **Uch yozuvda qaysi to'xtash takrorlanadi?** (40)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval taxminingizni belgilang, keyin yozuvlarni birma-bir sanang.
  - sanash paytida: 4-darsda intervyu yozuvlarini sanagansiz — sinov yozuvi ham shunday sanaladi, «Sanash»ni bosing.
  - 3/3 dan keyin: Endi har o'yinchi vazifani bajara oldimi — «Vazifa natijasi»ni bosing.
  - tanlashda: Ikkala savolga qarab, birinchi tuzatiladigan to'xtashni tanlang.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — zinapoya): **Uch o'yinchining hammasida bir xil to'xtash bormi?** · Yo'q, hammasi har xil · Bitta bor · Ikkita bor
  — tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi.
- Vizual (o'ng — `SinovSanoq`): telefon *sinovdagi* holatda (chap) · sanoq jadvali bo'sh (ustunlar bor, qatorlar yo'q) · ostida «Vazifani bajardi: ? / 3».
- **Harakat → Vizual o'zgarish:**
  1. «Sanash» (halqada; N/3) → yozuv kartasi katta bo'lib chiqadi (1-, keyin 2-, keyin 3-o'yinchi; qatorlari 80 ms oraliqda) → to'xtash qatorlari jadvalga uchadi:
     yangi to'xtash — yangi qator sirg'alib kiradi «1 / 3»; bor to'xtash — o'sha qatorda son sanab o'sadi («1 / 3» → «2 / 3» → «3 / 3»), qator ~1 s yashil yonadi;
     telefonda to'xtash joyida qizil nuqta (ro'yxat tepasi · «8 / 10» yonida · 3-o'yinchida «O'yin» ekrani bir lahza ochiladi, «Qo'shilaman» ostida nuqta) → yozuv kartasi ixcham qatorga yig'iladi.
  2. «Vazifa natijasi» (bitta bosish) → uch ixcham qatorga belgi tushadi: 1-o'yinchi «bajardi ✓» · 2-o'yinchi «bajarmadi ✕» · 3-o'yinchi «bajardi ✓»; jadval ostida «Vazifani bajardi: 2 / 3»;
     «bajarmadi ✕» dan birinchi qatorga («Shanba 18:00 dagi o'yinni topishda to'xtadi») ingichka chiziq chiziladi.
  3. Tanlash → jadval qatorlari halqada (bosiladigan):
     - 1-qator → ★ «Birinchi» (accent), qolgan ikkitasi kulrang «Keyin» guruhiga suriladi; telefonda ro'yxat tepasi accent halqada, yonida qisqa yorliq «tartib: qo'shilgan vaqti bo'yicha».
     - 2 yoki 3-qator → qator silkinadi, `QXato`: Bu to'xtash bir kishida, u vazifani bajardi. (44) — qayta tanlash mumkin (nishon — faqat birinchi tanlovda).
- Joriy qator (3/3 dan keyin, bitta): Har to'xtash nechta kishida takrorlangani — sanoq; har yozuvda alohida — kishi vazifani bajara oldimi. (102)
- Natija qatori (`QTaxmin`, xulosaning birinchi qatori — SABOQ 25): «Taxminingiz: … · haqiqatda: bitta bor — o'yinni topish» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu sinovda o'yinni topish uchala o'yinchida takrorlandi va birini to'xtatdi — u birinchi tuzatiladi. (100)
- Tugadi (199): harakat paneli yopiladi; telefon va jadval (★ «Birinchi» bilan) butun enga, fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Sanash (N/3) → Vazifa natijasi → Qatorni tanlang → Davom etish
- Nishon: Repeat Spotter — birinchi tanlovda to'g'ri qator.
- O'qituvchi eslatmasi: 9-Modulda bitta o'yinchining bitta sinovi edi — har to'xtashning «vazifaga ta'siri» yozilgan; bugun uch kishi, shuning uchun sanoq qo'shildi.
  Mentor misolida har sinovdan oldin «Hisobdan chiqish» bosilgan, o'yinchi namuna ism va telefon bilan ro'yxatdan o'tgan (9.34) — shuning uchun har biri «Qo'shilaman»ni o'zi ko'rgan.
  «Topishda to'xtadi» — qidirgan paytdagi to'xtash: 1 va 3-o'yinchi keyin topdi, 2-o'yinchi topmadi. Uch kishi — kichik son: sanoq tanlovga yordam beradi, isbot emas (tayanch 7.1).
  Sinfga savol: «Bitta kishida bo'lgan, lekin vazifani butunlay to'xtatgan to'xtash-chi?» — javob: u ham muhim bo'lishi mumkin; bu sinovda ikkala savolga «ha» bo'lgani bitta edi.
- ✎ Bitta g'oya (P-008): uch yozuv → sanoq → birinchisi. Holat o'quvchi bosgan qatorlardan chiziladi (P-046). Atama yangi emas — ikki oddiy savol (T-011).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — o'sha olam, boshqa vazifa — P-002)
- Eyebrow: Tekshiruv · birinchi qaysi (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Vazifa — o'yin e'lon qilish. Ikki savol bo'yicha qaysi to'xtash birinchi?** (10 so'z; «ikki savol» — 2-mashqdagi sanoq va vazifa natijasi, 13-FILTR 3)
  - A — 1 kishida: soatni uzoq tanladi, e'lonni berdi (45)
  - ✔ B — 3 kishida: kunni topmadi, 2 tasi e'lon bermadi (46)
  - C — 2 kishida: maydon nomini so'radi, e'lonni berdi (47)
  - D — 1 kishida: tugmani topmadi, e'lonni bermadi (43)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («N kishida: nima qildi, natija»); «bermadi» B va D da, «topmadi» B va D da; to'g'ri variant eng uzun emas (C uzunroq).
- To'g'ri izohi: Eng ko'p kishida takrorlangan va vazifani to'xtatgani shu. (58)
- Xato izohlari (≤60):
  - A: Bitta kishi, e'lon berildi. Vazifani to'xtatgani bormi? (55)
  - C: Ikki kishi so'radi, lekin e'lon berildi. Vazifa to'xtadimi? (59)
  - D: Vazifa to'xtadi, lekin bir kishida. Ko'proq kishida bormi? (58)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Two Questions — birinchi urinishda to'g'ri.
- Izoh (MD): «E'lon berish» ekrani 11-darsda qurilgan (tayanch 1.7). D — vazifani to'xtatgan, lekin bitta kishi: ikkinchi savol bo'yicha kuchli, birinchisi bo'yicha zaif (S-004: rost, lekin B dan zaif).

## 4 · Cyberpunk 2077  ← QVoqea (PM keys K10; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Cyberpunk 2077 chiqqach nima bo'ldi?** (36)
- Nuqtalar (3) · yorliq **Cyberpunk 2077 · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · vaqt qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Cyberpunk 2077** (nomi o'z rangida) — kompyuter va konsol uchun o'yin; konsol — o'yin uchun alohida qurilma (masalan, PlayStation). Logotip yo'q.
- Mentor — bosqich gapini aytadi, har bosqichda almashadi (≤2 gap; SABOQ 8). Sahnada faqat bosqich nomi va jonli maket.
- Sahna (`KibrSahna`, chizilgan CSS/SVG; bosqichga qarab o'zgaradi; bankda yo'q narsa chizilmaydi — son, sotuv, odamlar ismi yo'q):
  - 1/3 **Xatolar bilan chiqdi** — Mentor: 2020-yil dekabrida Cyberpunk 2077 konsollarda ko'p xato bilan chiqdi.
    · sahna: televizor va konsol; ekranda o'yin kadri — kadr bir lahza qotadi, ustidan chiziqlar o'tadi (xato belgisi, chizilgan), keyin yana yuradi.
  - 2/3 **Pulni qaytarish** — Mentor: O'yin chiqqach, ko'p xaridor pulini qaytarishni so'radi.
    · sahna: xaridor siluetlari navbat bilan kiradi, har biridan «Pulni qaytaring» kartochkasi chiqib, bitta to'pga uchadi (son yozilmaydi).
    · bashorat (sahna ostida, bitta qator; P-053 `pre` kadr — do'kon oynasida o'yin kartasi hali turibdi; S-015 — zinapoya). Bashorat ustida bitta qator (S-018): Sony — PlayStation konsolini chiqaradigan kompaniya, PlayStation Store — shu konsolning o'yin do'koni.
      **Sony o'yinni o'z do'konidan qancha muddatga olib qo'ydi?** · Bir haftaga · Bir oyga · ✔ Qariyb yarim yilga — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi.
  - 3/3 **Do'kondan olib qo'yildi** — Mentor: Sony o'yinni PlayStation Store'dan qariyb yarim yilga olib qo'ydi.
    · sahna: do'kon oynasi (chizilgan, logotipsiz) — o'yin kartasi kulrang bo'lib qatordan chiqib ketadi; vaqt qatorida «dekabr 2020» dan «qariyb yarim yil» chizig'i chizilib boradi.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: qariyb yarim yilga» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, bosqich nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan keyin, pastda, yashil): Bu voqeada o'yin ko'p xato bilan chiqdi. Sinov xatoni ko'pchilikka berishdan oldin ko'rishga yordam beradi. (107)
- Tugma (pastki): Keyingi bosqich (N/3) → Davom etish
- O'qituvchi eslatmasi: «Maydon Jamoa» ham avval ko'pchilikka emas, uch o'yinchiga berildi — ko'prik shu. Bankdan tashqari raqam, kompaniya nomi va voqea qo'shmang; o'yin ichidagi aniq xatolarni ham aytmang (bankda yo'q).
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K10 («Игру выпустили с массой багов на консолях; волна возвратов, и Sony сняла игру с продажи в PlayStation Store почти на полгода (декабрь 2020). Цифры: без цифр.») · tayanch 5.
  «Ko'p xaridor pulini qaytarishni so'radi» — «волна возвратов» ning o'zbekchasi. Xatolarni kim va qachon ko'rgani bankda yo'q — aytilmaydi (13-FILTR 17).

## 5 · O'z sinovingiz  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Sizning sinovingizda qaysi to'xtash birinchi?** (45)
- Mentor: Yozuvlaringizni kishi bo'yicha kiriting — sanoq o'zi chiqadi, birinchisini o'zingiz tanlaysiz.
- Kirish qatori (tepada, bir marta): Uyda sinov o'tkazmagan bo'lsangiz — dars boshidagi sinfdosh sinovi yozuvini kiriting. (85)
- Qadamlar 1/2/3 (`QQadamlar`); bitta ustun; bir vaqtda bitta katta karta, yozilgani yuqoridagi ixcham chiziqqa uchadi (SABOQ 29):
  1. **Vazifa va natija** — «Sinov vazifasi» qatori (ipucha: Odam nimaga erishsin?) · «Sinaganlar auditoriyangizdanmi?» Ha · Yo'q, sinfdosh — mashq · «Nechta kishi sinadi?» 1 · 2 · 3 ·
     har kishi uchun navbat bilan: «Vazifani bajardimi?» Ha · Yo'q.
  2. **To'xtashlar** — bitta katta karta: «To'xtash» qatori (ipucha: Qayerda, nima qildi?) + «Kimda bo'ldi?» — kishi tugmalari «1-kishi · 2-kishi · 3-kishi» (bir nechtasini tanlash mumkin) → «Qo'shish» →
     karta ixcham qatorga uchadi «matn… · 2 / 3»; yangi bo'sh karta chiqadi. 1 dan 5 tagacha to'xtash. Bir xil to'xtash ikki kishida bo'lsa — bitta qator, ikki kishi belgilanadi.
  3. **Birinchisi** — to'xtashlar sanoq bo'yicha (eng ko'pi tepada); vazifani bajarmagan kishida bo'lgan to'xtash yonida kichik belgi «✕ vazifa to'xtadi».
     Ro'yxat ustida kulrang qator: Tepada — ko'p uchragani; birinchisini o'zingiz tanlaysiz: bitta kishini butunlay to'xtatgan to'xtash ham muhim bo'lishi mumkin.
     Bitta qatorni bosish → «Birinchi» uyasiga uchadi (★, accent); qolganlari «Keyin» ro'yxatiga (kulrang) → «Saqlash».
- Tekshiruv (`QXato`, ≤60; faqat bo'sh qator bloklaydi, qolgani — maslahat, qaror o'quvchida — S-008):
  - bo'sh vazifa: Odam nimaga erishsin — shuni yozing. (36)
  - bo'sh to'xtash: Kishi qayerda, nima qildi — shuni yozing. (41)
  - to'xtashda xulosa so'zi (yomon, noqulay, yoqmadi, chiroyli, kerak) — maslahat: Bu xulosa. Kishi nima qilganini yozing. (39)
  - «Birinchi» — sanoqda eng kami va «✕» siz bo'lsa — maslahat: Bu bir kishida, vazifa bajarildi. Boshqasini ko'rasizmi? (56)
- Yordam (sukutda yopiq): Mentor misolida «Shanba 18:00 dagi o'yinni topishda to'xtadi» — 1, 2 va 3-o'yinchida: bitta qator, uch kishi belgilangan, «3 / 3». Bir kishi sinagan bo'lsa — vazifani to'xtatgan to'xtashdan boshlang.
- **Harakat → Vizual o'zgarish:** «Qo'shish» → to'xtash qatori ixcham chiziqqa uchadi, son sanab o'sadi; 3-qadamda tanlangan qator «Birinchi» uyasiga uchadi, qolganlari «Keyin» ga suriladi;
  «Saqlash» → forma yopiladi, sanoq kartasi butun enga (199): vazifa, «Vazifani bajardi: N / M», to'xtashlar sanog'i, ★ «Birinchi»; har qator yonida ✎.
- Saqlanadi: `pm-m9d13-sinov` — `{ vazifa, tur: 'real' | 'mashq', bajardi: [bool × N], toxtashlar: [{ id, matn, kishilar: [1–3] }], eng: id, tuzatildi: false, qaytaSinov: null }` (tayanch 8, 9.90; bir to'xtash — bitta yozuv, kishilari ro'yxat bilan).
- Xulosa: Sinov yozuvingiz sanaldi: birinchisi tanlandi, qolgani «Keyin» ro'yxatida. (74)
- Tugma (pastki): Yozuvlarni kiriting (N/3) → Davom etish
- Mentor rejimida (proyektorda): forma o'rnida Mentor misoli (`SINOV_MAYDON`) to'ldirilgan holda ko'rinadi.

## A1 · Amaliyot 1 — eng muhim to'xtashni tuzatish  ← amaliyot bloki (≈22 daq; `screens[6]`)
- Eyebrow: Amaliyot 1 · tuzatish
- Sarlavha: **Birinchi to'xtashni o'z ilovangizda tuzating.** (45)
- Mentor: Talab tayyor — faqat «Nima qilsin» qatorini o'zingiz yozasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda va trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status` — o'zgargan fayl yo'q bo'lsin (12-darsdagi ish push qilingan). Bor bo'lsa — avval commit va push qiling.
  2. **Prompt** — «Qayerda» qatori mustaqil ishdagi sanog'ingizdan to'ldirilgan (tahrirlash mumkin). «Nima qilsin» qatorini yozing — kulrang namunaga qarang, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: ilovamda sinovda kishilar to'xtagan joy — «{birinchi to'xtash}» ({nechta kishi sinadi} kishidan {nechtasida} tasida).
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: qolgan ekranlar avvalgidek ishlasin, Database'dagi yozuvlar o'chmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Joy yonidagi kulrang namuna: `{nima qilsin}` — masalan: o'yinlar kun va soat bo'yicha tartiblansin, har kun o'z sarlavhasi bilan. Bitta o'zgarish yozing — butun ekranni qayta qurish emas.
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — «O'yinlar» ekrani (`src/app/index.tsx`). Sinovda 3 kishidan 3 tasi shu yerda to'xtadi: «Shanba 18:00 dagi o'yinni topishda to'xtadi» — e'lonlar qo'shilgan vaqti bo'yicha turibdi, kun bo'yicha emas.
     > Nima qilsin: «O'yinlar» ekranida o'yinlar kun va soat bo'yicha tartiblansin, har kun o'z sarlavhasi bilan.
     > Nima buzilmasin: o'yin kartasi (soat, maydon, «8 / 10») va uni bosganda ochiladigan «O'yin» ekrani, «Qo'shilaman», «Kelaman», «E'lon berish». Backend'ga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching. QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.
     O'zgarish telefonda ko'rinmasa — terminalda `r`. Web-trekda: `npm run dev`.
     Agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff` (nima o'zgargani ko'rinadi) — o'zgarish faqat to'xtash bo'lgan ekran fayllaridami. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — sinov vazifasini o'zingiz bajaring, talabning har qatorini tekshiring:
     (1) to'xtash bo'lgan joy endi qanday — «Nima qilsin» qatori bajarildimi; (2) qolgan ekranlar va asosiy harakat avvalgidek ishlaydi.
     Mos kelmagan qatorni agentga yozing. Oxirida `git status` → har faylni `git add <fayl>` bilan → `git commit -m "13-dars: sinovdagi birinchi to'xtash tuzatildi"` → `git push`.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, nom o'z rangida; bir marta o'zi yuradi — kartalar *sinovdagi* tartibdan o'z joyiga uchadi, keyin *tuzatilgan* holatda turadi):
  - «O'yinlar» · sarlavha «Shanba»: 18:00 · Mahalla maydoni · 8 / 10 · 20:00 · Maktab maydoni · 6 / 10
  - sarlavha «Yakshanba»: 10:00 · Park maydoni · 4 / 8 · 17:00 · Mahalla maydoni · 9 / 10
  - ostida bitta qator (kichik, mono): `git diff` → `mobil/src/app/index.tsx`
- Hammasi bajarilgach (yashil): Birinchi to'xtash tuzatildi: o'zingiz tekshirdingiz, boshqa ekranlar avvalgidek ishlaydi. (89)
- Saqlanadi: `pm-m9d13-sinov.tuzatildi = true` — oxirgi «Bajardim»da (tuzatish qilindi; natija — A2 qayta sinovida).
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-13-done` —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Nishon (bonus): Fix Shipped — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: tuzatish katta bo'lsa (yangi funksiya kerak bo'lsa) — o'quvchi bilan eng kichik qismini tanlang: bugun bitta o'zgarish. Web-trekda telefon tekshiruvi — push'dan keyin Netlify manzilida (10-dars A3 dagidek).
- ✎ Talab zinapoyasi (tayanch 4, aynan): A1 — tayyor talab + bitta joy («Nima qilsin»). «Qayerda» qatori — 5-ekran yozuvidan oldindan to'ldirilgan, o'quvchi joy emas, tayyor qator ko'radi (9.12 naqshi).
  «Tekshirish» — o'quvchining o'zi; «sinov» so'zi A2 ga qoldi (T-015). «Nima buzilmasin» — o'zgarayotgan narsaning o'zi emas (9-Modul `11-FILTR` 8-band): ro'yxat tartibi o'zgaradi, karta va ekranlar — yo'q. Tuzatish — faqat ilovadagi ko'rinish tartibi: `GET /oyinlar` tartibi (9.29) o'zgarmaydi (tayanch 1.8, 9.90; 13-FILTR 14).

## A2 · Amaliyot 2 — yozuv repo'ga va qayta sinov  ← amaliyot bloki (≈18 daq; `screens[7]`)
- Eyebrow: Amaliyot 2 · qayta sinov
- Sarlavha: **Yangi odam o'sha joyda yana to'xtaydimi?** (40)
- Mentor: Avval agent sinov yozuvingizni faylga yozadi, keyin sinfdoshingiz o'sha vazifani bajaradi; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — Antigravity'da o'z repo'ngiz ochiq (Amaliyot 1 dagi holat), ilova telefoningizda ishlab turibdi. Iloji bo'lsa, ilovangizni hali ko'rmagan sinfdoshni tanlang.
  2. **Prompt** — talabning ikki qatori mustaqil ishdagi sanog'ingizdan to'ldirilgan. «Nima buzilmasin» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: repo ildizida `SINOV.md` — yo'q bo'lsa, yarat.
     > Nima qilsin: sinov yozuvini yoz. Vazifa: «{sinov vazifasi}». Kishilar: {nechta kishi sinadi}, vazifani bajardi: {bajarganlar} / {nechta kishi sinadi}. Jadval — to'xtash, nechta kishida, navbat: {to'xtashlar va sanog'i}.
     > «{birinchi to'xtash}» — «tuzatildi», qolganlari — «keyin». Oxirida bo'sh «Qayta sinov» bo'limi qoldir.
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi qator): «Nima buzilmasin: ilova kodiga tegma — faqat `SINOV.md`. O'zgargan fayllarni ayt.»
  3. **Ishga tushirish** — `SINOV.md` ni oching: sonlar mustaqil ishdagi sanog'ingiz bilan bir xilmi (agentning hisobotiga emas, faylning o'ziga qarang); `git diff` — faqat `SINOV.md` o'zgargan.
     Mos kelmasa — agentga bitta gap: «Shu qator yozuvimga mos emas: {qator}. Tuzat.»
  4. **Qayta sinov** — avval ilovangizda «Hisobdan chiqish»ni bosing: sinfdoshingiz namuna ism va boshqa namuna telefon bilan ro'yxatdan o'tadi (o'z raqamini yozmaydi).
     Telefoningizni bering va o'sha vazifani o'qing. Tushuntirmang, kuzating. Ilovangizni oldin ko'rgan sinfdosh bo'lsa, u yo'lni eslab qolgan bo'lishi mumkin — natijani shuni hisobga olib yozing.
     Natijani tanlang: **O'sha joyda to'xtamadi** · **Yana to'xtadi** va kim edi: **Yangi odam** · **Oldin ko'rgan** — `SINOV.md` dagi «Qayta sinov» bo'limiga bir qator yozing:
     «Kim: yangi odam / oldin ko'rgan odam · Vazifa: bajardi / bajarmadi · Kuzatuv: …».
     Yana to'xtasa — bu ham natija: ko'rganingizni agentga bitta gap bilan yozing — «Qayta sinovda yana to'xtadi: {nima bo'ldi}. Tuzat.» — va uyda yana sinang.
     Oxirida `git add SINOV.md` → `git commit -m "13-dars: sinov yozuvi va qayta sinov"` → `git push`.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (fayl-karta `SINOV.md`; qatorlar `SinovSanoq` bilan bitta manbadan, ketma-ket yoziladi):
  ```
  # SINOV — Maydon Jamoa
  Vazifa: Shanba soat 18:00 dagi o'yinga qo'shiling.
  Kishilar: 3 · Vazifani bajardi: 2 / 3
  | To'xtash                                   | Nechta kishida | Navbat     |
  | Shanba 18:00 dagi o'yinni topishda to'xtadi | 3 / 3          | tuzatildi  |
  | «8 / 10» nimani bildirishini so'radi        | 1 / 3          | keyin      |
  | «Kelaman» tugmasi nega yo'qligini tushunmadi | 1 / 3          | keyin      |

  ## Qayta sinov
  Kim: yangi odam · Vazifa: bajardi · Kuzatuv: Shanba o'yinini ro'yxat boshida topdi
  ```
- Hammasi bajarilgach (yashil; natija «O'sha joyda to'xtamadi» bo'lsa): Bu qayta sinovda tuzatilgan joyda to'xtash bo'lmadi. Yozuv repo'da. (67)
  · «Yana to'xtadi» bo'lsa (P-046): Qayta sinov yozildi: to'xtash qoldi — talabni aniqlashtirib, uyda yana sinaysiz. (80)
- Saqlanadi: `pm-m9d13-sinov.qaytaSinov` — `{ natija: 'toxtamadi' | 'toxtadi', kim: 'yangi' | 'korgan' }` (`tuzatildi` — A1 dan; bitta qayta sinov — fakt, «tuzatish isbotlandi» emas — 13-FILTR 8).
- Pastki qator: Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-13-done` (`SINOV.md` — namuna).
- Nishon (bonus): Retest Done — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: juftliklarni almashtiring — har o'quvchi o'z ilovasini o'zi ko'rmagan sinfdoshga beradi (3 daqiqa). Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi.
  Sinfdosh auditoriyadan bo'lmasa — bu mashq; auditoriyadagi odam bilan qayta sinov — uyga vazifa.
- ✎ Talab zinapoyasi: A2 — bitta qator («Nima buzilmasin», 10-dars A2 naqshi). 4-qadam nomi «Qayta sinov» — tayanch 4 dagi «Tekshirish» o'rnida: bu yerda tekshiruvchi — boshqa odam (T-015; 9-Modul `m7-11` A3 naqshi) — GATE M savoli (TAYANCHGA SAVOL 7).

## 8 · Yakuniy savol  ← QTest (✔ D, `correctIdx 3`; ikki blok birga)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik `SinovSanoq` (telefonsiz): «Qayta sinov — Kim: yangi odam · Vazifa: bajardi».
- Savol: **Qayta sinovda yangi odam to'xtamadi. Bu nimani ko'rsatadi?** (8 so'z)
  - A — Ilovaning hamma joyi endi tushunarli bo'ldi (43)
  - B — «Keyin» ro'yxatidagi to'xtashlar ham yo'qoldi (45)
  - C — Ilovani endi sinovsiz ko'pchilikka bersa bo'ladi (48)
  - ✔ D — Tuzatilgan joyda bu safar to'xtash bo'lmadi (43)
- Kalit: **D** (index 3). To'g'ri variant eng uzun emas (C uzunroq); «to'xtash» B va D da; to'rttalasi bir shaklda (gap).
- To'g'ri izohi: Bitta qayta sinov faqat tuzatilgan joy haqida aytadi. (53)
- Xato izohlari (≤60):
  - A: Bir kishi bitta vazifani bajardi. Boshqa joylar sinaldimi? (58)
  - B: Ular tuzatilmagan — «Keyin» ro'yxatida navbatda turibdi. (56)
  - C: Bir kishi — kichik son. Keyingi sinovlar ham kerak. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol 2-ekrandagi tanlovni emas, qayta sinov natijasini o'qishni so'raydi — slayddan ko'chirib bo'lmaydi (§106). Chegaralangan gap (T-043, tayanch 7.1) — ball beriladigan to'g'ri javobda.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Birinchi qaysi» · 8 — «2 — Bitta qayta sinov»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (P-046; 13-FILTR 9): «O'sha joyda to'xtamadi» — **Tuzatildi: qayta sinovda to'xtash takrorlanmadi.** (48) · «Yana to'xtadi» — **Tuzatish tayyor — qayta sinov uyda davom etadi.** (47) ·
  qayta sinov yo'q — **Tuzatish tayyor — qayta sinov qoldi.** (36) · tuzatish yo'q — **Birinchi to'xtash tanlandi — tuzatish qoldi.** (44)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Bu darsda ko'p kishida takrorlangan va vazifaga to'sqinlik qilgan to'xtash birinchi tuzatiladi, keyin yangi odam bilan qayta sinaladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Uch kishi yozuvida har to'xtash nechta kishida takrorlanganini sanaysiz.
  - Kishi vazifani bajara oldimi — har yozuvda alohida ko'rinadi.
  - Uch kishi — kichik son: sanoq tanlovga yordam beradi, isbot emas.
  - Bitta qayta sinov faqat tuzatilgan joy haqida aytadi.
  - Cyberpunk 2077 ko'p xato bilan chiqdi — Sony uni do'konidan qariyb yarim yilga oldi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: auditoriyangizdan sinovda qatnashmagan 2 kishi · Nechta: 2 ta qayta sinov · Muddat: keyingi darsgacha
  - ① Har kishidan oldin «Hisobdan chiqish»ni bosing — u namuna ism va boshqa namuna telefon bilan ro'yxatdan o'tsin. O'sha vazifani bering, tushuntirmang: tuzatilgan joyda to'xtaydimi — kuzating.
  - ② Natijani `SINOV.md` dagi «Qayta sinov» bo'limiga yozing va push qiling.
  - ③ Yana to'xtasa — ko'rganingizni agentga bitta gap bilan yozing va o'zingiz tekshiring.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: 3-asosiy funksiya».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): uyga vazifa — PM+PRAKT naqshi (9-Modul `m7-06` yakunidagi `HwCard`; tayanch 4 «PM va TEX — yakun kartasida»). «Kim bilan» — HwCard yorlig'i.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Repeat Spotter!** (2-ekran, birinchi tanlovda to'g'ri qator) — Uchala yozuvda takrorlangan to'xtashni birinchi urinishda tanladingiz
- **Two Questions!** (3-ekran, birinchi urinishda) — Ikki savol bilan birinchi tuzatiladigan to'xtashni topdingiz
- **Fix Shipped!** (A1, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan) — Sinovdagi birinchi to'xtashni o'z ilovangizda tuzatdingiz
- **Retest Done!** (A2, oxirgi «Bajardim» — bonus) — Tuzatishni yangi odam bilan qayta sinadingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Birinchi qaysi** — 1 To'xtash nechta kishida takrorlandi — sanoq. · 2 Kishi vazifani bajara oldimi — har yozuvda alohida. ·
  3 Ikkala savolga «ha» bo'lgan to'xtash — birinchi, qolgani «Keyin» ro'yxatida.
  — Sinfga savol: Bitta kishini butunlay to'xtatgan to'xtash-chi — u ham muhimmi?
- **8 · Bitta qayta sinov** — 1 Qayta sinov — tuzatishdan keyin o'sha vazifa bilan yana sinov. · 2 Natija tuzatilgan joy haqida aytadi, butun ilova haqida emas. ·
  3 «Keyin» ro'yxatidagi to'xtashlar o'z navbatini kutadi.
  — Sinfga savol: Yangi odam yana o'sha joyda to'xtasa, nima qilasiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Sinov nima? | Real odam ilovani ishlatadi, siz kuzatasiz | Intervyuda so'raysiz, sinovda ko'rasiz |
| To'xtash nima? | Odam keyingi qadamni topishda qiynalgan joy | Jim qoladi, uzoq qidiradi yoki noto'g'ri joyni bosadi |
| Uch kishi yozuvida nimani sanaysiz? | Har to'xtash nechta kishida takrorlanganini | Mentor misolida: o'yinni topish — 3 / 3 |
| «Vazifani bajardi: 2 / 3» nimani bildiradi? | Uch kishidan ikkitasi natijaga yetdi | Bittasi to'xtab qoldi — qayerda, yozuv ko'rsatadi |
| Mentor misolida qaysi to'xtash birinchi tuzatildi? | Shanba 18:00 dagi o'yinni topa olmagani | Uchala o'yinchida takrorlandi va birini to'xtatdi |
| Qolgan to'xtashlar qayerga yoziladi? | «Keyin» ro'yxatiga | Keyingi tuzatish shu ro'yxatdan olinadi |
| Uch kishi — ko'p sonmi? | Yo'q, kichik son: sanoq tanlovga yordam beradi, isbot emas | Keyingi sinov tanlovni o'zgartirishi mumkin |
| Talabning «Nima qilsin» qatoriga nima yoziladi? | Ilova qiladigan bitta aniq o'zgarish | Butun ekranni qayta qurish emas |
| Agent «tuzatdim» desa, nimaga qaraysiz? | Fayllarda nima o'zgarganiga va telefondagi natijaga | `git diff` — nima o'zgargani ko'rinadi |
| Qayta sinovni kim bilan o'tkazgan ma'qul? | Ilovani hali ko'rmagan yangi odam bilan | Oldin ko'rgan odam yo'lni eslab qolgan bo'lishi mumkin |
| Cyberpunk 2077 bilan nima bo'ldi? | Konsollarda ko'p xato bilan chiqdi, Sony uni PlayStation Store'dan qariyb yarim yilga oldi | 2020-yil dekabr |
| Sinov nega ko'pchilikka berishdan oldin o'tkaziladi? | Xatoni ko'pchilikdan oldin ko'rish uchun | Cyberpunk 2077 ko'p xato bilan chiqdi — pul qaytarildi |
- §145: har javobdagi so'z darsda bor (sinov, to'xtash — 2-ekran Mentori va A-3 · sanoq — 2 · bajardi — 2 · «Keyin» — 2, 5 · kichik son — 2-ekran eslatmasi, 8 · «Nima qilsin» — A1 · `git diff` — A1, A2 · yangi odam — A2 · Cyberpunk — 4).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda.
1. Sinovda siz nima qilasiz? (A-3, 1)
   - ✔ A — Vazifa berib, kishini jim kuzatasiz
   - B — Ilovani o'zingiz ochib ko'rsatasiz
   - C — Kishidan ilova yoqdimi, deb so'raysiz
   - D — Har tugmani bittalab tushuntirasiz
2. Sanoqda «3 / 3» turibdi. Bu nimani bildiradi? (2)
   - A — Tugma uch marta qayta bosilganini
   - ✔ B — Uchala kishi shu joyda to'xtaganini
   - C — Sinovga uch daqiqa vaqt ketganini
   - D — Uch ekranda bir xil to'xtash borligini
3. Kuzatuv yozuviga qaysi qator tushadi? (A-3, 2)
   - A — 0:40 · Ro'yxat juda noqulay ekan
   - B — 0:40 · Hamma kishi buni yoqtirmaydi
   - ✔ C — 0:40 · Pastga surib, o'yinni topdi
   - D — 0:40 · Tugma kichikroq bo'lsa kerak
4. Yozuvda «Vazifani bajardi: 2 / 3». Bu nimani bildiradi? (2)
   - A — Ikki kishi ilovani ikki marta ochgan
   - B — Ilovaning uchdan ikki qismi tayyor
   - C — Ikki to'xtash uch kishida takrorlangan
   - ✔ D — Uch kishidan biri natijaga yetmagan
5. Cyberpunk 2077 o'yini qanday sotuvga chiqdi? (4)
   - ✔ A — Ko'p xato bilan sotuvga chiqarildi
   - B — Xatosiz, to'liq tayyor holda chiqdi
   - C — Faqat kompyuter uchun chiqarildi
   - D — Faqat bepul sinov sifatida chiqdi
6. Sony Cyberpunk 2077 ni nima qildi? (4)
   - A — Narxini tushirib, sotuvda qoldirdi
   - ✔ B — Do'konidan qariyb yarim yilga oldi
   - C — Uni yangi nom bilan qayta chiqardi
   - D — Xaridorlarga yangi o'yin sovg'a qildi
7. Birinchi tuzatiladigan to'xtash qanday bo'ladi? (2, 3)
   - A — Eng oson, bir qator bilan tuzatiladigan
   - B — Vazifa oxirida, sinov tugashida yozilgan
   - ✔ C — Ko'p kishida, vazifaga to'siq bo'lgan
   - D — Ekranning eng pastida, ko'rinmay turgan
8. Qayta sinovni kim bilan o'tkazgan ma'qul? (A2)
   - A — O'zingiz — ilovani yaxshi bilasiz
   - B — O'sha kishi bilan — u yo'lni biladi
   - C — Agent bilan — u kodni tekshiradi
   - ✔ D — Ilovani ko'rmagan yangi odam bilan
9. Agent «tuzatdim» dedi. Avval nimaga qaraysiz? (A1)
   - ✔ A — Fayldagi o'zgarishga va telefonga
   - B — Agent yozgan hisobotning o'ziga
   - C — Talabda yozilgan birinchi qatorga
   - D — Terminalda chiqqan oxirgi xabarga
10. Uch to'xtashdan nechtasi shu darsda tuzatiladi? (2, A1)
    - A — Uchalasi — bitta prompt bilan birga
    - ✔ B — Bittasi — qolgani «Keyin» ro'yxatida
    - C — Ikkitasi — eng oson tuzatiladiganlari
    - D — Hech biri — avval yana sinov kerak
11. Nega sinov ko'pchilikka berishdan oldin o'tkaziladi? (4)
    - A — Ilovani tezroq do'konga chiqarish uchun
    - B — Agentga kamroq talab yozib berish uchun
    - ✔ C — Xatoni ko'pchilikdan oldin ko'rish uchun
    - D — Reklama uchun birinchi fikrni olish uchun
12. Talabning «Nima qilsin» qatoriga nima yoziladi? (A1)
    - A — Kishi aytgan shikoyatning aynan o'zi
    - B — Butun ekranni noldan qayta qurish
    - C — To'xtagan kishilar soni va vaqti
    - ✔ D — Ilova qiladigan bitta aniq o'zgarish
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran ↔ arena 7 (misol ↔ qoida), 8-ekran ↔ arena 8 (natija ↔ kim bilan).
- 1-savol A — 9-Modul sinov qoidasi (yozuv tilida «kishi»); 3-savol — 9-Modul `m7-10` 3-savoli bilan bir qolip, boshqa olam qatori (o'yin topish).
- 5, 6-savollar — bank faktidan; distraktorlar bank faktiga zid, lekin ishonarli (S-004).
- **Fon so'zlari** (R-008, kodda {uz, ru}): sinov · to'xtash · sanoq · kuzatuv yozuvi · qayta sinov · «Keyin» · `SINOV.md` · 3 / 3 · Cyberpunk 2077 · PlayStation Store · Maydon Jamoa. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/9-Modull/PmAudienceTestLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m9d13-v1`, `lessonTitle` — «Uch foydalanuvchidan keyin nimani tuzatasiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept (keys) · practice-own (mustaqil) · practice (A1) · practice (A2) · test · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS` { 3: 1, 8: 3 }; bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`.
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + `QTaxmin`, yopilmaydigan ixcham qator — `TaxminIxcham`) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s4 `QVoqea` · s5 `QMustaqil` (`QQadamlar` 1/2/3) · s6/s7 `QBlok` + `QPrompt` (`ScreenBlok` ulagichi, 4 qadam) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
4. **Bitta vizual `SinovSanoq`** (180): `SINOV_MAYDON` const — `vazifa` (tayanch 1.8 aynan), `royxat.sinovdagi` / `royxat.tuzatilgan` (namuna o'yinlar — tayanch 9.2, 7/9-dars `src/namuna.js` bilan bir manba),
   `yozuvlar` (3 kishi × qatorlar { vaqt, nima, toxtash: id | null }, `bajardi`), `toxtashlar` (3 { id, nom, sabab, joy }). Holatlar: kirish · son o'sishi · ★ Birinchi · Keyin · tuzatildi.
   0, 1, 2, 8-ekranlar, A1 o'ngi (telefon *tuzatilgan*) va A2 o'ngi (`SINOV.md` fayl-kartasi — o'sha ma'lumotdan matn) shundan o'qiydi. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ss-qator ss-yozuv ss-nuqta`).
   Telefon o'lchami barqaror (SABOQ 22), «Maydon Jamoa» nomi telefon ramkasida o'z rangida (SABOQ 2, 23). `reduced-motion` — o'tishsiz.
5. s2: «Sanash» ×3 (yozuv kartasi → qatorlar jadvalga uchadi, son sanaydi, telefonda nuqta), «Vazifa natijasi» (belgi + chiziq), qator tanlash (to'g'ri — ★, xato — silkinish + `QXato`); nishon `repeatSpotter` (birinchi tanlov).
   Holat o'quvchi bosgan qadamlardan chiziladi (P-046). Navbatdagi tugma `.navbat` halqa + pulsatsiya (SABOQ 11).
6. s4 — `KibrSahna` (chizilgan): televizor + konsol (kadr qotishi), xaridor siluetlari + «Pulni qaytaring» kartochkalari (sonsiz), do'kon oynasi (o'yin kartasi chiqib ketadi) + vaqt qatori.
   Nom «Cyberpunk 2077» — o'yin muqovasidagi rang (quruvchi rasmiy muqovadan oladi; logotip chizilmaydi). Bashorat 2/3 bosqichda (`pre` kadr), `QTaxmin`.
7. s5 — ketma-ket karta formasi (SABOQ 29): 1-qadam (vazifa, kishilar soni 1–3, har kishiga Ha/Yo'q), 2-qadam (to'xtash + kishi tugmalari, «Qo'shish», 1–5 ta), 3-qadam (sanoq bo'yicha tartib, «✕ vazifa to'xtadi» belgisi, bitta tanlov).
   Tekshiruv: bo'sh qatorlar bloklaydi; xulosa so'zlari va «Birinchi» tanlovi — maslahat. Saqlash `pm-m9d13-sinov` (tayanch 8, 9.90: `vazifa`, `tur`, `bajardi: [bool]`, `toxtashlar: [{ id, matn, kishilar }]`, `eng` — id, `tuzatildi`, `qaytaSinov`).
   Yozuv bo'lmasa (mentor rejimi) — `SINOV_MAYDON` ko'rsatiladi.
8. A1/A2 — `ScreenBlok` (skelet) 4 qadam; `prompt: [...]`, `{…}` joylar accent pill. A1: «Qayerda» qatori `pm-m9d13-sinov` dan oldindan to'ldiriladi (tahrirlanadi), bitta joy `{nima qilsin}` yonida kulrang namuna
   (qolipda «kulrang namuna» joy turi bo'lmasa — `QPrompt` ga `namuna` maydoni, 10-dars KOD 7 bilan bir qaror). A2: «Qayerda»/«Nima qilsin» — oldindan to'ldirilgan, joy — `{nima buzilmasin}`.
   «Yordam» — Mentor misolidagi to'liq prompt (A1) / qator (A2). Trek (`pm-m9d8-platforma`): A1 3-qadamda `mobil` — Expo qatori, `web` — `npm run dev`; kalit yo'q bo'lsa — ikkalasi.
   A1 oxirgi «Bajardim» → `tuzatildi: true`. A2 4-qadam — ikki juft tanlov («O'sha joyda to'xtamadi» / «Yana to'xtadi» · «Yangi odam» / «Oldin ko'rgan») → `qaytaSinov`; yashil yakun matni tanlovga qarab (P-046).
   `ortda`: ikkala blokda `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-13-done`.
9. s3/s8 `QTest` — matn yuqoridagidek; s8 ustida kichik `SinovSanoq` (telefonsiz). `RECAPS` { 3, 8 } (3 karta + `ask`); `Q_LABELS` { 3, 8 }.
10. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s2 birinchi tanlov → Repeat Spotter · s3 birinchi urinish → Two Questions · A1 oxirgi «Bajardim» → Fix Shipped · A2 oxirgi «Bajardim» → Retest Done.
11. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — s10 alohida ekranda.
12. s11 `QYakun`: `recap` 5 qator, «Bugungi asosiy fikr» `small`; `uyga` — `HwCard` (alohida `.homework.jsx` yo'q); sarlavha `tuzatildi` va `qaytaSinov` ga qarab (P-046, to'rt holat); `keyingi` — «Loyiha kuni: 3-asosiy funksiya».
13. App.jsx `m9-13` qatoriga `comp: PmAudienceTestLesson` — «qur» bosqichida (asosiy seans; nom va osti o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (3, 8).
- Darvozalar: `npm run gates -- src/9-Modull/PmAudienceTestLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` · `lint:jsx` 0 · `stilsiz.py` · surat 1280 + 393.

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m11-dars-13-start` → `m11-dars-13-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m11-dars-13-start`** = `m11-dars-12-done` (tayanch 3): `GET /oyinlar` — `yaratilgan` tartibida (9.29), «O'yinlar» ekrani shu tartibda ko'rsatadi — oxirgi e'lon tepada (tayanch 1.8);
   Database'da namuna qo'shilganlar 8 · 6 · 4 · 9 (9.36). «Hisobdan chiqish» — 10-darsdan (9.34).
2. **`m11-dars-13-done`** = start + ikki commit:
   - A1: `mobil/src/app/index.tsx` — o'yinlar kun va soat bo'yicha; har kun o'z sarlavhasi bilan (masalan `SectionList`); `GET /oyinlar` tartibi o'zgarmaydi (9.29); karta — soat · maydon · «N / M»;
     «O'yin» ekrani, «Qo'shilaman», «Kelaman», «E'lon berish» va `backend/` o'zgarmagan.
   - A2: repo ildizida `SINOV.md` — A2 o'ng tomonidagi matn aynan (vazifa, 3 kishi, «2 / 3», uch to'xtash sanog'i, navbat, «Qayta sinov» qatori).
3. README «Darslar va teglar» jadvaliga 13-dars qatori: «sinov tuzatishi — ro'yxat kun va soat bo'yicha, kun sarlavhalari bilan; `SINOV.md`».
4. **Shart:** teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida). `SINOV.md` — `m11-dars-13-done` tarkibida (9.38).
5. **Bog'liqlik:** 14-dars (chiqish va navbat) shu ro'yxat ustida quriladi — kun sarlavhalari saqlanadi; 15-dars `pm-m9d13-sinov` dan «sinov tuzatishi — bajarildi» holatini o'qiydi (tayanch 1.9).

## Manbalar
- K10 — `PM_Prompt_v8.md` bank («К10 · CYBERPUNK 2077», 218-qator) va tayanch 5 (o'zbekcha matn). Bankdan tashqari fakt yo'q.
- Expo: `npx expo start`, QR, bitta Wi-Fi, `--tunnel`, terminalda `r` — tayanch 6 (docs.expo.dev, 06.10 tekshirilgan) va 10-dars MD (A3).
- 9-Modul: `10-PmUsabilityTest-v3.md` (sinov qoidasi, to'xtash ta'rifi, kuzatuv yozuvi, «O'zingiz qanday deb o'ylaysiz?»), `11-MvpIteration-v3.md` (bitta tuzatish, `git diff`, qayta sinov — «yangi odam / o'sha odam»), ularning `10-FILTR.md`, `11-FILTR.md`.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**Holat (06.10, 13-FILTR):** 1, 10 — tayanch 1.8 (uch yozuv, «2 / 3», qayta sinov natijasi) · 7, 8 — GATE M (13 ✓), auditor ham qabul qildi · 9 — `tur: 'mashq'` (9.90) · 11 — o'zgarmadi · `pm-m9d13-sinov` sxemasi — 9.90.
1. **Mentor misolining uch kuzatuv yozuvi** (vaqtlar, kim qayerda to'xtagan) va **«Vazifani bajardi: 2 / 3»** — tayanch 1.8 da faqat sanoq bor. Yozdim: 1-o'yinchi — topa olmadi + «8 / 10», bajardi;
   2-o'yinchi — topa olmadi, bajarmadi; 3-o'yinchi — topa olmadi + «Kelaman», bajardi. «Topa olmadi» — qidirgan paytdagi to'xtash (1 va 3-o'yinchi keyin topdi). Tayanchga yozilsinmi? 15, 16-darslar «2 / 3» ni ishlatishi mumkin.
2. ~~Sinovdagi ro'yxat tartibi~~ — **yopildi: 9.29** (`GET /oyinlar` — `yaratilgan` tartibida; 10-dars REPO shunga tuzatiladi). Avvalgi savol: tayanch 1.8 «qo'shilgan vaqti bo'yicha» — men «oxirgi e'lon tepada» deb oldim (shunda Shanba 18:00 to'rtinchi, ekran ostida). ⚠️ 10-dars MD REPO: `GET /oyinlar` «kun bo'yicha tartibda» —
   bu tayanch 1.8 ga zid. 11-dars (e'lon berish) da tartib «yangi e'lon tepada» ga o'tadimi — 10 va 11-dars MD lari bilan kelishish kerak.
3. ~~Bitta telefonda uch sinov~~ — **yopildi: 9.34** («Hisobdan chiqish», sinovdagi kishi namuna ism va telefon bilan ro'yxatdan o'tadi — 1, 2-ekran eslatmalari, A2 4-qadam, uyga vazifa). Avvalgi savol: sinovdagi kishi o'quvchining telefonida (uning akkauntida) qo'shilsa, keyingi kishiga «Qo'shildingiz» chiqadi (chiqish — 14-darsda). Har sinovdan oldin holat qaytariladimi
   (masalan Neon SQL Editor'da `ishtirokchilar` dagi qatorni o'chirish) yoki har kishi o'z akkauntida? 12-dars uyga vazifasi shuni aytishi kerak. Mentor misolida har sinov namuna holatidan boshlangan deb oldim.
4. ~~`pm-m9d13-sinov` — ikki yangi maydon~~ — **yopildi: 9.38**. Avvalgi savol: tayanch 8 sxemasiga `vazifa` (sinov vazifasi gapi) va `bajardi: [bool]` (har kishi) qo'shish — 5-ekran shuni yig'adi, 16-dars pitchi dalil sifatida o'qishi mumkin. `kim` — kishi raqami (1–3).
5. ~~`SINOV.md` tegda~~ — **yopildi: 9.38** (`m11-dars-13-done` tarkibida). Avvalgi savol: teg `m11-dars-13-done` tarkibiga qo'shilsinmi (tayanch 3 jadvalida faqat ro'yxat tuzatishi)? A2 kutilgan natijasi shu faylda.
6. ~~«Bugun» sarlavhasi~~ — **yopildi** (asosiy seans, 06.10: talabda umumiy «har kun o'z sarlavhasi bilan»; maketda Shanba / Yakshanba). Avvalgi savol: namuna o'yinlar faqat shanba va yakshanba — kutilgan natija maketida «Shanba» · «Yakshanba» (dars kuni noma'lum); «Bugun» — talab matnida (tayanch 1.8 misoli).
7. **A2 4-qadam nomi «Qayta sinov»** (tayanch 4 da 4-qadam — «Tekshirish»): bu blokda tekshiruvchi — boshqa odam, «tekshirish» so'zi (o'z ishini ko'rish) mos emas (T-015). Model nomi o'zgarishiga rozimisiz?
8. **A2 prompti** — agent `SINOV.md` ni o'quvchi yozuvidan yozadi (5-ekran ma'lumoti promptga oldindan to'ldiriladi); o'quvchining bitta qatori — «Nima buzilmasin». Muqobil: `SINOV.md` shablon «Nusxalash» bilan (9-Modul naqshi) — lekin blok modelida 2-qadam — prompt.
9. **Dars boshidagi sinfdosh sinovi** — alohida ekran yo'q (12 ekran chegarasi): 0-ekran O'qituvchi eslatmasi (kimda yozuv yo'q) + 1-ekran pastki qatori va eslatmasi (uchlik guruh, ≈ 8 daqiqa) + 5-ekran kirish qatori.
10. **Mentor misolidagi qayta sinov natijasi** («yangi odam · bajardi · Shanba o'yinini ro'yxat boshida topdi») — o'ylab topildi (A2 kutilgan natija).
11. **Uyga vazifa** — PM+PRAKT da bor deb oldim (9-Modul `m7-06` naqshi, tayanch 4 «PM — yakun kartasida»): auditoriyadan 2 kishi bilan qayta sinov.

## Shubhali joylar (ishonchim komil emas)
- **(yopildi, 13-FILTR 16–17)** **K10 o'zbekchasi:** «pulni qaytarish to'lqini» → «Ko'p xaridor pulini qaytarib so'radi»; «Xatolarni xaridorlar o'yinni sotib olgandan keyin ko'rdi» — bankdagi «непойманных багов» (sarlavha) dan xulosa, voqeaning o'zida aytilmagan. Auditor «da'vo» deyishi mumkin.
- **(yopildi: «o'yin uchun alohida qurilma», 13-FILTR 18)** **«Konsol — televizorga ulanadigan o'yin qurilmasi»** — umumiy bilim (bank emas); qo'lda ushlanadigan konsollar ham bor, lekin keys PlayStation haqida.
- **Cyberpunk 2077 nomi rangi** — «o'yin muqovasidagi rang» deb qoldirdim, aniq rang yozilmadi (quruvchi rasmiy muqovadan oladi).
- **(yopildi: tayanch 1.8, 9.90 — faqat ko'rinish tartibi, «eng yaqin» olindi)** **A1 Yordam promptida «Backend'ga tegma»** — Mentor misolida tartib ilovada (`index.tsx`) qilinadi deb oldim; agent tartibni `GET /oyinlar` ga qo'ymoqchi bo'lsa, talab buni taqiqlaydi. O'tib ketgan o'yinlar (kecha) ro'yxatda qoladimi — talabda aytilmagan.
- **«O'zgarish telefonda ko'rinmasa — terminalda `r`»** — Expo CLI «Reload the app» (tayanch 6, 10-dars); saqlangach ilova o'zi yangilanishi (Fast Refresh) rasmiy hujjatdan bu MD uchun alohida tekshirilmadi, shuning uchun matnda aytilmadi.
- **`SectionList`** (REPO) — React Native komponenti; agent boshqa usul tanlashi mumkin — «masalan» deb yozildi.
- **(yopildi: «Faqat kompyuter uchun chiqarildi», 13-FILTR 20)** **Arena 5 «Chiqishi bir necha yilga surildi»** — distraktor; real hayotda o'yin chiqishi bir necha marta surilgan bo'lishi mumkin (bankda yo'q) — o'quvchi «bu ham rost» deb o'ylashi mumkin. Muqobil kerak bo'lsa: «Avval faqat kompyuterda chiqdi».
- **3-ekran D varianti** — «1 kishida, vazifani to'xtatdi» ham muhim bo'lishi mumkin (2-ekran eslatmasi); B ikkala savol bo'yicha kuchliroq — bitta himoyalanadigan javob, lekin sinfda bahs chiqishi mumkin.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-12` «Loyiha kuni: 2-asosiy funksiya» → **`m9-13` «Uch foydalanuvchidan keyin nimani tuzatasiz?»** (osti — 1-ekran chap qatorida) →
  `m9-14` «Loyiha kuni: 3-asosiy funksiya» (App.jsx 383–385, grep bilan; yakundagi «Keyingi dars» shu nom).
- [x] Bitta misol-ip — «Maydon Jamoa» (hook → sanoq → bloklar namunasi); ikkinchi misol faqat 3-ekran testida, o'sha olamda (P-002). Metafora yo'q. Bitta vizual — `SinovSanoq` (0, 1, 2, 5, 8 va bloklar o'ngi); keys sahnasi — o'z maketi.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0 (yozuv-kartalar ochiladi), 2 (sanash → jadval, nuqta, belgi, tanlov), 4 (bosqich → sahna), 5 (qo'shish → sanoq), A1, A2. Matn-karta yo'q.
- [x] SABOQ 11: harakatli ekranlarda navbatdagi element halqa + pulsatsiya, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz. SABOQ 26: keysda uch blok.
- [x] O'lchov (python, `md13/olchov.py`): sarlavhalar ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosalar ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohlari ≤60 (qavsdagi sonlar).
- [x] Atamalar: sinov · sinov vazifasi · to'xtash · kuzatuv yozuvi · qayta sinov (9-Modul, so'zma-so'z) · sanoq (4-dars) · talab · agent · tekshirish (tayanch 2); «bug», «nosozlik», «usability», «sinovchi» yo'q ·
  siz-forma; Antigravity promptlari sen-formada (T-002) · tugmalar siz-formada yoki ot-shaklda («Sanash», «Vazifa natijasi», «Qatorni tanlang»).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin (skript), to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda · ✔ o'rni: 3-ekran B, 8-ekran D · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM+PRAKT — yakuniy `QTest`) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — grep 0; xulosalar «Bu sinovda», «Bu voqeada», «Bu qayta sinovda»).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «F2», «m9-13», «11-Modul» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha — «9-Modulda») · keys — bank matni, manba qatori bilan · «KOD» (13) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S · PM ko'rildi: T-002/008/011/014/015/029/039/042/043/045/047/048/052/064 · P-001/002/004/008/013/014/015/016/025/026/028/036/046/048/052/053/059/062/064/067 ·
  S-001/002/004/006/008/010/015/018/020/025/026/027 · PM-005/017/018/021/030.
- [ ] (ochiq) P-059 «4 qadam» nomlari — A2 4-qadam «Qayta sinov» (TAYANCHGA SAVOL 7). P-011 PM V4 tartibi to'liq emas (klinika, koding yo'q) — gibrid dars, 12 ekran (tayanch 4).
- [x] Ro'yxat tartibi (9.29) va bitta telefonda uch sinov (9.34) — yopildi; `pm-m9d13-sinov` va `SINOV.md` — 9.38.
