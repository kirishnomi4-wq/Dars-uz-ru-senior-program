# TUNGI REJA — 21.09 · 1–4c modullarni LMS'ga yuklashga tayyorlash

> Foydalanuvchi 01:50: «1-A, 2-A, 3-A, 4-A, 5-A» + **PM uyga-vazifasi topshirilganda `onFinished` avtomat ketsin**
> (LMS'da ptichka yonib, keyingi dars ochilsin). «Sifat birinchi o'rinda, bittalab ko'r, halol ishla».
> Avtomat boshqaruv: cron `c4d1daa9` (har 20 daqiqa). Tasdiq kerak bo'lgan narsa — ertalabki hisobotga.

## Qamrov

| Modul | Dars | Uyga-vazifa |
|---|---|---|
| 1-Modull | 14 | 3 |
| 2-Modull | 13 | 3 |
| 3-Modull | 14 (shundan `PmLesson7` — ro'yxatda yo'q, yangi kiritiladi) | 3 |
| 4-Modull | 15 | 4 |
| 4a · 4b · 4c | 4 · 3 · 7 | 1 · 1 · 2 |
| **Jami** | **70 dars** | **17** |

5/6-modul va `src/pm/` — bu to'lqinga KIRMAYDI.

## Bandlar

| # | Band | Holat |
|---|---|---|
| T1 | **Uyga-vazifa `onFinished`** — hozirgi holatni brauzerda o'lchash (fakt), keyin: topshirilganda avtomat yuborish, yukni muhrlash (409 dan himoya), qayta ochilganda bir marta qayta yuborish | ⬜ |
| T2 | **PmLesson7** — yig'ish, katalog, sinov, ro'yxatga qo'shish | ⬜ |
| T3 | **70 dars sifat-o'tishi** — katalog mosligi · uz+ru · yakun-yuki (seal smoke) · nishon/ball (prob) · yig'ma smoke | ⬜ |
| T4 | **Yuklash papkasi** `yuklash-2026-09-21/<modul>/NN-Dars.jsx` + har modul ro'yxati (lesson_id, sarlavha uz/ru, md5) | ⬜ |
| T5 | **Ertalabki hisobot** — nima qilindi, nima tasdiq kutadi, yuklash yo'riqnomasi | ⬜ |

## Qoidalar (tunda)

- Push, deploy, CRM'ga yuklash — YO'Q (faqat foydalanuvchi).
- O'quvchi matniga yangi o'zgartirish — faqat taklif sifatida hisobotga.
- Har bandda: o'zgarish → darvozalar (`gates`, `lint:jsx`, `lintcmp`) → sinov → commit → jurnal.
- Vaqt-yorlig'i har doim `date` dan olinadi.
