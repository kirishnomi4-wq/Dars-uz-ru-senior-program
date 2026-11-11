# JSX darslarini yuklash va Active qilish — yakuniy javob

11 noyabr 2026

Abdulloh, salom! Production CRM’da darslarni tekshiruv natijasini kutmasdan saqlash va Active qilish imkoniyati ishga tushirildi. Qolgan darslarni yuklashni davom ettirishingiz mumkin.

## Nimalar tuzatildi

- JSX tekshiruvidagi xatolar va ogohlantirishlar endi saqlash yoki Active qilishni bloklamaydi.
- Tekshiruv hali tugamagan yoki tekshiruv servisi xato bergan bo‘lsa ham, darsni Active qilish mumkin.
- Active darsning fayli yangilanganda holati Active bo‘lib qoladi. Yangi versiya saqlanishi bilan o‘quvchilarga ochiladi.
- `if/else` darsida tekshiruvni to‘xtatgan validatorning ichki xatosi tuzatildi. Statik hisobot yo‘qolgan topshiriqlar qayta ishlanadi.
- Dars qanday ogohlantirishlar bilan nashr qilingani tarixda saqlanadi. Keyinroq kelgan tekshiruv natijasi alohida yoziladi.

## Endi qanday ishlaysiz

### Yangi dars

1. JSX faylini va unga tegishli mediani odatdagi forma orqali yuklang.
2. Saqlang — yangi dars Draft bo‘ladi.
3. Darsni nashr qilishga tayyor bo‘lsangiz, **Active** ni tanlang.
4. Tekshiruv tugashini kutish shart emas. Ogohlantirishlar bo‘lsa, CRM ularni ko‘rsatadi va saqlaydi.

### Allaqachon Active bo‘lgan darsni yangilash

1. Darsni tahrirlash oynasini oching.
2. Tayyor yangi JSX va kerakli mediani yuklang.
3. Saqlang. **Yangi versiya darhol o‘quvchilarga ko‘rinadi**, dars Active bo‘lib qoladi. Qayta faollashtirish kerak emas.

Har bir darsning brauzer tekshiruvi tugaguncha navbatdagi darsni yuklashni to‘xtatib turish shart emas.

## Ogohlantirishlarni qayerdan ko‘rasiz

- Dars formasidagi **«Проверка JSX»** bo‘limida.
- **«Скачать JSON»** tugmasi orqali to‘liq hisobot va tarixni yuklab olish mumkin.
- **«Повторить проверку»** tugmasi orqali tekshiruvni qayta boshlash mumkin.
- [Production nashrlar tarixi](https://go.coddycamp.uz/account/ajax/student_courses/jsx_publication_history.php): dars, qoida kodi, tekshiruv holati va sana bo‘yicha qidirish mumkin. CRM’ga kirish talab qilinadi.

Tarixda kim, qachon, qaysi versiyani va qanday tekshiruv natijasi bilan nashr qilgani saqlanadi. Masalan, dars tekshiruv servisi ishlamay turganda Active qilingan bo‘lsa, keyingi muvaffaqiyatli tekshiruv eski yozuvni o‘chirib yubormaydi — yangi natija alohida qo‘shiladi.

**Active — dars o‘quvchiga ochiq degani. Bu barcha tekshiruvlar muvaffaqiyatli o‘tganini anglatmaydi.** Saqlangan hisobotdagi kamchiliklarni keyingi versiyada tuzatish mumkin.

## Qaysi xatolar hali ham tuzatilishi kerak

JSX sintaksis xatosi sabab kompilyatsiyadan o‘tmasa, avval shu xatoni tuzatish kerak. Fayl yo‘qligi, xavfsiz bo‘lmagan yuklash, ruxsat yetishmasligi yoki boshqa muallif bir vaqtda darsni o‘zgartirgan holatlar ham oddiy ogohlantirish sifatida o‘tkazilmaydi.

## Xatingizdagi darslar

| Dars | Til | Savol ID | Natija |
|---|---|---|---|
| VS Code | uz | 14097 | Active qilindi |
| VS Code | ru | 14100 | Active qilindi |
| if/else | ru | 14109 | Active qilindi |
| if/else | uz | 14110 | Active qilindi |

VS Code’dagi B06 ogohlantirishi tarixga yozildi va Active qilishga to‘sqinlik qilmadi. Dars JSX fayliga bu faollashtirish davomida o‘zgartirish kiritilmadi.

`if/else` qayta tekshirildi: statik tekshiruvda **0 xato, 5 ogohlantirish**; brauzer tekshiruvida **0 xato, 17 ogohlantirish, 5 tekshirilmagan band**. Validatorning ichki nosozligi bartaraf etildi.

To‘rtta versiyaning birinchi ekrani LMS Preview’da kompyuter va mobil o‘lchamda ochildi, JavaScript xatolari qayd etilmadi. Bu o‘quvchi nomidan darsni oxirigacha bajarish va natijani saqlash sinovining o‘rnini bosmaydi.

## Muhitlar

Production’da yuklash, faollashtirish, ogohlantirishlarning qayta ochilganda ko‘rinishi va tarix bo‘yicha qidirish tekshirildi. O‘zgarishlar QA’ga ham chiqarildi. QA’da server tekshiruvlari, CRM’ga kirish va nashrlar tarixining ochilishi tekshirildi.
