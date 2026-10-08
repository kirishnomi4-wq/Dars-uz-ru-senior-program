# 13-Modul · 5-dars «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» — MD v3 (yangi dars, loyiha kuni)

Fayl: `src/11-Modull/PaymentDayLesson.jsx` (kalit `m11-05`, App.jsx `type: 'Proyekt'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar — tayanch 4 «Loyiha kuni») · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni, keyssiz (Qaror-0 21). Qolip: QKirish · QReja · QTushuncha · QTest · amaliyot bloki (QBlok) · QNatija · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx 449-qator, grep 07.10): «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» · osti «test rejimda to'lov oqimi; buzamiz va tuzatamiz» ·
oldingi `m11-04` «Narxni qanday belgilaysiz?» · keyingi `m11-06` «Pul haqida qanday gaplashasiz?».
Namuna (tuzilish, hajm): 12-Modul `05-BreakAndFix-v3.md` + `05-FILTR.md` (buzish yozuvi, «Tuzatish qilindi», agent — zaxira) · 12-Modul `04-LiveNotifyDay-v3.md` + `04-FILTR.md` (loyiha kuni shakli, uch blok, holatga qarab yakun) · pilot `03-PaymentWebhook-v3.md` (mashq sahifasi, `TOLOV_SAHNA`, webhook javoblari) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · yorliq input ichida (E 43) · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · ko'p elementli mashq ketma-ket (E 53) · odamlar chizilmaydi (bu darsda odam kerak emas).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** · 7-ekran **A** · arena A·B·C·D ×3. Final tartib-mashqi yo'q (loyiha kuni, 172).
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–2 ≈ 13 · 1-amaliyot ≈ 25 · 4–5 ≈ 10 · 2-amaliyot ≈ 20 · 7 ≈ 2 · 3-amaliyot ≈ 15 · podium, kartochkalar, yakun ≈ 5 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (1 va 3-amaliyotda Render kutishi, 2-amaliyotda 70 soniyalik kutish bor); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 12-band.
⚠️ **Pul chegarasi (TAQIQLAR 1, Qaror-0 5, 6) — har ekranga tegadi:** real pul yo'q — faqat test rejim, «mashq to'lov» · karta ma'lumoti hech qayerda (karta raqami, amal qilish muddati, CVV, SMS kod — maketda, namunada, promptda, kalitda yozilmaydi va chizilmaydi; mashq sahifasida karta maydoni yo'q) ·
`TOLOV_KALITI` qiymati faqat `backend/.env` da va Render sozlamasida (promptda, `BUZISH.md` da, maketda — faqat nomi) · «Mashq to'lov» Payme yoki Click nomi va ko'rinishini taqlid qilmaydi; bu darsda real xizmat brendi chizilmaydi. **«Buzish» — faqat o'quvchining o'z mahsulotida, «Mashq to'lov» tugmalari bilan** (TAQIQLAR 3).
⚠️ **GATE M da birinchi ko'riladigan savollar — TAYANCHGA SAVOL 1 va 2** («Javob kutilmoqda» qaysi blokda; ikki yangi tugma qaysi blokda).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.5):** dars oxirida o'quvchining o'z repo'sida, o'z mahsuloti va trekida:
   (a) to'lov oqimining qolgan uch holati ko'rinadi — rad etilgan to'lovda «To'lov o'tmadi — qayta urinib ko'ring», natija hali kelmaganda «Javob kutilmoqda», pullik qulaylik muddati tugaganda u o'zi o'chadi; «Mashq to'lov» sahifasida ikki yangi tugma — «Kechiktirib yuborish», «Noto'g'ri imzo» (1-amaliyot);
   (b) to'lov to'rt usul bilan buzib ko'rilgan, har urinish buzish yozuvi bilan yozilgan, `BUZISH.md` da «To'lov» bo'limi bor (2-amaliyot; kod yozilmaydi);
   (c) «buzildi» chiqqan urinishlar agentga yozuv bilan berilgan, «Tuzatish qilindi» belgilangan va o'sha usul bilan qayta tekshirilgan (3-amaliyot). «Buzilmadi» ham natija — yakun sarlavhasi holatga qarab (11-ekran). **Uyga vazifa yo'q** (tayanch 4: loyiha kuni).
   Saqlanadi `pm-m11d5-buzish` (tayanch 8 — aynan): `{ urinishlar: [{ usul: 'ikki' | 'kech' | 'rad' | 'imzo', qildim, kutdim, boldi, buzildi: bool | null, tuzatishQilindi: bool, qayta: 'takrorlanmadi' | 'takrorlandi' | null }], savedAt }` —
   to'rtta yozuv, tartib o'zgarmaydi (ikki · kech · rad · imzo), `usul` — barqaror kalit; birinchi yozuv kartasi saqlanganda to'rttalasi yaratiladi (`boldi: ''`, `buzildi: null` — urinish hali bajarilmagan, `tuzatishQilindi: false`, `qayta: null`; 12-Modul 9.37 j).
   `qildim`, `kutdim`, `boldi` — o'quvchining o'z matni; ism, login, telefon, kalit qiymati yozilmaydi. Kalitni 12-dars o'qiydi (barqarorlik tekshiruvi). Boshqa darsning kaliti yozilmaydi.
   O'qiladi: `pm-m11d4-narx` — `ishlaydi` (1-amaliyot «Ochish» qatori) va `ekran.tugma` (2-amaliyot «Nima qildim» dagi to'lov tugmasi nomi; yo'q bo'lsa — «to'lov tugmasi») · `pm-m9d8-platforma.trek` (TAYANCHGA SAVOL 5).
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m13-dars-05-start` (= `m13-dars-04-done` — agent 4-darsda yozgan kod, hech narsa ataylab buzilmaydi; README eslatmasi — pilotda topilgan muammolar bilan, tayanch 3; F-1007-463) → `m13-dars-05-done`.
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** Agentning «to'lov ishlaydi» degani — da'vo: to'lov xabari ikki marta, kech, rad yoki noto'g'ri imzo bilan kelganda nima bo'lishini o'zingiz buzib ko'rasiz, tuzatilgach o'sha usul bilan qayta tekshirasiz.
3. **Oldingi darslardan keladigan narsa (aynan):**
   - **3-dars** (pilot `03`, tayanch 1.3, 9.1–9.6): `POST /tolov/webhook` — tartib imzo → takror → yozuv; javoblar: imzo mos emas — `401`, hech narsa yozilmaydi · yangi to'lov — `200 { ok: true }` · takror — `200 { takror: true }`, yozuv yo'q · «rad» ham yoziladi — `200 { ok: true }`.
     `tolovlar` (`tolov_raqami` noyob · `oyinchi_id` · `summa` · `holat` · `yaratilgan`) · `TOLOV_KALITI` faqat `.env` da · «Mashq to'lov» sahifasi: sarlavha «Mashq to'lov», ostida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.»,
     tugmalar «To'lash (mashq)» · «Rad etish (mashq)» · «Ikki marta yuborish» · «Imzosiz yuborish»; sahifa xabarni Backend'da imzolaydi — kalit brauzerga chiqmaydi; sahifada «To'landi (mashq)» yoki «To'lov o'tmadi» (3-dars 0, 9-ekranlar). Namuna: to'lov raqamlari `m-1NN` (soxta), Mentor hisobi `oyinchiId: 7` (9.1).
   - **4-dars** (tayanch 1.4, 3, 9.7): to'lov taklifi ekrani (so'zma-so'z) — «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «30 kun — 15 000 so'm» · «To'lovga o'tish» · kulrang «Test rejim: pul yechilmaydi».
     «E'lon berish» ekranida belgi «Har hafta takrorlansin»: Pro bo'lmasa — to'lov taklifi ekrani ochiladi, Pro bo'lsa — o'yin «doimiy» bo'ladi; keyingi haftaning o'yini `GET /oyinlar` so'ralganda yaratiladi.
     `oyinchilar.pro_gacha` (sana yoki bo'sh) · `GET /men` → `pro`, `proGacha` · webhook Pro'ni 30 kunga uzaytiradi · «To'lovga o'tish» avval `POST /tolov/boshlash` → `{ tolovRaqami, havola }`; mashq sahifasi faqat shu raqam bilan ishlaydi · ilova qaytganda Pro'ni ko'radi.
     Narx — **15 000 so'm / 30 kun — «Mentorning taxmini»** (mashq sahifasidagi qator «Maydon Jamoa — Pro, 30 kun · 15 000 so'm», 9.1). Mentor misolida agent 4-darsda «to'lov ishlaydi» degan (tayanch 1.5).
   - **12-Modul 5-dars** (12-Modul tayanchi 1.5, 9.37): **buzish** — chekka holatni ataylab yuzaga keltirib tekshirish · **buzish yozuvi** — nima qildim · nima kutdim · nima bo'ldi → **buzildi** / **buzilmadi** · **«Tuzatish qilindi»** (ish fakti) va **«qayta tekshiruvda takrorlanmadi»** / **«qayta tekshiruvda yana buzildi»** (natija) · `BUZISH.md` (repo ildizida; 12-Modul bo'limi bilan).
   - **11-Modul:** Neon SQL Editor'da test ma'lumoti — `UPDATE … WHERE id = …`, keyin qaytariladi (11-dars; 11-Modul tayanchi 9.35) · `git status` → `git add <fayl>` odati · trek `pm-m9d8-platforma.trek`. 3-dars A2: o'z hisob raqamini topish — `SELECT id FROM oyinchilar WHERE login = '…';`.
   - **7-Modul:** «Bepul server uxlaydi; webhook xabari uni uyg'otadi.» — bugun «Kechiktirib yuborish» shu holat o'rnida (o'quvchi matnida «server» yo'q — «bepul Backend», tayanch 9.5).
