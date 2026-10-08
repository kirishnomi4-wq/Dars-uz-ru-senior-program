# 13-Modul — davom prompti (yangi seans uchun) · 08.10.2026 (QA fidbeki uchun)

> Tayyorladi: 13-Modul seansi (F-1007-488). Foydalanuvchi pastdagi blokni yangi seansga nusxalab beradi va QA fidbekini qo'shadi.

```
13-Modul seansining DAVOMI — QA FIDBEKI (LMS 13-Modul «O'sish va monetizatsiya», kod src/11-Modull, kalitlar m11-NN, F-ID 489 dan).
Holat: 12/12 dars qurildi, sadoqat + vizual tekshiruvdan o'tdi, tuzatildi (gates 12/12, kesik 0, lint:jsx 0).
QA sayti: https://coddycamp-13modul.vercel.app (smoke 24/24; QA faqat o'zbekchani tekshiradi — RU qoralama).

1. Avval o'qing: feedback/F-1007-13modul/JURNAL.md (Holat jadvali, oxirgi yozuvlar F-1007-481…488, MEXANIZM-TAKLIF) ·
   feedback/F-1007-13modul/QURUVCHI_SABOQ.md (P-bo'lim 1–15) · CLAUDE.md retsept B · memory: seans-13modul-2026-10-07, m13-qa-sayti, app-modul-raqamlari-lms.
2. QA fidbeki — retsept B: har topilmaga F-1007-NNN (489 dan), avval tashxis + taklif, tasdiqdan keyin tuzatish; sinf-supurish 12 darsda;
   har tahrirdan keyin `npm run gates -- <fayl>` 12/12 va `node feedback/F-1007-13modul/vositalar/kesik.mjs m11-NN <fayl> desk mob` 0.
3. Fidbek yopilgach: konveyer 7 (yakuniy MD, feedback/F-1007-13modul/YAKUNIY/) va 6 (RU sifat) — keyin QA saytini qayta deploy (memory m13-qa-sayti tartibi), modul yopish.
   RU-qarz: 08 WinBackDay prompt joylari ({qaysi o'zgarishda} va b.) ru da o'zbekcha. MD lar ekran raqamini 0 dan sanaydi, kod 1 dan — yakuniy MD koddan.
4. O'zgarmaydi: agent — faqat ruxsatim bilan · commit, push, deploy — faqat buyrug'im bilan · faqat o'z fayllaringiz (src/11-Modull, src/m11-demo,
   modul11.html, vite.m11.config.js, dist-m11, feedback/F-1007-13modul, App.jsx dagi `slug: 'm11'` bloki) · `pkill -f` ishlatilmaydi (faqat PID) · vaqt `date` bilan.
```

## Holat (08.10)
| Nima | Holat |
|---|---|
| 12 dars (01–12) | ✅ qurildi, tekshirildi, tuzatildi; 03, 06 — pilot, foydalanuvchi tasdiqlagan |
| Sinf-supurish | ✅ telefonda bloklar skrolli, ⛶ ichida tugmalar, kod chipi (01–12) |
| QA sayti | ✅ coddycamp-13modul.vercel.app (Vercel loyiha coddycamp-13modul) |
| RU | texnik tekshiruv ✅ (skan + ru-walk); uslub tahriri — fidbekdan keyin |
| Yakuniy MD | — (fidbekdan keyin) |
| Commit | YO'Q — ishchi papkada (src/11-Modull, src/m11-demo, modul11.html, vite.m11.config.js, App.jsx, feedback/F-1007-13modul) |
