---
name: m2-eski-mantiq-tiklash
description: "2026-08-07: M2 JS-o'zagi eski (v16) sodda mantiqqa qaytarildi + eski.html solishtirish-vositasi + JsLoops 4-ball qarori"
metadata: 
  node_type: memory
  type: project
  originSessionId: ed94f008-680f-407c-a929-78c8de4810cb
  modified: 2026-08-07T21:14:06.939Z
---

2026-08-07 seansi. Foydalanuvchi eski (v16) dars nusxalarini `src/2-moodull eski/` ga
tashladi va «eskilarning logikasini olamiz, animatsiya hozirgisi qoladi» dedi.
To'liq tarix: `PIPELINE_STATE.md` F-0807-01…06 (u avto-yuklanmaydi — kerak bo'lsa o'qing).

**Qurilgan vosita (untracked, commit qilinmagan):** `eski.html` + `src/eski/`
(EskiApp/EskiMain + 5 eski darsning ko'chirmasi). Har dars uchun eski↔hozirgi yonma-yon:
`npm run dev -- --port 5180` → `http://localhost:5180/eski.html`. **O'chirmang** — keyingi
solishtirishlarda kerak. Eski asl fayllar `src/2-moodull eski/` da tegilmagan turadi.

**O'zgargan darslar:** JsIntro (robot BAJARBOT/lavash → eski hayotiy misollar, `s14`
Debugging tiklandi, `SahnaStage` aktyorsiz) · JsVars (yorliq-yopishtirish mexanikasi
rad, `s2`/`s13` eski sodda mantiq) · JsLoops (konveyer lentasi `zv-idle` bilan sikl
ishlaganda qimirlaydi) · Practice1 · PeanStack (gloss).

🔴 **QAYTA KO'TARMANG — hal qilingan qarorlar:**
- **JsLoops 4 ballli** (qolgan darslar 5). Eski `s15` foydalanuvchi 2026-08-03 da o'zi
  olib tashlagan (kod ishlamas edi). 2026-08-07 da qayta ko'rildi → **«tegmaymiz»**.
- **JsConditions** — matni eskisi bilan aynan bir xil, tegish shart emas.
- **JsFunctions** — o'yin olami foydalanuvchining 08-03 tanlovi (108-qonun), tegilmadi.
- **PeanStack «Lavash»** — ip emas, `["Lavash","Burger","Shashlik"]` ro'yxatidagi so'z.
- 108-qonun lavashni faqat **JS oilasi** uchun rad etgan; PmLesson1 dagi 34 ta lavash
  qonuniy (96-qonun PM modul-ipi).

**Keyingi ish (kelishilgan):** M1 ni 108–112 qonunlarga tortish — [[m1-ish-royxati]].

**O'lchov usuli (ishladi, takrorlang):** playwright + `getAnimations()` bilan har ekranni
`ccProgress:<lessonId>` orqali ochib o'lchash — cheksiz animatsiya, mentor uzunligi,
oshiq-toshiq. 2026-08-07 holati: 249 ekran, oshiq-toshiq 0, PageError 0.
