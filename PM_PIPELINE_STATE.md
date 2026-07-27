# 📊 PM PIPELINE HOLAT MANIFESTI

> Bosqichlar: S Senariy(+korrektura) · 1 Quruvchi · 2 Dizayn · 3 Jonli · 4 Metodist · 5 Tekshiruvchi · 6 Verifikator · 7 Qabulchi.
> Belgilar: ⬜ boshlanmagan · 🔵 jarayonda · ✅ tugadi · 🚦 human-gate kutmoqda.
> Manba: `CoddyCamp_Senior_2026_Final (7).pdf` darslar xaritasi (75 PM dars) + `PM_Prompt_v8.md`.
> Eski platformadagi PmLesson1-6 (texnik-pipeline v18) va PmLesson7-18 (v16) — PM dasturiga KIRMAYDI (foydalanuvchi qarori 2026-07-15: e'tiborga olinmaydi).

## P0 — etalon-dars
| Dars | Fayl | Holat |
|---|---|---|
| **M3-D2 «User Story: kim va nima uchun?»** | `src/pm/PmUserStoryLesson.jsx` (`pm-m3d2-v3`) | ✅ **ETALON (2026-07-24) — V4 17-ekran, 👦 O'quvchi-darvoza O'TDI** (quyida «P8 raund»); tarix: 🚦 v3 (2026-07-16) — foydalanuvchi «shunchaki tuzilgan, tushunarsiz» bahosi + auditor GAP asosida TO'LIQ QAYTA-SAYQAL: **s10 KODING=REAL iframe-kompilyator** (HC_ harness, postMessage+nonce, jonli User Story kartalari; HtmlCompiler dvijoki, PM-STUDIA tokenlar) · **Screen3 konstruktor endi haqiqiy sinov** (aralash neutral chiplar, 2-qadam tanlash, shake tirik) · **s12 yangi PM-topshiriq kartasi** (jonli to'ladi + «uyda 3 qadam»; summary-takror olib tashlandi) · **s2 tap-mashq** (harakat/sabab, indigo hint) · metodist TO'LIQ o'tish (texnik-metodist maktabi): test-shartlar bir-o'qishda tushunarli, chip-nomlar aniq, arena uzunlik-tell 8/12→1/12, EKRAN-400 hammasi ≤400 (hook 303 · ustaxona 301 · koding 314 · s2 389 · s12 396, ⭐-blok yopiq-toggle) · tekshiruvchi: 12 arena-savol mazmunan ✅, o'lik CSS tozalandi, 1 qaytarish (400) yopildi · verifikator IMZOLADI (esbuild+vite toza, 15/15 walk uz+ru, s10 iframe srcDoc OK, arena solo 13100≠0, App m3-02) · qabulchi hali chaqirilmagan (ixtiyoriy) · UNCOMMITTED · jonli-sinov qo'lda kutilmoqda |

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

