# 12-Modul · 9-dars «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» — MD v3 (yangi dars, loyiha kuni qolipi)

Fayl: `src/10-Modull/RetentionDayLesson.jsx` (kalit `m10-09`, App.jsx `type: 'Proyekt'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar; SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni, keyssiz (Qaror-0 22). Qolip: QKirish · QReja · QTushuncha ×2 · QTest ×2 · QBlok ×3 · podium · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx 405–407): `m10-08` «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» → **`m10-09` «Loyiha kuni: foydalanuvchini qaytaradigan eslatma»** (osti «hodisadan eslatmagacha — talabni siz yozasiz») → `m10-10` «50 foydalanuvchiga yetdingizmi?».
Namuna (tuzilish, hajm): 11-Modul `12-FeatureTwo-v3.md` + `12-FILTR.md` · `14-FeatureThree-v3.md` + `14-FILTR.md` · pilot `02-WebSocketBasics-v3.md` (bloklar, sahna) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul «C» 19–31, majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · bo'sh ustun yo'q · yakuniy holat ixcham · ko'p elementli mashq ketma-ket · stilsiz element yo'q.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **B** · 7-ekran **C** · final tartib-mashqi yo'q (loyiha kuni, 172) · arena A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — 0–1 ≈ 5 · 2 ≈ 7 · Amaliyot 1 ≈ 18 · 4 ≈ 2 · 5 ≈ 7 · Amaliyot 2 ≈ 18 · 7 ≈ 2 · Amaliyot 3 ≈ 21 · podium, kartochkalar, yakun, arena ≈ 10. Ulgurmagan o'quvchi yo'li — A-bo'lim 10.
⛔ Taqsimot — reja: «qur» pilotida taymer bilan o'lchanadi (09-FILTR 41; tashqi audit bahosi 110–130 daqiqa edi — 2-amaliyot bitta eslatmaga qisqardi, web-trek 2-amaliyotida Backend o'zgarmaydi).
09-FILTR (F-1006-363, 06.10.2026) dan keyingi holat: o'yin kuni 9:00 eslatmasi olib tashlandi · haftalik chegara ilovaning hamma eslatmasini sanaydi · `eslatmadan-ochdi` — istalgan eslatma · tekshiruv yozuvlari o'chiriladi · «uyda» yo'q.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.9):** dars oxirida o'quvchining o'z repo'sida **bitta qaytaradigan eslatma ishlaydi va sanaladi**: ilova ochiq paytda — foydali jonli xabar · ilova yopiq paytda — ilova oldindan qo'ygan eslatma ·
   eslatma bosilib ilova ochilganda — sanoq yozuvi · ilovada «Eslatmalar» o'chirgichi. Web-trekda 2-amaliyotda — «Xabarlar» tasmasi tepasidagi «Siz yo'q paytingizda: …» qatori (tayanch 1.9 «Web-trek»).
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m12-dars-09-start` (= `m12-dars-08-done`) → `m12-dars-09-done` (tayanch 3, aynan). Saqlanadigan yangi kalit yo'q (tayanch 4: faqat o'qiydi).
2. **Bugungi asosiy fikr (P-013):** Yopiq ilovada boshqa odamning o'zgarishi jonli xabar bo'lib ko'rinmaydi; foydalanuvchini ilova oldindan qo'ygan foydali eslatma qaytarishi mumkin — eslatma bosilib ilova ochilganini esa sanoq ko'rsatadi.
3. **Oldingi darslardan keladigan narsa (tayanch 1.0–1.8, 9; aynan):**
   - 3-dars: Backend besh o'zgarishdan keyin `oyin-ozgardi { oyinId, sabab }` yuboradi (hamma ulangan ilovaga); ilova tinglaydi va `GET /oyinlar` ni qayta so'raydi. Kanonik gap (9.17): «Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.»
   - 4-dars (tayanch 1.4): **jonli xabar** — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar; **4-darsda qurilgan xabarlar** — faqat o'ziga tegishli o'yin uchun, o'z harakati uchun chiqmaydi, ism yo'q (bugungi «2 joy qoldi» — yangi xabar, qo'shilmagan o'yin uchun; 4-dars xabarlari qoidasi o'zgarmaydi — 09-FILTR 9) ·
     **eslatma** — telefon ekraniga chiqadigan xabar; ilova yopiq bo'lsa ham chiqadi; **rejalashtirilgan eslatma** (ilova o'zi oldindan vaqtini belgilab qo'yadi) — o'yindan bir soat oldin «Bugun, 18:00 · Mahalla maydoni», «O'yindan chiqish»da bekor (bu darsda — **o'yin eslatmasi**; bitta o'yinga bitta — 9.36 i);
     ilova ochiq paytda ham ko'rinadi (`setNotificationHandler` 4-darsda qo'yilgan — 9.36 i); «Hisobdan chiqish» va «Hisobni o'chirish»da shu telefondagi eslatmalar bekor (7-dars);
     birinchi marta ilova ruxsat so'raydi («Ruxsat bermagan bo'lsangiz — telefon sozlamalaridan yoqiladi»). **Halol chegara:** boshqa odam tufayli bo'lgan o'zgarish ilova yopiq telefonda ko'rinmaydi (tayanch 9.36; 04-FILTR 1 — natija aytiladi, ulanish qachon uzilishi emas). **Test holati** — eslatma vaqtini vaqtincha bir daqiqadan keyinga qo'yib ko'rish, keyin qaytarish.
     Web-trekda (4-dars, 3-blok): «Xabarlar» tasmasi — sahifa ochiq paytda kelgan oxirgi beshta jonli xabar; halol qator «Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi.»
   - 7-dars (tayanch 1.7, pilot `07`): `hodisalar` jadvali (`id` · `nom` · `qurilma_id` · `yaratilgan`), `POST /hodisalar { nom, qurilma_id }` — `nom` faqat ruxsat etilgan nomlardan, aks holda `400`; ilovada `hodisaYoz(nom)`; ilova **har ochilganda** `ochdi`.
     **Qurilma ID** — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi. O'quvchining o'z qurilmasi ham sanaladi — bu halol aytiladi. «Hisobdan chiqish» yonida «Hisobni o'chirish». Lendingda «Android: ilovani o'rnatish» havolasi; `lending/maxfiylik.html`.
   - 8-dars (tayanch 1.8): **sanoq sahifasi** `lending/sanoq.html` — maxfiy kalit bilan yopiq (`SANOQ_KALITI`; kalitni bilgan ochadi — 08-FILTR 6); `GET /hodisalar/sanoq`; sahifa o'zi yangilanadi. **APK o'zi yangilanmaydi** — ilova o'zgarsa, yangi o'rnatish fayli tayyorlanadi va lendingdagi havola almashtiriladi.
   - 7-Modul (`m5-14`, `PmMetricsLesson`): «Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi» — bot uchun sanalgan. Bugungi ko'prik — bitta gap (0-ekran Mentori).
4. **Mazmun (tayanch 1.9 — aynan):**
   - **Qaytganlar foizi:** bir davrda ilovani ochganlardan keyingi davrda ham ochganlari foizi. Mentor misoli: **birinchi uch kunda ochgan 46 qurilmadan keyingi ikki kunda yana ochgani — 17** (taxminan 37% — tayanch 9.41 a). 17 — o'sha 46 qurilmaning ichidan (yangi kelgan qurilmalar kirmaydi).
     Bu — shu 46 qurilmaning sanalgan soni, taxmin emas; nega qaytmagani va eslatma yordam beradimi — bu sondan bilinmaydi (09-FILTR 8).
   - **Foydali eslatma qoidasi** (darsning PM qismi; **bu kurs qoidasi**, rejalashtirilgan eslatma uchun — o'quvchi matnida «Bu kursda …»; 09-FILTR 15): eslatma foydalanuvchining **o'z ishiga** tegishli va aniq foyda aytadi; **rost** — ilova oldindan bilgan narsani aytadi;
     qo'rqitish, uyaltirish, «sizni sog'indik» kabi bosim — yo'q; ilovada **«Eslatmalar»** o'chirgichi bor. Darsdagi tekshiruv kartasi — uch katak: «O'z ishiga tegishli, foydasi aniq» · «Rost: ilova buni oldindan biladi» · «Bosim, qo'rqitish, uyaltirish yo'q».
     **Haftasiga ko'pi bilan ikkita (tayanch 9.41 b; 09-FILTR 1, 8):** hafta — dushanbadan yakshanbagacha; ilovaning **hamma** eslatmasi sanaladi (4-darsdagi o'yin eslatmasi ham). O'yin eslatmasi har doim qo'yiladi — o'yinchi o'yinga o'zi qo'shilgan;
     ilova o'zi taklif qiladigan eslatma (Mentor misolida — uch kunlik) shu haftada ikkita eslatma bo'lsa **qo'yilmaydi**. Bir haftada uch o'yinga qo'shilgan odam uch o'yin eslatmasini oladi — bu uning tanlovi; ilova ustiga o'zidan qo'shmaydi.
   - **Mentor misolining uch bloki** (umumiy qolip emas; talabni o'quvchi yozadi, namuna «Yordam» ortida):
     A1 — **jonli xabar** (ilova ochiq): o'zi qo'shilmagan o'yinda bir yoki ikki joy qolganda — «Shanba, 18:00 — 2 joy qoldi» (ilova `oyin-ozgardi` dan keyin qayta so'ragan sondan o'zi hisoblaydi; yangi hodisa yo'q; ilova ochiq turgan davrda bir o'yinda bir xil son uchun bir marta) ·
     A2 — **rejalashtirilgan eslatma** (ilova yopiq) — **bitta: uch kunlik eslatma.** Ilova har ochilganda oldingisi bekor qilinadi va yangisi uch kundan keyin soat 17:00 ga qo'yiladi — «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring».
     U ilovani uch kun ochmagan odamga chiqadi; har kuni ochadigan odamga umuman chiqmaydi (09-FILTR 3). Halol chegarasi: ilova yopiq paytda yangi e'lon bor-yo'qligini bilmaydi — matn da'vo qilmaydi, taklif qiladi.
     Faqat hisobga kirgan foydalanuvchiga; «Hisobdan chiqish»da bekor (7-dars qoidasi). Haftalik chegaraga sig'masa — qo'yilmaydi.
     ⚠️ O'yin kuni soat 9:00 dagi «Bugun o'yin kuni: kelishingizni tasdiqlang» eslatmasi **olib tashlandi** (tayanch 9.41 c; 09-FILTR 2, 17, 18, 41): bitta o'yinga bitta eslatma (9.36 i — 4-darsdagi o'yin eslatmasi bor) · dars natijasi — **bitta** qaytaradigan eslatma (tayanch 4) ·
     Qaror-0 8 — «ilova oxirgi ochilganda rejalashtirgan» (uch kunlik eslatma aynan shu) · hook — ilovani ochmay qo'ygan o'yinchi (9:00 eslatmasi esa o'yinga qo'shilgan, faol o'yinchiga edi).
     A3 — **o'lchov va nazorat:** ilovaning **istalgan** eslatmasi (o'yin eslatmasi ham, uch kunlik ham) bosilib ilova ochilganda `eslatmadan-ochdi` (sanoq sahifasida yangi qator; tayanch 9.41 d) — «uch kunlik eslatma shuncha odamni qaytardi» deyilmaydi;
     «Eslatmalar» o'chirgichi (o'chirilsa — rejalashtirilganlar bekor; yoqilsa — hozirgi ma'lumotdan qaytadan qo'yiladi; telefon ruxsati — alohida holat).
   - **Web-trek:** A1 — bir xil · A2 — sahifa ochilganda «Xabarlar» tasmasi tepasida «Siz yo'q paytingizda: …» qatori: sayt oxirgi ko'rsatgan holatni brauzerda saqlaydi va keyingi ochilishda yangi `GET /oyinlar` javobi bilan solishtiradi —
     o'ziga tegishli o'yinlardan nechtasida holat boshqacha (Backend o'zgarmaydi; o'zgarishlar jurnali yo'q — tayanch 9.41 g; 09-FILTR 25) · A3 — `xabardan-ochdi`: faqat shu qator bosilib o'yin ochilganda (sahifa ochilishining o'zi emas).
   - 13-Modulda ham «qaytarish mexanikalari» darsi bor — bugun **bitta** mexanika quriladi; «mavzu tugadi» deyilmaydi, 13-Modul o'quvchi matnida va'da qilinmaydi (faqat O'qituvchi eslatmasida).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **qaytganlar foizi** — bir davrda ilovani ochganlardan keyingi davrda ham ochganlari foizi (0-ekranda — sonlardan keyin; 7-Modul so'zi, bir gapli ko'prik). «inglizchasi: retention» — **faqat** kartochkada, bir marta. Ishlatilmaydi: retention (prozada), ushlab qolish. Fe'li — «yana ochdi» (til-lint lug'ati: qaytish soni «yana ochish» fe'li bilan aytiladi).
   - **jonli xabar** — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar (4-darsdan, qayta ta'riflanmaydi). Ishlatilmaydi: toast, bildirishnoma, push.
   - **eslatma** · **rejalashtirilgan eslatma** — 4-darsdan. **o'yin eslatmasi** — 4-darsda qurilgan, o'yindan bir soat oldingi eslatma · **uch kunlik eslatma** — ilovani uch kun ochmagan odamga chiqadigan eslatma (bugun quriladi); ikkalasi — rejalashtirilgan eslatma. «O'yin kuni eslatmasi» — ishlatilmaydi. «Backend yuboradigan eslatma» bu darsda tilga olinmaydi (4-dars ishi; Mentor ilovasida yo'q). «push» — faqat `git push`. «Mahalliy eslatma» — o'quvchi matnida yo'q.
   - **hodisa** — **faqat** ulanish orqali yuboriladigan nomli xabar (`oyin-ozgardi`; tayanch 2: 9-dars — ulanish ma'nosi). `eslatmadan-ochdi`, `xabardan-ochdi`, `ochdi` — **«sanoq yozuvi»** (T-015; TAQIQLAR 7). Kod nomlari `hodisaYoz`, `hodisalar`, `POST /hodisalar` — faqat prompt va kod qatorida.
   - **qadam · qadamlar** — **faqat** foydalanuvchi yo'li (ochdi → ro'yxatdan o'tdi → qo'shildi → kelishini tasdiqladi; 8-darsdagi sanoq). Amaliyot blokidagi bo'laklar o'quvchi matnida «1 · Ochish», «2 · Prompt», «3 · Ishga tushirish», «4 · Tekshirish» deb ataladi, «qadam» emas (pilot `07` A-bo'lim 5 naqshi).
   - **test holati** — 4-darsdan (eslatma vaqtini vaqtincha bir daqiqadan keyinga qo'yib ko'rish, keyin qaytarish). «holat» bu darsda faqat shu birikmada.
   - **o'chirgich** — «Eslatmalar» (ilovadagi yoqish/o'chirish tugmasi). **sanoq sahifasi** · **sanoq yozuvi** · **qurilma** (sanoq birligi; «kishi» emas).
   - **e'lon** — faqat o'yin e'loni («E'lonlarni ko'ring» — o'yin e'lonlari). **xabar** — jonli xabar; web-trekda «Xabarlar» tasmasi. **tekshirish** — o'z ishi; «sinov» bu darsda yo'q.
   - **tashkilotchi · o'yinchi** (ismsiz) · tugmalar «Qo'shilaman» · «Kelaman» · «O'yindan chiqish» · «Hisobdan chiqish» · «Nusxalash» · «Bajardim» · «Davom etish».
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **APK** · **o'rnatish fayli** · **brauzer ko'rinishi**.
   - **Ishlatilmaydi:** retention (prozada), push (eslatma ma'nosida), bildirishnoma, toast, server (prozada), «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova va telefon ekrani), A1/A2/A3, `m10-09`, «Modul 12».
6. **Mentor misolidagi raqamlar (tayanch 1.9, 1.4, 9.2 — aynan):** 46 qurilma · 17 qurilma (birinchi uch kun / keyingi ikki kun) · uch kun · bir daqiqa (test holati) · «Shanba, 18:00 · Mahalla maydoni» · «2 joy qoldi».
   09-FILTR dan keyin tayanch 9.41 a ga kirganlar: taxminan 37% (17 / 46) · 2-ekran sahnasidagi «7 / 10» → «8 / 10» · sahnadagi yangi e'lon «Yakshanba, 18:00 · Maktab maydoni · 0 / 10» (maydon nomi — 11-Modul namuna o'yinlaridan) · uch kunlik eslatma soati 17:00 · hisoblagich «Bu hafta: N / 2» (sahna).
   Har son yonida nima sanalgani: **qurilma** (qaytganlar, sanoq) · **joy** («2 joy qoldi»). Statistika yoki tadqiqot deyilmaydi (T-043); 37% — «shu 46 qurilma bo'yicha sanalgan» (son — fakt; sababi haqida xulosa yo'q — 09-FILTR 8).
7. **Metafora yo'q. Keyssiz** (loyiha kuni, Qaror-0 22). Real kompaniya, brend yo'q. Qahramon yo'q — odamlar roli bilan: o'yinchi, tashkilotchi, sinfdosh («1-telefon · siz» / «2-telefon · boshqa o'yinchi» — sahna yorliqlari).
8. **Amaliyot bloki (tayanch 4, 11-Modul 9.1):** to'rt bandning hammasi o'quvchining **o'z repo'sida, o'z mahsuloti va trekida** (Ochish → Prompt → Ishga tushirish → Tekshirish); 5-band yo'q. Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam»da to'liq prompt).
   **Talab zinapoyasi (tayanch 4, 9-dars): uchala blokda uch qatorni o'quvchi yozadi**, namuna «Yordam» ortida. Har blok tepasida bitta qator «Vazifa: …» (umumiy, mahsulotga bog'liq emas). Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
   Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — 1-blok tepasida ikki tugma «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi — 11-Modul 9.77); farq — «Yordam» ostida bir gap va «Ochish»dagi web qatori.
   Xato yo'li (har blok 3-bandida, bitta gap): «Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»» Push odati: `git status` → `git add <fayl>` (`git add .` emas).
   Agent yaratgan tekshiruv yozuvlari — u aytgan `id` lar bo'yicha o'chiriladi (11-Modul 9.92); namuna va tekshiruv akkauntlari `namuna = true` (9.5).
9. **Uyga vazifa yo'q** (tayanch 4: loyiha kunlari 4, 9). Yakunda HwCard yo'q; ulgurmagan ish — yakun sarlavhasi holatga qarab aytadi (sinf 1). O'rnatish fayli navbatda qolsa — havola **keyingi dars boshida** almashtiriladi, «uyda» deyilmaydi (09-FILTR 38).
10. **Vaqt (90 daqiqa) va ulgurmagan yo'l:** taqsimot tepada. Har blokda «Ulgurmasangiz» qatori va «Ortda qoldingizmi». Tashqi kutish (Render deploy, o'rnatish fayli navbati) dars oqimini to'xtatmaydi: fayl 3-blok oxirida boshlanadi, navbat podium va arena paytida yuradi; tayyor bo'lmasa — havola keyingi dars boshida almashtiriladi (uyga vazifa yo'q).
    Yakun sarlavhasi holatga qarab — to'rt holat (11-ekran); mobil trekda qo'shimcha yorliq «O'rnatish fayli navbatda». O'qituvchi eslatmasi — 1-ekran.
11. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, qulf ekrani, Backend tuguni, konvert, chiziq — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida; logotip yo'q; rang — faqat holat foni (D3).
    Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda; «O'lchov» bo'limi).
12. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 06.10.2026; o'quvchiga ko'rinmaydi). Qisqasi: rejalashtirilgan eslatma Expo Go'da ham ishlaydi; `scheduleNotificationAsync` (trigger `DATE`), `cancelScheduledNotificationAsync(id)`, `cancelAllScheduledNotificationsAsync()`;
    ilova ochiq turganda eslatma ko'rsatilishi `setNotificationHandler` ga bog'liq (Mentor ilovasida 4-darsda qo'yilgan — ochiq paytda ham ko'rinadi, 9.36 i); eslatma bosilganini `addNotificationResponseReceivedListener` va oxirgi javob
    (`useLastNotificationResponse` / `getLastNotificationResponseAsync`) beradi; ruxsat holati — `getPermissionsAsync`; `content.data` — ko'rinmaydigan ma'lumot; `expo-notifications` web'da yo'q.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» ishga tushgan (7-dars), qadamlar sanalyapti (8-dars). Bugun Mentor sanog'ida ko'rinadi: ilovani ochganlarning ko'pi keyingi kunlarda yana ochmagan. Ilova yopiq bo'lsa, unda real vaqt yangilanishi ham, jonli xabar ham ko'rinmaydi —
  ochiq paytda foydali jonli xabar, yopiq paytda ilova oldindan qo'ygan foydali eslatma, keyin eslatmadan ochilganlar sanaladi. O'quvchi xuddi shuni o'z mahsulotida qiladi (uch blok).
- **Hook:** qaytmagan o'yinchining qulf ekrani → «unga nima ko'rinadi?» → 2-ekranda yopiq ilovaga boshqa odamning o'zgarishi yetmasligi → 1-blok (ochiq — jonli xabar) → 5-ekranda qaysi eslatma foydali → 2-blok (yopiq — eslatma) → 3-blok (sanoq va o'chirgich).
- **Bitta vizual — «ikki telefon va Backend» sahnasi** (tayanch 9.16; bitta manba `QAYTISH_SAHNA`, 163/180):
  - **chapda «1-telefon · siz»** (ramka ≈170×272, o'lcham barqaror — SABOQ 22; yorliq ramka ustida — SABOQ 23): «Maydon Jamoa» nomi o'z rangida; ikki ko'rinish — **ilova ochiq** («O'yinlar» ekrani, tepada ulanish belgisi; jonli xabar ekran tepasida) va **ilova yopiq** (telefon qulf ekrani; eslatma kartasi qulf ekraniga tushadi: «Maydon Jamoa» + matn).
  - **o'rtada Backend tuguni** — «Backend», ichida bir qatorli belgi «Database: N» (Shanba 18:00 o'yinidagi qo'shilganlar soni).
  - **o'ngda «2-telefon · boshqa o'yinchi»** — «O'yin» ekrani; harakat shu telefonda boshlanadi (halqa).
  - **chiziq** 1-telefon ↔ Backend: ilova ochiq — ochiq chiziq sekin yonib turadi; ilova yopiq — xira, yorliqsiz (ulanish qachon uzilishi ko'rsatilmaydi — 04-FILTR 1). **konvert** — so'rov («so'rov» / «javob») va hodisa (`oyin-ozgardi` yorlig'i). Uzuq chiziq oldida konvert so'nadi.
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (yetdi / o'tdi) → qizil (o'tmadi). Son almashganda bir lahza kattalashib qaytadi (11-Modul 9.14). `prefers-reduced-motion` da konvert yurmaydi, holatlar bir zumda almashadi (DE-200).
  - Ishlatilishi: 0 (1-telefon, qulf ekrani) · 1 (tayyor holat) · 2 (ikki telefon + Backend) · 5 (1-telefon qulf ekrani + tekshiruv kartasi) · bloklarning o'ng tomoni (kutilgan natija).
- **Yakun:** jonli xabar, eslatma, sanoq va o'chirgich tayyor · uyga vazifa yo'q · keyingi dars — Mentor tekshiruvi.

---

## 0 · Kirish — qaytmagan o'yinchi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Ilovani ochmay qo'ygan o'yinchiga nima ko'rinadi?** (49)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida ilovani ochgan qurilmalarning ko'pi keyingi ikki kunda uni yana ochmadi — avval javobni tanlang.
  - javobdan keyin: 7-Modulda bot uchun sanagan qaytganlar foizini bu yerda qurilmalar bo'yicha ko'rasiz; «Davom etish»ni bosing.
- Maket (chap): «1-telefon · siz» — yorliq «o'yinchi · ilova yopiq»; telefon qulf ekrani (soat va sana yozilmaydi — umumiy qulf ekrani, «Maydon Jamoa» belgisi yo'q).
  Telefon ostida bitta hisoblagich (SABOQ 24), ustida kichik yorliq «Mentor misolida»: «1–3-kun · ilovani ochgan qurilmalar — 46» · «4–5-kun · ulardan yana ochgani — 17» (ikki gorizontal ustun: 46 to'liq, 17 qisqa).
- Variantlar (radio, ballsiz):
  - Ilova ichidagi jonli xabar (26)
  - ✔ Telefon ekraniga chiqqan eslatma (32)
  - O'zi yangilangan o'yinlar ro'yxati (34)
- Javob — 2-variant: **Aynan!** Ilova yopiq bo'lsa, ichidagi narsa ko'rinmaydi. Telefon ekraniga esa eslatma chiqa oladi. (96)
- Javob — 1-variant: **Qiziq fikr!** Jonli xabar ilova ochiq paytda chiqadi. Ilova yopiq bo'lsa, uni hech kim ko'rmaydi. (95)
- Javob — 3-variant: **Qiziq fikr!** Ro'yxat ilova ochiq turganda yangilanadi. Ilovani ochmagan odam uni ko'rmaydi. (90)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → qulf ekraniga eslatma kartasi sirg'alib tushadi: «Maydon Jamoa» (o'z rangida) · «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring» →
  hisoblagich ostida qator chiqadi: «qaytganlar foizi — taxminan 37% · shu 46 qurilma bo'yicha sanalgan». Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
- ✎ Hook obyekti — darsning o'qitish obyekti (P-001): ilova yopiq turgan o'yinchi. Uchala variant «nima — qayerda» shaklida (ilova ichida · telefon ekranida · ro'yxatda); 1 va 3-variant — 4 va 3-darsda qurilgan narsa: payoff ularni yolg'onga chiqarmaydi, faqat «ilova ochiq paytda» ekanini aytadi (§119).
  Sonlar — tayanch 1.9 dan, maketda bir marta; Mentor ularni takrorlamaydi (P-062, §223). Atama «qaytganlar foizi» — sonlardan keyin (T-011); 7-Modul ko'prigi — bitta gap. Kartadagi eslatma matni — tayanch 1.9 (A2), 2-amaliyotda quriladi. «Aynan!» / «Qiziq fikr!» — qonun (T-028, T-067; 09-FILTR 29 — rad).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun ilovangizga qaytaradigan eslatma qo'shasiz.** (49)
- Mentor: Hodisadan eslatmagacha bo'lgan yo'lni uch blokda qurasiz — talabni siz yozasiz, namuna «Yordam»da turadi.
- Chap — «Dars oxirida»: sahna **tayyor** holatda, bir marta o'zi yuradi (DE-200): 1-telefon ochiq — tepada jonli xabar «Shanba, 18:00 — 2 joy qoldi» → telefon qulf ekraniga o'tadi → eslatma «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring» tushadi →
  eslatma bosiladi → ilova ochiladi → telefon ostida sanoq qatori «eslatmadan ochdi · +1» yashil yonadi.
- O'ng — bugungi uch ish (tex-karta «01 · matn», bosilmaydi; teg yo'q — 172, F-1003-06):
  - 01 · Ilova ochiq: foydali jonli xabar (32)
  - 02 · Ilova yopiq: oldindan qo'yilgan eslatma (39)
  - 03 · Eslatmadan ochilganlar sanaladi (31)
- Pastki qator (mono, kichik): o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m12-dars-09-start` · namuna `m12-dars-09-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Web-trekda 2-amaliyotda «Siz yo'q paytingizda» qatori quriladi.
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: eng og'ir qism — 2 va 3-amaliyot (ruxsat, test holati, eslatmani bosib ochish). Test holati har blok oxirida qaytarilganini kuzating: aks holda o'rnatish faylida eslatma bir daqiqada chiqib qoladi.
  Uyga vazifa yo'q: o'rnatish fayli navbatda qolsa, havola keyingi dars boshida almashtiriladi. Sinfdagi tekshiruv yozuvlari (`eslatmadan-ochdi`) 3-amaliyot oxirida `id` bo'yicha o'chiriladi — haqiqiy sanoqqa qo'shilmasin.
  `eslatmadan-ochdi` ilovaning istalgan eslatmasi bosilganini sanaydi: «uch kunlik eslatma shuncha odamni qaytardi» deyilmaydi. Haftalik chegara bugun telefonda tekshirilmaydi (bir hafta kerak) — «kodda bor, telefonda tekshirilmagan».
  13-Modulda qaytarish mexanikalari yana bor — o'quvchiga aytmang, bugun bitta mexanika.
- ✎ Mentorning birinchi gapi — App.jsx `sub` («hodisadan eslatmagacha — talabni siz yozasiz»; P-015). Sarlavhada yangi atama yo'q: «eslatma» 4-darsdan. «ilovangiz» — o'quvchida bor (T-039). Uch qator ot-shaklda (§224).

## 2 · Yopiq ilova nimani biladi?  ← QTushuncha (bashorat + 3 harakat)
- Eyebrow: Tushuncha · ochiq va yopiq ilova
- Sarlavha: **Yopiq ilova boshqa odamning o'zgarishini biladimi?** (50)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval taxminingizni belgilang, keyin ikkinchi telefonda «Qo'shilaman»ni bosing.
  - 1-harakatdan keyin: Xabar uchun yangi hodisa kerak bo'lmadi — endi birinchi telefonda «Ilovani yopish»ni, keyin ikkinchisida «E'lon berish»ni bosing.
  - 2-harakatdan keyin: Endi birinchi telefonda «Ilovani ochish»ni bosing.
  - tugagach: Uchala harakat tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»; kirishda karta yengil ko'tariladi, variantlar navbat bilan): **Ilova yopiq paytda yangi o'yin e'lon qilindi. Siz buni qachon bilasiz?** · Shu zahoti — telefon ekranida · Ilovani o'zingiz ochganingizda.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Sahna: chapda «1-telefon · siz» — ilova ochiq, «O'yinlar» ekrani, tepada belgi «Ulangan», karta «Shanba, 18:00 · Mahalla maydoni · 7 / 10» (siz bu o'yinga qo'shilmagansiz) · o'rtada Backend («Database: 7») ·
  o'ngda «2-telefon · boshqa o'yinchi» — «O'yin» ekrani «Shanba, 18:00» · «7 / 10» · «Qo'shilaman» (halqada). Har telefon ostida sahna tugmasi (chegarali, ramkadan tashqarida): 1-telefon — «Ilovani yopish» / «Ilovani ochish»; 2-telefon — «E'lon berish».
- **Harakat → Vizual o'zgarish:**
  - 1) «Qo'shilaman» (2-telefon) → konvert «so'rov» 2-telefondan Backend'ga → «Database: 7» → «8» → hodisa konvert `oyin-ozgardi` ochiq chiziq bo'ylab 1-telefonga → 1-telefondan konvert «so'rov» `GET /oyinlar` → javob qaytadi → kartada «7 / 10» → «8 / 10» →
    1-telefon tepasida jonli xabar sirg'alib tushadi: «Shanba, 18:00 — 2 joy qoldi» (bir necha soniya turadi, keyin yig'iladi). 2-telefonda xabar chiqmaydi (o'z harakati).
  - 2) «Ilovani yopish» (1-telefon) → telefon qulf ekraniga o'tadi, chiziq xira tortadi → «E'lon berish» (2-telefon) → konvert «so'rov» Backend'ga → Backend ichida qator «+1 o'yin» →
    1-telefon tomon konvert chizilmaydi; qulf ekrani o'zgarmaydi, yonida kulrang yorliq «jonli xabar ko'rinmadi».
  - 3) «Ilovani ochish» (1-telefon) → ilova ochiladi, belgi «Ulanmoqda…» → «Ulangan» → konvert `GET /oyinlar` → ro'yxat tepasida yangi karta sirg'alib kiradi va ~1 s yashil yonadi: «Yakshanba, 18:00 · Maktab maydoni · 0 / 10»; jonli xabar chiqmaydi.
  - Holat o'quvchi bosgan tartibdan chiziladi (P-046); noto'g'ri tanlov yo'q — qaror bashoratda, natija harakatda.
