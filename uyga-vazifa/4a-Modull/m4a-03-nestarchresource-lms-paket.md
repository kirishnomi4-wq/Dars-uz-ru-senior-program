# 🏠 LMS-PAKET — NestArchResourceLesson (M4A-03) · savol-turi: Text

> Rasm shart emas (yozma reja — darsning o'z kapsulasi: o'z resursingiz · playbook · tekshiruv).

---

## `uz` · Matn

```
Restoranga yangi bo'lim rejasini tuzing — uchala topshiriqqa yozma javob bering:

1. O'z resursingiz: Order yoki Client kabi bitta resurs tanlang va 5 qadamini yozing — Entity (qaysi ustunlar), DTO, Service, Controller, Module.
2. Playbook: har qadam uchun agentga beradigan aniq promptingizni yozing (5 prompt + oxirgisi: Module'ni AppModule imports'iga ulash).
3. Tekshiruv: qurilgach nimani tekshirasiz — 2 band yozing (AppModule'ga ulanganmi; Swagger'da manzil ko'rinadimi, 404 emasmi).
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining Nest-resurs uy vazifasini tekshiryapsiz. 3 topshiriq: resurs-reja, playbook, tekshiruv.

Qabul mezonlari:
1) resurs nomlangan va barcha beshta qadam yozilgan: Entity'da kamida 3 ustun bor, tartib Entity → DTO → Service → Module — to'g'ri;
2) har qadamga aniq prompt bor («fayl yasab ber» kabi loyqa emas — fayl nomi va nimasi borligi aytiladi) va AppModule'ga ulash unutilmagan;
3) tekshiruvda 2 band bor: AppModule imports + Swagger'da manzil (404 bo'lsa nima degani ham).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- AppModule'ga ulash yo'q bo'lsa — darsdagi 404-detektivni eslating: kirish taxtasiga yozilmagan bo'lim mavjud emas.
- Prompt loyqa bo'lsa — qaysi qadamniki loyqaligini ayting, to'g'ri promptni yozib bermang.
- Resurs tanloviga baho bermang.
- Hammasi joyida bo'lsa — bir gap bilan maqtang: rejasi tayyor — agent endi adashmaydi.
```

---

## `ru` · Matn

```
Составьте план нового отдела ресторана — письменно выполните три задания:

1. Ваш ресурс: выберите один ресурс вроде Order или Client и запишите его 5 шагов — Entity (какие столбцы), DTO, Service, Controller, Module.
2. Playbook: для каждого шага запишите точный промпт для агента (5 промптов + последний: подключить Module в imports AppModule).
3. Проверка: что проверите после стройки — 2 пункта (подключён ли к AppModule; виден ли адрес в Swagger, нет ли 404).
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по ресурсу Nest ученика 13 лет. 3 задания: план ресурса, playbook, проверка.

Критерии приёма:
1) ресурс назван, записаны все пять шагов: в Entity минимум 3 столбца, порядок Entity → DTO → Service → Module верен;
2) на каждый шаг есть точный промпт (не размытое «сделай файл» — названы файл и его содержимое), подключение к AppModule не забыто;
3) в проверке 2 пункта: imports AppModule + адрес в Swagger (и что значит 404).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если нет подключения к AppModule — напомните детектив 404 из урока: отдел, не записанный на входной доске, не существует.
- Если промпт размыт — назовите, чей именно, но верный промпт не выписывайте.
- Выбор ресурса не оценивайте.
- Если всё в порядке — похвалите одной фразой: план готов — агент теперь не заблудится.
```
