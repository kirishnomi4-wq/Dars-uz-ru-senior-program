# 🏠 LMS-PAKET — FullProPipelineLesson (M4C-07) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z GitHub repo'sida; isbot — yaxshilangan ci.yml.
> Darsning o'z uy-kapsulasi: matrix qo'shing · cache sozlang · maxfiy kalit tekshiruvi — aynan shu.

---

## `uz` · Savol

```
Lentangizni ishonchli qiling, keyin isbotini shu yerga joylang:

1. Matrix: ci.yml ga strategy: matrix bilan kamida 2 muhit qo'shing (masalan node-version: [18, 20]).
2. Cache: actions/cache bilan node_modules'ni keshlang va vaqt farqini o'lchang — birinchi va ikkinchi ishga tushishda necha soniya bo'ldi.
3. Seyf-tekshiruvi: loyihangizda birorta maxfiy kalit ochiq yozilmaganini tekshiring — hammasi secrets orqalimi?

Javob sifatida:
— yangilangan ci.yml faylingizni TO'LIQ joylang (kalit qiymatlari YO'Q — faqat secrets.NOM)
— bitta gap: cache'dan oldin va keyin vaqt qancha bo'ldi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining ishonchli-lenta uy vazifasini tekshiryapsiz. Javobda ci.yml va vaqt-taqqoslash bo'lishi kerak.

Qabul mezonlari:
1) strategy: matrix bor va kamida 2 muhit sanab berilgan;
2) actions/cache qadami bor (node_modules yoki npm-kesh uchun);
3) kodda ochiq kalit YO'Q — maxfiy qiymatlar secrets orqali;
4) vaqt-taqqoslash yozilgan: birinchi ishga tushish va keshdan keyingi ishga tushish (soniyalarda, keyingisi kichikroq).

Fidbek qoidalari — birinchisi ENG MUHIM:
- Ochiq kalit ko'rinsa — baholashdan oldin ayting: kalitni hoziroq almashtirsin va seyfga o'tkazsin. Bu eng qimmatli saboq.
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Matrix bitta muhit bilan bo'lsa — parallel lentalar ma'nosini eslating: bitta lenta matrix emas.
- Vaqt-farqi yo'q bo'lsa — yaqin-javon o'xshatishini eslating: o'lchanmagan tezlik isbot emas.
- 4/4 bo'lsa — qisqa maqtang: lentasi endi uch muhitda birdan sinaydi.
```

---

## `ru` · Savol

```
Сделайте свою ленту надёжной, затем вставьте сюда доказательство:

1. Matrix: добавьте в ci.yml strategy: matrix минимум с 2 средами (например node-version: [18, 20]).
2. Cache: закешируйте node_modules через actions/cache и измерьте разницу времени — сколько секунд заняли первый и второй запуск.
3. Проверка сейфа: убедитесь, что ни один секретный ключ в проекте не записан открыто — всё через secrets?

В ответ:
— вставьте ПОЛНЫЙ обновлённый ci.yml (без значений ключей — только secrets.NOM)
— одна фраза: сколько времени было до cache и после?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по надёжной ленте ученика 13 лет. В ответе должны быть ci.yml и сравнение времени.

Критерии приёма:
1) есть strategy: matrix минимум с 2 средами;
2) есть шаг actions/cache (для node_modules или npm-кеша);
3) открытых ключей в коде НЕТ — секретные значения через secrets;
4) записано сравнение времени: первый запуск и запуск после кеша (в секундах, второй меньше).

Правила фидбека — первое САМОЕ ВАЖНОЕ:
- Если виден открытый ключ — прежде чем оценивать, скажите: пусть немедленно сменит ключ и перенесёт в сейф. Это самый ценный урок.
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если matrix с одной средой — напомните смысл параллельных лент: одна лента — не matrix.
- Если нет разницы времени — напомните сравнение с ближней полкой: неизмеренная скорость не доказательство.
- При 4/4 — коротко похвалите: его лента теперь проверяет в трёх средах сразу.
```
