# P2 — matn takliflari (darsga TEGILMAGAN — foydalanuvchi tasdig'i bilan)

Manba: P2 partiyasini ulash paytida (18.09 tun) ekranni o'qib topilgan joylar. Taklif yozishdan oldin `MATN_KORPUS.md`
§63 (48 belgi), §133 (nishon-desc rost), §183, §184 o'qildi. Adabiy til, siz-forma.

## 1. Javobni urinishdan OLDIN aytadigan joylar (151-qonun: «birinchi urinishda to'g'ri» sharti ma'nosiz bo'lib qoladi)

| Dars · ekran | ❌ hozirgi (aynan iqtibos) | ✅ taklif | Sabab |
|---|---|---|---|
| JsConditions · s14 · Mentor | «AI kod yozdi, lekin xato qilibdi: PIN-kod **1111** bo'lsa ham telefon ochilyapti! Shartda **bitta teng belgisi** turibdi — u qiymat soladi, **tekshirmaydi**. Xato qatorni toping.» | uz: «AI kod yozdi, lekin xato qilibdi: PIN-kod **1111** bo'lsa ham telefon ochilyapti! Qaysi qatorda xato? Toping va bosing.» · ru: «AI написал код, но ошибся: даже с PIN-кодом **1111** телефон открывается! В какой строке ошибка? Найдите и нажмите.» | Mentor xato qatorni ham, sababini ham oldindan aytadi. «=» / «==» tushuntirishi topilgandan keyingi blokda (`frame-warn`) allaqachon bor — u yerda qoladi. O'ng ustundagi eslatma («shartda tenglik == bilan tekshiriladi. Qaysi qatorda = noto'g'ri ishlatilgan?») qoladi: ikkala qatorda ham «=» bor — haqiqiy tanlov |
| JsConditions · s14 · audio | «…noto'g'ri PIN-kod bilan ham telefon ochilyapti. Shartda bitta teng belgisi turibdi — u qiymat soladi, tekshirmaydi. Xato qatorni toping va bosing.» | «…noto'g'ri PIN-kod bilan ham telefon ochilyapti. Qaysi qatorda xato? Toping va bosing.» | Mentor bilan bir xil sabab |
| JsConditions · s14 · kod-ko'rinish | `if (pin = 1234) { ochildi } // ?` — «`// ?`» belgisi | belgini olib tashlash | Matn emas — kod-ko'rinishidagi ko'rsatkich: xato qatorni belgilab turadi |
| JsLoops · s14 · Mentor | «…lekin u **cheksiz** aylanyapti! Sir **qadam** qismida yashiringan. Diqqat bilan o'qing: i 5 ga **yaqinlashyaptimi**? …» | uz: «AI 1 dan 5 gacha sanaydigan sikl yozdi, lekin u **cheksiz** aylanyapti! Diqqat bilan o'qing: i 5 ga **yaqinlashyaptimi**? Xato qismni toping va bosing.» · ru: «ИИ написал цикл, считающий от 1 до 5, но он крутится **бесконечно**! Читайте внимательно: i вообще **приближается** к 5? Найдите ошибочную часть и нажмите на неё.» | «Sir qadam qismida» — javob. Savol («yaqinlashyaptimi?») o'quvchini to'g'ri qismga o'zi olib boradi |
| JsLoops · s14 · xatodan keyingi izoh | «Bu qism to'g'ri. … Xato esa **qadam** qismida — i qaysi tomonga o'zgaryapti?» | uz: «Bu qism to'g'ri. … Xato boshqa qismda — i qaysi tomonga o'zgaryapti?» · ru: «Эта часть верна. … Ошибка в другой части — в какую сторону меняется i?» | Birinchi xatodan keyin nishon baribir yo'q, lekin ikkinchi urinish tanlov bo'lib qolsin (qolgan ikki qismdan) |
| PracticeLesson3 · s5 · Mentor | «Uy poydevordan quriladi: avval mahsulotlar, keyin narx, so'ng chiroyli ko'rinish. Bo'laklarni **sudrab** qurilish tartibiga joylang.» | uz: «Uy poydevordan quriladi. MVP'da poydevor qaysi qadam? Bo'laklarni **sudrab** qurilish tartibiga joylang.» · ru: «Дом строится с фундамента. Какой шаг в MVP — фундамент? **Перетащите** блоки в порядок стройки.» | Mentor tartibni to'liq aytadi; slot-maslahatlari («poydevor — eng avval», «eng oxirida — bezak») metafora darajasida qoladi |

## 2. Rost bo'lmagan nishon-tavsifi (§133)

| Dars · nishon | ❌ hozirgi | ✅ taklif (uz · ru) | Sabab |
|---|---|---|---|
| JestUnitTest · `fakeTestHunter` (s15) | «Yolg'on testni topdingiz — expectsiz» · «Нашли ложный тест — без expect» | «Haqiqiy testlarni yolg'onlardan ajratdingiz» (43 belgi) · «Вы отделили настоящие тесты от ложных» | O'quvchi HAQIQIY testlarni tanlaydi (yolg'onni bossa — xato); uchta yolg'on test turli xil (expect'siz · noto'g'ri etalon · console.log), «expectsiz» faqat bittasi. Qo'shni EdgeCases s15 tavsifi aynan shu qolipda |

Nishon kaliti o'zgarmaydi — faqat `desc` (katalog qayta yaratiladi, server-deploy bilan).

## 3. Matn emas — dizayn/qaror uchun eslatmalar (tunda tegilmagan)

- **EdgeCases s9 · Jest s9:** bloklar havzasi aralashtirilmagan — to'g'ri uch blok tartib bilan birinchi turadi, Mentor
  ham tartibni aytadi; to'g'ri blok bosilsa o'zi o'z qatoriga tushadi. Xato faqat chalg'ituvchi blokda. Taklif: havzani
  aralashtirish (kod, matn emas) — nishon qiymati oshadi.
- **NestArchPractice s19:** hali bosilmagan da'volar `tap-hint` bilan yonadi, bosilgan to'g'ri da'vo «✓» oladi —
  «hammasini bittalab tekshir» taassuroti; Mentor esa «mos kelmaydiganini bosing» deydi. Nishon hozir to'g'ri da'vo
  bosilsa yo'qoladi. Taklif: `tap-hint` ni olib tashlash (dizayn) yoki shu holicha.
- **PmLesson6 s2 (kasbiy so'zlar):** dars 2-ekrani — induktiv ochilish, o'quvchi hali «kasbiy so'z»ni bilmaydi. A
  (birinchi urinish) qilib ulandi; bu darsda bonus yo'q — 152-qonun bo'yicha BONUS qilish ham qonuniy muqobil.
- **JsFunctions s3 · PracticeLesson3 s5:** slot-maslahatlari (rol nomlari) tartibni yo'naltiradi — o'rinli tayanch,
  o'zgartirish tavsiya qilinmaydi (JsFunctions); PracticeLesson3 — faqat Mentor gapi (1-bo'lim).
