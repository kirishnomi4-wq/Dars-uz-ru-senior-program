# 10-Modul — pilot quruvchi topshirig'i (2 dars, 2 agent)

> Foydalanuvchi ruxsati: 05.10.2026 ~19:00 — «1 va 2 qadamlarni ketma-ket avtopilotda» (2 agent: 2-dars va 10-dars; har biri faqat o'z fayli + MD si).
> Har agentga shu fayl + o'z darsining qatori beriladi. Commit, push, deploy — YO'Q.

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/8-Modull/`) | MD (`feedback/F-1005-10modul/`) | Ekran | Turi | Palitra | Pilot-naqsh (faqat ko'rish, kod ko'chirilmaydi) |
|---|---|---|---|---|---|---|---|
| 2 | m8-02 | `EventTrackingLesson.jsx` | `02-EventTracking-v3.md` | 18 | TEX + 2 blok | `qolipRang('tex')` | 9-Modul 7-dars `src/7-Modull/MvpFirstScreenLesson.jsx` (QBlok), 1-dars `PmProductProblemLesson.jsx` (QKod, kartochka) |
| 10 | m8-10 | `PmYearPathLesson.jsx` | `10-PmYearPath-v3.md` | 16 | PM (2-tur) | `qolipRang('pm')` | 9-Modul 1-dars `src/7-Modull/PmProductProblemLesson.jsx` (QVoqea, QMustaqil, QKod, kartochka) |

Fayl skeletdan oldindan nusxalangan (`lessonId` — MD KOD 1 dagidek: `m8-02-event-tracking-v1` / `pm-m8d10-yol-v1`) va App.jsx ga ulangan — `http://localhost:5173` menyusida «10-Modul» ostida o'z darsingiz ochiladi.

## O'qish tartibi
1. `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` va u ko'rsatgan `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` — MAJBURIY qoidalar (foydalanuvchining pilot fidbeki).
2. `konveyer/2-QURUVCHI.md` (qoidalar, tartib, darvozalar, hisobot) + o'z darsi MD si (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1–3, 5–9-bo'limlar) + `00-TAQIQLAR.md` + `GATE_M_JAVOB.md`.
3. Skelet `src/skelet/NamunaDars.jsx` (faylingiz — uning nusxasi) va `src/qolip/QOLIP.md`.
4. Pilot-naqsh fayllari — faqat qanday yechilganini ko'rish uchun (grep/sed oraliq); kod bo'lagi ko'chirilmaydi (`konveyer-yagona-yol`).
   Brend/keys sahnasi (10-dars Uzum): `src/6-Modull/PmLesson22.jsx` `AltairMock`, `src/6-Modull/PmLesson25.jsx` `DeckMock`.

## Skelet tuzoqlari (o'z faylingda hal qil, skeletga tegma)
- Test savolidagi «To'g'ri javobni tanlang» eyebrow — yozilmaydi (SABOQ 6; skelet 642-qator).
- `bashorat={!taxmin && …}` (skelet 623) — ishlatilmaydi: bashorat tanlangach ixcham qator bo'lib qoladi (SABOQ 11).
- `practice: ou(title)` → `ou(eyebrow)` · `QZ_BG_SHAPES` — darsning o'z atamalari, emoji va «Frontend/Backend» yo'q · `rgba(255,79,40,…)` → `fon(T.accent)`.
- `QKod` o'ng ustun propi til-lint ga tushadi — 9-Modul 1-dars `QKOD_ONG` doimiysi yechimi (izohi bilan).
- Kartochka ekrani — alohida (`sflash`), Mentorsiz, «Kartani bosing — javob ochiladi» (SABOQ 12, 16).
- Kod oynasi qoralamasi (MD KOD dagidek): `storageKey="pm-m8d10-code"` (10-dars) · `storageKey="m8d2-code"` (2-dars).

## Darsga xos eslatmalar
- **2-dars:** QKod (8-ekran) — `HtmlCompiler` ko'p fayl (MD KOD 6: `index.html`, `maydon.js` tayyor · `app.js` o'quvchi) va yashirin runtime tekshiruvlari — MD dagidek;
  amaliyot bloklari A1, A2 — `QBlok` (9-Modul 7-dars A1 shakli, SABOQ 14), repo teglari `m10-dars-02-start` / `m10-dars-02-done` (tayanch 3), «Ortda qoldingizmi» qatori MD dagidek.
- **10-dars:** `YilChizigi` — bitta vizual (to'liq · ixcham · kengaygan · voqea); 2-ekran kartalari bittadan (SABOQ 9); 6-ekran Uzum — nom o'z rangida, tanish maket, bosqich gapi Mentorda (SABOQ 2, 3, 8);
  `pm-m8d10-yol` = `{ loyihalar: [{ modul, nom, nima }], keyin, keyinModul, savedAt }`; 9/10-ekran tekshiruv funksiyalari PM-108 tartibida `node` da namunalar bilan sinaladi (MD KOD 10, 11).

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` — faqat o'z faylingiz bo'yicha 0 · `npm run -s lint:til -- <fayl>` 0 error.
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` (hamma ekran «xato: yo'q»), harakatli ekranlar 393 kenglikda ham (`SHOT_W=393`);
  har suratni Read bilan ko'z bilan ko'ring; brend/keys ekrani m6-02 / m6-14 bilan yonma-yon («namuna bilan solishtirildi: ekran N»).
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/` (boshqa agent scratchpad'ni baham ko'radi).
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali · KOD ro'yxati · darvozalar aynan · MD dan chetlashishlar va «MD ga taklif» (SABOQ 15) · RU-qarz · faylingizdan tashqari ishlar.
- Turn-byudjeti ≤ 110; faylni qayta-qayta to'liq o'qima (grep/sed oraliq). Savol bermang — ikkilansangiz MD ga eng yaqin yechim va hisobotda yozing.
