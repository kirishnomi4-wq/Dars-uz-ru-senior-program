# BATCH 2 — QURUVCHI-BRIF (2026-08-17, bosh-agent). HAR quruvchi uchun MAJBURIY.

## 0. Sizning darsingiz (bosh-agent promptida aytiladi): senariy fayli + maqsad .jsx fayli.
Siz FAQAT o'z .jsx faylingizni tahrirlaysiz. Umumiy fayllar (App.jsx, registr, korpus, STATE,
_lessonids.txt, HtmlCompiler.jsx) — TEGILMAYDI (bosh-agent kiritadi).

## 1. O'QISH TARTIBI (yozishdan OLDIN, majburiy)
1. `.claude/agents/pm/pm-quruvchi.md` (rolingiz) · `PM_DARS_ETALON.md` · `PM_Prompt_v8.md` (keys/9 blok)
2. SENARIY to'liq (9 blok + KEYS-SPETS + KODING-SPETS + AVTO-GATE S bo'limi — GATE S qarorlari
   senariy matnidan USTUN).
3. `PM_KEYS_MEXANIKA_REGISTRI.md` — R2 «BATCH 2» jadvali + «BATCH 2 aniq mexanika-muhrlari» +
   «BATCH 2 AVTO-GATE S» (artefakt-kalitlar, karta-nomlari, imzo-nomlar).
4. `MATN_KORPUS.md` §99–§125 (F-0813/F-0814 saboqlari) — taqlid-manba. Qonun ≠ korpus: korpus
   avval o'qiladi, qonun tekshiruvga.
