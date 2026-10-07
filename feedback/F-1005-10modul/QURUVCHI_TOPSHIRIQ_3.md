# 10-Modul — 3-to'lqin: RU sayqal + yakuniy MD (11 dars, har dars — bitta agent)

> Foydalanuvchi ruxsati: 06.10.2026 ~07:30 — «buniyam bitirib yopish kerak, keyin QA ga beramiz» · agentlar: «Ha, 11 tasi birga».
> Har agent — faqat o'z darsi. Commit, push, deploy — YO'Q. App.jsx, MD v3, skelet, qolip, boshqa darslar — tegilmaydi.

| Dars | Kalit | Fayl (`src/8-Modull/`) | MD v3 (`feedback/F-1005-10modul/`) | Yakuniy MD (`feedback/F-1005-10modul/YAKUNIY/`) |
|---|---|---|---|---|
| 1 | m8-01 | `PmOkrLesson.jsx` | `01-PmOkr-v3.md` | `01-PmOkr.md` |
| 2 | m8-02 | `EventTrackingLesson.jsx` | `02-EventTracking-v3.md` | `02-EventTracking.md` |
| 3 | m8-03 | `LiveDashboardLesson.jsx` | `03-LiveDashboard-v3.md` | `03-LiveDashboard.md` |
| 4 | m8-04 | `PmAbTestLesson.jsx` | `04-PmAbTest-v3.md` | `04-PmAbTest.md` |
| 5 | m8-05 | `SecurityBasicsLesson.jsx` | `05-SecurityBasics-v3.md` | `05-SecurityBasics.md` |
| 6 | m8-06 | `PmTrustAuditLesson.jsx` | `06-PmTrustAudit-v3.md` | `06-PmTrustAudit.md` |
| 7 | m8-07 | `ProductionDeployLesson.jsx` | `07-ProductionDeploy-v3.md` | `07-ProductionDeploy.md` |
| 8 | m8-08 | `ProdUpgradeLesson.jsx` | `08-ProdUpgrade-v3.md` | `08-ProdUpgrade.md` |
| 9 | m8-09 | `ProdReviewLesson.jsx` | `09-ProdReview-v3.md` | `09-ProdReview.md` |
| 10 | m8-10 | `PmYearPathLesson.jsx` | `10-PmYearPath-v3.md` | `10-PmYearPath.md` |
| 11 | m8-11 | `PmPitchRehearsalLesson.jsx` | `11-PmPitchRehearsal-v3.md` | `11-PmPitchRehearsal.md` |

Yakuniy MD nomi qat'iy: `NN-<fayl nomi Lesson siz>.md` — `npm run modul:yopish` shu nom bilan topadi va `## <raqam> ·` sarlavhalar sonini `SCREEN_META` bilan solishtiradi.

## Tartib: avval RU, keyin yakuniy MD

### 1-qism — RU sayqal (`konveyer/6-RU.md` to'liq, quyidagi farqlar bilan)
- Fayl hali git'da yo'q, shuning uchun ish-ro'yxati skeletga nisbatan olinadi:
  `node konveyer/vositalar/ru-wl.mjs <FAYL> $S/<NN>-ru/wl.json --base=src/skelet/NamunaDars.jsx`. Hamma bandda `ruByBuilder` bor — quruvchining qoralamasi.
  Vazifa — har birini YANGI `uz` ga qarab tekshirish va yaxshilash (ma'no, «Вы», tabiiy ruscha, uzunlik, lug'at). To'g'ri bo'lsa — o'zgarishsiz qoldiring.
- `cp <FAYL> $S/<NN>-ru/base.jsx` — tarjimadan OLDIN (ru-gate uchun uz-etalon).
- `uz` ga bitta belgi ham tegilmaydi (ru-gate TENG). Kalitlar, `correct`, `INLINE_KEYS`, analitika-payload — o'zgarmaydi.
- **Modul lug'ati (11 dars bir xil yozishi uchun — majburiy):**

