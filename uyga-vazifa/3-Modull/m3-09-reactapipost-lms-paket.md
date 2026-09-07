# 🏠 LMS-PAKET — ReactApiPostLesson (M3-09) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, robo-games); isbot — App.jsx kodi.
> Darsning o'z uy-kapsulasi: qo'shish formasi (POST) · jonli like (PUT) · xavfsiz o'chirish (DELETE) — aynan shu.

---

## `uz` · Savol

```
Endi serverga YOZASIZ ham. Uchala tugmani ishlating, keyin isbotini shu yerga joylang:

1. Qo'shish formasi: nom + emoji yoziladi, tugma POST bilan serverga yuboradi (body: JSON.stringify).
2. Jonli like: 👍 tugmasi PUT yuboradi — sahifani yangilasangiz ham son saqlanib qoladi.
3. Xavfsiz o'chirish: DELETE tugmasi avval «Ishonchingiz komilmi?» deb so'raydi va manzilga ID qo'shadi.

Javob sifatida:
— App.jsx kodingizni TO'LIQ ko'chirib joylang
— bitta gap: POST muvaffaqiyatli o'tganda konsolda qaysi raqam keladi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining POST/PUT/DELETE uy vazifasini tekshiryapsiz. Javobda App.jsx kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) POST to'liq: fetch'ning ikkinchi qismida method: 'POST', body: JSON.stringify(...) va headers'da Content-Type: application/json;
2) PUT bor va manzilida ID qatnashadi (/games/ + id kabi) — like serverda saqlanadi;
3) DELETE'dan oldin confirm so'raladi va manzilda ID bor, body yo'q;
4) bitta gapda 201 (yangi yozuv yaratildi) yozilgan.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang.
- body'da obyekt to'g'ridan-to'g'ri turgan bo'lsa (stringify'siz) — posilka o'ralmagan: JSON.stringify kerakligini eslating.
- PUT/DELETE manzilida ID yo'q bo'lsa — pasport-raqam o'xshatishini eslating: server QAYSI yozuv haqida gap ketayotganini bilishi kerak.
- Tayyor kodni TO'LIQ yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: to'rttala fe'l — o'z ilovasida.
```

---

## `ru` · Savol

```
Теперь вы и ПИШЕТЕ на сервер. Заставьте работать три кнопки и вставьте сюда доказательство:

1. Форма добавления: вводятся имя + emoji, кнопка отправляет POST на сервер (body: JSON.stringify).
2. Живой лайк: кнопка 👍 отправляет PUT — число сохраняется даже после обновления страницы.
3. Безопасное удаление: кнопка DELETE сначала спрашивает «Вы уверены?» и добавляет ID в адрес.

В ответ:
— вставьте ПОЛНЫЙ код вашего App.jsx
— одна фраза: какое число приходит в консоль при успешном POST?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по POST/PUT/DELETE ученика 13 лет. В ответе должны быть код App.jsx и одна фраза.

Критерии приёма (проверяйте по коду):
1) POST полный: во второй части fetch есть method: 'POST', body: JSON.stringify(...) и headers с Content-Type: application/json;
2) есть PUT, и в адресе участвует ID (/games/ + id) — лайк сохраняется на сервере;
3) перед DELETE спрашивается confirm, в адресе есть ID, body нет;
4) одной фразой записано 201 (создана новая запись).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код.
- Если в body лежит объект без stringify — посылка не упакована: напомните про JSON.stringify.
- Если в адресе PUT/DELETE нет ID — напомните сравнение с номером паспорта: сервер должен знать, О КАКОЙ записи речь.
- НЕ выписывайте готовый код целиком.
- При 4/4 — коротко похвалите: все четыре глагола — в его собственном приложении.
```
