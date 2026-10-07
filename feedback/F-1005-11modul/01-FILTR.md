# 1-dars «O'nta g'oyani qayerdan topasiz?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 7.5/10 (pedagogika 9 · 11-Modulga kirish 9 · PM aniqligi 7 · continuity 6.5). Hukm: **Qabul 5 · Qisman 3 · Rad 3 · Allaqachon / o'zgarishsiz 12**.
Tekshirilgan manbalar: MD o'zi (grep) · 9-Modul kodi `src/7-Modull/PmProductProblemLesson.jsx:703` (Mentor ro'yxati, «eski darsliklar» yozuvi) ·
`src/7-Modull/PmInterviewMvpLesson.jsx:651`, `MvpCompleteLesson.jsx:550` («Keyin» qutisi: To'lov · Jamoa yig'ish · Eslatma; To'lov sababi — «Pul haqida bitta yozuv bor») ·
`PM_Prompt_v8.md:259` (K18 bank matni) · tayanch 1.1, 8, 9.20–9.26 · 2-dars MD (uyga vazifa qog'ozi, «kamida 5 tanish»).
Zaxira: scratchpad `md01/01-oldin-filtr.md`, `md01/tayanch-oldin-01filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Darsda 10 g'oya» va «uyda 10 taga yetkazing» zid | **Qisman** | Ziddiyat yo'q edi, lekin MD da aniq yozilmagan edi: yakka rejimda 8-ekran «Davom etish» 10 / 10 gacha yopiq («Yana N ta g'oya yozing»); jonli darsda Mentor ≈20 daqiqadan keyin juftlikka o'tkazadi (`optionalLive` — jonli dars oqimini o'quvchi to'xtatmaydi). Endi A-1 da «O'nta — darsda» qoidasi yozildi; uyga vazifa ① shartli: «Ro'yxatda o'ntadan kam bo'lsa — o'ntaga yetkazing.»; dars ipidagi yakun qatori aniqlandi. Qattiq 10/10 darvoza jonli darsda — **rad** (jonli darsni Mentor boshqaradi, skelet standarti). |
| 2 | 9-ekran: «sherik boshqa muammo aytdi → muammoni aniqlashtiring» noto'g'ri xulosa | **Qabul** | Haq: darsning o'z xulosasi va O'qituvchi eslatmasi «g'oya yomon degani emas» deydi, lekin qizil chiziq va «✎ Muammoni aniqlashtirish» tugmasi buning aksini ko'rsatardi. Tugmalar belgisiz «Bir xil» · «Boshqacha»; «Boshqacha» → sherik aytgan muammo kartaga ikkinchi qator bo'lib tushadi, ikkala muammodan bitta Yechimga ikki chiziq — **bitta yechim, ikki muammo**; qizil rang va tahrir yo'q (KOD 9 da ham). Xulosa: «Bitta yechim bir nechta muammoga mos kelishi mumkin — shuning uchun g'oyada muammo alohida yoziladi.» (100). O'qituvchi savoli: «ikkalasi ham shu yechimga mos keladimi?». Arena 10 va kartochka 10 o'zgarmadi (allaqachon to'g'ri xulosa). «Uch qismni o'qib, muammo qatori tushunarlimi» bosqichini qo'shish — **rad** (bir ekran — bir ish, P-008). |
| 3 | Uyga vazifa ② shu xatoni takrorlaydi | **Qabul** | «② Bitta g'oyangizni uydagilardan biriga faqat yechim bilan o'qing va u aytgan muammoni qog'ozga yozing. Keyin uch qismni birga o'qing — ikki muammoni solishtiring.» — avtomatik «muammom noto'g'ri» xulosasi yo'q. |
| 4 | 4-ekran: «Eski darsliklar» manbasi (kimga berishni bilmaydi) ≠ kartadagi muammo (yangi darslik qimmat) | **Qabul** | Haq — 9-Modul Mentor yozuvi: «Eski darsliklarni kimga berishni bilmay, o'quvchilar ularni uyda yillab saqlaydi.» 6-g'oya muammosi: «eski darsligini kimga berishni bilmaydi, u uyda yillab turadi» (tayanch 1.1, 4-ekran 2-qadam, 10-ekran kod yozuvi). Audit taklifini aynan olmadim: u holda 5-g'oya («o'qib bo'lgan kitobini kimga berishni bilmaydi») takror bo'lardi → 5-g'oya: «yangi kitob qimmat — o'qimoqchi bo'lganini ololmaydi» (almashish ro'yxati shu muammoga javob). 2-dars saralashi o'zgarmaydi (5 — ✕ real auditoriya, 6 — ✕ bajariladimi). |
| 5 | «Keyin»dagi to'lov → «pulni bo'lishish» to'g'ridan emas; manba = «Keyin» + intervyu | **Qabul** | Tasdiqlandi: 9-Modulda «To'lov» «Keyin»ga shu sabab tushgan — «Pul haqida bitta yozuv bor». 4-ekran 1-qadam: «to'lov» chipi ko'tarilganda ostida dalil-chip «9-Modul intervyusi: 5 kishidan 1 tasi «pulni bo'lishish qiyin»» chiqadi va ikkalasi birga kartaga uchadi (oldin dalil tanlovdan keyin chiqardi). Mentor jadvalida manba: «Keyin» qutisi + 9-Modul intervyusi (1 / 5); tayanch 1.1 tepasi. |
| 6 | G'oya ta'rifi — MD varianti; «Bu darsda g'oyani uch qism bilan yozamiz» | **Qisman** | Ta'rif allaqachon modul bo'yi qabul qilingan (tayanch 9.20, so'zma-so'z — T-042). «Bu darsda…» shakli — **rad**: ta'rif 2–4-darslarda ham shu so'zlar bilan ishlatiladi; «bu misolda» (T-043) misoldagi da'vo uchun, atama ta'rifi uchun emas. |
| 7 | «Asoslangan» = manba chipi; isbot emas | **Qisman** | O'quvchi matnida «asoslangan» so'zi yo'q (grep) — faqat MD A-1 da. A-1: «har g'oyada muammo qayerdan kelgani ko'rsatilgan … bu isbot emas, dalil 3–4-darslarda intervyu bilan yig'iladi». Yangi «dalil» maydoni — qo'shilmadi (auditor ham majburiy demadi). |
| 8 | `manba` maydonini saqlash | Allaqachon | Tayanch 8: `{ muammo, kim, yechim, manba }`. |
| 9 | `pm-m7d3-mvp.keyin` ni o'qish | Allaqachon | Tayanch 8 (1-dars «Keyin» qutisi), topilmasa — qo'lda. |
| 10 | `nom` maydoni hozir kerak emas | Allaqachon | Tayanch 8 — `nom` yo'q; 2-dars o'quvchi g'oyasini yechimning qisqa ko'rinishi bilan ko'rsatadi. |
| 11 | «Maydon Jamoa» 1–3-darslarda yo'q | Allaqachon | 9.23. |
| 12 | «Jamoa yig'ish» ortiqcha ustun — 2-ekranga «to'liq yozildi, lekin hali tanlanmadi» | **Rad** | O'quvchiga allaqachon aytiladi: 4-ekran `QIzoh` («…ikki g'oya ham ro'yxatda boshqalar bilan teng turibdi»), 8-ekran Mentori («bugun g'oyalar baholanmaydi»), 11-ekran testi, kartochka 7. 2-ekran — ta'rif ekrani; yana bitta qator — TMI (109-qonun), ekranda ≤3 blok. |
| 13 | 4-ekranda avtomatik kirgan 6 g'oyada manba chipi | Allaqachon | Ro'yxat qatori: nom · manba chipi · ›; bosilsa uch qism ochiladi. |
| 14 | Starbucks — «proof» emas, ko'prik shu darajada | Allaqachon | Ko'prik: nom emas — kim uchun va nima uchun; bankdan tashqari fakt yo'q. |
| 15 | «Ichimlik uchun emas» mutlaq eshitiladi | **Rad** | Bank matni aynan: «Люди платят не за напиток, а за место и атмосферу.» (`PM_Prompt_v8.md:259`, PM-018 — keys faqat bank so'zi bilan). Auditor ham «bank bilan to'qnashsa — tegmang» degan. |
| 16, 17 | 3 va 5-ekran testlari | O'zgarishsiz | Auditor tasdiqladi. |
| 18 | 8-ekran tekshiruvi yumshoq, bloklamasin | Allaqachon | Faqat bo'sh qator bloklaydi; qolgani ikkinchi «Saqlash» bilan o'tadi. |
| 19, 20 | 10-ekran kod mashqi; «Kompilyatorni ochish» + Mentor «kod oynasi» | O'zgarishsiz | Auditor tasdiqladi. |
| UV ③ | Bitta tanish ≠ 5 tanish | Allaqachon | 2-dars «kamida 5 tanish» so'raydi; qog'oz — boshlanishi (2-dars MD 48, 294-qatorlar). |
| Sarl. 10 | «Yozuvlardan karta qanday chiqadi?» | **Rad** | PM-082(a): PM kod ekrani sarlavhasi — «…digan kod yozamiz» oilasi (korpus §19, §48); auditor ham majburiy demadi. |
| TS 3 | «Yo'qoldi: sumka / Tanaffusda ko'rdim» tayanchda yo'q | **Qabul** | Tayanch 1.1 tepasiga yozildi (9-g'oya kuzatuvi) — o'zboshimcha emas, kelishuv. |
| TS 1–13 | Qolgan qarorlar | Allaqachon | MD «TAYANCHGA SAVOL» bo'limiga holat qatori: hammasi tayanch 9.20–9.26, 1.1, 8 va GATE M bilan yopilgan. |

**Sinf-supurish:**
- «boshqacha tushundi → o'zingiznikini tuzating» — 16 MD: faqat 1-dars (9-ekran, uyga vazifa ②, KOD 9). 13-dars «talabni aniqlashtirib» — sinovdagi to'xtash (kuzatuv dalili), boshqa holat.
- 5, 6-g'oya matni — 16 MD + tayanch: faqat 1-dars va tayanch 1.1; 2-dars faqat nomlar bilan.
- «pulni bo'lishish» dalili — 5-dars allaqachon «Keyin» + 9-Modul intervyusi 1 / 5 bilan (05 MD 66, 256, 587) — mos.

Tekshiruv: `lint:til` 01 — 0 · o'zaro tekshiruv 01 — arena 3/3/3/3, «Keyingi dars» mos · 15 ekran o'zgarmadi.