| uz | ru | ishlatilmaydi |
|---|---|---|
| «Maydon» (sayt nomi) | «Maydon» (lotincha, qo'shtirnoqda) | Майдон |
| vaqt katagi | ячейка (времени) — 9-Modul bilan bir xil | слот |
| band qilish · band | бронировать · бронь | резерв |
| o'yinchi · maydon egasi | игрок · владелец поля | — |
| sayt · Backend · Database | сайт · Backend · Database (lotincha, 9-Modul kabi) | бэкенд, база данных |
| hodisa · uch qadam | событие · три шага | ивент, воронка (kartochkadan tashqari) |
| brauzer ID | ID браузера | сессия, ID пользователя |
| «Oxirgi 5 daqiqada» | «За последние 5 минут» | «Сейчас на сайте», онлайн |
| inkognito oyna | окно инкогнито | — |
| bosh raqam · North Star | главное число · North Star («Полярная звезда», kartochkada bir marta) | главная метрика |
| metrika | метрика | показатель |
| OKR · maqsad · asosiy natija | OKR · цель · ключевой результат | KPI, KR |
| tajriba | эксперимент | — |
| gipoteza | гипотеза | предположение |
| A/B test · variant A · variant B | A/B-тест · вариант A · вариант B | сплит-тест |
| foiz | процент | доля, конверсия (kartochkadan tashqari) |
| dashboard | дашборд; birinchi marta — «дашборд (панель состояния)» | панель управления |
| zaiflik · yopish | уязвимость · закрыть | дыра |
| maxfiy kalit | секретный ключ | тайна |
| 2FA | 2FA (двухэтапный вход) | двухфакторная |
| shaxsiy ma'lumot | личные данные | персональная информация |
| sizib chiqish | утечка | — |
| audit · savol (audit bo'lagi) | аудит · вопрос | пункт |
| holat: joyida · tuzatish kerak · tuzatildi | на месте · нужно исправить · исправлено | — |
| maxfiylik siyosati | политика конфиденциальности | — |
| monitoring · ogohlantirish | мониторинг · оповещение | алерт |
| production · prod · prodga ko'tarish | production · прод · вывод в прод | выход в прод, живая версия |
| Pull Request (PR) · code review | Pull Request (PR) · code review | merge request |
| tarmoq (branch) | ветка (branch) | — |
| vaqt chizig'i | линия времени | таймлайн |
| baholash varag'i | лист оценки | рубрика |
| fidbek | фидбек | критика |
| pitch · repetitsiya | питч · репетиция | — |
| Loyiha kuni | День проекта | — |
| Mentor · amaliyot | Ментор · практика | — |
| AI (oddiy matnda) | ИИ | — |

  Lug'atda yo'q atama — avval oldingi modullardagi ruschani qidiring (`grep -oh "ru: [^}]*<so'z>" src/7-Modull/*.jsx src/6-Modull/*.jsx`), keyin tanlang va hisobotga yozing.
- `lessonTitle.ru` lug'at bo'yicha (8-dars: «День проекта: вывод в прод — часть 1»; 9-dars bilan bir xil fe'l).
- **Ma'lum RU-joy (2-dars):** 11-ekran ruscha yakuni 1280×800 da 20–40 px pastga tushadi — ru ni qisqartiring (uz sig'adi).
- Darvozalar: `node tools/ru-gate.mjs $S/<NN>-ru/base.jsx <FAYL>` → **TENG** · `npm run gates -- <FAYL>` → 12/12 · `npm run lint:jsx` → 0 (o'z faylingiz) ·
  `timeout 900 env CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru --shots` → **✓ TOZA**; 5–6 ta ekranni (eng zichlarini) Read bilan ko'ring.
  11 agent parallel ishlaydi: ru-walk Chrome band bo'lib yiqilsa — 1–2 daqiqadan keyin bir marta qayta yurgizing, nuqson deb yozmang.
- Ruscha matn uzunroq bo'lib quti, tugma yoki ekrandan chiqsa — ru ni qisqartiring (CSS ga tegmang). Qisqartirib bo'lmasa — hisobotga (ekran + o'lcham).

### 2-qism — Yakuniy MD (`konveyer/7-YAKUNIY.md` to'liq)
- Namuna: `feedback/F-0928-QA-5modul/YAKUNIY/` (bittasini ko'ring). Kod — yagona haqiqat; ekran nomi va tartibi uchun yordamchi — MD v3.
- Sarlavha formati aynan `## <raqam> · <ekran nomi>` — soni `SCREEN_META` bilan teng. Keyin `## Nishonlar` · `## Qisqa takrorlash oynalari` · `## Jonli viktorina (12 savol)` · `## Kartochkalar` · `## Yakun`.
- Faqat o'quvchi ko'radigan O'ZBEKCHA matn (ruscha yo'q, mentor paneli yo'q, KOD belgilari yo'q).
- Tasodifiy tekshiruv: kodning `uz:` satrlaridan 30–40 tasi (skript) MD da aynan bormi.
- **Kod ↔ MD v3 farqlari** (sadoqat): ekran soni, mexanika, test to'g'ri javobi, Mentor gapi — MD v3 dan farq qilgan har joy, bittadan qator. Tuzatilmaydi, faqat ro'yxat.
- **Shubhali joylar** — kodda ko'rilgan, lekin tuzatilmagan kamchiliklar (mentor aytgan tugma yo'q, atama ikki xil, o'lik shart…). Tuzatilmaydi — asosiy seans sinf-supurish qiladi.

## Chegaralar
- Tahrir: faqat o'z `.jsx` faylingizdagi `ru:` qiymatlari va o'z yakuniy MD faylingiz. Boshqa hech narsa.
- Vaqtinchalik fayllar — faqat scratchpad: `$S/<NN>-ru/`, `$S/<NN>-yakuniy/` (`S` — topshiriqda berilgan scratchpad yo'li).
- Faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Turn-byudjeti ≤ 90. Savol bermang — ikkilansangiz lug'atga va MD ga eng yaqin yechim, hisobotda yozing.

## Hisobot (qisqa, jadval bilan)
1. RU: ish-ro'yxati soni · o'zgartirilgan ru soni · manual soni · ru-gate · gates · lint:jsx · ru-walk · ko'rilgan ekranlar · lug'atdan tashqari tanlangan atamalar · sig'magan joylar.
2. Yakuniy MD: fayl yo'li · ekranlar soni (= SCREEN_META) · tasodifiy tekshiruv N/N · kod ↔ MD v3 farqlari · shubhali joylar.
