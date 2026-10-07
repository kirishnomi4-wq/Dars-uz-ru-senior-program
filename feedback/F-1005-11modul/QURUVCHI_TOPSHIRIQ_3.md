# 11-Modul — 3-to'lqin: RU sayqal + yakuniy MD (16 dars, har dars — bitta agent)

> Foydalanuvchi ruxsati: 07.10.2026 ~11:40 — «chala ish bo'lsa darhol qilamiz» · agentlar: «8 + 8, ikki to'lqin» (avval 1–8, tekshiruvdan keyin 9–16).
> Har agent — faqat o'z darsi. Commit, push, deploy — YO'Q. App.jsx, MD v3, skelet, qolip (`src/qolip/*`), boshqa darslar — tegilmaydi.
> Naqsh — 10-Modul `feedback/F-1005-10modul/QURUVCHI_TOPSHIRIQ_3.md` (06.10, 11/11 toza yopilgan).

| Dars | Kalit | Fayl (`src/9-Modull/`) | MD v3 (`feedback/F-1005-11modul/`) | Yakuniy MD (`feedback/F-1005-11modul/YAKUNIY/`) | To'lqin |
|---|---|---|---|---|---|
| 1 | m9-01 | `PmTenIdeasLesson.jsx` | `01-PmTenIdeas-v3.md` | `01-PmTenIdeas.md` | 1 |
| 2 | m9-02 | `PmIdeaRiceLesson.jsx` | `02-PmIdeaRice-v3.md` | `02-PmIdeaRice.md` | 1 |
| 3 | m9-03 | `PmInterviewsOneLesson.jsx` | `03-PmInterviewsOne-v3.md` | `03-PmInterviewsOne.md` | 1 |
| 4 | m9-04 | `PmFinalIdeaLesson.jsx` | `04-PmFinalIdea-v3.md` | `04-PmFinalIdea.md` | 1 |
| 5 | m9-05 | `PmPrdLesson.jsx` | `05-PmPrd-v3.md` | `05-PmPrd.md` | 1 |
| 6 | m9-06 | `PmRoadmapLesson.jsx` | `06-PmRoadmap-v3.md` | `06-PmRoadmap.md` | 1 |
| 7 | m9-07 | `LivePrototypeLesson.jsx` | `07-LivePrototype-v3.md` | `07-LivePrototype.md` | 1 |
| 8 | m9-08 | `PlatformChoiceLesson.jsx` | `08-PlatformChoice-v3.md` | `08-PlatformChoice.md` | 1 |
| 9 | m9-09 | `ExpoPrototypeLesson.jsx` | `09-ExpoPrototype-v3.md` | `09-ExpoPrototype.md` | 2 |
| 10 | m9-10 | `FoundationDayLesson.jsx` | `10-FoundationDay-v3.md` | `10-FoundationDay.md` | 2 |
| 11 | m9-11 | `FeatureOneLesson.jsx` | `11-FeatureOne-v3.md` | `11-FeatureOne.md` | 2 |
| 12 | m9-12 | `FeatureTwoLesson.jsx` | `12-FeatureTwo-v3.md` | `12-FeatureTwo.md` | 2 |
| 13 | m9-13 | `PmAudienceTestLesson.jsx` | `13-PmAudienceTest-v3.md` | `13-PmAudienceTest.md` | 2 |
| 14 | m9-14 | `FeatureThreeLesson.jsx` | `14-FeatureThree-v3.md` | `14-FeatureThree.md` | 2 |
| 15 | m9-15 | `PmOneOnOneLesson.jsx` | `15-PmOneOnOne-v3.md` | `15-PmOneOnOne.md` | 2 |
| 16 | m9-16 | `PmPrototypePitchLesson.jsx` | `16-PmPrototypePitch-v3.md` | `16-PmPrototypePitch.md` | 2 |

Yakuniy MD nomi qat'iy: `NN-<fayl nomi Lesson siz>.md` — `npm run modul:yopish` shu nom bilan topadi va `## <raqam> ·` sarlavhalar sonini `SCREEN_META` bilan solishtiradi.
`S` — topshiriqda berilgan scratchpad yo'li. Vaqtinchalik fayllar faqat `$S/<NN>-ru/`, `$S/<NN>-yakuniy/`.

## Tartib: avval RU, keyin yakuniy MD

