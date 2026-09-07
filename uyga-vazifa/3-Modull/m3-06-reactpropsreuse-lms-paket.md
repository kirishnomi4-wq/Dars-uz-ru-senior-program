# 🏠 LMS-PAKET — ReactPropsReuseLesson (M3-06) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, robo-games); isbot — App.jsx kodi.
> Darsning o'z uy-kapsulasi: katalog (ro'yxat + map) · boy kartochka · TOP belgisi — vazifa aynan shu.

---

## `uz` · Savol

```
robo-games katalogingizni ro'yxatdan quring, keyin isbotini shu yerga joylang:

1. Katalog: App.jsx da 5 ta sevimli o'yindan ro'yxat (massiv) yozing va map bilan kartochkalarga aylantiring.
2. Boy kartochka: GameCard komponentiga name'dan tashqari players va emoji props ham uzating.
3. TOP belgisi: ro'yxatda bittasiga top: true yozing — kartochkada 🔥 chiqsin.

Javob sifatida:
— App.jsx kodingizni TO'LIQ ko'chirib joylang
— bitta gap: ro'yxatga oltinchi o'yinni qo'shsangiz, kodning qaysi qismiga tegasiz?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining props/map uy vazifasini tekshiryapsiz. Javobda App.jsx kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) kamida 5 elementli massiv bor va har element obyekt (name va boshqa maydonlar bilan);
2) ro'yxat map bilan kartochkalarga aylantirilgan (games.map kabi) va qiymatlar jingalak qavsda uzatilgan (name={g.name});
3) komponentga kamida 3 xil props boradi (name, players, emoji);
4) bitta elementda top: true bor va kartochkada shart bilan 🔥 ko'rsatiladi;
5) bitta gapdagi javob to'g'ri: yangi o'yin uchun FAQAT ro'yxatga bitta qator qo'shiladi — komponentga tegilmaydi.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang.
- Kartochkalar map'siz, qo'lda 5 marta yozilgan bo'lsa — darsdagi qoidani eslating: ro'yxat o'ssa kod o'smasin.
- Props ichida qo'shtirnoq-xato bo'lsa (name="{g.name}") — jingalak qavs qoidasini eslating.
- Tayyor kodni TO'LIQ yozib bermang.
- 5/5 bo'lsa — qisqa maqtang: katalogi endi ro'yxatga qarab o'zini chizadi.
```

---

## `ru` · Savol

```
Постройте свой каталог robo-games из списка, затем вставьте сюда доказательство:

1. Каталог: в App.jsx напишите список (массив) из 5 любимых игр и превратите его в карточки через map.
2. Богатая карточка: передайте компоненту GameCard кроме name ещё props players и emoji.
3. Значок TOP: у одной игры в списке напишите top: true — на карточке появится 🔥.

В ответ:
— вставьте ПОЛНЫЙ код вашего App.jsx
— одна фраза: если добавить в список шестую игру, какую часть кода вы тронете?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по props/map ученика 13 лет. В ответе должны быть код App.jsx и одна фраза.

Критерии приёма (проверяйте по коду):
1) есть массив минимум из 5 элементов, каждый — объект (name и другие поля);
2) список превращён в карточки через map (games.map), значения переданы в фигурных скобках (name={g.name});
3) компоненту идут минимум 3 разных props (name, players, emoji);
4) у одного элемента top: true, и на карточке 🔥 показывается по условию;
5) ответ одной фразой верен: для новой игры добавляется ТОЛЬКО строка в список — компонент не трогается.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код.
- Если карточки написаны вручную 5 раз без map — напомните правило урока: список растёт, а код не растёт.
- Если в props ошибка кавычек (name="{g.name}") — напомните правило фигурных скобок.
- НЕ выписывайте готовый код целиком.
- При 5/5 — коротко похвалите: каталог теперь рисует себя сам по списку.
```
