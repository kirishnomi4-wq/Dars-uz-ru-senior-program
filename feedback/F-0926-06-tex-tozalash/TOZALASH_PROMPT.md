# TOZALASH_PROMPT — texnik dars (F-0926-06)

Sen bitta texnik darslik faylini tozalaysan. Nishon: **faqat bitta fayl** — `{FAYL}`.
Qonun: `DARS_ETALON.md` **159-qonun** (12-V bo'lim, 1–15-band) — avval shu bo'limni o'qi, boshqa hujjatni o'qima.
Codemodlar allaqachon yurgan (stripe, qora tugma, frame-dash, ⛶, ico, ui-clean, taskspec) — ularni QAYTA yurgizma.

## Kirish
- `{AUDIT}/audit.json` — page-audit topilmalari (INP · ALIGN · DUP · LOUD · SCROLL · ZBTN). DUP — faqat NOMZOD.
- `{AUDIT}/sNN-0.png` (boshlang'ich) va `sNN-z.png` (bosishlardan keyin) — har ekranni KO'Z bilan ko'r.
- `node lint-dizayn.mjs {FAYL}` — qolgan 🟡 D3/D5/D6 joylari (file:line).

## Nima qilasan (159-qonun, foydalanuvchi so'zi bilan)
1. **Bir sahifada bir ma'no bir marta.** Mentor gapi bilan blok bir gapni aytsa — MENTOR qoladi, blok ketadi.
   Sarlavha ↔ ustun-yorlig'i, qadam-chipi ↔ karta sarlavhasi — bittasi qoladi. «3 tadan N tasi» sanog'i yo'q.
2. **Maydon yorlig'i placeholder ichida** — tepada HAM ichida HAM yozuv yo'q (istisno: oldindan to'lgan maydon).
3. **Bloklar tepasi bir chiziqda** (2–4 ustun, >6px farq nuqson). `margin-top:auto`/`justify-content:center` bilan
   pastga itarilgan ustun → `flex-start`. «Kod → natija» sxemasi tepadan, strelka `align-self:center`.
4. **Baland rang yo'q** — to'yingan to'liq fon → `…Soft` fon yoki halqa. Sudraladigan chip: oq fon +
   `border: 2px solid accent` + «⠿» (halqa box-shadow bilan EMAS — tap-hint uni o'chiradi).
5. **Test izohi qisqa** — «To'g'ri —» bilan boshlanmaydi, variantni qaytarmaydi. Joy so'zlari («pastda», «chapda»,
   «o'ngda») mentor gapida yo'q — telefonda joylashuv o'zgaradi.
6. **Hech narsa tugmalar orqasida qolmaydi — javobdan KEYIN ham** (1280×800). Tartib: yonma-yon → ixchamlash → matn qisqartirish.
   Oldingi foydalanuvchi qarori bilan turgan blok ko'chirilmaydi (izohda F-ID bo'lsa — tegma, savolga yoz).
7. **Cho'zilgan bo'sh quti yo'q** — `flex-grow`/`max-height` bilan ekranni to'ldirish, ichi bo'sh baland karta yo'q;
   blok mentor gapining shundoq ostida; Yordam havolasi o'z paneli ostida.
8. **Holat bir marta** — «✓ Bajarildi» tugmasidan keyin takror yashil yozuv/yashil ramka yo'q
   (tugma yo'q, kompilyator tasdiqlaydigan joyda `done-mini` QOLADI).
9. **Bo'sh-holat ramkasi yo'q**; ramkada faqat bitta boshlash-tugmasi qolsa — ramka olinadi.
10. **Tanlangan tugma ichidagi belgi xiralashmasin** — disabled tugmadagi `span`ning o'z `color`i bo'ladi.
11. Fleshkarta «bosing» yo'rig'i — faqat `InternetLesson` 1–3-karta.
12. **Yonma-yon qutilar bir balandlikda — imkon bo'lsa** (159/16): audit.json `eqh` nomzodlari. O'xshash juft — subgrid
    (`.split.eqh`, CssLesson1 s3 naqshi, faqat keng ekranda); holat o'zgarib biri baland bo'lsa — faqat boshlang'ich holatda;
    biri 2× baland bo'lsa — tegma (istisno, hisobotda yoz).
13. **Javobni oldindan aytadigan yozuv yo'q** (159/17): savol ekranida javobdan OLDIN ko'rinadigan yozuv javobni aytmasin.

## 3-bosqichdan qolgan ish (codemodlar yurgan, sen yakunlaysan)
- **dark darvozasi** (`npm run lint:dark -- {FAYL}`): qolgan qora elementlar. Ishlatiladigan qora tugma → accent (159/5);
  kod-oyna/kod-chip (`CODE.bg`, BOSILMAYDI) — `dark-lint.mjs` istisnosiga TEGMA, hisobotda «istisno kerak» deb yoz.
- **til darvozasi** (`node til-lint.mjs {FAYL}`): 🔴 topilmalar — `MATN_KORPUS.md` va lint tavsiyasi bo'yicha, **uz va ru juft**.
- **⛶ (ZBTN)**: 1–4c'da `codemod-zbtn-float` ishlamaydi. Ramka olingan ustunda ⛶ yolg'iz qolsa — faylning o'z `Zoomable`iga
  `off` prop (CssLesson1 naqshi: `({ children, off = false })`, `off` bo'lsa tugma chiqmaydi) va `<Zoomable off={…}>`.
- **frame-dash «QO'LDA»** joylari (`grep -an "frame-dash" {FAYL}`): 159/3 bo'yicha, chorlov mentor gapida borligini tekshir.

## Pilot saboqlari (CssLesson1)
- Umumiy nomli klass (`.hint`) boshqa komponentda ham bo'lishi mumkin (`dd-chip hint`) — CSS qoidasini o'chirishdan oldin grep.
- Ekran nomi: hisobotda **id** (`s15`) va **tartib raqami** (19-ekran) ikkalasi ham yozilsin — audit.json `s` = indeks, `id` = SCREEN_META id.
- ⛶ Zoomable: ramka olingach matnni yopsa — `off={…}` (birinchi bosishgacha yashirin).

## TEGILMAYDI (buzilsa — ish RAD)
INLINE_KEYS · set_quiz_keys · correct/correctIdx · answerKey · lessonId · SCREEN_META · checks · evalEquals ·
kod-namuna mantiqi · ekranlar soni/tartibi · umumiy fayllar (`src/compilator/*`, `src/live/*`, boshqa dars).
Matn o'zgarsa — **uz va ru juft**. O'zgaruvchi/state o'chirsang — fayl bo'yicha grep qil (boshqa joyda ishlatilishi mumkin;
esbuild buni TUTMAYDI, faqat ish vaqtida chiqadi). CSS izohiga backtik YOZILMAYDI. Har o'zgarishga `/* F-0926-06: … */` izoh.

## Yakunda (o'zing yurgizasan)
`npm run gates -- {FAYL}` 6/6 · `npm run lint:jsx` TOZA · `node lint-dizayn.mjs {FAYL}` 0 🔴 ·
`python3 feedback/F-0926-06-tex-tozalash/keytok.py {FAYL}` = `KALIT_OLDIN.txt` dagi qiymat (farq bo'lsa — ishni o'zing qaytar).
Byudjet: ≤80 tool-chaqiriq; faylni butunicha qayta-qayta o'qima — kerakli qatorlarni grep bilan top.

## Hisobot (qisqa, shu shaklda)
- Ekran bo'yicha: `sNN — nima edi → nima qilindi` (file:line).
- Qoldirilganlar va SABABI (masalan: ma'noli dashed, foydalanuvchi qarori izohi bor).
- **Qaror kerak** (didga oid, qoida aniq javob bermaydi) — alohida ro'yxat, har biri bitta savol.
