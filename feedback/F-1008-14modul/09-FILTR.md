# 9-dars «Video-portfolio: 3 daqiqada o'zingiz va mahsulot» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-567)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-09/`. Skript: scratchpad `f09_tuzat.py` (80 juftlik, har biri faylda aynan bir marta — skript tekshirgan; 10 MD da 7 o'qish nomi).
Audit bahosi 6.5/10 (uch «blocker»: login chatda, `bor` ovozsiz ham «tayyor», `maxfiyYoq` nomi). Hukm: **Qabul 29 · Qisman 1 · Rad 4 · Allaqachon 15** (49 band + sarlavha + 16 TS + 8 savol + 10 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) 2-ekran kartalaridagi 0:20 · 1:50 · 0:50 (TS2, GATE M A) olindi — o'quvchi talabi faqat jami 3 daqiqa, Mentor rejasi A1 Yordamida; (b) namuna akkauntni 9-darsda agent ochish yo'li (TS7) olindi — 6-darsdan, darsdan oldin tekshiriladi; (c) `pm-m12d9-video` sxemasi: `bolaklar` nomlari, `tekshiruv.ovozBor`, `maxfiyNarsaYoq`, `vaqt` (tayanch 8, 1.9 oxirgi qatori); (d) «kalit almashtirish shart emas» (TS11) teskari; (e) Mentor «Qanday ishlayman» gapi qayta yozildi (TS1); (f) ta'rif «3 daqiqalik» → «3 daqiqagacha, bu kursda» (tayanch 2 matni o'zgarmadi — dars nomida «3 daqiqada» qoldi).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Agent prompti «Loginini ayt» — login chatga | **Qabul** | Prompt butunlay olindi (16-band bilan): namuna akkaunt 6-darsdan; `NAMUNA_PROMPT` yo'q. 9.71. |
| 2 | `bor === true` ovozsiz ham «tayyor» — ovoz holati saqlanmaydi | **Qabul** | `tekshiruv.ovozBor` (A2 4-qadam, kalitda); «tayyor» = `bor` va `ovozBor`, `maxfiyNarsaYoq`, `sigdi` uchalasi `true` — A3 xulosa, yakun 1–2-holat, KOD 8, sinf 5. 9.72. |
| 3 | `maxfiyYoq` nomi ikki ma'noli | **Qabul** | → `maxfiyNarsaYoq` (o'quvchi so'zi bilan bir) — A-12, A3, KOD 9, tayanch 8. 9.72. |
| 4 | Ta'rif «3 daqiqalik» — absolyut xususiyat | **Qabul** | → «Bu kursda video-portfolio — o'zingiz va mahsulotingiz haqidagi 3 daqiqagacha video.» — A-5, 2-ekran `QIzoh`, yakun 1, kartochka 1, arena 1 ✔ («Siz va mahsulot haqida 3 daqiqagacha video», 42 — yolg'iz eng uzun emas). 9.74. |
| 5 | 0:20 + 1:50 + 0:50 — tayanchda yo'q, o'quvchi normasiga aylanadi | **Qabul** | 2-ekran kartalarida vaqt soni yo'q; chiziq — nisbat (kichik · katta · kichik); 6/6 da nomlar sonsiz; Mentorning boshlang'ich rejasi faqat A1 o'ng va Yordam («namuna, talab emas»); A-4, A-6, O'qituvchi eslatmasi, ✎, KOD 4. TS2 RAD. 9.74. |
| 6 | Ro'yxat kartasi vaqt sabab rad qilinmasin — odam va lahza yo'q | **Qabul** | `QXato` → «Bu funksiyalar ro'yxati — odam va bitta lahza yo'q.»; vizualda «ro'yxat — odam va lahza yo'q» yorlig'i (3:00 dan oshish vizuali olindi). 9.74. |
| 7 | Ssenariy kaliti — video transkripti emas (ism videoda bo'lishi mumkin) | **Qabul** | A1 ✎ va A-12 shartnomasi. 9.72. |
| 8 | `bolaklar.kim` ↔ `pm-m12d2-hikoya.kim` to'qnashuvi | **Qabul** | → `kimman`, `nimaQurdim`, `qandayIshlayman` — A-12, KOD 4, tayanch 8; **10 MD o'qishlari** (`bolaklar.kimman`, `.nimaQurdim` — 7 joy) yangilandi. TS4. 9.72. |
| 9 | Video vaqti soniya sifatida saqlansin | **Qabul** | A3 3-qadam: m:ss yoziladi → `tekshiruv.vaqt` (soniya); `sigdi` — `vaqt` dan (≤ 180). 9.72. |
| 10 | `bor: false` sababini yo'qotadi — blocker emas | Allaqachon | Sabab saqlanmaydi (maxfiylik) — A-12 da aytildi. |
| 11 | «Hech qayerga ketmagan → kalit almashtirish shart emas» — RAD | **Qabul** | A3 2-qadam qalin qator: haqiqiy kalit/token tushsa — o'chirish + Mentorga aytish, yangilash kerakligi birga tekshiriladi; O'qituvchi eslatmasi, ✎, kartochka 10 izohi, TS11 RAD. 9.73. |
| 12 | 5 qator — hamma maxfiylik emas; umumiy qator | **Qabul** | A3 6-qator: «Yana sizga yoki boshqa odamga tegishli shaxsiy narsa (xabarnoma, fayl nomi, profil rasmi)»; `MAXFIY_ROYXAT` izohi, A-4, sinf 7. 9.73. |
| 13 | «Buni ko'rsatsa bo'ladi» — umumiy ruxsatga aylanadi | **Qabul** | → «Muammo bu joy emas — shaxsiy yoki maxfiy ma'lumot qayerda?» (58). |
| 14 | «`git status` da ko'rinmadi = tashqarida» har doim rost emas | **Qabul** | A2 3-qadam: «ko'rinsa — joyi noto'g'ri; ko'rinmasligi yolg'iz isbot emas — papkani o'zingiz ko'ring»; TS12. |
| 15 | `.env` — «status'da ko'rinmasin» → tracked check | **Rad** | 13-Modul 9.41 (03/06/07/08-FILTR bilan bir); bu darsda repo o'zgarmaydi. |
| 16 | Namuna akkaunt yaratish — video darsining doirasidan tashqari, preflight | **Qabul** | A2 1-qadam prompti olindi; darsdan oldin 6-darsdagi namuna akkaunt tekshiriladi (1-ekran O'qituvchi eslatmasi); yo'q bo'lsa — Mentor yordami yoki B reja videosi; A-5, A-8, ✎, sinf 10, KOD 4, 8. TS7 RAD. 9.71. |
| 17 | Agent qolsa — namuna sanoq/xabarlardan ajratilsin | Allaqachon (16 bilan) | 6-dars namuna akkaunti — 9.59 darvozasi. |
| 18 | Ikkinchi qurilma videoda yo'q — QAT'IY QABUL; «qisqartirilgan demo» so'zi | **Qabul** | A1 2-qadam: «video uchun qisqartirilgan demo, butun demo ssenariysi emas». TS8. |
| 19 | Mentor «Qanday ishlayman» — uzr emas, ustuvorlik | **Qabul** | → «Avval odam yig'ish muammosini hal qildim; maydon pulini bo'lishishni keyinga qoldirdim, chunki asosiy muammo shu edi.» (A-4, TS1); A1 O'qituvchi eslatmasi savoli. |
| 20 | «Qanday ishlayman» regex — soft only | Allaqachon | Yumshoq; «sabab so'zi shart» o'rgatilmaydi. |
| 21 | «maktab» so'zi detektorda — to'g'ri gaplarni ushlaydi | **Qabul** | «maktab» tekshirilmaydi; xabar → «Maktabingizning nomi yoki aloqa ma'lumoti bo'lmasin.»; KOD 7, Shubhali 10, kartochka 2. 9.74. |
| 22 | 7+ raqam — kurs bo'yi bir xil | **Qabul** | «+998», «@», «t.me/» — bloklaydi («Ssenariyga telefon, akkaunt va havola yozilmaydi.»); 7+ raqam — yumshoq. |
| 23 | Reja sarlavhasi — natija va'dasi | **Rad** | P-014 (01–08 bilan bir); «RAD etilganlar» ro'yxati — rad etilgan tashqi takliflar, ziddiyat emas. |
| 24 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067. |
| 25 | «Yuzsiz videoga kamroq ishonishadi» — tekshirilmagan da'vo | **Qabul** | → «Ha — mahsulotni tushuntirishga yuzim kerak» (41). 9.74. |
| 26 | «Adashsangiz — gapni qaytadan ayting» | **Qabul** | → «Kichik adashishda davom eting; gap ma'nosi buzilsa va vaqt bo'lsa — boshidan qayta yozing.» |
| 27, 28 | Qayta yozishda eski `bor` va tekshiruvlar qolib ketadi | **Qabul** | «Qayta yozish» bosilgan zahoti `bor: null`, `tekshiruv` to'rt maydoni `null` — A-12 (qat'iy), A3 2-qadam, KOD 9, tayanch 8. 9.72. |
| 29 | Self Review — «video safe» demasin | Allaqachon | Tavsif «Videongizni o'zingiz ko'rib tekshirdingiz». |
| 30–32 | Rozilik yo'q = to'liq natija · fayl mavjudligi self-report · xizmat nomi yo'q | Allaqachon | O'zgarishsiz. |
| 33 | `havola: bool` qo'shilmasin | Allaqachon | Qo'shilmadi (TS3 belgisi); 10-dars faqat `bor` ni o'qiydi. |
| 34, 35 | Rozilik holati saqlanmaydi · kamera — rozilik bilan | Allaqachon | O'zgarishsiz. |
| 36 | Ovozda ism — ixtiyoriy edi, xato emas | **Qabul** | A3 5-qator izohi. |
| 37 | Login — «shaxsiy login va parol maydoni» | **Qabul** | 5-ekran 2-kadr yorlig'i, A-4, A3 2-qator. |
| 38, 39 | Oldindan kirish · Mentor video pilot | Allaqachon | O'zgarishsiz. |
| 40 | 90 daqiqa — 120–170 | Qisman | ⛔ Shubhali 1 ga auditor bahosi; pilotda o'lchanadi. |
| 41 | Vaqt tugasa ham maxfiy video qolmasin | **Qabul** | A3 Ulgurmasangiz: o'chirish, «Qayta yozish» (`bor: null`), yubormaslik; Shubhali 1. 9.73. |
| 42 | Fayl hajmi — sonsiz preflight | Allaqachon | O'zgarishsiz. |
| 43 | Telefon yozuvi — «Mentordan yordam» zaxirasi | **Qabul** | A2 2-qadam: «u ham bo'lmasa — Mentordan yordam so'rang (⛔ pilot)». TS13. |
| 44, 45 | Render 15/1 daqiqa — o'quvchi matnidan; «demo tayyor» xatti-harakat | **Qabul** | A2 1-qadam: «demo yo'lini bir marta oching va ro'yxat chiqqanini ko'ring»; A-6 sonlar ro'yxatidan olindi (manba izohi qoldi). 9.71. |
| 46–49 | 4-test · 7-test · agent distraktori · «repo'ga qo'shilmaydi» | Allaqachon | O'zgarishsiz. |
| S | Sarlavhalar: asosiy QAT'IY QABUL; Reja → savol | **Rad** | 23-band. |
| TS | 1 ✓ (+19) · 2 → 5 (RAD) · 3 ✓ (+2, 33) · 4 → 8 · 5 ✓ · 6 ✓ · 7 → 16 (RAD) · 8 ✓ (+18) · 9 ✓ · 10 ✓ (+12) · 11 → 11 (RAD) · 12 → 14 · 13 → 43 · 14 ✓ · 15 ✓ · 16 ✓ | | Savollar 17–24: 17 → 2 · 18 → 27, 28 · 19 → 3 · 20 → 11 · 21 → 16 · 22 → 5 · 23 → 9 · 24 → 41. |

**10 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ · 9 ✓ · 10 Qisman (⛔ pilotda o'lchanadi).

O'lchov bo'limi — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (ta'rif 85, 2-karta `QXato` 52, A1 oshdi 77, hook variant 41, «Kimman» xabarlari 50 / 55, 5-ekran `QXato` 58, arena 1 ✔ 42).

## Sinf-supurish (13 MD + tayanch, grep)
- **`pm-m12d9-video` o'quvchilari** — 10 MD: `bolaklar.kimman`, `.nimaQurdim`, `bor` (7 joy yangilandi — 10-dars auditida qayta ko'riladi); 11, 12, 13 — o'qimaydi.
- **Agent prompti «Loginini ayt»** — 06, 07 (tuzatilgan), 09 (olindi); boshqa MD larda yo'q. 9.58 uch darsni qamraydi.
- **«kalit almashtirish shart emas»** — faqat 09 da edi (grep: 0 boshqa MD).
- **Render 15 / 1 daqiqa o'quvchi matnida** — 06, 07 (Backend uyg'otish darsning o'z mavzusi — qoldi), 08 (olingan), 09 (olindi).
- **Vaqt bo'laklari normasi** — 08 (reja chizig'i «reja», 08-FILTR 1), 09 (Mentor rejasi faqat Yordam); 13 — hakam varag'ida vaqt — 13 auditida.
- **«Qaytadan / qayta yozish» eski tekshiruvni bekor qilishi** — 06 (qayta o'tish — natija oxirgisi, 06-FILTR 38), 07 (`otishlar` — oxirgisi), 08 (Five Minutes! — oxirgi urinish), 09 (hammasi `null`) — bir naqsh.

## Tekshiruv
`lint:til` 09, 10, tayanch — TOZA / 0 error · `mdtekshir.py` 09, 10 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
