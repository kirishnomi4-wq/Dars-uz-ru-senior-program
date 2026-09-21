---
name: no-commit-without-approval
description: "Hech qachon o'zim commit qilmasligim kerak — faqat foydalanuvchi aniq \"commit qil\" deganda"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c0edd3e6-e97f-4f1c-9d67-b34e8de431a5
  modified: 2026-07-23T15:17:59.540Z
---

Foydalanuvchi (2026-07-07, eski mashinada; hozirgi mashinada ham amal qiladi): «commit men aytmaguncha qilma» — barcha loyihalarda git commit faqat foydalanuvchi aniq buyruq berganda qilinadi.

**Why:** Foydalanuvchi o'zgarishlarni avval IDE'da sariq (modified) belgilar orqali ko'rib chiqib, tasdiqlashni xohlaydi. Commit qilinsa bu belgilar yo'qoladi va nazorat qo'ldan ketadi.

**How to apply:** Tahrir tugagach o'zgargan fayllarni ro'yxat qilib berish, working tree'ni uncommitted qoldirish. «Commit qilaymi?» deb taklif qilish mumkin, lekin buyruqsiz bajarmaslik. Etalon-hujjat ([[DARS_ETALON]] / PM_DARS_ETALON) yangilashlariga ham tegishli — tasdiq bilan.
