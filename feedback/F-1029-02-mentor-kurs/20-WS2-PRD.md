# Mentor darsi · WebSocket-2: ulanish uzilsa — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib №11 (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/ws2-out/` (`drive-ws2.sh` + `ws2-sinov.js`) va `manba/ws2-amal-out/` (`drive-ws2-amaliyot.sh`).

**O'quvchi darsi:** **m10-05** «Ulanish uzilsa: buzamiz va tuzatamiz» (`src/10-Modull/BreakAndFixLesson.jsx`, 19 ekran). Ip: Maydon Jamoa. Agent «uchala chekka holatni bajardim» degan (da'vo, tekshirilmagan) → uch usul bilan buzish: internetni uzish · fonga olib qaytarish · Backend'ning yangi versiyasi → buzish yozuvi (nima qildim · nima kutdim · nima bo'ldi → belgi) → uch muammo va sababi → tuzatish (`connect` ichida faqat qayta so'rash va xonaga qayta kirish; tinglovchi tashqarida) → qayta tekshiruv. A1 — o'z ilovasini uch usul bilan buzish (agent boshqa akkauntdan o'zgarish qiladi, Render'da qo'lda qayta chiqarish), A2 — agentga tuzattirish va qayta tekshirish. Mentor misoli: `maydon-jamoa` `m12-dars-05-start` (kod = `m12-dars-04-done`) → `m12-dars-05-done` (`BUZISH.md` + tuzatish; Backend o'zgarmagan).
**Oldin:** WebSocket-1. **Keyin:** Webhook (yoki kurs tartibidagi keyingi mavzu).

1. **Biladi (3 gap):** uzilish paytida yuborilgan hodisa qayta ulangach kelmaydi — `connect` da qayta so'rash kerak. `connect` har qayta ulanishda ishlaydi — ichida tinglovchi qo'shilsa, bitta hodisa ikki marta ishlaydi. Uzilganda ulanish hamma xonadan chiqadi — qayta ulangach ochiq o'yin xonasiga qayta kirish kerak.
2. **Qo'li bilan (3 amaliyot):** P1 takror tinglovchini chaqirish (Backend Ctrl+C → start → Vali qo'shiladi) → isbot `tinglovchi ishladi (2)` · P2 ikkinchi telefon (Vali klienti) xonaga kiradi → isbot «Hozir ko'ryapti: 1» · P3 tuzatilgan klient → isbot «Hozir ko'ryapti: 2».
3. **Haqiqiy loyiha:** Backend `maydon-jamoa` haqiqiy; ilova o'rniga Node klient, `ulanish.ts` ning ikki versiyasi aynan. «Internet uzildi» — TCP proksi kesildi (demo); telefon, Expo Go, Render — sinalmagan (⚠).
4. **Buzamiz:** uchala xato — eski va tuzatilgan versiyada, yonma-yon.
5. **Ko'prik:** m10-05 xaritasi · A1/A2 (agent, Render, Expo Go eslatmasi) · o'quvchi tili · sinfdagi holatlar.
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'z loyihasida (yoki `maydon-jamoa` nusxasida) bitta usul bilan buzish yozuvi (bir qator) + tuzatish + qayta tekshiruv → GitHub linki (M30).
8. **Hajm (taxmin):** 20 ekran · ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — amaliyotda «internetni uzish» yo'q (mentor kompyuterida proksi kerak bo'lardi); u faqat haqiqiy demo (`ws2-out/01–02`) sifatida. Qo'lda — Backend'ni qayta ishga tushirish (2 va 3-xato).
   - **Q2** — amaliyot tegi `m12-dars-05-start` (kod `m12-dars-04-done` bilan bir xil, farq faqat README eslatmasi — tekshirildi).
