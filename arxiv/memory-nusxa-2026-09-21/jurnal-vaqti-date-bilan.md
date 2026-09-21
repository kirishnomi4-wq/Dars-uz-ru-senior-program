---
name: jurnal-vaqti-date-bilan
description: Jurnal/muhr/xotiraga vaqt yozishdan oldin `date` yurgiziladi — taxminiy vaqt yozilmaydi (18.09 da 6 qator noto'g'ri yorliq bilan yozilgan)
metadata:
  type: feedback
---

`PIPELINE_STATE.md`, DAVOM muhri va xotiraga vaqt-yorlig'i yozishdan oldin `date '+%Y-%m-%d %H:%M'` yurgiziladi.

**Why:** 2026-09-18 da uzun seansda vaqtni «his bilan» yozib ketganman: haqiqiy 21:39 da jurnalga «03:10 (19.09)» deb yozilgan, olti qator xato yorliq olgan. Foydalanuvchi jurnalga tayanadi (qaytish nuqtasi, kim qachon nima qildi) — xato vaqt halollikka zid. Fayl mtime va commit vaqti bo'yicha tuzatildi.

**How to apply:** har jurnal qatori, har «Muhr — …» sarlavhasi, har xotira-yozuvdan oldin `date`. Uzun seansda vaqt tuyg'usi ishonchsiz — ayniqsa fon-agentlar ishlaganda. Bog'liq: [[holat-2026-09-18]].

**Takror (18.09 tun, ikki marta):** `date` ni vaqtni yozadigan buyruqning O'ZIDA chaqirish yetmaydi — natijani ko'rmasdan oldin yorliq yozib bo'lingan bo'ladi. To'g'ri tartib: avval alohida `date`, natijani o'qib, keyin yozish.