5. Manba-naqsh (infra BAYT-MOS ko'chiriladi, kontent senariydan):
   - kompilyatorli darslar (m4-12, m4a-02): `src/4-Modull/PmLesson11.jsx` (fixed-qobiq :1760,
     sof-JS, previewUrl YO'Q, «📺 Natija» panel) — QUIZ/FLASHCARD/keys/yakun infra shu yerdan.
   - VS Code darsi (m4-15): `src/4-Modull/PmLesson12.jsx` (VS Code maketi, `p{padding:0}` toza reset,
     UCH KIRISH kirish-artefakt naqshi).
   - keys-ekran uzluksiz hisoblagich + 2 bashorat naqshi: `src/3-Modull/PmLesson9.jsx` s6.

## 2. TUZILMA-RELSLAR (Batch 1 dan 12-saboq — 4 darsda ham qaytarishga sabab bo'lgan)
1. Hech bir ekranda o'quvchi QAMALMASIN: gating sharti aniq aytilgan; ipucha taymeri qayta
   boshlanmaydi (bir marta boshlanadi, 45s dan keyin ko'rinadi); ipucha HAMMA to'g'ri javobga
   olib boradi (§116); mentor rejimida gating ochiq (mentor bosib o'ta oladi).
2. Gating-qatori matni HAMMA interaktiv ekranda BIR XIL qolipda.
3. Keys-ekran (17-ov-band): `predict:` KAMIDA 2 ta · ikki bashorat IKKI o'lchovda (birinchisi
   ikkinchisini oshkor qilmaydi) · bosqich-hisoblagich UZLUKSIZ 1·2·…·N (bashorat-bosqichi ham,
   ko'prik-bosqichi ham sanaladi, javobdan keyin yo'qolmaydi) · adashganda «Adashdingiz — asl
   javob «Y»» (56-qonun, taxmin takrorlanmaydi).
4. Ekranlar 16 ta (senariydagi ekran-jadvali aynan) · `SCREEN_INTENTS` har ekranga 1 gap
   («bola nima QILADI/BILADI») · `SCREEN_META` == ekran-soni.
5. Ballanadigan testlar TARQATILGAN (ketma-ket blok TAQIQ) · QUIZ_BANK 3/3/3/3 · 12 arena-savol ·
   `correct` indekslari tsikl (0,3,2,1 · 1,0,2,3 · 0,2,1,3) · o'suvchi A→B→C→D qatorlar taqiq
   (bir savolda variantlar «uzunlik» yoki «alfavit» bo'yicha tartiblanmasin).
6. DISTRAKTOR (16-ov-band, §102/§110/§118): darsning o'z ekranida rost bo'lgan gap distraktor
   bo'lolmaydi · hayotda rost — bo'lolmaydi · mutlaq so'z («faqat/eng/hamma/hech/har doim»)
   distraktorlarda ≤1/4 · to'g'ri javob eng uzun bo'lmasin (yarmidan ko'pida bo'lsa 🔴) ·
   Ha/Yo'q hukm-savolida soni teng (§107) · «degan javob» ulanmaydi (§111) · savol o'quvchini
   rost narsani rad etishga majburlamasin (§108).
7. Bitta misol-ip (108-qonun): dars OLAMI senariydagi bitta olam. Klon-residue 0: manba-naqsh
   fayldan bufet/musiqa/jurnal/Netflix/lavash/kino so'zlari qolmasin (esbuild'dan keyin
   grep bilan o'zingiz tekshiring). Fon-dekor so'zlari darsning o'z lug'atidan (§114).
8. TMI taqiq (109-qonun): EKRAN ≤400 grapheme; mentor-pufagi 1 gap; ta-sub / caption / «sizning
   …ingiz ham» ramkasi — P0 da yo'q bo'lsa QO'SHILMAYDI (54-qonun).
9. Kirish-artefakt (registr «ARTEFAKT-ZANJIRI»): localStorage kalitini AYNAN muhrlangan
   nomda o'qing/yozing (m4-12: `pm-m4d7-ishonch` → yozadi `pm-m4d12-sxema {ustunlar:[{nom,savol,kim}×3],savedAt}` ·
   m4-15: `pm-m4d12-sxema` dan `ustunlar[].nom` → yozadi `pm-m4d15-pitch {qavatlar:[{qavat,gap}×3],savedAt}` ·
   m4a-02: kirishsiz → `pm-m4a2-yuk {qarorlar:[{qism,qaror,sabab}×3],savedAt}`). Kirish YO'Q bo'lsa
   zaxira-tarmoq (senariyda) — bola qamalmasin.
10. ccProgress (reload'da joyiga qaytadi) — P0 naqshi majburiy · 77-qonun yakun avto-skroll
    (`.stage-content` ichida) · 88(d) bir lahzada 2 element yonmasin (`turnBusy`) · MentorNote
    default yopiq xira chip (proyektor-sir).
11. Yakun-tuzilma PmLesson2 tartibi (F-0803-08): uy-vazifa yakun ichida, variantli uy-vazifa
    sonni aytmaydi (§96), yakka o'quvchida «ko'pchilik/ikkalangiz» yo'q (§97).
12. CSS reset: PmLesson11:2676 dagi `...,.lesson-root p,.lesson-root ul,.lesson-root ol { margin:0; padding:0 }` NUQSON
    (p ga padding:0 — ramkali paragraflar siqiladi). TOZA shakl = PmLesson12:2721: `h1…h6, p { margin: 0 }`
    (padding YO'Q, ul/ol alohida). Infra PmLesson11 dan ko'chirilsa shu qator PmLesson12 shakliga almashtiriladi;
    `.hw` stilsiz klass ko'chirilmasin; o'lik CSS/`useState` qoldirilmasin.

## 3. KOMPILYATOR-QOBIQ RELSLARI (18-ov-band — m4-12, m4a-02 uchun MAJBURIY)
(a) `<HtmlCompiler` fixed-qobiq ichida (`position:'fixed', inset:0, zIndex≥2000, background:T.bg`
    — PmLesson11:1760 naqshi); (b) sof-JS'da `previewUrl` YO'Q; (c) starter holatida hech bir
    shart yashil emas + shartlar XULQ-ATVORGA bog'langan (manba-regex sanog'i emas — muqobil
    yozilgan to'g'ri yechim o'tsin, yodlangan-javob to'xtasin); (d) ≤860px muharrir >0px.
m4-15 (VS Code): koding-qolip 82-qonun + nusxa-taqiq, PmLesson12 naqshi; kompilyator YO'Q.

## 4. TIL / TAQIQ-SO'ZLAR (bosh-agent har quruvchidan keyin `npm run lint:til` — 0 error SHART)
- Lint 74 qoida (`til-lint-rules.json`) — asosiylari: chip/slot/skelet/anatomiya · «professional» ·
  «daftar» · sen-forma (siz-forma majburiy) · «taxmin qiling» · «keyingi darsda» · «zachyot/
  general repetitsiya» · kirill-lotin aralash · qiyshiq apostrof · yasama-ot qoida (§103).
- Personaj-taqiq: o'ylab topilgan qahramon yo'q, vazifani Mentor beradi.
- Dars-atama intizomi (senariy + AVTO-GATE S): m4-12 — «E'lon» PRD-matnida 0, «PRD» ekranga
  chiqmaydi (nom «Ilova nimani yozib qoladi?») · m4-15 — «stakeholder/pitch/arxitektura»
  ekranga chiqmaydi, «qavat» atamasi (+ yarim-jumlalik «qatlam» ko'prigi), imzo-nom «UCH
  QAVAT KESIMI» ekranga chiqmaydi (ichki-nom) · m4a-02 — «masshtab/scale» 0, «yuk» oilasi,
  §121 ildiz-intizomi («sin-» ildizi band → flashcard sarlavhasi «O'zingizni tekshirib ko'ring»).
- m4-15 ga PITCH-OILASI TAQIQ (registr 5-bo'lim): tushunish chizig'i · so'z-elagi · tinglovchi-
  javobi kartalari · uch qatlam O'XSHATISHI · tinglovchi kursisi · sahna-taymeri · MicRecorder ·
  texnik↔odamcha juftlik · demo 3 qadam-akkordeoni · ota-ona savollari · repetitsiya kabinasi ·
  30s juftlik-sekundomeri · «GAPSIZ KO'RSATUV» tasma — hech biri qayta qurilmaydi.
- Umumiy TAQIQ mexanikalar (registr): story-silosi · JTBD shtampi · Metrika alangasi · ikki o'qli
  doska · MatchPairs · bo'laklash-doska · hafta-chizig'i · rang-juftlash · kartani ko'chirish ·
  PairTimer · klinika · tekshiruvchi stoli · Hotspot · Timeline(vaqt) · jadval-qatorini belgilash.
- Yozishdan OLDIN korpus §99–125 o'qilgan bo'lishi shart; ohang — jonli so'zlashuv, kantselyarit 0.

## 5. DARVOZALAR (siz tugatishdan oldin O'ZINGIZ yuritasiz va hisobotda raqam bilan aytasiz)
esbuild toza · `node jsx-lint.mjs <fayl>` 0 · `node til-lint.mjs <fayl>` 0 error ·
QUIZ_BANK 3/3/3/3 · `predict:` soni ≥2 · SCREEN_INTENTS == ekran-soni · klon-residue grep 0 ·
`grep -c "previewUrl"` (kompilyatorli sof-JS darsda 0) · lessonId yangi (`pm-m4d12-v1` /
`pm-m4d15-v1` / `pm-m4a2-v1`) · fayl ~3400–3800 qator.

## 6. HISOBOT (qisqa, ≤25 qator): ekran-ro'yxati (s0…s15 + niyat) · mexanikalar · keys-ekran
bosqichlar soni/bashorat-o'lchovlari · darvozalar raqam bilan · senariydan chetlashishlar
(sabab bilan) · ochiq savollar. Kod-dump YO'Q.

## 7. BATCH 3 QO'SHIMCHASI (2026-08-17 — B2 zanjirlaridan chiqqan yangi relslar, MAJBURIY)
- Manba-naqsh B3: kompilyatorli (m4c-02) → `src/4-Modull/PmLesson11.jsx` infra + **PmLesson15.jsx fixed-qobiq**
  (`zoom: calc(1 / var(--lz,1))` — 2560×1440 da `.hc-bottom` ekrandan chiqib ketmasin) + PmLesson11
  s10 shart-xulqi (`evalEquals`); VS Code darslar (m4b-02, m4c-06) → `PmLesson12.jsx` (PASS) + PmLesson14
  s8 `DRAFT_KEY` localStorage-draft naqshi (yarim yozilgan holat «Orqaga»da yo'qolmasin) + s12 gating bo'lsa
  `isMentor` bypass (ETALON 31; PmLesson11 s12 da qulf yo'q — shu naqsh ham joiz).
- QUIZ_BANK: correct tsikl 0,3,2,1·1,0,2,3·0,2,1,3 · variantlar UZUNLIK bo'yicha monoton emas (narvon 0) ·
  to'g'ri javob eng uzun ≤ 3/12 · atama ≥2 variantda (§127) · test-kaliti oldingi xulosadan so'zma-so'z
  emas (§129) · «Foydalanuvchi» emas «odam» (§80).
- Ekran-relslar: 4-gap/oxirgi-element «kashfiyot»-tugmasi navbat kelganda paydo bo'ladi (PmLesson13 s4) ·
  tekshiruv-mashqda jazosiz brute-force YO'Q: urinish-sanog'i + 1-xato ipucha + 2-xatodan ko'prik (javobni
  aytmaydi), o'quvchiga «Xato: N» ko'rinmaydi (106d) · texnik-so'z detektori bloklasa 3-urinishdan ochiladi ·
  yozish-ekranida oldingi yozilganlar ko'rinadi (referent) · s15 nishonlar yig'ma qatlam (▸) — ≤400 gr ·
  senariydagi yordamchi holat-kalitlar (board/check kabi) localStorage'da saqlanadi (PmLesson12 ROWS_KEY) ·
  keys ko'prik-gapi hisoblagichni uzmaydi (oxirgi slayd ichida) · yakun-ekranida `.hw` klassini ishlatmang.
- Til: §126–130 (bosh atama maqsad-ekranda emas · atama ≥2 variantda · shart darak gapda · namuna o'z
  qoidasidan · hisoblagich-yorlig'i o'z-o'zini tushuntiradi («milliard», «hali noma'lum») · bosh atama ildizi
  platforma-matnida ham yo'q («Yuklanmoqda» → «kelmoqda» kabi) · checklist ma'noni so'raydi · ✅-qatori rost).
- b2-check darvozasi bosh-agent tomonidan yuritiladi: shu bandlar hammasi raqam bilan o'lchanadi.
