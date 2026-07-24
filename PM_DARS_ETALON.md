# 📕 PM DARS ETALONI — PM_DARS_ETALON.md

> **Oltin namuna (P0):** `src/pm/PmUserStoryLesson.jsx` (`pm-m3d2-v1`) — foydalanuvchi jonli-sinovi + v2 qayta-ishlovdan o'tgan YAGONA birlamchi PM namuna. Qanday qilish noaniq bo'lsa — o'zingdan to'qima, P0'dan AYNAN o'sha yo'lni ko'chir (quyidagi 3-bo'lim xaritasi).
> **Senariy-qonun:** `PM_Prompt_v8.md` (9 blok, K1-K19, 13 maydon). **Til-qonun:** `MATN_ETALONI.md`. **Jonli-ball relslari:** `DARS_ETALON.md` 2/3/4/5.7/6/7/8.1/8.3 (butun platforma bilan UMUMIY).
> ❌ **Htmllesson1 PM uchun namuna EMAS** — texnik-dars kontenti (dinozavr/restoran/HtmlCompiler-mantiq) PM'da topilsa NUQSON.

**Belgilar:** 🔴 majburiy · 🟡 muhim · 🟢 boyituvchi.

---

## 1. 🎨 PM-STUDIA IDENTITET-PASPORTI (barcha PM darslarda AYNAN shu)

**Konsepsiya:** «mahsulot-menejerning ish stoli» — sovuq-indigo studiya (texnik darslar issiq-apelsin; arena binafshasi bilan bir oila).

| `T.*` token | Qiymat | Ma'no |
|---|---|---|
| `bg` | `#F2F0FA` | studio-qog'oz fon |
| `ink / ink2 / ink3` | `#1B1630 / #565073 / #9C97B4` | indigo-siyoh matn |
| `accent` | `#5B3DE6` | PM brend (sarlavha-urg'u, mentor, CTA, tanlov) |
| `accentSoft` | `#EBE5FD` | yumshoq indigo fon (maslahat/hint — XATO EMAS) |
| `accentVivid` | `#6E4BFF` | gradient/urg'u |
| `success / successSoft` | `#12A968 / #E4F5EC` | topildi/bajarildi/o'z-ball |
| 🔴 `err / errSoft` | `#E5484D / #FCE7E8` | **FAQAT haqiqiy xato** (noto'g'ri bosish, FAIL) |
| `blue` | `#0E86C4` | KIM-slot / info |
| `line` | `#E7E3F4` | chiziqlar; soyalar sovuq-indigo `rgba(40,34,82,…)` |

- **Tipografika:** Source Serif 4 (sarlavha/hikoya — editorial) · Manrope (matn) · JetBrains Mono (raqam/kod).
- **Karta-uslub:** oq qog'oz + indigo soya + `line` halqa; artefaktlar «indeks-karta/hujjat» hissi (chap-accent hoshiya); interaktivlar hover'da translateY-lift.
- **Formula/slot semantikasi:** KIM=ko'k · NIMA=amber · NATIJA=yashil.
- **Dekor o'qitadi (M7):** fon/arena tokenlari (`QZ_BG_SHAPES`/`TOK`) shu dars atamalaridan; ma'nosiz shakl yo'q. Arena CodeStrike brendi O'ZGARMAYDI (platforma mahsuloti).
- Universal: layout 1100px+`--lz`+padH60 · `MENTOR_IMG`+`PHOTO_SET` hostlangan · xira LiveBadge · o'z-ball yashil · `prefers-reduced-motion` har og'ir animatsiyada.

## 2. 🔴 BLOK→EKRAN STANDARTI (P0 naqshi, ~15 ekran)

```
s0 HOOK (keys-savol, ovoz-berish, vizual imzo-sahna) → s1 MAQSAD (JONLI natija-preview — kartalar ko'z oldida to'ladi)
→ TEORIYA-1 (savol+hayotiy misol → interaktiv qoida-konstruktor) → 🔴 TEST-1
→ TEORIYA-2 (KEYS-SLAYD: «Keys …» eyebrow — o'zbekcha, K-kodsiz (P0: «Keys 🥤»), bosqichma-bosqich) → 🔴 TEST-2
→ AMALIYOT (o'z loyihasiga birinchi qadam, jonli validator) → USTAXONA (artefakt, 3-4 element)
→ 🔴 TEST-3 → KODING (compiler-qobiq) → RECAP (juftlik-taymer+Reflection+3 harakat-savol)
→ UYGA VAZIFA (SHARTNOMA harakat-ekrani) → PODIUM → CODESTRIKE ARENA → SUMMARY
```

🔴 **TEST-TAQSIMOT:** scored testlar HECH QACHON ketma-ket blok emas — har biri o'z teoriyasidan keyin; RECAP kartalari (RECAPS) aynan o'z teoriyasini qayta tushuntiradi. CodeStrike = yakuniy «real test».

## 3. 📍 P0 MANBA XARITASI (grep-anchor — qator raqami DRIFT qiladi, doim grep bilan toping)

| Primitiv/qatlam | Anchor (`grep -n "<anchor>" src/pm/PmUserStoryLesson.jsx`) | Nima |
|---|---|---|
| Palitra | `const T = ` / `const LT` | PM-STUDIA tokenlari |
| Jonli relslar | `function useLiveSession` / `set_quiz_keys` | server-ball zanjiri (TEGILMAYDI — darslik-jonli) |
| Hook ovoz-sahna | `.mshake-` / `hook-mc` | ovoz plitkalar + natija-vizual (har darsda O'Z imzo-vizuali) |
| Qoida-konstruktor | `.fslot` / `.frag-chip` | bo'lak-tap qoida yig'ish (magnit-doska) |
| Keys-slayd | `K11_SLIDES` / `.k-slide` | CASE STUDY slayd-naqshi (yangi darsda K<N>_SLIDES) |
| Jonli validator | `validateStory` | artefakt formula-tekshiruvi |
| 🎯 Topshiriq-panel | `const TaskSpec` / `.tspec` / `MentorWatchLine` / `.done-mini` | 32-qonun: yozish-ekranlarning YAGONA shart-tili (chip ≤4 so'z + sticky + kim-bajaradi yozuvi + muvaffaqiyat-chip) |
| Ustaxona | `ScreenStoryWorkshop` / `STORIES_KEY` | artefakt-muharrir + storage (amaliyot↔ustaxona ko'chish) |
| Maqsad-preview | `DEMO_STORIES` / `.demo-slot` / `.silo-fill` | s1 WOW: natija-kartalar CSS-taymlayn bilan o'zi to'ladi |
| Scored hotspot | `renderMode="hotspot"` / `BrokenStory` / `.hs-broken` | bo'lak-bosish testi (topilgan=YASHIL ✓, noto'g'ri bosilgan=QIZIL); oddiy tashxis-test = `ctaLabel`/`revealPrefix` props (P0 s9) |
| Kompilyator | `PmCompiler` / `.hcp-root` / `.kod-launch` | TO'LIQ-EKRAN: launch-karta → topshiriq+jonli shart-chiplar+debounce avto-tekshiruv+editor\|natija+«Davom etish» |
| Juftlik-taymer | `PairTimer` | RECAP soft-mexanika |
| SHARTNOMA | `HW_KEY` / `.hw-chip` | uyga-vazifa tanlov-ekrani (summary o'qiydi) |
| Mentor jonli chiplar | `MentorPracticeStats` | «✏️ Ism»→«✓ Ism», 3s polling, `PRACTICE_BASE+screen` |
| Proyektor-sir | `const MentorNote` / `.mnote-chip` | MENTORGA default-yopiq toggle chip |
| Nishonlar | `const ACHIEVEMENTS` / `ACH_TRIGGERS` | 4 ta, inglizcha o'yin-nom, faqat real harakatga |
| Arena | `const QUIZ_BANK` / `QUIZ_MS` / `QZ_BG_SHAPES` | 12 savol·15s·3/3/3/3·naqshsiz·tokenlar mavzudan |
| Kalitlar | `const INLINE_KEYS` / `PRACTICE_BASE` | id-based kalitlar + 500+ signal-zona |

## 4. 🔴 QAT'IY QOIDALAR (P0'da qonlangan — har yangi darsga)

1. **Test-taqsimot** (2-bo'lim) — testlar teoriyaga biriktiriladi.
2. **Yozma mashq maks 3-4 element** bitta sahifada; katta artefakt sinf(3)+uy(+2) bo'linadi.
3. **KODING = REAL KOMPILYATOR har darsda (2026-07-16 foydalanuvchi qonuni, P0-ko'rikda kuchaytirilgan · 2026-07-21: 26-qonun bilan KENGAYTIRILDI — React o'tilgan modullarda VS Code-topshiriq varianti ham REAL koding hisoblanadi, mexanika darslar orasida almashinadi):** Htmllesson1 tizimi TO'LIQ-EKRAN ko'rinishda (P0: `PmCompiler`): dars-ekranda launch-karta («🛠 Kompilyatorni ochish») → to'liq ekranda topshiriq + JONLI shart-chiplar (yozgan sari debounce avto-tekshiruv, birinchi bajarilmagan shartga 💡 hint) + editor (Tab=2 probel, ▶) | jonli iframe-natija + pastda ← Darsga qaytish / Qaytadan / «Davom etish» (faqat hamma shart ✓). Inline yarim-sahifa textarea O'TMAYDI. Faqat INFRA — texnik-dars kontenti emas.
4. **Mentor-panel jonli chiplar** (praktika/koding ekranlarida).
5. **PROYEKTOR-SIR:** MentorNote default yopiq xira chip (bosish=ochish/yopish; ekran almashsa avto-yopiq).
6. **Nishonlar:** 4 ta · name inglizcha o'yin-nom («Story Pro!»/«Nice Catch!»/«Tool Maker!»/«Level Up!» uslubi) · desc o'zbekcha siz-forma · faqat REAL tekshiriladigan harakatga.
7. **Hotspot rang:** topilgan buzuq bo'lak YASHIL+✓ («topdingiz!»); qizil FAQAT noto'g'ri bosilganda.
8. **Test-shart naqshi:** kontekst-gap (lead) → material → ANIQ topshiriq-gap (cue), oldingi teoriyaga bog'langan.
9. **EKRAN ≤ 400 grapheme** — bitta ekranda o'quvchi ko'radigan JAMI o'quv-matn, **mentor-pufak SHU JUMLADAN** (2026-07-16 qabul-konvensiyasi, M8-D1 Screen2 saboqi) · **uzunlik-tell ≤1.4×** (Intl.Segmenter, correct vs 2-eng-uzun) · arena seq naqshsiz (sikl TAQIQ) · taqsimot teng.
10. **Keys-sadoqat:** faqat K1-K19; raqam yilsiz yo'q; «raqamsiz» keysga raqam qo'shilmaydi; pul %/sifat; shaxsiy boylik yo'q. Modul ichida bosh-keys takrorlanmaydi; TEKSHIRUV mexanikasi oldingi darsni takrorlamaydi (jurnal: `PM_PIPELINE_STATE.md`).
11. **Storage:** kalitlar lesson-scoped (`pm-<mNdK>-...`); lessonId format `pm-m<N>d<K>-v<V>`, katta o'zgarishda versiya oshadi.
12. **Signal-zonalar:** test <100 · arena 100+ · praktika `PRACTICE_BASE(500)+screen`; `INLINE_KEYS`da `practice: -1` sentinel.
13. Platforma taqiqlar: placeCorrect YO'Q · mentor.png lokal import YO'Q (`MENTOR_IMG` URL) · auto `setBigOpen(true)` YO'Q · atama birinchi ko'rinishda o'zbekcha gloss bilan.

**2026-07-16 P0 FOYDALANUVCHI-KO'RIGI QONUNLARI (14-20):**

14. **Ichki-jargon ekranga oqmaydi:** «YADRO», «artefakt», blok/pipeline nomlari o'quvchi ko'radigan matnda TAQIQ (izohda mumkin). Mavhum va'da («javob darsda ochiladi») o'rniga «birozdan keyin birga bilib olamiz» uslubi.
15. **Sarlavha = sinfga savol:** har teoriya/amaliyot ekran h2'si qiziqtiruvchi savol-murojaat (texnik-dars uslubi: «Formulani o'zingiz yig'a olasizmi?»). Quruq darak-sarlavha nuqson.
16. **Mentor-pufak ohangi:** maks 1-2 `<b>`; «1) 2) 3)» raqamlangan chala gaplar TAQIQ — ravon savol-ohangli gaplar; pufak dizaynga sig'sin.
17. **Test halolligi:** faqat BITTA variant himoyalanadigan-to'g'ri (boshqa variant ham mazmunan rost bo'lsa test buzuq — s9 dark-mode saboqi); lead ≤1 gap, cue ≤1-2 gap.
18. **MAQSAD-ekran WOW:** s1 natija-preview jonli to'ladi (`DEMO_STORIES` naqshi); statik siluet + dekorativ `rotate()` qiyshiqlik TAQIQ.
19. **Overflow-himoya:** foydalanuvchi kiritmasi ko'rinadigan har konteynerda `min-width:0` + `overflow-wrap:anywhere` (9-page bugi sinfi).
20. **MentorNote faqat zarur ekranda** (sir-saqlash/baholash-mezoni/vaqt-qoidasi/tekshirish-qoidasi) · **CTA-kapsula ixcham** — kutish holatida matndan keyin bo'sh joy qolmasin (`.cs-cta .cs-cap` override), CODE STRIKE so'z kattaligi o'zgarmaydi.

**2026-07-21 M7-D2/M8-D1 AUDIT QONUNLARI (21-22):**

21. **SCORED-matn glossi (halollik sharti):** ball beriladigan HAR matn — QuestionScreen savol o'zagi va variantlari (DISTRAKTORLAR ham!), arena `QUIZ_BANK` — jargonsiz yoki glossli bo'ladi: o'quvchi so'zni tushunmagani uchun ball yo'qotmasin («custdev» arena Q12 / «o'rtacha chek» distraktor saboqi). Boshqa modulda o'rgatilgan atama (MVP, custdev, analytics…) ham HAR darsda birinchi ko'rinishda qisqa qavs-gloss oladi — lug'atga yozilgan qoida KODDA grep bilan tekshiriladi (lug'atda bor ≠ darsda bajarilgan). Mas'ul: metodist yozadi, auditor/tekshiruvchi grep bilan fosh qiladi.
22. **Sanoq-mosligi:** lead/cue/mentor matnida aytilgan SON ekrandagi real element soniga AYNAN teng; test o'quvchi artefaktidan boshqa (YANGI) to'plamni ishlatsa, o'tish-gap buni ochiq aytadi: ✅ «3 kartangiz tayyor — endi bilimingizni yangi 4 mahsulotda sinaymiz» (M7-D2 MatchPairs saboqi). Mas'ul: quruvchi/metodist; tekshiruvchi har testda «matndagi son ↔ UI son» ni sanaydi.

**2026-07-21 FOYDALANUVCHI JONLI-KO'RIK QONUNLARI (23-27, M7-D2 feedback):**

23. **Maqsad-preview KLON TAQIQ:** s1 natija-preview NAQSHI (kartalar jonli to'ladi) universal, lekin KO'RINISHI har darsda O'Z metaforasidan yangi imzo-vizual bo'ladi — P0'ning story-silo kartasini boshqa darsga aynan ko'chirish NUQSON («zerikarli, etalonday bo'lib qopti» — M7-D2 s1 saboqi; yechim: JTBD'da «✓ YOLLANDI» shtamp-kartalar). Mas'ul: dizayn/quruvchi; auditor «P0 klass-nomlari kontent-ekranda aynan takrorlanganmi» deb tekshiradi.
24. **Kundalik-ilova misoli darslar ORASIDA takrorlanmaydi:** muhokama/teoriya misolida ishlatilgan ilova (Telegram, YouTube, Duolingo...) boshqa PM darsida bosh-misol bo'lolmaydi — har dars o'z hayotiy misolini oladi (M7-D2 Telegram = M3-D2 Telegram takrori saboqi; yechim: kalkulyator). Ishlatilgan misollar `PM_PIPELINE_STATE.md` jurnaliga yoziladi. Muhokama-ekran STATIK matn emas — kichik interaktiv sahna (bosiladigan/ochiladigan) afzal.
25. **Matn-zichlik (amaliyot/ustaxona):** o'quvchi YOZADIGAN ekranda o'qiladigan matn minimal — mentor ≤2 qisqa gap, checklist yorlig'i ≤5 so'z, YORDAM/YULDUZCHA default-yopiq yig'ma chip, qoida-talablar UI-affordance (placeholder, progress, rang) orqali («ma'lumot juda ko'p — to'ldirgim kelmayapti» — M7-D2 ustaxona saboqi).
26. **KODING-VARIATIVLIK (3-qonun kengaytmasi):** koding-ekran modulning TEX-KONTEKSTIGA moslashadi: React o'tilgan modullardan boshlab koding «VS Code-topshiriq» bo'lishi mumkin — tex-darslar `ScreenLivePractice` naqshi (checklist + «Bajardim» + `MentorPracticeStats`) + DARSDA jonli namuna-preview (o'quvchining ustaxonadagi REAL artefakt-ma'lumotidan render — WOW) + VS Code-mockup'da nusxalanadigan boshlang'ich kod. Ketma-ket PM darslari BIR XIL koding-mexanikani takrorlamaydi (JS-funksiya kompilyatori ikki darsda ketma-ket = zerikarli, M7-D2 saboqi). Ball-rels o'zgarmaydi: `PRACTICE_BASE+screen` + 'koding' signal. Eski mexanika olib tashlansa — o'lik kod qoldirilmaydi.
27. **Test/recap ekranlarda dizayn-boylik:** scored test (MatchPairs, hotspot) va recap ekranlar «oddiy ro'yxat» ko'rinishida qolmasin — mavzuga mos mikro-animatsiya (snap-pop, stamp, glow-drop-zona, slide-in qadamlar), har biri `prefers-reduced-motion` fallback bilan. Ball-mantiqqa tegilmaydi — faqat vizual qatlam.
28. **Amaliyot-ekranda `narrow` TAQIQ + validator-vizual doim ko'rinadi (2026-07-22 M7-D2/M8-D1 s5 saboqi):** o'quvchi YOZADIGAN ekran (amaliyot/ustaxona) tor kolonnaga qisilmaydi — to'liq kenglik, split-layout (chapda kiritish, o'ngda jonli holat-panel: chiroqlar/progress/shtamp), shunda mentor-pufak ham yoyilib chiqadi. Kiritish-vizual (editor, chiroq-validator) HECH QANDAY holatda (bo'sh/yarim/to'liq/qaytib kirganda) yo'qolmaydi — «to'ldirilgach vizual g'oyib, ekranda bo'shliq» = BUZUQ ekran (metrika.png dalili). Tekshiruvchi har amaliyot-ekranni 3 holatda (bo'sh, yarim, to'liq) ko'zdan kechiradi.

**2026-07-22 METRIKA JONLI-KO'RIK QONUNLARI (29-31, M8-D1 1-6.png feedback):**

29. **KELAJAK-DARS ATAMASI JORIY DARSGA OQMAYDI (1.png OKR saboqi):** keyingi darsning bosh atamasi (OKR kabi) joriy darsda tushuntirishsiz ishlatilmaydi — na hero/takeaway'da, na yulduzcha-maslahatda, na uyga-vazifada. Oldinga-havola SODDA so'z bilan: ✅ «keyingi darsda shu raqamlar asosida maqsad qo'yishni o'rganasiz» · ❌ «keyingi darsda OKR'ga aylanadi». Atama faqat O'Z darsida birinchi marta (gloss bilan) ochiladi. Mas'ul: metodist yozadi; auditor/tekshiruvchi modul-rejadagi keyingi-dars atamasini grep bilan ov qiladi.
30. **QULFLANGAN «DAVOM ETISH» JIM TURMAYDI (4.png «nega o'tolmayapman?» saboqi):** disabled tugma yorlig'i (yoki yonidagi hint) AYNAN qaysi shart qolganini aytadi — validator bosqichli bo'lsa yorliq bosqichga qarab o'zgaradi («① Avval o'lchanadigan raqamni yozing» → «② "chunki …" deb sababini qo'shing»); umumiy «Avval bajaring» / predmetsiz «… yozing» yetarli EMAS. Yozish-ekranida qadam-yo'riqnoma doim ko'rinadi, bajarilgan qadam YASHIL yonadi. Shu band ichida: sarlavha o'z-o'zidan tushunarli — predmetsiz deiktik boshlanish («Endi ochamiz: …») TAQIQ, nimani ochish aytiladi («Duolingo usulini ochamiz: …», 3.png saboqi; 2026-07-24: «sirini» ham mavhum deb topildi — lug'at «sir» qatori).
31. **AMALIYOT-GATING KONVENSIYASI — KIM BAJARADI, EKRANDA YOZILGAN (5.png saboqi):** platforma bo'ylab BIR XIL qoida: amaliyot/mustaqil-ish/koding'ni O'QUVCHI bajaradi (self-rejimda majburiy); MENTOR har doim ozod o'tadi (`isMentor` bypass: `disabled={!done && !isMentor}`) va unga ko'rinadigan bir-qatorlik yozuv chiqadi: «👨‍🏫 Jonli darsda bu amaliyotni o'quvchilar bajaradi — siz kuzatasiz ("Kim bajardi" paneli); "Davom etish" siz uchun ochiq». Bir dars ichida ham, darslar ORASIDA ham gating farq qilmaydi — «ba'zi darsda mentor ham majburan to'ldiradi» = NUQSON. Ball-rels (`PRACTICE_BASE+screen`, submitAnswer) o'zgarmaydi. Mas'ul: quruvchi quradi; tekshiruvchi HAR gated ekranda bypass+yozuv bir xilligini tekshiradi.

**2026-07-22 UX-TINIQLIK QONUNI (32, P0 to'liq UX-qayta-ishlovda muhrlandi — foydalanuvchi: «matn bahaybatlashib ketgan, bola BIR QARASHDA tushunsin»):**

32. **🎯 TOPSHIRIQ-PANEL (TaskSpec) + EKRAN-DIYETA — shartlarning YAGONA vizual tili:**
    - **(a) Shartlar PROZADA YASHAMAYDI.** O'quvchi yozadigan/bajaradigan HAR ekranda shartlar `TaskSpec` chip-panelida: chip = raqam + **≤4 so'z**, bajarilganda YASHIL ✓ + pop; batafsil izoh chip bosilganda ochiladi (default yopiq); uzun ekranda panel `sticky`. Manba: `PmUserStoryLesson.jsx` → `TaskSpec` komponenti + `MentorWatchLine` + `.tspec`/`.mwatch`/`.done-mini` CSS — boshqa darslar AYNAN ko'chiradi, o'z variantini to'qimaydi.
    - **(b) Mentor-diyeta qat'iy:** yozish-ekranda mentor-pufak **≤1 gap**, teoriya-ekranda **≤2 gap**; pufak shart/qadam RO'YXATINI HECH QACHON aytmaydi — ular TaskSpec/qadam-UI'da ko'rinib turibdi.
    - **(c) Bir vaqtda ≤2 matn-blok:** sarlavha+mentor'dan tashqari ekranda bir paytda ko'rinadigan matn-karta ko'pi bilan 2 ta; qo'shimcha misol/izoh mashq BAJARILGACH chiqadi (mukofot-pattern, P0 s2 taksi-misoli) yoki default-yopiq chip.
    - **(d) Muvaffaqiyat = chip:** bajarildi-xabari bitta-qatorlik `done-mini` chip («✅ Ikkalasi tayyor — ustaxonaga ko'chdi»), to'liq-en paragraf-ramka EMAS.
    - **(e) Qulf-tugma 30-qonun bilan juft:** dinamik yorliq TaskSpec bosqichlariga mos («① 1-hikoyani to'ldiring» → «② 2 xil KIM kiriting»).
    - Mas'ul: quruvchi TaskSpec'ni o'rnatadi; dizayn vizualni P0 bilan piksel-mos qiladi; metodist chip-yorliq ≤4 so'z va pufak-diyetani ta'minlaydi; tekshiruvchi har yozish-ekranda (a)–(e) ni BIRMA-BIR yuritadi.

**2026-07-23 UCH-ETALON CHUQUR-TAHLIL QONUNLARI (33–36, PmUserStory/PmJtbd/PmMetrics'da joriy):**

33. **KEYS-SLAYD BASHORAT BILAN OCHILADI:** keys-slaydlar sof o'qish bo'lib qolmaydi — kamida 2 kalit-slayd oldidan mikro-bashorat («Sizningcha…?» 3-4 chip, tikish → slayd ochiladi). BALL YO'Q va bu ochiq yoziladi («Ball yo'q — taxmin qiling»); topmaganga QIZIL EMAS — neytral indigo («Sizning taxminingiz: X»), topganга yashil ✓. Qulf-yorliq 30-qonunga mos («Avval taxminingizni tanlang»); mentor bypass. Yakuniy slaydda **hook-payoff shaxsiylashadi**: s0 ovoz-tanlovi lesson-scoped localStorage'da (`pm-<mNdK>-hook-choice`) saqlanib, reveal'da qaytariladi («Dars boshida siz "X" degandingiz — asl sir esa…»; deyarli topganga maxsus maqtov); tanlov yo'q bo'lsa umumiy matn fallback. Namuna: P0 `kp-bet`/`HOOK_CHOICE_KEY`.
34. **TEST-EKRAN REVEAL BILAN TUGAYDI (2026-07-23 jonli-ko'rikda BEKOR qilingan g'oya):** scored test-ekranga reveal'dan keyin qo'shimcha unscored «endi o'zingiz tuzating/hisoblang» qadami QO'SHILMAYDI — foydalanuvchi jonli sinovda rad etdi («testni yechsa nimadir chiqdi — olib tashlaymiz»). Test = savol → javob → izoh → davom; tuzatish-mashqlar faqat amaliyot/ustaxona ekranlarida yashaydi. (Koding-ekrandagi jonli hisob-vidjet bunga kirmaydi — u qoladi.)
35. **ARTEFAKT-STRIP (to'planish doskasi):** dars metaforasidan kelib chiqqan ixcham (~40-50px, bosilsa ochiladigan) fixed-strip amaliyot/ustaxona/koding/recap/uy-vazifa ekranlarida artefakt-progressni jonli ko'rsatadi (mavjud storage'dan o'qiydi + write-joyda custom event; YANGI storage yo'q); test/arena/podiumда ko'rinmaydi, mentorda yashirin bo'lishi mumkin (proyektor tozaligi), overlay'lar (kompilyator/arena) undan baland z-index'da. Har darsda O'Z metafora-ko'rinishi (23-qonun ruhi): daftar/doska/pult — P0 klonlanmaydi. Koding-checklist va uy-vazifa ro'yxati REAL holatdan o'qiydi — qattiq `ok={false}` statik-yolg'on TAQIQ.
36. **SOLO-REJIM O'LIK NUQTASIZ:** sinf-mexanika ekranlari (qo'l-ko'tarish savollari, podium) jonli-sessiyasiz inert qolmaydi — solo'da savollar o'z-o'zini tekshirish kartalariga aylanadi (savol → o'ylab bos → javob ochiladi; kamida bittasi o'quvchining REAL artefakt-holatini jonli o'qiydi), podium shaxsiy natija-ekraniga (ScoreRing + nishonlar + artefakt-holat). Jonli-rejim markup'i aynan saqlanadi. Koding-ekranda honor-checkbox yolg'iz yurmasin — kamida bitta band REAL mikro-signalga bog'lanadi (jonli hisob-vidjet, prop-ov topshirig'i) va avto-✓ bo'ladi; ball-rels o'zgarmaydi.

**2026-07-23 JONLI-KO'RIK QONUNLARI (37–40, JTBD/UserStory/Metrics Vercel-sinov feedback'i):**

37. **TIL-DIYETA (o'quvchi bir qarashda tushunsin):**
    - **(a) «chip» so'zi o'quvchi-matnda TAQIQ** — «tugma» / «variant» / «karta» deyiladi (CSS-klass/kod-identifikatorga tegilmaydi).
    - **(b) Bosh-atama charchatmaydi:** darsning markaziy atamasi (ish, hikoya, metrika…) HAR gapda takrorlanmaydi — birinchi kirishda sodda izoh, keyin sinonim-almashinuv (vazifa / natija / nima uchun kerak). «ish ish ish» saboqi: test-variantlar va karta-matnlarda atama faqat zarur joyda.
    - **(c) Fe'l-kalka TAQIQ:** «o'zini … deb quradi» kabi g'aliz qurilmalar tabiiy o'zbekchaga yoziladi («aslida nima sotadi?», «qanday joy deb ko'rsatadi?»).
    - **(d) Metafora-so'z o'zi tushunarsiz bo'lsa — hikoya bilan:** «TESHIK = ish» kabi quruq tenglama o'rniga sodda hayotiy gap («odamga drel emas — devorga rasm osish kerak»).
    - **(e) Qo'shimchali ko'rsatmalar to'g'ri:** «…Dan deb yozing» emas — «sinfdoshingizdan», «ota-onangizdan» kabi to'g'ri qo'shimcha bilan.
38. **BOSHQA DARSGA HAVOLA TAQIQ:** boshqa darsning keysi/metaforasi (milkshake, M3…) joriy dars matnida tilga olinmaydi — done-mini'da ham, MentorNote'da ham. Har dars o'z ichida to'liq.
39. **ARTEFAKT-STRIP VAQTI va NOMI:** strip artefakt REAL yozila boshlanadigan ekrandan chiqadi (bo'sh 0/N holatda oldinroq ko'rinib chalg'itmaydi); nomi o'quvchiga sodda («Kartalarim», «Hikoyalarim» — ichki metafora-nom «Yollash doskasi» emas).
40. **KODING-PREVIEW 3-HOLAT SINOVI + NISHON-HALOLLIK:** o'quvchi-ma'lumotidan render bo'ladigan har preview bo'sh/yarim/to'liq holatda tekshiriladi — bo'sh-singan karta (muammo.png saboqi) TAQIQ, storage bo'sh bo'lsa chiroyli namuna-fallback. Nishonlar: 4 nishonning HAR BIRI real bajariladigan harakat-triggerga ega («hammasini qildim — badge chiqmadi» = NUQSON); tekshiruvchi ACHIEVEMENTS↔ACH_TRIGGERS xaritasini sanaydi.

**2026-07-24 USERSTORY QO'LDA-KO'RIK QONUNLARI (41–43, P0 s1/s3/s4/s5 feedback):**

41. **YORDAMCHI METAFORA DARSNING O'Z SO'ZIDAN QURILADI («retsept/masalliq» saboqi):** tushuntirish uchun olib kelingan metafora BOSHQA sohaning o'quvchiga notanish so'zini kirgizmasin — «retsept + masalliq» (oshxona) o'smirga «masalliq»ning o'zi tushunarsiz bo'lgani uchun metafora ish bermadi. Yechim: darsda ALLAQACHON yashayotgan sodda so'zdan quriladi — UserStory'da «**1 hikoya — 3 bo'lak**» (tekshiruv-ekranlar «bo'lak» so'zini avvaldan ishlatardi). Metafora tekshiruvi: metafora-so'zning O'ZI gloss talab qilsa — metafora yaroqsiz, boshqasi tanlanadi (37d bilan juft).
    **Kaskad-majburiyat:** bosh-metafora almashsa, YOLG'IZ mentor-gapi emas — eyebrow, sarlavha, done-mini, RECAPS, scored testlar (savol + variantlar), tekshiruv-cue/explain, koding-brief/checklist, uy-vazifa, yakun-RECAP hammasi BIR tilga o'tadi + eski metafora-so'z residue-grep bilan ovlanadi (QOIDA 12). Mas'ul: metodist so'z tanlaydi, tekshiruvchi residue-grep yuritadi.
42. **JONLI-VIZUAL FE'LI JARAYONGA AYNAN MOS:** animatsiyani tasvirlagan fe'l ekranda ko'ringan jismoniy jarayonga mos kelsin — karta MATN bilan to'lsa «to'ladi» EMAS (suv/idishni eslatadi), «**o'z-o'zidan yozilib chiqadi**» deyiladi; keyin-holat ham shu fe'lda («xuddi shunday yozilgan bo'ladi»). Umumiy tekshiruv: fe'lni o'qib ko'z oldiga kelgan harakat ≠ ekrandagi harakat bo'lsa — fe'l almashtiriladi.
43. **BELGI-FORMULA va MAVHUM-KO'RSATMA TAQIQ (o'quvchi-matnda):**
    - **(a)** «≠», «=», «→» kabi belgi-formulalar o'quvchi ko'radigan izohda TAQIQ — to'liq sodda gap bilan: ❌ «foyda ≠ harakat» → ✅ «bu "nima qilaman" emas, "menga nima foyda" degan javob».
    - **(b)** Mentor-ko'rsatma mavhum sifatlashsiz, EKRAN ELEMENTIGA bog'lab: ❌ «O'sha odam nima qilmoqchi va bundan qanday foyda olishini o'ylab, 2 kartani to'ldiring» → ✅ «Pastda 2 bo'sh karta bor. Har biriga yozing: bu odam KIM, u NIMA qilmoqchi va bundan qanday FOYDA oladi» (32b diyeta saqlanadi — bitta-ikki gap, lekin KONKRET).
    - **(c)** «X sifatida olmayapti» kabi g'aliz inkor-qurilma → tabiiy shakl: «X uchun olmayotgan ekan» (37c fe'l-kalka oilasi).

**2026-07-24 JTBD QO'LDA-KO'RIK QONUNLARI (44–46, M7-D2 s1/s2/s9/s10 feedback):**

44. **MENTOR-PANELDA JAVOB REVEAL'GACHA YASHIRIN — TEST-TURIDAN QAT'I NAZAR (MatchPairs saboqi):** Kahoot-reveal printsipi faqat MCQ-statistikaga emas, HAR scored mexanikaga tatbiq: juftlash/biriktirish ekranida mentor-rejimdagi javob-kalit (identity-assign, to'g'ri juftlangan kartalar) «Natijani ochish»gacha proyektorda KO'RINMAYDI — reveal'gacha slotlar bo'sh («🙈 "Natijani ochish"da ko'rinadi» yozuvi bilan), reveal'da to'g'ri juftlik ochiladi. Aks holda o'quvchi javobni ekrandan ko'chiradi. Tekshiruvchi HAR scored ekranni mentor-rejimda reveal'dan OLDINGI holatda fikran yuritadi: «proyektorda hozir javob ko'rinyaptimi?»
45. **SINF-PULS — AMALIYOT-STATISTIKA O'QUVCHIGA HAM:** jonli-rejimda gated amaliyot/koding ekranda O'QUVCHI ham sinf holatini ko'radi: «Bajardim» tugmasi ostida ixcham jonli hisob «👥 Sinfda: N bajardi · ✏️ M hali bajarmoqda» (ismlarsiz — ismlar faqat mentor-panelda). Sof o'qish: mentor-panel bilan bir xil signal-zonadan (`PRACTICE_BASE+screen`) polling, ball-relsga YOZMAYDI; solo-rejimda ko'rinmaydi. Namuna: M7-D2 `StudentPracticePulse`.
46. **TAP-OCHILMA TOGGLE (bir martalik flip TAQIQ):** bosib ochiladigan mikro-kartalar (flip-ikonka, ochilma-izoh) birinchi bosishdan keyin `disabled` bo'lib QOLMAYDI — qayta bosilsa yopiladi, yana bosilsa ochiladi (o'quvchi takror bosib yodlaydi). Progress-darvoza esa «kamida BIR marta ochildi» (`seen`) bilan ALOHIDA sanaladi — karta yopilsa ham darvoza buzilmaydi, «3/3» saqlanadi. Namuna: M7-D2 s2 `opened`/`seen` juftligi.

**2026-07-24 QAT'IY EKRAN-UX STANDARTI (47, Senior Methodologist prompti — M1-D12 Pitch'da joriy):**

47. **TOPSHIRIQ·YO'RIQNOMA·KARTOCHKA·VARIANTLAR — har interaktiv ekranning majburiy tartibi (to'liq standart: `MATN_ETALONI.md` 7-B):** ekran boshi savol-sarlavha EMAS — TOPSHIRIQ (buyruq, 3–6 so'z: «Ortiqcha bo'lakni toping.») + YO'RIQNOMA (qaysi qoida, ≤20 so'z), keyin KARTOCHKA (faqat tahlil-material, ichida yo'riq YO'Q) va qisqa VARIANTLAR. Bir ekran = bitta vazifa. Taqiq-so'zlar (buzuq/g'alati/chalkash/shunchaki/foydasiz) o'quvchi matnida yo'q — «ortiqcha/xato/noto'g'ri» ishlatiladi. Namuna: M1-D12 `TaskHead` komponenti (10 ekranda). Tekshiruv: `grep -nE '\?</h2>' <fayl>` — bo'sh chiqsin.

## 5. ✅ QABUL-CHECKLIST
`pm-qabulchi` 20-bandi (rol faylida) + rollar DoD. Yakuniy jonli-sinov QO'LDA: yangi PIN + 2 o'quvchi + MENTOR-2026 → podium/arena 0 EMAS.

## 6. 🏭 YANGI DARS RETSEPTI
1) Kirish-ma'lumot (`PM_PIPELINE_STATE.md` jurnalidan: ishlatilgan keyslar + oldingi mexanika) → senariy (PM_Prompt_v8) → pm-metodist KORREKTURA → [GATE S].
2) pm-quruvchi (P0'dan primitivlar, 3-bo'lim xaritasi; kontent yangi) → pm-dizayn (identitet 1-bo'lim; imzo-vizual har darsda YANGI) → darslik-jonli → pm-metodist → pm-tekshiruvchi → darslik-verifikator → pm-qabulchi.
3) Bosh-agent har o'tishda skript-darvoza (QOIDA 10); parallel partiyada har agent NOYOB scratch-katalog (QOIDA 11).
4) App.jsx ulash + vite build + jurnal yangilash. Commit faqat buyruq bilan.
