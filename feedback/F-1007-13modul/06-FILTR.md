# 6-dars «Pul haqida qanday gaplashasiz?» — tashqi audit (ChatGPT) Filtr bilan, 07.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch 1.6, 8; 9, 11-darslar kalitni qanday o'qiydi) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-06/` (hamma MD va tayanch). Tuzatish skripti: scratchpad `f06/tuzat06.py` (06 — 58, 09 — 6, 07 — 1, 11 — 1 (2 joy), tayanch — 9 juftlik; birinchi yurishda hammasi mos keldi). F-1007-464.

Audit bahosi 7.5/10 (PM pedagogika 9 · real odam xavfsizligi 8 · suhbat metodikasi 7 · artefakt va keyingi darslar 6.5 · testlar 8.5 · 90 daqiqa 6.5). Hukm: **Qabul 17 · Qisman 2 · Rad 2 · Allaqachon 16** (sarlavhalar qatori bilan).
Bu safar siz tasdiqlagan qarorlarga zid band yo'q. Rad etilgan ikkitasi — kalit shakli (o'quvchisi yo'q) va kurs qoidasi («ota-ona»).
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.6 («sinfdosh auditoriya bo'lsa» → «haqiqatan to'laydigan rolda va o'zi rozi bo'lsa») · 2-bo'lim «suhbat savollari» ta'rifi va 9.9 · 4-jadval va 8-jadval (6-dars `pm-m11d2-model` ni o'qiydi; `hozir`, `narxi` izohlari) · yangi 9.52.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Yo'q»dan keyin «Qancha bo'lsa olardingiz?» majburiy — bosimga aylanadi | **Qisman** | Haq: «kerak emas» degan odamga narx so'rash uning «yo'q»ini narx savdosiga aylantiradi. 7-ekranda «yo'q»dan keyin kulrang qator «Sababi narx bo'lmasa (masalan, «kerak emas») — bu savolni bermang.» va tugma «O'tkazish» (`narxi: null`); Yordam, tayanch 9.52. Savolning o'zi va Mentor qoidasi o'zgarmadi (tayanch 1.6): Mentor misolida 2-tashkilotchining sababi pul edi («Telegram guruhi tekin-ku»), unga 4-savol berilgani to'g'ri. |
| 2 | 1–2-savol javoblarini saqlamaslik — RAD; `hozir` ishlatilsin | **Qabul** | Kalit shakli o'zgarmadi — `hozir` tayanch 8 da bor edi, darsda `null` turardi. 7-ekranda 2-savoldan keyin maydon «Hozir nima qiladi?» (≤ 80; bo'sh qolsa yumshoq xabar, keyin `null`) · yozuv qatori ostida «Hozir: …» · A-11, KOD 8, ✎, TS 3, tayanch 8. 9-darsdagi «④ Hozir nima qiladi?» maydoni bilan bir. |
| 3 | «Suhbat savollari so'zma-so'z» — juda qattiq; asosiy savollar bir xil, qisqa aniqlashtirish mumkin | **Qabul** | Ta'rif: «Suhbat savollari — har odamga bir xil tartibda beriladigan asosiy savollar.» (75) — 2-ekran `QIzoh`, A-4, yakun, kartochka 3 («Tushunmasa — bir marta aniqlashtiriladi; narx o'zgarmaydi»), Yordam, tayanch 2 va 9.9. Endi «so'zma-so'z» bir ma'noda — faqat javob uchun (T-014). |
| 4 | «O'zi javob beradi» — sherik roziligi yetarli emas; tugmani sherik bossin | **Qabul** | 7-ekran 1-qism: «O'zi javob beradi» → karta sherikka: «Sherigingiz o'zi bossin» · «Roziman — o'zim uchun javob beraman» / «Rol o'ynayman». Kulrang qator «Real suhbat ixtiyoriy.» · O'qituvchi eslatmasi, A-1, A-9, KOD 8, TS 12. |
| 5 | «To'laydigan odamga o'xshash» sinfdosh real emas | **Qabul** | Shart: «haqiqatan «{kim}» bo'lsa va o'zi xohlasa» — o'xshasa-yu shu rol bo'lmasa, rol o'yini (mashq). A-1, A-4, A-9, 7-ekran, tayanch 1.6. |
| 6 | Reklama/B2B o'quvchi: «eng yaqin tanish» real sanalmasin; 0 ham halol | **Qabul** | TS 20 da savol edi — endi qoida: o'xshash tanish — mashq; tanishlarda to'laydigan rol bo'lmasa — real suhbat 0, halol natija. Uyga vazifa ①: «U mahsulotingizda to'laydigan rolda bo'lsin; bunday tanish bo'lmasa — 0 ham halol natija.» · A-9. |
| 7 | 7+ raqamni qattiq bloklash narxni («1 000 000») ham bloklaydi | **Qabul** | Qattiq — faqat «+998», «@», «t.me/» va 9 raqamli telefon shakli («90 123 45 67» yoki bo'shliqsiz); boshqa 7+ raqam — yumshoq: «Bu telefon raqamimi yoki narxmi? Telefon yozilmaydi.» (52). KOD 8 `node` namunalari: «1000000 bo'lsa olardim» — yumshoq, «90 123 45 67» — bloklanadi. Rol maydonidagi qattiq tekshiruv o'zgarmadi (rolda narx bo'lmaydi). |
| 8 | `kim` va munosabat alohida maydon (`aloqa`) | **Rad** | Kalitni o'qiydigan 9, 11-darslar munosabat bo'yicha ajratmaydi (11-dars faqat `tur` va `javob` ni sanaydi); qavsdagi shakl (PM-018) yetadi, tayanch 8 shakli o'zgarmaydi. Auditor ham «blocker emas» degan. TS 8 ga yozildi. |
| 9 | «Yo'q»da `narxi: null` — faqat aniq son aytilsa son | Allaqachon | A-11 qoidasi shunday; 1-band bilan «o'tkazilsa — `null`» qo'shildi. |
| 10 | «Qimmat» ta'rifi tor — «boshqa narx aytsa» emas, «qimmat desa» | **Qabul** | Kartochka 8: «Odam narxni qimmat desa» · izoh «Boshqa narx aytsa — narx katagiga; aytmasa — bo'sh». Eski ta'rifga bog'langan izohlar ham: 4-ekran `QXato` «U narxni qimmat dedimi?» (23), ipucha (54), 5-ekran C xato izohi (44), 5-ekran izohi. |
| 11 | Hook — maqtovsiz, neytral | Allaqachon | — |
| 12 | Sotish gapi — bu «mahsulotni tushuntirish yomon» degani emas; ko'prik kerak | **Qabul** | 2-ekran O'qituvchi eslatmasi: «Mahsulotni tushuntirish yomon emas: bu suhbatda avval odamning narx haqidagi fikri eshitiladi, shuning uchun ko'ndirilmaydi.» O'quvchi matniga qo'shilmadi (TMI — 109-qonun; 3-ekran izohi B ni «yomon» demaydi). |
| 13 | «Olarmidingiz?» — kelajak savoli; 2-ekranda ham chegara aytilsin | **Qabul** | 2-ekran 4-karta `QIzoh` (~4 s): «Narx aytildi, lekin bu ham savol: oxirida «Nega?». Javobi — so'z, hali to'lov emas.» (83) · Shubhali 3. |
| 14 | Mentor xulosasi formula emas | Allaqachon | — |
| 15 | «Kichik son» — umumiy chegara emas, shu uch suhbat | Allaqachon | Mentor xulosasi (tayanch 1.6 so'zma-so'z) — «Uch suhbat — kichik son»: gap shu uchtasi haqida; kartochka 10 izohi «Uch — kichik son». |
| 16 | «Kim to'laydi» ni 2-darsdan oldindan to'ldirish | **Qabul** | 6-ekran 1-qism: `pm-m11d2-model.kim` dan oldindan, tahrirlanadi (yorliq «2-darsdagi tanlovingiz»); yo'q bo'lsa bo'sh. A-11, KOD 7, TS 2, tayanch 4 va 8 (o'quvchilar ro'yxatiga 6-dars; 9-dars ham — 9.47 bilan moslandi). |
| 17 | `nima` ni ham 2-darsdan | **Qabul** | 3-qism: `pm-m11d2-model.nima` dan oldindan (40 belgidan uzun bo'lsa — bo'sh), tahrirlanadi; 4-darsdagi `ekran.sarlavha` kulrang qatori qoldi. |
| 18 | Narx yo'q bo'lsa yangi narx — «taxmin» yorlig'i doim | **Qabul** | Yorliq «4-darsdagi narxingiz · taxmin»; bo'sh bo'lsa placeholder «Narx, so'm — taxmin». |
| 19 | `xulosa: null` | Allaqachon | — |
| 20 | Uy suhbatlari 9-darsda kiritiladi | Allaqachon | Tayanch 9.10; 9-dars 6-ekran 1-qismi. |
| 21 | Uyga vazifa formati — «hozirgi ish» ham | **Qabul** | ③: «Javobni o'sha zahoti qog'ozga yozing, ismsiz: rol · hozir nima qiladi (qisqa) · narx haqidagi gapi (so'zma-so'z) · belgi · aytgan narxi.» 9-dars TS 5 izohi moslandi. |
| 22 | «Ota-ona yoki vasiy» | **Rad** | Kurs qoidasi — TAQIQLAR 3 «ota-ona xabardor», 12-Modul 9.38 d; modullararo bir so'z (T-014). Auditor ham «kurs qoidasi bo'lsa saqlang» degan. |
| 23 | Mahalla guruhi qoidasi | Allaqachon | — |
| 24 | Mentor statistikasida faqat «Yozuv saqladi» | Allaqachon | — |
| 25 | «Recorded!» mashqqa ham | Allaqachon | — |
| 26 | Yakuniy savol — so'z, to'lov emas | Allaqachon | — |
| 27 | «Uch tanishingiz» → «auditoriyangizdagi uch tanish» | **Qabul** | 8-ekran savoli: «Auditoriyangizdagi uch tanish narxingizni eshitib «olaman» dedi. Bu nimani ko'rsatadi?» (10 so'z); O'lchov. |
| 28 | «Suhbat» — faqat real, lekin «Suhbatlarim» ichida mashq ham | **Qabul** | Ro'yxat nomi — **«Yozuvlarim»** (ichida real suhbat va mashq yozuvi): 1, 6, 7-ekran, A-5, vizual, KOD 3. 9-darsdagi o'sha ro'yxat ham (sinf-supurish). Mentor varag'idagi «Suhbatlar» qoldi — u yerda uchalasi real. |
| 29 | «real n / 3 · mashq n» — yaxshi | Allaqachon | Chiziq endi «Yozuvlarim · real n / 3 · mashq n». |
| 30 | Yumshoq tekshiruvlar — bloklamasin | Allaqachon | — |
| 31 | «Hozirgi ish» placeholder grammatikasi | **Qabul** | «masalan: o'yinni qanday yig'asiz» (Mentor misolidan; savol qolipiga to'g'ri tushadi). |
| 32 | `nima` placeholder — qulaylik nomi | **Qabul** | «Qulaylik nomi — masalan: Doimiy o'yin». |
| 33 | 90 daqiqa — 95–110 | **Qisman** | O'lchanmagan baho — Shubhali 1 ga yozildi; ⛔ pilotda taymer. |
| 34 | `optionalLive` qochish yo'li | Allaqachon | — |
| 35 | «Uchtagacha» — baho emas | Allaqachon | — |
| 36 | Yozma tasdiq 9-darsda — aralashtirilmasin | Allaqachon | — |
| Sarl. | Sarlavhalar; Reja sarlavhasiga taklif «Narxni aytishdan oldin nimani so'raysiz?» | Allaqachon | Auditor joriysini ham qabul qildi. Taklif olinmadi: reja sarlavhasi — natija va'dasi (P-014), savol 2-ekranning kashfiyotini ochib qo'yadi (P-036). |
| TS | TAYANCHGA SAVOL 1–20 | — | 1, 4, 5, 10, 11, 13–19 — auditor qabul qildi · 2 — Qabul (31, 32; 16, 17) · 3 — Qabul (2) · 6, 7 — qabul · 8 — Rad (8) · 9 — Qisman (1) · 12 — Qabul (4, 5) · 20 — Qabul (6). Holat qatorlari MD da. |
| TS+ | Auditorning yangi savollari 21–24 | Javob berildi | 21 → «yo'q»dan keyin 4-savol sababi narx bo'lsa; aks holda «O'tkazish» · 22 → 2-savoldan keyin bitta qisqa qator `hozir` · 23 → «Roziman — o'zim uchun javob beraman» ni sherikning o'zi bosadi · 24 → qattiq faqat «+998», «@», «t.me/», 9 raqamli telefon shakli; boshqa 7+ raqam — yumshoq. |

