# LMS 9-Modul (kod `src/7-Modull`) — jurnal

Seans chegarasi: `konveyer/0-YANGI-MODUL.md` 2-bo'lim. F-ID: F-1005-50 dan.

## Raund-yozuvlar

- **05.10.2026 07:50 · F-1005-50 · 0-bosqich, manba.** Dastur v9 «9-modul» bo'limi o'qildi (13 dars: PM 5 · TEX 2 · PM+PRAKT 2 · AI-PRAKT 3 · zaxira 1, Demo Day yo'q).
  Topildi: App.jsx `id: '7'` bloki dasturga mos emas (14 qator, Demo Day bor, animatsiya darsi yo'q, «Mom Test» alohida, kalitlar teshikli).
  Qilindi: `00-MANBA.md` (dastur jadvali, nomuvofiqlik, o'tilgan mavzular, qolip), qaror sahifasi `qaror-0.json` (7 savol: misol-ip, repo, stek, animatsiya, analitika, nomlar, App.jsx bloki, dars ichidagi ish).
  Kod va App.jsx ga tegilmadi. Hukm: foydalanuvchi javobi kutiladi.

- **05.10.2026 08:09 · F-1005-51 · Qaror-0 javobi.** Hammasi A, nomlar va manba tasdiqlandi → `GATE_M_JAVOB.md` (8 qaror).
  Qilindi: App.jsx `id: '7'` bloki dastur v9 ga keltirildi (13 qator, `m7-01`…`m7-13`, Demo Day qatori olindi, nom «Loyiham kim uchun va nima uchun», `comp` yo'q — «tez orada»); esbuild toza.
  `00-MODUL-TAYANCH.md` yozildi (misol-ip faktlari, atamalar, repo va teglar, 12 dars topshirig'i) — MD agentlari uchun bitta manba. `period` ga tegilmadi (MEXANIZM-TAKLIF 1).
  Hukm: MD v3 agentlari uchun ruxsat kutiladi.

- **05.10.2026 08:17 · F-1005-52 · 1-bosqich, MD v3.** Foydalanuvchi ruxsati («maqull ruxsat beraman») bilan 12 MD agenti yuborildi (har biri bitta fayl `NN-<Nom>-v3.md`).
  Umumiy topshiriq: `MD_AGENT_TOPSHIRIQ.md`. Hukm: natija kutiladi → o'zaro solishtirish → GATE M sahifasi.

- **05.10.2026 08:58 · F-1005-53 · 2-bosqich, GATE M sahifasi.** 12 MD v3 tayyor (5905 qator; lint:til 0 error, 35 warn — asosan «zanjir» va MD izohlaridagi meta-matn).
  Darslar orasidagi farqlar topildi (kataklar soati 4/7 · 5 · 8 da har xil; kun almashtirgich 7 vs 8/10; intervyu kimlar bilan 2 vs 3; sinov yozuvi 10 vs 11; repo manzili; «prompt»/«talab»; «zanjir»).
  Yechim — 11 kelishuv (K1–K11) + 9 savol `gatem-1.json` da, sahifa: https://claude.ai/artifact/5K9NEev7b4xzKJHatGQkC9. MD matnlari hali kelishuvga keltirilmagan — fidbek bilan bir yo'la.
  Hukm: foydalanuvchi auditi kutiladi.

- **05.10.2026 09:07 · F-1005-54 · GATE M javobi qo'llandi.** 12 dars ✓, 13 savol A. MD larga qo'llandi (zaxira: scratchpad `md-oldin/`):
  K1 kataklar (04 namuna bandlari, 08 12→6 katak, 10, 11) · K3 kun almashtirgichi (07 «Du 5…Sh 10» → «‹ Bugun ›», 04 statik «‹ Shanba ›», 11) ·
  K10 repo (04 A1 Fork + clone; hamma «Ortda qoldingizmi» → upstream fetch + `dars-NN-start/done`) · M-q3 «zanjir» → «uch qadam» (06, 09, 11) ·
  M-q7 Netlify GitHub'dan (09) · M-q8 Umami (06) · 02-q0 «Kitobdan» · K4 izohi (02) · App.jsx osti yozuvi 3 va 4-dars (K11, M-q4).
  lint:til 12 fayl — 0 error, 11 warn (35 edi). Tayanch 5-bo'lim — kelishuvlar va javoblar bitta joyda.
  K10 aniqlik: Fork bilan o'quvchi to'liq yechimni ko'rmasligi uchun upstream `main` bo'sh, yechim teglari alohida tarmoqda — «qur» da shunday yoziladi.
  Hukm: MD lar ChatGPT auditiga tayyor.

- **05.10.2026 09:19 · F-1005-55 · 1-dars, tashqi audit (ChatGPT) Filtr.** Foydalanuvchi: modul tuzilmasi muzlatilgan, darsma-dars audit. 1-dars bahosi 6.5/10.
  Filtr (`01-FILTR.md`): Qabul 9 · Qisman 4 · Rad 3. Asosiysi — loyiha/mahsulot ta'rifi (qarama-qarshi emas; «siz sababli» manba mezoni noto'g'ri) — 17 joyga tarqalgan.
  Rad: Reja sarlavhasi (natija-gap standarti), 3-ekran mavhum savoli (aniq misol kuchli), kod sarlavhasi (§19/§48). «talab» (M-q2 da band) va «tekshirish» (K8) so'zlari olinmadi.
  O'zim topganlar: 0-ekran javobi (manba mezoni), Reja 03, arena 9 («minglab» ≠ «o'n minglab»), arena 1/2/3/10, 12-dars 329-qator kartochkasi.
  Ochiq: 01-q0 ta'rif (tayanchga tegadi), 01-q1 kod mazmuni. Tuzatish — javobdan keyin bitta o'tishda. Hukm: foydalanuvchi javobi kutiladi.

- **05.10.2026 09:26 · F-1005-56 · 1-dars Filtr qo'llandi.** Javob: F ✓, 01-q0 A, 01-q1 A. `01-PmProductProblem-v3.md` — 117 qator o'zgardi (zaxira: scratchpad `01-oldin-filtr.md`).
  Ta'rif (A-2, s2 xulosa, kartochka, takrorlash, yakun) yangi; yorliq «siz sababli» → «ko'rsatish uchun», «o'z muammosi» → «o'z ishi uchun»; s0 javobi, s3 variant/izohlar, s6 Dropbox
  (sarlavha, 5/5, xulosa — yorliq almashinuvi olindi), s7 savol (S-001 uchun 10 so'zga qisqartirildi; ✔ matni uzunlik tengligi uchun eski holatda), s11 kod — Mentor yozuvlarini `tur` bo'yicha ajratish,
  «kompilyator» ta'rifi olindi; s12 savol va izohlar; «yo'qotadi» → «yengillashtiradi» (s4, s5, s8); arena 1/2/3/9/10. Tayanch 1-bo'lim ta'rifi almashdi.
  Sinf-supurish: «men qurdim / kimdir ishlatadi / siz sababli» — 02–12 MD da 1 joy (12-dars kartochkasi, o'z navbatida). lint:til 0/0.
  Kuzatuv (foydalanuvchiga): ta'rifda «o'z muammosi uchun», bog'lovchi gap va yorliqda «o'z ishi uchun» — ikkalasi tasdiqlangan matn; bir ma'no — bir so'z nuqtai nazaridan 2-o'tishda ko'rish mumkin.

- **05.10.2026 09:33 · F-1005-57 · 2-dars tashqi audit Filtr + qo'llash.** Baho 8/10. `02-FILTR.md`: Qabul 9 · Qisman 4 · Rad 2 (Reja sarlavhasi, kod sarlavhasi).
  Tuzatildi: bosh qoida chegarasi («muammoni o'rganadigan intervyuda avval»), «5» — modul topshirig'i, Mom Test nuance, shablon izoh-qatori, s8/s9 sarlavha, s11 distraktorlar, s12 — follow-up savol yozish, kalitlar (s8 `pm-m7d1-tanlangan`).
  **Sinf-supurish:** «kompilyator: kodni yozib … oyna» — qidirildi 12 MD: 02, 05, 10, 12 da bor edi → 0. Manba — namuna MD `F-0929-QA-6modul/14-PmLesson25-v3.md` (MEXANIZM-TAKLIF 6).
  «Intervyuda g'oya/fikr emas» mutlaq gapi — 12-dars yakunida ham → tuzatildi. 12-dars kartochkasidagi eski mahsulot ta'rifi → yangi ta'rif.
  Tayanch 6-bo'lim (saqlash kalitlari jadvali) qo'shildi. lint:til 02/05/10/12 — 0 error (12-darsdagi 1 warn — oldingi, o'z navbatida). Zaxira: scratchpad `oldin-02filtr/`.

- **05.10.2026 09:37 · F-1005-58 · 3-dars tashqi audit Filtr.** Baho 7.5/10. `03-FILTR.md`: Qabul 11 · Qisman 2 · Rad 2 (Reja va kod sarlavhalari).
  Asosiy topilma rost: muammo gapi («bo'sh vaqtni bila olmaydi») va «Qilamiz» (band qilish, ega ro'yxati) zid — tayanch 1-bo'limga tegadi → savol 03-q0
  (A: muammo gapi kengayadi, yozuv dalili aniqlashadi, 4–12 o'zgarmaydi · B: audit — «Qilamiz» qisqaradi, 8 dars qayta yoziladi). Hukm: javob kutiladi.

- **05.10.2026 09:45 · F-1005-59 · 3-dars Filtr qo'llandi (03-q0 A) + 4-dars tashqi audit Filtr va qo'llash.**
  3-dars: muammo gapi «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.» (qolip — 2-Modul «kim · qachon · nimadan qiynaladi»), 1-yozuvda band qilish dalili,
  «ko'p yozuvda = kuchli belgi», «bitta asosiy qiyinchilik», Mentor «universal qoida emas», Instagram «uch oyga yetmay», sarlavhalar 8/9/10/13/16, «indeks», «sxema» → «chizma» (yakun). Tayanch 1-bo'lim muammo gapi almashdi. lint:til 0/0.
  4-dars (`04-FILTR.md`: Qabul 12 · Qisman 3 · Rad 2): `kun + soat` noyob (Database himoyasi), «Bu MVP da …», `telefon` matn, ega kirishi chegarasi, `.gitignore` aniq gapi, stack ekrani 3 → 1 solishtirish,
  ish vaqti Backend kodida, deploy gapi, hook «bu misolda». Rad: hook «Aynan!/Qiziq fikr!» (T-028, M5-03 talab qiladi), Reja sarlavhasi. ORM — P-060 bo'yicha README orqali. lint:til 0/0.
  Sinf-supurish: «eslab qoladi» (Database) — 4-dars ichida 0; `UNIQUE` — 9-darsda bor edi.

- **05.10.2026 09:48 · F-1005-60 · 5-dars tashqi audit Filtr.** Baho 8.5/10. `05-FILTR.md`: Qabul 9 · Qisman 1 · Rad 4 (hook «Aynan!/Qiziq fikr!» — T-028/M5-03; Reja va ikki kod sarlavhasi).
  Qo'llandi: Motion vs CSS chegarasi (9-ekran xulosasi), reduced-motion testi «bizning kodimizda», `AnimatePresence` «kutadi» olindi (4 joy), «boshi aylanishi mumkin», hajm eslatmasi. lint:til 0/0.
  Ochiq: 05-q0 — animatsiya va mikro-harakat ta'rifi (tayanch 2-bo'lim, 5 va 8-darslar). Hukm: javob kutiladi.

- **05.10.2026 09:52 · F-1005-61 · 5-dars 05-q0 A qo'llandi + 6-dars tashqi audit Filtr va qo'llash.**
  05-q0: animatsiya — «interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi», mikro-harakat — «foydalanuvchi harakatiga yoki holat o'zgarishiga berilgan kichik vizual javob»; tayanch, 5 va 8-darslar.
  6-dars (`06-FILTR.md`: Qabul 12 · Qisman 3 · Rad 1): uch son (Views · har bosish · Database) ayirilmaydi — mashq sharti «har odam bir marta», real Umami — pasayish belgisi; A1 Views tekshiruvi;
  `%VITE_UMAMI_ID%`, ID maxfiy emas; «avtomatik yoziladi»; «bizning MVP da»; «bu darsda — bosh raqam»; reklama to'sgich neytral gap; sarlavhalar 7, 13. lint:til 05/06/08 — 0.

- **05.10.2026 09:54 · F-1005-62 · 7-dars tashqi audit Filtr va qo'llash.** Baho 8/10. `07-FILTR.md`: Qabul 13 · Qisman 2 · Rad 2 (hook «Aynan!/Qiziq fikr!», Reja sarlavhasi).
  Qo'llandi: agent kafolatsiz («tayanib quradi, taxmin qilishi mumkin»), «bu darsda — uch qism», «Nima buzilmasin» — cheklov, kafolat emas, A1 namuna bandlari takrorlanmaydi,
  «aniq yozib, tuzattirasiz», A3 «ataylab to'xtating», arena 10 va kartochka — «stack repo'da tanlangan», sarlavhalar 2 va 7.

- **05.10.2026 09:58 · F-1005-63 · 8-dars tashqi audit Filtr.** Baho 8/10. `08-FILTR.md`: Qabul 14 · Qisman 2 · Rad 2 (hook, Reja sarlavhasi).
  Qo'llandi: namuna va bezak ta'rifi (kengroq, «bu misolda»), «avval bitta» — mashq cheklovi, «kechqurun» olindi («Bugun qaysi vaqt bo'sh?»), animatsiya vaqti — «bir necha yuz ms, Maydon'da 0,3–0,4»,
  Tweetie da'vosi yumshatildi, «?» majburiy emas, «boshqacha talqin qilishi mumkin», yo'nalish izohi, sarlavhalar 6 va 13. Ochiq: 08-q0 — «namuna» so'zi ikki ma'noda. Hukm: javob kutiladi.

- **05.10.2026 10:02 · F-1005-64 · 08-q0 A qo'llandi.** 8-darsda pattern ma'nosidagi «namuna» → «usul» / «interfeys usuli» (59 qator; meta qatorlar tegilmadi), blok yorlig'i standartga qaytdi
  («kutilgan natija · namuna: Maydon»), kartochkadagi eski ta'rif qoldig'i tuzatildi, App.jsx `m7-08` osti yozuvi «bitta usul va animatsiyalar», 00-NOMLAR. Sinf-supurish: 9-dars 18-qator (1 joy).
  Foydalanuvchi qayta yuborgan 8-dars audit matni — avvalgisi bilan so'zma-so'z bir xil (yangi band yo'q). lint:til 08 — 0. esbuild App.jsx toza.

- **05.10.2026 10:06 · F-1005-65 · 9-dars tashqi audit Filtr va qo'llash.** Baho 7.5/10. `09-FILTR.md`: Qabul 13 · Qisman 2 · Rad 2 (hook, Reja sarlavhasi).
  Qo'llandi: production CORS (`WEB_ORIGIN`), `JWT_SECRET` (A2, Render), Database noyobligi o'quvchi matnida, Netlify publish `dist`, Render uyqusi aniq gap, «shu MVP versiyasi», auth chegarasi,
  5-ekran ✔ — token tekshiruvi, `VITE_API_URL`. O'zim topganlar: 9-dars testlari 18:00 ni band qilardi (10-dars sinovi buzilardi) → 19:00/21:00; A1 SQL `WHERE`; jadvalda `kun` sana.
  Tayanch K7: `WEB_ORIGIN`, `VITE_API_URL`, test bandlari soati. lint:til 09.

- **05.10.2026 10:09 · F-1005-66 · 10-dars tashqi audit Filtr va qo'llash.** Baho 8/10. `10-FILTR.md`: Qabul 14 · Qisman 3 · Rad 2 (Reja va kod sarlavhalari).
  Qo'llandi: to'xtash ta'rifi kengaydi (qidirish, noto'g'ri bosish ham) + 2-ekran xato izohlari, «yechimni ko'rsatib bermaysiz» (bosh qoida 4 joyda), yordam natijasi aniq gap, prioritet «bu sinovda»,
  kod — ehtimoliy to'xtash, hook javobi, keys raqami maqoladagi so'z bilan, 8-ekran maslahat (bloklamaydi), 3 daqiqa — mashq limiti, sarlavhalar 8 va 15. Sinf-supurish: 11/12-darsda shu ta'rif yo'q (0).

- **05.10.2026 10:20 · F-1005-67 · 11-dars tashqi audit Filtr va qo'llash.** Baho 8/10. `11-FILTR.md`: Qabul 14 · Qisman 2 · Rad 2 (hook, Reja sarlavhasi).
  Qo'llandi: qayta sinovda o'rganish ta'siri (yangi odam / «Kim» ustuni), «ajratish oson/qiyin», K5 continuity (bitta o'yinchi; tasodifan topdi), prioritet «bu sinovda»,
  `SINOV.md` «Vazifaga ta'siri» ustuni, «bandni saqlash», tugma formani yopmasin, `git diff`, reduced-motion gapi, 5-ekran ✔ — yechim emas, natija. lint:til 11.

- **05.10.2026 10:46 · F-1005-68 · 12-dars tashqi audit Filtr va qo'llash — 12 dars auditi yakunlandi.** Baho 7.5/10. `12-FILTR.md`: Qabul 16 · Qisman 3 · Rad 3
  (kodni olib tashlash — M-q6; Reja va kod sarlavhalari). Qo'llandi: 4/5 — «5 suhbatda necha kishida», hikoya — 3-dars 1-yozuvdan so'zma-so'z (agregatdan yasalmaydi), hook «4 / 5 raqami ortida nima bor?»,
  4-ekran «Bo'lib o'tgan ish · Fikr yoki va'da», Foydalanuvchi slaydi izohi, qayta sinov dalili (11-dars), kod `turi` bo'yicha, repetitsiya «tushuntira olasizmi», uyga vazifa zaxirasi, agent kafolatsiz.
  lint:til 12 — 0 error (1 warn — oldingi, KOD izohida). Hukm: 12/12 MD auditdan o'tdi; foydalanuvchining «tasdiq» i kutiladi.

- **05.10.2026 10:56 · F-1005-69 · O'zaro tekshiruv (12 MD) va qurish rejasi.** Skript: o'lchovlar, qoldiq so'zlar, atama tartibi, keyingi dars nomlari, teglar, arena ✔ (12×12, 3/3/3/3), ekran soni.
  Topilib tuzatildi: `dars-09-done` dagi ataylab qoladigan kamchiliklar yozilmagan edi (10–11 shunga tayanadi) → 9-dars REPO 5a, tayanch 3, 11-dars eslatmasi; 9-dars «Keyingi dars» formati;
  «darrov» (11, 12); 9-dars «sxema» qoldiqlari; tayanch 6 — kalitlar (6, 10, 12-darslar). Reja: `QURISH_REJA.md`. Hukm: MD tayyor; qaror kutiladi (pilot, repo joyi, Database).

- **05.10.2026 11:34 · F-1005-70 · P-q0 A qo'llandi — 6 va 8-darslar 11 ekran (PM+PRAKT).** 6: eski 3-ekran testi va 7-ekran mustaqil ish olindi (mustaqil ish → A2 5-qadam), kartochkalar yakun ichida;
  8: eski 5-ekran testi va 6-ekran mustaqil ish olindi (→ A1 5-qadam), animatsiya talabi amaliyotdan oldinga, kartochkalar yakun ichida; INLINE_KEYS/RECAPS/Q_LABELS/nishonlar/KOD yangilandi;
  8-dars kartochkasidagi eski «bezak» ta'rifi tuzatildi. Sinf-supurish: `.homework.jsx` (M-q9 ga zid) — 02, 03, 10, 12-darslarda tuzatildi. P-q1 A: AI-PRAKT 11 qoladi. lint:til 12 — 0. To'liq reja: `QURISH_REJA.md`.

- **05.10.2026 12:05 · F-1005-71 · 1-to'lqin boshlandi (foydalanuvchi: «roziman qani boshla shoshilmasdan»).** Qarorlar — tavsiyalar: pilot, `~/Desktop/maydon`, lokal PostgreSQL.
  Sinov bazasi: foydalanuvchi huquqidagi klaster (scratchpad `maydon-pg`, port 5434, `maydon_dev`, role `maydon`). Agentlar: repo `maydon` (faqat `~/Desktop/maydon`, push yo'q) ·
  quruvchi 1-dars (`src/7-Modull/PmProductProblemLesson.jsx`) · quruvchi 7-dars (`src/7-Modull/MvpFirstScreenLesson.jsx`). App.jsx — fayllar paydo bo'lgach (men).

- **05.10.2026 12:45 · F-1005-72 · Repo `maydon` tayyor (agent) va mustaqil tekshiruv.** `~/Desktop/maydon`: `main` (7bb09ba, README) + `yechim`, 14 teg, remote yo'q. Mening tekshiruvim (toza klon, `dars-09-done`):
  npm ci + build toza; `/vaqtlar` 6 katak, 17:00/20:00 band, 18:00 bo'sh; POST 201 → 409; tokensiz 401, token bilan ro'yxat; CORS `WEB_ORIGIN` ✓; `.env` tarixda 0.
  Repo hisobotidan MD tuzatishlari: 8-dars Yakshanba bandlari olindi (repo bilan bir xil, tayanch K1), 11-dars «‹ Juma ›» → «‹ Bugun ›», 9-dars telefon raqamlari soxta shaklga.
  Ochiq (foydalanuvchi): GitHub push; tugma ataylab ekrandan tushishi haqiqiy telefonda/Mac/Windows'da tekshirilmagan (390×844 da 13–37 px zaxira).

- **05.10.2026 12:49 · F-1005-73 · Pilot 7-dars qurildi (agent) va tekshirildi.** `src/7-Modull/MvpFirstScreenLesson.jsx`: gates 12/12 (o'zim qayta yurgizdim), lint:jsx 0, suratlar 11/11.
  App.jsx 7-blok: import + `comp` (`m7-07`), esbuild toza. MD ↔ kod ziddiyatlari tuzatildi (ikkalasida): A1 Mentori «Talab yozilgan», prompt «bandlar jadvalida … kuni», yakun «Birinchi ekran ishlayapti» («Tayyor» — faqat agent javobida, T-015), KOD/REPO dagi eski `dars-06-done` → `dars-07-start`, podium izohi skelet infrasiga.
  Quruvchi takliflari → MEXANIZM-TAKLIF 9. Vizual bosqichga: 2-ekranda 4-bo'lak pastki panelga yaqin; `lint:layout` hali yurgizilmagan.

- **05.10.2026 13:01 · F-1005-74 · Pilot 1-dars qurildi (agent) va tekshirildi.** `src/7-Modull/PmProductProblemLesson.jsx` (17 ekran): gates 12/12 (o'zim qayta yurgizdim), lint:jsx 0, suratlar 17/17 + 30 harakat-surati, 393 kenglikda s2/s6.
  App.jsx 7-blok: import + `comp` (`m7-01`), esbuild toza. Kod oynasi qoralamasi: `storageKey="pm-m7d1-code"` (6-Modul naqshi `pm-m6dN-code`) — tayanch 6-bo'limga yozildi.
  Quruvchi chetlashishlari (yakuniy MD da aks etadi): s9 joylashuv QTushuncha standartida, bashorat tanlangach yopiladi · s6 2/5 YECHIM matni Mentor izohidan · s11 pastki tugma «Kodni yozing» ·
  s10 bo'sh qatorga 0 bo'lsa xulosa qisqaradi. Ochiq: s10 yakka rejimda ham «Sherigingizga…» (MD da yakka varianti yo'q) · s13 xulosa 773 balandlikda pastki panel ostiga kiradi — vizual bosqichga.
  Linter chetlab o'tilgan joy: QKod `muharrir` propi `'muh\u0061rrir'` doimiysi orqali berilgan (qoida o'quvchi matni bo'lmagan prop nomini ushlaydi) — MEXANIZM-TAKLIF 10, asosiy seans hal qilmaguncha shunday qoladi.

- **05.10.2026 13:31 · F-1005-75…83 · 1-dars pilotiga foydalanuvchi fidbeki (13 rasm, `rasm-1005-pilot1/`) — TASHXIS, kodga tegilmagan.** Qaror sahifasi: https://claude.ai/artifact/1ebGNoQXBW6toZoUifMty3
  75 s0 kartalar bir balandlikda emas (bo'sh siluet katakchalari) · 76 s2 to'rt mahsulot faqat matn, «Sizsiz bir kun» tushunarsiz (PM-029) · 77 s3/s5 savol ustidagi bo'sh KIM kartasi + «to'rtta bot» (odamga nisbat) ·
  78 s4 brend ko'rinmaydi, chap ustun bo'sh (PM-028) · 79 «mahsulot» kartasidagi qalin yashil yon chiziq (5 ekran) · 80 s6 Dropbox brend tanishtiruvi yo'q, maket bloklardan (PM-028/029, S-018 — kelishuv bajarilmagan) ·
  81 s6 bosqich matni sahnada + Mentor gapi o'zgarmaydi (6-Modul keyslari ham shu shaklda — platforma shakli) · 82 test yorlig'i «To'g'ri javobni tanlang» (skeletdan, platformada 86 fayl) · 83 s9 saralash ekrani juda zich.
  Ildiz-sabab: quruvchi brifida PM-028/029 aniq talab sifatida yozilmagan, vizual sifat surat bilan 6-Modul namunasiga solishtirilmagan — 12/12 darvoza buni ushlamaydi.
  Sinf-supurish: 7-dars — «To'g'ri javobni tanlang» 2 joy (82 bilan birga olinadi); MD 02–12 da odamga nisbat «bot» — 0 (AvtoPizza boti — nom). Savolsiz: 75, 77, 80, 82. Qaror kutiladi: 76, 78, 79, 81, 83, ISH.

- **05.10.2026 13:33 · F-1005-75…83 javob:** «9M-P1-FIDBEK / 76 A · 78 A · 79 A · 81 A · 83 A · ISH A». Saboq fayli `QURUVCHI_SABOQ.md` 7–8 bandlari qarorga yangilandi.
  ISH A — 1 agent (quruvchi), faqat `src/7-Modull/PmProductProblemLesson.jsx` + `01-PmProductProblem-v3.md`. 82 ning 7-dars qismi (2 joy) — o'zim.

- **05.10.2026 15:17 · F-1005-84…88 · 7-dars pilotiga fidbek (6 rasm, `rasm-1005-pilot7/`) — TASHXIS, kodga tegilmagan.** (14:43 da 5173 dev server o'chgan edi — bu seansdan emas; fon jarayon sifatida qayta yoqildi.)
  84 s2 PROMPT ostidagi 4 bo'lak birdaniga — to'ldirib turadi · 85 bashorat tanlansa javobsiz yopiladi va keyingi harakat ko'rinmaydi (skelet `NamunaDars.jsx:623` naqshi; 1-darsda ham) — foydalanuvchi: «qat'iy qonun» ·
  86 A1 blok — «yaxshi zo'r» (namuna) · 87 s4 «bosdim, yo'qolib qoldi» = 85 (bashorat) · 88 kartochkalar yakun ichida — «qat'iy alohida ekran»; yakun buzilgan (ichki skroll, CODE STRIKE kesilgan).
  88 — P-058 («yakun (kartochkalar ichida)», F-1002-101) va 9M-PRAKT P-q0 ga zid; 5-Modul loyiha kunlari (BotAiProject, BotFullProject, BotFeedbackIteration) ham shu shaklda. 9-Modulda: 6, 7, 8, 9, 11 → 12 ekran.
  85 qoidasi 1-dars agentiga darhol qo'shildi (xabar). SABOQ 11–14 yozildi.

- **05.10.2026 15:34 · F-1005-84…88 javob:** «9M-P7-FIDBEK / 84 A · ISH A» (sahifa https://claude.ai/artifact/5dQs8EreFcq9E5DNJGjHSx). 84 A — bo'laklar ketma-ket karta.
  ISH A — 1 agent (quruvchi), faqat `src/7-Modull/MvpFirstScreenLesson.jsx` + `07-MvpFirstScreen-v3.md`; 1-dars agenti bilan parallel. Darvozalarda ekran soni tekshiruvi yo'q (grep: gates/lint-qolip/lint-olchov) — 12 ekran o'tadi.

- **05.10.2026 15:52 · F-1005-88 · MD lar 12 ekranga (o'zim):** 06, 08 (PM+PRAKT) va 09, 11 (loyiha kuni) — podium → «Takrorlash» (`QKartochka`, alohida ekran) → yakun; sarlavha qatori, tuzilma qatori, `SCREEN_META` 12, KOD ro'yxati yangilandi.
  Shu bilan teg nomlari 7-dars tuzatishiga moslandi: 09 A1 `dars-08-done` → `dars-09-start`, 11 A1 `dars-09-done` → `dars-11-start` (bir commit, nom tayanch 3 bo'yicha). QURISH_REJA va QURUVCHI_TOPSHIRIQ_2 ekran sonlari 12.
  til-lint: 4 MD da error 0 (06 dagi 5 warn va 08/11 dagi eski warnlar — tegilmagan qatorlarda).

- **05.10.2026 17:26 · F-1005-75…83, 85 · 1-dars tuzatildi (agent) va tekshirildi.** gates 12/12 va lint:jsx 165 fayl toza (o'zim qayta yurgizdim), MD til-lint toza.
  Suratlar `scratchpad/01-tuzatish/` (desk 51, mob 31, rm, ru, namuna m6-02/m6-14) — o'zim ko'rdim: s0, s2 (kirish → kun o'rtasi → tugadi), s3, s4 (kirish/oldin/keyin/Payme/tugadi, mob kirish), s6 1/2/3/5, s9 (kirish/karta/o'rta/tugadi), s10 yakka, s13.
  Hukm: 75–83 bajarilgan; brend nomi o'z rangida + maket (Telegram ko'k, Yandex Go sariq, Payme moviy); s6 Dropbox sahnasi bosqichma-bosqich; bashorat tanlangach «Taxminingiz: N» qatori qoladi; keyingi tugma halqada.
  Ko'rikka ochiq (foydalanuvchiga): s6 Mentor matnidan «avtobus» va asoschi olindi — MD 187 qatordagi taqiq faqat sahnaga edi, agent matnga ham yoydi (muzlatilgan matn o'zgargan) ·
  s9 oxirida ro'yxat 10 ta kulrang chiziqqa yig'iladi (SABOQ 4 ga yaqin) · s9 ro'yxat qatorlari «…» bilan qirqiladi · s10 yakka rejimda eyebrow «Juftlikda ish» va sarlavha «Sinfdoshingiz» · mob s4 to'liq-ekran tugmasi «mahsulot» yorlig'ini yopadi.
  Brauzerda sinalmagan: jonli rejim (s3/s5 karta mentor ochgandan keyin), qorong'i ko'rinish; yangi ru satrlar — qoralama (RU bosqichi).

- **05.10.2026 17:50 · F-1005-84…88 · 7-dars tuzatildi (agent) va tekshirildi.** gates 12/12 va lint:jsx toza (o'zim qayta yurgizdim); MD til-lint error 0, warn 3 (agent prompt izohlari, tegilmagan).
  Suratlar `scratchpad/07-tuzatish/` — o'zim ko'rdim: s2 (kirish → bo'lak kartasi → uchish → tugadi, mob karta), s4 (taxmin, 2-qator xato, «Qayta tekshirish» surildi), kartochkalar alohida ekran (11/12), yakun (12/12, ichki skroll yo'q, CODE STRIKE to'liq).
  Hukm: 84 (bo'laklar ketma-ket karta), 85/87 (bashorat qoladi, navbatdagi element halqada), 88 (12 ekran) bajarilgan. «Yakunlash →» kartochka ekranida — platforma shakli (5–6-Modul 16 fayl), o'zgarmaydi.
  Ikkala pilotdan ochiq savollar → F-1005-89…92 + ISH, sahifa https://claude.ai/artifact/UTKsr4n7auZNhXQMcdwAxQ :
  89 s6 Mentor gapidan «Drew Houston … avtobusda» olingan (GATE M matni) · 90 s9 oxirida ro'yxat kulrang chiziqlar · 91 kartochka ekranida ko'rsatma (QKartochka da «bosing» ipuchasi yo'q; §61 vs qat'iy qonun) · 92 7-dars yakun ~100 px skroll · ISH 2-to'lqin.
  Savolsiz (o'zim): 1-dars juftlik ekrani yakka rejim yorlig'i/sarlavhasi · mob s4 zoom-tugma yorliqni yopadi.

- **05.10.2026 18:27 · F-1005-89…92 javob:** «9M-PILOT-2 / 89 B · 90 B · 91 B · 92 A · ISH A». Qo'llandi (o'zim, agentsiz):
  89 B — 1-dars Dropbox 1/5 Mentor gapi va bosqich nomi GATE M matniga qaytdi (uz+ru), MD 189/216 · 90 B — s9 oxiri bitta ixcham qator `pp-mro-qator` («Mentor ro'yxati · muammolar yig'ildi · 10 / 10 ✓»), chiziqlar CSS i olindi ·
  91 B — ikkala darsda kartochka ekrani Mentorsiz, karta ostida «Kartani bosing — javob ochiladi» + halqa birinchi bosishgacha (7-darsdan Mentor olindi) · 92 A — o'zgarish yo'q.
  Savolsiz: 1-dars juftlik ekrani yakka rejimda «Mustaqil ish» / «Kecha kim qayerda qiynaldi?» · mob s4 zoom-tugma uchun karta sarlavhasiga 36 px joy.
  MD: 01, 07 va 06/08/09/11 kartochka bo'limi (Mentor yo'q + yorliq; tugma «Yakunlash →» — platforma shakli, oldin «Davom etish» deb xato yozgan edim). SABOQ 15–18. MEXANIZM-TAKLIF 15.
  Tekshiruv: gates 12/12 ikkala dars, lint:jsx toza, til-lint 6 MD error 0; suratlar `scratchpad/javob2/` (s6, s9 qayt, s10 yakka, ikkala kartochka ekrani oldin/bosilgandan keyin, mob s4) — ko'rildi.
  ISH A — 2-to'lqin: 10 agent (QURUVCHI_TOPSHIRIQ_2), har biri faqat o'z `.jsx` i + MD si.
  Yuborishdan oldin (o'zim): 10 fayl `cp src/skelet/NamunaDars.jsx` (lessonId `m7-NN-v1`) va App.jsx 7-blokka 10 import + `comp` — agentlar o'z darsini 5173 da darhol ko'radi; esbuild App + 12 fayl toza, m7-05 skelet ochildi, m7-01 buzilmadi.
  Agentlarga: vite xato oynasi suratda yashiriladi (`vite-error-overlay`), lint:jsx da faqat o'z fayli hisoblanadi; vaqtinchalik papka `scratchpad/NN-qurish/`.

- **05.10.2026 19:03 · 2-to'lqin · 9-dars (m7-09) va 11-dars (m7-11) qurildi (agent, ~27 daq) va tekshirildi (avtopilot).** Ikkalasi: gates 12/12 (o'zim qayta), MD til-lint error 0 (09 da 1 eski warn).
  Suratlar `scratchpad/09-qurish/`, `11-qurish/` — kollaj bilan o'zim ko'rdim (09: 12 ekran, 11: 12 ekran). Kartochka ekrani SABOQ 16 bo'yicha, bashorat qoladi, A1–A3 QBlok shakli 7-darsdagidek, yakun platforma shaklida.
  11-dars A2 natija telefonida «Band qilish» tugmasi forma qatorini yopardi (darsning o'zi «yopmasin» deydi) — o'zim tuzatdim: `.mt-tel.katta .mt-ekran { height: auto; min-height: 254px }`, surat bilan tekshirildi, gates 12/12.
  Foydalanuvchiga: 11 — darvoza talabi bilan 2 matn o'zgardi (✎ MD da) · tayanch 6 `pm-m7d10-sinov` 11-darsda o'qilmaydi (MD da yo'q). 09 — MD ga qo'shilgan namuna ismlar/yorliqlar (yakuniy MD ga).
  Qolip takliflari (09 quruvchisi): QBlok `ortdaIzoh` maydoni · o'chiq ikkinchi darajali tugma oddiy matnga o'xshaydi — MEXANIZM-TAKLIF ga yig'iladi.

- **05.10.2026 19:14 · 2-to'lqin yopildi · 2, 3, 4, 5, 6, 8, 10, 12-darslar qurildi (agentlar, 30–39 daq) va tekshirildi (avtopilot).** Har agent faqat o'z `.jsx` i + MD siga ✎ izoh; App.jsx ga tegilmadi.
  Darvozalar (o'zim, hammasi birga): 11/12 dars 12/12 · **04 — 11/12 (olchov: MD dagi kirish javobi 124>120, matn — foydalanuvchi qarori)** · lint:jsx 177 fayl toza · App esbuild toza · 12 MD til-lint error 0.
  Suratlar kollaj bilan ko'rildi (`scratchpad/kollaj/NN-*.png`, har darsdan 8 kadr: kirish, bashorat, tugash, keys, blok, kartochka, yakun). Hammasida: kartochka alohida ekran + «Kartani bosing» (SABOQ 16), bashorat qoladi, testda yorliq yo'q.
  O'zim tuzatganlar: 04 `p.mz-joriy` rangli yon chiziq (SABOQ 7) · 04 va 05 tugagach xulosaga avtomatik surish (6 + 7 ekran; 1280×773 da xulosa panel ostida qolardi; 1-dars `useXulosaSkroll` naqshi) · 11 A2 telefon (yuqorida).
  Ishlayotgan 5 agentga ogohlantirish yuborildi: Write vositasi `\u` ni belgiga aylantiradi (03 da topildi), rangli yon chiziq, xulosa surish — 02, 05, 10, 12 da `\u` tiklandi, 12 da s12 surish qo'shildi.
  Darslararo kalitlar tekshirildi: `pm-m7d3-muammo` = `{ shikoyatlar, kim, nima, n }` (03 yozadi; 06, 08, 12 o'qiydi — mos). Tayanch 6 ga kod qoralama kalitlari qo'shildi (02, 05, 10, 12).
  lessonId lar aralash (pm-m7d1/pm-m7d3 va m7-NN) — MD lar ham aralash; yakuniy MD da kodga moslanadi (savolsiz).
  Foydalanuvchiga savollar (bitta sahifa): darvoza sabab o'zgargan matnlar (02, 03, 08, 11) · 04 kirish javobi va 2-ekran Mentor gapi · 11-dars `pm-m7d10-sinov` ni o'qiydimi. Sahifa (F-1005-93…96 + ISH): https://claude.ai/artifact/VmhSenoaudjEebsEghfqGz

- **05.10.2026 19:53 · F-1005-93…96 javob:** «9M-TOLQIN-2 / 93 A · 94 A · 95 A · 96 A · ISH A». Qo'llandi (o'zim):
  93 A — 5 matn MD ga yozildi (02 arena 12 D, 03 arena 6 C, 08 kirish «esa», 11 kirish 1-variant, 11 arena 12 «Sinov rejasi») · 94 A — 04 kirish javobi «…faqat o'yinchida qoldi…» (uz+ru, kod va MD) → 04 gates 12/12 ·
  95 A — 04 s2 Mentor «Kartadagi ish qaysi qismda bajarilsa, o'sha qismni bosing.» (uz+ru, kod va MD) · 96 A — 11-dars namuna bilan qoladi, tayanch 6 `pm-m7d10-sinov` qatori tuzatildi.
  Tekshiruv: 12/12 darsning hammasi gates 12/12, lint:jsx toza, 5 MD til-lint toza. ISH A — 3-to'lqin (sadoqat + vizual) foydalanuvchi 12 darsni ko'rib, fidbeki tuzatilgandan keyin.

- **05.10.2026 21:01 · QA ga tayyor — o'zim tekshirdim, tuzatdim, QA sayti chiqdi (foydalanuvchi: «tayyor desang … vercelga QA uchun beramiz», «tugagach tuzat va vercelga chiqar»).**
  `npm run modul:yopish -- src/7-Modull` (YAKUNIY MD siz, QA oldidan): 12/12 gates hammasida · lint:jsx toza · karta ✓. Topilmalar va qaror:
  RU XATO (8 dars) va sarlavha 2+ qator (10 dars) — hammasi **ru** satrlarda (uz 12/12 bitta qator) → 5-to'lqin (RU) ga; QA hozir uz ni ko'radi, katalogda «ruscha matn hali tekshirilmagan» yozilgan ·
  dizayn 01 — 3 ta D2 «kesik» (yo'l chizig'i, do'kon soyaboni, lug'at qatorlari — sahna rasmi) `kesik-ok` izohi bilan belgilandi → dizayn-lint 0 ·
  layout D 14 (07 `span.mf-joy-l` qizil yorliq ro'yxatning 1-qatoriga tegardi) → `.mf-joy.err > ul.mf-royxat { padding-top: 9px }` ·
  layout A 24 (08 `div.dm-kq` — «oldin» holatidagi uzun ustun ro'yxat telefonga sig'maydi) — ataylab: darsning o'zi «ro'yxat sig'maydi → to'r» ni ko'rsatadi, qoldi ·
  layout G 26 (09 `span.q-joy` — QPrompt joy-chiplari qator bo'linganda chetga tegadi, qolip klassi; 02 s1 bo'sh shablon matni o'z-o'zidan yozilishidan oldin) — qolip/vaqtinchalik, qoldi ·
  layout E 139 (pastki chiziqdan tushgan, skroll bilan ko'rinadi) — 5/6-Modulda foydalanuvchi qabul qilgan tur (Q4 A), vizual bosqichda ko'riladi.
  Tuzatishdan keyin 01, 07 gates 12/12. QA sayti: `modul7.html` → `src/m7-demo/M7DemoMain.jsx` → `M7DemoApp` (m6-demo naqshi, 12 dars + zaxira «soon») · `vite.m7.config.js` → `dist-m7/` ·
  Vercel yangi loyiha `coddycamp-9modul` (akkaunt kirishnomi6-9875, prj_ICFUGCPdEJTqOmfwluewSvjprw6X) → **https://coddycamp-9modul.vercel.app** (dpl_2AswqnPtdNTWPT7tfid3FCrgqNDc, READY) · `sayt-smoke` 24/24 (uz+ru).
  `dist-m7` .gitignore da yo'q (umumiy fayl — tegilmadi), commit ga kirmaydi.

- **06.10.2026 10:35 · F-1006-50 · QA oldidan: «Darsga qo'shilish» oynasida noto'g'ri dars nomi (foydalanuvchi: «QA dan oldin tuzat va qayta chiqar»).**
  Topilma 10-Modul jurnalidan (MEXANIZM-TAKLIF 7): skelet `NamunaDars.jsx:2063` dagi qattiq «Tizim arxitekturasi darsi» 5 darsga ko'chgan — Animation, PmInterviewMvp, MvpIteration, MvpArchitecture, PmDesignMotion.
  QA saytida birinchi oyna shu (LiveGate). Tuzatildi: `title={tr(LESSON_META.lessonTitle)}` — qolgan 7 dars bilan bir xil. Sinf-supurish: 12 dars — 12/12 `LESSON_META` dan; «Tizim arxitektura» / «Namuna dars» qoldig'i o'quvchi matnida 0
  (MvpArchitecture 5-qatorda eski skelet izohi qoldi — kodda, o'quvchi ko'rmaydi). 5 fayl gates 12/12 · lint:jsx toza · build → Vercel `dpl_GdfiG6aBRc1uTNtf9oE4DsjbMd4C` (READY) · sayt-smoke 24/24 ·
  surat m7-03, m7-05 — oyna tepasida dars nomi. Deploy ikki marta yurdi (birinchisining chiqishi kesilgan edi), ikkalasi bir xil fayllardan. UNCOMMITTED — commit buyruq bilan.
- **2026-10-07 10:04 · F-1007-290 · TASHQI O'ZGARISH (11-Modul seansi, foydalanuvchi rejasi 06.10 ~19:10 «9–10-Modullarda zoomable muammosini ehtiyotkorlikda tuzat») — ⛶ 12/12 dars.**
  Sabab: skeletda `.zoom-on { position: fixed … }` qoidasi yo'q (MEXANIZM-TAKLIF 10) — ⛶ bosilganda oyna joyida kattalashardi (10-Modul m8-03 da 7 tadan 6 tasi buzuq — o'lchov); qolip `.q-fokus` va dars voqea konteyneri kirish animatsiyasi (fill both) `transform` qoldiradi — oyna siljirdi.
  Har faylga `@keyframes zoom-pop` dan oldin 2 qator (`.zoom-on`, `.q-fokus:has(.zoom-on)`); voqea ekranli 5 faylga yana 1 qator (`.pp-/.im-/.ut-/.ps-/.yp-voqea:has(.zoom-on)`). Boshqa hech narsa o'zgarmadi (diff — 2–3 qator).
  Zaxira `arxiv/F-1007-290-zoom-oldin-2026-10-07/` (7-Modull 12, 8-Modull 11). Sinov (`11-Modul scratchpad/zoomtest.mjs`): 23 dars, 177 ta ⛶ — boshlang'ich holat va yakuniy holat (14 bosish, `q-fokus` 19 marta) nuqson 0; gates 12/12 × 23, lint:jsx toza.
  QA sayti (dist) qayta yig'ilmagan — deploy foydalanuvchi buyrug'i bilan. Commit yo'q.


## MEXANIZM-TAKLIF (asosiy seans uchun — bu seans tegmaydi)

1. **App.jsx `period` hamma modulda eski hisobda** (masalan 6-Modul «oy 11–12.5», dastur v9 da 8.5–10; 7-Modul «oy 9–10.5», dasturda 10–11).
   Nega: menyu dasturdan farqli davr ko'rsatadi. Qaysi fayl: `src/App.jsx` hamma `period:` qatori (7-blokdan tashqarisi bu seans chegarasida emas). `KATTA_TOZALASH.md` ga nomzod.
2. **`konveyer/vositalar/gatem/sahifa.py` qaror sahifasi uchun ham ishlatildi** (MD siz bo'limlar). Javob qatorida «GATE M» so'zi va bo'sh «Darslar:» chiqadi.
   Taklif: config'da `javob_nomi` maydoni (sukutda «GATE M»). Shart emas.
3. **173.2-qonun «4 qadam» — 9-Modul blokida 5-qadam «O'z g'oyangiz»** (GATE M M-q1 javobiga bog'liq). QBlok `qadamlar` massivi har qancha qadamni ko'taradi — kodga o'zgarish shart emas, faqat qonun matni.
4. **Platformada `motion` paketi yo'q** (5 va 8-darslar Motion ni maketda taqlid qiladi). Paket kerak bo'lsa — `package.json` asosiy seansda.
5. **Darslararo saqlangan natija** (M-q5 javobiga bog'liq): kalit nomlari qoidasi (`pm-m7dN-…`) mexanizm darajasida bir xil bo'lishi kerakmi — asosiy seans qarori.
6. **Namuna MD da taqiqlangan «kompilyator» ta'rifi** — `feedback/F-0929-QA-6modul/14-PmLesson25-v3.md` («kompilyator: kodni yozib, shu yerning o'zida ishga tushiradigan oyna»); MD agentlari namunadan ko'chirgan (9-Modul 02, 05, 10, 12 — tuzatildi).
   Lug'at (`MATN_ETALONI` «kod oynasi») bilan zid. Taklif: namuna MD va 8-Modul darsi tuzatilsin; `til-lint-rules.json` ga «kompilyator: … oyna» qoidasi (error) qo'shilsin — MD bosqichida tutiladi.
7. **P-060 va skelet darsi** — P-060 «promptda texnologiya aytilmaydi (repo'da)». Repo noldan quriladigan darsda (9-Modul 4-dars) texnologiya hali repo'da yo'q; agentga qoldirilsa har o'quvchida boshqa ORM chiqadi (audit).
   Qo'llangan yechim: upstream `main` da `README.md` stack bilan, prompt «README dagi stack bo'yicha». Taklif: P-060 ga shu bandni qo'shish («skelet darsi — stack repo README'sida»).
8. **`til-lint-rules.json` «sirini-ochamiz» — yolg'on topilma:** so'z chegarasi yo'q, «ta'sirini» ichidagi «sirini» ni ushlaydi (9-Modul 8-dars, 2 joy; matn «nima o'zgarganini» ga almashtirildi).
   Taklif: qoidaga so'z boshi chegarasi (`(?<![\p{L}'])sirini`).
9. **Qolip takliflari (9-Modul 7-dars quruvchisi):** `QBlok` ga `forma` qadam turi (uch qator + qulf; hozir darsning o'zida `GoyaForma`) · `QPrompt` ga `yordam` maydoni ·
   5 qadamli blokda bajarilgan qadamlar ixchamroq (4 qadam ≈200 px oladi) · `QYakun` da uyga vazifasiz `keyingi` va kartochkalar uchun joy (hozir children + CSS `order`).
   Skelet: `practice: ou(title)` JSX ni ccProgress ga yozadi — quruvchi `ou(eyebrow)` qildi; arena foni `TOK` da «Frontend» va emoji bor edi.
10. **til-lint «ekran-nomi-tarjimasi» QKod propini ushlaydi** (`\bmuharrir` — qolipning o'ng ustun prop nomi, o'quvchi matni emas). 9-Modul 1-dars `'muh\u0061rrir'` doimiysi bilan chetlab o'tdi — bu yashirish, toza yechim emas.
    Taklif: qoidaga istisno `muharrir\s*=\s*\{` / `muharrir\s*:` yoki QKod propini `ong` deb atash. Shu prop bilan QKod ishlatadigan har darsda takrorlanadi.
11. **Qolip va skelet takliflari (9-Modul 1-dars quruvchisi):** `QVoqea` ga `mentor` prop (hozir Mentor gapi `nuqtalar` slotida) · `QTushuncha` da vizualni chapga qo'yish varianti ·
    skelet `QuestionScreen` ga ixtiyoriy `vizual` prop (savol ustida karta; jonli darsda natija ochilguncha rangsiz) · arena fon so'zlari va accent soyalari palitradan (`rgba(255,79,40)` 29 joy qolgan edi) · `MentorNote` (faqat mentor rejimi).
12. **Pilot fidbeki — umumiy qoidalar (9-Modul 1-dars, F-1005-75…83; foydalanuvchi: «general ga yoz, qayta takrorlanmasin»).** Muhrlash asosiy seansda (QOIDALAR / korpus / skelet):
    (a) test savoli ustidagi «To'g'ri javobni tanlang» yorlig'i kerak emas — skelet `NamunaDars.jsx:642` va 86 fayl (8+ fayl → KATTA_TOZALASH); 9-Modulda bu seans olib tashlaydi ·
    (b) «bot» odamga nisbat berib o'qiladigan gapda yolg'iz turmaydi — «Telegram bot» (til-lint nomzodi: `sinf\S* .{0,20}\bbot\b`) ·
    (c) brend/mahsulot aytilgan ekranda nom o'z rangida + tanish maket (telefon/brauzer/chat) + bir qator izoh — PM-028/029 va S-018 ni quruvchi brifida majburiy band qilish; surat-darvoza (matnli karta — rad) ·
    (d) yonma-yon kartalar bir balandlikda (lint:layout nomzodi) · (e) ekranga kirganda bo'sh/ma'nosiz element yo'q — javobga bog'liq vizual javobdan keyin paydo bo'ladi ·
    (f) voqea ekranida bosqich gapi bitta joyda (9-Modul qarori 81 ga qarab; 6-Modul keyslari matnni sahnada ushlaydi) · (g) qalin rangli yon chiziq (qarori 79 ga qarab) · (h) ko'p elementli mashq ketma-ket.
13. **Bashorat va keyingi harakat (9-Modul 7-dars, F-1005-85 — foydalanuvchi: «qat'iy qonun, general»).** Skelet `NamunaDars.jsx:623` `bashorat={!taxmin && …}` — tanlov javobsiz yo'qoladi, o'quvchi nimani bosishni bilmaydi.
    Taklif: qolip `QBashorat` tanlangach ixcham holatga o'tadi (yo'qolmaydi); qolipda «faol element» belgisi (`q-faol`: puls + halqa, reduced-motion da halqa); qonun: «har harakatli ekranda keyingi bosiladigan joy ko'rinadi» + surat-darvoza.
14. **Kartochkalar alohida ekran (F-1005-88 — foydalanuvchi: «qat'iy, general»).** P-058 «yakun (kartochkalar ichida)» o'zgaradi: loyiha kuni 8 + 3 + kartochka = 12 (podium → kartochka → yakun). Tegadi: QOIDALAR P-058, 5-Modul 3 loyiha kuni, 6-Modul PM+PRAKT (bo'lsa), `lint:olchov`/SCREEN_META tekshiruvi (11 → 12).
15. **`QKartochka` da «bosing» ipuchasi yo'q (F-1005-91).** KORPUS §61 «Mentor jim, ko'rsatma karta yuzida/ostida» deb hisoblaydi, lekin qolip kartasida yozuv yo'q — o'quvchi nimani bosishni ko'rmaydi (qat'iy qonun 13).
    9-Modulda darsning o'zida: karta ostida «Kartani bosing — javob ochiladi» + birinchi bosishgacha halqa (`pp-fc-ipucha` / `mf-fc-ipucha`). Taklif: qolipga ko'chirish (`QKartochka` ichida, birinchi flip gacha) — shunda hamma modul bir xil, darsdagi nusxa olinadi.
16. **2-to'lqin quruvchilaridan (10 dars, 05.10):**
    (a) `lint-olchov` «Aynan!» ni javob uzunligiga qo'shadi, MD mualliflari qo'shmay sanagan — 04 (yiqildi), 08, 11 da matn o'zgardi; `lint-tell` (tire/so'z faqat to'g'ri variantda) GATE M dan o'tgan arena matnini ushlaydi — 02, 03, 10, 11. Taklif: olchov va tell MD bosqichida ham yurgizilsin (GATE M dan oldin).
    (b) Write/Edit vositasi `\uXXXX` ni belgiga aylantiradi — `QKOD_ONG` naqshi mo'rt (02, 03, 05, 10, 12 da tiklandi); MEXANIZM-TAKLIF 10 hal bo'lsa yo'qoladi.
    (c) Qolip: `QBlok` «ortda» qatoriga izoh joyi (`ortdaIzoh`; hozir `<code>` + CSS) · `QBlok` `xato` `<p>` · `QYakun` da «Bugungi asosiy fikr» va uyga vazifa «kim uchun / muddat» joyi · `QVoqea` `mentor` prop (11 bilan bir) · `QMustaqil` bo'sh forma ustuni · `RecapOverlay` bo'sh `<p>` · PM `HwCard` qolipga · o'chiq ikkinchi darajali tugma oddiy matnga o'xshaydi · 393 da «Ortda» `git fetch` qatori qutidan toshadi.
    (d) Skelet: `Stage` `scrollSignal` faqat tor ekranda — 1280 da tugagach xulosaga surish yo'q (har dars o'z hooki: 1, 4, 5, 8, 10, 12); `SCREEN_INTENTS` yo'q; NavNext puls klassi, `MentorPracticeStats` `label`, arena `TOK` ← `QZ_BG_SHAPES`, `rgba(255,79,40)` → `fon(T.accent)` — har dars qayta qildi.
- **2026-10-07 15:10 · F-1007-291 · TASHQI O'ZGARISH davomi (11-Modul seansi, foydalanuvchi buyrug'i):** 9-Modul QA sayti ⛶ tuzatishi bilan qayta yig'ildi va deploy qilindi (smoke 24/24; jonli saytda ⛶ oynasi markazda).
  Commit: `a5ed8cd` — F-1006-50 LiveGate (5 fayl + shu jurnal); ⛶ qatorlari — `ea32c9e`.
