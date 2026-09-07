# 🏠 LMS-PAKET — ReactApiGetLesson (M3-08) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, robo-games); isbot — App.jsx kodi + 404-hikoyasi.
> Darsning o'z uy-kapsulasi: jonli katalog (fetch) · skeleton · 404 detektivi — vazifa aynan shu.

---

## `uz` · Savol

```
Katalogingiz endi serverdan yuklanadi. Uchala qadamni bajarib, isbotini shu yerga joylang:

1. Jonli katalog: o'yinlar ro'yxati fetch bilan serverdan yuklanadi (useEffect → fetch → .json() → setGames).
2. Skeleton: ma'lumot kelguncha kulrang skeleton-kartochkalar ko'rinadi.
3. 404 detektivi: manzilni ataylab xato yozib, konsoldagi xatoni ko'ring, keyin to'g'rilang.

Javob sifatida:
— App.jsx kodingizni TO'LIQ ko'chirib joylang
— bitta gap: manzil xato bo'lganda konsolda qanday raqam ko'rdingiz va u nimani anglatadi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining fetch/GET uy vazifasini tekshiryapsiz. Javobda App.jsx kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) to'liq zanjir bor: useEffect ichida fetch, keyin .json() va natija setGames (yoki shunga o'xshash yangilovchi) ga beriladi;
2) useEffect bog'liqlik massivi [] — yuklash faqat bir marta;
3) yuklanish holati bor: ma'lumot kelguncha skeleton yoki yuklanish sharti ko'rsatiladi;
4) bitta gapda 404 va ma'nosi yozilgan («bunday manzil topilmadi»).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang.
- .json() tushib qolgan bo'lsa — ofitsiant-o'xshatishni eslating: patnis keldi, lekin qopqog'i ochilmadi.
- fetch useEffect'siz, to'g'ridan-to'g'ri komponent ichida bo'lsa — har chizilishda qayta so'rov ketishini ayting.
- Tayyor kodni TO'LIQ yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: katalogi endi serverdan jonli keladi.
```

---

## `ru` · Savol

```
Ваш каталог теперь загружается с сервера. Выполните три шага и вставьте сюда доказательство:

1. Живой каталог: список игр загружается с сервера через fetch (useEffect → fetch → .json() → setGames).
2. Skeleton: пока данные не пришли, видны серые скелетон-карточки.
3. Детектив 404: нарочно напишите адрес с ошибкой, посмотрите ошибку в консоли, затем исправьте.

В ответ:
— вставьте ПОЛНЫЙ код вашего App.jsx
— одна фраза: какое число вы увидели в консоли при неверном адресе и что оно означает?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по fetch/GET ученика 13 лет. В ответе должны быть код App.jsx и одна фраза.

Критерии приёма (проверяйте по коду):
1) есть полная цепочка: внутри useEffect вызывается fetch, затем .json(), результат идёт в setGames (или похожий обновитель);
2) массив зависимостей useEffect пуст [] — загрузка один раз;
3) есть состояние загрузки: пока данных нет, показывается skeleton или условие загрузки;
4) одной фразой записано 404 и его смысл («такой адрес не найден»).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код.
- Если пропущен .json() — напомните сравнение с официантом: поднос принесли, а крышку не открыли.
- Если fetch вне useEffect, прямо в компоненте — скажите, что запрос будет уходить при каждой отрисовке.
- НЕ выписывайте готовый код целиком.
- При 4/4 — коротко похвалите: каталог теперь приходит с сервера вживую.
```
