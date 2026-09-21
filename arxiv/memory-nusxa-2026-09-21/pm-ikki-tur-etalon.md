---
name: pm-ikki-tur-etalon
description: "PM darslar IKKI turdagi etalonga bo'linadi (texnikaga yaqin / sof PM) — yangi PM dars qurishdan oldin turi aniqlanadi"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2fca3a76-b88c-4628-b110-8f3f863c284f
  modified: 2026-07-28T21:54:33.539Z
---

2026-07-28 boshliq-qarori: PM darslar **bitta emas, ikki turdagi** etalonga ega.

- **1-TUR — texnikaga yaqin** (UX/UI, struktura, prototip). Mavzu **real saytlar/interfeys** orqali ochiladi; o'quvchi **joylashtiradi/tartiblaydi/tuzatadi**, yozma artefakt YO'Q; koding = tuzilmani kod bilan qurish. Etalon-fayl: `src/1-Modull/PmLesson2.jsx`.
- **2-TUR — sof PM** (User Story, JTBD, Metrika, Pitch, Demo Day). Mavzu **odam va keys** orqali; o'quvchi **yozadi**, artefakt = matn va keyingi darsga o'tadi; koding = o'z matnini koddan o'tkazish. Etalon-fayl: `src/pm/PmUserStoryLesson.jsx` (P0).
- **Aralash dars:** nazariya-blokini bir turdan, amaliyot-blokini boshqasidan oladi (senariyda yozib qo'yiladi).

**Ikkalasida bir xil:** identitet-pasporti (rang/shrift/karta/soya) · jonli-ball relslari · matn qonunlari · ekran-ritmi. **Farq qiladi:** nazariya-bloki, o'quvchi harakati, artefakt turi, USTAXONA majburiyligi.

🔴 Ikki etalon **bir-birini takrorlamasligi kerak** — vizual/mexanika/CSS-oilalari har turda o'ziniki; «etalonda shunday edi» vizual ko'chirishga asos emas.

🔴 **87-qonun (ikkala turga):** koding-ekran **oldingi texnik darslardan o'sadi** — qurishdan oldin «bu darsgacha bola texnikadan nimani o'rgangan?» degan savolga `src/App.jsx` `MODULES` tartibi bo'yicha javob topiladi; eng kuchli koding — texnik darsning o'zi qoldirgan **bo'shliqni** yopadigani. Kompilyator har faylda **o'zida** yoziladi (import yo'q).

🔔 **88-qonun + 1-C bo'lim — NAVBAT-PULSI (onboarding-tur o'rniga).** Onboarding barcha darsdan olib tashlandi (faqat InternetLesson · PmLesson1 · Htmllesson1 da qoldi); o'rniga «navbat kimda bo'lsa, o'sha element yonadi» tizimi. `PM_DARS_ETALON.md` **1-C bo'limi — universal qaror-tartibi**: harakat-zanjirini yoz → navbat birinchi bajarilmagan halqada → naqshni halqa shakli belgilaydi (tinch halqa / yurish / to'lqin) → 5 bandlik tekshiruv. Kod-shartnomasi `PmLesson2.jsx` da: `useTurnHint` · `useTurnWalk` · `turnCls` · `.turn-ring/.turn-step/.turn-wave`.

**HOLAT (2026-07-29, seans oxiri — hammasi UNCOMMITTED, foydalanuvchi o'zi qo'lda commit qiladi):**
- **PmLesson2 (1-tur)**: PM-STUDIA palitra · koding-ekran (HTML-struktura kompilyatori, oxirgi drag-drop o'rniga) · navbat-pulsi 11 nuqta · audio olib tashlandi · `lessonId` → `pm-m1d6-v1` · 2 ekran olib tashlandi (20→18) · matn to'liq sayqal («UX qaror» → «foydalanuvchi uchun qilingan qaror») · mentor ekrani tozalandi · takrorlash-yo'li.
- **UserStory (2-tur)**: navbat-pulsi + **input-navbati** (bo'sh maydonlar aylanadi) + takrorlash-yo'li qo'shildi; ball-relslari `git HEAD` bilan identik.
- **Qonunlar**: 87 (koding oldingi texnik darsdan) · 88+1-C (navbat-pulsi, qaror-tartibi) · 89 (praktika-darvozasi bir marta) · 90+1-D (mentor ekrani). `DARS_ETALON.md` ga ham ko'chirilgan (9.4-A · 10.1 · 10-B).
- **Keyingi ish**: mentor rejimini real sessiyada sinash · `wv4`/`.kdx-skip` dizayn-ko'rigi · ikkala etalonni «eng zo'r holat»ga yetkazishda davom etish.

To'liq matn: `PM_DARS_ETALON.md` 1-B (ikki tur) · 1-C (navbat-pulsi) · 1-D (mentor ekrani) · 87–90-qonunlar. Batafsil jurnal: `PIPELINE_STATE.md` oxiri. Aloqador: [[pm-etalon-yaxshilash]] · [[dars-tili-metodologiya]]
