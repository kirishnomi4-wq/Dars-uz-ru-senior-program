# CodeStrike → Learn: prod relizi fayllari (29.10.2026)

Abdulloh, PODIUM-05 tasdig'i uchun rahmat. Prod uchun yakuniy yig'ma tayyor.

## 1. Fayllar va SHA-256

Ilova: `SHA256-172.csv`. Unda 172 ta JSX fayl bor (2–14-Modul), format 27.10 dagidek: modul, tartib, `lesson_id`, fayl nomi, hajm, SHA-256, CRM uz/ru material id.

Hamma fayllar bitta commit'dan yig'ilgan (`15039598`). Ichida:
- CodeStrike → Learn (`codestrike`, `detailsVersion` 3);
- siz qabul qilgan podium v2 (PODIUM-01…05);
- 27.10 dan keyingi dars tuzatishlari (ruscha qiymatlar, 45 dars).

Namuna sifatida Internet darsi:

```text
01-InternetLesson-v5.jsx   499 112 bayt   SHA-256 bb6673535828508ffa61e162c9328f7c1a687ffaf3cfc11283c99ca67dac592b
```

## 2. Siz sinagan namunadan bitta farq

Bu yig'ma siz sinagan namunadan (`a30ae77a…85e18cb`) faqat bitta o'zgarish bilan farq qiladi. Uni o'zimiz qo'shdik.

**CodeStrike faqat ustozga ulangan jonli darsda o'ynaladi.**

| Holat | Oldin | Endi |
|---|---|---|
| Jonli dars (`student`, mentor sinfda) | arena ochiq | o'zgarmagan, arena ochiq |
| Uyda, yakka (`solo`) | arena ochiq, o'yin hisobga olinardi | tugma yopiq: «CodeStrike sinfda, ustoz bilan o'ynaladi» |
| Ko'rish rejimi (`review`) | arena ochiq | tugma yopiq |
| Sinf tugagan yoki mentor uzilgan, o'quvchi o'ynamagan | arena ochiq (yakka) | tugma yopiq |
| O'yin o'rtasida dars yopildi | «Mashq rejimida davom etish» | «Jonli dars yakunlandi — CodeStrike to'xtadi» + «Yopish». Berilgan javoblar saqlanadi, mashq rejimi yo'q |

**LMS uchun ma'nosi:** `solo` rejimda arena javoblari yozilmaydi. Yukda `codestrike.played: false` keladi, ya'ni Learn ochiladi. Payload shakli va API shartnomasi o'zgarmagan.

Kod farqi (Internet darsida) shu 20 qator bilan cheklanadi: `useLiveSession.js` (arena javobi faqat `student` rejimda hisobga olinadi), yakun ekranidagi tugma (`csLocked`) va arena ichidagi «jonli dars yakunlandi» bloki. Podium mantig'iga tegilmagan.

## 3. Biz tomonda tekshiruv

| Tekshiruv | Natija |
|---|---|
| Unit-testlar (`src/live`: podium, preview, resultDetails) | 53/53 |
| Podium stsenariylari (PODIUM-01…04, qayta yuklash, erta «Tamom», zaxira tugma) — 11 holat × 8 dars | 88/88 |
| «Faqat jonli»: uyda yakka, jonli dars, mentor chiqib ketgan, o'yin o'rtasida dars yopildi, LMS'dan tashqari — 5 holat × 8 dars | 40/40 |
| Yuklash paketi: smoke-lms, preview rejimi | 172/172 |

8 dars: Internet, HTML-1, React Router praktika, PM-1, Pipeline loyiha, Bot AI, PRD, JTBD.
Ikki darsda «qayta yuklash» holati birinchi yurishda sinov skripti tufayli yiqildi: skript qayta yuklangandan keyingi oraliq ekrandagi «Davom etish» tugmasini bosmagan. Skript tuzatilgach, ikkalasi ham o'tdi. Dars kodiga tegilmadi.

Server tomonda o'zgarish yo'q: `0.1.0+0f242c77`, migratsiya 10.

Fayllarni CRM'ga o'zimiz yuklaymiz. Yuklab bo'lgach, CRM'dagi har faylni SHA bilan solishtirib, natijasini yuboramiz.

Hurmat bilan
