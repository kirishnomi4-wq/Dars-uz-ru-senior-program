# 10-dars «Loyiha kuni: poydevor — Database, kirish, deploy» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 6.5/10 (pedagogika 8.5 · loyiha kuni formati 9 · texnik aniqlik 6 · security so'zlari 6 · 90 daqiqaga sig'ishi 5). Hukm: **Qabul 15 · Qisman 3 · Rad 4 · Allaqachon / o'zgarishsiz 17**.
Tekshirilgan manbalar: MD o'zi (grep) · tayanch 6 (Expo SecureStore — «encrypt and securely store key-value pairs locally on the device»; Render Free), 9.3 (token 30 kun), 9.4, 9.11, 9.29 · `QOIDALAR.md` T-028, T-067, P-058 · Qaror-0 6 (blok modeli).
Zaxira: scratchpad `md10/`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Token har so'rov bilan ketadi» — `/royxat`, `/kirish` tokensiz | **Qabul** | «yopiq so'rovlarga qo'shiladi» — 2-ekran xulosasi, 1-savol to'g'ri izohi, recap, kartochka, yakun; tayanch 9.80. |
| 2 | «Parol bir marta yoziladi» — mutlaq | **Qabul** | Xulosa: «Kirishda parol yoziladi; token telefonda saqlansa, qayta ochganda parol so'ralmaydi.»; kartochka: «… muddati tugasa — yana «Kirish»»; 1-savol B izohi. Ekran nomi (MD) qoladi. |
| 3 | `expo-secure-store` «shifrlab saqlaydi» — mutlaq xavfsizlik signali | **Rad** | Rasmiy hujjat so'zi («encrypt and securely store …», tayanch 6) va tayanch 9.4: «shifrlab saqlash» — faqat shu kutubxona uchun. Gap «xavfsiz, tamom» demaydi. |
| 4 | Hash ta'rifi | **Rad** | Tayanch 9.4 (8-dars bilan bir). |
| 5 | «Umumiy joy» = Database ga sakramaslik | **Rad** | Hook «umumiy joy hali yo'q» deydi — Database demaydi; 1-ekranda poydevor = Database + kirish + deploy (asosiy fikr ham uchalasini aytadi). |
| 6 | Hookda «Qiziq fikr!» | **Rad** | QOIDALAR T-028, T-067 (tayanch 9.76). |
| 7, 26, 27, 39 | Ro'yxatdan keyin «Kirish» (demo bilan bir) · javobda qo'shilganlar soni yo'q · `ishtirokchilar` bo'sh · loyiha kuni formati | Allaqachon | 2-ekran demo ham «Kirish» ga o'tadi; qolganlari — auditor tasdiqladi. |
| 8 | JWT modeli — «Backend tokenni kimga berganini biladi» chiqmasin | Allaqachon | Kartochkalarda yo'q (grep); 1-savol D izohi «Token Database'ga yozilmaydi» — to'g'ri yo'nalish. |
| 9 | Token muddati — hech qachon tugamaydi degan model | **Qisman** | Kartochka: «… muddati tugasa — yana «Kirish»»; A3 da `401` → «Kirish» (avvaldan); tayanch 9.80. |
| 10, 11, 15, 16, 22, 23, 29, 30 (prompt qismi), 33 | 4-ekran · `EXPO_PUBLIC_` ochiq · seed qayta qo'shilmaydi · «Ali» — jadval qatori · XSS — agent sharti · CORS · `401` → «Kirish» · `JWT_SECRET` qiymatsiz · A2 `401` sinovi | O'zgarishsiz | Auditor tasdiqladi. |
| 12 | A1: o'quvchi agent qurgan arxitekturani tekshirsin | **Qabul** | A1 4-qadamiga (4): «Agent aytgan fayllarda README'dagi jadvallar va uch yo'l bor; `git status` da `backend/.env` ko'rinmaydi.» |
| 13 | `localhost:3000/` — aniq yo'l | **Qabul** | «Brauzerda `http://localhost:3000/{asosiy ro'yxat}` (masalan `/oyinlar`)». |
| 14 | «Uzun satr» = hash isboti emas | **Qabul** | «`parol_hash` ustunida parolning o'zi yo'q — boshqa satr.» |
| 17, 36 | 3 × 20 daqiqa — juda optimistik; starter Backend shablon | **Qisman** | Starter shablon — **rad**: Qaror-0 6 (REPO-q2 A — o'quvchi hamma qadamni o'z repo'sida, agent bilan) foydalanuvchi qarori. Ulgurmagan o'quvchi uchun mavjud yo'l: «Ortda qoldingizmi» (`m11-dars-10-done`) va holatga qarab yakun (37). Real vaqt — 10-dars **sinov darslaridan biri** (2 pilot), taymer bilan o'lchanadi. |
| 18, 19 | Render «Free» va «15 daqiqa / 1 daqiqa» — o'zgaruvchan fakt | Allaqachon | O'quvchi matnida «Free» — rasmiy (tayanch 6, qurishda qayta ko'riladi — P-028); uxlash — «birinchi javob bir daqiqagacha kechikishi mumkin» (10-Modul kelishuvi), aniq sonlar faqat MD A-bo'limida. |
| 20 | Render manzili qayerda saqlanadi | **Qabul** | A2: «Render manzilingizni `README.md` ning «Internetga chiqarish» bo'limiga yozing … (manzil — ochiq qiymat)»; tayanch 9.82. |
| 21 | A3 web-trek — bitta gapga siqilgan | **Qabul** | A3 da alohida to'liq «Yordam (web-trek)» prompti: `VITE_API_URL`, `localStorage`, `401` → «Kirish», «Hisobdan chiqish», CORS — `WEB_ORIGIN`, «foydalanuvchi matni HTML bo'lib chiqmasin»; Render'da `WEB_ORIGIN`. |
| 24, 25 | `GET /oyinlar` tartibi — `yaratilgan DESC` aniq bo'lsin | **Qabul** | A1 talabiga (o'quvchi va Mentor varianti): «eng yangi yozuv tepada (`yaratilgan` bo'yicha kamayib)»; REPO: `ORDER BY yaratilgan DESC`; tayanch 9.29. Avval talabda tartib yo'q edi — agent ixtiyoriga qolardi. |
| 28 | «Hisobdan chiqish» — roadmap'da yo'q | **Qabul** | A3 tekshiruvida: «bu — kirish poydevorining qismi, roadmap funksiyasi emas». |
| 30 | Agentga xato yuborishda `.env` qiymatlari yuborilmasin | **Qabul** | A1, A2, A3 xato gapi: «xato qatorini agentga yuboring (`.env` qiymatlarini emas)»; tayanch 9.81. |
| 31 | `.env` gitignore — A1 dayoq tekshirilsin | **Qabul** | 12 bilan. |
| 32 | «localhost — telefonning o'zi, shuning uchun internetga chiqadi» — sababni oshiradi | **Qabul** | Yakun: «Telefon `localhost` bilan laptopdagi Backend'ni topmaydi — bu darsda Backend barqaror manzil uchun internetga chiqadi.» |
| 34, 35 | Nest log va `$2b$10$` — aniq ko'rinish | Allaqachon | Ikkalasi faqat o'ngdagi «kutilgan natija · namuna»da; mezon — «xato yo'q» va «parolning o'zi yo'q». |
| 37, 38 | Yakun holatga qarab; «o'yinlar» — Mentorniki | **Qabul** | A3 — «Poydevor tayyor: ro'yxatingiz Backend'dan keladi.» · A2 — «Backend internetda — ilovaga ulash qoldi.» · A1 — «Database va kirish tayyor — deploy qoldi.» · yo'q — «Poydevor boshlandi — qolgan qadamni tugating.»; belgi «✓ Poydevor tayyor» faqat A3 da. |

**Sinf-supurish:** «har so'rov» — 12-darsda «ruxsatni Backend har so'rovda beradi» — to'g'ri ma'no (har F2 so'rovi tekshiriladi), o'zgarmadi · `.env` qiymati xato gapida — 11–14-darslarning «Shu xato chiqdi» gaplari qurishda shu qoida bilan (tayanch 9.81 — quruvchi o'qiydi).

Tekshiruv: `lint:til` 10 — 0 · o'zaro tekshiruv — arena 3/3/3/3, «Keyingi dars» mos («sir» so'zi olib tashlandi).
