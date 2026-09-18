# P1 — matn takliflari (darsga KIRITILMAGAN, foydalanuvchi tasdig'ini kutadi)

Manba: P1 partiyasini ulash (18.09 tun). Taklif yozishdan oldin `MATN_KORPUS.md` §63 (tavsif ≤ 48 belgi, bitta nafas),
§133 (tavsif faqat REAL tekshirilgan ishni aytadi), §183 (nishon sharti — yagona xira qator, jazosiz), §184 (bonus
tavsifi qilingan ishni aytadi) o'qildi. Adabiy til, siz-forma. Hech biri kodga kiritilmagan.

## A. Javobni urinishdan OLDIN aytadigan matnlar (Q6 va 151-qonun ma'nosini yo'qqa chiqaradi)

| Dars · ekran | ❌ hozirgi (aynan) | ✅ taklif | Sabab |
|---|---|---|---|
| CssLesson2 · s14 · Mentor | «AI justify-content: center yozdi, lekin menyu ustma-ust qoldi. Sababi: display: flex emas, block yozilgan! Xato qatorni toping.» · ru «…Причина: вместо display: flex написан block! Найдите строку с ошибкой.» | «AI justify-content: center yozdi, lekin menyu ustma-ust qoldi. Sababi — kodning bitta qatorida. Xato qatorni toping.» · ru «ИИ написал justify-content: center, но меню осталось в столбик. Причина — в одной строке кода. Найдите строку с ошибкой.» | Xato qatorni nomlab beradi — Q6 dan keyin ham topshiriq kafolatli. Tushuncha-maslahat (o'ng ustundagi «justify-content faqat display: flex bo'lganda ishlaydi») qoladi — u qatorni emas, qoidani aytadi |
| CssLesson2 · s14 · audio | «…Nega? Chunki display flex yo'q — display block yozilgan. justify-content faqat flex konteynerda ishlaydi. Xato qatorni topib bosing.» | «…Nega? justify-content faqat flex konteynerda ishlaydi. Xato qatorni topib bosing.» | Xuddi shu |
| Htmllesson2 · s14 · ko'rsatma | «Rasm nega ko'rinmayapti? img qatorini bosing.» · ru «Почему картинка не видна? Нажмите на строку img.» | «Rasm nega ko'rinmayapti? Xato qatorni bosing.» · ru «Почему картинка не видна? Нажмите на строку с ошибкой.» | Ko'rsatma javobni aytadi — Q6 bilan 2-qator bosiladigan bo'ldi, lekin ko'rsatma birinchisini buyuradi |
| Htmllesson2 · s14 · Mentor | «AI sizga sahifa kodini yozib berdi, lekin rasm ko'rinmayapti. Nega? DevTools'da img qatorini bosib, sababini toping — keyin birga tuzatamiz.» · ru «…Почему? Нажмите на строку img в DevTools и найдите причину — потом исправим вместе.» | «AI sizga sahifa kodini yozib berdi, lekin rasm ko'rinmayapti. Nega? DevTools'da kodni ko'rib, xato qatorni toping — keyin birga tuzatamiz.» · ru «…Почему? Посмотрите код в DevTools и найдите строку с ошибкой — потом исправим вместе.» | Xuddi shu |
| Htmllesson2 · s14 · audio | «…Nega? DevTools'da img qatorini bosib, sababini toping. Keyin birga tuzatamiz.» | «…Nega? DevTools'da kodni ko'rib, xato qatorni toping. Keyin birga tuzatamiz.» | Xuddi shu |
| Htmllesson2 · s14 · maslahat bloki | «DevTools'da img qatorini bossangiz, src ning bo'm-bo'sh ekanini ko'rasiz.» · ru «Нажмите в DevTools на строку img — и увидите, что src совершенно пустой.» | «Sahifada nima ko'rinmayapti? Shuni chiqaradigan qatorni kodda toping.» · ru «Что не видно на странице? Найдите в коде строку, которая это выводит.» | Maslahat xato qatorni ham, xato sababini ham aytadi. Yangi maslahat fikrlash yo'lini beradi (belgi → qator) |
| CssLesson2 · s7 · audio | «…pastdagi jonli menyuni aynan shu namunaga moslashtirish. Chetdan chetga tarqatuvchi qiymatni topsangiz — nishonga tegasiz.» | «…pastdagi jonli menyuni aynan shu namunaga moslashtirish. Logo va Kirish tugmasi qayerda turganiga qarang.» | Qiymat nima qilishini aytib, javobni deyarli beradi; nishon va'dasi `AchRule` bilan takror (§183: shart yagona qatorda) |
| CssLesson2 · s3b · Mentor (IXTIYORIY) | «Bo'laklarni to'g'ri tartibda kataklarga sudrang: selektor → qavs → xususiyat → qiymat → nuqta-vergul → yopuvchi qavs. To'g'ri yig'ilsa, …» | «Bo'laklarni to'g'ri tartibda kataklarga sudrang. To'g'ri yig'ilsa, yonidagi menyu qatorga tiziladi.» · ru «Перетащите блоки в ячейки в правильном порядке. Соберёте верно — меню рядом выстроится в ряд.» | Tartibni to'liq aytadi — nishon amalda kafolatli. Lekin ekran «Qoida ustaxonasi» — qoidani o'rgatayotgan bo'lishi mumkin: katak-maslahatlari («qaysi element», «qoida boshlanadi»…) baribir yo'l ko'rsatadi. Qaror sizniki |

