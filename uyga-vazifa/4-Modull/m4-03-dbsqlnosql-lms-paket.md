# 🏠 LMS-PAKET — DbSqlNosqlLesson (M4-03) · savol-turi: Text

> Rasm shart emas (yozma qaror — darsda ham kod yozilmaydi).
> Darsning o'z uy-kapsulasi: orzu ilovangiz · sababini yozing · PostgreSQL'ni ko'ring — aynan shu.
> Jadval-topshirig'i korpus §176 formulasi bilan (2 ta bog'langan jadval, namuna darsning o'zidan).

---

## `uz` · Matn

```
O'z orzu ilovangiz uchun baza tanlang — to'rttala topshiriqqa yozma javob bering:

1. Orzu ilovangiz: bir gap — qanday ilova va unda qanday ma'lumot saqlanadi.
2. Qaror: darsdagi 4 mezon bo'yicha tanlang va har mezonga bir qatordan yozing — bog'lanish bormi, shakli qat'iymi, xato zarar keltiradimi, hajmi qanday. Xulosa: SQL yoki NoSQL.
3. SQL tanlagan bo'lsangiz — 2 ta bog'langan jadvalning nomi va ustunlarini yozing (namuna: users(id, username) va posts(id, user_id, izoh)). NoSQL bo'lsa — bitta hujjat namunasini { } ichida yozing.
4. postgresql.org saytini oching va bosh sahifada 🐘 fildan tashqari yana nimani ko'rganingizni bir gap yozing.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining SQL vs NoSQL uy vazifasini tekshiryapsiz. 4 topshiriq: ilova, 4-mezonli qaror, sxema, sayt-kuzatuv.

Qabul mezonlari:
1) ilova bir gapda va saqlanadigan ma'lumot aytilgan;
2) to'rttala mezon bo'yicha bir qatordan fikr bor va xulosa (SQL/NoSQL) mezonlarga mos — masalan bog'langan ma'lumot + xato zarar keltirsa, NoSQL xulosasi mos emas;
3) SQL bo'lsa: 2 ta jadval nomlangan va ikkinchisida birinchisiga ishora-ustun bor (user_id kabi); NoSQL bo'lsa: { } ichida kamida 3 maydonli hujjat;
4) sayt-kuzatuvda bitta aniq gap bor.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Xulosa mezonlarga zid bo'lsa — qaysi mezon qaysi tomonga tortayotganini ayting, to'g'ri javobni o'zingiz aytmang.
- Ikki jadval bog'lanmagan bo'lsa (ishora-ustun yo'q) — darsdagi JOIN ipini eslating: ikkinchi jadval birinchisini id orqali taniydi.
- Ilova tanloviga baho bermang — g'oya o'quvchiniki.
- Hammasi joyida bo'lsa — bir gap bilan maqtang: bazani endi moda emas, mezon tanlaydi.
```

---

## `ru` · Matn

```
Выберите базу для приложения своей мечты — письменно выполните четыре задания:

1. Приложение мечты: одна фраза — какое приложение и какие данные в нём хранятся.
2. Решение: выберите по 4 критериям из урока и напишите по строке на каждый — есть ли связи, строгая ли форма, вредит ли ошибка, каков объём. Вывод: SQL или NoSQL.
3. Если выбрали SQL — запишите имена и столбцы 2 связанных таблиц (образец: users(id, username) и posts(id, user_id, izoh)). Если NoSQL — один документ-образец в { }.
4. Откройте сайт postgresql.org и одной фразой напишите, что вы увидели на главной, кроме слона 🐘.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по SQL vs NoSQL ученика 13 лет. 4 задания: приложение, решение по 4 критериям, схема, наблюдение на сайте.

Критерии приёма:
1) приложение в одной фразе, названы хранимые данные;
2) по каждому из 4 критериев есть строка, и вывод (SQL/NoSQL) соответствует критериям — например, при связанных данных и вреде от ошибки вывод NoSQL не подходит;
3) при SQL: названы 2 таблицы, и во второй есть столбец-ссылка на первую (user_id); при NoSQL: документ в { } минимум с 3 полями;
4) в наблюдении по сайту есть одна конкретная фраза.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если вывод противоречит критериям — назовите, какой критерий куда тянет, но правильный ответ не говорите.
- Если таблицы не связаны (нет столбца-ссылки) — напомните нить JOIN из урока: вторая таблица узнаёт первую по id.
- Выбор приложения не оценивайте — идея принадлежит ученику.
- Если всё в порядке — похвалите одной фразой: базу теперь выбирает не мода, а критерии.
```
