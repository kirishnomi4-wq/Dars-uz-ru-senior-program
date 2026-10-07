# 11-Modul — 2-to'lqin quruvchi topshirig'i (14 dars)

> Tayyorlangan: 06.10.2026 ~15:30 (pilot 01 + 10 foydalanuvchi ko'rigidan o'tdi). Yuborish — YANGI seansda, foydalanuvchi «2-to'lqinni boshla» degandan keyin.
> Agent ruxsati alohida so'raladi (nechta · nima · qaysi fayl · vaqt) — `agentlar-faqat-ruxsat-bilan`. Commit, push, deploy — YO'Q.
> Har agentga: shu fayl + o'z darsining qatori. Har agent — faqat o'z fayli. MD ga tegilmaydi (kerak bo'lsa — hisobotda «MD ga taklif»).

## Darslar va fayllar

| To'lqin | Dars | Kalit | Fayl (`src/9-Modull/`) | MD (`feedback/F-1005-11modul/`) | Turi | Palitra | Eng yaqin namuna (faqat ko'rish) |
|---|---|---|---|---|---|---|---|
| A | 2 | m9-02 | `PmIdeaRiceLesson.jsx` | `02-PmIdeaRice-v3.md` | PM | `pm` | 11-Modul `PmTenIdeasLesson.jsx` (pilot, qayta ishlangan) |
| A | 3 | m9-03 | `PmInterviewsOneLesson.jsx` | `03-PmInterviewsOne-v3.md` | PM | `pm` | shu |
| A | 4 | m9-04 | `PmFinalIdeaLesson.jsx` | `04-PmFinalIdea-v3.md` | PM | `pm` | shu |
| A | 5 | m9-05 | `PmPrdLesson.jsx` | `05-PmPrd-v3.md` | PM | `pm` | shu |
| A | 6 | m9-06 | `PmRoadmapLesson.jsx` | `06-PmRoadmap-v3.md` | PM | `pm` | shu |
| B | 7 | m9-07 | `LivePrototypeLesson.jsx` | `07-LivePrototype-v3.md` | Kod + 2 blok | `tex` | 11-Modul `FoundationDayLesson.jsx` (pilot) |
| B | 8 | m9-08 | `PlatformChoiceLesson.jsx` | `08-PlatformChoice-v3.md` | Kod | `tex` | shu |
| B | 9 | m9-09 | `ExpoPrototypeLesson.jsx` | `09-ExpoPrototype-v3.md` | Kod + 2 blok | `tex` | shu |
| B | 11 | m9-11 | `FeatureOneLesson.jsx` | `11-FeatureOne-v3.md` | Loyiha kuni | `tex` | shu |
| B | 12 | m9-12 | `FeatureTwoLesson.jsx` | `12-FeatureTwo-v3.md` | Loyiha kuni | `tex` | shu |
| C | 13 | m9-13 | `PmAudienceTestLesson.jsx` | `13-PmAudienceTest-v3.md` | PM + amaliyot | `pm` | ikkala pilot |
| C | 14 | m9-14 | `FeatureThreeLesson.jsx` | `14-FeatureThree-v3.md` | Loyiha kuni | `tex` | `FoundationDayLesson.jsx` |
| C | 15 | m9-15 | `PmOneOnOneLesson.jsx` | `15-PmOneOnOne-v3.md` | PM (12 ekran, DARS-q1 A) | `pm` | `PmTenIdeasLesson.jsx` |
| C | 16 | m9-16 | `PmPrototypePitchLesson.jsx` | `16-PmPrototypePitch-v3.md` | PM | `pm` | shu |

