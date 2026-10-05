# 9-Modul — 2-to'lqin quruvchi topshirig'i (10 dars)

> Har agentga shu fayl + o'z darsining qatori beriladi. Yuborish — foydalanuvchi «ha» dan keyin (QURISH_REJA 2-to'lqin).
> Pilotlar (1 va 7-dars) ko'rigidan chiqqan yangi saboqlar `QURUVCHI_SABOQ.md` ga qo'shiladi — agent uni yuborilgan paytdagi holatida o'qiydi.

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/7-Modull/`) | MD | Ekran | Turi | Pilot-namuna |
|---|---|---|---|---|---|---|
| 2 | m7-02 | `PmFiveInterviewsLesson.jsx` | 02-PmFiveInterviews-v3.md | 16 | PM | 1-dars |
| 3 | m7-03 | `PmInterviewMvpLesson.jsx` | 03-PmInterviewMvp-v3.md | 17 | PM | 1-dars |
| 4 | m7-04 | `MvpArchitectureLesson.jsx` | 04-MvpArchitecture-v3.md | 18 | AI | 1-dars + 7-dars (repo) |
| 5 | m7-05 | `AnimationLesson.jsx` | 05-Animation-v3.md | 20 | AI | 1-dars + 7-dars (repo) |
| 6 | m7-06 | `PmAnalyticsDayOneLesson.jsx` | 06-PmAnalyticsDayOne-v3.md | 12 | PM+PRAKT | 7-dars |
| 8 | m7-08 | `PmDesignMotionLesson.jsx` | 08-PmDesignMotion-v3.md | 12 | PM+PRAKT | 7-dars |
| 9 | m7-09 | `MvpCompleteLesson.jsx` | 09-MvpComplete-v3.md | 12 | Loyiha kuni | 7-dars |
| 10 | m7-10 | `PmUsabilityTestLesson.jsx` | 10-PmUsabilityTest-v3.md | 16 | PM | 1-dars |
| 11 | m7-11 | `MvpIterationLesson.jsx` | 11-MvpIteration-v3.md | 12 | Loyiha kuni | 7-dars |
| 12 | m7-12 | `PmUserStoryPitchLesson.jsx` | 12-PmUserStoryPitch-v3.md | 16 | PM | 1-dars |

## O'qish tartibi
1. `QURUVCHI_SABOQ.md` — majburiy qoidalar (pilot fidbeki).
2. `konveyer/2-QURUVCHI.md` + o'z darsi MD si + `00-MODUL-TAYANCH.md` (1–3, 5–6-bo'limlar) + `GATE_M_JAVOB.md`.
3. Skelet `src/skelet/NamunaDars.jsx`. Pilot-namuna fayli faqat naqsh uchun ko'riladi, kod bo'lagi ko'chirilmaydi (`konveyer-yagona-yol`).
4. Brend yoki keys sahnasi bo'lsa: `src/6-Modull/PmLesson22.jsx` `AltairMock`, `src/6-Modull/PmLesson25.jsx` `DeckMock`.

## Pilotlarda topilgan skelet tuzoqlari (o'z faylingda hal qil, skeletga tegma)
- Test savolidagi «To'g'ri javobni tanlang» eyebrow — yozilmaydi (SABOQ 6).
- `practice: ou(title)` ccProgress ga JSX yozadi — `ou(eyebrow)` (7-dars pilotidagi yechim).
- Arena foni `TOK` / `QZ_BG_SHAPES` — darsning o'z atamalaridan; «Frontend/Backend» va emoji yo'q.
- Skeletdagi `rgba(255,79,40,…)` soyalari — `fon(T.accent)`.
- `HtmlCompiler` qoralamasi: `storageKey="pm-m7dN-code"` (6-Modul naqshi; tayanch 6 ga men yozaman).
- `QKod` ning o'ng ustun propi til-lint ga tushadi — 1-darsdagi `QKOD_ONG` doimiysi va izohi bilan beriladi; qoida tuzalgach olinadi (MEXANIZM-TAKLIF 10).
- Juftlik ekranlarida yakka rejim uchun Mentor gapining qisqa varianti bo'ladi (MD da bo'lmasa — hisobotda «MD ga qo'shilsin»).
- Repo darslari (4–11): boshlang'ich va namuna teglari tayanch 3-jadvaldan (`dars-NN-start` / `dars-NN-done`); eski teg nomlari yozilmaydi.

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` 12/12 · `npm run lint:jsx` 0 · `node til-lint.mjs <fayl>` 0 error.
- Surat: 1280×773 har ekran (boshlang'ich + harakatdan keyin), 393 kenglikda harakatli ekranlar; har birini ko'z bilan ko'rish; brend/keys ekranlari m6-02 / m6-14 bilan yonma-yon («namuna bilan solishtirildi: ekran N»).
- Hisobot: ekranlar jadvali · KOD ro'yxati · darvozalar aynan · MD dan chetlashishlar · faylingdan tashqari kerak bo'lgan ishlar (App.jsx — men ulayman).
- Turn-byudjeti ≤ 110; faylni qayta-qayta to'liq o'qima (grep/sed oraliq).
