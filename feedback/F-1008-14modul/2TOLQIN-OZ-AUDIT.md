# 2-to'lqin — o'z auditi (ChatGPT o'rniga, 08.10.2026, F-1008-557)

Har MD ni agentdan keyin o'zim tekshirdim: `vositalar/mdtekshir.py` (ekran · arena · uzunlik · keyingi dars · TAXMIN · taqiq naqshlari · `lint:til`) + belgilangan har qatorni ko'z bilan.
Darslararo — `vositalar/kesishma.py` (kalitlar tayanch 8 da · nishon, sarlavha, arena takrori · TAXMIN taqsimoti).
Hukmlar: **Qabul** — agent qarori tayanch/qonunga mos, shu holicha · **Tayanch** — darslararo kelishuv, tayanch 9.16+ ga yozildi · **GATE M** — foydalanuvchi qarori (`gatem-1.json` savoli) · **⛔ qur** — faqat qurilgan darsda tekshiriladi.

## Mexanik natija (o'zim, 08.10)

| Dars | Qator | Ekran | Arena A/B/C/D | Uzun | Keyingi dars | TAXMIN | lint:til | Belgilanganlar |
|---|---|---|---|---|---|---|---|---|
| 02 Hikoya | 695 | 15/15 | 3/3/3/3 | 0 | ✓ | 52 | 0 | MD ichki + 8-ekran detektor ro'yxati |
| 04 Sayqal | 789 | 12/12 | 3/3/3/3 | 0 | ✓ | 23 | 0 | MD ichki + kartochka «Inglizchasi: polish» |
| 05 Guruh | 674 | 12/12 | 3/3/3/3 | 0 | ✓ | 51 | 0 | MD ichki + detektor namunalari |
| 06 Demo tayyorgarlik | 720 | 12/12 | 3/3/3/3 | 0 | ✓ | 35 | 0 | MD ichki + kartochka «feature freeze» |
| 08 Final pitch | 657 | 12/12 | 3/3/3/3 | 0 | ✓ | 44 | 0 | MD ichki + detektor + test distraktori |
| 09 Video | 673 | 12/12 | 3/3/3/3 | 0 | ✓ | 35 | 0 | MD ichki |
| 10 Buyurtma | 687 | 12/12 | 3/3/3/3 | 0 | ✓ | 70 | 0 | MD ichki |
| 11 Dasturlar | 671 | 12/12 | 3/3/3/3 | 0 | ✓ | 54 | 0 | MD ichki + 7-ekran detektor |

