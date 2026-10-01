# 5-Modul (LMS: 7-Modul) · 5-dars «Loyiha kuni: AI bilan bot» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotAiProjectLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `05-BotAiProject-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:2 · s8:0 · s10:3 · s14:1 · s15` tartib; arena ✔: `1·3·0·2·1·0·3·1·2·3·0·2`) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi · 29.09 v2-qoralama (F-0929-64) · **30.09: QA suratlari (F-0930-76…82) va ChatGPT UI auditi (F-0930-83) qo'llandi**; UI qoidalari U1–U3 — `01-BotIntro-v2.md` A-bo'limi. **30.09 (2-raund): ChatGPT matn auditi (F-0930-88) filtrlandi** — hukmlar `JURNAL.md`. **30.09 javoblari (F-0930-98):** 19-savol A — «topshiriq» → «prompt» butun darsda (vazifa ma'nosidagi «Topshiriq» yorlig'i qoldi) · 18-savol A — 4-savol mavzusi almashdi · 4-savol A — 7-ekran sabab variantlari aralash · 16-savol — to'g'ri javob izohi bitta gap.

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Quyida faqat shu darsga xos qo'shimchalar.

**A1 (shu dars uchun qo'shimcha qatorlar).** Asosiy nom — haqiqiy atama; o'xshatish ko'pi bilan bir marta.

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| direktor (siz) · yozuvchi (AI) · «rul sizda» · «direktorlik» | **AI bilan dasturlash**: siz promptni aniq yozasiz, AI kod yozadi, siz o'qib tekshirasiz | — (metafora qolmaydi: «direktor» 9-darsda «rahbar» ma'nosida ham bor) |
| vibecoding (asosiy nom sifatida) | AI bilan dasturlash | 1-ekran, bir marta: «Uni ko'pincha vibecoding deyishadi» + «bizda kod tekshiriladi» sharti |
| trigger → action · juftliklar | **hodisa → javob** juftlari (botning rejasi) | — (1-dars modeli: hodisa → handler → javob) |
| topshiriq · buyruq (aralash) | **prompt** (AI'ga yoziladigan matn) — 19-savol A, 6-dars bilan bir nom | 3-ekran Mentori: «AI'ga yoziladigan bu matn prompt deyiladi» |
| AI-build workflow · Workflow · naqsh · «yo'l» | **ish tartibi** (6 qadam) | 12-ekran kartasi |
| «Vibecoding sikli» · «AI bilan bot qurish sikli» · sikl (test → tuzatish ma'nosida) | **iteratsiya** — test → tuzatish → qayta test takrori | 7-ekran yakuni. «Sikl» faqat botning ish sikli uchun qoladi (1-dars A1, A2) |
| callback signal · signal | **callback** — tugma bosilishi hodisasi | 10-ekran, bitta gap (atama 3-darsda o'tilgan) |
| lokalda | kompyuteringizda | — |
| hosting · «doim onlayn» | server — 7-darsda | — |
| xato detektori | ishlatilmaydi | — |
| ko'r-ko'rona nusxalovchi | kodni o'qimasdan ko'chiradigan | — |
| istalgan bot | o'z botingiz · oddiy bot (A3) | — |
| Botjon to'liq jihozlangan · 8/8 buyum · kalit, varaq, daftar, maslahatchi, sumka | olib tashlanadi (F-0929-51, F-0929-63) | — |

**A6 istisnolari shu darsda.** 2, 3, 9-ekrandagi ochiladigan kartalar — hozirgidek (1-dars v2 2-ekrani kabi: istalgan tartibda, bosilgani bitta kartada).
7-ekrandagi sabab tanlovi — test emas (ball yo'q, faqat nishon), lekin variantlari birdan va teng chiqadi; tartibi o'zgarmaydi.

---

## Darsning ipi
- **Olam (bitta ip):** MyQuizBot — viktorina boti (0, 1, 5, 6, 7-ekran). Rejani solishtirish uchun yonida AvtoPizza boti (1–4-darslardagi bot) va eslatma boti (2-ekran); eslatma boti 12-ekranda «boshqa bot, o'sha yo'l» hikoyasi.
- **Hook:** ikki prompt — «menga Telegram bot yasab ber» va aniq prompt — AI'ga yuboriladi; natijalarga qarab qaysi biri yaxshiroq bot berishi tanlanadi.
- **Asosiy model (dars bo'yi bitta):** AI bilan ishlash tartibi — reja → aniq prompt → AI kodi → o'qish → test → tuzatish; test → tuzatish takrori — iteratsiya. Botning o'zi 1-dars modelida: hodisa → handler → javob.
- **Oldingi bilimga ko'prik:** 1-dars (handler, token, .env, fallback handler) · 3-dars (inline/reply tugma, `bot.action`, callback) · 4-dars (holat, PostgreSQL). AI yozgan kodni shu bilim bilan o'qiysiz.
- **Tajribalar:** reja (2) · prompt qismlari (3) · prompt yig'ish (5) · AI kodini o'qish (6) · test va tuzatish (7) · AI xatolari (9) · ikki yo'l (11) · eslatma boti (12) · tartibni yig'ish (15) · o'z botingiz (16).
- **Keyingi dars (App.jsx m5-06):** «Bot ichida AI».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — ikki prompt | hook | AI javoblarini ochadi, yaxshiroq promptni tanlaydi | — |
| 1 | Reja | qoida | bugungi botni ko'radi + 4 qadam | — |
| 2 | Avval reja | tushuncha | 3 botning hodisa → javob rejasini ochadi | — |
| 3 | Prompt tuzilishi | tushuncha | bugungi bot promptining 4 qismini ochadi | — |
| 4 | 1-savol | test | nega «menga bot yasab ber» — noaniq prompt | ✅ |
| 5 | Prompt yig'ish | amaliyot | 4 qismni navbat bilan qo'shadi | — |
| 6 | AI kodini o'qish | tushuncha | promptni yuboradi, AI kodini o'qiydi | — |
| 7 | Test va tuzatish | markaziy o'yin | botni test qiladi, sababni topadi, tuzatish promptini yuboradi | — (nishon) |
| 8 | 2-savol | test | AI kod bergach birinchi nima qilinadi | ✅ |
| 9 | AI xatolari | tushuncha | 4 ta ko'p uchraydigan xatoni ochadi | — |
| 10 | 3-savol | test | tugma bosildi, bot jim — sabab | ✅ |
| 11 | Ikki yo'l | tushuncha | AI'dan ikki xil foydalanishni solishtiradi | — |
| 12 | Boshqa bot | hayotiy | eslatma boti hikoyasini 5 qadamda ochadi | — |
| 13 | O'z botingiz | tushuncha | amaliyotdan oldingi ikki eslatmani o'qiydi | — |
| 14 | 4-savol | test | nega reja promptdan oldin | ✅ |
| 15 | Tartibni yig'ing | yakuniy | 6 bo'lakni tartiblaydi | ✅ (final) |
| 16 | Amaliyot · Loyiha kuni | praktika | o'z botini gemini.google.com bilan yozadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — ikki prompt  `[765]`
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Kodni AI yozadi. Qaysi prompt yaxshiroq bot beradi?**
- Mentor: Oldingi darslarda bot ichini o'rgandingiz: handler, tugmalar, holat va baza. Bugun kodni AI yozadi, lekin natija promptingizga bog'liq. Tugmani bosing va ikki promptni solishtiring.
- Karta «Noaniq prompt»: menga Telegram bot yasab ber
  - AI javobi: Dasturlash tilini o'zi tanladi, tugma turi noma'lum, token kodga ochiq yozildi. Buzilsa, sababini topish qiyin.
- Karta «Aniq prompt»: Node.js va Telegraf'da viktorina boti kerak: /start → «Boshlash» tugmasi, «Boshlash» → savol va A, B, C tugmalari, A/B/C → «To'g'ri» yoki «Xato». Tugmalar inline bo'lsin, token .env faylidan olinsin.
  - AI javobi: Telegraf kodi, inline tugmalar, token .env faylidan. Har qatorni tushunasiz — chunki nimani so'raganingizni bilasiz.
- Tugma: ▶ AI ikkalasiga javob bersin → ✓ Ikki natija solishtirildi
- Savol: **Qaysi prompt yaxshiroq bot beradi?**
  - Birinchisi — qisqa va tushunarli
  - Ikkinchisi — batafsil va aniq
  - Farqi yo'q — AI ikkalasini bir xil tushunadi
- Javob — 2-variant: **Aynan!** Aniq promptda asosiy qarorlarni siz aytasiz: texnologiya, tugma va token siz so'ragandek bo'ladi. Bugun shunday prompt yozishni va AI kodini tekshirishni o'rganamiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Natijalarga qarang: birinchi promptda AI ko'p narsani o'zi tanladi, token esa kodga ochiq yozildi. Ikkinchisida hammasini siz aytgansiz. Bugun shunday aniq prompt yozishni va AI kodini tekshirishni o'rganamiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, ikki prompt kartasi (ustma-ust) va tugma. Savol va variantlar hali yo'q (hozir xira bo'lib turadi — **KOD**).
Tugma bosilgach: har karta ostida «AI javobi» qatori chiqadi (ramkasiz, kartaning davomi) → shundan keyin savol va 3 variant → tanlangach javob izohi (ekrandagi yagona natija-ramka).
Animatsiya: yo'q.
Olib tashlanadi: AI javoblaridagi sariq va yashil ramkalar (ikki natija-ramka + izoh = uchta ramka edi; **KOD**) · 🤖.

✎ 🔴 FAKT: Mentor «Bot ichini butun modul davomida o'rgandingiz» → bu 14 darsli modulning 5-darsi → «Oldingi darslarda» · 🔴 FAKT (UI): variantlar «Chapdagi / O'ngdagi» — ikki karta bitta ustunda ustma-ust turadi (Screen0 `[781–788]`) → «Birinchisi / Ikkinchisi» · to'g'ri variantda yolg'iz turgan atama va ikki nuqta («aniq: trigger→action va texnologiya bilan») olindi, variantlar tenglashtirildi · javob tanlovga qarab ikki xil (**KOD:** hozir hammasiga «Aynan!») · sarlavhadagi «to'liq bot» olindi (A3) · «buyrug'ingizga» → «topshirig'ingizga» (bir tushuncha — bir nom)

## 1 · Reja  `[806]`
- Eyebrow: Reja
- Sarlavha: **Bugungi reja: viktorina botini AI bilan yozamiz.**
- Mentor: Bu usul — AI bilan dasturlash: siz promptni aniq yozasiz, AI kod yozadi, siz uni o'qib tekshirasiz. Uni ko'pincha «vibecoding» deyishadi. Bizda bitta shart bor: AI yozgan kodni tushunmasdan ishlatmaysiz.
- Yorliq: bugungi bot
- Chat «MyQuizBot»: foydalanuvchi /start → bot «Viktorinaga xush kelibsiz! Tayyormisiz?» · tugma: Boshlash
- Bugungi 4 qadam:
  1. Botni hodisa → javob juftlariga ajratish
  2. Aniq prompt yozish (4 qism)
  3. AI kodini o'qib tekshirish
  4. Test va tuzatish
- Tugmalar: (telefonda) 4 qadamni ko'rish / ↩ Botni ko'rish · Orqaga · Boshlaymiz →

**Ko'rinish:** hozirgidek — chapda bugungi bot (chat), o'ngda 4 qadam; telefonda navbat bilan (tugma orqali). Chatda «/start» bir qatorda, bot xabari va «Boshlash» tugmasi orasida oraliq (U2); 4 qadam — bosilmaydigan oddiy ro'yxat, yorliqsiz (U1). Chat ostidan pastgacha bo'sh joy — «Boshlaymiz →» dan boshqa narsa yo'q.
Animatsiya: yo'q.
Olib tashlanadi: «Jihozlar paneli» (qaror F-0929-63) · Mentordagi «Botjon endi to'liq jihozlangan — 8/8 buyum yondi: kalit, varaq, daftar, maslahatchi va sumka» · chat ostidagi izoh-karta «Siz buyurasiz — AI yozadi — siz tekshirasiz…» (Mentor bilan bir ma'no) · 🧠 (chat avatari va bot xabari).

✎ 30.09 QA F-0930-76 (rasm): «pastdagi yashil kichkina komponentlar kerakmi?» — Jihozlar paneli 29.09 da olingan (F-0929-63), ChatGPT ham «to'liq olib tashlash» deydi; «chatdagi komponentlar orasida joy» va tor pufakcha («/st art») — U2 (**KOD**) · qadam yorliqlari («reja · buyruq · nazorat · sikl») o'quvchiga chiqib turardi — olindi (U1) · 🔴 FAKT: «8/8 buyum» deyilib, 5 ta nom sanalardi, paneldagi 8 nom esa boshqacha edi (ichki ziddiyat) — butunlay olindi · sarlavha «Bugun siz — direktor. AI — yozuvchi» → metaforasiz · «rul sizda» olindi · vibecoding — bir marta, sharti bilan (2- va 3-Modulda o'quvchi bu so'zni «AI quradi, siz tekshirasiz» ma'nosida ko'rgan; Agent eslatmasi 1) · 4-qadam tegi «sikl» → «iteratsiya» (A2: sikl — botning ish sikli) · «dars oxirida — shu botni AI bilan qurib, tekshirasiz» → «bugungi bot» (botni 5–7-ekranlarda yozasiz, oxirida emas)

## 2 · Avval reja  `[846]`
- Eyebrow: Tushuncha · reja
- Sarlavha: **Promptdan oldin — reja. Bot nima qiladi?**
- Mentor: AI'ga yozishdan oldin botingizni hodisa → javob juftlariga ajrating: qaysi hodisa kelsa, bot qanday javob beradi. Har g'oyani bosib, uning rejasini ko'ring.
- G'oya tugmalari: Viktorina boti · AvtoPizza boti · Eslatma boti (ko'rilgani ✓ bilan belgilanadi)
- O'ng yorliq: «reja» → bosilgach «<g'oya nomi> — rejasi»
- **Viktorina boti:** 1) /start → «Boshlash» tugmali salom · 2) «Boshlash» tugmasi → savol va A, B, C tugmalari · 3) A, B yoki C bosildi → «To'g'ri» yoki «Xato»
- **AvtoPizza boti:** 1) /start → salom va «Menyu» tugmasi · 2) «Menyu» tugmasi → taomlar ro'yxati · 3) Taom tanlandi → manzil so'raydi · 4) Manzil keldi → buyurtmani tasdiqlaydi
- **Eslatma boti:** 1) /start → qisqa qo'llanma · 2) Eslatma matni → saqlaydi · 3) /royxat → eslatmalarni ko'rsatadi · 4) /ochir → eslatmani o'chiradi
- Uchalasi ko'rilgach: Botning rejasi — hodisa → javob juftlari ro'yxati. Shu ro'yxat promptga yozilsa, AI nimani yozish kerakligini biladi.
- Tugma: 3 g'oyani ko'ring (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 tugma, bosilgan g'oyaning rejasi o'ngda; xulosa 3/3 dan keyin.
Animatsiya: HA — reja ochilganda har qatorda hodisadan javobga strelka chiziladi (qatorma-qator, ~0.8 s): reja — yo'nalish, «shu kelsa → shu ketadi».
Olib tashlanadi: Mentordagi «Rejasiz topshiriq — noaniq bot» (sarlavha va xulosa bilan bir ma'no).

✎ «trigger → action» → «hodisa → javob» (1-dars A1: trigger/action ishlatilmaydi) · 🔴 FAKT (ichki ip): viktorina rejasining 4-qatori «/ball → yig'ilgan ballni ko'rsatadi» olindi — 5-ekran topshirig'ida ham, 6-ekran kodida ham yo'q, ballni saqlash esa holat talab qiladi; endi reja = topshiriq = kod (**KOD:** `BOT_IDEAS.quiz` 3 juft) · «Buyurtma boti» → «AvtoPizza boti» (1–4-darslar olami; juftlar 1-dars 12-ekrani bilan bir xil) · xulosadagi «xolos» olindi (A3)

## 3 · Prompt tuzilishi  `[879]`
- Eyebrow: Tushuncha · prompt tuzilishi
- Sarlavha: **Bugungi bot uchun promptda 4 narsa aytiladi.**
- Mentor: AI'ga yoziladigan bu matn prompt deyiladi. Har qismni bosing va u nega kerakligini o'qing: bu ma'lumotlarni AI o'zi bilmaydi — ularni siz aytasiz.
- Kartalar (bosilganda: nomi · «namuna» · nega kerak):
  - **Texnologiya** — «Node.js va Telegraf kutubxonasi ishlatilsin» — AI qaysi til va kutubxonani ishlatishni o'zi tanlamaydi.
  - **Hodisa → javob** — «/start → Boshlash tugmasi, Boshlash → savol, A/B/C → to'g'ri yoki xato» — Bot nima qilishi shu juftlarda. Ularni yozmasangiz, AI o'zi o'ylab topadi.
  - **Tugma turi** — «variantlar inline tugma bo'lsin» — Inline yoki reply — buni siz tanlaysiz. Ikkalasining farqini 3-darsda ko'rgansiz.
  - **Token .env faylida** — «token .env faylidan olinsin: process.env.BOT_TOKEN» — Aks holda AI tokenni kodga ochiq yozib qo'yishi mumkin — bu xavfli.
- Tugma: 4 qismni oching (N/4) → Davom etish

**Ko'rinish:** hozirgidek — 4 karta chapda, bosilgani o'ngda bitta kartada. Har kartada `›` belgisi turadi, bosilganida `✓` (U1, **KOD**) — hozir oq kartalar oddiy matn qatoriga o'xshaydi.
Animatsiya: yo'q.
Olib tashlanadi: yakuniy ramka «4 qism = aniq buyruq. AI taxmin qilmaydi, siz aytganini qiladi. Mana bu — direktorlik.» (kartalarning «nega kerak» qatorlarini qaytaradi; «taxmin qilmaydi» — ortiqcha da'vo; metafora) · Mentordagi 4 qism ro'yxati (kartalar ko'rsatadi).

✎ ChatGPT #8 **Qabul**: «Yaxshi topshiriq 4 qismdan iborat» — har qanday topshiriq uchun qoida bo'lib eshitiladi; 4 qism — shu viktorina boti uchun tanlangan → «Bugungi bot uchun topshiriqda 4 narsa aytiladi» (kartochka 4, viktorina 3 va Yakun ham shunga moslandi) · 30.09 QA F-0930-77 (2 rasm, kartalar chetiga chiziq) va ChatGPT UI #3–6: kartalar bosiladiganga o'xshamaydi — U1 · 🔴 FAKT: «Tugma turi» kartasi «(o'tgan darsda o'rgandingiz)» — inline/reply 3-darsda o'tilgan, o'tgan dars — 4-dars (holat va PostgreSQL) → «3-darsda ko'rgansiz» · 🔴 FAKT (ichki ip): «Hodisa → javob» namunasi «/start → menyu» edi, viktorina rejasida esa /start → Boshlash tugmasi → tuzatildi · «Botning butun mantig'i» → «Bot nima qilishi shu juftlarda» (A3) · «prompt» atamasi shu yerda bir marta · topshiriq ichidagi «yoz» → «-sin» shakli (butun darsda bir xil: «ishlatilsin», «olinsin»)

## 4 · 1-savol ✅  `[917]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Nega «menga bot yasab ber» — noaniq prompt?**
  - AI o'zbekcha yozilgan buyruqni tushunmaydi
  - «Iltimos» deyilmagan, buyruq qo'pol yozilgan
  - ✔ Unda texnologiya, tugma turi va token yo'q
  - AI Telegram uchun bot kodini yoza olmaydi
- To'g'ri: Noaniq promptda AI tilni, tugma turini va token joyini o'zi tanlaydi.
- Xato izohlari:
  - AI o'zbekchani ham tushunadi. Muammo tilda emas — promptda kerakli ma'lumot yo'q.
  - AI uchun odob emas, aniqlik muhim: muloyim, lekin noaniq prompt ham yomon natija beradi.
  - AI bot kodini yoza oladi — faqat unga nima kerakligini aniq aytish kerak.
  - (umumiy) Noaniq promptda AI ko'p narsani o'zi tanlaydi.

✎ 30.09 ChatGPT #10 **Qabul**: «yomon topshiriq» → «noaniq topshiriq» (0-ekrandagi karta nomi bilan bir; «yomon» baho beradi, «noaniq» — sababni aytadi); kartochka 5, viktorina 1, 1-oyna savoli ham · Variantlar tenglashtirildi: «Juda uzun — AI bunday uzun va chalkash matnni o'qiy olmaydi» ishonarsiz edi (4 so'zli topshiriq «uzun» emas) → «qo'pol yozilgan» (o'smir uchun ishonarli, lekin noto'g'ri) · tire to'g'ri javobda ham, xato variantda ham bor edi → hammasidan olindi · «QISQA» katta harf olindi · izohdagi «nazorat qila olmaysiz» → aniq sabab (til, tugma, token)

## 5 · Prompt yig'ish  `[937]`
- Eyebrow: Amaliyot · prompt yig'ish
- Sarlavha: **Endi viktorina boti uchun promptni o'zingiz yig'ing.**
- Mentor: 4 qismni birma-bir qo'shing — har biri promptga yoziladi. Tayyor promptni keyingi ekranda AI'ga yuborasiz.
- Chap yorliq: qismlarni qo'shing · tugmalar: Texnologiya + · Hodisa → javob + · Tugma turi + · Token .env + (qo'shilgach ✓)
- O'ng yorliq: sizning promptingiz · karta «Siz → AI»
  - bo'sh holatda: Qismlarni qo'shing — prompt shu yerda yig'iladi.
  - yig'iladigan matn: Viktorina boti kerak. + Node.js va Telegraf kutubxonasi ishlatilsin. + /start → «Boshlash» tugmali salom; «Boshlash» → savol va A, B, C tugmalari; A, B yoki C → «To'g'ri» yoki «Xato». + Variantlar inline tugma bo'lsin. + Token .env faylidan olinsin: process.env.BOT_TOKEN.
- Tugma: Promptni yig'ing (N/4) → Davom etish

**Ko'rinish (KOD — hozir 4 tugma birdan, istalgan tartibda):** faqat keyingi qism tugmasi faol; qo'shilgani ✓ bilan joyida qoladi, matni o'ngdagi promptga tushadi. Tugmalar tartibi = prompt matni tartibi.
Animatsiya: yo'q (qo'shilgan matn oddiy paydo bo'ladi).
Olib tashlanadi: yakuniy ramka «Mana — aniq, to'liq buyruq. AI endi taxmin qilmaydi. Keyingi ekranda…» (Mentor bilan bir ma'no; «taxmin qilmaydi» — ortiqcha da'vo) · 🧑‍💻.

✎ 🔴 FAKT (UI): «Pastdagi 4 qismni bosib» — kompyuterda qismlar chap ustunda turadi → yo'nalishsiz «4 qismni birma-bir qo'shing» · juftlar zanjir («/start → Boshlash tugma → savol + A/B/C variant → javobga to'g'ri/xato») o'rniga uchta aniq juft — 2-ekran rejasi bilan bir xil · «Node.js + Telegraf'da» → to'liq gap

## 6 · AI kodini o'qish  `[972]`
- Eyebrow: AI kodi · o'qish
- Sarlavha: **AI yozgan kodni o'qib tushunish — eng muhim qadam.**
- Mentor: Promptni yuboring va AI yozgan kodni o'qing. Kodning deyarli hammasi oldingi darslardan tanish; yangi qator bitta — `dotenv`: u .env faylini o'qiydi.
- Tugma: AI'ga promptni yuborish → «AI kod yozyapti…»
- Kod (fayl nomi `bot.js`) (**KOD** — kod mazmuni o'zgaradi):
  ```js
  require('dotenv').config()
  const { Telegraf, Markup } = require('telegraf')
  const bot = new Telegraf(process.env.BOT_TOKEN)

  bot.start((ctx) =>
    ctx.reply('Viktorinaga xush kelibsiz! Tayyormisiz?',
      Markup.inlineKeyboard([
        Markup.button.callback('Boshlash', 'start_quiz')
      ])))

  bot.action('start_quiz', (ctx) =>
    ctx.reply('Telegraf qaysi til uchun kutubxona? A: Python · B: JavaScript · C: Go',
      Markup.inlineKeyboard([
        Markup.button.callback('A', 'ans_a'),
        Markup.button.callback('B', 'ans_b'),
        Markup.button.callback('C', 'ans_c')
      ])))

  bot.launch()
  ```
- O'ng yorliq: kod izohi
  - `bot.start` → /start uchun handler
  - `Markup.button.callback` → inline tugma — siz so'ragandek
  - `bot.action('start_quiz')` → «Boshlash» bosilganda ishlaydigan handler
  - `process.env.BOT_TOKEN` → token .env faylidan (faylni `dotenv` o'qiydi)
- Xulosa: Siz so'ragan narsalar kodda ko'rinadi: inline tugmalar va .env dagi token. Hammasi ishlaydimi — buni test ko'rsatadi.
- Tugma: Avval promptni yuboring → Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, tugma. Bosilgach «AI kod yozyapti…» (~1.3 s) → kod → o'ngda 4 izoh qatori → xulosa (yagona natija-ramka).
Animatsiya: yo'q (7-ekranda chizilish bor — qo'shni ekranlarda ikkitasi bo'lmasin).
Olib tashlanadi: 🤖 🧠 · sarlavhadagi «AI kod yozdi» (tugma bosilmasdan oldin ham ko'rinardi — hali yozilmagan).

✎ 30.09: fayl nomi `quiz.bot.js` → `bot.js` (5-savol A — butun modulda bitta nom) · 🔴 FAKT (ichki ziddiyat 6↔7): eski kodda `bot.action` umuman yo'q edi, 7-ekranda esa «Boshlash» ishlaydi, A/B/C jim qoladi. Endi kodda `bot.action('start_quiz')` bor, A/B/C (`ans_a`, `ans_b`, `ans_c`) uchun handler yo'q — kodni diqqat bilan o'qigan o'quvchi xatoni shu yerda payqaydi, qolgani 7-ekranda test bilan topadi · 🔴 FAKT: eski xulosa «Siz so'raganingiz aynan bajarildi» — topshiriqdagi A/B/C juftini AI yozmagan → «Hammasi ishlaydimi — buni test ko'rsatadi» · `require('dotenv').config()` qo'shildi: oddiy Node.js fayli .env ni o'zi o'qimaydi (Agent eslatmasi 5) · `require('telegraf')` va `bot.launch()` qo'shildi — kod endi to'liq fayl · «Yaxshiyamki» (so'zlashuv) olindi · «ko'r-ko'rona qabul qilmang» → Mentor 1-ekranda aytgan, bu yerda takrorlanmaydi

## 7 · Test va tuzatish (markaziy o'yin)  `[1015]`
- Eyebrow: Markaziy · test va tuzatish
- Sarlavha: **Kod tayyor. Lekin u ishlaydimi? Test qilamiz.**
- Mentor: Botni ishga tushirdingiz. Tugmalarni birma-bir bosib ko'ring. Qaysidir tugma ishlamasa, sababini topib, AI'ga tuzatish promptini yuborasiz.
- Nishon qatori: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato tanlansa) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Chat «MyQuizBot (test)»: /start → «Viktorinaga xush kelibsiz! Tayyormisiz?» [Boshlash] → (bosilgach) «Telegraf qaysi til uchun kutubxona? A: Python · B: JavaScript · C: Go» [A · B · C]
- «Boshlash» bosilgach: «Boshlash» ishladi. Endi A, B yoki C ni bosing — nima bo'ladi?
- A/B/C bosilgach (tuzatishdan oldin): Tugma bosildi, lekin bot javob bermadi. Sababi nima?
  - `.env` faylidagi BOT_TOKEN noto'g'ri
  - ✔ A, B, C tugmalari uchun bot.action handleri yo'q
  - A, B, C tugmalari reply turida yaratilgan
- Xato sabab tanlansa (har biriga o'z izohi): (token) Bu sabab emas: bot hozirgina «Boshlash» ga javob berdi — token ishlayapti. · (reply) Chatga qarang: A, B, C xabarning tagida turibdi — bular inline tugmalar. Oxiri bir xil: Qaysi tugmalar javobsiz qoldi?
- To'g'ri sabab: Topdingiz! Kodda `bot.action('start_quiz')` bor — shuning uchun «Boshlash» ishladi. A, B, C uchun esa handler yo'q: promptda so'ralgan, lekin AI yozmagan. Endi AI'ga tuzatish promptini yuboring.
- Karta «Siz → AI (tuzatish)»: A, B, C tugmalari uchun bot.action handlerlari qo'shilsin: B bosilsa «To'g'ri!», A yoki C bosilsa «Xato. To'g'ri javob: B» deb javob berilsin.
- Tugma: Tuzatish promptini yuborish → «AI handler qo'shyapti…»
- Tuzatilgach: AI handlerlarni qo'shdi. A, B yoki C ni yana bosing va tekshiring.
- Bot javobi: B → «To'g'ri! Telegraf — JavaScript (Node.js) uchun kutubxona.» · A yoki C → «Xato. To'g'ri javob: B — JavaScript.»
- Yakun: Bot ishladi. Siz hozir iteratsiya qildingiz: test → xatoni topish → tuzatish → qayta test. AI bilan ishlashda bu takror odatda bir necha marta bo'ladi.
- Tugma: Botni test qilib, tuzating → Davom etish
- Nishon: Bug Catcher (sabab birinchi urinishda topilsa)

**Ko'rinish:** chat pufakchalari matnga qarab kengayadi — «/start», «Tayyormisiz?» so'z ichida bo'linmaydi, telefonda ham (U2, **KOD**); xabar va tugmalar orasida oraliq. Bosqichlar hozirgidek navbat bilan; o'ng ustunda bir vaqtda bitta yozuv (holat → savol va 3 variant → «Topdingiz» + tuzatish kartasi → «qo'shyapti…» → «qo'shdi» → yakun). Sabab variantlari birdan va teng (A6 istisnosi).
Animatsiya: HA — A/B/C bosilganda tugmadan bot tomon chiziq (callback) chiziladi va yarim yo'lda uziladi, javob o'rnida «…» qoladi (handler yo'q — bog'lanish yo'q); tuzatilgandan keyin xuddi shu chiziq oxirigacha chiziladi va javob chiqadi.
Olib tashlanadi: ⚠️ 🐞 🤖 ✅ ❌ 🎉 🧠 🏅 · maslahatdagi «(tugma bosilsa-yu javob bo'lmasa, handler yetishmaydi)» — javobni aytib qo'yardi, o'rniga fikrlashga undovchi savol · «AI yozgan kodni doim test qiling» dagi «doim» (A3).

✎ ChatGPT #14 **Qisman**: variantlar oson — «internet uzildi» → «tugmalar reply turida» (3-darsdagi bilim bilan, chatdagi dalil orqali rad etiladi; **KOD** `DIAG[2]` va izohlar, o'rni o'zgarmaydi). Uning taklifi «callback nomi handler bilan mos emas» olinmadi — u ham haqiqiy sabab bo'lishi mumkin, test ikki to'g'ri javobli bo'lib qolardi · ChatGPT #13 (start_quiz bugi) — 29.09 da tuzatilgan · 30.09 QA F-0930-78 (kompyuter va telefon suratlari): chat tor — «/st art», «Tayyormisiz ?» bo'linib ketgan, «mobileda ham tiqilib qolgan» → U2 · ChatGPT UI #7 («Boshlash» → keyin savol va variantlar) — 29.09 qoralamasida shunday · 🔴 FAKT (DAVOM 7): to'g'ri tashxis «'start_quiz' tugmasiga bot.action handleri yozilmagan» chatga zid edi — «Boshlash» (start_quiz) ishlaydi, javobsiz qolgani A/B/C → «A, B, C tugmalari uchun bot.action handleri yo'q» (o'rni — 1-variant, o'zgarmadi) · «Topdingiz» izohi 6-ekran kodiga tayanadi · to'g'ri variant yolg'iz uzun va texnik edi, qolganlari 2 so'z → uchala variant teng, atama ikkitasida · chatdagi savol «Telegraf qaysi tilda? B: JS/Node» → «qaysi til uchun kutubxona? B: JavaScript» (Telegraf 4-versiyasi TypeScript'da yozilgan, JavaScript/Node.js uchun ishlatiladi) · eyebrow «Vibecoding» olindi · «iteratsiya» atamasi shu yerda bir marta izohlanadi · «🎉 Bot to'liq ishladi!» → «Bot ishladi.»

## 8 · 2-savol ✅  `[1077]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **AI kod bergach, birinchi nima qilasiz?**
  - ✔ Kodni o'qib chiqaman va botni test qilaman
  - O'qimasdan, botni darrov mijozlarga beraman
  - Kodni o'chirib, hammasini o'zim qayta yozaman
  - AI'dan xuddi shu kodni yana bir marta so'rayman
- To'g'ri: Avval kodni o'qiysiz, keyin botni test qilasiz.
- Xato izohlari:
  - Xavfli: tekshirilmagan kodda xato bo'lishi mumkin, masalan handler yetishmasligi. Avval o'qing va test qiling.
  - Shart emas: AI kodi ko'pincha ishlaydi. Uni tushunib, test qilib, kerak joyini tuzatasiz.
  - Xuddi shu so'rov odatda o'xshash kod beradi. Avval o'qib, muammoni toping, keyin aniq tuzatishni so'rang.
  - (umumiy) AI kodini avval o'qiysiz, keyin test qilasiz.

✎ «AI'dan yana bir marta so'rayman, baribir» — tushunarsiz variant edi → aniq harakat · «to'g'ridan-to'g'ri ishlatib yuboraman» (eng uzun, so'zlashuv) → teng uzunlik · «doim o'qib tushunish kerak» → «Avval…» (A3) · «Bu — direktorlik» olindi · «xato/kamchilik» → «xato»

## 9 · AI xatolari  `[1097]`
- Eyebrow: Tushuncha · AI xatolari
- Sarlavha: **AI ham xato qiladi. Kodni tushunsangiz, xatoni topasiz.**
- Mentor: AI kodida uchrashi mumkin bo'lgan 4 xato bor. Har birini bosib ko'ring.
- Kartalar:
  - **Token kodda ochiq** — AI ba'zan tokenni to'g'ridan-to'g'ri kodga yozadi. Siz buni ko'rib, .env fayliga ko'chirasiz.
  - **Handler yetishmaydi** — Tugma bor, lekin uni ushlaydigan `bot.action` yo'q. Buni test paytida topasiz — viktorina botida ko'rganingizdek.
  - **Noto'g'ri tugma turi** — Siz inline so'radingiz, AI reply tugma yozdi (yoki aksincha). Farqini bilganingiz uchun tuzatasiz.
  - **Eski sintaksis** — AI kutubxonaning eski versiyasidagi kodni berishi mumkin. Telegraf hujjatlari bilan solishtirib, yangilaysiz.
- Tugma: 4 xatoni ko'ring (N/4) → Davom etish

**Ko'rinish:** hozirgidek — 4 karta, bosilgani bitta kartada; kartalarda `›` / `✓` (U1).
Animatsiya: yo'q.
Olib tashlanadi: yakuniy ramka «Bilim — bu sizning "xato detektoringiz". AI tezlikni beradi, siz to'g'rilikni ta'minlaysiz.» (sarlavha bilan bir ma'no; «ta'minlaysiz» — kantselyarit; metafora) · Mentordagi «E'tibor bering: har birini kodni tushungan odam topadi» (endi sarlavha aytadi).

✎ ChatGPT #16 **Qabul**: «ko'p uchraydigan» — manbasiz da'vo → «uchrashi mumkin bo'lgan» · 30.09 QA F-0930-79 (rasm): «Tushunsangiz — tutasiz» → «Kodni tushunsangiz, xatoni topasiz» — sarlavhaga qaytdi, QA shaklida (nimani tushunish va nimani topish aniq); Mentor endi takrorlamaydi (A5) · «AI kuchli, lekin mukammal emas. Mana eng tez-tez…» → qisqa · «bot.action/hears» → `bot.action` (bu darsdagi xato — inline tugma) · «Siz test qilib topasiz» → 7-ekranga bog'landi

## 10 · 3-savol ✅  `[1135]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Bot inline tugmali xabar yubordi. Tugma bosildi — bot jim. Sabab nima?**
  - Token noto'g'ri, Bot API so'rovni rad etdi
  - Inline emas, reply tugma ishlatish kerak edi
  - Kod oxirida bot.launch() yozilmagan
  - ✔ Shu tugma uchun bot.action handleri yo'q
- To'g'ri: Tugma bosilishini `bot.action` ushlaydi — u yozilmagan bo'lsa, bot jim qoladi.
- Xato izohlari:
  - Token ishlayapti: bot hozirgina xabar yubordi. Noto'g'ri token bilan u hech narsa yubora olmas edi.
  - Inline tugma to'g'ri tanlangan. U bosilganda botga callback keladi — uni ushlaydigan handler kerak.
  - Bot ishga tushgan: tugmali xabarni aynan u yubordi. Muammo — tugma bosilishini ushlaydigan handler yo'qligida.
  - (umumiy) Tugma bosilishi ham hodisa. Unga handler bo'lmasa, bot jim qoladi.
- Nishon: Handler Pro (birinchi urinishda to'g'ri bo'lsa)

✎ Test halolligi: «Internet juda tez ishlab yuborgani uchun», «Bot ko'p ishlab charchab qolgani uchun» — kulgili variantlar, to'g'ri javob darhol ko'rinardi → har biri ishonarli, lekin savoldagi dalil («bot xabar yubordi») bilan rad etiladi · qavs va kod faqat to'g'ri variantda edi («bot.action(...)») → to'g'rida qavs yo'q, kod ikkita variantda · «Botlar charchamaydi 🙂» olindi · «callback signal» → «callback — tugma bosilishi hodisasi» (A1)

## 11 · Ikki yo'l  `[1155]`
- Eyebrow: Tushuncha · ikki yo'l
- Sarlavha: **AI'dan ikki xil foydalanish mumkin. Farqi nimada?**
- Mentor: Ikkala odam ham kodni AI'dan oladi. Farq — keyin nima qilishida. Avval birinchisini o'qing, keyin tugmani bosing.
- Chap karta **Kodni o'qimasdan ko'chiradi**: «Bot yasab ber» deb yozadi → kodni ko'chiradi → ishga tushiradi. Tez, lekin buzilsa, sababini topolmaydi: kod ichida nima borligini bilmaydi. Yangi tugma qo'shish ham qiyin.
- Tugma: Ikkinchisini ko'rish → ✓ Ko'rdingiz
- O'ng karta **Kodni tushunib tekshiradi**: Kodni o'qiydi, test qiladi, xatoni topib, tuzatishni aniq so'raydi. Bot buzilsa — qayerdan buzilganini topadi; yangi tugma kerak bo'lsa — uni qayerga qo'shishni biladi.
- Xulosa: Shuning uchun oldingi darslarda bot ichini o'rgandik: handler, tugmalar, holat va baza. Kodni tushunsangiz, AI yozganini tekshira olasiz.
- Tugma: Farqni ko'ring → Davom etish

**Ko'rinish:** hozirgidek — chap karta va tugma; bosilgach o'ng karta, keyin xulosa.
Animatsiya: HA — chap kartada zanjir (prompt → ko'chirish → ishlatish) chiziladi va «buzildi» nuqtasida uziladi; o'ng kartada test va tuzatish orasida qaytuvchi strelka chiziladi (~1 s). Farqning o'zi — boshi berk ↔ takror.
Olib tashlanadi: 🙈 🎬 · «DIREKTOR (SIZ)» katta harf va metafora · «AI — sizning tezligingiz, siz — uning aqli va nazorati» · «Istalgan botni qura olasiz» (A3) · Mentordagi «Bu — sizni boshqalardan ajratadigan ko'nikma» (maqtov-da'vo).

✎ 30.09 QA F-0930-81 (rasm): «Farqni his qiling» → «farqni toping» — 29.09 da sarlavha «Farqi nimada?» savoli bo'lgan (o'quvchi o'zi topadi) · 🔴 FAKT: xulosa «butun modul davomida bot ichini o'rgandik» → bu 5-dars → «oldingi darslarda» · eyebrow «Falsafa · direktor» → «Tushuncha · ikki yo'l» · o'ng kartadagi 5 qadamli zanjir («Rejani tuzasiz → aniq buyurasiz → kodni o'qiysiz → test → tuzatasiz») olindi — ish tartibi 12-ekranda o'rgatiladi, bu yerda finalni yana bir marta ochib qo'yardi · «boshi berk ko'chada» → oddiy gap

## 12 · Boshqa bot — eslatma boti  `[1189]`
- Eyebrow: Hayotiy · boshqa bot
- Sarlavha: **Boshqa bot, o'sha yo'l: g'oyadan ishlaydigan botgacha.**
- Mentor: Endi eslatma botini ko'ramiz: g'oya boshqa, lekin qadamlar o'sha. Tugmani bosib, har qadamni oching.
- Qadamlar (birma-bir ochiladi):
  1. **Reja** — /start → qisqa qo'llanma · eslatma matni → saqlaydi · /royxat → hamma eslatmalar.
  2. **Aniq prompt** — «Node.js va Telegraf'da eslatma boti kerak: /start qisqa qo'llanma bersin, yuborilgan matn eslatma bo'lib saqlansin, /royxat hamma eslatmani ko'rsatsin. Tugma kerak emas. Token .env faylidan olinsin.»
  3. **AI kodi va o'qish** — AI uchta handler yozdi: `bot.start`, `bot.on('text')` va `bot.command('royxat')`. Hammasi tanish, lekin tartibiga e'tibor bering.
  4. **Test va tuzatish** — /royxat yuborildi, bot esa uni ham eslatma sifatida saqladi. Sabab: `bot.on('text')` har qanday matnni ushlaydi va u `bot.command('royxat')` dan oldin yozilgan. Tuzatish prompti: «bot.on('text') handlerlarning eng oxiriga o'tkazilsin».
  5. **Ishladi** — Eslatma saqlandi, /royxat hammasini ko'rsatdi. Bot ishlaydi va siz uning har qismini tushunasiz.
- Tugma: ▶ Boshlash → Keyingi qadam → → ✓ Bot tayyor
- Karta **Ish tartibi** (5/5 dan keyin): G'oya har xil, yo'l bir xil: reja → aniq prompt → AI kodi → o'qish → test → tuzatish. Shu tartib bilan o'z botingizni ham yozasiz.
- Tugma: Hikoyani oching (N/5) → Davom etish

**Ko'rinish:** qadamlar bittadan ochiladi (hozirgidek). «Ish tartibi» kartasi hikoya tugagach chiqadi (**KOD:** hozir boshidan ko'rinadi) — ekrandagi yagona natija-ramka.
Animatsiya: yo'q.
Olib tashlanadi: yakuniy ramka «Viktorina, buyurtma, eslatma — texnologiya bir xil, faqat trigger → action'lar farq qiladi…» («Ish tartibi» kartasi bilan bir ma'no) · 💡 · «NAQSH» katta harf.

✎ 🔴 FAKT (ichki ziddiyat): Mentor «aynan o'sha 5 qadam», yonidagi kartada va finalda esa 6 qadam → soni aytilmaydi · 🔴 FAKT (texnik): handlerlar «bot.start, bot.on('text'), bot.command('royxat')» tartibida yozilsa, Telegraf'da /royxat ni `bot.on('text')` ushlab qoladi va buyruq hech qachon ishlamaydi; eski hikoyada bu tartib saqlanib, bot «ishladi» deyilardi. Endi xatoning o'zi shu — u 1-darsdagi «fallback handler oxirida» qoidasiga va 3-darsdagi `bot.on('text')` fallback'iga bog'lanadi («massivga yozilmagan» o'rniga) · 3-qadamga «o'qish» qo'shildi — hikoya ish tartibining 6 qadamiga mos · topshiriqqa «Tugma kerak emas» qo'shildi — 4 qism to'liq · «doim bir xil», «istalgan botni qurasiz» olindi (A3)

## 13 · O'z botingiz  `[1227]`
- Eyebrow: Loyiha · o'z botingiz
- Sarlavha: **Endi navbat sizniki: o'z botingiz g'oyasini tanlang.**
- Mentor: Amaliyotda o'z g'oyangizni shu tartib bilan botga aylantirasiz. Boshlashdan oldin ikki narsani eslab qoling.
- Karta **1. Avval reja**: Prompt yozishdan oldin botingizni hodisa → javob juftlariga ajrating. Reja qancha aniq bo'lsa, kod ham shuncha aniq chiqadi.
- Karta **2. Hozircha kompyuteringizda**: Bot kompyuteringizda ishlaydi: kompyuter o'chsa, bot ham jim qoladi. Botni serverga joylashni 7-darsda o'rganasiz.
- Tugma: Tushundim → ✓ Tushundim → Davom etish

**Ko'rinish:** ikki karta bir ustunda, ostida bitta tugma (**KOD:** o'ng ustun olinadi).
Animatsiya: yo'q.
Olib tashlanadi: o'ng karta «🎒 BOTJON — TO'LIQ JIHOZLANGAN: 🔑 kalit · 📋 varaq · 📓 daftar · 🧭 maslahatchi · 🧰 sumka…» (F-0929-51) · yakuniy ramka «Bugun: AI bilan istalgan oddiy botni qura olasiz. Rul — sizda.» (A3, metafora) · 🗺️ 🖥️.

✎ 30.09 ChatGPT #21 **Qisman**: kartada bitta fikr qoldi (kompyuter o'chsa — bot jim); `bot.launch()` va polling tafsiloti olindi — ular 1 va 3-darsda o'tilgan, bu yerda yangi ma'no bermaydi · «hosting kerak — buni keyingi bosqichda o'rganasiz» → «7-darsda» (keyingi dars — 6 «Bot ichida AI», serverga joylash 7-darsda; 1-dars v2 11-ekrani ham shunday deydi) · «Doim onlayn bo'lishi uchun» → «Kompyuter o'chsa, bot ham jim qoladi» (A3; 1-dars sikli bilan bog'liq) · «hayotga tatbiq qilasiz» (rasmiy) → «botga aylantirasiz» · «lokalda» → «kompyuteringizda» · «Uyga vazifada» → «Amaliyotda» (o'z boti keyingi ekranda yoziladi)

## 14 · 4-savol ✅  `[1253]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Nega reja promptdan oldin yoziladi?**
  - AI rejani o'zi yaxshiroq tuzib beradi
  - ✔ Promptga yoziladigan juftlar rejadan olinadi
  - Reja faqat katta botlar uchun kerak bo'ladi
  - Reja kod yozilgandan keyin tuziladi
- To'g'ri: Promptga yoziladigan hodisa va javob juftlari rejadan olinadi.
- Xato izohlari:
  - AI botingiz nima qilishi kerakligini bilmaydi — rejani siz tuzasiz.
  - Kichik botga ham reja kerak: viktorina botining rejasi uchta juftdan iborat edi.
  - Kod rejadan keyin yoziladi: AI nimani yozishini reja va prompt belgilaydi.
  - (umumiy) Reja — promptning asosi: juftlar undan olinadi.

✎ 30.09 18-savol A (ChatGPT #22 ham shuni topgan): eski savol «AI bilan bot yozishda to'g'ri tartib qaysi?» keyingi ekrandagi finalning javobini aytib qo'yardi → mavzu «nega avval reja»; ✔ o'rni (2-variant) va jonli kalit `s14:1` o'zgarmadi; strelka va atama faqat to'g'rida bo'lmasin — variantlar strelkasiz; `RECAPS[14]` va `Q_LABELS` 4 ham moslandi (**KOD**)

## 15 · Tartibni yig'ing ✅ (final)  `[1273]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: AI bilan ishlash tartibini yig'ing.**
- Mentor: Bo'laklarni sudrab, to'g'ri tartibga qo'ying.
- Bo'laklar (aralash chiqadi): Reja · Aniq prompt · AI kod yozadi · Kodni o'qish · Test · Tuzatish
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · 6-qadam
- To'g'ri: ✓ Tartib to'g'ri: reja → aniq prompt → AI kodi → o'qish → test → tuzatish. Tuzatishdan keyin yana test qilinadi — bu takror iteratsiya.
- Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (xato urinishdan keyin): Qisqa takrorlash — mavzuni yana bir ko'rish
- Nishon: Build Order (birinchi to'liq urinishda to'g'ri bo'lsa)
- Tugma: Tartibni yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). Natija yozuvi bitta: to'g'ri bo'lsa — yuqoridagi «To'g'ri» ramkasi; xato bo'lsa — «Tartib xato» qatori (**KOD:** hozir `dd-done` + `frame-success` ikki ramka, xato uchun ham ikki yozuv).
Animatsiya: HA — to'g'ri yig'ilgach 6-qadamdan («Tuzatish») 5-qadamga («Test») qaytuvchi strelka chiziladi (iteratsiya — takror); faqat to'g'ri javobdan keyin.
Olib tashlanadi: Mentor «Bugun o'rgangan yo'lni eslang: rejadan boshlanadi, aniq topshiriq bilan davom etadi, AI yozadi, siz o'qib, test qilib, tuzatasiz» (javobni to'liq aytib berardi) · «AI-build workflow tayyor!» · ⚠️.

✎ 🔴 test halolligi (DAVOM 7): Mentor finalning javobini so'zma-so'z aytardi → olindi · bo'lak «Reja (trigger→action)» → «Reja» (qavs faqat bitta bo'lakda edi) · «Iteratsiya» → «Tuzatish» (iteratsiya — bitta qadam emas, test ↔ tuzatish takrori; buni animatsiya va To'g'ri yozuvi ko'rsatadi) · **KOD:** `RECAPS[15]` bor, ochish tugmasi yo'q (`setRecapOpen(true)` hech qayerda chaqirilmaydi, `[1280]`) → havola qo'shiladi · nishon Director → Build Order

## 16 · Amaliyot · Loyiha kuni  `[2100]`
- Eyebrow: Amaliyot · Loyiha kuni · joy: «kompyuteringizda»
- Sarlavha: **AI bilan o'z botingizni yozing**
- Topshiriq: O'z bot g'oyangizni tanlang va uni 3–4 ta hodisa → javob juftiga ajrating. Keyin gemini.google.com saytini oching, 4 qismli aniq prompt yozing, AI bergan kodni o'qing va botni kompyuteringizda ishga tushirib test qiling.
- Umumiy matn: Topshiriqni o'z kompyuteringizda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.
- Qadamlar:
  1. Bot g'oyangizni 3–4 ta `hodisa → javob` juftiga ajrating.
  2. gemini.google.com da 4 qismli prompt yozing: texnologiya, juftlar, tugma turi, token `.env` faylidan.
  3. AI bergan kodni o'qing: `bot.start`, `bot.action`, `process.env` — har qismini tushunasizmi?
  4. 1-darsda olgan tokeningizni `.env` fayliga yozing va botni kompyuteringizda ishga tushiring (kerakli buyruqlarni AI javobida ko'rasiz).
  5. Har tugmani bosib test qiling. Xato bo'lsa — tuzatish promptini yozing; xato bo'lmasa — bitta yangi tugma qo'shishni so'rang.
- Tugmalar: Bajardim (har qadamda) → ✓ Bajarildi — Mentorni kuting · «Botingiz ishladi. Mentor tekshirib, keyingi qadamga o'tkazadi.»

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi (1-dars v2 16-ekrani kabi; `ScreenLivePractice` bu darsdagi nusxasi).
Animatsiya: yo'q.
Olib tashlanadi: ✅ · «Zo'r!» (sun'iy hayajon) · Mentordagi «ustoz kuzatib turadi».

✎ 30.09 QA F-0930-82 (3 rasm): 2-qadamdagi kod-yorliq «texnologiya + juftliklar + tugma turi + token .env'dan» kartaning chetidan chiqib ketgan, telefonda qirqilgan — 29.09 da 2-qadam oddiy so'z bilan yozilgan (faqat `.env` kod), qolgani U2 (**KOD**) · «✅Bajardim» — emoji olinadi (A4) · 🔴 FAKT (DAVOM 7): «AI chat (masalan, Claude yoki ChatGPT)» → gemini.google.com (sinfdagi vosita) · «ustoz» → «Mentor» · «lokalda» → «kompyuteringizda» · 4-qadam qo'shildi: token (1-darsda olingan) va ishga tushirish — eski ro'yxatda bot qanday ishga tushishi aytilmagan edi · 5-qadam: «kamida bitta narsani tuzating» → xato bo'lmasa ham bajariladigan shart · «trigger→action» → «hodisa → javob»

## 17 · Natijalar (podium)  `[1847]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — 1-dars v2 B-5.)
- Savol yorliqlari (**KOD** `Q_LABELS`): 1 — Aniq prompt · 2 — Kodni tekshirish · 3 — Handler · 4 — Avval reja · 5 — Yakuniy tartib

✎ «Aniq prompt» → «Aniq topshiriq», «Workflow» → «Yakuniy tartib» (A1)

## 18 · Takrorlash (kartochkalar)  `[2114]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| AI'ga yoziladigan matn nima deyiladi? | Prompt | Qancha aniq bo'lsa, AI shuncha kam taxmin qiladi |
| Siz prompt yozasiz, AI kod yozadi, siz tekshirasiz — bu qanday usul? | AI bilan dasturlash | Kodni AI yozadi, uni tekshirish — sizning ishingiz |
| Prompt yozishdan oldin botni nimaga ajratasiz? | Hodisa → javob juftlariga | Bu ro'yxat — botning rejasi |
| Bugungi botning promptida qaysi 4 narsa aytildi? | Texnologiya, juftlar, tugma turi, token | To'rttasi aytilsa, AI kamroq taxmin qiladi |
| «Menga bot yasab ber» nega noaniq prompt? | AI hammasini o'zi tanlaydi | Texnologiya ham, tugma ham, token ham taxmin bilan chiqadi |
| Inline tugma bosilganda botga nima keladi? | Callback | Bu ham hodisa — uni handler ushlashi kerak |
| Callback'ni qaysi handler ushlaydi? | bot.action | Masalan, `bot.action('start_quiz', ...)` |
| Tugma bosildi, bot jim qoldi — nima yetishmayapti? | Handler | Shu tugma uchun `bot.action` yozilmagan |
| Bot tokeni qaysi faylda saqlanadi? | .env | Kodda faqat `process.env.BOT_TOKEN` turadi |
| AI kod bergach, birinchi nima qilasiz? | O'qiyman va test qilaman | Tushunmagan kodni ishlatmaysiz |
| `bot.on('text')` nega handlerlarning oxirida yoziladi? | U har qanday matnni ushlaydi | Oldinda tursa, /royxat buyrug'i ham unga tushib qoladi |
| Test, tuzatish va qayta test takrori nima deyiladi? | Iteratsiya | Bot ishlamaguncha takrorlanadi |

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ …)

✎ «Vibecoding» → «AI bilan dasturlash» · «Vibecodingda siz qanday rolda? — Direktor» kartochkasi olindi (metafora) → o'rniga 12-ekrandagi handler tartibi kartochkasi · «Trigger va action juftliklariga» → «Hodisa → javob juftlariga» · «Callback signal» → «Callback» (A1) · «siz buyurtmachi, AI ijrochi», «rul sizda», «ko'r-ko'rona ishlatilmaydi» olindi · «aylana» → «takror» («aylana» 9-darsda boshqa ma'noda — 1-dars v2 B-4)

## 19 · Yakun  `[2141]`
- Eyebrow: Tayyor · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Endi AI bilan bot yozish tartibini bilasiz.**
- Arena tugmasi (CodeStrike) · jonli darsda: Mentorni kuting
- Endi siz bilasiz:
  - AI bilan ishlash tartibi: reja → aniq prompt → AI kodi → o'qish → test → tuzatish
  - Promptdan oldin botni hodisa → javob juftlariga ajratasiz — bu botning rejasi
  - Bugungi botning promptida 4 narsa aytildi: texnologiya, juftlar, tugma turi va .env dagi token
  - AI kodini tushunmasdan ishlatmaysiz: avval o'qiysiz, keyin test qilasiz
  - AI ham xato qiladi (handler yo'q, token ochiq) — kodni tushunganingiz uchun uni topib, tuzatasiz
- Uyga vazifa · Amaliy topshiriqni bajarish → (bosilganda ochiladi) Uyga vazifa:
  - **Tugating** — amaliyotdagi botingizni oxirigacha yozing: har tugmasi ishlasin
  - **Qo'shing** — botga bitta yangi buyruq (masalan, /help) qo'shish uchun tuzatish promptini o'zingiz yozing va AI bilan qo'shing
  - **Saqlang** — bot kodini va prompt matnini saqlang: 7-darsda botni serverga joylaysiz
- Keyingi dars — **«Bot ichida AI»**. Bugun AI botingizning kodini yozdi. Keyingi darsda AI botning ichida ishlaydi: mijoz savoliga javobni o'zi yozadi.
- Nishonlaringiz — N/4 · Orqaga · Qaytadan · Yakunlash ✓

**Ko'rinish:** hozirgidek; uyga vazifa bosilganda ochiladi; «Keyingi dars» qatori uyga vazifa ostida (**KOD** — qator hozir yo'q).
Olib tashlanadi: uyga vazifa ostidagi izoh «🎉 Bu — modulning so'nggi darsi. Botjon endi to'liq jihozlangan: kalit, varaq, daftar, maslahatchi va sumka — hammasi sizda!» · belgi «Botjon to'liq jihozlandi 🎒» · sarlavhadagi «istalgan botni quradigan direktorsiz» · ⏳ 📝 🏅 (matn oldidagi).

✎ 🔴 FAKT (DAVOM 6): «Bu — modulning so'nggi darsi» → 14 darsli modulning 5-darsi; izoh butunlay olindi · 🔴 FAKT: «Keyingi dars» qatori yo'q edi → App.jsx m5-06 «Bot ichida AI» qo'shildi (6-darsda AI mijozga javob yozadi — 1-dars v2 8-ekrani ham shunga havola beradi) · sarlavha: metafora va «istalgan» olindi (A3) · 1-xulosa «(iteratsiya)» qavsi va «sikl» → ish tartibi · uyga vazifa amaliyotni takrorlardi (reja → prompt → quring) → davomi: tugatish, bitta iteratsiya, 7-darsga saqlash

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Prompt Smith** — Noaniq va aniq promptni farqladingiz (1-savol)
- **Bug Catcher** — Yetishmagan handlerni test bilan topdingiz (7-ekran)
- **Handler Pro** — Bot jim qolgani sababini topdingiz (3-savol)
- **Build Order** (hozir Director) — AI bilan ishlash tartibini to'g'ri yig'dingiz (15-ekran)
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

✎ Director → Build Order (metafora olindi; `id: director` o'zgarmaydi, faqat `name` va `desc`) · Director belgisi 🎬 metaforaga bog'langan edi — almashtirish ixtiyoriy (o'yin qatlami) · «Reja → prompt → kod → test siklini» → «AI bilan ishlash tartibini» (sikl — botning ish sikli)

**Qisqa takrorlash oynalari (5)** — karta belgisi (`ic`) o'rniga kod misoli (U3), kodsiz kartada raqam; «Belgilar» qatori ro'yxat ostida:
1. (4) **Aniq prompt — aniq bot:** Noaniq prompt — «Menga bot yasab ber» juda umumiy: texnologiya, tugma turi va tokenni AI o'zi tanlaydi. · Aniq prompt — texnologiya, hodisa → javob juftlari, tugma turi va token aytilsa, AI kamroq taxmin qiladi. · Natija sizga bog'liq — nima yozilishini prompt belgilaydi, promptni esa siz yozasiz. · Sinfga savol: Nega «yasab ber» — noaniq prompt?
2. (8) **AI kodini o'qib, test qilish:** Avval o'qing — AI kodni tez yozadi, lekin uni tushunmasdan ishlatmang. · Keyin test qiling — botni ishga tushirib, har tugmani bosib ko'ring. · Kerak bo'lsa tuzating — xato topsangiz, AI'ga aniq tuzatish promptini yozasiz. · Sinfga savol: AI kod bergach, birinchi nima qilasiz?
3. (10) **Handler yo'q — javob yo'q:** Tugma bosilishi — hodisa: inline tugma bosilganda botga callback keladi. · Uni `bot.action` ushlaydi — shu tugma uchun `bot.action` yozilmagan bo'lsa, bot jim qoladi. · Yechim — handler qo'shish: tuzatish promptida qaysi tugma uchun handler kerakligini aniq yozing. · Sinfga savol: Inline tugma bosildi, bot javob bermadi — sabab?
4. (14) **Nega avval reja:** Reja — botning hodisa → javob juftlari ro'yxati. · Prompt shu juftlardan yoziladi — reja aniq bo'lsa, prompt ham aniq. · Rejasiz — AI o'zi taxmin qiladi: botingiz nima qilishini u bilmaydi. · Sinfga savol: Nega reja promptdan oldin yoziladi?
5. (15) **Nega aynan shu tartib:** Avval reja va prompt — AI nimani yozishini ular belgilaydi. · O'qish testdan oldin — kodni tushunsangiz, test paytidagi xatoning sababini tez topasiz. · Tuzatish oxirida — tuzatishdan keyin yana test qilinadi; bot ishlamaguncha shu takrorlanadi. · Sinfga savol: Nega reja eng boshida, test esa oxirida?
- Belgilar (U3): 1-oyna — 1 · 2 · 3 | 2-oyna — 1 · 2 · 3 | 3-oyna — `Markup.button.callback('A', 'ans_a')` · `bot.action('ans_a', …)` · 3 | 4-oyna — 1 · 2 · 3 | 5-oyna — 1 · 2 · 3 (prompt va tartib — kodsiz)

✎ «Rul sizda … direktor sizsiz» → «Natija sizga bog'liq» · «callback signal» → «callback» · 5-oyna 4-oynani deyarli takrorlardi (ikkalasida bir xil chizma) → «nega shu tartib» ga o'zgardi, chizma olindi · «AI-build workflow» → «Nega aynan shu tartib» · 🌫️ 🎯 🎬 🔍 🧪 🔧 🔘 🔌 🗺️ 📝 🔁 🤖 🗣️ 📖 olindi · 30.09 QA F-0930-80 (2 rasm: 🔌 va tugma surati): «emojilar o'rniga koddan misol» → 3-oynada kod qatorlari (U3)

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Nega «menga bot yasab ber» — noaniq prompt? AI o'zbekcha yozilgan buyruqni tushunmaydi · ✔ Unda texnologiya, tugma turi va token yo'q · «Iltimos» deyilmagan, buyruq qo'pol yozilgan · AI Telegram uchun bot kodini yoza olmaydi
2. AI'ga prompt yozishdan oldin nima qilinadi? Boshqa botning tayyor kodi ko'chirib olinadi · Bot kodi darrov serverga joylab qo'yiladi · Token kodning birinchi qatoriga yoziladi · ✔ Botning hodisa va javoblari rejaga yoziladi
3. Viktorina botining promptida qaysi 4 narsa aytildi? ✔ Texnologiya, juftlar, tugma turi va token · Bot nomi, rangi, rasmi va qisqa tavsifi · Token, parol, telefon raqami va login · Server manzili, domen, narx va logotip
4. AI kod bergach, birinchi nima qilasiz? O'qimasdan, botni darrov mijozlarga beraman · Kodni o'chirib, hammasini o'zim qayta yozaman · ✔ Kodni o'qib chiqaman va botni test qilaman · AI'dan xuddi shu kodni yana bir marta so'rayman
5. Bot tugmali xabar yubordi, lekin tugma bosilganda jim. Sabab? Token noto'g'ri, Bot API so'rovni rad etdi · ✔ Shu tugma uchun bot.action handleri yo'q · Inline emas, reply tugma ishlatish kerak edi · Kod oxirida bot.launch() yozilmagan
6. AI tokenni kodga ochiq yozib qo'ydi. To'g'ri yechim qaysi? ✔ Tokenni .env fayliga ko'chirish · Tokenni bot.js faylining oxiriga ko'chirish · Tokenni uzunroq qilib qayta yozish · Hech narsa qilmay, shundayligicha qoldirish
7. AI bilan dasturlashda ish qanday bo'linadi? AI hamma qarorni o'zi qabul qiladi, siz kutasiz · Kodni siz yozasiz, AI esa faqat uni o'qiydi · AI kod yozadi va o'zi tekshiradi, siz ko'rmaysiz · ✔ Siz prompt yozasiz, AI kod yozadi, siz tekshirasiz
8. AI kodida qanday xato bo'lishi mumkin? AI kodida xato bo'lmaydi, u mukammal yozadi · ✔ Tugma uchun handler yozilmay qolishi mumkin · Xato faqat token noto'g'ri bo'lsa chiqadi · Xato faqat internet sekin bo'lganda chiqadi
9. Test paytida xato topildi. Keyin nima qilinadi? Loyiha tashlanadi, boshqa g'oya olinadi · Boshqa bot noldan yozila boshlanadi · ✔ AI'ga aniq tuzatish prompti yoziladi · Kod o'chiriladi va AI'dan qayta so'raladi
   ✎ 01.10 (F-1001-54, razrabotka): 4-variant `lint:tell` uchun — «AI» faqat to'g'ri variantda edi; ✔ o'rni o'sha.
10. AI bilan bot yozishning to'g'ri tartibi qaysi? Prompt → AI kodi → nusxalash → ishlatish · Test → reja → prompt → AI kodi → o'qish · AI kodi → ishlatish → buzilsa, tashlab ketish · ✔ Reja → prompt → AI kodi → o'qish → test → tuzatish
11. «Iteratsiya» nima? ✔ Test, tuzatish va qayta test takrori · Botni bir marta yozib, boshqa o'zgartirmaslik · Eski tokenni yangisiga almashtirish · Bot dasturini qayta ishga tushirish
12. AI kodni yozsa ham, bot ichini bilish nega kerak? AI faqat bot ichini biladiganlarga kod yozadi · Bilmasangiz, AI kod yozishdan bosh tortadi · ✔ AI yozgan kodni tekshirib, xatosini topish uchun · Bot ichini bilsangiz, kod tezroq ishlaydi

✎ 1: «Juda uzun» distraktori ishonarsiz, tire faqat to'g'ri va bitta xatoda → inline 1-savol bilan bir xil variantlar · 2 va 3: strelka/atama faqat to'g'rida edi («trigger→action») → strelkasiz · 3: «Faqat token, parol va telefon raqami» → teng uzunlik · 5: kulgili variantlar («Internet juda tez», «charchab qolgani») → inline 3-savol kabi ishonarli, dalil bilan rad etiladigan variantlar · 6: qavs faqat to'g'rida edi («(process.env)») → olindi, atama xato variantda ham bor · 7: «Vibecoding (direktor va yozuvchi)» → «AI bilan dasturlash»; «Kodni umuman yozmaslik, faqat kutib turish» → ishonarliroq · 8: «Bot hech qachon xato qilmaydi» (savol AI haqida edi, variant bot haqida) → AI haqida · 11: strelka faqat to'g'rida edi → so'z bilan · 🔴 12: «Vibecoding'da siz qaysi rolni — Direktor» 7-savolni takrorlardi va metaforaga tayanardi → yangi savol (11-ekran g'oyasi: nega bot ichini bilish kerak)

**Test ekranlarining umumiy yozuvlari (emojisiz):** To'g'ri javobni toping · To'g'ri · Qaytadan urinib ko'ring · Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: X — … · (xato bo'lsa) Qisqa takrorlash — mavzuni yana bir ko'rish

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — savol va variantlar tugma bosilgandan keyin chiqadi; javob izohi tanlovga qarab ikki xil («Aynan!» / «Qiziq fikr!»); AI javoblari ramkasiz (`frame-warn`/`frame-success` olinadi), yagona natija — hook izohi.
2. s1 — `GearPanel` va `sk-info` izoh-kartasi olinadi; yorliq «bugungi bot»; qadam teglari.
3. s2 — `BOT_IDEAS`: viktorina 3 juft (`/ball` olinadi), «Buyurtma boti» → «AvtoPizza boti»; juftlarda hodisadan javobga strelka chiziladi.
4. s3 — yakuniy `frame-success` olinadi; `PROMPT_PARTS` matnlari (`short` «Hodisa → javob», `text`, `why`).
5. s5 — qismlar navbat bilan (faqat keyingi qism faol); yakuniy ramka olinadi; «Siz → AI» belgisidan emoji olinadi.
6. s6 — `CodeFile` mazmuni (dotenv, `require('telegraf')`, `bot.action('start_quiz')` + A/B/C tugmalari, `bot.launch()`); `ANNO` 4 qator; xulosa matni; sarlavha.
7. s7 — `DIAG` matnlari (tartib o'zgarmaydi); xato/to'g'ri izohlari; tuzatish kartasi; chat savoli va bot javoblari; callback chizig'i animatsiyasi (uziladi → tuzatilgach to'liq).
8. s9 — yakuniy ramka olinadi; sarlavha.
9. s11 — kartalar matni; ikki zanjir animatsiyasi (uziladi ↔ qaytadi).
10. s12 — `STEPS` matnlari; «Ish tartibi» kartasi 5/5 dan keyin chiqadi; yakuniy ramka olinadi.
11. s13 — o'ng ustun (BOTJON kartasi) va yakuniy ramka olinadi; bir ustunli joylashuv.
12. s15 — Mentor matni; `FLOW` yorliqlari («Reja», «Tuzatish»); `doneText` va `frame-success` bitta ramkaga, ikki «Tartib xato» yozuvi bittaga; `RECAPS[15]` ochish havolasi (xato urinishdan keyin); 6 → 5 qaytuvchi strelka.
13. s16 — `ScreenLivePractice` checklist navbat bilan (bu darsdagi nusxa); «ustoz» → Mentor; `task`, `checklist`.
14. s19 — `hw-note` olinadi; «Keyingi dars» qatori qo'shiladi; `done-chip`, `RECAP`, `HOMEWORK` matnlari.
15. Meta — `LESSON_META.lessonTitle` «Loyiha kuni: AI bilan istalgan bot» → «Loyiha kuni: AI bilan bot» (`lessonId` o'zgarmaydi); `LiveGate` sarlavhasi «Botjon darsi» → «Loyiha kuni: AI bilan bot» `[3177]`; `Q_LABELS`; `ACHIEVEMENTS.director` nomi va tavsifi.
15a. Butun dars — UI qoidalari U1–U3: harakat tugmalari bitta asosiy uslubda; 3, 9-ekran kartalarida `›` / `✓`; 1-ekran qadam teglari olinadi; `TgChat` oraliqlari va so'z bo'linmasligi (1, 7-ekran, telefon); 16-ekran kod-yorlig'i o'raladi; RECAPS `ic` → kod misoli.
16. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`): `TgChat ava` 🧠 → harf, bot xabarlari, `AchRule` 🏅, `QuestionScreen` shablon yozuvlari (⚡ 📨 📖), `RECAPS` `ic` → raqam, `Flashcards` 🎉, uyga vazifa 📝; arena foni `QZ_BG_SHAPES` dagi «trigger→action» va «vibecoding» → «hodisa», «iteratsiya» (atama izchilligi; arena/podium belgilari — o'yin qatlami, qoladi).

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **App.jsx m5-05 `sub`** «promptlar bilan istalgan Telegram bot» → «AI bilan bot yozish: prompt, o'qish, test» (A3 «istalgan»; App.jsx — chegaradan tashqarida).
2. **6-dars v2:** «AI» ikki rolda keladi — 5-darsda kod yozadigan yordamchi (gemini.google.com), 6-darsda bot ichidagi AI. 6-dars kirishida farq bir gapda aytilsin — bu darsning «Keyingi dars» qatori shunga tayanadi. 6-dars amaliyotidagi Claude/ChatGPT ham gemini.google.com ga (DAVOM 7).
3. **7-dars v2:** bu dars 13-ekranda va uyga vazifada «botni serverga 7-darsda joylaysiz» deydi — 7-darsda server nomi va joylash qadamlari bo'lishi kerak (DAVOM 7 dagi «hosting nomi/qadamlari yo'q» bandi bilan bir ish).
4. **9 va 10-dars v2:** «direktor» metaforasi u yerda ham bor («Siz direktorsiz», «Direktor tanlaydi»); 9-darsda esa «restoran egasi / direktor» — boshqa ma'no. Bu darsda metafora olindi; 9/10 da ham A1 bo'yicha.
5. **9-dars v2:** «iteratsiya» bu darsda «test → tuzatish → qayta test takrori» deb kiritildi. 9-dars «aylana» o'rniga shu so'zni olsa (1-dars v2 B-4), ta'rifi mos bo'lsin (takrorlab yaxshilash).
6. **3-dars v2:** «yashirin signal (callback)» → «callback — tugma bosilishi hodisasi»; bu dars shu nomni ishlatadi.
7. **«vibecoding» kurs bo'yicha:** 2- va 3-Modul darslarida ham bor (`PracticeLesson1`, `ReactProjectDayLesson` va b.) — «AI quradi, siz tekshirasiz» ma'nosida. Ta'rif butun kursda bitta bo'lishi kerak (KATTA_TOZALASH nomzodi; umumiy fayl — yozilmaydi).
8. **`AchRule` matni** (MATN_KORPUS §183 «hamma darsda aynan bir xil»): 🏅 siz variant butun modulda bir xil bo'lishi kerak → QONUN_NOMZODLARI.
9. **RU matni** — o'zbekcha tasdiqlangach.

---

## Agent eslatmalari
1. **«vibecoding» — savol.** Asl ma'nosi (A. Karpathy, 2025-yil fevral): AI kodini o'qimasdan, natijaga qarab qabul qilish. Eski dars uni «siz buyurasiz, AI yozadi, siz tekshirasiz» deb ta'riflagan (kartochka 2, arena 7/12), 2/3-Modul ham shunday. v2: asosiy nom — «AI bilan dasturlash», «vibecoding» faqat 1-ekranda bir marta, «bizda kod tekshiriladi» sharti bilan. So'zni butunlay olib tashlaymizmi yoki shu holatda qoldiramizmi?
2. **14-savol va 15-final bir xil javob — savol.** 14 ning to'g'ri javobi (6 qadamli tartib) finalni ochib qo'yadi (12-ekran kartasi o'rgatishi — me'yorida). Taklif: 14-savol mavzusi «Nega reja promptdan oldin?» ga almashsin (✔ o'rni — 2-variant qoladi, `RECAPS[14]` birinchi kartasi mos). v2 da hozircha tartib savoli qoldi, faqat variantlar tenglashtirildi.
3. **DAVOM 6–7 (5-dars) tekshiruvi — hammasi kodda tasdiqlandi:** 19 «so'nggi darsi» `[2195]` va 0/11 «butun modul» `[780]`/`[1180]` → tuzatildi · 3-ekran «o'tgan darsda» `[749]` (inline/reply 3-darsda) → tuzatildi · final javobni ochadi — 15 Mentor `[1286]` → olindi (+ 11-ekran zanjiri) · `RECAPS[15]` bor, `setRecapOpen(true)` hech qayerda yo'q `[1280]` → KOD · 16 Claude/ChatGPT `[2103]` → gemini · 7-ekran ziddiyat `[1028]`/`[1062]` → tuzatildi · «trigger → action» izohsiz → «hodisa → javob».
4. **Yangi topilmalar (DAVOM'da yo'q):** 0-ekran «Chapdagi/O'ngdagi» — ikki karta bitta ustunda · 6-ekran kodida `bot.action` yo'q, 7-ekranda «Boshlash» ishlaydi · 12-ekran handler tartibi (Telegraf'da `bot.on('text')` command'dan oldin tursa /royxat ishlamaydi) va «5 qadam» ↔ 6 qadam · 5-ekran «Pastdagi» — qismlar chapda · viktorina rejasidagi `/ball` prompt va kodda yo'q.
5. **`dotenv` qatori** (6-ekran) — oddiy Node.js fayli .env ni o'zi o'qimaydi (`dotenv` yoki `node --env-file`). 3-dars botni NestJS ichida yozadi — u yerda .env qanday o'qilishi tekshirilmadi. Qator ortiqcha tuyulsa, olib tashlanadi, izoh «token .env faylidan» qoladi.
6. **7-ekran sabab variantlari:** to'g'ri variant doim birinchi (jonli kalit emas, faqat nishon). Tartib qoidasi sababli tegilmadi — aralashtirish kerakmi?
7. **Metafora 0 marta.** «direktor/yozuvchi» butunlay olindi (o'zbekchada «direktor» — rahbar, 9-darsda shu ma'noda ham bor; kino ma'nosi — «rejissyor»). Bitta o'xshatish kerak bo'lsa, 1-ekran Mentoriga qo'shiladi. Nishon Director → Build Order.
8. **Tekshirildi, xato emas:** 1-dars v2 11-ekrani «webhook'ni 7-darsda, botni serverga joylaganda» deydi — bu darsning 13-ekrani ham 7-darsga havola beradi, mos. `INLINE_KEYS` `{s4:2, s8:0, s10:3, s14:1, s15:0}` va `QUIZ_BANK.correct` `1·3·0·2·1·0·3·1·2·3·0·2` MD'dagi ✔ o'rinlari bilan birma-bir solishtirildi.
