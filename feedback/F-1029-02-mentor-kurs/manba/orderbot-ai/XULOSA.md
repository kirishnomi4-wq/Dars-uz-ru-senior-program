# Haqiqiy AI yurgizishi — xulosa (04.11, OrderBotNest tgpg-start → PostgreSQL, 4 prompt)
Agent: general-purpose (Claude Opus 5.5), izolyatsiya: scratchpad nusxa, tgpg-done ko'rinmagan. Har promptdan keyin mentor tekshiruvi `orderbot-ai-tekshir.sh N` (toza baza shop_v: build → seed ×2 → senariy + restart → state-restart → race → psql). Git tarixi: `ai-run.bundle` (tgpg-start → lock → prompt 1…4).

| Prompt | AI natijasi | Mentor tekshiruvi |
|---|---|---|
| 1 ulanish + products | TypeORM, migratsiya (CHECK, UNIQUE), seed ON CONFLICT, take = UPDATE … WHERE stock >= qty | ✓; restartdan keyin buyurtma yo'q, ombor kamaygan — ORALIQ HOLAT |
| 2 users + state | telegram_id BIGINT PK + transformer→number, INSERT … ON CONFLICT DO NOTHING | ✓; telefon kutish restartdan o'tdi |
| 3 savat | UNIQUE(telegram_id, product_id) + ON CONFLICT DO UPDATE qty+1 | ✓; savat restartdan o'tdi |
| 4 buyurtma | transaction: users FOR UPDATE, product_id tartibi, UPDATE … WHERE stock>=qty, ROLLBACK; bekor FOR UPDATE | ✓; race 1 sotildi, bekor bir marta qaytdi |

## Darsga HAQIQIY material (o'ylab topilmagan)
1. Oraliq holat (p1–p3): katalog bazada, buyurtma xotirada → restart: buyurtma yo'q, ombor kamaygan. «Har bosqichdan keyin restart + psql».
2. AI promptdan chetga chiqdi (p1, await) — asosli, o'zi aytdi → «AI javobidagi chetga chiqish qismini o'qing».
3. AI eski kodda xato topdi (p2, customerName soxta user ochardi).
4. AI sinovida 1 so'rov haqiqiy Telegram API'ga ketdi (p2, soxta token, 401) → AI sinov qilganda tarmoqqa chiqishi mumkin.
5. AI o'z sinovida 2 xatoni topib tuzatdi (p3: qty xabari takrorlanishi; /start'siz FK xatosi).
6. ROLLBACK / ON CONFLICT DO NOTHING sequence sarflaydi: #4 yo'q, keyingi mahsulot id 7 emas.
7. Ikki to'g'ri yo'l: telegram_id PK + number (AI) vs id SERIAL + telegram_id BIGINT UNIQUE + string (tgpg-done).
8. Mening o'z birinchi kodim (tgpg-done yozishda): CHECK xatosidan keyin o'sha tranzaksiyada SELECT → «current transaction is aborted» (`orderbot-out/04a`).

## HALOL CHEKLOV
Kutilgan «AI xatolari» (INTEGER, SELECT'siz takror INSERT, BIGINT matn bilan `===`) bu agentda CHIQMADI — prompt «Telegram id katta son» deb ishora bergan, agent kuchli model. Antigravity/Copilot'dagi modellar boshqacha yozishi mumkin; darsda bu xatolar «AI shunday yozdi» deb ko'rsatilmaydi, faqat «tekshiring: \d users, pg_typeof» bo'lib kiradi — yoki alohida tajriba (kuchsizroq model + ishorasiz prompt) bilan haqiqiy olinadi.

## 2-TAJRIBA (04.11): Haiku + ODDIY promptlar — `manba/orderbot-ai2/`
| | 1-tajriba (Opus, to'liq prompt) | 2-tajriba (Haiku, oddiy prompt) |
|---|---|---|
| 1-prompt hajmi | 15 fayl, faqat katalog (+await, o'zi aytdi) | 22 fayl, 1145 qator — HAMMASI, aytmadi |
| BIGINT | ✓ (promptda ishora) | ✓ (ishorasiz) |
| takror INSERT / savat UNIQUE | ✓ | ✓ |
| ortiqcha sotuv (race) | ✓ | ✓ |
| bekor → ombor bir marta | ✓ | ✓ |
| seed | `npm run seed`, takrorlamaydi | yo'q — mahsulotlar migratsiyada |
| FK | to'liq | cart_items → users yo'q |
| 2-prompt | bajardi | «allaqachon qilingan», o'zgarishsiz (halol) |

**XULOSA (halol):** ikkala Claude modeli ham kutilgan «klassik» xatolarni (INTEGER, takror INSERT, ortiqcha sotuv) QILMADI — hatto ishorasiz promptda ham. Haqiqiy xavf — kod to'g'riligi emas, NAZORAT: AI bir promptda butun loyihani o'zgartiradi (1145 qator), chetga chiqishni aytmasligi mumkin, mayda sxema bo'shliqlari (FK yo'q, seed migratsiyada) diffni o'qimasdan ko'rinmaydi. Darsning yadrosi: mentor AI'ni BOSQICHLAB boshqaradi va har bosqichni restart + psql + race bilan TEKSHIRADI.
**Cheklov:** Gemini (Antigravity) va Copilot sinalmagan — menda kirish yo'q. Darsda «sizning AI'ingiz boshqacha yozishi mumkin — shuning uchun tekshiruv» deyiladi.
