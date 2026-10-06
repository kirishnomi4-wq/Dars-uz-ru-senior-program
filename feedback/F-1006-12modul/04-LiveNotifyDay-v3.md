# 12-Modul · 4-dars «Loyiha kuni: jonli xabar va eslatma» — MD v3 (yangi dars, loyiha kuni)

Fayl: `src/10-Modull/LiveNotifyDayLesson.jsx` (kalit `m10-04`, App.jsx `type: 'Proyekt'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar; SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni, keyssiz (Qaror-0 22). Qolip: QKirish · QReja · QTushuncha · QTest · amaliyot bloki (QBlok) · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, `00-NOMLAR.md` 4-qator): «Loyiha kuni: jonli xabar va eslatma» · osti «hozir ko'ryapti, jonli xabar; mobil trekda — telefonga eslatma» ·
oldingi `m10-03` «Ekran o'zi yangilanishi uchun nimani yozasiz?» · keyingi `m10-05` «Ulanish uzilsa: buzamiz va tuzatamiz».
Namuna (tuzilish, hajm): 11-Modul `10-FoundationDay-v3.md`, `11-FeatureOne-v3.md` + `10-FILTR.md`, `11-FILTR.md` · pilot `02-WebSocketBasics-v3.md` (sahna, ulanish belgisi, blok shakli) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul «C» 19–31, majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · telefon maketi chapda, o'lchami barqaror · ≤3 blok · bo'sh ustun yo'q · yakuniy holat ixcham · ko'p elementli mashq ketma-ket · stilsiz element yo'q.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **B** · 7-ekran **D** · arena A·B·C·D ×3. Final tartib-mashqi yo'q (loyiha kuni, 172).
Vaqt: ≈ 90 daqiqa — 0–2 ≈ 12 · Amaliyot 1 ≈ 22 · 4–5 ≈ 9 · Amaliyot 2 ≈ 18 · 7 ≈ 2 · Amaliyot 3 ≈ 20 · podium, kartochkalar, yakun ≈ 7. Ulgurmagan o'quvchi yo'li — A-bo'lim 10-band. 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas (04-FILTR 37; tayanch 9.34 i).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.4):** dars oxirida o'quvchining o'z repo'sida, o'z mahsuloti va trekida uch qism ishlaydi: **«Hozir ko'ryapti»** (xona bilan) · **jonli xabar** · mobil trekda **rejalashtirilgan eslatma**, web-trekda **«Xabarlar» tasmasi**.
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m12-dars-04-start` (= `m12-dars-03-done`) → `m12-dars-04-done` (tayanch 3: xona `oyin-{id}`, «Hozir ko'ryapti: N» · jonli xabarlar (1.4 matnlari) · rejalashtirilgan eslatma — o'yindan bir soat oldin, chiqilganda bekor).
   Uyga vazifa yo'q (tayanch 4: loyiha kunlari 4, 9). Darsda yangi saqlash kaliti yozilmaydi (tayanch 8: 4-dars faqat o'qiydi).
