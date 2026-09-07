# 🏠 LMS-PAKET — ReactStateEffectLesson (M3-04) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, robo-games loyihasi); isbot — GameCard.jsx kodi.
> Darsning o'z uy-kapsulasi: jonli like · ikkinchi xotira (⭐) · tab-kuzatuvchi — vazifa aynan shu.

---

## `uz` · Savol

```
robo-games loyihangizdagi GameCard komponentiga xotira qo'shing, keyin isbotini shu yerga joylang:

1. Jonli like: useState bilan 👍 tugmasi — har bosishda son 1 ga oshadi.
2. Ikkinchi xotira: ⭐ sevimli tugmasi — useState(false), bosishda ⭐ ⇄ ☆ almashadi.
3. Tab-kuzatuvchi: useEffect bilan like soni brauzer tab sarlavhasiga chiqadi.

Javob sifatida:
— GameCard.jsx (yoki App.jsx) kodingizni TO'LIQ ko'chirib joylang
— bitta gap: like bosganingizda tab sarlavhasida nima ko'rindi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining useState/useEffect uy vazifasini tekshiryapsiz. Javobda komponent kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) sonli xotira bor: useState(0) kabi juftlik va tugma bosilganda yangilovchi chaqiriladi (setLikes(likes + 1));
2) ikkinchi xotira bor: useState(false) va bosishda teskarisiga o'tadi (setStarred(!starred)), ekranda ⭐/☆ sharti;
3) useEffect bor va like o'zgarishini kuzatadi (bog'liqlik massivida like-o'zgaruvchisi), ichida document.title yangilanadi;
4) bitta gapda tab sarlavhasida ko'rgani yozilgan.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang: «bajardim» isbot emas.
- likes = likes + 1 ko'rinsa — darsdagi qoidani eslating: xotira faqat yangilovchi orqali o'zgaradi, React'ni setLikes uyg'otadi.
- useEffect bog'liqlik massivi bo'sh bo'lsa — sarlavha faqat bir marta yozilishini ayting, qavs ichiga nimani qo'yishni o'zi topsin.
- Tayyor kodni TO'LIQ yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: kartochkasi endi eslab qoladi.
```

---

## `ru` · Savol

```
Добавьте память компоненту GameCard в вашем проекте robo-games, затем вставьте сюда доказательство:

1. Живой лайк: кнопка 👍 через useState — каждое нажатие увеличивает число на 1.
2. Вторая память: кнопка ⭐ избранного — useState(false), при нажатии ⭐ ⇄ ☆.
3. Наблюдатель вкладки: через useEffect число лайков выводится в заголовок вкладки браузера.

В ответ:
— вставьте ПОЛНЫЙ код вашего GameCard.jsx (или App.jsx)
— одна фраза: что появилось в заголовке вкладки при нажатии лайка?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по useState/useEffect ученика 13 лет. В ответе должны быть код компонента и одна фраза.

Критерии приёма (проверяйте по коду):
1) есть числовая память: пара useState(0) и при нажатии кнопки вызывается обновитель (setLikes(likes + 1));
2) есть вторая память: useState(false) и переключение на противоположное (setStarred(!starred)), на экране условие ⭐/☆;
3) есть useEffect, который следит за изменением лайков (переменная лайков в массиве зависимостей) и обновляет document.title;
4) одной фразой записано, что видно в заголовке вкладки.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код: «сделал» не доказательство.
- Если видно likes = likes + 1 — напомните правило урока: память меняется только через обновитель, React будит setLikes.
- Если массив зависимостей useEffect пуст — скажите, что заголовок запишется только один раз; что положить в скобки, пусть найдёт сам.
- НЕ выписывайте готовый код целиком.
- При 4/4 — коротко похвалите: его карточка теперь помнит.
```
