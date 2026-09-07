# 🏠 LMS-PAKET — NestArchPracticeLesson (M4A-04) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code + agent); isbot — playbook + Swagger-natijalar.
> Darsning o'z uy-kapsulasi: o'z marketplace'ingiz · playbook · ikki rolda tekshiruv — vazifa aynan shu.

---

## `uz` · Savol

```
O'z marketplace'ingizni quring (elektronika, kiyim, o'yinchoq — o'zingiz tanlang), keyin isbotini shu yerga joylang:

1. Reja: 3 resursni yozing — nomi + Entity ustunlari + qaysi resurs qaysisiga @ManyToOne bilan bog'lanadi.
2. Playbook: bitta resurs uchun agentga bergan promptingizni to'liq ko'chirib joylang (5 fayl + AppModule'ga ulash).
3. Ikki rolda tekshiruv: Swagger'da sinab yozing — mijoz sifatida GET necha qaytardi, tokensiz admin-eshik (POST yoki DELETE) necha qaytardi.
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining marketplace uy vazifasini tekshiryapsiz. 3 topshiriq: 3-resurs reja, playbook, ikki-rol tekshiruvi.

Qabul mezonlari:
1) 3 resurs nomlangan, har birida kamida 2 ustun va kamida bitta @ManyToOne bog'lanish to'g'ri yo'nalishda (ko'p tomondagi resursda);
2) playbook to'liq: 5 fayl (entity, dto, service, controller, module) + AppModule'ga ulash aytilgan;
3) tekshiruv-natijalari to'g'ri o'qilgan: ochiq GET → 200; tokensiz admin-eshik → 401 yoki 403 (farqini bilsa yana yaxshi: 401 — token yo'q, 403 — rol yetmaydi).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Bog'lanish teskari bo'lsa — yorliq-o'xshatishni eslating: ko'p kitob → bitta yorliq, yorliq kitobda saqlanadi.
- Guard-natija chalkash bo'lsa — 401/403 farqini savol bilan oching, javobni aytmang.
- Mavzu tanloviga baho bermang.
- 3/3 bo'lsa — qisqa maqtang: istalgan g'oyani backendga aylantira oladi.
```

---

## `ru` · Savol

```
Постройте свой маркетплейс (электроника, одежда, игрушки — на ваш выбор), затем вставьте сюда доказательство:

1. План: запишите 3 ресурса — имя + столбцы Entity + какой ресурс к какому привязан через @ManyToOne.
2. Playbook: полностью вставьте ваш промпт агенту для одного ресурса (5 файлов + подключение к AppModule).
3. Проверка в двух ролях: испытайте в Swagger и запишите — что вернул GET как клиент, что вернула админ-дверь (POST или DELETE) без токена.
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по маркетплейсу ученика 13 лет. 3 задания: план 3 ресурсов, playbook, проверка в двух ролях.

Критерии приёма:
1) названы 3 ресурса, в каждом минимум 2 столбца, минимум одна связь @ManyToOne в верном направлении (в ресурсе на стороне «много»);
2) playbook полный: 5 файлов (entity, dto, service, controller, module) + подключение к AppModule;
3) результаты проверки прочитаны верно: открытый GET → 200; админ-дверь без токена → 401 или 403 (ещё лучше, если знает разницу: 401 — нет токена, 403 — не хватает роли).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если связь наоборот — напомните сравнение с ярлыком: много книг → один ярлык, ярлык хранится в книге.
- Если результат guard спутан — раскройте разницу 401/403 вопросом, ответ не называйте.
- Выбор темы не оценивайте.
- При 3/3 — коротко похвалите: любую идею он превращает в backend.
```
