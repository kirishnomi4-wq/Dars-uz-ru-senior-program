# 13-Modul (kod: `src/11-Modull`) · 2-dars (PM) «Mahsulotingiz qanday pul topadi?» — MD v3

Fayl: `src/11-Modull/PmMonetizationLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-02` · **15 ekran** (PM, keys bilan — tayanch 4: 12-Modul 10-dars ritmi) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Quruvchi qoidalari (9-Modul SABOQ 1–18, 10-Modul SABOQ 19–31, 11-Modul SABOQ D 32–39, **12-Modul SABOQ E 40–55** — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa; Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) ·
ko'p maydonli ish — bittadan karta (E 53) · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror) · odamlar real ko'rinishda (bosh, soch, rangli kiyim — D 36) · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 7-ekran — **D** (`3`) · 11-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 445–447, grep 07.10.2026, DE-205): `m11-01` «Bitta foydalanuvchi sizga qanchaga tushadi?» → **`m11-02` «Mahsulotingiz qanday pul topadi?»** (osti: «besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya», `type: 'PM'`, `comp` hali yo'q) → `m11-03` «Webhook: to'lov Backend'ga qanday yetib keladi».
Tur (PM-005): **2-tur sof PM** — artefakt yozma: o'quvchining o'z mahsuloti uchun asoslangan model tanlovi (`pm-m11d2-model`); mustaqil ish majburiy (8, 9-ekran). **Keys — K2 Telegram Premium** (Qaror-0 21; tayanch 5 — faqat bank matni).
**Kod mexanikasi — Neon SQL Editor** (tayanch 1.2, 4): to'lashi mumkin bo'lganlarni sanash (10-ekran, `QKod` Neon varianti; 12-Modul 10-dars 9-ekran naqshi). **REPO yo'q** (tayanch 3: `m13-dars-02-done` = `-start`).
⚠️ Pul chegarasi (Qaror-0 6, TAQIQLAR 1): bu darsda to'lov sahifasi, to'lov tugmasi va karta yo'q; narx aytilmaydi (4-dars kashfiyoti — MD_TOPSHIRIQ_2 «2»); maxfiy kalit tilga olinmaydi; tranzaksiya modeli — faqat «Mentor misolida» va «yuridik shaxs va shartnoma kerak» bilan.
⚠️ Modul raqami o'quvchi matnida — LMS raqami («12-Modulda», «11-Modul», «10-Modulda»); kod raqami (`m11-02`, `src/11-Modull`) faqat fayl yo'lida. Shu modulning 1-darsi o'quvchi matnida — «o'tgan dars».
Vaqt: ≈ 90 daqiqa (taqsimot — A-12; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (**1.0 — pul modeli, Pro, «Doimiy o'yin», Mentor sababi — AYNAN** · 1.1 — to'lovchi, keltiradigan pul · **1.2 — besh model, Mentor jadvali, K2 ko'prigi, Neon SQL — AYNAN** · 1.13 — sonlar (2-qator: 6) · 2 — atamalar · 3 — teg 02 · 4 — PM keys bilan shakli · **5 — K2** · 7 — sinflar · 8 — `pm-m11d2-model` · **9 — to'lqin kelishuvlari (9.16, 9.19, 9.21, 9.22)**) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 3, 6, 21, 22, 23) · `00-TAQIQLAR.md` (0–7) · `00-NOMLAR.md` · `00-MANBA.md` (4 — o'tilgan atamalar, 6 — keys banki) · `PM_Prompt_v8.md` K2 (176–179-qator) ·
12-Modul tayanchi (1.0 · 1.7 — `namuna`, «Hisobni o'chirish» · 1.13 — 44 · 9.5, 9.23 — sanoq SQL lari) · 11-Modul tayanchi (1.4 — PRD, 1.5 — roadmap: «Maydon pulini bo'lishish» — uzoqroq · 146-qator — `oyinlar.tashkilotchi_id` · 8 — `pm-m9d5-prd`) ·
namunalar: 12-Modul `10-PmUsersCheck-v3.md` (6-ekran — K5 keys, 9-ekran — Neon) + `10-FILTR.md` · `01-PmLanding-v3.md` + `01-FILTR.md` · pilot `01-PmUnitEconomics-v3.md` · `QURUVCHI_SABOQ.md` E 40–55.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Asoslangan model tanlovi»; tayanch 1.2, 4; Qaror-0 2): o'quvchi o'z mahsuloti uchun besh modeldan bittasini tanlaydi va asoslaydi — **kim to'laydi** (rol), **nima uchun to'laydi**, **nima bepul qoladi**, **nega aynan shu** (mahsulotdan bitta fakt),
   **kamida bitta rad etilgan model** va sababi; Neon'da **to'lashi mumkin bo'lganlar sonini** sanaydi (yoki taxmin yorlig'i bilan yozadi). Saqlanadi `pm-m11d2-model` (4, 7, 11-darslar o'qiydi). Uyga vazifa — yakun kartasida (alohida `.homework.jsx` yo'q).
   Tanlov — hali taxmin: hech kim to'lamagan (yakun sarlavhasi holatga qarab; «modelingiz to'g'ri» deyilmaydi).
