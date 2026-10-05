# 4-dars «Mini-MVP arxitekturasi» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7.5/10. Har band darsda tekshirildi. Hukm: Qabul 12 · Qisman 3 · Rad 2. Tayanchga tegadigan qaror yo'q — qo'llandi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Bir lahzadagi ikki band: faqat Backend tekshiruvi yetmaydi — Database'da `UNIQUE (kun, soat)` | **Qabul** | Fakt to'g'ri. 3-ekran to'g'ri izohi: «Backend avval tekshiradi, Database esa bir xil kun va soatni ikki marta yozdirmaydi.» 4-ekranga izoh-qator, A1 promptiga «bitta `kun` + `soat` juftligi ikki marta yozilmasin», repo — `@Unique(['kun','soat'])`, takrorlash va kartochka. 9-darsda bu allaqachon bor edi (KOD 2-band) — sinf-supurish: 0 qo'shimcha. |
| 2 | «Sayt ko'rsatadi, Backend tekshiradi, Database eslab qoladi» — universal ta'rif bo'lib qolmasin | **Qisman** | «Bu MVP da …» chegarasi — qabul (2-ekran xulosasi, yakun). Fe'llar: «qoidani tekshiradi», «bandlarni saqlaydi»; «eslab qoladi» darsdan olindi (bir ma'no — bir so'z). |
| 3 | `kun` — sana, `telefon` — matn; agentga qoldirmang | **Qabul** | A1 prompti: `telefon` (matn); 4-ekran izoh-qatori; repo — `telefon` varchar. `kun` — sana (K2) saqlandi. |
| 4 | Ega kirishi «xavfsiz auth» taassurotini bermasin; «.env GitHub'ga yuborilmaydi» — mutlaq | **Qabul** | 7-ekranga izoh-qator: «Bu — bitta egali MVP uchun sodda kirish. Katta tizimda har kimning paroli alohida va yashirin saqlanadi.» 8-ekran izohi, takrorlash, kartochka, arena 9: «`.gitignore` da — repo'ga qo'shilmaydi». |
| 5 | Stack ekrani zaif (javob oldindan ma'lum), dars yuki og'ir | **Qisman** | Sarlavha «Yangi stack kerakmi?» — qabul. Uch solishtirish (oltita kod) → bitta (NestJS · Django), Sayt va Database tugunlari oldindan yozilgan. Auditning «Nega?» savoli darsda bor — 10-ekran (4-savol), ikkinchi marta qo'shilmadi. |
| H | Hook: «Aynan!» / «Qiziq fikr!» — qoidaga zid | **Rad** | Bizning qonun aksincha talab qiladi: T-028 (xato tanlovga neytral «Qiziq fikr!»), M5-03 (to'g'riga «Aynan!»). |
| H2 | «Agent bandni telefonida saqladi» — universal fakt bo'lib qolmasin | **Qabul** | Ikkala javob «Bu misolda …» bilan (T-043). |
| 5-ekran | Bo'sh kataklarni Backend qayerdan biladi — ish vaqti yashirin | **Qabul** | Xulosa: «Ish vaqti Backend kodida — bo'sh kataklarni u shundan hisoblaydi.» Repo — `KATAKLAR` konstantasi (16:00 … 21:00). Takrorlash, kartochka, yakun. |
| A1 | ORM (TypeORM/Prisma) agentga qoldirilmasin | **Qisman** | Fikr — qabul. Lekin P-060: promptda texnologiya aytilmaydi, u repo'da. Shuning uchun stack upstream `main` dagi `README.md` da yoziladi (NestJS + TypeORM), A1 prompti «`README.md` dagi stack bo'yicha» deydi. O'quvchining o'z g'oyasi prompti (o'z repo'si) — «NestJS va TypeORM» ochiq. |
| 11 | «internetda bo'lsin» → «internetdan ochiladigan manzilda» | **Qabul** | Xulosa va yakun. «Deploy'ni 9-darsda qilasiz» olindi (va'da-qator, 73-qonun). |
| S1 | Reja sarlavhasi → savol | **Rad** | Reja ekrani — natija-gap (1–3-darslar bilan bir xil). |
| S2 | «Bu ishni qaysi qism bajaradi?» | **Qabul** | «Har ishni qaysi qism bajaradi?» — mexanikaga mos. |
| S9 | «Yangi stack kerakmi?» | **Qabul** | 5-bandga qarang. |
| A1/A2 | sarlavhalar normal | **Qabul** | O'zgarmadi. |
| Hajm | 90 daqiqaga yuk ko'p | **Qabul** | Stack ekrani qisqardi; ega kirishi — minimum (bitta izoh-qator qo'shildi, mexanika o'zgarmadi). |
| O'zim | Yakun sarlavhasi «Endi … qura olasiz» — attestat ohangi (3-dars bilan bir sinf) | — | «Chizma va loyiha skeleti tayyor.» |
