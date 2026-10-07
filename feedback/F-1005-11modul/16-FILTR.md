# 16-dars «G'oyangiz va ilovangiz guruhni ishontiradimi?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 7.5/10 (pedagogika 9 · pitch tuzilishi 9 · dalil va halollik 8.5 · bog'liqlik 6.5 · SQL qismi 6). Hukm: **Qabul 11 · Qisman 3 · Rad 5 · Allaqachon / o'zgarishsiz 26**.
Eslatma: auditor 15-FILTR dan oldingi nusxani ko'rgan — «kutish holati», «birinchi qadam saqlanmaydi» bandlari bugun ertalab yopilgan edi.
Tekshirilgan manbalar: MD o'zi (grep) · **Neon rasmiy hujjati, 06.10 qayta ochildi** (neon.com/docs/get-started/query-with-neon-sql-editor: «click **Run**» · «The Neon SQL Editor supports using Postgres meta-commands» — `\dt`, `\d`, `\l` · «a separate result set for each statement») ·
tayanch 1.3, 1.9, 4, 5, 9.74, 9.90, 9.95–9.96 · 13, 15-FILTR · `QOIDALAR.md` T-028, T-067 · GATE M M-q2 A.
Zaxira: scratchpad `md11/16-oldin-16filtr.md`, `md11/tayanch-oldin-16filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 15-darsdagi birinchi qadam saqlanmaydi — Keyingi qadam shundan olinsin | **Qisman** | Saqlash 15-FILTR 19–20 da qilingan (`birinchi`); 16-dars tugmalarida «Avval» belgilangani birinchi va halqada. Maydonni `birinchi` bilan oldindan to'ldirmadim: uyga vazifada o'quvchi aynan shu qadamni bajaradi — pitchdagi «Endi nima qilasiz?» uning keyingisi bo'lishi mumkin. Tugmalar ustiga: «Uyda «Avval» qadamini bajargan bo'lsangiz — keyingisini tanlang.» Mentor misoli ham shunday (9.98). MD TS 3 yopildi. |
| 2 | «Sinovda: … — tuzatdim» — bitta qayta sinovni isbot qiladi | **Qabul** | Oldindan to'ldiriladigan qator — fakt: «Sinovda {n} kishidan {k} tasi «{to'xtash}» joyida to'xtadi — o'zgartirdim.» + qayta sinov bo'lsa «Qayta sinovda bu safar takrorlanmadi.» / «… yana to'xtadi.» (`qaytaSinov`, 9.90; mashq — «Mashq sinovida …»). |
| 3 | SQL 2-son «nechta qo'shilish bor» — aslida hozirgi band joylar | **Qabul** | SQL izohi «hozir o'yinlarda nechta joy band», placeholder «masalan: band joy»; A-bo'lim va O'qituvchi eslatmasi: `chiqdi`, `navbatda` sanalmaydi — son butun tarixni emas, hozirgi holatni ko'rsatadi; tayanch 4 «nechta o'yinchi qo'shildi» → «hozir nechta joy band», 9.99. `COUNT(DISTINCT …)` ga o'tilmadi (auditor ham shart demagan). |
| 6 | «Zal ishonishi uchun nechta dalil?» — ishontirish formulasi | **Qabul** | «**Bu misolda** muammo gapi yonida nechta dalil turadi?» |
| 16 | K19 izohlari (Stiv Jobs, iPod, Nokia va BlackBerry) va ranglar bankda yo'q | **Qabul** | Tayanch 9.97 ga kiritildi — S-018 brend izohlari, rost umumiy bilim; voqeaga fakt qo'shmaydi (13-darsdagi «Sony — PlayStation …» bilan bir naqsh). MD TS 9 yopildi. |
| 20 | Ikki SQL bir oynada — «har biridan keyin Run» noaniq | **Qabul** | «Avval 1-SQL'ni yozib «Run»ni bosing va sonni yozib oling; keyin uni 2-SQL bilan almashtiring va yana «Run».» (Hujjatga ko'ra ikkalasi birga ham ishlaydi — alohida natija; birma-bir sodda.) |
| 32 | Hammasi ✓ bo'lsa «eng zaif» — qattiq | **Qabul** | «Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?» (56); 3-qadam va xulosa («bitta bo'lak tuzatildi»). |
| 33 | «3 daqiqada sherigingizni ishontira olasizmi?» — o'lchab bo'lmaydi | **Qabul** | **«Pitchingizni sherigingizga 3 daqiqada ayta olasizmi?»** (52) — yakka rejim sarlavhasi bilan bir. |
| 34 | 3–4 ko'ngilli guruh oldida — 90 daqiqaga sig'maydi | **Qabul** | «Vaqt qolsa — 1–2 ko'ngilli, har biri ≈ 4 daqiqa; 90 daqiqa hisobida yo'q» (A-1, 11-ekran eslatmasi, 9.99). |
| 36 | Qurilmani qachon berish — aniq bo'lsin | **Qabul** | «Gap tugagach, dars ochiq turgan qurilmangizni sherigingizga bering — …» |
| 38, 39 | «bu sizning xatongiz emas» va «varaqqa yozing» — kerak emas | **Qabul** | «Ilova ochilmasa — ekran videosini ko'rsating yoki jonli demo bo'lagini og'zaki aytib bering.» (92) |
| 5 | Yordam «son va harakat belgisi», tekshiruv faqat son | **Qisman** | Yordam: «Dalilda sanoq bo'lsin; harakat belgisi bo'lsa — uni ham yozing.» Harakat belgisini majburiy qilmadim: ba'zi o'quvchida u yo'q yoki kam (4-dars `vaqtincha`), erkin matnda uni avtomatik topib bo'lmaydi. |
| 25 | 12-savol «5 tasi — tekshiruvingiz» — g'aliz | **Qisman** | «Kitob ilovangiz Database'ida 12 ta kitob; 5 tasi — **tekshiruv yozuvingiz**. Nima deysiz?» (12 so'z). Auditor taklifi («o'zingiz qo'shgansiz») to'g'ri javob A («5 tasini o'zim qo'shganman») so'zini savolda takrorlab, javobni ochib qo'yardi (S-008). |
| 8 | Hookda «Qiziq fikr!» | **Rad** | QOIDALAR T-028, T-067 (tayanch 9.76). |
| 12 | «Bir daqiqagacha» — xizmatga bog'liq, umumiy gap bo'lsin | **Rad** | Kurs bo'yi bir fakt (10, 15-darslar, tayanch 6 — Render rasmiy hujjati, 06.10); 15-dars kutish yozuvi matni ham shu (9.95). |
| 18 | `\dt` tekshirilmagan — olib tashlansin | **Rad** | Neon rasmiy hujjati (06.10 qayta ochildi): SQL Editor `\dt` ni qo'llaydi. «O'zim sinamadim» shubhasi yopildi. |
| 43, 45 | `tuzatildi` / «tuzating» → «tahrirlang» (15-darsdagi «tuzat-» chegarasi) | **Rad** | 15-darsdagi chegara — o'sha darsning ichida: doskada «tuzatilgan reja» bilan «sinov tuzatishi» aralashmasin. Kursda «tuzatish» — xatoni to'g'rilash so'zi (13-dars nomi «nimani tuzatasiz?», 9-Modul `m7-11`); pitch bo'lagini fidbekdan keyin tuzatish — o'sha ma'no. Auditor ham `varaq[].tuzatildi` ni «ish fakti» deb qabul qilgan. Tayanch 9.99 da yozildi. |
| 9, 13, 14, 19, 27, 30 | «ilova» / «mahsulot» · «kutish holati» · kutish yozuvi repo'da · «Run» · harakat belgisi (telefon raqami yo'q) · «kun bo'yicha» | Allaqachon | A-5 (umumiy gapda «mahsulot», GATE M M-q2 A) · 15-FILTR 33–34 (8 joy, teg `m11-dars-15-done`) · Neon hujjati · HB-q0 A (9.43, 9.59) · 13-FILTR 15. |
| 4, 7, 10, 11, 15, 17, 21–24, 26, 28, 29, 31, 35, 37, 40–42, 44 | Son ixtiyoriy · dars nomi · vaqt taqsimoti · demo 1,5 daqiqa · iPhone ko'prigi · «hamma pitch shunday emas» · halol gap · sanoq va son farqi · 12-savol · 5-savol · halol qator · 4-ekran jadvali · varaq · juftlik vaqti · ekran videosi · yumshoq tekshiruvlar · yakun holatga qarab | O'zgarishsiz | Auditor tasdiqladi. |

Tekshiruv: `lint:til` 16 — toza · o'zaro tekshiruv — arena har o'rin 3 marta (tartib avvaldan).
