# 🏠 LMS-PAKET — AuthEnvLesson (M4-11) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, zakaz-shop yoki o'z loyihasi); isbot — guard-kod + statuslar.
> 🔴 Xavfsizlik-qoidasi vazifaning o'zida: maxfiy kalit QIYMATI hech qayerga joylanmaydi — bu darsning o'z saboqlaridan.
> Darsning o'z uy-kapsulasi: login qo'shing · kalitlarni .env'ga · .gitignore — vazifa aynan shu.

---

## `uz` · Savol

```
Loyihangizni qulflang, keyin isbotini shu yerga joylang:

1. Login: loyihangizga POST /api/login qo'shing — to'g'ri email+parolga token qaytarsin.
2. Kalitlar .env'da: maxfiy kalitni .env fayliga ko'chiring, kod uni process.env orqali o'qisin. DIQQAT: javobga kalit QIYMATINI yozmang — faqat nomini (JWT_SECRET). Maxfiy narsa maxfiy qoladi.
3. .gitignore: .env qatorini qo'shing.

Javob sifatida:
— server.js dan login va guard qismlarini ko'chirib joylang (kalit qiymatini o'chirib)
— Postman natijasi: himoyalangan manzilga tokensiz so'rov → qaysi kod? Token bilan → qaysi kod?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining autentifikatsiya uy vazifasini tekshiryapsiz. Javobda login/guard kodi va Postman-statuslar bo'lishi kerak.

Qabul mezonlari:
1) POST /api/login bor va jwt.sign bilan token qaytaradi;
2) kod maxfiy kalitni process.env.JWT_SECRET orqali o'qiydi (kod ichida ochiq matn-kalit YO'Q);
3) himoyalangan route'da tekshiruv bor: token yo'q yoki soxta bo'lsa 401 qaytadi (jwt.verify);
4) .gitignore'ga .env qo'shilgani aytilgan;
5) statuslar to'g'ri: tokensiz → 401, token bilan → 200 yoki 201.

Fidbek qoidalari — birinchisi ENG MUHIM:
- Javobda maxfiy kalit QIYMATI ko'rinsa — kodni baholashdan oldin shuni ayting: kalit hech qachon hech qayerga joylanmaydi, hoziroq yangi kalit qo'yib, buni hech kimga yubormasin. Bu xato emas — eng qimmatli saboq.
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kalit kod ichida ochiq turgan bo'lsa — yashirin tortma (.env) o'xshatishini eslating.
- Guard yo'q bo'lsa — bilaguzuk-o'xshatish: eshikda hech kim tekshirmayapti.
- Tayyor kodni TO'LIQ yozib bermang.
- 5/5 bo'lsa — qisqa maqtang: loyihasi endi eshigi qulflangan do'kon.
```

---

## `ru` · Savol

```
Заприте свой проект, затем вставьте сюда доказательство:

1. Логин: добавьте POST /api/login — на верные email+пароль пусть возвращает токен.
2. Ключи в .env: перенесите секретный ключ в файл .env, код пусть читает его через process.env. ВНИМАНИЕ: не пишите в ответ ЗНАЧЕНИЕ ключа — только имя (JWT_SECRET). Секретное остаётся секретным.
3. .gitignore: добавьте строку .env.

В ответ:
— вставьте из server.js части логина и guard (значение ключа удалите)
— результат Postman: запрос на защищённый адрес без токена → какой код? С токеном → какой код?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по аутентификации ученика 13 лет. В ответе должны быть код логина/guard и статусы Postman.

Критерии приёма:
1) есть POST /api/login, возвращающий токен через jwt.sign;
2) код читает секретный ключ через process.env.JWT_SECRET (открытого ключа в коде НЕТ);
3) на защищённом маршруте есть проверка: без токена или с поддельным — 401 (jwt.verify);
4) сказано, что .env добавлен в .gitignore;
5) статусы верны: без токена → 401, с токеном → 200 или 201.

Правила фидбека — первое САМОЕ ВАЖНОЕ:
- Если в ответе видно ЗНАЧЕНИЕ секретного ключа — прежде чем оценивать код, скажите: ключ никогда никуда не вставляют, пусть прямо сейчас поставит новый и больше никому не отправляет. Это не ошибка — это самый ценный урок.
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если ключ открыт в коде — напомните сравнение с потайным ящиком (.env).
- Если нет guard — напомните браслет: на входе никто не проверяет.
- НЕ выписывайте готовый код целиком.
- При 5/5 — коротко похвалите: его проект — магазин с запертой дверью.
```
