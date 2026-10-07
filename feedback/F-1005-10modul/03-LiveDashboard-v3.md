# 10-Modul (kod: `src/8-Modull`) · 3-dars «Loyiha kuni: jonli dashboard» — MD v3 (loyiha kuni qolipi)

Fayl: `src/8-Modull/LiveDashboardLesson.jsx` · kalit `m8-03` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (P-058 dan farq — SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Jonli mini-dashboard — talab o'quvchidan, agent deyarli real-time dashboard yig'adi»;
natija — «dashboard jonli foydalanuvchilarni ko'rsatadi») · eng yaqin namuna: `feedback/F-1005-9modul/07-MvpFirstScreen-v3.md` va `07-FILTR.md` (tuzilish; matn ko'chirilmadi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **B**, 5-ekran **D**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58 (A1 ≈ 22 · A2 ≈ 16 · A3 ≈ 20; har blokning 5-qadami ≈ 3 daqiqa).
Menyu nomi (DE-205): App.jsx `m8-03` — «Loyiha kuni: jonli dashboard» (osti: «talabni siz yozasiz, agent dashboard'ni yig'adi») ·
oldingi dars `m8-02` «Hodisalar tizimi: har harakat jadvalga yoziladi» · keyingi `m8-04` «Ikki variantdan qaysi biri yaxshiroq ishlaydi?»
(App.jsx 330–332-qatorlar; `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida `maydon` repo'sida «Maydon» saytining `/dashboard` sahifasi ishlaydi (ega paroli bilan): «Oxirgi 5 daqiqada» va uch qadam
   (ochdi → vaqtni tanladi → band qildi; har qadamda turli brauzerlar soni); raqamlar har 5 soniyada o'zi yangilanadi — laptopda ham, internetda (Netlify) ham.
   Backend: `GET /hodisalar/sanoq?kun=` — token bilan (tayanch 3, aynan). Teg: `m10-dars-03-start` → `m10-dars-03-done`.
   Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi. Bugungi yangi ko'nikma — **dashboard talabi**: nimani sanash, kim ko'rishi, qancha tez-tez yangilanishi.
   Kodni agent (Antigravity) yozadi; talab — o'quvchidan.
2. **Bugungi asosiy fikr (P-013):** Dashboard Database'ga kelgan hodisalarni talabdagi qoida bo'yicha sanaydi — shuning uchun qoidani o'zingiz yozasiz va raqamni yangi brauzer bilan o'zingiz tekshirasiz.
   Agent talabga tayanib quradi, aytilmagan joyni taxmin qilishi mumkin (tayanch 7.2) — har blokning 4-qadami shu tekshiruv.
3. **Texnik aniqlik** (manba: repo `dars-11-done` kodi + tayanch 3; taxmin emas):
   - **So'rov (polling).** Sayt kirgandan keyin har 5000 ms da (`setInterval`) `GET /hodisalar/sanoq?kun=YYYY-MM-DD` ga `Authorization: Bearer <token>` sarlavhasi bilan so'rov yuboradi —
     `/ega` dagi `GET /bandlar` so'rovi bilan bir xil yo'l (`web/src/Ega.jsx`). Backend sahifaga o'zi hech narsa yubormaydi (WebSocket yo'q).
     Shuning uchun dastur «deyarli real-time» deydi: yangi hodisa dashboard'da keyingi so'rovda, ya'ni 5 soniyagacha (ustiga tarmoq vaqti) kechikib ko'rinadi.
     Javob `401` bo'lsa — taymer to'xtaydi (`clearInterval`), parol formasi qaytadi. «Polling» so'zi LMS 7-Modul (kod `src/5-Modull`) bot darslaridan tanish («Bot Telegram'dan qayta-qayta so'raydi»).
   - **Token va himoya.** `POST /kirish` parolni `.env` dagi `EGA_PAROLI` bilan solishtiradi → JWT; 12 soat amal qiladi (`backend/src/app.module.ts`: `expiresIn: '12h'`).
     Himoya — NestJS guard `EgaGuard` (`backend/src/ega.guard.ts`): `Authorization` sarlavhasi yo'q, token noto'g'ri yoki eskirgan bo'lsa → `UnauthorizedException` → `401`.
     Yangi yo'lga `@UseGuards(EgaGuard)` — `GET /bandlar` dagidek (`backend/src/bandlar.controller.ts`). Token `/ega` dagidek faqat ochiq sahifa xotirasida (React state) turadi,
     localStorage'ga yozilmaydi — F5 dan keyin parol qayta so'raladi (TAYANCHGA SAVOL 5).
   - **Sanoq (Backend).** `hodisalar` jadvali (`id · nom · brauzer_id · yaratilgan`; `variant` — 4-darsda): har `nom` uchun shu kun `COUNT(DISTINCT brauzer_id)`;
     kun chegarasi — Toshkent vaqti (Render va Neon UTC da ishlaydi — TAYANCHGA SAVOL 2). `hozir` — `yaratilgan` oxirgi 5 daqiqada bo'lgan qatorlar bo'yicha `COUNT(DISTINCT brauzer_id)`,
     kunga bog'liq emas. Hodisa bo'lmasa — 0. Javob shakli: `{ kun, hozir, ochdi, "vaqt-tanladi", "band-qildi" }` (TAYANCHGA SAVOL 3).
   - **Sayt.** `web/src/main.jsx` hozir `/ega` ni yo'l bo'yicha tanlaydi — `/dashboard` ham shu yerga qo'shiladi. Netlify'da `/dashboard` to'g'ridan ochiladi:
     `web/public/_redirects` (`/* /index.html 200`) 9-Moduldan bor, o'zgarmaydi. `/dashboard` va `/ega` ochilganda hodisa yozilmaydi (TAYANCHGA SAVOL 6).
     CORS o'zgarmaydi: `Authorization` sarlavhali so'rov `/ega` da Netlify'dan allaqachon ishlaydi (`main.ts`: `localhost:5173` + `WEB_ORIGIN`).
   - **Brauzer ID** — localStorage `maydon-brauzer` (2-dars). Inkognito oyna alohida xotira bilan ochiladi → sayt unga yangi brauzer ID beradi;
     hamma inkognito oynalar yopilsa, o'sha xotira o'chadi (Chrome). Tekshiruv shu xossaga tayanadi (TAYANCHGA SAVOL 7).
   - Laptopdagi Backend ham, Render'dagisi ham bitta Neon Database'ga yozadi (9-Modul 9-dars: bir xil `DATABASE_URL`) — o'z tekshiruv bosishlaringiz ham sanaladi (TAYANCHGA SAVOL 8).
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **dashboard** — kerakli raqamlarni bir sahifada ko'rsatadigan sahifa; «Maydon»da u har 5 soniyada yangilanadi (`/dashboard`, egaga parol bilan; 03-FILTR 17). Birinchi marta — 0-ekran Mentori: «dashboard (holat paneli)» (lug'at).
     0-ekran sarlavhasida yo'q (T-011). «panel», «boshqaruv paneli» — ishlatilmaydi.
   - **«Oxirgi 5 daqiqada»** (dashboard yorlig'i; kodda `hozir`) — oxirgi 5 daqiqada kamida bitta hodisa yuborgan turli brauzerlar. Birligi — brauzer, odam emas. Bu «hozir saytda turganlar» emas:
     jim o'qib o'tirgan odam 5 daqiqadan keyin sanalmaydi, sahifani yopgan odam yana 5 daqiqa sanaladi (03-FILTR 1; T-044 — eski yorliq «Oxirgi 5 daqiqada» so'zma-so'z ma'nosi bilan zid edi).
   - **uch qadam** — ochdi → vaqtni tanladi → band qildi (yorliq). Dashboard'da har qadam — **turli brauzerlar soni** (tayanch 7.3). «zanjir», «voronka» yo'q.
   - **raqam** — dashboard'dagi har ko'rsatilgan son («bosh raqam», «metrika — sanaladigan raqam» bilan bir oila). «soni» — faqat «turli brauzerlar soni» birikmasida.
   - **hodisa** (`ochdi` · `vaqt-tanladi` · `band-qildi`) · **`hodisalar` jadvali** · **brauzer ID** (tasodifiy harf va raqamlar: bitta brauzerni ajratadi, odamning ismini ham, telefonini ham bildirmaydi — tayanch aynan) — 2-darsdan.
   - **jonli** — sahifani yangilamasdan raqamlar o'zi o'zgaradi; bu darsda — har 5 soniyada. «darrov», «real vaqtda», «shu zahoti» — o'quvchi matnida yo'q (faqat distraktor/bashorat variantida).
   - **token** (4-Modul: parol to'g'ri bo'lsa beriladi, keyingi so'rov u bilan ketadi) · **himoya** (lug'at: auth → himoya) · **talab** (qayerda · nima qilsin · nima buzilmasin — 9-Modul M-q2) ·
     **prompt** (agentga xabar) · **agent** (Antigravity; dastur nomi faqat ochish va yuborish qadamida).
   - **polling** — bir marta, ko'prik sifatida (4-ekran joriy qatori va kartochka): «botdagi polling kabi» (T-052). Asosiy fe'l — «so'raydi».
   - **inkognito oyna** — yangi vosita, A1 da bir marta ochiladi: brauzerning alohida oynasi, sayt uni yangi brauzer deb ko'radi (Chrome'da Ctrl+Shift+N).
   - **tekshirish** — natijani o'zingiz ko'rib chiqasiz. A3 da sinfdosh saytni ochib beradi — bu ham tekshirish. «sinov» (real odam ishlatadi, siz kuzatasiz) bu darsda yo'q (T-015).
   - sayt · Backend · Database · vaqt katagi · band qilish · o'yinchi · maydon egasi (qisqa — «ega») · laptop — tayanchdagidek.
     **Ishlatilmaydi:** server (prozada), baza, sessiya, foydalanuvchi ID, panel, voronka, event (kod ichida — ha), «ekran» dars ekrani ma'nosida (T-064).
5. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya va tashqi raqam yo'q. Raqamlar — faqat Mentor misolidan (tayanch 1, aynan):
   **oxirgi 5 daqiqada 3 · bugun: ochdi 14 · vaqtni tanladi 9 · band qildi 3** (har qadamda turli brauzerlar soni). 4-ekran va A2 dagi 4 · 15 · 10 · 3 — shu holatga bitta yangi o'yinchi qo'shilgani (hisob, yangi raqam emas).
   Arena 11-savoldagi 33 foiz — 3 / 9 (hisob).
6. **Kod yozish — Antigravity (173.1).** Prompt — uch qator, har qator o'z yorlig'i bilan; oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (9-Modul naqshi).
   Promptda faqat repo'dagi nomlar (`GET /bandlar`, `POST /kirish`, `EgaGuard`, `hodisalar`). Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Prompt matni sen-formada (T-002) — o'quvchi agentga buyruq beradi.
7. **Talab zinapoyasi** (9-Moduldan bir pog'ona yuqori — talab u yerda o'tilgan): A1 — talab tayyor, siz `{qanday sanasin}` joyini yozasiz (2-ekrandagi qoida) ·
   A2 — «Nima qilsin» qatorini o'zingiz yozasiz (4-ekran) · A3 — uch qatorni ham o'zingiz. Namuna — «Yordam» ortida.
   Har blokning 5-qadami — **«O'z g'oyangiz»**: shu talabni o'z MVP'ingiz uchun yozasiz (9-Modulda boshlagan MVP — qaror 2; 9-Modul M-q1).
8. **Real odam bilan ish:** A3 da sinfdosh telefonida saytingizni ochadi — dashboard'ni tekshirish uchun (qaror 11 shakli: darsda sinfdosh). **Uyga vazifa yo'q** (P-058): ish repo'da.
9. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; maketlar chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3). Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1) ·
   xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (Mentor misoli, repo `maydon`) — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt.
  2-darsda uch hodisa `hodisalar` jadvaliga yozila boshlagan; bugun maydon egasi ularni bitta sahifada jonli ko'radi.
  O'quvchi blokda Mentor misolini repo'da quradi, 5-qadamda shu talabni o'z MVP'iga yozadi. Kutilgan natija doim «Maydon» bilan ko'rsatiladi.
- **Hook:** dashboard «Oxirgi 5 daqiqada: 3» ko'rsatadi → «bu raqam nimani sanaydi?» → hodisa yuborgan brauzerlar; ochiq sahifani Backend ko'rmaydi.
- **Ip (ot-shaklda):** Sanoq qoidasi → Har 5 soniyalik so'rov → Internetda tekshirish.
- **Bitta vizual — «Maydon» dashboard maketi** (`DASH_NAMUNA` → `DashMaket`, dars bo'yi, 163/180):
  - Brauzer ramkasi (manzil `localhost:5173/dashboard` yoki `maydon-….netlify.app/dashboard`); sahifa sarlavhasi «Maydon · dashboard» (`/ega` dagi «Maydon · ega» naqshi).
  - Tepada katta raqam: **Oxirgi 5 daqiqada: 3**. Ostida «Bugun» va uch qadam — uchta quti, orasida strelka: **ochdi 14 → vaqtni tanladi 9 → band qildi 3**.
    Qutilar «katak» deb atalmaydi — «katak» faqat vaqt katagi (T-015).
  - 2-ekrandan keyin uch qadam ostida kichik izoh: «har qadamda — turli brauzerlar soni». 0- va 1-ekranda yo'q — 2-ekran kashfiyotini oldindan ochmasin (P-015).
  - A3 dan keyin (va 1-ekrandagi tayyor holatda) eng pastda mono qator: «Yangilandi: 18:45:05».
  - Holatlar: qulf (parol formasi) · raqamlar · so'rov ketmoqda (o'ng yuqori burchakda halqa-taymer 5 → 0; 4-ekrandan) · raqam o'zgardi (bir lahza yashil) · `401` (qizil qulf).
  - Yon elementlar (bitta manbadan): **o'yinchi telefoni** — «Maydon» kataklari, «‹ Bugun ›», 16:00 … 21:00, hammasi bo'sh (9-Modul K1 soatlari);
    **`hodisalar` jadvali kartasi** (`nom · brauzer_id · yaratilgan`); **Backend qutisi** (`POST /hodisalar` · `GET /hodisalar/sanoq` qulf belgisi bilan).
  - Ishlatilishi: 0 (namuna holat + «Oxirgi hodisalar» lentasi) · 1 (tayyor holat, bir marta o'zi yangilanadi) · 2 (telefon + jadval + ikki sanoq) ·
    4 (telefon → Backend → dashboard, taymer) · A1–A3 o'ng (kutilgan natija).
  - Namuna vaqt: bugun Dushanba `2026-10-05` (9-Modul K2), soat 18:45. Brauzer ID lar maketda qisqa: `3f2c…`. `prefers-reduced-motion` da konvert va taymer harakatsiz, raqamlar bir zumda almashadi.
- **Yakun:** dashboard jonli, internetda ishlaydi · keyingi dars — tugma matnining ikki varianti.

---

## 0 · Kirish — «Oxirgi 5 daqiqada: 3»  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **«Oxirgi 5 daqiqada: 3» — bu raqam nimani sanaydi?** (49) — 03-FILTR 1, 7
- Mentor: «Maydon» egasi saytdagi raqamlarni bitta sahifada ko'radi — bunday sahifa dashboard (holat paneli) deyiladi. Uch javobdan bittasini tanlang.
- Maket (chap): `DashMaket` namuna holatda, manzil `maydon-….netlify.app/dashboard`: **Oxirgi 5 daqiqada: 3** · Bugun: ochdi 14 → vaqtni tanladi 9 → band qildi 3.
  Raqamlar ostida yopiq lenta «Oxirgi hodisalar» (bo'sh joy, uzuq chiziq — U-041). Burchakda soat: «hozir 18:45».
- Savol: **Sizningcha, qaysi biri?**
  - Shu payt sahifani ochib o'tirgan uch kishi (40)
  - ✔ Shu 5 daqiqada hodisa yuborgan uch brauzer (41)
  - Shu 5 daqiqada band qilgan uch o'yinchi (39)
- Javob — 2-variant: **Aynan!** Bu raqam — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar. Ochiq sahifani Backend ko'rmaydi. (107)
- Javob — 1-variant: **Qiziq fikr!** Ochiq sahifani Backend ko'rmaydi. Bu raqam — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar. (112)
- Javob — 3-variant: **Qiziq fikr!** Band qilganlar «band qildi» qadamida. Bu raqam — 5 daqiqada hodisa yuborgan turli brauzerlar. (109)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → «Oxirgi hodisalar» lentasi ochiladi, to'rt qator birin-ketin kiradi (har brauzerning oxirgi hodisasi):
  - `3f2c…` · 18:44 · `band-qildi` — yashil
  - `a91e…` · 18:43 · `vaqt-tanladi` — yashil
  - `c07b…` · 18:41 · `ochdi` — yashil
  - `e58d…` · 18:36 · `ochdi` — kulrang, yonida «5 daqiqadan oldin — sanalmaydi»
  «Oxirgi 5 daqiqada: 3» dan uchta yashil qatorga ingichka chiziq tortiladi.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook savoli dars obyektining o'zi (P-001): dashboard raqami nimani sanaydi. Uchala tanlov deyarli teng uzunlikda (35–39); «Aynan!» / «Qiziq fikr!» — qoida (tayanch 7.7).
  3-variantdagi «3» bilan «band qildi 3» ning tengligi — tasodif, lekin ishonarli chalg'ituvchi; javobi uni ochiq aytadi.

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida «Maydon» dashboard'i jonli ishlaydi.** (49)
- Mentor: Talabni siz yozasiz, agent dashboard'ni yig'adi. «Maydon» — namuna: har amaliyot oxirida shu talabni o'z MVP'ingiz uchun ham yozasiz.
- Chap — «Dars oxirida»: `DashMaket` **tayyor** holatda, manzil `maydon-….netlify.app/dashboard`, bir marta o'zi yuradi (DE-200):
  «Oxirgi 5 daqiqada» 3 → 4, «ochdi» 14 → 15 — raqam bir lahza yashil. Pastda qotgan qator «Yangilandi: 18:45:05» (vaqt o'zgarmaydi — so'rov oralig'i 4-ekran kashfiyoti, P-015).
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Backend bugungi raqamlarni egaga token bilan beradi (51)
  - 02 · Dashboard raqamlari sahifani yangilamasdan o'zgaradi (52)
  - 03 · Dashboard internetda: sinfdosh kirsa, raqam oshadi (50)
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `m10-dars-03-start` · namuna `m10-dars-03-done`
- Tugmalar: Orqaga · Boshlaymiz
✎ Mentorning birinchi gapi — App.jsx menyu osti yozuvi, so'zma-so'z (P-015). Qadamlarda «turli brauzerlar» va «5 soniya» yo'q — ular 2- va 4-ekran kashfiyoti.

## 2 · Har qadamda nimani sanaymiz?  ← QTushuncha
- Eyebrow: Tushuncha · sanoq
- Sarlavha: **O'yinchi uch katakni bosdi. Dashboard nechta desin?** (51)
- Mentor: Umami'da `vaqt-tanladi` har bosishda oshardi; o'yinchi bo'lib bo'sh kataklarni bosing.
- Bashorat (ballsiz, 181): **«Vaqtni tanladi» nechta bo'lsin?** · Bitta · Ikkita · Uchta — tanlov saqlanadi.
  (Son ekranda bir marta — sarlavhada; Mentor va bashorat uni takrorlamaydi, P-062.)
- Chap (harakat): o'yinchi telefoni — «Maydon», «‹ Bugun ›», olti katak bo'sh (16:00 … 21:00). Sahifa allaqachon ochilgan.
- O'ng (vizual): `hodisalar` jadvali kartasi — bitta qator: `ochdi · 3f2c… · 18:40:02`. Ostida uch qadam ikki qatorda (solishtirish-sahnasi, P-057):
  - «Har qator sanalsa»: ochdi 1 · vaqtni tanladi 0 · band qildi 0
  - «Turli brauzerlar sanalsa»: ochdi 1 · vaqtni tanladi 0 · band qildi 0
- **Harakat → Vizual o'zgarish:** bo'sh katakni bosish → katak kichrayib qaytadi (9-Modul animatsiyasi) → jadvalga yangi qator ajralib kiradi `vaqt-tanladi · 3f2c… · 18:40:15` → ikki sanoq yangilanadi:
  - «Har qator sanalsa»: vaqtni tanladi 1 → 2 → 3;
  - «Turli brauzerlar sanalsa»: vaqtni tanladi 1 → 1 → 1 (2- va 3-bosishda raqam joyida qoladi; jadvalda bir xil `3f2c…` accent bilan belgilanadi).
  - 3/3 dan keyin: «Har qator» qatorida «vaqtni tanladi 3» va «ochdi 1» qizil, orasida uzuq chiziq va yorliq: «Bosishlar sanaldi: vaqt tanlaganlar ochganlardan ko'p.» (54);
    «Turli brauzerlar» qatori yashil ✓, yorliq: «Turli brauzerlar sanaldi: har qadamda bitta.» (44).
  Bir katakni ikki marta bosish ham qator qo'shadi (holat bosishlar sonidan chiziladi — P-046).
- Joriy qator (3/3 dan keyin, bitta): Har qatorda brauzer ID bor: u bitta brauzerni ajratadi, odamning ismini bildirmaydi. (84)
- Natija qatori: «Taxminingiz: … · haqiqatda: bitta — qator uchta, brauzer bitta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu dashboard'da har qadam — turli brauzerlar soni. Shunda qadamlarni foiz bilan mazmunliroq solishtira olamiz. (106)
- Tugadi (199): harakat paneli yopiladi; jadval va ikki sanoq butun enga, yashil qator fokusda; vizual ⛶ ichida (q17).
  Shundan keyin `DashMaket` da uch qadam ostida «har qadamda — turli brauzerlar soni» izohi paydo bo'ladi (A1 dan boshlab doim ko'rinadi).
- Tugma (pastki): Kataklarni bosing (N/3) → Davom etish
✎ Ko'prik (P-020): 9-Modul 6-darsida Umami `vaqt-tanladi` ni har bosishda sanagan («bir odam bir necha marta bosishi mumkin») — bugun sanoq qoidasini o'zimiz tanlaymiz (tayanch 7.3).
  «Telefon va laptop — ikki brauzer» bu yerda aytilmaydi: 1-savol shu qoidani yangi holatda so'raydi (§106 — slayddan ko'chirib bo'lmaydi).

## A1 · Amaliyot 1 — Backend raqamlarni beradi, dashboard ko'rsatadi  ← amaliyot bloki (≈22 daq)
- Eyebrow: Amaliyot 1 · Backend → dashboard
- Sarlavha: **Dashboard bugungi raqamlarni parol bilan ko'rsatsin.** (52)
- Mentor: Talab tayyor — siz `{qanday sanasin}` joyini yozasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda: `cd backend`, `npm run start:dev`. Ikkinchisida: `cd web`, `npm run dev`.
     `backend/.env` dagi `EGA_PAROLI` va `JWT_SECRET` ega sahifasi uchun yozilgan — dashboard o'sha parol bilan ochiladi.
  2. **Prompt** — `{qanday sanasin}` joyiga har hodisa qanday sanalishini yozing (uch katak bosilgan mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: Backend'da yangi yo'l `GET /hodisalar/sanoq?kun=` (kun — sana, masalan 2026-10-05); saytda yangi `/dashboard` sahifasi (`web/`).
     > Nima qilsin: Backend shu kun uchun `hodisalar` jadvalidagi `ochdi`, `vaqt-tanladi`, `band-qildi` hodisalarining har biri uchun **{qanday sanasin}**; hodisa bo'lmasa — 0. Kun Toshkent vaqti bilan.
     > Yana `hozir` bersin: oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar soni.
     > Bu yo'l tokensiz javob bermasin — `GET /bandlar` dagi himoya (`EgaGuard`) bilan.
     > `/dashboard` `/ega` dagidek parol so'rasin (`POST /kirish` → token), keyin bugungi raqamlarni ko'rsatsin: «Oxirgi 5 daqiqada» va uch qadam — ochdi → vaqtni tanladi → band qildi.
     > Token `/ega` dagidek faqat ochiq sahifada tursin.
     > Nima buzilmasin: `POST /hodisalar` va `hodisalar` jadvalining ustunlari, `/ega` va o'yinchi sahifasi; `/dashboard` ochilganda hodisa yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — namuna): «turli brauzerlar sonini bersin (bir brauzer necha marta yozsa ham, bitta sanalsin)»
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi, sayt o'zi yangilandi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — talabning har qatorini tekshiring:
     (1) `localhost:3000/hodisalar/sanoq?kun=` ga bugungi sanani qo'shib oching — raqamlar emas, `401` chiqsin: tokensiz yopiq.
     (2) `localhost:5173/dashboard` — parol bilan kiring: «Oxirgi 5 daqiqada» va uch qadam ko'rinadi.
     (3) Inkognito oyna oching (Chrome va Edge'da Ctrl+Shift+N, Mac'da Cmd+Shift+N) — sayt uni yangi brauzer deb ko'radi. Unda `localhost:5173` ni oching va ikki xil bo'sh katakni bosing.
     Dashboard'ni yangilang (parol so'ralsa — kiriting): «Oxirgi 5 daqiqada», «ochdi» va «vaqtni tanladi» bittadan oshgan — ikki bosish, bitta brauzer.
     Mos kelmagan qatorni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — shu promptni o'z MVP'ingiz uchun yozing: dashboard qaysi uch qadamni sanasin va uni kim ko'rsin? Uch qatorni to'ldiring.
     Qayerda: … · Nima qilsin: … · Nima buzilmasin: … — «Bajardim» uchala qator yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173/dashboard`):
  - Maydon · dashboard
  - **Oxirgi 5 daqiqada: 3**
  - Bugun: ochdi 14 → vaqtni tanladi 9 → band qildi 3 · har qadamda — turli brauzerlar soni
  - ostida ikkinchi brauzer qatori: `localhost:3000/hodisalar/sanoq?kun=2026-10-05` → `401 · Unauthorized`
  - kichik izoh: Sizda raqamlar boshqacha — o'z bosishlaringiz sanaladi.
- Hammasi bajarilgach (yashil): Dashboard bugungi raqamlarni ko'rsatadi, Backend ularni token bilan beradi. (75)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-03-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 4-qadamning (3) bandi `{qanday sanasin}` qatorining tekshiruvi: ikki bosishdan keyin «vaqtni tanladi» ikkitaga oshsa — agent qatorlarni sanagan, talab aniqlashtiriladi.
  A1 da raqam sahifa yangilanganda o'zgaradi — «o'zi yangilanish» A2 ning vazifasi (4-ekran shu savoldan boshlanadi).

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Bugun hali kirmagan o'yinchi saytni telefon va laptopdan ochdi. «Ochdi» nechtaga oshadi?** (12 so'z)
  - Bittaga — brauzerlar bir odamniki (33)
  - ✔ Ikkitaga — har brauzer alohida (30)
  - Nolga — hali katak bosilmagan (29)
  - Bilib bo'lmaydi — ism yozilmagan (32)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («Son — sabab»); «brauzer» ikki variantda (A, B — S-003); to'g'ri variant eng uzun emas.
- To'g'ri izohi: Telefon va laptop — ikki brauzer, ikkalasining ID si boshqa. (60)
- Xato izohlari (≤60):
  - A: Odam bitta — rost. Dashboard esa nimani ajratadi? (49)
  - C: «Ochdi» sahifa ochilganda yoziladi, bosishni kutmaydi. (54)
  - D: Sanash uchun ism kerak emas — jadvalda nima turardi? (52)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda bitta brauzer uch marta bosdi; savol teskari holatni so'raydi — bitta odam, ikki brauzer (§106). «Bugun hali kirmagan» sharti kerak: o'sha brauzer bugun ochgan bo'lsa, qayta sanalmaydi.

## 4 · Raqam o'zi qanday yangilanadi?  ← QTushuncha
- Eyebrow: Tushuncha · yangilanish
- Sarlavha: **Yangi o'yinchi kirdi. Dashboard buni qachon ko'radi?** (52)
- Mentor: Telefonda o'yinchi bo'lib saytni oching va dashboard raqami qachon o'zgarishini kuzating.
- Bashorat (ballsiz, 181): **O'yinchi saytni ochdi. Dashboard'dagi raqam qachon o'zgaradi?** · Shu soniyaning o'zida · 5 soniya ichida · Ega sahifani yangilaganda — tanlov saqlanadi.
- Chap (harakat): o'yinchi telefoni — avval bitta tugma «Saytni ochish»; ochilgach «Maydon» kataklari («‹ Bugun ›», hammasi bo'sh) va 18:00 bosiladigan bo'ladi.
- O'ng (vizual): Backend qutisi (`POST /hodisalar` · `GET /hodisalar/sanoq` qulf belgisi bilan) va `DashMaket` (namuna holat: **Oxirgi 5 daqiqada: 3** · ochdi 14 → vaqtni tanladi 9 → band qildi 3).
  Taymer hali ko'rinmaydi.
- **Harakat → Vizual o'zgarish:**
  - «Saytni ochish» → telefondan Backend'ga konvert `POST /hodisalar · ochdi` → Backend qutisida «+1 qator» → dashboard raqamlari **o'zgarmaydi** →
    dashboard burchagida halqa-taymer paydo bo'lib 5 dan 0 gacha sanaydi → 0 da dashboard'dan Backend'ga konvert `GET /hodisalar/sanoq` + token (qulf yashil) →
    javob konverti qaytadi → «Oxirgi 5 daqiqada: 4», «ochdi 15» bir lahza yashil.
  - 18:00 ni bosish → `POST /hodisalar · vaqt-tanladi` → keyingi taymer 0 da «vaqtni tanladi 10».
  - Shundan keyin taymer aylanaveradi: har 5 soniyada konvert borib-keladi; yangi hodisa bo'lmasa raqam o'zgarmaydi.
- Joriy qator (2/2 dan keyin, bitta): Sayt Backend'dan qayta-qayta so'raydi — botdagi polling kabi. (61)
- Natija qatori: «Taxminingiz: … · haqiqatda: keyingi so'rovda — odatda 5 soniya ichida» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu dashboard'da Backend o'zi yubormaydi: sayt har 5 soniyada so'raydi, raqam shuncha kechikishi mumkin. (103)
- Tugadi (199): harakat paneli yopiladi; Backend qutisi va dashboard taymer bilan butun enga; vizual ⛶ ichida.
- Tugma (pastki): Telefonda bosing (N/2) → Davom etish
✎ Bashorat variantlari bir o'lchovning uch darajasi, o'sish tartibida (S-015): shu soniya → 5 soniya → ega yangilaganda. Taymer birinchi harakatdan keyin chiqadi — bashoratni ochmasin.
  «Backend o'zi yuboradigan» yo'l ham bor — u kartochkada bir marta («bu dashboard'da ishlatilmadi»), ballik testda yo'q (S-004: to'g'ri usulni xato demaymiz).

## A2 · Amaliyot 2 — raqamlar o'zi yangilanadi  ← amaliyot bloki (≈16 daq)
- Eyebrow: Amaliyot 2 · har 5 soniyada so'rov
- Sarlavha: **Dashboard raqamlari sahifani yangilamasdan o'zgarsin.** (53)
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti. `localhost:5173/dashboard` ga parol bilan kiring: raqamlar hali sahifa yangilangandagina o'zgaradi.
  2. **Prompt** — `{nima qilsin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: `/dashboard` sahifasi (`web/`).
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: parol bilan kirish, «Oxirgi 5 daqiqada» va uch qadam, `GET /hodisalar/sanoq` dagi himoya; `/ega` va o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (bosilsa ochiladi — namuna qator): «Nima qilsin: kirgan zahoti raqamlarni bir marta so'rasin, keyin har 5 soniyada `GET /hodisalar/sanoq` dan token bilan qayta so'rab yangilasin;
     oldingi so'rov hali tugamagan bo'lsa, yangisini ustma-ust yubormasin. Javob `401` bo'lsa (token eskirgan) — so'rov to'xtasin, parol formasi qaytsin.» (03-FILTR 4, 5)
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — dashboard ochiq tursin, uni yangilamang. Hamma inkognito oynalarni yoping va yangisini oching — u yana yangi brauzer bo'ladi.
     Unda `localhost:5173` ni oching va bo'sh katakni bosing. Dashboard'ga qayting: keyingi so'rovdan keyin «Oxirgi 5 daqiqada», «ochdi» va «vaqtni tanladi» o'zi oshadi
     (tarmoqqa qarab biroz kechroq bo'lishi mumkin).
     Mos kelmasa — ko'rganingizni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — shu promptni o'z MVP'ingiz uchun yozing: dashboard raqamlari necha soniyada bir yangilansin? Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173/dashboard`, o'ng yuqorida halqa-taymer):
  - Maydon · dashboard
  - **Oxirgi 5 daqiqada: 4**
  - Bugun: ochdi 15 → vaqtni tanladi 10 → band qildi 3 · har qadamda — turli brauzerlar soni
  - (taymer 0 ga yetganda raqam bir lahza yashil)
- Hammasi bajarilgach (yashil): Raqamlar har 5 soniyada o'zi yangilanadi — sahifani yangilash shart emas. (73)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-03-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Inkognito qayta ochiladi: o'sha inkognito oynalarida brauzer ID eski bo'lib qoladi va «ochdi» oshmaydi (bugun allaqachon sanalgan).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Dashboard raqamlari sahifa yangilanmaguncha o'zgarmayapti. Agentga nima yozasiz?** (8 so'z)
  - Dashboard'ni boshidan boshqacha qilib yoz (41)
  - Hodisalarni Database'ga tezroq yozadigan qil (44)
  - Dashboard'ni tokensiz ham ochiladigan qil (41)
  - ✔ Raqamlarni har 5 soniyada qayta so'rab tur (42)
- Kalit: **D** (index 3). To'rttalasi agentga sen-buyruq (T-002), bir shaklda; to'g'ri variant eng uzun emas.
- To'g'ri izohi: Ish aniq: sayt raqamlarni o'zi qayta so'raydigan bo'ladi. (57)
- Xato izohlari (≤60):
  - A: Talab juda keng: qaysi ish o'zgarishi aytilmagan. (51)
  - B: Hodisa yozilgan — sahifa uni qayta so'ramayapti. (48)
  - C: Token yangilanishga xalaqit bermaydi — himoya qolsin. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — dashboard internetda, sinfdosh bilan tekshirish  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 3 · internetda tekshirish
- Sarlavha: **Dashboard internetda: sinfdosh kirsa, raqam oshsin.** (51)
- Mentor: Uch qatorning hammasi sizdan, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti, dashboard raqamlari o'zi yangilanyapti.
  2. **Prompt** — vazifa: uch qadam ostida oxirgi javob kelgan vaqt chiqsin — «Yangilandi: 18:45:05». Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: `/dashboard` sahifasi, uch qadam ostida.
     > Nima qilsin: Backend'dan oxirgi javob kelgan vaqtni «Yangilandi: 18:45:05» ko'rinishida yozsin; har yangi javobda vaqt yangilansin.
     > Nima buzilmasin: har 5 soniyalik so'rov, parol bilan kirish, `/ega` va o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — laptopda «Yangilandi» vaqti har 5 soniyada o'zgaradi. Keyin `git add .`, `git commit -m "dashboard"`, `git push` —
     Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa). Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Internetda tekshirish** — Netlify manzilingizga `/dashboard` qo'shib oching (`….netlify.app/dashboard`) va ega paroli bilan kiring (Render'dagi `EGA_PAROLI`).
     Sinfdoshingiz telefonida Netlify manzilingizni ochib, bo'sh katakni bossin: keyingi so'rovdan keyin «Oxirgi 5 daqiqada» oshadi, «Yangilandi» vaqti yangilanadi;
     sinfdosh saytingizni bugun birinchi marta ochgan bo'lsa — «ochdi» va «vaqtni tanladi» ham oshadi.
     Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha (Render hujjati, tayanch 6).
     Laptopdagi tekshiruvlaringiz ham shu Database'ga yozilgan — ular ham raqamlarda ko'rinadi. Netlify yoki Render yangilanmasa — tekshiruvni laptopda inkognito oyna bilan qiling, push'ni mentor bilan ko'rasiz.
  5. **O'z g'oyangiz** — shu promptni o'z MVP'ingiz uchun yozing: egaga dashboard'da yana qaysi bitta qator kerak? Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon»: chapda sinfdosh telefoni `maydon-….netlify.app` («Maydon», «‹ Bugun ›», 18:00 tanlangan) ·
  o'ngda brauzer `maydon-….netlify.app/dashboard`:
  - Maydon · dashboard
  - **Oxirgi 5 daqiqada: 3**
  - Bugun: ochdi 14 → vaqtni tanladi 9 → band qildi 3 · har qadamda — turli brauzerlar soni
  - Yangilandi: 18:45:05
- Hammasi bajarilgach (yashil): Dashboard internetda ishlayapti: sinfdosh kirsa, raqam keyingi so'rovda oshadi. (79)
- Qator (`QIzoh`, natija ostida; 03-FILTR 11): «Yangilandi» — Backend'dan oxirgi javob kelgan vaqt. U so'rov javob olganini aytadi, raqam to'g'riligini emas. (113)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-03-done`
  (Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan ✎ (06.10, T-036)).
- Nishon (bonus): Live Board — oxirgi «Bajardim»da (5-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ «Yangilandi» qatori — tayanchda yo'q, A3 uchun qo'shildi (TAYANCHGA SAVOL 4): ega raqamlar qanchalik yangi ekanini ko'radi; to'xtab qolsa — so'rov ishlamayapti.
  Xato holati («yangilab bo'lmadi») qo'shilmadi — 8-darsdagi xato holatlari bilan to'qnashmasin.

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — Turli brauzerlar» · 5 — «2 — Yangilanish talabi».

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- ✎ SABOQ 12 (9-Modul F-1005-88, foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta, matn o'zgarmagan (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 7 · Yakun — keyingi dars  ← QYakun (172; kartochkalar — oldingi alohida ekranda)
- Eyebrow: Yakun · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Dashboard jonli: har raqamni tushunib o'qiysiz.** (47)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (4):
  - Bu darsda dashboard talabida uch qaror bor: nimani sanash, kim ko'rishi, qancha tez-tez yangilanishi.
  - Har qadamda turli brauzerlar sanalsa, qadamlarni bir-biri bilan solishtirsa bo'ladi.
  - «Oxirgi 5 daqiqada» — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar; ochiq sahifani Backend ko'rmaydi.
  - Sayt raqamlarni har 5 soniyada so'raydi, Backend ularni token bilan beradi.
- Uyga vazifa — yo'q (P-058, 172.4: ish repo'da; o'z MVP'ingiz har blokning 5-qadamidagi talablar bilan davom etadi — ekranda alohida blok yo'q).
- Keyingi dars — «Ikki variantdan qaysi biri yaxshiroq ishlaydi?»: tugma matnining ikki variantini solishtirasiz, natijasi shu dashboard'da ko'rinadi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Count Right** — Har qadamda brauzerlarni to'g'ri sanadingiz (3-ekran, 1-savol)
- **Auto Update** — To'xtagan yangilanishga aniq talab tanladingiz (5-ekran, 2-savol)
- **Live Board** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Har qadamda — turli brauzerlar soni»
   - `vaqt-tanladi · 3f2c…` ×3 · Uch qator — Bitta brauzer uch marta bosdi.
   - `brauzer_id` · Brauzer ID — Bitta brauzerni ajratadi, odamning ismini bildirmaydi.
   - `vaqtni tanladi 1` · Dashboard — Uch bosish ham bitta brauzer bo'lib sanaladi.
   - Sinfga savol: Nega dashboard bosishlarni emas, brauzerlarni sanaydi?
2. 2-savol (5-ekran) — «Raqamlarni sayt o'zi so'raydi»
   - `setInterval(sora, 5000)` · Taymer — Sayt har 5 soniyada so'rov yuboradi.
   - `GET /hodisalar/sanoq?kun=` · So'rov — Token bilan ketadi, raqamlar qaytadi.
   - `401` · Token eskirdi — So'rov to'xtaydi, parol formasi qaytadi.
   - Sinfga savol: Raqamlar o'zi yangilanmasa, agentga qaysi qatorni yozasiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Dashboard (holat paneli) nima? | Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa | «Maydon» da — `/dashboard`, egaga parol bilan |
| «Oxirgi 5 daqiqada» raqami bu dashboard'da nimani sanaydi? | Oxirgi 5 daqiqada hodisa yuborgan turli brauzerlarni | Ochiq sahifani Backend ko'rmaydi — kelgan hodisani ko'radi |
| Saytni ochib, 6 daqiqa hech narsa bosmagan odam «Oxirgi 5 daqiqada» sanog'ida bormi? | Yo'q | U 5 daqiqa ichida hodisa yubormagan |
| Bitta brauzer uch katakni bossa, «vaqtni tanladi» nechtaga oshadi? | Bittaga | Har qadamda turli brauzerlar soni |
| Nega bosishlar emas, turli brauzerlar sanaladi? | Qadamlarni solishtirish uchun | Bosishlar sanalsa, keyingi qadam oldingisidan ko'p chiqishi mumkin |
| Telefon va laptopdan kirgan bitta o'yinchi nechta brauzer? | Ikkita | Brauzer ID odamni emas, brauzerni ajratadi |
| Dashboard raqamlari qanday yangilanadi? | Sayt har 5 soniyada Backend'dan so'raydi | Botdagi polling kabi: qayta-qayta so'rash |
| Nega har soniyada emas, 5 soniyada so'raladi? | Bu MVP'da 5 soniya tanlandi | Raqam tez yangilanadi, Backend'ga esa har soniyada so'rov ketmaydi |
| Backend sahifaga o'zi yuboradigan usul bormi? | Bor, lekin bu dashboard'da ishlatilmadi | Har 5 soniyalik so'rov — sodda yo'l |
| `GET /hodisalar/sanoq` tokensiz nima qaytaradi? | `401` | Himoya `GET /bandlar` dagi bilan bir xil |
| Token eskirsa, dashboard nima qiladi? | So'rovni to'xtatib, parol so'raydi | Ega tokeni 12 soat amal qiladi |
| Tekshiruvda inkognito oyna nima uchun kerak bo'ldi? | Saytga yangi brauzer bo'lib kirish uchun | Unda brauzer ID yangi — raqamlar bittaga oshadi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3
1. Dashboard (holat paneli) nima? ✔ Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa · O'yinchi bo'sh vaqtni ko'rib, band qiladigan sahifa · Har hodisa bitta qator bo'lib yoziladigan jadval · Backend'ni laptopda ishga tushiradigan buyruq
2. Bu darsda «Oxirgi 5 daqiqada» raqami nimani sanaydi? Bugun saytni bir marta bo'lsa ham ochgan brauzerlarni · ✔ Oxirgi 5 daqiqada hodisa yuborgan turli brauzerlarni · Shu daqiqada sahifasi ochiq turgan hamma odamlarni · Bugun maydonda vaqt band qilgan hamma o'yinchilarni
3. Bitta brauzer uch katakni bosdi. «Vaqtni tanladi» nechtaga oshadi? Uchtaga — har bosish bittadan sanaladi · Nolga — u hali hech narsa band qilmadi · ✔ Bittaga — uch bosish ham bitta brauzer · Ikkitaga — birinchi bosish sanalmaydi
4. Nega dashboard har qadamda turli brauzerlarni sanaydi? Shunda raqamlar kattaroq va ishonchli ko'rinadi · Shunda Backend so'rovga tezroq javob beradi · Shunda Database'da kamroq joy egallanadi · ✔ Shunda qadamlar bir o'lchovda solishtiriladi
5. Dashboard raqamlarni qanday yangilaydi? ✔ Sayt har 5 soniyada Backend'dan so'raydi · Ega har safar F5 tugmasini bosib turadi · Database raqamlarni sahifaga o'zi yuboradi · Umami raqamlarni dashboard'ga ko'chirib beradi
6. `GET /hodisalar/sanoq` ga tokensiz so'rov kelsa-chi? Bugungi raqamlarni to'liq qaytarib beradi · ✔ 401 qaytaradi va raqamlarni bermaydi · «Oxirgi 5 daqiqada» raqamini qaytaradi, xolos · Parol so'raydigan sahifani o'zi ochadi
7. Sinfdosh saytni yopdi. Backend uni qachondan sanamaydi? Sahifani yopgan soniyaning o'zidayoq · Ertaga, yangi kun boshlanganda · ✔ Oxirgi hodisasidan 5 daqiqa o'tgach · Ega dashboard'ni yangilagan paytda
8. Ega dashboard'ni ochdi. «Oxirgi 5 daqiqada» oshadimi? Ha — har ochilgan sahifa sanaladi · Ha — ega ham saytga kirgan odam · Yo'q — ega paroli sanoqni to'xtatadi · ✔ Yo'q — dashboard hodisa yozmaydi
9. Brauzer ID nimani bildiradi? ✔ Bitta brauzerni, odamning ismini emas · O'yinchining ismi va telefon raqamini · Saytga kirgan odamning yoshi va shahrini · Ega paroli bilan berilgan tokenni
10. Dashboard'dagi «Yangilandi» vaqti har 5 soniyada o'zgaryapti. Bu nimani bildiradi? Saytga har 5 soniyada yangi o'yinchi kiryapti · ✔ Backend har so'rovga javob berib turibdi · Token eskirdi, parolni yana kiritish kerak · Raqamlar har yangilanishda bittaga oshyapti
11. Vaqtni tanladi 9, band qildi 3. Necha foizi band qildi? Taxminan 3 foizi · Taxminan 6 foizi · ✔ Taxminan 33 foizi · Taxminan 300 foizi
12. Agent «Tayyor» dedi. Sanoq to'g'riligini qanday tekshirasiz? Agentdan «to'g'rimi?» deb yana bir so'raysiz · Raqamlar katta chiqsa, to'g'ri deb olasiz · Kodni o'qimasdan keyingi talabga o'tasiz · ✔ Inkognito oynada bosib, raqamni kuzatasiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python): to'g'ri variant hech bir savolda yolg'iz eng uzun emas (1-savolda B bilan teng, 50/51); 8-savolda «Ha» 2 · «Yo'q» 2 (S-006);
tire 3- va 8-savolda to'rttala variantda; 6-savolda `401` backtick'siz (kod-belgi faqat to'g'rida bo'lmasin). Savollar ≤12 so'z.
11-savol — 2-ekran xulosasidagi «qadamdan qadamga foiz» va 1-darsdagi foiz ta'rifi (tayanch 2) ustida; 33 = 3 / 9.
Fon so'zlari (R-008, kodda {uz, ru}): dashboard · Oxirgi 5 daqiqada · ochdi · vaqt-tanladi · band-qildi · brauzer ID · `GET /hodisalar/sanoq` · token · `401` · 5 soniya · inkognito · `EgaGuard` · Netlify · Maydon

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards · summary. `INLINE_KEYS` 2: 3-ekran **1 (B)**, 5-ekran **3 (D)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`DASH_NAMUNA` + `DashMaket`** — bitta manba (180): `{ kun: '2026-10-05', hozir: 3, ochdi: 14, tanladi: 9, band: 3, yangilandi: '18:45:05' }`;
   proplar: `izoh` (2-ekrandan keyin «har qadamda — turli brauzerlar soni»), `yangilandi` (1-ekran va A3), `taymer` (4-ekran, A2), holatlar (qulf · raqamlar · o'zgardi · `401`).
   0, 1, 2, 4-ekran va A1–A3 o'ng tomoni shundan o'qiydi. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
3. **`MaydonTelefon`** (o'yinchi; soatlar 9-Modul `MAYDON_KATAKLAR` bilan bir xil), **`HodisaJadval`** (`nom · brauzer_id · yaratilgan`), **`BackendQuti`** — 2 va 4-ekranda; A3 o'ngida telefon.
4. 0-ekran `QKirish` (maket = `DashMaket` + «Oxirgi hodisalar» lentasi, javobdan keyin ochiladi; to'rt namuna qator — A-bo'limdagidek).
   2-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, katak bosish → jadval qatori + ikki sanoq (holat bosishlar ro'yxatidan chiziladi — P-046), `zoom`, `tugadi`.
   4-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, ikki harakat (sayt ochish → 18:00) → konvertlar, taymer 5 → 0 birinchi harakatdan keyin, `zoom`, `tugadi`.
5. 3 va 5-ekran `QTest` — matn yuqoridagidek; xato izohlari ≤60, to'g'ri izoh ≤60.
6. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (9-Modul `src/7-Modull/MvpFirstScreenLesson.jsx` naqshi: `GoyaForma`, `yordam`, `forma: true`, `XATO_YOLI`). Har blok **5 qadam**.
   - A1 promptida bitta `{qanday sanasin}` joyi; A2 — `{nima qilsin}`; A3 — uch joy (`A3_JOY` naqshi). «Yordam» — A1 namuna ibora, A2 namuna qator, A3 namuna talab.
   - 4-qadam nomi: «Brauzerda tekshirish» (A1, A2) · «Internetda tekshirish» (A3). O'ng: A1 — `DashMaket` + `401` qatori; A2 — `DashMaket` taymer bilan (4 · 15 · 10 · 3); A3 — telefon + `DashMaket` «Yangilandi» bilan.
   - `ortda`: A1 = `m10-dars-03-start`, A2/A3 = `m10-dars-03-done` (`ORTDA_FETCH` — `git fetch https://github.com/Azizbekcrypto/maydon --tags`).
7. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Count Right, 5-ekran → Auto Update, A3 oxirgi «Bajardim» → Live Board.
8. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` yo'q, `recap` 4 qator, `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m8-03-v1`, `lessonTitle` — «Loyiha kuni: jonli dashboard». App.jsx `m8-03` qatoriga `comp` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-03-start` → `m10-dars-03-done`; yozish — «qur» da, 9-Modul repo'si yopilgandan keyin, qaror 3)
1. **`m10-dars-03-start`** = `m10-dars-02-done` (tayanch 3 naqshi: keyingi dars boshi = oldingi dars oxiri).
2. **`m10-dars-03-done`** = start + A1–A3 namunasi («Maydon»):
   - `backend/`: `GET /hodisalar/sanoq?kun=YYYY-MM-DD` — `@UseGuards(EgaGuard)` (tokensiz `401`); `kun` noto'g'ri bo'lsa `400` (`sanaTogrimi`, `GET /bandlar` dagidek).
     Javob `{ kun, hozir, ochdi, "vaqt-tanladi", "band-qildi" }`: har hodisa — shu kun (Toshkent vaqti, `Asia/Tashkent`) bo'yicha `COUNT(DISTINCT brauzer_id)`;
     `hozir` — oxirgi 5 daqiqadagi qatorlar bo'yicha `COUNT(DISTINCT brauzer_id)`; hodisa bo'lmasa 0. Muhrdan oldin tekshiruv: 23:59 va 00:01 dagi hodisalar Toshkent kuniga to'g'ri tushadi (03-FILTR 6). `POST /hodisalar` va jadval ustunlari o'zgarmagan.
   - `web/`: `Dashboard.jsx` — parol → `POST /kirish` → token (sahifa state'ida, localStorage'ga yozilmaydi); «Maydon · dashboard», «Oxirgi 5 daqiqada», uch qadam, «har qadamda — turli brauzerlar soni»;
     kirgan zahoti bir marta, keyin har 5 s `GET /hodisalar/sanoq?kun=<bugun>` (`Authorization: Bearer …`); oldingi so'rov tugamagan bo'lsa yangisi yuborilmaydi; sahifadan chiqilsa yoki `401` kelsa `clearInterval` va parol formasi;
     «Yangilandi: HH:MM:SS» — oxirgi muvaffaqiyatli javob vaqti. `main.jsx` — `/dashboard` yo'li. `/dashboard` va `/ega` hodisa yozmaydi. `_redirects` o'zgarmagan.
   - README: «Darslar va teglar» jadvaliga 3-dars qatori; «Xatolar» jadvaliga: `/dashboard` da `401` — parol noto'g'ri yoki token eskirgan (12 soat) ·
     raqam oshmayapti — o'sha brauzer bugun allaqachon sanalgan, yangi inkognito oyna bilan tekshiring · raqamlar yarim tundan keyin nolga qaytadi — yangi kun (Toshkent vaqti).
3. **Shart:** `m10-dars-03-start` va `m10-dars-03-done` teglari kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida) bo'lishi kerak.
4. **Bog'liqlik:** 4-dars A/B — shu javobga A va B foizi qo'shiladi (`variant` ustuni 4-darsda); 8-dars — so'rovlar chegarasi `GET /hodisalar/sanoq` ga qo'yilmaydi (tayanch 3: faqat `POST` yo'llar).
   Javob shakli 4-dars MD si bilan bir xil bo'lishi kerak (TAYANCHGA SAVOL 3).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ✅ (03-FILTR 1: yorliq «Oxirgi 5 daqiqada», birligi brauzer — tayanch 2) **«Hozir saytda» birligi — brauzer.** Tayanch 1-bo'lim jadvalida «hozir saytda nechta **odam**», 3-bo'limda — «turli brauzerlar». Darsda «brauzer» deb yozdim (brauzer ID odamni ajratmaydi; 1-savol aynan shu).
   Dashboard yorlig'i «Oxirgi 5 daqiqada» birliksiz qoladi. Tayanch jadvalidagi «odam» so'zi «brauzer» ga tuzatilishi kerakmi?
2. **Kun chegarasi — Toshkent vaqti.** Tayanchda yo'q. Render va Neon UTC da: «kun» UTC bo'yicha olinsa, 00:00–05:00 dagi hodisalar oldingi kunga tushadi. A1 promptiga «Kun Toshkent vaqti bilan» qo'shdim; 4-dars (A/B foizi) ham shu chegarada bo'lishi kerak.
3. **`GET /hodisalar/sanoq` javob shakli** — `{ kun, hozir, ochdi, "vaqt-tanladi", "band-qildi" }` (hodisa nomlari kalit bo'lib). Tayanchda faqat «har hodisa — turli brauzerlar soni, `hozir`».
   4-dars shu javobga A/B foizini qo'shadi — shakl ikkala MD da bir xil bo'lsin.
4. **«Yangilandi: HH:MM:SS» qatori (A3)** — tayanchda yo'q. Nega: A3 uchun uchinchi kichik ish kerak va «deyarli jonli» raqam qanchalik yangi ekanini ega ko'rsin. Xato holati («yangilab bo'lmadi») qasddan qo'shilmadi — 8-darsdagi xato holatlari bilan to'qnashmasin.
   Rad etilsa A3 — faqat push va internetda tekshirish (prompt — «/dashboard Netlify'da ham ishlasin» tekshiruvi) bo'ladi.
5. **Token qayerda turadi** — `/ega` dagidek sahifa state'ida (localStorage'ga yozilmaydi), F5 dan keyin parol qayta so'raladi. Tayanchda yo'q; xavfsizlik darsi (5) bilan zid emas deb oldim. `/dashboard` va `/ega` — har biri o'z parol formasi bilan (bitta kirish emas).
6. **`/dashboard` va `/ega` hodisa yozmasligi** — 2-dars `hodisaYoz('ochdi')` qayerda chaqirilishiga bog'liq (o'yinchi sahifasidami yoki `main.jsx` dami). Ega dashboard'ni ochsa «ochdi» va «hozir» oshmasligi kerak — A1 «Nima buzilmasin» da va arena 8-savolda shunday.
   2-dars MD si va `m10-dars-02-done` bilan solishtirish kerak.
7. **Inkognito oyna bilan tekshirish** — yangi vosita (oldingi darslarda grep: 0). 2-darsdagi brauzer ID localStorage'da (`maydon-brauzer`) bo'lgani uchun ishlaydi; agar 2-dars boshqa joyda saqlasa — tekshiruv qayta yoziladi.
8. **Laptop va Render bitta Neon Database'ga yozadi** — o'z tekshiruv bosishlaringiz ham dashboard'da sanaladi (bosh raqam halolligi). Darsda faqat A1 o'ng tomonidagi izohda («o'z bosishlaringiz sanaladi»). 8-darsdagi prod ro'yxatiga kerakmi?
9. **Namuna qatorlar** — 0-ekrandagi to'rt brauzer (`3f2c…` 18:44 `band-qildi` · `a91e…` 18:43 · `c07b…` 18:41 · `e58d…` 18:36) va soat 18:45, sana `2026-10-05` (9-Modul K2) — mexanizmni ko'rsatish uchun namuna, statistika emas. Mentor raqamlari (3 · 14 · 9 · 3) o'zgarmagan.
10. **Talab zinapoyasi** — A1 bitta joy · A2 bitta qator · A3 uch qator (9-Modulda A1 `{kun}` · A2 «Nima buzilmasin» · A3 uch qator edi). 4, 8, 9-darslarda ham shu pog'onadanmi?
11. **Dashboard faqat bugungi kun** — kun almashtirgichi yo'q (tayanchda ham yo'q); `?kun=` parametri Backend'da bor. 4-dars uchun yetadimi?
12. **Uyga vazifa** — P-058 bo'yicha yo'q; `MD_AGENT_TOPSHIRIQ.md` Yakun ro'yxatida «uyga vazifa» bandi bor — loyiha kunida «yo'q» deb yozdim (9-Modul 7, 9, 11-darslar bilan bir xil).

## Shubhali joylar (ishonchim to'liq emas)
- **401 javobi matni.** NestJS `UnauthorizedException()` tanasi `{"message":"Unauthorized","statusCode":401}` — maydonlar tartibi versiyaga bog'liq (9-Modul MD sida teskari tartibda). MD da faqat «`401 · Unauthorized`» yozdim.
- **Inkognito klavishlari:** Chrome va Edge — Ctrl+Shift+N (Mac — Cmd+Shift+N); Firefox — Ctrl+Shift+P (yozmadim). «Hamma inkognito oynalar yopilsa xotira o'chadi» — Chrome xatti-harakati; boshqa brauzerlarda tekshirilmagan.
- **Bir-birini quvib ketgan so'rovlar:** Render uyg'onayotganda (≈1 daqiqa) `setInterval` javob kelmasdan yangi so'rov yuboraveradi. Talabda bu yozilmagan; agent buni o'zicha hal qilishi ham, qilmasligi ham mumkin.
- **«Hozir» — 5 daqiqa oynasi:** saytni ochib, jim o'qib o'tirgan odam 5 daqiqadan keyin sanalmaydi (kartochkada halol aytildi). Tayanch ta'rifi shunday — o'zgartirmadim.
- **`band-qildi` brauzerlari `vaqt-tanladi` ichida** — odatda shunday (band qilish uchun avval katak bosiladi), shuning uchun 3 / 9 foizi ma'noli. Yarim tunda forma ochiq qolsa, istisno bo'lishi mumkin.
- **Hook 3-varianti:** «hozir 3» va «band qildi 3» tengligi — ishonarli chalg'ituvchi, lekin auditor «tasodifiy tuzoq» deyishi mumkin.
- **«Bir necha daqiqa»** (Render va Netlify yangilanishi) — soni manbasiz, shuning uchun aniq son yozmadim.
- 2-ekran yorlig'i «Bosishlar sanaldi: vaqt tanlaganlar ochganlardan ko'p.» — «Har qator» rejimidagi bitta brauzer misolida rost (3 > 1); umumiy qoida qilib aytilmagan.

---

## Qurilish (06.10.2026, F-1005-181) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- `lessonTitle.ru` — «День проекта: живой дашборд». A3 4-qadamdan «(Render hujjati, tayanch 6)» olindi (ichki havola). Prompt satrlari backtick'siz (so'zlar aynan).
- Maketga yangi yorliqlar: «Parol», «Kirish» (qulf formasi), konvert yorlig'i «javob», «o'yinchi telefoni» / «sinfdosh telefoni»; 2-ekranda namuna vaqtlar 18:40:19, 18:40:24.
- 0-ekran: javobdan keyin «Oxirgi hodisalar» lentasi, «3» dan uch yashil qatorga chiziq. 5-ekran: 18:00 birinchi o'zgarish ko'ringach ochiladi (kechikish ikki marta ko'rinadi).
- A2 natijasi 3·14·9·3 → birinchi so'rovda 4·15·10·3; A3 da «Yangilandi» 18:45:05 dan +5 s. Telefon kataklari 2×3. A3 qatori «o'tgan moduldagi deploy'dan» ✎ (T-036).
- MD ga taklif (agent): arena 3-savolda bitta chalg'ituvchiga «brauzer» so'zi (lint:tell warn).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-02` «Hodisalar tizimi: har harakat jadvalga yoziladi» → **`m8-03` «Loyiha kuni: jonli dashboard»** (osti so'zma-so'z 1-ekran Mentorida) →
  `m8-04` «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» (App.jsx 330–332, grep bilan).
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · keyssiz · bitta vizual dars bo'yi — `DashMaket` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (katak bosish → jadval qatori, ikki sanoq), 4 (sayt ochish / katak → konvert, taymer, raqam); 0-ekran ham javobdan keyin o'zgaradi.
- [x] Sarlavhalar ≤55 bitta qator (44–53) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 (100, 103) · hook javobi ≤120 (102–111) ·
  to'g'ri izoh ≤60 (57, 60) · xato izohlari ≤60 (48–58). Sanoq python bilan (belgi soni).
- [x] Atamalar tayanch bilan bir xil: dashboard (birinchi marta «holat paneli» bilan) · hodisa · uch qadam · brauzer ID · token · talab · agent · tekshirish; «panel», «sessiya», «baza», «server», «voronka», «sinov» yo'q ·
  siz-forma; Antigravity promptlari va 5-savol variantlari sen-formada (T-002) · tugmalar ot-shaklda yoki siz-formada («Kataklarni bosing», «Telefonda bosing»).
- [x] Testlar: variantlar 29–33 va 41–44 belgi, to'g'ri variant eng uzun emas; tire to'rttala variantda (1-savol) yoki hech birida (2-savol); dars atamasi kamida ikki variantda ·
  ✔ o'rni: 3-ekran B, 5-ekran D · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «real vaqtda» — o'quvchi matnida yo'q; «Shu soniyaning o'zida» — faqat bashorat va arena distraktorida).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «m8-03», «10-Modul» yo'q; blok o'quvchiga «Amaliyot 1») · tarixiy voqea va real kompaniya raqami yo'q · «KOD» (11) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/011/014/015/020/029/039/042/043/047/048/052/064 · P-001/008/013/015/020/026/036/046/052/057/058/062/063/064/067 · S-001/003/004/006/009/010/015/020/026/031/034 — ko'rildi.
- [ ] P-028 (tashqi qadam): Chrome/Edge inkognito klavishi va Netlify/Render avtomatik yangilanishi — tekshirilgan bilim, lekin darsdan oldin brauzerda bir marta ko'rib chiqish kerak (shubhali joylar).
- [ ] Tayanchda yo'q to'rt qaror (Toshkent vaqti, javob shakli, «Yangilandi» qatori, `/dashboard` hodisa yozmasligi) — TAYANCHGA SAVOL 2, 3, 4, 6; 2- va 4-dars MD lari bilan solishtirish kerak.
