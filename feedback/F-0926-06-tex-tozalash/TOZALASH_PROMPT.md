# TOZALASH_PROMPT — texnik dars (F-0926-06)

Sen bitta texnik darslik faylini tozalaysan. Nishon: **faqat bitta fayl** — `{FAYL}`.
Qonun: `DARS_ETALON.md` **159-qonun** (12-V bo'lim, 1–17-band) va **160-qonun** (12-W) — avval shu ikki bo'limni o'qi. Matn yozsang — `MATN_KORPUS.md` §214–§217 (grep bilan). Boshqa hujjatni o'qima.
Codemodlar allaqachon yurgan (stripe, qora tugma, frame-dash, ⛶, ico, ui-clean, taskspec) — ularni QAYTA yurgizma.

## Kirish
- `{AUDIT}/audit.json` — page-audit topilmalari (INP · ALIGN · DUP · LOUD · SCROLL · ZBTN · EQH · LOOSE). DUP va LOOSE — faqat NOMZOD.
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

14. **Vizual + izoh bitta kartada** (160-qonun, 12-W — O'QI): yorliq + rasm/oyna + tagidagi izoh (yoki oyna + izoh) sahifa
    fonida sochilib tursa → bitta `.vis-card` (paper, 16px radius, bitta soya, 12px gap; ichki vizual soyasiz `0 0 0 1px`).
    Izohsiz yolg'iz ustun-yorlig'i QOLADI. Chip/tugmalar kartadan TASHQARIDA. audit.json `loose` — nomzod, ko'z bilan.
    O'ragach qo'shni ustun tekisligini qayta o'lcha (ko'rinmas yorliq-nusxa keraksiz bo'lib qolishi mumkin).

## 1-Modul qarorlari — NAMUNA (foydalanuvchi 27.09 tasdiqlagan; shunga o'xshash joyda SAVOL BERMA, shunday qil)
- Mentor «tanlang» degan bo'lsa — variantlar ustidagi «Sizningcha qaysi biri?» yorlig'i olinadi (G1).
- Hamma qadam ✓ bo'lgach «🎉 Hamma qadam bajarildi» yozuvi olinadi — qatorlarning o'zi yashil (G2).
- Tanlangan element: ✅ + yumshoq yashil fon; qo'shimcha yashil ramka va «tanlandi» yorlig'i olinadi (G3).
- Mentor N ta ishni sanasa va yonida shu ishlar ro'yxati tursa — ro'yxat qoladi (yangi ma'lumot bor), mentor qisqaradi (H1).
- Tugmadagi «0/3 ko'rilgan» sanog'i QOLADI (yo'l ko'rsatadi) — sarlavhadagi sanoq olinadi (H2).
- Karta/zona sarlavhasi va tugma matni oldidagi emoji olinadi (H3, C1).
- Bo'sh oynadagi «Javobni tanlang — … chiqadi» yo'rig'i olinadi (P1).
- Bosiladigan, lekin hali bosilmagan qator xira (opacity) bo'lmaydi — to'liq ko'rinadi, bajarilgani ✓ + yumshoq fon (P2).
- Ikki joy bir-biriga zid bo'lsa (mentor «platformaga», ro'yxat «mentorga») — mentor/platforma to'g'ri, ikkinchisi moslanadi (D2).
- ⚠️ «vaqtincha» kabi ogohlantirish qutisi mentor gapini takrorlasa — quti olinadi, yangi qismi mentorga qo'shiladi (C3).
- Ustunlar tekis tursin deb qo'yilgan ko'rinmas yorliq-nusxa (visibility:hidden) — ruxsat (HP1).
- O'quvchi haqida «kasbingiz» emas — «yo'nalishingiz» (KORPUS §214).
- Bir va'da («keyingi darsda … qilamiz») faqat kirishda va yakunda (HP3).
- Mentor/VAZIFA aytgan ishni kartadagi teg-izohlari takrorlasa — faqat teg-chiplar qoladi (T1).
- Bayram oynasi chiqqan ekranda mentor nishonni qayta eslatmaydi (T3).
- Asosiy harakat tugmasi accent; to'liq yashil tugma yo'q — yashil faqat bajarilgan holat (V1).
- Javobni aytadigan maslahat o'rniga — QAYERGA qarashni aytadigan maslahat (V2, KORPUS §217).
- Kirish-savolida ham noto'g'ri variantga «To'g'ri…» deyilmaydi — «Aslida …» (I2, KORPUS §215).
- Natija ikki joyda («✓ … endi to'g'ri!» + natija-karta) — bittasi qoladi (I3).
- Birinchi darsdagi qisqa «Asosiy: …» xulosasi va teg nomlarini beradigan xulosa QOLADI (I1, E3).
- Oldindan to'ldirilgan maydon: nomi maydon ICHIDA, chap boshida (`.name-fld` naqshi, Htmllesson1 s3) (E5).

## 2-Modul qarorlari (foydalanuvchi 27.09 kech) — shunday qil, SAVOL BERMA
- **Baholanadigan testda** sudrab-joylash kataklari ichidagi maslahat javobga ishora qilsa — maslahat OLINADI, faqat raqam qoladi (S6).
- **Baholanadigan test (SCREEN_META `scored: true`) — S6 kengaytmasi (3-Modul):** mentor gapi, placeholder YOKI holat-teglari (tagpill:
  «1 `<GameCard` · 2 `name={g}` · 3 `/>`») javobning KOD BO'LAGINI aytsa — kod olinadi, faqat TAVSIF qoladi («komponent — Katta harf»,
  «fe'l — katta harf, qo'shtirnoqda»), placeholder `…` / `<… />`. ✓-holat mexanikasi qoladi. Yo'naltirilgan (baholanmaydigan) mashqda — qoladi.
- Xavfli amal tugmasi («Ha, o'chirilsin» — DELETE) qizil QOLADI (ma'no rangi, V1 ga kirmaydi).
- **Ruscha rejimda ko'rsatiladigan kod oynalari (S7):** `//` izohlari va holat-satrlari (`"yorug'"`, `"yangi"`) `tr({uz,ru})` bilan ruscha;
  kodda chiqadigan xabar sayt-maketi ko'rsatadigan matn bilan BIR XIL. O'zgaruvchi/funksiya NOMLARI (`tugma`, `matn`, `xato`) va
  o'quvchi yozadigan mashq topshirig'i/tekshiruvi (`checks`, `C.domAfterClick` qidiradigan so'z) O'ZGARMAYDI.
- Kod-komponent nomlari (`<Tugma />`, `function Sayt()`) — ru-walk «qoldiq» desa ham — nom, tegilmaydi.
- Kod ichidagi «jon kiritish» JS darslarida to'g'ri (lint istisnosi bor). LMS katalog nomi (`LESSON_META.lessonTitle`) O'ZGARTIRILMAYDI.
- `npm run gates` endi **7/7** (`undef` qo'shildi). PM fayllariga (`Pm*.jsx`, `*.homework.jsx`) TEGILMAYDI.

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
`npm run gates -- {FAYL}` 7/7 · `npm run lint:jsx` TOZA · `node lint-dizayn.mjs {FAYL}` 0 🔴 ·
`python3 feedback/F-0926-06-tex-tozalash/keytok.py {FAYL}` = `KALIT_OLDIN.txt` dagi qiymat (farq bo'lsa — ishni o'zing qaytar).
**Layout (MAJBURIY, 27.09 sabog'i):** `npm run lint:layout -- --keys {KALIT} --lang uz` va `--lang ru` (vite 5300 da ishlab turibdi) —
«PASTKI CHIZIQDAN TUSHGAN (E)» bo'limida sening darsingdan 0 holat bo'lsin («O'QUVCHI OCHGAN PANEL» va «YAKUN EKRANI» — sanalmaydi;
`ach-coll` · `gloss` — umumiy qarz F-0923-01, tegma). page-audit SCROLL bu holatlarni KO'RMAYDI (1-Modulda 7 ta o'tib ketgan).
Tuzatish tartibi: blok qo'shni ustunda bo'sh joy bo'lsa — o'sha yerga; lekin KO'CHIRGACH QAYTA O'LCHA (VsCode s10: o'ngga ko'chirish
6px → 32px yomonlashtirdi, qaytarildi); keyin ixchamlash (line-height 1.42, padding, rasm max-height); matn qisqartirish — oxirida.
Byudjet: ≤80 tool-chaqiriq; faylni butunicha qayta-qayta o'qima — kerakli qatorlarni grep bilan top.

## Hisobot (qisqa, shu shaklda)
- Ekran bo'yicha: `sNN — nima edi → nima qilindi` (file:line).
- Qoldirilganlar va SABABI (masalan: ma'noli dashed, foydalanuvchi qarori izohi bor).
- **Qaror kerak** (didga oid, qoida aniq javob bermaydi) — alohida ro'yxat, har biri bitta savol.
