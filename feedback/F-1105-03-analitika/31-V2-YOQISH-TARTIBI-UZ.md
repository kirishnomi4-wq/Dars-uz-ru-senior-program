# F-1105-03 — yangi natija oqimini (v2) yoqish tartibi (10.11.2026)

Shart: 172 dars yangi paketdan LMS'ga yuklangan (`yuklash-20261110-prod`, muhrlangan) va Abdulloh «qabul qiluvchi tayyor» degan.
Yangi darslar yuklanmasdan prod'da v2 yoqilmaydi: eski darslar `dars_api` bog'lanishini yubormaydi.

## 1. Staging — birgalikdagi sinov

1. Abdulloh (yoki u aytgan kishi): staging Dars API `.env.deploy` ga `RESULT_SCHEMA_V2=on`, konteyner qayta ishga tushadi.
2. Tekshiruv (Claude): `node --env-file=.env.deploy.staging tools/staging-check.mjs https://staging-dars-api.coddycamp.uz` → «v2» bandida `bayroq on`.
3. Bitta sinov darsi staging LMS'da (Abdulloh bilan): mentor + 2 o'quvchi; bittasi oxirigacha, bittasi yarmida; arena 2–3 savol; mentor yopadi.
4. Kutiladigan natija (`node --env-file=.env.deploy.staging tools/v2-kuzatuv.mjs https://staging-dars-api.coddycamp.uz`):
   - `lesson_result` — 2 ta (biri oxirgi ekranda darhol, biri sessiya yopilganda `completed:false`);
   - `arena_participation` — arenada savol ko'rgan har o'quvchiga 1 ta;
   - `arena_result` — har o'quvchiga 1 ta;
   - hammasi `delivered`, qo'llash `queued` → `applied` (Abdulloh tomoni).
5. Abdulloh o'z tomonida: Learn avtomatik hisoblandimi, coin takrorlanmadimi, LMS «natija qayta ishlanmoqda» → saqlandi.

## 2. Prod — yoqish

1. Vaqt: jonli dars 0 (admin sahifasi «Jonli sessiya» 0).
2. Prod Dars API `.env.deploy` ga `RESULT_SCHEMA_V2=on`, konteyner qayta ishga tushadi (prod'ga kirish huquqi bor kishi; kodni qayta deploy qilish shart emas).
3. Tekshiruv (foydalanuvchi): `! curl -s https://dars-api.coddycamp.uz/api/v1/health` → `"result_schema_v2":"on"`.
4. Birinchi darslardan keyin (foydalanuvchi): `! cd server && node --env-file=.env.deploy.prod tools/v2-kuzatuv.mjs https://dars-api.coddycamp.uz` — 1 soatdan keyin, keyin kun oxirida.

## Chegara (0017, 10.11)

v2 hodisalar faqat yangi oqim **yoqilgan lahzadan keyin boshlangan** urinishlar uchun yaratiladi. Lahza — bayroq «on» bilan server birinchi ishga tushgan vaqt, bazada (`dars_settings.v2_enabled_at`) bir marta qotadi; qayta ishga tushish uni surmaydi. Undan oldingi urinishlar faqat v1 oqimida qoladi (25 §9, backfill yo'q).
Staging'da shu tuzatishgacha bayroq yoqilganda sentyabrdagi eski urinishlar uchun 26 ta chala hodisa yaratilgan edi (422 / ichki rad) — prod'da bu minglab bo'lardi.

## 3. Qaytarish (muammo bo'lsa)

- `RESULT_SCHEMA_V2=off` + konteyner qayta ishga tushadi. Darslar keyingi kirishda o'zi eski (v3) yukka qaytadi — qayta yuklash kerak emas.
- Qayta yoqishda: `RESULT_SCHEMA_V2_FROM=<qayta yoqish vaqti, ISO>` qo'shiladi — o'chiq turgan paytdagi urinishlar uchun v2 yaratilmasin.
- Hech narsa o'chirilmaydi: yaratilgan v2 hodisalar bazada qoladi, v1 oqimi bayroqdan qat'i nazar ishlaydi.
- Favqulodda (server yetib bo'lmasa): darslarni `RESULT_SCHEMA_V2=off` bilan qayta yig'ish — server nima desa ham v3.

## 4. Kuzatuv belgilari

| Belgi | Ma'nosi | Nima qilinadi |
|---|---|---|
| `manual_review` (v2) | 422/413 — yuk rad etildi | `last_error` → Abdulloh bilan; kontrakt farqi |
| 1 soatdan ko'p `queued` | School API qo'llamayapti | Abdulloh tomoni |
| `failed` / `review` | qo'llashda xato / 24 soat o'tdi | admin sahifasida hodisa, Abdulloh bilan |
| v1 oxirgi hodisa eski | v1 to'xtagan (kutilmaydi) | darhol tekshiriladi |

T+8 kun: v1 ni yopish — faqat ikki tomon tasdig'i bilan.
