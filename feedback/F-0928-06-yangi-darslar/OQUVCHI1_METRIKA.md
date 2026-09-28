# 👦 1-o'qish — PmMetricsLesson (2026-09-28) · niyat-moslik 15/18
- s1 (742): sarlavha «to'rt raqam», 4 qator «?», gap «ikkitasini» — sanoq zid tuyuladi.
- s5 (942): qator nomi «Keragini olganlar: 4» ↔ karta nomi «Bosh raqam» — bir narsami?
- s7: «Foizni hisoblash» tugmasi avval ishlamaydi (A/B tanlov pastda — tartib); sarlavha «…qaytgan bo'lardi?» (1050) — Mentor izohi tanlovdan keyin yo'qoladi.
- 🔴 s8: TO'G'RI VARIANT javobni o'zi aytadi («50 foiz, birinchisida 25») — hisoblamasdan topiladi (159/17 javob-sizishi).
- s10: «foyda» (1353) — pulmi?; «Bot buni qachon biladi» (1320) — vaqtmi, voqeami?; 4-karta «O'z raqamingiz» — nima yozish noaniq (BILMADIM).
- s12: `includes`, `push`, `kun: 1` dars matnida izohsiz; «foiz 40%» qayerdan — kechagilar 5 ta ekani ko'rinmaydi.
- «foiz» s5 da izohidan (s7) oldin.

## 🎓 Metodist javobi (2026-09-28)
| # | Topilma | Hukm | Nima qilindi |
|---|---|---|---|
| 1 | s1 «to'rt raqam» ↔ «ikkitasini» | TUZATILDI | Mentor: «Pufakdagi to'rt qatorning ikkitasini dars oxirida botingiz /stat buyrug'i bilan o'zi sanaydigan bo'ladi.» |
| 2 | s5 «Keragini olganlar» ↔ «Bosh raqam» | TUZATILDI | Karta-izoh: «"Keragini olganlar" soni — botning eng muhim raqami. Uni bosh raqam deymiz.» |
| 3 | s7 tugma-tartib / yo'qolgan izoh | TUZATILDI (matn) | Qulf-tugma «Avval pastda tanlang»; Mentor endi yo'qolmaydi: tanlovgacha «Avval pastda A yoki B ni tanlang», keyin foiz izohi; sarlavha «Qaysi holat yaxshiroq: 8 odam yoki 4 odam?». Bloklar tartibi (tanlov pastda) — Quruvchiga |
| 4 | 🔴 s8 to'g'ri variant javobni aytadi | TUZATILDI | Variantlar faqat ma'lumotni takrorlaydi, bir qolipda: «Ikkinchi kunda — 6 odamdan 3 tasi» / «Birinchi kunda — 20 odamdan 5 tasi» / «Ikkala kunda teng — har kuni qaytgan bor». correctIdx=0 o'zgarmagan |
| 5 | s10 «foyda» | TUZATILDI | Chek-band «Bosh raqam — keragini olganlar» |
| 6 | s10 «Bot buni qachon biladi» | TUZATILDI | «Nima bo'lganda sanaladi:», need/msg/done-mini shunga moslandi («… sanaydi») |
| 7 | s10 4-karta noaniq | TUZATILDI | Placeholder «Masalan: Menyu bosganlar» va «Masalan: «Menyu» tugmasini bosgan odamlar» |
| 8 | s12 includes/push/kun izohsiz, 40% qayerdan | TUZATILDI | Kod-izohlari: «kun: 1 — kecha, kun: 2 — bugun», «includes — ro'yxatda bormi? push — ro'yxatga qo'shadi», «(kecha 5 kishi: 2 ÷ 5 × 100 = 40)»; Qo'shimcha-band ham 5/2 ni aytadi |
| 9 | «foiz» s5 da izohsiz | TUZATILDI | s5 izohi: «… qaytganlar foizi (foiz — har yuztadan nechtasi)» |

Quruvchiga: s5 oxirgi karta + xulosa birga ~440 grafema, s7 tanlovdan keyin ~438 (s7 «Tanlovingiz yozildi» satri Mentor bilan takrorlanadi — olib tashlash taklifi); s7 A/B tanlovini hisob-kartalardan tepaga ko'chirish.

## 🎓 Metodist — 2-aylanish (2026-09-28)
| # | Topilma | Hukm | Nima qilindi |
|---|---|---|---|
| 1 | s10 chek-band «Har raqamda «qachon» bor» ↔ yorliq «Nima bo'lganda sanaladi:» | TUZATILDI | ««Nima bo'lganda» tanlangan» |
| 2 | s14 «bot uni qachon biladi?» + placeholder + MentorNote | TUZATILDI | «… va u nima bo'lganda sanaladi?», placeholder «Bosh raqamim — ..., u ... bo'lganda sanaladi» |
| 3 | s13 izoh (2-variant) noto'g'ri variantni ma'qullagandek | TUZATILDI | «6 — faqat bugun kelganlar soni. Odamlar qaytyaptimi — buni foiz aytadi: yuztadan atigi 5 tasi.» |
| 4 | s7 tanlov pastda + «Tanlovingiz yozildi» takror | TUZATILDI | A/B tanlov bloki kartalar TEPASIGA ko'chdi; satr olib tashlandi; «Avval yuqorida tanlang»; «→» olib tashlandi (43-qonun) |
| 5 | EKRAN ≤400 | TUZATILDI | s5 (oxirgi karta + xulosa): 435 → 388/389/396 (oxirgi karta kerak/qayt/bugun) · s7 (ikkala hisob): 491 → 387, tanlovdan keyin 330 · s10 boshlang'ich: 511 → 370, chip bosilgach 398 · s14: 223 |
| 6 | Uy vazifasi «INSERT» | OQLANDI | m5-04 BotStatefulMemoryLesson da INSERT «yangi qator qo'shish» deb o'rgatilgan (19 marta); gapning o'zi «bazaga yozuv qo'shing (INSERT)» — gloss yetarli |
| 7 | Kartochka «qaytgan hisoblanadi» (kant-hisoblanadi) | TUZATILDI | «Odam qachon «qaytgan» deb sanaladi?» |

O'lchov: `scripts/ekran-belgi.mjs` (CLICK bilan holatlar).