4. **Mazmun (tayanch 1.5 — aynan; o'zim qaror qilganlarim — TAYANCHGA SAVOL bilan):**
   - **Dars g'oyasi:** 4-darsda agent «to'lov ishlaydi» degan — bu da'vo. Bugun to'lov oqimining qolgan holatlari quriladi va to'rt usul bilan buzib tekshiriladi (buzish yozuvi: nima qildim · nima kutdim · nima bo'ldi → buzildi / buzilmadi).
   - **To'rt buzish usuli** («Mashq to'lov» tugmalari bilan; faqat o'z mahsulotida; tartib — tayanch 1.5):
     1) **ikki marta yuborish** — bitta raqam bilan bir xil xabar ikki marta (3-darsdagi tugma) ·
     2) **kechiktirib yuborish** — sahifa xabarni 70 soniya kutib yuboradi; uxlagan Backend o'rnida (Render uyg'onishi ≈1 daqiqa); haqiqiy uxlashni kutish shart emas — o'quvchi matnida bir gap: «haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi» ·
     3) **rad etish** — «Rad etish (mashq)» (3-darsdagi tugma) ·
     4) **noto'g'ri imzo** — xabar `TOLOV_KALITI` bilan emas, boshqa kalit bilan imzolanadi (yangi tugma; 3-darsdagi «Imzosiz yuborish» da imzo umuman yo'q).
     Har urinish to'lov tugmasidan («To'lovga o'tish») boshlanadi — 4-darsdan mashq sahifasi faqat shu tugma bergan raqam bilan ishlaydi (tayanch 9.7); shuning uchun urinish oldidan Pro yo'q bo'lishi kerak (TAYANCHGA SAVOL 4).
   - **Mentor misolida topilgan ikki muammo (tayanch 1.5 — aynan; pilotda tekshiriladi — ⛔ «qur» darvozasi):**
     1) **Ikki marta kelgan xabar Pro'ni ikki marta uzaytirdi** — `tolovlar` da bitta qator (3-dars himoyasi ishladi), lekin Pro 60 kunga uzaydi. Sabab: Pro'ni uzaytiradigan qator takror tekshiruvidan oldin ishlaydi. Tuzatish: Pro faqat yangi yozilgan to'lovdan keyin uzayadi («bitta tranzaksiyada» — faqat Mentor Yordami va REPO da; tayanch 2, TAQIQLAR 8).
     2) **Kechikkan xabar: sahifa «To'lov o'tmadi» dedi, keyin Pro yoqildi** — ilova esa eski holatda qoldi. Sabab: sahifa javobni 10 soniya kutib, «o'tmadi» deb yozgan. Tuzatish: sahifa «Javob kutilmoqda» ko'rsatadi; ilova qaytganda va «Qayta tekshirish» bosilganda `GET /men` ni qayta so'raydi.
     Rad etish va noto'g'ri imzo — **buzilmadi** (rad — Pro yoqilmadi; imzo — `401`). «Buzilmadi» ham natija.
     ⛔ **«Qur» darvozasi:** Mentor repo'sida `m13-dars-05-start` + 1-amaliyot talabi bajarilgach ikki muammo haqiqiy telefonda takrorlanadimi, rad va noto'g'ri imzo buzmaydimi — pilotda tekshiriladi; natija boshqacha chiqsa, 2, 5-ekran sahnalari, `MENTOR_YOZUV`, 4-ekran savoli va izohlari, arena, kartochkalar, qisqa takrorlash va Pro Once tavsifi haqiqiy natijaga moslanadi (✔ o'rni o'zgarmaydi); o'quv muvozanati uchun natija tanlanmaydi (12-Modul 9.37 a). Tekshirilmaguncha «muammo bor» — faqat «Mentor misolida» shaklida va shu ⛔ bilan.
     **Hech narsa ataylab buzilmaydi** (F-1007-463): `05-start` — agent 4-darsda yozgan kod; alohida «buzuq» tarmoq yoki fayl qilinmaydi. 4-dars talabi ikkala muammoni chaqirmaydi (yozuv va Pro bitta Database ishida; sahifaning kutishi — agentning tanlovi), shuning uchun pilotda ular chiqmasligi ham mumkin — unda Mentor misolida ham «buzilmadi» (bu ham natija).
   - **Mentor misolining buzish yozuvi** (bitta manba `MENTOR_YOZUV`; 2, 5-ekranlar, 2 va 3-amaliyot kutilgan natijasi, 3-amaliyot Yordami; Mentorning o'z matni, birinchi shaxsda — T-008; har urinish Pro yo'q holatdan):

   | Urinish | Nima qildim | Nima kutdim | Nima bo'ldi | Belgi | Tuzatishdan keyin |
   |---|---|---|---|---|---|
   | 1 · Ikki marta yuborish | Pro yo'q edi. «To'lovga o'tish» ni, keyin sahifada «Ikki marta yuborish» ni bosdim; javoblarga va Neon'dagi to'lovlar bilan Pro muddatiga qaradim. | Ikki javob: `200 { ok: true }` va `200 { takror: true }`; `tolovlar` da bitta qator; Pro 30 kunga yoqiladi. | Javoblar va `tolovlar` kutgandek, lekin Pro muddati 60 kun bo'ldi. | buzildi | tuzatish qilindi · qayta tekshiruvda takrorlanmadi |
   | 2 · Kechiktirib yuborish | Pro yo'q edi. «To'lovga o'tish» ni, keyin «Kechiktirib yuborish» ni bosdim; sahifaga qaradim, keyin ilovaga qaytib, undan chiqmay bir daqiqa kutdim. | Sahifa natijani kutadi; xabar kelgach ilovada Pro ko'rinadi. | Sahifa 10 soniyadan keyin «To'lov o'tmadi» dedi. Bir daqiqadan keyin Neon'da Pro yozildi, ilovada esa «Javob kutilmoqda» qoldi. | buzildi | tuzatish qilindi · qayta tekshiruvda takrorlanmadi |
   | 3 · Rad etish | «To'lovga o'tish» ni, keyin «Rad etish (mashq)» ni bosdim va ilovaga qaytdim. | Sahifada «To'lov o'tmadi»; `tolovlar` da «rad» qatori; Pro yo'q; ilovada «To'lov o'tmadi — qayta urinib ko'ring». | Sahifada «To'lov o'tmadi», `tolovlar` da «rad» qatori, Pro yo'q, ilovada «To'lov o'tmadi — qayta urinib ko'ring». | buzilmadi | — |
   | 4 · Noto'g'ri imzo | «To'lovga o'tish» ni, keyin «Noto'g'ri imzo» ni bosdim; sahifadagi javobga va Neon'ga qaradim. | Sahifada `401`; `tolovlar` da yangi qator yo'q; Pro yo'q. | Sahifada `401`, yangi qator yo'q, Pro yo'q. | buzilmadi | — |

   ⛔ Yozuv «qur» pilotida Mentor telefonida olinadi (yuqoridagi darvoza); har urinishdan oldin Mentor Pro'ni Neon'da bo'sh qiladi (A2 1-qadamdagi so'rov). «Neon'da Pro yozildi» — `pro_gacha` qatori.
   - **Qolgan holatlar — 1-amaliyot (tayanch 1.5 A1; Mentor misoli):** (1) rad etilgan to'lovdan keyin ilovada «To'lov o'tmadi — qayta urinib ko'ring» va «To'lovga o'tish» tugmasi · (2) natija hali kelmaganda ilovada «Javob kutilmoqda» ·
     (3) Pro muddati tugashi: Backend'da `pro` 4-darsdan muddatga qaraydi (`pro_gacha > now()`); bugun — ilova va «Doimiy o'yin»: «Har hafta takrorlansin» yana to'lov taklifi ekranini ochadi, yangi o'yin o'zi e'lon qilinmasligi kerak, e'lon qilingan o'yinlar qoladi; pul avtomatik yechilmaydi (tayanch 1.0; F-1007-463) ·
     (4) «Mashq to'lov» sahifasida ikki yangi tugma — «Kechiktirib yuborish», «Noto'g'ri imzo» (tayanch 3: `05-done` da bor; 2-amaliyotda kod yozilmaydi — tugmalar shu blokda; TAYANCHGA SAVOL 2).
     Ilova natijani `GET /men` dan biladi: Mentor talabida javobga oxirgi to'lov holati qo'shiladi — shu foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi `tolovlar` da `tolandi` · `rad`, hali yo'q — `kutilmoqda` (TAYANCHGA SAVOL 9). Mentor misolida ilova natijani ilovaga qaytganda so'raydi; ilova ochiq turganda qayta so'ramaydi — 2-muammo shu yerda ko'rinadi (TAYANCHGA SAVOL 1).
   - **Halol chegaralar (darsda ochiq aytiladi):** «yangi o'yin o'zi e'lon qilinmasligi» darsda tekshirilmaydi — buning uchun o'yin vaqti o'tishi kerak (A1 4-qadam qatori; 12-dars va'da qilinmaydi — T-038) ·
     «Kechiktirib yuborish» — uxlagan Backend'ning mashqi, aynan nusxasi emas (2-ekran QIzohi; F-1007-463) · test rejim — real to'lovning aynan nusxasi emas: haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi (3-dars 11-ekran; bu darsda O'qituvchi eslatmasida).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z; yangi atama yo'q — hammasi oldingi darslardan):**
   - **to'lov xabari** (texnik nomi webhook) · **to'lov taklifi ekrani** · **mashq to'lov** · **test rejim** · **takror xabar** · **rad etilgan to'lov** · **imzo** · **to'lov raqami** · **Pro** · **«Doimiy o'yin»** · **pullik obuna** (yolg'iz «obuna» yo'q) — tayanch 2, 3–4-darslardagi ma'nosida.
   - **buzish** · **buzish yozuvi** · **buzildi / buzilmadi** · **«Tuzatish qilindi»** · **«qayta tekshiruvda takrorlanmadi» / «qayta tekshiruvda yana buzildi»** · **da'vo** — 12-Modul 5-darsidagi ma'nosida; 2-ekranda bir gap bilan ko'prik (T-052): «12-Modulda ilovani uch usul bilan buzgansiz — bugun to'lov xabarini to'rt usul bilan».
   - **usul** — buzish usuli (to'rttasi: ikki marta yuborish · kechiktirib yuborish · rad etish · noto'g'ri imzo); **urinish** — bitta usulni bir marta bajarish va yozish.
   - **pullik qulaylik** — o'quvchi mahsulotida to'lov bilan ochiladigan narsa (Mentor misolida — Pro, «Doimiy o'yin»; tayanch 4 «o'z pullik qulayligi»). **Pro muddati** — `pro_gacha` (o'quvchi matnida «Pro muddati»).
   - **holat** — to'lov holati (`tolandi` · `rad` · `kutilmoqda`) va «qolgan holatlar» (bir ma'no: to'lov oqimidagi holat). **tekshirish · tekshiruv** — o'z ishini ko'rish; «sinov» bu darsda yo'q (platforma sarlavhasi «O'zingizni sinab ko'ring.» — o'zgarmaydi).
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **Neon SQL Editor** · **README** · **`BUZISH.md`**.
   - **Ishlatilmaydi:** server (prozada; istisno — «boshqa kompaniya serveri», tayanch 9.5), tranzaksiya (o'quvchi matnida — faqat Mentor Yordamida va REPO da), «tuzatildi» belgi sifatida (→ «Tuzatish qilindi»), «buzilgan»/«buzuq» sifat sifatida, hodisa, obuna (yolg'iz), callback, idempotentlik, sandbox, «test holati», «sinov», A1/A2/A3, `m11-05`, «Modul 13». «qiymat» — faqat «kalit qiymati» birikmasida (3-dars promptlari bilan bir; 4-darsdagi narx usuli bu darsda yo'q).
6. **Mentor misolidagi sonlar (tayanch 1.4, 1.5, 1.13, 6 — aynan):** narx **15 000 so'm / 30 kun — «Mentorning taxmini»** (har mashq sahifa maketida summa yonida kichik kulrang yorliq) · Pro **30 kun** (kutilgan) → **60 kun** (1-muammo) · kechiktirish **70 soniya** · sahifaning kutishi **10 soniya** (2-muammo sababi) ·
   Render bepul xizmati **15 daqiqa** so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa (tayanch 6; o'quvchi matnida «bir daqiqagacha» — 12-Modul 9.19). Namuna belgilar (son emas): to'lov raqamlari — `m-` + 12 tasodifiy belgi (4-dars, tayanch 9.7), maketda qisqartirilgan: `m-c41e…`, `m-9b07…` (TAYANCHGA SAVOL 10), Mentor hisobi `id` = 7.
   Boshqa son yo'q; statistika deyilmaydi (T-043); komissiya aytilmaydi; Mentor misolida Pro'ni test rejimda yoqqanlar soni yo'q (tayanch 1.13).
7. **Metafora yo'q. Keyssiz** (loyiha kuni, Qaror-0 21). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: tashkilotchi (Pro oladigan), o'yinchi. Payme, Click, Stripe bu darsda chizilmaydi (faqat O'qituvchi eslatmasida, tayanch 6 fakti).
8. **Xavfsizlik va pul chegarasi:** «buzish» — faqat **o'z mahsulotida**, faqat «Mashq to'lov» tugmalari bilan; boshqa odamning sayti, Backend'i yoki haqiqiy to'lov xizmati tekshirilmaydi, hujum usuli o'rgatilmaydi, ortiqcha so'rov bilan «bosish» yo'q (TAQIQLAR 3).
   Darsda uch marta ko'rinadi: 1-ekran Mentori, 2-ekran sahna ostidagi qator, 2-amaliyot 1-qadam (qalin). Karta ma'lumoti hech qayerda; `TOLOV_KALITI` qiymati agentga, chatga, `BUZISH.md` ga, skrinshotga yozilmaydi.
   Neon'dagi `UPDATE` — faqat o'z hisobi, faqat `WHERE id = …` bilan (har joyda qalin ogohlantirish: «`WHERE` siz yubormang — u hamma hisobni o'zgartiradi»).
9. **Kod — kim nima yozadi:** 1 va 3-amaliyotda kodni **agent** yozadi (talab — o'quvchidan); 2-amaliyotda **kod yozilmaydi** — o'quvchi tugmalarni bosadi, natijani o'zi yozadi, agent faqat `BUZISH.md` ga yozuvni ko'chiradi. Kod oynasi yo'q (loyiha kuni). NestJS va ilova kodi o'quvchi matnida yo'q — faqat sahnada tekshiruv qatorlari (`imzo` · `Pro +30 kun` · `raqam` · `yozuv`).
10. **Amaliyot bloki (tayanch 4 — 12-Modul modeli):** 4 qadam, hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab). 5-qadam yo'q.
    1 va 3-amaliyot: Ochish → Prompt → Ishga tushirish → Tekshirish. 2-amaliyot (kod yozilmaydi): Ochish → Buzish → Prompt (`BUZISH.md`) → Tekshirish (TAYANCHGA SAVOL 14).
    **Talab zinapoyasi:** 1-amaliyot — tayyor talab + 3 joy · 2-amaliyot — yozuv (o'quvchining o'z matni) va tayyor prompt · 3-amaliyot — tayyor talab + 2 joy (biri — buzish yozuvi, oldindan to'ldirilgan).
    **Blok — Mentor misoli, umumiy qolip emas (sinf 4):** o'quvchi mahsulotida Pro o'rnida o'z pullik qulayligi (4-darsda to'lov taklifi ekraniga qo'ygani); «Doimiy o'yin» bo'lmasa — muddat tugaganda nima to'xtashini o'zi yozadi (1-amaliyot `{…}`).
    Push odati — `git status` → `git add <fayl>` (`git add .` emas); xato — faqat xato qatori, `.env` dagi kalit va tokenlar yuborilmaydi (tayanch 3).
11. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, Backend tuguni, konvert, tekshiruv qatorlari, yozuv kartasi — CSS/SVG; «Maydon Jamoa» nomi telefon maketida va mashq sahifasi qatorida o'z rangida (11-Modul yashili); logotip yo'q.
    Rang — faqat holat foni (D3): yozildi / mos / «qayta tekshiruvda takrorlanmadi» — `ok` · `401` / «buzildi» / «To'lov o'tmadi» / Pro 60 kun — `err` · «buzilmadi» / «rad» qatori / «Javob kutilmoqda» — `ink2` · «Tuzatish qilindi» / joriy — `accent`.
12. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l (sinf 1):** taqsimot tepada. 1-amaliyotda Render kutishi paytida ish (kodni ko'rsatadigan prompt, SABOQ 52); 2-amaliyotda 70 soniyalik kutish paytida oldingi urinish yozuvi qayta o'qiladi; 3-amaliyotda Render kutishi paytida kodni ko'rsatadigan prompt.
    «Davom etish» — har blokda 3-qadamdan keyin ochiladi (SABOQ E 55); blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h). Render 1-amaliyotdan keyin hali tayyor bo'lmasa — 2-amaliyot 1 va 3-urinishdan boshlanadi (bu tugmalar 3-darsdan bor).
    Loyiha kunida «uyda» yo'q (12-Modul 9.41 h): ulgurmagan ish — yakun sarlavhasida (11-ekran, yetti holat). «Ortda qoldingizmi» — darsda bir marta, 1-amaliyotda (SABOQ 39). O'qituvchi eslatmasi — 1-ekranda va bloklarda.
13. **Texnik faktlar** — «Manbalar» bo'limida (tayanch 6 va o'zim tekshirganim, 07.10.2026); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0); tashkilotchi uchun Pro — «Doimiy o'yin». 3-darsda Backend to'lov xabarini qabul qildi, 4-darsda to'lov taklifi ekrani va Pro ulandi, agent «to'lov ishlaydi» dedi.
  Bugun Mentor to'lov oqimining qolgan holatlarini quradi, to'lovni to'rt usul bilan buzadi, ikki muammoni topadi, tuzattiradi va o'sha usul bilan qayta tekshiradi. O'quvchi xuddi shuni o'z mahsulotida qiladi (uch blok).
- **Hook:** bitta oddiy to'lov ishladi — Pro yoqildi → «endi to'lov ishlaydimi?» → 2-ekranda to'rt usul: ikki marta kelgan xabar Pro'ni 60 kunga uzaytiradi, kech kelgan xabarda sahifa «To'lov o'tmadi» deydi, Pro esa keyin yoqiladi → 1-amaliyot (qolgan holatlar va ikki tugma) → 4-ekran savoli →
  5-ekranda yozuv, «Tuzatish qilindi» va o'sha tugma bilan qayta tekshiruv → 2-amaliyot (o'z mahsulotida to'rt urinish) → 7-ekran savoli → 3-amaliyot (tuzatish va qayta tekshiruv).
- **Bitta vizual — «telefon · Backend» to'lov sahnasi** (3-dars `TOLOV_SAHNA` davomi, mashq holatida — 3-dars 11-ekran; bitta manba `TOLOV_SAHNA` + `MASHQ_SAHIFA` + `TOLOV_EKRANI` + `MENTOR_YOZUV`, 163/180; TAQIQLAR 6: «telefon (to'lov taklifi ekrani) ↔ brauzer (to'lov sahifasi) ↔ Backend; xabar konvert bo'lib uchadi»):
  - **chapda telefon** (ramka ≈170×272, o'lcham barqaror; yorliq ramka ustida «telefon»; ekran tepasida kichik yorliq «ilova» yoki «brauzer» — qaysi biri ochiqligi):
    **ilova** — to'lov taklifi ekrani (`TOLOV_EKRANI`, so'zma-so'z; narx yonida kulrang «Mentorning taxmini») · «E'lon berish» (belgi «Har hafta takrorlansin») · «To'lov o'tmadi — qayta urinib ko'ring» + «To'lovga o'tish» · «Javob kutilmoqda» (5-ekran 3-qadamidan ostida «Qayta tekshirish»);
    **brauzer** — «Mashq to'lov» sahifasi (`MASHQ_SAHIFA`): sarlavha · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 15 000 so'm» (nom o'z rangida, narx yonida «Mentorning taxmini») · ikki asosiy tugma «To'lash (mashq)» · «Rad etish (mashq)» ·
    ostida kichikroq qator «Tekshiruv tugmalari»: «Ikki marta yuborish» · «Imzosiz yuborish» · «Kechiktirib yuborish» · «Noto'g'ri imzo» · eng pastda javob qatori («To'landi (mashq)» · «To'lov o'tmadi» · «Javob kutilmoqda» · `401` · `200 { takror: true }`). **Karta maydoni hech bir holatda chizilmaydi.**
  - **o'ngda Backend tuguni** — ikki qism: **«Mashq to'lov»** (xabarni yasaydi va imzolaydi; «Kechiktirib yuborish» da ichida kichik soat «0 → 70 soniya») va **`POST /tolov/webhook`** — ichida to'rt tekshiruv qatori navbat bilan yonadi: «imzo» · «Pro +30 kun» (faqat `tolandi`) · «raqam: yangi / bor» · «yozuv»;
    ostida mini-jadval `tolovlar` (`tolov_raqami` · `holat`; hisoblagich «N qator») va qator **«Pro muddati: — / 30 kun / 60 kun»** (`pro_gacha`). 5-ekran 2-qadamidan keyin «Pro +30 kun» qatori «yozuv» bilan birga, takror tekshiruvidan keyinga ko'chadi.
  - **konvert:** so'rov (telefon brauzeri → «Mashq to'lov») · **to'lov xabari** («Mashq to'lov» → `POST /tolov/webhook`, Backend ichida; ochilsa — `tolovRaqami`, `holat`, `X-Imzo` qatorlari, mono; imzo noto'g'ri bo'lsa `X-Imzo` qatori qizil) · javob (`200 { ok: true }`, `200 { takror: true }`, `401` → brauzer) · `GET /men` (ilova ↔ Backend).
  - Holat ranglari — A-bo'lim 11. Son almashganda bir lahza kattalashib qaytadi; eski holat yonida kulrang yorliq «eski». `prefers-reduced-motion` da konvert yurmaydi, soat sakraydi — holatlar animatsiyasiz almashadi (DE-200).
  - Ishlatilishi: 0 (ilova → brauzer → ilova) · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (to'rt urinish) · 5 (+ yozuv kartasi va agent chati) · bloklar o'ng tomoni (kutilgan natija).
- **Yakun:** to'lov yo'lingiz to'rt usul bilan buzib tekshirilgan, yozuv `BUZISH.md` da, topilgani tuzatilib o'sha usul bilan qayta tekshirilgan · keyingi dars — «Pul haqida qanday gaplashasiz?».

---

## 0 · Kirish — bir to'lov ishladi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Bir marta to'landi — endi to'lov ishlaydimi?** (44)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida tashkilotchi Pro'ni yoqmoqchi — «To'lovga o'tish» ni bosing.
  - brauzer ochilgach: Endi mashq sahifasida «To'lash (mashq)» ni bosing.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket (chap): telefon — ilova, to'lov taklifi ekrani (`TOLOV_EKRANI`: «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «30 kun — 15 000 so'm» + kulrang «Mentorning taxmini» · «To'lovga o'tish» — halqada · kulrang «Test rejim: pul yechilmaydi»).
  O'ngda — Backend tuguni: «Pro muddati: —» · `tolovlar` · «N qator». Telefon ustida bitta chat pufagi (Antigravity, T-008): «Tayyor! To'lov ishlaydi: to'langach Pro yoqiladi.»
- **Harakat → Vizual o'zgarish:**
  1. «To'lovga o'tish» → telefon yorlig'i «ilova» → «brauzer»: «Mashq to'lov» sahifasi ochiladi (`MASHQ_SAHIFA`; «To'lash (mashq)» halqada, tekshiruv tugmalari kulrang — bu ekranda bosilmaydi).
  2. «To'lash (mashq)» → sahifada yashil qator «To'landi (mashq)» → Backend ichida konvert «Mashq to'lov» dan webhook'ka uchadi, to'rt qator navbat bilan yonadi → `tolovlar` ga «m-c41e… · tolandi» → «Pro muddati: 30 kun» →
     telefon yana «ilova»: «E'lon berish» ekranida «Har hafta takrorlansin» belgisi yoqiladi (to'lov taklifi ekrani ochilmaydi). Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz; har birining o'z yengil chegarasi — E 40):
  - Ha — bitta to'lov o'tdi, demak ishlaydi
  - ✔ Bilmayman — to'lov xabari kech kelsa-chi?
  - Ha — agent ham «to'lov ishlaydi» dedi
- Javob — 2-variant: **Aynan!** Bitta to'lov — bitta holat. To'lov xabari ikki marta, kech yoki noto'g'ri imzo bilan ham kelishi mumkin. (111)
- Javob — 1-variant: **Qiziq fikr!** Bu oddiy holat edi. Xabar ikki marta yoki kech kelsa ham shunday bo'ladimi — hali ko'rilmagan. (106)
- Javob — 3-variant: **Qiziq fikr!** Agentning «ishlaydi» degani — da'vo: kech yoki ikki marta kelgan xabar bilan hali tekshirilmagan. (109)
- Javobdan keyin: agent pufagi ostida kulrang yorliq «da'vo · tekshirilmagan» paydo bo'ladi. Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga; ✔ — faqat MD belgisi: qaysi javobga «Aynan!», ekranda belgi yo'q). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): agentning «to'lov ishlaydi» degani va bitta oddiy to'lov. Uchala variant — o'quvchining o'z ichki savoli yoki javobi (P-016); 1 va 3-variant hayotda tez-tez uchraydigan fikr — javobi ularni yolg'onga chiqarmaydi, «hali ko'rilmagan», «hali tekshirilmagan» deydi.
  Sahna Mentorning bugungi holatida (1-amaliyot bajarilgan — tekshiruv tugmalari ko'rinadi; TAYANCHGA SAVOL 13). «To'lov xabari» — darsda birinchi uchrashganda to'liq nomi bilan (2-variant va uning javobi).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun to'lov yo'lingizni buzasiz va tuzatasiz.** (46)
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Buzish faqat o'z mahsulotingizda — mashq to'lov tugmalari bilan.
- Chap — «Dars oxirida»: sahna **tayyor** holatda, bir marta o'zi yuradi (DE-200): telefon (ilova) uch kadr — «To'lov o'tmadi — qayta urinib ko'ring» → «Javob kutilmoqda» · «Qayta tekshirish» → «Har hafta takrorlansin» (yoqiq);
  yonida `BUZISH.md` · «To'lov» kartasi — to'rt qator: usul nomlari («Ikki marta yuborish» · «Kechiktirib yuborish» · «Rad etish» · «Noto'g'ri imzo») va belgi joyi (uzuq chiziqli, bo'sh — U-041: bugun to'ladigan joy; qaysi usul buzishi ochilmaydi — 2-ekran kashfiyoti).
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — loyiha kuni naqshi; so'zlar App.jsx `sub` bilan — P-015):
  - 01 · Test rejimdagi to'lov oqimining qolgan holatlari
  - 02 · To'lovni to'rt usul bilan buzish va yozib borish
  - 03 · Topilganini tuzatish va o'sha usul bilan qayta tekshirish
- Pastki qator (mono, kichik): o'z repo'ngiz — ilova, `backend/`, `BUZISH.md` «To'lov» · Mentor misoli `maydon-jamoa` · boshlang'ich holat `m13-dars-05-start` · namuna `m13-dars-05-done`
- Qator (`QIzoh`, pastki qator ostida, bitta): Mentor misolida `m13-dars-05-start` — agent «to'lov ishlaydi» degan kod: to'rt usul bilan hali tekshirilmagan. (110)
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: darsning og'ir qismlari — 1-amaliyot (Backend va ilova o'zgaradi, Render kutiladi) va 2-amaliyot (to'rt urinish, birida 70 soniya kutiladi). 2 va 5-ekranlarga ortiqcha vaqt bermang.
  **Pul chegarasi:** hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta ma'lumotini yozmaydi; mashq sahifasi karta so'ramaydi. «Buzish» — faqat o'quvchining o'z mahsulotida: sinfdoshining sayti yoki Backend'i, Payme, Click — tekshirilmaydi.
  Juftlikda ishlash qulay: biri telefonda tugmalarni bosadi, ikkinchisi Neon'da `tolovlar` va Pro muddatiga qaraydi — har kim baribir o'z mahsulotini buzadi.
✎ Mentorning birinchi gapi — blok modeli; ikkinchisi — xavfsizlik chegarasi (A-bo'lim 8). Reja sarlavhasi — natija va'dasi (P-014), yangi atama yo'q. `m13-dars-05-start` holati ochiq aytildi (MD_TOPSHIRIQ_2 5-band); «ikki muammo bor» — 2-ekranda «Mentor misolida» shaklida.

## 2 · To'rt usul  ← QTushuncha (bashorat + 4 qadam, bittadan)
- Eyebrow: Tushuncha · to'rt usul
- Sarlavha: **To'lov xabari kech yoki ikki marta kelsa-chi?** (45)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Mentor misolida agent «to'lov ishlaydi» degan — avval taxminingizni belgilang, keyin «Ikki marta yuborish» ni bosing.
  - 1-qadamdan keyin: Endi «Kechiktirib yuborish» ni bosing va ilovaga qarang.
  - 2-qadamdan keyin: Endi «Rad etish (mashq)» ni bosing.
  - 3-qadamdan keyin: Oxirgisi — «Noto'g'ri imzo» ni bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **To'rt usuldan nechtasi Mentor misolida to'lovni buzadi?** · Hech biri · Ikkitasi · To'rttalasi (S-015: bir o'lchov, o'sish tartibida)
- Sahna (`TOLOV_SAHNA`): telefon — brauzer, «Mashq to'lov» sahifasi (tekshiruv tugmalari faol, joriysi halqada) · Backend — «Mashq to'lov» va `POST /tolov/webhook` qismlari, `tolovlar`, «Pro muddati: —».
  Tepada qadam chiplari (tayyori ✓, joriysi accent): 1 Ikki marta · 2 Kechiktirib · 3 Rad · 4 Noto'g'ri imzo. Har urinish oldidan sahna o'zi boshlang'ich holatga qaytadi: kichik kulrang qator «Pro yo'q — yangi to'lov raqami».
- **Harakat → Vizual o'zgarish:**
  1. «Ikki marta yuborish» → Backend ichida ikki konvert `m-9b07…` ketma-ket uchadi. Birinchisi: «imzo ✓» → «Pro +30 kun» → «raqam: yangi» → «yozuv» → javob `200 { ok: true }`, «Pro muddati: 30 kun».
     Ikkinchisi: «imzo ✓» → «Pro +30 kun» (qizil yonadi) → «raqam: bor» → yozilmadi → javob `200 { takror: true }`; `tolovlar` · «1 qator», lekin «Pro muddati: 60 kun» (qizil, kattalashib qaytadi). Chip ostida: «buzildi — qator bitta, Pro ikki marta uzaydi».
     Nom qatori (bitta, ko'prik — T-052): 12-Modulda ilovani uch usul bilan buzgansiz — bugun to'lov xabarini to'rt usul bilan.
  2. «Kechiktirib yuborish» → «Mashq to'lov» ichida soat yuradi (sahnada bir necha soniyada «0 → 70 soniya»); «10 soniya» da brauzerda qizil «To'lov o'tmadi» → telefon «ilova»ga o'tadi: «Javob kutilmoqda» →
     «70 soniya» da konvert webhook'ka uchadi: «imzo ✓ → Pro +30 kun → raqam: yangi → yozuv» → «Pro muddati: 30 kun»; ilovada «Javob kutilmoqda» qoladi, yonida kulrang «eski». Chip ostida: «buzildi — sahifa «o'tmadi» dedi, Pro esa yoqildi».
  3. «Rad etish (mashq)» → brauzerda «To'lov o'tmadi» → konvert (`holat: 'rad'` qatori ajralib turadi): «imzo ✓» → «Pro +30 kun» kulrang (o'tkazib yuboriladi) → «raqam: yangi» → «yozuv» → `tolovlar` ga «… · rad»; «Pro muddati: —» →
     ilovada «To'lov o'tmadi — qayta urinib ko'ring». Chip ostida: «buzilmadi».
  4. «Noto'g'ri imzo» → konvert, `X-Imzo` qatori qizil → «imzo ✗» → javob `401` → yangi qator yo'q, «Pro muddati: —». Chip ostida: «buzilmadi».
- Natija qatori (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz ✕ — aslida: ikkitasi» yoki «Taxminingiz to'g'ri chiqdi ✓».
- Xulosa: Bu misolda oddiy to'lov ishlagan, lekin ikki marta va kech kelgan xabar to'lovni buzdi. (87)
- Qator (`QIzoh`, xulosa qutisining oxirgi kichik qatori): «Kechiktirib yuborish» — mashq, uxlashning nusxasi emas: haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi.
- Sahna ostidagi qator (kichik, doim ko'rinadi): Bu tugmalar faqat o'z Backend'ingizni chaqiradi — boshqa odamning sayti yoki xizmati tekshirilmaydi.
- Tugadi (199): qadam chiplari to'rt ixcham qatorga yig'iladi — «1 · Ikki marta yuborish · buzildi» · «2 · Kechiktirib yuborish · buzildi» · «3 · Rad etish · buzilmadi» · «4 · Noto'g'ri imzo · buzilmadi»; sahna (Backend tekshiruv qatorlari) fokusga; vizual ⛶ ichida (q17).
  Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/4) → Davom etish
✎ T-011: yangi atama yo'q — «buzish» 12-Modul so'zi, ko'prik nom qatorida. Sabab (Pro qatori takror tekshiruvidan oldin) sahnada Mentor kodining tartibi sifatida ko'rinadi — bu Mentor misolining fakti (tayanch 1.5), umumiy qoida emas; matnda sabab aytilmaydi, 4-ekran savoli so'raydi.
  Rad — «Pro +30 kun» qatori faqat `tolandi` uchun (A-bo'lim 4 jadvali: rad — buzilmadi). Natijalar — `MENTOR_YOZUV` (⛔ «qur» pilotida haqiqiy natija bilan almashadi). Har urinish yangi raqam bilan — tayanch 9.7 (sahna buni «yangi to'lov raqami» qatori bilan ko'rsatadi).
- O'qituvchi eslatmasi: haqiqiy to'lov xizmatlarida ham xabar ikki marta kelishi mumkin — Payme javob yo'qolsa xuddi shu so'rovni qayta yuboradi, uning test muhiti ba'zi so'rovlarni ataylab ikki marta yuboradi; Stripe — «bir xabar bir necha marta kelishi mumkin», xabarlar yaratilgan tartibda kelmasligi ham mumkin (tayanch 6). Darsda brend tilga olinmaydi (3-darsda ko'rilgan).

## 3 · Amaliyot 1 — qolgan holatlar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈25 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Mahsulotingizda to'lovning qolgan holatlari ko'rinsin.** (54)
- Mentor: Talab tayyor — uch joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
- Model (tayanch 4): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna. Talab zinapoyasi: tayyor talab + 3 joy. Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — blok tepasida «Mobil trek» · «Web-trek» tugmalari, tanlov shu kalitga yoziladi — 11-Modul 9.77).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz brauzerda ochiq tursin.
     4-darsdagi to'lov yo'li ishlab tursin: to'lov taklifi ekrani → to'lov tugmasi → «Mashq to'lov» sahifasi → pullik qulaylik yoqiladi. (`pm-m11d4-narx.ishlaydi` `true` bo'lmasa, shu joyda qo'shimcha qator: «4-darsda to'lov yo'li tekshirilmagan ko'rinadi — avval o'shani tugating, keyin shu qadamga qayting.»)
     Pullik qulaylik — 4-darsda to'lov taklifi ekraniga qo'yganingiz (Mentor misolida — Pro, «Doimiy o'yin»). Neon SQL Editor'da o'z hisob raqamingizni toping (3-darsdagidek):
     `SELECT id, pro_gacha FROM oyinchilar WHERE login = '{loginingiz}';` — jadval va ustun nomi mahsulotingizdagidek. Topa olmasangiz — agentga: «Foydalanuvchilar jadvalida {loginim} hisobining `id` sini va pullik qulaylik muddati qaysi ustunda turishini ayt. Hech narsani o'zgartirma.»
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring (mobil trek ko'rinishi; web-trek gapi pastda):
     > Qayerda: `backend/` — to'lov natijasi va «Mashq to'lov» sahifasi; `mobil/` — to'lov taklifi ekrani va {pullik qulaylik} ishlatiladigan ekran.
     > Nima qilsin: 1) To'lovdan ilovaga qaytganda ilova shu to'lovning natijasini Backend'dan so'rasin va ko'rsatsin: to'langan — {pullik qulaylik} yoqilgan (avvalgidek); rad etilgan — «To'lov o'tmadi — qayta urinib ko'ring» va to'lov tugmasi; natija hali yo'q — «Javob kutilmoqda».
     > 2) {pullik qulaylik} muddati tugaganda (Backend buni 4-darsdan biladi) ilova shunday ishlasin: {muddat tugaganda nima to'xtaydi va nima qoladi}. Pulni avtomatik yechadigan hech narsa qo'shma.
     > 3) «Mashq to'lov» sahifasiga ikki tugma qo'sh: «Kechiktirib yuborish» — xabarni 70 soniya kutib yuboradi; «Noto'g'ri imzo» — xabarni `TOLOV_KALITI` bilan emas, boshqa kalit bilan imzolaydi. Ikkalasining javobi ham boshqa tugmalardek sahifada ko'rinsin.
     > Nima buzilmasin: to'lov taklifi ekrani, to'lov tugmasi, sahifadagi eski tugmalar, `POST /tolov/webhook` dagi tekshiruvlar va {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {pullik qulaylik} — «masalan: Pro («Doimiy o'yin»)» (uch joyda bir xil — bitta qavs)
     - {muddat tugaganda nima to'xtaydi va nima qoladi} — «masalan: «Har hafta takrorlansin» yana to'lov taklifi ekranini ochsin, yangi o'yin o'zi e'lon qilinmasin; e'lon qilingan o'yinlar qolsin»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — «masalan: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar»
     Tekshiruv («Nusxalash» bosilganda, bloklaydi): bu joyda kamida ikkita ish vergul bilan bo'lmasa yoki «hammasi», «ilova» kabi bitta so'z bo'lsa — Ikkita aniq ish yozing: masalan, kirish, e'lon berish. (54) (F-1007-461 sinfi)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `backend/` — `GET /men` va «Mashq to'lov» sahifasi; `mobil/` — to'lov taklifi ekrani va «E'lon berish».
     > Nima qilsin: 1) `GET /men` javobiga oxirgi to'lov holatini qo'sh: shu foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi `tolovlar` da `tolandi` yoki `rad` bo'lsa — shu holat, `tolovlar` da hali yo'q bo'lsa — `kutilmoqda`. To'lovdan ilovaga qaytganda ilova `GET /men` ni so'rasin va ko'rsatsin: `tolandi` — Pro (avvalgidek); `rad` — «To'lov o'tmadi — qayta urinib ko'ring» va «To'lovga o'tish» tugmasi; `kutilmoqda` — «Javob kutilmoqda».
     > 2) Pro muddati tugaganda (`GET /men` da `pro` 4-darsdan yolg'on bo'ladi): «Har hafta takrorlansin» yana to'lov taklifi ekranini ochsin, yangi o'yin o'zi e'lon qilinmasin; e'lon qilingan o'yinlar qolsin. Pulni avtomatik yechadigan hech narsa qo'shma.
     > 3) «Mashq to'lov» sahifasiga ikki tugma qo'sh: «Kechiktirib yuborish» — xabarni 70 soniya kutib yuboradi; «Noto'g'ri imzo» — xabarni `TOLOV_KALITI` bilan emas, boshqa kalit bilan imzolaydi. Ikkalasining javobi ham boshqa tugmalardek sahifada ko'rinsin.
     > Nima buzilmasin: to'lov taklifi ekrani, «To'lovga o'tish», sahifadagi to'rtta eski tugma va `POST /tolov/webhook` dagi tekshiruvlar; kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar avvalgidek ishlasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, trek kalitidan o'zi almashadi): «Qayerda» — `prototip/` — to'lov taklifi ko'rinadigan sahifa; «To'lovdan ilovaga qaytganda» → «To'lov oynasidan saytga qaytganda»; Backend qismi ikkala trekda bir xil.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "tolov holatlari"`, `git push`.
     Render Backend'ning yangi versiyasini chiqaradi — tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agentdan uch joyni ko'rsatishni so'rang («Nusxalash» bilan; SABOQ 52):
     > Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: ilova to'lov natijasini so'raydigan qator, pullik qulaylik muddati tekshiriladigan qator va «Kechiktirib yuborish» xabarni kutadigan joy. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda `git push` dan keyin Netlify saytni odatda o'zi yangilaydi.
     Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` dagi kalit va tokenlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har gapini o'zingiz ko'ring (web-trekda — saytingizda, telefon brauzerida yoki kompyuterda). Mentor misolida:
     (1) **«Javob kutilmoqda»** — «To'lovga o'tish» → mashq sahifasi ochilgach hech narsa bosmang, ilovaga qayting: «Javob kutilmoqda» bo'lishi kerak. Bu — ilova; mashq sahifasi kech javobda nima deyishini 2-amaliyotda «Kechiktirib yuborish» bilan ko'rasiz.
     (2) **«To'lov o'tmadi»** — brauzerdagi o'sha sahifaga qayting, «Rad etish (mashq)» ni bosing va ilovaga qayting: «To'lov o'tmadi — qayta urinib ko'ring» va to'lov tugmasi bo'lishi kerak.
     (3) **Muddat tugashi** — «To'lovga o'tish» → «To'lash (mashq)» → ilovada Pro yoqilganini ko'ring. Keyin Neon SQL Editor'da Pro muddatini kechaga qo'ying («Nusxalash» bilan):
         `UPDATE oyinchilar SET pro_gacha = CURRENT_DATE - 1 WHERE id = {hisob raqami};` — **`WHERE` siz yubormang: u hamma hisobni o'zgartiradi.** Ilovani yopib oching: Pro yo'q — «Har hafta takrorlansin» yana to'lov taklifi ekranini ochadi; e'lon qilingan o'yinlar ro'yxatda qoladi.
         Yangi o'yin o'zi e'lon qilinmasligi darsda ko'rinmaydi — buning uchun o'yin vaqti o'tishi kerak. Agentning «bajardim» degani — da'vo; bu qismni bugun tekshirmaysiz.
     (4) **Ikki yangi tugma** — mashq sahifasida oltita tugma: «To'lash (mashq)» · «Rad etish (mashq)» · «Ikki marta yuborish» · «Imzosiz yuborish» · «Kechiktirib yuborish» · «Noto'g'ri imzo». Yangi ikkitasini hozir bosmang — ular 2-amaliyotda.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam bitta qatorga yig'iladi (✓), keyingisi ochiladi; o'ngdagi maket kadrlari bir marta o'zi yuradi; 4-qadamdan keyin yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; to'rt kadr bir marta o'zi yuradi): «Javob kutilmoqda» → «To'lov o'tmadi — qayta urinib ko'ring» + «To'lovga o'tish» → «Har hafta takrorlansin» bosilganda yana to'lov taklifi ekrani (Pro muddati tugagan) →
  brauzer: «Mashq to'lov» sahifasi — oltita tugma (yangi ikkitasi bir lahza accent chegarada). Ostida fayl kartasi: `backend/src/tolov/…` (o'zgardi) · `backend/src/men/…` (o'zgardi) · `mobil/src/…` to'lov taklifi ekrani (o'zgardi). Web-trekda: brauzer oynasi `….netlify.app`, fayl kartasida `prototip/`.
- Hammasi bajarilgach (yashil): Uch holat ko'rindi, ikki tugma sahifada — endi to'lovni ular bilan buzasiz. (75)
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-05-start` (4-darsdagi to'lov yo'li) yoki `git checkout -f m13-dars-05-done` (bugungi tayyor holat) —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz (`TOLOV_KALITI` ham).
- Ulgurmasangiz: Render kutishi cho'zilsa — 3-qadamdan keyin «Davom etish» ochiladi: 2-amaliyotni «Ikki marta yuborish» va «Rad etish (mashq)» dan boshlang (bu tugmalar 3-darsdan bor), keyin shu yerga qaytib 4-qadamni bajarasiz — blok shundan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: uch qavs — oldindan bo'sh, kulrang «masalan» (o'quvchi talabida Mentorning qarori yo'q — sinf 13); `pm-m11d2-model` o'qilmaydi (tayanch 8 da 5-dars o'quvchisi emas). `GET /men` ga holat qo'shish — faqat Mentor talabida; o'quvchi talabida «Backend'dan so'rasin» — usuli agentning tanloviga qoladi (sinf 5).
  (1) va (2) tekshiruvlar bitta raqam bilan: «hech narsa bosmasdan qaytish» — natija hali yo'q, keyin o'sha sahifada «rad». (3) — 11-Modul 11-darsidagi `UPDATE … WHERE id` odati; muddatni bo'sh qilish emas, kechaga qo'yish — «muddat tugadi» holati (TAYANCHGA SAVOL 4, 7).
  Agentning «tayyor» degani — da'vo (sinf 5); bu blokda o'quvchi uch holatni o'zi ko'radi; yangi tugmalarning ishini — 2-amaliyot.
- O'qituvchi eslatmasi: Pro muddati tugaganda yangi o'yin o'zi e'lon qilinmasligi — bir haftalik holat, darsda ko'rinmaydi (o'quvchiga «bugun tekshirmaysiz» deb aytilgan); va'da berilmaydi. `UPDATE` ni o'quvchi `WHERE` siz yubormasligiga qarang — bitta qatorga tegishi kerak (Neon «1 row affected» ko'rsatadi; ko'rsatmasa — qayta ko'ring).

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Ikki marta yuborildi: qator bitta, Pro esa 60 kun. Nega?**
  - Sahifa ikkinchi xabarga yangi raqam bergan
  - Ikkinchi xabar imzosiz kelib o'tib ketgan
  - ✔ Pro takror tekshiruvidan oldin uzaygan
  - Ilova Pro holatini ikki marta so'ragan
- Kalit: **C** (index 2). To'rttalasi «… -gan» shaklida, bitta turkumdan emas: raqam (A) · imzo (B) · tartib (C ✔) · ilova (D) — sinf 8. Savoldagi «60» javobda takrorlanmaydi (S-019).
- To'g'ri izohi: Bu misolda Pro qatori takror tekshiruvidan oldin ishlaydi — ikkinchi xabar ham Pro qo'shadi.
- Xato izohlari (≤60):
  - A: Raqam yangi bo'lsa, `tolovlar` da ikki qator bo'lardi. (54)
  - B: Imzosiz xabarga `401` — u hech narsa yozmaydi. (46)
  - D: Ilova faqat o'qiydi — Pro muddatini Backend yozadi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol tashkilotchi Pro'si haqida (sinf 8, o'quvchi nuqtai nazari); «bu misolda» — boshqa loyihada sabab boshqa bo'lishi mumkin (to'g'ri izoh shu misolning fakti). D — `GET /men` faqat o'qishini (tayanch 1.4) eslatadi.
  ⛔ Savol, to'g'ri va xato izohlari — Mentor misolidagi 1-muammodan; pilotda u takrorlanmasa, savol pilot natijasidan qayta yoziladi, ✔ o'rni C qoladi (A-bo'lim 4 ⛔; F-1007-463).

## 5 · Buzish yozuvi va qayta tekshiruv  ← QTushuncha (bashorat + 4 qadam)
- Eyebrow: Tushuncha · buzish yozuvi
- Sarlavha: **«Buzildi» yonida yashil belgi qachon chiqadi?** (45)
- Mentor (bosqichga qarab):
  - bashoratgacha: Avval taxminingizni belgilang, keyin «Solishtirish» ni bosing.
  - 1-qadamdan keyin: Endi yozuvni agentga bering — «Agentga yuborish» ni bosing.
  - 2-qadamdan keyin: Kod o'zgardi — endi «Qayta: kechiktirib yuborish» ni bosing.
  - ilovada «Javob kutilmoqda» chiqqach: Ilovadagi «Qayta tekshirish» ni bosing.
  - 3-qadamdan keyin: Oxirgisi — «Qayta: ikki marta yuborish» ni bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz; tanlangach ixcham qator): **Kech kelgan xabarda Pro oxiri yoqildi. Bu urinish buzildimi?** · Yo'q — Pro oxiri yoqildi, demak to'lov ishladi · Ha — foydalanuvchiga noto'g'ri holat ko'rsatildi
- Chap — telefon (ilova, «Javob kutilmoqda»). O'ng — buzish yozuvi kartasi (bittadan; `MENTOR_YOZUV` 2-qatori): «Kechiktirib yuborish» · uch qator yorlig'i «Nima qildim» · «Nima kutdim» · «Nima bo'ldi» (matni — A-bo'lim 4 jadvali) · belgi joyi bo'sh; ostida tugma «Solishtirish» (halqada);
  karta ustida kichik qator — boshqa uch urinish ixcham: «1 · Ikki marta yuborish · buzildi» · «3 · Rad etish · buzilmadi» · «4 · Noto'g'ri imzo · buzilmadi». Qadam belgilari: 1 Solishtiring · 2 Agentga bering · 3 Qayta: kechiktirib · 4 Qayta: ikki marta.
- **Harakat → Vizual o'zgarish:**
  1. «Solishtirish» → «Nima kutdim» va «Nima bo'ldi» qatorlaridagi mos kelmagan ikki joy navbat bilan qizil ostiga chiziladi: «Sahifa natijani kutadi» ↔ «10 soniyadan keyin «To'lov o'tmadi» dedi» · «ilovada Pro ko'rinadi» ↔ «ilovada esa «Javob kutilmoqda» qoldi» →
     belgi joyiga qizil «buzildi» tushadi; karta ixcham qatorga yig'iladi («2 · Kechiktirib yuborish · buzildi»).
     Nom qatori (bitta, ko'prik — T-052): Har urinishga uch qator — 12-Moduldagi buzish yozuvi: nima qildim, nima kutdim, nima bo'ldi.
  2. «Agentga yuborish» → yozuv ustida agent chati (Antigravity, ikki pufak — T-008): siz → «Yozuvim pastda: ikki urinish kutganimdek emas. Tuzat, har muammoning sababini bir gap bilan ayt.» ·
     Antigravity → «Tuzatdim: Pro endi yozuvdan keyin uzayadi; javob kelmasa sahifa «Javob kutilmoqda» deydi, ilovada «Qayta tekshirish» bor.» → 1 va 2-qator yonida belgi **«Tuzatish qilindi»** (accent); Backend'da «Pro +30 kun» qatori «yozuv» yoniga, takror tekshiruvidan keyinga ko'chadi.
     Nom qatori (bitta): «Tuzatish qilindi» — kod o'zgardi: bu ish fakti, natija emas.
  3. «Qayta: kechiktirib yuborish» → soat «0 → 70 soniya»; «10 soniya» da brauzerda «Javob kutilmoqda» (kulrang; «To'lov o'tmadi» emas) → ilovada «Javob kutilmoqda» ostida «Qayta tekshirish» (halqada) →
     konvert → «Pro muddati: 30 kun» → «Qayta tekshirish» bosiladi → `GET /men` konverti → ilovada «Har hafta takrorlansin» yoqiladi → 2-qator yonida yashil **«qayta tekshiruvda takrorlanmadi»**.
  4. «Qayta: ikki marta yuborish» → ikki konvert: birinchisi «imzo ✓ → raqam: yangi → yozuv · Pro +30 kun», ikkinchisi «imzo ✓ → raqam: bor» → yozilmadi, Pro qatori yonmaydi → «Pro muddati: 30 kun» → 1-qator yonida yashil **«qayta tekshiruvda takrorlanmadi»**.
- Natija qatori (xulosa qutisida — E 42): «Taxminingiz ✕ — aslida: ha, buzildi — kutilgani bo'lmadi» yoki «Taxminingiz to'g'ri chiqdi ✓».
- Xulosa: Bu misolda yashil belgi agentning javobidan keyin emas, o'sha tugma bilan qayta buzilmagandan keyin qo'yildi. (109)
- Qator (`QIzoh`, xulosa qutisining oxirgi kichik qatori): Qayta tekshiruvda yana buzilsa, belgi «qayta tekshiruvda yana buzildi» bo'ladi — yozuv agentga qayta beriladi.
- Tugadi (199): qadam belgilari va chat yopiladi, yozuv kartasi — to'rt ixcham qator yakuniy belgilari bilan — va telefon fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/4) → Davom etish
✎ Bashorat — darsning nozik joyi: Pro oxiri yoqildi, lekin «Nima kutdim» bo'lmadi (sahifa «o'tmadi» dedi, ilova eski qoldi) — demak «buzildi». «Yo'q» varianti rost tomoni bor (to'lov yozildi) — ballsiz, javob uni yolg'onga chiqarmaydi, kutish bilan solishtiradi.
  Sarlavha savoliga (yashil belgi qachon) 2–4-qadamlar javob beradi; bashorat — boshqa savol, 7-ekran testi — sarlavha savoli (ekran harakat bilan ko'rsatdi, test qoidani so'raydi).
  Sinf 5 (tayanch 7.5): «Tuzatish qilindi» (ish fakti) va «qayta tekshiruvda takrorlanmadi» (natija) — alohida belgi, alohida qadam; agent pufagi — da'vo. Tuzatish matnlari — tayanch 1.5 (2-muammo tuzatishi so'zma-so'z). «bitta tranzaksiyada» o'quvchi matnida yo'q (agent pufagida — «yozuvdan keyin»).
  Qayta tekshiruv tartibi — avval kech (bashorat urinishi), keyin ikki marta. Rad va noto'g'ri imzo qayta tekshirilmaydi — `qayta: null`.

## 6 · Amaliyot 2 — to'rt usul bilan buzing  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 2 · o'z mahsulotingiz
- Sarlavha: **Mahsulotingizda to'lovni to'rt usul bilan buzing.** (49)
- Mentor: Kod yozilmaydi: tugmani siz bosasiz, nima bo'lganini siz yozasiz; «1 · Ochish»dan boshlang.
- Model (tayanch 4): hamma qadam o'quvchining o'z mahsulotida; Mentor misoli — namuna (o'ngda kutilgan natija, «Yordam»da Mentor yozuvi). Qadamlar tartibi — Ochish → Buzish → Prompt → Tekshirish (kod yozilmaydigan blok; TAYANCHGA SAVOL 14). Ikkala trekda bir xil.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — ilovangiz telefonda ochiq (web-trekda — saytingiz brauzerda), Neon SQL Editor ochiq. Terminalda `git status`: o'zgargan fayl yo'q — bu blokda kod o'zgarmaydi; `.env` ro'yxatda yo'q.
     **Buzish faqat o'z mahsulotingizda, «Mashq to'lov» tugmalari bilan: boshqa odamning sayti, Backend'i yoki to'lov xizmati tekshirilmaydi.**
     Neon so'rovlari kartasi (har biri «Nusxalash» bilan; jadval va ustun nomi — mahsulotingizdagidek; `{hisob raqami}` — 1-amaliyotda topganingiz):
     - Pullik qulaylikni boshlang'ich holatga qaytarish: `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {hisob raqami};` — **`WHERE` siz yubormang.**
     - Muddat: `SELECT pro_gacha FROM oyinchilar WHERE id = {hisob raqami};`
     - Oxirgi to'lovlar: `SELECT tolov_raqami, holat, yaratilgan FROM tolovlar WHERE oyinchi_id = {hisob raqami} ORDER BY yaratilgan DESC LIMIT 3;`
     Har urinish oldidan ilovada pullik qulaylik yo'q bo'lsin: bo'lsa — birinchi so'rovni yuboring va ilovani yopib oching (to'lov tugmasi faqat shunda ko'rinadi).
  2. **Buzish** — to'rt urinish, bittadan. Tepada ixcham chiziq: 1 · 2 · 3 · 4 (joriysi accent, tayyori ✓; bosib tanlanadi). Bir vaqtda bitta yozuv kartasi (E 53) — yorliq input ichida (E 43):
     «1 · Nima qildim?» (oldindan yozilgan, tahrirlanadi) · kulrang qator «Talab bo'yicha: …» (o'zgarmaydi) · «2 · Nima kutdim? — talabdagidek: ekranda va Neon'da nima ko'rinishi kerak?» · «3 · Nima bo'ldi? — ko'rganingiz» · tugmalar **«Buzildi»** · **«Buzilmadi»** · o'ngda «Yordam».
     **«Nima kutdim» ni tugmani bosishdan oldin yozing** — keyin natija bilan solishtirsa bo'ladi; u bo'sh bo'lsa, «Nima bo'ldi» ochilmaydi.
     **«Buzildi»** — ko'rganingiz «Talab bo'yicha» qatoridan farq qilsa; mos kelsa — **«Buzilmadi»**.
     «Talab bo'yicha» qatorlari (3, 4-darslar va bugungi 1-amaliyot talabidan; web-trekda «ilovada» → «saytda»):
     (1) to'lov bir marta yoziladi, pullik qulaylik bir marta yoqiladi · (2) javob kelmaguncha «To'lov o'tmadi» deyilmaydi; xabar kelgach qulaylik ilovada ko'rinadi ·
     (3) qulaylik yoqilmaydi; ilovada «To'lov o'tmadi — qayta urinib ko'ring» · (4) `401`, yangi yozuv yo'q, qulaylik yoqilmaydi.
     (1) **Ikki marta yuborish** — to'lov tugmasi → sahifada «Ikki marta yuborish» → sahifadagi ikki javobni o'qing → Neon: oxirgi to'lovlar va muddat.
     (2) **Kechiktirib yuborish** — to'lov tugmasi → «Kechiktirib yuborish» → sahifaga 15 soniya qarang → ilovaga qayting va undan chiqmay bir daqiqa kuting (chiqib qaytsangiz, ilova natijani qayta so'raydi) → ilovaga va Neon'dagi muddatga qarang. Kutayotganda 1-urinish yozuvini qayta o'qing.
     (3) **Rad etish** — to'lov tugmasi → «Rad etish (mashq)» → ilovaga qayting → Neon: oxirgi to'lovlar va muddat.
     (4) **Noto'g'ri imzo** — to'lov tugmasi → «Noto'g'ri imzo» → sahifadagi javobni o'qing → Neon: oxirgi to'lovlar va muddat.
     «Nima bo'ldi» — ekranda ko'rganingiz, taxmin emas. Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` dagi kalit va tokenlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt. Kodni o'zgartirma.»
  3. **Prompt** — yozuvingiz pastdagi promptga o'zi qo'yilgan; o'qib chiqing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `BUZISH.md` ga «To'lov» bo'limini qo'sh: pastdagi yozuvimni so'zma-so'z ko'chir — har urinishning uch qatori va belgisi. Faylning boshqa bo'limlariga va boshqa fayllarga tegma. Fayl yo'q bo'lsa — repo ildizida yarat.
     > {to'liq yozuv}
     Yordam (ochiladigan) — Mentor misolidagi yozuv (A-bo'lim 4 jadvali, «Tuzatishdan keyin» ustunisiz), har urinish uch qator va belgi bilan.
  4. **Tekshirish** — `BUZISH.md` dagi «To'lov» bo'limini yozuvingiz bilan solishtiring: so'zlar bir xilmi, urinish tushib qolmaganmi. Farq bo'lsa — agentga: «Faqat `BUZISH.md` dagi «To'lov» bo'limini yozuvimdagidek qil.»
     `git status` — faqat `BUZISH.md` o'zgargan bo'lishi kerak; boshqa fayl ko'rinsa, uni `git add` qilmang va agentdan nega o'zgarganini so'rang. Keyin `git add BUZISH.md` → `git commit -m "tolovni buzish"` → `git push`.
- **Harakat → Vizual o'zgarish:** «Buzildi» / «Buzilmadi» → karta ixcham qatorga yig'ilib tepadagi chiziqqa tushadi («1 · Ikki marta yuborish · buzildi»; belgi rangi — A-bo'lim 11), keyingi karta ochiladi; to'rttasidan keyin 3-qadam ochiladi; 4-qadamdan keyin yashil yakun qatori.
- Shart xabari («Nima bo'ldi» ga o'tganda, ≤60): Avval «Nima kutdim» ni yozing, keyin tugmani bosing. (52)
- Shart xabari (belgi bosilganda, ≤60): «Nima bo'ldi» bo'sh — ko'rganingizni yozing. (44)
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Mentor buzish yozuvining to'rt kartasi (A-bo'lim 4 jadvali, «Tuzatishdan keyin» ustunisiz; «buzildi» — qizil, «buzilmadi» — kulrang); ostida fayl kartasi `BUZISH.md` · «To'lov» (yangi bo'lim) va terminal kartasi — `git status`: faqat `BUZISH.md`.
- Saqlanadi: `pm-m11d5-buzish.urinishlar[i]` — `qildim`, `kutdim` (kartadan chiqqanda), `boldi`, `buzildi` (tugma bosilganda; «Buzildi» → `true`, «Buzilmadi» → `false`).
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - kamida bitta «buzildi» — To'rt urinish yozildi: «buzildi» chiqqanlarini 3-amaliyotda tuzatasiz. (70)
  - hammasi «buzilmadi» — To'rt urinish yozildi: to'lov yo'lingiz buzilmadi — bu ham natija. (66)
- Ulgurmasangiz: vaqt tugayaptimi — yozilgan urinishlar bilan 3-qadamga o'ting («Davom etish» 3-qadamdan keyin ochiladi); qolgan urinish kartasi bo'sh qoladi va yakun sarlavhasi buni aytadi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon: Four Ways — 4-qadam «Bajardim»ida, to'rttala urinishda belgi bo'lsa (natijasidan qat'i nazar — tavsif qilingan ishni aytadi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: «Nima qildim» oldindan (`USULLAR`): ««{to'lov tugmasi}» ni, keyin sahifada «Ikki marta yuborish» ni bosdim; javoblarga va Neon'ga qaradim.» · «… keyin «Kechiktirib yuborish» ni bosdim; sahifaga qaradim, keyin ilovaga qaytib, undan chiqmay bir daqiqa kutdim.» ·
  «… keyin «Rad etish (mashq)» ni bosdim va ilovaga qaytdim.» · «… keyin «Noto'g'ri imzo» ni bosdim; sahifadagi javobga va Neon'ga qaradim.» — `{to'lov tugmasi}` ← `pm-m11d4-narx.ekran.tugma` (yo'q bo'lsa «To'lov tugmasi»); web-trekda «ilovaga» → «saytga». Tahrirlanadi.
  Tekshiruvni o'quvchi o'zi qiladi — agent faqat `BUZISH.md` ga ko'chiradi (sinf 10). «Buzildi» — o'quvchi «Nima bo'ldi» ni «Talab bo'yicha» qatori bilan solishtiradi: mezon — talab, taxmin emas (F-1007-463; `USULLAR[i].talab`, kalitga yozilmaydi). Neon `UPDATE` — o'z hisobi, `WHERE id` bilan (A-bo'lim 8; 11-Modul odati).
  `tolovlar` dagi qatorlar — mashq: bu kursda real to'lov yo'q, ularni o'chirish shart emas (3-dars A2 ✎ bilan bir).
- O'qituvchi eslatmasi: «Kechiktirib yuborish» da o'quvchi ilovadan chiqib qaytsa, ilova natijani qayta so'raydi va 2-muammo ko'rinmasligi mumkin — shuning uchun «undan chiqmay bir daqiqa kuting». Mentor misolida natijani shu yo'l bilan olgan (⛔ pilot).
  Bitta urinish bir nechta muammoni ko'rsatishi mumkin (kech: sahifa ham, ilova ham); muammo soni urinish soniga teng bo'lishi shart emas. «Buzilmadi» chiqqan o'quvchiga «ataylab buzing» deyilmaydi.
  «Nima kutdim» talabdan uzoq bo'lsa (masalan, «Pro 60 kun bo'ladi» deb yozsa) — «Talab bo'yicha» qatorini ko'rsating; hukm talab bo'yicha.

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Yozuvga «qayta tekshiruvda takrorlanmadi» ni qachon qo'yasiz?**
  - ✔ O'sha usul bilan qayta buzganda chiqmasa
  - Agent «tuzatdim» deb javob yozib qo'yganda
  - Kodda o'zgargan faylni ko'rib bo'lganingizda
  - Boshqa usul bilan qayta buzganda chiqmasa
- Kalit: **A** (index 0). To'rttalasi «… -ganda / -sa» shaklida (payt); turkumlar: o'sha usul (A ✔) · agent so'zi — da'vo (B) · kod o'zgarishi — «Tuzatish qilindi» (C) · boshqa usul (D) — sinf 8. «qayta buzganda» A va D da (shakl-telli yo'q).
- To'g'ri izohi: Natija o'sha usul bilan ko'rilgandagina yoziladi; agentning gapi — da'vo.
- Xato izohlari (≤60):
  - B: Agentning «tuzatdim» degani — da'vo, natija emas. (49)
  - C: Fayl o'zgargani — «Tuzatish qilindi» belgisi. (45)
  - D: Muammo qaysi usulda chiqqan edi? (32)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): 5-ekranda savol harakat bilan ko'rsatilgan (3, 4-qadam), lekin javob slayddan ko'chirib olinmaydi — ekran bashorati boshqa savol edi (§106). D — boshqa usulda chiqmagani o'sha muammoni ko'rsatmaydi (rost tomoni bor, lekin bu darsning qoidasiga zid — S-004).

## 8 · Amaliyot 3 — tuzating va qayta tekshiring  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq)
- Eyebrow: Amaliyot 3 · o'z repo'ngiz
- Sarlavha: **Topilganini tuzating va o'sha usul bilan qayta buzing.** (54)
- Mentor: Yozuvni agent oladi va kodni o'zgartiradi, to'g'riligini esa siz o'sha tugma bilan ko'rasiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi: tayyor talab + 2 joy (`{buzish yozuvi}` — oldindan to'ldirilgan; `{avvalgidek ishlashi kerak bo'lgan ishlar}` — 1-amaliyotda yozilgani bo'lsa oldindan, bo'lmasa bo'sh).
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — 2-amaliyotdagi yozuvingizning «buzildi» belgili urinishlari pastdagi talabga o'zi qo'yilgan — o'qib chiqing. Ilovangiz telefonda ochiq tursin (mobil trekda `npx expo start` ishlab tursin).
     Hech biri «buzildi» bo'lmasa — 2 va 3-qadamni o'tkazib yuboring: 4-qadamda yozuvingiz `BUZISH.md` da turganini ko'rasiz, boshqa ish yo'q.
  2. **Prompt** — qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.
     > Nima qilsin: pastdagi yozuvda «buzildi» belgili har urinishni tuzat: mahsulot «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
     > {buzish yozuvi}
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; `POST /tolov/webhook` dagi imzo va takror tekshiruvi, «Mashq to'lov» sahifasidagi oltita tugma qolsin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: {buzish yozuvi} — `pm-m11d5-buzish` dan oldindan yoziladi (faqat `buzildi: true`; har biri «N · usul. Nima qildim: … Nima kutdim: … Nima bo'ldi: …») · {avvalgidek ishlashi kerak bo'lgan ishlar} — kulrang «masalan: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar».
     Tekshiruv («Nusxalash» bosilganda, bloklaydi): bu joyda kamida ikkita ish vergul bilan bo'lmasa yoki «hammasi», «ilova» kabi bitta so'z bo'lsa — Ikkita aniq ish yozing: masalan, kirish, e'lon berish. (54) (F-1007-461 sinfi)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `backend/` — `POST /tolov/webhook` va «Mashq to'lov» sahifasi; `mobil/` — to'lov natijasi ko'rinadigan joy.
     > Nima qilsin: pastdagi yozuvda «buzildi» belgili ikki urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Pro faqat yangi yozilgan to'lovdan keyin uzaysin — yozuv va Pro bitta tranzaksiyada. Javob hali kelmagan bo'lsa, sahifa «To'lov o'tmadi» emas, «Javob kutilmoqda» desin; ilovada «Javob kutilmoqda» ostida «Qayta tekshirish» tugmasi bo'lsin — ilova qaytganda va shu tugma bosilganda `GET /men` ni qayta so'rasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
     > 1 · Ikki marta yuborish. Nima qildim: Pro yo'q edi. «To'lovga o'tish» ni, keyin sahifada «Ikki marta yuborish» ni bosdim; javoblarga va Neon'dagi to'lovlar bilan Pro muddatiga qaradim. Nima kutdim: Ikki javob: `200 { ok: true }` va `200 { takror: true }`; `tolovlar` da bitta qator; Pro 30 kunga yoqiladi. Nima bo'ldi: Javoblar va `tolovlar` kutgandek, lekin Pro muddati 60 kun bo'ldi.
     > 2 · Kechiktirib yuborish. Nima qildim: Pro yo'q edi. «To'lovga o'tish» ni, keyin «Kechiktirib yuborish» ni bosdim; sahifaga qaradim, keyin ilovaga qaytib, undan chiqmay bir daqiqa kutdim. Nima kutdim: Sahifa natijani kutadi; xabar kelgach ilovada Pro ko'rinadi. Nima bo'ldi: Sahifa 10 soniyadan keyin «To'lov o'tmadi» dedi. Bir daqiqadan keyin Neon'da Pro yozildi, ilovada esa «Javob kutilmoqda» qoldi.
     > Nima buzilmasin: kirish, e'lon berish, qo'shilish, real vaqt va eslatmalar avvalgidek ishlasin; `POST /tolov/webhook` dagi imzo va takror tekshiruvi, «Mashq to'lov» sahifasidagi oltita tugma qolsin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida): `mobil/` o'rnida `prototip/`; «ilova qaytganda» → «sayt oynasiga qaytganda».
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` → `git commit -m "tolov tuzatish"` → `git push`. Agent `backend/` ni o'zgartirgan bo'lsa — Render'da yangi versiya tugashini kuting.
     Kutayotganda agentga («Nusxalash» bilan; SABOQ 52):
     > O'zgarishingda har muammo uchun o'zgargan qatorni fayl nomi va qator raqami bilan ko'rsat va nega aynan shu joy ekanini bitta gap bilan ayt. Kodni o'zgartirma.
     Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa — o'sha urinishga **«Tuzatish qilindi»** ni belgilang: bu ish fakti — kodda o'zgartirish qilindi; to'g'riligini 4-qadam ko'rsatadi.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda Netlify saytni odatda o'zi yangilaydi. Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` dagi kalit va tokenlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Qayta tekshirish va GitHub** — «buzildi» belgili har urinishni **o'sha usul bilan** qaytaring (urinish oldidan pullik qulaylik yo'q bo'lsin — 2-amaliyotdagi birinchi so'rov). Tanlang: **«Qayta tekshiruvda takrorlanmadi»** · **«Qayta tekshiruvda yana buzildi»**.
     Yana buzilsa — agentga: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» va o'sha usulni yana bir marta qaytaring; yana buzilsa — yozuvda shunday qoladi.
     Keyin agentga: «`BUZISH.md` dagi «To'lov» bo'limiga har urinishning tuzatish va qayta tekshiruv natijasini qo'sh — yozuvimdan so'zma-so'z. Boshqa joyga tegma. {to'liq yozuv}»
     `BUZISH.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git status` → `git add BUZISH.md` va tuzatilgan fayllar (`git add .` emas) → `git commit -m "tolov qayta tekshiruvi"` → `git push`.
- **Harakat → Vizual o'zgarish:** «Tuzatish qilindi» → urinish qatori yonida accent belgi; «Qayta tekshiruvda takrorlanmadi» → yashil, «Qayta tekshiruvda yana buzildi» → qizil; 4-qadamdan keyin yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Mentor buzish yozuvi (to'rt karta, A-bo'lim 4 jadvali to'liq): 1 · buzildi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi · 2 · buzildi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi · 3 · buzilmadi · 4 · buzilmadi;
  ostida telefon — «Javob kutilmoqda» va «Qayta tekshirish» → Pro (bir marta o'zi yuradi); brauzer — sahifada «Javob kutilmoqda»; fayl kartasi: `backend/src/tolov/…` (o'zgardi) · `mobil/src/…` to'lov natijasi (o'zgardi) · `BUZISH.md` (o'zgardi).
- Saqlanadi: `pm-m11d5-buzish.urinishlar[i].tuzatishQilindi` (3-qadam), `.qayta` (4-qadam: «takrorlanmadi» → `'takrorlanmadi'`, «yana buzildi» → `'takrorlandi'`).
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - hammasi takrorlanmadi — Tuzatish qilindi va qayta tekshiruvda takrorlanmadi: natija `BUZISH.md` da. (75)
  - «yana buzildi» bor — Tuzatish qilindi, bitta urinish yana buzildi — bu ham `BUZISH.md` da. (69)
  - hech biri buzilmagan — Tuzatish kerak bo'lmadi: to'rt usul mahsulotingizni buzmadi. (60)
- Ulgurmasangiz: Render kutishi cho'zilsa — «Davom etish» 3-qadamdan keyin ochiladi; qayta tekshirilmagan urinish qatorida `BUZISH.md` da «qayta tekshiruv — hali yo'q» turadi va yakun sarlavhasi «qayta tekshirish qoldi» deydi.
- Nishon (bonus): Rechecked — 4-qadam «Bajardim»ida, kamida bitta urinishda qayta tekshiruv natijasi belgilangan bo'lsa.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tuzatishni agent qiladi, sababni u aytadi — o'quvchi sababni 2, 5-ekranlarda ko'rgan va agent javobi bilan solishtiradi (sinf 13). O'quvchi promptida «Qayerda» — yozuvdagi muammoga tegishli fayllar (12-Modul 9.37 e: muammo qayerda bo'lsa, o'sha joy o'zgaradi); Mentor Yordamida aniq joy va tuzatish yo'nalishi — Mentorning qarori.
  «bitta tranzaksiyada» — faqat shu Yordamda (agent uchun; tayanch 2). «Tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» — ikki alohida tugma, ikki alohida qadam (sinf 5). «Yana bir marta» dan keyin to'xtash — loyiha kunida «uyda» yo'q (12-Modul 9.41 h).
- O'qituvchi eslatmasi: «bitta tranzaksiyada» — 11-Modul 14-darsidagi Database tranzaksiyasi (o'quvchi so'rasa: «yozuv va Pro birga yoziladi — biri o'tmasa, ikkalasi ham yozilmaydi»). Bu so'z 2-darsdagi model nomi bilan aralashmasin — o'quvchiga izohlamang, agar so'ramasa.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Pro ikki marta uzaydi» · 7 — «2 — Qayta tekshiruv belgisi»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (172; SABOQ E 50 standarti)
- Yorliqlar (tepada): ✓ `BUZISH.md` «To'lov» tayyor (faqat 2-amaliyot 4-qadami bajarilgan bo'lsa; aks holda yorliq yo'q) · {N}/2 to'g'ri
- Sarlavha (holatga qarab, P-046; sinf 6 — o'quvchi qilgan ishni aytadi, har holat rost — E 54):
  - 3-amaliyot bajarilgan, har «Tuzatish qilindi» urinish «takrorlanmadi» — **Tuzatish qilindi va qayta tekshiruvda takrorlanmadi.** (52)
  - 2-amaliyot bajarilgan, to'rttalasi «buzilmadi» — **To'rt usul bajarildi — to'lov yo'lingiz buzilmadi.** (50)
  - «Tuzatish qilindi» bor, qayta tekshiruv to'liq emas yoki «yana buzildi» bor — **Tuzatish qilindi — qayta tekshirish qoldi.** (42)
  - 2-amaliyot bajarilgan, «buzildi» bor, «Tuzatish qilindi» yo'q — **Urinishlar yozildi — tuzatish qoldi.** (36)
  - 2-amaliyot boshlangan, bajarilmagan — **To'lovni buzish hali tugamagan.** (31)
  - 2-amaliyot boshlanmagan, 1-amaliyot bajarilgan — **Qolgan holatlar tekshirildi — buzish qoldi.** (43)
  - hech biri — **To'lov yo'li bugun hali tekshirilmagan.** (39)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5; asosiy fikr bu yerda takrorlanmaydi — T-048):
  - Agentning «to'lov ishlaydi» degani — da'vo: to'lovni o'zingiz to'rt usul bilan buzib ko'rasiz.
  - To'lov xabari ikki marta kelsa ham, to'lov bir marta yozilishi va Pro bir marta uzayishi kerak.
  - Javob kechiksa, sahifa «To'lov o'tmadi» emas, «Javob kutilmoqda» deyishi kerak.
  - Rad etish va noto'g'ri imzo ham tekshiriladi — «buzilmadi» ham natija.
  - «Tuzatish qilindi» — kod o'zgargani; yashil belgi — o'sha usul bilan qayta buzilmagani.
- Uyga vazifa — yo'q (tayanch 4: loyiha kuni; ish repo'da — uch blok o'z mahsulotingizda).
- Keyingi dars — «Pul haqida qanday gaplashasiz?»
- Nishonlaringiz — N/4 (pastda; mentor rejimida yo'q)
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): sarlavha o'quvchi ishini aytadi, Mentor natijasini emas; blok bajarilgani — faqat 4-qadam «Bajardim»idan (ccProgress), urinish holati — `pm-m11d5-buzish` dan. Birinchi holat faqat kamida bitta «Tuzatish qilindi» bo'lsa (aks holda — ikkinchi holat).
  «Keyingi dars» qatori — `00-NOMLAR.md` 6-qator, so'zma-so'z, quyruqsiz (T-038; tayanch 7 «RAD etilganlar»).

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami; §184: qilingan ishni aytadi)
- **Pro Once** — Ikki marta kelgan xabar Pro'ni nega ikki marta uzaytirganini topdingiz (4-ekran, 1-savol)
- **Same Button** — Qayta tekshiruv belgisi qachon qo'yilishini topdingiz (7-ekran, 2-savol)
- **Four Ways** — To'lovni to'rt usul bilan buzib, har urinishni yozdingiz (6-ekran, 2-amaliyot 4-qadam «Bajardim»; ish bajarilgan — P-048)
- **Rechecked** — Tuzatishni o'sha usul bilan qayta tekshirdingiz (8-ekran, 3-amaliyot 4-qadam «Bajardim», kamida bitta `qayta` bilan) — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 07.10: Pro Once · Same Button · Four Ways · Rechecked — 0).

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: koddan bitta qator yoki raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Pro bir marta uzayishi kerak»
   - `imzo` · Xabar to'lov xizmatidan kelganini tekshiradi.
   - `Pro +30 kun` · Mentor misolida bu qator takror tekshiruvidan oldin turgan edi.
   - `raqam: bor` · Ikkinchi xabar yozilmadi, lekin Pro ikkinchi marta uzaydi.
   - Sinfga savol: Shu kodda xabar uch marta kelsa, Pro muddati necha kun bo'lardi?
2. 2-savol (7-ekran) — «Tuzatish qilindi va qayta tekshiruv»
   - 1 · Agent «tuzatdim» dedi — bu da'vo.
   - 2 · Kod o'zgardi — «Tuzatish qilindi».
   - 3 · O'sha usul bilan qayta buzildi, muammo chiqmadi — «qayta tekshiruvda takrorlanmadi».
   - Sinfga savol: Kech kelgan xabarni «Ikki marta yuborish» bilan qayta tekshirsangiz, nima bilib olasiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Agentning «to'lov ishlaydi» degani nima? | Da'vo — hali tekshirilmagan gap | Natijani o'zingiz buzib ko'rib bilasiz |
| Bu darsdagi to'rt buzish usuli qaysilar? | Ikki marta yuborish, kechiktirib yuborish, rad etish, noto'g'ri imzo | Faqat o'z mahsulotingizda, mashq to'lov tugmalari bilan |
| «Kechiktirib yuborish» nima qiladi? | Xabarni 70 soniya kutib yuboradi | Mashq, uxlashning nusxasi emas: haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi |
| «Noto'g'ri imzo» bilan kelgan xabarga Backend nima qaytaradi? | `401` — hech narsa yozilmaydi | 3-darsdagi imzo tekshiruvi shu holatni ushlaydi |
| Mentor misolida ikki marta kelgan xabar nimani buzdi? | Pro muddatini: u 60 kun bo'ldi | `tolovlar` da qator bitta edi — takror tekshiruvi ishlagan |
| Bitta to'lov Pro'ni necha marta uzaytirishi kerak? | Bir marta — faqat yangi yozilgan to'lovdan keyin | Takror xabarga ham `200` qaytadi, lekin ikkinchi Pro yo'q |
| Javob hali kelmagan bo'lsa, mashq sahifasi nima deyishi kerak? | «Javob kutilmoqda» | «To'lov o'tmadi» — faqat holat «rad» bo'lganda |
| Mentor misolida tuzatishdan keyin ilova Pro holatini qachon qayta so'raydi? | Ilovaga qaytganda va «Qayta tekshirish» bosilganda | So'rov — `GET /men` |
| Rad etilgan to'lovdan keyin Mentor ilovasi nima ko'rsatadi? | «To'lov o'tmadi — qayta urinib ko'ring» | `tolovlar` da «rad» qatori bor, Pro o'zgarmaydi |
| Mentor talabida Pro muddati tugasa nima bo'ladi? | Pro o'zi o'chadi, pul avtomatik yechilmaydi | E'lon qilingan o'yinlar qoladi |
| «Nima kutdim» qatori qachon yoziladi? | Tugmani bosishdan oldin | Shunda natija bilan solishtirsa bo'ladi |
| «Tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» qanday farq qiladi? | Birinchisi — kod o'zgargani, ikkinchisi — o'sha usul bilan qayta buzilmagani | Ikkalasi alohida belgi, alohida qadam |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Agent «to'lov ishlaydi» dedi. Bu nima? ✔ Hali tekshirilmagan da'vo · Kod yozilganining isboti · Pro yoqilganining dalili · To'rt usuldan o'tgan natija
2. «Kechiktirib yuborish» tugmasi nimaning mashqi? Ikki marta kelgan xabarning · ✔ Uxlab qolgan Backend'ning · Soxta imzoli begona xabarning · Rad etilgan to'lov xabarining
3. To'lovni qayerda va nima bilan buzib tekshirasiz? Sinfdoshingiz saytida, mashq tugmasi bilan · Haqiqiy to'lov sahifasida, kartangiz bilan · ✔ O'z mahsulotingizda, mashq tugmasi bilan · O'z mahsulotingizda, haqiqiy pul bilan
4. Imzosi noto'g'ri xabar keldi. Backend nima qilishi kerak? `200` qaytarib, to'lovni yozib qo'yadi · `200` qaytarib, faqat Pro'ni yoqadi · `401` qaytarib, lekin Pro'ni yoqadi · ✔ `401` qaytarib, hech narsa yozmaydi
5. To'lov rad etildi. Pro nima bo'lishi kerak? ✔ O'zgarmaydi, yoqilmaydi · 30 kunga baribir yoqiladi · Faqat bir kunga yoqiladi · Yarim muddatga yoqiladi
6. Mentor misolida ikki marta kelgan xabar nimani buzdi? `tolovlar` da ikki qator bo'ldi · ✔ Pro muddati ikki marta uzaydi · Imzo tekshiruvidan o'tmadi · Ilova Pro'ni ko'rsatmay qo'ydi
7. Javob 10 soniyada kelmadi. Sahifa nima deyishi kerak? «To'lov o'tmadi» deyishi · «To'landi (mashq)» deyishi · ✔ «Javob kutilmoqda» deyishi · Hech narsa demasligi kerak
8. Mentor talabida ilova Pro holatini qachon qayta so'raydi? Faqat ilova birinchi ochilganda · Har soniyada, to'xtamasdan · Faqat to'lov rad etilganda · ✔ Qaytganda va tugma bosilganda
9. «Nima kutdim» qatori qachon yoziladi? ✔ Tugmani bosishdan oldin · Natija ko'ringandan keyin · Agent tuzatgandan keyin · Dars oxirida, birdaniga
10. «Tuzatish qilindi» belgisi nimani aytadi? Muammo endi takrorlanmasligini · ✔ Kodda o'zgartirish qilinganini · Agent yozuvni o'qib chiqqanini · Urinish umuman buzilmaganini
11. Pro muddati tugadi. E'lon qilingan o'yinlar nima bo'ladi? O'chib ketadi, Pro bilan birga · Pro qaytguncha yashirinadi · ✔ Ro'yxatda qoladi, o'chmaydi · Keyingi haftaga o'zi ko'chadi
12. Kech urinishda Mentor Pro yoqilganini qayerdan ko'rdi? Ilovada, ekran o'zi yangilanib · Sahifada, «To'landi» yozuvidan · Agentning chatdagi javobidan · ✔ Neon'da, Pro muddati qatoridan

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
- 3-savol: distraktorlar uch xil qoidani buzadi — boshqa odamning mahsuloti (TAQIQLAR 3) · haqiqiy to'lov sahifasi va karta (brendsiz — F-1007-463) · haqiqiy pul (TAQIQLAR 1) — sinf 8; to'g'ri variant «faqat» so'zisiz.
- 8-savol: «Mentor talabida» — 3-amaliyotdagi tuzatishdan keyingi holat (tayanch 1.5); ✔ «tugma» — «Qayta tekshirish» (5-ekranda ko'rsatilgan nom).
- 11-savol: Mentor talabining qoidasi (tayanch 1.5 A1) — 1-amaliyotda ko'rinadi; yangi o'yin o'zi e'lon qilinmasligi so'ralmaydi (darsda tekshirilmaydi).
- 12-savol: A-bo'lim 4 jadvali (kech — «Neon'da Pro yozildi»); distraktorlar uch xil: ilova (eski qoldi) · sahifa («o'tmadi» dedi) · agent so'zi (da'vo).
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): to'lov xabari · mashq to'lov · Ikki marta yuborish · Kechiktirib yuborish · Noto'g'ri imzo · `401` · `pro_gacha` · `tolovlar` · Javob kutilmoqda · buzish yozuvi · Tuzatish qilindi · `BUZISH.md` · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice(blok) · test · concept · practice(blok) · test · practice(blok) · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **2 (C)** · s7 **0 (A)**; uch blok — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m11-05-v1`, `lessonTitle` — «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz».
2. **Bitta manba (180):** `TOLOV_SAHNA` (3-dars sahnasi nusxasi, mashq holati: telefon — `ilova` / `brauzer`; Backend — «Mashq to'lov» va webhook qismlari, tekshiruv qatorlari, `tolovlar`, Pro muddati, soat) · `TOLOV_EKRANI` (tayanch 1.4 matni) ·
   `MASHQ_SAHIFA` (sarlavha, test qatori, mahsulot qatori + summa + yorliq, olti tugma, javob qatorlari) · `ILOVA_HOLATLAR` («To'lov o'tmadi — qayta urinib ko'ring», «Javob kutilmoqda», «Qayta tekshirish») · `USULLAR` (kalit `ikki` · `kech` · `rad` · `imzo`, tugma nomi, «Nima qildim» shabloni, «Talab bo'yicha» qatori — F-1007-463) ·
   `MENTOR_YOZUV` (A-bo'lim 4 jadvali) · `NEON_SOROVLAR` (uch so'rov va `UPDATE … CURRENT_DATE - 1`) — 0–2, 5-ekranlar, bloklar, kartochka va arena shundan o'qiydi.
3. **`TolovSahna`** komponenti (3-dars `TolovSahna` ko'rinishi; nusxa, import emas — darslar mustaqil): chapda telefon (≈170×272 — SABOQ 22; yorliq ramka ustida — SABOQ 23), o'ngda Backend tuguni (ikki qism + jadval + Pro qatori).
   Propslar: `telefon` (`ilova` · `brauzer`), `ilovaEkran` (`taklif` · `elon` · `otmadi` · `kutilmoqda` · `kutilmoqdaTugma`), `sahifaJavob` (`null` · `tolandi` · `otmadi` · `kutilmoqda` · `401` · `takror`), `tekshiruvlar` (to'rt qator holati), `proQator` (`'—'` · `30` · `60`; tartib: `oldin` · `keyin`), `soat` (0–70), `konvertlar`, `eski` (bool).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: pd-otish pd-tolash pd-ikki pd-kech pd-rad pd-imzo pd-solishtir pd-agent pd-qayta pd-qtekshir`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4). **Karta maydoni hech bir holatda chizilmaydi.**
4. **0-ekran:** ikki harakat («To'lovga o'tish» → brauzer; «To'lash (mashq)» → konvert, Pro 30 kun, ilova «Har hafta takrorlansin» yoqiq); variantlar shundan keyin faol; javobdan keyin agent pufagi ostida «da'vo · tekshirilmagan».
5. **2-ekran:** to'rt qadam navbat bilan (qulf); har qadam oldidan sahna boshlang'ich holatga qaytadi («Pro yo'q — yangi to'lov raqami»); tekshiruv qatorlari ketma-ket yonadi (Mentor kodi tartibi: imzo → Pro (faqat `tolandi`) → raqam → yozuv);
   kech qadamida soat sahnada ≈4 s da 70 ga yetadi, «10 soniya» da sahifa javobi `otmadi`, telefon `ilova` → `kutilmoqda` + `eski`; natija chiplari `MENTOR_YOZUV[i].belgi` dan.
6. **5-ekran:** yozuv kartasi (bittadan; «Solishtirish» → «Nima kutdim» va «Nima bo'ldi» dagi mos kelmagan ikki bo'lak navbat bilan qizil ostiga chiziladi (bo'laklar `MENTOR_YOZUV[1].farq` da), keyin belgi `MENTOR_YOZUV[1].belgi`); chat (ikki pufak, T-008); `proQator.tartib` `oldin` → `keyin`; qayta urinishlar: kech — `sahifaJavob: 'kutilmoqda'`, ilova `kutilmoqdaTugma` → «Qayta tekshirish» (halqa) → `GET /men` konverti → `elon` (yoqiq); ikki marta — Pro 30.
7. **Amaliyot bloklari** — `ScreenBlok` (skeletdagi ulagich) + `QBlok` + `QPrompt` (`{…}` joylari). Har blok **4 qadam**; 5-qadam yo'q. «Davom etish» — 3-qadamdan keyin (E 55); blok bayrog'i — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h).
   - 1-amaliyot: `{pullik qulaylik}` (bitta qavs, uch joyda), `{muddat tugaganda nima to'xtaydi va nima qoladi}`, `{avvalgidek ishlashi kerak bo'lgan ishlar}` — bo'sh, kulrang «masalan»; 1-qadamdagi qo'shimcha qator — `pm-m11d4-narx.ishlaydi !== true` da.
     4-qadamdagi SQL va (2-amaliyotda) `NEON_SOROVLAR` — «Nusxalash» bilan, `{hisob raqami}` — o'quvchi o'zi qo'yadi (kalitga yozilmaydi). «Ortda qoldingizmi» — faqat shu blokda (SABOQ 39), ikki teg.
   - 2-amaliyot: **`BuzishYozuvi`** komponenti (12-Modul 5-dars `BuzishYozuvi` ko'rinishi; nusxa): to'rt karta, bittadan, ixcham chiziq 1–4 (bosib tanlanadi); maydonlar — yorliq input ichida (E 43); «Nima qildim» ostida kulrang «Talab bo'yicha: …» (`USULLAR[i].talab`); «Nima kutdim» bo'sh bo'lsa «Nima bo'ldi» va belgi tugmalari qulf (shart xabari);
     `qildim` oldindan `USULLAR[i].qildim` (`{to'lov tugmasi}` ← `pm-m11d4-narx.ekran.tugma`; trekka qarab «ilovaga» / «saytga»); saqlash — maydondan chiqqanda va tugma bosilganda; birinchi saqlashda to'rtta yozuv yaratiladi (A-bo'lim 1).
     3-qadam prompti: `{to'liq yozuv}` ← `pm-m11d5-buzish` (to'rtala urinish: «N · usul. Nima qildim: … Nima kutdim: … Nima bo'ldi: … Belgi: …»).
   - 3-amaliyot: `{buzish yozuvi}` ← `pm-m11d5-buzish` (faqat `buzildi: true`); `{avvalgidek ishlashi kerak bo'lgan ishlar}` ← 1-amaliyot qoralamasi (dars ichidagi holat, kalitga yozilmaydi) yoki bo'sh; har «buzildi» urinish qatori: «Tuzatish qilindi» (3-qadam) va «Qayta tekshiruvda takrorlanmadi» / «Qayta tekshiruvda yana buzildi» (4-qadam) — ikki alohida tugma.
     Hech biri `buzildi: true` bo'lmasa — 2, 3-qadam yopiq, 4-qadam matni «yozuvingiz `BUZISH.md` da» (yakun 2-holati).
   - Trek qatorlari (`mobil/` · `prototip/`, «ilovaga» · «saytga», Expo Go `r` · Netlify) — `pm-m9d8-platforma.trek` dan; kalit yo'q bo'lsa — blok tepasida trek tugmalari (11-Modul 9.77).
   - ⚠️ Qolipda yo'q (12-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat (kalitdan), qadam ichidagi «Yordam», yozuv kartasi, Neon so'rovlari kartasi, «Ulgurmasangiz» qatori, «O'qituvchi eslatmasi» (o'quvchi yuzasida yo'q) — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
8. `RECAPS` 2 (kalit = 4, 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 4 → Pro Once, 7 → Same Button, 2-amaliyot 4-qadam «Bajardim» (to'rtala `buzildi !== null`) → Four Ways, 3-amaliyot 4-qadam «Bajardim» (kamida bitta `qayta !== null`) → Rechecked) ·
   `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) · `HW_TOKENS` / fon so'zlari {uz, ru}.
9. **11-ekran `QYakun`:** sarlavha (yetti holat) va ✓ yorlig'i — blok bayroqlari (ccProgress) va `pm-m11d5-buzish` dan; `uyga` yo'q; `recap` 5 qator; `keyingi` — «Pul haqida qanday gaplashasiz?».
10. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). Yakunda «Bugungi asosiy fikr» yo'q (E 50).
11. **Darvozalar:** `npm run gates -- src/11-Modull/PaymentDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.
12. App.jsx `m11-05` qatoriga `comp: PaymentDayLesson` — «qur» bosqichida (asosiy seans, aniq Edit). ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-05-start` = `m13-dars-04-done` → `m13-dars-05-done`, tayanch 3)
1. **`m13-dars-05-start`** (= `04-done` — agent 4-darsda yozgan kod, **ataylab buzilmaydi**, alohida «buzuq» tarmoq yo'q — F-1007-463; `README.md` eslatmasi pilotdan keyin, topilgan muammolar soni bilan: «Bu holatda N muammo bor — 5-darsda topiladi.»; topilmasa — eslatma yo'q). MD yozilgan taxmin — pilotda tekshiriladi (TAYANCHGA SAVOL 11, Shubhali 2):
   (a) `POST /tolov/webhook` da Pro uzaytirish (`holat = 'tolandi'` bo'lsa, `pro_gacha` = max(`pro_gacha`, bugun) + 30 kun) **takror tekshiruvidan oldin** turadi; (b) mashq sahifasi javobni 10 soniya kutadi, kelmasa «To'lov o'tmadi» yozadi; (c) ilova to'lovdan qaytganda `GET /men` ni bir marta so'raydi.
2. **5-dars 1-amaliyot (Mentor talabi natijasi; oraliq holat, teg yo'q):** `GET /men` javobiga `oxirgiTolov` — `{ tolovRaqami, holat: 'tolandi' | 'rad' | 'kutilmoqda' }` (shu foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi → `tolovlar` dagi holati, yo'q — `kutilmoqda`; F-1007-463) ·
   ilovada «To'lov o'tmadi — qayta urinib ko'ring» + «To'lovga o'tish» va «Javob kutilmoqda» (qaytganda bir marta so'raydi) · Pro tugashi — ilova `proGacha` bo'yicha (o'tgan bo'lsa Pro yo'q; «Har hafta takrorlansin» → to'lov taklifi ekrani) ·
   `GET /oyinlar` dagi keyingi «Doimiy o'yin» faqat Pro muddati ichida yaratiladi (tayanch 9.26, 07.10: 7-darsda oferta 4-bandi kodda bor); 5-darsda ishlatib tekshirilmaydi (o'yin vaqti kerak) ·
   mashq sahifasi: «Kechiktirib yuborish» (`POST /tolov-mashq/yubor { tur: 'kech' }` — Backend 70 soniyadan keyin xabarni imzolab o'z `POST /tolov/webhook` iga yuboradi; sahifaning so'rovi 10 soniyada tugaydi; **zaxira** — so'rov 70 soniya ochiq tura olmasa (Render yoki brauzer uzsa): Backend sahifaga darhol `202 { kutilmoqda: true }` qaytaradi va xabarni 70 soniyadan keyin o'zi yuboradi, imzo va webhook tekshiruvlari bir xil; qaysi biri — pilotda, F-1007-463) va «Noto'g'ri imzo» (`tur: 'notogriImzo'` — HMAC boshqa, kodda yozilgan maxfiy bo'lmagan kalit bilan → `401`).
3. **`m13-dars-05-done` (3-amaliyot natijasi):** webhook — imzo → takror → yozuv va Pro **bitta tranzaksiyada** (Pro faqat yangi `tolandi` yozuvidan keyin; takrorga `200 { takror: true }`, Pro o'zgarmaydi) ·
   sahifa 10 soniyada javob kelmasa «Javob kutilmoqda» ko'rsatadi (`kech` da Backend javobni kutmasdan `202`/`{ kutilmoqda: true }` qaytarishi mumkin — agentning tanlovi) · ilova: `AppState` faol bo'lganda va «Qayta tekshirish» bosilganda `GET /men` · `BUZISH.md` — «To'lov» bo'limi (`MENTOR_YOZUV` to'liq) · README «Darslar va teglar» → `m13-dars-05-done`.
4. **Muhrdan oldin (⛔ «qur» darvozasi):** Mentor telefonida (Android, Expo Go) va web-trekda (brauzer oynasiga qaytish) `05-start` + 1-amaliyot talabi bilan to'rt urinish — ikki muammo takrorlanadimi, rad va noto'g'ri imzo buzmaydimi; Render bepul xizmatida 70 soniyalik kechiktirish va o'ziga so'rov (9.4) ishlaydimi; `UPDATE … CURRENT_DATE - 1` va `= NULL` `pro_gacha` ustun turida ishlaydimi;
   3-amaliyot talabi bilan qayta tekshiruv — ikkala urinish takrorlanmaydimi. Natija boshqacha chiqsa — MD (2, 5-ekran, `MENTOR_YOZUV`, testlar, arena, kartochkalar) haqiqiy natijaga moslanadi. `tolovlar` dagi mashq qatorlari o'chirilmaydi (sanoqqa tushmaydi).

## Manbalar (o'zim tekshirdim yoki tayanch 6 orqali, 07.10.2026; o'quvchiga ko'rinmaydi)
1. PostgreSQL — `postgresql.org/docs/current/functions-datetime.html` (o'zim, 07.10.2026): «`date` `-` `integer` → `date` — Subtract a number of days from a date — `date '2001-10-01' - 7` → `2001-09-24`» · «`current_date` → `date` — Current date» → 1-amaliyot 4-qadam (3) so'rovi `CURRENT_DATE - 1`.
2. Render — tayanch 6 (`render.com/docs/free`, 06.10.2026): bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa → 2-ekran QIzohi, kartochka 3, «Kechiktirib yuborish» 70 soniyasi (tayanch 1.5).
3. Payme Business — tayanch 6 / MANBA 5 (`developer.help.paycom.uz`, 07.10.2026): «В случае потери ответа при вызове метода, Payme Business повторяет запрос с теми же параметрами» · sandbox: CreateTransaction, PerformTransaction, CancelTransaction so'rovlari ikki marta yuboriladi → 2-ekran O'qituvchi eslatmasi.
4. Stripe — tayanch 6 / MANBA 5 (`docs.stripe.com/webhooks`, 07.10.2026): «Webhook endpoints might occasionally receive the same event more than once» · «Stripe doesn't guarantee the delivery of events in the order that they're generated» → 2-ekran O'qituvchi eslatmasi.
5. Kursdagi so'zlar va naqshlar (grep, 07.10): buzish yozuvi, «Tuzatish qilindi», «qayta tekshiruvda takrorlanmadi / yana buzildi», `BUZISH.md` — 12-Modul `05-BreakAndFix-v3.md` va 12-Modul tayanchi 9.37 ·
   Neon'da `UPDATE … WHERE id = …` va qaytarish — 11-Modul `11-FeatureOne-v3.md` (279–280, 330–332-qatorlar), 11-Modul tayanchi 9.35 · mashq sahifasi, to'rt tugma, «To'landi (mashq)», javoblar — pilot `03-PaymentWebhook-v3.md` · to'lov taklifi ekrani matni — tayanch 1.4 ·
   o'z hisob raqami `SELECT id FROM oyinchilar WHERE login = …` — pilot `03` A2 1-qadam · loyiha kuni «uyda» yo'q — 12-Modul tayanchi 9.41 h · App.jsx `m11-04…06` — 448–450-qatorlar.
6. Tekshirilmagan: Render bepul xizmati so'rovdan keyin 70 soniya ishlab, o'ziga xabar yuborishi (Shubhali 3) · Expo Go'da ilova fonga o'tib qaytganini bilish usuli (agent tanlaydi; Shubhali 5).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ⚠️ **«Javob kutilmoqda» ikki joyda (eng muhim).** Tayanch 1.5 uni 1-amaliyotdagi qolgan holatlar ro'yxatida ham, 2-muammoning tuzatishida ham aytadi; tayanch 3 (`05-done`) esa uni tuzatish qatorida beradi. 1-amaliyot sahifaga ham «Javob kutilmoqda» qo'ysa, 2-muammo Mentor misolida 2-amaliyotda topilmay qoladi.
   **Qarorim:** 1-amaliyotda «Javob kutilmoqda» — **ilovada** (to'lovdan qaytganda natija hali yo'q bo'lsa; qaytganda bir marta so'raydi); 3-amaliyot tuzatishi (tayanch 1.5 so'zma-so'z) — **sahifada** «Javob kutilmoqda» va ilovada «Qayta tekshirish» + qaytganda qayta so'rash.
   Mentor misolida 2-muammo shunday ko'rinadi: sahifa «To'lov o'tmadi» dedi (10 soniya), ilovada «Javob kutilmoqda» qoldi (ochiq turganda qayta so'ramaydi), Pro esa yoqildi — «ilova eski holatda qoldi». Muqobil: «Javob kutilmoqda» faqat 3-amaliyotda (1-amaliyot ro'yxatidan olinadi) — tayanch 1.5 A1 o'zgaradi.
2. ⚠️ **«Kechiktirib yuborish» va «Noto'g'ri imzo» tugmalari 1-amaliyotda.** Tayanch 3 (`05-done`) ularni beradi, 1.5 A1 ro'yxatida yo'q; 2-amaliyot — «kod yozilmaydi». Qarorim: 1-amaliyot talabining 3-bandi. Muqobil: Mentor repo'sidagi tayyor sahifa (o'quvchiga starter — tayanch 7 «rad etilganlar» ga zid) — tanlamadim.
3. **Mentor buzish yozuvi** (`MENTOR_YOZUV`, A-bo'lim 4) — tayanchda ikki muammo va «rad, imzo — buzilmadi» bor, urinish matnlari yo'q; yozdim (T-008, birinchi shaxsda). ⛔ pilotda haqiqiy natija.
4. **Har urinishdan oldin Pro yo'q bo'lishi** — 4-darsdan mashq sahifasi faqat «To'lovga o'tish» raqami bilan ishlaydi (9.7), to'lov taklifi ekrani esa faqat Pro yo'q bo'lganda ochiladi. Qarorim: o'quvchi Neon'da `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = …;` (11-Modul odati), agent — zaxira.
   Muddat tugashini tekshirish — `pro_gacha = CURRENT_DATE - 1` (bo'sh emas, kecha — «muddat tugadi» holati).
5. **O'qiladigan kalitlar:** `pm-m11d4-narx` — faqat `ishlaydi` va `ekran.tugma`; `pm-m9d8-platforma.trek`. Tayanch 8 `pm-m11d3-oqim` ni ham 5-dars o'quvchisi deydi — bu darsda unga joy topmadim (3-dars `test` natijasini qayta ko'rsatish shart emas). Kerak bo'lsa — qayerda?
6. **`pm-m11d5-buzish` yaratilishi:** 2-amaliyotdagi birinchi saqlashda to'rtta yozuv (`buzildi: null`); `kutdim` majburiy («Nima bo'ldi» undan oldin qulf). `tur` maydoni yo'q (tayanch 8 shaklida yo'q; bu darsda hamma urinish — o'quvchining o'z mahsulotida).
7. **Pro tugashi — «yangi o'yin o'zi e'lon qilinmasin»** Mentor talabida bor, lekin darsda tekshirilmaydi (o'yin vaqti o'tishi kerak); REPO 2 da Mentor kodida bu qism **ishlaydi** (07.10 o'zgardi — tayanch 9.26: 7-darsda oferta 4-bandi kodda bor; 12-darsning 5-topilmasi endi doimiy o'yinning takror yaratilishi). O'quvchi matnida 12-dars va'da qilinmaydi.
8. **Pro uzayishi:** «Pro bo'lmasa — bugundan, bo'lsa — muddatiga 30 kun» (tayanch 1.3 «uzaytiradi», 1.5 «60 kunga uzaydi»); 1.4 dagi «`pro_gacha` = bugun + 30 kun» — Pro yo'q holat uchun bir xil.
9. **`GET /men` ga `oxirgiTolov`** (`tolandi` · `rad` · `kutilmoqda`) — Mentor talabida; o'quvchi talabida «Backend'dan so'rasin» (usul agentga). Manba (F-1007-463): shu foydalanuvchining eng oxirgi `boshlangan_tolovlar` yozuvi (4-dars, tayanch 9.23) → `tolovlar` dagi holati; `tolovlar` da yo'q — `kutilmoqda`. Faqat `tolovlar` ning oxirgi qatori yetmaydi: kech xabar hali yozilmagan bo'ladi.
10. **Namuna to'lov raqamlari** — `m-` + 12 tasodifiy belgi (4-dars, tayanch 9.7), maketda qisqartirilgan `m-c41e…`, `m-9b07…` (F-1007-463: avvalgi `m-131` … `m-134` ketma-ket raqamdek o'qilardi).
11. **4-dars bilan kelishuv:** `04-done` da (a) Pro takror tekshiruvidan oldin uzayadi, (b) sahifa 10 soniya kutib «To'lov o'tmadi» yozadi, (c) ilova qaytganda bir marta so'raydi — MD shu taxmin bilan yozilgan. 04 MD ko'rildi (F-1007-462): talab (a) ni chaqirmaydi (yozuv va Pro bitta Database ishida), (b) talabda yo'q. **Holat ataylab yaratilmaydi** — pilot natijasi olinadi; (a) yoki (b) chiqmasa, MD moslanadi (F-1007-463).
12. **Sahna** — telefon (ilova ↔ brauzer) · Backend (ichida «Mashq to'lov» va webhook) — 3-dars 11-ekrandagi «Mashq to'lov» holati; to'lov xabari konverti Backend ichida uchadi (telefondan Backend'ga to'lov xabari chizilmaydi — ilova pulni ko'rmaydi, 3-dars hooki).
13. **Hook va 2-ekran sahnasi Mentorning 1-amaliyotdan keyingi holatida** (tekshiruv tugmalari ko'rinadi) — o'quvchi tugmalarni avval Mentor misolida ko'radi, keyin o'zi quradi.
14. **2-amaliyot qadamlari:** Ochish → Buzish → Prompt (`BUZISH.md`) → Tekshirish (12-Modul 5-dars A1 da Ochish → Prompt → Buzish → Tekshirish edi; bu yerda agentga buzishdan oldin ish yo'q).
15. **Nishonlar:** Pro Once · Same Button · Four Ways (ish bajarilgan) · Rechecked (bonus, kamida bitta qayta tekshiruv bilan) — grep 0.
16. **Yakun — yetti holat** (E 54: har biri rost; «hech biri» — alohida).
17. **«Ortda qoldingizmi»** — 1-amaliyotda, ikki teg (`05-start` — 4-dars ishi ortda qolganlar uchun; `05-done` — bugungi tayyor holat).
18. **«Kechiktirib yuborish» urinishida «ilovadan chiqmay bir daqiqa kuting»** — 2-muammoni ko'rish sharti (chiqib qaytsa, ilova qayta so'raydi); O'qituvchi eslatmasida ochiq, o'quvchi matnida qavsda (F-1007-463).
19. **5-ekran bashorati** «Pro oxiri yoqildi. Bu urinish buzildimi?» — buzish yozuvi qoidasining nozik joyi (natija oxiri to'g'ri, lekin kutilgani bo'lmadi).
20. **Arena 3 da brend yo'q** (F-1007-463): «Haqiqiy to'lov sahifasida, kartangiz bilan» — pul chegarasini (TAQIQLAR 1) o'lchash uchun brend kerak emas; darsda brend faqat O'qituvchi eslatmasida.
21. **Qaror-0 8 so'zi va tayanch 1.5 mexanikasi:** Qaror-0 8 (WH-q1 A) «uxlagan Backend» usulini «birinchi xabar javobsiz qoladi, qayta yuborilgani ikki marta yozilmasligi tekshiriladi» deb aytadi; tayanch 1.5 uni «Kechiktirib yuborish» (xabar 70 soniya kutib yuboriladi) bilan almashtirgan, 2-muammo — sahifaning 10 soniyalik kutishi.
    Men tayanch 1.5 ga amal qildim: «qayta yuborilgani ikki marta yozilmasligi» — 1-usul («Ikki marta yuborish») tekshiradi. «Kechiktirib yuborish» qayta yuborishni ham qilsa, Mentor misolida u ham Pro'ni 60 kunga uzaytirib, tayanchdagi natijaga zid chiqardi — shuning uchun qo'shmadim.
    Qaror-0 2 dagi «soxta imzo» — darsda tayanch so'zi «noto'g'ri imzo» (3-darsda «soxta» — imzosiz begona xabar ma'nosida band).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **Mentor repo'sida ikki muammo** — `05-start` + 1-amaliyot talabidan keyin haqiqiy telefonda takrorlanadimi; rad va noto'g'ri imzo buzmaydimi. Pilotgacha 2, 5-ekran va `MENTOR_YOZUV` — reja.
2. ⛔ **4-dars holati** (TAYANCHGA SAVOL 11) — 4-dars talabi bilan agent (a) va (b) ni yozmasligi ham mumkin (F-1007-462 dan talab qat'iyroq); unda Mentor misolida bu muammolar yo'q — 2, 4, 5-ekran, `MENTOR_YOZUV`, arena, kartochkalar haqiqiy natijaga moslanadi (ataylab buzilmaydi — F-1007-463).
3. ⛔ **70 soniyalik kechiktirish Render bepul xizmatida** — so'rov tugagach Backend 70 soniya ishlab, o'z tashqi manziliga xabar yubora oladimi (9.4 dagi o'ziga so'rov bilan bir savol). Ishlamasa — REPO 2 zaxirasi (darhol `202`, 70 soniyadan keyin Backend o'zi yuboradi; F-1007-463); 2-muammo shu holatda ham ko'rinadimi — pilotda.
4. **`pro_gacha` ustun turi** (sana yoki vaqt) — `CURRENT_DATE - 1` va `NULL` PostgreSQL'da ikkalasiga ham mos (Manbalar 1), lekin Mentor jadvalida sinalmagan; o'quvchi mahsulotida ustun nomi boshqa bo'lishi mumkin (matnda «mahsulotingizdagidek», agent zaxira).
5. **Ilova «qaytganda» natijani so'rashi** — Expo'da ilovaning fonga o'tib qaytishi (`AppState`), web-trekda tab'ga qaytish — agentning tanlovi; ba'zi telefonda brauzerdan ilovaga qaytish boshqacha bo'lishi mumkin. Pilotda.
6. ⛔ **90 daqiqa** — uch blok, ikki Render kutishi, 70 soniyalik urinish; taymer bilan pilotda (A-bo'lim 12). ChatGPT bahosi — 125–160 daqiqa (o'lchanmagan); pilotda 90 dan oshsa, qisqartirish — foydalanuvchi qarori (masalan, 2-amaliyotda darsda ikki usul — ikki marta va kech; F-1007-463).
7. **Neon'da `UPDATE`** — 11-Modulda o'quvchilar ishlatgan; o'quvchi `WHERE` siz yuborsa hamma hisob o'zgaradi (ogohlantirish 1 va 2-amaliyotda qalin; O'qituvchi eslatmasi). Pilotda kuzatiladi.
8. **Mashq sahifasidagi olti tugma telefon ekranida** — sig'ishi va «Tekshiruv tugmalari» qatorining ko'rinishi vizual bosqichda (E 41).
9. **«Javob kutilmoqda» sahifada qanday tugaydi** (natija kelgach sahifa o'zi yangilanadimi) — tayanchda yo'q; o'quvchi matnida faqat «Javob kutilmoqda» deyiladi, natijani ilova va Neon ko'rsatadi.
10. **2-ekrandagi sahna sababni ko'rsatadi** (Pro qatori takror tekshiruvidan oldin) — bu Mentor kodining fakti (tayanch 1.5), lekin auditor «sahna sabab da'vosi» (sinf 5) deyishi mumkin; matnda sabab aytilmaydi, faqat 4-ekran savolida.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔; A-bo'lim 12; uch blokda «Ulgurmasangiz»; Render kutishi paytida ish (1, 3-amaliyot 3-qadam), 70 soniyalik kutishda oldingi yozuvni o'qish; «sig'adi» deyilmagan (Shubhali 6).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Shubhali 1, 2, 3, 6 (⛔); Render, Neon SQL Editor, Expo Go — oldingi modul so'zlari, tugma nomi taxmin qilinmagan; kutish — «bir necha daqiqa cho'zilishi mumkin», «odatda o'zi qayta yuklaydi».
3. [x] **Saqlash kaliti — shartnoma** — `pm-m11d5-buzish` tayanch 8 aynan (A-bo'lim 1): `buzildi: bool | null`, `qayta` uch holat, `usul` barqaror kalit, tartib o'zgarmaydi, `tuzatishQilindi` (ish fakti) va `qayta` (natija) alohida; kalitga ism, login, hisob raqami, kalit yozilmaydi; boshqa darsning kaliti yozilmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (0, 1, 2, 5-ekran, 4-savol, arena 6, 8, 12); «Bu misolda» (2, 5-ekran xulosalari, 4-savol izohi); blok — Mentor misoli: «pullik qulaylik», `{…}` joylari; to'rt usul — «bu darsdagi» (kartochka 2).
5. [x] **Kafolat va sabab da'vosi yo'q** — «To'lov ishlaydi» faqat agent pufagida va «da'vo» yorlig'i bilan; «Tuzatish qilindi» (ish fakti) va «qayta tekshiruvda takrorlanmadi» (natija) — alohida (5-ekran, 3-amaliyot, 7-savol); «tuzatildi» belgi sifatida yo'q (grep);
   «odatda», «mumkin», «kerak» — xabar kelishi va qayta yuklash haqida; «yangi o'yin o'zi e'lon qilinmasligi» — «bugun tekshirmaysiz» (1-amaliyot 4-qadam).
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — 11-ekran yetti sarlavha, har biri rost («hech biri» alohida); ✓ yorliq faqat 2-amaliyot 4-qadamidan; bloklarning yashil qatori holatga qarab (2, 3-amaliyot — ikki-uch holat); blok bayrog'i faqat 4-qadamdan; nishon tavsiflari qilingan ishni aytadi (Rechecked — faqat qayta tekshiruv bo'lsa).
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «buzildi» — «Nima bo'ldi» «Talab bo'yicha» qatoridan farq qiladi (F-1007-463); Pro muddati — kun bilan (30, 60); `tolovlar` — qator soni; «eng» so'zli ta'rif yo'q.
8. [x] **Test: bitta himoyalanadigan javob** — 4 va 7-ekran: distraktorlar to'rt turkumdan (Kalit qatorlari); arena 3 — uch xil qoida; uzunlik ±15% va ✔ yolg'iz eng uzun emas (O'lchov); haqiqiy hayotda rost bo'lib qoladigan distraktor chiqarildi (arena 5 — «keyingi to'lovda yoqiladi» olib tashlandi; arena 12 — Telegram xabari o'rniga agent javobi: bu darsda «xabar» faqat to'lov xabari).
9. [x] **Real odamlar xavfsizligi** — real odam bilan ish yo'q; tegadigani: buzish faqat o'z mahsulotida, boshqa odamning sayti/Backend'i/xizmati tekshirilmaydi (1-ekran, 2-ekran qatori, 2-amaliyot 1-qadam, arena 3); juftlikda ham har kim o'z mahsulotini buzadi (1-ekran O'qituvchi eslatmasi); kalit chatga va skrinshotga yozilmaydi.
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — 1-amaliyot tekshiruvi, 2-amaliyot buzishi va 3-amaliyot qayta tekshiruvi — o'quvchi bosadigan tugmalar, Neon so'rovlari; agent — hisob raqami va ustun nomini topishda zaxira, `BUZISH.md` ga ko'chirishda; tekshiruv akkaunti ochilmaydi (o'z hisobi, mashq to'lovi).
11. [x] **Web-trek teng yo'l** — har blokda web gapi (`prototip/`, «saytga qaytganda», Netlify); 2-amaliyot ikkala trekda bir xil; sarlavhalarda «mahsulotingiz», «to'lov yo'lingiz»; testlar va arena Mentor misoli haqida (ikkala trekka to'g'ri).
12. [x] **Mentor misoli ichki izchil** — narx 15 000 / 30 kun (4-dars), 10 000 ochilmadi; Pro 30 → 60 (tayanch 1.5); `MENTOR_YOZUV` — bitta manba (2, 5-ekran, bloklar, kartochka, arena); Pro tugashi — tayanch 9.26 bilan izchil (TAYANCHGA SAVOL 7); yangi tafsilotlar — TAYANCHGA SAVOL 3, 9, 10.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 1-amaliyot uch joy (`{pullik qulaylik}`, `{muddat tugaganda …}`, `{avvalgidek …}`); `GET /men` ga holat — faqat Mentor talabida; 3-amaliyot «Qayerda» — yozuvdagi muammoga tegishli fayllar, tuzatish yo'nalishi — faqat Mentor Yordamida; qaytarib bo'lmaydigan o'zgarish yo'q (`UPDATE` — o'z hisobi, qaytariladi).
14. [x] **Uyga vazifa yengil va aniq** — loyiha kunida uyga vazifa yo'q (tayanch 4); «uyda» so'zi o'quvchi matnida yo'q — ulgurmagan ish yakun sarlavhasida.
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …»; «sizda emas», «xatongiz emas» — 0 (grep).
16. [x] **Kelajak va'dasi yo'q** — mashq sahifasi va ilovada faqat hozir ishlaydigan narsa; 12-dars va 6-dars ekranlarda tilga olinmaydi; kelajak — faqat yakundagi «Keyingi dars» qatori; 2-amaliyot yashil qatori «3-amaliyotda tuzatasiz» — shu darsning keyingi bloki.
+ **12-Modul tayanchi 7 (11-Modul sinflari)** — holatga qarab yakun [x] · da'vo isbot emas [x] (agent pufagi, «da'vo · tekshirilmagan», «Tuzatish qilindi» — natija emas) · maxfiy qiymat agentga va ochiq joyga chiqmaydi [x] (har promptda «`TOLOV_KALITI` qiymatini hech qayerga yozma», xato gapida «`.env` dagi kalit va tokenlarni emas») ·
  tashqi xizmat haqida faqat rasmiy hujjat [x] (Manbalar; brendlar faqat O'qituvchi eslatmasida) · har sonning manbasi [x] (A-bo'lim 6) · tayanchda yo'q narsa to'qilmagan [x] (TAYANCHGA SAVOL 1–21) · saqlash kaliti o'qiydigan darsdan [x] (12-dars) · test: bitta javob [x] · keys [—] (keyssiz, Qaror-0 21) ·
  90 daqiqa [x] · bir ma'no — bir so'z [x] («holat» — to'lov holati; «xabar» — to'lov xabari; «test» — faqat «test rejim»; «tekshirish» — o'z ishi) · web-trek [x] · agent va o'quvchi ishi ajratilgan [x] · o'smir xavfsizligi [x].
+ **13-Modulga xos (pul):** real pul yo'q [x] (tepada, 1-ekran eslatmasi, arena 3) · karta ma'lumoti hech qayerda [x] (sahna, KOD 3, mashq sahifasi maketi) · «mashq to'lov» Payme/Click ko'rinishini taqlid qilmaydi [x] (brend chizilmaydi; 1-amaliyot talabi eski sahifaga ikki tugma qo'shadi) ·
  «test rejim» belgisi har to'lov ekranida [x] (to'lov taklifi ekranida «Test rejim: pul yechilmaydi», mashq sahifasida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.») · narx — «Mentorning taxmini» [x] (har maketda yorliq) · suhbat va tasdiqda bosim yo'q [—] (bu darsda suhbat va tasdiq yo'q) · oferta — shablon [—] (7-dars) ·
  avtomatik yechish yo'q [x] (1-amaliyot talabi: «Pulni avtomatik yechadigan hech narsa qo'shma»; kartochka 10) · komissiya aytilmagan [x].

## O'lchov (scratchpad `md05/olchov.py`, 07.10.2026; yakuniy fayl bo'yicha)
Belgilar — oddiy `len` (✔ va boshidagi bo'shliqsiz). `!!!` — chegaradan oshgan joy: yakuniy yurishda **0** (oldingi yurishlarda topilgan 2 sarlavha (57, 55 → 46, 53), 1 shart xabari (61 → 52) va 5 arena qatori (±15% yoki «✔ yolg'iz eng uzun») tuzatildi).
Test variantlari: ±15% o'rtachadan va ✔ yolg'iz eng uzun emas — 2 test, 12 arena hammasida OK. Mentor gaplari — interaktiv ekranlarda bitta gap; 1-ekran (reja) — ikki gap. Kod oynasi yo'q. Kartochka old tomoni «?» bilan — 12/12.
`npm run lint:til` — 0 error, 2 warn (agent prompti ichidagi «Tuzat»/«qo'sh» — T-002 istisnosi; Manbalar 3 dagi Payme ruscha iqtibosi — rasmiy matn aynan).

```
## Sarlavhalar (≤55)
   44  Bir marta to'landi — endi to'lov ishlaydimi?
   46  Bugun to'lov yo'lingizni buzasiz va tuzatasiz.
   45  To'lov xabari kech yoki ikki marta kelsa-chi?
   54  Mahsulotingizda to'lovning qolgan holatlari ko'rinsin.
   45  «Buzildi» yonida yashil belgi qachon chiqadi?
   49  Mahsulotingizda to'lovni to'rt usul bilan buzing.
   54  Topilganini tuzating va o'sha usul bilan qayta buzing.
   25  O'zingizni sinab ko'ring.
   52  Tuzatish qilindi va qayta tekshiruvda takrorlanmadi.
   50  To'rt usul bajarildi — to'lov yo'lingiz buzilmadi.
   42  Tuzatish qilindi — qayta tekshirish qoldi.
   36  Urinishlar yozildi — tuzatish qoldi.
   31  To'lovni buzish hali tugamagan.
   43  Qolgan holatlar tekshirildi — buzish qoldi.
   39  To'lov yo'li bugun hali tekshirilmagan.
## Xulosalar (≤110)
   87  Bu misolda oddiy to'lov ishlagan, lekin ikki marta va kech kelgan xabar to'lovni buzdi.
  109  Bu misolda yashil belgi agentning javobidan keyin emas, o'sha tugma bilan qayta buzilmagandan keyin qo'yildi.
## Hook javoblari (≤120)
  111  Aynan! Bitta to'lov — bitta holat. To'lov xabari ikki marta, kech yoki noto'g'ri imzo bilan ham kelishi mumkin.
  106  Qiziq fikr! Bu oddiy holat edi. Xabar ikki marta yoki kech kelsa ham shunday bo'ladimi — hali ko'rilmagan.
  109  Qiziq fikr! Agentning «ishlaydi» degani — da'vo: kech yoki ikki marta kelgan xabar bilan hali tekshirilmagan.
## Xato izohlari / QXato / shart (≤60)
   54  Raqam yangi bo'lsa, `tolovlar` da ikki qator bo'lardi.
   46  Imzosiz xabarga `401` — u hech narsa yozmaydi.
   51  Ilova faqat o'qiydi — Pro muddatini Backend yozadi.
   52  Avval «Nima kutdim» ni yozing, keyin tugmani bosing.
   44  «Nima bo'ldi» bo'sh — ko'rganingizni yozing.
   49  Agentning «tuzatdim» degani — da'vo, natija emas.
   45  Fayl o'zgargani — «Tuzatish qilindi» belgisi.
   32  Muammo qaysi usulda chiqqan edi?
## Bloklar «Hammasi bajarilgach» (≤110)
   75  Uch holat ko'rindi, ikki tugma sahifada — endi to'lovni ular bilan buzasiz.
   70  To'rt urinish yozildi: «buzildi» chiqqanlarini 3-amaliyotda tuzatasiz.
   66  To'rt urinish yozildi: to'lov yo'lingiz buzilmadi — bu ham natija.
   75  Tuzatish qilindi va qayta tekshiruvda takrorlanmadi: natija `BUZISH.md` da.
   69  Tuzatish qilindi, bitta urinish yana buzildi — bu ham `BUZISH.md` da.
   60  Tuzatish kerak bo'lmadi: to'rt usul mahsulotingizni buzmadi.
## QIzoh qatorlari (chegara yo'q, bitta qator)
  110  Mentor misolida `m13-dars-05-start` — agent «to'lov ishlaydi» degan kod: to'rt usul bilan hali tekshirilmagan.
  113  «Kechiktirib yuborish» — mashq, uxlashning nusxasi emas: haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi.
  110  Qayta tekshiruvda yana buzilsa, belgi «qayta tekshiruvda yana buzildi» bo'ladi — yozuv agentga qayta beriladi.
## Hook variantlari
   39  Ha — bitta to'lov o'tdi, demak ishlaydi
   41  ✔ Bilmayman — to'lov xabari kech kelsa-chi?
   37  Ha — agent ham «to'lov ishlaydi» dedi
  o'rtacha 39.0 · ±15%: OK
## Mentor gaplari (gap soni · belgi)
  1 gap ·  76  Mentor misolida tashkilotchi Pro'ni yoqmoqchi — «To'lovga o'tish» ni bosing.
  1 gap ·  50  Endi mashq sahifasida «To'lash (mashq)» ni bosing.
  1 gap ·  41  Endi o'ngdagi javoblardan birini tanlang.
  2 gap · 149  Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Buzish faqat o'
  1 gap · 117  Mentor misolida agent «to'lov ishlaydi» degan — avval taxminingizni belgilang, keyin «Ikki marta yub
  1 gap ·  56  Endi «Kechiktirib yuborish» ni bosing va ilovaga qarang.
  1 gap ·  35  Endi «Rad etish (mashq)» ni bosing.
  1 gap ·  38  Oxirgisi — «Noto'g'ri imzo» ni bosing.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap ·  87  Talab tayyor — uch joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
  1 gap ·  62  Avval taxminingizni belgilang, keyin «Solishtirish» ni bosing.
  1 gap ·  59  Endi yozuvni agentga bering — «Agentga yuborish» ni bosing.
  1 gap ·  60  Kod o'zgardi — endi «Qayta: kechiktirib yuborish» ni bosing.
  1 gap ·  50  Oxirgisi — «Qayta: ikki marta yuborish» ni bosing.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap ·  91  Kod yozilmaydi: tugmani siz bosasiz, nima bo'lganini siz yozasiz; «1 · Ochish»dan boshlang.
  1 gap · 118  Yozuvni agent oladi va kodni o'zgartiradi, to'g'riligini esa siz o'sha tugma bilan ko'rasiz; «1 · Oc
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  ## 4 · 1-savol ✔ (jonli ball)  ←  · savol 10 so'z · variantlar [42, 41, 38, 38] · o'rtacha 39.8 · OK · ✔C
      A   42  Sahifa ikkinchi xabarga yangi raqam bergan
      B   41  Ikkinchi xabar imzosiz kelib o'tib ketgan
      C✔  38  Pro takror tekshiruvidan oldin uzaygan
      D   38  Ilova Pro holatini ikki marta so'ragan
  ## 7 · 2-savol ✔ (jonli ball)  ←  · savol 7 so'z · variantlar [40, 42, 44, 41] · o'rtacha 41.8 · OK · ✔A
      A✔  40  O'sha usul bilan qayta buzganda chiqmasa
      B   42  Agent «tuzatdim» deb javob yozib qo'yganda
      C   44  Kodda o'zgargan faylni ko'rib bo'lganingizda
      D   41  Boshqa usul bilan qayta buzganda chiqmasa
## Arena (12) — ✔ o'rni va variant uzunliklari
  ✔A · 6 so'z · [25, 24, 24, 27] · o'rtacha 25.0 · OK  1. Agent «to'lov ishlaydi» dedi. Bu nima?
  ✔B · 5 so'z · [27, 25, 29, 29] · o'rtacha 27.5 · OK  2. «Kechiktirib yuborish» tugmasi nimaning mashqi?
  ✔C · 7 so'z · [42, 42, 40, 38] · o'rtacha 40.5 · OK  3. To'lovni qayerda va nima bilan buzib tekshirasiz?
  ✔D · 8 so'z · [38, 35, 35, 35] · o'rtacha 35.8 · OK  4. Imzosi noto'g'ri xabar keldi. Backend nima qilishi kerak?
  ✔A · 7 so'z · [23, 25, 24, 23] · o'rtacha 23.8 · OK  5. To'lov rad etildi. Pro nima bo'lishi kerak?
  ✔B · 8 so'z · [31, 29, 26, 30] · o'rtacha 29.0 · OK  6. Mentor misolida ikki marta kelgan xabar nimani buzdi?
  ✔C · 8 so'z · [24, 26, 26, 26] · o'rtacha 25.5 · OK  7. Javob 10 soniyada kelmadi. Sahifa nima deyishi kerak?
  ✔D · 8 so'z · [31, 26, 26, 29] · o'rtacha 28.0 · OK  8. Mentor talabida ilova Pro holatini qachon qayta so'raydi?
  ✔A · 5 so'z · [23, 25, 23, 23] · o'rtacha 23.5 · OK  9. «Nima kutdim» qatori qachon yoziladi?
  ✔B · 5 so'z · [30, 30, 30, 28] · o'rtacha 29.5 · OK  10. «Tuzatish qilindi» belgisi nimani aytadi?
  ✔C · 8 so'z · [30, 26, 27, 29] · o'rtacha 28.0 · OK  11. Pro muddati tugadi. E'lon qilingan o'yinlar nima bo'ladi?
  ✔D · 7 so'z · [30, 30, 28, 30] · o'rtacha 29.5 · OK  12. Kech urinishda Mentor Pro yoqilganini qayerdan ko'rdi?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m11-04` «Narxni qanday belgilaysiz?» → **`m11-05` «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz»** (osti «test rejimda to'lov oqimi; buzamiz va tuzatamiz», 449-qator, grep 07.10) → `m11-06` «Pul haqida qanday gaplashasiz?»;
      reja qadamlari `sub` so'zlari bilan (test rejim · to'lov oqimi · buzish · tuzatish); yakundagi «Keyingi dars» — `00-NOMLAR.md` 6-qator.
- [x] Bitta misol-ip («Maydon Jamoa», hook → uch blok); metafora yo'q; bitta vizual — `TolovSahna` (telefon: ilova ↔ brauzer · Backend: «Mashq to'lov» va webhook, `tolovlar`, Pro muddati; 3-dars sahnasi davomi); o'quvchining o'z mahsuloti — uch blok. Keyssiz; brend chizilmaydi.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (to'rt urinish), 5 (solishtirish → agent → ikki qayta urinish) va 0 (ikki harakat), bloklar — matn-karta yo'q; bashoratlar tanlangach ixcham qator; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi (bosqichga qarab).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — O'lchov bo'limi (0 ta oshish). Sarlavha ≈ Mentor so'z takrori yo'q (ko'z bilan, §225).
- [x] Atamalar oldingi darslar bilan bir xil — tayanch 2 va 12-Modul 5-darsi (to'lov xabari, mashq to'lov, test rejim, takror xabar, rad etilgan to'lov, imzo, Pro, buzish, buzish yozuvi, buzildi / buzilmadi, «Tuzatish qilindi», «qayta tekshiruvda takrorlanmadi / yana buzildi»); yangi atama yo'q;
      siz-forma (tugma — «Bajardim», «Solishtirish», «Nusxalash» ot-shaklda; agent promptlari — T-002, lint warn 1); olam matni — T-008 (Mentor yozuvi, agent pufaklari).
- [x] Testlar: uzunlik ±15%, ✔ yolg'iz eng uzun emas (skript); kalit so'z / tire / qavs faqat to'g'rida emas (tire 4-ekranda yo'q, 7-ekranda «qayta buzganda» A va D da) · ✔: s4 C · s7 A · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [—] Final tartib-mashqi — yo'q (loyiha kuni, 172).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (o'quvchi matnida grep: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%» — 0; «kafolat» faqat MD izohlarida emas — 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — faqat MD izohlarida; o'quvchiga «1-amaliyot», «2-amaliyot», «3-amaliyot»; `m11-05`, «Modul 13», «pilot», «sandbox», «idempotency» — yo'q); modul raqami LMS bo'yicha («12-Modulda»); tarixiy voqea yo'q · «KOD» (12) va «REPO» (4) ro'yxati to'liq.
- [x] Karta (`QURISH_KARTASI.md`) T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (yangi atama yo'q; ko'priklar — 2, 5-ekran nom qatorlari) · T-014/015 («xabar» — faqat to'lov xabari; «test» — faqat «test rejim»; «holat» — to'lov holati; «tekshirish» — o'z ishi; «sinov» yo'q) · T-016/017 · T-024 · T-029 · T-034 ·
      T-039 («to'lov yo'lingiz», «mahsulotingiz» — 3–4-darsdan bor) · T-042 · T-043 («Bu misolda», «Mentor misolida») · T-044 · T-045 (mashq — real to'lov nusxasi emas; «Kechiktirib yuborish» — uxlashning mashqi, nusxasi emas) · T-047 · T-048 · T-049 · T-052 · T-064 · T-066 · T-070 ·
      P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-025 (uyga vazifa yo'q) · P-026 (xato yo'li — aniq qadam, ayb da'vosisiz) · P-028 · P-036 · P-046 · P-052 · P-055 · P-059 · P-062 · P-063 (`MENTOR_YOZUV`, `USULLAR`) · P-064 · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-019 · S-020 · S-026 · S-040 · PM-018 (Mentor gapi real kompaniya qarorini da'vo qilmaydi) · SABOQ 9, 11, 12, 13, 16, 17, 19–31, 39, E 40–55.
