# 7–14-M dagi 9 pitch darsi — 222-qonun rejasi (GATE M uchun) · F-1018-04 · 2026-10-18
Foydalanuvchi: «ularga ham ruxsat beraman, rejani to'liq ko'r — dizayn, metodika, barcha tomonlari; tasdiqlasam kodga o'tasan». Kodga TEGILMAGAN.

## 0. Halol tashxis — bu 9 dars m1-12 / m2-13 dan farq qiladi
- Hammasi konveyer bilan qurilgan (MD v3 + GATE M, 05–08.10), 7–14-M QA'dan o'tgan (F-1015-156…225), qolip `src/qolip` (QKirish · QReja · QTushuncha · QVoqea · QMustaqil · QKod).
- Har birida **haqiqiy gapirish ekrani bor** (juftlik/guruh, taymer, baholash varag'i) va **ustaxona** (pitch yoziladi, artefakt saqlanadi, keyingi dars o'qiydi). Bu m1-12 da yo'q edi.
- 222-qonundan chetlanish: **3–4 test** (yakuniy bilan), **keys** ekrani + uning testi, **kod yozish** (4 darsda), **kartochkalar** (hammasida), ba'zida **gapirish 1 marta**. Ekran soni 12–17, bosish ekranlari ko'p.
- Shuning uchun bu yerda qayta qurish EMAS — **qisqartirish + 2-raund + tekshiruv sahifasi**. Ustaxona va gapirish ekranlari o'zgarmaydi (QA'dan o'tgan), metodika zinasi saqlanadi.

## 1. Metodika zinasi (saqlanadi)
| Dars | Ko'nikma | Pitch | Gapirish hozir |
|---|---|---|---|
| m7-12 | real foydalanuvchi hikoyasi raqam yonida | 1 daq · 3 slayd | juftlik 2 daq + yakka 1 daq (1 ekranda) |
| m8-11 | 5 daqiqa, baholash varag'i, qattiq fidbek | 5 daq · 5 slayd | 5 daq + varaq → tuzatish |
| m9-16 | yangi mahsulot + jonli demo | 3 daq · 4 bo'lak | juftlik: Ayting · Baholang · Tuzating |
| m10-11 | da'vo ↔ dalil, mentor yakkama-yakka | tuzatilgan pitch | yo'q (mentor 1:1 og'zaki) |
| m10-12 | o'sish grafigi — dalil | 5 bo'lak | juftlik: Ayting · Baholang · Tuzating |
| m12-01 | investor: 6 bo'lak | qoralama | yo'q (tuzilma darsi) |
| m12-02 | hikoya, funksiyalar ro'yxati emas | hikoya 3 karta | video/taymer (yakka) + o'zini tekshirish |
| m12-05 | guruh fidbeki | mashq 1 | guruhda 5 daq (1 raund) |
| m12-08 | final taymer + savol-javob | mashq 2 | 5 daq juftlik + savol-javob mashqi |

## 2. Umumiy qoidalar (hammasiga)
**Qoladi:** Kirish (QKirish) · Reja (QReja) · metodika tashuvchi Tushuncha ekranlari · Ustaxona/Mustaqil ish (yozish) · gapirish ekranlari · **bitta test = hozirgi yakuniy savol** · Arena/podium · Yakun.
**Olinadi:** oraliq testlar (1–3 ta) · kartochkalar (hammasida, 219.4) · kod yozish: m7-12 (HTML slayd), m8-11 (Neon SQL), m9-16 (Neon SQL) — SQL bajarilmaydi, son qo'lda yoziladi; m10-12 grafik — QAROR 2.
**Keys ekranlari** (Canva · Airbnb ×2 · iPhone ×2 · Uzum) — QAROR 1.
**Qo'shiladi:** gapirish 2-raundi yo'q joyda — «Qayta ayting» qadami (1 daqiqa, tuzatilgandan keyin) yoki juftlik ekrani · «Mahsulotingizda kamchilik bormi?» sahifasi — QAROR 3.
**Dizayn:** 7–14-M qolipi (QMustaqil kartasi, 219: o'chiq tugma yo'q, 216: kirish javobi qisqa). m1-12 dagi ko'rinish KO'CHIRILMAYDI — yangi sahifa QMustaqil uslubida (chapda havola + so'rov namunasi, o'ngda 3 karta).
**Texnik (har dars):** lessonId v1 → v2 (progress toza) · SCREEN_META · INLINE_KEYS (faqat yakuniy + practice sentinel) · RECAPS (yakuniy kaliti) · Q_LABELS · nishonlar: test/kod nishonlari → gapirish/tuzatish nishonlariga · QUIZ_BANK: keys/kod savollari almashtiriladi (m7-12 1 · m8-11 2 · m9-16 3 · m10-12 6 · m12-01 2 · m12-02 2 = 16 savol) · o'lik CSS · sinov tekshir+ru · gates 12/13 (tell/emoji zaxira bilan).
**Vaqt (80 daq):** kirish+reja 5 · tushuncha 10–15 · yozish 15–20 · gapirish 2 raund 20–25 · test+arena 8 · tekshiruv sahifasi 8 (bor joyda) · yakun 3.

## 3. Dars-dars reja
Belgilar: ✅ qoladi · ✂ olinadi · ➕ yangi · ❓ qaror.

### m7-12 «Pitchingizda kimning hikoyasi bor?» — 16 → 10 (keys bilan 11)
✅ Kirish («Maydon» ikki slayd) · Reja · Raqam va hikoya (s2) · Yozuvdan olingan gap — saralash (s4) · ❓ Canva (s6) · Uch slayd (s8) · Mustaqil ish: slaydlar (s9) · **Yakuniy savol** (s11) · Repetitsiya (s12: juftlik 2 daq + yakka 1 daq = **2 raund**) · Arena · Yakun
✂ 1-, 2-, 3-test · Kod yozish HTML (s10) · kartochkalar. Arena: 1 savol almashadi.

### m8-11 «Besh daqiqada nimani ko'rsatasiz?» — 17 → 11 (12)
✅ Kirish · Reja · Besh slayd (s2) · ❓ Airbnb (s4) · Raqamlar slaydi (s6) · Baholash varag'i — saralash (s8) · **Yakuniy savol** (s9) · Mustaqil ish 5 slayd (s11) · Repetitsiya 5 daq + varaq (s12) · Tuzatish (s13) ➕ oxirida «Tuzatilgan slaydni sherikka 1 daqiqada qayta ayting» (taymer, **2-raund**) · Arena · Yakun
✂ 1-, 2-, 3-test · Neon SQL bosh raqam (s10 — son mustaqil ishda qo'lda, 8-10 yo'l hisobotidan) · kartochkalar. Arena: 2 savol.

### m9-16 «G'oyangiz va ilovangiz guruhni ishontiradimi?» — 16 → 11 (12) · Demo Day 7 oldidan
✅ Kirish · Reja · To'rt bo'lak (s2) · Muammo va dalil (s4) · ❓ iPhone (s6) · Jonli demo (s8) · Pitch yozish (s10) · **Yakuniy savol** (s12) · Juftlikda pitch (s11: Ayting · Baholang · Tuzating) ➕ 4-qadam «Qayta ayting — 1 daqiqa» (**2-raund**) · ➕ **«Ilovangizda kamchilik bormi?»** (telefonda ochiladi · Render uyg'oq (2–3 daq oldin ochish) · asosiy harakat ishlaydi; havola maydoni; Gemini/Copilot so'rov namunasi) · Arena · Yakun
✂ 1-, 2-, 3-test · Neon SQL son (s9) · kartochkalar. Arena: 3 savol.

### m10-11 «Raqamlaringiz pitchni qanday o'zgartiradi?» — 12 → 11
✅ Kirish · Reja · Da'vo va dalil (s2) · Son, manba, qachon (s3) · Da'volaringiz (s5) · Dalillar (s6) · Tuzatilgan pitch (s7) · **Yakuniy savol** (s8) · ➕ **Juftlikda: tuzatilgan pitch** 2 daq, sherik «qaysi gapga dalil yo'q?» deb belgilaydi (mentor yakkama-yakka o'tkazayotganda qolganlar shu ishda — 1:1 + juftlik = **2 raund**) · Arena · Yakun
✂ test s4 · kartochkalar.

