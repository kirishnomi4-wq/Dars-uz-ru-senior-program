---
name: korpus-27-yangi-sinf
description: 2026-08-19 da korpusga muhrlangan 27 sinf (§138–§149) — eng muhimlari va ularning tekshiruv-usullari
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6d5a6131-c6e4-434e-8fc6-4eee392455cb
  modified: 2026-08-19T14:53:37.447Z
---

**2026-08-19, `MATN_KORPUS.md` §138–§149 (F-0819-08…37)** — 27 yangi sinf, har biri
**tekshiruv-usuli bilan**. Ular o'sha kuniyoq ish berdi (arena-nusxa sinfi to'rt darsda topildi).

**Eng ko'p ishlaganlari:**
- **§139** — ekran holati o'quvchining HARAKATINI ko'rsatsin, oldindan yozilgan ssenariyni emas.
  Tekshiruv: har interaktiv ekranni **to'g'ri / xato / kutilganidan boshqacha** tanlovda solishtirish.
- **§143 (jarayon sinfi)** — aniqlashtiruvchi izoh qo'shishdan OLDIN o'sha tushuncha darsda nechta
  joyda qatiy belgilanganini grep qilish, ayniqsa **ballanadigan qatlamda** (`QUIZ_BANK`, `INLINE_KEYS`,
  flashcard). Sabab: bosh-agentning tuzatish-ko'rsatmasi yangi zidlik yaratdi.
- **§144 + F-0819-36** — arena↔flashcard mavzu-takrori **nuqson EMAS** (muqarrar). Nuqson —
  **kalit-aks-sadosi**: kalit karta-javobini so'zma-so'z takrorlaydi, distraktorlar uzoq.
  Raqamli mezon: `E_kalit ≥ 0.75` VA `E_kalit − E_distr ≥ 0.35`. Sog'lom daraja **1–2 / 12**.
- **§147-A** — 3-vs-1 shakl-telli (to'g'ri javob yolg'iz boshqa qolipda). 🔴 Bu nuqson **tuzatish
  paytida tug'iladi** — har qayta-yozishdan keyin qayta o'lchash shart. Grammatik ko'rinishi ham bor
  (uch distraktor tugal gap, kalit yolg'iz ot-birikma).
- **§147-B** — skroll/grapheme o'lchovi **kirish-artefakti mavjud** holatda qilinadi (artefaktsiz
  o'lchov eng keng tarqalgan holatni chetlab o'tadi).
- **§148-A** — sarlavha mexanikaning **istisnosini** ham aytsin («uch varaqdan bittasi butunlay
  to'g'ri» qarori sarlavha «har varaqda…» degani uchun amalda ishlamadi).
- **§145** — flashcard darsda o'rgatilmagan nomni so'ramasin (bir kunda ikki darsda chiqdi).
- **§149** — chip-yorlig'i gap emas, **holat nomi** (≤4 so'z) va **haqiqiy predikatga** bog'langan.

**Kuzatuv:** `til-lint` hujjatlarda yolg'on-ijobiy beradi — registrga taqiq-so'zni misol qilib
yozganda qoida uni tutadi. `prompt-lint` da jurnal-misol istisnosi bor, `til-lint` da yo'q.

Bog'liq: [[batch4-b5-yopildi]] · [[matn-korpus-tizimi]] · [[adabiy-til-uslub-qoidasi]]
