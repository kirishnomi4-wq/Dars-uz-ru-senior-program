# 12-Modul (kod: `src/10-Modull`) · 7-dars (PM + amaliyot) «50 foydalanuvchiga qanday yetasiz?» — MD v3

Fayl: `src/10-Modull/PmFiftyUsersLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-07` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; tayanch 4 «PM+PRAKT») · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · brend nomi o'z rangida, tanish maketda (telefon · brauzer · chat) · ekranga kirganda bo'sh element yo'q ·
ekranda ≤ 3 blok · telefon yoki brauzer maketi chapda, jadval o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 8-ekran — **A** (`correctIdx 0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 403–405, DE-205): `m10-06` «Birinchi foydalanuvchilar sizni qayerdan topadi?» → **`m10-07` «50 foydalanuvchiga qanday yetasiz?»** (osti: «yig'ish rejasi va ishga tushirish», `type: 'PM'`) → `m10-08` «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?».
Tur (PM-005): **gibrid — PM qismi 2-tur (sof PM: artefakt — o'quvchining uch bosqichli rejasi) + amaliyot (repo, ikki blok)**. Namuna tuzilmasi — 10-Modul `06-PmTrustAudit-v3.md` va 11-Modul `13-PmAudienceTest-v3.md` (PM+PRAKT, 12 ekran) hamda ularning FILTR fayllari.
Keys — **keyssiz** (tayanch 5, Qaror-0 22). REPO — `maydon-jamoa` (`m12-dars-07-start` = `m12-dars-06-done` → `m12-dars-07-done`).
**Vaqt: ≈ 90 daqiqa** — kirish va reja ≈ 4 · 2–4-ekranlar ≈ 14 · o'z rejasi ≈ 8 · Amaliyot 1 (ilova: ma'lumot va o'lchov) ≈ 22 · Amaliyot 2 (siyosat va havola — o'rnatish fayli navbatda turgan paytda) ≈ 22 · yakuniy savol, podium, kartochkalar, arena ≈ 12 · zaxira ≈ 8. Har blokda «Ulgurmasangiz» yo'li; navbat dars oqimini to'xtatmaydi (A-bo'lim 8, tayanch 9.3). ⚠️ 07-FILTR 7, 8: auditor A1 ni 35–50, A2 ni 30–45 daqiqa deb baholadi — 90 daqiqaga sig'ishi «qur» pilotida taymer bilan o'lchanadi; hajm savoli — GATE M M-q2 (brauzer ko'rinishini 8-darsga ko'chirish).
Manba: `00-MODUL-TAYANCH.md` (06.10 14:15 holati; 1.0 — boshlanish nuqtasi · 1.6 — kanallar, post, olti bandli xavfsizlik ro'yxati, 6-dars uyga vazifasi (o'tilgan deb) · **1.7 — reja, sanoq, uch tekshiruv, A1, A2, APK, iPhone, ikkinchi post, natija — AYNAN** · 1.10 — sanoq SQL · 1.13 — sonlar jadvali · 2 — atamalar · 3 — repo, `.env`, teg 07 · 4 — PM+PRAKT · 6 — EAS, brauzer ko'rinishi, Umami · 7 — oldindan tuzatiladigan sinflar · 8 — `pm-m10d7-reja` · 9.3–9.12 — to'lqin kelishuvlari) ·
`GATE_M_JAVOB.md` (Qaror-0 10, 11, 12, 13, 14, 16, 17) · `00-TAQIQLAR.md` (2-bo'lim to'liq) · `00-MANBA.md` 5 · 11-Modul tayanchi (1.7, 2, 3, 9.2, 9.3, 9.29, 9.34, 9.74, 9.81, 9.82, 9.88, 9.90) · 10-Modul `02-EventTracking-v3.md` (`hodisaYoz`), `06-PmTrustAudit-v3.md` (ma'lumot auditi, siyosat to'rt savoli).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur: «GIBRID: yig'ish rejasi yoziladi VA ishga tushadi; natija — 20 foydalanuvchi + 50 gacha reja harakatda»; tayanch 4):**
   o'quvchi 50 foydalanuvchiga uch bosqichli rejasini yozadi; ishga tushirishdan oldingi uch tekshiruvni (ma'lumot · o'lchov · havola) agent bilan bajaradi — Amaliyot 1 da ilova ichida (ma'lumot va o'lchov, oxirida o'rnatish fayli tayyorlana boshlaydi), Amaliyot 2 da ilovadan tashqarida (siyosat, brauzer ko'rinishi, havola); havolani lendingga qo'yib, ikkinchi postni Mentorga ko'rsatadi (Mentor aytsa — sinf chatiga; tayanch 9.38); dars oxirida ikki sonni sanaydi.
   Saqlanadi: `pm-m10d7-reja` (8, 10-darslar o'qiydi). Repo'da (tayanch 3, `m12-dars-07-done`): `telefon` → `login`, `namuna`, `yaratilgan` · «Hisobni o'chirish» · `hodisalar`, `POST /hodisalar`, `hodisaYoz` to'rt joyda · `eas.json` (`preview` — APK, `env`) · `lending/maxfiylik.html` · brauzer ko'rinishi (Netlify, CORS) · lendingda ikki havola.
   Mentor misoli — namuna va «kutilgan natija», umumiy qolip emas (tayanch 7.2b). «20» va «50» — Mentor misolining sonlari, o'quvchiga me'yor yoki baho emas (`00-TAQIQLAR.md` 1).
2. **Bugungi asosiy fikr (P-013):** Bu darsda 50 foydalanuvchiga uch bosqichli reja bilan boriladi, havola yuborishdan oldin esa ilovada ma'lumot, o'lchov va havola tekshiriladi.
   (Yakunda ScoreRing ostida, `small`; kartochkalarda so'zma-so'z yo'q.)
3. **O'tilgan — qayta o'rgatilmaydi, bir gap bilan eslatiladi (T-052):**
   - 6-dars (tayanch 1.6; o'tilgan deb): **kanal** — odamlar mahsulot haqida eshitadigan joy (Telegram'dagisi to'liq: «Telegram guruhi») · kanalni tanlash — uch savol (auditoriya shu yerdami · a'zomisiz · post yozishga ruxsat bormi) · **post** — kanalga yoziladigan matn, to'rt qatori: kim uchun · nima foyda · bitta harakat · halol holat; post **yuboriladi** («e'lon qilinadi» emas) · Mentorning uch kanali: mahalla futbol guruhi (60 kishi) · sinf chati · o'z Instagram sahifasi · xavfsizlik qoidalari (7-band) · kanal belgisi `?kanal=guruh` · `?kanal=sinf` · `?kanal=instagram`.
   - 10-Modul: **kerakli minimum**, **ochiq aytish**, **maqsad tugasa o'chirish**, **maxfiylik siyosati** (odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa; to'rt savol: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi) · **hodisa** (bu darsda — analitikaga yoziladigan bitta harakat; `hodisalar` jadvali, `POST /hodisalar`, `hodisaYoz(nom)`) · **brauzer ID** · **qadamlar** (ochdi → …) va sanoq sharti — har qadamda turli brauzerlar soni · Umami.
   - 11-Modul: «Maydon Jamoa», tashkilotchi va o'yinchi, «Qo'shilaman», «Kelaman», «Hisobdan chiqish», `oyinchilar` (`ism` · `telefon` · `parol_hash`), `POST /royxat`, `POST /kirish`, Expo Go (sinash vositasi), **APK** (nomi: «Android telefonga o'rnatiladigan ilova fayli»), Neon SQL Editor «Run», hash («paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi»), **asosiy harakat**, **talab** (qayerda · nima qilsin · nima buzilmasin), **agent** (Antigravity), **tekshirish** (o'z ishi), **sinov** (real odam).
   - 1-dars (shu modul): **lending**, **asosiy tugma** «Qo'shilmoqchiman», bo'lim «Qanday qo'shilaman» va uning matni «Hozircha o'rnatish havolasi yo'q.»; Umami — tashrif va `qoshilmoqchiman`.
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **bosqich** — 50 foydalanuvchiga rejaning bo'lagi; har bosqichda kanal · nima yuboriladi · kutilgan son · qachon (2-ekran, uchinchi bo'lak ochilgandan keyin). «Bosqich» bu darsda **faqat** shu ma'noda («etap», reja bo'lagi ma'nosida «qadam» — yo'q).
   - **kutilgan son** — bosqich oxirida jami ro'yxatdan o'tganlar soni taxmini; Mentor sonlari ustida yorliq **«Mentorning taxmini»** (2-ekran).
   - **ro'yxatdan o'tgan · asosiy harakatni qilgan** — ikki sanoq, yonma-yon (2-ekran, «Ishga tushirish kuni» bosilgandan keyin). Ro'yxatdan o'tgan — Database `oyinchilar`, `namuna = false` (namuna va tekshiruv akkauntlari `namuna = true` — tayanch 9.5); 50 maqsadi shu. Asosiy harakatni qilgan — Mentor misolida hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan. Sinfdoshlar sanaladi, lekin alohida aytiladi («20 kishi, 11 tasi — sinfdosh»); Database ularni ajratmaydi — o'quvchi bilsa, o'zi yozadi (ixtiyoriy; sinfda hech kim majburlanmaydi — 07-FILTR 23; 9.6).
   - **login** — ro'yxatdan o'tishda o'zi tanlagan nom; «kirish» — ilovaga kirish harakati va ekrani (4-ekran, «Telefon» qatori bosilgandan keyin). Ishlatilmaydi: username, nik, taxallus.
   - **qurilma ID** — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi (4-ekran, «Sanashni yoqish» bosilgandan keyin; kodda `qurilma_id`; 10-Moduldagi brauzer ID ning ilovadagi ko'rinishi). Web-trekda — brauzer ID (`brauzer_id`), o'sha ma'no.
   - **APK** — Android telefonga o'rnatiladigan ilova fayli (11-Modul so'zi, 4-ekranda ochiladi) · **brauzer ko'rinishi** — mobil ilovaning brauzerda ochiladigan ko'rinishi (iPhone'li foydalanuvchilar uchun; 4-ekran, «Qo'shilmoqchiman» bosilgandan keyin). Prozada «o'rnatish fayli tayyorlanadi» («build» — faqat buyruqda), «brauzer ko'rinishi» («web versiya» — yo'q).
   - **uch tekshiruv** — ishga tushirishdan oldin: **ma'lumot** (faqat kerakli minimum so'raladimi) · **o'lchov** (qadamlar sanaladimi) · **havola** (odam ilovani qanday ochadi) (4-ekran). Atama emas — uch savol; «bu darsda» deb chegaralanadi (bu kurs ro'yxati, tayanch 7.2a).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **hodisa** — faqat analitika hodisasi (`ochdi` …); 2–5-darslardagi ulanish hodisasi bu darsda tilga olinmaydi (`oyin-ozgardi` yo'q). **qadam** — faqat foydalanuvchi yo'li bo'lagi (ochdi → ro'yxatdan o'tdi → qo'shildi → kelishini tasdiqladi); amaliyot blokidagi bo'laklar o'quvchi matnida «1 · Ochish», «2 · Prompt» deb ataladi, «qadam» emas.
   - **tekshirish** — o'z ishini ko'rish (uch tekshiruv, blokdagi «Tekshirish»); **sinov** — faqat real odam bilan (bu darsda yo'q). **e'lon** — faqat o'yin e'loni; post «yuboriladi». **xabar** — bu darsda yo'q (chatdagisi — «post»).
   - **akkaunt** — prozada; «hisob» — faqat tugma nomlarida («Hisobdan chiqish», «Hisobni o'chirish») va siyosat matnida (tayanch 1.7). **kanal** — odamlar eshitadigan joy; Telegram'dagisi — «Telegram guruhi» / «sinf chati» / «maktab chati».
   - **taxmin** — ikki joyda bir ma'noda: o'quvchining bashorati («Taxminingiz: …») va rejadagi kutilgan son («Mentorning taxmini», «taxminim»). **foydalanuvchi** — mahsulotni ishlatadigan odam (umumiy so'z); «faol foydalanuvchi», «user» — yo'q.
   - **ilova** — o'quvchi matnida ikkala trek uchun umumiy so'z (11-Modul odati); web-trek qatorida — «sayt». **push** — faqat `git push`. **o'rnatish fayli** — APK tayyorlanishi («build» — faqat `eas build` buyrug'ida). **havola** — lendingdagi ikki havola va lending manzili; «link» — yo'q.
   - **Ishlatilmaydi:** strategiya, launch, voronka, etap, user, nik, web versiya, build (prozada), antikrizis, «ulash» (havola ma'nosida), «target», «me'yor» (son haqida).
6. **Raqamlar (faqat tayanch 1.7 va 1.13, «Mentor misolida»):** reja — 20 · 35 · 50 («Mentorning taxmini») · mahalla futbol guruhi 60 kishi · lending postdan keyingi kun: tashriflar 31 · «Qo'shilmoqchiman» 17 (Umami) · ishga tushirish kuni: ro'yxatdan o'tgan **20** (11 tasi sinfdosh, 9 tasi mahalla futbol guruhidan) · asosiy harakatni qilgan **8** · o'lchov shu kuni yoqiladi (qadamlar soni yo'q) ·
   login 3–20 belgi · navbat ≈25 daqiqa (Mentor misolida, va'da emas) · oyiga 15 bepul Android build · qadamlar yozuvi 60 kun (10-Modul muddati). Boshqa son yo'q. Har son yonida nima sanalgani: tashrif · bosish · akkaunt · qurilma.
7. **Xavfsizlik va maxfiylik (`00-TAQIQLAR.md` 2; tayanch 1.6, 9.12 — olti bandli ro'yxat so'zma-so'z, bitta manba `XAVFSIZLIK`, 6-dars bilan umumiy; o'quvchi matnida A2 4-bo'limida belgilar bilan):**
   1) «Faqat o'zim a'zo bo'lgan joyga yuboraman.» · 2) «Guruhga yuborishdan oldin egasidan ruxsat so'radim.» · 3) «Postda familiya, maktab raqami, telefon va uy manzili yo'q.» ·
   4) «Postni yuborishdan oldin ota-onamga ko'rsatdim.» · 5) «Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.» · 6) «Soxta akkaunt va sotib olingan obunachi ishlatmayman.»
   Ro'yxat ostida (belgisiz): «Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.» Sinf chatiga — 2-band postni Mentorga ko'rsatish bilan yopiladi; 4-band (ota-ona) sinf chati uchun shart emas, boshqa kanallardan oldin — majburiy (tayanch 9.38; 06-FILTR 13).
   Bu darsga xos: telefon raqami so'ralmaydi (A1) · namuna va tekshiruv akkauntlari `namuna = true` va sanalmaydi, o'zi bir necha marta ro'yxatdan o'tmaydi · Expo akkaunti ma'lumoti boshqaga (agentga ham) berilmaydi — `eas login` o'quvchining o'zi · agentga xato yuborilganda `.env` qiymatlari, token va kalitlar yuborilmaydi · `.env` `git status` da ko'rinmaydi (A1 1-bo'lim) · `DELETE` faqat `WHERE` bilan · public repo va lendingda shaxsiy ma'lumot yo'q.
8. **Vaqt va o'rnatish fayli (tayanch 4 «Vaqt», 7.10; Qaror-0 11):**
   - Taqsimot — sarlavha ostida. Bloklar pilotda taymer bilan o'lchanadi; «Ulgurmasangiz» yo'li har blok pastida; yakun sarlavhasi holatga qarab (besh holat, 11-ekran).
   - **O'rnatish fayli (mobil trek; tayanch 1.6, 9.3).** 6-dars uyga vazifasida EAS sozlanadi va birinchi fayl tayyorlanib, faqat **o'z telefoniga** o'rnatib ko'riladi — akkaunt, kalit va navbat ishi 7-darsdan oldin tugaydi. Bu fayl **eski kod** bilan (telefon so'raydi, qadamlar sanalmaydi) — **odamlarga yuborilmaydi** (1-ekran pastki qatori, A1 eslatmasi).
     Bugun **ilova ichidagi hamma o'zgarish Amaliyot 1 da**; fayl A1 oxirida tayyorlana boshlaydi va navbat kutilmaydi. **Amaliyot 2 — navbat paytida** ilovadan tashqaridagi ishlar (siyosat, brauzer ko'rinishi, havola, post, sanoq).
     Uyga vazifa bajarilmagan bo'lsa — 1-ekran pastki qatoridagi uch buyruq dars boshida, reja ekranlari paytida ishga tushiriladi; fayl baribir A1 oxirida. Navbat dars oxirigacha tugamasa — Android havolasi va post uyda; yakun sarlavhasi shunga qarab (11-ekran). «Sinov fayli» so'zi o'quvchi matnida ishlatilmaydi (TAYANCHGA SAVOL 17).
   - **Brauzer ko'rinishi** (iPhone yo'li) — hujjatdan yozilgan, qurilmada sinalmagan: pilotda tekshiriladi; ishlamasa — Qaror-0 10 bo'yicha «faqat Android» (Shubhali joylar 1).
9. **Amaliyot bloki (tayanch 4):** o'quvchi 4 bo'limning hammasini **o'z repo'sida, o'z mahsuloti va trekida** bajaradi (trek — `pm-m9d8-platforma.trek`; yo'q bo'lsa — tanlov shu kalitga yoziladi); Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam» ortida — to'liq prompt); 5-bo'lim yo'q.
   **Talab zinapoyasi (tayanch 4, 7-dars):** A1 — tayyor talab + bitta joy (`{qadamlar}` — qaysi qadam sanalishi) · A2 — bitta qatorni o'quvchi yozadi (siyosatning «Nima uchun» javobi) (TAYANCHGA SAVOL 18). Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
   Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» (faqat xato qatori). Push odati: `git status` → `git add <fayl>` → commit → `git push` (`git add .` emas). Backend Render'da — push'dan keyin Render yangi deploy tugashini kutish (11-Modul 9.82). «Ortda qoldingizmi» — `m12-dars-07-done`.
   Har blokda **web-trek qatori** aniq (nima boshqacha, nima yo'q — tayanch 1.7 «Web-trek»).
10. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; telefon, brauzer, chat maketlari chizilgan (CSS/SVG), logotip yo'q; «Maydon Jamoa» — telefon ramkasida, lending — brauzer oynasida, post — chat oynasida; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Matn o'lchovi (python bilan sanalgan, qavsda): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 · test variantlari ±15%.
11. **Fakt-manbalar (o'quvchi ko'rmaydi; to'liq — «Manbalar» bo'limida):** EAS Build buyruqlari va `eas.json` `preview` — tayanch 6, docs.expo.dev (06.10 qayta ochildi) · `.env` EAS Build'ga kirmaydi, `EXPO_PUBLIC_API_URL` `eas.json` `env` ga — docs.expo.dev (06.10) · brauzer ko'rinishi `npx expo export -p web` → `dist`, `public/_redirects`, `netlify deploy --dir dist` — docs.expo.dev (06.10) ·
    Android o'rnatishda ogohlantirish — docs.expo.dev · Umami — tayanch 6 · `oyinchilar` jadvali va `POST /royxat` — 11-Modul tayanchi 1.7 · «Maydon Jamoa» kodi — teg `m12-dars-06-done` (bu seansda repo yozilmaydi; 1-ekran holati tayanch 3 dan).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1-darsda lending chiqdi, 2–5-darslarda ilova real vaqtda yangilanadigan bo'ldi, 6-darsda uch kanal tanlanib birinchi post yuborildi — lendingga odamlar kirdi (tashriflar 31, «Qo'shilmoqchiman» 17), ilova esa hali ularga yuborilmagan. Bugun — reja va ishga tushirish.
- **Dars ipi:** 0 — tugma bosilyapti, ilova yuborilmagan: nima qilasiz (ballsiz) → 2 — Mentor rejasi uch bosqich bo'lib ochiladi, kutilgan son — taxmin; ishga tushirish kuni ikki son → 3 — test: rejadagi son nima → 4 — yangi o'yinchi yo'li: uch tekshiruv (ma'lumot · o'lchov · havola), uchalasi tayyor emas →
  5 — o'quvchi o'z rejasini yozadi → A1 — ilova: telefon o'rniga login, `namuna`, «Hisobni o'chirish», `hodisalar` va `hodisaYoz`; oxirida o'rnatish fayli navbatga → A2 — navbat paytida: maxfiylik siyosati, brauzer ko'rinishi, lendingda ikki havola, post, sanoq → 8 — yakuniy savol: halol sanoq → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Ishga tushirish yo'li»** (`ISHGA_TUSHIRISH` const → `IshgaTushirish`, dars bo'yi, 163/180; bitta manbadan: reja bosqichlari, ikki sanoq, yangi o'yinchi yo'li, lending matnlari):
  - **chapda maket** (holatga qarab bittasi, o'lchami barqaror — SABOQ 22): **chat** (Telegram guruhi oynasi — «Mahalla futbol guruhi», post pufagi) · **brauzer** (lending: sarlavha «Mahalla futboliga jamoani bir joyda yig'ing», tugma «Qo'shilmoqchiman», bo'lim «Qanday qo'shilaman») ·
    **telefon** («Maydon Jamoa» nomi o'z rangida: «Ro'yxatdan o'tish» formasi · «O'yinlar» · «O'yin» — «Qo'shilaman»). Yangi o'yinchi yo'li: post → lending → havola → ilova → ro'yxatdan o'tdi → qo'shildi.
  - **o'ngda jadval yoki karta:** reja jadvali (Bosqich · Kanal · Nima yuboriladi · Kutilgan son · Qachon) + ostida 0…50 chizig'i («Mentorning taxmini» yorlig'i) — 1, 2, 5-ekranlar · «Yuborishdan oldin» jadvali (Ma'lumot · O'lchov · Havola; hozir ✗ → Amaliyot N) — 4-ekran ·
    ikki sanoq kartasi «Ro'yxatdan o'tgan: N» · «Asosiy harakatni qilgan: N» — 2-ekran, A2 o'ngi, 8-ekran (kichik).
  - Ishlatiladi: 0 (brauzer + Umami qatori) · 1 (o'zi o'ynaydi) · 2 (chat + reja jadvali + ikki sanoq) · 4 (telefon/brauzer + «Yuborishdan oldin») · 5 (reja jadvali — o'quvchining o'zi, bitta ustun) · A1 o'ngi (telefon: forma login bilan; yonida Neon va terminal kartalari) · A2 o'ngi (brauzer: `maxfiylik.html` va lending ikki havola bilan; ikki sanoq) · 8 (kichik ikki sanoq).
    `prefers-reduced-motion` da post pufagi, chiziq va sonlar harakatsiz, holatlar bir zumda almashadi.
- **Mentor misolining holati (tayanch 3):**

| | Dars boshida (`m12-dars-07-start` = `06-done`) | Dars oxirida (`m12-dars-07-done`) |
|---|---|---|
| Ro'yxatdan o'tish | ism · telefon · parol (`oyinchilar.telefon`) | ism · **login** · parol (`oyinchilar.login`, `namuna`, `yaratilgan`); forma ostida ochiq gap va «Maxfiylik siyosati» havolasi (Amaliyot 1) |
| Akkaunt | «Hisobdan chiqish» | + **«Hisobni o'chirish»** («Rostdan o'chirasizmi?») |
| Lending | «Qanday qo'shilaman»: «Hozircha o'rnatish havolasi yo'q.»; `?kanal=` o'qiladi | ikki havola: **«Android: ilovani o'rnatish»** · **«iPhone: brauzerda ochish»**; halol qatorlar; pastda **«Maxfiylik siyosati»** (`maxfiylik.html`) — Amaliyot 2 |
| Brauzer ko'rinishi | — | Netlify'da alohida sayt; Backend `WEB_ORIGIN` da shu manzil (Amaliyot 2) |
| O'lchov | lendingda Umami (tashrif, `qoshilmoqchiman`, `kanal`) | + ilovada `hodisalar` (`id` · `nom` · `qurilma_id` · `yaratilgan`), `POST /hodisalar`, `hodisaYoz` — `ochdi` · `royxatdan-otdi` · `qoshildi` · `tasdiqladi` (Amaliyot 1) |
| O'rnatish fayli | 6-dars uyga vazifasidagi fayl — eski kod bilan, faqat o'z telefonida | `eas.json` (`preview` — APK, `env`: `EXPO_PUBLIC_API_URL`); yangi fayl Amaliyot 1 oxirida tayyorlanadi, havolasi lendingda |
| Sanoq (ishga tushirish kuni) | — | ro'yxatdan o'tgan 20 (11 sinfdosh, 9 mahalla futbol guruhidan) · asosiy harakatni qilgan 8 |

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **50 foydalanuvchiga qanday yetasiz?** (34) — dars nomi (DE-205)
- Mentor: Mentor misolida birinchi postdan keyin odamlar lendingga kirib tugmani bosdi, ilova esa hali ularga yuborilmagan. Ikki javobdan birini tanlang.
- Maket (chap): brauzer oynasi — Mentor lendingi: sarlavha «Mahalla futboliga jamoani bir joyda yig'ing» · tugma «Qo'shilmoqchiman» · bo'lim «Qanday qo'shilaman»: «Hozircha o'rnatish havolasi yo'q.»
  Oyna ostida bitta mono qator (Umami, Mentor misolida · postdan keyingi kun): tashriflar 31 · «Qo'shilmoqchiman» 17.
- Variantlar (radio, o'ng; bir uzunlikda):
  - A — Havolani hoziroq hamma tanishlarimga yuboraman (46)
  - B — Avval reja tuzaman: kimga, nimani va qachon (43)
- Javob — B: **Aynan!** Reja kimga, nimani va qachon yuborishni aytadi. Yuborishdan oldin esa uch narsa tekshiriladi. (100)
- Javob — A: **Qiziq fikr!** Tanishlardan boshlash mumkin — rejada ham shunday. Yuborishdan oldin esa uch narsa tekshiriladi. (108)
- **Harakat → Vizual o'zgarish:** variantni tanlash → lending maketida «Qanday qo'shilaman» bo'limi accent halqaga kiradi, yonida uchta bo'sh belgi uyasi chiqadi (uzuq chiziqli, ichida «?» — keyin to'ldiriladigan joy, U-041). Uch tekshiruv nomi yozilmaydi (4-ekran kashfiyoti, P-036). Ikkala tanlovda vizual bir xil — payoff hech bir javobni rad etmaydi (KORPUS §21).
- Ballsiz. Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha ikki variant halqada (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: qo'l ko'tartirib so'rang: «Uyda kim o'rnatish faylini tayyorlab, o'z telefoniga o'rnatib ko'rdi?» — sozlamaganlar 1-ekran pastki qatoridagi uch buyruqni hozir ishga tushiradi. Ikkala variant teng: tanishlardan boshlash — Mentor rejasining 1-bosqichi.
✎ Hook — o'quvchi o'zi qilgan ish (post yubordi, tugma bosilyapti) va o'z savoli (P-016). Javob matnlarining ikkinchi gapi bir xil — yangi narsa ikkalasiga bir xil qo'shiladi (10-Modul 6-dars naqshi).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun reja tuzib, ilovangizni yuborishga tayyorlaysiz.** (52) (07-FILTR 21: yuborish holatga qarab — yakun shuni aytadi)
- Mentor: 6-darsda kanallarni tanlab birinchi postni yubordingiz — bugun o'sha kanallarga ilovaning o'zi boradi. Kodni agent yozadi, qaror va tekshiruv — sizdan.
- Chap — kulrang yorliq (App.jsx osti, so'zma-so'z — P-015): «yig'ish rejasi va ishga tushirish»; ostida vizual bir marta o'zi yuradi (DE-200): uch bosqich ustuni kulrang, sonsiz (2-ekran kashfiyoti ochilmaydi) → chat oynasida post pufagi → brauzerda lending → telefonda «Ro'yxatdan o'tish» → «O'yinlar». Yo'l chizig'i chapdan o'ngga chiziladi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · 50 foydalanuvchiga uch bosqichli reja tuzasiz · `reja`
  - 02 · Ro'yxatdan o'tishda faqat keraklisini so'raysiz · `ma'lumot`
  - 03 · Ilovada qadamlar sanashini yoqasiz · `o'lchov`
  - 04 · Havolani lendingga qo'yib, post yuborasiz · `havola`
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m12-dars-07-start` · namuna `m12-dars-07-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Pastki qator 2 (kichik, faqat mobil trek): Uyda tayyorlagan o'rnatish faylingiz eski ro'yxatdan o'tish ekrani bilan — uni odamlarga yubormang: yangisi Amaliyot 1 oxirida tayyorlanadi. Hali sozlamagan bo'lsangiz — hozir terminalda: `npm install --global eas-cli` · `eas login` · `eas build:configure` (agentga: «`eas.json` ga `preview` profili: Android uchun `buildType` — `apk`; `env` da `EXPO_PUBLIC_API_URL` — Render manzili»), keyin reja bilan davom eting.
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: `eas login` — o'quvchining o'z Expo akkaunti; parolini agentga ham, sinfdoshga ham yozmaydi. `eas build:configure` savol bersa — Android tanlanadi; kalit (keystore) haqida so'rasa — yangisini yaratish tanlanadi, EAS o'zi saqlaydi (docs.expo.dev). Bu sozlash fon ishi: o'quvchi reja ekranidan davom etadi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011): «bosqich» faqat 01 qatorida — tegsiz oddiy so'z, ta'rifi 2-ekranda; reja ta'rif aytmaydi va 2-ekran sonlarini ochmaydi (P-015). Mentorning birinchi gapi — 6-dars bilan ko'prik (P-020).

## 2 · Mentor rejasi  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · reja
- Sarlavha: **50 kishi bitta postdan keladimi?** (32)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval javobingizni belgilang, keyin Mentor rejasini bo'lakma-bo'lak oching.
  - 1/3–3/3: Keyingi bo'lakni ochish uchun «Keyingi bosqich»ni bosing.
  - 3/3 dan keyin: Rejadagi sonlar — kutilgan sonlar; haqiqiysini ko'rish uchun «Ishga tushirish kuni»ni bosing.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — zinapoya): **«Ilova chiqdi» postidan keyin Mentor nechta kishi kutyapti?** · 20 kishi · 35 kishi · 50 kishi
  — tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi.
- Vizual: chapda **chat oynasi** (Telegram guruhi «Mahalla futbol guruhi · 60 a'zo»; pufaklar bo'sh) · o'ngda **reja jadvali** (Bosqich · Kanal · Nima yuboriladi · Kutilgan son · Qachon — qatorlar yo'q) · jadval ostida 0…50 chizig'i (bo'sh). Ekranda uch blok: maket · jadval · harakat tugmasi (SABOQ 26).
- **Harakat → Vizual o'zgarish:**
  1. «Keyingi bosqich» (halqada; N/3) → qator sirg'alib kiradi va ~1 s yashil yonadi, chiziq shu songacha chiziladi, ustida yorliq «Mentorning taxmini»; chat oynasi bosqichga mos o'zgaradi:
     - 1/3: **1 · sinf chati va mahalla futbol guruhi · ikkinchi post («ilova chiqdi») · 20 · ishga tushirish kuni** → chatga post pufagi kiradi (so'zma-so'z, tayanch 1.7): «Maydon Jamoa chiqdi. Shanba, 18:00 o'yini ilovada turibdi — «Qo'shilaman» ni bosing, nechta odam yig'ilgani ko'rinadi. Android va iPhone uchun havola: {lending manzili}»
     - 2/3: **2 · maktab chati (parallel sinflar; chat egasidan ruxsat) · post — birinchi qatori parallel sinflarga moslab · 35 · birinchi hafta** → chat sarlavhasi «Maktab chati», tepasida kulrang yorliq «chat egasidan ruxsat ✓», post pufagi kulrang siluet (matnsiz).
     - 3/3: **3 · har o'yin e'loni bilan birga havola: tashkilotchilar xohlasa o'z jamoasiga yuboradi · lending havolasi · 50 · har yangi e'londa** → chat o'rnida telefon: «E'lon berish» → e'lon kartasi, undan havola belgisi chatga uchib boradi.
  2. «Ishga tushirish kuni» (3/3 dan keyin, halqada) → jadval ostida ikki sanoq kartasi yonma-yon chiqadi, sonlar sanab o'sadi: **Ro'yxatdan o'tgan: 20** (ostida kichik: 11 tasi — sinfdosh, 9 tasi — mahalla futbol guruhidan · namuna va tekshiruv akkauntlarisiz) ·
     **Asosiy harakatni qilgan: 8** (ostida kichik: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan). Chiziqda taxmin 20 yonida haqiqiy 20 belgisi; 2 va 3-qatorlar kulrang «hali boshlanmagan».