### 1-qism — RU sayqal (`konveyer/6-RU.md` to'liq, quyidagi farqlar bilan)
- Ish-ro'yxati skeletga nisbatan (fayl git'da bor, lekin HEAD dagi ru ham quruvchiniki):
  `node konveyer/vositalar/ru-wl.mjs <FAYL> $S/<NN>-ru/wl.json --base=src/skelet/NamunaDars.jsx`. Hamma bandda `ruByBuilder` — quruvchining qoralamasi.
  Vazifa — har birini YANGI `uz` ga qarab tekshirish va yaxshilash (ma'no, «Вы», tabiiy ruscha, uzunlik, lug'at). To'g'ri bo'lsa — o'zgarishsiz qoldiring.
- `cp <FAYL> $S/<NN>-ru/base.jsx` — tarjimadan OLDIN (ru-gate uchun uz-etalon).
- `uz` ga bitta belgi ham tegilmaydi (ru-gate TENG). Kalitlar, `correct`, `INLINE_KEYS`, analitika-payload, `storageKey` — o'zgarmaydi.
- **Ekrandagi nom = matndagi nom (07.10, asosiy seans o'lchovi).** Mentor gapi, «Нажмите …», savol yoki izoh ekrandagi tugma/maket yorlig'iga ishora qilsa,
  ru matnda shu element ru rejimida QANDAY ko'rinsa — AYNAN shunday yoziladi. Maket `{ uz: 'Kelaman', ru: 'Приду' }` bo'lsa — «Нажмите «Приду»», «Kelaman» emas.
  O'lchov: 8, 11, 12-darslarda ru gaplarda «Kelaman», «Yuborish», «Yangilash», «O'yin», «Kirish», «Tashkilotchi» — maketda esa ruscha. Dars tugmasi «Bajardim» ru da — «Готово».
  **Istisno — talab va kod:** agentga yuboriladigan talab matni, kod bloklari, `ru-qoldiq-istisno` izohli satrlar — Mentor repo'sidagi real qiymat (o'zbekcha) qoladi (6-RU qoida 4).
  Bir ekranda talab «Kelaman» desa, maket esa «Приду» ko'rsatsa — talabda birinchi tilga olishda qavsda ruschasi: «кнопка «Kelaman» («Приду»)». Shubhali holat — hisobotga.
- **Modul lug'ati (16 dars bir xil yozishi uchun — majburiy; o'lchov — quruvchilar ko'pchiligi shunday yozgan):**

