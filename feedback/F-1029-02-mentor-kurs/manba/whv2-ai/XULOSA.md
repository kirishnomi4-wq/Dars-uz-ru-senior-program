# Webhook v2 · AI xulosasi (04.11) — haqiqiy PostgreSQL bilan (`drive-whv2-ai.sh`)

| Sinov | ai1 (Opus) | ai2 (Haiku) | bizniki (wh-done) |
|---|---|---|---|
| Manzil, maydonlar | `/payments/webhook`, `payment_id`… `paid/rejected` | `/webhooks/payment`, `payment_id`… `paid/rejected` | `/payments/webhook`, `paymentId`… `paid/failed` |
| 1 to'g'ri imzo | 200 applied | 200 PAID | 200 |
| 2 takror | 200 duplicate, 1 qator | 200 (farqsiz javob), 1 qator | 200 duplicate, 1 qator |
| 3–4 imzosiz / «abc» | 401 / 401 | 401 / 401 | 401 / 401 |
| 5 summa 1200 (jami 120 000) | 200, **AMOUNT_MISMATCH** (panelda «Summa mos emas») | 200, **PAID** — panelda «To'landi · 1 200 so'm», faqat logda WARN | 400 «summa mos emas», yozilmaydi |
| 6 bo'sh joyli JSON | 200 | 200 | 200 |
| 7 bir vaqtda ikki | 1 applied + 1 duplicate, 1 qator | 2×200, 1 qator (buyurtma FOR UPDATE) | 1 + 1 duplicate, 1 qator |
| O'zi qanday sinagan | embedded-postgres (loyiha ichida), smoke 15/15, curl | jsdom'siz: supertest + mock, baza yo'q | — |
| Doira | bir marta tashqariga nusxa (o'zi aytdi, o'chirgan) | toza | — |

Xulosa: ikkalasi xom tana, `timingSafeEqual`, takror va tartibni to'g'ri qildi. Asosiy farq — **summa**: ai2 1 200 so'mlik to'lovni 120 000 so'mlik buyurtmaga «to'landi» deydi (admin yetkazib beradi); ai1 yozadi, lekin «Summa mos emas» deb ajratadi — bu bizning 400 dan yaxshiroq (pul o'tgan bo'lsa, yozuv yo'qolmaydi, admin ko'radi).
