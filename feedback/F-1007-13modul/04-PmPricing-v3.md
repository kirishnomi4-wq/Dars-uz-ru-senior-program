# 13-Modul (kod: `src/11-Modull`) · 4-dars (PM + amaliyot) «Narxni qanday belgilaysiz?» — MD v3

Fayl: `src/11-Modull/PmPricingLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-04` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; tayanch 4 «PM+PRAKT») · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul SABOQ 19–31, 11-Modul SABOQ D 32–39, **12-Modul SABOQ E 40–55** — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (bitta tugma — yengil halqa; variantlar — har birining o'z yengil chegarasi, E 40) · bashorat tanlangach yopilmaydi — natija yashil xulosa qutisining birinchi kichik qatori (E 42) ·
ko'p maydonli ish — bittadan karta (E 53) · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror) · maketda hech narsa kesilmaydi (E 41) · yakuniy holat ixcham (1280×800 da skrollsiz) · odam chizilmaydi (bu darsda odam kerak emas).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 8-ekran — **D** (`correctIdx 3`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 447–449, grep 07.10.2026, DE-205): `m11-03` «Webhook: to'lov Backend'ga qanday yetib keladi» → **`m11-04` «Narxni qanday belgilaysiz?»** (osti: «xarajat, raqobat, qiymat → narx va to'lov taklifi ekrani», `type: 'PM'`, `comp` hali yo'q) → `m11-05` «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz».
Tur (PM-005): **gibrid — PM qismi 2-tur (artefakt — o'quvchining narx varag'i: xarajat · raqobat · qiymat · narx va to'lov taklifi ekrani matni) + amaliyot (o'z repo'si, ikki blok)**. **Keyssiz** (Qaror-0 21; tayanch 5). REPO — `maydon-jamoa` (`m13-dars-04-start` = `m13-dars-03-done` → `m13-dars-04-done`).
⚠️ **Pul chegarasi (TAQIQLAR 1, Qaror-0 5, 6, PW-q0 A) — har ekranga tegadi:** real pul yo'q — faqat test rejim, «mashq to'lov» · karta ma'lumoti hech qayerda (karta raqami, amal qilish muddati, CVV, SMS kod — maketda, namunada, promptda, kalitda yozilmaydi va chizilmaydi; to'lov taklifi ekranida ham, mashq sahifasida ham karta maydoni yo'q) ·
har to'lov ekranida test belgisi: to'lov taklifi ekranida **«Test rejim: pul yechilmaydi»**, mashq sahifasida **«Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.»** · `TOLOV_KALITI` qiymati faqat `backend/.env` va Render sozlamasida · «Mashq to'lov» Payme yoki Click nomi va ko'rinishini taqlid qilmaydi · narx — **«Mentorning taxmini»**, o'quvchiga «shuncha qo'ying» deyilmaydi · avtomatik yechish yo'q.
⚠️ Modul raqami o'quvchi matnida — LMS raqami («12-Modulda»); kod raqami (`m11-04`, `src/11-Modull`) faqat fayl yo'lida. Shu modul darslari — «1-darsda», «3-darsda» (pilot 06 odati).
**Vaqt (≈ 90 daqiqa — reja, o'lchov emas):** kirish va reja (0–1) ≈ 5 · narx varag'i va 1-savol (2–3) ≈ 13 · to'lov taklifi ekrani (4) ≈ 8 · o'z narxingiz (5) ≈ 10 · Amaliyot 1 ≈ 22 · Amaliyot 2 ≈ 20 · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 10 · zaxira ≈ 2.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (ikki blokda ikki marta Render kutishi, A1 da to'rt tekshiruv); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 11-band.
Manba: `00-MODUL-TAYANCH.md` (1.0 — Pro, «Doimiy o'yin», avtomatik yechish yo'q · 1.1 — 10 000 birinchi taxmin · 1.3 — mashq to'lov, webhook, `GET /men` · **1.4 — uch usul, Mentor narxi, to'lov taklifi ekrani, «Doimiy o'yin», bloklar, do'kon qoidalari — AYNAN** · 1.5 — `05-start` holati · 1.13 — sonlar, 4-qator · 2 — atamalar · 3 — teg 04 · 4 — PM+PRAKT · 6 — Render, kurs, do'kon qoidalari · 7 — sinflar · 8 — `pm-m11d4-narx` · **9 — 9.1, 9.2, 9.5, 9.7, 9.8, 9.16–9.22 MAJBURIY**) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 5, 6, 8, 9, 10, 21, 22, 23) · `00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` (4 — o'tilgan atamalar) · 11-Modul tayanchi (9.29 `GET /oyinlar`, 9.30 `kun` — sana, 9.31) · 12-Modul tayanchi (1.6, 1.7, 9.19, 9.35 a, 9.36 h, 9.39 b) ·
namunalar: 12-Modul `07-PmFiftyUsers-v3.md` + `07-FILTR.md` (PM+PRAKT shakli) · `03-PmRealtimeSpec-v3.md` + `03-FILTR.md` (talab zinapoyasi) · pilot `03-PaymentWebhook-v3.md` (mashq sahifasi, webhook, A1/A2) · `QURUVCHI_SABOQ.md` E 40–55 — matn ko'chirilmadi.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «GIBRID: xarajat/raqobat/qiymat → narx shu darsda real paywall'ga; mobil trekda paywall — web sahifa orqali»; natija «Asoslangan narxli paywall ishlaydi»; tayanch 4: «asoslangan narx; to'lov taklifi ekrani test rejimda ishlaydi»; Qaror-0 2, 9, 10):
   o'quvchi o'z mahsuloti uchun **narx varag'ini** yozadi — xarajat (manbasi bilan) · raqobat · qiymat · narx (davri bilan) — va to'lov taklifi ekrani matnini (5-ekran; `pm-m11d4-narx`);
   **Amaliyot 1** da mahsulotida Pro holati (`pro_gacha`, `GET /men`) va bitta pullik qulaylik paydo bo'ladi: Pro bo'lmasa bosilganda to'lov taklifi ekrani chiqadi;
   **Amaliyot 2** da to'lov yo'li ulanadi: «To'lovga o'tish» → Backend yangi to'lov raqamini beradi (`POST /tolov/boshlash`, tayanch 9.7) → brauzerda 3-darsdagi «mashq to'lov» sahifasi → «To'lash (mashq)» → to'lov xabari → Backend Pro muddatini uzaytiradi → ilova `GET /men` dan Pro'ni o'qiydi.
   Tekshiruvni o'quvchi o'zi qiladi (bitta yo'l: «To'lash (mashq)» dan keyin Pro). Agentning «to'lov ishlaydi» degani — da'vo (tayanch 1.5 boshi); boshqa holatlar bu darsda tekshirilmaydi va va'da qilinmaydi (T-038).
   Saqlanadi: `pm-m11d4-narx` (5, 6, 7, 9-darslar o'qiydi). Repo'da (tayanch 3, `m13-dars-04-done`): `oyinchilar.pro_gacha` · `GET /men` · to'lov taklifi ekrani · «Har hafta takrorlansin» va keyingi o'yin `GET /oyinlar` da · `POST /tolov/boshlash` · mashq sahifasi raqam bilan · webhook Pro'ni 30 kun uzaytiradi.
   Mentor misoli — namuna va «kutilgan natija», umumiy qolip emas (tayanch 7.4). 15 000, 83 000, 6 — Mentor misolining sonlari, o'quvchiga me'yor emas.
2. **Bugungi asosiy fikr (P-013; dars ichida turadi, yakunda KO'RSATILMAYDI — SABOQ E 50):** Narx xarajat, raqobat va qiymatga qarab taxmin qilinadi; to'lov taklifi ekrani uni ko'rsatadi, Pro'ni esa to'lov xabaridan keyin Backend yoqadi — hammasi test rejimda.
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4):**
   - 13-Modul 1-dars: **pullik obuna** (doim ikki so'z) · **Pro** — Mentor misolida tashkilotchi uchun 30 kunlik pullik obuna · **«Doimiy o'yin»** — har hafta shu kun va soatda o'yin o'zi e'lon qilinadi · **to'lovchi** · narx taxmini **10 000 so'm / 30 kun — «Mentorning taxmini»** (birinchi taxmin) · `pm-m11d1-birlik`.
   - 13-Modul 2-dars: **bepul asos va pullik qo'shimcha** — Mentor tanlovi (o'yinchilar bepul, tashkilotchi Pro) · tashkilotchilar **6** (Neon SQL, `namuna = false`) · `pm-m11d2-model` (`nima`, `soni`). Model nomi bu darsda faqat O'qituvchi eslatmasida.
   - 13-Modul 3-dars: **to'lov xizmati** · **to'lov sahifasi** · **to'lov xabari** (texnik nomi webhook) · **imzo** · **takror xabar** · **rad etilgan to'lov** · **test rejim** · **mashq to'lov** — sahifa `GET /tolov-mashq` («Mashq to'lov», «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.», «To'lash (mashq)», «Rad etish (mashq)», «Ikki marta yuborish», «Imzosiz yuborish») ·
     `tolovlar` · `POST /tolov/webhook` (avval imzo, keyin takror, keyin yozuv — tayanch 9.2) · `TOLOV_KALITI` · to'lov oqimi sxemasi (`pm-m11d3-oqim`) · README «To'lov» bo'limi va uning «Hozircha …» qatori.
   - 11–12-Modul: `backend/` (NestJS, Neon, Render) · `oyinlar` (`id` · `kun` (sana) · `soat` · `maydon` · `kerak` · `tashkilotchi_id` · `yaratilgan`) · «E'lon berish» · `GET /oyinlar` · `POST /oyinlar` · token · `401`, `403` · Neon SQL Editor «Run» · `.env` odati · trek (`pm-m9d8-platforma.trek`) · «Ortda qoldingizmi».
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi bir xil (T-042):**
   - **narx** — odam to'laydigan pul (2-ekran, narx qatori ochilgach). 1-darsda «narx taxmini» bo'lib uchragan — bugun asoslanadi.
   - **xarajat** — mahsulotni ushlab turish uchun sarflanadigan pul (2-ekran, 1-qadamdan keyin). Ishlatilmaydi: tannarx.
   - **raqobat** — odam bugun shu ishni nima bilan qilishi (2-ekran, 2-qadamdan keyin). Ishlatilmaydi: kompetitor, raqib.
   - **qiymat** — mahsulot odamga nima berishi (2-ekran, 3-qadamdan keyin). Ishlatilmaydi: «value», foyda (pul ma'nosida).
     (Tayanch 2 ta'rifi: «raqobat — odam bugun shu ishni nima bilan qiladi · qiymat — mahsulot odamga nima beradi»; gapga qo'yilganda «-ishi» shaklida — ma'no o'zgarmagan, TAYANCHGA SAVOL 2.)
   - **narx varag'i** — to'rt qatorli yozuv: xarajat · raqobat · qiymat · narx (2, 5-ekranlar; o'quvchining artefakti). Atama emas — darsning vizual nomi.
   - **to'lov taklifi ekrani** — ilovada pullik qulaylik bosilganda chiqadigan ekran: nima ochiladi, narx, «To'lovga o'tish» (4-ekran, 1-qadamdan keyin); kartochkada bir marta «inglizchasi: paywall». Ishlatilmaydi: paywall (prozada), «pullik devor».
   - **to'lov raqami** (3-darsda tug'ilgan) — bugun uni **Backend beradi**: «To'lovga o'tish» bosilganda (4-ekran, A2; tayanch 9.7).
   - **Pro holati** — `GET /men` javobidagi `pro` va `proGacha` (A1); ilovadagi qator «Pro: {sana}gacha».
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«narx»** — odam to'laydigan pul; Mentor narxi — «Mentorning taxmini». Render'ning oyiga 7 dollari — Mentor uchun **xarajat** (u sarflaydigan pul), o'quvchi matnida «narx» deb atalmaydi; sahifa nomi — «render.com».
   - **«qiymat»** — faqat 4-dars usuli (tayanch 2, T-015). «foyda» — bu darsda yo'q. **«pullik qulaylik»** — umumiy so'z (o'quvchi mahsulotida); Mentor misolida — «Doimiy o'yin».
   - **«obuna»** — faqat «pullik obuna» (bu darsda A-bo'lim va kartochka izohida). **«to'lov»** — mashq to'lov va to'lov xabari; **«to'lab»** — faqat «mashq to'lov» bilan birga; «sotib olish», «sotish» — yo'q.
   - **«test»** — faqat «test rejim» (ballik savollar ekranda «savol»); **«tekshirish · tekshiruv»** — o'z ishini ko'rish (A1, A2 4-bo'lim); **«sinov»** — bu darsda yo'q.
   - **«xabar»** — faqat **to'lov xabari** (birinchi uchrashganda to'liq nomi bilan, 4-ekran). «hodisa», «eslatma» — bu darsda yo'q (12-Modul eslatmalari faqat «Nima buzilmasin» qatorida).
   - **«reklama · B2B · tranzaksiya»** — faqat 2-darsdagi model nomlari sifatida, A1 «Ochish»da bir marta, izohi bilan (B2B — boshqa biznes to'laydi · tranzaksiya — har to'lovdan ulush; tayanch 1.2); Database tranzaksiyasi — yo'q.
   - **«server»** — faqat «boshqa kompaniya serveri» iborasida (tayanch 9.5); bu darsda kerak bo'lmadi — o'quvchi matnida 0. **«hisob»** — akkaunt ma'nosida («hisob raqami», «o'z hisobingiz»); son ma'nosida — «hisoblash» fe'li.
   - **Ishlatilmaydi:** paywall, freemium, sandbox, checkout (prozada), tannarx, kompetitor, premium, VIP, chegirma, keshbek, aksiya, «obuna» yolg'iz, server (prozada), «darhol», «darrov», «har doim», «albatta», «kafolat».
6. **Raqamlar (faqat tayanch 1.0, 1.1, 1.4, 1.13, 6 — «Mentor misolida» / «Mentorning taxmini»):**
   - **Rasmiy (tayanch 6):** Render — eng arzon pullik veb-xizmat **oyiga 7 dollar** (render.com/pricing, 07.10.2026); bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, haqiqiy mahsulot uchun tavsiya qilmaydi · Markaziy bank kursi **07.10.2026: 1 dollar = 11 790,79 so'm** → o'quvchi matnida «taxminan 83 000 so'm (7-oktabr kursi)».
   - **Fakt (Mentor misoli):** bugun Backend, Database, lending, o'rnatish fayli — bepul rejalarda, **0 so'm** · tashkilotchilar **6** (1, 2-darslar).
   - **Mentorning taxmini:** birinchi taxmin **10 000 so'm / 30 kun** (1-dars) → **15 000 so'm / 30 kun** · «hammasi olsa ham»: **6 × 15 000 = 90 000 so'm** — xarajat zo'rg'a qoplanadi · 10 000 da: **6 × 10 000 = 60 000 so'm** — xarajatni qoplamaydi (tayanch 1.4 «xarajatga qarab ko'tarildi» dan hisob — TAYANCHGA SAVOL 5).
   - **Namuna qiymatlar (son emas, belgi — tayanch 9.1):** to'lov raqami `m-7f3a…` (qisqartirilgan; 4-darsdan raqam tasodifiy — taxmin qilib bo'lmaydi, F-1007-462) · hisob `oyinchiId: 7` · maketdagi sana «6-noyabrgacha» (7-oktabrdagi mashq to'lovdan keyin 30 kun — namuna).
   - Boshqa son yo'q: suhbat va tasdiq natijalari (6, 9-darslar), 51 (10-dars) — bu darsda ochilmaydi (sinf 12). Komissiya aytilmaydi. Har xil o'lchovdagi sonlar ayirilmaydi. Ikkinchi misol sonlari yo'q (testlarda son ishlatilmadi).
7. **Misol-ip — «Maydon Jamoa» (tayanch 1.0):** Mentor modeli — tashkilotchi uchun Pro, bitta qulaylik «Doimiy o'yin». 1-darsda Mentor narxni «10 000» deb taxmin qildi, 3-darsda to'lov xabari Backend'ga yetib keldi, lekin Pro va ilova o'zgarmagan.
   Bugun Mentor narxni uch tomondan asoslaydi, to'lov taklifi ekranini qo'yadi va mashq to'lovni Pro'ga ulaydi. Ikkinchi misol faqat testlarda (P-002): **kitob almashish ilovasi** (3-ekran). Metafora yo'q. Keys yo'q. Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: tashkilotchi, o'yinchi.
8. **Pul chegarasi va halollik (Qaror-0 6; TAQIQLAR 1):**
   - 2-ekran Render kartasi ostida kulrang: «Bu kursda Backend bepul qoladi — 83 000 faqat narx hisobi uchun.» (WH-q1 A: Render bepul xizmati qoladi; o'quvchi pullik xizmatga undalmaydi.)
   - A2 da, mashq sahifasi ostida bitta gap (tayanch 1.7, TAQIQLAR 1, so'zma-so'z; YaTT qisqartmasi ochiladi — T-036): «Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.» (FK 27-modda — O'qituvchi eslatmasida.)
   - A2 natijasida: «Pro o'z hisobingizda 30 kun turadi — bu mashq: hech kim pul to'lamagan.» · uyga vazifa kartasi ostida: «Hech kimdan pul so'ramang: bu darsdagi to'lov — mashq.»
   - To'lov taklifi ekranida faqat hozir ishlaydigan narsa (sinf 16): va'da, chegirma, «faqat bugun» yo'q; «Pro shartlari» havolasi — 7-darsdan (bu darsda yo'q).
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; telefon, xizmat kartalari, varaq, Backend tuguni, konvert — chizilgan (CSS/SVG), logotip yo'q; ✓ ✕ › ✎ — belgilar. «Maydon Jamoa» — telefon maketida va mashq sahifasi qatorida, o'z rangida (11-Modul 9.62 yashili); Render — faqat xizmat kartasida nomi bilan, logotipsiz.
   O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q. Matn o'lchovi — «O'lchov» bo'limi (skript bilan sanalgan; qavsdagi sonlar — belgilar soni).
10. **Trek (tayanch 4):** mobil trek — to'lov sahifasi **telefon brauzerida** ochiladi (do'kon qoidasi — 4-ekran bir gap); web-trek — xuddi shu yo'l saytda (sahifa yangi oynada ochiladi, saytga qaytganda Pro holati qayta so'raladi). Farq — A1, A2 «Ochish» qadamida va «Yordam»dagi web-trek qatorida bir gap. Trek `pm-m9d8-platforma.trek` dan; yo'q bo'lsa — ikkala gap ko'rinadi.
    O'quvchi mahsulotida «Doimiy o'yin» yo'q — **o'z pullik qulayligi** (`pm-m11d2-model.nima` dan oldindan); modeli reklama, B2B yoki tranzaksiya bo'lsa — amaliyot **alohida mashq ekranida** (menyuda yo'q, faqat o'zi ochadi; asosiy ekranlar va model o'zgarmaydi — F-1007-462, TAYANCHGA SAVOL 15).
11. **Vaqt va ulgurmagan yo'l:** taqsimot tepada. A1 «Davom etish» — 3-qadamdan keyin, A2 — 2-qadamdan keyin ochiladi (SABOQ E 55); blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h).
    Ulgurmasa: A1 4-qadamning (3), (4) — uyda; A2 — uyga vazifa ②; narx varag'i 5-ekranda baribir saqlanadi. Yakun sarlavhasi holatga qarab (11-ekran, besh holat). 3-darsdagi webhook (A1, A2) tugamagan o'quvchi — 1-ekran O'qituvchi eslatmasi.
12. **Saqlash kalitlari (tayanch 8 — aynan):**
    - **o'qiydi:** `pm-m11d1-birlik` (`narxTaxmin`, `tur` — 0-ekran va 5-ekranning «1-darsdagi taxmin» qatori; `tur: 'mashq'` bo'lsa son o'quvchiniki deb ko'rsatilmaydi — kulrang «Mentor misoli», tayanch 9.19) ·
      `pm-m11d2-model` (`model`, `nima`, `soni` — 5-ekran qiymat va narx kartalari, A1 «Ochish») · `pm-m11d3-oqim` (`test` — A2 «Ochish»: 3-dars tekshiruvlari tugaganmi) · `pm-m9d8-platforma` (`trek`). Yo'q bo'lsa — o'quvchi o'zi yozadi yoki ikkala trek qatori ko'rinadi.
    - **yozadi:** `pm-m11d4-narx` = `{ xarajat: { oylik, manba }, raqobat, qiymat, narx, davrKun, ekran: { sarlavha, matn, tugma }, ishlaydi: true | false | null, savedAt }` (tayanch 8; F-1007-462 — `null` qo'shildi; qiymatlar — KOD 7; TAYANCHGA SAVOL 16).
      `oylik` — so'mda butun son (0 bo'lishi mumkin) · `manba` — matn («bepul rejalar» · «render.com/pricing, 07.10.2026» · o'quvchi yozgani) · `raqobat`, `qiymat` — matn · `narx` — so'mda butun son · `davrKun` — son (sukut 30) · `ekran.tugma` — sukut «To'lovga o'tish» ·
      `ishlaydi` — `null` (5-ekran saqlanganda: hali tekshirilmagan), `true` — A2 4-qadamda «Pro yoqildi», `false` — «Pro yoqilmadi» (ish fakti: o'quvchi o'zi ko'rgani; F-1007-462). Kalitga ism, login, telefon, `TOLOV_KALITI` qiymati yozilmaydi. Boshqa darsning kaliti yozilmaydi.
13. **Texnik faktlar** — «Manbalar» bo'limida (tayanch 6 va o'zim tekshirganlarim, 07.10.2026); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0, 1.3):** 1-darsda Mentor Pro narxini 10 000 deb taxmin qildi, 2-darsda Pro'ni tashkilotchiga qo'ydi, 3-darsda to'lov xabari Backend'ga yetib keldi — Pro va ilova hali o'zgarmagan. Bugun — narx va to'lov yo'li.
- **Dars ipi:** 0 — telefonda Mentorning to'lov ekrani qoralamasi, narx o'rnida «?»: narxni nimaga qarab qo'yasiz (ballsiz) → 2 — Mentor narx varag'ini qatorma-qator ochadi: xarajat (uxlamaydigan Backend), raqobat (bepul Telegram guruhi), qiymat («Doimiy o'yin») → narx 15 000 (atamalar) →
  3 — savol: gap qaysi qatorga yoziladi → 4 — Pro'si yo'q tashkilotchi belgini bosadi: to'lov taklifi ekrani → brauzerda mashq to'lov → Pro'ni Backend yoqadi (atama «to'lov taklifi ekrani») → 5 — o'quvchi o'z narx varag'ini va ekran matnini yozadi →
  A1 — Pro holati, pullik qulaylik va to'lov taklifi ekrani → A2 — to'lov yo'li: to'lov raqami, mashq to'lov, Pro → 8 — yakuniy savol: ilova Pro'ni qayerdan biladi → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Narx va to'lov yo'li» sahnasi** (`NarxSahna`, dars bo'yi, 163/180; bitta manba `NARX` const: `xizmatlar` · `varaq` · `narx` · `ekran` · `mashq` · `yol`; o'quvchi ma'lumoti `pm-m11d4-narx`):
  - **chapda telefon** (ramka ≈170×272, o'lcham barqaror; yorliq ramka ustida): «Maydon Jamoa» nomi o'z rangida; holatlar — «E'lon berish» (belgi «Har hafta takrorlansin», Pro bo'lsa ostida «Pro: {sana}gacha») · **to'lov taklifi ekrani** (tayanch 1.4 so'zma-so'z: «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «30 kun — 15 000 so'm» · «To'lovga o'tish» · pastda kulrang «Test rejim: pul yechilmaydi») ·
    **brauzer** (manzil `maydon-jamoa-….onrender.com/tolov-mashq?raqam=m-7f3a…`; 3-darsdagi «Mashq to'lov» sahifasi: «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 15 000 so'm» · «To'lash (mashq)» · «Rad etish (mashq)») · **Telegram guruhi** (faqat 2-ekran 2-qadam). Karta maydoni hech bir holatda chizilmaydi.
  - **o'ngda «Narx varag'i»** — to'rt qator: **Xarajat · Raqobat · Qiymat · Narx** (atama tug'ilguncha qator nomi «?»); narx qatori yonida kichik kulrang yorliq «Mentorning taxmini»; varaq ostida hisob qatori («6 × 15 000 = 90 000 so'm») va muhr. 2, 5-ekranlar.
  - **Backend tuguni** (4-ekran, A2 kutilgan natija): ichida mini-jadval `tolovlar` (`tolov_raqami` · `holat`) va qator `pro_gacha`; konvertlar: «yangi to'lov raqami» (ilova → Backend → javob), «to'lov xabari» (sahifa → Backend), `GET /men` (ilova → Backend → «Pro»).
  - **xizmat kartalari** (faqat 2-ekran 1-qadam): Backend (Render) · Database (Neon) · lending (Netlify) · o'rnatish fayli — har biri «0 so'm · bepul reja».
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (yozildi / qoplaydi) → qizil (qoplamaydi). Yangi qator bir lahza ajralib kiradi. `prefers-reduced-motion` da konvert yurmaydi, sonlar sanab o'smaydi — yakuniy holat birdan qo'yiladi (DE-200).
  - Ishlatiladi: 0 (telefon: ekran qoralamasi + varaqning bo'sh qatorlari) · 1 (o'zi yuradi) · 2 (xizmatlar / Telegram / «E'lon berish» + varaq) · 3 (javobdan keyin kichik varaq) · 4 (telefon + Backend) · 5 (telefon — o'quvchining ekrani, varaq — o'quvchiniki) · A1, A2 kutilgan natija · 8 (javobdan keyin kichik Backend).
- **Keyingi bosiladigan joy (qat'iy):** har holatda bitta faol element — yengil halqa (scale ≤ 1.03, sikl ≥ 2 s); tanlov guruhida har variantning o'z chegarasi, to'lqin navbatma-navbat 2 marta (E 40). Yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Jonli ekran (SABOQ 19, E 46):** kirishda elementlar navbat bilan (60–120 ms) · bosish → son kartadan varaq qatoriga uchadi · konvert chiziq bo'ylab yorlig'i bilan uchadi, qabul qiluvchi tugun natijani o'zi ko'rsatadi · hisoblagich sanab o'sadi. Bezak-harakat yo'q.
- **Mentor misolining holati (tayanch 3):**

| | Dars boshida (`m13-dars-04-start` = `03-done`) | Dars oxirida (`m13-dars-04-done`) |
|---|---|---|
| Narx | 1-darsdagi taxmin — 10 000 so'm / 30 kun | **15 000 so'm / 30 kun** — Mentorning taxmini (narx varag'i) |
| Pro holati | yo'q | `oyinchilar.pro_gacha` · `GET /men` (`pro`, `proGacha`) · ilovada «Pro: {sana}gacha» (Amaliyot 1) |
| «Doimiy o'yin» | yo'q | «E'lon berish» da «Har hafta takrorlansin» · `oyinlar.doimiy` · keyingi o'yin `GET /oyinlar` so'ralganda yaratiladi (Amaliyot 1) |
| To'lov taklifi ekrani | yo'q | belgi Pro'siz bosilganda — tayanch 1.4 matni so'zma-so'z (Amaliyot 1); «To'lovga o'tish» ulangan (Amaliyot 2) |
| Mashq to'lov | `GET /tolov-mashq?oyinchi=…&summa=…` — ochiq manzil (3-dars TS 23) | faqat `POST /tolov/boshlash` bergan raqam bilan: `GET /tolov-mashq?raqam=…` (tayanch 9.7, Amaliyot 2) |
| Webhook | yozadi, Pro o'zgarmaydi | yangi `tolandi` — Pro muddati 30 kunga uzayadi (Amaliyot 2) |
| README «To'lov» | «Hozircha: … Pro va ilova hali o'zgarmaydi.» | «Hozircha» qatori yangilangan (Amaliyot 2) |

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Narxni qanday belgilaysiz?** (26) — dars nomi (DE-205)
- Mentor: 1-darsda mahsulotingiz narxini taxmin qilib yozgansiz — o'sha kunni eslab, bittasini tanlang.
  (`pm-m11d1-birlik` yo'q, `narxTaxmin` bo'sh yoki `tur: 'mashq'` bo'lsa — Mentor: Mentor 1-darsda Pro narxini 10 000 so'm deb taxmin qilgan edi — o'z mahsulotingizni o'ylab, bittasini tanlang.)
- Maket (chap; `NarxSahna` telefon holati): Mentorning to'lov ekrani qoralamasi — ramka ustida yorliq «Mentorning rejasi · Maydon Jamoa»; ichida «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · narx qatori «30 kun — ? so'm» («?» accent) · tugma «To'lovga o'tish» (kulrang, bosilmaydi) · pastda kulrang «Test rejim: pul yechilmaydi».
  Telefon ostida bitta kulrang qator: kalit bo'lsa — «1-darsdagi taxminingiz: {narxTaxmin} so'm» · yo'q bo'lsa — «1-darsdagi taxmin: 10 000 so'm · Mentorning taxmini».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Menga ketadigan xarajatni qoplashiga qarab (42)
  - Boshqalar shu ishga so'raydigan pulga qarab (43)
  - Taxminan — ko'nglimga yoqqan songa qarab (40)
- Javob — «xarajat»: **Aynan!** Bu — narxga qaraladigan tomonlardan biri. Bugun qolganlarini ham ko'rasiz. (81)
- Javob — «boshqalar»: **Aynan!** Bu — narxga qaraladigan tomonlardan biri. Bugun qolganlarini ham ko'rasiz. (81)
- Javob — «ko'ngil»: **Qiziq fikr!** Birinchi taxmin shunday bo'lishi mumkin. Bugun unga bir necha tomondan qaraysiz. (92)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegarada qotadi, qolgani xiralashadi; telefondagi «?» bir lahza accent bo'lib yonadi, telefon yonida «Narx varag'i» chiqadi: uchta bo'sh qator (uzuq chiziqli, ichida «?» — keyin to'ldiriladigan joy, U-041) va to'rtinchi qator «Narx · ?» telefon narx qatoriga chiziq bilan ulanadi.
  Qator nomlari yozilmaydi (2-ekran kashfiyoti, P-036). Uchala tanlovda vizual bir xil — payoff hech bir javobni rad etmaydi (KORPUS §119). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga; «Aynan!» / «Qiziq fikr!» — kurs qonuni T-028, T-067). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — Mentor narx varag'i 2-ekranda. Sinfdan so'rang: «1-darsda narxni qanday topgan edingiz?» (son yig'ilmaydi, qo'l ko'tartirilmaydi). 1-darsda narx yozmagan o'quvchi Mentor taxminini ko'radi; o'z narxini 5-ekranda yozadi.
✎ Hook — o'quvchining o'z ishi (1-darsdagi narx taxmini) va o'z savoli (P-016). Variantlarning ikkitasi — darsdagi ikki tomon oddiy so'z bilan (atama nomi yo'q), uchinchisi — 1-darsdagi taxmin. «Aynan!» ikkita javobda bir xil matn bilan — ikkalasi teng (12-Modul 7-dars naqshi).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun narx qo'yasiz va mashq to'lovni ulaysiz.** (46)
- Mentor: 3-darsda Backend'ingiz to'lov xabarini qabul qildi — bugun undan keyin mahsulotingizda bitta pullik qulaylik ochiladigan bo'ladi. Narxni siz qo'yasiz, kodni agent yozadi.
- Chap — «Dars oxirida» + kulrang yorliq (App.jsx osti so'zma-so'z — P-015): «xarajat, raqobat, qiymat → narx va to'lov taklifi ekrani»; ostida vizual bir marta o'zi yuradi (DE-200): narx varag'i — to'rt qator nomlari bilan, sonsiz (sonlar — 2-ekran kashfiyoti) →
  telefon: «E'lon berish» → to'lov ekrani (narx qatori «? so'm») → brauzer «Mashq to'lov» → yana ilova. Yo'l chizig'i chapdan o'ngga chiziladi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Narxga bir necha tomondan qarashni bilib olasiz · `narx varag'i`
  - 02 · O'z mahsulotingiz narxini asoslab yozasiz · `narx`
  - 03 · Pullik qulaylik bosilganda to'lov ekrani chiqadi · `Amaliyot 1`
  - 04 · Mashq to'lovdan keyin qulaylik ochilishini tekshirasiz · `Amaliyot 2`
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m13-dars-04-start` · namuna `m13-dars-04-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: 3-darsdagi Amaliyot 1 va 2 (webhook, mashq sahifasi) tugamagan o'quvchi bugun avval o'shani tugatadi: bu darsning Amaliyot 2 si 3-darsdagi sahifaga tayanadi; ulgurmasa A2 uyga qoladi — yakun shuni aytadi.
  Modul boshidagi gapni eslating: bu modulda hech kim haqiqiy pul to'lamaydi — to'lovlar test rejimda, narxlar taxmin.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «narx» 1-darsdan, «mashq to'lov» 3-darsdan; «to'lov taklifi ekrani» faqat App.jsx yorlig'ida (so'zma-so'z, P-015 — TAYANCHGA SAVOL 19). 03 qatori «to'lov ekrani» — oddiy so'z, atama 4-ekranda tug'iladi. Reja 2-ekran sonlarini (15 000, 83 000) ochmaydi.

## 2 · Narx varag'i  ← QTushuncha (markaziy; ketma-ket, 3 qadam; P-055)
- Eyebrow: Tushuncha · narx
- Sarlavha: **Mentor Pro narxini nimaga qarab qo'ydi?** (39)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval javobingizni belgilang, keyin narx varag'ini qatorma-qator oching.
  - 1/3: Bepul Backend uxlaydi, to'lov xabari esa kechikmasin — Backend kartasidagi «uxlaydi» belgisini bosing.
  - 2/3: Tashkilotchi o'yinni bugun nima bilan yig'ishini ko'ring — «Bugun qanday?» ni bosing.
  - 3/3: Pro tashkilotchiga nima berishini ko'ring — «Har hafta takrorlansin» belgisini bosing.
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Mentor 1-darsdagi 10 000 ni nima qiladi?** · Kamaytiradi · O'zgartirmaydi · Oshiradi
  — tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi.
- Vizual (≤ 3 blok: sahna · varaq · harakat tugmasi): chapda telefon yoki xizmat kartalari (qadamga qarab) · o'ngda **«Narx varag'i»** — to'rt qator, nomlari «?», qiymatlari bo'sh · varaq ostida hisob qatori bo'sh.
- **Harakat → Vizual o'zgarish** (qadamlar tartibda, bittasi halqada; N/3):
  1. **Xarajat** — chapda to'rt xizmat kartasi: Backend (Render) · Database (Neon) · lending (Netlify) · o'rnatish fayli — har biri «0 so'm · bepul reja»; Backend kartasida kulrang belgi «uxlaydi» halqada.
     Bosilganda Backend kartasi ag'dariladi: «Bepul: 15 daqiqa so'rovsiz qolsa uxlaydi» → «Uxlamaydigan: oyiga 7 dollar · taxminan 83 000 so'm» (ostida kichik kulrang «render.com · 7-oktabr kursi»); karta ostida kulrang qator:
     «Bu kursda Backend bepul qoladi — 83 000 faqat narx hisobi uchun.» (64)
     Son kartadan varaqning 1-qatoriga uchadi: **Xarajat · bugun 0 so'm · uxlamasa — oyiga taxminan 83 000 so'm**. Varaq ostida hisob qatori chiziladi: «Agar 6 tashkilotchining hammasi olsa: 6 × 10 000 = 60 000 so'm» — qizil, yonida muhr «Backend xarajatini qoplamaydi».
     - Joriy qator: Mahsulotni ushlab turish uchun sarflanadigan pul xarajat deyiladi. Mentor misolida bugun u 0 so'm. (98)
  2. **Raqobat** — chapda telefon: Telegram guruhi «Mahalla futbol guruhi»; tashkilotchi pufagi (olam ichidagi matn, T-008): «Shanba, 18:00, Mahalla maydoni — kim keladi?»; tugma «Bugun qanday?» halqada.
     Bosilganda pufak ostida o'yinchilar javoblari navbat bilan kiradi (uchta qisqa pufak: «Men», «Men ham», «Kelaman» — olam ichidagi matn), guruh sarlavhasi yonida kulrang yorliq «bepul»; varaqning 2-qatoriga: **Raqobat · Telegram guruhi — bepul**.
     - Joriy qator: Odam bugun shu ishni nima bilan qilishi raqobat deyiladi. Mentor misolida — bepul Telegram guruhi. (98)
     - Izoh-qator (`QIzoh`): Mentor misolida guruh bepul qoladi — Pro faqat guruhda yo'q ishga pul so'raydi. (79)
  3. **Qiymat** — chapda telefon «Maydon Jamoa»: «E'lon berish» ekrani — «Shanba · 18:00 · Mahalla maydoni · 10 kishi»; belgi «Har hafta takrorlansin» halqada; ramka ustida yorliq «Pro bilan — Mentorning rejasi».
     Bosilganda belgi yonadi, «O'yinlar» ro'yxatida «Shanba, 18:00 · Mahalla maydoni · 0 / 10» va ostida kulrang «keyingi hafta» bilan ikkinchi karta o'zi kirib keladi (tashkilotchi e'lonni qayta yozmaydi); varaqning 3-qatoriga: **Qiymat · har haftalik e'lon — o'zi** (F-1007-460: «odam chaqirish»ni «Doimiy o'yin» qilmaydi).
     - Joriy qator: Mahsulot odamga nima berishi qiymat deyiladi. Mentor misolida — tashkilotchining har haftalik ishi. (99)
  4. **Narx** (3/3 dan keyin o'zi, ~1 s): varaqning 4-qatori: **Narx · 30 kun — 15 000 so'm** (yorliq «Mentorning taxmini»); hisob qatori almashadi: «60 000 so'm» o'chadi → «Agar 6 tashkilotchining hammasi olsa: 6 × 15 000 = 90 000 so'm» — yashil, muhr «Backend xarajatini zo'rg'a qoplaydi»; telefondagi to'lov ekrani qoralamasida «?» o'rniga «15 000» uchib tushadi.
- Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: oshirdi, 10 000 dan 15 000 ga».
- Xulosa: Uch qator narxni formula bilan chiqarmaydi: Mentor ularga qarab 15 000 ni yangi taxmin qildi. (93)
- `QIzoh` (qutining oxirgi kichik qatori): Hisobda faqat taxminiy Backend xarajati: hammasi olsa ham, u zo'rg'a qoplanadi. (79)
- Tugadi (199): harakat paneli yopiladi; narx varag'i (to'rt qator + hisob qatori + muhr) butun enga, fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Qatorni oching (N/3) → Davom etish
- O'qituvchi eslatmasi: Render'ning pullik xizmati — narx hisobi uchun; hech kim pullik xizmatga o'tmaydi (WH-q1 A). «Hammasi olsa ham» — eng yaxshi holat: hamma tashkilotchi Pro olishi ma'lum emas. Uch qator — formula emas: raqobat va qiymat sonni hisoblamaydi, qarorga ta'sir qiladi; hisobda faqat taxminiy pullik Backend bor (komissiya, boshqa xizmatlar yo'q) — F-1007-462. Narx keyingi darslarda real odamlar bilan tekshiriladi — o'quvchiga buni va'da qilmang (T-038).
  Sinfga savol: «Telegram guruhi bepul bo'lsa, tashkilotchi nega pul to'laydi?» — mumkin javob: guruh har hafta e'lonni o'zi yozmaydi, Pro esa yozadi. Model nomi (2-dars — bepul asos va pullik qo'shimcha) shu yerda eslatilishi mumkin.
- ✎ Bitta g'oya (P-008): narxga uch tomondan qarash → narx — taxmin. Uch atama har biri o'z qadamidan keyin (T-011). Holat o'quvchi bosgan qadamlardan chiziladi (P-046). Hisob faqat maketda (T-035); matnda — so'z bilan. Bashorat — bitta o'lchovning uch darajasi (S-015).
  «6 × 10 000» qatori — tayanch 1.4 «xarajatga qarab ko'tarildi» ning hisobi (TAYANCHGA SAVOL 5). Telegram pufaklari — olam ichidagi matn, namuna (TAYANCHGA SAVOL 4).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · narx varag'i (savol ustida yorliq yo'q — SABOQ 6)
- Savol ustida kichik kulrang qator: Kitob almashish ilovasi · mashq misoli
- Savol: **«Kitobni hozir sinf chatida tekin so'rashadi.» Bu gap qaysi qatorga yoziladi?** (11 so'z)
  - A — Xarajat: ilovani ushlab turish uchun pul (40)
  - ✔ B — Raqobat: odamlar bugun nima ishlatadi (37)
  - C — Qiymat: ilova odamga nima beradi (32)
  - D — Narx: odam to'laydigan pul miqdori (34)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («Qator: …»); to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Odamlar bu ishni bugun tekin chatda qiladi — bu raqobat. (56)
- Xato izohlari (≤60):
  - A: Xarajat — ilova egasining puli. Gapda kim nima qilyapti? (56)
  - C: Qiymat — ilova nima berishi. Bu gapda ilova bormi? (50)
  - D: Narx — ilova so'raydigan pul. Gap kimning ishi haqida? (54)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin): kitob ilovasining narx varag'i — «Raqobat · sinf chati — tekin» qatori accent bilan yonadi, qolgan uch qator kulrang.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Row Finder — birinchi urinishda to'g'ri.
- Izoh (MD): savol yangi holat — slayddan ko'chirib bo'lmaydi (§106); savoldagi «tekin» so'zi variantlarda yo'q (S-019). Distraktorlar uch turkumdan (12-Modul 9.44 f): A — ilova egasining puli · C — ilovaning o'zi beradigan narsa · D — «tekin»ni narx deb o'qish (S-004: har biri darsning o'z qatori, yolg'on fakt emas).

## 4 · To'lov taklifi ekrani  ← QTushuncha (ketma-ket, 3 qadam; P-055)
- Eyebrow: Tushuncha · pullik qulaylik
- Sarlavha: **Pullik qulaylik bosilganda nima ochiladi?** (41)
- Mentor (bosqichga qarab, bitta gap):
  - bashoratgacha: Avval javobingizni belgilang, keyin Pro'si yo'q tashkilotchi bo'lib yo'lni bosib chiqing.
  - 1/3: Pro'si yo'q tashkilotchi pullik qulaylikni bosadi — yonib turgan belgini bosing.
  - 2/3: Endi to'lov taklifi ekranidagi «To'lovga o'tish» ni bosing.
  - 3/3: Mashq sahifasida «To'lash (mashq)» ni bosing va ilovada nima o'zgarishini kuzating.
- Bashorat (ballsiz, 181; S-015 — bitta o'lchov, o'sish tartibida): **Ekranda Pro haqida nimalar turadi?** · Faqat «To'lovga o'tish» tugmasi · Narx va «To'lovga o'tish» · Nima ochilishi, narx va tugma — tanlangach yopilmaydi.
- Vizual (≤ 3 blok): chapda **telefon** («Maydon Jamoa», «E'lon berish», Pro yo'q) · o'ngda **Backend tuguni** (mini-jadval `tolovlar` — oxirgi qator 3-darsdan kulrang; qator `pro_gacha` — bo'sh) · ostida harakat tugmasi. Telefon va Backend orasida ochiq chiziq — konvert yo'li.
- **Harakat → Vizual o'zgarish** (qadamlar tartibda, bittasi halqada; N/3):
  1. Telefonda belgi «Har hafta takrorlansin» halqada. Bosilganda pastdan to'lov taklifi ekrani sirg'alib chiqadi (tayanch 1.4 so'zma-so'z): **«Doimiy o'yin — Pro'da»** · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · **«30 kun — 15 000 so'm»** (yonida kichik kulrang «Mentorning taxmini») · tugma **«To'lovga o'tish»** · pastda kulrang **«Test rejim: pul yechilmaydi»**.
     Telefon yonida uchta kichik yorliq navbat bilan o'z qismiga chiziq tortadi: «nima ochiladi» · «narx» · «tugma»; to'rtinchisi kulrang: «test rejim qatori».
     - Joriy qator: Pullik qulaylik bosilganda chiqadigan bu ekran to'lov taklifi ekrani deyiladi. (78)
  2. «To'lovga o'tish» halqada. Bosilganda telefondan Backend'ga konvert uchadi (yorliq «yangi to'lov raqami»); Backend'dan javob konverti qaytadi (yorliq `m-7f3a…`); telefon brauzerga almashadi: manzil `…/tolov-mashq?raqam=m-7f3a…` ·
     sahifa «Mashq to'lov» · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 15 000 so'm» · «To'lash (mashq)» · «Rad etish (mashq)».
     - Joriy qator: Mentor ilovasi do'kondan tarqatilmaydi; bu kursda mashq to'lov brauzerda ochiladi. (82)
  3. «To'lash (mashq)» halqada. Bosilganda sahifadan Backend'ga konvert uchadi (yorliq «to'lov xabari»); Backend ichida `tolovlar` ga qator kiradi «m-7f3a… · tolandi» (yashil), qator `pro_gacha` bo'sh → «+30 kun» (yashil); sahifada «To'lov o'tdi (mashq) — ilovaga qayting.»;
     telefon ilovaga qaytadi, ilovadan Backend'ga konvert `GET /men`, javob konverti «Pro» → «E'lon berish» ekranida belgi ostida kulrang qator «Pro: 6-noyabrgacha»; belgi qayta bosilganda endi to'lov ekrani ochilmaydi — belgi yonadi.
     - Joriy qator: Pro'ni Backend to'lov xabari kelgach yoqadi; ilova buni Backend'dan qayta so'rab biladi. (88)
- Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: nima ochilishi, narx va tugma».
- Xulosa: Bu misolda karta ilovaga ham, Backend'ga ham kirmaydi: Pro'ni to'lov xabaridan keyin Backend yoqadi. (100)
- Tugadi (199): harakat paneli yopiladi; sahna butun enga: telefon (Pro qatori bilan) · Backend (`tolovlar`, `pro_gacha`) · uch konvert yo'li kulrang izda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval belgilang → Yo'lni bosib chiqing (N/3) → Davom etish
- O'qituvchi eslatmasi: Do'kon qoidalari (tayanch 6): Google Play'ning to'lov qoidasi — Play'dan tarqatiladigan ilovalar uchun, Apple 3.1.1 — App Store ilovalari uchun. Mentor ilovasi Android'da APK, iPhone'da brauzer ko'rinishi — shuning uchun to'lov brauzerdagi sahifada. Ilova keyinchalik do'konga chiqsa, do'konning ichki xarid qoidasi tegishi mumkin. ⛔ «qur» oldidan ikkala qoida sahifasi qayta ochiladi, sana bilan (F-1007-462).
  To'lov raqamini nega Backend beradi: 3-darsdagi sahifa ochiq manzilda edi — raqam Backend'dan kelsa, begona yoki o'ylab topilgan raqam bilan Pro yoqib bo'lmaydi (tayanch 9.7). Raqam tasodifiy (`m-` + 12 belgi): manzilda turadi, ketma-ket bo'lsa keyingisini taxmin qilish oson bo'lardi. Haqiqiy xizmatlarda ham to'lov avval mahsulot tomonida yaratiladi (Payme hujjati — Manbalar 4).
  «Haqiqiy xizmatda sahifa va xabar boshqa kompaniya serveridan keladi» — 3-darsda aytilgan; bugun qaytarilmaydi.
- ✎ Uch qadam — bitta yo'l (P-008): ekran → to'lov sahifasi → Pro. Atama «to'lov taklifi ekrani» 1-qadamdan keyin (T-011). Konvert Backend'dan ilovaga to'g'ridan-to'g'ri «Pro» olib kelmaydi — ilova o'zi so'raydi (tayanch 1.3 sxemasining 5-qatori). «Rad etish (mashq)» bu ekranda bosilmaydi (tayanch 1.4 A2 tekshiruvi — faqat to'lash).

## 5 · O'z narxingiz  ← QMustaqil (USTAXONA — ketma-ket karta, 5 karta; E 43, E 53)
- Eyebrow: Mustaqil ish
- Sarlavha: **Mahsulotingiz narxi nimaga qarab chiqadi?** (41)
- Mentor: Kartalarni bittadan to'ldiring — xarajatdan boshlang, ekran matnini oxirida yozasiz.
- Kirish qatori (kulrang, tepada, bir marta): Xarajat — oyiga, xizmat sahifasidan, sanasi bilan; qolgani — sizning taxminingiz. (81)
- Qadamlar 1/5 (`QQadamlar` tugmalari «Xarajat · Raqobat · Qiymat · Narx · Ekran»); bitta ustun; bir vaqtda bitta katta karta; yozilgani yuqoridagi ixcham qatorga uchadi (SABOQ 29, E 53). Yorliq input ichida (E 43): doimiy raqam belgisi + qisqa savol placeholder'da; «masalan» namunalari — «Yordam» ichida.
  Chapda telefon — o'quvchining to'lov taklifi ekrani, kartalar to'lgani sari jonli yoziladi (P-046): sarlavha · matn · narx qatori «{davrKun} kun — {narx} so'm» · tugma · pastda o'zgarmas kulrang «Test rejim: pul yechilmaydi» (tahrirlanmaydi — TAQIQLAR 1).
  1. **Xarajat** — placeholder «Mahsulotni ushlab turishga oyiga qancha ketadi?»; uch tugma: «Bugun — 0 so'm (bepul rejalar)» · «O'zim yozaman» → son maydoni (so'm) + manba maydoni (placeholder «Qayerdan bildingiz? Sahifa va sana») · uchinchisi kulrang, kichik: «Mentor misoli: Render — taxminan 83 000 so'm» (F-1007-462: Mentor soni sukut yoki birinchi tanlov emas).
     Uchinchi tugma ostida kichik kulrang: «Render, oyiga 7 dollar · 7-oktabr kursi».
  2. **Raqobat** — placeholder «Odamlar bu ishni hozir nima bilan qiladi?»
  3. **Qiymat** — placeholder «Pullik qulaylik odamning qaysi ishini oladi?» (`pm-m11d2-model.nima` bo'lsa — oldindan yozilgan, tahrirlanadi)
  4. **Narx** — placeholder «Necha so'm?»; muddat: «30 kun» (sukut) · «Boshqa muddat» → son maydoni (kun). Karta ostida ikki kulrang qator:
     - «1-darsdagi taxminingiz: {narxTaxmin} so'm» (`pm-m11d1-birlik`, `tur: 'real'`; yo'q yoki `tur: 'mashq'` bo'lsa — qator ko'rinmaydi);
     - hisob qatori (maketdagi kabi, mono): «Hammasi to'lasa ({manba}): {soni} × {narx} = {jami} so'm · xarajat: {oylik} so'm» — {manba}: «Neon soni» (`pm-m11d2-model.soniManba: 'database'`) yoki «taxmin» (`'taxmin'`) → muhr «yozgan xarajatingizni qoplaydi» (yashil) · «qoplamaydi» (kulrang, baho emas) · `soni` yo'q yoki `oylik` 0 bo'lsa — muhrsiz qator «Xarajat bilan solishtirish uchun to'lovchilar soni kerak» yoki «Bugungi xarajat — 0 so'm».
  5. **Ekran** — uch maydon: placeholder «Sarlavha: nima ochiladi?» · «Bir gap: u nima qiladi?» · «Tugma» (oldindan «To'lovga o'tish»). Ostida o'zgarmas qator: «Test rejim: pul yechilmaydi».
  «Qator tayyor» → karta ixcham qatorga uchadi («1 · Xarajat · 0 so'm · bepul rejalar»), keyingi karta kirib keladi. 5/5 dan keyin «Saqlash».
- Tekshiruv (`QXato`, ≤60; bo'sh maydon bloklaydi, qolgani — maslahat, qaror o'quvchida — S-008):
  - xato · xarajat tanlanmagan: Xarajatni tanlang yoki son bilan yozing. (40)
  - xato · «O'zim yozaman», manba bo'sh: Bu son qayerdan — sahifa va sanasini yozing. (44)
  - xato · raqobat bo'sh: Odamlar hozir nima bilan qiladi — shuni yozing. (47)
  - xato · qiymat bo'sh: Qulaylik qaysi ishni oladi — shuni yozing. (42)
  - xato · narx son emas yoki 0: Narxni so'mda, son bilan yozing. (32)
  - xato · ekran sarlavhasi bo'sh: Sarlavhaga nima ochilishini yozing. (35)
  - maslahat · hammasi to'lasa ham xarajat qoplanmasa: Hammasi to'lasa ham xarajat qoplanmaydi. Qayta ko'rasizmi? (58)
  - maslahat · ekran matnida «tez orada», «yaqinda», «chegirma», «faqat bugun»: To'lov ekranida faqat hozir ishlaydigan narsa yoziladi. (55)
  - maslahat · ekran matnida «karta»: To'lov ekranida karta so'ralmaydi. (34)
- Yordam (sukutda yopiq; Mentor misoli): Xarajat — bugun 0 so'm; uxlamaydigan Backend bilan taxminan 83 000 so'm (Render, 7-oktabr kursi) · Raqobat — Telegram guruhi, bepul · Qiymat — «Doimiy o'yin» har haftalik e'lonni o'zi qiladi · Narx — 30 kun, 15 000 so'm (Mentorning taxmini) ·
  Ekran — «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «To'lovga o'tish». Sizning sonlaringiz boshqa bo'ladi.
- **Harakat → Vizual o'zgarish:** «Qator tayyor» → karta ixcham qatorga uchadi, telefondagi to'lov ekranida mos qism yoziladi (narx, sarlavha, matn, tugma), 4-kartada hisob qatori va muhr chiziladi; «Saqlash» → forma yopiladi, narx varag'i va telefon butun enga (199): to'rt qator (har biri yonida ✎) va o'quvchining to'lov ekrani.
- Saqlanadi: `pm-m11d4-narx` — `{ xarajat: { oylik, manba }, raqobat, qiymat, narx, davrKun, ekran: { sarlavha, matn, tugma }, ishlaydi: null, savedAt }` (A-bo'lim 12; `ishlaydi` — A2 da).
- Xulosa: Narxingiz saqlandi: to'rt qatori va to'lov ekrani matni bilan. Hozircha u — taxmin. (83)
- Tugma (pastki): Kartalarni to'ldiring (N/5) → Davom etish
- Nishon: Price Reasoned — «Saqlash» bosilganda (ish bajarilgan — P-048; tekin bonus — bitta).
- Mentor rejimida (proyektorda): forma o'rnida Mentor narx varag'i (`NARX.varaq`) va Mentorning to'lov ekrani to'ldirilgan holda.
- O'qituvchi eslatmasi: Narx — o'quvchining taxmini; «arzon» yoki «qimmat» deb baholanmaydi. Mahsulotida hali pullik qulaylik yo'q o'quvchi 2-darsdagi «nima uchun to'laydi» javobidan oladi (Qiymat kartasi). «Hammasi to'lasa» — eng yaxshi holat, va'da emas.
  Hech kim pullik xizmatga o'tmaydi va hech kimdan pul so'ramaydi — xarajat qatori faqat hisob uchun.
- ✎ PM-018 / sinf 4: Mentor narx varag'i — namuna, umumiy qolip emas; o'quvchining sonlari o'ziniki. Ekranning uch qismi — tayanch 1.4 tarkibi; «Test rejim» qatori o'quvchi tahrirlay olmaydigan joy (TAQIQLAR 1). Muhr «qoplamaydi» — baho emas, qizil ham emas.

## A1 · Amaliyot 1 — Pro holati va to'lov taklifi ekrani  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈22 daq; `screens[6]`; tayanch 1.4 «Bloklar»)
- Eyebrow: Amaliyot 1 · Pro holati va to'lov taklifi ekrani
- Sarlavha: **Pullik qulaylik bosilsa, to'lov taklifi ekrani chiqsin.** (55)
- Mentor: Talab tayyor — qavslarga pullik qulayligingizni va uning joyini yozasiz; «1 · Ochish»dan boshlang.
- Model (tayanch 4, 12-Modul 9.36): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab). 5-qadam yo'q.
  Talab zinapoyasi A1: tayyor talab + 2 joy o'quvchidan (`{pullik qulaylik}`, `{qulaylik joyi}`) + 5 joy 5-ekrandan oldindan (`{sarlavha}`, `{matn}`, `{davr}`, `{narx}`, `{tugma}`).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.
     Mahsulotingizda qaysi qulaylik pullik bo'lishini tanlang — 2-darsda «nima uchun to'laydi» deb yozgansiz (pastdagi qavsga oldindan qo'yilgan bo'lsa — tekshiring). Mentor misolida — «Doimiy o'yin».
     Modelingiz reklama, B2B (boshqa biznes to'laydi) yoki tranzaksiya (har to'lovdan ulush) bo'lsa — bu amaliyotni alohida mashq ekranida qiling: menyuda ko'rinmaydigan, faqat siz ochadigan ekranda bitta qulaylik va to'lov taklifi ekrani; mahsulotingizning asosiy ekranlari va modeli o'zgarmaydi.
     Trekka qarab bir gap: mobil trek — qulaylik ilovada · web-trek — qulaylik saytda (talab bir xil).
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: Backend — foydalanuvchilar jadvali, yangi `GET /men` yo'li va {pullik qulaylik} ishlaydigan yo'l; ilova — {qulaylik joyi} va yangi to'lov taklifi ekrani.
     > Nima qilsin: 1) Foydalanuvchilar jadvaliga `pro_gacha` ustunini qo'sh: Pro muddati — sana yoki bo'sh; mavjud foydalanuvchilarda bo'sh qolsin. `GET /men` (token bilan) kirgan foydalanuvchiga `pro` (`pro_gacha` hozirdan keyin bo'lsa — rost) va `proGacha` ni qaytarsin; tokensiz — `401`.
     > 2) {pullik qulaylik} faqat Pro'da ishlasin. Backend ham tekshirsin: Pro bo'lmasa — `403`, hech narsa o'zgarmasin.
     > 3) Pro bo'lmasa, qulaylik bosilganda to'lov taklifi ekrani ochilsin: sarlavha «{sarlavha}», matn «{matn}», narx «{davr} kun — {narx} so'm», tugma «{tugma}», eng pastda kulrang «Test rejim: pul yechilmaydi». Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin. Ekrandan orqaga qaytsa bo'lsin. «{tugma}» hozircha hech narsa qilmasin.
     > 4) Pro bo'lsa, qulaylik yonida kulrang qator: «Pro: {sana}gacha». Pro holatini ilova `GET /men` dan olsin.
     > Nima buzilmasin: qolgan ekranlar va yo'llar avvalgidek ishlasin; mavjud yozuvlar o'zgarmasin. Pro muddati tugagach Pro o'zi to'xtasin (`GET /men` da `pro` yolg'on) — hech qanday avtomatik to'lov yo'q. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: `{pullik qulaylik}` — `pm-m11d2-model.nima` dan oldindan (yo'q bo'lsa — bo'sh), kulrang «masalan: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi» · `{qulaylik joyi}` — bo'sh, kulrang «masalan: «E'lon berish» ekranidagi belgi» (model boshqa bo'lsa — «alohida mashq ekrani, menyuda yo'q») ·
     `{sarlavha}`, `{matn}`, `{davr}`, `{narx}`, `{tugma}` — `pm-m11d4-narx` dan oldindan (5-ekran saqlanmagan bo'lsa — bo'sh, kulrang Mentor misoli).
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq talab, mobil trek):
     > Qayerda: `backend/` — `oyinchilar` jadvali, yangi `GET /men`, `oyinlar` jadvali, `POST /oyinlar` va `GET /oyinlar`; `mobil/` — «E'lon berish» ekrani va yangi to'lov taklifi ekrani.
     > Nima qilsin: 1) `oyinchilar` ga `pro_gacha` (sana yoki bo'sh; mavjudlarida bo'sh). `GET /men` (token bilan) — `pro` (`pro_gacha` hozirdan keyin bo'lsa — rost) va `proGacha`; tokensiz — `401`.
     > 2) `oyinlar` ga `doimiy` (rost yoki yolg'on, sukut — yolg'on). «E'lon berish» ekranida belgi «Har hafta takrorlansin». `POST /oyinlar` `doimiy: true` ni faqat Pro'dagi tashkilotchidan qabul qilsin, aks holda `403` va o'yin yaratilmasin.
     > 3) `GET /oyinlar` so'ralganda: `doimiy` o'yinning vaqti o'tgan bo'lsa (Toshkent vaqti) — bir haftadan keyingi kunga, xuddi shu soat, maydon, kerakli odamlar soni va tashkilotchi bilan yangi o'yin yaratilsin; `doimiy` belgisi yangisiga o'tsin, eskisida o'chsin — bitta o'yindan keyingisi bir marta yaratiladi. Vaqtga bog'langan ish (taymer) qo'shma: Backend uxlashi mumkin.
     > 4) Pro bo'lmasa, belgi bosilganda to'lov taklifi ekrani: sarlavha «Doimiy o'yin — Pro'da», matn «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.», narx «30 kun — 15 000 so'm», tugma «To'lovga o'tish», eng pastda kulrang «Test rejim: pul yechilmaydi». Karta maydoni bo'lmasin. Orqaga qaytsa — belgi o'chiq qolsin. «To'lovga o'tish» hozircha hech narsa qilmasin.
     > 5) Pro bo'lsa, belgi ostida kulrang qator: «Pro: {sana}gacha». Pro holatini ilova `GET /men` dan olsin — ilova ochilganda va «E'lon berish» ekrani ochilganda.
     > Nima buzilmasin: e'lon berish, qo'shilish, tasdiq, navbat, real vaqt va eslatmalar avvalgidek ishlasin; mavjud o'yinlar o'zgarmasin. Pro muddati tugagach Pro o'zi to'xtasin (`GET /men` da `pro` yolg'on) — hech qanday avtomatik to'lov yo'q. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordamning oxirgi qatori: Web-trekda — o'sha talab saytingizda: «ilova» o'rnida sayt, Pro holati sahifa ochilganda `GET /men` dan.
  3. **Ishga tushirish** — agent tugatgach: `git diff` — o'zgarish agent aytgan fayllardami; `git status` — `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan → `git commit -m "4-dars: Pro holati va to'lov taklifi ekrani"` → `git push`.
     Render'da yangi versiya tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching; web-trekda `npm run dev`.
     Kutayotganda agentga (SABOQ 52; «Nusxalash» bilan):
     > Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: Backend Pro'ni tekshiradigan qator va ilova to'lov taklifi ekranini ochadigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     (1) **Pro'siz:** pullik qulaylikni bosing — to'lov taklifi ekrani chiqishi kerak: so'zlar narx varag'ingizdagidek, eng pastda «Test rejim: pul yechilmaydi», karta maydoni yo'q. Orqaga qayting. «{tugma}» hozircha hech narsa qilmaydi — bu kutilgan holat.
     (2) **Hisobingiz:** Neon SQL Editor'da `SELECT id, pro_gacha FROM oyinchilar WHERE login = '{loginingiz}';` → «Run»: `pro_gacha` bo'sh. `id` ni yozib oling — bu hisob raqamingiz (jadval va ustun nomi — mahsulotingizdagidek).
     (3) **Pro bilan (faqat tekshiruv uchun):** `UPDATE oyinchilar SET pro_gacha = now() + interval '1 day' WHERE id = {hisob raqamingiz};` → ilovani qayta oching: qulaylik ochiladi, yonida «Pro: {sana}gacha».
         Mentor misolida: «Har hafta takrorlansin» bilan tekshiruv o'yini e'lon qilinadi (maydon — «tekshiruv»); `SELECT id, kun, soat FROM oyinlar WHERE maydon = 'tekshiruv';` → `UPDATE oyinlar SET kun = kun - 7 WHERE id = {o'yin raqami};` —
         ro'yxatni yangilang: xuddi shu soatda, bir haftadan keyingi kunga yangi o'yin chiqishi kerak; yana yangilang — ikkinchi nusxa chiqmasligi kerak.
     (4) **Tozalash:** `UPDATE oyinchilar SET pro_gacha = NULL WHERE id = {hisob raqamingiz};` — Amaliyot 2 Pro'siz hisobdan boshlanadi. Mentor misolida tekshiruv o'yinlari: `DELETE FROM oyinlar WHERE id IN ({o'yin raqamlari});` — faqat tekshiruv o'yinlari, ularga hech kim qo'shilmagan.
     Ustun nomlari boshqacha bo'lsa — agentga: «Neon SQL Editor uchun shu ishni qiladigan SQL yoz, o'zing ishga tushirma: {ish}. Jadvallarni o'zgartirma.» — SQL'ni o'qib, «Run».
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok; bir marta o'zi yuradi):
  - telefon: «E'lon berish» → belgi «Har hafta takrorlansin» → to'lov taklifi ekrani (tayanch 1.4 so'zma-so'z, pastda «Test rejim: pul yechilmaydi») → (Pro bilan) belgi yonadi, ostida «Pro: 8-oktabrgacha» (tekshiruvdagi bir kunlik Pro — namuna sana)
  - karta «Neon · SQL Editor»: `SELECT id, pro_gacha …` → `7 · bo'sh` · `UPDATE … kun - 7` → «O'yinlar»: «Shanba, 18:00 · tekshiruv · 0 / 10» va keyingi haftaning kartasi
  - fayl kartasi: `backend/src/…` (`GET /men`, `oyinlar` — `doimiy`) · `mobil/…` («E'lon berish», to'lov taklifi ekrani)
- Hammasi bajarilgach (yashil): Pullik qulaylik Pro'ni so'raydi; Pro'siz to'lov taklifi ekrani chiqadi. (71)
- Qator (`QIzoh`, natija ostida): «To'lovga o'tish» hali ulanmagan — uni keyingi amaliyotda ulaysiz. (66)
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-04-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` ga o'z qiymatlaringizni yozasiz (`TOLOV_KALITI` ham).
- Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadamning (3) va (4) uyda; 3-qadamdan keyin «Davom etish» ochiladi — Amaliyot 2 ga o'ting (uning (1) qadami Pro'siz hisob bilan baribir ishlaydi). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi (12-Modul 9.36 h).
- Nishon (bonus): Pro Switch — 4-qadam «Bajardim»ida.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: (3) dagi Pro — tekshiruv uchun, Neon orqali, faqat o'z hisobiga va (4) da o'chiriladi; Pro to'lov yo'li bilan Amaliyot 2 da yoqiladi. Tekshiruv o'yini haqiqiy foydalanuvchilar ro'yxatida bir necha daqiqa ko'rinishi mumkin — maydon nomi «tekshiruv», tekshiruvdan keyin o'chiriladi.
  `DELETE` faqat `WHERE id IN (…)` bilan, agent aytgan yoki `SELECT` ko'rsatgan raqamlar bo'yicha. Pro muddati tugaganda «Doimiy o'yin» nima qilishi bu blokda yozilmaydi — 5-darsda qo'shiladi (tayanch 1.5 A1, 9.26); kurs davomida Pro 30 kun, 5-darsgacha tugamaydi.
  Odatda `GET` yozuv yaratmaydi — keyingi o'yinni `GET /oyinlar` da yaratish Mentor loyihasining sodda yechimi (Backend uxlashi mumkin, taymer ishonchsiz); bir vaqtdagi ikki so'rov ikki o'yin yaratishi mumkin — 12-darsda topiladi (tayanch 1.12, M-q4 A). F-1007-462.
- ✎ Talab zinapoyasi: A1 — tayyor talab + 2 o'quvchi joyi (qaysi qulaylik pullik va qayerda — o'quvchining mahsulot qarori, sinf 13) + 5-ekrandan kelgan matn. «Har hafta takrorlansin» va keyingi o'yin — faqat Mentor Yordamida (tayanch 1.4). Agentning «tayyor» degani — da'vo; o'quvchi to'rt tekshiruvni o'zi qiladi (sinf 10).
  Tekshiruvdagi vaqtincha Pro va «kun − 7» — o'z hisobi va o'z tekshiruv yozuvi, `WHERE id` bilan; tozalash shart (TAYANCHGA SAVOL 14).

## A2 · Amaliyot 2 — to'lov yo'li  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq; `screens[7]`; tayanch 1.4 «Bloklar», 9.7)
- Eyebrow: Amaliyot 2 · to'lov yo'li
- Sarlavha: **Mashq to'lovdan keyin qulaylik ochilsin.** (40)
- Mentor: To'lov raqamini Backend bersin — shunda begona raqam bilan Pro yoqib bo'lmaydi; «1 · Ochish»dan boshlang.
- Talab zinapoyasi A2: tayyor talab + 2 joy o'quvchidan (`{Pro qatori joyi}`, `{hozirgi holat}`) + 3 joy oldindan (`{tugma}`, `{narx}`, `{davr}` — 5-ekrandan). Ikkala trekda bir xil — farq 4-bandda (telefon brauzeri yoki yangi oyna).
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — Amaliyot 1 push qilingan, hisobingizda Pro yo'q. 3-darsdagi mashq to'lov sahifasi va uch tekshiruv (imzo, takror, rad) Backend'ingizda bor bo'lishi kerak.
     (`pm-m11d3-oqim.test` da `true` bo'lmagan tekshiruv bo'lsa — kulrang qator: «3-darsdagi tekshiruv tugamagan: {imzo · takror · rad}. Avval o'shani tugating — bu blok unga tayanadi.»)
     Trekka qarab bir gap: mobil trek — mashq sahifasi telefon brauzerida ochiladi · web-trek — saytingizda yangi oynada ochiladi.
  2. **Prompt** — qavslarni tekshiring va to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: Backend — yangi `POST /tolov/boshlash`, 3-darsdagi mashq to'lov sahifasi va `POST /tolov/webhook`; ilova — to'lov taklifi ekranidagi «{tugma}» va {Pro qatori joyi}; `README.md` dagi «To'lov» bo'limi.
     > Nima qilsin: 1) `POST /tolov/boshlash` (token bilan): taxmin qilib bo'lmaydigan yangi to'lov raqamini yaratsin (`m-` va tasodifiy harf-raqamlar, ketma-ket raqam emas) va uni kirgan foydalanuvchi hamda summa bilan alohida jadvalga yozsin. Narx va muddat Backend'da bitta joyda turadi ({narx} so'm, {davr} kun) — summa shu joydan olinsin. Javob — `{ tolovRaqami, havola }`; havola — mashq to'lov sahifasi shu raqam bilan.
     > 2) Mashq to'lov sahifasi faqat shu raqam bilan ishlasin: raqam yo'q yoki jadvalda bo'lmasa — «To'lov topilmadi.» va tugmalar yo'q. Hisob va summa raqamdan olinsin; sahifadagi to'rt tugma yangi raqam yaratmasin — shu raqam bilan ishlasin. «To'lash (mashq)» javobi kelgach: to'lov o'tgan bo'lsa — «To'lov o'tdi (mashq) — ilovaga qayting.», rad etilgan bo'lsa — «To'lov o'tmadi.»
     > 3) `POST /tolov/webhook` dagi tartib o'zgarmasin: avval imzo, keyin takror, keyin yozuv. Hisob va summa xabardan emas, alohida jadvaldagi shu raqam yozuvidan olinsin; raqam u yerda bo'lmasa yoki xabardagi hisob va summa unga mos kelmasa — `400`, hech narsa yozilmasin. To'lov yangi yozilgan va holati `tolandi` bo'lsa — shu hisobning `pro_gacha` si {davr} kunga uzaysin: Pro bo'lmasa hozirdan, bo'lsa muddat oxiridan. To'lov yozuvi va Pro uzayishi bitta Database ishida bo'lsin: biri bajarilmasa, ikkinchisi ham bajarilmasin. Bitta raqam — bitta natija: shu raqam bilan keyingi xabar (rad etilgandan keyingi «To'lash» ham) takror deb olinsin.
     > 4) Ilovada «{tugma}» bosilganda — `POST /tolov/boshlash`, keyin havolani telefon brauzerida ochsin. Ilovaga qaytganda `GET /men` ni qayta so'rab, {Pro qatori joyi} ni yangilasin.
     > 5) `README.md` dagi «To'lov» bo'limida «Hozircha» qatori o'rniga shuni yoz: {hozirgi holat}
     > Nima buzilmasin: 3-darsdagi uch tekshiruv avvalgidek ishlasin (imzosiz — `401`, ikki marta — bitta qator, rad — «rad» qatori). Karta yoki boshqa to'lov ma'lumoti so'raladigan maydon bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: `{tugma}`, `{narx}`, `{davr}` — `pm-m11d4-narx` dan oldindan · `{Pro qatori joyi}` — bo'sh, kulrang «masalan: «E'lon berish» ekranidagi «Pro: {sana}gacha» qatori» ·
     `{hozirgi holat}` — bo'sh, kulrang «masalan: Hozircha: to'lov tugmasi Backend'dan to'lov raqamini oladi va mashq sahifasini ochadi; mashq to'lovdan keyin Pro uzayadi. Test rejim: pul yechilmaydi.»
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq talab, mobil trek):
     > Qayerda: `backend/` — yangi `POST /tolov/boshlash` va jadval `boshlangan_tolovlar`, `GET /tolov-mashq`, `POST /tolov/webhook`; `mobil/` — to'lov taklifi ekranidagi «To'lovga o'tish» va «E'lon berish» ekranidagi Pro qatori; `README.md` — «To'lov» bo'limi.
     > Nima qilsin: 1) `POST /tolov/boshlash` (token bilan): yangi to'lov raqami — `m-` va tasodifiy 12 ta harf-raqam (ketma-ket emas: raqam manzilda turadi); `boshlangan_tolovlar` ga yozsin — `tolov_raqami` (noyob), `oyinchi_id` (kirgan tashkilotchi), `summa`, `yaratilgan`. Narx va muddat Backend'da bitta joyda: `PRO_NARX = 15000`, `PRO_KUN = 30` — summa va Pro muddati shu joydan. Javob — `{ tolovRaqami, havola }`, havola — `{Backend manzili}/tolov-mashq?raqam={tolovRaqami}`.
     > 2) `GET /tolov-mashq` faqat `raqam` bilan ishlasin: raqam yo'q yoki `boshlangan_tolovlar` da bo'lmasa — «To'lov topilmadi.» va tugmalar yo'q. `oyinchi` va `summa` raqamdan olinsin (manzildagi `oyinchi` va `summa` endi ishlatilmasin); to'rt tugma shu raqam bilan ishlasin. «To'lash (mashq)» javobi kelgach: `200 { ok: true }` — «To'lov o'tdi (mashq) — ilovaga qayting.», rad — «To'lov o'tmadi.»
     > 3) `POST /tolov/webhook`: tartib o'zgarmasin — avval imzo, keyin takror, keyin yozuv. `oyinchi_id` va `summa` xabardan emas, `boshlangan_tolovlar` dagi shu raqam yozuvidan olinsin; raqam u yerda bo'lmasa yoki xabardagi qiymatlar mos kelmasa — `400`, hech narsa yozilmasin. To'lov yangi yozilgan va holati `tolandi` bo'lsa — `oyinchilar.pro_gacha` `PRO_KUN` kunga uzaysin: Pro bo'lmasa hozirdan, bo'lsa muddat oxiridan. To'lov yozuvi va Pro uzayishi bitta Database ishida: biri bajarilmasa, ikkinchisi ham bajarilmasin. Bitta raqam — bitta natija: shu raqam bilan keyingi xabar (rad etilgandan keyingi «To'lash» ham) takror.
     > 4) «To'lovga o'tish» bosilganda — `POST /tolov/boshlash`, keyin `havola` ni telefon brauzerida ochsin. Ilovaga qaytganda `GET /men` ni qayta so'rab, «Pro: {sana}gacha» qatorini va belgini yangilasin.
     > 5) `README.md` «To'lov» bo'limida «Hozircha» qatori o'rniga: Hozircha: «To'lovga o'tish» Backend'dan to'lov raqamini oladi va mashq to'lov sahifasini ochadi; «To'lash (mashq)» dan keyin to'lov xabari Pro'ni 30 kunga uzaytiradi, ilova uni `GET /men` dan o'qiydi. Test rejim: pul yechilmaydi.
     > Nima buzilmasin: 3-darsdagi uch tekshiruv avvalgidek ishlasin (imzosiz — `401`, ikki marta — bitta qator, rad — «rad» qatori). Karta maydoni bo'lmasin; Payme yoki Click nomi va ko'rinishi ishlatilmasin. `TOLOV_KALITI` qiymatini hech qayerga yozma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trek qatori (Yordamda): 4-bandda «telefon brauzerida» o'rniga — «yangi oynada»; saytga qaytganda (oyna yana ochilganda) `GET /men` qayta so'ralsin.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` → `git commit -m "4-dars: to'lov yo'li va Pro"` → `git push`. Render'da yangi versiya tugashini kuting.
     Kutayotganda agentga (SABOQ 52; «Nusxalash» bilan):
     > Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: to'lov raqami yaratiladigan qator, mashq sahifasi raqamni tekshiradigan qator va Pro muddati uzayadigan qator. Pro takror tekshiruvidan keyin uzayadimi — bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — bitta yo'l, o'zingiz:
     (1) Ilovada pullik qulaylikni bosing → to'lov taklifi ekrani → «{tugma}»: telefon brauzerida (web-trekda — yangi oynada) mashq to'lov sahifasi ochilishi kerak — manzilda to'lov raqami, sahifada «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» va narxingiz (narx varag'ingizdagi bilan bir xil).
         Sahifa birinchi ochilishda bir daqiqagacha kechikishi mumkin: bepul Backend uxlab qolgan bo'lsa, uyg'onadi.
     (2) «To'lash (mashq)» → «To'lov o'tdi (mashq) — ilovaga qayting.» → ilovaga qayting: «Pro: {sana}gacha» chiqishi va qulaylik endi to'lov ekranini ochmasligi kerak.
     (3) Neon SQL Editor'da: `SELECT pro_gacha FROM oyinchilar WHERE id = {hisob raqamingiz};` — bugundan {davr} kun keyin; `SELECT tolov_raqami, holat, summa FROM tolovlar ORDER BY yaratilgan DESC LIMIT 1;` — sahifadagi raqam, `tolandi`, narxingiz.
     (4) **Himoya:** brauzerda sahifani raqamsiz va o'ylab topilgan raqam bilan oching — `{Backend manzili}/tolov-mashq` va `…/tolov-mashq?raqam=m-1`: ikkalasida «To'lov topilmadi.» chiqishi kerak.
     Tanlang: **Pro yoqildi** · **Pro yoqilmadi**. «Pro yoqilmadi» bo'lsa — agentga yozuv bilan: «Mashq to'lov: kutganim — Pro yoqiladi, bo'ldi — {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → Render → ilovada «{tugma}» ni qayta bosib (yangi raqam keladi) tekshiring.
     Kichik qator (kulrang, 4-qadam ostida): Bugun bitta yo'l tekshirildi: «To'lash (mashq)» dan keyin Pro. Agent «to'lov ishlaydi» desa — bu hali uning so'zi. (114)
- Tekshiruv kartasi (chapda, 4-qadam ichida): nima bosiladi · nima kutiladi · tugmalar «Pro yoqildi» · «Pro yoqilmadi». Saqlanadi: `pm-m11d4-narx.ishlaydi` — «Pro yoqildi» → `true`, «Pro yoqilmadi» → `false`, tanlanmagan → `null` qoladi (ish fakti; A-bo'lim 12).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok; bir marta o'zi yuradi):
  - telefon: to'lov taklifi ekrani → brauzer `maydon-jamoa-….onrender.com/tolov-mashq?raqam=m-7f3a…` — «Mashq to'lov» · «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 15 000 so'm» (yorliq «Mentorning taxmini») · «To'lash (mashq)» → «To'lov o'tdi (mashq) — ilovaga qayting.» → ilova: «Pro: 6-noyabrgacha»
  - Backend kartasi: `boshlangan_tolovlar` — «m-7f3a… · 7 · 15 000» · `tolovlar` — «m-7f3a… · tolandi · 15 000» · `oyinchilar` — «7 · pro_gacha: 6-noyabr»
  - brauzer, ikkinchi kadr: `…/tolov-mashq` (raqamsiz) — «To'lov topilmadi.»
  - Mashq sahifasi ostida kulrang qator (o'quvchi matni, A-bo'lim 8): Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - «Pro yoqildi» — Mashq to'lovdan keyin Pro yoqildi va qulaylik ochildi. (54)
  - «Pro yoqilmadi» — To'lov yo'li bor — Pro yoqilishini tuzatib, qayta tekshiring. (61)
- Qator (`QIzoh`, yashil ostida, «Pro yoqildi» bo'lsa): Pro o'z hisobingizda 30 kun turadi — bu mashq: hech kim pul to'lamagan. (71)
- Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning ②-bandi; «Davom etish» 2-qadamdan keyin ochiladi (SABOQ E 55). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Test Payment — 4-qadam «Bajardim»ida, «Pro yoqildi» yoki «Pro yoqilmadi» tanlangan bo'lsa (tavsif qilingan ishni aytadi — natijadan qat'i nazar).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: Mashq sahifasi va tugmalari faqat o'quvchining o'z Backend'ini chaqiradi; boshqa odamning Backend'iga yoki haqiqiy to'lov xizmatiga hech narsa yuborilmaydi. Real ishga tushirish gapi — FK 27-modda (14–18 yoshlilar bitimni ota-onaning yozma roziligi bilan tuzadi; lex.uz, Manbalar 6).
  Ilovangizdagi haqiqiy foydalanuvchilar ham to'lov ekranini ko'radi va mashq to'lov bilan Pro yoqishi mumkin (GATE M **M-q3 A** — foydalanuvchi qarori): pul yechilmaydi, ekranda va sahifada shu yozilgan. Bunday Pro — to'lov emas, sotuv deb sanalmaydi (tayanch 1.13: Pro'ni test rejimda yoqqanlar soni yo'q).
  Boshqa tugmalar («Rad etish (mashq)», «Ikki marta yuborish», «Imzosiz yuborish») bilan tekshirish bu blokda yo'q — o'quvchiga keyingi dars va'da qilinmaydi.
  Bitta raqam — bitta natija: rad etilgandan keyin qayta to'lash — ilovada yana «{tugma}» → yangi raqam (tayanch 9.50).
- ✎ Talab zinapoyasi: A2 — tayyor talab + 2 o'quvchi joyi (Pro qayerda ko'rinishi va README'dagi halol qator) + 5-ekrandan kelgan son. Raqamni Backend berishi — tayanch 9.7 (MAJBURIY); jadval nomi va sahifa manzilidagi `raqam` — TAYANCHGA SAVOL 7.
  Kechikkan javob holati talabda yo'q — agentning tanloviga qoladi (12-Modul 9.35 e). Tekshiruv natijasini o'quvchi qo'yadi (sinf 10); agentning «ishlaydi» degani yozilmaydi.

## 8 · Yakuniy savol  ← QTest (✔ D, `correctIdx 3`; ikki blok birga: Pro holati — Amaliyot 1, to'lov yo'li — Amaliyot 2)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Tashkilotchi mashq to'lovdan keyin ilovaga qaytdi. Pro yoqilganini ilova qayerdan biladi?** (11 so'z)
  - A — Sahifadagi «To'lov o'tdi» yozuvidan (35)
  - B — Telefonda saqlangan o'z belgisidan (34)
  - C — To'lov taklifi ekrani yopilganidan (34)
  - ✔ D — Qayta so'rab olingan Pro holatidan (34)
- Kalit: **D** (index 3). To'rttalasi bir shaklda («… -dan»); to'g'ri variant yolg'iz eng uzun emas; «Backend» hech bir variantda yo'q (dars atamasi faqat to'g'rida yashamasin — §127); «qayta so'rab» — 4-ekran joriy qatorining so'zi.
- To'g'ri izohi: Pro'ni Backend yoqadi — ilova uni qayta so'rab biladi. (54)
- Xato izohlari (≤60):
  - A: Sahifa brauzerda turadi. Pro qayerda yoziladi? (46)
  - B: Telefondagi belgi o'zi o'zgarmaydi. Pro qayerda yoziladi? (57)
  - C: Ekranni to'lamasdan ham yopsa bo'ladi. Pro qayerda yoziladi? (60)
- Javob topilgach (kichik, savol ostida): Backend tuguni — `pro_gacha` qatori yashil, ilovadan `GET /men` konverti va «Pro» javobi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol yangi holat (tashkilotchi ilovaga qaytgan payt) — 4-ekran sahnasining ko'chirmasi emas: u yerda «nima ochiladi» so'ralgan. Ikkala trekka to'g'ri (web-trekda — sayt Backend'dan so'raydi). Distraktorlar uch turkumdan (12-Modul 9.44 f):
  A — boshqa joydagi yozuv (brauzer) · B — qurilmadagi o'z holati · C — ekran hodisasidan xulosa. Kalit ibora 3-ekran bilan takrorlanmaydi (S-008: qator ↔ manba).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting: 2 savol + 2 blok «Bajardim» (`PRACTICE_BASE`). 5-ekran (QMustaqil) — `practice: -1`.
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Narx varag'i qatori» · 8 — «2 — Pro holati qayerdan»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — sinf 6, E 54; belgi ✓ va nishon faqat birinchi holatda; o'quvchi qilgan ishni aytadi):
  - A2 bajarilgan, `ishlaydi: true`: **Narxingiz bor — mashq to'lovdan keyin qulaylik ochildi.** (55)
  - A2 bajarilgan, `ishlaydi: false`: **To'lov yo'li bor — Pro yoqilishini tekshirish qoldi.** (52)
  - A1 bajarilgan, A2 yo'q: **Narx va to'lov ekrani tayyor — to'lov yo'li qoldi.** (50)
  - `pm-m11d4-narx` saqlangan, A1 yo'q: **Narxingiz yozildi — to'lov ekranini qurish qoldi.** (49)
  - hech narsa saqlanmagan: **Narx hali yozilmagan — uyda yozing.** (35)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yakunda YO'Q (SABOQ E 50; fikr dars ichida qoladi — A-2).
- Endi siz bilasiz (asosiy fikr so'zma-so'z takrorlanmaydi, T-048):
  - Narx — odam to'laydigan pul; unga xarajat, raqobat va qiymat tomonidan qaraladi.
  - Xarajat — mahsulotni ushlab turish uchun sarflanadigan pul.
  - To'lov taklifi ekranida nima ochilishi, narx va tugma turadi; pastida — «Test rejim: pul yechilmaydi».
  - Pro'ni ilova emas, Backend yoqadi — to'lov xabari kelgandan keyin.
  - To'lov raqamini Backend beradi: begona raqam bilan Pro yoqib bo'lmaydi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ota-ona yoki sinfdosh · Nechta: 2 ish · Muddat: keyingi darsgacha
  - ① Narxingizni bir kishiga tushuntiring: qaysi xarajat, raqobat va qiymatga qarab qo'ydingiz. Pul so'ramaysiz — faqat tushuntirasiz.
  - ② Darsda qolgan qismni tugating: {holatga qarab — narx varag'ini saqlang · Amaliyot 1 tekshiruvini tugating · to'lov yo'lini ulang va tekshiring}. Hammasi tugagan bo'lsa ② ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Hech kimdan pul so'ramang: bu darsdagi to'lov — mashq. (54)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: chip va ball · sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ① — real odam bilan, lekin suhbat emas: o'quvchi o'z narxini tushuntiradi, narx so'ramaydi va pul haqida kelishmaydi (pul suhbati — 6-dars ishi, bu yerda va'da qilinmaydi). ② bandi blok bayroqlari va `pm-m11d4-narx` dan yig'iladi (P-046).
  «Keyingi dars» qatori — App.jsx `m11-05` nomi, so'zma-so'z (`00-NOMLAR.md`; P-023, T-075 — va'da emas). Yakun sarlavhalarida «uyda» — faqat oxirgi holatda (PM+PRAKT darsida uyga vazifa bor).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Row Finder!** (3-ekran, 1-savol birinchi urinishda) — Gap narx varag'ining qaysi qatoriga yozilishini birinchi urinishda topdingiz
- **Price Reasoned!** (5-ekran, «Saqlash» — tekin bonus) — Narxingizni xarajat, raqobat va qiymat bilan yozib saqladingiz
- **Pro Switch!** (A1, 4-qadam «Bajardim») — Pullik qulaylikni Pro holatiga bog'lab, to'lov taklifi ekranini qo'ydingiz
- **Test Payment!** (A2, 4-qadam «Bajardim») — Mashq to'lovdan keyin qulaylik ochilishini o'zingiz tekshirdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yakuniy savol nishonsiz. 2, 4-ekranlar (ballsiz tushuncha) nishonsiz. Nomlar grep bilan tekshirildi (07.10: `src/`, `feedback/` — 0).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
- **3 · Narx varag'i** — 1 Bu darsda narxga to'rt qator bilan qaraladi: xarajat, raqobat, qiymat va narx. · 2 Raqobat — odam bugun shu ishni nima bilan qilishi. ·
  3 Mentor misolida raqobat — bepul Telegram guruhi.
  — Sinfga savol: Mahsulotingiz bajaradigan ishni odamlar hozir nima bilan qiladi?
- **8 · Pro holati** — 1 Pro'ni Backend to'lov xabari kelgandan keyin yoqadi. · 2 Ilova Pro holatini Backend'dan qayta so'rab biladi. ·
  3 Sahifadagi yozuv ham, telefondagi belgi ham — Pro holati emas.
  — Sinfga savol: Ilova Pro'ni o'zi yoqsa, nima bo'lardi?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Narx nima? | Odam to'laydigan pul | Mentor misolida: Pro, 30 kun — 15 000 so'm (Mentorning taxmini) |
| Xarajat nima? | Mahsulotni ushlab turish uchun sarflanadigan pul | Mentor misolida bugun 0 so'm; uxlamaydigan Backend bilan — oyiga taxminan 83 000 so'm |
| Raqobat nima? | Odam bugun shu ishni nima bilan qilishi | Mentor misolida — bepul Telegram guruhi |
| Qiymat nima? | Mahsulot odamga nima berishi | Mentor misolida — «Doimiy o'yin» har haftalik e'lonni o'zi qiladi |
| Mentor nega 10 000 ni 15 000 ga ko'tardi? | 10 000 da taxminiy Backend xarajati qoplanmas edi | Agar 6 tashkilotchining hammasi olsa ham, 15 000 da u zo'rg'a qoplanadi; uch qator — formula emas |
| To'lov taklifi ekrani nima? | Pullik qulaylik bosilganda chiqadigan ekran: nima ochiladi, narx, «To'lovga o'tish» | Inglizchasi: paywall |
| To'lov taklifi ekranining pastida nima yoziladi? | «Test rejim: pul yechilmaydi» | Bu modulda har to'lov ekranida |
| Mentor ilovasida to'lov nega brauzerdagi sahifada? | Bu kursda ilova do'kondan tarqatilmaydi: Android'da — APK, iPhone'da — brauzer ko'rinishi | Do'kondan tarqatilsa, uning to'lov qoidalari tegishi mumkin |
| Mashq to'lovdan keyin Pro'ni kim yoqadi? | Backend — to'lov xabari kelgandan keyin | Ilova Pro holatini `GET /men` dan o'qiydi |
| To'lov raqamini kim beradi? | Backend — «To'lovga o'tish» bosilganda | Raqam tasodifiy; mashq sahifasi faqat shu raqam bilan ishlaydi |
| «Doimiy o'yin»da keyingi o'yin qachon paydo bo'ladi? | Ro'yxat so'ralganda, oldingisining vaqti o'tgan bo'lsa | Mentor misolida taymer yo'q: bepul Backend uxlashi mumkin. Odatda ro'yxatni so'rash yozuv yaratmaydi — bu kurs loyihasining sodda yechimi |
| Pro o'zi yangilanib, pul yechiladimi? | Yo'q — muddat tugagach Pro o'zi to'xtaydi | Bu kursda pul umuman yechilmaydi — test rejim |
- §145: har javobdagi so'z darsda bor (narx, xarajat, raqobat, qiymat, 10 000 → 15 000 — 2 · to'lov taklifi ekrani, test rejim qatori, brauzer, Pro'ni kim yoqadi — 4 · to'lov raqami — 4, A2 · keyingi o'yin — 2, A1 · Pro tugashi — A1 prompti («o'zi to'xtasin»), A-bo'lim 8).
- S-027: har old tomon — to'liq savol, «?» bilan. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). «Inglizchasi: paywall» — modulda bir marta (tayanch 2; «sandbox» — 3-darsda bo'lgan).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda.
1. Mentor ilovasida to'lov sahifasi qayerda ochiladi? (4)
   - ✔ A — Telefon brauzerida, sahifa bo'lib
   - B — Ilova ichida, alohida to'lov oynasida
   - C — Telegram botida, chatning ichida
   - D — Play do'konida, to'lov oynasida
2. Mentor misolida «Doimiy o'yin» tashkilotchiga nima beradi? (2)
   - A — O'yinni pullik maydonda o'tkazadi
   - ✔ B — Har haftalik e'lonni o'zi qiladi
   - C — O'yinchilarni pul evaziga chaqiradi
   - D — Telegram guruhini o'chirib qo'yadi
3. Mentor misolida Pro muddatini qaysi qism uzaytiradi? (4, A2)
   - A — Ilova, tugma bosilganda
   - B — Mashq sahifasi, brauzerda
   - ✔ C — Backend, xabar kelgach
   - D — Tashkilotchi, sozlamada
4. Mashq to'lov sahifasida karta raqami qayerga yoziladi? (4, A2)
   - A — Sahifadagi maydonga, to'lashdan oldin
   - B — Ilovaga, to'lov taklifi ekranida
   - C — Backend'ga, `.env` fayli orqali
   - ✔ D — Hech qayerga, karta so'ralmaydi
5. Mashq sahifasi qaysi raqam bilan ochiladi? (4, A2)
   - ✔ A — Backend bergan to'lov raqami bilan
   - B — Tashkilotchi o'zi yozgan raqam bilan
   - C — Ilova o'ylab topgan raqam bilan
   - D — Hisobingizning o'z raqami bilan
6. Mentor tekshiruv o'yinini bir hafta orqaga surdi. Ro'yxat yangilansa nima bo'ladi? (A1)
   - A — Ilova o'yinni bekor deb ko'rsatadi
   - ✔ B — Keyingi haftaga yangi o'yin chiqadi
   - C — Ilova xato ko'rsatib, ishlamay qoladi
   - D — Ikkita yangi o'yin birdan chiqadi
7. Pro muddati tugasa, Mentor ilovasida nima bo'ladi? (A1)
   - A — Kartadan pul o'zi yechib olinadi
   - B — Pro yana 30 kunga uzayadi
   - ✔ C — Pro to'xtaydi va pul yechilmaydi
   - D — Hisob butunlay o'chiriladi
8. Mentor misolida xarajat qatoriga nima yozildi? (2)
   - A — Telegram guruhi bepul ekani
   - B — Har haftalik e'lon ishi
   - C — 30 kun uchun 15 000 so'm
   - ✔ D — Uxlamaydigan Backend puli
9. Bu modulda har to'lov ekranida qaysi qator turadi? (4)
   - ✔ A — Test rejim: pul yechilmaydi
   - B — Chegirma: faqat bugungacha
   - C — Karta raqamingizni kiriting
   - D — Narx tez orada qimmatlashadi
10. Mentor narxi yonida qaysi yorliq turadi? (2)
    - A — Render sahifasidan
    - ✔ B — Mentorning taxmini
    - C — Tashkilotchilar aytgani
    - D — Bozordagi o'rtacha narx
11. Agent «Pro yoqiladi, tayyor» dedi. Keyin nima qilasiz? (A2)
    - A — Yakunga o'tib, darsni tugatib qo'yaman
    - B — Agentdan yana bir marta so'rayman
    - ✔ C — Mashq to'lov bilan o'zim tekshiraman
    - D — Kodni o'qimasdan push qilib qo'yaman
12. Mentor misolida tashkilotchi bugun o'yinni nima bilan yig'adi? (2)
    - A — Pro'dagi «Doimiy o'yin» bilan
    - B — Lendingdagi asosiy tugma bilan
    - C — Maydon egasining ilovasi bilan
    - ✔ D — Bepul Telegram guruhi bilan
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006) — O'lchov bo'limi; kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (qator — raqobat, kitob ilovasi) ↔ arena 12 (Mentor raqobati, boshqa so'z) · 8-ekran (ilova qayerdan biladi) ↔ arena 3 (qaysi qism uzaytiradi) · kartochkalar bilan bir xil savol yo'q (§144: arena 1, 3, 5, 6, 9 kartochkadan boshqa so'z bilan).
- Distraktorlar turkumi: 4 va 9 — pul chegarasiga zid ishlar (karta, bosim, va'da — uch xil); 3 — ilova / sahifa / qo'lda; 6 — holat o'zgarishi / xato / takror yaratish; 12 — hali yo'q qulaylik / boshqa vazifadagi tugma / ilovada yo'q tomon. 10-savol C («Tashkilotchilar aytgani») — bu darsda narx hech kimdan so'ralmagan, yorliq ham shunday emas; keyingi darslarning natijasi ochilmaydi.
- 7-savol ✔ — tayanch 1.0 fakti («Pro muddati tugagach o'zi to'xtaydi — avtomatik yechish yo'q»); A1 promptidagi «o'zi to'xtasin» bilan bir.
- **Fon so'zlari** (R-008, kodda {uz, ru}): narx · xarajat · raqobat · qiymat · Pro · to'lov taklifi ekrani · mashq to'lov · test rejim · to'lov raqami · Maydon Jamoa · 15 000. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmPricingLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d4-v1`, `lessonTitle` — «Narxni qanday belgilaysiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · practice-own (mustaqil) · practice (A1) · practice (A2) · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 8: 3 }; bloklar `practice: -1`, signal `PRACTICE_BASE + ekran`; 5-ekran — `practice: -1`.
3. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2, s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + taxmin natijasi yashil quti ichida, E 42) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5 `QMustaqil` (`QQadamlar` 1/5) · s6/s7 `QBlok` + `QPrompt` (`ScreenBlok` ulagichi, 4 qadam) · s9 `QNatija` · s10 `QKartochka` (alohida ekran) · s11 `QYakun`.
4. **Bitta vizual `NarxSahna`** (180): `NARX` const — `xizmatlar` (to'rt karta: nom, «0 so'm · bepul reja»; Backend kartasining ikki yuzi — tayanch 1.4, 6) · `varaq` (to'rt qator: Xarajat · Raqobat · Qiymat · Narx; Mentor qiymatlari) · `hisob` (`[{ narx: 10000, jami: 60000, qoplaydi: false }, { narx: 15000, jami: 90000, qoplaydi: true }]`, `tashkilotchi: 6`, `xarajat: 83000`; qator boshida «Agar 6 tashkilotchining hammasi olsa:», muhr «Backend xarajatini …») ·
   `ekran` (tayanch 1.4 besh qatori) · `mashq` (3-dars sahifa matnlari + `raqam: 'm-7f3a…'`, natija yozuvi) · `yol` (konvertlar: `boshlash` · `xabar` · `men`) · `tg` (2-ekran guruh pufaklari). Telefon (≈170×272) va Backend tuguni bitta komponentda; «Maydon Jamoa» o'z rangida.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ns-uxlaydi ns-bugun ns-belgi ns-tolovga ns-tolash`). `prefers-reduced-motion` — o'tishsiz. **Karta maydoni hech bir holatda chizilmaydi.** Logotip yo'q.
5. s2: uch qadam ketma-ket (P-055): Backend kartasi ag'dariladi → son varaqqa uchadi → hisob qatori qizil; Telegram pufaklari navbat bilan; «E'lon berish» belgisi → keyingi hafta kartasi kiradi; 3/3 dan keyin narx qatori va hisob almashadi (`hisob[0]` → `hisob[1]`), telefondagi «?» → «15 000». Taxmin natijasi va `QIzoh` — yashil quti ichida (E 42).
6. s4: uch qadam: belgi → to'lov ekrani pastdan (uch yorliq chizig'i) → «To'lovga o'tish» → konvert `boshlash` → javob `m-7f3a…` → brauzer (mashq sahifasi) → «To'lash (mashq)» → konvert `xabar` → Backend `tolovlar` va `pro_gacha` yashil → ilova → konvert `men` → «Pro: 6-noyabrgacha».
7. s5 — ketma-ket karta formasi (E 43, E 53): `xarajat` (uch tugma: `{ oylik: 0, manba: 'bepul rejalar' }` · o'zi — son `/^\d+$/` + manba matni majburiy · kulrang «Mentor misoli» `{ oylik: 83000, manba: 'render.com/pricing, 07.10.2026' }` — oxirida, sukut emas), `raqobat`, `qiymat` (oldindan `pm-m11d2-model.nima`), `narx` (`/^\d+$/`, > 0), `davrKun` (30 yoki son), `ekran` (`sarlavha` majburiy, `matn`, `tugma` — sukut «To'lovga o'tish»).
   Hisob qatori: `pm-m11d2-model.soni` × `narx` ↔ `xarajat.oylik`, qavsda `soniManba` («Neon soni» / «taxmin»); soni yo'q yoki oylik 0 — muhrsiz qator. Maslahatlar (`QXato`) bloklamaydi; bo'sh majburiy maydon bloklaydi. Chapdagi telefon — o'quvchi ekrani jonli; «Test rejim: pul yechilmaydi» qatori — o'zgarmas.
   Saqlash `pm-m11d4-narx` (A-bo'lim 12), `ishlaydi: null` (birinchi saqlashda), `savedAt`; qayta saqlashda `ishlaydi` qiymati o'zgarmaydi. Mentor rejimida — `NARX.varaq` va `NARX.ekran`.
   `pm-m11d1-birlik.narxTaxmin` — faqat `tur: 'real'` da (0-ekran qatori, 4-karta qatori); `tur: 'mashq'` — Mentor misoli kulrang (tayanch 9.19).
8. A1/A2 — `ScreenBlok` (skelet) 4 qadam; `prompt: [...]`, `{…}` joylari accent pill, kulrang «masalan» — o'z faylida kichik o'rovchi (12-Modul bloklari bilan bir; `src/qolip` ga tegilmaydi — qolip taklifi).
   A1: `{pullik qulaylik}` ← `pm-m11d2-model.nima` · `{qulaylik joyi}` — bo'sh · `{sarlavha}`, `{matn}`, `{davr}`, `{narx}`, `{tugma}` ← `pm-m11d4-narx`. A1 «Ochish»: `pm-m11d2-model.model` ∈ {`reklama`, `b2b`, `tranzaksiya`} bo'lsa — «alohida mashq ekrani» gapi accent bilan, `{qulaylik joyi}` namunasi shunga almashadi (yo'q bo'lsa ham gap ko'rinadi).
   A2: `{tugma}`, `{narx}`, `{davr}` ← `pm-m11d4-narx` · `{Pro qatori joyi}`, `{hozirgi holat}` — bo'sh. A2 «Ochish»: `pm-m11d3-oqim.test` dan `true` bo'lmaganlari qatori.
   **KOD (qolipda yo'q):** A2 4-qadamida tekshiruv kartasi — «Pro yoqildi» / «Pro yoqilmadi» → `pm-m11d4-narx.ishlaydi` (`true` / `false`; kalit bo'lmasa — yangi yozuv `narx` siz yaratilmaydi: tanlov faqat ko'rinadi, yakun blok bayrog'idan); yashil xabar shu qiymatdan.
   Trek (`pm-m9d8-platforma.trek`): «Ochish» gaplari va Yordamdagi web-trek qatori; kalit yo'q — ikkala gap. «Davom etish»: A1 — 3-qadamdan keyin, A2 — 2-qadamdan keyin (E 55); blok bayrog'i — faqat 4-qadam «Bajardim»idan (9.36 h).
   `ortda` — faqat A1 da: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-04-done`.
9. s3/s8 `QTest` — matn yuqoridagidek; javob topilgach kichik vizual. `RECAPS` { 3, 8 } (3 karta + `ask`); `Q_LABELS` { 3, 8 }.
10. `ACHIEVEMENTS` 4 + `ACH_TRIGGERS`: s3 birinchi urinish → Row Finder · s5 «Saqlash» → Price Reasoned · A1 4-qadam «Bajardim» → Pro Switch · A2 4-qadam «Bajardim» (tekshiruv kartasi tanlangan) → Test Payment.
11. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — s10 alohida ekranda.
12. s11 `QYakun`: `recap` 5 qator; «Bugungi asosiy fikr» yo'q (E 50); `uyga` — `HwCard` (② bandi holatdan yig'iladi); sarlavha **besh holat** — A1/A2 blok bayroqlari va `pm-m11d4-narx` (`savedAt`, `ishlaydi`) dan (P-046; E 54); `keyingi` — «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz».
13. App.jsx `m11-04` qatoriga `comp: PmPricingLesson` — «qur» bosqichida (asosiy seans; nom va osti o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari (3, 8).
14. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). CSS izohida backtik yo'q.
- Darvozalar: `npm run gates -- src/11-Modull/PmPricingLesson.jsx` 12/12 · `npm run lint:jsx` 0 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-04-start` = `m13-dars-03-done` → `m13-dars-04-done`, tayanch 3)
1. **`m13-dars-04-start`** = `m13-dars-03-done` (tayanch 3): `tolovlar`, `POST /tolov/webhook` (imzo, takror, rad), `GET /tolov-mashq?oyinchi=…&summa=…` (to'rt tugma), `TOLOV_KALITI`, README «To'lov» («Hozircha: … Pro va ilova hali o'zgarmaydi.»).
2. **`m13-dars-04-done`** = start + ikki commit, A1/A2 «Yordam» talablaridagidek (tayanch 1.4, 3, 9.7):
   - A1: `oyinchilar.pro_gacha` (sana yoki `NULL`; mavjudlariga `NULL`) · `GET /men` (token; `pro` = `pro_gacha > now()`, `proGacha`; tokensiz `401`) · `oyinlar.doimiy` (bool, sukut `false`) · `POST /oyinlar` — `doimiy: true` faqat Pro'dagi tashkilotchidan, aks holda `403` ·
     `GET /oyinlar` — `doimiy` o'yinning vaqti o'tgan bo'lsa (`Asia/Tashkent`): `kun + 7`, o'sha `soat`, `maydon`, `kerak`, `tashkilotchi_id` bilan yangi o'yin, `doimiy` yangisiga o'tadi (bir marta; taymer yo'q) · `mobil/`: «E'lon berish» — belgi «Har hafta takrorlansin», to'lov taklifi ekrani (tayanch 1.4 matni), «Pro: {sana}gacha».
   - A2: `boshlangan_tolovlar` (`tolov_raqami` — `m-` + 12 tasodifiy belgi, UNIQUE · `oyinchi_id` · `summa` · `yaratilgan`) · `POST /tolov/boshlash` (token; `PRO_NARX = 15000`, `PRO_KUN = 30` — Backend'da bitta joyda; `{ tolovRaqami, havola }`) · `GET /tolov-mashq?raqam=…` (raqamsiz yoki noma'lum — «To'lov topilmadi.»; `oyinchi`, `summa` raqamdan; to'rt tugma shu raqam bilan; natija yozuvi) ·
     webhook: `oyinchi_id`, `summa` — `boshlangan_tolovlar` dan (yo'q yoki mos emas — `400`); yangi `tolandi` → yozuv va `pro_gacha = greatest(now(), coalesce(pro_gacha, now())) + PRO_KUN` bitta Database ishida · bitta raqam — bitta natija · `mobil/`: «To'lovga o'tish» → boshlash → telefon brauzeri; ilovaga qaytganda `GET /men` · README «To'lov» «Hozircha» qatori (A2 Yordamidagi matn).
3. **Tayanch 1.5 holati:** `m13-dars-05-start` = `04-done`, README eslatmasi — pilotda topilgan muammolar bilan (tayanch 3). Tayanch 1.5 dagi ikki muammo (Pro'ni uzaytiradigan qator takror tekshiruvidan oldin ishlaydi · sahifa javobni 10 soniya kutib «To'lov o'tmadi» deydi) — agent yozgan kodda bo'lsa (ataylab qo'yilmaydi — F-1007-463):
   4-dars talabida ikkalasi ham buzilmaydigan qilib yozilgan (3-band tartibi, F-1007-462 dan — yozuv va Pro bitta Database ishida; kechikish — talabda yo'q): Mentor repo'sidagi 1-muammo — agent talabni bajarmagani («agent aytdi — da'vo»), 5-darsda topiladi. ⛔ «qur»: muammolar Mentor repo'sida haqiqatan takrorlanadimi — 5-dars pilotida tekshiriladi (tayanch 1.5); 4-dars matni bu holatni aytmaydi va va'da qilmaydi.
   Keyingi o'yin yaratishda Pro muddati tekshirilmaydi (talabda yo'q; Pro tugashi — tayanch 1.5 A1, tuzatish — 1.12).
4. README «Darslar va teglar» jadvaliga 4-dars qatori: «Pro holati (`pro_gacha`, `GET /men`), «Doimiy o'yin», to'lov taklifi ekrani; `POST /tolov/boshlash`, mashq sahifasi raqam bilan, webhook Pro'ni 30 kun uzaytiradi».
5. Muhrdan oldin (⛔ «qur» darvozasi): Render'da deploy; A1 to'rt tekshiruvi va A2 to'rt tekshiruvi Mentor repo'sida; Expo Go'da «To'lovga o'tish» → telefon brauzeri → ilovaga qaytish → `GET /men` (Android) va iPhone brauzer ko'rinishida (Shubhali 1); `kun - 7` SQL `oyinlar.kun` turida (Shubhali 4); 3-darsdagi uch tekshiruv raqamli sahifa bilan.

## Manbalar (o'zim tekshirdim yoki tayanch 6 orqali, 07.10.2026; o'quvchiga ko'rinmaydi)
1. Render narxi — tayanch 6 / MANBA 5 (`render.com/pricing`, 07.10.2026): eng arzon pullik veb-xizmat — oyiga 7 dollar → 2-ekran, 5-ekran tugmasi, kartochka 2. O'zim `render.com/pricing` ni ochib ko'rdim (WebFetch, 07.10.2026) — sahifa mazmuni chiqmadi (skript bilan chiziladi); son tayanchdan, o'zgartirilmadi (Shubhali 5).
2. Render bepul xizmati — tayanch 6 (`render.com/docs/free`, 06.10.2026): 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa; production uchun tavsiya qilinmaydi → 2-ekran Backend kartasi, A2 (1) («bir daqiqagacha» — 12-Modul 9.19).
3. Markaziy bank kursi — tayanch 6 (`cbu.uz`, 07.10.2026): 1 AQSH dollari = 11 790,79 so'm → 7 × 11 790,79 = 82 535,53 so'm → o'quvchi matnida «taxminan 83 000 so'm (7-oktabr kursi)».
4. Payme Business — `developer.help.paycom.uz/initsializatsiya-platezhey/` (o'zim, WebFetch, 07.10.2026; sahifa rus tilida, mazmuni o'zbekcha): to'lovni qabul qilish to'lov shakli — chek bilan boshlanadi, chek merchant tomonida shakllantiriladi (POST yoki GET bilan yuboriladi) → 4-ekran O'qituvchi eslatmasi (tayanch 9.7 izohi bilan bir).
5. Do'kon qoidalari — tayanch 6: Google Play — «Play-distributed apps requiring or accepting payment for access to in-app features or services … must use Google Play's billing system» (`support.google.com/googleplay/android-developer/answer/9858738`) · Apple 3.1.1 — App Store ilovalari uchun (`developer.apple.com/app-store/review/guidelines`) → 4-ekran joriy qatori va O'qituvchi eslatmasi. O'zim qayta ochmadim (Shubhali 6).
6. Qonun — tayanch 6 (`lex.uz/docs/-111189`, 07.10.2026): FK 27-modda — 14–18 yoshlilar bitimni ota-onaning yozma roziligi bilan tuzadi → A2 kulrang qatori (o'quvchi matnida qonun nomi yo'q), O'qituvchi eslatmasi.
7. Kurs ichidagi so'zlar (grep, 07.10): `oyinlar` ustunlari va `kun` (sana) — 11-Modul tayanchi 9.29, 9.30 · tashkilotchi avtomatik qo'shilmaydi («0 / N») — 9.31 · mashq sahifasi matnlari, raqam formati `m-`, `TOLOV_KALITI`, README «To'lov» — pilot `03-PaymentWebhook-v3.md` (A2, REPO 3) · Neon SQL Editor, `WHERE id` bilan tozalash — 12-Modul `07-PmFiftyUsers-v3.md` ·
   «Telegram guruhida «kim keladi?»» — 12-Modul tayanchi 1.6 (11-Modul intervyulari) · `pm-m11d1-birlik`, `pm-m11d3-oqim` maydonlari — tayanch 8, 9.6, 9.19.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Hook** — maket: Mentorning to'lov ekrani qoralamasi (yorliq «Mentorning rejasi», narx «?»), uch variant: xarajat · boshqalar so'raydigan pul · ko'ngilga yoqqan son; birinchi ikkitasiga bir xil «Aynan!» matni, uchinchisiga «Qiziq fikr!».
2. **Ta'rif shakli:** raqobat — «odam bugun shu ishni nima bilan qilishi», qiymat — «mahsulot odamga nima berishi» (tayanch: «… qiladi», «… beradi»); joriy qator, kartochka va takrorlashda bir xil. Ma'no o'zgarmagan — gapga qo'yish uchun.
3. **«Narx varag'i»** — darsning vizual nomi (to'rt qator: xarajat · raqobat · qiymat · narx); 3-ekran savoli «qaysi qatorga yoziladi» shu nom bilan. «Usul» so'zi o'quvchi matnida ishlatilmadi (App.jsx ostida ham yo'q).
4. **2-ekran Telegram pufaklari:** tashkilotchi «Shanba, 18:00, Mahalla maydoni — kim keladi?», javoblar «Men», «Men ham», «Kelaman» — olam ichidagi matn, namuna (12-Modul 1.6 dagi «kim keladi?» dan); son yo'q.
5. **«6 × 10 000 = 60 000» qatori** — tayanch 1.4 «10 000 taxmini xarajatga qarab ko'tarildi» ning hisobi; 1.13 da 60 000 faqat 1-darsning «agar» mashqi sifatida bor (boshqa ma'no — kanalga sarf). Maketda «6 tashkilotchi × 10 000» deb aniq yozildi — «agar» mashqi bilan aralashmasligi uchun. Shunday qolsinmi?
6. **2-ekran kulrang qatori** «Bu kursda Backend bepul qoladi — 83 000 faqat narx hisobi uchun.» (WH-q1 A dan).
7. **`POST /tolov/boshlash` yozuvi alohida jadvalda** (`boshlangan_tolovlar`: to'lov raqami · hisob · summa · yaratilgan), `tolovlar` ga emas: aks holda 3-darsdagi takror tekshiruvi birinchi to'lov xabarini «takror» deb olardi (tayanch 9.2). Sahifa manzili `?raqam=`; 3-darsdagi `?oyinchi=&summa=` endi ishlatilmaydi; to'rt tugma shu raqam bilan (yangi raqam yaratmaydi).
8. **Pro uzaytirish:** Pro yo'q bo'lsa — hozirdan, bor bo'lsa — muddat oxiridan +30 kun (tayanch: «`pro_gacha` = bugun + 30 kun», REPO «uzaytiradi», 1.5 «ikki xabar — 60 kun»).
9. **`GET /men` — yangi yo'l** (11, 12-Modulda yo'q — grep): token bilan, kamida `pro`, `proGacha`; tokensiz `401`.
10. **«Doimiy o'yin» Backend tomoni** (F-1007-462: ChatGPT «hozirdan» degan — rad: 9.26 va M-q4 A; talab endi «Pro to'xtaydi»ni `pro` holati deb aniq aytadi, `GET` yozuv yaratishi — O'qituvchi eslatmasida «sodda yechim»): `oyinlar.doimiy`; `POST /oyinlar` Pro'siz `doimiy` — `403`; keyingi o'yin `kun + 7`, o'sha soat, maydon, kerak, tashkilotchi; belgi yangisiga o'tadi (bir marta yaratiladi). Pro muddati bu talabda tekshirilmaydi — 5-dars 1-amaliyotida qo'shiladi (tayanch 9.26); bir vaqtdagi ikki so'rovda takror yaratilish — 12-dars topilmasi (tayanch 1.12).
11. **Ilovadagi Pro qatori** «Pro: {sana}gacha» — belgi ostida (tayanchda Pro qayerda ko'rinishi yo'q); maketdagi namuna sana «6-noyabrgacha» (7-oktabr + 30 kun) va A1 tekshiruvida «8-oktabrgacha».
12. **To'lov taklifi ekranidan chiqish** — orqaga qaytish (telefonning «orqaga» tugmasi yoki ekran tepasidagi qaytish belgisi; ekranga yangi yozuv qo'shilmaydi) — bosimsiz bo'lishi uchun; tayanch 1.4 tarkibiga so'z qo'shilmadi.
13. **Mashq sahifasining natija yozuvi** — «To'lov o'tdi (mashq) — ilovaga qayting.» / rad — «To'lov o'tmadi.»; javob kechikkan holat talabda yo'q (agentning tanloviga qoladi; tayanch 1.5 2-muammo shundan). «To'lov o'tmadi» — 1.3, 1.5 dagi so'z.
14. **A1 tekshiruvidagi vaqtincha Pro** (Neon `UPDATE … SET pro_gacha = now() + interval '1 day' WHERE id`), Mentor misolida «tekshiruv» maydonli o'yin va `kun - 7`, so'ng tozalash (`pro_gacha = NULL`, `DELETE … WHERE id IN`). Muqobil — agent tekshiruv akkaunti (12-Modul 9.35 a); o'z hisobi tanlandi, chunki A2 da ham shu hisob kerak.
15. ✅ **Yopildi — F-1007-462:** model boshqa bo'lsa — alohida mashq ekrani (menyuda yo'q); asosiy ekranlar va model o'zgarmaydi (tayanch 9.28). Avval: **O'quvchi modeli reklama, B2B yoki tranzaksiya bo'lsa** — «mashq uchun bitta qulaylikni pullik obuna qilib quring; modelingiz o'zgarmaydi» (A1 «Ochish»). Dastur natijasi («narxli paywall ishlaydi») hamma o'quvchi uchun.
16. **`pm-m11d4-narx` qiymatlari** (F-1007-462: `ishlaydi` — `true | false | null`; 5-ekranda `null`): `xarajat.manba` — matn; `davrKun` — son (sukut 30); `ekran.tugma` — sukut «To'lovga o'tish»; `ishlaydi` — 5-ekranda `false`, A2 tanlovidan `true` / `false`; pullik qulaylik nomi kalitga yozilmaydi (A1 da `pm-m11d2-model.nima` dan). Yangi maydon qo'shilmadi.
17. **5-ekran hisob qatori** — `pm-m11d2-model.soni` × narx ↔ xarajat; «qoplamaydi» — maslahat, bloklamaydi, qizil emas.
18. ✅ **GATE M M-q3 A — foydalanuvchi qarori** (F-1007-462 da ChatGPT rad qilishni so'radi — o'zgartirilmadi). **Haqiqiy foydalanuvchilar ham to'lov ekranini ko'radi** va mashq to'lov bilan Pro yoqishi mumkin (pul yechilmaydi, ikki joyda yozilgan) — shunday qoldirildi (tayanch 1.13: Pro'ni test rejimda yoqqanlar soni yo'q). Muqobil: kurs davomida to'lov ekranini faqat o'z hisobiga ko'rsatish — sizning qaroringiz.
19. **Reja yorlig'i** — App.jsx osti so'zma-so'z, «→» belgisi bilan (P-015); T-035 (belgi-formula o'quvchi izohida yo'q) bilan ziddiyat — menyu yozuvi, izoh emas, o'zgartirilmadi.
20. **«Real ishga tushirish …» gapi** — A2 mashq sahifasi ostida (YaTT ochilgan: «yakka tartibdagi tadbirkor»); 3-darsda 11-ekranda bor edi — 4-darsda to'lov yo'li ishlaganda takrorlandi.
21. **Nishon nomlari:** Row Finder · Price Reasoned · Pro Switch · Test Payment (grep 0).
22. **A2 tekshiruv tanlovi** «Pro yoqildi» / «Pro yoqilmadi» (3-dars «Kutilganidek / Boshqacha» naqshi); `ishlaydi` shu tanlovdan.
23. **README «Hozircha» qatori A2 da yangilanadi** (3-darsdagi «Pro va ilova hali o'zgarmaydi» eskiradi); o'quvchi `{hozirgi holat}` ni o'zi yozadi.
24. **Mentor to'lov raqami namunasi** `m-7f3a…` (F-1007-462: avval `m-104` — ketma-ket raqam manzilda taxmin qilinardi; endi tasodifiy) (tayanch 9.1 shakli: `m-101`, `m-102` … — 3-darsda ishlatilganlardan keyingisi deb).
25. **A2 «Kutayotganda» promptidagi savol** «Pro takror tekshiruvidan keyin uzayadimi» — o'quvchi agent javobini o'qiydi, tekshirmaydi (tekshirish — keyingi dars ishi, matnda va'da yo'q). Kerak emas desangiz — olib tashlanadi.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **Expo'da «To'lovga o'tish» → telefon brauzeri → ilovaga qaytganda `GET /men`** — Expo Go'da (Android) va iPhone brauzer ko'rinishida sinalmagan; qaytish payti (ilova yana faol bo'lganda) agentning tanloviga qoladi. «Qur» pilotida haqiqiy telefonda.
2. ⛔ **Render'da boshlash + mashq sahifasi + webhook bitta Backend'da** — 3-dars Shubhali 1 (o'z tashqi manziliga so'rov) shu yerda ham amal qiladi; ishlamasa — webhook funksiyasi ichkaridan chaqiriladi (tayanch 9.4).
3. ⛔ **90 daqiqa** (ChatGPT auditi: 130–160 daqiqa; «Doimiy o'yin» Backend mantiqini 5-darsga surish — pilotdan keyin foydalanuvchi qarori) — A1 (ekran, Pro holati, «Doimiy o'yin», to'rt tekshiruv SQL bilan) ≈22 va A2 (to'rt tekshiruv) ≈20 daqiqaga sig'ishi; A1 ning (3), (4) uyga o'tishi mumkin (Ulgurmasangiz). Taymer bilan pilotda.
4. **`kun - 7`** — `oyinlar.kun` sana turida bo'lsa ishlaydi (11-Modul 9.30: «sana»); matn bo'lsa — agent SQL yozadi (zaxira gap A1 4-qadamda). `now() + interval '1 day'` — `pro_gacha` turi agentning tanloviga qoladi. «Qur» da Mentor repo'sida.
5. **Render narx sahifasi** — o'zim ochib ko'ra olmadim (skript bilan chiziladi); 7 dollar — tayanch 6 dan (07.10.2026).
6. ⛔ **Do'kon qoidalari** — tayanch 6 iqtiboslari; sahifalarni qayta ochmadim — «qur» oldidan sana bilan qayta (F-1007-462).
7. **Tayanch 1.5 ikki muammosi `04-done` da** — talab ularni chaqirmaydi; ular faqat agent yozgan kodda bo'lsa chiqadi, ataylab qo'yilmaydi (F-1007-463). Mentor repo'sida bo'lmasa — 5-dars MD si moslanadi (tayanch 1.5 ⛔).
8. **Haqiqiy foydalanuvchilar mashq Pro yoqishi** (TAYANCHGA SAVOL 18) — GATE M M-q3 A bilan tasdiqlangan; ChatGPT «mahsulot ma'lumoti ifloslanadi» deb rad etishni so'radi (F-1007-462) — foydalanuvchiga aytildi.
9. **12-Modul real vaqt va eslatmalar** — yangi «doimiy» o'yin yaratilganda `oyin-ozgardi` hodisasi yuboriladimi va eslatma qo'yiladimi — talabda yo'q («avvalgidek ishlasin»); agentning tanloviga qoladi. 8-dars Telegram xabari shu yaratilishga tayanadi (tayanch 1.8) — 8-dars MD sida ko'riladi.
10. **Tekshiruv o'yini haqiqiy foydalanuvchilarga** bir necha daqiqa ko'rinishi — kimdir qo'shilib qolsa `DELETE` qatnashuv yozuvi tufayli xato berishi mumkin; O'qituvchi eslatmasida ochiq, pilotda ko'riladi.
11. **O'zbekcha sana yozuvi** «6-noyabrgacha» — ilovada sana formati agentning tanloviga qoladi; maketda shu shakl.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot va ⛔ pilot taymeri; A-bo'lim 11; A1, A2 da «Ulgurmasangiz»; Render kutishi paytida ish (A1, A2 3-qadam — kodni ko'rsatadigan prompt); «sig'adi» deyilmagan (Shubhali 3).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Shubhali 1, 2, 3 ⛔; Render narxi va kurs — tayanch 6, sana bilan; do'kon qoidalari — tayanch 6; Expo, Render tugma nomlari taxmin qilinmagan («Render'da yangi versiya tugashini kuting», «telefon brauzerida»); kutish — «bir daqiqagacha», «bir necha daqiqa cho'zilishi mumkin».
3. [x] **Saqlash kaliti — shartnoma** — `pm-m11d4-narx` tayanch 8 aynan (A-bo'lim 12): har maydon turi va manbasi; `ishlaydi` — ish fakti (A2 tanlovi), 5-ekranda `false`; son yolg'iz emas — `xarajat` `{ oylik, manba }`, `narx` + `davrKun`; o'qiydigan kalitlar yo'q bo'lsa — o'quvchi yozadi; `tur: 'mashq'` sonlari o'quvchiniki deb ko'rsatilmaydi; boshqa darsning kaliti yozilmaydi; kalitga ism, login, kalit qiymati yo'q.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — joriy qatorlar va xulosalar «Mentor misolida», «Bu misolda»; narx varag'i — Mentor namunasi (5-ekran ✎); to'rt qator — «Bu darsda» (takrorlash 3); «Doimiy o'yin», «Har hafta takrorlansin», `doimiy` — faqat Mentor Yordamida; o'quvchida — `{pullik qulaylik}`.
5. [x] **Kafolat va sabab da'vosi yo'q** — «Pro yoqildi» — o'quvchi ko'rgani; agentning «to'lov ishlaydi» degani — «hali uning so'zi» (A2); «chiqishi kerak», «kechikishi mumkin», «zo'rg'a qoplanadi», «hammasi olsa ham» (eng yaxshi holat); «Tuzatish» so'zi bu darsda yo'q; kafolat so'zlari o'quvchi matnida 0 (O'lchov grep).
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — 11-ekran besh sarlavha, «hech narsa» holati alohida (E 54); A2 yashil xabari ikki holatli; blok bayrog'i faqat 4-qadamdan; Test Payment tavsifi qilingan ishni aytadi (natijadan qat'i nazar); ✓ faqat birinchi holatda.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — xarajat — oyiga so'm (birlik aytilgan); «hammasi to'lasa» — to'lovchilar soni × narx (birlik — kishi va so'm); Pro — `pro_gacha` sanasi (Neon `SELECT` bilan ko'riladi); «eng» so'zli ta'rif yo'q («eng arzon pullik veb-xizmat» — faqat Manbalarda).
8. [x] **Test: bitta himoyalanadigan javob** — 3-ekran: savoldagi «tekin» variantlarda yo'q, distraktorlar uch turkum; 8-ekran: uch turkum (boshqa joydagi yozuv · qurilma holati · ekran hodisasi), Backend — darsning o'z qoidasi; arena distraktorlari — har savolda turli turkum (arena izohi); tashqi xizmat haqida rost bo'lib qolishi mumkin bo'lgan distraktor yo'q (arena 1 — Mentor ilovasi haqida).
9. [—] **Real odamlar xavfsizligi** — bu darsda real odam bilan ish yo'q (suhbat, post, tasdiq — boshqa darslar). Tegadigani: uyga vazifa ① — tushuntirish, pul so'ralmaydi; haqiqiy foydalanuvchilar mashq Pro ko'rishi — O'qituvchi eslatmasi va TAYANCHGA SAVOL 18; tekshiruv o'yini — «tekshiruv» nomi va o'chirish.
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — A1, A2 tekshiruvlari o'quvchi bosadigan tugmalar va Neon `SELECT` bilan; agent faqat ustun nomi boshqacha bo'lsa SQL yozadi («o'zing ishga tushirma»); natijani o'quvchi tanlaydi («Pro yoqildi / yoqilmadi»); tozalash `WHERE id` bilan.
11. [x] **Web-trek teng yo'l** — A-bo'lim 10; A1, A2 «Ochish» trek gapi va Yordamdagi web-trek qatori (yangi oyna, sayt qaytganda `GET /men`); sarlavhalarda «mahsulotingiz», «qulaylik»; yakuniy savol ikkala trekka; web usuli to'qilmagan (umumiy so'z).
12. [x] **Mentor misoli ichki izchil** — narx 10 000 → 15 000, 6 tashkilotchi, 83 000 — tayanch 1.1, 1.4, 1.13; to'lov ekrani matni bitta manba (`NARX.ekran`: 0, 2, 4-ekran, A1, kartochka); mashq sahifasi — 3-dars matni; keyingi darslarning sonlari ochilmagan; yangi tafsilotlar — TAYANCHGA SAVOL 4, 5, 7–14, 24.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — A1 `{pullik qulaylik}`, `{qulaylik joyi}`; A2 `{Pro qatori joyi}`, `{hozirgi holat}`; narx, davr, ekran matni — o'quvchining 5-ekrandagi yozuvi; «Doimiy o'yin» va `doimiy` faqat Yordamda; qaytarib bo'lmaydigan o'zgarish yo'q (yangi ustun `NULL` bilan, yangi jadval).
14. [x] **Uyga vazifa yengil va aniq** — ikki band (tushuntirish · qolganini tugatish), muddat bilan; ② holatdan, hammasi tugagan bo'lsa ko'rinmaydi.
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …», «Mashq to'lov: kutganim …, bo'ldi …»; «sizda emas», «xatongiz emas» — 0 (grep).
16. [x] **Kelajak va'dasi yo'q** — to'lov ekranida faqat hozir ishlaydigan narsa (5-ekran maslahati — «tez orada», «chegirma»); «Pro shartlari» havolasi qo'yilmadi (7-dars); 5-dars buzish va 6-dars suhbatlari — faqat O'qituvchi eslatmasida, o'quvchiga va'dasiz; «keyingi amaliyotda» — shu dars ichidagi A2 (A1 QIzohi); kelajak — faqat yakundagi «Keyingi dars» qatori.
+ **12-Modul tayanchi 7 (11-Modul sinflari)** — holatga qarab yakun [x] · da'vo isbot emas [x] («Pro yoqildi» — bitta yo'l, bitta tekshiruv; «hali uning so'zi») · maxfiy qiymat agentga va ochiq joyga chiqmaydi [x] (A1, A2 promptlari, xato yo'li) · tashqi xizmat haqida faqat rasmiy hujjat [x] (Manbalar 1–6) · har sonning manbasi [x] (A-bo'lim 6) ·
  tayanchda yo'q narsa to'qilmagan [x] (TAYANCHGA SAVOL 1–25) · saqlash kaliti o'qiydigan darsdan [x] · test: bitta javob [x] · keys [—] (keyssiz, Qaror-0 21) · 90 daqiqa [x] · bir ma'no — bir so'z [x] (A-bo'lim 5) · web-trek [x] · agent va o'quvchi ishi ajratilgan [x] · o'smir xavfsizligi [x] (pul chegarasi, real odam yo'q).
+ **13-Modulga xos (pul):** real pul yo'q [x] (tepada, A-bo'lim 8, 2-ekran kulrang qatori, A2 halol qatorlari, uyga vazifa) · karta ma'lumoti hech qayerda [x] (maketlar, A1/A2 promptlari «karta maydoni bo'lmasin», 5-ekran maslahati, arena 4, KOD 4) ·
  «mashq to'lov» Payme/Click ko'rinishini taqlid qilmaydi [x] (A2 promptida taqiq; Payme faqat Manbalar va O'qituvchi eslatmasida) · «test rejim» belgisi har to'lov ekranida [x] (to'lov taklifi ekranining har ko'rinishida — 0, 2, 4, 5-ekran, A1, A2; mashq sahifasida — 3-dars qatori) ·
  narx — «Mentorning taxmini» [x] (yorliq har maketda, varaq, kartochka 1) · suhbat va tasdiqda bosim yo'q [—] (bu darsda suhbat va tasdiq yo'q; uyga vazifa ① — pul so'ralmaydi) · oferta — shablon [—] (7-dars) · avtomatik yechish yo'q [x] (A1 prompti, arena 7, kartochka 12) · komissiya aytilmagan [x].

## O'lchov
Skript: scratchpad `md04/olchov.py` (07.10.2026; yakuniy fayl bo'yicha). Belgilar — oddiy `len` (`**` siz, boshidagi bo'shliqsiz). Qavsdagi sonlar ekran matnida skript bilan to'ldirilgan (`md04/sanoq_tuzat.py`) — qo'lda sanalmagan.
Chegaralar: sarlavha ≤55 · xulosa va yashil xabar ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi / maslahat ≤60 · joriy qator va kulrang qator — mo'ljal ≤120 (qat'iy chegara yo'q). Yakuniy yurishda chegaradan oshgani — **0**
(oldingi yurishlarda topilib tuzatilgan: 8-ekran to'g'ri izohi 61 va A xato izohi 61 · 3-ekran ✔ yolg'iz eng uzun · arena 1, 5, 6, 7, 11 — ✔ yolg'iz eng uzun · arena 6, 9, 12 — >15%).

```
sarlavha        26  | 0 · Kirish  ← QKirish | Narxni qanday belgilaysiz?
qator           42  | 0 · Kirish  ← QKirish | Menga ketadigan xarajatni qoplashiga qarab
qator           43  | 0 · Kirish  ← QKirish | Boshqalar shu ishga so'raydigan pulga qarab
hook javobi     81  | 0 · Kirish  ← QKirish | Aynan! Bu — narxga qaraladigan tomonlardan biri. Bugun qolganlarini ha
hook javobi     81  | 0 · Kirish  ← QKirish | Aynan! Bu — narxga qaraladigan tomonlardan biri. Bugun qolganlarini ha
hook javobi     92  | 0 · Kirish  ← QKirish | Qiziq fikr! Birinchi taxmin shunday bo'lishi mumkin. Bugun unga bir ne
sarlavha        46  | 1 · Reja  ← QReja | Bugun narx qo'yasiz va mashq to'lovni ulaysiz.
sarlavha        39  | 2 · Narx varag'i  ← QT | Mentor Pro narxini nimaga qarab qo'ydi?
joriy qator     98  | 2 · Narx varag'i  ← QT | Mahsulotni ushlab turish uchun sarflanadigan pul xarajat deyiladi. Men
joriy qator     98  | 2 · Narx varag'i  ← QT | Odam bugun shu ishni nima bilan qilishi raqobat deyiladi. Mentor misol
qator           79  | 2 · Narx varag'i  ← QT | Mentor misolida guruh bepul qoladi — Pro faqat guruhda yo'q ishga pul 
joriy qator     99  | 2 · Narx varag'i  ← QT | Mahsulot odamga nima berishi qiymat deyiladi. Mentor misolida — tashki
xulosa          93  | 2 · Narx varag'i  ← QT | Uch qator narxni formula bilan chiqarmaydi: Mentor ularga qarab 15 000 ni
qator           79  | 2 · Narx varag'i  ← QT | Hisobda faqat taxminiy Backend xarajati: hammasi olsa ham, u zo'rg'a qoplanadi.
variant         40  | 3 · 1-savol  ← QTest ( | Xarajat: ilovani ushlab turish uchun pul
variant         37  | 3 · 1-savol  ← QTest ( | Raqobat: odamlar bugun nima ishlatadi
variant         32  | 3 · 1-savol  ← QTest ( | Qiymat: ilova odamga nima beradi
variant         34  | 3 · 1-savol  ← QTest ( | Narx: odam to'laydigan pul miqdori
to'g'ri izoh    56  | 3 · 1-savol  ← QTest ( | Odamlar bu ishni bugun tekin chatda qiladi — bu raqobat.
xato izohi      56  | 3 · 1-savol  ← QTest ( | Xarajat — ilova egasining puli. Gapda kim nima qilyapti?
xato izohi      50  | 3 · 1-savol  ← QTest ( | Qiymat — ilova nima berishi. Bu gapda ilova bormi?
xato izohi      54  | 3 · 1-savol  ← QTest ( | Narx — ilova so'raydigan pul. Gap kimning ishi haqida?
sarlavha        41  | 4 · To'lov taklifi ekr | Pullik qulaylik bosilganda nima ochiladi?
joriy qator     78  | 4 · To'lov taklifi ekr | Pullik qulaylik bosilganda chiqadigan bu ekran to'lov taklifi ekrani d
joriy qator     82  | 4 · To'lov taklifi ekr | Mentor ilovasi do'kondan tarqatilmaydi; bu kursda mashq to'lov brauzerda
joriy qator     88  | 4 · To'lov taklifi ekr | Pro'ni Backend to'lov xabari kelgach yoqadi; ilova buni Backend'dan qa
xulosa         100  | 4 · To'lov taklifi ekr | Bu misolda karta ilovaga ham, Backend'ga ham kirmaydi: Pro'ni to'lov x
sarlavha        41  | 5 · O'z narxingiz  ← Q | Mahsulotingiz narxi nimaga qarab chiqadi?
qator           81  | 5 · O'z narxingiz  ← Q | Xarajat — oyiga, xizmat sahifasidan, sanasi bilan; qolgani — sizning taxminin
xato/maslahat   40  | 5 · O'z narxingiz  ← Q | Xarajatni tanlang yoki son bilan yozing.
xato/maslahat   44  | 5 · O'z narxingiz  ← Q | Bu son qayerdan — sahifa va sanasini yozing.
xato/maslahat   47  | 5 · O'z narxingiz  ← Q | Odamlar hozir nima bilan qiladi — shuni yozing.
xato/maslahat   42  | 5 · O'z narxingiz  ← Q | Qulaylik qaysi ishni oladi — shuni yozing.
xato/maslahat   32  | 5 · O'z narxingiz  ← Q | Narxni so'mda, son bilan yozing.
xato/maslahat   35  | 5 · O'z narxingiz  ← Q | Sarlavhaga nima ochilishini yozing.
xato/maslahat   58  | 5 · O'z narxingiz  ← Q | Hammasi to'lasa ham xarajat qoplanmaydi. Qayta ko'rasizmi?
xato/maslahat   55  | 5 · O'z narxingiz  ← Q | To'lov ekranida faqat hozir ishlaydigan narsa yoziladi.
xato/maslahat   34  | 5 · O'z narxingiz  ← Q | To'lov ekranida karta so'ralmaydi.
xulosa          83  | 5 · O'z narxingiz  ← Q | Narxingiz saqlandi: to'rt qatori va to'lov ekrani matni bilan. Hozirch
sarlavha        55  | A1 · Amaliyot 1 — Pro  | Pullik qulaylik bosilsa, to'lov taklifi ekrani chiqsin.
yashil          71  | A1 · Amaliyot 1 — Pro  | Pullik qulaylik Pro'ni so'raydi; Pro'siz to'lov taklifi ekrani chiqadi
qator           66  | A1 · Amaliyot 1 — Pro  | «To'lovga o'tish» hali ulanmagan — uni keyingi amaliyotda ulaysiz.
sarlavha        40  | A2 · Amaliyot 2 — to'l | Mashq to'lovdan keyin qulaylik ochilsin.
qator          114  | A2 · Amaliyot 2 — to'l | Bugun bitta yo'l tekshirildi: «To'lash (mashq)» dan keyin Pro. Agent «
yashil          54  | A2 · Amaliyot 2 — to'l | Mashq to'lovdan keyin Pro yoqildi va qulaylik ochildi.
yashil          61  | A2 · Amaliyot 2 — to'l | To'lov yo'li bor — Pro yoqilishini tuzatib, qayta tekshiring.
qator           71  | A2 · Amaliyot 2 — to'l | Pro o'z hisobingizda 30 kun turadi — bu mashq: hech kim pul to'lamagan
variant         35  | 8 · Yakuniy savol  ← Q | Sahifadagi «To'lov o'tdi» yozuvidan
variant         34  | 8 · Yakuniy savol  ← Q | Telefonda saqlangan o'z belgisidan
variant         34  | 8 · Yakuniy savol  ← Q | To'lov taklifi ekrani yopilganidan
variant         34  | 8 · Yakuniy savol  ← Q | Qayta so'rab olingan Pro holatidan
to'g'ri izoh    54  | 8 · Yakuniy savol  ← Q | Pro'ni Backend yoqadi — ilova uni qayta so'rab biladi.
xato izohi      46  | 8 · Yakuniy savol  ← Q | Sahifa brauzerda turadi. Pro qayerda yoziladi?
xato izohi      57  | 8 · Yakuniy savol  ← Q | Telefondagi belgi o'zi o'zgarmaydi. Pro qayerda yoziladi?
xato izohi      60  | 8 · Yakuniy savol  ← Q | Ekranni to'lamasdan ham yopsa bo'ladi. Pro qayerda yoziladi?
sarlavha        25  | 10 · Takrorlash  ← QKa | O'zingizni sinab ko'ring.
sarlavha        55  | 11 · Dars yakuni  ← QY | Narxingiz bor — mashq to'lovdan keyin qulaylik ochildi.
sarlavha        52  | 11 · Dars yakuni  ← QY | To'lov yo'li bor — Pro yoqilishini tekshirish qoldi.
sarlavha        50  | 11 · Dars yakuni  ← QY | Narx va to'lov ekrani tayyor — to'lov yo'li qoldi.
sarlavha        49  | 11 · Dars yakuni  ← QY | Narxingiz yozildi — to'lov ekranini qurish qoldi.
sarlavha        35  | 11 · Dars yakuni  ← QY | Narx hali yozilmagan — uyda yozing.
qator           54  | 11 · Dars yakuni  ← QY | Hech kimdan pul so'ramang: bu darsdagi to'lov — mashq.
```
Ballik testlar — variant uzunliklari (o'rtachadan ±15%; ✔ yolg'iz eng uzun emas):
```
3-ekran  lens [40, 37, 32, 34] mean 35.8 maxdev 12% ✔len 37  
8-ekran  lens [35, 34, 34, 34] mean 34.2 maxdev 2% ✔len 34  
```
Arena (12) — ✔ o'rni va variant uzunliklari:
```
 1 ✔A lens [33, 37, 32, 31] maxdev 11%  
 2 ✔B lens [33, 32, 35, 34] maxdev 4%  
 3 ✔C lens [23, 25, 22, 23] maxdev 8%  
 4 ✔D lens [37, 32, 31, 31] maxdev 13%  
 5 ✔A lens [34, 36, 31, 31] maxdev 9%  
 6 ✔B lens [34, 35, 37, 33] maxdev 6%  
 7 ✔C lens [32, 25, 32, 26] maxdev 13%  
 8 ✔D lens [27, 23, 24, 25] maxdev 9%  
 9 ✔A lens [27, 26, 27, 28] maxdev 4%  
10 ✔B lens [18, 18, 23, 23] maxdev 12%  
11 ✔C lens [38, 33, 36, 36] maxdev 8%  
12 ✔D lens [29, 30, 30, 27] maxdev 7%  
arena ✔: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
Savollar so'z soni: 3-ekran — 11 · 8-ekran — 11 · arena — 6–11 (hammasi ≤12). Mentor gaplari: interaktiv ekranlarda (0, 2, 4, 5, A1, A2) — bitta gap; reja (1) — ikki gap; kartochka ekrani — Mentorsiz.
Kafolat va ayb so'zlari («darhol», «darrov», «har doim», «hech qachon», «albatta», «100%», «bir zumda», «kafolat», «sizda emas», «xatongiz emas») — o'quvchi matnida 0 (grep; MD izohlarida faqat taqiq ro'yxati sifatida).
`npm run lint:til` — 0 error, 0 warn.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 447 `m11-03` «Webhook: to'lov Backend'ga qanday yetib keladi» → 448 **`m11-04` «Narxni qanday belgilaysiz?»** (osti «xarajat, raqobat, qiymat → narx va to'lov taklifi ekrani» — reja chap yorlig'i so'zma-so'z) → 449 `m11-05` «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» (yakun qatori). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (1.0, 1.4 aynan); metafora yo'q; bitta vizual — `NarxSahna` (telefon · narx varag'i · Backend tuguni; 2-ekranda xizmat kartalari va Telegram guruhi — o'sha sahnaning holatlari). Ikkinchi misol faqat testda (kitob almashish ilovasi — 3). Keys yo'q.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 5, A1, A2; testlarda javobdan keyingi kichik vizual. «Bosish → matn-karta» yo'q — har bosish xizmat kartasi, telefon, varaq qatori, konvert yoki Backend jadvalini o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: Pro, «Doimiy o'yin», pullik obuna, to'lovchi (1-dars), mashq to'lov, to'lov xabari, test rejim, to'lov raqami (3-dars), Backend, Database, agent, talab, tekshirish (tayanch 2). Yangi — narx, xarajat, raqobat, qiymat, to'lov taklifi ekrani — misoldan keyin (2, 4-ekran).
  Siz-forma; tugmalar ot-shaklda yoki siz-formada («Qator tayyor», «Saqlash», «Bajardim», «Pro yoqildi», «Qatorni oching», «Yo'lni bosib chiqing»); agentga prompt — buyruq shaklida (T-002 istisnosi).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov), to'g'ri javob hech qayerda yolg'iz eng uzun emas; tire, qavs, qo'shtirnoq, ikki nuqta, vergul to'g'ri variantga xos emas (arena 5, 7, 9 shu bo'yicha tuzatildi); dars atamasi («Backend») faqat to'g'rida emas (8-ekran). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda (3 — B, 8 — D).
- [—] Final tartib-mashqi yo'q (PM+PRAKT; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ → — belgilar) · kafolat so'zlari yo'q (grep, O'lchov).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-04`, «Modul 13», A1/A2 — o'quvchiga «Amaliyot 1/2»; paywall — faqat kartochka izohida bir marta; modul raqami — LMS raqami). «KOD» ro'yxati 14 band, REPO 5 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (atamalar misoldan keyin; sarlavhalarda yangi atama yo'q — «to'lov taklifi ekrani» birinchi marta A1 sarlavhasida, 4-ekrandan keyin) · T-014/T-015 (A-5: narx/xarajat, qiymat, obuna, test/tekshiruv, xabar, hisob) · T-016 (metafora yo'q) · T-020 · T-029/T-047 ·
  T-035 (o'quvchi izohida × ÷ yo'q; hisob — maketda; menyu yorlig'idagi «→» — TAYANCHGA SAVOL 19) · T-038 (keyingi dars faqat yakun qatorida; 5, 6-darslar — O'qituvchi eslatmasida) · T-039 (mahsulotingiz, narx varag'ingiz — o'quvchida bor) · T-042 (ta'riflar dars bo'yi bir xil — TAYANCHGA SAVOL 2) · T-043 («Mentor misolida», «Bu misolda») ·
  T-045 (test rejim — real to'lovning nusxasi emas; Pro avtomatik yangilanmaydi) · T-064 (dars ekrani «ekran» deb atalmaydi — «narx varag'ingiz»; 2-ekran sarlavhasi hook savolining so'zi bilan) · P-001 · P-002 · P-008 (≤3 blok) · P-012 (testlar 3, 8 — ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 · P-036 · P-046 (5, A2, 11) · P-052 · P-055 · P-062 · P-064 · P-067 ·
  S-001 (≤12 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 (bashoratlar bir o'lchovda, o'sish tartibida) · S-019 · S-020 · S-026 · S-027 · §144/§145 (arena va kartochkalar bir xil savolsiz) · PM-005 (gibrid) · PM-018 · PM-021 · PM-027 · J-026 · SABOQ 1–55 (E 40–55).
- [ ] GATE M — foydalanuvchi tasdig'i kutilmoqda; «qur» dan oldin ⛔: Expo'da brauzerdan qaytish va `GET /men` (Shubhali 1), Render o'z manziliga so'rov (2), 90 daqiqa (3), `kun - 7` turi (4), tayanch 1.5 ikki muammosi Mentor repo'sida (7).
