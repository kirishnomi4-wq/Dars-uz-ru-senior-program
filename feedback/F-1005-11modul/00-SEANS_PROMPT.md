# 11-Modul seansi uchun prompt (foydalanuvchi nusxalab beradi) — 05.10.2026

```
Yangi modul: LMS 11-Modul «Final loyiha: g'oya va rivojlantirish + React Native» (kodda src/9-Modull, kalitlar m9-NN, App.jsx da yangi `id: '9'` bloki).
Siz to'rtinchi parallel seanssiz. Qolganlari: ASOSIY seans — mexanizm (konveyer, qolip, skelet, darvozalar, qonunlar) ·
9-Modul seansi — src/7-Modull (QA sayti chiqdi, ertaga QA fidbeki) · 10-Modul seansi — src/8-Modull (hozir ishlayapti).

## 1. Boshlashdan oldin o'qing (bir marta, shu tartibda)
1) konveyer/0-YANGI-MODUL.md — raqamlash (kod = LMS − 2), seans chegarasi, bosqichlar, QA sayti. U 9-Modul uchun yozilgan:
   7 → 9, m7 → m9, F-1005-9modul → F-1005-11modul, coddycamp-9modul → coddycamp-11modul deb o'qing.
2) konveyer/README.md (zanjir 0–9) · konveyer/1-MD.md (MD v3 formati, GATE M ro'yxati, «Filtr») · konveyer/QURISH_KARTASI.md · src/qolip/QOLIP.md.
3) MATN_KORPUS.md 1–720-qatorlar (taqlid-manba) · QOIDALAR.md (reestr: T-, P-, S-, PM- ID lar shu yerda).
4) Oldingi seanslar topgan saboqlar (faqat o'qish; qayta kashf qilmang):
   - feedback/F-1005-9modul/QURUVCHI_SABOQ.md — 18 band; 🔴 belgililari foydalanuvchining qat'iy qonunlari;
   - feedback/F-1005-9modul/MD_AGENT_TOPSHIRIQ.md va QURUVCHI_TOPSHIRIQ_2.md — agent topshirig'i namunasi va «skelet tuzoqlari»;
   - feedback/F-1005-10modul/00-TAQIQLAR.md — umumiy qonunlardan yig'ilgan «nima mumkin emas» (o'zingiznikini shundan, 11-Modulga moslab yozasiz);
   - feedback/F-1005-10modul/QURUVCHI_SABOQ.md;
   - ikkala JURNAL.md dagi «MEXANIZM-TAKLIF» bo'limlari — mexanizmning hali yopilmagan tuzoqlari (9-Modul 16 band, 10-Modul 7 band).
5) Xotira (memory/): qatiy-keyingi-harakat-kartochka · pm-vizual-brend-maket · agentlar-faqat-ruxsat-bilan · uzoq-tekshiruvni-kuzat ·
   tashqi-audit-filtr · qaror-vizual-artifact · sinonim-taqiq-bir-mano-bir-soz · konveyer-yagona-yol · platforma-standartini-avval-olcha · parallel-seans-2026-10-05.
6) Dastur: «CoddyCamp_Senior_2026_v9_14modul .html» → «11-modul · FINAL LOYIHA …» bo'limi —
   17 dars (TEX 3 · AI-PRAKT 4 · PM+PRAKT 1 · PM 8 · DEMO 1, zaxira yo'q), o'qish jadvalida 12–13.5-oy.
7) Oldingi darslar (faqat o'qish):
   - 10-Modul — feedback/F-1005-10modul/00-MODUL-TAYANCH.md, GATE_M_JAVOB.md, 00-NOMLAR.md. Oxirgi darsi m8-11 «Besh daqiqada nimani ko'rsatasiz?».
     MD lari tasdiqlangan, darslar hali qurilmoqda — «Keyingi dars» ulanishini 10-Modul seansi bilan jurnal orqali kelishasiz.
   - 9-Modul — 00-MODUL-TAYANCH.md, GATE_M_JAVOB.md: misol-ip «Maydon», repo maydon, animatsiya darslari m7-05 va m7-08. 11-Modulning 7-darsi «animatsiyalar 9-moduldan» deydi.
   - 6-Modul m6-09 «React Native — asoslari» (Expo setup). 11-Modulning 9-darsi «refresh» shu darsdan davom etadi.

## 2. Chegara (to'rt seans parallel)
- O'zgartirasiz FAQAT: src/9-Modull/* · App.jsx dagi o'z bloklaringiz (`// ---- 9-Modul` import bloki va `id: '9'` modul bloki; ular `id: '8'` blokidan keyin yangidan qo'shiladi) ·
  feedback/F-1005-11modul/* · QA sayti fayllari (modul9.html, src/m9-demo/*, vite.m9.config.js, dist-m9/).
- App.jsx ni uch seans tahrirlaydi. Har tahrirdan oldin qayta o'qing, faqat aniq Edit qiling (butun faylni Write qilmang), boshqa bloklarga tegmang va ularni «tozalamang».
- Tegmaysiz: konveyer/* · src/qolip · src/skelet · src/live · scripts · lint-* · layout-lint · tools · package.json ·
  qonun fayllari (QOIDALAR, DARS_ETALON, PM_DARS_ETALON, MATN_KORPUS, MATN_ETALONI, PM_Prompt_v8, RU_I18N_SPEC, til-lint-rules.json) · CLAUDE.md · KATTA_TOZALASH.md ·
  boshqa modullar (src/7-Modull, src/8-Modull, ularning feedback papkalari, ~/Desktop/maydon — faqat o'qish).
- Mexanizm, qolip yoki qonunga o'zgarish kerak bo'lsa — jurnalingizdagi «MEXANIZM-TAKLIF» bo'limiga yozasiz (nima · nega · qaysi fayl), o'zingiz tegmaysiz.
  Skelet tuzog'ini o'z faylingizda chetlab o'tasiz va taklifga yozasiz.
- F-ID: F-MMDD-NN, NN 250 dan (asosiy 01–49 · 9-Modul 50–149 · 10-Modul 150–249).
- Birinchi ishingiz: feedback/F-1005-11modul/JURNAL.md va xotirada seans fayli (memory/seans-11modul-2026-10-05.md + MEMORY.md da bitta qator):
  chegara, holat, keyingi qadam. Har bosqich tugaganda ikkalasini yangilang — noutbuk birdan o'chsa, keyingi seans faqat shu yozuvlardan davom etadi.

## 3. Ish tartibi (konveyer — yagona yo'l)
1) Manba (agentsiz, o'zingiz): dastur jadvali → 00-MANBA.md. O'tilgan atamalarni grep bilan tekshiring (5, 6, 9, 10-Modul MD va YAKUNIY, src/):
   RICE, PRD, custdev/intervyu, roadmap, wireframe, prototip, Expo, PWA, autentifikatsiya avval o'tilganmi va qaysi so'z bilan.
2) BITTA qaror sahifasi (artifact, javob qatori bilan; har savolda variantlar + tavsiya). Kamida shular:
   - misol-ip: Mentor misoli «Maydon» davomimi yoki Mentorning yangi final g'oyasimi (o'quvchi 1–4-darslarda o'z final g'oyasini tanlaydi);
   - repo: Mentor misoli uchun yangi repo yoki maydon davomi; teglar nomi (masalan m11-dars-NN-start / -done);
   - platforma: web va mobile trek darsda qanday ko'rsatiladi (8-dars — PM-qaror; 9-dars — Expo, web-trek uchun adaptiv/PWA); Expo Go o'quvchi telefonida;
     React Native kodi platformaning kod oynasida ishlamaydi — buni darsda qanday ko'rsatamiz;
   - 15-dars «Mentor bilan 1-ga-1» va 17-dars «Demo Day 7»: dars quriladimi yoki zaxira kabi `comp` siz qator bo'ladimi (konveyerda DEMO turi yo'q);
   - 3–4-darslardagi 10 intervyu 9-Modulning 2–3-darslaridagi intervyuni takrorlamasligi;
   - dars nomlari → 00-NOMLAR.md (PM — savol-sarlavha, TEX — mavzu nomi, loyiha kuni — «Loyiha kuni: …», ≤55 belgi, menyu nomi = dars nomi).
3) 00-MODUL-TAYANCH.md (faktlar, atamalar, repo teglari, saqlash kalitlari `pm-m9dN-…`) + 00-TAQIQLAR.md. MD agentlari faqat shulardan yozadi.
4) MD v3 — har dars bitta agent (ruxsat bilan). Topshiriq 9/10-Modul MD_AGENT_TOPSHIRIQ.md naqshida bo'ladi; har agent yordamchi fayllarini scratchpad'dagi o'z papkasida (md<NN>/) saqlaydi.
   Natija: feedback/F-1005-11modul/NN-<Nom>-v3.md, har birida `npm run lint:til` 0 error. Keyin o'zaro tekshiruv: o'lchov, arena ✔ 3/3/3/3, atama tartibi, «Keyingi dars» nomlari.
   Ekranlar soni: PM+PRAKT — 12 (PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun);
   loyiha kuni (AI-PRAKT) — 8 ekran + 3 blok + kartochkalar = 12; uyga vazifa yakun kartasida, alohida .homework.jsx yo'q.
5) GATE M — bitta sahifa (`python3 konveyer/vositalar/gatem/sahifa.py …` → Artifact). Men audit qilaman, ChatGPT xulosasi ham keladi.
   Har bandni Filtr bilan ko'rasiz (Qabul / Qisman / Rad + sabab, NN-FILTR.md) → MD tuzatiladi → yana sahifa, toki «tasdiq». Javoblar → GATE_M_JAVOB.md.
6) «Qur» — faqat mening buyrug'im bilan. Avval 2 pilot (bitta PM, bitta TEX yoki loyiha kuni) quriladi, men ko'raman, saboqlar QURUVCHI_SABOQ.md ga yoziladi, keyin 2-to'lqin.
   Har dars: `cp src/skelet/NamunaDars.jsx src/9-Modull/<Nom>Lesson.jsx` → 2-QURUVCHI → 3-SADOQAT → 4-VIZUAL (1280×773 · 1366×768 · 390×844, ko'z bilan;
   brend/keys ekranlari m6-02 / m6-14 bilan yonma-yon) → 5-TUZATUVCHI → 6-RU → 7-YAKUNIY.
   Skelet tuzoqlari (o'z faylingizda): QURUVCHI_TOPSHIRIQ_2 ro'yxati + LiveGate sarlavhasi (NamunaDars.jsx:2063 da «Tizim arxitekturasi darsi» qattiq yozilgan → `tr(LESSON_META.lessonTitle)`).
   «Qur» oldidan 9 va 10-Modul QURUVCHI_SABOQ.md va MEXANIZM-TAKLIF bo'limlarini qayta o'qing — ular kun sayin to'ldirilyapti; asosiy seans hal qilgan tuzoqni chetlab o'tmaysiz.
7) Yopish: `npm run modul:yopish -- src/9-Modull --yakuniy feedback/F-1005-11modul/YAKUNIY` (fon vazifa + Monitor, muddati tugasa qayta yoqing) →
   QA sayti (buyrug'im bilan, 0-YANGI-MODUL.md 4-bo'lim) → commit (buyrug'im bilan).

## 4. Qoidalar
- Agentlar faqat ruxsatim bilan. Oldin bitta qisqa xabar yozasiz: nechta agent, har biri nima qiladi, qaysi fayllarga tegadi, taxminan qancha vaqt oladi. GATE M tasdig'i agent yuborishga ruxsat emas.
- Commit, push, deploy — faqat buyrug'im bilan. Commitga faqat o'z fayllaringiz kiradi (`git add <aniq yo'l>`); App.jsx dan faqat o'z blokingiz (9-Modul commiti 1fffa7c dagidek).
- Tashxis avval, yechim keyin. Savollar bitta sahifada, javob qatori bilan. Hisobot qisqa, o'zbekcha; darsni LMS raqami bilan ayting («11-Modul 3-darsi»).
- Halollik: keyslar faqat PM_Prompt_v8 bankidan (K1–K19, PM-016). Bankdan tashqari keys yoki manbasiz raqam kerak bo'lsa, qaror sahifasida savol berasiz.
  Tashqi xizmatlarning (Expo, React Native, Netlify, Render, Neon) tugma va menyu nomlari taxmin qilinmaydi — rasmiy hujjatdan tekshiriladi (P-028).
- Har dars: `npm run gates -- <fayl>` 12/12 · `npm run lint:jsx` 0 · matn tegilsa `npm run lint:til` 0 error. 12/12 — sifat emas: har ekran surati ko'z bilan ko'riladi.
- Har topilma sinf-supurish bilan yopiladi: qurilgan hamma darslarda grep qilinadi, natija jurnalga yoziladi (topilmasa ham). Jurnal vaqti `date` bilan yoziladi.
- Uzoq tekshiruvni (layout, modul:yopish) timeout bilan alohida fon vazifada yurgizasiz. Monitor faqat natijani kuzatadi; 30 daqiqada o'chsa, darhol qayta yoqiladi.
- 🔴 Qat'iy qonunlar (05.10, foydalanuvchi):
  · har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi;
  · kartochkalar alohida ekranda (podium → kartochkalar → yakun): Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi»;
  · brend yoki mahsulot nomi o'z rangida, tanish maketda, jonli sahnada chiqadi (matnli karta rad);
  · agent MD matnini o'zboshimcha o'zgartirmaydi — kerak bo'lsa «MD ga taklif» deb yozadi;
  · o'ylab topilgan qahramon yo'q, vazifani Mentor beradi.

O'qib bo'lgach, menga 5 qatorda nimani tushunganingizni yozing va 0-bosqichni boshlang: manba → qaror sahifasi.
```
