# Prod CRM: Lesson Runner JSX faylini almashtirib bo'lmayapti

10 noyabr 2026 · 37-hujjatdan keyin

Salom. Dars API production'ga chiqdi (`0.1.0+ab1bfa30`, migratsiya 17, `result_schema_v2: off`). Endi 172 darsni CRM'ga yuklashimiz kerak, lekin go.coddycamp.uz da JSX fayl saqlanmayapti. Shu sabab yuklash to'xtab turibdi va `RESULT_SCHEMA_V2=on` ham kutilyapti.

## 1. Nima qildik

| Vaqt | Qanday | Natija |
|---|---|---|
| 22:01 | Skript: Tahrirlash formasi orqali, xuddi «Saqlash» tugmasi yuboradigan maydonlar bilan | Javob 200, lekin fayl almashmadi |
| 22:36 | Qo'lda, brauzerda: «Tahrirlash» → «JSX faylni almashtirish» → «Saqlash» | Qizil xato: **«Cannot create catalogue lock»** |

Ikkalasida ham bitta qator ishlatilgan:

- kurs «AI startup» → «HTML-CSS» → «Internet qanday ishlaydi ?» (bo'lim **2374**);
- qator **13381** (uz, tartib 1, lesson-runner);
- yangi fayl `01-InternetLesson-v6.jsx` (558 706 bayt).

Natija:

- qatorda hamon `01-InternetLesson-v5.jsx`, holati **Active**, Draft bo'lmadi;
- yuklab olingan faylning md5 summasi eski (`6d961628…`);
- `jsx_validation_report.php` → `validation_id: null` (13381 va 14091 uchun ham).

Boshqa qatorlarga tegilmagan. Sinov faqat 13381 da bo'ldi, shuning uchun xato boshqa darslarda ham chiqadimi — aniq bilmaymiz. Formaning yangi saqlash yo'li hamma Lesson Runner qatori uchun bir xil, shuning uchun chiqadi deb o'ylaymiz.

## 2. Formada ko'rganimiz (02.11 da bular yo'q edi)

- `edit_lesson_runner_revision` — yashirin maydon;
- «JSX tekshiruv / Проверка JSX» bloki: Исходник va Браузер — «не проверено»;
- «Dars resurslari» bloki: rasmlar, `first_asset_keys`, alohida ekranlar (`chunks[]`);
- ogohlantirish: «Kontent o'zgarsa, dars Draft bo'ladi: tekshirib, qayta aktivlashtiring»;
- «Saqlash» endi `_jsx_async=1` va `_jsx_file_count` bilan yuboriladi, javob JSON kutiladi. Bizda `ok: false`, xato matni «Cannot create catalogue lock».

## 3. Sizdan iltimos

1. **«Cannot create catalogue lock» xatosini tuzatish.** Bizningcha, bu server tomonidagi xato: ehtimol qulf fayli yoki papkasini yaratishga ruxsat yo'q.
2. **13381 ni tekshirish.** Ikki marta urinib ko'rdik. Qatorda chala holat yoki qolib ketgan qulf yo'qligini ko'rib bering.

## 4. Savollar

1. **Draft:** JSX fayl almashganda nima Draft bo'ladi — faqat shu qator (uz yoki ru) yoki butun mavzu (Class)? Draft paytida o'quvchi darsni ko'rmaydimi?
2. **Qayta aktivlashtirish:** qayerda va kim qiladi? «JSX tekshiruv» (Исходник/Браузер) o'tishini kutish shartmi va u qancha vaqt oladi?
3. **Hajm:** bizda 344 qator bor (172 dars × uz/ru). Ularni bittalab «Saqlash» qilsak, 344 ta tekshiruv navbatga tushadi. Bu muammo emasmi? Ommaviy yuklash yoki ommaviy aktivlashtirish yo'li bormi?
4. **Resurslar:** bizning darslar bitta `.jsx` fayl, rasmlar va alohida ekranlar yo'q. Resurs maydonlarini bo'sh qoldirsak to'g'ri bo'ladimi?

## 5. Tuzatilgandan keyin bizning tartib

1. 13381 ga qo'lda bitta sinov: fayl almashdimi, holat nima bo'ldi, faylning md5 summasi to'g'rimi.
2. Draft qoidasiga qarab — 344 qatorni modulma-modul yuklaymiz. Har qatorda md5 tekshiriladi.
3. Hamma qator Active va yangi versiyada bo'lgach, 37-hujjat bo'yicha `RESULT_SCHEMA_V2=on`.

Hozir hech narsa buzilmagan. Darslar LMS'da eski versiyada ishlayapti, v2 o'chiq, natijalar eskicha ketyapti.
