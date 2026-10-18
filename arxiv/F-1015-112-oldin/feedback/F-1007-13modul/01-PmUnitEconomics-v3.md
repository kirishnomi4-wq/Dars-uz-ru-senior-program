# 13-Modul (kod: `src/11-Modull`) · 1-dars (PM) «Bitta foydalanuvchi sizga qanchaga tushadi?» — MD v3

Fayl: `src/11-Modull/PmUnitEconomicsLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-01` · **14 ekran** (keyssiz PM, kod oynasi bilan — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul SABOQ 19–31, 11-Modul SABOQ D 32–39, **12-Modul SABOQ E 40–55** — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element yengil halqa bilan, Mentor aynan shu harakatni aytadi; har variantning o'z chegarasi — E 40) · bashorat tanlangach yopilmaydi — natija yashil xulosa qutisining birinchi kichik qatori (E 42) ·
ko'p maydonli ish — bittadan karta (E 53) · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror) · odamlar real ko'rinishda (bosh, soch, rangli kiyim — D 36) · maketda hech narsa kesilmaydi (E 41) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 6-ekran — **D** (`3`) · 10-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 438–446, grep 07.10.2026, DE-205): `m10-13` «Zaxira dars» (12-Modul; `type: 'Rezerv'`, `comp` siz) → **`m11-01` «Bitta foydalanuvchi sizga qanchaga tushadi?»** (osti: «jalb qilish narxi va foydalanuvchi keltiradigan pul», `type: 'PM'`, `comp` hali yo'q) → `m11-02` «Mahsulotingiz qanday pul topadi?».
Tur (PM-005): **2-tur sof PM** — artefakt: o'quvchining o'z mahsuloti uchun ikki son (`pm-m11d1-birlik`); mustaqil ish majburiy (7, 8-ekran). **Keyssiz** (Qaror-0 21; tayanch 5). **Kod oynasi** — JS, `HtmlCompiler`: `jalbNarxi`, `keltiradi` (tayanch 1.1, 4). **REPO yo'q** (tayanch 3: `m13-dars-01-done` = `-start`).
⚠️ Pul chegarasi (Qaror-0 6, TAQIQLAR 1): bu darsda to'lov, to'lov sahifasi va karta yo'q; «pullik kanal» — faqat «agar» mashqi (hech qayerga pul to'lanmaydi); narx va oylar — «Mentorning taxmini»; maxfiy kalit tilga olinmaydi.
⚠️ Modul raqami o'quvchi matnida — LMS raqami («12-Modulda»); kod raqami (`m11-01`, `src/11-Modull`) faqat fayl yo'lida. Dars raqami o'quvchi matnida yo'q.
Manba: `00-MODUL-TAYANCH.md` (**1.0 — boshlanish, Pro va «Doimiy o'yin»** · **1.1 — jalb qilish narxi, keltiradigan pul, Mentor va «agar» sonlari, halol gaplar — AYNAN** · **1.13 — sonlar jadvali, 1-qator** · 2 — atamalar · 3 — teg 01 · 4 — keyssiz PM shakli · 7 — sinflar · 8 — `pm-m11d1-birlik` · 9 — hozircha bo'sh) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 3, 6, 17, 21, 22, 23) · `00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` (4 — o'tilgan atamalar) · 12-Modul tayanchi (1.6 — Mentorning uch kanali · 1.7 — ishga tushirish kuni · 1.12, 1.13 — 20 · 38 · 44, 43% · 8 — `pm-m10d6-kanallar`, `pm-m10d10-hisobot` · 9.42–9.44) ·
namunalar: 12-Modul `10-PmUsersCheck-v3.md` + `10-FILTR.md` · `12-PmGrowthPitch-v3.md` (9-ekran — kod oynasi) + `12-FILTR.md` · `11-PmPitchReview-v3.md` (keyssiz shakl) + `11-FILTR.md` · `QURUVCHI_SABOQ.md` E 40–55.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Mahsulotining CAC va LTV'si»; tayanch 1.1, 4; Qaror-0 2, 17): o'quvchi o'z mahsuloti uchun ikki sonni yozadi — **jalb qilish narxi** (12-Moduldagi kanallariga sarflangan pul va shu davrda kelgan yangi foydalanuvchilar) va **foydalanuvchi keltiradigan pul** (kim to'lashi mumkin, narx va oylar taxmini) —
   har biri «taxmin» yoki manba yorlig'i bilan; ikkalasini bitta to'lovchi uchun solishtiradi (qoplanadi · zarar · teng · noma'lum; kanallarga pul sarflanmagan bo'lsa — «pul sarflanmagan») va ikki sonni hisoblaydigan kod yozadi. Saqlanadi `pm-m11d1-birlik` (2, 4-darslar o'qiydi). Uyga vazifa — yakun kartasida (alohida `.homework.jsx` yo'q).
   O'quvchi sonlari ko'pincha 0 va taxmin (pilot eslatmasi): yakun sarlavhasi holatga qarab; «zarar» — yomon baho emas.
