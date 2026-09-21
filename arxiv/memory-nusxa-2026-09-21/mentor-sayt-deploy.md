---
name: mentor-sayt-deploy
description: Mentor zaxira-sayti (LMS yiqilganda dars o'tiladi) — URL, tuzilishi va qayta chiqarish tartibi
metadata:
  type: project
---

**https://coddycamp-mentor.vercel.app** — mentorlar uchun zaxira sayt (2026-08-25).
LMS ochilmay qolsa mentor shu yerdan dars o'tadi: darsni ochadi → jonli sessiya → PIN →
**dars havolasini guruhga tashlaydi** → o'quvchilar shu havoladan PIN bilan qatnashadi.
Dars havolasi: `…/#/l/<kalit>` (masalan `#/l/fe-01`). Dars ichidagi **⧉** tugmasi havolani nusxalaydi.

- **Manba:** `src/mentor/` (`MentorApp.jsx` + avto-yig'ilgan `lessons.jsx`) · `mentor.html` · `vite.mentor.config.js`
- **Buyruqlar:** `npm run gen:mentor` (ma'lumot) → `npm run build:mentor` (index.html avtomatik yasaladi) →
  `cd dist-mentor && vercel deploy --prod --yes --scope azizbek10`
- **Raqamlash:** 1-Modul = Foundation (bizniki emas), shuning uchun 2 HTML/CSS · 3 JS · 4 React ·
  5 Express+PostgreSQL · 6 NestJS+Test+CI/CD. 70 dars, UZ/RU.
- **Ma'lumot qo'lda yozilmaydi:** `scripts/gen-mentor.mjs` `m1-demo` + `fb-demo` dan o'qiydi,
  `lessonId` har dars faylidan olinadi.
- 🔴 **Dars ochilishiga ARALASHMASLIK kerak** — bir marta «self» rejim urug'langan edi, bu jonli
  qatnashuvni o'ldirdi va rad etildi. PIN darvozasi — saytning ma'nosi, buzilmasin.

[[fb-demo-deploy-tartibi]] [[darslar-holati]]
