---
name: matn-korpus-tizimi
description: "2026-07-26 qurilgan \"shafof matn\" tizimi — MATN_KORPUS.md (oltin-namunalar, yozishdan oldin o'qiladi), lint:til darvozasi (44 qoida), o'tkir 👦 hisobot; pilot kutilmoqda"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6b9c7c62-c971-404d-a08e-93ef7681ac92
  modified: 2026-07-26T20:16:29.876Z
---

2026-07-26 da foydalanuvchi og'rig'i («qayta-qayta feedback berish muammo, matn zo'r chiqmayapti») bo'yicha tizim-yechim qurildi:

- **`MATN_KORPUS.md`** — 12 matn-turi bo'yicha foydalanuvchi tasdiqlagan ✅/❌ gap-juftliklari. Yangi tartib: matn yozadigan har rol ishni KORPUSdan boshlaydi (qonun tekshiradi, korpus o'rgatadi). Feedback endi avval korpus-juftlik, keyin qonun/lug'at (CLAUDE.md B-retsept yangilangan).
- **`npm run lint:til`** — majburiy darvoza (0 error), qoidalar `til-lint-rules.json` (44 ta).
- 👦 simulyator: qayta o'qilgan gap SO'ZMA-SO'Z + file:line majburiy.

**Keyingi seans birinchi ishi — SINOV-PILOT:** bitta eski darsning matnini korpus-usulda qayta yozib taqqoslash. Nomzod: PmAudience yoki PmPitch (yangi tizimdan o'tmagan, farq yaqqol ko'rinadi). Foydalanuvchi «ertaga sinaymiz» dedi (2026-07-27).

Shu kunning boshqa ishi (hammasi UNCOMMITTED): F-0726-01 (14 matn-tuzatish + 61–67 qonunlar), F-0726-02 (jonli-yadro 3 PM darsda: cur_screen migratsiyasi bajarilgan va bazada tasdiqlangan, 180s stale, mentorMax reveal, reload-tuzatishlar). Qolgan mayda: src/pm/ dagi 3 png feedback/ga ko'chirilmagan; jonli qo'lda-sinov o'tkazilmagan; 76 eski darsda jonli-yadro hali eskicha. Jurnal: PM_PIPELINE_STATE P14–P17.
