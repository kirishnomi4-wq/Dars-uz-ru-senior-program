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

## P83 raund (2026-07-28) — M1 v2-DARSLAR OLIB TASHLANDI: PmAudience/PmStructure/PmPitch → PmLesson1/2/3 — ✅
**Foydalanuvchi buyrug'i:** uchala v2 dars (PmStructureLesson, PmPitchLesson, PmAudienceLesson) o'chirilsin; o'rniga keyinroq PmLesson1/2/3 yaxshilab optimalga keltiriladi.
**Qilingan ish:** `src/1-Modull/`dan uchala .jsx o'chirildi. Slotlar qaytarildi: App.jsx (m1-02→PmLesson1, m1-05→PmLesson2, m1-12→PmLesson3), M1DemoApp.jsx (xuddi shu), SolishtirApp.jsx (2-juftlik PmLesson2↔PmStructure olib tashlandi, faqat 1-juftlik qoldi). PmStructure uchun qurilgan scratch-skrinshot rigi (_m.html/_m.jsx/_shot.mjs/_s3.png/_t1.png) ham o'chirildi.
**Tekshiruv:** esbuild (App/M1Demo/Solishtir) toza · vite build toza · residue-grep — src'da faqat tarix-izohlar qoldi.
**Keyingi ish:** PmLesson1/2/3 ni PM_DARS_ETALON (qonun 1–86) + MATN_KORPUS bo'yicha optimallash (retsept C). UNCOMMITTED.

## PmLesson2 MATN-KO'RIK + MENTOR-BADGES QONUNI (2026-07-29) — ✅
**Retsept B, foydalanuvchi bilan jonli ko'rik (F-0729-01…06):**
- **F-0729-01** s6 Mentor: «ishsiz bo'lim» → «ishlamaydigan bo'lim».
- **F-0729-02** s9 Mentor: «juftlik yashil belgilanadi» → «juftlik yashil rangga o'zgaradi».
- **F-0729-03** s11 sinov-simulyator: «sinov mijozi»/«mijoz» → «foydalanuvchi» (sarlavha, mentor, yorliq, natija-xabarlar); tugma-holatlar: «Sahifani sinab ko'rish» / «Foydalanuvchi sahifani ko'rmoqda…» / «↻ Yana(Qayta) sinab ko'rish». 674-qator konversiya-izohidagi «mijoz» ATAYLAB qoldi (haqiqiy xaridor ma'nosi).
- **F-0729-04** markaziy formula «foydalanuvchi uchun qilingan qaror» → «qulaylik» — 9 joyda (dars-sarlavha uz/ru, nazariya-karta, flashcard, quiz-izoh, s13 mentor+lavha, RECAP, test-javob; correct-index o'zgarmadi).
- **F-0729-05** flashcard-deck qayta qurildi: 8→7 karta, «Konversiya» olib tashlandi, «ta'rif→atama» qolipi o'rniga to'g'ridan-to'g'ri savollar; 2-iteratsiyada «tanish qiyinchilik» chiqarildi, «nima vazifani bajaradi?» qolipi, «qayerda?»ga joy-javob.
- **F-0729-06** mentor rejimida badges TO'LIQ o'chirildi — AchCelebrate to'liq-ekran bayram ham (`{live.mode !== 'mentor' && <AchToasts/>}`). **Muhrlandi:** PM_DARS_ETALON 1-D jadval (AchCelebrate: BOR→YO'Q) + DARS_ETALON 10.1 (uchala qatlam o'chadi) va 10-B jadval. **Platforma-sweep:** barcha 79 dars .jsx fayliga bir xil qorovul qo'yildi (skript, PmLesson2 double-wrap qo'lda tuzatildi), 79/79 esbuild toza.
**Tekshiruv:** har qadamda esbuild + lint:til (55 qoida) 0 topilma. UNCOMMITTED.

## UserStory MATN-AUDIT (22 topilma) + YAKUN-SAHIFA QAYTA YOZILDI + DEPLOY (2026-07-29) — ✅
**F-0729-08 — to'liq matn-audit (foydalanuvchi: «hech narsa tahrirlamasdan hisobot»), so'ng «barchasini yaxshila» tasdig'i bilan 22 tuzatish:**
🔴 jiddiy: «gap o'z-o'zidan o'qiladi»→«to'liq gap hosil bo'ladi» · «Bonus:»→«Yana bir kamchilik:» · «mavhum» 3 joyda →«aniq emas» · «milkshake uslubi»→«milkshake keysi» (sarlavha «Biznesdagi mashhur voqea») · ustaxona «chiroq yonadi»→«qadam-belgisi ✓» · koding namuna-natija «meni tez tanish»→«meni tez tanib olishlari» (starter+harness) · PairTimer «aytdingizmi? Barakalla!» mantiqsizligi tuzatildi · «Muddat: keyingi darsgacha» 2 joydan olib tashlandi (PmLesson2 F-0729-07 bilan izchil) · «komponent tanlaymiz»→«qaysi birini birinchi qurishni tanlaymiz» · RECAP qo'sh-fikrli band ikkiga bo'lindi.
🟡/⚪: sinf-savol gap-tuzilishi · «To'g'risi masalan»→«To'g'ri varianti, masalan» · «Nimasi?»→«Kamchiligi nimada?» · peer-jadval «•»→«💡»+title · recap «NIMA'dan boshqa gapmi»→«takrorlamayaptimi» · «shoshmasa bo'ladi»→«shoshilinch emas» · eyebrow «shartnoma»→«topshiriq» · «sayqallang»→«yaxshilang» · s1 mentor ravonlashtirildi · «Bugun dars oxirida»→«Dars oxirida» · PairTimer'ga yakka-rejim izohi · arena «qayta ishlash»→«qayta yechish» (2 joy).
**F-0729-09 — yakun-sahifa PmLesson2 (F-0729-07) mantiqida qayta yozildi:** RECAP 5 band (feature-request bandi olib tashlandi, takror-band ixchamlashdi); Uyga vazifa: «Bugun o'rganganingizni sinab ko'ring:» + 3 band (sevimli ilova-tahlil · hwTarget-shaxslashgan tur-tavsifi · **LMS'dagi topshiriq** — 2 to'liq hikoya); muddat-qatori yo'q.
**Tekshiruv/deploy:** esbuild + lint:til (55) toza · etalon-bundle qayta build · https://coddycamp-etalon-test.vercel.app ga prod-deploy (yangi chunk jonli tekshirildi). UNCOMMITTED.

## UserStory kechki to'lqin: F-0729-10…13 (2026-07-29) — ✅
- **F-0729-10** s3 (harakat/sabab) «Sizning gapingizdan to'liq hikoya chiqadi» kartasiga ⛶ kattalashtirish (PracticeLesson4 `Zoomable` porti: butun-ekran, ✕/fon/Escape yopadi; `.zoom-*` CSS ko'chirildi).
- **F-0729-11** Yakun: «Endi siz bilasiz» 4 sodda bandga qayta yozildi (qavs-formula va «·» tiqilmalar chiqdi); uyga vazifadan «Keyingi darsda … tanlaymiz! 🚀» qatori + o'lik `.hw-note` CSS o'chirildi.
- **F-0729-12** Ustaxona (8-sahifa) input-soyalari qisqartirildi: «foydalanuvchi turi» · «harakat» · «real foyda» (uzun «masalan:…» qismlari UI'ni bulg'ayotgan edi).
- **F-0729-13** Soya-joylarda «real foyda»→«natija» (placeholder + SLOT_META hint). Ta'rif-joylar (RECAP/test/quiz «NATIJA — real foyda») ATAYLAB qoldi — «NATIJA — natija» tavtologiya bo'lardi.
Har qadamda esbuild + lint:til toza; har tuzatishdan keyin coddycamp-etalon-test.vercel.app ga prod-deploy. UNCOMMITTED.

## Kechki mayda-to'lqin: F-0729-14…18 (2026-07-29) — ✅
- **F-0729-14** UserStory s0 mentor aniq yo'naltiradi («1-mijoz»/«2-mijoz» tugmalarini nomlab); puls ikkala qatlamda avvaldan bor edi (chip-yurish + variant-to'lqin) — tegilmadi.
- **F-0729-15** PmLesson2 flashcard-sahifasidan Mentor bloki (avatar+gap) butunlay olib tashlandi; layout flex-gap hisobiga buzilmadi.
- **F-0729-16** PmLesson2 13-sahifa sarlavhasi: «darrov ishongingiz keladi» → «Nega ba'zi saytlar bir qarashda ishonch uyg'otadi?» (foydalanuvchi tanlovi).
- **F-0729-17** «LMS'dagi topshiriq — … yuklanadi …» bandi ikkala darsda «Amaliy vazifa — …» qolipiga o'tdi; bir necha iteratsiyadan keyin yakuniy fe'l: «bajaring» (PmLesson2), UserStory'da «yozing».
- **F-0729-18** PmLesson2 RECAP 4-band evolyutsiyasi: «foydalanuvchi ishongandan keyin» → «avval sabab, keyin tugma» → izohsiz → yakuniy: «Sahifani kodda to'g'ri bo'limlar bilan qura olasiz» (koding-yutuqqa ishora).
Har qadamda esbuild + lint:til toza, har tuzatish coddycamp-etalon-test.vercel.app ga deploy qilindi. UNCOMMITTED.

