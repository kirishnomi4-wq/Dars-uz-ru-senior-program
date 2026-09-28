# Ertalabki savollar (tungi avtopilot, 28.09) — namunaga tushmagani uchun TEGILMADI

## Routing (m4-05)
- **R1 · s8 (10-ekran):** «Nest'da res.send yo'q!» kartasi va «return yetarli» chipining izohi bir gapni aytadi. Karta qolsinmi / olinsinmi?
- **R2 · s13 (15-ekran):** sudrab-joylash katagiga chip tushgach, katak yozuvi («GET /games — ro'yxatni ol») yo'qolib, faqat raqam qoladi. Yozuv chip yonida saqlansinmi? (umumiy mexanika — tegilmadi)
- **R3 · s5 (6-ekran):** ekranda 4 ta method, tugmada «0/3 method ko'ring» (3 tasini ko'rish yetarli). Chegara 3 qolsinmi yoki 4?

## DataIntro (m4-01)
- **D1 · ruscha rejimda post-ma'lumotlari** («Tog' sayohati», «Yangi rasm», «Tushlik», «Match kuni»): DataIntro'da o'zbekcha QOLDI
  (JSON-oyna, jadvallar, IgCard va s4 test variantlari — 8+ joy birga o'zgaradi). Shu ma'lumotlar DbSqlNosql'da (m4-03) agent tomonidan
  ruschaga o'girilgan («Поход в горы · Новый рисунок · Обед»). **Ikkalasi bir xil bo'lsin: DataIntro'ni ham tarjima qilaymi (tavsiya — ha,
  S7 bilan bir oila: ko'rsatiladigan ma'lumot) yoki DbSqlNosql'ni o'zbekchaga qaytaraymi?** Ustun nomlari (sarlavha, rasm) — kod, qoladi.

