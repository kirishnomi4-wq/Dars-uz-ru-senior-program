# 6-Modul (LMS: 8-Modul) · 8-dars «Loyiha kuni: to'liq pipeline» — MD v3 (G3, loyiha kuni qolipi)

Fayl: `src/6-Modull/PipelineProjectLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** (21 edi) · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `08-PipelineProject-v2.md` (mavzu saqlanadi) · qolip: 172-qonun (8 + 3) va 173-qonun (blok repo ustida) · namuna: `feedback/F-1002-mexanizm/05-BotAiProject-v2.md`.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi — `.jsx` ga hozir tegilmaydi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: 3-ekran = eski s4 kaliti **D**, 5-ekran = eski s12 kaliti **B**; arena 12 savol — o'rinlar kodda qanday bo'lsa (A·B·C·D ×3).
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58 (A1 ≈ 20 · A2 ≈ 23 · A3 ≈ 15).
Menyu nomi (DE-205): App.jsx `m6-08` — «Loyiha kuni: to'liq pipeline» (GATE M 08-q0; App.jsx ni asosiy seans o'zgartiradi) · oldingi dars m6-07 «O'z Skill'ingizni yozing» · keyingi m6-09 «React Native — asoslari».

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida o'quvchining `TelegramBotNest` repo'sida **sayt** ishlaydi: menyu Backend'dan keladi, «Buyurtma» bosilsa —
   buyurtma Database'ga yoziladi va admin Telegram'da xabar oladi; saytdagi savolga AI javob beradi. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
   Bot, Database va AI repo'da 5-Moduldan tayyor — bugungi yagona yangi narsa: **sayt va uni Backend orqali qolgan qismlarga ulash**.
2. **Bugungi asosiy fikr (P-013):** Qismlar bir-biriga ma'lumot uzatsa, ular bitta tizim bo'lib ishlaydi; har ulanishni alohida sinab quramiz.
3. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **sayt** — React ilova (`web/` papka, `localhost:5173`); 1-darsdagi Frontend. Tugunda: «Sayt · React».
   - **Backend** — NestJS server (`localhost:3000`). Tugunda: «Backend · Node.js». Prozada «server» ishlatilmaydi (faqat sayt ichidagi xabar matnida — T-008).
   - **Database** — PostgreSQL, `buyurtmalar` jadvali (1-dars bilan bir xil so'z; «baza» yo'q).
   - **Bot** — Telegram bot; bugun u **admin**ga xabar yuboradi. **AI** — Gemini (repo'dagi `AiService`).
   - **ulanish** — ikki qism orasidagi bog' (Sayt–Backend, Backend–Database, Backend–Bot, Backend–AI).
   - **oqim** — ma'lumotning qismdan qismga o'tishi; **pipeline** = shu oqimning nomi (2-ekranda, harakatdan keyin tug'iladi — T-011).
   - **sinash** (test qilish/testlash emas); **end-to-end test** — kartochkada bir marta.
   - «yo'l» so'zi faqat «kirish yo'li» ma'nosida (1-dars: sayt, bot, mobil — bitta Backend), oqim uchun ishlatilmaydi (T-015).
4. **Metafora yo'q.** «Direktor», shahar (Peshtoq/Arxiv/Darvoza) — olingan (v2 qarori saqlanadi).
5. **Kod yozish — Antigravity** (5-Moduldan tanish, 173.1). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* deydi (173.4); texnologiya repo'da.
   Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
6. **Toza yuza (185, D4):** tugma va variantlarda emoji yo'q; xarita chizilgan (CSS/SVG), logotip yo'q; rang — faqat holat foni (D3).

## Darsning ipi va bitta vizual

- **Misol-ip:** AvtoPizza (repo namunasi, 5-Moduldan) — 8, 9–11, 13-darslar shu bitta Backend ustida. O'quvchi o'z botining menyusi bilan ishlaydi;
  kutilgan natija doim AvtoPizza bilan ko'rsatiladi: Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 so'm (`menyu.ts` dan).
- **Hook:** saytda «Buyurtma» bosildi — admin bilmadi → «Nima yetishmayapti?» → ulanish.
- **Bitta vizual — oqim xaritasi (`PIPE_NODES`, dars bo'yi, 163/180):**
  - Chapda **Sayt · React** — ichida kichik brauzer maketi (`localhost:5173`): «AvtoPizza», 3 ta taom kartasi «Buyurtma» tugmasi bilan, pastda savol qutisi.
  - O'rtada **Backend · Node.js** (`localhost:3000`).
  - O'ngda uchta tarmoq: **Database · PostgreSQL** (kichik jadval `buyurtmalar`, qatorlar soni) · **Bot · Telegram** (admin chati) · **AI · Gemini** (javob pufagi).
  - Holatlar — tugun: kulrang (ulanmagan) → oq (ulangan) → accent (joriy) → yashil (ishladi); chiziq: uzuq (bugun ulanadi) → to'liq → yashil → qizil uzuq (uzilgan).
  - Konvert ikki shaklda: **buyurtma** (kichik to'rtburchak) va **savol** (pufak). `prefers-reduced-motion` da konvert sakraydi.
  - Ishlatilishi: 0 (ulanmagan) · 1 (tayyor, hammasi yashil) · 2 (oqimni yuritish) · 4 (uzilgan ulanishni topish). A1/A3 o'ng tomoni — Sayt maketining kattasi,
    A2 — Bot tugunidagi admin chatining kattasi (bitta manba).
- **Yakun:** sayt, bot va AI bitta Backend orqali ishlaydi · keyingi dars — React Native (telefon ilovasi ham shu Backend'ga ulanadi — 9–11-darslar).

---

## 0 · Kirish — buyurtma adminga yetmadi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Saytda «Buyurtma» bosildi. Admin nega bilmadi?** (46)
- Mentor: Sayt, Backend, Database, bot va AI oldingi modullarda qurilgan — maketda «Buyurtma»ni bosib ko'ring.
- Maket (chap): oqim xaritasi **ulanmagan** holatda — 5 tugun alohida, orasida chiziq yo'q; Sayt maketida 3 taom, `buyurtmalar` jadvali «0 qator», admin chati bo'sh.
- **Harakat → Vizual o'zgarish:** «Buyurtma» bosish → tugma bosiladi, lekin konvert hech qayerga ketmaydi: Backend kulrang qoladi, jadvalda 0 qator, admin chati bo'sh;
  tugunlar orasidagi bo'sh joylar bir lahza miltillaydi. Shundan keyin savol ochiladi.
- Savol: **Nima yetishmayapti?**
  - Bot buzilgan — uni qaytadan yozish kerak
  - ✔ Ulanish — sayt Backend'ga ma'lumot bermaydi
  - Ko'proq qism kerak — masalan, yana bitta bot
- Javob — 2-variant: **Aynan!** Har qism o'zicha ishlaydi, lekin bir-biriga ma'lumot uzatmaydi. Bugun shu ulanishlarni quramiz. (95)
- Javob — 1 yoki 3: **Qiziq fikr!** Bot ham, sayt ham ishlaydi — ular orasida ulanish yo'q. Bugun shu ulanishlarni quramiz. (87)
- Javobdan keyin: xaritada to'rtta uzuq chiziq paydo bo'ladi (Sayt–Backend, Backend–Database, Backend–Bot, Backend–AI) — bugun ulanadigan joylar (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ v2 0-ekran: «Alohida / Ulangan» matn-kartalari → maketda o'quvchi o'zi bosib ko'radi (184) · sarlavha 2 qator → 1 (46) · hook javobi 143/175 → 95/87 (162) ·
  variantlar «Hech narsa — har biri alohida yaxshi ishlaydi» → «Bot buzilgan…», «Ko'proq yangi komponent» → «Ko'proq qism kerak…» (haqiqiy noto'g'ri taxminlar; 40 · 43 · 44) · «Kodni AI yordamida yozamiz…» gapi 1-ekranga.

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida sayt, bot va AI bitta tizimda ishlaydi.** (52)
- Mentor: AvtoPizza — namuna; siz o'z botingiz menyusi bilan quryapsiz. Kodni Antigravity yozadi, siz har ulanishni sinaysiz.
- Chap — «Dars oxirida»: oqim xaritasi **tayyor** holatda (hammasi yashil), konvert bir marta o'zi yuradi (DE-200):
  - Sayt maketi: AvtoPizza · Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 so'm · «Buyurtma» · savol qutisi
  - Database: `buyurtmalar` — `sayt · Pepperoni · Chilonzor, 12-uy`
  - Bot (admin chati): «Yangi buyurtma (sayt): Pepperoni — 55 000 so'm · Chilonzor, 12-uy»
  - AI: «Qaysi pitsa achchiq emas?» → «Margarita va Pishloqli achchiq emas.»
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Sayt menyuni Backend'dan oladi
  - 02 · Buyurtma Database'ga yoziladi, admin xabar oladi
  - 03 · Saytdagi savolga AI javob beradi, butun oqim sinaladi
- Pastki qator (mono, kichik): repo `TelegramBotNest` · boshlang'ich holat `dars-6-08-start` · tayyor namuna `dars-6-08-done`
- Tugmalar: Orqaga · Boshlaymiz
✎ v2 1-ekran (5 qadamli ro'yxat + «Bugungi maqsad» bloki) → tayyor natija xaritasi + 3 qadam (172). «Ulanishlarni AI yordamida yozamiz» — Mentor gapida.
  v2 2-ekran «5 qism» kartalari → xarita tugunlari (nom + texnologiya) — alohida ekran kerak emas.

## 2 · Buyurtma qayerga boradi?  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · oqim
- Sarlavha: **Buyurtma Backend'dan keyin qayerga boradi?** (42)
- Mentor: Konvertni siz yo'naltirasiz — avval o'zingiz belgilab ko'ring, keyin «Buyurtma»ni bosing.
- Bashorat (ballsiz, 181): **Backend buyurtmani nechta qismga uzatadi?** · Bittaga · Ikkitaga · Uchtaga — tanlov saqlanadi.
- **Harakat → Vizual o'zgarish:** Sayt maketida «Buyurtma» → konvert Sayt → Backend'ga uchadi va to'xtaydi; Database, Bot, AI tugunlarida pulsatsiya halqasi (168).
  O'quvchi tugunni bosadi:
  - Database → konvert jadvalga tushadi, `sayt · Pepperoni` qatori paydo bo'ladi, chiziq yashil;
  - Bot → admin chatida «Yangi buyurtma (sayt): Pepperoni» pufagi, chiziq yashil;
  - AI → tugun silkinadi, bir qator: «Buyurtma AI'ga bormaydi — AI savolga javob beradi.» (51)
  Ikki tarmoq yashil bo'lgach Sayt maketida savol qutisi yonadi: «Qaysi pitsa achchiq emas?» → «Yuborish» → pufak Sayt → Backend → AI ga boradi va
  javob bilan qaytadi: «Margarita va Pishloqli achchiq emas.» (3/3)
- Joriy qator (xarita ostida, 3/3 dan keyin, bitta): Ma'lumotning qismdan qismga shunday o'tishi **pipeline** deyiladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: ikkitaga — Database va Bot» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Pipeline — ma'lumot oqimi. U Backend'dan tarmoqlanadi: buyurtma ikki qismga, savol AI'ga boradi. (96)
- Tugadi (199): harakat paneli yopiladi, xarita butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugma (pastki): Oqimni yuring (N/3) → Davom etish
✎ v2 3-ekran (oqim qadamlari «▶ Buyurtmani boshlash · Keyingi qadam») + 7-ekran (ulanishlar o'yini, «prompt yuborish» → ulanish yonadi) → bitta harakat:
  o'quvchi oqimni o'zi yo'naltiradi, tarmoqlanishni o'zi topadi (184) · bashorat qo'shildi · pipeline ta'rifi harakatdan keyin (T-011) ·
  v2 xulosa «Hamma narsa bitta uzun zanjir emas…» (122) → 96.

## A1 · Amaliyot 1 — sayt menyuni Backend'dan oladi  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · Sayt → Backend
- Sarlavha: **Sayt menyuni Backend'dan olsin.** (31)
- Mentor: Menyu saytda qayta yozilmaydi — u bitta joyda turadi; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. Terminalda: `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags`,
     keyin `git checkout dars-6-08-start -- web` (sayt qolipi keladi, botingizga tegmaydi),
     keyin `cd web`, `npm install`, `npm run dev`. Ikkinchi terminalda: `npm run start:dev` — «Telegram bot ulandi» chiqsin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Backend'da `GET /menyu` yarat: `src/api/menyu.ts` dagi ro'yxatni qaytarsin — har taomning nomi va narxi.
     > `main.ts` da faqat `http://localhost:5173` uchun CORS'ni yoq.
     > `web/src/App.jsx`: sarlavha **{saytingiz nomi}**. Sahifa ochilganda `http://localhost:3000/menyu` dan menyuni olsin,
     > har taomni karta qilib ko'rsatsin: nom, narx, «Buyurtma» tugmasi (hozircha hech narsa qilmaydi).
     > Botdagi kod o'zgarmasin.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi, xato yo'q. Brauzerda `localhost:3000/menyu` ni oching — ro'yxat chiqadi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — `localhost:5173` ni yangilang: menyu kartalari chiqadi. `menyu.ts` da bitta narxni o'zgartiring — saytda ham o'zgaradi.