## YAKUN-SAHIFA REDIZAYN: «UYGA VAZIFA» NEON-KAPSULA (2026-07-29, F-0729-20…22) — ✅
**PmLesson2 (rasm-brif bo'yicha, bir necha iteratsiya):** vazifa-ro'yxat butunlay olib tashlandi; «Endi siz bilasiz» to'liq kenglikda; ostida BITTA katta «Uyga vazifa / Amaliy topshiriqni boshlash →» kapsula-tugma. Dizayn-evolyutsiya: indigo→amber→yashil→to'q siyoh→teal jonli solishtirildi; YAKUNIY: **CODE STRIKE bilan bir xil fon** (qorong'i-binafsha radial + neon-hoshiya + inset-nur) + tashqi aura + suzuvchi dars-tokenlari (hero/muammo/yechim/…) + shine + bosilganda zaryad-effekt. Bug tuzatildi: fade-up klassi hw-fire bilan to'qnashib tugma abadiy shaffof qolgan edi (animatsiyalar zanjirga birlashtirildi, keyin wrapperga ko'chdi). Tugma hozircha LMS-izoh chiqaradi — kompilyator-ulanish keyin kelishiladi. Yozuv rangi: foydalanuvchi keyin aytadi.
**UserStory'ga port:** xuddi shu kapsula (tokenlari o'ziniki: KIM/NIMA/NATIJA/story/JTBD/sifatida/uchun), izoh hwTarget bilan shaxslashadi; eski 3-bandli vazifa-kartasi va o'lik .hw CSS olib tashlandi. Yakun-vazifa bandlari ham tekislangan edi (F-0729-19).
esbuild + lint toza, deploy jonli. UNCOMMITTED.

## UserStory s2 (3-sahifa) — «SINFGA SAVOL» EKRANDAN KETDI (2026-07-29, F-0729-23) — ✅
**Tashxis:** ekran birdan «Sinfga savol» quti bilan boshlanardi — majburiy-imtihon ohangi, sarlavha yo'q edi.
**Yechim (foydalanuvchi tasdig'i bilan, bir necha matn-iteratsiya):** sarlavha «Hikoya nimadan yasaladi?»; mentor (emojisiz, yakuniy): «Hikoya uch bo'lakdan yasaladi: KIM, harakat va sabab. Avval harakat bilan sababni ajratishni o'rganamiz — pastdagi gaplarni belgilab ko'ring. Barchasini to'g'ri belgilagach, to'liq hikoya quramiz.» (butun rasm → aniq vazifa → hikoyaga ishora; KIM'ni «yedirish» = induktiv). Og'zaki sinf-muhokama MentorNote'ga ko'chdi (proyektor-sirlik saqlanadi); o'lik .proj-q CSS o'chirildi.
esbuild + lint toza, deploy jonli. UNCOMMITTED.

## 2026-07-30 — F-0730-01: SAHIFA-HOLAT SAQLOVI (barcha PM darslar ham qamrovda) — ✅
Reload'da 1-ekranga tushib qolish muammosi butun katalog bo'ylab yopildi (jami 111 dars, shu jumladan barcha PM darslar: PmLesson1–34, PmUserStory/PmJtbd/PmMetrics etalonlari). localStorage `ccProgress:<lessonId>` — screen+answers(+earned) TTL 6 soat bilan saqlanadi; reset/finishLesson tozalaydi; jonli-o'quvchi mentor-darvozadan oshmaydi (clamp). Sof-PM darslarda (live/earned yo'q) soddalashtirilgan variant. Tafsilot: PIPELINE_STATE.md shu sanadagi yozuv. UNCOMMITTED.

## 2026-07-30 — F-0730-02: PmLesson2 mentor-gapida «savdo sayti» → «internet-magazin» — ✅
Foydalanuvchi tashxisi: hook-ekrandagi mentor gapi «savdo sayti — OLX» rasmiy/kattalarcha jaranglaydi. Muhokamada mavzu-almashtirish variantlari (o'yin-sahifa, iTicket, Evos, kurs-sayt) taklif qilindi — foydalanuvchi RAD etdi: OLX qoladi, faqat so'z o'zgaradi. Tuzatish: PmLesson2.jsx:1341 «tanish internet-magazin — OLX». Qonunlashtirish: MATN_KORPUS 26-bo'lim (sayt-turi o'smirga tanish so'z bilan). esbuild + lint:til toza. UNCOMMITTED.

## 2026-07-30 — F-0730-03: PmLesson2 harakat-fe'llar aniqlashtirildi (4 foydalanuvchi-topilma + 2 izchillik) — ✅
Foydalanuvchi to'g'ridan-to'g'ri so'zlab berdi: (1) hook mentor-gapi «Mana internet-magazin — OLX sayti, pastdagi …» (sizga tanish olib tashlandi); (2) «ro'yxatga ko'z tashlang» → «ro'yxatga qarang»; (3) «tushunmay ketib qoladi» → «tushunmay saytga kirmay qo'yadi»; (4) yashil «Tushunarli» fon: «pastga davom etadi» → «saytdan foydalanishda davom etadi». Izchillik uchun shu iboralarning qolgan 2 uchrashuvi ham tuzatildi: s4 explainCorrect (pastga davom etadi) va flashcard-688 («ketib qoladi» → «foydalanuvchi saytdan chiqib ketadi»). Qonunlashtirish: MATN_KORPUS 27-bo'lim (harakat aniq fe'l bilan). esbuild + lint:til toza · residue-grep 0. UNCOMMITTED.

## 2026-07-30 — F-0730-04: PmLesson2 s3 yashil-fon «tugma shoshilmaydi» metaforasi olib tashlandi — ✅
Foydalanuvchi: 4-sahifadagi yashil-fon gapi «Tugma esa shoshilmaydi: u sabab ko'rsatilgandan keyin keladi» tushunarsiz. Tuzatish: «Tugma esa eng oxirida turibdi — foydalanuvchi nega bosish kerakligini tushungandan keyin chiqadi.» Qonunlashtirish: MATN_KORPUS 28-bo'lim (jonsiz narsaga odam-fe'l berilmaydi). esbuild + lint:til toza. UNCOMMITTED.

## 2026-07-30 — PMLESSON2_ETALON_TARIX.md YARATILDI (5 kunlik evolyutsiya-xulosa) — ✅
Foydalanuvchi topshirig'i: PmLesson2'ning 5 kunlik barcha o'zgarishlari (fyuchalar, so'z-almashuvlar, F-IDlar) bitta hujjatga yig'ilsin — 75 dars qayta tuzilganda shu etalondan chetga chiqilmasin. Yig'ildi: xronologiya (5 commit, ~20 F-ID) · 17-ekran anatomiyasi · 11 fyucha + 6 olib-tashlangan qatlam · 24-qatorlik so'z/atama TAQIQ-LUG'ATI · 4-B: ✅ ISHLATILADIGAN LUG'AT (11 atama yagona ta'riflari + 12 gap-qolipi, ~15 matn-to'lqin/60+ almashuv statistikasi) · 3-C: NAVBAT-PULSI to'liq logikasi (4 shart, 3-qadam qaror-tartibi, naqsh-jadval, sukut-tuzoq, 6 taqiq-joy, 5 tekshiruv, kod-shartnoma) · 3-D: MENTOR-YO'NALTIRISH logikasi (puls QAYERDA / mentor NIMA+NEGA mehnat-taqsimoti, 7 band) · 6 takror bug-sinf · 75-darsga tatbiq-tartibi. Manba: ikkala STATE, korpus 20–28, PM_DARS_ETALON 1-B/1-C/1-D, git-tarix. UNCOMMITTED.

## 2026-07-30 — PMUSERSTORY_ETALON_TARIX.md YARATILDI (2-TUR etalon-xulosa) — ✅
Foydalanuvchi topshirig'i: UserStory (P0) uchun ham PmLesson2'dagidek to'liq etalon-tarix + 2-TURga xos tamoyillar muhrlansin. 3 parallel tadqiqot-agent (jurnal-xronologiya · dars-anatomiya · qonun-ekstrakt) natijasi bitta hujjatga yig'ildi: xronologiya (07-16→30, ~90 topilma, qonun 14–91 manbasi) · 17-ekran anatomiya + artefakt-zanjir · 8 fyucha-standart · KEYS-BIZNES qoidalari (K1–K19 bank, real+o'quvchiga qiziq, raqam-yil, 91-qonun «keys bitta joyda — yoyilmaydi», takror-taqiqlar 10/24/38) · mexanika-takror taqiqi (4 manba: 10/26/1-B/59) · so'z-evolyutsiyasi (retsept, tekshiruvchi, klinika-tibbiyot tozalash, keys-tili, egaliksiz masdar, F-0729-08 22 tuzatish) · 1-TUR vs 2-TUR + GIBRID band · 87-qonun texnik-kirishuv · 5-bandlik tatbiq-tartibi. lint:prompt toza. UNCOMMITTED.

## 2026-07-30 — PMLESSON2_ETALON_TARIX.md CHUQURLASHTIRILDI (1-TUR to'liq-tayyor) — ✅
Foydalanuvchi: «1-tur etalonni ham chuqur ko'rib tayyorla, so'zlari bilan». 2 tadqiqot-agent (PmLesson2.jsx 3736-qator so'zma-so'z anatomiya · 1-TUR qonun-ekstrakt) natijasi hujjatga muhrlandi: 2-bo'lim → to'liq 17-ekran jadvali (mexanikalari bilan) + misol-ip xaritasi (91a isboti: OLX yagona ip, begona brend 0) + CustomerRun til-oilasi + koding-tafsilot (87-tatbiq: Htmllesson2:2562 bo'shlig'i) + 11 puls-nuqta aynan · YANGI 2-B: mentor-gaplar antologiyasi (barcha 10 gap aynan, NEGA+chorlov naqshi) · YANGI 2-C: 1-TUR blok-standart o'qishi (nazariya=interfeys-namunalar, ustaxona-chegara, qonun 46/72/75/18/23/27/56/79/82/91a, v8-halollik eslatmasi). Ikkala etalon-hujjat endi teng chuqurlikda — asl ishga (75 dars) tayyor. lint:prompt toza. UNCOMMITTED.

## 2026-07-30 — PmLesson3 QAYTA QURILDI: «Demo Day — 3 daqiqalik nutq» (v18 → v19) — ✅
**Topshiriq (foydalanuvchi):** dars M1-D14 kontekstga to'g'ri kelmasdi. O'quvchi bu darsga qadar loyihasini o'zi tanlab qurgan va oldingi darsda (DeployLesson) Netlify'ga chiqargan; keyingi qadam — **ota-onalar oldida Demo Day**. Eski dars esa mavhum «investor pitchi» edi (2 daqiqa, treyler metaforasi, 20 ekran). Talab: pitch 3 daqiqa bo'lsin · urg'u GAPIRISHGA qaratilsin · 17–18 ekran shart emas · dars individual bo'lsin.
**GATE 1 (reja tasdiqlandi):** repetitsiya-xonasi konsepti · mikrofon-yozuv + zaxira yo'l · chuqur qayta qurish.

**Yangi umurtqa (foydalanuvchi diktovkasi bo'yicha):** o'quvchi saytini qildi, lekin u qanday muammoni yechishini BILMAYDI → shuning uchun dars mentor bilan **muammo-qidiruv**dan boshlanadi, keyin ilgak+muammo → yechim → **jonli demo** → qaysi texnologiya (HTML/CSS) → **kelajak rejasi (2-Modul JS ko'prigi)**.

**3 daqiqa = 6 bo'lak:** Ilgak 0:20 · Muammo 0:30 · Yechim 0:25 · **Jonli demo 1:00 (eng katta)** · Qanday qildim 0:25 · Keyingi qadam 0:20.

**Ekranlar 20 → 15** (12 mazmun + podium + flashcard + yakun). Ball: 4 ta (s3·s6·s9 mikro + s11 final).
- s0 ilgak (zalda ota-ona, 2 variant) · s1 vaqt-chizig'i + reja
- **s2 MUAMMO-QIDIRUV** (yangi yadro): 6 sayt-turidan biri → 3 savol (kim · nimasi qiyin edi · nima osonlashdi) → bitta gap yig'iladi
- s3 TEST · **s4 ilgak+muammo yozish + 🎤 birinchi ovoz-yozuv**
- **s5 yechim + jonli demo**: namuna bir-jumlalar → o'z jumlasi → **o'z netlify manzili** → demo 3 qadamini sudrab tartiblash → Preview maketi
- s6 TEST · **s7 «qanday qildim»**: har juftlikdan ota-ona TUSHUNADIGAN variant (texnik til = tuzoq)
- **s8 keyingi qadam**: ikki tugma-tajriba (o'lik tugma ↔ JS tugmasi) → sayt turiga mos 4 taklifdan 2 tasi → 2-Modul ko'prigi
- s9 TEST · **s10 ota-ona 3 savoli + 🧯 falokat rejasi** (internet o'chsa — skrinshot)
- **s11 REPETITSIYA KABINASI (final)**: 6 bo'lak kartasi + **3:00 sahna-taymeri** (qaysi bo'lakni aytish kerakligini ko'rsatib turadi) + **mikrofon-yozuv → o'zini eshitish** + 3 o'z-baho bandi + mentorga MentorWorkStats

**Texnika:** `MediaRecorder`+`getUserMedia`, yozuv faqat `blob:` URL'da, hech qayerga yuborilmaydi, ekrandan chiqqanda `revokeObjectURL`; mikrofon yo'q/ruxsat berilmasa — jimgina taymer rejimiga tushadi (xato-oyna yo'q, 66-qonun ohangi). Nutq matni `localStorage: ccPitch3` da (Demo Day kuni joyida turadi); ovoz saqlanmaydi.
**Relslar yangilandi:** SCREEN_META(15) · SCORED_IDX[3,6,9,11] · INLINE_KEYS · Q_LABELS · ACH_TRIGGERS (5 nishon: Problem Finder/Demo Ready/Next Level/Stage Ready/Level Up) · RECAPS(3,6,9) · QUIZ_BANK 12 ta yangi savol · 12 flashcard · arena tokenlari (pitch/30s/💰 → nutq/3:00/👏) · App.jsx katalog sarlavhasi.
**O'lik kod tozalandi:** InvestorAvatar + INVESTOR_MOODS + inv-* CSS · RehearseTimer · TrailerMontage → `OrderDrag` · IcoChip · 4 ishlatilmagan ikonka. MentorWorkStats qayta jonlantirildi (s11).
**Tuzatilgan bug:** `Screen2` ichidagi `Row` har render'da qayta yaratilardi → «o'zim yozaman» maydonidan fokus uchardi; komponent screen tashqarisiga (`PfRow`) chiqarildi.
**Darvozalar:** esbuild toza · `npm run lint:til` 0 topilma · `vite build` toza (2.64s) · SSR-smoke OK · residue-grep (PARTS/PMETA/Investor/treyler/2 daqiqa) 0.
**Qolgan:** brauzer-verifikatsiya (Chrome kengaytmasi ulanmagan — mikrofon/sudrash/taymer jonli sinovdan o'tkazilmadi). UNCOMMITTED.

## 2026-07-30 — PmLesson3 FEEDBACK RAUNDI (F-0730-05…09) — ✅
Foydalanuvchi darsni o'zi ochib ko'rdi va 5 ta topilma berdi. Muhim: **6-sahifadan o'zi ham o'ta olmadi**.

**F-0730-05 · Namunalar hayotdan uzoq edi.** «Abrazetslar yomon» — sayt turlari mavhum (blog/o'yin/maktab) edi, o'quvchilar amalda esa online do'kon quradi. `SITE_KINDS` qayta yozildi: 📚 Kitob do'koni · 👕 Kiyim do'koni · 🍕 Ovqat buyurtma sayti · 🛍️ Boshqa online do'kon · 🙋 O'zim haqimda · ⭐ Boshqa. **Butun dars bo'ylab yagona misol-ip = kitob do'koni** (hook, ilgak, muammo, yechim, demo namunalari — hammasi shu ipda; 91a-qonun naqshi).

**F-0730-06 · Dizayn texnik darsniki edi (qonun buzilishi).** PmLesson3 to'q sariq/bej palitrada (`#FF4F28`, `#F6F4EF`) — ya'ni Htmllesson/JsIntro dekori. PM_DARS_ETALON 1-bo'limi buni taqiqlaydi. **PM-STUDIA palitrasi PmLesson2 etalonidan to'liq ko'chirildi**: `T`, `LT`, `G` (Source Serif 4), 33 ta `rgba(255,79,40)` → indigo, `CODE` kartasi navy → chuqur indigo `#241C4F`, zoom-backdrop, progress-bar porlashi. BLOKS ranglari PM oilasiga: ilgak amber · muammo `#D6455D` · yechim ko'k · **demo = brend-indigo (eng katta bo'lak brend rangida)** · qildim teal · keyin yashil.

**F-0730-07 · 3-sahifa (muammo-qidiruv) ko'zni to'ldirib yuborardi.** Bir ekranda 9 tanlov + 3 tugma turardi. Endi: har savolda **2 namuna** (3 emas) va **savollar birma-bir ochiladi** (javob berilgach keyingisi chiqadi), raqamli belgi + to'lgan qator yashil ramka oladi.

**F-0730-08 · 6-sahifa o'tib bo'lmas edi (eng jiddiy).** Bitta ekran uch ish so'rardi (yechim yozish + sayt manzili + sudrab tartiblash), ustiga **manzil MAJBURIY** edi — linki yo'q o'quvchi shu yerda qamalib qolardi. Yechim: ekran ikkiga bo'lindi —
 · **s5 Yechim** (bitta ish): tanish ilovaning bir-jumlasi namuna sifatida → o'z jumlasi. Bas.
 · **s6 Jonli demo**: 3 qadam **bosib ochiladi** (sudrash olib tashlandi — qiyin edi), sayt manzili **ixtiyoriy** («bilmasangiz bo'sh qoldiring»). Sayt-maketi (Preview/SiteMock) butunlay olib tashlandi — «pastdagi juda xunuk».
 Ekranlar 15 → 16, lekin har ekranda ish kamaydi.

**F-0730-09 · 8-sahifadagi gaplar noto'g'ri ohangda.** «endi uni manzilidan hamma ochadi» → «endi uni **hamma ko'rib, ishlata oladi**»; «Rang, o'lcham va joylashuvni o'zim tanladim» → «Rang va joylashuvni tanlab, saytga shu ko'rinishni berdim»; «bo'limlarni o'zim qo'ydim» → «o'zim **o'ylab tuzdim**». Sabab (foydalanuvchi): takror «o'zim… o'zim…» himoyalanayotgandek eshitiladi — go'yo kimdir «boshqa odam yaratdimi?» deb shubhalanayotgandek.

**F-0730-10 · 🧯 «Internet o'chib qolsa?» kartasi butunlay olib tashlandi** (foydalanuvchi: kerakmas). Savol-javob 4 → 3 karta; izlari yakun-cheklist, uy-vazifa, flashcard va arena savolidan ham tozalandi (o'rniga «keyingi qadam» va «demo 3 qadami»).

**Tuzilma yangilandi:** SCREEN_META 16 · SCORED_IDX [3,7,10,12] · RECAPS {3,7,10} · INLINE_KEYS {s3:1,s7:2,s10:2,s12:-1} · Q_LABELS · ACH_TRIGGERS · ekran-komponentlari qayta raqamlandi (Screen0–Screen13).
**O'lik kod:** OrderDrag (+ .dd-* CSS), Preview, SiteMock o'chirildi.
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · vite build ✓ · **har 16 ekran alohida SSR-render qilib tekshirildi** — bu darvoza qayta-raqamlashda o'chib ketgan test-ekranni (Screen7) ushladi va tiklandi.
**Eslatma:** shu seansda `src/1-Modull/PmLesson1.jsx` ham o'zgargan (PM-STUDIA palitrasiga o'tkazilgan) — bu ish bu raundga kirmaydi, tegilmadi. UNCOMMITTED.

## 2026-07-30 — PmLesson3 IKKINCHI FEEDBACK RAUNDI (F-0730-11…13) — ✅
**F-0730-11 · 5-sahifa (birinchi savol + muammo) uzun edi.** Foydalanuvchi: «inputlardagi default ko'rinib turganlar kerakmas, shunchaki nimadir yozsak bo'ladi — tushunarli, oddiy». Olib tashlandi: 2-3 ta tayyor namuna-chip (`HOOKS`), uzun ipucha-matnlar, yon ustundagi nutq-kartasi. Qoldi: ikkita maydon (`Savolingizni yozing…` / `Kim uchun va nimasi qiyin edi?`) + mikrofon. Namuna endi mentor gapida BIR MARTA aytiladi (kitob do'koni misoli). Ekran matni 1031 → 417 belgi. Korpus 32-bo'lim.

**F-0730-12 · 9-sahifa juda baland — qora nutq-kartasi aybdor.** Foydalanuvchi: «qora fonda uzun bo'lgani uchun bo'limlarni bir qarashda o'qigim ham kelmayapti». `PitchCard` ikki holatga bo'lindi: **mini** (dars o'rtasida — bitta qator: bo'lak nomlari + ✓ + «3/6») va **to'liq** (faqat yakuniy ekranda, o'quvchi tayyor nutqini o'qishi uchun). Natija: 8-ekran 1272 → 796, 9-ekran 1172 → 696, 12-ekran 1413 → 952 belgi. Korpus 33-bo'lim.

**F-0730-13 · «Ilgak» atamasi olib tashlandi.** Foydalanuvchi so'radi, 3 variant taqdim etildi (Birinchi savol · Qiziqtiramiz · Diqqatni tortamiz), **«Birinchi savol» tasdiqlandi**: nom o'zi nima yozilishini aytadi, izoh talab qilmaydi va qolgan nomlar (Muammo · Yechim · Jonli demo · Qanday qildim · Keyingi qadam) bilan bir oilada turadi. Almashtirildi: BLOKS yorlig'i, vaqt-chizig'i, s4 sarlavha/maydon, repetitsiya o'z-baho bandi, yakun-cheklist, flashcard, arena savoli va suzuvchi token. Korpus 31-bo'lim.

**Yakuniy ekran boyitildi:** endi o'quvchining TO'LIQ nutqi (6 bo'lak matni) yakunda ko'rinadi — Demo Day kuni shu darsni ochib o'qiy oladi.
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · vite build ✓ · 16/16 ekran render ✓ · «Ilgak» qoldig'i 0 (faqat ichki o'zgaruvchi nomi). UNCOMMITTED.

## 2026-07-30 — PmLesson3 UCHINCHI FEEDBACK RAUNDI (F-0730-14…18) + QONUN 92–93 — ✅
Foydalanuvchi keskin e'tiroz bildirdi: «nega shuncha feedbackdan keyin ham dars zo'r chiqmayapti», «nega etalonga qaramayapsan?». Ikkala e'tiroz ham o'rinli — quyidagi ikki qonun aynan shundan tug'ildi.

**F-0730-14 · 13-sahifa (repetitsiya) ma'lumotga to'lib ketgan edi.** «Juda ko'p ma'lumot, kirgim kelmayapti». Ekran 6 ta tahrir-maydoni + taymer + mikrofon + 3 bandlik o'z-baho ro'yxati + yon-kartani bir vaqtda ko'rsatardi. **Butunlay qayta qurildi**: bitta ustun, uch blok — **nutq (teleprompter, o'qish holatida)** → **taymer** → **mikrofon**. Tahrir «✎ Tahrirlash» ortiga yashirildi (bu ekranda o'quvchi YOZMAYDI — GAPIRADI), o'z-baho ro'yxati olib tashlandi. Ekran matni **1413 → 328 belgi**.

**F-0730-15 · Savol-javob matnlari (12-sahifa).** «Mentor yo'l ko'rsatdi, kodni o'zim yozdim» → **«Mentor o'rgatdi, saytni o'zim qildim»** · «Bir necha hafta — har darsda bittadan bo'lak qo'shdim» → **«Bir necha kun — har darsda o'rganganlarimni loyihamda ishlatdim»** · «Bu kimga kerak?» javobi tushunarsiz qurilgan edi (`Bu — {kim} uchun: {qiyinchilik}…`) → **«Saytim {kim}ga kerak: {qanday foyda}»**. Flashcard va arena savolidagi eski varianti ham yangilandi.

**F-0730-16 · Podium sarlavhasi etalondan olinmagan edi.** «Kim g'olib?» → etalondagi aynan naqsh: jonli darsda **«Bugungi g'oliblarimiz»**, yakka rejimda **«Bugungi natijangiz»** (`PmLesson2:2244` va `PmUserStoryLesson:2857` bilan bir xil). Yakka o'quvchi uchun «kim g'olib?» degan savol ma'nosiz edi.

**F-0730-17 · Oxirgi sahifadagi «Muddat: …» olib tashlandi** — uy-vazifa bandlari qisqargan holda qoldi.

**F-0730-18 · Flashcard javobi** «Mentor yo'l ko'rsatdi, kodni o'zim yozdim» → «Mentor o'rgatdi, saytni o'zim qildim».

**🔴 QONUN 92 (PM_DARS_ETALON) — BIR EKRAN, BIR ISH; EKRAN BULG'ANIB TURMAYDI.** Foydalanuvchi talabi bilan qat'iy taqiq sifatida muhrlandi: (a) har ekranda so'raladigan ish BITTA — yozish YOKI tanlash YOKI gapirish; (b) yig'ma-karta dars o'rtasida yig'ilgan holatda; (c) ipucha qisqa buyruq, tayyor namuna maydonda turmaydi; (d) **majburiy maydon faqat o'quvchida aniq bor ma'lumot uchun** — tashqi ma'lumot (sayt manzili) ixtiyoriy, aks holda ekran o'tib bo'lmas devor bo'ladi; (e) gapirish ekranida yozuv-maydoni ochiq turmaydi. **Tekshiruv-usuli qonunga kiritildi: har ekranni SSR-render qilib matn uzunligini o'lchash; 400–800 belgidan oshsa — bo'lish nomzodi.**

**🔴 QONUN 93 — TAKRORLANUVCHI ELEMENT ETALONDAN GREP QILINADI, QAYTA IXTIRO QILINMAYDI** (podium sarlavhasi, uy-vazifa kartasi, mentor-panellari, ball-fidbeki, arena matnlari).

**Ekran og'irligi (SSR-o'lchov, belgi):** s0 509 · s1 757 · s2 421 · s3 384 · s4 417 · s5 386 · s6 357 · s7 344 · s8 796 · s9 696 · s10 321 · s11 736 · s12 328 · sflash 482 · s13 931. Hammasi 92-qonun chegarasida.
**Korpus:** 31–33-bo'lim (bo'lak nomi atama bo'lmasin · ipucha qisqa · qora karta yig'ilgan).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓ · vite build ✓ · 16/16 ekran render ✓. UNCOMMITTED.

## 2026-07-30 — PmLesson3 ETALON-AUDIT (93-qonun bo'yicha to'liq tekshiruv) — ✅
Foydalanuvchi: «boshqa pagelarniyam etalon bo'yicha tekshirib chiq». PmLesson2 (1-TUR etalon) bilan element-ma-element solishtirildi.

**Topilgan va TUZATILGAN:**
1. 🔴 **Navbat-pulsi (88-qonun) UMUMAN yo'q edi** — etalonda 22 ta ishlatish, PmLesson3'da 0. `useTurnHint`/`useTurnWalk`/`turnCls` + `.turn-ring/.turn-wave/.turn-step` CSS **etalondan aynan ko'chirildi** (93-qonun) va 8 interaktiv ekranga ulandi: s0 (variant-chip → sabab to'lqini), s2 (sayt-turi kartalari), s5 (namuna tanlagichi), s6 (demo qadamlari), s8 (juftlik-tanlov), s9 (ikki tugma → JS chiplari), s11 (savol-javob kartalari), s12 (repetitsiya tugmasi). Ballanadigan testlarda puls YO'Q (1-C.6).
2. 🔴 **Ball-fidbekda stiker** — «Adashdingiz — 0 ball. Keyingisida olasiz! 💪» (+ «⏱») → etalondagidek stikersiz (korpus 6: mag'lubiyat tomoni TOZA).
3. **Ekran-yorliqlari raqamli edi** («1–2-bo'lak», «3-bo'lak · yechim») → etalon uslubida ma'noli: «Birinchi savol · Yechim · Jonli demo · Qanday qildim · Keyingi qadam».
4. **Ikki sarlavha bayon-shaklda edi** (korpus 3: buyruq yoki aniq savol) → «Saytingizni sahnada **qanday** ko'rsatasiz?» · «Endi nutqingizni **ovoz chiqarib** ayting».
5. **O'zini fosh qiladigan distraktor** (korpus 21): «Qancha bo'lsa ham farqi yo'q» → ishonarli variant bilan almashtirildi.
6. **Izoh-qoldiqlari**: «TOK pitch-mavzudan», «Pitch/treyler mavzusi» → Demo Day mavzusiga.
7. s5 namuna-jumla endi sukut bo'yicha ochiq turmaydi — o'quvchi o'zi bosib ochadi (1-C: ko'rilmagani yonadi).

**TEKSHIRILDI — TOZA:** «daftar» 0 · «tushunish oson» 0 · o'ylab topilgan personaj 0 · mentor gaplari NEGA+chorlov naqshida (korpus 22) · sarlavhalar savol/buyruq · nav-yorliqlari etalon bilan bir xil · podium sarlavhasi etalon bilan bir xil · ekran og'irliklari 92-qonun chegarasida (eng og'iri 931 — yakuniy ekran, u yerda to'liq nutq matni turadi).

**HAL QILINMAGAN — foydalanuvchi qarori kerak:**
· **87-qonun (koding bloki).** 1-TUR PM darsi «oldingi texnik darsdan o'sadigan» koding blokiga ega bo'lishi kerak (PmLesson2'da bor). PmLesson3 — nutq-repetitsiyasi darsi; koding qo'shilsa, darsning maqsadiga qarshi ketadi va 92-qonunni buzadi. Taklif: bu dars uchun 87-qonundan istisno rasmiylashtirilsin (sababi bilan) YOKI koding oldingi/keyingi darsga qoldirilsin.
· **Uy-vazifa katta tugmasi (`hw-big`).** Etalonda LMS kompilyatorini ochadigan porlovchi CTA bor; bu darsda amaliy topshiriq LMS'da emas (ota-onaga aytish) — soxta tugma qo'yilmadi.
· **Nishon-ro'yxati markup'i** etalonникidan farq qiladi (`ach-collect*` ↔ `ach-coll/ach-badge`) — ko'rinishi bir xil, faqat klass-nomlari boshqa. Kosmetik.

**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · vite build ✓ · 16/16 ekran render ✓. UNCOMMITTED.

## 2026-07-31 — PmLesson3 ETALONGA TO'LIQ KELTIRILDI (87-qonun yopildi) — ✅
Foydalanuvchi: «barchasi etalon bo'yicha to'g'rilansin, etalonday». Oldingi auditda ochiq qolgan uchala band ham yopildi — kod etalondan **aynan ko'chirildi** (93-qonun), faqat topshiriq-mazmuni bu darsniki.

**1 · 🛠 KODING BLOKI (87-qonun) — endi bor.** Etalondan ko'chirilgan mashina: HTML sintaksis-linteri (`lintHtml`) · to'liq-ekran kompilyator (`StrukturaCompiler`: Tab=2 probel, 400ms jonli tekshiruv, jonli brauzer-natija, F5-himoya) · praktika-relslari (`PRACTICE_BASE`, `MentorPracticeStats`, `StudentPracticePulse`) · «sinfda bajarganman» takrorlash-yo'li · barcha CSS.
**Topshiriq bu darsning maqsadiga bo'ysunadi** (87-qonun: oldingi texnik darsdan o'sadi — Htmllesson2 header/main/footer + h1/h2/p): o'quvchi **nutqidagi «Yechim» jumlasini saytining tepasiga chiqaradi**. Shartlar: `<header>` bor · ichida `<h1>` (sayt nomi) · ichida `<p>` (yechim jumlasi, ≥15 belgi) · `<main>` va undagi `<h2>`. Har shart uchun yo'naltiruvchi ipucha yozildi. Sarlavha 82-qonun oilasida: «Yechim jumlangizni saytingiz tepasiga chiqaradigan **kod** yozamiz». Brauzer-maketida o'quvchining O'Z netlify manzili ko'rinadi. Kalit: `pm-m1d14-koding`.
**O'rni:** savol-javobdan KEYIN, repetitsiyadan OLDIN (s12) — zal demoda aynan shu sahifani ko'radi.

**2 · Uy-vazifa kapsulasi (`hw-big`)** — etalondagi porlovchi CTA + zaryad-effekt (`fireHw`) + suzuvchi tokenlar ko'chirildi; tokenlar bu darsning DNK'siga moslandi (🎤 · muammo · yechim · demo · 3:00 · sahna · 👏). Tugma bosilgach uch bandlik topshiriq ochiladi.

**3 · Nishon-ro'yxati** — o'zim yozgan `ach-collect*` markup/CSS o'chirildi, etalonning `card ach-coll` + `ach-grid` + `ach-badge` (got/locked) markupi va CSS'i qo'yildi.

**Yakuniy holat:** 17 ekran (etalon ~17 bilan bir xil) · 4 ball-nuqta · 5 nishon · navbat-pulsi 8 ekranda · koding bloki bor · PM-STUDIA palitrasi.
**Ekran og'irligi:** s0 509 · s1 757 · s2 421 · s3 384 · s4 416 · s5 294 · s6 337 · s7 344 · s8 796 · s9 696 · s10 321 · s11 736 · **s12 (koding) 641** · s13 327 · s13b 187 · sflash 482 · s14 731 — hammasi 92-qonun chegarasida.
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓ · vite build ✓ · **17/17 ekran render** ✓ · o'lik CSS 0 ✓. UNCOMMITTED.

## 2026-07-31 — M1-D2 «Kim mening foydalanuvchim?» (PmLesson1) GIBRID QAYTA-QURISH — 🔄 3/6 BOSQICH
**Retsept A/C aralash, foydalanuvchi buyrug'i:** 1-Modul PM darslarini etalonlarga yaqinlashtirish; bu dars = GIBRID (nazariya 1-TUR PmLesson2-uslub · ustaxona+uy-vazifa 2-TUR).
**GATE 1 (pm-auditor):** infra sog'lom (jonli-ball zanjiri, INLINE_KEYS↔correctIdx, QUIZ_BANK 3/3/3/3, podium, ccProgress, badge-qorovullar, flashcard savol-shaklda) · 🔴 3 og'ir nuqson: palitra texnik-apelsin · misol-ip «7 xil olam» (91-qonun) · yo'q qatlamlar (puls 0, keys-slayd 0, ustaxona-qolip 0, koding 0, MentorNote 0, neon-kapsula 0) + o'lik audio-dvijok va onboarding-tur.
**GATE S qarorlari (bosh-agent, tasdiqlangan senariy `pm-senariylar/M1-D2-Auditoriya.md` asosida):** misol-ip = **mahalla novvoyxonasi** (limonad/buvi-non/futbol/Telegram/YouTube/«Bozor» — hammasi chiqdi) · keys = **K8 Facebook** (bir marta, freym+bashorat+ko'prik) · koding 87b: HTML o'tilmagani uchun tayyor mini-sahifada `[KIM]/[MUAMMO]/[YECHIM]` o'z karta-javoblari bilan almashtiriladi.
**1. Quruvchi ✅:** 20→17 ekran (o'chdi: zaif tap-reveal · soxta-ish · statik plakat · takror stepper · takror juftlash) · audio+TOUR+82q o'lik CSS olib tashlandi · navbat-pulsi (1-C.8 aynan, 15 nuqta) · ustaxona 80-qolip (`pm-m1d2-cards`) · koding-ekran (`pm-m1d2-koding`, kdx-skip) · K8 keys-slayd · PRACTICE_BASE signal-zona (avval xom indeks!) · lessonId `pm-m1d2-v1` · podium «0/4» va yakun ScoreRing mentorda yashirildi (90b) · neon-kapsula · PairTimer-recap. Indeks-siljish dasturiy tasdiqlandi (SCORED_IDX/RECAPS/Q_LABELS → 4,6,9,11,13).
**2. Bosh-agent qo'lda:** arena 2 savoli va 1 test-izohi hali eski olamda edi (buvi/limonad) → novvoyxona-olamiga; `correct` indekslar tegilmadi.
**3. Dizayn ✅:** palitra PM-STUDIA indigoga (35 qattiq-yozilgan rang) — qolgan 3 apelsin = CodeStrike arena brendi (ataylab) · rang-semantika KIM=ko'k/MUAMMO=amber/YECHIM=yashil butun darsda · imzo-vizual: hook «novvoyxona eshigi oldidagi odam-oqimi» + maqsad-ekran «karta o'z-o'zidan yozilishi» · 60/60b layout-qonunlari · 31q o'lik CSS + zararli dublikat (apelsin puls indigoni bosardi) · reduced-motion.
**4. Metodist ✅:** 11 mentor-pufak NEGA+chorlov qolipiga · taqiq-sweep («keys»→«haqiqiy misol», «sessiya»→«dars», «shunchaki», «sayqallang», «zaxira», **PM qisqartmasi to'liq chiqdi**) · manbasiz raqam («kuniga 120 kishi») olib tashlandi · 🔴 arena savoli darsning O'Z ta'limiga zid edi (variant matni tuzatildi, kalit tegilmadi) · explainWrong'lar korpus-5 qolipiga · RECAPS 12/12 kartada `ask` · flashcard topishmoq→savol · uy-vazifa «Amaliy vazifa» qolipi, muddatsiz · barcha 17 ekran ≤400 grapheme (maks 384). Qonunlashtirish: MATN_KORPUS 34–36 (F-0731-01…03).
**Tekshiruv (har bosqichda):** esbuild toza · lint:til 0 · lint:prompt toza · vite build toza · SSR-smoke 17/17 (self+mentor).
**QOLDI (keyingi seans):** 👦 o'quvchi 2-o'qish · pm-tekshiruvchi (puls 5-band o'lchovi, mentor 1-D 13 band, 58/60 skroll o'lchovi 1440×900+1280×800) · verifikator · qabulchi · deploy+jonli ko'rik. Mayda: `WFIELDS.ph` o'lik maydon.
UNCOMMITTED.

## 2026-07-31 — F-0730-19: YIG'ILADIGAN GAP QOLIPI BUZUQ EDI — ✅
**Foydalanuvchi topilmasi:** muammo-qidiruv natijasida «… uchun narx va tarkibi noaniq qolardi — mening saytim menyuni rasmi va narxi bilan ko'rsatadi» degan tushunarsiz gap chiqqan.
**Tashxis:** foydalanuvchi ko'rsatgan g'alati so'z dars matnida YO'Q (grep 0) — u «➕ o'zim yozaman» maydoniga kiritilgan va `ccPitch3` da saqlanib qolgan. **Lekin ayb qolipda:** `{who} uchun {pain}` qurilishi EGAni yo'qotardi va o'z namunalarim bilan ham buzuq gap berardi («sinfdoshlarim uchun kerakli kitobni qidirib, do'konma-do'kon yurardi»).
**Tuzatish:** qolip ikki tugal gapga bo'lindi — «**{KIM} {qiyinchilik}. Mening saytim {foyda}.**» + `cap()` bilan bosh harf. Barcha «qiyinchilik» javoblari EGAga bo'ysunadigan kesim shakliga o'tkazildi: «narxlarni solishtirib, ko'p vaqt yo'qotardi» · «telefon qilib, menyuni so'rab o'tirardi» · «kerakli narsani arzonroq topolmasdi» · «ortiqcha narsasini sotolmay yurardi» · «kerakli narsani turli joydan qidirardi». Qiyin so'z olib tashlandi: «narx va **tarkibi** noaniq qolardi» → «taomning narxini oldindan bilmasdi». s3 testidagi to'g'ri javob ham shu qolipga keltirildi.
**Tekshirildi:** 6 sayt-turi × 2 KIM × 2 QIYINCHILIK juftligi qo'shilgan holda o'qib chiqildi — hammasi tugal gap.
**Qonunlashtirish:** MATN_KORPUS 37-bo'lim (yig'iladigan gap bo'laklari QO'SHILGAN holatda tekshiriladi + 2×2 tekshiruv-usuli; avval 34 deb yozilgan edi — raqam-to'qnashuv tuzatildi).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · vite build ✓ · 17/17 ekran render ✓. UNCOMMITTED.

## 2026-07-31 — M1-D14 «Demo Day» (PmLesson3) RUS TILIGA O'TKAZILDI (RU_I18N_SPEC) — ✅
**Foydalanuvchi buyrug'i:** «PmLesson3 ni rus tilidayam qilishimiz kerak — texnik darslarda qilingan, shunaqa qilib ma'nolariga ham e'tibor ber».
**Boshlang'ich holat:** faylda RU-infra UMUMAN yo'q edi (2 ta `ru:` — faqat `lessonTitle`). 1-Modul PM darslaridan BIRINCHISI ruslashtirildi.
**Bajarildi (RU_I18N_SPEC 1–6 bo'limlari bo'yicha):** `tr()`/`__lang` infra · jonli-dars darvozasi va nishonlari · nishonlar (ACHIEVEMENTS.desc) · RECAPS 3×3 karta · MentorTestStats/MentorWorkStats/MentorPracticeStats/StudentPracticePulse · QuestionScreen · BLOKS · SITE_KINDS (6 tur × who/pain/help/hooks/js) · ONE_LINERS · PitchCard · MicRecorder · StageTimer · 17 ekranning hammasi · HTML-linter xabarlari · KODING kompilyatori · podium · CodeStrike arenasi · QUIZ_BANK 12 savol · 12 flashcard · AchCelebrate. Jami **454 `ru:` qator**.
**Ma'noga tarjima (so'zma-so'z emas):** «Demo Day» → «Демо-день»; metafora va rang-semantika saqlandi; «Вы»-forma; PM atamalari ruscha tabiiy shaklda (проблема · решение · живое демо · фраза-решение).
**🔴 KRITIK topilma (yangi bug-sinf emas, 6-Modul naqshining PM-varianti):** Screen9 da tanlangan JS-imkoniyatlar `sel` massivida **ko'rinadigan MATN** bilan saqlanardi (`sel.includes(j)`, `key={j}`). `K.js` `{uz,ru}` obyektga aylangach: (a) 4 chipning hammasi bitta `[object Object]` React-kalitini olardi, (b) til almashganda tanlov yo'qolardi. Yechim: indeks-satr kalitlari (`String(ji)`), matn faqat render-joyda `tr()` bilan.
**Til-mustaqillik qarorlari:** `checkStructure`/`lintHtml` teg-asosli — faqat `hints`/`msg` tarjima qilindi, tekshiruv o'zgarmadi · `PfRow` chipi `tr(o)` saqlaydi, ya'ni o'quvchi gapi KO'RINADIGAN tilda yig'iladi · `muammo`/`keyin` jumlalari grammatika sabab har til uchun alohida ramkada (F-0730-19 qolipiga sodiq) · analitika-payload `uzOf()`/`ouz()` bilan **UZ-etalon** · `QzFX` canvas TOK ro'yxati `__lang` bo'yicha · string default prop'lar render-vaqtiga ko'chirildi (modul-yuklanishda UZ'da qotmasin).
**Kalitlar TEGILMADI:** `INLINE_KEYS {s3:1, s7:2, s10:2, s13:-1}` · `correctIdx` 1/2/2 · `QUIZ_BANK.correct` 0-1-2-3 tartibi · `set_quiz_keys`/`answerKey` zanjiri.
**Darvozalar:** esbuild ✓ · `vite build` ✓ · **SSR-smoke 26 komponent × UZ/RU = 52 render, 0 obyekt-render, 0 crash** ✓ · RU rejimda kirill hamma ekranda ✓ · **UZ rejimda ruscha qoldiq 0** ✓ · `lint:til` **0 error** (5 warn: KOD_PLACEHOLDER'ning ko'p qatorli `ru:` shabloni — linter faqat bir qatorli `ru:` maydonini oqlaydi, xato emas).
**Hujjat:** `RU_I18N_SPEC.md` 8-bo'lim «1-Modul PM darslari» jadvali yangilandi. **PmLesson1/PmLesson2 hali ⬜ — keyingi navbat.** UNCOMMITTED.

## 2026-07-31 — F-0731-04: PmLesson1 s11 «UI TO'LIB QOPTI» → BOSQICHLI OCHILISH — ✅
**Foydalanuvchi topilmasi:** karta-yig'ish ekraniga (s11) kirganda KIM/MUAMMO/YECHIM uchala qatori 3×3 = 9 karta bilan birdan ochilib turardi — UI to'lib, qayerdan boshlash noaniq.
**Tanlangan yechim (3 variantdan, foydalanuvchi tasdig'i):** har bosqichda egaga ko'rsatish — ① KIM (3 karta, tekshiruvsiz ✓) → qator yig'iladi → ② MUAMMO ochiladi → «👀 Egasiga ko'rsat» → personaj tan olsa ✓ → ③ YECHIM ham shunday → convert. Personaj-drama (Ijodkor brifi) saqlanib, endi HAR bosqichda alohida hukm beradi.
**Tuzatish (Screen11):** `confirmed` holat + `step` mashinasi · tasdiqlangan qator bir-qatorlik ✓ ko'rinishga yig'iladi (↻ o'zgartirish bilan, keyingi bosqichlarni reset qiladi) · kelajak bosqich qulf-qator («MUAMMO — keyingi qadam») · mentor gapi bosqich bilan almashadi va joriy qadamga yo'naltiradi (KIM nomi bilan) · NavNext/tugma yorliqlari ①②③ qadam-raqamli · storedAnswer'dan qayta tiklash (revisit'da karta to'liq, konfetti otilmaydi) · ball-gate o'zgarmadi (faqat convert'da).
**Qonunlashtirish:** PM_DARS_ETALON **94-qonun** (ko'p-bosqichli tanlov progressiv ochiladi, 5 band — 92-qonunning tanlov-varianti; texnik darslarga ham tegishli).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-05: MISOL-OLAM «NOVVOYXONA» → «MAKTAB YONIDAGI LAVASH DO'KONI» (PmLesson1 to'liq) — ✅
**Foydalanuvchi topilmasi:** o'quvchilar Toshkent shahrida — novvoyxonaga ishi tushmaydi, mavzu qiziq emas va begona; «buni barcha darslarda o'ylash kerak».
**Tashxis:** novvoyxona-olami darsning yagona ipi (91-qonun) — 56 qatorda: hook, s2 namuna-karta, s3 sahna, s5b-izoh, WFIELDS, Screen8, s11 GROUPS/BUBBLE, s12 variant, koding-defaults, arena 3 savoli, RECAPS 5 karta, HW-tokenlar.
**Tanlangan olam (3 variantdan, foydalanuvchi tasdig'i):** maktab yonidagi lavash do'koni. 3 persona: 🎒 tanaffusda shoshgan o'quvchi (navbat→oldindan buyurtma) · 🧑‍💻 ofis xodimi (telefon→doimiy tushlik-buyurtma) · 🙋 yangi mijoz (menyu-narx→menyu-sahifa). Kanonik karta: «Tanaffusda lavash oladigan maktab o'quvchilari / Navbat uzun — tanaffusga ulgurishmaydi / Oldindan buyurtma qilib, kelib olib ketish sahifasi».
**Tuzatish:** 12 zona to'liq ko'chirildi; s11 guruh-kalitlari mazmunga moslandi (qoshni→mijoz, kafe→ofis), Screen8 kalitlari ham (novvoy→sotuvchi…); Facebook keys-slayd tegilmadi (91b: keys o'z olamida). 🔴 KALITLAR TEGILMADI: INLINE_KEYS, correctIdx, QUIZ_BANK.correct — faqat variant-matnlari yangi olamga moslandi (to'g'ri javob o'z indeksida qoldi). Residue-grep: novvoy|non|qo'shni|kafe|mahalla|🥖 = 0.
**Qonunlashtirish:** PM_DARS_ETALON **95-qonun** — misol-olam Toshkent o'smirining o'z hayotidan, sinov-savoli «o'quvchi shu joyga O'ZI boradimi?»; barcha darslarga (texnik ham); GATE S'da tekshiriladi. + memory/auditoriya-toshkent-osmiri.md (seanslararo).
**Darvozalar:** esbuild ✓ · lint:til 0 (1 topilma «masalliq» tuzatildi) ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-06: s6 USTAXONADA «⭐ IKKINCHI KARTANI HAM YOZAMAN» TUGMASI OLIB TASHLANDI — ✅
**Foydalanuvchi buyrug'i:** 8-sahifa (s6 ustaxona) — ikkinchi karta tugmasi kerak emas, ehtiyotkorlik bilan olib tashlansin (92-qonun ruhi: bir ekran — bir ish).
**Tuzatish:** faqat tugma va ortiqcha Fragment o'chirildi; qolgan zanjir tegilmadi — saqlash-oqimi, ✎ tahrirlash, `readFullCards().slice(0,2)` himoya-kesimi (eski localStorage'da 2 karta bo'lsa ko'rsatiladi), koding-ekran `[0]`-kartani o'qishi o'zgarmagan.
**Darvozalar:** esbuild ✓ · residue-grep «Ikkinchi karta» = 0. UNCOMMITTED.

## 2026-07-31 — F-0731-07/08: SO'Z-FIDBEK RAUNDI (hook mentor-quyruq + atama-tanishtirish) — ✅
**F-0731-07 (s0 hook):** mentor gapidagi «to'g'risini birozdan keyin birga bilib olamiz» quyrug'i ortiqcha — olib tashlandi, gap «…bittasini tanlang.» bilan tugaydi (payoff baribir javob-belgilangach chiqadigan tasdiq-gapda bor).
**F-0731-08 (s1 maqsad):** «auditoriya-karta» atamasi sarlavhada tushuntirishsiz urilardi. Foydalanuvchi qolipi bilan qayta qurildi: sarlavha atamasiz («Dars oxirida saytingiz kim uchun ekanini yozib olasiz»), mentor avval oddiy gap → «shu yozuv auditoriya-karta deyiladi» → shundan keyin atama darsda erkin (83 joyga tegilmadi).
**Qonunlashtirish:** MATN_KORPUS **38** (mentor gapida va'da-quyruq yo'q) + **39** (yangi atama — avval oddiy gap, sarlavhada atama yo'q, qolip bilan). Yo'l-yo'lakay: korpusdagi ikkita «34-bo'lim» to'qnashuvi tuzatildi (F-0730-19 bo'limi → 37).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-09/10: s1 MAQSAD-EKRANI SAYQAL (egalik + qisqalik + yo'l-xarita fe'li) — ✅
**F-0731-09 (egalik):** «Dars oxirida SAYTINGIZ kim uchun ekanini yozib olasiz» — o'quvchida hali sayt yo'q, «-ingiz» yolg'on jaranglaydi. Foydalanuvchi taklifi bilan: **«Dars oxirida kim uchun sayt qilishni bilib olasiz»** (artefakt emas, BILIM va'da qilinadi).
**F-0731-10 (qisqalik):** mentor gapi uzun edi (6 jumla, savollar yoyilgan, ekranda ko'rinib turgan narsa takrorlangan) → 3 gapga: «Uchta savolga javob topasiz: KIM? MUAMMO? YECHIM? Uchalasi bitta yozuvga yig'iladi — shu yozuv auditoriya-karta deyiladi. Quyida namunasi o'z-o'zidan yozilib chiqadi.»
**Yo'l-xarita:** «Auditoriya nima ekanini ochamiz» → «…bilamiz» (qadam nomi erishiladigan holatni aytsin).
**Qonunlashtirish:** MATN_KORPUS **40** (o'quvchida hali yo'q narsa uniki qilib aytilmaydi + «-ingiz» tekshiruvi + yozib/bilib olasiz farqi + yo'l-xarita fe'li) · **41** (atama tanishtiruvchi mentor gapi eng qisqa holatda, ekrandagi narsa matnda ta'riflanmaydi).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-11/12/13: s5 KEYS-SLAYD (Facebook) TO'LIQ SAYQAL — ✅
**Foydalanuvchi slayd-ma-slayd fidbegi, hammasi qabul qilindi:**
· Sarlavha → «Bugungi eng katta ijtimoiy tarmoq avval kimlar uchun ishlagan?» · Mentor gapi tegilmadi (foydalanuvchi ma'qulladi).
· 1-slayd: «kichik sayt» → «oddiy sayt». · 3-slayd: «…uchun ishlagan: boshqa hech kim ro'yxatdan o'tolmasdi» → «Avval sayt faqat Garvard universiteti talabalari uchun ochiq edi. Boshqalar ro'yxatdan o'ta olmasdi.» · 4-slayd: «auditoriya asta kengaydi» (kitobcha) → «Keyin boshqa universitetlar ham qo'shildi. Saytdan foydalanadiganlar ko'paydi.» · 5-slayd: «2 yildan keyingina… Bugun u — Facebook» → «Oradan ikki yil o'tib, sayt butun dunyoga ochildi. Bugun uni Facebook nomi bilan bilamiz.» · Xulosa: «kartangizdagi KIM» (ichki atama) → «Facebook ham avval juda aniq bir guruh uchun yaratilgan. Sizning auditoriya kartangizdagi «KIM» ham shunday aniq bo'lsin.»
**Bashorat-variantlari (bosh-agent talqini, foydalanuvchi «bir xil darajada bo'lsin» ko'rsatmasi bo'yicha):** zinapoya tartibiga keltirildi — «Bitta universitet talabalari uchun» → «Amerikadagi barcha talabalar uchun» → «Butun dunyo uchun»; `right` 2→**0** (bashorat BALLANMAYDI, lokal holat — jonli-ball kalitlariga aloqasi yo'q, INLINE_KEYS/QUIZ_BANK tegilmadi). «AQSh» → «Amerika».
**Yondosh tuzatish:** RECAPS idx6 kartasidagi «…talabalari uchun ishlagan» → «ochiq bo'lgan» (3-slayd bilan izchillik).
**Qonunlashtirish:** MATN_KORPUS **42** (keys-voqea hikoya tilida: ishlagan→ochiq edi, auditoriya kengaydi→foydalanadiganlar ko'paydi, keyingina→oradan … o'tib, kichik→oddiy) · **43** (bashorat variantlari bir o'lchovda, zinapoya tartibida) · **44** (keys xulosasi ichki atamasiz, to'liq nom bilan).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-14/15/16: s8 «FOYDALANUVCHI KO'ZI» EKRANI SAYQAL — ✅
**Foydalanuvchi fidbegi (hammasi qabul):**
· Sarlavha: «…bir xil narsaga **qaraydimi**?» → «Bitta saytga kirgan hamma bir xil narsani **qidiradimi**?» · Mentor: «saytga o'sha odamning ko'zi bilan qaraysiz» (kitobcha) → «Lavash do'koni saytiga uch xil odam kiradi. Har biri boshqa narsani qidiradi. Ularni birma-bir bosing va saytni ularning o'rnida ko'ring.»
· Persona: «Ofis xodimi (doimiy xaridor)» → «**Doimiy xaridor** (ofis xodimi)» (rol birinchi, kasb qavsda) + emoji 🧑‍💻→🧑‍💼 **butun darsda sinxron** (hook, RECAPS×2, s11 AVA). Ehtiyoji: «Har kuni bir xil buyurtmani bir bosishda berish.»
· Sayt-maketi 3-qatori: «🔁 Doimiy buyurtma: har kuni 15 ta lavash» → «🔁 **Oxirgi buyurtma: bir bosishda takrorlash**» (ehtiyoj-matn bilan bevosita bog'landi); `look` matni ham «OXIRGI BUYURTMAGA» ga moslandi.
· Xulosa: «Bitta sayt — uch xil qarash…» (mavhum) → «Bir saytga turli odamlar kirishi mumkin. Ammo auditoriya kartasida eng muhim guruh tanlanadi.»
· Yondosh izchillik: RECAPS idx9 kartasi (matn + RcFlow) yangi qator-nomi va persona-nomiga moslandi.
**Qonunlashtirish:** MATN_KORPUS **45** (sarlavha fe'li ekran mazmunini aytsin: qaraydi→qidiradi) · **46** (mentor chorlovi «o'rnida ko'ring», kitobiy ko'chma ma'no yo'q) · **47** (persona nomi: rol birinchi + kasb qavsda; ehtiyoj-matni ekrandagi imkoniyatga ulansin; bir persona — bir qiyofa).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-17: s11 SARLAVHASI BOSQICHLI OQIMGA MOSLANDI — ✅
**Foydalanuvchi topilmasi:** «Bitta odamning kartasini yig'ing» — sarlavha birinchi qadamni (odam tanlash) aytmaydi, holbuki ekran endi bosqichli (94-qonun).
**Tuzatish:** → «Bitta odamni tanlang va kartasini yig'ing.» (sarlavha ikki harakatni tartibi bilan aytadi — o'quvchi nimadan boshlashni sarlavhadanoq biladi).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-18/19: KODING EKRANI SAYQAL + o'ng-panel tashxisi — ✅
**Qabul qilindi:** sarlavha «Kartangizni sahifada ko'rsatadigan kodni tayyorlaymiz» (texnik, «kodni o'zim yozamanmi?» noaniqligi) → **«Endi kartangizni sahifada ko'rsatamiz.»** · mentor 2-jumlasi ikkiga bo'lindi: «Pastdagi «🛠 Kompilyatorni ochish» tugmasini bosing. Kodni yozadigan va natijani darhol ko'rsatadigan oyna ochiladi.» · chap kod-maketidagi xira izoh «— uchtasi ham vaqtincha» → **«← Bu joylarni siz to'ldirasiz»**.
**🔍 O'ng preview tashxisi (o'zgartirilmadi, sabab bilan):** foydalanuvchi ko'rgan «csadcdsac» — qattiq-yozilgan namuna EMAS, s6 ustaxonasida saqlangan O'Z kartasi (`readFullCards()[0]`). Panel ataylab shunday: chapda [KIM] qolipi ↔ o'ngda o'quvchining javobi = 50-qonun aylantirish-vizuali. Karta yozilmagan bo'lsa fallback allaqachon lavash-namunasi. Foydalanuvchi tasdig'isiz tegilmadi.
**Atama-tekshiruv:** «kompilyator» — mentor gapida vazifa-ta'rifi bilan keladi (gloss o'rnini bosadi); 1-Modulning 7 texnik darsida ham shu atama ishlatiladi, ya'ni yangi emas.
**Qonunlashtirish:** MATN_KORPUS **48** (koding sarlavhasi natijani aytadi; buyruq va izoh alohida gapda; «kompilyator» yonida vazifa-ta'rifi) · **49** (izoh-qator qiymat bersin, holatni takrorlamasin).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-20: «KARTANGIZDAGI KIM» ICHKI ATAMASI SLOT-SAVOLIGA ALMASHDI — ✅
**Foydalanuvchi topilmasi (s15 mustahkamlash):** «Kartangizdagi KIMni yoddan tushuntira olasizmi?» — «KIM» abstrakt, bola «nimani tushuntiraman?» deb qoladi.
**Tuzatish:** sarlavha → **«Saytingiz kim uchun ekanini yoddan ayta olasizmi?»** · mentor → «Yoddan aytilgan gap eng yaxshi esda qoladi. Ekranga qaramasdan ayting: saytingiz kim uchun va nega aynan shu odamlarni tanladingiz?» (ikki gapga bo'lindi, ichki atamasiz).
**Yondosh sweep (shu topilma-sinfi):** kompilyator ipuchalari ham slot-savoliga o'tkazildi — «kartangizdagi KIM/MUAMMO/YECHIM javobini yozing» → «saytingiz kim uchun ekanini» · «ularning qanday qiyinchiligi borligini» · «saytingiz buni qanday hal qilishini». Sabab: to'liq-ekran kompilyatorda karta ko'rinmaydi. s11 «① Avval KIMni tanlang» TEGILMADI — u yerda KIM yorlig'i ekranda turibdi.
**Qonunlashtirish:** MATN_KORPUS **50** (slot-nomi ekranda ko'rinmasa — o'rniga slot SAVOLI; almashtirish jadvali: KIM→«kim uchun», MUAMMO→«qanday qiyinchilik», YECHIM→«sayt buni qanday hal qiladi»).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-21/22: YAKUN EKRANI SAYQAL — ✅
**Qabul qilindi:** sarlavha «Bugun birgalikda auditoriya-kartani **yozishni** o'rgandik» → **«Bugun auditoriya-karta tuzishni o'rgandik.»** (dars ko'nikmasi — tuzish/fikrlash, qo'l-harakati emas). Yakka rejim varianti ham izchillik uchun: «Endi siz auditoriya-karta **tuza olasiz**» · uy-vazifa tugmasi «Amaliy topshiriqni **boshlash** →» → «…**bajarish** →».
**RECAP 3 qatori (foydalanuvchi matni):** «Auditoriya — saytdan foyda oladigan aniq odamlar guruhi» («real» olib tashlandi) · «"Hamma uchun" qilingan sayt odatda hech kimga mos kelmaydi» · «Eng katta saytlar ham kichik va aniq auditoriyadan boshlagan» (eski qator ikki qavat tire+ikki nuqta edi). 4-qator tegilmadi.
**Yondosh izchillik (93-qonun):** flashcard javobi ham «Saytdan **real** foyda oladigan…» → «Saytdan foyda oladigan aniq odamlar guruhi» — ta'rif dars bo'ylab so'zma-so'z bir xil.
**Qonunlashtirish:** MATN_KORPUS **51** (yakun-fe'li asl ko'nikmani aytsin: yozish→tuzish; tugma «bajarish») · **52** (yakuniy xulosa-qatorlari qisqa tugal gap; so'z-o'yin emas fakt; ta'rif bir xil).
**Darvozalar:** esbuild ✓ · lint:til 0 ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — F-0731-23: KUNLIK FIDBEK MEXANIZMGA AYLANTIRILDI (til-lint 55→61 qoida) — ✅
**Foydalanuvchi buyrug'i:** «yig'ib boramiz — yangi dars yasayotganda yoki barcha darslarda shu xatoni qilmaslik uchun».
**Bajarildi:** bugungi korpus-topilmalaridan **grep-lanadigan** 6 qoida `til-lint-rules.json`ga qo'shildi (endi har `npm run lint:til` da avtomatik ushlanadi):
· `slot-ichki-atama` (error) — «kartangizdagi KIM/MUAMMO/YECHIM» → slot-savoli (KORPUS 50)
· `kozi-bilan-qarash` (error) — «ko'zi bilan qaraysiz» → «o'rnida ko'ring» (KORPUS 46)
· `auditoriya-kengaydi` (warn) — kitob-iborasi → «foydalanadiganlar ko'paydi» (KORPUS 42)
· `topshiriq-boshlash` (warn) — «topshiriqni boshlash» → «bajarish» (KORPUS 51)
· `karta-yozishni-organdik` (warn) — yakun-fe'li → «tuzishni o'rgandik» (KORPUS 51)
· `raqam-keyingina` (warn) — «2 yildan keyingina» → «oradan ikki yil o'tib» (KORPUS 42). Boshlang'ich naqsh juda keng edi («shundan keyingina» o'rinli ta'kidni ham ushladi) — raqam+vaqt-birligi shartiga toraytirildi.
**Darhol natija:** yangi qoidalar xuddi shu xatoni **PmLesson2** va **PmUserStoryLesson (P0 etalon)** da topdi — ikkalasida ham uy-vazifa tugmasi «bajarish»ga o'tkazildi (esbuild ✓, 3 PM dars lint TOZA).
**Qolgan qarz (buyruq kutadi):** «topshiriqni boshlash» yana **9 texnik darsda** bor (1-Modul 8 ta + 2-Modul 1 ta) — bugungi ko'rik doirasidan tashqarida, warn sifatida belgilangan holda qoldirildi; buyruq bo'lsa bir sweepda tuzatiladi.
**Darvozalar:** esbuild ✓ (3 fayl) · lint:til 0 error ✓ · lint:prompt ✓. UNCOMMITTED.

## 2026-07-31 — M2 PM UCHLIGI (PmLesson4/5/6) — GAP-AUDIT (ish BOSHLANMAGAN, keyingi seansga)
**Foydalanuvchi asosiy nishoni:** «man istaganim PmLesson4/5/6 edi» — 2-Modulning PM darslari.
**Ekran-oqimi (hammasi 20 ekran, infratuzilma butun):**
· **D2 PmLesson4** «Muammodan yechimga»: Kirish|Reja|Og'riq→feature|Og'riq=o'zak|Test1|Saralash|Tekshiruv|Feature tug'iladi|Qaysini ishlatasiz|Dorixona|Test2|Tuzatish|Feature-karta|Test3|Namuna|Qoida|Yakuniy ish|Tayyor|Natijalar|Takrorlash
· **D7 PmLesson5** «Dekompozitsiya»: …|Zo'r keyslar|Resurs|Evolyutsiya|O'sish|MVP vs Hammasi|Saralash|MVP yig'ish|…
· **D13 PmLesson6** «Pitch»: …|Taqdimot tuzilishi|Aytish vs Ko'rsatish|Skelet→teri→harakat|2 daqiqalik taqdimot|Jargon vs Analogiya|Moslash|Pitch yig'ish|…
**Topilmalar (tuzatilmagan):**
1. 🔴 **RU tarjima YO'Q** (uchalasida `ru:`=1) — 2-Modulning qolgan 10 darsi to'liq ruslashtirilgan. Eng katta funksional qarz. Naqsh: PmLesson3 (RU_I18N_SPEC 1–6) — har darsga ~400 `ru:` qator.
2. 🟡 **Atama-gigienasi:** `feature` 168x (D2), `MVP` 157x + `backlog` 22x + `dekompozitsiya` 12x (D7), `pitch` 28x + `jargon` 17x (D13). MATN_ETALONI lug'atida `feature`→«imkoniyat», `MVP`→«mahsulotingizning ilk sodda versiyasi» bor; darsda birinchi uchrashda gloss BOR-YO'QLIGI ekran-ma-ekran tekshirilishi kerak (D2 da faqat kod-izohida «feature (funksiya)» topildi — o'quvchi-matnida emas).
3. 🟡 **96-qonun ko'prigi yo'q:** D2/D7/D13 lavash do'koni loyihasiga ulanmagan (D7 «do'kon» 15x — lekin bu boshqa, umumiy do'kon misoli). ProjectBridge naqshi (96b) qo'llanishi mumkin.
4. 🟡 **Misol-olamlari 95-qonundan O'TADI:** D2 = og'riq→dori metaforasi (70x «dori») · D7 = skeytbord/mashina MVP klassikasi · D13 = ikki taqdimot. Hech biri «novvoyxona» tipidagi uzoq olam emas — almashtirish SHART emas, faqat D2 dagi «Dorixona» ekrani metafora-cho'zilishi jihatidan ko'rib chiqilsin.
5. 🟡 lint: D2 = 2 warn (`to'ladi` fe'li 1470,1588), D13 = 1 warn (1465). D7 toza.
**Bosh-agent tavsiyasi (foydalanuvchi tasdig'i kutiladi):** avval RU tarjima (funksional qarz) → keyin atama-gloss sweep → oxirida 96b ko'prigi. To'liq etalon-qayta ko'rik SHART EMAS: yangi qonunlar (92/94/95, KORPUS 38–52) endi lint+korpus mexanizmi orqali dars ochilganda avtomatik ushlanadi.
**⚠️ UNCOMMITTED:** bugungi butun ish (1-Modul sayqali F-0731-04…23, PM_DARS_ETALON 94/95/96/96b, KORPUS 38–52, til-lint 55→61 qoida, 2-Modul Faza 1: D1/D3/D4/D5/D6) commit qilinmagan.

## 2026-07-31 — M2 PM UCHLIGI TO'LIQ QAYTA QURILDI (Quruvchi bosqichi) — 🔄 1/8 BOSQICH
**Foydalanuvchi qarori:** «to'liq etalon, shoshilmasdan, etalonlarimiz kabi». 3 senariy (GATE S) → 3 `pm-quruvchi` agenti parallel.
**Bosh-agent GATE S qarorlari:** K12 (Airbnb pitch deck) M1-D12 da ham bosh-keys — QOLDIRILDI (M1 = slaydlar TARTIBI, M2-D13 = slaydlardagi TIL; agent farqni 3 band bilan asosladi) · `lessonId` yangilandi (darslar noldan qurildi, 11-qonun formati).
**Natija — uchala dars:**
· **PmLesson4 (M2-D2)** «Muammodan yechimga», 2-TUR, 19 ekran, 4174 qator. Markaziy mexanika: JUFTLIK (qiyinchilik↔imkoniyat) — s2 tap-ochilma · s4 sudrab-ulash + «🗄 javonda qoladi» · s10 ro'yxat-tozalash. Keys K1 UZUM (s6). Ustaxona 3 juftlik-karta → `pm-m2d2-features`. Koding HTML darajasida (87-qonun: M2-D1 dan keyin JS sintaksisi yo'q).
· **PmLesson5 (M2-D7)** «Dekompozitsiya», GIBRID, 19 ekran. Markaziy mexanika: ⚖️ TAROZI — daraja TANLANMAYDI, ikki savoldan (zarurat × yuk) o'zi kelib chiqadi; UserStory'ning 🔥⚡🌱 doskasi takrorlanmadi. Keys K3 INSTAGRAM (s6). 🔥 v1 sig'imi = 3 (sabab vaqt bilan asoslangan). Artefakt `pm-m2d2-features` → `pm-m2d7-mvp`. Koding: 2 massiv + for + if + funksiya (obyekt/`.push()` YO'Q — o'rgatilmagan).
· **PmLesson6 (M2-D13)** «Pitch», 2-TUR, 20 ekran. Markaziy mexanika: 🔎 SO'Z-ELAGI (variant berilmaydi — o'quvchi kasbiy so'zni O'ZI topadi) + 🧑‍🍳 TINGLOVCHI-JAVOBI + 🌯 UCH QATLAM; imzo-vizual «tushunish chizig'i». Keys K12 (s5). Artefakt `pm-m2d7-mvp` + `pm-m1d2-cards` → `pm-m2d13-pitch`. s12 «Bitta gap» — modul-yakuni (92e: o'qish holatida, tahrir ✎ ortida). PmLesson3 Demo Day bilan takror YO'Q (mikrofon/teleprompter/taymer ishlatilmagan).
**🔗 ARTEFAKT-ZANJIRI TASDIQLANDI (dasturiy):** `pm-m1d2-cards` → **D2 yozadi** `pm-m2d2-features` → **D7 o'qiydi va yozadi** `pm-m2d7-mvp` → **D13 o'qiydi va yozadi** `pm-m2d13-pitch`. (Birinchi tekshiruv-skriptim yolg'on trevoga bergan edi — darslar `lsWrite`/`writeLS` o'ramlaridan foydalanadi, `setItem` to'g'ridan-to'g'ri emas.)
**Darvozalar (bosh-agent qayta o'lchadi):** esbuild 3/3 toza ✓ · `vite build` toza ✓ · lint:til 0 error (2 warn — kod-qatoridagi RU-regex/arena tokenlari, yolg'on-ijobiy) ✓ · `SCREEN_META ↔ screens` 19/19 · 19/19 · 20/20 ✓ · `QUIZ_BANK` 12/12/12 ✓ · scored id'lar ↔ `INLINE_KEYS` 1:1 ✓ · UZ/RU muvozanati 599↔599 · 477↔477 · 467↔467 ✓.
**QOLGAN ISH (zanjir davomi):** 🎨 Dizayn → ⚡ Jonli-ball (kalitlar tasdig'i) → 👦 o'quvchi 1-o'qish → ✍️ Metodist (EKRAN ≤400 dasturiy o'lchov) → 👦 2-o'qish → GATE 2 → Tekshiruvchi → Verifikator → Qabulchi → GATE 3.
**AGENTLAR QOLDIRGAN ISH-BUYRUG'I:** (1) `App.jsx` m2-02 kartasi sub-matni hamon «har bir feature — qaysi og'riqqa dori?» — dars tiliga zid, foydalanuvchi ruxsati kutilmoqda; (2) arena/podium chrome-matnlari D7/D13 da UZ-only — RU yurishi kerak; (3) D2 s4 sudrash touch-qurilmada sinovdan o'tmagan; (4) o'lik CSS qoldiqlari (D6 `.mini-site`/`.lb-*`, D2 `.conn-*`/`.algo-*`). UNCOMMITTED.

## 2026-08-01 — F-0801-01/02: M2-D2 DEMO-OLAMI LAVASH → KINOTEATR + SARLAVHA-QOIDASI — ✅
**Foydalanuvchi kuzatuvi (ikkita):** (1) «yana lavash saytmi deb xo'rsinishi mumkin» — lavash M1-D2, M2-D2, M2-D7 da takrorlangan; (2) sarlavha «Ikkala sayt ham lavash do'koni uchun. Qaysi biri ko'proq buyurtma keltiradi?» — birinchi jumla sahna-sharti, o'quvchiga qiziq emas.
**Qonunlashtirish:** PM_DARS_ETALON **96c** (🔴 ip o'quvchining ARTEFAKTIDA, demo-misolda emas: artefakt uzilmaydi · demo har darsda yangilanadi · dars ichida bitta · zaxira-namuna o'sha darsning olamidan · yangi demo 95-qonun testi + grep-to'qnashuv tekshiruvidan o'tadi) · MATN_KORPUS **56** (sarlavha savolni beradi, sahna-shartini emas; tekshiruv: birinchi jumlani o'chirib ko'ring).
**Olam tanlovi (to'qnashuv grep bilan tekshirildi):** YouTube BAND (P0 etalon abrazetsi, 7 joy) · Instagram BAND (M2-D7 keysi K3) · Telegram BAND (bugun Htmllesson1 analogiyasiga qo'yildi) · CodeStrike = platforma brendi → **kino ERKIN**. Aniqlik: kinoteatr binosi emas, «do'stlar bilan kinoga borish» vaziyati (savdo markazidagi kino — 95-qonun testidan o'tadi).
**Bajarildi — 18 zona:** fayl-izohi · s0 hook ro'yxatlari (A: 🎵 fon musiqasi · 🔄 aylanadigan logotip · 📄 uzun matn ↔ B: 🕒 seans jadvali · 💺 zal xaritasi · 🎟 onlayn chipta) · s1 natija-preview juftliklari · s2 kartalar · s4 juftlash + javon · s7 zaxira-qiyinchiliklar · s8 namunalar · s9 TEST-3 · s10 ro'yxat-tozalash · koding (`kino.uz`, seans-juftligi) · s12 yakuniy test · s14 uy-vazifa · QUIZ_BANK 3 savol · flashcard · arena fon-tokenlari (🎟 💺).
**Sarlavha-tuzatishi (56-qonun): 2 ta** — s0 → **«Qaysi sayt ko'proq mijoz olib keladi?»** (sahna-sharti mentorga ko'chdi) · s6 keys → framing-prefiks olib tashlandi.
**🔴 TEGILMADI (o'quvchi zanjiri va relslar):** `pm-m1d2-cards` o'qish · `pm-m2d2-features` yozish · `INLINE_KEYS {s3:2,s5:1,s9:1,s12:0, s8:-1,s10:-1,s11:-1}` · `correctIdx` va `QUIZ_BANK.correct` indekslari (variantlar matni almashdi, indeks o'z joyida) · mexanikalar · Dizayn palitrasi · K1 UZUM keysi (91-qonun: alohida janr).
**Darvozalar (bosh-agent qayta o'lchadi):** esbuild ✓ · lint:til 0 error ✓ · `vite build` toza ✓ · `SCREEN_META 19 === screens 19` ✓ · UZ/RU 599↔599 ✓ · residue-grep `lavash|лаваш|do'kon|menyu|buyurtma` = **0** ✓.
**Ochiq savol:** s0 sarlavhasida UZ «ko'proq mijoz» ↔ RU «больше зрителей» — ma'no bir, so'z-tanlovi teng emas. Foydalanuvchi UZ matnini aynan diktovka qilgani uchun tegilmadi; «tomoshabin»ga o'tkazish uning qaroriga qoldi. UNCOMMITTED.

## 2026-08-01 — 🇷🇺 1-MODUL TO'LIQ IKKI TILLI: PmLesson1 + PmLesson2 RUSLASHTIRILDI — ✅
**Foydalanuvchi buyrug'i:** «ru qil, parallelni hammasini qil, tayyor UZ-RU da 1-Modulni to'liq».
**Boshlang'ich holat:** 14 darsdan 12 tasi to'liq ikki tilli edi; **PmLesson1 (M1-D2) va PmLesson2 (M1-D6) da RU UMUMAN YO'Q** (`ru:`=1, `tr()` infratuzilmasi ham yo'q). Rus tilida o'qiyotgan o'quvchi kursning 2-darsidayoq o'zbekcha matnga urilardi.
**Bajarildi (2 agent parallel, naqsh-manba PmLesson3 etaloni):** `tr()`/`__lang`/`uzOf()`/`ouz()` infrasi o'rnatildi · jonli qobiq (LiveGate/LiveBadge/LiveBigCode/xato-xabarlari) · umumiy primitivlar (Stage/Nav/Mentor/ScoreRing/Zoomable/MentorTestStats/MentorPracticeStats/StudentPracticePulse) · 17 ekran × 2 dars · RECAPS 4×3 karta · flashcardlar · arena (QUIZ_BANK 12 savol × 4 variant, QuizArena, CsWordmark, QzFX tokenlari) · nishonlar · koding-kompilyator qobig'i va lint-xabarlari.
**🔴 TOPILGAN VA TUZATILGAN BUG-SINFI (aynan ogohlantirilgan sinf — «kalit MATN bilan saqlanmasin»):**
· PmLesson1: `DEMO_CARD` `key={r.k}` → uch qator bitta `[object Object]` kalitini olardi (→ `key={i}`) · `SiteMock` `key={name+headline}` obyekt-konkatenatsiyasi (→ `tr()` bilan string) · `HOOK_CHOICE_KEY` artefaktiga hook-tanlov MATN bilan yozilardi va keys-slaydda `[object Object]` chiqardi (→ `{uz,ru}` obyekt, render `tr()`).
· PmLesson2: 🔴 **eng og'iri** — `checkStructure` o'quvchining `<h2>` matnini QATTIQ-YOZILGAN o'zbekcha so'zlar bilan tekshirardi (`'muammo'`, `'qanday ishlaydi'`, `'isbot'`, `'harakat'`). RU rejimda o'quvchi «Проблема» deb yozsa, ikki shart HECH QACHON yopilmasdi — koding ekrani o'tib bo'lmas devor bo'lardi. `word` → `{uz,ru}`, `tr()` `checkStructure` ICHIDA (`__lang` o'rnatilgandan keyin), turlanishga chidamli o'zaklar (`проблем`, `доказательств`, `действи`).
· `HW_TOKENS`/`Q_LABELS`/`ACHIEVEMENTS.desc` xom render qilinardi → `tr()` bilan o'raldi.
· PmLesson1 `wideKim` («hamma» darvozasi) RU so'zlari bilan kengaytirildi (`все/всех/любой/каждый/люди`) — aks holda RU o'quvchi darvozadan o'tib ketardi.
**Ma'noga tarjima:** realiyalar (лавашная · перемена · сум) · slot-atamalari izchil (КТО·ПРОБЛЕМА·РЕШЕНИЕ) · OLX interfeysi tabiiy ruscha yorliqlar bilan · atamalar RU'da ham birinchi uchrashda izohli (CTA, конверсия) · grammatika-farqli gaplar har til uchun alohida ramkada · analitika-payload **UZ-etalon** (`uzOf()`).
**Darvozalar:** esbuild 2/2 ✓ · `vite build` toza ✓ · lint:til **0 error** (11 warn — ikkalasida ham ko'p qatorli `ru:` shabloni, PmLesson3 dagi bilan bir sinf) ✓ · SSR-smoke **90 + 66 render** UZ/RU × self/mentor — 0 crash, 0 `[object Object]`, RU'da kirill bor, UZ'da ruscha qoldiq 0 ✓ · ball-relslari va artefakt-kalitlari bayt-aynan o'zgarmagan ✓ · UZ/RU 673↔673 va 557↔557 ✓.
**🏁 NATIJA: 1-MODUL 14/14 DARS TO'LIQ IKKI TILLI.** (2-Modul: 13/13 — `JsIntroLesson` dagi 1 farq qonuniy fallback.)
**Qolgan mayda:** `RU_I18N_SPEC.md` 8-bo'limidagi jadval yangilanmagan · lint:til ko'p qatorli `ru:` bloklarini oqlashni bilmaydi (11 warn manbayi) · PmLesson1 s11 chip-tugmalarida RU matni ikki qatorga tushishi mumkin (brauzer-ko'rigi kerak). UNCOMMITTED.

## 2026-08-01 — F-0801-03: M2 PM UCHLIGI (D2/D7/D13) RU-QOBIG'I VA D13 RECAPS YOPILDI — ✅
**Foydalanuvchi so'rovi:** «2-Modulldagi barcha darslar uz-ru tillaridami — ko'rib tekshir» → keyin «hammasini tuzat — PmLesson4, 5, 6».
**Tashxis (13 fayl dasturiy o'lchandi):** dars MAZMUNI 13/13 da ikki tilli edi; kamchilik **umumiy qobiqda** — qobiq bo'limidagi `tr({uz:` o'ramlari: boshqa 10 darsda 23–27, **PmLesson5 = 1, PmLesson6 = 1**, PmLesson4 = 23 (3 qator tushib qolgan). Ya'ni RU rejimda join-ekran, mentor-paneli, arena, podium, xato-xabarlari o'zbekcha chiqardi (D7 ≈87, D13 ≈102 matn). Oldingi yozuvdagi «2-Modul: 13/13» xulosasi `ru:` qatorlarini sanaganidan yolg'on-ijobiy bo'lgan — qobiq umuman hisobga olinmagan.
**🔴 KEYINCHALIK TOPILGAN, TASHXISDA YO'Q EDI:** PmLesson6 ning butun **`RECAPS` bloki** (4 guruh × 3 karta = 36 maydon: title·h·body·vis·ask) xom o'zbekcha edi va `RecapOverlay` ularni `tr()`siz render qilardi. Bu mazmun-kamchilik, qobiq emas.
**Bajarildi:**
· **PmLesson4** — 3 qator (`startMentor` catch, `Kodni to'liq kiriting`, `Ismingizni kiriting`).
· **PmLesson5 / PmLesson6** — qobiq lug'at-asosida o'raldi (UZ→RU lug'ati 9862 juftlikdan yig'ildi, ustuvorlik: PmLesson4 → src/pm → 2-Modul → 1/3-Modul; birinchi manba yutadi), so'ng qo'lda yopilgan qoldiqlar: ternar birinchi shoxlari (`live.busy ? …`, `allIn ? …`, `lastQ ? …`, `big ? …`, `my ? …`), shablon-satrlar (`To'g'ri javob: ${…}`, `Yangi nishon: ${…}`, `Siz hozir: ${…}-o'rin`, `eng uzun streak`), `window.confirm` matni, `LiveGate title`, `LiveBigCode` ko'rsatma-paragrafi (JSX `<b>` bilan), `NavNext label` uchligi.
· **PmLesson6 RECAPS** — 36 maydon `{uz,ru}` ga o'tkazildi + `RecapOverlay` da `tr(rc.title)`/`tr(card.h)`/`tr(card.body)`/`tr(card.vis)`/`tr(card.ask)` + «🗣️ Sinfga savol» yorlig'i + nuqta-tugma `aria-label`.
· **🔴 CRASH OLDI OLINDI:** `MentorTestStats` ning ikki `rc-open` tugmasi `{RECAPS[screenIdx]?.title}` ni XOM render qilardi — maydon obyektga aylangach bu «Objects are not valid as a React child» bo'lardi. Ikkalasi `tr()` ga o'raldi (PmLesson5 da ham shu tugmalarning «📖 Qayta tushuntirish — » prefiksi tarjimasiz edi — yopildi).
**Darvozalar (bosh-agent qayta o'lchadi):** esbuild 3/3 toza ✓ · `vite build` toza ✓ · `lint:til` **0 error** (2 warn — PmLesson4:1484,2290, tegilmagan qatorlar, oldindan bor) ✓ · qobiq-`tr()` 26 / 27 / 27 (etalon diapazoni) ✓ · UZ/RU qator-muvozanati 440↔440 · 453↔453 · 472↔472 ✓ · RECAPS 36/36 juft ✓ · **SSR-smoke** 3 dars × UZ/RU = 6 render: 0 crash, **0 `[object Object]`**, RU'da kirill bor, UZ'da yo'q ✓.
**ATAYLAB TEGILMADI (etalon bilan izchil — hamma darslarda shunday):** (1) audio-TTS zaxira matni `(audioOk || "To'g'ri.")` / `"Unchalik emas…"` — 13/13 darsda UZ (PmLesson4:930 da buning izohi bor: ovoz o'chirilganda matn UZ holicha); (2) iframe-qumsandiq ichidagi kompilyator xabarlari (`hcpm-err` / `k-err`: «Kod ishlamadi», «Natija hali chiqmadi») — React daraxtidan tashqarida, PmLesson4 da ham UZ; (3) KODING namuna-kodidagi o'zbekcha identifikator/satrlar (`nomlar`, `qatlamlar`) — o'quvchi o'qiydigan kod; (4) nishon nomlari inglizcha (qonun bo'yicha).
**QOLGAN OCHIQ SAVOL (foydalanuvchi qaroriga):** PmLesson6:440 dagi **jargon-detektor lug'ati** (`'baza'`, `"ma'lumotlar bazasi"`, `'server'`…) faqat o'zbekcha o'zaklarni tutadi — RU rejimda o'quvchi «база данных» deb yozsa, SO'Z-ELAGI mexanikasi kasbiy so'zni **topmaydi**. Bu PmLesson2 dagi `checkStructure` bug-sinfining aynan o'zi (2026-08-01 yozuviga qarang). Tuzatish uchun lug'atni `{uz,ru}` o'zaklar bilan kengaytirish kerak — tashxis qilindi, tuzatilmadi. Shuningdek PmLesson6:2189 `Q_LABELS` — o'lik kod (90(b)-qonun kartasi olib tashlangan). UNCOMMITTED.

## 2026-08-01 — F-0801-04: M2-D13 MATN-TEKSHIRUVCHILARI IKKI TILLI QILINDI (F-0801-03 ochiq savoli yopildi) — ✅
**Foydalanuvchi buyrug'i:** «ha, jargon lug'atini ham tuzat».
**Muammo-sinfi (PmLesson2 `checkStructure` bilan bir xil):** o'quvchi MATNINI qattiq-yozilgan **o'zbekcha** so'zlar bilan tekshiradigan validatorlar. RU rejimda o'quvchi ruscha yozadi → mexanika ishlamaydi. PmLesson6 da uchta joy topildi (biri tashxisda aytilgan edi, ikkitasi audit paytida chiqdi):
· **`JARGON` (s9/s11 SO'Z-ELAGI + koding-qumsandig'i)** — faqat UZ. RU o'quvchi «база данных» yozsa kasbiy so'z **topilmasdi** va `clean` noto'g'ri `true` bo'lardi (ball ham, pedagogika ham buzilardi).
· **`ANALOGY_WORDS` (s9 «Nega ishlaydi» darvozasi)** — RU tomoni bor edi, lekin faqat **bosh kelishikda** (`прилавок·повар·полка`). «на прилавке», «как полку» yozgan RU o'quvchi darvozadan **o'ta olmasdi** (teskari xato — devor).
· **`kim` darvozasi** — `все|всe` bor edi, `всех·любой·каждый·люди` yo'q edi (PmLesson1 `wideKim` da allaqachon kengaytirilgan ro'yxat).
**Yechim — `ANALOGY` naqshiga keltirildi (`{uz, ru}` + qo'shma ro'yxat):**
· `JARGON = { uz:[…], ru:[…], both:[…] }` → `JARGON_WORDS`. Ro'yxatdagilar **turlanmagan o'zak**: `funksi`/`функци`, `repozitori`/`репозитори`. `both` = lotincha qisqartmalar (`javascript·html·css·localstorage·api`) — ikkala tilda bir xil yoziladi.
· 🔴 **Yolg'on-trevoga oldi olindi:** kirillcha `апи` ATAYLAB qo'shilmadi — u «н**апи**сали» ichiga tushib har pitchni jargon deb belgilardi. Sinovda tasdiqlandi.
· `база данных` o'rniga **`данных`** o'zagi — «базу/базе/базы данных» ning barcha turlanishini bitta qoida bilan tutadi.
· RU o'xshatish-o'zaklari kesildi: `прилав·повар·полк` (UZ da qo'shimcha oxiriga yopishgani uchun `peshtaxta·oshpaz·javon` o'zgarmadi).
· **Xabar endi o'quvchi YOZGAN so'zni ko'rsatadi:** yangi `wholeWordAt()` o'zakni to'liq so'zgacha kengaytiradi → «funksiyalar», «массиве», «bazasida» (avval quruq o'zak «funksi» chiqardi). Apostrof (o', g') ajratuvchi emas. Koding-qumsandig'ida ham xuddi shu mantiq (`W()` helperi, `joinedRaw` bo'yicha).
**Darvozalar:** esbuild 3/3 ✓ · `vite build` toza ✓ · `lint:til` **0 error** (2 warn — PmLesson4:1484,2290, tegilmagan; PmLesson6 ning warn'i `ru:` massivini bir qatorga yig'ish bilan yopildi) ✓ · SSR-smoke 6 render: 0 crash, 0 `[object Object]` ✓ · **detektor-sinovi 20/20** (UZ turlangan · RU turlangan · toza gaplar · «написали» yolg'on-trevogasi) va **o'xshatish-sinovi 10/10** ✓.
**Qoldi:** PmLesson6:2189 `Q_LABELS` — o'lik kod (90(b)-qonun kartasi olib tashlangan), tozalash alohida ish. UNCOMMITTED.

## 2026-08-01 — F-0801-09: BASHORAT-SLAYDI TOZALANDI (6 dars) + 100-QONUN MUHRLANDI — ✅
**Foydalanuvchi buyrug'i:** «🎯 Topdingiz! Bitta universitet talabalari uchun» qolsin — «Bu ball emas — bemalol belgilang…» va « · Dars boshida siz «Butun shahar aholisi» degandingiz» **«bular ketsin tomom»**; keyin «barcha PMlardayam shunaqa qil shu joyida va Etalongayam yoz».
**Topilma-sinfi (ikkita, ildizi bitta — ekran o'zi aytadigan narsani matn takrorlaydi):**
· **(a) tinchlantiruvchi ball-izohi** — yo'q narsani inkor qilish uni eslatadi: o'quvchi savoldan ball-tizimiga o'tadi. «🎲 Avval o'zingiz belgilab ko'ring» yorlig'i + ball-indikatorining yo'qligi buni allaqachon aytib turibdi.
· **(b) hook-echo quyrug'i** — natija-qatoriga eski taxminni ulash bitta qatorga uch narsa tiqadi (natija + eski tanlov + taqqoslash); 56-qonun (adashganda ASL javob aytiladi, taxmin takrorlanmaydi) bilan bir oila.
**Tatbiq (6 fayl · 6 ekran):**
· `src/1-Modull/PmLesson1.jsx` s6 (Facebook keysi) — `k-note` izohi + `k-hook` quyrug'i · `hook` state · `readHookChoice()` · `.k-note`/`.k-hook` CSS o'chirildi.
· `src/pm/PmJtbdLesson.jsx` (Starbucks keysi) — `pred-cap` izohi + yakundagi ikki `frame` hook-echosi · `hookPick`/`hookHit` · `readHookChoice()` · `.pred-cap` CSS.
· `src/pm/PmMetricsLesson.jsx` (Duolingo keysi) — `kbet-sub` izohi («Ball yo'q — bemalol belgilang…») + yakundagi hook-payoff `frame-soft` · `hookVote` state · `readHookVote()` · `HOOK_SHORT` · `.kbet-sub` CSS. `HOOK_KEY` **yozuvi qoldi** (o'qish yo'q — 100c).
· `src/2-Modull/PmLesson4.jsx` (Uzum keysi) — `kp-sub` izohi + `frame-success` hook-echosi (uning zaxira-matni yuqoridagi `frame-soft` bilan takrorlanardi — butun blok ketdi, fragment yechildi) · `hookPick` · `.kp-sub` CSS.
· `src/2-Modull/PmLesson5.jsx` (Instagram keysi) — `k-hook` echosi · `hookChoice`/`hookN` · `.k-hook` CSS.
· `src/2-Modull/PmLesson6.jsx` (Airbnb keysi) — `ks-hook` ning hook-shoxi olib tashlandi, umumiy matn qoldi · `hookPick`.
**Qonunlashtirish (retsept B, matn-topilma → IKKI joy + lint):**
· `MATN_KORPUS.md` **§62** — ❌/✅ juftliklari (ikkala noto'g'ri variant + to'g'ri natija-qatori + adashgan holat).
· `PM_DARS_ETALON.md` **100-qonun** (a–d): izoh taqiq · natija-qatoriga havola ulanmaydi · hook localStorage'dan **o'qilmaydi** (yozuv qolishi mumkin) · slayd qatlamlari = savol → chiplar → natija+matn. 📌 barcha darslarga (texnik ham).
· `til-lint-rules.json` — 2 yangi **error**-qoida: `bashorat-ball-izohi` · `orqaga-havola-degandingiz` (jami 64 qoida). Probe-sinov: ikkalasi ham tutdi ✓.
**Darvozalar:** esbuild 6/6 toza ✓ · residue-grep (`ball emas` · `Ball yo'q` · `boshida siz` · `degandingiz` · `tanlagandingiz` · `belgilagandingiz`) barcha PM darslarda **toza** ✓ · `lint:til` 6 fayl **0 error** (8 warn — PmLesson1:1468,1913-15 va PmLesson4:1471,2277 kirill-homoglif, tegilmagan qatorlar, oldindan bor) ✓ · butun repo bo'yicha yangi ikki qoidada **0 topilma** (boshqa darslarda bu naqsh yo'q) ✓.
**Eslatma:** `vite build` bu raundda yuritilmadi (faqat matn/o'lik-kod o'chirildi, esbuild 6/6 toza). UNCOMMITTED.

## 2026-08-01 — F-0801-10: PmLesson1 FLASHCARD MATNI SAYQALLANDI (5 karta tahrir + 1 yangi) — ✅
**Foydalanuvchi fidbeki (karta-ma-karta o'qib chiqilgan):** «umuman juda yaxshi yozilgan, lekin 13–17 yoshli o'quvchi uchun ayrim joylari metodik jihatdan tabiiyroq bo'lishi mumkin». Eng katta maqtov: **barcha kartalar «ta'rif → javob» ko'rinishida** — bu naqsh saqlandi.
**Tatbiq (`src/1-Modull/PmLesson1.jsx` · `PM_FLASHCARDS`, 7 → 8 karta):**
· **3-karta** — ❌ «Auditoriya-karta qaysi uch javobdan **yig'iladi**?» → ✅ «Auditoriya-karta **3 ta savolga javob beradi. Qaysilar?**». Sabab: «yig'iladi» jarayonni aytadi, «3 ta savol» esa o'quvchi ko'rgan narsani aytadi.
· **4-karta** — front qisqardi («Kartadagi KIM qatoriga» → «**KIM qatoriga**»); back ❌ «Saytni **birinchi ochadigan** aniq guruh» (sun'iy) → ✅ «Saytdan **birinchi bo'lib foydalanadigan** aniq odamlar guruhi»; note ✅ «yoshi, **kasbi** yoki qiziqishi bilan **aniqlanadi**» (tugal gap).
· **5-karta** ⭐ — note ❌ «o'sha odamlar sayt bilan nimani yengmoqchi» (tugallanmagan, o'ylantiradi) → ✅ «**sayt aynan shu qiyinchilikni yechadi**». Foydalanuvchi «muammo» so'zini taklif qilgandi; karta orqasi «Bitta aniq **qiyinchilik**» bo'lgani uchun bitta karta ichida bir atama ushlab turildi (lug'at-izchilligi).
· **6-karta** — back ✅ «**Faqat** bitta universitet talabalari uchun» — «faqat» urg'u beradi (tarixan Harvard).
· **7-karta** ⭐ — ❌ back «Har biri o'ziga kerak **qatorga**» — **qaysi qator?** Kontekstsiz o'qilganda tushunarsiz (flashcard oradan vaqt o'tib ochiladi). ✅ front «**Bir xil** saytga kirgan odamlar nimaga qaraydi?» · back «Har kim **o'ziga kerak bo'lgan narsani qidiradi**» · note «shuning uchun **avval** asosiy auditoriya tanlanadi».
· **8-karta (YANGI)** — front «Kuchli sayt nimadan boshlanadi?» · back «Kichik va aniq auditoriyadan» · note «Facebook ham shunday boshlagan». Darsning bosh xulosasini kartaga muhrlaydi va 6-karta bilan juftlashadi.
· RU tomoni har olti kartada birga yangilandi (`{uz,ru}` juftligi buzilmadi).
**Qonun-marshruti:** bu raundda yangi qonun ochilmadi — topilmalar mavjud qonunlar ostida (99: flashcard ekrani · KORPUS 45: fe'l ekrandagi ishni aytsin · KORPUS 52: xulosa-qatorlari tugal gap). 🔎 **Umumlashtirishga nomzod (keyingi seansda ko'rib chiqiladi):** «flashcard javobi ekran-kontekstisiz, YAKKA o'qilganda tushunarli bo'lsin» — 7-kartaning «qaysi qator?» xatosi shu sinfdan; hozircha faqat shu yozuvda qayd etildi.
**Darvozalar:** esbuild toza ✓ · `lint:til` **0 error** (6 warn — kirill-homoglif, tegilmagan qatorlar) ✓ · karta soni hech qayerda qattiq-yozilmagan (`total = cards.length`, `PM_FLASHCARDS` faqat 2 joyda) ✓. UNCOMMITTED.

## 2026-08-01 — F-0801-01: KOMPILYATOR TAB-QAYTISHDA YOPILIB QOLARDI (PmLesson1) — ✅ pilot, foydalanuvchi sinovi kutilmoqda
**Fidbek:** kompilyatorda yozib turib boshqa tabga (Telegram) o'tib qaytilganda kompilyator yopilib, praktika-sahifa ochilib qolyapti.
**Tashxis:** Chrome Memory Saver fon-tabni bo'shatib, qaytishda sahifani jimgina qayta yuklaydi. F-0730-01 progress-saqlov ekran-raqamni tiklaydi (shuning uchun 0-ekranga emas, praktika-sahifaga tushadi), lekin «kompilyator ochiq edi» belgisi saqlanmasdi — `ScreenCoding.open` oddiy React-state edi. Kod o'zi yo'qolmaydi (400ms jonli saqlov).
**Tatbiq (`src/1-Modull/PmLesson1.jsx`):** `KODING_KEY` saqloviga `open` bayrog'i qo'shildi — `writeKodingOpen()` yordamchi; ochish-tugmasi `open:true`, «Darsga qaytish» va «Davom etish» `open:false` yozadi; 400ms jonli saqlov ham `open:true` ushlab turadi; `ScreenCoding` mount'da bayroqni o'qib kompilyatorni avto-qayta ochadi.
**Darvozalar:** esbuild toza ✓ · o'quvchi-matn o'zgarmadi (lint:til shart emas).
**Sinov:** foydalanuvchi tasdiqladi — «yaxshi ishladi» → tarqatishga ruxsat.

## 2026-08-01 — F-0801-01 (b): TUZATISH BARCHA PM DARSLARIGA TARQATILDI (7 fayl) + 102-QONUN — ✅
**Buyruq:** «Barcha Pm darsimizga qil shu 1-2-Modull va Userstoryga».
**Qamrov (kompilyator-qobiqli PM darslar, 7/7):** `src/1-Modull/PmLesson1.jsx` (pilot) · `PmLesson2.jsx` · `PmLesson3.jsx` · `src/2-Modull/PmLesson4.jsx` · `PmLesson5.jsx` · `PmLesson6.jsx` · `src/pm/PmUserStoryLesson.jsx` (P0 etalon). Qolgan PM darslarida (7–34) kompilyator-qobiq yo'q — grep bilan tasdiqlandi.
**Har faylda 6 nuqta (bir xil naqsh):** `writeKodingOpen()` yordamchisi · tugma `open:true` · «Darsga qaytish» `open:false` · «Davom etish» yozuvida `open:false` · 400ms jonli saqlovda `open:true` (aks holda birinchi saqlov bayroqni o'chirardi) · `useState` boshlang'ich-funksiyasida tiklov. Fayl-farqlari: PmLesson6 `readLS`/`writeLS` yordamchilarini ishlatadi (moslashtirildi) · PmLesson5/6 da `KODING_KEY` fayl boshida e'lon qilingan · tugma-selektorlari uch xil (`turn-ring` · sodda · `calm`).
**Darvozalar:** esbuild **7/7 toza** ✅ · `vite build` **toza** (1.52s) ✅ · dasturiy to'liqlik-o'lchovi: 7 faylning har birida oltala nuqta **1/1** ✅ · yangi localStorage kaliti ochilmadi (mavjud `KODING_KEY` ichiga bayroq) ✅ · o'quvchi-matni o'zgarmadi (`lint:til` shart emas).
**Qonunlashtirish:** `PM_DARS_ETALON.md` → **102-qonun** (to'liq-ekran oyna ochiqligi ham saqlanadi; (a) bayroq juftligi · (b) `useState` tiklovi · (c) jonli saqlov bayroqni ushlaydi · (d) yangi kalit ochilmaydi · (e) har qanday `fixed` qatlamga tegishli). 📌 barcha darslarga.
**Qarz:** texnik darslardagi kompilyator-qobiqlar (Htmllesson1 va h.k.) shu naqsh bo'yicha hali tekshirilmagan. UNCOMMITTED.

## 2026-08-02 — F-0802-07…10: PmLesson4 HOOK-EKRANI (M2, «imkoniyat/feature» darsi) — ✅
**Kelib chiqishi:** 2-Modul QA raundi (JsIntro'dan keyingi ikkinchi fayl). Foydalanuvchi hook-ekranining to'rt qismini nuqta-ba-nuqta ko'rsatdi.
**F-0802-07 mezon + Mentor** (`PmLesson4.jsx:1114-1115`): sarlavha «Qaysi sayt ko'proq **mijoz olib keladi**?» → «ko'proq **chipta sotadi**?» (foydalanuvchi: «bolalar uchun aniqroq»). Mentor «Savdo markazidagi kinoteatr sayt ochdi…» — sun'iy dekor + savolni sarlavhadan keyin TAKRORLARDI → «Tasavvur qiling: bitta kinoteatr uchun ikkita turli sayt tayyorlandi. Quyida har birida nima borligi yozilgan — o'qing va sizningcha ko'proq chipta sotadiganini tanlang.» Foydalanuvchi matnidan chetlanish: savol Mentorda takrorlanmadi, o'rniga **harakat** berildi (99-qonun: ko'rsatma bir joyda). Sarlavha ham mezonga tenglashtirildi — aks holda sarlavha «mijoz», Mentor «chipta» derdi.
**F-0802-08 A-sayt kulgili qilindi** (`HOOK_LISTS`): «fon musiqasi» → «**baland** fon musiqasi» · «aylanadigan logotip» → «aylanadigan **katta** logotip» · «biz haqimizda uzun matni» → «**5 sahifalik** «biz haqimizda»» + yangi band «✨ **miltillaydigan animatsiya**».
**F-0802-09 B-saytga «⭐ bugungi mashhur filmlar»** qo'shildi (foydalanuvchi taklifi).
**🔴 Ikki chetlanish (foydalanuvchiga aytilgan, tasdiqlandi «ha to'g'ri qilibsan»):** (1) foydalanuvchi «aylanadigan logotip»ni «miltillaydigan animatsiya»ga **almashtirishni** so'radi — ikkalasi ham qoldirildi, chunki «aylanadigan logotip» darsning keyingi joyida **ip bo'lib qaytadi** (`:1258` sudrash-kartasi va `:1331` butun bir test savoli «…kartasi javonda qoldi. Nima uchun?»); olib tashlansa test o'quvchi ko'rmagan narsaga ishora qilardi. (2) Faqat B-ga band qo'shilsa **3↔4** bo'lardi — yonma-yon ovoz-kartada B ko'zga kattaroq ko'rinib, bola bandlarni **o'qimasdan** to'g'ri javobni ilg'ardi va hookning butun puli yo'qolardi; shuning uchun A-ga ham to'rtinchi band qo'shildi → **4↔4**.
**F-0802-10 payoff qayta yozildi:** 3 ta «bilmaslik» tiqilgan bitta uzun gap → sarlavha-qator + **strelkali juftliklar** (`HOOK_PAYOFF` massivi: Seans jadvali → «Film qachon boshlanadi?» · Zal xaritasi → «Bo'sh joy bormi?» · Mashhur filmlar → «Qaysi filmni tanlasam?» · Onlayn chipta → «Chiptani qayerdan olaman?») + yopuvchi qator. Foydalanuvchi matnidan chetlanish: «Har bir **feature** bitta **muammoni** hal qiladi» o'rniga «har bir **band** bitta **savolga** javob beradi» — *imkoniyat (feature)* atamasi bu darsda 1-ekranda (`:1159`) beriladi, hookda hali yo'q (hodisa avval, atama keyin).
**Darvozalar:** esbuild toza ✅ · `lint:til` **0 error** (2 warn — `:1487`/`:2297` dagi eski kirill-homoglif, bu tahrirga aloqasi yo'q, alohida raundga) ✅ · `lint:prompt` 0 topilma ✅ · keyingi ekranlardagi ip-havolalari tekshirildi: «aylanadigan logotip» ✅ · «fon musiqasi» ✅ saqlanib qoldi.
**Qonunlashtirish:** `MATN_KORPUS.md` → **67-bo'lim** (hook-solishtiruvining to'rt qoidasi: aniq mezon · Mentor savolni takrorlamaydi · kulgili qarama-qarshilik sifat bilan kuchaytiriladi · strelkali payoff + hookda atama taqiqi). `PM_DARS_ETALON.md` → **104-qonun** (yonma-yon ikki ro'yxat teng sonli va teng «og'irlikda»; hookdagi ipni almashtirmaslik sharti). UNCOMMITTED.

## 2026-08-02 — F-0802-13: PmLesson4 5-EKRANI — 7 BLOK → 4 (106-qonun) — ✅
**Kelib chiqishi:** foydalanuvchi ekrandagi bloklarni SANADI: «sarlavha ✅ subtitle ❓ 3 dropzone ✅ kartalar ✅ "Javonda qoladi" ❓ yashil xabar ✅ yana bir eslatma ❓ — bir vazifa uchun 6-7 UI bloki. Aslida vazifa juda oddiy: kartani mos muammoga olib bor, shu xolos».
**Olib tashlandi (o'quvchi ekranidan 3 blok):** (1) sarlavha ostidagi subtitr «Avval imkoniyat kartasini oling, so'ng mos qiyinchilik qatoriga qo'ying» — sarlavhani boshqa so'z bilan qaytarardi (99-qonun takrori); (2) 🔴 **`mt-shelf` («🗄 Javonda qoladi») zonasi** — u `doneAll` tekshiruviga KIRMAS edi, ya'ni ekranda joy va e'tibor olib, hech qanday ish so'ramaydigan zona turardi; ortiqcha karta endi shunchaki kartalar orasida qoladi va o'quvchi buni KO'RADI; (3) eng pastdagi «Kartani o'qing va o'zingizga savol bering…» — vazifa tugagandan keyin o'qiladigan maslahat, ya'ni hech kim o'qimaydi.
**Saqlandi va qisqartirildi:** yashil natija-xabari — u YANGI bilim beradi. Ikki paragrafdan bittaga: «"Aylanadigan logotip"ga joy topilmadi — u hech qanday qiyinchilikka javob bermaydi.»
**⭐ juftlik-muhokamasi YO'QOTILMADI**, `MentorNote` ga ko'chirildi — u faqat `live.mode === 'mentor'` da va yig'ilgan chip holida chiqadi, ya'ni o'quvchi ekraniga **nol blok** qo'shadi. Jonli darsdagi og'zaki mashq saqlanib qoldi.
**F-0802-13b kartalar «tekis chip»dan haqiqiy kartaga:** yangi `.mt-card` (ikona 30px + qalin nom + bir qator tavsif, radius 14, ko'tarilgan soya, hover'da `translateY(-2px)`). Tavsif kartaning O'ZI nima ekanini aytadi, qaysi qiyinchilikni yopishini AYTMAYDI («Seans jadvali — qaysi film qaysi soatda»), aks holda juftlash ishi kartaning ustida bajarilib bo'lardi. Qatorga tushgach ixcham `.mt-chip.in` ga aylanadi — kichrayish «joyiga o'tirdi» degan javob.
**🔴 Zona olib tashlanishining ergashuvchi ta'siri (residue-grep bilan tutildi):** «javon» — dars bo'ylab ketadigan metafora edi. 3 ta matn qayta yozildi: 5-savol («javonda qoldi» → «joy topilmadi», emoji qo'shildi), uning `explainWrong[3]` i, va RECAPS kartasi (668-qator: «Javonda nima qoladi» → «Nega bir kartaga joy topilmadi»). 10-ekrandagi javon-mexanikasi TEGILMADI — u yerda javon haqiqiy ish so'raydi (`doneAll` uni sanaydi), endi metafora bir marta va aynan funksional joyda chiqadi. O'lik CSS (`.mt-shelf`, `.mt-shelf-lbl`, `.mt-shelf .mt-chip.in`, `holding .mt-shelf`, reduced-motion yozuvi) tozalandi — `mt-shelf` qoldig'i **0**.
**Darvozalar:** esbuild toza ✅ · `vite build` toza ✅ · `lint:til` 0 error ✅ · residue-grep `mt-shelf|dropShelf` = 0 ✅.
**Qonunlashtirish:** `PM_DARS_ETALON.md` → **106-qonun** (ekran-blok budjeti: 4 blok; nima o'chiriladi — sarlavha takrori · ko'rinib turgan narsani aytuvchi blok · ish so'ramaydigan zona · vazifadan keyin o'qiladigan maslahat; nima qoladi — yangi bilim beruvchi natija; yo'qotilgan pedagogika `MentorNote` ga) va **106b** (sudraladigan narsa ushlanadigan ko'rinsin; tavsif javobni bermasin). UNCOMMITTED.

## 2026-08-02 — F-0802-14: 60-QONUN NIHOYAT TARQATILDI (105+73 fayl) — ✅
**Kelib chiqishi:** foydalanuvchi skrinshot berdi (`feedback/F-0802-14-kartalar-siqilishi.png`, zoom 100%, PmLesson4 keys-ekrani, mentor rejimi): bashorat-kartasining variant-chiplari **yarim balandlikda kesilgan**, ostidagi slayd-karta ustiga chiqib kelgan. Talab: «cardlar umuman siqilmasin, bemalol pastga skroll bo'lsa bo'lsin, lekin komponentlar siqilmasin».
**Tashxis:** `.stage-content` da `overflow-y: auto` bor (skroll shu yerda bo'lishi kerak), lekin `.screen { flex: 1; min-height: 0 }` va uning bolalari standart `flex-shrink: 1` — kontent sig'maganda brauzer skroll OCHMAY, bloklarni **siqadi**; kartalarda esa `overflow: hidden` bor → siqilgan joy skroll bo'lmay **qirqiladi**.
**🔴 ASOSIY TOPILMA — bu yangi nuqson EMAS:** yechim repoda allaqachon bor edi va **60-qonun** (2026-07-25, F-0725-04) sifatida to'liq yozilgan. Ammo **tatbiq atigi 6 faylda** qolib ketgan — aynan etalon fayllarda (`PmLesson1 · PmLesson2 · PmLesson6 · PmJtbd · PmMetrics · PmUserStory`). Qolgan 105 dars nuqson bilan yashagan. Ya'ni qonun **hujjatda bor, mahsulotda yo'q** edi.
**Tatbiq — (a) bandi, 105 fayl:** `.screen { flex: 1 }` → `flex: 1 0 auto` + yangi `.screen > * { flex-shrink: 0; }` (etalondagi izoh bilan). Endi kontent sig'masa bloklar siqilmaydi, `.stage-content` skroll beradi.
**Tatbiq — (b) bandi, 73 fayl:** zum formulasi `Math.min(1.5, Math.max(1, innerWidth/1920))` → `...Math.min(innerWidth/1920, innerHeight/1000)`. Bu foydalanuvchining «zoom 100% da» dalilining ILDIZI: keng-u past ekranda ilova o'zini 1.5× kattalashtirib, vertikal joyni O'ZI yeb qo'yardi va toshishni kafolatlardi.
**🔴 Yo'lda qilingan xato (o'z vaqtida tutildi):** almashtiruvga `// F-0725-04 · 60-qonun(b): …` izohi qo'shilgan edi. `--lz` kodi **bir qatorli o'q-funksiya** ichida (`const upd = () => { const z = …; document.documentElement.style.setProperty(…); };`) — `//` qatorning QOLGANINI kommentga aylantirdi va `setProperty` chaqiruvi yo'qoldi. esbuild darhol fosh qildi: **72 fayl sindi**. Izoh olib tashlanib qaytarildi. **Sabot:** bir qatorli funksiya ichiga `//` izoh qo'shilmaydi — izoh qatordan OLDIN alohida turadi (CSS bloklarida bu xavf yo'q, JS bir-qatorliklarida bor).
**Darvozalar:** esbuild **127/127 toza** ✅ · `vite build` toza (1.50s) ✅ · qamrov-o'lchovi: `.screen > *` **111/111** · `.screen { flex: 1 0 auto }` **111/111** · eski `.screen { flex: 1;` qoldig'i **0** · `innerHeight / 1000` **79/79** · eski zum-formulasi qoldig'i **0** · dublikat `.screen > *` **0** ✅ · `lint:prompt` 0 ✅.
**Qonunlashtirish:** `PM_DARS_ETALON.md` 60-qonunga yangi **(c) bandi** — qamrov yopilgani + **dars-qonuni: «qonun yozilishi = tatbiq EMAS»**. Har platforma-darajasidagi qonun uchun jurnalga qamrov-sanog'i («N/M faylda») yoziladi; auditor qonunni «hujjatda bormi?» emas, «**necha faylda bor?**» deb tekshiradi.
**Uy-tartibi:** foydalanuvchi rasmi `src/2-Modull/image.png` dan `feedback/F-0802-14-kartalar-siqilishi.png` ga ko'chirildi (`src/` — manba papka, rasm u yerda turmaydi). UNCOMMITTED.

## 2026-08-03 — F-0802-17: PmLesson4 8-EKRANI + BUTUN DARS BO'YLAB YORDAMCHI-MATN TOZALOVI (106c-qonun) — ✅
**Kelib chiqishi:** foydalanuvchi 8-sahifaga «8/10» qo'ydi: «interaksiya yaxshi, checkbox ishlaydi, lekin sahifa hali ham nafas olmayapti» + strategik ko'rsatma: «Agar bu elementni olib tashlasam, o'quvchi vazifani baribir tushunadimi? Ha bo'lsa → olib tashlang… Whitespace ham dizayn elementi (Apple, Linear, Notion, Raycast, Arc)».
**F-0802-17a Mentor matni:** zaxira-tarmoq «**Sizda saqlangan yozuv topilmadi**, shuning uchun…» deb boshlanardi — foydalanuvchi: «bu backend xatosiga o'xshaydi, o'quvchi o'qimaydi ham». → «Boshlash uchun kinoteatr misolidan foydalanamiz — quyidagilar sizga tanish. Keyingi ekranda ularga imkoniyat yozasiz.» Ikkala tarmoq (yozuv bor/yo'q) endi **bir xil shaklda** va Mentor ish-buyrug'ini TAKRORLAMAYDI (u sarlavhada) — u ro'yxat qayerdan kelganini va keyin nima bo'lishini aytadi.
**F-0802-17b progress:** «0/3 belgilandi» mayda kulrang mono-yozuv edi → `○ / ✓` belgisi + katta raqam (`clamp(16px,2vw,19px)`), tugagach **yashilga** o'tadi. 🔴 Yashil ATAYLAB faqat progressda: 12-qatordagi dars-semantikasi bo'yicha yashil = IMKONIYAT, amber = QIYINCHILIK; qatorlar esa qiyinchilik — shuning uchun qator-tanlovi **binafsha** (accent) qoldi. Foydalanuvchi «check yashil» degandi — sabab tushuntirilgan holda chetlanildi.
**F-0802-17c tanlov sezilarli:** butun qator allaqachon `<button>` edi (foydalanuvchi «checkbox juda oddiy» degani — VIZUAL muammo, funksional emas). Endi tanlanganda fon + 2px halqa + ko'tarilgan soya + `translateY(-1px)` birga o'zgaradi, belgi esa `pk-pop` bilan «chiqib» keladi (reduced-motion ro'yxatiga qo'shildi).
**F-0802-17d — DARS BO'YLAB IPUCHA TOZALOVI (7 → 1):** foydalanuvchi qoidasi butun faylga yuritildi. Olib tashlandi: (1) «Qaysi biri sizni ko'proq qiynaydi…» — instruksiya, foydalanuvchi ko'rsatgan; (2) «Bosilgan karta yana bosilsa yopiladi» — element affordansidan ko'rinadi, Mentor allaqachon «bosing» deydi; (3) 10-ekrandagi «Kinoteatr egasi… Har bandni bosing» + «Bandni o'qib… so'rang» — **ikkita** ipucha bitta **Mentorga** birlashtirildi (o'sha ekranda Mentor umuman yo'q edi; sahna + USUL qoldi, «bosing» ketdi); (4) «⭐ To'rtinchi bandni qo'shing» → `MentorNote` (ixtiyoriy topshiriq, o'quvchi ekranida blok egallardi); (5) uy-vazifa kartasidagi «Yangi qiyinchilik topolmasangiz — uydagi birortasidan so'rang» — vazifadan keyingi maslahat, ustida `.hw-note` allaqachon qisqa variantni beradi. **QOLDI:** ustaxonadagi «Bitta savolga javob bering: shu odam saytga kirdi — endi u nima qila oladi?» — u USUL o'rgatadi va o'sha ekranda yagona yo'l-yo'riq.
**Darvozalar:** esbuild toza ✅ · `vite build` toza (1.54s) ✅ · `lint:jsx` 0 ✅ · `lint:til` 0 error ✅ · `lint:prompt` 0 ✅.
**Qonunlashtirish:** `PM_DARS_ETALON.md` → **106c-qonun** (olib tashlash testi; qoladigan ikki toifa — yangi bilim va holat-ko'rsatkichi; olib tashlanadigan to'rt toifa; **bo'sh joy — dizayn elementi, to'ldirish taqiq**; bir ekranda bitta yo'l-yo'riq manbasi; tekshiruv usuli — `className="hint"` sanog'i). `MATN_KORPUS.md` → **69-bo'lim** (zaxira-tarmoq tizim-xatosidek eshitilmasin: yo'qlik haqida gapirma, ikkala tarmoq bir xil shaklda, Mentor buyruqni takrorlamaydi + grep).
**⏸ To'xtatilgan ish:** qirqilish-auditi (F-0802-16) va A/B/A+B qarori foydalanuvchi javobini kutmoqda. UNCOMMITTED.

## 2026-08-03 — F-0803-01: PmLesson4 USTAXONA EKRANI — «subtract, don't add» + yozuvga JAVOB (106d-qonun) — ✅
**Kelib chiqishi:** foydalanuvchi ustaxona (juftlik yozish) ekranini tahlil qildi: «bu sahifa yozish mashqi, ammo feedback yo'q… ko'z bir vaqtning o'zida progressga, formaga, namuna blokiga, qoidalarga boryapti — aslida faqat forma va Saqlash tugmasiga borishi kerak».
**🔴 Tashxis-aniqligi:** feedback aslida BOR edi (takror-tekshiruv, sifat-so'z, dublikat, juda qisqa), lekin u (a) faqat XATO holatlarni aytardi va (b) faqat ikkala maydon to'lganda chiqardi. To'g'ri yozgan o'quvchi hech qanday javob olmasdi — «feedback yo'q» hissi shundan. Ya'ni muammo yo'qlik emas, **bir tomonlamalik** edi.
**Olib tashlandi (3 blok):** (1) `📋 Namuna` akkordeoni — misol endi imkoniyat maydonining **placeholder'ida** (`Masalan: film vaqtini ko'rsatadi`), alohida blok talab qilmaydi; (2) `.chk` — uchta qoida ro'yxati («Har kartada…», «Imkoniyat…», «Uch karta…») — foydalanuvchi: «bular dars emas, bu documentation»; (3) ost-ipucha «Bitta savolga javob bering…». **O'sha bilim yo'qolmadi** — u endi o'z vaqtida, yozayotganda javob-qatoridan chiqadi.
**Qo'shildi — yozuvga JAVOB (`.swed-fb`):** xato bo'lsa `🤔` + savol (binafsha), hammasi joyida bo'lsa `✅` + tasdiq (yashil). Yangi tekshiruv: dars O'ZI «foydasiz» deb ko'rsatgan bandlar (`musiq|logotip|animatsi|rang|fon|bayram|effekt|chiroy|dizayn` + ruscha juftligi) — o'quvchi shuni yozsa: «Bu qaysi qiyinchilikni yo'qotadi?». ⚠️ Bu **qoida-tekshiruvi, sun'iy intellekt EMAS** — kod ma'noni tushunmaydi, lekin dars o'rgatgan naqshni taniydi; foydalanuvchining «Musiqa qo'yadi → 🤔» misoli aynan shunday ishlaydi. Til-regexlar modul darajasiga, `FLAT_UZ/FLAT_RU` yoniga qo'yildi (aralash-yozuv uchun ajratilgan zona).
**Progress qayta qurildi:** «1—2—3» ulangan chiziq uch qadamni TENG ko'rsatardi. Endi uch holat uch xil: bajarilgan (yashil ✓) · hozirgi (binafsha, to'liq) · kutayotgan (**xira, opacity .45**). Ulovchi chiziqlar (`.jws-line`) olib tashlandi — holat-rangi ularsiz ham «yana bittasi qoldi» deb aytadi.
**Saqlash tugmasi:** doim katta va O'CHIQ turardi (ko'zni tortardi, ish esa formada) → endi **faqat ikkala maydon to'lganda** chiqadi. `«0/2 maydon to'ldi»` hisoblagichi ham olib tashlandi.
**Mentor:** uch juftlikda uch marta bir xil gapni aytardi → endi **faqat 1-qadamda** (tahrirlashda ham chiqmaydi).
**O'lik kod tozalandi:** `SAMPLES` (3 yozuvli massiv) · `sampleOpen` state · `filledN` · `const sample` · CSS: `.sample*`, `.chk*`, `.swed-cnt`, `.swed-hint`, `.jws-line*`, `.swed-save:disabled`. Bandle 462.2 → **458.1 kb**. Residue-grep: hammasi **0**.
**Darvozalar:** esbuild toza ✅ · `vite build` toza (1.58s) ✅ · `lint:jsx` 127 fayl 0 topilma ✅ · `lint:til` 0 error (3 warn — hammasi til-regex zonasida: `FLAT_RU`, `DECOR_RU`, eski) ✅ · ekranda `hint` bloklari **0** ✅.
**Qonunlashtirish:** `PM_DARS_ETALON.md` → **106d-qonun** — yozish-mashqi javobsiz qolmaydi: (a) javob ikki tomonlama, (b) forma ostida va darhol, (c) qoida-asosida + darsning o'z lug'atidan, (d) ko'rsatma-bloklar javob bilan almashtiriladi (namuna → placeholder), (e) tugma ish tayyor bo'lgandagina, (f) Mentor bir marta, (g) progress uch holatni uch xil ko'rsatadi + **nazorat savoli: «o'quvchi qayerga qarashi kerak?» — javob bitta joy bo'lmasa, ortiqcha element bor**.
**⏸ Kutayotgan:** qirqilish-auditi (F-0802-16) — foydalanuvchi «keyin aytaman» dedi. UNCOMMITTED.

## 2026-08-03 — F-0803-02: PmLesson4 «ORTIQCHASINI TOPING» ekrani — akkordeon ikki narsaga tushdi + «javon» → «keraksizlar» (106e-qonun) — ✅
**Kelib chiqishi:** foydalanuvchi 11-sahifaga «7/10» qo'ydi: «g'oya yaxshi, lekin foydalanuvchining diqqati vazifadan chalg'iyapti… akkordeon ochilganda sariq strip, binafsha tugma, explanation, yashil border — hammasi bir vaqtda. Aslida foydalanuvchi faqat bitta narsani bilishi kerak: bu band foydalimi yoki yo'qmi?»
**Akkordeon 4 element → 2:** ochilganda endi faqat **bitta hukm + bitta harakat** qoladi. `cl-note` (uzun izoh + muhokama-savoli) butunlay olib tashlandi; ogohlantirish (`cl-warn`) faqat tuzoqqa tushilganda chiqadi. Hukm belgi bilan boshlanadi: `❌ Qaysi qiyinchilikni yo'qotishi yozilmagan` (90+ belgidan **38** ga).
**Muhokama-savoli yo'qolmadi** — `MentorNote`ga ko'chdi: «"Zamonaviy ko'rinsin" chiqqanda so'rang: buni qanday qilib aniq bitta qiyinchilikka bog'lasa bo'ladi?»
**🔴 «Javon» → «Keraksizlar» (butun dars bo'ylab):** foydalanuvchi: «bu nom unchalik intuitiv emas». Metafora ishlashi uchun avval o'zi tushuntirilishi kerak edi — ya'ni nom ekranga yana bitta blok qo'shardi. Yangi nom hukmni o'zi aytadi. Tugma ham **harakatdan qarorga** o'tdi: «🗄 Javonga chiqarish» → «🗑 **Bu kerak emas**» (o'quvchi aynan shuni o'ylayapti). **Qamrov — 9 joy:** zona yorlig'i · tugma · nav-yorlig'i (`Keraksizini toping (n/2)`) · 3-savol `explainCorrect` (uz+ru) · mentor-savollari banki · uy-vazifa (2 joy) · fon-bezagidagi suzuvchi so'z · RECAPS ikonasi · mentor-statistika yorlig'i · 🗄 ikonasi (4 joy → 🗑/❓). Residue-grep: `javon|полк|🗄` — o'quvchi matnida **0**.
**Mentor qisqartirildi:** «Kinoteatr egasi beshta imkoniyat so'radi. Har bandni o'qib, o'zingizdan so'rang: buni o'qigan odam nimadan qutuladi? Javob topilmasa — o'sha band javonga.» → «**Har bir bandga bitta savol bering: bu odamni nimadan qutqaradi? Javob topilmasa — u kerak emas.**» (sahna-tafsiloti kesildi, darsning asosiy qoidasi qoldi).
**Natija-xabari bitta qatorga:** «✅ Ro'yxat tozalandi — uch band qoldi, ikkitasi javonda» → «✅ **3 ta foydali band qoldi**».
**Saqlab qolindi (ataylab):** «Bu kerak emas» tugmasi to'g'ri bandlarda ham turadi — bu **tuzoq**, `MentorNote`da yozilganidek «tuzoqqa tushish xato emas — aynan shu lahza dars mavzusi». Foydalanuvchi tugmani shartli olib tashlashni taklif qilgan edi («agar kartaning o'zini bossa bo'lsa»), lekin karta bosilishi akkordeonni ochadi — tugma yagona harakat yo'li; foydalanuvchining o'z maketi ham tugmani saqlagan.
**O'lik kod:** `.cl-note` CSS + reduced-motion yozuvi, `note` maydonlari (2 ta). Bandle 458.1 → **456.3 kb**.
**Darvozalar:** esbuild toza ✅ · `vite build` toza (1.59s) ✅ · `lint:jsx` 127 fayl 0 ✅ · `lint:til` 0 error (3 warn — til-regex zonasi) ✅ · `lint:prompt` 0 ✅ · residue-grep eski nom **0** ✅.
**Qonunlashtirish:** `PM_DARS_ETALON.md` → **106e-qonun** — foydalanuvchi fosh qilgan naqsh: kurs bo'ylab «Ko'rsatma → Eslatma → Ipucha → Namuna → Qoida → Javob» (olti qatlam) **uchga** tushiriladi: **KO'RSATMA → VAZIFA → JAVOB**; qolgan qatlamlar 1 yoki 3 ichiga singdiriladi; ochiladigan blokda **ikki narsadan ortiq bo'lmaydi** (hukm + harakat). `MATN_KORPUS.md` → **70-bo'lim** (zona nomi o'zini tushuntirsin; tugma harakatni emas QARORNI yozsin; nom o'zgarsa butun dars bo'ylab + residue-grep) va **71-bo'lim** (hukm qisqa va belgili; «nega shunday» MentorNote'ga). UNCOMMITTED.

## 2026-08-03 — F-0803-03: PmLesson4 REFLEKSIYA ekrani — 3 blok → 1 vazifa + «aha» yakuni (106f-qonun) — ✅
**Kelib chiqishi:** foydalanuvchi 14-sahifani ko'rdi va strategik KPI qo'ydi: «Bu sahifani **7 soniyada** tushunish mumkinmi? Agar o'quvchi 7 soniya ichida nima qilishini, qayerga bosishini va dars nimani o'rgatayotganini tushunmasa — sahifada ortiqcha UI yoki matn bor».
**Olib tashlandi:** (1) «① Sherigingizga ayting» kartasi — 🔴 Mentor buni AYNAN aytardi («Ekranga qaramasdan sherigingizga ayting… so'ng shu gapni bir qatorga yozing»), ya'ni karta uni ikkinchi marta takrorlardi; (2) «③ Sinf bilan: qo'l ko'taring» + 3 ta savol — bu mentor ish-tartibi, o'quvchi ekranida joyi yo'q → `MentorNote`ga (mavjud eslatmaga qo'shildi). Natijada ekranda **bitta vazifa** qoldi: yozish maydoni. `①②③` raqamlashi ham ketdi (bitta qadam raqam talab qilmaydi).
**Qo'shildi — «AHA» yakuni (`.rf-aha`):** o'quvchi YOZGANDAN keyin chiqadi (oldindan emas — aks holda u ko'rsatma bo'lib qolardi, mukofot emas). Ikki qator: «🎉 Ajoyib! Endi siz **imkoniyatni emas, qiyinchilikni** o'ylaydigan bo'ldingiz.» + «🎯 **Bugungi qoida:** har bir imkoniyat bitta qiyinchilikni yo'qotishi kerak.» Foydalanuvchi matni dars lug'atiga moslandi («feature/muammo» → «imkoniyat/qiyinchilik», dars boshidan shu juftlik ishlatiladi). Vizual: aksent→yashil gradient, seriflik sarlavha-shrifti — darsda **yagona** shunday blok, chunki u yakuniy nuqta.
**O'lik kod:** `.rf-split` (+media), `.rf-say`, `.rf-say-t`, `.rf-lbl`, `.rf-asks ul/li/li::before` — residue 0. `CLASS_ASKS` massivi saqlandi, endi u MentorNote matnini quradi.
**Darvozalar:** esbuild toza ✅ · `vite build` toza (1.47s) ✅ · `lint:jsx` 127/0 ✅ · `lint:til` 0 error ✅.
**Qonunlashtirish:** `PM_DARS_ETALON.md` → **106f-qonun**: (a) **7 soniya testi** qabul KPI si sifatida — uch savol (nima qilaman · qayerga bosaman · dars nimani o'rgatyapti), biri javobsiz qolsa ekran topshirilmaydi (106c elementni tekshiradi, 106f EKRANNI); (b) refleksiya ekrani **mukofot** bilan yopiladi — tabrik (o'quvchida nima o'zgargani) + qoida-qatori, ikki qatordan oshmaydi, faqat vazifadan keyin; darsdagi yagona kattaroq/iliqroq blok; (c) sinf-faoliyati (qo'l ko'tarish, navbat bilan aytish) o'quvchi ekranida yashamaydi → `MentorNote`. Etalon-mezon: Duolingo · Brilliant · Linear — kam, katta, ma'noli ta'sirlar.
**📌 Foydalanuvchi sanagan 5 takroriy xato — qaysi qonun yopadi:** (1) bo'sh joyni matn bilan to'ldirish → 106c · (2) bir g'oyani 3 marta aytish (Mentor+ipucha+qoida+javob) → 106e · (3) sahifada juda ko'p blok → 106 (4-blok budjeti) · (4) instruksiya documentationga o'xshashi → 106d(d) · (5) diqqat 5 joyga bo'linishi → 106d(g) nazorat savoli + 106f(a). Foydalanuvchi «eng keraklisi Mentor va puls» dedi — ikkalasi ham saqlanadi. UNCOMMITTED.

## 2026-08-03 — F-0803-04: PmLesson4 YAKUN-TUZILMASI ETALONGA QAYTARILDI (19 → 17 ekran) — ✅
**Kelib chiqishi:** foydalanuvchi: «darsni oxirgi strukturasi juda buzulibti, axir PmLesson2 da bunaqa emasku: kompilyatordan keyin g'oliblar e'lon qilingan, keyin flashcard, undan keyin CodeStrike va uyga vazifalar. Daje UserStory darsdayam CodeStrike va uyga vazifa bitta pageda. 15- va 15-dan keyingi pagelar juda xunuk holatda».
**Tashxis (uch dars yonma-yon):** `PmLesson2` — koding→stats→flashcards→summary · `PmUserStory` (P0) — homework→podium→summary, CodeStrike+uyga vazifa **summary ICHIDA** · `PmLesson4` — koding→test→reflection→**homework(alohida)**→stats→**arena(alohida)**→flashcard→summary. Ya'ni uy-vazifa va CodeStrike alohida ekranga ajratilgan, flashcard esa arenadan KEYIN qolgan.
**Tuzatildi:** `s14` (homework ekrani) va `s16` (arena ekrani) `SCREEN_META` dan olib tashlandi; ikkovining mazmuni `ScreenSummary` ichiga qaytarildi (CodeStrike CTA — hero'dan keyingi birinchi harakat; uyga vazifa — RECAP bilan `split` da yonma-yon). Yakuniy tartib: **koding → test → refleksiya → 🏆 G'OLIBLAR → 🃏 FLASHCARD → ⚔️ CodeStrike + 📝 uyga vazifa**. Ekranlar **19 → 17**.
**🔴 Indeks-siljish xavfi tekshirildi (DARS_ETALON 4-bo'lim, ma'lum bug-sinfi):** `INLINE_KEYS` **id** bo'yicha ishlaydi (`s3·s5·s9·s12`) — tegilmadi; `SCORED_IDX` `SCREEN_META` dan hosil bo'ladi — avtomatik; `Q_LABELS` indekslari **3·5·9·12** — hammasi 14-dan OLDIN, siljimadi; `FLASH_IDX` `findIndex(id==='s17')` — id saqlangani uchun ishlaydi; `PRACTICE_BASE + screen` — praktika ekranlari 8/10/13, siljimadi. 📌 **`id` lar ATAYLAB o'zgartirilmadi** (s14/s16 raqamlarida uzilish qoldi): id jonli-server yozuvlariga (`submitAnswer`) kalit bo'ladi, ularni qayta raqamlash eski sessiya-yozuvlarini buzardi. Uzilish faqat kosmetik.
**O'lik kod:** `ScreenArena` komponenti (31 qator) · `Screen14` komponenti (52 qator) · `HW_TOKENS` · CSS bloki `.hw-big-wrap/.hw-big*/.hw-sky/.hw-tok` + `hw-aura/hw-fire/hw-shine` keyframe'lari (19 qator) → o'rniga ixcham `.hw-open` tugmasi. Residue: `hw-big|hw-sky|hw-tok` — **0** (faqat izohda nom sifatida). `HW_ROWS`/`HW_STEPS` modul darajasiga chiqarildi. Bandle **456.3 → 417.5 kb**.
**Darvozalar:** esbuild toza ✅ · `vite build` toza (1.50s) ✅ · `lint:jsx` 127/0 ✅ · `lint:til` 0 error ✅ · 🔴 **brauzer-tekshiruvi:** ekran 13→16 birma-bir yuklandi, indikator **14/17 · 15/17 · 16/17 · 17/17**, sarlavhalar `YAKUNIY SO'Z · NATIJALAR · TAKRORLASH · TAYYOR`, yakun sahifasida CODE STRIKE va «📝 Uyga vazifa» birga ko'rindi, **sahifa-xatolari YO'Q** ✅.
**⚠️ TOPILDI, TUZATILMAGAN (foydalanuvchi qaroriga):** boshqa PM darslarida ham shu og'ish bor — `PmLesson6` (alohida `arena` + `homework` ekrani, PmLesson4 bilan bir xil naqsh) · `PmLesson5` · `PmJtbd` · `PmMetrics` (alohida `homework` ekrani). Etalonga mos: `PmLesson1` · `PmLesson3` (koding→test→stats→flashcard→summary) · `PmUserStory` (P0). UNCOMMITTED.

## 2026-08-03 — F-0803-05/06: 54-QONUN 106 DARSGA + YAKUN-TUZILMASI 4 DARSDA + TUZILMA-DARVOZASI — ✅
**Buyruq:** «ha albatta tuzat va qat'iy bunaqa kamchilik qayta takrorlanmasin… PmLesson2 da qara, CodeStrike ustida kichkina yozuv kerakmas deganman, ammo bu haliyam turibti nega? olib tashla va boshqa barcha darslarda ham».
**F-0803-05 — «Yaxshi harakat…» qatori (54-qonun), 106 fayl:** `PmLesson2` da izoh turibdi: «54-qonun (UserStory qarori bilan bir xil): h-sub qatori YO'Q — sarlavha o'zi yetadi». Ya'ni **qonun bor edi, 2 faylga qo'llanib qolgan**. Olib tashlandi: `<p className="body h-sub fade-up d2">{PASSED ? … : 'Yaxshi harakat! Bir-ikki joyni mustahkamlash uchun darsni qayta ko'ring.'}</p>` — **105 fayl** skript bilan (2 tasi ko'p qatorli), + `CssPractice.jsx` qo'lda (u `{tr(PASSED ? …)}` shaklida yozilgan, skript naqshiga tushmagan — **qamrov-sanog'i bilan tutildi**). Residue: «Yaxshi harakat» **0**, `h-sub fade-up d2` **0**.
**F-0803-06 — yakun-tuzilmasi, 4 dars:** `PmLesson6` (alohida `homework` + `arena` ekrani) · `PmLesson5` · `PmJtbd` · `PmMetrics` (alohida `homework`). Hammasida ortiqcha ekran olib tashlandi, mazmuni YAKUN sahifasiga ko'chdi. `PmLesson6` ga CodeStrike CTA qo'shildi + uy-vazifaning **variant-tanlovi** (to'liq/qisqa, localStorage «shartnoma») yakun-kartasiga ko'chirildi — o'quvchi qarori yo'qolmadi. 🔴 `PmLesson5` da yakun sahifasidagi `card hw` **uy-vazifa EMAS** edi (o'quvchining MVP-ro'yxati) — shuning uchun u yerga alohida uy-vazifa kartasi (2 variantli) qo'shildi; buni brauzer-tekshiruvi tutdi («Uyga vazifa: YO'Q» chiqdi).
**🔴 Indeks-siljish tekshiruvi (har fayl uchun alohida hisoblandi):** `PmLesson6` scored=[3,6,8,14], olinadi 15/17 → xavfsiz · `PmJtbd`/`PmMetrics` scored=[4,6,9], olinadi 14 → xavfsiz · **`PmLesson5` scored=[4,7,10,15], olinadi 14 → yakuniy test 15→14 ga surildi**, shuning uchun `Q_LABELS` kaliti `15:` → `14:` qilib tuzatildi. Bu yagona haqiqiy siljish edi va u faqat oldindan hisoblash tufayli tutildi.
**O'lik kod:** `PmLesson6`: `Screen15` (29 qator) + `ScreenArena` (30) · `PmLesson5`: `ScrHomework` (23) · `PmJtbd`: `Screen12` (54) · `PmMetrics`: `Screen12` (65).
**Darvozalar:** esbuild **127/127 toza** ✅ · `vite build` toza (1.46s) ✅ · 🔴 **brauzer-tekshiruvi (m2-02 · m2-07 · m2-13, yakun ekranida):** `17/17 · 18/18 · 18/18` · CODE STRIKE ✓✓✓ · «Uyga vazifa» ✓✓✓ · «Yaxshi harakat» yo'q ✓✓✓ · sahifa-xatolari **YO'Q** ✅.
**🔴 «QAYTA TAKRORLANMASIN» — ESLATMA EMAS, DARVOZA:** `jsx-lint.mjs` ga **3-tekshiruv guruhi** qo'shildi (chunki 2026-08-02/03 da «qonun yozilgan, tatbiq qilinmagan» holati **to'rt marta** takrorlandi: 60-qonun 6 faylda, 54-qonun 2 faylda qolgan edi). Yangi qoidalar: **(a)** `SCREEN_META` da alohida `type: 'arena'` ekrani — taqiq; **(b)** uy-vazifa IKKI joyda (alohida ekran + yakun-kartasi) — dublikat; **(c)** `SCREEN_META.length === screens.length` (indeks-siljish bug-sinfini mexanik tutadi); **(d)** yakun hero'sida `h-sub` tasalli-qatori — 54-qonun. Endi bu og'ishlar `npm run lint:jsx` da **xato** bo'lib chiqadi va CLAUDE.md darvozasidan o'tmaydi.
**🔴 DARVOZA DARHOL ISH BERDI — P0 ETALONIDA NUQSON TOPDI:** `src/pm/PmUserStoryLesson.jsx:373` — uy-vazifa **ikki joyda**: alohida `Screen12` ekrani (indeks 14) **va** yakun sahifasidagi kapsula (`hw-big-t` «Uyga vazifa» + CodeStrike CTA bir sahifada). Foydalanuvchi «UserStory darsda CodeStrike va uyga vazifa bitta pageda» deganida aynan YAKUN sahifasini nazarda tutgan; alohida ekran esa e'tibordan chetda qolgan. **P0 ga o'z-o'zicha tegilmadi** — u etalon-fayl, qarori foydalanuvchida. Shu sababli `lint:jsx` hozir **1 xato** bilan turibdi (holat halol ko'rsatilgan). UNCOMMITTED.

## 2026-08-03 — F-0803-07: PmLesson4 YAKUN SAHIFASI PmLesson2 TARTIBIGA KELTIRILDI — ✅
**Buyruq:** «17-pageda 📒 Juftliklaringiz umuman kerakmas — juftliklar kartasini ko'rishi shart emas. Dizaynni PmLesson2 day qilaylik: "Endi siz bilasiz" CodeStrike pastida, undan keyin "Uyga vazifa" tugmasi. Qolgan darslardayam shuni ta'minla.»
**Bajarildi (PmLesson4):** (1) «📒 Juftliklaringiz» kartasi olib tashlandi — o'quvchi juftliklarini ustaxona va sahifa-ekranlarida allaqachon ko'rgan, yakunda takror edi; (2) `split` buzildi: «Endi siz bilasiz» endi **to'liq enli**, uy-vazifa esa uning ostida; (3) F-0803-04 da qo'ygan ixcham `.hw-open` tugmasi **PmLesson2 kapsulasiga** almashtirildi (`hw-big` + suzuvchi dars-so'zlari `HW_TOKENS` + `hw-sky/hw-tok/hw-shine`), CSS bloki PmLesson2 dan so'zma-so'z ko'chirildi; (4) o'lik `mine`/`readFeatures` chaqiruvi yakundan olib tashlandi.
**Brauzer-tekshiruvi (`.screen` bolalari tartibi):** `hero → qz-cta.cs-cta → card «Endi siz bilasiz» → hw-big-wrap → card.ach-coll` — PmLesson2 bilan **aynan bir xil**; «Juftliklaringiz» yo'q; sahifa-xatolari **YO'Q**.
**Darvozalar:** esbuild toza ✅ · `vite build` toza (1.57s) ✅ · `lint:jsx` (PmLesson4) 0 ✅.
**📊 QOLGAN DARSLAR — O'LCHANDI, HALI TARQATILMAGAN:** yakun sahifasi bor **79 dars**dan faqat **3 tasi** etalon tartibda (`recap → kapsula`). Ustun naqsh — **64 dars**da `recap → hw-KARTA` (uy-vazifa kapsula-tugma emas, karta). Tuzilma bir xil: **88 faylda** `<div className="split">` ichida recap-kartasi + `<div className="card hw fade-up d4">` yonma-yon turibdi (3 fayl istisno: `CssPractice · GitLesson · HtmlPractice` — ularda recap yo'q). Tarqatish uchun har faylda: `split` ni buzish → recap to'liq enli → kapsula qo'shish → `openHw` holati + `HW_TOKENS` + kapsula CSS (hozir faqat 14 faylda `hw-big`, 5 faylda `HW_TOKENS` bor). Bu bugungi CSS-sweeplaridan farqli — **JSX tuzilma jarrohligi** (yopuvchi teglarni balanslash talab qilinadi), shuning uchun alohida, tekshiruvli raundga qoldirildi. UNCOMMITTED.

## 2026-08-03 — F-0803-08: YAKUN TARTIBI 91 DARSGA (PmLesson2 etaloni) + SMOKE DARVOZASI — ✅
**Buyruq:** «yaxshi barchasini yaxshila tuzat» (yakun sahifasi tartibi: CodeStrike → «Endi siz bilasiz» → «Uyga vazifa» tugmasi).
**Tashxis (o'lchov):** yakun sahifasi bor 79 darsdan **faqat 3 tasi** etalon tartibda edi. **88 faylda** recap va uy-vazifa `<div className="split">` ichida **yonma-yon** turardi; uy-vazifa esa kapsula-tugma emas, oddiy karta edi (`hw-big` faqat 9 faylda, `HW_TOKENS` 0 faylda).
**Tatbiq — 91 fayl:** `split` buzildi (recap **to'liq enli**) → `hw-big` **kapsula-tugmasi** qo'shildi → uy-vazifa kartasi `{hwOpen && …}` shartiga o'raldi (kapsula bosilganda ochiladi, 500 ms «zaryad» effekti bilan). Har faylga `HW_TOKENS` + kapsula CSS + `hwOpen/hwCharge/fireHw` holati qo'shildi. Skript har faylni **alohida esbuild bilan tekshirdi** va sinsa **o'zi qaytardi**.
**Skript qamramagan 6 fayl qo'lda yopildi (har biri o'z shaklida):** `PmLesson17` va `PmLesson21` (`<Zoomable><div className="split">` bir qatorda) · `FullSystemProjectLesson` (`.hw ul` CSS ilgagi yo'q — `.recap` ilgagi ishlatildi) · `DeployLesson` (uy-vazifa `{!isMentorL && …}` ichida) · `PmLesson6` (kartada izoh bor, ko'p qatorli) · `PmLesson5` — 🔴 u yerda **ikkita** `card hw` bor edi va **birinchisi uy-vazifa EMAS** (o'quvchining MVP-ro'yxati); sinfi `card` ga o'zgartirildi (linter yolg'on-ijobiy bermasin), kapsula esa haqiqiy uy-vazifa kartasiga qo'yildi.
**🔴 O'ZIM KIRITGAN JIDDIY XATO — brauzer-testi tutdi:** kapsula matnini `tr({uz,ru})` bilan yozdim, ammo **19 dars bir tilli** (`tr` yordamchisi umuman yo'q). Natija — `tr is not defined`, **oq ekran**. `esbuild` va `vite build` ikkalasi ham **TOZA** edi (bu ishga-tushish xatosi, sintaksis emas). PmLesson17/21 ni brauzerda ochganda chiqdi. Tuzatildi: 19 faylda `tr(...)` sodda satrga aylantirildi (`HW_TOKENS` ham). **Sabot:** bir naqshni N faylga yoyganda faqat kompilyatsiya emas, **tilga-bog'liqlik** ham tekshirilishi shart.
**🔴 IKKI YANGI DARVOZA:** **(1)** `lint:jsx` ga qo'shildi: **(c2)** `tr()` ishlatilgan-u faylda aniqlanmagan → xato (aynan yuqoridagi sinf); **(d)** yakun tartibi — uy-vazifa kartasi recap bilan `split` da bo'lsa xato. **(2)** Yangi **`npm run smoke`** (`_smoke.mjs`): **138 marshrutning HAMMASINI brauzerda ochadi**, `pageerror` va konsol-xatolarini yig'adi, bo'sh ekranni aniqlaydi. Sabab: bugun ikki marta oq-ekran nuqsoni foydalanuvchiga yetib bordi va ikkalasini ham esbuild/vite tuta olmadi — endi mexanik darvoza bor.
**Darvozalar:** esbuild **127/127 toza** ✅ · `vite build` toza (1.55s) ✅ · `lint:jsx` — tartib-topilmalari **0** (qolgan 1 xato: `PmUserStoryLesson` P0 dublikati, foydalanuvchi «hozircha tursin» dedi) ✅ · `lint:til` 0 error ✅ · `lint:prompt` 0 ✅ · 🔴 **`npm run smoke`: 138 dars tekshirildi, 29 nuqsonli — va aynan 29 tasi `comp:` bog'lanmagan bo'sh marshrut (hali qurilmagan darslar). HAQIQIY NUQSON: 0.** Ya'ni 109 ta real darsning hammasi xatosiz yuklanadi ✅.
**Brauzer-namunalari (yakun sahifasi tartibi):** `m1-01 · m2-01 · m2-02 · m3-01 · m4-01 · m5-01 · m6-01 · m1-11 · m2-07 · m2-13 · m4c-02 · m5-11 · m6-13` — hammasida `hero → qz-cta.cs-cta → card «Endi siz bilasiz» → hw-big-wrap → card.ach-coll`, kapsula bosilganda topshiriq kartasi ochildi ✓. UNCOMMITTED.

## 2026-08-03 — F-0803-24: P0 UY-VAZIFA IKKILANISHI TUZATILDI (etalon: yakun ichida) — ✅
**Kelib chiqishi:** `lint:jsx` darvozasi (F-0803-22 ishi paytida ko'rindi): `PmUserStoryLesson.jsx:373` — uy-vazifa IKKI joyda: alohida `s12` homework-ekrani + yakun-sahifadagi kapsula. Foydalanuvchi: «kecha/bugun ertalab darslarni qanday yaxshilagan bo'lsak, bu ham shunaqa bo'lsin».
**Etalon-naqsh:** JsFunctionsLesson (F-0803-08) — yakunda «Uyga vazifa» kapsulasi bosilganda topshiriq kartasi SHU sahifada ochiladi; alohida ekran yo'q.
**Qilindi:**
· `Screen12` (alohida ekran) → `HwTaskCard` komponenti: foydalanuvchi-tanlov chiplari + «✍️ o'z variantim» + 🗂 topshiriq kartasi (US-UY, 3 qadam) — hammasi saqlanib, yakun kapsulasi ostida ochiladi. Tanlov avvalgidek `HW_KEY` (localStorage)ga yoziladi.
· `SCREEN_META`dan `s12` olib tashlandi (17→16 ekran), `screens` ro'yxati, `SCREEN_INTENTS` (s12 niyati s16'ga qo'shildi), `BOARD_SCREEN_IDS` → faqat `s11` yangilandi.
· O'lik kod tozalandi (S33): `hw-cta-note` CSS + eski LMS-eslatma matni o'chirildi; `s12` izohlari yangilandi.
· Indeks-xavf tekshirildi: `SCORED_IDX`/`SUMMARY_IDX` dinamik, `hotspotAce` [4,6,9] s12'dan OLDIN — siljish yo'q.
**Darvozalar:** esbuild toza ✅ · `lint:jsx` — BUTUN repo 0 topilma ✅ · `lint:til` 0 ✅. UNCOMMITTED.

## 2026-08-03 — F-0803-25: m2-13 (PmLesson6) TMI-TOZALASH — ✅
**Kelib chiqishi:** foydalanuvchi: «UI keraksiz narsalar bilan to'ldirilgan; o'quvchi 7-10 soniyada sahifani yoqib tushunishni boshlashi kerak; har matn bo'lakchasiga savol bermaylik — tushunarli, kerakli bo'lmasa olib tashlash kerak». Etalon = kecha va bugun ertalab 6:30 gacha muhrlangan 108/109-qonunlar.
**Tashxis (kod bo'yicha, 18 ekran):** (1) har ekranda 3-4 qavat matn — ikki gapli sarlavha + `Mentor` + `MentorNote` + `frame-success`; (2) bir g'oya 3 marta (s1: sarlavha→mentor→mono-qator; s11: mentor+note+219 belgilik `takeaway` aynan mashq-g'alabasi yonida — F-0803-11/12 ga zid); (3) s5 keysida 5 slaydning 2 tasi taxmin-savoli, ustiga `ks-hook` + `frame-success` ketma-ket; (4) o'lchamaydigan dekor: s1 `Uline` (qat'iy 78→92), s12 `og-path` zanjiri; (5) s13 da bir ekranda ikki topshiriq (sherik-hukmi + reflektsiya-matni).
**Tuzatildi (PmLesson6.jsx, matn/tuzilma — mexanika va ball-kalitlariga TEGILMADI):**
· s0 sarlavha bir gapga, Mentor va MentorNote qisqardi, `hook-ack` bir gap · s1 mono-takror qatori va statik `Uline` o'chdi · s2/s4/s7 sarlavhalari harakat-gapga, kontekst Mentorga ko'chdi · s5: 5 slayd → 3, ikki taxmindan bittasi qoldi, `ks-hook` o'chdi (yopilish matni bitta) · s9 MentorNote 2 gapdan 1 ga · s11 `takeaway` bloki o'chdi · s12 `og-path` dekori o'chdi · s13 reflektsiya-maydoni endi shartli («yarim/tushunmadim» javobidagina), nav-yorlig'i rejimga mos («O'zingizni baholang» / «Sherik hukmini belgilang»).
· O'lik kod tozalandi (S33): `.ks-hook`, `.takeaway`/`.ta-bulb`/`.ta-h`, `.og-path`/`.og-step`/`.og-arr` CSS qoidalari.
**O'lchov (`node _tmi-shot.mjs m2-13`, 18 ekran, oldin → keyin):** s00 273→234 · s01 369→279 · s04 264→237 · s05 316→303 (slaydlar 5→3, dars bo'yicha yig'indi ancha kam) · s07 301→287 · **s11 522→354** · s12 349→289 · s13 187→154. Qolganlari o'zgarmadi; eng og'ir dars-ekrani endi 354 belgi (yakun 618 — istisno). Sahifa xatolari: 0.
**Muhrlandi:** `DARS_ETALON.md` 11-B → **109-qonun TMI OV-RO'YXATI** (6 sinf + `_tmi-shot.mjs` dasturiy tekshiruvi).
**Darvozalar:** esbuild toza ✅ · `lint:jsx` butun repo 0 topilma ✅ · `lint:til` PmLesson6 0 topilma ✅. UNCOMMITTED.

## 2026-08-03 — F-0803-22: m2-07 (PmLesson5) DARS O'TMAYDI — IKKI GATE-BUGI + TO'LIQ AUDIT — ✅
**Kelib chiqishi:** foydalanuvchi skrinshoti — 03/18-ekran («Bitta ish yoki oltita ish?»): sarlavha va
mentor bor, ostidagi maydon BO'SH, «Avval kartani bosing» tugmasi abadiy qulf. «dars o'tmayapti».
**Tashxis 1 — ko'rinmas gate-vidjet (yangi bug-sinfi):** `className="dc-big tap-hint-card fade-up delay-1"` —
`.fade-up` (`opacity:0` + `forwards`) va `.tap-hint-card` (`infinite`) ikkalasi ham `animation`
**shorthand**ini yozadi; CSS'da keyingi e'lon oldingisini butunlay yengadi, `fade-in-up` hech qachon
ishlamaydi va `opacity:0` abadiy qoladi. esbuild · lint:jsx · lint:til — hammasi TOZA, konsol jim edi.
**Tashxis 2 — bajarib bo'lmaydigan gate (12-ekran, kompilyator):** harness `out.split(/[·,|]+/)` bilan
`parts.length===3` talab qilardi, ipucha esa `natija = natija + nomlar[i]` deb aytardi — **ajratgichsiz**.
Ko'rsatmani TO'G'RI bajargan o'quvchi qamalib qolardi (mentor `isMentor`, jonli o'quvchi `optionalLive`
bilan o'tib ketgani uchun QA'da ko'rinmasdi).
**Tuzatildi (PmLesson5.jsx):**
· `.dc-stage` o'rovchi — `fade-up` endi o'ramda, puls tugmada; karta kattalashdi va bo'sh maydonda markazda (bo'shliq 70% muammosi, matn qo'shilmagan).
· `c3` mezoni ma'noga bog'landi: uchta v1-nomi bor va qolgan uchtasi yo'q — `|| parts.length===3` qo'shimcha yo'l bo'lib qoldi.
· `.dc-piece` + puls juft e'lon (`--fd` tokeni bilan kechikish juftlangan); reduced-motion bekor qilishi `!important` bilan tiklandi (media-blok kechroq e'lonlardan oldin turgani uchun ishlamayotgan edi).
· 88-qonun: s2 da bir vaqtda 6 karta pulsatsiya qilardi → faqat navbatdagisi.
**Rol-zanjir:** pm-auditor (18 ekran GAP: 48 PASS · 13 zaif · 11 buzuq) → pm-quruvchi (31-qonun mentor-baypas
s3/s5/s6/s11/s12/s13 ga; 100a «ball berilmaydi» va 73 kelajak-va'da qatorlari o'chdi; s8/s9 blok-diyeta 6-7→4,
backlog-glossi ustun-sarlavhasiga ko'chdi — arena Q4 tayanchi saqlandi) → pm-metodist (mentor ≤2 gap s0/s12;
47-qonun uch savol-sarlavha buyruq shakliga; hook-savoli 97a/97b bo'yicha qayta yozildi; DEMO_LIST ishchi
to'plamga birlashtirildi — 68-qonun) → pm-tekshiruvchi.
**Brauzer-tekshiruvi (playwright, 1280×720 va 1280×648):** 18/18 ekran renderlanadi · ko'rinmas gate-vidjet 0 ·
skrollsiz zonadan tashqari element 0 · konsol xatosi 0 · s2 kartasi ko'rinadi (opacity 1, 480×264) va gate ochiladi ·
c3 ipuchali (ajratgichsiz) kod bilan bajariladi. Ekran 2/13/18 dagi «ko'rinmas» signal 6s kutilganda yo'qoldi —
kechikuvchi animatsiya, yolg'on-signal.
**🔴 YANGI DARVOZA — `lint:jsx` 4-qoidasi:** bir elementda ikki `animation`-klass. Faqat XAVFLI holat tutiladi:
klass `opacity:0`+`forwards` bilan elementni OCHADI va uning ustidan keyinroq e'lon qilingan boshqa
animatsiya-klass yozadi (`.a.b` juft e'loni bo'lsa — tutilmaydi). `animation: none` (reduced-motion) e'tiborga
olinmaydi. Kalibrovka: dastlab 30+ yolg'on-signal berdi (`cs-off` kabi atayin bekor qiluvchi klasslar) — mezon
toraytirildi; CSS izohlari va ketma-ket qoidalar (`A{}B{}`) tahlili tuzatildi.
**🔴 SHU DARVOZA 4 TA BOSHQA DARSDA HAQIQIY NUQSON TOPDI** (xato javobda element ko'zdan yo'qolardi):
`HtmlTakrorlashLesson` (`.fade-up`+`.party-glow`) · `FullstackConnectPracticeLesson` · `FullstackProjectDayLesson` ·
`NestArchAliveLesson` (uchalasi `.fade-up`+`.shake`). Har biriga juft e'lon qo'shildi.
**Muhrlandi:** `DARS_ETALON.md` 12-bo'lim — ikki yangi bug-qatori (animatsiya-shorthand to'qnashuvi ·
gate-mezoni ipucha aytgan yechimni rad etishi).
**Foydalanuvchi qaroriga qoldi:** dars hali **lavash ipida** — JS darslarida RAD etilgan va M1-D2 bilan
to'qnashuvda (M2-D2 kino olamiga ko'chirilgan, M2-D7 ko'chirilmagan). Ip almashtirilsinmi?
**Darvozalar:** esbuild toza ✅ · `lint:jsx` butun repo 0 topilma ✅ · `lint:til` PmLesson5 0 topilma ✅. UNCOMMITTED.

## 2026-08-03 — F-0803-22 (davomi): MISOL-IP LAVASHDAN KINOTEATRGA + MODUL-KO'PRIGI TIKLANDI — ✅
**Foydalanuvchi qarori:** lavash ipi almashtirilsin. Boshda «o'yin klubi» tanlangan edi; keyin
`pm-m2d2-features` bog'liqligi ochilgach (M2-D2 = kinoteatr) **kinoteatr** tanlandi — 96-qonun
(modul-ipi) tiklanishi uchun. Endi M2-D2 va M2-D7 bitta olamda.
**Ip-taqsimoti (yangilangan):** M2-D2 = kinoteatr · **M2-D7 = kinoteatr (o'sha sayt davomi)** ·
JS oilasi = o'yin olami. Lavash BUTUNLAY chiqarildi (`grep "lavash|лаваш|🌯"` → 0).
**Yangi oltilik:** 🎬 Seanslar va narxlar · 🕒 Ish vaqti va manzil · 🎫 Chipta band qilish tugmasi
(v1) · 🍿 Bufet menyusi (v2) · 🎟 Chegirma kodi · ⭐ Tomoshabin sharhlari (backlog).
Uch ro'yxat (`FALLBACK_FEATURES` · harness `V1`/`REST` · `KODING_STARTER.nomlar`) harfma-harf mos.

### 🔴 F-0803-22-B: MODUL-KO'PRIGI HECH QACHON ISHLAMAGAN (yangi topilma)
**Belgi:** 8-ekrandagi «Bu ro'yxat — 2-darsda o'zingiz yozgan imkoniyatlar» tarmog'i bironta
o'quvchida ochilmagan; dars doim namunaga tushgan. Hech qanday xato-xabar yo'q — jim buzilish.
**Sabab (ikki shart ham noto'g'ri edi):** (1) `PmLesson4` kartani `{qiyinchilik, imkoniyat}`
shaklida yozadi, `readIncomingFeatures` esa `text|label|title|name` ni qidirardi → har karta bo'sh
chiqib ro'yxat tashlanardi; (2) `PmLesson4` aynan **3** juftlik yozadi (uning o'z maqsadi),
`readIncomingFeatures` esa **≥6** talab qilardi.
**Tuzatildi:** `imkoniyat` maydoni ham tanaladi; 2-5 ta karta kelsa ro'yxat namunadan 6 tagacha
to'ldiriladi (dublikat nomlar tashlanadi). To'ldirish endi xavfsiz — ikkala dars bir olamda.
s8 mentor matni halol yozildi: «Ro'yxat boshida — 2-darsda o'zingiz yozgan imkoniyatlar,
qolganini kinoteatr namunasidan oldik.»
**Brauzer-tasdiq (`bridge.mjs`):** M2-D2 artefakti bor holatda → 6 imkoniyat + «o'zingiz yozgan»
matni ✅ · artefakt yo'q holatda → 6 imkoniyat + «tayyor namuna» matni ✅ · konsol xatosi 0.
**Sabot (jarayonga):** modul-ipi kalitlari IKKI TOMONDAN tekshirilsin — yozuvchi dars qanday
SHAKLDA va NECHTA yozishi, o'quvchi dars qanday shaklda va nechta kutishi. Faqat kalit nomi
mos kelishi yetmaydi; bu ko'prik kalit nomi to'g'ri bo'la turib ishlamagan.

### Boshqa yakuniy bandlar
· `c3` mezonidan «`parts.length===3`» zaxira yo'li OLIB TASHLANDI (tekshiruvchi ikki teshik topdi:
  darajalarni chop etish va teskari ro'yxat gate'ni yolg'ondan ocharkan). `c3.mjs` — 6/6 ✓.
· 88-qonun s3 ga ham tatbiq etildi (4 karta birdan pulslardi → navbatdagi bittasi).
· s6 keys-ekranidan `MentorBypassLine` olib tashlandi — u yerda mentor slaydni O'ZI varaqlaydi,
  «o'quvchilar bajaradi, siz kuzatasiz» yozuvi noto'g'ri edi (NavNext baypasi joyida qoldi).
· Grapheme-tell: 12 ballik savol balanslandi (eng yomoni 2.75 → 1.26; hammasi ≤1.30).
· DEMO_LIST spoiler qaytarildi: namuna endi ishchi oltilik bilan KESISHMAYDI.
· `🤔 Taxmin qiling` → `🎲 Avval o'zingiz belgilab ko'ring` (79-qonun kanonik yorlig'i).
· Tekshiruvchi topgan ikki jim nuqson: podiumda `\U0001F947` chalkash matni (8 joy) va
  `RECAPS` kaliti 15→14 (yakuniy testda «Qayta tushuntirish» bloki butunlay o'lik edi).

### 🔴 `til-lint-rules.json` DARVOZA-TESHIGI YOPILDI (foydalanuvchi buyrug'i bilan)
16 qoidaga `i` bayrog'i qo'shildi — gap boshidagi bosh harf ularni chetlab o'tardi (masalan
taqiqlangan «Taxmin qiling» shu sabab o'tib ketgan). Harf registri MA'NOLI 12 qoida qat'iy qoldi:
`belgi-formula · ichki-darskod · qiyshiq-apostrof · kirill-lotin-matnda · yadro-jargon ·
kelajak-okr · xato-ball · kodda-xato · ishlaydi-hukm · nusxalash-tugma · slot-ichki-atama ·
raqam-keyingina`. Ta'siri: butun repoda +2 error, +61 warn (jami 59/475). Bu ESKI qarz —
`lint:til` har fayl uchun alohida darvoza, hozirgi ishni to'smaydi. Tozalash alohida ish.

**Darvozalar:** esbuild toza ✅ · `lint:jsx` 127 fayl 0 topilma ✅ · `lint:til` PmLesson5 0 ✅ ·
`lint:prompt` 0 ✅ · `vite build` toza ✅ · 18/18 ekran 1280×720 va 1280×648 da renderlanadi,
ko'rinmas gate-vidjet 0, konsol xatosi 0 ✅. UNCOMMITTED.