- Joriy qator (3/3 dan keyin, bitta): Bu darsda rejaning har bo'lagi bosqich deyiladi: unda kanal, nima yuborilishi, kutilgan son va qachon yoziladi. (111)
- Izoh-qator (`QIzoh`, «Ishga tushirish kuni»dan keyin): Bu misolda taxmin va haqiqiy son teng chiqdi — sizda farq qilishi mumkin. (73)
- Natija qatori (`QTaxmin`, xulosaning birinchi qatori — SABOQ 25): «Taxminingiz: … · haqiqatda: 20 kishi — 35 va 50 keyingi bosqichlarda kutilyapti» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda 20 — taxmin; kunning oxirida ikki son sanaldi: ro'yxatdan o'tgan va asosiy harakatni qilgan. (103)
- Tugadi (199): harakat paneli yopiladi; reja jadvali va ikki sanoq butun enga, fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Keyingi bosqich (N/3) → Ishga tushirish kuni → Davom etish
- O'qituvchi eslatmasi: 2-bosqichda nima yuborilishi va «qachon» ustuni — MD qarori (TAYANCHGA SAVOL 2). Sinfga savol: «Nega sinfdoshlar alohida aytiladi?» — mumkin javob: ular mahsulot uchun emas, sizni tanigani uchun kirgan bo'lishi mumkin; auditoriyangiz boshqa bo'lsa, bu son auditoriya haqida kam aytadi.
  «Hammasi — 60 kishi — kelsa-chi?» degan savolga: kutilgan son taxmin, guruhdagi a'zolar soni emas (3-ekran testi shu farqni so'raydi). «Bir xil xabarni ko'p guruhga tashlash» bilan farqi: rejadagi har kanal 6-dars uch savolidan o'tgan va ruxsat olingan joy.