| uz | ru | ishlatilmaydi |
|---|---|---|
| «Maydon Jamoa» (Mentor ilovasi) | «Maydon Jamoa» (lotincha, qo'shtirnoqda) | Майдон |
| g'oya · muammo · kim uchun · yechim | идея · проблема · для кого · решение | стартап-идея |
| saralash | отбор | сортировка, фильтр |
| RICE · qamrov · ta'sir · ishonch · mehnat | RICE · охват · влияние · уверенность · усилия | доверие, трудозатраты |
| final g'oya · final mahsulot | финальная идея · финальный продукт | главная идея |
| intervyu · yozuv | интервью · запись | опрос (intervyu ma'nosida) |
| harakat belgisi | знак действия | обещание, commitment |
| takrorlangan javob | повторяющийся ответ | паттерн |
| PRD | PRD; birinchi marta — «PRD (документ требований к продукту)» | ТЗ, спецификация |
| Mentor tekshiruvi · qabul · tuzatish | проверка Ментора · принять · исправить | — |
| roadmap · ufq · Hozir · Keyinroq · Uzoqroq | roadmap (lotincha) · горизонт · Сейчас · Позже · Дальше | дорожная карта, роадмап |
| wireframe | wireframe (lotincha) | вайрфрейм, эскиз, макет |
| prototip · jonli prototip · ilova | прототип · живой прототип · приложение | MVP, демо-версия |
| jonli demo | живое демо | демо-версия |
| platforma · web-trek · mobil trek | платформа · веб-трек · мобильный трек | направление |
| real vaqt nuqtasi | точка реального времени | real-time |
| adaptiv sayt · PWA · manifest · tunnel | адаптивный сайт · PWA · manifest · tunnel | — |
| poydevor | фундамент | основа, скелет |
| asosiy funksiya | основная функция | фича |
| tashkilotchi · o'yinchi | организатор · игрок | админ |
| e'lon · qo'shilish · tasdiq · navbat | объявление · присоединение · подтверждение · очередь | бронь, заявка |
| «Qo'shilaman» → «Qo'shildingiz» · «Kelaman» → «Tasdiqladingiz» | «Присоединяюсь» → «Вы присоединились» · «Приду» → «Вы подтвердили» | — |
| «Navbatga yozilish» · «O'yindan chiqish» · «Hisobdan chiqish» | «Записаться в очередь» · «Выйти из игры» · «Выйти из аккаунта» | «Встать в очередь», «Выйти» (yolg'iz) |
| sinov (real odam bilan) · sinovchi | тест · тестировщик | испытание |
| risk · tuzatilgan reja | риск · исправленный план | опасность |
| yakkama-yakka | встреча один на один | 1:1, one-on-one |
| holat: bajarildi · kechikdi · boshlanmadi · kutish yozuvi | выполнено · с опозданием · не начато · запись ожидания | — |
| talab (agentga) · agent · prompt | требование · агент · промпт | ТЗ |
| Backend · Database · deploy | Backend · Database (lotincha) · деплой (9/10-Modul: «деплой» 21 joy, lotincha 0 — 07.10 o'lchov) | бэкенд, база данных, deploy (ruscha gapda) |
| Mentor · amaliyot · «Bajardim» | Ментор · практика · «Готово» | — |
| AI (oddiy matnda) | ИИ | — |
| Demo Day 7 | Demo Day 7 | — |

- **To'lqin 1 saboqlari (07.10 ~12:00, 1–6-darslar hisobotidan; o'lchov 16 dars + 9/10-Modul) — lug'atga QO'SHIMCHA, majburiy:**

| uz | ru | ishlatilmaydi |
|---|---|---|
| «Yordam» (tugma, panel) | «Подсказка» (PM darslar 8/8 va 10-Modul shunday) | «Помощь» |
| muammo gapi | формулировка проблемы (9/10-Modul, 4-dars) | фраза о проблеме |
| dalil · isbot | довод · доказательство (4-dars: «довод, не доказательство»; PRD bo'limi «Довод») | — |
| qiynalish · qiynaladi | мучиться · «С чем трудно» (muammo gapi bo'lagi, 4-dars) | страдать |
| sinab ko'rish kuni (harakat belgisi) | день пробы · «назначил день пробы» | день теста, день проверки (bu ma'noda) |
| «Maydon pulini bo'lishish» (Mentor g'oyasi) | «Делить плату за поле» | «Разделить оплату поля» |

  Skelet satrlari («Дождитесь наставника», «Заметка ментору», «Badges — N/4») — platforma standarti (9/10-Modulda ham shunday): **tegilmaydi**, hisobotda takrorlamang.
  Kod mantig'i (tekshiruv regex'lari faqat o'zbekcha so'zni taniydi, `tr()` siz satr, bir tilli `{ t: … }`) — tuzatilmaydi, «Shubhali joylar»ga aniq qator raqami bilan; asosiy seans sinf-supurish qiladi.
  Lug'atda yo'q atama — avval oldingi modullardagi ruschani qidiring (`grep -oh "ru: [^}]*<so'z>" src/8-Modull/*.jsx src/7-Modull/*.jsx src/6-Modull/*.jsx`), keyin tanlang va hisobotga yozing.
