# 🏠 LMS-PAKET — JsFunctionsLesson (M2-06) · savol-turi: Kompilyator

> Namuna-rasm: `uyga-vazifa/m2-06-uyga-vazifa-uz.png` · `...-ru.png`
> Sozlama: Tip koda ☑ JS · AI Agent O'CHIQ.
> Eslatma: dars faqat funksiya · parametr · return o'rgatadi (massiv/obyekt YO'Q) — vazifa shu chegarada.
> Rasm — konsol nusxasi: zarar(5, 2) → 17 va zarar(10, 5) → 35.

---

## `uz` · Savol

```
O'yindagi zarar hisobini darsda funksiya qildingiz — endi unga bonus qo'shasiz. Kod script.js faylida yoziladi.

Talablar:
1. function zarar(kuch, bonus) — ikki parametrli funksiya
2. Ichida return kuch * 3 + bonus — natijani qaytaradi
3. Funksiyani ikki marta chaqirib, natijalarni console.log bilan chiqaring: zarar(5, 2) va zarar(10, 5)

Uchala talab bajarilsa, vazifa tayyor. Konsolda ikki raqam chiqadi: 17 va 35.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining funksiya uy vazifasini tekshiryapsiz. Vazifa: ikki parametrli zarar-funksiyasi, return va ikki marta chaqirish.

Qabul mezonlari (3/3 bo'lsa qabul):
1) function bilan ikki parametrli funksiya yozilgan (kuch, bonus);
2) ichida return kuch * 3 + bonus bor — natija qaytariladi;
3) funksiya ikki marta chaqirilgan — zarar(5, 2) va zarar(10, 5) — va natijalar console.log bilan chiqarilgan (konsolda 17 va 35).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Konsolda undefined chiqsa — return tushib qolgan: mashinadan natija chiqmayapti, deb eslating.
- return o'rniga funksiya ichida console.log yozilgan bo'lsa — farqini eslating: console.log ko'rsatadi, return qiymatni kodga qaytaradi.
- Chaqiruvda qavs yo'q bo'lsa (faqat zarar;) — qavs «boshla» tugmasi ekanini eslating.
- Tayyor yechimni TO'LIQ yozib bermang — faqat yo'nalish ko'rsating.
- Sintaksis buzuq bo'lsa (jingalak qavs yopilmagan): «Kod ishlamadi: ...» deb joyini ko'rsating.
- 3/3 bo'lsa — qisqa maqtang: bir marta yozdi — istagancha ishlatdi.
```

---

## `ru` · Savol

```
Подсчёт урона в игре вы на уроке превратили в функцию — теперь добавьте к нему бонус. Код пишется в файле script.js.

Требования:
1. function zarar(kuch, bonus) — функция с двумя параметрами
2. Внутри return kuch * 3 + bonus — возвращает результат
3. Вызовите функцию два раза и выведите результаты через console.log: zarar(5, 2) и zarar(10, 5)

Выполнены все три требования — задание готово. В консоли появятся два числа: 17 и 35.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по функциям ученика 13 лет. Задание: функция урона с двумя параметрами, return и два вызова.

Критерии приёма (принято при 3/3; имена могут отличаться — важен смысл):
1) через function написана функция с двумя параметрами (kuch, bonus);
2) внутри есть return kuch * 3 + bonus — результат возвращается;
3) функция вызвана два раза — zarar(5, 2) и zarar(10, 5) — и результаты выведены через console.log (в консоли 17 и 35).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если в консоли undefined — потерялся return: машина не выдаёт результат наружу.
- Если вместо return внутри функции стоит console.log — напомните разницу: console.log показывает, return возвращает значение в код.
- Если вызов без скобок (просто zarar;) — напомните: скобки — это кнопка «старт».
- НЕ выписывайте готовое решение целиком — только направление.
- Сломанный синтаксис (незакрытая фигурная скобка): «Код не заработал: ...» и покажите место.
- При 3/3 — коротко похвалите: написал один раз — используешь сколько угодно.
```
