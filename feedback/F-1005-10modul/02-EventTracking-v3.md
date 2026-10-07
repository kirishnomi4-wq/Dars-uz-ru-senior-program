# 10-Modul · 2-dars «Hodisalar tizimi: har harakat jadvalga yoziladi» — MD v3 (yangi dars, TEX — modulning texnik cho'qqisi)

Fayl: `src/8-Modull/EventTrackingLesson.jsx` (kalit `m8-02`) · **18 ekran** (13 dars ekrani + 2 amaliyot bloki + podium, takrorlash, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Qolip: texnik dars (QTushuncha, QKod, QTest) + 2 amaliyot bloki repo `maydon` ustida. Kod — `src/skelet/NamunaDars.jsx` dan.
Namuna (tuzilish, hajm): 9-Modul `04-MvpArchitecture-v3.md`, `05-Animation-v3.md` va ularning `04-FILTR.md`, `05-FILTR.md` — matn ko'chirilmadi.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
Menyu (DE-205, App.jsx `m8-02`): «Hodisalar tizimi: har harakat jadvalga yoziladi» · osti «hodisa → Backend → Database, uch hodisa» ·
oldingi dars `m8-01` «Bir oyda qaysi raqamni o'stirasiz?» · keyingi `m8-03` «Loyiha kuni: jonli dashboard».
Vaqt: ≈ 90 daqiqa — 0–12-ekranlar ≈ 45 · A1 ≈ 20 · A2 ≈ 20 · natija va yakun ≈ 5.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9: «mahsulotning 3 hodisasi Database'ga yoziladi»).** Dars oxirida o'quvchining `maydon` repo'sida o'z hodisalar tizimi ishlaydi:
   jadval `hodisalar` (`id` · `nom` · `brauzer_id` · `yaratilgan`) · Backend'da `POST /hodisalar` (`nom` — uchtadan biri, aks holda 400) · saytda `hodisaYoz(nom)` uch joyda:
   `ochdi` · `vaqt-tanladi` · `band-qildi`. Umami qoladi — ikki tizim soni solishtiriladi. Teglar: `m10-dars-02-start` → `m10-dars-02-done` (tayanch 3-bo'lim).
2. **Bugungi asosiy fikr (P-013):** Hodisalar o'z jadvalimizda turgani uchun uch qadamni bitta qoida bilan sanaymiz: har qadamda turli brauzerlar soni.
3. **Oldingi darslardan keladigan narsa (`dars-11-done` = `m10-dars-02-start`, repo'dan o'qildi):** sayt `web/` (React, Motion), Backend `backend/` (NestJS + TypeORM, `synchronize: true`),
   Database — Neon; yo'llar `GET /vaqtlar?kun=` · `POST /bandlar` (`409 · Bu vaqt band`) · `POST /kirish` · `GET /bandlar`; ega sahifasi `/ega`.
   Umami: sahifa ochilishi — avtomatik (`web/index.html` skripti), `vaqt-tanladi` — katakdagi `data-umami-event`, `band-qildi` — band saqlangach `window.umami?.track?.('band-qildi')`.
   1-darsdan: bosh raqam — haftada band qilingan vaqtlar (tayanch 1-bo'lim).
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim):**
   - **hodisa** — analitikaga yoziladigan bitta harakat (9-Modul ta'rifi, so'zma-so'z). Bu darsda 2-ekranda tenglashtiriladi: «Jadvaldagi har qator — bitta hodisa» (T-052).
     Nomlar: `ochdi` · `vaqt-tanladi` · `band-qildi` (kichik harf, so'zlar chiziqcha bilan, o'tgan zamon fe'li — 9-Modul qoidasi). Kodda ham, prozada ham «event», «voqea» ishlatilmaydi (`hodisaYoz`, `hodisalar`).
   - **uch qadam** — yorliq «ochdi → vaqtni tanladi → band qildi» (tayanch); ustun yorliqlari ham shu so'zlar bilan.
   - **o'z jadvalimiz** — `hodisalar` jadvali; **o'z tizimimiz** — jadval + `POST /hodisalar` + `hodisaYoz` (faqat 11-ekranda, tayanch iborasi «Bir kun, ikki tizim»). Dars nomidagi «hodisalar tizimi» — shu.
   - **sayt · Backend · Database · jadval · ustun · qator** — 9-Modul atamalari; «qator» bu darsda **faqat jadval qatori** (T-015). Shuning uchun brauzer ID ta'rifida «tasodifiy qator» o'rniga
     «tasodifiy harf va raqamlar» (TAYANCHGA SAVOL 3).
   - **yo'l (route)** — method + manzil: `POST /hodisalar` (9-Modul 4-dars). «Yo'l» boshqa ma'noda ishlatilmaydi — dars vizuali «Hodisalar chizmasi» deb ataladi, «hodisa yo'li» emas.
   - **brauzer ID** — YANGI: «tasodifiy harf va raqamlar: bitta brauzerni ajratadi, odamning ismini ham, telefonini ham bildirmaydi» (tayanch ta'rifi, bitta so'z almashgan).
     6-ekranda harakatdan KEYIN tug'iladi (T-011). Kodda `brauzer_id`; brauzer xotirasidagi kalit `maydon-brauzer`. Ishlatilmaydi: «sessiya», «foydalanuvchi ID».
   - **brauzer xotirasi (localStorage)** — brauzer o'zida saqlaydigan kichik xotira; sahifa yopilib qayta ochilsa ham qiymat qoladi (2-Modulda «brauzer eslab qoladi» deb tanishgan). Faqat 6-ekran, 8-ekran va A2.
   - **`hodisaYoz(nom)`** — saytdagi bitta funksiya: hodisani Backend'ga yuboradi.
   - **400** — so'rov rad etildi (4a-Modul NestJS darsida «400 — rad etildi»); **201** — yozildi; **409** — «Bu vaqt band» (9-Modul).
   - **sanoq sharti** — «har qadamda turli brauzerlar soni» (tayanch 7-bo'lim 3). SQL: `COUNT(DISTINCT brauzer_id)` — yangi, 9-ekranda tayyor SQL sifatida (yodlatilmaydi).
   - **Umami · Visitors · Events** — 9-Modul 6-darsdan (Umami interfeysi so'zlari tarjima qilinmaydi, T-033).
   - **agent** — Antigravity; **prompt** — agentga xabar, uch qatori «Qayerda · Nima qilsin · Nima buzilmasin» (9-Modul M-q2). Agent talabga tayanib quradi, taxmin qilishi mumkin —
     natijani o'quvchi terminal va Neon'da o'zi tekshiradi (tayanch 7-bo'lim 2).
   - **Ishlatilmaydi:** «treking/tracking» prozada · «kuzatish/kuzatuv» analitika ma'nosida (modulda — sinov so'zi) · «sinov» (faqat real odam bilan; o'z ishini ko'rish — «tekshirish») · «baza» · «voronka».
5. **Mentor misolidagi raqamlar (tayanch 1-bo'lim, aynan):** «Bir kun, ikki tizim» — Umami 31 · o'z tizimimiz `ochdi` 36. Sanoq sharti — har qadamda turli brauzerlar soni.
   Farq bo'lishi tabiiy; sabablardan biri — reklama to'sgichi Umami skriptini to'sishi mumkin. Umami tomonidagi son — **Visitors** deb olindi (bir o'lchov — turli brauzerlar; TAYANCHGA SAVOL 1).
   9-Modul 6-darsidagi «uch son har xil o'lchov» muammosiga ko'prik — 9-ekran (`feedback/F-1005-9modul/06-FILTR.md` 1-band).
   Jadvaldagi namuna qatorlar (6, 9, 10-ekranlar; ID `7f3a…` · `c91e…` · `e05b…`) — mashq uchun yozilgan jadval ma'lumoti, statistika emas (TAYANCHGA SAVOL 6).
6. **Metafora yo'q. Keyssiz** (TEX — tayanch 5-bo'lim). Qahramon yo'q — vazifani Mentor beradi; odamlar: o'yinchi, maydon egasi.
7. **Kod yozish:** Backend va yuborish funksiyasini Antigravity yozadi (prompt), **uch chaqiruvni o'quvchi qo'lda yozadi** — avval kod oynasida (8-ekran, QKod), keyin repo'da (A2 3-qadam).
   Hodisani qayerda yozish — darsning asosiy ko'nikmasi. Xato yo'li har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» Har blok oxirida — «O'z g'oyangiz» (9-Modul M-q1).
8. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; chizma CSS/SVG bilan, logotip yo'q; «to'sgich» — chizilgan yorliq; rang — faqat holat foni (D3).
9. **Texnik faktlar (manba, 05.10.2026 tekshirildi; o'quvchiga ko'rinmaydi):**
   - TypeORM `synchronize: true` — jadval entity'dan ilova ishga tushganda o'zi yaratiladi (repo `app.module.ts` da bor; typeorm.io «Data Source Options»).
   - NestJS: `@Post()` javobi sukut bo'yicha `201`; `BadRequestException` — `400` (docs.nestjs.com «Controllers», «Exception filters»).
   - localStorage — «the stored data is saved across browser sessions», origin bo'yicha alohida; inkognito oynada «cleared when the last "private" tab is closed» (MDN `Window.localStorage`).
     `localhost:5173` va Netlify manzili — ikki xil origin, ikki xil brauzer ID.
   - `crypto.randomUUID()` — «available only in secure contexts (HTTPS)», 36 belgili v4 UUID (MDN); `localhost` ham xavfsiz kontekst. Boshqa HTTP manzilda ishlamaydi — REPO 4-band.
   - Umami Visitors — «Unique number of sessions. A session is calculated using a hash of data such as Website ID, hostname, User-Agent, etc and a rotating salt…» (docs.umami.is «Metric definitions»).
     Ya'ni Umami brauzerni o'z usuli bilan taniydi, biz — brauzer ID bilan; sonlar to'liq mos kelishi shart emas.
   - PostgreSQL: `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;` — har nom uchun takrorlanmagan `brauzer_id` soni.
   - React `StrictMode` dev rejimida effektni ikki marta ishga tushiradi — shuning uchun `ochdi` `useEffect` da emas, `main.jsx` da bir marta chaqiriladi (REPO 5-band).

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. 9-Moduldan keyin u ishlaydi va Umami bilan o'lchanadi.
  Bugun shu saytning uch hodisasi o'z jadvalimizga ham yoziladi.
- **Hook:** reklama to'sgichi yoqilgan telefonda o'yinchi band qiladi → `bandlar` da qator bor, Umami'da hech narsa yo'q → «Umami'ga yetmagan harakatni o'zimiz yozsak-chi?» →
  2-ekranda hodisa saytdan Backend orqali jadvalga boradi → 4 nom tekshiruvi → 6 brauzer ID → 8 uch chaqiruv (qo'lda) → 9 qaysi sonni sanash → 11 ikki tizim solishtiriladi → A1/A2 repo'da.
- **Bitta vizual — «Hodisalar chizmasi» (`HODISA_TUGUNLAR`, dars bo'yi, 163/180):**
  - Chapda **o'yinchi telefoni** (191 ramka): «Maydon» · Bugun · olti vaqt katagi `16:00` … `21:00` · forma (Ism · Telefon · «Band qilish»). Telefon ostida kichik karta
    **«Brauzer xotirasi (localStorage)»** — `maydon-brauzer: …` (6-ekrandan ko'rinadi).
  - **Sayt · React** (ichida mono `hodisaYoz`) → **Backend · NestJS** (ichida nomlar ro'yxati `ochdi` · `vaqt-tanladi` · `band-qildi`; 4-ekrandan) →
    **Database · PostgreSQL** — ikki jadval kartasi: `bandlar` (9-Moduldan) va `hodisalar` (2-ekranda `id · nom · yaratilgan`, 6-ekranda `brauzer_id` ustuni qo'shiladi).
  - Chetda kulrang **Umami** tuguni — sayt bilan alohida ingichka chiziq (o'z hisobiga yozadi).
  - So'rov — yorlig'i yozilgan konvert: `POST /hodisalar · ochdi`. Backend holati: oq → yashil `✓ 201` · qizil `400`. Jadvalga yangi qator bir lahza ajralib kiradi.
  - Ishlatilishi: 0 (telefon + `bandlar` + Umami) · 1 (tayyor, o'zi o'ynaydi) · 2 · 4 · 6 (ikki telefon) · 9 va 10 (faqat jadval kartasi) · 11 (Umami va Backend chiziqlari) · A1/A2 kutilgan natija — tugunlarning kattasi.
    `prefers-reduced-motion` da konvert yurmaydi — qator birdan qo'yiladi (DE-200).
- **Yakun:** uch hodisa jadvalda · keyingi dars — shu jadvaldagi hodisalar bir sahifada jonli ko'rinadi.

---

## 0 · Kirish — band bor, Umami'da yo'q  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Band yozildi, Umami esa ko'rmadi. Nega?** (39)
- Mentor: O'tgan darsda bosh raqamni tanladingiz — haftada band qilingan vaqtlar. Shu telefonda «Maydon»ni oching va 18:00 ni band qiling.
- Maket (chap): o'yinchi telefoni; manzil qatori yonida kichik chizilgan yorliq «Reklama to'sgichi: yoqilgan». O'ngda ikki karta ustma-ust:
  **Database · `bandlar`** (jadval kartasi, ustunlar `kun · soat · ism`, 0 qator) · **Umami · Maydon** (Visitors 0 · Events: `vaqt-tanladi` 0 · `band-qildi` 0).
- **Harakat → Vizual o'zgarish:** «Maydon»ni ochish → telefonda kataklar chiqadi; Umami kartasi o'zgarmaydi. 18:00 → forma (namuna: Ali · +998 90 000 00 01) → «Band qilish» →
  `bandlar` ga qator tushadi: `Bugun · 18:00 · Ali`; Umami kartasidagi sonlar 0 qoladi va bir lahza miltillaydi (bo'sh). Shundan keyin o'ngdagi variantlar ochiladi (bosilmaguncha xira).
- Variantlar (radio, ballsiz):
  - Umami son ko'rsatishga ulgurmadi (32)
  - ✔ Bu telefonda Umami skripti ishlamadi (36)
  - Band qilganda internet uzilib qoldi (35)
- Javob — 2-variant: **Aynan!** Bu misolda reklama to'sgichi Umami skriptini to'sdi. Band esa Backend orqali Database'ga yozildi. (106)
- Javob — 1-variant: **Qiziq fikr!** Kutsangiz ham son o'zgarmaydi: bu telefondan Umami'ga hech narsa kelmadi. (85)
- Javob — 3-variant: **Qiziq fikr!** Internet uzilsa, band ham yozilmasdi. Band esa jadvalda turibdi. (76)
- Javobdan keyin: `bandlar` kartasi ostida uzuq chiziqli bo'sh karta `hodisalar` paydo bo'ladi — bugun to'ladigan joy (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: «reklama to'sgichi skriptni to'sishi mumkin» — 9-Modul 6-darsda aytilgan. Yorliqni ko'rmagan o'quvchiga ishora qilmang — javob ochilgach o'zi ko'radi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun «Maydon» uch hodisani o'z jadvaliga yozadi.** (49)
- Mentor: Umami qoladi — yonida o'z jadvalimiz paydo bo'ladi. Kodning bir qismini Antigravity yozadi, uch chaqiruvni esa o'zingiz yozasiz.
- Chap yorliq: Dars oxirida — «Maydon» shunday yozadi
- Chap — «Hodisalar chizmasi» tayyor holatda, bir marta o'zi o'ynaydi (DE-200): telefonda sahifa ochiladi, katak tanlanadi, band qilinadi — har biridan konvert Backend'ga boradi,
  `hodisalar` ga uch qator tushadi; chetdagi Umami tuguni ham o'z hisobiga yozadi.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` so'zlari bilan — P-015):
  - 01 · Harakat saytdan hodisa bo'lib chiqadi · `hodisa`
  - 02 · Backend hodisa nomini tekshiradi · `Backend`
  - 03 · Hodisa jadvalga ismsiz yoziladi · `Database`
  - 04 · Uch hodisa Umami bilan solishtiriladi · `uch hodisa`
- Pastki qator (mono, kichik): repo `maydon` · boshlanish `m10-dars-02-start` · tayyor namuna `m10-dars-02-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi (dars hajmi): 4 va 11-ekranlarga ortiqcha vaqt bermang — darsning og'ir qismi 6, 8, 9-ekranlar va ikki blok.

## 2 · Bitta bosish jadvalga  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · hodisa
- Sarlavha: **Bitta bosish jadvalga qanday yetib boradi?** (42)
- Mentor: Odam qaysi qadamda to'xtaganini ko'rish uchun har harakat yozib boriladi. Uch harakatni navbat bilan bajaring va chizmaga qarang.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»): **Uch harakatdan keyin `hodisalar` jadvalida nechta qator bo'ladi?** · Bitta · Ikkita · Uchta — tanlov saqlanadi.
- Chapda ro'yxat (163.8, o'tgani ✓, joriysi accent): 1 Saytni oching · 2 18:00 ni tanlang · 3 Band qiling
- O'ngda chizma: o'yinchi telefoni → Sayt · React (`hodisaYoz`) → Backend · NestJS → Database: `bandlar` va `hodisalar` (`id · nom · yaratilgan`, 0 qator); chetda kulrang Umami.
- **Harakat → Vizual o'zgarish:**
  1. «Saytni oching» → telefonda «Maydon» ochiladi → Sayt tugunidan konvert `POST /hodisalar · ochdi` → Backend → `hodisalar` ga qator `1 · ochdi · 16:02`.
     Umami tuguniga alohida nuqta boradi. Joriy qator: Umami ochilishni o'zi yozardi. O'z jadvalimizga esa ochilish ham nom bilan keladi — `ochdi`. (92)
  2. 18:00 → katak tanlanadi → konvert `vaqt-tanladi` → qator `2 · vaqt-tanladi · 16:03`.
  3. Forma (namuna to'ldirilgan) → «Band qilish» → avval konvert `POST /bandlar` → `bandlar` ga qator; saqlangach konvert `band-qildi` → qator `3 · band-qildi · 16:03`.
- Joriy qator (3/3 dan keyin, bitta): Jadvaldagi har qator — bitta hodisa.
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: uchta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Biz tanlagan uch harakatni sayt Backend'ga yuboradi; so'rov o'tsa, Backend jadvalga bitta qator yozadi. (109)
- Tugadi (199): ro'yxat yopiladi, chizma uch qator bilan butun enga; vizual ⛶ ichida (q17).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Harakatlarni bajaring (N/3) → Davom etish

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **O'yinchi 18:00 ni tanladi. `vaqt-tanladi` jadvalga qanday yetadi?** (8 so'z)
  - Sayt uni to'g'ridan Database'ga yozadi (38)
  - ✔ Sayt yuboradi, Backend jadvalga yozadi (38)
  - Umami uni jadvalga o'zi ko'chirib qo'yadi (41)
  - Backend uni saytdan o'zi so'rab oladi (37)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas; «Sayt», «Backend», «jadval» so'zlari boshqa variantlarda ham bor.
- To'g'ri izohi: Sayt `POST /hodisalar` yuboradi, Database'ga esa faqat Backend yozadi. (70)
- Xato izohlari (≤60):
  - A: `DATABASE_URL` Backend'da — sayt Database'ni ko'rmaydi. (55)
  - C: Umami o'z hisobiga yozadi — bizning jadvalga tegmaydi. (54)
  - D: Backend kutib turadi — hodisani sayt o'zi yuboradi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Nom tekshiruvi  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · Backend tekshiruvi
- Sarlavha: **Nomi xato yozilgan hodisa jadvalga kiradimi?** (44)
- Mentor: Sayt kodida bitta harf adashsa, hodisa boshqa nom bilan keladi. Har so'rovni Backend'ga yuboring va jadvalga qarang.
- Bashorat (ballsiz): **Sayt `Band qildi` deb yuborsa, nima bo'ladi?** · Jadvalga yoziladi · Backend rad etadi
- Chapda ikki qadam (o'tgani ✓): 1 So'rovlarni yuboring · 2 Tekshiruvni o'chirib ko'ring
- Chap — beshta so'rov-kartasi (konvert ko'rinishida, aralash): `ochdi` · `Band qildi` · `vaqt-tanladi` · `vaqt_tanladi` · `band-qildi`
- O'ng — chizmaning Backend tuguni (ichida ro'yxat `ochdi` · `vaqt-tanladi` · `band-qildi`) → Database `hodisalar` (0 qator).
- **Harakat → Vizual o'zgarish:**
  1. Kartani bosish → konvert Backend'ga boradi, ro'yxat bilan solishtiriladi:
     - nom ro'yxatda → Backend yashil `✓ 201`, `hodisalar` ga qator tushadi;
     - nom ro'yxatda yo'q → Backend qizil `400`, konvert qaytadi, karta ostida bir qator (≤60):
       `Band qildi` — «Ro'yxatda yo'q: katta harf va bo'sh joy.» (40) · `vaqt_tanladi` — «Ro'yxatda yo'q: chiziqcha o'rniga pastki chiziq.» (48)
     Joriy qator (birinchi `400` dan keyin): Nom ro'yxatda bo'lmasa, Backend 400 qaytaradi — so'rov rad etiladi. (67)
  2. Kalit «Tekshiruv: yoqilgan» → «o'chirilgan» (kalit ustida kulrang yorliq «faqat shu maketda» — repo'da tekshiruv o'chirilmaydi) → Backend'dagi ro'yxat kulrang bo'ladi, rad etilgan ikki so'rov qayta boradi va jadvalga tushadi (qizg'ish fonda);
     jadval ostida nom bo'yicha sanoq: `ochdi 1` · `vaqt-tanladi 1` · `vaqt_tanladi 1` · `band-qildi 1` · `Band qildi 1` — bir harakat ikki nom bilan ikki joyda sanaladi.
     Kalit qayta yoqilsa, ikki qizg'ish qator o'chadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: rad etildi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: «Maydon» Backend'i faqat shu uchta nomni qabul qiladi. Shunda bitta harakat ikki xil nom bilan sanalmaydi. (106)
- Tugadi (199): kartalar yopiladi, Backend va jadval fokusga (tekshiruv yoqilgan holatda).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → So'rovlarni yuboring (N/5) → Tekshiruvni o'chirib ko'ring → Davom etish

## 5 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Sayt `Band-qildi` deb yubordi. Backend nima qiladi?** (7 so'z) — 4-ekrandagi nomlardan boshqa holat (katta harf, chiziqcha bilan)
  - Nomni o'zi tuzatib, jadvalga yozib qo'yadi (42)
  - Yangi hodisa sifatida jadvalga qo'shadi (39)
  - ✔ 400 bilan rad etadi, qator yozilmaydi (37)
  - Saytni to'xtatib, xato sahifasini ochadi (40)
- Kalit: **C** (index 2). To'g'ri variant eng qisqasi; «jadval», «yozadi» so'zlari xato variantlarda ham bor.
- To'g'ri izohi: Ro'yxatda kichik harfli `band-qildi` bor — katta harfli nom rad etiladi. (72)
- Xato izohlari (≤60):
  - A: Backend nomni tuzatmaydi — faqat ro'yxat bilan solishtiradi. (60)
  - B: Yangi nom yozilsa, bitta harakat ikki xil sanaladi. (51)
  - D: Backend saytni to'xtatmaydi — so'rovni oladi yoki rad etadi. (60)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 6 · Brauzer ID  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · brauzer ID
- Sarlavha: **Qaysi brauzer ochganini qanday ajratamiz?** (40) — 02-FILTR 2: «kim» — odam emas, brauzer
- Mentor: Ism va telefonni hodisaga yozmaymiz — sahifani ochgan odam ularni hali bermagan. Uch harakatni bajaring va jadvalning yangi ustuniga qarang.
- Bashorat (ballsiz): **1-telefonda sahifa yangilansa, jadval uni yangi brauzer deb yozadimi?** · Ha, yangi brauzer · Yo'q, o'sha brauzer
- Chapda ro'yxat (o'tgani ✓): 1 1-telefonda «Maydon»ni oching · 2 1-telefonda sahifani yangilang · 3 2-telefonda oching
- O'ngda: ikki telefon ramkasi (1-telefon · 2-telefon), har birining ostida karta «Brauzer xotirasi (localStorage)» — `maydon-brauzer`: bo'sh.
  Database `hodisalar`: ustunlar `id · nom · yaratilgan` + uzuq chiziqli yangi ustun `brauzer_id` (U-041 — to'ldiriladigan joy).
- **Harakat → Vizual o'zgarish:**
  1. 1-telefonda ochish → uning xotira kartasida `maydon-brauzer: 7f3a…` paydo bo'ladi (bir lahza yonadi) → konvert `ochdi · 7f3a…` → `brauzer_id` ustuni chiziladi,
     qator `1 · ochdi · 7f3a… · 16:10` (1-telefon rangida).
     Joriy qator: Brauzerni ajratadigan tasodifiy harf va raqamlar **brauzer ID** deyiladi. U odamning ismini ham, telefonini ham bildirmaydi. (120 — ikki gap)
  2. Yangilash → xotirada o'sha `7f3a…` qoladi (yangisi yaratilmaydi) → qator `2 · ochdi · 7f3a…` — o'sha rangda.
  3. 2-telefonda ochish → uning xotirasi bo'sh → yangi `c91e…` yaratiladi → qator `3 · ochdi · c91e…` — boshqa rangda.
- Natija qatori: «Taxminingiz: … · haqiqatda: o'sha brauzer» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Brauzer ID brauzer xotirasida turadi: sahifa yangilansa ham o'zgarmaydi, boshqa brauzerda yangisi olinadi. (106)
- Qator (`QIzoh`, xulosadan keyin; tayanch 7-bo'lim 1 — chegaralangan gap): Brauzer ID odamni emas, brauzerni ajratadi: bitta odam ikki telefonda — ikki brauzer. (85)
- Tugadi (199): ro'yxat yopiladi, ikki telefon va jadval fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Uchalasini bajaring (N/3) → Davom etish

## 7 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Bitta o'yinchi telefonda ham, laptopda ham ochdi. Nechta brauzer ID?** (10 so'z)
  - ✔ Ikkita — har brauzerda o'z ID si (32)
  - Bitta — chunki ochgan odam bitta (32)
  - Bitta — Backend ID larni bog'laydi (35) ✎ pilot: lint:tell (kalit so'z faqat to'g'rida bo'lmasin)
  - Hech qancha — u hali band qilmagan (34)
- Kalit: **A** (index 0). To'g'ri variant eng uzun emas; to'rttasi «son — sabab» shaklida, «Bitta» ikki variantda (bir xato-sinf: brauzer ID ni odam bilan aralashtirish).
- To'g'ri izohi: Brauzer ID odamni emas, brauzerni ajratadi — har brauzer o'z ID sini saqlaydi. (78)
- Xato izohlari (≤60):
  - B: Brauzer ID ismni bilmaydi — odamni qayerdan taniydi? (52)
  - C: Backend kelgan ID ni yozadi, ikkisini bog'lamaydi. (50)
  - D: Brauzer ID sahifa ochilganda olinadi — band shart emas. (55)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · Uch chaqiruv: hodisa qayerda yoziladi  ← QKod
- Eyebrow: Kod yozish · uch hodisa
- Sarlavha: **Uch hodisani to'g'ri joyda yozadigan kod yozamiz.** (49) — §19 sarlavha oilasi
- Mentor: `hodisaYoz` tayyor — uni qayerda chaqirishni siz tanlaysiz. Kodni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. Faylning boshiga yozing: `hodisaYoz('ochdi')`
  2. Katak bosilganda, `tanla(...)` dan keyin: `hodisaYoz('vaqt-tanladi')`
  3. `hodisaYoz('band-qildi')` ni band saqlangan joyga yozing — ikkala tekshiruvdan keyin (faqat 201 da).
- Yordam: Nom qo'shtirnoq ichida, kichik harf va chiziqcha bilan yoziladi. `band-qildi` tekshiruvlardan oldin tursa, saqlanmagan urinish ham sanaladi.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi: sarlavha «Maydon» · uchta katak `18:00` · `19:00` · `20:00` (`class="katak"`, `data-soat`) · «Band qilish» (`id="band"`) · xabar joyi ·
    ostida ro'yxat «hodisalar (namuna)».
  - `maydon.js` — tayyor, o'zgarmaydi: `tanla(soat)` (katak tanlanadi, `tanlangan` ga yoziladi) · `saqla(soat)` (namuna: `19:00` — `409`, `20:00` — `500`, boshqasi — `201`) · `xabar(matn)` ·
    `hodisaYoz(nom)` — bu oynada Backend yo'q, shuning uchun hodisa pastdagi ro'yxatga `nom · 7f3a…` bo'lib yoziladi. Ro'yxat ustida kulrang izoh: «Bu oynada jadval o'rniga ro'yxat».
  - `app.js` — o'quvchi yozadi (boshlang'ich holat):
    ```js
    // 1) sahifa ochildi — shu yerga

    document.querySelectorAll('.katak').forEach(function (k) {
      k.addEventListener('click', function () {
        tanla(k.dataset.soat)
        // 2) shu yerga
      })
    })

    document.querySelector('#band').addEventListener('click', async function () {
      const javob = await saqla(tanlangan)
      if (javob.status === 409) {
        xabar('Bu vaqt band')
        return
      }
      if (javob.status !== 201) {
        xabar("Band qilib bo'lmadi")
        return
      }
      // 3) shu yerga
      xabar('Band qilindi: ' + tanlangan)
    })
    ```
- Kod oynasi sarlavhasi: `app.js — uch hodisani to'g'ri joyda yozing`
- Shart xabarlari (≤60):
  - 1 — Sahifa ochilganda `ochdi` bir marta yozilsin. (45)
  - 2 — Katak bosilganda `vaqt-tanladi` yozilsin. (41)
  - 3 — Band saqlanmasa (409 yoki boshqa xato), `band-qildi` yozilmasin. (58)
  - 4 — Band saqlanganda `band-qildi` bir marta yozilsin. (49)
- **Harakat → Vizual o'zgarish:** o'quvchi yozadi → natija oynasida ro'yxatga `ochdi · 7f3a…` tushadi; 18:00 bosilsa — `vaqt-tanladi`; 19:00 va «Band qilish» → «Bu vaqt band», ro'yxat o'zgarmaydi; 20:00 va «Band qilish» → «Band qilib bo'lmadi», ro'yxat o'zgarmaydi;
  18:00 va «Band qilish» → «Band qilindi: 18:00» va `band-qildi`. Har shart bajarilganda ✓. «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Hodisa harakat bo'lgan joyda yoziladi; `band-qildi` — faqat band saqlangandan keyin. (84)

## 9 · Qator yoki brauzer  ← QTushuncha (bashorat + ikki usul)
- Eyebrow: Tushuncha · sanoq
- Sarlavha: **Qatorlarni sanaysizmi yoki brauzerlarni?** (40)
- Mentor: «Birinchi odam kirganda nimani ko'rasiz?» darsida uch son uch xil usulda sanalgan edi. Ikki usulni sinab, qaysi biri uch qadamni bir xil sanashini ko'ring.
- Bashorat (ballsiz): **Bitta brauzerdan uchta katak tanlandi. «Vaqtni tanladi» qadamida u necha marta sanalsin?** · Uch marta · Bir marta
- Chap — ikki tugma: «Qatorlarni sanash» · «Turli brauzerlarni sanash».
- O'ng — `hodisalar` jadvali (namuna: kunning boshi, 9 qator, har brauzer o'z rangida) va ustida uch qadam ustuni «ochdi → vaqtni tanladi → band qildi» (sonlar «?»):
  ```
  1 · ochdi        · 7f3a…
  2 · ochdi        · c91e…
  3 · vaqt-tanladi · 7f3a…
  4 · ochdi        · e05b…
  5 · vaqt-tanladi · 7f3a…
  6 · ochdi        · 7f3a…
  7 · vaqt-tanladi · c91e…
  8 · vaqt-tanladi · 7f3a…
  9 · band-qildi   · 7f3a…
  ```
- **Harakat → Vizual o'zgarish:**
  - «Qatorlarni sanash» → qatorlar birma-bir yonib, o'z ustuniga tushadi: **4 · 4 · 1**. Birinchi ikki ustun teng — vaqt tanlashdan oldin hech kim to'xtamagandek ko'rinadi.
  - «Turli brauzerlarni sanash» → qatorlar rang bo'yicha yig'iladi, takrorlangan qatorlar kulrang bo'ladi; ustunlar: **3 · 2 · 1** — `e05b…` ochdi, lekin vaqt tanlamadi.
  - Ikkala usul ko'rilgach, SQL kartasi ochiladi (P-065: 3 qator + bir gap):
    ```sql
    SELECT nom, COUNT(DISTINCT brauzer_id)
    FROM hodisalar
    GROUP BY nom;
    ```
    Ostida: Har hodisa nomi uchun takrorlanmagan brauzer ID lar sonini sanaydi. (67)
- Joriy qator (ikkinchi usuldan keyin, bitta): Bu darsda sanoq sharti — har qadamda turli brauzerlar soni. (59)
- Natija qatori: «Taxminingiz: … · haqiqatda: bir marta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Qatorlar bitta brauzerni bir necha marta sanaydi. O'z jadvalimizdagi uch qadam bitta sanoq qoidasida bo'ladi. (109)
- Tugadi (199): tugmalar yopiladi, jadval, ustunlar (3 · 2 · 1) va SQL kartasi fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki usulni sinang (N/2) → Davom etish
- O'qituvchi eslatmasi: Umami darsida uch son uch xil o'lchovda edi (ochilishlar, bosishlar, Database'dagi bandlar) — ularni ayirmaslikni aytganmiz (9-Modul 6-dars Filtri, 1-band).
  O'z jadvalimizda sanoq qoidasini o'zimiz tanlaymiz — uchala qadam bitta qoida bilan. SQL — tayyor, yodlatilmaydi; A2 da Neon'da xuddi shu SQL ishlatiladi.

## 10 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol ustida kichik jadval kartasi `hodisalar` (faqat `vaqt-tanladi`, 5 qator): `7f3a…` · `c91e…` · `7f3a…` · `7f3a…` · `e05b…` — 9-ekrandagi jadvaldan boshqa (§106).
- Savol: **Jadvalga qarang. «Vaqtni tanladi» qadamida nechta brauzer sanaladi?** (8 so'z; savolda son yo'q — S-019, test sonlarni o'qishni so'raydi — T-043)
  - Beshta — har qator bitta brauzer (32)
  - Bitta — eng ko'p bosgan brauzer (31)
  - Ikkita — faqat takrorlangan ID lar (34)
  - ✔ Uchta — har brauzer bir marta (29)
- Kalit: **D** (index 3). To'g'ri variant eng qisqasi; to'rttasi «son — sabab» shaklida.
- To'g'ri izohi: Uch xil ID bor: `7f3a…` uch marta kelgan bo'lsa ham, bir marta sanaladi. (72)
- Xato izohlari (≤60):
  - A: `7f3a…` uch marta keldi — bu uch brauzermi? (43)
  - B: Bir brauzer ko'p bosgani boshqalarini o'chirmaydi. (50)
  - C: Bir marta kelgan ID ham — alohida brauzer. (42)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 11 · Bir kun, ikki tizim  ← QTushuncha (bashorat + bitta harakat)
- Eyebrow: Tajriba · ikki tizim
- Sarlavha: **Ikki tizim nega bir xil son bermadi?** (35) — 02-FILTR 1/11: «qaysi biri xato» degan oldindan qo'yilgan da'vo olindi
- Mentor: Mentor misolida «Maydon»ning bir kuni ikki tizimda sanaldi. Kunni boshlang va har brauzer qayerga yetib borishiga qarang.
- Bashorat (ballsiz): **Saytni ochganlarni qaysi tizim ko'proq sanaydi?** · Umami · O'z jadvalimiz · Ikkalasi teng
- Vizual: chapda brauzerlar oqimi (kichik doiralar); o'ngda ikki hisoblagich yonma-yon — **Umami · Visitors (Umami sessiyalari)** 0 · **O'z tizimimiz · `ochdi`, turli brauzer ID** 0;
  ikkala hisoblagich ostida kichik yorliq — har birining sanash qoidasi (Umami: o'z usuli bilan · biz: brauzer xotirasidagi ID). Ular yaqin, lekin bir xil o'lchov emas (02-FILTR 1).
  Har doiradan ikki ingichka chiziq: biri Umami'ga, biri Backend'ga.
- **Harakat → Vizual o'zgarish:** «Kunni boshlang» → 36 doira birin-ketin o'tadi; har birida o'z tizimimiz hisoblagichi +1. Ba'zi doiralarda chizilgan «to'sgich» yorlig'i bor —
  ularning Umami chizig'i yarim yo'lda uziladi (kulrang), Backend chizig'i yetib boradi. Yakunda: **Umami 31 · o'z tizimimiz 36**; «to'sgich» yorliqli doiralar bir lahza yonadi.
- Qator (`QIzoh`, natijadan keyin): Ikki tizim brauzerni turlicha taniydi: Umami — o'z usuli bilan, biz — brauzer ID bilan. Shuning uchun sonlar teng bo'lishi shart emas. (117)
- Natija qatori: «Taxminingiz: … · haqiqatda: o'z jadvalimiz» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: O'z jadvalimizda qoida aniq: har hodisada turli brauzer ID lar. Farq sabablaridan biri — reklama to'sgichi. (107; ✎ pilot — avval 110 dan oshgan edi)
- Tugadi (199): tugma yopiladi, ikki hisoblagich va oqim fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Kunni boshlang → Davom etish
- O'qituvchi eslatmasi: Ikkalasi ham o'z qoidasi bilan sanaydi — bittasi albatta xato emas. Boshqa sabablar ham bor (inkognito oyna yangi brauzer ID oladi; Umami Visitors ni Website ID,
  hostname va User-Agent xeshidan hisoblaydi) — so'rashsa ayting; ekranda bitta sabab qoladi. Simulyatsiyada farq to'liq to'sgichga bog'langan — bu Mentor misoli, umumiy qoida emas.

## 12 · Yakuniy · band qilish tartibi (jonli ball)  ← QTartib (sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Bitta band qilish jadvalga qanday yetadi?** (41)
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- Oltita uya — faqat raqam 1–6 va izoh «bu yerga qo'ying» (tartibni ochmaydi).
- Bo'laklar (bu yerda to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — `FINAL_BOLAKLAR`):
  1. O'yinchi «Band qilish»ni bosadi
  2. Sayt `POST /bandlar` yuboradi
  3. Backend bandni `bandlar` ga saqlaydi
  4. Sayt `band-qildi` ni brauzer ID bilan yuboradi
  5. Backend hodisa nomini tekshiradi
  6. `hodisalar` jadvaliga yangi qator tushadi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring. (39)
- Yechilgach xulosa (bir marta): Avval band yuboriladi va saqlanadi, keyin hodisa yuboriladi, tekshiriladi va yoziladi. (99)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## A1 · Amaliyot 1 — `hodisalar` jadvali va `POST /hodisalar`  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq; `screens[13]`)
- Eyebrow: Amaliyot 1 · Backend → Database
- Sarlavha: **Backend hodisani qabul qilib, jadvalga yozsin.** (46)
- Mentor: Kodni Antigravity yozadi — jadvalni va 400 ni esa siz terminal va Neon'da tekshirasiz. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — `band.entity.ts` va `bandlar.controller.ts` dagidek.
     > Nima qilsin: `hodisalar` jadvali — `id`, `nom` (matn), `brauzer_id` (matn), `yaratilgan`. `POST /hodisalar` `{ nom, brauzer_id }` ni olsin: `nom` faqat `ochdi`, `vaqt-tanladi` yoki `band-qildi`, `brauzer_id` — satr, 1–64 belgi; aks holda 400. To'g'ri bo'lsa, jadvalga bitta qator yozsin.
     > Nima buzilmasin: `bandlar` jadvali va boshqa yo'llar o'zgarmasin. O'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend terminali o'zi qayta ishga tushadi, xato yo'q. Antigravity'ga yozing: «`POST /hodisalar` ga ikki so'rov yuborib tekshir: `ochdi` va `Band qildi`,
     `brauzer_id` — `tekshiruv`. Qaytgan sonlarni ayt.» Kutilgani: `201` va `400`. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Neon'da tekshirish** — Neon'dagi SQL Editor'da: `SELECT * FROM hodisalar;` — bitta qator: `ochdi · tekshiruv`, `Band qildi` qatori yo'q. Agent nima desa ham, jadval shuni ko'rsatsin.
     So'ng tekshiruv qatorini o'chiring: `DELETE FROM hodisalar WHERE brauzer_id = 'tekshiruv';` — jadval bo'sh, sayt yozishga tayyor.
  5. **O'z g'oyangiz** — qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     > Qayerda: `{loyiha papkasi}/backend`.
     > Nima qilsin: `hodisalar` jadvali — `id`, `nom`, `brauzer_id`, `yaratilgan`. `POST /hodisalar`: `nom` faqat `{uch hodisa nomi}` dan biri, `brauzer_id` — satr, 1–64 belgi; aks holda 400.
     > Nima buzilmasin: boshqa jadvallar va yo'llar o'zgarmasin. O'zgargan fayllarni ayt.
     Yo'riq (forma ostida, bir qator): Uch hodisa — loyihangizdagi uch qadam; oxirgisi — bosh raqam hodisasi. Umami darsida saqlangan hodisa nomi bo'lsa, o'rtadagi qadamga o'zi qo'yiladi (TAYANCHGA SAVOL 8).
- O'ng tomon — «kutilgan natija · namuna: Maydon» (terminal + jadval kartasi, chizmadagi Backend va `hodisalar` tugunlarining kattasi):
  - Antigravity terminali: `POST /hodisalar · ochdi → 201` · `POST /hodisalar · Band qildi → 400`
  - Neon · SQL Editor · `SELECT * FROM hodisalar;` → `id · nom · brauzer_id · yaratilgan` · `1 · ochdi · tekshiruv · …`
- Hammasi bajarilgach (yashil): Backend hodisani qabul qiladi: to'g'ri nom — jadvalga, xato nom — 400. (70)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-02-start` (`.env` fayllaringiz o'zgarmaydi)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: jadvalni loyihadagi `synchronize: true` sozlamasi o'zi yaratadi — tez ishlash uchun qulay, lekin prod'da xavfli (sxema o'zi o'zgaradi); bu 8-darsdagi prod ro'yxatida aytiladi (GATE M M-q2).
  Hozircha `POST /hodisalar` ga har kim so'rov yubora oladi — so'rovlar chegarasi prod ro'yxatida qo'yiladi (tayanch 3-bo'lim, 8-dars). O'quvchiga va'da qilib aytilmaydi (T-038).

## A2 · Amaliyot 2 — sayt uch hodisani yuboradi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq; `screens[14]`)
- Eyebrow: Amaliyot 2 · sayt → hodisalar
- Sarlavha: **Sayt uch hodisani o'z jadvalimizga yuborsin.** (44)
- Mentor: Yuborish funksiyasini Antigravity yozadi, uni qayerda chaqirishni — siz. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — Backend terminali ishlab tursin. Ikkinchi terminalda `cd web`, keyin `npm run dev`; brauzerda `localhost:5173` — kataklar chiqsin.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: yangi fayl `web/src/hodisa.js`; Backend manzili — `api.js` dagi `API`.
     > Nima qilsin: `hodisaYoz(nom)` `POST /hodisalar` ga `{ nom, brauzer_id }` yuborsin. `brauzer_id` — localStorage'dagi `maydon-brauzer`; yo'q bo'lsa tasodifiy ID yaratib, shu kalitga saqlasin.
     > Nima buzilmasin: ism va telefon yuborilmasin; so'rov o'tmasa ham sayt ishlayversin, foydalanuvchiga xato ko'rsatilmasin — konsolda ogohlantirish qolsin. Boshqa fayllarga tegma — chaqiruvlarni men yozaman.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. **Uch chaqiruv — qo'lda** (nusxa tugmasi yo'q; 8-ekrandagidek):
     - `web/src/main.jsx` — tepaga `import { hodisaYoz } from './hodisa.js'`; `const egami = …` dan keyin: `if (!egami) hodisaYoz('ochdi')` — `/ega` sahifasi o'yinchi emas, sanalmaydi.
     - `web/src/App.jsx` — tepaga o'sha import; `tanla` funksiyasi ichida: `hodisaYoz('vaqt-tanladi')`; `saqlandi` funksiyasi ichida (u band muvaffaqiyatli saqlangandan keyingina chaqiriladi), Umami'ning `band-qildi` chaqiruvi yonida: `hodisaYoz('band-qildi')`.
     Saqlang — sayt o'zi yangilanadi.
  4. **Ikki tizimda tekshirish** — avval Neon'dagi SQL Editor'da `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;` ni ishga tushirib, sonlarni yozib oling (bo'sh bo'lsa — 0).
     Saytda bo'sh vaqtni tanlang va band qiling (ism va telefon — namuna), SQL'ni qayta ishga tushiring: yangi brauzer bo'lsa uch nom ham oshadi. Umami'da «Events» bo'limida `vaqt-tanladi` va `band-qildi` ham oshdi.
     Keyin inkognito oynada (Chrome va Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) saytni oching va bitta vaqtni tanlang. SQL'ni qayta ishga tushiring: `ochdi` va `vaqt-tanladi` yana bittaga oshdi — yangi brauzer.
     Aniq son emas, oshgani muhim: jadvalda oldingi urinishlar qolgan bo'lishi mumkin (02-FILTR 5).
     Umami'da Visitors o'zgarmasligi mumkin — u brauzerni o'z usuli bilan taniydi. Jadvalda hech narsa yo'q bo'lsa — Backend terminali ishlayotganini tekshiring.
  5. **O'z g'oyangiz** — qavs ichini to'ldiring, «Nusxalash» — uyda o'z loyihangizda yuborasiz:
     > Qayerda: `{loyiha papkasi}/web` — yangi fayl `hodisa.js`.
     > Nima qilsin: `hodisaYoz(nom)` `POST /hodisalar` ga `{ nom, brauzer_id }` yuborsin; `brauzer_id` — localStorage'dagi `{loyiha nomi}-brauzer` (yo'q bo'lsa tasodifiy ID).
     > Nima buzilmasin: ism va telefon yuborilmasin; so'rov o'tmasa ham sayt ishlayversin, konsolda ogohlantirish qolsin. Chaqiruvlarni (`{uch hodisa nomi}`) men yozaman.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (jadval kartasi + kichik Umami maketi):
  - Neon · SQL Editor → `nom · count` — uch o'lchov: oldin `ochdi 0 · vaqt-tanladi 0 · band-qildi 0` → band qilgach `1 · 1 · 1` → inkognitodan keyin `2 · 2 · 1` (toza jadvalda; sizda oldingi urinishlar bilan boshqacha bo'lishi mumkin)
  - Umami · Events: `vaqt-tanladi` 2 · `band-qildi` 1
- Hammasi bajarilgach (yashil): Uch hodisa o'z jadvalimizga yoziladi — Umami ham yozishda davom etadi. (70)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-02-done` (`.env` fayllaringiz o'zgarmaydi)
- Nishon (bonus): Own Events — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: reklama to'sgichi yoqilgan o'quvchida Umami'da son oshmaydi, jadvalda esa hodisa bor — 11-ekrandagi farqning jonli namunasi; shuni sinfga ko'rsating.
  Ikkinchi brauzer sifatida sherikning telefoni ishlamaydi: sayt `localhost` da, telefon uni ko'rmaydi (9-Modul 4-dars).

## 15 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + yakuniy tartib + 2 blok «Bajardim» (`PRACTICE_BASE`). QKod (8) — `practice: -1`.
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Hodisa Backend orqali» · 5 — «2 — Xato nom» · 7 — «3 — Ikki brauzer» · 10 — «4 — Turli brauzerlar» · 12 — «Yakuniy — band qilish tartibi»

## 16 · Takrorlash  ← QKartochka (12 karta, tepadan — 174)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- ✎ Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Uch hodisa jadvalda · {N}/5 to'g'ri
- Sarlavha: **Hodisalar tizimi ishlayapti: uch hodisa jadvalda.** (49)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, kartochkaga qo'shilmaydi — P-013): Hodisalar o'z jadvalimizda turgani uchun uch qadamni bitta qoida bilan sanaymiz: har qadamda turli brauzerlar soni.
- ✓ Endi siz bilasiz (5):
  - Sayt hodisani Backend'ga yuboradi; so'rov o'tsa, Backend uni `hodisalar` jadvaliga bitta qator qilib yozadi.
  - «Maydon» Backend'i faqat uchta nomni qabul qiladi, boshqa nomga 400 qaytaradi.
  - Brauzer ID brauzerni ajratadi va odamning ismini ham, telefonini ham bildirmaydi.
  - `band-qildi` faqat band saqlangandan keyin yoziladi.
  - O'z jadvalimizda har qadamda turli brauzerlar sanaladi; Umami brauzerni boshqacha taniydi, shuning uchun farq tabiiy.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: hodisa · `hodisalar` · brauzer ID · `POST /hodisalar`)
- Bosilgach karta «Uyda nima qilasiz?» (kim uchun — o'z loyihangiz · nechta — 3 hodisa · muddat — keyingi darsgacha):
  1. **Backend** — A1 dagi «O'z g'oyangiz» promptini loyihangizda yuboring: `hodisalar` jadvali va `POST /hodisalar` paydo bo'lsin.
  2. **Sayt** — A2 dagi promptni yuboring va uch chaqiruvni qo'lda yozing — har biri harakat bo'lgan joyda.
  3. **Ikki tizim** — push qiling, internetdagi saytingizni ikki kishi ochsin. Neon'dagi sanoqni Umami bilan solishtiring va farqni bir gapda yozing.
  - Keyingi dars — «Loyiha kuni: jonli dashboard». Talabni siz yozasiz, agent dashboard'ni (holat panelini) yig'adi: jadvaldagi hodisalar bir sahifada ko'rinadi.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (5) — inglizcha nom va medal (o'yin qatlami)
- **Event Path** — Hodisa jadvalga Backend orqali borishini bildingiz (3-ekran, 1-savol — birinchi urinishda)
- **Name Guard** — Xato nomli hodisa nega yozilmasligini bildingiz (5-ekran, 2-savol)
- **Two Browsers** — Brauzer ID odamni emas, brauzerni ajratishini bildingiz (7-ekran, 3-savol)
- **True Count** — Har qadamda turli brauzerlarni sanadingiz (10-ekran, 4-savol)
- **Own Events** — Ikki amaliyot blokini oxirigacha bajardingiz (A2, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (S-034: tekin bonus bitta)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/` va 9-Modul MD lari: Event Path, Name Guard, Two Browsers, True Count, Own Events — 0; «Tracker On!» 9-Modulda band — shuning uchun «Tracker» olinmadi).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta, emoji o'rniga koddan bitta qator (S-026)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Hodisa Backend orqali yoziladi»
   - `hodisaYoz('vaqt-tanladi')` · Sayt harakatni yuboradi — `POST /hodisalar`.
   - `DATABASE_URL` · Backend'da turadi — Database'ga faqat Backend yozadi.
   - `hodisalar` · Jadvaldagi har qator — bitta hodisa.
   - Sinfga savol: Nega sayt Database'ga o'zi yozmaydi?
2. 2-savol (5-ekran) — «Uchta nom, boshqasi — 400»
   - `['ochdi', 'vaqt-tanladi', 'band-qildi']` · Backend'dagi ro'yxat — faqat shu nomlar yoziladi.
   - `400` · Nom ro'yxatda yo'q — so'rov rad etiladi, qator yozilmaydi.
   - `Band qildi` · Ro'yxat bo'lmasa — bitta harakat ikki nom bilan sanalardi.
   - Sinfga savol: Backend nomni nega o'zi tuzatmaydi?
3. 3-savol (7-ekran) — «Brauzer ID brauzerni ajratadi»
   - `maydon-brauzer` · Brauzer xotirasida turadi — sahifa yangilansa ham o'sha.
   - `7f3a…` · `c91e…` · Boshqa brauzer — boshqa ID.
   - `brauzer_id` · Ism ham, telefon ham yo'q — odamni emas, brauzerni ajratadi.
   - Sinfga savol: Bitta odam uch qurilmadan kirsa, nechta brauzer ID bo'ladi?
4. 4-savol (10-ekran) — «Turli brauzerlar soni»
   - `vaqt-tanladi · 7f3a…` · Uch marta kelsa ham — bir marta sanaladi.
   - `COUNT(DISTINCT brauzer_id)` · Takrorlanmagan brauzer ID lar soni.
   - `3 · 2 · 1` · Uch qadam bitta qoida bilan — sonlar bir o'lchovda.
   - Sinfga savol: Qatorlarni sanasak, qaysi qadamdagi to'xtash yashirinib qoladi?
5. Yakuniy (12-ekran) — «Avval band, keyin hodisa»
   - `POST /bandlar` · Sayt bandni yuboradi, Backend saqlaydi.
   - `hodisaYoz('band-qildi')` · Saqlangandan keyin hodisa yuboriladi.
   - `201` · Nom to'g'ri — `hodisalar` ga qator tushadi.
   - Sinfga savol: `band-qildi` 409 tekshiruvidan oldin yuborilsa nima bo'ladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Hodisa nima? | Analitikaga yoziladigan bitta harakat | Bizda — `hodisalar` jadvalidagi bitta qator |
| «Maydon»ning uch hodisasi qaysi? | `ochdi` · `vaqt-tanladi` · `band-qildi` | Uch qadam: ochdi, vaqtni tanladi, band qildi |
| Hodisa saytdan jadvalga qanday yetadi? | Sayt `POST /hodisalar` yuboradi, Backend jadvalga yozadi | Umami o'z hisobiga alohida yozadi |
| Nega o'z jadvalimizda sahifa ochilishi ham nom oladi? | Unga hech narsa o'zi yozilmaydi | Umami'da ochilish avtomatik yozilardi |
| Backend qaysi hodisa nomlarini yozadi? | Faqat uchtasini | Boshqa nom — 400, qator yozilmaydi |
| Nomlar ro'yxati nega kerak? | Bitta harakat ikki nom bilan sanalmasligi uchun | Masalan, `Band qildi` va `band-qildi` |
| Brauzer ID nima? | Bitta brauzerni ajratadigan tasodifiy harf va raqamlar | Ismni ham, telefonni ham bildirmaydi |
| Brauzer ID qayerda saqlanadi? | Brauzer xotirasida (localStorage) | Kalit `maydon-brauzer` — yangilansa ham o'sha |
| Bitta odam ikki telefonda ochsa, nechta brauzer ID bo'ladi? | Ikkita | Brauzer ID odamni emas, brauzerni ajratadi |
| `band-qildi` qachon yoziladi? | Band saqlangandan keyin | 409 qaytsa, yozilmaydi |
| Har qadamda nimani sanaymiz? | Turli brauzerlar sonini | `COUNT(DISTINCT brauzer_id)` |
| Umami va jadval soni nega farq qiladi? | Ikki tizim har xil usulda sanaydi | Sabablardan biri — reklama to'sgichi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Hodisa nima? ✔ Analitikaga yoziladigan bitta harakat · Database'dagi bitta yangi jadval ustuni · Saytdagi bitta bosiladigan katta tugma · Backend'dagi bitta yangi so'rov yo'li
2. `hodisalar` jadvalidagi bitta qator nimani bildiradi? Bitta brauzerni · ✔ Bitta hodisani · Bitta o'yinchini · Bitta kunni
3. Sahifa ochilishini o'z jadvalimizga kim yuboradi? Umami skripti uni o'zi yozib beradi · Database uni o'zi qo'shib qo'yadi · ✔ Sayt ochdi nomi bilan yuboradi · Backend har daqiqada o'zi qo'shadi
4. Hodisaga nega telefon raqami yozilmaydi? Telefon raqami jadvalga sig'maydi · Backend raqamni o'qiy olmaydi · Umami raqamni o'zi yashiradi · ✔ Ochganlar hali raqam bermagan
5. Brauzer ID qayerda saqlanadi? ✔ Brauzer xotirasida, localStorage'da · `bandlar` jadvalining alohida ustunida · Umami hisobidagi sayt sozlamalarida · Backend'dagi `.env` faylining ichida
6. O'yinchi sahifani yangiladi. Brauzer ID nima bo'ladi? Har safar yangi ID olinadi · ✔ O'sha ID o'zgarmay qoladi · Telefon raqamiga almashadi · Backend uni o'chirib yuboradi
7. `band-qildi` qachon yuboriladi? «Band qilish» bosilishi bilan · Forma ochilgan zahoti · ✔ Band saqlangandan keyin · Ega ro'yxatni ochganda
8. `COUNT(DISTINCT brauzer_id)` nimani sanaydi? Jadvaldagi hamma qatorlar sonini · Turli hodisa nomlari sonini · Bo'sh vaqt kataklari sonini · ✔ Har xil brauzerlar sonini
9. Qatorlarni sanasak, qanday xato chiqadi? ✔ Bir brauzer bir necha marta sanaladi · Band qilganlar umuman sanalmaydi · Umami sonlari ikki baravar bo'ladi · Bo'sh kataklar ham qator bo'lib qoladi
10. Umami 31, jadval 36. Bu nimani bildiradi? Jadval xato — uni tuzatish kerak · ✔ Ikki tizim har xil usulda sanaydi · Umami xato — uni olib tashlaymiz · Besh kishi saytni ikki marta ochgan
11. Mentor misolida reklama to'sgichi nimani to'sdi? `POST /bandlar` so'rovini · Saytdagi vaqt kataklarini · ✔ Umami skriptini · Brauzer xotirasini
12. Hodisalarni nega o'z Database'imizga ham yozamiz? Umami endi umuman kerak emas · Sayt shunda tezroq ochiladi · Backend shunda hech uxlamaydi · ✔ Sonlarni o'zimiz sanay olamiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har harf 3 marta).
Har savolda to'g'ri variant eng uzun emas (S-006; 1-savol: 37 · 39 · 38 · 37 — skript bilan sanaldi). Ballik matnda atama izohi (S-020): localStorage — «Brauzer xotirasida», 400 — 2-takrorlash oynasida.
Ekran testlari bilan takror yo'q (§144): 1-savol (vaqt-tanladi qanday yetadi) ↔ arena 3 (ochilishni kim yuboradi) · 2-savol (`Band-qildi`) ↔ arena 2, 8 (qator, sanoq) ·
3-savol (telefon + laptop) ↔ arena 5, 6 (xotira, yangilash) · 4-savol (jadvalni o'qish) ↔ arena 9 (qatorlar xatosi).
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): hodisa · `hodisalar` · `POST /hodisalar` · `hodisaYoz` · brauzer ID · `brauzer_id` · `maydon-brauzer` · localStorage ·
`ochdi` · `vaqt-tanladi` · `band-qildi` · `COUNT(DISTINCT …)` · 400 · Umami · Maydon
Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — qurishda kerak bo'ladigan narsalar (qolipda yo'q yoki qo'shimcha)
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14, pilotdan nusxa yo'q); palitra `qolipRang('tex')`, `qolipCss(T)`; `LESSON_META.lessonId` `m8-02-event-tracking-v1`.
   `SCREEN_META` 18: hook · plan · concept · test · concept · test · concept · test · practice(kod) · concept · test · concept · test(final, `scope: 'final'`) · practice(A1) · practice(A2) · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **1 (B)** · s5 **2 (C)** · s7 **0 (A)** · s10 **3 (D)** · s12 sentinel **0**; QKod (8) va bloklar (13, 14) — `practice: -1`, blok signali `PRACTICE_BASE + ekran`.
2. **Bitta manba (180):** `HODISA_NOMLARI` (3 nom — 2, 4, 8, 12-ekranlar va Backend tuguni ro'yxati) · `HODISA_TUGUNLAR` (chizma) · `NAMUNA_QATORLAR` (9-ekran, 9 qator) ·
   `SAVOL4_QATORLAR` (10-ekran, 5 qator) · `BIR_KUN` `{ umami: 31, biz: 36 }` (11-ekran; to'sgichli doiralar soni — ikki son farqi) · `FINAL_BOLAKLAR` (12-ekran, 6 bo'lak).
3. **`HodisaChizma`** komponenti: telefon(lar) (191 ramka, «Maydon» maketi: kataklar, forma, «Band qilish»), «Brauzer xotirasi (localStorage)» kartasi, Sayt · Backend · Database tugunlari,
   Backend ichidagi nomlar ro'yxati (yoqilgan / kulrang), jadval kartalari `bandlar` va `hodisalar` (ustun qo'shilishi — `brauzer_id`, qator kirishi, qizg'ish qator, brauzer rangi bo'yicha guruhlash),
   konvert + yorliq, holatlar `201` / `400`, chetda kulrang Umami tuguni va «to'sgich» yorlig'i. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: hc-telefon hc-katak hc-sorov hc-kalit`).
   Maket o'zi `prefers-reduced-motion` da to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **0-ekran `QKirish`:** telefon (to'sgich yorlig'i bilan) + `bandlar` kartasi + Umami kartasi; band qilinmaguncha variantlar xira; javobdan keyin uzuq `hodisalar` kartasi.
5. **`QTushuncha` ekranlari** (`zoom`, `tugadi` majburiy — q17/q18): 2 — `QQadamlar` (3) + konvertlar · 4 — 5 so'rov-kartasi + kalit «Tekshiruvni o'chiring» (2 qadam) ·
   6 — `QQadamlar` (3) + ikki telefon + xotira kartalari + ustun qo'shilishi · 9 — ikki sanash tugmasi + uch ustun + SQL kartasi (`fmtCode`) · 11 — «Kunni boshlang» oqimi (36 doira) + ikki hisoblagich.
   Bashorat (`QBashorat`/`QTaxmin`) — 2, 4, 6, 9, 11-ekranlarda, ballsiz, `onAnswer` ga kirmaydi.
6. **QKod (8) → `HtmlCompiler`** (ko'p fayl: `index.html` va `maydon.js` tayyor · `app.js` o'quvchi). **Yangi runtime tekshiruvlari** (yashirin tekshiruv-iframe'ida):
   sahifa yuklanganda ro'yxatda `ochdi` aynan 1 marta · `.katak` (18:00) bosilganda `vaqt-tanladi` qo'shiladi · `19:00` + `#band` → «Bu vaqt band», `band-qildi` yo'q · `20:00` + `#band` → «Band qilib bo'lmadi», `band-qildi` yo'q · `18:00` + `#band` → `band-qildi` aynan 1 marta.
   Kod oynasi `sandbox="allow-scripts"` (origin yopiq) — unda localStorage ishlamaydi, shuning uchun namuna `hodisaYoz` ID ni qattiq yozadi (`7f3a…`) va Backend'ga emas, ro'yxatga yozadi.
   Ikki JS fayl tartib bilan ulanadimi — tekshiriladi; bo'lmasa `maydon.js` mazmuni `index.html` ichida `<script>` bo'ladi. ⚠️ `app.js` starter `.jsx` ichida shablon-satr — starterda backtik yo'q
   (string qo'shish bilan yozildi, CLAUDE.md). `storageKey` — `m8d2-code`.
7. **Testlar** `QTest` + `QuestionScreen` (DE-203): 3 (**B**) · 5 (**C**) · 7 (**A**) · 10 (**D**, savol ustida kichik jadval kartasi `SAVOL4_QATORLAR`); yakuniy 12 — `QTartib` (6 bo'lak).
   Variant uzunliklari qurilgandan keyin skript bilan qayta sanaladi.
8. **`ScreenBlok` ×2** (skeletdagi ulagich) + `QPrompt` — 5 qadam (5-qadam «O'z g'oyangiz», `{…}` joylari accent pill). A2 3-qadamda nusxa tugmasi **yo'q** (qo'lda).
   Promptlar uch yorliqli qator: «Qayerda · Nima qilsin · Nima buzilmasin». `ortda`: A1 `m10-dars-02-start`, A2 `m10-dars-02-done`.
   A1 5-qadam: o'z uch hodisasi formasi; `pm-m7d6-qadamlar` bo'lsa — `hodisa` o'rtadagi qadamga (TAYANCHGA SAVOL 8); tekshiruv — nom formati `/^[a-z0-9']+(-[a-z0-9']+)*$/`, ≤50 belgi (9-Modul 6 qoidasi).
9. `RECAPS` 5 (kalit = 3, 5, 7, 10, 12) · `Q_LABELS` {3, 5, 7, 10, 12} · `ACHIEVEMENTS` 5, `ACH_TRIGGERS`: 3 → Event Path, 5 → Name Guard, 7 → Two Browsers, 10 → True Count, A2 oxirgi «Bajardim» → Own Events.
10. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) + `QZ_BG_SHAPES` fon so'zlari `{uz, ru}`, emojisiz · `FLASHCARDS` 12 ({front, back, note}) · `HW_TOKENS`.
11. App.jsx `m8-02` qatoriga `comp: EventTrackingLesson` — asosiy seans, «qur» bosqichida (nom va `sub` o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari.
12. **Darvozalar:** `npm run gates -- src/8-Modull/EventTrackingLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:layout` 1280/390 · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-02-start` = `dars-11-done` → `m10-dars-02-done`; «qur» bosqichida, 9-Modul repo'si yopilgandan keyin)
1. `backend/src/hodisa.entity.ts` — `@Entity('hodisalar')`: `id` (`PrimaryGeneratedColumn`) · `nom` (varchar 20) · `brauzer_id` (varchar 64) · `yaratilgan` (`CreateDateColumn`, timestamptz).
   `variant` ustuni bu tegda **yo'q** — 4-darsda qo'shiladi (TAYANCHGA SAVOL 2).
2. `backend/src/hodisalar.controller.ts` — `POST /hodisalar` `{ nom, brauzer_id }`: `HODISA_NOMLARI = ['ochdi', 'vaqt-tanladi', 'band-qildi']`; `nom` ro'yxatda bo'lmasa —
   `BadRequestException` «nom — ochdi, vaqt-tanladi yoki band-qildi» (400); `brauzer_id` satr, 1–64 belgi, aks holda 400; to'g'ri bo'lsa `save` → `201 { id }`. Ism, telefon qabul qilinmaydi.
3. `backend/src/app.module.ts` — `entities: [Band, Hodisa]`, `TypeOrmModule.forFeature([Band, Hodisa])`, `HodisalarController`. `synchronize: true` jadvalni o'zi yaratadi (Render'da ham — o'sha Neon `DATABASE_URL`).
   Yangi `.env` qiymati yo'q.
4. `web/src/hodisa.js` — `brauzerId()`: localStorage `maydon-brauzer` o'qiladi; yo'q bo'lsa `crypto.randomUUID()` (bo'lmasa — `Math.random` dan zaxira; HTTP manzilda `randomUUID` yo'q) va saqlanadi;
   localStorage ishlamasa (`try/catch`) — ID shu sahifa uchun xotirada. `hodisaYoz(nom)`: `fetch(API + '/hodisalar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nom, brauzer_id }) }).catch((e) => console.warn('hodisa yozilmadi', e))` —
   xato foydalanuvchiga chiqmaydi, sayt ishlayveradi, konsolda ogohlantirish qoladi (02-FILTR).
5. `web/src/main.jsx` — `import { hodisaYoz } from './hodisa.js'`; `if (!egami) hodisaYoz('ochdi')` — modul darajasida, sahifa yuklanishida bir marta
   (`useEffect` da emas: `StrictMode` dev rejimida effektni ikki marta ishga tushiradi). `/ega` sahifasi sanalmaydi.
6. `web/src/App.jsx` — `tanla(soat)` ichida `hodisaYoz('vaqt-tanladi')`; `saqlandi(soat)` ichida `window.umami?.track?.('band-qildi')` yonida `hodisaYoz('band-qildi')` (409 da `bandEdi` chaqiriladi — hodisa yo'q).
   Umami qoladi: `index.html` skripti, `data-umami-event="vaqt-tanladi"`, `umami.track('band-qildi')`.
7. README: «Darslar va teglar» jadvaliga `m10-dars-02-done` qatori («`hodisalar` jadvali, `POST /hodisalar`, saytda `hodisaYoz` uch joyda, Umami qoladi»);
   yangi bo'lim «Hodisalarni sanash» — `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;`; «Xatolar»: jadvalda hodisa yo'q — Backend ishlamayapti yoki `VITE_API_URL` noto'g'ri.
8. **Muhrdan oldin haqiqiy tekshiruv (P-028):** Chrome'da va inkognito oynada — ikki xil `brauzer_id`; reklama to'sgichi (uBlock Origin kabi) yoqilganda `POST /hodisalar` o'tishi va Umami skripti to'silishi;
   Netlify + Render'da push'dan keyin `hodisalar` jadvali yaratilishi; Antigravity A1 3-qadamdagi tekshiruv so'rovini Windows'da qanday yuborishi.
9. **Keyingi darslar uchun ochiq qoldi:** `GET /hodisalar/sanoq?kun=` va `/dashboard` (3-dars) · `variant` ustuni (4-dars) · so'rovlar chegarasi `POST /hodisalar` (8-dars).

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim, tasdiq kerak)
1. **Umami'dagi 31 — qaysi son?** Tayanchda «Umami — ochilish 31». Men **Visitors** deb oldim: o'z tizimimizning 36 si — turli brauzerlar soni; Views (sahifa ochilishlari) boshqa o'lchov bo'lardi va
   9-Modul 6-darsidagi «har xil o'lchovni solishtirish» xatosi qaytardi. Views bo'lsa — 11-ekran hisoblagichi va arena 10 yorlig'i o'zgaradi.
2. **`variant` ustuni 2-darsda yo'q.** Tayanch 3-bo'limdagi ustunlar ro'yxatida `variant` bor, teg jadvalida esa u 4-darsda qo'shiladi. 2-darsda 4 ustun: `id · nom · brauzer_id · yaratilgan`.
   3-dars (dashboard) shu 4 ustunga tayanadi.
3. **Brauzer ID ta'rifida «tasodifiy qator» → «tasodifiy harf va raqamlar».** Nega: T-015 — bu darsda «qator» jadval qatori ma'nosida ko'p ishlatiladi (9-ekran «Qatorlarni sanaysizmi…»);
   ikkinchi ma'no 13 yoshga chalg'itadi. Tayanch ta'rifi shu so'z bilan yangilansinmi (3-dars ham brauzer ID ni ishlatadi)?
4. **`ochdi` — `main.jsx` da, `useEffect` da emas.** Nega: `StrictMode` dev rejimida effekt ikki marta ishlaydi — har ochilish ikki qator bo'lardi (turli brauzerlar soni o'zgarmasa ham).
   `/ega` sahifasi `ochdi` yozmaydi. 3-dars «Oxirgi 5 daqiqada» raqami shu hodisalarga tayanadi.
5. **A1 da tekshiruv so'rovi va `DELETE … WHERE brauzer_id = 'tekshiruv'`** (05.10 asosiy seans: butun jadval o'chirilmaydi — tayanch 9.6). Agent terminalda ikki so'rov yuboradi (`ochdi` · `Band qildi`, `brauzer_id` — `tekshiruv`), o'quvchi Neon'da ko'radi va jadvalni tozalaydi.
   DELETE 4-Modul CRUD darsida o'tilgan. Muqobil — tekshiruvni A2 ga qoldirish (unda 400 qo'lda tekshirilmaydi).
6. **Namuna jadval ma'lumoti** (o'ylab topilgan, statistika emas): 0-ekran `Bugun · 18:00 · Ali` (9-Modul namunasi) · ID lar `7f3a…`, `c91e…`, `e05b…` · 9-ekran 9 qator (4 · 4 · 1 → 3 · 2 · 1) · 10-ekran 5 qator.
   Boshqa darslar (3-dars dashboard) bu ID larni ishlatsa — tayanchga yozilsinmi?
7. **11-ekranda 36 − 31 farq to'liq «to'sgich»li brauzerlarga bog'langan** (Mentor misoli simulyatsiyasi). Tayanch «sabablardan biri» deydi — xulosa va QIzoh shunday; simulyatsiyaga ikkinchi sabab
   (inkognito oyna) qo'shilsinmi? Men qo'shmadim — ekranda bitta mexanika (P-052).
8. **A1 5-qadam `pm-m7d6-qadamlar` ni o'qiydimi** (9-Modul 6-dars kaliti `{ asosiy, oldingi, hodisa }`). 10-Modul tayanch 8-bo'limida yo'q; o'qisa — o'rtadagi hodisa nomi o'zi qo'yiladi,
   o'qimasa — o'quvchi o'zi yozadi (M-q5). Yangi kalit yozmadim.
9. **QKod (8-ekran)** — kod oynasida localStorage va Backend yo'q, namuna `hodisaYoz` ro'yxatga yozadi; HtmlCompiler'ga ketma-ket bosish va `async` bilan yangi runtime tekshiruv kerak (KOD 6).
   Qurishda og'ir bo'lsa — ekran QTushuncha'ga (uch joyni bosib tanlash) aylanadi, lekin qo'lda yozish faqat A2 da qoladi.
10. **Uyga vazifa — o'z loyihasi** (qaror IP-q1: 1–7-darslar — o'z MVP). Maydon fork'ini push qilish so'ralmadi. 3-dars Maydon'ning real hodisalarini kutsa — uyga «Maydon'ni push qiling» qadami qo'shiladi.
11. **0-ekran Mentori 1-dars bosh raqamini eslatadi** («haftada band qilingan vaqtlar», tayanch 1-bo'lim). 1-dars MD si boshqacha nomlasa — moslanadi.
12. **Blokda 5 qadam** (4 + «O'z g'oyangiz») — 9-Modul M-q1 bilan bir xil; P-059 dagi 4 qadamdan bittaga ko'p.

## Shubhali joylar (ishonchim komil emas)
1. **Umami Visitors inkognito oynada o'zgarmasligi** — hujjat: sessiya «Website ID, hostname, User-Agent … xeshi + oylik tuz»; inkognito oynada User-Agent o'sha, shuning uchun «o'zgarmasligi mumkin» deb yozildi.
   Jonli tekshirilmagan (REPO 8).
2. **Umami «Events» bo'limidagi son** — har yozilgan hodisani sanaydi deb tushunaman, lekin A2 da faqat «oshdi» deyildi, «necha» deb da'vo qilinmadi; kutilgan natijadagi `vaqt-tanladi 2` shu taxminga tayanadi.
3. **Reklama to'sgichi bizning `POST /hodisalar` ni to'smasligi** — darsda da'vo qilinmadi (faqat «Umami skriptini to'sishi mumkin»). Ba'zi ro'yxatlar umumiy analitika yo'llarini to'sadi; `/hodisalar` ular orasida bo'lmasa kerak — tekshirilmagan.
4. **A1 3-qadam** — agent tekshiruv so'rovini qanday yuborishi (curl, PowerShell yoki boshqa) o'quvchining tizimiga bog'liq; natijani baribir Neon tasdiqlaydi (4-qadam).
5. **0-ekran hook'i** — to'g'ri javob ekrandagi kichik yorliqni payqashga va 9-Modul 6-darsini eslashga tayanadi; payqamagan o'quvchi uchun «Qiziq fikr!» javoblari adolatli, lekin hook biroz «topishmoq» bo'lib qolishi mumkin.
6. **«Hodisa — analitikaga yoziladigan bitta harakat»** — `ochdi` (sahifa ochilishi) harakatmi? 9-Modul ham shu ta'rif bilan ochilishni qadam deb olgan; o'zgartirmadim.
7. **12-ekran finali** — 1→2 orasida sayt `POST /bandlar` yuborishi tushirib qoldirilgan (5 bo'lak). Soddalashtirish yolg'on emas (T-045), lekin to'liq ham emas.
8. **6-ekran joriy qatori ikki gap** (120 belgi) — atama ta'rifi va maxfiylik bir joyda; qisqartirilsa «ism, telefon» qismi faqat Mentorda qoladi.
9. **8-ekran** — `async function` va `await` o'quvchi uchun yangi ko'rinishi mumkin; o'quvchi ularga tegmaydi, faqat bitta chaqiruv qo'shadi.

---

## Pilot qurilishi (05.10.2026, F-1005-169) — kodda MD dan farqlar (ko'rikda tasdiqlanadi)
- Darvoza (`lint:tell`) uchun so'z tuzatishlari MD ga ko'chirildi (✎ belgili): 7-ekran C · arena 3, 5, 6, 8 · 11-ekran xulosasi (107).
- 8-ekran: `HtmlCompiler` faqat birinchi JS faylni ulaydi — MD dagi zaxira yo'li: `maydon.js` mazmuni `index.html` ichida `<script>`; fayllar `app.js` (birinchi) va `index.html`.
  Tekshiruvlar kutmasdan ishlagani uchun `index.html` yuklanganda to'rt holatni o'zi sinaydi (`window.natija`); 3-shartga «muvaffaqiyatli bandda `band-qildi` kamida bir marta» qo'shildi. «Bajardim» — kompilyatorning «Davom etish»i.
- Qo'shilgan namuna vaqtlar: 4-ekran 16:21–16:25, 6-ekran 16:11 va 16:12 · 8-ekran o'ng ustunida `app.js` boshlang'ich kodi (o'qish uchun) · A1 formasida nom noto'g'ri bo'lsa faqat qizil ramka.
- QBlok «Ortda qoldingizmi» qatorida «(`.env` fayllaringiz o'zgarmaydi)» izohi yo'q (qolip imkoni yo'q). Own Events nishoni — A2 oxirgi «Bajardim»da.
- ~~Ochiq vizual~~ → tuzatildi 05.10 kech (F-1005-171): 8-ekran kod panelida uzun qator keyingi qatorga 4 belgi chekinish bilan o'tadi (telefonda `.forEach(`, `.addEventListener(` oldidan) ·
  ⛶ telefonda mazmun ustida alohida qatorda (0, 6, 9, 12, 13, 14-ekranlar; Umami tuguni ham) · ekran hisobi bir qatorda. Ochiq: «Ortda qoldingizmi» 393 da kesiladi (qolip — MEXANIZM-TAKLIF 6).

### Qayta qurish (06.10.2026, foydalanuvchi fidbeki F-1005-174 → F-1005-178) — kodda shunday, ertalab ko'rikda tasdiqlanadi
- **Bitta vizual:** «Sayt · React» (`hodisaYoz`) — telefon ramkasi ustidagi yorliq, alohida tugun yo'q; brauzer xotirasi telefon ichidagi pastki qatorda; Umami — telefondan ingichka kulrang chiziq.
  Telefon hamma ekranda 172×272, doim chapda; so'rov konverti telefondan Backend'ga uchadi, yangi qator yashil bo'lib kiradi.
- **0-ekran:** `bandlar` jadvali va «Umami · Maydon» kartasi o'rniga band qilingach ikki hisoblagich: «Maydon jadvali: +1 band ✓» (ru «Таблица Maydon: +1 бронь ✓») va «Umami: 0» (to'sgich belgisi).
- **2-ekran:** qadamlar ro'yxati o'rniga tugma telefon ostida («Saytni oching 1/3»); `bandlar` jadvali o'rniga «bandlar +1 band ✓» belgisi; joriy qator, taxmin va xulosa — bitta natija bloki.
- **4-ekran:** beshta karta o'rniga telefonda bitta so'rov `hodisaYoz('…')` + «Yuborish» (ru «Отправить»); 400 da konvert qaytadi, sabab qatori Backend ostida; tekshiruv kaliti Backend tugunida; yuborilganlar bitta ixcham qatorda.
- **6-ekran:** ikki telefon chapda, har birining ostida «Ochish» / «Yangilash» (ru «Открыть» / «Обновить»), bajarilgani «✓ Yangilandi» / «✓ Ochildi» («Обновлено» / «Открыто»); jadval o'ngda.
- **8-ekran:** vazifa ostida mini-telefon va uch qator «sahifa ochildi · katak bosildi · band saqlandi (201)» (ru «страница открылась · нажат слот · бронь сохранена (201)»); koddagi uch «shu yerga» joyi 1–3 belgisi bilan.
- **9-ekran:** chapda jadval, o'ngda uch katta hisoblagich; sanalgan qatordan nuqta ustuniga uchadi. **11-ekran:** 36 doira o'rniga telefondagi hisoblagich «N / 36 brauzer» (ru «браузеров») va yo'lakda «to'sgich · N».
- **Har tushuncha yakuni:** izoh + «Taxminingiz» + xulosa — bitta natija bloki. Ochiq: A1/A2 chap karta qisqa (QBlok qolip) · 11-ekran RU yakuni 1280×800 da 20–40 px pastga tushadi.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-01` «Bir oyda qaysi raqamni o'stirasiz?» → **`m8-02` «Hodisalar tizimi: har harakat jadvalga yoziladi»** → `m8-03` «Loyiha kuni: jonli dashboard»
  (App.jsx 329–331-qatorlar, 05.10); reja teglari `sub` so'zlari bilan: `hodisa` · `Backend` · `Database` · `uch hodisa`.
- [x] Bitta misol-ip («Maydon», hook → bloklar); metafora yo'q; keyssiz (tayanch 5); bitta vizual — «Hodisalar chizmasi» `HODISA_TUGUNLAR` (0, 1, 2, 4, 6, 9, 10, 11, A1/A2).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (konvert → qator), 4 (201/400, kalit), 6 (xotira → ustun), 9 (ikki sanash → ustunlar), 11 (oqim → hisoblagichlar) + 0, 8, 12, A1, A2.
- [x] O'lchov (Python `len()` bilan, skript scratchpad'da): sarlavhalar 25–50 · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi · xulosalar 84–108 · hook javoblari 76–106 · xato izohlari 42–60.
  ✗ 6-ekran joriy qatori 120 (ikki gap, ta'rif — shubhali 8).
- [x] Atamalar oldingi darslar bilan: hodisa, uch qadam, nom qoidasi (9-Modul 6) · sayt · Backend · Database · jadval · qator · yo'l (route) · 409 (9-Modul 4, 9) · 400 (4a-Modul) · SQL Editor (9-Modul 9) ·
  localStorage «brauzer eslab qoladi» (2-Modul) · Antigravity, «Shu xato chiqdi: {xato}. Tuzat.» · siz-forma; tugmalar siz-formada, yorliqlar ot-shaklda; promptlar agentga buyruq shaklida (T-002).
  «qator» — faqat jadval qatori (brauzer ID ta'rifi moslandi — TAYANCHGA SAVOL 3) · «yo'l» — faqat route · «sinov» ishlatilmadi (agent so'rovi — «tekshir», `tekshiruv`).
- [x] Testlar: variantlar uzunligi yaqin (3: 37–41 · 5: 37–42 · 7: 32–34 · 10: 29–34), to'g'ri variant eng uzun emas; kalit so'z/strelka/qavs faqat to'g'rida emas; inkor-savol yo'q ·
  ✔: s3 B · s5 C · s7 A · s10 D · arena A·B·C·D ×3; to'g'ri izoh bitta gap, «To'g'ri!» yo'q.
- [x] Final (12-ekran): uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi; tartib 2 va 8-ekranlarda o'rgatilgan (P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, F-ID, T6, `m8-02` — faqat MD izohlarida; o'tgan dars nomi bilan atalgan) · real kompaniya raqami yo'q · texnik faktlar manba bilan (A-9) ·
  «KOD» (12) va «REPO» (9) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-009/010 (har ekran o'smir ko'zi bilan o'qildi) · T-011 (brauzer ID — harakatdan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 · T-016/017 (metafora yo'q) ·
  T-024 · T-029 · T-039 («Maydon», «loyihangiz») · T-042 (ta'riflar so'zma-so'z) · T-043 («bu misolda», «Mentor misolida», sarlavhada son yo'q) · T-045 (finalda soddalashtirish — shubhali 7) · T-047 · T-052 · T-064 ·
  P-001/004 · P-008 · P-010 · P-013 · P-014/015 · P-016 (hook — shubhali 5) · P-025 · P-026 (har tashqi qadamda xato yo'li bitta gap) · P-028 (REPO 8, Umami/Neon yozuvlari 9-Moduldagidek) ·
  P-036 · P-046 · P-048 · P-052 · P-055 · P-062 · P-063 · P-064 · P-065 · P-067 · S-001 (savollar 7–10 so'z) · S-002 · S-004 · S-006 · S-008 · S-010 · S-019 · S-020 · S-026.
  ✗ P-059 «4 qadam» — 5 qadam (M-q1) · ✗ P-011 to'liq skelet — builder/debugging alohida yo'q (QKod 8 va 4-ekran xato nomlari uning o'rnida).
