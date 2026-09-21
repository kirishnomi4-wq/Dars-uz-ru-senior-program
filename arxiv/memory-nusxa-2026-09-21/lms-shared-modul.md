---
name: lms-shared-modul
description: "LMS tashqi-kompilyator holati — MVP URL-yo'li (19 dars .shared.jsx tayyor, smoke 38/38), registry hali bo'sh, ro'yxatga qo'yish huquqi bizda"
metadata: 
  node_type: memory
  type: project
  originSessionId: 91f8de71-b251-417f-9c17-4a9270bfe691
  modified: 2026-08-17T10:14:25.521Z
---

2026-08-17 holati (batafsil jurnal: PIPELINE_STATE.md oxirgi yozuv):

- **Modul:** `lms/html-compiler.jsx` (98 252 bayt, MD5 `a9141db9…`) = LMS'dagi
  `https://go.coddycamp.uz/uploads/course_artifacts/f9e30f4aaecfeada4e3482bfe60877d2.jsx`.
  Bu TO'LIQ kompilyator (hozirgi manba bilan bayt-bayt bir xil) — qayta yuklash shart emas.
- **MVP qarori (foydalanuvchi, 2026-08-17):** ro'yxatni kutmay URL-yo'lida ketamiz.
  `node scripts/build-lms.mjs --shared <URL>` → 19 ta `lms/*.shared.jsx`, `smoke-shared.mjs`
  19/19 × React 18.3.1 + 19.2.7 o'tdi. Foydalanuvchi ularni CRM'ga qo'lda yuklaydi.
  Kelishuv: modul yangilansa → yangi URL → 19 dars qayta yig'ilib qayta yuklanadi.
- **Registry (`/modules/registry.json`) hali BO'SH.** LMS 3-raund javobi (14-avg): ro'yxatga
  qo'yish huquqi BIZDA — CRM → Media kutubxona → **Umumiy modullar** → «Yangi nom» `html-compiler`
  → «Yangi nashr». Ro'yxatdan keyin manzil `/uploads/shared_modules/…` (1 yil kesh), darsda
  faqat `@shared/html-compiler`. `version.json` chiqarilgan (build 117).
- Keyingi bosqich: registry to'lgach N-test 1/2/3/7 → `@shared/html-compiler`ga o'tish +
  saytda Vite alias (PRIMOY yo'nalishi: src'dan to'g'ri yuklash).
- **LMS OnlineCompiler'ga qiziqmaymiz**; hw-tugma 5 darsdan olib tashlangan (F-0813-02),
  `onHomework` mexanizmi kodda qoldi (smoke seed'iga kerak).
- Smoke-harness: React 18 papkasi scratchpad `react18/` (`REACT_DIR=...`); PM darslar uchun
  KODING-ekran urug'i (KODING_KEY + SCREEN_META) avto-tanlanadi; `react-dom` importmap'da bor.
- [[darslar-holati]] [[pipeline-qoidalari]]