- **Ma'lum RU-joylar (asosiy seans sinovidan, `SINOV_ROYXAT.md`):**
  6-dars — 2-ekran RICE jadvalida «уверенность» ustuni qisqarib kesiladi (1280×800) → ru ni qisqartiring yoki ustun sarlavhasini qisqa so'z bilan bering (CSS ga tegmang).
  8-dars — ru Mentor gaplarida o'zbekcha tugma nomlari (yuqoridagi «ekrandagi nom» qoidasi).
  9-dars — A2 (web-trek) natija yorlig'i ru da 2 qatorga tushib, JSON kartasini pastki panel ostiga suradi → ru yorliqni qisqartiring.
  11, 12-darslar — «Kelaman», «Yuborish», «Yangilash», «Kirish», «Tashkilotchi» (yuqoridagi qoida).
  `modul:yopish` (07.10) darslarda «RU XATO» va «sarlavha 2+ qator» ko'rsatdi. Namuna (9-dars): ru-walk «qoldiq: gap» s9, s10 — kod oynasidagi CSS `gap` xossasi (kod — tarjima qilinmaydi;
  faylda izoh-e'lon: `// ru-qoldiq-istisno s9: gap` — faqat shu ekran; ekransiz — butun dars; faqat kod/terminal nomlari uchun, o'quvchi gapi uchun EMAS; izoh oddiy JS qatorida — shablon-satr yoki JSX ichida emas) · sarlavha-qator: ru s0, s10 sarlavhasi 1280×800 da 2 qator → ru sarlavhani qisqartiring (ma'no saqlanadi).
- Darvozalar: `node tools/ru-gate.mjs $S/<NN>-ru/base.jsx <FAYL>` → **TENG** · `npm run gates -- <FAYL>` → 12/12 · `npm run lint:jsx` → 0 (o'z faylingiz) ·
  `timeout 900 env CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru --shots` → **✓ TOZA**; 5–6 ta ekranni (eng zichlarini) Read bilan ko'ring ·
  `timeout 900 env CHROME=/usr/bin/google-chrome node scripts/sarlavha-qator.mjs <FAYL>` → **0 ta 2 qatorli sarlavha** (uz+ru, 1280×800; uz 2 qator chiqsa — tegmang, hisobotga).
  8 agent parallel ishlaydi: ru-walk Chrome band bo'lib yiqilsa — 1–2 daqiqadan keyin bir marta qayta yurgizing, nuqson deb yozmang.
- Ruscha matn uzunroq bo'lib quti, tugma yoki ekrandan chiqsa — ru ni qisqartiring (CSS ga tegmang). Qisqartirib bo'lmasa — hisobotga (ekran + o'lcham).

### 2-qism — Yakuniy MD (`konveyer/7-YAKUNIY.md` to'liq)
- Namuna: `feedback/F-1005-10modul/YAKUNIY/01-PmOkr.md` (shu loyiha, oldingi modul). Kod — yagona haqiqat; ekran nomi va tartibi uchun yordamchi — MD v3.
- Sarlavha formati aynan `## <raqam> · <ekran nomi>` — soni `SCREEN_META` bilan teng. Keyin `## Nishonlar` · `## Qisqa takrorlash oynalari` · `## Jonli viktorina (12 savol)` · `## Kartochkalar` · `## Yakun`.
- Faqat o'quvchi ko'radigan O'ZBEKCHA matn (ruscha yo'q, mentor paneli yo'q, KOD belgilari yo'q). `npm run lint:til <yakuniy MD>` → 0 error.
- Tasodifiy tekshiruv: kodning `uz:` satrlaridan 30–40 tasi (skript) MD da aynan bormi.
- **Kod ↔ MD v3 farqlari** (sadoqat): ekran soni, mexanika, test to'g'ri javobi, Mentor gapi — MD v3 dan farq qilgan har joy, bittadan qator. Tuzatilmaydi, faqat ro'yxat.
  Asosiy seans 07.10 da kiritgan farqlar (kutilgan, bilib qo'ying): «Yordam» paneli «Bajardim» ostida ochiladi (1, 2, 4, 5, 7) · 8-dars hook gapi «Endi javoblardan birini tanlang.» · 3-dars yakka izoh forma ichida.
- **Shubhali joylar** — kodda ko'rilgan, lekin tuzatilmagan kamchiliklar (mentor aytgan tugma yo'q, atama ikki xil, o'lik shart…). Tuzatilmaydi — asosiy seans sinf-supurish qiladi.

## Chegaralar
- Tahrir: faqat o'z `.jsx` faylingizdagi `ru:` qiymatlari va o'z yakuniy MD faylingiz. Boshqa hech narsa (CSS, uz, kalit, mantiq — yo'q).
- Faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Turn-byudjeti ≤ 90. Savol bermang — ikkilansangiz lug'atga va MD ga eng yaqin yechim, hisobotda yozing.

## Hisobot (qisqa, jadval bilan)
1. RU: ish-ro'yxati soni · o'zgartirilgan ru soni · manual soni · ru-gate · gates · lint:jsx · ru-walk · ko'rilgan ekranlar · lug'atdan tashqari tanlangan atamalar · sig'magan joylar · «ekrandagi nom» tuzatishlari soni.
2. Yakuniy MD: fayl yo'li · ekranlar soni (= SCREEN_META) · tasodifiy tekshiruv N/N · lint:til · kod ↔ MD v3 farqlari · shubhali joylar.
