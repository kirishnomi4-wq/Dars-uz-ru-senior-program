# 14-Modul (LMS) — jurnal · tungi avtopilot

> ⚠️ Avtopilotni **12-Modul seansi (internetlesson-6d, 55e53e99) bajarmoqda** — yangi seans 30 daqiqada ochilmadi. Boshqa seans: shu faylni ko'rsangiz, hech narsa yozmang.
> Prompt: `00-SEANS_PROMPT.md` (F-1008-550). Kod (keyin): `src/12-Modull`, `m12-NN`, App.jsx `id: '12'`, saqlash `pm-m12dN-…`, F-ID **550 dan**, port 5176.

## Chegara
- O'zgartiraman faqat: `feedback/F-1008-14modul/*` · App.jsx dagi `// ---- 12-Modul` izoh qatori va `id: '12'` bloki (`comp` siz, aniq Edit, oldin qayta o'qish).
- Tegmayman: boshqa modullar (13-Modul seansi tunda ishlayapti — `feedback/F-1007-13modul`, `src/11-Modull`, App.jsx `id: '11'`), konveyer, qolip, skelet, qonun fayllari, `maydon-jamoa`.
- Agentlar: 1-to'lqin 3 (01, 03, 07) · 2-to'lqin 10 (02, 04, 05, 06, 08, 09, 10, 11, 12, 13) — faqat MD. Commit — lokal, faqat shu papka, push yo'q. «Qur» yo'q.

## Holat
| Bosqich | Holat |
|---|---|
| 0 · Manba (`00-MANBA.md`) | ✅ 02:35 (F-1008-551) |
| 1 · Qaror sahifasi (TAXMIN bilan davom) | ✅ 02:39 — 20 savol, hammasi A (TAXMIN T1–T20); javob kutilmoqda |
| 2 · `00-NOMLAR.md` + App.jsx `id: '12'` | ✅ 02:41 (17 qator, `comp` siz; App.jsx commitsiz) |
| 3 · Tayanch + taqiqlar + MD topshirig'i | ✅ 02:47 (F-1008-554) |
| 4 · 1-to'lqin: 3 pilot MD | ⏳ 02:48 yuborildi (01, 03, 07) |
| 5 · O'z auditi + 2-to'lqin 10 MD | — |
| 6 · O'zaro tekshiruv · GATE M sahifasi · ERTALAB_HISOBOT | — |

**Keyingi qadam:** 4-bosqich — 1-to'lqin: 3 pilot MD agenti (01, 03, 07), fon; keyin o'zim tekshiraman.

