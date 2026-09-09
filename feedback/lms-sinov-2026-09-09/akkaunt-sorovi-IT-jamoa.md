# LMS sinovi uchun test-akkauntlar — so'rov (2026-09-09)

Dars-platforma × LMS qo'shma sinovi (SINOV_PROTOKOLI_LMS.md §5.2, §5.3). Hamma akkaunt **staging/test** muhitida.
Login-parollar Git'ga yoki hujjatga yozilmaydi — xavfsiz kanal orqali. Bizga har akkaunt uchun **ID'lar** ham kerak
(loglarda ism chiqmaydi, faqat ID).

## Bizda bor (o'zgarmasin, faol qolsin)
| Belgi | Nima | ID |
|---|---|---|
| G-1 | Test-guruh, faol obuna | gid **1070** |
| O-1 | G-1 o'quvchisi, faol | LMS student **37069** (CRM 20047) |
| M-1 | G-1 mentori (TEACHER) | teacher **165** |

## Kerak — 8 akkaunt + 1 guruh
| # | Belgi | Rol | Guruh | Holat / shart | Qaysi sinov uchun |
|---|---|---|---|---|---|
| 1 | **G-2** | guruh | — | Ikkinchi test-guruh, faol obuna, o'z mentori bilan. Test-material (dars JSX) G-2 sahifasida ham ko'rinsin | 12, B2 |
| 2 | **O-2** | STUDENT | G-1 | Faol, oddiy o'quvchi (O-1 kabi) | 11, 19/B3 (keyin LMS-bazada «topilmaydigan» qilinadi) |
| 3 | **O-3** | STUDENT | G-1 | **Muzlatilgan** — obuna to'xtatilgan (status faol/demo emas) yoki o'quvchi nofaol. LMS darsga token bermasligi kerak | 5, B1 |
| 4 | **O-4** | STUDENT | G-2 | Faol, faqat G-2 da | 12 (boshqa guruh → mustaqil rejim) |
| 5 | **O-5** | STUDENT | G-1 **va** G-2 | Ikkala guruhda faol obuna | B2 («Qaysi darsga kirasiz?» tanlovi) |
| 6 | **M-2** | TEACHER | G-2 | G-2 ning mentori | 6b, B2 (ikki guruhda bir vaqtda dars) |
| 7 | **T-1** | TA (yordamchi) | G-1 | G-1 ga tayinlangan TA | 7 (TA dars ochsa — mentor sessiyasini almashtiradi) |
| 8 | **X-1** | STUDENT | — | Hech qaysi guruhga tayinlanmagan (yoki guruhsiz foydalanuvchi). LMS token bermasligi kerak | 9a |
| 9 | **V-1** | TEACHER (vaqtincha) | G-1 | Vaqtinchalik mentor, `START_DATE..END_DATE` **bugungi kunni qamrasin** (masalan bugundan +7 kun). Keyin 9b sinovi uchun END sanasi o'tmishga o'tkaziladi — sanani o'zgartira oladigan bo'lsin | 8, 9b |

## Har akkaunt uchun bizga kerak
- login + parol (xavfsiz kanal);
- LMS ID (student_id / teacher_id) va CRM ID;
- qaysi guruhda, obuna holati (faol / muzlatilgan), TA/TEACHER/vaqtincha belgisi;
- G-2 uchun **gid**.

## Sinov kuni IT-jamoadan kerak bo'ladigan harakatlar (alohida vaqt, ~4 band)
1. V-1 ning END sanasini o'tmishga o'tkazish (9b).
2. O-2 ni LMS test-bazasida «topilmaydigan» qilish (19/B3).
3. Bir `event_id` bilan o'zgartirilgan payload → 409 (18) — ular tomonda kuzatiladi.
4. JWT kalit-rotatsiyasi (B4) — `SIRLAR_ROTATSIYASI_UZ.md` §5 xati bo'yicha.
