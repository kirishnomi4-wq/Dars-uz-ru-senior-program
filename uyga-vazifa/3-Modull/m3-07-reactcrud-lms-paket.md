# 🏠 LMS-PAKET — ReactCrudPracticeLesson (M3-07) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, «Mening o'yinlarim» loyihasi); isbot — App.jsx kodi.
> Darsning o'z uy-kapsulasi: to'liq CRUD · tasdiq · spread/filter tekshiruvi — vazifa aynan shu.

---

## `uz` · Savol

```
«Mening o'yinlarim» ilovangizda to'rttala amalni ishlating, keyin isbotini shu yerga joylang:

1. Create: forma orqali yangi o'yin qo'shiladi — setGames([...games, yangi]).
2. Update: 🔥 TOP tugmasi bosilganda belgisi almashadi (map bilan).
3. Delete: ✕ tugmasi o'chiradi, lekin avval «Rostdan?» deb so'raydi (confirm + filter).

Javob sifatida:
— App.jsx kodingizni TO'LIQ ko'chirib joylang
— bitta gap: sahifani yangilasangiz ro'yxatingizga nima bo'ladi va nima uchun?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining CRUD uy vazifasini tekshiryapsiz. Javobda App.jsx kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) qo'shishda yangi ro'yxat yasaladi: setGames([...games, yangi]) — spread bor;
2) TOP almashtirishda map ishlatilgan va faqat kerakli element yangilanadi (g.id === id sharti bilan);
3) o'chirishda filter bor va undan oldin confirm so'raladi;
4) bitta gapdagi javob to'g'ri: yangilashda ro'yxat yo'qoladi, chunki hammasi xotirada (state) — server hali yo'q.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang.
- games.push ko'rinsa — darsdagi bosh qoidani eslating: ro'yxatni buzmaysiz, har safar YANGI ro'yxat yasaysiz — React shuni ko'radi.
- confirm yo'q bo'lsa — bir bosishda bexos o'chib ketishini ayting.
- Tayyor kodni TO'LIQ yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: ilovasi endi to'rttala amalni biladi.
```

---

## `ru` · Savol

```
Заставьте работать все четыре действия в вашем приложении «Мои игры», затем вставьте сюда доказательство:

1. Create: через форму добавляется новая игра — setGames([...games, novaya]).
2. Update: кнопка 🔥 TOP переключает значок (через map).
3. Delete: кнопка ✕ удаляет, но сначала спрашивает «Точно?» (confirm + filter).

В ответ:
— вставьте ПОЛНЫЙ код вашего App.jsx
— одна фраза: что случится со списком, если обновить страницу, и почему?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по CRUD ученика 13 лет. В ответе должны быть код App.jsx и одна фраза.

Критерии приёма (проверяйте по коду):
1) при добавлении создаётся новый список: setGames([...games, novaya]) — есть spread;
2) при переключении TOP использован map, и обновляется только нужный элемент (условие g.id === id);
3) при удалении есть filter, а перед ним confirm;
4) ответ одной фразой верен: при обновлении список пропадёт, потому что всё в памяти (state) — сервера пока нет.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код.
- Если видно games.push — напомните главное правило урока: список не ломают, каждый раз собирают НОВЫЙ — его и видит React.
- Если нет confirm — скажите, что одно нажатие удалит без спроса.
- НЕ выписывайте готовый код целиком.
- При 4/4 — коротко похвалите: приложение теперь умеет все четыре действия.
```
