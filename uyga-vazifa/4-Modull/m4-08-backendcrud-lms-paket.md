# 🏠 LMS-PAKET — BackendCrudPracticeLesson (M4-08) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code + Antigravity + Postman); isbot — SQL + server kodi + status-hisobot.
> Darsning o'z uy-kapsulasi: o'z jadvalingiz (ALTER TABLE) · to'liq CRUD · Postman test — vazifa aynan shu.

---

## `uz` · Savol

```
AvtoIjara backend'ingizni to'liq quvvatga chiqaring, keyin isbotini shu yerga joylang:

1. Kengaytirish: cars jadvaliga rang yoki transmissiya ustunini qo'shing — ALTER TABLE so'rovini joylang.
2. To'liq CRUD: AI bilan 4 endpoint yozing (GET, POST, PUT, DELETE — /api/cars) — server.js dagi endpoint-kodlarini joylang.
3. Postman test: har endpointga so'rov yuboring va yozing — qaysi endpoint qaysi status kodini qaytardi.

Javob oxirida bitta gap: serverni o'chirib-yoqib yana GET yubordingiz — ma'lumot joyidami va nima uchun?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining backend CRUD uy vazifasini tekshiryapsiz. Javobda ALTER TABLE, 4 endpoint kodi, status-hisobot va bitta gap bo'lishi kerak.

Qabul mezonlari:
1) ALTER TABLE ... ADD COLUMN so'rovi to'g'ri;
2) kodda to'rttala method bor (app.get, app.post, app.put, app.delete — /api/cars) va so'rovlar pool.query orqali, qiymatlar $1, $2 bilan uzatiladi;
3) PUT va DELETE manzilida :id bor va WHERE id=$1 ishlatilgan;
4) status-hisobot to'g'ri: GET → 200, POST → 201;
5) bitta gapda javob to'g'ri: ma'lumot joyida, chunki baza diskda saqlaydi (RAM emas).

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Qiymat so'rov ichiga to'g'ridan-to'g'ri yozilgan bo'lsa ('+nom+' kabi) — $1 xavfsiz o'rnini eslating: matn kod bo'lib qolmasin.
- DELETE'da WHERE yo'q bo'lsa — hamma qator o'chishini ayting.
- Tayyor kodni TO'LIQ yozib bermang.
- 5/5 bo'lsa — qisqa maqtang: backend endi to'rttala amalni biladi va o'chirib-yoqishdan qo'rqmaydi.
```

---

## `ru` · Savol

```
Выведите свой backend АвтоАренды на полную мощность, затем вставьте сюда доказательство:

1. Расширение: добавьте в таблицу cars столбец rang или transmissiya — вставьте запрос ALTER TABLE.
2. Полный CRUD: с AI напишите 4 эндпоинта (GET, POST, PUT, DELETE — /api/cars) — вставьте код эндпоинтов из server.js.
3. Postman-тест: отправьте запрос на каждый эндпоинт и запишите — какой эндпоинт какой статус вернул.

В конце ответа одна фраза: вы перезапустили сервер и снова отправили GET — данные на месте и почему?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по backend CRUD ученика 13 лет. В ответе должны быть ALTER TABLE, код 4 эндпоинтов, отчёт по статусам и одна фраза.

Критерии приёма:
1) запрос ALTER TABLE ... ADD COLUMN верен;
2) в коде все четыре метода (app.get, app.post, app.put, app.delete — /api/cars), запросы через pool.query, значения передаются через $1, $2;
3) в адресах PUT и DELETE есть :id и используется WHERE id=$1;
4) отчёт по статусам верен: GET → 200, POST → 201;
5) фраза верна: данные на месте, потому что база хранит на диске (не в RAM).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если значение вписано прямо в запрос ('+nom+') — напомните безопасное место $1: текст не должен становиться кодом.
- Если в DELETE нет WHERE — скажите, что удалятся все строки.
- НЕ выписывайте готовый код целиком.
- При 5/5 — коротко похвалите: backend знает все четыре действия и не боится перезапуска.
```
