# 🏠 LMS-PAKET — FullstackConnectPracticeLesson (M4-10) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, AvtoIjara loyihasi); isbot — App.jsx kodi.
> Darsning o'z uy-kapsulasi: frontni ulang · holatlar (loading/error) · POST forma — vazifa aynan shu.

---

## `uz` · Savol

```
Front bilan backni bitta simga ulang, keyin isbotini shu yerga joylang:

1. Frontni ulang: App.jsx dagi qattiq const cars ro'yxatini o'chirib, ro'yxat serverdan fetch bilan kelsin.
2. Holatlar: ma'lumot kelguncha loading ko'rinsin, server yopiq bo'lsa error ko'rinsin.
3. POST forma: formadan yangi mashina serverga ketsin va qo'shilgach ro'yxat qayta yuklansin.

Javob sifatida:
— App.jsx kodingizni TO'LIQ ko'chirib joylang
— bitta gap: CORS xatosi konsolda qanday ko'rindi va serverdagi qaysi qator uni ochdi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining front↔back ulash uy vazifasini tekshiryapsiz. Javobda App.jsx kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) qattiq ro'yxat yo'q — ma'lumot useEffect ichidagi fetch('http://localhost:3000/api/cars') dan keladi va setCars ga tushadi;
2) loading holati bor (kelguncha alohida ko'rinish) va error holati bor;
3) forma POST yuboradi (method: 'POST', JSON.stringify) va muvaffaqiyatdan keyin ro'yxat qayta fetch qilinadi;
4) bitta gapda CORS javobi bor: brauzer to'sdi, serverdagi app.use(cors()) qatori ochdi.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kodda hali qattiq const cars = [...] tursa — sim ulanmagan: front hali eski ro'yxatdan o'qiyapti deb ayting.
- POST'dan keyin qayta fetch yo'q bo'lsa — yangi mashina bazada bor-u, ekranda yo'q bo'lishini eslating.
- Tayyor kodni TO'LIQ yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: vitrina endi ombordan jonli oladi.
```

---

## `ru` · Savol

```
Соедините front и back одним проводом, затем вставьте сюда доказательство:

1. Подключите фронт: удалите жёсткий список const cars в App.jsx — список пусть приходит с сервера через fetch.
2. Состояния: пока данные не пришли — виден loading, если сервер выключен — виден error.
3. POST-форма: новая машина из формы уходит на сервер, после добавления список загружается заново.

В ответ:
— вставьте ПОЛНЫЙ код вашего App.jsx
— одна фраза: как ошибка CORS выглядела в консоли и какая строка на сервере её открыла?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по соединению front↔back ученика 13 лет. В ответе должны быть код App.jsx и одна фраза.

Критерии приёма (проверяйте по коду):
1) жёсткого списка нет — данные приходят из fetch('http://localhost:3000/api/cars') внутри useEffect и попадают в setCars;
2) есть состояние loading (отдельный вид до прихода данных) и состояние error;
3) форма отправляет POST (method: 'POST', JSON.stringify), после успеха список загружается заново;
4) в одной фразе ответ про CORS: браузер заблокировал, открыла строка app.use(cors()) на сервере.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если в коде остался жёсткий const cars = [...] — провод не подключён: фронт читает старый список.
- Если после POST нет повторного fetch — новая машина есть в базе, но не на экране.
- НЕ выписывайте готовый код целиком.
- При 4/4 — коротко похвалите: витрина теперь берёт товар со склада вживую.
```