- ✎ Bitta g'oya (P-008): uch bosqich → kutilgan son taxmin → ishga tushirish kuni ikki son. Holat o'quvchi bosgan bosqichlardan chiziladi (P-046). Atama «bosqich» — uchinchi bo'lak ochilgandan keyin (T-011). Postlar — olam ichidagi matn (T-008).

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — o'sha olam, Mentor rejasining 2-bosqichi — P-002)
- Eyebrow: Tekshiruv · kutilgan son (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Rejada 2-bosqich yonida «35» turibdi. Bu son nimani bildiradi?** (9 so'z)
  - A — Maktab chatida shuncha kishi borligini (38)
  - B — Shuncha kishi allaqachon ro'yxatdan o'tganini (45)
  - ✔ C — Shuncha kishi yig'ilishi kutilayotganini (40)
  - D — Shuncha kishi postni o'qishi aniq bo'lganini (44)
- Kalit: **C** (index 2). To'rttalasi bir shaklda («… -ini»); «shuncha kishi» uchtasida; to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Rejadagi son — taxmin, haqiqiysi keyin sanaladi. (48)
- Xato izohlari (≤60):
  - A: Chatdagi odamlar soni — boshqa son. Rejada nima yoziladi? (57)
  - B: 2-bosqich hali boshlanmagan. Sanalgan son qayerda turadi? (57)
  - D: Post nechta kishiga yetishi oldindan aniq emas. (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Estimate Spotter — birinchi urinishda to'g'ri.
- Izoh (MD): savolda son («35») bor — javoblarda son yo'q (S-019, tayanch 7.8). A — «kanal hajmi = kutilgan son» yanglishi · B — «taxmin = sanalgan son» · D — kafolat (S-004: har biri darsning o'z qoidasi bo'yicha noto'g'ri).

## 4 · Uch tekshiruv  ← QTushuncha
- Eyebrow: Tushuncha · yuborishdan oldin
- Sarlavha: **Havolani yuborishdan oldin nimani tekshirasiz?** (46)
- Mentor (bosqichga qarab, bitta gap):
  - bashoratgacha: Avval javobingizni belgilang, keyin yangi o'yinchi yo'lini bosib chiqing.
  - 1/3: Yangi o'yinchi ro'yxatdan o'tmoqchi — formadagi yonib turgan qatorni bosing.
  - 2/3: 10-Modulda saytdagi qadamlarni sanagansiz, ilovada esa hali sanalmaydi — «Sanashni yoqish»ni bosing.
  - 3/3: Oxirgisi — lendingdagi «Qo'shilmoqchiman»ni bosing: odam ilovaga qanday yetadi?
- Bashorat (ballsiz, 181; S-015 — zinapoya): **Mentor ilovasi hoziroq yuborilsa, nechta narsa yetmay qoladi?** · Hech narsa · Bitta narsa · Uchta narsa — tanlangach yopilmaydi.
- Vizual: chapda **maket** (nuqtaga qarab: telefon «Maydon Jamoa» yoki brauzer — lending) · o'ngda **«Yuborishdan oldin» jadvali** — bashorat tanlangunicha ko'rinmaydi (javobni ochmaslik uchun; SABOQ 4), keyin bo'sh sarlavha bilan chiqadi; qatorlar har nuqtadan keyin kiradi. Ekranda uch blok.
- **Harakat → Vizual o'zgarish** (nuqtalar tartibda, bittasi halqada; N/3):
  1. **Ma'lumot** — telefon: «Ro'yxatdan o'tish» (Ism · Telefon · Parol), «Telefon» qatori halqada. Bosilganda qator silkinadi, ustida yorliq «SMS yuborilmaydi — raqam kerak emas», qator o'chadi, o'rniga «Login» qatori sirg'alib kiradi; forma ostida gap paydo bo'ladi (tayanch 1.7, so'zma-so'z):
     «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» (tayanch 9.7)
     Jadvalga 1-qator: **Ma'lumot** · faqat kerakli minimum so'raladimi? · hozir: telefon so'raladi ✗ · Amaliyot 1.
     - Joriy qator: Ro'yxatdan o'tishda o'zingiz tanlagan nom login deyiladi — loginni boshqa o'yinchilar ko'rmaydi. (96)
  2. **O'lchov** — telefon: «O'yinlar»; ostida to'rt yorliq chizig'i: ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi — har birida «?». Tugma «Sanashni yoqish» halqada. Bosilganda telefonda yangi o'yinchi yo'li o'zi o'ynaydi (ochildi → ro'yxatdan o'tdi → «Qo'shilaman») va yorliqlarda son yonadi: 1 · 1 · 1 · 0; yorliqlar ostida mono qator `ochdi · k3f9…`.
     Jadvalga 2-qator: **O'lchov** · qadamlar sanaladimi? · hozir: sanalmaydi ✗ · Amaliyot 1.
     - Joriy qator: Qurilma ID — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi. (123)
     - Izoh-qator (`QIzoh`): 10-Moduldagi brauzer ID ning ilovadagi ko'rinishi; har qadamda turli qurilmalar soni sanaladi. (94)
  3. **Havola** — brauzer: lending, «Qo'shilmoqchiman» halqada. Bosilganda sahifa «Qanday qo'shilaman» bo'limiga suriladi: «Hozircha o'rnatish havolasi yo'q.» qizil-och yonadi → o'rniga ikki havola sirg'alib kiradi: **«Android: ilovani o'rnatish»** · **«iPhone: brauzerda ochish»**;
     ostida ikki kulrang qator (tayanch 1.7, so'zma-so'z): «Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.» · «iPhone'da eslatma hozircha yo'q.»
     Jadvalga 3-qator: **Havola** · odam ilovani qanday ochadi? · hozir: havola yo'q ✗ · Amaliyot 2.
     - Joriy qator: Mentor misolida Android'ga APK — o'rnatiladigan ilova fayli — boradi; iPhone'da ilovaning brauzer ko'rinishi ochiladi. (118)
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: uchta narsa — ma'lumot, o'lchov, havola» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda uchalasi ham tayyor emas edi: telefon so'ralardi, qadamlar sanalmasdi, havola yo'q edi. (98)
- Tugadi (199): maket yig'iladi, «Yuborishdan oldin» jadvali butun enga: uch qator, har birida «hozir ✗ · Amaliyot N»; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Yo'lni bosib chiqing (N/3) → Davom etish
- O'qituvchi eslatmasi: uch tekshiruv — bu kurs ro'yxati, to'liq tekshiruv emas (10-Moduldagi prod ro'yxati ham bor edi). Ko'prik: ma'lumot va o'lchov — ilova ichida, Amaliyot 1 da (o'rnatish fayli shundan keyin tayyorlanadi); havola — ilovadan tashqarida, Amaliyot 2 da. «Kerakli minimum» — 10-Modul so'zi. Sinfga savol: «Ilovangiz nimani so'raydi — har biri mahsulotga kerakmi?» — javoblar Amaliyot 1 ning qavs ichi. Brauzer ko'rinishi va APK — Mentor misolining yo'li; web-trekdagi o'quvchiga havola — sayt manzili.
- ✎ Uch yangi so'z, har biri o'z lahzasida (T-011): login — 1-nuqtadan keyin, qurilma ID — 2-nuqtadan keyin, APK va brauzer ko'rinishi — 3-nuqtadan keyin. Bashorat variantlari — bitta o'lchovning uch darajasi (S-015). Holat o'quvchi bosgan nuqtalardan chiziladi (P-046). Vizual «hozir → kerak» ko'rsatadi, matn mexanikani oldindan aytmaydi (P-036).

## 5 · O'z rejangiz  ← QMustaqil (USTAXONA — ketma-ket karta; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish
- Sarlavha: **Sizning rejangizda qaysi uch bosqich bor?** (41)
- Mentor: Har bosqichga kanal, nima yuborilishi, kutilgan son va vaqtni yozing — kanallar 6-darsdagi tanlovingizdan olindi. (`pm-m10d6-kanallar` yo'q bo'lsa: «…— kanalni o'zingiz yozasiz.»)
- Kirish qatori (kulrang, tepada, bir marta): Kanal — faqat o'zingiz a'zo bo'lgan joy yoki tanish doira; guruhga — egasidan ruxsat so'rab. (92)
- Qadamlar 1/2/3 (`QQadamlar` bosqich tugmalari «1-bosqich · 2-bosqich · 3-bosqich»); bitta ustun; bir vaqtda bitta katta karta, yozilgani yuqoridagi ixcham qatorga uchadi (SABOQ 29). Har kartada:
  - «Kanal» — 6-darsdagi `ruxsat: 'bor'` kanallardan to'ldirilgan (tahrirlanadi; ipucha: Qayerga yuborasiz?); «ruxsat kutilmoqda» (`'soraladi'`) bo'lgan joy ham tanlanadi, lekin yonida kulrang «avval ruxsat so'rang» (07-FILTR 49)
  - «Nima yuboriladi» (ipucha: Post, havola yoki boshqa narsa)
  - «Kutilgan son — jami» (raqam; yonida kulrang yorliq «taxminim»)
  - «Qachon» — uch tugma: Bugun · Shu hafta · Keyinroq
  «Qo'shish» → karta ixcham qatorga uchadi («1 · sinf chati · post · 12 · bugun»), keyingi karta ochiladi. 3/3 dan keyin «Saqlash».
- Tekshiruv (`QXato`, ≤60; faqat bo'sh qator bloklaydi, qolgani — maslahat, qaror o'quvchida — S-008):
  - xato · bo'sh kanal: Qayerga yuborasiz — shuni yozing. (33)
  - xato · bo'sh «nima yuboriladi»: Nima yuborasiz — shuni yozing. (30)
  - xato · son yo'q: Nechta kishi kutyapsiz — son yozing. (36)
  - xato · son oldingi bosqichdagidan kam (maslahat): Bu son — jami: oldingi bosqichdagidan kam bo'lmaydi. (52)
  - xato · kanalda «notanish», «shaxsiy xabar», «hamma guruh», «reklama», «sotib» (maslahat): Bu kanal xavfsizlik qoidalariga to'g'ri keladimi? (49)
  - xato · 3-bosqich soni 50 dan kam (maslahat, baho emas): Bu moduldagi mashq maqsadi — 50. Yana kanal bormi? (50)
- Yordam (sukutda yopiq): Mentor rejasi: 1-bosqich — sinf chati va mahalla futbol guruhi, ikkinchi post, jami 20 · 2-bosqich — maktab chati (chat egasidan ruxsat bilan), jami 35 · 3-bosqich — tashkilotchilar xohlasa o'z jamoasiga havola yuboradi, jami 50. Sonlar — Mentorning taxmini; sizning mahsulotingizda boshqa bo'ladi. Yangi kanal bo'lmasa — 3-bosqich oldingi kanallarda davom etishi mumkin.
- **Harakat → Vizual o'zgarish:** «Qo'shish» → karta ixcham qatorga uchadi, 0…{eng katta son} chizig'ida yangi belgi chiziladi («taxminim» yorlig'i bilan); «Saqlash» → forma yopiladi, reja kartasi butun enga (199): uch qator, chiziq, har qator yonida ✎.
- Saqlanadi: `pm-m10d7-reja` — `{ bosqichlar: [{ id, kanal, nima, kutilgan, qachon }] × 3, tekshiruv: { malumot: false, olchov: false, havola: false }, yuborildi: false, royxat: null, sinfdosh: null, asosiy: null, sana }` (tayanch 8; `tekshiruv` — Amaliyot 1, 2 da, sonlar — Amaliyot 2 4-bo'limida).
- Xulosa: Rejangiz saqlandi: uch bosqich, kanal va kutilgan son bilan. Haqiqiy sonni dars oxirida sanaysiz. (97)
- Tugma (pastki): Bosqichlarni yozing (N/3) → Davom etish
- Nishon: Stage Planner — «Saqlash» bosilganda (ish bajarilgan — P-048).
- Mentor rejimida (proyektorda): forma o'rnida Mentor rejasi (`ISHGA_TUSHIRISH.reja`) to'ldirilgan holda ko'rinadi.
- O'qituvchi eslatmasi: kanal — guruhning haqiqiy nomi emas, turi («sinf chati», «mahalla guruhi»; tayanch 8). Kutilgan son — o'quvchining taxmini; «kam» yoki «ko'p» deb baholanmaydi. 50 dan kam reja ham saqlanadi — maslahat qatori faqat savol beradi.

## A1 · Amaliyot 1 — ilova: ma'lumot va o'lchov  ← amaliyot bloki (≈22 daq; `screens[6]`; tayanch 1.7, 9.3)
- Eyebrow: Amaliyot 1 · ma'lumot va o'lchov
- Sarlavha: **Ilovangiz keraklisini so'rasin, qadamlarni sanasin.** (51)
- Mentor: Talab tayyor — qavs ichiga mahsulotingiz qadamlarini yozasiz, oxirida o'rnatish fayli tayyorlana boshlaydi. «1 · Ochish»dan boshlang.
- Bo'limlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda va trekingizda — `pm-m9d8-platforma`; ilova ichidagi hamma o'zgarish shu blokda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.
     Ro'yxatdan o'tish formangizni oching va har qatorga savol bering: mahsulot shusiz ishlaydimi? Mentor misolida telefon raqami kerak emas — SMS yuborilmaydi; talab uni login bilan almashtiradi. Sizning mahsulotingizda nima ortiqcha ekanini o'zingiz hal qilasiz — uni promptdagi birinchi qavsga yozasiz (07-FILTR 1).
     Keyin mahsulotingizda odam ochgandan asosiy harakatgacha bosib o'tadigan qadamlarni yozib oling — uchtadan beshtagacha. Mentor misolida to'rtta: ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi.
     10-Moduldagi hodisalar tizimi — jadval, `POST /hodisalar`, `hodisaYoz` — bugun final mahsulotingizga ko'chadi.
  2. **Prompt** — `{qadamlar}` qavsini to'ldiring (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring. `{lending manzili}` 1-darsdagi yozuvingizdan o'zi qo'yiladi (yo'q bo'lsa — o'zingiz yozasiz):
     > Qayerda: ro'yxatdan o'tish va kirish — ilova ekranlari, Backend yo'llari va foydalanuvchilar jadvali; Backend'da yangi `hodisalar` jadvali va `POST /hodisalar`; ilovada yangi `hodisaYoz(nom)` funksiyasi.
     > Nima qilsin: 1) ro'yxatdan o'tishda mahsulotga kerak bo'lmagan shu ma'lumot so'ralmasin: **{ortiqcha ma'lumot}**. Kirish uchun alohida nom kerak bo'lsa — login: odam o'zi tanlagan nom (3–20 belgi, harf va raqam, takrorlanmaydi); login band bo'lsa — «Bu login band»; kirish — login va parol bilan.
     > Forma ostiga gap: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» va «Maxfiylik siyosati» havolasi — {lending manzili}/maxfiylik.html (sahifani keyin qo'shaman).
     > 2) Foydalanuvchilar jadvaliga `namuna` (rost yoki yolg'on) va `yaratilgan` (ro'yxatdan o'tgan vaqt) ustunlarini qo'sh. Mavjud akkauntlar o'chmasin. Avval menga ro'yxat ko'rsat: har akkaunt, unga beriladigan login va olib tashlanadigan ustunlar — qaysilari namuna ekanini men aytaman va «Davom et» deyman; shundan keyingina namunalarga `namuna = true`, `yaratilgan` — hozirgi vaqt, keraksiz ustunni olib tashla; parollar o'zgarmasin. Forma orqali ro'yxatdan o'tgan har yangi akkaunt — `namuna = false`.
     > 3) «Hisobdan chiqish» yoniga «Hisobni o'chirish»: avval «Rostdan o'chirasizmi?» deb so'rasin; tasdiqlansa shu akkaunt o'chsin — `DELETE` faqat `WHERE` bilan, shu akkaunt `id` si bo'yicha. Unga tegishli qaysi yozuvlar o'chishi va qaysilari qolishini avval menga ro'yxat qilib ko'rsat — men tasdiqlagach bajar.
     > 4) Qadamlar sanog'i: `hodisalar` jadvali (`id`, `nom`, `qurilma_id`, `yaratilgan`); `POST /hodisalar { nom, qurilma_id }` — `nom` faqat «Qadamlar» qatoridagi nomlardan biri, aks holda `400`. Ilovada `hodisaYoz(nom)`: qurilma ID — birinchi ochilishda yaratiladigan tasodifiy harf va raqamlar, qurilmada saqlanadi. Qadamlar: **{qadamlar}**. Har hodisa ish muvaffaqiyatli tugagandan keyin yozilsin; ilovaning bitta ochilishiga bitta hodisa. 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda, `WHERE` bilan.
     > Nima buzilmasin: hodisa bilan ism, login va token yuborilmasin — faqat qadam nomi va qurilma ID; so'rov o'tmasa ham ilova ishlayversin, foydalanuvchiga xato ko'rsatilmasin. Qolgan ekranlar va yo'llar avvalgidek ishlasin, boshqa odamlarning yozuvlari o'chmasin. `.env` ga tegma. Tekshiruv uchun akkaunt yaratsang — `namuna = true` bilan, `id` larini ayt va ishdan keyin faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Joy yonidagi kulrang namuna: `{qadamlar}` — masalan: ilova ochilganda — `ochdi`; ro'yxatdan o'tganda — `royxatdan-otdi`; asosiy harakatdan keyin — … Bu kursda nomlar kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida. · `{ortiqcha ma'lumot}` — masalan: telefon raqami (SMS yuborilmaydi); hech biri ortiqcha bo'lmasa — «yo'q».
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — «Ro'yxatdan o'tish» va «Kirish» ekranlari, «Hisobdan chiqish» turgan joy; `backend/` — `POST /royxat`, `POST /kirish`, `oyinchilar` jadvali; yangi `hodisalar` jadvali va `POST /hodisalar`; `mobil/` da yangi `hodisaYoz(nom)`.
     > Nima qilsin: 1) telefon raqami so'ralmasin. `oyinchilar` da `telefon` o'rniga `login`: 3–20 belgi, harf va raqam, noyob. `POST /royxat { ism, login, parol }`, `POST /kirish { login, parol }`; login band bo'lsa — `409` «Bu login band».
     > Forma ostiga: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» va «Maxfiylik siyosati» havolasi — {lending manzili}/maxfiylik.html.
     > 2) `oyinchilar` ga `namuna` (rost yoki yolg'on) va `yaratilgan` ustunlari. Mavjud akkauntlar o'chmasin. Avval ro'yxatni ko'rsat: har akkaunt va unga ismidan beriladigan login (`ali` kabi, kichik harf; takrorlansa oxiriga raqam); men «Davom et» deganimdan keyin hammasiga `namuna = true`, `yaratilgan` — hozirgi vaqt, `telefon` ustunini qiymatlari bilan olib tashla; parollar o'zgarmasin. `POST /royxat` har doim `namuna = false` yozsin.
     > 3) «Hisobdan chiqish» yoniga «Hisobni o'chirish»: «Rostdan o'chirasizmi?» deb so'rasin; tasdiqlansa shu akkaunt va uning `ishtirokchilar` dagi yozuvlari o'chsin — `DELETE` faqat `WHERE oyinchi_id = …` bilan; o'yindan chiqqandagi kabi son yangilansin. U e'lon qilgan o'yinlar o'chmasin — tashkilotchisi bo'sh qolsin; bunday o'yinlar ro'yxatda va «O'yin» ekranida xatosiz ko'rinsin (07-FILTR 18). «Hisobdan chiqish» va «Hisobni o'chirish» da shu telefondagi rejalashtirilgan eslatmalar bekor bo'lsin (tayanch 9.36; 04-FILTR 24).
     > 4) `hodisalar` jadvali — `id`, `nom` (matn), `qurilma_id` (matn), `yaratilgan`. `POST /hodisalar { nom, qurilma_id }`: `nom` faqat `ochdi`, `royxatdan-otdi`, `qoshildi` yoki `tasdiqladi`, aks holda `400`. Ilovada `hodisaYoz(nom)`: qurilma ID — birinchi ochilishda yaratiladigan tasodifiy harf va raqamlar, qurilmada saqlanadi.
     > To'rt joyda chaqirilsin: ilova ochilganda (bitta ochilishga bitta) — `ochdi`; ro'yxatdan o'tish muvaffaqiyatli bo'lganda — `royxatdan-otdi`; «Qo'shilaman» muvaffaqiyatli bo'lganda — `qoshildi`; «Kelaman» muvaffaqiyatli bo'lganda — `tasdiqladi`. 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda, `WHERE` bilan.
     > Nima buzilmasin: o'yinlar, qo'shilish, tasdiq, chiqish, navbat, real vaqt ulanishi va eslatma avvalgidek ishlasin; hodisa bilan ism, login va token yuborilmasin; so'rov o'tmasa ham ilova ishlayversin. `.env` ga tegma. Tekshiruv uchun akkaunt yaratsang — `namuna = true` bilan, `id` larini ayt va ishdan keyin faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordamning oxirgi qatori: Ilovangizda ro'yxatdan o'tish yo'q bo'lsa — 1, 2 va 3-bandni o'chiring, 4-band qoladi. Qaysi ma'lumot ortiqcha ekanini birinchi qavsga o'zingiz yozasiz — login ham faqat kerak bo'lsa.
     Web-trek qatori (Yordamda): «qurilma ID» o'rnida brauzer ID — 10-Moduldagidek (`brauzer_id`, brauzer xotirasida); «Hisobni o'chirish» — saytdagi akkaunt bo'limida; qadamlar — saytingizdagi 3–5 qadam.
  3. **Ishga tushirish** — agent avval ikki ro'yxatni ko'rsatadi: akkauntlar (beriladigan login, olib tashlanadigan ustun) va hisob o'chirilganda nima o'chishi. Tekshirib, qaysilari namuna ekanini ayting va «Davom et» deb yozing — agent taxmin qilmaydi (07-FILTR 2, 3, 16, 17).
     `git diff`: o'zgarish agent aytgan fayllardami. Keyin `git status` → har faylni `git add <fayl>` bilan → `git commit -m "7-dars: login, hisobni o'chirish, qadamlar sanog'i"` → `git push`;
     Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching (bitta Wi-Fi; bo'lmasa `--tunnel`); web-trekda `npm run dev`.
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     (1) «Hisobdan chiqish» → «Ro'yxatdan o'tish»: telefon so'ralmaydi, forma ostida gap va «Maxfiylik siyosati» havolasi bor (sahifaning o'zi Amaliyot 2 da qo'shiladi). Ism `tekshiruv`, login `tekshiruv1` bilan ro'yxatdan o'ting — bu tekshiruv akkaunti, haqiqiy odamniki emas.
         O'sha login bilan yana urinib ko'ring: «Bu login band» chiqishi kerak. Keyin asosiy harakatni qiling (Mentor misolida — «Qo'shilaman»).
     (2) Neon SQL Editor'da: `SELECT login, namuna FROM oyinchilar;` → «Run»: siz namuna degan akkauntlar yonida `true`, `tekshiruv1` yonida `false` bo'lishi kerak. So'ng `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` — bosib o'tgan har qadam yonida 1.
     (3) «Hisobni o'chirish» → «Rostdan o'chirasizmi?» → tasdiqlang. `SELECT * FROM oyinchilar WHERE login = 'tekshiruv1';` — javob bo'sh bo'lishi kerak; tekshiruv akkaunti o'zini o'chirdi, qo'lda `DELETE` yozmaysiz.
         Tekshiruv hodisalari: `SELECT DISTINCT qurilma_id FROM hodisalar;` — hozircha faqat o'z qurilmangiz; uni nusxalab: `DELETE FROM hodisalar WHERE qurilma_id = '{qurilma ID}';` — jadval bo'sh, o'lchov odamlar uchun tayyor.
     Belgilang (o'zingiz): **Ma'lumot: (1) va (3) o'tdi** · **O'lchov: (2) o'tdi**.
     Mobil trekda — o'rnatish faylini tayyorlash (oxirgi ish; faqat (1) o'tgandan keyin): `eas.json` dagi `preview` profilida `env` → `EXPO_PUBLIC_API_URL` bormi? Bo'lmasa agentga: «`eas.json` dagi `preview` profiliga `env` qo'sh: `EXPO_PUBLIC_API_URL` — qiymati `mobil/.env` dagidek (u maxfiy emas). Boshqa qiymat qo'shma.»
     Keyin `cd mobil` → `eas build -p android --profile preview`. Terminal fayl tayyor bo'lishini kutib turadi — kutish shart emas: u bergan sahifa havolasini saqlab qo'ying va Amaliyot 2 ga o'ting (Mentor misolida navbat ≈25 daqiqa bo'lgan; sizda boshqacha bo'lishi mumkin).
     Keyin ilovada xato topilib tuzatilsa — fayl qayta tayyorlanadi: tayyor fayl o'zi yangilanmaydi.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤3 blok; bir marta o'zi yuradi — «Telefon» qatori o'rniga «Login» kiradi):
  - telefon: «Ro'yxatdan o'tish» — Ism · Login · Parol · ostida gap: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» · havola «Maxfiylik siyosati» · keyingi kadr: «Hisobdan chiqish» · «Hisobni o'chirish» → «Rostdan o'chirasizmi?»
  - karta «Neon · SQL Editor»: `SELECT login, namuna FROM oyinchilar;` → `ali · true` · `tekshiruv1 · false` · ostida `SELECT nom, COUNT(DISTINCT qurilma_id) …` → `ochdi 1 · royxatdan-otdi 1 · qoshildi 1` (tozalangach — bo'sh)
  - terminal kartasi: `eas build -p android --profile preview` → kulrang qator «navbatda · sahifa havolasi» (natija matni chizilmaydi — Shubhali joylar 7)
- Hammasi bajarilgach (yashil; mobil trek): Ilovangiz faqat keraklisini so'raydi va qadamlarni sanaydi; o'rnatish fayli navbatda. (85)
- Hammasi bajarilgach (yashil; web-trek): Saytingiz faqat keraklisini so'raydi va qadamlarni sanaydi. (59)
- Saqlanadi: `pm-m10d7-reja.tekshiruv.malumot` va `.tekshiruv.olchov` — 4-bo'limdagi ikki belgidan (ish fakti; tayanch 8). «Bajardim» «Ma'lumot» belgisi qo'yilgach ochiladi.
- Ulgurmasangiz (kichik, pastda): Vaqt tugayaptimi — push'dan keyin avval (1) ni tekshiring (ro'yxatdan o'tish, «Bu login band», asosiy harakat); o'tsa — o'rnatish faylini boshlang, (2)–(3) — navbat paytida. Xato topilsa — fayl qayta tayyorlanadi (07-FILTR 6). Agent ishi tugamagan bo'lsa — fayl, havola va post uyga qoladi (yakun shuni aytadi).
- Web-trek qatori: o'sha talab — «ilova» o'rnida saytingiz, qurilma ID o'rnida brauzer ID; ishga tushirish `npm run dev`, tekshirish — brauzerda; o'rnatish fayli yo'q — 4-bo'lim (3) dan keyin «Bajardim».
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-07-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi bo'limni shunga qarab qaytarasiz (`mobil/.env` ga o'z Render manzilingizni yozasiz; o'rnatish faylini o'z Expo akkauntingizda tayyorlaysiz).
- Nishon (bonus): Data Minimum — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: 6-dars uyga vazifasidagi fayl telefon so'raydigan eski kod bilan — uni hech kim odamlarga yubormasligini aytib qo'ying; odamlarga boradigan fayl shu blok oxirida tayyorlanadi. 11-Moduldagi sinovchilar namuna telefon bilan ro'yxatdan o'tgan — o'quvchi agent ko'rsatgan ro'yxatdan ularni namuna deb belgilaydi (agent taxmin qilmaydi), ular sanoqqa kirmaydi. Haqiqiy odamning akkaunti bo'lsa — namuna qilinmaydi.
  Holatni agent emas, o'quvchi qo'yadi (ikki belgi). Navbat dars oxirigacha tugamasa — Android havolasi va post uyda; bu muvaffaqiyatsizlik emas, yakun sarlavhasi shuni aytadi.
- ✎ Talab zinapoyasi (tayanch 4): A1 — tayyor talab + ikki joy `{ortiqcha ma'lumot}` va `{qadamlar}` va ikki tasdiq («Davom et») — nima ortiqcha, nima sanaladi, qaysi akkaunt namuna, nima o'chadi — o'quvchining qarori (07-FILTR 1–3; tayanch 9.39). Ilova ichidagi hamma o'zgarish shu blokda, fayl blok oxirida (9.3). Tekshiruv yozuvi funksiyaning o'zi bilan o'chadi; hodisalarni tozalash — `WHERE` bilan, faqat o'z qurilma ID si bo'yicha.

## A2 · Amaliyot 2 — siyosat va havola  ← amaliyot bloki (≈22 daq — o'rnatish fayli navbatda turgan paytda; `screens[7]`; tayanch 1.7, 9.3)
- Eyebrow: Amaliyot 2 · siyosat va havola
- Sarlavha: **Siyosat saytda, havola lendingda tursin.** (40)
- Mentor: Endi «Nima uchun» qatorini o'zingiz yozasiz — har ma'lumot nega kerakligini siz bilasiz; «1 · Ochish»dan boshlang.
- Bo'limlar (hammasi o'z repo'ngizda; ilova kodiga bu blokda faqat brauzer ko'rinishi uchun tegiladi):
  1. **Ochish** — Amaliyot 1 push qilingan, mobil trekda o'rnatish fayli navbatda. Ilovangiz so'raydigan har ma'lumot uchun bitta gap tayyorlang: u nima uchun kerak. Siyosatning qolgan uch javobini agent koddan topadi, siz tekshirasiz.
  2. **Prompt** — «Nima uchun» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: `lending/` — yangi `maxfiylik.html` va «Qanday qo'shilaman» bo'limi; ilovaning brauzer ko'rinishi; Backend — qaysi manzillardan so'rov qabul qilinishi.
     > Nima qilsin: 1) `lending/maxfiylik.html` — maxfiylik siyosati, to'rt savol: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi. «Qaysi ma'lumot», «kim ko'radi» va «qancha saqlanadi» javoblarini koddan top va qaysi faylga qarab yozganingni ayt; kodda yo'q narsani yozma — koddan bilib bo'lmaydigan joyni (masalan, Database'ni kim ko'radi) «[savol]» deb qoldir, uni men yozaman.
     > Nima uchun: **{nima uchun}**
     > 2) Ilova brauzerda ham ochilsin (`npx expo export -p web`, natija `dist` papkasida): brauzerda token `localStorage` da saqlansin, eslatma brauzerda rejalashtirilmasin; `public/_redirects` fayliga `/*    /index.html   200`. Brauzer uchun paket yetishmasa — `npx expo install` bilan qo'sh va qaysi paket ekanini ayt.
     > 3) «Qanday qo'shilaman» bo'limiga ikki havola tayyorla: «Android: ilovani o'rnatish» va «iPhone: brauzerda ochish» — manzillarni keyin aytaman. Ostiga ikki qator: «Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.» va «iPhone'da eslatma hozircha yo'q.» Manzili hali yo'q havola o'rnida eski qator qolsin.
     > Nima buzilmasin: telefondagi ilova avvalgidek ishlasin — token telefonda oldingi joyida, eslatma telefonda ishlayversin; lending sarlavhasi, foydalar, «Qo'shilmoqchiman» tugmasi va Umami o'zgarmasin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — Mentor misolidagi qator, tayanch 1.7 so'zma-so'z): «Nima uchun: Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.»
     Web-trek qatori (Yordamda): 2 va 3-bandlarni o'chiring — lendingdagi asosiy tugma saytingizga olib boradi (1-darsdan shunday).
  3. **Ishga tushirish** — mobil trekda: `cd mobil` → `npx expo export -p web` → `dist` papkasini Netlify'ga yangi sayt qilib chiqaring (9-Modulda sayt chiqargansiz; buyruq bilan: `netlify deploy --prod --dir dist` — `--prod` siz sinov manzili chiqadi).
     Manzil chiqqach, agentga: «Brauzer ko'rinishi manzili: {manzil}. Backend shu manzildan so'rovlarni qabul qilsin (`WEB_ORIGIN`); lendingdagi «iPhone: brauzerda ochish» — shu manzil.»
     Keyin `git status` → `git add <fayl>` → `git commit -m "7-dars: maxfiylik siyosati va brauzer ko'rinishi"` → `git push` — Render va lending yangilanadi (bir necha daqiqa cho'zilishi mumkin).
     Tekshiring: lendingdan «Maxfiylik siyosati»ni oching — to'rt savolga javob bormi; har gapni agent ko'rsatgan fayl bilan solishtiring. Kodga mos kelmagan gapni agentga yozing: «Shu gap kodga mos emas: {gap}. Tuzat.» Agent «[savol]» qoldirgan joylarni o'zingiz yozing (Mentor misolida: «Database'ni faqat ilova egasi ko'radi.» — buni Mentor biladi, kod aytmaydi; 07-FILTR 4).
     Telefon brauzerida brauzer ko'rinishi manzilini oching: «Kirish» va «O'yinlar» ko'rinishi kerak. Ko'rinmasa — iPhone qatori eski matn bilan qoladi, Android yo'li ishlayveradi; xato qatorini agentga yuboring (`.env` qiymatlarini emas).
     Kichik qator (kulrang, bo'lim ostida): Bu sahifa yuridik hujjat emas — u ilovangiz haqiqatda nima qilishini aytadi.
     Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Havola va post** — tartib bilan; ulgurmaganingiz uyga qoladi:
     (1) **O'rnatish fayli** — terminal bergan sahifani oching. Fayl tayyor bo'lsa, havolasini agentga: «Android havolasi: {APK havolasi}. Lendingdagi «Android: ilovani o'rnatish» shu manzilga olib borsin.» → `git push`.
         Telefonda lendingni oching: «Qo'shilmoqchiman» → «Android: ilovani o'rnatish» — fayl yuklanadi, o'rnatishda ogohlantirish chiqishi kerak. Havolani boshqa telefonda yoki brauzerning yashirin oynasida ham oching — fayl Expo akkauntisiz yuklanishi kerak; yuklanmasa, havolani lendingda qoldirmang va xato qatorini agentga yuboring (07-FILTR 32).
         Tanlang: **Android havolasi lendingda** · **Fayl hali navbatda** (ikkinchisida havola va post uyga qoladi). Havola faqat Amaliyot 1 dagi «Ma'lumot» belgisi qo'yilgan ilova uchun qo'yiladi.
     (2) **Post** (havola lendingda bo'lsa) — 6-darsdagi postingiz shu yerda (to'rt qator: kim uchun · nima foyda · bitta harakat · halol holat); «bitta harakat» va «halol holat» qatorlarini bugungi holatga moslang: nima tayyor — shuni yozing. Havola oxiriga kanal belgisi (`?kanal=sinf`).
         Xavfsizlik ro'yxati (6-darsdagi olti band, so'zma-so'z — belgilab chiqing):
         1) «Faqat o'zim a'zo bo'lgan joyga yuboraman.» · 2) «Guruhga yuborishdan oldin egasidan ruxsat so'radim.» · 3) «Postda familiya, maktab raqami, telefon va uy manzili yo'q.» ·
         4) «Postni yuborishdan oldin ota-onamga ko'rsatdim.» · 5) «Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.» · 6) «Soxta akkaunt va sotib olingan obunachi ishlatmayman.»
         Ro'yxat ostida (belgisiz): Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.
         Sinf chatiga: postni Mentorga ko'rsating, u aytsa yuboring (2-band shu bilan; ota-ona bandi — sinf chati uchun shart emas). Mahalla guruhi kabi boshqa kanalga — uyda, ota-onangizga ko'rsatib va guruh egasining ruxsati bilan.
         Tanlang: **Yuborildi** · **Uyda yuboraman** («Yuborildi» havola lendingda bo'lganda ochiladi).
         Yordam (Mentor posti, so'zma-so'z): «Maydon Jamoa chiqdi. Shanba, 18:00 o'yini ilovada turibdi — «Qo'shilaman» ni bosing, nechta odam yig'ilgani ko'rinadi. Android va iPhone uchun havola: {lending manzili}»
     (3) **Sanoq** — dars oxirida. Neon SQL Editor'da: `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false;` → «Run» — ro'yxatdan o'tganlar (namuna va tekshiruv akkauntlarisiz).
         Asosiy harakat — agentga: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: `namuna = false` akkauntlardan nechtasi {asosiy harakat — masalan: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan}. Jadvallarni o'zgartirma.» — SQL'ni o'qib, «Run».
         `tekshiruv1` qolgan bo'lsa — avval «Hisobni o'chirish» bilan o'chiring. Sonlarni kiriting: **Hozirgacha ro'yxatdan o'tgan** · **shundan sinfdosh** (bilsangiz — ixtiyoriy) · **Asosiy harakatni qilgan** (sana o'zi yoziladi; 07-FILTR 23, 42).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤3 blok; bir marta o'zi yuradi):
  - brauzer `…/maxfiylik.html` (Mentor siyosati; tayanch 1.7):
    - **Maydon Jamoa · maxfiylik siyosati**
    - **Qaysi ma'lumot?** Ro'yxatdan o'tishda — ism, login va parol; parolning o'zi saqlanmaydi, o'rnida undan yasalgan satr (hash) turadi. Telefon raqami so'ralmaydi. Ilovada qadamlar sanaladi — ism va loginsiz, qurilma ID bilan. Lendingda Umami tashrif va tugma bosilishini sanaydi — unga ism va login yuborilmaydi.
    - **Nima uchun?** Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.
    - **Kim ko'radi?** Ism — shu o'yindagi o'yinchilar. Loginni boshqa o'yinchilar ko'rmaydi. Database'ni faqat ilova egasi ko'radi.
    - **Qancha saqlanadi?** Hisob — o'zingiz o'chirguningizcha: ilovada «Hisobni o'chirish» bor. Qadamlar yozuvi — 60 kun.
  - o'sha brauzerda ikkinchi kadr — lending «Qanday qo'shilaman»: **Android: ilovani o'rnatish** · **iPhone: brauzerda ochish** · ostida ikki kulrang qator (tayanch 1.7) · sahifa pastida «Maxfiylik siyosati»
  - ikki sanoq kartasi (Mentor misolida, ishga tushirish kuni): **Ro'yxatdan o'tgan: 20** — 11 tasi sinfdosh · **Asosiy harakatni qilgan: 8**; kichik izoh: sonlar Mentor misolidan — sizda boshqacha bo'ladi.
