# 🏠 LMS-PAKET — DataIntroLesson (M4-01) · savol-turi: Text

> Rasm shart emas (yozma sxema — darsning o'z kapsulasi: 3 jadval + id/_id + bog'lanishlar).

---

## `uz` · Matn

```
O'z ilovangizning ichki xaritasini tuzing — uchala topshiriqqa yozma javob bering:

1. Sevimli ilovangizni tanlang (TikTok, do'kon, o'yin...) va bir gap yozing: unda qanday ma'lumot saqlanadi.
2. Shu ilova uchun 3 ta jadval yozing — har jadvalning nomi va ustunlari (namuna: users(id, ism) · posts(id, user_id, matn) · comments(id, post_id, matn)).
3. Bog'lanishlarni so'z bilan ayting: qaysi jadvalning qaysi ustuni (vilka ⌁) qaysi jadvalning id'siga (rozetka ◎) ulanadi — kamida 2 bog'lanish.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining «Ma'lumot nima» darsi bo'yicha yozma sxemasini tekshiryapsiz. 3 topshiriq: ilova, 3 jadval, bog'lanishlar.

Qabul mezonlari:
1) ilova nomlangan va saqlanadigan ma'lumot bir gapda aytilgan;
2) 3 ta jadval bor, har birida id ustuni va kamida yana bitta ustun;
3) kamida 2 bog'lanish so'z bilan aytilgan va to'g'ri yo'nalishda: bog'lovchi _id ustuni «ko'p» tomonidagi jadvalda turadi (posts.user_id → users.id kabi).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- id yo'q jadval bo'lsa — rozetka-metaforasini eslating: har jadvalga takrorlanmas id kerak.
- Bog'lanish teskari yozilgan bo'lsa (users.post_id kabi) — «bitta → ko'p» qoidasini eslating: vilka ko'p tomondagi jadvalda.
- Ilova tanloviga baho bermang.
- Hammasi joyida bo'lsa — bir gap bilan maqtang: ilovasining ichki xaritasi tayyor.
```

---

## `ru` · Matn

```
Составьте внутреннюю карту своего приложения — письменно выполните три задания:

1. Выберите любимое приложение (TikTok, магазин, игра...) и напишите одну фразу: какие данные в нём хранятся.
2. Запишите для него 3 таблицы — имя и столбцы каждой (образец: users(id, ism) · posts(id, user_id, matn) · comments(id, post_id, matn)).
3. Назовите связи словами: какой столбец какой таблицы (вилка ⌁) подключается к id какой таблицы (розетка ◎) — минимум 2 связи.
```

## `ru` · AI prompt

```
Вы проверяете письменную схему ученика 13 лет по уроку «Что такое данные». 3 задания: приложение, 3 таблицы, связи.

Критерии приёма:
1) приложение названо, хранимые данные — в одной фразе;
2) есть 3 таблицы, в каждой столбец id и минимум ещё один столбец;
3) минимум 2 связи названы словами и в верном направлении: связующий столбец _id стоит в таблице на стороне «много» (posts.user_id → users.id).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если в таблице нет id — напомните метафору розетки: каждой таблице нужен неповторимый id.
- Если связь записана наоборот (users.post_id) — напомните правило «один → много»: вилка стоит в таблице на стороне «много».
- Выбор приложения не оценивайте.
- Если всё в порядке — похвалите одной фразой: на следующем уроке эти таблицы строятся в настоящей базе.
```
