# 1-dars «Investorga pitchni qanday tuzasiz?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-559)

Filtr tartibi (`konveyer/1-MD.md`, memory `tashqi-audit-filtr`): har band → darsda bormi (grep) → fakt (tayanch, 12/13-Modul tayanchi, App.jsx) → qonun (QOIDALAR, TAQIQLAR, tayanch 7) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-01/` (hamma MD + tayanch). Tuzatish skripti: scratchpad `f01_tuzat.py` (36 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit uch qismda keldi: nomlar ro'yxati (1-qism) · o'z auditim (`01-OZ-AUDIT.md`) ko'rigi (2-qism) · 698 qatorli MD ning to'liq auditi (3-qism). Hukm: **Qabul 10 · Qisman 2 · Rad 3 · Allaqachon 7** (takrorlanganlari birlashtirildi).

## 1-qism — nomlar ro'yxati (umumiy baho 9/10, qayta nomlash yo'q)

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 1-dars pitch «investitsiya so'rash»ga aylanmasin; Keyingi qadamda pul emas, aniq yordam | Allaqachon | TAQIQLAR 1, A-13 chegara qatori, 9-ekran, 11 pul detektori, s12, Clear Ask!. 3-qism 2 bilan kuchaytirildi. |
| 2 | 3-dars: «tezlashdi» faqat oldin/keyin o'lchov; Mentor sonlari to'qilmaydi | Allaqachon | `03-ProductSpeed-v3.md`: Expo Atlas 21 joy, tayanch 1.14 «⛔ pilotda o'lchanadi». 3-dars auditida qaraladi. |
| 3 | 7-dars: «3 marta o'tdi» — «demo buzilmaydi» degani emas | Allaqachon | `07-PmDemoTest-v3.md` 12, 81: «Demo o'tishi xatosiz bo'lsa ham «demo buzilmaydi» deyilmaydi». 7-dars auditida qaraladi. |
| 4 | 10–11-darslar — tashqi faktlar qattiq audit | Ma'lumot | Upwork iborasi GATE M M-q2 A bilan sonsiz bo'ldi; YC «bugungi yo'l emas» (T14). O'sha darslar auditida. |
| 5 | TAXMIN joylarini «tasdiqlangan fakt» deb olmayman | Eskirgan | GATE M `14M-GATE-1` (08.10 07:04): T1–T20 hammasi A — tasdiqlangan; belgilar olib tashlandi (`GATE_M_JAVOB.md`). Auditor MD ning eski nusxasini ko'rgan. |

## 2-qism — o'z auditim ko'rigi (8.5/10)

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | TS9 — «pul so'ralmaydi, chunki kompaniya yo'q» asosiy learner-sabab bo'lmasin | **Qabul** | 3-qism 2 bilan bir — pastda. |
| 2 | TS8 — «Maqsad 50 — bajarildi» achievement ohangida bo'lmasin | **Qabul** | 3-qism 8 bilan bir — pastda. |
| 3 | `pm-m11d9-tasdiq.hisobga` — qattiq bog'lanmaslik, shartnoma | **Qisman** | 3-qism 5 — pastda. Aniqlik: ChatGPT 13-Modul 9-dars auditida taklif qilgan holatlar (tasdiq · aniqlashtirish · hozir yo'q · javobsiz · hisobga olinmaydi) 13-Modul tayanchi 8 ga **allaqachon kirgan** (`09-FILTR.md` 9, 21, 47; `hisobga: bool`, `aniqlashtirish`, `hozirYoq`, `javobsiz`). Xavf faqat qurilgan koddagi nom — shartnoma shuning uchun. |
| 4 | 10-ekran 6 karta — hard qur-gate, «bitta faol, qolgani qisqa» | Allaqachon + Qabul | ⛔ bor edi (Shubhali joylar, KOD 9, U-006). Qo'shildi: «shrift kichraytirib sig'dirish — yo'q» (3-qism 11). «Bitta bo'lak faol, qolgani ixcham» — 11-ekran allaqachon shunday (bittadan karta, E 53); 10-ekran tartib-mashqi — olti **birinchi gap** (uzun bo'laklar emas), 2 ustun zaxirasi bor. |
| 5 | 11-ekran ≈22 daqiqa — ikki qatlam: minimal → yaxshilash | **Qabul** | 3-qism 10 — pastda. |
| 6 | TS1–TS7, TS10 (null), TS11, TS12, TS14, TS15 — QABUL | Allaqachon | O'zgarishsiz; TS10 global `manba` — 3-qism 4. |
| 7 | Raqamlar gapi 1-darsda ham «Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q» bo'lsin | **Rad** | Tayanch 1.1 (GATE M T ✓): 1-dars matni «Pro'ga yozma tasdiq berdi — bu hali to'lov emas»; aniqroq variant — **5-dars hakam savolidan keyingi tuzatish** (8-dars TS3, GATE M M-q3 A, tayanch 1.1 «Tuzatilgan holat»). 1-darsda tuzatilgan matnni berish 5/8-dars pedagogik yoyini (hakam savoli → tuzatish) yo'q qiladi — auditorning o'zi «source continuity ruxsat bersa» degan; bermaydi. 1-dars gapi ham halol: «yozma tasdiq — bu hali to'lov emas». |

## 3-qism — 01 MD ning to'liq auditi (7.5/10)

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 0-ekran «Aynan!» / «Qiziq fikr!» — majburiy olib tashlash; «ichki contradiction» | **Rad** | T-028 (hookda xato tanlovga neytral «Qiziq fikr!»), T-067 (hook javobi shakli) — kurs qonuni; tayanch 7 (202): «tashqi auditda har safar RAD etilganlar, qayta ochilmaydi». «RAD etilganlar saqlangan» — oldingi modullarda tashqi audit so'rab, **rad etilgan** sinflar saqlab qolingani (ziddiyat emas, izoh). Memory `tashqi-audit-filtr` (06.10): 11-Modulda bir marta qabul qilinib, qonun topilgach qaytarilgan. |
| 2 | «Investitsiya kompaniyaga kiritiladi, bu loyihada kompaniya yo'q» — RAD; «Kompaniyangiz yo'q» premise | **Qabul** | Haq: huquqiy-iqtisodiy umumlashtirish (grant, jismoniy shaxs sarmoyasi bor — T-045 xavfi, men Shubhali joylarga yozgan edim). Kurs qoidasi yetarli. Tuzatildi: 9-ekran `QIzoh` → «Bu kursda pul so'ralmaydi — aniq so'rov: tanishtirish, maslahat yoki sinash joyi.» (83) · 12-ekran savoli → «Bu kursda Keyingi qadam bo'lagida nima aytasiz?» (7 so'z; distraktor A hayotda rost — «bu kursda» yopadi) · kartochka 12 → «Yozma tasdiq pitchda qanday aytiladi?» (12/12 saqlandi, §145 yangilandi) · takrorlash 12 band 2 · O'qituvchi eslatmasi 9: huquqiy gap faqat o'quvchi so'rasa (13-Modul TAQIQLAR 1). Tayanch 9.25. Supurish 2–13: 0. |
| 3 | Airbnb «Jamoa oxirida» — faqat ko'rsatilgan besh nom ichiga scope | **Qabul** | Haq (men Shubhali joylarda yozgan edim). 3-ekran bashorati → «Shu besh slayd ichida Jamoa qayerda turgan?», natija «shu besh slayd ichida — oxirida» · arena 4 → «Airbnb'ning besh slayd nomi ichida jamoa qayerda?» ✔ «Besh nomning oxirida» (uzunliklar 19–22) · O'qituvchi eslatmasi 3: real taqdimotda boshqa slaydlar ham bor. Tayanch 9.29. 3/3 Mentor gapi — bank so'zi, o'zgarmadi. |
| 4 | `pm-m12d1-pitch.manba` top-level — semantik noto'g'ri; per-bo'lak | **Qabul** | Haq: bir pitchda Muammo 12-Moduldan, Bozor yangi. Auditorning «alohida manbalar map» varianti olindi (`bolaklar` string bo'lib qoladi — 2, 5, 8, 11, 13 o'quvchilar o'zgarmaydi, grep: `manba` ni hech biri o'qimaydi): `manba: { muammo … keyingi }`, qiymat `'12-modul'` (oldindan, o'zgarmagan) · `'tahrir'` (oldindan, o'zgartirilgan) · `'yangi'` · `null`. Uchinchi qiymat — Fresh Numbers! uchun kerak edi (o'zgartirilganini bilish). 11-ekran Kirish, KOD 11, TS10, tayanch 8 va 9.27. |
| 5 | `.hisobga` ga qattiq bog'lanmaslik — shartnoma | **Qisman** | Shartnoma yozildi (11-ekran Kirish, KOD 10, Shubhali): «13-Modul 9-darsining tasdiqlangan sxemasidan hisobga olinadigan yozma tasdiqlar soni; maydon nomi «qur»da 13-Modul kodidan». Qisman — chunki 13-Modul sxemasi allaqachon final (2-qism 3). Tayanch 9.28. |
| 6 | Bozor ta'rifi ↔ 60 kishi — «hammasiga kerakligi tekshirilmagan» chegarasi | **Qabul** | 5-ekran 1-kartadan keyin `QIzoh`: «60 kishi — biz biladigan guruh a'zolari; hammasiga ilova kerakligi hali tekshirilmagan.» (88); O'qituvchi eslatmasi 5; KOD 7 (`QIzoh` ×3). Mentor gapi o'zgarmadi (tayanch 1.1). «auditoriya» so'zi ishlatilmadi — bu darsda atama emas; «guruh a'zolari» — 2-ekrandagi so'z. Tayanch 9.30. |
| 7 | Hook faqat Bozor bo'shlig'ini topadi, 2-ekran ikkita bo'lak — ko'prik | **Qabul** | Hook to'g'ri javobi: «Aynan! Besh bo'lakda bu savolga joy yo'q — yangi bo'lak kerak; hakamda yana bitta savol bor.» (97 ≤120, T-067); nom ochilmaydi (P-036). Boshqa ikki javob o'zgarmadi — 2-ekran baribir ikkalasini tug'diradi. |
| 8 | «Maqsad 50 — bajarildi» achievement ohangi | **Qabul** | 9-ekran: hisoblagich 50 belgisidan o'tadi, yashil ✓ bayram yo'q; `QIzoh` → «12-Moduldagi sonli qadam 51 ga yetdi — endi Keyingi qadam yangilanadi.» (72); dars ipi, TS8, o'z tekshiruvi 5. Tugma nomi «Maqsad 50» qoldi (12-Modul gapining so'zi). Arena 10 — fakt, o'zgarmadi. Tayanch 9.30. |
| 9 | Reja sarlavhasi natija-gap → savol | **Rad** | P-014: «sarlavha savol emas, natija va'dasi («Bugun … qilasiz»)» — kurs qonuni; tayanch 7 (202) RAD ro'yxatida. |
| 10 | 11-ekran 22 daqiqa — minimal tugatish / keyin yaxshilash | **Qabul** | Mentor (kalit yo'q): «Har kartaga avval bitta gap yozib «Saqlash»ni bosing — manba va sonni keyin qo'shasiz.»; O'qituvchi eslatmasi 11 — ikki qatlam; A-13 «Ulgurmasangiz». Tekshiruv o'zgarmadi (bo'sh — bloklaydi, qolgani yo'naltiradi — minimal qatlam shundoq ham o'tadi). ⛔ pilot taymeri qoldi. Tayanch 9.31. |
| 11 | 10-ekran: fontni maydalashtirib sig'dirish RAD | **Qabul** | KOD 9: «shrift kichraytirib sig'dirish — yo'q (E 41); sig'masa — 2 ustun». Tayanch 9.31. |
| 12 | Ism detektori — blocker emas; ishonchli PII (+998, email, @username, t.me/) hard warning | **Qabul** | 11-ekran tekshiruviga 10-dars naqshi: «@», «t.me/», «+998», 7+ raqam, havola — bloklaydi: «Pitchga telefon, akkaunt va havola yozilmaydi.» (47). Email — «@» bilan tutiladi. **Sinf-supurish:** yozma maydoni bor, detektori yo'q MD lar — 02 (8-ekran hikoya), 07 (5-ekran kutish yozuvi), 08 (5-ekran tuzatishlar) — qo'shildi; 05, 10, 11, 12 — bor edi; 13 — faqat tanlov. Tayanch 9.26. |
| 13 | Pul detektori «pul emas»ni ham ushlaydi — soft, QABUL | Allaqachon | O'zgarishsiz (Shubhali joylarda qabul qilingan). |
| 14 | Jamoa qismi kuchli | Allaqachon | O'zgarishsiz. |
| 15 | Bozor va Raqamlar ajratilishi | Allaqachon | O'zgarishsiz. |
| S | Sarlavhalar passi — faqat Reja | Rad | 9-band. |
| TS | TS8 shartli · TS9 RAD · TS10 manba RAD · TS13 shartli · qolgani QABUL | — | TS8 → 8, TS9 → 2, TS10 → 4; TS13 (reja yorlig'i olti nom) — P-015 «App.jsx bilan so'zma-so'z», 12-Modul naqshi — qoldi. |

**Yakuniy 6 shart:** 1 (Aynan!) — Rad (qonun) · 2 — bajarildi · 3 — bajarildi · 4 — bajarildi · 5 — shartnoma yozildi · 6 — ⛔ «qur» darvozasi (bor edi, kuchaytirildi).

## Sinf-supurish (13 MD + tayanch, grep)
- «kompaniya yo'q» / «kompaniyaga kiritiladi» / yuridik sabab o'quvchi matnida — 02–13: **0**.
- PII detektori yozma maydonlarda — 01, 02, 07, 08 ga qo'shildi (yuqorida 12).
- «qadam bajarildi» / «maqsad 50» bayram ohangi — 02–13: 0 (12-dars 596 — boshqa ma'no, «oylik maqsad» atamasi).
- Bank keysi tartib da'vosi — 02 (K19) da tartib savoli yo'q: 0.
- `manba` global — faqat 01 va tayanch 8; o'quvchilar o'qimaydi.
- «Aynan!» / «Qiziq fikr!» — 13 MD da hook naqshi bir xil (qonun), tegilmadi.

## Tekshiruv
`lint:til` 01, 02, 07, 08, tayanch — 0 error · `mdtekshir.py` 01/02/07/08 — ekran soni, arena 3/3/3/3, keyingi dars ✓ · `kesishma.py` — kalitlar tayanch 8 da, takror 0 · `lint:prompt` ✓ (natijalar jurnalda).
