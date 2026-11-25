# PG-1 AI bloki — haqiqiy AI yurgizishi xulosasi (25.11.2026)

Topshiriqlar: `00-promptlar.md`. AI: Claude Haiku ×2 (agent, vositasiz). Javoblar aynan: `A-oddiy/javob.md`, `B-mezon/javob.md`. Sxema `schema.sql` — javobdagi SQL blokining o'zi (o'zgartirilmagan). Tekshiruv: `ai-tekshir-pg1.sh` — vaqtinchalik PostgreSQL 18 klasteri (127.0.0.1, ish oxirida to'xtatiladi), `schema.sql` + mentor yozgan `sinov.sql` → `natija.txt` (psql `-e`: har buyruq va javobi).

## 1. Tavsiya — o'quvchi darsidagi tayyor javob bilan solishtirish
O'quvchi darsi m4-03 (`src/4-Modull/DbSqlNosqlLesson.jsx` Screen11): «Oddiy chat ilovasi yasamoqchiman» → **NoSQL (MongoDB)**: «Millionlab oddiy xabar, tezlik kerak, bog'lanish kam».

| | A · oddiy | B · 4 mezon bilan |
|---|---|---|
| Tanlov | **PostgreSQL** | **PostgreSQL** |
| Sabab | foydalanuvchi, suhbat va xabar bog'langan; JOIN va tashqi kalit; «xabar faqat mavjud suhbatga yozilishini bazaning o'zi kafolatlaydi» | 1) bog'langan — ha · 2) shakl qat'iy — ha · 3) pulga zarar — yo'q · 4) «hajm oshishi mumkin, ammo indekslar bilan PostgreSQL ko'taradi» |
| MongoDB haqida | «ham ishlaydi», sxema tez-tez o'zgaradigan loyihada qulayroq | — |

**Halol baho:** AI xato emas. Oddiy chat uchun PostgreSQL ham to'g'ri tanlov; darsdagi NoSQL javobi «millionlab oddiy xabar» holati uchun (m4-03 Screen7). Farq aynan 4-mezonda. Sinfda: javobni AI emas, sabab hal qiladi — o'quvchining loyihasida 4-savolga javob qanday?

## 2. Sxema — haqiqiy bazada (`natija.txt`)
| Yozuv | A (4 jadval) | B (2 jadval) |
|---|---|---|
| yo'q foydalanuvchi (id 99) | ERROR `messages_sender_id_fkey` ✓ | ERROR `messages_receiver_id_fkey` ✓ |
| `body` NULL | ERROR not-null ✓ | ERROR not-null ✓ |
| takror `username` | ERROR `users_username_key` ✓ | ERROR `users_username_key` ✓ |
| `body` = `''` (bo'sh matn) | **INSERT 0 1** — saqlandi | **INSERT 0 1** — saqlandi |
| suhbatga a'zo bo'lmagan sardor yozdi | **INSERT 0 1** — baza a'zolikni tekshirmaydi (AI javobida «bazaning o'zi kafolatlaydi» degan edi — faqat suhbat mavjudligini) | — (suhbat jadvali yo'q) |
| o'ziga o'zi xabar | — | INSERT 0 1 |
| xabari bor `ali`ni o'chirish | ERROR — `messages_sender_id_fkey`, rad etildi (PG-1 14-ekrandagi kabi) ✓ | **DELETE 1** — `ON DELETE CASCADE`: vali'ning yozishmasi 3 → **0** (vali o'zi yozgan «Va alaykum!» ham) |

**Tuzatish (`B-mezon-tuzatilgan/`, yurgizilgan):** `sender_id` va `receiver_id` dan `ON DELETE CASCADE` olindi → `DELETE` rad etildi (`still referenced from table "messages"`), vali'ning 3 xabari joyida. Qo'shimcha: `ALTER TABLE messages ADD CHECK (trim(body) <> '')` — avval jadvalda bo'sh xabar bo'lgani uchun rad etildi (`is violated by some row`); bo'sh qator o'chirilgach qo'shildi; keyin `''` va `'   '` → ERROR `messages_body_check`.

## Darsga haqiqiy material
1. Haqiqiy AI o'quvchi darsidagi tayyor javobdan boshqacha dedi (chat → PostgreSQL). O'quvchi uyda so'rasa — xuddi shunday bo'lishi mumkin; mentor «AI xato» demaydi, sababni 4 mezon bilan so'raydi.
2. AI sxemasidagi qoidalar yo'q id, NULL va takror qiymatni to'xtatdi — PG-1 13-ekrandagi «baza o'zi tekshiradi».
3. Lekin baza faqat yozilgan qoidani tekshiradi: bo'sh matn `''` (NOT NULL uni to'xtatmaydi), suhbat a'zoligi, va `ON DELETE CASCADE` — bitta `DELETE` boshqa odamning yozishmasini xato bermay o'chirdi. PG-1 14-ekranida baza o'chirishni rad etgan edi; AI qo'shgan bir ibora shu himoyani olib tashladi.

## Halol cheklov
Ikkala AI bir model (Haiku), har biri bir marta so'raldi. Boshqa model yoki qayta so'rash boshqa javob berishi mumkin — darsda shunday aytiladi.
