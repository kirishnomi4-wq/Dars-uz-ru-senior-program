# DAVOM — 27.10.2026 19:51 da saqlandi (foydalanuvchi ~3 soatdan keyin yangi seansda qaytadi)

Yangi seans SHU fayldan boshlanadi. Ikki ish ochiq — **bittadan** (foydalanuvchi: «bitta ochirda»), avval 1, keyin 2.

## 1. RU satr-qiymatlar — 45 dars LMS'ga (F-1027-01)
- Kod tayyor, **commit YO'Q**: src/compilator/HtmlCompiler.jsx (tekshiruv {uz,ru}) + 6 dars (JsConditions, JsFunctions, JsLoops, PracticeLesson1, PmYearPath, PmTenIdeas) + jurnallar + KATTA_TOZALASH.md.
- Foydalanuvchi qarori: kompilyator tufayli 45 dars o'zgargan chiqadi — **45 tasini ham yuklaymiz**.
- Sinov-paket (`paket --majbur`, scratchpad) O'TDI: lint:jsx ✓, smoke-lms ✓, smoke-preview 45/45, server sync kerak emas.
- **Keyingi qadam:** foydalanuvchidan «commit qil» buyrug'i → commit (push yo'q), xabar:
  `fix(ru): kompilyator tekshiruvi {uz,ru} qabul qiladi + 6 dars ru satr-qiymatlari (F-1027-01)`
  → `node scripts/lms-farq.mjs paket --out yuklash-2026-10-27-prod-ru` (sana yangi kun bo'lsa — o'sha sana) → yuklovchi seans (YUKLASH_PROTOKOLI.md) → yuklangan.csv → muhrla (ruxsat bilan) → reestr commit (buyruq bilan).
- Ochiq: CRM'dagi 6 eski uyga vazifa bandi (17333/34, 17349/50, 17351/52) — foydalanuvchi o'chiradi.

## 2. CodeStrike → Learn (F-1023-01) — Abdulloh javobini kutmoqda
- Abdulloh 27.10 javobi: `feedback/F-1023-01-learn/XAT-ABDULLOH-JAVOB-UZ.md` (backend PRODda; Learn = modulda Class'dan keyingi BIRINCHI FAOL dars; savol-JSON formati kelishilmagan).
- Biz yubordik (19:32, foydalanuvchi o'zi): `XAT-ABDULLOH-OMMAVIY-UZ.md` + `ommaviy-yuklash/` SHA256-172.csv, CLASS-LEARN.md/.csv (CRM 13 bo'lim o'qildi, 172/172 mos). Internet SHA = ba2268cf…0627 = Abdulloh sinagan v2.
- **Kutilayotgan javob:** Draft Learn backend'ga «faol» hisoblanadimi? Yo'q bo'lsa — Learn'lar Active bo'lishi kerak (hozirgi qoida: «Draft'dan Learn ochilmaydi» — foydalanuvchi qarori kerak).
- Savol-JSON'ni (`codestrike-savollar/lms/`, 344 fayl) foydalanuvchi O'ZI yuklaydi.
- Abdulloh «tayyor» desa: (1-ish commit'dan keyin) `git apply --3way feedback/F-1023-01-learn/codestrike-kod-v3-bug01-20261023.patch` → testlar (resultDetails 36, previewMode 8) → darvozalar → `lms-farq paket` (172 dars) → SHA'lar SHA256-172.csv bilan solishtiriladi (bir xil chiqishi kerak) → yuklash.
- Learn'larni CRM'da ochish: CLASS-LEARN.md «Learn tartibi (reja)» ustuni; har moduldan oldin ro'yxat ko'rsatiladi, rozilik olinadi.

## Qoidalar
Commit/push faqat buyruq bilan · CRM'ga faqat ruxsat bilan, parolni foydalanuvchi kiritadi · so'roqsiz tahrir yo'q · jurnal vaqti `date` bilan.
