# 14-Modul (kod: `src/12-Modull`) · 10-dars (PM) «Birinchi buyurtmani qayerdan topasiz?» — MD v3

Fayl: `src/12-Modull/PmFreelanceLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-10` · **12 ekran** (keyssiz PM shakli — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natija yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p maydonli ish — bittadan karta (E 53) · yorliq input ichida (E 43) · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror) ·
odamlar real ko'rinishda, ismsiz (D 36) · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 8-ekran — **D** (`3`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 475–477, grep 08.10.2026, DE-205): `m12-09` «Video-portfolio: 3 daqiqada o'zingiz va mahsulot» → **`m12-10` «Birinchi buyurtmani qayerdan topasiz?»** (osti: «frilans va stajirovka: reja va ikki xat», `type: 'PM'`, `comp` hali yo'q) → `m12-11` «Qaysi xalqaro dasturga ariza berasiz?». <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn: buyurtma rejasi (kim · nima · qachon) va ikki kompaniyaga xat; mustaqil ish majburiy (7-ekran). **Keyssiz** (tayanch 5). **Kod ekrani yo'q** (tayanch 4: QMustaqil). **REPO yo'q** (tayanch 3: `m14-dars-10-done` = `07-done`). <!-- TAXMIN T18 -->
⚠️ **Real odamlar va o'smir xavfsizligi bilan ishlaydigan dars** (TAQIQLAR 1, 3; sinf 9, 18): darsda hech kimga yozilmaydi va hech qayerda profil ochilmaydi — reja va xatlar yoziladi, xat yuborish uyda, ixtiyoriy, ota-ona bilan; pul va kelishuv — ota-ona orqali;
Upwork yosh chegarasining rasmiy matni tekshirilmagan — **aniq yosh da'vo qilinmaydi**: tayanch iborasi («odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing») bir marta, testlarda va kartochkalarda son yo'q. <!-- TAXMIN T13 -->
⚠️ Modul raqami o'quvchi matnida — LMS raqami («7-Modulda», «12-Modulda»); kod raqami faqat fayl yo'lida. Dars raqami o'quvchi matnida yo'q. Keyingi dars (xalqaro dastur), olti oylik reja, Demo Day — o'quvchi matnida va'da qilinmaydi (T-038; tayanch 9.13).
Manba: `00-MODUL-TAYANCH.md` (**1.10 — Upwork iborasi, lokal buyurtma rejasi, ikki xat — AYNAN** · 1.0 · 1.9 — `pm-m12d9-video` · 1.14 — sonlar · 2 — frilans, buyurtma, buyurtmachi, stajirovka, so'rov · 3 · 4 · 6 — Upwork tekshirilmagan · 7 — 18 sinf · 8 — `pm-m12d10-ish` · 9 — to'lqin kelishuvlari) ·
`00-TAQIQLAR.md` (0, 1, 2, 3, 4, 5, 6, 7) · `00-NOMLAR.md` · `00-MANBA.md` (1 — dastur 10-qator · 4 — o'tilgan atamalar · 5 — Upwork 403) · `qaror-0.json` (ISH — T13) · `MD_TOPSHIRIQ_2.md` (10-qator va 10-band) ·
13-Modul tayanchi (1.9 — real odamga yozma xabar) va `00-TAQIQLAR.md` 3 · 12-Modul tayanchi 1.6 (`XAVFSIZLIK` olti band va «Uchrashuv taklifi kelsa — faqat kattalar bilan.») ·
namunalar: 13-Modul `09-PmPayCheck-v3.md` + `09-FILTR.md` (real odamga xabar, bosimsizlik, ota-ona, bir marta yozish) · pilotlar `01-PmInvestorPitch-v3.md`, `07-PmDemoTest-v3.md` va `NN-OZ-AUDIT.md` · `QURUVCHI_SABOQ.md` E 40–55.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Birinchi buyurtma rejasi + 2 kompaniyaga xat»; tayanch 1.10, 4): o'quvchi o'zi uchun **birinchi buyurtma rejasini** (kim · nima · qachon) va **ikki kompaniyaga xatni** (kimman · nima qurdim · nima so'rayman) yozadi. <!-- TAXMIN T13 -->
   Bittadan karta (E 53): reja — uch karta, har xat — bitta karta. Saqlanadi `pm-m12d10-ish` (12-dars o'qiydi — tayanch 8). Xat darsda yuborilmaydi: yuborish — uyda, ixtiyoriy, ota-ona bilan (tayanch 1.10). <!-- TAXMIN T13 -->
   Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab — sinf 6, E 54): reja va ikki xat · reja bor, xatlar to'liq emas · xat bor, reja to'liq emas · reja qisman, xat yo'q · hech narsa yozilmagan. Belgi ✓ va nishonlar — faqat qilingan ishga.
   Faqat shu A-bo'limda (o'quvchi matnida yo'q — T-038): 12-dars `pm-m12d10-ish` ni olti oylik rejaning «ish» yo'nalishiga o'qiydi (tayanch 1.12); 11-dars — xalqaro dastur.
2. **Bugungi asosiy fikr** (P-013; dars ichidagi o'q — yakunda KO'RSATILMAYDI, SABOQ E 50): Birinchi buyurtma tanish doiradan, ota-ona orqali rejalanadi; kompaniyaga esa alohida hurmatli xat yoziladi. (108)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4):**
   - 2 va 12-Modul: **sayt** · **lending** (mahsulot sahifasi — 12-Modul) · 7-Modul: **Telegram bot** (AvtoPizza boti — 10-Modul tayanchi 137-qator ro'yxati) · 11–13-Modul: **«Maydon Jamoa»**, **tashkilotchi**, **o'yinchi**, **agent**.
   - 12-Modul 6-darsi: **olti bandli xavfsizlik ro'yxati** (`XAVFSIZLIK`) va uning ostidagi qator «Uchrashuv taklifi kelsa — faqat kattalar bilan.» — bu darsda shu qator so'zma-so'z (T-042) · 13-Modul 6, 9-darslari: **tanish** ↔ **notanish**, xabar «bir marta, har odamga alohida», «ota-ona xabardor».
   - 14-Modul: **so'rov** — «bitta aniq iltimos: tanishtirish · maslahat · sinash joyi» (tayanch 2; bu darsda xatdagi so'rov — stajirovka yoki maslahat) · **video-portfolio** (o'zi va mahsuloti haqida 3 daqiqalik video) · «51 foydalanuvchi» (Mentor pitchining Raqamlar bo'lagi — tayanch 1.1, 1.14).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):** <!-- TAXMIN T19 -->
   - **frilans · buyurtmachi** — «Buyurtma bilan ishlash frilans deyiladi; ish beradigan odam yoki kompaniya — buyurtmachi.» (tayanch 2 aynan; 2-ekran, 2-tugmadan keyin `QIzoh` — tanish doiradagi odamga ish uchib borgandan keyin). «buyurtma» — dars nomidagi kundalik so'z, alohida ta'rifsiz.
   - **stajirovka** — «Kompaniyada o'qib ishlash davri stajirovka deyiladi» (tayanch 2 aynan; 2-ekran, 3-tugmadan keyin `QIzoh`).
   - **tanish doira** (oddiy so'z, TAQIQLAR 1 iborasi) — sizni va ota-onangizni taniydigan odamlar: tanish do'kon, maktab, to'garak (2-ekran kartasidagi uch rol). Juftligi — «notanish» (13-Modul so'zi).
   - **yosh sharti** (oddiy so'z) — xalqaro saytda kim ishlay olishi haqidagi shart; o'zi saytdan o'qiladi, son darsda bir marta va «odatda» bilan (2-ekran `QIzoh`). <!-- TAXMIN T13 -->
   - **buyurtma rejasi** (oddiy so'z) — uch qator: kim · nima · qachon (4-ekran xulosasi; tayanch 1.10). **xat** (oddiy so'z) — kompaniyaga yoziladigan xat, uch qism: kimman · nima qurdim · nima so'rayman (6-ekran xulosasi). <!-- TAXMIN T13 -->
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«buyurtma»** — bu darsda faqat bajariladigan ish (7-Moduldagi bot orqali ovqat buyurtmasi ma'nosi bu darsda yo'q) · **«buyurtmachi»** — ish beradigan odam yoki kompaniya. «zakaz», «klient», «mijoz» (bu ma'noda) — yo'q.
   - **«stajirovka»** — «amaliyot» emas (amaliyot — dars ichidagi blok), «intern» emas. **«xat»** — kompaniyaga yoziladigan xat; «xabar», «pochta xati», «maktub» — ishlatilmaydi (13-Modulda «xabar» — chat xabari).
   - **«so'rov»** — xatdagi bitta aniq iltimos (1-darsdagi ma'no); **«Yordam»** — faqat 7-ekrandagi tugma nomi. **«reja»** — faqat «buyurtma rejasi»; olti oylik reja bu darsda yo'q.
   - **«xalqaro sayt»** — Upwork kabi buyurtma topiladigan sayt; «xalqaro dastur» — bu darsda yo'q (faqat yakundagi «Keyingi dars» qatorida nom). **«profil»** — saytdagi o'z sahifangiz (11, 12-Modul MD larida ishlatilgan kundalik so'z).
   - **«kompaniya turi»** — kompaniyaning nima qilishi («mobil ilova qiladigan kompaniya»), nomi emas — kalit maydoni (tayanch 8); real kompaniya nomi darsda yozilmaydi, uyda tanlanadi.
   - **«jamoa»** — prozada ishlatilmaydi (tayanch 2: «Maydon Jamoa» — nom; Jamoa — 1-darsdagi pitch bo'lagi). Mentor xatida futbol ma'nosi o'rniga «o'yinchi yig'iladi». **«sinov»** — yo'q. **«tekshiruv»** — faqat test eyebrow'ida (kurs naqshi).
   - **Ishlatilmaydi:** zakaz, klient, intern, rezyume, CV, vakansiya, maosh, investitsiya (faqat «pul so'ralmaydi» tekshiruvida), frilanser (prozada), «freelance», «portfel», «spam» (faqat 8-ekran xato izohida bir marta — o'smir kundalik so'zi), «albatta», «darrov», «kafolat».
6. **Mentor misoli — «Maydon Jamoa» egasining birinchi ish yo'li (bitta manba `MENTOR_ISH`, 180-qonun; ⚠️ tayanchda faqat qoida bor, Mentor matni yo'q — men yozdim, TAYANCHGA SAVOL 1, 2; o'quvchiga «Mentor misolida»):** <!-- TAXMIN T13 -->

| Qism | Matn (o'quvchi ko'radi) | Tayanch |
|---|---|---|
| Yo'llar · Xalqaro sayt | «Upwork kabi» · holat «uyda: shartini ota-ona bilan o'qiydi» | 1.10 (ibora), 6 |
| Yo'llar · Tanish doira | «tanish do'kon · maktab · to'garak» · holat «bugun: buyurtma rejasi» | 1.10 |
| Yo'llar · Kompaniya | «stajirovka yoki maslahat» · holat «bugun: ikki xat» | 1.10 |
| Buyurtma · Kim | «maktabdagi futbol to'garagining murabbiyi» | TS 1 (rol, ismsiz; misol-ip — futbol) |
| Buyurtma · Nima | «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi» | TS 1 (kursda qurilgan narsa — lending) |
| Buyurtma · Qachon | «shu hafta, mashg'ulotdan keyin — ota-onam bilan» | TS 1 (pul va kelishuv — ota-ona orqali) |
| 1-xat · kompaniya turi · so'rov | «mobil ilova qiladigan kompaniya» · stajirovka | TS 2 |
| 2-xat · kompaniya turi · so'rov | «sayt qiladigan kompaniya» · maslahat | TS 2 |

   - **Mentor xati (`MENTOR_XAT`, ikkala xatda bir xil boshi va oxiri; T-008 — olam ichidagi matn, «men» shaklida):**
     boshi «Assalomu alaykum!» · **Kimman:** «Men maktab o'quvchisiman, dasturlashni o'rganyapman.» · **Nima qurdim:** «Agent bilan "Maydon Jamoa" ilovasini qurdim: unda mahalladagi mini-futbolga o'yinchi yig'iladi. Hozir 51 foydalanuvchi bor.» ·
     **Nima so'rayman** (1-xat, stajirovka): «Kompaniyangizda o'quvchilar uchun stajirovka bormi? Bo'lsa, qanday qatnashsam bo'ladi?» · (2-xat, maslahat): «Mahsulotimni ko'rib, bitta maslahat bera olasizmi: keyin nimani o'rganishim kerak?» · oxiri «Hurmat bilan,» + kulrang «ism — xohlasangiz, uyda».
     Ikki so'rov gapi — 7-ekran «Stajirovka» / «Maslahat» tugmalari qo'yadigan gaplar ham shu (`SOROV_GAP`, bitta manba — P-063).
   - Mentor xatida ism, telefon, manzil, maktab raqami, video havolasi yo'q (sinf 9); «Agent bilan» — 1-darsdagi Jamoa bo'lagi bilan bir (rost rol, sinf 12). Kompaniya nomi o'ylab topilmaydi — faqat turi (sinf 4, TAQIQLAR 0).
   - Mentor misoli — namuna, majburiy shakl emas (sinf 4): o'quvchining buyurtmachisi, ishi, kompaniya turi va so'rovi — o'zining.
7. **Sonlar (faqat tayanch 1.14):** 51 foydalanuvchi (Mentor xatida) · «8 / 10» (namuna o'yin, telefon maketida) · reja — 3 qator, xat — 3 qism, xatlar — 2 (kurs qolipi). «18» — faqat tayanch iborasida, bir marta (2-ekran `QIzoh`), «odatda» bilan. Boshqa son, narx, so'm va sanalar — yo'q. <!-- TAXMIN T13 -->
   Ikkinchi misol (testlar, P-002): «tanish do'kon», «3D o'yin» (kursda qurilmagan ish) — o'smir olami, Mentor sonlari emas.
8. **Keys yo'q** (tayanch 5, Qaror-0 T18). Upwork — keys emas, xalqaro sayt misoli (tayanch 1.10); faqat nomi va yosh sharti haqidagi tayanch iborasi, boshqa fakt (narx, komissiya, sayt tugmalari) yo'q (P-028). <!-- TAXMIN T18 -->
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. Odamlar, bino, konvert, brauzer, telefon — chizilgan (CSS/SVG), logotip yo'q. «Upwork» nomi — brauzer maketida o'z rangida (rang — ⛔ «qur»da rasmiy brend sahifasidan; topilmasa neytral `ink` — TAYANCHGA SAVOL 9).
10. **Real odamlar va pul chegarasi (sinf 9, 17, 18; TAQIQLAR 1, 3):**
    - darsda hech kimga yozilmaydi, hech qanday saytda profil ochilmaydi va ochib ko'rsatilmaydi; xalqaro saytda profil faqat o'z nomidan — ota-ona yoki boshqa odam nomidan ochilmaydi (TAQIQLAR 1);
    - birinchi buyurtma — tanish doira; pul va kelishuv — ota-ona orqali; narx, so'm darsda aytilmaydi va yozdirilmaydi (rejaga ish yoziladi);
    - xat — bitta kompaniyaga bitta, hurmatli, shoshiltirishsiz; javob kelmasa yoki «yo'q» desa — qayta yozilmaydi; yuborish — uyda, ixtiyoriy, ota-ona biladigan pochtadan; «Uchrashuv taklifi kelsa — faqat kattalar bilan.» (12-Modul qatori aynan);
    - xatda va kalitda: ism (xatda — ixtiyoriy, uyda qo'shiladi), telefon, manzil, maktab raqami, akkaunt nomi, kompaniya xodimi ismi, video havolasi — yo'q; kalitda xat matni ham yo'q (tayanch 8 sxemasi; TAYANCHGA SAVOL 3);
    - sinfda kim nechta xat yozgani, kimga yozmoqchi ekani so'ralmaydi va sanalmaydi; Mentor ekranida — faqat saqlash signallari (matn, kompaniya turi, son yo'q); o'quvchi Mentor nomidan yozmaydi («Mentorim tavsiya qildi» yo'q).
11. **Trek (sinf 11):** ikkala trekka bitta matn — «sayt, bot va o'z mahsulotingiz»; buyurtma «Nima» kartasida tugmalar «Lending» · «Telegram bot» — kursda ikkala trek qurgan narsalar. Trek kaliti o'qilmaydi.
12. **Kod mexanikasi:** kod ekrani yo'q. Darsning o'z mexanikalari: uch yo'l kartasi (2) · reja kataklari (4) · xat konverti (6) · bittadan karta: reja (3 karta) va xat (2 karta) (7). 13-Moduldagi chat-telefon va juftlik tekshiruvi takrorlanmaydi.
13. **Vaqt taqsimoti — 90 daqiqa (sinf 1 — reja, o'lchov emas):** kirish va reja (0, 1) ≈ 5 · uch yo'l (2) ≈ 10 · 1-savol (3) ≈ 3 · buyurtma rejasi (4) ≈ 8 · 2-savol (5) ≈ 3 · xat (6) ≈ 9 ·
    buyurtma va xatlar (7) ≈ 32 (reja ≈ 10 · 1-xat ≈ 12 · 2-xat ≈ 10) · yakuniy savol (8) ≈ 3 · podium, kartochkalar, arena, yakun (9–11) ≈ 14 → jami ≈ 87; 3 daqiqa zaxira.
    **Ulgurmasangiz:** 7-ekran — yozilgani saqlanadi, qolgan karta yoki 2-xat — uyga vazifa ①; yakun sarlavhasi «hali tugamagan» (E 54) · jonli darsda Mentor 7-ekranni `optionalLive` bilan o'tkazadi · arena vaqti qisqarsa — kartochkalar uyda.
    Tashqi kutish yo'q (repo, build, xizmat, javob kutilmaydi). ⛔ Taqsimot — reja: «qur» pilotida 12–15 o'quvchi bilan taymer (ayniqsa 7-ekran — 32 daqiqa); «sig'adi» deyilmaydi.
14. **Saqlash kalitlari (tayanch 8; sinf 3):**
    - **o'qiydi:** `pm-m12d9-video` — `bolaklar.kim` (7-ekran 1-xat «Kimman» maydoni), `bolaklar.nima` («Nima qurdim»), `bor` (`true` bo'lsa — kulrang qator «Ota-onangiz rozi bo'lsa, video havolasini uyda qo'shasiz.»). Havola kalitda yo'q (tayanch 8). Kalit yo'q yoki maydon bo'sh — maydon bo'sh, placeholder bilan.
    - **yozadi:** `pm-m12d10-ish` = `{ buyurtma: { kim, nima, qachon }, xatlar: [{ kompaniyaTuri, soroq }], yuborildi: n | null, savedAt }` (tayanch 8 aynan). Maydonlar shartnomasi:
      `buyurtma.kim` — rol (≤40, ismsiz) yoki `null` (karta saqlanmagan) · `buyurtma.nima` — ish (≤80) yoki `null` · `buyurtma.qachon` — gaplashish kuni (≤40) yoki `null` ·
      `xatlar` — saqlangan xatlar (0–2; tartib: 1-xat, 2-xat): `kompaniyaTuri` — kompaniya nima qilishi (≤40, nomi emas), `soroq` — `'stajirovka'` | `'maslahat'` (TAYANCHGA SAVOL 4) ·
      `yuborildi` — bu darsda doim `null` (yuborish uyda; TAYANCHGA SAVOL 5) · `savedAt` — har «Saqlash»da. Har «Saqlash» faqat o'z maydonini yozadi (birlashtiriladi). Xat matni, ism, telefon, kompaniya nomi, xodim ismi, havola — yozilmaydi. Boshqa darsning kalitiga yozmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0, 1.9, 1.10):** «Maydon Jamoa» hakamlar oldiga tayyorlanmoqda; o'quvchi o'zi va mahsuloti haqida 3 daqiqalik video-portfolio yozdi → **bugun: shu ishi bilan birinchi ish yo'li** — tanish doiradan buyurtma rejasi va kompaniyaga ikki xat (yangi funksiya yo'q, repo'ga tegilmaydi).
- **Dars ipi:** 0 — kursda qurgan narsangiz kimgadir kerak bo'lsa, birinchi buyurtmani qayerdan topasiz → 2 — uch yo'l: xalqaro sayt (yosh sharti), tanish doira (atamalar «frilans», «buyurtmachi»), kompaniya («stajirovka») → 3 — test: sinfdosh Upwork'da nima qiladi →
  4 — Mentor rejasi: kim, nima, qachon; pul va kelishuv — ota-ona orqali → 5 — test: qaysi reja to'g'ri tuzilgan → 6 — Mentor xati: kimman, nima qurdim, nima so'rayman; bitta kompaniyaga bitta → 7 — o'z rejangiz va ikki xat → 8 — yakuniy: javob kelmasa → podium → kartochkalar → yakun.
- **Bitta vizual — «Buyurtma va xatlar» varag'i (`IshVaraq`, dars bo'yi; 163/180; bitta manba `MENTOR_ISH` + `MENTOR_XAT` + `SOROV_GAP` + o'quvchi ma'lumoti `pm-m12d10-ish`, `pm-m12d9-video`):**
  - **chapda — telefon** (≈170×272, barqaror): «Maydon Jamoa» (nom o'z yashil rangida, 11-Modul; logotip yo'q) — «O'yin» ekrani «Shanba, 18:00 · Mahalla maydoni · 8 / 10». Bu — «nima qurdim» (portfolio); 4-ekranda telefon ostida kichik brauzer kartasi (lending) paydo bo'ladi.
  - **o'ngda — varaq** «Mentor misoli · Buyurtma va xatlar» (o'quvchida «Buyurtma va xatlarim»), uch qism ustma-ust:
    1) **Yo'llar** — uch karta: «Xalqaro sayt» (kichik brauzer: manzil «upwork.com», nom «Upwork», qulf belgisi va yorliq «yosh sharti») · «Tanish doira» (uch real ko'rinishdagi qiyofa, rol yorliqlari «tanish do'kon» · «maktab» · «to'garak», ismsiz) · «Kompaniya» (chizilgan bino, konvert); har karta ostida holat yorlig'i.
    2) **Buyurtma** — uch katak: Kim · Nima · Qachon; ostida qator «Pul va kelishuv — ota-ona orqali.»
    3) **Xatlar** — ikki konvert-karta: «1-xat · {kompaniya turi}» · «2-xat · …»; ochilganda ichida «Assalomu alaykum!», uch qator (Kimman · Nima qurdim · Nima so'rayman), «Hurmat bilan,»; yopilganda ustida yorliq «yuborish — uyda».
  - Har ekranda bitta qism joriy (accent chegara), qolganlari ixcham kulrang qator (bo'sh katak — uzuq chiziq, U-041). Ishlatiladi: 0 (telefon + uch nomsiz yo'l chizig'i) · 1 (varaq skeleti) · 2 (Yo'llar) · 3, 5, 8 (javobdan keyin kichik bo'lak) · 4 (Buyurtma) · 6 (Xatlar) · 7 (o'quvchi varag'i).
  - `prefers-reduced-motion` da uchish va to'lqin yo'q — yakuniy holat birdan qo'yiladi. 393 kenglikda telefon varaq ustida, o'lchami kichraymaydi; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q.
- **Bashorat (SABOQ 11, 25, E 42):** tanlangach yo'qolmaydi — ixcham qator natijagacha turadi; natija — yashil xulosa qutisining birinchi kichik qatori: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»; `QIzoh` — o'sha qutining oxirgi kichik qatori.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa uchadi (sayt kartasi tanish odamga, konvert bino tomondan Xatlar qismiga, javob katakka, telefon ekrani xatga) · yangi qator ~1 s yashil yonadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Birinchi buyurtmani qayerdan topasiz?** (37) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Kursda sayt, bot va o'z mahsulotingizni qurdingiz — shunday ishni boshqa odamga ham qilib berish mumkin.
- Maket (chap; `IshVaraq` kirish holati): telefon «Maydon Jamoa» (o'yin ekrani), ustida kulrang yorliq «Mentor misoli»; telefondan o'ngga uchta nomsiz kulrang yo'l chizig'i ketadi (oxirlari bo'sh — 2-ekran kashfiyoti, P-036). ≤ 3 blok: maket · variantlar · javob.
- Variantlar (radio, o'ng; bir uzunlikda — P-016):
  - Xalqaro saytda, masalan Upwork'da (33)
  - Tanish do'kon yoki to'garakdan (30)
  - Biror kompaniyaga xat yozib (27)
- Javob — «Xalqaro sayt»: **Qiziq fikr!** Bunday saytlarda yosh sharti bor — uni hozir birga ko'ramiz. (72)
- Javob — «Tanish do'kon»: **Aynan!** Sizni va ota-onangizni taniydigan odam ishingizni ko'ra oladi — bugun shu yo'lga reja yozasiz. (101)
- Javob — «Kompaniya»: **Qiziq fikr!** Kompaniyaga ham yozish mumkin — bugun bunday xatni ham tayyorlaysiz. (80)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant ixcham qator bo'lib qoladi; telefondan tanlangan yo'l chizig'i accent bilan yonadi va oxirida nomsiz belgi chiqadi: brauzer oynasi · uch odam qiyofasi · bino shakli. Qolgan ikki chiziq kulrang qoladi (javob ochilmaydi).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — uch yo'l keyingi ekranda birma-bir ochiladi. «Qiziq fikr!» — xato degani emas: xalqaro sayt ham, kompaniya ham — yo'l; bugun ulardan qaysi biri qanday shart bilan ekanini ko'rasiz.
  Sinfdan so'rang: kursda qurgan narsangizdan kim foydalanishi mumkin? (javoblar og'zaki, ism aytilmaydi)
✎ Hook — o'quvchining o'z ishi (sayt, bot, mahsulot) va o'z savoli (P-016). «frilans», «stajirovka», «buyurtmachi» hookda yo'q — 2-ekranda tug'iladi (T-011). Payoff hech bir tanlovni yolg'onga chiqarmaydi (KORPUS §119): «Qiziq fikr!» javoblari o'sha yo'lni ham ochiq qoldiradi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun birinchi buyurtma rejasi va ikki xat yozasiz.** (51) <!-- TAXMIN T13 -->
- Mentor: Xatlarni darsda yozasiz, yuborish esa — uyda, ota-onangiz bilan. <!-- TAXMIN T13 -->
- Chap — «Dars oxirida» + kulrang yorliq **frilans va stajirovka: reja va ikki xat** (App.jsx 476 osti so'zma-so'z — P-015) <!-- TAXMIN T20 -->
  + vizual: `IshVaraq` skeleti o'zi yuradi (DE-200) — varaq sarlavhasi «Buyurtma va xatlar», uch qism nomi birma-bir yoziladi: Yo'llar · Buyurtma · Xatlar; kataklar va konvertlar uzuq (bo'sh), chapda telefon. Matnli javob yo'q — 2-ekran kashfiyotini ochmaydi (P-036).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Birinchi buyurtma qayerdan chiqishi mumkinligini bilib olasiz · `uch yo'l`
  - 02 · Buyurtma rejasini tuzishni o'rganasiz · `kim · nima · qachon`
  - 03 · Kompaniyaga hurmatli xat yozishni o'rganasiz · `xat`
  - 04 · O'zingiz uchun reja va ikki xat yozasiz · `buyurtma va xatlar`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- O'qituvchi eslatmasi: Bugun darsda hech kimga yozilmaydi va hech qayerda ro'yxatdan o'tilmaydi: reja va xatlar yoziladi, yuborish — uyda, ixtiyoriy, ota-ona bilan. Kim nechta xat yozgani so'ralmaydi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «frilans», «stajirovka» faqat kulrang yorliqda (App.jsx osti so'zma-so'z) va 2-ekranda ta'rif bilan tug'iladi. Mentor gapi — natija chegarasi (darsda yozish, uyda yuborish), sarlavhani takrorlamaydi.

## 2 · Uch yo'l  ← QTushuncha (markaziy; ketma-ket 3 tugma)
- Eyebrow: Tushuncha · uch yo'l
- Sarlavha: **Birinchi buyurtma qayerdan chiqishi mumkin?** (43) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Tugmalarni birma-bir bosing va har yo'lning shartiga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida «Avval o'zingiz belgilab ko'ring», Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; S-015 — bitta o'lchov: son, o'sish tartibida): **Mentor bugun nechta yo'lni rejalaydi?** · Bitta · Ikkita · Uchta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi. <!-- TAXMIN T13 -->
- Vizual (≤ 3 blok: telefon · varaq · tugmalar qatori): **chapda** telefon «Maydon Jamoa» · **o'ngda** varaq «Mentor misoli · Buyurtma va xatlar» — **Yo'llar** qismi joriy: uchta bo'sh karta (nomsiz, uzuq chegara); Buyurtma va Xatlar — ixcham kulrang qator.
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Xalqaro sayt · 2 Tanish doira · 3 Kompaniya
- **Harakat → Vizual o'zgarish:**
  1. «Xalqaro sayt» → 1-karta ochiladi: kichik brauzer maketi — manzil qatorida «upwork.com», sahifada nom «Upwork» (o'z rangida, logotipsiz) va kulrang chiziqlar; brauzer ustiga qulf belgisi tushadi, yorliq «yosh sharti»;
     karta ostida kulrang qator: Profil faqat o'z nomingizdan — ota-ona yoki boshqa odam nomidan ochilmaydi. (75) · karta holati — kulrang yorliq «uyda, ota-ona bilan». <!-- TAXMIN T13 -->
     `QIzoh`: Upwork kabi saytlarda yosh sharti bor: odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing. (105) <!-- TAXMIN T13 -->
  2. «Tanish doira» → 2-karta ochiladi: uch real ko'rinishdagi qiyofa navbat bilan chiqadi, ismsiz, rol yorliqlari «tanish do'kon» · «maktab» · «to'garak»; telefondagi «Maydon Jamoa» dan kichik sayt kartasi ajralib, «to'garak» qiyofasiga uchadi;
     karta holati — accent yorliq «bugun: buyurtma rejasi». <!-- TAXMIN T13 -->
     `QIzoh`: Buyurtma bilan ishlash frilans deyiladi; ish beradigan odam yoki kompaniya — buyurtmachi. (89) <!-- TAXMIN T19 -->
  3. «Kompaniya» → 3-karta ochiladi: chizilgan bino shakli, undan konvert chiqib varaqning **Xatlar** qismiga uchadi va o'sha qismda «1-xat» konverti uzuq chegarada paydo bo'ladi; karta yorlig'i «stajirovka yoki maslahat» · holat — accent «bugun: ikki xat».
     `QIzoh`: Kompaniyada o'qib ishlash davri stajirovka deyiladi — uni xat bilan so'raysiz. (78) <!-- TAXMIN T19 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkita».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing va yo'l kartasiga qarang. (49)
- Xulosa: Bu misolda bugun ikki yo'l rejalanadi: tanish doiradan buyurtma va kompaniyaga xat. (83) <!-- TAXMIN T13 -->
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, varaq butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: Upwork — xalqaro saytga misol, reklama emas. Uning rasmiy shartlari bu darsda tekshirilmagan: «odatda 18 yoshdan» — shuning uchun «saytning o'zidan o'qing». Sinfda profil ochilmaydi va sayt ochib ko'rsatilmaydi. <!-- TAXMIN T13 -->
  Tanish doira — o'quvchini va ota-onasini taniydigan odamlar: tanish do'kon, maktab, to'garak. Notanish odamga buyurtma so'rab yozilmaydi; uchrashuv — faqat kattalar bilan.
  Sinfdan so'rang: tanishlaringiz orasida kimga sayt yoki bot kerak bo'lishi mumkin? (javoblar og'zaki, ism va manzil aytilmaydi)
✎ Uchala atama (frilans, buyurtmachi, stajirovka) — misoldan keyin, `QIzoh` da bir marta (T-011, PM-030). Yo'llar «yaxshi/yomon» deb baholanmaydi: xalqaro sayt — shart bilan, uyda; tanish doira va kompaniya — bugun.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — sinfdosh, P-002)
- Eyebrow: Tekshiruv · xalqaro sayt (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Sinfdoshingiz Upwork'da ishlamoqchi. U avval nima qiladi?** <!-- TAXMIN T13 -->
  - A — Akasining nomi bilan profil ochib qo'yadi (41)
  - B — Ota-onasiga aytmasdan o'zi profil ochadi (40)
  - ✔ C — Shartini ota-onasi bilan saytdan o'qiydi (40)
  - D — Shartni o'qimay, profilni to'ldira boshlaydi (44)
- To'g'ri izohi: Yosh sharti saytning o'zidan, ota-ona bilan o'qiladi. (53)
- Xato izohlari (≤60):
  - A: Bu profil kimniki bo'lib qoladi — uning o'zinikimi? (51)
  - B: Bu haqda ota-onasi bilishi kerak emasmi? (40)
  - D: Shartni o'qimasa, unga mosligini qayerdan biladi? (49)
  - (umumiy) Xalqaro sayt kartasida qaysi shartlar bor edi? (46)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): varaqning «Xalqaro sayt» kartasi ixcham — qulf, yorliqlar «shartini saytdan o'qing» · «ota-ona bilan».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Rules First! — birinchi urinishda to'g'ri.
- Izoh (MD): uch distraktor uch turkumda (S-004, sinf 8): A — boshqa odam nomidan profil (2-ekran kulrang qatori; TAQIQLAR 1) · B — ota-onasiz (2-ekran `QIzoh`) · D — shart o'qilmagan (2-ekran `QIzoh`). C — ikkala qoida birga.
  «profil» A, B, D da; «ota-ona» B, C da; «shart» C, D da — kalit so'z faqat to'g'rida emas. Testda yosh soni yo'q — savol harakatni so'raydi, yoshni emas (TAQIQLAR 1: aniq yosh da'vo qilinmaydi). Hayotda ham A, B, D — xavfli yo'l (rost bo'lib qolmaydi).

## 4 · Buyurtma rejasi  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · buyurtma rejasi
- Sarlavha: **Birinchi buyurtma rejasida nima yoziladi?** (41)
- Mentor: Tugmalarni birma-bir bosing va Mentor rejasi qanday to'lishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: ish qanchalik tanish, tanishdan notanishga): **Mentor buyurtmaga qanday ish tanlaydi?** · Kursda qurgan ishiga o'xshash · Qisman o'rgangan boshqa ish · Hali umuman qilmagan ish — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi. <!-- TAXMIN T13 -->
- Vizual (≤ 3 blok): **chapda** telefon «Maydon Jamoa» · **o'ngda** varaq — **Buyurtma** qismi joriy: uch bo'sh katak «Kim · Nima · Qachon»; Yo'llar — ixcham qator («Tanish doira» kartasi accent), Xatlar — ixcham kulrang.
- Tugmalar (ixcham, bir qatorda): 1 Kim · 2 Nima · 3 Qachon
- **Harakat → Vizual o'zgarish:**
  1. «Kim» → «Kim» katagiga sirg'alib yoziladi: «maktabdagi futbol to'garagining murabbiyi»; katak yonida real ko'rinishdagi qiyofa (rol yorlig'i, ismsiz), ustida kulrang belgi «tanish».
     `QIzoh`: Rejada ism emas, rol yoziladi: tanish do'kon, maktab yoki to'garak. (67)
  2. «Nima» → telefon ostida kichik brauzer kartasi «Maydon Jamoa» lendingi paydo bo'ladi; uning nusxasi «Nima» katagiga uchib, sarlavhasi «Futbol to'garagi» ga almashadi; katakda: «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi».
     `QIzoh`: Bu darsda birinchi buyurtma — kursda qurganingizga o'xshash ish: lending yoki bot. (82) <!-- TAXMIN T13 -->
  3. «Qachon» → «Qachon» katagiga: «shu hafta, mashg'ulotdan keyin — ota-onam bilan»; murabbiy qiyofasi yoniga ikkinchi qiyofa qo'shiladi (yorliq «ota-ona»); katak ostidagi qator «Pul va kelishuv — ota-ona orqali.» accent bilan bir lahza ajraladi.
     `QIzoh`: Qachon — aniq kun; pul va kelishuv esa ota-ona orqali bo'ladi. (62) <!-- TAXMIN T13 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: kursda qurgan ishiga o'xshash».
  Ipucha (40 s): Yoqilgan tugmani bosing va reja katagiga qarang. (48)
- Xulosa: Bu darsda buyurtma rejasi uch qatordan iborat: kim, nima va qachon. (67) <!-- TAXMIN T13 -->
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, Buyurtma qismi fokusga (DE-199); vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Mentor misolida narx yo'q: pul va kelishuv — ota-ona orqali; bepul qilish yoki pul olish — o'quvchi va ota-onasining qarori, darsda so'm aytilmaydi. «Qachon» — buyurtmachi bilan gaplashish kuni, ish tugash muddati emas.
  «Nima» — o'quvchi kursda qilgan ish: sayt yoki lending (2, 12-Modul), Telegram bot (7-Modul). Hali qilmagan ishni birinchi buyurtma qilib olmaydi. Rejada ism, telefon, manzil yo'q.
  Sinfdan so'rang: kursda qurganingizdan qaysi biri tanishingizga kerak bo'lishi mumkin?
✎ Mentor misoli — tayanchda yo'q tafsilot (TAYANCHGA SAVOL 1): futbol to'garagi — misol-ip olamida qoladi (P-001), «tanish doira» uch rolidan biri (tayanch 1.10).

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — tanish do'kon, P-002)
- Eyebrow: Tekshiruv · buyurtma rejasi (savol ustida yorliq yo'q)
- Savol: **Sinfdoshlaringiz buyurtma rejasini yozdi. Qaysi biri to'g'ri tuzilgan?**
  - ✔ A — Tanish do'kon · lending · shanba, ota-onam bilan (48)
  - B — Tanish do'kon · lending · shanba, ota-onamsiz (45)
  - C — Tanish do'kon · 3D o'yin · shanba, ota-onam bilan (49)
  - D — Tanish do'kon · lending · qachondir, ota-onam bilan (51)
- To'g'ri izohi: Tanish odam, kursdagidek ish, aniq kun va ota-ona bor. (54)
- Xato izohlari (≤60):
  - B: Pul va kelishuv haqida kim bilan gaplashiladi? (46)
  - C: Bu ishni kursda qurganmisiz? (28)
  - D: «Qachondir» — bu qaysi kun? (27)
  - (umumiy) Mentor rejasining uch qatorini eslang. (38)
- Javob topilgach (kichik, savol ostida): varaqning Buyurtma qismi ixcham — uch katak yashil ✓, ostida «Pul va kelishuv — ota-ona orqali.»
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): to'rttala variant bir shaklda (kim · nima · qachon), «Tanish do'kon» hammasida — test faqat «nima» va «qachon» qatorini tekshiradi. Uch distraktor uch turkumda: B — ota-onasiz (4-ekran 3-tugma) · C — kursda qurilmagan ish (4-ekran 2-tugma) · D — aniq kun yo'q (4-ekran 3-tugma `QIzoh`).
  «lending» A, B, D da; «ota-onam» A, C, D da — kalit so'z faqat to'g'rida emas. «3D o'yin» — kursda qurilmagan (2, 7, 11–13-Modul ishlari ichida yo'q); hayotda ham birinchi buyurtma uchun xavfli tanlov.

## 6 · Kompaniyaga xat  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · kompaniyaga xat
- Sarlavha: **Kompaniyaga xatda nimani aytasiz?** (33)
- Mentor: Tugmalarni birma-bir bosing va Mentor xati qanday yig'ilishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: son, o'sish tartibida): **Mentor bitta xatni nechta kompaniyaga yuboradi?** · Bittaga · Beshtaga · O'ntaga — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi. <!-- TAXMIN T13 -->
- Vizual (≤ 3 blok): **chapda** telefon «Maydon Jamoa» · **o'ngda** varaq — **Xatlar** qismi joriy: ochiq konvert-karta «1-xat · mobil ilova qiladigan kompaniya» — ichida «Assalomu alaykum!», uch bo'sh qator (uzuq), «Hurmat bilan,»; Yo'llar va Buyurtma — ixcham kulrang.
- Tugmalar (ixcham, bir qatorda): 1 Kimman · 2 Nima qurdim · 3 Nima so'rayman
- **Harakat → Vizual o'zgarish:**
  1. «Kimman» → birinchi qator yoziladi: «Men maktab o'quvchisiman, dasturlashni o'rganyapman.»; qator ostida kulrang: Ism — ixtiyoriy; telefon, manzil va maktab raqami yozilmaydi. (61)
     `QIzoh`: Kimman — bitta gap: kim ekaningiz va nimani o'rganayotganingiz. (63)
  2. «Nima qurdim» → telefondagi «Maydon Jamoa» ekrani kichrayib xatga uchadi va qator bo'ladi: «Agent bilan "Maydon Jamoa" ilovasini qurdim: unda mahalladagi mini-futbolga o'yinchi yig'iladi. Hozir 51 foydalanuvchi bor.»;
     qator ostida kulrang: Video-portfolio bo'lsa — havolasini uyda qo'shasiz. (51) <!-- TAXMIN T12 -->
     `QIzoh`: Nima qurdim — bitta mahsulot, u nima qilishi va bitta son: ro'yxat emas. (72)
  3. «Nima so'rayman» → qator: «Kompaniyangizda o'quvchilar uchun stajirovka bormi? Bo'lsa, qanday qatnashsam bo'ladi?»; konvert yopiladi, ustida yorliq «yuborish — uyda»; yonida ikkinchi konvert kulrang chiqadi «2-xat · sayt qiladigan kompaniya · maslahat»;
     konvertlar ostida qator: Uchrashuv taklifi kelsa — faqat kattalar bilan. (47) (12-Modul qatori aynan) <!-- TAXMIN T13 -->
     `QIzoh`: Har kompaniyaga alohida xat yoziladi; javob kelmasa yoki «yo'q» desa — qayta yozilmaydi. (88) <!-- TAXMIN T13 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bittaga».
  Ipucha (40 s): Yoqilgan tugmani bosing va xatga qarang. (40)
- Xulosa: Bu darsda kompaniyaga xat uch qismdan iborat: kimman, nima qurdim va nima so'rayman. (84) <!-- TAXMIN T13 -->
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, ikki konvert fokusga; vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Mentor xatida kompaniya nomi yo'q — faqat turi; real kompaniyani o'quvchi uyda, ota-onasi bilan tanlaydi va uning saytidagi rasmiy aloqa manziliga, ota-onasi biladigan pochtadan yuboradi. Javob kelmasligi ham mumkin — bu ham natija; qayta-qayta yozilmaydi.
  So'rov — bitta: stajirovka yoki maslahat (1-darsdagi «bitta aniq so'rov» ma'nosi). Xatda pul, maosh, investitsiya so'ralmaydi. «Nima qurdim» — bitta mahsulot, funksiyalar ro'yxati emas.
  Sinfdan so'rang: sizning xatingizda «Nima qurdim» qismiga qaysi mahsulot va qaysi son yoziladi?
✎ Xat qismlari — tayanch 1.10 so'zlari (kimman · nima qurdim · nima so'rayman). Mentor xati matni — tayanchda yo'q (TAYANCHGA SAVOL 2). «Uchrashuv taklifi …» qatori — 12-Modul `XAVFSIZLIK` ostidagi gap so'zma-so'z (T-042, bitta manba).

## 7 · Buyurtma va xatlar  ← QMustaqil (USTAXONA — ketma-ket karta, 3 qism; SABOQ 9, 13, 17, 29; E 43, E 53)
- Eyebrow: Mustaqil ish
- Sarlavha: **Buyurtma rejasi va ikki xatingizni yozing.** (42)
- Mentor (qismga qarab almashadi; har biri bitta gap):
  - 1-qism: Kartadagi savolga bitta qisqa javob yozing va «Saqlash»ni bosing.
  - 2-qism (`pm-m12d9-video` bor): Video-portfolio uchun yozganlaringiz xatga qo'yildi: kompaniya turini yozing va so'rovni tanlang.
    2-qism (yo'q): Kompaniya turini yozing, so'rovni tanlang va xatning qolgan qismlarini to'ldiring.
  - 3-qism: Ikkinchi xat boshqa kompaniyaga: turini yozing va so'rovni tanlang.
- Qism yorliqlari (ot-shakl, T-073): 1 Buyurtma · 2 1-xat · 3 2-xat
- Joylashuv (≤ 3 blok): **chapda** — varaq «Buyurtma va xatlarim» (Yo'llar ixcham · Buyurtma · Xatlar) · **o'ngda — bitta katta karta (joriy)** · tepada ixcham chiziq «Buyurtma va xatlarim · n/5» (3 qator + 2 xat; saqlangani ✓, SABOQ 17).
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh):
  - `pm-m12d9-video.bolaklar.kim` → 1-xat «Kimman» maydoni · `.nima` → «Nima qurdim» · `bor === true` → xat kartasi ostida kulrang qator: Ota-onangiz rozi bo'lsa, video havolasini uyda qo'shasiz. (57) <!-- TAXMIN T12 -->
  - 2-xat «Kimman» va «Nima qurdim» — 1-xatdan qo'yiladi (tahrirlanadi); kompaniya turi va so'rov — yangi.
- **1-qism · Buyurtma** (bittadan karta, «n / 3»; yorliq input ichida — raqam belgisi + savol placeholder'da, E 43; tugmalar bir qatorda: «Saqlash» · (2-kartada) ikkinchi tugmalar · o'ngda «Yordam»):
  ① **Kim** — placeholder `Kim? Rolini yozing, ismsiz` (≤40) · kulrang: Tanish doira: tanish do'kon, maktab yoki to'garak. (50) <!-- TAXMIN T13 -->
  ② **Nima** — placeholder `Nima qilib berasiz?` (≤80) · ikkinchi tugmalar «Lending» · «Telegram bot» → maydon boshiga so'z qo'shiladi («lending: » / «Telegram bot: »), `{…}` qolmaydi · kulrang: Kursda qurganingizga o'xshash ish. (34) <!-- TAXMIN T13 -->
  ③ **Qachon** — placeholder `Qachon gaplashasiz? Aniq kun` (≤40) · kulrang: Pul va kelishuv — ota-ona orqali. (33) <!-- TAXMIN T13 -->
  - Tekshiruv (`QXato`, ≤60; javob maydon ostida; «yo'naltiradi» — ikkinchi «Saqlash» bilan o'tadi, «bloklaydi» — o'tmaydi):
    - maydon bo'sh (bloklaydi): Bitta qisqa javob yozing. (25)
    - ① yoki ③ da «@», «t.me/», «+998» yoki 7+ raqam ketma-ket (bloklaydi): Rol yozing — ism, telefon va akkaunt nomi emas. (47) (13-Modul 9-dars matni aynan)
    - ① da «upwork», «xalqaro», «notanish» (yo'naltiradi): Birinchi buyurtma — tanish doiradan: kimni taniysiz? (52) <!-- TAXMIN T13 -->
    - ② yoki ③ da «pul», «so'm», «dollar», «narx» (yo'naltiradi): Narxni ota-onangiz bilan kelishasiz — bu yerga ishni yozing. (60) <!-- TAXMIN T13 -->
    - ③ da «qachondir», «bir kun», «keyinroq», «bilmayman» (yo'naltiradi): Aniq kun yozing: shu hafta qaysi kuni? (38)
    - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
  - Yordam (kartaga qarab bitta qator — Mentor misolidan, A-6 aynan): ① Mentor misolida: «maktabdagi futbol to'garagining murabbiyi» · ② Mentor misolida: «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi» · ③ Mentor misolida: «shu hafta, mashg'ulotdan keyin — ota-onam bilan».
- **2-qism · 1-xat** (bitta karta — xat qolipi; o'zgaradigan joylar uzuq ramkada — U-041; E 53: bitta xat — bitta karta):
  - **Kompaniya turi** — placeholder `Qanday kompaniya? Nomi emas, turi` (≤40) · kulrang: Kompaniyaning o'zini uyda, ota-onangiz bilan tanlaysiz. (55) <!-- TAXMIN T13 -->
  - **So'rov** — ikki tugma (bittasi tanlanadi; har birining o'z chegarasi — E 40): «Stajirovka» · «Maslahat» → «Nima so'rayman» qatoriga `SOROV_GAP` dagi gap sirg'alib qo'yiladi (tahrirlanadi).
  - **Xat** (konvert ichida, yuqoridan pastga):
    «Assalomu alaykum!» (o'zgarmaydi) ·
    ① placeholder `Kimman? Bitta gap` (≤120) ·
    ② placeholder `Nima qurdingiz? Mahsulot, u nima qiladi va bitta son` (≤160) ·
    ③ «Nima so'rayman» — tugmadan (≤140) ·
    «Hurmat bilan,» + kulrang «ism — xohlasangiz, uyda» (o'zgarmaydi; ism maydoni yo'q).
  - Tugmalar bir qatorda: «Saqlash» · «Nusxalash» (saqlangandan keyin yoqiladi; to'liq xat — salom va «Hurmat bilan,» bilan) · o'ngda «Yordam».
  - Tekshiruv (`QXato`, ≤60):
    - kompaniya turi bo'sh (bloklaydi): Qanday kompaniya — turini yozing. (33)
    - ① yoki ② bo'sh, so'rov tanlanmagan (bloklaydi): Xatning uch qismini to'ldiring. (31)
    - «@», «t.me/», «+998» yoki 7+ raqam ketma-ket (bloklaydi): Xatga telefon va akkaunt nomi yozilmaydi. (41)
    - «http», «www», «.uz», «.com» (bloklaydi): Havolani uyda, yuborishdan oldin qo'shasiz. (43) <!-- TAXMIN T12 -->
    - xat jami 420 belgidan uzun (bloklaydi): Xat uzun — har qism bitta-ikkita gap bo'lsin. (45)
    - «pul», «so'm», «dollar», «maosh», «investitsiya» (yo'naltiradi; «pullik» emas — alohida so'z): Bu xatda pul so'ralmaydi — stajirovka yoki maslahat so'rang. (60) <!-- TAXMIN T13 -->
    - «tezroq», «darhol», «zudlik», «javob bering» (yo'naltiradi): Xatda shoshiltirish yo'q — so'rov bir marta, hurmat bilan. (58)
    - ② da «funksiya» so'zi yoki 3 va undan ko'p vergul (yo'naltiradi): Ro'yxat emas — bitta mahsulot va u nima qilishi. (48)
    - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
  - Yordam: Mentor misolida: kompaniya turi — «mobil ilova qiladigan kompaniya», so'rov — stajirovka. Xat: «Assalomu alaykum! Men maktab o'quvchisiman, dasturlashni o'rganyapman. Agent bilan "Maydon Jamoa" ilovasini qurdim: unda mahalladagi mini-futbolga o'yinchi yig'iladi. Hozir 51 foydalanuvchi bor. Kompaniyangizda o'quvchilar uchun stajirovka bormi? Bo'lsa, qanday qatnashsam bo'ladi? Hurmat bilan, …»
    Oxirgi qator: Xatni ota-onangiz biladigan pochtadan yuborasiz; javob kelmasa — qayta yozmaysiz. <!-- TAXMIN T13 -->
- **3-qism · 2-xat** (2-qism kartasi, yangi konvert): «Kimman» va «Nima qurdim» — 1-xatdan; **Kompaniya turi** va **So'rov** — yangi. Tekshiruvlar — 2-qismdagidek, qo'shimcha:
  - kompaniya turi 1-xatdagi bilan harfma-harf bir xil (yo'naltiradi): 1-xatdagi kompaniyaning o'zimi? Boshqasini yozing. (50)
  - Yordam: Mentor misolida: kompaniya turi — «sayt qiladigan kompaniya», so'rov — maslahat: «Mahsulotimni ko'rib, bitta maslahat bera olasizmi: keyin nimani o'rganishim kerak?» Har kompaniyaga — alohida xat, bir marta.
- **Harakat → Vizual o'zgarish:** 1-qism «Saqlash» → javob karta ichidan varaqdagi katakka uchadi (~1 s yashil), pastdan keyingi karta kiradi, tepadagi chiziqda ✓ · «Lending» / «Telegram bot» → so'z maydonga sirg'alib yoziladi ·
  2, 3-qism so'rov tugmasi → gap konvertdagi «Nima so'rayman» qatoriga sirg'aladi · «Saqlash» → konvert yopilib varaqning Xatlar qismiga uchadi (ustida «yuborish — uyda»), «Nusxalash» yoqiladi ·
  tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. Hammasi tugagach karta yopiladi, varaq «Buyurtma va xatlarim» butun enga — har qator va konvertda ✎ (bosilsa o'sha karta qayta ochiladi — SABOQ 29); uzun matn «…» bilan qisqaradi, karta cho'zilmaydi.
- Xulosa (holatdan, P-046):
  - reja 3/3 va ikki xat saqlangan: Buyurtma rejasi va ikki xat yozildi: yuborish — uyda, ota-ona bilan. (68) <!-- TAXMIN T13 -->
  - boshqa holat (qisman): Yozilgani saqlandi — qolganini uyda yozasiz. (44)
- Saqlash: `pm-m12d10-ish` — har «Saqlash»da o'z maydoni: `buyurtma.kim` / `.nima` / `.qachon` · `xatlar[0]`, `xatlar[1]` = `{ kompaniyaTuri, soroq }` · `yuborildi: null` · `savedAt` (A-14 shartnomasi). Xat matni kalitga yozilmaydi (TAYANCHGA SAVOL 3).
- Tugma (pastki): Qismlarni bajaring (N/3) → Davom etish (`optionalLive`; qism o'tkazilsa — yakun holati «hali tugamagan»).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → (2-kartada) «Lending» / «Telegram bot» → «Saqlash» (maydon yozilgach halqada) → xat kartasida kompaniya turi → so'rov tugmalari → «Saqlash» → «Davom etish».
- Artefakt-strip (U-042): shu ekrandan — «Buyurtma va xatlarim · n/5» (ixcham); test, arena, podium va yakunda yo'q (E 50).
- Nishonlar: Order Plan! (reja 3/3 saqlanganda) · Two Letters! (ikki xat saqlanganda, kompaniya turi har xil) · One Ask! (ikkala xat yo'naltiruvchi xatosiz saqlanganda: pul, shoshiltirish, ro'yxat yo'q).
- Mentor rejimi: forma o'rniga Mentor misoli (A-6: reja va ikki xat, ochiq). Mentor statistikasi: «Reja yozdi» · «Xat yozdi» — matn, kompaniya turi va son yo'q (TAQIQLAR 3).
- O'qituvchi eslatmasi: ≈ 32 daqiqa: reja ≈ 10 · 1-xat ≈ 12 · 2-xat ≈ 10. Darsda hech kimga yuborilmaydi — «Nusxalash» faqat uyda yuborish uchun. Kompaniya nomini sinfda qidirib o'tirmang: bugun — turi, kompaniyaning o'zi — uyda, ota-ona bilan.
  Eng ko'p xato: rejada ism yoki notanish odam · «Nima» da kursda qilinmagan ish · xatda funksiyalar ro'yxati yoki pul so'rovi. Kim nechta xat yozganini so'ramang va sanamang; xatlarni proyektorga chiqarmang.
✎ Shakl — 13-Modul 9-dars 6-ekran (ketma-ket karta, xabar qolipi, o'zgarmaydigan qator, telefon va akkaunt tekshiruvi). Bittadan karta — E 53 (reja — uch karta, har xat — bitta karta).

## 8 · Yakuniy savol  ← QTest (✔ D, `correctIdx 3`; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Kompaniya xatingizga bir hafta javob bermadi. Endi nima qilasiz?** <!-- TAXMIN T13 -->
  - A — Har kuni qayta yozib, javobini so'rayman (40)
  - B — Shu xatni yana o'nta kompaniyaga tashlayman (43)
  - C — Ofisiga yolg'iz borib, javobini kutaman (39)
  - ✔ D — Qayta yozmayman, boshqa kompaniya tanlayman (43)
- To'g'ri izohi: Javob kelmasa, qayta yozilmaydi — boshqasiga alohida xat. (57)
- Xato izohlari (≤60):
  - A: Har kuni yozish — hurmatmi yoki bosim? (38)
  - B: Bitta xat ko'p joyga — bu spam emasmi? (38)
  - C: Notanish joyga kim bilan boriladi? (34)
  - (umumiy) Javob kelmasa nima qilinadi — eslang. (37)
- Javob topilgach (kichik): varaqning Xatlar qismi — 1-xat konvertida kulrang yorliq «javob yo'q — qayta yozilmaydi», yonida yangi konvert accent chegarada.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): uch distraktor uch turkumda: A — bosim (qayta-qayta yozish) · B — spam (bitta xat ko'p joyga) · C — xavfsizlik (notanish joyga yolg'iz). To'rttalasi «…-aman/-ayman» shaklida; «javob» A, C da; «kompaniya» B, D da; «yoz» A, D da — kalit so'z faqat to'g'rida emas.
  A — hayotda bir marta eslatish odatiy bo'lishi mumkin; «har kuni» — bosim (13-Modul 9-dars naqshi); bu darsning qoidasi: javob kelmasa — qayta yozilmaydi (6-ekran `QIzoh`). 6-ekran bashorati (bitta xat — bittaga) va arena 7, 8 bilan kalit ibora takrorlanmaydi (S-008): bu yerda — o'quvchining keyingi harakati.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 7-ekran «Saqlash» — Mentorga signal (`PRACTICE_BASE`, ball yo'q). Kim nechta xat yozgani sanalmaydi — podium faqat test ballari (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Xalqaro saytda avval nima» · 5 — «2 — To'g'ri buyurtma rejasi» · 8 — «Yakuniy — Javob kelmasa»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; o'quvchi qilgan ishni aytadi):
  - reja 3/3 va ikki xat saqlangan: **Buyurtma rejasi va ikki xat yozildi.** (36)
  - reja 3/3, xat 0–1: **Buyurtma rejasi yozildi — xatlar hali tugamagan.** (48)
  - reja 0–2/3, xat 1–2: **Xat yozildi — buyurtma rejasi hali tugamagan.** (45)
  - reja 1–2/3, xat yo'q: **Buyurtma rejasi hali tugamagan: {n} / 3 qator.** (46)
  - hech narsa saqlanmagan: **Buyurtma rejasi va xatlar hali yozilmagan.** (42)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 2 va 4-qator — 4, 6-ekran xulosalari aynan, T-042):
  - Upwork kabi xalqaro saytlarning yosh shartini ota-ona bilan saytning o'zidan o'qiysiz. (86) <!-- TAXMIN T13 -->
  - Bu darsda buyurtma rejasi uch qatordan iborat: kim, nima va qachon. (67) <!-- TAXMIN T13 -->
  - Birinchi buyurtma — tanish doiradan; pul va kelishuv — ota-ona orqali. (70) <!-- TAXMIN T13 -->
  - Bu darsda kompaniyaga xat uch qismdan iborat: kimman, nima qurdim va nima so'rayman. (84) <!-- TAXMIN T13 -->
  - Har kompaniyaga alohida xat; javob kelmasa — qayta yozilmaydi. (62) <!-- TAXMIN T13 -->
- Uyga vazifa (`HwCard` — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: buyurtma rejangiz va xatlaringiz · Nechta: 3 ish · Muddat: keyingi darsgacha
  - ① Yozilmay qolgan qator yoki xat bo'lsa — uni yozing.
  - ② Buyurtma rejangizni ota-onangizga ko'rsating va buyurtmachi bilan qachon birga gaplashishingizni kelishing. <!-- TAXMIN T13 -->
  - ③ Xohlasangiz — ota-onangiz bilan ikki kompaniyani tanlab, xatlarni yuboring; javob kelmasa, qayta yozmang. <!-- TAXMIN T13 -->
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Qaysi xalqaro dasturga ariza berasiz?» <!-- TAXMIN T20 -->
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib (E 50): belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. «Bugungi asosiy fikr» qutisi, holat chiplari, artefakt-strip — yakunda yo'q. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ① — hammasini yozgan o'quvchiga ish yo'q (shartli). ② — yengil va aniq: ko'rsatish va kun kelishish (sinf 14). ③ — ixtiyoriy, majburiydek aytilmaydi (tayanch 1.10: «yuborish — uyda, ixtiyoriy»; sinf 14).
  Muddat «keyingi darsgacha» — keyingi dars mazmuni va'da qilinmaydi (T-038); nomi faqat «Keyingi dars» qatorida. Upwork'da profil ochish uyga vazifada yo'q (TAQIQLAR 1).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **Rules First!** (3-ekran, birinchi urinishda) — Yosh shartini qayerdan o'qishni topdingiz (41)
- **Order Plan!** (7-ekran, reja 3/3 saqlanganda) — Buyurtma rejasining uch qatorini yozdingiz (42)
- **Two Letters!** (7-ekran, ikki xat, kompaniya turi har xil) — Ikki kompaniyaga alohida xat yozdingiz (38)
- **One Ask!** (7-ekran, ikkala xat yo'naltiruvchi xatosiz) — Xatni pul so'ramay, shoshiltirmay yozdingiz (43)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034, P-048): to'rttasi ham ish qilingan ekranda; 2, 4, 6-ekranlar (tugmali tushuncha) nishonsiz. Xatda pul yoki shoshiltirish so'zi qolsa — One Ask! berilmaydi.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Xalqaro saytda avval nima** — 1 Upwork kabi xalqaro saytlarda yosh sharti bor. · 2 Shart ota-ona bilan saytning o'zidan o'qiladi. · 3 Profil faqat o'z nomingizdan ochiladi. <!-- TAXMIN T13 -->
  — Sinfga savol: Saytning shartini qayerdan o'qiysiz?
- **5 · Buyurtma rejasi** — 1 Kim — tanish doiradan, rol bilan, ismsiz. · 2 Nima — kursda qurganingizga o'xshash ish. · 3 Qachon — aniq kun; pul va kelishuv — ota-ona orqali. <!-- TAXMIN T13 -->
  — Sinfga savol: Rejangizning qaysi qatori hali aniq emas?
- **8 · Javob kelmasa** — 1 Har kompaniyaga alohida xat, bir marta. · 2 Javob kelmasa yoki «yo'q» desa — qayta yozilmaydi. · 3 Uchrashuv taklifi kelsa — faqat kattalar bilan. <!-- TAXMIN T13 -->
  — Sinfga savol: Javob kelmasa, keyin nima qilasiz?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Mentor misolida buyurtmachi kim? (4)
   - ✔ Maktab to'garagi murabbiyi
   - Mahalladagi maydonning egasi
   - Ilova qiladigan kompaniya
   - Upwork'dagi notanish odam
2. Mentor buyurtmachiga nima qilib beradi? (4)
   - To'garak uchun o'yin
   - ✔ To'garak uchun lending
   - To'garak uchun kanal
   - To'garak uchun videolar
3. Buyurtmada pul va kelishuv kim orqali bo'ladi? (4) <!-- TAXMIN T13 -->
   - Sinfdoshingiz orqali
   - Faqat o'zingiz orqali
   - ✔ Ota-onangiz orqali
   - Xalqaro sayt orqali
4. Mentor birinchi xatida nimani so'raydi? (6)
   - Ilovasi uchun investitsiya
   - Kompaniyada doimiy ish
   - Ilovasini sotib olishni
   - ✔ Stajirovka bor-yo'qligini
5. Uchrashuv taklifi kelsa, kim bilan borasiz? (6)
   - ✔ Faqat kattalar bilan
   - Yolg'iz o'zim boraman
   - Sinfdoshim bilan birga
   - Chatdagi tanishim bilan
6. Upwork kabi saytning yosh shartini qayerdan bilasiz? (2) <!-- TAXMIN T13 -->
   - Sinfdoshlarim aytgan gapdan
   - ✔ Saytdan, ota-ona bilan o'qib
   - Yoshimni kattaroq yozib ko'rib
   - Kanaldagi reklama postidan
7. Bitta xat nechta kompaniyaga yuboriladi? (6)
   - Ikkitaga
   - Beshtaga
   - ✔ Bittaga
   - O'ntaga
8. Kompaniya «hozir stajirovka yo'q» dedi. Keyin-chi? (6)
   - Har hafta yana so'rab turaman
   - Xodimning telefonini so'rayman
   - Ofisiga borib, qayta so'rayman
   - ✔ Bu kompaniyaga qayta yozmayman
9. Buyurtmachiga birinchi navbatda qanday ish qilib berasiz? (4) <!-- TAXMIN T13 -->
   - ✔ Kursda qurganimga o'xshash ish
   - Hali hech qilmagan katta ish
   - Buyurtmachi aytgan har qanday ish
   - Do'stim maslahat bergan ish
10. Mentor buyurtmachi bilan qachon gaplashadi? (4)
    - Lending to'liq tayyor bo'lgach
    - ✔ Shu hafta, mashg'ulotdan keyin
    - Kompaniyadan javob kelgandan keyin
    - Upwork'da profil ochilgandan keyin
11. Xatning «Nima qurdim» qismiga nima yoziladi? (6)
    - Mahsulotning hamma funksiyasi
    - Telefon raqami va uy manzili
    - ✔ Bitta mahsulot va bitta son
    - Kompaniyani maqtaydigan gap
12. Rejaning «Kim» qatoriga nima yoziladi? (4)
    - Ish tugaydigan kun
    - Ishning narxi so'mda
    - Buyurtmachining ismi
    - ✔ Uning roli, ismsiz
- Arena yozuvlari — platforma shabloni (namuna 12-Modul YAKUNIY dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — buyurtma, reja, xat, kompaniya, stajirovka, frilans, lending, bot, ota-ona, so'rov · uyga vazifa banneri — reja, xat, buyurtma, kompaniya (faqat so'z, emojisiz).
- Izoh (MD): 1 — «maydon egasi» (1-darsdagi so'rov), «kompaniya» (xat), «Upwork» (xalqaro sayt) — darsdagi boshqa rollar; 2 — o'yin, kanal, videolar — Mentor rejasida yo'q; 3 — sinfdosh, faqat o'zi, sayt — 4-ekran qoidasiga zid;
  4 — investitsiya (TAQIQLAR 1), doimiy ish (stajirovka — o'qib ishlash davri), sotish — xatda yo'q; 5 — yolg'iz, tengdosh, chatdagi tanish (notanish) — uch xil xavf; 6 — mish-mish, aldash, reklama — uch xil yanglish manba;
  7 — son (bashoratning ballik takrori, 6-ekran); 8 — bosim, shaxsiy ma'lumot, yolg'iz borish — 6-ekran `QIzoh` ga zid; 9 — 4-ekran `QIzoh`; 9 C «har qanday ish» — kursdan tashqari ish ham kirishi mumkin, shuning uchun noto'g'ri; 9 D — tanlov sababi do'st maslahati, kursdagi ish emas;
  10 — Mentor rejasidagi «qachon»; 11 — ro'yxat, shaxsiy ma'lumot, maqtov — 6-ekran `QIzoh` va kulrang qatorga zid; 12 — boshqa qatorlar (qachon, narx) va shaxsiy ma'lumot.

## Kartochkalar (12)
| Old tomon | Orqa tomon |
|---|---|
| Birinchi buyurtma qaysi uch yo'ldan chiqishi mumkin? | Xalqaro sayt, tanish doira va kompaniya |
| Upwork kabi saytning yosh shartini qanday bilasiz? | Ota-ona bilan, saytning o'zidan o'qiysiz <!-- TAXMIN T13 --> |
| Xalqaro saytda profil kimning nomidan ochiladi? | Faqat o'z nomingizdan — ota-ona yoki boshqa odam nomidan emas <!-- TAXMIN T13 --> |
| Frilans nima? | Buyurtma bilan ishlash <!-- TAXMIN T19 --> |
| Buyurtmachi kim? | Ish beradigan odam yoki kompaniya <!-- TAXMIN T19 --> |
| Stajirovka nima? | Kompaniyada o'qib ishlash davri <!-- TAXMIN T19 --> |
| Buyurtma rejasi qaysi uch qatordan iborat? | Kim, nima va qachon <!-- TAXMIN T13 --> |
| Birinchi buyurtmada pul va kelishuv kim orqali bo'ladi? | Ota-ona orqali <!-- TAXMIN T13 --> |
| Birinchi buyurtma uchun qanday ish tanlanadi? | Kursda qurganingizga o'xshash ish: lending yoki bot <!-- TAXMIN T13 --> |
| Kompaniyaga xat qaysi uch qismdan iborat? | Kimman, nima qurdim va nima so'rayman <!-- TAXMIN T13 --> |
| Kompaniya javob bermasa nima qilinadi? | Qayta yozilmaydi; boshqa kompaniyaga alohida xat yoziladi <!-- TAXMIN T13 --> |
| Kompaniya uchrashuvga chaqirsa, kim bilan borasiz? | Faqat kattalar bilan |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (uch yo'l, yosh sharti, profil, frilans, buyurtmachi, stajirovka — 2 · reja, ota-ona, kursdagidek ish — 4 · xat qismlari, javob kelmasa, uchrashuv — 6).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan; 4–6 — atama → ta'rif). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Upwork'dagi yosh soni kartochkada yo'q (TAQIQLAR 1).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmFreelanceLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m12d10-v1` · «Birinchi buyurtmani qayerdan topasiz?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s7 `QMustaqil` · s9 `QNatija` · s10 `QKartochka` · s11 `QYakun`.
2. **`IshVaraq`** — bitta vizual (180): telefon (`JamoaTelefon`: «O'yin» ekrani «8 / 10»; ≈170×272 barqaror; 4-ekranda ostida lending kartasi) · varaq (`qism: 'yollar' | 'buyurtma' | 'xatlar'` — joriy qism accent, qolgani ixcham) ·
   Yo'llar (3 karta: brauzer «upwork.com» + nom «Upwork» + qulf · uch qiyofa, rol yorliqlari, ismsiz — D 36 · bino + konvert; holat yorliqlari) · Buyurtma (3 katak + «Pul va kelishuv — ota-ona orqali.» qatori) · Xatlar (2 konvert: ochiq/yopiq, uch qator, «yuborish — uyda»).
   `rejim: 'mentor' | 'oquvchi'` (sarlavha «Mentor misoli · Buyurtma va xatlar» / «Buyurtma va xatlarim»). Rangli yon chiziq yo'q. `reduced-motion`; 393 da telefon varaq ustida. Qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`).
   ⛔ «Upwork» nom rangi — «qur»da rasmiy brend sahifasidan; tasdiqlanmasa `T.ink` (TAYANCHGA SAVOL 9).
3. **`MENTOR_ISH`** — bitta manba (A-6 jadvali aynan): `{ yollar: [{ id: 'xalqaro' | 'tanish' | 'kompaniya', nom, qator, holat }], buyurtma: { kim, nima, qachon }, xatlar: [{ kompaniyaTuri, soroq }] }` ·
   **`MENTOR_XAT`** — `{ salom: 'Assalomu alaykum!', kimman, nimaQurdim, oxiri: 'Hurmat bilan,' }` · **`SOROV_GAP`** — `{ stajirovka, maslahat }` (A-6 aynan; 6-ekran 3-tugma, 7-ekran tugmalari va Yordam shundan) ·
   **`XAVF_QATOR`** — «Uchrashuv taklifi kelsa — faqat kattalar bilan.» (12-Modul `XAVFSIZLIK` ostidagi qator uz/ru aynan — `src/10-Modull` dagi matndan nusxa, o'zgartirilmaydi).
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); tanlovga qarab yo'l chizig'i va nomsiz belgi.
5. s2/s4/s6: `QBashorat` → 3 tugma (har biri vizualni o'zgartiradi + `QIzoh`); natija va `QIzoh` — yashil xulosa qutisi ichida (E 42); 40 s ipucha. s2 1-tugmadagi `QIzoh` — tayanch iborasi aynan (A-4); 6-ekran 3-tugmada `XAVF_QATOR`.
6. s7: 3 qism — Buyurtma (3 karta, ketma-ket, E 53) · 1-xat · 2-xat (har biri bitta karta: kompaniya turi + so'rov tugmalari + konvert ichida uch maydon); o'qiydi `pm-m12d9-video` (`bolaklar.kim`, `bolaklar.nima`, `bor`); yo'q bo'lsa — bo'sh maydon.
   «Lending» / «Telegram bot» — maydon boshiga so'z qo'shadi; «Stajirovka» / «Maslahat» — `SOROV_GAP` gapini qo'yadi (tahrirlanadi); 2-xat «Kimman», «Nima qurdim» — 1-xatdan.
   Tekshiruv funksiyasi (bo'sh · telefon/akkaunt `@`, `t.me/`, `+998`, 7+ raqam · havola · uzunlik 420 · `upwork|xalqaro|notanish` · pul so'zlari (alohida so'z — «pullik» emas) · `qachondir|bir kun|keyinroq|bilmayman` · shoshiltirish so'zlari · `funksiya` yoki 3+ vergul · 2-xat kompaniya turi = 1-xat) —
   PM-108 tartibida kamida 12 namuna bilan `node` da sinaladi (apostrof `normT` bilan — 12-Modul naqshi). «Nusxalash» — `navigator.clipboard` (⛔ LMS iframe ichida ishlashi «qur»da sinaladi; ishlamasa — matn tanlanadigan qutida).
   Artefakt-strip «Buyurtma va xatlarim · n/5» (U-042); nishonlar `orderPlan`, `twoLetters`, `oneAsk`.
7. **Saqlash** `localStorage` `pm-m12d10-ish` = `{ buyurtma: { kim, nima, qachon }, xatlar: [{ kompaniyaTuri, soroq }], yuborildi: null, savedAt }` (A-14) — har «Saqlash»da o'z maydoni yoziladi (birlashtiriladi), `savedAt` yangilanadi;
   saqlanmagan qator — `null`; `xatlar` — saqlangan xatlar (0–2), `soroq` — `'stajirovka'` | `'maslahat'`. Xat matni, ism, telefon, kompaniya nomi, havola — hech qaysi maydonga yozilmaydi (sinf 3). Boshqa darsning kalitiga yozmaydi.
   Xat matni dars holatida (sahifa ochiq turganda) qoladi; kalitga yozilishi — TAYANCHGA SAVOL 3 javobidan keyin.
8. **App.jsx** (asosiy seans; bu agent tegmaydi): `m12-10` qatoriga `comp: PmFreelanceLesson` + import. `sub` o'zgarmaydi («frilans va stajirovka: reja va ikki xat» — reja yorlig'i bilan so'zma-so'z).
9. Testlar s3/s5/s8 — `correctIdx` 2/0/3 = `INLINE_KEYS`; `RECAPS` 3/5/8 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
10. Jonli ball: `INLINE_KEYS` = { s3: 2, s5: 0, s8: 3, yollar: -1, buyurtma: -1, xat: -1, practice: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
11. `ACHIEVEMENTS` 4 (`rulesFirst`, `orderPlan`, `twoLetters`, `oneAsk`) · `FLASHCARDS` 12 · s11 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — yakunda yo'q (E 50) ·
    yakun sarlavhasi — saqlangan reja qatorlari va xatlar sonidan (5 holat) · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
12. Uyga vazifa — `HwCard` («Kim uchun · Nechta · Muddat», 3 band, ① shartli, ③ ixtiyoriy); alohida `.homework.jsx` yo'q.
- Darvozalar: `npm run gates -- src/12-Modull/PmFreelanceLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida backtik yo'q (CLAUDE.md); qo'shtirnoqli gaplar («"Maydon Jamoa" ilovasini») — JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi; xatlar va reja repo'ga yozilmaydi (tayanch 3). <!-- TAXMIN T4 -->

| Teg | Holat |
|---|---|
| `m14-dars-10-start` | = `m14-dars-09-done` (= `07-done`) |
| `m14-dars-10-done` | = `m14-dars-07-done` (tayanch 3 jadvali: 08…13 = `07-done`) |

«Ortda qoldingizmi» bu darsda yo'q (tayanch 3: birinchi amaliy blokda).

## Manbalar (o'zim tekshirgan fayl, qator va sahifalar, 08.10.2026)
- `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` 1.0, 1.1, **1.10**, 1.12, 1.14, 2, 3, 4, 5, 6, 7, 8 (`pm-m12d9-video`, `pm-m12d10-ish`), 9 · `00-TAQIQLAR.md` 0–8 · `00-NOMLAR.md` (9, 10, 11-qator) · `00-MANBA.md` 1 (10-qator), 4, 5 · `qaror-0.json` (ISH, VIDEO, ATAMA, NOM) · `MD_TOPSHIRIQ_2.md` (10-qator, 10-band, «Pilotlardan saboq»).
- `src/App.jsx` 475–477 (`m12-09`, `m12-10` — nom va osti, `m12-11`) — grep 08.10.
- 12-Modul tayanchi 118–121 (`XAVFSIZLIK` olti band va «Uchrashuv taklifi kelsa — faqat kattalar bilan.») · 13-Modul tayanchi 1.9, 2 · 13-Modul `00-TAQIQLAR.md` 3 · 13-Modul `09-PmPayCheck-v3.md` (6-ekran tekshiruvlari, ota-ona) va `09-FILTR.md` (11, 13, 14, 16-bandlar).
- 10-Modul tayanchi 136–138 (kursda qurilgan loyihalar: 2-Modul portfolio sayt, 7-Modul AvtoPizza boti).
- Pilotlar `01-PmInvestorPitch-v3.md`, `07-PmDemoTest-v3.md`, `01/03/07-OZ-AUDIT.md` (tuzilish, sinflar, arena shakli) · `QURUVCHI_SABOQ.md` E 40–55 · `konveyer/1-MD.md` · `konveyer/QURISH_KARTASI.md` · `MATN_KORPUS.md` 1–720, §102, §119, §218, §221.
- **Upwork (tashqi):** 08.10.2026 WebSearch (`support.upwork.com`, `upwork.com`) — sahifa «Who's eligible to join and use Upwork?» (support.upwork.com/hc/en-us/articles/211067778) topildi, **WebFetch — HTTP 403**, matn o'qilmadi. Qidiruv xulosasidagi «18 yoki mamlakatdagi balog'at yoshi» — rasmiy iqtibos emas.
  Shuning uchun darsda faqat tayanch iborasi (tayanch 1.10, `00-MANBA.md` 5: «rasmiy matnda tekshirilmadi»), «odatda» bilan, bir marta. Boshqa tashqi fakt (narx, komissiya, tugma nomlari) yo'q.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor misolining buyurtma rejasi** tayanchda yo'q (1.10 da faqat qoida). Yozdim: Kim — «maktabdagi futbol to'garagining murabbiyi» · Nima — «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi» · Qachon — «shu hafta, mashg'ulotdan keyin — ota-onam bilan».
   Sabab: misol-ip futbol olamida qoladi (P-001), «to'garak» — tayanchdagi uch roldan biri, lending — kursda qurilgan narsa. Taklif: tayanch 1.10 ga qo'shish (12-dars ham shu misolni ko'rsa — bir xil bo'lsin).
2. **Mentor ikki xati** tayanchda yo'q. Yozdim (A-6): 1-xat — «mobil ilova qiladigan kompaniya», stajirovka · 2-xat — «sayt qiladigan kompaniya», maslahat; matn — «Men maktab o'quvchisiman…», «Agent bilan "Maydon Jamoa" ilovasini qurdim… Hozir 51 foydalanuvchi bor.» (51 — tayanch 1.14). Taklif: tayanch 1.10 ga.
3. **Xat matni kalitga yozilmaydi** (sxema `xatlar: [{ kompaniyaTuri, soroq }]`). Xat uyda yuboriladi — sahifa yopilsa matn yo'qoladi, faqat «Nusxalash» qoladi. Taklif A: `xatlar[].matn` (≤420; telefon, akkaunt, havola tekshiruvidan o'tgan; ism maydoni yo'q) qo'shish · B: hozirgidek (faqat «Nusxalash»). Men B yozdim (tayanch aynan), A ni tavsiya qilaman.
4. **`soroq` ma'nosi** — `'stajirovka'` | `'maslahat'` deb oldim (tayanch 1.10: «nima so'rayman (stajirovka yoki maslahat)»). Boshqa ma'no ko'zda tutilgan bo'lsa — ayting.
5. **`yuborildi: n | null`** — darsda yuborilmaydi, shuning uchun bu darsda doim `null`. Kim yangilaydi? Taklif: 12-dars «Xat yubordingizmi?» deb o'z kalitida so'raydi (10-dars kalitiga yozmaydi) yoki 10-darsga qaytganda 7-ekran varag'ida ixtiyoriy «Yubordim: 0 · 1 · 2».
6. **`buyurtma` maydonlari** — saqlanmagan qator `null`; uzunliklar: kim ≤40, nima ≤80, qachon ≤40. Tasdiqlansa — tayanch 8 ga.
7. **`pm-m12d9-video` dan o'qish** — `bolaklar.kim` → «Kimman», `bolaklar.nima` → «Nima qurdim», `bor` → kulrang qator. 9-dars MD maydon nomlarini tayanch 8 dagidek saqlasa ishlaydi; boshqacha bo'lsa — moslanadi.
8. **Upwork iborasi** — tayanch 1.10 aynan: «odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing». «18» faqat 2-ekran `QIzoh` da, bir marta; testda, kartochkada, yakunda son yo'q. Topshiriq «aniq yosh da'vo qilmang» deydi — agar «odatda 18» ham olinsin desangiz,
   tayyor muqobil: «Upwork kabi xalqaro saytlarda yosh sharti bor — uni ota-ona bilan saytning o'zidan o'qing.» (2-ekran `QIzoh`, O'qituvchi eslatmasi — 2 joy).
9. **«Upwork» nom rangi** — tekshirilmagan. Taklif: «qur»da rasmiy brend sahifasidan; tasdiqlanmasa — neytral `ink` (o'z rangi qoidasi — TAQIQLAR 0 — buzilmasin deb).
10. **Dasturdagi «suhbat»** (dastur: «kompaniyaga xat, suhbat») — bu darsda alohida suhbat mashqi yo'q; faqat «Uchrashuv taklifi kelsa — faqat kattalar bilan.» qatori (12-Modul aynan). Suhbatga tayyorlanish kerakmi — tayanch qarori.
11. **«tanish doira»** — tayanch 2 jadvalida yo'q (TAQIQLAR 1 iborasi). Oddiy so'z sifatida ishlatdim, ta'rifsiz — uch rol bilan (tanish do'kon, maktab, to'garak). Atama sifatida jadvalga qo'shish kerakmi?
12. **Video havolasi xatda** — havola darsda yozilmaydi (bloklanadi), «uyda, yuborishdan oldin qo'shasiz» (tayanch 1.9: havola kalitga yozilmaydi; T12 — video ommaviy emas). Xatga havola qo'yish video qoidasiga zid emasmi («faqat havola bilan» ko'rinadigan joy — kompaniyaga yuborish mumkinmi)? Men «bo'lsa — uyda, ota-ona bilan» deb qoldirdim.
13. **13-Modul 9-darsidagi «Bu odamga yozishimdan ota-onam xabardor» belgisi** bu darsda yo'q — darsda hech kimga yozilmaydi. Uyga vazifa ③ «ota-onangiz bilan» deydi. Yetarlimi?
14. **Ikkinchi xat «Kimman» va «Nima qurdim»** — 1-xatdan qo'yiladi; tekshiruv faqat kompaniya turi bir xilligini ko'radi (bir xil matn ikki kompaniyaga — spam emas, chunki har kompaniyaga bitta). To'g'ri tushundimmi?
15. **Dars raqami o'quvchi matnida** — yo'q («Video-portfolio uchun yozganlaringiz»), pilot 01 qoidasi bilan bir. Tayanch 9 da aniq qoida yo'q — 2-to'lqinda hammaga bir xil bo'lsin.
16. **«spam»** so'zi — 8-ekran xato izohida bir marta (TAQIQLAR 3 da bor; o'smir kundalik so'zi). Lug'atda o'zbekchasi kerakmi («bitta xatni ko'p joyga tashlash»)?

## Shubhali joylar (ishonchim komil emas)
- ⛔ **«Qur» darvozasi:** 7-ekran ≈32 daqiqa (12–15 o'quvchi bilan taymer) · xat kartasi (kompaniya turi + so'rov tugmalari + konvertda uch maydon) 1280×800 da skrollsiz sig'ishi (U-006; sig'masa — konvert chapdagi varaqda, karta faqat maydonlar) ·
  «Nusxalash» LMS iframe ichida (clipboard ruxsati) · «Upwork» nom rangi · tekshiruv funksiyasi — `node` da namunalar bilan (ayniqsa «pul» va «pullik», «narx» va «narxi», 7+ raqam va sana).
- **Upwork «odatda 18 yoshdan»** — rasmiy matn o'qilmadi (403). Iboraning o'zi «odatda» bilan yumshatilgan, lekin son bor — TAYANCHGA SAVOL 8 dagi muqobil tayyor.
- **Mentor misoli (reja va xatlar)** — tayanchda yo'q, men yozdim (TAYANCHGA SAVOL 1, 2). Futbol to'garagi murabbiyi — «tanish», lekin Mentor misolining yoshi va maktabi aytilmaydi; «Men maktab o'quvchisiman» — Mentor misoli o'quvchi rolida (1-darsdagi «sinfdoshlarim» bilan bir).
- **5-ekran C «3D o'yin»** — kursda 3D o'yin qurilmagan (2, 7, 11–13-Modul); lekin JS darslarida o'yin olami bo'lgan — o'quvchi «o'yin qurganman» deyishi mumkin. «3D» shu farqni beradi deb oldim; auditor ko'rsin.
- **8-ekran A «Har kuni qayta yozib»** — hayotda bir marta eslatish odatiy; «har kuni» — bosim. Distraktor faqat «har kuni» bilan noto'g'ri — chegara aniqmi?
- **8-ekran D «boshqa kompaniya tanlayman»** — darsda «boshqa kompaniyaga alohida xat» to'g'ridan-to'g'ri aytilmagan, faqat «har kompaniyaga alohida xat» va «qayta yozilmaydi» (6-ekran `QIzoh`). Kartochka 11 shu bog'lanishni beradi.
- **Arena 1 «Mahalladagi maydonning egasi»** — 1-darsdagi Mentor so'rovi («maydon egalari bilan tanishtiring»); o'quvchi uni buyurtmachi deb o'ylashi mumkin — distraktor kuchli, lekin Mentor rejasi aniq (4-ekran).
- **Arena 9 C «Buyurtmachi aytgan har qanday ish»** — hayotda ham kursdan tashqari ish bo'lishi mumkin; noto'g'riligi «birinchi navbatda» so'zida. Auditor ko'rsin.
- **«xat» va «pochta»** — xat qayerga yuborilishi umumiy so'z bilan («kompaniya saytidagi rasmiy aloqa manzili», «ota-ona biladigan pochta»); aniq xizmat nomi yo'q (P-028).

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 18 band)
1. [x] **90 daqiqa — reja** — A-13: taqsimot (≈87 + 3 zaxira), «Ulgurmasangiz» (7-ekran — saqlangani qoladi, uyga vazifa ①, `optionalLive`, yakun «hali tugamagan»), tashqi kutish yo'q, ⛔ pilotda taymer; «sig'adi» yo'q. Amaliy blok yo'q — blok-darajasidagi «Ulgurmasangiz» tegishli emas.
2. [x] **Tekshirilmagan tashqi qadam** — Upwork shartlari: «saytning o'zidan o'qing» (umumiy so'z, tayanch iborasi); sayt ochilmaydi, tugma nomi yo'q; xat yuborish — «rasmiy aloqa manzili», «pochta» (umumiy so'z); ⛔ «qur»: Upwork rangi, «Nusxalash» (Shubhali joylar).
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d10-ish` tayanch 8 aynan (A-14, KOD 7): `null` — saqlanmagan, `soroq` ikki qiymat, `yuborildi: null`; boshqa dars kalitiga yozmaydi; o'qiydi `pm-m12d9-video` (havolasiz); ism, telefon, havola, xodim ismi, xat matni yo'q (TAYANCHGA SAVOL 3–7).
4. [x] **Mentor misoli — umumiy qoida emas** — «Bu misolda» (2 xulosa), «Mentor misolida» (7 Yordam, arena 1), «Bu darsda» (4, 6 xulosalari — kurs qolipi); 7-ekranda o'quvchining o'z buyurtmachisi, ishi, kompaniya turi va so'rovi; Mentor xati — «namuna».
5. [x] **Kafolat va sabab da'vosi yo'q** — «javob keladi», «stajirovka beradi», «buyurtma topasiz» yo'q; 6-ekran eslatmasi «Javob kelmasligi ham mumkin — bu ham natija»; Upwork — «odatda» va «saytning o'zidan o'qing».
6. [x] **Yakun, nishon — faqat rost holatda** — 11-ekran 5 holat («hech narsa saqlanmagan» bilan — E 54), ✓ va nishon faqat birinchisida; Order Plan! / Two Letters! / One Ask! — saqlangan ma'lumotdan; xat yuborildi deb hech qayerda aytilmaydi.
7. [x] **Ta'rif sanaladigan** — reja 3 qator, xat 3 qism (aniq nomlar bilan), «kompaniya turi» — nima qilishi (nom emas); 51 — «foydalanuvchi» (1.14 birligi); «bitta kompaniyaga bitta xat» — sanaladigan.
8. [x] **Test: bitta himoyalanadigan javob** — s3 (boshqa nom · ota-onasiz · shartsiz), s5 (ota-onasiz · kursdan tashqari ish · aniq kunsiz), s8 (bosim · spam · yolg'iz uchrashuv); har testda uch turkum; s3 da yosh soni yo'q.
9. [x] **Real odamlar xavfsizligi** — A-10 to'liq: darsda hech kimga yozilmaydi; tanish doira; pul — ota-ona orqali; xat — bitta, bir marta, uyda, ixtiyoriy; uchrashuv — kattalar bilan; xatda telefon/akkaunt bloklanadi; podium va Mentor ekranida son/matn yo'q; Mentor nomidan yozilmaydi.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent ishlamaydi, tekshiruv akkaunti yo'q; agent faqat Mentor xatida («Agent bilan … qurdim») — rost rol.
11. [x] **Web-trek teng yo'l** — «sayt, bot va o'z mahsulotingiz» (0), «Lending» · «Telegram bot» (7) — ikkala trek qurgan narsalar; testlar ikkala trekka to'g'ri; trek kaliti o'qilmaydi.
12. [x] **Mentor misoli ichki izchil** — Mentor xatidagi son (51) va rol (agent bilan) 1-darsdagi Raqamlar va Jamoa bo'laklari bilan bir; «maydon egasi» (1-dars so'rovi) buyurtmachi qilinmadi; keyingi darslar (xalqaro dastur, olti oylik reja) ochilmaydi.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 7-ekranda maydonlar o'quvchiniki (`pm-m12d9-video` yoki bo'sh); Mentor matni faqat Yordam'da; so'rov gapi tugmadan qo'yiladi, lekin tanlov va tahrir — o'quvchida.
14. [x] **Uyga vazifa yengil va aniq** — 3 ish: ① shartli, ② ko'rsatish va kun kelishish, ③ ixtiyoriy («Xohlasangiz»); Upwork'da profil ochish yo'q.
15. [x] **Ayb da'vosi yo'q** — xato izohlari va `QXato` lar keyingi qadamni aytadi («Aniq kun yozing…», «Boshqasini yozing»); «sizning xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — xatda «tez orada», «katta bo'ladi» yo'q; «Nima qurdim» — bor narsa (51 foydalanuvchi); 11-dars, 12-dars, Demo Day — o'quvchi matnida yo'q (faqat «Keyingi dars» qatori).
17. [x] **Pul va investitsiya** — xatda pul, maosh, investitsiya so'ralmaydi (7-ekran tekshiruvi, arena 4); buyurtmada narx darsda aytilmaydi, pul — ota-ona orqali (4, 5, 7; arena 3).
18. [x] **Yosh va rasmiy shartlar** — Upwork: faqat tayanch iborasi, bir marta, «odatda» va «saytning o'zidan o'qing» bilan; profil faqat o'z nomidan (2-ekran, s3, kartochka 3); testda va kartochkada son yo'q; manba holati — «Manbalar» (403).
+ **RAD etilganlar saqlangan:** hookdagi «Aynan!» / «Qiziq fikr!» (0) · «Keyingi dars — «…»» qatori (11) · reja sarlavhasi — natija-gap (1) · ≤3 blok · bank so'zi — keys yo'q.
+ **SABOQ E:** variant chegarasi (0, bashoratlar, so'rov tugmalari) · maket kesilmaydi (7 ⛔) · taxmin qatori yashil xulosa ichida (2, 4, 6) · yorliq input ichida (7) · bittadan karta (7: reja — 3, xat — 1+1) · yakun standart, «Bugungi asosiy fikr» yo'q (11).

## O'lchov (`scratchpad/m14/md10/olchov.py` natijasi — draftdagi har sanaladigan matn belgilanib, uzunligi avtomatik qo'yildi, 08.10.2026)
```
Belgilar soni — bo'shliq bilan, ** siz (Python len). Qavsdagi uzunliklar: 182 ta o'lchangan matn — sonlarni skript qo'ygan, qo'lda yozilmagan.
Sarlavhalar (yakunning 5 holati bilan): 12 ta · 25–51 · chegara ≤55 · hammasi chegarada
Xulosalar: 5 ta · 44–84 · chegara ≤110 · hammasi chegarada
Hook javoblari: 3 ta · 72–101 · chegara ≤120 · hammasi chegarada
Hook variantlari: 3 ta · 27–33 · hammasi chegarada
To'g'ri izohlar: 3 ta · 53–57 · chegara ≤60 · hammasi chegarada
Xato izohlari, QXato, ipucha, tekshiruv xabarlari: 31 ta · 25–60 · chegara ≤60 · hammasi chegarada
QIzoh qatorlari: 9 ta · 62–105 · chegara ≤110 · hammasi chegarada
Kulrang qatorlar (karta ostida): 9 ta · 33–75 · chegara ≤110 · hammasi chegarada
Nishon tavsiflari: 4 ta · 38–43 · chegara ≤48 · hammasi chegarada
Endi siz bilasiz: 5 ta · 62–86 · chegara ≤110 · hammasi chegarada
Bugungi asosiy fikr (A-2): 1 ta · 108–108 · chegara ≤110 · hammasi chegarada
Reja qadamlari: 4 ta · 37–61 · hammasi chegarada
Mentor gaplari: 0-ekran: 1 gap (104) · 1-ekran: 1 gap (64) · 2-ekran: 1 gap (60) · 4-ekran: 1 gap (71) · 6-ekran: 1 gap (71) · 7-ekran: 1 gap (65) · 7-ekran: 1 gap (97) · 7-ekran: 1 gap (82) · 7-ekran: 1 gap (67)
Sarlavha so'zlari (4+ harf) Mentorda: 0-ekran: 0/4 · 1-ekran: 1/6 · 2-ekran: 0/5 · 4-ekran: 0/5 · 6-ekran: 0/4 · 7-ekran: 1/5
Test savoli (3-ekran): 7 so'z — Sinfdoshingiz Upwork'da ishlamoqchi. U avval nima qiladi?
Test savoli (5-ekran): 8 so'z — Sinfdoshlaringiz buyurtma rejasini yozdi. Qaysi biri to'g'ri tuzilgan?
Test savoli (8-ekran): 9 so'z — Kompaniya xatingizga bir hafta javob bermadi. Endi nima qilasiz?
Arena savoli (Jonli viktorina): 4 so'z — Mentor misolida buyurtmachi kim?
Arena savoli (Jonli viktorina): 5 so'z — Mentor buyurtmachiga nima qilib beradi?
Arena savoli (Jonli viktorina): 7 so'z — Buyurtmada pul va kelishuv kim orqali bo'ladi?
Arena savoli (Jonli viktorina): 5 so'z — Mentor birinchi xatida nimani so'raydi?
Arena savoli (Jonli viktorina): 6 so'z — Uchrashuv taklifi kelsa, kim bilan borasiz?
Arena savoli (Jonli viktorina): 7 so'z — Upwork kabi saytning yosh shartini qayerdan bilasiz?
Arena savoli (Jonli viktorina): 5 so'z — Bitta xat nechta kompaniyaga yuboriladi?
Arena savoli (Jonli viktorina): 6 so'z — Kompaniya «hozir stajirovka yo'q» dedi. Keyin-chi?
Arena savoli (Jonli viktorina): 7 so'z — Buyurtmachiga birinchi navbatda qanday ish qilib berasiz?
Arena savoli (Jonli viktorina): 5 so'z — Mentor buyurtmachi bilan qachon gaplashadi?
Arena savoli (Jonli viktorina): 6 so'z — Xatning «Nima qurdim» qismiga nima yoziladi?
Arena savoli (Jonli viktorina): 5 so'z — Rejaning «Kim» qatoriga nima yoziladi?
Hook variantlari (0): 33 · 30 · 27 | o'rtachadan eng katta og'ish 10%
Test 3: 41 · 40 · ✔40 · 44 | o'rtachadan eng katta og'ish 7%
Test 5: ✔48 · 45 · 49 · 51 | o'rtachadan eng katta og'ish 7%
Test 8: 40 · 43 · 39 · ✔43 | o'rtachadan eng katta og'ish 5%
Bashorat 2: 5 · 6 · 5 | o'rtachadan eng katta og'ish 13%
Bashorat 4: 29 · 27 · 24 | o'rtachadan eng katta og'ish 10%
Bashorat 6: 7 · 8 · 7 | o'rtachadan eng katta og'ish 9%
Arena 1: ✔26 · 28 · 25 · 25 | o'rtachadan eng katta og'ish 8%
Arena 2: 20 · ✔22 · 20 · 23 | o'rtachadan eng katta og'ish 8%
Arena 3: 20 · 21 · ✔18 · 19 | o'rtachadan eng katta og'ish 8%
Arena 4: 26 · 22 · 23 · ✔25 | o'rtachadan eng katta og'ish 8%
Arena 5: ✔20 · 21 · 22 · 23 | o'rtachadan eng katta og'ish 7%
Arena 6: 27 · ✔28 · 30 · 26 | o'rtachadan eng katta og'ish 8%
Arena 7: 8 · 8 · ✔7 · 7 | o'rtachadan eng katta og'ish 7%
Arena 8: 29 · 30 · 30 · ✔30 | o'rtachadan eng katta og'ish 3%
Arena 9: ✔30 · 28 · 33 · 27 | o'rtachadan eng katta og'ish 12%
Arena 10: 30 · ✔30 · 34 · 34 | o'rtachadan eng katta og'ish 6%
Arena 11: 29 · 28 · ✔27 · 27 | o'rtachadan eng katta og'ish 5%
Arena 12: 18 · 20 · 20 · ✔18 | o'rtachadan eng katta og'ish 5%
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```

Ekran testlari: s3 C · s5 A · s8 D (uchalasi har xil o'rinda). Mentor gaplari «Bu…», «Hammasini…» bilan boshlanmaydi, sarlavhani takrorlamaydi (qo'lda va skript bilan).
`npm run -s lint:til -- feedback/F-1008-14modul/10-PmFreelance-v3.md` — natija hisobotda (oxirgi tahrirdan keyin qayta yurgizildi).

## TAXMIN belgilari
Jami 70 ta `<!-- TAXMIN … -->` izohi, 70 ta Tn belgisi.

| Tn | Soni | Qayerda (bo'lim) |
|---|---|---|
| **T4** | 1 | REPO |
| **T12** | 3 | 6-ekran · 7-ekran |
| **T13** | 54 | sarlavha qatori · A. Darsning · 1-ekran · 2-ekran · 3-ekran · 4-ekran · 6-ekran · 7-ekran · 8-ekran · 11-ekran · Qisqa takrorlash · Jonli viktorina · Kartochkalar (12) |
| **T18** | 2 | sarlavha qatori · A. Darsning |
| **T19** | 6 | A. Darsning · 2-ekran · Kartochkalar (12) |
| **T20** | 4 | sarlavha qatori · 0-ekran · 1-ekran · 11-ekran |

Javob boshqacha bo'lsa: **T13** (B — Upwork profilini darsda ochish) → TAQIQLAR 1 ga zid, alohida qaror; Upwork iborasi o'zgarsa — 2-ekran `QIzoh`, O'qituvchi eslatmasi, 3-ekran, kartochka 2–3, arena 6 · **T19** (B — inglizcha atamalar qavsda) → 2-ekran `QIzoh` ×2, kartochka 4–6 ·
**T12** (B — ommaviy video) → 6, 7-ekran havola qatorlari · **T20** (B — nomlar) → sarlavha, reja yorlig'i, keyingi dars · **T18** (keyslar) va **T4** (teglar) — bu darsga ta'siri yo'q (keyssiz, repo'siz).

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 475 `m12-09` «Video-portfolio: 3 daqiqada o'zingiz va mahsulot» → 476 **`m12-10` «Birinchi buyurtmani qayerdan topasiz?»** (osti — reja yorlig'ida so'zma-so'z) → 477 `m12-11` «Qaysi xalqaro dasturga ariza berasiz?» (yakun qatori). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» egasining birinchi ish yo'li (telefon, Mentor reja va xatlari); metafora yo'q; bitta vizual — `IshVaraq` (telefon · Yo'llar · Buyurtma · Xatlar). Ikkinchi misol faqat testda (sinfdosh, tanish do'kon — P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 6 (QTushuncha) + 0, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q — har bosish kartani to'ldiradi, narsa uchadi (sayt kartasi, konvert, telefon ekrani), qiyofa qo'shiladi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: lending (12-Modul), Telegram bot (7-Modul), video-portfolio, so'rov (14-Modul 1, 9-dars), tanish/notanish (13-Modul), «Uchrashuv taklifi kelsa — faqat kattalar bilan.» (12-Modul aynan).
  Yangi — frilans, buyurtmachi, stajirovka — misoldan keyin (2-ekran `QIzoh`), tayanch 2 ta'riflari aynan. Siz-forma; tugmalar ot-shaklda («Saqlash», «Nusxalash», «Stajirovka», «Maslahat», «Yakunlash →»); Mentor xati — olam matni, «men» shaklida (T-008).
- [x] Testlar: 4 variant, uzunlik teng (±15% — O'lchov), to'g'ri javob hech qayerda yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas (s3 «profil», «ota-ona»; s5 «lending», «ota-onam»; s8 «javob», «kompaniya»). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [x] Final tartib-mashqi yo'q (yakuniy — `QTest`); `QTartib` bu darsda yo'q.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ ✎ ⛶ — belgilar) · kafolat so'zlari («albatta», «darrov», «har doim», «100%», «kafolat») — o'quvchi matnida 0; «darhol» — faqat 7-ekran shoshiltirish detektori ro'yxatida (MD ichki).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-10`, «Modul 14», A1, «TAXMIN», «keys», K-raqam); «freelance», «intern» — yo'q. «KOD» ro'yxati 12 band, REPO — teglar jadvali.
- [x] Karta T · P · S · PM: T-008 (Mentor xati — olam matni) · T-011/PM-030 (frilans, buyurtmachi, stajirovka — misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/T-015 (A-5: buyurtma — bitta ma'no; xat ↔ xabar; so'rov ↔ «Yordam»; reja — faqat buyurtma rejasi; jamoa — prozada yo'q) ·
  T-016 (metafora yo'q) · T-020 · T-029/T-047 (Mentor bashorat yorlig'ini takrorlamaydi) · T-035 (o'quvchi matnida → ÷ × yo'q; «·» — faqat test variantidagi reja qatorlarida, to'rttasida) · T-038 (11, 12-dars, Demo Day — yo'q) · T-039 («xatingizni yozing» — shu ekranda yaratadi) ·
  T-042 (xulosa = «Endi siz bilasiz» 2 va 4-qator; ta'riflar tayanch 2 aynan) · T-043 («Bu misolda», «Bu darsda», «Mentor misolida») · T-052 · T-064 (2-ekran sarlavhasi 0-ekran savoliga javob) · P-001 · P-002 · P-008 (≤3 blok) · P-012 (testlar 3, 5, 8 — ketma-ket emas) ·
  P-013 · P-014/P-015 (reja — natija va'dasi; kulrang yorliq App.jsx osti aynan) · P-016 · P-025 · P-028 (Upwork tugmasi va narxi yo'q) · P-033 · P-036 · P-046 · P-052 · P-062 · P-063 (`MENTOR_ISH`, `SOROV_GAP`, `XAVF_QATOR`) · P-064 · P-067 ·
  S-001 (savollar 7–9 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 (bashoratlar bir o'lchovda, o'sish tartibida) · S-019 · S-020 · S-026 · S-027 · §144/§145 · PM-005 (2-tur) · PM-017 · PM-018 · PM-020 (so'rov gapi tugmadan — gapda tugal) · PM-021 · PM-027 · PM-108 · J-026 · SABOQ 1–31, D 36, E 40–55.
- [x] **Qaror-0 TAXMIN** — belgilangan (yuqorida); GATE M sahifasida T13 (frilans yo'li) javobi bu darsning 1–8, 11-ekranlariga to'g'ridan-to'g'ri tegadi.
