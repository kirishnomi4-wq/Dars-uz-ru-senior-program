# F-1015-100…107 · 1-bosqich — QOLIP LOYIHASI (hujjat, 15.10.2026)

> **Holat: LOYIHA.** `src/qolip` ga kod — **reliz yig'ilgandan keyin** (nazorat). Bu hujjat — nima o'zgarishini oldindan aniqlash.
> Kuchga kirish — pilot dars (m7-01, D7 A) QA tasdig'idan keyin. Qonun loyihasi: DARS_ETALON **208** (12-BS).
> Manba: `TADQIQOT-0.md` (15.10) + `feedback/F-0929-QA-6modul/D5_TADQIQOT.md` (04.10) + 0-bosqich o'lchovi `olchov-ekran-1553.json`.
> **Cheklov:** Brilliant, Codecademy, Khan darslari to'g'ridan-to'g'ri ko'rilmagan — ular bo'yicha bandlar «e'lon qilingan qoida / sharh» darajasida.

## 0. Nima allaqachon bor (04.10, F-1004) — takrorlanmaydi

| Qonun | Mazmun | 0-bosqich o'lchovi ko'rsatgani |
|---|---|---|
| 193 | Dars 7 ekran turidan (qolipda 12 komponent) | 9–14-M qolipda, lekin ekran ichi zich |
| 194 | Tugma ikki darajada | harakat tugmasi — bajarilgan; javob-chip alohida (D4 B) |
| 195 | Rang — 3 guruh, 9 token | ekranda median 10 xil rang (tokenlar + soyalari); kod CSS'da 80–332 hex (asosan maketlar) |
| 196 | Qolip-darsda emoji yo'q (o'yin qatlamidan tashqari) | ekranda (boshlang'ich holat) dars matnida: **9–14-M — 0** (faqat o'yin qatlami: nishon 🔒, podium); **7-M — 50 (15 ekran), 8-M — 95 (65 ekran)** — qolipsiz modullar |
| 197 | Sarlavha va mentor bir gapni aytmaydi | — |
| 184 | Tushuncha-ekran: harakat → natija vizualda | 902 o'quv ekranidan 348 tasida bosish faqat matn qo'shadi |
| QOLIP.md §6 | «ekranda bitta g'oya, 60 so'zgacha» | **o'lchanmagan edi**: median 67, 90% — 129, maks 523 |

**Xulosa:** qoidalar bor, lekin **raqam bilan o'lchanmaydi va darvozada yo'q**. Yangi ish — byudjet + o'lchov darvozasi + qolipni byudjetga moslash.

## 1. Besh ekran oilasi (193 turlarini guruhlash)

QA: «20 ekranli darsda 4–5 ta qolip takrorlansin». Mavjud komponentlar besh oilaga bo'linadi — bir oiladagi ekranlar **bir xil karkas** (zonalar joyi, sarlavha, mentor, tugma o'rni).

