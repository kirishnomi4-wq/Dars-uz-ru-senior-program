# 12-Modul — 3-to'lqin: RU sayqal + yakuniy MD (12 dars, har dars — bitta agent)

> Foydalanuvchi ruxsati: 07.10.2026 ~21:40 (F-1006-389) — «A: 12 agent, 6+6» (avval 1-to'lqin, tekshiruvimdan keyin 2-to'lqin).
> Har agent — faqat o'z darsi. Commit, push, deploy — YO'Q. App.jsx, MD v3, skelet (`src/skelet`), qolip (`src/qolip/*`), boshqa darslar — tegilmaydi.
> Naqsh — 11-Modul `feedback/F-1005-11modul/QURUVCHI_TOPSHIRIQ_3.md` (07.10, 16/16 toza yopilgan) — farqlari shu faylda.

| Dars | Kalit | Fayl (`src/10-Modull/`) | MD v3 (`feedback/F-1006-12modul/`) | Yakuniy MD (`feedback/F-1006-12modul/YAKUNIY/`) | To'lqin |
|---|---|---|---|---|---|
| 1 | m10-01 | `PmLandingLesson.jsx` | `01-PmLanding-v3.md` | `01-PmLanding.md` | 2 |
| 2 | m10-02 | `WebSocketBasicsLesson.jsx` | `02-WebSocketBasics-v3.md` | `02-WebSocketBasics.md` | 1 |
| 3 | m10-03 | `PmRealtimeSpecLesson.jsx` | `03-PmRealtimeSpec-v3.md` | `03-PmRealtimeSpec.md` | 1 |
| 4 | m10-04 | `LiveNotifyDayLesson.jsx` | `04-LiveNotifyDay-v3.md` | `04-LiveNotifyDay.md` | 1 |
| 5 | m10-05 | `BreakAndFixLesson.jsx` | `05-BreakAndFix-v3.md` | `05-BreakAndFix.md` | 1 |
| 6 | m10-06 | `PmChannelsLesson.jsx` | `06-PmChannels-v3.md` | `06-PmChannels.md` | 2 |
| 7 | m10-07 | `PmFiftyUsersLesson.jsx` | `07-PmFiftyUsers-v3.md` | `07-PmFiftyUsers.md` | 1 |
| 8 | m10-08 | `PmDropOffLesson.jsx` | `08-PmDropOff-v3.md` | `08-PmDropOff.md` | 1 |
| 9 | m10-09 | `RetentionDayLesson.jsx` | `09-RetentionDay-v3.md` | `09-RetentionDay.md` | 2 |
| 10 | m10-10 | `PmUsersCheckLesson.jsx` | `10-PmUsersCheck-v3.md` | `10-PmUsersCheck.md` | 2 |
| 11 | m10-11 | `PmPitchReviewLesson.jsx` | `11-PmPitchReview-v3.md` | `11-PmPitchReview.md` | 2 |
| 12 | m10-12 | `PmGrowthPitchLesson.jsx` | `12-PmGrowthPitch-v3.md` | `12-PmGrowthPitch.md` | 2 |

Yakuniy MD nomi qat'iy: `NN-<fayl nomi Lesson siz>.md` — `npm run modul:yopish` shu nom bilan topadi va `## <raqam> ·` sarlavhalar sonini `SCREEN_META` bilan solishtiradi.
`S` — topshiriqda berilgan scratchpad yo'li. Vaqtinchalik fayllar faqat `$S/<NN>-ru/`, `$S/<NN>-yakuniy/`.
Dars serveri — **5174** (`http://127.0.0.1:5174`); 5173 — boshqa loyiha, tegilmaydi. Dev serverni o'zingiz ishga tushirmang va to'xtatmang.

## Tartib: avval RU, keyin yakuniy MD

### 1-qism — RU sayqal (`konveyer/6-RU.md` to'liq, quyidagi farqlar bilan)
- Ish-ro'yxati skeletga nisbatan (fayl git'da bor, lekin HEAD dagi ru ham quruvchiniki):
  `node konveyer/vositalar/ru-wl.mjs <FAYL> $S/<NN>-ru/wl.json --base=src/skelet/NamunaDars.jsx`. Hamma bandda `ruByBuilder` — quruvchining qoralamasi.
  Vazifa — har birini YANGI `uz` ga qarab tekshirish va yaxshilash (ma'no, «Вы», tabiiy ruscha, uzunlik, lug'at). To'g'ri bo'lsa — o'zgarishsiz qoldiring.
