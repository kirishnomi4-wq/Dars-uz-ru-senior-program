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