| Oila | Komponentlar | Karkas (yuqoridan pastga) | Byudjet (so'z / blok) |
|---|---|---|---|
| **Kirish** | `QKirish`, `QReja` | sarlavha-savol · mentor (1 gap) · maket + variantlar | ≤ 40 / ≤ 4 |
| **Tushuncha** | `QTushuncha`, `QVoqea` | sarlavha · mentor (1–2 gap) · harakat ⇄ vizual · natija qatori · xulosa | ≤ 60 / ≤ 5 |
| **Mashq** | `QKod`, `QBlok`, `QMustaqil`, `QTartib` | sarlavha · vazifa (1 gap) · joriy qadam · ish maydoni · Yordam | ≤ 120 / ≤ 6 |
| **Test** | `QTest` (+ darsning `QuestionScreen`) | savol · variantlar · izoh (javobdan keyin) | ≤ 60 / ≤ 6 |
| **Yakun** | `QKartochka` (alohida ekran), `QYakun`, `QNatija` | 207-qonun tartibi | 207 bo'yicha |

Byudjet — o'quv ekranining **boshlang'ich holati**, 1280×773 (0-bosqich o'lchov usuli). Kod muharriri ichi hisoblanmaydi.

## 2. Asosiy tushuntirish ochiq turadi (nazorat tuzatishi, 15.10)

- **Taqiqlanadi:** ekranning asosiy g'oyasini (mentor gapi va vizual ko'rsatadigan narsa) tugma bosish ortiga yashirish.
- **Ruxsat:** «Yordam» maslahati · javobni ko'rsatish · test izohi · xulosa (≤110 belgi, 198) — harakatdan keyin tasdiq sifatida
  (w3schools «Show Answer», Brilliant maslahati — `TADQIQOT-0.md`).
- **Mashq qadamlari** bittadan ochilishi (`QBlok`, «Bajardim» qulfi, 176) — ruxsat: bu ko'rsatma emas, ish tartibi (Codecademy checkpoint — bitta vazifa).
- **Tushuncha:** bosish imkon bo'lsa natijani o'zgartiradi (184) — vizual, son, kod natijasi.
- **Ochiq ish (pilotda):** 348 «bos → matn» ekranidan qaysilari asosiy tushuntirishni yashiradi, qaysilari ruxsat etilgan turdagi
  (izoh, xulosa, qadam) — ekranma-ekran ajratiladi. 0-bosqich o'lchovi buni farqlay olmaydi (faqat «so'z qo'shildi»).

## 3. Rang, tugma, emoji

- **Rang (D3 A):** 195 o'zgarmaydi. Qo'shiladi: ekranda ko'rinadigan xil rang ≤ 6 (byudjet); maket ranglari ham tokenlardan (`fon()`).
- **Tugma (D4 B):** harakat — 2 daraja (194: `QTugma`, `QTugma ikkinchi`); **javob-chip** (`QChip`) — alohida tur, faqat javob tanlashda, harakat tugmasi o'rnida ishlatilmaydi.
- **Emoji (D2 A):** 196 butun 7–14-M ga (qolipsiz 7–8-M ham, Yakun bilan birga o'tkazilganda). Faqat o'yin qatlami: nishon, podium, arena, bayram.

## 4. `src/qolip` ga o'zgarishlar ro'yxati (RELIZDAN KEYIN)

1. Har oila uchun karkas-komponent (`QEkran oila="kirish|tushuncha|mashq|test|yakun"`) — sarlavha, mentor va tugma zonalari bir joyda.
2. `QTushuncha`: «ochish» rejimi o'chiriladi — asosiy matn har doim ko'rinadi; harakat faqat vizual/natijani o'zgartiradi.
3. `QBlok`: qadam matni ≤ 2 qator, kutilgan natija alohida qator (173 bilan).
4. `QChip` — javob-chip turi aniq nomlanadi (D4 B), tugma sifatida ishlatilsa — darvoza xatosi.
5. `qolipCss`: shrift o'lchamlari 4 tokenga (sarlavha · matn · yorliq · kod); `hw-big-wrap::before` nur olinadi (207.7).
6. 7–8-Modul (25 dars) qolipga o'tkaziladi — Yakun (F-1015-112) bilan bir vaqtda.

## 5. Darvoza (yangi): `lint:ekran`

- Asos: 0-bosqich skripti `tadqiqot/ekran-olchov.mjs` (lokal vite, har ekran, boshlang'ich holat).
- O'lchaydi: so'z · matn bloki · mayda yozuv · xil rang · shrift o'lchami · emoji (lint-emoji WHITELIST bilan, o'yin qatlami chiqarilgan) — oila byudjetiga solishtiradi.
- Ishlatish: modul yopishda (`modul:yopish`), `npm run gates` ga emas (vite kerak, sekin — layout-lint naqshi).
- **Tuzatilgan sabog'i (0-bosqich):** birinchi o'lchov ✓ ⛶ kabi tugma-belgilarni emoji deb sanagan — darvoza lint-emoji'ning `WHITELIST` va `\p{Extended_Pictographic}` qoidasidan foydalanadi.

## 6. Pilot (2-bosqich): m7-01 «Loyihangiz kimga kerak?»

1. MD v3 qayta yoziladi (konveyer `konveyer/1-MD.md`): har ekran oilasi va byudjeti yoziladi; «bos → matn» joylari ajratiladi.
2. GATE M (foydalanuvchi) → qurish (relizdan keyin, qolip o'zgargach) → `lint:ekran` 0 xato → QA ko'rigi.
3. Oldin/keyin o'lchovi taqqoslash sahifasida.

## 7. Ochiq savollar (1-bosqich davomida)

- Byudjet raqamlari — xomaki (0-bosqich taklifi). Pilotda tekshiriladi, kerak bo'lsa o'zgaradi.
- Brilliant/Codecademy/Khan suratlari — foydalanuvchi akkaunti bo'lsa, `TADQIQOT-0.md` jadvali yangilanadi.
