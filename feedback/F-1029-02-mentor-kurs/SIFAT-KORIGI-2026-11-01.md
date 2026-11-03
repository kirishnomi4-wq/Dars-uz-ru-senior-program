# Sifat ko'rigi — qurilgan 8 dars (01.11.2026 kechqurun, avtopilot)

Doira (foydalanuvchi qarori 01.11 ~19:20): PG-1, PG-2, Jest-1, Jest-2, Telegraf+PG, WebSocket-1, WebSocket-2, Webhook — **faqat ro'yxat, hech narsa o'zgartirilmagan**. Tekshirildi: (A) «⚠» belgili, sinalmagan da'volar; (B) CI/CD-2 da topilgan xato sinflari — «hujjat bo'yicha / sinamadik» iboralari, darslararo «keyingi mentor darsi» kartalari, o'quvchi darsidagi namunani haqiqiy yurgizmasdan baholash.

## A. «⚠» da'volar — 34 ta, 5 darsda (PG-2, Jest-1, Jest-2 — 0)

| Dars | ⚠ | Nima sinalmagan | Nega | Qanday yopiladi |
|---|---|---|---|---|
| PG-1 | 11 | Windows o'rnatuvchisi, Postgres.app oynalari (6–7-ekran maketlari), Windows xizmat nomi `postgresql-x64-18`, `'psql' is not recognized…`, `zsh: command not found: psql`, `Console code page (866)` ogohlantirishi | bu kompyuter Linux | siz yoki bir mentor Windows/Mac'da 3–4 skrinshot (o'rnatuvchi, Path, xato matni) — CI/CD-2 dagi kabi bir o'tirishda |
| Telegraf+PG | 7 | haqiqiy Telegram chat (maket), `bot.launch()` + haqiqiy token, `409: Conflict`, Neon | token/BotFather ruxsati yo'q | BotFather'da **sinov bot** (siz yaratib token berasiz yoki o'zingiz yurgizasiz) — 12, 20-amaliyot «kutilgan»lari haqiqiy Telegram bilan |
| WebSocket-1 | 5 | telefon (Expo), Render uyg'onishi («bir daqiqa»), ikki telefon maketi | telefon/Render yo'q | sinfda bir marta: telefonda ochib, skrinshot; Render — o'quvchi deploy'idan |
| WebSocket-2 | 8 | uchish rejimi, Expo Go qayta yuklash, Render «Manual Deploy», `AppState` fondan qaytish | telefon/Render yo'q | yuqoridagi kabi (telefon + Render) |
| Webhook | 3 | Render/Neon, mashq sahifasi brauzer oynasi (maket, matnlar haqiqiy) | Render yo'q | Render'dagi o'quvchi deploy'i bilan bir sinov |

Xulosa: A-bandlarning hech biri «noto'g'ri da'vo» emas — hammasi ochiq belgilangan va sababi yozilgan. Yopish uchun tashqi qurilma/hisob kerak (Windows/Mac, Telegram sinov boti, telefon, Render).

## B. CI/CD-2 dagi xato sinflari bo'yicha qidiruv

| # | Topilma | Qayerda | Taklif |
|---|---|---|---|
| B1 | **Eskirgan izoh:** «Keyingi dars kartasi … Webhook (⚠ mavzu nomi kurs ro'yxatidan — dars hali yozilmagan)» — Webhook darsi yozilgan va qurilgan | `21-WS2-mentor-v1.md:425` | ⚠ va izohni olib tashlash; karta nomini Webhook darsi nomiga moslash («To'lov xabari: imzo, takror va rad») |
| B2 | **Karta nomi mos emas:** Telegraf+PG kartasida «WebSocket: real vaqt aloqasi», darsning o'zi «Doimiy ulanish: Backend o'zi xabar yuboradi» | `17-TgPg-mentor-v1.md:531`, `TgPgMentorLesson.jsx` | kartani dars nomiga moslash |
| B3 | **Karta izohi:** CI/CD-1 kartasida «GitHub Actions — `uses`, `steps` tartibi va lenta logini o'qish»; CI/CD-2 darsi endi «run, log va o'quvchi darsidagi namunalar» | `14-CICD1-mentor-v1.md:520`, `cicd1/parts/08` | izohni CI/CD-2 nomiga moslash (CI/CD-2 GATE M dan keyin) |
| B4 | **«Biz sinamadik» ovozda** — halol, lekin ovozda: TgPg «Neon'ni biz sinamadik» (467), WS2 «Render'ni sinamadik» (360), Webhook «Render'da … biz buni sinamadik» (328) | ovoz matnlari | qoldirish (M10 — halollik). Faqat A-band yopilsa, gap almashtiriladi |
| B5 | **O'quvchi darsidagi namunani yurgizmasdan baholash** (CI/CD-2 ning asosiy sinfi: matrix, cache, secrets) — 8 darsda qidirildi: har darsning «O'quvchi darslari uchun alohida ish» bandlari (PG-1 3, PG-2 3, Jest-1 3, Jest-2 2, TgPg 2, WS-1 2, WS-2 2, Webhook 2 — jami 19) haqiqiy yurgizishga (`manba/<dars>-out/`) tayangan | — | topilmadi (0) |

## C. Ochiq savollar ([GATE M]) — darslar bo'yicha son
PG-1 5 · PG-2 4 · Jest-1 3 · Jest-2 2 · TgPg 3 · WS-1 2 · WS-2 3 · Webhook 2 (har MD oxirida). O'quvchi darslari uchun alohida ish: 19 band.

## Qaror kerak (foydalanuvchi)
1. B1–B3 (kartalar) — tuzatilsinmi? (3 dars, matn + generator + qayta qurish; har biri gates + e2e).
2. A-bandlar — qaysi tashqi sinovni qilamiz: Windows/Mac skrinshot (PG-1) · Telegram sinov boti (TgPg) · telefon/Render (WS-1/2, Webhook)?
