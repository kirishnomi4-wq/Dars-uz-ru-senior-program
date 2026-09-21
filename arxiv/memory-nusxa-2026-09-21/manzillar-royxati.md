---
name: manzillar-royxati
description: "Loyihaning BARCHA manzillari — prod/staging xizmatlar, LMS, Vercel demo saytlar, lokal portlar (2026-09-12 da tekshirilgan)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: eaa8a1e9-95b3-4f4d-b72a-6c09d083c785
  modified: 2026-09-12T10:58:05.935Z
---

2026-09-12 15:56 da tekshirildi — pastdagi «tirik» belgisi o'sha paytdagi holat.

## Ishlayotgan xizmatlar (prod)
| Manzil | Nima | Holat |
|---|---|---|
| `https://lms.coddycamp.uz` | **CRM/LMS** — o'quvchi va mentor darsni shu yerda ochadi | tirik (200) |
| `https://go.coddycamp.uz` | CRM fayl-ombori: `/modules/registry.json`, `/uploads/course_artifacts/*.jsx` (dars yig'malari), `/modules/html-compiler.js` | — |
| `https://dars-api.coddycamp.uz` | **bizning prod backend** (dars-api, 2026-09-11 da chiqdi); sog'liq: `/api/v1/health` | tirik (200) |
| `https://staging-dars-api.coddycamp.uz` | staging backend | tirik (200) |
| `https://school-api.coddycamp.uz` | **hamkor (CRM) API** — natija shu yerga ketadi: `/api/v1/integrations/dars-platform/lesson-results` | — |
| `https://dars-logs.coddycamp.uz` | Dozzle — server loglari brauzerda | — |

## Vercel demo/mentor saytlari — 🔴 TEGILMAYDI (F-0912-08 qarori)
Mentorlar hozir shu saytlarda dars o'tyapti, backendi **Supabase** (`MENTOR-2026` kodi).
Qayta qurilmaydi, deploy qilinmaydi, env/CORS o'zgartirilmaydi — foydalanuvchi qarori 12.09.

| Manzil | Nima |
|---|---|
| `https://coddycamp-1modul.vercel.app` | 1+2-Modul, 30 slot (nom tarixiy) — mentorlar ishlatadi |
| `https://coddycamp-1-2-modul-senior.vercel.app` | mentor relizi 2026-08-09 — mentorlar ishlatadi |
| `https://coddycamp-3modul.vercel.app` · `https://coddycamp-3-4-modul-senior.vercel.app` | 3 va 3+4-modul |
| `https://coddycamp-4modul.vercel.app` | 4-modul |
| `https://coddycamp-frontend-backend.vercel.app` | 45 dars: 4-Modul=M3 · 5-Modul=M4 · 6-Modul=4a+4b+4c |
| `https://coddycamp-texnik-darslar.vercel.app` | 70 texnik dars QA-ko'rigi (PM'siz) |
| `https://coddycamp-pm-darslar.vercel.app` | 3 PM etalon dars |
| `https://coddycamp-mentor.vercel.app` | mentor zaxira-sayti (LMS yiqilsa shu yerda dars o'tiladi) |
| `https://coddycamp-uyga-vazifa.vercel.app` | uyga vazifa paketlari |
| `https://coddycamp-etalon-test.vercel.app` | faqat 2 dars (PmLesson2 + PmUserStory) |
| `https://office-deploy.vercel.app` | Pipeline HQ — rol-vizualizatsiya |

## Repozitoriyalar
- GitHub (asosiy): `https://github.com/kirishnomi4-wq/Dars-uz-ru-senior-program`
- GitLab: staging/serverning ikkinchi tomoni ([[coddycamp-integratsiya-sirlari]])

## Lokal portlar
| Manzil | Nima uchun |
|---|---|
| `http://localhost:5300` | `npx vite --port 5300 --strictPort` — **`npm run lint:layout` shu portni kutadi** |
| `http://localhost:5173` | oddiy dev (`npx vite`); lokal dars-api CORS aynan 5173 ni kutadi |
| `http://127.0.0.1:3001` | lokal dars-api (`cd server && docker compose up -d && npm run dev`) |
| `http://localhost:5180/eski.html` | eski-versiya solishtirish vositasi |

🔴 `dars-api` ning CORS'i faqat `https://lms.coddycamp.uz` ni qabul qiladi — localhost'dan
mentor darvozasi hech qanday kod bilan ochilmaydi. Bu xato emas, sozlama.

Bog'liq: [[coddycamp-integratsiya-sirlari]] · [[darslar-holati]] · [[mentor-sayt-deploy]] ·
[[fb-demo-deploy-tartibi]] · [[m3-demo-deploy-tartibi]] · [[m4-demo-deploy-tartibi]]
