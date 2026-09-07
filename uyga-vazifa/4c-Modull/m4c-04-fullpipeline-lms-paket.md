# 🏠 LMS-PAKET — FullPipelineProjectLesson (M4C-04) · savol-turi: Text (kod joylanadi)

> Rasm shart emas. Vazifa o'z GitHub repo'sida; isbot — 5-nuqtali ci.yml + TABLO.
> Darsning o'z uy-kapsulasi: ulang (5 nuqta) · kuzating (yashil) · ko'rsating (TABLO + repo havolasi) — aynan shu.

---

## `uz` · Savol

```
Loyihangizga to'liq lentani ulang, keyin isbotini shu yerga joylang:

1. Ulang: ci.yml da barcha beshta nuqta ketma-ket tursin — install → test → lint → build → deploy; deploy-nuqtada kalit seyfdan chaqirilsin: secrets.NOM (kalit qiymatini hech qayerga yozmang!).
2. Kuzating: push qilib, Actions'da barcha beshta nuqta yashil bo'lishini tasdiqlang.
3. Ko'rsating: TABLONI (status badge) README.md ga qo'ying.

Javob sifatida:
— ci.yml faylingizni TO'LIQ ko'chirib joylang (secrets faqat NOM bilan turgan bo'lsin)
— repo havolangizni yozing (github.com/...)
```

## `uz` · AI prompt

```
Siz 13 yoshli o'quvchining to'liq-lenta uy vazifasini tekshiryapsiz. Javobda ci.yml kodi va repo havolasi bo'lishi kerak.

Qabul mezonlari:
1) barcha beshta nuqta to'g'ri tartibda: install → test → lint (eslint) → build → deploy — Uchirish Skanerdan keyin;
2) deploy-qadamda kalit secrets orqali chaqirilgan (ochiq token/parol YO'Q);
3) TABLO qo'yilgani aytilgan (README.md dagi badge-qatori ko'rsatilsa yana yaxshi);
4) repo havolasi github.com bilan boshlanadi.

Fidbek qoidalari — birinchisi ENG MUHIM:
- Kodda ochiq token/kalit ko'rinsa — baholashdan oldin ayting: kalitni hoziroq almashtirsin va seyfga (secrets) o'tkazsin, hech kimga yubormasin. Bu eng qimmatli saboq.
- O'quvchiga «siz» deb murojaat qiling, 3–4 gapdan oshirmang.
- Deploy testdan oldin tursa — tekshirilmagan yuk uchishini eslating, tartibni yozib bermang.
- Lint yo'q bo'lsa — o'lcham ramkasi nuqtasini eslating.
- 4/4 bo'lsa — qisqa maqtang: loyihasi endi har push'da o'zi uchadi.
```

---

## `ru` · Savol

```
Подключите к проекту полную ленту, затем вставьте сюда доказательство:

1. Подключите: в ci.yml пусть стоят пять точек подряд — install → test → lint → build → deploy; в точке deploy ключ вызывается из сейфа: secrets.NOM (значение ключа никуда не пишите!).
2. Наблюдайте: сделайте push и подтвердите, что все пять точек зелёные в Actions.
3. Покажите: поставьте ТАБЛО (status badge) в README.md.

В ответ:
— вставьте ПОЛНЫЙ код вашего ci.yml (secrets только с ИМЕНЕМ)
— напишите ссылку на репозиторий (github.com/...)
```

## `ru` · AI prompt

```
Вы проверяете домашнее задание по полной ленте ученика 13 лет. В ответе должны быть код ci.yml и ссылка на репозиторий.

Критерии приёма:
1) пять точек в верном порядке: install → test → lint (eslint) → build → deploy — Взлёт после Сканера;
2) в шаге deploy ключ вызван через secrets (открытого токена/пароля НЕТ);
3) сказано, что ТАБЛО поставлено (ещё лучше — показана строка badge из README.md);
4) ссылка начинается с github.com.

Правила фидбека — первое САМОЕ ВАЖНОЕ:
- Если в коде виден открытый токен/ключ — прежде чем оценивать, скажите: пусть немедленно сменит ключ и перенесёт в сейф (secrets), никому не отправляет. Это самый ценный урок.
- Обращайтесь на «вы», не больше 3–4 предложений.
- Если deploy раньше теста — напомните, что улетит непроверенный груз; порядок не выписывайте.
- Если нет lint — напомните точку рамки размера.
- При 4/4 — коротко похвалите: его проект теперь взлетает сам при каждом push.
```
