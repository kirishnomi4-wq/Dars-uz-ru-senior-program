---
name: token-efficient-quality
description: "Sifatni buzmasdan token tejash — to'liq rol-zanjir qoladi, faqat bosh-agent overhead qisqaradi"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c0edd3e6-e97f-4f1c-9d67-b34e8de431a5
  modified: 2026-07-23T15:18:17.399Z
---

Foydalanuvchi (2026-07-14) token sarfidan xavotirlandi, lekin **sifat pasayishiga rozi emas**. Qaror: to'liq rol-zanjir SAQLANADI; token faqat bosh-agent tarafida tejaladi.

**How to apply:**
- Status-xabarlar QISQA (asosiy token subagentlarda).
- Darvoza-tekshiruvlarni BITTA bash'da birlashtirish (esbuild+residue+arena+grapheme+wiring birga).
- Agent tekshirgan narsani TAKROR yuritmaslik — hisobotiga ishonish + faqat yakuniy dasturiy darvoza ([[pipeline-qoidalari]] QOIDA 10 bilan muvozanatda: «PASS» so'ziga emas, skript-natijaga ishon).
- Agent-promptni oldindan aniq berish (residue-grep, arena 3/3/3/3, INLINE↔javob mosligi) — shunda qaytarish kam.
- Metafora-ideani ba'zan bosh-agent o'zi taklif qiladi (Ijodkor-rol o'rniga) — tasdiq baribir foydalanuvchida.
- Tarjima/bulk ishda: mayda Edit o'rniga bulk Python-skript ~3x tez ([[ru-i18n-konvensiya]]).
