# 10-Modul — 2-to'lqin quruvchi topshirig'i (9 dars, har dars — bitta agent)

> Foydalanuvchi ruxsati: 06.10.2026 ~00:00 — «rejang maqul … avtopilot, agentlarni ishlatib, barcha 10-M darslarni sifatli yaratasan».
> Har agent — faqat o'z fayli. MD ga tegilmaydi (taklif — hisobotda). Commit, push, deploy — YO'Q. App.jsx — tegilmaydi (ulangan).

| Dars | Kalit | Fayl (`src/8-Modull/`) | MD (`feedback/F-1005-10modul/`) | Tur |
|---|---|---|---|---|
| 1 | m8-01 | `PmOkrLesson.jsx` | `01-PmOkr-v3.md` | PM |
| 3 | m8-03 | `LiveDashboardLesson.jsx` | `03-LiveDashboard-v3.md` | Loyiha kuni (amaliyot) |
| 4 | m8-04 | `PmAbTestLesson.jsx` | `04-PmAbTest-v3.md` | PM + amaliyot |
| 5 | m8-05 | `SecurityBasicsLesson.jsx` | `05-SecurityBasics-v3.md` | TEX + 2 blok |
| 6 | m8-06 | `PmTrustAuditLesson.jsx` | `06-PmTrustAudit-v3.md` | PM + amaliyot |
| 7 | m8-07 | `ProductionDeployLesson.jsx` | `07-ProductionDeploy-v3.md` | TEX + 2 blok |
| 8 | m8-08 | `ProdUpgradeLesson.jsx` | `08-ProdUpgrade-v3.md` | Loyiha kuni (amaliyot) |
| 9 | m8-09 | `ProdReviewLesson.jsx` | `09-ProdReview-v3.md` | Loyiha kuni (amaliyot) |
| 11 | m8-11 | `PmPitchRehearsalLesson.jsx` | `11-PmPitchRehearsal-v3.md` | PM |

Fayl skeletdan oldindan nusxalangan va App.jsx ga ulangan (`http://127.0.0.1:5173/#/lesson/m8-NN`). Nusxada allaqachon: `LESSON_META.lessonId` (MD KOD dagidek),
`LiveGate` sarlavhasi `tr(LESSON_META.lessonTitle)`, ekran hisobi `nowrap`, ⛶ telefonda alohida qatorda. **`lessonTitle.ru` — vaqtinchalik «RU: …»: MD dagi ruscha nom bilan almashtiring.**

## O'qish tartibi
1. **`QURUVCHI_SABOQ.md` — TO'LIQ (A, B va ayniqsa C 19–30).** C qismi — foydalanuvchining pilotlarga 22 rasmli fidbeki; rasmlar `rasm/F-1005-174-*`, `rasm/F-1005-175-*` — o'z ekran turingizga o'xshashlarini Read bilan ko'ring.
   Pilotlarning birinchi versiyasi aynan shu xatolar bilan rad etildi: jonsiz, bo'sh ustun, ko'p element, mayda vizual, telefon o'rtada, yakunda to'plangan qatorlar.