2. **Bugungi asosiy fikr (P-013; dars ichida turadi, yakunda KO'RSATILMAYDI — SABOQ E 50):** Keltiradigan pul to'lovchini jalb qilish narxini qoplashi kerak; mahsulotni ushlab turish puli hisobda yo'q. (108) Bu misolda jalb qilish narxi bepul kanallarda 0 so'm (fakt), keltiradigan pul esa hozircha taxmin.
   (Tayanch 1.1 gapi aynan. 07.10 F-1007-459, ChatGPT auditi: eski «… kam bo'lsagina mahsulot o'zini oqlaydi» yetarli shartdek o'qilardi, hisobda esa faqat kanal puli bor. 0 so'm — fakt; taxmin — keltiradigan pul va «agar» mashqi — TAYANCHGA SAVOL 7.)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4):**
   - 12-Modul: **kanal** — odamlar mahsulot haqida eshitadigan joy · **post** · kanal nomlari (sinf chati, mahalla guruhi, Instagram sahifasi — `pm-m10d6-kanallar.nom`) · **ro'yxatdan o'tgan** (Database, `namuna = false`) · sinfdoshlar sanaladi, lekin alohida aytiladi ·
     **metrika hisoboti** (to'rt son, har birining manbasi va sanasi bilan) · **qaytganlar foizi** — Mentor misolida birinchi haftada ochgan 61 qurilmadan 26 tasi ikkinchi haftada ham ochdi (43%) · **asosiy harakat** · **Mentorning taxmini** (12-Modul 7-dars yorlig'i) · **dalil** (son yoki yozuv · manba · qachon).
   - 11-Modul: **tashkilotchi** · **o'yinchi** (rol bilan, ismsiz) · «Maydon Jamoa» — namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
   - Kod oynasi (`HtmlCompiler`, JS): `function`, `return`, `if`, `null` — 6–12-Modul kod oynalarida ishlatilgan; bugun yangi kod tushunchasi yo'q.
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar tayanch 2-bo'limdan, dars bo'yi so'zma-so'z (T-042):**
   - **jalb qilish narxi** — «bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lganda chiqadigan son» (tayanch: «bir davrda kanallarga sarflangan pul ÷ shu davrda kelgan yangi foydalanuvchilar»; belgi-formula o'quvchi matnida yo'q — T-035).
     2-ekran xulosasida tug'iladi — Mentorning bepul kanallari (0 so'm) va «agar» pullik kanal (5 000 so'm) hisoblangandan keyin. Inglizchasi «CAC» — faqat kartochkada bir marta.
   - **foydalanuvchi keltiradigan pul** — «bitta foydalanuvchidan butun foydalanish davomida keladigan pul»; hisoblash (tayanch: «sodda hisob») — «narxni necha oy to'lashiga ko'paytiramiz» (4-ekran xulosasi). Qisqa shakli — **keltiradigan pul** (ustun yorlig'i, «u keltiradigan pul»). Inglizchasi «LTV» — kartochkada bir marta.
   - **pullik obuna** — «ma'lum muddatga to'lanadigan foydalanish»; doim ikki so'z (ATAMA-q1 A). **Pro** — Mentor misolida tashkilotchi uchun 30 kunlik pullik obuna; undagi bitta qulaylik — **«Doimiy o'yin»**: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi (tayanch 1.0). Bu darsda Pro — **Mentorning rejasi** (ilovada hali yo'q; qachon qurilishi aytilmaydi — T-038).
     Model nomi («bepul asos va pullik qo'shimcha») va nega pul tashkilotchidan — bu darsda aytilmaydi (2-darsning kashfiyoti; pilot eslatmasi).
   - **to'lovchi** — «pul to'laydigan foydalanuvchi» (5-ekran, 2-qadamdan keyin `QIzoh`); Mentor misolida — Pro oladigan tashkilotchi. Qoida: ikki son bitta to'lovchi uchun solishtiriladi (tayanch 1.1 «agar»: «bitta tashkilotchini jalb qilish 60 000 so'm → u keltiradigan puldan (30 000) ko'p»). So'z — tayanch 8 («to'lovchi bo'lishi mumkin bo'lganlar»); ta'rifi — TAYANCHGA SAVOL 2.
   - **pullik kanal** — «pul to'lab post chiqariladigan kanal» (2-ekran, «agar» mashqida kulrang qator; TAYANCHGA SAVOL 1). Faqat «agar» mashqida; reklama narxi haqida fakt aytilmaydi (tayanch 1.1).
   - **qoplanadi** · **zarar** · **teng** · **noma'lum** · **pul sarflanmagan** — bitta to'lovchi uchun ikki sonni solishtirish natijasi (atama emas, oddiy so'z; 5, 7-ekran muhri): qoplanadi — keltiradigan pul jalb qilish narxidan ko'p · zarar — kam · teng — teng · pul sarflanmagan — kanallarga 0 so'm (solishtirish hech narsa demaydi).
     Muhr ostida doim: «Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan.» «Zarar» — baho emas: qaysi son o'zgarishi kerakligini ko'rsatadi.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015):**
   - **«foydalanuvchi»** — tushuncha nomi (jalb qilish narxi ta'rifida); **«kishi»** — faqat son bilan sanoq so'zi («44 kishi», Database'dagi ro'yxatdan o'tgan); **«to'lovchi»** — pul to'laydigan foydalanuvchi; **«a'zo»** — kanal (guruh, chat) a'zosi; «odam» — o'quvchi matnida sanoq va atama o'rnida ishlatilmaydi (faqat juftlik yo'rig'ida «Odam haqida emas» — baholanayotgan sherik ma'nosida; «odam belgisi» — MD dagi vizual ta'rifi).
   - **«jalb qilish narxi»** — 2-ekran xulosasidan keyin hamma joyda shu nom; «olib kelish» — faqat atama tug'ilishidan oldin (hook, reja 01, 2-ekran sarlavhasi va bashorati) hodisa tilida. «akvizitsiya», «CAC» (prozada) — yo'q.
   - **«sarflangan pul»** — kanallarga ketgan pul; «xarajat» — bu darsda yo'q (4-dars atamasi: mahsulotni ushlab turish puli). Kod parametri — `sarf`.
   - **«narx»** — Pro yoki o'quvchi mahsulotining 30 kunlik narxi (taxmin); **«son»** — hamma sanalgan narsa; «raqam» — yo'q (dars nomida ham yo'q).
   - **«hisoblash»** — fe'l sifatida; **«hisob»** ot sifatida o'quvchi matnida yo'q: 12-Modulda «hisob» — akkaunt («Hisobni o'chirish»); tayanchdagi «Mentor hisobi», «"agar" hisobi» — o'quvchi matnida «Mentor misoli», «"agar" mashqi». «hisobot» — faqat «metrika hisoboti».
   - **«foyda»** — bu darsda yo'q (12-Modulda lending foydalari — boshqa ma'no); «qoplanadi» — foyda emas: mahsulotni ushlab turish puli hisobga kirmaydi. **«o'zini oqlaydi»** — ishlatilmaydi (F-1007-459: yetarli shartdek o'qiladi). **«obuna»** — faqat «pullik obuna». **«qiymat»**, **«reklama»**, **«xabar»**, **«hodisa»**, **«test rejim»**, **«sinov»** — bu darsda yo'q.
   - **«taxmin»** — ikki joyda bir ma'noda: bashorat natijasi (`QTaxmin` «Taxminingiz …») va hali tekshirilmagan son («Mentorning taxmini», o'quvchi kartasidagi «taxmin» yorlig'i) — 12-Modul 7-dars odati.
   - **«mashq»** — «agar» mashqi va «mashq sonlari» (Mentorning taxmini); `tur: 'mashq'` — o'quvchi Mentor sonlari bilan ishlaganda. **«tekshiruv»** — kod shartlari va juftlik varag'i (ish tekshiruvi).
   - **Ishlatilmaydi:** CAC, LTV (prozada), unit-ekonomika, yunit, freemium, paywall, monetizatsiya, podpiska, «obuna» yolg'iz, «foydalanuvchi qiymati», tannarx, foyda (pul ma'nosida), «o'zini oqlaydi», «hisob» (ot), chip, slot, daftar, «darrov», «har doim», «albatta».
6. **Raqamlar (faqat tayanch 1.0, 1.1, 1.13 va 12-Modul tayanchi 1.6, 1.7, 1.13; o'quvchi matnida «Mentor misolida» / «Mentorning taxmini»):**
   - **Fakt (Mentor misoli):** ro'yxatdan o'tgan **44** kishi (**11 tasi — sinfdosh**) — ilova ishga tushgandan keyingi ikki hafta (12-Modul 1.12, 1.13: 20 · 38 · 44) · kanallar — mahalla futbol guruhi, sinf chati, Instagram sahifasi (12-Modul 1.6; kim qaysi kanaldan kelgani sanalmagan — kanal bo'yicha faqat lendingga tashrif sanalgan), kanallarga pul **0 so'm** → jalb qilish narxi pulda **0 so'm** (sodda hisob: shu davrdagi hamma yangi foydalanuvchi) ·
     tashkilotchilar **6** (44 kishi ichida; `namuna = false`, kamida bitta o'yin e'lon qilgan) · qaytganlar foizi **43%** (61 qurilmadan 26 tasi — qurilma o'lchovi).
   - **Mentorning taxmini:** Pro — **30 kun uchun 10 000 so'm** · tashkilotchi Pro'ni o'rtacha **3 oy** ushlab turadi → bitta Pro tashkilotchi keltiradigan pul **30 000 so'm**.
   - **«Agar» mashqi (Mentorning taxmini):** pullik kanalga **60 000 so'm** · **12** kishi ro'yxatdan o'tdi → bittasi **5 000 so'm** · ular ichida **1** tashkilotchi → bitta tashkilotchini jalb qilish **60 000 so'm** → u keltiradigan puldan (30 000) ko'p — **bu misolda zarar**.
   - Boshqa son yo'q: 15 000 (4-dars narxi), 51 (10-dars), 83 000 (4-dars) — bu darsda ochilmaydi (sinf 12). Har xil o'lchovdagi sonlar (kishi · qurilma) ayirilmaydi; «44 dan 6 ni ayirib» kabi yangi son chiqarilmaydi.
   - Testlar va arenadagi ikkinchi misol sonlari (kitob almashish ilovasi: 24 000 so'm, 8 kishi, 12 kishi; arena: 25 000, 20 000) — **mashq sonlari**, fakt emas; savol yonida kulrang «mashq sonlari».
7. **Misol-ip — «Maydon Jamoa» (tayanch 1.0):** 12-Modulda ilova 44 foydalanuvchiga yetdi, kanallarga pul sarflanmadi. Bugun Mentor ikki savolni beradi: bitta foydalanuvchi qanchaga tushdi va bitta foydalanuvchi qancha pul keltiradi.
   Ikkinchi misol faqat testlarda (P-002): **kitob almashish ilovasi** (3-ekran), arena — **uy vazifalari ilovasi**, **to'garak sayti**. Metafora yo'q. Keys yo'q.
8. **Pul chegarasi (Qaror-0 6; TAQIQLAR 1):** reja ekranida bitta kulrang qator — «Bu modulda haqiqiy pul to'lanmaydi va so'ralmaydi.» · «agar» mashqida — «Mashq sonlari — Mentorning taxmini: hech qayerga pul to'lanmagan.» · uyga vazifa kartasi ostida — «Hech qayerga pul to'lamang: pullik kanal — faqat mashq.»
   O'quvchini pullik kanalga pul to'lashga undash yo'q; «narxni shuncha qo'ying» yo'q (narx — o'quvchining o'z taxmini).
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; kanal kartalari, odam belgilari, telefon, ustunlar, muhrlar — chizilgan (CSS/SVG), logotip yo'q; ✓ ✕ › ✎ — belgilar. «Maydon Jamoa» — faqat telefon maketida, o'z rangida (11-Modul 9.62 yashili).
   O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q. Matn o'lchovi — «O'lchov» bo'limi (skript bilan sanalgan; qavsdagi sonlar — belgilar soni).
10. **Kod oynasi (tayanch 1.1, 4; PM-082):** `app.js` — ikki funksiya: `jalbNarxi(sarf, yangi)` (yangi 0 → `null`, bo'lish yo'q) va `keltiradi(narx, oy)`; namuna obyektlar — Mentorning «agar» sonlari va o'quvchining sonlari (`meniki`).
   Natija qismi tayyor: Mentor misoli uchun bitta foydalanuvchi va bitta tashkilotchi jalb qilish narxi, keltiradigan pul va xulosa («zarar»); o'quvchi uchun — ikki son (yorliq «Mahsulotim» yoki «Mashq»; keltiradigan pul yo'q bo'lsa — «noma'lum», yangi foydalanuvchi 0 bo'lsa — «bo'lib bo'lmaydi»). Tekshiruv — o'z namunasi bilan (SABOQ 37), `meniki` ga bog'lanmaydi.
   PM darslarida kod mexanikasi ketma-ket takrorlanmaydi: 12-Modul 12-dars — kod oynasi (grafik) · bu dars — kod oynasi (hisoblash; boshqa mexanika) · 2-dars — Neon SQL (tayanch 4).
11. **Saqlash kalitlari (tayanch 8 — pilot kaliti, shu holicha):** o'qiydi `pm-m10d6-kanallar` (`kanallar[].nom`, `ruxsat`) va `pm-m10d10-hisobot` (`royxat.soni`, `royxat.sinfdosh`, `royxat.sana`, `tekshiruv`, `tuzatishQator`);
    yozadi `pm-m11d1-birlik` = `{ tur: 'real' | 'mashq', davr, kanallar: [{ nom, sarf, yangi }], jalbNarxi, kimTolaydi, narxTaxmin, oyTaxmin, keltiradi, xulosa: 'qoplanadi' | 'zarar' | 'teng' | 'nomalum' | 'sarfsiz', savedAt }` (KOD 8 — qiymatlar qoidasi; TAYANCHGA SAVOL 3–5).
    Kod oynasi qoralamasi — `pm-m11d1-code`. Kalitga ism, login, telefon, guruhning haqiqiy nomi yozilmaydi (`nom` — kanal turi). Kalitlar yo'q bo'lsa — o'quvchi o'zi yozadi.
12. **Vaqt (≈ 90 daqiqa — reja; ⛔ «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · jalb qilish narxi va 1-savol (2–3) ≈ 13 · keltiradigan pul, solishtirish va 2-savol (4–6) ≈ 17 ·
    o'z sonlaringiz (7) ≈ 15 · juftlikda tekshiruv (8) ≈ 10 · kod oynasi (9) ≈ 15 · yakuniy savol, podium, kartochkalar, arena (10–13) ≈ 15.
    **Ulgurmasangiz:** 7-ekran — kalitlar yo'q yoki son topilmasa «Hozircha bilmayman» (son o'ylab topilmaydi), mahsulotda son bo'lmasa — «Mentor sonlari bilan mashq» (`tur: 'mashq'`) · 8-ekran — juftlik vaqti yetmasa yakka rejim (o'zi belgilaydi) ·
    9-ekran — «Kodni uyda tugataman» (nishon yo'q, uyga vazifa ③) · yakun sarlavhasi holatga qarab (13-ekran, to'rt holat).
    Pilotda 90 daqiqadan oshsa — birinchi qisqaradigan joy oldindan belgilangan: 8-ekran yakka rejimga, 9-ekran uyga (ChatGPT auditi bahosi 100–115 daqiqa — o'lchanmagan; F-1007-459).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0):** 12-Modulda «Maydon Jamoa» odamlarga yetdi: 44 kishi ro'yxatdan o'tdi, kanallarga pul sarflanmadi. 13-Modulda mahsulot pul topa boshlaydi — birinchi savol: bitta foydalanuvchi qanchaga tushadi va qancha keltiradi.
- **Dars ipi:** 0 — o'z kanallaringiz: foydalanuvchi sizga nimaga tushdi (ballsiz) → 2 — Mentor misolida bepul kanallar (0 so'm) va «agar» pullik kanal (5 000 so'm) — atama «jalb qilish narxi» → 3 — test → 4 — o'yinchi va tashkilotchi: Pro, 3 oy — atama «foydalanuvchi keltiradigan pul» →
  5 — «agar» kanal: bitta foydalanuvchi va bitta tashkilotchi — atama «to'lovchi», xulosa «zarar» → 6 — test → 7 — o'z mahsulotingiz uchun ikki son → 8 — sherik tekshiruvi → 9 — kod → 10 — yakuniy savol → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Bitta foydalanuvchi» sahnasi (`BirlikSahna`, dars bo'yi, 163/180; bitta manba `MENTOR_KANALLAR` + `MENTOR_SONLAR` + `AGAR` + o'quvchi kaliti `pm-m11d1-birlik`):**
  - **kanallar** — kanal kartalari (nomi + narx yorlig'i: «? so'm» → «0 so'm»; «agar» kartasi «pullik kanal · 60 000 so'm», yorliq «Mentorning taxmini · mashq»); bosiladigan.
  - **foydalanuvchilar** — kanal kartalari ostida odam belgilari to'plami (har biri bosh, soch, rangli kiyim — D 36; 44 ta — 11 qatordan 4 tadan, sinfdoshlar bir rangda, tashkilotchilar kichik «E'lon» belgisi bilan); son yorlig'i ostida.
  - **telefon** (chapda, ≈170×272): «Maydon Jamoa» ilovasi — «O'yinlar» ekrani (karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»); o'yinchi ko'rinishida «Qo'shilaman», tashkilotchi ko'rinishida «E'lon berish» yonadi. Faqat 0 (Mentor misoli zaxirasi) va 4-ekranda.
  - **ikki ustun** (o'ngda): «Jalb qilish narxi» (accent) va «Keltiradigan pul» (yashil) — gorizontal ustun, so'm shkalasi, ustida son; ustunlar orasida muhr: «qoplanadi» (yashil) · «zarar» (qizil, ✕ emas — matnli muhr) · «teng» · «noma'lum» · «pul sarflanmagan» (uchalasi kulrang); muhr ostida doimiy kulrang qator «Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan.» va holatga qarab halol qator (TAYANCHGA SAVOL 18).
    Atama tug'ilguncha (2-ekran) ustun yorlig'i — «Bitta foydalanuvchiga».
  - Ishlatiladi: 0 (kichik: kanallar + son) · 1 (o'zi yuradi) · 2 (kanallar + foydalanuvchilar + 1-ustun) · 3 (javobdan keyin kichik karta) · 4 (telefon + 2-ustun) · 5 (foydalanuvchilar + ikki ustun + muhr) · 6 (javobdan keyin kichik ustunlar) · 7 (o'quvchi sonlari bilan ikki ustun) · 8 (ixcham) · 9 (natija ustunlarga uchadi) · 10 (javobdan keyin).
    Bir ekranda ko'pi bilan uch blok (vizual qismlari + harakat paneli). `prefers-reduced-motion` da uchish, sanash va to'lqin yo'q — yakuniy holat birdan qo'yiladi. Telefon kengligida (393) ustunlar sahna ostiga tushadi; odam belgilari 44 tadan 11 × 4 to'r — kesilmaydi (E 41).
- **Keyingi bosiladigan joy (qat'iy):** har holatda bitta faol element — yengil halqa (scale ≤ 1.03, sikl ≥ 2 s); tanlov guruhida har variantning o'z chegarasi, to'lqin navbatma-navbat 2 marta (E 40). Yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Jonli ekran (SABOQ 19, E 46):** kirishda elementlar navbat bilan (60–120 ms) · bosish → so'm yorlig'i kartadan ustunga uchadi · yangi odam belgilari navbat bilan kiradi · ustun o'sib chiqadi, hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Bitta foydalanuvchi sizga qanchaga tushadi?** (43) — dars nomi (DE-205)
- Mentor: 12-Modulda foydalanuvchilarni o'z kanallaringizdagi postlar orqali yig'dingiz — o'sha kunlarni eslab, javobni tanlang.
- Maket (chap; `BirlikSahna` kichik):
  - `pm-m10d6-kanallar` bo'lsa — o'quvchi kanallari (`ruxsat: 'bor'`, ≤3) kanal kartalari bo'lib, har birida kulrang «? so'm»; ostida odam belgilari va qator «Ro'yxatdan o'tgan: {royxat.soni}» (`pm-m10d10-hisobot`; `tuzatishQator === 'royxat'` bo'lsa — son o'rnida «?»).
  - Kalitlar yo'q bo'lsa — Mentor misoli: telefon «Maydon Jamoa» («O'yinlar», karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»); telefon yonida uch kanal kartasi — mahalla futbol guruhi · sinf chati · Instagram sahifasi (har birida «? so'm»); ostida kulrang «44 kishi ro'yxatdan o'tgan · Mentor misolida».
- Variantlar (radio, o'ng; bir uzunlikda):
  - Hech narsaga — kanallarga pul bermadim (38)
  - Pulga emas — postlarga ketgan vaqtimga (38)
  - Bilmayman — buni hech sanamaganman (34)
- Javob — «Hech narsaga»: **Qiziq fikr!** Pulda — rost: bu kanallarda pul so'ralmaydi. Lekin har post va javobga vaqt ketgan. (95)
- Javob — «Pulga emas»: **Aynan!** Pul ketmagan bo'lsa ham, post yozish va javob berishga vaqt ketgan. (74)
- Javob — «Bilmayman»: **Qiziq fikr!** Kanallaringizga qarang: postlar bepul joyda bo'lsa, pul emas — vaqt ketgan. (87)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegarada qotadi, qolgani xiralashadi; har kanal kartasidagi «? so'm» bir lahza accent bo'lib yonadi va odam belgilari ostida yangi kulrang qator chiqadi: «Bitta foydalanuvchiga: ? so'm» —
  son ochilmaydi (2-ekran kashfiyoti, P-036). Javob matni variantlar ostida. Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga; «Aynan!» / «Qiziq fikr!» — kurs qonuni T-028, T-067; 12-Modul 12-dars naqshi). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — Mentor sonlari 2-ekranda chiqadi. Sinfdan so'rang: «Postingizni yozish va javob berish qancha vaqt oldi?» (son yig'ilmaydi, qo'l ko'tartirilmaydi).
  12-Modulda kanallar bepul edi (sinf chati, guruhlar, Instagram) — pul to'lagan o'quvchi bo'lsa, u 7-ekranda o'z sonini yozadi; pul to'lash rag'batlantirilmaydi.
✎ Hook — o'quvchining o'z ishi (12-Modulda foydalanuvchilarni yig'di) va o'z savoli (P-016). Mentor gapida «bepul» so'zi yo'q — javobni oldindan aytmaydi. Uch javob hech bir tanlovni yolg'onga chiqarmaydi: «Hech narsaga» — pulda rost deb tan olinadi, vaqt qo'shiladi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun foydalanuvchi uchun ikki sonni hisoblaysiz.** (49)
- Mentor: Sonlar 12-Moduldagi kanallaringiz va metrika hisobotingizdan olinadi. Ular topilmasa — o'zingiz yozasiz.
- Chap — «Dars oxirida» + kulrang yorliq **jalb qilish narxi va foydalanuvchi keltiradigan pul** (App.jsx osti so'zma-so'z, P-015; atamalar faqat yorliqda) + vizual: `BirlikSahna` o'zi yuradi (DE-200) —
  Mentor misolidagi uch kanal kartasi navbat bilan kiradi, ostida odam belgilari to'planadi (kanal kartalaridan «tushmaydi» — kim qaysi kanaldan kelgani sanalmagan); o'ngda ikki ustun joyi — yorliqlari «bitta foydalanuvchiga» va «bitta foydalanuvchidan», son o'rnida «?» (kashfiyot ochilmaydi; SABOQ D 33 — haqiqiy nomlar, matnsiz bo'sh chiziq yo'q).
  Vizual ostida bitta kulrang qator: Bu modulda haqiqiy pul to'lanmaydi va so'ralmaydi. (50)
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Bitta foydalanuvchini olib kelish qanchaga tushishini sanaysiz · `jalb qilish narxi`
  - 02 · Foydalanuvchi qancha pul keltirishini hisoblab, solishtirasiz · `keltiradigan pul`
  - 03 · Ikki sonni o'z mahsulotingiz uchun yozasiz · `taxmin`
  - 04 · Ikki sonni hisoblaydigan kod yozasiz · `kod oynasi`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Modul boshida bir gap ayting: bu modulda pul haqida gaplashamiz, lekin hech kim haqiqiy pul to'lamaydi — to'lovlar test rejimda, narxlar taxmin. Kanallar va metrika hisoboti 12-Moduldan; topilmasa dars to'xtamaydi — o'quvchi o'zi yozadi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «ikki son»; atamalar kulrang yorliqda va teglarda. «sonlar … metrika hisobotingizdan» — o'quvchida 12-Modul hisoboti bor (T-039); yo'q bo'lsa ham yo'l bor (Mentorning ikkinchi gapi). Reja 02 qatori «solishtirasiz» deydi, natijani («zarar») ochmaydi (P-015).

## 2 · Jalb qilish narxi  ← QTushuncha (ketma-ket, 2 qadam; P-055)
- Eyebrow: Tushuncha · jalb qilish narxi
- Sarlavha: **Mentor misolida bitta foydalanuvchi qanchaga tushdi?** (52) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Mentor shu davrda kanallarga post yozgan — har kanalni bosib, unga qancha pul ketganini ko'ring.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Bitta foydalanuvchini olib kelish necha so'mga tushgan?** · 0 so'm · bir necha ming so'm · o'n ming so'mdan ko'p —
  tanlangach yopilmaydi: ixcham qator natijagacha turadi; kanal kartalari shundan keyin yoqiladi.
- Vizual (≤ 3 blok — kanallar va foydalanuvchilar · ustun kartasi · pastki tugma):
  - **chapda — kanallar** (yorliq «Mentor misolida»): uch kanal kartasi — mahalla futbol guruhi · sinf chati · Instagram sahifasi, har birida «? so'm»; ostida umumiy maydon «Shu davrda ro'yxatdan o'tganlar» — odam belgilari uchala kanal bosilgach kiradi, kanal kartalaridan emas (kim qaysi kanaldan kelgani sanalmagan; bo'sh kulrang kontur yo'q, SABOQ D 33);
  - **o'ngda — ustun kartasi «Bitta foydalanuvchiga»**: ikki qator «Kanallarga sarflangan pul: ? so'm» · «Shu davrda yangi foydalanuvchilar: ?» va ostida natija «? so'm».
- Qadamlar (chiziq «1 Bepul kanallar · 2 Pullik kanal» — joriysi accent, o'tgani ✓):
  1. **Bepul kanallar** — har kanal kartasi bosiladi (uchtasi): kartada «0 so'm» yoziladi va shu yorliq ustun kartasidagi «sarflangan pul» qatoriga uchadi (0 · 0 · 0 → «0 so'm»).
     Uchinchisidan keyin odam belgilari umumiy maydonga navbat bilan kiradi (hisoblagich 1 → 44), 11 tasi bir rangda; qator: «Shu davrda yangi foydalanuvchilar: 44 kishi · ishga tushgandan keyingi ikki hafta» va kichik kulrang «11 tasi — sinfdosh».
     Natija qatori: «0 so'mni 44 kishiga bo'lamiz → 0 so'm» (strelka — maket ichida, T-035 o'quvchi izohiga tegishli). `QIzoh` (tayanch 1.1 halol gapi aynan): Bu misolda pul sarflanmagan — vaqt sarflangan. Guruh va sinf chatidagi a'zolar soni cheklangan. (95)
  2. **«Agar pullik kanal bo'lsa?»** — katta tugma kanallar ostida, halqada (SABOQ D 34; Mentor gapi almashadi: Endi «Agar pullik kanal bo'lsa?» tugmasini bosing — ikki natijani solishtiring.):
     to'rtinchi kanal kartasi kirib keladi — «pullik kanal · 60 000 so'm», ustida yorliq «Mentorning taxmini · mashq», ostida kulrang qator «pul to'lab post chiqariladigan kanal»; ostiga 12 ta odam belgisi boshqa rangda kiradi (hisoblagich 1 → 12; «agar» mashqi: shu kanal davrida 12 kishi ro'yxatdan o'tsa);
     ustun kartasida ikkinchi ustun: «60 000 so'mni 12 kishiga bo'lamiz → 5 000 so'm». `QIzoh`: Mashq sonlari — Mentorning taxmini: hech qayerga pul to'lanmagan. (65)
- **Harakat → Vizual o'zgarish:** kanal kartasini bosish → kartada so'm yozuvi paydo bo'ladi va ustun kartasiga uchadi; uchinchi kartadan keyin odam belgilari kiradi va natija chiqadi; «Agar pullik kanal bo'lsa?» → yangi karta, 12 odam belgisi, ikkinchi natija.
  Xato harakat yo'q (har karta bosiladi); bosilgan karta qayta bosilsa — o'zgarish yo'q.
- Natija (bitta yashil blok; `tugadi` — kanal kartalari va tugma yopiladi, ustun kartasi butun enga, ikki natija yonma-yon: «bepul kanallar · 0 so'm» va «pullik kanal (mashq) · 5 000 so'm»; vizual ⛶ ichida — q17/q18):
  birinchi kichik qator — taxmin natijasi (E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 0 so'm» (tanlangan javob qaytarilmaydi).
- Xulosa: Bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lsak — jalb qilish narxi. (110) — atama shu yerda tug'iladi (T-011)
- Tugma (pastki): Avval belgilang → Kanallarni bosing (n/3) → Pullik kanalni ko'ring → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Halqadagi kanal kartasini bosing — unga ketgan pul shu yerda yoziladi. (70)
- Keyingi bosiladigan joy: bashorat variantlari → kanal kartalari (navbatma-navbat to'lqin) → «Agar pullik kanal bo'lsa?» → «Davom etish».
- Mentor rejimi: proyektorda shu sahna; Mentor kanallarni o'zi bosadi, sinf bashoratni ovoz bilan aytadi.
- O'qituvchi eslatmasi: 44 — Mentor misolida ilova ishga tushgandan keyingi ikki haftada ro'yxatdan o'tganlar (11 tasi — sinfdosh; sinfdoshlar sanaladi, lekin alohida aytiladi). Bu — sodda hisob: shu davrdagi hamma yangi foydalanuvchi olinadi; kim qaysi kanaldan kelgani Mentor misolida sanalmagan (12-Modulda kanal bo'yicha faqat lendingga tashrif sanalgan) — «44 kishi shu kanallardan keldi» demang.
  Bepul kanal ham «tekin» emas: post yozish, javob berish, guruh egasidan ruxsat so'rash — vaqt.
  Mentor misolida guruh va sinf chatidagi a'zolar soni cheklangan: ular ro'yxatdan o'tib bo'lgach, u yerdan yangi foydalanuvchi kam kelishi mumkin — bu shu misol haqida, har bepul kanal haqida emas. 60 000 va 12 — mashq sonlari (Mentorning taxmini): pullik post narxi haqida fakt aytmang; o'quvchilarni pullik kanalga pul to'lashga undamang — bu dars uni faqat hisoblaydi.
  Sinfga savol: «Sizning kanallaringizda hali ro'yxatdan o'tmagan a'zo qolganmi?» (javoblar og'zaki, sanalmaydi).
✎ Ikki qadam — tayanch 1.1 tartibi: avval Mentor misoli (0 so'm, halol gap), keyin «agar» mashqi (5 000 so'm). Atama ikkalasidan keyin, xulosada (T-011, PM-030). Davr — 12-Modul 1.13 dagi «ikki hafta o'tib» (TAYANCHGA SAVOL 6).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · jalb qilish narxi (savol ustida yorliq yo'q — SABOQ 6)
- Material (savol ustida, kichik chizilgan karta, P-009; yorliq «mashq sonlari»): **Kitob almashish ilovasi · shu oy** — «Pullik kanalga: 24 000 so'm» · «Shu oy kelgan yangi foydalanuvchilar: 8 kishi (3 tasi — sinfdosh)» · «Ilovada jami: 12 kishi»
- Savol: **Bitta yangi foydalanuvchini jalb qilish narxi necha so'm?** (8 so'z)
  - A — 2 000 so'm (10)
  - ✔ B — 3 000 so'm (10)
  - C — 4 800 so'm (10)
  - D — 24 000 so'm (11)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («N so'm»); savoldagi son javobda yo'q (S-019 — savolda son yo'q).
- To'g'ri izohi: Pul shu oy kelgan 8 kishiga bo'linadi — sinfdoshlar ham. (56)
- Xato izohlari (≤60; javobni aytmaydi):
  - A: 12 — ilovadagi hamma. Shu oy nechtasi yangi keldi? (50)
  - C: Sinfdoshlar ham yangi foydalanuvchi — ular sanaladimi? (54)
  - D: Bu — butun pul. Bitta foydalanuvchiga qanchadan tushadi? (56)
  - (umumiy) Pul qaysi foydalanuvchilarga bo'linishini eslang. (49)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): material kartasida «8 kishi» accent bilan yonadi, «24 000 so'm» unga chiziq bilan ulanadi, uchida «3 000 so'm».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Cost Check! — birinchi urinishda to'g'ri.
- Izoh (MD): distraktor turkumlari har xil (sinf 8): A — noto'g'ri guruh (eski foydalanuvchilar ham kirdi) · C — boshqa qoidani buzadi (sinfdoshlarni chiqardi; 12-Modul qoidasi — sanaladi, alohida aytiladi) · D — bo'linmagan.
  Sonlar — mashq (P-002), reklama narxi haqida fakt emas (tayanch 1.1). Ikkala trekka to'g'ri keladi.

## 4 · Keltiradigan pul  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · keltiradigan pul
- Sarlavha: **Bitta foydalanuvchi qancha pul keltiradi?** (41) — 2-ekran savolining davomi (T-064)
- Mentor: Mentor misolida foydalanuvchilar ilovada har xil ish qiladi — tugmalarni birma-bir bosib, telefonga qarang.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **44 kishidan nechtasi ilovaga pul to'lashi mumkin?** · ozchiligi · yarmi · hammasi — tanlangach ixcham qator natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok): **chapda** — telefon «Maydon Jamoa» («O'yinlar», karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10») · **o'ngda** — ustun kartasi «Bitta foydalanuvchidan» (qator «? so'm») · **pastda** — tugmalar qatori (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 O'yinchi · 2 Tashkilotchi · 3 Uch oy
- Tugmalar (Mentor misoli — tayanch 1.0, 1.1, 1.13):
  1. **O'yinchi** → telefonda o'yinchi ko'rinishi: «Shanba, 18:00» kartasi va «Qo'shilaman» tugmasi bir lahza yonadi; ustun kartasida qator: «O'yinchi: 0 so'm — ilova unga bepul».
  2. **Tashkilotchi** → telefonda tashkilotchi ko'rinishi: «E'lon berish» yonadi; ustun kartasiga kulrang ramkali qism sirg'alib kiradi (yorliq «Mentorning rejasi»; telefon ichida Pro ko'rsatilmaydi — ilovada hali yo'q): «Pro — tashkilotchi 30 kun uchun to'laydi: pullik obuna» · «Pro'da: «Doimiy o'yin» — har hafta shu kun va soatda o'yin o'zi e'lon qilinadi».
     Uning ostida qator: «Tashkilotchi: Pro — 30 kunga 10 000 so'm · Mentorning taxmini»; kartaning tepasida ixcham odam chizig'i: «44 kishidan 6 tasi — tashkilotchi» (6 ta odam belgisi accent).
  3. **Uch oy** → ustun kartasida uch oy katagi navbat bilan kiradi — «1-oy · 2-oy · 3-oy», har birida «10 000 so'm» tanga yig'iladi, hisoblagich 10 000 → 20 000 → 30 000; ustida yorliq «Mentorning taxmini: tashkilotchi Pro'ni o'rtacha 3 oy ushlab turadi»;
     natija: «Bitta tashkilotchidan: 30 000 so'm · taxmin». `QIzoh`: 3 oy — taxmin: qaytganlar foizi (43%) ilovani yana ochganlarni sanaydi, pullik obunani emas. (92)
- **Harakat → Vizual o'zgarish:** tugmani bosish → telefon shu foydalanuvchi ko'rinishiga o'tadi va uning asosiy tugmasi yonadi; ustun kartasiga qator sirg'alib kiradi; «Uch oy» → oy kataklariga navbat bilan so'm yoziladi, ustun «Keltiradigan pul» 30 000 gacha o'sadi.
- Natija (bitta yashil blok; `tugadi` — tugmalar qatori yopiladi, telefon va ustun kartasi butun enga): birinchi kichik qator — «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ozchiligi — 44 kishidan 6 tasi»;
  kartada ikki qator: «O'yinchi: 0 so'm» · «Tashkilotchi: 30 000 so'm · taxmin».
- Xulosa: Bitta foydalanuvchidan butun foydalanish davomida keladigan pul — foydalanuvchi keltiradigan pul. (97) — atama shu yerda tug'iladi
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (n/3) → Davom etish
- Ipucha (40 s): Yoqilgan tugmani bosing — telefonda nima o'zgarishini ko'ring. (62)
- Keyingi bosiladigan joy: bashorat → joriy tugma (to'lqin) → «Davom etish».
- Mentor rejimi: proyektorda shu sahna; Mentor tugmalarni bosadi.
- O'qituvchi eslatmasi: Pro va «Doimiy o'yin» — Mentor misolining rejasi: ilovada hali yo'q, bu darsda qachon qurilishi aytilmaydi. Nega pul o'yinchidan emas, tashkilotchidan — keyingi darsning savoli: bugun ochmang, faqat «Mentor misolida shunday» deng.
  10 000 va 3 oy — taxmin: hali hech kim to'lamagan. Hisoblashni so'z bilan ayting: «narxni oylar soniga ko'paytiramiz». 6 tashkilotchi — Database'dagi `namuna = false` va kamida bitta o'yin e'lon qilgan hisoblar; ular 44 kishi va 24 asosiy harakatni qilgan ichida.
  43% — qurilmalar bo'yicha (61 dan 26): ilovani yana ochish pul to'lash bilan bir xil o'lchov emas — «3 oy» unga tayanmaydi.
✎ Pro — faqat Mentor misolining fakti (tayanch 1.0), model nomi aytilmaydi (pilot eslatmasi). «Pullik obuna» — Pro kartasida hodisadan keyin («tashkilotchi 30 kun uchun to'laydi»), doim ikki so'z (ATAMA-q1 A).

## 5 · Ikki sonni solishtirish  ← QTushuncha (ketma-ket, 2 tugma)
- Eyebrow: Tushuncha · solishtirish
- Sarlavha: **Pullik kanal Mentor misolida o'z pulini qoplaydimi?** (51)
- Mentor: Pullik kanal mashqidagi sonlar qaytdi — tugmalarni birma-bir bosib, ustunlarga qarang.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **12 kishidan bittasi tashkilotchi bo'lsa, uni jalb qilish necha so'mga tushadi?** · 5 000 so'm · 30 000 so'm · 60 000 so'm — tanlangach ixcham qator natijagacha turadi.
- Vizual (≤ 3 blok): **chapda** — «pullik kanal · 60 000 so'm» kartasi (yorliq «Mentorning taxmini · mashq») va ostida 12 odam belgisi · **o'ngda** — ikki ustun: «Jalb qilish narxi» (bo'sh, «?») va «Keltiradigan pul — bitta tashkilotchidan: 30 000 so'm · taxmin» (4-ekrandan tayyor) · **pastda** — tugmalar: 1 Bitta foydalanuvchiga · 2 Bitta tashkilotchiga
- Tugmalar:
  1. **Bitta foydalanuvchiga** → 60 000 so'm 12 odam belgisiga teng bo'linadi (har biri ustida kichik «5 000»); «Jalb qilish narxi — bitta foydalanuvchiga: 5 000 so'm» ustuni o'sib chiqadi (30 000 ustunidan past); muhr o'rnida kulrang «?»;
     ustunlar orasida kulrang qator (Mentorning taxmini): Lekin ulardan bittasi to'laydi — qolganlari pul to'lamaydi. (59)
  2. **Bitta tashkilotchiga** → bitta odam belgisi accent bo'ladi (kichik «E'lon» belgisi bilan), qolganlari xiralashadi; 12 ta «5 000» uning ustiga yig'iladi; ustun «Jalb qilish narxi — bitta tashkilotchiga: 60 000 so'm» bo'lib, 30 000 ustunidan baland o'sadi; ustunlar orasiga qizil muhr tushadi: «zarar»; muhr ostida doimiy kulrang qator: Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan. (88)
     `QIzoh`: Pul to'laydigan foydalanuvchi — to'lovchi: ikki son uning uchun solishtiriladi. (79)
- **Harakat → Vizual o'zgarish:** 1-tugma → pul odam belgilariga bo'linadi, birinchi ustun o'sadi, «?» qoladi; 2-tugma → pul bitta tashkilotchiga yig'iladi, ustun keltiradigan puldan oshadi, muhr «zarar» tushadi.
- Natija (bitta yashil blok; `tugadi`): birinchi kichik qator — «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 60 000 so'm»; ikki ustun «60 000» va «30 000», muhr «zarar».
  Oxirgi kichik qator (ingichka ajratgich bilan, E 42): Zarar — baho emas: qaysi son o'zgarishi kerakligini ko'rsatadi. (63)
- Xulosa: Keltiradigan pul to'lovchini jalb qilish narxini qoplashi kerak; bu misolda qoplamaydi — zarar. (95)
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (n/2) → Davom etish
- Ipucha (40 s): Yoqilgan tugmani bosing — ustunlar qanday o'zgarishini ko'ring. (63)
- Keyingi bosiladigan joy: bashorat → joriy tugma (to'lqin) → «Davom etish».
- Mentor rejimi: proyektorda shu sahna.
- O'qituvchi eslatmasi: Ko'p uchraydigan xato — 5 000 ni 30 000 bilan solishtirib, «qoplanadi» deyish: 5 000 — har bir kelgan foydalanuvchi uchun, 30 000 esa to'laydigan tashkilotchidan. «12 kishidan bittasi tashkilotchi» — Mentorning taxmini.
  Mentorning haqiqiy holati (bepul kanallar): jalb qilish narxi pulda 0 so'm — pulda zarar yo'q, lekin vaqt ketgan; o'quvchi o'zinikini 7-ekranda ko'radi. «Zarar» — mahsulot yomon degani emas: bu misolda pullik kanal shu sonlar bilan o'z pulini qoplamaydi.
  «Qoplanadi» chiqqanda ham — bu faqat kanal puli haqida: mahsulotni ushlab turish puli (Backend, sayt) bu hisobda yo'q.
  Sinfga savol: «Sizning mahsulotingizda kim to'lovchi bo'lishi mumkin?» (javoblar og'zaki, sanalmaydi).
✎ Asosiy fikr (A-2) shu ekranda — Mentor misolida va «agar» sonlari bilan; xulosa «bu misolda» bilan chegaralangan (sinf 4, 5). «To'lovchi» — hodisadan (bitta tashkilotchi) keyin.

## 6 · 2-savol  ← QTest (✔ D, `correctIdx 3`; Mentor misoli)
- Eyebrow: Tekshiruv · solishtirish (savol ustida yorliq yo'q)
- Savol: **Mentor misolida pullik kanal o'z pulini qoplashini qaysi sonlar ko'rsatadi?** (10 so'z)
  - A — Bitta foydalanuvchini jalb qilish narxi va Pro'dan keladigan pul (64)
  - B — Kanaldan kelgan yangi kishilar soni va kanalga sarflangan pul (61)
  - C — Bitta tashkilotchini jalb qilish narxi va Pro'ning 30 kunlik narxi (66)
  - ✔ D — Bitta tashkilotchini jalb qilish narxi va u keltiradigan pul (60)
- Kalit: **D** (index 3). To'rttalasi bir shaklda («… va …»); «jalb qilish narxi» A, C, D da, «tashkilotchi» C va D da, «kel-» A, B, D da — kalit so'z faqat to'g'rida emas.
- To'g'ri izohi: Ikki son ham bitta tashkilotchi — to'lovchi haqida. (51)
- Xato izohlari:
  - A: Bitta foydalanuvchi to'lamasligi mumkin — kim to'laydi? (55)
  - B: Kishilar soni — pul emas. Qaysi ikki pul solishtiriladi? (56)
  - C: Tashkilotchi bir oy emas, bir necha oy to'laydi. (48)
  - (umumiy) Ikki son bitta to'lovchi haqidami — tekshiring. (47)
- Javob topilgach (kichik, savol ostida): 5-ekran ustunlari ixcham — «60 000» va «30 000», muhr «zarar».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Right Pair! — birinchi urinishda to'g'ri.
- Izoh (MD): savol Mentor misolida — o'yinchilar to'lamasligi berilgan, shuning uchun A (bitta foydalanuvchi) himoyalanmaydi; umumiy savolda (hamma to'laydigan mahsulot) A ham to'g'ri bo'lib qolardi (sinf 8).
  Turkumlar: A — o'lchov aralashgan (har kim ↔ to'lovchi) · B — pul o'rniga kishilar soni · C — butun davr o'rniga bir oylik narx. Arena 11 — boshqa so'z va holat (§144).

## 7 · O'z sonlaringiz  ← QMustaqil (USTAXONA — ketma-ket karta, 3 karta; E 43, E 53)
- Eyebrow: Mustaqil ish · ikki son
- Sarlavha: **Mahsulotingiz uchun ikki sonni yozing.** (38)
- Mentor: Har kartani to'ldirib, «Keyingi»ni bosing — bilmagan soningiz uchun «Hozircha bilmayman» bor.
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlanadi; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m10d6-kanallar.kanallar` (`ruxsat: 'bor'`) → 1-kartada kanal qatorlari (nomi);
  - `pm-m10d10-hisobot.royxat` → «Yangi foydalanuvchilar» (`soni`), «Davr» («ishga tushgandan {sana} gacha»), ostida kulrang «metrika hisobotidan · shundan {sinfdosh} tasi — sinfdosh» (`sinfdosh` > 0 bo'lsa);
  - `tekshiruv === 'tuzatish'` va `tuzatishQator === 'royxat'` bo'lsa — son qo'yilmaydi, o'rnida kulrang (12-Modul 9.43 i): Hisobotda bu son «tuzatish» olgan — tuzatilganini yozing. (57)
- **Tepada — ixcham chiziq «Ikki sonim · n/3»:** karta nomlari (Kanallar · Kim to'laydi · Narx va oy), to'ldirilgani ✓ (bo'sh uzuq qatorlar yo'q).
- **Markazda — bitta katta karta (joriy):**
  1. **Kanallar** — har kanal qatori: nomi · maydon (raqam belgisi va savol placeholder'da — E 43) `Sarflangan pul, so'm — bermagan bo'lsangiz 0` · «+ Kanal qo'shish».
     Ostida: `Shu davrda nechta kishi ro'yxatdan o'tdi?` (yonida tugma «Hozircha bilmayman») · `Davr: qachondan qachongacha?` · belgi (ixtiyoriy) «Har kanaldan nechta kelganini bilaman» → har qatorga `Yangi` maydoni.
     Jonli qator (karta ostida): «Jalb qilish narxi: {jalbNarxi} so'm» · yangi 0 bo'lsa: Yangi foydalanuvchi 0 — bo'lib bo'lmaydi. (41) · noma'lum bo'lsa: Yangi foydalanuvchilar soni hali noma'lum. (42)
  2. **Kim to'laydi** — maydon `Kim pul to'lashi mumkin? Rolini yozing, ism emas` · ikki tugma: «Hamma foydalanuvchi» · «Hozircha bilmayman».
  3. **Narx va oy** — `Narx taxmini: 30 kunga necha so'm?` · `Necha oy to'laydi? Taxmin` · tugma «Hozircha bilmayman». Jonli qator: «Keltiradigan pul: {keltiradi} so'm · taxmin».
  O'ngda: «Keyingi» → 3-kartada «Saqlash» (187); ikkinchi tugma (chegarali): «Mentor sonlari bilan mashq» → maydonlarga Mentor misoli yoziladi (A-6), har kartada yorliq «mashq».
- **Yakuniy karta «Ikki sonim»** (3/3 dan keyin; butun enga — `BirlikSahna` ikki ustuni o'quvchi sonlari bilan): «Jalb qilish narxi — {…} so'm» · «Keltiradigan pul — {…} so'm · taxmin»; muhr: «qoplanadi» / «zarar» / «teng» / «noma'lum» / «pul sarflanmagan» (KOD 8 qoidasi); ostida doimiy kulrang qator «Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan.»; har qatorda ✎.
  Muhr ostida bitta kulrang qator (holatga qarab; KOD 8 qoidasi):
  - sarflangan pul 0 (muhr «pul sarflanmagan»; tayanch 1.1 halol gapining o'quvchiga moslangani): Kanallarga pul sarflanmagan — vaqt sarflangan, u bu songa kirmaydi. (67)
  - keltiradigan pul noma'lum: Kim to'lashi yoki qancha to'lashi hali noma'lum — bu ham halol javob. (69)
  - sarflangan pul bor, to'lovchi — hamma emas yoki noma'lum (muhr «noma'lum» — hamma foydalanuvchi narxi to'lovchi puli bilan solishtirilmaydi): Bitta to'lovchini jalb qilish narxi kerak — to'lovchilar hali sanalmagan. (73)
  - qoplanadi: Keltiradigan pul — taxmin: hali hech kim to'lamagan. (52)
  - ikki son teng (muhr «teng»): Ikki son teng: jalb qilish narxi zo'rg'a qoplanadi. (51)
  - zarar: Zarar — baho emas: qaysi son o'zgarishi kerakligini ko'rsatadi. (63)
  «Saqlash» (o'ngda) → `pm-m11d1-birlik`; saqlangandan keyin tugma «Yangilash».
- Tekshiruv (`QXato`, ≤60; «Keyingi» yoki «Saqlash» bosilganda; hammasi bloklaydi — yumshoq tekshiruv yo'q):
  - sarflangan pul bo'sh (bloklaydi): Sarflangan pulni yozing: bermagan bo'lsangiz — 0. (49)
  - yangi foydalanuvchilar bo'sh, «Hozircha bilmayman» bosilmagan (bloklaydi): Shu davrda nechta kishi ro'yxatdan o'tdi — yozing. (50)
  - davr bo'sh (bloklaydi): Davrni yozing: qachondan qachongacha? (37)
  - kim to'laydi bo'sh, tugma tanlanmagan (bloklaydi): Kim to'lashi mumkin — rolini yozing yoki tugmani bosing. (56)
  - narx bor, oy bo'sh (bloklaydi): Necha oy to'lashini ham yozing — taxmin bo'lsa ham. (51)
- Yordam (bosilsa ochiladi; Mentor misoli — namuna, umumiy qolip emas):
  Mentor misolida: mahalla futbol guruhi, sinf chati va Instagram sahifasi — 0 so'm; ishga tushgandan keyingi ikki haftada 44 kishi (11 tasi — sinfdosh). Kim to'laydi: tashkilotchi (44 kishidan 6 tasi). Narx taxmini: 30 kunga 10 000 so'm, 3 oy.
  Sonni o'ylab topmang: bilmasangiz — «Hozircha bilmayman». Qaytganlar foizi oylar sonini aytmaydi. Pul to'lagan kanalingiz bo'lmasa — hammasiga 0 yozing: pullik kanalga pul to'lash shart emas. Web-trekda ham shunday.
- **Harakat → Vizual o'zgarish:** maydon yozilsa — karta ostidagi jonli qatorda son yangilanadi; «Keyingi» → karta chapga suriladi, keyingisi kiradi, tepadagi chiziqda ✓; 3/3 → karta yopiladi, yakuniy karta butun enga: ikki ustun o'sib chiqadi, muhr tushadi;
  «Saqlash» → karta bir lahza yashil, chiziq «Ikki sonim ✓». «Mentor sonlari bilan mashq» → maydonlarga navbat bilan sonlar yoziladi, yorliq «mashq».
- Xulosa (o'quvchi ma'lumotidan, P-046): «Jalb qilish narxi — {jalbNarxi} so'm, keltiradigan pul — {keltiradi} so'm (taxmin).» · biri noma'lum bo'lsa: «Jalb qilish narxi — {jalbNarxi}; keltiradigan pul hali noma'lum.» (≈80)
- Tugma (pastki): Kartalarni to'ldiring (n/3) → Saqlang → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy kartaning birinchi bo'sh maydoni (accent, to'lqin) → «Keyingi» → «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Ikki sonim · n/3» (ixcham); 8, 9-ekranlarda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon: Two Numbers! (saqlanganda — bonus, ish bajarilgan; P-048).
- Mentor rejimi: forma o'rniga Mentor misoli (ochiq; A-6). Mentor statistikasi: «Ikki sonni saqlaganlar».
- O'qituvchi eslatmasi: 12-Modulda kanallarga pul to'lash talab qilinmagan — sarflangan pul 0 bo'lishi kutiladi: bu yaxshi ham, yomon ham emas, holat. Kim to'laydi — rol bilan («ota-ona», «o'qituvchi», «tashkilotchi»), ism yozilmaydi.
  Narxni baholamang va «shuncha qo'ying» demang — bugun faqat taxmin. Ilova ishga tushmagan yoki foydalanuvchisi yo'q o'quvchi — «Mentor sonlari bilan mashq» yoki yangi foydalanuvchilarga 0 (jalb qilish narxi — «bo'lib bo'lmaydi»).
  Sinfda kim qancha yozganini so'ramang va qo'l ko'tartirmang.

## 8 · Juftlikda tekshiruv  ← QMustaqil (juftlik, 3 tugma; yakka rejim bor)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Ikki soningiz qayerdan — sherigingizga ayta olasizmi?** (53) · yakka rejimda: **Ikki soningiz qayerdanligini ayta olasizmi?** (43)
- Mentor: Avval «1 daqiqani boshlash»ni bosib gapiring — keyin qurilmangizni uzating, u har savolga belgi qo'yadi.
  Yakka rejimda: Savollarni o'zingizga bering va har biriga halol belgi qo'ying.
- Tugmalar (ixcham, tepada): 1 Ayting · 2 Belgilang · 3 Tuzating
- 1-tugma: «Ikki sonim» kartasi (7-ekrandan, ixcham) butun enga; taymer «1 daqiqani boshlash» · «To'xtatish» (1:00 dan keyin to'xtamaydi — kulrang «+m:ss»). Juftlik yo'rig'i (bir qator): Avval A aytadi, B tinglaydi; keyin almashasiz. (46)
- 2-tugma — uch savolli varaq (sherik to'ldiradi, gapiruvchining qurilmasida; bitta manba `SHERIK_SAVOL`): har qator — savol · ✓ / ✕ · izoh (placeholder: `Nima yetishmadi?`):
  1) «Yangi foydalanuvchilar soni qayerdan olingan?» 
  2) «To'lovchi mahsulotingizdan nima oladi?»
  3) «Narx va oy — kimdir aytganmi yoki taxminmi?»
  Mentor gapi 2-tugmada (almashadi): Gap tugagach, qurilmangizni sherigingizga bering — u har savolga ✓ yoki ✕ qo'yadi.
- 3-tugma — tuzatish: ✕ olgan qatorni bosish → 7-ekrandagi tegishli karta ochiladi (1-savol — Kanallar, 2 — Kim to'laydi, 3 — Narx va oy) → izohga mos joyni o'zgartirish yoki karta ostidagi qatorga «Aniqlik: …» yozish (≤ 80; masalan «narx — o'zimning taxminim, hech kim aytmagan»; dars progressida, kalitga yozilmaydi) → «Saqlash» → qatorda ✕ yonida yorliq «aniqlashtirildi» (✕ o'chmaydi: sherik qayta baholamagan — 12-Modul 9.44 d).
  Uchala qator ✓ bo'lsa — tuzatish yo'q, «Davom etish» ochiladi (yo'q kamchilik o'ylab topilmaydi).
  Mentor gapi 3-tugmada: ✕ olgan qatorni bosib, sherigingiz izohiga mos joyni aniqlashtiring.
- Tekshiruv (`QXato`, ≤60):
  - belgisiz qator (bloklaydi): Har savolga ✓ yoki ✕ qo'ying. (29)
  - ✕ qatorida izoh 8 belgidan qisqa (bloklaydi): ✕ qo'ydingiz — nima yetishmaganini bir qatorda yozing. (54)
  - izohda «yomon», «zerikarli», «yoqmadi» (yo'naltiradi): Odam haqida emas — sonda nima yetishmadi? (41)
  - kartada hech narsa o'zgarmagan va «Aniqlik» bo'sh (bloklaydi): Izohga mos joyni o'zgartiring yoki aniqlikni yozing. (52)
- Vizual: chapda — «Ikki sonim» kartasi (ixcham, ikki ustun); o'ngda — 2–3-tugmada varaq. Telefon yo'q (bo'sh ustun yo'q — SABOQ 20).
- **Harakat → Vizual o'zgarish:** taymer → chiziq to'lib boradi; varaqda ✓ — qator yashil, ✕ — `err` chet; «Saqlash» → «Ikki sonim» kartasidagi ustun qayta o'sadi (son o'zgargan bo'lsa), qatorda «aniqlashtirildi».
- Xulosa (o'quvchi ma'lumotidan): ✕ bo'lsa — «Uch savoldan {a} tasiga ✓; ✕ qatorlar aniqlashtirildi.» · hammasi ✓ — Uchala savolga javob bor: sonlaringiz qayerdan ekani aytildi. (61)
- Tugmalar: Orqaga · Davom etish (uchala qator belgilangach; ✕ bo'lsa — har biri aniqlashtirilgach)
- Saqlanadi: o'zgartirilgan maydonlar — `pm-m11d1-birlik` (`savedAt` yangilanadi). Varaqning o'zi va «Aniqlik» qatorlari kalitga yozilmaydi (TAYANCHGA SAVOL 11).
- Keyingi bosiladigan joy: «1 daqiqani boshlash» → «To'xtatish» → varaq qatorlari (✓ / ✕) → ✕ qator → «Saqlash».
- Mentor rejimi: proyektorda Mentor misolining «Ikki sonim» kartasi va uch savol; Mentor savolni o'qiydi, sinf og'zaki javob beradi (qo'l ko'tartirib sanash yo'q).
- O'qituvchi eslatmasi: ≈ 2 × 3 daqiqa + tuzatish. Sherik son haqida yozadi, odam haqida emas. Halol yozilgan taxmin — ✓: «taxmin» xato emas. 3-savolda «kimdir aytgan» bo'lsa — kim (rol), ism emas; real suhbat bu darsda yo'q.
  2-savol to'lovchi mahsulotdan foydalanishini talab qilmaydi: ota-ona farzandi uchun to'lashi ham mumkin — muhimi, u nima olishini aytib bera olish.

## 9 · Kod yozish: ikki son  ← QKod (kod oynasi — `HtmlCompiler`, JS; tayanch 1.1, 4; ≈15 daqiqa)
- Eyebrow: Kod yozish · ikki son
- Sarlavha: **Ikki sonni hisoblab solishtiradigan kod yozamiz.** (48) — PM-082 (a) sarlavha oilasi (korpus §19)
- Mentor: Funksiyalar avval Mentor sonlari bilan tekshiriladi, keyin sizning sonlaringizni hisoblaydi — bo'sh joylarni to'ldiring.
- Darvoza-mashq (ballsiz, kod oldidan; PM-082 c/e): kod bo'lagi `const kanal = { sarf: 60000, yangi: 12, tashkilotchi: 1 };` ostida savol **Qaysi qator bitta tashkilotchining jalb qilish narxini beradi?** ·
  ✔ `jalbNarxi(kanal.sarf, kanal.tashkilotchi)` · `jalbNarxi(kanal.sarf, kanal.yangi)` · `jalbNarxi(kanal.yangi, kanal.sarf)`
  - xato «yangi»: Bu — bitta foydalanuvchi narxi: hammasi ham to'lamaydi. (55)
  - xato teskari: Pul birinchi, kishilar soni ikkinchi turadi. (44)
  Tanlov yonida kichik natija qatori: `60000` · `5000` · `0.0002` — tanlangan qator natijasi yonadi.
- Chap (vazifa, 3 band; bosiladigan katakcha emas — vazifa ro'yxati):
  1 `jalbNarxi` pulni yangi kelganlar soniga bo'ladi.
  2 Yangi kelganlar 0 bo'lsa — `null` qaytaradi.
  3 `keltiradi` narxni oylar soniga ko'paytiradi.
- Yordam: Bo'lish belgisi — `/`, ko'paytirish — `*`. Yangi kelganlar 0 bo'lsa, bo'lishdan oldin `if` bilan `null` qaytaring.
  `meniki` — sizning sonlaringiz: «Ikki sonim» saqlangan bo'lsa, o'zi qo'yilgan; bo'lmasa — o'zingiz yozing yoki shunday qoldiring. O'z sonlaringizni yozsangiz, `yorliq` ni «Mahsulotim» qiling. Natija qismiga tegmang — u tayyor.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi — 12-Modul 12-dars) → kod oynasi (`HtmlCompiler`, `app.js` · `index.html`). Mentor gapi tugma oldida: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijani shu yerda ko'rasiz.
  Kod nusxalanmaydi (PM-082 d).
- Kod — `app.js` (`meniki` qatori — o'quvchining saqlangan sonlari bo'lsa ularniki, KOD 10; quyida — kalit yo'q holat: Mentorning bepul kanallardagi sonlari, yorliq «Mashq»):
```js
// Mentor misoli: pullik kanal — mashq, Mentorning taxmini
const kanal = { sarf: 60000, yangi: 12, tashkilotchi: 1 };
const pro = { narx: 10000, oy: 3 };

// Mentor sonlari — o'zingiznikiga almashtiring
const meniki = {
  yorliq: "Mashq", sarf: 0, yangi: 44, narx: 10000, oy: 3
};

function jalbNarxi(sarf, yangi) {
  // yangi 0 bo'lsa — null; aks holda pulni yangilarga bo'ling
  return 0; // shu joyni siz yozasiz
}

function keltiradi(narx, oy) {
  // narxni oylar soniga ko'paytiring
  return 0; // shu joyni siz yozasiz
}

// natija — bu qism tayyor
function som(n) {
  if (n === null) return "bo'lib bo'lmaydi";
  return Math.round(n) + " so'm";
}
function xulosa(jalb, pul) {
  if (jalb === null || pul === null) return "noma'lum";
  if (jalb < pul) return "qoplanadi";
  if (jalb > pul) return "zarar";
  return "teng";
}
const joy = document.getElementById("natija");
function qator(matn) {
  const li = document.createElement("li");
  li.textContent = matn;
  joy.appendChild(li);
}
const birFoyd = jalbNarxi(kanal.sarf, kanal.yangi);
const birTash = jalbNarxi(kanal.sarf, kanal.tashkilotchi);
const proPuli = keltiradi(pro.narx, pro.oy);
qator("Mentor · bitta foydalanuvchi: " + som(birFoyd));
qator("Mentor · bitta tashkilotchi: " + som(birTash));
qator("Mentor · tashkilotchi keltiradi: " + som(proPuli));
qator("Mentor · pullik kanal: " + xulosa(birTash, proPuli));

const menJalb = jalbNarxi(meniki.sarf, meniki.yangi);
const menPul = meniki.narx === null || meniki.oy === null
  ? null : keltiradi(meniki.narx, meniki.oy);
const pulMatn = menPul === null ? "noma'lum" : som(menPul);
qator(meniki.yorliq + " · bitta foydalanuvchi: " + som(menJalb));
qator(meniki.yorliq + " · keltiradi, taxmin: " + pulMatn);
```
- `index.html` (tayyor, o'zgartirilmaydi): `<h3>Bitta foydalanuvchi: ikki son</h3>` · `<ul id="natija"></ul>` · `<script src="app.js"></script>`. Qatorlar ko'rinishi — dars CSS i (`previewCss`).
- Kod oynasi sarlavhasi: `app.js — jalbNarxi va keltiradi funksiyalarini yozing` · placeholder: `// bo'sh joylar: bo'lish, null, ko'paytirish`
- Shartlar (o'z namunasi bilan funksiya chaqiriladi — SABOQ 37, `kanal` va `meniki` ga bog'lanmaydi; xabarlar ≤60):
  1 — 60 000 ni 12 ga bo'lganda 5 000 chiqsin. (40) (`jalbNarxi(60000, 12)` → `5000`)
  2 — Yangi kelganlar 0 bo'lsa, null qaytsin. (39) (`jalbNarxi(5000, 0)` → `null`)
  3 — 10 000 ni 3 oyga ko'paytirganda 30 000 chiqsin. (47) (`keltiradi(10000, 3)` → `30000`)
- **Harakat → Vizual o'zgarish:** darvozada tanlov → yonidagi natija qatori yonadi (`60000` · `5000` · `0.0002`); kod ishga tushganda natija oynasida qatorlar yoziladi, shartlar birma-bir ✓;
  «Bajardim» → natijadagi Mentor qatori «pullik kanal: zarar» va «Mahsulotim» (kalit yo'q yoki `tur: 'mashq'` — «Mashq») qatorlari sahnaning ikki ustuniga uchib tushadi (P-046 — o'quvchining sonlari).
- Tugmalar: **Bajardim — ikki son hisoblandi** (qulf: darvoza yechilmagan bo'lsa — «Avval qator savolini yeching»; shartlar ✓ bo'lmasa — «Avval uchala shartni bajaring») ·
  ikkinchi (chegarali): **Kodni uyda tugataman** → nishon yo'q, «Davom etish» ochiladi, uyga vazifa ③ ga «kodni tugating» qo'shiladi (P-026: dars bitta qadamga osilib qolmaydi).
- Hammasi bajarilgach (yashil): Kod Mentor sonlarini ham, sizning sonlaringizni ham hisobladi. (62)
- Nishon: Two Functions! (darvoza birinchi urinishda + «Bajardim»).
- Mentor rejimi: proyektorda kod oynasi — Mentor `jalbNarxi` ni sinf bilan birga yozadi (qo'lda, nusxasiz).
- O'qituvchi eslatmasi: Ko'p uchraydigan xato — `yangi` 0 ni tekshirmaslik: natijada `Infinity` chiqadi va 2-shart ✕ qoladi. Kod — haqiqiy Backend emas: sonlar qo'lda yozilgan (Mentor misoli — mashq).
  «Mahsulotim» qatorida keltiradigan pul — taxmin; narx yoki oy yozilmagan bo'lsa — «noma'lum» chiqadi («bo'lib bo'lmaydi» — faqat yangi foydalanuvchi 0 bo'lganda). Kalit yo'q bo'lsa qatorlar «Mashq» yorlig'i bilan — Mentor sonlari o'quvchiniki deb ko'rsatilmaydi. Kod o'quvchi uchun xulosa chiqarmaydi: uning xulosasi «Ikki sonim» kartasida (to'lovchilar soni hisobga olinadi — KOD 8).

## 10 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; o'quvchining o'z ishi; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Narx va oy taxminingiz bor, hech kim to'lamagan. Keltiradigan pulni qanday yozasiz?** (12 so'z) · savol ustida yorliq yo'q
  - ✔ A — Hisoblab, yoniga taxmin ekanini yozasiz (39)
  - B — Yozmaysiz, chunki hozircha to'lov yo'q (38)
  - C — Narxni kattaroq yozasiz, ishonarli bo'lsin (42)
  - D — Oylar o'rniga qaytganlar foizini qo'yasiz (41)
- Kalit: **A** (index 0). To'rttalasi bir shaklda («… -siz»); «yoz-» A, B, C da — kalit so'z faqat to'g'rida emas; qo'shtirnoq va tire hech birida yo'q.
- To'g'ri izohi: Taxmin ham yoziladi — yonida yorlig'i bilan. (44)
- Xato izohlari:
  - B: Son bo'lmasa, solishtirib bo'lmaydi — qanday yozasiz? (53)
  - C: Kattaroq narx sonni o'zgartiradi, dalil qo'shmaydi. (51)
  - D: Qaytganlar foizi ilovani ochishni sanaydi — oylarni emas. (57)
  - (umumiy) Taxmin bo'lgan son qanday yozilishini eslang. (45)
- Javob topilgach (kichik, savol ostida): o'quvchining «Ikki sonim» kartasi — «Keltiradigan pul» ustunidagi «taxmin» yorlig'i yonadi (karta yo'q bo'lsa — Mentor misoli: «30 000 so'm · taxmin»).
- Izoh (MD): turkumlar har xil (sinf 8): B — tashlab ketish (taxminni yozmaslik; darsning qoidasi — yorliq bilan yoziladi) · C — halollikni buzish · D — boshqa o'lchov (4-ekran halol gapi). B haqiqiy hayotda «ehtiyotkor» ko'rinadi, lekin savolda taxmin borligi aytilgan — dars qoidasi bilan u yorliq bilan yoziladi (F-1007-459). Taxmin umuman yo'q holat — 7-ekrandagi «Hozircha bilmayman», ziddiyat yo'q.
  Kalit ibora 3, 6-ekranlar bilan takrorlanmaydi.

## 11 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 6, 10); 7–9-ekranlar «Saqlash»/«Bajardim» — mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Bitta yangi foydalanuvchi narxi» · 6 — «2 — Qaysi ikki son» · 10 — «Yakuniy — Taxmin yorlig'i»

## 12 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi ingichka accent chegara bilan, to'lqin 3 marta (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 13 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — sinf 6, E 54; belgi ✓ va nishon faqat birinchi holatda; o'quvchi qilgan ishni aytadi):
  - «Ikki sonim» saqlangan, `tur: 'real'`, ikkala son bor: **Ikki soningiz yozildi — keltiradigan pul taxmin bilan.** (54)
  - saqlangan, `tur: 'real'`, bir yoki ikki son noma'lum: **Sonlaringiz yozildi — ba'zisi hali noma'lum.** (44)
  - saqlangan, `tur: 'mashq'`: **Mentor sonlari bilan mashq qildingiz.** (37)
  - saqlanmagan: **Ikki son hali yozilmagan — uyda yozing.** (39)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yakunda YO'Q (SABOQ E 50; fikr dars ichida qoladi — A-2).
- Endi siz bilasiz (asosiy fikr so'zma-so'z takrorlanmaydi, T-048):
  - Jalb qilish narxi — bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lganda chiqadigan son.
  - Foydalanuvchi keltiradigan pul — bitta foydalanuvchidan butun foydalanish davomida keladigan pul.
  - Ikki son bitta to'lovchi uchun solishtiriladi; mahsulotni ushlab turish puli bu hisobga kirmaydi.
  - Bepul kanalda pul sarflanmaydi, lekin vaqt sarflanadi.
  - Hali tekshirilmagan son yoniga «taxmin» deb yoziladi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ota-ona yoki sinfdosh · Nechta: 2 son · Muddat: keyingi darsgacha
  - ① Ikki soningizni bir kishiga tushuntiring: qaysi biri sanalgan, qaysi biri taxmin.
  - ② Keltiradigan pulingizga qarab yozing: pullik kanal o'z pulini qoplashi uchun bitta to'lovchini jalb qilish narxi necha so'mdan oshmasligi kerak?
  - ③ Darsda qolgan qismni tugating: {holatga qarab — ikki sonni yozing · kodni tugating}. Hammasi tugagan bo'lsa ③ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Hech qayerga pul to'lamang: pullik kanal — faqat mashq. (55)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Mahsulotingiz qanday pul topadi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: chip va ball · sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): ① — real odam bilan, lekin suhbat emas: o'quvchi o'z sonini tushuntiradi, narx so'ramaydi va pul haqida kelishmaydi (pul suhbati — 6-dars ishi, bu yerda va'da qilinmaydi). ② — asosiy fikrning shaxsiy qo'llanishi (javob — o'z keltiradigan puli; TAYANCHGA SAVOL 16).
  «Kim bilan» — HwCard yorlig'i (12-Modul darslari bilan bir). Muddat «keyingi darsgacha» — keyingi dars nomi faqat «Keyingi dars» qatorida (T-038).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Cost Check!** (3-ekran, 1-savol birinchi urinishda) — Bitta yangi foydalanuvchining jalb qilish narxini birinchi urinishda topdingiz
- **Right Pair!** (6-ekran, 2-savol birinchi urinishda) — Solishtiriladigan ikki sonni birinchi urinishda tanladingiz
- **Two Numbers!** (7-ekran, «Ikki sonim» saqlanganda — bonus) — Mahsulotingiz uchun ikki sonni yozib saqladingiz
- **Two Functions!** (9-ekran, darvoza birinchi urinishda va «Bajardim») — Ikki sonni hisoblaydigan funksiyalarni yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Two Numbers, S-034: ish qilingan ekranda). Yakuniy savol nishonsiz. 2, 4, 5-ekranlar (ballsiz tushuncha) va 8-ekran nishonsiz.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Jalb qilish narxi** — 1 Bir davrda kanallarga sarflangan pul olinadi. · 2 U shu davrda kelgan yangi foydalanuvchilarga bo'linadi — oldin kelganlar kirmaydi. · 3 Sinfdoshlar ham sanaladi, lekin alohida aytiladi.
  — Sinfga savol: Sizning kanallaringizga shu oy qancha pul ketdi?
- **6 · Ikki son** — 1 Pul to'laydigan foydalanuvchi — to'lovchi. · 2 Ikki son bitta to'lovchi uchun solishtiriladi. · 3 Keltiradigan pul — narx, necha oy to'lashiga ko'paytirilgan.
  — Sinfga savol: Mahsulotingizda kim to'lovchi bo'lishi mumkin?
- **10 · Taxmin** — 1 Hali hech kim to'lamagan narx — taxmin. · 2 Taxmin ham yoziladi — yonida yorlig'i bilan. · 3 Qaytganlar foizi ilovani yana ochishni sanaydi, pullik obunani emas.
  — Sinfga savol: Ikki soningizdan qaysi biri taxmin?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — «O'lchov» (skript).
1. Jalb qilish narxi uchun qaysi pul olinadi? (2)
   - ✔ A — Kanallarga sarflangan pul (25)
   - B — Pro uchun to'lanadigan pul (26)
   - C — O'yinchi to'laydigan pul (24)
   - D — Post yozishga ketgan vaqt (25)
2. Mentor misolida bepul kanallar nimaga tushdi? (0, 2)
   - A — Har bir kishiga 5 000 so'mga (28)
   - ✔ B — Pulga emas — sarflangan vaqtga (30)
   - C — Pro narxiga — 10 000 so'mga (27)
   - D — Hech nimaga — vaqt ham ketmagan (31)
3. Mentor misolida ilovaga kim pul to'lashi mumkin? (4)
   - A — Hamma foydalanuvchi har oy (26)
   - B — Sinfdoshlar, boshqalar emas (27)
   - ✔ C — Pro oladigan tashkilotchi (25)
   - D — Maydon egasi har o'yinda (24)
4. Mentor misolida Pro nima? (4)
   - A — Bir martalik kirish puli (24)
   - B — Har o'yin uchun to'lov (22)
   - C — Yangi ilova versiyasi (21)
   - ✔ D — 30 kunlik pullik obuna (22)
5. Mentorning taxminicha, bitta Pro tashkilotchi qancha keltiradi? (4)
   - ✔ A — 30 000 so'm (11)
   - B — 10 000 so'm (11)
   - C — 60 000 so'm (11)
   - D — 20 000 so'm (11)
6. Bu darsdagi jalbNarxi yangi foydalanuvchi 0 bo'lsa nima qaytaradi? (9)
   - A — 0 — chunki pul ham nol (22)
   - ✔ B — null — bo'lib bo'lmaydi (23)
   - C — Sarflangan pulning o'zini (25)
   - D — Infinity — cheksiz son (22)
7. Qaytganlar foizi nimani sanaydi? (4)
   - A — Pullik obunani uzaytirganlarni (30)
   - B — Pro olgan tashkilotchilar sonini (32)
   - ✔ C — Ilovani yana ochgan qurilmalarni (32)
   - D — Kanaldan kelgan yangi kishilarni (32)
8. To'lovchini jalb qilish 25 000 so'm, u 20 000 keltiradi. Xulosa? (5)
   - A — Qoplanadi — chunki pul keladi (29)
   - B — Teng — ikkalasi ham so'mda (26)
   - C — Noma'lum — sonlar juda katta (28)
   - ✔ D — Zarar — jalb qilish qimmat (26)
9. Mentor misolida bepul kanallar nega chegarali? (2)
   - ✔ A — Ulardagi a'zolar soni cheklangan (32)
   - B — Ularga keyin pul to'lash kerak (30)
   - C — Ularda post yozish taqiqlangan (30)
   - D — Ular bir haftadan keyin yopiladi (32)
10. Jalb qilish narxida «yangi foydalanuvchi» kim? (2, 3)
    - A — Ilovani bir marta ochgan qurilma (32)
    - ✔ B — Shu davrda ro'yxatdan o'tgan kishi (34)
    - C — Pro uchun pul to'lagan tashkilotchi (35)
    - D — Postni o'qib chiqqan har bir kishi (34)
11. Pullik kanalni baholashda kimni jalb qilish narxi olinadi? (5)
    - A — Kanaldan kelgan har bir kishini (31)
    - B — Ilovadagi hamma foydalanuvchini (31)
    - ✔ C — Pul to'laydigan foydalanuvchini (31)
    - D — Eng ko'p o'ynaydigan o'yinchini (31)
12. Keltiradigan pulni qanday hisoblaymiz? (4)
    - A — Narxni kishilar soniga ko'paytiramiz (36)
    - B — Narxga kanal pulini ham qo'shamiz (33)
    - C — Oylarni kishilar soniga bo'lamiz (32)
    - ✔ D — Narxni oylar soniga ko'paytiramiz (33)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006) — «O'lchov»; kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (yangi foydalanuvchilar, eski va sinfdosh) ↔ arena 1 (qaysi pul), 10 (sinfdosh qoidasi) · 6-ekran (qaysi ikki son) ↔ arena 8 (sonlar berilgan — xulosa), 11 (kimni jalb qilish) · 10-ekran (taxmin yorlig'i) ↔ arena 7 (qaytganlar foizi nimani sanaydi).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas: 1 — boshqa pul (Pro, o'yinchi) yoki pul emas (vaqt) · 3 — 1.0 dagi Mentor rejasiga zid (maydon egasi — 2-darsda solishtiriladigan boshqa yo'l; bu yerda «Mentor misolida» bilan himoyalangan) · 5 — bir oylik narx (10 000), ikki oy (20 000), «agar» kanal puli (60 000); 15 000 va 90 000 ishlatilmadi (4-dars sonlari ochilmaydi) ·
  6 — `Infinity` — tekshiruvsiz JS natijasi (9-ekran O'qituvchi eslatmasi), savol «bu darsdagi» funksiya haqida · 8 — mashq sonlari (25 000 va 20 000; Mentor sonlari emas) · 9 — B (pul), C (ruxsat), D (muddat) — bepul kanallar haqida rost emas, uchalasi har xil turkum · 10 — boshqa o'lchov (qurilma), to'lovchi, post o'quvchisi — ta'rifdagi «yangi foydalanuvchi» emas.
- **Fon so'zlari** (R-008, kodda {uz, ru}; ru — 6-RU bosqichida): arena — jalb qilish narxi · keltiradigan pul · kanal · to'lovchi · taxmin · Pro · zarar · qoplanadi · Maydon Jamoa · uyga vazifa banneri — kanal · taxmin · to'lovchi. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

## Kartochkalar (12) — 12-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Jalb qilish narxi nima? | Bir davrda kanallarga sarflangan pulni shu davrda kelgan yangi foydalanuvchilarga bo'lganda chiqadigan son | Inglizchasi: CAC |
| Foydalanuvchi keltiradigan pul nima? | Bitta foydalanuvchidan butun foydalanish davomida keladigan pul | Inglizchasi: LTV. Hisoblash: narxni necha oy to'lashiga ko'paytiramiz |
| Mentor misolida kanallarga qancha pul sarflangan? | 0 so'm | Pul emas — vaqt sarflangan: postlar va javoblar |
| Mentor misolida bepul kanallar nega yetmay qolishi mumkin? | Guruh va sinf chatidagi a'zolar soni cheklangan | Bu — shu misol haqida, har bepul kanal haqida emas |
| Mentor misolida ilovaga kim pul to'lashi mumkin? | Pro oladigan tashkilotchi; o'yinchilar uchun ilova bepul | 44 kishidan 6 tasi — tashkilotchi |
| Pro nima? | Mentor misolida tashkilotchi uchun 30 kunlik pullik obuna | Unda «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi |
| Bitta Pro tashkilotchi qancha pul keltiradi? | Mentorning taxmini: 30 000 so'm | 30 kunga 10 000 so'm, o'rtacha 3 oy |
| To'lovchi kim? | Pul to'laydigan foydalanuvchi | Ikki son uning uchun solishtiriladi |
| «Agar» mashqida pullik kanal nega zarar? | Bitta tashkilotchini jalb qilish 60 000 so'm — u keltiradigan 30 000 dan ko'p | Mashq sonlari — Mentorning taxmini |
| Qaytganlar foizi pullik obunani davom ettirish bilan bir xilmi? | Yo'q: u ilovani yana ochgan qurilmalarni sanaydi | Mentor misolida 43% |
| Yangi foydalanuvchi 0 bo'lsa, jalb qilish narxi qancha? | Hisoblab bo'lmaydi: nolga bo'linmaydi | Bu darsdagi kodda — `null` |
| «Zarar» chiqsa — bu yomon bahomi? | Yo'q: qaysi son o'zgarishi kerakligini ko'rsatadi | Masalan: kanal narxi yoki nechta to'lovchi kelishi |
- §145: har javobdagi so'z darsda bor (jalb qilish narxi — 2 · keltiradigan pul — 4 · 0 so'm, chegarali — 2 · tashkilotchi, Pro, pullik obuna, «Doimiy o'yin» — 4 · to'lovchi — 5 · «agar», 60 000 — 2, 5 · 43% — 4 · `null` — 9 · zarar — 5, 7).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). CAC va LTV — faqat shu ikki izohda (TAQIQLAR 5).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmUnitEconomicsLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d1-v1` (12-Modul PM darslari naqshi `pm-mNdK-v1`), `lessonTitle` — «Bitta foydalanuvchi sizga qanchaga tushadi?».
2. `SCREEN_META` 14: hook · plan · concept · test · concept · concept · test · practice · practice · koding · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 6: 3, 10: 0 }; `jalb: -1`, `keltir: -1`, `solishtir: -1` (2, 4, 5-ekran — ballsiz bashorat);
   7, 8 `practice: -1`, 9 `koding: -1` — signal `PRACTICE_BASE + ekran`. `narrow` — 3, 6, 10, 11-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat`, taxmin natijasi — yashil xulosa qutisining birinchi kichik qatori, qolipning `natija` propi ishlatilmaydi — E 42) · s3/s6/s10 `QTest` (`QuestionScreen` mantig'i, DE-203) · s7/s8 `QMustaqil` · s9 `QKod` · s11 `QNatija` · `sflash` `QKartochka` · s13 `QYakun`.
3. **`BirlikSahna`** — bitta vizual (180; qolipda yo'q, yangi): qismlar `kanallar` (kanal kartalari: nom + so'm yorlig'i; `agar` kartasi «Mentorning taxmini · mashq») · `odamlar` (odam belgilari to'ri 11 × 4, `sinfdosh`, `tashkilotchi` belgilari, `xira`) ·
   `telefon` («Maydon Jamoa» — «O'yinlar», rejimlar `oyinchi` · `tashkilotchi`; nom o'z rangida — 11-Modul 9.62) · `ustunlar` (jalb · keltiradi; so'm shkalasi; muhr `qoplanadi` · `zarar` · `teng` · `nomalum` · `sarfsiz`; doimiy chegara qatori va halol qator) · ko'rinishlar `kichik` · `toliq`.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: bs-kanal bs-tugma bs-ustun`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da ustunlar sahna ostida; odam belgilari kesilmaydi (E 41 — DOM detektori).
4. **Ma'lumot — bitta manba (A-6 aynan):** `MENTOR_KANALLAR` = 3 × `{ nom, sarf: 0 }` (mahalla futbol guruhi · sinf chati · Instagram sahifasi) · `MENTOR_SONLAR` = `{ yangi: 44, sinfdosh: 11, davr: 'ishga tushgandan keyingi ikki hafta', tashkilotchi: 6, narx: 10000, oy: 3, keltiradi: 30000, qaytgan: 43 }` ·
   `AGAR` = `{ sarf: 60000, yangi: 12, tolovchi: 1 }` (yorliq «Mentorning taxmini · mashq»). Mentor rejimi, s0 (zaxira), s2, s4, s5, s7 «Mentor sonlari bilan mashq» va s9 boshlang'ich kodi shundan o'qiydi.
5. **s2** — `QBashorat` (3 variant) → kanal kartalari (3 × bosish; har biri `0 so'm` → ustun kartasiga uchadi) → odam belgilari (44, `sinfdosh` 11) → natija 0 → `QIzoh` → «Agar pullik kanal bo'lsa?» (4-karta, 12 belgi, natija 5 000, `QIzoh`) → `tugadi`; 40 s ipucha; Mentor gapi 2-qadamda almashadi.
6. **s4** — `QBashorat` (to'g'risi «ozchiligi») → 3 tugma: `oyinchi` (telefon rejimi, qator 0 so'm) · `tashkilotchi` (telefon rejimi, Pro kartasi «Mentorning rejasi», qator 10 000 · taxmin, odam chizig'i 6/44) · `uchOy` (oy kataklari, 10 000 → 30 000, `QIzoh` 43%).
7. **s5** — `QBashorat` (to'g'risi «60 000 so'm») → 2 tugma: `birFoyd` (12 ga bo'lish, ustun 5 000, kulrang qator) · `birTash` (bitta belgiga yig'ish, ustun 60 000, muhr `zarar`, `QIzoh` «to'lovchi»); natija blokining oxirgi kichik qatori — «Zarar — baho emas…».
8. **s7** — o'qiydi `pm-m10d6-kanallar.kanallar` (`ruxsat === 'bor'`), `pm-m10d10-hisobot.royxat` (`soni`, `sinfdosh`, `sana`), `tekshiruv`, `tuzatishQator` (`'royxat'` bo'lsa — son qo'yilmaydi); 3 karta ketma-ket (E 53), yorliq input ichida (E 43);
   **hisoblash qoidasi** (bitta funksiya, `node` da kamida 10 namuna bilan sinaladi — PM-108):
   - `jalbNarxi` = Σ`sarf` ÷ Σ`yangi`, butun songa yaxlitlanadi; Σ`yangi` = 0 yoki noma'lum («Hozircha bilmayman» — `yangi: null`) → `null`. Har kanal `yangi` si noma'lum bo'lsa — kanallar **bitta qatorga** birlashadi: `{ nom: 'mahalla guruhi, sinf chati', sarf: Σ, yangi: jami }` (TAYANCHGA SAVOL 3).
   - `keltiradi` = `narxTaxmin` × `oyTaxmin`; biri `null` → `null`.
   - `xulosa` (shu tartibda; F-1007-459): ① `jalbNarxi` `null` → `'nomalum'` · ② Σ`sarf` = 0 → `'sarfsiz'` (muhr «pul sarflanmagan», halol qator «Kanallarga pul sarflanmagan…») · ③ `keltiradi` `null` → `'nomalum'` ·
     ④ `kimTolaydi !== 'hamma foydalanuvchi'` (rol matni yoki `null`) → `'nomalum'` («to'lovchilar hali sanalmagan» qatori) — **o'zgarmas shart:** hamma foydalanuvchi narxi to'lovchi puli bilan hech qachon solishtirilmaydi ·
     ⑤ `jalbNarxi` < `keltiradi` → `'qoplanadi'`, > → `'zarar'`, teng → `'teng'` (TAYANCHGA SAVOL 4). Muhr ostida doimiy qator har holatda. `node` namunalarida ①–⑤ har biri kamida bitta.
   - `kimTolaydi`: rol matni · `'hamma foydalanuvchi'` · `null` («Hozircha bilmayman»); `tur`: `'real'` yoki «Mentor sonlari bilan mashq» → `'mashq'` (TAYANCHGA SAVOL 5, 12).
   - yozadi `localStorage` `pm-m11d1-birlik` = `{ tur, davr, kanallar: [{ nom, sarf, yangi }], jalbNarxi, kimTolaydi, narxTaxmin, oyTaxmin, keltiradi, xulosa, savedAt }` — tayanch 8 aynan, yangi maydon yo'q; `sarf` so'mda (0 bo'lishi mumkin); `nom` — kanal turi.
   Tekshiruvlar (hammasi bloklaydi — 7-ekran ro'yxati); yakuniy karta va muhr; «Yangilash»; nishon `twoNumbers`; artefakt-strip «Ikki sonim».
9. **s8** — `SHERIK_SAVOL` 3 × `{ savol, karta }` (bitta manba; ✕ qatori shu kartani ochadi); taymer 1:00; varaq holati dars progressida (`belgi`, `izoh`, `aniqlik`, `aniqlashtirildi`), kalitga yozilmaydi; yakka rejim — Mentor gapi va sarlavha almashadi; tekshiruvlar; o'zgartirilgan maydonlar `pm-m11d1-birlik` ga (`savedAt`).
10. **s9** — `HtmlCompiler` (`task`, `starterCode`, `storageKey="pm-m11d1-code"`); fayllar `app.js` (JS) · `index.html` (tayyor); `requirements` — `C.evalEquals('jalbNarxi(60000, 12)', 5000, …)` · `C.evalEquals('jalbNarxi(5000, 0)', 'null', …)` · `C.evalEquals('keltiradi(10000, 3)', 30000, …)`
    (`HtmlCompiler.jsx` 618, 1100: natija `String` bilan solishtiriladi — `null` → «null»; ⛔ haqiqiy oynada sinaladi). Boshlang'ich kod oddiy satrlardan yig'iladi (backtick yo'q), qatorlar ≤ 70 belgi (SABOQ 37);
    `meniki` obyekti `pm-m11d1-birlik` dan: `yorliq` — `tur: 'real'` bo'lsa «Mahsulotim», `tur: 'mashq'` bo'lsa «Mashq»; `sarf` = Σ, `yangi` = Σ (noma'lum — 0, natija «bo'lib bo'lmaydi»), `narx` = `narxTaxmin` (yo'q — `null`), `oy` = `oyTaxmin` (yo'q — `null`; natija «noma'lum»); izoh qatori «// Sizning sonlaringiz («Ikki sonim» kartasidan)».
    Kalit yo'q — Mentorning bepul kanallari (`"Mashq", 0, 44, 10000, 3`) va izoh qatori «// Mentor sonlari — o'zingiznikiga almashtiring» (≤ 70 belgi). Mentor sonlari hech qachon «Mahsulotim» yorlig'i bilan chiqmaydi (F-1007-459).
    Darvoza-mashq (3 variant, ballsiz, xato izohlari) — `QKod` chap ustunida (9-Modul 1-dars `QKOD_ONG` yechimi — SABOQ C); «Bajardim» qulfi (darvoza + 3 shart); «Kodni uyda tugataman» — `kodQoldi` bayrog'i (yakun ③); nishon `twoFunctions`. Kod nusxalanmaydi (PM-082 d).
11. Testlar s3/s6/s10 — `correctIdx` 1/3/0 = `INLINE_KEYS`; s3 material kartasi — `QuestionScreen` ustida (kichik, chizilgan); `RECAPS` {3, 6, 10} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 6, 10}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
12. `ACHIEVEMENTS` 4 (`costCheck`, `rightPair`, `twoNumbers`, `twoFunctions`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
13. s13 `QYakun`: sarlavha **to'rt holat** — `pm-m11d1-birlik` dan (`tur`, `jalbNarxi`, `keltiradi`; P-046); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — yakunda yo'q (E 50); `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③; ③ holatdan yig'iladi); `keyingi` — «Mahsulotingiz qanday pul topadi?».
    Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m11-01` qatoriga `comp: PmUnitEconomicsLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 445-qator). Bu agent App.jsx ga tegmaydi.
- Darvozalar: `npm run gates -- src/11-Modull/PmUnitEconomicsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · E 41 kesilish detektori.
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

## REPO
- **Yo'q.** PM darsi — repo'ga yozilmaydi: `m13-dars-01-done` = `m13-dars-01-start` = `m12-dars-10-done` (tayanch 3 jadvali). «Ortda qoldingizmi» bu darsda yo'q (blok yo'q). Kod oynasi — brauzerda, repo'ga tegmaydi.

## Manbalar (o'zim tekshirgan sahifalar va qatorlar, 07.10.2026)
- **Tashqi rasmiy sahifa ochilmadi** — bu darsda tashqi xizmat qadami yo'q: to'lov, Click, Payme, Stripe, Render, Telegram tilga olinmaydi; pullik kanal narxi — faqat «agar» mashqi (tayanch 1.1: «Reklama narxi haqida fakt aytilmaydi (manba yo'q)»).
- Mentor sonlari va ta'riflar — `00-MODUL-TAYANCH.md` 1.0, 1.1, 1.13 (aynan); atamalar — 2-bo'lim; kalit — 8-bo'lim; qarorlar — `GATE_M_JAVOB.md` Qaror-0 1, 6, 17, 22, 23.
- Mentorning uch kanali — 12-Modul tayanchi 1.6 («mahalla futbol guruhi … · sinf chati · o'z Instagram sahifasi»); davr — 12-Modul tayanchi 1.12, 1.13 («ishga tushirish kuni 20 · bir hafta o'tib 38 · ikki hafta o'tib 44»); 11 sinfdosh — 1.13; 43% — 1.12 («61 qurilmadan 26 tasi»).
- `pm-m10d6-kanallar`, `pm-m10d10-hisobot` shakli — 12-Modul tayanchi 8 va `06-PmChannels-v3.md` 318-qator (`nom` — tur yozuvi), `10-PmUsersCheck-v3.md` 393, 446-qatorlar (`royxat`, `tuzatishQator`); 9.43 i — «tuzatish» olgan son keyingi darsga dalil qilib qo'yilmaydi.
- Kod oynasi tekshiruvi — `src/compilator/HtmlCompiler.jsx` 618 (`evalEquals` → `expected: String(expected)`) va 1100–1102 (`r = eval(p.expr)`, `_str(r) === _str(p.expected)`): `null` natija «null» satri bilan solishtiriladi; namuna — `src/10-Modull/PmChannelsLesson.jsx` 1686–1730 (`KOD_TASK`, `requirements`).
- App.jsx 438–446 (grep 07.10.2026): `m10-13` «Zaxira dars» → `m11-01` (osti so'zma-so'z) → `m11-02` «Mahsulotingiz qanday pul topadi?».

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **«Pullik kanal» ta'rifi o'quvchi matnida** — «pul to'lab post chiqariladigan kanal» (2-ekran kulrang qatori). Tayanch 1.1 so'zni ishlatadi, ta'rifi yo'q. «Reklama» so'zi bu darsda yo'q — 2-darsda model nomi (T-015, modul bo'yi bir ma'no).
2. **«To'lovchi» atamasi** — «pul to'laydigan foydalanuvchi» (5-ekran `QIzoh`, 6-ekran izohi, kartochka, recap). So'z tayanch 8 da bor (`soni` — «to'lovchi bo'lishi mumkin bo'lganlar»), 2-bo'lim jadvalida yo'q — qo'shishni taklif qilaman (2-dars bilan bir so'z).
3. **Kanal bo'yicha yangi foydalanuvchilar** (F-1007-459: «44 kishi shu kanallardan keldi» deyilmaydi — sodda hisob, odam belgilari umumiy maydonga kiradi) — 12-Modul ularni o'lchamagan (Database kanalni saqlamaydi, Umami kanal bo'yicha tashrifni sanaydi, ro'yxatni emas). Qarorim: `kanallar` — o'quvchi bilsa kanal bo'yicha, bilmasa **bitta birlashgan qator** (`nom` — kanal nomlari vergul bilan, `yangi` — jami); Mentor misoli — bitta qator `{ nom: 'mahalla futbol guruhi, sinf chati, Instagram sahifasi', sarf: 0, yangi: 44 }`. Sxema o'zgarmaydi.
4. ✅ **Yopildi — F-1007-459 (ChatGPT auditi):** `'teng'` qo'shildi, `'oqlaydi'` → `'qoplanadi'`, Σ`sarf` = 0 → `'sarfsiz'` (tayanch 8, 9.19). Avvalgi qaror: **`xulosa` uch qiymatda qoladi** — tenglik va «sarflangan pul bor, to'lovchi — hamma emas» holati `'nomalum'` bo'ladi (taxmin sonlar teng bo'lsa, oqlaydimi-yo'qmi aytib bo'lmaydi; to'lovchilar soni 1-darsda sanalmaydi — u 2-darsning `soni` si). Kerak bo'lsa — `'teng'` qiymatini qo'shish (2, 4-darslar o'qiydi).
5. **`kimTolaydi` qiymatlari** — rol matni · `'hamma foydalanuvchi'` · `null` («Hozircha bilmayman»). Sxemada faqat nom bor edi.
6. **Mentor davri** — «ishga tushgandan keyingi ikki hafta» (12-Modul 1.12/1.13: «ikki hafta o'tib 44»). 13-Modul 1.1 da davr yo'q; ta'rif «bir davrda» deydi — davrsiz misol ta'rifga zid bo'lardi.
7. ✅ (07.10 qabul — tayanch 9.17, 1.1 va A-2 tuzatildi; F-1007-459 da birinchi yarmi ham: «qoplashi kerak», tayanch 1.1) **Asosiy fikrning ikkinchi yarmi** — tayanch 1.1 (eski): «bu misolda ikkala son ham hozircha taxmin». Aniqroq: Mentorning bepul kanallardagi jalb qilish narxi (0 so'm) — fakt; taxmin — keltiradigan pul (10 000, 3 oy) va «agar» mashqi. Tahrir taklifi: «…— bu misolda keltiradigan pul va pullik kanal sonlari hozircha taxmin.» A-2 da tayanch gapi aynan turibdi, ekranlarda bu da'vo aytilmaydi.
8. **Pro va «Doimiy o'yin» 1-darsda — «Mentorning rejasi» yorlig'i bilan** (ilovada hali yo'q; 4-dars va'da qilinmaydi). Telefon maketida Pro ko'rsatilmaydi — Pro qismi 4-ekranning ustun kartasida, kulrang ramkada, yorliq «Mentorning rejasi» bilan.
9. **Mentor kanallari nomlari** — 12-Modul 1.6 dagi uchtasi (13-Modul 1.0 da «postlar, guruh, sinf chati» deyilgan — zid emas, aniqrog'i).
10. **«Ulardan bittasi to'laydi — qolganlari pul to'lamaydi»** (5-ekran) — tayanch 1.1 «ular ichida 1 tashkilotchi chiqsa»dan; qolgan 11 kishini «o'yinchi» demadim (tashkilotchi ham bo'lishi mumkin) — «pul to'lamaydi».
11. **Juftlik varag'i kalitga yozilmaydi** (sxemada joy yo'q; 2, 4-darslar o'qimaydi). Kerak bo'lsa — `sherik: { belgilar: [3], tur: 'sherik' | 'ozi' }`.
12. **`tur: 'mashq'`** — 7-ekrandagi «Mentor sonlari bilan mashq» tugmasi (mahsulotida foydalanuvchi bo'lmagan o'quvchi uchun); 2, 4-darslar `tur: 'mashq'` sonlarini o'quvchining haqiqiy sonlari deb ko'rsatmasligi kerak (12-Modul 9.40 d naqshi).
13. **«44 kishidan 6 tasi — tashkilotchi»** 4-ekranda (1.13 1-qatorida 6 bor). 2-darsda shu son Neon SQL bilan sanaladi — 1-dars uni Mentor fakti sifatida aytadi, SQL kashfiyoti esa 2-darsda qoladi. Tasdiq kerak: 2-darsning sanog'i «tekshiruv» bo'lib qoladimi.
14. **Bashorat variantlari** (F-1007-459: 4-ekran «bir nechtasi» → «ozchiligi»; 2-ekran: «0 so'm · bir necha ming so'm · o'n ming so'mdan ko'p»; 5-ekran: «5 000 · 30 000 · 60 000») — yangi son to'qilmadi: 2-ekranda so'z bilan daraja, 5-ekranda darsdagi sonlar.
15. **Kod oynasida Mentorning `kanal` va `pro` obyektlari** (`tashkilotchi: 1`) — tayanch 1.1 «agar» sonlari aynan; `meniki` — o'quvchining sonlari; o'quvchi qatorida xulosa yo'q (to'lovchilar soni yo'q — TS 4). F-1007-459: kalit yo'q bo'lsa yorliq «Mashq»; keltiradigan pul `null` — «noma'lum».
16. **Uyga vazifa ②** — «pullik kanal o'z pulini qoplashi uchun bitta to'lovchini jalb qilish narxi necha so'mdan oshmasligi kerak?» (F-1007-459) (javob — o'z keltiradigan puli). Tayanchda yo'q mashq; asosiy fikrning shaxsiy qo'llanishi, real pul va real odam yo'q.
17. **Hook** — ballsiz (J-026), lekin «Aynan!» / «Qiziq fikr!» bilan (12-Modul 12-dars naqshi; T-028, T-067). F-1007-459: ChatGPT olib tashlashni so'radi — RAD (kurs qonuni).
18. ✅ **Yopildi — F-1007-459:** yorliq yetmadi — muhr «qoplanadi», ostida doimiy qator «Bu hisobda faqat kanallarga sarflangan pul bor — mahsulotni ushlab turish puli kirmagan.»; xulosa va asosiy fikrdan «-gina … o'zini oqlaydi» olib tashlandi. Avvalgi qaror: **«O'zini oqlaydi» — kanalga sarflangan pul haqida.** Tayanch 1.1: «…kam bo'lsagina mahsulot o'zini oqlaydi» — zarur shart (to'g'ri). Lekin muhr «o'zini oqlaydi» yolg'iz turganda yetarli shartdek o'qiladi, mahsulotning boshqa xarajatlari esa (4-dars) hali hisoblanmagan. Qarorim: muhr ustida yorliq «Kanallarga sarflangan pul:», kod qatori «pullik kanal: …»; xulosa va asosiy fikrda «-gina» saqlanadi.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — taqsimot reja (A-12); 7-ekran (15) va 9-ekran (15) uzoqroq cho'zilishi mumkin (ChatGPT auditi: 100–115 daqiqa). «Qur» pilotida taymer bilan; sig'masa — 8-ekran yakka rejimga yoki uyga.
2. ⛔ **Kod oynasida `null` tekshiruvi** — `HtmlCompiler.jsx` kodini o'qib tekshirdim (`String(null)` = «null»), haqiqiy oynada sinalmagan; dinamik boshlang'ich kod (`meniki` qatori kalitdan) ham — «qur» da sinaladi.
3. **6-ekran A varianti** — «bitta foydalanuvchi narxi» hamma to'laydigan mahsulotda to'g'ri bo'lardi; savol «Mentor misolida» bilan himoyalangan. Auditor «A ham himoyalanadi» deyishi mumkin — Mentor misolida o'yinchilar to'lamasligi 4-ekranda ko'rsatilgan.
4. ✅ (F-1007-459) ibora olib tashlandi — «qoplanadi». Avval: **«O'zini oqlaydi» iborasi** — 13 yoshli uchun tushunarliligi (12-Modulda ishlatilmagan). Muqobili yo'q — tayanch so'zi; xulosada «kam bo'lsagina» bilan ochiladi.
5. **«Bepul kanallar chegarali»** (tayanch gapi aynan) — «chegarali» o'smirga mavhum bo'lishi mumkin; kartochkada «ulardagi a'zolar soni cheklangan» deb ochilgan.
6. **44 ta odam belgisi** — vizual zich bo'lishi mumkin (11 × 4 to'r); 393 px da kesilmasligi va o'qilishi vizual bosqichda tekshiriladi (E 41).
7. ✅ (F-1007-459) `sarf` 0 da endi muhr «pul sarflanmagan» (`'sarfsiz'`). Avval: **7-ekran xulosa qoidasi** — `sarf` 0 da «o'zini oqlaydi» (pulda) chiqadi: o'quvchi buni «mahsulotim o'zini oqladi» deb o'qishi mumkin. Shuning uchun muhr ostida halol qator majburiy («Pul sarflanmagan — vaqt sarflangan…»).
8. **3-ekran C (4 800)** — «sinfdoshlar sanalmaydi» xatosi; 12-Modulda sinfdoshlar sanalishi o'rgatilgan, lekin bu darsda faqat 2-ekran kulrang qatorida eslatiladi.
9. **8-ekran 3-savoli** («kimdir aytganmi yoki taxminmi?») — sherik og'zaki javobni baholaydi; belgi subyektiv bo'lishi mumkin. 2-savol to'lovchi mahsulotdan foydalanishini talab qilmaydi (O'qituvchi eslatmasida ochiq).
10. ✅ (F-1007-459) variant «ozchiligi», natija «ozchiligi — 44 kishidan 6 tasi». Avval: **Bashorat «44 kishidan nechtasi…» to'g'ri javobi «bir nechtasi»** — 6 ni «bir nechta» deyish o'quvchida bahs tug'dirishi mumkin; natija qatori «aslida: bir nechtasi» va karta «6 tasi» bilan aniqlanadi.
11. **Uyga vazifa ①** — real odam (F-1007-459: ota-ona yoki sinfdosh — TAQIQLAR 3 ro'yxatidan) bilan, lekin narx so'ralmaydi; baribir pul suhbatiga aylanib ketishi mumkin — Izoh (MD) va karta yorlig'i bilan chegaralangan; 6-darsdan oldin xavfsizlik ro'yxati aytilmaydi.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 13-Modul pul sinflari + 12-Modul tayanchi 7)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-12 taqsimot va «Ulgurmasangiz» (7: «Hozircha bilmayman», «Mentor sonlari bilan mashq» · 8: yakka · 9: «Kodni uyda tugataman»); ⛔ taymer; «sig'adi» deyilmagan. Tashqi kutish yo'q.
2. [x] **Tekshirilmagan tashqi qadam** — tashqi xizmat yo'q; ⛔ faqat `HtmlCompiler` (null, dinamik starter) — Shubhali 2. «Kompilyatorni ochish» — mavjud platforma tugmasi (12-Modul 12-dars).
3. [x] **Saqlash kaliti — shartnoma** — `pm-m11d1-birlik` tayanch 8 aynan (yangi maydon yo'q); tiplar va `null` holatlari (KOD 8); `tur` real/mashq; `davr` bilan — son yolg'iz emas; manba — haqiqiy yo'l (hisobot yoki o'quvchi); «tuzatish» olgan son qo'yilmaydi; ism yo'q; boshqa dars kalitiga yozilmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (2, 4, 5, 6-ekran), «Mentorning taxmini», «Mentorning rejasi» (Pro), xulosa «bu misolda» (5-ekran); Yordam «namuna, umumiy qolip emas» (7); o'quvchi narxi va roli — o'zining.
5. [x] **Kafolat va sabab da'vosi yo'q** — «qoplanadi» faqat bitta to'lovchi va kanal puli bo'yicha, ostida doimiy chegara qatori (F-1007-459); «zarar» — «bu misolda»; 3 oy 43% ga tayanmasligi aytilgan (4); «o'zgartirildi» («tuzatildi» emas — 8); «zarar — baho emas»; kafolat so'zlari 0 (O'lchov).
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun 4 holat (har biri kalitdan; «hali yozilmagan» alohida — E 54); «Bajardim» faqat darvoza + 3 shartdan; «Kodni uyda tugataman» — nishonsiz; nishon tavsiflari qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan** — birliklar: kishi (Database, ro'yxatdan o'tgan) · qurilma (43%) · so'm; jalb qilish narxi — so'm bitta foydalanuvchiga; 43% va 44 bir-biridan ayirilmaydi; «yangi foydalanuvchi» — shu davrda ro'yxatdan o'tgan (arena 10).
8. [x] **Test: bitta himoyalanadigan javob** — 3 (turkumlar: guruh · sinfdosh qoidasi · bo'linmagan), 6 (Mentor misoli bilan himoyalangan — Shubhali 3), 10 (tashlab ketish · halollik · boshqa o'lchov); arena distraktorlari — darsning o'z qoidasi bo'yicha.
9. [x] **Real odamlar xavfsizligi** — juftlik — sinfdosh bilan (8); uyga vazifa ① — ota-ona yoki sinfdosh, narx so'ralmaydi; ism, telefon kalitda yo'q; qo'l ko'tartirib sanash yo'q (0, 7, 8 eslatmalari); spam va bosim yo'q.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent va tekshiruv akkaunti yo'q (PM darsi, repo'ga yozmaydi).
11. [x] **Web-trek teng yo'l** — ikki son trekka bog'liq emas; 7-ekran Yordam «Web-trekda ham shunday»; testlar ikkala trekka to'g'ri; telefon maketi — faqat Mentor misoli.
12. [x] **Mentor misoli ichki izchil** — 44 · 11 · 6 · 0 · 10 000 · 3 · 30 000 · 60 000 · 12 · 1 — 1.1/1.13 aynan; 15 000, 51, 83 000 ochilmaydi; bitta son ikki da'voda emas; 2-darsning model kashfiyoti ochilmaydi (Pro — fakt, model nomisiz).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — prompt yo'q; o'quvchi narxi, oyi, roli — o'zining; Mentor sonlari faqat Yordamda va «mashq» tugmasida (yorliq bilan).
14. [x] **Uyga vazifa yengil va aniq** — 2 band + holatga qarab ③; «Kim bilan · Nechta · Muddat».
15. [x] **Ayb da'vosi yo'q** — xato izohlari ayblamaydi, keyingi qadamni aytadi; «Odam haqida emas» (8); «zarar — baho emas».
16. [x] **Kelajak va'dasi yo'q** — Pro «Mentorning rejasi», qachon qurilishi aytilmaydi; kelajak va'dasi qatori yo'q (T-038; keyingi dars faqat O'qituvchi eslatmasida va yakun qatorida); lending, post, to'lov ekrani yo'q.
- **13-Modul pul sinflari:** [x] real pul yo'q — reja kulrang qatori, 2-ekran `QIzoh`, uyga vazifa kartasi osti · [x] karta ma'lumoti hech qayerda — darsda to'lov ekrani va karta yo'q · [—] «mashq to'lov» taqlidi — to'lov sahifasi yo'q (3-dars) ·
  [—] «test rejim» belgisi — to'lov ekrani yo'q · [x] narx — «Mentorning taxmini» (4, 5, 7-ekran, kartochka) · [x] bosim yo'q — pullik kanalga undash yo'q, uyga vazifa ① narx so'ramaydi · [—] oferta — 7-dars.
- **12-Modul tayanchi 7 (kuchda):** holatga qarab yakun [x] · da'vo isbot emas [x] · maxfiy qiymat chiqmaydi [x] (tilga olinmaydi) · tashqi xizmat faqat rasmiy hujjat [x] (yo'q) · har sonning manbasi va o'lchovi [x] · tayanchda yo'q narsa to'qilmaydi [x] (TAYANCHGA SAVOL 1–18) ·
  kalit o'qiydigan darsdan [x] · bitta himoyalanadigan javob [x] · keys bank so'zi [—] (keyssiz) · 90 daqiqa [x] · bir ma'no — bir so'z [x] (A-5) · web-trek teng [x] · agent va o'quvchi ishi [—] (agent yo'q) · o'smir xavfsizligi [x].

## O'lchov
Skript: `scratchpad/md01/olchov.py` (07.10.2026) — MD da o'lchov uchun har matn belgilangan, uzunligi (belgilar, bo'shliq va tinish bilan; «**» siz) qavsga skript yozgan.

| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 4, 5, 7, 8 ×2, 9, 12, 13 ×4) | 14 | 25 | 54 | ≤55 |
| Hook javobi («Aynan!» / «Qiziq fikr!» bilan birga) | 3 | 74 | 95 | ≤120 |
| Hook variantlari (0) | 3 | 34 | 38 | farq 12% |
| Xulosa (2, 4, 5, 8, 9 — sobit matn) | 5 | 61 | 110 | ≤110 |
| `QIzoh`, kulrang va halol qatorlar (bitta qator) | 17 | 46 | 97 | ≤110 |
| To'g'ri izohi (3, 6, 10) | 3 | 44 | 56 | ≤60 |
| Xato izohlari, `QXato` va tekshiruv xabarlari | 29 | 29 | 57 | ≤60 |
| Test savollari (3, 6, 10) va arena savollari — so'z | 15 | 4 | 12 | ≤12 |

| Test | ✔ | Uzunliklar (A · B · C · D) | Eng qisqa / eng uzun | Farq | O'rtachadan eng katta farq | ✔ yolg'iz eng uzunmi |
|---|---|---|---|---|---|---|
| s3 | B | 10 · 10 · 10 · 11 | 10 / 11 | 10% | 7% | yo'q |
| s6 | D | 64 · 61 · 66 · 60 | 60 / 66 | 10% | 5% | yo'q |
| s10 | A | 39 · 38 · 42 · 41 | 38 / 42 | 11% | 5% | yo'q |
| arena 1 | A | 25 · 26 · 24 · 25 | 24 / 26 | 8% | 4% | yo'q |
| arena 2 | B | 28 · 30 · 27 · 31 | 27 / 31 | 15% | 7% | yo'q |
| arena 3 | C | 26 · 27 · 25 · 24 | 24 / 27 | 12% | 6% | yo'q |
| arena 4 | D | 24 · 22 · 21 · 22 | 21 / 24 | 14% | 8% | yo'q |
| arena 5 | A | 11 · 11 · 11 · 11 | 11 / 11 | 0% | 0% | yo'q |
| arena 6 | B | 22 · 23 · 25 · 22 | 22 / 25 | 14% | 9% | yo'q |
| arena 7 | C | 30 · 32 · 32 · 32 | 30 / 32 | 7% | 5% | yo'q |
| arena 8 | D | 29 · 26 · 28 · 26 | 26 / 29 | 12% | 6% | yo'q |
| arena 9 | A | 32 · 30 · 30 · 32 | 30 / 32 | 7% | 3% | yo'q |
| arena 10 | B | 32 · 34 · 35 · 34 | 32 / 35 | 9% | 5% | yo'q |
| arena 11 | C | 31 · 31 · 31 · 31 | 31 / 31 | 0% | 0% | yo'q |
| arena 12 | D | 36 · 33 · 32 · 33 | 32 / 36 | 12% | 7% | yo'q |

Arena ✔ taqsimoti: A — 1, 5, 9 · B — 2, 6, 10 · C — 3, 7, 11 · D — 4, 8, 12 (har biri 3/3/3/3). Ekran testlari: 3 — B · 6 — D · 10 — A.

Mentor gaplari (asosiy qator; skript — gaplar soni va sarlavha so'z o'zaklari kesishmasi): 0: 1 gap, kesishma 1/5 · 1: 2 gap, kesishma 1/6 · 2: 1 gap, kesishma 2/6 · 4: 1 gap, kesishma 1/4 · 5: 1 gap, kesishma 2/7 · 7: 1 gap, kesishma 1/5 · 8: 1 gap, kesishma 0/6 · 9: 1 gap, kesishma 1/5. Reja (1) — ikki gap, qolgan interaktiv ekranlar — bitta gap; hech biri «Bu…», «Hammasini…» bilan boshlanmaydi; kesishma hamma joyda 50% dan kam (T-072).
Kod oynasi boshlang'ich kodi: 50 qator, eng uzuni 65 belgi (≤ 70 — SABOQ 37).
Kafolat so'zlari («darrov», «darhol», «har doim», «hech qachon», «albatta», «100%») o'quvchi matnida — 0 (faqat A-5 «Ishlatilmaydi» va GATE M ro'yxatlarida, MD ichki).
F-1007-459 (07.10, ChatGPT auditi Filtri) da o'zgargan qatorlar qayta sanaldi (Python `len`): 2-ekran `QIzoh` 95 · muhr osti doimiy qatori 88 · 5-ekran sarlavha 51, xulosa 95 · 7-ekran halol qatorlar 67 · 52 · 51 · 8-ekran `QXato` 52 · A-2 birinchi gapi 108 · 6-ekran savoli 10 so'z, 10-ekran 12 so'z · arena 8 A 29, arena 9 savoli 6 so'z.
`npm run lint:til feedback/F-1007-13modul/01-PmUnitEconomics-v3.md` — natija jurnalda (F-1007-459).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 438 `m10-13` «Zaxira dars» → 445 **`m11-01` «Bitta foydalanuvchi sizga qanchaga tushadi?»** (osti «jalb qilish narxi va foydalanuvchi keltiradigan pul» — reja chap yorlig'i so'zma-so'z) → 446 `m11-02` «Mahsulotingiz qanday pul topadi?» (yakun qatori). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (1.0, 1.1, 1.13 aynan); metafora yo'q; bitta vizual — `BirlikSahna` (kanallar · foydalanuvchilar · telefon · ikki ustun). Ikkinchi misol faqat testda (kitob almashish ilovasi — 3; arena — uy vazifalari, to'garak). Keys yo'q.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 5 (QTushuncha) + 0, 7, 8, 9; testlarda javobdan keyingi kichik vizual. «Bosish → matn-karta» yo'q — har bosish kanal, odam belgisi, telefon yoki ustunni o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: kanal, post, ro'yxatdan o'tgan, sinfdosh qoidasi, metrika hisoboti, qaytganlar foizi, Mentorning taxmini, tashkilotchi, o'yinchi (12-Modul tayanchi 2). Yangi — jalb qilish narxi, foydalanuvchi keltiradigan pul, pullik obuna, Pro, to'lovchi, pullik kanal — misoldan keyin.
  Siz-forma; tugmalar ot-shaklda yoki siz-formada («Saqlash», «Keyingi», «Hozircha bilmayman», «Bajardim — ikki son hisoblandi», «Kodni uyda tugataman», «1 Ayting · 2 Belgilang · 3 Tuzating»).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov), to'g'ri javob hech qayerda yolg'iz eng uzun emas; tire, qo'shtirnoq, qavs to'g'ri variantga xos emas; kalit so'z faqat to'g'rida emas. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda (3 — B, 6 — D, 10 — A).
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › → — belgilar) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%», «albatta» — o'quvchi matnida 0; «hech qachon» — 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-01`, «Modul 13», CAC/LTV — faqat kartochka izohida bir marta; modul raqami — «12-Modul», LMS raqami). «KOD» ro'yxati 14 band, REPO 0.
- [x] Karta T · P · S · PM: T-011/PM-030 (atamalar misoldan keyin; sarlavhalarda yangi atama yo'q — «jalb qilish narxi» sarlavhada yo'q) · T-014/T-015 (A-5: foydalanuvchi/kishi, hisob, foyda, obuna) · T-016 (metafora yo'q) · T-020 · T-029/T-047 (Mentor yo'riqni takrorlamaydi) ·
  T-035 (o'quvchi izohida ÷ × → yo'q; strelka faqat maket natija qatorida) · T-038 (keyingi dars faqat yakun qatorida) · T-039 (mahsulotingiz — 12-Modul oxirida bor) · T-042 (ta'riflar so'zma-so'z: xulosa 2, 4 · Endi siz bilasiz · kartochka 1, 2) · T-043 («bu misolda», «Mentor misolida») · T-045 (43% — pullik obuna emas; 0 so'm — tekin emas) ·
  T-064 (2, 4-ekran sarlavhalari hook savolining so'zlari bilan) · T-070 · P-001 · P-002 · P-008 (≤3 blok) · P-012 (testlar 3, 6, 10 — ketma-ket emas) · P-013 · P-014/P-015 (reja natija-gap, kashfiyot ochilmaydi) · P-016 · P-025 · P-026 (9-ekran ikkinchi tugma) · P-033 · P-036 · P-046 (7, 8, 9, 13) · P-052 · P-055 · P-062 (Mentor gaplarida son yo'q) · P-064 · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 (bashoratlar bir o'lchovda, o'sish tartibida) · S-019 · S-020 · S-026 · S-027 · §144/§145 · PM-005 (2-tur) · PM-018 · PM-021 · PM-027 · PM-082 (darvoza-mashq, «…digan kod yozamiz», nusxa yo'q) · PM-108 (7-ekran qoidasi) · J-026 · SABOQ 1–55.
- [x] GATE M — ✅ 07.10 (13M-GATE-1, hammasi A); ChatGPT auditi — `01-FILTR.md` (F-1007-459); «qur» dan oldin ⛔: `HtmlCompiler` da `null` va dinamik starter, 90 daqiqa, 44 belgi 393 px da.
