---
name: jonli-ball-tizimi
description: "Jonli-ball (Kahoot-uslub) tizimining tarixiy bilimi — server-ball, set_quiz_keys avto-kalit, zonalar, sinov-tartibi"
metadata: 
  node_type: memory
  type: project
  originSessionId: c0edd3e6-e97f-4f1c-9d67-b34e8de431a5
  modified: 2026-07-28T14:03:22.221Z
---

Jonli darsda javoblarni SERVER baholaydi (Supabase). Asosiy faktlar (eski mashinada faza 6–10 bosqichida qurilgan, hozir barcha darslar shu relsda):

- **Avto-kalit (faza 10):** yangi darsga SQL YOZILMAYDI — faylda `INLINE_KEYS` + `QUIZ_BANK` bo'lsa yetarli; mentor sessiya ochganda `set_quiz_keys` RPC kalitni o'zi yuklaydi. `useLiveSession(lessonId, answerKey)` + keyRef + startMentor ichida chaqiruv — bitta ham tushib qolsa podium/arena 0-0-0-0.
- **Server-ball (faza 9):** `submit_answer` mijoz `p_correct`iga ishonmaydi — `p_picked`ni kalit bilan o'zi solishtiradi; `correct_idx=-1` = ishtirok-sentinel (yozma/checklist «Bajardim» → true). Savol/tartib o'zgarsa kalit avto-ergashadi (answerKey QUIZ_BANK'dan quriladi).
- **Zonalar:** test `screen_idx <100` · arena `100+savol` (QUIZ_BASE_IDX) · praktika `PRACTICE_BASE(500)+screen`. Podium reytingi FAQAT SCORED_IDX'ni sanaydi.
- **Qoidalar:** nickname qurilma-bo'ylab `localStorage['liveNickname']`; jonli testda 1 urinish (oneShot); Kahoot-reveal — mentor «Natijani ochish» bosguncha javob sir (mentor-panel proyektorda to'g'ri javobni OSHKOR QILMAYDI); mentor test ekranida o'zi javob bermaydi; freeRide — jonli darsda animatsiya-gate'lar optionalLive, testlar doim majburiy; arena taymeri tugaganda mentor avto-`ctrl('r')` (aks holda reveal bo'sh — eski bug).
- **Sinov-tartibi (har yangi dars):** yangi PIN + 2 o'quvchi + mentor-kod `MENTOR-2026` → podium/arena 0 EMASligini tasdiqlash. SQL sxemalar repoda `supabase/` papkada.
- **Layout etaloni:** `.stage max-width:1100px` + `--lz` zoom (≥1920px'da); 936px eski-yolg'on qiymat.
- **Phase11 yadro-tarqatish (2026-07-28):** 6 tuzatish (stale 60s→180s F-0726-01 · darvoza cur_screen'ga qaraydi `mentorScreenOf` · `mentorMax` monoton — reveal mentor orqaga qaytsa yashirinmaydi F-0726-02 · liveGet `select=*` · mentor heartbeat darhol+visibilitychange · localStorage `maxScreen`) endi BARCHA 79 jonli darsda (3 etalon + 76 codemod bilan). Codemod-usul: langar-naqsh aynan-1 tekshiruvi, partial edit yo'q, CRLF-moslashuv. UNCOMMITTED.
- Eslatma: eski mashinada PmLesson1'ning alohida deploy-kloni bo'lgan (Azizbekcrypto/PM-lesson-1 → vercel) — sinxron tuzatish talab qilardi; hozirgi mashinada bunday klon ishlatilayotgani tasdiqlanmagan, uchrasa sinxronlashni unutmaslik.
