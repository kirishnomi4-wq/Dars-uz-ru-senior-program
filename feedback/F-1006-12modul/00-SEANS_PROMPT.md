# 12-Modul seansi uchun prompt (foydalanuvchi nusxalab beradi) — 06.10.2026

```
Yangi modul: LMS 12-Modul «Real vaqt: WebSocket + ishga tushirish — flagman» (kodda src/10-Modull, kalitlar m10-NN, App.jsx da yangi `id: '10'` bloki).
Parallel seanslar: ASOSIY — mexanizm (konveyer, qolip, skelet, darvozalar, qonunlar) · 9-Modul — src/7-Modull (QA bosqichi) ·
10-Modul — src/8-Modull (yopilgan, QA da) · 11-Modul — src/9-Modull (16 MD GATE M va ChatGPT auditidan o'tgan; «qur» mexanizm tuzatishlarini kutmoqda).
Bu modulda tezlik emas, sifat: 11-Modulda 16 MD bir kechada yozilib, keyin ChatGPT auditida 224 band qabul qilindi (har darsda 10–22) — ko'pi bir xil sinflar edi.
Shuning uchun bu safar avval pilotlar audit qilinadi, saboq tayanchga yoziladi, keyin qolgan darslar.
12-Modul 11-Modulning bevosita davomi: Mentor misoli «Maydon Jamoa» 11-Modulda «keyinroq (12-Modul)» deb qoldirilgan ishlarni — real vaqt va eslatmani (push) — shu modulda quradi.

## 1. Boshlashdan oldin o'qing (bir marta, shu tartibda)
1) konveyer/0-YANGI-MODUL.md — raqamlash (kod = LMS − 2), seans chegarasi, bosqichlar, QA sayti. U 9-Modul uchun yozilgan:
   7 → 10, m7 → m10, F-1005-9modul → F-1006-12modul, coddycamp-9modul → coddycamp-12modul deb o'qing.
2) konveyer/README.md (zanjir 0–9) · konveyer/1-MD.md (MD v3 formati, GATE M ro'yxati, «Filtr») · konveyer/QURISH_KARTASI.md · src/qolip/QOLIP.md.
3) MATN_KORPUS.md 1–720-qatorlar (taqlid-manba) · QOIDALAR.md (reestr: T-, P-, S-, PM- ID lar).
4) 11-Modul — sizning poydevoringiz (faqat o'qish, hammasi tasdiqlangan):
   - feedback/F-1005-11modul/00-MODUL-TAYANCH.md — ayniqsa 1 (misol-ip; 1.5 roadmap'dagi «keyinroq (12-Modul)» qatorlari; 1.9 risklar: Render uyqusi, 50 foydalanuvchi, APK),
     2 (atamalar), 3 (repo `maydon-jamoa`, teglar, papkalar), 6 (tekshirilgan faktlar), 8 (saqlash kalitlari `pm-m9dN-…`), 9 (to'lqin kelishuvlari);
   - GATE_M_JAVOB.md (Qaror-0 1–18 va GATE M javoblari) · 00-NOMLAR.md · 00-TAQIQLAR.md · MD_AGENT_TOPSHIRIQ.md · MD_TOPSHIRIQ_2.md · JURNAL.md «MEXANIZM-TAKLIF»;
   - 15-PmOneOnOne-v3.md va 16-PmPrototypePitch-v3.md — 12-Modulning 11 va 12-darslari shu formatlardan davom etadi (takrorlamasdan);
   - 01…16-FILTR.md — ChatGPT auditi Filtri (Qabul / Qisman / Rad + sabab). Bu — 12-Modul MD lari qayerda qoqilishining eng aniq ro'yxati; 3-bosqichdan oldin to'liq o'qing.
5) Oldingi saboqlar (faqat o'qish; qayta kashf qilmang):
   - feedback/F-1005-9modul/QURUVCHI_SABOQ.md (1–18; 🔴 — qat'iy qonunlar) · QURUVCHI_TOPSHIRIQ_2.md «skelet tuzoqlari» · JURNAL.md «MEXANIZM-TAKLIF»;
   - feedback/F-1005-10modul/QURUVCHI_SABOQ.md (A 1–18, B, C 19–30 — foydalanuvchi «general» degan) · 00-TAQIQLAR.md · JURNAL.md «MEXANIZM-TAKLIF»;
   - 10-Modul m8-02 «Hodisalar tizimi» va m8-03 «jonli dashboard» MD lari — 12-Modulning 8 va 10-darslari (voronka, metrika) shu o'z analitika tizimiga tayanadi.
6) Xotira (memory/): qatiy-keyingi-harakat-kartochka · pm-vizual-brend-maket · agentlar-faqat-ruxsat-bilan · uzoq-tekshiruvni-kuzat · tashqi-audit-filtr ·
   qaror-vizual-artifact · sinonim-taqiq-bir-mano-bir-soz · konveyer-yagona-yol · platforma-standartini-avval-olcha · parallel-seans-2026-10-05.
7) Dastur: «CoddyCamp_Senior_2026_v9_14modul .html» → «12-modul · REAL-TIME …» bo'limi — 13 dars (TEX 2 · AI-PRAKT 2 · PM+PRAKT 3 · PM 5 · zaxira 1), 13.5–14.5-oy.
   Alohida Demo Day yo'q: 50+ foydalanuvchi va real vaqt natijalari 14-Modul bitiruv himoyasining dalili bo'ladi.

## 2. Chegara (besh seans parallel)
- O'zgartirasiz FAQAT: src/10-Modull/* · App.jsx dagi o'z bloklaringiz (`// ---- 10-Modul` import bloki va `id: '10'` modul bloki; ular `id: '9'` blokidan keyin yangidan qo'shiladi) ·
  feedback/F-1006-12modul/* · QA sayti fayllari (modul10.html, src/m10-demo/*, vite.m10.config.js, dist-m10/).
- App.jsx ni to'rt seans tahrirlaydi. Har tahrirdan oldin qayta o'qing, faqat aniq Edit qiling (butun faylni Write qilmang), boshqa bloklarga tegmang va ularni «tozalamang».
- Tegmaysiz: konveyer/* · src/qolip · src/skelet · src/live · scripts · lint-* · layout-lint · tools · package.json ·
  qonun fayllari (QOIDALAR, DARS_ETALON, PM_DARS_ETALON, MATN_KORPUS, MATN_ETALONI, PM_Prompt_v8, RU_I18N_SPEC, til-lint-rules.json) · CLAUDE.md · KATTA_TOZALASH.md ·
  boshqa modullar (src/7-, 8-, 9-Modull, ularning feedback papkalari, ~/Desktop/maydon — faqat o'qish). `maydon-jamoa` repo'siga faqat «qur» bosqichida, buyruq bilan.
- Mexanizm, qolip yoki qonunga o'zgarish kerak bo'lsa — jurnalingizdagi «MEXANIZM-TAKLIF» bo'limiga yozasiz (nima · nega · qaysi fayl), o'zingiz tegmaysiz.
- F-ID: F-MMDD-NN, NN 350 dan (asosiy 01–49 · 9-Modul 50–149 · 10-Modul 150–249 · 11-Modul 250–349).
- Birinchi ishingiz: feedback/F-1006-12modul/JURNAL.md va xotirada seans fayli (memory/seans-12modul-2026-10-06.md + MEMORY.md da bitta qator):
  chegara, holat, keyingi qadam. Har bosqich tugaganda ikkalasini yangilang — noutbuk birdan o'chsa, keyingi seans faqat shu yozuvlardan davom etadi.
- Tayanch va MD da modullar LMS raqami bilan aytiladi («11-Modul 15-darsi»); kod raqami (m9-15, src/9-Modull) faqat fayl yo'lida — 11-Modulda agentlar kod raqamini o'quvchi matniga ko'chirgan edi.

## 3. Ish tartibi (konveyer — yagona yo'l)
1) Manba (agentsiz, o'zingiz): dastur jadvali → 00-MANBA.md. O'tilgan atamalarni grep bilan tekshiring (9, 10, 11-Modul MD va tayanchlari, 5–6-Modul YAKUNIY, src/):
   WebSocket, real vaqt, push, eslatma, voronka, retention, CTA, lending, presence, reconnect, APK — avval o'tilganmi va qaysi so'z bilan.
2) BITTA qaror sahifasi (artifact, javob qatori bilan; har savolda variantlar + tavsiya). Kamida shular:
   - misol-ip: «Maydon Jamoa» davomi (11-Modul tayanchi 1.5 va 1.9 — real vaqt, push, 50 foydalanuvchi) — tasdiq va har darsga bitta qatorli reja;
   - repo: `maydon-jamoa` davomi (boshlanishi — 11-Modulning oxirgi `-done` tegi), teglar `m12-dars-NN-start` / `-done`; o'quvchi o'z final repo'sida;
   - real vaqt steki: NestJS gateway + socket.io yoki oddiy WebSocket; Render bepul xizmatida WebSocket va uyqu — rasmiy hujjatdan; web va mobil trek mijozlari;
   - push: Expo Notifications — Expo Go dagi cheklovlar (Android, yangi SDK lar), development build / APK zarurmi, iPhone yo'li — rasmiy hujjatdan tekshirib;
     web-trekda eslatma qanday (sahifa ichida yoki web push) — alohida savol;
   - 50 real foydalanuvchi (6, 7, 10-darslar): kanallar (Instagram, Telegram, maktab chatlari) — o'smir uchun xavfsiz va halol yo'l; maxfiylik (10-Modul 6-dars siyosati);
     50 ga yetmasa — 10-darsdagi antikrizis reja halol aytiladi;
   - analitika (8, 10): 10-Modulning o'z hodisalar tizimi va dashboard'i davom etadimi (tavsiya — ha, Umami ikkinchi manba);
   - 1-dars lending: mobil ilova uchun web sahifa (Netlify), CTA qayerga olib boradi (Expo Go / APK havolasi);
   - 11-dars yakkama-yakka va 12-dars pitch — 11-Modul 15 va 16-darslaridan farqi (yangi narsa: metrika va o'sish grafigi); pitch vaqti;
   - 13-dars zaxira — `comp` siz qator;
   - keyslar — faqat K1–K19; 11-Modulda ishlatilganlarni (K18, K14, K4, K15, K16, K1, K10, K19) takrorlash yoki yo'qligi;
   - dars nomlari → 00-NOMLAR.md (PM — savol-sarlavha, TEX — mavzu nomi, loyiha kuni — «Loyiha kuni: …», ≤55 belgi, menyu nomi = dars nomi).
3) 00-MODUL-TAYANCH.md (faktlar, atamalar, repo teglari, saqlash kalitlari `pm-m10dN-…`, tekshirilgan tashqi faktlar — manba havolasi va sana bilan) + 00-TAQIQLAR.md
   (11-Modulnikidan, 12-Modulga moslab). MD agentlari faqat shulardan yozadi.
   Tayanchda «Oldindan tuzatiladigan sinflar» bo'limi — 11-Modul FILTR fayllarida bir necha darsda takror Qabul qilinganlar (o'zingiz sanab, sinfga ajratasiz). Kamida:
   · yakun kartasi o'quvchi holatiga qarab (bajardi / qisman / bajarmadi) — 8 darsda;
   · da'vo ≠ isbot: «tuzatdim», «ishlaydi» — fakt va qayta sinov natijasi bilan — 8 darsda;
   · agentga xato yuborishda `.env` qiymati va token yo'q — 4 darsda;
   · tashqi xizmat haqida kafolat emas («odatda», «bu misolda»), raqam va tugma nomi — rasmiy hujjatdan, sana bilan.
4) MD v3 — har dars bitta agent (ruxsat bilan), ikki to'lqin. Topshiriq 11-Modul MD_AGENT_TOPSHIRIQ.md / MD_TOPSHIRIQ_2.md naqshida.
   1-to'lqin — 2–3 pilot MD (bitta PM, bitta TEX yoki loyiha kuni, bitta real foydalanuvchi darsi — 6, 7 yoki 10). Keyin TO'XTAYSIZ:
   men pilotlarni o'qiyman va ChatGPT auditiga beraman → siz Filtr qilasiz → takror sinflar tayanchga → 2-to'lqin faqat mening «davom» so'zim bilan.
   Har agent yordamchi fayllarini scratchpad'dagi o'z papkasida (md<NN>/) saqlaydi. Natija: feedback/F-1006-12modul/NN-<Nom>-v3.md, har birida `npm run lint:til` 0 error.
   Keyin o'zaro tekshiruv: o'lchov, arena ✔ 3/3/3/3, atama tartibi, «Keyingi dars» nomlari, saqlash kalitlari.
   Ekranlar soni: PM+PRAKT — 12 (PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun);
   loyiha kuni (AI-PRAKT) — 8 ekran + 3 blok + kartochkalar = 12; uyga vazifa yakun kartasida, alohida .homework.jsx yo'q.
5) GATE M — bitta sahifa (`python3 konveyer/vositalar/gatem/sahifa.py …` → Artifact). Men tasdiqlayman, keyin har MD ni ChatGPT auditiga beraman.
   Har bandni Filtr bilan ko'rasiz (Qabul / Qisman / Rad + sabab, NN-FILTR.md) → MD tuzatiladi; javoblar → GATE_M_JAVOB.md.
6) «Qur» — faqat mening buyrug'im bilan, asosiy seans skelet va qolip tuzatishlarini qo'llagandan keyin. Avval 2 pilot (bitta PM, bitta TEX yoki loyiha kuni), men ko'raman,
   saboqlar QURUVCHI_SABOQ.md ga, keyin 2-to'lqin. Har dars: `cp src/skelet/NamunaDars.jsx src/10-Modull/<Nom>Lesson.jsx` → 2-QURUVCHI → 3-SADOQAT → 4-VIZUAL
   (1280×773 · 1366×768 · 390×844, ko'z bilan; brend/keys ekranlari m6-02 / m6-14 bilan yonma-yon) → 5-TUZATUVCHI → 6-RU → 7-YAKUNIY.
   «Qur» oldidan 9, 10, 11-Modul QURUVCHI_SABOQ.md va MEXANIZM-TAKLIF bo'limlarini qayta o'qing; skeletdagi tuzoq hali tuzatilmagan bo'lsa — o'z faylingizda chetlab o'tasiz.
7) Yopish: `npm run modul:yopish -- src/10-Modull --yakuniy feedback/F-1006-12modul/YAKUNIY` (fon vazifa + Monitor, muddati tugasa qayta yoqing) →
   QA sayti (buyrug'im bilan, 0-YANGI-MODUL.md 4-bo'lim) → commit (buyrug'im bilan).

## 4. Qoidalar
- Agentlar faqat ruxsatim bilan. Oldin bitta qisqa xabar: nechta agent, har biri nima qiladi, qaysi fayllarga tegadi, taxminan qancha vaqt. GATE M tasdig'i agent yuborishga ruxsat emas.
- Commit, push, deploy — faqat buyrug'im bilan. Commitga faqat o'z fayllaringiz (`git add <aniq yo'l>`); App.jsx dan faqat o'z blokingiz (9-Modul commiti 1fffa7c dagidek).
- Shoshilmang: har bosqich (manba · qaror sahifasi · tayanch · pilot MD · 2-to'lqin · GATE M · Filtr) oxirida to'xtaysiz — qisqa hisobot, nimani o'zingiz tekshirdingiz, ochiq savollar.
  Keyingi bosqich — mening so'zim bilan. Tekshirmagan narsangizni «tayyor» demaysiz.
- Filtr: audit bandi QOIDALAR yoki tasdiqlangan qarorga zid bo'lsa — avval grep, keyin hukm. 11-Modulda ChatGPT 8 darsda hookdagi «Qiziq fikr!» ni olib tashlashni taklif qilgan —
  bu T-028 / T-067 dagi kurs qonuni (xato tanlovga neytral javob), har safar rad etilgan; 7-darsda bir marta adashib olib tashlangan va qaytarilgan.
- Tashxis avval, yechim keyin. Savollar bitta sahifada, javob qatori bilan. Hisobot qisqa, o'zbekcha; darsni LMS raqami bilan ayting («12-Modul 3-darsi»).
- Halollik: keyslar faqat PM_Prompt_v8 bankidan (K1–K19, PM-016); bankdan tashqari keys yoki manbasiz raqam kerak bo'lsa — qaror sahifasida savol.
  Tashqi xizmatlar (Expo, EAS, socket.io, Render, Netlify, Neon, Telegram, Instagram) imkoniyati, narxi, tugma va menyu nomlari taxmin qilinmaydi — rasmiy hujjatdan, sana bilan (P-028).
  Real foydalanuvchi bilan ishlaydigan darslarda (6, 7, 10) — faqat halol yo'llar: soxta akkaunt, spam, sotib olingan obunachi yo'q; o'smirning shaxsiy ma'lumoti ochiq joyga chiqmaydi.
- Har dars: `npm run gates -- <fayl>` 12/12 · `npm run lint:jsx` 0 · matn tegilsa `npm run lint:til` 0 error. 12/12 — sifat emas: har ekran surati ko'z bilan ko'riladi.
- Har topilma sinf-supurish bilan yopiladi: qurilgan hamma darslarda grep qilinadi, natija jurnalga (topilmasa ham). Jurnal vaqti `date` bilan.
- Uzoq tekshiruvni (layout, modul:yopish) timeout bilan alohida fon vazifada yurgizasiz. Monitor faqat natijani kuzatadi; 30 daqiqada o'chsa, darhol qayta yoqiladi.
- 🔴 Qat'iy qonunlar (foydalanuvchi, 05.10):
  · har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi;
  · kartochkalar alohida ekranda (podium → kartochkalar → yakun): Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi»;
  · brend yoki mahsulot nomi o'z rangida, tanish maketda, jonli sahnada chiqadi (matnli karta rad);
  · agent MD matnini o'zboshimcha o'zgartirmaydi — kerak bo'lsa «MD ga taklif» deb yozadi;
  · o'ylab topilgan qahramon yo'q, vazifani Mentor beradi.

O'qib bo'lgach, menga 5 qatorda nimani tushunganingizni yozing va 0-bosqichni boshlang: manba → qaror sahifasi.
```