- Joriy qator (3/3 dan keyin, bitta): Bu ilovada yopiq telefonga faqat ilova oldindan qo'ygan eslatma chiqadi. (72)
- Natija qatori (xulosaning birinchi qatori, SABOQ 25): «Taxminingiz: … · haqiqatda: ilovani o'zingiz ochganingizda» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda jonli xabar faqat ochiq ilovada ko'rinadi: yopiq ilova o'zgarishni ochilgandagina ko'radi. (101)
- Tugadi (199): harakat paneli va sahna tugmalari yopiladi; ikki telefon va Backend butun enga, 1-telefondagi yangi karta fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/3) → Davom etish
- ✎ Bitta g'oya (P-008): ochiq ilovada jonli xabar ko'rinadi, yopig'ida ko'rinmaydi (tayanch 1.4 halol chegarasi; Qaror-0 8; 04-FILTR 1 dan keyin natija tilida). 1-harakat 1-blokni ko'rsatadi (yangi hodisasiz jonli xabar), joriy qator — 2-blokka ko'prik.
  «Ilovani yopish/ochish», «E'lon berish» — sahna tugmalari (haqiqiy ilovada e'lon formasi bor); o'quvchi matnida «sahna» so'zi yo'q. Bashorat — vaqt bo'yicha ikki daraja (S-015). 1-savol shu qoidani boshqa xabar bilan so'raydi (§106).
  «Yopiq» — telefon qulf ekrani; ilova fonda turgan holat bu darsda ko'rsatilmaydi (Shubhali 4).

## 3 · Amaliyot 1 — jonli xabar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈18 daq)
- Eyebrow: Amaliyot 1 · ilova ochiq
- Sarlavha: **Ilova ochiq paytda foydali jonli xabar chiqsin.** (47)
- Mentor: Talabni uch qatorda o'zingiz yozasiz, Mentor namunasi «Yordam» ortida; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni jonli xabarda ko'radi — ism yo'q, o'z harakati uchun emas.
- Bandlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching — 8-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. Mobil trekda `npx expo start` ishlab tursin, ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz ochiq tursin.
     Ikki savolga javob toping: ilova ochiq turganda foydalanuvchi qaysi o'zgarishni bilsa, biror ish qiladi? Xabarda nima yoziladi? (Mentor misolida: o'zi qo'shilmagan o'yinda bir yoki ikki joy qolsa — «Shanba, 18:00 — 2 joy qoldi».)
     Mahsulotingizda shunday o'zgarish bo'lmasa — 4-darsdagi jonli xabarlaringizdan birini foydaliroq qiling: matni foydalanuvchiga keyin nima qilishini aytsin.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — jonli xabarlar (4-darsda qurilgan joy) va «O'yinlar» ekrani.
     > Nima qilsin: `oyin-ozgardi` kelib, ilova `GET /oyinlar` ni qayta so'ragach, o'yinchi qo'shilmagan o'yinda bir yoki ikki joy qolgan bo'lsa, jonli xabar chiqsin: «{kun}, {soat} — {N} joy qoldi» (masalan, «Shanba, 18:00 — 2 joy qoldi»).
     > Joy soni — kerak bo'lganlar minus qo'shilganlar. Yangi hodisa qo'shma: son qayta so'ralgan javobdan olinsin. Ilova ochiq turgan davrda bir o'yinda bir xil son uchun xabar bir marta chiqsin.
     > Nima buzilmasin: 4-darsdagi jonli xabarlar (ular faqat menga tegishli o'yin uchun) va «Hozir ko'ryapti» avvalgidek; xabarda ism yo'q; o'yinchining o'z harakati uchun xabar chiqmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida ilova o'rniga sayt papkangizdagi jonli xabarlar va o'yinlar sahifasi turadi; xabar «Xabarlar» tasmasiga ham tushadi (4-darsdagidek), qolgani o'sha.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "jonli xabar: joy qoldi"`, `git push`.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabingizning har qatorini ko'ring:
     (1) Ilovangiz ochiq tursin. O'zgarishni boshqa akkaunt qilsin: sherigingiz o'z akkauntidan — ilovangiz o'rnatilgan telefonida yoki brauzer ko'rinishida (web-trekda — kompyuterdagi ikkinchi oynada, ikkinchi akkaunt bilan).
         Sherik bo'lmasa — agent: tekshiruv akkauntlari ochadi (namuna ma'lumot bilan, `namuna = true`), ular nomidan so'rov yuboradi va qaysi akkaunt, qaysi `id` ekanini aytadi.
         Mentor misolida: siz qo'shilmagan, uch joy qolgan o'yin kerak — sherik unga qo'shiladi. Bunday o'yin bo'lmasa, agentga: «Men qo'shilmagan bitta o'yinni tanla. Tekshiruv uchun yangi akkauntlar och (namuna ism va login bilan, haqiqiy emas, `namuna = true`)
         va ular nomidan qo'shilish so'rovlarini bittadan yubor, uch joy qolganda to'xta. Qaysi akkauntlar va qaysi o'yin `id` si ekanini ayt.» Sherik bo'lmasa — «ikki joy qolganda to'xta».
         Telefoningizda son o'zgarishi va jonli xabar chiqishi kerak. Chiqmasa — nima kutganingiz va nima ko'rganingizni agentga yozing.
     (2) «Nima buzilmasin» qatoringizni tekshiring (Mentor misolida: shu o'yinga o'zingiz qo'shiling — sizga xabar chiqmasligi kerak).
     (3) Agent tekshiruv akkauntlari ochgan bo'lsa — agentga: «Faqat hozir yaratgan tekshiruv akkauntlari va yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» Agentning «bajardim» degani — uning so'zi; xabarni esa o'zingiz ko'rdingiz.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; ikki kadr bir marta o'zi yuradi):
  - kadr 1: «O'yinlar» · «Shanba, 18:00 · Mahalla maydoni · 7 / 10»
  - kadr 2: «8 / 10» · ekran tepasida jonli xabar «Shanba, 18:00 — 2 joy qoldi»
  - web-trekda: brauzer oynasi, o'sha xabar sahifa tepasida va «Xabarlar» tasmasida.
- Hammasi bajarilgach (yashil): Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni ko'radi. (74)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-09-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi ishni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Ulgurmasangiz: tekshiruv akkauntlarini o'chirishni dars oxiriga qoldiring. Xabar chiqishini o'zingiz ko'rmasdan 2-amaliyotga o'tmang — keyin qaysi o'zgarish buzganini ajratish qiyin bo'ladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ Talab zinapoyasi — uch qator o'quvchidan (tayanch 4, 9-dars). «Bir yoki ikki joy» — nol joy 4-darsdagi «o'yin to'ldi» (faqat o'z o'yiniga); `qoshilgan` — 11-Modul sanog'i (`qoshildi` yoki `keladi`; 11-Modul 9.86) — 09-FILTR 10.
  Bu xabar — yangi: qo'shilmagan o'yin uchun; 4-darsdagi «faqat o'ziga tegishli o'yin» qoidasi 4-darsda qurilgan xabarlarga tegishli bo'lib qoladi (tayanch 1.4, 9.41 e; 09-FILTR 9). «Bir marta» — ilova ochiq turgan davrda (ilova xotirasida; qayta ochilganda yana chiqishi mumkin — 09-FILTR 11).
  Tekshiruv: sherik — birinchi yo'l, agent — zaxira (tayanch 9.37 h; 09-FILTR 12). 2-amaliyotga faqat xabarni ko'rgandan keyin: tekshiruvni keyinga surish yo'li olib tashlandi (09-FILTR 39) — «Davom etish» 4-band «Bajardim»idan keyin ochiladi (akkauntlarni o'chirish — (3) — dars oxirida ham bo'ladi).
  Backend o'zgarmaydi — Render deploy kutilmaydi.

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Mentor ilovasi yopiq. «2 joy qoldi» xabari o'yinchiga chiqadimi?** (9 so'z)
  - A · Chiqadi — jonli xabar telefon ekranida ko'rinadi (48)
  - B · ✔ Chiqmaydi — jonli xabar ochiq ilovada chiqadi (45)
  - C · Chiqadi — ilova uni yopiq paytda ham oladi (42)
  - D · Chiqmaydi — bu xabar faqat tashkilotchiga chiqadi (49)
- Kalit: **B** (index 1). To'rttalasi «Chiqadi / Chiqmaydi — sabab» shaklida, ikkitadan (S-006, §107); «jonli xabar» A va B da, «ilova» B va C da, «faqat» — D da (S-003); to'g'ri variant yolg'iz eng uzun emas (o'lchov pastda).
- To'g'ri izohi: Jonli xabar faqat ochiq ilovada ko'rinadi. (42)
- Xato izohlari (≤60):
  - A: Jonli xabar ilova ichida chiqadi. Ilova yopiq bo'lsa-chi? (57)
  - C: Ilova yopiq bo'lsa, jonli xabarni kim ko'radi? (46)
  - D: Mentor misolida bu xabar o'yinga qo'shilmaganlarga chiqadi. (59)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda e'lon yetmagani ko'rindi; savol boshqa xabarni («2 joy qoldi») so'raydi — javob slayddan ko'chirilmaydi (§106). C — «yopiq ilova ham oladi» yanglish tasavvuri; «Mentor ilovasi» chegarasi bilan (Backend yuboradigan eslatma bu ilovada yo'q) yolg'on emas, haqiqatda ham noto'g'ri (sinf 8).

## 5 · Qaysi eslatma foydali?  ← QTushuncha (bashorat + 5 harakat, bittadan)
- Eyebrow: Tushuncha · foydali eslatma
- Sarlavha: **Telefon ekraniga qanday eslatma chiqsin?** (40)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor misolida eslatmaning to'rtta matni bor — avval taxminingizni belgilang.
  - harakat paytida: Matnni «Qoidadan o'tkazish» bilan tekshiring va o'ngdagi uch katakni kuzating.
  - to'rttasidan keyin: Endi telefon ostidagi «Eslatmalar» o'chirgichini bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; tanlangach ixcham qator): **To'rt matndan nechtasi qoidadan o'tadi?** · Bittasi · Ikkitasi · Uchtasi.
- Chap: «1-telefon · siz» — yorliq «o'yinchi · ilova yopiq»; qulf ekrani; ramka ustida hisoblagich «Bu hafta: 0 / 2». Matn kartasi qulf ekraniga bittadan tushadi, ustida «Matn N / 4» (2-kartada qo'shimcha kichik yorliq «4-darsdagi o'yin eslatmasi»);
  harakat tugmasi «Qoidadan o'tkazish» — karta ostida, halqada (SABOQ 21). Telefon ostida o'chirgich «Eslatmalar» (yoqiq) — 5-harakatgacha xira, bosilmaydi.
- O'ng: tekshiruv kartasi «Foydali eslatma» (ostida kichik kulrang yorliq «bu kursda · rejalashtirilgan eslatma uchun») — uch bo'sh katak: «O'z ishiga tegishli, foydasi aniq» · «Rost: ilova buni oldindan biladi» · «Bosim, qo'rqitish, uyaltirish yo'q».
- Matnlar (shu tartibda; Mentor misoli — 2-si tayanch 1.4 dan, 4-si tayanch 1.9 dan aynan; 1 va 3 — tayanch 9.41 a):
  1. «Sizni sog'indik! Maydon Jamoa'ga qayting» → ✗ · ✓ · ✗ — qizil qator: Foyda aytilmagan — faqat bosim. (31)
  2. «Bugun, 18:00 · Mahalla maydoni» → ✓ · ✓ · ✓
  3. «Yangi o'yin e'lon qilindi: qo'shiling» → ✓ · ✗ · ✓ — qizil qator: Yopiq ilova yangi e'lonni bilmaydi. (35)
  4. «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring» → ✓ · ✓ · ✓
- **Harakat → Vizual o'zgarish:**
  - Har matnda «Qoidadan o'tkazish» → o'ngdagi uch katakka ✓ yoki ✗ navbat bilan «tushadi» (SABOQ 19) → hammasi ✓ bo'lsa karta yashil chegara oladi, qulf ekranida qoladi va hisoblagich «Bu hafta: 1 / 2» → «2 / 2» (o'yin eslatmasi ham sanaladi);
    ✗ bo'lsa karta qizil chegara bilan so'nadi va ✗ katak yonida qisqa qizil qator chiqadi. Keyingi matn kartasi tushadi, kataklar bo'shaydi.
  - 4-matndan keyin hisoblagich ostida kulrang qator chiqadi: Hafta to'ldi: ilova bu hafta o'zidan yangi eslatma qo'shmaydi. (62)
  - 5) «Eslatmalar» o'chirgichi (to'rttasidan keyin halqada) → o'chadi → qulf ekranidagi ikki karta so'nadi, hisoblagich «Bu hafta: 0 / 2», kulrang qator yo'qoladi.
  - Holat matnlar tartibidan chiziladi; noto'g'ri tanlov yo'q — qaror bashoratda.
- Joriy qator (5-harakatdan keyin, bitta): O'chirgich foydalanuvchida: o'chirsa, rejalashtirilgan eslatmalar bekor bo'ladi. (80)
- Natija qatori: «Taxminingiz: … · haqiqatda: ikkitasi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi. (105)
- Tugadi (199): harakat paneli yopiladi; telefon (o'chirgich o'chiq holat) va tekshiruv kartasi butun enga, xulosa fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Matnni tekshiring (N/4) → O'chirgichni bosing → Davom etish
- ✎ Foydali eslatma qoidasi — tushuncha ekranida (MD_TOPSHIRIQ_2, 9-band); «Bu kursda» — sinf 2a; qoida rejalashtirilgan eslatma uchun (09-FILTR 15 — Backend yuboradigan eslatma yangi voqeani rost ayta oladi, u bu modulda qurilmaydi). Uchinchi katak («Rost …») — Mentor misolining halol chegarasi (tayanch 1.9, 9.41 a).
  2-matn — 4-darsda qurilgan o'yin eslatmasi (o'yin kuni 9:00 eslatmasi olib tashlangach — tayanch 9.41 c): o'quvchi o'zi qurgan eslatma qoidadan o'tishini va haftalik sanoqqa kirishini ko'radi (09-FILTR 1 — hamma eslatma sanaladi).
  Kulrang qator «Hafta to'ldi …» — chegaraning aniq ma'nosi: ilova o'zidan qo'shmaydi; o'yinchi o'zi qo'shilgan o'yinning eslatmasi baribir qo'yiladi (O'qituvchi eslatmasi, A-bo'lim 4). Matn qoidani sanab bermaydi (P-036), kataklar va hisoblagich ko'rsatadi.
  1-matn — «sizni sog'indik» (tayanch 1.9 da bosim namunasi sifatida). 2-savol qoidani yangi matnlarda so'raydi (§106).

## 6 · Amaliyot 2 — ilova yopiq paytdagi eslatma  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈18 daq)
- Eyebrow: Amaliyot 2 · ilova yopiq
- Sarlavha: **Ilova yopiq bo'lsa ham foydali eslatma chiqsin.** (47)
- Mentor: Eslatma matnini uch katak bilan o'zingiz tekshirib yozing; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Ilova o'zi oldindan bitta eslatma qo'yadi — ilovani bir necha kun ochmagan foydalanuvchiga; u ilova bilgan narsani aytadi va hafta ikkitaga to'lgan bo'lsa qo'yilmaydi.
- Bandlar (hammasi o'z repo'ngizda):
  1. **Ochish** — o'z repo'ngiz, 1-amaliyotdan keyingi kod. 4-darsdagi eslatma qayerda qo'yilganini agentdan so'rang yoki faylni oching. Ikki savolga javob toping: ilovani bir necha kun ochmagan foydalanuvchiga nima foydali? Ilova buni oldindan biladimi?
     Matningizni oldingi mashqdagi uch katak bilan tekshiring. Mentor misolida bitta eslatma: ilova oxirgi ochilgandan uch kun o'tib, soat 17:00 da — «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring».
     U ilovani uch kun ochmagan odamga chiqadi: har kuni ochadigan odamga umuman chiqmaydi.
     Haftalik chegara: shu haftada (dushanbadan yakshanbagacha) ilovaning ikkita eslatmasi bo'lsa — 4-darsdagi o'yin eslatmasi ham sanaladi — bu eslatma qo'yilmaydi.
     Mahsulotingizda foydalanuvchining vaqti ma'lum ishi bo'lsa (masalan, topshirish muddati) — eslatmani shunga bog'lash mumkin; bo'lmasa — Mentor misolidagidek: bir necha kun ochilmaganda, taklif shaklida.
     Web-trekda: sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi. Bugun sahifa ochilganda «Xabarlar» tasmasi tepasida «Siz yo'q paytingizda: …» qatori quriladi.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — eslatmalar (4-darsda `expo-notifications` qo'shilgan joy) va ilova ochiladigan joy.
     > Nima qilsin: ilova har ochilganda oldingi uch kunlik eslatma bekor qilinsin va yangisi uch kundan keyin soat 17:00 ga qo'yilsin: sarlavha «Maydon Jamoa», matn «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring». Faqat hisobga kirgan foydalanuvchiga qo'yilsin.
     > Haftalik chegara: o'sha haftada (dushanbadan yakshanbagacha) ilovaning ikkita eslatmasi bo'lsa — o'yin eslatmasi ham sanalsin — uch kunlik eslatma qo'yilmasin. O'yinga qo'shilgan yoki o'yindan chiqqandan keyin ham shuni qayta hisobla.
     > Qo'yilgan eslatmalarning vaqti telefonda saqlansin — hisob shundan olinsin.
     > Nima buzilmasin: 4-darsdagi o'yin eslatmasi va ruxsat so'rash avvalgidek; hisobdan chiqilganda bu eslatma ham bekor bo'lsin; brauzer ko'rinishida eslatma qo'yilmasin, u yerda ilova ishlayversin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida; ikki gap): «Qayerda» — sayt papkangizdagi «Xabarlar» tasmasi va o'yinlar sahifasi (Backend o'zgarmaydi); «Nima qilsin» — sayt o'zingizga tegishli o'yinlarning oxirgi ko'rsatilgan holatini
     (qo'shilganlar soni va sizning holatingiz) brauzerda saqlasin; keyingi ochilishda yangi javobni saqlangani bilan solishtirsin va tasma tepasida bitta qator ko'rsatsin: «Siz yo'q paytingizda: {N} ta o'yiningizda o'zgarish bo'ldi»; farq bo'lmasa — qator chiqmasin.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "qaytaradigan eslatma"` → `git push`. Mobil trekda Expo Go'da tekshirasiz — rejalashtirilgan eslatma Expo Go'da ham ishlaydi.
     Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi; Backend o'zgarmagan — Render kutilmaydi.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — test holatida tekshirasiz:
     (1) Agentga: «Test holati: uch kunlik eslatmani bir daqiqadan keyinga qo'y, haftalik chegarani vaqtincha o'chir. Qaysi qatorlarni o'zgartirganingni ayt.» Ilovani oching va yoping — bugun yopiq holatni tekshirasiz.
         Bir daqiqadan keyin qulf ekranida eslatma chiqishi kerak. Chiqmasa — ruxsatni tekshiring: ruxsat bermagan bo'lsangiz — telefon sozlamalaridan yoqiladi.
     (2) Ilovani ochib yoping va bir daqiqa o'tmasdan yana ochib yoping — eslatma bitta chiqishi kerak, ikkita emas: oldingisi bekor bo'ladi.
     (3) Haftalik chegara bugun telefonda tekshirilmaydi — buning uchun bir hafta kerak. Agentdan qaysi qator buni tekshirishini so'rang va o'sha qatorni o'zingiz o'qing: bu — kodni o'qish, telefondagi tekshiruv emas.
     (4) Agentga: «Test holatini olib tashla: vaqt va haftalik chegara avvalgidek bo'lsin.» `git status` va `git diff` da test holatidan o'zgarish qolmaganini ko'ring; tekshiruvda tuzatilgan joy bo'lsa — `git add <fayl>` → commit → `git push`.
     Web-trekda: saytingizni yoping; sherigingiz o'z akkauntidan (yoki agent) sizning o'yiningizda o'zgarish qilsin; saytni qayta oching — «Siz yo'q paytingizda» qatorida son bo'lishi kerak. Hech narsa o'zgarmagan bo'lsa — qator chiqmasligi kerak.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon qulf ekrani, nom o'z rangida; ustida kichik yorliq «test holati: bir daqiqa»):
  - «Maydon Jamoa · Hafta oxiriga o'yin bormi? E'lonlarni ko'ring»
  - web-trekda: brauzer oynasi, «Xabarlar» tasmasi tepasida qator «Siz yo'q paytingizda: 2 ta o'yiningizda o'zgarish bo'ldi».