O'quvchi matnida kafolat, ayb, kelajak va'dasi, investitsiya summasi, inglizcha atama, ichki kod — **0** (har belgilangan qator ko'rildi).

## Men tuzatganlarim (agent MD sidan keyin)
- **10** — `bor === true` kulrang qatori: «Ota-onangiz rozi bo'lsa, video havolasini uyda qo'shasiz.» (09 TS3; TAQIQLAR 1 video qoidasi; 2 joy).
- **06, 09** (Kod darslari) — nishon nomlaridan «!» olib tashlandi (12-Modul `BreakAndFix`, 13-Modul 03/05/08/12 naqshi: Kod — «!» siz, PM — «!» bilan).
- **`00-MANBA.md` 4** — «hikoya» qatori (9-Modulda o'tilgan; eski «yo'q» — grep «shikoyat» ga ilingan) · **tayanch 2, 10** — hikoya atamasi va RU «история» · **tayanch 1.2** — K19 so'zi «uch qurilma bittada» (11-Modul kodi) · **tayanch 6** — Diamond Challenge va YC qo'shimcha faktlari (60 soniyalik video — o'zim qayta ochib tekshirdim).

## TAYANCHGA SAVOL hukmlari

### 02 · Hikoya (14)
| TS | Hukm | Natija |
|---|---|---|
| 1 «hikoya» 9-Modulda o'tilgan | **Qabul — mening xatoim** | MANBA 4, tayanch 2 va 10 tuzatildi |
| 2 K19 11-Modulda bosh-keys | **Qabul** | boshqa burchak (hikoya chizig'i) — tayanch 5 ga eslatma |
| 3 «uch qurilma bittada» | **Qabul** | tayanch 1.2 tuzatildi |
| 4 K19 ko'prigi bank faktiga toraytirildi | **Qabul** | PM-018 — bankdan tashqari da'vo yo'q |
| 5 «zal zerikdi» olib tashlandi | **Qabul** | TAQIQLAR 0, 3 (o'ylab topilgan reaksiya, baho-so'z) |
| 6 «Raqamlar — lahzalar soni» → «nechta foydalanuvchi» | **Qabul** | tayanch 1.2 ning noto'g'ri modeli (T-045) |
| 7 video — hikoyaning uch qismi, 1 daqiqa | **Qabul** | tayanch 1.2 so'zi aniqlashtiriladi (9.17) |
| 8 Mentor pitchida lahza | **Tayanch 9.17** | yozma matn 1.1 aynan; lahza — faqat 2-dars mashqida |
| 9 2-darsda alohida rozilik qadami yo'q | **Qabul** | video telefondan chiqmaydi (T12); 9-darsda havola — rozilik bilan |
| 10 `pm-m12d2-hikoya` uzunliklari | **Qabul** | tayanch 8 ga (KOD bosqichida) |
| 11 «12 ta funksiya» ishlatilmadi | **Qabul** | 1.14 da yo'q son (P-016) |
| 12 inkor-savol shakli | **Qabul** | S-006 |
| 13 lahza detektori yo'naltiradi | **⛔ qur** | soxta signal — ikkinchi «Saqlash» bilan o'tadi |
| 14 uyga vazifa ② real odam bilan | **Qabul** | baho emas, yozilmaydi |

### 04 · Sayqal (16)
| TS | Hukm | Natija |
|---|---|---|
| 1 kutish yozuvi + kulrang kartalar birga | **Qabul** | 11-Modul kutish yozuvi (Render uyg'onishi) saqlanadi |
| 2 «Qo'shilmoqda…» | **Qabul** | 12-Modul «Ulanmoqda…» naqshi |
| 3 kulrang kartalar — ikkita | **Qabul** | sahna namunasi, son da'vo emas |
| 4 animatsiya 0,3 soniya | **Qabul** | dizayn qiymati (9-Modul `transition`), statistika emas |
| 5 joy egallovchi miltillashi | **Qabul** | harakat kamaytirilganda to'xtaydi |
| 6 Chrome DevTools (Slow 4G, reduced-motion) | **Qabul** | rasmiy hujjat (MD Manbalar) |
| 7 `npx expo start` + `w` | **GATE M** | kursda ilgari yo'q; muqobil — Netlify'dagi eksport |
| 8 APK bu darsda yo'q | **Qabul** | tayanch 9.6 (demo — telefon brauzeri) |
| 9 namuna yozuv o'chirilmaydi | **Tayanch 9.19** | 6-dars namuna akkaunti bilan bir qoida |
| 10 Backend'ga tegilmaydi | **Qabul** | takror himoyasi — 7-dars ko'radi |
| 11 bloklar tartibi tayanchdagidek | **Qabul** | sahna — ekranlar tartibida |
| 12–15 nishon, yakun, savol, misol | **Qabul** | qolip va P-002 |
| 16 «demo yo'li» ↔ «demo stsenariysi» | **Tayanch 9.18** | ikki ma'no: yo'l — mahsulotdagi ekranlar (joy), stsenariy — yozilgan qadamlar (matn); 04, 06, 07, 13 da shunday |

### 05 · Guruh fidbeki (13)
| TS | Hukm | Natija |
|---|---|---|
| 1 `MENTOR_TUZATISH` (3 band) | **Tayanch 9.16** | bitta manba; 08 shundan oldi (03:57), 13 ga xabar berildi |
| 2 uchinchi band qoidasi (✗ → hakam savoli → ✓) | **Qabul** | tayanch 1.5 ga |
| 3 hakam savolining bo'lagi | **Qabul** | sxema o'zgarmaydi |
| 4 guruhda bitta varaq | **Qabul** | gapiruvchi qurilmasida |
| 5 `pm-m12d5-varaq.vaqt` | **Qabul** | `vaqt: n \| null` — tayanch 8 ga (8-dars solishtiradi) |
| 6 «hakam savoli» ta'rifi | **Qabul** | tayanch 2 ga |
| 7 Muammo — lahza bilanmi | **Tayanch 9.17** | 1.1 aynan |
| 8 guruhda tinglovchi soni aytilmaydi | **Qabul** | — |
| 9 yakka rejim — video yoki ovoz | **Qabul** | telefonda qoladi (T12) |
| 10 taymerdagi savol-javob bo'lagi | **Qabul** | faqat varaqda, javob 8-darsda |
| 11 «guruh» ikki ma'noda | **Qabul** | futbol guruhi — doim to'liq nomi bilan |
| 12 hakamning pul savoli | **Qabul** | «investitsiya, ulush, summa» yo'naltiradi; 8-dars javobi — «bitta so'rov» |
| 13 yakka varaq 8-darsda | **Qabul** | 8-dars `tur` ni o'qiydi |

### 06 · Demo tayyorgarlik (19)
| TS | Hukm | Natija |
|---|---|---|
| 1 «B yo'l» — yangi atama | **Qabul** | tayanch 2 ga; «B reja» — faqat video (T-015) |
| 2–3 Mentor B yo'llari, stsenariy | **Qabul** | tayanch 1.6 nomlari; 07 pilot bilan bir |
| 4 tayyorlov va «Keyin» kalitda yo'q | **Qabul** | 13-dars `DEMO.md` dan o'qiydi (kalit o'zgarmaydi) |
| 5 uyg'otish — «bir necha daqiqa oldin» | **Qabul** | Render rasmiy (15 daqiqa) |
| 6 namuna akkaunt ikkita, o'chirilmaydi | **Tayanch 9.19** | 7-dars tekshiruv akkaunti — boshqa (o'chiriladi) |
| 7 video — laptop, ikki oyna | **⛔ qur** | — |
| 8 video repo'dan tashqarida | **Qabul** | 9-dars bilan bir |
| 9 teg `m14-demo`, `git ls-remote` | **Qabul** | `-f` o'rgatilmaydi |
| 10 A3 tartibi «teg → o'tish» | **GATE M** | muqobil «o'tish → teg» |
| 11–19 | **Qabul** | 9.5, 9.1, 9.9 aynan; uyga vazifa yo'q (sinf 14) |

### 08 · Final pitch (12)
| TS | Hukm | Natija |
|---|---|---|
| 1 uch savol `SAVOL_BANK` dan | **Qabul** | «Keyingi olti oyda…» olinmadi (12-dars nomi bilan bir) |
| 2 Mentorning uch javobi | **Qabul** | yangi son yo'q (11, 13-Modul tayanchi) — tayanch 1.8 ga |
| 3 tuzatilgan uch bo'lak | **Tayanch 9.16** | so'rov gapi qisqardi («ular bilan tanishtiring») — **GATE M** |
| 4 `pm-m12d8-final` + `vaqt`, `tur`, `bolaklar` | **Qabul** | tayanch 8 ga; 13-dars tuzatilgan pitchni ko'radi |
| 5 1-savol — guruh yozgan hakam savoli | **Qabul** | 9.3 havzasi + o'quvchi savoli |
| 6–9 | **Qabul** | 12-Modul naqshlari |
| 10 `pm-m12d6-demo.stsenariy` ni o'qish | **Qabul** | ixtiyoriy kulrang qator (KOD) |
| 11 dars raqami o'quvchi matnida | **Tayanch 9.20** | ruxsat — 12-Modul kodida 61 joy («4-darsdagi …») |
| 12 ikkinchi misol — kitob almashish ilovasi | **Tayanch 9.21** | 01, 06, 07, 08 — bir olam |

### 09 · Video-portfolio (16)
| TS | Hukm | Natija |
|---|---|---|
| 1 Mentorning uch bo'lagi | **Qabul** | 1.1 Jamoa + 1.2 lahza + 13M 1.11 |
| 2 vaqt 0:20 · 1:50 · 0:50 | **Qabul** | «bu mashqda» yorlig'i bilan |
| 3 `bor` — «video bor» | **Qabul** | 10-dars tuzatildi (rozilik qatori) |
| 4 `bolaklar` uzunliklari | **Qabul** | tayanch 8 ga |
| 5 qo'shimcha o'qish (`pm-m12d6-demo`, `pm-m9d8-platforma`) | **Qabul** | kalit kodda bor (`PaymentWebhookLesson`) |
| 6 ota-ona roziligi tartibi | **GATE M** | darsda o'quvchi belgilaydi; maktab tartibi — foydalanuvchida |
| 7 namuna akkaunt | **Tayanch 9.19** | 6-dars akkaunti |
| 8 videoda demo — 1–3-qadam | **Qabul** | bitta ekran yozuvi |
| 9 «ssenariy» ↔ «stsenariy» | **GATE M** | modul bo'yi bitta imlo |
| 10–14 | **Qabul / ⛔ qur** | mashq kadrlari, shovqin — pilotda |
| 15 «ekran yozuvi» ↔ «ekran videosi» | **Qabul** | ikki ma'no: yozish jarayoni (9) va B reja videosi (6); App.jsx osti |
| 16 nishonlar | **Qabul (tuzatildi)** | «!» siz (Kod darsi) |

### 10 · Birinchi buyurtma (16)
| TS | Hukm | Natija |
|---|---|---|
| 1–2 Mentor buyurtma rejasi va ikki xat | **Tayanch 9.22** | 12-dars agentiga xabar berildi |
| 3 xat matni kalitda | **GATE M** | A — `xatlar[].matn` (≤420) · B — faqat «Nusxalash» (MD hozir B) |
| 4 `soroq` — stajirovka · maslahat | **Qabul** | tayanch 1.10 |
| 5 `yuborildi` | **Qabul** | bu darsda `null`; 12-dars o'z kalitida so'raydi |
| 6 `buyurtma` uzunliklari | **Qabul** | tayanch 8 ga |
| 7 `pm-m12d9-video` o'qish | **Qabul** | 09 bilan mos (tekshirildi) |
| 8 Upwork «odatda 18» | **GATE M** | T13 bilan birga |
| 9 Upwork rangi | **⛔ qur** | rasmiy brend sahifasidan |
| 10 suhbat mashqi yo'q | **Qabul** | «Uchrashuv — faqat kattalar bilan» |
| 11 «tanish doira» | **Qabul** | oddiy so'z |
| 12 havola xatda | **Qabul** | «bo'lsa — uyda, ota-ona bilan» + 09 TS3 |
| 13–16 | **Qabul** | — |

### 11 · Xalqaro dasturlar (14)
| TS | Hukm | Natija |
|---|---|---|
| 1 yangi rasmiy faktlar | **Qabul** | tayanch 6 (60 soniya — o'zim tekshirdim) |
| 2 «Mentordan so'rang» | **Qabul** | T-015 («tashkilotchi» — ilova roli) |
| 3–4 Mentor dasturi va «Kim uchun» | **Tayanch 9.22** | 12-dars agentiga xabar berildi |
| 5 Mentor misolida yosh qatori yo'q | **Qabul** | — |
| 6 «jamoa» ikki joyda | **Qabul** | bo'lak — bosh harf |
| 7 `pm-m12d11-dastur` tiplari | **Qabul** | tayanch 8 ga |
| 8 `yonalish` maydoni | **Qabul (yo'q)** | o'quvchi tanlamaydi — maydon qo'shilmaydi |
| 9 brend ranglari | **⛔ qur** | — |
| 10 «xalqaro dastur» ta'rifi | **Qabul** | jargonsiz |
| 11–14 | **Qabul** | video qoidasi; sovrin va pul aytilmaydi; «5PM EST» → O'qituvchi eslatmasida |

### 13 · To'liq repetitsiya (18)
Mexanik: 686 qator · 12/12 · arena 3/3/3/3 · uzun 0 · keyingi dars ✓ (Zaxira dars) · TAXMIN 58 · lint:til 0 (1 warn — «Manbalar»dagi ruscha asl). «Demo Day» faqat shu darsda (9.13).

| TS | Hukm | Natija |
|---|---|---|
| 1 `pm-m12d13-repetitsiya` (`vaqt\|null`, `tur`, varaq qatorlari) | **Qabul** | tayanch 8 ga |
| 2 5-ekran tanlovlari kalitga yozilmaydi | **Qabul** | dars holatida |
| 3 `pm-m12d7-tekshiruv` o'qish | **Qabul** | tayanch 8 va 9.8 shuni aytadi |
| 4 8-dars savolni `id` bilan yozsin | **Qabul** | `pm-m12d8-final.savollar[].id` (bankdan bo'lsa) — tayanch 8 ga |
| 5 hakam savollari 7 ta | **Qabul** | «Keyingi olti oyda…» qo'shilmaydi (12-dars nomi) |
| 6 mehmon kim | **GATE M** | boshqa guruh o'qituvchisi yoki ota-onadan biri; bo'lmasa — Mentor |
| 7 guruh rotatsiyasi | **GATE M** | guruhda tinglovchi hakam · muqobil — butun sinf oldida (vaqt yetmaydi) |
| 8 «to'xtamasdan» qoidasi | **Qabul** | «bu mashqda» |
| 9–10 vaqt belgisi, varaq belgilari | **Qabul** | izoh maydoni yo'q (TAQIQLAR 3) |
| 11 Mentor pitchi ekranda yo'q, 08 matni | **Tayanch 9.16** | — |
| 12 demo ochilmasa tuzatish qayerda | **GATE M** | uyga vazifa ① — buzish yozuvi; tuzatish — 14-dars «Zaxira» yoki uyda |
| 13–18 | **Qabul** | kitob ilovasi (9.21), «tinglovchi» (05), `otishVaqt` — soniya, bir o'lchov |

### 12 · Olti oylik reja (17)
Mexanik: 718 qator · 12/12 · arena 3/3/3/3 · uzun 0 · keyingi dars ✓ · TAXMIN 32 · lint:til 0. 10/11 Mentor misollari aynan (izchillik xabaridan keyin).

| TS | Hukm | Natija |
|---|---|---|
| 1 yakkama-yakka 10 daqiqa sig'maydi | **GATE M** | A navbat bilan (bir darsda ≈4 kishi, qolgani «Navbatim kelmadi») · B qisqa (≈3 daqiqa) · C alohida vaqt |
| 2 `pm-m12d12-reja` qo'shimchalari (`tanlov`, `nima`, `sabab`, `suhbat`) | **Qabul** | tayanch 8 ga (9.24) |
| 3 «nishon» → «oylik maqsad» | **Qabul** | T-015; tayanch 1.12 va 2 so'zi shunga |
| 4 1-oy majburiy, 2–6 ixtiyoriy | **Qabul** | 25 daqiqaga sig'ishi uchun |
| 5 Mentor misolidagi tafsilotlar | **Qabul** | yangi son yo'q (1.1, 1.14, 13M 1.11, 10/11-darslar) |
| 6–8 | **Qabul** | qo'shimcha o'qish `pm-m11d11-refleksiya` (13-Modul kaliti) |
| 9 «Demo Day» keyingi dars nomida | **Qabul** | tayanch 9.13 ga istisno yozildi |
| 10 menyu osti «shaxsiy reja» | **GATE M** | osti «Mentor bilan yakkama-yakka: olti oylik reja» (App.jsx + NOMLAR) |
| 11–16 | **Qabul** | suhbat savollari, maxfiylik, sana chegaralari |
| 17 uyga vazifa ① majburiy | **Qabul** | reja ota-onaga ko'rsatiladi (TAQIQLAR 1, 3) |

## Men topgan qo'shimcha (darslararo supurishda)
- **«Demo Day» 9.13** — 07 arena 1-savol D variantida va 07 KOD zaxira yorlig'ida; ildizi tayanch 2 dagi hakam ta'rifi. Uchalasi tuzatildi; `mdtekshir.py` endi 1–12-darslarda «Demo Day» ni belgilaydi.
- **Pilotlar** — o'z auditlari: `01-OZ-AUDIT.md`, `03-OZ-AUDIT.md`, `07-OZ-AUDIT.md`.
