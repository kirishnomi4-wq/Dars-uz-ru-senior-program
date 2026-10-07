# 10-Modul — modul tayanchi (11 MD uchun bitta manba; har MD ning «A» bo'limi shundan oladi)

Qarorlar: `GATE_M_JAVOB.md` · nomlar: `00-NOMLAR.md` · dastur: `00-MANBA.md`. Bu fayldagi nom, raqam va so'zlar hamma darsda **aynan** shunday.
«Maydon» faktlarining birinchi manbasi — 9-Modul tayanchi (`feedback/F-1005-9modul/00-MODUL-TAYANCH.md`, faqat o'qiladi). U o'zgarsa — bu fayl unga moslanadi.
Bu yerda yo'q tafsilot kerak bo'lsa — MD oxiridagi «TAYANCHGA SAVOL» ro'yxatiga yoziladi, o'zicha o'ylab topilmaydi.

## 1. Misol-ip — «Maydon» davomi

- **Mahsulot, odamlar, muammo** — 9-Modul tayanchi 1-bo'limdan so'zma-so'z: «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt;
  **o'yinchi** va **maydon egasi** (ismsiz, o'ylab topilgan qahramon yo'q); muammo gapi: **«O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»**
- **9-Moduldan keyingi holat (`dars-11-done`):** kun bo'yicha 6 vaqt katagi (16:00 … 21:00), band qilish (ism + telefon), ega sahifasi `/ega` (parol → token, bandlar ro'yxati),
  Umami (sahifa ochilishi avtomatik, `vaqt-tanladi`, `band-qildi`), deploy: Backend — Render, sayt — Netlify; sinovdan keyin «Band qilish» tugmasi ekran pastiga qotirilgan.
- **10-Modul ipi:** MVP endi o'lchanadi, sinaladi, himoyalanadi va prodga chiqadi.

| Dars | «Maydon» da nima bo'ladi |
|---|---|
| 1 | Bosh raqam — haftada band qilingan vaqtlar; keyingi oyga OKR |
| 2 | Uch hodisa o'z jadvalimizga yoziladi; Umami bilan solishtiriladi |
| 3 | Dashboard: oxirgi 5 daqiqada nechta brauzer hodisa yubordi, bugun har qadamda nechta |
| 4 | A/B: tugma matni; B varianti sinfdoshlarga ketadi |
| 5 | Ega sahifasidagi uch zaiflik yopiladi; ega kirishiga 2FA |
| 6 | Telefon raqamlari — audit; saytda maxfiylik siyosati |
| 7 | Sayt nomi, HTTPS tekshiruvi, Backend `/health` (Database'siz — bepul limit), UptimeRobot |
| 8 | Prod ro'yxati: so'rovlar chegarasi, xato holatlari, A/B yakuni |
| 9 | O'zgarishlar Pull Request'da; code review; birlashtirish |
| 10 | Yil bo'yi qurilgan loyihalar vaqt chizig'ida (Maydon — oxirgisi); keyingi qadam — jamoa yig'ish |
| 11 | 5 daqiqalik pitch: muammo → yechim → foydalanuvchi hikoyasi → raqamlar → keyingi qadam |

- **Mentor misolidagi raqamlar** (Mentor misoli deb aytiladi; dars bo'yi aynan shu sonlar):
  - **O'tgan hafta (1-dars boshlanish nuqtasi):** ochdi 40 · vaqtni tanladi 25 · band qildi 6. Bosh raqam — **haftada 6 band**.
    Mashq sharti (9-Modul 6-dars naqshi): «Bu mashqda har kishi har qadamda bir marta sanaladi.» Bu sanoqni haqiqatda o'z tizimimiz 2-darsdan beradi —
    1-darsda «brauzer» so'zi va «turli brauzerlar» sharti ishlatilmaydi (u 2-darsda tug'iladi). Mashqda har kishi bitta vaqt band qilgan: «band qildi 6» = «haftada 6 band».
  - **OKR (1-dars, keyingi oy)** — maqsad: «Mahalladagi o'yinchilar maydonni qo'ng'iroqsiz band qilsin.»
    Asosiy natijalar: 1) haftada band qilingan vaqtlar 6 → 20 · 2) vaqtni tanlaganlardan band qilganlar foizi 24% (6 / 25) → 40% · 3) ikkinchi marta band qilgan o'yinchilar 0 → 5.
    Tajriba: tugma matni (4-dars) — asosiy o'lchovi 2-asosiy natija (1-natijaga ham ta'sir qilishi mumkin; tajriba OKR ning qismi emas, natijani kafolatlamaydi — 01-FILTR).
  - **Bir kun, ikki tizim (2-dars):** Umami — Visitors (sessiyalar) 31 · o'z tizimimiz — `ochdi`, turli brauzer ID 36 (yaqin, lekin bir xil o'lchov emas). Farq bo'lishi tabiiy; sabablardan biri — reklama to'sgichi Umami skriptini to'sishi mumkin.
  - **Dashboard (3-dars, namuna holat):** oxirgi 5 daqiqada 3 · bugun: ochdi 14 · vaqtni tanladi 9 · band qildi 3 (har qadamda turli brauzerlar soni).
  - **A/B (4-dars, sinfda):** A — 9 brauzer vaqt tanladi, 3 tasi band qildi · B — 8 tadan 4 tasi. Halol gap: «17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi.»
  - **A/B (8-dars, B ishga tushgandan beri):** A — 42 tadan 12 · B — 40 tadan 17. Hozircha B qoldiriladi (mahsulot qarori, isbot emas); Mentor: «Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz.»
  - **Oy oxiri (11-dars pitchi, Mentor misoli):** haftada **11 band** (6 dan; maqsad 20 ga yetmadi — pitchda halol aytiladi), B variantida foiz ≈43% (17 / 40).
  - **«Maydon» keyingi qadami (10, 11-darslar):** **jamoa yig'ish** — 9-Modul MVP ning «Keyin» ro'yxatidan, suhbatlarda 5 kishidan 2 tasi aytgan; u 1-asosiy natijaga (haftada 20 band) xizmat qiladi.
- Metafora yo'q.

## 2. Atamalar (bir ma'no — bir so'z)

9-Modul atamalari o'zgarmaydi: sayt · Backend · Database · vaqt katagi · band qilish · o'yinchi · maydon egasi · sinov (faqat real odam bilan) · tekshirish (o'z ishini ko'rish) · hodisa · talab · agent · prompt.

