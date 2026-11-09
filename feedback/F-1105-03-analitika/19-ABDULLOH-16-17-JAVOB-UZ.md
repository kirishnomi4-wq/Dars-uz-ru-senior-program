# JSON v1.1 va eski natijalarni tiklash hisobotiga javob

**Sana:** 09.11.2026  
**Asos:** `16-ABDULLOH-JSON-V1.1-VA-OTISH-TARTIBI-UZ.md`, `16a-REESTR-DARS-CLASS-LEARN.csv`, `17-ABDULLOH-50-XABAR-HISOBOT-UZ.md`, `17a-50-XABAR-HISOBOT.csv`.

Oldingi mahsulot qarorlari o‘zgarmaydi: CodeStrike Learn uchun muqobil, ball chegarasi yo‘q; birinchi arena savoli ko‘rsatilganda Learn avtomatik hisoblanadi. O‘quv qismi uchun birinchi to‘liq yakunlash mukofotga asos bo‘ladi, oldingi tugallanmagan natija bu huquqni bekor qilmaydi. Takroriy coin berilmaydi.

Yangi hujjatlar oldingi savollarning katta qismini yopdi. `attempt_id`, tafsilot holati, `not_started` namunasi va eski/yangi formatlarni ajratish yo‘nalishini qabul qilamiz. Quyidagi texnik tuzatishlardan keyin kontraktni yakunlaymiz. Hozircha 213 qator — tekshirish uchun nomzodlar, yuborish yoki coin hisoblash uchun tasdiqlangan ro‘yxat emas.

## 1. CSV tekshiruvi

| Ko‘rsatkich | Fayllarda tasdiqlandi |
| --- | --- |
| Eski xabarlar | 50 |
| O‘quvchi × dars yozuvlari | 229 |
| Noyob o‘quvchilar | 197 |
| Yuborishga taklif qilingan | 213 yozuv, 46 xabar |
| Siz tomonda chiqarilgan | 16 yozuv |
| `correct_answers` o‘zgarishi | 28 yozuvda, jami +57 |
| Qisman tafsilot | 22 yozuv |
| Matn xatosi sabab tafsilotsiz | 13 yozuv |
| `completed` o‘zgarishi | 1 yozuv |
| `badges` o‘zgarishi | Yuborishga taklif qilingan 22 yozuvda |

Reestrda 172 qator bor. `lesson_id`, `class_id`, `learn_id` ustunlarida takror yo‘q, material ID’lari jami 344 ta noyob qiymat. Bu faylning ichki tekshiruvi; production CRM’dagi joriy holat bilan solishtirish hali alohida bajariladi.

## 2. School API tafsilot tengligini tekshiradimi

**Ha, ko‘rilgan lokal implementatsiyada ikkala tenglik ham tekshiriladi:**

- `answered` = `kind:test` tafsilot yozuvlari soni;
- `correct_answers` = shu yozuvlardagi to‘g‘ri birinchi javoblar soni.

Kod: `StoreDarsPlatformLessonResultRequest::validateStudentDetails`. Ko‘rilgan lokal versiya: `6b3c85d`, 21.09.2026. Ishlayotgan production versiyasini biz alohida tasdiqlaymiz.

Hisobotdagi qisman tafsilotlar ikki guruh xabariga tegishli:

| `event_id` | Qisman yozuvlar |
| --- | --- |
| `sess_819479_20260930T103109Z` | 7 |
| `sess_819195_20261012T103453Z` | 15 |

Bu 22 yozuv ko‘rilgan validator bilan mos emas. Qisman tafsilotni qabul qilishni avval bizning tomonda moslashtirib, QA’da tekshirish kerak. Moslikni birinchi production xabarida sinab ko‘rmaymiz.

`details.status:partial` bo‘lgan holatda agregat va tafsilot farqiga ruxsat berish mumkin, ammo sabab va chegaralar tekshiriladi. `full` holatidagi zid qiymatlar oddiy qisman natija sifatida qabul qilinmasin. V1 uchun ham moslik yechimi alohida kerak: yangi `details` blokini mavjud v1 validator o‘zi tushunadi deb hisoblamang.

Amaliyot ekrani `tests.correct_answers` ga qanday kirishi ham yozilsin. Tekshiruvsiz «Bajardim» bosilishi bilan tekshirilgan to‘g‘ri javob bir xil ma’no bermaydi; analitikada avval kelishilgan `correct:null` qoidasi saqlanadi.

## 3. Reestr va mukofot kaliti

Hisobotda **7 ta `pm-m2d13-v1`** natijasi bor, reestrda esa faqat **`pm-m2d13-v2` → Class 2444 → Learn 3184** mavjud.

Shuning uchun `student_id + lesson_id` kaliti barcha tarixiy versiyalar uchun yetarli emas: tashqi `lesson_id` ham o‘zgargan holat bor.

Bizning tomonda mukofot himoyasi kanonik CRM bog‘lanishiga asoslanadi:

