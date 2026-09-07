# 🏠 LMS-PAKET — GithubActionsLesson (M4C-03) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z GitHub repo'sida; isbot — ci.yml kodi + Actions-natija.
> Darsning o'z uy-kapsulasi: ci.yml yarating · on: push + steps · yashil chiroqni kuzating — aynan shu.

---

## `uz` · Savol

```
Birinchi yo'l xaritangizni yozing, keyin isbotini shu yerga joylang:

1. O'z repongizda .github/workflows/ci.yml faylini yarating.
2. Ichiga yozing: on: push, runs-on: ubuntu-latest va steps ostiga — checkout, setup-node, npm install, npm test.
3. Push qilib, Actions bo'limida lentani kuzating.

Javob sifatida:
— ci.yml faylingizni TO'LIQ ko'chirib joylang
— bitta gap: Actions'da lenta qaysi rangda tugadi va qizil bo'lsa jurnalda nimani ko'rdingiz?
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining GitHub Actions uy vazifasini tekshiryapsiz. Javobda ci.yml kodi va bitta gap bo'lishi kerak.

Qabul mezonlari (koddan tekshiring):
1) fayl to'g'ri iyerarxiyada: on: push (workflow darajasi) → jobs ichida runs-on: ubuntu-latest → steps;
2) steps'da to'rttala amal bor: actions/checkout, setup-node (uses bilan), npm install va npm test (run bilan);
3) YAML chekinishlari mantiqan to'g'ri (steps job ichida, run step ichida);
4) bitta gapda Actions-natija bor: yashil ✓ yoki qizil bo'lsa jurnaldan o'qigani.

Fidbek qoidalari:
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Kod yo'q bo'lsa — ci.yml ni joylashni so'rang.
- on: yo'q bo'lsa — start-signalini eslating: signalsiz lenta hech qachon aylanmaydi.
- uses va run chalkashgan bo'lsa — farqini eslating: uses — tayyor amal, run — terminal buyrug'i; to'g'ri qatorni yozib bermang.
- 4/4 bo'lsa — qisqa maqtang: endi har push o'z-o'zidan tekshiriladi.
```

---

## `ru` · Savol

```
Напишите свою первую маршрутную карту, затем вставьте сюда доказательство:

1. Создайте в своём репозитории файл .github/workflows/ci.yml.
2. Впишите: on: push, runs-on: ubuntu-latest и под steps — checkout, setup-node, npm install, npm test.
3. Сделайте push и наблюдайте ленту в разделе Actions.

В ответ:
— вставьте ПОЛНЫЙ код вашего ci.yml
— одна фраза: каким цветом закончилась лента в Actions, а если красным — что вы увидели в журнале?
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по GitHub Actions ученика 13 лет. В ответе должны быть код ci.yml и одна фраза.

Критерии приёма (проверяйте по коду):
1) файл в верной иерархии: on: push (уровень workflow) → внутри jobs runs-on: ubuntu-latest → steps;
2) в steps все четыре действия: actions/checkout, setup-node (через uses), npm install и npm test (через run);
3) отступы YAML логически верны (steps внутри job, run внутри step);
4) одной фразой записан результат Actions: зелёная ✓ или, если красная, что прочитано в журнале.

Правила фидбека:
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если кода нет — попросите вставить ci.yml.
- Если нет on: — напомните сигнал старта: без сигнала лента никогда не поедет.
- Если спутаны uses и run — напомните разницу: uses — готовое действие, run — команда терминала; верную строку не выписывайте.
- При 4/4 — коротко похвалите: теперь каждый push проверяется сам.
```