- O'ng tomon — «kutilgan natija · namuna: AvtoPizza» (brauzer maketi `localhost:5173`):
  - AvtoPizza
  - Margarita · 45 000 so'm · [Buyurtma]
  - Pepperoni · 55 000 so'm · [Buyurtma]
  - Pishloqli · 50 000 so'm · [Buyurtma]
- Hammasi bajarilgach (yashil): Menyu Backend'dan keldi — Sayt va Backend ulandi. (49)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags` · `git checkout -f dars-6-08-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 17-ekran (VS Code, `frontend`/`backend` papkalari — o'quvchida yo'q edi) 1–3-bosqichi → repo ustida, Antigravity bilan (173) ·
  v2 8-ekran «Prompt sifati» → prompt qutisining o'zi (qayerda · nima qilsin · nima o'zgarmasin), arena 5 va kartochka 10 ·
  4-qadam: narxni `menyu.ts` da o'zgartirish — ma'lumot Backend'dan kelayotganini o'quvchi o'zi ko'radi.

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Saytdan buyurtma keldi. Backend uni qayerga uzatadi?**
  - Faqat adminga, Telegram orqali — u yozib oladi
  - Avval Telegram'ga, Telegram esa Database'ga
  - Faqat Database'ga — admin o'zi kirib qaraydi
  - ✔ Database'ga ham, Telegram orqali adminga ham
