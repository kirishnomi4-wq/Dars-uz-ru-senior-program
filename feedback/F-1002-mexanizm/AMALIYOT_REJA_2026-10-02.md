# 5-Modul (Telegram bot) — AMALIYOT-DARS REJASI (02.10.2026, F-1002-102)

> Qaror: «Amaliyot-dars qarori — Q1: A · Q2: C · Q3: A · Q4: A» + CusDev: o'quvchilar ulgurmayapti → yuk keskin kamayadi.
> Holat: **kodga tegilmagan.** Tartib: shu reja tasdig'i → repo `TelegramBotNest` (lokal → GitHub) → 5-dars MD v2 (GATE M) → kod.

## 1. Hozirgi holat (o'lchov, 02.10)

| | Texnik 8 dars (1, 3, 4, 5, 6, 7, 9, 10) | PM 4 dars (2, 8, 11, 12) |
|---|---|---|
| Ekran | 20 | 16–18 |
| Amaliyot ekrani | 1 (17-ekranda, «Bajardim» ro'yxati, ish brauzerdan tashqarida, kod shabloni yo'q) | 2 (9–11-ekranda) |
| Yig'ish (builder) ekrani | 1 | 0 |
| Test (jonli ball) | 5 | 3 |
| Uz matn amaliyotgacha | 7 500–10 800 belgi | 4 000–5 300 |
| Uyga vazifa paketi | yo'q | yo'q |

Jami modulda **16 amaliyot ekrani** (8 + 8). Muammo: o'quvchi amaliyotga 45–60 daqiqadan keyin yetadi, amaliyot kodsiz, har dars noldan.

## 2. Yangi tuzilma — dars-dars

Tamoyil: **bir dars = bitta natija** (bot yangi bir narsa qila oladi), **bitta repo** modul boshidan oxirigacha, kodni Antigravity yozadi, o'quvchi buyuradi va Telegramda tekshiradi.

| Dars | Qolip | Amaliyot (natija) | Repo tegi | O'zgarish hajmi |
|---|---|---|---|---|
| 1 Bot nima | 20 ekran, o'zgarmaydi | BotFather'da bot, token | — | yo'q |
| 2 PM | o'zgarmaydi | — | — | yo'q |
| 3 Bot API + tugmalar | 20 ekran | **clone** → `.env` token → `/start` ishladi → `/menu` + 2 inline tugma | `dars-03-done` | faqat amaliyot ekrani |
| 4 Stateful + PostgreSQL | 20 ekran | `foydalanuvchi.holat` ustuni, bot ismni eslab qoladi | `dars-04-done` | faqat amaliyot ekrani |
| **5 Loyiha kuni: AI bilan bot** | **8 ekran + 3 blok** | o'z g'oyasi: reja → 3–4 handler → sinov | `dars-05-done` (namuna) | **to'liq qayta** |
| 6 Bot ichida AI | 20 ekran | `ai/` moduli, Gemini kaliti `.env`, system prompt | `dars-06-done` | faqat amaliyot ekrani |
| **7 Loyiha kuni: bot + DB + AI** | **8 ekran + 3 blok** | buyurtma bazaga, AI javob, deploy — 24/7 | `dars-07-done` | **to'liq qayta** |
| 8 PM | o'zgarmaydi | — | — | yo'q |
| **9 Fikr va iteratsiya** | **8 ekran + 3 blok** | 5 fikr → 1 tuzatish → yangi versiya | `dars-09-done` | **to'liq qayta** |
| 10 AI-agent | 20 ekran | agentga 2 asbob (tekshir, saqla) | `dars-10-done` | faqat amaliyot ekrani |
| 11, 12 PM | o'zgarmaydi | — | — | yo'q |

Amaliyot ekrani soni: 16 → **16** (texnik 8 ta joyida qoladi, lekin har biri repo ustida, kodli va darsning ichida); loyiha kunlarida 1 ekran 3 blokka bo'linadi — bu uch nazorat nuqtasi, uch alohida vazifa emas. Ekran soni: 3 loyiha kunida 20 → 11 (−27 ekran).

## 3. Loyiha kuni qolipi (5, 7, 9) — 8 ekran + 3 blok ≈ 90 daqiqa

| # | Ekran | Daq | Mazmun |
|---|---|---|---|
| 0 | Savol (hook) | 3 | bitta savol, 2 qator |
| 1 | Bugun quramiz | 4 | tayyor natija (chat surati) + 3 qadam reja |
| 2 | Tushuncha 1 | 6 | bitta vizual |
| — | **Amaliyot 1** | 18 | ochish → prompt → ishga tushirish → tekshirish |
| 3 | Test 1 | 4 | jonli ball |
| 4 | Tushuncha 2 | 6 | bitta vizual |
| — | **Amaliyot 2** | 25 | asosiy qurish |
| 5 | Test 2 | 4 | jonli ball |
| — | **Amaliyot 3** | 15 | sinash + «o'zingizniki qiling» (bitta o'z o'zgarishi) |
| 6 | Natija | 3 | podium (bor komponent) |
| 7 | Yakun | 2 | kartochkalar (tushib qolgan tushunchalar shu yerda) + keyingi dars |

Tushib qolgan 9 ekran yo'qolmaydi: tushunchalar kartochkalarga, keyslar YAKUNIY MD ga. Jonli ball: arena QUIZ_BANK (12 savol) test-ekranlarga bog'liq emas; INLINE_KEYS 5 → 2. 5-Modul LMS da yo'q — erkin.

## 4. Amaliyot bloki standarti (har darsda bir xil)

