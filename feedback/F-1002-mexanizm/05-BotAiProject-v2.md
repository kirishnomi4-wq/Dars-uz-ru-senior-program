# 5-Modul · 5-dars «Loyiha kuni: AI bilan bot» — YANGI MATN (v2, amaliyot-qolip)

Fayl: `src/5-Modull/BotAiProjectLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** (20 edi) · uz + ru
**Holat: 03.10 00:40 — KODGA MOS (F-1002-106).** Kod bilan farqlar `⚙` bilan belgilangan (ekran sig'imi va darvoza sabab).
Eski matn: `feedback/F-0928-QA-5modul/YAKUNIY/05-BotAiProject.md`. Har ekran ostida `✎` — eski 20 ekrandan nima qayerga ketgani.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi — `.jsx` ga hozir tegilmaydi.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58.

---

## A. Loyiha kuni qolipi (5, 7, 9-darslar uchun bir xil)

1. **Bitta natija.** Dars oxirida o'quvchining repo'sida o'z g'oyasidagi bot ishlaydi: /start → o'z menyusi, har tugma → javob. Bu natija 1-ekranda ko'rsatiladi, 3 blokda quriladi, 6-ekranda sanaladi.
2. **Amaliyot bloki — 4 qadam, har darsda bir xil:** `1 · Ochish` (Antigravity + terminal) → `2 · Prompt` (nusxalash tugmasi, o'quvchi to'ldiradigan joy `{…}`) → `3 · Ishga tushirish` (terminal xatosiz) → `4 · Telegramda tekshirish` (aniq buyruq). O'ngda — kutilgan natija (chat, namuna AvtoPizza). Qadam «Bajardim» bilan ochiladi («Avval bajaring» qulfi, bor `ScreenLivePractice` mexanikasi).
3. **Repo oldindan bor:** 3-darsda `TelegramBotNest` clone qilingan, `.env` da token, 4-darsdan baza ulangan. Shuning uchun promptda texnologiya va token aytilmaydi — ular repo'da. Prompt faqat **nima qilsin** deydi.
4. **Antigravity** — kod yozadigan AI muharrir (VS Code ko'rinishida). Darsda birinchi marta shu yerda chiqadi: «Antigravity'da papkani oching» — boshqa izoh yo'q, mentor sinfda ko'rsatadi. Tushuncha-savollar uchun gemini.google.com qoladi (bu darsda kerak emas).
5. **Xato bo'lsa — bitta yo'l:** terminaldagi xato matnini Antigravity'ga yuboring: «Shu xato chiqdi: {xato}. Tuzat.» Bu gap har blokning 3-qadamida bir xil.
6. **Ortda qolgan o'quvchi:** blok ostida kichik qator — `git checkout -f dars-05-start` (sinf bilan tenglashadi, o'z kodi o'chadi — mentor bilan).
7. **Tushib qolgan tushunchalar yo'qolmaydi:** AI xatolari, iteratsiya, `bot.on('text')` tartibi — 7-ekran kartochkalarida; eslatma-bot hikoyasi — YAKUNIY arxivda. Arena (12 savol) o'zgarmaydi.
8. Matn qoidalari: sarlavha bitta qator (164), hook javobi ≤2 gap (162), mentor — nega + bitta chorlov (§210), bir gap bir joyda (§216), emoji faqat belgi (161), `narrow` faqat test/natija (171).

---

## Darsning ipi
- **Hook:** ikki prompt — noaniq va aniq → «Qaysi prompt yaxshiroq bot beradi?»
- **Model (dars bo'yi bitta):** reja (hodisa → javob juftlari) → prompt → AI kodi → o'qish → Telegramda test → tuzatish.
- **Namuna g'oya:** AvtoPizza (3, 4, 6-darslar bilan bir ip). O'quvchi — o'z g'oyasi; kutilgan natija AvtoPizza bilan ko'rsatiladi.
- **Yakun:** o'z boti ishlaydi · keyingi dars — «Bot ichida AI»: AI botning ichida mijozga javob yozadi.

---

## 0 · Kirish — ikki prompt
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Qaysi prompt yaxshiroq bot beradi?**
- Mentor: Bugun kodni AI yozadi, natija esa promptingizga bog'liq — «▶ AI ikkalasiga javob bersin»ni bosib, ikki promptni solishtiring.
- Karta «Noaniq prompt»: *menga Telegram bot yasab ber*
  - (bosilgach) AI javobi: Tilni o'zi tanladi, tugma turi noma'lum, token kodga ochiq yozildi.
- Karta «Aniq prompt»: *AvtoPizza boti: /start → salom va «Menyu» tugmasi; «Menyu» → 3 ta pitsa tugmasi; pitsa tanlandi → «Buyurtma qabul qilindi». Tugmalar inline.*
  - (bosilgach) AI javobi: Uch handler, inline tugmalar — hammasi siz aytgandek.
- Tugma: ▶ AI ikkalasiga javob bersin → ✓ Solishtirildi
- Savol: **Qaysi prompt yaxshiroq bot beradi?**
  - Birinchisi — qisqa va tushunarli
  - ✔ Ikkinchisi — batafsil va aniq
  - Farqi yo'q — AI ikkalasini bir xil tushunadi
- Javob — 2-variant: **Aynan!** Aniq promptda qarorlarni siz aytasiz: tugma, javob, tartib. AI faqat yozadi.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Natijaga qarang: birinchi promptda AI ko'p narsani o'zi tanladi. Ikkinchisida hammasini siz aytgansiz.
- Tugma: Davom etish

✎ Eski 0-ekran saqlandi, matn 162-qonunga qisqardi. Namuna prompt viktorina → AvtoPizza (modul ipi). «Node.js va Telegraf» promptdan olindi — texnologiya endi repo'da.

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: **Dars oxirida o'z botingiz shunday ishlaydi.**
- Mentor: Bu AvtoPizza — namuna; sizniki o'z g'oyangiz bilan bo'ladi, qadamlar esa bir xil.
- Chat «AvtoPizza» (bot · onlayn):
  - mijoz: /start
  - bot: AvtoPizza'ga xush kelibsiz! · tugmalar: 🍕 Menyu · 📦 Buyurtma
  - mijoz: (🍕 Menyu bosdi)
  - bot: Tanlang: · tugmalar: Margarita · Pepperoni · Pishloqli
  - bot: Pepperoni qabul qilindi. Manzilingizni yozing.
  - ⚙ tugma nomlari qisqardi («Buyurtmam» → «Buyurtma», «To'rt pishloq» → «Pishloqli») va «Pepperoni bosdi» pufagi olindi — chat 1280×800 da sig'maydi (surat `fidbek-m5-05/qolip-s1-bugun.png`). Butun darsda bir xil nomlar.
- Bugungi 3 qadam (tex-karta, bosilmaydi):
  1. Reja — botingizni hodisa → javob juftlariga ajratasiz
  2. Qurish — Antigravity'ga prompt, AI kod yozadi, siz o'qiysiz
  3. Sinash — Telegramda har tugmani bosasiz, xatoni tuzatasiz
- Pastki qator (mono, kichik): repo `TelegramBotNest` · boshlang'ich holat `dars-05-start` · tayyor namuna `dars-05-done`
- Tugmalar: Orqaga · Boshlaymiz →

⚙ F-1003-06 (03.10): qadam ostidagi kichik teglar olib tashlandi — qadam matni o'zi yetadi (QA «olib tashlaylik», 5-Modul 8 kod darsi).

✎ Eski 1-ekran (viktorina chati + 4 qadam) → tayyor natija chati + 3 qadam. Eski 13-ekran «O'z botingiz» (avval reja; hozircha kompyuteringizda) shu yerga: mentor gapi va 3-qadam. «Vibecoding» so'zi olindi (bir ma'no — «AI bilan dasturlash», kartochkada).

## 2 · Tushuncha 1 — avval reja
- Eyebrow: Tushuncha · reja
- Sarlavha: **Promptdan oldin bot nima qilishini kim hal qiladi?**
- Mentor: AI botingiz nima qilishini bilmaydi — g'oyalarni bosib, har birining rejasi qanday yozilganini ko'ring.
- G'oya tugmalari (chapda, ko'rilgani oldida ✓): AvtoPizza · Eslatma boti · Viktorina boti
- O'ngda — bitta karta «{g'oya} — rejasi» (matn almashadi, 163.8):
  - AvtoPizza: /start → salom va «Menyu» tugmasi · «Menyu» → pitsalar · pitsa tanlandi → manzil so'raydi · manzil keldi → tasdiqlaydi
  - Eslatma boti: /start → qisqa qo'llanma · matn keldi → saqlaydi · /royxat → ro'yxat
  - Viktorina boti: /start → «Boshlash» tugmasi · «Boshlash» → savol va A, B, C · A, B, C → to'g'ri yoki xato
- Uchalasi ko'rilgach, karta yashil: Reja — hodisa → javob juftlari ro'yxati. Shu ro'yxat promptga ko'chadi.
- Tugmalar: Orqaga · 3 g'oyani ko'ring (N/3) → Davom etish

✎ Eski 2-ekran saqlandi, karta bitta (matn almashadi). Eski 3-ekran «Prompt tuzilishi» (4 qism) olindi: texnologiya va token repo'da — qolgan ikkisi (juftlar, tugma turi) A1 promptida ko'rinadi. Eski 14-savol «Nega reja promptdan oldin» → arena (10-savol) va kartochka.

## A1 · Amaliyot 1 — reja va birinchi juft  `(≈18 daq)`
- Eyebrow: Amaliyot 1 · reja va /start
- Sarlavha: **Rejangizni yozing, /start ni o'zgartiring.**
- Mentor: Birinchi juft — /start: bot sizning nomingiz bilan salomlashsin va o'z tugmalaringizni ko'rsatsin — «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. Terminalda: `npm run start:dev`. «Telegram bot ulandi» chiqsin.
  2. **Prompt** — qavs ichini o'z g'oyangiz bilan to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `src/api/telegram/telegram.service.ts` faylida bot **{bot nomi}** boti bo'ladi.
     > /start → «**{salom matni}**» va inline tugmalar: **{1-tugma}**, **{2-tugma}**.
     > Ism so'rash va baza ishlashi o'zgarmasin. Har tugma uchun `bot.action` yoz, hozircha «Tez orada» deb javob bersin.
  3. **Ishga tushirish** — terminal o'zi qayta yukladi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telegramda tekshirish** — botingizga `/start` yuboring: o'z salomingiz va o'z tugmalaringiz chiqadi.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - mijoz: /start
  - bot: AvtoPizza'ga xush kelibsiz! · tugmalar: 🍕 Menyu · 📦 Buyurtma
  - mijoz: (🍕 Menyu bosdi)
  - bot: Tez orada
- Hammasi bajarilgach (yashil): /start sizniki. Endi tugmalar haqiqiy javob beradi.
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan `git checkout -f dars-05-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 5-ekran «Prompt yig'ish» (4 tugma bilan matn yig'ish) → haqiqiy prompt, o'quvchi qavsni o'zi to'ldiradi. Eski 16-ekran topshirig'ining 1–2-qadami shu yerda.