- Kalit: **D** (index 3 — eski s4 o'rni). Variantlar: 46 · 43 · 44 · 44 belgi.
- To'g'ri izohi: Oqim Backend'dan tarmoqlanadi: buyurtma saqlanadi, admin xabar oladi.
- Xato izohlari (≤60):
  - A: Telegram xabari — eslatma. Buyurtma qayerda saqlanadi? (54)
  - B: Telegram xabar yetkazadi — u Database'ga yozmaydi. (50)
  - C: Admin jadvalni kuzatib turmaydi — yangisini qanday biladi? (58)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ v2 4-ekran «"Pipeline" nima degani?» (ta'rif) → vaziyat-savol: darsning asosiy topilmasi — oqim tarmoqlanadi (F-0929-10 TEXNIK) · ta'rif-savol arenada qoladi (1-savol).
  Kalit o'rni (D) o'zgarmadi.

## 4 · Qaysi ulanish uzilgan?  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · ulanishni sinash
- Sarlavha: **Buyurtma yetib bormadi. Qaysi ulanish uzilgan?** (46)
- Mentor: Butun kodni qayta yozdirish shart emas — belgini o'qing va xaritada uzilgan chiziqni bosing.
- Chapda qadam-ro'yxati (163.8, o'tgani ✓): 1 Sayt xato berdi · 2 Jadval bo'sh · 3 Admin jim
- O'ngda joriy belgi kartasi (bitta) va oqim xaritasi:
  1. Saytda `Failed to fetch`. Brauzerda `localhost:3000/menyu` esa ochiladi.
  2. Saytda «Buyurtma qabul qilindi», lekin `buyurtmalar` jadvalida yangi qator yo'q.
  3. Jadvalda yangi qator bor, admin chati esa bo'sh.
- **Harakat → Vizual o'zgarish:** o'quvchi xaritadagi chiziqni bosadi →
  - to'g'ri chiziq → u qizil uziladi, ostida tuzatish prompti chiqadi (mono, bitta qator) va «Qayta sinash» tugmasi →
    konvert o'sha chiziqdan o'tadi, chiziq yashil bo'ladi, chapdagi qadam ✓;
  - noto'g'ri chiziq → silkinadi, bir qator (≤60):
    1-belgida: «Backend ishlayapti — sayt unga yeta olmayapti.» (46) · 2-belgida: «Sayt javob oldi — demak Backend'ga yetib bordi.» (47) ·
    3-belgida: «Jadvalda qator bor — Database ulanishi ishlayapti.» (50)
- Tuzatish promptlari (Antigravity uchun namuna, T-002 — sen-forma):
  1. Sayt–Backend: «Saytda Failed to fetch, `/menyu` esa ochiladi. `App.jsx` dagi manzilni va `main.ts` dagi CORS'ni tekshir.»
  2. Backend–Database: «Sayt «qabul qilindi» deydi, jadvalda qator yo'q. `POST /buyurtma` jadvalga yozyaptimi — tekshir.»
  3. Backend–Bot: «Jadvalda qator bor, admin xabar olmadi. Adminga xabar yuboradigan qatorni tekshir.»
- Xulosa: Belgi uzilgan ulanishni ko'rsatadi. Avval har ulanishni, keyin butun oqimni sinang. (83)
- Tugadi (199): qadam-ro'yxati yopiladi, uchala chiziq yashil xarita fokusga; vizual ⛶ ichida.
- Tugma (pastki): 3 belgini tekshiring (N/3) → Davom etish
✎ v2 9-ekran (sikl: prompt → kod → test → xato → tuzat) + 12-ekran («Failed to fetch» case, 3 variantli tanlov) + 14-ekran (namuna hikoya) →
  bitta harakat-ekran: belgi → uzilgan ulanish → tuzatish prompti → qayta sinash (sikl o'quvchi qo'lida) · «Failed to fetch» sabablari (manzil · server · CORS) saqlandi:
  server ishlayotgani belgining o'zida, qolgan ikkisi tuzatish promptida · «4-Modulda ko'rgansiz» olindi (modul raqami — ichki kod).

## A2 · Amaliyot 2 — buyurtma Database'ga va adminga  ← amaliyot bloki (≈23 daq)
- Eyebrow: Amaliyot 2 · Backend → Database, Bot
- Sarlavha: **Saytdagi buyurtma Database'ga va adminga borsin.** (48)
- Mentor: Bot buyurtmani allaqachon `buyurtmalar` jadvaliga yozadi — sayt ham o'sha jadvalga yozsin; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti (`npm run start:dev` va `web` da `npm run dev`), Antigravity'da `TelegramBotNest` ochiq.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash», Antigravity'ga:
     > Botga `/id` buyrug'ini qo'sh: chat raqamini qaytarsin. `.env` dagi `ADMIN_CHAT_ID` ni `config` orqali o'qi.
     > Backend'da `POST /buyurtma` yarat: body'dan taom va manzilni olsin. Taom `menyu.ts` da bo'lmasa — 400 va «Bunday taom yo'q».
     > Buyurtmani `BuyurtmaService.yoz` bilan `buyurtmalar` jadvaliga yozsin; jadvalga `manba` ustuni qo'sh: «bot» yoki «sayt».
     > Keyin bot `ADMIN_CHAT_ID` ga yozsin: **{xabar boshi}**, taom, narx va manzil.
     > `web/src/App.jsx`: «Buyurtma» bosilsa manzil so'rasin, `POST /buyurtma` yuborsin va «Buyurtma qabul qilindi» deb yozsin.
     > Botdagi buyurtma berish o'zgarmasin.
  3. **Ishga tushirish** — terminal xatosiz. Telegramda botingizga `/id` yuboring, raqamni `.env` dagi `ADMIN_CHAT_ID=` qatoriga yozing,
     Backend'ni qayta ishga tushiring (Ctrl+C, `npm run start:dev`). Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — saytda «Buyurtma» bosing, manzil yozing: saytda «Buyurtma qabul qilindi», Telegramda admin xabari keladi.
     Neon'da jadvallar bo'limida `buyurtmalar` jadvalini oching — yangi qator, manba «sayt».
- O'ng tomon — «kutilgan natija · namuna: AvtoPizza» (admin chati, `TgChat`):
  - mijoz: /id
  - bot: Chat raqamingiz: 123456789
  - bot: Yangi buyurtma (sayt): Pepperoni — 55 000 so'm · Chilonzor, 12-uy
- Hammasi bajarilgach (yashil): Bitta bosish — ikki tarmoq: buyurtma Database'da, xabar adminda. (64)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags` · `git checkout -f dars-6-08-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 17-ekran 4–5-bosqichi (Node → PostgreSQL, boshidan oxirigacha) + «⭐ Qo'shimcha: Node.js → Telegram» → asosiy qadam (v2 da «Telegram va AI qani?» muammosi yopildi) ·
  `orders` jadvali → repo'dagi `buyurtmalar` (5-Modul 7-dars) · v2 7-ekran «Node → Telegram» prompti («Adminga "Yangi buyurtma" xabar yubor») → haqiqiy prompt.

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Admin xabar olmadi. Xatoni qanday topasiz?**
  - Butun kodni AI'ga boshidan qayta yozdirasiz
  - ✔ Har ulanishni alohida, keyin oqimni sinaysiz
  - Saytni yangilab, «Buyurtma»ni qayta bosasiz
  - Botni o'chirib, Backend'ni ham qayta yoqasiz
- Kalit: **B** (index 1 — eski s12 o'rni). Variantlar: 43 · 44 · 43 · 44 belgi.
- To'g'ri izohi: Belgi qaysi ulanishni sinashni ko'rsatadi, oxirida butun oqim sinaladi.
- Xato izohlari (≤60):
  - A: Yangi kodda ham o'sha xato qolishi mumkin. (42)
  - C: Bir xil bosish bir xil natija beradi — sabab qayerda? (53)
  - D: Qayta yoqish sababni tuzatmaydi — qaysi ulanish uzilgan? (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ v2 13-ekran (4-savol) «Ulanish xatolarini qanday topamiz?» → vaziyat-savol (S-001, siz-forma) · bema'ni variantlar («AI hech qachon xato qilmaydi») →
  haqiqiy noto'g'ri yo'llar (qayta yozdirish, qayta bosish, qayta yoqish — S-004) · kalit o'rni (B) o'zgarmadi.

## A3 · Amaliyot 3 — AI javobi va butun oqimni sinash  ← amaliyot bloki (≈15 daq)
- Eyebrow: Amaliyot 3 · Backend → AI, sinash
- Sarlavha: **Saytga AI'ni ulang va butun oqimni sinang.** (42)
- Mentor: Botdagi AI saytga ham javob beradi — kod bitta, kirish yo'li ikkita; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti; `.env` da `GEMINI_API_KEY` bor (botdagi AI shu kalit bilan ishlaydi).
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash», Antigravity'ga:
     > Backend'da `POST /savol` yarat: body'dagi matnni `AiService.javob` ga bersin va javobni qaytarsin. Kalit bo'lmasa — «AI hali ulanmagan».
     > `web/src/App.jsx`: menyu ostida savol qutisi va «Yuborish» tugmasi; qutida namuna: **{namuna savol}**. Javob qutining ostida chiqsin.
     > Backend javob bermasa, sayt «Server javob bermayapti, birozdan keyin urinib ko'ring» deb yozsin.
     > Menyu va buyurtma o'zgarmasin.
  3. **Ishga tushirish** — terminal xatosiz. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Butun oqimni sinash** — (1) saytda savol bering — AI javob beradi; (2) bitta buyurtma bering — sayt, jadval va admin chati;
     (3) Backend terminalida Ctrl+C bosing va «Buyurtma»ni bosing — sayt «Server javob bermayapti» deydi; Backend'ni qayta yoqing.
- O'ng tomon — «kutilgan natija · namuna: AvtoPizza» (brauzer maketi, savol qutisi):
  - savol: Qaysi pitsa achchiq emas?
  - AI: Margarita va Pishloqli achchiq emas. Buyurtma uchun «Buyurtma»ni bosing.
- Hammasi bajarilgach (yashil): Sayt, bot va AI bitta Backend orqali ishlaydi. Oqim boshidan oxirigacha sinaldi. (80)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags` · `git checkout -f dars-6-08-done`
- Nishon (bonus): Full Pipeline — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ v2 17-ekran «⭐ Qo'shimcha: Node.js → AI» → asosiy qadam · v2 7-ekran «Node → AI» prompti (`claude.messages.create` — repo'da yo'q) → repo'dagi `AiService` (Gemini) ·
  v2 12/13 «end-to-end» → 4-qadam: o'quvchi oqimni o'zi boshidan oxirigacha sinaydi va Backend'ni o'chirib, xatoni o'z ko'zi bilan ko'radi.

## 6 · Natijalar (podium) — o'zgarmaydi
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 3 — «1 — Buyurtma oqimi» · 5 — «2 — Ulanish xatosi».
✎ F-1004-24 (m6-08 s18 takror gap): eski 18-ekran (amaliyot «VS Code») endi yo'q — takror shu bilan yopiladi.

## 7 · Yakun — kartochkalar va keyingi dars  ← QYakun (ichida QKartochka, 172)
- Eyebrow: Tayyor · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Endi tayyor qismlarni bitta tizimga ulay olasiz.** (48)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (3):
  - Pipeline — ma'lumot oqimi; u Backend'dan tarmoqlanadi
  - Har ulanishni prompt bilan qurasiz va alohida sinaysiz
  - Belgidan uzilgan ulanishni topasiz, keyin butun oqimni sinaysiz
- Kartochkalar (shu ekranda, `QKartochka`; jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Uyga vazifa — yo'q (172.4: ish repo'da, keyingi darslar shu repo ustida).
- Keyingi dars — «React Native — asoslari». Bugun sayt Backend'ga ulandi. Keyingi darslarda telefon ilovasini quramiz — u ham shu Backend'ga ulanadi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash
✎ v2 18 (podium), 19 (kartochkalar), 20 (yakun) → 6 va 7 (172) · «Endi siz bilasiz» 5 → 3 (kartochkalar takrorlamasin, §216) · uyga vazifa «Bo'ling · Ulang · Sinang» olindi (172.4) ·
  «📱 Keyingi dars — React Native…» emoji olindi (185), «tizimingizga mobil ilova» → «telefon ilovasi … shu Backend'ga» (9–11 bitta Backend, 1-dars g'oyasi).

---

## Nishonlar (3)
- **Order Flow** — Buyurtma oqimi tarmoqlanishini bildingiz (3-ekran, 1-savol)
- **Bug Catcher** — Uzilgan ulanishni belgisidan topdingiz (5-ekran, 2-savol)
- **Full Pipeline** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
✎ v2 4 nishondan: Full Pipeline (eski 4-savol) → amaliyot bonusi · Clear Prompt (eski 10-savol, ekrani yo'q) olindi · Order Flow (eski final DnD) → 1-savol · Bug Catcher → 2-savol.

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Buyurtma oqimi tarmoqlanadi»
   - `fetch('http://localhost:3000/buyurtma', …)` · Sayt yuboradi — Buyurtma Backend'ga keladi.
   - `BuyurtmaService.yoz(…)` · Backend saqlaydi — Buyurtma `buyurtmalar` jadvalida qoladi.
   - `bot.telegram.sendMessage(ADMIN_CHAT_ID, …)` · Backend adminga yozadi — Shu buyurtmadan ikkinchi tarmoq.
   - Sinfga savol: Nega AI buyurtma oqimida yo'q?
2. 2-savol (5-ekran) — «Belgi uzilgan ulanishni ko'rsatadi»
   - `Failed to fetch` · Sayt Backend'ga yetmadi — Manzil yoki CORS.
   - Jadvalda qator yo'q · Backend saqlamadi — `POST /buyurtma` ni tekshiring.
   - Admin chati bo'sh · Xabar ketmadi — `ADMIN_CHAT_ID` ni tekshiring.
   - Sinfga savol: Admin xabar olmadi — qayerdan boshlaysiz?
✎ v2 4 oyna → 2 (172.3) · emoji o'rniga koddan bitta qator (S-026).

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pipeline nima? | Ma'lumotning qismdan qismga o'tish oqimi | Masalan: sayt → Backend → Database |
| Tizim bilan pipeline bir narsami? | Yo'q | Tizim — hamma qismlar; pipeline — ular orasidagi oqim |
| Saytdan kelgan buyurtmani kim qabul qiladi? | Backend (Node.js) | Database, bot va AI bilan ham u ishlaydi |
| Buyurtmalar qayerda saqlanadi? | `buyurtmalar` jadvalida (PostgreSQL) | Bot ham, sayt ham bitta jadvalga yozadi |
| Yangi buyurtmani admin qanday biladi? | Bot unga Telegram'da yozadi | `ADMIN_CHAT_ID` — kimga yozishni aytadi |
| AI tizimda qachon ishlaydi? | Mijoz savol berganda | Buyurtma oqimida AI yo'q |
| Sayt boshqa portdagi Backend'ga so'rov yuborsa, Backend nimani yoqadi? | CORS | Faqat o'z saytingiz manziliga ruxsat bering |
| Saytda `Failed to fetch` — avval nimani tekshirasiz? | Sayt so'rov yuborayotgan manzilni | Keyin: Backend ishlayaptimi, CORS yoqilganmi |
| Bitta ulanish qanday quriladi? | Prompt → kod → sinash → tuzatish → qayta sinash | Har ulanish shunday |
| Aniq prompt nimalarni aytadi? | Qayerda, nima qilsin, nima buzilmasin | «Sayt qil» emas, «`GET /menyu` yarat» |
| AI yozgan kodni nega o'qiysiz? | Xato va xavfni ko'rish uchun | Masalan, maxfiy kalit kodga ochiq yozilgan |
| Oqimni boshidan oxirigacha sinash nima deyiladi? | End-to-end test | Bitta haqiqiy buyurtma butun oqimdan o'tadi |

✎ v2 12 kartadan: «Bug» kartasi olindi (darsda «xato» so'zi yetadi) · «AI bilan kod yozish sikli» → «Bitta ulanish qanday quriladi?» (sinash) ·
  yangi: CORS (A1 promptida bor) · `orders` → `buyurtmalar`, React/Node.js → sayt/Backend (A-3) · tushib qolgan v2 5-ekran (ko'r-ko'rona va nazorat) va 11-ekran
  (AI kodini o'qish, token) → 9- va 11-karta · v2 5-ekrandagi «vibecoding» eslatmasi va 14-ekran «To'liq hikoya» → YAKUNIY arxiviga.

## Jonli viktorina (arena, 12 savol) — ✔ o'rni o'zgarmaydi, faqat matn sifati
1. Pipeline nima degani? ✔ Ma'lumotning qismdan qismga o'tish oqimi · Bitta katta kod fayli — hammasi ichida · Faqat ko'rinadigan frontend qismi · Bir-biriga ulanmagan mustaqil dasturlar — *o'zgarmaydi*
2. AI bilan kod yozganda sizning vazifangiz? Hamma kodni AI'siz, qo'lda yozish · ✔ Aniq topshiriq berish, o'qish va sinash · Butun loyihani bitta promptda so'rash · AI bergan kodni o'qimay ishlatish
3. Sayt so'rovni qayerga yuboradi? To'g'ridan-to'g'ri Database'ga · To'g'ridan-to'g'ri Telegram'ga · ✔ Backend ishlayotgan manzilga · Brauzerning o'z xotirasiga
4. «Failed to fetch» xatosining ko'p uchraydigan sababi? Sahifa sarlavhasi noto'g'ri yozilgani · Gemini kaliti bo'sh qolgani · Menyuda pitsalar kam bo'lgani · ✔ Backend manzili noto'g'ri yozilgani
5. Aniq prompt qanday bo'ladi? ✔ Qayerda, nima qilsin, nima buzilmasin · «Saytni yaxshi qilib yozib ber» degani · «Hammasini o'zing bilganingcha qil» · Faqat texnologiya nomi aytilgani
6. AI yozgan kodni nima uchun o'qiysiz? Uni qo'lda qayta yozib chiqish uchun · ✔ Xato va xavfni ko'rib, tuzatish uchun · Qatorlar sonini sanab chiqish uchun · Kodni chiroyliroq ko'rsatish uchun
7. Ulanish xatosini qanday topamiz? Kodni noldan qayta yozdiramiz · Sahifani yangilab kutib turamiz · ✔ Boshidan oxirigacha sinaymiz · AI xato qilmaydi deb ishonamiz
8. Buyurtma yuborilganda qaysi qism birinchi ishlaydi? PostgreSQL (Database) · Telegram (bot) · AI (Gemini) · ✔ Sayt (React)
9. Bu loyihada Backend qanday vazifani bajaradi? ✔ So'rovlarni qabul qilib, boshqaradi · Sahifani brauzerda chizib beradi · Buyurtmalarni o'zida saqlab turadi · Savollarga o'zi javob o'ylab topadi
10. Buyurtma ma'lumoti qayerda saqlanadi? Adminga kelgan Telegram xabarida · ✔ Database'dagi buyurtmalar jadvalida · Saytning brauzerdagi xotirasida · Backend'ning terminal oynasida
11. Bitta ulanish qanday quriladi? Prompt → kod → darhol ishlatish · Kodni ko'rmasdan ishlatish · ✔ Prompt → kod → sinash → tuzatish → qayta · Hammasini bitta promptda yozdirish
12. «End-to-end test» nimani tekshiradi? Faqat bitta ulanish ishlashini · Sahifaning tashqi ko'rinishini · Database jadvali borligini · ✔ Buyurtma butun oqimdan o'tishini

Kalitlar (kodda qanday bo'lsa): A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari: React · Node.js · `GET /menyu` · `POST /buyurtma` · `fetch()` · CORS · `localhost:5173` · `buyurtmalar` · pipeline · `ADMIN_CHAT_ID` · Gemini · end-to-end · `Failed to fetch` · 201
✎ Bema'ni variantlar («Hech narsa qilmaslik», «Logotip juda kichik», «Mahsulot rasmining rangi», «Hech qayerda saqlanmaydi», «Faqat rasm va chizmalar chizadi») →
  haqiqiy noto'g'ri tasavvurlar (S-004) · 11: «test» → «sinash», savol «sikl» → «ulanish» (dars so'zi) · 8–10: React/baza/orders → sayt/Database/buyurtmalar (A-3) ·
  9 va 5: to'g'ri variant eng uzun emas (S-006) · fon: emoji (🟢 🐘 🤖 ✈️ ✗ ✓) va `.env`/`orders` → repo so'zlari.

---

## KOD — razrabotkada o'zgaradigan narsalar
1. `SCREEN_META` 21 → 11 (hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary). `INLINE_KEYS` 5 → 2: 3-ekran **3 (D)**, 5-ekran **1 (B)** —
   eski s4 va s12 o'rinlari (id nomi kodda hal qilinadi); `practice: -1` qoladi. Final DnD (`s15`, kalit 0) olinadi.
2. **`ScreenBlok` + `PromptBox`** 5-Modul `BotAiProjectLesson.jsx` dan ko'chiriladi (173.6: blok o'zini o'zi ta'minlaydi). 4-qadam nomi blokka qarab: «Brauzerda tekshirish» · «Tekshirish» ·
   «Butun oqimni sinash». O'ng tomon: A1/A3 — brauzer maketi (xaritadagi Sayt maketining kattasi), A2 — `TgChat` (admin chati). `AB_TAIL` A1 = `dars-6-08-start`, A2/A3 = `dars-6-08-done`.
3. **`PIPE_NODES` + `PipeMap`** — bitta manba (180): 5 tugun, 4 ulanish, holatlar (kulrang · oq · joriy · yashil · qizil uzuq), ikki xil konvert; 0, 1, 2, 4-ekranlar shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
4. 0-ekran `QKirish` (maket = `PipeMap` ulanmagan, «Buyurtma» bosilgach variantlar), 2- va 4-ekran `QTushuncha` (`zoom`, `tugadi`, `QBashorat`/`QTaxmin` 2-ekranda, `QQadamlar` 4-ekranda).
5. 3 va 5-ekran `QTest` — variantlar yangi matn (kalit indeksi tegilmaydi); xato izohlari ≤60.
6. `RECAPS` 4 → 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 4 → 3, `ACH_TRIGGERS`: 3-ekran → Order Flow, 5-ekran → Bug Catcher, A3 oxirgi «Bajardim» → Full Pipeline.
7. Olinadigan ekranlar va ma'lumotlar: Screen2/3/5/5b/6/7/8/9/10/11/13/14/15, `ScreenPipelinePractice`, `LINKS`, `PNODES`, `VIBE_STEPS`, `HOMEWORK`, `HW_TOKENS` —
   cut'dan keyin `npm run gates` (`undef` darvozasi) va `grep`.
8. 7-ekran `QYakun`: `uyga` yo'q, `recap` 3 qator, ichida `QKartochka` (12 karta), `keyingi` matni yuqoridagidek; `ScreenFlashcards` alohida ekran sifatida olinadi.
9. `QUIZ_BANK` — 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12-savollar matni (✔ indekslari `git diff` bilan tekshiriladi, 172.6). `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji olinadi (R-008).
10. `LESSON_META.lessonId` versiyasi oshiriladi (`…-v18` → `…-v19`) — `ccProgress` eski 21 ekranli indeksga qaytmasin.
11. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates` · `lint:olchov` 0 (shu dars) · `lint:emoji` · `lint:layout` 1280/1366 · surat (1280 + 393).

## REPO — `TelegramBotNest` ga qo'shiladigan narsalar (`/home/kali/Desktop/TelegramBotNest`, hozir oxirgi teg `dars-10-done`)
1. **`dars-6-08-start`** = `dars-10-done` + bitta tayyorgarlik commit:
   - `web/` — Vite + React qolipi: `package.json` (`npm run dev` → 5173), `index.html`, `src/main.jsx`, `src/App.jsx` (sarlavha «AvtoPizza», «Menyu yuklanmoqda…» matni, so'rov yo'q);
   - `.gitignore`: `web/node_modules`, `web/dist`;
   - README: «Darslar va teglar» jadvaliga 6-Modul 8-dars qatori, «Papkalar»ga `web/` (sayt, 8-dars), ikki terminal eslatmasi.
2. **`dars-6-08-done`** (A1–A3 namunasi, AvtoPizza):
   - `GET /menyu` — `menyu.ts` dagi ro'yxat `[{ kalit, nom, narx }]` (alohida controller yoki `AppController`);
   - `main.ts` — `app.enableCors({ origin: 'http://localhost:5173' })`;
   - `POST /buyurtma` — body `{ taom, manzil }`, menyuda yo'q bo'lsa 400 «Bunday taom yo'q», `BuyurtmaService.yoz(…, 'sayt')`, javob 201;
   - `Buyurtma` entity: `manba` ustuni (varchar, default 'bot'), `telegram_id` nullable (`synchronize: true` o'zi qo'shadi); agent `saveOrder` va bot oqimi `'bot'` yozadi;
   - `config.ADMIN_CHAT_ID`, `.env.example` da `ADMIN_CHAT_ID=` qatori izoh bilan («8-dars: botga /id yuboring»); bo'sh bo'lsa — xabar yuborilmaydi, konsolga ogohlantirish;
   - `/id` buyrug'i — chat raqamini qaytaradi; `TelegramService.adminga(matn)` — `bot.telegram.sendMessage(ADMIN_CHAT_ID, …)`;
   - `POST /savol` — `AiService.javob`, kalit yo'q → «AI hali ulanmagan»;
   - `web/src/App.jsx` — menyu kartalari (`GET /menyu`), «Buyurtma» → manzil → `POST /buyurtma` → «Buyurtma qabul qilindi», savol qutisi → `POST /savol`,
     Backend javob bermasa «Server javob bermayapti, birozdan keyin urinib ko'ring»;
   - README «Xatolar» jadvaliga: `Failed to fetch` — Backend ishlamayapti / manzil noto'g'ri / CORS yoqilmagan · admin xabar olmadi — `ADMIN_CHAT_ID` bo'sh.
3. **Shart:** 6-Modul teglari (`dars-6-08-*` va 9–13-darslarniki) kurs boshlanishidan **oldin** upstream'da bo'lishi kerak — o'quvchi repo'ni 5-Modul 3-darsda fork qiladi,
   fork o'sha paytdagi teglarni oladi. Kech qo'shilsa A1 1-qadamiga `git fetch` qatori kerak bo'ladi.
4. **Bog'liqlik:** `GET /menyu` va `POST /buyurtma` 8-darsda paydo bo'ladi — 9–11-darslar (mobil ilova) va 13-dars ularni tayyor deb oladi; nomlar bir xil bo'lishi kerak.

## B. Bu darsdan tashqariga chiqadigan narsalar (hozir tegilmaydi)
> Hal qilindi (GATE M, 05.10): 1-band — M-q10 A (3 teg repo'da, GitHub'da) · 2-band — M-q2 A (1-dars telefon do'koni, repo darslari AvtoPizza).
- 5-Modul `AB_TAIL` (`BotAiProjectLesson`, `BotFullProjectLesson`, `BotFeedbackIterationLesson`) `dars-05-start`, `dars-07-start`, `dars-09-start` ni ko'rsatadi —
  bu teglar repo'da ham, GitHub'da ham **yo'q** (bor: `dars-03-start` va `*-done`). Yo teglar yaratiladi (= oldingi `done`), yo qator tuzatiladi.
- 1-dars (v3 pilot) maketi — telefon do'koni (Telefon, Quloqchin); repo darslari (8–13) — AvtoPizza. Modul-ipi bo'yicha qaror foydalanuvchida.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): m6-07 → **m6-08 «Loyiha kuni: to'liq pipeline»** → m6-09 «React Native — asoslari». Nom GATE M 08-q0 bilan o'zgardi (App.jsx — asosiy seans).
- [✓] Bitta misol-ip (AvtoPizza, repo) · metafora yo'q · bitta vizual dars bo'yi — oqim xaritasi `PIPE_NODES` (0, 1, 2, 4; bloklarda uning maketlari).
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (oqimni yo'naltirish), 4 (uzilgan chiziqni topish); 0-ekran ham harakatli.
- [✓] Sarlavhalar ≤55 bitta qator (31–52) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1 — T-029), sarlavha so'zlarini takrorlamaydi (`lint:olchov` takror mezoni bilan skriptda tekshirildi) ·
  xulosalar ≤110 (49–96) · hook javobi ≤120 (95/87) · xato izohlari ≤60 (42–58).
- [✓] Atamalar oldingi darslar bilan: Frontend/Backend/Database (1-dars), `buyurtmalar`, `menyu.ts`, Antigravity, Gemini (repo va 5-Modul), «sinash» (11-dars v2), «8-darsdagi buyurtma oqimi» (11-dars v2) ·
  siz-forma; Antigravity promptlari sen-formada (T-002) · tugmalar ot-shaklda.
- [✓] Testlar: variantlar 43–46 belgi, to'g'ri variant eng uzun emas; strelka/qavs/tire faqat to'g'rida emas · ✔ o'rni: 3-ekran D, 5-ekran B (eski s4, s12) · arena A·B·C·D ×3.
- [✓] Final tartib-mashqi yo'q (172 — olindi), shuning uchun uya izohi talabi qo'llanmaydi.
- [✓] Emoji yo'q (arena fon so'zlaridan ham olindi; nishon medali — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — grep 0).
- [✓] Ichki kodlar yo'q (o'quvchi matnida «4-Modul», «Modul 8», «T6» yo'q; «5-Modul» faqat MD izohlarida) · tarixiy voqea yo'q · «KOD» (11) va «REPO» (4) ro'yxati to'liq.
- [✓] Karta T · P · S: T-002/011/014/015/029/047 · P-001/013/015/036/052/059/064/067 · S-001/004/006/010/026 — ko'rildi. ✗ P-028: «Neon'da `buyurtmalar` jadvalini oching» —
  GATE M 08-q1: aniq menyu nomisiz — «jadvallar bo'limida», mentor ko'rsatadi.

## GATE M javobi qo'llandi (05.10)
- **08-q0** · dars nomi «Praktika: to'liq pipeline» → «Loyiha kuni: to'liq pipeline» (sarlavha, menyu qatori, o'z tekshiruvim; App.jsx — asosiy seans).
- **08-q1** · A2 4-qadam: «Neon'da `buyurtmalar` jadvalini oching» → «Neon'da jadvallar bo'limida `buyurtmalar` jadvalini oching» (Tables nomisiz).
- **M-q7/q8** · A1 «Ortda qoldingizmi» — `git fetch … --tags` + `git checkout -f dars-6-08-start`; A2, A3 — `git fetch … --tags` + `git checkout -f dars-6-08-done`.
- **M-q8** · A1 1-qadam: `git checkout dars-6-08-start -- web` dan oldin `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags` (fork'da yangi teg yo'q).
- **M-q0** · «Database» — o'quvchi matnida «baza» yo'q edi (grep 0), o'zgarish yo'q.
- **M-q3** · `taom`, `manzil`, `manba` (`sayt` · `bot`), `GET /menyu` shu darsda — MD shu nomlarda edi, o'zgarish yo'q; `API_URL`, `pitsa:` yo'q (grep 0).
- **M-q5** · uyga vazifa yo'q (172.4) — MD shunday edi, o'zgarish yo'q.
- **M-q2/M-q10** · «B» bo'limi bandlari «hal qilindi» deb belgilandi.
