# 2-dars «Mahsulotingiz hikoyasini qanday aytasiz?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-560)

Filtr tartibi — `01-FILTR.md` dagidek (grep → fakt → qonun → GATE M → auditoriya). Zaxira: scratchpad `zaxira-02/` (hamma MD + tayanch). Skript: scratchpad `f02_tuzat.py` (63 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 7/10 (pedagogika 8.5 · hikoya 8 · continuity 8.5 · video xavfsizligi 5 · K19 6 · storage 7 · 90 daqiqa 4.5). Hukm: **Qabul 15 · Qisman 4 · Rad 3 · Allaqachon 5** (25 band + sarlavha + TS + 8 shart).
⚠️ **Tasdiqlangan matnni o'zgartiradigan Qabul (foydalanuvchiga alohida):** tayanch 1.2 «Raqamlar — shunday lahzalar nechta» (GATE M «T ✓») → «Raqamlar — hikoyadan tashqaridagi son; hikoya ikki bo'lakka tushadi» (3, 4-bandlar). Sabab: 51 — foydalanuvchilar soni, lahzalar soni emas (1.14 da bunday son yo'q); «kim → Raqamlar» vizuali yolg'on model (T-045).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Ota-ona roziligi — TS9 modulning o'z qoidasiga zid; darvoza kerak | **Qabul** | Haq: TAQIQLAR 1 «Video (9-dars, 2-dars): … ota-ona roziligi» — ikkala darsga; TS9 da men istisno yasagan edim (agent huquqi emas). 9-ekranga darvoza — **9-dars so'zlari bilan** (GATE M M-q7 A, T-014): «Ota-onam rozi» · «Hali gaplashmadim»; «Hali gaplashmadim» → taymer bilan ovoz chiqarib aytish, tugma «Aytdim», `video.yozildi: false` — tugagan ish; tanlov kalitga yozilmaydi (sessiya), sanalmaydi. «vasiy» so'zi olinmadi — 9-dars bilan bir so'z. Mentor gapi, A-10, A-13, O'qituvchi eslatmasi, KOD 7, o'z tekshiruvi 9. Tayanch 9.32. |
| 2 | 0-ekran «Aynan!» / «Qiziq fikr!» olib tashlansin | **Rad** | T-028, T-067, tayanch 7 (202) — `01-FILTR.md` 3-qism 1 bilan bir; «RAD etilganlar saqlangan» — ziddiyat emas, oldingi auditlarda rad etilgan sinflar ro'yxati. |
| 3 | «Kim → Raqamlar» uchishi — noto'g'ri model | **Qabul** | Haq (T-045). 6-ekran 1-tugma: kim qiyofasi va lahza birga Muammo boshiga; 3-tugma «Raqamlar» — hikoya uyalaridan hech narsa uchmaydi, bo'lak o'zi yonadi; `QIzoh` → «Hikoya bitta odamni ko'rsatadi; Raqamlar — bu odamdan tashqaridagi son: 51 foydalanuvchi.» (89); xulosa, dars ipi, A-6, O'qituvchi eslatmasi 6, takrorlash 7, TS6. Sarlavha «Hikoya pitchning qaysi bo'laklariga tushadi?» qoldi — javobi endi «ikkitasiga», oldindan uchlikni aytmaydi. |
| 4 | «Nechta bo'lakka tushadi?» — ikkitasiga; TS7/8 modelini qayta muhrlash | **Qabul** | Bashorat natijasi «aslida: ikkitasiga» (variantlar o'zgarmadi — S-015 o'sish tartibi); tayanch 1.2 tuzatildi (yuqoridagi ⚠️); 9.33. 7-ekran test («Muammo bo'lagi boshida, lahza bilan») va arena 9, 10 — mos, o'zgarmadi. |
| 5 | «o'zgarish» ta'rifi — natija emas, imkoniyat | **Qisman** | Ta'rif gapi (tayanch 2, T-042 so'zma-so'z: «mahsulot bilan kelgan o'zgarish») va Mentor gapi (1.2 aynan «ko'radi») o'zgarmadi. A-4 izohi → «mahsulot bilan hozir nima boshqacha: bugun ko'rsata oladigan narsa — natija ham, va'da ham emas»; 8-ekran placeholder → «Mahsulot bilan hozir nima boshqacha?». «ko'ra oladi» — Mentor gapini o'zgartirardi (tasdiqlangan matn), olinmadi. |
| 6 | «o'yin bo'lmadi» — manba aynan bo'lsa qabul | Allaqachon | Tekshirildi: tayanch 1.2 (33-qator) aynan «… yana 2 kishi kelmadi — o'yin bo'lmadi.» — to'qilmagan. |
| 7 | K19 ko'prigi «bir xil» emas, «o'xshash usul»; funksiyalar mahsulotdan olinmagan | **Qabul** | 5-ekran savoli → «iPhone voqeasi va Mentor hikoyasida qaysi usul o'xshash?»; ✔ D → «Ikkalasida ko'p o'rniga keraklisi qolgan» (40; A 44 — ✔ yolg'iz eng uzun emas); to'g'ri izohi → «Apple tugmani, Mentor esa pitch boshidagi ro'yxatni olgan.» (58); A-8 burchak, O'qituvchi eslatmasi 4, takrorlash 5, Fewer Buttons! tavsifi. Tayanch 9.34. |
| 8 | «Uch qurilma bittada» ham ro'yxat — eslatmada javob | **Qabul** | 4-ekran O'qituvchi eslatmasiga: qoida «ro'yxat aytmang» emas — pitch boshida odam va voqea; Jobs tinglovchi tanigan uch narsani aytgan. Shubhali joylar yopildi (men o'zim ochgan edim). |
| 9 | A-2 «funksiyalar ro'yxati o'rniga» — overgeneralize; «boshlash o'rniga» | **Qabul** | Asosiy fikr → «Pitch funksiyalar ro'yxatidan emas, bitta odamning lahzasi va mahsulot bilan kelgan o'zgarishdan boshlanadi.» (108). 2-ekran eslatmasida «funksiyalar Yechimda qoladi» bor edi. 9.34. |
| 10 | Lahza validatori brittle — matnni yumshatish, hard bo'lmasin | **Qabul** | Yo'naltiradi (bloklamaydi — bor edi), matn → «Bu bitta voqeami? Qachon yoki qayerda bo'lganini qo'shing.» (58). 9.35. |
| 11 | Vergul ≥ 3 heuristikasi olib tashlansin | **Qabul** | 8-ekran qatori va KOD 6 dan olib tashlandi. **Sinf-supurish:** 09 (3-ekran «beshdan ko'p vergul») olib tashlandi · 10 (7-ekran ② «3 va undan ko'p vergul») — faqat «funksiya» so'zi qoldi · 03, 04 — boshqa ma'no («kamida ikkita ish vergul bilan» — tuzilma talabi), tegilmadi. 9.35. |
| 12 | «uyda yozasiz» — shartsiz va'da | **Qabul** | «Yozib bo'lmadi» qatori → «Hikoyani taymer bilan ovoz chiqarib ayting. Uyda ruxsat va imkon bo'lsa, keyin yozasiz.» (87); xulosa, yorliq «aytildi», 10-ekran sarlavhasi «Video yozsangiz, …». 9.36. |
| 13 | 10-ekran Mentor gapi video yo'q holatda noto'g'ri | **Qabul** | Mentor ikki holatda: `yozildi === true` — avvalgi; aks holda — «Bu uch savolni eslab qoling — video yozsangiz, shu savollar bilan tekshirasiz.» KOD 8. |
| 14 | 2-savol «ro'yxatisiz» — shartli, pilotda tushunish | Qisman | Matn qoldi (TS12 sababi: inkor-savolda «Ha»/«Yo'q» chalkashadi — S-006); ⛔ «qur» darvozasiga: o'quvchi o'qishida tushunish tekshiriladi. |
| 15 | `video.yozildi: false` yakuni yaxshi | Allaqachon | O'zgarishsiz. |
| 16 | «Video yozganlar» → «Video yozildi deb belgilaganlar» | **Qabul** | 9-ekran Mentor statistikasi; O'qituvchi eslatmasi — o'quvchi o'zi belgilaydi, platforma tekshirmaydi. 9.36. |
| 17 | `video.vaqt: number \| null` | **Qabul** | PII emas, video emas; TS10 da o'zim ochiq qoldirgan edim. KOD 7, 9; 9-ekran Saqlanadi; 10-ekran «Taymerda» shundan; tayanch 8. 5, 9-darslar hozir o'qimaydi — xavfsiz. |
| 18 | `savedAt` → `updatedAt` / `completedAt` | **Rad** | `savedAt` — kurs qolipi (tayanch 8 hamma kalit, 12/13-Modul naqshi); hech bir dars «qachon tugagan»ni o'qimaydi — tugallik maydonlardan chiqariladi (`kim/lahza/ozgarish` + `video.*`). 1-dars auditida bunday tavsiya bo'lmagan (auditor xotirasi). 9.36. |
| 19 | Uyga vazifa ② ixtiyoriy | **Qabul** | «Xohlasangiz, …»; Izoh (MD), TS14. |
| 20 | Uyga vazifa ① rozilik bilan sync | **Qabul** | ① → «ota-onangiz rozi bo'lsa va imkon bo'lsa — … yozing …; bo'lmasa — taymer bilan yana bir marta ovoz chiqarib ayting.» |
| 21 | Self Check! — process badge, QABUL | Allaqachon | O'zgarishsiz. |
| 22 | K19 3 → 2 kadr | Qisman | Hozir 3 kadr qoldi (QVoqea qolipi, bashorat 1/3 da, SABOQ 26); ⛔ darvozaga: 90 dan oshsa **birinchi** qisqartiriladigan — 4-ekran 3 → 2 kadr. |
| 23 | 90 daqiqa optimistik (105–125 xavfi) | Allaqachon + Qabul | ⛔ pilot taymeri bor edi (A-13, Shubhali); qisqartirish tartibi yozildi: 4-ekran 2 kadr → 10-ekran faqat video yozganlarga (bor) → arena uyda (bor). «Sig'adi» deyilmagan. |
| 24 | «Telefonni og'izga yaqin tuting» olib tashlansin | **Qabul** | → «shovqin kamroq joyda yoki navbat bilan yozdiring». |
| 25 | 0-ekran «kimga va nega» — neytral bo'lsa acceptable | Allaqachon | Ballsiz, «Qiziq fikr!» rad etmaydi (A-bo'lim ✎). |
| S | Sarlavhalar: asosiy QAT'IY QABUL; 6-ekran «Hikoya pitchning qayerida ishlaydi?» | Rad | Hozirgi sarlavha «qaysi bo'laklariga tushadi?» uchlikni aytmaydi (javob — ikkitasiga); «ishlaydi» — mavhum (S-001). |
| TS | 1, 2, 3, 5, 7, 8, 11 QABUL · 4 → 7 · 6 → 3/4 · 9 RAD → 1 · 10 → 17 · 12 shartli → 14 · 13 → 11 · 14 → 19 | — | Qo'shimcha 15–22 savollar — mos bandlarda javob berildi. |

**8 hard fix:** 1 ✓ (darvoza) · 2 Rad (qonun) · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ · 8 ⛔ darvoza (tartib yozildi).

## Sinf-supurish (13 MD + tayanch, grep)
- Video roziligi darvozasi — 2 (qo'shildi) va 9 (bor edi, M-q7 A); boshqa darsda o'zini yozish yo'q (07 — ekran videosi, B reja).
- Vergul heuristikasi — 02, 09, 10 dan olib tashlandi; 03, 04 — boshqa ma'no.
- Shartsiz «uyda yozasiz» — 10 (312: «qolganini uyda yozasiz» — xat matni, video emas) tegilmadi.
- «ro'yxat o'rniga» umumlashtirish — boshqa MD larda yo'q (tayanch 1.2 K19 qatori — bank ko'prigi).
- «Kim → Raqamlar» — faqat 02; 05 (268) `lahza` ni Muammo ostida o'qiydi — mos.

## Tekshiruv
`lint:til` 02, 09, 10, tayanch, FILTR — 0 error · `mdtekshir.py` 02/09/10 · `kesishma.py` · `lint:prompt` (natijalar jurnalda).
