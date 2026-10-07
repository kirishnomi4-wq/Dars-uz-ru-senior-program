# 8-dars «Loyiha kuni: prodga ko'tarish — 1-qism» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7/10 (pedagogik skelet 8.5 · continuity 8 · texnik aniqlik 6). Hukm: **Qabul 14 · Qisman 3 · Rad 2 · Allaqachon tuzatilgan 2 · O'zgarishsiz 3**.
Eslatma: audit eski versiyani ko'rgan — `git add .` va `pm-m8d6-audit` «yo'q» holati 06/07-FILTR sinf-supurishida tuzatilgan edi.
Zaxira: scratchpad `08-oldin-filtr.md`, `07/09/11-oldin-08filtr.md`, `tayanch-oldin-08filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Prod ro'yxati «haqiqiy foydalanuvchiga ochishdan oldin» — tarixga zid («Maydon» 9-Modulda chiqqan, A/B real odamlarda) | **Qabul** | Rost. Ta'rif: «Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati.» — A-bo'lim, 1-ekran Mentori, yakun, kartochka, arena 1 (✔ o'rni A). Asosiy fikr: «Internetdagi MVP ishlayapti, lekin hali mustahkam emas…». Hook savoli. |
| 2 | Dars oxirida «production darajadagi» deb bo'lmaydi | **Qabul** (da'vo) | 1-ekran sarlavhasi «Bugun prod ro'yxatidagi to'rt ishni bajarasiz.»; natija — «prod ro'yxati bo'yicha yaxshilandi» (yakun sarlavhasi saqlandi, auditor ham). **O'zim topgan:** nishon «Prod Ready» → **Prod Builder**; 9-dars PR sarlavhasi «Prodga tayyor: …» → «Prod ro'yxati: …» (4 joy); 7-dars ip qatori. Modul g'oyasi («MVP haqiqiy foydalanuvchiga tayyor») va menyu osti («production darajasiga») — **GATE savoli 08-q0**. |
| 2b | 9-darsda `synchronize: false` + migratsiya majburiy | **Rad** | Siz GATE M M-q2 A da qaror qilgansiz: kod o'zgarmaydi, migratsiya — keyingi modullarda. Shuning uchun «production darajadagi» da'vosi darslarda berilmaydi (2-band) — bu qarorning halol natijasi. |
| 3 | A/B SQL «bir haftalik»ni cheklamaydi | **Qisman** | Matn tuzatildi: «B ishga tushgandan beri» (A-bo'lim, A3 Mentori, tayanch 9.4, 7 va 11-darslar). SQL'ga sana qo'shilmadi: `variant IS NOT NULL` — aynan tajriba davri (A va B 4-darsda bir vaqtda boshlangan). |
| 3b | `band_qildi` vaqt tanlaganlar ichidami — SQL tekshirmaydi | **Qabul** | «Maydon»da band qilishdan oldin vaqt tanlanadi — A-bo'limda izoh; README va A3 namuna talabida: «foiz — shu oqimda vaqt tanlaganlardan band qilganlar». |
| 4 | IP ≠ o'yinchi; umumiy Wi-Fi | **Qabul** | Talabdan «har o'yinchining o'z manzili» olindi. 2-ekran `QIzoh`: «Chegara odamni emas, IP manzilni sanaydi…» (106); O'qituvchi eslatmasi — «Maydon»da ega bitta, sodda IP chegarasi yetadi, katta mahsulotda yetmasligi mumkin; kartochka va arena 6 qayta yozildi (✔ o'rni B); README. |
| 5 | Proksi va chegara mexanizmini agentga tashlamaslik | **Qabul** | 5-dars TOTP naqshi: «qur» dan oldin asosiy seans muzlatadi — mexanizm, qat'iy bir daqiqalik oyna, tekshiruv ishlovdan oldin, `429` tanasi, Render proksi orqasida IP usuli (o'z xizmatida, soxta `X-Forwarded-For` bilan ham tekshiriladi: forum — Render mijoz qiymatini tozalamaydi). A1 namunasida `{proksi usuli}` — tayyor matn, «qur» da to'ldiriladi (TAYANCHGA SAVOL 12, REPO 2, tayanch 9.18). |
| 6 | Qayta so'rovlar ustma-ust ketishi mumkin | **Qabul** | «So'rov o'tmasa — 5 soniyadan keyin qayta; oldingi so'rov tugamasdan yangisi ketmaydi» (3-dars naqshi) — A-bo'lim, 4-ekran, A2 namunasi, takrorlash, kartochka, yakun, REPO. |
| 7 | A2 kechikishni tekshirmaydi — faqat to'xtashni | **Qabul** | A2 4-qadam: «bu tekshiruvda Backend umuman javob bermaydi; kechikish holatini 4-ekran sahnasida ko'rdingiz»; yashil xulosa «Backend to'xtasa, o'yinchi kutishni, keyin «Qayta urinish»ni ko'radi.»; ixtiyoriy O'qituvchi eslatmasi (tarmoqni sekinlashtirish). |
| 8 | `pm-m8d6-audit` «yo'q» holati | **Allaqachon tuzatilgan** | 06-FILTR sinf-supurishi: «tuzatish kerak». |
| 9 | «Backend uyg'onmoqda» — sababni taxmin qiladi | **Qabul** | Holat nomi → **«kutish holati»** (sayt Render uyg'onayotganini bilmaydi) — 8-dars hamma joyda, 9-dars (7 joy), 7-dars, tayanch 3; fon so'zi «kutish». |
| 9b | O'yinchi yozuvidan «bir daqiqagacha»ni olib tashlash | **Rad** | Kodda 60 soniyadan keyin xato chiqadi — «bir daqiqagacha cho'zilishi mumkin» rost va o'yinchiga qancha kutishni aytadi; tayanch 9.12 va 03/04/07-FILTR dagi modul kelishuvi. «Backend» so'zi o'yinchiga ko'rinmaydi. |
| 10 | `git add .` | **Allaqachon tuzatilgan** | 07-FILTR sinf-supurishi: `git status` → agent aytgan fayllar → `git add`. |
| A/B | «B qoladi» — qat'iy | **Qabul** | «Hozircha B qoladi» + kulrang «Bu mahsulot qarori — B yaxshiroq ekanini isbotlamaydi.» (A3), A-bo'lim, yakun, kartochka, README, 9-dars. |
| Chegara | «Kirishga eng kami» — sababi bilan | **Qabul** | Natija qatori «… u yerda parol va kod tekshiriladi»; A-bo'lim «bu MVP'dagi tanlov»; O'qituvchi eslatmasi «eng yaxshi chegara emas». |
| Chegara | «Oltinchisi tekshirilmaydi ham, yozilmaydi ham» — faqat guard ishlovdan oldin bo'lsa | **Qisman** | Matn qoldi; shart kanonik qilindi — A1 namunasi «chegara so'rov ishlovidan oldin tekshirilsin», REPO 2, A-bo'lim. |
| `prod` | «Internetdagi sayt o'zgarmaydi» — universal Git qoidasi emas | **Qabul** | «Bizning sozlamada…» — A-bo'lim, A3 3-qadam, kartochka; arena 12 «"Maydon" sozlamasida `prod` push qilindi…». |
| README | «README to'liq» — universal mezon emas | **Qabul** | «README — olti qism» («Maydon» kurs mezoni) — ish nomi, A3, 9-dars PR tavsifi, tayanch. |
| Sarl. 1 | «Bugun prod ro'yxatidagi uch ishni yopasiz» | **Qisman** | «Bugun prod ro'yxatidagi to'rt ishni bajarasiz.» — «bugun» guruhida to'rt ish (chegara, xato va kutish, A/B yakuni, README). |
| Sarl. 0, 2, 4, A3, yakun · README'da faqat kalit nomlari · agent talabi uch qatorda | — | **O'zgarishsiz** | Auditor tasdiqladi. |

**Sinf-supurish:** «Backend uyg'onmoqda» — 7, 9-darslar, tayanch → «kutish holati». «README to'liq» — 9-dars. «bir haftalik» — 7, 11-darslar, tayanch (11-dars arena 11 D varianti uzunligi tenglashtirildi: 32/27/32/32, ✔ o'rni C). «Prodga tayyor» / «production darajasiga» — 9-dars PR (4 joy), 7-dars ip qatori; App.jsx — 08-q0.
lint:til 07 — 0; 08, 09, 11, tayanch — eski ogohlantirishlar (zaxira bilan bir xil), yangi topilma 0.
