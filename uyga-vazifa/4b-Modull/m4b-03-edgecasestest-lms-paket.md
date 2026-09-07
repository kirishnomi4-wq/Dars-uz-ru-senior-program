# 🏠 LMS-PAKET — EdgeCasesTestLesson (M4B-03) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z kompyuterda (VS Code, o'z funksiyasi); isbot — guard + edge-test kodlari.
> Darsning o'z uy-kapsulasi: edge testlar (0, manfiy, noto'g'ri tur) · toThrow · AI-qamrovi — aynan shu.

---

## `uz` · Savol

```
Shumtaka mijozni o'z funksiyangizga qo'yib yuboring, keyin isbotini shu yerga joylang:

1. Guard: funksiyangiz boshiga himoya qatorini qo'shing — noto'g'ri kirishda throw new Error(...).
2. Edge testlar: 0, manfiy son va noto'g'ri tur uchun uchta test yozing — toThrow bilan, () => ichiga o'rab.
3. AI-qamrovi: AI'dan test so'rang va qaysi edge case qolib ketganini toping.

Javob sifatida:
— funksiyangiz (guard bilan) va spec-fayl kodini TO'LIQ joylang
— bitta gap: AI yozgan testlarda qaysi shumtaka-holat yo'q edi?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining edge-case uy vazifasini tekshiryapsiz. Javobda guard-li funksiya, testlar va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) funksiya boshida guard bor: noto'g'ri kirishda throw new Error(...);
2) kamida 3 edge test bor (0, manfiy, noto'g'ri tur) va har biri expect(() => ...).toThrow() ko'rinishida — () => o'rami bilan;
3) kamida bitta boundary-test bor: eng kichik TO'G'RI qiymat oddiy toBe bilan tekshiriladi (masalan (narx, 1));
4) bitta gapda AI qoldirgan aniq holat nomlangan.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- toThrow () =>siz yozilgan bo'lsa — darsdagi qoidani eslating: o'ramasangiz xato darrov otiladi, test o'zi qulaydi.
- Guard yo'q bo'lsa — shumtaka-savol bering: 0 dona buyurtma necha so'm chiqadi? Kodni yozib bermang.
- Boundary yo'q bo'lsa — chegara ikki tomonini eslating: 0 rad, 1 qabul.
- 4/4 bo'lsa — qisqa maqtang: funksiyasi endi shumtakadan qo'rqmaydi.
```

---

## `ru` · Savol

```
Напустите вредного клиента на свою функцию, затем вставьте сюда доказательство:

1. Guard: добавьте в начало функции защитную строку — при неверном входе throw new Error(...).
2. Edge-тесты: напишите три теста для 0, отрицательного числа и неверного типа — через toThrow, обернув в () =>.
3. Покрытие AI: попросите у AI тесты и найдите, какой edge case он пропустил.

В ответ:
— вставьте ПОЛНЫЙ код функции (с guard) и spec-файла
— одна фраза: какого вредного случая не было в тестах AI?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по edge case ученика 13 лет. В ответе должны быть функция с guard, тесты и одна фраза.

Критерии приёма (проверяйте по коду):
1) в начале функции есть guard: при неверном входе throw new Error(...);
2) минимум 3 edge-теста (0, отрицательное, неверный тип), каждый в виде expect(() => ...).toThrow() — с обёрткой () =>;
3) минимум один boundary-тест: наименьшее ВЕРНОЕ значение проверяется обычным toBe (например (narx, 1));
4) одной фразой назван конкретный случай, пропущенный AI.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если toThrow без () => — напомните правило урока: без обёртки ошибка вылетит сразу и тест рухнет сам.
- Если нет guard — задайте вредный вопрос: сколько сумов выйдет заказ на 0 штук? Код не выписывайте.
- Если нет boundary — напомните две стороны границы: 0 отклоняется, 1 принимается.
- При 4/4 — коротко похвалите: его функция больше не боится вредного клиента.
```
