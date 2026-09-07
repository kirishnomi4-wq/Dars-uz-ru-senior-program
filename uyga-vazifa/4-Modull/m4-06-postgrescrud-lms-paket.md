# 🏠 LMS-PAKET — PostgresCrudLesson (M4-06) · savol-turi: Text (SQL joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code yoki psql, AI bilan); isbot — SQL so'rovlar.
> Darsning o'z uy-kapsulasi: o'z jadvalingiz · 3 mahsulot · bitta SELECT — vazifa aynan shu.

---

## `uz` · Savol

```
AI bilan o'z bazangizni quring, keyin isbotini shu yerga joylang:

1. O'z mavzuingizdagi jadvalni yarating (kitoblar, kiyimlar, o'yinlar...) — CREATE TABLE so'rovini joylang.
2. Jadvalga 3 ta yozuv kiriting — uchala INSERT so'rovini joylang.
3. AI'dan «arzonlarini ko'rsat» degan SELECT so'rovini yozdiring, o'zingiz tekshiring va so'rovni joylang.

Javob oxirida bitta gap: SELECT natijasida nechta qator chiqdi va nima uchun aynan shuncha?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining SQL uy vazifasini tekshiryapsiz. Javobda CREATE TABLE, 3 ta INSERT, bitta SELECT va bitta gap bo'lishi kerak.

Qabul mezonlari (so'rovlardan tekshiring):
1) CREATE TABLE'da SERIAL PRIMARY KEY va kamida yana 2 ustun bor (masalan nom TEXT, narx INTEGER);
2) 3 ta INSERT INTO ... VALUES so'rovi jadval ustunlariga mos;
3) SELECT'da WHERE bilan taqqoslash-sharti bor (narx < ... kabi);
4) bitta gapda qatorlar soni va sababi yozilgan — son INSERT qilingan qiymatlarga mos bo'lsin.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- So'rov yo'q bo'lsa — so'rovlarni joylashni so'rang: «bajardim» isbot emas.
- UPDATE yoki DELETE ko'rinsa-yu WHERE'siz bo'lsa — darsdagi ogohlantirishni ayting: WHERE'siz HAMMA qator o'zgaradi.
- INSERT ustunlar soniga mos kelmasa — jadval sxemasiga qaytaring, tuzatilgan so'rovni yozib bermang.
- Mavzu tanloviga baho bermang.
- 4/4 bo'lsa — qisqa maqtang: AI yozdi, tekshiruvni o'zi qildi — arxitekt shu.
```

---

## `ru` · Savol

```
Постройте свою базу вместе с AI, затем вставьте сюда доказательство:

1. Создайте таблицу на свою тему (книги, одежда, игры...) — вставьте запрос CREATE TABLE.
2. Внесите 3 записи — вставьте все три запроса INSERT.
3. Попросите AI написать SELECT «покажи дешёвые», проверьте его сами и вставьте запрос.

В конце ответа одна фраза: сколько строк вышло в SELECT и почему именно столько?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по SQL ученика 13 лет. В ответе должны быть CREATE TABLE, 3 INSERT, один SELECT и одна фраза.

Критерии приёма (проверяйте по запросам):
1) в CREATE TABLE есть SERIAL PRIMARY KEY и минимум ещё 2 столбца (nom TEXT, narx INTEGER);
2) 3 запроса INSERT INTO ... VALUES соответствуют столбцам таблицы;
3) в SELECT есть WHERE с условием сравнения (narx < ...);
4) одной фразой записано число строк и причина — число должно соответствовать значениям из INSERT.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если запросов нет — попросите вставить их: «сделал» не доказательство.
- Если виден UPDATE или DELETE без WHERE — напомните предупреждение из урока: без WHERE изменятся ВСЕ строки.
- Если INSERT не совпадает со столбцами — верните к схеме таблицы, исправленный запрос не выписывайте.
- Выбор темы не оценивайте.
- При 4/4 — коротко похвалите: AI написал, а проверил он сам — это и есть архитектор.
```