2. **Bugungi asosiy fikr (P-013; dars ichida turadi, yakunda KO'RSATILMAYDI — SABOQ E 50):** Model kim to'lashi va nima bepul qolishidan tanlanadi — Mentor misolida o'yinchilar bepul qoladi, Pro'ni tashkilotchi oladi.
   (Tayanch 1.0 va 1.2 dan: «freemium — o'yinchilar uchun hamma narsa bepul …; tashkilotchi uchun «Pro»»; ko'prik K2 — «bepul qism qisqartirilmaydi».)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4):**
   - O'tgan dars (13-Modul 1): **to'lovchi** — «pul to'laydigan foydalanuvchi» · **pullik obuna** — «ma'lum muddatga to'lanadigan foydalanish» (doim ikki so'z) · **Pro** — Mentor misolida tashkilotchi uchun 30 kunlik pullik obuna; undagi bitta qulaylik — **«Doimiy o'yin»**: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi ·
     **Mentorning rejasi** (Pro yorlig'i, 9.21) · **foydalanuvchi keltiradigan pul** (faqat hook maketida — o'quvchining o'z kartasidan) · **taxmin** (yorliq).
   - 12-Modul: **ro'yxatdan o'tgan** — Mentor misolida 44 (1.13) · **namuna va tekshiruv akkauntlari** (`namuna = true`, sanoqdan chiqariladi — 9.5) · **asosiy harakat** · **Neon** va **SQL Editor** (12-Modul 10-darsi — «Run») · **lending** (`pm-m10d1-lending.nom` — mahsulot nomi).
   - 11-Modul: **muammo gapi** (so'zma-so'z: «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.») · **PRD** (`pm-m9d5-prd`: kim uchun, uchta funksiya) · **roadmap** va ufq **«uzoqroq»** · **«Maydon pulini bo'lishish»** (bitta nom — 11-Modul 9.42) · **tashkilotchi** · **o'yinchi** (rol bilan, ismsiz).
   - 10-Modul: `COUNT(DISTINCT …)` — «takrorlanmagan … soni» (2-darsi, brauzer ID) · oldingi modullarda: `JOIN` — «ikki jadvalni `id` orqali bog'laydi» (faqat Yordamda eslatiladi).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **monetizatsiya modeli** — «mahsulot qanday pul topishi» (tayanch 2). 4-ekran xulosasida tug'iladi — besh yo'l «Maydon Jamoa»ga qo'yib ko'rilgandan keyin; undan keyin qisqa shakli — **model**. Undan oldin hodisa tilida — «pul topish yo'li» (hook javoblari, reja 02, 4-ekran sarlavhasi va bashorati).
   - **bepul asos va pullik qo'shimcha** — «asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik» (tayanch 2; inglizchasi «freemium» — faqat kartochkada bir marta). App.jsx osti va reja yorlig'ida qisqa «bepul asos» (so'zma-so'z, P-015).
   - **pullik obuna** (model sifatida) — «har bir foydalanuvchi ma'lum muddatga to'laydi»; 4-ekranda nomi **«pullik obuna — hamma to'laydi»** (tayanch 1.2 «pullik obuna (hamma to'laydi)»). Pro ham pullik obuna, lekin faqat qo'shimcha uchun — 4-ekran 5-karta qatori va 5-ekran testi shu farqni ochadi. Inglizchasi «subscription» — kartochkada bir marta.
   - **reklama** — «boshqa kompaniya o'z mahsulotini foydalanuvchilarga ko'rsatish uchun to'laydi» (tayanch 2 «boshqa kompaniya e'loni uchun to'laydi»; «e'lon» bu darsda — o'yin e'loni, T-015 — TAYANCHGA SAVOL 19).
   - **B2B** — «boshqa biznes to'laydi» (tayanch 2, bir marta izoh — qisqartma birinchi ko'rinishda ochiladi, T-036); hodisa gapi reklamadan ajratadi: «mahsulot boshqa biznesning o'z ishiga xizmat qiladi» (TAYANCHGA SAVOL 6). Inglizchasi «business to business» — kartochkada.
   - **tranzaksiya** — «har to'lovdan ulush» (tayanch 2, bir marta izoh). Bu darsda faqat model nomi; boshqa ma'nosi (Database) tilga olinmaydi (TAQIQLAR 5, 8).
   - **to'lashi mumkin bo'lganlar** — Neon sanog'i (10-ekran): to'lovchi bo'lishi mumkin bo'lgan foydalanuvchilar soni (tayanch 8 `soni`); «to'laganlar» emas — hali hech kim to'lamagan.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«yo'l»** — faqat «pul topish yo'li» (atama tug'ilguncha); boshqa ma'noda (to'lov yo'li, foydalanuvchi yo'li) bu darsda yo'q. **«model»** — 4-ekran xulosasidan keyin.
   - **«to'lovchi»** — pul to'laydigan foydalanuvchi (rol); **«to'lashi mumkin bo'lganlar»** — SQL sanog'i; **«foydalanuvchi»** — tushuncha; **«kishi»** — yo'q (son faqat «foydalanuvchi» bilan: «44 foydalanuvchi»); **«odam belgisi»** — MD dagi vizual ta'rifi.
   - **«e'lon»** — faqat o'yin e'loni («E'lon berish», «o'yin e'loni»); kompaniyaning to'lab ko'rsatadigan narsasi — **«reklama»** («reklama beruvchi», «reklama qutisi»). Tayanchdagi «kompaniya e'loni» darsda «reklama» bo'ldi (T-015: «e'lon beruvchi» tashkilotchi deb o'qilardi).
   - **«bepul qism»** — modelning bepul qolgan qismi (K2 va Mentor misoli); **«pullik qism»** · **«qo'shimcha qulaylik»** — Pro, Premium. «qulaylik» — faqat pullik qo'shimcha haqida.
   - **«foyda»** — faqat K2 3/3 kadrida bank so'zi «foydaga chiqqan» (pul ma'nosida); boshqa joyda yo'q (reklama sababi «foyda yo'q» o'rniga — «juda kam», TAYANCHGA SAVOL 5). **«daromad»** — faqat K2 3/3 sahnasida (kelgan pul).
   - **«tekshiruv»** — juftlik varag'i (9-ekran); **«sinov»** — bu darsda yo'q; «test» — ballik savol (o'quvchi matnida «savol»). **«xabar»**, **«hodisa»**, **«test rejim»**, **«narx»** (son bilan) — bu darsda yo'q.
   - **«obuna»** — faqat «pullik obuna»; K2 dagi «obunachilar» → **«Premium'ga pullik obuna bo'lganlar»** (Telegram'da «obunachi» — kanal obunachisi, T-015; TAYANCHGA SAVOL 10).
   - **Ishlatilmaydi:** freemium, subscription, monetizatsiya (yolg'iz, prozada; faqat «monetizatsiya modeli»), biznes-model, CAC, LTV, paywall, «obuna» yolg'iz, podpiska, premium (Pro haqida), VIP, «foyda» (reklama sababida), «server» (bizning Backend haqida), daftar, «darrov», «har doim», «albatta», «hech qachon».
6. **Raqamlar (faqat tayanch 1.0, 1.2, 1.13, 5 va 12-Modul 1.13; o'quvchi matnida «Mentor misolida» / «Mentorning taxmini» / «bu voqeada»):**
   - **Mentor misoli (fakt):** ro'yxatdan o'tgan **44** (12-Modul 1.13; 4-ekran reklama kartasi) · tashkilotchilar **6** (`namuna = false`, kamida bitta o'yin e'lon qilgan — 1.13 2-qatori; 10-ekran SQL natijasi) · Pro — **30 kunlik** pullik obuna (1.0) · namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
   - **Mentorning taxmini:** besh yo'lning «Maydon Jamoa»ga mosligi (tayanch 1.2 «Mentor jadvali — Mentorning taxmini»).
   - **K2 (bank, yili bilan):** pullik obuna — **2022-yil iyun** · **2024-yilda** Premium'ga pullik obuna bo'lganlar **uch barobar** ko'paygan — **12 million** gacha · Telegram birinchi marta foydaga chiqqan (2024) · **2024-yil daromadi 1 milliard dollardan oshgan** (monetizatsiya darsi — bank qoidasi).
     «2025-yil mayda — 15 million» — faqat O'qituvchi eslatmasida (sahnada son ko'paymasin — T-109; TAYANCHGA SAVOL 10). «mln», «mlrd» qisqartmasi yo'q — «million», «milliard» (KORPUS §131).
   - **Boshqa son yo'q:** narx (10 000, 15 000), 3 oy, 30 000, 60 000, 83 000 — bu darsda ochilmaydi (sinf 12; narx — 4-dars kashfiyoti). 43%, 24 — kerak emas. O'quvchi soni — o'zining (Neon yoki taxmin).
7. **Misol-ip — «Maydon Jamoa» (tayanch 1.0):** o'tgan darsda Mentor ikki sonni hisobladi va Pro'ni reja qilib qo'ydi. Bugun — pul kimdan keladi: o'yinchimi, tashkilotchimi, boshqa kompaniyami? Besh yo'l «Maydon Jamoa»ga qo'yib ko'riladi, Mentor bittasini tanlaydi (Qaror-0 2).
   Keys — **K2 Telegram Premium** (6-ekran; ko'prik — tayanch 1.2 so'zi). Ikkinchi misol (P-002) yo'q: testlar va arena Mentor misoli, keys va o'quvchining o'z ishi haqida. Metafora yo'q.
8. **Pul chegarasi (Qaror-0 6; TAQIQLAR 1):** reja ekranida bitta kulrang qator — «Bu modulda haqiqiy pul to'lanmaydi va so'ralmaydi.» · yakuniy «Modelim» kartasi ostida — «Hali hech kim to'lamagan — bu tanlov ham taxmin.» · uyga vazifa kartasi ostida — «Hech kimdan pul so'ramang: bugun faqat model tanlanadi.»
   Tranzaksiya kartasida — «boshqalar nomidan pul yig'ish: yuridik shaxs va shartnoma kerak» (Mentor sababi, yuridik maslahat emas). Narx, karta, to'lov sahifasi yo'q.
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; telefon, odam belgilari, tanga belgisi, bino belgisi, muhrlar, Telegram va Neon maketlari — chizilgan (CSS/SVG), logotip yo'q; ✓ ✕ › ✎ — belgilar.
   «Maydon Jamoa» — telefon maketida o'z rangida (11-Modul 9.62 yashili); **Telegram** — o'z rangida (ko'k), logotipsiz, tanish chat ro'yxati maketida. O'yin qatlami (arena, nishon medali, podium) — mustasno. Matn o'lchovi — «O'lchov» bo'limi (skript bilan sanalgan; qavsdagi sonlar — belgilar soni).
10. **Kod mexanikasi (tayanch 1.2, 4):** Neon SQL Editor — Mentor misolida tashkilotchilar soni:
    `SELECT COUNT(DISTINCT g.tashkilotchi_id) FROM oyinlar g JOIN oyinchilar o ON o.id = g.tashkilotchi_id WHERE o.namuna = false;` → **6** (9.22: «2-darsdagi Neon SQL — o'quvchi o'z to'lovchi bo'lishi mumkin bo'lganlarini sanaydi, Mentor misolida natija 6»).
    O'quvchi — o'z Neon'ida o'z to'lovchi rolini sanaydi (jadval nomini agentdan so'raydi — faqat nom). Rol Database'da bo'lmasa (reklama, B2B, ota-ona) — «Database'da sanab bo'lmaydi» → taxmin yoki «Hozircha bilmayman».
    PM darslarida kod mexanikasi ketma-ket takrorlanmaydi: 1-dars — kod oynasi (JS) · bu dars — Neon SQL · 4-dars — bloklar (tayanch 4).
11. **Saqlash kalitlari (tayanch 8; 9.19):** o'qiydi `pm-m11d1-birlik` (`tur`, `kimTolaydi`; `tur: 'mashq'` bo'lsa — qo'yilmaydi) · `pm-m9d5-prd` (`kim`, `funksiyalar`) · `pm-m10d1-lending` (`nom`) · `pm-m9d8-platforma` (`trek`);
    yozadi `pm-m11d2-model` = `{ model: 'freemium' | 'obuna' | 'reklama' | 'b2b' | 'tranzaksiya', kim, nima, bepul, sabab, rad: [{ model, sabab }], soni: n | null, soniManba: 'database' | 'taxmin' | null, savedAt }`
    — tayanch 8 sxemasi + bitta yangi maydon **`soniManba`** (TAYANCHGA SAVOL 1; 10-FILTR 4 — manba haqiqiy yo'ldan). Maydonlar qoidasi — KOD 8. Kalitga ism, login, telefon yozilmaydi (`kim` — rol). Kod qoralamasi kaliti yo'q (SQL Neon'da yoziladi).
12. **Vaqt (≈ 90 daqiqa — reja; ⛔ «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · kim to'laydi va 1-savol (2–3) ≈ 10 · besh yo'l va 2-savol (4–5) ≈ 15 · keys va 3-savol (6–7) ≈ 12 ·
    modelingiz (8) ≈ 15 · juftlikda tekshiruv (9) ≈ 10 · Neon SQL (10) ≈ 12 · yakuniy savol, podium, kartochkalar, arena (11–14) ≈ 11.
    **Ulgurmasangiz:** 8-ekran — PRD yo'q bo'lsa «Nima bepul» kartasi bitta maydon bilan; rad etilgan model — bitta yetadi · 9-ekran — juftlik vaqti yetmasa yakka rejim ·
    10-ekran — «Hozircha bilmayman» (sanoq uyga — uyga vazifa ③) · yakun sarlavhasi holatga qarab (14-ekran, to'rt holat).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0, Qaror-0 2):** o'tgan darsda Mentor bitta foydalanuvchi qanchaga tushishi va qancha pul keltirishini hisobladi, Pro'ni reja qilib qo'ydi. Bugun — pul kimdan keladi: besh yo'l «Maydon Jamoa»ga qo'yib ko'riladi va Mentor bittasini tanlaydi; undan keyin — to'lov Backend'ga qanday yetib kelishi (3-dars; o'quvchi matnida va'da qilinmaydi — T-038).
- **Dars ipi:** 0 — mahsulotingizga pul kimdan keladi (ballsiz) → 2 — Mentor misolida o'yinchi va tashkilotchi: kim to'laydi va nega (to'lovchi — o'tgan dars so'zi) → 3 — savol → 4 — besh yo'l «Maydon Jamoa»ga: to'rttasi mos emas, bittasi tanlandi — atama «monetizatsiya modeli» →
  5 — savol: Pro pullik obuna bo'lsa, model nega boshqa → 6 — Telegram Premium: bepul qism qisqartirilmagan → 7 — savol: umumiy joy → 8 — o'z modelingiz → 9 — sherik tekshiruvi → 10 — Neon: to'lashi mumkin bo'lganlar → 11 — yakuniy savol → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Pul qayerdan keladi» sahnasi (`ModelSahna`, dars bo'yi, 163/180; bitta manba `MENTOR_ROLLAR` + `YOLLAR` + o'quvchi kaliti `pm-m11d2-model`):**
  - **telefon** (chapda, ≈170×272): «Maydon Jamoa» — «O'yinlar» ekrani, karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; rejimlar: o'yinchi («Qo'shilaman» yonadi) · tashkilotchi («E'lon berish» yonadi) · reklama joyi (o'yinlar ustida kulrang quti, yorlig'i «reklama», matnsiz). Telefon ichida Pro ko'rsatilmaydi — ilovada hali yo'q (9.21).
  - **odamlar** — telefon ostida odam belgilari (bosh, soch, rangli kiyim — D 36): 8 ta o'yinchi va 1 tashkilotchi (kichik «E'lon» belgisi bilan); kerak bo'lganda tashqarida **bino belgisi** (kompaniya) va **maydon egasi** (odam belgisi, maydon chizig'i yonida).
  - **tanga chizig'i** — to'lovchidan «Maydon Jamoa»ga oqadigan chizilgan tanga belgilari (emoji emas): kim to'layotgani shu chiziqdan ko'rinadi; to'lamaydiganlar ustida yashil kichik yorliq «bepul».
  - **Pro kartasi** (telefon yonida, kulrang ramka; yorliq «Mentorning rejasi»): «Pro — 30 kunlik pullik obuna» · «Doimiy o'yin: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi».
  - **yo'l kartasi** (o'ngda, 4-ekran): bitta katta karta «n / 5», ostida muhr — «mos emas» (kulrang) yoki «tanlandi» (yashil); qizil ishlatilmaydi («mos emas» — xato emas).
  - **o'quvchi rejimi** (0, 8–10-ekranlar): telefon o'rnida mahsulot kartasi «{nom}» (`pm-m10d1-lending.nom`; yo'q bo'lsa «Mahsulotim»), to'lovchi belgisi va tanga chizig'i o'quvchi yozganidan (P-046).
  - Ishlatiladi: 0 (kichik) · 1 (o'zi yuradi) · 2 (telefon + odamlar + Pro kartasi) · 3, 5 (javobdan keyin kichik) · 4 (to'liq + yo'l kartasi) · 8 (o'quvchi rejimi) · 9 (ixcham) · 11 (javobdan keyin). 6-ekranda — `PremiumSahna` (keys maketi sahna o'rnini oladi, P-053), 10-ekranda — `NeonMaket`.
    Bir ekranda ko'pi bilan uch blok. `prefers-reduced-motion` da tanga oqimi va kirish to'lqini yo'q — yakuniy holat birdan qo'yiladi. Telefon kengligida (393) yo'l kartasi sahna ostiga tushadi; odam belgilari 9 ta — bir qator, kesilmaydi (E 41).
- **Keyingi bosiladigan joy (qat'iy):** har holatda bitta faol element — yengil halqa (scale ≤ 1.03, sikl ≥ 2 s); tanlov guruhida har variantning o'z chegarasi, to'lqin navbatma-navbat 2 marta (E 40). Yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Jonli ekran (SABOQ 19, E 46):** kirishda elementlar navbat bilan (60–120 ms) · bosish → tanga to'lovchidan mahsulotga uchadi · yangi element bir lahza ajralib kiradi · muhr yumshoq tushadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Mahsulotingiz qanday pul topadi?** (32) — dars nomi (DE-205)
- Mentor: O'tgan darsda keltiradigan pulni hisobladingiz — endi o'sha pul kimdan kelishini o'ylab, javobni tanlang.
- Maket (chap; `ModelSahna` kichik):
  - `pm-m11d1-birlik` bo'lsa (`tur: 'real'`) — o'quvchi rejimi: mahsulot kartasi «{nom}» (`pm-m10d1-lending.nom`; yo'q bo'lsa «Mahsulotim»), ostida 9 ta odam belgisi; kulrang qator «Kim to'lashi mumkin: {kimTolaydi}» (`null` bo'lsa — «hali noma'lum»).
  - Kalit yo'q yoki `tur: 'mashq'` — Mentor misoli: telefon «Maydon Jamoa» («O'yinlar», karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»), ostida o'yinchilar va tashkilotchi belgilari; kulrang qator «Kim to'laydi: ? · Mentor misolida».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Hamma foydalanuvchi oz-ozdan to'laydi (37)
  - Ba'zilari qo'shimcha uchun to'laydi (35)
  - Foydalanuvchi emas, kompaniya to'laydi (38)
- Javob — «Hamma»: **Qiziq fikr! Bunday yo'lda har bir foydalanuvchi ma'lum muddatga to'laydi. Bepul qism bo'lmaydi.** (95)
- Javob — «Ba'zilari»: **Qiziq fikr! Bunday yo'lda asosiy ish bepul qoladi. Pulni qo'shimcha kerak bo'lganlar to'laydi.** (94)
- Javob — «Kompaniya»: **Qiziq fikr! Bunday yo'lda foydalanuvchi to'lamaydi. Kompaniya nima uchun to'lashini topish kerak.** (97)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegarada qotadi, qolgani xiralashadi; sahnada tanga chizig'i shu yo'l bo'yicha chiziladi: «Hamma» — har odam belgisidan tanga mahsulotga uchadi ·
  «Ba'zilari» — bitta belgidan (accent), qolganlari ustida yashil «bepul» · «Kompaniya» — tashqarida bino belgisi kirib keladi, tanga undan; odamlar ustida «bepul». Yo'l nomi ochilmaydi (4-ekran kashfiyoti, P-036). Javob matni variantlar ostida.
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga; uchala javob «Qiziq fikr!» bilan — maqtovsiz, hech biri yolg'onga chiqarilmaydi — KORPUS §119; T-028, T-067). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — uchala yo'l ham bugun ko'rinadi. Sinfdan so'rang: «Siz ishlatadigan bepul ilova pulni qayerdan topadi deb o'ylaysiz?» (javoblar og'zaki, sanalmaydi, qo'l ko'tartirilmaydi). Pul haqida — faqat taxmin: bugun hech kimdan pul so'ralmaydi.
✎ Hook — o'quvchining o'z ishi (o'tgan darsda keltiradigan pulni hisobladi, «kim to'lashi mumkin»ni yozdi) va o'z savoli (P-016). Uch variant — uch oila (hamma to'laydi · bir qismi to'laydi · tashqaridan to'lanadi); payoff hech birini rad etmaydi.
  Mentor gapida yo'l nomlari va «bepul» so'zi yo'q — javobni oldindan aytmaydi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingizga pul topish yo'lini tanlaysiz.** (51)
- Mentor: Tanlov o'tgan darsdagi «kim to'lashi mumkin» javobingizdan boshlanadi. U yozilmagan bo'lsa — bugun yozasiz.
- Chap — «Dars oxirida» + kulrang yorliq **besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya** (App.jsx osti so'zma-so'z, P-015; atamalar faqat yorliqda) + vizual: `ModelSahna` o'zi yuradi (DE-200) —
  telefon «Maydon Jamoa», ostida odam belgilari; tanga chizig'i navbat bilan uch xil yonib o'chadi (hamma odamdan · bitta odamdan · tashqaridagi bino belgisidan) — yo'l nomlari va muhr yo'q (kashfiyot ochilmaydi; SABOQ D 33 — haqiqiy maket, matnsiz bo'sh chiziq yo'q).
  Vizual ostida bitta kulrang qator: Bu modulda haqiqiy pul to'lanmaydi va so'ralmaydi. (50)
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Mentor misolida pulni kim to'lashi mumkinligini ko'rasiz · `to'lovchi`
  - 02 · Pul topish yo'llarini «Maydon Jamoa»ga qo'yib solishtirasiz · `model`
  - 03 · O'z mahsulotingiz uchun bittasini tanlab, sababini yozasiz · `tanlov`
  - 04 · To'lashi mumkin bo'lganlarni Neon'da sanaysiz · `SQL`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Bir gap ayting: bu modulda pul haqida gaplashamiz, lekin hech kim haqiqiy pul to'lamaydi. O'tgan darsning «kim to'lashi mumkin» javobi bo'lmasa — dars to'xtamaydi, o'quvchi 8-ekranda o'zi yozadi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «pul topish yo'li»; «model» — kulrang yorliqda va tegda. Reja 02 «solishtirasiz» deydi, natijani (qaysi biri tanlanishini) ochmaydi (P-015). Mentor reja qadamlarini takrorlamaydi (KORPUS §216). «B2B» yorliqda ochilmagan (App.jsx osti so'zma-so'z) — qisqartma 4-ekran 3-kartasida ochiladi (T-036).

## 2 · Kim to'laydi  ← QTushuncha (ketma-ket, 2 tugma; P-055)
- Eyebrow: Tushuncha · kim to'laydi
- Sarlavha: **Maydon Jamoa pulni kimdan topadi?** (33) — hook savolining o'z so'zi bilan (T-064)
- Mentor: O'tgan darsda Pro tashkilotchi uchun reja edi — ikkala rolni birma-bir bosib, nega shunday ekanini ko'ring.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Tashkilotchi bir xil o'yin e'lonini qanchalik tez-tez qayta yozadi?** · Oyda bir marta (14) · Ikki haftada bir (16) · Har hafta (9) —
  tanlangach yopilmaydi: ixcham qator natijagacha turadi; rol tugmalari shundan keyin yoqiladi.
- Vizual (≤ 3 blok — telefon va odamlar · rol kartasi va Pro kartasi · pastki tugmalar):
  - **chapda** — telefon «Maydon Jamoa» («O'yinlar», karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»), ostida 8 o'yinchi va 1 tashkilotchi belgisi;
  - **o'ngda** — rol kartasi (bosilgan rolning uch qatori: kim · nima qiladi · pul) va uning ostida Pro kartasi (kulrang ramka, yorliq «Mentorning rejasi»; 2-tugmagacha yopiq — faqat sarlavhasi «Pro»);
  - **pastda** — tugmalar qatori (ixcham; joriysi accent, bosilgani ✓): 1 O'yinchi · 2 Tashkilotchi
- Tugmalar (Mentor misoli — tayanch 1.0):
  1. **O'yinchi** → telefonda o'yinchi ko'rinishi: «Qo'shilaman» tugmasi bir lahza yonadi, o'yin kartasidagi «8 / 10» accent bo'ladi; 8 ta o'yinchi belgisi ustida yashil «bepul».
     Rol kartasi: «O'yinchi · o'yinga qo'shiladi · ilova unga bepul». `QIzoh` (tayanch 1.0 sababi): O'yinchilar bo'lmasa o'yin to'lmaydi — shuning uchun ular bepul qoladi. (71)
  2. **Tashkilotchi** → telefonda tashkilotchi ko'rinishi: «E'lon berish» yonadi; telefon ostida hafta kataklari kirib keladi — «Shanba · Shanba · Shanba · Shanba» (sanasiz), har birida o'yin e'loni qayta yoziladi (yozuv harakati navbat bilan);
     keyin Pro kartasi ochiladi: «Pro — 30 kunlik pullik obuna» · «Doimiy o'yin: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi» — hafta kataklaridagi yozuv harakati to'xtab, har birida kichik «o'zi» yozuvi qoladi.
     Rol kartasi: «Tashkilotchi · har hafta o'yin e'lonini qayta yozadi · Pro'ni olishi mumkin»; tanga chizig'i tashkilotchi belgisidan «Maydon Jamoa»ga.
- **Harakat → Vizual o'zgarish:** 1-tugma → telefon o'yinchi ko'rinishiga o'tadi, o'yinchilar ustida «bepul»; 2-tugma → telefon tashkilotchi ko'rinishiga o'tadi, hafta kataklarida e'lon qayta yoziladi, Pro kartasi ochilib, kataklarda «o'zi» qoladi, tanga faqat tashkilotchidan uchadi.
  Xato harakat yo'q; bosilgan tugma qayta bosilsa — ko'rinish qaytadi, natija o'zgarmaydi.
- Natija (bitta yashil blok; `tugadi` — tugmalar qatori yopiladi, telefon va rol kartasi butun enga; vizual ⛶ ichida — q17/q18): birinchi kichik qator — «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: har hafta» (tanlangan javob qaytarilmaydi — E 42).
- Xulosa: Mentor rejasida pulni tashkilotchi to'laydi: Pro uning har haftalik ishini oladi. O'yinchilar bepul qoladi. (107)
- Tugma (pastki): Avval belgilang → Rollarni bosing (n/2) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan rol tugmasini bosing — telefonda nima o'zgarishini ko'ring. (68)
- Keyingi bosiladigan joy: bashorat variantlari → «O'yinchi» → «Tashkilotchi» → «Davom etish».
- Mentor rejimi: proyektorda shu sahna; Mentor tugmalarni o'zi bosadi, sinf bashoratni ovoz bilan aytadi.
- O'qituvchi eslatmasi: Pro — hali Mentorning rejasi: ilovada yo'q, bu darsda qachon qurilishi aytilmaydi. «To'lovchi» — o'tgan darsdagi so'z: pul to'laydigan foydalanuvchi; bu yerda «to'lashi mumkin» ma'nosida — hech kim to'lamagan.
  Mentor sababi (tayanch 1.0): tashkilotchi har hafta e'lonni qayta yozadi va odam chaqiradi — Pro shu ishni oladi; o'yinchilar bepul qoladi — ular bo'lmasa o'yin to'lmaydi. Sahnadagi to'rtta Shanba — namuna, son emas.
  Sinfga savol: «Sizning mahsulotingizda kim har hafta bir xil ishni qayta qiladi?» (javoblar og'zaki, sanalmaydi).
✎ Ekran tayanch 1.0 dagi Mentor sababini ikki rol orqali ko'rsatadi (9.21: «2-darsda — Mentor tanlovi va sababi»). Model nomi bu ekranda aytilmaydi — u 4-ekranda (beshta yo'l solishtirilgandan keyin) tug'iladi. «Odam chaqirish» qismi — TAYANCHGA SAVOL 8.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; Mentor misoli)
- Eyebrow: Tekshiruv · kim to'laydi (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Mentor rejasida kim to'laydi va nega?** (6 so'z)
  - A — O'yinchi: u har o'yinga qo'shiladi (34)
  - B — Maydon egasi: o'yin uning maydonida (35)
  - ✔ C — Tashkilotchi: Pro haftalik ishini oladi (39)
  - D — Tashkilotchi: Pro'siz e'lon bera olmaydi (40)
- Kalit: **C** (index 2). To'rttalasi bir shaklda («Rol: sabab»); «Tashkilotchi» C va D da, «Pro» C va D da — kalit so'z faqat to'g'rida emas; tire va qo'shtirnoq yo'q.
- To'g'ri izohi: Pro tashkilotchining haftalik o'yin e'lonini o'zi qiladi. (57)
- Xato izohlari (≤60; javobni aytmaydi):
  - A: O'yinchilar o'yinni to'ldiradi — ular to'lasa, nima bo'ladi? (60)
  - B: Maydon egasi ilovadan foydalanadimi? Kim foydalanadi? (53)
  - D: E'lon berish bepul qoladi — unda Pro nimani oladi? (50)
  - (umumiy) Tashkilotchi har hafta nima qilishini eslang. (45)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): 2-ekran sahnasi ixcham — tanga faqat tashkilotchidan, o'yinchilar ustida «bepul».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Who Pays! — birinchi urinishda to'g'ri.
- Izoh (MD): distraktor turkumlari har xil (sinf 8): A — noto'g'ri rol (o'yinchilar bepul qoladi) · B — boshqa to'lovchi (ilova maydon egasiga xizmat qilmaydi — 4-ekranda yana ko'rinadi; savol «Mentor rejasida» bilan himoyalangan) · D — bepul qismni qisqartirish (e'lon berish bepul — tayanch 1.0: Pro'da bitta qulaylik).
  Savol «rejasida» deydi — hech kim hali to'lamagan (T-045).

## 4 · Besh yo'l  ← QTushuncha (ketma-ket bitta karta, 5 karta; P-055, E 53)
- Eyebrow: Tushuncha · pul topish yo'llari
- Sarlavha: **Maydon Jamoa'ga qaysi yo'l mos keladi?** (38) — 2-ekran savolining davomi (T-064)
- Mentor: Har kartada «Maydon Jamoa'ga qo'yish»ni bosing — telefonda nima o'zgarishini kuzating.
- Bashorat (ballsiz; S-015 — bitta o'lchov: nechtasi, o'sish tartibida): **Bu yo'llardan nechtasi Maydon Jamoa'ga hozir mos keladi?** · Bittasi (7) · Ikki-uchtasi (12) · Hammasi (7) — tanlangach ixcham qator natijagacha turadi; birinchi karta shundan keyin ochiladi.
- Vizual (≤ 3 blok): **chapda** — `ModelSahna` (telefon, odamlar, tanga chizig'i) · **o'ngda** — bitta katta yo'l kartasi (tepasida ixcham besh nuqta — o'tilgani ✓, joriysi accent; karta ichida «n / 5») · **pastda** — kartadagi tugma «Maydon Jamoa'ga qo'yish», keyin «Keyingi yo'l».
- Har karta bir xil tartibda (T-011 — avval hodisa, keyin nom): ① hodisa gapi (karta tepasida) → ② «Maydon Jamoa'ga qo'yish» → sahna o'zgaradi → ③ nom yorlig'i kirib keladi «Bu — {nom}» → ④ yorliq «Mentorning taxmini» ostida bir qator sabab → ⑤ muhr. Keyingi kartaga o'tganda oldingisi ixcham qatorga yig'iladi (nom + muhr).
  1. **Hodisa:** «Har bir foydalanuvchi ma'lum muddatga pul to'laydi.» → nom **pullik obuna — hamma to'laydi** →
     sahna: har odam belgisidan tanga chiqadi; keyin uch o'yinchi belgisi xiralashib, ustida «?», o'yin kartasidagi son «? / 10» bo'ladi. Qator: Telegram guruhi bepul — o'yinchilar ketsa, o'yin to'lmaydi. (59) Muhr: **mos emas**.
  2. **Hodisa:** «Boshqa kompaniya o'z mahsulotini ilovada ko'rsatish uchun to'laydi.» → nom **reklama** →
     sahna: telefonda o'yinlar ustida kulrang quti (yorlig'i «reklama», matnsiz, logotipsiz) paydo bo'ladi; tashqarida bino belgisi, tanga undan; odamlar ustida «bepul»; telefon tepasida kichik yorliq «44 foydalanuvchi».
     Qator: 44 foydalanuvchi reklama beruvchiga juda kam; o'smirlar ma'lumotini Mentor reklamaga bermaydi. (94) Muhr: **mos emas**.
  3. **Hodisa:** «Mahsulot boshqa biznesning o'z ishiga xizmat qiladi — pulni o'sha biznes to'laydi.» → nom **B2B — boshqa biznes to'laydi** →
     sahna: telefon yonida maydon chizig'i va maydon egasi (odam belgisi), tanga undan chiqadi, lekin telefondan unga chiziq yo'q (uzuq); telefon ustida muammo gapi qatori yonadi: «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.»
     Qator: Maydon egasi to'lashi mumkin edi, lekin ilova bugun unga xizmat qilmaydi — muammo gapida u yo'q. (96) Muhr: **mos emas**.
  4. **Hodisa:** «Ilova orqali o'tadigan har to'lovdan bir ulush oladi.» → nom **tranzaksiya — har to'lovdan ulush** →
     sahna: o'yinchilardan tangalar telefon orqali maydon tomonga oqadi, kichik bo'lagi telefonda qoladi; keyin oqim ustiga qulf belgisi tushadi; burchakda kulrang teg «roadmap: uzoqroq».
     Qator: Maydon pulini bo'lishish — boshqalar nomidan pul yig'ish: yuridik shaxs va shartnoma kerak. (91) Muhr: **mos emas**.
  5. **Hodisa:** «Asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik.» → nom **bepul asos va pullik qo'shimcha** →
     sahna: o'yinchilar ustida yashil «bepul», tashkilotchi yonida Pro kartasi (2-ekrandagi), tanga faqat tashkilotchidan.
     Qator: O'yinchilar bepul qoladi, Pro'ni tashkilotchi oladi. Pro — pullik obuna, lekin faqat qo'shimcha uchun. (102) Muhr: **tanlandi** (yashil).
- **Harakat → Vizual o'zgarish:** «Maydon Jamoa'ga qo'yish» → tanga chizig'i shu yo'l bo'yicha qayta chiziladi va telefonda o'sha yo'lning belgisi chiqadi (son «?», reklama qutisi, maydon egasi, qulf, Pro kartasi); nom yorlig'i va muhr tushadi; «Keyingi yo'l» → karta chapga suriladi, keyingisi kiradi, nuqtalar qatorida ✓.
- Natija (bitta yashil blok; `tugadi` — tugmalar yopiladi, yo'l kartasi o'rnida besh ixcham qator: to'rtta kulrang «mos emas», bittasi yashil «tanlandi»; sahna 5-yo'l holatida; ⛶ ichida):
  birinchi kichik qator — «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bittasi».
- Xulosa: Mahsulot qanday pul topishi — monetizatsiya modeli deyiladi. Mentor yo'llarni solishtirib, bittasini tanladi. (109) — atama shu yerda tug'iladi (T-011)
- Tugma (pastki): Avval belgilang → Kartalarni oching (n/5) → Davom etish
- Ipucha (40 s): Kartadagi «Maydon Jamoa'ga qo'yish»ni bosing — telefon o'zgaradi. (65)
- Keyingi bosiladigan joy: bashorat → «Maydon Jamoa'ga qo'yish» → «Keyingi yo'l» (×5) → «Davom etish».
- Mentor rejimi: proyektorda shu sahna; Mentor kartalarni o'zi ochadi, har kartada sinfdan «Bu yerda kim to'laydi?» deb so'raydi.
- O'qituvchi eslatmasi: «Mos emas» — Mentor misolida va hozir; boshqa mahsulotda boshqa yo'l mos kelishi mumkin. Har sabab — Mentorning taxmini (tayanch 1.2).
  Reklama: «o'smirlar ma'lumoti» — Mentor qarori, qonun haqida gapirmang. B2B: maydon egasi pul to'lashi mumkin edi, lekin ilova unga xizmat qilmaydi — muammo gapi o'yinchilar haqida.
  Tranzaksiya: «Maydon pulini bo'lishish» — 11-Modul roadmap'ida «uzoqroq»; bu darsda so'z faqat to'lov ma'nosida — boshqa ma'nolarini tilga olmang. «Yuridik shaxs» so'ralsa — davlatda qayd etilgan firma yoki tashkilot; bu kursda hech kim boshqalar nomidan pul yig'maydi (keyingi darslarni va'da qilmang — T-038).
  Pro ham pullik obuna, lekin model «pullik obuna» emas: hamma to'lamaydi — keyingi savol shuni so'raydi.
✎ Besh model — tayanch 1.2 Mentor jadvali (har yo'lning sababi tayanch so'zi bilan; reklama sababi so'zlari — TAYANCHGA SAVOL 5). Tartib — jadvaldan farqli: tanlangan yo'l oxirida (kashfiyot oxirgi kartada; bashorat «bittasi» ochilib qolmasin). Model nomi har kartada hodisadan keyin; umumiy atama — xulosada.

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; Mentor misoli)
- Eyebrow: Tekshiruv · model (savol ustida yorliq yo'q)
- Savol: **Pro pullik obuna bo'lsa, model nega boshqacha nomlanadi?** (8 so'z)
  - ✔ A — Pro'dan boshqa hamma ish bepul qoladi (37)
  - B — Pro'ga hali hech kim pul to'lamagan (35)
  - C — Pro bilan birga ilovada reklama turadi (38)
  - D — Bepul qism yo'q, hamma Pro'ni oladi (35)
- Kalit: **A** (index 0). «Pro» A, B, C, D da; «bepul» A va D da — kalit so'z faqat to'g'rida emas; to'rttalasi bir shaklda (darak gap), tire va qo'shtirnoq yo'q.
- To'g'ri izohi: Pullik faqat qo'shimcha — asosiy ish hamma uchun bepul. (55)
- Xato izohlari:
  - B: Rost, hali to'lov yo'q. Lekin modelda nima bepul qoladi? (56)
  - C: Mentor rejasida reklama yo'q — bepul nima qoladi? (49)
  - D: Mentor rejasida o'yinchilar Pro oladimi? (40)
  - (umumiy) Pullik obuna modelida kim to'lashini eslang. (44)
- Javob topilgach (kichik, savol ostida): 4-ekran 5-kartasi ixcham — o'yinchilar ustida «bepul», tanga faqat tashkilotchidan, muhr «tanlandi».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: yo'q (P-048 — nishonlar 3, 7, 8, 10-ekranlarda).
- Izoh (MD): turkumlar (sinf 8): B — rost, lekin mos emas (to'lov yo'qligi modelni belgilamaydi; S-004) · C — boshqa yo'l aralashgan (reklama) · D — model teskari o'qilgan (bepul qism yo'q, hamma oladi — bu «pullik obuna — hamma to'laydi» bo'lardi). Bitta himoyalanadigan javob: Mentor rejasida faqat «Doimiy o'yin» pullik (tayanch 1.0).
  Kalit ibora 3-ekran bilan takrorlanmaydi (S-008): 3 — kim va nega to'laydi; 5 — Pro va model nomi farqi.

## 6 · Telegram Premium  ← QVoqea (PM keys K2; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Telegram pul topish uchun nimani qo'shdi?** (41) — 0-ekran «pul topadi» so'zi bilan; javobni Mentor 1/3 da aytadi (sarlavhani takrorlamaydi — T-072)
- Nuqtalar (3) · yorliq **Telegram Premium · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Telegram** (o'z rangida) — xabar almashish ilovasi · **Telegram Premium** — Telegram'ning pullik obunasi. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har kadrda almashadi (≤2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket; takror matn yo'q.
- Sahna (`PremiumSahna`, chizilgan CSS/SVG telefon maketi; bankda yo'q narsa chizilmaydi — Premium'dagi qulaylik nomlari, narx, interfeys tugmalari yo'q):
  - 1/3 **2022-yil iyun** — Mentor: 2022-yil iyunda Telegram pullik obunani ishga tushirdi — Telegram Premium.
    · sahna: telefon, tepada «Telegram» (o'z rangida); chatlar ro'yxati — uch qator: «Sinf chati» · «Oila» · «Futbol guruhi» (bezak, sonsiz); ro'yxat ustiga yangi qator «Telegram Premium» kirib keladi (accent).
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov: bepul qismdan qanchasi pullik bo'ldi, kam → ko'p): **Premium chiqqanda bepul Telegram'da nima o'zgardi?** · Hech narsa qisqartirilmadi (26) · Ba'zi narsalar pullik bo'ldi (28) · Hammasi pullik bo'ldi (21)
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Bepul qism** — Mentor: Bepul Telegram qisqartirilmadi — Premium ustiga qulaylik qo'shdi.
    · sahna: telefon ikki qatlamga ajraladi: pastda «Bepul Telegram» — o'sha uch chat, har birida yashil ✓, hech biri qulflanmagan; ustida yupqa «Premium» qatlami — «+ qulaylik» (nomsiz: bank qulaylik turini aytmaydi).
  - 3/3 **2024-yil** — Mentor: 2024-yilda Premium'ga pullik obuna bo'lganlar uch barobar ko'paydi — 12 million gacha. O'sha yili Telegram birinchi marta foydaga chiqdi.
    · sahna: telefon kichrayib chapga suriladi; o'ngda ikki alohida karta (orasida strelka yo'q — sabab chizilmaydi, sinf 5): «2024 · Premium'ga pullik obuna bo'lganlar» — ustun uch barobar o'sadi, ustida «×3 · 12 million gacha» ·
      «2024 · Telegram» — «birinchi marta foydaga chiqdi» va ostida kulrang «daromad — 1 milliard dollardan ko'p».
- Bashorat natijasi (2/3 kadrida, `QTaxmin`): «Taxminingiz: … · haqiqatda: hech narsa qisqartirilmadi» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (yangi element bir lahza ajralib kiradi; 3/3 da ustun o'sib chiqadi).
- Xulosa (3/3 dan so'ng, pastda, yashil): Bu voqeada bepul Telegram qisqartirilmagan, Premium ustiga qo'shilgan. Mentor ham bepul qismni qisqartirmaydi. (110)
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- O'qituvchi eslatmasi: Faqat bank faktlari: 2022-yil iyun · bepul qism qisqartirilmagan · 2024-yilda Premium'ga pullik obuna bo'lganlar uch barobar (12 million gacha; 2025-yil mayda — 15 million) · 2024-yilda birinchi marta foydaga chiqqan · 2024-yil daromadi 1 milliard dollardan oshgan.
  Premium'da qaysi qulayliklar borligi, narxi — bankda yo'q: so'ralsa, «bu voqeada aytilmagan» deng. «Premium tufayli foydaga chiqdi» demang — voqea ikkalasi bir yilda bo'lganini aytadi, sababini emas.
  12 million va 1 milliard — Telegram'ning sonlari, o'quvchi mahsulotiga maqsad emas. Ko'prik — umumiy joy: «Maydon Jamoa» Telegram emas, faqat bepul qismni qisqartirmaslik qarori bir xil.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K2 (176–179-qator; ruscha asli — «Manbalar» bo'limida) · tayanch 5 (o'zbekcha matn, brend izohlari, ko'prik).
✎ Ko'prik gapi — tayanch 1.2 dan, xulosa chegarasi (≤110) uchun bitta so'z qisqardi: «Premium ustiga qulaylik qo'shgan» → «Premium ustiga qo'shilgan» («qulaylik» — 2/3 Mentor gapida; TAYANCHGA SAVOL 11).

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; keys ko'prigi)
- Eyebrow: Tekshiruv · Telegram Premium
- Savol: **Telegram Premium va Mentor tanlovida nima umumiy?** (7 so'z) · savol ustida yorliq yo'q
  - A — Hamma foydalanuvchi har oy pul to'laydi (39)
  - B — To'laydiganlar uch barobar ko'paydi (35)
  - C — Bepul qismdan bir qismi pullik bo'ldi (37)
  - ✔ D — Pullik qism bepul qism ustiga qo'shildi (39)
- Kalit: **D** (index 3). «bepul» C va D da, «pullik» A, C, D da, «qism» C va D da — kalit so'z faqat to'g'rida emas; tire va qo'shtirnoq hech birida yo'q.
- To'g'ri izohi: Ikkalasida ham bepul qism qisqartirilmaydi. (43)
- Xato izohlari:
  - A: Mentor rejasida o'yinchilar to'laydimi? (39)
  - B: Bu Telegram'ning soni — Mentor misolida bormi? (46)
  - C: Bu voqeada bepul Telegram qisqartirildimi? (42)
  - (umumiy) Bepul qism bilan nima bo'lganini eslang. (40)
- Javob topilgach (kichik, savol ostida): 6-ekran 2/3 kadri — ikki qatlam (bepul pastda, Premium ustida) va yonida 4-ekranning 5-kartasi — o'yinchilar «bepul», Pro ustida.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Free Part! — birinchi urinishda to'g'ri.
- Izoh (MD): savol «umumiy joy»ni so'raydi (tayanch 5 — ko'prik tenglik emas). Turkumlar (sinf 8): A — boshqa yo'l (hamma to'laydi; ikkalasida ham emas) · B — rost, lekin faqat Telegram haqida (Mentor misolida to'laydigan hali yo'q; haqiqiy hayotda ham umumiy emas) · C — voqea teskari o'qilgan (bankka zid).
  Distraktorlar Telegram haqida yolg'on fakt aytmaydi: A va C — «umumiy» sifatida noto'g'ri; B — Telegram uchun rost, Mentor uchun emas. Ikkala trekka to'g'ri.

## 8 · Modelingiz  ← QMustaqil (USTAXONA — ketma-ket karta, 3 karta; E 43, E 53)
- Eyebrow: Mustaqil ish · model
- Sarlavha: **Mahsulotingizga kim va nima uchun to'laydi?** (43)
- Mentor: Har kartani to'ldirib, «Keyingi»ni bosing — model oxirgi kartada tanlanadi.
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlanadi; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m11d1-birlik.kimTolaydi` (`tur: 'real'`) → 1-kartadagi «Kim to'laydi» maydoniga (rol matni yoki «hamma foydalanuvchi»; `null` — bo'sh); maydon ostida kulrang «o'tgan darsdagi javobingiz». `tur: 'mashq'` bo'lsa — qo'yilmaydi (9.19: mashq sonlari o'quvchiniki emas).
  - `pm-m9d5-prd.kim` → 1-kartada kulrang qator «PRD da kim uchun: {kim}» · `pm-m9d5-prd.funksiyalar` (3) → 2-kartada uch funksiya qatori.
  - `pm-m10d1-lending.nom` → sahna kartasidagi mahsulot nomi; yo'q bo'lsa «Mahsulotim».
  - `pm-m11d2-model` avval saqlangan bo'lsa — hamma kartalar shundan to'ldiriladi («Yangilash» rejimi).
- **Tepada — ixcham chiziq «Modelim · n/3»:** karta nomlari (Kim to'laydi · Nima bepul · Model), to'ldirilgani ✓ (bo'sh uzuq qatorlar yo'q).
- **Markazda — bitta katta karta (joriy):**
  1. **Kim to'laydi** — maydon (yorliq input ichida — E 43) `Kim to'laydi? Rolini yozing, ism emas` · tugma «Hamma foydalanuvchi» · maydon `Nima uchun to'laydi? Pullik qism unga nima beradi`.
     Jonli qator (karta ostida): sahnada to'lovchi belgisi accent bo'ladi va undan tanga chizig'i chiziladi; «hamma foydalanuvchi» — har belgidan.
  2. **Nima bepul** — PRD bo'lsa: uch funksiya qatori (nomi), har birida ikki tugma «bepul» · «pullik» (dastlab — «bepul»); ostida maydon `Yana nima bepul qoladi? Bo'lmasa — bo'sh qoldiring`.
     PRD yo'q bo'lsa: bitta maydon `Bepul qismda nima qoladi? Hech narsa bo'lmasa — shunday yozing`.
     Jonli qator: «Bepul: {n} · pullik: {m}» (PRD qatorlaridan); sahnadagi mahsulot kartasi ichida funksiya nomlari ikki guruhga ajraladi — «bepul» (yashil) va «pullik» (to'lovchi tomonda).
  3. **Model** — besh tugma (bir qatorda ikki-uch, ixcham), har birining nomi va ostida kichik kulrang kim to'lashi:
     «Bepul asos va pullik qo'shimcha» — «qo'shimchani olganlar» · «Pullik obuna» — «hamma foydalanuvchi» · «Reklama» — «reklama bergan kompaniya» · «B2B» — «xizmat olgan biznes» · «Tranzaksiya» — «har to'lovdan ulush».
     Maydon `Nega aynan shu? Mahsulotingizdan bitta fakt yozing`. Ostida — **«Rad etgan modelingiz»**: qolgan to'rtta model tugmasi (bittasini tanlash) + maydon `Nega mos emas?` · «+ Yana bitta» (ko'pi bilan to'rtta).
  O'ngda: «Keyingi» → 3-kartada «Saqlash» (187).
- **Yakuniy karta «Modelim»** (3/3 dan keyin; butun enga — `ModelSahna` o'quvchi rejimi: mahsulot kartasi, to'lovchi belgisi, tanga chizig'i, «bepul» yorliqlari): model nomi (accent) · «Kim to'laydi: …» · «Nima uchun: …» · «Bepul qoladi: …» · «Sabab: …» · «Rad etildi: {model} — {sabab}»; har qatorda ✎.
  Karta ostida bitta kulrang qator: Hali hech kim to'lamagan — bu tanlov ham taxmin. (48)
  «Saqlash» (o'ngda) → `pm-m11d2-model`; saqlangandan keyin tugma «Yangilash».
- Tekshiruv (`QXato`, ≤60; «Keyingi» yoki «Saqlash» bosilganda; yumshoqlari ikkinchi bosish bilan o'tadi):
  - kim bo'sh, tugma bosilmagan (bloklaydi): Kim to'lashini yozing yoki tugmani bosing. (42)
  - nima bo'sh (bloklaydi): Pullik qism unga nima berishini yozing. (39)
  - model tanlanmagan (bloklaydi): Modellardan bittasini tanlang. (30)
  - sabab 8 belgidan qisqa (bloklaydi): Nega aynan shu — mahsulotdan bitta fakt yozing. (47)
  - rad etilgan model yo'q (bloklaydi): Kamida bitta modelni rad etib, sababini yozing. (47)
  - rad sababi bo'sh (bloklaydi): Bu model nega mos emasligini yozing. (36)
  - model «bepul asos…», bepul qism bo'sh yoki «hech narsa» (yumshoq): Bepul asos tanlandi — bepul nima qoladi? (40)
  - model «pullik obuna», kim — «hamma foydalanuvchi» emas (yumshoq): Pullik obunada hamma to'laydi — «Kim to'laydi»ga qarang. (56)
  - model «reklama» yoki «B2B», kim — «hamma foydalanuvchi» (yumshoq): Bu modelda foydalanuvchi emas, kompaniya to'laydi. (50)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; Mentor misoli — namuna, umumiy qolip emas):
  Mentor misolida: kim to'laydi — tashkilotchi; nima uchun — «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi; bepul qoladi — o'yin e'loni, qo'shilish, chiqish va navbat; model — bepul asos va pullik qo'shimcha; sabab — o'yinchilar bo'lmasa o'yin to'lmaydi; rad etildi — pullik obuna: Telegram guruhi bepul.
  Mentorning tanlovi sizga majburiy emas: mahsulotingizda boshqa model mos kelishi mumkin. To'lovchi — rol bilan («ota-ona», «o'quv markazi»), ism emas. Web-trekda ham shunday.
- **Harakat → Vizual o'zgarish:** maydon yozilsa yoki tugma bosilsa — sahnada to'lovchi va «bepul» yorliqlari shu zahoti o'zgaradi; «Keyingi» → karta chapga suriladi, keyingisi kiradi, tepadagi chiziqda ✓;
  model tugmasi → sahnada tanga chizig'i shu model bo'yicha qayta chiziladi; 3/3 → karta yopiladi, «Modelim» kartasi butun enga; «Saqlash» → karta bir lahza yashil, chiziq «Modelim ✓».
- Xulosa (o'quvchi ma'lumotidan, P-046): «{model nomi}: {kim} to'laydi — {nima}. Bepul qoladi: {bepul}.» (≈80; `bepul` bo'sh bo'lsa ikkinchi gap yo'q)
- Tugma (pastki): Kartalarni to'ldiring (n/3) → Saqlang → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy kartaning birinchi bo'sh maydoni (accent, to'lqin) → «Keyingi» → «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Modelim · n/3» (ixcham); 9, 10-ekranlarda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon: My Model! (saqlanganda — bonus, ish bajarilgan; P-048).
- Mentor rejimi: forma o'rniga Mentor misolining «Modelim» kartasi (Yordamdagi qatorlar). Mentor statistikasi: «Modelni saqlaganlar».
- O'qituvchi eslatmasi: Tanlovni baholamang — bugun u taxmin: hali hech kim to'lamagan. Mentor modelini ko'chirish shart emas; reklama yoki B2B tanlagan o'quvchi to'lovchi sifatida kompaniya rolini yozadi (masalan, «o'quv markazi») — bugun hech kimga yozilmaydi va hech kimdan pul so'ralmaydi.
  To'lovchi — rol bilan, ism yozilmaydi. Sinfda kim qaysi modelni tanlaganini qo'l ko'tartirib sanamang.

## 9 · Juftlikda tekshiruv  ← QMustaqil (juftlik, 3 tugma; yakka rejim bor)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Modelingizni sherigingizga tushuntira olasizmi?** (47) · yakka rejimda: **Modelingizni o'zingiz tekshira olasizmi?** (40)
- Mentor: Avval «1 daqiqani boshlash»ni bosib gapiring — keyin qurilmangizni uzating, u har savolga belgi qo'yadi.
  Yakka rejimda: Savollarni o'zingizga bering va har biriga halol belgi qo'ying.
- Tugmalar (ixcham, tepada): 1 Ayting · 2 Belgilang · 3 Tuzating
- 1-tugma: «Modelim» kartasi (8-ekrandan, ixcham) butun enga; taymer «1 daqiqani boshlash» · «To'xtatish» (1:00 dan keyin to'xtamaydi — kulrang «+m:ss»). Juftlik yo'rig'i (bir qator): Avval A aytadi, B tinglaydi; keyin almashasiz. (46)
- 2-tugma — tekshiruv varag'i (sherik to'ldiradi, gapiruvchining qurilmasida; bitta manba `SHERIK_SAVOL`): har qator — savol · ✓ / ✕ · izoh (placeholder: `Nima yetishmadi?`):
  1) «Kim to'laydi va nima uchun to'laydi — aniq aytildimi?»
  2) «Nega aynan shu model — sabab mahsulotdagi faktdanmi?»
  Mentor gapi 2-tugmada (almashadi): Gap tugagach, qurilmangizni sherigingizga bering — u har savolga ✓ yoki ✕ qo'yadi.
- 3-tugma — tuzatish: ✕ olgan qatorni bosish → 8-ekrandagi tegishli karta ochiladi (1-savol — «Kim to'laydi», 2-savol — «Model») → o'zgartirib «Saqlash» → qatorda ✕ yonida yorliq «o'zgartirildi» (✕ o'chmaydi: sherik qayta baholamagan — 12-Modul 9.44 d).
  Ikkala qator ✓ bo'lsa — tuzatish yo'q, «Davom etish» ochiladi (yo'q kamchilik o'ylab topilmaydi).
  Mentor gapi 3-tugmada: ✕ olgan qatorni bosib, sherigingiz izohiga qarab kartani o'zgartiring.
- Tekshiruv (`QXato`, ≤60):
  - belgisiz qator (bloklaydi): Har savolga ✓ yoki ✕ qo'ying. (29)
  - ✕ qatorida izoh 8 belgidan qisqa (bloklaydi): ✕ qo'ydingiz — nima yetishmaganini bir qatorda yozing. (54)
  - izohda «yomon», «zerikarli», «yoqmadi» (yo'naltiradi): Odam haqida emas — modelda nima yetishmadi? (43)
  - tuzatishda hech bir maydon o'zgarmagan (bloklaydi): Karta o'zgarmadi — sherigingiz izohini qayta o'qing. (52)
- Vizual: chapda — «Modelim» kartasi (ixcham, sahna bilan); o'ngda — 2–3-tugmada varaq. Telefon yo'q (bo'sh ustun yo'q — SABOQ 20).
- **Harakat → Vizual o'zgarish:** taymer → chiziq to'lib boradi; varaqda ✓ — qator yashil, ✕ — `err` chet; «Saqlash» → «Modelim» kartasidagi o'zgargan qator bir lahza accent, sahnada tanga chizig'i qayta chiziladi, varaq qatorida «o'zgartirildi».
- Xulosa (o'quvchi ma'lumotidan): ✕ bo'lsa — «Ikki savoldan {a} tasiga ✓; ✕ qatorlarda karta o'zgartirildi.» · hammasi ✓ — Ikkala savolga javob bor: modelingiz sababi bilan aytildi. (58)
- Tugmalar: Orqaga · Davom etish (ikkala qator belgilangach; ✕ bo'lsa — kamida bittasi o'zgartirilgach)
- Saqlanadi: o'zgartirilgan karta — `pm-m11d2-model` (`savedAt` yangilanadi). Varaqning o'zi kalitga yozilmaydi (TAYANCHGA SAVOL 12).
- Keyingi bosiladigan joy: «1 daqiqani boshlash» → «To'xtatish» → varaq qatorlari (✓ / ✕) → ✕ qator → «Saqlash».
- Mentor rejimi: proyektorda Mentor misolining «Modelim» kartasi va ikki savol; Mentor savolni o'qiydi, sinf og'zaki javob beradi (qo'l ko'tartirib sanash yo'q).
- O'qituvchi eslatmasi: ≈ 2 × 3 daqiqa + tuzatish. Sherik model haqida yozadi, odam haqida emas; modelni «yaxshi» yoki «yomon» deb baholamaydi — faqat ikki savolga javob bormi.
  «Taxmin» — xato emas: hali hech kim to'lamagan. 2-savolda «fakt» — mahsulotdagi narsa (kim nima qiladi, nima ko'p takrorlanadi), «menga yoqadi» emas.
✎ Ikki savol — dastur natijasidagi «asoslangan» so'zining ikki qismi: kim va nima uchun to'laydi · sabab mahsulotdan (TAYANCHGA SAVOL 12). Sarlavhada son yo'q (P-062 — miqdor varaqning o'zida).

## 10 · Kod yozish: SQL  ← QKod (Neon varianti — kod oynasi o'rnida Neon maketi; 12-Modul 10-dars 9-ekran naqshi; tayanch 1.2)
- Eyebrow: Kod yozish · Neon
- Sarlavha: **To'lashi mumkin bo'lganlarni sanaydigan SQL yozamiz.** (52) — PM-082 (a) sarlavha oilasi (korpus §19; 12-Modul 10-dars «…sanaydigan SQL yozamiz»)
- Mentor: Mentor misolida bular — o'yin e'lon qilgan tashkilotchilar: avval SQL'dagi bo'sh joyni to'ldiring.
  Darvozadan keyin Mentor gapi almashadi: Endi Neon'da o'z to'lovchi rolingizni xuddi shunday sanang.
- Darvoza-mashq (PM-082 c/e, SQL oldidan, ballsiz): **Masalan, bir tashkilotchi uchta o'yin e'lon qilgan. Qaysi qator uni bir marta sanaydi?** · ✔ `COUNT(DISTINCT g.tashkilotchi_id)` · `COUNT(g.tashkilotchi_id)` · `COUNT(*)`
  - xato `COUNT(g.tashkilotchi_id)`: Bu har o'yin e'lonini sanaydi — u uch marta kiradi. (51) (belgisiz)
  - xato `COUNT(*)`: Bu o'yinlar qatorini sanaydi, tashkilotchilarni emas. (53) (belgisiz)
- Chap (vazifa, 3 band; bosiladigan katakcha emas — qadam ro'yxati):
  1 Neon'da loyihangizni tanlang va SQL Editor'ni oching.
  2 To'lovchi rolingiz qaysi jadvalda ekanini toping va SQL'ni o'zingiz yozing.
  3 «Run»ni bosing va Neon ko'rsatgan sonni pastga yozing.
  Web-trek qatori (trek `web` bo'lsa yoki kalit yo'q bo'lsa; kulrang): Web-trekda ham shunday: saytingizning Database'ida to'lovchi rolini sanaysiz. (77)
  Model qatori (8-ekranda «reklama» yoki «B2B» tanlangan bo'lsa; kulrang): Modelingizda kompaniya to'laydi — u Database'da yo'q: taxminingizni yozing. (75)
- SQL (ekranda; nusxalash tugmasi yo'q — qo'lda yozganda o'rganiladi, korpus §19):
```sql
SELECT COUNT(______ g.tashkilotchi_id)
FROM oyinlar g
JOIN oyinchilar o ON o.id = g.tashkilotchi_id
WHERE o.namuna = false;
```
  ostida kulrang: `oyinlar` va `oyinchilar` — Mentor misolidagi jadvallar. Sizda nomlar boshqacha bo'lishi mumkin. (96)
- Maydon (vazifa ostida; yorliq input ichida — E 43): `Neon ko'rsatgan son` (raqam) · ikkinchi tugma (chegarali) «Database'da sanab bo'lmaydi» → maydon `Taxminingiz: nechtasi to'lashi mumkin?` (yonida yorliq «taxmin») · tugma «Hozircha bilmayman».
  Tekshiruv (`QXato`, bloklaydi): son bo'sh yoki son emas — Neon ko'rsatgan sonni shu yerga yozing. (39) · taxmin bo'sh — Taxminingizni yozing yoki «Hozircha bilmayman»ni bosing. (56)
- Yordam (bosilsa ochiladi): Eslatma: `COUNT(DISTINCT …)` — takrorlanmagan qiymatlarni sanaydi (10-Modulda brauzer ID lar shunday sanalgan) · `JOIN … ON` — ikki jadvalni `id` orqali bog'laydi · `WHERE o.namuna = false` — namuna va tekshiruv akkauntlari sanalmaydi (12-Modul).
  Jadval nomini bilmasangiz — agentga yozing: «Database'da {to'lovchi roli} qaysi jadval va ustunda ko'rinadi? Faqat nomlarini ayt, hech narsani o'zgartirma.» `SELECT *` yozmang: jadvalda ism va login bor — sizga faqat son kerak. Faqat `SELECT` — `DELETE`, `UPDATE` yo'q.
  Masalan (Mentor misoli): to'lovchi — tashkilotchi; u `oyinlar` jadvalida `tashkilotchi_id` ustunida ko'rinadi.
- O'ng — Neon maketi (`NeonMaket`, chizilgan; logotip yo'q; 12-Modul 10-dars bilan bitta naqsh): tepada «SQL Editor» oynasi — SQL matni (bo'sh joy bilan), o'ng burchakda «Run»; ostida jadval: bitta ustun `count`, bitta kulrang qator «?».
- **Harakat → Vizual o'zgarish:** darvozada `DISTINCT` tanlanadi → SQL dagi bo'sh joyda `DISTINCT` bir lahza ajralib turadi (maketda ham); maketdagi «Run» halqada → bosilganda `count` qatorida **6** chiqadi (~1 s yashil) va ostida `QIzoh`:
  Mentor misolida — 6 tashkilotchi: o'tgan darsdagi son shu SQL'dan. (66) O'quvchi son yozsa (yoki taxmin) → son artefakt-stripdagi «Modelim» ga uchadi: «to'lashi mumkin: {n}» (taxmin bo'lsa — yonida «taxmin»).
- Tugma: **Bajardim — son yozildi** (qulf: darvoza yechilmagan bo'lsa — «Avval qator savolini yeching»; son, taxmin yoki «Hozircha bilmayman» yo'q bo'lsa — «Avval sonni yozing yoki tugmani bosing»). Bitta halol tugma (korpus §19).
- Hammasi bajarilgach (yashil; holatga qarab):
  - Neon soni: To'lashi mumkin bo'lganlar sanaldi — bu hali to'laganlar soni emas. (67)
  - taxmin: To'lashi mumkin bo'lganlar taxmin bilan yozildi. (48)
  - «Hozircha bilmayman»: Sanoq hali qilinmadi — uyda Neon'da sanang yoki taxmin yozing. (62)
- Pastki qator (kichik, kulrang): Vaqt tugasa — «Hozircha bilmayman»ni bosing: sanoq uyga qoladi. (63)
- Saqlanadi («Bajardim» bosilganda): `pm-m11d2-model.soni` va `soniManba` — Neon soni → `soni: n`, `soniManba: 'database'` · taxmin → `soni: n`, `soniManba: 'taxmin'` · «Hozircha bilmayman» → `soni: null`, `soniManba: null` (10-FILTR 4 — manba haqiqiy yo'ldan; KOD 8).
  8-ekranda model hali saqlanmagan bo'lsa — son dars progressida turadi va model saqlanganda birga yoziladi (bo'sh model bilan kalit yaratilmaydi).
- Nishon: Count Query! (darvoza birinchi urinishda va son yoki taxmin yozilganda).
- Mentor rejimi: proyektorda Neon maketi; Mentor «Run»ni o'zi bosadi va 6 ni ko'rsatadi.
- O'qituvchi eslatmasi: 12 daqiqa. Faqat `SELECT` — jadval o'zgarmaydi. Neon'da yo'l (rasmiy hujjat, 07.10.2026): loyihani tanlash → Postgres database → SQL Editor → branch va database → «Run».
  6 — Pro olganlar emas: hali hech kim to'lamagan; bu — Pro kerak bo'lishi mumkin bo'lgan tashkilotchilar. O'chirilgan hisobning o'yinlari tashkilotchisiz qoladi (12-Modul «Hisobni o'chirish») — `JOIN` ularni sanamaydi.
  `namuna` ustuni bo'lmasa — namuna akkauntlar bilan sanalgan son yozilmaydi: «Hozircha bilmayman», ustun — 12-Moduldagi ish. Son Mentornikidan farq qilishi tabiiy. Telefon va login ekranga chiqmasin.
- Manba (o'quvchiga ko'rinmaydi): neon.com/docs/get-started/query-with-neon-sql-editor (07.10.2026: «Select Postgres database > SQL Editor», «click Run to view the results») · tayanch 1.2 (SQL aynan), 9.22 · 11-Modul tayanchi 146-qator (`oyinlar.tashkilotchi_id`) · 12-Modul tayanchi 9.5, 9.23.

## 11 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; o'quvchining o'z ishi; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Modelni tanlashdan oldin nimani bilishingiz kerak?** (6 so'z) · savol ustida yorliq yo'q
  - A — Telegram Premium necha pul turishini (36)
  - ✔ B — Kim to'lashi va nima bepul qolishini (36)
  - C — Qaysi model hozir eng mashhurligini (35)
  - D — Mentor kimdan pul olishni tanlaganini (37)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («…ni» bilan tugaydi); «kim» B va D da, «pul» A va D da — kalit so'z faqat to'g'rida emas; tire va qo'shtirnoq yo'q.
- To'g'ri izohi: Model shu ikki savoldan chiqadi: kim to'laydi, nima bepul. (58)
- Xato izohlari:
  - A: Telegram — voqea. Mahsulotingiz haqida nima kerak? (50)
  - C: Mashhurlik mahsulotingizga mos kelishini aytmaydi. (50)
  - D: Mentor misoli — namuna. Sizda kim to'laydi? (43)
  - (umumiy) O'z modelingizning birinchi ikki kartasini eslang. (50)
- Javob topilgach (kichik, savol ostida): o'quvchining «Modelim» kartasi — «Kim to'laydi» va «Bepul qoladi» qatorlari yonadi (karta yo'q bo'lsa — Mentor misoli: «tashkilotchi» · «o'yin e'loni, qo'shilish»).
- Izoh (MD): turkumlar har xil (sinf 8): A — boshqa olam (keys — mahsulot emas; narx bankda yo'q, fakt aytilmaydi) · C — mahsulotdan tashqari mezon (mashhurlik) · D — Mentor misolini qoida qilish (sinf 4). Bitta himoyalanadigan javob: dars modelni shu ikki savoldan tanlatdi (2, 4, 8-ekranlar).
  Kalit ibora 3, 5, 7-ekranlar bilan takrorlanmaydi (S-008).

## 12 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 4 savol (3, 5, 7, 11); 8–10-ekranlar «Saqlash»/«Bajardim» — mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Kim to'laydi va nega» · 5 — «2 — Pro va model nomi» · 7 — «3 — Telegram Premium» · 11 — «Yakuniy — Model nimadan tanlanadi»

## 13 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi ingichka accent chegara bilan, to'lqin 3 marta (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 14 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 6, E 54; belgi ✓ va nishon faqat birinchi holatda; o'quvchi qilgan ishni aytadi; `pm-m11d2-model` dan):
  - model saqlangan, `soniManba: 'database'`: **Modelingiz tanlandi, Neon'da sanoq qilindi.** (43)
  - model saqlangan, `soniManba: 'taxmin'`: **Modelingiz tanlandi, sanoq hozircha taxmin.** (43)
  - model saqlangan, `soni: null`: **Modelingiz tanlandi, sanoq hali qilinmagan.** (43)
  - model saqlanmagan: **Model hali tanlanmagan — uyda tanlang.** (38)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yakunda YO'Q (SABOQ E 50; fikr dars ichida qoladi — A-2).
- Endi siz bilasiz (asosiy fikr so'zma-so'z takrorlanmaydi, T-048):
  - Mahsulot qanday pul topishi — monetizatsiya modeli.
  - Bepul asos va pullik qo'shimchada asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik.
  - Pullik obuna modelida har bir foydalanuvchi to'laydi.
  - Telegram Premium voqeasida bepul qism qisqartirilmagan.
  - To'lashi mumkin bo'lganlar soni — hali to'laganlar soni emas.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ota-ona yoki tanishingiz · Nechta: 1 model · Muddat: keyingi darsgacha
  - ① Modelingizni tushuntirib bering: kim to'laydi, nima uchun va nima bepul qoladi.
  - ② Yana bitta modelni mahsulotingizga qo'yib ko'ring: kim to'lardi va nega mos emas?
  - ③ Darsda qolgan qismni tugating: {holatga qarab — modelni tanlab saqlang · Neon'da sanang yoki taxmin yozing}. Hammasi tugagan bo'lsa ③ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Hech kimdan pul so'ramang: bugun faqat model tanlanadi. (55)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Webhook: to'lov Backend'ga qanday yetib keladi»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: chip va ball · sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ① — real odam bilan, lekin pul suhbati emas: o'quvchi modelini tushuntiradi, narx so'ramaydi va pul haqida kelishmaydi (pul suhbati — 6-dars ishi, bu yerda va'da qilinmaydi). ② — taqqoslashni o'z mahsulotida takrorlash (8-ekran «Rad etgan modelingiz»ga qo'shilishi mumkin — `rad` ko'pi bilan to'rtta).
  «Kim bilan» — HwCard yorlig'i (12-Modul va 1-dars bilan bir). Muddat «keyingi darsgacha» — keyingi dars nomi faqat «Keyingi dars» qatorida (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Who Pays!** (3-ekran, 1-savol birinchi urinishda) — Mentor rejasida kim to'lashini va nega ekanini birinchi urinishda topdingiz
- **Free Part!** (7-ekran, 3-savol birinchi urinishda) — Telegram Premium va Mentor tanlovidagi umumiy joyni birinchi urinishda topdingiz
- **My Model!** (8-ekran, «Modelim» saqlanganda — bonus) — Mahsulotingiz uchun model tanlab, sababini yozib saqladingiz
- **Count Query!** (10-ekran, darvoza birinchi urinishda va son yoki taxmin yozilganda) — Bir tashkilotchini bir marta sanaydigan qatorni topib, sonni yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (My Model!, S-034: ish qilingan ekranda). 5-ekran va yakuniy savol nishonsiz. 2, 4, 6-ekranlar (ballsiz tushuncha va keys) va 9-ekran nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Kim to'laydi** — 1 O'yinchilar o'yinni to'ldiradi — ilova ular uchun bepul. · 2 Tashkilotchi har hafta o'yin e'lonini qayta yozadi. · 3 Pro shu ishni oladi — Mentor rejasida to'lovchi tashkilotchi.
  — Sinfga savol: Sizning mahsulotingizda kim har hafta bir xil ishni qayta qiladi?
- **5 · Model** — 1 Mahsulot qanday pul topishi — monetizatsiya modeli. · 2 Pullik obuna modelida har bir foydalanuvchi to'laydi. · 3 Mentor modelida asosiy ish bepul, faqat qo'shimcha pullik.
  — Sinfga savol: Mahsulotingizda nima bepul qolishi kerak?
- **7 · Telegram Premium** — 1 2022-yil iyunda Telegram pullik obunani ishga tushirdi. · 2 Bepul Telegram qisqartirilmadi. · 3 Premium ustiga qulaylik qo'shdi.
  — Sinfga savol: Siz ishlatadigan ilovada pullik qism bormi?
- **11 · Tanlov** — 1 Avval kim to'lashi yoziladi. · 2 Keyin nima bepul qolishi yoziladi. · 3 Model shu ikkisidan tanlanadi.
  — Sinfga savol: Modelingizni bir gapda ayta olasizmi?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·10 · B 3·8·11 · C 2·5·12 · D 4·7·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — «O'lchov» (skript).
1. Bepul asos va pullik qo'shimchada nima bepul? (7 so'z) · ekran 4
   - ✔ A — Hamma uchun asosiy ish (22)
   - B — Faqat birinchi o'ttiz kun (25)
   - C — Faqat reklamali sahifalar (25)
   - D — Qo'shimcha qulayliklar (22)
2. Reklama modelida pulni kim to'laydi? (5 so'z) · ekran 4
   - A — Ilovani ishlatadigan har kim (28)
   - B — Reklamani ko'rgan foydalanuvchi (31)
   - ✔ C — Reklama bergan boshqa kompaniya (31)
   - D — Ilova xizmat qiladigan biznes (29)
3. Mentor misolida B2B bo'lsa, kim to'lardi? (6 so'z) · ekran 4
   - A — O'yinga qo'shiladigan o'yinchilar (33)
   - ✔ B — O'yin bo'ladigan maydonning egasi (33)
   - C — Ilovada reklama bergan kompaniya (32)
   - D — O'yinni e'lon qiladigan tashkilotchi (36)
4. Mentor misolida tranzaksiya modeli qaysi ish bo'lardi? (7 so'z) · ekran 4
   - A — Har hafta o'yinni e'lon qilish (30)
   - B — O'yinga qo'shilish va chiqish (29)
   - C — O'yinchilarga eslatmalar yuborish (33)
   - ✔ D — Maydon pulini ilovada bo'lishish (32)
5. Mentor maydon pulini bo'lishishni nega hozir olmadi? (7 so'z) · ekran 4
   - A — 44 foydalanuvchi buning uchun kam (33)
   - B — Maydon egasi ilovani ishlatmaydi (32)
   - ✔ C — Yuridik shaxs va shartnoma kerak (32)
   - D — Roadmap'da u hozirgi ufqda turadi (33)
6. Mentor rejasida o'yinchi Pro'siz nima qila oladi? (7 so'z) · ekran 2, 4
   - ✔ A — O'yinlarga bepul qo'shila oladi (31)
   - B — Faqat o'yin e'lonlarini o'qiydi (31)
   - C — Faqat bitta o'yinga qo'shiladi (30)
   - D — Hech narsa: ilova unga pullik (29)
7. Telegram pullik obunani qachon ishga tushirgan? (6 so'z) · ekran 6
   - A — 2020-yil iyunda (15)
   - B — 2024-yil mayda (14)
   - C — 2019-yil martda (15)
   - ✔ D — 2022-yil iyunda (15)
8. 2024-yilda Premium'ga pullik obuna bo'lganlar qanday o'zgardi? (7 so'z) · ekran 6
   - A — Deyarli o'zgarmadi (18)
   - ✔ B — Uch barobar ko'paydi (20)
   - C — Ikki barobar kamaydi (20)
   - D — O'n barobar ko'paydi (20)
9. Pullik obuna modelida bepul qism qanday bo'ladi? (7 so'z) · ekran 4
   - A — Asosiy ishi hamma uchun bepul (29)
   - B — Pulni boshqa kompaniya to'laydi (31)
   - C — Bepul qism kattaroq bo'ladi (27)
   - ✔ D — Bepul qism yo'q, hamma to'laydi (31)
10. Bu darsdagi SQL'da DISTINCT nima uchun yozilgan? (7 so'z) · ekran 10
    - ✔ A — Har tashkilotchi bir marta sanalsin (35)
    - B — Namuna akkauntlar sanoqqa kirmasin (34)
    - C — Ikki jadval o'zaro id orqali bog'lansin (39)
    - D — Faqat Pro olganlar sanoqqa kirsin (33)
11. SQL'dagi `namuna = false` sharti nima qiladi? (7 so'z) · ekran 10
    - A — Pro olmagan akkauntlarni sanamaydi (34)
    - ✔ B — Tekshiruv akkauntlarini sanamaydi (33)
    - C — O'yin e'lon qilmaganlarni sanaydi (33)
    - D — Sinfdoshlarni alohida sanab beradi (34)
12. Telegram Premium nima? (3 so'z) · ekran 6
    - A — Telegram'ning yangi versiyasi (29)
    - B — Telegram'ning bepul qismi (25)
    - ✔ C — Telegram'ning pullik obunasi (28)
    - D — Telegram'dagi reklama turi (26)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006) — «O'lchov»; kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (kim va nega to'laydi) ↔ arena 6 (o'yinchi nima qila oladi), 3 (B2B bo'lsa kim) · 5-ekran (Pro va model nomi) ↔ arena 9 (pullik obunada bepul qism) · 7-ekran (umumiy joy) ↔ arena 7, 8, 12 (bank faktlari) · 11-ekran (nimadan tanlanadi) ↔ arena 1, 2 (model ta'riflari).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas: 1 — sinov muddati (B), reklama (C), teskari (D) · 2 — pullik obuna (A), reklamani teskari o'qish (B), B2B (D) · 3 — boshqa yo'llarning to'lovchilari (o'yinchi, kompaniya, tashkilotchi); «e'lon» faqat D da (o'yin e'loni), kompaniya haqida — «reklama» (T-015) ·
  4 — bepul funksiyalar va Pro qulayligi · 5 — boshqa yo'llarning sabablari (A, B) va roadmap'ni noto'g'ri o'qish (D) · 6 — bepul qismni qisqartirish uch xil · 7, 8 — bankka zid sana va o'zgarish (haqiqiy hayotda ham noto'g'ri; «2024-yil may» — bankdagi «2025-yil may» bilan aralashmasin, yil boshqa) ·
  9 — bepul asos (A), reklama (B), teskari (C) · 10 — SQL ning boshqa qismlari (`WHERE`, `JOIN`) va sanoqni Pro olganlar deb o'qish (D) · 11 — sanoqni Pro deb o'qish (A), boshqa shart (C), Database'da yo'q ajratish (D — sinfdoshlar Database'da ajratilmaydi, 12-Modul 9.6) · 12 — Premium'ni boshqa narsa deb o'qish.
- **Fon so'zlari** (R-008, kodda {uz, ru}; ru — 6-RU bosqichida): arena — model · bepul asos · pullik obuna · reklama · B2B · tranzaksiya · to'lovchi · Pro · Telegram Premium · Maydon Jamoa · uyga vazifa banneri — model · to'lovchi · bepul qism. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

## Kartochkalar (12) — 13-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Monetizatsiya modeli nima? | Mahsulot qanday pul topishi | Qisqasi — model |
| Bepul asos va pullik qo'shimcha nima? | Asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik | Inglizchasi: freemium |
| Pullik obuna modelida kim to'laydi? | Har bir foydalanuvchi — ma'lum muddatga | Inglizchasi: subscription |
| Reklama modelida kim to'laydi? | Boshqa kompaniya — o'z mahsulotini ko'rsatish uchun | Mentor misolida mos emas: 44 foydalanuvchi reklama beruvchiga juda kam |
| B2B nima? | Boshqa biznes to'laydi: mahsulot uning o'z ishiga xizmat qiladi | Inglizchasi: business to business |
| Tranzaksiya modeli nima? | Ilova orqali o'tadigan har to'lovdan ulush olish | Mentor misolida — maydon pulini bo'lishish |
| Mentor rejasida kim to'laydi va nega? | Tashkilotchi: Pro uning har haftalik o'yin e'lonini o'zi qiladi | «Doimiy o'yin» — har hafta shu kun va soatda o'yin o'zi e'lon qilinadi |
| Nega Mentor o'yinchilardan pul so'ramaydi? | Ular bo'lmasa o'yin to'lmaydi | Telegram guruhi esa bepul |
| Nega B2B Maydon Jamoa'ga hozir mos emas? | Ilova bugun maydon egasiga xizmat qilmaydi | Muammo gapida maydon egasi yo'q |
| Maydon pulini bo'lishish nega hozir olinmadi? | Boshqalar nomidan pul yig'ish uchun yuridik shaxs va shartnoma kerak | Roadmap'da — «uzoqroq» |
| Telegram Premium chiqqanda bepul Telegram bilan nima bo'ldi? | Qisqartirilmadi — Premium ustiga qulaylik qo'shdi | 2022-yil iyun |
| To'lashi mumkin bo'lganlar soni — to'laganlar sonimi? | Yo'q: hali hech kim to'lamagan | Mentor misolida — 6 tashkilotchi, Neon sanog'i |
- §145: har javobdagi so'z darsda bor (monetizatsiya modeli — 4 · bepul asos, pullik obuna, reklama, B2B, tranzaksiya — 4 · Pro, «Doimiy o'yin», tashkilotchi — 2 · o'yinchilar to'ldiradi — 2 · maydon egasi, muammo gapi — 4 · yuridik shaxs, «uzoqroq» — 4 · Telegram Premium — 6 · 6 tashkilotchi — 10).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). freemium, subscription, business to business — faqat shu izohlarda (TAQIQLAR 5).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmMonetizationLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d2-v1` (12-Modul PM darslari naqshi `pm-mNdK-v1`), `lessonTitle` — «Mahsulotingiz qanday pul topadi?».
2. `SCREEN_META` 15: hook · plan · concept · test · concept · test · keys · test · practice · practice · koding · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 2, 5: 0, 7: 3, 11: 1 }; `kim: -1`, `yollar: -1`, `premium: -1` (2, 4, 6-ekran — ballsiz bashorat);
   8, 9 `practice: -1`, 10 `koding: -1` — signal `PRACTICE_BASE + ekran`. `narrow` — 3, 5, 7, 11, 12-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat`; taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori, qolipning `natija` propi ishlatilmaydi — E 42) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s8/s9 `QMustaqil` · s10 `QKod` (Neon varianti; o'ng ustun — 9-Modul 1-dars `QKOD_ONG` yechimi, SABOQ C) · s12 `QNatija` · `sflash` `QKartochka` · s14 `QYakun`.
3. **`ModelSahna`** — bitta vizual (180; qolipda yo'q, yangi): qismlar `telefon` («Maydon Jamoa» o'z rangida — 11-Modul 9.62; rejimlar `oddiy` · `oyinchi` · `tashkilotchi` · `reklama` — o'yinlar ustida kulrang «reklama» qutisi; son rejimi `?`) ·
   `odamlar` (8 o'yinchi + 1 tashkilotchi; yorliqlar `bepul`, holatlar `xira`, `?`) · `tashqi` (`bino`, `maydonEgasi` + maydon chizig'i) · `tanga` (oqimlar `hamma` · `bitta` · `tashqi` · `orqali` (tranzaksiya: o'yinchilardan maydon tomonga, kichik bo'lagi telefonda) · `yoq`; `qulf`) ·
   `proKarta` (yorliq «Mentorning rejasi»; yopiq/ochiq) · `haftalar` (4 katak «Shanba», holatlar `yozadi` → `ozi`) · `yolKarta` (`n / 5`, muhr `mosEmas` — kulrang, `tanlandi` — yashil; qizil yo'q) · `oquvchi` rejimi (mahsulot kartasi `nom`, to'lovchi belgisi, `bepul` yorliqlari — kalitdan).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ms-rol ms-qoy ms-keyingi`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da yo'l kartasi sahna ostida; odamlar bir qatorda, kesilmaydi (E 41 — DOM detektori).
4. **Ma'lumot — bitta manba (A-4, A-6, 4-ekran aynan):** `MENTOR_ROLLAR` = 2 × `{ id, kim, nima, pul }` · `YOLLAR` = 5 × `{ id: 'obuna' | 'reklama' | 'b2b' | 'tranzaksiya' | 'freemium', hodisa, nom, sabab, muhr, sahna }` (tartib — 4-ekrandagidek) ·
   `MENTOR_MODEL` = `{ model: 'freemium', kim: 'tashkilotchi', nima, bepul, sabab, rad: [{ model: 'obuna', sabab }] }` (8-ekran Yordami va Mentor rejimi) · `MENTOR_SQL` (A-10 aynan; bo'sh joy `DISTINCT` o'rnida) · `MENTOR_SONI = 6` · `K2_KADR` = 3 × `{ nom, mentor, sahna }` (6-ekran aynan).
   `MODEL_NOM` = { freemium: 'Bepul asos va pullik qo'shimcha', obuna: 'Pullik obuna', reklama: 'Reklama', b2b: 'B2B', tranzaksiya: 'Tranzaksiya' } — 8, 9, 14-ekranlar va xulosa shundan.
5. **s0** — o'qiydi `pm-m11d1-birlik` (`tur === 'real'` bo'lsa `kimTolaydi`), `pm-m10d1-lending.nom`; kalit yo'q yoki `tur === 'mashq'` — Mentor misoli; uch variant; tanlovga qarab `tanga` oqimi (`hamma` · `bitta` · `tashqi`); `correct: false` hammaga (J-026); javob matnlari — 0-ekran aynan.
6. **s2** — `QBashorat` (3 variant; to'g'risi «Har hafta») → 2 tugma: `oyinchi` (telefon rejimi, `bepul` yorliqlari, `QIzoh`) · `tashkilotchi` (telefon rejimi, `haftalar` `yozadi` → `proKarta` ochiladi → `ozi`, `tanga` `bitta`). 40 s ipucha.
   **s4** — `QBashorat` (to'g'risi «Bittasi») → `YOLLAR` ketma-ket (E 53): har kartada ① hodisa → «Maydon Jamoa'ga qo'yish» → `sahna` → ② `nom` → ③ yorliq «Mentorning taxmini» + `sabab` → ④ `muhr` → «Keyingi yo'l»; o'tgan karta ixcham qatorga; `tugadi` — besh ixcham qator.
7. **s6** — `PremiumSahna` (chizilgan telefon, «Telegram» o'z rangida, logotipsiz; chat nomlari — bezak): 3 kadr; bashorat 1/3 da (`pre` kadr — javob ochilmaydi), natija 2/3 da (`QTaxmin`); 3/3 — ikki alohida karta (ustun ×3 o'sadi; strelka yo'q). Bankda yo'q narsa chizilmaydi (qulaylik nomlari, narx, Telegram tugmalari).
8. **s8** — o'qish qoidasi (A-11); 3 karta ketma-ket (E 53), yorliq input ichida (E 43); **yozish qoidasi** (bitta funksiya, `node` da kamida 8 namuna bilan sinaladi — PM-108):
   - `model` — besh qiymatdan biri (tugma `id`); `kim` — rol matni yoki `'hamma foydalanuvchi'` (tugma); bo'sh — bloklaydi (`null` yo'q — model tanlash uchun to'lovchi kerak);
   - `nima` — matn; `bepul` — PRD bo'lsa «bepul» belgilangan funksiya nomlari vergul bilan + qo'shimcha maydon matni; PRD yo'q — maydon matni; hammasi «pullik» va maydon bo'sh — `''`;
   - `sabab` — ≥ 8 belgi; `rad` — 1–4 × `{ model, sabab }` (model — tanlangandan boshqa, takrorsiz; sabab bo'sh emas);
   - `soni`, `soniManba` — 10-ekrandan; 8-ekran saqlaganda mavjud qiymat o'zgarmaydi, yo'q bo'lsa `null`, `null`; `savedAt` — har saqlashda;
   - yozadi `localStorage` `pm-m11d2-model` = `{ model, kim, nima, bepul, sabab, rad, soni, soniManba, savedAt }` — tayanch 8 + `soniManba` (TAYANCHGA SAVOL 1). Ism, login, telefon yozilmaydi.
   Tekshiruvlar (bloklaydi / yumshoq — 8-ekran ro'yxati); yakuniy «Modelim» kartasi; «Yangilash»; nishon `myModel`; artefakt-strip «Modelim».
9. **s9** — `SHERIK_SAVOL` 2 × `{ savol, karta }` (1 → «Kim to'laydi», 2 → «Model»; ✕ qatori shu kartani ochadi); taymer 1:00; varaq holati dars progressida (`belgi`, `izoh`, `ozgartirildi`), kalitga yozilmaydi; yakka rejim — Mentor gapi va sarlavha almashadi; tekshiruvlar; o'zgargan karta `pm-m11d2-model` ga (`savedAt`).
10. **s10** — `QKod` Neon varianti (`HtmlCompiler` yo'q): chapda darvoza (3 variant, ballsiz, xato izohlari) · vazifa 3 band · trek qatori (`pm-m9d8-platforma.trek === 'web'` yoki kalit yo'q) · model qatori (`pm-m11d2-model.model` — `'reklama'` yoki `'b2b'`) · SQL bloki (bo'sh joy darvozadan keyin `DISTINCT`) ·
    maydon (son · «Database'da sanab bo'lmaydi» → taxmin · «Hozircha bilmayman») · Yordam; o'ngda `NeonMaket` («SQL Editor», «Run» → `count` 6, `QIzoh`). «Bajardim» qulfi; yozish — 10-ekran «Saqlanadi» qoidasi (model saqlanmagan bo'lsa — progressda); nishon `countQuery`.
11. Testlar s3/s5/s7/s11 — `correctIdx` 2/0/3/1 = `INLINE_KEYS`; `RECAPS` {3, 5, 7, 11} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 5, 7, 11}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
12. `ACHIEVEMENTS` 4 (`whoPays`, `freePart`, `myModel`, `countQuery`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·2·1·3·2·0·3·1·3·0·1·2 — A·B·C·D ×3) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
13. s14 `QYakun`: sarlavha **to'rt holat** — `pm-m11d2-model` dan (`model`, `soniManba`, `soni`; P-046); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — yakunda yo'q (E 50); `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③; ③ holatdan yig'iladi); `keyingi` — «Webhook: to'lov Backend'ga qanday yetib keladi».
    Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m11-02` qatoriga `comp: PmMonetizationLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 446-qator). Bu agent App.jsx ga tegmaydi.
- Darvozalar: `npm run gates -- src/11-Modull/PmMonetizationLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · E 41 kesilish detektori.
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md). SQL matni — oddiy satrlardan yig'iladi.

## REPO
- **Yo'q.** PM darsi — repo'ga yozilmaydi: `m13-dars-02-done` = `m13-dars-02-start` = `m13-dars-01-done` (tayanch 3 jadvali: «`m13-dars-01…02` — repo'ga yozilmaydi»). «Ortda qoldingizmi» bu darsda yo'q (blok yo'q). Neon'da faqat `SELECT` — Database o'zgarmaydi.

## Manbalar (o'zim tekshirgan sahifalar va qatorlar, 07.10.2026)
- **Neon SQL Editor** — neon.com/docs/get-started/query-with-neon-sql-editor (07.10.2026 ochildi): «Select your project.» · «Select **Postgres database** > **SQL Editor**.» · «Select a branch and database.» · «Enter a query into the editor and click **Run** to view the results.»
  O'quvchi matnida faqat «SQL Editor» va «Run» (12-Modul 10-darsi bilan bir; menyu yo'li — O'qituvchi eslatmasida).
- **K2** — `PM_Prompt_v8.md` 176–179-qator (bank; tashqi manba ochilmadi — PM-016: bankdan tashqari fakt qo'shilmaydi); ruscha asli: «Платная подписка запущена в июне 2022. Бесплатный Telegram не урезали — Premium добавляет удобства сверху. В 2024 подписчиков стало втрое больше, и Telegram впервые стал прибыльным.» «Рост подписчиков ×3 за 2024 (до 12 млн; к маю 2025 — 15 млн); выручка 2024 превысила $1 млрд (сумму можно называть в уроках про монетизацию).»
  · Bankning sonlar va summalar qoidasi (158–163-qator): har son yili bilan; pul summasi — monetizatsiya darsida aytilishi mumkin.
- Mentor faktlari va ta'riflar — `00-MODUL-TAYANCH.md` 1.0, 1.2, 1.13 (aynan); atamalar — 2-bo'lim; kalit — 8-bo'lim; kelishuvlar — 9.16, 9.19, 9.21, 9.22; keys — 5-bo'lim; qarorlar — `GATE_M_JAVOB.md` Qaror-0 1, 2, 6, 21, 22, 23.
- `oyinlar` ustunlari (`tashkilotchi_id`) — 11-Modul tayanchi 146-qator · «Maydon pulini bo'lishish» — 11-Modul tayanchi 1.5 jadvali (ufq «uzoqroq», sabab «muammo gapidan kelmaydi») va 9.42 (bitta nom) · muammo gapi — 13-Modul tayanchi 1.0 (so'zma-so'z) · `pm-m9d5-prd` sxemasi — 11-Modul tayanchi 354-qator.
- `namuna = false` va sanoq SQL shakli — 12-Modul tayanchi 9.5, 9.23 · «Hisobni o'chirish»da o'yinlar tashkilotchisiz qoladi — 12-Modul tayanchi 1.7 · 44 — 12-Modul tayanchi 1.13.
- `COUNT(DISTINCT …)` ta'rifi — `feedback/F-1005-10modul/YAKUNIY/02-EventTracking.md` 232, 425-qator («Takrorlanmagan brauzer ID lar soni») · `JOIN` ta'rifi — `src/4-Modull/DbSqlNosqlLesson.jsx` 249-qator («JOIN — ikki jadvalni id orqali bog'laydi»).
- Neon ekran shakli — 12-Modul `10-PmUsersCheck-v3.md` 305–344-qator; keys ekran shakli — o'sha MD 237–259-qator · «mlrd» qisqartmasi o'rniga «milliard» — `MATN_KORPUS.md` 1800-qator.
- App.jsx 445–447 (grep 07.10.2026): `m11-01` → `m11-02` (osti so'zma-so'z) → `m11-03` «Webhook: to'lov Backend'ga qanday yetib keladi».

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **`pm-m11d2-model.soniManba`** — yangi maydon: `'database'` (Neon'da sanalgan) · `'taxmin'` (o'quvchi «Database'da sanab bo'lmaydi»ni bosib, taxminini yozgan) · `null` («Hozircha bilmayman»). Sabab: `soni` yolg'iz turganda 4-dars uni Database soni deb o'qiydi (sinf 3; 10-FILTR 4 — manba haqiqiy yo'l). Sanoq sanasi — `savedAt` (sanoq shu darsda qilinadi).
   Tayanch 8 jadvaliga qo'shishni taklif qilaman; 4, 7, 11-darslar `soniManba: 'taxmin'` sonni «taxmin» yorlig'i bilan ko'rsatadi.
2. **Maydonlar qoidasi** (sxemada faqat nomlar bor edi): `kim` — rol matni yoki `'hamma foydalanuvchi'` (1-dars `kimTolaydi` bilan bir qiymat); `bepul` — matn (PRD funksiyalaridan + qo'shimcha); `rad` — 1–4 element, kamida bitta (bloklaydi); `nima` — matn.
3. **10-ekranda model hali saqlanmagan bo'lsa** — son dars progressida turadi, model saqlanganda birga yoziladi (bo'sh `model` bilan kalit yaratilmaydi).
4. **Besh yo'l tartibi** — tayanch 1.2 jadvalidan farqli: pullik obuna → reklama → B2B → tranzaksiya → bepul asos va pullik qo'shimcha (tanlangani oxirida — bashorat «bittasi» birinchi kartada ochilib qolmasin).
5. **Reklama sababi so'zlari** — tayanch: «44 foydalanuvchida reklama beruvchiga deyarli foyda yo'q; o'smirlar ma'lumoti». Darsda: «44 foydalanuvchi reklama beruvchiga juda kam; o'smirlar ma'lumotini Mentor reklamaga bermaydi.»
   «foyda» olib tashlandi — K2 dagi «foydaga chiqqan» (pul ma'nosi) bilan bir darsda ikki ma'no bo'lardi (T-015). «O'smirlar ma'lumoti» — Mentor qarori deb yozildi (qonun da'vosi yo'q); tayanchda shu ma'nomi — tasdiq kerak.
6. **B2B hodisa gapi** — «Mahsulot boshqa biznesning o'z ishiga xizmat qiladi — pulni o'sha biznes to'laydi.» Tayanch izohi «boshqa biznes to'laydi» reklamada ham rost (reklama beruvchi ham biznes) — ikki model aralashmasligi uchun farq hodisa gapida. Kartochkada ham shunday.
7. **Model nomi 4-ekranda «pullik obuna — hamma to'laydi»** (tayanch «pullik obuna (hamma to'laydi)»); Pro ham pullik obuna — 5-ekran testi farqni so'raydi. Ta'rif (1-dars) o'zgarmaydi.
8. **«Odam chaqiradi»** — tayanch 1.0 sababi: «tashkilotchi har hafta e'lonni qayta yozadi va odam chaqiradi — Pro shu ishni oladi». «Doimiy o'yin» (o'yin o'zi e'lon qilinadi) odam chaqirishni qanday olishi aytilmagan — 2-ekranda faqat «o'yin e'lonini qayta yozadi»; to'liq sabab — O'qituvchi eslatmasida aynan.
9. **«Yuridik shaxs»** — o'quvchi matnida izohsiz (tayanch so'zi); O'qituvchi eslatmasida «davlatda qayd etilgan firma yoki tashkilot». 7-darsda «yuridik shaxs yoki YaTT» kiritiladi — bu yerda va'da qilinmaydi.
10. **K2 so'zlari** — «obunachilar» → «Premium'ga pullik obuna bo'lganlar» (Telegram'da «obunachi» — kanal obunachisi; ATAMA-q1 A). «2025-yil mayda — 15 million» — ekranda yo'q, faqat O'qituvchi eslatmasida (sahnada son ko'paymasin — T-109; fakt o'zgartirilmagan, toraytirilmagan). «1 milliard dollar» — 3/3 sahnada bitta kulrang qator.
11. **K2 ko'prik gapi** — tayanch 1.2: «Bu voqeada bepul Telegram qisqartirilmagan — Premium ustiga qulaylik qo'shgan. Mentor ham bepul qismni qisqartirmaydi.» (118 belgi). Xulosa ≤110 uchun: «…, Premium ustiga qo'shilgan. …» (110); «qulaylik» — 2/3 kadr Mentor gapida.
12. **Juftlikdagi ikki savol** — «Kim to'laydi va nima uchun to'laydi — aniq aytildimi?» · «Nega aynan shu model — sabab mahsulotdagi faktdanmi?» (dastur natijasidagi «asoslangan» so'zining ikki qismi). Varaq kalitga yozilmaydi (1-dars TS 11 naqshi).
13. **Hook — sof so'rovnoma**, uchala javob «Qiziq fikr!» bilan (J-026 + T-028, T-067): o'quvchining o'z mahsuloti haqidagi savolda «to'g'ri» javob yo'q; «Aynan!» hech biriga berilmadi.
14. **«Pul topish yo'li»** — atama tug'ilguncha hodisa so'zi (1-dars «olib kelish» naqshi); «yo'l» bu darsda boshqa ma'noda yo'q.
15. **Neon sanog'i** — o'quvchi o'z Database'ida o'z to'lovchi rolini sanaydi; jadval va ustun nomini agentdan so'raydi (faqat nom, o'zgartirishsiz — 12-Modul 10-dars naqshi); SQL'ni o'zi yozadi. Darvoza — `DISTINCT` (10-Modulda o'tilgan). Maketda Mentor natijasi 6 — «o'tgan darsdagi son shu SQL'dan» (9.22).
16. **Mentor misolida bepul qoladiganlar** (8-ekran Yordami): «o'yin e'loni, qo'shilish, chiqish va navbat» — tayanch 1.0 «o'yinchilar uchun hamma narsa bepul (bugungi ilova o'zgarmaydi)» va «Pro — bitta qulaylik» dan; ro'yxat — 11-Modul funksiyalari nomlari.
17. **Telegram sahnasidagi chat nomlari** — «Sinf chati» · «Oila» · «Futbol guruhi» (bezak, sonsiz; bank faktiga tegmaydi). Kerak bo'lmasa — matnsiz qatorlar o'rniga shu nomlar (SABOQ D 33).
18. **Testlarda ikkinchi misol yo'q** — to'rttala test Mentor misoli, keys va o'quvchining o'z ishi haqida (P-002 — ruxsat, majburiy emas).
19. **«e'lon» faqat o'yin e'loni** — tayanch 2 reklama ta'rifidagi «kompaniya e'loni» va 1.2 dagi «reklama beruvchi» darsda: ta'rif — «boshqa kompaniya o'z mahsulotini foydalanuvchilarga ko'rsatish uchun to'laydi», maketda — «reklama» qutisi. Sabab: «Maydon Jamoa»da «e'lon» — o'yin e'loni, «e'lon beruvchi» tashkilotchi deb o'qilardi (T-015).
20. **Uyga vazifa ②** — «Yana bitta modelni mahsulotingizga qo'yib ko'ring: kim to'lardi va nega mos emas?» — tayanchda yo'q mashq; 8-ekrandagi `rad` ga qo'shilishi mumkin (ko'pi bilan to'rtta).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — taqsimot reja (A-12); 4-ekran (besh karta, ≈10 daqiqa) va 8-ekran (uch karta, ≈15) uzoqroq cho'zilishi mumkin. «Qur» pilotida taymer bilan; sig'masa — 9-ekran yakka rejimga, 10-ekran sanog'i uyga.
2. ⛔ **Mentor Database'ida SQL haqiqatan 6 qaytaradimi** — `oyinlar.tashkilotchi_id` (11-Modul jadvali) va `namuna` ustuni «qur» da Mentor repo'si va Neon'ida tekshiriladi (tayanch 6 «Tekshirilmagan» ro'yxati). Boshqa son chiqsa — tayanch 1.13 bilan birga MD moslanadi.
3. ⛔ **O'quvchi Database'lari xilma-xil** — to'lovchi rolini 12 daqiqada topib sanash, agent faqat nomni aytishi, `namuna` ustuni borligi — pilotda sinaladi. Rol Database'da bo'lmasa — taxmin yo'li bor.
4. **Neon interfeysi** — «Postgres database > SQL Editor» yo'li (rasmiy, 07.10.2026) o'zgarishi mumkin; o'quvchi matnida faqat «SQL Editor» va «Run».
5. **5-ekran savoli** («Pro pullik obuna bo'lsa, model nega boshqacha nomlanadi?») — 13 yoshli uchun ikki qavatli bo'lishi mumkin; recap 5 va kartochka farqni yana ochadi.
6. **Reklama sababi** («o'smirlar ma'lumotini Mentor reklamaga bermaydi») — Mentor qarori; auditor qonun so'rashi mumkin — qonun aytilmagan (TAQIQLAR 1: yuridik maslahat yo'q).
7. **«Yuridik shaxs»** — o'smirga notanish so'z; o'quvchi matnida izohsiz (TAYANCHGA SAVOL 9).
8. **Arena 2, 3** — distraktorlar boshqa modellarning to'lovchilari (bir oila); har birida kamida bittasi boshqa xato (2-B — reklamani teskari o'qish) — sinf 8 chegarasida, auditor ko'rsin.
9. **K2 3/3** — «birinchi marta foydaga chiqdi» va Premium o'sishi bir kadrda: sahna sababni chizmaydi (ikki alohida karta), lekin o'quvchi «Premium tufayli» deb o'qishi mumkin — O'qituvchi eslatmasida ochiq.
10. **Hook** — «hech kim to'lamaydi» varianti yo'q; mahsulotini pul topmaydigan deb bilgan o'quvchi uchalasidan birini majburan tanlaydi (sof so'rovnoma, ballsiz).
11. **2-ekran hafta kataklari (to'rtta Shanba)** — son emas, namuna; auditor «4 hafta» deb o'qishi mumkin (O'qituvchi eslatmasida yozildi).
12. **10-ekran taxmin yo'li** — «Database'da sanab bo'lmaydi» → o'quvchi taxmini: «son to'qish»ga o'xshashi mumkin; `soniManba: 'taxmin'` va yorliq bilan chegaralangan.
13. **Telegram maketi** — «Telegram Premium» qatori chat ro'yxatida — haqiqiy interfeys taqlidi emas (nom o'z rangida, logotipsiz); bank Premium qayerda ko'rinishini aytmaydi.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 13-Modul pul sinflari + 12-Modul tayanchi 7)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-12 taqsimot va «Ulgurmasangiz» (8: PRD yo'q — bitta maydon, bitta rad · 9: yakka · 10: «Hozircha bilmayman»); ⛔ taymer; «sig'adi» deyilmagan. Tashqi kutish yo'q (Neon — bitta `SELECT`).
2. [x] **Tekshirilmagan tashqi qadam** — Neon: «SQL Editor», «Run» rasmiy hujjatdan (07.10.2026, Manbalar); ⛔ Mentor SQL natijasi va o'quvchi Database'lari — Shubhali 2, 3. Telegram — faqat bank (tashqi qadam yo'q).
3. [x] **Saqlash kaliti — shartnoma** — `pm-m11d2-model` tayanch 8 + `soniManba` (TS 1); maydon tiplari va `null` holatlari (KOD 8); `soni` manbasi bilan, yolg'iz emas; `tur: 'mashq'` kaliti o'qilmaydi (9.19); boshqa dars kalitiga yozilmaydi; ism yo'q (`kim` — rol).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida», «Mentor rejasida», «Mentorning taxmini» (2, 4, 5, 10-ekranlar); «mos emas» — «Mentor misolida va hozir» (4-ekran eslatmasi); Yordam: «Mentorning tanlovi sizga majburiy emas» (8); yakuniy test D — Mentor modelini qoida qilish xato.
5. [x] **Kafolat va sabab da'vosi yo'q** — K2 3/3 sabab chizilmaydi (ikki alohida karta, eslatma); «o'yinchilar ketsa, o'yin to'lmaydi» (shartli); «to'lashi mumkin» — «to'laganlar» emas (10, 11, kartochka); tanlov — «taxmin» (8); kafolat so'zlari 0 (O'lchov).
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun 4 holat (har biri kalitdan; «hali tanlanmagan» alohida — E 54); «Bajardim» — darvoza + son/taxmin/«bilmayman»; nishon tavsiflari qilingan ishni aytadi («Model Chosen» emas — «model tanlab, sababini yozib saqladingiz»).
7. [x] **Ta'rif sanaladigan** — «to'lashi mumkin bo'lganlar» — `namuna = false`, kamida bitta o'yin e'lon qilgan hisob (Mentor; A-6); birlik — hisob; 44 (hisob) va 6 (hisob) bir o'lchovda, ayirilmaydi; K2 sonlari — yili bilan.
8. [x] **Test: bitta himoyalanadigan javob** — 3 («rejasida» — kelajak emas), 5 (Pro va model farqi; B — rost, mos emas), 7 («umumiy» — B faqat Telegram uchun rost), 11 (turkumlar: keys · mashhurlik · Mentor qoida); arena distraktorlari — Shubhali 8.
9. [x] **Real odamlar xavfsizligi** — juftlik — sinfdosh bilan (9); uyga vazifa ① — tanish, narx so'ralmaydi; «bugun hech kimga yozilmaydi» (8-ekran eslatmasi); qo'l ko'tartirib sanash yo'q (0, 8, 9); spam va bosim yo'q.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — agent faqat jadval nomini aytadi (10-ekran Yordami), tekshiruv akkaunti yaratilmaydi; Database'ga yozish yo'q (`SELECT`).
11. [x] **Web-trek teng yo'l** — model trekka bog'liq emas; 8-ekran Yordami «Web-trekda ham shunday»; 10-ekran web-trek qatori (o'z Database'i); testlar ikkala trekka to'g'ri; telefon maketi — faqat Mentor misoli.
12. [x] **Mentor misoli ichki izchil** — 44 · 6 · 30 kun · namuna o'yin — 1.0/1.13 aynan; narx (10 000, 15 000) ochilmaydi; Pro — «Mentorning rejasi» (9.21); «Maydon pulini bo'lishish» — bitta nom, «uzoqroq»; 6 — o'tgan dars soni bilan bir (9.22).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — agentga prompt faqat nom so'raydi; o'quvchi modeli, to'lovchisi, sababi — o'ziniki; Mentor misoli faqat Yordamda va Mentor rejimida.
14. [x] **Uyga vazifa yengil va aniq** — 2 band + holatga qarab ③; «Kim bilan · Nechta · Muddat»; pul so'ralmaydi.
15. [x] **Ayb da'vosi yo'q** — xato izohlari keyingi qadamni aytadi; «Odam haqida emas» (9); «taxmin — xato emas» (9-ekran eslatmasi).
16. [x] **Kelajak va'dasi yo'q** — Pro qachon qurilishi aytilmaydi; 6, 7, 9-darslar va'da qilinmaydi (keyingi dars — faqat yakun qatorida); lending, oferta, to'lov ekrani yo'q.
- **13-Modul pul sinflari:** [x] real pul yo'q — reja kulrang qatori, «Modelim» osti, uyga vazifa osti · [x] karta ma'lumoti hech qayerda — to'lov ekrani, karta, to'lov sahifasi yo'q · [—] «mashq to'lov» taqlidi — to'lov sahifasi yo'q (3-dars) ·
  [—] «test rejim» belgisi — to'lov ekrani yo'q · [x] narx — bu darsda aytilmaydi (4-dars) · [x] bosim yo'q — hech kimdan pul so'ralmaydi, «hamma oldi» kabi gap yo'q · [—] oferta — 7-dars · [x] tranzaksiya — «yuridik shaxs va shartnoma kerak» (yuridik maslahat emas, Mentor sababi).
- **12-Modul tayanchi 7 (kuchda):** holatga qarab yakun [x] · da'vo isbot emas [x] · maxfiy qiymat chiqmaydi [x] (`SELECT *` yo'q, login va telefon ekranga chiqmaydi) · tashqi xizmat faqat rasmiy hujjat [x] (Neon) · har sonning manbasi va o'lchovi [x] · tayanchda yo'q narsa to'qilmaydi [x] (TAYANCHGA SAVOL 1–20) ·
  kalit o'qiydigan darsdan [x] · bitta himoyalanadigan javob [x] · keys bank so'zi [x] (K2 — TS 10, 11) · 90 daqiqa [x] · bir ma'no — bir so'z [x] (A-5) · web-trek teng [x] · agent va o'quvchi ishi [x] (agent — faqat nom) · o'smir xavfsizligi [x].

## O'lchov
Skript: `scratchpad/md02/olchov.py` (07.10.2026) — MD da o'lchov uchun har matn belgilangan, uzunligi (belgilar, bo'shliq va tinish bilan; «**» siz) qavsga skript yozgan; jadval — skript chiqishidan.

| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 4, 6, 8, 9 ×2, 10, 13, 14 ×4) | 14 | 25 | 52 | ≤55 |
| Hook javobi («Qiziq fikr!» bilan birga) | 3 | 94 | 97 | ≤120 |
| Hook variantlari (0) | 3 | 35 | 38 | farq ≤15% |
| Xulosa va yashil yakun qatorlari (2, 4, 6, 9, 10 ×3 — sobit matn) | 7 | 48 | 110 | ≤110 |
| `QIzoh`, kulrang va halol qatorlar (bitta qator) | 15 | 46 | 102 | ≤110 |
| To'g'ri izohi (3, 5, 7, 11) | 4 | 43 | 58 | ≤60 |
| Xato izohlari, `QXato` va tekshiruv xabarlari | 34 | 29 | 60 | ≤60 |
| Ipucha (2, 4) | 2 | 65 | 68 | — |
| Test savollari (3, 5, 7, 11) va arena savollari — so'z | 16 | 3 | 8 | ≤12 |

| Test | ✔ | Uzunliklar (A · B · C · D) | Eng qisqa / eng uzun | Farq | O'rtachadan eng katta farq | ✔ yolg'iz eng uzunmi |
|---|---|---|---|---|---|---|
| s3 | C | 34 · 35 · 39 · 40 | 34 / 40 | 15% | 8% | yo'q |
| s5 | A | 37 · 35 · 38 · 35 | 35 / 38 | 8% | 5% | yo'q |
| s7 | D | 39 · 35 · 37 · 39 | 35 / 39 | 10% | 7% | yo'q |
| s11 | B | 36 · 36 · 35 · 37 | 35 / 37 | 5% | 3% | yo'q |
| arena 1 | A | 22 · 25 · 25 · 22 | 22 / 25 | 12% | 6% | yo'q |
| arena 2 | C | 28 · 31 · 31 · 29 | 28 / 31 | 10% | 6% | yo'q |
| arena 3 | B | 33 · 33 · 32 · 36 | 32 / 36 | 11% | 7% | yo'q |
| arena 4 | D | 30 · 29 · 33 · 32 | 29 / 33 | 12% | 6% | yo'q |
| arena 5 | C | 33 · 32 · 32 · 33 | 32 / 33 | 3% | 2% | yo'q |
| arena 6 | A | 31 · 31 · 30 · 29 | 29 / 31 | 6% | 4% | yo'q |
| arena 7 | D | 15 · 14 · 15 · 15 | 14 / 15 | 7% | 5% | yo'q |
| arena 8 | B | 18 · 20 · 20 · 20 | 18 / 20 | 10% | 8% | yo'q |
| arena 9 | D | 29 · 31 · 27 · 31 | 27 / 31 | 13% | 8% | yo'q |
| arena 10 | A | 35 · 34 · 39 · 33 | 33 / 39 | 15% | 11% | yo'q |
| arena 11 | B | 34 · 33 · 33 · 34 | 33 / 34 | 3% | 1% | yo'q |
| arena 12 | C | 29 · 25 · 28 · 26 | 25 / 29 | 14% | 7% | yo'q |

Arena ✔ taqsimoti: A — 1, 6, 10 · B — 3, 8, 11 · C — 2, 5, 12 · D — 4, 7, 9 (har biri 3/3/3/3). Ekran testlari: 3 — C · 5 — A · 7 — D · 11 — B.
Mentor gaplari (asosiy qator; skript — gaplar soni va sarlavha so'z o'zaklari kesishmasi): 0: 1 gap, kesishma 0/3 · 1: 2 gap, 2/5 · 2: 1 gap, 0/5 · 4: 1 gap, 2/5 (tugma nomi «Maydon Jamoa'ga qo'yish») · 6: kadrlar 1 · 1 · 2 gap, 1/5 · 8: 1 gap, 1/4 · 9: 1 gap, 0/4 · 10: 1 gap, 1/5.
Reja (1) va keys 3/3 kadri — ikki gap, qolgan interaktiv ekranlar — bitta gap; hech biri «Bu…», «Hammasini…» bilan boshlanmaydi; kesishma hamma joyda 50% dan kam (T-072, KORPUS §225).
Kafolat so'zlari («darrov», «darhol», «har doim», «hech qachon», «albatta», «100%») o'quvchi matnida — 0 (faqat A-5 «Ishlatilmaydi» va GATE M ro'yxatlarida, MD ichki).
`npm run lint:til feedback/F-1007-13modul/02-PmMonetization-v3.md` — **0 error, 1 warn** (07.10.2026, oxirgi tahrirdan keyin yurgizildi): warn — «Manbalar»dagi K2 bankining ruscha asli (kirill harf; o'quvchi ko'rmaydi; 12-Modul 10-dars Filtrida ham bank iqtibosi warn bo'lib qolgan).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 445 `m11-01` «Bitta foydalanuvchi sizga qanchaga tushadi?» → 446 **`m11-02` «Mahsulotingiz qanday pul topadi?»** (osti «besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya» — reja chap yorlig'i so'zma-so'z) → 447 `m11-03` «Webhook: to'lov Backend'ga qanday yetib keladi» (yakun qatori). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (1.0, 1.2, 1.13 aynan); metafora yo'q; bitta vizual — `ModelSahna` (telefon · odamlar · tanga chizig'i · Pro kartasi · yo'l kartasi); keys va Neon — o'z maketida (P-053). Ikkinchi misol yo'q (TS 18). Keys — K2 (bank).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha), 6 (QVoqea) + 0, 8, 9, 10; testlarda javobdan keyingi kichik vizual. «Bosish → matn-karta» yo'q — har bosish telefon, odamlar, tanga yoki muhrni o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: to'lovchi, pullik obuna, Pro, «Doimiy o'yin», Mentorning rejasi (1-dars) · ro'yxatdan o'tgan, `namuna`, SQL Editor, «Run» (12-Modul) · muammo gapi, PRD, roadmap, «uzoqroq», «Maydon pulini bo'lishish» (11-Modul) · `COUNT(DISTINCT …)` (10-Modul).
  Yangi — monetizatsiya modeli va besh model nomi — misoldan keyin. Siz-forma; tugmalar ot-shaklda yoki siz-formada («Maydon Jamoa'ga qo'yish», «Keyingi yo'l», «Hamma foydalanuvchi», «Saqlash», «Database'da sanab bo'lmaydi», «Hozircha bilmayman», «Bajardim — son yozildi», «1 Ayting · 2 Belgilang · 3 Tuzating»).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov), to'g'ri javob hech qayerda yolg'iz eng uzun emas; tire, qo'shtirnoq, qavs to'g'ri variantga xos emas; kalit so'z faqat to'g'rida emas. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda (3 — C, 5 — A, 7 — D, 11 — B).
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%», «albatta», «hech qachon» — o'quvchi matnida 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-02`, «Modul 13», K2, «keys» — ekran yorlig'i «Biznes olamidan»; freemium, subscription — faqat kartochka izohida bir marta). Modul raqami — LMS raqami. «KOD» ro'yxati 14 band, REPO 0.
- [x] Karta T · P · S · PM: T-011/PM-030 (model nomlari hodisadan keyin; «monetizatsiya modeli» xulosada; sarlavhalarda yangi atama yo'q) · T-014/T-015 (A-5: yo'l, e'lon, foyda, obuna, to'lovchi) · T-016 (metafora yo'q) · T-020 · T-029/T-047 (Mentor yo'riqni takrorlamaydi) ·
  T-035 (o'quvchi izohida belgi-formula yo'q; «×3» faqat keys sahnasida) · T-036 (B2B ochiladi) · T-038 (keyingi dars faqat yakun qatorida) · T-039 · T-042 (ta'riflar so'zma-so'z: 4-ekran, kartochka, Endi siz bilasiz) · T-043 («Mentor misolida», «bu voqeada») · T-045 (to'lashi mumkin — to'lagan emas; K2 — sabab yo'q) ·
  T-064 (2, 4-ekran sarlavhalari hook savolining so'zlari bilan) · P-001 · P-008 (≤3 blok) · P-012 (testlar 3, 5, 7, 11 — ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 (10-ekran «Hozircha bilmayman») · P-033 · P-036 · P-046 (0, 8, 9, 10, 14) · P-052 · P-053 · P-055 · P-062 · P-064 · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-018 (Telegram, Telegram Premium) · S-019 · S-020 · S-026 · S-027 · §131 (million, milliard) · §144/§145 · PM-005 (2-tur) · PM-018 · PM-021 · PM-027 · PM-082 (darvoza-mashq, «…digan SQL yozamiz», nusxa yo'q) · PM-108 · J-026 · SABOQ 1–55.
- [ ] GATE M — foydalanuvchi tasdig'i kutilmoqda; «qur» dan oldin ⛔: Mentor Neon'ida SQL natijasi (6), o'quvchi Database'larida sanash vaqti, 90 daqiqa.
