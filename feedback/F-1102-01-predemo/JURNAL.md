# F-1102-01 — Demo Day oldidan PM darsi juda uzun (mentor fidbeki)

## 02.11.2026 11:36 · Tashxis + MD v3
- **Fidbek (mentor):** «Frontend-React pre demo day mavzusi juda cho'zilib ketibdi, 16 ta slayd. Demo Day'ga kerak bo'ladigan asosiy
  tushunchalarni berib, qolganini olib tashlash kerak. Bolalar pitch qilishga ulgurmayapti».
- **Dars:** m3-14 `src/3-Modull/PmLesson10.jsx` «Ishlayotgan saytingizni qanday ko'rsatasiz?» (LMS v6, 29.10).
- **Tashxis:** senariy vaqti 82 + 8 bufer = 90 daq — chiqishga vaqt rejalanmagan; senariyda «mikrofon/taymer YO'Q» (M1-D14 dan farq uchun)
  — bola sinf oldida chiqmaydi; 16 ekrandan 7 tasi Demo Day uchun shart emas (s2–s3 takror, s6–s7 Airbnb, s10 VS Code, s12, s14).
- **Foydalanuvchi qarori:** «olib tashlaymiz, haqiqiy darsga aylantiramiz, keraksizi kerak emas; boshqa darsda ham shu muammo bo'lsa navbat bilan».
- **Qilindi:** MD v3 — `15-PmLesson10-v3.md` (16 → 10 ekran, yangi s16 «Sahna»). `.jsx` ga tegilmagan.
- **Holat:** GATE M kutilmoqda.
- **Sinf-supurish (o'lchov):** Demo Day oldidan PM darslari — PmLesson3 10 · PmLesson6 11 · PmLesson10 16 · PmLesson14 16 → navbatdagi: PmLesson14 (m4-15).

## 02.11.2026 11:52 · GATE M tasdiqlandi → kod
- **Qaror:** foydalanuvchi «maqul, tasdiqlayman». Ochiq 3 savol tavsiya bo'yicha: har bolaga 2 daqiqa · kartochkalar chiqdi · Sahna podiumdan keyin.
- **Kod (`src/3-Modull/PmLesson10.jsx`, 3524 → ~3000 qator):** s2, s3, s6, s7, s10, s12, s14 va ularning CSS'i o'chirildi; yangi `ScreenSahna` (s16) —
  uch kadr kartasi (o'qish holati, «✎ Tahrirlash» → s8), tinglovchi kartasi, yakkada 2 daqiqalik taymer, mentorda katta taymer + «Ko'rsatganlar»
  (`MentorPracticeStats`), «Ko'rsatdim» → `sahna: -1` ishtirok-signali. RECAPS/Q_LABELS qayta indekslandi (3, 6); INLINE_KEYS; nishon 4 → 3
  (nishon to'ri 3 ustun); CodeStrike: 3 savol almashdi (✔ A/B/D saqlandi); yakun sarlavhasi va MentorNote; `onGo` prop (s8 ga qaytish).
- **Darvozalar:** gates 12/13 — esbuild · undef · jsx · keys · dark · til · tell · olchov · narrow · qolip · prompt ✓;
  🔴 emoji — 3 ta ESKI topilma (s4 · s8 · s9, o'zgartirilmagan ekranlar; HEAD da 5 ta edi, Sahna 4 ta limit ichida). `lint:jsx` 0 · `lint:til` 0 error ·
  ru-walk 10/10 TOZA. Suratlar: 1280 (10 ekran) · Sahna kadr bilan/bosilgan/bo'sh · 390 · ru 1366 — scratchpad.
- **Holat:** UNCOMMITTED. LMS'ga chiqarilmagan (v6 turibdi) — buyruq bilan G retsepti + CRM'da CodeStrike savollari (3 ta yangi).
- **Mentor rejimi** (proyektor taymeri) jonli sessiyasiz suratga olinmadi — jonli sinovda ko'riladi.
- **Navbatdagi (sinf-supurish):** m4-15 `PmLesson14` (16 ekran).

## 02.11.2026 · Foydalanuvchi qarori + navbatdagi dars
- **Qaror:** LMS'ga yuklash va Learn'dagi CodeStrike savollarini tahrirlash — **oxirida, hamma darslar bilan birga**. Hozir faqat darslar tuzatiladi.
- **m4-15 `src/4-Modull/PmLesson14.jsx`** — tashxis: m3-14 bilan bir qolip (16 ekran, 82 + 8 = 90 daq, «sahna-taymeri YO'Q»).
  MD v3: `16-PmLesson14-v3.md` (16 → 11 ekran: s3, s6–s7 Airbnb, s10 VS Code, s12, s14 chiqadi; s16 Sahna). GATE M kutilmoqda. `.jsx` ga tegilmagan.

## 02.11.2026 12:06 · m4-15 PmLesson14 — GATE M tasdiqlandi → kod
- **Qaror:** «Uch qaror — uch sabab» (s9) qoladi; MD tasdiqlandi.
- **Kod (`src/4-Modull/PmLesson14.jsx`, +174 / −608):** s3, s6–s7, s10, s12, s14 va CSS'i o'chdi (o'chirilgan ekranlarning o'lik qoidalari —
  oldindan bor bo'lgan VS Code/keys/kartochka qoldiqlari bilan birga); yangi `ScreenSahna` (s16) — m3-14 naqshi, ma'lumot `pm-m4d15-pitch.qavatlar`,
  tinglovchi savoli «texnik so'z ishlatdimi?»; RECAPS 4/7 · Q_LABELS · INLINE_KEYS (`sahna: -1`) · nishon 4 → 3 (to'r 3 ustun) · CodeStrike 3 savol
  (✔ A/C/D saqlandi) · yakun sarlavhasi «Uch gapingiz tayyor — Demo Day'da shuni aytasiz» · uy-vazifa MentorNote uz+ru · `onGo` prop.
- **Darvozalar:** gates 12/13 (emoji — 2 ta ESKI topilma s8/s9, HEAD da 4 ta edi) · `lint:jsx` 0 · `lint:til` 0 · ru-walk 11/11 TOZA ·
  suratlar 1280 (11 ekran) · Sahna gap bilan/bosilgan · 390 · ru 1366 — xatosiz.
- **m3-14 qo'shimcha:** `.lp-done-btn.is-done` o'lik qoidasi o'chirildi (tugma endi bosilgach yo'qoladi). Gates o'zgarmadi.
- **Holat:** UNCOMMITTED. LMS + CRM Learn (CodeStrike 6 savol: m3-14 dan 3, m4-15 dan 3) — oxirida birga.
- **Sinf-supurish yopildi:** Demo Day oldidan PM darslari — PmLesson3 (10) va PmLesson6 (11) da bu muammo yo'q (ekran soni kam). Qidirildi: 4 dars, tuzatildi: 2.

## 02.11.2026 · Qonunlashtirish
- Foydalanuvchi roziligi bilan `PM_DARS_ETALON.md` ga **113-qonun** yozildi: Demo Day oldidan PM darsi — repetitsiya (nazariya ~40 daq, «Sahna» ekrani podiumdan keyin, 2 daq taymer, Demo'da kerak bo'lmagan qatlam yo'q). `lint:prompt` toza.
