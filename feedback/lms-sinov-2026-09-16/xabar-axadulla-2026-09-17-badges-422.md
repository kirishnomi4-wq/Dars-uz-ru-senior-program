# Axadulla'ga xabar (2026-09-17) — F-0917-02: bo'sh `badges` → 422 · YUBORILDI (foydalanuvchi, 17.09 ~15:00)

Assalomu alaykum, Axadulla.

Staging sinovida bitta kontrakt-nomuvofiqlik topdik. Haqiqiy sinfda u butun guruh natijasini yiqitadi, shuning uchun darhol yozyapmiz.

**Nima bo'lyapti.** Nishoni yo'q o'quvchi uchun biz `"badges": [], "badges_count": 0` yuboramiz. School API bunga 422 qaytaradi:

```json
{ "message": "The students.0.badges field is required.",
  "errors": { "students.0.badges": ["The students.0.badges field is required."] } }
```

Shu javobni olgan uchta hodisa (staging'dan, vaqt UTC):

| event_id | X-Request-Id | vaqt |
|---|---|---|
| `solo_31347_internet-01-v18_20260910T050107Z` | `2c214518-1c1b-4e99-b9aa-3b95038e4083` | 2026-09-17 05:12 |
| `solo_35813_internet-01-v18_20260908T130054Z` | `c65f9d7c-bbc9-4678-a680-1708a5c11fd2` | 2026-09-15 13:07 |
| `solo_34174_agent-arch-06-04-v18_20260908T053511Z` | `6360d066-86ce-4aad-8a90-ba7cad3f3995` | 2026-09-15 05:37 |

Qabul qilingan hodisalarda (`sess_956510_20260910T091454Z`, `sess_782030_20260908T125804Z`) har o'quvchida kamida bitta nishon bor edi. Farq faqat shunda.

**Sabab (bizning taxmin).** Laravel'ning `required` qoidasi bo'sh massivni «maydon yo'q» deb hisoblaydi. Kontraktda esa `badges` — noyob kalitlar ro'yxati, `badges_count` uning uzunligi. Bo'sh ro'yxat «0 nishon» degani, bu to'g'ri holat.

**Xavf.** Jonli sinfda top-3 ga kirmagan va darsni oxirigacha o'tmagan bitta o'quvchi bo'lsa, uning ro'yxati bo'sh chiqadi va BUTUN guruh hodisasi 422 oladi — hech kimning natijasi saqlanmaydi. Pilotda 1–2 o'quvchi bo'lgani uchun bu ko'rinmagan.

**Iltimos.** `students.*.badges` qoidasini `required` o'rniga `present|array` qilsangiz — bo'sh ro'yxat qabul qilinadi, maydonning o'zi esa majburiy bo'lib qoladi.

**Biz tomondan himoya.** Tuzatishingizni kutmasdan, ro'yxat bo'sh qolgan holatda `["participant"]` yuboradigan qildik. U faqat boshqa nishoni yo'q o'quvchiga qo'yiladi. Ikki savol:

1. `participant` kaliti sizda muammo tug'dirmaydimi? Kalitlar uchun yopiq ro'yxat yo'q deb tushunganmiz (`lower_snake_case`, noyob).
2. Tanga formulasi yoqilganda bu kalit hisobga kirmasligi kerak — u yutuq emas, faqat «qatnashdi» belgisi.

Yuqoridagi uchta hodisa — sinov akkauntlari. Qoidani o'zgartirganingizdan keyin ularni o'sha `event_id` va o'sha payload bilan qayta yuboramiz; 201 kelsa, tuzatish ishlaganini ikkalamiz ham ko'ramiz.

Rahmat.
