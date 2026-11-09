# F-1105-03 — qabul ssenariylari: qaysi test qaysi bandni yopadi (S7, 09.11.2026)

Manba: `16-…` §6 (23 ssenariy, bizning tomon «Dars API nima yuboradi») va `25-YAKUNIY-…` §12 (18 mezon). Bu ro'yxat — Dars API tomoni. Coin, Learn, CRM tranzaksiyalari — School API/CRM testlari (Abdulloh), bu yerda yo'q.

Testlar `server/test/integration/` papkasida, soxta qabul qiluvchi bilan (`POST` v2 → 201 `queued`, `GET` → holat).

| 16 §6 | 25 §12 | Ssenariy | Test fayli · test |
|---|---|---|---|
| 1 | 1 | Oxirgi ekranga yetdi, tugma bosilmagan → `lesson_result` darhol | `v2_flow` · jonli dars reached_end |
| 2 | 3 | Arenaga kirdi, javob bermadi → `ap_` + `ar_` (`participated`, `answered: 0`) | `v2_scenarios` · 16#2 |
| 3, 4, 5 | 4, 5, 6 | Learn / CodeStrike coin tartibi | CRM tomoni. Biz odatdagi `ap_`/`ar_` ni yuboramiz (`v2_scenarios` 16#2) |
| 6, 13 | 8 | Brauzer va server parallel | L2 (brauzer yuki v4) bilan — `src/live` testlari; server tomoni `lr_<attempt_id>` deterministik |
| 7 | 7 | 1-arena nol, 2-arena yuqori → `student_arena_no: 2`, 1-natija o'zgarmaydi | `v2_scenarios` · 16#7 |
| 8 | 11 | `end_reason`: mentor · `session_limit` · `last_question_timeout` · `arena_limit`; ishchi kechiksa vaqt uzaymaydi | `v2_scenarios` · 16#8 (uchta test) + `v2_flow` arena (mentor) |
| 9 | — | Darsni tugatmagan → `session_closed`, `completed: false` | `v2_flow` · arena (8002) |
| 10 | 17 | Uyda, til, v1 regressiyasi | `v2_flow` · solo; v1 to'plami (`results*.test.js`) o'zgarmagan |
| 11 | 2 | Jonlida tugatmadi → uyda birinchi yakunladi (`attempt_no` 1 → 2) | `v2_scenarios` · 16#11 |
| 12 | 10 | Arena yakuni qatnashishdan oldin | CRM tomoni; biz ikkalasini ham yuboramiz |
| 14a, 19 | 11 | Uyda 7 kun → `solo_expired`, `occurred_at` = ochilish + 7 kun, `elapsed_sec` 604800 | `v2_scenarios` · 16#14a |
| 14b | 12 | Arena boshlanmadi → har o'quvchiga `not_started` | `v2_scenarios` · 16#14b |
| 15 | 12 | `omitted` va haqiqiy javobsizlik farqi | `v2-builder` unit (omitted) + `v2_scenarios` 16#14b (full, available 0) |
| 16, 22 | 15 | Eski tab o'z versiyasida · sahifa yangilansa `version_changed` + yangi urinish · `unknown` | `v2_version` (5 test) |
| 17 | 18 | Tiklashda takroriy coin yo'q | v1 `rebuild` hisoboti (`results_rebuild`) + v2 `rebuildV2` (`v2_admin`) — id o'zgarmaydi |
| 18 | 13 | Amaliyot `tests` dan tashqari, `practice` blokida | `v2_flow` · jonli dars (practice) + unit `buildPractice` |
| 20 | 14 | `lesson_id` almashgan dars | Reestr (`16a`, `eski_lesson_id`) — hodisa o'z `lesson_id` si bilan |
| 21 | 15 | Versiyasi yozilmagan eski urinish → `unknown` | `v2_scenarios` · 16#14a (`version_source: unknown`) |
| 23 | 16 | Uzoq `queued` → 60 daqiqa ogohlantirish, 24 soat `review`; `failed` yakuniy | `v2_scenarios` · 16#23 + `v2_flow` kuzatuv jadvali |
| — | 9 | CRM yozgan, javob yo'qolgan → qayta yetkazish | Bizda: tarmoq xatosi → `retry_wait`, o'sha `event_id` (`results.test` 429/500) |

## S7 da topilgan va tuzatilgan

- **Arena yakuni vaqti.** Server arenani yopganda yakun lahzasi ishchi kelgan vaqt edi. Ishchi kechiksa arena «uzayardi» va kech javoblar hisobga kirardi. Endi yakun = mantiqiy chegara (migratsiya 0015).
- **`attempt_no` va `student_arena_no` bittaga kam edi** (S5 da topildi). Sabab: vaqtni millisekundgacha solishtirish o'z qatorini sanamasdi.
- **Uydagi v2 hodisada `session_id` bo'sh edi** (S6 da topildi). Admin sahifasida sessiyaga bog'lanmasdi.