- `cp <FAYL> $S/<NN>-ru/base.jsx` — tarjimadan OLDIN (ru-gate uchun uz-etalon).
- `uz` ga bitta belgi ham tegilmaydi (ru-gate TENG). Kalitlar, `correct`, `INLINE_KEYS`, analitika-payload, `storageKey` — o'zgarmaydi.
- **Ekrandagi nom = matndagi nom.** Mentor gapi, «Нажмите …», savol yoki izoh ekrandagi tugma/maket yorlig'iga ishora qilsa,
  ru matnda shu element ru rejimida QANDAY ko'rinsa — AYNAN shunday yoziladi. Maket `{ uz: 'Ulanmoqda…', ru: 'Подключается…' }` bo'lsa — «значок «Подключается…»», «Ulanmoqda…» emas.
  O'lchov (07.10): 2, 3, 5-darslarda ru gaplarda «Ulanmoqda…», «Ulangan» — maketda esa «Подключается…», «Подключено». Dars tugmasi «Bajardim» ru da — «Готово».
  **Istisno — talab va kod:** agentga yuboriladigan talab matni, kod bloklari, `ru-qoldiq-istisno` izohli satrlar — Mentor repo'sidagi real qiymat (o'zbekcha) qoladi (6-RU qoida 4).
  Bir ekranda talab «Qo'shilaman» desa, maket esa «Присоединяюсь» ko'rsatsa — talabda birinchi tilga olishda qavsda ruschasi: «кнопка «Qo'shilaman» («Присоединяюсь»)». Shubhali holat — hisobotga.
- **Modul lug'ati (12 dars bir xil yozishi uchun — majburiy; o'lchov — 07.10 kodidagi ru sanog'i, ko'pchilik va 9–11-Modul):**