2. `konveyer/2-QURUVCHI.md` + o'z MD ingiz (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1–3, 5–9) + `00-TAQIQLAR.md` + `GATE_M_JAVOB.md`.
3. Skelet `src/skelet/NamunaDars.jsx` va `src/qolip/QOLIP.md`.
4. Namuna (faqat ko'rish, kod ko'chirilmaydi): jonli sahna — `src/6-Modull/PmLesson22.jsx` `AltairMock`, `src/6-Modull/PmLesson25.jsx` `DeckMock`;
   amaliyot bloki — 9-Modul 7-dars `src/7-Modull/MvpFirstScreenLesson.jsx` A1 (QBlok); kod, kartochka — `src/7-Modull/PmProductProblemLesson.jsx`.
   **10-Modul pilotlari qayta qurildi va qabul qilindi (06.10 00:55, F-1005-178) — endi ular NAMUNA:** TEX/loyiha darslari uchun `EventTrackingLesson.jsx`
   (telefon = sayt, telefon chapda va barqaror, so'rov konverti uchishi, navbat bilan yuborish 5-ekran, mini-telefon 9-ekran, bitta natija bloki); PM darslari uchun `PmYearPathLesson.jsx`
   (jonli chiziq, bitta katta karta 10-ekran, qadamlar 11-ekran, natija oldindan ko'rinishi 12-ekran). Naqshni ko'ring (grep/sed oraliq), kod bloklarini ko'chirmang — o'z darsingizga moslab yozing.

## Skelet tuzoqlari (o'z faylingda hal qil, skeletga tegma)
- Test savolidagi «To'g'ri javobni tanlang» eyebrow — yozilmaydi (SABOQ 6). `bashorat={!taxmin && …}` — ishlatilmaydi (SABOQ 11).
- `practice: ou(title)` → `ou(eyebrow)` · `QZ_BG_SHAPES` — darsning o'z atamalari · `rgba(255,79,40,…)` → `fon(T.accent)` · `QKod` o'ng ustun propi — `QKOD_ONG` doimiysi (9-Modul 1-dars).
- Kartochka ekrani alohida (`sflash`), Mentorsiz (SABOQ 12, 16). Kod oynasi qoralamasi — MD KOD dagi `storageKey`.

## 5 va 8-darslar — texnik tanlov (QAROR 10M-58, foydalanuvchi tasdig'i 05.10)
- **5-dars:** 2FA — `otpauth` 9.5.2: `new OTPAuth.TOTP({ issuer: 'Maydon', label: 'ega', secret: process.env.EGA_2FA_KALITI })`,
  tekshiruv `totp.validate({ token: kod, window: 1 }) !== null` (±30 s; `if (totp.validate(...))` — XATO: to'g'ri kod `0` qaytaradi).
  Kalit: `npm run kalit:2fa` — kalit qatori + terminalda QR (`qrcode` 1.5.4, `toString(uri, { type: 'terminal', small: true })`), QR o'qilmasa — kalitni qo'lda kiritish (README zaxira).
  Kutubxona nomi o'quvchi matnida yo'q — README va Yordam namunasida (P-060).
- **8-dars:** chegara — `@nestjs/throttler` 6.7.1: `ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 60 }], errorMessage: "Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.", getTracker })`,
  uch yo'lga `@UseGuards(ThrottlerGuard)` + `@Throttle({ default: { limit: N, ttl: 60_000 } })` (5 · 10 · 60). `{proksi usuli}` = `getTracker: (req) => req.headers['cf-connecting-ip'] ?? req.ip`
  (Render oldida Cloudflare; Render'da sinov kutilmoqda — vaqtincha muzlatilgan).

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` (o'z faylingiz) 0 · `npm run -s lint:til -- <fayl>` 0 error.
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` (hamma ekran «xato: yo'q») va `SHOT_W=393` da ham.
  Ekran ichidagi holatlar: `cd /home/kali/Desktop/internetLesson && CHROME=/usr/bin/google-chrome SHOT_W=1280 SHOT_H=800 CLICK='sel1,sel2' CLICK_WAIT=1500 node .shot10.tmp.mjs <fayl> <ekran>`.
  Har suratni Read bilan ko'z bilan ko'ring; har ekran uchun SABOQ 30 «4/4» hisobotda.
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/`.
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali (+ «4/4») · KOD ro'yxati · darvozalar aynan · MD dan chetlashish va «MD ga taklif» · RU-qarz · faylingizdan tashqari ishlar.
- Turn-byudjeti ≤ 130; faylni qayta-qayta to'liq o'qima (grep/sed oraliq). Savol bermang — ikkilansangiz MD ga eng yaqin yechim va hisobotda yozing.
