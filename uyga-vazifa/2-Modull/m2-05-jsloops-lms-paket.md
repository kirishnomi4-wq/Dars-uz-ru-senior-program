# 🏠 LMS-PAKET — JsLoopsLesson (M2-05) · savol-turi: Kompilyator

> Namuna-rasm: `uyga-vazifa/m2-05-uyga-vazifa-uz.png` · `...-ru.png`
> Sozlama: Tip koda ☑ JS · AI Agent O'CHIQ.
> Rasm — konsol nusxasi: har do'stga bittadan qator (ismlar namuna).

---

## `uz` · Savol

```
Darsda sikl 30 ta sinfdoshga tabrikni bir zarbada yozganini ko'rdingiz — endi o'z do'stlaringizga tabrik chiqarasiz. Kod script.js faylida yoziladi.

Talablar:
1. let dostlar = [...] — kamida 3 ta do'stingiz ismi bo'lgan massiv (ro'yxat)
2. for sikli — 0 dan boshlanadi, sharti i < dostlar.length, qadami i++
3. Sikl ichida bitta console.log — har do'stga «Bayram muborak, ...» tabrigi

Uchala talab bajarilsa, vazifa tayyor. Konsolda har do'st uchun bittadan qator chiqadi — rasmdagi ismlar namuna, siz o'z do'stlaringizni yozasiz.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining sikl uy vazifasini tekshiryapsiz. Vazifa: do'stlar massivi va for sikli bilan har do'stga tabrik chiqarish.

Qabul mezonlari (3/3 bo'lsa qabul):
1) massivda kamida 3 ta ism bor, har biri qo'shtirnoq ichida;
2) for sikli 0 dan boshlanadi, sharti massiv uzunligigacha (i < dostlar.length), qadami i++;
3) sikl ichida BITTA console.log bor va u dostlar[i] orqali har do'stning ismini tabrik bilan chiqaradi.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Har ismga alohida console.log yozilgan bo'lsa — bu sikl emas, qo'lda bosish: maqsad bitta console.log ekanini eslating.
- Qadam i++ yo'q yoki i-- yozilgan bo'lsa — sikl to'xtamasligini ayting (cheksiz sikl), tuzatilgan qatorni o'zingiz yozib bermang.
- Sanoq 1 dan boshlansa — birinchi do'st tushib qolishini eslating: massiv 0 dan sanaydi.
- Ism tanloviga baho bermang — do'stlar o'quvchiniki.
- Sintaksis buzuq bo'lsa (qavs yopilmagan, vergul tushgan): «Kod ishlamadi: ...» deb joyini ko'rsating.
- 3/3 bo'lsa — qisqa maqtang: do'st 3 ta emas, 300 ta bo'lsa ham shu uch qator yetadi.
```

---

## `ru` · Savol

```
На уроке цикл одним ударом написал поздравление 30 одноклассникам — теперь выведите поздравление своим друзьям. Код пишется в файле script.js.

Требования:
1. let dostlar = [...] — массив (список) минимум с 3 именами ваших друзей
2. Цикл for — начинается с 0, условие i < dostlar.length, шаг i++
3. Внутри цикла один console.log — поздравление каждому: «С праздником, ...»

Выполнены все три требования — задание готово. В консоли появится по строке на каждого друга — имена на картинке лишь пример, вы пишете своих друзей.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по циклам ученика 13 лет. Задание: массив друзей и цикл for, выводящий поздравление каждому.

Критерии приёма (принято при 3/3; имена переменных могут отличаться):
1) в массиве минимум 3 имени, каждое в кавычках;
2) цикл for начинается с 0, условие — до длины массива (i < dostlar.length), шаг i++;
3) внутри цикла ОДИН console.log, и он через dostlar[i] выводит имя каждого друга с поздравлением.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если на каждое имя написан отдельный console.log — это не цикл, а ручной труд: цель — один console.log.
- Если нет шага i++ или написано i-- — скажите, что цикл не остановится (бесконечный цикл), но исправленную строку не выписывайте.
- Если счёт начат с 1 — первый друг потеряется: массив считает с 0.
- Выбор имён не оценивайте — это друзья ученика.
- Сломанный синтаксис (незакрытая скобка, пропущена запятая): «Код не заработал: ...» и покажите место.
- При 3/3 — коротко похвалите: будь друзей не 3, а 300 — хватит тех же трёх строк.
```