Taklif: A (5) → tekshiruv → B (5) → tekshiruv → C (4). Foydalanuvchi boshqacha desa — shunday.
**Yuborishdan oldin asosiy seans (agentsiz):** har fayl — `cp src/skelet/NamunaDars.jsx src/9-Modull/<Fayl>`, `lessonId` (`pm-m9dN-v1` PM uchun / `m9-NN-v1` texnik), LiveGate sarlavhasi `tr(LESSON_META.lessonTitle)`,
**`.zoom-on` CSS qoidasi** (skeletda yo'q — F-1006-271; pilot fayldan nusxa), App.jsx `// ---- 9-Modul` blokiga import + `m9-NN` qatoriga `comp` (aniq Edit, esbuild).

## O'qish tartibi (har agent)
1. `QURUVCHI_SABOQ.md` — A, B (9 va 10-Modul saboqlari, ular ko'rsatgan fayllar bilan), C (11-Modul kelishuvlari), **D 32–39 (11-Modul pilot ko'rigi — eng yangi, qat'iy)**.
2. Fidbek rasmlari: `rasm/F-1006-270-1dars-01…14.png` (hammasi) + 10-Modul `feedback/F-1005-10modul/rasm/` (o'z ekran turingizga o'xshashi).
3. `konveyer/2-QURUVCHI.md` + o'z MD (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1–3, 5–9; 9.100–101) + `00-TAQIQLAR.md` + o'z `NN-FILTR.md`.
4. Pilot fayllar — qanday yechilganini ko'rish: halqa (yengil, guruhda bitta), `Odam` chizmasi, manba ↔ karta bog'lanishi, kod tekshiruvi (ma'lumotdan mustaqil), QBlok, `FdPrompt` («masalan»), `Ortda` (faqat A1). Kod ko'chirilmaydi.

## Darsga xos eslatmalar
- **2:** 6 g'oya (9.100): saralash 6 → 5 → 4, RICE 4 → uchta (24 · 20 · 5). `pm-m9d1-goyalar` ni o'qiydi (6 ta).
- **7, 9, 11, 12, 14:** «Ortda qoldingizmi» — faqat A1 da (SABOQ 39). Trek — `pm-m9d8-platforma`.
- **13:** `pm-m9d13-sinov` sxemasi — tayanch 9.90. **15:** `pm-m9d15-reja` (+ `eng`, `birinchi`) — 9.96; Mentor varag'i — ikki holatli matn (KOD 4). **16:** 13 va 15 kalitlarini o'qiydi; kutish yozuvi — 9.95.

## To'lqin A saboqlari (06.10 19:20, F-1006-274…277) — B va C uchun QAT'IY
1. **«Maydon Jamoa» rangi — `#2E9E4F`** (tayanch 9.62, aniq qiymat). Boshqa yashil tanlanmaydi; PM `ok` (`#1F7A4D`) bilan aralashtirilmaydi.
2. **Har holat 1280×800 ga sig'adi — ish jarayonida ham.** A da 4 darsda xulosa/natija bloki yoki «Saqlash» tugmasi pastki panel ostiga tushdi (skroll kerak bo'ldi). Suratni `SHOT_H=800` bilan oling (773 emas);
   ekrandagi asosiy tugma va oxirgi blok ko'rinmasa — joylashuvni tuzating (ixcham qator, ikki ustun, yig'ish), MD matniga tegmasdan.
3. **Mentor/Yordam/Xato matni ekranda bor narsaga ishora qilsin.** A da MD «doskaning Kim qatoriga qarang» der edi, doskada bunday qator yo'q edi. Shunday joy topsangiz — hisobotda «MD ga taklif»ning BIRINCHI bandi.
4. **`gates` dagi ⚠ tell** (to'g'ri variant savol so'zini yolg'iz takrorlaydi / atama faqat to'g'ri variantda) — error bo'lmasa ham tuzating (bitta noto'g'ri variantga so'z qo'shish yoki to'g'risidan olish), «MD ga taklif»da aynan yozing.
5. **Oxirgi tahrirdan keyin darvoza + surat.** Bash ishlamay qolsa (classifier «no verdict») — yangi tahrir qilmang; hisobotning birinchi qatorida «tekshirilmagan tahrirlar: …» deb yozing.
6. Headless suratlarda kirish animatsiyasi kech boshlanadi — `SHOT_WAIT=2500`. Seed bilan bosish — `scratchpad/02-qurish/shot.mjs` naqshi (`SEED`, `OUT`, `fill:sel|qiymat`, `wait:ms`).
7. Kalit sxemalari — tayanch 8 jadvali aynan: `pm-m9d7-wireframe` = `{ funksiya, ekranlar: [{ nom, nima, tugma }] (2–3) }` · `pm-m9d8-platforma` = `{ trek: 'web' | 'mobil', javoblar: [4], halQiluvchi: [1–2], asos }` ·
   `pm-m9d6-roadmap.hozir` — 1/2/3-asosiy funksiya tartibida (11, 12, 14-darslar shundan o'qiydi). Kalit yo'q bo'lsa ham ekran ishlaydi (Mentor misoli bilan).

## To'lqin B saboqlari (06.10 20:15, F-1006-279…281) — C uchun QAT'IY
8. **Mentor gapi har holatda NAVBATDAGI harakatni aytadi** — oraliq holatlar ham: bashoratdan keyin, ikki qadam orasida («Keyingi o'yin ›»ni bosing), tugagandan keyin, blok 4/4 bo'lgach.
   Pastki tugma yorlig'i ham shu harakatni aytadi; tepada sanoq (masalan «O'yin 1 / 3») bo'lsa — pastki yorliqda «(N/3)» takrorlanmaydi. MD da oraliq gap bo'lmasa — MD uslubida yozing, «MD ga taklif»da aynan bering.
9. **Kalitga bog'liq gap kalit yo'q holatda yolg'on bo'lmasin.** «qavslar … yozuvingizdan to'ldirilgan», «tanlovingiz allaqachon talabda» — kalit bo'lmasa (yoki joy ataylab bo'sh bo'lsa) ikkinchi gap chiqadi.
10. **Halqa — fayldagi yengil variant** (B darslaridagidek: scale ≤ 1.03, shaffoflik ≤ 0.35, sikl ≥ 2.4 s). Qolipdagi `.q-halqa` (1.06 / 1.6 s) SABOQ 32 dan kuchli — qolipga tegilmaydi, faylda o'z klassingiz.
11. **O'quvchi matniga ichki belgilar chiqmaydi:** «A1 dagidek», «9.29», «06.10 da sinab ko'rilgan», «(support.apple.com, 06.10)» — bular MD izohi; ekranga — faqat o'quvchi uchun gap.
12. `lint:layout` dev-server talab qiladi — yurmasa hisobotda bir qator, surat 1280×800 + 393 bilan almashtiriladi.

## Tekshiruv va hisobot (har agent)
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` 0 · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` · ⛶ bosib sinaladi.
- Suratlar 1280 va 393 (`konveyer/vositalar/shots.mjs`; bosishlar — `.shot10.tmp.mjs` yoki `scratchpad/01-qurish/shot.mjs` naqshi), har biri Read bilan, «4/4» (SABOQ 30).
- Vaqtinchalik fayllar — `scratchpad/<NN>-qurish/`. Turn-byudjeti ≤ 150. Savol bermang.
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar · KOD band-band · darvozalar aynan · MD ga taklif · qolip taklifi · RU-qarz · surat yo'llari · hal bo'lmagan joylar.
