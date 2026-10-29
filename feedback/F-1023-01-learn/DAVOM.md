# DAVOM — 29.10 21:52 yangilandi

Yangi seans SHU fayldan boshlanadi. To'liq tarix: `JURNAL.md` (shu papka), reja: `REJA-20261028.md`.

## ✅ CRM YUKLASH TUGADI — 29.10 21:52
- 172 dars / 344 qator CRM'da (paket `yuklash-20261029-prod`, commit `15039598`); md5 344/344 ✓ (modul bo'yicha + mustaqil keshsiz qayta o'qish; sarlavha/tartib/til/holat o'zgarmagan, #13379/#13380 tegilmagan).
- Muhr: `LMS_REESTR.json` + `LMS_DEPLOY_JURNAL.md` (172 dars, server `0f242c77`). Commit + push — foydalanuvchi ruxsati bilan (29.10 21:5x).
- Natijalar: `crm-yuklash-20261029/dump/` (hash-m2…m14, crm-keyin.json, zanjir.json).
- **Keyingi:** Learn'larni Active qilish — yakshanba 01.11, foydalanuvchi bilan (alohida ish). Prod smoke (o'quvchi ko'zi bilan 1–2 dars) — foydalanuvchi xohlasa.

## ✅ Savol yuklash TUGADI (29.10 tungi avtopilot)
172/172 Learn'da CodeStrike savollari (4128 ta: har Learn 12 uz + 12 ru), har modul CRM'dan keshsiz qayta o'qib xesh bilan tekshirilgan; yakuniy sanoq 172/172. Holat: `savol-yuklash/YUKLASH-REJA.csv` — hammasi ✓.
Learn'lar **Draft** — Active qilish **yakshanba (01.11)**, foydalanuvchi bilan.

## Boshqa ochiq ishlar
| # | Ish | Holat |
|---|---|---|
| A | 6 eski uyga vazifa bandi (3-M: 2794, 2801, 2798) | ✅ 29.10 14:47 foydalanuvchi o'chirdi |
| B | Abdulloh — PODIUM-05 javobi | 29.10 kutilmoqda. Xat yuborilgan: `XAT-ABDULLOH-PODIUM-05-UZ.md`. Prod: dars-api `0.1.0+0f242c77`, migratsiya 10 |
| C0 | 29.10 20:15: yuqoridagi 🔴 blokka qarang. **29.10 17:40 HOLAT:** Abdulloh OK («газ проодга») → podium 182 darsga ✓ → testlar ✓ → v7 patch asosiy repoda → **commit `15039598`** (src, 190 fayl, push yo'q) → paket `yuklash-20261029-prod` 172/172 O'TDI → `reliz-20261029/SHA256-172.csv` + xat `XAT-ABDULLOH-RELIZ-UZ.md` tayyor. **Keyingi:** xatni yuborish (foydalanuvchi) → CRM'ga yuklash (YUKLASH_PROTOKOLI) → `lms-farq muhrla … --server 0f242c77` → commit + push | ruxsat bilan |
| C | Abdulloh OK desa (29.10): podium 172 darsga (`podium-vositalar/pod-codemod.mjs --yoz`, quruq 183/183) → testlar → to'liq reliz paketi (CodeStrike + podium + RU 45) → SHA Abdullohga → CRM → muhr → commit | Har qadam ruxsat bilan. Joriy patch: **`codestrike-kod-v6-solo-yopiq-20261029.patch`** (v5 + F-1029-01: CodeStrike faqat jonli darsda, 183/183 QuizArena — podium codemod v6 ustiga) |
| F | F-1029-01 CodeStrike faqat ustozga ulangan jonli darsda (solo/review/sinf tugagan → yopiq, Learn ochiladi) | ✅ 29.10 15:18 patch v6, 40/40 brauzer sinovi; relizda C bilan birga |
| D | «Kutmasdan yakunlash» zaxira tugmasi (45 s) | ✅ 29.10 QOLADI (hozircha). Xavotir: mentor bosishni bilmasligi mumkin → analitika yo'qoladi. Keyinroq o'ylanadigan g'oya (foydalanuvchi): oxirgi sahifaga yetganda data avtomat ketadi; CodeStrike o'ynalsa — arena yopilishi bilan natija darhol; 30 daqiqada o'ynalmasa — avtomat «o'ynalmadi» → Learn ochiladi. Hozir kodga tegilmaydi |
| E | 2-M uyga vazifa tartibi | ✅ 28.10 tuzatildi (2780 → 103, 2779 → 108) |

## Commit holati
- Commitlar: `c4f83160` (RU 45, push yo'q) · `1bca3d13` (server 0010; GitLab staging `fc5ef42` + main `0f242c7`, prod deploy qilingan).
- Commit qilinmagan: `feedback/F-1023-01-learn/*` (jurnal, xatlar, patchlar, savol-yuklash, podium-vositalar), `codestrike-savollar/`, `scripts/codestrike-savollar.mjs`, `feedback/F-1028-01-lms-modullar/`. Commit/push — faqat buyruq bilan.

## O'zgarmas qoidalar
So'roqsiz hech narsa qilinmaydi; har modul/qadamdan oldin reja + rozilik. Login/parol kiritilmaydi. Savollar oddiy tilda, bitta misol bilan. Jurnal vaqti `date` bilan.
