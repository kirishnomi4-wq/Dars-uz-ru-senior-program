# F-1019-11 · CRM'ga v3 yuklash (go.coddycamp.uz, AI startup kurs 20) · 19.10.2026

Paket: `yuklash-2026-10-19-prod/yakka/` (11:47 yig'ma, commit 6df7225c; ROYXAT md5 = fayl md5, tekshirildi).
Qoida (foydalanuvchi): faqat Class turidagi mavzular; dars bor bo'lsa — tahrirlash, faylni v3 ga almashtirish
(sarlavha/tartib/til o'zgarmaydi); bo'sh bo'lsa — «Yangi savol» → JSX dars (Lesson Runner), uz = 1, ru = 2,
sarlavha ROYXAT nomidan (ruscha yo'q bo'lsa uzbekcha). Nomuvofiqlikda to'xtab so'raladi.

## Usul
- Brauzer (Claude in Chrome): fayllar sahifaga yashirin `<input type=file multiple>` orqali bir marta qo'yiladi,
  har savol `editQuestion(id)` bilan ochiladi, fayl `#editLessonRunnerFile` ga qo'yiladi va forma (`editSubmit`)
  bo'lim sahifasiga POST qilinadi — «Saqlash» bosilgandagi bilan bir xil. Eski faylni o'chirish shart emas
  («Bo'sh qoldirilsa — joriy fayl saqlanadi»; tanlansa almashadi).
- Tekshiruv: LMS'dagi fayl (`uploads/lessons/...`) yuklab olinib SHA-256 lokal fayl bilan solishtiriladi;
  lokal fayl md5 = ROYXAT md5.
- TUZOQ: `editQuestion` formani AJAX bilan qayta chizadi — eski `#editForm` havolasi bilan ishlash = hech narsa
  yuborilmaydi (1-urinishda shunday bo'ldi, zarar yo'q). Formani har safar qayta qidirish kerak.

## Natija
| Modul | LMS bo'lim | Dars | Holat |
|---|---|---|---|
| 2-Modul | HTML-CSS (70) | 14 (28 qator) | ✅ 28/28 v3, hash ✓ (VS Code ham qayta yuklandi; Internet uz — foydalanuvchi) |
| 3-Modul | JavaScript (73) | 13 | ✅ 26/26 tahrir (03 bo'sh — paketda yo'q; 2440 arxiv) |
| 4-Modul | Frontend-React (74) | 14 | ✅ 28/28 tahrir (03 bo'sh; 2452/2454/2457 arxiv) |
| 5-Modul | Backend Node (75) | 15 | ✅ 30/30 tahrir (2470 arxiv) |
| 6-Modul | NestJS (90) | 14 | ✅ 28/28 tahrir — LMS'dagi eski fayl raqamlari boshqa (01-Jest…07-FullPro), dars nomi bo'yicha moslandi; tartib 10–140 = 01–14 |
| 7-Modul | Botlar (80) | 12 | ✅ 24/24 yangi (bo'sh edi) |
| 8-Modul | Tizimni yig'aman (81) | 14 | ✅ 28/28 yangi; #2980 «Test uchun uz» tegilmadi |
| 9-Modul | 108 | 12 | ✅ 24/24 yangi |
| 10-Modul | 109 | 11 | ✅ 22/22 yangi |
| 11-Modul | 110 | 16 | ✅ 32/32 yangi |
| 12-Modul | 111 | 12 | ✅ 24/24 yangi |
| 13-Modul | 112 | 12 | ✅ 24/24 yangi |
| 14-Modul | 113 | 13 | ✅ 26/26 yangi; 3060 «Bitiruvchilar bilan uchrashuv», 3062 «Bitiruv marosimi» — tadbir, fayl yo'q, bo'sh qoldi |

Jami: 172 dars, 344 qator v3 (139 tahrir + 204 yangi + 1 foydalanuvchi). Har modul oxirida tekshiruv:
fayl nomi = ROYXAT, SHA-256 = lokal fayl, til/tartib (yangi: uz 1, ru 2), sarlavha = ROYXAT nomi, tur = lesson-runner.
Yangi qatorlar «Draft» — bo'lim (7–14-M) Draft bo'lgani uchun; bo'lim Active qilinganda tekshirilsin.
ROYXAT.md ☐ belgilari qo'yilmadi (paket boshqa seansniki).
Keyingi: prod smoke (har moduldan 1 dars, o'quvchi + mentor) — foydalanuvchi.
13:01 foydalanuvchi: 10-M «A/B test» (04-PmAbTestLesson-v3) LMS preview'da oxirigacha o'tdi (12/12, «Yakunlandi») — «normal».
Jonli rejim (o'quvchi + mentor, natija CRM'ga) hali sinalmagan.

## Draft → Active (7–14-M, foydalanuvchi ruxsati 13:03)
Endpointlar (UI «Active» tugmasi bilan bir xil): `/account/ajax/student_courses/change_question_status.php` (question_id),
`change_lesson_status.php` (lesson_id), `change_module_status.php` (module_id), + `status=active`; javob `{stat:"success"}`.
Tartib: savollar → darslar → modullar. Qarorlar: Demo Day 6/7/8 va 3060/3062 — Active; #2980 — foydalanuvchi o'zi arxivladi.
Natija: 203 savol + 107 dars + 8 modul (80, 81, 108–113) Active, xato 0. Qayta o'qish: hamma dars/savol Active,
hech narsa yo'qolmagan (oldingi ro'yxat bilan solishtirildi); arxivdagilar (2497, 2980) arxivda.
