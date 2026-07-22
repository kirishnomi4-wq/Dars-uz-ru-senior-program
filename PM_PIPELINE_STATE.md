# 📊 PM PIPELINE HOLAT MANIFESTI

> Bosqichlar: S Senariy(+korrektura) · 1 Quruvchi · 2 Dizayn · 3 Jonli · 4 Metodist · 5 Tekshiruvchi · 6 Verifikator · 7 Qabulchi.
> Belgilar: ⬜ boshlanmagan · 🔵 jarayonda · ✅ tugadi · 🚦 human-gate kutmoqda.
> Manba: `CoddyCamp_Senior_2026_Final (7).pdf` darslar xaritasi (75 PM dars) + `PM_Prompt_v8.md`.
> Eski platformadagi PmLesson1-6 (texnik-pipeline v18) va PmLesson7-18 (v16) — PM dasturiga KIRMAYDI (foydalanuvchi qarori 2026-07-15: e'tiborga olinmaydi).

## P0 — etalon-dars
| Dars | Fayl | Holat |
|---|---|---|
| **M3-D2 «User Story: kim va nima uchun?»** | `src/pm/PmUserStoryLesson.jsx` (`pm-m3d2-v1`) | 🚦 **v3 — FOYDALANUVCHI KO'RIGI kutilmoqda (2026-07-16)** — foydalanuvchi «shunchaki tuzilgan, tushunarsiz» bahosi + auditor GAP asosida TO'LIQ QAYTA-SAYQAL: **s10 KODING=REAL iframe-kompilyator** (HC_ harness, postMessage+nonce, jonli User Story kartalari; HtmlCompiler dvijoki, PM-STUDIA tokenlar) · **Screen3 konstruktor endi haqiqiy sinov** (aralash neutral chiplar, 2-qadam tanlash, shake tirik) · **s12 yangi PM-topshiriq kartasi** (jonli to'ladi + «uyda 3 qadam»; summary-takror olib tashlandi) · **s2 tap-mashq** (harakat/sabab, indigo hint) · metodist TO'LIQ o'tish (texnik-metodist maktabi): test-shartlar bir-o'qishda tushunarli, chip-nomlar aniq, arena uzunlik-tell 8/12→1/12, EKRAN-400 hammasi ≤400 (hook 303 · ustaxona 301 · koding 314 · s2 389 · s12 396, ⭐-blok yopiq-toggle) · tekshiruvchi: 12 arena-savol mazmunan ✅, o'lik CSS tozalandi, 1 qaytarish (400) yopildi · verifikator IMZOLADI (esbuild+vite toza, 15/15 walk uz+ru, s10 iframe srcDoc OK, arena solo 13100≠0, App m3-02) · qabulchi hali chaqirilmagan (ixtiyoriy) · UNCOMMITTED · jonli-sinov qo'lda kutilmoqda |

> Senariy: `pm-senariylar/M3-D2-UserStory.md` (K11 ishlatildi; TEKSHIRUV mexanikasi = Hotspot/xato-topish — M3-D5'da TAKRORLANMASIN).
> **P0 foydalanuvchi imzosidan keyin:** `PM_DARS_ETALON.md` yoziladi (PM-STUDIA identitet-pasporti + P0 manba-xaritasi grep-anchor bilan) — keyingi PM darslar shu etalon+P0'dan quriladi.

## P1 partiya (2026-07-16, parallel — etalon-fidelity sinovi) — ✅ TUGADI
| # | Dars | Fayl | Bosqich |
|---|---|---|---|
| 1 | M7-D2 «Jobs-to-be-Done» (K18 Starbucks) | `src/pm/PmJtbdLesson.jsx` (`pm-m7d2-v1`) | 🚦 **FOYDALANUVCHI KO'RIGI** — to'liq zanjir ✅: korrektura(3) · quruvchi · dizayn (kofe-stakan imzo) · jonli 10/10 · metodist(5) · QA TAYYOR (K18-yorliq oqishi tuzatildi) · verifikator IMZOLADI (15/15 walk uz+ru) · **qabulchi PASS 20/20** · App `m7-02` · UNCOMMITTED · jonli-sinov qo'lda |
| 2 | M8-D1 «Metrika nima» (K5 Duolingo) | `src/pm/PmMetricsLesson.jsx` (`pm-m8d1-v1`) | 🚦 **FOYDALANUVCHI KO'RIGI** — to'liq zanjir ✅: korrektura(8, «millionlab» olib tashlandi) · quruvchi · dizayn (streak-alanga imzo) · jonli 10/10 · metodist(7 tell) · QA TAYYOR (anti-cheat dalillangan) · verifikator IMZOLADI (15/15 uz+ru) · qabulchi 19✅+1🔴 (Screen2=414gr) → bosh-agent qisqartirdi (378gr) · App `m8-01` (yangi M8 bo'lim) · UNCOMMITTED · jonli-sinov qo'lda |

> Yangi primitiv P1'da tug'ildi: **MatchPairs** (juftlash: birinchi-urinish mukammal=picked 0 / aks holda 1, INLINE_KEYS=0, Kahoot-reveal, tap-fallback) — ikkala darsda ishlaydi, keyingi darslar shu ikkisidan ko'chiradi.
> P1 saboqlari: (a) K-kod yorlig'i EKRANga oqmasin (P0'da ham tuzatildi, lug'atda); (b) EKRAN-400 konvensiyasi: mentor-pufak SHU JUMLADAN (etalon 4.9); (c) export-nom P0'dan qolib ketishi mumkin — qabul-ko'zi.

## P0 foydalanuvchi-ko'rigi 1-raund (2026-07-16) — ✅ TUZATILDI, etalonga muhrlandi
8 punkt tuzatildi (`src/pm/PmUserStoryLesson.jsx`): (1) «yadro/g'alati/darsda ochiladi» jargon-leak → sodda til; (2) s1 MAQSAD statik-qiyshiq siluet → `DEMO_STORIES` jonli natija-preview; (3) s5 mentor-pufak qalin/raqamlangan → savol-ohang, ≤2 `<b>`; (4) ustaxona overflow bugi → `overflow-wrap:anywhere`+`min-width:0`; (5) s9 dark-mode testi «ikki-to'g'ri-variant» buzuq edi → tashxis-test (`ctaLabel`/`revealPrefix`), kalit 1 O'ZGARMADI; (6) KODING inline → to'liq-ekran `PmCompiler` (launch-karta + jonli shart-chiplar + debounce); (7) summary CTA kapsula ixcham (`.cs-cta .cs-cap`); (8) sarlavhalar savol-murojaat + MentorNote faqat 4 zarur ekranda. Qonunlar: `PM_DARS_ETALON.md` 4-bo'lim **14-20** + metodist/quruvchi/dizayn/tekshiruvchi rol fayllari. vite build ✅ · UNCOMMITTED · foydalanuvchi qayta-ko'rigi kutilmoqda.
**2-raund mikro-tuzatishlar (foydalanuvchi bilan jonli):** test-cue'lar ham savol-ohangga o'tdi (5/7-page); **«formula» → «retsept»** (foydalanuvchi tanlovi, 4 variantdan): uch masalliq=KIM+NIMA+NATIJA, «xom hikoya» metaforasi — milkshake keysi bilan bitta oshxona-oila; sarlavhalar «Hikoya retseptini o'zingiz tuza olasizmi?» / «Retseptni kod ham tuza oladimi?», QUIZ_BANK savol-matnlari mos yangilandi (correct indekslar TEGILMAGAN).

## P2 raund (2026-07-16 kech) — JTBD + Metrika P0-etalonga ko'tarildi — ✅ IKKALASI PASS 20/20
| Dars | Zanjir | Hukm |
|---|---|---|
| M7-D2 JTBD (`pm-m7d2-v1`) | auditor(7🔴) → quruvchi (PmCompiler to'liq-ekran + DEMO_JTBD WOW + overflow + CTA) → metodist (jargon/savol-sarlavha/mentor-ohang; 2-aylanish: s1=398gr, s2=395gr, s9 MentorNote) → dizayn (o'lik CSS tozalandi) → jonli 7/7 ✅ → tekshiruvchi (2 band→yopildi) → verifikator IMZO (5 ekran render 0-xato) | **qabulchi PASS 20/20** |
| M8-D1 Metrika (`pm-m8d1-v1`) | auditor(4🔴+5🟡) → quruvchi (PmCompiler + DEMO_METRICS WOW + overflow + CTA) → metodist (2-aylanish: MentorNote'da K-kod/pipeline-meta tozalandi) → dizayn (2-aylanish: formula/frag o'lik CSS ketdi) → jonli 7/7 ✅ → tekshiruvchi TAYYOR (N1 overflow o'zi tuzatdi) → verifikator IMZO (render skrinshotlar 0-xato) | **qabulchi PASS 20/20** |

Muhim voqealar: (a) ikkala dars manbasi seans boshida TASODIFAN O'CHIRILGAN edi — Trash'dan tiklandi, `.pm-backup/` zaxira yaratildi, COMMIT hali yo'q (foydalanuvchi buyrug'i kutilmoqda!); (b) `pm-senariylar/` yo'qolgani rasmiylashtirildi — senariy-sadoqat o'rniga ICHKI-IZCHILLIK qabul mezoni (bosh-agent qarori, qabulchi 1-bandda * bilan); (c) uchala PM dars endi bitta etalon-naqshda (20 qoida + PmCompiler + WOW-maqsad). Qolgan: foydalanuvchi ko'rigi + qo'lda jonli-sinov (yangi PIN, 2 o'quvchi, MENTOR-2026, podium/arena ≠ 0; koding-signal 510).

## P3 raund (2026-07-21/22) — FOYDALANUVCHI JONLI-KO'RIK feedbacklari — ✅ IKKALASI QAYTA ISHLANDI
| Dars | Bajarilgan |
|---|---|
| M7-D2 JTBD | s1 «✓ YOLLANDI» shtamp-sahna (silo-klon o'rniga) · s2 kalkulyator + 🧮📷🗺️ flip-ikonka sahnasi (Telegram-takror yo'q) · s3 drel→teshik lenta + jt3 3D-flip · s5 (8-sahifa) narrow olib tashlandi + «💡 Yollash paneli» chiroqlar · ustaxona matn-diyeta (wsx-chiplar) · MatchPairs vizual (halo/snap/burst) · KODING: JS-kompilyator → JtbdCard React props-komponent VS Code-topshiriq (jonli preview o'quvchining real kartalaridan) · recap rcp-flow + etalon PairTimer. esbuild ✅ |
| M8-D1 Metrika | s1 hook savoli «ERTASIGA YANA ochishga nima majbur qiladi?» · s1→s2 «BOSHQARUV PANELI JONLANADI» imzo (CountUp+sparkline+● JONLI, foydalanuvchi 4 variantdan tanladi) · s2 «oshxona haftaligi» interaktiv 5 kun-katak · s3 mx3 flip + mlens lenta + «salomatlik»→«ahvoli» (arena Q1 matni ham, kalit tegilmagan) · s5 (8-sahifa) KRITIK BUG: .nstar-editor.ok animation fade-up'ni override qilib vizual g'oyib bo'lardi — tuzatildi + narrow yo'q + 📟 Panel-holati · ustaxona matn-diyeta · MatchPairs mmx vizual · KODING: MetrikaPanel HISOB-komponent (JTBD'dan farqli mexanika, 26-qonun) · recap rcp-flow. esbuild ✅ |

Qonunlashtirildi: PM_DARS_ETALON 23-28 (klon-taqiq, misol-jurnal, matn-zichlik, koding-variativlik, test/recap dizayn-boylik, narrow-taqiq+validator-vizual) + MATN_ETALONI lug'at (salomatlik, qaytdi, ish-bitishini, o'rtacha chek, MVP-gloss) + 4-bo'lim 2 yangi qoida (sanoq-mosligi, SCORED-gloss). UNCOMMITTED — foydalanuvchi qayta-ko'rigi kutilmoqda.

## P4 raund (2026-07-22) — M8-D1 Metrika FOYDALANUVCHI 6-FEEDBACK (public/1-6.png) — ✅ TUZATILDI + QONUNLASHTIRILDI
6 punkt tuzatildi (`src/pm/PmMetricsLesson.jsx`, esbuild ✅, kalitlar tegilmagan):
(1) OKR-atama 4 joydan olib tashlandi → «keyingi darsda … maqsad qo'yamiz» sodda-havola; (2) «ahvolini»→«holatini» (mentor s3 + test-variant + RECAP, indekslar tegilmagan); (3) «Endi ochamiz:»→«Duolingo sirini ochamiz:» (predmetli sarlavha); (4) s5 North Star: qulf-tugma endi qolgan qadamni AYNAN aytadi (①raqam/②chunki) + editor ostida yashil-yonar qadam-yo'riqnoma; (5) gating-konvensiya BIR XILLASHTIRILDI: s5+ustaxona `isMentor` bypass + mentorga «buni o'quvchilar bajaradi» yozuvi (avval mentor majburan to'ldirardi); (6) «og'zingizdan chiqsin»→«o'zingiz takrorlang».
Qonunlashtirildi: **PM_DARS_ETALON 29-31** (kelajak-atama taqiq · qulf-tugma gapiradi+predmetli sarlavha · gating-konvensiya) + **MATN_ETALONI lug'at** (ahvol→holat, og'zingizdan-chiqsin, deiktik-sarlavha) + rol-fayllar: metodist (29/30/so'z-tanlov), quruvchi (30/31 qurilish-naqshi), tekshiruvchi (3 yangi bug-sinf), auditor (29-31 maxsus tekshiruv, 31-qoida), qabulchi (27-band, checklist 20→27). UNCOMMITTED.

## Navbat
| # | Dars (xaritadan) | Holat |
|---|---|---|
| — | keyingi partiyalar — tartibni foydalanuvchi belgilaydi | ⬜ |

## Modul-kontekst jurnal (senariy kirishlari uchun)
| Modul | Ishlatilgan keyslar | Oldingi TEKSHIRUV mexanikasi |
|---|---|---|
| M3 | K11 (M3-D2) | Hotspot/xato-topish (M3-D2) |
| M7 | K18 (M7-D2) | Juftlash MatchPairs (M7-D2) |
| M8 | K5 (M8-D1) | Juftlash MatchPairs (M8-D1) |

## Kundalik-ilova misollari jurnali (PM_DARS_ETALON 24-qonun: darslar orasida TAKRORLANMAYDI)
| Dars | Bosh-misol (muhokama/teoriya) | Yordamchi misollar |
|---|---|---|
| M3-D2 UserStory | Telegram (harakat/sabab tap-mashq) | YouTube, taksi (kechikayotgan o'quvchi) |
| M7-D2 JTBD | Kalkulyator (2026-07-21 feedback: Telegram-takror o'rniga) | Kamera, Xarita (ikonka-flip sahna), velosiped/avtobus, Starbucks (K18) |
| M8-D1 Metrika | Duolingo streak (K5) | maktab oshxonasi (retention analogiyasi) |
