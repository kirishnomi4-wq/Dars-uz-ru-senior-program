# 4-dars «Narxni qanday belgilaysiz?» — tashqi audit (ChatGPT) Filtr bilan, 07.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 5-dars MD bilan bog'liqlik) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-04/`. Tuzatish skripti: scratchpad `f04/tuzat04.py` (2 ko'p joyli + 47 juftlik; birinchi yurishda `m-104` soni 9 deb berilgan, aslida 11 — skript to'xtatdi, fayl yozilmadi, tuzatib qayta yurgizildi). F-1007-462.

Audit bahosi 6.5/10 (PM/pedagogika 8.5 · narx mantig'i 6.5 · o'z mahsuloti 5.5 · to'lov/Pro arxitekturasi 5 · xavfsizlik 5 · 90 daqiqa 3.5). Hukm: **Qabul 15 · Qisman 3 · Rad 7 · Allaqachon 7** (sarlavhalar qatori bilan).
⚠️ **Siz tasdiqlagan qarorlarga zid bandlar — o'zgartirilmadi, sizga aytiladi:** 9 (real foydalanuvchilar mashq Pro — **M-q3 A**) · 15–16 (Pro tugashi 5-darsda — **9.26**, takror yaratilish 12-darsda — **M-q4 A**) · 24 (huquqiy gap — **Qaror-0 6**) · 30 (nishon natijadan qat'i nazar — **M-q6 A** naqshi). Ulardan birortasini o'zgartirmoqchi bo'lsangiz — ayting.
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 9.28 (model boshqa o'quvchi — 1-band) · 1.4 do'kon gapi (22) · 8 — `pm-m11d4-narx.ishlaydi` va `pm-m11d7-hujjat` maydonlari `bool | null` (25) · 9.7, 9.23, 9.24 ga qo'shimchalar (7, 10–12, 14).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Reklama/B2B/tranzaksiya modelli o'quvchiga mahsulotida pullik obuna qurdirib, «modelingiz o'zgarmaydi» deyish — ziddiyat | **Qabul** | Haq: real foydalanuvchilarga boshqa model ko'rinib qolardi. Auditorning A varianti: amaliyot **alohida mashq ekranida** (menyuda yo'q, faqat o'quvchi ochadi) — asosiy ekranlar va model haqiqatan o'zgarmaydi. A1 «Ochish», `{qulaylik joyi}` namunasi, A-10, KOD 8, TS 15, tayanch 9.28. |
| 2 | Uch qator narxni formula bilan chiqarmaydi — buni ayting | **Qabul** | 2-ekran xulosasi: «Uch qator narxni formula bilan chiqarmaydi: Mentor ularga qarab 15 000 ni yangi taxmin qildi.» (93); O'qituvchi eslatmasi, kartochka 5 izohi, tayanch 1.4. |
| 3 | «xarajatni qoplaydi» muhri — mahsulotning hamma xarajatidek o'qiladi | **Qabul** | 1-dars Filtri bilan bir yo'l: muhrlar «Backend xarajatini qoplamaydi / zo'rg'a qoplaydi»; `QIzoh` «Hisobda faqat taxminiy Backend xarajati: hammasi olsa ham, u zo'rg'a qoplanadi.» (79); o'quvchi muhri «yozgan xarajatingizni qoplaydi». |
| 4 | 6 tashkilotchi — to'lovchi emas; «agar hammasi olsa» ko'rinib tursin | **Qabul** | Hisob qatori: «Agar 6 tashkilotchining hammasi olsa: 6 × 15 000 = 90 000 so'm» (2-ekran ikkala holati, KOD 4, tayanch 1.4). |
| 5 | Hookdagi «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067; 01-FILTR 11. |
| 6 | `POST /tolov/boshlash` — 3-dars muammosini yaxshi yopgan | Allaqachon | O'zgarishsiz. |
| 7 | `m-104` kabi ketma-ket raqam ochiq manzilda — keyingisini taxmin qilish oson | **Qabul** | Haq — xavfsizlikning eng muhim bandi. Raqam: `m-` + 12 tasodifiy belgi (A2 talabi va Yordam, REPO 2, 4-ekran O'qituvchi eslatmasi, kartochka 10, tayanch 9.7). Namuna `m-7f3a…` (11 joy). A2 tekshiruvi (4): o'ylab topilgan raqam (`?raqam=m-1`) ham «To'lov topilmadi.» |
| 8 | Mashq va real qatorlar `rejim` bilan ajralsin | **Rad** | 03-FILTR 5 sababi: kursda real qator yo'q (Qaror-0 5, 6); mashq raqami `m-` bilan ajraladi (tayanch 9.49). |
| 9 | Real foydalanuvchilarga mashq Pro yoqishni yopish | **Rad** | **GATE M M-q3 A** — siz «Ha — test rejimda hamma hisob» ni tanlagansiz. Auditor sababi (Pro olganlar ma'lumoti aralashadi) — hisobotda aytildi; O'qituvchi eslatmasi va TS 18 da qaror manbai yozildi. 1-band model boshqa o'quvchilar uchun bu holatni yumshatadi (ularda ekran menyuda yo'q). |
| 10 | Narx Backend'da bitta joyda bo'lsin | **Qabul** | A2 talabi: «Narx va muddat Backend'da bitta joyda turadi ({narx} so'm, {davr} kun) — summa shu joydan olinsin»; Mentor: `PRO_NARX = 15000`, `PRO_KUN = 30` (Yordam, REPO 2). Ilova ekranidagi narx bilan bir xilligi — A2 tekshiruvi (1) da allaqachon bor edi. |
| 11 | Webhook hisob va summani xabardan emas, boshlangan to'lov yozuvidan olsin | **Qabul** | A2 talabi: «Hisob va summa xabardan emas, alohida jadvaldagi shu raqam yozuvidan olinsin; raqam u yerda bo'lmasa yoki … mos kelmasa — `400`, hech narsa yozilmasin.» REPO 2, tayanch 9.23. |
| 12 | To'lov yozuvi va Pro uzayishi — bitta atomik ish | **Qabul** | A2 talabi: «To'lov yozuvi va Pro uzayishi bitta Database ishida bo'lsin: biri bajarilmasa, ikkinchisi ham bajarilmasin.» («tranzaksiya» so'zi ishlatilmadi — 2-darsdagi model nomi bilan aralashmasin, T-015.) 5-dars bilan bog'liqlik tekshirildi: Mentor repo'sidagi 1-muammo endi «agent talabni bajarmagan» deb tushuntiriladi (REPO 3) — 5-dars MD si (52, 374, 573) shunga mos, tuzatish o'sha yerda. |
| 13 | Faqat birinchi muvaffaqiyatli yozuv Pro'ni uzaytirsin | Allaqachon | Talabda bor edi: «To'lov **yangi yozilgan** va holati `tolandi` bo'lsa»; bir vaqtdagi ikki xabar — 3-dars talabi (UNIQUE → `200 { takror: true }`, F-1007-461). |
| 14 | Rad etilgandan keyin shu raqam bilan «To'lash» — semantika aniq bo'lsin | **Qabul** | «Bitta raqam — bitta natija: shu raqam bilan keyingi xabar (rad etilgandan keyingi «To'lash» ham) takror deb olinsin»; qayta to'lash — ilovada yangi «{tugma}» → yangi raqam (A2 talabi, O'qituvchi eslatmasi, tayanch 9.24). |
| 15 | Pro tugagach keyingi «Doimiy o'yin» yaratilmasligi hozirdan tekshirilsin | **Qisman** | Haq: talabdagi «Pro muddati tugagach o'zi to'xtasin» generatorni ham to'xtatadigandek o'qilardi. Lekin Pro tugashini 5-dars 1-amaliyoti quradi — **tayanch 9.26** (M-q0 A bilan tasdiqlangan); kurs davomida Pro 30 kun, 5-darsgacha tugamaydi. Talab endi aniq: «Pro o'zi to'xtasin (`GET /men` da `pro` yolg'on)»; A1 O'qituvchi eslatmasida «Doimiy o'yin» Pro tugaganda — 5-darsda. |
| 16 | `GET /oyinlar` yozuv yaratadi — REST ga zid, takror yaratilish | **Qisman** | Takror yaratilish — 12-dars topilmasi (**M-q4 A**), o'zgarmadi. Haq: «GET yozuv yaratadi» umumiy qoidadek qolmasin — A1 O'qituvchi eslatmasi va kartochka 11 izohi: «Odatda ro'yxatni so'rash yozuv yaratmaydi — bu kurs loyihasining sodda yechimi» (taymer bepul Backend'da ishonchsiz — tayanch 1.4 Mentor qarori). |
| 17 | A1 dagi tekshiruv o'yini real foydalanuvchilarga ko'rinadi | **Rad** | Bir necha daqiqa, maydon nomi «tekshiruv», faqat Mentor misolida, `WHERE id` bilan o'chiriladi; kursda alohida sinov muhiti (staging) yo'q, `namuna` o'yinlarni ro'yxatdan chiqaradigan qoida ham yo'q. Shubhali 10 da ochiq turibdi. |
| 18 | 5-ekrandagi «≈83 000» tugmasi Mentor sonini o'quvchiga sukut qiladi | **Qabul** | Tugmalar: «Bugun — 0 so'm» · «O'zim yozaman» · oxirida kulrang, kichik «Mentor misoli: Render — taxminan 83 000 so'm». KOD 7. |
| 19 | «Xarajat» — bu darsda oylik deb chegaralansin | **Qabul** | 5-ekran kirish qatori: «Xarajat — oyiga, xizmat sahifasidan, sanasi bilan; …» (81). Ta'rifning o'zi (tayanch 2) o'zgarmadi. |
| 20 | Raqobat ta'rifi — yaxshi | Allaqachon | O'zgarishsiz. |
| 21 | Qiymat qatorida «odam chaqirish» | Allaqachon | F-1007-460 da tuzatilgan (auditor eski nusxani ko'rgan). |
| 22 | «Ilova do'kon orqali tarqatilmaydi — shuning uchun …» umumiy sabab-qoidadek | **Qabul** | «Mentor ilovasi do'kondan tarqatilmaydi; bu kursda mashq to'lov brauzerda ochiladi.» (82); kartochka 8; tayanch 1.4 (tasdiqlangan matn — aytildi). |
| 23 | Do'kon qoidalari — joriy rasmiy sahifadan qayta tekshirilsin | **Qabul** | ⛔ «qur» oldidan sana bilan (4-ekran O'qituvchi eslatmasi, Shubhali 6). |
| 24 | Huquqiy gap haddan tashqari qat'iy | **Rad** | Qaror-0 6 so'zma-so'z (03-FILTR 27). |
| 25 | `ishlaydi: false` ikki ma'noli — `null` kerak | **Qabul** | `ishlaydi: true \| false \| null` — 5-ekranda `null` (A-12, 5-ekran, KOD 7, A2 tekshiruv kartasi, tayanch 8). O'quvchi: faqat 5-dars, «`true` bo'lmasa» shaklida (05 MD 201) — mos. Sinf: tayanch 8 dagi `pm-m11d7-hujjat` maydonlari ham `bool \| null` ga (07 MD allaqachon shunday edi — 07 MD 623). |
| 26 | Hisob qatorida `soniManba` ko'rinsin | **Qabul** | «Hammasi to'lasa ({manba}): …» — «Neon soni» yoki «taxmin» (5-ekran, KOD 7). |
| 27 | Pul topmaydigan o'quvchi uchun `narx: null` | **Rad** | Narx bu kursda doim taxmin (yorlig'i bilan, 6-darsda tekshiriladi); 4-dars — narx darsi (Qaror-0 2). 2-dars hookidagi «Hali bilmayman» — modelgacha; model tanlangach narx taxmini yoziladi. |
| 28 | A1/A2 bo'linishi — yaxshi | Allaqachon | O'zgarishsiz. |
| 29 | «Bugun bitta yo'l tekshirildi» — halol | Allaqachon | O'zgarishsiz. |
| 30 | «Test Payment» nishoni faqat `true` da | **Rad** | 3-dars M-q6 A bilan bir naqsh: nishon qilingan ishni aytadi («Mashq to'lovdan keyin qulaylik ochilishini o'zingiz tekshirdingiz»), natija emas. |
| 31 | 90 daqiqa — 130–160; «Doimiy o'yin» Backend mantiqini 5-darsga suring | **Qisman** | O'lchanmagan baho — ⛔ pilotda taymer. Tuzilmani surish (Qaror-0 2, 4-qator; 9.26) — sizning qaroringiz: Shubhali 3 ga yozildi, pilotdan keyin hal qilinadi. |
| Sarl. | Sarlavhalar | Allaqachon | Auditor tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–25 | — | 2–4, 6–9, 11–13, 17 (manba bilan), 19 — auditor qabul qildi; 1 — Rad (5); 5 — Qabul (4); 10 — Qisman (15–16); 14 — Rad (17); 15 — Qabul (1); 16 — Qabul (25); 18 — Rad (9, M-q3 A); 20 — Rad (24). Holat qatorlari MD da. |
| TS+ | Auditorning yangi savollari 21–27 | Javob berildi | 21 → tasodifiy, `m-` + 12 belgi · 22 → ha, `boshlangan_tolovlar` · 23 → bitta Database ishida · 24 → `m-` raqam (ustun yo'q) · 25 → `null` · 26 → 5-dars 1-amaliyotida, `GET /oyinlar` dagi yaratishda (9.26) · 27 → alohida mashq ekrani. |

## Sinf-supurish (12 MD + tayanch)
- **Ketma-ket mashq to'lov raqami manzilda** — 05–12 da `m-10x`, «navbatdagi raqam» — 0 (3-dars sahifasidagi ketma-ket raqam 4-darsda almashadi — tayanch 9.49, 9.50).
- **«xarajatni qoplaydi» kabi chegarasiz muhr** — 05–12 da 0.
- **Tekshirilmagan holatni `false` bilan saqlash** — tayanch 8: `pm-m11d4-narx.ishlaydi` va `pm-m11d7-hujjat` (`savol`, `havolalar`, `chiqdi`) → `bool | null`; `pm-m11d5-buzish.tuzatishQilindi` — ish fakti (`false` = qilinmagan), sinf emas.
- **«Do'kon orqali tarqatilmaydi — shuning uchun»** — 05–12 da 0.
- **Model boshqa o'quvchi** — 05 1-amaliyoti 4-darsdagi `{pullik qulaylik}` ustiga quradi (05 MD 206) — alohida mashq ekranida davom etadi; boshqa darslarda «eng yaqin qulaylik» gapi yo'q (grep).

## Tekshiruv
- `lint:til`: 04 — TOZA · tayanch — 0 error, 25 warn (o'zgarmagan).
- `qisqa.py` 04: 12 ekran (skript A1/A2 sarlavhasini sanamaydi — 10), arena 3/3/3/3, sarlavha >55 yo'q.
- O'lchov bo'limidagi 4 qator (2-ekran xulosa 93, `QIzoh` 79, 4-ekran joriy qator 82, 5-ekran kirish qatori 81) Python `len` bilan yangilandi. ✔ o'rinlari o'zgarmadi.