1. **Ochish** — repo yoki fayl (`src/telegram/…`), terminalda `npm run start:dev`.
2. **Antigravity prompt** — nusxalash tugmasi, o'quvchi to'ldiradigan joy `{…}` bilan belgilangan (o'z g'oyasi, menyu, ism).
3. **Ishga tushirish** — terminal xatosiz qayta yuklandi. Xato bo'lsa: xabarni Antigravity'ga qaytarish (4-qadam o'rniga emas, oldidan).
4. **Telegramda tekshirish** — aniq buyruq (`/menu`), kutilgan natija ekranning o'ng tomonida (chat surati). O'quvchi o'zinikini solishtiradi.

Qulf: qadam ochilmaguncha keyingisi ko'rinmaydi, «Avval bajaring» (bor `ScreenLivePractice` mexanikasi). Blok ≈ 15–25 daqiqa. Ortda qolgan o'quvchi: `git checkout dars-0N-start` — sinf bilan tenglashadi.

## 5. Repo `TelegramBotNest` (TypeScript) — spetsifikatsiya

- **Asos:** 4a dagi `IntroNestArxitechture` tuzilishi (NestJS + **TypeORM** + PostgreSQL; 02.10 23:23 tuzatma — avval «Prisma» deb yozilgan edi, 4a aslida TypeORM). Qo'shiladi: `src/api/telegram/` (Telegraf Nest service ichida: `bot.start/command/action/on` — darsdagi shakl), `src/core/entity/` (`users`), `src/infrastructure/database.module.ts`, `.env.example` (`BOT_TOKEN`, `PORT`, `DATABASE_URL`, `GEMINI_API_KEY`), `Dockerfile`, README (uz, «5 daqiqada ishga tushirish», 6 qadam).
- **Holat (02.10 23:23, F-1002-103):** lokalda qurildi `/home/kali/Desktop/TelegramBotNest`, teglar `dars-03-start` · `dars-03-done` · `dars-04-done` tekshirilgan; 5/6/7/9/10 teglari o'z MD'lari bilan. Push — «ha» bilan.
- **Teglar:** `main` = skelet (= `dars-03-start`); har dars `dars-0N-start` / `dars-0N-done`; `dars-05-done` = AvtoPizza namunasi (o'quvchiniki boshqa g'oya bo'ladi).
- **Baza yo'li (HAL: 02.10 23:00, foydalanuvchi):** bepul hosted Postgres (Neon) — bitta `DATABASE_URL`, 4-darsda ochiladi; `sslmode=require` bo'lsa repo SSL ni o'zi yoqadi.
- **Deploy (7-dars):** bepul hosting, `Dockerfile` yoki `Procfile` repoda tayyor.
- **AI (6-dars):** Gemini API kaliti — o'quvchi aistudio.google.com dan o'zi oladi (bepul), `.env` ga yozadi.
- **Tekshiruv:** `nest build` toza, lokalda ishga tushadi; Telegramga ulanish — foydalanuvchi tokeni bilan (chatga yozilmaydi).
- **Joy:** GitHub `Azizbekcrypto/TelegramBotNest`, ochiq (4a bilan bir xil). Push — alohida «ha» bilan.

## 6. Ish tartibi

| Bosqich | Nima | Kim tasdiqlaydi | Natija |
|---|---|---|---|
| 0 | Shu reja | foydalanuvchi | ✅ «ma'qul» (02.10 23:00) |
| 1 | Repo skelet + 7 holat, lokal build | — | ✅ skelet + 3 teg (03-start/03-done/04-done), `nest build` toza; qolgan teglar MD bilan |
| 2 | GitHub push | foydalanuvchi («ha») | ✅ https://github.com/Azizbekcrypto/TelegramBotNest (8 teg) |
| 3 | 5-dars MD v2 (retsept F: 8 ekran + 3 blok, har so'z) | foydalanuvchi — GATE M | ✅ F-1002-105 |
| 4 | 5-dars kod (uz + ru) → gates → surat → ko'rik | foydalanuvchi | ✅ F-1002-106 («ko'rdim yaxshi») |
| 5 | 7-dars, 9-dars — shu qolip (MD → GATE M → kod) | foydalanuvchi | ✅ F-1002-108…113 |
| 6 | 3/4/6/10 amaliyot ekranlari repo ustida (matn + qadamlar) | — | ✅ F-1002-114/115 |
| 7 | YAKUNIY MD sync, QA sayt deploy, uyga vazifa paketi (keyin) | foydalanuvchi | ⏳ qarz (6-Modul fidbekidan keyin) |

Hajm: 3 dars qayta yig'ish ≈ 5-Modulni birinchi yig'ishning 40 %; repo 1 kun. Fidbek davri: kod-darslar to'xtaydi, PM 8/11/12 davom etadi.

## 7. Hal qilinadigan savollar (reja tasdig'i bilan birga yoki repo bosqichida)

1. **Baza:** (a) lokal PostgreSQL — o'rnatish sinfda 15–20 daqiqa olishi mumkin; (b) bepul hosted Postgres (Neon/Supabase) — bitta URL, internet shart; (c) dev uchun SQLite, deployda Postgres — eng oson, lekin 4-dars nomi «PostgreSQL». Tavsiya: **(b)**, 4-darsda bir marta ochiladi. **HAL: (b) Neon** (02.10 23:00).
2. **Hosting (7-dars):** bepul tier bor joy (Railway/Render/Fly) — repo bosqichida sinab, bittasi tanlanadi. **HAL (03.10, F-1002-108): Render Free + webhook** (serverda), laptopda polling.
3. **Loyiha kunida blok soni:** 3 (tasdiqlangan) yoki 2 — 5-dars pilotidan keyin qayta ko'riladi. **HAL: 3** (5/7/9 — foydalanuvchi «ko'rdim yaxshi»).
4. **1-dars:** o'zgarmaydi (Q2 = C), lekin 20 ekran og'ir bo'lsa keyin alohida qisqartiriladi.