- o‘quv qismi mukofoti — o‘quvchi + CRM Class;
- Learn va CodeStrike o‘rtasidagi o‘zaro cheklov — o‘quvchi + bog‘langan Learn;
- til, fayl versiyasi yoki tashqi nom o‘zgarishi yangi mukofot huquqini yaratmaydi.

**Sizdan:** `pm-m2d13-v1` aynan qaysi Class/Learn’ga tegishli ekanini tasdiqlang. Uni faqat o‘xshash nom sabab `v2` bilan avtomatik birlashtirmaymiz. Reestrga eski tashqi ID’lar uchun tarixiy mosliklar qo‘shilsin. Relizda joriy versiyani yangilash eski mosliklarni o‘chirib yubormasin.

## 4. `completed` o‘zgargan yozuv

O‘quvchi **30321**, `css-01-v17`, hodisa `sess_819195_20261012T103453Z`:

- `answered`: 4 → 5;
- `correct_answers`: 3 → 4;
- `completed`: false → true.

Hisobotda sabab «barcha savollarga javob bergan = tugatgan» deb yozilgan. Biz kelishgan mezon esa **oxirgi o‘quv ekraniga yetganlik**.

**Sizdan:** shu urinishning `reached_end`, yakuniy ekran progressi yoki aynan o‘sha tarixiy versiyada barcha javoblar mavjudligi yakuniy ekranga yetganlikni kafolatlashini ko‘rsatuvchi dalil kerak. Dalil bo‘lmaguncha bu yozuvdagi yangi yakunlash va undan keladigan mukofot huquqini tasdiqlamaymiz. Kech kelgan javobning vaqtini va qaysi urinishga tegishliligini ham ko‘rsating.

## 5. Brauzer va serverning vazifalari

`attempt_id` bilan bog‘lashni qabul qilamiz. Ammo 16-hujjatda ikki xil qoida bor: server mukofot manbasi deb yozilgan, keyin «qaysi kanal birinchi kelsa» deyiladi.

Yangi kontrakt uchun texnik yo‘lni quyidagicha aniqlashtiramiz:

- server hodisasi — Class holati va mukofotni ishonchli qo‘llash manbasi;
- brauzer — progressni ko‘rsatish va shu urinishning natijasini bog‘lash; server tasdig‘i kutilayotgan bo‘lsa, yakuniy saqlash tasdiqlangandek ko‘rsatilmaydi;
- brauzerning v2 yuki eski mukofot yo‘lini ishga tushirmaydi;
- kanallar kelish tartibi takroriy ta’sir yaratmaydi.

O‘quv natijasining `event_id` si urinishlarni ham ajratsin. Hozirgi «sessiya + o‘quvchi» qolipi bir sessiyada eski urinish `version_changed` bilan yopilib, yangi urinish yaratilsa to‘qnashishi mumkin. `attempt_id` asosidagi deterministik ID yoki bir sessiyada nega bitta urinishdan ortiq bo‘lmasligini kafolatlaydigan aniq qoida taqdim eting.

## 6. Eski urinishlar va kontent yangilanishi

Versiya hozir urinishda saqlanmasligi va kalitlar ustidan yozilishi haqidagi aniqlik muhim. Yangi ustun qo‘shish avval ochilgan urinishning eski kalitlarini avtomatik tiklamaydi.

**Sizdan:** o‘tishdan oldin ochilgan, versiyasi yozilmagan urinishlar uchun alohida yechim kerak: eski kontent va kalitlar qayerdan olinadi, mosligi qanday tekshiriladi, noma’lum versiya qanday belgilanadi. Hozirgi reestr versiyasini tarixiy fakt sifatida yozmang.

4.3 dagi ikki qoidani ham ajrating:

- eski tab o‘z urinishiga biriktirilgan versiyada davom etsa — yangi reliz borligi sabab rad etilmaydi;
- kelgan javob versiyasi urinishning o‘z versiyasiga mos kelmasa — konflikt tekshiriladi.

«Oxirgi nashrdan farq qiladi» va «urinish versiyasiga mos emas» bir xil shart emas.

V1 yopilishida faqat `pending:0` yetmaydi. Faol eski urinishlar, qayta urinishlar, hal qilinmagan `manual_review` va tarixiy tiklashlar hisobga olinsin. T+8 — tekshirish nuqtasi; o‘zi avtomatik o‘chirish sanasi emas. V1 yopilishi ikki tomon tasdig‘idan keyin bo‘ladi.

## 7. Vaqt, JSON namunalari va qayta ishlash holati

### Vaqt chegaralari

Solo 7 kundan keyin yopiladi, lekin tekshiruv har 15 daqiqada ishlaydi. Shuning uchun haqiqiy yopilishdagi `elapsed_sec` 604800 dan oshishi mumkin. Bu odatiy kechikish bo‘lsa, `manual_review` xatosi bo‘lib qolmasin.