## 3 · 1-savol ✅ (jonli ball)
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Nega «menga bot yasab ber» — noaniq prompt?**
  - AI o'zbekcha yozilgan buyruqni tushunmaydi
  - «Iltimos» deyilmagan, buyruq qo'pol yozilgan
  - ✔ Unda hodisa → javob juftlari va tugma turi yo'q
  - AI Telegram uchun bot kodini yoza olmaydi
- To'g'ri: To'g'ri! Juftlar va tugma turi aytilmasa, AI ularni o'zi taxmin qiladi.
- Xato izohlari (≤60):
  - A: AI o'zbekchani tushunadi — promptda ma'lumot yetishmayapti.
  - B: AI uchun odob emas, aniqlik muhim.
  - D: AI bot kodini yoza oladi — unga nima kerakligi aytilmagan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

✎ Eski 4-ekran. To'g'ri variant «texnologiya, tugma turi va token yo'q» → «hodisa → javob juftlari va tugma turi yo'q» (texnologiya va token endi repo'da, 1-savol darsga mos). Kalit o'rni (C) o'zgarmadi.

## 4 · Tushuncha 2 — AI kodini o'qish
- Eyebrow: Tushuncha · AI kodi
- Sarlavha: **AI yozgan kodni ishlatishdan oldin nimani tekshirasiz?**
- Mentor: Siz hozir A1 da AI kodini ko'rdingiz — chapdagi 4 tekshiruvni bosib, har biri kodda qayerda ekanini ko'ring.
- Chapda 4 tekshiruv (bosilgani o'ngda kodda yoritiladi, ko'rilgani ✓):
  - Har tugmaga handler bormi — `bot.action('menu', …)` — tugma bor, handler yo'q → bot jim.
  - Tugma turi siz aytgandekmi — `Markup.inlineKeyboard` — inline so'radingiz, reply yozmadimi.
  - Token kodda ochiq emasmi — `config.BOT_TOKEN` — AI tokenni qatorga yozib qo'ysa, `.env` ga qaytaring.
  - `bot.on('text')` eng oxiridami — u har matnni ushlaydi — oldinda tursa, buyruqlar unga tushib qoladi.
- O'ngda — bitta kod-karta (`telegram.service.ts` qisqartirilgan, AvtoPizza, bosilgan tekshiruv qatori yoritiladi):
```ts
this.bot.start((ctx) =>
  ctx.reply('AvtoPizza\'ga xush kelibsiz!',
    Markup.inlineKeyboard([
      Markup.button.callback('🍕 Menyu', 'menu'),
      Markup.button.callback('📦 Buyurtma', 'order'),
    ])));

this.bot.action('menu', (ctx) => ctx.reply('Tez orada'));
// 'order' uchun handler yo'q — tugma jim qoladi

this.bot.on('text', (ctx) => ctx.reply('Bu buyruqni bilmayman.'));
```
- 4 tekshiruv ko'rilgach (yashil): Kodni tushunsangiz, AI xatosini test paytida emas, o'qiyotganda topasiz.
- Tugmalar: Orqaga · 4 tekshiruvni ko'ring (N/4) → Davom etish

✎ Eski 6-ekran «AI kodini o'qish» + 9-ekran «AI xatolari» (4 xato) bitta ekranga: 4 xato = 4 tekshiruv, kod repo tilida (TypeScript, `this.bot`). «Eski sintaksis» xatosi olindi — repo'da versiya qotirilgan. Eski 11-ekran «Ikki yo'l» → yashil xulosa bir gap + kartochka.

## A2 · Amaliyot 2 — tugmalar javob beradi  `(≈25 daq)`
- Eyebrow: Amaliyot 2 · juftlar
- Sarlavha: **Har tugma o'z ishini qilsin.**
- Mentor: Rejangizdagi qolgan juftlarni AI yozadi, siz esa 4-ekrandagi 4 tekshiruv bilan o'qiysiz — «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — Antigravity'da `telegram.service.ts` ochiq, terminalda `npm run start:dev` ishlayapti.
  2. **Prompt** — rejangizdagi juftlarni yozing (2–3 ta), «Nusxalash», Antigravity'ga:
     > Rejadagi juftlarni qo'sh:
     > «**{1-tugma}**» bosilsa → **{javob yoki yangi tugmalar}**.
     > «**{2-tugma}**» bosilsa → **{javob}**.
     > **{matn keladigan hodisa}** → **{javob}** — buning uchun `users.holat` dan foydalan (4-darsdagi kabi).
     > `bot.on('text')` eng oxirida qolsin.
  3. **Ishga tushirish** — terminal xatosiz. AI kodini 4 tekshiruv bilan o'qing: handler bormi, inline'mi, token `.env` da, `on('text')` oxirida. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telegramda tekshirish** — `/start` → har tugmani bosing → har biri o'z javobini bersin; matn yuboring → bot kutgan javobni bersin.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - mijoz: (🍕 Menyu bosdi)
  - bot: Tanlang: · tugmalar: Margarita · Pepperoni · Pishloqli
  - mijoz: (Pepperoni bosdi)
  - bot: Pepperoni — buyurtma qabul qilindi. Manzilingizni yozing.
  - mijoz: Chilonzor, 12-uy
  - bot: Buyurtma tasdiqlandi: Pepperoni · Chilonzor, 12-uy
- Hammasi bajarilgach (yashil): Rejangiz kodga aylandi. Qolgani — sinash.
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-05-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 16-ekran topshirig'ining 3–4-qadami. `users.holat` — 4-darsdagi ism-so'rash oqimi shu yerda qayta ishlaydi (bir dars — bitta yangi narsa, qolgani o'tilgandan).

## 5 · 2-savol ✅ (jonli ball)
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Tugma bosildi — bot jim. Sabab nima?**
  - Token noto'g'ri, Bot API so'rovni rad etdi
  - Inline emas, reply tugma ishlatish kerak edi
  - Kod oxirida bot.launch() yozilmagan
  - ✔ Shu tugma uchun bot.action handleri yo'q
- To'g'ri: To'g'ri! Tugma bosilishini `bot.action` ushlaydi — yozilmagan bo'lsa, bot jim.
- Xato izohlari (≤60):
  - A: Token ishlayapti — bot tugmali xabarni yubordi.
  - B: Inline to'g'ri — callback keldi, uni kim ushlaydi?
  - C: Bot ishga tushgan — tugmali xabarni u yubordi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

✎ Eski 10-ekran (3-savol). Sarlavha 164-qonunga qisqardi. Kalit o'rni (D) o'zgarmadi. Eski 8-savol «AI kod bergach birinchi nima qilasiz» → arena (4-savol) va kartochka.

## A3 · Amaliyot 3 — sinash va o'zingizniki  `(≈15 daq)`
- Eyebrow: Amaliyot 3 · sinash
- Sarlavha: **Avval buzing, keyin bitta yangisini qo'shing.**
- Mentor: Haqiqiy foydalanuvchi tugmalarni siz kutmagan tartibda bosadi — avval shuni qiling, keyin bitta o'z o'zgarishingizni qo'shing.
- Qadamlar:
  1. **Sinash** — Telegramda: tugmani ikki marta bosing, tartibni buzing, tasodifiy matn yozing. Bot jim qolgan yoki noto'g'ri javob bergan joyni toping.
  2. **Tuzatish prompti** — topilgan xatoni aniq yozing, «Nusxalash», Antigravity'ga:
     > «**{tugma yoki xabar}**» da bot **{nima qildi}**. Kerak: **{nima qilishi kerak}**. Tuzat, boshqa joyga tegma.
  3. **O'zingizniki** — bitta yangi narsa: yangi tugma, `/help` buyrug'i yoki boshqacha javob — promptni o'zingiz yozing.
  4. **Telegramda tekshirish** — tuzatilgan joy va yangi narsa ishlaydi. Qo'shnigizga botingizni bering: u ham bossin.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - mijoz: /help
  - bot: /start — boshlash · /menu — pitsalar · /buyurtma — buyurtmam
  - mijoz: (Pepperoni ni ikki marta bosdi)
  - bot: Pepperoni allaqachon tanlangan. Manzilingizni yozing.
- Hammasi bajarilgach (yashil): Siz iteratsiya qildingiz: test → xato → tuzatish → qayta test.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

✎ Eski 7-ekran «Test va tuzatish» (simulyatsiya: handler yo'q, tuzatish prompti) → haqiqiy botda; eski 15-ekran final «Tartibni yig'ing» olindi (tartibni o'quvchi 3 blokda o'zi bosib o'tdi; arena 10-savolda qoladi).

## 6 · Natijalar (podium) — o'zgarmaydi
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).

## 7 · Yakun — kartochkalar va keyingi dars
- Eyebrow: Tayyor
- Belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Botingiz ishlaydi — tartibni ham bilasiz.**
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CodeStrike (jonli darsda: Mentorni kuting)
- Kartochkalar (shu ekranda, bor `Flashcards` komponenti; eyebrow «Takrorlash»):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga yoziladigan matn nima deyiladi? | Prompt | Qancha aniq bo'lsa, AI shuncha kam taxmin qiladi |
| Siz prompt yozasiz, AI kod yozadi, siz tekshirasiz — bu qanday usul? | AI bilan dasturlash | Kodni AI yozadi, tekshirish — sizning ishingiz |
| Prompt yozishdan oldin botni nimaga ajratasiz? | Hodisa → javob juftlariga | Bu ro'yxat — botning rejasi |
| Repo bo'lgani uchun promptda nima aytilmaydi? | Texnologiya va token | Ular `TelegramBotNest` va `.env` da |
| Inline tugma bosilganda botga nima keladi? | Callback | Bu ham hodisa — uni handler ushlashi kerak |
| Tugma bosildi, bot jim — nima yetishmayapti? | Handler | Shu tugma uchun `bot.action` yozilmagan |
| AI tokenni kodga ochiq yozdi — nima qilasiz? | `.env` ga qaytaraman | Kodda faqat `config.BOT_TOKEN` turadi |
| `bot.on('text')` nega eng oxirida yoziladi? | U har qanday matnni ushlaydi | Oldinda tursa, buyruqlar ham unga tushadi |
| AI kod bergach, birinchi nima qilasiz? | O'qiyman va test qilaman | Tushunmagan kodni ishlatmaysiz |
| Test, tuzatish va qayta test takrori nima deyiladi? | Iteratsiya | Bot ishlamaguncha takrorlanadi |
| Kodni o'qimay ko'chirgan odam nimada yutqazadi? | Buzilsa, sababini topolmaydi | Tushungan odam qayerdan buzilganini biladi |
| Terminalda xato chiqdi — Antigravity'ga nima deysiz? | Xato matnini yuboraman: «Shu xato chiqdi… Tuzat» | Taxmin emas, aniq xabar |

- Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Keyingi dars — «Bot ichida AI». Bugun AI botingizning kodini yozdi. Keyingi darsda AI botning ichida ishlaydi: mijoz savoliga javobni o'zi yozadi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

✎ Eski 18 (kartochkalar) + 19 (yakun) bitta ekranda. «Endi siz bilasiz» 5 qatori olindi — kartochkalar shu ishni qiladi (§216). Uyga vazifa bloki olindi: bot repo'da, keyingi dars shu repo ustida davom etadi (uyga vazifa paketi — keyin, alohida). Kartochka 12 ta: 2 ta yangi (repo/prompt, Antigravity xato), eski «4 narsa» va «yasab ber» olindi.

---

## Nishonlar (3)
- Prompt Smith — Noaniq va aniq promptni farqladingiz (3-ekran, 1-savol)
- Handler Pro — Bot jim qolgani sababini topdingiz (5-ekran, 2-savol)
- Bot Builder — Uch amaliyot blokini oxirigacha bajardingiz (A3 «Bajardim» oxirgisi) — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

✎ Eski 4 nishondan Bug Catcher (7-ekran simulyatsiyasi) va Build Order (15-final) olindi — ekranlari yo'q. Bot Builder — amaliyot uchun (memory `nishon-bonus-qismaslik`).

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Aniq prompt — aniq bot»
   - 1 · Noaniq prompt — «Bot yasab ber» juda umumiy: juftlar va tugma turini AI o'zi tanlaydi.
   - 2 · Aniq prompt — Hodisa → javob juftlari va tugma turi aytilsa, AI kamroq taxmin qiladi.
   - 3 · Natija sizga bog'liq — Nima yozilishini prompt belgilaydi, promptni esa siz yozasiz.
   - Sinfga savol: Nega «yasab ber» — noaniq prompt?
2. 2-savol (5-ekran) — «Handler yo'q — javob yo'q»
   - `Markup.button.callback('🍕 Menyu', 'menu')` · Tugma bosilishi — hodisa — Inline tugma bosilganda botga callback keladi.
   - `this.bot.action('menu', …)` · Uni `bot.action` ushlaydi — Yozilmagan bo'lsa, bot jim qoladi.
   - 3 · Yechim — handler qo'shish — Tuzatish promptida qaysi tugma uchun handler kerakligini aniq yozing.
   - Sinfga savol: Inline tugma bosildi, bot javob bermadi — sabab?

## Jonli viktorina (arena, 12 savol) — o'zgarmaydi
`QUIZ_BANK` eski holida qoladi (YAKUNIY MD'dagi 12 savol). Faqat 3-savol: darsdagi «4 qism» ekrani yo'q bo'lgani uchun savol
«Bugungi promptda nima aytiladi?», to'g'ri variant «Hodisa va javob juftlari, tugma turi» (o'rni o'zgarmaydi).
⚙ Strelka «→» variantda ishlatilmadi — `lint:tell` (strelka faqat to'g'ri variantda bo'lsa — tell).

---

## KOD — razrabotkada o'zgargan narsalar (03.10, F-1002-106 — bajarildi)
1. `SCREEN_META` 20 → 11 (hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary). `INLINE_KEYS` 5 → 2 (3-ekran C, 5-ekran D).
2. **Yangi komponent `ScreenBlok`** (+ `PromptBox`) (A1/A2/A3 uchun bitta): chapda 4 qadam (`ScreenLivePractice` qulfi + «Bajardim»), 2-qadamda prompt kartasi `{…}` joylari bilan + «Nusxalash» tugmasi (brauzer clipboard), o'ngda `TgChat` bilan kutilgan natija; pastda kichik `git checkout` qatori. 5-Modul 2-dars 9-ekran namunasiga (163.6) yaqin: chapda ish, o'ngda tekshiruv.
3. 4-ekran: kod-karta (`fmtCode`, TS) — bosilgan tekshiruv qatorini yoritish (`.hit` kabi, 163.10 dan).
4. Nishonlar 4 → 3 (`BADGES`), Bot Builder A3 oxirgi «Bajardim» da.
5. 7-ekran: `Flashcards` summary ichida karta bo'lib (`.fc-wrap`); jonli darsda mentor boshqaruvida o'quvchiga ko'rinmaydi (eski qoida saqlandi). Uyga vazifa bloki va «Endi siz bilasiz» ro'yxati olindi.
6. `QUIZ_BANK` 3-savol to'g'ri variant matni.
7. `narrow` faqat 3, 5, 6-ekranlarda (171).
8. ru — uz tasdiqlangach, bir yo'la.

## B. Bu darsdan tashqariga chiqadigan narsalar (hozir tegilmaydi)
- 3-dars 16-ekran amaliyoti hali `bot.js` + `npm install telegraf` deydi — repo'ga o'tkaziladi (reja 6-bosqich). Bu dars 3-darsda clone bo'lgan deb oladi.
- 4-dars amaliyoti «qog'ozda loyihalang» — repo'da `users` jadvali bilan amaliy bo'ladi (6-bosqich).
- Repo tegi `dars-05-done` = shu MD'dagi AvtoPizza namunasi (A1–A3 oxiri) — MD tasdiqlangach repo'ga yoziladi.
- 6-dars kirishi «1-darsda bot faqat handlerda yozilgan javobni yuborardi» — o'zgarmaydi, mos.