### m10-12 «Raqamlaringiz zalni ishontiradimi?» — 16 → 11 (12/13)
✅ Kirish · Reja · Besh bo'lak (s2) · O'sish grafigi (s4) · ❓ Uzum (s6) · Jonli demo (s8) · ❓ Kod yozish: grafik (s9 — QAROR 2) · Pitch yozish (s10) · **Yakuniy savol** (s12) · Juftlik (s11) ➕ «Qayta ayting» (**2-raund**) · Arena · Yakun
✂ 1-, 2-, 3-test · kartochkalar. Arena: 6 savol (eng ko'pi — grafik/kod haqida).

### m12-01 «Investorga pitchni qanday tuzasiz?» — 16 → 10 (11)
✅ Kirish · Reja · Olti bo'lak (s2) · ❓ Airbnb (s3) · ➕ **Uch yangi bo'lak** — Bozor (s5) + Jamoa (s7) + Keyingi qadam (s9) BITTA ekranda, 3 karta ketma-ket (uchalasi «tugmani bos → bo'lak o'zgaradi» mexanikasi, alohida ekran kerak emas) · Mentor qoralamasi — tartib mashqi (s10) · Pitch qoralamasi (s11) · **Yakuniy savol** (s12) · ➕ **Sherikka o'qing** — qoralamani 2 daqiqada o'qib berasiz, sherik olti bo'lakdan qaysi biri yetishmasligini belgilaydi (**1-raund**; bu tuzilma darsi — 2-raund 12-02/05/08 da) · Arena · Yakun
✂ 1-, 2-, 3-test · kartochkalar. Arena: 2 savol.

### m12-02 «Mahsulotingiz hikoyasini qanday aytasiz?» — 15 → 10 (11)
✅ Kirish · Reja · Ro'yxat va lahza (s2) · ❓ iPhone (s4) · Hikoya pitchda (s6) · Hikoyangiz (s8) · Videoga yozish (s9, **1-raund**) · O'zingiz tekshiring (s10) ➕ «Sherik tekshiradi» rejimi — hikoyani sherikka aytasiz, u shu varaqni to'ldiradi (**2-raund**) · **Yakuniy savol** (s11) · Arena · Yakun
✂ 1-, 2-, 3-test · kartochkalar. Arena: 2 savol.

### m12-05 «Guruh pitchingizda nimani tuzatishni aytadi?» — 12 → 9
✅ Kirish · Reja · Mentor varag'i (s2) · Tuzatishlar ro'yxati (s4) · Guruhda pitch (s6, guruh raundi — har kishi 5 daq ≈ 20–25 daq) · Tuzatishlaringiz (s7) · **Yakuniy savol** (s8) · Arena · Yakun
✂ 1-, 2-test · kartochkalar. **2-raund — QAROR 4** (vaqt yetmaydi; tavsiya: istisno, 2-raund 12-08 da).

### m12-08 «Final pitchingiz 5 daqiqaga tayyormi?» — 12 → 11 · Demo Day 8 oldidan
✅ Kirish · Reja · Savol-javob (s2) · Tuzatish va taymer (s3) · Tuzatishlaringiz (s5) · 5 daqiqa (s6, **1-raund**) · Savol-javob mashqi (s7, **2-raund**) · **Yakuniy savol** (s8) · ➕ **«Mahsulotingizda kamchilik bormi?»** (demo ssenariysi pm-m12d6-demo dan: telefon · asosiy harakat · savol-javobda ko'rsatiladigan ekran) · Arena · Yakun
✂ test s4 · kartochkalar.

## 4. Natija (keys olinsa / qolsa)
| Dars | Hozir | Keyin | Gapirish raundi | Test | Qo'shimcha |
|---|---|---|---|---|---|
| m7-12 | 16 | 10 / 11 | 2 | 1 | — |
| m8-11 | 17 | 11 / 12 | 2 | 1 | qayta aytish |
| m9-16 | 16 | 11 / 12 | 2 | 1 | qayta aytish + ilova tekshiruvi |
| m10-11 | 12 | 11 | 1:1 + 1 | 1 | juftlik ekrani |
| m10-12 | 16 | 11 / 12 (+1 grafik) | 2 | 1 | qayta aytish |
| m12-01 | 16 | 10 / 11 | 1 | 1 | uch bo'lak birlashadi, sherikka o'qish |
| m12-02 | 15 | 10 / 11 | 2 | 1 | sherik tekshiradi |
| m12-05 | 12 | 9 | 1 (guruh) | 1 | — |
| m12-08 | 12 | 11 | 2 | 1 | mahsulot tekshiruvi |
Jami: 132 → 94 (keys olinsa) / 100 ekran. Kod: ≈ 30 000 → ≈ 24 000 qator (har darsda kartochkalar ≈ 1 000 qator).

## 5. Qarorlar (foydalanuvchi)
1. **Keys ekranlari** (6 ta): A — olinadi (222.4 bilan izchil, m2-13 dagidek; mentor «slaydga kirmayman» degan) · B — qoladi, faqat testi olinadi (PM_DARS_ETALON keys talabi). **Tavsiya: A** (pitch darslarida; boshqa PM darslarida keys joyida).
2. **m10-12 grafik kodi** (s9): A — olinadi, grafik o'rniga hisobotdagi sonlar pitchga matn bo'lib tushadi · B — qoladi (pitch artefaktini yasaydi, o'quvchi kodlaydi). **Tavsiya: B** — bu kod pitch slaydini yasaydi, begona emas.
3. **Mahsulot tekshiruvi sahifasi:** faqat m9-16 va m12-08 (Demo Day oldidan) — **tavsiya**; yoki 9 tasiga ham.
4. **m12-05 ikkinchi raund:** istisno (guruh raundi 20+ daq) — **tavsiya**; yoki «tuzatilgan bo'lakni sherikka 1 daq qayta ayting» qo'shiladi.
5. **Tartib:** birma-bir (har dars → sinov → ko'rik) yoki 9 tasi bir yo'la (tun avtopiloti, ertalab ko'rik).

## 6. Xavf va chegaralar
- `src/10-Modull` va `src/12-Modull` fayllari HOZIR boshqa seans tomonidan tahrirlanmoqda (git status: PmPitchReviewLesson, PmGrowthPitchLesson, PmFinalPitchLesson ham) — kodga o'sha seans yopilgach o'tiladi, aks holda ikki seans bir faylga yozadi (parallel-seans qoidasi).
- Keyingi darslar bu darslarning artefaktini o'qiydi (pm-m7d12-pitch → m8-11; pm-m9d16-pitch → m10-11; pm-m12d1-pitch → m12-02/05/08) — kalitlar va maydon nomlari o'zgarmaydi.
- QA saytlari (9, 10, 11, 12, 14-Modul) qayta deploy — nazorat bilan; LMS'ga yuklash — foydalanuvchi qo'lda.
