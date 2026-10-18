# 13-Modul (kod: `src/11-Modull`) · 9-dars (PM) «Kim haqiqatan to'lashga tayyor?» — MD v3

Fayl: `src/11-Modull/PmPayCheckLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-09` · **12 ekran** (keyssiz PM shakli — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket, bir vaqtda bitta katta karta (E 53) · odamlar real ko'rinishda (SABOQ 36) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 8-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 452–454, grep 07.10, DE-205): `m11-08` «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» → **`m11-09` «Kim haqiqatan to'lashga tayyor?»** (osti: «Mentor tekshiruvi: uchta yozma tasdiq», `type: 'PM'`) → `m11-10` «Loyiha kuni: taklif havolasi va mukofot».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (xabar, yozma tasdiq yozuvlari, tekshiruv natijasi, keyingi qadam), mustaqil ish majburiy (6, 7-ekranlar). **Keyssiz** (tayanch 5, Qaror-0 21). **Kod ekrani yo'q** (tayanch 4: «9 — yo'q»). REPO yo'q (tayanch 3: `m13-dars-09-done` = `08-done`).
**Real odamlar va pul bilan ishlaydigan dars** — `00-TAQIQLAR.md` 1 (real pul yo'q, bosim va soxta tasdiq yo'q) va 3 (o'smir xavfsizligi) to'liq; 12-Modul tayanchi 1.6 (olti bandli ro'yxat) kuchda.
Vaqt: ≈ 90 daqiqa (taqsimot — A-10; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 — Pro va kim to'laydi · 1.4 — Mentor narxi · 1.6 — 6-darsdagi uch suhbat · **1.9 — yozma tasdiq, Mentor misoli, Mentor tekshiruvi — AYNAN** · 1.13 — sonlar · 2 — atamalar (tasdiq, to'lovchi) · 4 — 9-dars qatori va keyssiz shakl · 7 — sinflar · 8 — `pm-m11d6-suhbat`, `pm-m11d4-narx`, `pm-m11d9-tasdiq` · **9.9–9.16 — suhbat yozuvi, uy suhbatlari shu darsda kiritiladi, «pul olinmaydi», to'lovchi**) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 3, 11, 12, 21, 22, 23) · `00-TAQIQLAR.md` (0, 1, 2, 3, 4, 5, 6, 7) · `00-NOMLAR.md` · 12-Modul tayanchi (1.6 — olti bandli ro'yxat; 1.10 — Mentor tekshiruvi shakli; 9.38 d, 9.39 e, 9.42 a) · 11-Modul tayanchi (1.4 — Mentor tekshiruvi; 9.66 — «Tuzatish topilmadi») ·
namunalar: 12-Modul `10-PmUsersCheck-v3.md` + `10-FILTR.md` (Mentor tekshiruvi — 4 va 11-ekran) · pilot `06-PmMoneyTalk-v3.md` (suhbat yozuvi, juftlik, yakka rejim) · 12-Modul `11-PmPitchReview-v3.md` + `11-FILTR.md` (12 ekranli keyssiz shakl).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «6-darsda», «4-darsdagi» (shu modul), «11-Modulda» (PRD tekshiruvi), «12-Modulda» (hisobot tekshiruvi, olti bandli ro'yxat). Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Kamida 3 kishi to'lashga tayyorligini tasdiqlaydi» → «3 tasdiq + yozuvlar»; tayanch 4: «kamida 3 yozma tasdiq (yoki halol natija) + Mentor tekshiruvi»; Qaror-0 2, 12):
   o'quvchi 6-darsdan keyin uyda o'tkazgan suhbatlarini kiritadi (6-ekran 1-qism; tayanch 9.10) → Mentor xabari asosida tanish to'lovchilarga **bosimsiz xabar** yozadi va darsda imkon bo'lsa yuboradi (2-qism) →
   kelgan **yozma tasdiq**larni so'zma-so'z yozadi, «hozir yo'q» va «javob yo'q»ni ham (3-qism) → sherigi bilan **Mentor tekshiruvi**ning uch savolida tekshiradi; yozma tasdiq uchtadan kam bo'lsa — **bitta keyingi qadam** (7-ekran).
   Saqlanadi: `pm-m11d9-tasdiq` (11-dars o'qiydi) va `pm-m11d6-suhbat` ga uy suhbatlari (tayanch 8: «9-dars uy suhbatlarini qo'shadi»).
   Natija olti holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab): yozma tasdiq bor va tekshirildi · tuzatish qoldi · tekshiruv qoldi · xabar yuborildi, yozma tasdiq hali yo'q · xabar tayyor, yuborilmagan · xabar yozilmagan. ✓ va nishon — faqat birinchi holatda.
   **«Uchta» — dastur maqsadi; yetmaslik — baho emas** (tayanch 1.9: «3 ga yetmaslik — tuzatish sababi emas (halol natija va keyingi qadam)»). Yakun sarlavhasi o'quvchi qilgan ishni aytadi, sonni baholamaydi.
   Bugun hech kimdan pul olinmaydi; to'lov sahifasi va «mashq to'lov» havolasi odamlarga berilmaydi (TAQIQLAR 1; tayanch 9.11). Keyingi darslar ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Yozma tasdiq — odamning o'zi yozgan narx va nima uchun; u to'lov emas va uch savol bilan tekshiriladi. (102)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 13-Modul: **narx** (4-dars; Mentor misolida — «Mentorning taxmini» 30 kun — 15 000 so'm) · **Pro** · **«Doimiy o'yin»** · **to'lovchi** — «pul to'laydigan foydalanuvchi» (1-dars; tayanch 2, 9.16; 6-darsdagi «to'laydigan odam» shu so'z bilan tenglashadi — 6-ekran Yordami) ·
     **«mashq to'lov»** (3-dars — o'quvchi o'z Backend'ida quradigan test to'lov sahifasi; bugun faqat «odamga berilmaydi» qoidasida) · **pullik obuna** (doim ikki so'z; bu darsda faqat A-6 da).
   - 6-dars: **suhbat** — «sotish emas, savol» · **so'zma-so'z** · **belgi** (ha · qimmat · yo'q · javob yo'q) · **real suhbat** / **mashq yozuvi** · **tanish** ↔ **notanish** · «Uch suhbat — kichik son: narx haqida dalil, isbot emas» shakli · **«Pul olinmaydi — "ha" desa ham»** (9.11).
   - 11 va 12-Modul: **Mentor tekshiruvi** — uch savol, javob **qabul** yoki **tuzatish**; yakka rejimda — **«Tuzatish topilmadi»** (11-Modul 5-darsi — PRD; 12-Modul 10-darsi — hisobot; 11-Modul tayanchi 9.66) · **dalil** — «da'voni ko'rsatadigan son yoki yozuv» (12-Modul 11-darsi) · **olti bandli ro'yxat** (12-Modul 6-darsi, `XAVFSIZLIK`).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **yozma tasdiq** (tayanch 2, 1.9: «odamning yozma javobi: narx X bo'lsa, … uchun to'layman; real to'lov emas») — 2-ekran xulosasida, olti javob ajratilgandan keyin: «Bu darsda yozma tasdiq — odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan.»
     Shu bitta shakl: 2-ekran xulosasi = yakun 1-qatori = kartochka 1 javobi. «real to'lov emas» — 2-ekran `QIzoh`, kartochka 3, yakun 2-qatori.
     6-darsdagi suhbat yozuvi bilan farqi bir gapda (T-052; 2-ekran 1-javob `QIzoh`, kartochka 2): «6-darsdagi gapni Mentor yozgan edi — bu xabarni tashkilotchining o'zi yozdi.»
   - **javob holati** — xabarga kelgan javobning to'rt holati: **yozma tasdiq** · **aniqlashtirish kerak** (javob berdi, lekin narx yoki nima uchun yo'q — F-1007-467) · **hozir yo'q** · **javob yo'q** (tayanch 1.9 so'zlari; tartib o'zgarmaydi). 2-ekranda tugmalar atamadan oldin: «Narx va nima uchun yozdi» · «Hozir yo'q» · «Javob yo'q»; xulosadan keyin ustun nomi «Yozma tasdiq» bo'ladi.
   - **Mentor tekshiruvining bugungi uch savoli** (tayanch 1.9 so'zma-so'z): «Kim tasdiqladi?» · «Narx va nima uchun yozilganmi?» · «So'zma-so'z va bosimsiz olinganmi?» — 4-ekranda; ko'prik bir gap (4-ekran `QIzoh`): «12-Modulda hisobotni shunday tekshirgansiz — bugun uch savol yozma tasdiqlar uchun.»
   - **keyingi qadam** — yozma tasdiq uchtadan kam bo'lganda yoziladigan bitta ish (7-ekran, 4-qism; tayanch 1.9 «halol natija va keyingi qadam»). Ta'rif-gapi yo'q — karta savoli o'zi aytadi.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«yozma tasdiq»** — o'quvchi matnida doim ikki so'z (tayanch 2: «9-darsda "yozma tasdiq"»). Istisno: Mentorning halol gapi tayanch 1.9 dan so'zma-so'z («Uchta yozma tasdiq — …» — F-1007-467 dan atama bir xil, olam ichidagi matn — T-008) va tayanchdagi savol fe'li «Kim tasdiqladi?».
     12-Moduldagi «kelishini tasdiqladi» qadami bu darsda yo'q — aralashmaydi. Qo'shtirnoqdagi «tasdiq» — soxta yozuv ma'nosida (o'zi yozgan, bosim bilan olingan: 7-ekran, kartochka 8, arena 7).
   - **«xabar»** — chat xabari: Mentor yoki o'quvchi yozgan, yozma tasdiq so'raladigan xabar va unga kelgan javob (tayanch 1.9: «chat xabari yoki qog'oz»). **«so'rov»** — ishlatilmaydi (3-darsda Backend so'rovi ma'nosida); fe'l — «so'rash» («6 tashkilotchidan so'raldi» — tayanch).
   - **«nima uchun»** — odam nimaga pul to'lashi (Mentor misolida — «Doimiy o'yin»), sabab emas. 4-tashkilotchining «charchadim» gapi — sababi, u «gap» ustunida qoladi (6-ekran Yordami).
   - **«belgi»** — faqat suhbat yozuvidagi to'rtta (6-ekran 1-qism); xabarga javob — **«holat»** (yozma tasdiq · hozir yo'q · javob yo'q). «javob yo'q» ikkalasida bir ma'noda: odam javob bermadi (hali kelmagani ham).
   - **«yozuv»** — bitta suhbat yoki bitta yozma tasdiqning yozib olingani · **«varaq»** — `TasdiqVaraq` ning ko'rinishi (o'quvchiga «Yozma tasdiqlarim», «Yozuvlarim» — real va mashq, 6-dars F-1007-464) · **«to'lovchi»** — tayanch 2 (9.16); bu darsda «to'laydigan odam» ishlatilmaydi.
   - **«keyingi qadam»** — tayanch 1.9 iborasi (uchtaga yetmaganda yoziladigan bitta ish); 12-Moduldagi «qadamlar» (foydalanuvchi yo'li) bu darsda yo'q — aralashmaydi.
   - **«tekshiruv»** — faqat Mentor tekshiruvi (va test ekranlari eyebrow'ida «Tekshiruv» — kurs naqshi). **«sinov»** — bu darsda yo'q. **«skript»** — ishlatilmaydi (tayanch 9.9, GATE M M-q2 A: 6-dars atamasi — «suhbat savollari»; bu darsda faqat «6-darsdagi savolingiz» qatori, kalit maydoni `skript[2]` ichki).
   - **Ishlatilmaydi:** predzakaz, oldindan to'lov (faqat «yo'q» qoidasida), chekpoint, sotuv, ko'ndirish (ot), so'rov, «obuna» yolg'iz, test holati, user, keys, «Modul 13», pilot, daftar, CAC, LTV, paywall, sandbox.
6. **Mentor misoli (tayanch 1.0, 1.4, 1.6, 1.9 — AYNAN; o'quvchi matnida «Mentor misolida»):**
   - **Kim to'laydi (1.0):** Pro — tashkilotchi uchun 30 kunlik pullik obuna, bitta qulaylik «Doimiy o'yin»; o'yinchilar uchun hamma narsa bepul. Varaqdagi qator (`PRO_QATOR`): «Pro — tashkilotchi uchun · o'yinchilar bepul».
   - **Narx (1.4, «Mentorning taxmini»):** 30 kun — 15 000 so'm. **6-darsdagi 1-tashkilotchi yozuvi (1.6 so'zma-so'z; `MENTOR_SUHBAT1`):** «Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.» — belgi «ha», narx 15 000.
   - **Mentor xabari (`MENTOR_XABAR`; ⚠️ tayanchda yo'q — TAYANCHGA SAVOL 1):** «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz. Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.»
     Talqin (F-1007-467): Mentor aynan narx va nima uchunini so'radi — javoblar shuning uchun shu shaklda; bu o'z-o'zidan kelgan gap emas (O'qituvchi eslatmasi, 2-ekran).
   - **Olti tashkilotchi va javoblar (1.9 sonlari aynan; `MENTOR_JAVOBLAR`; javob matnlari — tayanch 1.9 (F-1007-467 dan kanonik: avval tayanch bo'laklari va qolipdan yig'ilgan edi) — TAYANCHGA SAVOL 2, 3, 4):**

| Kim | 6-darsda | Javobi (chat, so'zma-so'z) | Holat | Narx | Nima uchun |
|---|---|---|---|---|---|
| 1-tashkilotchi | suhbat: ha (15 000) | «15 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» | yozma tasdiq | 15 000 | «Doimiy o'yin» |
| 2-tashkilotchi | suhbat: yo'q | «Hozir yo'q. Telegram guruhi tekin.» | hozir yo'q | — | — |
| 3-tashkilotchi | suhbat: qimmat (10 000) | «15 000 qimmat. 10 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» | yozma tasdiq | 10 000 | «Doimiy o'yin» |
| 4-tashkilotchi | suhbat bo'lmagan | «Har shanba o'zim yozishdan charchadim. 15 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» | yozma tasdiq | 15 000 | «Doimiy o'yin» |
| 5-tashkilotchi | suhbat bo'lmagan | «Hozir yo'q.» | hozir yo'q | — | — |
| 6-tashkilotchi | suhbat bo'lmagan | — (javob kelmadi) | javob yo'q | — | — |

   - Jami (1.13 · 9-dars qatori): so'ralgan **6** (1-darsdagi oltita tashkilotchining hammasi — 1.13) · yozma tasdiq **3** (15 000 — 2, 10 000 — 1) · «hozir yo'q» **2** · javobsiz **1**. Kim — tartib raqami, ismsiz; mahalla futbol guruhidagi tanishlar, guruh egasining ruxsati bilan (6-darsdagidek — TAYANCHGA SAVOL 4).
   - **Mentorning halol gapi (1.9 so'zma-so'z; `MENTOR_HALOL`):** «Uchta yozma tasdiq — ikkitasi 15 000 da, bittasi 10 000 da: narx haqida dalil, isbot emas.» Nimaning isboti emasligi (sinf 5) — «narx to'g'ri ekanining isboti emas» (kartochka 10, yakun 4-qatori).
   - **Mentor tekshiruvi (1.9):** uch savoldan o'tadi → **qabul**. 3-tashkilotchining 10 000 i — uning yozma tasdig'i; Mentor narxni bu darsda o'zgartirmaydi (1.6 xulosasi: «Narx hozircha qoladi»).
7. **Raqamlar (faqat tayanch 1.4, 1.6, 1.9, 1.13; «Mentor misolida» / «Mentorning taxmini»):** 30 kun — 15 000 so'm · 6 so'ralgan · 3 yozma tasdiq (2 × 15 000, 1 × 10 000) · 2 «hozir yo'q» · 1 javobsiz · 1–6-tashkilotchi — tartib raqami.
   Boshqa son yo'q: 11-dars va 10-dars sonlari aytilmaydi (sinf 12). Testlardagi «5 000 so'm» — ikkinchi misol (kitob almashish ilovasi; P-002), Mentor soni emas.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi (3-ekran; 6-darsdagi testlar olami) · sherigingizning yozuvi (5-ekran) · ikki tanishingiz (8-ekran). Metafora yo'q. Keys yo'q.
9. **Real odamlar va pul chegarasi (TAQIQLAR 1, 3; Qaror-0 11, 12; tayanch 1.9, 9.11):**
   - kimdan: faqat **tanish to'lovchi** — 11-Modulda intervyu bergan odamlar, sinfdosh, ota-ona, mahalla guruhidagi tanish (guruh egasining ruxsati bilan); notanishga yozilmaydi; o'zi yoki to'lovchi bo'lmagan odam (Mentor misolida — o'yinchi) yozgan «tasdiq» — tuzatish;
   - **darsda xabar** — faqat 6-darsdagi suhbatdoshga (real suhbat — darsda yoki uyda; uydagisi haqida ota-ona biladi — 6-dars uyga vazifasi ①) yoki to'lovchi bo'ladigan sinfdoshga; oldin yozmagan tanish to'lovchiga — uyda, ota-onaga aytib (TAYANCHGA SAVOL 6); javob kutib dars to'xtamaydi;
   - xabar — bir marta, har odamga alohida, guruhga emas; «hozir yo'q» degan yoki javob bermaganga qayta yozilmaydi; «hozir olmasangiz…», «hamma oldi», «o'ylab ko'ring» yo'q; xabarda «Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.» qatori o'zgarmaydi;
   - **real pul yo'q:** yozma tasdiq — to'lov emas; pul, oldindan to'lov, karta, «mashq to'lov» havolasi, to'lov sahifasi — odamga berilmaydi va so'ralmaydi; xabarga havola qo'yilmaydi;
   - yozuvda va kalitda: rol (ism emas) — ism, familiya, telefon, Telegram nomi, maktab raqami yo'q; skrinshot ko'rsatilsa — ism va telefon yopiladi (tayanch 1.9); sherikka xabarning o'zini ko'rsatish shart emas;
   - sinfda kim nechta yozma tasdiq olgani so'ralmaydi va qo'l ko'tartirib sanalmaydi (12-Modul 9.39 e); Mentor ekranida va proyektorda — faqat saqlash signallari, son va matn yo'q;
   - 12-Modul olti bandli ro'yxati (`XAVFSIZLIK`) kuchda — mahalla guruhi orqali yozilsa (6-ekran Yordami).
10. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · javoblar va 1-savol (2–3) ≈ 14 · Mentor tekshiruvi va 2-savol (4–5) ≈ 12 ·
    yozma tasdiqlaringiz (6) ≈ 25 (uy suhbatlari ≈ 7 · xabar va yuborish ≈ 8 · javoblar ≈ 10) · tekshiruv va keyingi qadam (7) ≈ 13 · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 16 · zaxira ≈ 5.
    **Ulgurmagan o'quvchi yo'li:** 6-ekranda «Uyda suhbat bo'lmadi» va «Hozir yubora olmayman» — qism o'tkazib yuboriladi · javob darsda kelmasa — holat «Javob yo'q» qoladi · 7-ekranda yozma tasdiq yo'q bo'lsa — faqat keyingi qadam ·
    jonli darsda Mentor 6, 7-ekranlarni `optionalLive` bilan o'tkazadi · yakun sarlavhasi holatga qarab. Tashqi kutish dars oqimini to'xtatmaydi (repo, build, xizmat yo'q; javob kutilmaydi).
11. **Saqlash kalitlari (tayanch 8; 9-dars sxemasi — pilotlardan keyin aniqlashtiriladi, qo'shimchalar TAYANCHGA SAVOL 7, 8):**
    - **o'qiydi:** `pm-m11d6-suhbat` (`suhbatlar[]` — kim, gap, javob, narxi, tur; `skript[2]` — kulrang qator) — 6-ekran · `pm-m11d4-narx` (`narx`, `davrKun`, `ekran.sarlavha`) — 6-ekran xabar qolipi ·
      `pm-m11d2-model.kim` — varaqdagi «To'lovchi: …» qatori (7-ekran 1-savol dalili; TAYANCHGA SAVOL 8). Yo'q bo'lsa: suhbatlar ro'yxati bo'sh; narx — o'quvchi yozadi; «To'lovchi» qatori ko'rinmaydi.
    - **yozadi (1):** `pm-m11d6-suhbat.suhbatlar` ga uy suhbatlari (tayanch 8, 9.10): `{ id, tur: 'real', kim, hozir: string | null, gap, javob: 'ha' | 'qimmat' | 'yoq' | 'javobsiz', narxi: n | null, qachon }` ·
      `id` — davomi (`s3`, `s4`…; 6-dars yozuvlari o'zgarmaydi) · real yozuvlar jami ≤ 3 («real 0–3 + mashq 0–1») · `hozir` — o'quvchi qog'ozga yozgan bo'lsa, bo'lmasa `null` · `narxi` — 9.10 qoidasi · `qachon` — suhbat bo'lgan kun `YYYY-MM-DD` (sukut — bugun, o'quvchi o'zgartiradi; kiritilgan vaqt — `savedAt`; F-1007-467) · `skript` va `xulosa` tegilmaydi (`xulosa` — `null` qoladi; TAYANCHGA SAVOL 5).
    - **yozadi (2):** `pm-m11d9-tasdiq` = `{ soralgan: n, tasdiqlar: [{ id, kim, narx, nima, gap, oldingiGap: string | null, qachon, manba: 'chat' | 'qogoz', hisobga: bool }], aniqlashtirish: n, hozirYoq: n, javobsiz: n, xabar: string | null, tekshiruv: 'qabul' | 'tuzatish' | 'topilmadi' | null, tuzatishSabab: 'kim' | 'narx' | 'gap' | null, keyingiQadam: string | null, savedAt }`. Maydonlar shartnomasi:
      `soralgan` — yozma javob so'ralgan odamlar soni (chatda yoki qog'ozda; birlik — odam); **o'zgarmas shart:** `soralgan` = `tasdiqlar.length` + `aniqlashtirish` + `hozirYoq` + `javobsiz` (F-1007-467) · yozma tasdiqlar soni — `hisobga: true` lar · `id` — `t1`, `t2`… (barqaror) · `kim` — rol, munosabat qavsda («tashkilotchi (mahalla guruhidagi tanish)»; PM-018, 9.10 shakli), ism emas ·
      `narx` — odam yozgan narx, so'mda, son · `nima` — nima uchun to'lashi (≤ 40) · `gap` — odamning xabari so'zma-so'z (≤ 160) · `qachon` — javob kelgan kun (sukut — bugun, o'zgartiriladi; F-1007-467) · `oldingiGap` — aniqlashtirishdan oldingi to'liq bo'lmagan javob (bo'lmasa `null`; F-1007-467) · `hisobga` — sukut `true`; to'lovchi bo'lmagan odam yoki bosim bilan olingan — `false`, yozuv tarixda qoladi (F-1007-467) · `manba` — xabar chatdami yoki qog'ozdami · bitta odamdan bitta yozuv ·
      `xabar` — o'quvchi yozgan xabarning to'liq matni (o'zgarmaydigan qator bilan) · `tekshiruv` — `'qabul'` (juftlikda yoki Mentor ko'rganda), `'topilmadi'` (yakka rejim), `'tuzatish'` («Uyda tuzataman»), `null` (tekshiruv o'tkazilmagan yoki yozma tasdiq yo'q) ·
      `tuzatishSabab` — qaysi savol: `'kim'` (1) · `'narx'` (2) · `'gap'` (3) · `keyingiQadam` — yozma tasdiq < 3 bo'lsa yoziladi, aks holda `null` · `savedAt` — har saqlashda. Kalitga ism, login, telefon, Telegram nomi yozilmaydi. Kod qoralamasi kaliti yo'q.
12. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari o'quvchi matnida yo'q; belgi-formula (→, ×, =) o'quvchi izohida yo'q.
13. **Kod ekrani yo'q** (tayanch 4: PM darslarida mexanika ketma-ket takrorlanmaydi — 7 — bloklar · 9 — yo'q · 11 — yo'q). **Trek:** PM darsi, blok yo'q — ikkala trekka bir xil; sarlavha va savollarda «mahsulotingiz» (sinf 11).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.4, 1.6, 1.9):** 4-darsda narx chiqarildi (Mentorning taxmini 15 000), 6-darsda uch suhbat bo'ldi — «ha», «yo'q», «qimmat»: bu odamlarning so'zi. Bugun — o'sha narxga odamlarning o'zi yozgan javobi: kim haqiqatan to'lashga tayyor.
  11-dars shu yozuvlarni o'qiydi (MD ichida; o'quvchiga va'da qilinmaydi).
- **Dars ipi:** 0 — 6-darsdagi «15 000 ga olaman» yozuvi: unga ishonasizmi? (ballsiz) → 2 — Mentor oltita tashkilotchiga bir xil xabar yozdi: kim narxni yozib berdi (atama «yozma tasdiq») → 3 — test: kitob ilovasida qaysi biri yozma tasdiq →
  4 — Mentor varag'iga uch savol, dalilni varaqdan topish; 6 dan 3 — qabul → 5 — test: narxsiz «ha» → 6 — uy suhbatlaringiz, xabaringiz, kelgan javoblar → 7 — sherik bilan uch savol; uchtaga yetmasa — keyingi qadam →
  8 — yakuniy: ikki yozma tasdiq va bitta «hozir yo'q» — endi nima qilasiz → podium → kartochkalar → yakun (holatga qarab); uyda — qolgan tanishlarga bir marta xabar, javob qog'ozga.
- **Bitta vizual — «Tasdiq varag'i» (`TasdiqVaraq`, dars bo'yi; 163/180; bitta manba `MENTOR_XABAR` + `MENTOR_JAVOBLAR` + `MENTOR_HALOL` + `PRO_QATOR` + o'quvchi ma'lumoti `pm-m11d6-suhbat`, `pm-m11d9-tasdiq`):**
  - **telefon** (chapda, ≈170×272 — SABOQ 22; 2, 6-ekran): chat oynasi — tepada suhbatdosh nomi rol bilan («3-tashkilotchi» / «{kim}»), birinchi pufak — xabar (Mentorniki yoki o'quvchiniki, to'liq), ikkinchi — javob (bo'lsa); chat ichki skroll bilan, yangi pufak pastda (U-050). Chat — umumiy messenjer ko'rinishida: ilova nomi, rangi va logotipi chizilmaydi (Telegram keysi emas — TAQIQLAR 8). Telefon ekranida ism, telefon raqami, rasm yo'q.
  - **varaq** (o'ngda; 1, 2, 4, 7-ekran): tepada «Mentor misoli · Maydon Jamoa» (nom o'z yashil rangida — 11-Modul 9.62) → o'quvchida «Yozma tasdiqlarim» · ostida kulrang qator `PRO_QATOR` (o'quvchida — «To'lovchi: {kim}», bo'lsa) ·
    xabar qatori (4, 7-ekranda: «Xabar: «…»» to'liq) · jadval: **kim · holat · narx · nima uchun · gap** (7-ekranda + «qayerda») · pastda hisoblagichlar: «so'ralgan · n» · «yozma tasdiq · n» · «hozir yo'q · n» · «javob yo'q · n» · varaq tepasida muhr joyi.
    Holat katagi rangi: yozma tasdiq — `ok` · hozir yo'q va javob yo'q — kulrang `ink2` (qizil yo'q — «yo'q» xato emas). Gap — qo'shtirnoqda, kursivsiz.
  - **sahna** (0-ekran): odam real ko'rinishda (SABOQ 36: bosh, soch, yuz belgisi, rangli kiyim) — rol yorlig'i bilan, qo'lida telefon («Maydon Jamoa» o'yin kartasi → tanlovdan keyin chat); yonida varaq bo'lagi.
  - Ishlatiladi: 0 (sahna + varaq bo'lagi) · 1 (varaq — ustun nomlari va olti qator nomi) · 2 (telefon + varaq) · 3, 5, 8 (javobdan keyin kichik varaq bo'lagi) · 4 (varaq to'liq + xabar qatori) · 6 (Yozuvlarim / telefon + karta + ixcham varaq) · 7 (o'quvchi varag'i + savol kartasi).
  - `prefers-reduced-motion` da uchish va to'lqin yo'q — yakuniy holat birdan qo'yiladi. 393 kenglikda telefon varaq ustida, o'lchami kichraymaydi; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → javob pufagi telefondan varaq qatoriga uchadi, narx va «nima uchun» kataklarga sirg'aladi · yangi qator ~1 s yashil yonadi · hisoblagich sanab o'sadi · muhr «tushadi». Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Kim haqiqatan to'lashga tayyor?** (31) — dars nomi (DE-205)
- Mentor: 6-darsda Mentor shu gapni yozib olgan edi. Siz uning gapiga ishonasizmi?
- Maket (chap; `TasdiqVaraq` sahna holati): odam (real ko'rinishda, yorliq «1-tashkilotchi»), qo'lidagi telefonda «Maydon Jamoa» (o'z yashil rangida) va namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (tayanch 1.0); yonida varaq bo'lagi «Mentor misoli · 6-darsdagi suhbat yozuvi»:
  «1-tashkilotchi · «Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.» · ha · 15 000» (tayanch 1.6 so'zma-so'z).
- Variantlar (radio, o'ng; bir uzunlikda — P-016):
  - Ishonaman — o'zi aytgan (23)
  - Ishonmayman — hali gap (22)
  - Bilmayman — hali erta (21)
- Javob (uchalasida bir xil, maqtovsiz — J-026, KORPUS §119): Uchala fikr ham bo'lishi mumkin — oldindan bilib bo'lmaydi. Bugun Mentor bu gapni qanday tekshirganini ko'rasiz. (112)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; varaqdagi «ha · 15 000» qatori bir lahza accent bilan yonadi; odam qo'lidagi telefon ekrani chatga almashadi (sarlavhasi «Mentor», ichida «…») — 2-ekranga ko'prik, javob ochilmaydi (P-036).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — bugun Mentor bu gapni qanday tekshirganini ko'rasiz. 6-darsdan keyin uyda suhbat o'tkazganlar qog'ozini olib qo'ysin — 6-ekranda kerak bo'ladi.
✎ Hook — o'quvchi 6-darsda ko'rgan yozuv va o'z savoli: «olaman» degan odam haqiqatan to'laydimi (P-016). Uch variant — ishonish darajasi; payoff hech birini rad etmaydi (KORPUS §119). «Yozma javob» so'zi hookda yo'q — 2-ekran kashfiyoti.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun «olaman» degan gapni tekshirishni o'rganasiz.** (51)
- Mentor: 6-darsda narx haqida gaplashdingiz. Endi tanishlaringizdan javobni yozib berishni so'raysiz va yozuvlarni tekshirasiz.
- Chap — yorliq «Mentor tekshiruvi: uchta yozma tasdiq» (App.jsx osti so'zma-so'z, P-015) + ostida kulrang qator: Darsda — xabar va kelgan javoblar; qolgani uyda. Uchtaga yetmasa ham — halol natija. (84)
  Vizual: `TasdiqVaraq` varaq o'zi yuradi (DE-200) — sarlavha «Mentor misoli · Maydon Jamoa», ustun nomlari «kim · holat · narx · nima uchun · gap», olti qator nomi «1-tashkilotchi … 6-tashkilotchi» navbat bilan yoziladi, qolgan kataklar uzuq (2-ekranda o'quvchi to'ldiradi — U-041); tepada bo'sh muhr joyi.
  Javoblar va sonlar yo'q — 2-ekran kashfiyotini ochmaydi (P-036); ustun va qator nomlari — haqiqiy mazmun (SABOQ 33).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Odamning o'zi yozgan javobini suhbatdagi gapdan ajratasiz · `yozma tasdiq`
  - 02 · Yozuvlarni uch savol bilan tekshirasiz · `Mentor tekshiruvi`
  - 03 · Tanishlaringizga bosimsiz xabar yozasiz · `xabar`
  - 04 · Sherigingiz bilan yozuvlaringizni tekshirasiz · `qabul · tuzatish`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Menyu ostidagi «uchta yozma tasdiq» — dastur natijasi. Darsda — xabar va kelgan javoblar; ko'p o'quvchida darsda yozma tasdiq 0–1 bo'ladi, qolgani uyda. Uchtaga yetmaslik — baho emas. Darsda hech kim pul olmaydi va hech narsa sotmaydi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «yozma tasdiq» faqat chap yorliqda (App.jsx osti so'zma-so'z) va kulrang tegda; ta'rif — 2-ekranda (P-014). Chap kulrang qator menyu ostini darsdagi haqiqatga chegaralaydi (11-Modul 03-FILTR 1 sinfi).

## 2 · Kim narxini va nimaga to'lashini yozdi?  ← QTushuncha (markaziy; ketma-ket 6 javob — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · yozma tasdiq
- Sarlavha: **Kim narxini va nimaga to'lashini yozdi?** (39)
- Mentor: Mentor tashkilotchilarga bir xil xabar yubordi — har javobga mos tugmani bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047. «Olti» soni — faqat bashoratda va hisoblagichda, P-062.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Oltitadan nechtasi narx va nima uchunini yozadi?** · 1 · 3 · 5 — tanlangach yopilmaydi: ixcham qator «Taxminingiz: N» natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: telefon · varaq · tugmalar qatori): **chapda** — telefon: chat sarlavhasi «{N}-tashkilotchi», birinchi pufak — Mentor xabari (`MENTOR_XABAR`, to'liq; olti chatda bir xil), ikkinchi — javob (6-chatda javob pufagi yo'q) ·
  **o'ngda** — varaq «Mentor misoli · Maydon Jamoa»: kulrang `PRO_QATOR` · jadval (olti qator, «kim» to'la, qolgani uzuq) · hisoblagichlar «narx va nima uchun yozdi · 0 · hozir yo'q · 0 · javob yo'q · 0» · **varaq ostida** — uch tugma: «Narx va nima uchun yozdi» · «Hozir yo'q» · «Javob yo'q».
- Javoblar (navbat bilan; A-6 jadvali so'zma-so'z):
  1. **1-tashkilotchi:** «15 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» ✔ Narx va nima uchun yozdi → narx katagiga «15 000», «nima uchun» katagiga «Doimiy o'yin» uchadi.
     Telefon ustida kulrang qator (faqat shu javobda): 6-darsda Mentor yozib olgan: «O'zi e'lon qilsa — 15 000 ga olaman.»; to'g'ri tanlovdan keyin `QIzoh` (~3 s): 6-darsdagi gapni Mentor yozgan edi — bu xabarni tashkilotchining o'zi yozdi. (76)
  2. **2-tashkilotchi:** «Hozir yo'q. Telegram guruhi tekin.» ✔ Hozir yo'q → holat katagi kulrang «hozir yo'q», narx va «nima uchun» — «—».
  3. **3-tashkilotchi:** «15 000 qimmat. 10 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» ✔ Narx va nima uchun yozdi → narx katagiga «10 000» uchadi; `QIzoh` (~3 s): «Qimmat» dedi, lekin boshqa narxda to'lashini yozdi. (52)
  4. **4-tashkilotchi:** «Har shanba o'zim yozishdan charchadim. 15 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» ✔ Narx va nima uchun yozdi → «15 000».
  5. **5-tashkilotchi:** «Hozir yo'q.» ✔ Hozir yo'q.
  6. **6-tashkilotchi:** (chatda faqat Mentor xabari, javob pufagi yo'q) ✔ Javob yo'q → holat katagi kulrang «javob yo'q».
- **Harakat → Vizual o'zgarish:** tugmani bosish → to'g'ri bo'lsa javob pufagi telefondan varaqdagi qatorga uchadi (~1 s; «narx va nima uchun yozdi» — yashil, «hozir yo'q» va «javob yo'q» — kulrang), son va «Doimiy o'yin» gapdan kataklarga sirg'aladi, hisoblagich o'sadi;
  telefon keyingi chatga o'tadi (sarlavha almashadi, Mentor xabari o'sha, yangi javob pufagi kirib keladi).
  Xato → tugma silkinadi, javob pufagi bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1, 4-javob, «Hozir yo'q» yoki «Javob yo'q»: Xabarning oxirini o'qing: u nima qiladi? (40)
  - 3-javob, «Hozir yo'q»: Xabarning ikkinchi gapiga qarang. (33)
  - 2, 5-javob, «Narx va nima uchun yozdi»: Xabarida narx va nima uchun bormi? (34)
  - 2, 3, 5-javob, «Javob yo'q»: U javob berdi — xabari chatda turibdi. (38)
  - 6-javob, «Narx va nima uchun yozdi» yoki «Hozir yo'q»: Chatda uning xabari bormi? (26)
- Natija (bitta blok — E 42; `tugadi`: tugmalar yopiladi, telefon yig'iladi, varaq butun enga, ⛶ ichida — q17/q18): «holat» ustunidagi «narx va nima uchun yozdi» yozuvlari **«yozma tasdiq»** bo'ladi (harflar almashadi);
  hisoblagichlar: «so'ralgan · 6» · «yozma tasdiq · 3» · «hozir yo'q · 2» · «javob yo'q · 1». Varaq ostida kulrang Mentor yozuvi (T-008 — olam ichidagi matn; tayanch 1.9 so'zma-so'z): Uchta yozma tasdiq — ikkitasi 15 000 da, bittasi 10 000 da: narx haqida dalil, isbot emas.
  Yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 3».
- Xulosa: Bu darsda yozma tasdiq — odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan. (88) — atama shu yerda tug'iladi (T-011)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Yozma tasdiq — odamning hozirgi niyati, to'lov emas: Mentor hech kimdan pul so'ramadi. (86)
- Tugma (pastki): Avval belgilang → Javoblarni ajrating (N/6) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Xabarda narx bormi, «hozir yo'q» bormi yoki xabar umuman yo'qmi — qarang. (73)
- Keyingi bosiladigan joy: bashorat variantlari → uch tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: In Writing! (olti javob birinchi urinishda).
- O'qituvchi eslatmasi: Mentor misolida Pro — tashkilotchi uchun, o'yinchilar bepul (tayanch 1.0): shuning uchun Mentor ilovadagi oltita tashkilotchiga yozdi — 6-darsdagi uchtasi ham (1.9). 4, 5, 6-tashkilotchi bilan 6-darsda suhbat bo'lmagan.
  3-tashkilotchining 10 000 i — uning yozma tasdig'i: Mentor narxni bu darsda o'zgartirmadi. Mentor xabarini ovoz chiqarib o'qing: narx bor, «Bu to'lov emas», «Yozmasangiz ham bo'ladi» — bosim yo'q.
  Sinfga savol: «Og'zaki «olaman» bilan o'zi yozib bergan javobning farqi nima?» (javoblar og'zaki, sanalmaydi).
✎ Javoblar tartibi — tashkilotchilar tartibi (1–6). Bitta o'ylanadigan joy — 3-javob: «qimmat» so'zi bor, lekin narx bilan yozilgan. Tugma nomlari atamadan oldin oddiy so'z bilan (T-011), atama natijada tug'iladi.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · yozma tasdiq (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Kitob almashish ilovangiz uchun qaysi biri yozma tasdiq?** (8 so'z)
  - A — Tanishingiz chatda faqat «ha, kerak» deb yozdi (46)
  - ✔ B — Tanishingiz narx va nima uchun to'lashini yozdi (47)
  - C — Tanishingiz 5 000 so'mni oldindan o'tkazib berdi (48)
  - D — Uning og'zaki gapini narxi bilan o'zingiz yozdingiz (51)
- Kalit: **B** (index 1). To'rttalasi bir shaklda (o'tgan zamon fe'li bilan tugaydi); uzunlik — «O'lchov»; to'g'ri javob yolg'iz eng uzun emas; «narx» B va D da, «yozdi» A va B da (kalit so'z faqat to'g'rida emas).
  Distraktorlar uch xil (12-Modul 9.44 f): A — narxsiz yozma javob · C — real pul (TAQIQLAR 1) · D — gapni odam emas, o'quvchi yozgan.
- To'g'ri izohi: Narx va nima uchun — odamning o'zi yozgan. (42)
- Xato izohlari (≤60):
  - A: Yozdi — lekin narx qani? (24)
  - C: Bu pul — yozma tasdiqda pul olinmaydi. (38)
  - D: Gapni kim yozdi — u odammi yoki sizmi? (38)
  - (umumiy) Yozma tasdiqda nima bo'lishi kerak edi? (39)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kichik varaq qatori — «narx» va «nima uchun» kataklari yashil, «kim yozgan: o'zi» yorlig'i.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Own Words! — birinchi urinishda to'g'ri.
- Izoh (MD): distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004): A — narx yo'q (2-ekran: «Narx va nima uchun yozdi» tugmasi) · C — pul olinmaydi (2-ekran `QIzoh`; C kuchsiz dalil degani emas — bu darsda real pul olinmaydi, F-1007-467) · D — gapni odam yozmagan (2-ekran 1-javob `QIzoh`).
  C hayotda kuchliroq va'da bo'lishi mumkin, lekin u yozma tasdiq emas va bu kursda taqiqlangan — savol aynan «qaysi biri yozma tasdiq» deb so'raydi. Ikkala trekka to'g'ri.

## 4 · Mentor tekshiruvi  ← QTushuncha (ketma-ket, 3 savol; dalilni varaqdan bosib topish — 12-Modul 10-dars 4-ekran shakli)
- Eyebrow: Tushuncha · Mentor tekshiruvi
- Sarlavha: **Yozma tasdiqlarni qaysi savollar bilan tekshirasiz?** (51)
- Mentor: Har savolning javobini Mentor varag'idan bosib toping.
  (Birinchi harakat — bashorat; yo'rig'i `QBashorat` yorlig'ida.)
- Bashorat (ballsiz; S-015 — bitta o'lchov: varaq qanchalik o'tadi, kam → ko'p): **6 dan 3 yozma tasdiq — Mentor tekshiruvi nima deydi?** ·
  Tuzatish: oltidan uchtasi kam (29) · Bitta tuzatishdan keyin qabul (29) · Qabul (5) — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi.
- Qadam qatori (`QQadamlar`, bitta manba `TEKSHIRUV_SAVOLLAR` — 7-ekran ham shundan): 1 Kim tasdiqladi? · 2 Narx va nima uchun yozilganmi? · 3 So'zma-so'z va bosimsiz olinganmi?
- **Chapda — `TasdiqVaraq` to'liq** (2-ekrandan; tepada xabar qatori «Xabar: «…»» — `MENTOR_XABAR` to'liq) · **o'ngda — bitta savol kartasi** (navbat bilan): savol · «Nimaga qarang» bir qatori · ostida kulrang «Varaqdan bosib toping». Tugma yo'q — javob varaqdagi bosish.
  1. **Kim tasdiqladi?** — Nimaga qarang: har yozma tasdiqda rol bormi — u to'lovchimi? → dalil: «kim» ustunidagi uch katak (1, 3, 4-tashkilotchi) yoki `PRO_QATOR`; bosilgach ikkalasi yashil yonadi.
  2. **Narx va nima uchun yozilganmi?** — Nimaga qarang: har yozma tasdiqda narx va nima uchun to'lashi turibdimi? → dalil: «narx» (15 000 · 10 000 · 15 000) yoki «nima uchun» («Doimiy o'yin» ×3) ustuni; bosilgach ikkala ustun yashil.
  3. **So'zma-so'z va bosimsiz olinganmi?** — Nimaga qarang: gap odam yozganidek qo'shtirnoqda turibdimi; Mentor xabarida bosim yo'qmi? → dalil: «gap» ustuni yoki xabar qatoridagi «Yozmasangiz ham bo'ladi»; og'zaki bosim yo'qligi va bir marta yozilgani varaqdan ko'rinmaydi — buni o'quvchi o'zi aytadi (F-1007-467);
     bosilgach ikkalasi yashil, «hozir yo'q · 2» va «javob yo'q · 1» hisoblagichlari ham yonadi (rad etganlar ham yozilgan — Mentor qayta yozmagan).
- Karta ostida doimiy kulrang qator: Uchtaga yetmaslik — tuzatish sababi emas. (41)
- `QXato` (≤60; noto'g'ri joy bosilsa, joy bir lahza silkinadi):
  - 1-savol, boshqa ustun: Bu katak kim yozganini aytadimi? (32)
  - 2-savol, «kim» yoki «gap»: Narx va nima uchun qaysi ustunda? (33)
  - 3-savol, «narx» yoki «nima uchun»: Odamning o'z so'zi qayerda turibdi? (35)
  - (umumiy) «Nimaga qarang» qatorini qayta o'qing. (38)
- **Harakat → Vizual o'zgarish:** dalil bosiladi → u yashil yonadi, savol kartasiga ingichka chiziq tortiladi, karta ostida ✓ «Ha», qadam belgisi ✓, keyingi savol kartasi kiradi.
  3/3 dan so'ng varaq tepasiga yashil muhr **«Qabul»** bir lahza kattalashib tushadi, ostida kulrang qator: Qabul — bugungi yozuvlar uchun.
  Varaq ostida yorliq **Mentor tekshiruvi** paydo bo'ladi, `QIzoh`: 12-Modulda hisobotni shunday tekshirgansiz — bugun uch savol yozma tasdiqlar uchun. (83)
  Natija qatori (`QTaxmin`, xulosa qutisining birinchi qatori): «Taxminingiz: … · haqiqatda: qabul» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda 6 dan 3 yozma tasdiq — qabul: tekshiruv halollikni ko'radi, sonni emas. (82)
- Ipucha (40 s): O'ngdagi savolni o'qing va javobini chapdagi varaqdan bosing. (61)
- Natija (`tugadi`): savol kartasi va qadam qatori yo'qoladi; varaq butun enga, tepada «Qabul».
- Tugma (pastki): Savollarni bering (N/3) → Davom etish · vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat variantlari → varaqdagi dalil joylari (joriy savolga tegishlisi yengil accent chegarada, to'lqin 2 marta) → «Davom etish».
- Nishon: Fair Check! (uch dalilni birinchi urinishda).
- O'qituvchi eslatmasi: Tekshiruv yozuvning halolligini ko'radi: kim yozgan, narx va nima uchun bilan, o'z so'zi bilan, bosimsiz. 6 dan 3 — qabul; 6 dan 1 ham halol yozilgan bo'lsa — qabul: son tuzatish sababi emas, uchtaga yetmasa — keyingi qadam (7-ekran).
  Tuzatish — o'zi yozgan yoki to'lovchi bo'lmagan odamning «tasdig'i» (Mentor misolida — o'yinchi), narxsiz javob, bosim bilan olingan javob. 11-Modulda PRD ham, 12-Modulda hisobot ham uch savol bilan tekshirilgan — bugun savollar yangi.
✎ Shakl — 12-Modul 10-dars 4-ekran (dalilni varaqdan topish, muhr). Savollar — tayanch 1.9 so'zma-so'z. 3-savolning ikkinchi yarmi («bosimsiz») dalili — Mentor xabaridagi qator va yozib qo'yilgan «yo'q»lar.

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi misol — sherikning yozuvi, P-002)
- Eyebrow: Tekshiruv · Mentor tekshiruvi (savol ustida yorliq yo'q)
- Savol: **Sherigingiz «Ha, olaman» xabarini yozma tasdiq deb yozdi. Tekshiruv nima deydi?** (11 so'z)
  - A — Qabul: odam «olaman» deb o'zi yozgan (36)
  - B — Tuzatish: yozma tasdiq uchtaga yetmagan (39)
  - C — Qabul: narxni sherik o'zi qo'shib qo'ysa (40)
  - ✔ D — Tuzatish: narx ham, nima uchun ham yo'q (39)
- Kalit: **D** (index 3). «Qabul» ikki, «Tuzatish» ikki variantda (S-006); ikki nuqta to'rttalasida (belgi faqat to'g'rida emas); «narx» C va D da; to'g'ri javob eng uzun emas.
  Distraktorlar uch xil: A — yozilgani yetarli deb (2-savol unutilgan) · B — son bo'yicha tuzatish (uchtaga yetmaslik — tuzatish emas) · C — narxni o'quvchi to'ldiradi (soxta yozuv).
- To'g'ri izohi: Narxsiz «ha» hali yozma tasdiq emas. (36)
- Xato izohlari (≤60):
  - A: O'zi yozgani to'g'ri — lekin unda narx bormi? (45)
  - B: Uchtaga yetmaslik tuzatish sababimi? (36)
  - C: Narxni kim yozishi kerak edi — sherikmi? (40)
  - (umumiy) Ikkinchi savolni eslang: yozuvda nima bo'lishi kerak? (53)
- Javob topilgach (kichik): kichik varaq qatori «sherik yozuvi · «Ha, olaman» · narx — · nima uchun —», tepada accent muhr «Tuzatish: narx va nima uchun».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): Mentor misoli emas — sherikning yozuvi va boshqa holat (narxsiz javob). Bitta javob himoyalanadi: odam narx ham, nima uchun ham yozmagan; son ham, «o'zi yozgani» ham bu yerda hal qilmaydi.
  C — o'quvchi odam yozmagan narxni qo'shmaydi (6-ekran tekshiruvi «Bu narx uning xabarida yo'q» bilan bir). Dastur bunday yozuvni 6-ekranda narxsiz saqlamaydi — savol qog'ozdagi yozuv yoki tamoyil haqida.

## 6 · Yozma tasdiqlaringiz  ← QMustaqil (USTAXONA — ketma-ket karta, 3 qism; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · yozma tasdiq
- Sarlavha: **Tanishlaringizdan yozma tasdiq so'rang.** (39)
- Mentor (qismga qarab almashadi; har biri bitta gap):
  - 1-qism: Uyda gaplashgan bo'lsangiz — qog'ozdagi yozuvni shu yerga ko'chiring.
  - 2-qism: Mentor xabaridagi bo'sh joylarni o'z mahsulotingiz bilan to'ldiring.
  - 3-qism: Javob kelganlarini belgilang — yozma tasdiqni so'zma-so'z ko'chiring.
- Qism yorliqlari (ot-shakl, T-073): 1 Suhbatlar · 2 Xabar · 3 Javoblar
- Joylashuv (≤ 3 blok): **chapda** — 1-qismda «Yozuvlarim» ro'yxati, 2–3-qismda telefon (chat) · **o'ngda — bitta katta karta (joriy qism)** · ostida ixcham chiziq «Yozma tasdiqlarim · so'ralgan n · yozma tasdiq n».
- **1-qism · Suhbatlar** (tayanch 9.10 — uy suhbatlari shu darsda kiritiladi):
  - Chapda «Yozuvlarim» (`pm-m11d6-suhbat.suhbatlar`): har qator «{kim} · «{gap}» · {belgi} · {narx}», o'ngida yorliq «real» (yashil) yoki «mashq» (kulrang). Kalit yo'q bo'lsa — kulrang qator: 6-darsdan yozuv yo'q.
  - O'ngda karta **«Uydagi suhbat»** (real yozuvlar jami uchtagacha; maydonlarda yorliq input ichida — E 43):
    ① Kim edi? Rolini yozing (≤ 30) · ② U nima dedi? So'zma-so'z (≤ 160) · belgi tugmalari: ha · qimmat · yo'q · javob yo'q (ostida doimiy qator «Javob yo'q — odam javob bermasa.») ·
    ③ Narx, so'm — aytgan bo'lsa · ④ Hozir nima qiladi? Yozgan bo'lsangiz (ixtiyoriy, ≤ 80).
    Tugmalar bir qatorda: «Saqlash» · «+ Yana bitta» · o'ngda «Yordam»; karta ostida kichik tugma «Uyda suhbat bo'lmadi →». Real yozuvlar uchta bo'lsa karta yopiladi, kulrang qator: Real suhbatlar uchtagacha yoziladi. (35)
  - Tekshiruv (`QXato`, ≤60; maydon ostida; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
    - kim bo'sh (bloklaydi): Kim edi — rolini yozing. (24)
    - «@», «t.me/», «+998» yoki 7+ raqam ketma-ket (bloklaydi): Rol yozing — ism, telefon va akkaunt nomi emas. (47)
    - gap bo'sh, belgi «javob yo'q» emas (bloklaydi): U nima dedi — qog'ozdagidek yozing. (35)
    - belgi tanlanmagan (bloklaydi): Belgini tanlang: ha, qimmat, yo'q yoki javob yo'q. (50)
    - xulosa so'zlari — «qiziqdi», «qiziqmadi», «yoqdi», «yoqmadi», «rozi bo'ldi», «ko'ndi» (yumshoq): Bu xulosaga o'xshaydi — gapini so'zma-so'z yozing. (50)
    - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
  - Yordam: Rol — munosabati bilan: masalan, «tashkilotchi (mahalla guruhidagi tanish)». Gap — qog'ozda qanday yozgan bo'lsangiz, shunday; o'zgartirmang va qisqartirmang.
    6-darsdagi «to'laydigan odam» — bu darsda to'lovchi: mahsulotingizda pul to'laydigan foydalanuvchi.
  - Saqlash: `pm-m11d6-suhbat.suhbatlar` ga `{ id, tur: 'real', kim, hozir, gap, javob, narxi, qachon }` (A-11).
- **2-qism · Xabar:**
  - Karta — xabar qolipi (Mentor xabaridan, A-6; o'zgaradigan joylar uzuq ramkada — U-041):
    «"[ nima ]" [davr] kunga [narx] so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz.»
    ostida o'zgarmaydigan qator (kulrang yorliq «o'zgarmaydi»): «Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.»
    - nima (≤ 40; placeholder «Odam nima uchun to'laydi?»); kulrang qator (`ekran.sarlavha` bo'lsa): 4-darsdagi ekraningiz: «{ekran.sarlavha}»
    - narx (son, so'm) — `pm-m11d4-narx.narx` dan oldindan, tahrirlanadi; yorliq «4-darsdagi narxingiz»; kalit yo'q bo'lsa bo'sh (placeholder «Narx, so'm»); kulrang qator (`skript[2]` bo'lsa): 6-darsdagi savolingiz: «{skript[2]}»
    - davr (kun, ixtiyoriy) — `davrKun` dan; bo'sh bo'lsa «[davr] kunga» qismi tushib qoladi: «"[nima]" [narx] so'm bo'lsa, to'lashga tayyormisiz? …»
  - «Saqlash» → xabar to'liq gapga aylanib telefon chatiga pufak bo'lib uchadi. So'ng karta ichida: **Kimga yubordingiz?** — tugmalar qatori: real suhbatlardagi `kim` lar (takrorsiz; bir xil rol bo'lsa — «(1)», «(2)») + «+ Boshqa tanish» (rol, ≤ 30).
    Tugma bosilsa — «yuborildi ✓» holati, chat sarlavhasi «{kim}» bo'ladi, hisoblagich «so'ralgan · n» o'sadi; qayta bosilsa — bekor.
    Karta ostida doimiy kulrang qator: Darsda — faqat suhbatdoshingizga yoki to'lovchi sinfdoshingizga; boshqa tanishga — uyda, ota-onangizga aytib. (109)
    Rol tugmalari ustida belgi (bir marta; kalitga yozilmaydi, dars holatida): «Bu odamga yozishimdan ota-onam xabardor». Belgilanmasa rol tugmalari yopiq — xabar tayyor turadi, uyda yuboriladi; notanishga hech qachon yozilmaydi (F-1007-467).
    Kichik tugma «Hozir yubora olmayman →» — 3-qism o'tkazib yuboriladi (xabar saqlanadi).
  - Tekshiruv (`QXato`, ≤60):
    - nima bo'sh (bloklaydi): Odam nima uchun to'lashini yozing. (34)
    - narx bo'sh yoki 0 (bloklaydi): Narxni yozing — 4-darsdagi taxminingiz. (39)
    - nima'da «http», «t.me», «.uz», «mashq to'lov» (bloklaydi): Xabarga havola qo'yilmaydi — pul so'ralmaydi. (45)
    - nima'da sotish so'zlari — «arzon», «atigi», «chegirma», «tezroq», «oling», «olmasangiz», «hamma oldi», «o'ylab ko'ring» (yumshoq): Bu sotish gapiga o'xshaydi — nima uchun ekanini yozing. (55)
    - «Boshqa tanish» da «@», «t.me/», «+998» yoki 7+ raqam (bloklaydi): Rol yozing — ism, telefon va akkaunt nomi emas. (47)
    - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
  - Yordam: Mentor misolida xabar: «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz. Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.»
    Xabarni har odamga alohida, bir marta yuboring — guruhga tashlamang. Javob bermasa yoki «hozir yo'q» desa — qayta yozmang. Mahalla guruhi orqali yozsangiz — 12-Moduldagi olti bandli ro'yxat kuchda.
- **3-qism · Javoblar** (faqat «yuborildi» deb belgilanganlar; hech kim bo'lmasa qism o'tkazib yuboriladi):
  - Har odam — bitta karta (navbat bilan, «n / N»): sarlavha «{kim}» · to'rt tugma: «Yozma tasdiq» · «Aniqlashtirish kerak» · «Hozir yo'q» · «Javob yo'q» (boshida «Javob yo'q» tanlangan; «Aniqlashtirish kerak» — javob bor, lekin narx yoki nima uchun yo'q: maydon «U nima deb yozdi?» ochiladi, gap `oldingiGap` ga); ostida kulrang: Javob hali kelmagan bo'lsa — shunday qoldiring. (47)
  - «Yozma tasdiq» → maydonlar: ① U nima deb yozdi? So'zma-so'z (≤ 160) · ② Narx, so'm · ③ Nima uchun to'laydi? (≤ 40) · ④ Qayerda: «chat» · «qog'oz» · ⑤ Qachon yozdi? — sukut bugun, o'zgartirsa bo'ladi (kiritilgan kun emas — F-1007-467).
  - Tekshiruv (`QXato`, ≤60):
    - gap bo'sh (bloklaydi): U nima deb yozdi — so'zma-so'z ko'chiring. (42)
    - narx bo'sh (bloklaydi): Narx yozilmagan javob — hali yozma tasdiq emas. (47)
    - narx soni gapda yo'q (yumshoq; raqamlar bo'shliqsiz solishtiriladi): Bu narx uning xabarida yo'q — qayta qarang. (43)
    - nima bo'sh (bloklaydi): Nima uchun to'lashini uning xabaridan yozing. (45)
    - «@», «t.me/», «+998» yoki telefon shakli — 9 raqam («90 123 45 67» yoki bo'shliqsiz) (bloklaydi): Yozuvga telefon va akkaunt nomi yozilmaydi. (43)
    - boshqa 7+ raqam ketma-ket (yumshoq — narx bo'lishi mumkin; F-1007-464): Bu telefon raqamimi yoki narxmi? Telefon yozilmaydi. (52)
    - xulosa so'zlari — «rozi bo'ldi», «qiziqdi», «ko'ndi», «yoqdi» (yumshoq): Bu xulosaga o'xshaydi — xabarini so'zma-so'z ko'chiring. (56)
    - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
  - Yordam: Mentor misolida: «15 000 qimmat. 10 000 so'm bo'lsa, "Doimiy o'yin" uchun to'layman.» — narx 10 000, nima uchun «Doimiy o'yin». Sabab («charchadim» kabi) — gapda qoladi, «nima uchun» ga emas.
    Narx yoki nima uchun yozmagan bo'lsa — «Aniqlashtirish kerak»: faqat yetishmagan narsani bir marta so'rang; javobi kelsa — ✎ bilan «Yozma tasdiq» ga o'tkazing, birinchi gap ham saqlanadi. «Hozir yo'q» yoki javob bermagan odamga qayta yozmang.
    So'zma-so'z — odam yozganidek; faqat ism, telefon va akkaunt nomini [ism], [telefon] bilan almashtiring, qolganini o'zgartirmang. Skrinshot olsangiz — ism va telefon ko'rinmasin.
- **Harakat → Vizual o'zgarish:** 1-qism «Saqlash» → karta kichrayib «Yozuvlarim» ro'yxatiga uchadi (~1 s yashil), sanoq «real n / 3» o'sadi ·
  2-qism «Saqlash» → bo'sh joylar to'lib, xabar telefon chatiga pufak bo'lib uchadi; rol tugmasi bosilsa — chat sarlavhasi almashadi, pufak ostida «yuborildi ✓», «so'ralgan · n» o'sadi ·
  3-qism «Yozma tasdiq» → telefonda javob pufagi paydo bo'ladi (yozilgan gap), «Saqlash» → gapdagi narx va «nima uchun» varaq qatoriga uchadi (~1 s yashil), hisoblagichlar o'zgaradi; «Hozir yo'q» / «Javob yo'q» → karta kulrang qatorga yig'iladi.
  Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. Oxirida karta yopiladi, varaq «Yozma tasdiqlarim» butun enga — yozuvlar, har birida ✎ (bosilsa o'sha karta qayta ochiladi — SABOQ 29).
- Xulosa (holatdan, P-046):
  - yozma tasdiq ≥ 1: Yozma tasdiq yozildi: har birida narx va nima uchun bor. (56)
  - yozma tasdiq 0, so'ralgan ≥ 1: Xabar yuborildi — javob kelmasa ham, bu natija. (47)
  - so'ralgan 0, xabar saqlangan: Xabaringiz tayyor — uni uyda, ota-onangizga aytib yuborasiz. (60)
- Saqlash: `pm-m11d9-tasdiq` — `xabar`, `soralgan`, `tasdiqlar`, `hozirYoq`, `javobsiz`, `savedAt` (A-11 shartnomasi; `tekshiruv`, `tuzatishSabab`, `keyingiQadam` — `null`, 7-ekran yozadi).
- Tugma (pastki): Qismlarni bajaring (N/3) → Davom etish (`optionalLive`). Javob 7-ekrangacha kelsa — «Orqaga» bilan shu ekranga qaytib, ✎ bilan yoziladi.
- Keyingi bosiladigan joy: joriy maydon (accent chegara, to'lqin) → «Saqlash» → rol tugmalari → javob kartasidagi holat tugmalari → «Davom etish».
- Artefakt-strip (U-042): shu ekrandan — «Yozma tasdiqlarim» (ixcham); 7-ekranda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon yo'q (saqlash — Mentorga signal).
- Mentor rejimi: forma o'rniga Mentor misoli (A-6: xabar va olti javob). Mentor statistikasi: «Xabar yozdi» · «Yozuv saqladi» — son, holat va matn yo'q (TAQIQLAR 3).
- O'qituvchi eslatmasi: ≈ 25 daqiqa. Darsda xabar — faqat 6-darsdagi suhbatdoshga (real suhbat; ota-onasi u haqida biladi) yoki to'lovchi bo'ladigan sinfdoshga; oldin yozmagan tanish to'lovchiga — uyda; yuborishdan oldin «ota-onam xabardor» belgisi (F-1007-467). Javob kutib turmang: dars davom etadi, kelgani «Orqaga» bilan qo'shiladi.
  Kim nechta yozma tasdiq olganini so'ramang va sanamang. Narxni siz qo'ymaysiz (TAQIQLAR 1). Sinfdoshi to'lovchi bo'lmagan o'quvchi darsda yubormasligi mumkin — bu ham to'g'ri yo'l.
✎ Uy suhbatlari kiritilishi — tayanch 9.10; 6-darsdagi qog'oz yozuvi shakli (rol, gap, belgi, narx) bilan bir. Xabar qolipi — Mentor xabaridan; oxirgi qator o'zgarmaydi (bosimsizlik dalili — 7-ekran 3-savoli).

## 7 · Tekshiruv va keyingi qadam  ← QMustaqil (juftlik + yakka rejim; 3 savol, so'ng shartli keyingi qadam — P-008: ikkinchi topshiriq shartli ochiladi)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Yozuvlaringiz tekshiruvdan o'tadimi?** (36)
- Mentor (juftlikda): Sherigingiz yozuvlaringizni o'qib, savollarni birma-bir beradi — javobni birga belgilang.
  Yakka rejimda: Savollarni o'zingizga bering va javobini yozuvlaringizdan toping.
  Keyingi qadam qismida (Mentor gapi almashadi): Yozma tasdiq uchtaga yetmagan bo'lsa — bitta keyingi qadamni yozing.
- Qadam qatori (`QQadamlar`, `TEKSHIRUV_SAVOLLAR`): 1 Kim tasdiqladi? · 2 Narx va nima uchun yozilganmi? · 3 So'zma-so'z va bosimsiz olinganmi? · 4 Keyingi qadam (faqat yozma tasdiq uchtadan kam bo'lsa)
- **Chapda — o'quvchining varag'i «Yozma tasdiqlarim»** (6-ekrandan): xabar qatori · «To'lovchi: {kim}» (`pm-m11d2-model.kim` bo'lsa) · jadval «kim · narx · nima uchun · gap · qayerda» · hisoblagichlar. Joriy savolga tegishli joy yengil accent chegarada (1 → «kim» ustuni · 2 → «narx» va «nima uchun» · 3 → «gap» va xabar qatori).
- **O'ngda — savol kartasi:** savol · «Nimaga qarang» bir qatori · ikki tugma «Ha» · «Yo'q — tuzataman»:
  1. Kim tasdiqladi? — Nimaga qarang: har yozuvdagi rol mahsulotingizda to'lovchimi — o'zingiz yoki to'lamaydigan odam emasmi?
  2. Narx va nima uchun yozilganmi? — Nimaga qarang: har yozuvda narx va nima uchun to'lashi uning xabaridan yozilganmi?
  3. So'zma-so'z va bosimsiz olinganmi? — Nimaga qarang: gap — uning o'z so'zimi; xabaringizda bosim yo'qmi, bir marta yozdingizmi?
  Karta ostida doimiy kulrang qator: Uchtaga yetmaslik — tuzatish sababi emas. (41)
  Juftlikda karta ostida kulrang: Xabarning o'zini ko'rsatish shart emas; ko'rsatsangiz — ism va telefonni yoping. (80)
- **Yozma tasdiq yo'q bo'lsa:** savol kartasi o'rnida: Tekshiradigan yozma tasdiq hali yo'q. (37) + kulrang: Javob kelsa, shu uch savolni o'zingizga berasiz. (48) → to'g'ri 4-qism.
- «Yo'q — tuzataman» → o'sha yozuv katta karta bo'lib ochiladi (6-ekran 3-qism maydonlari va tekshiruvlari bilan) + «Saqlash»; 1 va 3-savolda qo'shimcha tugma «Yozma tasdiq sifatida hisobga olmang» (`hisobga: false`; yozuv tarixda qoladi, «so'ralgan» o'zgarmaydi — F-1007-467); kichik tugma «Uyda tuzataman»:
  - 1-savol: yozuv to'lovchi bo'lmagan odamniki → «Yozma tasdiq sifatida hisobga olmang»; real odamdan olinmagan, o'zingiz yozgan yozuv bo'lsa — faqat shunda «Yozuvni olib tashlash» (yozuv `tasdiqlar` dan va «so'ralgan» dan chiqadi).
  - 2-savol: narx yoki «nima uchun» noto'g'ri ko'chirilgan → xabardagidek tuzatiladi; xabarda narx yoki nima uchun umuman yo'q → holat «Aniqlashtirish kerak» ga o'tadi (gap `oldingiGap` ga), «Uyda tuzataman» (bir marta faqat yetishmagan narsani so'rash).
  - 3-savol: gap qisqartirilgan yoki xulosa yozilgan → xabardan aynan ko'chiriladi; bosim bilan olingan → «Yozma tasdiq sifatida hisobga olmang» (odamga qayta yozilmaydi).
  Saqlangach savol qaytadi va «Ha» faol.
- Muhr (3/3 dan so'ng, varaq tepasiga tushadi): yashil **«Qabul»** (juftlikda yoki jonli darsda Mentor ko'rganda) · yakka rejimda — yashil **«Tuzatish topilmadi»** · accent **«Tuzatish: {savol}»** («Uyda tuzataman» bosilgan bo'lsa; `{savol}` — «kim tasdiqladi», «narx va nima uchun» yoki «so'zma-so'z va bosimsiz»).
  Ostida kulrang: Qabul — bugungi yozuvlar uchun.
- **4 · Keyingi qadam** (yozma tasdiq uchtadan kam — shu jumladan 0) — bitta karta: maydon «Keyingi qadamingiz? Bitta ish yozing» (≤ 80). Ostida kulrang: Bosim, o'zingiz yozgan «tasdiq» va pul — yo'q. (46)
  Yordam: Masalan: «Uyda yana ikki tanishdan bir marta so'rayman» · «"Qimmat" deganlar bor — 4-darsdagi narx hisobimni qayta ko'raman». Qaysi ish — o'zingiz tanlaysiz.
  - Tekshiruv: bo'sh (bloklaydi): Bitta ish yozing — nima qilasiz? (32) · «har kuni», «qayta-qayta», «majbur», «yozdiraman» (yumshoq): Bosim va o'zingiz yozgan «tasdiq» — yo'q. (41)
  - Yozma tasdiq uchta va undan ko'p bo'lsa — 4-qism yo'q (`keyingiQadam: null`).
- **Harakat → Vizual o'zgarish:** «Ha» → varaqdagi tegishli joy yashil ✓, qadam ✓, keyingi savol kartasi kiradi · «Yo'q — tuzataman» → yozuv kartasi chiqadi, saqlangach varaqqa uchib qaytadi (~1 s yashil); «Yozuvni olib tashlash» → qator kulrang bo'lib yo'qoladi, hisoblagichlar kamayadi ·
  3/3 → muhr tushadi · 4-qism «Saqlash» → matn varaq ostidagi «Keyingi qadam» qatoriga uchadi · hammasi tugagach savol kartasi yopiladi, varaq butun enga.
- Xulosa (holatdan, P-046):
  - muhr «Qabul» yoki «Tuzatish topilmadi», yozma tasdiq uchta va undan ko'p: Yozuvlaringiz tekshirildi — yozma tasdiqlar uchtaga yetdi. (58)
  - muhr «Qabul» yoki «Tuzatish topilmadi», yozma tasdiq 1–2: Yozuvlaringiz tekshirildi, keyingi qadam yozildi. (49)
  - «Tuzatish: {savol}»: Bitta tuzatish qoldi — uni uyda tuzatasiz. (42) — qaysi savol ekani muhrda
  - yozma tasdiq 0: Yozma tasdiq hali yo'q — keyingi qadamingiz yozildi. (52)
- Saqlash: `pm-m11d9-tasdiq.tekshiruv` = `'qabul'` | `'topilmadi'` | `'tuzatish'` | `null` · `tuzatishSabab` = `'kim'` | `'narx'` | `'gap'` | `null` · `keyingiQadam` (A-11); hisobga olinmagan yozuv — `hisobga: false` (tarixda qoladi); faqat o'quvchi o'zi yozgan yozuv `tasdiqlar` dan va `soralgan` dan chiqadi (o'zgarmas shart saqlanadi; F-1007-467).
- Tugma (pastki): Savollarni bering (N/3) → Davom etish (`optionalLive`; keyingi qadam ham ixtiyoriy o'tkaziladi — yakun holati «tekshiruv qoldi»).
- Keyingi bosiladigan joy: joriy savol kartasidagi «Ha» / «Yo'q — tuzataman» → (tuzatishda) maydon → «Saqlash» → (4-qismda) maydon → «Saqlash» → «Davom etish».
- Nishon: **Checked!** (yozma tasdiq bor va uch savol javoblanganda — juftlikda ham, yakka rejimda ham rost; bonus — P-048).
- Jonli darsda: o'qituvchi — Mentor. Mentor ekranida — har o'quvchida «Tekshirildi» yoki «Tuzatish bor» signali (son, rol va gap yo'q); proyektorga hech narsa chiqmaydi (TAQIQLAR 3). Sinf bilan Mentor misoli ko'riladi, o'quvchilar yozuvi emas.
- O'qituvchi eslatmasi: ≈ 13 daqiqa: 4 daqiqadan so'ng «O'rin almashing» deng, keyin keyingi qadam. Sherik savolni o'quvchining ekranida beradi; sonni sinfga aytmaydi. «Tuzatish» — yaxshi natija: yozuv halol bo'ladi.
  O'zi yozgan yoki sinfdoshi to'lovchi bo'lmagan holda yozdirgan «tasdiq», bosim bilan olingani — tuzatish (TAQIQLAR 1). Yozma tasdiqni uchtaga yetkazganlarni alohida maqtamang, boshqalarni solishtirmang.
✎ Juftlik naqshi — 12-Modul 10-dars 11-ekran (uch savol, muhr, shartli ikkinchi qism) va 6-dars 7-ekran (yakka rejim). Muhr so'zlari — 11-Modul 9.66.

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Ikki tanishingiz yozma tasdiq berdi, biri «hozir yo'q» dedi. Endi nima qilasiz?** (12 so'z)
  - ✔ A — Uchalasini yozib, keyingi qadamni yozaman (41)
  - B — «Hozir yo'q» deganga har kuni qayta yozaman (43)
  - C — Uchinchisini ham yozma tasdiq deb yozaman (41)
  - D — Ikkalasiga «mashq to'lov» havolasini beraman (44)
- Kalit: **A** (index 0). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); tire va qavs hech birida yo'q; to'g'ri javob eng uzun emas; «yozaman» A, B, C da.
  Distraktorlar uch xil: B — bosim (qayta-qayta yozish) · C — soxta yozuv · D — to'lov havolasi (TAQIQLAR 1).
- To'g'ri izohi: Yozuv halol qoladi; uchtaga yetmasa — keyingi qadam. (52)
- Xato izohlari (≤60):
  - B: Bu bosim emasmi? «Hozir yo'q» ham natija. (41)
  - C: U narx yozdimi? Uning xabari nima edi? (38)
  - D: Yozma tasdiq — to'lov emas: havola berilmaydi. (46)
  - (umumiy) Uchtaga yetmasa nima yoziladi — eslang. (39)
- Javob topilgach (kichik): varaq — «yozma tasdiq · 2 · hozir yo'q · 1», ostida «Keyingi qadam» qatori accent bilan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol sonni o'qishni so'raydi (ikki va bitta), umumiy xulosa qildirmaydi (T-043). 5-ekran (narxsiz «ha» — tekshiruv) va arena 8 (bosim bilan olingan yozma tasdiq — tekshiruv) bilan kalit ibora takrorlanmaydi (S-008): bu yerda — o'quvchining harakati.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 6, 7-ekranlar «Saqlash» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Qaysi biri yozma tasdiq» · 5 — «2 — Narxsiz "ha"» · 8 — «Yakuniy — Uchtaga yetmasa»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi, sonni baholamaydi):
  - yozma tasdiq bor, muhr «Qabul» yoki «Tuzatish topilmadi»: **{n} ta yozma tasdiq yozildi va tekshirildi.** (42 — n bir xonali)
  - muhr «Tuzatish: …»: **Yozuvlar tekshirildi — bitta tuzatish qoldi.** (44)
  - yozma tasdiq bor, tekshiruv o'tkazilmagan: **Yozma tasdiqlar yozildi — tekshiruv qoldi.** (42)
  - xabar yuborilgan, yozma tasdiq yo'q: **Xabar yuborildi — yozma tasdiq hali yo'q.** (41)
  - xabar saqlangan, yuborilmagan: **Xabaringiz tayyor — uni uyda yuborasiz.** (39)
  - xabar saqlanmagan: **Xabar hali yozilmagan — uyda yozing.** (36)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi):
  - Bu darsda yozma tasdiq — odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan.
  - Yozma tasdiq — to'lov emas: pul olinmaydi, to'lov havolasi berilmaydi.
  - Mentor tekshiruvi uch savol beradi: kim tasdiqladi, narx va nima uchun yozilganmi, so'zma-so'z va bosimsiz olinganmi.
  - Uchta yozma tasdiq — narx haqida dalil, lekin narx to'g'ri ekanining isboti emas.
  - Uchtaga yetmaslik — baho emas: halol natija va bitta keyingi qadam.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: tanish to'lovchilar · Nechta: uchtagacha yozma tasdiq — kam bo'lsa ham, halol natija · Muddat: keyingi darsgacha
  - ① Darsda yubormagan bo'lsangiz — xabaringizni tanish to'lovchilarga bir marta yuboring. Ota-onangizga ayting.
  - ② Javobni so'zma-so'z qog'ozga yozing: rol, narx, nima uchun, qachon — ismsiz. Skrinshot olsangiz — ism va telefon ko'rinmasin.
  - ③ «Hozir yo'q» degan yoki javob bermagan odamga qayta yozmang — bu ham natija.
  - ④ {holatga qarab — Tuzatish qoldi: kim — boshqa haqiqiy to'lovchini tanlang · narx — aniqlashtirish kerak bo'lsa, faqat yetishmagan narsani bir marta so'rang · gap — xabardan aynan ko'chiring, bosim bilan olingan bo'lsa hisobga olmang va qayta yozmang · Tekshiruv qoldi: uch savolni o'zingizga bering · Keyingi qadam qoldi: bitta ishni qog'ozga yozing}. Hammasi tugagan bo'lsa ④ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Pul olmang va to'lov havolasini bermang — yozma tasdiq to'lov emas. Notanishga yozmang.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: taklif havolasi va mukofot»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada kech kelgan javoblar qayerga kiritilishi aytilmaydi (T-038; TAYANCHGA SAVOL 9) — qog'ozga, 6-darsdagi uy suhbatlari kabi. «Uchtagacha» — dastur maqsadi, kam bo'lsa ham halol natija (sinf 14 — uyga vazifa yengil va aniq).
  «Kim bilan» — HwCard yorlig'i (6-dars bilan bir). Birinchi sarlavhadagi `{n}` — `tasdiqlar.length` (bir xonali); n = 1 da ham shu shakl («1 ta yozma tasdiq …»).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **In Writing!** (2-ekran, olti javob birinchi urinishda) — Olti javobni birinchi urinishda ajratdingiz (43)
- **Own Words!** (3-ekran, 1-savol birinchi urinishda) — Yozma tasdiqni boshqa javoblardan ajratdingiz (45)
- **Fair Check!** (4-ekran, uch dalil birinchi urinishda) — Uch savolning dalilini varaqdan topdingiz (41)
- **Checked!** (7-ekran, bonus — yozma tasdiq bor va uch savol javoblanganda) — Yozuvlaringizni uch savol bilan tekshirdingiz (45)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Checked!, ish qilingan ekranda — P-048); yozma tasdiq yo'q bo'lsa berilmaydi (tekshiradigan narsa yo'q). Yakuniy savol va 5-ekran nishonsiz. 6-ekran nishonsiz (saqlash — Mentorga signal).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Yozma tasdiq nima** — 1 Odamning o'zi yozgan javobi — chat xabari yoki qog'oz. · 2 Unda narx va nima uchun to'lashi bor. · 3 U to'lov emas: pul olinmaydi.
  — Sinfga savol: Suhbat yozuvini kim yozadi, yozma tasdiqni-chi?
- **5 · Tekshiruv nimani ko'radi** — 1 Kim tasdiqladi — u to'lovchimi. · 2 Narx va nima uchun yozilganmi. · 3 So'zma-so'z va bosimsiz olinganmi; uchtaga yetmaslik — tuzatish emas.
  — Sinfga savol: Narxsiz «ha» nega hali yozma tasdiq emas?
- **8 · Uchtaga yetmasa** — 1 Yozma tasdiqlar soni — baho emas. · 2 «Hozir yo'q» ham natija — qayta yozilmaydi. · 3 Halol yozuv va bitta keyingi qadam qoladi.
  — Sinfga savol: «Hozir yo'q» degan odamga nega qayta yozmaysiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bu darsda yozma tasdiq nima? | Odamning o'zi yozgan javobi: narx va nima uchun to'lashi bilan | Chat xabari yoki qog'oz |
| Suhbat yozuvi bilan yozma tasdiqning farqi nima? | Suhbat yozuvini siz yozasiz, yozma tasdiqni — odamning o'zi | Mentor misolida: 6-darsdagi gapni Mentor yozgan edi |
| Yozma tasdiq bergan odamdan pul olinadimi? | Yo'q — yozma tasdiq to'lov emas | «Mashq to'lov» va to'lov sahifasi havolasi ham berilmaydi |
| Yozma tasdiqdagi «nima uchun» nimani bildiradi? | Odam nimaga pul to'lashini — Mentor misolida «Doimiy o'yin» | Sabab («charchadim» kabi) gapda qoladi |
| Mentor nechta tashkilotchidan so'radi va nechta yozma tasdiq oldi? | 6 dan 3: ikkitasi 15 000 da, bittasi 10 000 da | 2 — «hozir yo'q», 1 — javob bermadi |
| Mentor tekshiruvi qaysi uch savolni beradi? | Kim tasdiqladi? Narx va nima uchun yozilganmi? So'zma-so'z va bosimsiz olinganmi? | Javob — qabul yoki tuzatish |
| Uchtaga yetmagan yozma tasdiqlar tuzatishga qaytadimi? | Yo'q — halol natija va bitta keyingi qadam | Tekshiruv halollikni ko'radi, sonni emas |
| Qaysi «tasdiq» tuzatishga qaytadi? | O'zingiz yozgani, to'lovchi bo'lmagan odamniki yoki bosim bilan olingani | Narxsiz javob ham — hali yozma tasdiq emas |
| «Hozir yo'q» degan odamga qayta yozasizmi? | Yo'q — «hozir yo'q» ham natija | Xabar bir marta yuboriladi |
| Uchta yozma tasdiq nimani ko'rsatadi? | Narx haqida dalil — lekin narx to'g'ri ekanining isboti emas | Uch — kichik son |
| Yozma tasdiqni kimdan so'raysiz? | Tanish to'lovchidan — ota-onangizga aytib | Notanishga yozilmaydi; yozuvda ism yo'q |
| Skrinshot ko'rsatsangiz, nimani yopasiz? | Ism va telefon raqamini | Yozuvda ham — faqat rol |
- §145: har javobdagi so'z darsda bor (yozma tasdiq, narx, nima uchun, to'lov emas — 2 · suhbat yozuvi — 0, 2 · 10 000 — 2 · 6 dan 3 — 2, 4 · uch savol, qabul, tuzatish — 4, 7 · keyingi qadam — 7 · bosim, o'zi yozgan — 4, 5, 7 · «hozir yo'q» — 2, 6 · tanish, ota-ona, ism va telefon — A-9, 6-ekran Yordami, yakun).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 5·9·12 · B 1·7·11 · C 3·6·10 · D 2·4·8 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md09/olchov.py` (pastda «O'lchov»).
1. Bu darsda yozma tasdiq nima? (2)
   - A — Siz yozib olgan suhbatdagi gapi (31)
   - ✔ B — Odamning o'zi yozgan narxli javobi (34)
   - C — Oldindan berib qo'yilgan kichik pul (35)
   - D — «Mashq to'lov»da bosilgan tugmasi (33)
2. Mentor misolida nechta tashkilotchidan so'raldi? (2)
   - A — Uchtadan — faqat 6-darsdagilardan (33)
   - B — Bittadan — faqat 1-tashkilotchidan (34)
   - C — 44 tadan — hamma foydalanuvchidan (33)
   - ✔ D — Oltitadan — 6-darsdagilar ham bor (33)
3. Mentor misolida nechta yozma tasdiq bor? (2)
   - A — Bitta — faqat 1-tashkilotchidan olindi (38)
   - B — Oltita — hamma tashkilotchi yozib berdi (39)
   - ✔ C — Uchta — ikkitasi 15 000, biri 10 000 (36)
   - D — Ikkita — faqat 15 000 so'm yozganlari (37)
4. 3-tashkilotchi «15 000 qimmat» deb, 10 000 so'mda to'lashini yozdi. Bu nima? (2)
   - A — Hozir yo'q — «qimmat» degani uchun (34)
   - B — Javob yo'q — narxi boshqacha chiqdi (35)
   - C — Sotish gapi — narxni o'zi tushirdi (34)
   - ✔ D — Yozma tasdiq — 10 000 so'm narxda (33)
5. «Kim tasdiqladi?» savoli bilan Mentor nimani ko'radi? (4)
   - ✔ A — Yozgan odam to'lovchi bo'lishini (32)
   - B — Yozgan odamning ism-familiyasini (32)
   - C — Yozgan odam necha yoshda ekanini (32)
   - D — Yozgan odam pulni qachon berishini (34)
6. Mentor misolida tekshiruv javobi qanday? (4)
   - A — Tuzatish: oltidan faqat uchtasi bor (35)
   - B — Tuzatish: bittasi 10 000 so'mda (31)
   - ✔ C — Qabul: uch savolga ham «ha» bo'ldi (34)
   - D — Tekshirilmadi: sherik topilmadi (31)
7. O'zingiz yozib qo'ygan «tasdiq» tekshiruvda nima bo'ladi? (4, 7)
   - A — Qabul: unda narx yozilgan bo'lsa (32)
   - ✔ B — Tuzatish: uni odam o'zi yozmagan (32)
   - C — Tuzatish: uchtaga yetmagani uchun (33)
   - D — Qabul: so'zma-so'z yozilgan bo'lsa (34)
8. Yozma tasdiq «hozir olmasangiz, qimmatlashadi» deb olindi. Nima bo'ladi? (2, 4)
   - A — Qabul: uni odamning o'zi yozgan (31)
   - B — Qabul: narx va nima uchun bor (29)
   - C — Tuzatish: narx juda qimmat chiqdi (33)
   - ✔ D — Tuzatish: bosim bilan olingan (29)
9. Mentor misolida yozma tasdiq kimlardan so'raldi? (2)
   - ✔ A — Tashkilotchilardan — Pro ular uchun (35)
   - B — O'yinchilardan — ular ko'pchilik (32)
   - C — Sinfdoshlardan — ular hammasi tanish (36)
   - D — Maydon egasidan — maydon o'ziniki (33)
10. Yozma tasdiq bergan odamga nima yuboriladi? (2, 6)
   - A — Havola — «mashq to'lov» sahifasiga (34)
   - B — Iltimos — oldindan pulni o'tkazish (34)
   - ✔ C — Hech narsa — pul ham, havola ham yo'q (37)
   - D — Iltimos — do'stlarini ham chaqirishni (37)
11. Skrinshotni ko'rsatishdan oldin nimani yopasiz? (6)
   - A — Odam yozib bergan narxni (24)
   - ✔ B — Ism va telefon raqamini (23)
   - C — Nima uchun to'layotganini (25)
   - D — Xabar kelgan kun va vaqtni (26)
12. Mentor xabarida qaysi gap bor? (2, 4)
   - ✔ A — «Bu to'lov emas — pul so'ramayman» (34)
   - B — «Hozir olmasangiz, qimmatlashadi» (33)
   - C — «Boshqa tashkilotchilar ham oldi» (33)
   - D — «Do'stlaringizga ham yuborib qo'ying» (37)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006; «O'lchov»); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (qaysi biri — kitob ilovasi) ↔ arena 1 (ta'rif), arena 4 (Mentor misolidagi 10 000) ·
  5-ekran (narxsiz «ha») ↔ arena 7 (o'zi yozgan), arena 8 (bosim) · 8-ekran (o'quvchining harakati) ↔ arena 10 (odamga nima yuboriladi).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas: 1 — suhbat yozuvi, pul, «mashq to'lov» (uch xil) · 2, 3 — Mentor misoli sonlari (1.9, 1.13; 44 — boshqa o'lchov, ro'yxatdan o'tganlar) · 4 — holat, sotish gapi ·
  5 — shaxsiy ma'lumot, yosh, pul (uch xil) · 7, 8 — yarim savolga qarab hukm, son, narx (uch xil) · 9 — bepul rol, to'lovchi bo'lmagan tanish, rad etilgan model (tayanch 1.2: B2B — maydon egasi) · 10 — test havolasi, oldindan pul, bosim · 12 — 6-darsdagi sotish gaplari (tayanch 1.6).
  Hukm-variantlarida «Qabul» va «Tuzatish» soni teng (7, 8 — 2/2); arena 6 da uchinchi hukm («Tekshirilmadi») — jarayon xatosi.
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — yozma tasdiq · narx · nima uchun · xabar · qabul · tuzatish · hozir yo'q · javob yo'q · tanish · to'lovchi · Maydon Jamoa · uyga vazifa banneri — xabar · yozma tasdiq · halol natija. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmPayCheckLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d9-v1` (PM darslar naqshi `pm-m11dN-v1`), `lessonTitle` — «Kim haqiqatan to'lashga tayyor?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · test · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 5: 3, 8: 0 }; `javoblar: -1`, `tekshiruvMentor: -1` (2, 4-ekran — ballsiz, nishon bilan);
   6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 3, 5, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s3/s5/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`TasdiqVaraq`** — bitta vizual (180; qolipda yo'q, yangi): rejimlar `sahna` (odam real ko'rinishda — SABOQ 36; qo'lida «Maydon Jamoa» o'yin kartasi, tanlovdan keyin chat; varaq bo'lagi) · `telefon` (chat: rol sarlavhasi, xabar pufagi, javob pufagi, «yuborildi ✓») ·
   `varaq` (sarlavha «Mentor misoli · Maydon Jamoa» / «Yozma tasdiqlarim»; `PRO_QATOR` yoki «To'lovchi: {kim}»; xabar qatori; jadval kim · holat · narx · nima uchun · gap [· qayerda]; hisoblagichlar; muhr joyi) · `ixcham` (artefakt-strip va test ostidagi kichik bo'lak).
   Holat ranglari: `ok` (yozma tasdiq) · `ink2` (hozir yo'q, javob yo'q) — qizil yo'q. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: tv-katak tv-ustun tv-xabar tv-tugma`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz.
   393 da telefon varaq ustida, o'lchami barqaror (≈170×272), kesilmaydi (E 41; DOM detektori bilan). Telefonda ism, raqam, rasm chizilmaydi.
4. **Bitta manbalar (A-6 aynan):** `MENTOR_SUHBAT1` (1.6) · `MENTOR_XABAR` · `MENTOR_JAVOBLAR` (6 × `{ kim, gap | null, holat: 'tasdiq' | 'hozir' | 'javobsiz', narx | null, nima | null }`) · `MENTOR_HALOL` (1.9) · `PRO_QATOR` · `TEKSHIRUV_SAVOLLAR` (3 × `{ savol, qarang, qisqa }`).
   Mentor rejimi, s0, s2, s4, s6 (Yordam) shulardan o'qiydi; 4 va 7-ekran savollari — bitta `TEKSHIRUV_SAVOLLAR` dan.
5. **s2** — `QBashorat` (1 · 3 · 5) → 6 javob, uch tugma («Narx va nima uchun yozdi» · «Hozir yo'q» · «Javob yo'q»), kalit `[tasdiq, hozir, tasdiq, tasdiq, hozir, javobsiz]`; 1-javobda telefon ustidagi kulrang 6-dars qatori va `QIzoh`, 3-javobda `QIzoh`; `QXato` jadvali (2-ekran);
   natijada ustun yozuvi «narx va nima uchun yozdi» → «yozma tasdiq», `MENTOR_HALOL` varaq ostida, xulosa + `QIzoh`; 40 s ipucha; nishon `inWriting`.
6. **s4** — `QBashorat` (uch variant) → 3 savol kartasi, dalil joylari (1 — «kim» ustuni yoki `PRO_QATOR`; 2 — «narx» yoki «nima uchun»; 3 — «gap» yoki xabar qatori), har dalilning ikki bo'lagi birga yonadi; `QXato` (4 ta); 3/3 → muhr «Qabul», `QIzoh`; nishon `fairCheck`.
7. **s6** — o'qiydi `pm-m11d6-suhbat` (`suhbatlar[]`, `skript[2]`) va `pm-m11d4-narx` (`narx`, `davrKun`, `ekran.sarlavha`); 1-qism uy suhbatlarini `pm-m11d6-suhbat.suhbatlar` ga qo'shadi (`id` davomi, `tur: 'real'`, real jami ≤ 3; 6-dars yozuvlari, `skript`, `xulosa` tegilmaydi);
   2-qism — xabar qolipi (`davrKun` bo'sh — qisqa shakl), o'zgarmaydigan qator, rol tugmalari («yuborildi» toggle; takror rol — «(1)», «(2)»), «Hozir yubora olmayman»; 3-qism — har «yuborildi» odamga karta, uch holat, «Yozma tasdiq» maydonlari.
   Tekshiruvlar (bo'sh · telefon/akkaunt/havola — bloklaydi; xulosa so'zlari · sotish so'zlari · narx gapda yo'q — yumshoq) — **PM-108 tartibida kamida 12 namuna bilan `node` da sinaladi** (masalan: «15 000 so'm bo'lsa, … to'layman» + narx 15000 o'tadi · «o'n besh ming bo'lsa» + narx 15000 — yumshoq ogohlantirish ·
   «+998 90 …» bloklanadi · «@ali» bloklanadi · nima «t.me/…» bloklanadi · nima «arzon narxda» yumshoq · gap «rozi bo'ldi» yumshoq · narx bo'sh bloklanadi · «tashkilotchi (mahalla guruhidagi tanish)» o'tadi).
   Saqlash → `pm-m11d9-tasdiq` (`xabar`, `soralgan`, `tasdiqlar`, `hozirYoq`, `javobsiz`; o'zgarmas shart saqlashdan oldin tekshiriladi), `savedAt`. Ichki holat dars progressida (yarim yozilgan karta qayta ochilganda o'z joyida — E 51).
8. **s7** — `pm-m11d9-tasdiq` dan o'qiydi (6-ekran saqlanmagan bo'lsa — kulrang qator «Avval 6-ekranda xabaringizni yozing» va 6-ekranga qaytish tugmasi; Mentor rejimida — Mentor varag'i); yozma tasdiq 0 → savollar o'rnida qator va to'g'ri 4-qism;
   3 savol («Ha» / «Yo'q — tuzataman»; tuzatish kartasi s6 tekshiruvlari bilan; «Yozma tasdiq sifatida hisobga olmang» — 1, 3-savolda (`hisobga: false`); «Yozuvni olib tashlash» — faqat o'quvchi o'zi yozgan yozuvda, yozuv va `soralgan` birga kamayadi; «Uyda tuzataman»); muhr uch xil; 4-qism (yozma tasdiq < 3); yozadi `tekshiruv`, `tuzatishSabab`, `keyingiQadam`;
   juftlik/yakka — jonli darsda Mentor ko'rganda yoki juftlikda «Qabul», yakka rejimda «Tuzatish topilmadi»; nishon `checked` (yozma tasdiq ≥ 1 va uch savol). Ichki holat dars progressida.
9. **Mentor rejimi va statistikasi:** o'quvchilar ro'yxatida faqat signallar («Xabar yozdi» · «Yozuv saqladi» · «Tekshirildi» · «Tuzatish bor»; `PRACTICE_BASE`); son, rol, gap, narx, holat Mentorga ham uzatilmaydi va proyektorga chiqmaydi (TAQIQLAR 3). 0-ekrandagi sinf ovozlari — faqat variantlar soni.
10. Testlar s3/s5/s8 — `correctIdx` 1/3/0 = `INLINE_KEYS`; `RECAPS` {3, 5, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 5, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
11. `ACHIEVEMENTS` 4 (`inWriting`, `ownWords`, `fairCheck`, `checked`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
12. s11 `QYakun`: sarlavha **olti holat** — `pm-m11d9-tasdiq` dan (`xabar` bor / yo'q · `soralgan` · `tasdiqlar.length` · `tekshiruv`) (P-046, E 54); `{n}` = `tasdiqlar.length`; `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50);
    `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③④; ④ holatdan: `tekshiruv === 'tuzatish'` — `tuzatishSabab` bo'yicha uch xil gap (F-1007-467) · `tekshiruv === null` va yozma tasdiq bor — «Tekshiruv qoldi» · yozma tasdiq < 3 va `keyingiQadam === null` — «Keyingi qadam qoldi»); `keyingi` — «Loyiha kuni: taklif havolasi va mukofot». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
13. App.jsx `m11-09` qatoriga `comp: PmPayCheckLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 453-qator). Bu agent App.jsx ga tegmaydi.
14. **REPO — yo'q** (PM darsi; tayanch 3: `m13-dars-09-done` = `08-done`).
- Darvozalar: `npm run gates -- src/11-Modull/PmPayCheckLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

## Manbalar (07.10.2026)
- Bu darsda tashqi xizmat qadami yo'q — rasmiy tashqi sahifa **ochilmadi** (tugma, menyu, narx, limit yo'q). «Telegram» faqat 2-tashkilotchining javobida (tayanch 1.9: «Telegram tekin») va chat so'zi umumiy ma'noda; keys emas (K2 — faqat 2-darsda, TAQIQLAR 8).
- Yozma tasdiq ta'rifi, Mentor misoli sonlari, Mentor tekshiruvining uch savoli, «qabul», «3 ga yetmaslik — tuzatish sababi emas», skrinshot qoidasi — `00-MODUL-TAYANCH.md` 1.9 (aynan); 6-darsdagi 1-tashkilotchi gapi — 1.6; Pro va kim to'laydi — 1.0; narx — 1.4; jami sonlar — 1.13;
  atamalar «tasdiq», «to'lovchi» — 2 va 9.16; kalitlar — 8; uy suhbatlari — 9.10; «pul olinmaydi» — 9.11; qarorlar — `GATE_M_JAVOB.md` Qaror-0 2, 11, 12.
- Xavfsizlik: `00-TAQIQLAR.md` 1, 3 · 12-Modul tayanchi 1.6 (olti bandli ro'yxat), 9.38 d (ota-ona bandi), 9.39 e (sinfda sanash yo'q) · Mentor tekshiruvi shakli — 12-Modul tayanchi 1.10, 9.42 a; 11-Modul tayanchi 1.4, 9.66.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor xabari matni** (`MENTOR_XABAR`) — tayanchda yo'q. Yozdim: «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa, to'lashga tayyormisiz? Tayyor bo'lsangiz, bir gap yozib bering: qaysi narxda va nima uchun to'laysiz. Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.»
   Asos: tayanch 1.9 tasdiq shakli («narx X bo'lsa, … uchun to'layman»), TAQIQLAR 1 (bosimsiz, real pul yo'q). O'quvchi xabari qolipi shundan; oxirgi qator o'zgarmaydi va 4, 7-ekranda «bosimsiz» dalili.
2. **Tashkilotchilar javoblarining to'liq matni** — tayanchda faqat narx, «Doimiy o'yin» va qavsdagi iqtiboslar bor («har shanba o'zim yozishdan charchadim», «15 000 qimmat», «Telegram tekin»). To'liq gaplarni shu bo'laklar va tasdiq qolipidan yig'dim (A-6 jadvali).
3. **«Hozir yo'q» ikkinchisi va javobsiz** — tayanchda kim ekani yo'q («biri — 2-tashkilotchi»). Qo'ydim: 5-tashkilotchi — «Hozir yo'q.» (sababsiz, to'qilmadi), 6-tashkilotchi — javob bermadi.
4. **Mentor misolida xabar qayerda** — tayanchda yo'q; qo'ydim: hammasi chatda (`manba: 'chat'`); qachon — ko'rsatilmaydi. 4–6-tashkilotchi — mahalla futbol guruhidagi tanishlar, guruh egasining ruxsati bilan (6-darsdagidek; tayanch 1.6). Tasdiqlansa — tayanch 1.9 ga bir qator.
5. **Uy suhbatlarini kiritish shakli (9.10)** — 6-ekran 1-qism. `hozir` — ixtiyoriy (6-dars uyga vazifasi ③ endi «hozir nima qiladi (qisqa)» ni ham yozdiradi — F-1007-464; yozilmagan bo'lsa `null`); `qachon` — suhbat bo'lgan kun (sukut — bugun; F-1007-467).
   `pm-m11d6-suhbat.xulosa` — 6-dars TAYANCHGA SAVOL 10 «9-dars MD si hal qiladi» degan: **9-darsda yozilmaydi, `null` qoladi** (sabab: bu dars natijasi — yozma tasdiq; bir ekran — bir ish, P-008). Kerak bo'lsa — 11-dars o'zi so'raydi.
6. **Darsda xabar yuborish chegarasi** — tayanchda yo'q. Qo'ydim: darsda faqat 6-darsdagi suhbatdoshga (real suhbat; uydagisi haqida 6-dars uyga vazifasi ① «Ota-onangizga ayting» — ota-ona biladi) yoki to'lovchi bo'ladigan sinfdoshga; oldin yozmagan tanish to'lovchiga — uyda, ota-onaga aytib.
   12-Modul 9.38 d (ota-ona bandi Mentor bilan yopilmaydi) bilan mos deb hisobladim; boshqacha qaror bo'lsa — darsda yuborish butunlay olib tashlanadi (2-qism faqat xabar yozish bo'lib qoladi). Shubhali 2.
7. **`pm-m11d9-tasdiq` qo'shimchalari** (tayanch 8 sxemasiga): `xabar: string | null` (bosimsizlik dalili) · `tekshiruv` ga `null` (o'tkazilmagan) · `tuzatishSabab` turi `'kim' | 'narx' | 'gap' | null` · `keyingiQadam: string | null` (tayanch 1.9 «keyingi qadam») · o'zgarmas shart `soralgan` = `tasdiqlar.length` + `hozirYoq` + `javobsiz`.
   F-1007-467: narxsiz yoki «nima uchun»siz javob — alohida holat «aniqlashtirish kerak» (`aniqlashtirish: n`); avval «javob yo'q» ga tushardi — odam javob bergan edi.
8. **`pm-m11d2-model.kim` ni o'qish** — tayanch 8 da 9-dars uni o'qimaydi. Varaqdagi «To'lovchi: {kim}» qatori uchun o'qiydi (7-ekran 1-savol dalili); yo'q bo'lsa qator ko'rinmaydi. Kerak emas desangiz — sherik rolni og'zaki so'raydi.
9. **Kech kelgan yozma tasdiqlar qayerga kiritiladi** — 6-darsdagi uy suhbatlari kabi masala. Uyga vazifa ② — qog'ozga (o'quvchiga va'da yo'q). Tavsiyam: (a) 11-dars ularni kiritadi («yo'q bo'lsa — o'quvchi o'zi yozadi» — tayanch 8); (b) 9-dars qayta ochilib qo'shiladi — LMS da sinalmagan, 9.10 ruhiga zid.
10. **Bitta xabar, bir marta; «hozir yo'q» va javobsizga qayta yozilmaydi** — tayanchda so'zma-so'z yo'q (TAQIQLAR 1 «bosim yo'q» va 12-Modul olti bandli ro'yxatining 5-bandidan). Mentor 6-darsda «yo'q» degan 2-tashkilotchiga bir marta yozgan (tayanch 1.9: «6-darsdagi uchtasi ham») — bu qoida bilan zid emas: bitta xabar.
11. **Narxsiz yozma javob — yozma tasdiq emas** (tayanch: «Narx va nima uchun yozilganmi?» — tuzatish). 6-ekranda saqlanmaydi (narx bloklaydi), 7-ekranda topilsa — «Tuzatish: narx va nima uchun».
12. **Mentor statistikasi** — faqat to'rt signal; son, rol, gap Mentorga ham uzatilmaydi (TAQIQLAR 3 ning o'qilishi; 6-dars pilotidagidek). 12-Modul 10-darsida Mentor muhrni ko'rardi — bu yerda «Tuzatish bor» signali yetadi deb hisobladim.
13. **«xabar» so'zi** — so'rash xabari uchun; «so'rov» ishlatilmadi (3-darsda Backend so'rovi). Tayanch 2 da «xabar» to'lov xabari / Telegram xabari / jonli xabar ma'nolarida bor — bu darsda «chat xabari» (tayanch 1.9 iborasi), birinchi uchrashganda shunday.
14. ✅ **Mentorning halol gapidagi «tasdiq»** — F-1007-467: tayanch 1.9 da «Uchta yozma tasdiq — …» ga almashdi (T-014). Avval: qolgan o'quvchi matnida doim «yozma tasdiq». Tayanchdagi gapni «Uchta yozma tasdiq — …» ga almashtirish kerakmi — qaror sizda.
15. **Yakun holatlari (6)** — ✓ va nishon faqat «yozma tasdiq bor va tekshirildi» holatida (soni 1 bo'lsa ham — uchtaga yetmaslik baho emas). «Xabar yuborildi — yozma tasdiq hali yo'q» holatiga ✓ bermadim: tekshiruv bo'lmagan.
16. **1-savol o'quvchi uchun umumiy shakl** — tayanch: «o'zi yoki sinfdosh-o'yinchi emas» (Mentor misoli). O'quvchi matnida: «o'zingiz yoki to'lamaydigan odam emasmi?» (sinf 4 — Mentor misoli umumiy qoida emas).
17. **Juftlikda xabarning o'zini ko'rsatish** — ixtiyoriy, ism va telefon yopilgan holda (tayanch 1.9 skrinshot qoidasidan). Sherik so'zma-so'zligini yozuv shaklidan (qo'shtirnoq, xulosa so'zlari yo'qligi) ko'radi.
18. ✅ (F-1007-467: «Ishonmayman — hali gap») **Hook varianti «Ishonmayman — faqat gap»** — tashkilotchi haqida beparvo ohang bo'lishi mumkin; muqobil «Ishonmayman — hali so'z» (6-dars 8-ekran so'zi). Tanlov sizda.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — 6-ekran ≈ 25 daqiqa (uy suhbatlari + xabar + javoblar), 7-ekran ≈ 13. Bu — reja: «qur» pilotida 12–15 o'quvchi bilan taymer bilan o'lchanadi.
2. ⛔ **Darsda xabar yuborish** — kim bilan va qanday (TAYANCHGA SAVOL 6) foydalanuvchi tasdig'isiz qoldirilmasin. Pilotda: nechta o'quvchi darsda yubora oladi, javob 7-ekrangacha keladimi. Ko'p o'quvchida darsda yozma tasdiq 0 bo'ladi — yakun 4–5-holati shuning uchun bor.
3. **Javob matnlari yig'ilgan** (TAYANCHGA SAVOL 2) — 1, 3, 4-tashkilotchi bir xil qolipda yozgandek («… so'm bo'lsa, "Doimiy o'yin" uchun to'layman») — Mentor xabari shu shaklni so'ragani uchun; auditor «sun'iy» deyishi mumkin.
4. **«Bosimsiz»ni dastur tekshira olmaydi** — xabar qatori o'zgarmaydi va sotish so'zlari yumshoq tekshiriladi, lekin odamga og'zaki bosim yoki qayta yozishni faqat sherik va Mentor savoli ko'radi.
5. **Ism tekshiruvi** — erkin matnda ismni dastur aniqlay olmaydi; bloklanadi faqat telefon, «@», «t.me/» shakli. Ism — kulrang qator, Yordam va sherik ko'rigi bilan.
6. **«Narx gapda yo'q» tekshiruvi** — raqam so'z bilan yozilsa («o'n besh ming») soxta ogohlantirish beradi; shuning uchun yumshoq (KOD 7 namunasi).
7. **To'lovchi rolini tekshirish** — dastur bilmaydi; 1-savol sherikning hukmi. `pm-m11d2-model` yo'q bo'lsa varaqda «To'lovchi» qatori ham yo'q (TAYANCHGA SAVOL 8).
8. **3-test C varianti** («5 000 so'mni oldindan o'tkazib berdi») — hayotda kuchliroq va'da bo'lishi mumkin; savol «qaysi biri yozma tasdiq» deb aniq so'raydi va dars real pulni taqiqlaydi. Auditor «distraktor hayotda rost» desa — savol shakli chegarasi.
9. **Arena 2 C («44 tadan — hamma foydalanuvchidan»)** — 44 — 12-Modul ro'yxatdan o'tganlar soni (boshqa o'lchov); distraktor sifatida ataylab, lekin «son aralashadi» deb ko'rilishi mumkin.
10. **Arena 9 D («Maydon egasidan»)** — tayanch 1.2 dagi B2B modeli (2-darsda rad etilgan) — 2-dars kashfiyotiga tayanadi; o'quvchi 2-darsni o'tkazgan bo'lsa ma'noli.
11. **Kech kelgan javoblar** (TAYANCHGA SAVOL 9) — bu darsda yozuvga tushmaydi; 11-dars o'qiganda o'quvchining haqiqiy soni darsdagidan katta bo'lishi mumkin.
12. **Muhr «Tuzatish: so'zma-so'z va bosimsiz»** (eng uzuni, 33 belgi) — yumaloq muhr ichida ikki qatorga tushishi mumkin; vizual bosqichda ko'riladi (kerak bo'lsa muhrda faqat «Tuzatish», savol — ostidagi qatorda).
13. **«Maydon Jamoa» telefon maketida faqat 0-ekranda** (tashkilotchi qo'lidagi ilova) — 2, 6-ekranlarda telefon — chat (Mentor yoki o'quvchi yozishmasi), nom varaq sarlavhasida o'z rangida (6-dars pilot va 12-Modul 11-dars naqshi). Vizual bosqichda tekshirilsin (TAQIQLAR 0).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + 13-Modul pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-10 taqsimot va «Ulgurmagan o'quvchi yo'li»; ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi; javob kutilmaydi — dars davom etadi (6-ekran O'qituvchi eslatmasi).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — tashqi xizmat qadami yo'q (Manbalar); darsda xabar yuborish va javob vaqti — ⛔ pilotda (Shubhali 2); LMS da darsni qayta ochish — tavsiya qilinmadi (TAYANCHGA SAVOL 9).
3. [x] **Saqlash kaliti — shartnoma** — A-11: har maydon, tipi, `null` holatlari, o'zgarmas shart, `id` barqaror, `kim` — rol, birlik (odam), `tekshiruv` to'rt qiymati va qachon qaysi; `pm-m11d6-suhbat` ga yozish — tayanch 8 ruxsati bilan, faqat yangi real yozuv; kalitga ism yo'q.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — xulosalar «Bu darsda …», «Bu misolda …» (2, 4-ekran, yakun); xabar — «Mentor xabaridagi bo'sh joylarni moslang» (6-ekran); uch savol — kurs qolipi; «uchta» — dastur maqsadi, baho emas; 1-savol o'quvchi uchun umumiy shaklda (TAYANCHGA SAVOL 16).
5. [x] **Kafolat va sabab da'vosi yo'q** — «isbot emas» — nimaning isboti emasligi aytilgan (yakun 4-qatori, kartochka 10); «yozma tasdiq oldi = sotdi» yo'q (yozma tasdiq — to'lov emas: 2-ekran `QIzoh`, yakun 2-qatori); «Tuzatish qilindi» kabi natija da'vosi yo'q — muhr «Tuzatish: …» faqat holat.
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — yakun olti holat (11-ekran; E 54); 6 va 7-ekran xulosalari holatdan; «Checked!» faqat yozma tasdiq bor va uch savol javoblanganda; «yuborildi ✓» — o'quvchining o'z harakati; nishon tavsiflari qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «so'ralgan» — xabar yuborilgan odamlar (birlik — odam); bitta odamdan bitta yozuv; yozma tasdiq — narx va nima uchun bilan (narxsiz — sanalmaydi); «uchtagacha» — real yozma tasdiqlar; suhbat va yozma tasdiq — har xil yozuv, aralashmaydi.
8. [x] **Test: bitta himoyalanadigan javob** — 3, 5, 8-ekran va arena: distraktorlar uch xil turkumdan (Izoh qatorlari); hukm-variantlari 2/2 (5-ekran, arena 7, 8); inkor-savol yo'q (arena 11 «nimani yopasiz?» shaklida); hayotda rost bo'lib qoladigan variant — Shubhali 8 da ochiq; to'g'ri javob yolg'iz eng uzun emas.
9. [x] **Real odamlar xavfsizligi** — A-9: ota-ona bandi Mentor bilan yopilmaydi (uyga vazifa ①: «Ota-onangizga ayting»; darsda — faqat ota-ona biladigan odamga); sinfda sanash yo'q, Mentor statistikasida son yo'q; o'quvchi Mentor nomidan tasdiqlamaydi (muhrni sherik/Mentor ko'rganda — «Qabul», yakka — «Tuzatish topilmadi»); bir xabar ko'p guruhga va notanishga — yo'q (6-ekran Yordami, arena 10); ixtiyoriy narsa majburiydek aytilmaydi («Hozir yubora olmayman», «uchtagacha»).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — agent yo'q; xabarni o'quvchi o'zi yuboradi, tekshiruvni sherik bilan o'zi o'tkazadi; sun'iy yozuv yo'q (sinfdosh to'lovchi bo'lmasa yozma tasdiqi tuzatish).
11. [x] **Web-trek teng yo'l** — PM darsi, blok yo'q; matnda «mahsulotingiz» (6, 7-ekran, yakun); kalitlar ikkala trekda bir.
12. [x] **Mentor misoli ichki izchil** — sonlar 1.9, 1.13 aynan (6 · 3 · 2 · 1; 2 × 15 000, 1 × 10 000); 6-dars yozuvlari 1.6 bilan bir (1-tashkilotchi «ha», 2 — «yo'q», 3 — «qimmat» 10 000 → 9-darsda mos holatlar); keyingi darslar sonlari (10, 11-dars) ochilmagan; yangi tafsilot — TAYANCHGA SAVOL 1–4.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — kimga yuborish, nima uchun, narx, keyingi qadam — o'quvchida (6, 7-ekran); narxni Mentor qo'ymaydi (O'qituvchi eslatmasi); keyingi qadam Yordamidagi misollar — «qaysi ish — o'zingiz tanlaysiz».
14. [x] **Uyga vazifa yengil va aniq** — 4 band, «uchtagacha», bir marta yuborish, qog'ozga, muddat — keyingi darsgacha; ④ faqat qolgan ish bo'lsa; kam bo'lsa — halol natija.
15. [x] **Ayb da'vosi yo'q** — xato izohlari harakatga chaqiradi («qayta qarang», «so'zma-so'z ko'chiring»); «xatongiz emas», «sizda emas» yo'q; «Tuzatish» — «yaxshi natija» (7-ekran O'qituvchi eslatmasi).
16. [x] **Kelajak va'dasi yo'q** — keyingi darslar (11-dars, taklif havolasi) va'da qilinmaydi; kech kelgan javoblar qayerga kiritilishi aytilmaydi (yakun Izohi); xabarda faqat hozirgi narx va «to'lov emas»; «tez orada» yo'q.
- [x] **12-Modul tayanchi 7 (14 band)** — holatga qarab yakun (11-ekran) · da'vo isbot emas (2-ekran Mentor yozuvi, yakun) · maxfiy qiymat yo'q (agent va `.env` bu darsda yo'q) · tashqi xizmat — yo'q · har sonning manbasi («Mentor misolida», tayanch 1.9) ·
  tayanchda yo'q narsa — TAYANCHGA SAVOL · kalit o'qiydigan darsdan (11) · test bitta javob · keys — [—] keyssiz · 90 daqiqa · bir ma'no — bir so'z (A-5) · web-trek teng · agent yo'q · o'smir xavfsizligi (A-9).
- [x] **13-Modulga xos (pul)** — real pul yo'q (A-9, 2-ekran `QIzoh`, 3-ekran C, 8-ekran D, arena 10, yakun) · karta ma'lumoti hech qayerda (maket — chat; to'lov formasi yo'q; o'quvchi matnida bank kartasi tilga olinmaydi) · «mashq to'lov» odamlarga berilmaydi (arena 10, 8-ekran D) ·
  «Test rejim» belgisi — [—] bu darsda to'lov ekrani yo'q · narx — «Mentorning taxmini» (A-3, A-6) · suhbat va tasdiqda bosim yo'q (xabarning o'zgarmaydigan qatori, 6-ekran tekshiruvi, 7-ekran 3-savoli, arena 8, 12) · oferta — [—] bu darsda yo'q.

## O'lchov — `md09/olchov.py` va `md09/hisob.py` natijasi (qavsdagi sonlar skript bilan tekshirilgan)
```
Qavsdagi uzunliklar: 147 ta — matn bilan mos (skript har «(N)» ni oldidagi matnga solishtiradi; birinchi yurishda 63 tasi qo'lda
  yozilgan taxminiy son edi — skript bilan qayta sanab qo'yildi). Qolgan 9 signal — 4 ta «(umumiy)» bilan boshlangan qator
  (qo'lda qayta sanaldi: 39 · 38 · 53 · 39), asosiy fikr (102, «**» dan keyingi bo'shliq), bashorat qatori boshi (29), uzunlik emas (12, 12, 11).
Sarlavhalar (12 ta, yakun holatlari bilan): 25–51 (2-ekran — 39, F-1007-467) · ≤55, hammasi bitta qator. Yakundagi `{n}` li sarlavha — 42 (n bir xonali).
Xulosalar: 2-ekran 88 · 4-ekran 82 · 6-ekran 56 / 47 / 60 · 7-ekran 58 / 49 / 42 / 52 · ≤110.
QIzoh qatorlari: 76 · 52 · 86 · 83 (bitta qator; 2-ekran 61 → 86, F-1007-467). Ipucha: 73 · 61. Kulrang qatorlar: 35–109 (eng uzuni — 6-ekran darsda yuborish qoidasi, 109).
Bugungi asosiy fikr (A-2, yakunda ko'rsatilmaydi): 102 · ≤110.
Hook javobi: 112 · ≤120 (sof so'rovnoma — uchala variantga bitta javob); hook variantlari 23 · 22 · 21 (+10%).
To'g'ri izohlar: 42 · 36 · 52 · ≤60.
Xato izohlari va QXato (42 ta, 2–8-ekran): 20–56 · ≤60.
Nishon tavsiflari: 43 · 45 · 41 · 45 · ≤48 (KORPUS §63).
Mentor gaplari: kirish 2 gap (72) · reja 2 gap (118) · interaktiv 2, 4, 6, 7-ekran — 1 gap (54–89; 6-ekran uch qism 68–69, 7-ekran yakka 65, keyingi qadam 68);
  sarlavha so'zlari Mentorda: 0/4 · 0/6 · 0/4 · 0/6 · 0/4 · 0/4 · 1/4 · 0/3 — hech qayerda ≥50% emas; «Bu…», «Hammasini…» bilan boshlanmaydi.
Test savollari: 3-ekran 8 so'z · 5-ekran 11 · 8-ekran 12 · arena 5–12 · ≤12.
3-ekran: A 46 · ✔B 47 · C 48 · D 51 | min/max 46/51 (+11%)
5-ekran: A 36 · B 39 · C 40 · ✔D 39 | min/max 36/40 (+11%)
8-ekran: ✔A 41 · B 43 · C 41 · D 44 | min/max 41/44 (+7%)
arena 1: A 31 · ✔B 34 · C 35 · D 33 | +13%
arena 2: A 33 · B 34 · C 33 · ✔D 33 | +3%
arena 3: A 38 · B 39 · ✔C 36 · D 37 | +8%
arena 4: A 34 · B 35 · C 34 · ✔D 33 | +6%
arena 5: ✔A 32 · B 32 · C 32 · D 34 | +6%
arena 6: A 35 · B 31 · ✔C 34 · D 31 | +13%
arena 7: A 32 · ✔B 32 · C 33 · D 34 | +6%
arena 8: A 31 · B 29 · C 33 · ✔D 29 | +14%
arena 9: ✔A 35 · B 32 · C 36 · D 33 | +12%
arena 10: A 34 · B 34 · ✔C 37 · D 37 | +9% (✔ D bilan teng — yolg'iz eng uzun emas)
arena 11: A 24 · ✔B 23 · C 25 · D 26 | +13%
arena 12: ✔A 34 · B 33 · C 33 · D 37 | +12%
To'g'ri variant hech bir testda yolg'iz eng uzun emas.
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
Belgilar soni — bo'shliq bilan, `**` siz (Python `len`). `npm run lint:til feedback/F-1007-13modul/09-PmPayCheck-v3.md` — **0 error, 0 warn** (birinchi yurishda toza edi; O'lchov bo'limi qo'shilgach bitta error — «taxmin-qiling» qoidasi o'lchov izohidagi «taxmin qil-» so'ziga tushdi, so'z almashtirildi; lint ko'rmaydiganlari — 13-Modul `mdtekshir.py` bilan: kafolat, kelajak, kod raqami, «obuna» faqat meta-qatorlarda).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 452–454 (grep 07.10) — `m11-08` «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» → **`m11-09` «Kim haqiqatan to'lashga tayyor?»** (osti «Mentor tekshiruvi: uchta yozma tasdiq» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m11-10` «Loyiha kuni: taklif havolasi va mukofot» (yakundagi «Keyingi dars» qatori). 0-ekran sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (Pro, «Doimiy o'yin», Mentor xabari, olti javob, tekshiruv — tayanch 1.0, 1.4, 1.6, 1.9); ikkinchi misol faqat testlarda (P-002); keyssiz; metafora yo'q; bitta vizual — `TasdiqVaraq` (telefon · varaq · sahna).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → javob pufagi varaq qatoriga uchadi, son va «nima uchun» kataklarga) · 4 (dalil bosiladi → yashil, muhr) + 0, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md09/olchov.py`): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi ≤60 — «O'lchov» bo'limida.
- [x] Atamalar oldingi darslar bilan bir (grep): narx, Pro, «Doimiy o'yin», to'lovchi, «mashq to'lov» — 13-Modul tayanchi 2, 9.16 · suhbat, so'zma-so'z, belgilar, tanish — 6-dars · Mentor tekshiruvi, qabul, tuzatish, «Tuzatish topilmadi», dalil — 11, 12-Modul ·
  yangi: yozma tasdiq, javob holati, keyingi qadam — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («Narx va nima uchun yozdi», «Saqlash», «Yo'q — tuzataman», «Uyda tuzataman» — 12-Modul naqshi).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% («O'lchov»); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 3-ekran B, 5-ekran D, 8-ekran A (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari o'quvchi matnida yo'q · xulosalar «Bu darsda …», «Bu misolda …» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-09`, «A1», K-raqam yo'q; modul raqami LMS bo'yicha — «11-Modulda», «12-Modulda», «6-darsda», «4-darsdagi»); tarixiy voqea yo'q (keyssiz); «KOD» ro'yxati 14 band, REPO yo'q.
- [x] Karta T · P · S · PM: T-008 (tashkilotchilar javoblari, Mentor xabari va yozuvi — olam ichidagi matn) · T-011/PM-030 (yozma tasdiq — 2-ekran oxirida; tugmalar atamadan oldin oddiy so'z) · T-014/T-015 (A-5: xabar/so'rov, belgi/holat, tasdiq) · T-016/T-017 (metafora yo'q) ·
  T-024 · T-029/T-047 (0-ekran Mentori maketni takrorlamaydi) · T-038 · T-039 («yozuvlaringiz» — 6-ekrandan keyin) · T-042 (ta'rif: 2-ekran = yakun = kartochka 1) · T-043 · T-045 (yozma tasdiq — to'lov emas) · T-048 · T-049 · T-052 (to'laydigan odam ↔ to'lovchi; suhbat yozuvi ↔ yozma tasdiq) · T-064 · T-070 (tanish ↔ notanish) ·
  P-001 · P-002 · P-004 (6, 7 — o'z mahsuloti) · P-008 (7-ekran 4-qism shartli) · P-012 (testlar 3, 5, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 (kalit yo'q bo'lsa — o'zi yozadi) · P-033 · P-036 · P-046 · P-048 · P-052 · P-055 · P-062 · P-064 · P-067 ·
  S-001 (savollar 8–12 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 · S-026 · S-027 · §102 · §110 · §119 · §144/§145 · §215 · §216 · PM-005 (2-tur) · PM-018 (`kim` — rol, munosabat qavsda) · PM-020 (xabar qolipi to'liq gap) · PM-021 · PM-027 · J-026 · SABOQ 1–39, E 40–55.
- [x] Pul va xavfsizlik (TAQIQLAR 1, 3): real pul yo'q, karta ma'lumoti yo'q, «mashq to'lov» va to'lov havolasi odamga berilmaydi, xabarda «Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.», bosim yo'q, faqat tanish doira, ism/telefon/Telegram nomi yo'q, sinfda sanash yo'q, Mentor sonlari — tayanch 1.9 aynan.
