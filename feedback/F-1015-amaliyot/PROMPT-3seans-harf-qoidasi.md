Praktika seansidan topshiriq (F-1015-369). Foydalanuvchi qarori ALLAQACHON berilgan (17.10, «369 ha»): yozma kod javobida harf — haqiqiy kod qoidasi bilan.
Qonun: `DARS_ETALON.md` **211-qonun** (to'liq o'qing) + tekshiruvchi ov-bandi 23. Namuna-sinov: `feedback/F-1015-amaliyot/seans-vositalar/sinov/f369-harf.mjs`.
Namuna-kod (izoh bloki): `src/3-Modull/ReactCrudPracticeLesson.jsx` → `const caseOnly` va `{caseOnly && <div className="frame-warn …">`.

Sizning doirangizdagi yozma javob ekranlari (validator qatori):
- src/3-Modull/ReactApiPostLesson.jsx:~1784 — `/^method:'POST',$/` — `'post'` ham qabul bo'lsin (fetch metodni o'zi katta qiladi)
- src/3-Modull/ReactFirstComponentLesson.jsx:~2363 — `<GameCard name="…">` — `gamecard` yozsa «faqat harf farqi» izohi
- src/3-Modull/ReactPropsReuseLesson.jsx:~1403 — `<GameCard name={g} />` — xuddi shu
- src/3-Modull/ReactStateEffectLesson.jsx:~1326 — `useState`, `setLikes` — harf izohi
- src/3-Modull/ReactApiGetLesson.jsx, src/4-Modull/NodeServerLesson.jsx (~1239), src/4-Modull/PostgresCrudLesson.jsx (~1311, SQL so'zlari — har qanday harf), src/4-Modull/RoutingLesson.jsx — o'qib, 211-qonun bo'yicha.
Har biri: 3 yozuv bilan brauzer sinovi (to'g'ri · harf farqi · boshqa xato), `npm run gates -- <fayl>`. Jurnalingizga F-ID bilan; praktika jurnaliga bir qator (F-1015-369 davomi).
