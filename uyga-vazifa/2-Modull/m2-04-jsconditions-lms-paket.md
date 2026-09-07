# 🏠 LMS-PAKET — JsConditionsLesson (M2-04) · savol-turi: Kompilyator

> Namuna-rasm: `uyga-vazifa/m2-04-uyga-vazifa-uz.png` · `...-ru.png`
> Sozlama: Tip koda ☑ JS · AI Agent O'CHIQ.
> Rasm — konsol nusxasi, yosh = 12 bo'lgandagi natija (konsolda AYNAN bitta javob chiqadi — bu halol: uch yo'ldan bittasi ishlaydi).

---

## `uz` · Savol

```
Kino chiptasi dasturini yozasiz — darsdagi narx qoidasi bilan: 7 yoshgacha tekin, 18 yoshgacha yarim narx, kattalarga to'liq narx. Kod script.js faylida yoziladi.

Talablar:
1. let yosh = ... — quti (istalgan yoshni yozing)
2. if / else if / else — uch yo'l: yosh 7 dan kichik bo'lsa «Tekin», 18 dan kichik bo'lsa «Yarim narx», aks holda «To'liq narx»
3. Har yo'lda console.log — dastur ishga tushganda konsolda aynan bitta javob chiqadi

Uchala talab bajarilsa, vazifa tayyor. Yosh qiymatini o'zgartirib ko'ring — javob ham o'zgaradi. Rasmda yosh = 12 bo'lgandagi natija.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining if/else uy vazifasini tekshiryapsiz. Vazifa: kino chiptasi dasturi — yoshga qarab narx javobini konsolga chiqarish.

Qabul mezonlari (3/3 bo'lsa qabul):
1) let yosh = ... quti bor;
2) if / else if / else uchala yo'l bor va shartlar to'g'ri tartibda (avval 7 dan kichik, keyin 18 dan kichik, oxirida else);
3) har yo'lda console.log bor — «Tekin», «Yarim narx», «To'liq narx» (so'zma-so'z shart emas, ma'no bo'lsa yetadi).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Shart ichida = bitta yozilgan bo'lsa — u solishtirmaydi, qutiga soladi: solishtirish uchun <, <= yoki === kerakligini eslating.
- Shartlar tartibi noto'g'ri bo'lsa (masalan avval 18 tekshirilsa) — qaysi yosh noto'g'ri javob olishini misol bilan ko'rsating, tuzatilgan kodni yozib bermang.
- Tayyor yechimni TO'LIQ yozib bermang — faqat yo'nalish ko'rsating.
- Sintaksis buzuq bo'lsa (qavs yopilmagan): «Kod ishlamadi: ...» deb joyini ko'rsating.
- 3/3 bo'lsa — qisqa maqtang: dastur endi o'zi qaror qabul qiladi.
```

---

## `ru` · Savol

```
Напишите программу «билет в кино» — с правилом цены из урока: до 7 лет бесплатно, до 18 — полцены, взрослым — полная цена. Код пишется в файле script.js.

Требования:
1. let yosh = ... — коробка (напишите любой возраст)
2. if / else if / else — три пути: возраст меньше 7 — «Бесплатно», меньше 18 — «Полцены», иначе — «Полная цена»
3. В каждом пути console.log — при запуске в консоли появляется ровно один ответ

Выполнены все три требования — задание готово. Поменяйте возраст — ответ тоже поменяется. На картинке результат при возрасте 12.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по if/else ученика 13 лет. Задание: программа «билет в кино» — вывести в консоль ответ о цене по возрасту.

Критерии приёма (принято при 3/3; имена переменных могут отличаться):
1) есть переменная возраста (let yosh = ...);
2) есть все три пути if / else if / else, и условия в верном порядке (сначала меньше 7, потом меньше 18, в конце else);
3) в каждом пути есть console.log — «Бесплатно», «Полцены», «Полная цена» (не дословно — достаточно смысла).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если в условии написано одно = — оно не сравнивает, а кладёт в коробку: для сравнения нужны <, <= или ===.
- Если порядок условий нарушен (например, сначала проверяется 18) — покажите на примере, какой возраст получит неверный ответ, но исправленный код не выписывайте.
- НЕ выписывайте готовое решение целиком — только направление.
- Сломанный синтаксис (незакрытая скобка): «Код не заработал: ...» и покажите место.
- При 3/3 — коротко похвалите: программа теперь сама принимает решение.
```
