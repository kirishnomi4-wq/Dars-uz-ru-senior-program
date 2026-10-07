# 6-dars «Bitiruvgacha nimani qachon qurasiz?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 6.5/10 (pedagogika 8.5 · roadmap logikasi 7 · RICE aniqligi 6 · continuity 6). Hukm: **Qabul 15 · Qisman 6 · Rad 0 · Allaqachon / o'zgarishsiz 7**.
Tekshirilgan manbalar: MD o'zi (grep) · tayanch 1.5, 8 · 5-dars MD (`keyin` maydoni) · 11, 12, 14, 15-dars MD lari (`pm-m9d6-roadmap` qanday o'qiladi: `ishlar[hozir[k]].nom`) · App.jsx (11, 12, 14 — loyiha kunlari).
Zaxira: scratchpad `md06/06-oldin-filtr.md`, `md06/05-oldin-06filtr.md`, `md06/tayanch-oldin-06filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Hozir» = 3 — mahsulot qoidasi emas, kurs sig'imi | **Qisman** | Matn allaqachon sababni aytardi («11-Modulda funksiya uchun uchta loyiha kuni»); endi o'quvchi matnida «Bu modulda …» (10-ekran ikki xabari, kartochka, yakun, recap 12), O'qituvchi eslatmasi: «kurs sig'imi, roadmap'ning umumiy qoidasi emas»; tayanch 1.5, 9.68. |
| 2, 20 | 12-ekran: yangi ishni «Hozir»ga kiritib, funksiyani surish PRD ni buzadi; 10-ekran bilan zid | **Qabul** | Savol: «PRD da yo'q yangi ish RICE da birinchi chiqdi. Avval nima qilasiz?»; ✔ A «Avval PRD dagi uchta funksiyani qayta ko'raman» (45); D — eski «surish» javobi endi xato («Surish mumkin, lekin avval PRD qayta ko'riladi.»); to'g'ri izohi «Roadmap PRD dan ajralmaydi: …»; recap 12 va `Q_LABELS` «PRD va roadmap». ✔ o'rni (A) o'zgarmadi. 10-ekranda «Keyin»dagi ish «Hozir»ga qo'yilsa — «Bu ish PRD dagi uchtasidan emas — PRD ni ham yangilang.» |
| 3 | «12-Modulni kutadi» — modul nomi bog'liqlik emas | **Qisman** | Sabab-qatorlar allaqachon texnik qismni aytadi («telefonga eslatma yuborish — 12-Modul ishi»); 5-ekran to'g'ri izohi: «… — unga kerak qism 12-Modulda o'tiladi.» |
| 4 | «Roadmap — bitiruvgacha uch ufqli reja» — umumiy ta'rif emas | **Qabul** | «Roadmap — qaysi ish qaysi ufqda turishini ko'rsatadigan reja; bizda — bitiruvgacha uch ufq.» (A-3, kartochka, yakun); 4-ekran xulosasi («shunday uch ufqli reja …») qoladi — misolga bog'langan. |
| 5 | «Maydon pulini bo'lishish → Uzoqroq»: sabab doiraviy | **Qabul** | Sabab: «Muammo gapidan kelmaydi: bitiruvgacha ishlar jamoa yig'ishga qaratilgan.» — 5-dars Mentor tekshiruvi bilan bir mezon (05-FILTR 9); tayanch 1.5 ga yozildi (TAYANCHGA SAVOL emas — tayanch qarori). |
| 6 | Ishonch 50 / 80 sabablari yo'q | **Qabul** | Formula kartasi ustida «Mentorning taxmini» yorlig'i; O'qituvchi eslatmasi va tayanch 1.5: qo'shilish 80% (1, 2, 3, 5-yozuvlar) · tasdiq 50% (o'yin kuni bosishi — taxmin) · chiqish va navbat 80% (oxirgi daqiqada kelmaganlar — 1, 2, 5). |
| 7 | Ishonch shkalasi — «bu kursda» | **Qisman** | 6-darsda shkala izohi yo'q (faqat 100 · 80 · 50 tugmalari); izohli yagona joy — 100% ogohlantirishi: «Bu kursda 100% — o'lchangan raqam uchun. Dalilingiz bormi?» (02-FILTR 1 bilan bir). |
| 8 | Qamrov «5 barobar» chegarasi — o'zboshimcha | **Qabul** | Olindi; O'qituvchi eslatmasi: «qamrovda son chegarasi yo'q» (02-FILTR 10 bilan bir). |
| 9 | Mehnat > 6 hafta — kurs doirasi | **Qabul** | «Bu modulda bitta ishga 6 haftadan ko'p — bo'lsa bo'ladimi?» (57). |
| 10, 11 | Juftlikda «25% gacha — yaqin» va «yaqin = ishonchliroq» | **Qabul** | Foiz chegarasi va hukm olindi: farq qilgan katak accent; xulosa — sonlar bir xil: «Baholaringiz bir xil chiqdi; baribir RICE — taxmin.» · farq bor: «Bir ishga ikki xil RICE chiqdi: qaysi bo'lakda farq bor — dalilga qayting.»; qizil rang yo'q; «✎ Raqamni tuzatish» — ixtiyoriy, kulrang; statistika «Bir xil · Farq bor»; kartochka; tayanch 9.69. |
| 12 | Uyga vazifa: bitta odamning javobi RICE ni o'zgartirmasin | **Qabul** | ② «Javobini yozib oling. Tartibingizdan farq qilsa, «Nega?» deb so'rang — RICE ni faqat yangi dalil chiqsa tahrirlang (✎).» |
| 13 | `pm-m9d5-prd.keyin` matn — bo'lish mo'rt | **Qabul** | 5-dars 9-ekran: «Keyin» — 1–3 qisqa qator (har biri ≤ 40, «+ Yana ish»), kalit `keyin: [1–3]`; 6-dars har birini alohida karta qiladi; tayanch 8, 9.70. |
| 14 | `hozir` — indeks emas, barqaror id | **Qisman** | 11, 12, 14, 15-darslar `ishlar[hozir[k]]` ni o'qiydi; id ga o'tish to'rt darsni o'zgartiradi. Auditorning ikkinchi yo'li olindi: `ishlar` tartibi 6-darsdan keyin o'zgarmaydi — o'chirish yo'q, yangi ish oxiriga (KOD 10, tayanch 8). |
| 15 | Poydevor RICE ga kirmaydi — sababi aniqroq | Allaqachon | Sabab aytiladi: «busiz hech bir funksiya ishlamaydi» — bu misoldagi bog'liqlik. |
| 16, 17 | Uzum: «avval Backend» umumiy qoida bo'lmasin; «saytdan emas» — sayt yo'q degani emas | **Qisman** | O'qituvchi eslatmasi: «"Saytdan emas" — sayt bo'lmagan degani emas (2/3 sahnada ilova ham bor): birinchi tayyorlangan narsa — yetkazib berish. Bu har mahsulotda «avval Backend» degani ham emas.» Mentor gapi — bank so'zi, qoladi. |
| 18 | Uzum bashorati «ertasi kuni» — PM ga kam xizmat | O'zgarishsiz | Auditor ham «qolsin» degan. |
| 19 | «Hozir»da uchtadan kam — bloklash | **Qisman** | Bloklash qoladi — kurs talabi (uchta loyiha kuni, dastur), endi shunday aytiladi: «Bu modulda uchta loyiha kuni — «Hozir»ga uchta ish qo'ying.» |
| 21 | «tartib» so'zi | O'zgarishsiz | Auditor tasdiqladi. |
| 22 | Ufq sababini saqlash | **Qabul** (qisman shaklda) | Har ishga majburiy maydon emas (ekranda ≤3 blok): yumshoq ogohlantirish chiqqanda (asosiy funksiya «Hozir»dan tashqarida yoki «Keyin»dagi ish «Hozir»da) ostida «Sabab» qatori → `ishlar[].sabab` (15-dars risklari uchun). |
| 23, 24 | `kutadi` — faqat Mentor ma'lumotida · kod `ufq()` bog'liqlikni ko'radimi | Allaqachon | `kutadi` o'quvchi kalitiga kirmaydi; `ufq(ish, hozirSoni)` birinchi `kutadi` ni tekshiradi (Yordam: `if (ish.kutadi === "12-Modul") return "keyinroq";`) — faqat RICE chegarasi bilan ajratmaydi. |
| TS 1–11 | Agent savollari | Qabul / yopildi | MD «TAYANCHGA SAVOL» holat qatori: 1 — massiv · 3 — kurs sig'imi · 4 — sabab · 5 — ishonch sabablari · 6 — «N-Modul» (kurs bo'yi, 06.10 tunda) · 9 — `turi`, `sabab`, `savedAt` · 11 — tayanch 1.5. |

**Sinf-supurish:** «Hozir»ga uchta — 11, 12, 14, 15-darslar «1/2/3-asosiy funksiya» yorlig'i bilan (dars nomlari) — o'zgarish shart emas · foiz chegaralari — 16 MD da boshqa yo'q (2-dars 1000 va 6-dars 5×, 25% olingan) · `keyin` matnini bo'lish — faqat 6-dars.

Tekshiruv: `lint:til` 05, 06 — 0 · o'zaro tekshiruv — arena 3/3/3/3, «Keyingi dars» mos.