- Hammasi bajarilgach (yashil): mobil trek — Ilova yopiq paytda eslatma chiqdi; qayta ochilganda oldingisi bekor bo'ldi. (75) · web-trek — Sayt qayta ochilganda o'zgargan o'yinlaringiz soni ko'rindi. (60)
- Qator (kichik, kulrang, yashil qator ostida; faqat mobil trekda): Haftalik chegara — kodda bor, telefonda tekshirilmagan. (55)
- Qator (`QIzoh`, natija ostida): mobil trek — Eslatmani ilovaning o'zi qo'ygan: u faqat ilova oxirgi ochilganda bilgan narsani aytadi. (88) · web-trek — Qator hozirgi holati oxirgi ko'rganingizdan farq qiladigan o'yinlarni sanaydi — oradagi har o'zgarishni emas. (109)
- Pastki qator: Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-09-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi).
- Ulgurmasangiz: haftalik chegarani 3-amaliyotdan keyin qo'shing; test holatini olib tashlashni o'tkazib yubormang.
- Nishon (bonus): Reminder Set — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ Bitta eslatma — uch kunlik (tayanch 1.9, 9.41 c; o'yin kuni 9:00 eslatmasi olib tashlandi — 09-FILTR 2, 41): «Kelaman»da bekor qilish, 10:00 chegarasi, yangilanishdan oldin qo'shilgan o'yinlar (09-FILTR 17, 18) — endi yo'q. 17:00 — tayanch 9.41 a (tunda chiqmasin).
  «Test holati» — 4-dars so'zi (tayanch 1.4). Mentor ilovasida eslatma ochiq paytda ham ko'rinadi (4-darsda `setNotificationHandler` — 9.36 i); «ilovani yoping» — bugungi tekshiruv yopiq holat haqida bo'lgani uchun (avvalgi «ochiq tursa ko'rinmasligi mumkin» gapi 9.36 i ga zid edi — olib tashlandi).
  Haftalik chegara — hamma eslatma sanaladi, hafta dushanba–yakshanba (tayanch 9.41 b; 09-FILTR 1, 8); telefonda tekshirilmaydi — yashil qator buni da'vo qilmaydi, alohida kulrang qator ochiq aytadi (09-FILTR 40). «Hisobga kirgan» va «hisobdan chiqilganda bekor» — 7-dars qoidasi (9.36 i).
  Web-trek: Backend o'zgarmaydi — «Maydon Jamoa»da o'zgarishlar jurnali yo'q, Backend sonni to'qib bera olmaydi (09-FILTR 25); sayt o'zi ko'rgan ikki holatni solishtiradi — 4-darsdagi «javobni oldingisi bilan solishtirish» naqshi (9.36 a). Brauzer ko'rinishi qatori — `expo-notifications` web'da yo'q (tayanch 6).
  Agentning «bajardim» degani — da'vo; isbot — qulf ekranidagi eslatma.

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (yorliqsiz — SABOQ 6)
- Savol: **Qaysi eslatma darsdagi uch katakdan o'tadi?** (6 so'z)
  - A · «Hamma o'ynayapti, faqat siz yo'qsiz!» (38)
  - B · «Kecha beshta yangi o'yin e'lon qilindi» (40)
  - C · ✔ «Ertaga o'yiningiz bor: Shanba, 18:00» (38)
  - D · «Bugun ochmasangiz, o'yinsiz qolasiz» (37)
- Kalit: **C** (index 2). To'rttalasi eslatma matni, qo'shtirnoqda, bir xil shaklda; vergul va ikki nuqta har xil variantda (S-003); «o'yin» ildizi A, B, C, D da; to'g'ri variant yolg'iz eng uzun emas (o'lchov pastda).
- To'g'ri izohi: O'z o'yini, aniq vaqt — ilova buni oldindan biladi. (51)
- Xato izohlari (≤60):
  - A: Bu gap uyaltiradi. O'yinchiga qanday foyda bor? (47)
  - B: Yopiq ilova kechagi e'lonlarni qayerdan biladi? (47)
  - D: Bu gap qo'rqitadi. Foyda qayerda? (33)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 5-ekran matnlari emas, yangi to'rt matn (§106); har noto'g'ri variant bitta katakdan o'tmaydi: A — bosim (uyaltirish), B — rost emas (ilova bilmaydi), D — bosim (qo'rqitish). Matnlar — test uchun yozilgan (Mentor misoli emas), sonlar olam ichida (T-008).

