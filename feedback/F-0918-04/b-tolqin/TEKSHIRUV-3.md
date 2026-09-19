# TEKSHIRUV-3 — bugungi o'zgarishlar adversarial ko'rigi (K1, 19.09)

Obyekt: `9cdf279` (solo-blok, 97 dars) · `193632a` (Q3 a/c/e, Q5) · `df11830` (M2, M3) · `c0e51d5` (Q4). Usul: diff +
to'liq komponent kodi o'qildi; 67 ta ball beradigan maxsus (MCQ bo'lmagan) ekran skript bilan sanab chiqildi va har biri
qo'lda tasdiqlandi. `src/` ga tegilmadi. Brauzerda yangi sinov yurgizilmadi (mavjud prob/solo natijalariga tayanildi).

## Xulosa

| Og'irlik | Soni |
|---|---|
| YUQORI | **0** |
| O'RTA | 0 |
| PAST | 2 (+ 2 izoh — nuqson emas) |

**Baho:** solo-blok to'g'ri va xavfsiz — u faqat solo rejimda, mashqdan tashqarida, ekran yakunlanganda bir marta yuboradi;
67 ta maxsus ball-ekranning hammasida `correct` birinchi urinish yoki kalit `-1` («bajarildi»), shuning uchun solo'da
«xato-birinchi → to'g'ri» holati qolmagan. Q3/M2/M3/Q4/Q5 o'zgarishlarida probdan o'tib ketgan nuqson topilmadi.

## Tekshirilgan savollar (toza chiqqanlar)

1. **Solo-blok (`9cdf279`):**
   - (a) MCQ bilan tartib: birinchi bosish xato → `onAnswer({correct:false, solved:false})` — blok ishlamaydi, `record_attempt`
     birinchi (xato) yozuvni qo'yadi; keyin to'g'ri bosishda blok `correct:false` bilan xato `picked` yuboradi — server
     `on conflict do nothing`. Birinchi bosish to'g'ri → ikkala RPC ham «to'g'ri». Qaysi RPC oldin yetsa ham ball bir xil —
     buzilish yo'q.
   - (b) 67 ta maxsus ball-ekran: 26 tartiblash + 9 Q4 + NestArch 2 — `first`/`firstOk`; EdgeCases/Jest s16 (solo'da
     `firstCorrectRef`), GithubActions s18 (bir martalik), PmJtbd s9 (`result === 0`), PmMetrics s9 (`allCorrect`, bir
     martalik); 23 yozma — kalit `-1`. PmLesson5 ning 4 testi `makeTest` → `QuestionScreen` (MCQ yo'li). «Oxir-oqibat
     yechdi» ni `correct` deb yuboradigan ekran QOLMAGAN.
   - (c) Kalit > 0 (EdgeCases/Jest s16, kalit 1): to'g'ri → `picked 1`, xato → `picked 0` — server baholashi to'g'ri.
   - (d) `!firstPassRef.current` — «Qaytadan» mashqida jim. F5 dan keyin `soloSentRef` bo'sh — ekranlar tiklanganda `onAnswer`
     qayta chaqirilmaydi (`storedAnswer` qo'riqlari); chaqirilsa ham server takrorni e'tiborsiz qoldiradi.
   - (e) Shart `live.mode === 'solo'` — jonli o'quvchi va mentor rejimida jim.
   - Joylashuv: noodatiy ildizli darslarda ham (PmJtbd, FullstackFeedback, PmLesson5) blok `_m` dan keyin, jonli qatordan oldin.
2. **Jonli kanal (Q4 + T9):** 34 ta faylda ildiz qatori va ekran yuboradigan `picked` mos — hammasida `picked: first ? 0 : 1`
   (regex «picked yo'q» degan 5 ekran — soxta signal, qo'lda tasdiqlandi: PracticeLesson1/3, DataIntro s15/s15b, Routing s15).
   Ikki marta yuborish yo'q: ekranning o'zi yuboradiganlar (HtmlTakrorlash s11 — `module-mikro`, JsIntro s15) ildiz
   `final` qatoriga tushmaydi.
3. **Q4 «birinchi urinish» ta'riflari:** ApiPostman — xato faqat «Send» dan keyin (`useEffect`, method tanlash urinish emas) ✓;
   DbSql s15 — `passed`/`wrongLean` sinxron hisoblanadi (`allAnswered && lean >= 0.5`), oraliq renderda soxta `miss` yo'q ✓;
   Routing — rad etilgan juftlik ✓; PracticeLesson1 — noto'g'ri chip ✓. Holat `solved || correct` dan tiklanadi.
4. **Q3/M2/M3:** nishon ko'chgan ekranlar (CssLesson1 s12, BotApiButtons s10/s14) — `QuestionScreen` → ildiz `data.correct`
   (birinchi urinish) — probda isbotlangan. Eski trigger ekranlarida (CssLesson1 s13, BotApiButtons s9/s11) nishon haqida
   matn, `AchRule` yoki izoh qolmagan. PmLesson19 `achDesc` — 5 ta render joyining hammasida (132, 1940, 2575, 2579, 2583);
   modul darajasida e'lon — render paytida tayyor.
5. **Q5:** o'lik `earn` olib tashlangan joylarda yon ta'sir yo'q (qolgan qatorlar o'zgarmagan). PmLesson15 s4 `if (isMentor ||
   done) return;` — `done = boosted`; yechilgandan keyin boshqa qismni sinab ko'rishga chaqiradigan matn yo'q — to'smaydi.

## Topilmalar

| # | Og'irlik | Joy | Nima | Senariy | Tuzatish | Ishonch |
|---|---|---|---|---|---|---|
| 1 | PAST (tungi ishdan oldin ham bor edi; Q3-e da shu funksiyaga `miss` qo'shildi) | `src/5-Modull/PmLesson20.jsx:916` s4 `tanla` | `done` qo'riqi yo'q. To'g'ri qator tanlangandan keyin 2,5 soniya ichida (qatorlar faqat `faza === 'yozuv'` da ko'rinadi, `:904` taymer) boshqa qator bosilsa: `done` false → taymer bekor, «Davom» o'chadi. To'g'ri qatorni qayta bossa tiklanadi. PmLesson15 s4 bilan bir sinf (u Q5 da tuzatilgan). Nishonga zarar yo'q: `missTry` olingan nishonni e'tiborsiz qoldiradi (`:3603` `earnedRef.current.has(ach)`). | to'g'ri qator → 2 s ichida noto'g'ri qator → ekran «tugamagan»ga qaytadi | `const tanla = (k) => { if (isMentor \|\| done) return; …}` (PmLesson15 bilan bir xil) | yuqori (kod) |
| 2 | PAST | `src/5-Modull/BotApiButtonsLesson.jsx:1401` | `ACH_TRIGGERS` ustidagi izoh «FAQAT ma'noli, xato qilish MUMKIN bo'lgan ekranlar» deydi, lekin endi s12 `neverSilent` — tekin bonus | — | izohga «s12 — yagona bonus (152-qonun)» qo'shish | yuqori |
| i1 | izoh | `src/5-Modull/PmLesson19.jsx:1899` `achDesc` | Darsda `__lang` e'lon qilinmagan → `typeof __lang` doim `undefined` → darsda tavsif doim o'zbekcha (dars ham o'zbekcha — aralashma yo'q). Ruscha tavsif hozir faqat katalogda (`title_ru`). Dars ru i18n qilinganda (`let __lang` fayl boshida) shox o'zi ishlaydi. | — | — | yuqori |
| i2 | izoh (ma'lum) | `lms/` yig'malari (masalan `lms/CssLesson1*.jsx`) | Eski nishon tavsiflari — `lms/` hali qayta yig'ilmagan. Commitdagi nuqson emas, reja bo'yicha oxirida yig'iladi. | eski yig'ma CRM'ga yuklansa | `lms/` qayta yig'ish (Q6 5-qadam) | yuqori |
