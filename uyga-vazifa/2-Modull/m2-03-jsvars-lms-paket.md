# 🏠 LMS-PAKET — JsVarsLesson (M2-03) · savol-turi: Kompilyator

> Namuna-rasm: `uyga-vazifa/m2-03-uyga-vazifa-uz.png` · `...-ru.png`
> Sozlama: Tip koda ☑ JS · AI Agent O'CHIQ.
> Rasm — kompilyator konsolining nusxasi: vazifa bajarilganda o'quvchi aynan shuni ko'radi (qiymatlar namuna).

---

## `uz` · Savol

```
Darsda uchta qutini mentor bilan birga yozdingiz — endi o'zingiz haqingizda to'rtta quti yozasiz. Kod script.js faylida yoziladi.

Talablar:
1. let name = "..." — ismingiz, qo'shtirnoq ichida (matn)
2. let age = ... — yoshingiz, qo'shtirnoqsiz (son)
3. const birth_year = ... — tug'ilgan yilingiz (bu quti qulflangan: keyin o'zgarmaydi)
4. Yana bitta quti — o'zingiz tanlang (masalan: city)
5. To'rttala qutini console.log bilan konsolga chiqaring

Besh ta talab bajarilsa, vazifa tayyor. Konsolda to'rt qator chiqadi — rasmdagi qiymatlar namuna, siz o'z ma'lumotingizni yozasiz.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining birinchi JavaScript uy vazifasini tekshiryapsiz. Vazifa: o'zi haqida to'rtta o'zgaruvchi-quti va ularni konsolga chiqarish.

Qabul mezonlari (5/5 bo'lsa qabul):
1) let bilan matn-quti bor, qiymati qo'shtirnoq ichida (ism);
2) let bilan son-quti bor, qiymati qo'shtirnoqsiz (yosh);
3) const bilan tug'ilgan yil yozilgan;
4) to'rtinchi quti bor — nomi va qiymati o'quvchining o'z tanlovi;
5) har bir quti console.log(...) bilan chiqarilgan — konsolda 4 qiymat ko'rinadi.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Yetishmagan talabni kod-atamasi bilan ayting (masalan: «age qo'shtirnoq ichida qolgan — son qo'shtirnoqsiz yoziladi»).
- Tayyor yechimni TO'LIQ yozib bermang — faqat yo'nalish ko'rsating.
- Ism, yosh, shahar qiymatlariga baho bermang — bu o'quvchining shaxsiy ma'lumoti.
- const qutiga keyin qayta qiymat berilgan bo'lsa — xato: qulflangan quti bir marta to'ldirilishini eslating.
- Sintaksis buzuq bo'lsa (qo'shtirnoq yopilmagan, = tushib qolgan): «Kod ishlamadi: ...» deb joyini ko'rsating.
- 5/5 bo'lsa — bir gap bilan maqtang: birinchi qutilari konsolda ishladi.
```

---

## `ru` · Savol

```
На уроке вы написали три коробки вместе с ментором — теперь напишите четыре коробки о себе. Код пишется в файле script.js.

Требования:
1. let name = "..." — ваше имя в кавычках (текст)
2. let age = ... — ваш возраст без кавычек (число)
3. const birth_year = ... — год рождения (эта коробка заперта: потом не меняется)
4. Ещё одна коробка — на ваш выбор (например: city)
5. Выведите все четыре коробки в консоль через console.log

Выполнены все пять требований — задание готово. В консоли появятся четыре строки — значения на картинке лишь пример, вы пишете свои данные.
```

## `ru` · AI prompt

```
Вы проверяете первое домашнее задание по JavaScript ученика 13 лет. Задание: четыре переменные-коробки о себе и их вывод в консоль.

Критерии приёма (принято при 5/5; имена переменных могут отличаться — важен смысл):
1) есть let-переменная с текстом в кавычках (имя);
2) есть let-переменная с числом без кавычек (возраст);
3) год рождения записан через const;
4) есть четвёртая переменная — имя и значение на выбор ученика;
5) каждая переменная выведена через console.log(...) — в консоли видны 4 значения.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Недостающее требование называйте кодовым термином (например: «age остался в кавычках — число пишется без кавычек»).
- НЕ выписывайте готовое решение целиком — только направление.
- Имя, возраст, город не оценивайте — это личные данные ученика.
- Если const-переменной потом присвоено новое значение — это ошибка: запертая коробка заполняется один раз.
- Сломанный синтаксис (незакрытая кавычка, пропущено =): «Код не заработал: ...» и покажите место.
- При 5/5 — коротко похвалите: первые коробки заработали в консоли.
```
