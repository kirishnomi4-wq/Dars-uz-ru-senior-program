# 🏠 LMS-PAKET — NodeServerLesson (M4-04) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code); isbot — server.js kodi.
> Darsning o'z uy-kapsulasi: o'z serveringiz (Antigravity bilan) · /ism endpointi — vazifa aynan shu.

---

## `uz` · Savol

```
Birinchi serveringizni uyda yoqing, keyin isbotini shu yerga joylang:

1. Antigravity bilan Express server yarating va node server.js bilan ishga tushiring.
2. /salom endpointi biror xabar qaytarsin, /ism endpointi esa ismingizni qaytarsin.
3. Brauzerda localhost:3000/ism ni oching.

Javob sifatida:
— server.js kodingizni TO'LIQ ko'chirib joylang
— bitta gap: brauzerda localhost:3000/ism da nima ko'rdingiz?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining birinchi server uy vazifasini tekshiryapsiz. Javobda server.js kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) kod tartibi to'liq: require('express') → const app = express() → endpointlar → app.listen(3000);
2) kamida 2 endpoint bor: /salom va /ism, har birida res.send bilan javob;
3) /ism o'quvchining ismini qaytaradi;
4) bitta gapda brauzerda ko'rgani yozilgan.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — «bajardim» isbot emas: server.js ni joylashni so'rang.
- app.listen yo'q bo'lsa — darsdagi do'kon-o'xshatishni eslating: OCHIQ tablosi yoqilmagan, do'kon yopiq (ECONNREFUSED).
- res.send yo'q bo'lsa — eshik ochiq-u, tovar berilmayapti deb ayting.
- Tayyor kodni TO'LIQ yozib bermang — faqat yo'nalish ko'rsating.
- 4/4 bo'lsa — qisqa maqtang: o'z kompyuteri endi server bo'lib xizmat qilyapti.
```

---

## `ru` · Savol

```
Включите свой первый сервер дома, затем вставьте сюда доказательство:

1. Создайте Express-сервер с Antigravity и запустите его через node server.js.
2. Эндпоинт /salom пусть возвращает сообщение, а /ism — ваше имя.
3. Откройте в браузере localhost:3000/ism.

В ответ:
— вставьте ПОЛНЫЙ код вашего server.js
— одна фраза: что вы увидели в браузере на localhost:3000/ism?
```

## `ru` · AI prompt

```
Вы проверяете первое серверное домашнее задание ученика 13 лет. В ответе должны быть код server.js и одна фраза.

Критерии приёма (проверяйте по коду):
1) порядок кода полный: require('express') → const app = express() → эндпоинты → app.listen(3000);
2) минимум 2 эндпоинта: /salom и /ism, в каждом ответ через res.send;
3) /ism возвращает имя ученика;
4) одной фразой записано, что видно в браузере.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — «сделал» не доказательство: попросите вставить server.js.
- Если нет app.listen — напомните сравнение с магазином из урока: табло «ОТКРЫТО» не включено, магазин закрыт (ECONNREFUSED).
- Если нет res.send — дверь открыта, а товар не выдан.
- НЕ выписывайте готовый код целиком — только направление.
- При 4/4 — коротко похвалите: его компьютер теперь работает сервером.
```