- Hammasi bajarilgach (yashil; «Yuborildi» bo'lsa): Siyosat saytda, havola lendingda, post yuborildi. (49) (07-FILTR 21)
- Hammasi bajarilgach («Uyda yuboraman» bo'lsa): Siyosat saytda, havola lendingda. Postni ota-onangizga ko'rsatib yuborasiz. (75)
- Hammasi bajarilgach («Fayl hali navbatda» bo'lsa): Siyosat saytda. Android havolasi va post — fayl tayyor bo'lgach, uyda. (70)
- Saqlanadi: `pm-m10d7-reja.tekshiruv.havola` — 4-bo'lim (1) «Android havolasi lendingda» (web-trekda — lending tugmasi tekshirilgach) · `.yuborildi` — (2) · `.royxat`, `.sinfdosh`, `.asosiy`, `.sana` — (3) (tayanch 8).
- Ulgurmasangiz (kichik, pastda): Siyosat sahifasi push qilinsa yetadi — brauzer ko'rinishi, havola va post uyga qoladi; yakun sarlavhasi nima qolganini aytadi.
- Web-trek qatori: brauzer ko'rinishi va o'rnatish fayli yo'q — 3-bo'limda faqat siyosat; 4-bo'lim (1) da lendingdagi asosiy tugma saytingiz manziliga olib borishini tekshirib, «havola lendingda» deb belgilaysiz; `hodisaYoz` — Amaliyot 1 da.
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-07-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) (`lending/maxfiylik.html` va brauzer ko'rinishi — namuna).
- Nishon (bonus): Launch Ready — oxirgi «Bajardim»da (postni yuborish shart emas — P-048, bosim yo'q).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: sinfdoshlar bir-birining ilovasida ro'yxatdan o'tadi — xohishi bilan, ism familiyasiz, boshqa joyda ishlatadigan parolini yozmaydi. Sinfdosh soni — ixtiyoriy, o'quvchi bilsa yozadi; sinfda hech kim majburlanmaydi, baho emas (12 kishilik sinfda ko'pi bilan 11).
  Fayl navbatda bo'lsa, sinfdoshlar brauzer ko'rinishi orqali ham kira oladi. Brauzer yo'li — zaxira: token brauzer xotirasida saqlanadi, telefondagidan farqli (07-FILTR 28). O'rnatish fayli tayyor bo'lsa ham, maxfiylik sahifasi va havola tekshirilmaguncha odamlarga berilmaydi (07-FILTR 36, 37). O'quvchining o'z qurilmasi ham `ochdi` da sanaladi — sanoqni aytganda buni eslatib qo'ying. Postni faqat Amaliyot 1 tekshiruvlari o'tgan ilova uchun yuborishga ruxsat bering.
- ✎ Talab zinapoyasi: A2 — bitta qatorni o'quvchi yozadi («Nima uchun» — ma'lumot nega kerakligi koddan chiqmaydi, egasi biladi); qolgan uch javobni agent koddan topadi, o'quvchi solishtiradi (10-Modul 6-dars naqshi). 4-bo'lim nomi «Havola va post» (TAYANCHGA SAVOL 5 ✅). Tashqi qadamlarning har birida xato yo'li bitta gap, ayb o'quvchida emas (P-026).

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikki blok birga: `namuna` belgisi — Amaliyot 1, sanoq — Amaliyot 2)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik ikki sanoq kartasi (bo'sh: «Ro'yxatdan o'tgan: ?» · «Asosiy harakatni qilgan: ?»).
- Savol: **Jadvalda 14 akkaunt: 3 tasi namuna va tekshiruv, 6 tasi sinfdosh. Qanday aytasiz?** (12 so'z)
  - ✔ A — 11 kishi, shundan sinfdoshlar alohida aytiladi (46)
  - B — 14 kishi, shundan sinfdoshlar alohida aytiladi (46)
  - C — 5 kishi, chunki sinfdoshlar sanoqqa kirmaydi (44)
  - D — 11 kishi, sinfdoshlarni aytish shart emas (41)
- Kalit: **A** (index 0). «11» A va D da, «sinfdoshlar alohida» A va B da; to'rttalasi bir shaklda; to'g'ri variant yolg'iz eng uzun emas. Javobdagi 11 — savolda yo'q (S-019).
- To'g'ri izohi: Namuna va tekshiruv sanalmaydi; sinfdoshlar — alohida. (54)
- Xato izohlari (≤60):
  - B: Namuna va tekshiruv akkauntlari haqiqiy foydalanuvchimi? (56)
  - C: Sinfdoshlar ham ro'yxatdan o'tgan. Ular qanday aytiladi? (56)
  - D: Son to'g'ri. Nechtasi sinfdosh — eshitgan odam biladimi? (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol yangi holat — slayddan ko'chirib bo'lmaydi (§106); ikkala trekka to'g'ri keladi (akkaunt bor mahsulot). «3 tasi namuna va tekshiruv» — Amaliyot 1 dagi `namuna = true` akkauntlar (9.5); «6 tasi sinfdosh» — Amaliyot 2 da sinfda so'rab sanalgan son (9.6). Kalit ibora 3-ekran bilan takrorlanmaydi (S-008: taxmin ↔ halol sanoq).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Kutilgan son» · 8 — «2 — Halol sanoq»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, tayanch 7.1; belgi ✓ va nishon — faqat birinchi holatda):
  - Sarlavha · malumot, olchov, havola ✓ va «Yuborildi»: **Ilovangiz odamlarga yuborildi.** (30)
  - Sarlavha · malumot, olchov, havola ✓, «Uyda yuboraman»: **Havola tayyor — post yuborish qoldi.** (36)
  - Sarlavha · malumot ✓, lekin havola yoki olchov yo'q (fayl navbatda, Amaliyot 2 tugamagan): **Ilova tayyor — havola va post qoldi.** (36)
  - Sarlavha · reja saqlangan, malumot yo'q: **Reja tayyor — uch tekshiruv qoldi.** (34)
  - Sarlavha · reja saqlanmagan: **Reja boshlandi — qolgan bosqichni tugating.** (43)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Bu darsda 50 foydalanuvchiga uch bosqichli reja bilan boriladi, havola yuborishdan oldin esa ilovada ma'lumot, o'lchov va havola tekshiriladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Rejadagi kutilgan son — taxmin; haqiqiy son Database'dan sanaladi.
  - Ikki son yonma-yon aytiladi: ro'yxatdan o'tgan va asosiy harakatni qilgan.
  - Sinfdoshlar sanaladi, lekin alohida aytiladi; namuna va tekshiruv akkauntlari sanalmaydi.
  - Login — ro'yxatdan o'tishda o'zingiz tanlagan nom; telefon raqami mahsulotga kerak bo'lmasa, so'ralmaydi.
  - Qurilma ID bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ota-onangiz va 1-bosqichdagi kanallar · Nechta: 1-bosqich to'liq · Muddat: keyingi darsgacha
  - ① Havola lendingda bo'lgach, postni olti bandli ro'yxat bo'yicha tekshiring, ota-onangizga ko'rsating va 1-bosqichdagi kanallarga yuboring (guruhga — egasidan ruxsat so'rab). Uchrashuv taklifi kelsa — faqat kattalar bilan.
  - ② Kechqurun Neon'da ikki sonni qayta sanang — hozirgacha ro'yxatdan o'tgan (`namuna = false`; sinfdoshlarni bilsangiz — alohida) va asosiy harakatni qilgan — va sanasi bilan yozib oling.
  - ③ Darsda qolgan qismni tugating: {holatga qarab — qadamlar sanog'ini tekshiring · siyosat sahifasini kod bilan solishtiring · brauzer ko'rinishini chiqaring · o'rnatish fayli tayyor bo'lgach, Android havolasini lendingga qo'ying}.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?».
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- Izoh (MD): uyga vazifa — PM+PRAKT naqshi (11-Modul 13-dars `HwCard`; tayanch 4). «Keyingi dars» qatori — App.jsx `m10-08` nomi, so'zma-so'z (`00-NOMLAR.md`). ③ bandi `tekshiruv` holatidan yig'iladi (P-046); hammasi tugagan bo'lsa ③ ko'rinmaydi.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Estimate Spotter!** (3-ekran, birinchi urinishda) — Rejadagi son taxmin ekanini birinchi urinishda topdingiz
- **Stage Planner!** (5-ekran, «Saqlash») — 50 foydalanuvchiga uch bosqichli rejangizni yozdingiz
- **Data Minimum!** (A1, oxirgi «Bajardim» — bonus, P-048: ish bajarilgan) — Ro'yxatdan o'tishda faqat keraklisini qoldirib, qadamlar sanog'ini yoqdingiz
- **Launch Ready!** (A2, oxirgi «Bajardim» — bonus) — Maxfiylik siyosatini saytga chiqarib, ikki sonni sanadingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Kutilgan son** — 1 Bu darsda reja uch bosqichdan iborat: kanal, nima yuboriladi, kutilgan son, qachon. · 2 Kutilgan son — taxmin: shuncha kishi yig'ilishi kutilyapti. ·
  3 Haqiqiy son ishga tushirilgandan keyin Database'dan sanaladi.
  — Sinfga savol: Rejadagi son bilan sanalgan son farq qilsa, qaysi biri o'zgaradi?
- **8 · Halol sanoq** — 1 Ikki son yonma-yon aytiladi: ro'yxatdan o'tgan va asosiy harakatni qilgan. · 2 Namuna va tekshiruv akkauntlari sanalmaydi. ·
  3 Sinfdoshlar sanaladi, lekin alohida aytiladi.
  — Sinfga savol: Nega sinfdoshlar alohida aytiladi?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bu darsda 50 foydalanuvchiga reja nechta bosqichdan iborat? | Uchta: har bosqichda kanal, nima yuboriladi, kutilgan son va qachon | Bu kurs qolipi; boshqa rejada bosqichlar soni boshqa bo'lishi mumkin |
| Rejadagi kutilgan son nima? | Taxmin: shuncha kishi yig'ilishi kutilyapti | Haqiqiy son ishga tushirilgandan keyin sanaladi |
| Qaysi ikki son yonma-yon aytiladi? | Ro'yxatdan o'tgan va asosiy harakatni qilgan | Mentor misolida ishga tushirish kuni: 20 va 8 |
| Sinfdoshlar sanoqqa kiradimi? | Ha, lekin alohida aytiladi | Mentor misolida: 20 kishi, 11 tasi — sinfdosh |
| Namuna va tekshiruv akkauntlari sanaladimi? | Yo'q | Mentor misolida ular `namuna` belgisi bilan ajratiladi; soxta akkaunt ham yo'q |
| Havola yuborishdan oldin bu darsda qaysi uch narsa tekshiriladi? | Ma'lumot, o'lchov va havola | Faqat kerakli minimum so'raladimi, qadamlar sanaladimi, odam ilovani qanday ochadi |
| Login nima? | Ro'yxatdan o'tishda o'zingiz tanlagan nom | Mentor misolida telefon raqami so'ralmaydi — SMS yuborilmaydi |
| Qurilma ID nima? | Tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi | Odamning ismini ham, loginini ham bildirmaydi |
| Mentor misolida ilova qaysi to'rt qadamni sanaydi? | Ochdi, ro'yxatdan o'tdi, qo'shildi, kelishini tasdiqladi | Har qadamda turli qurilmalar soni |
| APK nima? | Android telefonga o'rnatiladigan ilova fayli | O'rnatishda ogohlantirish chiqadi: ilova do'kondan emas |
| Brauzer ko'rinishi nima? | Mobil ilovaning brauzerda ochiladigan ko'rinishi | Mentor misolida iPhone'li foydalanuvchilar uchun; unda eslatma hozircha yo'q |
| «Hisobni o'chirish» bosilsa nima o'chadi? | Akkaunt va uning qatnashuv yozuvlari | Siyosatdagi «o'chirish» gapi kodda bor |
- §145: har javobdagi so'z darsda bor (bosqich, kutilgan son — 2 · ikki son, sinfdosh — 2, 8, A2 · namuna va tekshiruv, `namuna` — A1, 8 · uch tekshiruv — 4 · login, qurilma ID, APK, brauzer ko'rinishi — 4 · to'rt qadam — A1 · «Hisobni o'chirish» — A1).
- S-027: har old tomon — to'liq savol, «?» bilan. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). «inglizchasi: funnel» — bu darsda yo'q (tayanch 2: bir marta, 8-dars).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda.
1. Mentor rejasida 1-bosqich qayerdan boshlanadi? (2)
   - ✔ A — Sinf chati va mahalla futbol guruhidan
   - B — Shahar bo'yicha katta futbol kanalidan
   - C — Notanish odamlarga shaxsiy xabardan
   - D — Sotib olingan obunachilar ro'yxatidan
2. Mentor misolida «asosiy harakatni qilgan» kim? (2)
   - A — Ilovani telefoniga o'rnatib ochgan odam
   - ✔ B — O'yinga qo'shilgan yoki e'lon bergan odam
   - C — Lendingdagi tugmani bir marta bosgan odam
   - D — Postni o'qib, do'stiga yuborgan odam
3. Mentor nega telefon raqamini so'ramaydigan qildi? (4, A1)
   - A — Raqamni yozish uzoq vaqt oladi
   - B — Raqamni hamma yoddan bilmaydi
   - ✔ C — Mahsulotga raqam kerak emas
   - D — Raqam Database'ga sig'maydi
4. Bitta o'yinchi ilovani ikki telefonda ochdi. `ochdi` da nechta qurilma? (4)
   - A — Bitta, chunki login bir xil
   - B — Bitta, chunki ism bir xil
   - C — Uchta, chunki uch marta ochdi
   - ✔ D — Ikkita, chunki ikki qurilma
5. Haqiqiy «ro'yxatdan o'tgan» soni qayerdan olinadi? (2, A2)
   - ✔ A — Database'dan, SQL so'rovi bilan
   - B — Rejada yozilgan kutilgan sondan
   - C — Lendingdagi tashriflar sonidan
   - D — Guruhdagi hamma a'zolar sonidan
6. «Hisobni o'chirish» tasdiqlansa nima bo'ladi? (A1)
   - A — Akkaunt qoladi, faqat parol o'chadi
   - ✔ B — Akkaunt va qatnashuv yozuvlari o'chadi
   - C — Ilova telefondan o'zi o'chib ketadi
   - D — Hamma o'yinchilarning akkaunti o'chadi
7. Maxfiylik sahifasidagi gapni nima bilan solishtirasiz? (A2)
   - A — Agentning hisoboti bilan
   - B — Boshqa ilova sahifasi bilan
   - ✔ C — Ilovangizning kodi bilan
   - D — Lending sarlavhasi bilan
8. Mentor misolida brauzer ko'rinishida hozircha nima yo'q? (4)
   - A — O'yinlar ro'yxati
   - B — Qo'shilish tugmasi
   - C — Ro'yxatdan o'tish
   - ✔ D — O'yin eslatmasi
9. Agentga xato yuborganda nimani yuborasiz? (A1, A2)
   - ✔ A — Xato chiqqan qatorning o'zini
   - B — `.env` faylidagi hamma qiymatni
   - C — Tokenni va xato chiqqan qatorni
   - D — Maxfiy kalitni va butun kodni
10. Guruhga post yuborishdan oldin nima qilasiz? (5, A2)
    - A — Yangi akkaunt ochib olasiz
    - ✔ B — Guruh egasidan ruxsat so'raysiz
    - C — Postni o'nta guruhga tashlaysiz
    - D — Postga telefon raqam qo'shasiz
11. `ochdi` hodisasi bilan Backend'ga nima boradi? (4, A1)
    - A — Hodisa nomi va o'yinchi logini
    - B — O'yinchi ismi va qurilma ID
    - ✔ C — Hodisa nomi va qurilma ID
    - D — O'yinchi logini va parol hash
12. Sinf chatidan keyin 12 kishi ro'yxatdan o'tdi, rejada 20 edi. Nima qilasiz? (2, 5)
    - A — Soxta akkaunt ochib, 20 ga yetkazasiz
    - B — O'zingiz yana sakkiz marta ro'yxatdan o'tasiz
    - C — Postni notanish guruhlarga tashlaysiz
    - ✔ D — Sonni yozib, keyingi bosqichga o'tasiz
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran ↔ arena 5 (son nima ↔ qayerdan), 8-ekran ↔ arena 12 (qanday aytiladi ↔ nima qilinadi).
- 1, 10, 12-savollar distraktorlari — xavfsizlik qoidalariga zid ishlar (bitta xato-sinf: sonni sun'iy ko'paytirish); 4-savol — qurilma ID ni odam bilan aralashtirish (bitta xato-sinf). 8-savol — tayanch 1.7 fakti (eslatma brauzer ko'rinishida yo'q).
- **Fon so'zlari** (R-008, kodda {uz, ru}): bosqich · kutilgan son · ro'yxatdan o'tgan · asosiy harakat · login · qurilma ID · APK · brauzer ko'rinishi · lending · post · Maydon Jamoa · 20. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmFiftyUsersLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `m10-07-v1`, `lessonTitle` — «50 foydalanuvchiga qanday yetasiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · practice-own (mustaqil) · practice (A1) · practice (A2) · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 2, 8: 0 }; bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`.
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2, s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + `QTaxmin`, yopilmaydigan ixcham qator — `TaxminIxcham`) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5 `QMustaqil` (`QQadamlar` 1/2/3) · s6/s7 `QBlok` + `QPrompt` (`ScreenBlok` ulagichi, 4 bo'lim) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
4. **Bitta vizual `IshgaTushirish`** (180): `ISHGA_TUSHIRISH` const — `reja` (3 bosqich: kanal, nima, kutilgan, qachon — tayanch 1.7), `sanoq` (20 · 11 · 9 · 8), `yol` (post → lending → havola → ilova → ro'yxatdan o'tdi → qo'shildi), `lending` (sarlavha, tugma, bo'lim matnlari — 1.1, 1.7), `post2` (ikkinchi post), `qadamlar` (to'rt nom va yorliqlari), `maxfiylik` (to'rt javob — A2 o'ngi, tayanch 1.7), `formaGapi` (9.7).
   Uch maket bitta komponentda (chat · brauzer · telefon), o'lchami barqaror (SABOQ 22), «Maydon Jamoa» nomi telefon ramkasida o'z rangida (SABOQ 2, 23). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: it-bosqich it-nuqta it-tugma`). `reduced-motion` — o'tishsiz.
5. s2: «Keyingi bosqich» ×3 (qator kiradi + chiziq + chat o'zgaradi), «Ishga tushirish kuni» (ikki sanoq sanab o'sadi), `QTaxmin`; holat o'quvchi bosgan bosqichlardan (P-046). Navbatdagi tugma `.navbat` halqa + pulsatsiya (SABOQ 11).
6. s4: uch nuqta tartibda (Telefon qatori → Login; «Sanashni yoqish» → yorliqlar va `qurilma_id` qatori; «Qo'shilmoqchiman» → ikki havola); o'ng jadval bashoratdan keyin chiqadi (Ma'lumot → Amaliyot 1 · O'lchov → Amaliyot 1 · Havola → Amaliyot 2); `QIzoh` qatorlari; `QTaxmin`.
7. s5 — ketma-ket karta formasi (SABOQ 29): `kanal` oldindan `pm-m10d6-kanallar.kanallar[i].nom` dan (yo'q bo'lsa bo'sh), `nima`, `kutilgan` (`/^\d+$/`), `qachon` (uch tugma). Tekshiruvlar: bo'sh — bloklaydi; qolgani `QXato` maslahat. Saqlash `pm-m10d7-reja` (tayanch 8: `tekshiruv: { malumot: false, olchov: false, havola: false }`, `yuborildi: false`, sonlar `null`). Mentor rejimida — `ISHGA_TUSHIRISH.reja`.
8. A1/A2 — `ScreenBlok` (skelet) 4 bo'lim; `prompt: [...]`, `{…}` joylar accent pill, kulrang namuna — `QPrompt` `namuna` maydoni (11-Modul 13-dars KOD 8 bilan bir qaror). A1: bitta joy `{qadamlar}`; `{lending manzili}` — `pm-m10d1-lending.manzil` dan oldindan (yo'q bo'lsa — bo'sh joy). A2: bitta qator `{nima uchun}`.
   **KOD (qolipda yo'q):** A1 4-bo'limida **ikki belgi** («Ma'lumot: (1) va (3) o'tdi» · «O'lchov: (2) o'tdi») → `tekshiruv.malumot`, `tekshiruv.olchov`; «Bajardim» «Ma'lumot» belgisidan keyin ochiladi; mobil trekda belgi ostida `eas build` qatori.
   A2 4-bo'limida: (1) tanlov «Android havolasi lendingda» (faqat `tekshiruv.malumot = true` da faol) / «Fayl hali navbatda» → `tekshiruv.havola` (web-trekda — «Havola lendingda» bitta belgi); (2) **post qutisi** (to'rt qator `pm-m10d6-kanallar.post` dan oldindan, tahrirlanadi, «Nusxalash») + **xavfsizlik ro'yxati** — `XAVFSIZLIK` bitta manba (tayanch 1.6, 9.12; 6-dars bilan umumiy), olti belgi + belgisiz qator; tanlov «Yuborildi» (faqat `havola = true` da faol) / «Uyda yuboraman» → `yuborildi`;
   (3) **sanoq formasi** (uch son maydoni `/^\d+$/`, `sana` — `date` bilan) → `royxat`, `sinfdosh`, `asosiy`, `sana`. Trek (`pm-m9d8-platforma.trek`): `web` — brauzer ko'rinishi va `eas build` qatorlari yashirin, web-trek qatorlari ko'rinadi; kalit yo'q bo'lsa — ikkalasi.
   `ortda`: ikkala blokda `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-07-done`.
9. s3/s8 `QTest` — matn yuqoridagidek; s8 ustida kichik ikki sanoq kartasi. `RECAPS` { 3, 8 } (3 karta + `ask`); `Q_LABELS` { 3, 8 }.
10. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s3 birinchi urinish → Estimate Spotter · s5 «Saqlash» → Stage Planner · A1 oxirgi «Bajardim» → Data Minimum · A2 oxirgi «Bajardim» → Launch Ready.
11. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — s10 alohida ekranda.
12. s11 `QYakun`: `recap` 5 qator, «Bugungi asosiy fikr» `small`; `uyga` — `HwCard` (alohida `.homework.jsx` yo'q; ③ bandi holatdan yig'iladi); sarlavha **besh holat** — `pm-m10d7-reja.tekshiruv` (`malumot`, `olchov`, `havola`), `yuborildi` va `bosqichlar.length` dan (P-046; tayanch 8); `keyingi` — «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?».
13. App.jsx `m10-07` qatoriga `comp: PmFiftyUsersLesson` — «qur» bosqichida (asosiy seans; nom va osti o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (3, 8).
- Darvozalar: `npm run gates -- src/10-Modull/PmFiftyUsersLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` · `lint:jsx` 0 · `stilsiz.py` · surat 1280 + 393.

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m12-dars-07-start` → `m12-dars-07-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m12-dars-07-start`** = `m12-dars-06-done` (tayanch 3): `oyinchilar.telefon`, «Hisobdan chiqish», lending «Hozircha o'rnatish havolasi yo'q.», `?kanal=` o'qiladi; `hodisalar` yo'q.
2. **`m12-dars-07-done`** = start + ikki commit, A1/A2 «Yordam» promptlaridagidek (tayanch 3, 1.7):
   - A1 (ilova): `oyinchilar` — `telefon` → `login` (3–20, noyob; `409` «Bu login band»), `namuna` (mavjud hammasi `true` — `ali` va boshqalar namuna login bilan; forma — `false`), `yaratilgan` (mavjudlariga migratsiya vaqti); parollar o'zgarmagan; forma ostida gap (9.7) va `lending/maxfiylik.html` ga havola ·
     «Hisobni o'chirish» (`WHERE oyinchi_id`; e'lon qilgan o'yinlar qoladi, tashkilotchisi bo'sh — 9.8) · `hodisalar` (`id` · `nom` · `qurilma_id` · `yaratilgan`), `POST /hodisalar` (to'rt nom, aks holda `400`), 60 kundan eski — o'chirish; `mobil/` da `hodisaYoz` to'rt joyda · `eas.json` (`preview`: `buildType: apk`, `env.EXPO_PUBLIC_API_URL` — 9.11).
   - A2 (ilovadan tashqari): `lending/maxfiylik.html` (A2 o'ngidagi matn) · brauzer ko'rinishi (`mobil/public/_redirects`, web'da token `localStorage`, eslatma yo'q; Netlify'da alohida sayt) · Backend `WEB_ORIGIN` ga brauzer ko'rinishi manzili (9.10) · lending «Qanday qo'shilaman»: ikki havola va ikki halol qator.
3. README «Darslar va teglar» jadvaliga 7-dars qatori: «login, `namuna`, hisobni o'chirish, qadamlar sanog'i (`hodisalar`), `eas.json`; maxfiylik siyosati, brauzer ko'rinishi, lendingda ikki havola».
4. **Bog'liqlik:** 8-dars `GET /hodisalar/sanoq` va `lending/sanoq.html` shu `hodisalar` ustida; 8, 10, 12-darslar sanog'i `WHERE namuna = false` (9.5); 10-dars kunlar bo'yicha sanoq — `oyinchilar.yaratilgan`.

## Manbalar (o'zim tekshirgan rasmiy sahifalar — 06.10.2026)
- docs.expo.dev/build/setup — «EAS Build is available to anyone with an Expo account»; buyruqlar `npm install --global eas-cli` → `eas login` → `eas build:configure` → `eas build`; «By default, the `eas build` command will wait for your build to complete, but you can interrupt it if you prefer not to wait»; keystore — «let EAS CLI take care of that for you by selecting `Generate new keystore`».
- docs.expo.dev/build-reference/apk — `eas.json` `"preview": { "android": { "buildType": "apk" } }`; `eas build -p android --profile preview`; «copy the URL to the APK from the build details page or the link provided when `eas build` is done … Open the URL on your device, install the APK and run it.»
- docs.expo.dev/build/internal-distribution — «APKs can be installed directly to an Android device … by downloading the file over the web or through an email or chat app», foydalanuvchi «accept the security warning for installing an app that has not gone through Play Store review»; iPhone — «requires a paid Apple Developer account».
- docs.expo.dev/eas/environment-variables — `.env` fayllari «are generally excluded from the project's version control … so they are not available for jobs that run on a remote server, for example, EAS Build». docs.expo.dev/eas/json — `env`: «Environment variables that should be set during the build process. It should only be used for values that you would commit to your git repository and not for passwords or secrets.» → `EXPO_PUBLIC_API_URL` (maxfiy emas) `eas.json` ga (tayanch 9.11).
- docs.expo.dev/guides/publishing-websites — `npx expo export -p web` → `dist`; Netlify: `npm install --global netlify-cli`, `public/_redirects`: `/*    /index.html   200` (o'zgartirilsa qayta eksport), `netlify deploy --dir dist`; lokal: `npx expo serve`. docs.expo.dev/workflow/web — `npx expo install react-dom react-native-web @expo/metro-runtime`.
- Umami, Render, Neon «Run», Expo Go, `expo-secure-store`/`expo-notifications` web'da yo'q — tayanch 6 va 11-Modul tayanchi 6, 9.3, 9.7, 9.82 (qayta ochilmadi).
- 10-Modul: `02-EventTracking-v3.md` (`hodisalar`, `hodisaYoz`, `COUNT(DISTINCT …)`, tekshiruv qatori `WHERE` bilan o'chadi), `06-PmTrustAudit-v3.md` va `06-FILTR.md` (siyosat to'rt savoli, holatni o'quvchi qo'yadi, test ma'lumoti).

---

## TAYANCHGA SAVOL (holat — 06.10 14:12, bosh agent javobi va tayanch 9-bo'lim bo'yicha)
1. ✅ **tayanch 9.3** — O'rnatish fayli: 6-dars uyga vazifasi — faqat o'z telefoniga (odamlarga yuborilmaydi); A1 — ilova ichidagi hamma o'zgarish, oxirida fayl tayyorlana boshlaydi; A2 — navbat paytida siyosat, brauzer ko'rinishi, havola, post. Fayl tayyor bo'lmasa — Android havolasi va post uyda (yakun holati).
2. ✅ **qabul — MD qarori** — Mentor rejasining «qachon» ustuni (ishga tushirish kuni · birinchi hafta · har yangi e'londa) va 2-bosqichda nima yuborilishi («post — birinchi qatori parallel sinflarga moslab»).
3. ✅ **tayanch 9.4; 07-FILTR 1–3, 16, 17 dan keyin:** Mentor misolida aynan (telefon → login), o'quvchi talabida — o'quvchi o'zi yozgan `{ortiqcha ma'lumot}`; migratsiya ikki bosqichda (ro'yxat → «Davom et»). Eski matn: `telefon` → `login` migratsiyasi: akkauntlar o'chmaydi, namuna login, `telefon` qiymatlari bilan o'chadi, parollar o'zgarmaydi.
4. ✅ **tayanch 9.7** — forma gapi «…Loginni boshqa o'yinchilar ko'rmaydi.»; siyosatdagi «kim ko'radi» — tayanch 1.7 A2 dagidek.
5. ✅ **qabul — MD qarori** — A2 4-bo'lim nomi «Havola va post».
6. ✅ **tayanch 9.5; 07-FILTR 2:** o'quvchi talabida qaysi akkaunt namuna ekanini o'quvchi aytadi (agent taxmin qilmaydi); Mentor misolida hammasi. Eski matn: `oyinchilar.namuna` (mavjudlari `true`, forma `false`, agent tekshiruv akkaunti `true` + `id` bo'yicha o'chiriladi); sanoq `WHERE namuna = false`; `NOT IN` ro'yxati olib tashlandi. `yaratilgan` ustuni ham A1 da.
7. ✅ **tayanch 8** — `pm-m10d7-reja` ga `tekshiruv: { malumot, olchov, havola }, yuborildi`; yakun sarlavhasi shulardan.
8. ✅ **tayanch 9.6; 07-FILTR 23:** sinfdosh soni — ixtiyoriy, o'quvchi bilsa kiritadi; sinfda hech kim majburlanmaydi.
9. ✅ **tayanch 9.8** — «Hisobni o'chirish»: e'lon qilingan o'yinlar o'chmaydi, tashkilotchisi bo'sh qoladi.
10. ✅ **tayanch 9.9** — siyosatning «Nima uchun?» javobi — uch gap so'zma-so'z (A2 Yordami va o'ngi).
11. ✅ **tayanch 9.11** — `eas.json` `env.EXPO_PUBLIC_API_URL`.
12. ✅ **tayanch 9.10** — brauzer ko'rinishi va CORS (`WEB_ORIGIN`).
13. ✅ **tayanch 9.12** — xavfsizlik ro'yxati — 1.6 dagi olti band so'zma-so'z, bitta manba `XAVFSIZLIK`.
14. ✅ **qabul — MD qarori** — mustaqil ish maslahatlari va «Qachon» tugmalari (Bugun · Shu hafta · Keyinroq).
15. ✅ **qabul — MD qarori** — O'qituvchi eslatmasidagi parol maslahati.
16. ◐ **07-FILTR 36, 37 (auditor qisman qabul qildi):** fayl A1 oxirida tayyorlanadi, lekin maxfiylik sahifasi va havola tekshirilmaguncha odamlarga berilmaydi — A2 O'qituvchi eslatmasida ochiq. Eski matn: **Forma havolasi A1 da, sahifa A2 da** — «Maxfiylik siyosati» havolasi ilova formasida turadi (ilova o'zgarishi — 9.3 bo'yicha A1, fayl shundan tayyorlanadi); sahifaning o'zi A2 da qo'shiladi. A1 tekshiruvida havola hali bo'sh sahifaga olib boradi — MD buni ochiq aytadi («sahifaning o'zi Amaliyot 2 da qo'shiladi»). Shunday qolsinmi?
17. 🆕 **«Sinov fayli» so'zi** (tayanch 1.6, 9.3) — tayanch 2: «sinov — faqat real odam bilan»; 6-dars uyga vazifasidagi faylni o'quvchi o'zi tekshiradi. MD o'quvchi matnida «sinov fayli» yo'q — «uyda tayyorlagan o'rnatish fayli», «eski kod bilan» deb yozildi. 6-dars MD si ham shu so'zda kelishsinmi (taklif: «birinchi o'rnatish fayli»)?
18. ✅ **07-FILTR 1: endi ikki joy — `{ortiqcha ma'lumot}` va `{qadamlar}`** (tayanch 9.39). Eski matn: **A1 dagi bitta joy — `{qadamlar}`** (qaysi qadam sanalishi — o'quvchi qarori, 7.13). Ma'lumot qismi tayyor talabda: «telefon raqami va boshqa ortiqcha shaxsiy ma'lumot so'ralmasin — o'rniga login» (7.14: telefon hech qayerda so'ralmaydi); o'quvchi qarori — 1-bo'limda formani ko'rib chiqish va 4-bo'limda tekshirish. A2 dagi bitta qator — siyosatning «Nima uchun» javobi (koddan chiqmaydi — egasi biladi). Zinapoya shunday qolsinmi?
19. ✅ **07-FILTR 40: ta'rif sanaladigan qilindi** — «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan» (tayanch 9.23 SQL i shuni sanaydi: `holat IN ('qoshildi', 'keladi')`; «hech bo'lmasa bir marta qo'shilgan»ni joriy sxema ishonchli saqlamaydi); 7, 10, 11, 12-darslar va tayanchda bir shakl. Eski matn: **Asosiy harakat SQL i** — tayanchda Mentor SQL i yo'q (faqat ro'yxatdan o'tgan: `WHERE namuna = false`). MD da agent yozadi, o'quvchi o'qib «Run» bosadi. 10-dars ham shu sonni sanaydi — Mentor SQL i tayanchga yozilsinmi (`ishtirokchilar` dagi `holat` qaysi qiymatlari «qo'shilgan» deb olinadi — 11-Modul 9.74 bilan)?

## Shubhali joylar (ishonchim komil emas)
1. ⚠️ **Brauzer ko'rinishi (iPhone yo'li)** — `npx expo export -p web`, `localStorage`, `_redirects`, Netlify, CORS: hujjatdan yozilgan, qurilmada sinalmagan (Qaror-0 10). Kirish, real vaqt ulanishi (socket.io brauzerda) va `expo-notifications` web'da yo'qligi bilan eksport xatosiz o'tishi — pilotda. Ishlamasa — «faqat Android», lending iPhone qatori eski matn bilan qoladi (MD da yo'l bor).
2. **Bloklar hajmi (≈22 + ≈22 daqiqa):** A1 — migratsiya, «Hisobni o'chirish», hodisalar, uch tekshiruv va fayl; A2 — siyosat, web eksport + Netlify + CORS, havola, post, sanoq. Pilotda taymer bilan; «Ulgurmasangiz» yo'llari va yakunning besh holati shunga qo'yilgan.
   Navbat (Mentor misolida ≈25 daq) A1 oxiridan boshlanadi — A2 tugaguncha tayyor bo'lmasligi mumkin; unda Android havolasi va post uyda.
3. **APK havolasi** — `buildType: apk` profilida havola Expo akkauntisiz ochilishi: hujjat buni `distribution: internal` uchun aniq aytadi («available to anybody with the URL»); oddiy profil uchun alohida tekshirilmadi. Havolaning amal qilish muddati ham tekshirilmadi. Pilotda: havola boshqa telefonda akkauntsiz ochiladimi.
4. **`telefon` → `login`, `namuna`, `yaratilgan` migratsiyasi mavjud qatorlar bilan** (TypeORM `synchronize`, 10-Modul eslatmasi) — agent migratsiyani qanday qilishi noma'lum; talabda natija aniq, usul agentda. 07-FILTR 16, 17: ustun o'chirilishidan oldin agent ro'yxat ko'rsatadi, o'quvchi «Davom et» deydi. Pilotda.
5. **Render deploy paytida ulanish uziladi** (5-dars) — A1 va A2 push'laridan keyin telefondagi ilova qayta ulanadi; MD da aytilmadi (5-dars mavzusi).
6. **`eas build:configure` savollari va kalit oynasi matni** — hujjatdan «Generate new keystore» (iqtibos); boshqa savollar umumiy so'z bilan (1-ekran eslatmasi).
7. **`eas build` terminal chiqishi** — «tayyorlanish sahifasi havolasi» hujjatdan (build details page), lekin terminal matni so'zma-so'z ko'rilmadi; A1 o'ngidagi terminal kartasi umumiy qator bilan.
8. **Expo web eksporti `EXPO_PUBLIC_API_URL` ni lokal `.env` dan oladi** — Expo CLI `.env` ni o'qishi umumiy bilim; bu MD uchun alohida tekshirilmadi.
9. **Hook ekrani Umami qatori** («tashriflar 31 · «Qo'shilmoqchiman» 17») — tayanch 1.6 (6-dars Mentor misoli); 7-darsda qayta ko'rsatish — takror emas, ko'prik deb oldim.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7)
1. [x] Yakun holatga qarab — 11-ekran: besh sarlavha `tekshiruv` va `yuborildi` dan; ✓ va nishon faqat «Yuborildi» da; ③ uyga vazifa holatdan; A2 da uch yashil yakun (yuborildi · uyda · fayl navbatda).
2. [x] Da'vo isbot emas: a) «Bu darsda …» — asosiy fikr, 2-ekran joriy qatori, uch tekshiruv (4-ekran eslatmasi, kartochka izohi), 60 kun — «10-Modul muddati»; b) Mentor misoli umumiy qolip emas — A1/A2 «Yordam» namuna, o'quvchi qadamlari o'ziniki (A1 1-bo'lim), ro'yxatdan o'tish yo'q bo'lsa — Yordam oxirgi qatori;
   c) kafolat yo'q — «chiqishi kerak», «bir necha daqiqa cho'zilishi mumkin», «bo'lishi mumkin», «ko'rinishi kerak»; agent «bajardim» — A1 4-bo'lim «agent nima desa ham, o'zingiz tekshiring», A2 siyosatni kod bilan solishtirish; d) bitta tekshiruv isbot emas — 2-ekran `QIzoh` («taxmin va haqiqiy son teng chiqdi — sizda farq qilishi mumkin»), sonlar «Mentor misolidan — sizda boshqacha».
3. [x] Maxfiy qiymat chiqmaydi — A1 1-bo'lim `.env` `git status` da yo'q; har xato gapida «`.env` qiymatlari, token va kalitlarni emas» (A1 3, A2 3); `eas login` o'quvchining o'zi (1-ekran eslatmasi); `EXPO_PUBLIC_API_URL` maxfiy emas — alohida aytilgan; hodisa bilan ism, login, token yuborilmaydi; postda shaxsiy ma'lumot yo'q (A2 ro'yxati 3-band).
4. [x] Tashqi xizmat faqat rasmiy hujjat — Manbalar bo'limi (EAS, APK, `.env`, Netlify, web export); Netlify sayt yaratish, Render deploy, Telegram — umumiy so'z; brauzer ko'rinishi — «pilotda sinaladi» (A2 3, Shubhali 1); terminal matni chizilmaydi (Shubhali 7).
5. [x] Har sonning manbasi va o'lchovi — 0-ekran Umami qatori (tashrif · bosish), 2-ekran «Mentorning taxmini», ikki sanoq (akkaunt, `namuna = false`), hodisalar (qurilma), «sonlar Mentor misolidan — sizda boshqacha»; 2-ekran eslatmasi — guruh a'zolari soni ≠ kutilgan son; sinfdosh soni — sinfda so'rab.
6. [x] Tayanchda yo'q narsa to'qilmaydi — post, lending matnlari, siyosat matni, forma gapi, sonlar, hodisa nomlari tayanchdan; MD qarorlari — TAYANCHGA SAVOL 2, 5, 14, 15 (qabul) va 16–19 (ochiq).
7. [x] Saqlash kaliti — `pm-m10d7-reja` tayanch 8 aynan (`id` barqaror, 3 bosqich; `tekshiruv` — ish fakti, `yuborildi` — alohida; sonlar `null` gacha); kalit yo'q bo'lsa kanalni o'quvchi yozadi.
8. [x] Test: bitta himoyalanadigan javob — 3-ekran (son javobda yo'q), 8-ekran (11 savolda yo'q); distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, tashqi xizmat haqida distraktor yo'q (arena 8 — tayanch fakti); «Hech qayerda» turidagi variant yo'q.
9. [—] Keys — keyssiz dars (Qaror-0 22).
10. [x] 90 daqiqa — taqsimot sarlavha ostida (A1 ≈22, A2 ≈22, zaxira ≈8); «Ulgurmasangiz» A1, A2 da; «Ortda qoldingizmi»; navbat dars oqimini to'xtatmaydi — fayl A1 oxirida boshlanadi, A2 navbat paytida (9.3).
11. [x] Bir ma'no — bir so'z — A-bo'lim 5: hodisa (analitika), qadam (foydalanuvchi yo'li; blok bo'laklari «1 · Ochish»), bosqich (reja), tekshirish/sinov («sinov fayli» o'quvchi matnida yo'q — TAYANCHGA SAVOL 17), e'lon, kanal, push, akkaunt/hisob.
12. [x] Web-trek teng yo'l — A1, A2 «Web-trek qatori» va Yordamdagi web-trek qatorlari; brauzer ko'rinishi va o'rnatish fayli o'tkaziladi; yakuniy test va yakun ikkala trekka (akkaunt va sanoq); qurilma ID ↔ brauzer ID.
13. [x] Agent va o'quvchi ishi ajratilgan — qarorlar o'quvchida: `{qadamlar}`, `{nima uchun}`, post, «Yuborildi», ikki belgi; agent quradi; tekshiruv o'quvchida; agent tekshiruv akkaunti `namuna = true` + `id` bo'yicha o'chiriladi; `DELETE` faqat `WHERE` (A1 2, 4).
14. [x] O'smir xavfsizligi — telefon so'ralmaydi (A1); kanallar va post qoidalari (5-ekran kirish qatori, A2 olti bandli ro'yxat, uyga vazifa ①); Expo akkaunti berilmaydi; ism «Hozir ko'ryapti»da — bu darsda yo'q; sinfdoshlar — xohishi bilan, familiyasiz, parolini qayta ishlatmaydi (A2 eslatmasi); sonlar baho emas (5-ekran eslatmasi, arena 12).

## O'lchov — `md07/olchov.py` natijasi (qavsdagi sonlar skript bilan to'ldirilgan)
```
Sarlavha [0 · Kirish  ← ]: 34 / ≤55
hook variant A: 46
hook variant B: 43
Javob — B [0 · Kirish  ← ]: 100 / ≤120
Javob — A [0 · Kirish  ← ]: 108 / ≤120
Sarlavha [1 · Reja  ← QR]: 50 / ≤55
Sarlavha [2 · Mentor rej]: 32 / ≤55
Joriy qator (3/3 dan keyin, bitta) [2 · Mentor rej]: 111 / ≤120
Izoh-qator (`QIzoh`, «Ishga tushirish ku [2 · Mentor rej]: 73 / ≤120
Xulosa [2 · Mentor rej]: 103 / ≤110
To'g'ri izohi [3 · 1-savol  ←]: 48 / ≤60
xato izohi A [3 · 1-savol  ←]: 57 / ≤60
xato izohi B [3 · 1-savol  ←]: 57 / ≤60
xato izohi D [3 · 1-savol  ←]: 47 / ≤60
Sarlavha [4 · Uch tekshi]: 46 / ≤55
Joriy qator [4 · Uch tekshi]: 96 / ≤120
Joriy qator [4 · Uch tekshi]: 123 / ≤120  ⚠️
Izoh-qator (`QIzoh`) [4 · Uch tekshi]: 94 / ≤120
Joriy qator [4 · Uch tekshi]: 118 / ≤120
Xulosa [4 · Uch tekshi]: 98 / ≤110
Sarlavha [5 · O'z rejang]: 41 / ≤55
Kirish qatori (kulrang, tepada, bir mart [5 · O'z rejang]: 92 / ≤120
xato · bo'sh kanal [5 · O'z rejang]: 33 / ≤60
xato · bo'sh «nima yuboriladi» [5 · O'z rejang]: 30 / ≤60
xato · son yo'q [5 · O'z rejang]: 36 / ≤60
xato · son oldingi bosqichdagidan kam (m [5 · O'z rejang]: 52 / ≤60
xato · kanalda «notanish», «shaxsiy xaba [5 · O'z rejang]: 49 / ≤60
xato · 3-bosqich soni 50 dan kam (maslah [5 · O'z rejang]: 55 / ≤60
Xulosa [5 · O'z rejang]: 97 / ≤110
Sarlavha [A1 · Amaliyot ]: 51 / ≤55
Hammasi bajarilgach (yashil; mobil trek) [A1 · Amaliyot ]: 85 / ≤110
Hammasi bajarilgach (yashil; web-trek) [A1 · Amaliyot ]: 59 / ≤110
Sarlavha [A2 · Amaliyot ]: 40 / ≤55
Hammasi bajarilgach (yashil; «Yuborildi» [A2 · Amaliyot ]: 87 / ≤110
Hammasi bajarilgach («Uyda yuboraman» bo [A2 · Amaliyot ]: 75 / ≤110
Hammasi bajarilgach («Fayl hali navbatda [A2 · Amaliyot ]: 70 / ≤110
To'g'ri izohi [8 · Yakuniy sa]: 54 / ≤60
xato izohi B [8 · Yakuniy sa]: 56 / ≤60
xato izohi C [8 · Yakuniy sa]: 56 / ≤60
xato izohi D [8 · Yakuniy sa]: 56 / ≤60
Sarlavha [10 · Takrorlas]: 25 / ≤55
Sarlavha · malumot, olchov, havola ✓ va  [11 · Dars yaku]: 30 / ≤55
Sarlavha · malumot, olchov, havola ✓, «U [11 · Dars yaku]: 36 / ≤55
Sarlavha · malumot ✓, lekin havola yoki  [11 · Dars yaku]: 36 / ≤55
Sarlavha · reja saqlangan, malumot yo'q [11 · Dars yaku]: 34 / ≤55
Sarlavha · reja saqlanmagan [11 · Dars yaku]: 43 / ≤55
TEST 3 · 1-savol  ← QTest (✔ C, `co variantlar min/max: 38/45 (farq 17%)
TEST 8 · Yakuniy savol  ← QTest (✔  variantlar min/max: 41/46 (farq 11%)
ARENA 1 min/max: 35/38 (8%)
ARENA 2 min/max: 36/41 (13%)
ARENA 3 min/max: 27/30 (11%)
ARENA 4 min/max: 25/29 (15%)
ARENA 5 min/max: 30/31 (3%)
ARENA 6 min/max: 35/38 (8%)
ARENA 7 min/max: 24/27 (12%)
ARENA 8 min/max: 15/18 (18%)
ARENA 9 min/max: 29/31 (7%)
ARENA 10 min/max: 26/31 (18%)
ARENA 11 min/max: 25/30 (18%)
ARENA 12 min/max: 37/45 (20%)
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}

--- MUAMMOLAR ---
L188 Joriy qator 123>120: Qurilma ID — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi.
```
Sarlavha, xulosa, hook javobi, izoh — belgilar soni (bo'shliq bilan, `**` siz); testlar — eng qisqa / eng uzun variant va farq foizi (±15% → ≤30% oraliq); arena — ✔ o'rni A·B·C·D ×3. Mentor gaplari ko'z bilan sanaldi: hamma ekranda ≤2 gap, interaktivda 1. Joriy qator uchun qat'iy chegara yo'q (≤120 — o'z mo'ljalim); 4-ekranda qurilma ID ta'rifi 123 — tayanch 2 dagi ta'rif so'zma-so'z, qisqartirilmadi.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-06` «Birinchi foydalanuvchilar sizni qayerdan topadi?» → **`m10-07` «50 foydalanuvchiga qanday yetasiz?»** (osti — 1-ekran chap yorlig'ida) → `m10-08` «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» (App.jsx 403–405, grep bilan; yakundagi «Keyingi dars» shu nom).
- [x] Bitta misol-ip — «Maydon Jamoa» (hook → reja → uch tekshiruv → bloklar namunasi); ikkinchi misol faqat 3-ekran testida, o'sha olamda (P-002). Metafora yo'q. Bitta vizual — `IshgaTushirish` (0, 1, 2, 4, 5, 8 va bloklar o'ngi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0 (bo'lim halqada, uch uya), 2 (bosqich → qator, chiziq, chat; ishga tushirish kuni → ikki sanoq), 4 (uch nuqta → forma, yorliqlar, havolalar), 5 (qo'shish → chiziq), A1, A2. Matn-karta yo'q.
- [x] SABOQ 11: harakatli ekranlarda navbatdagi element halqa + pulsatsiya, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz. SABOQ 21/26: maket chapda, jadval o'ngda, ≤3 blok.
- [x] O'lchov (python, `md07/olchov.py`): sarlavhalar ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosalar ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohlari ≤60 · test variantlari ±15% (qavsdagi sonlar).
- [x] Atamalar: kanal · post · kerakli minimum · maxfiylik siyosati · hodisa · qadamlar · talab · agent · tekshirish (tayanch 2, 11-Modul 2, 10-Modul so'zlari); yangi: bosqich · kutilgan son · ro'yxatdan o'tgan / asosiy harakatni qilgan · login · qurilma ID · APK · brauzer ko'rinishi — har biri misoldan keyin ·
  siz-forma; Antigravity promptlari sen-formada (T-002) · tugmalar ot-shaklda yoki siz-formada («Keyingi bosqich», «Ishga tushirish kuni», «Sanashni yoqish», «Bosqichlarni yozing»).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin (skript), to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda · ✔ o'rni: 3-ekran C, 8-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (PM+PRAKT — yakuniy `QTest`) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q — xulosalar «Bu misolda», «Bu darsda»; tashqi qadamlar «chiqishi kerak», «cho'zilishi mumkin», «bo'lishi mumkin».
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «m10-07», «12-Modul» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha — «10-Modulda», «11-Modulda»; dars ichida «6-darsda», «1-ekran» — faqat eslatmalarda) · keyssiz · «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S · PM ko'rildi: T-002/008/009/010/011/014/015/024/029/039/042/043/045/047/048/049/052/064 · P-001/002/004/008/013/014/015/016/025/026/028/036/046/048/052/055/059/062/064/067 ·
  S-001/002/004/006/008/010/015/019/020/026/027 · PM-005/017/020/021/030.
- [x] Tayanch 9 (14:15) bilan moslandi: 9.3 (bloklar), 9.4, 9.5 (`namuna`, `yaratilgan`), 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.12; tayanch 8 (`tekshiruv`, `yuborildi`).
- [ ] (ochiq) TAYANCHGA SAVOL 16–19 (forma havolasi va sahifa vaqti · «sinov fayli» so'zi · A1/A2 joylari · asosiy harakat SQL i). P-011 PM V4 tartibi to'liq emas (keys, koding yo'q) — gibrid dars, 12 ekran (tayanch 4).