## Sinf-supurish (12 MD + tayanch)
- **7+ raqamni qattiq bloklash narx yoki son bo'lishi mumkin bo'lgan erkin matnda** — 09 (yozma tasdiq gapi — narx aynan shu yerda bo'ladi), 07 (oferta matni), 11 (sabab va javob — 2 joy) → qattiq: telefon shakli, yumshoq: boshqa 7+ raqam. Rol maydonlari (06 6-ekran, 09 uy suhbati «Kim edi?») — o'zgarmadi. 07 dagi karta bloki (12+ raqam) — o'zgarmadi. Boshqa darslarda bu tekshiruv yo'q.
- **Real va mashq aralash ro'yxat «Suhbatlarim» nomi bilan** — 09 (A-5, 1-qism, harakat, vizual) → «Yozuvlarim». Boshqa darslarda 0.
- **«Suhbat savollari — so'zma-so'z» ta'rifi** — tayanch 2 va 9.9 dan tashqari 0.
- **6-dars uyga vazifasi formati** — 9-dars TS 5 izohi («faqat rol, gap, belgi va narx») moslandi; 9-dars kartasida «④ Hozir nima qiladi?» allaqachon bor edi.
- **«Qimmat» = «boshqa narx aytdi»** — 09 da 0 (u yerda belgi faqat 6-dars yozuvidan ko'rsatiladi).

## Tekshiruv
- `lint:til`: 06 — TOZA (birinchi yurishda 1 warn — O'qituvchi eslatmasidagi bitta fe'l, tuzatildi) · 07, 09, 11 — TOZA (zaxirada ham) · tayanch — 0 error, 25 warn (o'zgarmagan).
- `qisqa.py`: 06, 07, 09, 11 — 12 ekran, arena 3/3/3/3, sarlavha >55 yo'q — zaxira bilan bir xil.
- Python `len`: yangi `QXato` 52, 40, 34, 23 · ipucha 54 · xato izohi 44 · ta'rif 75 · 2-ekran `QIzoh` 83 — O'lchov bo'limida yangilandi (QIzoh 41–83, QXato 34 ta, 23–55). ✔ o'rinlari o'zgarmadi.
