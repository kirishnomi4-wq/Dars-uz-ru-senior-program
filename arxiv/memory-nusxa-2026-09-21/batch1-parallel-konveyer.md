---
name: batch1-parallel-konveyer
description: "2026-08-13 Batch 1 holati — 3 dars PASS 28/28, M4-D7 da bitta arena-band qoldi; davom-tartibi PM_PIPELINE_STATE.md chekpointida"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1a3fb1ce-3508-4863-a9e9-fed107951bff
  modified: 2026-08-13T14:34:06.101Z
---

2026-08-13 da 30 chala darsdan Batch 1 (4 dars) parallel konveyerda qurildi:
**M3-D10 `PmLesson9` · M3-D14 `PmLesson10` · M4-D2 `PmLesson11` — qabulchi PASS 28/28.**
**M4-D7 `PmLesson12` — 27/28**, qolgani: arena Q1/Q12 §110 mutlaq-so'z (metodist-aylanish
chekpointda tugallanmagan bo'lishi mumkin — `grep "hammadan oldin" src/4-Modull/PmLesson12.jsx`
bilan tekshiriladi).

**Davom-tartibi va platforma-sweep savollari:** `PM_PIPELINE_STATE.md` oxiridagi
«⏸ SEANS-CHEKPOINT» bo'limida. Foydalanuvchiga va'da qilingan: M4-D7 yopilgach UMUMIY
HISOBOT, keyin GATE 3 imzo + jonli PIN-sinovi + commit-qarori (hammasi UNCOMMITTED).

Muhim yangi qurollar (takror ishlatiladi):
- `PM_KEYS_MEXANIKA_REGISTRI.md` — keys/mexanika/artefakt-zanjir; parallel senariylar
  FAN-OUT'dan OLDIN shu jadvaldan biriktiriladi (keys + imzo-vizual + TEKSHIRUV + olam —
  to'rtovi ham, aks holda to'qnashadi)
- `pm-tekshiruvchi` 16-ov-bandi (distraktor-rostligi: savol emas EKRAN bilan solishtirish +
  shakl-telli) va 17-ov-bandi (keys-ekran: ≥2 bashorat · uzluksiz hisoblagich)
- Korpus §99–118 — test-halolligi oilasi (F-0813-01…08)
- Quruvchi-brif shabloni: M3-D10 ning 12 saboqli ro'yxati (bu batchda ishladi — keyingi
  darslar 1-darsning xatolarisiz tug'ildi)

Saboq (F-0813-09): bir darsda qabulchi topgan sinf DARHOL opa-singil darslarga grep bilan
tarqatiladi — kutilsa har biri qabulchidan alohida qaytadi.

**2026-08-14 yangilanish:** B2 senariylari tayyor (3 ta, korrektura+AVTO-GATE S muhrlangan),
qurilish foydalanuvchi talabi bilan TO'XTATILGAN (yarim-fayllar stubga qaytarilgan — qurilish
noldan qayta boshlanadi, briflar PM_PIPELINE_STATE 2026-08-14 yozuvlarida). F-0814-01
kompilyator-qobiq regressiyasi 6 darsda tuzatilgan (18-ov-band). Korpus §119–125.
**3-4-Modul demo deploy qilindi: https://coddycamp-3-4-modul-senior.vercel.app**
(m34-demo → dist-m34 → papka → vercel, scope azizbek10; 32/32 chunk 200).
