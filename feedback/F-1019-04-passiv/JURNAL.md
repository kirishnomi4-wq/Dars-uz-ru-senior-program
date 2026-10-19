# F-1019-04 · Passiv tugma-qadam → qaror (DE 213.22) · LMS 2–6, 8 dars · 2026-10-19
Foydalanuvchi: «xohlasang biroz vaqtimiz bor, shu 25 ta darsni ham to'g'rilaymiz» → qaror: 4 agent parallel; LMS 14 va bridge — keyinga.
Torayish (06:12): QA seansi 9–12-Modullar bo'ylab ommaviy tahrir qilmoqda (src/9 10 daq, src/10–12 1 daq oldin; 213.22 ni o'zi ham qo'llayotgan bo'lishi mumkin) → m9-01, m9-05, m9-09, m10-10, m10-12 va m5-14 (LMS 7, QA doirasi) ham kutadi.
Hozir: m1-02 PmLesson1 (2) · m1-04 Htmllesson2 (1) · m1-05 PmLesson2 (2, etalon) · m1-14 HtmlTakrorlash (1) · m3-08 ReactApiGet (1) · m4-07 PmLesson12 (1) · m4c-01 CiCdIntro (1) · m4c-03 GithubActions (1).
Zaxira `arxiv/F-1019-04-oldin/` (14 fayl). Namuna: `src/12-Modull/PmInvestorPitchLesson.jsx` Qaror (F-1019-03).

## Natija (≈06:45) — 8 dars, 10 joy ✅
| Dars | Ekran | Oldin | Endi |
|---|---|---|---|
| m1-02 PmLesson1 | s2 «Har sayt — o'z odamlari» | 3 sayt tugmasi | 3 qaror: YouTube / Telegram / Yandex Go kimlar uchun |
| m1-02 PmLesson1 | s8 «Har xil odam — har xil ehtiyoj» | 3 odam tugmasi | 3 qaror: o'quvchi / sotuvchi / doimiy xaridor birinchi nimaga qaraydi |
| m1-04 Htmllesson2 | s5 «Struktura» | 3 bo'lim tugmasi | 3 qaror: header (head bilan adashish) · main · footer |
| m1-05 PmLesson2 (etalon) | s3 «Real saytlar» | 3 sayt tugmasi | 3 qaror: OLX / yangiliklar / video sayti bloklari |
| m1-05 PmLesson2 | s5 «Bo'lim vazifasi» | 5 bo'lim tugmasi | 5 qaror: har bo'lim nima qiladi |
| m1-14 HtmlTakrorlash | s0 | qismni bosish + teg (sababsiz) | qism navbat bilan belgilanadi, 3 teg, xatoga sabab |
| m3-08 ReactApiGet | s3 «fetch tuzilishi» | 3 kod-bo'lak | 3 qaror → «So'rov pasporti» qatorlari |
| m4-07 PmLesson12 | s4 «Uch kirish» | 2 kirish tugmasi | 2 qaror: sinf rahbari / sinfdosh nimani ko'radi («Siz» boshidan ochiq) |
| m4c-01 CiCdIntro | s2 «Bitta uchirish — nechta amal?» | 5 nuqta | 5 qaror, vaqt hisoblagichi saqlandi |
| m4c-03 GithubActions | s6 «Workflow → Job → Step» | 3 daraja | 3 qaror; surilgan kartalar ustundan chiqmaydi |
Har joyda: xato variant → bir qatorli sabab, tugma yopiladi → to'g'ri → avvalgi tugma qiladigan o'zgarish. Bosqich ko'rsatkichi bitta (stepper bo'lsa nav sanog'i olindi). SCREEN_META/INLINE_KEYS/QUIZ_BANK/ball/nishon/onAnswer/storedAnswer — o'zgarmagan.
**Men qo'shgan tuzatish:** m1-05 telefonda natija kartasi o'ng ustunda — keyingi savol ostida, ko'rinmay qolardi → telefonda (≤768) natija savol ustida (`natijaK`), sinov `m1-05-390.mjs` (natija top 436 < savol 548).
**Tekshiruv (men qayta yurgizdim):** 8 fayl `npm run gates` — boshqa darvoza yiqilmadi, tell/emoji soni zaxira bilan teng (m1-02 tell 3, m3-08 tell 4, m4c-03 tell 1 — QUIZ_BANK'da, eski); `lint:jsx` toza; `vite build` toza; «birma-bir bosing» 8 faylda 0. Agent sinovlari `sinov/*.mjs|txt` — pageerror 0; ruscha m4c-01 s2, m4c-03 s6 suratlari ko'rildi.
**Ochiq (agentlar topgan, tegilmadi):** m1-02 ScreenKeys («Slaydlarni birma-bir oching» — hikoya-slayd); m4-07 s2 (ikki kartani ochish); m4c-03 s5 («Uchala qoidani oching»); CiCdIntro ≈1138-satr va `useStuckValve(done, seen.size)` ekranlari (1002, 1045, 1088, 1266); m1-04 s5 Mentor gapi tartibni oldindan aytadi (atama shu ekranda kiritiladi); m4c-01 s2 va keyingi «har nuqtani bosib ko'ring» ekrani mazmunan qisman takror.
**Kutadi:** m9-01, m9-05, m9-09, m10-10, m10-12 (QA seansi 9–12 da ishlayapti), m5-14 (LMS 7), LMS 14 (6 dars), bridge (5 dars). Commit yo'q.

## F-1019-06 (agentlar, 19.10 ~06:50–07:00) — pitch + qolgan LMS 2–6 ekranlari ✅
| Dars | Ekran | Endi |
|---|---|---|
| m12-02 PmStoryPitch | s2, s6 | lokal Qaror; qadam izohi sahna kartasi ichida (`SahnaIzoh`) |
| m12-05 PmPitchTraining | s2 | lokal Qaror |
| m12-08 PmFinalPitch | s3 | Qaror (`.fp-qr*`), izoh `.fp-sahna-iz` |
| m10-12 PmGrowthPitch | s8 | Qaror `yopiq` bilan (animatsiya paytida bosilmaydi) |
| m4-07 PmLesson12 | s2 | ikki kartani ochish → `.dfc.static` + tugaganda `onAnswer` |
| m4c-03 GithubActions | s5 | YAML qoidalari → savollar; 07:05 men: Q2 to'g'ri variantidagi yolg'iz «element» → «band» (tell) |
| m4c-01 CiCdIntro | s5, s6, s7, s11 | 14 qaror (agent hisobotida jadval); `.qr .qr-s` ⛶ joyi tuzatildi (s2 ga ham ta'sir) |
Tekshiruv: har fayl gates — zaxira bilan teng (GithubActions tell 1 / emoji 7, CiCdIntro emoji 9 — eski); sinovlar `sinov/m1202 m1205 m1208 m1012 m4-s2-m4c-s5 m4c01b` — pageerror 0.
Agent shubhalari (tegilmadi): CiCdIntro s11 Q2 arena #11 ga yaqin; s12 «Juma, 18:00» bitta tugmali hikoya (passiv emas); ⛶ ichida variantlar (214-qonun 2-band) — 2-ekran bilan bir xil, alohida masala.
