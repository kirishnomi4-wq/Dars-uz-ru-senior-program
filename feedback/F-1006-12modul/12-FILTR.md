# 12-dars «Raqamlaringiz zalni ishontiradimi?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-366

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, Qaror-0 20, 10 va 11-darslar, 11-Modul 16-dars) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1905/` (34 fayl). Bu — modulning oxirgi auditi (01–12).

Audit bahosi 7/10 (pitch pedagogikasi 9 · grafik savodxonligi 7.5 · 11 → 12 continuity 6 · ma'lumot aniqligi 6.5 · juftlik repetitsiyasi 9 · 90 daqiqa 5.5).
Hukm (42 band): **Qabul 22 · Qisman 4 · Rad 1 · Allaqachon / o'zgarishsiz 15**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Muammo bo'lagida «Dalilga sanoqni yozing» — 11-darsdagi «son yoki yozuv» bilan zid | **Qabul** | Maydon: «Dalil» (placeholder `Son yoki kuzatuv — qayerdan?`); raqam talab qilinmaydi; bo'sh bo'lsa yo'naltiradi: «Muammo borligini nima ko'rsatadi? Son yoki kuzatuv yozing.» 11-darsdagi `dalil: { son, yozuv, manba, qachon }` shu maydonga tushadi. |
| 2 | Ustun — jami; 18 va 6 — haftalik qo'shimcha: farq aytilmagan | **Qabul** | 4-ekran 4-tugmasidan keyin ustunlar orasida «+18», «+6» va kulrang qator: «Ustun — shu kungacha jami; ustunlar farqi — o'sha haftadagi qo'shimcha: 18, keyin 6.» A-bo'lim, O'qituvchi eslatmasi, tayanch 1.12. |
| 3 | «Grafik qoidalari» — hamma grafikka umumiy qoidadek | **Qabul** | A-bo'lim va tayanch 1.12: «shu darsdagi ustunli grafik uchun»; asosiy fikr — «Zal sonni ustunlarda ko'radi …»; kartochka va recap — «ustunli grafik». |
| 4 | 18 dan boshlangan grafik — faqat mashq | **Qabul** | Yorliq: «Mentor misoli sonlari · mashq: ataylab buzilgan»; A-bo'limda — Mentorning haqiqiy grafigi emas. |
| 5 | «13 barobar» — o'quvchi matnida bo'lmasin; izohda aniq | **Qabul** | O'quvchi matnida yo'q edi. O'qituvchi eslatmasi: «balandligi o'n uch barobar ko'rinadi (26 va 2 birlik) — bu son emas, chizmaning ko'rinishi … «O'n uch barobar o'sdi» deyilmaydi.» |
| 6 | O'quvchi grafigi nuqtalarining manbasi muzlatilmagan | **Qabul** | `kunlar` tayanch 8 va 10 MD da bor edi, lekin ma'nosi yozilmagan. Shartnoma (tayanch 8, 9.44 b; 10 MD saqlash qatori; 12 KOD 8): `kunlar: [{ sana: 'YYYY-MM-DD', soni }]`, `soni` — **shu kuni** yangi ro'yxatdan o'tganlar (jami emas), namunasiz; 12-dars har 7 kunda jamini hisoblaydi. `kunlar` 10-dars kunigacha — keyingi nuqtani o'quvchi qo'shadi; `kunlar` yo'q — o'zi yozadi yoki grafiksiz yo'l. |
| 7 | Bitta ustun bo'lsa «Sonlarim hali yo'q» — noto'g'ri nom | **Qabul** | Tugma: **«Grafikka nuqta yetmaydi»**; bosilganda: «Bitta son ham yetadi: uni Raqamlar bo'lagida sanasi va manbasi bilan aytasiz.» (8-darsdagi shu nomli tugma — boshqa holat, tegilmadi.) |
| 8 | Bir haftadan kam ishlagan mahsulotga grafik chizdirilmasin; grafik yo'qligi pitchni yomon qilmasin | **Qabul** | Yordam va O'qituvchi eslatmasi: oraliq sun'iy tenglashtirilmaydi. **Topildi:** yakunning birinchi sarlavhasi «Pitchingiz grafik bilan aytildi …» grafiksiz o'quvchiga yolg'on edi — ikkinchi matn: «Pitchingiz sonlaringiz bilan aytildi va baholandi.» To'rtinchi holat sarlavhasidan «grafik» olindi. |
| 9 | Growth Chart! faqat o'z sonlari bilan | Allaqachon | Saqlandi. |
| 10 | «Bajardim» natija DOM idan o'qishi haqiqiy `HtmlCompiler` da sinalmagan | **Qabul** | ⛔ «qur» darvozasi (KOD 8, tayanch 9.44). Zaxira yozildi: o'qib bo'lmasa — «Bajardim»dan keyin nuqtalarni tasdiqlash formasi. |
| 11 | Yechim = uchta foyda — 20 soniyada ro'yxatga aylanadi; yechim gapi + 1–2 foyda kuchliroq | **Qisman** | **O'z xatoim:** tayanch 9.31 «yechim gapi + uch foyda» deydi, MD esa faqat foydalarni yozgan (moslanmagan). MD 9.31 ga keltirildi; o'quvchi yechim gapini qoldirib 1–3 foydani o'zi tanlaydi; «Mentor pitchining usuli — umumiy qoida emas». Tarkib — sizning qaroringiz (GATE M M-q4): auditor varianti uchinchi javob bo'lib qo'shildi. |
| 12 | «Bir bosishda jamoadasiz» — to'lgan o'yinda rost emas | **Rad** | 01-FILTR 20 da ko'rilgan: to'lgan o'yinda «Qo'shilaman» tugmasining o'zi yo'q («Navbatga yozilish» — 11-Modul 1.7); tugma bor joyda gap rost. Lending foydasi tayanch 1.1 dan, o'zgarmadi. |
| 13 | Muammo dalili (5 dan 4) hamma o'yinchi haqida isbot emas | **Qabul** | Mentor pitchida dalil manbasi bilan aytiladi: «Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.»; O'qituvchi eslatmasi: «shu besh kishining javobi». |
| 14, 16, 17 | Raqamlar tarkibi · «44 kishidan 11 tasi — sinfdoshlarim» · «maqsad 50» va'da emas | Allaqachon | Saqlandi. |
| 15 | Bosh raqam 1 → 3: «uch barobar oshdi» deyilmasin | **Qabul** | Yordam va O'qituvchi eslatmasi: «Sonlarni o'zini ayting: «uch barobar oshdi» emas — «1 ta edi, 3 ta bo'ldi».» |
| 18 | «Har e'lon bilan havola ulashiladi» — kim, qayerga; spam bo'lmasin | **Qabul** | Gap almashdi (pastda M1): «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.» O'qituvchi eslatmasi: ilova hech kimga o'zi yubormaydi; guruhga yozish — 6-dars qoidalari. |
| 19, 24–26 | Ikki qurilmali demo · ekran videosi zaxirasi · Uzum · «17 million — me'yor emas» | Allaqachon | Saqlandi. |
| 20 | Brauzer ko'rinishi sinalmagan | **Qabul** | ⛔ «qur» darvozasi (9.39 k, 9.44): kirish, ulanish, CORS, Backend uyg'onishi, bitta o'yinda «8 → 9». Ishlamasa — ikkinchi qurilma faqat sherik telefoni, uyda — ekran videosi. |
| 21 | Ikkinchi qurilma akkaunti — tayanchga | **Qabul** | Tayanch 9.44 c. |
| 22, 23 | Repetitsiya ishlab turgan mahsulot holatini o'zgartiradi | **Qabul** | Demo — real odamlar qo'shilmagan o'yinda (har bosish real o'yinchilarga jonli xabar yuborardi). 8-ekran O'qituvchi eslatmasi, 11-ekran «Pitchdan oldin» (to'rtinchi qator), A-bo'lim, tayanch 1.12, 9.44 c. Ochiq: 7-darsdan keyin namuna o'yin qolganmi — «qur» da. |
| 27 | Grafikdagi «sana» — Mentor misolida nisbiy yozuv | **Qisman** | Atama almashmadi: o'quvchi grafigida haqiqatan kalendar kun turadi (11-darsdagi «qachon»dan farqi — u yerda davr ham to'g'ri qiymat edi). 4-ekranda kulrang qator: «Mentor misolida aniq kun o'rnida — necha hafta o'tgani; sizning grafigingizda — sana.» Sana to'qilmaydi. |
| 28 | 12-ekran: uchala noto'g'ri variant «grafikni buzadi» — javob turkumdan topiladi | **Qabul** | MD ning o'zi «Shubhali joylar»da shuni yozgan edi — haq chiqdi. D almashdi: «Sekinlashuvni aytmay, eng baland ustunni ko'rsatasiz» (grafik to'g'ri, halollik buzilgan). Kalit o'rni (B) o'zgarmadi. |
| 29 | To'g'ri izoh «keyingi qadam shundan» — sabab da'vosi | **Qabul** | «Sekinlashuv yashirilmaydi — keyingi ishingizni aytasiz.»; recap 12 ham. |
| 30, 33–35, 39 | Varaq · yakun sarlavhasi · `varaqTur` · «o'zingiz — mashq» · holatli yakun | Allaqachon | Saqlandi. |
| 31 | Beshta ✓ bo'lsa «tuzatish» — sun'iy | **Qabul** | Beshta ✓ da tugma «3 Aniqlashtiring», Mentor gapi: «Sherigingiz tanlagan bo'lakni yanada aniqroq qilib yozing.» |
| 32 | «Tuzatildi» — qayta baholanmagan matn «endi yaxshi» degani emas | **Qabul** | Yorliq — «o'zgartirildi»; ✗ o'chmaydi. Kalit nomi `tuzatildi` qoldi (ma'nosi — matni o'zgartirilgan bo'laklar; 5-darsdagi kelishuv 9.37 f naqshi). |
| 36, 38 | 11-ekran 18 daqiqa — 22–25 kutiladi; 10-ekran 12 daqiqa | **Qisman** | ⛔ «qur» pilotida 12–15 o'quvchi bilan taymer; sig'masa — B o'quvchining pitchi uyga vazifa ① ga. 10-ekran yengillashdi: bo'laklar endi 11-darsdagi yakuniy matndan tayyor keladi (pastda M3). |
| 37 | Backend uyg'onishi va sinf tarmog'i | **Qabul** | O'qituvchi eslatmasi: avval hamma ilovani ochadi va «Ulangan»ni ko'radi, keyin taymer; pilotda ko'riladi. |
| 40 | Uyga vazifa ③ — son qayerdan | **Qabul** | «Sonni metrika hisobotidagi yo'l bilan oling: o'sha so'rov yoki sanoq sahifasi.» |
| 41 | Uyda ikkinchi qurilma — brauzer sinalmagan | Allaqachon | ① da «ikkinchisi bo'lmasa — ekran videosini» bor; band 20 darvozasi. |
| 42 | «Keyingi dars» qatoridan keyin nishonlar | O'zgarishsiz | Qolip standarti (11-FILTR 30 bilan bir). |

## O'zim topganlar

| № | Topilma | Nima qilindi |
|---|---|---|
| M1 | **Mentor pitchi 11-darsdan 12-darsga uzilgan edi:** 11-darsda Muammo — «O'yinchilar jamoaga odam yig'ishda qiynaladi», 12-darsda — boshqa (to'liq) gap; Keyingi qadam 11-darsda — «…«Havolani ulashish» tugmasi bilan tashkilotchi … yuboradi», 12-darsda — «Har e'lon bilan havola ulashiladi». Bitta pitchning ikki xil matni. | 12-dars 11-darsdagi tuzatilgan pitch gaplarini oladi (+ «maqsad 50»). Tayanch 1.12, 9.44 a. |
| M2 | 12 MD tayanch 9.31 bilan moslanmagan (Yechim) | Band 11. |
| M3 | 10-ekran 11-dars pitchini `davolar` dan qayta yig'ardi — yechim gapi (da'vo emas) yo'qolardi; 11-darsdagi Jonli demo bo'lagining sonli da'volari 12-darsda qayerga tushishi yozilmagan edi | 12-dars `pm-m10d11-pitch.bolaklar` ni o'qiydi (yakuniy matn); sonli da'volar — Raqamlar kartasi ostida «Zal so'rasa — javobingiz tayyor» (Mentor misolidagi zaxira javoblar naqshi). |
| M4 | 10-darsda «tuzatish» olgan son 12-darsda oldindan qo'yilardi | `tuzatishQator` `'bosh'` yoki `'royxat'` bo'lsa — qo'yilmaydi, o'rnida ogohlantirish (tayanch 9.43 i). |

## «Majburiy 9 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | Dalil modeli — 11-dars bilan bir | ✅ band 1 |
| 2 | Jami va haftalik qo'shimcha | ✅ band 2 |
| 3 | Grafik qoidalari — ustunli grafik doirasida | ✅ band 3 |
| 4 | `kunlar` / haftalik nuqtalar manbasi | ✅ band 6 |
| 5 | «Sonlarim hali yo'q» nomi | ✅ band 7 |
| 6 | `HtmlCompiler` dan o'qish | ⛔ «qur» (band 10; zaxira yozildi) |
| 7 | Jonli demo — real holatga aralashmasin | ✅ band 22, 23 |
| 8 | 12-ekran distraktori | ✅ band 28 |
| 9 | Juftlik qismi pilot | ⛔ «qur» (band 36) |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (18 band)
2, 3, 5–14, 16–18 — QABUL (tayanch 9.44). 1 — band 11 (M-q4). 4 — band 6. 15 — band 10.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| Mentor pitchi gaplari darsdan darsga bir xilmi | 11, 12, tayanch 1.11, 1.12 | 12 (Muammo, Keyingi qadam) · tayanch 1.12 |
| «Har e'lon bilan havola ulashiladi» | 12 MD + tayanch | 12 ×4 · tayanch 1.12; 11 — o'z gapi, mos |
| Dalilda majburiy raqam | 11, 12 | 12 (10-ekran maydoni va tekshiruvi) |
| `kunlar` ma'nosi | 10, 12, tayanch 8 | uchalasi |
| «Sonlarim hali yo'q» | 12 MD | 12 ×6 → «Grafikka nuqta yetmaydi»; 08 ×6 — boshqa holat (son haqiqatan yo'q): o'zgarishsiz |
| «Tuzatildi» yorlig'i qayta tekshiruvsiz | 12 MD | 12; 5-darsda allaqachon «Tuzatish qilindi» + qayta tekshiruv (05-FILTR) |
| «O'sish bormi?» · «eng kam bo'g'in» · «eslatma qaytardi» | 12 | 0 |
| Oldingi darsda «tuzatish» olgan son | 12 | M4 |

`lint:til` — 12 MD va tayanch: 0 error, 10 warn (hammasi avvaldan: bank iqtiboslari, «Ishlatilmaydi» ro'yxatlari); 12-dars: 0 error, 0 warn. `lint:prompt` ✓.

## Foydalanuvchiga
- Audit tugadi: 12 darsning hammasi Filtrdan o'tdi. Qaroringizni kutayotgan savollar GATE M sahifasining «Modul bo'yi» bo'limida — 12 ta (M-q0…M-q11; kod `12M-GATE-2`).
- Tayanchdagi o'z qarorim o'zgardi (Qaror-0 ga tegmaydi): 12-dars Mentor pitchining Muammo va Keyingi qadam gaplari 11-darsdagi bilan bir qilindi.
