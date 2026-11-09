# F-1105-03 — staging'da v2 oqimini yoqish: so'rov matni (09.11.2026, tungi ish)

Bu fayl — tayyor matn. Hech kimga yuborilmagan. Foydalanuvchi ko'rib, o'zi yuboradi.

## 1. Kristinaga (staging serveri sozlamasi)

> Kristina, salom. Dars API staging'ida bitta sozlamani yoqish kerak — yangi natija oqimini (v2) Abdulloh bilan birga sinash uchun.
>
> `/srv/dars-api/staging/.env.deploy` fayliga qo'shing:
> ```
> RESULT_SCHEMA_V2=on
> ```
> Keyin konteynerni qayta ishga tushiring (`docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d`).
>
> Prod'ga tegilmaydi. Prod'da bu sozlama reliz kunigacha yo'q (`off`).
>
> Tekshiruv: `https://staging-dars-api.coddycamp.uz/api/v1/health` javobida `"result_schema_v2":"on"` chiqishi kerak.

## 2. Abdullohga (staging'da birgalikdagi sinov)

> Abdulloh, salom. Dars API staging'ida 25-kontrakt bo'yicha v2 oqimi tayyor. Kristina sozlamani yoqgach, staging'dagi School API'ga `schema_version: 2` hodisalar keta boshlaydi:
> - `lesson_result` (`lr_<attempt_id>`) — oxirgi ekranga yetganda darhol; sessiya yopilganda qolganlarga.
> - `arena_participation` (`ap_<attempt_id>`) — o'quvchi ekranida birinchi arena savoli chiqqanda.
> - `arena_result` (`ar_<attempt_id>`) — sessiya yopilganda har LMS o'quvchisiga, arena bo'lmasa `not_started`.
>
> Qabul qilgach `GET lesson-results/{event_id}` ni 1, 5, 15, 60 daqiqada, keyin soatlik 24 soatgacha so'raymiz.
>
> Sizning staging qabul qiluvchingiz tayyormi? Tayyor bo'lsa, bitta jonli sinov darsini birga o'tkazamiz.

## 3. Biz tomonda tayyor (09.11 tun)

| Bosqich | Commit | Staging |
|---|---|---|
| S4 navbat, yuborish, kuzatish | `ef8d3ac1` | `e5563de` ✓ |
| S5 `version_changed` | `3eadb146` | `8a70130` ✓ |
| S6 admin v2 | `ab03208d` | `f92f155` ✓ |
| S7 ssenariylar + 0015 | `001c9110` | `5e29ff6` ✓ |
| S9–S11 kalitlar, RPC, view'lar | `31e1b4d2` | `e61f9c4` ✓ |
| L2 join `session_key` | `59744ee3` | `4806eea` ✓ |
| S8 health + check | `30924e61` | `b40aee2` |

## 4. Reliz tartibi (eslatma — kunini foydalanuvchi aytadi)

1. **Avval server** (prod ▶, jonli 0 da). Darslar yangi serversiz ishlamaydi: yangi `src/live` `restart` va `progress` so'rovida `lesson_version` yuboradi. Eski server buni rad etadi (400). `screen_open`, `arena_shown`, `record_practice` uchun ham shu shart, lekin ular eski serverda o'zi to'xtaydi.
2. Savol kalitlari: `node --env-file=server/.env.deploy.prod scripts/savol-kalitlari.mjs --yukla https://dars-api.coddycamp.uz`.
3. 172 dars: `LESSON_VERSION_BUMP=1 RESULT_SCHEMA_V2=on` bilan yig'iladi (versiya va brauzer yuki v4). Bayroqsiz yig'ilsa — yuk v3 bo'ladi, oqim o'zgarmaydi.
4. Prod'da `RESULT_SCHEMA_V2=on` — Kristina, Abdulloh tayyor bo'lgach.
5. Faqat o'qish roli (Shahzoda konnektori): `server/docs/analitika-rol.sql` — prod DB egasi qo'lda bajaradi.
