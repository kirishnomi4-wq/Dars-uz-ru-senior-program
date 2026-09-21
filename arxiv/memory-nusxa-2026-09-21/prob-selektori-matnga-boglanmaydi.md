---
name: prob-selektori-matnga-boglanmaydi
description: "ach-probe spetsifikatsiyasi elementni o'quvchi ko'radigan matn (placeholder) bilan topmaydi — barqaror sinf yoki atribut bilan topadi"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 954df238-7d6d-4ab4-9c90-160a7931bdd0
  modified: 2026-09-21T04:44:08.921Z
---

Prob spetsifikatsiyasida (`feedback/F-0918-04/b-tolqin/probe/*.json`) element selektori
**hech qachon o'quvchi ko'radigan matnga** bog'lanmaydi — `input.yz-input`, `input.text-input`
kabi **barqaror sinf** ishlatiladi. Sinf bo'lmasa, darsga sinf-ilgak qo'shiladi.

**Why:** 2026-09-21 (F-0921-15) — `CssLesson1 s15` solo probi
`input[placeholder="h1 { color: red; }"]` bilan topardi. Q4 bo'yicha ipucha matni bo'shatilgach
(KORPUS §32 — tayyor javob ipuchada turmaydi) selektor sinди: solo 26/27. Ya'ni matn-sifati
tuzatishi sinovni jimgina o'chirib qo'yadi, teshik esa ko'rinmaydi. Bundan tashqari placeholder
`tr()` orqali tarjima qilinadi — `--lang ru` da baribir sinardi.

**How to apply:** yozuv-maydoniga tegadigan har matn-tuzatishdan keyin `grep -l "<eski matn>"
feedback/F-0918-04/b-tolqin/probe/*.json` qilib ko'r; topilsa avval darsga sinf-ilgak ber
(`.css-rule-input` kabi), keyin spetsifikatsiyani sinfga o'tkaz va `--solo` yurishini qayta yurgiz.

Bog'liq: [[holat-2026-09-21]]
