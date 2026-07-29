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

## 1-B. 🔀 PM DARSLARNING IKKI TURI (boshliq-qarori, 2026-07-28)

> **Sabab:** PM darslar bir xil emas. Bir qismi texnikaga yaqin (UX/UI, struktura) — mavzu **ko'rinadigan interfeys** orqali ochiladi; bir qismi sof PM (User Story, JTBD) — mavzu **odam va keys** orqali ochiladi. Ikkalasini bitta qolipga solish har ikkalasini ham buzadi.
> **Qoida:** yangi PM dars qurishdan OLDIN uning **turi aniqlanadi**; blok-standart (2-bo'lim) shu turga qarab o'qiladi.

**Ikkala turda ham AYNAN bir xil (bularda farq YO'Q):** 1-bo'lim identitet-pasporti (rang/shrift/karta/soya) · jonli-ball relslari (`useLiveSession` · `INLINE_KEYS`↔`correctIdx` · `QUIZ_BANK` 3/3/3/3 · `PRACTICE_BASE` · podium · CodeStrike arena) · matn qonunlari (EKRAN ≤400 grapheme · mentor ≤2 gap, interaktivda ≤1 · atama hodisadan KEYIN · slot-sanog'i taqiq · siz-forma) · ekran-ritmi (ilinma → nazariya → test; testlar ketma-ket EMAS) · mentor-blok · xira LiveBadge.

| | **1-TUR — texnikaga yaqin** | **2-TUR — sof PM** |
|---|---|---|
| **Etalon-fayl** | `src/1-Modull/PmLesson2.jsx` (Struktura) | `src/pm/PmUserStoryLesson.jsx` (P0) |
| **Mavzu nima orqali ochiladi** | real saytlar/interfeys — o'quvchi **ko'radi** | odamlar va keyslar — o'quvchi **tasavvur qiladi** |
| **Nazariya-bloki** | interfeys-namunalar (tap-to-reveal, solishtiruv) | **KEYS-SLAYD** (K1–K19, bashorat bilan) |
| **O'quvchining asosiy harakati** | joylashtiradi · tartiblaydi · moslaydi · tuzatadi | **yozadi** (o'z artefaktini) |
| **Artefakt** | to'g'ri qurilgan **tuzilma** | **matn** — keyingi darsga o'tadi |
| **USTAXONA (48/80-qonun)** | 🔴 **majburiy EMAS** — yozma artefakt bu turga tegishli emas | 🔴 majburiy (bittalab-yozish qolipi) |
| **Koding-ekran** | tuzilmani **kod bilan quradi** | o'z **matnini** koddan o'tkazadi |
| **Misol darslar** | UX/UI · struktura · prototip · dizayn-tizim | User Story · JTBD · Metrika · Pitch · Demo Day |

**ARALASH DARS:** mavzu ikkala tomonga ham tegsa — nazariya-blokini bir turdan, amaliyot-blokini boshqasidan oladi. Qaysi qismi qaysi turdan olingani senariyda (GATE S) yozib qo'yiladi.

🔴 **KLON-TAQIQ (23-qonun kengaytmasi):** ikki etalon **bir-birini takrorlamaydi**. Umumiy tizim (rang/shrift/karta/rels) bir xil, lekin ekran-vizuallari, mexanikalari va CSS-klass oilalari har turda O'ZINIKI. «Etalonda shunday edi» — vizualni ko'chirishga asos EMAS.

## 1-C. 🔔 NAVBAT-PULSI — UNIVERSAL YECHIM (qaror-tartibi, 2026-07-28)

> **Nima uchun bor:** boshlang'ich tur (onboarding) hamma narsani OLDINDAN aytadi — o'quvchi kerak bo'lganda unutgan bo'ladi. Puls esa AYNAN KERAK BO'LGAN LAHZADA aytadi. Shuning uchun tur olib tashlanadi, o'rniga puls qo'yiladi.
> **Bu bo'lim nima uchun bor:** har ekranda «pulsni qayerga qo'ysam?» deb o'ylab o'tirmaslik uchun. Quyidagi tartib bo'yicha yurilsa, javob o'z-o'zidan chiqadi. Normativ taqiqlar — 88-qonunda.

### 1-C.1 Puls bitta savolga javob beradi
**«Bu ekran hozir mendan nimani kutyapti?»** — puls bezak emas, ekranning HOZIRGI talabi. Shundan kelib chiqib, u faqat bitta joyda bo'lishi mumkin.

### 1-C.2 Qadam 1 — HARAKAT-ZANJIRINI yozing
Ekran tugashi uchun nima, qaysi tartibda bo'lishi kerak? Zanjir **dars mantig'i** bo'yicha yoziladi — ekrandagi joylashuv yoki DOM tartibi bo'yicha EMAS. Namunalar (PmLesson2 = 1-tur etaloni):

| Ekran turi | Harakat-zanjiri |
|---|---|
| Ilinma (ovoz berish) | ko'rilmagan holatni ko'rish → ovoz berish → o'tish |
| Juftlik-solishtiruv | ko'rilmagan holatni ko'rish → o'tish |
| Ro'yxat («hammasini ko'r») | har elementni ochish → o'tish |
| Animatsiya/stepper | boshlash → o'tish |
| Juftlik-mashqi | chap ustundan tanlash → o'ng ustundan tanlash (×N) → o'tish |
| Koding | kompilyatorni ochish → bajarish → o'tish |

### 1-C.3 Qadam 2 — navbat kimda?
Zanjirdagi **birinchi bajarilmagan halqa** — navbat o'shanda. Puls faqat shu yerda. Halqa bajarilishi bilan puls **darhol** o'chadi va navbat keyingisiga o'tadi. Oxirgi halqa doim «o'tish» bo'ladi — uni `NavNext` o'zi bajaradi.

### 1-C.4 Qadam 3 — naqshni halqaning SHAKLI belgilaydi
| Halqa shakli | Naqsh | Vosita |
|---|---|---|
| Bitta aniq element bosilishi kerak | tinch nafas | `useTurnHint(shart)` → `turn-ring` |
| Bir nechtasining **hammasi** ko'rilishi kerak | **yurish** — faqat bajarilmaganlar aylanadi | `useTurnWalk(pending)` → `turn-ring turn-step` |
| Bir nechtasidan **bittasi** tanlanadi | **to'lqin** — hammasi teng, cheklangan | `turn-ring turn-wave w1/w2/w3` |
| «Keyingi ekranga o'tish» | avtomatik | `NavNext` — **qo'shimcha ish YO'Q** |

🔴 **Yurish tartibi** darsning o'z ketma-ketligiga ergashadi (`ORDER`, `PAIRS` kabi) — alifbo yoki DOM tartibiga emas.

### 1-C.5 Sukut-holati tuzog'i (eng ko'p qilinadigan xato)
Element sukut bo'yicha ochiq/tanlangan turgan bo'lsa — **u yonmaydi**. **Ko'rilmagani** yonadi. *(PmLesson2: «Tartibli» ochiq turadi → «Chalkash» yonadi; «To'g'ri tartib» ochiq → «Aralash» yonadi.)*

### 1-C.6 Puls QO'YILMAYDIGAN joylar
- ballanadigan test variantlari — **javob berilgunga qadar** (17-qonun: test halolligi);
- qulflangan / mentorni kutayotgan tugma (83-qonun qulf-yo'lini beradi);
- ikkinchi darajali boshqaruvlar: «Orqaga», «Qaytadan», zoom, til-almashtirgich;
- **teng bo'lmagan variantlardan bittasi** — bittasini yoritish javobga undash bo'ladi; bu holda **to'lqin** ishlatiladi;
- navbat boshqa zonaga o'tgan bo'lsa — *(juftlik-mashqida chap ustundan tanlangach o'ng ustun YONMAYDI: u javobni aytib qo'yardi)*;
- mentor-boshqaruvlari o'quvchi ko'rinishida.

### 1-C.7 Tekshirish — majburiy 5 band
1. **Sekundomer:** puls ~2.6s dan OLDIN chiqmasin (darhol chiqsa — shart noto'g'ri ulangan).
2. **Bir lahzada nechta yonyapti?** — MAKS **1**. Yurish/to'lqinda ham shu.
3. Harakatdan keyin **darhol** o'chdimi?
4. Test ekranida javobgacha yonmasligi.
5. `prefers-reduced-motion` da butunlay o'chishi.

> ⚠️ **SINOV TUZOG'I (bir marta tushilgan):** `getComputedStyle(el, '::after').opacity` — `::after` mavjud bo'lmasa ham **1** qaytaradi. Shuning uchun avval **klass borligini** tekshiring, keyingina ko'rinishini. Aks holda «ekranda hamma element yonyapti» degan YOLG'ON natija olasiz.

### 1-C.8 Kod-shartnomasi (ko'chiriladi, qayta ixtiro qilinmaydi)
- Vaqtlar: `TURN_HINT_MS = 2600` · `TURN_STEP_MS = 1300` · `TURN_PAUSE_MS = 3200`.
- `useTurnHint(active)` → `bool`; `active` yolg'onga o'tsa darhol o'chadi.
- `useTurnWalk(pending, enabled)` → hozir yonayotgan kalit yoki `null`; `pending` bo'sh bo'lsa — o'chiq; bitta qolsa — tinch yonadi (yurishning ma'nosi qolmaydi).
- `turnCls(lit, key, walking)` → klass qo'shimchasi.
- CSS: `.turn-ring` (geometriya + tinch nafas; halqa `::after` da — layoutni surmaydi) · `.turn-step` (yurish qadami) · `.turn-wave` + `w1/w2/w3` (to'lqin).
- **O'lcham hech qachon o'zgarmaydi** — faqat halqa nafas oladi (UI sakramaydi).
- Manba-fayl: `src/1-Modull/PmLesson2.jsx` (1-tur etaloni).

## 1-D. 🖥 MENTOR EKRANI (proyektor) — QAT'IY KO'RINISH (2026-07-28)

> **Nima uchun qat'iy:** mentor ekrani — bu **proyektor**, uni butun sinf ko'radi. Shuning uchun u o'quvchi qurilmasidan boshqa qonunlarga bo'ysunadi. Yangi dars qurilganda yoki tekshirilganda quyidagi jadval **band-ma-band** solishtiriladi.

**Ikki tayanch tamoyil:**
1. 🔴 **SHAXSIY narsa proyektorda chiqmaydi.** Nishon, shaxsiy ball — bular QURILMAGA xos. Mentor rejimida ular mentorning o'z bosishlarini sanaydi, sinf ishini emas → proyektorda **yolg'on hisob** bo'ladi.
2. 🔴 **MAG'LUBIYAT-TABLOSI proyektorda chiqmaydi.** Butun sinf oldida «0/4 to'g'ri» ko'rsatish — kamsitish. Mentorga bu ma'lumot dars **PAYTIDA**, o'z joyida beriladi (test ekranidagi panel), yakuniy ekranda EMAS.

> 📌 Qisqa qoida: **mentor ekrani = SAHNA (lahzalar) · o'quvchi qurilmasi = DAFTAR (hisob).**

| Element | Mentor (proyektor) | O'quvchi | Sabab |
|---|---|---|---|
| Nishon-hisoblagichi (tepadagi kichik 🏅 N/M) | ❌ **YO'Q** | ✅ bor | shaxsiy hisob; mentorda yolg'on son |
| Yakuniy ekrandagi nishon-ro'yxati | ❌ **YO'Q** | ✅ bor | shaxsiy hisob |
| To'liq-ekran nishon-bayrami (`AchCelebrate`) | ❌ **YO'Q** (2026-07-29, F-0729-06 — «bor» BEKOR) | ✅ bor | mentorda badges hech qanday ko'rinishda chiqmaydi; bayram dars oqimini to'xtatib ekranni yoritadi |
| Podiumda «📊 Savollar bo'yicha» (`N/M` per savol) | ❌ **YO'Q** — butunlay olib tashlanadi | ❌ yo'q | mag'lubiyat-tablosi (2-tamoyil) |
| Shaxsiy ball-aylanasi (`ScoreRing`) | ❌ **YO'Q** | ✅ bor (faqat mustaqil rejimda) | shaxsiy hisob |
| Podium reytingi (g'oliblar, sinf natijasi) | ✅ **BOR** | ✅ bor | sinf yutug'i — bayram, jazo emas |
| Test-paneli (`MentorTestStats`) | ✅ **BOR** | ❌ yo'q | mentorning ASOSIY asbobi — aynan shu yerda «sinf qiynaldi» ko'rinadi |
| Praktika-paneli (`MentorPracticeStats`) | ✅ **BOR** | ❌ yo'q | kim bajardi — mentorga kerak |
| Sinf-pulsi (`StudentPracticePulse`) | ❌ yo'q | ✅ bor | mentorda uning o'rnida to'liq panel turadi |
| Mentor-eslatmalari («Eslatma — faqat sizga») | ✅ **BOR** (ixcham chip) | ❌ yo'q | yo'riq faqat mentorga |
| Takrorlash-yo'li (89-qonun) | ❌ yo'q | ✅ faqat erkin rejimda | jonli darsda kerak emas |
| Navbat-pulsi (88-qonun) | ✅ bor | ✅ bor | qulflangan tugma ikkalasida ham yonmaydi |
| Test javobi reveal'gacha | ❌ **yashirin** | ❌ yashirin | 44-qonun: proyektorda javob oshkor bo'lmaydi |

🔴 **Tekshirish usuli:** dars mentor rejimida ochilib, yuqoridagi 13 band ko'z bilan (yoki `live.mode === 'mentor'` qorovullarini grep bilan) tasdiqlanadi. Bittasi ham mos kelmasa — dars etalon emas.

## 2. 🔴 BLOK→EKRAN STANDARTI (P0 V4 naqshi, ~17 ekran — 2026-07-24)

```
s0 HOOK (keys-savol, ovoz-berish, vizual imzo-sahna) → s1 MAQSAD (JONLI natija-preview — kartalar o'z-o'zidan yozilib chiqadi)
→ TEORIYA-1 (savol+hayotiy misol → interaktiv qoida-konstruktor) → 🔴 TEST-1
→ TEORIYA-2 (KEYS-SLAYD: «Keys …» eyebrow — o'zbekcha, K-kodsiz (P0: «Keys 🥤»), bosqichma-bosqich) → 🔴 TEST-2
→ USTAXONA (artefakt BITTALAB yoziladi — 48-qonun; eski «AMALIYOT + USTAXONA» juftligi TAQIQ)
→ 🔍 SHERIK-TEKSHIRUV (✓/✕ hukm) → 🔴 TEST-3 → 🩺 KLINIKA (tuzoq-chipli tuzatish-konstruktor)
→ KODING (aylantirish-vizual → compiler-qobiq) → 🔥 PRIORITET-DOSKA (Hozir=1)
→ RECAP (juftlik-halqa-taymer+Reflection) → UYGA VAZIFA (SHARTNOMA) → PODIUM → CODESTRIKE ARENA → SUMMARY
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
| Muvaffaqiyat-chip | `.done-mini` | yozish-ekranlarning muvaffaqiyat-belgisi (TaskSpec/MentorWatchLine 2026-07-24 BEKOR — 48/51-qonunlar: shartlar saqlash-hintda, mentor-info Eslatmada) |
| Ustaxona (bittalab) | `ScreenStoryWorkshop` / `.swed` / `.svd` / `STORIES_KEY` / `readFullStories` | 48-qonun: bitta karta-muharrir + saqlanganlar-daftari + saqlash-shart-hintlar |
| Maqsad-preview | `DEMO_STORIES` / `.demo-slot` / `.silo-fill` | s1 WOW: natija-kartalar CSS-taymlayn bilan o'z-o'zidan yozilib chiqadi |
| Scored test (TestQ) | `const TestQ` / `.tq-ask` / `.opt-abc` | 49-qonun: savol-sarlavha + toza kartochka + doira-harf variantlar (hotspot BEKOR) |
| Kompilyator | `PmCompiler` / `.hcp-root` / `.kdx` | 50-qonun: aylantirish-vizual (kod-chip ➜ o'z kartalari) + bitta CTA → TO'LIQ-EKRAN compiler (topshiriq+jonli shart-chiplar+debounce+editor\|natija) |
| Sherik-tekshiruv | `ScreenPeer` / `PEER_CHECKS` / `.peer-v` | 52-qonun: 3 hikoya × 3 savol, ✓/✕ hukm-tugmalar |
| Klinika | `ScreenClinic` / `CLINIC_POOL` / `.clinic-trap` / `.frag-chip.burned` | 52-qonun: tuzoq-chipli tuzatish-konstruktor |
| Prioritet-doska | `ScreenPriority` / `PD_COLS` / `PRIORITY_KEY` / `.pd-col` | 52-qonun: Hozir(1)/Keyin/Keyinroq tanla-bos doska, keyingi darsga ko'prik |
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
9. **EKRAN ≤ 400 grapheme** — bitta ekranda o'quvchi ko'radigan JAMI **proza**, **mentor-pufak SHU JUMLADAN** (2026-07-16 qabul-konvensiyasi, M8-D1 Screen2 saboqi). 🔴 **2026-07-25 aniqlashtirish (foydalanuvchi qarori, M7-D2 raundi):** o'lchov PROZAni (tushuntirish/ko'rsatma matni) sanaydi — o'quvchi USTIDA ISHLAYDIGAN material sanalmaydi: kod-bloki, karta/misol matni, tur-ustunlari, checklist qatorlari, variant-matnlari. Sabab: mashq-materiali «o'qish yuki» emas, ish-maydoni; uni qisqartirish topshiriqni buzadi. Tekshiruvda ikki raqam beriladi: jami va proza — darvoza **proza ≤400** bo'yicha yopiladi · **uzunlik-tell ≤1.4×** (Intl.Segmenter, correct vs 2-eng-uzun) · arena seq naqshsiz (sikl TAQIQ) · taqsimot teng.
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

33. **KEYS-SLAYD BASHORAT BILAN OCHILADI:** keys-slaydlar sof o'qish bo'lib qolmaydi — kamida 2 kalit-slayd oldidan mikro-bashorat («Sizningcha…?» 3-4 chip, tikish → slayd ochiladi). BALL YO'Q va bu ochiq yoziladi («Ball yo'q — taxmin qiling»); topmaganga QIZIL EMAS — neytral indigo («Sizning taxminingiz: X»), topganga yashil ✓. Qulf-yorliq 30-qonunga mos («Avval taxminingizni tanlang»); mentor bypass. Yakuniy slaydda **hook-payoff shaxsiylashadi**: s0 ovoz-tanlovi lesson-scoped localStorage'da (`pm-<mNdK>-hook-choice`) saqlanib, reveal'da qaytariladi («Dars boshida siz "X" degandingiz — asl sir esa…»; deyarli topganga maxsus maqtov); tanlov yo'q bo'lsa umumiy matn fallback. Namuna: P0 `kp-bet`/`HOOK_CHOICE_KEY`.
34. **TEST-EKRAN REVEAL BILAN TUGAYDI (2026-07-23 jonli-ko'rikda BEKOR qilingan g'oya):** scored test-ekranga reveal'dan keyin qo'shimcha unscored «endi o'zingiz tuzating/hisoblang» qadami QO'SHILMAYDI — foydalanuvchi jonli sinovda rad etdi («testni yechsa nimadir chiqdi — olib tashlaymiz»). Test = savol → javob → izoh → davom; tuzatish-mashqlar faqat amaliyot/ustaxona ekranlarida yashaydi. (Koding-ekrandagi jonli hisob-vidjet bunga kirmaydi — u qoladi.)
35. **ARTEFAKT-STRIP (to'planish doskasi):** dars metaforasidan kelib chiqqan ixcham (~40-50px, bosilsa ochiladigan) fixed-strip amaliyot/ustaxona/koding/recap/uy-vazifa ekranlarida artefakt-progressni jonli ko'rsatadi (mavjud storage'dan o'qiydi + write-joyda custom event; YANGI storage yo'q); test/arena/podiumda ko'rinmaydi, mentorda yashirin bo'lishi mumkin (proyektor tozaligi), overlay'lar (kompilyator/arena) undan baland z-index'da. Har darsda O'Z metafora-ko'rinishi (23-qonun ruhi): daftar/doska/pult — P0 klonlanmaydi. Koding-checklist va uy-vazifa ro'yxati REAL holatdan o'qiydi — qattiq `ok={false}` statik-yolg'on TAQIQ.
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

47. **TOPSHIRIQ·YO'RIQNOMA·KARTOCHKA·VARIANTLAR — har interaktiv ekranning majburiy tartibi (to'liq standart: `MATN_ETALONI.md` 7-B):** ekran boshi savol-sarlavha EMAS — TOPSHIRIQ (buyruq, 3–6 so'z: «Ortiqcha bo'lakni toping.») + YO'RIQNOMA (qaysi qoida, ≤20 so'z), keyin KARTOCHKA (faqat tahlil-material, ichida yo'riq YO'Q) va qisqa VARIANTLAR. Bir ekran = bitta vazifa. Taqiq-so'zlar (buzuq/g'alati/chalkash/chala/shunchaki/foydasiz) o'quvchi matnida yo'q — «ortiqcha/xato/noto'g'ri/to'liq emas» ishlatiladi. Namuna: M1-D12 `TaskHead` komponenti (10 ekranda). Tekshiruv: `grep -nE '\?</h2>' <fayl>` — bo'sh chiqsin. ⚠️ **49-qonun istisnosi:** scored TEST-ekran sarlavhasi savol-shaklda bo'lishi MUMKIN (foydalanuvchi 2026-07-24 UserStory ko'rigida shu shaklni tanladi). 🔴 **2026-07-24 [GATE 1] qarori — TATBIQ MAJBURIY:** qonun M1-D12 dan tashqariga chiqmagan ekan — auditda P0=7 · M7-D2=10 · M8-D1=10 ta `?</h2>` topildi. Foydalanuvchi «qonun kuchida, hammasini tuzatamiz» dedi. **Tatbiq chegarasi qonunning O'Z matnidan kelib chiqadi — «har INTERAKTIV ekranning tartibi»:** ✅ o'quvchi ish bajaradigan ekranda (ustaxona · sherik-tekshiruv · klinika · prioritet · koding) savol-sarlavha TAQIQ — buyruq/bayon shakli; ⏸ hook · teoriya/muhokama · keys · recap · uy-vazifa ekranlarida savol-sarlavha RUXSAT — u yerda savol induktiv metodning quroli (41-qonun ruhi), uni buyruqqa aylantirish darsni induktivlikdan ayiradi; ⏸ `TestQ` (`.tq-ask`) — 49-istisno. **Darvoza:** `grep -cE '\?</h2>'` = 0 EMAS, balki **interaktiv ekranlarda 0** (M7-D2 V4 dan keyin: 6 ta qolgan — s0·s1·s3·s4·s11·s12, hammasi ruxsat etilgan turdan).

**2026-07-24 USERSTORY V4 QONUNLARI (48–53, P0 kechki qayta-qurish — 10-nuqta feedback + image.png/idea_oll.png annotatsiyalar):**

48. **USTAXONA = BITTALAB-YOZISH (ikkita ketma-ket yozish-ekrani TAQIQ):** artefakt-yozish ekranlari ikkiga bo'linmaydi («2 hikoya» + «3 hikoya» ketma-ketligi bekor) — BITTA ustaxona-ekran, hikoyalar BITTALAB yoziladi:
    - **Chapda BITTA karta-muharrir** («✨ N-hikoya» yorlig'i): jonli gap-preview + 3 maydon. Gap-preview slotlari s3-konstruktor RANGLARIDA (KIM=ko'k, NIMA=amber, NATIJA=yashil); bo'sh slot xira-punktir-kursiv, to'lgani o'z rangida yonadi (`ss-slot` naqshi).
    - **«✓ Saqlash» tugmasi DOIM qisqa va o'zgarmas matnli** — disabled holatda ham «Uchala maydonni to'ldiring» kabi uzun matnga aylanmaydi (inputga o'xshab UI buzadi); to'lmagan holat yonidagi kichik «N/3 maydon to'ldi» hisobchida.
    - **Saqlash → hikoya O'NGDAGI 📒 daftarga ko'chadi** (yashil karta: ✓ raqam + to'liq gap + ⭐1–5 + ✎ tahrirlash) va chapga yangi bo'sh karta keladi; bo'sh o'rinlar «hali yozilmagan» punktir-slot.
    - **Sifat-shartlar SAQLASH PAYTIDA** yumshoq hint bilan (alohida checklist-panel YO'Q): to'liq emas → hisobchi; NATIJA==NIMA → «NATIJA harakatni takrorlamasin»; KIM avvalgi kartada bor → «Bu KIM allaqachon daftarda bor».
    - **3-saqlashda ekran O'ZI bajarildi** (honor-tugma yo'q — real signal, PRACTICE_BASE'ga ketadi). Namuna: P0 `swed`/`svd`.
49. **TEST-EKRAN «TestQ» DIZAYNI (idea_oll.png tartibi):** scored test = katta SAVOL-SARLAVHA (Manrope 800, clamp 16.5–21px — h2 EMAS, `\?</h2>` grep'iga ilinmaydi) → toza KARTOCHKA (FAQAT tahlil-hikoya, serif kattaroq, chap-accent hoshiya) → VARIANTLAR. Variant-harflar DOIRA-BADGE (`opt-abc`): binafsha-yumshoq default; reveal'da to'g'risi yashil ✓, bosilgan xatosi qizil ✗, qolganlari xira. Hotspot (bo'lakni bosish) rejimi bekor — hamma test oddiy variantli. Savol-shakl sarlavha RUXSAT (47-istisno).
50. **KODING-LAUNCH = «AYLANTIRISH-VIZUAL» (murakkab launch-karta TAQIQ):** kompilyatorga o'tish ekrani split/checklist/xira-kod-parda bilan TO'LDIRILMAYDI — bitta markaziy transformatsiya-qator: chap mini kod-chip `funksiya(kim, nima, natija)` (parametrlar slot-ranglarda) ➜ puls-strelka ➜ o'quvchining O'Z artefakt-kartalari (daftardan o'qiladi, «📒 Bular — o'z hikoyalaringiz» yozuvi; bo'sh bo'lsa namuna-fallback, 40-qonun). Ostida BITTA katta CTA + bir qator izoh. Ekran KENG (narrow EMAS); artefakt-strip bu ekranda KO'RINMAYDI (vizual o'zi daftardan o'qiydi — takror bo'lmasin). Namuna: P0 `kdx`.
51. **MENTORGA MA'LUMOT FAQAT ESLATMA-CHIPDA (MentorWatchLine BEKOR):** «bu ishni o'quvchilar bajaradi / panelda kuzatasiz» kabi mentor-ko'rsatmalar EKRANDA ochiq satr bo'lib turmaydi — MentorNote (📋 Eslatma, default-yopiq, bosilganda ochiladigan) chipiga kiradi; 31-qonunning «ekranda yoziladi» talabi shu chip orqali bajariladi (proyektor toza).
52. **YAKUN-EKRAN TRIO — peer(=Tekshiruvchi stoli, 59-qonun)/clinic/priority (dars kamayib qolmasin, unscored, ball-rels tegilmaydi):** yozish-amaliyotidan keyingi bilim-mustahkamlash uch YANGI ekran-turi bilan quriladi, har biri PRACTICE_BASE signal + MentorPracticeStats + demo-fallback + mentor-bypass bilan:
    - ~~**🔍 SHERIK-TEKSHIRUV**~~ — ⛔ **2026-07-25 BEKOR QILINDI, o'rniga 59-qonun («Tekshiruvchi stoli»).** Sabab pastda.
    - **🩺 HIKOYA-KLINIKA (imkoniyat-so'rovi testidan keyin darhol qo'llash):** mijozning to'liq bo'lmagan talabi («Saytim tez ochilsin!») → s3-konstruktor mexanikasi bilan to'liq hikoyaga yig'ish + **2 TUZOQ-CHIP** (mavhum KIM «hamma foydalanuvchi», takror NATIJA «sahifa tez ochilishi») — tuzoqqa bosilsa chip «kuyadi» (chizilgan, disabled) va sababi sariq-kartada ochiladi; tuzoqqa tushish xato emas — darsning o'zi (mentor muhokama qiladi).
    - **🔥 PRIORITET-DOSKA (kodingdan keyin):** o'z hikoyalarini «Hozir / Keyin / Keyinroq» ustunlariga tanla-bos bilan joylash, «Hozir» sig'imi = 1 (majburiy tanlov — PM-ko'nikma); tanlov localStorage'da keyingi darsga ko'prik; yakunda «keyingi darsda "X"dan boshlaymiz 🚀».
53. **TIL: «chala» va «mezon» TAQIQ (2026-07-24 qat'iy):** «chala» — 7-B.3 taqiq-oilasiga kirdi (→ «to'liq emas / to'liq bo'lmay qoladi»); «mezon» — kattalar-rasmiy so'z (→ «savol»); ekranga havola matnida ekran-NOMI emas, harakat-tili («"Orqaga" bilan qaytib»). Podium jonli-sarlavha: «Bugungi g'oliblarimiz» (birlik-egalik — sinfni birlashtiradi). Uy-vazifa kartasi pastki matni TIQILMAYDI — raqam-doirali 3 alohida qadam-qator (`pmtask-steps`).

**2026-07-25 F-0725-01 (foydalanuvchi qo'lda-ko'rigi, M7-D2 V4 dan keyin) — «ETALON = QAROR, faqat naqsh emas» oilasi (54–58):**

54. 🔴 **P0 dan O'CHIRISHLAR ham meros bo'ladi (eng ko'p buzilgan qonun).** Darsni etalonga tortganda P0 dan primitiv/mexanika ko'chiriladi — LEKIN P0 da **ataylab OLIB TASHLANGAN** qatlamlar ham ko'chirilgan bo'lishi SHART. Etalon — bu tayyor ekranlar to'plami emas, **qarorlar to'plami**: nima qo'shilgani qadar nima o'chirilgani ham qonun. Konkret meros-ro'yxat (M7-D2 da beshtasi ham qayta paydo bo'lib, foydalanuvchi qaytargan): (a) hook-ekranda stakan/ovoz ostidagi mentor-izohi — YO'Q, vizualning o'zi ovozni ko'rsatadi; (b) maqsad-ekranda `takeaway` ostidagi ikkinchi qator (`ta-sub`) — YO'Q, bitta gap; (c) demo-kartalar ostidagi «birozdan keyin sizniki ham shunday bo'ladi» **alohida** caption — YO'Q, u `takeaway`ning O'ZI; (d) keys oxiridagi «sizning MVP'ingiz ham…» ramkasi — YO'Q; (e) recap = **2 qadam** (ayting + yozing), uchinchi «3 savol» qadami — YO'Q; (f) yakun-hero'da sarlavha ostidagi `h-sub` paragrafi — YO'Q (pastda «Endi siz bilasiz» ro'yxati bor). **Tekshiruv:** yangi dars P0 bilan ekranma-ekran solishtiriladi va «P0 da bu blok bormi?» savoliga javob beriladi; yo'q bo'lsa — sabab yozilmasa, blok o'chadi. Mas'ul: `pm-quruvchi` (qurishda) + `pm-qabulchi` (geytda).

55. 🔴 **TEST SAVOLI YALANG'OCH — savol yonida hoshiya/chiziq/bezak YO'Q.** `TestQ` da accent-hoshiya FAQAT hikoya-kartochkasida (`border-left`); savol-sarlavhaning o'zida vertikal chiziq, `::before` marker, rangli lenta bo'lmaydi (P0 `.tq-ask` da bunday narsa yo'q). Sabab: chiziq o'quvchi ko'zida **javob-belgisi** kabi o'qiladi — u birinchi so'z/variantga ishora qilayotgandek ko'rinadi va testni buzadi. Bu «dizayn boyitishi» emas, **ball-xavfi**. Tekshiruv: test-ekran sarlavha-klassida `::before`/`border-left`/`padding-left` bilan berilgan bezak — 0.

56. 🔴 **BASHORAT/TAXMIN NATIJASI ASL JAVOBNI AYTADI.** Keys-slaydi yoki mini-bashoratda o'quvchi adashsa, ekran uning taxminini TAKRORLAMAYDI («Sizning taxminingiz: «X»» — TAQIQ: bu hech nima o'rgatmaydi). To'g'ri shakl (P0 `kp-res`): topsa «🎯 Topdingiz!», adashsa «Adashdingiz — asl javob «Y»». Ball yo'q, qizil yo'q — lekin **javob doim ochiladi**.

57. 🔴 **TANLOV-CHIPI GAP ICHIGA QO'YILSA — SIZ-FORMADA BO'LADI.** O'quvchi tanlagan qiymat keyin jumlaga qo'yiladigan bo'lsa (`{chosen}ga o'qib bering`), chip-qiymatlari 1-shaxs egalik qo'shimchasi bilan yozilmaydi: ❌ «ota-onam» → «ota-onam**ga** o'qib bering» (ma'no: MENING ota-onamga), ✅ «ota-onangiz» → «ota-onangizga o'qib bering». Tekshiruv: har `{template}` qiymati jumlaga qo'yib o'qib ko'riladi. Shu qatorda: uy-vazifa yorliqlari ish-nomi bilan emas, **hajm bilan** nomlanadi («To'liq · ~20 daqiqa» / «Qisqa · ~10 daqiqa»), «Koding uyga qolsa» kabi shart-yorliq — YO'Q (o'quvchi o'zi bajardimi-yo'qmi bilmaydi).

58. 🔴 **EKRAN DESKTOPDA SKROLLSIZ SIG'ADI.** Darvoza-o'lchov: **1440×900** va **1280×800** da `document.documentElement.scrollHeight <= window.innerHeight`. Sig'masa — matn qisqartirilmaydi (u boshqa darvozadan o'tgan), balki **vizual yechiladi**: `split` ustunlar to'liq ishlatiladi, ikkilamchi qatlam default-yopiq chipga yig'iladi, uzun blokka (kod, ro'yxat) o'z ichida `max-height + overflow` beriladi, vertikal `gap/padding` ixchamlashadi. ≤620px da skroll normal. Mas'ul: `pm-dizayn`; `darslik-verifikator` har ekranni shu ikki o'lchamda o'lchaydi va raqamni hisobotga yozadi.

59. 🔴 **«TEKSHIRUVCHI STOLI» — peer-ekranning YAGONA to'g'ri shakli (2026-07-25, foydalanuvchi qarori; 52-qonunning sherik-bandini BEKOR qiladi).**
    **Nega eski shakl sindi:** «sherigingiz bilan ekran almashing» mexanikasi texnik jihatdan ishlamaydi — ekran har doim o'quvchining O'Z artefaktini ko'rsatadi (`readFull*()` = o'z localStorage), sherikning ishi serverdan KELMAYDI (`submit_answer` faqat son tashiydi: `p_picked` int, `p_correct` bool — matn maydoni yo'q). Har o'quvchi o'z qurilmasida bo'lsa, u baribir o'zinikini baholaydi. 👦 O'quvchi-simulyatori buni ikki darsda ham fosh qilgan: «hammasiga ✓ bosaman — kartalarni o'zim yozganman, o'zimga ✕ qo'yish g'alati». Ya'ni ekran tekshiruvni emas, **tugma bosishni** o'rgatardi.
    **To'g'ri shakl:** 3 ta TAYYOR namuna-karta beriladi (mazmuni darsning O'Z mezonlaridan), o'quvchi ularga hukm chiqaradi. **BITTALAB** o'tiladi (yonma-yon uchtasi laptopda sig'maydi — 58-qonun), oxirida uchtasi **xulosa-stripda** bir qatorda ko'rinadi — taqqoslash shu yerda bo'ladi.
    **Ekran tarkibi (bir vaqtda FAQAT shular — 54-qonun):** buyruq-sarlavha «Uch kartani tekshiring.» · 1 jumlalik mentor · `●○○ 1/3` progress · KATTA namuna-karta · ikki tugma `✓ To'g'ri` / `✕ Noto'g'ri` (61-qonun) · `✕` bosilsa 3 sabab-chip · hukmdan keyin 1 qator izoh + «Keyingisi ▸» · yakunda xulosa-strip + yopuvchi harakat-gap.
    **Ma'lumot-qoidasi:** 3 kartadan **AYNAN BITTASI to'g'ri** (aks holda o'quvchi «doim ✕ bos» strategiyasini o'rganadi) · har xato kartada **bitta** aniq kamchilik · 3-sabab-chip **distraktor** (javob sifatida ishlatilmaydi) · kartalar tartibi aralash (to'g'risi oxirida turmasin).
    **Fidbek:** ball YO'Q, qizil YO'Q. To'g'ri hukm — yashil tasdiq 1 qator; noto'g'ri hukm — neytral, asl kamchilikni AYTADI (56-qonun oilasi: javob doim ochiladi). Hech qachon bloklamaydi.
    **Rels (o'zgarmaydi):** unscored · `PRACTICE_BASE + screen` signali faqat birinchi marta · `MentorPracticeStats` + `StudentPracticePulse` + `MentorNote` + mentor-bypass · NavNext yorlig'i dinamik («Yana N kartani baholang»).
    **Mexanika-farqi (26-qonun):** klinika = bo'laklardan YIG'ISH + tuzoq; tekshiruvchi stoli = tayyorga HUKM. Ikkalasi bir darsda bo'lsa ham takror hisoblanmaydi.

60. 🔴 **SIG'MASA — SKROLL BO'LADI, USTMA-UST TUSHMAYDI (2026-07-25, F-0725-04 — foydalanuvchi `public/image.png` dalili).**
    **Nuqson-mexanizmi (platforma-darajasida, 20+ darsda bir xil):** `.lesson-root` da `height: 100dvh` + `overflow: hidden` — sahifaning o'zi hech qachon skroll bo'lmaydi; skroll `.stage-content` (`overflow-y: auto`) da bo'lishi kerak. LEKIN `.screen` `flex: 1; min-height: 0` bo'lgani va bolalari standart `flex-shrink: 1` bo'lgani uchun, kontent sig'maganda konteyner skroll BERMAY, bloklar **siqilib** bir-birining ustiga chiqadi va matn kesiladi. Dalil: M7-D2 klinika (11/17, mentor rejimi) — formula-qatori yarim balandlikda kesilgan, bo'lak-chiplar uning ustida.
    **Majburiy qoida (ikki qatlam, 2026-07-25 F-0725-04b bilan kengaytirildi — foydalanuvchi qat'iy qarori: «kichik ekranda SKROLL bo'lsin, ammo komponentlar QISILMASIN»):**
    (a) `.screen { flex: 1 0 auto; }` + `.screen > * { flex-shrink: 0; }` — kontent sig'masa bloklar siqilmaydi, `.stage-content` skroll beradi;
    (b) **`--lz` zumi BALANDLIKNI ham hisobga oladi:** `z = clamp(1, min(innerWidth/1920, innerHeight/1000), 1.5)`. Eski formula faqat kenglikka qarardi — keng-u past ekranda (2560×1080, 1920×1000) ilova o'zini 1.3–1.5× kattalashtirib, vertikal joyni sun'iy yeb qo'yardi va toshishni KAFOLATLARDI (F-0725-04b: foydalanuvchi 4 skrinshoti, `feedback/F-0725-04b-*.png`).
    Shundan keyin eng yomon holat — skroll (maqbul), ustma-ust/kesilish esa **fizik jihatdan imkonsiz**. Skrollni yo'qotish — 58-qonun sayqal-ishi, lekin qisilish evaziga EMAS.
    **Tekshirish usuli (⚠️ boshqacha o'lchansa YOLG'ON natija chiqadi):** `document.documentElement.scrollHeight` bu layoutda HAR DOIM `innerHeight` ga teng — u bilan o'lchamang. Skroll: `sc = document.querySelector('.stage-content'); sc.scrollHeight > sc.clientHeight`. Ustma-ust: `.screen` ning bevosita bolalarini `getBoundingClientRect()` bilan olib, ketma-ket juftlikda `oldingi.bottom > keyingi.top + 1` ekanini tekshirish.
    **Sinov-sharti:** eng baland holatda o'lchanadi — interaktiv ekran **to'ldirilgan** (ustaxona 4/4, peer 3 hukm + xulosa-strip, klinika to'liq + tuzoq-ochilishi, koding bajarilgan) VA **mentor rejimida** (tepada jonli-panel qo'shiladi). Nuqson aynan shu ikki shartda chiqqan edi.
    **Munosabati 58-qonun bilan:** 58 «skroll bo'lmasin» deydi (sifat maqsadi), 60 «ustma-ust tushmasin» deydi (buzilmas minimum). 60 — BLOKLOVCHI, 58 — sayqal. Avval 60 ta'minlanadi, keyin 58 bo'yicha zich ekranlar vizual yig'iladi.
    ⚠️ **Tarqatish:** hozircha 3 PM darsga qo'llandi. `.screen { flex: 1; min-height: 0 }` naqshi 20+ texnik darsda ham bor — ularda nuqson kutib turibdi, kontent o'sishi bilan chiqadi.

**2026-07-26 F-0726-01 (foydalanuvchi daftar-ko'rigi, P0 UserStory — `src/pm/1-.png`, `src/pm/2-.png`) — «MATN O'QUVCHI TILIDA» oilasi (61–66):**

61. 🔴 **HUKM-TUGMASI BAHONING O'ZINI AYTADI, MEXANIKANI EMAS.** O'quvchi karta/hikoyaga baho beradigan joyda tugma yorlig'i **`✓ To'g'ri` / `✕ Noto'g'ri`** bo'ladi — «ishlaydi/tuzatish kerak», «qabul/rad», «yaxshi/yomon» EMAS. Sabab: «ishlaydi» — dasturchi tili, o'quvchi uni «sayt ochiladimi?» deb tushunadi; baho esa **hikoya to'g'ri yozilganmi** degan savolga beriladi. Xulosa-strip va fidbek qatorlari ham shu ikki so'zni ishlatadi (bir tushuncha — bir nom). Mas'ul: `pm-metodist`.

62. 🔴 **ATAMA BIRINCHI MARTA CHIQQANDA UNING O'RNIGA SODDA GAP QO'YILADI, ATAMA QAVSDA QOLADI.** Ekran-matni atamaga tayanib tushuntirmaydi — avval **hodisani** aytadi, atama keyin qavsda keladi: ❌ «Bu — imkoniyat-so'rovi: kim va nima uchun aytilmagan» → ✅ «Mijoz faqat tilagini aytdi… kimga kerakligi ham, qanday foyda berishi ham yo'q — shuning uchun bu hali hikoya emas». Xuddi shunday: «PM prioritet qiladi» → «avval qaysi biridan boshlashni tanlaymiz — buni **navbat belgilash** (prioritet) deyiladi». Qisqartma (`PM`, `JTBD`, `MVP`) o'quvchi matnida izohsiz TURMAYDI. Tekshiruv: har ekran matnidan atamalarni olib tashlab o'qib ko'ring — gap ma'nosini yo'qotsa, qonun buzilgan.

63. 🔴 **FORMULA-SLOTLARI SANAB O'TILMAYDI — ULAR VIZUALDA KO'RSATILADI.** Maqsad/kirish ekranlarida mentor gapi «har biri «kimga nima kerak va nima uchun»ni aytadigan gap» kabi **slot-ro'yxati** bilan boshlanmaydi: o'quvchi hali birorta hikoya ko'rmagan, ro'yxat mavhum shovqinga aylanadi (induktiv tartib buziladi). Mentor bitta jonli jumla aytadi («User Story — bir gapdan iborat kichkina hikoya»), bo'laklarni esa **demo-kartalar/formula-qatori o'zi** ko'rsatadi. Mas'ul: `pm-metodist` + `pm-quruvchi`.

64. 🔴 **TUZOQ-CHIP TO'G'RI CHIP BILAN NA HARF-NUSXA, NA MA'NODOSH BO'LADI.** *(F-0727-07 da kuchaytirildi.)* Avvalgi tahrir «ma'nodosh, ammo boshqa so'zlar» ruxsat berardi — amalda bu ham yiqildi: NIMA «sahifani tez ochish» + tuzoq «saytning tez ishlashi» (boshqa so'zlar!) — o'quvchi baribir ajratolmadi, tanlov tasodifga qoldi. Yangi qoida: **tanlov-mashqda tuzoq to'g'ri chipdan MA'NO jihatdan ham uzoq turadi**, va bir mashqning barcha tuzoqlari **bitta xato-sinf** atrofida bo'ladi (masalan mavhumlik: «hamma foydalanuvchi» + «sayt hammaga yoqishi») — shunda kuyish-izohi ham bitta dars beradi. «Takror-NATIJA» xato-sinfi tanlov-mashqda EMAS, taqqoslash mumkin bo'lgan joyda o'rgatiladi (TEST-2 reveal, ustaxona saqlash-sharti). Umumiy shakl: **bir ekranda ikki variant bir-birining harf-nusxasi ham, yaqin-ma'nodoshi ham bo'lmaydi.** Tekshiruv: har ekran variantlarini juftlab solishtiring — o'quvchi ko'zi bilan «ikkisi ham to'g'ri-ku?» deyish mumkin bo'lsa, qayta yozing. Mas'ul: `pm-metodist` + `pm-tekshiruvchi`.

65. 🔴 **ARENA/TEST FAQAT DARSDA AYTILGAN NARSANI SO'RAYDI.** `QUIZ_BANK`ning har savoli uchun darsda uni **aytgan ekran** ko'rsatilishi shart (yakun-ro'yxati emas — o'quvchi arenaga undan oldin kiradi). Qoplanmagan savol topilsa: yo mos ekranga bitta `takeaway`-qator qo'shiladi, yo savol almashtiriladi. Misol: «User Story qachon yoziladi?» va «Nega avval User Story, keyin kod?» — koding ekraniga «Qoida: User Story kod yozishdan OLDIN yoziladi» takeaway'i qo'shilib yopildi. Mas'ul: `pm-tekshiruvchi` (savol↔ekran xaritasini hisobotga yozadi).

66. 🔴 **XATO — «XATO» EMAS, «ADASHDINGIZ»; NOTO'G'RI JAVOBGA STIKER ILINMAYDI.** Ball-fidbeki o'quvchini nomlamaydi va ortiqcha emoji bilan yupatmaydi: ❌ «Xato — 0 ball. Keyingisida olasiz! 💪» → ✅ «Adashdingiz — 0 ball. Keyingisida olasiz.» Kompilyator xabari ham shunday: «Kodda xato» → «Kod ishlamadi». Emoji **muvaffaqiyat** tomonida qoladi (🎯, 🔥-streak, 🏆) — mag'lubiyat tomoni **toza** bo'ladi, aks holda stiker istehzo kabi o'qiladi. Mas'ul: `pm-metodist` + `darslik-jonli`.

**2026-07-26 EKRAN-AFFORDANS ANIQLIGI (67):**

67. 🟡 **HARAKAT-TUGMASI VA BAHO-SHKALASI O'Z NOMINI YOZADI.** Yolg'iz ikonka (`✎`, `★`) nima qilishini aytmaydi: tugmaga matn qo'shiladi («✎ Tahrirlash») yoki yo'riq-gap ikonkani nomlab beradi («tahrirlash uchun qalamcha (✎) belgisidan foydalaning» — F-0727-04); shkalaga **savol-gap** beriladi va `aria-label`/`title` shu ma'noni takrorlaydi («Muhimligi: 3 yulduz», ❌ «3 ball» — bu ball-tizimi bilan chalkashtiradi). *Aniqlik (F-0727-04):* savol-gap o'lchovni o'zi aytsa («bu hikoya siz uchun qanchalik muhim?»), «1 yulduz — …, 5 yulduz — …» sanog'i SHART EMAS — u matnni og'irlashtiradi. Mas'ul: `pm-dizayn`.

**2026-07-27 NAMUNA-KARTA ABRAZETSI (68):**

68. 🔴 **NAMUNA-KARTA — TANISH REAL MAHSULOT USTIDAN, IZCHIL SHAXS BILAN, DARSNING O'Z QONUNIGA 100% BO'YSUNGAN HOLDA YOZILADI.** Preview/demo kartalar o'quvchi darsda BIRINCHI ko'radigan to'liq namuna — ya'ni taqlid manbasi. Uch shart: **(a)** bitta **tanish real mahsulot** (YouTube, Telegram, yetkazish ilovasi) ustidan 3 xil foydalanuvchi — 3 xil mahsulotdan yig'ilgan to'plam «3 hikoya = 3 loyiha» degan noto'g'ri model beradi; **(b)** **shaxs izchil**: gap KIM tilidan yozilsa, barcha egalik qo'shimchalari o'sha KIM'niki bo'ladi (❌ «Men yangi mehmon sifatida, **ishlarimni** ko'rishni xohlayman, **meni** tez tanib olish uchun» — «ishlarim/meni» sayt egasiniki); **(c)** namuna dars **keyinroq «xato» deb fosh qiladigan naqshni ishlatmaydi** (❌ NATIJA'si harakat bo'lgan namuna, holbuki 6-ekran aynan shuni xato deb o'rgatadi). **(d)** bo'lak-qiymatlar YAKKA chipda ham o'qiladi — egalik-qo'shimchasiz masdar shaklida yoziladi («…ulgurish», ❌ «…ulgurishim» — chip yolg'iz ko'ringanida «-im» havoda qoladi; F-0727-42). Maydon-ipuchalari (placeholder) ham shu abrazetsdan olinadi — ekrandagi namuna bilan bir dunyoda. Tekshiruv: har namuna-kartani to'liq gapga yig'ib o'qing va darsning barcha test-kalitlari bilan solishtiring. Mas'ul: `pm-metodist` + `pm-tekshiruvchi`. *(F-0727-01)*

**2026-07-27 XULOSA VA MISOL ULANISHI (69–71):**

69. 🔴 **MASHQ YAKUNI — MAQTOV EMAS, XULOSA.** Mashq bajarilgandan keyingi yashil chiziq «✅ Ajratdingiz!» kabi o'quvchi **nima bosganini** takrorlamaydi — u **nima o'rganganini** ochib beradi. Xulosa hajmiga yarasha joy oladi: darsning kalit g'oyasi status-chiziqchada (`done-mini`) emas, **to'liq xulosa-kartada** (sarlavha + 2-3 gaplik ochiq izoh) turadi. `done-mini` faqat mexanik tasdiq uchun («hikoya to'liq»). Tekshiruv: yakun-matnini yolg'iz o'qing — undan g'oyani tushunib bo'lmasa, qonun buzilgan. Mas'ul: `pm-metodist`. *(F-0727-02)*

70. 🔴 **METAFORA OCHILADI YOKI ISHLATILMAYDI; MISOL YANGI DUNYODAN KELSA — KO'PRIK QO'YILADI.** ❌ «Hikoyaning yuragi — sabab» — bu ekranda «hikoya» so'zi hali ishlatilmagan, metafora bo'sh jaranglaydi. Misol ham shunday: ekran telefon-ilovalar haqida bo'lsa, keyin **taksi** misoli izohsiz chiqmaydi. Ikki yo'ldan biri: **(a)** misol o'quvchi hozirgina bajargan ishdan **o'stiriladi** (uning o'z bo'lagi → to'liq namuna, «↓» bilan ko'rsatilgan) — tavsiya etiladi; **(b)** boshqa dunyodan olinsa, ustiga ko'prik-yorliq qo'yiladi («endi butunlay boshqa vaziyat — qoida o'sha»). Namunada **o'sha ekran o'rgatgan bo'laklar belgilangan** bo'ladi (rangli + legenda), va keyingi ekranga ishorat aytiladi («keyingi ekranda mana shu 3 bo'lakni o'zingiz joylaysiz») — takror mexanika kutilmagan bo'lib qolmasin. Mas'ul: `pm-metodist` + `pm-quruvchi`. *(F-0727-02)*

71. 🔴 **RANG MA'NOSI BUTUN DARS BO'YLAB BITTA — EKRANDAN EKRANGA KO'CHMAYDI.** User Story darsida: **ko'k = KIM · sariq = harakat/NIMA · yashil = sabab/NATIJA**. Bir ekranda «harakat»ni ko'k qilib, keyingi ekranda ko'kni KIM'ga berish — o'quvchining yangi qurgan ma'no-bog'ini uzadi (aynan shu bug topildi: `.s2tag.harakat` ko'k edi, `.fslot.kim.filled` ham ko'k). Tushuncha nomi o'zgarsa ham (sabab → NATIJA) **rangi o'zgarmaydi** — bu ikki nom bir narsa ekanini so'zsiz o'rgatadi. Tekshiruv: har tushuncha uchun rang-xaritasi tuzilib, barcha ekranlarda bir xilligi grep bilan solishtiriladi. Mas'ul: `pm-dizayn` + `pm-tekshiruvchi`. *(F-0727-02)*

72. 🔴 **KO'CHIRILADIGAN ELEMENTLAR — ALOHIDA «LAGANCHA»DA, HARAKAT-CHORLOVI BILAN.** Joylashtirish-mashqda (doska, slot, ustun) ko'chirilishi kerak bo'lgan kartalar mentor-gap ostida yalang'och turmaydi — ular **belgi-yorliqli idishga** o'raladi: (a) yorliq harakatni buyruq shaklida aytadi («✋ Bu 3 hikoyangizni pastdagi ustunlarga joylashtiring ↓»); (b) idish **diqqat-pulsi** bilan ajralib turadi (qizil/issiq border-glow, `prefers-reduced-motion`da statik border); (c) o'quvchi birinchi harakatni qilgach (karta tanladi yoki joyladi) puls **tinchiydi** — signal o'z ishini bajardi, endi xalaqit bermaydi. Sabab: yalang'och kartalar «shunchaki ro'yxat» bo'lib o'qiladi, o'quvchi ularni bosish kerakligini sezmaydi (F-0727-08, foydalanuvchi dalili). Mas'ul: `pm-dizayn` + `pm-quruvchi`.

**2026-07-27 KUN-YAKUNI MUHRLARI (73–79) — F-0727-01…40 seriyasidan. Namuna-tatbiq = P0 UserStory:**

73. 🔴 **«KEYINGI DARSDA …» VA'DA-QATORLARI EKRANLARDA TURMAYDI.** Done-mini, panel-osti, «✓ Yozildi» tasdig'i kabi joylarda kelajak-va'da yozilmaydi: ❌ «keyingi darsda "X"dan boshlaymiz» → ✅ «eng muhimingiz: "X"» yoki shunchaki «✓ Yozildi!». Sabab: o'quvchi uchun bu qator hozir hech narsa qilmaydi — shovqin («jalka musur»); kelajak-bog'lam faqat uy-vazifa kartasining MUDDAT bandida yashaydi. Mas'ul: `pm-metodist`. *(F-0727-08/21/25/37/38)*

74. 🔴 **TEST-QOLIPI (to'rt shart birga).** (a) savol darsning O'Z ta'rifi so'zlari bilan tuziladi («Bu holatni qaysi metrika ko'rsatadi?» — chunki dars «metrika = holatni ko'rsatadigan raqam» degan; ❌ «Qaysi raqam birinchi o'sadi?»); (b) variantlar savolga GRAMMATIK javob beradi (savol «nimani xohlaydi?» bo'lsa variant «…ga ega bo'lishni», yalang'och ot emas); (c) hikoya-gap to'liq jumlalar (❌ «poyabzali oldi, ilova yukladi, soati taqdi» sanog'i); (d) reveal-izoh QISQA hukm+sabab (~15 so'zgacha) — to'liq tuzatish-misoli RECAP-kartada turadi, reveal'da emas. Mas'ul: `pm-metodist` + `pm-tekshiruvchi`. *(F-0727-06/14/16/28/30)*

75. 🔴 **MEXANIKA-YO'RIG'I QOLIPI: «AVVAL … TANLANG, SO'NG … BOSING».** Joylashtirish/tanlash mashqlarida mentor yo'rig'i ikki qadamni tartib-so'zlar bilan aytadi: ✅ «avval bo'lakni tanlang, so'ng mos katakni bosing» ❌ «bo'lakni bosing, so'ng joyiga bosing» (bosing-bosing — qaysi biri birinchi ekani yo'qoladi). Tugma/panel/ustun O'Z NOMI bilan ataladi: «"Kartalarim" ro'yxatiga ko'chadi» («daftar»/«jadval» emas), «"➕ o'zim yozaman"ni bosing». Mas'ul: `pm-metodist`. *(F-0727-10/17/20/27/36)*

76. 🔴 **MUSTAHKAMLASH-EKRANI QOLIPI.** Sarlavha — challenge-savol: «…ni *yoddan* ayta olasizmi?»; mentor niyatni OCHIQ aytadi: «ekranga qaramasdan, yoddan aytib bering: [dars atamalari bilan 1-2 savol]? Avval sherigingizga ayting, keyin bir qatorda yozing.» ❌ «o'z so'zingiz bilan» (mavhum), ❌ «endi o'rganganingizni ikki qadamda takrorlaysiz» (quruq meta-gap). Mas'ul: `pm-metodist`. *(F-0727-09/22/37)*

77. 🟡 **MASHQ YAKUNI OCHILGANDA AVTO-SCROLL.** Mashq bajarilgach paydo bo'ladigan xulosa/o'stirish-kartaga ~400ms kechikish bilan `scrollIntoView({ behavior:'smooth' })` — o'quvchi yangi kontentni izlamasin. Ref yakun-blokning TEPASIGA qo'yiladi (block:'start'). Namuna: P0 UserStory s2 (`doneRef`). Mas'ul: `pm-quruvchi`. *(F-0727-40)*

78. 🔴 **PROYEKTOR-YAKUN «BIRGALIKDA» SHAKLIDA.** Mentor-rejim yakun-sarlavhasi ❌ «Sinf X-ni yig'di/yozdi» (o'quvchi xayoli sinfga ketadi, o'z ishini eslamaydi) → ✅ «Bugun birgalikda X-ni [qilish]ni o'rgandik» — o'quvchi o'zi o'rgangan narsani eslaydi. Mas'ul: `pm-metodist`. *(F-0727-39)*

79. 🟡 **TAXMIN-O'YIN YORLIG'I BUYRUQSIZ.** ❌ «bemalol taxmin qiling» (buyruq-ohang) → ✅ «Bu ball emas — bemalol belgilang, javob hozir ochiladi» + tepa-yorliq «🎲 Avval o'zingiz belgilab ko'ring». «Ball yo'q» doim aytiladi. Mas'ul: `pm-metodist`. *(F-0727-15/29)*

**2026-07-27 KECHKI TO'LQIN MUHRLARI (80–86) — F-0727-40…64 seriyasidan. Yakuniy naqsh-tatbiq uchala darsda:**

80. 🔴 **USTAXONA-QOLIP (yakuniy, uchala darsda tasdiqlangan).** Bittalab-yozish ekrani shunday quriladi: **(a)** tepada HAVODAGI qadam-indikator — karta EMAS (fonsiz doiralar): yozilgani yashil ✓ + ostida nomi, joriysi indigo-pulsda, kelgusi kulrang-punktir, oradagi chiziq yashillanib boradi; **(b)** ostida YAGONA muharrir-karta (ekranning yagona kartasi — aksent-halqa bilan); **(c)** yozilganlar ro'yxati yozish paytida KO'RINMAYDI (chalg'itmasin) — faqat chiroq yonadi; hammasi tayyor bo'lgach ro'yxat to'liq enda ochiladi (✎ tahrir shu yerda); **(d)** «✨ N-karta — …» yangi-karta yorlig'i YO'Q (indikator o'zi aytadi), faqat tahrir-yorlig'i qoladi. Bir kartaga hammasi qorishtirilmaydi («adelna-adelna», F-0727-49 boshliq-qarori). Mas'ul: `pm-quruvchi` + `pm-dizayn`. *(F-0727-44…49/58)*

81. 🔴 **INPUT-SIGNALLAR MA'NO-RANGIDA.** Har maydon o'z tushunchasining rangida (71-semantika): bo'sh holat — xira rang-border; bo'sh+fokussiz — yumshoq rang-puls (ketma-ket stagger, «to'lqin»); fokus — to'liq yorqin rang (2px); to'lgan — rang-border. Qizil HECH QACHON maydon-rangi emas (u xato-rang). Puls yozish/fokus bilan darhol tinadi; reduced-motion'da o'chiq. Mas'ul: `pm-dizayn`. *(F-0727-50/61)*

82. 🔴 **KODING-QOLIP (VS Code-uslub ekranlar).** **(a)** sarlavha oilasi: «…digan *kod* yozamiz» (❌ «React komponenti qiling», «kodning o'zi hisoblasin»); **(b)** preview/mock-panel YO'Q (jprev/mxprev o'chirilgan — real natijani o'quvchi o'z brauzerida ko'radi); **(c)** panel (yo'riq + darvoza-mashq + bitta tugma) CHAPDA, kod O'NGDA; **(d)** kod NUSXALANMAYDI: tugma yo'q, «🔒 qo'lda yoziladi» belgisi, `user-select:none` + onCopy/onCut/onContextMenu bloklangan, kod maydoniga ko'p qatorli/tegli matn `onPaste` bilan qo'yilmaydi — mentor sababini ochiq aytadi («qo'lda yozganda o'rganiladi»). **ISTISNO (F-0729-07):** kod bo'lmagan uzun qiymat (rasm URL'i, PIN) uchun «Nusxalash» tugmasi va bir qatorli paste QOLADI — batafsil: DARS_ETALON 9.4-B; **(e)** honor-checklist YO'Q — darvoza darsning O'Z mini-mashg'i (JTBD: tur-topish; Metrika: jonli retention-hisob), tugma bitta halol «✅ Bajardim — [nima qilindi]»; **(f)** sinf-puls (👥 Sinfda…) bu ekranda O'QUVCHIGA ko'rinmaydi (45-qonun istisnosi — mentor MentorPracticeStats'da ko'radi). Mas'ul: `pm-quruvchi`. *(F-0727-46/48/51/53/55/64)*

83. 🔴 **QULF-TUGMA YO'L KO'RSATADI.** Darvozali tugma `disabled` qilib QOTIRILMAYDI — jonli qulf-yorliq bo'ladi («🔒 Avval …ni yeching — bosing, ko'rsataman») va bosilganda darvoza-blokka smooth-scroll + 3-marta silkinish-chaqnash beradi; darvoza-blok o'zi yechilmaguncha yumshoq indigo-pulsda turadi («meni yech»). Chaqnash sezilmas bo'lsa — kuchaytiriladi (F-0727-53: transform-shake shart). Mas'ul: `pm-quruvchi` + `pm-dizayn`. *(F-0727-52/53)*

84. 🟡 **BIRLAMCHI HARAKAT-TUGMASI PULSDA.** O'quvchi sezmasligi mumkin bo'lgan boshlash-tugmalari («▶ 1 daqiqani boshlash» kabi) gradient-CTA + halqa-puls (72-oila); bajarilgach oddiy holatga tinadi. Mas'ul: `pm-dizayn`. *(F-0727-43)*

85. 🔴 **NAMUNA — PLACEHOLDER'DA EMAS, YIG'ILADIGAN PANELDA.** Misollar input-placeholder'ga yozilmaydi (u yozila boshlaganda yo'qoladi va maydonni band ko'rsatadi) — alohida «📋 Namuna» yig'iladigan panelida turadi va JORIY bosqichga mos ALMASHADI («⭐ North Star namunasi» → «1-karta namunasi» → …); yopiq holatda bitta ingichka qator (dizaynga xalaqit yo'q). Placeholder esa generik savol bo'ladi («nimani sanaydi?»). Muharrirda statik ta'rif-gap turmaydi. Mas'ul: `pm-metodist` + `pm-quruvchi`. *(F-0727-61)*

86. 🔴 **EKRAN-MUSOR TAQIQI.** **(a)** tanlov-chiplar desktopda BITTA qatorga sig'adi (odatda ≤4 — 5-chip ikkinchi qatorga tushsa, bittasi olib tashlanadi; qaysi biri: tanlov ekranning CHO'QQISIDA qolsin); **(b)** izoh-qator faqat YANGI ma'no bersagina turadi (❌ «Bular — daftardan olingan o'z hikoyalaringiz» — kartalar o'zi ko'rinib turibdi); **(c)** MentorNote faqat ekran mexanikasida YO'Q yo'riq uchun — o'quvchi-matnda mavjud narsani takrorlasa o'chiriladi. Tekshiruv: har qatorga «bu qator olib tashlansa nima yo'qoladi?» savoli — javob «hech nima» bo'lsa, o'chiriladi. Mas'ul: `pm-metodist` + `pm-tekshiruvchi`. *(F-0727-59/60/62)*

**2026-07-28 BOSHLIQ-QARORI (87) — ikki-tur arxitekturasi bilan birga muhrlandi:**

87. 🔴 **KODING QISMI OLDINGI TEXNIK DARSLARDAN O'SADI (ikkala turda ham).** PM darsning koding-ekrani mustaqil topshiriq EMAS — u o'quvchi **allaqachon o'rgangan** texnik bilimni ishlatib ko'radigan joy, va u **qiziqarli qilib** shu darsning mavzusiga ulanadi. Shuning uchun koding loyihalashdan OLDIN majburiy savol: **«bu darsgacha bola texnikadan aynan nimani o'rgangan?»** — dastur tartibidagi oldingi texnik darslar (`src/App.jsx` `MODULES`) grep bilan tekshiriladi, va topshiriq FAQAT o'sha o'tilgan material ustiga quriladi (9.4-qonun). **(a)** o'tilmagan teg/atama/sintaksis topshiriqqa kiritilmaydi — hatto «oson» tuyulsa ham; **(b)** eng kuchli koding — texnik darsning o'zi **qoldirgan bo'shliqni** yopadigani (masalan nazariy o'rgatilib, praktikasi qilinmagan mavzu); **(c)** topshiriq PM-mavzu bilan texnik-material o'rtasidagi bog'lanishni **halol** ko'rsatadi — PM atamasi (hero, CTA, JTBD) HTML/JS tegi kabi ko'rsatilmaydi va aksincha; **(d)** kompilyator har faylda **o'zida** yoziladi (import YO'Q — LMS uchun o'zi-yetarli), dvijok manbasi `src/compilator/HtmlCompiler.jsx` yoki P0 `PmCompiler`, lekin qobiq va shartlar shu darsniki. Mas'ul: `pm-quruvchi`. *(2026-07-28 foydalanuvchi qarori; birinchi tatbiq — PmLesson2 HTML-struktura kompilyatori, manba-bo'shliq: `Htmllesson2.jsx:2562` «Struktura praktikasi olib tashlandi»)*

**2026-07-28 NAVBAT-PULSI (88) — onboarding-tur o'rniga:**

88. 🔴 **NAVBAT-PULSI — «hozir navbat kimda» signali (onboarding-tur O'RNIGA).** 📘 **Amaliy qaror-tartibi: 1-C bo'lim** (harakat-zanjiri → navbat → naqsh → tekshiruv). Quyidagi bandlar — normativ taqiqlar. Boshlang'ich tur (coach-mark onboarding) hamma narsani oldindan aytadi, o'quvchi esa kerak bo'lganda unutgan bo'ladi — shuning uchun u olib tashlanadi va o'rniga **lahzali affordans** qo'yiladi: bosilishi kerak bo'lgan element o'zi yonib, «navbat menda» deb turadi. Qat'iy 4 shart: **(a)** ekranda istalgan lahzada **FAQAT BITTA** element yonadi — navbat kimda bo'lsa, o'sha; harakat bajarilishi bilan puls darhol o'chadi va navbat keyingisiga (odatda «Davom etish»ga) o'tadi. **Ko'p variantli ro'yxatda — TO'LQIN:** variantlar birma-bir yonadi (kechikish ~0.7s, har biri ~0.4s), ya'ni lahzada baribir bittasi. 🔴 Bittasini ajratib yoritish **TAQIQ** — variantlar teng emas (biri to'g'ri, biri noto'g'ri), shuning uchun bittasini yoritish javobga undash bo'ladi; to'lqin esa hammasiga teng munosabatda. To'lqin **cheklangan** (~4 aylanish) — sekin o'qiyotgan o'quvchi cheksiz peripheral harakatdan charchamasin; **(a1)** 🔴 **IKKI NAQSH — vazifaga qarab tanlanadi:** **TO'LQIN** = ro'yxatdan BITTASI tanlanadi (ovoz, javob) — hammasi teng, birma-bir, cheklangan; **YURISH** = ro'yxatdagi HAMMASI ko'rilishi kerak (kartalar, bo'limlar, juftliklar) — puls faqat **bajarilmaganlar** bo'ylab aylanadi (~1.3s har biri, aylanish oxirida ~3s tanaffus va qaytadan), bajarilgani navbatdan **chiqadi**; masalan 5 tadan 1,2,5 ochilgan bo'lsa — 3 va 4 navbatlashadi. Yurish tartibi darsning o'z ketma-ketligiga ergashadi (`ORDER`/`PAIRS`), alifbo yoki DOM tartibiga emas. Yurish elementning boshqa navbatga o'tishi bilan **to'xtaydi** (masalan juftlik-mashqda bo'lim tanlangach — endi navbat vazifada, uni yoritish javobni aytib qo'yish bo'lardi); **(a2)** 🔴 **NAVBAT DARS MANTIG'IGA ERGASHADI, ekran tartibiga emas:** ekranda ikki qadam bo'lsa (avval solishtir, keyin javob ber), puls ham shu tartibda yuradi — birinchi qadam bajarilmaguncha ikkinchisi yonmaydi. Sukut bo'yicha ochiq turgan variant emas, **ko'rilmagani** yonadi; **(b)** puls **darhol emas**, ~2.6s harakatsizlikdan keyin chiqadi — o'zi bilgan o'quvchi darhol bosadi va pulsni **umuman ko'rmaydi** (yordam faqat ikkilanganga boradi); **(c)** 🔴 **ballanadigan testda javob berilgunga qadar puls YO'Q** — yonayotgan element maslahat kabi o'qilishi yoki o'quvchini shoshiltirishi mumkin (17-qonun, test halolligi); amalda bu o'z-o'zidan bajariladi, chunki test ekranida «Davom etish» javobgacha `disabled`; **(d)** **qulflangan/kutish holatidagi tugma yonmaydi** — jonli darsda mentorni kutayotgan o'quvchini bosib bo'lmaydigan tugmaga chorlash mumkin emas (83-qonun qulf-yo'lini beradi). **Ko'rinish:** o'lcham O'ZGARMAYDI — faqat yumshoq indigo halqa nafas oladi (UI sakramaydi, ixchamligicha qoladi); tugmada asosiy soya saqlanadi, boshqa elementlarda halqa alohida qatlamda (`::after`) chiziladi va layout'ni surmaydi; `prefers-reduced-motion` da butunlay o'chadi. **Yon-foyda:** «nima bosish» vazifasi pulsga o'tgani uchun **mentor gapi yo'riqnomadan ozod bo'ladi** va o'qitishga qaytadi (mentor — ekskursiya-yo'lboshchi emas). Mas'ul: `pm-quruvchi` + `pm-dizayn`. *(2026-07-28 foydalanuvchi g'oyasi va qarori; birinchi tatbiq — PmLesson2: `useTurnHint` + `.turn-hint`/`.turn-ring`)*

**2026-07-28 TAKRORLASH-YO'LI (89):**

89. 🔴 **PRAKTIKA-DARVOZASI FAQAT BIR MARTA YOPILADI — takrorlash bepul.** O'quvchi darsni uyda qayta ko'rganda praktikani QAYTA bajarishga majbur bo'lmaydi. **(a)** Bajarilganlik `localStorage` ga yoziladi (`{code, done:true}`) va ekran ochilganda holat TIKLANADI — o'sha brauzerda darvoza o'zi ochiq, kod ham saqlangan; **(b)** 🔴 **boshqa qurilma muammosi:** bola sinfda maktab kompyuterida bajargan bo'lsa, dastur buni **BILA OLMAYDI** — login yo'q, PIN esa dars tugagach yopiladi. Shu YAGONA holat uchun **takrorlash-yo'li** qo'yiladi: **(c)** u **matn-havola**, tugma EMAS va xira — asosiy harakat bilan raqobatlashmasin; **(d)** matni shartni ham, natijani ham aytadi: «✓ Bu mashqni sinfda bajarganman — davom etish →» (savol-shaklda YOZILMAYDI: «bajarganmisiz?» tugmasi nima bo'lishini aytmaydi — korpus §10); **(e)** 🔴 u **FAQAT eshikni ochadi**: nishon bermaydi · «bajarildi» deb yozmaydi · serverga signal yubormaydi · xotiraga saqlanmaydi (ya'ni keyingi seansda yana so'raladi — ataylab, aks holda u soxta «bajarildi» belgisiga aylanardi); **(f)** **faqat erkin (self) rejimda** ko'rinadi — jonli darsda va mentor ekranida YO'Q; bajarilgan bo'lsa ham ko'rinmaydi (darvoza allaqachon ochiq); **(g)** matn **umumiy** bo'ladi («davom etish»), «uy vazifasiga o'tish» EMAS — bir darsda bir nechta praktika bo'lishi mumkin va keyin nima kelishi har xil. **Sabab-tamoyil:** jonli darsda o'quvchi praktikani allaqachon o'tkazib yubora oladi (`optionalLive`) — demak erkin rejim jonlidan QATTIQROQ bo'lib qolmasligi kerak edi. Mas'ul: `pm-quruvchi`. 📌 **Texnik darslarga ham tegishli** (u yerda 3 praktika bor) — `DARS_ETALON.md` ga ko'chirilsin. *(2026-07-28 foydalanuvchi g'oyasi; birinchi tatbiq — PmLesson2 `ScreenCoding` `.stq-skip`)*

**2026-07-28 MENTOR EKRANI (90):**

90. 🔴 **MENTOR EKRANI — PROYEKTOR QONUNI.** Mentor ko'rinishi o'quvchi ko'rinishining nusxasi EMAS; u butun sinf ko'radigan sahna. 📘 **To'liq band-ma-band jadval: 1-D bo'lim** (13 element × mentor/o'quvchi × sabab). Ikki tayanch: **(a)** 🔴 **shaxsiy narsa proyektorda chiqmaydi** — nishon-hisoblagichi, yakuniy nishon-ro'yxati, shaxsiy ball-aylanasi; mentor rejimida ular mentorning O'Z bosishlarini sanaydi (u testga javob berolmaydi — `if (solved || isMentorLive) return;`), ya'ni proyektorda yolg'on son; **(b)** 🔴 **mag'lubiyat-tablosi chiqmaydi** — podiumdagi «📊 Savollar bo'yicha» (`0/4` kabi) kartasi **butunlay olib tashlanadi**, chunki butun sinf oldida ko'rsatish kamsitadi; mentorga bu ma'lumot dars PAYTIDA `MentorTestStats` orqali, o'z joyida beriladi. **(c)** Saqlanadi: to'liq-ekran nishon-bayrami (bu **lahza**, hisob emas), podium reytingi (sinf yutug'i), mentor-panellari, mentor-eslatmalari. **(d)** Qisqa qoida: **mentor ekrani = SAHNA (lahzalar) · o'quvchi qurilmasi = DAFTAR (hisob)**. Mas'ul: `pm-quruvchi` + `pm-dizayn`; tekshiruv: `pm-tekshiruvchi` 15-ov-bandi. 📌 Texnik darslarga ham tegishli — `DARS_ETALON.md` ga ko'chirilsin. *(2026-07-28 foydalanuvchi qarori; etalon-manba: `src/pm/PmUserStoryLesson.jsx` — u yerda qstats allaqachon yo'q; tatbiq: PmLesson2)*

**2026-07-29 BITTA MISOL-IP (91) — UserStory qayta qurilishidan chiqqan qonun:**

91. 🔴 **BITTA MISOL-IP — dars boshidan oxirigacha bitta olamda yuradi.** Ildiz-sabab: senariy blok-blok yozilganda har blok o'ziga alohida misol tanlaydi va dars «misol-zoopark»ka aylanadi (UserStory'da: hook milkshake → to'satdan YouTube/Telegram → yana milkshake — bola ipni yo'qotadi). Qoidalar: **(a)** 🔴 **hook obyekti = darsning o'qitish obyekti.** Hook qaysi olamni ochsa, teoriya o'sha olamda davom etadi (PmLesson2: OLX boshidan oxirigacha; UserStory: so'rov↔hikoya juftligi). Hook savoli javobsiz OSILIB QOLMAYDI — payoff darhol yoki keyingi ekranda; **(b)** **keys — alohida janr, BIR marta:** u o'zini voqea deb tanitib kiradi («Biznes olamidan mashhur voqea: …») va yakuni darsga QAYTADI (ko'prik-gap). Freymlangan keys «chetlanish» emas, «lahza» bo'lib qabul qilinadi; **(c)** **yon-misollar dars-ipiga bo'ysunadi** — «hayotiy misol» qonuni EKRAN darajasida emas, DARS darajasida qo'llanadi: har ekran o'zicha yangi ilova/mahsulot tanlamaydi; **(d)** tekshiruv-usuli: misol-nomlarini (mahsulot/brend) grep qilib ekran-ma-ekran xaritalang — ip bir chiziq bo'lsin, arqon emas. Mas'ul: senariy-bosqichi (GATE S) + `pm-metodist` + `pm-tekshiruvchi`. *(2026-07-29 foydalanuvchi tashxisi: «dars bir-biriga bog'liqmas»; birinchi tatbiq — UserStory: hook «ikki mijoz so'rovi»ga qayta qurildi, klinika → DASTURCHI-SINOVI, milkshake faqat freymlangan keys'da)*

## 5. ✅ QABUL-CHECKLIST
`pm-qabulchi` 20-bandi (rol faylida) + rollar DoD. Yakuniy jonli-sinov QO'LDA: yangi PIN + 2 o'quvchi + MENTOR-2026 → podium/arena 0 EMAS.

🖥 **Mentor ekrani darvozasi (90-qonun · 1-D bo'lim):** dars **mentor rejimida** ochilib, 1-D jadvalining 13 bandi tasdiqlanadi. Qisqa nazorat: nishon-hisoblagichi YO'Q · yakuniy nishon-ro'yxati YO'Q · «📊 Savollar bo'yicha» kartasi YO'Q (+ CSS qoldig'i ham) · shaxsiy `ScoreRing` YO'Q · to'liq-ekran nishon-bayrami BOR · `MentorTestStats`/`MentorPracticeStats` BOR · test javobi reveal'gacha yashirin.

🔔 **Navbat-pulsi darvozasi (88-qonun · 1-C bo'lim) — har interaktiv ekranda:** harakat-zanjiri yozilgan · navbat birinchi bajarilmagan halqada · sukut bo'yicha ochiq element YONMAYDI (ko'rilmagani yonadi) · bir lahzada MAKS 1 · ~2.6s kechikish · ballanadigan testda javobgacha yo'q · qulflangan tugma yonmaydi · `prefers-reduced-motion` da o'chiq. Dasturiy o'lchashda `::after` opacity tuzog'iga tushmang (1-C.7).

## 6. 🏭 YANGI DARS RETSEPTI
1) Kirish-ma'lumot (`PM_PIPELINE_STATE.md` jurnalidan: ishlatilgan keyslar + oldingi mexanika) → senariy (PM_Prompt_v8) → pm-metodist KORREKTURA → [GATE S].
2) pm-quruvchi (P0'dan primitivlar, 3-bo'lim xaritasi; kontent yangi) → pm-dizayn (identitet 1-bo'lim; imzo-vizual har darsda YANGI) → darslik-jonli → pm-metodist → pm-tekshiruvchi → darslik-verifikator → pm-qabulchi.
3) Bosh-agent har o'tishda skript-darvoza (QOIDA 10); parallel partiyada har agent NOYOB scratch-katalog (QOIDA 11).
4) App.jsx ulash + vite build + jurnal yangilash. Commit faqat buyruq bilan.
