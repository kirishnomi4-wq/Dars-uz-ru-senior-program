# 8-dars «Arxitektura va platforma: web yoki mobil ilova» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 6.5/10 (pedagogika 8.5 · arxitektura modeli 8 · platforma tanlovi 6 · texnik aniqlik 6.5 · continuity 6). Hukm: **Qabul 17 · Qisman 4 · Rad 3 · Allaqachon / o'zgarishsiz 11**.
Tekshirilgan manbalar: MD o'zi (grep) · tayanch 1.6, 2, 8, 9.4 (hash gapi), 9.31 (yangi e'lon «0 / N»), 9.32 (`400` — bo'sh forma) · `QOIDALAR.md` T-028, T-067 (hook javoblari) · 9–14-dars MD lari (`pm-m9d8-platforma.trek` o'qiladi).
Zaxira: scratchpad `md08/08-oldin-filtr.md`, `md08/tayanch-oldin-08filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Platforma tanlovi «mobil 2 · web 1» — ovoz sanog'i | **Qabul** | 10-ekran: ustunlarda son yo'q — har javob «signal»; 4/4 da Mentorning **hal qiluvchi** signallari (1 va 2) accent; xulosa «Bu misolda hal qiluvchi signal — o'yinchi maydonda, qo'lida telefon; havoladan ochish web tomonda qoldi.»; `QIzoh` «Signallar sanalmaydi: asos qaysi signal muhimroq ekanini aytadi.» 13-ekran: yangi qadam «Hal qiluvchi — qaysi signal qaroringizga eng ko'p ta'sir qiladi?», kalit `halQiluvchi: [1–2]`. Tayanch 1.6, 8. |
| 2 | «Eslatma → mobil» kuchsiz: web'da ham eslatma bor | **Qisman** | Savol: «Telefonning o'z imkoniyati kerakmi — kamera, joylashuv yoki telefonga keladigan eslatma?»; signal ostida «Mobil tomonga tortadi — web'da umuman yo'q degani emas.» Mentor asosi (tayanch, aynan) qoladi. |
| 3 | «Havola bilan ulashish → web» — mobil ham havola ulashadi | **Qabul** | Savol: «Odamlar uni hech narsa o'rnatmasdan havoladan darhol ochishi muhimmi?» (10, 13-ekran, tayanch 1.6). |
| 4 | Stek savoli — foydalanuvchi signali emas, qurish sharti | **Qabul** | Kartada yorliq: 1–3 — «Foydalanuvchi signali», 4 — «Qurish sharti» (10, 13-ekran; tayanch 1.6). |
| 5, 19 | «Backend va Database ikkala trekda bir xil» — umumiy haqiqat emas | **Qabul** | «Bu modulda …» — asosiy fikr, 12-ekran xulosasi, kartochka, yakun; tayanch 9.75. |
| 6, 15, 17, 18, 20, 25, 28 | Hook (ilova ham, sayt ham) · 7-ekran testi · `fetch` 10-darsdan · stek 12-ekranda · Expo Go · `ishtirokchilar` · «ko'rsatadi / tekshiradi / saqlaydi» | O'zgarishsiz | Auditor tasdiqladi. |
| 7 | Backend «to'liqmi?» — kanonik emas | **Rad** | Kanonik: tayanch 9.32 — `400` bo'sh forma (10, 11-darslar); «to'liqmi?» shu tekshiruv. MD TS 9 yopildi. |
| 8 | «0 / 8» — demo holati | Allaqachon | Kanonik: tayanch 9.31 — tashkilotchi avtomatik qo'shilmaydi, yangi e'lon «0 / N». TS 8 yopildi. |
| 9, 26 | «8 / 10» qaysi `holat` lar sanaladi; `holat` sinonimsiz | **Qabul** | Tayanch 9.74: `qoshildi` yoki `keladi` sanaladi, `navbatda`, `chiqdi` — yo'q; to'rt qiymat modul bo'yi. O'quvchi matnida «qo'shilganlar» qoladi (navbatdagi qo'shilgan emas). |
| 10 | Hash: «undan parolni qaytarib bo'lmaydi» | **Rad** | Tayanch 9.4 (10-dars bilan bir); auditor ham «qoldirish mumkin» degan. |
| 11 | Bog'lovchi ustun = «`_id` bilan tugagan» — noto'g'ri umumlashtirish | **Qabul** | 3-ekran: «Boshqa jadvaldagi qatorni ko'rsatadigan ustun bog'lovchi ustun deyiladi; bu darsda ularning nomi `_id` bilan tugaydi.»; A1 talabida «Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz» (o'quvchi nomlari `_id` siz bo'lishi mumkin); tayanch 9.75. |
| 12, 13 | «Real vaqt nuqtasi» — ma'lumot o'zgaradi, ekran o'zi emas | **Qabul** | Ta'rif: «Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy — real vaqt nuqtasi.» (5-ekran, yakun, kartochka, tayanch 2 + «bu modulda ekran uni qayta so'raganda ko'rsatadi»); 5-ekran sarlavhasi «Boshqa odam sabab qaysi ma'lumot o'zgaradi?», tugma «Ma'lumoti o'zgaradi»; xato qatori «Kimdir qo'shilsa yoki tasdiqlasa, bu ma'lumot o'zgaradi.» |
| 14 | WebSocket — yagona yo'l emas | **Qabul** | «Ekran o'zi yangilanadigan yo'llardan biri — WebSocket; roadmap'da u keyinroq ufqda, 12-Modulda.» |
| 16 | `sora()` chaqirilganda son oshadi — sabab-natija chalkashadi | **Qisman** | Kod izohi: «Backend o'rnida namuna (haqiqiy Backend emas): har so'rov navbatdagi javobni oladi — so'rovlar orasida boshqa o'yinchilar qo'shilgandek». Kod o'zgarmadi — o'quvchi faqat `addEventListener` yozadi. |
| 21 | `halQiluvchi` maydoni | **Qabul** | 1 bilan. |
| 22, 23 | Uyda asos o'zgarsa — README yangi, kalit eski; bitta javob trekni almashtirmasin | **Qabul** | Uyga vazifa 3: «… to'rt savolni qayta ko'ring; trek yoki asos o'zgarsa, darsdagi platforma kartasida ham, README'da ham yangilang.» (13-ekran kalit bilan to'ldirilgan holda ochiladi); tayanch 8. |
| 24 | «Jadvallar funksiyalardan chiqadi» — deterministik | **Qabul** | «Funksiyalar qaysi ma'lumot saqlanishini ko'rsatadi; …» |
| 27 | Hook: «telefon o'chiq bo'lsa ham sayt 9 / 10 ni ko'rsatadi» — kafolat | **Qabul** | «Telefon o'chiq bo'lsa ham, sayt shu sonni Backend'dan olishi mumkin — demak, u boshqa joydan oladi.» «Qiziq fikr!» qoladi — QOIDALAR T-028, T-067 (tayanch 9.76). |
| 29, 30 | A1 da arxitektura qarorini agent emas, o'quvchi qilsin | **Qisman** | A1 talabiga yangi joy `{saqlanadigan ma'lumotlar}` — o'quvchi o'zi yozadi (oldindan to'ldirilmaydi), agent jadvalni shundan tuzadi; tekshiruvda «siz yozgan har ma'lumot jadvalda bor». Jadval nomlarini o'quvchiga yozdirish — **rad** (vaqt; jadval tuzish — agent ishi, tekshirish — o'quvchi ishi, 9-Modul modeli). |
| 31 | 90 daqiqa zich; A1 majburiy, A2 uyda | **Qisman** | Yakun holatga qarab: A2 — «Chizma tayyor, platforma asos bilan tanlandi.» · A1, A2 yo'q — «Chizma tayyor — README ning qolgani uyda.» · A1 yo'q — «Platforma tanlandi — README uyda yoziladi.»; real vaqt — pilot taymeri bilan. |
| Sarl. 5 | «Boshqa odam sabab qaysi ma'lumot o'zgaradi?» | Qabul (12, 13 bilan) | — |
| TS 1–14 | Agent savollari | Qabul / yopildi | MD «TAYANCHGA SAVOL» holat qatori: 6 — 9.74 · 8 — 9.31 · 9 — 9.32 · 13 — tuzatildi. |

**Muhim tuzatish (7-dars):** hook javoblaridagi «Aynan!» / «Qiziq fikr!» — QOIDALAR T-028 va T-067 dagi kurs qonuni (xato tanlovga neytral javob, maqtov emas). 7-darsda (07-FILTR 10) ularni ChatGPT ga ergashib olib tashlagan edim — **qaytarildi** (09:58); 8–16-darslardagi hooklar shu qonun bilan qoladi. Tayanch 9.76.

**Sinf-supurish:** «real vaqt nuqtasi» ta'rifi — 9–14-darslarda ta'rif takrorlanmaydi (grep); «`_id` li ustun» — 10-dars A1 talabida yo'q · `pm-m9d8-platforma` — 9–14-darslar faqat `trek` ni o'qiydi, yangi maydon ularga ta'sir qilmaydi.

Tekshiruv: `lint:til` 07, 08 — 0 · o'zaro tekshiruv — arena 3/3/3/3, «Keyingi dars» mos.
