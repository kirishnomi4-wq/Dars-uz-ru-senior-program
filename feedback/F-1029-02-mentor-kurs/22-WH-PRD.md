# Mentor darsi · Webhook: to'lov xabari — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/wh-out/` (`drive-wh.sh`) va `manba/wh-amal-out/` (`drive-wh-amaliyot.sh`).

**O'quvchi darsi:** **m11-03** «Webhook: to'lov Backend'ga qanday yetib keladi» (`src/11-Modull/PaymentWebhookLesson.jsx`, 20 ekran). Ip: Maydon Jamoa — Pro obuna, test rejim (pul yechilmaydi). Yo'l: to'lov xabarini xizmat o'zi yuboradi (Telegram webhook bilan o'xshash) → imzo (manzil ochiq, soxta xabar) → javob yo'qolsa xizmat qayta yuboradi (takror) → rad etilgan to'lov ham keladi va yoziladi → test rejim (mashq to'lov) → to'lov oqimi sxemasi. A1 — o'z Backend'ida `POST /tolov/webhook` (imzo · takror · yozuv) agent bilan, `TOLOV_KALITI` faqat `.env`/Render'da; A2 — «Mashq to'lov» sahifasi va uch tekshiruv (401 · ok+takror · rad). Mentor misoli — `maydon-jamoa` `m13-dars-03-done`.
**Oldin:** WebSocket-2. **Keyin:** — (kurs ro'yxatidagi oxirgi mavzu; tasdiqlang).

1. **Biladi (3 gap):** to'lov xabarini to'lov xizmati Backend'ga o'zi yuboradi — ilovaning «to'landi» degani dalil emas. Imzo — xom tana + maxfiy kalitdan HMAC; mos kelmasa 401 va hech narsa yozilmaydi; tekshiruv yozuvdan oldin. Takror xabar — to'lov raqami noyob, ikkinchisi `200 { takror: true }`; rad ham yoziladi.
2. **Qo'li bilan (3 amaliyot):** P1 lokal Backend + kalit + mashq sahifa: «To'lash», «Rad etish» · P2 «Ikki marta», «Imzosiz» · P3 buzamiz: `rawBody` olib tashlanadi → haqiqiy to'lov ham 401 → qaytariladi.
3. **Haqiqiy loyiha:** `maydon-jamoa` Backend'i (mashq sahifa ham Backend'da) — lokal; brauzerda bosildi (headless Chrome). Render (`RENDER_EXTERNAL_URL`), Neon — sinalmagan (⚠).
4. **Buzamiz:** soxta imzo (4 xil) · xom tana o'zgargan · kalit bo'sh · `rawBody` yo'q · tekshiruv tartibi buzilgan (401, lekin qator yozilgan).
5. **Ko'prik:** m11-03 xaritasi · A1/A2 (kalit gigiyenasi, Render kutish) · o'quvchi tili · sinfdagi holatlar.
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'z Backend'ida (yoki `maydon-jamoa` nusxasida) tekshiruv tartibini buzib ko'rish va qaytarish + mashq sahifada uch tekshiruv → GitHub linki (M30).
8. **Hajm:** 20 ekran · ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — mentor amaliyoti lokal (Render'siz); Render'da `RENDER_EXTERNAL_URL` bilan o'zi-o'ziga yuborish — sinfda (⚠).
   - **Q2** — o'quvchi darsidagi sxemada «Pro muddatini uzaytiradi» — reja; repo'da hali yo'q (README «Hozir ishlaydi» qatori). Mentor shuni bilishi kerak.
