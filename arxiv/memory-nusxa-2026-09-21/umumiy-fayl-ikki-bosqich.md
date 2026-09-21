---
name: umumiy-fayl-ikki-bosqich
description: "Ko'p modul ishlatadigan faylga (P0 etalon kabi) tegishdan oldin ishoralar ro'yxati talab qilinadi — ish ikki bosqichga bo'linadi"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9410a865-5aac-4dba-b37f-edad53219dc5
  modified: 2026-08-20T08:03:39.366Z
---

Modul-ichi ish bilan **umumiy faylga** (masalan `src/pm/PmUserStoryLesson.jsx` — P0 etalon,
6 ta kirish nuqtasi import qiladi) tegadigan ish **bir bosqichda birlashtirilmaydi**.
Foydalanuvchi tartibi (2026-08-20, 3-Modulni yopish):

- **BOSQICH A** — modul ichidagi xavfsiz ish, ro'yxat bo'yicha.
- **BOSQICH B** — umumiy fayl: (1) **avval** unga qaysi modul/fayllar ishora qilishini
  ro'yxatla (haqiqiy `import` va izoh-ishorani ajratib), (2) keyin tuzat, (3) oxirida
  **bog'liq kirish nuqtalarining hammasini** qurib, hech narsa sinmaganini isbotla.
- Har bosqichdan keyin **alohida qisqa hisobot**. B da ishora kutilmagan joyga chiqsa —
  **to'xtash** va birga qaror qilish.

**Why:** umumiy faylni «yana bitta dars» deb tuzatish boshqa modullarga jim ta'sir qiladi;
ishoralar ro'yxati ta'sir doirasini tuzatishdan OLDIN ko'rsatadi.

**How to apply:** `grep -rn "<FaylNomi>" src/` → `import` qilganlarni izoh-ishoradan ajrat;
tuzatgach har bir kirish nuqtasini esbuild bilan qur (`--loader:.png=dataurl` shart, aks holda
`App.jsx` aldab «xato» beradi). Bog'liq: [[parallel-seans-modul-chegarasi]] ·
[[diagnose-before-fix]] · [[pm-ikki-tur-etalon]]