Mantiqiy tugash muddati bilan haqiqiy qayta ishlash vaqtini ajrating yoki maydon chegarasini faktik kechikishga moslang. Vaqtlarni jim kesmang yoki noto‘g‘ri ko‘rsatmang. Jonli dars uchun yozilgan «2 soat + kechikish = 4 soatgacha» izohi ham tuzatilsin: kelishilgan sessiya muddati 2 soat, qo‘shimcha 2 soatlik o‘yin vaqti kelishilmagan.

### To‘liq tekshiriladigan namunalar

A1 da `details.status:full`, `available:2`, ammo `questions` ichida bitta yozuv bor. C1 uchun ham oldingi qisqartirilgan massivga murojaat qilingan. Mashina bilan tekshiriladigan yakuniy namunalarda massivlar to‘liq, sonlar bir-biriga mos bo‘lsin; `...` o‘rniga haqiqiy yozuvlar kerak.

`not_started` hodisasini qoldiramiz. O‘quv natijasi oldin yuborilgan bo‘lishi mumkin, shuning uchun undan arena imkoniyati keyin yopilganini bilib bo‘lmaydi.

### Asinxron qo‘llash

`201` = saqlandi va ishlashga qabul qilindi; `processing` orqali qo‘llash holatini ajratish yo‘nalishi mos. Bizning tomonda qo‘llash takrorlanishga chidamli va xatodan keyin qayta ishlanadigan bo‘ladi.

10 daqiqadan keyin bir marta tekshirish yetarli emas: hodisa o‘sha paytda `queued` bo‘lib, keyin xato berishi yoki navbatda qolishi mumkin. Yakuniy holatgacha kuzatish va uzoq qolgan `queued` uchun ogohlantirish kerak. Yakuniy GET javobi qo‘llangan natija, nol coin sababi va xatoni bir ma’noli ifodalasin.

## 8. Eski natijalar hisobotiga qo‘shimchalar

1. **16 ta chiqarilgan yozuv:** har biriga o‘rnini bosgan qabul qilingan hodisaning aniq `event_id` si va tegishli o‘quvchi qabul qilinganini tasdiqlovchi ma’lumot qo‘shilsin. Umumiy «yetkazilgan yoki oldinroq yuboriladi» izohi yetarli emas. Yetkazilganlik coin berilganini bildirmaydi.
2. **22 ta `badges` o‘zgarishi:** olib tashlangan yoki qo‘shilgan nishonlar sababi ko‘rsatilsin. Bu o‘zgarishlar ham tiklash hisobining bir qismi.
3. **Tarixiy versiya dalili:** `lesson_version_hozir` yordamchi ustun bo‘lib qoladi. Baholashga ishlatilgan tarixiy savol/variant/kalit mosligi uchun tekshiriladigan manba yoki dalil berilsin.
4. **`event_id`:** biror hodisa bizda saqlangan chiqsa, unga avtomatik `_r1` qo‘shib yubormang. Avval qaysi ma’lumot va mukofot qo‘llanganini aniqlaymiz, keyin alohida tiklash yo‘lini belgilaymiz.
5. **Qisman tafsilot:** ikkala tomondagi moslik QA’da tasdiqlanmaguncha 22 qisman yozuvni yangi ko‘rinishda production’ga yubormang.

213 yozuvning hammasi uchun CRM brauzer tarixi va mukofot reyestri bilan solishtirish bizning tomonda bajariladi. CSV’dagi `sizda_tekshirish` ustuni hozir bo‘sh — bu tekshiruv tugagan deb hisoblanmaydi. Maqsad saqlanadi: tarixiy natijalarni tiklash va faqat haqiqatan berilmay qolgan coin’larni berish; yangi Learn qoidasi orqaga qo‘llanmaydi.

## 9. Keyingi ishlar

**Sizning tomon:** yuqoridagi reestr va tarixiy dalillarni to‘ldirish, JSON namunalarini moslashtirish, ikki kanal va versiyalar o‘tishidagi ziddiyatlarni bartaraf etish, hisobotga chiqarish va nishon o‘zgarishi sabablarini qo‘shish.

**Bizning tomon:** production qabul qiluvchi versiyasini tekshirish, qisman tafsilot va v2 uchun validatorni moslashtirish, hodisalarni qo‘llash va kanonik mukofot himoyasini amalga oshirish, CRM tarixi va coin reyestri bilan tiklash ro‘yxatini solishtirish.

QA ssenariylariga qisman tafsilot, 7 kun + yopilish kechikishi, tashqi `lesson_id` almashishi, versiyasiz eski urinish, bir sessiyada urinish almashtirish va uzoq `queued` holatlarini qo‘shamiz.

Mahsulot qoidalari bo‘yicha yangi qaror kerak emas. Texnik tuzatishlar va tekshiruvlardan keyin kontraktni yakunlab, muddatlarni belgilaymiz. Tiklash tartibi o‘zgarmaydi: tasdiqlangan ro‘yxat → bitta xabar → saqlash va haqiqiy mukofotni tekshirish → qolganlari.
