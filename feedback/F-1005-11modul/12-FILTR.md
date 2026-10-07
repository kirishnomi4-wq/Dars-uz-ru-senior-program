# 12-dars «Loyiha kuni: 2-asosiy funksiya» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 7/10 (pedagogika 9 · ruxsat modeli 8.5 · texnik izchillik 6 · o'z mahsulotiga ko'chirish 5.5 · 13-darsga tayyorlash 8). Hukm: **Qabul 10 · Qisman 4 · Rad 2 · Allaqachon / o'zgarishsiz 26**.
Tekshirilgan manbalar: MD o'zi (grep) · tayanch 6 (Expo Go — iPhone'da bitta Expo akkaunti), 9.3, 9.8, 9.29–9.36, 9.74, 9.81, 9.84, 9.86 · 10-dars MD (namuna telefonlar `… 00 00`, `… 00 01`) · 13, 14-dars MD (ikkinchi akkaunt, `Kelaman` qoidasi) · `QOIDALAR.md` T-028, T-067 · 11-FILTR.
Zaxira: scratchpad `md11/12-oldin-12filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | `qoshildi` → `keladi` bo'lganda «/ 9» kamayib ketmasin — `qoshilgan` nimani sanaydi? | Allaqachon (aniqlandi) | Qaror bor: tayanch 9.74 — `qoshildi` yoki `keladi`; 11-dars REPO 11-FILTR 21 da shunga tuzatilgan. 12-dars A-bo'lim va REPO ga ochiq yozildi: «`qoshilgan` — `qoshildi` + `keladi`: «Kelaman»dan keyin «/ 9» o'zgarmaydi». |
| 2–5 | «Har qanday 2-funksiyaga mos uch bo'lak» — noto'g'ri; A1 vazifa, A2 «boshqa odam», A3 «tugma» hamma mahsulotga emas | **Qisman** | Da'vo olindi: A-bo'lim «Mentor misolining uch bo'lagi (ko'p funksiyaga mos, lekin hammasiga emas)»; 1-ekran izohi ham. A1 «Ochish»ga: «Funksiyangizda alohida qoida yoki natijani ko'radigan boshqa odam bo'lmasa — har blokda funksiyangizning mos qismini quring: harakat · natija qayerda ko'rinadi · tugma qachon chiqadi.» A1 vazifasi va yashil qatordan «Database'ga yoziladi» majburiyati olindi. **Blok sarlavhalari qoladi:** bu modulda har mahsulot umumiy Backend ustida (10-dars: «umumiy joy») va har o'quvchi 8-darsda o'z real vaqt nuqtasini yozgan — «natijani boshqa odam ko'radi» ko'p mahsulotga to'g'ri; sarlavhalar testlar va arena bilan bog'langan. Tayanch 9.89. |
| 6, 10, 13–16, 18–20, 23, 24, 26, 30–34, 36 | 401/403 ko'prigi · hook · «tugma hozircha har joyda» · bugungi e'lon · tashkilotchi «0 / N» · qayta tasdiq · «7 / 9» · ismsiz doiralar · ikkinchi foydalanuvchi · namuna ism · web «Yangilash» · ko'rinish qoidasi · 4-mashq · real vaqt nuqtasi · qayta ochilganda holat · 2-savol · uyga sinov · Mentor vazifasi | O'zgarishsiz | Auditor tasdiqladi. |
| 7 | `403` faqat «rol yetmadi» deb torayib qolmasin | Allaqachon | O'quvchi matnida «ruxsat yo'q» (joriy qator, kartochka, arena 2); «rol» — faqat MD dagi 4a-Modul iqtibosida. MD ga izoh: «bu darsda `403` — rol emas, qoida». |
| 8 | `Asia/Tashkent` — har loyihaga qoida emas | Allaqachon | Kartochka: «Mentor talabida «bugun» — Toshkent vaqti bilan». |
| 9 | «Bugun: shanba» ilova sarlavhasiga tushib qolmasin | **Qabul** | KOD 2: «ramkadan tashqarida, ilova ekranining qismi emas» (vizual va Shubhali joylarda avvaldan bor). |
| 11 | Hookda «Qiziq fikr!» | **Rad** | QOIDALAR T-028, T-067 (tayanch 9.76). |
| 12 | Hook 2-variant 14-dars bilan aralashadi — «hali» kerak | Allaqachon | «Ilovada bunday joy hali yo'q …». |
| 17 | `keladi` dagi o'yinchi qayta tasdiqlasa — ruxsat «qator bormi» yoki «`qoshildi` mi»? | **Qabul** (kengaytirildi) | Auditor faqat `keladi` ni ko'rgan; «qator bormi» tekshiruvi 14-darsda **`navbatda` va `chiqdi`** o'yinchiga ham ruxsat berib qo'yardi. Tayanch 9.87: «qo'shilgan» — holati `qoshildi` yoki `keladi` (9.74); `navbatda`, `chiqdi` — `403`. REPO tuzatildi. |
| 21, 22 | iPhone'da sinfdosh sizning Expo akkauntingizga kiradi — akkaunt ma'lumotini berish odat bo'lmasin; asosiy yo'l — bitta telefon | **Qabul** | A2: asosiy yo'l — o'z telefonida «Hisobdan chiqish» bilan ikkinchi akkaunt; sinfdosh telefoni — web havola yoki Android'dagi Expo Go; «Expo akkauntingiz ma'lumotlarini boshqaga bermaysiz.»; tekshiruv (1)–(3) ikkinchi akkauntga moslandi; 4-mashq sahnasi ikki telefonni ko'rsatib turadi. Tayanch 9.88. 14-dars 1-qadami ham shu tartibga keltirildi. |
| 25 | Web «Yangilash» — mahsulot tugmasimi, vaqtinchalikmi? | **Rad** | 8-darsda tanlangan (`QKod` — «Yangilash» tugmasi), 9.84: web versiyadagi pastga tortishning o'rni — mahsulot qismi. Vaqtinchalik qilinsa, 13-dars sinovchisi ro'yxatni yangilay olmaydi. |
| 27, 28 | «Kelaman» ko'rinishi uchun «o'yin kuni»ni ilova o'zi hisoblaydimi (telefon soati, mintaqa)? | **Qabul** | `GET /oyinlar` ga `menTasdiqlayOlaman` — Backend `…/tasdiq` dagi o'sha qoida bilan hisoblaydi (o'yin kuni `Asia/Tashkent`, qo'shilgan). A3 «Yordam»: «ilova sanani o'zi solishtirmasin»; REPO, A-bo'lim; tayanch 9.29, 9.87. Asosiy fikrga mos: qoida bitta joyda — Backend'da. |
| 29 | `GET /oyinlar` maydon nomlari muzlatilsin | Allaqachon | Tayanch 9.29 (har dars qo'shadigan maydonlar ro'yxati). |
| 35 | Uyga vazifa — qaysi funksiya sinaladi? | **Qabul** | ①: «Vazifa — mahsulotingizdagi asosiy ish, faqat bugungi funksiya emas.»; A-bo'lim 8. |
| 37 | Uch sinovchi — bitta namuna telefon bo'lsa `409` | **Qabul** | ②: «har biri boshqa namuna telefon bilan»; A2 ikkinchi akkaunt — `+998 90 000 00 02` («telefon takrorlansa, ro'yxatdan o'tish rad etiladi»). Tayanch 9.88. **Sinf-supurish:** 13-dars (O'qituvchi eslatmasi, uyga vazifa ①), 14-dars (1-qadam). |
| 38 | Uy sinovida mobil trek uchun laptop va bitta Wi-Fi | O'zgarishsiz (ochiq) | MD Shubhali joylarida va uyga vazifa ② da aytilgan; uyga sinov — Qaror-0 16. Sinovda ko'riladi. |
| 39 | 90 daqiqa zich | O'zgarishsiz (sinov) | 10-dars sinovi taymeri bilan. |
| 40 | Render «zero downtime» — Mentor matniga chiqmasin | Allaqachon | Faqat `QIzoh` da. |
| 41 | Xato gapida `.env`, token yuborilmasin | **Qabul** | `.env` qismi 11-FILTR sinf-supurishida qo'shilgan edi; endi **token** ham: «(`.env` qiymatlari va tokenni emas)» — 10–14-darslar (13 joy), tayanch 9.81. |
| 42 | Yakun — holatga qarab | **Qabul** | A3 — «Ikkinchi funksiya tayyor: ruxsatni Backend beradi.» (oldingi «kim kelishi endi ko'rinadi» — Mentor misolining natijasi, o'quvchi funksiyasiga emas) · A2 — «Harakat va natija ishlaydi — tugma qoidasi qoldi.» · A1 — «Harakat va ruxsat ishlaydi — natijani ko'rsatish qoldi.» · yo'q — «Ikkinchi funksiya boshlandi — qolgan qadamni tugating.»; belgi faqat A3 da. |

**MD TAYANCHGA SAVOL:** 1–9 — avvaldan yopiq (9.29–9.34, 9.41) · 10 — 9.74 bilan · yangi: tugma qoidasi manbasi — 9.87 · namuna akkauntlar — 9.88.

Tekshiruv: `lint:til` 10–14 — 0 error (ogohlantirishlar avvalgidek: 10 — 2, prompt sen-formasi · 12 — 2 · 13 — 6 · 14 — 2) · o'zaro tekshiruv 10–14 — arena 3/3/3/3.
