# 5-dars «Kiberxavfsizlik: zaiflikni topib yopamiz» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7/10 (pedagogika 8.5 · himoya doirasi 9 · texnik aniqlik 6). Hukm: **Qabul 16 · Qisman 2 · Rad 1 · O'zgarishsiz 5**. Zaxira: scratchpad `05-oldin-filtr.md`.
Himoya doirasi qayta tekshirildi: hujum qatorlari, aylanib o'tish yo'riqlari yo'q (grep: 0).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | **2FA: ikkinchi so'rov birinchi bosqichdagi parolga bog'lanmagan** — Backend'da kod tekshiruvi alohida eshik bo'lib qolishi mumkin | **Qabul** | Eng muhim topilma, rost. Model: **bitta `POST /kirish { parol, kod }`** — token faqat ikkalasi Backend'da tekshirilgach; 401 — qaysi biri xato aytilmaydi. Saytda forma ikki qadamli (avval parol, keyin kod), lekin xavfsizlik formaga tayanmaydi. 9-ekran (harakat, ikki `QIzoh`), 12-ekran final bo'laklari va xulosasi, A1 prompti va tekshiruvi, A2 prompti va tekshiruvi, «O'z g'oyangiz» promptlari, kartochka, REPO 7, tayanch 3 va 9.15. |
| 2 | «Zaiflikni hujum bilan emas, kodni o'qib topasiz» — universal emas | **Qabul** | «**Bu darsda** zaiflikni hujum qilmasdan, koddagi xavfli belgilarni o'qib topasiz» — asosiy fikr, yakun, 11-ekran Mentori; hook javobi. |
| 3 | «Yopildi» — butun sayt xavfsizligi emas | **Qabul** | 11-ekran xulosasi «Bugungi uch xavfli naqsh olib tashlanganini … tekshirdik» + `QIzoh` «Bu butun sayt xavfsiz degani emas — bugun topilgan uch zaiflik haqida»; kartochka. Yakun sarlavhasi (kurs natijasi) qoladi — auditor ham shunday. |
| 4 | QKod `$1` ↔ repo TypeORM `find({ where })` ko'prigi | **Qabul** | 8-ekran Mentori: «parametrli so'rovning **bir ko'rinishi** — `$1`; repo'da TypeORM `find({ where: { telefon } })` ham qiymatni xuddi shunday alohida uzatadi». Kod oynasi API'si o'zgarmadi (tayanch 9.12). |
| 5 | «Telefon doim matn bo'lib qoladi» — keng | **Qabul** | «Telefon qiymati parametr bo'lib uzatiladi — SQL buyruq satriga qo'shilmaydi» (2-ekran kod kartasi va xulosasi). |
| 6 | XSS xulosasi universal | **Qabul** | 4-ekran xulosasi, yakun, kartochka — «bu ro'yxatda», `dangerouslySetInnerHTML` → `{b.ism}`. 5-ekran savoli allaqachon ko'lamli edi. |
| 7 | `.env` — «sehrli seyf» emas | **Qabul** | 6-ekran `QIzoh`: «`.env` GitHub'ga chiqmaydi; prodda shu qiymatlar Render sozlamasida beriladi». |
| 8 | Namuna `'maydon-maxfiy-2026'` haqiqiy kalitga o'xshaydi | **Qabul** | `'zaxira-kalit'` — 6-ekran, recap, REPO, tayanch. |
| 9 | TOTP kutubxonasi va kalit yaratish — agentga qoldirilmasin | **Qabul** | Tayanch 9.15 va REPO 7: «qur» dan oldin asosiy seans tanlaydi va rasmiy hujjatdan tekshiradi; promptda nomi yo'q (P-060), README'da bor. |
| 10 | `284 193` — faqat namuna | **Qabul** | 9-ekran: «namuna ko'rinish». |
| 11 | Start teg — o'qituvchi eslatmasi emas, qattiq qoida | **Qabul** | A1 1-qadami (o'quvchi matni, qalin): «Bu teg faqat laptopdagi mashq uchun: uni push qilmang va Render'ga chiqarmang»; tayanch 3. |
| 12 | A1 «O'z g'oyangiz»: «har so'rov parametrli bo'lsin» — agentga juda keng | **Qabul** | «`{aniq qidiruv yoki filtr}` so'rovida …» — aniq bitta joy. |
| 13 | A2: «so'rov o'tmasa ham sahifa ishlasin» — auth uchun xavfli | **Qabul** | Majburiy tuzatish: «kirish muvaffaqiyatsiz bo'lsa ro'yxat ochilmasin va xato ko'rsatilsin»; tekshiruvga «noto'g'ri kod bilan ro'yxat ochilmasin». (2-dars analitika naqshidan ko'chib qolgan edi.) |
| Hook | ✔ javobi — «kodni o'qib» emas, «xavfli joylarni o'qib, tuzatib» | **Qabul** | ✔ «Koddagi xavfli joylarni o'qib, tuzatib» (38; boshqalari 38–40). |
| Sarl. 11 | «Xavfli kod olib tashlanganini qanday bilasiz?» | **Qabul** | — |
| Sarl. 8 | «Telefon qiymatini SQL'dan qanday ajratasiz?» | **Qisman** | Kod sarlavhasi §19 oilasida qoladi, mazmuni olindi: «Telefonni SQL'dan ajratadigan kod yozamiz.» |
| Sarl. 4 | «Ism HTML bo'lib chiqsa nima o'zgaradi?» | **Rad** | Hozirgi «Ism ekranda matn bo'lib chiqadimi yoki kod bo'lib?» — aniq savol, ekrandagi ikki tugma bilan mos. |
| 10-ekran | 4-savol to'g'ri izohi faqat Backend ikkalasini bog'lasa to'g'ri | **Qisman** | 1-band bilan to'g'ri bo'ldi; matn o'zgarmadi. |
| 2, 4, 6-ekranlar · 1, 3-savollar · final · etika qatori · `GET /bandlar/qidir` | — | **O'zgarishsiz** | Auditor tasdiqladi. |

**Sinf-supurish:** eski 2FA oqimi («parol to'g'ri bo'lsa kod»), auth'da «so'rov o'tmasa ham», `'maydon-maxfiy-2026'` — 6–11-darslar: 0. lint:til 05, tayanch — 0.
