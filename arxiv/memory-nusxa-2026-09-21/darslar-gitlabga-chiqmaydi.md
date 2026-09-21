---
name: darslar-gitlabga-chiqmaydi
description: "🔴 QAT'IY (2026-09-16): darslar (src/, lms/) GitLab'ga va serverga HECH QACHON chiqarilmaydi — faqat server/ GitLab'ga; darslarni foydalanuvchi go.coddycamp'ga QO'LDA yuklaydi"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 72e52421-b4d6-4f9f-911c-a5e8d59a6874
  modified: 2026-09-16T09:51:36.961Z
---

Darslar GitLab (dars-api-coddy) va serverga umuman chiqarilmaydi. GitLab'ga faqat `server/` papkasi (backend) ketadi
(`scripts/sync-dars-api.sh` — u lms/ va src/ ga tegmaydi). Darslarni foydalanuvchi o'zi, har darsga moslab, `lms/` yig'masidan
go.coddycamp (CRM «Umumiy modullar») ga qo'lda yuklaydi. Darslar uchun bizning yagona chiqish nuqtasi = GitHub `origin/main`
(o'z repo'miz) + `lms/` yig'malari kompyuterda.

**Why:** foydalanuvchi so'zi (2026-09-16): «Gitlab va serverga umuman darslarimiz chiqmaydi, kerakmas, aralashtirishga umuman
haqqimiz yo'q!» — LMS jamoasining serveri/repo'siga dars-kodini aralashtirish taqiq.
**How to apply:** sync/deploy buyruqlarida faqat `server/` haqida gapiring; «darslarni GitLab'ga chiqarish» iborasi ishlatilmaydi;
prod-yo'riqnomada dars-qadamlari = «build:lms → foydalanuvchi CRM'ga yuklaydi». Push/sync buyruqlarini foydalanuvchi o'zi `!` bilan yurgizadi.
Bog'liq: [[coddycamp-integratsiya-sirlari]] · [[manzillar-royxati]] · [[holat-2026-09-16]]
