---
name: batch2-b3-konveyer
description: "Batch 2 va Batch 3 to'liq yopildi (2026-08-18) — 10 dars GATE 3 imzosini kutmoqda; keyingi ochiq band = foydalanuvchi qarorlari + B4"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7b6de2bf-6a35-4cb6-aa5b-484e60dc04d9
  modified: 2026-08-18T06:16:55.505Z
---

2026-08-18 holati: **BATCH 2 (3/3) va BATCH 3 (3/3) to'liq yopildi.** B1+B2+B3 = **10 PM dars**, har biri
qabulchi PASS 28/28 + verifikator PASS. Hammasi **UNCOMMITTED** — commit faqat foydalanuvchi buyrug'i bilan
([[no-commit-without-approval]]).

10 dars: PmLesson9 (M3-D10) · PmLesson10 (M3-D14) · PmLesson11 (M4-D2) · PmLesson12 (M4-D7) · PmLesson13 (M4-D12) ·
PmLesson14 (M4-D15) · PmLesson15 (M4a-D2) · PmLesson16 (M4b-D2) · PmLesson17 (M4c-D2) · PmLesson18 (M4c-D6).

**Ochiq bandlar (foydalanuvchi qarorini kutadi):**
1. GATE 3 imzo — 10 dars prodga.
2. Jonli PIN-sinovi (MENTOR-2026, ≥2 o'quvchi, podium/arena ≠ 0) — faqat qo'lda o'lchanadi, agent qila olmaydi.
3. Platforma-sweep (o'lchangan raqamlar): kompilyator `zoom: 'calc(1 / var(--lz, 1))'` bekori — 27 faylda fixed-qobiq,
   faqat PmLesson15/17 da tuzatish bor → **25 fayl nomzod**; koding-darvoza `|| isMentor || done` — **11 dars**;
   `StudentPracticePulse` koding-ekranida — **20 fayl**. Uchalasi oila-naqshi, bir darsda alohida tuzatish
   etalon-paritetni buzadi.
4. m34-demo registri 4a/4b/4c ni olmaydi → PmLesson15/16/17/18 demo-URL da ochilmaydi (nuqson emas, qamrov).
5. B4 (M5, 3 dars) boshlanishi.

**Parallel-boshqaruv relslari (ishlab turgan, o'zgartirmang):** bir fayl — bir muharrir; parallel faqat darslar orasida
yoki read-only rollar orasida (verifikator ∥ qabulchi); umumiy fayllar (`MATN_KORPUS.md`, `PM_KEYS_MEXANIKA_REGISTRI.md`,
`PM_PIPELINE_STATE.md`, `App.jsx`, `_lessonids.txt`) faqat bosh-agent qo'lida; har roldan keyin
`node pipeline-b3/b2-check.mjs <fayl>`. **B4 uchun cheklov:** verifikatorlar brauzer+dev-server ochadi → 3 tasini
birdan yugurtirib bo'lmaydi (ketma-ket), qabulchilar esa parallel.

Hujjatlar: repo `B3_DAVOM.md` (yopilgan, tarix) · `pipeline-b3/` (brif, b2-check.mjs, SAVOLLAR, QOLDIQLAR) ·
`PM_PIPELINE_STATE.md` (2026-08-18 yozuvi) · `MATN_KORPUS.md` §126–**§134**.
Bog'liq: [[pipeline-qoidalari]] · [[batch1-parallel-konveyer]] · [[matn-korpus-tizimi]] · [[darslar-holati]]