2. **Bugungi asosiy fikr (P-013):** Bu modulda ilova ochiq bo'lsa, o'zgarish jonli xabar bo'lib keladi; yopiq bo'lsa, faqat ilova oldindan qo'ygan eslatma chiqadi.
3. **Oldingi darslardan keladigan narsa (tayanch 1.0, 1.2, 1.3; 11-Modul tayanchi 9.29 — aynan):**
   - «Maydon Jamoa» ekranlari: «O'yinlar» (`src/app/index.tsx`) · «O'yin» (`src/app/oyin/[id].tsx`: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman» → «Qo'shildingiz» · «O'yindan chiqish» · «Navbatga yozilish» / «Navbatdasiz»; tashkilotchida «Kelishini tasdiqladi: 7 / 9»).
   - `GET /oyinlar` javobida har o'yin: `id, kun, soat, maydon, kerak, qoshilgan, menQoshilganman, tasdiqlagan, menTasdiqlaganman, menTasdiqlayOlaman, navbatda, menNavbatdaman` (11-Modul 9.29). Namuna o'yin — **Shanba 18:00 · Mahalla maydoni · 8 / 10**, `oyinId: 1` (tayanch 9.20).
   - 2-dars: ilova Backend'ga token bilan doimiy ulangan (`mobil/src/ulanish.ts`; web — `prototip/src/ulanish.js`), «O'yinlar» tepasida ulanish belgisi «Ulangan» · «Ulanmoqda…» · «Ulanmagan».
   - 3-dars: Backend besh o'zgarishdan keyin `oyin-ozgardi { oyinId, sabab }` yuboradi (sabablar `qoshildi` · `chiqdi` · `tasdiqladi` · `navbatga-yozildi` · `elon-berildi`); ilova tinglaydi va `GET /oyinlar` ni qayta so'raydi; `README.md` «Real vaqt» bo'limida sxema, ulanish holatlari va chekka holatlar.
     O'quvchining 3-dars talabi — `pm-m10d3-talab` (`buzilmasin` qatori Amaliyot 1 ga oldindan yoziladi); trek — `pm-m9d8-platforma.trek`.
   - 11-Modul 6-darsidagi eslatma maketi (roadmap'da «keyinroq»): «Maydon Jamoa» · «Bugun, 18:00 · Mahalla maydoni» — bugungi Mentor eslatmasi aynan shu matn.
   - Kanonik gap (tayanch 1.2, 9.17): «Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.» — bu darsda istisno: `korayotganlar-ozgardi` sonning o'zini olib keladi (2-ekran QIzohi — bir gap).
4. **Mazmun (tayanch 1.4 — aynan):**
   - **Xona** — Backend'dagi ulanishlar guruhi: hodisa faqat shu guruhdagilarga boradi. Mentor misolida har o'yinning o'z xonasi bor (`oyin-{id}`); ilova «O'yin» ekrani ochilganda xonaga kiradi, yopilganda chiqadi.
     Ilova → Backend: `oyin-ochildi` · `oyin-yopildi` (`{ oyinId }`). Backend → xona: `korayotganlar-ozgardi` (`{ oyinId, soni }`).
   - **«Hozir ko'ryapti: 3»** — «O'yin» ekranida; shu o'yin ekranini hozir ochib turgan **ulanishlar** soni (o'quvchining o'zi ham sanaladi). Birligi — ochiq ekran, odam emas (bitta odam ikki qurilmada — ikkita). Ism ko'rsatilmaydi (Qaror-0 6).
     Bu son Database'da yo'q — faqat Backend xotirasidagi ulanishlardan; shuning uchun hodisa sonning o'zini olib keladi.
   - **Jonli xabar** — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar. Qoidalar (Mentor misoli; shu darsda qurilgan xabarlar uchun — 9-darsda qo'shilmagan o'yin uchun yangi xabar qo'shiladi, tayanch 9.41 e): faqat **o'ziga tegishli o'yin** uchun (o'zi qo'shilgan, navbatda turgan yoki o'zi e'lon qilgan); **o'z harakati** uchun chiqmaydi; ism yo'q.
     Matnlar (so'zma-so'z, bitta manba `JONLI_XABARLAR`): `qoshildi` — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» · `chiqdi` — «Shanba, 18:00 — joy bo'shadi: 8 / 10» · to'lganda — «Shanba, 18:00 — o'yin to'ldi: 10 / 10» ·
     `tasdiqladi` (faqat tashkilotchiga) — «Shanba, 18:00 — kelishini tasdiqladi: 8 / 9» · navbatdagi o'yinga o'tganda — «Navbatdan o'yinga o'tdingiz: Shanba, 18:00».
     **Qaysi xabar chiqadi (tayanch 9.36; 04-FILTR 5, 15, 16):** hodisadan keyin qayta so'ralgan javob oldingisi bilan solishtiriladi — qo'shilganlar ko'paysa «qo'shildi» (o'yin to'lsa — «to'ldi»), kamaysa «joy bo'shadi», tasdiqlaganlar ko'paysa — tashkilotchiga; son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar yo'q.
     O'z harakati — javobdagi o'z maydonlari (`menQoshilganman`, `menNavbatdaman`, `menTasdiqlaganman`) o'zgargan bo'lsa (navbatdan o'tish bundan mustasno); hodisaga yangi maydon qo'shilmaydi. Tashkilotchilik — `menTashkilotchiman` (tayanch 9.25; GATE M M-q3).
   - **Eslatma** — telefon ekraniga chiqadigan xabar; ilova yopiq bo'lsa ham chiqadi. Ikki turi: **rejalashtirilgan eslatma** — ilova o'zi oldindan vaqtini belgilab qo'yadi (bu modulda quriladi) ·
     **Backend yuboradigan eslatma** — hodisa bo'lganda Backend telefonga yuboradi (bu modulda **qurilmaydi**: 5-ekranda chizmada va bir gapda — «… u bu modulda qurilmaydi: Google yoki Apple xizmati va alohida sozlash kerak»; 04-FILTR 3).
   - **Mentor eslatmasi:** o'yinchi «Qo'shilaman» ni bosganda ilova eslatmani **o'yindan bir soat oldinga** rejalashtiradi: sarlavha «Maydon Jamoa», matn «Bugun, 18:00 · Mahalla maydoni». O'yinga bir soatdan kam qolgan bo'lsa — rejalashtirilmaydi.
     «O'yindan chiqish» — eslatma bekor qilinadi. Birinchi marta ilova ruxsat so'raydi; ruxsat berilmasa — ilova ishlayveradi, eslatma chiqmaydi (xato yo'li: «Ruxsat bermagan bo'lsangiz — telefon sozlamalaridan yoqiladi»).
   - **Halol chegaralar (darsda ochiq aytiladi — 5-ekran, Amaliyot 3 «Ochish», 7-ekran testi):** rejalashtirilgan eslatma faqat **shu telefonda bo'lgan** ishdan tug'iladi; boshqa odam tufayli bo'lgan o'zgarish («joy bo'shadi») ilova yopiq telefonda **ko'rinmaydi** — u faqat jonli xabar bo'lib, ilova ochiq paytda ko'rinadi (04-FILTR 1: natija aytiladi, ulanish qachon uzilishi emas). Navbatdan o'yinga o'tganda eslatma qo'yilmaydi — birinchi versiya cheklovi (tayanch 9.36).
     Telefonda eslatmalar o'chirilgan bo'lsa — chiqmaydi. Boshqa telefondan kirilsa — u telefonda eslatma yo'q.
   - **Tekshirish — «test holati»:** eslatma vaqtini vaqtincha bir daqiqadan keyinga qo'yib ko'riladi, keyin qaytariladi (11-Modul so'zi).
   - **Web-trek:** Amaliyot 1, 2 — bir xil (brauzerda `socket.io-client`); Amaliyot 3 — **«Xabarlar»** tasmasi: sahifa ochiq paytda kelgan oxirgi beshta jonli xabar (eslatmaning o'rnini bosmaydi — boshqa ish; 04-FILTR 30). Halol qator: «Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi.»
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **xona** — Backend'dagi ulanishlar guruhi: hodisa faqat shu guruhdagilarga boradi (2-ekran, harakatdan keyin). Ishlatilmaydi: room (prozada), «guruh» xona ma'nosida (Telegram guruhi bilan aralashadi).
   - **hozir ko'ryapti** — shu ekranni hozir ochib turgan ulanishlar soni; yozuvi «Hozir ko'ryapti: 3». Ishlatilmaydi: onlayn, presence, «hozir saytda».
   - **jonli xabar** — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar (5-ekran, harakatdan keyin). Ishlatilmaydi: toast, bildirishnoma, push.
   - **eslatma** · **rejalashtirilgan eslatma** · **Backend yuboradigan eslatma** — yuqoridagi ta'riflar (5-ekran). Ishlatilmaydi: push (kursda — faqat `git push`; kartochkada bir marta «inglizchasi: push notification»), push-xabar, bildirishnoma, «mahalliy eslatma» (faqat MD ichki so'zi).
   - **hodisa** — bu darsda **faqat** ulanish orqali yuboriladigan nomli xabar (tayanch 2: 2, 3, 4, 5, 9-darslar; T-015). **tinglovchi** — hodisa kelganda ishlaydigan kod (Amaliyot 2 «Qayerda» qatorida).
   - **test holati** — Amaliyot 3 4-qadamida (11-Modul so'zi). **ruxsat** — telefonning eslatmaga ruxsati (oddiy so'z).
   - **xabar** — o'quvchi matnida faqat «jonli xabar», «eslatma» ta'rifi va «Xabarlar» tasmasi ichida; hodisa uchun «xabar» deyilmaydi. **«Xabarlar» tasmasi** — web-trekdagi joy nomi.
   - **holat** — o'quvchi matnida faqat «test holati» (atama); boshqa ma'noda ishlatilmaydi (T-015). Ulanish belgisi — 2-darsdagi nomi bilan.
   - Oldingi darslardan, qayta ta'riflanmaydi: Backend · Database · token · doimiy ulanish · ulanish belgisi · agent (Antigravity) · prompt · talab (qayerda · nima qilsin · nima buzilmasin) · tekshirish (o'z ishini ko'rish) · Expo Go · deploy · e'lon · tashkilotchi · o'yinchi.
   - **Ishlatilmaydi:** server (prozada), real-time, event, notification (prozada), «sinov» (bu darsda real odam bilan ish yo'q — hamma joyda «tekshirish»), «sinab ko'ring», «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova va telefon ekrani), A1/A2/A3, `m10-04`.
6. **Mentor misolidagi sonlar va matnlar (tayanch 1.0, 1.4, 9.20 — aynan):** Shanba, 18:00 · Mahalla maydoni · 8 / 10 (`oyinId: 1`) → 9 / 10; «Hozir ko'ryapti: 1 · 2 · 3»; eslatma — o'yindan bir soat oldin (17:00); jonli xabarlarning besh matni; test holati — bir daqiqa.
   Sahnadagi soat «16:59» → «17:00» — eslatma vaqtining ko'rinishi (TAYANCHGA SAVOL 2). Boshqa son yo'q; statistika deyilmaydi (T-043).
7. **Metafora yo'q. Keyssiz** (loyiha kuni, Qaror-0 22). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: o'yinchi, tashkilotchi, sherik («1-telefon · siz» / «2-telefon · boshqa o'yinchi» — sahna yorliqlari).
8. **Amaliyot bloki (tayanch 4 — 11-Modul modeli aynan):** 4 qadam (Ochish → Prompt → Ishga tushirish → Telefonda tekshirish), hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam»da to'liq prompt). 5-qadam yo'q.
   **Talab zinapoyasi (tayanch 4):** Amaliyot 1 — tayyor talab + bitta joy · Amaliyot 2 — bitta qator («Nima qilsin») · Amaliyot 3 — uch qator (qayerda · nima qilsin · nima buzilmasin; ostida kulrang savol — 11-Modul 11-dars naqshi).
   **Bloklar — Mentor misoli, umumiy qolip emas (sinf 2b):** o'quvchi mahsulotida bitta yozuv uchun alohida ochiladigan ekran bo'lmasa — eng ko'p ochiladigan ekran (bitta xona); jonli xabarga arziydigan o'zgarish — README «Real vaqt» sxemasidan o'zi tanlaydi; eslatma — «foydalanuvchi o'z ishini qachon unutishi mumkin?» savolidan («Ochish» qadamlarida).
   Texnologiya nomi promptda — faqat yangi kutubxona (`expo-notifications`, Amaliyot 3 tayyor qatori; README «Stek»ga ham). Push odati — `git status` → `git add <fayl>`; xato — faqat xato qatori, `.env` qiymatlari, token va kalitlar yuborilmaydi (tayanch 3).
   **Agent tekshiruvda «boshqa o'yinchi»** — tayanch 1.3 naqshi: agent o'zi ochgan tekshiruv akkauntidan (tayanch 9.35) ulanish yoki so'rov yuboradi, qaysi akkaunt va qaysi `id` ekanini aytadi; akkaunt va yaratgan yozuvlarini aytgan `id` lari bo'yicha o'chiradi. Juftlikda — sherik telefoni (web havola yoki Android'dagi Expo Go; Expo akkaunti ma'lumoti boshqaga berilmaydi).
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, Backend tuguni, xona doirasi, konvert, jonli xabar va eslatma kartalari — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida (11-Modul 9.62 yashili); logotip yo'q;
   rang — faqat holat foni (D3): yangi kirgan nuqta/son — `accent`, ishladi — `ok`, yetmagan hodisa — `ink2` (kulrang).
10. **Vaqt (90 daqiqa) va ulgurmagan yo'l (sinf 10):** taqsimot tepada. Amaliyot 1 da Render kutishi dars oqimini to'xtatmaydi (3-qadamda kutish paytidagi ish yozilgan); ulgurmasa — 4-qadam Amaliyot 2 tekshiruvi bilan birga. Blok bajarilgan sanaladi faqat 4-qadam «Bajardim»idan keyin; «Davom etish» 3-qadamdan keyin ochiladi (04-FILTR 38).
    Amaliyot 2 va 3 da Backend odatda o'zgarmaydi — Render kutilmaydi. Har blokda «Ulgurmasangiz» qatori va «Ortda qoldingizmi». Yakun sarlavhasi holatga qarab (11-ekran). O'qituvchi eslatmasi — 1-ekran va bloklarda.
11. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 06.10.2026); o'quvchiga ko'rinmaydi. Qisqasi: xona — faqat Backend tushunchasi, uzilgan ulanish hamma xonadan o'zi chiqadi, `io.to(xona).emit` (socket.io) ·
    rejalashtirilgan eslatma Expo Go'da ishlaydi, Backend yuboradigan eslatma — yo'q (SDK 53 dan) · `scheduleNotificationAsync` (trigger `DATE`), `cancelScheduledNotificationAsync(id)`, `requestPermissionsAsync()` · Android 13 da ruxsat oynasi kamida bitta eslatma kanali yaratilgandan keyin chiqadi ·
    ilova ochiq turganda eslatma `setNotificationHandler` siz ko'rsatilmaydi · Android 12 dan aniq vaqt uchun `SCHEDULE_EXACT_ALARM` ruxsati tilga olinadi (Shubhali 3) · `expo-notifications` web'da yo'q.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0). 3-darsdan keyin ro'yxat o'zi yangilanadi; bugun ilova o'yinchini xabardor qiladi: kim ko'rib turgani (son), ilova ochiq bo'lsa — jonli xabar, yopiq bo'lsa — eslatma.
  11-Modul roadmap'ida «keyinroq» qolgan ikkinchi ish — o'yindan oldin eslatma — shu darsda quriladi. O'quvchi xuddi shuni o'z mahsulotida qiladi (uch blok).
- **Hook:** ilova yopiq telefonda soat 17:00 bo'lganda eslatma chiqadi — uni kim qo'ygan? → 2-ekranda «O'yin» ekrani ochilganda xona va son → Amaliyot 1 → 5-ekranda bitta o'yin ikki holatda: ochiq ilovada jonli xabar, yopiq ilovada «joy bo'shadi» ko'rinmaydi, eslatma esa chiqadi → Amaliyot 2 → Amaliyot 3.
- **Bitta vizual — real vaqt sahnasi** (tayanch 9.16; bitta manba `JONLI_SAHNA` + `NAMUNA_OYIN` + `JONLI_XABARLAR` + `ESLATMA`, 163/180):
  - **chapda «1-telefon · siz»** (ramka ≈170×272, o'lcham barqaror — SABOQ 22; yorliq ramka ustida — SABOQ 23): «Maydon Jamoa» nomi o'z rangida; holatlar: **O'yin** (ostida «Hozir ko'ryapti: N») · **O'yinlar** · **ilova yopiq** — telefon ekrani: soat, kun «Shanba», «Maydon Jamoa» ilova belgisi (oddiy yashil shakl + nom).
    Tepada ikki karta turi: **jonli xabar** (ilova ichida, bir necha soniya, o'zi yo'qoladi) va **eslatma** (telefon ekranida, sarlavha «Maydon Jamoa» + matn) — shakli farqli: jonli xabar ilova ranglarida, eslatma telefonning kulrang kartasi.
  - **o'rtada Backend tuguni** — «Backend», ichida «Database: N» belgisi va **xona doirasi** `oyin-1` (ichida ulanish nuqtalari; nuqta kirsa — accent, bir lahza; chiqsa — so'nadi).
  - **o'ngda «2-telefon · boshqa o'yinchi»** — O'yinlar / O'yin («Qo'shilaman», «O'yindan chiqish»).
  - **chiziq** telefon ↔ Backend: ochiq (sekin yonib turadi) · ilova yopiq — xira, yorliqsiz (ulanish qachon uzilishi ko'rsatilmaydi — 04-FILTR 1). **Konvert** — hodisa (`oyin-ochildi`, `korayotganlar-ozgardi`, `oyin-ozgardi`), ochiq chiziq bo'ylab uchadi; yopiq ilovaga konvert chizilmaydi — telefon yonida yorliq «jonli xabar ko'rinmadi».
  - Son almashganda bir lahza kattalashib qaytadi (11-Modul 9.14). `prefers-reduced-motion` da konvert yurmaydi, kartalar tushmaydi — holatlar bir zumda almashadi (DE-200).
  - Ishlatilishi: 0 (bitta telefon, ilova yopiq) · 1 (tayyor holat, o'zi yuradi) · 2 (ikki telefon + xona) · 5 (ikki telefon, ochiq → yopiq) · bloklar o'ng tomoni (kutilgan natija).
- **Yakun:** o'z mahsulotingizda uch qism · keyingi dars — «Ulanish uzilsa: buzamiz va tuzatamiz».

---

## 0 · Kirish — yopiq ilova eslatadimi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Ilovani yopgan bo'lsangiz, o'yinni sizga kim eslatadi?** (54)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida siz Shanba 18:00 dagi o'yinga qo'shilgansiz, telefon esa cho'ntakda — avval javobni tanlang.
  - javobdan keyin: Telefon ekraniga qarang, keyin «Davom etish»ni bosing.
- Navbatdagi harakat (halqa + yengil pulsatsiya): uchta variant guruhi.
- Maket (chap, bitta telefon ≈170×272, yorliq ramka ustida «1-telefon · siz»): ilova yopiq — telefon ekrani: soat **16:59**, ostida «Shanba»; ekranda «Maydon Jamoa» ilova belgisi (oddiy yashil shakl + nom o'z rangida).
  Telefon ostida kichik karta: «Shanba, 18:00 · Qo'shildingiz».
- Variantlar (radio, ballsiz):
  - Backend — o'yindan oldin telefonga yozadi (41)
  - ✔ Ilova — qo'shilganda vaqtini oldindan qo'yadi (45)
  - Hech kim — ilovani o'zingiz ochib ko'rasiz (42)
- Javob — 2-variant: **Aynan!** Bu misolda ilova «Qo'shilaman» bosilganda eslatmani o'yindan bir soat oldinga qo'yib qo'yadi. (100)
- Javob — 1-variant: **Qiziq fikr!** Backend yuboradigan eslatma ham bor, u alohida sozlashni talab qiladi. Bu misolda vaqtni ilova qo'yadi. (115)
- Javob — 3-variant: **Qiziq fikr!** 11-Modulda shunday edi: roadmap'da eslatma keyinroqqa qoldirilgan. Bugun u quriladi. (96)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → soat «16:59» → «17:00» (raqam almashadi) → ekran tepasidan eslatma kartasi sirg'alib tushadi: «Maydon Jamoa» (o'z rangida) · «Bugun, 18:00 · Mahalla maydoni» →
  eslatmadan pastdagi «Qo'shildingiz» kartasiga uzuq chiziq chiziladi, ustida kichik yorliq «qo'shilganda qo'yilgan». Backend tuguni bu ekranda yo'q. Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): yopiq ilovada nima chiqishi mumkin. Uchala variant «kim — nima qiladi» shaklida; 1-variant hayotda rost turi (Backend yuboradigan eslatma) — javobi uni yolg'onga chiqarmaydi (P-016), faqat bugungi yo'lni aytadi.
  3-variant — 11-Moduldagi haqiqiy holat (roadmap'da «keyinroq», tayanch 1.0). «Eslatma» so'zi variantlarda yo'q — u javobdan keyin chiqadi (T-011).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida ilovangiz foydalanuvchini xabardor qiladi.** (55)
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qurasiz. Talabni har blokda ko'proq o'zingiz yozasiz.
- Chap — «Dars oxirida»: sahna **tayyor** holatda, bir marta o'zi yuradi (DE-200): 1-telefon «O'yin» (Shanba, 18:00 · Mahalla maydoni · 8 / 10 · «Hozir ko'ryapti: 2») →
  tepada jonli xabar «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» (bir necha soniya, keyin yo'qoladi) → ilova yopiladi → telefon ekrani «17:00», eslatma «Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni».
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 11-Modul loyiha kuni naqshi, F-1003-06):
  - 01 · O'yin ekrani: hozir u nechta qurilmada ochiq
  - 02 · Ilova ochiq: o'zgarish tepada qisqa xabar bo'lib chiqadi
  - 03 · Ilova yopiq: o'yindan bir soat oldin telefonga eslatma
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m12-dars-04-start` · namuna `m12-dars-04-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; bloklarni o'z mahsulotingizda bajarasiz. Web-trekda 3-qadamda — saytdagi «Xabarlar» tasmasi.
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: darsning og'ir qismi — Amaliyot 1 (Backend o'zgaradi, Render kutiladi) va Amaliyot 3 (telefon ruxsati). Telefonda eslatma ruxsat oynasi va Android'dagi ko'rinishi pilotda sinaladi — o'quvchida chiqmasa, bu uning xatosi emas.
  Uchish rejimi va uzilish bu darsda tekshirilmaydi (5-darsning ishi; o'quvchiga aytilmaydi — T-038). Mentor repo'sidagi `m12-dars-04-done` qayta ulanishni maxsus boshqarmaydi (tayanch 1.5).
✎ Mentorning birinchi gapi — blok modeli; ikkinchisi — talab zinapoyasi (tayanch 4). Reja sarlavhasi — natija va'dasi (P-014), yangi atama yo'q; «Hozir ko'ryapti» chap animatsiyada ilova yozuvi sifatida ko'rinadi.

## 2 · Xona  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · xona
- Sarlavha: **O'yin ekrani hozir nechta qurilmada ochiq?** (42)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin 2-telefonda Shanba 18:00 o'yinini oching.
  - 1-harakatdan keyin: Endi 2-telefonda «‹ O'yinlar» ni bosib, ro'yxatga qayting.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **2-telefon o'yinni ochsa, 1-telefondagi son nima bo'ladi?** · O'zgarmaydi · Pastga tortganda o'zgaradi · O'zi 2 ga o'tadi (S-015: bir o'lchov, o'sish tartibida)
- Sahna (real vaqt sahnasi; ikkala telefon Backend'ga ulangan — chiziqlar ochiq):
  - 1-telefon · siz — «O'yin»: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shildingiz» (o'chiq) · ostida **«Hozir ko'ryapti: 1»**
  - Backend — «Database: 8»; ichida xona doirasi, yorlig'i `oyin-1`, ichida bitta nuqta (1-telefon ulanishi; nuqtadan 1-telefonga ingichka chiziq)
  - 2-telefon · boshqa o'yinchi — «O'yinlar» ro'yxati; Shanba 18:00 kartasi halqada (bashoratdan keyin)
  - Qadam belgilari (tugma yonida, SABOQ 21): 1 O'yinni oching · 2 Ro'yxatga qayting
- **Harakat → Vizual o'zgarish:**
  1. Shanba 18:00 kartasi (2-telefon) → 2-telefonda «O'yin» ekrani ochiladi → konvert `oyin-ochildi` · `{ oyinId: 1 }` 2-telefondan Backend'ga → `oyin-1` doirasiga ikkinchi nuqta kirib keladi (accent, bir lahza) →
     Backend'dan ikki konvert `korayotganlar-ozgardi` · `{ oyinId: 1, soni: 2 }` — xonadagi ikkala telefonga → ikkalasida «Hozir ko'ryapti: 2» (son kattalashib qaytadi). 2-telefondagi «‹ O'yinlar» halqaga o'tadi.
     Nom qatori 1 (bitta): Backend'dagi ulanishlar guruhi — xona: hodisa faqat shu guruhdagilarga boradi.
  2. «‹ O'yinlar» (2-telefon) → konvert `oyin-yopildi` · `{ oyinId: 1 }` → nuqta doiradan chiqib so'nadi → konvert `korayotganlar-ozgardi` · `{ oyinId: 1, soni: 1 }` faqat 1-telefonga → «Hozir ko'ryapti: 1».
     2-telefonga konvert bormaydi — chizig'i yonida kulrang yorliq «xonada emas».
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: o'zi 2 ga o'tadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda son — o'yin ekranini hozir ochib turgan ulanishlar: odamlar emas, ochiq ekranlar sanaladi. (101)
- Qator (`QIzoh`, xulosadan keyin, bitta): Bu son Database'da yo'q — shuning uchun bu hodisa sonning o'zini olib keladi. (77)
- Tugadi (199): qadam belgilari yopiladi; ikki telefon va xona doirasi (bitta nuqta) butun enga, fokusda; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ T-011 tartibi: hodisa sahnada (ekran ochildi → son o'zgardi) → «xona». Boshidagi «Hozir ko'ryapti: 1» — o'quvchining o'zi ham sanalishi (tayanch 1.4) ko'z oldida. 2-qadam — xona tashqarisiga hodisa bormasligi (ta'rifning ikkinchi yarmi) harakat bilan.
  QIzoh — kanonik gapdan farq bir gapda (tayanch 1.4, 9.17). «Ochib turgan» — ulanish (qurilma) bo'yicha; xulosa «odamlar emas» bilan chegaralangan.
- O'qituvchi eslatmasi: son — xonadagi ulanishlar; odatda har ochiq o'yin ekrani bittadan ulanish beradi (04-FILTR 7).

## 3 · Amaliyot 1 — «Hozir ko'ryapti»  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈22 daq)
- Eyebrow: Amaliyot 1 · hozir ko'ryapti
- Sarlavha: **Ilovangizda «Hozir ko'ryapti» soni ko'rinsin.** (45)
- Mentor: Talab tayyor — bitta joyga qaysi ekran sanalishini yozasiz; «1 · Ochish»dan boshlang.
- Model (tayanch 4): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna. Talab zinapoyasi: tayyor talab + bitta joy (`{sanaladigan ekran}`).
  Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — blok tepasida «Mobil trek» · «Web-trek» tugmalari, tanlov shu kalitga yoziladi — 11-Modul 9.77).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (3-darsdagi holat: ilova Backend'ga ulangan, ro'yxat o'zi yangilanadi). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.
     Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz Netlify'da ochiq tursin.
     Sanaladigan ekranni tanlang: Mentor misolida — «O'yin» ekrani, har o'yinga alohida xona. Mahsulotingizda bitta yozuv uchun alohida ochiladigan ekran bo'lmasa — eng ko'p ochiladigan ekranni oling: unda bitta xona bo'ladi. Mahsulotingizni bir vaqtda bitta odam ishlatsa — son sizning ochiq qurilmalaringizni sanaydi (masalan, telefon va kompyuter).
  2. **Prompt** — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring (mobil trek ko'rinishi; web-trek gapi pastda):
     > Qayerda: `backend/` — 2-darsdagi gateway; `mobil/` — `src/ulanish.ts` va {sanaladigan ekran}.
     > Nima qilsin: {sanaladigan ekran} ochilganda ilova Backend'ga hodisa yuborsin va Backend shu ulanishni xonaga qo'shsin; ekran yopilganda — xonadan chiqarsin. Ekran har yozuv uchun alohida ochilsa — har yozuvning o'z xonasi bo'lsin.
     > Xonadagi ulanishlar soni o'zgarsa, Backend shu xonaga yangi sonni yuborsin — ulanish uzilganda ham; ekranda «Hozir ko'ryapti: N» tursin, N ga o'zim ham kiraman. Ism ko'rsatilmasin — faqat son.
     > Nima buzilmasin: {buzilmasin}; ro'yxat o'zi yangilanishi, ulanish belgisi va ekranni kim ko'ra olishi avvalgidek qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {sanaladigan ekran} — «masalan: «O'yin» ekrani (`src/app/oyin/[id].tsx`)» (ikki joyda bir xil — bitta qavs)
     - {buzilmasin} — 3-darsdagi talabingizdan oldindan yozilgan, tahrirlasa bo'ladi; saqlanmagan bo'lsa — bo'sh, kulrang «masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `backend/` — 2-darsdagi gateway; `mobil/` — `src/ulanish.ts` va «O'yin» ekrani (`src/app/oyin/[id].tsx`).
     > Nima qilsin: har o'yinga alohida xona — `oyin-{id}`. «O'yin» ekrani ochilganda ilova `oyin-ochildi` (`{ oyinId }`) yuborsin va Backend shu ulanishni o'sha xonaga qo'shsin; ekran yopilganda — `oyin-yopildi`, xonadan chiqarsin.
     > Xonadagi ulanishlar soni o'zgarsa, Backend shu xonaga `korayotganlar-ozgardi` (`{ oyinId, soni }`) yuborsin — ulanish uzilganda ham; «O'yin» ekranida «Hozir ko'ryapti: N» tursin, N ga o'zim ham kiraman. Ism ko'rsatilmasin — faqat son.
     > Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash, ro'yxat o'zi yangilanishi va ulanish belgisi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, trek kalitidan o'zi almashadi): «Qayerda» — `prototip/` dagi `src/ulanish.js` va sanaladigan sahifa; Backend qismi ikkala trekda bir xil, «Hozir ko'ryapti» sahifada turadi.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "hozir ko'ryapti"`, `git push`.
     Render Backend'ning yangi versiyasini chiqaradi — tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent yozgan fayllardan ikki joyni toping: Backend'da ulanishni xonaga qo'shadigan qator va yangi son yuboriladigan qator.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda `git push` dan keyin Netlify saytni odatda o'zi yangilaydi.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini bajarib ko'ring. Mentor misolida:
     (1) Render tugagach, ilovada «O'yin» ekranini qaytadan oching (Shanba, 18:00): «Hozir ko'ryapti: 1» bo'lishi kerak — bu sizning ekraningiz.
     (2) Ikkinchi ulanish. **Web-trekda — o'zingiz:** shu sahifani kompyuterda ikkinchi oynada oching — telefonda son 2 ga o'tishi kerak; oynani yoping — yana 1. **Mobil trekda — sherik:** uning telefonidan shu o'yinni oching (Android'dagi Expo Go; Expo akkaunti ma'lumoti boshqaga berilmaydi), keyin yoping.
         Sherik bo'lmasa — agentga yozing: «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas), shu akkaunt nomidan Backend'ga ikkinchi ulanish och, shu o'yin ekrani ochilgandek hodisa yubor va 30 soniyadan keyin ulanishni yop. Keyin akkauntni `id` si bo'yicha o'chir. Qaysi akkaunt va qaysi o'yin `id` sini ishlatganingni ayt. Boshqa yozuv yaratma.» — son odatda bir necha soniyada 2 ga, 30 soniyadan keyin yana 1 ga o'tishi kerak (04-FILTR 11, 12).
     (3) Avvalgi ishlar: ro'yxatni pastga torting, ulanish belgisiga qarang — avvalgidek ishlasin.
     Agentning «ulanish ochdim» degani — uning so'zi; son o'zgarganini esa o'zingiz ko'rdingiz. Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     Web-trekda: saytingizni telefon brauzerida oching; ikkinchi ulanish — kompyuterdagi ikkinchi oyna.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam bitta qatorga yig'iladi (✓), keyingisi ochiladi; o'ngdagi maket kadrlari bir marta o'zi yuradi; 4-qadamdan keyin yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; uch kadr bir marta o'zi yuradi):
  - «O'yin» (Shanba, 18:00 · Mahalla maydoni · 8 / 10): «Hozir ko'ryapti: 1» → «Hozir ko'ryapti: 2» (son kattalashib qaytadi) → «Hozir ko'ryapti: 1»
  - ostida fayl kartasi: `backend/src/…gateway.ts` (o'zgardi) · `mobil/src/ulanish.ts` (o'zgardi) · `mobil/src/app/oyin/[id].tsx` (o'zgardi)
  - web-trekda: brauzer oynasi `….netlify.app`, sahifada o'sha yozuv; fayl kartasida `prototip/src/ulanish.js`.
- Hammasi bajarilgach (yashil): «Hozir ko'ryapti» ishlaydi: ochiq ekranlar sanaladi, ism ko'rinmaydi. (69)
- Ulgurmasangiz (kichik, pastda): Render kutishi cho'zilsa — 3-qadamdan keyin «Davom etish» ochiladi: Amaliyot 2 ga o'ting. 4-qadamni Amaliyot 2 tekshiruvi bilan birga qilib, shu yerga qaytib «Bajardim»ni bosasiz — blok shundan keyin bajarilgan sanaladi.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-04-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{sanaladigan ekran}` — oldindan bo'sh, kulrang «masalan»; `{buzilmasin}` ← `pm-m10d3-talab.buzilmasin` (tahrirlanadi; tayanch 8 — 4-dars shu kalitni o'qiydi). Kalit yo'q bo'lsa blokda ikki joy bo'ladi (TAYANCHGA SAVOL 4).
  Agentning ikkinchi ulanishi — tayanch 1.3 naqshi (agent o'zi ochgan tekshiruv akkauntidan; `id` aytiladi); Database'ga faqat shu akkaunt yoziladi — agent uni o'sha xabarda `id` bo'yicha o'chiradi (tayanch 9.35, 03-FILTR 15). Agent javobi — da'vo (sinf 2d), son — o'quvchining o'z tekshiruvi.
  Tekshiruv «O'yin» ekranini qaytadan ochishdan boshlanadi: Render yangi versiyasida ulanish uziladi (tayanch 6) — qayta ulangandan keyingi xona holati 5-darsning ishi (tayanch 1.5), bu yerda tilga olinmaydi.
- O'qituvchi eslatmasi: Render'da yangi versiya chiqqanda ulanish uziladi — belgi bir oz «Ulanmoqda…» bo'lib turishi mumkin; o'quvchi shundan keyin «O'yin» ekranini qaytadan ochsin. Uchish rejimi bu blokda yo'q.

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Bitta o'yinchi o'yinni telefoni va planshetida ochdi. «Hozir ko'ryapti» qanchaga oshadi?** (11 so'z)
  - Bittaga — bitta odam bir marta sanaladi
  - ✔ Ikkiga — har ochiq ekran alohida sanaladi
  - Oshmaydi — bu son Database'dan keladi
  - Ikkiga — ikkala qurilma o'yinga qo'shiladi
- Kalit: **B** (index 1). To'rttalasi «son — sabab» shaklida, tire hammasida; «Ikkiga» B va D da (shakl-telli yo'q, §147); savolda son yo'q — javobdagi «ikkiga» savolni takrorlamaydi (S-019).
- To'g'ri izohi: Ochiq ekranlar sanaladi: ikki qurilma — ikki ulanish. (53)
- Xato izohlari (≤60):
  - A: Son odamlarni sanaydimi yoki ochiq ekranlarni? (46)
  - C: Bu son Database'da bormidi? Uni kim sanaydi? (44)
  - D: O'yinni ochish va «Qo'shilaman»ni bosish — bir ishmi? (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda ikki telefon — ikki o'yinchi edi; savol boshqa holatni (bitta odam, ikki qurilma) so'raydi (§106). D — «ko'rish» va «qo'shilish»ni aralashtiradigan yanglish tasavvur (S-004).

## 5 · Ochiq va yopiq ilova  ← QTushuncha (bashorat + 4 qadam)
- Eyebrow: Tushuncha · ochiq va yopiq
- Sarlavha: **Ilova ochiq va yopiq: o'zgarish sizga qanday yetadi?** (52)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.
  - 1-harakatdan keyin: Endi 1-telefondagi «Ilovani yopish»ni bosing.
  - 2-harakatdan keyin: 2-telefonda «O'yindan chiqish»ni bosing va 1-telefonga qarang.
  - 3-harakatdan keyin: Endi «17:00 ga o'tkazish»ni bosing va 1-telefonga qarang.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz; tanlangach ixcham qator): **Ilova yopiq paytda joy bo'shasa, bu telefoningizda ko'rinadimi?** · Ha, telefon ekranida chiqadi · Yo'q, ko'rinmaydi
- Sahna (real vaqt sahnasi; namuna o'yin «8 / 10», siz qo'shilgansiz):
  - 1-telefon · siz — «O'yinlar»: Shanba, 18:00 · Mahalla maydoni · 8 / 10; telefon ostida sahna tugmasi «Ilovani yopish» (xira — 1-qadamdan keyin halqaga o'tadi)
  - Backend — «Database: 8»; yonida kichik soat «16:59» va sahna tugmasi «17:00 ga o'tkazish» (xira — 3-qadamdan keyin halqaga o'tadi)
  - 2-telefon · boshqa o'yinchi — «O'yin»: «Qo'shilaman» (halqada, bashoratdan keyin)
  - Qadam belgilari (tugma yonida): 1 Qo'shiling · 2 Ilovani yoping · 3 O'yindan chiqing · 4 Soatni suring
- **Harakat → Vizual o'zgarish:**
  1. «Qo'shilaman» (2-telefon) → konvert «so'rov» Backend'ga → «Database: 8» → «9» → ochiq chiziq bo'ylab konvert `oyin-ozgardi` · `qoshildi` 1-telefonga → ilova qayta so'raydi (konvert «so'rov» / «javob») →
     1-telefon tepasida jonli xabar sirg'alib tushadi: «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» → bir necha soniyadan keyin o'zi ko'tarilib yo'qoladi; kartada «9 / 10».
     Nom qatori 1 (bitta): Ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar — jonli xabar.
  2. «Ilovani yopish» (1-telefon) → telefon ekrani: soat «16:59», «Maydon Jamoa» ilova belgisi; telefon bilan Backend orasidagi chiziq xira tortadi (yorliqsiz — ulanish qachon uzilishi bu darsda ko'rsatilmaydi). 2-telefonda «O'yindan chiqish» halqaga o'tadi.
  3. «O'yindan chiqish» (2-telefon) → «Database: 9» → «8» → 1-telefon tomon konvert chizilmaydi; 1-telefon ekranida hech narsa o'zgarmaydi, yonida kulrang yorliq «jonli xabar ko'rinmadi».
  4. «17:00 ga o'tkazish» → soat «17:00» → 1-telefon ekrani tepasidan eslatma kartasi tushadi: «Maydon Jamoa» · «Bugun, 18:00 · Mahalla maydoni»; karta ostida kichik yorliq «qo'shilganda ilova qo'ygan»; chiziq xiraligicha qoladi.
     Nom qatori 2 (bitta): Telefon ekraniga ilova yopiq bo'lsa ham chiqadigan xabar — eslatma; ilova uni oldindan qo'ygan bo'lsa — rejalashtirilgan eslatma.
- Natija qatori: «Taxminingiz: … · haqiqatda: yo'q, joy bo'shagani yopiq ilovada ko'rinmadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Ilova ochiq bo'lsa — jonli xabar; yopiq bo'lsa, bu misolda faqat ilova oldindan qo'ygan eslatma chiqadi. (104)
- Qator (`QIzoh`, xulosadan keyin, bitta): Backend yuboradigan eslatma ham bor — u bu modulda qurilmaydi: Google yoki Apple xizmati va alohida sozlash kerak. (114)
- Tugadi (199): qadam belgilari va sahna tugmalari yopiladi; 1-telefon (eslatma kartasi bilan), xira chiziq va Backend butun enga. Backend'dan 1-telefonga ikkinchi, nuqtali kulrang yo'l chiziladi, yorlig'i «Backend yuboradigan eslatma» (chizma — tayanch 1.4; izohi QIzoh qatorida); vizual ⛶ ichida.
  Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/4) → Davom etish
✎ Halol chegara (tayanch 1.4, 9.36) harakat bilan: boshqa odam tufayli bo'lgan o'zgarish yopiq ilovada ko'rinmaydi; eslatma — ilova o'zi qo'ygani. Sahna natijani ko'rsatadi, ulanish qachon uzilishini emas (04-FILTR 1). T-011: hodisa → «jonli xabar» → «eslatma» / «rejalashtirilgan eslatma». «Ilovani yopish» va «17:00 ga o'tkazish» — sahna tugmalari (haqiqiy ilovada yo'q), ramkadan tashqarida, chegarali.
  T-045: fonda turgan ilovaning ulanishi bir muddat ochiq qolishi mumkin (Shubhali 6) — shuning uchun sahna va matn natijani aytadi («ko'rinmaydi»), «ulanish yo'q» demaydi. «push» so'zi yo'q (kartochkada bir marta).

## 6 · Amaliyot 2 — jonli xabar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈18 daq)
- Eyebrow: Amaliyot 2 · jonli xabar
- Sarlavha: **Ochiq ilovada o'zgarish jonli xabar bo'lib chiqsin.** (51)
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz — qaysi o'zgarishda qanday xabar chiqishini siz tanlaysiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi: bitta qator (`{nima qilsin}`) o'quvchidan; «Qayerda», «Yana», «Nima buzilmasin» — tayyor (tahrirlasa bo'ladi).
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — `README.md` dagi «Real vaqt» bo'limini oching: har qatorda kim nima qiladi va ekranda nima o'zgaradi. Foydalanuvchining o'ziga tegishli o'zgarishlarni belgilang — ular jonli xabarga arziydi. Har o'zgarish jonli xabarga arzimaydi: foydalanuvchi darhol bilishi kerak bo'lganini tanlang — qolganlari ekranda jimgina yangilanadi.
     Mentor misolida — beshta: yana bir o'yinchi qo'shildi · joy bo'shadi · o'yin to'ldi · kelishini tasdiqladi (faqat tashkilotchiga) · navbatdan o'yinga o'tdingiz.
     Talabdagi «Yana» qatorida Mentor misolining uch qoidasi tayyor turibdi: faqat o'ziga tegishli yozuv uchun · o'z harakati uchun emas · ismsiz. Mahsulotingizga mos kelmasa, tahrirlang.
  2. **Prompt** — «Nima qilsin» qatorini o'zingiz yozing (yonida kulrang namuna), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: `mobil/` — 3-darsdagi hodisa tinglovchisi (`src/ulanish.ts`) va hamma ekranlar tepasidagi umumiy joy.
     > Nima qilsin: **{nima qilsin}**
     > Yana: jonli xabar ekran tepasida bir necha soniya tursin va o'zi yo'qolsin. Faqat menga tegishli yozuv uchun chiqsin; o'zim qilgan harakat uchun chiqmasin; xabarda ism bo'lmasin. Qaysi xabar chiqishini hodisadan keyin qayta so'ralgan javobni oldingisi bilan solishtirib tanla; o'z harakatimni javobdagi menga tegishli maydonlar o'zgarganidan bil, hodisaga yangi maydon qo'shma.
     > Nima buzilmasin: «Hozir ko'ryapti», ro'yxat o'zi yangilanishi va ulanish belgisi avvalgidek ishlasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Joy yonidagi kulrang namuna: `{nima qilsin}` — «masalan: menga tegishli o'yinga yana bir o'yinchi qo'shilsa — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10»»
     Yordam (ochiladigan) — Mentor misolidagi qator (mobil trek):
     > Nima qilsin: `oyin-ozgardi` kelib, ilova `GET /oyinlar` dan qayta so'ragach, yangi javobni oldingisi bilan solishtirsin. O'yin menga tegishli bo'lsa (qo'shilganman, navbatdaman yoki o'zim e'lon qilganman — buning uchun `GET /oyinlar` javobiga `menTashkilotchiman` qo'sh) — jonli xabar chiqsin:
     > qo'shilganlar ko'paysa — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10», o'yin to'lsa — «Shanba, 18:00 — o'yin to'ldi: 10 / 10» · kamaysa — «Shanba, 18:00 — joy bo'shadi: 8 / 10» ·
     > tasdiqlaganlar ko'paysa (faqat tashkilotchiga) — «Shanba, 18:00 — kelishini tasdiqladi: 8 / 9» · men navbatdan o'yinga o'tsam — «Navbatdan o'yinga o'tdingiz: Shanba, 18:00». Kun, soat va sonlar — o'sha o'yindan.
     > Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar chiqmasin. `menQoshilganman`, `menNavbatdaman` yoki `menTasdiqlaganman` o'zgargan bo'lsa — bu mening harakatim, xabar chiqmasin (navbatdan o'tish bundan mustasno). Hodisaga yangi maydon qo'shma.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» — `prototip/` dagi tinglovchi (`src/ulanish.js`) va sahifa tepasi; jonli xabar sahifa tepasida chiqadi, qolgani bir xil.
  3. **Ishga tushirish** — `git status` → har faylni `git add <fayl>` bilan → `git commit -m "jonli xabar"` → `git push`. Agent Backend'ni ham o'zgartirgan bo'lsa — Render'da yangi versiya tugashini kuting.
     Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — `r`); web-trekda — Netlify. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini bajarib ko'ring. Mentor misolida (siz Shanba 18:00 o'yiniga qo'shilgansiz; ilova «O'yinlar»da ochiq tursin):
     (1) Agentga: «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan Shanba 18:00 o'yiniga qo'shilish so'rovini yubor. Akkaunt va yangi yozuv `id` sini ayt.» → ekran tepasida «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» bir necha soniya chiqishi kerak.
     (2) Agentga: «O'sha tekshiruv akkauntini men qo'shilmagan o'yinga ham qo'sh, `id` sini ayt.» → jonli xabar chiqmasligi kerak: o'yin sizga tegishli emas.
     (3) O'zingiz boshqa o'yinga qo'shiling → jonli xabar chiqmasligi kerak: bu sizning harakatingiz.
     Tozalash: agentga — «Tekshiruvda yaratgan akkaunt va yozuvlaringni aytgan `id` lari bo'yicha o'chir.» Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     Amaliyot 1 ning 4-qadamini qoldirgan bo'lsangiz — shu yerda tekshiring.
- **Harakat → Vizual o'zgarish:** «Nusxalash» — `{nima qilsin}` to'ldirilgach ochiladi; «Bajardim» → qadam yig'iladi, keyingisi ochiladi; o'ngda kadrlar bir marta o'zi yuradi; 4-qadamdan keyin yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi; uch kadr bir marta o'zi yuradi):
  - «O'yinlar» → tepada jonli xabar «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» → xabar yo'qoladi, kartada «9 / 10»
  - ostida fayl kartasi: `mobil/src/ulanish.ts` (o'zgardi) · `mobil/src/app/_layout.tsx` (o'zgardi)
  - web-trekda: brauzer oynasi, sahifa tepasida o'sha xabar.
- Hammasi bajarilgach (yashil): Jonli xabar ishlaydi: faqat sizga tegishli o'zgarishda va ismsiz chiqadi. (73)
- Ulgurmasangiz (kichik, pastda): vaqt tugayaptimi — (1) ni tekshirib, `git push` qiling va Amaliyot 3 ga o'ting; (2) va (3) ni oxirida tekshirib, shu yerga qaytib «Bajardim»ni bosasiz — blok shundan keyin bajarilgan sanaladi.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-04-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi).
- Nishon: Live Message — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: o'quvchining qatori — qaysi o'zgarish va qanday matn (uning qarori, sinf 13); qoidalar «Yana» qatorida tayyor — Mentor misolidan, tahrirlanadi (sinf 2b). Hodisa nomi `oyin-ozgardi` faqat Yordamda — o'quvchining hodisasi boshqacha bo'lishi mumkin.
  «Yangi son — qayta so'ragan javobdan» — tayanch 1.2 qoidasi; jonli xabar uchun Backend'da yangi hodisa shart emas (tayanch 3: `04-done` jonli xabari ilovada). Tashkilotchilik — `menTashkilotchiman` (tayanch 9.25; GATE M 06.10: M-q3 A — tasdiqlandi — B bo'lsa, maydon 11-Modul repo'sidan keladi). Xabar tanlash va o'z harakati — javoblarni solishtirib (tayanch 9.36; 04-FILTR 5, 15, 16, 17).
  Agent yaratgan yozuvlar — `id` bo'yicha o'chiriladi (tayanch 1.3, sinf 13); (3) dagi qo'shilish — o'quvchining o'z akkaunti, tekshiruv yozuvi emas.
- O'qituvchi eslatmasi: (2) va (3) — «chiqmasligi kerak» tekshiruvlari; o'quvchi xabar chiqmaganini ham natija deb yozsin. Agent «o'chirdim» desa — o'quvchi ro'yxatni pastga tortib, son qaytganini ko'rsin.

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Mentor misolida ilova yopiq, o'yiningizga yangi o'yinchi qo'shildi. Nima bo'ladi?** (10 so'z)
  - Eslatma keladi, uni Backend o'zi yuboradi
  - Jonli xabar keladi, ilova ochilganda
  - Eslatma keladi, uni ilova qo'ygan
  - ✔ Hech narsa kelmaydi, ochganda ko'rasiz
- Kalit: **D** (index 3). To'rttalasi «nima — qachon / kim» shaklida, vergul bilan; «keladi» uch variantda, «eslatma» ikkitada; to'g'ri variant yolg'iz eng uzun emas (O'lchov).
- To'g'ri izohi: Yopiq ilovada boshqa odam qilgan o'zgarish ko'rinmaydi. (55)
- Xato izohlari (≤60):
  - A: Bu misolda Backend yuboradigan eslatma qurilganmi? (50)
  - B: Jonli xabar qaysi paytda chiqadi — ilova ochiq turgandami? (58)
  - C: Ilova eslatmani qachon qo'yadi — kim qo'shilganda? (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 5-ekranda `chiqdi` edi; savol boshqa hodisani (`qoshildi`) so'raydi (§106). «Mentor misolida» — A distraktori boshqa ilovalarda rost bo'lishi mumkin (sinf 8); bu misolda Backend yuboradigan eslatma qurilmaydi.

## 8 · Amaliyot 3 — eslatma (web-trekda — «Xabarlar» tasmasi)  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: mobil — Amaliyot 3 · eslatma · web — Amaliyot 3 · xabarlar tasmasi
- Sarlavha (trekka qarab): mobil — **Ilova yopiq bo'lsa ham, kerakli payt eslatma chiqsin.** (53) · web — **Sayt ochiq paytdagi xabarlar tasmada tursin.** (44)
- Mentor: Oxirgi blokda uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; «1 · Ochish»dan boshlang.
- Talab zinapoyasi: uch qator o'quvchidan; tayyor qatorlar — yangi kutubxona (faqat mobil) va «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- Qadamlar (hammasi o'z repo'ngizda, o'z trekingizda):
  1. **Ochish** — eslatma nima uchun kerakligini toping: foydalanuvchi o'z ishini qachon unutishi mumkin? Mentor misolida — o'yinga qo'shilgan o'yinchi o'yin vaqtini unutmasin: eslatma o'yindan bir soat oldin.
     Ikki halol chegara: eslatma faqat shu telefonda qilingan ishdan qo'yiladi — boshqa telefondan kirilsa, u yerda eslatma yo'q. Telefonda eslatmalar o'chirilgan bo'lsa — chiqmaydi.
     Web-trekda bu blokda — «Xabarlar» tasmasi: sahifa ochiq paytda kelgan oxirgi beshta jonli xabar. Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     > Eslatma — `expo-notifications` bilan (`npx expo install expo-notifications`); `README.md` «Stek» qatoriga qo'sh. Ruxsatni birinchi marta so'ra (Android'da avval eslatma kanalini yarat); ruxsat berilmasa — ilova ishlayversin, eslatma qo'yilmasin.  ← tayyor qator (faqat mobil trekda)
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.  ← tayyor qator
     Qatorlar ostidagi kulrang savollar:
     `{qayerda}` — Qaysi ekranda, qaysi tugma bosilganda qo'yiladi va qachon bekor bo'ladi? ·
     `{nima qilsin}` — Qachon chiqsin va unda nima yozilsin? Qachon qo'yilmasin? ·
     `{nima buzilmasin}` — Oldin ishlagan qaysi narsa joyida qolsin?
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `mobil/` — «O'yin» ekranidagi «Qo'shilaman» va «O'yindan chiqish» (`src/app/oyin/[id].tsx`).
     > Nima qilsin: «Qo'shilaman» muvaffaqiyatli bo'lganda ilova eslatmani o'yindan bir soat oldinga rejalashtirsin: sarlavha «Maydon Jamoa», matn «Bugun, 18:00 · Mahalla maydoni» (soat va maydon — o'sha o'yindan).
     > O'yinga bir soatdan kam qolgan bo'lsa — rejalashtirmasin. «O'yindan chiqish» bosilganda shu o'yinning eslatmasi bekor bo'lsin. Bitta o'yinga bitta eslatma: qayta rejalashtirilsa — eskisi bekor bo'lsin. Ilova ochiq paytga to'g'ri kelsa ham, eslatma ko'rinsin.
     > Nima buzilmasin: qo'shilish, chiqish, navbat, jonli xabar va «Hozir ko'ryapti» avvalgidek ishlasin.
     > Eslatma — `expo-notifications` bilan (`npx expo install expo-notifications`); `README.md` «Stek» qatoriga qo'sh. Ruxsatni birinchi marta so'ra (Android'da avval eslatma kanalini yarat); ruxsat berilmasa — ilova ishlayversin, eslatma qo'yilmasin.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida — Mentor misoli mobil, shuning uchun namuna umumiy):
     > Qayerda: `prototip/` — sahifadagi yangi «Xabarlar» tasmasi.
     > Nima qilsin: sahifa ochiq paytda chiqqan har jonli xabar tasmaga ham yozilsin: oxirgi beshtasi, eng yangisi tepada. Sahifa yangilansa — tasma bo'sh boshlanadi.
     > Nima buzilmasin: jonli xabar, «Hozir ko'ryapti» va «Yangilash» tugmasi avvalgidek ishlasin.
  3. **Ishga tushirish** — bu blokda Backend o'zgarmaydi, Render kutilmaydi. Mobil trekda paket qo'shilgach terminalda `r` — Expo Go ilovani qayta yuklaydi (bo'lmasa — `npx expo start` ni qayta ishga tushiring); web-trekda — `git push`, Netlify saytni odatda o'zi yangilaydi.
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — Mentor misolida, test holati bilan:
     (1) Agentga: «Test holati: eslatma «Qo'shilaman» bosilgandan bir daqiqa keyin chiqsin — vaqtincha. Faqat shu vaqtni o'zgartir va qaysi qatorni o'zgartirganingni ayt.»
     (2) Siz qo'shilmagan o'yinga qo'shiling. Birinchi marta ilova ruxsat so'raydi — ruxsat bering. Ilovani yoping va bir daqiqa kuting: telefon ekranida «Maydon Jamoa» eslatmasi chiqishi kerak, soati va maydoni — o'sha o'yinniki.
         Test holatida «Bugun» so'zi kunga mos kelmasligi mumkin — soat va maydonni tekshiring.
     (3) Yana bir o'yinga qo'shiling, bir daqiqa o'tmasdan «O'yindan chiqish»ni bosing va ilovani yoping: bir daqiqadan keyin eslatma chiqmasligi kerak.
     (4) Agentga: «Test holatini qaytar: eslatma o'yindan bir soat oldin.» Agent aytgan qatorda vaqt qaytganini ko'ring.
     Eslatma chiqmasa — avval telefon sozlamasini tekshiring: ruxsat bermagan bo'lsangiz, u yerdan yoqiladi.
     Oxirida: `git status` → `git add <fayl>` → `git commit -m "eslatma"` → `git push`.
     Web-trekda: agentga — «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan menga tegishli yozuvda ikki o'zgarish qil, `id` larini ayt.» → tasmada ikki qator, eng yangisi tepada; sahifani yangilang — tasma bo'sh; keyin agent akkaunt va yozuvlarni aytgan `id` lari bo'yicha o'chiradi.
- **Harakat → Vizual o'zgarish:** «Nusxalash» — uch joy to'ldirilgach ochiladi; «Bajardim» → qadam yig'iladi, keyingisi ochiladi; o'ngda kadrlar bir marta o'zi yuradi; 4-qadamdan keyin yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi; uch kadr bir marta o'zi yuradi):
  - «O'yin» → «Qo'shilaman» → ruxsat oynasi (umumiy chizma: kulrang matn chiziqlari va ikki tugma shakli — haqiqiy yozuv tekshirilmagan, Shubhali 1) → «Qo'shildingiz»
  - ilova yopiq — telefon ekrani «17:00»: eslatma «Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni»
  - ostida fayl kartasi: `mobil/src/app/oyin/[id].tsx` (o'zgardi) · `mobil/package.json` (+ `expo-notifications`) · `README.md` («Stek»: + `expo-notifications`)
  - web-trekda: brauzer oynasi — sahifada «Xabarlar» tasmasi, ikki qator (eng yangisi tepada).
- Hammasi bajarilgach (yashil), trekka qarab: mobil — Eslatma test holatida chiqdi, chiqilganda bekor bo'ldi: talabni o'zingiz yozdingiz. (83) ·
  web — Tasma ishlaydi: sahifa ochiq paytdagi xabarlar turadi, talabni o'zingiz yozdingiz. (82)
- Ulgurmasangiz (kichik, pastda): vaqt tugasa — yakun ekrani nima qolganini aytadi; «Ortda qoldingizmi» bilan Mentor misolini ochib, qolgan qadamni o'z repo'ngizda tugatasiz.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-04-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi).
- Nishon (bonus): Heads Up — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: uch qator — o'quvchining qarori (qachon, nima yozilsin, qachon qo'yilmasin — sinf 13); tayyor qator — yangi kutubxona nomi (tayanch 4) va ruxsat yo'li (tayanch 1.4 xato yo'li). Test holati — tayanch 1.4 so'zi; agent bitta qiymatni o'zgartiradi va qaytaradi.
  «Ilova ochiq paytga to'g'ri kelsa ham, eslatma ko'rinsin» — Mentor talabidagi qo'shimcha (sukutda ochiq ilovada ko'rsatilmaydi — Manbalar 1; TAYANCHGA SAVOL 9). Tekshiruvda ilova yopiladi — shu qatordan qat'i nazar natija ko'rinadi. 04-FILTR 27: auditor olib tashlashni so'radi — rad: eslatma vaqtida hodisa yo'q (jonli xabar bilan takror bo'lmaydi), o'quvchi tekshiruvda ilovani ochiq qoldirsa ham eslatma ko'rinadi. «Bitta o'yinga bitta eslatma» — 04-FILTR 42.
- O'qituvchi eslatmasi: Expo Go'da ruxsat oynasi Expo Go nomidan chiqishi mumkin — pilotda ko'riladi. Telefonda «Bezovta qilmang» rejimi yoqilgan bo'lsa, eslatma ovozsiz kelishi mumkin. Android'da eslatma bir necha daqiqa kechikishi mumkin (Shubhali 3). Navbatdan o'yinga o'tgan o'yinchiga eslatma qo'yilmaydi — birinchi versiya cheklovi (tayanch 9.36); o'quvchi so'rasa, shunday deng.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Ochiq ekranlar sanog'i» · 7 — «2 — Yopiq ilova»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (172; kartochkalar — oldingi alohida ekranda)
- Yorliqlar (tepada): ✓ Uch qism ishlaydi (faqat uchala blok bajarilganda — har biri 4-qadam «Bajardim»i bilan; aks holda yorliq yo'q) · {N}/2 to'g'ri
- Sarlavha (holatga qarab, P-046; sinf 1):
  - Uchala blok bajarilgan: **Uch qism ishlayapti: oxirgi talabni o'zingiz yozdingiz.** (55)
  - Amaliyot 1 va 2 bajarilgan, 3 yo'q — mobil: **Jonli xabar ishlaydi — eslatma qoldi.** (37) · web: **Jonli xabar ishlaydi — «Xabarlar» tasmasi qoldi.** (48)
  - Amaliyot 1 bajarilgan, 2 yo'q: **«Hozir ko'ryapti» ishlaydi — jonli xabar qoldi.** (47)
  - Amaliyot 1 bajarilmagan, boshqasi bajarilgan: **«Hozir ko'ryapti»ni telefonda tekshirish qoldi.** (47)
  - hech biri: **Loyiha kuni boshlandi — qolgan qadamni tugating.** (48)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Bu modulda ilova ochiq bo'lsa, o'zgarish jonli xabar bo'lib keladi; yopiq bo'lsa, faqat ilova oldindan qo'ygan eslatma chiqadi.
- Endi siz bilasiz (5; asosiy fikr bu yerda takrorlanmaydi — T-048):
  - Xona — Backend'dagi ulanishlar guruhi: hodisa faqat shu guruhdagilarga boradi.
  - «Hozir ko'ryapti» ochiq ekranlarni sanaydi, odamlarni emas.
  - Mentor misolida jonli xabar faqat o'yinchiga tegishli o'zgarishda va ismsiz chiqadi.
  - Eslatmani tekshirish uchun test holatida vaqt vaqtincha qisqartiriladi, keyin qaytariladi.
  - Agent «bajardim» desa ham, talabning har gapini telefonda o'zingiz tekshirasiz.
- Uyga vazifa — yo'q (tayanch 4: loyiha kuni; ish repo'da — uch blok o'z mahsulotingizda).
- Keyingi dars — «Ulanish uzilsa: buzamiz va tuzatamiz».
- Nishonlaringiz — N/4 (pastda; mentor rejimida yo'q)
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): sarlavha o'quvchi ishini aytadi, Mentor natijasini emas (sinf 1); blok bajarilgani — faqat 4-qadam «Bajardim»idan (ccProgress; 3-qadamdan keyin faqat «Davom etish» ochiladi — 04-FILTR 38, 39), yangi kalit yo'q. «Keyingi dars» qatori — `00-NOMLAR.md` 5-qator, so'zma-so'z, quyruqsiz (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Open Screens** — Ochiq ekranlar sanalishini birinchi urinishda topdingiz (4-ekran, 1-savol)
- **Open or Closed** — Yopiq ilovaga nima yetmasligini birinchi urinishda topdingiz (7-ekran, 2-savol)
- **Live Message** — Jonli xabar talabini yozib, telefonda tekshirdingiz (Amaliyot 2, oxirgi «Bajardim»; ish bajarilgan — P-048)
- **Heads Up** — Eslatmani (web-trekda — tasmani) telefonda tekshirdingiz (Amaliyot 3, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 06.10: Open Screens · Open or Closed · Live Message · Heads Up — 0).

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: koddan bitta qator)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Ochiq ekranlar sanaladi»
   - `oyin-ochildi` · Ekran ochildi — ilova o'yin xonasiga kiradi.
   - `oyin-{id}` · Xonada — shu o'yin ekrani ochiq ulanishlar.
   - `{ oyinId, soni }` · Backend xonadagi ulanishlarni sanab, sonni o'zi yuboradi.
   - Sinfga savol: Telefoningiz va sinfdoshingiz telefonida bir xil o'yin ochiq. Son nechta bo'ladi va nega?
2. 2-savol (7-ekran) — «Ochiq ilova — jonli xabar, yopiq — eslatma»
   - `oyin-ozgardi` · Ilova ochiq — hodisa keladi, tepada jonli xabar chiqadi.
   - ilova yopiq · Boshqa odam qilgan o'zgarish jonli xabar bo'lib ko'rinmaydi.
   - `scheduleNotificationAsync` · Eslatmani ilova o'zi oldindan qo'yadi, Backend emas.
   - Sinfga savol: Ilova yopiq paytda o'yinchi joy bo'shaganini qanday bilishi mumkin edi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Xona nima? | Backend'dagi ulanishlar guruhi | Hodisa faqat shu guruhdagilarga boradi; Mentor misolida har o'yinning xonasi — `oyin-{id}` |
| «Hozir ko'ryapti» nimani sanaydi? | Ekranni hozir ochib turgan ulanishlarni | Bitta odam ikki qurilmada — ikkita; ism ko'rsatilmaydi |
| Nega `korayotganlar-ozgardi` sonning o'zini olib keladi? | Bu son Database'da yo'q | U faqat Backend xotirasidagi ulanishlardan sanaladi |
| Jonli xabar nima? | Ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar | Mentor misolida: «Shanba, 18:00 — joy bo'shadi: 8 / 10» |
| Mentor misolida jonli xabar kimga chiqadi? | O'yin o'ziga tegishli bo'lgan o'yinchiga: qo'shilgan, navbatda turgan yoki e'lon qilgan | O'z harakati uchun chiqmaydi; ism yo'q |
| Eslatma nima? | Telefon ekraniga chiqadigan xabar | Ilova yopiq bo'lsa ham chiqadi |
| Rejalashtirilgan eslatma nima? | Ilova o'zi oldindan vaqtini belgilab qo'ygan eslatma | Mentor misolida — «Qo'shilaman» bosilganda, o'yindan bir soat oldinga |
| Backend yuboradigan eslatma nima? | Hodisa bo'lganda Backend telefonga yuboradigan eslatma | Inglizchasi: push notification. Alohida sozlash kerak, Expo Go'da ishlamaydi; bu modulda qurilmaydi |
| Mentor misolida ilova yopiq paytda joy bo'shasa, nima bo'ladi? | Telefonga hech narsa kelmaydi | Ilova ochilganda yangi son Backend'dan so'raladi |
| Eslatmaga ruxsat berilmasa, nima bo'ladi? | Ilova ishlayveradi, eslatma chiqmaydi | Ruxsat telefon sozlamalaridan yoqiladi |
| Bu darsda test holati nima? | Eslatma vaqtini vaqtincha bir daqiqadan keyinga qo'yish | Tekshirgach, vaqt qaytariladi |
| «Xabarlar» tasmasi nima? | Web-trekda sahifa ochiq paytda kelgan oxirgi beshta jonli xabar | Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Mentor misolida `korayotganlar-ozgardi` kimlarga boradi? ✔ Shu o'yin xonasidagi ulanishlarga · Hamma ulangan ilovalarga birdaniga · O'yinni e'lon qilgan tashkilotchiga · Database'dagi hamma o'yinchilarga
2. Siz «O'yinlar» ekranidasiz, kimdir o'yinni ochdi. Sizga yangi son keladimi? Ha — hamma ulangan ilovaga boradi · ✔ Yo'q — siz o'yin xonasida emassiz · Ha — ro'yxatdagi har kartaga boradi · Yo'q — son Database'dan olinadi
3. Boshqa telefonda o'yin ekrani yopildi. Sizdagi «Hozir ko'ryapti» nima bo'ladi? O'zgarmaydi, pastga tortish kerak · Nolga tushadi, xona yopilib qoladi · ✔ Bittaga kamayadi, hodisa o'zi keladi · Bittaga oshadi, yana bir ekran ochildi
4. Nega «Hozir ko'ryapti» sonini hodisaning o'zi olib keladi? Son juda tez o'zgarib turadi · Ilova so'rov yubora olmaydi · Backend shunday tezroq ishlaydi · ✔ Bu son Database'da saqlanmaydi
5. Ilova ochiq. O'yiningizda joy bo'shadi. Nima ko'rasiz? ✔ Ekran tepasida qisqa jonli xabar · Telefon ekranida eslatma kartasi · Hech narsa, ro'yxatni yangilash kerak · Ilova o'zi yopilib, qayta ochiladi
6. O'zingiz «Qo'shilaman»ni bosdingiz. Mentor misolida jonli xabar chiqadimi? Ha — har bir qo'shilish uchun chiqadi · ✔ Yo'q — o'z harakatingiz uchun chiqmaydi · Ha — ismingiz bilan birga tepada chiqadi · Yo'q — jonli xabar tashkilotchiga chiqadi
7. Rejalashtirilgan eslatmani kim qo'yadi? Backend, hodisa bo'lgan zahoti yuborib · Tashkilotchi, o'yinni e'lon qilgan paytda · ✔ Ilovaning o'zi, vaqtini oldindan belgilab · Telefon, har kuni bir xil soatda o'zi
8. Mentor misolida eslatma qachon chiqishi kerak? O'yin boshlanadigan daqiqaning o'zida · Qo'shilgan zahoti, faqat bir marta · O'yindan bir kun oldin, kechqurun · ✔ O'yin boshlanishidan bir soat oldin
9. Mentor misolida «O'yindan chiqish» bosildi. Eslatma nima bo'ladi? ✔ Bekor qilinadi, endi chiqmaydi · Baribir o'z vaqtida chiqadi · Boshqa o'yinga ko'chib o'tadi · Tashkilotchiga yuborib qo'yiladi
10. Backend yuboradigan eslatma uchun nima kerak? Expo Go va telefondagi eslatma ruxsati · ✔ Google yoki Apple xizmati va sozlash · Ochiq ulanish va Backend'dagi xona · `expo-notifications` paketining o'zi
11. Mentor misolida eslatmaga ruxsat berilmadi. Nima bo'ladi? Ilova ochilmaydi, eslatma chiqadi · Ilova ishlaydi, eslatma ham chiqadi · ✔ Ilova ishlaydi, eslatma chiqmaydi · Ilova yopiladi, ruxsat qayta so'raladi
12. Web-trekda uchinchi amaliyotda nima quriladi? Brauzer eslatmasi, alohida sozlab · Telefonga yuboriladigan SMS xabar · Har daqiqada sahifani yangilash · ✔ Sahifadagi «Xabarlar» tasmasi

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): xona · `oyin-{id}` · Hozir ko'ryapti · `korayotganlar-ozgardi` · jonli xabar · eslatma · `expo-notifications` · test holati · `oyin-ozgardi` · ruxsat · Xabarlar · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice(blok) · test · concept · practice(blok) · test · practice(blok) · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **1 (B)** · s7 **3 (D)**; uch blok — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m10-04-v1`, `lessonTitle` — «Loyiha kuni: jonli xabar va eslatma».
2. **Bitta manba (180):** `JONLI_SAHNA` (ikki telefon, Backend tuguni, xona doirasi, chiziq holatlari, konvert turlari), `NAMUNA_OYIN` (Shanba, 18:00 · Mahalla maydoni · 8 / 10; `oyinId: 1`), `JONLI_XABARLAR` (besh matn — A-bo'lim 4),
   `ESLATMA` (sarlavha «Maydon Jamoa», matn «Bugun, 18:00 · Mahalla maydoni», `oldin: 60` daqiqa) — 0, 1, 2, 5-ekranlar, bloklarning kutilgan natijasi, kartochka va arena shundan o'qiydi.
3. **`JonliSahna`** komponenti: chapda «1-telefon · siz» (191; ≈170×272 — SABOQ 22; yorliq ramka ustida — SABOQ 23), o'rtada Backend tuguni («Database: N» + xona doirasi `oyin-1` va nuqtalar), o'ngda «2-telefon · boshqa o'yinchi».
   Propslar: `telefonlar` (1 yoki 2), `ekran1` (`oyin` · `oyinlar` · `yopiq`), `soat` («16:59» / «17:00»), `xona` (nuqtalar soni), `korayapti` (N), `chiziq` (`ochiq` · `yopiq-ilova`), `konvertlar`, `jonliXabar` (matn | null), `eslatma` (bool).
   Jonli xabar kartasi — ilova ichida, tepadan tushib bir necha soniyadan keyin ko'tariladi; eslatma kartasi — telefon ekrani tepasida qoladi. Son animatsiyasi (kattalashib qaytadi) — 11-Modul telefon maketidan nusxa, import emas.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: jx-karta jx-orqaga jx-qoshil jx-yopish jx-chiqish jx-soat`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **0-ekran:** bitta telefon (ilova yopiq, soat 16:59) + kichik karta «Shanba, 18:00 · Qo'shildingiz»; javobdan keyin soat → 17:00, eslatma kartasi tushadi, kichik kartaga uzuq chiziq (U-041: faqat bog'lanish ko'rsatish uchun) va yorliq «qo'shilganda qo'yilgan».
5. **2-ekran:** `QBashorat`/`QTaxmin` (yopilmaydi — `TaxminIxcham`), ikki telefon, xona doirasi; 2-telefon kartasi → `oyin-ochildi` konverti → nuqta kiradi → ikki `korayotganlar-ozgardi` konverti → ikkala son 2; «‹ O'yinlar» → nuqta chiqadi → bitta konvert → 1-telefon son 1; `zoom`, `tugadi`.
6. **5-ekran:** to'rt qadam navbat bilan (qulf); jonli xabar kartasi (1), «Ilovani yopish» → `yopiq` holat va xira chiziq (2), 1-telefonga konvert yo'q + yorliq «jonli xabar ko'rinmadi» (3; 04-FILTR 1), «17:00 ga o'tkazish» → eslatma kartasi (4);
   tugagach Backend'dan nuqtali kulrang yo'l «Backend yuboradigan eslatma». Sahna tugmalari — ramkadan tashqarida, chegarali (ilova tugmasidan ajralib turadi).
7. **Amaliyot bloklari** — `ScreenBlok` (skeletdagi ulagich) + `QBlok` + `QPrompt` (2-qadam; `{…}` joylari). Har blok **4 qadam**, hammasi o'quvchining o'z repo'sida; 5-qadam yo'q.
   - Amaliyot 1: `{sanaladigan ekran}` — bo'sh, kulrang «masalan» (bitta qavs, ikki joyda); `{buzilmasin}` ← `pm-m10d3-talab.buzilmasin` (tahrirlanadi; yo'q bo'lsa — bo'sh, kulrang «masalan»).
   - Amaliyot 2: `{nima qilsin}` — bo'sh, kulrang «masalan»; «Yana» va «Nima buzilmasin» — tayyor, tahrirlanadigan. «Nusxalash» — joy to'ldirilgach.
   - Amaliyot 3: uch joy (`{qayerda}` · `{nima qilsin}` · `{nima buzilmasin}`) — har biri ostida kulrang savol (11-Modul 11-dars `ipucha` naqshi); tayyor qatorlar tahrirlanmaydi; `expo-notifications` qatori faqat `trek === 'mobil'` da.
     Sarlavha, eyebrow, yashil yakun qatori, Yordam va kutilgan natija — trekka qarab (`pm-m9d8-platforma.trek`; kalit yo'q bo'lsa — blok tepasida trek tugmalari, tanlov kalitga yoziladi — 11-Modul 9.77).
   - Trek qatorlari (papka `mobil/` · `prototip/`, fayl `src/ulanish.ts` · `src/ulanish.js`, Expo Go `r` · Netlify) — `trek` dan matn, joy emas. 4-qadam nomi — «Telefonda tekshirish» (web-trekda ham: telefon brauzeri).
   - ⚠️ Qolipda yo'q (11-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat (kalitdan), qavs ostidagi kulrang savol, qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, «O'qituvchi eslatmasi» (o'quvchi yuzasida yo'q).
   - `ortda`: uchala blokda `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m12-dars-04-done`.
8. `RECAPS` 2 (kalit = 4, 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 4 → Open Screens, 7 → Open or Closed, Amaliyot 2 oxirgi «Bajardim» → Live Message, Amaliyot 3 oxirgi «Bajardim» → Heads Up) ·
   `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) · `HW_TOKENS` / fon so'zlari {uz, ru}.
9. 11-ekran `QYakun`: sarlavha va yorliq — blok holatidan (`ccProgress`: Amaliyot 1, 2, 3 — faqat 4-qadam «Bajardim»; 3-qadamdan keyin «Davom etish» ochiladi, blok bayrog'i qo'yilmaydi); Amaliyot 2 holatidagi sarlavha trekka qarab; `uyga` yo'q; `recap` 5 qator; `keyingi` — «Ulanish uzilsa: buzamiz va tuzatamiz».
10. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067).
11. **Darvozalar:** `npm run gates -- src/10-Modull/LiveNotifyDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran 4 savol (SABOQ 30) hisobotda.
12. App.jsx `m10-04` qatoriga `comp: LiveNotifyDayLesson` — «qur» bosqichida (asosiy seans). ru — uz tasdiqlangach, bir yo'la (6-RU).

**REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m12-dars-04-start` = `m12-dars-03-done` → `m12-dars-04-done`):**
1. `backend/` gateway: `oyin-ochildi { oyinId }` → ulanish `oyin-{id}` xonasiga qo'shiladi; `oyin-yopildi` → chiqariladi; xonadagi ulanishlar soni o'zgarganda (kirish, chiqish, uzilish) → `io.to('oyin-{id}').emit('korayotganlar-ozgardi', { oyinId, soni })`.
   Sanoq — xonadagi ulanishlar (socket.io adapter); Database'ga yozilmaydi. Ism yuborilmaydi.
2. `mobil/src/ulanish.ts` + `src/app/oyin/[id].tsx`: ekran fokusga kelganda `oyin-ochildi`, ketganda `oyin-yopildi`; «Hozir ko'ryapti: N» (son animatsiyasi).
3. Jonli xabar: `src/app/_layout.tsx` da umumiy karta; `oyin-ozgardi` → `GET /oyinlar` → oldingi va yangi javob solishtiriladi (sonlar va `men…` maydonlari) → `JONLI_XABARLAR` dagi matn; son o'zgarmasa — xabar yo'q; o'z `men…` maydonlari o'zgargan bo'lsa — xabar yo'q (navbatdan o'tishdan tashqari); tegishlilik — `menQoshilganman`, `menNavbatdaman`, `menTashkilotchiman` (`GET /oyinlar` ga qo'shiladi — tayanch 9.25, 9.36). Muhrdan oldin: chiqish + navbatdan o'tish holatida «joy bo'shadi» chiqmasligi tekshiriladi.
4. Eslatma: `npx expo install expo-notifications`; Android eslatma kanali; `requestPermissionsAsync()`; «Qo'shilaman» → `scheduleNotificationAsync({ content: { title: 'Maydon Jamoa', body: 'Bugun, 18:00 · Mahalla maydoni' }, trigger: { type: SchedulableTriggerInputTypes.DATE, date } })` (o'yin vaqtidan 60 daqiqa oldin; kam qolsa — yo'q);
   eslatma `id` si o'yin `id` si bilan qurilmada saqlanadi (bitta o'yinga bitta eslatma — qayta rejalashtirishdan oldin eskisi bekor) → «O'yindan chiqish» → `cancelScheduledNotificationAsync(id)`; `setNotificationHandler` — ilova ochiq paytda ham ko'rsatish. `README.md` «Stek» — `expo-notifications`; «Darslar va teglar» jadvaliga `m12-dars-04-done` qatori.
5. **5-dars uchun (tayanch 1.5):** `m12-dars-04-done` qayta ulanishni maxsus boshqarmaydi — `m12-dars-05-start` (= `04-done`) da uch muammo ko'rinishi kerak (uzilishdagi o'zgarish · jonli xabar ikki marta · «Hozir ko'ryapti» o'zini sanamaydi). Muhrdan oldin uchalasi shu tegda haqiqiy telefonda takrorlanishi tekshiriladi; mos kelmasa — 5-dars MD haqiqiy natijaga moslanadi (tayanch 9.37 a; 05-FILTR 1).
6. Muhrdan oldin (qurilmada): Android'da Expo Go — ruxsat oynasi, test holatida eslatma chiqishi, chiqilganda bekor bo'lishi, ilova ochiq paytda ko'rinishi; iPhone'da Expo Go — xuddi shu; kuzatuv jurnalga (Shubhali 1–4).

## Manbalar (o'zim tekshirdim, 06.10.2026; o'quvchiga ko'rinmaydi)
1. Expo — `docs.expo.dev/versions/latest/sdk/notifications/` (sahifada «v57.0.0»): «Push notifications (remote notifications) functionality provided by `expo-notifications` is unavailable in Expo Go on Android from SDK 53.» · «Local notifications (in-app notifications) remain available in Expo Go.» ·
   `DATE` trigger namunasi (`trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date }`) · `cancelScheduledNotificationAsync` — «Cancels a single scheduled notification. The scheduled notification of given ID will not trigger.» ·
   «On Android 13, app users must opt-in to receive notifications via a permissions prompt automatically triggered by the operating system. This prompt will not appear until at least one notification channel is created.» ·
   `setNotificationHandler` — «The default behavior when the handler is not set or does not respond in time is not to show the notification.» ·
   «Starting from Android 12 (API level 31), to schedule a notification that triggers at an exact time, you need to add `<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>` to **AndroidManifest.xml**.» · platformalar — Android, iOS (web ro'yxatda yo'q).
   Sahifada ilova yopilgach yoki telefon qayta yoqilgach rejalashtirilgan eslatma saqlanishi haqida aniq gap topilmadi (Shubhali 4).
2. Expo — `docs.expo.dev/push-notifications/faq/`: «In SDK 53 and later, Expo Go does not support push notifications functionality, so to test push you should use a development build.» (tayanch 6 bilan bir).
3. socket.io — `socket.io/docs/v4/rooms/`: «A _room_ is an arbitrary channel that sockets can `join` and `leave`.» · «Rooms are a **server-only** concept (i.e. the client does not have access to the list of rooms it has joined).» ·
   «Upon disconnection, sockets `leave` all the channels they were part of automatically, and no special teardown is needed.» · `io.to("some room").emit(…)`; yuboruvchidan tashqari — `socket.to(…)`; adapter hodisalari `join-room`, `leave-room` (sanoq uchun).
4. Tayanch 6 orqali (qayta ochilmadi): Render — yangi versiyada WebSocket ulanishi uziladi (render.com/docs/websocket) · `expo-notifications` web'da yo'q · brauzer eslatmasi — service worker, iPhone'da 16.4 dan, faqat bosh ekranga qo'shilgan saytda (developer.mozilla.org, webkit.org/blog/13878).
5. Kursdagi so'zlar (grep, 06.10): «test holati» — 11-Modul 9.85 · «Expo Go odatda o'zi qayta yuklaydi, bo'lmasa — `r`» — 11-Modul 9.85 · ulanish belgisi «Ulanmoqda…» — tayanch 9.1 · agent tekshiruv yozuvlari — tayanch 1.3, 11-Modul 9.92 · `GET /oyinlar` maydonlari — 11-Modul 9.29.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Hook** — «Ilovani yopgan bo'lsangiz, o'yinni sizga kim eslatadi?»; ✔ «Ilova — qo'shilganda vaqtini oldindan qo'yadi»; javobdan keyin eslatma kartasi tushadi. Uchinchi variant — 11-Moduldagi haqiqiy holat (roadmap'da «keyinroq»).
2. **Sahnadagi soat «16:59» → «17:00»** va **«17:00 ga o'tkazish»**, **«Ilovani yopish»** sahna tugmalari (0, 5-ekran) — eslatma vaqtini (o'yindan bir soat oldin) ko'rsatish uchun; tayanchda soat yo'q.
3. **2-ekran** — 2-telefon xonaga kirib chiqadi; boshidagi «Hozir ko'ryapti: 1» — o'quvchining o'zi. Xona doirasi Backend tuguni ichida (alohida tugun emas — ≤3 blok).
4. **Amaliyot 1 `{buzilmasin}`** — `pm-m10d3-talab.buzilmasin` dan oldindan yoziladi (tayanch 8: 4-dars `pm-m10d3-talab` ni o'qiydi, qaysi maydoni — aytilmagan). Kalit yo'q bo'lsa — ikkinchi joy (bo'sh, kulrang namuna) — zinapoyadagi «bitta joy» shu holatda ikkita bo'ladi.
5. **Amaliyot 1 tekshiruvi** — ✅ 04-FILTR 11: asosiy yo'l endi agentsiz (web — kompyuterdagi ikkinchi oyna, mobil — sherik telefoni); agent — zaxira, 30 soniya. Eski matn: agent o'zi ochgan tekshiruv akkauntidan (tayanch 9.35) ikkinchi socket ulanishini ochadi (tayanch 1.3 dagi `…/qoshilish` naqshining ulanish ko'rinishi); Database'ga yozuv yo'q. Agent terminaldan ulanish ocha olishi pilotda sinaladi (Shubhali 7).
6. **Amaliyot 2 ning «Yana» qatori** — Mentor misolining uch qoidasi (o'ziga tegishli · o'z harakati emas · ismsiz) o'quvchi talabida tayyor turadi (tahrirlanadi); o'quvchi faqat «Nima qilsin»ni yozadi. Jonli xabar ma'lumot manbasi — hodisadan keyingi `GET /oyinlar` (yangi Backend hodisasi yo'q).
7. ✅ **Hal qilindi (tayanch 9.25, 9.36; GATE M 06.10: M-q3 A — tasdiqlandi):** `GET /oyinlar` ga `menTashkilotchiman` — Mentor talabida aniq yozildi, agentga qoldirilmaydi. Eski matn: **«O'zim e'lon qilgan o'yin» va «faqat tashkilotchiga»** — `GET /oyinlar` javobida tashkilotchilik maydoni yo'q (11-Modul 9.29); Mentor talabida ilova buni qanday bilishini agent tanlaydi (Backend javobiga maydon qo'shishi mumkin — unda Render kutiladi). Tayanchda bitta yo'l kerakmi?
8. ✅ **Hal qilindi (tayanch 9.36; 04-FILTR 5):** o'z harakati — javobdagi o'z `men…` maydonlari o'zgargan bo'lsa (navbatdan o'tishdan tashqari); hodisaga maydon qo'shilmaydi, vaqtga tayanmaydi. Eski matn: **«O'z harakati uchun chiqmaydi»** — ilova o'zi yuborgan so'rovdan keyin kelgan `oyin-ozgardi` ni qanday ajratishi — agent tanlaydi (tayanch 1.2: hodisada faqat `oyinId`, `sabab`). 5-dars «takror hodisa» bilan aralashmasligi kerak.
9. **«Ilova ochiq paytga to'g'ri kelsa ham, eslatma ko'rinsin»** — Mentor talabiga qo'shdim (sukutda ochiq ilovada eslatma ko'rsatilmaydi — Manbalar 1). Tayanch 1.4 da yo'q. 04-FILTR 27 — auditor olib tashlashni so'radi, men qoldirdim (sabab — A3 ✎).
10. **Navbatdan o'yinga o'tgan o'yinchiga eslatma** — tayanch faqat «Qo'shilaman» bosilganda rejalashtirishni aytadi; navbatdan o'tgan o'yinchida eslatma yo'q (ilova yopiq bo'lsa, u o'tganini ham bilmaydi). Ilova keyingi ochilganda rejalashtirsinmi? Men qo'shmadim. ✅ Tayanch 9.36: birinchi versiya cheklovi — o'quvchiga «faqat «Qo'shilaman» bosilgan telefonda» deb aytiladi.
11. **«Hisobdan chiqish» va eslatmalar** — chiqqandan keyin telefondagi rejalashtirilgan eslatmalar qoladimi yoki bekor bo'ladimi — tayanchda yo'q; Mentor talabiga qo'shmadim. 7-darsdagi «Hisobni o'chirish» uchun ham savol. ✅ Tayanch 9.36: «Hisobdan chiqish» va «Hisobni o'chirish» da shu telefondagi eslatmalar bekor qilinadi — 7-dars Mentor talabida (07 MD).
12. **Amaliyot 3 test holati** — agent bitta vaqt qiymatini «bir daqiqa»ga o'zgartiradi va qaytaradi (SQL emas). Test holatida eslatma matnidagi «Bugun» so'zi kunga mos kelmasligi mumkin — o'quvchiga bir gap bilan aytildi.
13. **Web-trek «Xabarlar» tasmasi** — sahifa yangilansa bo'sh boshlanadi (saqlanmaydi); tasma joyi — sahifaning yangi qismi. Tayanchda faqat «oxirgi beshta, sahifa ochiq paytda».
14. **Ekran tartibi** — 3-ekran Amaliyot 1, 6-ekran Amaliyot 2, 8-ekran Amaliyot 3 (tayanch 4 «Loyiha kuni (12)» tartibi); testlar 4 va 7 — ballik testlar ketma-ket emas.
15. **Nishon nomlari** Open Screens · Open or Closed · Live Message · Heads Up (grep 0); ikkitasi blokdan (Live Message — ish bajarilgan, Heads Up — bonus; pilot 07 naqshi).
16. **Reja qadamlari** — 11-Modul loyiha kuni naqshida tegsiz; 01-qadam «hozir u nechta qurilmada ochiq» — «Hozir ko'ryapti» birligini oddiy so'z bilan aytadi.
17. **Yakun sarlavhalari** (to'rt holat, Amaliyot 2 holatida trekka qarab ikki variant) va «Endi siz bilasiz» beshinchi qatori (agent «bajardim» — da'vo).

## Shubhali joylar (ishonchim komil emas)
1. **Ruxsat oynasi matni va ko'rinishi** (Android, iPhone; Expo Go'da kimning nomidan so'raladi) — qurilmada sinalmagan; kutilgan natijada umumiy chizma, matn yozilmadi (tayanch 6 «tekshirilmagan»).
2. **Rejalashtirilgan eslatmaning Expo Go'da amalda chiqishi** — hujjatda «remain available in Expo Go», lekin Android va iPhone'da sinalmagan; Android 13 dagi kanal sharti Expo Go ichida qanday ishlashi — pilotda. ⛔ «Qur» darvozasi (tayanch 9.34 i; 04-FILTR 25): ruxsat, test holatida chiqish, bekor qilish — Android va iPhone'da sinalmaguncha Amaliyot 3 muzlatilmaydi.
3. **Aniq vaqt:** Android 12 dan aniq vaqt uchun `SCHEDULE_EXACT_ALARM` tilga olinadi (Manbalar 1) — Expo Go va APK da ruxsatsiz eslatma kechikishi mumkinmi, qanchaga — tekshirilmagan. O'quvchi matnida «aniq soat 17:00 da» deyilmadi; O'qituvchi eslatmasida «bir necha daqiqa kechikishi mumkin».
4. **Ilova to'liq yopilgan (ro'yxatdan surib tashlangan) yoki telefon qayta yoqilgan holat** — rejalashtirilgan eslatma saqlanadimi, hujjatda aniq topilmadi. Darsda «ilova yopiq» — oddiy yopish (bosh ekranga chiqish) bilan tekshiriladi.
5. **«Test holati»da «bir daqiqa»** — `DATE` (hozir + 60 s) yoki `TIME_INTERVAL` — agent tanlaydi; iPhone'da `TIME_INTERVAL` takrorlanmasa 60 s cheklovi yo'q (takrorlansa — 60 s dan kam bo'lmaydi), bizga tegmaydi.
6. **Ilova yopiq yoki fonda** (5-ekran) — ilova fonga o'tganda socket ulanishi bir muddat ochiq qolishi mumkin; shu paytda «Hozir ko'ryapti» o'sha ekranni sanashda davom etishi mumkin. 04-FILTR 1 dan keyin sahna va matn faqat natijani aytadi («jonli xabar ko'rinmadi»), ulanish qachon uzilishini emas.
7. **Agentning ikkinchi ulanishi** (Amaliyot 1, 4-qadam (2) — endi zaxira yo'l) — agent terminaldan `socket.io-client` bilan Render'dagi Backend'ga o'zi ochgan tekshiruv akkaunti tokeni bilan ulanishi — sinalmagan («qur» pilotida).
8. **«Bezovta qilmang» rejimi va telefon sozlamalaridagi eslatma o'chirgichlari** — nomlari taxmin qilinmadi; o'quvchi matnida umumiy «telefon sozlamalaridan yoqiladi».
9. **Web-trekda «Hozir ko'ryapti»** — bir brauzerdagi ikki tab — ikki ulanish; tab fonga o'tganda brauzer ulanishni uzadimi — tekshirilmagan.
10. **Vaqt:** Amaliyot 1 (Backend + Render) ≈22, Amaliyot 3 (paket + ruxsat + bir daqiqalik kutishlar) ≈20 — taymer bilan o'lchanmagan; ulgurmagan yo'llar yozilgan.
11. **7-ekran A distraktori** — boshqa ilovalarda Backend yuboradigan eslatma rost; savol «Mentor misolida» bilan chegaralangan. Auditor «rost bo'lib qoladi» deyishi mumkin.
12. ✅ tayanch 9.26 (gap «Google (Android) yoki Apple (iPhone) xabar xizmati» ga almashdi) — **«telefon ishlab chiqaruvchisining xabar xizmati»** (5-ekran QIzohi, tayanch 1.4 so'zma-so'z) — Android'da bu xizmat Google'niki (FCM — Manbalar 1, 2 va tayanch 6), telefonni ishlab chiqargan kompaniyaniki emas; iPhone'da — Apple'niki. Aniqroq so'z kerakmi — tayanch qaroriga qoldirdim.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 11-ekran: to'rt holat (Amaliyot 3 · 2 · 1 · hech biri), Amaliyot 2 holatida trekka qarab; ✓ yorlig'i faqat Amaliyot 3 da; sarlavha o'quvchi ishini aytadi. Bloklarning yashil qatori ham o'quvchi ishini (Amaliyot 3: «talabni o'zingiz yozdingiz»).
2. [x] **Da'vo isbot emas** — a) «Bu modulda» (asosiy fikr), «bu darsda» (kartochka) · b) «Mentor misolida» (0, 2, 5-ekran xulosalari, bloklar «Ochish», 7-ekran savoli, kartochka, arena) — uch blok, uch qoida, bir soat — Mentor misoli; «mos kelmasa — tahrirlang», «alohida ekran bo'lmasa — …» ·
   c) «odatda bir necha soniyada», «odatda o'zi qayta yuklaydi», «chiqishi kerak», «bir necha daqiqa cho'zilishi mumkin», «kunga mos kelmasligi mumkin» · d) Amaliyot 3 yashil qatori «test holatida chiqdi» (umumiy «ishlaydi» emas); agent javobi — «uning so'zi» (Amaliyot 1).
3. [x] **Maxfiy qiymat chiqmaydi** — Amaliyot 1 1-qadam: `git status` da `.env` yo'q; uch blokda xato gapi: «`.env` qiymatlari, token va kalitlarni emas»; promptlarda «`.env` fayllariga tegma»; `git add <fayl>`; ism hech qayerda yuborilmaydi va ko'rsatilmaydi.
4. [x] **Tashqi xizmat faqat rasmiy hujjat** — Expo Notifications, socket.io xona — Manbalar 1–3 (havola, sana, iqtibos); ruxsat oynasi, telefon sozlamalari menyusi, Render sahifasi — umumiy so'z; tekshirilmagan qadamlar «pilotda» (Shubhali 1–9).
5. [x] **Har sonning manbasi va o'lchovi** — «Hozir ko'ryapti» birligi aytilgan (ochiq ekran, odam emas — 2, 4-ekran, kartochka); sonlar faqat Mentor misolidan (8 / 10, 9 / 10, bir soat, bir daqiqa); statistika yo'q.
6. [x] **Tayanchda yo'q narsa to'qilmagan** — jonli xabar va eslatma matnlari tayanch 1.4 dan aynan; men qaror qilgan har tafsilot — TAYANCHGA SAVOL 1–17.
7. [x] **Saqlash kaliti o'qiydigan darsning ehtiyojidan** — dars yangi kalit yozmaydi (tayanch 8); `pm-m10d3-talab.buzilmasin` va `pm-m9d8-platforma.trek` o'qiladi, yo'q bo'lsa — o'quvchi o'zi yozadi / trek tugmalari.
8. [x] **Test: bitta himoyalanadigan javob** — 2 test + arena 12: variantlar bir shaklda, uzunlik skript bilan (O'lchov); «Farqi yo'q» yo'q; 7-ekran va arena 10–11 «Mentor misolida» bilan chegaralangan (Backend yuboradigan eslatma boshqa ilovalarda bor); savoldagi son javobda takrorlanmaydi (4-ekran).
9. [—] **Keys: bank so'zi aynan** — dars keyssiz (Qaror-0 22: loyiha kunlari keyssiz), brend va real kompaniya yo'q.
10. [x] **90 daqiqa** — vaqt taqsimoti tepada; Amaliyot 1 3-qadamda Render kutayotganda ish; uch blokda «Ulgurmasangiz»; «Ortda qoldingizmi» uchalasida; O'qituvchi eslatmasi 1-ekran va bloklarda.
11. [x] **Bir ma'no — bir so'z** — «hodisa» faqat ulanish hodisasi; «xona» — faqat Backend tushunchasi (Telegram guruhi bilan aralashmaydi — arena 1 distraktori shuni o'lchaydi); «eslatma» — telefon ekraniga chiqadigan xabar, «push» faqat kartochkada bir marta va `git push`;
    «tekshirish» — o'z ishi, «sinov» yo'q; «e'lon» — faqat o'yin e'loni; «holat» — faqat «test holati»; «xabar» — jonli xabar, eslatma ta'rifi va «Xabarlar» tasmasi.
12. [x] **Web-trek teng yo'l** — Amaliyot 1, 2: web gapi (papka, fayl, sahifa); Amaliyot 3: alohida sarlavha, «Ochish» gapi, to'liq Yordam, tekshiruv, yashil qator, yakun sarlavhasi; halol qator (sayt yopiq — xabar kelmaydi); arena 12 va kartochka 12 — web-trek savoli; testlar ikkala trekka to'g'ri (Mentor misoli haqida).
13. [x] **Agent va o'quvchi ishi ajratilgan** — qaror o'quvchida: qaysi ekran sanaladi, qaysi o'zgarishga qanday jonli xabar, eslatma qachon va nima; agent quradi; tekshiruvda o'quvchi nimani ko'rishi aniq; agent tekshiruv yozuvlari — aytgan `id` lari bo'yicha o'chiriladi (Amaliyot 2, 3 web); `DELETE` o'quvchi qo'lida yo'q.
14. [x] **O'smir xavfsizligi** — «Hozir ko'ryapti» va jonli xabarda ism yo'q (Qaror-0 6); shaxsiy ma'lumot so'ralmaydi; Expo akkaunti ma'lumoti boshqaga berilmaydi (Amaliyot 1); eslatma bosim qilmaydi (faqat o'z o'yini, bir marta); real odamlar bilan ish yo'q.

## O'lchov (scratchpad `md04/olchov.py`, 06.10.2026)
Skript natijasi (oxirgi yurgizish; `!!!` — chegaradan oshgan joy: 0 ta; qavsdagi son va skript soni hamma joyda teng). Belgilar — oddiy `len`, ✔ va chekka bo'shliqlarsiz.
Skript ham tekshiradi: test va arena variantlari ±15% o'rtachadan; to'g'ri variant yolg'iz eng uzun emasligi (2 test, 12 arena — hammasida yo'q); kartochka old tomoni «?» bilan (12/12).
Chegara qo'yilmagan qatorlar: QIzoh (eng uzuni 5-ekran — 114 (04-FILTR 3 dan keyin; avval 145)) · yashil yakun qatorlari (69–83) · to'g'ri izohlar (52, 53).
«push» — 21 marta: hammasi `git push`, MD izohi, Manbalar havolasi va REPO; o'quvchi matnida `git push` dan tashqari faqat kartochkadagi «inglizchasi: push notification» (bir marta).
«bildirishnoma», «onlayn», «toast», «mahalliy», «server», «sinov», «sinab ko» — faqat A-bo'lim «Ishlatilmaydi» ro'yxatida va platforma sarlavhasi «O'zingizni sinab ko'ring.» da.

```
## Sarlavhalar va qavsli qatorlar (≤55)
   54  Ilovani yopgan bo'lsangiz, o'yinni sizga kim eslatadi?
   55  Dars oxirida ilovangiz foydalanuvchini xabardor qiladi.
   42  O'yin ekrani hozir nechta qurilmada ochiq?
   45  Ilovangizda «Hozir ko'ryapti» soni ko'rinsin.
   52  Ilova ochiq va yopiq: o'zgarish sizga qanday yetadi?
   51  Ochiq ilovada o'zgarish jonli xabar bo'lib chiqsin.
   53  Ilova yopiq bo'lsa ham, kerakli payt eslatma chiqsin.
   44  Sayt ochiq paytdagi xabarlar tasmada tursin.
   25  O'zingizni sinab ko'ring.
   55  Uch qism ishlayapti: oxirgi talabni o'zingiz yozdingiz.
   37  Jonli xabar ishlaydi — eslatma qoldi.
   48  Jonli xabar ishlaydi — «Xabarlar» tasmasi qoldi.
   47  «Hozir ko'ryapti» ishlaydi — jonli xabar qoldi.
   48  Loyiha kuni boshlandi — qolgan qadamni tugating.
## Xulosalar (≤110)
  101  Bu misolda son — o'yin ekranini hozir ochib turgan ulanishlar: odamlar emas, ochiq ekranlar sanaladi.
  104  Ilova ochiq bo'lsa — jonli xabar; yopiq bo'lsa, bu misolda faqat ilova oldindan qo'ygan eslatma chiqadi.
## Hook javoblari (≤120)
  100  Aynan! Bu misolda ilova «Qo'shilaman» bosilganda eslatmani o'yindan bir soat oldinga qo'yib qo'yadi.
  115  Qiziq fikr! Backend yuboradigan eslatma ham bor, u alohida sozlashni talab qiladi. Bu misolda vaqtni ilova qo'yadi.
   96  Qiziq fikr! 11-Modulda shunday edi: roadmap'da eslatma keyinroqqa qoldirilgan. Bugun u quriladi.
## Hook variantlari
   41  Backend — o'yindan oldin telefonga yozadi
   45  Ilova — qo'shilganda vaqtini oldindan qo'yadi
   42  Hech kim — ilovani o'zingiz ochib ko'rasiz
## To'g'ri izohlari (bitta gap)
   53  Ochiq ekranlar sanaladi: ikki qurilma — ikki ulanish.
   55  Yopiq ilovada boshqa odam qilgan o'zgarish ko'rinmaydi.
## Xato izohlari (≤60)
   46  Son odamlarni sanaydimi yoki ochiq ekranlarni?
   44  Bu son Database'da bormidi? Uni kim sanaydi?
   53  O'yinni ochish va «Qo'shilaman»ni bosish — bir ishmi?
   50  Bu misolda Backend yuboradigan eslatma qurilganmi?
   58  Jonli xabar qaysi paytda chiqadi — ilova ochiq turgandami?
   50  Ilova eslatmani qachon qo'yadi — kim qo'shilganda?
## QIzoh va yashil qatorlar
   77  Bu son Database'da yo'q — shuning uchun bu hodisa sonning o'zini olib keladi.
   69  «Hozir ko'ryapti» ishlaydi: ochiq ekranlar sanaladi, ism ko'rinmaydi.
  114  Backend yuboradigan eslatma ham bor — u bu modulda qurilmaydi: Google yoki Apple xizmati va alohida sozlash kerak.
   73  Jonli xabar ishlaydi: faqat sizga tegishli o'zgarishda va ismsiz chiqadi.
   83  Eslatma test holatida chiqdi, chiqilganda bekor bo'ldi: talabni o'zingiz yozdingiz.
   82  Tasma ishlaydi: sahifa ochiq paytdagi xabarlar turadi, talabni o'zingiz yozdingiz.
## Mentor gaplari (gap soni)
  1 gap · 108  [boshida] Mentor misolida siz Shanba 18:00 dagi o'yinga qo'shilgansiz, telefon esa cho'ntakda — avval javobni 
  1 gap · 54  [javobdan keyin] Telefon ekraniga qarang, keyin «Davom etish»ni bosing.
  2 gap · 129  Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qurasiz. Talabni har blokda ko'pro
  1 gap · 78  [bashoratgacha] Avval taxminingizni belgilang, keyin 2-telefonda Shanba 18:00 o'yinini oching.
  1 gap · 58  [1-harakatdan keyin] Endi 2-telefonda «‹ O'yinlar» ni bosib, ro'yxatga qayting.
  1 gap · 40  [tugagach] Natijani taxminingiz bilan solishtiring.
  1 gap · 85  Talab tayyor — bitta joyga qaysi ekran sanalishini yozasiz; «1 · Ochish»dan boshlang.
  1 gap · 72  [bashoratgacha] Avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.
  1 gap · 45  [1-harakatdan keyin] Endi 1-telefondagi «Ilovani yopish»ni bosing.
  1 gap · 62  [2-harakatdan keyin] 2-telefonda «O'yindan chiqish»ni bosing va 1-telefonga qarang.
  1 gap · 57  [3-harakatdan keyin] Endi «17:00 ga o'tkazish»ni bosing va 1-telefonga qarang.
  1 gap · 40  [tugagach] Natijani taxminingiz bilan solishtiring.
  1 gap · 129  Endi «Nima qilsin» qatorini o'zingiz yozasiz — qaysi o'zgarishda qanday xabar chiqishini siz tanlaysiz; «1 · O
  1 gap · 128  Oxirgi blokda uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; «1 · Oc
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  ## 4 · 1-savol ✔ (jonli ball)  · savol 11 so'z (yozilgan 11) · variantlar [39, 41, 37, 42] · eng uzun 42 / eng qisqa 37 · OK
      A   39  Bittaga — bitta odam bir marta sanaladi
      B✔  41  Ikkiga — har ochiq ekran alohida sanaladi
      C   37  Oshmaydi — bu son Database'dan keladi
      D   42  Ikkiga — ikkala qurilma o'yinga qo'shiladi
  ## 7 · 2-savol ✔ (jonli ball)  · savol 10 so'z (yozilgan 10) · variantlar [41, 36, 33, 38] · eng uzun 41 / eng qisqa 33 · OK
      A   41  Eslatma keladi, uni Backend o'zi yuboradi
      B   36  Jonli xabar keladi, ilova ochilganda
      C   33  Eslatma keladi, uni ilova qo'ygan
      D✔  38  Hech narsa kelmaydi, ochganda ko'rasiz
## Arena (12) — ✔ o'rni va variant uzunliklari
   1. ✔A · 5 so'z · [33, 34, 35, 33] · OK  Mentor misolida `korayotganlar-ozgardi` kimlarga boradi?
   2. ✔B · 10 so'z · [33, 33, 35, 31] · OK  Siz «O'yinlar» ekranidasiz, kimdir o'yinni ochdi. Sizga yangi son kela
   3. ✔C · 10 so'z · [33, 34, 36, 38] · OK  Boshqa telefonda o'yin ekrani yopildi. Sizdagi «Hozir ko'ryapti» nima 
   4. ✔D · 8 so'z · [28, 27, 31, 30] · OK  Nega «Hozir ko'ryapti» sonini hodisaning o'zi olib keladi?
   5. ✔A · 7 so'z · [32, 32, 37, 34] · OK  Ilova ochiq. O'yiningizda joy bo'shadi. Nima ko'rasiz?
   6. ✔B · 8 so'z · [37, 39, 40, 41] · OK  O'zingiz «Qo'shilaman»ni bosdingiz. Mentor misolida jonli xabar chiqad
   7. ✔C · 4 so'z · [38, 41, 41, 37] · OK  Rejalashtirilgan eslatmani kim qo'yadi?
   8. ✔D · 6 so'z · [37, 34, 33, 35] · OK  Mentor misolida eslatma qachon chiqishi kerak?
   9. ✔A · 8 so'z · [30, 27, 29, 32] · OK  Mentor misolida «O'yindan chiqish» bosildi. Eslatma nima bo'ladi?
  10. ✔B · 6 so'z · [38, 36, 34, 34] · OK  Backend yuboradigan eslatma uchun nima kerak? (04-FILTR: ✔ «Google yoki Apple xizmati va sozlash» — tayanch 9.26)
  11. ✔C · 7 so'z · [33, 35, 33, 38] · OK  Mentor misolida eslatmaga ruxsat berilmadi. Nima bo'ladi?
  12. ✔D · 5 so'z · [33, 33, 31, 29] · OK  Web-trekda uchinchi amaliyotda nima quriladi? (04-FILTR 30)
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Kartochkalar
  12 karta; savol belgisi bilan tugaydi: 12
## Ekranlar
  12 ekran: 0 Kirish — yopiq ilova eslatadim | 1 Bugun quramiz | 2 Xona | 3 Amaliyot 1 — «Hozir ko'ryapti» | 4 1-savol ✔ (jonli ball) | 5 Ochiq va yopiq ilova | 6 Amaliyot 2 — jonli xabar | 7 2-savol ✔ (jonli ball) | 8 Amaliyot 3 — eslatma (web-trek | 9 Natijalar (podium) | 10 Takrorlash | 11 Yakun
## So'z nazorati (o'quvchi matni + MD)
  push: 21
  bildirishnoma: 2
  onlayn: 1
  toast: 1
  sinab ko: 2
  sinov: 2
  mahalliy: 1
  darhol: 0
  darrov: 0
  albatta: 0
  har doim: 0
  hech qachon: 0
  kafolat: 0
  server: 2
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-03` «Ekran o'zi yangilanishi uchun nimani yozasiz?» → **`m10-04` «Loyiha kuni: jonli xabar va eslatma»** (osti «hozir ko'ryapti, jonli xabar; mobil trekda — telefonga eslatma», App.jsx 401-qator, grep 06.10) → `m10-05` «Ulanish uzilsa: buzamiz va tuzatamiz»; yakundagi «Keyingi dars» — shu nom, so'zma-so'z.
  Reja qadamlari teglarsiz (11-Modul loyiha kuni naqshi, F-1003-06) — `sub` ning uch bo'lagi qadamlarda oddiy so'z bilan: «nechta qurilmada ochiq» (hozir ko'ryapti) · «tepada qisqa xabar» (jonli xabar) · «telefonga eslatma».
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; keyssiz; bitta vizual — real vaqt sahnasi (`JonliSahna`: 0, 1, 2, 5-ekranlar va bloklarning kutilgan natijasi — bitta manba). O'quvchining o'z mahsuloti — uch blok.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (xonaga kirish va chiqish → son 2 → 1), 5 (jonli xabar → ilova yopiladi → jonli xabar ko'rinmaydi → eslatma); 0-ekran javobdan keyin; bloklarda «Bajardim» → qadam yig'iladi, kadrlar yuradi. Matn-karta yo'q.
  Bashoratlar (2, 5) tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor gapi bosqichga qarab aynan shu harakatni aytadi (SABOQ 11).
- [x] Sarlavha ≤55 bitta qator (eng uzuni 55 — reja va yakun) · Mentor ≤2 gap (interaktiv ekranlarda va bloklarda 1) va sarlavhani takrorlamaydi · xulosa ≤110 (101, 104) · hook javobi ≤120 (96–115) · xato izohi ≤60 (44–58) — O'lchov bo'limi.
- [x] Atamalar tayanch 2 va pilot 02 bilan bir xil (xona, hozir ko'ryapti, jonli xabar, eslatma, rejalashtirilgan eslatma, Backend yuboradigan eslatma, hodisa — ulanish ma'nosida, test holati, ulanish belgisi «Ulanmoqda…»); siz-forma; tugmalar ot-shaklda («Nusxalash», «Bajardim», «Ilovani yopish»); agent promptlari — T-002 istisnosi; jonli xabar va eslatma matni — olam ichidagi matn (T-008).
- [x] Testlar: variantlar bir shaklda (4-ekran «son — sabab», 7-ekran «nima, qachon/kim»), uzunligi ±15% ichida, to'g'ri javob yolg'iz eng uzun emas; kalit so'z bir nechta variantda («Ikkiga» B, D; «keladi» A, B, C) · ✔: s4 B · s7 D · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [x] Final tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami; ✓ ✗ → ↻ — belgilar) · kafolat gaplari yo'q («darhol», «darrov», «albatta», «har doim», «hech qachon», «kafolat» — 0; «odatda», «chiqishi kerak», «mumkin» bilan).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3, `m10-04`, «Modul 12», «mini-PRD» — yo'q; blok — «Amaliyot 1/2/3»; modul raqami LMS bo'yicha — «11-Modulda»); tarixiy voqea yo'q · «KOD» (12) va «REPO» (6) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (hodisa → xona; jonli xabar → eslatma → rejalashtirilgan eslatma — harakatdan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 («hodisa», «xabar», «holat», «push») · T-016/017 (metafora yo'q) · T-024 · T-029 · T-034 · T-039 · T-042 · T-043 («bu misolda», «Mentor misolida») ·
      T-045 (eslatma Backend'dan kelmaydi; «Hozir ko'ryapti» — odamlar emas; yopiq ilova — soddalashtirish, Shubhali 6) · T-047 · T-048 · T-049 · T-052 · T-064 · T-066 · T-070 ·
      P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 (hook payoff variantni yolg'onga chiqarmaydi) · P-026 (xato yo'li — ayb so'zisiz: «sizda emas» olib tashlandi, 02-FILTR 12) · P-028 (ruxsat oynasi, sozlamalar menyusi — taxmin qilinmadi) · P-036 · P-046 · P-052 · P-055 · P-059 · P-062 · P-063 (`JONLI_XABARLAR`, `ESLATMA`) · P-064 · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-018 (brend yo'q) · S-019 · S-020 · S-025 · S-026 · S-040 · SABOQ 6, 9, 11, 12, 16, 17, 19–31.
- [ ] (ochiq) P-028: ruxsat oynasi va eslatmaning Expo Go'da (Android, iPhone) amalda ko'rinishi — hujjatdan, qurilmada sinalmagan (Shubhali 1–4); «qur» bosqichida yoki pilotda tekshiriladi.