| So'z | Ma'nosi | Ishlatilmaydi |
|---|---|---|
| hodisa (9-Moduldan) | analitikaga yoziladigan bitta harakat; nomlari: `ochdi` · `vaqt-tanladi` · `band-qildi` | voqea, event (kod ichida — ha) |
| uch qadam (9-Moduldan) | ochdi → vaqtni tanladi → band qildi | zanjir, voronka (kartochkada bir marta «funnel» mumkin) |
| brauzer ID | tasodifiy harf va raqamlar: bitta brauzerni ajratadi, odamning ismini ham, telefonini ham bildirmaydi («qator» — faqat jadval qatori, T-015) | sessiya, foydalanuvchi ID |
| «Oxirgi 5 daqiqada» | dashboard yorlig'i (kodda `hozir`): oxirgi 5 daqiqada kamida bitta hodisa yuborgan turli brauzerlar; birligi — brauzer, odam emas; bu «hozir saytda turganlar» emas (03-FILTR 1, T-044) | «Hozir saytda» (so'zma-so'z ma'nosi zid), onlayn, faol foydalanuvchilar |
| inkognito oyna | brauzerning alohida xotirali oynasi: hamma inkognito oynalar yopilib, yangisi ochilganda sayt yangi brauzer ID beradi (Chrome va Edge — Ctrl+Shift+N, Mac — Cmd+Shift+N); tekshiruv vositasi (2, 3-darslar) | yashirin oyna |
| polling (5-Moduldan) | sayt Backend'dan qayta-qayta so'rashi; asosiy fe'l — «so'raydi», atama bir marta ko'prik bo'lib (3-dars) | real vaqtda (o'quvchi matnida) |
| bosh raqam (5-Moduldan) | mahsulot o'z ishini bajarganini ko'rsatadigan bitta raqam; North Star — kartochkada bir marta («Qutb yulduzi») | asosiy metrika |
| metrika (5-Moduldan) | sanaladigan raqam | ko'rsatkich |
| OKR | maqsad + asosiy natijalar (Objectives and Key Results) | KPI |
| maqsad | so'z bilan yozilgan yo'nalish, raqamsiz | — |
| asosiy natija | raqam bilan, muddat bilan sanaladigan natija (oddiy «natija» so'zi bu ma'noda ishlatilmaydi). Bu modulda uch bo'lak bilan yoziladi — nima sanaladi · hozir · oy oxirida (yozish qolipi, universal qoida emas); uchta — modul topshirig'i. Juftligi — **mehnat raqami** (8-Modul: qilingan ishni sanaydi) | KR, kalit natija |
| tajriba | asosiy natijani o'zgartirish uchun sinab ko'riladigan bitta o'zgarish; OKR ning qismi emas; bitta asosiy natija bilan tekshiriladi (asosiy o'lchov), boshqalariga ham ta'sir qilishi mumkin; yordam berdimi — raqam ko'rsatadi | eksperiment |
| gipoteza | «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin | faraz |
| A/B test · variant A · variant B | odamlarning bir qismi A ni, qolgani B ni ko'radi, raqamlar solishtiriladi; A — hozirgi, B — yangi | split test |
| foiz | qadamdan qadamga o'tganlar foizi: vaqtni tanlagan 100 kishidan nechtasi band qildi (lug'at: «ulush» → «foiz») | ulush, konversiya (kartochkada bir marta mumkin) |
| dashboard | kerakli raqamlarni bir sahifada ko'rsatadigan sahifa; «Maydon»da u har 5 soniyada yangilanadi (`/dashboard`, faqat egaga; 03-FILTR 17); birinchi marta — «dashboard (holat paneli)» (lug'at) | panel, boshqaruv paneli (izohdan tashqari) |
| zaiflik · yopish | kodda begona odam foydalanishi mumkin bo'lgan xato · uni tuzatish | teshik, uyazvimost |
| SQL injection | foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi | — |
| XSS | foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi | — |
| maxfiy kalit | `.env` dagi parol va kalitlar (`JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI`); lug'at: secret → «maxfiy kalit» | «sir» (T-021 — o'quvchi matnida taqiq so'z) |
| 2FA | ikki bosqichli kirish: parol + telefon ilovasidagi 6 xonali kod | ikki faktorli |
| shaxsiy ma'lumot | odamni aniqlashga imkon beradigan ma'lumot (ism, telefon); qonun nomi — so'zma-so'z | personal data |
| sizib chiqish | ma'lumot ruxsatsiz begona qo'lga o'tishi | utechka |
| audit | ro'yxat bo'yicha xavfsizlik va maxfiylik tekshiruvi (6-dars; bu darsda siyosatdagi gapni kod bilan ham solishtiradi); natija — `AUDIT.md`; bo'laklari — «savol», dalilni agent topadi, holatni o'quvchi qo'yadi: joyida · tuzatish kerak · tuzatildi | — |
| ochiq aytish | odamga ma'lumoti bilan nima bo'lishini oldindan aytish (siyosat, forma ostidagi gap); rozilikning o'zi emas (6-dars) | — |
| maxfiylik siyosati | odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa (`/maxfiylik`); «Maydon»ning sodda siyosati to'rt savolga javob beradi: qaysi ma'lumot, nima uchun, kim ko'radi, qancha saqlanadi | privacy policy (kartochkada bir marta) |
| domen · DNS (1-Moduldan) | «Domen — saytning manzili» · «DNS — manzilni topadi» | — |
| HTTPS · SSL | manzil `https://` bilan: yo'ldagi ma'lumot shifrlangan — tarmoqda kuzatayotgan odam mazmunini o'qiy olmaydi; SSL — buni ta'minlaydigan sertifikat (hostinglarda shunday ataladi, ulanish TLS bilan ishlaydi — faqat O'qituvchi eslatmasida) | — |
| monitoring (4c-Moduldan) | saytni to'xtovsiz, kunu-tun kuzatish; **ogohlantirish** — sayt yiqilsa keladigan xabar | alert |
| production · prod | haqiqiy foydalanuvchilar ishlatadigan versiya | jonli versiya (sinonim) |
| Pull Request (PR) · code review | o'zgarishlarni birlashtirishdan oldin ko'rsatish so'rovi · boshqa odam kodni o'qib izoh yozishi (izoh savol ham bo'lishi mumkin; har review kamchilik topmaydi) | merge request, kod ko'rigi |
| vaqt chizig'i | loyihalar qurilgan vaqti tartibida turgan bitta chiziq — har moduldan asosiy loyiha (10-dars; sana shart emas, 10-FILTR) | taymlayn |
| baholash varag'i | pitchni baholash savollari (11-dars); bo'laklari — «savol» («band» — faqat band qilish) | rubrika |
| tarmoq (branch) | git'dagi alohida ish yo'li (`main`, `prod`); birinchi marta — «tarmoq (branch)» (8-dars) | — |
| fidbek | tinglovchining pitchdagi aniq joy haqidagi fikri yoki taklifi: nima yaxshi, nima tuzatiladi (11-dars; code review'da — «izoh») | tanqid |
| halol gap | raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish (11-dars; «qancha odamdan» emas — birlik brauzer yoki band) | — |

## 3. Repo — `maydon` davomi (yozish faqat «qur» da, 9-Modul repo'si yopilgandan keyin)

- Boshlanish: `m10-dars-02-start` = 9-Modulning `dars-11-done` holati. Teglar `m10-dars-NN-start` / `m10-dars-NN-done` (`yechim` tarmog'ida, 9-Modul naqshi).
- «Ortda qoldingizmi»: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-NN-start` (1-blok) yoki `m10-dars-NN-done` (keyingi bloklar).
- Nomlar (kod): jadval `hodisalar` (`id` · `nom` · `brauzer_id` · `yaratilgan`; `variant` — 4-darsdan) · saytda `web/src/hodisa.js` → `hodisaYoz(nom)` · localStorage: `maydon-brauzer`, `maydon-variant` (4-dars) ·
  `.env`: 9-Modul nomlari (`DATABASE_URL`, `EGA_PAROLI`, `JWT_SECRET`, `WEB_ORIGIN`, `VITE_API_URL`, `VITE_UMAMI_ID`) + `EGA_2FA_KALITI` (5-dars).

| Teg | Dars | Repo holati (dars oxirida) |
|---|---|---|
| `m10-dars-02-done` | 2 · hodisalar | `hodisalar` jadvali; `POST /hodisalar` (`nom` uchtadan biri, aks holda 400; `brauzer_id` 1–64 belgi) → 201; saytda `hodisaYoz` uch joyda: `ochdi` — `main.jsx` da, modul darajasida, faqat o'yinchi sahifasida (`/ega`, `/dashboard` hodisa yozmaydi; `useEffect` emas — StrictMode) · `vaqt-tanladi` — `tanla` ichida · `band-qildi` — `saqlandi` ichida (409 da yo'q); Umami qoladi |
| `m10-dars-03-done` | 3 · dashboard | `GET /hodisalar/sanoq?kun=` (`EgaGuard`, tokensiz 401) → `{ kun, hozir, ochdi, "vaqt-tanladi", "band-qildi" }`: har hodisa — shu kun (Toshkent vaqti, `Asia/Tashkent`) bo'yicha `COUNT(DISTINCT brauzer_id)`, `hozir` — oxirgi 5 daqiqa; sayt `/dashboard` (o'z parol formasi, token sahifa holatida — F5 dan keyin parol qayta), har 5 soniyada so'rov, 401 da to'xtaydi; «Yangilandi: HH:MM:SS» qatori |
| `m10-dars-04-done` | 4 · A/B | `variant` ustuni (`A` / `B`, bo'sh bo'lishi mumkin — eski qatorlar); brauzer birinchi kirishda variantni tasodifiy oladi va `maydon-variant` da eslab qoladi; `hodisaYoz` har hodisaga `variant` qo'shadi; A — «Band qilish», B — «{soat} ni band qilish» (masalan «18:00 ni band qilish»); sanoq javobiga `variantlar: { A: { "vaqt-tanladi", "band-qildi", foiz }, B: { … } }` qo'shiladi; dashboard'da A va B foizi |
| `m10-dars-05-start` | 5 · boshlanish | 4-dars holati + ataylab qoldirilgan uch zaiflik (pastda). README: «bu teg prodga chiqarilmaydi» |
| `m10-dars-05-done` | 5 · xavfsizlik | uch zaiflik yopilgan; ega kirishi: **bitta `POST /kirish { parol, kod }`** — token faqat parol va 6 xonali kod (`EGA_2FA_KALITI`) ikkalasi Backend'da tekshirilgach (401 — qaysi biri xato aytilmaydi); saytda forma ikki qadamli; kalitni telefon ilovasiga qo'shish — bir martalik buyruq, README da |
| `m10-dars-06-done` | 6 · audit | `AUDIT.md` (savol · dalil · holat; holatni o'quvchi yozadi); saytda `/maxfiylik`; forma ostida havola va bir qator; o'yin kunidan 30 kun o'tgan bandlar va 60 kundan eski hodisalar o'chiriladi (ishga tushganda va har 24 soatda, `WHERE` bilan) |
| `m10-dars-07-done` | 7 · deploy | `GET /health` → `{ holat: 'ok' }` — **Database'ga so'rov yo'q** (GATE M M-q1 A: UptimeRobot har 5 daqiqada so'raydi, Database ham so'ralsa bepul Neon limiti oy tugamasdan tugashi mumkin — soddalashtirilgan hisob; Database xatosi dashboard va sayt xabarida ko'rinadi); README «Monitoring» (UptimeRobot: sayt va `/health`, 5 daqiqa, email + telefon ilovasi; bepul limitlar); Netlify nomi o'zgarsa Render'da `WEB_ORIGIN` yangilanadi |
| `m10-dars-08-done` | 8 · prod 1 | `prod` tarmog'ida (birlashtirilmagan): so'rovlar chegarasi (`POST /bandlar`, `POST /kirish`, `POST /hodisalar`), xato va kutish holatlari (qayta so'rov ustma-ust emas), A/B yakuni — hozircha B qoladi (isbot emas), README — olti qism; prod ro'yxatining «keyin» guruhida — laptop tekshiruvlari va `synchronize` (eski teg prodga yuborilmaydi, migratsiya — keyingi modullarda; GATE M M-q2 A) |
| `m10-dars-09-done` | 9 · code review | Pull Request orqali birlashtirilgan (Mentor repo'sida `prod` → `yechim`; upstream `main` — bo'sh boshlang'ich holat, tegilmaydi; o'quvchi o'z fork'ida `prod` → `main`, «base repository» — o'z fork'i); review topgan bitta tuzatish; `REVIEW.md` (Joy · Izoh · Sabab · Qaror) |

**5-dars zaifliklari** (`m10-dars-05-start`, hikoya: «agent tez qo'shgan uch o'zgarish — siz tekshirasiz»):
1) ega sahifasidagi telefon bo'yicha qidiruv Database'ga so'rovni matnni qo'shib yasaydi → SQL injection; yopish — parametrli so'rov (TypeORM).
2) ega ro'yxatida ism HTML sifatida chiqariladi → XSS; yopish — ism oddiy matn bo'lib chiqadi (React buni o'zi qiladi).
3) `JWT_SECRET` yo'q bo'lsa kodda zaxira qiymat (`'zaxira-kalit'` — haqiqiy kalitga o'xshamaydigan namuna) ishlatiladi → maxfiy kalit kodda turibdi; yopish — zaxira olinadi, kalit bo'lmasa Backend ishga tushmaydi.
**Start teg — qattiq qoida:** `m10-dars-05-start` faqat laptopdagi mashq uchun; uni push qilish va Render'ga chiqarish taqiq (A1 1-qadamda o'quvchiga ochiq aytiladi).
**Xavfsizlik darslari qoidasi (5, 6):** faqat himoya tomoni — zaiflik turi → nega xavfli (bir gap) → kodda qanday topiladi → qanday yopiladi. Hujum qatorlari va boshqa saytni tekshirish yo'riqlari yozilmaydi.
Darsda bir marta: «Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.» 5-darsda push — faqat zaifliklar yopilgandan keyin (Render va Netlify push'dan keyin o'zi yangilanadi).
Mentor misoli PR'i (9-dars) GitHub'da turadi — repo push qilingandan keyin, foydalanuvchi buyrug'i bilan.

## 4. Darslar — qisqa topshiriq

| № | Fayl (MD) | Tip · qolip | Darsning bitta natijasi | Eng yaqin namuna (9-Modul, tasdiqlangan) |
|---|---|---|---|---|
| 1 | `01-PmOkr-v3.md` | PM | keyingi oyga OKR (maqsad + 3 asosiy natija) va unga ulangan birinchi tajriba (o'z loyihasi) | `12-PmUserStoryPitch-v3.md` |
| 2 | `02-EventTracking-v3.md` | TEX (cho'qqi) | uch hodisa Database'da; Umami bilan solishtirildi | `04-MvpArchitecture-v3.md` · `05-Animation-v3.md` |
| 3 | `03-LiveDashboard-v3.md` | loyiha kuni: 8 ekran + 3 blok + kartochkalar = 12 | dashboard o'zi yangilanadi: oxirgi 5 daqiqa + uch qadam | `07-MvpFirstScreen-v3.md` |
| 4 | `04-PmAbTest-v3.md` | PM+PRAKT: 12 ekran (kartochkalar alohida) | gipoteza yozilgan, B varianti ishga tushgan | `06-PmAnalyticsDayOne-v3.md` |
| 5 | `05-SecurityBasics-v3.md` | TEX | uch zaiflik yopilgan + 2FA | `04-MvpArchitecture-v3.md` |
| 6 | `06-PmTrustAudit-v3.md` | PM+PRAKT: 12 ekran (kartochkalar alohida) | `AUDIT.md` + saytda `/maxfiylik` | `08-PmDesignMotion-v3.md` |
| 7 | `07-ProductionDeploy-v3.md` | TEX | HTTPS tekshirilgan, `/health`, UptimeRobot ogohlantirishi | `04-MvpArchitecture-v3.md` |
| 8 | `08-ProdUpgrade-v3.md` | loyiha kuni: 8 + 3 + kartochkalar = 12 | eng yaxshi loyiha prod ro'yxati bo'yicha | `09-MvpComplete-v3.md` |
| 9 | `09-ProdReview-v3.md` | loyiha kuni: 8 + 3 + kartochkalar = 12 | PR + code review + birlashtirish; har qaror tushuntirilgan | `11-MvpIteration-v3.md` |
| 10 | `10-PmYearPath-v3.md` | PM | yilning vaqt chizig'i: bo'ldi → bo'ldi → keyin nima | `01-PmProductProblem-v3.md` |
| 11 | `11-PmPitchRehearsal-v3.md` | PM | 5 daqiqalik pitch, juftlikda baholangan va tuzatilgan | `12-PmUserStoryPitch-v3.md` |

Format — `konveyer/1-MD.md` (namuna `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md`). PM+PRAKT: PM nazariya → darhol 2 amaliyot bloki → yakuniy test → podium → yakun.
Loyiha kuni: 8 ekran + 3 blok (P-058). Amaliyot blokida Mentor misoli repo'da; oxirgi qadam — «O'z g'oyangiz» (9-Modul M-q1). Uyga vazifa — yakun kartasida, `.homework.jsx` yo'q.
Oldingi/keyingi dars — App.jsx dan: 1-darsdan oldin `m7-12` «Pitchingizda kimning hikoyasi bor?» (orada `m7-13` zaxira); 11-darsdan keyin — «Zaxira dars».
Real odam bilan ish: darsda sinfdosh bilan juftlikda, real odam — uyga; natija keyingi darsda (qaror 11). 4-dars A/B natijasi 5-dars kirishida bir qatorda eslatiladi, yakuni — 8-dars.

**10-dars uchun loyihalar** (dastur v9 modul nomlari; App.jsx kod raqami 1–4 = LMS 2–5, 4a/4b/4c = LMS 6, 5 = LMS 7, 6 = LMS 8, 7 = LMS 9):
LMS 2 HTML-CSS — portfolio sayt · 3 JavaScript — mini-do'kon, MVP deploy · 4 React — AvtoIjara · 5 Node + PostgreSQL — AvtoStoyanka · 6 NestJS, test, CI/CD — KitobShop, avtomatik lenta ·
7 Botlar — AvtoPizza boti (bot + Database + AI; repo `TelegramBotNest`) · 8 To'liq tizim — to'liq pipeline, mobil ilova, to'liq tizim (App.jsx `m6-08`, `m6-11`, `m6-13`) · 9 — o'z MVP si (Mentor misoli Maydon) · 10 — o'sha MVP prodda.
(05.10 tuzatish: AvtoPizza faqat `src/5-Modull` da — LMS 7; avval 8-modul deb yozilgan edi.)
LMS 1 (Foundation) App.jsx da yo'q — o'quvchi o'zi qo'shadi. Aniq loyiha nomlari App.jsx `Proyekt` qatorlaridan; o'quvchi o'zinikini belgilaydi.

## 5. Keyslar — faqat K1–K19 banki (`PM_Prompt_v8.md` «Банк проверенных кейсов», PM-016, PM_DARS_ETALON 4.10)

Qonun: PM darsida faqat bankdagi keys; bankdan tashqari keys, raqam, sana va manba o'ylab topilmaydi; mos keys bo'lmasa — keyssiz (zaxira hook).
Raqam faqat yili bilan; «raqamsiz» keysga raqam qo'shilmaydi; pul summasi — foizda yoki so'z bilan (atamani tushuntirish uchun kerak bo'lsagina summa). Brend birinchi ko'rinishda bir qatorli izoh bilan (S-018).

| Dars | Keys (bank) | Nega shu | Bankdagi raqam |
|---|---|---|---|
| 1 · OKR | keyssiz — bankda OKR mavzusi yo'q | — | — |
| 4 · A/B | **K9 Booking.com** — «deyarli har o'zgarish avval foydalanuvchilarning bir qismida tajriba bilan tekshiriladi» | mavzusi: A/B test · gipoteza · tajriba · metrika; Booking — mehmonxona band qilish sayti, «Maydon» ham band qilish | bir vaqtda 1000 dan ortiq A/B test (kompaniya chiqishlari, 2017) |
| 6 · ishonch | keyssiz — bankda ma'lumot sizib chiqishi haqida keys yo'q | — | — |
| 10 · yillik yo'l | **K1 Uzum** (mintaqaviy) — 2022-yil oktabr: ishga tushdi, saytdan emas, yetkazib berishdan boshladi → 2024-yil mart: mamlakatning birinchi «unicorn»i (tashqi tasdiq: TechCrunch, 25.03.2024 — 10-FILTR) | «bo'ldi → bo'ldi → keyin nima» yo'li sanalar bilan; mintaqaviy keys qoidasi (har 8-darsda kamida bir) | «unicorn» = bahosi 1 mlrd dollardan oshgan kompaniya (oldingi darslardagi yozilish — `m2-02`, `m4a-02`) (atamani tushuntirish uchun summa aytiladi) |
| 11 · pitch | **K12 Airbnb pitch deck** — investorlar uchun birinchi taqdimot: o'nga yaqin oddiy slayd, muammo → yechim → bozor → mahsulot → jamoa | mavzusi: pitch tuzilmasi · storytelling | raqamsiz |

- 5-Modulda (LMS 7) K9 Booking keysi `m5-14` da bor edi («A/B» so'zisiz). Qoida — bosh-keys **modul ichida** takrorlanmaydi; 10-Modulda u faqat 4-darsda.
- TEX va loyiha kunlari (2, 3, 5, 7, 8, 9) — keyssiz.
- 05.10 da tekshirilgan, lekin bankda yo'q keyslar (Google OKR — Doerr 1999 · Obama 2008 A/B · Facebook 2021, 533 mln) — **ishlatilmaydi**; bankka qo'shish — jurnal «MEXANIZM-TAKLIF» 2.

## 6. Tekshirilgan faktlar (05.10.2026; agent boshqacha yozmaydi)

- **Qonun (6-dars):** O'zbekiston Respublikasining «Shaxsga doir ma'lumotlar to'g'risida»gi Qonuni, O'RQ-547, 2019-yil 2-iyul, kuchga kirgan — 2019-yil 1-oktabr (lex.uz/docs/4396419).
  4-modda — ta'rif; 18-modda — ishlov berish shartlari, odamning roziligi ulardan biri; 17-modda — maqsadga erishilganda ma'lumot yo'q qilinadi. Dars yuridik maslahat bermaydi —
  asosiy fikr: ochiq aytish, kerakli minimum, maqsad tugasa o'chirish (06-FILTR 1: ochiq aytish rozilikning o'zi emas; rozilik kerak bo'lgan joyda alohida olinadi).
- **GDPR:** Yevropa Ittifoqi qoidasi, 2018-yil 25-maydan; telefon raqami ham shaxsiy ma'lumot. Dasturda 5-darsda — mavzu bo'yicha 6-darsda beriladi.
- **UptimeRobot bepul rejasi:** 50 monitor, 5 daqiqada bir tekshiruv; ogohlantirish — email va telefon ilovasi (Android, iOS); **Telegram bepul rejada yo'q**; bepul rejani tijorat loyihasida ham ishlatsa bo'ladi («The free plan can be used for business, commercial, and revenue-generating projects» —
  help.uptimerobot.com/en/articles/11604710, 28.09.2026 yangilangan, 05.10 o'qildi; avvalgi «shaxsiy, notijorat» yozuvi eskirgan edi — 07-FILTR 2).
- **Netlify:** `*.netlify.app` manzilda HTTPS o'zi yoqilgan; o'z domeni ulansa sertifikatni o'zi oladi (Let's Encrypt, DNS to'g'ri ko'rsatilgach). DNS o'zgarishi «several hours», ba'zan «a full day» tarqaladi
  (docs.netlify.com/manage/domains/configure-domains/configure-external-dns, 05.10) — darsda «vaqt ketishi mumkin», maket «vaqt tezlashtirilgan».
- **Render bepul rejasi:** 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa. UptimeRobot har 5 daqiqada so'rasa, Backend uyg'oq turishi mumkin — bu bepul rejadagi narxi (750 soatdan sarflanadi), darsda halol aytiladi.
  Render bepul xizmatni production uchun tavsiya qilmaydi: «Do not use them for production applications» (render.com/docs/free, 05.10) — 7-dars 1-ekranida bir qator.
  **Limit:** oyiga 750 soat — butun workspace, hamma bepul xizmatlar uchun umumiy; tugasa hamma bepul xizmatlar oy oxirigacha to'xtaydi (render.com/docs/free, 05.10).
  Bitta doim uyg'oq xizmat ≈730–744 soat — sig'adi; ikkinchisi (masalan 7-Moduldagi bot) ham uyg'oq bo'lsa — sig'maydi.
- **Neon bepul rejasi:** 100 CU-soat / loyiha / oy; 5 daqiqa so'rovsiz — compute o'chadi (bepul rejada o'chirib bo'lmaydi); CU-soat tugasa compute keyingi oygacha to'xtaydi;
  bepul compute 2 CU gacha kattalashadi; 0,25 CU doim yoniq ≈182 CU-soat/oy — limitdan oshadi (neon.com/pricing, 05.10). Demak Database'ga har 5 daqiqada so'rov yuboradigan monitoring bepul limitni oy tugamasdan tugatishi mumkin
  (darsda «soddalashtirilgan hisob», aniq kun va'da qilinmaydi — 07-FILTR 5)
  (7-dars, GATE M savoli). Dashboard ochiq turganda ham Database uyg'oq — bu odatdagi ish, kamdan-kam.
- **2FA kodi (TOTP):** 6 xonali, odatda 30 soniyada yangilanadi; ilova — Google Authenticator, Microsoft Authenticator yoki shunga o'xshash.

## 7. 9-Modul tashqi auditidagi takroriy xatolar (MD yozishda oldindan tuzatiladi)

1. Mutlaq gap → chegaralangan gap: «bu misolda», «bizning MVP da», «bu darsda».
2. Agent kafolati yo'q: agent «talabga tayanib quradi, taxmin qilishi mumkin»; natijani o'quvchi o'zi tekshiradi. «Darrov», «har doim», «100%» yo'q.
3. Raqamlar bir o'lchovda: sanoq sharti aytiladi (har qadamda turli brauzerlar soni); har xil o'lchovdagi sonlar ayirilmaydi. O'z tizimimizda bu shart kodda bor — 9-Modul 6-darsidagi farqqa ko'prik.
4. Ta'rif bitta va dars bo'yi so'zma-so'z; mezon to'g'ri.
5. Keys raqami manbadagi so'z bilan; da'vo «… hisobi bo'yicha» kabi yumshatiladi.
6. Testlar: variantlar uzunligi teng, kalit so'z faqat to'g'rida emas, distraktor ishonarli; to'g'ri izohi «To'g'ri!» so'zisiz.
7. Qoida bo'yicha qoladi (auditda rad etilgan): Reja sarlavhasi — natija-gap · hook javobi «Aynan!» / «Qiziq fikr!» · kod ekrani sarlavhasi (§19/§48).
8. «kompilyator: … oyna» ta'rifi yozilmaydi (lug'at — «kod oynasi»).
9. Qaysi qiymat maxfiy, qaysi emas — aniq aytiladi (masalan Umami ID maxfiy emas, `JWT_SECRET` va `EGA_2FA_KALITI` — maxfiy kalit).

## 8. Darslar orasida saqlanadigan natija (kalit `pm-m8dN-<nima>`)

Qoida (9-Modul M-q5): dars oldingi dars natijasini o'qiydi; yo'q bo'lsa — o'quvchi o'zi yozadi (erkin qator).

| Kalit | Yozadi | O'qiydi | Tarkib |
|---|---|---|---|
| `pm-m7d3-muammo` (9-Modul) | — | 1-dars (maqsad), 11-dars | muammo gapi |
| `pm-m7d12-pitch` (9-Modul) | — | 11-dars (1 daqiqalikdan 5 daqiqalikka) | 9-Modul pitchi |
| `pm-m8d1-okr` | 1-dars | 4-dars (gipoteza qaysi asosiy natijaga), 11-dars | `{ maqsad, natijalar: [{ nima, hozir, maqsad }] × 3, tajriba }` |
| `pm-m8d4-gipoteza` | 4-dars | 8-dars (A/B yakuni), 11-dars | `{ agar, ozgaradi, chunki, olchov }` |
| `pm-m8d6-audit` | 6-dars | 8-dars | `{ savollar: [{ savol, holat }] }` — holat: `joyida` · `tuzatish kerak` · `tuzatildi` |
| `pm-m8d10-yol` | 10-dars | 11-dars | `{ loyihalar: [{ modul, nom, nima }], keyin, keyinModul }` — `keyinModul`: keyingi qadam qaysi loyihadan o'sgani (10-FILTR 4) |
| `pm-m8d11-pitch` | 11-dars | keyingi modul (Demo Day) | `{ slaydlar: { muammo: { raqam, hikoya }, yechim, foydalanuvchi, raqamlar: { bosh: { nima, oldin, hozir }, ab: { a, b }, halolGap }, keyingi }, vaqt, varaq: [{ slayd, belgi, izoh }], tuzatildi: [slayd] }` (11-FILTR) |

Yangi kalit kerak bo'lsa — MD oxiridagi «TAYANCHGA SAVOL» ga yoziladi.

## 9. 1-to'lqin kelishuvlari (01–03 MD dan, 05.10.2026 — 4–11-darslar shunga tayanadi)

1. **PM darslaridagi kod mexanikasi (PM_DARS_ETALON 26-qonun: ketma-ket PM darslari bir xil koding-mexanikani takrorlamaydi).**
   Ketma-ketlik: `m7-12` (JS funksiya, kod oynasi) → `m8-01` → `m8-04`, `m8-06` (repo bloklari) → `m8-10` → `m8-11`.
   `m8-01` dagi JS funksiya (`foiz()`) — `m7-12` bilan bir xil mexanika → GATE M savoli (tavsiya: Neon SQL Editor — bosh raqamni `bandlar` jadvalidan sanash).
   `m8-10` — JS funksiya kod oynasida mumkin (oldingi PM darsi — bloklar); `m8-11` — `m8-10` dan boshqa mexanika (Neon SQL yoki VS Code-topshiriq).
2. **Talab zinapoyasi (amaliyot bloklari).** 3-dars: A1 — tayyor talab + bitta joy · A2 — bitta qator · A3 — uch qator. 4, 6 (PM+PRAKT): A1 — tayyor talab + bitta joy, A2 — bitta qator.
   8, 9: uch qatorni o'quvchi yozadi, namuna «Yordam» ortida. Har blokning 5-qadami — «O'z g'oyangiz».
3. **Sanoq.** 1-darsda — mashq sharti («har kishi bir marta»); 2-darsdan — o'z tizimimiz, «har qadamda turli brauzerlar soni». Umami bilan solishtirishda Umami tomonidan — **Visitors** (Umami sessiyalari, o'z hash usuli) —
   bizning turli brauzer ID ga yaqin, lekin **bir xil o'lchov emas**: sonlar teng bo'lishi shart emas, «qaysi biri xato» deyilmaydi (02-FILTR 1).
4. **A/B yakuni (8-dars)** — B ishga tushgandan beri (4-darsdan, `variant IS NOT NULL`) sonlar Neon SQL Editor'da bitta SQL bilan (dashboard faqat bugunni ko'rsatadi, kun almashtirgichi yo'q).
5. **4-dars A/B natijasi** 5-dars kirishida bir qatorda eslatiladi; to'liq yakuni — 8-dars.
6. **Xavfli buyruqlar.** `DELETE` / `DROP` faqat `WHERE` bilan va faqat tekshiruv qatorlariga (`brauzer_id = 'tekshiruv'`); butun jadvalni tozalash yozilmaydi.
7. **Namuna brauzer ID lar** har ekranda o'ziniki (`7f3a…`, `3f2c…` kabi), statistika emas — Mentor raqamlari faqat 1-bo'limdan.
8. **`pm-m8d1-okr` tarkibi:** `{ maqsad, natijalar: [{ nima, hozir, oyOxirida }] × 3, tajriba: { nima, natija } }` — `hozir` «?» bo'lishi mumkin (o'quvchi hozirgi raqamni bilmasa);
   `tajriba.natija` — asosiy natija tartib raqami (1–3). 4-dars gipotezasi shu tajribadan boshlanadi; «?» bo'lsa — o'quvchi o'zi yozadi.
9. **`pm-m7d6-qadamlar`** (9-Modul 6-dars: `{ asosiy, oldingi, hodisa }`) — 2-dars A1 5-qadami o'qiydi; yo'q bo'lsa o'quvchi o'zi yozadi.
10. **Uyga vazifa:** loyiha kunlarida (3, 8, 9) — yo'q (P-058); TEX va PM darslarida — yakun kartasida, o'z loyihasi bo'yicha.
11. **Laptop va Render bitta Neon Database'ga yozadi** — o'quvchining o'z tekshiruv bosishlari ham sanaladi; 8-dars prod ro'yxatida bir qator (tekshiruvni boshqa kunda yoki tekshiruv yozuvlarini ajratish).
12. **2-to'lqin kelishuvlari (04–11 MD dan):** `POST /hodisalar` — `variant` faqat `A`, `B` yoki bo'sh (boshqasi 400) · `foiz` butun songa yaxlitlanadi, hech kim tanlamasa 0 ·
    5-dars SQL injection — `m10-dars-05-start` dagi yangi yo'l `GET /bandlar/qidir?telefon=` (faqat token bilan) · kod oynasida parametrli so'rov xom SQL `$1` bilan, repo'da TypeORM `find({ where })` — ikkalasi bir g'oya, darsda bir gap bilan ulanadi ·
    8-dars so'rovlar chegarasi: `POST /kirish` 5 · `POST /bandlar` 10 · `POST /hodisalar` 60 — bir daqiqada, bitta manzildan; o'yinchi yozuvi «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» ·
    8-dars A/B yakuni: variant tanlash olib tashlanadi, B matni qoladi; Backend `variantlar` hisobi tarix uchun qoladi · 9-dars «Ortda qoldingizmi»: `git checkout -f -B prod <teg>` · `git push -f -u origin prod` ·
    6-dars: o'chirish Backend ishga tushganda va har 24 soatda (Toshkent vaqti); siyosat havolasi yangi oynada; uyda real odamlar ism va telefon o'rniga namuna yozadi (4-dars) · oy nomlari — «oktabr».
13. **GATE M javobi (05.10, `10M-GATE-1`, hammasi A):** M-q0 — 1-dars kodi Neon SQL (bosh raqam `bandlar` dan; 11-dars — shu SQL takrori + OKR'dagi «hozir» bilan solishtirish) ·
    M-q1 — `/health` Database'siz (bepul Neon limiti; Database xatosi dashboard va sayt xabarida; tanlovning narxi darsda halol aytiladi) · M-q2 — `synchronize` 8-dars «keyin» guruhida, kod o'zgarmaydi.
14. **3-dars Filtri (05.10):** dashboard yorlig'i «Oxirgi 5 daqiqada» (kodda `hozir`) · sayt kirgan zahoti bir marta so'raydi, keyin har 5 soniyada; oldingi so'rov tugamagan bo'lsa — ustma-ust yubormaydi ·
    «5 soniya ichida» kafolat sifatida yozilmaydi — «keyingi so'rovdan keyin» · 5 soniya — MVP tanlovi, «optimal» emas · «Yangilandi» — oxirgi javob kelgan vaqt, raqam to'g'riligi emas ·
    REPO tekshiruvi: 23:59 va 00:01 dagi hodisalar Toshkent kuniga to'g'ri tushadi.
15. **5-dars Filtri (05.10):** 2FA — bitta `POST /kirish { parol, kod }`, token faqat ikkalasi tekshirilgach (sayt formasi ikki qadamli, xavfsizlik formaga tayanmaydi) ·
    TOTP kutubxonasi va kalit yaratish yo'li — «qur» dan oldin asosiy seans tanlaydi va rasmiy hujjatdan tekshiradi, repo agenti tanlamaydi (P-060 — promptda nomi yo'q, README'da bor) ·
    «zaiflikni kodni o'qib topamiz» — «bu darsda»; «yopildi» — bugun topilgan aniq naqsh, butun sayt xavfsizligi emas · XSS xulosasi — shu ro'yxat va `dangerouslySetInnerHTML` bilan cheklangan ·
    o'z loyihasi promptida — aniq bitta so'rov joyi («har so'rov» emas) · auth promptida «so'rov o'tmasa ham ishlasin» yo'q — «kirish muvaffaqiyatsiz bo'lsa ichkari ochilmasin».
16. **6-dars Filtri (05.10):** uch fikr — ochiq aytish · kerakli minimum · maqsad tugasa o'chirish (havola va siyosat rozilik deb atalmaydi) ·
    `hodisalar` saqlash muddati — **60 kun** (GATE M 06-q0 A; oy maqsadi + o'tgan oy, 8-dars A/B yakuni sig'adi), siyosatda ochiq yoziladi · siyosat Umami'ni ham nomlaydi («ism va telefon yuborilmaydi», boshqa da'vosiz) ·
    siyosatdagi muddat — «30 kun saqlanadi, keyin o'chiriladi» (aniq soat emas: Backend uxlasa, o'chirish uyg'onganda) · 30 kun — kursda tanlangan muddat, qonun talabi emas ·
    `AUDIT.md` da dalilni agent topadi, holatni o'quvchi yozadi · ism va telefon bitta joyda saqlanadi (`bandlar`), ega sahifasi ko'rsatadi · «maxfiylik siyosati» ta'rifi — «Maydon»ning sodda siyosati bilan cheklangan ·
    yangi oyna — «Maydon» tanlovi; o'z loyihasi promptida maqsad bilan («forma to'ldirilganicha qolsin»).
17. **7-dars Filtri (05.10):** prod — kurs ta'rifi qoladi, lekin «bepul rejalar uzluksiz ishlashni va'da qilmaydi; Render bepul xizmatni prod uchun tavsiya qilmaydi» (1-ekran) ·
    monitoring — «saytni siz o'rningizga so'rab turadi va javob bo'lmasa xabar beradi»; menyu osti ham «sayt yiqilsa, ogohlantirish sizga keladi» (GATE M 07-q0 A) ·
    Neon 17-kun — «soddalashtirilgan hisob» · `/health` — «Backend javob beryaptimi», Database/band/kirishni isbotlamaydi · UptimeRobot so'rovlari — «bepul rejadagi narxi», «yon ta'sir» emas ·
    tashqi interfeys yozuvlari — vazifa + «hozir: …» (Netlify, Render, UptimeRobot); Chrome «Connection is secure» — namuna, qabul sharti emas · o'z domeni: DNS va sertifikat vaqt oladi ·
    **push odati (5-darsdan):** `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil; shularni `git add` bilan qo'shish (`git add .` / `-A` emas) — 5, 6, 7, 8, 9-darslar; 3, 4-darslar 9-Modul odatida.
18. **8-dars Filtri (05.10):** prod ro'yxati ta'rifi — «Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati.» («ochishdan oldin» emas — «Maydon» 9-Modulda chiqqan) ·
    «production darajadagi», «Prodga tayyor», «Prod Ready» — darslarda hukm sifatida yo'q (bepul Render, `synchronize` «keyin» — M-q2 A); natija — «prod ro'yxati bo'yicha yaxshilandi» ·
    so'rovlar chegarasi IP manzilni sanaydi, odamni emas (bir Wi-Fi — bitta manzil bo'lishi mumkin; «Maydon»da ega bitta — sodda IP chegarasi yetadi) ·
    **chegara mexanizmi va Render proksi orqasida IP olish usuli — «qur» dan oldin asosiy seans muzlatadi** (rasmiy hujjat yo'q; forum: Render mijoz `X-Forwarded-For` qiymatini tozalamaydi — o'z xizmatida tekshiriladi);
    tekshiruv so'rov ishlovidan oldin; qat'iy bir daqiqalik oyna; `429` tanasi bitta `xabar` · holat nomi «kutish holati» («Backend uyg'onmoqda» emas — sayt sababni bilmaydi);
    qayta so'rov ustma-ust ketmaydi · A/B — «B ishga tushgandan beri» (`variant IS NOT NULL`), «bir haftalik» emas; «hozircha B qoladi» — mahsulot qarori, isbot emas;
    foiz — shu oqimda vaqt tanlaganlardan band qilganlar · README — «olti qism» («to'liq» emas) · `prod` push internetdagi saytni o'zgartirmasligi — «bizning sozlamada».
19. **9-dars Filtri (05.10):** review kamchilik topmasligi ham normal — izoh savol, taklif yoki kamchilik; topilmasa Mentor bergan kamchilik (`/ega` yuklanish holati) tuzatiladi; izoh qolipi (Joy · Nega muhim · Taklif) — bu darsniki ·
    «Approve» birlashtirish sharti emas (zaxira — mentor «ko'rdim») · «Backend'ga kelgan har so'rovga» («har so'rovni ko'radi» emas) · `-f` push — faqat mentor bilan, accent ogohlantirish ·
    birlashtirishdan oldin «Files changed»da `*.entity.ts` yo'qligi tekshiriladi (`synchronize: true` — M-q2 A, GATE M 09-q0 A: kod o'zgarmaydi) · `/ega` qayta so'rovi o'yinchi sahifasidagi yordamchi bilan, ustma-ust emas.
20. **10-dars Filtri (05.10):** chiziqda **har moduldan asosiy loyiha** («hammasi» emas) · darsda kamida beshta to'liq loyiha + keyingi qadam, qolgani uyda · `pm-m8d10-yol.keyinModul` ·
    keyingi qadam tanlovi — mahsulot qarori, suhbat soni («2 / 5») — dalillardan biri · «chiziqdan o'sadi» = oldingi loyiha, kuzatuv, raqam yoki tugallanmagan ishdan ·
    o'quvchi matnida «server» yo'q («Backend yozib…») · 10-modul «O'rgandim» — «hodisalarni sanab, gipotezani raqam bilan tekshirish» · avtomatik tekshiruv matnlari — «… o'xshaydi» (taxmin, hukm emas) ·
    Uzum hikoyasi — bank (TechCrunch 25.03.2024 bilan tasdiqlandi), «ko'pincha» bilan.
21. **11-dars Filtri (05.10):** Raqamlar slaydi — ikki blok: **bosh raqam** (oldin → hozir, «haftada 6 dan 11 ga», maqsad 20) va **A/B** (A va B) + bitta halol gap — o'lchovlar aralashmaydi ·
    `pm-m8d11-pitch.slaydlar.raqamlar` = `{ bosh: { nima, oldin, hozir }, ab: { a, b }, halolGap }` · Database yo'q bo'lsa dashboard/Umami soni bosh raqam o'rniga qo'yilmaydi — bor raqam va manbasi ·
    o'quvchi SQL soni — «`bandlar` ga yozilgan bandlar, ichida tekshiruvlar ham bo'lishi mumkin» (o'yin kuni emas, yozilgan vaqt) · har slaydga ≈1 daqiqa — mashq taqsimoti ·
    13-ekran natijasi — «eng zaif slayd tuzatildi», qolgan ✗ — uyda · Airbnb tartibi — misol, umumiy qoida emas · AvtoPizza testida «necha kishidan» emas — «nima sanalgani».
22. **9-Modul pilot qoidalari (05.10, foydalanuvchining qat'iy qoidalari — `QURUVCHI_SABOQ.md`):** kartochkalar alohida ekran (loyiha kuni va PM+PRAKT — 12 ekran) · test yorlig'i yo'q ·
    navbatdagi harakat doim ko'rinadi, bashorat tanlangach yopilmaydi · kartada rangli yon chiziq yo'q (to'liq holat — yashil ✓) · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda, jonli sahna ·
    voqea ekranida bosqich gapini Mentor aytadi · «bot» odamga nisbat berilmaydi («Telegram bot») · MD matnini quruvchi o'zgartirmaydi — taklif yozadi. 11 MD ga 05.10 tunda qo'llandi (F-1005-167).