## PostgresCrud (m4-06)
- **P1 · s4 (5-ekran), s9 (11-ekran) — baholanadigan testlar:** variantlarda tavsif bor («INSERT INTO — yangi qator qo'shadi»), savol esa
  «yangi qator qo'shish uchun…» deydi — to'g'ri variant savol so'zini aynan qaytaradi (159/17 ga yaqin). **Taklif:** variantlarda faqat buyruq
  nomi qolsin (`INSERT INTO` · `SELECT` · …), tavsif izohga (javobdan keyin). Test mazmuni o'zgargani uchun TEGILMADI. Qilaymi?

## BackendCrudPractice (m4-08) — TEGILMADI
- **B1 · s10 (12-ekran, nishonli debug):** xato qatordagi `price` so'zi kodda rangli ajratilgan — javobga ishora bo'lishi mumkin (159/17).
  Barcha kalitlar bir xil ranglanganmi (sintaksis) yoki faqat shu — ertalab surat bilan tekshirib ko'rsataman. Ajratish olinsinmi?
- **B2 · rol-pasporti (`.rp`) atrofidagi `1px dashed` chegara** (s1, s2, s5, s9, s13): «pasport» metaforasi uchun qolsinmi, yoki 159-qonun
  kesik-chiziq bezagi sifatida olinsinmi?
- **B3 · s9 (11-ekran):** «✓ Tasdiqlandi»dan keyin terminal «Spark joyida!» deydi, ustiga katta «💾 Ma'lumot saqlanib qoldi!» kartasi ham chiqadi.
  Karta qolsinmi (dars savoliga javob) yoki holat bir marta aytilsin (I3)?

## AuthEnv (m4-11) — TEGILMADI
- **A1 · s8 (10-ekran):** «GitHub'ga push qilish» tugmasi QIZIL (`btn danger`). Bu darsda .env sirini GitHub'ga chiqarish xavfi haqida gap
  boradi — qizil ataylab «xavfli» ma'nosida bo'lishi mumkin. Qizil qolsinmi (DELETE kabi xavfli amal) yoki asosiy tugma sifatida accent (V1)?

## PM 7–8-Modul (10 dars) — O'LCHANDI, TEGILMADI
- **PM1:** PmLesson26, 28–34 (7-Modull) + PmJtbd (m7-02) + PmMetrics (m8-01) — 26.09 PM global tozalashga (1–6-Modul, 25 dars) kirmagan.
  O'lchov: hammasida **dark 🔴**, 9 tasida **til 🔴** (error 2–14), **ruscha umuman yo'q** (`tr()` 0–1). 10 faylga tegadi → CLAUDE.md E-5 bo'yicha
  KATTA_TOZALASH ga yozildi, avtopilotda qilinmadi. Savol: 7–8-Modul hozir sinfda o'tiladimi? Ha bo'lsa — 25 dars kabi tozalash + RU to'lqini.

## JestUnitTest (m4b-01)
- **J1 · ⛶ (kattalashtirish) doim o'chiq:** s0 (1), s5 (6), s7 (8), s9 (10) — yorliq olingach tugma o'ng ustunning 1-qatorini yopardi, agent `<Zoomable off>` qo'ydi.
  Oldin ham shunday qilingan: ReactStateEffect · PostgresCrud s6 · Routing. Proyektorda shu ekranlarni kattalashtirish kerakmi? Kerak bo'lsa — tugma o'rniga kartaga o'ng-padding (NestArchAlive s2/s3 kabi).
- **J2 · s9 (10) va kartalar:** maydon placeholder'lari va eslatma-kartalarda 📁 📝 🎯 — describe/it/expect ni kartadagi belgi bilan bog'laydi. Qolsinmi (bog'lovchi) yoki olinsinmi (159/4)?

## NestArchResource (m4a-03)
- **N1 · s8 (9):** kod oynasi sarlavhasi va natija «4 qator — 5 metod tekin» deydi, kodda esa 7 qator (import, `{`/`}` bilan). «4 qator» g'oyasi darsda 4 joyda (eslatma-karta, flashkarta, 40↔4 solishtirish).
  Variantlar: (a) sarlavha «ichi 4 qator» deb aniqlashtiriladi (tavsiya — g'oya saqlanadi, kod tegilmaydi) · (b) kod 4 qatorga siqiladi · (c) qoladi. Tegilmadi, qaror kerak.
- **N2 · s15 (16):** so'rov yo'li bekatlarida emoji (📨 🛎️ 📋 👨‍🍳 📖 🗄️ 🎁 ✅) — 159/4 oqim-ikonkalari kabi. Olib, doirada raqam qo'yaylikmi yoki metafora-belgi sifatida qolsinmi?
- **N3 · ochilish taxtasi:** slot to'lganda chiqadigan emoji (📐 📋 👨‍🍳 🛎️ 📑 🪧) — qolsinmi yoki faqat ✓?

## NestArchPractice (m4a-04)
- **P-N1 · s0 (1) — NUQSON, qaror kerak:** uchala meros-karta ko'rilib, Swagger'da eshik ochilgach «Biznes boshqa — xodimlar bir xil…» kartasi tugmalar orqasida qoladi (136px).
  Tasma joyi F-0916-01 Q9 qarori bilan turibdi. Tavsiya: kartani bitta qisqa satrga aylantirib variantlar ostiga (hook-ack yoniga) olish. Tegilmadi.
- **P-N2 · s2 (3):** tafsilot-panel jadval kartasidagi ustun/bog'lanishni «← ustunlar / ← bog'lanish» bilan qayta ko'rsatadi. Paneldan olib faqat izoh qoldiraylikmi?

## FullstackConnect (m4-10) — eski holat, tegilmadi
- **FC1 · s1 (2):** oyna tagida «→ Spark paydo bo'ldi! Sayt endi bazadagi 4 mashinani ko'rsatadi», lekin oyna 230px — 1-qatordagi 2 mashina ko'rinadi, Spark 2-qatorda (oyna ichida aylantirilsa ko'rinadi). HEAD'da ham shunday.
  Tavsiya: yangi mashina (Spark) ro'yxatda BIRINCHI chiqsin (`newId` ni tepaga) — izoh bilan surat mos bo'ladi. Qaror kerak (mashina tartibi o'zgaradi).

## Umumiy — bajarilgan tugma ko'rinishi (GithubActions, NestArchAlive)
- **U1:** bosilgandan keyin «✓ Ko'rdingiz» kabi tugma: 1–3-Modul va GithubActions'da **xira accent** (`disabled`, opacity 0.4); NestArchAlive'da agent **yumshoq yashil** (`.btn.is-done`) qildi.
  Bitta naqsh kerak. Tavsiya: yumshoq yashil (V1 «yashil — faqat bajarilgan holat»; xira tugma «ishlamayapti» deb o'qiladi) — keyin hamma texnik darsga bir yo'la (8+ fayl → KATTA_TOZALASH).

## GithubActions (m4c-03)
- **G-A2 · s12 (13), s17 (18):** chiplardagi «📦 YIG'ISH / 🔍 SKANER» olam-belgilari — qolsinmi (metafora-lug'ati) yoki olinsinmi?
- **G-A3 · s13 (14):** ⛶ uchun lentalarga o'ng-padding berilgach ular pastdagi yashil qutidan 40px tor. Quti ham moslansinmi?

## PmLesson7 — ruscha qilindi, LEKIN dars sinfda ishlatilmaydi (halol xabar)
- **PM7:** tungi rejadagi «PmLesson7 ru 111 so'z» bajarildi (318 ru-maydon, uz bayt-aynan o'zgarmadi — ru-gate TENG, kalitlar AYNAN, 7/7, ru-walk 111→0).
  Lekin tekshiruvda chiqdi: PmLesson7 **App.jsx marshrutida yo'q** — m3 dagi o'rnida `pm/PmUserStoryLesson.jsx` (P0) ishlaydi; PmLesson7 faqat `solishtir/` (solishtirish sahifasi) da.
  Men buni rejaga qo'shishdan oldin tekshirmaganman. Zarar yo'q (qo'shimcha tarjima), lekin o'quvchiga yetmaydi. Savol: PmLesson7 arxivga o'tsinmi yoki shunday qolsinmi?

## AiPipelineProject (m4c-05)
- **AI1 · s9 (10), tekshirish bosqichi:** «Jurnalda nima deyilgan edi?» kartasi variantlardan OLDIN «— manfiy son haqida hech narsa yo'q» deb javobni aytadi (159/17). Bu bosqich `mentorVerified` nishon sharti — olinsa nishon qiyinlashadi. Olaylikmi? (tavsiya: olish — 159/17; nishon-bonus xotirasi «juda qismaslik» ga ko'ra ikkilanib qoldirildi).
- **AI2 · s7 (8):** tepadagi lenta va ostidagi 5 bosiladigan karta bir xil 5 nuqtani ikki marta ko'rsatadi. Lenta olinsinmi (kartalar ✓ bilan holatni ko'rsatadi)?
- **AI3 · s6 (7), s11 (12):** ro'yxat qatorlaridagi 💬/✍️ va ⚡/🔎/🧑‍💻 — olinsinmi (159/4)?
- **AI4 · s1, s7, s9:** lenta bekatining «o'tdi» holatidagi yashil halqa (`.pipe-step.pass`) → yumshoq fon (G3) qilinsinmi?

## Umumiy — 4c lenta/bekat emojilari (FullPipeline, AiPipeline, GithubActions, NestArchResource)
- **U2:** 📦🔍📐🎁✈️ (lenta nuqtalari, chiplar, bo'laklar) — 4 darsda bir xil «olam-belgilari». Bitta qaror: qolsin (metafora-lug'ati: YIG'ISH/SKANER/…) yoki hammasidan olinsin (159/4)? Tavsiya: **qolsin** — ular lenta metaforasining so'zlarini (📦 YIG'ISH) belgilaydi, bezak emas.

## FullProPipeline (m4c-07)
- **FP1 · practice (17):** «TOPSHIRIQ» matni o'ngdagi 5 bosqichni (matrix, cache, secrets, push, Actions) deyarli so'zma-so'z takrorlaydi. Bitta gapga qisqartiraylikmi («Repo'dagi ci.yml faylini ishonchli qiling — bosqichlar ro'yxat bo'yicha»)?
- (emoji-ikonkalar — U2 umumiy savoliga kiradi)

## CiCdIntro (m4c-01, ETALON) — faqat qoidaga aniq tushgani qilindi
- **CC0 · s15 (16) va FullProPipeline s15 — MEN QILDIM, tekshiring:** baholanadigan tartib-testida mentor «Diqqat: agar ✈️ Uchirishni 🔍 Skanerdan oldin qo'ysangiz — oqibatini ko'rasiz» deb ikki bekat tartibini aytardi → S6/159/17 bo'yicha olindi, mentor faqat «Nuqtalarni sudrab to'g'ri tartibga joylang.»
  Xato tartibdagi «oqibat» mexanikasi joyida (faqat ogohlantirish gapi ketdi). Agar bu ataylab «xato qilib ko'r» pedagogikasi bo'lsa — ikkala darsda qaytaraman (bir qator).
- **CC1 · s9 (10) — bag:** kichik lentada 🧳 belgisi lenta ustida emas, butun kenglik foizida siljiydi (≈884px ekranda osilib qoladi). Tuzatilsinmi? (namuna-ro'yxatda yo'q, etalon bo'lgani uchun tegilmadi).
- **CC2 · s9 (10):** yo'riq olingach lenta jurnali birinchi yurishgacha bo'sh qora quti. Jurnal va yorliq birinchi yurishgacha yashirilsinmi (159/3 kabi)?
- **CC3 · s9 (10):** chamadonga solingan buyum accent halqa + ✓. G3 (yashil fon) javobni aytadi (ba'zi buyum buzuq) — shunday qoladi deb hisoblayman. Rozimisiz?
- **CC4 · s6 (7), s11 (12):** faol kartadagi accent halqa va tafsilot sarlavhasi («⚙️ Deployment») bir ma'no — sarlavha olinsinmi?
- **CC5 · s7 (8):** lenta + 5 bosiladigan karta (AiPipeline AI2 bilan bir xil savol).
- **CC6:** karta/tugma emojilari (s3 «🐌 Qo'lda / ⚙️ Lenta», s12 «❌/✅ Lenta», s9 «📟 🧳 🔧») — U2 umumiy savoliga kiradi; `.pipe-step.pass` halqa — AI4 bilan umumiy.

## PM 7–8-Modul — tunda qilingani (PM1 ga qo'shimcha)
- ✅ Qora tugma → accent (`codemod-dark-btn`, 26.09 qarori «qora tugma bo'lmaydi»): 10 faylda 18 qoida. Kalitlar AYNAN. PmJtbd, PmLesson31 → 7/7.
  Qolgan dark (didga oid): PmLesson26 `.grave` (kod-rangli «qabr» kartasi — metafora), PmLesson32 :871 inline to'q quti, PmMetrics `.match-slot-chip.bad` (qizil = xato ma'nosi). Qolsinmi?
- ✅ Til 🔴 → 0 (agentlar, faqat o'zbekcha matn, KORPUS bo'yicha). **PM-T1:** PmLesson32 «sehrli raqam» → «kalit raqam» (magic number) — 1 ekran + lug'at. Boshqa nom maqulmi («hal qiluvchi raqam»)?
- **PM-T2:** PmLesson31 (440, 950), PmLesson32 (1048) — «keyingi darsda…» va'da qatorlari (73-qonun). Olinsinmi?
- **PM-T3:** «Aziz» — o'ylab topilgan qahramon (personaj taqiq, DARS_ETALON 5.8) butun 7-Modul IPI: 12 faylda (PmLesson26–34 + MvpArch/Build1/Build2/Iterate), PmLesson30 da 15 marta. Eski holat, tegilmadi — modul-darajasidagi qaror kerak.
- Eslatma: 7-Modull papkasi dasturda «MODUL 10 · AKSELERATOR» — kursning ancha keyingi qismi. Ruscha tarjima (10 dars) — alohida katta ish, qilinmadi.
- **PM-T4:** PmLesson30 da ham «Aziz» (15 marta, butun ip) — personaj taqiq; almashtirish darsning ipiga tegadi → tegilmadi. «Mentor» yoki «bir o'quvchi» bilan almashtiraylikmi (PmLesson32 bilan birga)?
- **PM-T5:** til-lint `sheva-yuklama-da-a-ya` qoidasida «…» iqtibos istisnosi (KORPUS §159) yo'q — `-ku` qoidasida bor. Qo'shaylikmi? (tunda iqtiboslar ham o'zgartirildi: PmLesson29 162/188, PmLesson30 822 «…yetdi, to'g'rimi?»)
- **PM-T6:** «custdev» sarlavhada izohsiz (PmLesson29 501, 655) — «(mijozni o'rganish)» qo'shilsinmi?