## 8 · Amaliyot 3 — sanoq va o'chirgich  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈21 daq)
- Eyebrow: Amaliyot 3 · o'lchov va nazorat
- Sarlavha: **Eslatmadan ochilganlar sanalsin, o'chirgich bo'lsin.** (52)
- Mentor: Eslatma bosilib nechta qurilmada ilova ochilganini sanoq ko'rsatadi; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Eslatma bosilib ilova ochilganda sanoq yozuvi qo'shiladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.
- Tepada (bitta qator, `pm-m10d8-qadamlar`): 8-darsdagi qadamlaringiz: **{nom · soni}** ({sana}; `tur: 'mashq'` bo'lsa — kulrang «mashq sonlari», 08-FILTR 5) · kalit yo'q bo'lsa — «8-darsdagi sanoq sahifangizni oching».
- Bandlar (hammasi o'z repo'ngizda):
  1. **Ochish** — sanoq sahifangizni oching (8-dars, kalit bilan): qadamlar qatorlari turibdi. Bugun ularning ostiga yangi qator qo'shiladi — eslatma bosilib ilova ochilgan qurilmalar soni.
     Bu son eslatma bosilganini aytadi; eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi.
     O'chirgich qayerda turishini o'ylang (Mentor misolida — «Hisobdan chiqish» yonida, nomi «Eslatmalar»; sozlama ekani ko'rinib tursin — chiqish tugmasiga o'xshamasin).
     Web-trekda: sanoq yozuvi `xabardan-ochdi` — «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda (sahifa ochilishining o'zi emas); o'chirgich nomi «Xabarlar».
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — ilova ochiladigan joy, eslatmalar va «Hisobdan chiqish» turgan joy; `backend/` — `POST /hodisalar` va `GET /hodisalar/sanoq`; `lending/sanoq.html`, `lending/maxfiylik.html`.
     > Nima qilsin: ilovaning istalgan eslatmasi (o'yin eslatmasi ham, uch kunlik ham) bosilib ilova ochilganda `hodisaYoz('eslatmadan-ochdi')` chaqirilsin — ilova fonda bo'lsa ham, butunlay yopiq bo'lsa ham; bitta bosishga bitta yozuv.
     > `POST /hodisalar` qabul qiladigan nomlarga `eslatmadan-ochdi` qo'shilsin. `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «eslatmadan ochdi» — turli qurilmalar soni.
     > «Hisobdan chiqish» yonida «Eslatmalar» o'chirgichi bo'lsin — sozlama ko'rinishida, chiqish tugmasidan ajralib tursin; sukutda yoqiq, tanlov telefonda saqlansin. O'chirilsa — rejalashtirilgan hamma eslatma bekor qilinsin va yangisi qo'yilmasin.
     > Yoqilsa — hozirgi ma'lumotdan kerakli eslatmalar qaytadan qo'yilsin: men qo'shilgan, hali boshlanmagan o'yinlar uchun o'yin eslatmasi (bir soatdan kam qolgan bo'lsa — yo'q) va uch kunlik eslatma; o'tib ketgan o'yin uchun qo'yilmasin.
     > Telefonda eslatmalarga ruxsat berilmagan bo'lsa, o'chirgich ostida qator chiqsin: «Telefon sozlamalarida eslatmalarga ruxsat berilmagan».
     > `lending/maxfiylik.html` dagi «qaysi ma'lumot» javobiga bitta gap qo'sh: «Ilova eslatmadan ochilgani ham qurilma ID bilan sanaladi.»
     > Nima buzilmasin: to'rt qadam sanog'i avvalgidek; sanoq sahifasi faqat kalit bilan ochilsin; sanoq yozuvida ism, login va token bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): nom `xabardan-ochdi` — faqat «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda; o'chirgich «Xabarlar» — o'chirilsa qator chiqmaydi, tanlov brauzerda saqlanadi; qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "eslatma sanog'i va o'chirgich"` → `git push`. Backend o'zgardi — Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin);
     kutayotganda agent yozgan fayldan o'chirgich eslatmalarni bekor qiladigan qatorni toping. Lending sahifalari ham o'zgardi — Netlify'dagi lending saytingiz yangilanganini 1-darsdagi yo'l bilan tekshiring.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabingizning har qatorini ko'ring:
     (1) Agentga: «Test holati: uch kunlik eslatmani bir daqiqadan keyinga qo'y, haftalik chegarani vaqtincha o'chir.» Ilovani oching va butunlay yoping (oxirgi ilovalar ro'yxatidan ham). Eslatma chiqqach uni bosing — ilova ochilishi kerak.
         Eslatma chiqmasa — ilovani yopmasdan telefonni qulflab, qayta urinib ko'ring va qaysi holatda ishlaganini yozib qo'ying.
     (2) Sanoq sahifangizga qarang — «eslatmadan ochdi» qatorida 1 qurilma chiqishi kerak. Bitta ochilish ikki yozuv beradi: `ochdi` (har ochilishda) va `eslatmadan-ochdi` (eslatma orqali ochilgani) — bu xato emas.
         Sanoq sahifasi hali yo'q bo'lsa — Neon SQL Editor'da: `SELECT COUNT(DISTINCT qurilma_id) FROM hodisalar WHERE nom = 'eslatmadan-ochdi';` → «Run».
     (3) «Eslatmalar»ni o'chiring va ilovani yoping — bir daqiqadan keyin eslatma chiqmasligi kerak. Ilovani ochib, o'chirgichni yoqing va yana yoping — eslatma chiqishi kerak; bu safar uni bosmang, surib tashlang.
     (4) Tekshiruv yozuvlarini haqiqiy sanoqdan chiqaring. Neon SQL Editor'da: `SELECT id, yaratilgan FROM hodisalar WHERE nom = 'eslatmadan-ochdi' ORDER BY yaratilgan;` → «Run» — har bosishingizga bitta qator bo'lishi kerak, ikkita emas.
         Ro'yxatda faqat bugun o'zingiz bosgan vaqtdagi qatorlar bo'lishi kerak; boshqa qator bo'lsa — unga tegmang. Agentga: «`hodisalar` jadvalidan faqat shu `id` li tekshiruv yozuvlarini o'chir: {id lar}.» Sanoq sahifasida qator 0 ga qaytadi.
     (5) Agentga: «Test holatini olib tashla: vaqt va haftalik chegara avvalgidek bo'lsin.» `git status` va `git diff` da test holatidan o'zgarish qolmaganini ko'ring; tekshiruvda tuzatilgan joy bo'lsa — `git add <fayl>` → commit → `git push`.
     Web-trekda: «Siz yo'q paytingizda» qatorini bosing — sanoq sahifasida «xabardan ochdi» qatorida 1 qurilma chiqishi kerak; «Xabarlar»ni o'chirib, saytni qayta oching — qator chiqmasligi kerak; tekshiruv yozuvlarini xuddi shunday o'chiring (nom — `xabardan-ochdi`).
     Oxirida (mobil trek): odamlardagi ilova uchun yangi o'rnatish fayli kerak — `eas build -p android --profile preview`. Navbatni kutmang: «Bajardim»ni bosing va davom eting.
     Fayl dars oxirigacha tayyor bo'lsa — lendingdagi «Android: ilovani o'rnatish» havolasini almashtiring; bo'lmasa — keyingi dars boshida.
- Blok ostida (faqat mobil trekda, oxirgi «Bajardim»dan keyin; ikki tugma, bittasi tanlanadi): «Havola almashtirildi» · «Fayl navbatda» — yakundagi yorliq shundan (8-darsdagi «Yangi versiya chiqdi» tanlovi naqshi).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki maket bir marta o'zi yuradi):
  - telefon: qulf ekrani eslatmasi bosiladi → «O'yinlar» ochiladi; «Hisobdan chiqish» yonida o'chirgich «Eslatmalar» (yoqiq) — sozlama qatori ko'rinishida, tugma emas
  - sanoq sahifasi (brauzer oynasi `…/sanoq.html`): to'rt qadam qatorlari (kulrang, sonsiz) · ostida yangi qator yashil yonadi: «eslatmadan ochdi · 1 qurilma» · yorliq «Mentorning o'z telefoni — tekshiruv; keyin o'chiriladi»
- Hammasi bajarilgach (yashil): Eslatmadan ochilganlar sanaladi; foydalanuvchi eslatmalarni o'zi o'chira oladi. (79)
- Qator (`QIzoh`, natija ostida; faqat mobil trekda): APK o'zi yangilanmaydi: eski faylni o'rnatganlarda bugungi eslatma yangisini o'rnatgandan keyin paydo bo'ladi. (110)
- Pastki qator: Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-09-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi).
- Ulgurmasangiz: sanoq qatori va o'chirgich birinchi; maxfiylik gapini dars oxirida, o'rnatish faylini keyingi dars boshida bajaring. Tekshiruv yozuvlarini o'chirishni o'tkazib yubormang.
- Nishon (bonus): Come Back — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ `eslatmadan-ochdi` — «sanoq yozuvi» (tayanch 2, T-015); «qadamlar ostida» — qadam faqat foydalanuvchi yo'li. `POST /hodisalar` nom ro'yxati — 7-dars (pilot `07` A1 talabi: boshqa nom — `400`).
  **Nimani sanaydi (tayanch 9.41 d; 09-FILTR 5, 12, 22):** ilovaning istalgan eslatmasi bosilib ilova ochilgani; sabab emas (Mentor gapi va asosiy fikr «qaytardi» demaydi); o'yin eslatmasi va uch kunlik eslatma ajratilmaydi — birinchi versiya cheklovi.
  **Tekshiruv yozuvlari o'chiriladi (09-FILTR 6):** test holatidagi bosish — sun'iy voqea; `hodisalar` da `namuna` ustuni yo'q, kichik sonda bitta yozuv ham hisobotni buzadi. 7-dars qoidasi («o'z qurilmasi ham sanaladi») haqiqiy ochilishlar uchun qoladi.
  Yangi o'rnatish faylini odamlar hali o'rnatmagan — jadvalda bu nomdagi yozuvlar faqat o'quvchiniki; shunga qaramay «boshqa qator bo'lsa — tegmang».
  **Bitta ochilish — ikki yozuv (09-FILTR 23):** `ochdi` (9.39 d — bitta ochilishga bitta) va `eslatmadan-ochdi` — ataylab. **Butunlay yopiq holat (09-FILTR 20):** ⛔ «qur» darvozasi — haqiqiy Android va iPhone'da; takror yozuvdan himoya (REPO 3).
  **O'chirgich va telefon ruxsati — ikki alohida holat (09-FILTR 28);** yoqilganda qayta qo'yish qoidasi aniq (09-FILTR 19). Maxfiylik gapi — 10-Modul «ochiq aytish» (sinf 3, 14; tayanch 9.41 a).
  O'rnatish fayli — tayanch 1.8 «APK o'zi yangilanmaydi»; test holati qaytarilgandan keyin boshlanadi; «uyda» yo'q (09-FILTR 38). Sanoq kutilgan natijasida qadam sonlari yo'q — 9-darsdagi Mentor qadamlari tayanchda yo'q (o'ylab topilmadi).

## 9 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Yopiq ilovaga xabar» · 7 — «2 — Foydali eslatma»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi halqada.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; kartochkalar — oldingi alohida ekranda)
- Yuqori yorliqlar: ✓ Uch blok bajarildi (faqat 3-amaliyot bajarilganda; aks holda yorliq yo'q) · {N}/2 to'g'ri · mobil trekda, 3-amaliyotda «Fayl navbatda» tanlangan bo'lsa — kulrang yorliq «O'rnatish fayli navbatda»
- Sarlavha (bloklar holatiga qarab, P-046; sinf 1 — o'quvchi qilgan ishni aytadi):
  - uchala blok (mobil trek): **Eslatmangiz tekshirildi va endi sanaladi.** (41)
  - uchala blok (web-trek): **«Siz yo'q paytingizda» qatori tayyor va sanaladi.** (49)
  - 1 va 2-blok: **Ikki blok tayyor — sanoq va o'chirgich qoldi.** (45)
  - faqat 1-blok: **Jonli xabar ishlaydi — yopiq paytdagi qism qoldi.** (49)
  - hech biri: **Qaytarish ishi boshlandi — qolgan bloklarni tugating.** (53)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- **[07.10: yakunda KO'RSATILMAYDI — SABOQ E 50 (foydalanuvchi tasdig'i); fikr darsning ichki o'qi bo'lib qoladi]** Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Yopiq ilovada boshqa odamning o'zgarishi jonli xabar bo'lib ko'rinmaydi; foydalanuvchini ilova oldindan qo'ygan foydali eslatma qaytarishi mumkin — eslatma bosilib ilova ochilganini esa sanoq ko'rsatadi.
- Endi siz bilasiz (5):
  - Qaytganlar foizi — bir davrda ilovani ochganlardan keyingi davrda ham ochganlari foizi.
  - Jonli xabar ilova ochiq paytda chiqadi; yopiq ilovada u ko'rinmaydi.
  - Rejalashtirilgan eslatmani ilovaning o'zi qo'yadi — u faqat oldindan bilgan narsani aytadi.
  - Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan yangisini qo'shmaydi; o'chirgich foydalanuvchida.
  - Sanoq eslatma bosilib ilova ochilganini ko'rsatadi; eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi.
- Uyga vazifa — yo'q (loyiha kuni; tayanch 4). `uyga: null`. «O'rnatish fayli navbatda» yorlig'i ostida bitta qator: «Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.»
- Keyingi dars — «50 foydalanuvchiga yetdingizmi?»: Mentor tekshiruvi: metrika hisoboti va zaxira reja.
- Nishonlaringiz — N/4
- Tartib: belgi va sarlavha · CODE STRIKE · asosiy fikr · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- ✎ «Sanaladi» — ilova ichidagi o'lchov tayyor degani; «foydalanuvchi qaytdi» deyilmaydi (09-FILTR 37). Navbatdagi o'rnatish fayli — yorliq bilan ochiq aytiladi, uyga vazifa emas (09-FILTR 38). Sarlavha trek bo'yicha faqat to'liq holatda farq qiladi (sinf 12: web-trekda eslatma yo'q); qolgan uch holat ikkala trekka to'g'ri. «Endi siz bilasiz» — bilim, ikkala trekka to'g'ri. «Keyingi dars» qatori — App.jsx `m10-10` nomi va osti (T-038: boshqa joyda va'da yo'q).

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Open Line** — Jonli xabar faqat ochiq ilovada chiqishini topdingiz (4-ekran, 1-savol)
- **Fair Reminder** — Uch katakdan o'tadigan eslatmani tanladingiz (7-ekran, 2-savol)
- **Reminder Set** — Ilova yopiq paytdagi eslatmani qurib, tekshirdingiz (2-amaliyot, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- **Come Back** — Eslatmadan ochilishni sanab, o'chirgichni tekshirdingiz (3-amaliyot, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q; tavsif — qilingan ish, «foydalanuvchini qaytardingiz» emas (09-FILTR 36)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 06.10: Open Line · Fair Reminder · Reminder Set · Come Back — 0). Ikki blok nishoni — ish uchun (P-048), tekin emas.

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: PM qismi — raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Jonli xabar faqat ochiq ilovada ko'rinadi»
   - 1 · Ilova ochiq: hodisa keladi, jonli xabar chiqadi.
   - 2 · Ilova yopiq: jonli xabar ko'rinmaydi.
   - 3 · Ilova ochilganda — yangi sonni ro'yxatda ko'radi.
   - Sinfga savol: Yopiq ilovaning telefon ekraniga nima chiqa oladi?
2. 2-savol (7-ekran) — «Foydali eslatmaning uch katagi»
   - 1 · O'z ishiga tegishli, foydasi aniq.
   - 2 · Rost: ilova buni oldindan biladi.
   - 3 · Bosim, qo'rqitish, uyaltirish yo'q.
   - Sinfga savol: «Sizni sog'indik!» qaysi katakdan o'tmaydi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Qaytganlar foizi nima? | Bir davrda ochganlardan keyingi davrda ham ochganlari foizi | Inglizchasi: retention. 7-Modulda bot uchun sanagansiz |
| Mentor misolida qaytganlar foizi qancha chiqdi? | 46 qurilmadan 17 tasi yana ochdi — taxminan 37% | Shu 46 qurilmaning sanalgan soni; nega qaytmagani bundan bilinmaydi |
| Ilova ochiq bo'lsa, boshqa odamning o'zgarishi qanday ko'rinadi? | Son o'zi yangilanadi; foydali joyda jonli xabar chiqadi | Hodisa ulanish orqali keladi |
| Ilova yopiq bo'lsa, boshqa odamning o'zgarishi jonli xabar bo'lib ko'rinadimi? | Yo'q | Ilova ochilganda yangi sonni ro'yxatda ko'radi |
| «2 joy qoldi» xabari uchun yangi hodisa kerakmi? | Yo'q — ilova qayta so'ragan sondan o'zi hisoblaydi | Mentor misolida; o'yinga qo'shilmaganlarga chiqadi |
| Rejalashtirilgan eslatmani kim qo'yadi? | Ilovaning o'zi, oldindan | Shuning uchun u ilova bilgan narsani aytadi |
| Nega uch kunlik eslatma «yangi o'yin chiqdi» demaydi? | Yopiq ilova yangi e'lonni bilmaydi | Shuning uchun taklif qiladi: «Hafta oxiriga o'yin bormi?» |
| Bu kursda foydali eslatma qanday bo'ladi? | O'z ishiga tegishli, rost va bosimsiz | Hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi; o'chirgich bor |
| «Eslatmalar» o'chirilsa, nima bo'ladi? | Rejalashtirilgan eslatmalar bekor bo'ladi | Tanlov foydalanuvchida |
| Mentor misolida uch kunlik eslatma kimga chiqadi? | Ilovani uch kun ochmagan odamga | Har kuni ochadigan odamga umuman chiqmaydi |
| Mentor misolida `eslatmadan-ochdi` nimani sanaydi? | Eslatma bosilib ilova ochilgan qurilmalarni | Istalgan eslatma; eslatmasiz ham ocharmidi — buni aytmaydi |
| Ilova o'zgarsa, APK o'rnatganlarga yangi eslatma qanday yetadi? | Yangi o'rnatish fayli orqali | APK o'zi yangilanmaydi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Mentor misolida 46 qurilmadan 17 tasi yana ochdi. Bu nima? ✔ Qaytganlar foizini beradigan son · Ro'yxatdan o'tgan odamlarning soni · Eslatmani bosib ochganlar soni · O'yinga qo'shilgan o'yinchilar soni
2. Web-trekda sayt yopiq. O'yinchiga xabar yetadimi? Yetadi — brauzer xabarni o'zi ko'rsatadi · ✔ Yetmaydi — u qaytganda o'zgarishni ko'radi · Yetadi — Backend saytni o'zi ochib beradi · Yetmaydi — sayt xabarni umuman ko'rsatmaydi
3. «2 joy qoldi» uchun Mentor Backend'i qaysi hodisani yuboradi? Yangi `joy-qoldi` degan hodisani · Joy sonining o'zini alohida hodisada · ✔ Odatdagi `oyin-ozgardi` hodisasini · Har soniyada yangilangan sonni
4. «2 joy qoldi» xabari Mentor misolida kimga chiqadi? Shu o'yinga qo'shilgan hammaga · O'yinni e'lon qilgan tashkilotchiga · «Qo'shilaman»ni bosgan o'yinchiga · ✔ Shu o'yinga qo'shilmagan o'yinchiga
5. Rejalashtirilgan eslatmani kim qo'yadi? ✔ Ilovaning o'zi — oldindan, telefonda · Backend — boshqa o'yinchi qo'shilganda · Tashkilotchi — o'yin e'lon qilganda · Telefon — har kuni ertalab o'zicha
6. Nega uch kunlik eslatma «Yangi o'yin chiqdi» demaydi? Matn juda uzun bo'lib qoladi · ✔ Yopiq ilova yangi e'lonni bilmaydi · Yangi o'yinlar juda kam bo'ladi · Bunday matnni telefon ko'rsatmaydi
7. Mentor misolida shu hafta ikkita o'yin eslatmasi bor. Uch kunlik eslatma-chi? Baribir qo'yiladi — uchinchi bo'lib · O'yin eslatmasining o'rniga qo'yiladi · ✔ Bu hafta u umuman qo'yilmaydi · Ikki marta qo'yiladi — har o'yinga
8. Foydalanuvchi «Eslatmalar»ni o'chirsa, nima bo'ladi? Ilova telefondan ruxsatni qayta so'raydi · Faqat ertangi kungi eslatma o'z joyida qoladi · Ilova hisobdan o'zi chiqib, yopiladi · ✔ Rejalashtirilgan eslatmalar bekor bo'ladi
9. Test holati nima uchun kerak? ✔ Eslatmani bir daqiqada ko'rib tekshirish uchun · Eslatmani foydalanuvchilarga tezroq yuborish uchun · Haftalik chegarani butunlay olib tashlash uchun · Ruxsat so'raydigan oynani o'chirib qo'yish uchun
10. Mentor misolida `eslatmadan-ochdi` qachon yoziladi? Eslatma telefon ekraniga chiqqanda · ✔ Eslatma bosilib ilova ochilganda · Ilova eslatmani rejalashtirganda · Eslatma o'yindan oldin bekor bo'lganda
11. Sinfda eslatmani o'zingiz bosib tekshirdingiz. Bu yozuv nima bo'ladi? Haqiqiy foydalanuvchi bo'lib sanaladi · Tekshiruv bo'lgani uchun yozilmaydi · ✔ Tekshirgach, sanoqdan o'chiriladi · Ikki qurilma bo'lib sanoqda qoladi
12. Ilova o'zgardi. Eski APK o'rnatganlarda bugungi eslatma bormi? Bor — APK o'zi yangilanib qoladi · Yo'q — eslatma faqat iPhone'da ishlaydi · Bor — Render yangi versiyani yuboradi · ✔ Yo'q — yangi faylni o'rnatishlari kerak

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Ha/Yo'q (Yetadi / Bor) savollari — 2 va 12: ikkitadan (S-006). Kod belgisi faqat to'g'rida emas (3 — A va C da; 10 — savolda). 7 — haftalik chegaraning aniq holati (hamma eslatma sanaladi; ilova o'zidan qo'shmaydi — tayanch 9.41 b). 11 — tekshiruv yozuvi o'chiriladi (09-FILTR 6; `hodisalar` da `namuna` ustuni yo'q).
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari ru'da ham o'sha; R-008): qaytganlar foizi · jonli xabar · eslatma · «2 joy qoldi» · `oyin-ozgardi` · `eslatmadan-ochdi` · test holati · «Eslatmalar» · sanoq · qurilma · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **1 (B)** · s7 **2 (C)**; bloklar (3, 6, 8) — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m10-09-v1`, `lessonTitle` — «Loyiha kuni: foydalanuvchini qaytaradigan eslatma». App.jsx `m10-09` ga `comp: RetentionDayLesson` — «qur» bosqichida (asosiy seans).
2. **Bitta manba (180):** `QAYTISH_SAHNA` (ikki telefon, Backend tuguni, chiziq holatlari `ochiq` · `uzilgan`, konvert turlari, 1-telefon ko'rinishlari `ilova` · `qulf`), `NAMUNA_OYIN` (Shanba, 18:00 · Mahalla maydoni; `id: 1` — tayanch 9.20),
   `YANGI_ELON` (Yakshanba, 18:00 · Maktab maydoni · 0 / 10 — tayanch 9.41 a), `MATNLAR` (5-ekran: to'rt eslatma matni + uch katak natijasi + qizil qator; 2-si — 4-darsdagi o'yin eslatmasi), `KATAKLAR` (uch qator — 5-ekran va recap 2), `QAYTISH_SONLAR` (46 · 17 · 37%) — 0, 1, 2, 5-ekranlar, bloklar o'ngi va kartochka shundan o'qiydi.
3. **`QaytishSahna`** komponenti — 02-pilotning ikki telefonli sahnasi naqshida (nusxa, import emas — darslar mustaqil): `telefonlar` (1 yoki 2), `birinchi` (`ilova` / `qulf`), `chiziq`, `konvertlar`, `jonliXabar` (tepadan tushadi, bir necha soniyadan keyin yig'iladi), `qulfKartalar` (eslatma kartalari), `hisoblagich`.
   Qulf ekrani — chizilgan (sana-soat yo'q), eslatma kartasi: «Maydon Jamoa» nomi o'z rangida + matn. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: qs-qoshil qs-yop qs-och qs-elon qs-qoida qs-ochirgich`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **0-ekran `QKirish`:** maket — 1-telefon qulf ekrani + ikki ustunli hisoblagich (46 · 17); javobdan keyin eslatma kartasi tushadi va hisoblagich ostida qator chiqadi (kirish animatsiyasi, SABOQ 19).
5. **2-ekran `QTushuncha`:** `QBashorat`/`QTaxmin` (yopilmaydi — ixcham qator), uch harakat navbat bilan (faol tugma halqada, qolganlari xira), konvert animatsiyalari, `Database: 7 → 8`, jonli xabar, yopiq ilovada konvertsiz natija («jonli xabar ko'rinmadi»), yangi karta sirg'alib kirishi, joriy qator, `zoom`, `tugadi`. Holat bosishlar ro'yxatidan (P-046).
6. **5-ekran `QTushuncha`:** `QBashorat`/`QTaxmin`, `MATNLAR` bittadan («Matn N / 4»; 2-kartada yorliq «4-darsdagi o'yin eslatmasi»), «Qoidadan o'tkazish» → `KATAKLAR` ga ✓/✗ navbat bilan tushadi (60–120 ms), yashil/qizil karta, hisoblagich «Bu hafta: N / 2»,
   2 / 2 da kulrang qator «Hafta to'ldi …», qizil qator (`QXato` ≤60), 5-harakat — o'chirgich (to'rttasidan keyin faol), joriy qator, `zoom`, `tugadi`. Tekshiruv kartasi ostida yorliq «bu kursda · rejalashtirilgan eslatma uchun».
   Bir vaqtda bitta matn kartasi (SABOQ 9, 13); o'tgan matnlar qulf ekranida ixcham qator bo'lib qoladi (SABOQ 17).
7. **4 va 7-ekran `QTest`** — matn yuqoridagidek; to'g'ri izoh ≤60, xato izohlari ≤60.
8. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (11-Modul 12-dars naqshi): har blok **4 band**, hammasi o'quvchining o'z repo'sida (tayanch 9.1); 5-band yo'q. Uchala blokda prompt — uch bo'sh joy `{qayerda}` · `{nima qilsin}` · `{nima buzilmasin}` (kulrang namunasiz, bo'sh — talab zinapoyasi 9-dars),
   ustida bitta «Vazifa: …» qatori; «Yordam» — Mentor misolidagi to'liq prompt; web gapi — «Yordam» ostida, trek `pm-m9d8-platforma` dan (kalit yo'q bo'lsa — 1-blok tepasida trek tugmalari, tanlov kalitga yoziladi; 11-Modul 9.77).
   - 4-band nomi: «Tekshirish» (1, 3-blok) · «Telefonda tekshirish» (2-blok; web-trekda «Tekshirish»). «Ulgurmasangiz» qatori va O'qituvchi eslatmasi — qolipda yo'q (11-Modul bloklari bilan bir — MEXANIZM-TAKLIF).
   - 3-blok tepasida `pm-m10d8-qadamlar` dan bitta qator: `qadamlar.map(q => q.nom + ' ' + q.soni)` va `sana`; kalit yo'q — «8-darsdagi sanoq sahifangizni oching». Kalit yozilmaydi.
   - O'ng: 1-blok — telefon (ikki kadr) · 2-blok — qulf ekrani (bitta kadr, «test holati: bir daqiqa» yorlig'i) · 3-blok — telefon + sanoq sahifasi (brauzer oynasi). Web-trekda o'ng maket brauzer oynasi (trek bo'yicha).
   - `QIzoh`: 2-blok — trek bo'yicha ikki matn; 3-blok — faqat mobil trekda. 2-blok yashil qatori — trek bo'yicha ikki matn; ostida mobil trekda kulrang qator «Haftalik chegara — kodda bor, telefonda tekshirilmagan.»
   - 1-blokda «Davom etish» erta ochilmaydi (tekshiruvni keyinga surish yo'q — 09-FILTR 39). 3-blok ostida (mobil trek) ikki tugma «Havola almashtirildi» · «Fayl navbatda» — dars holatida (`ccProgress`), yangi `pm-…` kaliti yo'q; yakun yorlig'i shundan. `ortda`: uchala blokda `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-09-done` (tayanch 3).
   - `ACH_TRIGGERS`: 4 → Open Line · 7 → Fair Reminder · 2-blok oxirgi «Bajardim» → Reminder Set · 3-blok oxirgi «Bajardim» → Come Back.
9. `RECAPS` 2 (kalit = 4 va 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 0·1·2·3 ×3) · flashcard 12 (`sflash`, Mentor yo'q, «Kartani bosing — javob ochiladi»; SABOQ 12, 16) · `QZ_BG_SHAPES` fon so'zlari {uz, ru}, emoji yo'q.
10. **11-ekran `QYakun`:** sarlavha — bloklar holati va `trek` dan (to'rt holat, to'liq holatda trek bo'yicha ikki matn); belgi faqat 3-blok bajarilganda; yorliq «O'rnatish fayli navbatda» va ostidagi qator — 3-blokdagi tanlovdan; `recap` 5 qator; `uyga: null`; `keyingi` matni yuqoridagidek.
11. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). `narrow` faqat 4, 7, 9-ekranlarda (171).
12. **Darvozalar:** `npm run gates -- src/10-Modull/RetentionDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran 4 savol (SABOQ 30) hisobotda.
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

**REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m12-dars-09-start` = `m12-dars-08-done` → `m12-dars-09-done`):**
1. `mobil/` — jonli xabar «{kun}, {soat} — {N} joy qoldi»: `oyin-ozgardi` → `GET /oyinlar` dan keyin, `menQoshilganman` yolg'on va `kerak - qoshilgan` 1 yoki 2 bo'lsa (`qoshilgan` — `qoshildi` yoki `keladi`, 11-Modul 9.86); bir o'yin + bir son — bir marta
   (ilova ochiq turgan davrda, ilova xotirasida); birinchi yuklanishda (oldingi javob yo'q) — xabar yo'q (9.36 a); o'z harakatidan keyin — yo'q. 4-dars xabarlari o'zgarmaydi.
2. `mobil/` — **uch kunlik eslatma** (bitta; o'yin kuni 9:00 eslatmasi yo'q — tayanch 9.41 c): ilova har ochilganda (hisobga kirgan bo'lsa) oldingisi bekor (`cancelScheduledNotificationAsync(id)`), yangisi +3 kun 17:00 (`scheduleNotificationAsync`, trigger `DATE`; `content.data` da `tur`).
   Haftalik chegara: yangi eslatma tushadigan haftada (dushanba–yakshanba) ilovaning ikkita eslatmasi (o'yin eslatmasi ham) bo'lsa — qo'yilmaydi; qo'shilish va chiqishdan keyin qayta hisoblanadi; eslatmalarning `id`, `tur` va vaqti telefonda saqlanadi (hisob shundan).
   «Hisobdan chiqish» va «Hisobni o'chirish»da bekor (7-dars). `Platform.OS === 'web'` da eslatma kodi chaqirilmaydi (brauzer ko'rinishi). 4-darsdagi o'yin eslatmasining qo'yilishi va bekor qilinishi o'zgarmaydi — faqat vaqti saqlanadigan ro'yxatga yoziladi.
3. `mobil/` — eslatma bosilishi: ilova ishlab turganda `addNotificationResponseReceivedListener`, butunlay yopiq holatdan ochilganda oxirgi javob (`useLastNotificationResponse()` yoki `getLastNotificationResponseAsync()`) → `hodisaYoz('eslatmadan-ochdi')` — istalgan `tur` uchun.
   Takrordan himoya: qayta ishlangan javobning `notification.request.identifier` i saqlanadi (yoki `clearLastNotificationResponseAsync()`), bitta bosish — bitta yozuv. ⛔ «qur» darvozasi — Shubhali 2.
   «Hisobdan chiqish» yonida o'chirgich «Eslatmalar» (sozlama qatori ko'rinishida; sukutda yoqiq; tanlov telefonda): o'chsa `cancelAllScheduledNotificationsAsync()` va yangisi qo'yilmaydi; yoqilsa — hozirgi `GET /oyinlar` javobidan o'zi qo'shilgan, hali boshlanmagan o'yinlar uchun o'yin eslatmasi
   (bir soatdan kam qolgan — yo'q) va uch kunlik eslatma qaytadan qo'yiladi. `getPermissionsAsync()` — ruxsat yo'q bo'lsa o'chirgich ostida «Telefon sozlamalarida eslatmalarga ruxsat berilmagan».
4. `backend/` — `POST /hodisalar` ruxsat etilgan nomlarga `eslatmadan-ochdi`; `GET /hodisalar/sanoq` — qo'shimcha maydon (turli `qurilma_id` soni). `lending/sanoq.html` — qadamlar ostida qator «eslatmadan ochdi». `lending/maxfiylik.html` — bitta gap (tayanch 9.41 a).
5. `README.md` «Real vaqt» bo'limiga — «2 joy qoldi» qatori; yangi «Eslatmalar» bo'limi (o'yin eslatmasi va uch kunlik eslatma, vaqt, bekor qilish, haftalik chegara, o'chirgich, `eslatmadan-ochdi` nimani sanashi). «Darslar va teglar» jadvaliga `m12-dars-09-done`.
6. ⛔ Muhrdan oldin («qur» darvozasi, tayanch 9.41 j): Expo Go'da va o'rnatish faylida (Android va iPhone) test holatida uch kunlik eslatma chiqishi; bosilganda `eslatmadan-ochdi` yozilishi — ilova fonda va butunlay yopiq holatdan, har bosishga bitta yozuv; o'chirgich (o'chirish, qayta yoqish — o'yin eslatmasi tiklanishi);
   ilova yangilanganda (yangi o'rnatish fayli eskisining ustiga) rejalashtirilgan o'yin eslatmalari saqlanishi; uchala blokning vaqti (taymer) — ko'z bilan, jurnalga. Natija boshqacha chiqsa — MD haqiqiy natijaga moslanadi. Mentor misolida yangi APK tayyorlanib, lending havolasi almashtiriladi.
   Mentor tekshiruv yozuvlari (`eslatmadan-ochdi`) muhrdan oldin `id` bo'yicha o'chiriladi.

## Manbalar (o'zim tekshirdim, 06.10.2026; o'quvchiga ko'rinmaydi)
1. Expo — `docs.expo.dev/versions/latest/sdk/notifications/` (sahifa «Reference (v57.0.0)»): «Local notifications (in-app notifications) remain available in Expo Go.» ·
   «Push notifications (remote notifications) functionality provided by expo-notifications is unavailable in Expo Go on Android from SDK 53. A development build is required to use push notifications.»
2. O'sha sahifa: trigger turlari `DATE`, `TIME_INTERVAL`, `DAILY`, `WEEKLY`, `YEARLY`, `CALENDAR`; `DateTriggerInput` — «This trigger input will cause the notification to be delivered once on the specified value of the `date` property.» ·
   `cancelScheduledNotificationAsync(identifier)` — «a single scheduled notification» · `cancelAllScheduledNotificationsAsync()` — «all scheduled notifications».
3. O'sha sahifa: `setNotificationHandler` — «The default behavior when the handler is not set or does not respond in time is not to show the notification.» (ilova ochiq paytda). Mentor ilovasida handler 4-darsda qo'yilgan (9.36 i) — eslatma ochiq paytda ham ko'rinadi; 2-blokdagi «ilovani yoping» — yopiq holatni tekshirish uchun.
4. O'sha sahifa: `addNotificationResponseReceivedListener` — «will be called whenever a user interacts with a notification (for example, taps on it)» · `useLastNotificationResponse()` / `getLastNotificationResponseAsync()` — «the notification response that was received most recently» · `data` — «Data associated with the notification, not displayed.»
5. O'sha sahifa: «On Android 13, app users must opt-in to receive notifications via a permissions prompt automatically triggered by the operating system. This prompt will not appear until at least one notification channel is created.» (4-dars ishi; bu darsda — «ruxsat so'rash avvalgidek»). Qo'llab-quvvatlanadigan platformalar — faqat Android va iOS (web yo'q).
6. Expo — `docs.expo.dev/push-notifications/receiving-notifications/` (sahifa sanasi 19.08.2026): `addNotificationResponseReceivedListener` — «when your app is backgrounded or closed and the user taps on the notification» holatida ishlatiladi. Sovuq ishga tushishda (ilova butunlay yopiq) xatti-harakat batafsil yozilmagan — Shubhali 2.
7. Tayanch 6 (06.10, rasmiy): rejalashtirish `scheduleNotificationAsync`, bekor qilish `cancelScheduledNotificationAsync(id)`, ruxsat `requestPermissionsAsync()`, Android kanal, web'da yo'q · EAS: `eas build -p android --profile preview`, bepul reja oyiga 15 Android build, past ustuvor navbat.
8. Kursdagi so'zlar (grep, 06.10): «qaytganlar foizi» — `src/pm/PmMetricsLesson.jsx` 967-qator («Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi»; App.jsx `m5-14` — 7-Modul) · `PmLesson21.jsx` («Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam») ·
   `ochdi` har ochilishda, `POST /hodisalar` nom ro'yxati, `400` — pilot `07-PmFiftyUsers-v3.md` 252–253-qatorlar · «faqat foydalanuvchi yo'li» ma'nosidagi «qadam» va blok bandlari nomi — pilot `07` A-bo'lim 5.

9. Expo — o'sha sahifa (`docs.expo.dev/versions/latest/sdk/notifications/`, «Reference (v57.0.0)»), 06.10.2026 da, 09-FILTR seansida qayta o'qildi (09-FILTR 20, 28): `useLastNotificationResponse()` — «A React hook which returns the notification response that was received most recently»;
   qaytaradigan qiymatlari: «undefined - until we're sure of what to return, null - if no notification response has been received yet, a NotificationResponse object - if a notification response was received» ·
   `getLastNotificationResponseAsync()` — «Gets the notification response received most recently» · `clearLastNotificationResponseAsync()` — «Clears the notification response that was received most recently» ·
   `getPermissionsAsync()` — «checks current permissions settings related to notifications» · `getAllScheduledNotificationsAsync()` — «Fetches information about all scheduled notifications» · «If the user taps on a notification, actionIdentifier will be equal to Notifications.DEFAULT_ACTION_IDENTIFIER.»
   **Sahifada yo'q:** ilova butunlay yopiq holatdan ochilganda listener ishlashi · rejalashtirilgan eslatmalar ilova yangilanganda yoki telefon qayta yoqilganda saqlanishi — ikkalasi «qur» darvozasida sinaladi.
10. 11-Modul tayanchi (grep, 06.10): namuna o'yinlar — «Shanba 18:00 · Mahalla maydoni · 8 / 10 · Shanba 20:00 · Maktab maydoni · 6 / 10 · Yakshanba 10:00 · Park maydoni · 4 / 8 · Yakshanba 17:00 · Mahalla maydoni · 9 / 10» (368-qator) · `GET /oyinlar` dagi `qoshilgan` — «`qoshildi` yoki `keladi`» (9.86).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**09-FILTR (F-1006-363) dan keyingi holat — hammasi tayanch 9.41 ga yozildi; ochiq qolgani yo'q (foydalanuvchiga savol — 09-FILTR «Foydalanuvchiga»):**
1. ✅ **«taxminan 37%»** (17 / 46) — tasdiq (auditor: qabul); 17 — o'sha 46 qurilmaning ichidan. Tayanch 9.41 a.
2. ✅ **2-ekran sahnasi sonlari** — «7 / 10» → «8 / 10», «Database: 7 → 8», yangi e'lon «Yakshanba, 18:00 · Maktab maydoni · 0 / 10» — tayanch 9.41 a (auditor: «tayanchga kirsa qolsin»; maydon nomi 11-Modul namuna o'yinlaridan, kun va soat boshqa o'yin bilan to'qnashmaydi).
3. ✅ **«2 joy qoldi» chegarasi** — bir yoki ikki joy; nol — yo'q; bir xil son uchun bir marta — ilova ochiq turgan davrda (09-FILTR 10, 11).
4. ✅ **4-dars qoidasi bilan munosabat** — 4-dars qoidasi 4-darsda qurilgan xabarlarga; 9-dars xabari yangi (tayanch 1.4, 9.41 e; 4 MD A-bo'limiga izoh qo'shildi).
5. ✅ **5-ekran matnlari 1 va 3** — tasdiq (mashq matni). 2-matn endi 4-darsdagi o'yin eslatmasi (9:00 eslatmasi olib tashlangach).
6. ✅ **Uchinchi katak «Rost: ilova buni oldindan biladi»** — tasdiq, rejalashtirilgan eslatma doirasida (karta ostidagi yorliq; 09-FILTR 15).
7. ✅ **Uch kunlik eslatma soati — 17:00** — tayanch 9.41 a.
8. 🔁 **Haftalik chegara** — avvalgi variant («bugungi ikki eslatma sanaladi, 4-dars eslatmasi yo'q») **rad etildi**: hamma eslatma sanaladi, hafta dushanba–yakshanba; o'yin eslatmasi har doim qo'yiladi, uch kunlik — sig'masa yo'q (tayanch 9.41 b; 9.30 almashtirildi).
9. 🔁 **O'yin kuni eslatmasi qo'yilmaydigan holatlar** — eslatmaning o'zi olib tashlandi (tayanch 9.41 c).
10. ✅ **«Eslatmalar» o'chirgichi** — joyi, sukutda yoqiq; o'chirilsa hammasi bekor (o'yin eslatmasi ham); yoqilganda nima qayta qo'yilishi aniq yozildi; telefon ruxsati — alohida holat (tayanch 9.41 f; 09-FILTR 19, 27, 28).
11. ✅ **Maxfiylik siyosatiga gap** — tasdiq.
12. ✅ **`eslatmadan-ochdi` qaysi eslatmalarda** — istalgan eslatma (o'yin eslatmasi ham); «uch kunlik eslatma shuncha odamni qaytardi» deyilmaydi (tayanch 9.41 d). Sabab: 10-darsdagi Mentor soni (bir hafta keyin 9 qurilma) faqat uch kunlik eslatmadan chiqa olmaydi — yangi fayl 5-kuni chiqadi, eslatma eng erta 8-kuni.
13. 🔁 **Web-trek A2** — Backend sanamaydi: sayt o'zi saqlagan oxirgi holatni yangi javob bilan solishtiradi; matn «Siz yo'q paytingizda: {N} ta o'yiningizda o'zgarish bo'ldi» (tayanch 9.41 g).
14. ✅ **Web-trek A3** — `xabardan-ochdi` faqat «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda; tasmadagi oddiy xabar va sahifa ochilishi — yo'q (09-FILTR 26).
15. ✅ **3-blok oxirida yangi o'rnatish fayli** — qoladi; tayyor bo'lmasa — keyingi dars boshida («uyda» yo'q; tayanch 9.41 h).
16. 🔁 **1-blok tekshiruvi** — sherik birinchi yo'l, agent — zaxira (tayanch 9.37 h; 09-FILTR 12).
17. ✅ **Hook** — tasdiq; «Qiziq fikr!» — qonun (rad).
18. ✅ **Sahna tugmalari** va «Bu hafta: N / 2» — tasdiq.
19. ✅ **Nishon nomlari** — tasdiq; Come Back tavsifi — qilingan ish.
20. ✅ **Yakun sarlavhalari** — tasdiq; + yorliq «O'rnatish fayli navbatda».
21. ✅ **2-savol variantlari** — tasdiq.
22. ✅ **Reja uch qatori** va sarlavhasi — tasdiq (web-trek — pastki qatorda).

## Shubhali joylar (ishonchim komil emas)
1. **Rejalashtirilgan eslatma amalda** — Expo Go'da Android va iPhone'da chiqishi, ruxsat oynasi matni, bir daqiqalik test holatida telefon eslatmani kechiktirishi (batareya tejash) — qurilmada sinalmagan (tayanch 6 «Tekshirilmagan»). ⛔ «Qur» darvozasi.
2. ⛔ **`eslatmadan-ochdi` ilova butunlay yopiq holatdan** (09-FILTR 20) — rasmiy sahifada sovuq ishga tushish haqida gap yo'q (Manbalar 9); `useLastNotificationResponse` / `getLastNotificationResponseAsync` «oxirgi javob»ni beradi — ilovani ochgan bosishni ham berishi sinalmagan.
   Listener va oxirgi javob birga ishlatilsa bitta bosish ikki marta yozilishi mumkin — takrordan himoya REPO 3 da. Haqiqiy Android va iPhone'da sinalmaguncha 3-blok tekshiruvining (1), (4)-bandlari muzlatilmaydi.
3. **Expo Go'da «ilovani butunlay yopish»** — Expo Go yopilganda rejalashtirilgan eslatma chiqishi va bosilganda aynan shu loyiha ochilishi — sinalmagan. Ba'zi Android telefonlar butunlay yopilgan ilovaning eslatmasini kechiktiradi yoki chiqarmaydi — shuning uchun 3-blok (1) da zaxira yo'l («yopmasdan, telefonni qulflab»).
4. **Ilova fonda** (yopilmagan, boshqa ilovaga o'tilgan) — ulanish qancha tirik qolishi va jonli xabar chiqishi telefon OS iga bog'liq; darsda «yopiq» — qulf ekrani deb ko'rsatildi, fon holati aytilmadi.
5. **Haftalik chegara** — telefonda tekshirilmaydi (bir hafta kerak); o'quvchi kod qatorini o'qiydi, yashil qator ostida «kodda bor, telefonda tekshirilmagan» (09-FILTR 40). Mentor repo'sida — «qur» da ikki o'yin eslatmasi bor haftada uch kunlik eslatma qo'yilmasligi ko'z bilan.
6. **Brauzer ko'rinishida `expo-notifications`** — web'da yo'q (hujjat); `Platform` bilan ajratilmasa ilova buzilishi mumkin — «Nima buzilmasin» qatoriga yozildi, sinalmagan.
7. **Web A2 «Siz yo'q paytingizda»** — endi Backend'siz: brauzerda saqlangan holat bilan solishtirish (09-FILTR 25). O'yin o'zgarib yana avvalgi holatiga qaytgan bo'lsa — qator buni ko'rsatmaydi (`QIzoh` aytadi); boshqa brauzer yoki tozalangan xotirada — qator chiqmaydi.
8. **Lending'ni Netlify'da yangilash** — 1-darsdagi yo'l (GitHub'dan avtomatikmi yoki qo'lda) tayanchda aniq emas; MD «1-darsdagi yo'l bilan tekshiring» deb umumiy yozdi.
9. **O'rnatish fayli navbati** — haqiqiy kutish vaqti (tayanch 6 «Tekshirilmagan»); dars oxirigacha tayyor bo'lmasligi mumkin — havola keyingi dars boshida almashtiriladi; 10-darsning boshida buning uchun joy bormi — 10-dars Filtrida.
10. **Tekshiruv yozuvlarini o'chirish** (09-FILTR 6) — o'quvchi Neon'da `id` larni ko'radi, agent o'chiradi; odamlar yangi faylni allaqachon o'rnatgan bo'lsa (masalan, dars ikki kunga bo'linsa), ro'yxatda begona qator bo'lishi mumkin — «boshqa qator bo'lsa, tegmang» yozildi, vaqt bo'yicha ajratish o'quvchida.
11. **Test holatini qaytarishni unutish** — o'rnatish fayliga bir daqiqalik eslatma tushib qolishi mumkin; MD da ikki joyda `git diff` tekshiruvi va O'qituvchi eslatmasi bor, lekin mexanik qulf yo'q.
12. **1-blok tekshiruvi** — mahsulotida «joy» tushunchasi yo'q o'quvchida agentga topshiriq boshqacha bo'ladi; MD faqat Mentor namunasini va umumiy gapni berdi. Sherikning telefonida ilova (APK yoki brauzer ko'rinishi) bo'lishi kerak — 7-darsdan keyin bor deb olindi.
13. **Ilova yangilanganda rejalashtirilgan o'yin eslatmalari** — yangi o'rnatish fayli eskisining ustiga o'rnatilganda 4-darsdagi rejalashtirilgan eslatmalar saqlanadimi — hujjatda yo'q (Manbalar 9); saqlanmasa — ilova ochilganda tiklash kerak bo'ladi (hozir talabda yo'q). ⛔ «Qur» darvozasi.
14. **90 daqiqa** — taqsimot reja; auditor bahosi 110–130 (qisqartirishdan oldin). Pilotda taymer; sig'masa — haftalik chegara Mentor namunasida qolib, o'quvchi blokidan chiqariladi (foydalanuvchi qarori).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 11-ekran: to'rt holat (uchala · 1–2 · faqat 1 · hech biri), to'liq holat trek bo'yicha ikki matn; belgi faqat 3-blok bajarilganda; sarlavha o'quvchi ishini aytadi.
2. [x] **Da'vo isbot emas** — a) «Bu kursda» (5-ekran xulosa, «Endi siz bilasiz» 4, kartochka 8; 2-savol — «darsdagi uch katak», kurs qoidasi deb aytilmaydi) · b) «Mentor misolida» — uch blok, matnlar, vaqtlar; har blok «Ochish»ida mos qism bo'lmasa nima qilish yozilgan ·
   c) «chiqishi kerak», «odatda», «mumkin», «chiqa oladi» (hook javobi), «bir necha daqiqa cho'zilishi mumkin»; agentning «bajardim» degani — uning so'zi (1-blok 4, 2-blok 4) · d) 37% — «shu 46 qurilma bo'yicha sanalgan» (0-ekran, kartochka 2): son — fakt, sababi haqida xulosa yo'q; sanoq «eslatma bosilib ochildi»ni aytadi, «qaytardi»ni emas (3-blok, asosiy fikr); «tekshirildi» — test holatidagi fakt; haftalik chegara — «kodda bor, telefonda tekshirilmagan».
3. [x] **Maxfiy qiymat chiqmaydi** — 1-blok 1-band: `git status` da `.env` yo'q; har blok 3-bandida «`.env` qiymatlari, token va kalitlarni emas»; sanoq yozuvida ism, login, token yo'q (3-blok prompt); sanoq sahifasi kalit bilan; maxfiylik siyosatiga yangi yozuv ochiq aytiladi.
4. [x] **Tashqi xizmat faqat rasmiy hujjat** — Expo (Manbalar 1–6, iqtibos va sana), EAS buyrug'i va Render — tayanch 6; Render va Netlify tugma nomlari yozilmadi; qurilmada sinalmagan qadamlar — Shubhali 1–3, 6, 8, 9.
5. [x] **Har sonning manbasi va o'lchovi** — 46 · 17 — «Mentor misolida», birligi qurilma; 37% — hisob (tayanch 9.41 a); joy soni — o'yin joyi; sinfdagi tekshiruv yozuvlari `id` bo'yicha o'chiriladi (3-blok (4), arena 11); `eslatmadan-ochdi` — istalgan eslatma; har xil o'lchov ayirilmadi.
6. [x] **Tayanchda yo'q narsa to'qilmagan** — TAYANCHGA SAVOL 1–22 ning hammasi 09-FILTR dan keyin tayanch 9.41 da (sahna sonlari, matnlar, 17:00, chegara, o'chirgich, maxfiylik gapi, web A2/A3, o'rnatish fayli, nishonlar).
7. [x] **Saqlash kaliti o'qiydigan darsning ehtiyojidan** — o'qiydi: `pm-m10d8-qadamlar` (3-blok tepasi; yo'q bo'lsa — matn) va `pm-m9d8-platforma.trek`; yangi kalit yozilmaydi (tayanch 4, 8). Shaxsiy ma'lumot hech bir kalitga tushmaydi.
8. [x] **Test: bitta himoyalanadigan javob** — 1-savol: «Mentor ilovasi» chegarasi bilan C va D noto'g'ri; 2-savol: har noto'g'ri variant bitta katakdan o'tmaydi (uchinchi katak — tayanch 9.41 a); arena distraktorlari «Mentor misolida» bilan chegaralangan; «Farqi yo'q» tipidagi variant yo'q; savoldagi son javobda takrorlanmaydi (arena 1).
9. [—] **Keys: bank so'zi aynan** — dars keyssiz (Qaror-0 22); brend va real kompaniya yo'q.
10. [~] **90 daqiqa** — taqsimot tepada (reja, pilotda o'lchanadi — Shubhali 14); 2-amaliyot bitta eslatmaga qisqardi; har blokda «Ulgurmasangiz»; «Ortda qoldingizmi» uchala blokda; Render deploy kutilganda ish beriladi (3-blok); o'rnatish fayli navbati dars oxirida, kutilmaydi, «uyda» yo'q.
11. [x] **Bir ma'no — bir so'z** — «hodisa» faqat ulanish ma'nosida (`oyin-ozgardi`), `eslatmadan-ochdi` — «sanoq yozuvi»; «qadam» faqat foydalanuvchi yo'li, blok bandlari — «1 · Ochish» va h.k.; «holat» faqat «test holati»; «e'lon» — o'yin e'loni; «push» — faqat `git push`; «sinov» yo'q; «xabar» — jonli xabar va «Xabarlar» tasmasi.
12. [x] **Web-trek teng yo'l** — har blokda web qatori: 1 — bir xil, sayt papkasi; 2 — «Siz yo'q paytingizda» qatori (Backend'siz, brauzerda saqlangan holat bilan solishtirish; o'z yashil qatori va `QIzoh` i) va halol qator «sayt yopiq bo'lsa, xabar kelmaydi»; 3 — `xabardan-ochdi` (aniq harakat), «Xabarlar» o'chirgichi, o'z tekshiruv qatori; kutilgan natijada brauzer oynasi; arena 2 web haqida; yakun to'liq holatda trek bo'yicha.
13. [x] **Agent va o'quvchi ishi ajratilgan** — qaror o'quvchida (qaysi o'zgarish, eslatma matni va vaqti, o'chirgich joyi — uchala blok «Ochish»); agent quradi; tekshiruvda o'quvchi nimani ko'rishi aniq (jonli xabar, qulf ekrani, sanoq qatori); birinchi yo'l — sherik, agent — zaxira (1-blok); agent tekshiruv yozuvlari — aytgan `id` lari bo'yicha o'chiriladi (1-blok); 3-blokdagi tekshiruv yozuvlarini o'quvchi `SELECT` bilan ko'radi, agent `id` bo'yicha o'chiradi; o'quvchi `DELETE` yozmaydi.
14. [x] **O'smir xavfsizligi** — jonli xabar va eslatmada ism yo'q; telefon raqami, login, shaxsiy ma'lumot so'ralmaydi va saqlanmaydi; eslatmada bosim, qo'rqitish, uyaltirish yo'q (5-ekran, 2-savol — o'qitiladigan qoida); bitta o'yinga bitta eslatma, ilova o'zidan haftalik ikkitadan oshirmaydi; o'chirgich foydalanuvchida; namuna va tekshiruv akkauntlari `namuna = true`.

## O'lchov (scratchpad `md09/olchov.py`, 06.10.2026; 09-FILTR dan keyin o'zgargan qatorlar qayta sanaldi — `olchov09.py`, 06.10)
Skript natijasi (fayl yozilgandan keyin; `!!!` — chegaradan oshgan joy; topilganlari tuzatildi: arena 1, 3, 5, 7–12 da to'g'ri variant yolg'iz eng uzun edi — distraktorlar uzaytirildi; 0-ekran Mentori 2 gapdan 1 gapga).
Belgilar — oddiy `len`, `**` siz. Test variantlari ±15%, arena ±20% (o'rtachadan). Mentor gaplari — «…» ichidagi nuqta sanalmaydi.

```
## Sarlavhalar (≤55)
   49  Ilovani ochmay qo'ygan o'yinchiga nima ko'rinadi?
   49  Bugun ilovangizga qaytaradigan eslatma qo'shasiz.
   50  Yopiq ilova boshqa odamning o'zgarishini biladimi?
   47  Ilova ochiq paytda foydali jonli xabar chiqsin.
   40  Telefon ekraniga qanday eslatma chiqsin?
   47  Ilova yopiq bo'lsa ham foydali eslatma chiqsin.
   52  Eslatmadan ochilganlar sanalsin, o'chirgich bo'lsin.
   25  O'zingizni sinab ko'ring.
   41  Eslatmangiz tekshirildi va endi sanaladi.
   49  «Siz yo'q paytingizda» qatori tayyor va sanaladi.
   45  Ikki blok tayyor — sanoq va o'chirgich qoldi.
   49  Jonli xabar ishlaydi — yopiq paytdagi qism qoldi.
   53  Qaytarish ishi boshlandi — qolgan bloklarni tugating.
## Xulosalar (≤110)
   101  Bu misolda jonli xabar faqat ochiq ilovada ko'rinadi: yopiq ilova o'zgarishni ochilgandagina ko'radi.
  105  Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi.
## Hook javoblari (≤120)
   96  Aynan! Ilova yopiq bo'lsa, ichidagi narsa ko'rinmaydi. Telefon ekraniga esa eslatma chiqa oladi.
   95  Qiziq fikr! Jonli xabar ilova ochiq paytda chiqadi. Ilova yopiq bo'lsa, uni hech kim ko'rmaydi.
   90  Qiziq fikr! Ro'yxat ilova ochiq turganda yangilanadi. Ilovani ochmagan odam uni ko'rmaydi.
## Hook variantlari
   26  Ilova ichidagi jonli xabar
   32  ✔ Telefon ekraniga chiqqan eslatma
   34  O'zi yangilangan o'yinlar ro'yxati
## To'g'ri izohlar (≤60)
   42  Jonli xabar faqat ochiq ilovada ko'rinadi.
   51  O'z o'yini, aniq vaqt — ilova buni oldindan biladi.
## Xato izohlari (≤60)
   57  A: Jonli xabar ilova ichida chiqadi. Ilova yopiq bo'lsa-chi?
   46  C: Ilova yopiq bo'lsa, jonli xabarni kim ko'radi?
   59  D: Mentor misolida bu xabar o'yinga qo'shilmaganlarga chiqadi.
   47  A: Bu gap uyaltiradi. O'yinchiga qanday foyda bor?
   47  B: Yopiq ilova kechagi e'lonlarni qayerdan biladi?
   33  D: Bu gap qo'rqitadi. Foyda qayerda?
## 5-ekran qizil qatorlari (QXato) (≤60)
   31  Foyda aytilmagan — faqat bosim.
   35  Yopiq ilova yangi e'lonni bilmaydi.
## Yashil qatorlar (blok yakuni) (≤110)
   74  Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni ko'radi.
   75  Ilova yopiq paytda eslatma chiqdi; qayta ochilganda oldingisi bekor bo'ldi.
   60  Sayt qayta ochilganda o'zgargan o'yinlaringiz soni ko'rindi.
   79  Eslatmadan ochilganlar sanaladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.
## Joriy qatorlar (≤110)
   72  Bu ilovada yopiq telefonga faqat ilova oldindan qo'ygan eslatma chiqadi.
   80  O'chirgich foydalanuvchida: o'chirsa, rejalashtirilgan eslatmalar bekor bo'ladi.
## Kulrang qatorlar (≤110)
   62  Hafta to'ldi: ilova bu hafta o'zidan yangi eslatma qo'shmaydi.
   55  Haftalik chegara — kodda bor, telefonda tekshirilmagan.
## QIzoh qatorlari
   88  Eslatmani ilovaning o'zi qo'ygan: u faqat ilova oxirgi ochilganda bilgan narsani aytadi.
  109  Qator hozirgi holati oxirgi ko'rganingizdan farq qiladigan o'yinlarni sanaydi — oradagi har o'zgarishni emas.
  110  APK o'zi yangilanmaydi: eski faylni o'rnatganlarda bugungi eslatma yangisini o'rnatgandan keyin paydo bo'ladi.
## Reja qatorlari
   32  Ilova ochiq: foydali jonli xabar
   39  Ilova yopiq: oldindan qo'yilgan eslatma
   31  Eslatmadan ochilganlar sanaladi
## Mentor gaplari (gap soni · belgi)
  1 gap · 112  Mentor misolida ilovani ochgan qurilmalarning ko'pi keyingi ikki kunda uni yana ochmadi — avval javobni tanlan
  1 gap · 109  7-Modulda bot uchun sanagan qaytganlar foizini bu yerda qurilmalar bo'yicha ko'rasiz; «Davom etish»ni bosing.
  1 gap · 105  Hodisadan eslatmagacha bo'lgan yo'lni uch blokda qurasiz — talabni siz yozasiz, namuna «Yordam»da turadi.
  1 gap ·  79  Avval taxminingizni belgilang, keyin ikkinchi telefonda «Qo'shilaman»ni bosing.
  1 gap · 129  Xabar uchun yangi hodisa kerak bo'lmadi — endi birinchi telefonda «Ilovani yopish»ni, keyin ikkinchisida «E'lo
  1 gap ·  50  Endi birinchi telefonda «Ilovani ochish»ni bosing.
  1 gap ·  64  Uchala harakat tugadi — natijani taxminingiz bilan solishtiring.
  1 gap ·  96  Talabni uch qatorda o'zingiz yozasiz, Mentor namunasi «Yordam» ortida; «1 · Ochish»dan boshlang.
  1 gap ·  78  Mentor misolida eslatmaning to'rtta matni bor — avval taxminingizni belgilang.
  1 gap ·  78  Matnni «Qoidadan o'tkazish» bilan tekshiring va o'ngdagi uch katakni kuzating.
  1 gap ·  56  Endi telefon ostidagi «Eslatmalar» o'chirgichini bosing.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap ·  84  Eslatma matnini uch katak bilan o'zingiz tekshirib yozing; «1 · Ochish»dan boshlang.
  1 gap ·  94  Eslatma bosilib nechta qurilmada ilova ochilganini sanoq ko'rsatadi; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  Mentor ilovasi yopiq. «2 joy qoldi» xabari o'yinchiga chiqadimi? · 9 so'z · [48, 45, 42, 49] · eng uzun 49 / eng qisqa 42 · ✔B · OK
      A   48  Chiqadi — jonli xabar telefon ekranida ko'rinadi
      B✔  45  Chiqmaydi — jonli xabar ochiq ilovada chiqadi
      C   42  Chiqadi — ilova uni yopiq paytda ham oladi
      D   49  Chiqmaydi — bu xabar faqat tashkilotchiga chiqadi
  Qaysi eslatma darsdagi uch katakdan o'tadi? · 6 so'z · [38, 40, 38, 37] · eng uzun 40 / eng qisqa 37 · ✔C · OK
      A   38  «Hamma o'ynayapti, faqat siz yo'qsiz!»
      B   40  «Kecha beshta yangi o'yin e'lon qilindi»
      C✔  38  «Ertaga o'yiningiz bor: Shanba, 18:00»
      D   37  «Bugun ochmasangiz, o'yinsiz qolasiz»
## Arena (12) — ✔ o'rni va variant uzunliklari
   1. ✔A · 10 so'z · [32, 34, 30, 35] · OK  Mentor misolida 46 qurilmadan 17 tasi yana ochdi. Bu nima?
   2. ✔B · 6 so'z · [40, 42, 41, 43] · OK  Web-trekda sayt yopiq. O'yinchiga xabar yetadimi?
   3. ✔C · 9 so'z · [30, 36, 32, 30] · OK  «2 joy qoldi» uchun Mentor Backend'i qaysi hodisani yuboradi?
   4. ✔D · 8 so'z · [30, 35, 33, 35] · OK  «2 joy qoldi» xabari Mentor misolida kimga chiqadi?
   5. ✔A · 4 so'z · [36, 38, 35, 34] · OK  Rejalashtirilgan eslatmani kim qo'yadi?
   6. ✔B · 8 so'z · [28, 34, 31, 34] · OK  Nega uch kunlik eslatma «Yangi o'yin chiqdi» demaydi?
   7. ✔C · 11 so'z · [35, 37, 29, 34] · OK  Mentor misolida shu hafta ikkita o'yin eslatmasi bor. Uch kunlik eslatma-chi?
   8. ✔D · 5 so'z · [40, 45, 36, 41] · OK  Foydalanuvchi «Eslatmalar»ni o'chirsa, nima bo'ladi?
   9. ✔A · 5 so'z · [46, 50, 47, 48] · OK  Test holati nima uchun kerak?
  10. ✔B · 5 so'z · [34, 32, 32, 38] · OK  Mentor misolida `eslatmadan-ochdi` qachon yoziladi?
  11. ✔C · 9 so'z · [37, 35, 33, 34] · OK  Sinfda eslatmani o'zingiz bosib tekshirdingiz. Bu yozuv nima bo'ladi?
  12. ✔D · 8 so'z · [32, 39, 37, 39] · OK  Ilova o'zgardi. Eski APK o'rnatganlarda bugungi eslatma bormi?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Ekranlar
  12 ekran: 0 · Kirish — qaytmagan o'yinchi | 1 · Bugun quramiz | 2 · Yopiq ilova nimani biladi? | 3 · Amaliyot 1 — jonli xabar | 4 · 1-savol ✔ (jonli ball) | 5 · Qaysi eslatma foydali? | 6 · Amaliyot 2 — ilova yopiq paytdagi eslatma | 7 · 2-savol ✔ (jonli ball) | 8 · Amaliyot 3 — sanoq va o'chirgich | 9 · Natijalar (podium) — umumiy shablon | 10 · Takrorlash | 11 · Yakun
## Qolgan (?) qatorlar: []
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-08` «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» → **`m10-09` «Loyiha kuni: foydalanuvchini qaytaradigan eslatma»** (osti «hodisadan eslatmagacha — talabni siz yozasiz» — 1-ekran Mentori) →
  `m10-10` «50 foydalanuvchiga yetdingizmi?» (App.jsx 405–407, 06.10 o'qildi; yakundagi «Keyingi dars» shu nom va osti).
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`); metafora yo'q; keyssiz; bitta vizual — `QaytishSahna` (ikki telefon va Backend, 9.16; 0, 5-ekranda bitta telefon — o'sha manba); o'quvchining o'z mahsuloti — uch blok.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (uch harakat: qo'shilish → jonli xabar · yopish + e'lon → jonli xabar ko'rinmadi · ochish → yangi karta), 5 (to'rt matn → kataklar ✓/✗, hisoblagich; o'chirgich); 0-ekran javobdan keyin o'zgaradi.
  Bashoratlar tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi (SABOQ 11, 19–30).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 — «O'lchov» bo'limi (hammasi chegarada; eng uzun xato izohi 60).
- [x] Atamalar tayanch 2 va oldingi darslar bilan bir xil (qaytganlar foizi — 7-Modul, grep `PmMetricsLesson`; jonli xabar, eslatma, rejalashtirilgan eslatma, test holati — 4-dars; sanoq sahifasi, qurilma ID — 7–8-dars); siz-forma;
  tugma va yorliqlar ot-shaklda («Qoidadan o'tkazish», «Ilovani yopish», «Davom etish»); agent promptlari — T-002 istisnosi; eslatma va jonli xabar matnlari — olam ichidagi matn (T-008).
- [x] Testlar: variantlar bir shaklda, uzunligi yaqin (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z / tire faqat to'g'rida emas; Chiqadi / Chiqmaydi 2/2 · ✔: s4 B · s7 C · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [—] Final: tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (grep: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «kafolat» — o'quvchi matnida 0; «bir zumda» — faqat quruvchiga izohda).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — o'quvchiga «1-amaliyot», «1-blok»; `m10-09`, kod raqami, «pilot» yo'q); modul raqami LMS bo'yicha («7-Modulda»); «ekran» faqat ilova va telefon ekrani (dars ekrani — «mashq»);
  tarixiy voqea yo'q; T-038 — kelajak faqat «Keyingi dars» qatorida, 13-Modul faqat O'qituvchi eslatmasida · «KOD» (13) va «REPO» (6) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (qaytganlar foizi — sonlardan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 (hodisa, qadam, holat — bitta ma'no) · T-016/017 (metafora yo'q) · T-024 · T-029 (Mentor «Bu…» bilan boshlanmaydi) · T-034 ·
  T-039 («ilovangiz» — 11-Moduldan bor) · T-042 · T-043 («Mentor misolida», «Bu misolda», «Bu kursda») · T-044 · T-045 (rejalashtirilgan eslatma Backend'dan emas; yopiq ilovada jonli xabar ko'rinmaydi — natija tilida (04-FILTR 1), Backend eslatmasi tilga olinmaydi) · T-047 · T-048 · T-049 · T-052 · T-064 · T-066 · T-070 ·
  P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-026 (xato yo'li har blokda, ayb o'quvchida emas) · P-028 (Render, Netlify tugma nomlari taxmin qilinmadi) · P-036 · P-046 · P-048 · P-052 · P-055 · P-059 · P-062 · P-063 (`KATAKLAR`, `MATNLAR`) · P-064 · P-067 ·
  S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-018 (brend yo'q) · S-019 · S-020 · S-026 · S-040 · SABOQ 6, 9, 11, 12, 13, 16, 17, 19–31.
- [x] Tekshiruv: `npm run lint:til feedback/F-1006-12modul/09-RetentionDay-v3.md` — 0 error, 1 warn (37-qator: «o'yin to'lishi» fe'li — tayanch 1.9 dan aynan iqtibos, MD ichki qatori; o'quvchi matni emas).