## P5 raund (2026-07-22) — 3 ETALON DARSGA UX-TINIQLIK (32-qonun) — ✅ UCHALASI TAYYOR
Foydalanuvchi talabi: «matn bahaybatlashib ketgan — bola BIR QARASHDA tushunsin; shartlar boshqacha UI'da tursin».
| Dars | Bajarilgan | Adversarial hukm |
|---|---|---|
| P0 UserStory | Bosh-agent qo'lda: **TaskSpec** (🎯 Topshiriq-panel: chip ≤4 so'z, ✓+pop, detail yopiq, sticky) + **MentorWatchLine** + **done-mini** primitivlari TUG'ILDI; s0 Eslatma interaktiv tepasiga; s2 mukofot-pattern (taksi-misol mashqdan keyin); mentor-diyeta; dinamik qulf-yorliqlar; 30/31-qonunlar qo'llandi; StoryCheck/checklist o'lik kodi o'chdi | esbuild+vite ✅, kalitlar-diff bo'sh |
| M7-D2 JTBD | TaskSpec 4 joyda (s5/ustaxona/s12 + kd-steps koding); mvplamps/checklist/star-task → yangi primitivlar; mentor-diyeta 1 gap; «Yana N kartani» dinamik sanoq | **TAYYOR 10/10, nol nuqson** (CSS-qoplama 442 klass skript bilan) |
| M8-D1 Metrika | TaskSpec s5+ustaxona (feedback-yo'riqnomalar panelga birlashdi); MentorWatchLine 3 ekranda; done-mini 5 ta; s11 qadam-recital o'chdi | **TAYYOR** (+1 mayda tuzatish: hook qulf-yorlig'i; 2 🟡 ixtiyoriy eslatma) |

Qonunlashtirildi: **PM_DARS_ETALON 32** (TaskSpec+ekran-diyeta, a-e bandlari) + 3-bo'lim xaritasiga TaskSpec anchor + rol-fayllar (dizayn=markaziy o'lchov «3 soniya testi», quruvchi=AYNAN ko'chirish, metodist=chip ≤4 so'z+pufak-diyeta, tekshiruvchi/auditor=a-e tekshiruv, qabulchi=28-band). UNCOMMITTED — foydalanuvchi brauzer-ko'rigi kutilmoqda (dev-server: localhost:5173).

## P6 raund (2026-07-22) — 3-AUDIT + ETALON-TOZALASH (M1 partiyasidan oldin) — ✅ TUGADI
3 parallel pm-auditor to'liq GAP-hisobot chiqardi (uchala darsda jonli-ball relslari 100% PASS, tuzilmaviy muammo yo'q); topilgan 8 🔴 + o'lik CSS yopildi:
| Dars | Tuzatilgan |
|---|---|
| P0 UserStory | :890 grammatika («siz … erishasiz») · «keys (real voqea tahlili)» + «bublik (halqa non)» gloss (arena Q8 distraktorlari uzunlik-tell bilan qayta balans, correct joyida) · s7 cue halollashtirildi («qaysi bo'lak bu gapda umuman YO'Q?») · RECAPS[9]↔s9 namuna birlashdi · 32(b): s5/ustaxona pufaklari 1 gapga · hook qulf-yorlig'i dinamik («Avval ovoz bering») · o'lik CSS 5 topilma o'chdi |
| M7-D2 JTBD | s1 MVP-gloss + JTBD-kengaytma («bajarilishi kerak bo'lgan ish») · «og'zingizdan chiqsin»→«o'zingiz takrorlang» · s12 diyeta: hw-karta 224→122 gr, pufak 1 gap — ekran 391≤400 |
| M8-D1 Metrika | MVP-gloss (s4 + arena Q8 scored) · badge «scored»-jargoni ketdi · «O'LCHASANGIZ — KO'RASIZ» (siz-forma) · MentorNote s3/s4 takror bittaga · «M7»→«oldingi modulda» · s9 sanoq-o'tish «3 kartangiz tayyor — endi 4…» · o'lik CSS (ex-card oilasi, broken-story, proj-q.broken, delay-4) o'chdi · `.match-target.filled` CSS to'ldirildi (JTBD `.mp-target.filled` bilan izchil) |
Hujjat: PM_DARS_ETALON 2-bo'lim keys-slayd eyebrow ta'rifi P0 realligiga moslandi («Keys …» o'zbekcha, K-kodsiz); 32(b) ziddiyati kod tomonidan yopildi (P0 pufaklari 1 gap). Uchala fayl esbuild ✅, kalitlar-diff bo'sh. UNCOMMITTED.

## M1 partiyasi (2026-07-22 boshlandi) — eski PmLesson1-3 (texnik-pipeline v16/v18) O'RNIGA yangi qurilish
> 2026-07-23 joylashuv-qarori (foydalanuvchi): 3 yangi M1 darsi `src/pm/` → **`src/1-Modull/`** ga ko'chirildi (modul-papka konvensiyasi); eski PmLesson1-3 → `.pm-backup/` arxiv (jonli-sinov o'tib COMMIT bo'lgach o'chirilishi mumkin). App.jsx import-yo'llari yangilandi, vite build ✅. Fayl-yo'llar quyida eskicha yozilgan bo'lsa — yangi manzil `src/1-Modull/`.
Qaror (foydalanuvchi): avval etalon-tozalash ✅ → m1-02 to'liq gate'lar bilan → m1-05 + m1-12 parallel. RU i18n: hozircha faqat UZ (3 etalon kabi).
| # | Dars | Fayl (reja) | Holat |
|---|---|---|---|
| 1 | M1-D2 «Kim mening foydalanuvchim?» (K8 Meta) | `src/pm/PmAudienceLesson.jsx` (`pm-m1d2-v1`) | 🚦 **FOYDALANUVCHI KO'RIGI** — to'liq zanjir ✅: senariy korrektura(15+ sayqal) · GATE S · quruvchi (3150 qator, 15 ekran, `.fbpoll` like-lenta + `.apass` sayt-pasporti imzo, PmCompiler matn-almashtirish) · dizayn (fbrow.top halo, apass-row-on, hs-scan, reduced-motion to'ldirildi) · jonli 11/11 (Q4/Q5 reorder — seq sikl sindirildi) · metodist (14 tuzatish, tell≤1.23, lug'at: tashxis→baho, slot→joyiga) · tekshiruvchi TAYYOR (4 mayda: K8 MentorNote, iframe overflow, o'lik CSS, MentorWatchLine matni; 0 qaytarish) · verifikator IMZO (esbuild+bundle+SSR+headless 15/15 ekran 0 xato) · **qabulchi 27/28→metodist-diyeta (koding 443→373, s12 504→396)→28/28 PASS** · App `m1-02` ULANDI · vite build ✅ · UNCOMMITTED · jonli-sinov qo'lda kutilmoqda (yangi PIN + 2 o'quvchi + MENTOR-2026, podium/arena ≠0) |
| 2 | M1-D5 «Struktura = mahsulot qarori» (K19 Apple) | `src/pm/PmStructureLesson.jsx` (`pm-m1d5-v1`) | 🚦 **FOYDALANUVCHI KO'RIGI** — to'liq zanjir ✅ (2026-07-23): korrektura(20+zero-width) · GATE S · quruvchi (~3400 qator, ph-telefon-zaryad hook + splan uchib-tushish preview + mart supermarket-sahna + bmock validator; t3 DragDrop=JTBD MatchPairs kontrakti) · dizayn (🛒 aravacha-yurish, taphint-stagger) · jonli 8/8 (Q7-tell metodistga) · metodist (Q7 1.55→1.15, s1 472→398, 15 guruh) · tekshiruvchi TAYYOR 0-qaytarish (3 o'lik CSS o'zi) · metodist-2 (s12 581→389) · bosh-agent mikro (kodlashni, hw-chip-sub, hook-pufak 2 gap, pmtask-sub) · verifikator IMZO (headless 15/15, DragDrop tap-fallback, arena solo) · **qabulchi PASS 28/28** · App `m1-05` ULANDI · vite build ✅ · UNCOMMITTED · jonli-sinov qo'lda |
| 3 | M1-D12 «Storytelling: pitch» (K12 Airbnb Pitch Deck) | `src/pm/PmPitchLesson.jsx` (`pm-m1d12-v1`) | 🚦 **FOYDALANUVCHI KO'RIGI** — to'liq zanjir ✅ (2026-07-23): korrektura(15) · GATE S · quruvchi (3345 qator, sahna-metafora: spot-shelf chiroqlar + pstage proyektor-preview + pflip + pmon/pscript) · dizayn (payoff-nur, chiroq-stagger, 6 asosli rang) · jonli 8/8 (0 tuzatish) · metodist («sotish»-ovi 5 joy, s0=382) · tekshiruvchi (🔴 s5 fade-up/.ok metrika.png-sinf bugini O'ZI tuzatdi + 3 o'lik CSS; Q3 qaytardi) · metodist-2 (Q3 aniq-yolg'on tell 1.08, s12=395, s1=396) · verifikator IMZO (headless 15/15, arena solo, havola negativ-sinov) · **qabulchi PASS 28/28** · App `m1-12` ULANDI · vite build ✅ · UNCOMMITTED · jonli-sinov qo'lda. 24-band eslatma: M2 birinchi koding-darsi placeholder-almashtirishdan BOSHQA mexanika olsin |

## Navbat
| # | Dars (xaritadan) | Holat |
|---|---|---|
| — | keyingi partiyalar — tartibni foydalanuvchi belgilaydi | ⬜ |

## Modul-kontekst jurnal (senariy kirishlari uchun)
| Modul | Ishlatilgan keyslar | Oldingi TEKSHIRUV mexanikasi |
|---|---|---|
| M1 | K8 (M1-D2) · K19 (M1-D5) · K12 (M1-D12) | Hotspot (M1-D2) → DragDrop-tartib (M1-D5) → MatchPairs (M1-D12) |
| M3 | K11 (M3-D2) | Hotspot/xato-topish (M3-D2) |
| M7 | K18 (M7-D2) | Juftlash MatchPairs (M7-D2) |
| M8 | K5 (M8-D1) | Juftlash MatchPairs (M8-D1) |

## Kundalik-ilova misollari jurnali (PM_DARS_ETALON 24-qonun: darslar orasida TAKRORLANMAYDI)
| Dars | Bosh-misol (muhokama/teoriya) | Yordamchi misollar |
|---|---|---|
| M1-D2 Auditoriya | Mahalla novvoyxonasi (kim kiradi? tap-mashq) | Facebook-Garvard (K8), velo-ustaxona (s1 namuna) |
| M1-D5 Struktura | Supermarket-non (nega oxirida? tap-mashq) | Apple-iPhone (K19), repetitor-sayt (DragDrop test) |
| M1-D12 Pitch | Sinfdosh o'yin maqtaydi (flip-mashq) | Airbnb pitch-deck (K12), galereya-sayt (s1 namuna), repetitor-sayt (MatchPairs — D5 testidan tanish) |
| M3-D2 UserStory | Telegram (harakat/sabab tap-mashq) | YouTube, taksi (kechikayotgan o'quvchi) |
| M7-D2 JTBD | Kalkulyator (2026-07-21 feedback: Telegram-takror o'rniga) | Kamera, Xarita (ikonka-flip sahna), velosiped/avtobus, Starbucks (K18) |
| M8-D1 Metrika | Duolingo streak (K5) | maktab oshxonasi (retention analogiyasi) |

## P7 raund (2026-07-24) — P0 USERSTORY V4 QAYTA-QURISH (foydalanuvchi 3 to'lqin feedback) — ✅ TUGADI
10-nuqta feedback + image.png/idea_oll.png annotatsiyalar asosida: testlar TestQ-dizayni (savol-sarlavha + toza kartochka + opt-abc doira-harflar; hotspot bekor) · s5+ustaxona → BITTALAB-YOZISH ustaxonasi (swed muharrir + svd daftar, saqlash-shart-hintlar, avto-complete) · koding «aylantirish-vizual» (kdx: kod-chip ➜ o'z hikoya-kartalari, bitta CTA, keng ekran) · +3 YANGI unscored ekran: peer (✓/✕ hukm) / clinic (2 tuzoq-chip) / priority (Hozir=1) · PairTimer halqa-taymer · «chala/mezon/sinchi» taqiq · 17 ekran, lessonId `pm-m3d2-v3`, scored idx 4/6/9. Qonunlar: PM_DARS_ETALON **48–53** + 2/3-bo'limlar V4 · MATN_ETALONI 7-B.3 «chala» + lug'at ~10 qator.

## P8 raund (2026-07-24 kechki) — 👦 O'QUVCHI-SIMULYATOR DARVOZASI TUG'ILDI va P0 O'TDI — ✅ ETALON
Yangi agent `role/darslik-oquvchi.md` + spec `OQUVCHI_DARVOZA.md` (4 teshik yamalgan: JSX-o'qish qoidalari · SCREEN_INTENTS o'lchov-kaliti · avto-oqlanish+TUZATILDI/OQLANDI/RAD · lint-front ajratish). Kalibrlash: Sinov A (eski JTBD-v2) ~80% sezgirlik · Sinov B (P0) 0.6 topilma/ekran → darvoza YOQILDI (PIPELINE.md + PM_PIPELINE.md oqimlariga kirdi). B-topilmalar tuzatildi (s7 variant-tenglik, KODING_PLACEHOLDER izohi, peer-sub ko'rinadigan, «yozdingiz», 4 gloss, sinchi→tekshiruvchi; OQLANDI: kod-atamalar, imkoniyat-so'rovi induktiv). **2-o'qish HUKM: O'TDI** (bilmadim 0 · niyat 17/17 · gloss-tartib 0); «qayta-o'qish ≤2» mezoni aniqlashtirildi (ataylab-takror/distraktor/markaziy-g'oya sanalmaydi) + practice-hint va s10-brief soddalandi. P0 = ETALON. UNCOMMITTED.

## P9 raund (2026-07-24) — F-0724-01: P0 UserStory s11/s12 fe'l-tuzatmalari (foydalanuvchi qo'lda-ko'rik) — ✅ TUGADI
**Topildi (2 ekran):** s11 klinika — «davolaymiz» / «🩺 Davolab bo'lganlar» / «Hikoya sog'aydi!»: tibbiyot-fe'li o'quvchida «talab=kasal» bog'lanishini talab qiladi, u qurilmaydi (162-qator «puls» topilmasi bilan bir oila). s12 koding — «Endi hikoyalarni kod yozib beradi»: sub'ekt chalkash, hikoyani o'quvchi yozadi, kod uni kartaga aylantiradi.
**Qilindi (`src/pm/PmUserStoryLesson.jsx`):** eyebrow «Klinika · talabni to'ldirish 🩺» (❗«chala» ishlatilmadi — 7-B.3 taqiq) · sarlavha «Mijoz talabini *to'liq hikoyaga* aylantiramiz» · done-mini «✅ Hikoya to'liq bo'ldi!» · panel «🩺 Hikoyani yig'ib bo'lganlar» · s12 sarlavha «Endi hikoyani *kartaga* kod aylantiradi» + mentor-gloss tire bilan qayta yozildi + done-mini «koddan karta bo'lib chiqdi». Klinika dekori/mexanikasi (52-qonun: tuzoq-chip) tegilmadi.
**Eslatma:** `— 0/0` panelda bug emas — mentor rejimida `bajardi/jami`, hali hech kim qo'shilmaganda 0/0 (`MentorPracticeStats`, :1174).
**Muhrlandi:** MATN_ETALONI LUG'AT +3 qator (davolaymiz· sog'aydi· «kod yozib beradi» sub'ekt-chalkashligi). esbuild toza · residue-grep 0. UNCOMMITTED.

## P10 raund (2026-07-25) — M7-D2 JTBD → V4 ETALON-TENGLIK (`pm-m7d2-v2`, 15→17 ekran) — ✅ KONVEYER TUGADI
**Sabab:** foydalanuvchi «JTBD va Metrikani ham UserStory kabi qat'iy etalon qilamiz» dedi. Auditda ikkala dars ham 24-iyul kechqurungi **48–53-qonunlardan oldingi avlodda** qotib qolgani aniqlandi (sayqal emas — `pm-quruvchi` bosqichidan qayta o'tish). [GATE 1] qarorlari: to'liq V4 (P1+P2) · ketma-ket (JTBD avval) · 47-qonun tatbiq qilinsin.
**Zanjir:** quruvchi → dizayn → jonli → 👦 1-o'qish → metodist → 👦 2-o'qish → tekshiruvchi → verifikator → qabulchi → metodist (yakuniy diyeta).
**Tuzilma:** ustaxona 48-qonunga (bittalab-yozish `swed`/`svd` analogi, honor-tugma yo'q, eski `Screen5` singdirildi) · **3 yangi unscored ekran**: peer(8)/clinic(10)/priority(12) · `TestQ` (49) · `TaskSpec`+`MentorWatchLine`+`QPrompt`+hotspot+`JobMiniEditor` O'CHIRILDI · `SCREEN_INTENTS` 17/17 · SCORED 4/6/9 da QOLDI → `INLINE_KEYS`/`correctIdx`/`QUIZ_BANK.correct` umuman tegilmadi.
**👦 darvoza:** 1-o'qish niyat 11/17, koding «bajarilmadi» (prop/komponent/VS Code/`src`/map glosssiz) → metodist 12 topilmani yopdi → **2-o'qish O'TDI** (bilmadim 0/17 · niyat 16/17 · qayta-o'qish 2).
**Tutilgan REGRESSIYALAR (4):** `jobHunter` nishoni qattiq `[4,6,9]` ga yopishgan → `SCORED_IDX` hosilasi · metodist koding-sarlavhasini savol shakliga qaytargan (47-qonun) → buyruqqa · arena Q2 uzunlik-tell **1.74×** → 1.05× · s1 `JTBD` glossi V4 da yo'qolgan → qaytarildi. Yana: `BOARD_SCREENS` qattiq indeks → id-bo'yicha (P0 naqshi) · s2 «raqib» ekrani qulflanmagan edi (arena Q10 unga tayanadi) → darvoza qo'yildi.
**Verifikator:** esbuild + `vite build` toza · SSR 17/17 × 2 holat · **Chromium'da 1→17 ekran, konsol toza**, layout butun. **Qabulchi:** 26✅/2🔴 (Screen11 prozasi 446→**388**; koding checklist yorliqlari ≤5 so'z) — ikkalasi yopildi.
**Qonun-o'zgarishlari (uch darsga ham):** 9-qonun — 400-limit **PROZAni** sanaydi, mashq-materiali (kod/karta/checklist/variant) sanalmaydi · 47-qonun — savol-sarlavha faqat **INTERAKTIV** ekranda taqiq, hook/teoriya/keys/recap/uy-vazifada ruxsat (induktiv metod quroli); darvoza «grep=0» emas, «interaktiv ekranlarda 0». MATN_ETALONI lug'atiga **14 qator**.
**Holat:** JTBD prod-tayyor, [GATE 3] foydalanuvchida. Qo'lda qolgan: jonli PIN + 2 o'quvchi bilan podium/arena 0 emasligini tasdiqlash. UNCOMMITTED.

## P11 raund (2026-07-25) — M8-D1 METRIKA → V4 (`pm-m8d1-v2`, 15→17 ekran) — 🟡 DAVOM ETMOQDA
**Bajarildi:** `pm-quruvchi` (ustaxona 4 qadamga: ⭐ North Star + 3 karta bittalab, eski `Screen5` singdirildi; peer/clinic/priority; `TestQ`; `TaskSpec`+`MentorWatchLine`+hotspot+`TestLead` o'chdi; `SCREEN_INTENTS`; SCORED 4/6/9 qoldi) · `pm-dizayn` (imzo = **pult-ekrani**: jonli-lenta + 3 metrika chirog'i + skaner-chizig'i; `● JONLI` ustaxona-chirog'i; metrika turlari kelish/qaytish/qiymat = ko'k/indigo/oltin YAGONA manbadan — koding-preview nuqsoni tuzatildi; klon-taqiq 0 — hatto eski `smini`/`swcard` meros nomlari ham o'z prefiksiga) · `darslik-jonli` **12/12 PASS** (auditning 🔴 bandi — mentorga «kuzatasiz» va'dasi berilib panel/signal yo'qligi — YOPILDI).
**👦 1-o'qish:** niyat 12/17 · 4 qisman · **1 mos emas** (koding). 🔴 Ochiq: **SCORED testlarda izohsiz atama** («server» TEST-1/TEST-2/arena · «oqim» · «faol foydalanuvchi») · klinika yig'ma gapida **«bildiradi bildiradi»** takrori (matn bugi) · ustaxonada «nima haqida yozaman» aytilmagan · «⭐ Taxmin» maydoni tushunarsiz · prioritetda «Keyin»/«Keyinroq» farqi yo'q · koding ekranida `React·komponent·massiv·map·src·.jsx·Math.round·localhost:5173` glosssiz.
**Keyingi:** `pm-metodist` (GATE 3 dan keyin boshlanadi) → 👦 2-o'qish → tekshiruvchi → verifikator → qabulchi. UNCOMMITTED.

## P12 raund (2026-07-25) — F-0725-01 + «TEKSHIRUVCHI STOLI» (uch darsga birdan) — 🟡 DAVOM ETMOQDA
**F-0725-01 (foydalanuvchi qo'lda-ko'rigi, JTBD 17 ekran bo'ylab, 11 topilma — HAMMASI YOPILDI).** Ildiz-sabab bitta bo'lib chiqdi: *P0 dan naqshlar ko'chirilgan, lekin P0 da ataylab qilingan O'CHIRISHLAR ko'chirilmagan.* Topilmalar: s0 stakan-izohi · s1 `ta-sub` + `jhire-cap` + tushunarsiz sarlavha · s4 keys «Sizning taxminingiz» (asl javob aytilmagan) + «sizning MVP'ingiz ham…» ramkasi · **s7/s8/s9 test SAVOLI yonidagi rangli chiziq** (dizayn bosqichida `.jq-ask::before` qo'shilgan — P0 da yo'q; o'quvchi uni javob-belgisi deb o'qiydi) · s10 koding desktopda +125/+225px skroll · s11 recap 3-qadami (P0 da o'chirilgan) · s12 «Koding uyga qolsa» + «ota-onam**ga** o'qib bering» shaxs-nomuvofiqligi · yakun-hero `h-sub` (P0 dan ham o'chirildi).
**Qonunlashtirildi — PM_DARS_ETALON 54–58:** 54 «etalon = QARORLAR to'plami, o'chirishlar ham meros» (6 konkret blok ro'yxati) · 55 test-savolida hoshiya TAQIQ (ball-xavfi, dizayn masalasi emas) · 56 bashorat natijasi asl javobni aytadi · 57 jumlaga qo'yiladigan chip-qiymatlari siz-formada + uy-vazifa yorliqlari hajm bilan · 58 ekran 1440×900 va 1280×800 da skrollsiz (matn emas, VIZUAL yig'iladi). `pm-tekshiruvchi` roliga 6 ov-bandi qo'shildi (jumladan «blok o'chirilgach o'lik kod qoldimi» — bu raundda `QA_SOLO/qaRev/revealQa/mvp11/readMvp/.qa-*/PASSED` aynan shunday qolgan edi).
**Koding-ekran (58-qonun namunasi):** matn BIR HARF ham qisqarmadi — preview 3→2 qator, kod-oynasi o'zi skroll (mobilda cheklovsiz), 💡 Yordam desktopda qalqib chiquvchi kartacha. 1440×900: +125→**0** · 1280×800: +225→**0** · Yordam ochiq: +113→**0**.
**🔍 «TEKSHIRUVCHI STOLI» (59-qonun, foydalanuvchi ideyasi).** Eski «sherik-tekshiruv» BEKOR: u texnik jihatdan ishlamas ekan — ekran doim o'quvchining O'Z artefaktini ko'rsatadi, sherikning ishi serverdan kelmaydi (`submit_answer` faqat son tashiydi, matn maydoni YO'Q). 👦 buni ikki darsda ham fosh qilgan: «hammasiga ✓ bosaman — o'zimga ✕ qo'yish g'alati». Yangi shakl: **3 tayyor namuna-karta, bittalab hukm** (`✓ ishlaydi` / `✕ tuzatish kerak` → 3 sabab-chip) → oxirida xulosa-strip (taqqoslash shu yerda). Qoidalar: aynan bittasi to'g'ri · har xato kartada bitta kamchilik · 3-chip distraktor · to'g'risi oxirida turmaydi · ball/qizil YO'Q, noto'g'ri hukmda asl kamchilik AYTILADI. 52-qonunning sherik-bandi bekor deb belgilandi (sabab bilan — kelajakda takrorlanmasin).
**P0 UserStory:** «Tekshiruvchi stoli» qurildi, skroll 4 holatda × 2 o'lchamda 0; yo'l-yo'lakay P0 ning O'ZIDAGI kamchilik topildi — `StudentPracticePulse` yo'q ekan (45-qonun), qo'shildi. `INLINE_KEYS` tegilmagan.
**Metrika matn-bosqichi (P11 davomi):** «server» butunlay yo'q qilindi (test-1/test-2 + arena Q2/Q7/Q8) · «oqim», «faol foydalanuvchi» ochildi · **«qiymat»→«foyda»** va **«bosh»→«eng asosiy»** kaskadlari (o'quvchi «qiymat»ni PUL deb o'qigan edi, North Star ta'rifi shunga tayanardi) · klinika «bildiradi bildiradi» gap-bugi tuzatildi (sabab: slot-yorliqlari ramka-so'zni takrorlagan) · koding jargoni JTBD yechimi bo'yicha yopildi · proza 12/12 ≤400 · lug'atga 12 qator.
**Holat:** JTBD va Metrika «Tekshiruvchi stoli» quruvchilari ishlamoqda. Keyin: uch darsni yonma-yon izchillik-tekshiruvi → JTBD qayta-imzo · Metrika 👦 2-o'qish → tekshiruvchi → verifikator → qabulchi · P0 uchun qisqa regressiya-tekshiruvi. UNCOMMITTED.

## P13 raund (2026-07-25) — F-0725-04/04b: OVERLAP ILDIZI + 60-QONUN (uch PM darsga) — ✅ PROD
**Topildi (foydalanuvchi skrinshotlari):** klinika 11/17 mentor-rejimda formula-qatori kesilib chiplar ustiga chiqqan; keyin 4 yangi skrinshot — keys-slayd matni karta ichida kesilgan, skroll yo'q. **Ikki ildiz:** (1) `.screen{flex:1;min-height:0}` + bolalarda standart `flex-shrink:1` → sig'maganda skroll o'rniga SIQILISH; (2) `--lz` zumi faqat kenglikka qarab hisoblanib, past ekranda ilovani kattalashtirib vertikal joyni sun'iy yeb qo'yardi.
**Tuzatildi (uch PM darsda):** `.screen{flex:1 0 auto}` + `.screen > *{flex-shrink:0}` · `--lz = clamp(1, min(w/1920, h/1000), 1.5)`. Bosh-agent headless-Chrome'da o'zi o'lchadi: 3 dars × 1280×700 va 1440×900 — overlap 0, ichki kesilish 0 (boshlang'ich holatlar; chuqur holatlar foydalanuvchi qo'lda testlaydi). **Prodga chiqarildi** (coddycamp-pm-darslar.vercel.app), tuzatish chunklarda tasdiqlangan (`innerHeight/1e3`).
**Qonun:** 60-qonun ikki qatlamli bo'ldi (flex-himoya + balandlik-zum) + foydalanuvchi qat'iy qarori muhrlandi: «kichik ekranda skroll BO'LSIN, komponent QISILMASIN». O'lchash usuli MD'da: `document.scrollHeight` bu layoutda YOLG'ON — faqat `.stage-content` + `getBoundingClientRect()` juftliklari. `pm-tekshiruvchi`ga bloklovchi ov-bandi.
**Ochiq:** 20+ texnik darsda o'sha naqsh turibdi (tarqatish foydalanuvchi qaroriga) · 58-qonun sayqal-ro'yxati (Metrika ustaxona +232px) · qabulchi-imzo 3 darsda · foydalanuvchi qo'lda-testi kutilmoqda. Skrinshotlar: `feedback/F-0725-04-overlap-klinika.png`, `F-0725-04b-1..4.png`. UNCOMMITTED.

## P14 raund (2026-07-26) — F-0726-01: P0 UserStory daftar-ko'rigi (14 topilma) — 🟡 GATE 3 KUTILMOQDA
**Manba:** foydalanuvchi qo'lyozma daftari, 2 rasm (`src/pm/1-.png`, `src/pm/2-.png`), P0 `pm-m3d2-v3` bo'ylab 1-based ekran-raqamlari bilan. Foydalanuvchi topshirig'i: «hammasini o'zing metodologiya bo'yicha o'ylab tuzat, keyin men tekshiraman» — shu sababli tashxis-bosqichi (retsept B, 2-qadam) foydalanuvchi ruxsati bilan o'tkazib yuborildi.
**Yopilgan 14 topilma (ekran → nima o'zgardi):**
· **s1 maqsad** — mentor gapidan slot-sanog'i («kimga nima kerak va nima uchun») olib tashlandi, o'rniga bitta jonli ta'rif; bo'laklarni demo-kartalar o'zi ko'rsatadi (63-qonun).
· **s2 muhokama** — sinf-savoli «Kecha ishlatgan ilovangizni nima uchun ochdingiz?» → «Qaysi ilovani nima maqsadda ishlatasiz?» (foydalanuvchi so'zi).
· **s4 keys 3-slayd** — «uzoq yo'l bosadi», «juda qulay», «tushlikkacha to'q yuradi» → tabiiy o'zbekcha; «to'q yurish» kollokatsiya-xatosi «och qoldirmaydi» bilan almashtirildi.
· **s4 keys 4-slayd** — TO'LIQ qayta yozildi: «Asl raqibi kim ekan?» (biznes-jargoni) → «Milkshake bo'lmasa, nima olardi?»; **bublik** (rus realiyasi) → **bulochka**; taxmin-savoli ham shu shaklga keltirildi. Arena Q8 matni sinxronlandi (`correct: 2` — kalit TEGILMADI).
· **practice ustaxona** — sarlavha «Loyihangizni birinchi bo'lib kim ochadi?» → «Loyihangizning foydalanuvchisi — kim?» (voqea haqidagi savol → persona haqidagi savol); MentorNote'dagi 3 savol ham moslandi.
· **practice ⭐** — yulduz-shkalasiga o'lchov gapi berildi («1 — unchalik muhim emas, 5 — eng muhimi»), `aria-label` «3 ball» → «Muhimligi: 3 yulduz» (ball-tizimi bilan chalkashuv yo'q qilindi).
· **practice ✎** — yolg'iz ikonka → **«✎ Tahrirlash»** matnli tugma (CSS: qat'iy 28px kenglik → `padding: 0 10px`); yakun-qatori ham tugma nomini aytadi (67-qonun).
· **peer tekshiruvchi stoli** — hukm-tugmalari `✓ ishlaydi`/`✕ tuzatish kerak` → **`✓ To'g'ri`/`✕ Noto'g'ri`**; mentor gapi, `peerLine` fidbeklari va xulosa-stripi ham shu ikki so'zga o'tkazildi (61-qonun; 59-qonun matni yangilandi).
· **s9 TEST-3 (dark mode)** — to'g'ri/noto'g'ri izohlari qayta yozildi: endi **nega** ekanini bo'lak nomlari bilan aytadi («kimga kerakligi — KIM — yozilmagan…»), atamaga tayanmaydi.
· **clinic 11-ekran** — mentor gapi atamadan boshlanmaydi: «Bu — imkoniyat-so'rovi» → «Mijoz faqat tilagini aytdi… shuning uchun bu hali hikoya emas» (62-qonun).
· **clinic tuzoq-chipi** — «sahifa tez ochilishi» NIMA-chipi «sahifani tez ochish»ning harf-nusxasi edi (foydalanuvchi: «2 tasi o'xshash») → **«saytning tez ishlashi»**; tuzoq-izohi va MentorNote sinxron (64-qonun).
· **priority 13-ekran** — «PM hammasini birdan qilmaydi… (bu prioritet deyiladi)» → «Hamma ishni birdaniga qilib bo'lmaydi… buni **navbat belgilash** (prioritet) deyiladi»; `PM` qisqartmasi o'quvchi matnidan butunlay chiqarildi (uy-vazifa yorlig'i ham: «PM-topshiriq kartasi» → «Topshiriq kartasi»).
· **s11 refleksiya** — «Bugun nima yozdingiz — va nega?» → «Bugun qanday hikoya yozdingiz — va u **kimga** kerak?»; mentor gapi, 1-qadam yorlig'i va input-namunasi shu savolga ulandi (refleksiya endi darsning KIM/NATIJA yadrosini takrorlaydi).
· **s16 yakun** — uy-vazifa kartasi endi **3 qadamni to'liq** ko'rsatadi + muddat (ilgari «To'liq qadamlar — uy-vazifa ekranida» deb yuborardi; o'quvchi podiumdan keyin orqaga qaytmaydi).
· **arena (CodeStrike)** — «Xato — 0 ball. Keyingisida olasiz! 💪» → «**Adashdingiz** — 0 ball. Keyingisida olasiz.» (stiker olib tashlandi); kompilyator xabarlari «Kodda xato»/«Xato:» → «Kod ishlamadi» (66-qonun).
· **arena qoplama** — foydalanuvchi «savollar o'tilmagan» dedi; tekshiruvda Q3 («User Story qachon yoziladi?») va Q12 («Nega avval User Story, keyin kod?») darsda hech qayerda aytilmagani aniqlandi (faqat s16 RECAP ro'yxatida — o'quvchi arenaga undan OLDIN kiradi). Koding ekraniga mentor-gapi + **takeaway** («Qoida: User Story kod yozishdan OLDIN yoziladi») qo'shilib yopildi (65-qonun).
**Ball-relslari:** `INLINE_KEYS`, `correctIdx`, `QUIZ_BANK[].correct`, `SCREEN_META`, `SCORED_IDX` — **hech biriga tegilmadi** (faqat variant/izoh matnlari). esbuild toza (339.6kb), residue-grep 0.
**Qonunlashtirildi:** PM_DARS_ETALON **61–67** (hukm-tugmasi · atama-oldin-hodisa · slot-sanog'i taqiqi · tuzoq harf-nusxasi bo'lmaydi · arena↔ekran qoplamasi · «adashdingiz» + stikersiz mag'lubiyat · ikonka o'z nomini yozadi); 59-qonun tugma-yorlig'i yangilandi. MATN_ETALONI lug'atiga **7 qator**.
**Ochiq / foydalanuvchi qaroriga:** (a) s12 uy-vazifasidagi «im qo'shimcha bo'lsin» qatori qo'lyozmada o'qilmadi — ixtiyoriy qo'shimcha topshiriq QO'SHILMADI, aniqlik kutilmoqda; (b) «3ta hikoyaga tegkaz: Tahrirlash 4-…» qatorining oxiri o'qilmadi — «✎ Tahrirlash» affordansi sifatida tushunildi; (c) 4-slayd «to'liq olib tashlansin» deyilgan edi — JTBD «asl raqib» g'oyasi keysning yechimi va arena Q8 unga tayangani uchun **g'oya saqlanib, karta boshidan qayta yozildi** (qaror foydalanuvchida). 👦 2-o'qish va verifikator ishga tushirilmadi. UNCOMMITTED.

## P15 raund (2026-07-26) — F-0726-02: JONLI-DARVOZA MUSTAHKAMLANDI (P0 UserStory) — 🟡 SQL-MIGRATSIYA KUTILMOQDA
**Manba:** foydalanuvchi jonli darsda ko'rgan holat: «hikoya uchtasini yozib, mentorni kutmasdan davom etib ketdi». Tashxis 5 kamchilikni ochdi, foydalanuvchi «eng yaxshi yechimni qilaylik» dedi — hammasi yopildi.
**1 · Fon-tab o'limi (asosiy sabab):** mentor boshqa oynaga o'tsa Chrome `setInterval`ni ~1 daq.gacha bo'g'adi → 60s stale-oynada `mentorAlive=false` → BUTUN darvoza ochilib ketardi (ustaxona kabi 10-daqiqalik ekranda deyarli kafolatli). Yechim: `LIVE_STALE_MS` 60s→**180s** (sabab-izoh kod ichida) + mentor heartbeat endi mount'da DARHOL uriladi va `visibilitychange`da tab qaytishi bilan qayta uriladi.
**2 · `max_screen` kamaymas edi (tuzilmaviy):** `advance_session` faqat `greatest()` yozardi — mentor darsdan oldin varaqlab chiqsa darvoza o'sha eng uzoq nuqtagacha ochiq qolardi. Yechim: **`supabase/live_phase11_cur_screen.sql`** — yangi `cur_screen` ustuni (kamayadi), darvoza endi shunga qaraydi, `max_screen` statistika uchun qoladi. Klient `mentorScreenOf(row)` = `typeof cur_screen==='number' ? cur : max` (0-ekran chekka holati ham to'g'ri) — migratsiya bajarilmagan bazada ham sinmaydi, chunki `liveGet` endi `select=*` (live_sessions'da sir yo'q: token `session_secrets`da, kalitlar `quiz_keys`da). Mantiq-sinov o'tdi (eski baza→8 · orqaga qaytgan mentor→3 · cur=0→0).
**3 · Jonli rejimda yorliq yo'qolardi:** `freeRide` tugmani ochiq qoldirib yorliqni «Davom etish»ga almashtirardi — o'quvchi 0/3 holatda nimani o'tkazayotganini bilmasdi. Yechim: tugma OCHIQ qoladi (sinf qotmasin), lekin yorliq topshiriq-matnini ko'rsatib turadi + title-izoh.
**4 · Sinf-puls (45-qonun) 5 amaliyotdan 1 tasida edi:** `StudentPracticePulse` ustaxona/klinika/prioritet/koding'ga qo'shildi (peer'da bor edi) — endi o'quvchi hamma amaliyotda «👥 Sinfda: N bajardi» signalini ko'radi.
**5 · Reload-buglar:** (a) ustaxona — F5 dan keyin hikoyalar tiklanardi, lekin signal/nishon otilmasdi → mount-effektda bir marta qayta yuboriladi; (b) prioritet — doska to'liq tiklansa ham `done=false` bo'lib «Davom etish» QULFLANIB qolardi → `restored` tekshiruvi + signal; (c) koding — yozilgan kod F5 da butunlay yo'qolardi → `pm-m3d2-koding` kaliti, kompilyator yozish paytida 400ms debounce bilan jonli saqlaydi, done+signal ham tiklanadi.
**Ball-relslari:** signal-zonalari (`PRACTICE_BASE+screen`), `INLINE_KEYS`, `QUIZ_BANK.correct` — tegilmadi. esbuild + `vite build` toza.
**⚠️ QOLDI:** (1) foydalanuvchi **`supabase/live_phase11_cur_screen.sql`ni Supabase SQL Editor'da ishga tushirishi kerak** (ungacha darvoza max_screen bilan ishlayveradi — regressiya yo'q); (2) xuddi shu 5 tuzatish JTBD (`PmJtbdLesson`) va Metrika (`PmMetricsLesson`)ga ham kerak — ular ayni shu koddan nusxa (foydalanuvchi qaroriga); (3) jonli qo'lda-sinov: yangi PIN + 2 o'quvchi, mentor tabini 2 daq. fonga tushirib «Mentor uzildi» chiqmasligini tekshirish. UNCOMMITTED.

## P16 raund (2026-07-26) — F-0726-02: JONLI-YADRO UCH PM DARSGA TARQATILDI + 2 YANGI TOPILMA — 🟡 SQL KUTILMOQDA
**Topshiriq:** «UserStory'da tuzatgan jonli-siklni to'liq ko'r, keyin JTBD va Metrikada ham ko'rib chiq».
**🔴 YANGI-1 — `cur_screen`ning yon-ta'siri (P15 tuzatishi keltirib chiqargan, o'z vaqtida tutildi).** `max_screen` monoton edi, `cur_screen` esa KAMAYADI — lekin test-javobini ochish sharti ham shu qiymatga bog'langan ekan (`revealed = … || live.mentorScreen > screen`). Natijada mentor orqaga qaytib tushuntirsa, o'quvchida ALLAQACHON ochilgan javob qayta yashirinib, «📨 Javobingiz qabul qilindi, hozir to'g'ri javobni bilib olasiz» holatiga tushardi. **Yechim:** hook endi ikki qiymat qaytaradi — `mentorScreen` (cur, faqat DARVOZA uchun) va `mentorMax` (monoton, faqat REVEAL uchun; klient tomonda ham `Math.max` bilan qo'riqlanadi). `revealed` uch darsda ham `mentorMax`ga o'tkazildi (JTBD'da 2 joy: `QuestionScreen` + `MatchPairs`; Metrikada 2 joy).
**🔴 YANGI-2 — Metrika ustaxonasida QATTIQ QULF (mustaqil rejimda chiqish yo'q edi).** F5 dan keyin North Star + 3 karta `localStorage`dan tiklanardi, lekin `done=false` qolardi; `allSaved=true` bo'lgani uchun karta-muharriri ham ko'rsatilmasdi → `saveDraft()` hech qachon chaqirilmasdi → «Davom etish» **abadiy qulflangan** («✍️ Yana 0 kartani yozib saqlang» yorlig'i bilan). Jonli rejimda `freeRide` yashirib turgan, shuning uchun sinovlarda ko'rinmagan. Yechim: `restored = !!savedNs && cards.length >= 3` → `done`.
**Tarqatilgan 6 tuzatish (JTBD + Metrika):** (1) `LIVE_STALE_MS` 60s→180s; (2) heartbeat mount'da darhol + `visibilitychange`da qayta; (3) `select=*` + `mentorScreenOf(row)` (cur_screen, fallback max_screen); (4) `mentorMax` ajratildi (yuqorida); (5) `freeRide` yorlig'i topshiriq-matnini saqlaydi; (6) reload-signal/qulf tuzatishlari — JTBD ustaxona (signal) + JTBD prioritet (qulf+signal) + Metrika ustaxona (QATTIQ QULF+signal) + Metrika prioritet (qulf+signal).
**UserStory'ga xos bo'lib qolgani:** sinf-pulsi (`StudentPracticePulse`) — JTBD va Metrikada 5/5 ekranda allaqachon bor edi (ular keyinroq qurilgan), UserStory'da 1/5 edi → P15 da 5/5 ga chiqarildi. Koding-kod saqlash (`pm-m3d2-koding`) ham faqat UserStory'da kerak: JTBD/Metrika koding-ekranlari **checklist** naqshida (yozib qo'yiladigan kod yo'q) — u yerda ma'lumot yo'qolmaydi, faqat belgilar qayta bosiladi (past ustuvorlik, tuzatilmadi).
**Tekshiruv:** esbuild 3/3 toza (342.7 / 381.8 / 380.9 kb) · `vite build` toza · skript-darvoza: 6 tuzatishning har biri 3 faylda ham bor, eski naqshlar (`live.mentorScreen > screen`, eski freeRide-yorlig'i) qoldig'i **0/0/0** · `lint:prompt` toza.
**⚠️ QOLDI:** `supabase/live_phase11_cur_screen.sql` foydalanuvchi tomonidan ishga tushirilishi kerak (ungacha uch dars ham eski `max_screen` mantiqida ishlayveradi — regressiya yo'q, chunki `mentorScreenOf` fallback bilan). Jonli qo'lda-sinov: mentor tabini 2 daq. fonga tushirish + mentor orqaga qaytganda test-javobi ochiq qolishini tekshirish. UNCOMMITTED.

## P17 raund (2026-07-26) — «SHAFOF MATN» TIZIM-YECHIMI: KORPUS + TIL-LINT DARVOZASI + O'TKIR SIMULYATOR — ✅
**Sabab (foydalanuvchi og'rig'i):** «tekstlarda darslarni yaxshi qilolmayapmiz… qayta-qayta feedback berish muammo». Tashxis: (1) qonunlar «nima qilma» deydi — model taqiqdan yaxshi matn YASAY olmaydi; (2) oltin-namuna yo'q — model qoidaga emas namunaga taqlid qilganda yaxshi yozadi; (3) feedback qonunga aylanganda foydalanuvchining jonli iborasi yo'qoladi; (4) lug'at maslahat edi, darvoza emas (til-lint bor edi, majburiy emas edi).
**Qurildi:**
1. **`MATN_KORPUS.md`** — oltin-namunalar fayli: 12 matn-turi (mentor gapi·sarlavha·sinf-savoli·test-izoh·ball-fidbek·taxmin-natija·tuzoq-izoh·keys-matn·tugma/shkala·uy-vazifa·saqlash-shart) bo'yicha foydalanuvchi TASDIQLAGAN ✅ gaplar (F-0726-01 dan so'zma-so'z) + rad etilgan ❌ variantlar + bir qatorlik sabab; boshida 7 yozuv-tamoyil. Yangi qoida: matn yozadigan har rol ishni KORPUSdan boshlaydi — qonun tekshiradi, korpus o'rgatadi.
2. **Til-lint DARVOZA bo'ldi:** `npm run lint:til` package.json'ga kirdi (skript oldindan bor edi — endi majburiy); qoidalarga bugungi 5 topilma qo'shildi (xato-ball, kodda-xato, ishlaydi-hukm, toq-yuradi, bublik) — jami 44 qoida. 3 etalon PM dars: ✓ TOZA.
3. **Feedback-marshrut yangilandi (CLAUDE.md B-retsept):** matn-topilma AVVAL korpus-juftlik, keyin qonun/lug'at; grep-lanadigan bo'lsa til-lint-qoida ham. CLAUDE.md tamoyillarga «Matn-darvozalari» bandi (korpus-avval + lint:til 0-error).
4. **👦 simulyator o'tkirlandi** (OQUVCHI_DARVOZA + darslik-oquvchi rol): «niyat 16/17» kabi dag'al son yetarli emas — ikki majburiy jadval: (a) qayta o'qilgan HAR gap SO'ZMA-SO'Z + file:line + nimasi qoqiltirgani; (b) begona-so'zlar kontekst-gapi bilan. TUZATILDI-juftliklar korpusga muhrlanadi.
5. **Rol-fayllar:** pm-metodist + darslik-metodist («ishni korpusdan boshla» sarlavha-bandi), pm-tekshiruvchi + darslik-tekshiruvchi (lint:til 0-error darvoza-bandi).
**Kutilayotgan natija:** har darsda 14 topilma → 2-3 topilma; foydalanuvchi feedbacki endi «shu darsni tuzatish» emas, «korpusni boyitish» — har biri barcha kelgusi darsga ishlaydi.
**Keyingi qadam (foydalanuvchi tanlaydi):** sinov-pilot — bitta darsning matnini korpus-usulda qayta yozib taqqoslash. UNCOMMITTED.

## P18 raund (2026-07-27) — F-0727-01: USERSTORY 2-EKRAN NAMUNA-KARTALARI ETALON ABRAZETSGA O'TDI — ✅
**Foydalanuvchi feedbacki:** «2-pageda "yangi mehmon" va hokazo 3 ta misol umuman to'g'ri kelmaydi» → keyin: «uchtasi ham to'g'ri bo'lsin, lekin o'quvchi hayotidan emas — yaxshiroq **abrazets** qilaylik».
**Tashxis (3 tizimli nuqson, `PmUserStoryLesson.jsx:938-942`):**
1. **Namuna darsning o'z qonunini buzardi.** 3-karta: «Men mentorim sifatida, topshirig'imni tez topishni xohlayman, **bahosini qo'yish** uchun» — NATIJA yana bitta harakat, ya'ni aynan TEST-2 (s8, idx 6) «xato» deb o'rgatadigan naqsh. O'quvchi birinchi ko'rgan namunaga taqlid qiladi → noto'g'ri naqshni o'zimiz o'rgatardik.
2. **Shaxs sinardi.** «Men yangi mehmon sifatida, **ishlarimni** bitta ekranda ko'rishni xohlayman, **meni** tez tanib olish uchun» — gap mehmon tilidan, egalik qo'shimchalari esa sayt egasiniki. «sinfdoshim»/«mentorim» ham KIM emas, egalik shakli.
3. **3 karta 3 xil mahsulotdan** (portfolio + o'yin + maktab tizimi), holbuki mentor «**loyihangiz** uchun 3 hikoya» deydi va ustaxona `kimTakror` bilan bitta loyihaga 3 xil KIM talab qiladi → «3 hikoya = 3 loyiha» degan noto'g'ri model.
**Qaror (foydalanuvchi tanladi):** namuna-mahsulot = **YouTube** (2-ekrandagi YouTube misoli bilan bir ip), 3 xil foydalanuvchi: imtihonga tayyorlanayotgan o'quvchi (2 barobar tez ko'rish → bir kechada ko'proq mavzu ulgurishim) · yo'lda ketayotgan tomoshabin (oldindan yuklab qo'yish → internet yo'q joyda ham ko'ra olishim) · yangi kanal egasi (kim ko'rganini bilish → kimga mos video yasashni tushunishim).
**Qilingan ish:** `DEMO_STORIES` qayta yozildi + mentor gapi («mana YouTube uchun yozilgan 3 hikoya: uch xil odam, uch xil foyda») + manba-yorlig'i `.demo-src` («▶️ YouTube jamoasi shunday yozadi») qo'shildi; ustaxona 3 placeholder'i ham shu abrazetsga moslandi (eski buzuq «ishlarimni ko'rish»/«meni tez tanib olish» ipuchalari olib tashlandi).
**Tekshiruv:** esbuild toza (359.5 kb) · `lint:til` ✓ TOZA (44 qoida) · qiyshiq-apostrof grep 0 · brauzer-ko'rik (playwright, 1280 va 900 px): 3 karta ham bir qatorga sig'di, o'ralish yo'q · eski misol qoldig'i grep: 0.
**Muhrlandi:** `MATN_KORPUS.md` 13-bo'lim «NAMUNA-KARTA (abrazets)» (3 ✅ + 4 ❌ juftlik) · `PM_DARS_ETALON.md` **68-qonun** (tanish real mahsulot + izchil shaxs + dars qonuniga bo'ysunish + placeholder bir dunyodan).
**⚠️ QOLDI:** xuddi shu tekshiruv JTBD va Metrika namuna-kartalariga ham qilinishi kerak (68-qonun bo'yicha). UNCOMMITTED, deploy qilinmagan.

## P19 raund (2026-07-27) — F-0727-02: USERSTORY 3-EKRAN YAKUNI VA MISOLI QAYTA QURILDI — ✅
**Foydalanuvchi feedbacki:** «3-pageda "Ajratdingiz" va "hikoya yuragi sabab" degani tushunarsiz, to'liq yaxshi formatda qilaylik; yashildagi "Men kechikayotgan o'quvchi sifatida…" misoli ham biroz tushunarsiz».
**Tashxis (`PmUserStoryLesson.jsx:1010-1018`):**
1. **Yakun maqtov edi, xulosa emas.** «✅ Ajratdingiz!» — o'quvchi nima **bosganini** aytadi; «Hikoyaning yuragi — sabab» — ochilmagan metafora, ustiga bu ekranda «hikoya» so'zi umuman ishlatilmagan (javob bor, savol yo'q). Darsning kalit g'oyasi status-chiziqcha (`done-mini`) ichida — vizual og'irligi «✓ bajarildi» belgisiniki.
2. **Misol boshqa dunyodan, ko'priksiz.** Butun ekran telefon-ilovalari haqida (Telegram/YouTube) → birdan **taksi**. Ustiga formula-qolipi («Men […] sifatida…») faqat KEYINGI ekranda o'rgatiladi → o'quvchi kalitsiz shaklni ko'radi. Bo'laklar belgilanmagan: ekran aynan «harakat/sabab»ni o'rgatdi, misolda esa qaysi qism qaysiligi ko'rinmaydi. Yashirin takror: shu gap keyingi ekranda yig'iladi, lekin aytilmagan.
3. **🔴 RANG-ZIDDIYATI (ko'rikda topildi, feedbackda yo'q edi).** `.s2tag.harakat` = **ko'k**, holbuki darsning qolgan qismida ko'k = **KIM** (`.fslot.kim.filled`, `.silo-slot.kim`), harakat/NIMA esa sariq. Ya'ni o'quvchi 3-ekranda «ko'k = harakat» deb o'rganib, 4-ekranda ko'kni KIM ustida ko'rardi — yangi qurilgan ma'no-bog'i uzilardi.
**Qaror (foydalanuvchi tanladi):** misol o'quvchining O'Z ishidan o'stiriladi (taksi olib tashlandi).
**Qilingan ish:** (a) `done-mini` o'rniga **xulosa-karta** («Sabab — eng qimmatli qism» + 3 gaplik ochiq izoh, yangi `.ta-b`); (b) **o'stirish-karta** (`.grow-card`): o'quvchi ajratgan 2 bo'lak → ↓ → to'liq hikoya, bo'laklar rangli + legenda (🙋 kim · 🏃 harakat · 💡 sabab) + ko'prik-gap «Keyingi ekranda mana shu 3 bo'lakni o'zingiz joylaysiz»; (c) 4-ekran `FRAG_POOL` shu hikoyaga o'tdi (matematika/YouTube) — bir dunyo, ikki qadam; done-mini izohi ham yangilandi; (d) **rang-semantikasi bir xillashtirildi**: `.s2tag.harakat` ko'k→sariq (ko'k faqat KIM'da qoldi).
**Tekshiruv:** esbuild toza (363.4 kb) · `lint:til` ✓ TOZA · `lint:prompt` toza · brauzer-ko'rik (playwright 1280px): 3-ekran yakuni va 4-ekran konstruktori yangi bo'laklar bilan ishlaydi, chip↔slot mosligi buzilmagan · «taksi/kechikayotgan/darsga ulgurish» qoldiq grep: 0.
**Muhrlandi:** `PM_DARS_ETALON.md` **69-qonun** (mashq yakuni — maqtov emas, xulosa), **70-qonun** (metafora ochiladi; misol o'z ishidan o'sadi yoki ko'prik qo'yiladi + bo'laklar belgilanadi + keyingi ekranga ishorat), **71-qonun** (rang ma'nosi butun dars bo'ylab bitta) · `MATN_KORPUS.md` 14- va 15-bo'limlar.
**⚠️ QOLDI:** 71-qonun bo'yicha JTBD va Metrika darslarida rang-xaritasi tekshirilmagan. UNCOMMITTED, deploy qilinmagan.

## P20 raund (2026-07-27) — F-0727-03: MILKSHAKE KEYSI (6-EKRAN) TILI TUSHUNARLI QILINDI — ✅
**Foydalanuvchi feedbacki (3 nuqta + 2 taqiq):** sarlavha «Milkshake javobi» g'alati; 3-slayd «qo'l keladi» va «och qoldirmaydi» yaxshilansin; 4-slayd «quyuqroq / uzoqroq yetadi / kirish yonidagi avtomat» tushunarsiz. Muhokamada taqiqlar: «sir» so'zi ishlatilmaydi, «qorin» ham; «sekin-sekin ichiladi» va «ayni mos» ham rad etildi.
**Tanlangan matnlar (foydalanuvchi variantlab tasdiqladi):**
- Sarlavha: «Nega milkshake aynan ertalab ko'p olinadi? Endi bilib olamiz» (savol + va'da, og'ir so'zsiz).
- 3-slayd: «…Milkshake ana shu yo'lda **uchta foyda** berarkan: bir qo'lda bemalol ushlanadi; tez tugamaydi — yo'l oxirigacha yetadi; va to'yimli — odamni tushlikkacha to'q saqlaydi.» «Uchta foyda» — darsning o'z so'zi (2-ekran «sabab=foyda»ni endigina o'rgatgan) + keyingi slaydga ko'prik (McDonald's shu foydalarni kuchaytiradi).
- 4-slayd: har qaror + NEGA + odamga foydasi: «yanada quyuq qildi — quyuq ichimlik uzoq ichiladi, endi u yo'l oxirigacha tugab qolmaydi»; «kassadan eshik oldiga ko'chirdi — mijoz o'zi quyib oladigan maxsus apparat qo'ydi, shoshayotgan haydovchi navbatda turmasdan olib ketaveradi».
**Izchillik-sweep (65-qonun):** 5-slayd xulosasi «och qolmaslik»→«to'q qolish»; taxmin-chip «quyuqroq qildi»→«yanada quyuq qildi»; «Sirni bilgach»→«Buni bilgach» (2 joy); QUIZ_BANK 2 savoli yangilandi («och qolmaslik»→«to'q qolish»; «Quyuqroq qilib, kirishdagi avtomatga»→«Yanada quyuq qilib, eshik oldidagi apparatga»; savol-matni «Sirni bilgach»→«Haqiqiy sababni bilgach»).
**MUHIM — korpus-presedent:** 9-bo'limdagi eski ✅ (F-0726-01 «qo'l keladi… sekin-sekin… och qoldirmaydi») foydalanuvchi tomonidan QAYTA KO'RILIB BEKOR qilindi → korpusda ❌ ga ko'chirildi (sabablari bilan), yangi ✅ = uchta-foyda varianti. Oltin-namuna ham muzlatilgan emas — foydalanuvchi hukmi ustun.
**Til-lint boyidi (+2 qoida, jami 46):** `och-qoldir` (inkor-shakl → «to'q saqlaydi»), `qol-keladi` (eskicha ibora); `toq-yuradi` suggest'i yangilandi. 3 PM dars ham yangi qoidalar bilan ✓ TOZA.
**Tekshiruv:** esbuild toza · lint:til ✓ (46 qoida) · residue-grep («och qol/qo'l keladi/sekin-sekin ichiladi/quyuqroq/avtomat/Sirni bilgach») = 0 · brauzer-ko'rik (playwright): 1-, 3-, 4-slaydlar + taxmin-o'yin «yanada quyuq qildi» chipi bilan to'g'ri ishlaydi.
**Muhrlandi:** `MATN_KORPUS.md` 9-bo'lim qayta yozildi (yangi ✅/❌ juftliklar + sarlavha-jufti) · `til-lint-rules.json` +2 qoida. Yangi etalon-qonun kerak emas (69-70-qonunlar allaqachon qamraydi). UNCOMMITTED.

## P21 raund (2026-07-27) — F-0727-04: TEST-2 IZOHI QISQARDI + USTAXONA YO'RIQLARI SODDALASHDI — ✅
**Foydalanuvchi feedbacki:** (1) 7-ekranda to'g'ri javob izohi juda uzun — qisqa va tushunarli bo'lsin; (2) 8-ekranda «3 hikoya tayyor — o'zgartirmoqchi bo'lsangiz…» → «Uchta hikoya tayyor — tahrirlash uchun qalamcha ikonchasidan foydalaning» (kichkina tursin); (3) yulduz-izohdagi «1 yulduz — unchalik muhim emas, 5 yulduz — eng muhimi» olib tashlansin — savol-gap o'zi yetadi.
**Qilingan ish:** (a) Screen8 `explainCorrect` 27→14 so'z: «To'g'ri — "saytga kirish uchun" harakatning takrori, foyda aytilmagan. To'g'risi masalan: "buyurtmamni tez topish uchun".»; (b) done-mini: «✅ Uchta hikoya tayyor — tahrirlash uchun qalamcha (✎) belgisidan foydalaning»; (c) svd-foot: «⭐ Har hikoyangizga yulduz qo'ying: bu hikoya siz uchun qanchalik muhim?» (shkala-sanoq va «keyingi darsda…» gapi olib tashlandi — prioritet-ekran o'zi tushuntiradi).
**Qonun-moslash:** 67-qonun aniqlashtirildi — savol-gap o'lchovni o'zi aytsa, «1 yulduz — …» sanog'i SHART EMAS; yo'riq-gap ikonkani nomlasa («qalamcha (✎)»), tugma-matni talabi qondirilgan hisoblanadi. Korpus 10-bo'lim yangilandi (eski ✅ → yangi ✅, F-0727-04).
**Tekshiruv:** esbuild toza · lint:til ✓ (46 qoida) · residue-grep («1 yulduz/unchalik muhim/o'zgartirmoqchi») = 0 · brauzer-ko'rik: TEST-2 reveal yangi qisqa izoh bilan, ustaxona-daftar yangi yo'riqlar bilan render bo'ldi. UNCOMMITTED.

## P22 raund (2026-07-27) — F-0727-05: PEER-EKRAN «HUKM» TILI VA KARTA-YORLIG'I OLIB TASHLANDI — ✅
**Foydalanuvchi feedbacki:** (1) 9-ekranda «Har kartaga hukm bering» — «hukm» so'zi emas, «To'g'ri/Noto'g'riga ajrating» kabi tushunarli bo'lsin, shunda «bu hikoya to'g'rimi noto'g'rimi?» dum-savoli ham kerak bo'lmaydi; (2) karta tepasidagi «QIDIRUV QATORI» yorlig'i muhim emas — olib tashlansin.
**Qilingan ish:** (a) Mentor: «Har kartani o'qing va **✓ To'g'ri** yoki **✕ Noto'g'ri**ga ajrating.» — tugma-nomlari gapning o'zida (61-qonun: bir tushuncha — bir nom); (b) «hukm» barcha o'quvchi/mentor matnlaridan chiqarildi: yakun «uchala javobingiz yonma-yon», MentorNote «Har javobdan keyin… Nega shunday ajratdingiz?»; (c) `nom` maydoni PEER_CARDS'dan o'chirildi, karta-tepa yorlig'i yo'q, yakun-jadval «1-karta/2-karta/3-karta», o'lik `.peer-nom` CSS o'chirildi.
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik: peer 1-karta yangi mentor-gap bilan, to'liq sikl (✕+sabab → ✓ → ✕+sabab) o'tildi, yakun-jadval raqamli yorliqlar bilan chiqdi. UNCOMMITTED.

## P23 raund (2026-07-27) — F-0727-06: TEST-3 SAVOLI ANIQLASHDI, IZOHI QISQARDI — ✅
**Foydalanuvchi feedbacki:** 10-ekranda (1) «Bu gap aslida nima?» — «aslida nima» tushunarsiz; (2) to'g'ri-javob izohi juda uzun, o'quvchi o'qimaydi — qisqa: hikoya emasligi + KIM/NATIJA yo'qligi yetadi.
**Qilingan ish:** (a) savol: «Bu gap User Story'mi? Javobni tanlang.» — variantlar shu savolga to'g'ridan javob beradi; (b) izoh 43→16 so'z: «To'g'ri — bu hali hikoya emas, shunchaki so'rov: unda KIM ham, NATIJA ham yo'q, faqat NIMA aytilgan.» To'liq tuzatish-namunasi RECAPS[9] «Hikoyaga aylantiring» kartasida saqlanadi — ma'lumot yo'qolmadi, faqat joyi to'g'irlandi (reveal = qisqa hukm, recap = to'liq misol).
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik: TEST-3 reveal yangi savol va qisqa izoh bilan chiqdi. UNCOMMITTED.

## P24 raund (2026-07-27) — F-0727-07: KLINIKA TUZOG'I MAVHUM-FOYDAGA ALMASHDI + MENTOR GAPI SODDALASHDI — ✅
**Foydalanuvchi feedbacki:** 11-ekranda (1) «bu kimga kerakligi ham, unga qanday foyda berishi ham yo'q» — og'ir, soddalashtirish kerak; (2) «sahifani tez ochish» (to'g'ri NIMA) va «saytning tez ishlashi» (tuzoq) ajratib bo'lmaydi — «buyam xato», bittasini yoki abrazetsni o'zgartirish kerak.
**Tashxis:** takror-NATIJA tuzog'i o'z TABIATIGA ko'ra NIMA'ga o'xshaydi — 64-qonunning «ma'nodosh, ammo boshqa so'zlar» ruxsati amalda yiqildi (boshqa so'zlar bilan yozilgan bo'lsa ham o'quvchi ajratolmadi). Takror-NATIJA darsi TEST-2 va ustaxona saqlash-shartida allaqachon o'rgatiladi.
**Qaror (foydalanuvchi V1 tanladi):** tuzoq-turi almashdi — «saytning tez ishlashi» (takror) → «sayt hammaga yoqishi» (mavhum foyda), kuyish-izohi: «"Yoqishi" — aniq foyda emas, umumiy gap. Sayt tez ochilgach, mehmon aynan nima qila oladi? O'shani tanlang.» Endi ikki tuzoq bitta xato-sinf (mavhumlik): mavhum KIM + mavhum NATIJA.
**Qilingan ish:** CLINIC_POOL tuzoq-chip + izoh; mentor gapi «Bu gapda KIM ham, NATIJA ham yo'q — shuning uchun u hali hikoya emas» (TEST-3 reveal bilan so'zma-so'z bir xil — mustahkamlash); MentorNote yangilandi.
**Muhrlandi:** **64-qonun KUCHAYTIRILDI** — tuzoq to'g'ri chipdan ma'no jihatdan ham uzoq turadi; bir mashq tuzoqlari bitta xato-sinf atrofida; takror-NATIJA tanlov-mashqda o'rgatilmaydi. Korpus 8-bo'lim: yangi ✅ (yoqishi-izoh) + yangi ❌ (ma'nodosh-tuzoq dalili), eski takror-izoh ✅ olib tashlandi.
**Tekshiruv:** esbuild toza · lint:til ✓ · residue («saytning tez ishlashi»/«kimga kerakligi») faqat kod-kommentda · brauzer-ko'rik: klinika yangi chiplar bilan, tuzoqqa atay tushib izoh tekshirildi. UNCOMMITTED.

## P25 raund (2026-07-27) — F-0727-08: PRIORITET-DOSKA — «BARCHA ISHNI» + KARTA-LAGANCHA (UX) — ✅
**Foydalanuvchi feedbacki:** 13-ekranda (1) «Hamma ishni» → «Barcha ishni» («hamma» noaniq); (2) 3 hikoya-karta mentor gapidan keyin darhol yopishib turibdi — pastroqda tursin va qizil yonib turadigan border bilan «bularni joylashtirish kerak» darrov bilinadigan bo'lsin, UX maksimal yaxshilansin.
**Qilingan ish:** (a) mentor gapi «Barcha ishni birdaniga qilib bo'lmaydi…»; (b) yangi **lagancha** (`.pd-tray`): kartalar issiq-fonli idishga o'raldi, tepasida buyruq-yorliq «✋ Bu 3 hikoyangizni pastdagi ustunlarga joylashtiring ↓» (strelka o'zi silkinib turadi), border qizil pulsda yonadi (`tray-pulse`); o'quvchi karta tanlagach/joylagach `calm` — puls tinchiydi, ingichka statik border qoladi; `prefers-reduced-motion`da puls yo'q, statik qizil border. Margin bilan mentor-gapdan ajratildi.
**Yo'lda topilgan bug:** `.fade-up` klassi bilan yangi `animation` to'qnashdi — lagancha opacity:0 da qolib butunlay KO'RINMAY qolgan edi (birinchi screenshot fosh qildi). Yechim: fade-up olib tashlanib, kirish o'z keyframe'ida (`tray-in`) puls bilan vergul-zanjirda birlashtirildi.
**Muhrlandi:** PM_DARS_ETALON **72-qonun** — ko'chiriladigan elementlar alohida laganchada, harakat-chorlovi + diqqat-pulsi + birinchi harakatdan keyin tinchish.
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik 2 holat: puls-holat (kartalar laganchada, yorliq qizil) va calm-holat (1-karta «Hozir»da, lagancha tinch). UNCOMMITTED.

## P26 raund (2026-07-27) — F-0727-09: MUSTAHKAMLASH-EKRAN TILI DARS LUG'ATIGA QAYTARILDI — ✅
**Foydalanuvchi feedbacki:** 14-ekranda «va u kimga kerak?» (sarlavha), «o'z so'zingiz bilan» va «unga qanday foyda beradi» (mentor) — uchchalasi tushunarsiz.
**Tashxis:** ekran-matni dars lug'atidan chetlashgan; «o'z so'zingiz bilan»ning niyati — yodaki qayta aytish — ochiq aytilmagan.
**Qilingan ish:** sarlavha «Eng muhim hikoyangizni *yoddan* aytib bera olasizmi?» (4-ekran «tuza olasizmi?» bilan bir ohang — challenge-savol); mentor: «…ekranga qaramasdan, yoddan aytib bering: KIM uchun yozdingiz va u odam qanday foyda oladi?» — dars atamalari (KIM/foyda) bilan.
**Tekshiruv:** esbuild toza · lint:til ✓ · residue («o'z so'zingiz»/«kimga kerak») 0. UNCOMMITTED.

## P27 raund (2026-07-27) — F-0727-10: UYGA-VAZIFA TUR-NOMLARI EGALIKSIZ + QADAM-GAP TUZILDI — ✅
**Foydalanuvchi feedbacki:** 15-ekranda (1) «o'zingiznikini yozing» tushunarsiz; (2) «mentorim» chipi — «-im» qo'shimchasi xato: «mentorim kimligini bir gapda aniqlang» noto'g'ri gap-tuzilma; (3) 17-ekran uy-vazifa eslatmasida ham xuddi shu («Uyda mentorim uchun 2 ta yangi hikoya…»).
**Tashxis:** F-0727-01 xato-sinfining qoldig'i — chip QIYMATI gap ichiga qo'yiladi, egalik qo'shimchasi bilan gap sinadi.
**Qilingan ish:** (a) `HW_TARGETS` egaliksiz: «do'st / mentor / birinchi mehmon» (17-ekran eslatmasi shu qiymatdan o'zi tuzatiladi); (b) qadam-gap: «kimligini bir gapda aniqlang» → «qanday odam ekanini bir gapda yozing» (topshiriq-karta + summary, 2 joy); (c) mentor: «pastdan tanlang yoki o'zingiznikini yozing» → «pastdagi ro'yxatdan bittasini tanlang yoki "➕ o'zim yozaman"ni bosing» (tugma o'z nomi bilan); (d) placeholder «ota-onam» → «ota-ona».
**Eslatma:** 3-ekrandagi «do'stim bilan gaplashish uchun» tegilmadi — u o'quvchining o'z gapi (sabab-bo'lak), tur-nomi emas.
**Tekshiruv:** esbuild toza · lint:til ✓ · residue («mentorim/do'stim/kimligini/o'zingiznikini» tur-nomi sifatida) 0. UNCOMMITTED.

## P28 raund (2026-07-27) — F-0727-11: ARENA «XATO…💪» QOLDIG'I 2 DARSDA TOPILDI + LINT-PATTERN BUGI — ✅
**Foydalanuvchi feedbacki:** CodeStrike arenada (1) darsda o'tilmagan savol so'ralmasin — bankni ko'rib chiq; (2) xato javobda «Xato» demasin («Adashdingiz»/«noto'g'ri» bo'lsin — «xato» agressiv); (3) oxiridagi 💪 emoji olib tashlansin.
**Tashxis:** UserStory arenasi ALLAQACHON to'g'ri edi (F-0726-01, 66-qonun) — «Xato — 0 ball… 💪» qoldig'i **JTBD va Metrics** arenalarida turgan ekan. Ustiga BONUS-BUG: `til-lint-rules.json`dagi `xato-ball` va `ishlaydi-hukm` qoidalari patternida `\s` o'rniga `s` yozilgan — qoidalar HECH QACHON ishlamagan, shu sabab bu ikki dars lintdan «toza» o'tib kelgan.
**Qilingan ish:** (a) lint-pattern tuzatildi (`Xato\s*[—–-]\s*0 ball`, `[✓✔]\s*ishlaydi`) — tuzatilgach lint darhol 2 darsda 🔴 topdi (qoida endi ishlashining isboti); (b) JTBD+Metrics arena: «Adashdingiz — 0 ball. Keyingisida olasiz.» / «Vaqt tugadi — 0 ball. Tezroq bo'ling.» (💪 va ⏱ olib tashlandi); (c) 61-qonun tarqatildi: peer hukm-tugmalari «✓ ishlaydi / ✕ tuzatish kerak» → «✓ To'g'ri / ✕ Noto'g'ri» (tugma + xulosa-jadval, 2 darsda); (d) F-0727-05 tarqatildi: «hukm chiqaring» mentor-gaplari «✓ To'g'ri yoki ✕ Noto'g'riga ajrating»ga (2 darsda); mentor-proyektor yorlig'i «Xato bo'ldi» → «Adashdi» (2 darsda).
**Savol-qoplama auditi (65-qonun):** UserStory 12/12 ✓ (har savolga aytgan-ekran bor: formula s3-4, KIM/NIMA/NATIJA slotlar, OLDIN-takeaway koding, keys 3-5 slayd, TEST-1/2/3) · JTBD 12/12 ✓ (drel/formada/Starbucks/uchinchi joy/surat/velosiped-avtobus/suhbat — hammasi darsda bor) · Metrics 12/12 ✓ (Churn/MAU/streak/taom/foiz — bor; Q12 «kelish≠qaytish» 1170-qator done-mini'da ochiq aytilgan). O'chiriladigan savol topilmadi.
**Tekshiruv:** esbuild 3/3 toza · lint:til 3 dars ✓ TOZA (tuzatilgan 46 qoida bilan) · lint:prompt ✓. UNCOMMITTED.

## P29 raund (2026-07-27) — F-0727-12: JTBD DARSI «ISH»→«VAZIFA» + RAQIB OLIB TASHLANDI + NAMUNALAR YANGILANDI — ✅
**Foydalanuvchi feedbacki (JTBD, 2-sahifa va bog'liq):** (1) «ish» atamasi o'quvchiga tushunarsiz — «vazifa» ishlatilsin (global); (2) mentor gapida «o'z-o'zidan» ortiqcha; (3) demo-kartada «qahva — ish oldidan jonlanish» tushunarsiz, haqiqiy misollar kerak; (4) «brend krossovka» misoli butunlay almashtirilsin; (5) «3/3 natijasi uchun ochiladi» sun'iy; (6) raqib (velosiped-avtobus) umuman olib tashlansin — o'quvchiga foydasi yo'q.
**Qilingan ish (63+6 almashinuv, skript bilan):**
1. **Atama:** «ish»→«vazifa» butun dars bo'ylab — gloss («bajarilishi kerak bo'lgan vazifa»), slotlar (ISH→VAZIFA, ISHI→VAZIFASI, ISH TURI→VAZIFA TURI), RECAPS 3 ta, testlar (savol+izohlar), MatchPairs, ustaxona-hintlar, peer-sabablari, koding, summary, uy-vazifa, QUIZ_BANK 8 savol, SCREEN_INTENTS, fon-chiplar. Yollash-metafora («ishga qabul», «✓ YOLLANDI») ataylab saqlandi — u atama emas. Funksional tur tavsifi «Vazifa bitsin»→«Amalda bajarilsin» (atama bilan aylanma bo'lib qolmasin), mos test-savol va izohlar ham.
2. **Demo-kartalar:** 🎧 quloqchin — «sevimli musiqani eshitish» (emotsional) · 🚲 velosiped — «maktabga tez yetib olish» (funksional) · 📱 yangi telefon — «davrada zamonaviy ko'rinish» (ijtimoiy). Ustaxona placeholder'i ham telefon-misolga o'tdi. Ko'rikda tutildi: birinchi variant («yo'lda sevimli musiqani eshitish») karta max-width 220px dan uzun — matn kesilardi, qisqartirildi.
3. **Mentor gapi** «o'z-o'zidan»siz: «Qarang, mana 3 ta namuna hozir to'lib boradi».
4. **3-sahifa:** «har biri qaysi vazifa uchun turganini ko'rasiz» / «✓ 3/3 — har ilova o'z vazifasi uchun turibdi» / «ilovani chiroyi uchun emas, vazifasini bajarishi uchun ochamiz».
5. **Raqib to'liq o'chirildi (5 joy):** yashil ex-card, RECAPS «Raqib ham bor» kartasi, ustaxona «⭐ RAQIB» maydoni (+o'lik CSS), summary-ro'yxat qatori, fon-chip/TOK. Arena savoli «Velosipedning raqibi kim?» → «Mahsulotni nimaga "yollaymiz"? — vazifani bajarishi uchun» (s1/s2 da qoplangan, 65-qonun).
**Muhrlandi:** MATN_ETALONI LUG'AT: «ish (JTBD) → vazifa» qatori (yollash-metafora istisnosi bilan).
**Tekshiruv:** esbuild toza · lint:til ✓ · residue-grep («ish» atama sifatida, ISH/ISHI slotlar, raqib UI) = 0 (faqat kod-ichki maydon nomlari qoldi — localStorage moslik) · brauzer-ko'rik: s1 (3 yangi karta, VAZIFA sloti) + s2 (VAZIFASI flip, yangi yakun, raqib-karta yo'q). UNCOMMITTED.

## P30 raund (2026-07-27) — F-0727-13: JTBD 4-SAHIFA — DREL VOQEA BO'LDI, BOLT-EMOJI KETDI — ✅
**Foydalanuvchi feedbacki:** (1) mentor gapi drel haqida to'liq emas — birinchi o'qigan o'quvchi tushunishi qiyin; (2) 🔩 bolt-emoji «drel» sifatida kulguli — boshqa narsa qo'yilsin; (3) «✅ 3/3 har misol o'z turini topdi» — «har/turi» keraksiz.
**Qilingan ish:** (a) mentor gapi VOQEA shakliga o'tdi: «Otangiz devorga rasm osmoqchi va do'kondan drel (devor teshadigan asbob) sotib oldi. Unga drelning o'zi kerakmidi? Yo'q — unga devorga osilgan rasm kerak edi…» — savol-javob ritmi bilan, atama oxirida; (b) vizual qayta qurildi: aylanadigan 🔩 o'rniga ikki YOZUVLI karta «DO'KONDAN OLINDI: 🛠️ drel» → «ASLIDA KERAK EDI: 🖼️ devordagi rasm» (yashil urg'u kerak-tomonda; emoji taxminiy bo'lsa ham yorliq aniq aytadi) + o'lik CSS (jdrill-tool/wall/pic, spin-keyframes) o'chirildi; (c) done-mini: «✅ 3/3 — hammasi o'z joyida!» (izoh-qism olib tashlandi — ustunlarning o'zi darsni beradi).
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik: mentor-voqea + ikki karta + 3 misol joylangan holat. UNCOMMITTED.

## P31 raund (2026-07-27) — F-0727-14: JTBD TEST-1 TO'LIQ GAPLARGA O'TDI, IZOH QISQARDI — ✅
**Foydalanuvchi feedbacki:** 5-sahifada test-hikoya bo'lak-bo'lak gaplardan tuzilgan («…yugurish poyabzali oldi, fitnes-ilova yukladi…»), javob-variantlar ham chala; to'g'ri-javob izohi juda uzun — o'quvchi o'qimaydi.
**Qilingan ish:** (a) hikoya 2 to'liq gap: «Ali formada bo'lishni xohlaydi. Shuning uchun u yugurish poyabzali sotib oldi, fitnes-ilova yuklab oldi va sport soati taqdi.»; (b) savol soddalashdi: «Ali aslida nimani xohlaydi?»; (c) variantlar savolga grammatik javob beradigan TO'LIQ shaklda: «Yangi yugurish poyabzaliga ega bo'lishni / Formada bo'lishni / Fitnes-ilovadan foydalanishni / Sport soati taqib yurishni»; (d) izohlar qisqardi (correct: «To'g'ri — Alining asl maqsadi "formada bo'lish". Qolgan uchtasi shunchaki shu maqsadga olib boradigan mahsulotlar.»; wrong-izohlar bir naqshda: «X — mahsulot, maqsad emas…»); (e) qoldiq atama: eyebrow «Tekshiruv · ish 1/2» → «vazifa 1/2».
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P32 raund (2026-07-27) — F-0727-15: JTBD STARBUCKS KEYSI TILI — «UCHINCHI JOY» OCHILDI — ✅
**Foydalanuvchi feedbacki:** 6-sahifada (1) «bemalol taxmin qiling» → «bemalol belgilang» (buyruq-ohang «taxmin qil» bo'lmasin); (2) 2-slayd «uchinchi joy» — «joy» so'zi nimaligini o'quvchi payqamasligi mumkin, to'liq nazariya-so'zlar bilan ochilsin; (3) 3-slayd «"o'zimniki" degan his» yaxshilansin; (4) 5-slayd (xulosa)da ham «uchinchi joy» yalang'och.
**Qilingan ish:** (a) taxmin-yorliqlari: tag «🎲 Avval o'zingiz belgilab ko'ring» + cap «Bu ball emas — bemalol belgilang, javob hozir ochiladi»; (b) 2-slayd: «Kuningiz asosan ikki joyda o'tadi: uy va maktab. Starbucks esa: "biz — sizning uchinchi joyingizmiz" deydi. Ya'ni uydan ham, maktabdan ham tashqari — kelib bemalol o'tiradigan, do'stlar bilan uchrashadigan yana bitta qulay makon.»; (c) 3-slayd: «…qulay stol, Wi-Fi, musiqa — va o'zini xuddi uyidagidek erkin his qilish»; (d) 5-slayd: «…kelib bemalol o'tiriladigan qulay makonni, ya'ni "uchinchi joy"ni sotadi»; (e) RECAP-kartadagi «uchinchi joy» ham shu tilga tortildi (test-recap arena savoli bilan mos qoladi).
**Tekshiruv:** esbuild toza · lint:til ✓ · «taxmin qiling» qoldiq 0. UNCOMMITTED.

## P33 raund (2026-07-27) — F-0727-16: JTBD TEST-2 SAVOLI TO'LIQ GAPGA O'TDI — ✅
**Foydalanuvchi feedbacki:** 7-sahifa testida «Bu qaysi tur vazifa?» — savol chala va tushunarsiz; qolgani yaxshi.
**Qilingan ish:** savol «Do'stlarning bu vazifasi qaysi turga kiradi? Tanlang.» (hikoyaga bog'langan to'liq gap); jonli-panel yorlig'i ham «Suratga tushib yuborish qaysi turga kiradi?». Variantlar/izohlar/kalit tegilmadi.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P34 raund (2026-07-27) — F-0727-17: JTBD USTAXONA — «DAFTAR» PANEL NOMIGA MOSLANDI, ORTIQCHA FOOTER KETDI — ✅
**Foydalanuvchi feedbacki:** 8-sahifada (1) «o'ngdagi daftarga» — panel aslida «Kartalarim», «jadval» yoki boshqa nom kerakmi? (2) «kerak bo'lsa … tahrirlang» — UserStory'dagi yechim (F-0727-04 qalamcha-yo'rig'i) bunga ham; (3) ro'yxat ostidagi «Keyingi darsda foydalanuvchilar bilan…» qatori ortiqcha — olib tashlansin.
**Qaror:** «daftar»/«jadval» o'rniga panelning O'Z nomi (61-qonun): «"Kartalarim" ro'yxatiga ko'chadi».
**Qilingan ish:** mentor-gap «Kartalarim» ro'yxati bilan; done-mini «✅ Uchta karta tayyor — tahrirlash uchun qalamcha (✎) belgisidan foydalaning» (F-0727-04 naqshi); saqlash-hint «daftarda»→«ro'yxatda»; `jbook-foot` qatori + CSS o'chirildi.
**Tekshiruv:** esbuild toza · lint:til ✓ · «daftar» qoldiq 0. UNCOMMITTED.

## P35 raund (2026-07-27) — F-0727-18: JTBD PEER-EKRAN USERSTORY NAQSHIGA TO'LIQ TENGLASHDI — ✅
**Foydalanuvchi feedbacki:** 9-sahifa (tekshiruvchi stoli) UserStory'dagi yechimlarga (F-0727-05) moslansin; mentor gapidagi «hukm» ham o'sha yechim bilan ketsin.
**Holat:** «hukm» va tugmalar P28 da allaqachon tuzalgan edi; qolgan farqlar yopildi: (a) karta qatoridagi kichik yorliq «ish» → «vazifa» (F-0727-12 ning ko'zdan qochgan qoldig'i); (b) yakun-holatda mentor endi UserStory'dagidek gapiradi: «Mana, uchala javobingiz yonma-yon.» (avval yakunda ham boshlang'ich yo'riq qotib turardi).
**Tekshiruv:** esbuild toza · lint:til ✓ · «hukm» o'quvchi-matnlarda 0 (faqat agent-spec kommentida). UNCOMMITTED.

## P36 raund (2026-07-27) — F-0727-19: JTBD JUFTLASH-EKRANI — «ISHI» QOLDIQLARI + ORTIQCHA KIRISH-GAP + UZUN IZOH — ✅
**Foydalanuvchi feedbacki:** 10-sahifada (1) «o'z ishi bilan juftlang» — yana «ish» (savol-qatorda «vazifasi» edi, note-qatorida «ishi» qolgan); (2) «3 kartangiz tayyor — endi bilimingizni…» kirish-gapi ortiqcha, UI'ni buzib turibdi; (3) to'g'ri-juftlik izohi juda uzun.
**Qilingan ish:** (a) note qisqardi: «Mahsulot nomini o'z vazifasi ustiga torting yoki nomni bosib tanlang, so'ng kartani bosing.» («3 kartangiz tayyor…» o'chirildi); (b) mentor-reveal izohi 24→14 so'z: «Har mahsulot o'z vazifasiga yollanadi: budilnik — uyg'onish, velosiped — tez yetish, ilova — odat, g'ilof — ajralib turish.»; (c) o'quvchi-yakuni: «Zo'r! Har mahsulot o'z vazifasi bilan juftlandi.» («ishi» qoldig'i ketdi).
**Tekshiruv:** esbuild toza · lint:til ✓ · «ishi» o'quvchi-matnda 0 (faqat kod-komment). UNCOMMITTED.

## P37 raund (2026-07-27) — F-0727-20: JTBD KLINIKA — «TALAB»→«ISTAK», YO'RIQ ANIQLASHDI, YANA 3 «ISH» QOLDIG'I — ✅
**Foydalanuvchi feedbacki:** 11-sahifa UserStory-klinika yechimlariga tortilsin; «talab» so'zi tushunarsiz (global); «bo'lakni bosing, joyiga bosing» yaxshilansin; «karta to'liq bo'ldi» + tuzoq-gap yaxshilansin (yomon emas, sayqal).
**Qilingan ish:** (a) «talab» → «istak» (eyebrow «Foydalanuvchi istagi», sarlavha «Bu istakni to'liq kartaga aylantiring», nav «Istakni kartaga aylantiring»); (b) mentor UserStory-naqshda, dars atamasi bilan: «U faqat mahsulot nomini aytdi — quloqchin unga qanday VAZIFA uchun kerakligi aytilmagan. Pastdagi bo'laklardan to'liq karta yig'ing: avval bo'lakni tanlang, so'ng mos katakni bosing. Diqqat: orasida 2 ta tuzoq bor!»; (c) done-mini: «✅ Karta yig'ildi! — endi unda vazifasi ham, turi ham yozilgan (N ta tuzoqqa tushib ko'rdingiz — endi ularni darrov taniysiz)»; (d) yana 3 «ish» qoldig'i: slot-yorlig'i `label: 'ish'`→'vazifa', 2 tuzoq-izohidagi «O'sha javob — ish» / «Ish esa mahsulot beradigan natija» → vazifa.
**Tekshiruv:** esbuild toza · lint:til ✓ · «talab» o'quvchi-matnda 0 (faqat agent-spec/arena-distraktor). UNCOMMITTED.

## P38 raund (2026-07-27) — F-0727-21: JTBD PRIORITET-DOSKA — LAGANCHA PORTI, PM'SIZ MENTOR, «KEYINGI DARSDA» KETDI — ✅
**Foydalanuvchi feedbacki:** 13-sahifa UserStory yechimidan (F-0727-08) moslab yaxshilansin; «PM» so'zi ishlatilmasin; done-mini'dagi «keyingi darsda …» qismi keraksiz.
**Qilingan ish:** (a) **lagancha porti** (72-qonun): kartalar `.pd-tray`ga o'raldi — «✋ Bu kartalarni pastdagi ustunlarga joylashtiring ↓» + qizil puls + birinchi harakatda calm; CSS UserStory'dan ko'chirildi (P25 dagi fade-up-to'qnashuv saboqli — tray o'z `tray-in` kirishi bilan, fade-up klassisiz); (b) mentor PM'siz va UserStory-ohangda: «Barcha ishni birdaniga qilib bo'lmaydi: bittasini yaxshi bajarish — uchtasini yarim qoldirishdan afzal. Kartani bosib tanlang, so'ng ustunga bosing. Diqqat: "Hozir"ga faqat bitta karta sig'adi!»; (c) done-mini: «✅ Tanlov qilindi! — eng muhimingiz: "X" 🚀» («keyingi darsda» olib tashlandi); (d) yana «ish» qoldiqlari: sarlavha «Qaysi vazifadan boshlashni tanlang», shake-hint «bitta karta sig'adi», MentorNote «qaysi vazifa foydalanuvchiga…».
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P39 raund (2026-07-27) — F-0727-22: JTBD MUSTAHKAMLASH-EKRANI USERSTORY-NAQSHGA O'TDI — ✅
**Foydalanuvchi feedbacki:** 14-sahifada «qaysi vazifaga yollanadi — va nega?» sarlavhasi tushunarsiz («yollanadi» + «va nega»); mentor gapi UserStory misolidan (F-0727-09) olinsin.
**Qilingan ish:** (a) sarlavha challenge-savolga: «MVP'ingiz nima uchun kerakligini *yoddan* ayta olasizmi?»; (b) mentor F-0727-09 naqshida, dars atamalari bilan: «Dars deyarli tugadi. Endi MVP'ingiz haqida ekranga qaramasdan, yoddan ayting: u odamga qanday VAZIFAni bajarib beradi va bu vazifa unga qanday foyda keltiradi? Avval sherigingizga ayting, keyin bir qatorda yozing.»; (c) qolip-gap va placeholder'dagi «… ishi uchun kerak» → «… vazifasi uchun kerak» (2 ta «ish» qoldig'i).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P40 raund (2026-07-27) — F-0727-23: JTBD UY-VAZIFA EKRANI + BUTUN-DARS YAKUNIY SUPURGI — ✅
**Foydalanuvchi feedbacki:** 15-sahifada «MVP ishini kimdan …» tushunarsiz, UserStory yechimi (F-0727-10) qo'llansin; «Kod uyga qolgan bo'lsa» to'liq yaxshilansin; qolgan sahifalarni ham o'zim ko'rib, taqiqlangan/tushunarsiz so'zlarni tozalashim so'raldi — dars UserStory darajasida bo'lsin.
**Qilingan ish (15-sahifa):** (a) sarlavha: «MVP'ingiz haqida *kimdan* so'rab ko'rasiz?»; (b) mentor tugma-nomi bilan: «…pastdagi ro'yxatdan birini tanlang yoki "➕ o'zim yozaman"ni bosing»; (c) qisqa-karta: «Kodni sinfda tugatolmagan bo'lsangiz — avval uyda kodni tugating, keyin bitta karta yozib {kishi}ga o'qib bering»; (d) 2-qadam «har kartada ish natija bo'lsin» → «har kartaning vazifasi natija bo'lsin — mahsulot nomi emas». HW-chiplar («sinfdoshingiz/ota-onangiz/do'stingiz») tekshirildi — bu yerda -ingiz to'g'ri (so'raladigan ODAM, tur-nomi emas; gapga qo'shilganda grammatika buzilmaydi).
**Yakuniy supurgi (butun fayl):** taqiq-ro'yxat bo'yicha grep (hukm/taxmin qil/sir/o'z so'zingiz/kimligini/o'zingiznikini/mohiyat/qorin/och qol/qo'l kel + «ish» atama-shakllari) — 2 qoldiq topilib tuzatildi: RECAP-ask «Starbucks'ning emotsional ishi» → «vazifasi»; summary-ro'yxat «"uchinchi joy" ishini sotadi — joy va muhit» → «Starbucks kofe emas, "uchinchi joy"ni sotadi — makon va muhit». Qolgan barcha uchrashlar faqat kod-kommentlarda.
**Tekshiruv:** esbuild toza · lint:til ✓ · lint:prompt ✓. UNCOMMITTED. JTBD darsi bo'yicha F-0727-12…23 seriyasi yakunlandi — dars UserStory bilan bir tilda.

## P41 raund (2026-07-27) — F-0727-24: METRIKA HOOK — «ERTASIGA OCHISH», «MINGLAB», «CHARCHAGAN» KETDI — ✅
**Foydalanuvchi feedbacki (Metrika darsi boshlandi):** 1-sahifada «ertasiga yana ochishga» iborasi o'quvchiga tushunarsiz; mentor gapidagi «minglab» va «charchagan» so'zlari g'alati tuyuladi.
**Qilingan ish:** (a) sarlavha: «Odamlar Duolingo'ni nega *har kuni* ochaveradi?»; (b) mentor: «Duolingo'dagi odamlar hatto vaqti yo'q kunlarda ham ilovani ochib, kichik dars qilib qo'yadi — sizningcha, ularni nima majbur qiladi? Ovoz bering…»; (c) izchillik-sweep — o'sha ibora-sinf boshqa joylarda ham: ovoz-cap «ertasiga YANA kirgizadigan usul»→«har kuni qaytarib olib keladigan usul», keys-karta va TEST-hikoyasidagi «charchagan kun»→«vaqti yo'q kun» (2 joy).
**Tekshiruv:** esbuild toza · lint:til ✓ · «minglab/charchagan» qoldiq 0. UNCOMMITTED.

## P42 raund (2026-07-27) — F-0727-25: METRIKA 2-SAHIFA — «JONLI BELGI» IZOHI O'CHDI, TAKEAWAY ANIQLASHDI — ✅
**Foydalanuvchi feedbacki:** 2-sahifada (1) «Yashil "● JONLI" belgisi — raqam o'z-o'zidan yangilanib turibdi» izohi tushunarsiz — olib tashlansin; (2) «maqsad qo'yishni o'rganasiz» tushunchasi yaxshilansin.
**Qilingan ish:** (a) izoh-qator butunlay o'chirildi (+`.mdash-cap` CSS) — «● JONLI» pulsning o'zi ko'rsatib turibdi, izoh ortiqcha edi; (b) takeaway: «Bu panel bugun jonlanadi — keyingi darsda shu raqamlar asosida maqsad qo'yishni o'rganasiz» → «Dars oxirida sizning panelingiz ham xuddi shunday jonlanadi.» (UserStory s1 va'da-naqshi; «keyingi darsda…» ibora-sinfi ham ketdi).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P43 raund (2026-07-27) — F-0727-26: METRIKA OSHXONA-EKRANI — TAOM-BOG'LIQ TIL + DIQQAT-ANIMATSIYA — ✅
**Foydalanuvchi feedbacki:** 3-sahifada (1) «taom zo'rmi» — o'ylab qaror qilinsin; (2) mentor «yana oldi» taom bilan yaqqol bog'lansin; (3) raqam-ochilish oddiy tuyuladi — diqqatni chorlaydigan animatsiya kerak; (4) «Haqiqiy baho — ertasiga YANA olganlar» — «olganlar» nimani olgani noaniq.
**Qilingan ish (matn):** «taom zo'rmi» → «taom hammaga yoqdimi» (savol taomga bog'landi — yoqqan taom yana olinadi); mentor «necha kishi o'sha taomni yana oldi?»; cap «taomni YANA OLGANLAR kamayib ketdi»; done-mini «Haqiqiy baho — ertasi kuni taomni YANA olganlar» — endi «olganlar» hamma joyda ob'ekti bilan.
**Qilingan ish (animatsiya):** (a) taphint kuchaytirildi: katak 1.7s siklda ko'tarilib indigo-glow oladi (avval 2.4s siklning 7%ida xira edi), «?» belgisi ham pulsda kattayib-akssent bo'ladi; (b) ochilishda orqa-yuz bir martalik yorqin chaqnash (`oshx-reveal`), qaytish-raqami esa pop bilan sakrab chiqadi (`oshx-pop`) — endi reveal voqea bo'lib tuyuladi; reduced-motion'da hammasi o'chadi.
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik: 5/5 ochilgan holat, yangi matnlar joyida. UNCOMMITTED.

## P44 raund (2026-07-27) — F-0727-27: METRIKA SARALASH-EKRANI — MENTOR ANIQLASHDI + LAGANCHA PORTI — ✅
**Foydalanuvchi feedbacki:** 4-sahifada «to'g'ri tushsa ta'rifi ochiladi» tushunarsiz; UserStory'dagi lagancha-yechim (pastroqda, qizil yonib turadigan, «buni bosish kerak» hissini beradigan) bu yerda ham bo'lsin.
**Qilingan ish:** (a) mentor qadam-ketma-ket: «Pastdagi 4 kartani mos ustunga joylang: kartani bosib tanlang, so'ng ustunni bosing. To'g'ri joylasangiz — o'sha metrikaning izohi ochiladi.»; (b) lagancha porti (72-qonun): kartalar `.pd-tray`da — «✋ Bu 4 kartani pastdagi ustunlarga joylashtiring ↓», qizil puls, tanlov/joylashdan keyin calm, reduced-motion'da statik.
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik: lagancha 4 karta bilan puls-holatda, mentor yangi gapi bilan render. UNCOMMITTED.

## P45 raund (2026-07-27) — F-0727-28: METRIKA TEST-1 SAVOLI ANIQLASHDI — ✅
**Foydalanuvchi feedbacki:** 5-sahifa testida savolni o'qib qanday javob topishni anglab bo'lmaydi — savol ham, so'z ham tushunarsiz; javoblar ham savolga moslashsin.
**Tashxis:** «Qaysi raqam birinchi o'sadi?» — «birinchi o'sadi» mavhum (nimadan birinchi? qachon?); dars esa «metrika = holatni ko'rsatadigan raqam» deb o'rgatgan — savol shu qolipda bo'lishi kerak.
**Qilingan ish:** savol «Bu holatni qaysi metrika ko'rsatadi? Tanlang.» (dars ta'rifiga to'g'ridan bog'langan); hikoya-gap silliqlashdi («kirib turibdi — dushanba ham…»); variantlar o'z izohi bilan qoldi (endi savolga mos: DAU — ko'rsatadi, churn — teskarisi, baho/hajm — umuman metrika emas); izohlar qisqardi (correct 20→13 so'z, wrong-izohlar bir naqshda); jonli-panel yorlig'i «Har kuni kirishni qaysi metrika ko'rsatadi?».
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P46 raund (2026-07-27) — F-0727-29: METRIKA DUOLINGO-KEYSI — SARLAVHA, SLAYD-TILI, BO'SH PANEL BUGI — ✅
**Foydalanuvchi feedbacki (6-sahifa + feedback/5-card.png dalili):** (1) «Duolingo usulini» — «g'oya» yoki yaxshiroq yechim topilsin; «har kuni yana kirgizadi» global tushunarsiz; (2) 1-slayd «ochmay qo'yadi» tushunarsiz; (3) 3-slayd 😰 emoji yoqimsiz; «to'plagan hisobni» emas «to'plagan streak 🔥ni»; «charchagan» so'zi ko'rib chiqilsin; (4) 5-slayddan keyin bo'sh havorang panel ochilib qolgan — yechilsin yoki o'chirilsin.
**Qilingan ish:** (a) sarlavha: «Duolingo'ning yechimi: odamni *har kuni* qaytarib olib keladigan usul» («usul» qoldi — hook-savolga javob ekani ko'rinadi, «qaytarib olib keladigan» P41 iborasi bilan izchil); (b) 1-slayd: «…bir-ikki kundan keyin esidan chiqarib, boshqa kirmaydi»; (c) 3-slayd: 😰→🧲 (magnit — tortib qaytaradi), «Shuncha kun yig'ilgan streak 🔥ni yo'qotishdan qo'rquv…»; «charchagan» allaqachon P41 da «vaqti yo'q kunda»ga almashgan — tasdiqlandi; (d) 5-slayd «har kuni yana kirishi»→«har kuni qaytib kirishi»; (e) **BUG:** yakun-slayddagi hook-payoff `frame-soft` paneli hook-ovoz bo'lmaganda (masalan mentor-rejim) BO'SH ochilardi — endi faqat kontent borida render bo'ladi.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P47 raund (2026-07-27) — F-0727-30: METRIKA TEST-2 — «KO'TARADI» → «OSHIRADI», SAVOL ANIQLASHDI — ✅
**Foydalanuvchi feedbacki:** 7-sahifa test savoli tushunarsiz, «ko'taradi» so'zi xato.
**Qilingan ish:** savol «Streak qaysi metrikani oshiradi? Tanlang.» (TEST-1 bilan bir qolip — «qaysi metrika…»); hikoya «ketma-ket kunlar hisobi» → «streak 🔥 hisobi» (keys-slayd tili bilan mos); izoh qisqardi: «To'g'ri — streak odamni qayta-qayta qaytaradi, demak retention (yana kirganlar ulushi) oshadi.» «Ko'taradi» BARCHA joyda «oshiradi»ga almashdi: recap-title, recap-karta, arena savoli (65-qonun: test darsda aytilgan so'z bilan so'raydi — keys 5-slaydda «oshiradi» deyilgan edi).
**Tekshiruv:** esbuild toza · lint:til ✓ · «ko'taradi» qoldiq 0. UNCOMMITTED.

## P48 raund (2026-07-27) — F-0727-31: METRIKA USTAXONA — VALIDATOR YUMSHADI, UI DEKLATTER, «MAQSAD» KETDI — ✅
**Foydalanuvchi feedbacki:** 8-sahifa yozuvi juda tushunarsiz, UI buzuqroq; «chunki …» kabi qat'iy talablar bo'lmasin (aytsak bo'ladi, qistov emas); «keyingi darsda … maqsad qo'yamiz» ketsin; Yordam aniq bo'lsin, keraksizsiz; UserStory'dan naqsh olib UI+logika zo'r qilinsin.
**Qilingan ish:**
1. **Validator yumshadi:** North Star endi «chunki…» siz ham saqlanadi (o'lchanadigan raqam + 8 belgi yetadi); sabab yozilmagan bo'lsa yumshoq tavsiya-hint: «Xohlasangiz, "chunki …" deb sababini ham qo'shing — shart emas.»
2. **UI deklatter:** muharrirdagi 2 ta takror «● JONLI» lampzone o'chirildi (panelda bor); ixtiyoriy «⭐ Bu raqamni nima o'stiradi?» maydoni o'chirildi (hech qayerda ishlatilmasdi — sof yuk); panel-osti «Keyingi darsda aynan shu raqamlardan maqsad qo'yamiz» qatori o'chirildi (+CSS); summary hw-note «maqsadlar qo'yamiz» → «Muddat — keyingi darsgacha».
3. **UserStory-naqshlar:** mentor panel o'z nomi bilan («har "✓ Saqlash"da yozuvingiz o'ngdagi "Mening panelim"ga ko'chadi»); done-mini qalamcha-yo'rig'i (F-0727-04).
4. **Yordam aniqlashdi:** «⭐ North Star qanday topiladi? O'zingizdan so'rang: foydalanuvchi mahsulotimdan qachon ROSTDAN foyda oladi? O'sha paytni sanaydigan raqam — North Star.» + «3 karta uch savolga javob beradi: nechta odam KELDI? nechtasi QAYTDI? nechtasi FOYDA oldi?»
**Tekshiruv:** esbuild toza · lint:til ✓ · brauzer-ko'rik: NS «chunki»siz saqlanib panelga tushdi (JONLI yondi), muharrir toza 4-maydonli holatda. UNCOMMITTED.

## P49 raund (2026-07-27) — F-0727-32: METRIKA PEER-EKRAN USERSTORY-NAQSHGA TO'LIQ TENGLASHDI — ✅
**Foydalanuvchi feedbacki:** 9-sahifa UserStory yechimlaridek bo'lsin, «hukm» ham ketsin.
**Holat:** tugmalar/mentor-gap/«Adashdi» P28 da tuzalgan edi. Qolgan farqlar yopildi: (a) yakun-holatda mentor «Mana, uchala javobingiz yonma-yon.» (avval yakunda ham boshlang'ich yo'riq qotib turardi); (b) sabab-so'rovi «Nimasini tuzatish kerak?» → «Nimasi noto'g'ri?» (tugma-nomi bilan bir til); (c) «hukm» oxirgi ko'rinadigan joyi SCREEN_INTENTS spec-matni ham yangilandi.
**Tekshiruv:** esbuild toza · lint:til ✓ · «hukm» faqat kod-kommentda. UNCOMMITTED.

## P50 raund (2026-07-27) — F-0727-33: METRIKA JUFTLASH-EKRANI SAVOLI ANIQLASHDI — ✅
**Foydalanuvchi feedbacki:** 10-sahifada «juftlang» so'zi tushunarsiz; ostidagi «Panelingiz tayyor — endi …» kichik yozuvi foydasiz — olib tashlanib, o'rniga savolning o'zi tushunarli qilinsin.
**Qilingan ish:** savol «Har metrika qaysi savolga javob beradi? Nomini o'sha savol ustiga qo'ying.» («juftlang» yo'q — harakat o'z so'zi bilan aytilgan); note faqat mexanika: «Metrika nomini savol ustiga torting yoki nomni bosib tanlang, so'ng savol-kartani bosing.» (JTBD P36 naqshi — kirish-gap olib tashlandi).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P51 raund (2026-07-27) — F-0727-34: METRIKA KLINIKA — «SANALADIGAN» TIL + USERSTORY-NAQSH — ✅
**Foydalanuvchi feedbacki:** 11-sahifa abgor — UserStory'dan o'rganib to'liq yechim: «o'lchanadigan» global tushunarsiz; mentor «bo'lakni bosing yoki joyiga bosing» — bosing-bosing bo'lib ketgan; «orasida tuzoq…» va tuzoq-izohlari («bu baho, raqam emas», «ulushi foizi») sodda bo'lsin; «Endi buni o'lchab bo'ladi» tushunarsiz; juda uzun bo'lmasin.
**Qilingan ish:**
1. **«o'lchanadigan» → «sanaladigan»** (o'quvchi ko'radigan 5 joy: klinika sarlavhasi, ustaxona NS-gap + hint, TEST-1 izohi, SCREEN_INTENTS) — «sanash» o'quvchiga tanish harakat.
2. **Mentor UserStory-naqshda:** «Rahbar faqat o'z fikrini aytdi — bu gapda RAQAM yo'q, uni tekshirib bo'lmaydi. Pastdagi bo'laklardan to'liq gap yig'ing: avval bo'lakni tanlang, so'ng mos katakni bosing. Diqqat: orasida 2 ta tuzoq bor!»
3. **Tuzoq-izohlar sodda:** «"Yaxshi ketyapti" — bu fikr, raqam emas. Sanasa bo'ladigan narsani tanlang.» · «Bu — rahbar gapining takrori, yangilik yo'q. Raqam qanday foydani bildirishini tanlang.» Kuyish-prefiksi ham UserStory'dagidek qisqa: «🪤 Tuzoq edi! …» (avval «ball yo'qolmadi, bu bo'lak endi kerak emas» deb cho'zilardi).
4. **Done-mini:** «✅ Gap raqamli bo'ldi! — endi uni tekshirsa bo'ladi (N ta tuzoqqa tushib ko'rdingiz — endi ularni darrov taniysiz)».
**Qaror:** «tuzoq» atamasining o'zi saqlandi — UserStory/JTBD bilan bir atama (izohlari soddalashdi).
**Tekshiruv:** esbuild toza · lint:til ✓ · «o'lchanadigan» o'quvchi-matnda 0. UNCOMMITTED.

## P52 raund (2026-07-27) — F-0727-35: METRIKA KODING — «KODDA HISOBLATAMIZ» + YULDUZCHA YIG'ILADIGAN BO'LDI — ✅
**Foydalanuvchi feedbacki:** 12-sahifada «kodning o'zi hisoblasin» tushunarsiz — «kodda hisoblatamiz» kabi bo'lsin; «⭐ Yulduzcha» bloki UI'ni buzib turibdi — ochilib-yopiladigan qilinsin.
**Qilingan ish:** (a) sarlavha «Retention foizini endi *kodda* hisoblatamiz.»; mentor «…endi retention foizini qo'lda emas, kod hisoblab beradi»; (b) ⭐ Yulduzcha endi Yordam kabi yig'iladigan (`wsx` naqshi): default yopiq, «⭐ Yulduzcha vazifa — kuchlilar uchun ▸» tugmasi bilan ochiladi; eski doimiy-ochiq `star-task` bloki + CSS o'chirildi.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P53 raund (2026-07-27) — F-0727-36: METRIKA PRIORITET-DOSKA — SARLAVHA, MENTOR, LAGANCHA, YAKUN — ✅
**Foydalanuvchi feedbacki:** 13-sahifada «Birinchi kuzatadigan raqamni tanlang» — «kuzatadigan» tushunarsiz; dizayn UserStory'dan olinsin; mentor gapi ham tekshirilib yaxshilansin («hozir ustuniga bosing, so'ng…» chalkash).
**Qilingan ish:** (a) sarlavha «Qaysi raqamdan *boshlaymiz*?» (UserStory «Qaysi hikoyadan boshlaymiz?» naqshi); (b) mentor sodda va o'gitli: «Barcha raqamga birdaniga qarab bo'lmaydi — har kuni bittasiga qarasangiz, o'sgani yoki tushgani darrov ko'rinadi. Kartani bosib tanlang, so'ng ustunga bosing. Diqqat: "Hozir"ga faqat bitta karta sig'adi!»; (c) lagancha porti (72-qonun) — kartalar `.pd-tray`da, «✋ Bu kartalarni pastdagi ustunlarga joylashtiring ↓», qizil puls + calm (CSS P44 dan mavjud — qayta qo'shilmadi); (d) done-mini «keyingi darsda … boshlaymiz» → «eng muhimingiz: "X" 🚀» (P38 naqshi).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED. Lagancha endi 4 joyda: US-prioritet, JTBD-prioritet, Metrika-saralash, Metrika-prioritet.

## P54 raund (2026-07-27) — F-0727-37: METRIKA MUSTAHKAMLASH-EKRANI USERSTORY-NAQSHGA O'TDI — ✅
**Foydalanuvchi feedbacki:** 14-sahifa UserStory'dagidek bo'lsin (F-0727-09 naqshi).
**Qilingan ish:** sarlavha challenge-savol: «North Star'ingizni *yoddan* ayta olasizmi?»; mentor: «Dars deyarli tugadi. Endi North Star'ingizni ekranga qaramasdan, yoddan aytib bering: qaysi raqamni tanladingiz va u qanday foydani ko'rsatadi? Avval sherigingizga ayting, keyin bir qatorda yozing.»; yozildi-tasdig'i «keyingi darsda shu raqamdan boshlaymiz»siz — «✓ Yozildi!».
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P55 raund (2026-07-27) — F-0727-38: METRIKA UY-VAZIFA EKRANI USERSTORY-NAQSHGA TORTILDI — ✅
**Foydalanuvchi feedbacki:** 15-sahifa so'zlari va dizayni UserStory'dagidek tushunarli bo'lsin; «Yo'lga tayyorgarlik» — «yo'lga» tushunarsiz; global «tekshiradigan raqam» tushunarsiz.
**Qilingan ish:** (a) sarlavha «Uyda qaysi raqamni *birinchi* ochib ko'rasiz?» («tekshiradigan raqam» yo'q); (b) mentor F-0727-10 naqshida tugma-nomi bilan: «…Avval qaysi raqamdan boshlashni tanlang: pastdagi ro'yxatdan birini tanlang yoki "➕ o'zim yozaman"ni bosing.»; (c) «📋 Yo'lga tayyorlik (3 band)» → «📋 Tayyorgarlik — 3 band». Dizayn-tuzilma (chiplar + 2 karta + 3 qadam + checklist) UserStory bilan allaqachon bir naqshda edi — matn-qatlami tenglashtirildi.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P56 raund (2026-07-27) — F-0727-39: METRIKA YAKUN-EKRANI — «SINF YIG'DI» → «BIRGALIKDA O'RGANDIK» — ✅
**Foydalanuvchi feedbacki:** 17-sahifada mentor-variant sarlavhasi «Sinf metrika-panelini yig'di» — «sinf» deganda o'quvchi xayoli sinf-xonaga ketadi, o'zi qilganini eslamaydi; «birgalikda … o'rgandik» shakli bo'lsin. CodeStrike xato/emoji ham UserStory'dagidek bo'lsin.
**Qilingan ish:** (a) proyektor-sarlavha: «Bugun birgalikda *metrika-panel* yig'ishni o'rgandik.» (o'quvchi-variant «Sizning metrika-panelingiz tayyor» o'zgarmadi); (b) CodeStrike arena tekshirildi — «Adashdingiz — 0 ball. Keyingisida olasiz.» (emojisiz) P28 da allaqachon tuzalgan ekan, qoldiq yo'q; mentor-eslatmadagi «Xato joylangan karta» → «Noto'g'ri joylangan karta» (oxirgi qoldiq).
**Tekshiruv:** esbuild toza · lint:til ✓ · «Xato/💪» o'quvchi-matnda 0. UNCOMMITTED.

## P57 raund (2026-07-27) — F-0727-40: USERSTORY 3-EKRAN — XULOSA QISQARDI + AVTO-SCROLL — ✅
**Foydalanuvchi feedbacki:** «Sabab — eng qimmatli qism» xulosasi qisqa tushunarli gapcha bo'lsin (o'chirilmasin); o'stirish-karta («Sizning gapingizdan to'liq hikoya chiqadi») zo'r — qoladi; yakun ochilganda avto-scroll qo'shilsin.
**Qilingan ish:** (a) xulosa-matn 3 gapdan 2 qisqa gapga: «Ilovani ochganingizni hamma ko'radi — nima uchun ochganingizni faqat siz bilasiz. Mahsulot yasovchiga ana shu sabab kerak.»; (b) 4/4 ajratilgach 400ms dan keyin xulosa-kartaga silliq avto-scroll (`scrollIntoView smooth`) — brauzerda tekshirildi (scrollTop 0→408, xulosa+o'stirish-karta bir ekranda).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED (deploydan keyingi birinchi yangi o'zgarish).

## P58 raund (2026-07-27) — KUN-YAKUNI MUHRLASH: F-0727-01…40 TO'LIQ QONUNLASHTIRILDI — ✅
**Topshiriq:** «Bugungi barcha feedbacklarni yig'ib, yechim-ko'rinishi UserStory'dan olinadigan qilib to'liq muhrla — kelgusi darslar shu xatolarsiz qurilsin.»
**Muhrlangan qatlamlar:**
1. **PM_DARS_ETALON — 7 yangi qonun (73–79):** 73 «keyingi darsda» va'da-qatorlari taqiqi · 74 test-qolipi (ta'rif-so'zli savol + grammatik variantlar + to'liq-gap hikoya + qisqa reveal) · 75 mexanika-yo'rig'i («avval … tanlang, so'ng … bosing» + panel o'z nomi bilan) · 76 mustahkamlash-qolipi (challenge-sarlavha + «ekranga qaramasdan, yoddan») · 77 yakun-avto-scroll · 78 proyektor-yakun «birgalikda o'rgandik» · 79 taxmin-o'yin buyruqsiz. (68–72 kun davomida muhrlangan edi.)
2. **MATN_KORPUS — 16–18-bo'limlar:** mexanika-yo'riq juftlari, yakun/va'da juftlari, taxmin-chorlov juftlari (13–15 kun davomida yozilgan).
3. **MATN_ETALONI lug'at +9 qator:** sir/mohiyat · hukm · o'lchanadigan→sanaladigan · kuzatadigan/ko'taradi → ochib ko'radigan/oshiradi · talab→istak · charchagan→vaqti yo'q · o'z so'zingiz→yoddan · kimligini aniqlang→qanday odam ekanini yozing · ochmay qo'yadi→boshqa kirmaydi.
4. **til-lint +7 qoida (jami 53):** keyingi-darsda-vada (warn) · hukm-buyruq · taxmin-qiling · olchanadigan · oz-sozingiz · kimligini-aniqlang · mohiyat. Yangi qoida darhol 1 real qoldiq tutdi (Metrika kbet-sub «bemalol taxmin qiling» → «bemalol belgilang») — regress-isbot.
5. **pm-tekshiruvchi +5 ov-band (8–12):** animatsiya-to'qnashuv (fade-up vs shorthand) · bo'sh shartli-blok · matn-sig'im (max-width kesilish) · 73–79 sweep · lint-qoida regress-sinovi.
6. **Kod-qoldiqlar tozalandi (73-qonun tatbig'i):** US-prioritet done-mini + US/JTBD «✓ Yozildi — keyingi darsda…» → «✓ Yozildi!».
**Tekshiruv:** esbuild 3/3 toza · lint:til 3 dars ✓ TOZA (53 qoida) · lint:prompt ✓. UNCOMMITTED (P57–P58 o'zgarishlari deploydan keyin).

## P59 raund (2026-07-27) — F-0727-41: USERSTORY KODING-SARLAVHA GAP-TARTIBI TUZALDI — ✅
**Foydalanuvchi feedbacki:** 12-sahifa sarlavhasi «Endi hikoyani kartaga kod aylantiradi» tushunarsiz (praktikaga o'tish qismi).
**Tashxis:** gap-tartibi teskari — ega («kod») gap oxirida, o'quvchi «kim nimani qiladi?»ni yig'olmaydi.
**Qilingan ish (foydalanuvchi V1 tanladi):** sarlavha «Hikoyangizni kartaga aylantiradigan *kod* yozamiz.» — harakat oldinda, ega urg'uda; mentor gapi tegilmadi (tushunarli edi).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P60 raund (2026-07-27) — F-0727-42: DEMO-CHIP QO'SHIMCHALARI — EGALIKSIZ MASDAR SHAKLI — ✅
**Foydalanuvchi feedbacki (rasm: feedback/F-0727-42-demo-suffix.png):** UserStory 2-sahifa kartalarida «ulgurishim», «videomni», «ko'ra olishim» — «-im/-m» qo'shimchalari chip yakka ko'ringanida g'alati o'qiladi; abrazets tushunarli bo'lsin.
**Tashxis:** chip-qiymatlar kartada YAKKA holda turadi (formula-gap ichida emas) — birinchi-shaxs qo'shimchasi bog'lamsiz havoda qoladi.
**Qilingan ish:** DEMO_STORIES bo'laklari egaliksiz masdar shakliga: «bir kechada ko'proq mavzuga ulgurish» · «internet yo'q joyda ham ko'ra olish» · «videoni kim ko'rganini bilish» · «kimga mos video yasashni tushunish»; ustaxona placeholder'i ham («internetsiz ham ko'ra olish»). Formulada ham toza o'qiladi («… uchun» ✓).
**Muhrlandi:** 68-qonunga (d)-band — bo'lak-qiymat yakka chipda ham o'qiladi, egaliksiz masdar; korpus 13-bo'lim gaplari yangilandi + yangi ✅/❌ juftlik (rasm-dalil bilan).
**Tekshiruv:** esbuild toza · lint:til ✓ · «-im» qoldiq demo/placeholder'da 0. UNCOMMITTED.

## P61 raund (2026-07-27) — F-0727-43: SPITCH-TAYMER «▶ 1 DAQIQA» PULSLI CTA BO'LDI (3 DARSDA) — ✅
**Foydalanuvchi feedbacki:** 1-daqiqalik gapirish sahifasida o'quvchi «▶ 1 daqiqani boshlash» tugmasini sezmaydi/bosishni his qilmaydi — yonib tursin, UXga kirganda mazza qilsin.
**Qilingan ish:** kulrang mayda `btn-soft` o'rniga yangi `.pair-start` CTA — indigo gradient-fon, oq matn, kattaroq (12px/22px padding), atrofga 1.6s siklda halqa-to'lqin tarqatadi (box-shadow spread→transparent, «meni bos» signali), hover'da ko'tariladi; bosilib bo'lgach «↻ Yana 1 daqiqa» oddiy btn-soft holida qoladi (puls o'chadi — signal ishini bajardi); `prefers-reduced-motion`da pulssiz. UCHALA darsga bir xil kiritildi (US/JTBD/Metrics PairTimer).
**Tekshiruv:** esbuild 3/3 toza · lint:til 3 dars ✓. Brauzer-skrin: 14-sahifagacha avto-yurish uzilgani uchun olinmadi — deploydan keyin jonli ko'rik tavsiya. UNCOMMITTED.

## P62 raund (2026-07-27) — F-0727-44: JTBD USTAXONAGA QADAM-YO'LAKCHA (1→2→3) — ✅
**Foydalanuvchi feedbacki (rasm: feedback/F-0727-44-flow-sketch.png):** 8-sahifada o'quvchi ko'zi qayerdan boshlashni bilmaydi — 1-2-3 oqim ko'rsatilsin, e'tibor tepadan pastga oqsin.
**Qilingan ish:** mentor ostida jonli qadam-yo'lakcha: «1 · Kartani to'ldiring → 2 · ✓ Saqlashni bosing → 3 · "Kartalarim"da ko'ring». Holatga bog'liq: maydonlar to'lmagunча 1-chip indigo PULSDA, uchala maydon to'lgach puls 2-chipga o'tadi (Saqlash), 3/3 saqlangач 3-chip; o'tilgan qadamlar yashil. Mentor-rejimda ko'rinmaydi; reduced-motion'da pulssiz.
**Tekshiruv:** esbuild toza · lint:til ✓ · uslub-render brauzerda tasdiqlandi (in'ektsiya-usul; to'liq yurish-skript test-ekranda tiqilgani uchun holat-almashinuvi kod-ko'rikda tasdiqlandi — ternary oddiy). Hozircha faqat JTBD'da — foydalanuvchi ma'qullasa US-ustaxona va Metrika-ustaxonaga ham tarqatiladi. UNCOMMITTED.

## P63 raund (2026-07-27) — F-0727-45: JTBD USTAXONA — «HALI YOZILMAGAN» QATORLARI GORIZONTAL STRIPGA — ✅
**Foydalanuvchi chizmasi (feedback/F-0727-45-panel-sketch.png):** o'ngdagi 3 ta vertikal «hali yozilmagan» qatori butunlay olib tashlansin, tepada gorizontal ixcham bo'lsin; e'tibor inputga qaratilsin.
**Qilingan ish:** (a) «Kartalarim» panelida bo'sh o'rinlar endi vertikal ro'yxat EMAS — sarlavha ostida ixcham gorizontal strip: 3 doira (yozilgani yashil ✓, navbatdagisi indigo yumshoq pulsda, qolgani kulrang punktir) + «yana N ta qoldi» yozuvi; pastda faqat REAL yozilgan kartalar chiqadi; (b) muharrir e'tibor-markazi bo'ldi — atrofiga doimiy indigo halqa-soya (`0 0 0 2px accent33` + chuqurroq soya); (c) o'lik `.jbook-slot*` CSS o'chirildi.
**Tekshiruv:** esbuild toza · lint:til ✓ · vizual replica-render tasdiqlandi (1/3 holat: ✓ yashil, 2-doira pulsda). Hozircha JTBD'da — ma'qullansa US («Hikoya-daftar») va Metrika («Mening panelim»)ga tarqatiladi. UNCOMMITTED.

## P64 raund (2026-07-27) — F-0727-46: JTBD USTAXONA TO'LIQ VERTIKAL OQIMGA QAYTA QURILDI — ✅ (foydalanuvchi ko'rigi kutilmoqda)
**Foydalanuvchi g'oyasi (rasm: feedback/F-0727-45-panel-sketch.png + og'zaki):** yarim-yarim (chap muharrir / o'ng ro'yxat) layout BEKOR — tepada to'liq enli katta 1-2-3 chiroqlar, ostida to'liq enli input; yozgan kartalari yozish paytida KO'RINMASIN, faqat chiroq yonib borsin (1 yonsin → 2 yonsin → 3 yonsin); «✨ 3-karta — hayotdagi mahsulot» yorlig'i o'chirilsin.
**Qilingan ish:** (a) `split` ikki-ustun BEKOR — vertikal oqim: `.jw-steps` (to'liq enli panel: 3 katta doira + orasida bog'lam-chiziq; yozilgani yashil ✓ + ostida mahsulot nomi, joriysi indigo pulsda, kelgusi kulrang punktir; chiziq yashillanib boradi) → to'liq enli `.jw-ed` muharrir; (b) yozish paytida kartalar RO'YXATI yo'q — faqat chiroqlar; 3/3 bo'lgach done-mini + kartalar to'liq enda ochiladi (✎ tahrir shu yerda; tahrirda muharrir qaytadi, kichik «✎ N-kartani tahrirlash» yorlig'i bilan); (c) «✨ N-karta …» yangi-karta yorlig'i o'chirildi (chiroqning o'zi aytadi); mentor gapi yangi mexanikaga moslandi («tepadagi chiroq yonadi va yangi karta keladi»); (d) o'lik CSS tozalandi (jbook-mini/jbm oilasi, jbook-head).
**Tekshiruv:** esbuild toza · lint:til ✓ · replica-render tasdiqlandi (✓-yashil + nom, 2-pulsda, chiziq yashil). Reload-restore/ball-signal mantiqiga TEGILMAGAN. UNCOMMITTED.

## P65 raund (2026-07-27) — F-0727-47: JTBD USTAXONA — VERTIKAL REYKA-SHELL + TEPADAGI CHIZIQ O'CHDI — ✅
**Foydalanuvchi chizmasi (feedback/F-0727-47-rail-sketch.png):** chiroqlar chap qirg'oqda VERTIKAL (1-2-3), input bilan BITTA katta karta ichida; jonli ko'rikda: gap tepasidagi to'q-indigo chiziq olib tashlansin.
**Qilingan ish:** (a) `.jw-shell` — yagona karta: chapda `.jw-rail` (vertikal chiroqlar: ✓ yashil / joriy indigo-puls / kelgusi punktir, orasida vertikal bog'lam-chiziq yashillanib boradi, title=mahsulot nomi), o'ngda `.jw-main` (muharrir yoki 3/3 da kartalar); muharrir shell ichida o'z karta-bezagini yechadi (`.jw-ed.in-shell`); (b) `.jw-ed::before` 4px gradient-chiziq BUTUNLAY o'chirildi (foydalanuvchi jonli topilmasi); (c) F-0727-46 gorizontal jw-steps CSS/JSX almashtirildi, o'lik qoldiq 0.
**Tekshiruv:** esbuild toza · lint:til ✓ · replica-render: reyka + kontent bitta kartada, holatlar to'g'ri. UNCOMMITTED.

## P66 raund (2026-07-27) — F-0727-48: JTBD KODING-EKRAN DEKLATTER + NUSXALASH-TAQIQ — ✅
**Foydalanuvchi feedbacki (chizma: feedback/F-0727-46-koding-sketch.png + og'zaki):** koding-sahifa UI juda to'lib yotibdi — ixcham qilinsin; preview-kartalar (❌ belgilangan) ketsin; checklist qisqarib kod bilan joy almashsin; kod UMUMAN nusxalanmasin (tugma ham, belgilab Ctrl+C ham) — o'quvchi qo'lda tersin.
**Qilingan ish:**
1. **Preview-strip (jprev) butunlay o'chirildi** — 3 karta + localhost-bar + izoh (CSS oilasi bilan, qoldiq 0). «Brauzerda 3 kartam ko'rindi» qadami bor — preview shart emas edi.
2. **Ustunlar joy almashdi:** checklist (Kompyuterda bajarib belgilang) endi CHAPDA, kod O'NGDA.
3. **Nusxalash-taqiq:** «📋 Nusxalash» tugmasi o'rniga passiv «🔒 qo'lda yoziladi» belgisi; kod-blokda `user-select: none` + onCopy/onCut/onContextMenu bloklangan; mentor: «Kodni VS Code'da o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.» (copy-holat/funksiya kodi o'chirildi).
4. **Tugma-yorliqlar qisqardi:** «Qadamlarni belgilang» → «N/4 qadam»; «✓ Bajarildi — ustozni kuting» → «✓ Bajarildi».
**Tekshiruv:** esbuild toza · lint:til ✓ · jprev/vsc-copy qoldiq 0. Prop-ov (tur-topish) mexanikasi va ball-signal TEGILMAGAN. UNCOMMITTED.

## P67 raund (2026-07-27) — F-0727-49/50: USTAXONA «ADELNA-ADELNA» + RANGLI INPUT-BORDERLAR — ✅
**Feedback (boshliq ko'rigi):** F-0727-47 shell'da reyka+input bitta kartada qorishib ketgan — alohida-alohida ajratilsin; keyin: inputlar o'z ma'nosiga mos rang-borderda bo'lsin.
**Qilingan ish:**
1. **F-0727-49 — ajratildi:** progress endi KARTA EMAS — fonsiz, havoda turuvchi 3 doira-indikator (yashil ✓ + nom / joriy indigo-puls / kelgusi punktir, orasidagi gorizontal chiziq yashillanadi); muharrir esa ekrandagi YAGONA karta (o'z aksent-halqasi bilan). Shell/in-shell CSS to'liq olib tashlandi, qoldiq 0.
2. **F-0727-50 — rangli inputlar (71-qonun semantikasi):** MAHSULOT-input ko'k, VAZIFA-input sariq-amber, TUR yashilligicha; bo'sh holat xira rang-border, fokus to'liq rang (2px), to'lgan holat rang-border + yumshoq rang-fon. Qizil ISHLATILMADI — qizil faqat xato-rang (71-qonun buzilmasin).
**Tekshiruv:** esbuild toza · lint:til ✓ · replica-render: indikator havoda, karta alohida. UNCOMMITTED.

## P68 raund (2026-07-27) — F-0727-51: JTBD KODING — 4-BANDLIK CHECKLIST → BITTA «BAJARDIM» — ✅
**Foydalanuvchi feedbacki:** «VS Code'ni ochdim / u qildim / bu qildim» bandlari kerakmas — o'quvchi bitta «Bajardim»ni bosishi kifoya (maqsad — mentor statistikani ko'rishi).
**Qilingan ish:** KD_STEPS checklist + progress-bar + sanoq BUTUNLAY o'chdi (const, holat, toggle, CSS oilasi — qoldiq 0). Panel endi: bitta yo'riq-qator («Kodni VS Code'da terib, brauzerda 3 kartangizni ko'ring — keyin tasdiqlang») + 💡 Yordam (yig'iladigan) + bitta katta tugma: 🔒 tur-topilmagunча qulf → «✅ Bajardim — kod yozildi, kartalarim ko'rindi» → «✓ Bajarildi». Ball-signal (submitAnswer) va mentor-statistika oqimi o'zgarmagan; tur-topish darvozasi qoldi.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P69 raund (2026-07-27) — F-0727-52: KODING — QULF-TUGMA TESTGA OLIB BORADI + YORDAM-OVERFLOW TUZALDI — ✅
**Foydalanuvchi feedbacki:** «Bajardim» to'g'ridan bosilmasligi (test-darvoza) zo'r, LEKIN ishni qilib bo'lgach testni qidirib qolinadi — fokus berilsin; Yordam ochilganda UI buzilib chala bo'lib qoladi.
**Qilingan ish:**
1. **Fokus-oqim:** tur-topish testi (kdq) topilmagunча yumshoq indigo-pulsda turadi («meni yech» signali); qulf-tugma endi disabled EMAS — bosilsa «🔒 Avval kod-savolini yeching — bosing, ko'rsataman» va bosishda sahifa testga silliq scroll qilib, testni 2 marta kuchli chaqnatadi (kdq-flash). Test yechilgach puls o'chadi, tugma «✅ Bajardim…»ga aylanadi.
2. **Yordam-buzilish:** sabab — ichidagi uzun kod-satr (`jobs.map(j => <JtbdCard ... />)`) panelni yorib yuborayotgan edi; `.wsx-body p`ga `overflow-wrap:anywhere` + `.mono`ga `white-space:normal` — endi o'raladi.
**Tekshiruv:** esbuild toza · lint:til ✓ · reduced-motion'da puls/chaqnash o'chirilgan. UNCOMMITTED.

## P70 raund (2026-07-27) — F-0727-53: KODING — SINF-PULS O'QUVCHIDAN OLINDI, CHAQNASH SEZILARLI BO'LDI — ✅
**Foydalanuvchi feedbacki:** (1) «👥 Sinfda: 1 bajardi · ✏️ 2 hali bajarmoqda» koding-sahifada o'quvchiga ko'rinishi kerakmas; (2) «Avval kod-savolini yeching — bosing, ko'rsataman» bosilganda hech qanday o'zgarish sezilmadi.
**Qilingan ish:** (a) jkd-paneldagi `StudentPracticePulse` olib tashlandi (mentor-statistika MentorPracticeStats'da qoladi — mentor baribir ko'radi); (b) chaqnash endi ko'rmaslik ILOJI YO'Q: test-blok 3 marta gorizontal SILKINADI + yorqin ring (0.6s×3), hunt-puls bazasi ham kuchaytirildi (0.30→0.45, 8→10px). Eslatma: 45-qonun (sinf-puls) amaliyot-ekranlariga tegishli — koding-ekranda o'quvchi uchun istisno qilindi, foydalanuvchi qarori.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P71 raund (2026-07-27) — F-0727-54: YORDAM-POPOVER ILDIZ-BUGI — CHAPGA-QALQISH O'CHDI — ✅
**Foydalanuvchi rasmi (feedback/F-0727-54-yordam-popover.png):** koding-sahifada oq karta mentor ustiga chiqib turibdi.
**Ildiz-sabab:** `.jkd-panel .wsx.open .wsx-body`da eski POPOVER qoidasi (`position:absolute; right:calc(100%+14px)`) — panel O'NG ustunda turgan davrda yordam chapdagi bo'shliqqa qalqib chiqardi. F-0727-48 da panel CHAPGA ko'chgach popover ekrandan tashqariga/mentor ustiga uchadigan bo'lgan (F-0727-52 dagi «Yordam buzilib chala» ham shu ildiz — overflow-wrap simptom-yamoq edi).
**Yechim:** popover-qoidalar o'chirildi — Yordam endi oddiy akkordeon: panel ichida, o'z chegarasida ochiladi (ko'k border urg'usi qoldi). Replica-render: body panel ichida, mono-kod o'ralgan, mentor toza.
**Saboq (72-oilaga):** ustun joyi almashganda unga BOG'LANGAN absolute-popoverlar ham ko'rikdan o'tishi shart — pm-tekshiruvchi 8-bandiga qo'shimcha sinf.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P72 raund (2026-07-27) — F-0727-55: KODING-SARLAVHALAR BIR OILAGA KELDI («…digan KOD yozamiz») — ✅
**Foydalanuvchi feedbacki:** JTBD «3 kartangizni React komponenti qiling» global tushunarsiz; Metrika ham UserStory'dagidek (F-0727-41 naqshi) qilinsin.
**Qilingan ish:** uchala dars endi bitta sarlavha-qolipida: US «Hikoyangizni kartaga aylantiradigan *kod* yozamiz.» · JTBD «3 kartangizni ekranga chiqaradigan *kod* yozamiz.» (React-atama sarlavhadan ketdi — u eyebrow «Koding · ⚛️ React»da qoladi) · Metrika «Retention foizini hisoblab beradigan *kod* yozamiz.»
**Tekshiruv:** esbuild 2/2 toza · lint:til ✓. UNCOMMITTED.

## P73 raund (2026-07-27) — F-0727-56: METRIKA — «ULUSH» BUTUNLAY «FOIZ»GA, NORTH STAR 57 ANIQLASHDI — ✅
**Foydalanuvchi feedbacki:** 2-sahifada Retention ta'rifi tushunarsiz — «yana kelganlar ulushi» nima degani? «qayta kirganlar foizi» to'g'ri; «3+ qaytganlar» va yalang'och «57» chalkash (odammi, foizmi? nega o'rtadagi kartada % oxirgisida son?); «ulush» so'zi testlarda ham bor — barchasi tuzatilsin.
**Qilingan ish (13 almashinuv):** «ulush» barcha o'quvchi-matnlardan chiqarildi: demo-karta «qayta kirganlar foizi», METRIC_DEFS (ret short+def «necha foizi keyin YANA kiradi — yuzta odamdan nechtasi qaytgani», churn «butunlay ketganlar foizi»), recap-karta, ustaxona placeholder + NS-hint («… foizi»), demo-fallback kartalar (2 joy), TEST-1/2 variantlari va izohi, arena Churn-savoli (2 variant). North Star demo-karta: «haftasiga 3 martadan ko'p kirganlar soni» + qiymat birligi bilan «57 ta» (% bilan adashmaydi). Validator so'z-ro'yxatidagi «ulush» qoldi (o'quvchi o'zi yozsa qabul qilinadi — cheklov emas).
**Muhrlandi:** lug'at: «ulush (metrika ta'rifida) → foiz» + sanoq birligi qoidasi.
**Tekshiruv:** esbuild toza (1 sintaksis-xato yo'lda tuzatildi) · lint:til ✓ · «ulush» o'quvchi-matnda 0 (JTBD/US da ham 0). UNCOMMITTED.

## P74 raund (2026-07-27) — F-0727-57: METRIKA — «YANA KIRISH» → «QAYTA KIRISH» (GLOBAL) — ✅
**Foydalanuvchi feedbacki:** 6-sahifa 5-kartada «yana kirish emas, qayta kirish».
**Qilingan ish:** kirish-kontekstidagi barcha «yana kir…» → «qayta kir…» (8 joy): K5 xulosa «retention'ni (qayta kirishni) oshiradi», recap-karta, metrika-ta'rif («necha foizi keyin QAYTA kiradi»), NS placeholder, peer-karta o'lchovi, klinika-chipi, arena-varianti, hook-intent. Oshxona «taomni YANA olganlar» ataylab qoldi — u boshqa kontekst (taom), «yana olish» tabiiy.
**Tekshiruv:** esbuild toza · lint:til ✓ · «yana kir» qoldiq 0. UNCOMMITTED.

## P75 raund (2026-07-27) — F-0727-58: JTBD-NAQSHLAR US VA METRIKAGA TO'LIQ TARQATILDI (PARITY-SWEEP) — ✅
**Foydalanuvchi topshirig'i:** Metrika 8-sahifadagi uzun placeholder-musor ketsin; UserStory/JTBD'da qilingan barcha yechimlar 3 dars bo'ylab to'liq qilinganini tekshirib, qolganini qilish.
**Qilingan ish:**
1. **US-ustaxona (F-0727-49/50 porti):** split-layout bekor — havodagi 1-2-3 indikator (yashil ✓+KIM nomi / joriy puls / kelgusi punktir) + yagona muharrir-karta; yozish paytida daftar ko'rinmaydi, 3/3 da yulduzli daftar to'liq enda ochiladi; «✨ N-hikoya» yorlig'i o'chdi; KIM/NIMA/NATIJA inputlari o'z rangida (ko'k/sariq/yashil); o'lik svd-slot/svd-head CSS tozalandi.
2. **Metrika-ustaxona (port):** ⭐-1-2-3 to'rt-qadamli indikator (NS birinchi doira); yagona muharrir; «Mening panelim» 4/4 da to'liq enda; «✨ N-karta — yangi raqam» yorlig'i o'chdi; NOMI/NIMANI/NEGA inputlari rangli; **NS placeholder qisqardi**: «masalan: haftasiga 3 marta qayta kirganlar soni» (eski 2-qatorli musor o'rniga); mw-steps mini-dots/mw-done/mboard-slot o'lik kodi tozalandi.
3. **Metrika-koding (F-0727-48/51/52 porti):** MK_STEPS checklist o'chdi — darvoza endi 🧮 JONLI SINOV (retention-hisob: real raqam kiritilsa foiz chiqadi) — bitta «✅ Bajardim — kod yozildi, foiz chiqdi»; qulf-holatda tugma jonli sinovga scroll+silkinish-chaqnash bilan olib boradi; «📋 Nusxalash» o'chdi → «🔒 qo'lda yoziladi» + user-select none + onCopy/Cut/ContextMenu bloklangan; mentor «o'zingiz terib yozasiz»; ustunlar joy almashdi (panel chap, kod o'ng).
**Tekshiruv:** esbuild 3/3 toza · lint:til 3 dars ✓ · o'lik-kod qoldiqlari 0 (MK_STEPS/kd-step/copied/mwSteps/svd-slot). Ball-signal/reload-restore mantiqlariga TEGILMAGAN. UNCOMMITTED. Jonli qo'lda-ko'rik tavsiya (uch darsning 8- va 12-sahifalari).

## P76 raund (2026-07-27) — F-0727-59: US 3-EKRAN KO'PRIK-GAPI + KLINIKA 5→4 CHIP — ✅
**Foydalanuvchi feedbacki:** (1) 3-sahifada «Keyingi ekranda mana shu 3 bo'lakni o'zingiz joylaysiz» — «joylaysiz» tushunarsiz; (2) 11-sahifada 5 chipdan 4-si pastga tushib ketgan — desktopda bitta qatorda tursin, 4 ta bo'lsin.
**Qilingan ish:** (a) ko'prik-gap (foydalanuvchi tanladi): «Keyingi ekranda mana shu 3 bo'lakdan **hikoyani o'zingiz yig'asiz**» — 4-ekran sarlavhasi («Hikoyani 3 bo'lakdan o'zingiz tuza olasizmi?») bilan bir tilda; (b) klinika 5→4 chip: KIM-tuzog'i («hamma foydalanuvchi») olib tashlandi, **NATIJA-tuzog'i qoldi** — sabab: shunda tanlov ekranning CHO'QQISIDA (3-slot) bo'ladi, o'quvchi avval ikki qadamni bemalol bosib keladi; ikkala tuzoq ham bitta xato-sinf (mavhumlik) edi, dars-qamrov yo'qolmadi. Bog'liq matnlar tuzatildi: mentor «1 ta tuzoq», done-mini, yakun-ro'yxat sarlavhasi («Bu bo'lak tuzoq edi»), MentorNote, SCREEN_INTENTS.
**Tekshiruv:** esbuild toza · lint:til ✓ · dasturiy o'lchov (1280px): 4 chip — ROWS=1, pool balandligi 43px (bitta qator). UNCOMMITTED.
**⚠️ Eslatma:** JTBD (FIX_POOL) va Metrika (MFIX_POOL) klinikalarida ham 5 chip — foydalanuvchi qaroriga qo'yildi (o'sha ekranlarda ham 4 ga tushiriladimi).

## P77 raund (2026-07-27) — F-0727-60: US 12- VA 15-SAHIFA DEKLATTER — ✅
**Foydalanuvchi feedbacki:** 12-sahifada «📒 Bular — daftardan olingan o'z hikoyalaringiz» qatori musor; o'sha sahifadagi mentor-eslatma ham kerakmas; 15-sahifadagi eslatma ham.
**Qilingan ish:** (a) `kdx-out-note` qatori + CSS o'chirildi (preview-kartalarning o'zi ko'rinib turibdi); (b) koding-sahifa MentorNote o'chirildi; (c) uy-vazifa (15) MentorNote o'chirildi. Qolgan MentorNote'lar (hook, ustaxona, peer, klinika, prioritet) — 5 ta, ular real mentor-yo'riqnomasi (o'quvchida ko'rinmaydi, faqat mentor-rejimda) va foydalanuvchi ular haqida shikoyat qilmagan.
**Tekshiruv:** esbuild toza · lint:til ✓ · o'lik CSS 0. UNCOMMITTED.

## P78 raund (2026-07-27) — F-0727-61: METRIKA USTAXONA — NAMUNA-PANEL + PULSLI BO'SH MAYDONLAR — ✅
**Foydalanuvchi feedbacki (8-sahifa):** «Mening North Star'im — sanaladigan raqam, chunki…» statik gapi olib tashlansin; input-border bosilmaguncha yonib tursin; placeholder'dagi misollar Yordam o'rniga «Namuna» bo'lib ko'chsin va HAR BOSQICHDA o'zgarsin; mentor-eslatma keraksiz.
**Qilingan ish:** (a) NS muharriridagi statik `mw-sent` qatori o'chdi (karta-muharriridagi jonli preview qoldi — u yozilgani sari to'ladi); (b) **bo'sh maydon pulsda**: har input bo'sh va fokusda emas ekan, o'z rangida (ko'k/sariq/yashil) yumshoq border-puls + tashqi halqa (0.25s stagger bilan); yozila boshlashi/fokus bilan darhol to'xtaydi; NS-textarea ham (accent rangida); reduced-motion'da o'chiq; (c) **📋 Namuna paneli** (Yordam o'rnida): yopiqda bitta ingichka qator, sarlavhasi bosqichga qarab o'zgaradi («⭐ North Star namunasi» / «1-karta namunasi» / …), ichida maydon→qiymat juftliklari; placeholder'lar generikga o'tdi («qisqa nom», «nimani sanaydi?», «qanday foydani bildiradi?») — misol endi faqat Namunada; (d) ustaxona MentorNote o'chirildi.
**Tekshiruv:** esbuild toza · lint:til ✓ · replica-render: pulsli rangli maydonlar + Namuna paneli. UNCOMMITTED.

## P79 raund (2026-07-27) — F-0727-62: METRIKA 11-SAHIFA (KLINIKA) ESLATMASI O'CHDI — ✅
**Foydalanuvchi feedbacki:** 11-sahifada eslatma keraksiz.
**Qilingan ish:** Metrika klinika-ekranidagi MentorNote o'chirildi (tuzoq-izohlari o'quvchi-matnida allaqachon bor — takror edi).
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P80 raund (2026-07-27) — F-0727-63: 🔴 CALCW KO'RINMASLIK BUGI (fade-up to'qnashuvi) + METRIKA PREVIEW O'CHDI — ✅
**Foydalanuvchi rasmi (feedback/F-0727-63-calcw-invisible.png):** 12-sahifadagi preview-panel (localhost:5173 mock — 25% Retention + 3 karta) kerakmas; «tugmani bosaman, test ochilmayapti».
**🔴 ILDIZ-SABAB (o'zim kiritgan regressiya, F-0727-08 xato-sinfining TAKRORI):** P75 portida `calcw`ga `fade-up delay-2` klassi bilan BIRGA `hunt` animatsiyasi berilgan edi. `.fade-up { opacity: 0; animation: fade-in-up … forwards }` — `.calcw.hunt`ning `animation:` e'loni uni BOSIB ketgan → element abadiy `opacity: 0` da qolgan, ya'ni jonli sinov bloki UMUMAN KO'RINMAGAN. Shu sabab qulf-tugma bosilganda «hech narsa ochilmagan» (scroll ko'rinmas elementga ketgan).
**Yechim:** `fade-up delay-2` klassi olib tashlandi; hunt/flash keyframe'lariga kartaning O'Z soyasi qo'shildi (animatsiya paytida soya yo'qolmasin). Dasturiy tasdiq: `opacity: 1`, balandlik 152px, `visible: true`.
**Qo'shimcha:** `mxprev` preview-paneli (JSX + 21 qatorlik CSS oilasi) butunlay o'chirildi — JTBD'dagi jprev bilan bir qatorda (F-0727-48).
**Saboq:** 72-oila bandiga yozilgan «fade-up ↔ animation shorthand» tekshiruvi PORT paytida ham yuritilishi shart — men uni JTBD→Metrika ko'chirishda o'tkazib yuborganman. pm-tekshiruvchi 8-bandi allaqachon qamraydi.
**Tekshiruv:** esbuild toza · lint:til ✓ · mxprev qoldiq 0 · 3 darsda boshqa fade-up+animation to'qnashuvi grep bilan qidirildi — yo'q. UNCOMMITTED.

## P81 raund (2026-07-27) — F-0727-64: METRIKA KODING — SINF-PULS O'QUVCHIDAN OLINDI — ✅
**Foydalanuvchi feedbacki:** 12-sahifada «👥 Sinfda: 0 bajardi · ✏️ 1 hali bajarmoqda» o'quvchiga ko'rinmasligi kerak.
**Qilingan ish:** Metrika koding-ekranidan `StudentPracticePulse` olib tashlandi — JTBD'da bu F-0727-53 da qilingan edi, port paytida Metrikada qolib ketgan (parity-qoldiq). Mentor statistikasi `MentorPracticeStats` («⚛️ Panelni kodlaganlar»)da qoladi.
**Tekshiruv:** esbuild toza · lint:til ✓. UNCOMMITTED.

## P82 raund (2026-07-27) — KECHKI TO'LQIN MUHRLASH: F-0727-40…64 TO'LIQ QONUNLASHTIRILDI — ✅
**Topshiriq:** kunning ikkinchi yarmi (25 feedback: so'z+dizayn+UI-musor+ko'rinmas-bug'lar) to'liq tahlil qilinib, mexanizm bo'yicha MDlarga muhrlansin — yangi dars shularning barchasiga rioya qilsin.
**Tahlil-xulosa:** 25 feedback 6 katta sinfga yig'ildi: (1) ustaxona-qolip evolyutsiyasi (4 iteratsiya→yakuniy: havodagi indikator+yagona karta), (2) koding-qolip (nusxa-taqiq, halol-signal), (3) diqqat-boshqaruv (qulf-yo'l, pulslar), (4) namuna-joylashuvi, (5) ekran-musor, (6) 2 ta ko'rinmas-bug (popover, fade-up) — ikkalasi ham «layout o'zgarganda eski absolute/animation qoidalarning yashirin to'qnashuvi» ildizidan.
**Muhrlandi:**
1. **PM_DARS_ETALON 80–86** (7 yangi qonun — yuqorida to'liq).
2. **MATN_KORPUS §19** — koding-ekran tili juftliklari (sarlavha-oila, nusxa-taqiq gapi, halol-tugma).
3. **Lug'at +2:** yana kirish→qayta kirish · joylaysiz→hikoyani yig'asiz.
4. **til-lint 53→55:** `nusxalash-tugma` (error) + `yana-kirish` (warn) — band-12 bo'yicha regress-sinovdan o'tkazildi (ikkalasi USHLADI ✓), 3 dars TOZA.
5. **pm-tekshiruvchi band-13:** port-sweep (naqsh ko'chirilganda 8-12 bandlar + 80-86 sweep qayta yuritiladi).
6. **Xotira yangilandi** (pm-etalon-yaxshilash).
**Kun-yakuni statistikasi:** jami 64 feedback (F-0727-01…64), 82 raund, qonun 68–86 (19 yangi), korpus 13–19-bo'limlar, lug'at +12 qator, lint 44→55 qoida, tekshiruvchi +6 ov-band. UNCOMMITTED (P76–P82).