## TAXMINLAR (foydalanuvchi ertalab tasdiqlaydi)
Sahifa: https://claude.ai/artifact/MxCJubQJFcREWw42QYvH5x (`14M-QAROR-0`, `qaror-0.json`). Har biri — tavsiya (A); MD da `<!-- TAXMIN Tn -->` bilan belgilanadi.
- **T1** (IP) Final pitch tuzilmasi qanday? → **A**: Olti bo'lak: Muammo · Bozor · Yechim va jonli demo · Metrikalar · Jamoa · Keyin; 5 daqiqa + hakamlar savol-javobi (Demo Day 8 formati). 12-Modul besh bo'lagidan farqi — Bozor va Jamoa qo'shiladi, savol-javob tayyorlanadi
- **T2** (IP) «Bozor» bo'lagida qaysi sonlar aytiladi (Mentor misoli)? → **A**: Faqat bizda bor sonlar: mahalla futbol guruhi — 60 kishi, 6 tashkilotchi, 51 foydalanuvchi; boshqa mahallalar — «hali tekshirilmagan» deb halol aytiladi. Yangi son to'qilmaydi
- **T3** (IP) Pitch oxirida («Keyin» bo'lagi) nima so'raladi? → **A**: Pul emas — aniq yordam: «3 tashkilotchi bilan «Doimiy o'yin»ni sinash uchun maydon egalari bilan tanishtiring» kabi bitta so'rov (o'smirda yuridik shaxs yo'q — investitsiya summasi so'ralmaydi)
- **T4** (REPO) Teglar qanday? → **A**: `m14-dars-NN-start` / `-done` (`yechim` tarmog'ida), `m14-dars-01-start` = `m13-dars-12-done`; PM darslarida `-done` = `-start`; o'quvchi — o'z final repo'sida, o'z trekida; «Ortda qoldingizmi» — birinchi blokda, yangi papkada
- **T5** (TEZ) 3-darsda nima o'lchanadi? → **A**: Ikkala trek: web (lending + sayt yoki iPhone brauzer ko'rinishi) — Lighthouse Performance, mobil rejim, oldin/keyin; mobil trek — Expo Atlas bundle hajmi oldin/keyin + brauzer ko'rinishi Lighthouse. Ikki tuzatish: rasm (o'lcham, p…
- **T6** (TEZ) Mentor misolining sonlari? → **A**: MD da son yo'q — «⛔ pilotda o'lchanadi» belgisi; «qur» da haqiqiy o'lchov yoziladi
- **T7** (SAYQAL) Qaysi joylar sayqallanadi? → **A**: Demo yo'lidagi uch joy: tugma bosilgandagi javob · yuklanish holati («Yuklanmoqda…» o'rniga joy egallovchi) · muvaffaqiyat (qo'shilganda kichik animatsiya); prefers-reduced-motion hurmat qilinadi; yangi funksiya yo'q
- **T8** (DEMO) Demo qayerda ko'rsatiladi? → **A**: Laptopdagi brauzerda (web-trek — sayt; mobil trek — 12-Modulda qurilgan brauzer ko'rinishi) proyektorga; telefon — ikkinchi qurilma (ikkinchi o'yinchi) sifatida; B reja — 60 soniyalik ekran videosi; demo oldidan Backend'ni uyg'oti…
- **T9** (DEMO) 6-dars (TEX) shakli? → **A**: Loyiha kuni shakli — 8 ekran + 3 blok + kartochkalar = 12: A1 demo stsenariysi va risklar · A2 B reja (video) va Backend'ni uyg'otish · A3 «yangi funksiya to'xtatildi» tegi va bitta to'liq demo o'tishi
- **T10** (DEMO) Atama: dasturdagi «progon» → **A**: «demo o'tishi» — demoni boshidan oxirigacha bir marta ko'rsatish; «sinov» so'zi ishlatilmaydi (kurs atamasi: sinov — faqat real odam bilan)
- **T11** (PITCH) Darslar qanday ajratiladi? → **A**: 5 — guruh oldida olti bo'lakli pitch, varaq har bo'lakka ✓/✗ + bitta hakam savoli → tuzatishlar ro'yxati (3 band) · 8 — tuzatilgan pitch, taymer 5:00 + savol-javob mashqi (3 savol, 1 daqiqa) · 13 — Demo Day formatida to'liq o'tish…
- **T12** (VIDEO) Video qoidasi? → **A**: Yuz va ism — ixtiyoriy (ekran yozuvi + ovoz yetarli); ommaviy joylanmaydi — fayl yoki «faqat havola bilan» ko'rinadigan joy; ota-ona roziligi bilan; mijoz, sinfdosh ma'lumoti va maxfiy kalit ekranda ko'rinmaydi. Dars shakli — loyi…
- **T13** (ISH) Darsdagi yo'l? → **A**: Xalqaro saytlar (Upwork kabi) — «odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing»; bugun — lokal birinchi buyurtma rejasi (tanish do'kon, maktab yoki to'garak uchun lending yoki bot; pul va kelishuv — ota-ona orq…
- **T14** (DASTUR) Darsdagi asosiy dastur? → **A**: Diamond Challenge (rasmiy shartlari o'smirga mos) — ro'yxatdan o'tish va konsept qoralamasi (boshlangan ariza); YC — «bugungi yo'l emas: asoschilar to'liq vaqt ishlaydi, Early Decision — talabalar uchun» deb halol tushuntiriladi; …
- **T15** (REJA) Reja shakli? → **A**: Uch yo'nalish: mahsulot (davom ettiraman / to'xtataman + sabab) · ko'nikma (nima o'rganaman) · ish (buyurtma, stajirovka yoki dastur — 10, 11-darsdan); har yo'nalishga oylik bitta nishon va birinchi qadam sanasi; 13-Modul refleksi…
- **T16** (QATOR) 15-qator «Встреча выпускников»? → **A**: comp siz tadbir qatori, nomi «Bitiruvchilar bilan uchrashuv»; mazmuni tashkilotchi bilan (birinchi oqimda — IT mutaxassis yoki oldingi oqimlar bitiruvchisi); dars qurilmaydi
- **T17** (QATOR) 16 Demo Day 8 va 17 marosim? → **A**: Ikkalasi comp siz qator (type: 'Demo'); Demo Day 8 tartibi 13-dars MD sida (general repetitsiya — o'sha formatda)
- **T18** (KEYS) Keyslar? → **A**: 1 — K12 Airbnb pitch deck (YC Demo Day o'rniga); 2 — K19 iPhone taqdimoti; qolgan darslar keyssiz
- **T19** (ATAMA) Yangi so'zlar? → **A**: performance → «tezlik» (Lighthouse bahosi — «Performance» nomi bilan) · polish → «sayqal» · Q&A → «savol-javob» · hakam · pitch slaydlari · storytelling → «hikoya» · frilans · stajirovka (amaliyot emas) · video-portfolio
- **T20** (NOM) Nomlar? → **A**: 1 Investorga pitchni qanday tuzasiz? · 2 Mahsulotingiz hikoyasini qanday aytasiz? · 3 Mahsulot tezligi: o'lchaymiz va tezlashtiramiz · 4 Loyiha kuni: demo uchun sayqal · 5 Guruh pitchingizda nimani tuzatishni aytadi? · 6 Demoga ta…

## Yozuvlar
- **2026-10-08 02:31** — **F-1008-550** · avtopilot boshlandi (12-Modul seansi). Foydalanuvchi qarorlari (savollarga javob, 01:57 dan oldin): agentlar 3 + 10 · qaror savollari — tavsiya bilan, TAXMIN · commit lokal, push yo'q · uyqu bloki (systemd-inhibit, 10 soat, faol) + nazorat cron.
  Yangi seans ochilmadi (02:29: `ListAgents` — faqat 13-Modul `internetlesson-c3` va AILM) → ishni shu seans bajaradi; cron worker rejimiga o'tkazildi.
- **2026-10-08 02:35** — **F-1008-551** · 0-bosqich: `00-MANBA.md` — dastur 17 qator (MD 1–13; 14–17 `comp` siz) · App.jsx (oxirgi `m11-13` Zaxira; 13-Modul seansi `m11-03`, `m11-06` ga comp ulagan) · 13-Moduldan holat (teg `m13-dars-12-done`, Mentor sonlari 51 · 6 tashkilotchi · 15 000 so'm · 3 tasdiq) ·
  atamalar grep (storytelling, YC, Lighthouse, frilans, grant, hakam — o'tilmagan; «yc»/«hikoya» soxta moslik tekshirildi) · tashqi faktlar: Lighthouse 10 vaznlari, Expo Atlas, `loading="lazy"`, Diamond Challenge (14–18, 2–4 kishi, 14.01.2027), YC FAQ (yosh yo'q) — rasmiy; **Upwork rasmiy sahifasi 403 → tekshirilmadi**; lokal grantlar — tekshirilmadi · keyslar: K12 (1), K19 (2) nomzod.
- **2026-10-08 02:39** — **F-1008-552** · 1-bosqich: `qaror-0.json` (14 bo'lim, 20 savol) → `sahifa.py` → Artifact https://claude.ai/artifact/MxCJubQJFcREWw42QYvH5x. Kechasi hammasi A (TAXMIN T1–T20). Asosiy halollik qarorlari: pitchda yangi son yo'q (Bozor — bor sonlar), investitsiya summasi so'ralmaydi, Upwork — «odatda 18 yoshdan» (rasmiy matn tekshirilmadi), Diamond Challenge — rasmiy shartlar, YC — halol «bugungi yo'l emas», video ommaviy emas, 15-qator — o'ylab topilgan bitiruvchi yo'q.
- **2026-10-08 02:41** — **F-1008-553** · 2-bosqich: `00-NOMLAR.md` (17 nom ≤55, lint:til toza; 10-dars nomidan «stajirovka» olindi — T-011, qaror sahifasi ham yangilandi, versiya 2) · App.jsx: `// ---- 12-Modul` izoh (13-Modul importlaridan keyin) + `id: '12'` bloki (17 qator, `comp` siz) — ikki aniq Edit, esbuild ✓, lint:jsx toza, 5174 da App.jsx 200. App.jsx commitga kirmaydi (ertalab buyruq bilan).
- **2026-10-08 02:47** — **F-1008-554** · 3-bosqich: `00-MODUL-TAYANCH.md` (misol-ip 1.0–1.14, atamalar, repo/teglar, darslar jadvali — ekranlar 16·15·19·12×10, keyslar K12/K19, faktlar, **18 sinf** (13-Modul 16 + 14-Modulga xos 2), saqlash kalitlari 12 ta, ruscha lug'at) · `00-TAQIQLAR.md` (13-Modul asosida; 1-bo'lim — investitsiya, video, yosh, buyurtma, kafolat) · `MD_AGENT_TOPSHIRIQ.md` (umumiy + 3 pilot qatori: 01 PM 16, 03 TEX 19, 07 PM+PRAKT 12; TAXMIN belgilash qoidasi).
- **2026-10-08 02:49** — **F-1008-555** · 4-bosqich: 3 pilot agent 02:48 da yuborildi (01 `PmInvestorPitch` PM 16 · 03 `ProductSpeed` TEX 19 · 07 `PmDemoTest` PM+PRAKT 12; general-purpose, fon, har biri bitta MD). Kutish paytida: `vositalar/mdtekshir.py` (13-Modul mdtekshir + qisqa asosida: ekranlar/reja, uzunliklar, arena, keyingi dars, TAXMIN, taqiq naqshlari, lint:til) va `MD_TOPSHIRIQ_2.md` (10 qator + eslatmalar; «pilotlardan saboq» — keyin).

## Nazorat (cron, har 15 daqiqa)
- 2026-10-08 02:49 · 4 · agentlar 3 ishlayapti (01, 03, 07) · chegara: faqat F-1008-14modul + App.jsx 12-blok; push yo'q (origin..HEAD — faqat o'z commitlarim) · uyqu bloki ✓

## MEXANIZM-TAKLIF
