# 10-dars «Birinchi buyurtmani qayerdan topasiz?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-568)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-10/`. Skript: scratchpad `f10_tuzat.py` (75 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 6.5/10 (ikki asosiy: «ikki kompaniyaga xat» — kompaniya tanlanmagan; «javob kelmasa qayta yozmang» — umumiy normadek). Hukm: **Qabul 30 · Qisman 1 · Rad 3 · Allaqachon 18** (52 band + sarlavha + 16 TS + 8 savol + 10 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) tayanch 1.10 «Ikki kompaniyaga stajirovka xati» → «ikki xil kompaniya turi uchun ikki xat qoralamasi» (dastur qatori «2 kompaniyaga xat» — natija nomi aniqlashtirildi, 1-band); (b) tayanch 2 «frilans — buyurtma bilan ishlash» → «mustaqil, buyurtma bilan ishlash» (44-band); (c) `pm-m12d10-ish` dan `yuborildi` olindi (TS5), 9-dars importi `tekshiruv` bilan (tayanch 8); (d) Mentor rejasi «Qachon» — «shu hafta» → «keyingi mashg'ulotdan keyin» (TS1), «aniq kun» ta'rifi → «qaysi payt» (27, 28); (e) 8-ekran savoli (bir hafta) va B varianti (o'nta) o'zgardi; (f) 7-ekran `optionalLive` olindi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Ikki kompaniyaga xat» — kompaniya tanlanmaydi, xat yuborilmaydi | **Qabul** | Tur, A-1, 7-ekran 3-qism Mentori, tayanch 1.10: «ikki xil kompaniya turi uchun ikki xat qoralamasi; kompaniyaning o'zi uyda tanlanadi». 1-ekran «ikki xat yozasiz», 7-ekran sarlavhasi va yakun «ikki xat yozildi» — rost (xat qoralamasi yozildi), qoldi. 9.75. |
| 2 | Two Letters! «ikki kompaniyaga yozdingiz» demasin | **Qabul** | → «Ikki xil kompaniya uchun ikkita xat yozdingiz» (44). 9.75. |
| 3 | 8-ekran «bir hafta» — tayanchdan tashqari muddat | **Qabul** | → «Kompaniya xatingizga javob bermadi. Bu kursda nima qilasiz?» (8 so'z). 9.76. |
| 4 | «Javob kelmasa — qayta yozilmaydi» umumiy biznes qoidasi emas | **Qabul** | «Bu kursda» scope: 6-ekran `QIzoh`, 8-ekran to'g'ri izohi, «Endi siz bilasiz» 5, kartochka 11, takrorlash 8, A-10, O'qituvchi eslatmasi (kattalar hayotida bir marta muloyim eslatish — o'rgatilmaydi), 8-ekran Izohi. 9.76. |
| 5 | A «har kuni» — aniq bosim; savol kurs-specific bo'lsa yetadi | Allaqachon | 3, 4-band bilan. |
| 6 | B «o'nta kompaniya» — yangi son | **Qabul** | → «Shu xatni ko'p kompaniyaga bir xil yuboraman» (45; ✔ D 43 — yolg'iz eng uzun emas). 6-ekran bashorati «Bittaga · Beshtaga · O'ntaga» — shkala, da'vo emas (S-015), qoldi. |
| 7 | «spam» so'zi kerak emas | **Qabul** | → «Bir xil xatni ko'p joyga yuborish to'g'rimi?»; A-5 «Ishlatilmaydi»; Izoh. TS16. 9.76. |
| 8 | «Alohida xat» = alohida nusxa, chuqur moslash emas | **Qabul** | 7-ekran 2-xat kartasida kulrang: «Kimman va Nima qurdim o'sha bo'lishi mumkin; kompaniya turi va so'rovni moslang — har kompaniya uchun alohida nusxa». TS14. 9.75. |
| 9 | 2-xat 1-xatdan ko'chirilishi — QABUL, qoidani aniq ayting | **Qabul** | 8-band bilan. |
| 10 | Mentor xatida «51 foydalanuvchi» — manba bilan sync | Allaqachon | 1-dars pitchi (tayanch 1.1 aynan) — «51 foydalanuvchi»; 8-dars javobi «ro'yxatdan o'tgan hisoblar» deb aniqlashtiradi; xat pitch so'zini saqlaydi. |
| 11 | Xatda son majburiy bo'lmasin — manbasi bo'lsa | **Qabul** | 6-ekran `QIzoh` «va, manbasi bo'lsa, bitta son»; 7-ekran ② placeholder; arena 11 ✔ «Mahsulot va u nima qilishi»; O'qituvchi eslatmasi savoli. 9.77. |
| 12 | Mentor misolidagi son majburiydek ko'rinmasin — UI da aniq | **Qabul** | 6-ekran qator ostida kulrang: «Mentor misolida son bor; sizda manbali son bo'lsa yoziladi, bo'lmasa — yo'q.» 9.77. |
| 13 | 7+ raqam hard block — kurs bo'yi: +998/@/t.me hard, uzun son soft | **Qabul** | Reja ① ③ va xat tekshiruvlari ikkiga bo'lindi; KOD 6. 9.78. |
| 14 | «@» yolg'iz — soxta signal, pilot | Allaqachon (⛔) | Xat tekshiruviga ⛔ izoh. |
| 15 | Xat matni kalitda — Mentor statistikasi raw matnni ko'rmaydi | Allaqachon | A-10, 7-ekran Mentor rejimi. |
| 16 | `savedAt` → `updatedAt` / `completedAt` | **Rad** | Kurs qolipi (02/05/08-FILTR); A-14 «oxirgi o'zgarish vaqti» deb muhrlandi. |
| 17 | `yuborildi` — o'lik maydon | **Qabul** | Olindi (A-14, 7-ekran saqlash, KOD 7, sinf 3, tayanch 8); 12-dars `xatlar.length` ni o'qiydi — ta'sir yo'q. TS5 RAD. 9.78. |
| 18 | 9-dars sxemasi bilan import yangilansin | Allaqachon | 09-FILTR 8 da `kimman`, `nimaQurdim` yangilangan edi; TS7 belgisi. |
| 19 | Havola eslatmasi — faqat tekshiruvdan o'tgan video uchun | **Qabul** | `bor === true` va `tekshiruv.ovozBor/maxfiyNarsaYoq/sigdi` uchalasi `true` — A-14, 7-ekran Kirish, KOD 6, tayanch 8 (10 o'qiydi). 9.78. |
| 20 | Havola bo'lmasa ham xat to'liq | Allaqachon | 7-ekran Kirish qatoriga yozildi. |
| 21 | «Profil faqat o'z nomingizdan» — kurs qoidasi sifatida | **Qabul** | 2-ekran kulrang: «Bu kursda qoida: boshqa odam nomidan profil ochmang — faqat o'z nomingizdan.»; takrorlash 3-3. |
| 22, 23 | Darsda ro'yxat yo'q · «tanish doira» oddiy ibora | Allaqachon | O'zgarishsiz. TS11 ✓. |
| 24 | «Hali qilmagan ishni olmaydi» — absolyut | **Qabul** | 4-ekran O'qituvchi eslatmasi → «Bu kursda birinchi buyurtma uchun oldin qilganingizga o'xshash ish tanlanadi». |
| 25 | 5-ekran C «3D o'yin» — o'quvchi o'yin qurgan bo'lishi mumkin | **Qabul** | → «Tanish do'kon · qilmagan ish · shanba, ota-onam bilan» (53; o'rtachadan 8%); A-7, Izoh, Shubhali. 9.77. |
| 26 | 5-ekran savoli — kurs qoidasini tekshiradi | **Qabul** | → «Sinfdoshlaringiz buyurtma rejasini yozdi. Qaysi biri bu kurs qoidasiga mos?» |
| 27, 28 | «Qachon — aniq kun» ↔ Mentor «shu hafta» ziddiyati; nisbiy sana | **Qabul** | Mentor → «keyingi mashg'ulotdan keyin — ota-onam bilan» (A-6, 4-ekran, Yordam, arena 10 ✔, TS1); ta'rif → «qaysi paytda gaplashasiz» (`QIzoh`, 5-ekran izohlari, placeholder, tekshiruv xabari, takrorlash 5, O'qituvchi eslatmasi). 9.77. |
| 29 | «Bepul yoki pul — o'quvchi va ota-ona qarori» — soddalashtirmasin | **Qabul** | → «real kelishuv ota-ona bilan bo'ladi, darsda so'm aytilmaydi». |
| 30–34 | Stajirovka «bormi?» · «qanday qatnashsam» · maslahat · so'rovlar erkin · kompaniya nomi saqlanmaydi | Allaqachon | O'zgarishsiz. |
| 35 | Rasmiy aloqa manzilini topish — ixtiyoriy | Allaqachon | Uyga ③ «Xohlasangiz» (37 bilan yorliq). |
| 36 | Uyga ① — qolgan 2-xat | Allaqachon | O'zgarishsiz. |
| 37 | Yuborish — «ixtiyoriy» yorlig'i bilan | **Qabul** | ③ «Ixtiyoriy: …» (rasmiy aloqa manzili ham shu bandda). |
| 38, 39 | Kattalar-xabardorlik belgisi kerak emas · uchrashuv qatori | Allaqachon | TS13 ✓. |
| 40 | Reja sarlavhasi — auditor QABUL | Allaqachon | O'zgarishsiz. |
| 41, 42 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067. |
| 43 | 2-ekran bashorati «ikkita» — QABUL | Allaqachon | O'zgarishsiz. |
| 44 | Frilans ta'rifi juda keng | **Qabul** | → «Mustaqil, buyurtma bilan ishlash frilans deyiladi» — A-4, 2-ekran `QIzoh`, kartochka 4, tayanch 2. 9.77. |
| 45–48 | buyurtmachi · stajirovka · Nusxalash zaxirasi · Two Letters sharti | Allaqachon | O'zgarishsiz. |
| 49 | One Ask! — strukturali fakt | **Qabul** | Shart: ikkala xatda bitta so'rov tanlangan; tavsif «Ikki xatda bittadan so'rov tanladingiz» (38); matn sifatiga bog'lanmaydi. 9.78. |
| 50 | 90 daqiqa — 100–125 | Qisman | ⛔ A-13 ga auditor bahosi; pilotda o'lchanadi. |
| 51 | 7-ekran `optionalLive` — markaziy artefakt | **Qabul** | Olindi: kamida reja va 1-xat darsda, 2-xat uyga ①; arena/kartochkalar vaqt qolsa (A-13, sinf 1). 9.78. |
| 52 | Yakun holatlari — saqlang | Allaqachon | O'zgarishsiz. |
| S | Sarlavhalar: asosiy QAT'IY QABUL; «ikki kompaniyaga xat» farqi | **Qabul** | 1-band. |
| TS | 1 ✓ (+27) · 2 ✓ (10) · 3 ✓ · 4 ✓ · 5 → 17 (olindi) · 6 ✓ · 7 → 18 · 8 ✓ · 9 ✓ · 10 ✓ · 11 ✓ · 12 → 19 · 13 ✓ · 14 → 8, 9 · 15 ✓ · 16 → 7 | | Savollar 17–24: 17 → 1 · 18 → 4 · 19 → 3, 6 · 20 → 11 · 21 → 17 · 22 → 27 · 23 → 18 · 24 → 51. |

**10 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ · 9 ✓ (spam; hook — Rad, qonun) · 10 ✓ (`optionalLive` olindi; 90 daqiqa ⛔).

O'lchov bo'limi — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (8-ekran savol 8 so'z, B 45, to'g'ri izoh 58, xato izohi 44; 6-ekran `QIzoh` 89 / 95; 4-ekran `QIzoh` 70; 5-ekran C 53, to'g'ri izoh 55; frilans `QIzoh` 99; nishonlar 44 / 38).

## Sinf-supurish (13 MD + tayanch, grep)
- **«Javob kelmasa qayta yozilmaydi» umumiy norma** — faqat 10 (13-Modul 9-dars «bir marta» qoidasi — o'sha modul); 11 MD da «ariza qayta» yo'q.
- **`yuborildi`** — faqat 10 kalitida edi; 12 MD `xatlar.length` ni o'qiydi, `yuborildi` ni o'qimaydi (grep 0).
- **9-dars importi `bor` yolg'iz** — faqat 10; 12, 13 `pm-m12d9-video` ni o'qimaydi.
- **Nisbiy sana («shu hafta»)** — grep 13 MD: 12 MD da 2 joy (12-dars auditida ko'riladi); 13 MD da yo'q.
- **«spam»** — 10 (olindi), tayanch 1.10 (olindi); boshqa MD larda yo'q.
- **`optionalLive` markaziy ekranda** — 05, 08, 10 (olingan); 07 5-ekran (kutishlar) qoldi; 11 7-ekran — 11 auditida (auditor ham so'ragan).

## Tekshiruv
`lint:til` 10, tayanch — TOZA / 0 error · `mdtekshir.py` 10 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
