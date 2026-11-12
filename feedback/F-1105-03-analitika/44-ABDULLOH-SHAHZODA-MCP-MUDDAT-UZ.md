# Shahzoda MCP'da JSX ma'lumotini ko'rmayapti — ikki qadam sizda, muddat so'raymiz

12 noyabr 2026 · 37-hujjatning davomi

Salom. Shahzoda MCP orqali tekshirdi — JSX darslaridan yangi ma'lumot ko'rinmayapti. Uning jadvalida
«Чекпоинты внутри JSX-урока — ❌ Нет. Новых таблиц от JSX нет. Урок по-прежнему приходит одной записью «завершён», без ответов на задания».
Biz tekshirdik: darslar va server 11.11 da yangilangan. Shahzodaga ko'rinmasligining sababi — ikki qadam, ikkalasi ham sizning tomonda.

## 1. Hozirgi holat (12.11, 06:51 UTC)

| Nima | Holat |
|---|---|
| Dars API production | `0.1.0+ab1bfa30`, migratsiya 17 |
| `result_schema_v2` | **off** — server 10.11 dagi 21:32 (Toshkent) deploydan beri qayta ishga tushmagan |
| 172 dars LMS'da | yangi versiyada (11.11), production serverga ulangan |
| Shahzoda uchun konnektor | ulanmagan — 32- va 35-hujjatlarda «bu relizga kirmaydi» degansiz |

Shuning uchun CRM'ga hozircha eski (v1) natija boradi, Shahzodaning konnektori esa bizning view'larni ko'rmaydi.

## 2. Sizdan ikki qadam

**2.1. v2 ni yoqish** — 37-hujjat §2 dagi buyruq (`RESULT_SCHEMA_V2=on`). Bu bizning keyingi relizimizni kutmaydi, hozir yoqsa bo'ladi.
Tekshiruv: `https://dars-api.coddycamp.uz/api/v1/health` → `"result_schema_v2":"on"`.

**2.2. Konnektor** — 07-hujjat §3.1 bo'yicha (A yo'l):
- prod Dars bazasida faqat o'qish roli — ilovadagi `analitika-rol.sql` (psql, superuser bilan; keyin parol `\password analitika_ro`).
  Hozir bajarsa ham, keyin bajarsa ham bo'ladi: ruxsat faqat bazada mavjud view'larga beriladi (hozir 8 ta), qayta bajarilsa xato bermaydi;
- tarmoq ruxsati: konnektor → prod Dars bazasi;
- Shahzodaning MCP konnektoriga view'larni ulash.

Jadvallarning o'ziga ruxsat berilmaydi — faqat view'lar: ism, kontakt va o'quvchi yozgan matn ularda yo'q.

## 3. Savol — muddat

Har qadam qachon bo'lishini yozing (sana):

1. v2 yoqish — ?
2. Konnektor (rol + tarmoq + MCP ulanishi) — ?

Shahzodaga muddatni sizning javobingiz bo'yicha biz aytamiz.

## 4. Shu orada biz tomonda (ma'lumot uchun)

Shahzodaning 05.11 talablaridan qolgan bandlarni to'ldiryapmiz. Sizdan hech narsa talab qilinmaydi, faqat ikki joyda sizga tegadi:

- **Yangi server relizi (migratsiya 18).** View'larga `lms_question_id` (masalan 14085 uz / 14086 ru), `lang`, `learn_id` qo'shiladi;
  yangi view'lar — `v_skipped`, `v_practice_wrong_top`, `v_lessons`, `v_quiz_learn`. Konnektordagi view'lar soni 8 → 12.
  Rol avvalroq yaratilgan bo'lsa, migratsiya 12 view'ning hammasiga ruxsatni o'zi beradi — qo'lda qayta bajarish shart emas.
- **Darslar.** Keyingi bosqichda o'quvchi yozgan matn (300 belgigacha) va har «Tekshirish» bosilishi yoziladi — 172 dars qayta yuklanadi,
  yuklashdan oldin alohida xabar beramiz. School API'ga boradigan v2 hodisalar shakli (25-kontrakt) o'zgarmaydi: matn faqat bizning bazada qoladi,
  `lr_` dagi `practice[]` ro'yxatida ekranlar soni ko'payishi mumkin.

Ilova: `analitika-rol.sql`.
