---
name: fon-buyruq-ozini-koradi
description: "Fon-buyruqda pgrep/pkill o'z buyruq-satrini ko'radi — kutish-tsikli abadiy aylanadi yoki qobiq o'zini o'ldiradi; boshqa naqsh ishlat"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 62776bd0-154c-45e7-9d6f-20b02bd3bfe4
  modified: 2026-09-20T09:30:13.524Z
---

`until ! pgrep -f "<nom>"; do sleep 5; done; <keyingi buyruq>` — bu kutuvchi **o'z buyruq-satrini** ko'radi (satrda o'sha `<nom>` bor), shuning uchun tsikl hech qachon tugamaydi va keyingi buyruq umuman ishga tushmaydi. Xuddi shu sinf: fon-buyruqda `pkill -f "vite --port…"` o'z qobig'ini ham o'ldiradi (18.09).

**Why:** 20.09 da shu sabab qayta sinov ~3 soat «ishlayapti» bo'lib ko'rindi — aslida boshlanmagan edi; men foydalanuvchiga «ketyapti» deb noto'g'ri holat aytdim.

**How to apply:** kutishda jarayonning O'ZIGA xos, buyruq-satrimda yo'q naqshni ishlat (`pgrep -f "node scripts/ach-probe"`), yoki umuman kutma — buyruqni `run_in_background: true` bilan yurgiz va tugash-xabarini kut. Tekshirganda `pgrep -af <naqsh>` bilan haqiqiy satrga qarab tasdiqla (shell-satrmi yoki `node`mi). Bog'liq: [[jurnal-vaqti-date-bilan]].
