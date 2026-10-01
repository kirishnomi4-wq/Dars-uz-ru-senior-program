# v2-qoralama topshirig'i (29.09, F-0929-64): bitta darsning MD'sini modul qoidalari bilan qayta yozish (faqat O'QISH + bitta MD yozish)

Loyiha: /home/kali/Desktop/internetLesson (React darsliklar, o'zbekcha). 5-Modul (LMS: 7-Modul) — Telegram-bot darslari.
Ish usuli «MD-birinchi»: avval o'quvchi ko'radigan har so'z MD'da tasdiqlanadi, keyin kod shu MD'ga moslanadi.
1-dars uchun v2 tayyor va u NAMUNA: `feedback/F-0928-QA-5modul/01-BotIntro-v2.md`. Sizning vazifangiz — o'z darsingiz uchun xuddi shunday
`NN-Nom-v2.md` (v2-qoralama) yozish. Keyin foydalanuvchi uni ChatGPT'ga audit qildiradi — shuning uchun ma'lum muammolar (Botjon, metafora,
emoji, takror blok, fakt-xatolar) sizning qoralamangizda ALLAQACHON hal bo'lgan bo'lishi kerak.

## Avval o'qing (shu tartibda, har birini bir marta)
1. `feedback/F-0928-QA-5modul/01-BotIntro-v2.md` — TO'LIQ. A-bo'lim (A1–A9) va har ekran ostidagi **Ko'rinish** bloki — sizning qoidangiz va formatingiz.
2. `feedback/F-0928-QA-5modul/DAVOM_2026-09-29.md` — 3-bo'lim (modul tartibi), 4/4-A (foydalanuvchi qarorlari), 6–7 (tasdiqlangan va tekshirilmagan faktlar — o'z darsingiz qatorlarini toping).
3. O'z darsingizning hozirgi matni: `feedback/F-0928-QA-5modul/NN-Nom-sozlar.md` (so'zma-so'z eksport, `[qator]` raqamlari bilan).
4. O'z darsingizning kodi (`.jsx`) — faqat kerakli joylar: ekran komponentlari (nima birdan ko'rinadi, nima bosilgandan keyin chiqadi: `&&`, `stage ===`, `useState`),
   `INLINE_KEYS`, `correctIdx`, `QUIZ_BANK` (✔ o'rni), `GearPanel`. Fayl katta — bo'lib, bir marta o'qing; grep bilan joy toping; qayta-qayta o'qimang.

## Qat'iy chegaralar
- HECH qanday faylni tahrirlamang. Faqat o'zingizga berilgan BITTA MD'ni yozasiz (Write) — berilgan scratchpad yo'liga. Commit yo'q. Server/brauzer ishga tushirmang.
- **Test to'g'ri javobi O'RNI o'zgarmaydi** (jonli ball kaliti): inline testlar, final va jonli viktorinada ✔ qaysi o'rinda bo'lsa, o'sha o'rinda qoladi.
  Variantlar matnini tahrirlash mumkin, tartibini — yo'q. Kod-bo'shliq variantlari tartibi ham o'zgarmaydi.
- Ekran soni va tartibi o'zgarmaydi (ekran qo'shish/olib tashlash yo'q). Katta tuzilma o'zgarishi kerak bo'lsa — «Agent eslatmalari»ga yozing, o'zingiz qilmang.
- PM darslarining uy vazifasi (`*.homework.jsx`) — tegilmaydi va MD'ga kirmaydi.

## Qoidalar (qisqa; to'liq matni — 01-BotIntro-v2.md A-bo'limi)
1. **A1 atamalar** butun modulda bir xil: Botjon → bot/botingiz · signal → **hodisa** (✅ foydalanuvchi qarori) · amal → javob (yoki «ish») · qoidalar varag'i/varaq/qator → **handler** ·
   kalit → **token** · Ro'yxat idorasi → **@BotFather** · xizmat oynasi → **Telegram Bot API** · qulfli tortma → **.env fayli** · to'xtamaydigan aylana → **sikl** ·
   fallback qator → **fallback handler** · o'zi so'rab turish/qo'ng'iroq → **polling/webhook** · konvert (ctx) → **ctx** · daftar → kontekstdagi haqiqiy nom
   (holat · suhbat tarixi · baza (PostgreSQL) · fikrlar ro'yxati) · chip → variant/bo'lak · ustoz → Mentor · trigger/action/event-driven → ishlatilmaydi.
   Darsingizda yangi metafora-atama bo'lsa — o'sha qoida: asosiy nom haqiqiy atama, o'xshatish ko'pi bilan bir marta (A-bo'limga qator qo'shing).
2. **Emoji yo'q** o'quvchi matnida (sarlavha, eyebrow, Mentor, karta, tugma, chat pufakchasi, kod, test, kartochka, recap, yakun). Qoladi: nishon medali, podium, tugma-belgilar ▶ ✓ ✕ ↻ → ←.
3. **Bir ma'no — bir blok:** Mentor aytgan gapni boshqa blok takrorlasa — Mentor qoladi, blok ketadi. Sarlavha va Mentor bir gapni aytmaydi. Ekranda bitta natija-ramka.
   Xulosa-ramka faqat yangi ma'no bersa turadi. Reja ekranidagi **«Jihozlar paneli» (GearPanel) olib tashlanadi** (✅ qaror) — Yakunga ham qo'yilmaydi.
4. **Navbat bilan ochilish:** ekranda 2+ bosiladigan/to'ldiriladigan qism bo'lsa, birdan chiqmaydi — joriy qadam ochiq, bajarilgani ✓ bilan bir qatorga yig'iladi, keyingisi keyin chiqadi.
   Istisno: test variantlari va final bo'laklari (hammasi birdan, teng).
5. **Animatsiya faqat ma'no ko'rsatadigan joyda** — yo'nalish, bog'lanish, sikl chiziladi. Bezak yo'q. Bir ekranda bitta. Qo'shni ekranlarda bir xil animatsiya takrorlanmaydi.
   Mos joy bo'lmasa — «Animatsiya: yo'q». Butun darsda 3–7 ta HA kutiladi, har ekranga emas.
6. **Qat'iy gaplar yumshatiladi:** 24/7, har doim, hech qachon, minglab, darhol, 100%.
7. **Test:** variantlar taxminan teng uzunlikda; atama/tire/strelka/qavs faqat to'g'rida bo'lmasin; xato variant ishonarli, lekin QISMAN TO'G'RI bo'lmasin (test halolligi).
   **Hook:** to'g'ri tanlovga «Aynan!», boshqasiga «Qiziq fikr!» (hozir hammasiga «Aynan!» bo'lsa — KOD). **Final:** joylar «1-qadam…»; Mentor gapi, uyacha yozuvi, hint tartibni aytmaydi.
8. **Faktlar:** «Keyingi dars — …» qatori App.jsx tartibiga mos (DAVOM 3-bo'lim; PM darslarida ham qo'shiladi). «O'tgan darsda…», «N-darsda…» havolalari tekshiriladi.
   Modul raqami va ichki kod yo'q — «N-darsda» deb yoziladi. AI vositasi sinfda — **gemini.google.com**. Texnik da'volar to'g'riligi tekshiriladi (Telegram, Telegraf, PostgreSQL, API).
   DAVOM 6–7-bo'limdagi darsingizga oid har bandni kodda tekshiring: to'g'ri bo'lsa tuzating (`✎ 🔴 FAKT: …`), noto'g'ri bo'lsa — eslatmada «tekshirdim, xato emas: …».
9. **Til:** adabiy o'zbekcha, «siz», lotin, to'g'ri apostrof ('). Kantselyarit yo'q (ushbu, hisoblanadi, amalga oshirmoq). Sheva/so'zlashuv yo'q. Kirill harfi yo'q.
   Jonli o'qituvchi ovozi: sokin, aniq, «hozir nima qilaman?» ni aytadi; sun'iy hayajon va «AI yozgandek» gaplar yo'q.

## MD tuzilmasi (namunadagi tartib)
1. Sarlavha: `# 5-Modul (LMS: 7-Modul) · N-dars «Nom» — YANGI MATN (v2-qoralama)` va namunadagi 5 qator (Fayl · ekran soni; Eski matn; fidbek usuli; ⚠️ test kalitlari —
   darsingizning haqiqiy `INLINE_KEYS` qiymatlari bilan; «Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi»).
2. `## A. Qoidalar` — «Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi.» + FAQAT shu darsga xos qo'shimchalar (yangi atama qatorlari, istisnolar). A1 jadvalini qayta ko'chirmang.
3. `## Darsning ipi` (olam — AvtoPizza yoki darsning o'z olami; hook; asosiy model; oldingi darsga ko'prik; tajribalar; keyingi dars).
4. `## Reja (oqim)` jadvali.
5. Har ekran: maydonlar (Eyebrow · Sarlavha · Mentor · …, holatga bog'liq HAMMA matn) → **Ko'rinish:** (kirganda nima; qaysi tartibda ochiladi; `Animatsiya: HA — … / yo'q`; `Olib tashlanadi: …`) → `✎` (nima o'zgardi va nega; 🔴 FAKT belgisi; **KOD** belgisi).
6. Takrorlash kartochkalari (jadval), Yakun (keyingi dars qatori bilan).
7. `## Qo'shimcha matnlar`: nishonlar (nomi inglizcha, mavzuga mos), qisqa takrorlash oynalari (ic → raqam), jonli viktorina (✔ o'rni o'zgarmaydi) + ✎.
8. `## KOD ro'yxati` (raqamlangan, ekran bo'yicha).
9. `## B. Bu darsdan tashqariga chiqadigan ishlar` (boshqa darsga, App.jsx'ga, umumiy fayllarga tegishli narsalar).
10. `## Agent eslatmalari` — MAKS 8 band: ikkilangan joylar, foydalanuvchi qarori kerak bo'lgan savollar, DAVOM 6–7 bandlarining tekshiruv natijasi (qisqa).

## Yakuniy javobingiz (menga, 8 qatordan oshmasin)
MD yo'li · ekranlar soni · ✔ o'rinlari o'zgarmaganini qanday tekshirdingiz · topilgan 🔴 FAKT soni va eng muhim 2 tasi · KOD bandlari soni · savollar (bo'lsa).