| uz | ru | ishlatilmaydi |
|---|---|---|
| «Maydon Jamoa» (Mentor ilovasi) | «Maydon Jamoa» (lotincha, qo'shtirnoqda) | Майдон |
| «Yordam» (tugma, panel) | «Подсказка» (platforma: PM darslar va 10, 11-Modul; 12-Modulda hozir «Помощь» 27 joy — almashtiriladi) | «Помощь» |
| Mentor · amaliyot · «Bajardim» | Ментор · практика · «Готово» | «Сделал» (tugma ma'nosida) |
| real vaqt · real vaqtda yangilanadi | реальное время · обновляется в реальном времени | реалтайм, real-time, онлайн |
| ulanish · doimiy ulanish | соединение · постоянное соединение (219 joy) | подключение (ot ma'nosida), канал, туннель |
| ulanish holatlari: ulangan · ulanmoqda · ulanmagan | «Подключено» · «Подключается…» · «Не подключено» (maket yorlig'i) | Онлайн, Офлайн, «Подключение…» |
| qayta ulanish | переподключение | reconnect, повторное подключение |
| WebSocket · socket.io · gateway | WebSocket · socket.io · gateway (lotincha) | вебсокет, сокет (yolg'iz), шлюз |
| hodisa · tinglovchi · xona | событие · слушатель · комната | ивент, обработчик (prozada), room |
| takror hodisa | повторное событие | дубль, дубликат |
| chekka holat | крайний случай | граничный случай, edge case |
| real vaqt talabi · talab (agentga) · agent · prompt | требование к реальному времени · требование · агент · промпт | ТЗ, спецификация, мини-PRD |
| hozir ko'ryapti | «Сейчас смотрят: N» | онлайн, в сети |
| jonli xabar | живое сообщение | тост, всплывающее уведомление, пуш |
| eslatma (rejalashtirilgan · Backend yuboradigan · o'yin eslatmasi) | напоминание (запланированное · от Backend · напоминание об игре) | уведомление, пуш (eslatma ma'nosida) |
| buzish · buzish yozuvi · tekshirish | поломка (ломаем) · запись поломки · проверка | взлом, хак, тест (o'z ishini tekshirish ma'nosida) |
| sinov (faqat real odam bilan) · besh soniyalik sinov | тест · пятисекундный тест | испытание |
| lending · asosiy tugma · sahifa matni · foyda | лендинг · главная кнопка · текст страницы · польза | лэндинг, CTA (ko'prikdan tashqari), выгода, копирайтинг |
| kanal · post (yuboriladi) | канал · пост (отправляют) | реклама, публикуют (post uchun) |
| ro'yxatdan o'tgan · asosiy harakatni qilgan | зарегистрировавшиеся · сделавшие основное действие | главное действие, активные пользователи, DAU |
| bosqich (50 ga reja) · qadam (foydalanuvchi yo'li) | этап · шаг | воронка (kartochkadagi bitta ko'prikdan tashqari) |
| to'xtab qolish qadami | шаг, где останавливаются | точка оттока, drop-off |
| qurilma ID · mehmon ko'rinishi | ID устройства · гостевой вид | ID пользователя, гостевой режим |
| qaytganlar foizi | процент вернувшихся | доля вернувшихся, retention (kartochkadagi ko'prikdan tashqari) |
| zaxira reja · metrika hisoboti · sanoq sahifasi | запасной план · отчёт по метрикам · страница подсчёта | резервный план, дашборд (ko'prikdan tashqari) |
| bosh raqam | главное число (9–11-Modul: 31 joy) | главная цифра |
| da'vo · dalil · manba · qachon | утверждение · довод · источник · когда | заявление, доказательство (dalil ma'nosida — faqat «довод, не доказательство» qarama-qarshiligida) |
| tuzatilgan pitch · o'sish grafigi · halol gap | исправленный питч · график роста · честная фраза | — |
| pitch · zal · keyingi qadam (pitch bo'lagi) | питч · зал · «Следующий шаг» | — |
| Mentor tekshiruvi: qabul · tuzatish | проверка Ментора: принять · исправить | — |
| yakkama-yakka | встреча один на один | 1:1, one-on-one |
| Backend · Database · deploy | Backend · Database (lotincha) · деплой | бэкенд, база данных, deploy (ruscha gapda) |
| APK · brauzer ko'rinishi · login | APK · браузерная версия · логин | apk-файл, PWA (bu ma'noda), никнейм |
| e'lon (faqat o'yin e'loni) · tashkilotchi · o'yinchi | объявление · организатор · игрок | админ |
| AI (oddiy matnda) | ИИ | — |

- **1-to'lqin saboqlari (07.10, 02, 03, 04, 05, 07, 08 hisobotlaridan) — lug'atga QO'SHIMCHA, majburiy:**

| uz | ru | ishlatilmaydi |
|---|---|---|
| talab bo'limi «nima buzilmasin» | «Что не сломать» (11 faylda, 41 joy) | «Что не должно сломаться» |
| tekshiruv akkaunti · namuna akkaunt | проверочный аккаунт · аккаунт-образец | тестовый аккаунт |
| maket yorliqlari: «O'yinlar» · «O'yin» · «Kirish» · «Kelaman» · «Hisobdan chiqish» · «1 · Ochish» | «Игры» · «Игра» (экран игры) · «Вход» · «Приду» · «Выйти из аккаунта» · «1 · Открыть» | — |
| agentga yuboriladigan buyruq (o'quvchi nusxalaydi) | ruscha — 11-Modul 8 darsda shunday: «Вышла такая ошибка: {ошибка}. Исправь.» · «Продолжай» | ru matn ichida o'zbekcha «Shu xato chiqdi…» |

  Istisno: `{…}` joy-belgisini kod o'zi to'ldirsa (`toldir`, `replace`) — kalit o'zgarmaydi (grep bilan tekshiring). Kod natija oynasi (o'quvchi kodining chiqishi — `index.html` o'zbekcha) — o'zbekcha qoladi, `ru-qoldiq-istisno sN:` bilan.
  6-dars: Mentorning birinchi posti ruschasini 7-dars aynan nusxalagan — o'zgartirsangiz, hisobotda «1-post ru o'zgardi» deb aniq yozing (asosiy seans 7-darsni moslaydi).
  Darslararo nom: «Keyingi dars» ru nomi keyingi darsning `LESSON_META.lessonTitle.ru` bilan aynan bo'lsin (grep bilan tekshiring).
  Skelet satrlari («Дождитесь наставника», «Заметка ментору», «Badges — N/4») — platforma standarti: **tegilmaydi**, hisobotda takrorlamang.
  Kod mantig'i (tekshiruv regex'lari faqat o'zbekcha so'zni taniydi, `tr()` siz satr, bir tilli `{ t: … }`) — tuzatilmaydi, «Shubhali joylar»ga aniq qator raqami bilan; asosiy seans sinf-supurish qiladi.
  Lug'atda yo'q atama — avval oldingi modullardagi ruschani qidiring (`grep -oh "ru: [^}]*<so'z>" src/9-Modull/*.jsx src/8-Modull/*.jsx src/7-Modull/*.jsx`), keyin tanlang va hisobotga yozing.
- **`ru-qoldiq-istisno`**: ru-walk «qoldiq» ko'rsatsa, kod oynasidagi nom/terminal satri (`ulanish.on`, `gap`, `git status`) — kod, tarjima qilinmaydi;
  faylda izoh-e'lon: `// ru-qoldiq-istisno s9: gap` — faqat shu ekran; ekransiz — butun dars; faqat kod/terminal nomlari uchun, o'quvchi gapi uchun EMAS; izoh oddiy JS qatorida — shablon-satr yoki JSX ichida emas.
  `SANA_SOZ` (10, 12-darslar) — `lint:til` soxta signalini chetlab o'tish, tegilmaydi.
- Darvozalar: `node tools/ru-gate.mjs $S/<NN>-ru/base.jsx <FAYL>` → **TENG** · `npm run gates -- <FAYL>` → 12/12 · `npm run lint:jsx` → 0 (o'z faylingiz) ·
  `timeout 900 env CHROME_PATH=/usr/bin/google-chrome node tools/ru-walk.mjs <FAYL> --langs=ru --shots` → **✓ TOZA**; 5–6 ta ekranni (eng zichlarini) Read bilan ko'ring ·
  `timeout 900 env CHROME=/usr/bin/google-chrome node scripts/sarlavha-qator.mjs <FAYL>` → **0 ta 2 qatorli sarlavha** (uz+ru, 1280×800; uz 2 qator chiqsa — tegmang, hisobotga).
  6 agent parallel ishlaydi: ru-walk Chrome band bo'lib yiqilsa — 1–2 daqiqadan keyin bir marta qayta yurgizing, nuqson deb yozmang.
- Ruscha matn uzunroq bo'lib quti, tugma yoki ekrandan chiqsa — ru ni qisqartiring (CSS ga tegmang). Qisqartirib bo'lmasa — hisobotga (ekran + o'lcham).

### 2-qism — Yakuniy MD (`konveyer/7-YAKUNIY.md` to'liq)
- Namuna: `feedback/F-1005-11modul/YAKUNIY/01-PmTenIdeas.md` (PM) va `07-LivePrototype.md` (Kod/Proyekt) — oldingi modul. Kod — yagona haqiqat; ekran nomi va tartibi uchun yordamchi — MD v3.
- Sarlavha formati aynan `## <raqam> · <ekran nomi>` — soni `SCREEN_META` bilan teng. Keyin `## Nishonlar` · `## Qisqa takrorlash oynalari` · `## Jonli viktorina (12 savol)` · `## Kartochkalar` · `## Yakun`.
- Faqat o'quvchi ko'radigan O'ZBEKCHA matn (ruscha yo'q, mentor paneli yo'q, KOD belgilari yo'q). `npm run lint:til <yakuniy MD>` → 0 error.
- Tasodifiy tekshiruv: kodning `uz:` satrlaridan 30–40 tasi (skript) MD da aynan bormi.
- **Kod ↔ MD v3 farqlari** (sadoqat): ekran soni, mexanika, test to'g'ri javobi, Mentor gapi — MD v3 dan farq qilgan har joy, bittadan qator. Tuzatilmaydi, faqat ro'yxat.
  Asosiy seans kiritgan farqlar (kutilgan, bilib qo'ying): yakunda «Bugungi asosiy fikr» ko'rsatilmaydi (SABOQ E 50) · «Maydon Jamoa» nomi `#2E9E4F` ·
  6-dars 4-ekran telefoni kattaroq (post matni o'qilishi uchun) · 8, 11-dars «hech biri» yakun sarlavhasi E 54 bo'yicha (MD v3 da ham yangilangan) ·
  11-dars 6, 7-ekran: da'volar saqlanmagan bo'lsa — izoh + «Da'volarni belgilash» tugmasi · 9-dars 1-blok «Davom etish» faqat 4-banddan keyin.
- **Shubhali joylar** — kodda ko'rilgan, lekin tuzatilmagan kamchiliklar (mentor aytgan tugma yo'q, atama ikki xil, o'lik shart…). Tuzatilmaydi — asosiy seans sinf-supurish qiladi.

## Chegaralar
- Tahrir: faqat o'z `.jsx` faylingizdagi `ru:` qiymatlari va o'z yakuniy MD faylingiz. Boshqa hech narsa (CSS, uz, kalit, mantiq — yo'q).
- Faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Turn-byudjeti ≤ 90. Savol bermang — ikkilansangiz lug'atga va MD ga eng yaqin yechim, hisobotda yozing.

## Hisobot (qisqa, jadval bilan)
1. RU: ish-ro'yxati soni · o'zgartirilgan ru soni · manual soni · ru-gate · gates · lint:jsx · ru-walk · ko'rilgan ekranlar · lug'atdan tashqari tanlangan atamalar · sig'magan joylar · «ekrandagi nom» tuzatishlari soni.
2. Yakuniy MD: fayl yo'li · ekranlar soni (= SCREEN_META) · tasodifiy tekshiruv N/N · lint:til · kod ↔ MD v3 farqlari · shubhali joylar.
