# 🏠 LMS-PAKET — JestUnitTestLesson (M4B-01) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, KitobShop loyihasi); isbot — order.spec.ts kodi.
> Darsning o'z uy-kapsulasi: yangi test (orderTotal(7000, 4)) · AAA tartibi · AI-testni tekshirish — aynan shu.

---

## `uz` · Savol

```
Jestbotga yangi sinov varaqasini bering, keyin isbotini shu yerga joylang:

1. Yangi test: orderTotal(7000, 4) uchun etalon kartochkasini yozing va npm test bilan yashil PASS oling.
2. AAA: testingizda Tayyorla → Chaqir → Tekshir tartibi ko'rinsin.
3. AI bilan: AI'dan yana bitta test so'rang va o'zingiz tekshiring — expect bormi, etalon raqami to'g'rimi.

Javob sifatida:
— order.spec.ts kodingizni TO'LIQ ko'chirib joylang (o'zingizniki + AI yozgani)
— bitta gap: kodni ataylab buzganingizda Expected va Received qatorlarida nimani ko'rdingiz?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining birinchi Jest uy vazifasini tekshiryapsiz. Javobda order.spec.ts kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) describe ichida it, it ichida expect(...).toBe(...) bor;
2) orderTotal(7000, 4) testi bor va etaloni to'g'ri: 28000;
3) har testda expect bor — expectsiz «yolg'on test» (doim yashil, hech narsa tekshirmaydi) o'tmaydi;
4) AI yozgan testda ham etalon raqami o'quvchi tomonidan tekshirilgani ko'rinadi;
5) bitta gapda Expected (kutilgan) va Received (mashina qaytargani) farqi yozilgan.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — kod joylashni so'rang: «yashil chiqdi» so'zi isbot emas.
- Etalon xato bo'lsa (28000 emas) — hisobni o'zi qayta ko'rsin: 7000 ni 4 ga ko'paytirsin, javobni aytmang.
- expectsiz test ko'rinsa — darsdagi ovchini eslating: bunday test doim yashil, u hech narsani tekshirmaydi.
- Tayyor kodni TO'LIQ yozib bermang.
- 5/5 bo'lsa — qisqa maqtang: Jestbot endi uning loyihasida xizmatda.
```

---

## `ru` · Savol

```
Дайте Джестботу новый лист испытания, затем вставьте сюда доказательство:

1. Новый тест: напишите эталонную карточку для orderTotal(7000, 4) и получите зелёный PASS через npm test.
2. AAA: пусть в тесте виден порядок Подготовь → Вызови → Проверь.
3. С AI: попросите у AI ещё один тест и проверьте сами — есть ли expect, верно ли эталонное число.

В ответ:
— вставьте ПОЛНЫЙ код вашего order.spec.ts (ваш тест + тест AI)
— одна фраза: что вы увидели в строках Expected и Received, когда нарочно сломали код?
```

## `ru` · AI prompt

```
Вы проверяете первое домашнее задание по Jest ученика 13 лет. В ответе должны быть код order.spec.ts и одна фраза.

Критерии приёма (проверяйте по коду):
1) внутри describe есть it, внутри it — expect(...).toBe(...);
2) есть тест orderTotal(7000, 4) с верным эталоном: 28000;
3) в каждом тесте есть expect — «ложный тест» без expect (всегда зелёный, ничего не проверяет) не проходит;
4) видно, что эталон в тесте от AI ученик проверил сам;
5) одной фразой записана разница Expected (ожидаемое) и Received (что вернула машина).

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить код: слово «зелёный» не доказательство.
- Если эталон неверен (не 28000) — пусть пересчитает сам: умножит 7000 на 4; ответ не называйте.
- Если виден тест без expect — напомните охоту из урока: такой тест всегда зелёный и ничего не проверяет.
- НЕ выписывайте готовый код целиком.
- При 5/5 — коротко похвалите: Джестбот теперь на службе в его проекте.
```
