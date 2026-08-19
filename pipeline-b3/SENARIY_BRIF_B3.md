# BATCH 3 — SENARIY-YOZUVCHI BRIFI (2026-08-17). Uch yozuvchi, har biri O'Z faylida.

## 0. Siz nima qilasiz
`pm-senariylar/<Fayl>.md` — YANGI fayl (mavjud bo'lsa ustidan yozmang, tekshiring). Boshqa hech
qanday faylga TEGMAYSIZ (registr/korpus/App.jsx/STATE — bosh-agent). Chiqish = tayyor senariy +
o'z-tekshiruv + [GATE S] savollar bo'limi (bosh-agent avto-GATE S yopadi).

## 1. O'QISH TARTIBI (yozishdan OLDIN — majburiy)
1. `PM_Prompt_v8.md` (senariy-qonun: 9 blok, keys-bank, zaxira ilgak, ohang) · `PM_DARS_ETALON.md`
   (qonun 1–…; 1-B ikki-tur, 33 keys-ekran ≥2 bashorat, 26/59 mexanika-takror, 91/108 bitta ip,
   95 auditoriya-testi, 96c olam-to'qnashuv, 109 TMI) · `MATN_ETALONI.md` (til).
2. `MATN_KORPUS.md` **§99–129** to'liq (F-0813/F-0814/F-0817 saboqlari — taqlid-manba).
3. **FORMAT-ETALON:** `pm-senariylar/M4a-D2-Masshtab.md` — bo'lim-tuzilmasi (0 SHAPKA jadval ·
   atama-glosslar · 1 MEXANIKA · 2 EKRAN-RO'YXATI 16 · 3 BLOKLAR 1–9 · 4 TESTLAR · 5 YOZISH/USTAXONA
   · 6 KEYS-SPETS · 7 KODING-SPETS · 8 qolgan ekranlar · 9 CODESTRIKE 12 · 10 NISHONLAR 4 ·
   11 FLASHCARD 10 · 12 RECAPS · 13 O'Z-TEKSHIRUV · 14 [GATE S] savollar) AYNAN shu tartibda.
   Yana `M4-D7-Ishonch.md` — ZAXIRA ILGAK naqshi (m4c-06 uchun) va `M4-D12-Sxema.md`.
4. `PM_KEYS_MEXANIKA_REGISTRI.md`: 3-bo'lim (keys taqsimoti) · 4-bo'lim (qarorlar: modul-ichi qoidasi,
   zaxira ilgak) · 5-bo'lim (BAND MEXANIKALAR + PITCH-OILASI + TEKSHIRUV-primitivlari bandligi;
   Batch 1/2 muhrlari) · 6-bo'lim (artefakt-zanjiri) · R1 koding-navbati · **R2 BATCH 3 pasporti**
   (6 ustun — yo'lakchadan chiqmaysiz) · R3 protokoli.
5. Qo'shni texnik darslarni ko'ring (o'quvchi nima biladi): m4b — `src/4b-Modull/JestUnitTestLesson.jsx`,
   `EdgeCasesTestLesson.jsx`; m4c — `src/4c-Modull/CiCdIntroLesson.jsx`, `GithubActionsLesson.jsx`,
   `FullPipelineProjectLesson.jsx`; M1 Netlify — `src/1-Modull/DeployLesson.jsx` (m4c-06 olami).
   Kartalar/sub matnlari `src/App.jsx` da (4b/4c bo'limlari).

## 2. QAT'IY RELSLAR
- 16 ekran (s0…s15), yakun-tuzilma B2 senariylari bilan bir xil (s11 final test · s12 refleksiya ·
  s13 podium · s14 flashcard 10 · s15 yakun: bigidea+CodeStrike 12+uy-vazifa+4 nishon).
- Keys: pasportdagi keys AYNAN; halol yopishmasa — zaxira ilgak + sabab shapkada (M4-D7 naqshi).
  Keys-ekran: ≥2 bashorat, IKKI o'lchovda, hisoblagich uzluksiz, faktlar BANKDA (§101/§124
  chegaralangan inkor; §122 raqam ta'rifga zo'rlanmaydi).
- Mexanika: pasportdagi imzo + TEKSHIRUV yo'lakchasi; band ro'yxatdagilar TAQIQ; farq-dalili yoziladi.
- Bitta olam (108) — pasportdagi; 96c to'qnashuv-grep (`src/` da bosh-misol emasligi) shapkada dalil.
- Koding R1: m4b-02 VS Code · m4c-02 KOMPILYATOR (sof JS, previewUrl yo'q, shartlar xulq-atvorda,
  starter yashil emas — 18-ov) · m4c-06 VS Code.
- Kirish/chiqish artefakt pasportdagi nomda; modul-chegara bo'lsa kirish YO'Q va «topilmadi» tarmog'i
  yozilmaydi (§69). m4c-06 `pm-m4c2-reliz` ni o'qiydi — shaklni m4c-02 yozuvchisi bilan MOSLASH:
  **`pm-m4c2-reliz = { boʻlaklar: [{hafta, ish}×3], savedAt }`** — ikkala senariy shu shaklni oladi
  (bosh-agent muhri; o'zgartirish taklifi bo'lsa 14-bo'limga).
- Testlar: 4 ta (s3/s5/s7/s11 final) + arena 12 (3/3/3/3, tsikl 0,3,2,1·1,0,2,3·0,2,1,3). Distraktor
  16-ov: ekranda rost EMAS, hayotda rost EMAS, mutlaq so'z ≤1/4, to'g'ri javob eng uzun emas, uzunlik-
  narvoni yo'q, atama ≥2 variantda (§127), test-kaliti oldingi ekran XULOSASIDAN so'zma-so'z EMAS
  (§129 — savolni odam harakatiga o'giring), Ha/Yo'q teng (§107), «degan javob» yo'q (§111).
- Til: siz-forma, kantselyarit 0, EKRAN ≤400 grapheme, atama hodisadan keyin tug'iladi (§104/§126),
  bosh atama maqsad-ekranda EMAS, namuna o'z qoidasidan o'tadi (§128), yasama ot emas fe'l (§103),
  «daftar/chip/slot/skelet/professional» yo'q, personaj yo'q (Mentor beradi), «keyingi darsda» yo'q,
  «taxmin qiling» yo'q. Kelajak-dars atamalari oqmaydi (29-qonun).
- Nishonlar inglizcha o'yin-nom (101-qonun) + o'zbek tavsif; flashcard chet so'z tarjimasiz yo'q.
- App.jsx karta-nomi taklifi 14-bo'limda («?»li o'quvchi-savoli shaklida, 29-qonun) + sub.

## 3. DARVOZA (yozuvchi o'zi): `node til-lint.mjs pm-senariylar/<Fayl>.md` — 0 error (warn izohlansin);
lint:prompt ham (`node prompt-lint.mjs` — homoglif). Hajm ~850–1100 qator.

## 4. HISOBOT (≤20 qator): shapka-xulosasi (keys/mexanika/olam/artefakt/koding) · 16 ekran bir qatorda ·
o'ziga xos imzo · GATE S savollari · lint natijasi. Kod/matn-dump yo'q.
