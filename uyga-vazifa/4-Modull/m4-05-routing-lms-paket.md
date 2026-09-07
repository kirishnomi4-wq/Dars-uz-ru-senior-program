# 🏠 LMS-PAKET — RoutingLesson (M4-05) · savol-turi: Text

> Rasm shart emas (yozma controller-reja — darsning o'z kapsulasi: UsersController · method-mashqi · Nest hujjati).

---

## `uz` · Matn

```
O'z controlleringizni rejalang — uchala topshiriqqa yozma javob bering:

1. UsersController rejasini yozing — kamida 4 qator, har qatorda: dekorator + metod nomi + nima qilishi (namuna: @Get() → findAll() → hamma foydalanuvchilarni qaytaradi). Bittasida :id parametri bo'lsin.
2. Method-mashqi — barcha beshta amalga methodini yozing: yangi o'quvchi qo'shish · ro'yxatni ko'rish · ismni o'zgartirish · o'quvchini o'chirish · faqat bitta o'quvchini ochish.
3. docs.nestjs.com saytida Controllers sahifasini oching va darsda ko'rmagan bitta yangi narsangizni bir gap yozing.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining routing uy vazifasini tekshiryapsiz. 3 topshiriq: controller-reja, method-mashqi, hujjat-kuzatuv.

Qabul mezonlari:
1) rejada kamida 4 qator bor, har birida dekorator (@Get/@Post/@Put/@Delete) + metod nomi + ishi; bittasida :id parametri;
2) barcha beshta juftlik to'g'ri: qo'shish → POST, ro'yxat → GET, o'zgartirish → PUT, o'chirish → DELETE, bittasini ochish → GET /:id;
3) hujjatdan bitta ANIQ yangi narsa yozilgan (umumiy «foydali ekan» javob emas).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Juftlik xato bo'lsa — pochta-o'xshatishni eslating: shtamp (method) niyatni aytadi; to'g'ri javobni o'zingiz aytmang.
- :id yo'q bo'lsa — bitta eshik ming qiymatga xizmat qilishini eslating.
- Hujjat-javobi umumiy bo'lsa — aniq misol so'rang.
- Hammasi joyida bo'lsa — bir gap bilan maqtang: controlleri qog'ozda tayyor, kod endi oson.
```

---

## `ru` · Matn

```
Спланируйте свой контроллер — письменно выполните три задания:

1. Напишите план UsersController — минимум 4 строки, в каждой: декоратор + имя метода + что делает (образец: @Get() → findAll() → возвращает всех пользователей). В одной строке пусть будет параметр :id.
2. Тренировка методов — напишите метод для пяти действий: добавить нового ученика · посмотреть список · изменить имя · удалить ученика · открыть только одного ученика.
3. Откройте страницу Controllers на docs.nestjs.com и одной фразой запишите одну новую вещь, которой не было на уроке.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по роутингу ученика 13 лет. 3 задания: план контроллера, тренировка методов, наблюдение по документации.

Критерии приёма:
1) в плане минимум 4 строки, в каждой декоратор (@Get/@Post/@Put/@Delete) + имя метода + дело; в одной есть параметр :id;
2) все пять пар верны: добавить → POST, список → GET, изменить → PUT, удалить → DELETE, открыть одного → GET /:id;
3) из документации записана одна КОНКРЕТНАЯ новая вещь (общий ответ «полезно» не считается).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если пара неверна — напомните почтовое сравнение: штамп (method) называет намерение; правильный ответ сами не говорите.
- Если нет :id — напомните: одна дверь служит тысяче значений.
- Если ответ по документации общий — попросите конкретный пример.
- Если всё в порядке — похвалите одной фразой: контроллер готов на бумаге, код теперь прост.
```
