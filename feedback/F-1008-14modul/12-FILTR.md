# 12-dars «Keyingi olti oyda nima qilasiz?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-570)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-12/`. Skript: scratchpad `f12_tuzat.py` (87 juftlik + 4 qo'lda, har biri faylda aynan bir marta — skript tekshirgan; bitta uzunlik tuzatib qayta yurgizildi).
Audit bahosi 6.5/10 (to'rt «blocker»: «olti oylik» faqat 1-oy; yakkama-yakka navbat tugallikni belgilaydi; boshlanish sanasi yo'q; mahsulot qarori faqat son/yozuv). Hukm: **Qabul 31 · Qisman 1 · Rad 2 · Allaqachon 8** (40 band + sarlavha + 17 TS + 7 savol + 11 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** (a) tayanch 1.12 «har yo'nalishga oylik bitta maqsad» → 1-oy va 6-oy majburiy, 2–5 ixtiyoriy (TS4 muqobili); Mentor misolida 6-oy qatorlari (Mahsulot — 4-oydan ko'chirildi; Ko'nikma, Ish — yangi, sonsiz — TS5); (b) tayanch 1.12 «Mentor bilan 10 daqiqa» — darsdan alohida navbat, tugallikka kirmaydi (TS1 A rad); navbat save-speed emas; (c) `pm-m12d12-reja` sxemasi: `boshlanganSana`, `tanlov 'hali'`, `nishonlar[0]`/`[5]` majburiy, `suhbat` — belgi (tayanch 8); (d) 3-ekran ✔ B matni; (e) Mentor Ish 2-oy «va ota-ona bilan»; (f) uyga ① — TS17 teskari; (g) 6-ekran `optionalLive` olindi. `savedAt` qoldi (qolip).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Artefakt «olti oylik» emas — faqat 1-oy majburiy | **Qabul** | 1-oy va 6-oy majburiy, 2–5 ixtiyoriy: A-1, 6-ekran ②b «Olti oy oxirida nimaga yetasiz?», xulosa, saqlash, Yordam, 7-ekran «2–5-oy», A-11 `nishonlar[0]`/`[5]`, 2-ekran `QIzoh`, O'qituvchi eslatmasi, tayanch 1.12, 8. Mentor misolida 6-oy: Mahsulot — «Boshqa bir mahalla…» (4-oydan), Ko'nikma — «testsiz push qilmaslik — odat», Ish — «natija qanday bo'lsa ham keyingi qadamni Mentor bilan belgilash» (TS5, yangi son yo'q). 9.83. |
| 2 | Six Months! nomi | **Qabul** | Nom qoldi (6-oy majburiy), tavsif → «Uch yo'nalishda 1-oy va 6-oyni yozdingiz» (41). 9.83. |
| 3 | Yakkama-yakka navbat tugallikni belgilaydi | **Qabul** | A-1, A-14: 10 daqiqa — darsdan alohida navbat; yakun sarlavhasi faqat rejadan, suhbat — alohida belgi; 90 daqiqalik qism 6-ekran bilan tugaydi. TS1 A RAD. 9.84. |
| 4 | Navbat «birinchi saqlaganlardan» — RAD | **Qabul** | Mentor belgilagan tartib (stol yoki tasodifiy); 1, 6-ekran O'qituvchi eslatmalari, A-14, Mentor rejimi (6, 7, KOD 9). 9.84. |
| 5 | «Mentor boshqa vaqtni kelishadi» — va'da | **Qabul** | → «Navbatim kelmadi — Mentordan suhbat vaqtini aniqlang.» (54). 9.84. |
| 6 | «Mentor bilan ko'rildi» — self-report | **Qabul** | Belgi → «Mentor bilan suhbat bo'ldi deb belgilandi»; 7-ekran xulosalari, A-11 `suhbat` izohi, KOD 9. 9.84. |
| 7 | `boshlanganSana` yo'q | **Qabul** | A-11 sxema, 6-ekran saqlash, KOD 7, tayanch 8: birinchi saqlashda, o'zgarmaydi. 9.85. |
| 8 | `savedAt` → `updatedAt` / `completedAt` | **Rad** | Kurs qolipi; `boshlanganSana` alohida qo'shildi — boshlanish va oxirgi o'zgarish ajratildi. |
| 9 | Diamond muddati oyini bugungi sanadan hisoblash | **Qabul** | `boshlanganSana` dan — 2-ekran, KOD 3. 9.85. |
| 10 | 31 kun — tayanchsiz | **Qabul** | → rejaning 1-oyi (`boshlanganSana` + bir kalendar oy), yumshoq, sonsiz; A-7, 6-ekran tekshiruvi, KOD 7, TS14 RAD, sinf 7. 9.85. |
| 11 | Mahsulot qarori faqat «son yoki yozuv» | **Qabul** | Ta'rif → «mahsulot haqida xulosa — son yoki yozuv bilan» (A-4, 2-ekran `QIzoh`, yakun 2, kartochka 3); 6-ekran sabab ostida «vaqtingiz va ustuvorligingiz ham sabab»; yumshoq tekshiruv «vaqt», «ustuvor», «maktab» ni o'tkazadi. 9.86. |
| 12 | 3-ekran ✔ B — son emas | Qisman | → «Sanoqda qaytganlar soni ko'rinib turibdi» (39) — son bor, qiymati aytilmaydi (ikkinchi misolga raqam to'qilmaydi). |
| 13, 14 | «Foydalanuvchilaringizga aytish» shartli; «to'xtataman» — hozir emas | **Qabul** | Kulrang: «keyingi olti oy uchun, hozirgi kurs ishini o'chirmang» + «Real foydalanuvchilar bo'lsa — ularga xabar berishni ham rejalang». 9.86. |
| 15 | Ish — «Hozircha tanlamayman» | **Qabul** | To'rtinchi yo'l (`'hali'`): 1-oy taklifi «Ota-onam bilan qaysi yo'l mos ekanini ko'rib chiqish», kulrang qator; A-11, tayanch 8. 9.86. |
| 16 | Fiverr/Freelancer — manbasiz brendlar | **Qabul** | Olindi: «Upwork» yoki «frilans sayt» → «Xalqaro frilans sayti: yosh shartini ota-ona bilan o'qing.» 9.86. |
| 17 | «yuridik shaxs» — umumiy huquqiy formula | **Qabul** | → «Haqiqiy to'lov — kurs doirasidan tashqarida, ota-ona bilan.»; A-9, sinf 17. 9.86. |
| 18 | «{n} ta kompaniyaga» — 10-FILTR 1 bilan zid | **Qabul** | → «10-darsdagi xat qoralamalaringiz: {n} ta». |
| 19 | `xatlar.length` → Stajirovka avtomatik | **Qabul** | Faqat `xatlar[].soroq === 'stajirovka'` bo'lsa; A-11 o'qiydi, KOD 7. 9.86. |
| 20 | 11-dars `'boshqa'` — tayyor dastur emas | **Qabul** | Faqat eslatma «11-darsda boshqa dastur shartini tekshirish qolgan», yo'l tanlanmaydi (11-FILTR 2 bilan). 9.86. |
| 21 | Diamond muddati — freshness | **Qabul** | Muddat o'tgan bo'lsa bayroq ko'rinmaydi; ⛔ «qur» kuni (2-ekran, KOD 3). 9.85. |
| 22 | Mentor Ish 2-oy — «va ota-ona bilan» | **Qabul** | A-6, 2-ekran. |
| 23 | 13-Modul 4 hafta → taklif | Allaqachon | Taklif tugmasi; TS6 belgisi. |
| 24, 25 | Bo'sh oylar — 6-oy anchor; 18 katak talab qilinmaydi | **Qabul** | 1-band bilan; 2-ekran O'qituvchi eslatmasi. |
| 26 | Birinchi qadam ta'rifi — «bu darsda» | **Qabul** | → «Bu darsda birinchi qadam — sanasi bor, bir kunda qilinadigan aniq harakat.» — A-4, 4-ekran xulosa, yakun 4, kartochka 7 savoli. TS13. 9.86. |
| 27, 28 | 5-ekran test · 8-ekran | Allaqachon | O'zgarishsiz. |
| 29 | Suhbat 2-savoli — yordam shart emas | **Qabul** | → «Bu qadamda yordam kerak bo'lsa, kim yordam beradi?» TS11. |
| 30 | Reja Mentor ekraniga chiqmaydi | Allaqachon | TS12 ✓. |
| 31 | Mentor ro'yxatida saqlash vaqti — raqobat signali | **Qabul** | Olindi (6, 7-ekran Mentor rejimi, KOD 9). 9.84. |
| 32 | Uyga ① butun reja majburan ota-onaga | **Qabul** | → faqat Ish yo'nalishidagi real odam/pul/xat/ariza qadamlari ota-ona bilan; butun reja — xohlasa; Kim bilan yorlig'i; TS17 RAD. 9.86. |
| 33, 34 | ② telefonsiz; «uch birinchi qadam» dinamik | **Qabul** | → «Yozilgan birinchi qadamlarning sanasini o'zingiz foydalanadigan kalendarga yoki qog'ozga yozing»; Nechta: «yozilgan birinchi qadamlar». |
| 35 | Hook «Qiziq fikr!» | **Rad** | T-028, T-067 (bu darsda faqat «Qiziq fikr!» — ballsiz so'rovnoma, J-026). |
| 36, 37 | «Oxirgi modul» · reja sarlavhasi | Allaqachon | O'zgarishsiz. |
| 38 | 6 va 7 ikkalasi `optionalLive` | **Qabul** | 6 — majburiy (asosiy artefakt), 7 — `optionalLive` qoldi (suhbat — alohida navbat). 9.84. |
| 39 | Yakun 1-holat suhbatga bog'lanmasin | **Qabul** | Uch holat: reja to'liq (46) + alohida belgi; reja tugamagan; hech narsa. KOD 12. 9.84. |
| 40 | 90 daqiqa — yakkama-yakka matematik sig'maydi | **Qabul** | 3-band bilan (curriculum qarori: suhbat alohida navbat). |
| S | Sarlavhalar: asosiy QAT'IY QABUL; 7-ekran | **Qabul** | → «Mentor bilan rejangizni 10 daqiqa muhokama qiling.» (51). |
| TS | 1 → 3, 4 (A RAD) · 2 ✓ (+7) · 3 ✓ · 4 → 1 · 5 Qisman (22; 6-oy yangi qatorlar — foydalanuvchiga) · 6 ✓ · 7 ✓ · 8 → 18–20 · 9 ✓ · 10 ✓ · 11 → 29 · 12 ✓ · 13 → 26 · 14 → 10 (RAD) · 15 ✓ · 16 → 9, 21 · 17 → 32 (RAD) | | Savollar 18–24: 18 → 7 · 19 → 4 · 20 → 1, 2 · 21 → 11 · 22 → 19 · 23 → 20 · 24 → 15. |

**11 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ (`boshlanganSana`; `updatedAt` — Rad, qolip) · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ · 9 ✓ · 10 ✓ · 11 ✓.

O'lchov bo'limi — Filtrdan oldingi holat; o'zgargan qatorlarning yangi uzunliklari qavsda skript bilan qo'yildi (2-ekran `QIzoh` 97 / 83, 3-ekran B 39, 4-ekran xulosa 76, 6-ekran xulosa 85, 7-ekran sarlavha 51, xulosalar 57 / 65, «Navbatim kelmadi» 54, yakun 46, nishon 41, tekshiruv xabarlari 55 / 60).

## Sinf-supurish (13 MD + tayanch, grep)
- **`pm-m12d12-reja` o'quvchilari** — 13 MD o'qimaydi (grep 0); sxema o'zgarishi xavfsiz.
- **10/11-dars importlari** — 12 MD 10-FILTR 1, 27 va 11-FILTR 2 bilan tenglashtirildi («xat qoralamalari», «keyingi mashg'ulotdan keyin», `'boshqa'` eslatma).
- **Hook neytral javobi** — 12 (faqat «Qiziq fikr!», J-026) — boshqa darslarda «Aynan!» qonun bilan qoladi.
- **«yuridik shaxs» formulasi** — o'quvchi matnida faqat 12 da edi; 01 MD O'qituvchi eslatmasi va TS9 da (13-Modul TAQIQLAR 1 iborasi, o'qituvchiga) — qoldi, foydalanuvchiga aytiladi.
- **Brend ro'yxati detektorda (Fiverr, Freelancer)** — faqat 12 da edi.
- **Universal ta'rif → «bu darsda»** — 08, 09, 10, 11, 12 (birinchi qadam) — bir naqsh.

## Tekshiruv
`lint:til` 12, tayanch — TOZA / 0 error · `mdtekshir.py` 12 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