**Qoldirildi (maqbul):** CssLesson1 s14 Mentor/audio «bir qatordan nuqta-vergul (;) tushib qolgan» — xato TURINI aytadi,
qatorni emas (4 qatordan qaysi birida `;` yo'qligini o'quvchi o'zi topadi). HtmlPractice s14 Mentor «bitta teg yopilmagan» —
xuddi shunday.

## B. «Nishon» so'zining ikki ma'nosi (nishon = mo'ljal va nishon = badge)

| Dars · ekran | ❌ hozirgi | ✅ taklif | Sabab |
|---|---|---|---|
| CssLesson2 · s7 · Mentor | «…namunaga moslang. To'g'ri topsangiz — 🎯 nishonga tegasiz.» · ru «…Угадаете — 🎯 попадёте в яблочко.» | «…namunaga moslang.» (oxirgi jumla olib tashlanadi) · ru «…подгоните живое меню внизу под образец.» | Birinchi urinishda xato qilgan o'quvchi to'g'ri qiymatni topadi, «nishonga tegasiz» va'dasini eslaydi — lekin nishon (badge) berilmaydi. Shart `AchRule` da aytiladi |
| CssLesson2 · s7 · muvaffaqiyat bloki | «🎯 Nishonga tegdi! justify-content: space-between menyuni chetdan chetga tarqatdi — aynan namunadek.» · ru «🎯 В яблочко! …» | «🎯 Aynan namunadek! justify-content: space-between menyuni chetdan chetga tarqatdi.» · ru «🎯 Точно как в образце! justify-content: space-between развёл меню от края до края.» | Xato qilgan o'quvchi ham «Nishonga tegdi!» ni ko'radi — nishon olmagan bo'lsa ham. Skrinshot bilan tasdiqlandi (missed + yakun holati) |

## C. Rost bo'lmagan nishon tavsiflari (§133)

| Dars · nishon | ❌ hozirgi | ✅ taklif | Sabab |
|---|---|---|---|
| CssLesson2 · `markaz` (s7) | «Elementlarni to'liq markazga qo'ydingiz» · ru «Вы поставили элементы точно по центру» | «Menyuni namunadek chetlarga tarqatdingiz» (40 belgi) · ru «Вы разнесли меню по краям, как в образце» | Vazifa — `space-between` (chetdan chetga), markaz emas |

## D. Ko'chirish talab qiladigan nishon (⏸)

| Dars · nishon | Taklif | Yangi tavsif | Sabab |
|---|---|---|---|
| CssLesson1 · `bezak` (s13) | `ACH_TRIGGERS`: `s13` → `s12` (test: «Kontent bilan elementning cheti orasidagi ichki bo'shliq qaysi xususiyat?») | ❌ «Elementni CSS bilan chiroyli qildingiz» → ✅ «Ichki bo'shliq xususiyatini topdingiz» (35 belgi) · ru «Вы нашли свойство внутреннего отступа» | s13 da istalgan 3 chip qabul qilinadi (xato yo'li yo'q); darsda bonus allaqachon bor (`rang` s5) — 152-qonun 1-band. s12 — shu bezak mavzusidagi (padding) test, birinchi urinishga halol. s15 (yozma yakuniy test) mos emas: u natijani doim «to'g'ri» yozadi (T9 ro'yxatida) |

## E. Boshqa partiya / band bilan kesishadigan (qayd)

- PmJtbdLesson `jobHunter` — `earn()` 3 testga javob berilganda (`picked != null`) beriladi, tavsif «…yechib chiqdingiz»
  deydi (P1 inventari). Bu «tashqi nishon» — T2 mini-inventar doirasi.
- HtmlTakrorlash s11 `architect` — «test» deb belgilangan tartiblash, ball ham nishon ham doim «to'g'ri» — T9 (ball).
