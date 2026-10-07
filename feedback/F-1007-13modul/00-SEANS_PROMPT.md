# 13-Modul seansi uchun prompt (foydalanuvchi nusxalab beradi) — 07.10.2026

> Tayyorladi: 11-Modul seansi (F-1007-291 davomida), 12-Modul prompti (`feedback/F-1006-12modul/00-SEANS_PROMPT.md`) naqshida + 11-Modul RU va yopish saboqlari.
> Shart (06.10 qarori): 13-Modul 12-Modul tayanchi tayyor bo'lgach ochiladi — bajarildi (12-Modul: 12 MD, GATE M ✅, ChatGPT auditi 12/12, pilot ko'rigi 07.10 da tugadi).

```
Yangi modul: LMS 13-Modul «O'sish va monetizatsiya» (kodda src/11-Modull, kalitlar m11-NN, App.jsx da yangi `id: '11'` bloki).
Parallel seanslar: ASOSIY — mexanizm (konveyer, qolip, skelet, darvozalar, qonunlar) · 9 va 10-Modul — src/7-Modull, src/8-Modull (QA bosqichi) ·
11-Modul — src/9-Modull (yopilmoqda: RU va yakuniy MD tayyor, deploy/commit buyruq kutmoqda) · 12-Modul — src/10-Modull («qur»: pilotlar ko'rildi, 2-to'lqin).
13-Modul 12-Modulning bevosita davomi: Mentor misoli «Maydon Jamoa» 12-Modulda jonlandi va 50 foydalanuvchiga chiqdi — endi pul va o'sish.
Bu modulda ham tezlik emas, sifat: avval manba va qaror, keyin tayanch, keyin pilot MD → audit → qolganlari.

## 1. Boshlashdan oldin o'qing (bir marta, shu tartibda)
1) konveyer/0-YANGI-MODUL.md — raqamlash (kod = LMS − 2), seans chegarasi, bosqichlar, QA sayti. U 9-Modul uchun yozilgan:
   7 → 11, m7 → m11, F-1005-9modul → F-1007-13modul, coddycamp-9modul → coddycamp-13modul deb o'qing.
2) konveyer/README.md (zanjir 0–9) · konveyer/1-MD.md (MD v3 formati, GATE M ro'yxati, «Filtr») · konveyer/QURISH_KARTASI.md · src/qolip/QOLIP.md.
3) MATN_KORPUS.md 1–720-qatorlar (taqlid-manba) · QOIDALAR.md (reestr: T-, P-, S-, PM- ID lar).
4) 12-Modul — sizning poydevoringiz (faqat o'qish, hammasi tasdiqlangan): feedback/F-1006-12modul/
   - 00-MODUL-TAYANCH.md — ayniqsa 1 (misol-ip; 1.0 boshlanish nuqtasi; 1.9 eslatma = retention mexanikasi; 1.13 Mentor misolining sonlari — 20 → 38 → 44, 50 ga yetmaydi),
     2 (atamalar), 3 (repo `maydon-jamoa`, teglar), 6 (tekshirilgan faktlar), 7 (oldindan tuzatiladigan sinflar), 8 (saqlash kalitlari `pm-m10dN-…`), 9 (to'lqin kelishuvlari);
   - GATE_M_JAVOB.md (Qaror-0: tarqatish — Android APK (EAS) + iPhone brauzer ko'rinishi; eslatma — mahalliy, Backend push yo'q) · 00-NOMLAR.md · 00-TAQIQLAR.md ·
     MD_AGENT_TOPSHIRIQ.md · MD_TOPSHIRIQ_2.md · QURUVCHI_SABOQ.md (E — 12-Modul pilot ko'rigidan) · JURNAL.md «MEXANIZM-TAKLIF»;
   - 09-RetentionDay-v3.md (12-Modulda bitta retention mexanikasi quriladi) · 10-PmUsersCheck-v3.md · 11-PmPitchReview-v3.md · 12-PmGrowthPitch-v3.md —
     13-Modulning retention, refleksiya va pitch qismlari shulardan davom etadi (takrorlamasdan);
   - 01…12-FILTR.md — ChatGPT auditi Filtri. 13-Modul MD lari qayerda qoqilishining eng aniq ro'yxati; 3-bosqichdan oldin to'liq o'qing.
5) 11-Modul (oldingi modul) — faqat o'qish: feedback/F-1005-11modul/
   - 00-MODUL-TAYANCH.md 1.5 — roadmap'dagi «Uzoqroq — maydon pulini bo'lishish» (13-Modulda pul mavzusi bilan tabiiy bog'lanishi mumkin — qaror sahifasida savol);
   - QURUVCHI_TOPSHIRIQ_3.md — RU bosqichi: modul ruscha lug'ati qanday o'lchab tuziladi va «To'lqin 1 saboqlari» jadvali (Подсказка · формулировка проблемы · довод · деплой …);
   - JURNAL.md F-1007-291 yozuvlari va «MEXANIZM-TAKLIF» 10–16 — skeletdagi tuzoqlar (pastda, 6-band);
   - SINOV_ROYXAT.md — o'z sinovi nimalarni topdi (1280×800 sig'ish, ⛶, 393 px, Mentor rejimi).
6) Oldingi saboqlar (faqat o'qish; qayta kashf qilmang): 9-Modul feedback/F-1005-9modul/QURUVCHI_SABOQ.md (1–18) · 10-Modul feedback/F-1005-10modul/QURUVCHI_SABOQ.md (A, B, C) ·
   10-Modul m8-02 «Hodisalar tizimi», m8-03 «jonli dashboard», m8-06 «maxfiylik siyosati» MD lari — 13-Modulning referal treking, oferta va siyosat darslari shularga tayanadi.
7) Xotira (memory/): qatiy-keyingi-harakat-kartochka · pm-vizual-brend-maket · agentlar-faqat-ruxsat-bilan · uzoq-tekshiruvni-kuzat · tashqi-audit-filtr ·
   qaror-vizual-artifact · sinonim-taqiq-bir-mano-bir-soz · konveyer-yagona-yol · platforma-standartini-avval-olcha · parallel-seans-2026-10-05.
8) Dastur: «CoddyCamp_Senior_2026_v9_14modul .html» → «13-modul · O'SISH VA MONETIZATSIYA» — 13 dars (PM 5 · AI-PRAKT 4 · PM+PRAKT 2 · TEX 1 · zaxira 1), 14.5–15.5-oy.
   Texnik cho'qqi: webhook + referal dvijok. Alohida Demo Day yo'q — 14-Modul bitiruv himoyasi (Demo Day 8) bu modul natijalariga tayanadi.

## 2. Chegara (oltita seans parallel)
- O'zgartirasiz FAQAT: src/11-Modull/* · App.jsx dagi o'z bloklaringiz (`// ---- 11-Modul` import bloki va `id: '11'` modul bloki; ular `id: '10'` blokidan keyin yangidan qo'shiladi) ·
  feedback/F-1007-13modul/* · QA sayti fayllari (modul11.html, src/m11-demo/*, vite.m11.config.js, dist-m11/).
- App.jsx ni besh seans tahrirlaydi. Har tahrirdan oldin qayta o'qing, faqat aniq Edit qiling (butun faylni Write qilmang), boshqa bloklarga tegmang va ularni «tozalamang».
- Tegmaysiz: konveyer/* · src/qolip · src/skelet · src/live · scripts · lint-* · layout-lint · tools · package.json ·
  qonun fayllari (QOIDALAR, DARS_ETALON, PM_DARS_ETALON, MATN_KORPUS, MATN_ETALONI, PM_Prompt_v8, RU_I18N_SPEC, til-lint-rules.json) · CLAUDE.md · KATTA_TOZALASH.md ·
  boshqa modullar (src/7-, 8-, 9-, 10-Modull, ularning feedback papkalari — faqat o'qish). `maydon-jamoa` repo'siga faqat «qur» bosqichida, buyruq bilan.
- Mexanizm, qolip yoki qonunga o'zgarish kerak bo'lsa — jurnalingizdagi «MEXANIZM-TAKLIF» bo'limiga yozasiz (nima · nega · qaysi fayl), o'zingiz tegmaysiz.
- F-ID: F-MMDD-NN, NN 450 dan (asosiy 01–49 · 9-Modul 50–149 · 10-Modul 150–249 · 11-Modul 250–349 · 12-Modul 350–449).
- Dev server porti: 5175 (5173 — AILM, 5174 — 12-Modul, 5300 — 11-Modul band).
- Birinchi ishingiz: feedback/F-1007-13modul/JURNAL.md va xotirada seans fayli (memory/seans-13modul-2026-10-07.md + MEMORY.md da bitta qator):
  chegara, holat, keyingi qadam. Har bosqich tugaganda ikkalasini yangilang — noutbuk birdan o'chsa, keyingi seans faqat shu yozuvlardan davom etadi.
- Tayanch va MD da modullar LMS raqami bilan aytiladi («12-Modul 9-darsi»); kod raqami (m10-09, src/10-Modull) faqat fayl yo'lida.

## 3. Ish tartibi (konveyer — yagona yo'l)
1) Manba (agentsiz, o'zingiz): dastur jadvali → 00-MANBA.md. O'tilgan atamalarni grep bilan tekshiring (9–12-Modul MD va tayanchlari, YAKUNIY papkalari, src/):
   CAC, LTV, unit-ekonomika, monetizatsiya, freemium, obuna, paywall, narx, webhook, idempotentlik, to'lov, Click, Payme, Stripe, oferta, maxfiylik siyosati,
   retention, referal, konversiya, voronka, sandbox — avval o'tilganmi va qaysi so'z bilan (uz va ru).
2) BITTA qaror sahifasi (artifact, javob qatori bilan; har savolda variantlar + tavsiya). Kamida shular:
   - misol-ip: «Maydon Jamoa» qanday pul topadi (nima uchun to'lanadi; 11-Modul roadmap'idagi «maydon pulini bo'lishish» bilan bog'lanadimi) — tasdiq va har darsga bitta qatorli reja;
   - repo: `maydon-jamoa` davomi (boshlanishi — 12-Modulning oxirgi `-done` tegi), teglar `m13-dars-NN-start` / `-done`; o'quvchi o'z final repo'sida;
   - 🔴 to'lov va o'smir: real pul qabul qilish uchun yuridik shaxs/shartnoma kerak — darsda faqat test (sandbox) rejim; «to'lashga tayyorlik» (9-dars) real to'lov emas,
     tasdiq yozuvi. Click, Payme test muhiti, kalitlari, webhook formati, Stripe test mode va uning O'zbekistonda ishlashi — rasmiy hujjatdan, sana bilan (taxmin yo'q);
   - webhook (3-dars, cho'qqi): NestJS endpoint, imzo tekshirish, idempotentlik, failed payment; Render bepul xizmati uxlaganda webhook nima bo'ladi — rasmiy hujjatdan;
   - paywall (4-dars): mobil trekda to'lov web sahifa orqali (12-Modul qarori: APK + iPhone brauzer — do'kon qoidalari bevosita tegmaydi; buni MD da aniq yozing);
   - oferta va siyosat (7-dars): o'smir yozadigan hujjat — shablon, «yuridik maslahat emas» degan halol eslatma; 10-Modul 6-darsidagi maxfiylik siyosati davomi;
   - real suhbatlar (6-dars: narx bo'yicha 3 suhbat · 9-dars: 3 tasdiq) — halol yo'llar, kim bilan (sinfdosh, ota-ona, maydon egasi), majburlash va soxta tasdiq yo'q;
   - retention (8-dars) — 12-Modul 9-darsi bilan chegara: u yerda bitta eslatma qurilgan; bu yerda qaysi yangi mexanika (takror emas);
   - referal (10-dars, cho'qqi davomi): unikal havola, taklif treki (10-Modulning o'z hodisalar tizimi), mukofot, suiiste'molga qarshi oddiy qoida;
   - CAC/LTV (1-dars) va narx (4-dars) — Mentor misolining sonlari 12-Modul tayanchi 1.13 dan (boshqa son to'qilmaydi);
   - 11-dars refleksiya — 12-Modul 11-darsi (yakkama-yakka) va 11-Modul 15-darsidan farqi; 12-dars «Loyiha kuni: barqarorlashtirish» — nima tekshiriladi;
   - 13-dars zaxira — `comp` siz qator;
   - keyslar — faqat K1–K19; 12-Modulda ishlatilganlar (K3, K8, K6, K5, K1) va K2 Telegram Premium (monetizatsiyaga mos, 12-Modul MANBA eslatgan);
   - dars nomlari → 00-NOMLAR.md (PM — savol-sarlavha, TEX — mavzu nomi, loyiha kuni — «Loyiha kuni: …», ≤55 belgi, menyu nomi = dars nomi).
3) 00-MODUL-TAYANCH.md (faktlar, atamalar, repo teglari, saqlash kalitlari `pm-m11dN-…`, tekshirilgan tashqi faktlar — manba havolasi va sana bilan) + 00-TAQIQLAR.md
   (12-Modulnikidan, 13-Modulga moslab). MD agentlari faqat shulardan yozadi.
   Tayanchda «Oldindan tuzatiladigan sinflar» — 12-Modul FILTR fayllarida bir necha darsda takror Qabul qilinganlar (o'zingiz sanab, sinfga ajratasiz) + 12-Modul tayanchi 7-bo'limi.
   Tayanchda yangi bo'lim — **«Ruscha lug'at»** (11-Modul saboqi): har atamaning ruschasi oldingi modullardan grep bilan o'lchanadi (masalan «деплой» — 9/10-Modulda 21 joy, lotincha 0;
   Database, Backend — lotincha; «Yordam» — «Подсказка»). Lug'at taxmin bilan yozilmaydi — 11-Modulda bitta qator noto'g'ri yozilib, 3 darsga tarqalgan.
4) MD v3 — har dars bitta agent (ruxsat bilan), ikki to'lqin. Topshiriq 12-Modul MD_AGENT_TOPSHIRIQ.md / MD_TOPSHIRIQ_2.md naqshida.
   1-to'lqin — 2–3 pilot MD (bitta PM, bitta TEX yoki loyiha kuni — 3 yoki 5-dars, bitta real suhbat darsi — 6 yoki 9). Keyin TO'XTAYSIZ:
   men pilotlarni o'qiyman va ChatGPT auditiga beraman → siz Filtr qilasiz → takror sinflar tayanchga → 2-to'lqin faqat mening «davom» so'zim bilan.
   Har agent yordamchi fayllarini scratchpad'dagi o'z papkasida (md<NN>/) saqlaydi. Natija: feedback/F-1007-13modul/NN-<Nom>-v3.md, har birida `npm run lint:til` 0 error.
   Keyin o'zaro tekshiruv: o'lchov, arena ✔ 3/3/3/3, atama tartibi, «Keyingi dars» nomlari, saqlash kalitlari.
   Ekranlar soni: PM+PRAKT — 12 (PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun);
   loyiha kuni (AI-PRAKT) — 8 ekran + 3 blok + kartochkalar = 12; uyga vazifa yakun kartasida, alohida .homework.jsx yo'q.
5) GATE M — bitta sahifa (`python3 konveyer/vositalar/gatem/sahifa.py …` → Artifact). Men tasdiqlayman, keyin har MD ni ChatGPT auditiga beraman.
   Har bandni Filtr bilan ko'rasiz (Qabul / Qisman / Rad + sabab, NN-FILTR.md) → MD tuzatiladi; javoblar → GATE_M_JAVOB.md.
6) «Qur» — faqat mening buyrug'im bilan, asosiy seans skelet va qolip tuzatishlarini qo'llagandan keyin. Avval 2 pilot, men ko'raman, saboqlar QURUVCHI_SABOQ.md ga, keyin 2-to'lqin.
   Har dars: `cp src/skelet/NamunaDars.jsx src/11-Modull/<Nom>Lesson.jsx` → 2-QURUVCHI → 3-SADOQAT → 4-VIZUAL (1280×773 · 1366×768 · 390×844, ko'z bilan) → 5-TUZATUVCHI → 6-RU → 7-YAKUNIY.
   «Qur» oldidan 9–12-Modul QURUVCHI_SABOQ.md va MEXANIZM-TAKLIF bo'limlarini qayta o'qing. Skeletdagi tuzoq hali tuzatilmagan bo'lsa — o'z faylingizda chetlab o'tasiz.
   11-Modulda «qur» dan keyin topilgan va har darsda qaytgan sinflar (quruvchi topshirig'iga BIRINCHI KUNDANOQ yozing):
   · ⛶ — `.zoom-on` CSS qoidasi + `.q-fokus:has(.zoom-on)` va voqea konteyneri `:has(.zoom-on) { animation: none; transform: none; }` (aks holda oyna joyida ochiladi);
   · o'quvchi javobini tekshiruvchi regex — ikki tilli (faqat o'zbekcha so'z bo'lsa ru rejimida xabar har doim chiqadi);
   · `tr()` modul darajasida chaqirilmaydi (til import paytida qotadi) — render ichida yoki funksiya;
   · maket va chat satrlari `{ t: '…' }` bir tilli emas — `{ uz, ru }`; fon so'zlari (R-008) ham;
   · ruscha ko'plik shakli (1 остановка · 2 остановки · 5 остановок) — sonli satrlarda;
   · ekrandagi nom = matndagi nom: Mentor gapi tugmani ru maketda qanday ko'rinsa, shunday ataydi; talab (agentga matn) — repo'dagi o'zbekcha qiymat, qavsda ruschasi;
   · o'quvchi gapidagi «N-ekran» — hisoblagich 1 dan sanaydi (MD 0 dan).
7) Yopish: `npm run modul:yopish -- src/11-Modull --yakuniy feedback/F-1007-13modul/YAKUNIY` (fon vazifa + Monitor, muddati tugasa qayta yoqing) →
   QA sayti (buyrug'im bilan, 0-YANGI-MODUL.md 4-bo'lim) → commit (buyrug'im bilan).

## 4. Qoidalar
- Agentlar faqat ruxsatim bilan. Oldin bitta qisqa xabar: nechta agent, har biri nima qiladi, qaysi fayllarga tegadi, taxminan qancha vaqt. GATE M tasdig'i agent yuborishga ruxsat emas.
  Agent ishlayotgan faylga siz tegmaysiz (bir fayl — bir muharrir) — tuzatishni agent tugagach qilasiz.
- Commit, push, deploy — faqat buyrug'im bilan. Commitga faqat o'z fayllaringiz (`git add <aniq yo'l>`); App.jsx dan faqat o'z blokingiz (9-Modul commiti 1fffa7c dagidek).
- Shoshilmang: har bosqich (manba · qaror sahifasi · tayanch · pilot MD · 2-to'lqin · GATE M · Filtr) oxirida to'xtaysiz — qisqa hisobot, nimani o'zingiz tekshirdingiz, ochiq savollar.
  Keyingi bosqich — mening so'zim bilan. Tekshirmagan narsangizni «tayyor» demaysiz.
- Filtr: audit bandi QOIDALAR yoki tasdiqlangan qarorga zid bo'lsa — avval grep, keyin hukm (masalan hookdagi «Qiziq fikr!» — T-028 / T-067 kurs qonuni, rad etiladi).
- Tashxis avval, yechim keyin. Savollar bitta sahifada, javob qatori bilan. Hisobot qisqa, o'zbekcha; darsni LMS raqami bilan ayting («13-Modul 3-darsi»).
- Halollik: keyslar faqat PM_Prompt_v8 bankidan (K1–K19, PM-016); bankdan tashqari keys yoki manbasiz raqam kerak bo'lsa — qaror sahifasida savol.
  Tashqi xizmatlar (Click, Payme, Stripe, Render, Netlify, Neon, Expo, EAS, Telegram) imkoniyati, narxi, komissiyasi, tugma va menyu nomlari taxmin qilinmaydi — rasmiy hujjatdan, sana bilan (P-028).
  Pul darslarida: o'smir real to'lov qabul qilmaydi (faqat test rejim), karta ma'lumoti hech qayerga yozilmaydi va ko'rsatilmaydi, maxfiy kalit faqat `.env` da; real suhbatlarda bosim va soxta tasdiq yo'q.
- Har dars: `npm run gates -- <fayl>` 12/12 · `npm run lint:jsx` 0 · matn tegilsa `npm run lint:til` 0 error. 12/12 — sifat emas: har ekran surati ko'z bilan ko'riladi.
- Har topilma sinf-supurish bilan yopiladi: qurilgan hamma darslarda grep qilinadi, natija jurnalga (topilmasa ham). Jurnal vaqti `date` bilan.
- Uzoq tekshiruvni (layout, modul:yopish) timeout bilan alohida fon vazifada yurgizasiz. Monitor faqat natijani kuzatadi; 30 daqiqada o'chsa, darhol qayta yoqiladi.
- 🔴 Qat'iy qonunlar (foydalanuvchi, 05.10):
  · har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi;
  · kartochkalar alohida ekranda (podium → kartochkalar → yakun): Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi»;
  · brend yoki mahsulot nomi o'z rangida, tanish maketda, jonli sahnada chiqadi (matnli karta rad) — Click, Payme, Telegram Premium ham;
  · agent MD matnini o'zboshimcha o'zgartirmaydi — kerak bo'lsa «MD ga taklif» deb yozadi;
  · o'ylab topilgan qahramon yo'q, vazifani Mentor beradi.

O'qib bo'lgach, menga 5 qatorda nimani tushunganingizni yozing va 0-bosqichni boshlang: manba → qaror sahifasi.
```
