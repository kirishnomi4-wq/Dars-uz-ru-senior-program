# 6-Modul · Repo topshirig'i — TelegramBotNest davomi (05.10.2026, F-1004-64, GATE M M-q3/q7/q8/q9)

Repo: `/home/kali/Desktop/TelegramBotNest` (Nest 11 + TypeORM + telegraf + Gemini; `main` = `dars-10-done` `3eb3333`, `origin` = github.com/Azizbekcrypto/TelegramBotNest).
Siz repo'ni 6-Modul darslari tartibida «o'quvchi bloklarni bajargach qanday bo'lsa» holatiga keltirasiz — har dars uchun `start` va `done` tegi bilan.
Dars kodi (`/home/kali/Desktop/internetLesson`) — TEGILMAYDI (faqat o'qiladi). **Push qilmaysiz** (asosiy seans tekshirib push qiladi).

## Manba (bir marta o'qing)
- `feedback/F-0929-QA-6modul/GATE_M_JAVOB.md` — **M-q3 yagona nomlar** (MD bilan zid bo'lsa — shu yutadi): body `taom` (+ `manzil`) · ustun `manba` = `sayt`/`bot`/`mobil` ·
  mobil ilovada `BACKEND` (`mobile/config.js`) · `GET /menyu` faqat 8-darsda · `kirish` ustuni yo'q · `API_URL` yo'q.
- Har darsning MD v3 «REPO» bo'limi va amaliyot bloklaridagi promptlar/kutilgan natijalar: `04-AgentArchitecture-v3.md`, `08-PipelineProject-v3.md`,
  `09-ReactNativeBasics-v3.md`, `10-ReactNativeApp-v3.md`, `11-MobileAppPractice-v3.md`, `13-FullSystemProject-v3.md` (hammasi `feedback/F-0929-QA-6modul/`).
  Parallel quruvchi agentlar shu MD'larga GATE M qarorlarini qo'shishi mumkin — siz faqat o'qiysiz.
- Repo'ning o'zi: `README.md`, `src/api/*`, `src/core/entity/*`, `src/config/index.ts`, `.env.example`.

## Tartib (har dars)
`04 → 08 → 09 → 10 → 11 → 13`. Har biri: `git tag dars-6-NN-start` (joriy HEAD) → REPO bandlari → tekshiruv → commit `6-NN-dars: <qisqa>` (`git add <aniq fayllar>`, `-A` emas) →
`git tag dars-6-NN-done`. 5-Modul ustunlari/nomlari (`buyurtmalar.pitsa` va h.k.) O'ZGARTIRILMAYDI — 5-Modul darslari ularga tayanadi; yangi nom faqat qo'shiladi
(masalan body `taom` → mavjud ustunga yoziladi; `manba` — yangi ustun, default `bot`).
- 09: `mobile/` ni o'quvchi o'zi yaratadi (`create-expo-app`) — tegdagi `mobile/` faqat zaxira (ortda qolgan uchun), minimal va ishlaydigan.
- web/ (8-dars) va mobile/ (9–11) — `node_modules` commit qilinmaydi (`.gitignore`).
- `.env` yo'q va commit qilinmaydi; yangi o'zgaruvchi bo'lsa — `.env.example` ga.

## Tekshiruv (har dars)
`npm run build` toza (backend) · web/mobile JS fayllari: `npx esbuild <fayl> --loader:.js=jsx --bundle=false` sintaksis toza (yoki o'z build'i, tarmoq bo'lsa) ·
endpointlar: Nest'ni DB'siz ko'tarib bo'lmasa — controller/service kodini o'qib tekshiring va hisobotda «ishga tushirib sinalmadi» deb yozing (halol).

## Hisobot
1. Teglar va commitlar jadvali (teg → commit → nima qo'shildi).
2. Har dars: darsdagi matn aynan aytishi kerak bo'lgan narsalar — fayl yo'llari, endpoint, body maydonlari, terminal/curl chiqishi, `git fetch …--tags` / `git checkout -f …` qatorlari.
3. MD'dan chetlashishlar (sabab bilan) — dars quruvchisi matnni shunga moslashi kerak bo'lgan joylar (dars · ekran · eski → yangi).
4. Sinalmagan narsalar (halol). Turn-byudjeti ≤120. Vaqtinchalik fayllar — scratchpad ichida `repo-6/`.
