# 14-Modul (kod: `src/12-Modull`) · 12-dars (PM) «Keyingi olti oyda nima qilasiz?» — MD v3 <!-- TAXMIN T20 -->

Fayl: `src/12-Modull/PmNextStepsLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-12` · **12 ekran** (keyssiz PM — tayanch 4, 12-qator; 12-Modul 11-dars shakli) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p maydonli ish — bittadan karta (E 53) · yorliq input ichida (E 43) · telefon maketi chapda, o'lchami barqaror (≈170×272) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakun sarlavhasi har holatda rost (E 54) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 8-ekran — **C** (`2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 477–479, grep 08.10, DE-205): `m12-11` «Qaysi xalqaro dasturga ariza berasiz?» → **`m12-12` «Keyingi olti oyda nima qilasiz?»** (osti: «Mentor bilan yakkama-yakka: shaxsiy reja», `type: 'PM'`) → `m12-13` «Demo Day'ga tayyormisiz?». <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn: o'quvchining **olti oylik rejasi** (uch yo'nalish, oylik maqsad, birinchi qadam va sana) + Mentor bilan **yakkama-yakka** (10 daqiqa); mustaqil ish majburiy (6, 7-ekranlar). **Keyssiz** (tayanch 5). **Kod ekrani yo'q** (tayanch 4). **REPO yo'q** (tayanch 3: `m14-dars-12-done` = `07-done`).
⚠️ **Halollik va xavfsizlik chegarasi (TAQIQLAR 1, 2, 3; sinf 9, 16, 17, 18) — har ekranga tegadi:** reja — o'quvchining o'z matni: Mentor ekraniga, proyektorga, podiumga chiqmaydi; sinfda solishtirilmaydi ·
«olti oyda katta bo'lasiz», «qabul qilinasiz», «ilova mashhur bo'ladi» kabi va'da — hech qayerda yo'q (reja — va'da emas: sana o'tsa, sababi va yangi sana) · investitsiya so'ralmaydi · Ish yo'nalishida: buyurtma — tanish doiradan, pul va kelishuv — ota-ona orqali; xat — bitta kompaniyaga bitta; ariza — maslahatchi bilan;
Upwork kabi saytlar — «odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing» (aniq yosh da'vo qilinmaydi). <!-- TAXMIN T13 -->
Vaqt: ≈ 90 daqiqa (taqsimot — A-10; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi). Yakkama-yakka sinfning hammasiga bitta darsda yetmaydi — A-14, TAYANCHGA SAVOL 1 (⛔).
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.12 — uch yo'nalish, oylik nishon, birinchi qadam sanasi, 13-Modul refleksiyasi, Mentor bilan 10 daqiqa, Mentor misoli — AYNAN** · 1.10 — buyurtma, xat, Upwork · 1.11 — Diamond Challenge, maslahatchi, ariza · 1.1, 1.14 — Mentor sonlari va halol gaplari · 2 · 4 · 7 — 18 sinf · 8 — `pm-m12d10-ish`, `pm-m12d11-dastur`, `pm-m12d12-reja` · 9 — 15 kelishuv) ·
`00-TAQIQLAR.md` (0–8) · `00-NOMLAR.md` · `MD_TOPSHIRIQ_2.md` (12-qator, eslatma 12, «Pilotlardan saboq») · 13-Modul tayanchi (1.4 — to'lov taklifi ekrani matni · **1.11 — Mentorning uch javobi** · 8 — `pm-m11d11-refleksiya`) · 13-Modul `11-PmReflection-v3.md` (o'qiladigan kalit manbai) + `11-FILTR.md` ·
namunalar (tuzilish va hajm; matn ko'chirilmadi): 13-Modul `11-PmReflection-v3.md` (12 ekranli qisqa PM, shaxsiy matn, Mentor misoli yopiq) · 11-Modul `15-PmOneOnOne-v3.md` + `15-FILTR.md` (yakkama-yakka tashkil etilishi, qadam) · pilotlar `01`, `07` va `NN-OZ-AUDIT.md`.
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «13-Modulda» (shaxsiy hisobot); dars raqami — shu modul ichida: «10-darsdagi», «11-darsdagi». Kod raqami faqat fayl yo'lida. Demo Day, bitiruv himoyasi, keyingi darslar — o'quvchi matnida va'da qilinmaydi (T-038; faqat yakundagi «Keyingi dars» qatorida dars nomi — TAYANCHGA SAVOL 9).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Darsning bitta natijasi** (dastur 12-qator: «Keyingi 6 oyga shaxsiy reja» — Mentor bilan yakkama-yakka · natija «Yozma reja»; tayanch 1.12, 4): o'quvchi o'z **olti oylik rejasini** uch yo'nalishda yozadi — <!-- TAXMIN T15 -->
   **Mahsulot** (davom ettiraman / to'xtataman + sabab) · **Ko'nikma** (nimani o'rganaman) · **Ish** (buyurtma, stajirovka yoki xalqaro dastur — 10, 11-darsdan); har yo'nalishga **oylik maqsad** (1-oy — majburiy, 2–6-oy — ixtiyoriy, TAYANCHGA SAVOL 4) va **birinchi qadam** + **sana** (6-ekran).
   13-Modul shaxsiy hisobotidagi «Keyingi 4 haftada nima qilaman?» javobi (`pm-m11d11-refleksiya.javoblar.keyingi`) Mahsulot yo'nalishining 1-oy maqsadiga taklif bo'lib ko'chadi. Keyin — **Mentor bilan yakkama-yakka, 10 daqiqa** (7-ekran; navbat bilan — A-14).
   Saqlanadi `pm-m12d12-reja` (A-11). Natija to'rt holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab; ✓ va nishon — faqat birinchisida). Bu dars — oldinga qarash; keyingi darslar va natijalar ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Olti oylik reja uch yo'nalishda yoziladi; har birini sanasi bor birinchi qadam boshlab beradi. (94)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 13-Modul 11-darsi: **shaxsiy hisobot** — «o'z qarorlaringiz haqida uch savolga yozma javob»; uchinchi savol aynan «Keyingi 4 haftada nima qilaman?» · holat **«uzoqroqda qoldi»** — «vaqti hali kelmagan ish o'z ustunida turibdi» (7-ekran kulrang qatorida faqat nomi).
   - 13-Modul: **Pro** · **«Doimiy o'yin»** · **test rejim** («Test rejim: pul yechilmaydi») · **yozma tasdiq** (real to'lov emas) · **tashkilotchi** · **o'yinchi**.
   - 12-Modul: **dalil** — son yoki yozuv (manba, qachon) · **sanoq sahifasi** · **qaytganlar** (qaytganlar foizi). Bugun dalil faqat mahsulot qarorining sababida (2, 3, 6-ekran).
   - 11-Modul 15-darsi: **yakkama-yakka** — Mentor bilan bir o'quvchining suhbati (tayanch 2 — o'zgarmaydigan atama) · **qadam** — «Riskni kamaytiradigan bitta aniq ish — qadam.» Bugungi «birinchi qadam» shu so'z bilan; ko'prik — 4-ekran O'qituvchi eslatmasida (o'quvchi matnida «ish» so'zi bugun yo'nalish nomi — A-5).
   - 10-Modul 1-darsi: **maqsad** (o'sha darsda — so'z bilan yozilgan yo'nalish; sarlavhasi «… oylik maqsad va raqamlar yozasiz») — bugun «oylik maqsad» shu so'z bilan (TAYANCHGA SAVOL 3); o'sha darsning inglizcha qisqartmasi o'quvchi matnida yo'q.
   - 14-Modul 10-darsi: **frilans** · **buyurtma** · **buyurtmachi** · **stajirovka** · ikki xat (bitta kompaniyaga bitta) · pul va kelishuv — ota-ona orqali. 11-darsi: **xalqaro dastur** · **ariza** · **maslahatchi** · Diamond Challenge (topshirish muddati 14.01.2027 — rasmiy) · konsept qoralamasi. <!-- TAXMIN T13 --> <!-- TAXMIN T14 --> <!-- TAXMIN T19 -->
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):** <!-- TAXMIN T15 -->
   - **yo'nalish** · **olti oylik reja** — «Bizda olti oylik reja uch yo'nalishdan iborat: mahsulot, ko'nikma va ish.» (2-ekran xulosasi — Mentorning uch gapi joylangandan keyin; kartochka 1; yakun 1-qatori). «Bizda» — kurs qolipi, umumiy qoida emas (sinf 4; 01 pilot naqshi).
     Tayanch 2 ta'rifi («uch yo'nalish, oylik nishon va birinchi qadam sanasi») darsda ikki bosqichda ochiladi: 2-ekranda — uch yo'nalish, 4-ekranda — oylik maqsad va birinchi qadam. <!-- TAXMIN T19 -->
   - **mahsulot qarori** (oddiy so'zlar, atama emas) — «Mahsulotda qaror bor — davom ettirish yoki to'xtatish; sababi son yoki yozuv bilan.» (2-ekran, 1-kartadan keyin `QIzoh`; yakun 2-qatori; kartochka 2, 3).
   - **oylik maqsad** — «oy oxirigacha nimaga yetmoqchi ekaningiz» (4-ekran `QIzoh`; yakun 3-qatori; kartochka 6). O'quvchi matnida tayanchdagi «nishon» o'rniga — o'yin nishonlari bilan bir darsda to'qnashadi (T-015; TAYANCHGA SAVOL 3); kalit maydoni `nishonlar` — faqat kodda.
   - **birinchi qadam** — «Sanasi bor, bir kunda qilinadigan aniq harakat — birinchi qadam deyiladi.» (4-ekran xulosasi — Mentor kartasi tanlangandan keyin; yakun 4-qatori; kartochka 7). Ta'rif meniki — TAYANCHGA SAVOL 13.
   - **sana o'tsa** (oddiy gap, atama emas) — «Sana o'tsa — sababini yozib, yangi sana qo'yasiz.» (6-ekran kulrang qatori; yakun 5-qatori; kartochka 8; arena 9). Reja — va'da emas: o'zgarishi mumkin.
   - **yakkama-yakka** — o'tilgan (11-Modul 15-darsi); bugun — 10 daqiqa, olti oylik reja haqida (7-ekran; kartochka 10, 11).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«yo'nalish»** — faqat rejaning uch yo'nalishi (mahsulot · ko'nikma · ish); Diamond Challenge'ning ichki yo'nalishlari bu darsda aytilmaydi (11-dars ishi).
   - **«ish»** — faqat **Ish** yo'nalishi (buyurtma, stajirovka, xalqaro dastur). Vazifa yoki roadmap qatori ma'nosida «ish» o'quvchi matnida yo'q: birinchi qadam — «aniq harakat»; 13-Modul ro'yxati — «belgilaganlaringiz». «uyga vazifa» — HwCard nomi (platforma).
   - **«maqsad»** — faqat oylik maqsad (1-oy … 6-oy). **«qadam»** — faqat birinchi qadam; pitchning «Keyingi qadam» bo'lagi bu darsda tilga olinmaydi.
   - **«qaror»** — mahsulot qarori (davom ettirish / to'xtatish) va «Reja sizniki» ma'nosidagi o'z qarori. **«sabab»** — kundalik so'z; mahsulot qarori yonida — son yoki yozuv bilan (12-Modul «dalil» ma'nosida); «Sana o'tsa — sababini yozib» — kundalik.
   - **«suhbat»** — faqat yakkama-yakka suhbat (bu darsda). 13-Moduldagi «pul haqida suhbat» bu darsda yo'q.
   - **«reja»** — faqat olti oylik reja. «roadmap», «B reja» — o'quvchi matnida yo'q (7-ekran kulrang qatorida faqat 13-Modul holati nomi «uzoqroqda qoldi»).
   - **«test»** — faqat Mentor gaplarida: «Backend testlari» (tayanch 1.12 aynan, olam matni — T-008) va «test rejim» (13-Modul atamasi, Mentorning 1-oy maqsadida). Ballik savollar o'quvchiga «1-savol», «Yakuniy savol» (Shubhali 4).
   - **«jamoa»** — faqat Mentorning Ish gapida (tayanch aynan, olam matni); prozada yo'q; «Maydon Jamoa» — telefon maketida (TAQIQLAR 0).
   - **«tanlov»** — o'quvchi matnida yo'q (xalqaro dastur — tanlov; T-015): mahsulot uchun — «qaror», Ish uchun — «yo'l». Kalit maydoni `tanlov` — faqat kodda.
   - **Ishlatilmaydi:** nishon (reja ma'nosida) · inglizcha qisqartmalar · hayot rejasi · karyera rejasi · roadmap · B reja · Demo Day va bitiruv himoyasi (o'quvchi matnida; faqat yakundagi «Keyingi dars» qatorida dars nomi) · hakam · investor, investitsiya (faqat 6-ekran yumshoq tekshiruvi va arena 3 ning noto'g'ri varianti) · YC · grant · «katta bo'lasiz», «mashhur bo'ladi» (faqat testning noto'g'ri variantlarida — ular va'da namunasi) · progress · KPI · keys · pilot · daftar.
6. **Mentor misoli — «Maydon Jamoa» olti oylik rejasi (bitta manba `MENTOR_REJA`; tayanch 1.12 AYNAN + yangi tafsilot — TAYANCHGA SAVOL 5; o'quvchiga «Mentor misolida»):** <!-- TAXMIN T15 -->

   | Yo'nalish | Qaror / yo'l | Gap (tayanch 1.12 aynan — `MENTOR_GAPLAR`) | Sabab yoki nima | Oylik maqsadlar | Birinchi qadam · kun |
   |---|---|---|---|---|---|
   | Mahsulot | Davom ettiraman | «Mahsulot — davom ettiraman: uch tashkilotchi bilan "Doimiy o'yin"ni sinayman.» | sabab: «Uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas.» (tayanch 1.1 Raqamlar halol gapi) | 1-oy «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinash» (13-Modul 3-javobidan) · 3-oy «Mahalladagi maydon egalari bilan gaplashish» (1.1 Keyingi qadam so'rovidan) · 4-oy «Boshqa bir mahalla futbol guruhini tekshirish» (1.1 Bozor halol gapidan) · 2, 5, 6-oy — bo'sh | «Uch tashkilotchiga yozib, sinash kunini kelishish» · shanba |
   | Ko'nikma | — | «Ko'nikma — Backend testlari.» | nima: «Backend testlari» | 1-oy «O'yinga qo'shilish yo'li uchun Backend testlarini yozish» · 2–6-oy — bo'sh | «Bitta kichik Backend testini yozib, ishga tushirish» · yakshanba |
   | Ish | Xalqaro dastur | «Ish — Diamond Challenge'ga jamoa bilan konsept.» | nima: «Diamond Challenge'ga jamoa bilan konsept» | 1-oy «Yana kamida bitta o'quvchi va maslahatchi topish» · 2-oy «Maslahatchi bilan ro'yxatdan o'tish» · 3–6-oy — bo'sh · muddat bayrog'i «14.01.2027» (rasmiy, tayanch 1.11) | «Konsept qoralamasini sinfdoshlarga ko'rsatish» · dushanba |

   - Mentor gaplari — olam matni (T-008), Mentor «men» shaklida (12-Modul pitchi naqshi). Tayanch 1.12 dagi uch gap so'zma-so'z; 2-ekran kartalarida — yo'nalish nomisiz (sortirovka uchun), taxtada — to'liq.
   - **Mahsulot 1-oy maqsadi = 13-Modul shaxsiy hisobotining 3-javobi** (13-Modul tayanchi 1.11 aynan: «To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.») — 4-ekranda varaqdan katakka uchadi (tayanch 1.12: «javobi shu yerga ko'chadi»). Sinf 12 — izchil: 14-Modul gapi «uch tashkilotchi bilan … sinayman» shu javobning davomi.
   - **Kunlar** (shanba · yakshanba · dushanba) — Mentor rejasidagi birinchi qadam kuni; kodda dars kunidan keyingi shu nomli kun (kun.oy shaklida, bayroq ostida). «Shanba» — namuna o'yin kuni (tayanch 1.0): tashkilotchilar o'yinda bo'ladi. Yangi tafsilot — TAYANCHGA SAVOL 5.
   - **Bo'sh oylar** — Mentor misolida yaqin oylar yozilgan, uzoqlari bo'sh (2-ekran `QIzoh`). Yangi Mentor sonlari va natijalari to'qilmaydi; 3-oy va 4-oy maqsadlari — tayanch 1.1 dagi bor gaplarning davomi (Bozor: «Boshqa mahallalarni hali tekshirmaganmiz.»; Keyingi qadam: «mahalladagi maydon egalari bilan tanishtiring»).
   - **Telefon matnlari** (2-ekran; faqat tayanchlardagi ekran matnlari): «O'yin» ekrani — «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · «Qo'shilaman» (tayanch 1.0).
   - **10, 11-darslardagi Mentor misoli bilan izchillik (koordinator eslatmasi, 08.10 04:05; 10 MD A-6 `MENTOR_BUYURTMA`, 11 MD A-6 `MENTOR_KONSEPT` — aynan):** 10-darsda Mentorning buyurtma rejasi — Kim «maktabdagi futbol to'garagining murabbiyi» · Nima «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi» · Qachon «shu hafta, mashg'ulotdan keyin — ota-onam bilan»;
     ikki xat — «mobil ilova qiladigan kompaniya» (stajirovka) va «sayt qiladigan kompaniya» (maslahat). 11-darsda — Diamond Challenge: jamoa «Jamoa bo'lagida bitta odam — yana kamida bitta o'quvchi kerak» · maslahatchi «hali aniqlanmagan» · ro'yxat «hali yo'q».
     Olti oylik rejada Mentor Ish yo'nalishiga dasturni qo'ygan (tayanch 1.12); shuning uchun Ish 1-oy va 2-oy maqsadlari 11-dars holatining davomi («yana kamida bitta o'quvchi», «maslahatchi», «ro'yxat»), buyurtma rejasi — 6-ekran Ish «Yordam»ida muqobil namuna (bir qator, aynan). Yangi matn to'qilmadi.
7. **Raqamlar (faqat tayanchdan; o'quvchi matnida «Mentor misolida»):** uch tashkilotchi, uch yozma tasdiq (1.14) · «8 / 10» (namuna o'yin, 1.0) · 14.01.2027 (Diamond Challenge topshirish muddati — rasmiy, 1.11, 6) · 10 daqiqa (yakkama-yakka, 1.12) · olti oy, 1–6-oy · 4 hafta (13-Modul savoli).
   Ikkinchi misolda: «uch sinfdosh» (5-ekran, mashq). Kod qoidasi: birinchi qadam sanasi — 31 kun ichida (yumshoq; TAYANCHGA SAVOL 14) · «odatda 18 yoshdan» (Upwork kabi saytlar — tayanch 1.10, rasmiy matn tekshirilmagan). Boshqa son yo'q: foydalanuvchi, tashkilotchi, Bozor sonlari bu darsda aytilmaydi.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** uy vazifalari ilovasi (3-ekran) · kitob almashish ilovasi (5-ekran, arena 12 — 13-Modul testlari olami). Metafora yo'q. Keys yo'q.
9. **Xavfsizlik va halollik (TAQIQLAR 1, 3; sinf 9, 17, 18):** <!-- TAXMIN T3 --> <!-- TAXMIN T13 -->
   - reja — shaxsiy matn: Mentor ekraniga, proyektorga, podiumga chiqmaydi; yakkama-yakkada o'quvchi o'z ekranida ko'rsatadi (7-ekran tepasidagi kulrang qator; KOD 9). Sinfda kim nima yozgani o'qitilmaydi, solishtirilmaydi, sanalmaydi;
   - rejada ism, telefon, akkaunt nomi, kompaniya xodimining ismi yo'q (6, 7-ekran tekshiruvi telefon va akkaunt shaklini bloklaydi); Ish yo'nalishida — rol bilan («tanish do'kon», «sinfdosh», «maslahatchi»);
   - Ish yo'nalishi qatorlari (6-ekran, yo'lga qarab): buyurtma — tanish doiradan, pul va kelishuv — ota-ona orqali · xat — bitta kompaniyaga bitta, javob kelmasa qayta-qayta yozilmaydi · ariza — maslahatchi bilan, shaxsiy ma'lumot — ota-ona xabardorligida · Upwork kabi saytlar — «odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing» (yumshoq tekshiruv);
   - pul: investitsiya so'ralmaydi; real to'lov — «ota-ona roziligi va yuridik shaxs bilan» (13-Modul TAQIQLAR 1 gapi, yumshoq tekshiruvda); Mentor misolidagi «Doimiy o'yin» — test rejimda («bu hali to'lov emas»);
   - kafolat va va'da yo'q: reja — o'quvchining niyati, va'da emas; «olti oyda katta bo'lasiz», «qabul qilinasiz», «mashhur bo'ladi» — faqat testning noto'g'ri variantida (va'da namunasi) va yumshoq tekshiruv ro'yxatida.
10. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · uch yo'nalish (2) ≈ 9 · 1-savol (3) ≈ 3 · birinchi qadam (4) ≈ 8 · 2-savol (5) ≈ 3 · rejangiz (6) ≈ 25 ·
    yakkama-yakka va bo'sh oylar (7) ≈ 22 · yakuniy savol (8) ≈ 3 · podium, kartochkalar, arena, yakun (9–11) ≈ 10 · zaxira ≈ 2.
    **Ulgurmagan o'quvchi yo'li:** 6-ekranda har yo'nalish kartasi alohida saqlanadi — tugamagani uyga vazifa ③ · 7-ekranda bo'sh oylar ixtiyoriy; navbat kelmasa — «Navbatim kelmadi» (A-14), yakun sarlavhasi shuni rost aytadi ·
    jonli darsda 6, 7 — `optionalLive`. Tashqi kutish yo'q (repo, build, xizmat yo'q).
11. **Saqlash kalitlari (tayanch 8; sxema — TAYANCHGA SAVOL 2):** <!-- TAXMIN T15 -->
    - **o'qiydi:** `pm-m11d11-refleksiya` — `javoblar.keyingi` (6-ekran Mahsulot kartasidagi taklif tugmasi) · `ishlar[]` dan `holat: 'uzoqroqda'` bo'lganlarning `nom`i (7-ekran kulrang qatori, ko'pi bilan uchta; qo'shimcha o'qish — TAYANCHGA SAVOL 7) ·
      `pm-m12d10-ish` — `buyurtma.{ kim, nima, qachon }` va `xatlar.length` (6-ekran Ish kartasidagi taklif tugmalari; `qachon` — matn, sana sifatida ishlatilmaydi — TAYANCHGA SAVOL 8) · <!-- TAXMIN T13 -->
      `pm-m12d11-dastur` — `dastur` (`'diamond'` — nom va muddat qatori; `'boshqa'` — nomsiz) va `maslahatchi` (`true` bo'lmasa — Ish kartasida kulrang qator). <!-- TAXMIN T14 -->
      Yo'q bo'lsa — taklif tugmasi va qator ko'rinmaydi, o'quvchi o'zi yozadi (tayanch 8 qoidasi). `pm-m9d8-platforma` o'qilmaydi (PM darsi, ikkala trekka bir xil).
    - **yozadi:** `pm-m12d12-reja` = tayanch 8 sxemasi (`{ yonalishlar: [{ tur, nishonlar, birinchiQadam, sana }], savedAt }`) + qo'shimcha maydonlar (TAYANCHGA SAVOL 2 — qo'shish taklifi):
      ```
      { yonalishlar: [ {
          tur: 'mahsulot' | 'konikma' | 'ish',
          tanlov: 'davom' | 'toxtataman' | 'buyurtma' | 'stajirovka' | 'dastur' | null,  // mahsulot va ish; konikma — null
          nima: string | null,          // konikma — nimani o'rganaman (≤ 80); ish — aynan nima (≤ 100); mahsulot — null
          sabab: string | null,         // faqat mahsulot (≤ 120); boshqalarida null
          nishonlar: [string | null] (6), // i — (i+1)-oy maqsadi; [0] majburiy (≤ 100), qolgani null bo'lishi mumkin
          birinchiQadam: string,        // ≤ 80
          sana: 'YYYY-MM-DD'            // bugun yoki keyingi kun
        } ] (≤ 3; tartib: mahsulot · konikma · ish),
        suhbat: true | false | null,    // true — Mentor bilan gaplashdi · false — bu darsda navbat kelmadi · null — belgilanmagan
        savedAt }
      ```
      Maydonlar shartnomasi: yo'nalish yozuvi 6-ekran kartasining «Saqlash»ida qo'shiladi yoki almashadi (`tur` bo'yicha); `nishonlar[1..5]` — 7-ekrandagi katak «✓»ida; `suhbat` — 7-ekran tugmalaridan (o'quvchining o'z belgisi, Mentor tasdig'i emas — sinf 9); `savedAt` — har saqlashda.
      Kalitga ism, telefon, akkaunt nomi, kompaniya xodimining ismi, Mentor misoli yozilmaydi. Dars boshqa darsning kalitiga yozmaydi. Kod qoralamasi kaliti yo'q (kod ekrani yo'q).
12. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar; birinchi qadam bayrog'i — chizilgan (CSS/SVG). O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Kafolat so'zlari yo'q («har doim», «hech qachon», «darrov», «albatta», «100%»); belgi-formula (→, ×, =) o'quvchi izohida va test variantida yo'q. «Maydon Jamoa» — telefon maketida, o'z yashil rangida (11-Modul 9.62), logotipsiz.
13. **Kod ekrani va trek:** kod ekrani yo'q (tayanch 4). PM darsi, blok yo'q — ikkala trekka bir xil; o'quvchi haqida — «mahsulot», «mahsulotingiz» («ilovangiz» emas — web-trekda sayt; sinf 11). «Ilova» — faqat Mentor misolida va ikkinchi misollarda (misolning o'zi).
14. **Yakkama-yakka — tashkil etilishi (tayanch 1.12: «Mentor bilan 10 daqiqa»; O'qituvchi eslatmalarida batafsil; ⛔ TAYANCHGA SAVOL 1):** <!-- TAXMIN T15 -->
    - suhbat — o'qituvchi (Mentor) bilan, dars ichida, navbat bilan: 6-ekranda uch yo'nalishni birinchi saqlagan o'quvchidan boshlab (Mentor ekranidagi ro'yxat — saqlash vaqti tartibida). Har suhbat — 10 daqiqa (Mentor ekranida taymer chizig'i, 12-Modul `TaymerChiziq` naqshi);
    - o'quvchi rejani **o'z ekranida** ko'rsatadi; Mentor uch savol beradi (`SUHBAT_SAVOL` — 7-ekran; matn meniki, TAYANCHGA SAVOL 11), o'quvchi o'zgarishni o'zi kiritadi (✎). Mentor rejani yozib bermaydi, baholamaydi, boshqalar bilan solishtirmaydi;
    - **sig'im:** 12–15 kishilik sinfda 10 daqiqadan — 2–2,5 soat; bitta darsda (6–7-ekranlar ≈ 45 daqiqa) ≈ 4 kishi. Navbati kelmagan o'quvchi «Navbatim kelmadi» ni bosadi; vaqtni Mentor o'zi belgilaydi va o'quvchiga aytadi (tashkiliy; ⛔ foydalanuvchi qarori — TAYANCHGA SAVOL 1);
    - kutayotganlar 7-ekranda bo'sh oylarni to'ldiradi; suhbatdan keyin — «Suhbat bo'ldi» va kerak bo'lsa ✎ bilan yangilash.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0–1.11):** 1–11-darslarda «Maydon Jamoa» pitchi, hikoyasi, tezligi, demosi, video-portfoliosi tayyorlandi; 10-darsda birinchi buyurtma rejasi va ikki xat, 11-darsda xalqaro dastur va boshlangan ariza. 13-Modulda o'quvchi ortga qaragan edi (shaxsiy hisobot).
  Bugun — oldinga qarash: keyingi olti oy uchun uch yo'nalishli reja va Mentor bilan yakkama-yakka.
- **Dars ipi:** 0 — keyingi olti oyda vaqtingizning ko'pi nimaga ketadi (ballsiz) → 2 — Mentorning uch gapi uch yo'nalishga joylanadi (atama «yo'nalish», «olti oylik reja»; mahsulot qarori va sababi) → 3 — test: davom ettirishga qaysi sabab →
  4 — 13-Modul javobi 1-oy katagiga ko'chadi; uni boshlaydigan karta tanlanadi (atama «oylik maqsad», «birinchi qadam») → 5 — test: qaysi biri birinchi qadam → 6 — o'z rejasi, uch yo'nalish (bittadan karta) →
  7 — bo'sh oylar va Mentor bilan yakkama-yakka → 8 — yakuniy: birinchi qadam katta chiqsa nima qilinadi → podium → kartochkalar → yakun (holatga qarab); uyda — rejani ota-onaga ko'rsatish va sanalarni kalendarga yozish.
- **Bitta vizual — «Olti oylik reja taxtasi» (`OltiOyReja`, dars bo'yi; 163/180; bitta manba `MENTOR_REJA` + o'quvchi ma'lumoti `pm-m12d12-reja`):** <!-- TAXMIN T15 -->
  - **taxta:** chapda uch qator nomi — **Mahsulot** · **Ko'nikma** · **Ish** (har birining ostida qaror yoki yo'l chipi va bitta kulrang qator — sabab yoki nima, uzun bo'lsa «…»); o'ngda olti ustun — **1-oy … 6-oy**; har katakda — oylik maqsad (2 qatorgacha, «…»), bo'sh katak — uzuq chiziq (U-041: o'quvchi to'ldiradi).
    1-oy ustunining chap chetida — accent **«Bugun»** chizig'i; birinchi qadam — 1-oy katagi ichida chizilgan **bayroqcha**, ostida sana (kun.oy; Mentor misolida — kun nomi va sana), joyi 1-oyning kunlariga mos. Rangli yon chiziq yo'q; holat ranglari — D3 tokenlari (saqlangan — `ok` ✓, joriy — `accent`).
  - **telefon «Maydon Jamoa»** (faqat 2-ekranda, chapda, ≈170×272 — SABOQ 22; nom 11-Modul yashilida, logotipsiz): «O'yin» ekrani — «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · «Qo'shilaman». O'quvchi mahsuloti chizilmaydi (darsda uning ekranlari yo'q).
  - **13-Modul varag'i** (faqat 4-ekranda, bir marta): kichik varaq «13-Modul · shaxsiy hisobot» — uch raqamli qator, 3-qator yonib, 1-oy katagiga uchadi.
  - Ko'rinishlar: **to'liq** (2, 4, 6, 7) · **kichik** (0, 1; testlarda javobdan keyin — ikkinchi misolning kichik taxtasi) · **ixcham chiziq** (6, 7-ekran tepasi: «Rejam · n/3»).
  - `prefers-reduced-motion` da uchish va to'lqin yo'q — yakuniy holat birdan qo'yiladi. 393 kenglikda: har yo'nalish alohida blok, oylar 3 × 2 katak; telefon taxta ustida, o'lchami kichraymaydi; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta taxtadagi o'z qatoriga uchadi · bayroqcha 1-oy katagiga tushadi · yangi katak ~1 s yashil yonadi · hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (ballsiz so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Keyingi olti oyda nima qilasiz?** (31) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Kursning oxirgi moduliga yetdingiz. Vaqtingizning ko'pi nimaga ketishini o'ylab, o'zingizga yaqin javobni belgilang. (116)
- Maket (chap; `OltiOyReja` kichik, bo'sh holat): ustunlar «1-oy … 6-oy», chap chetda «Bugun» chizig'i; uchta bo'sh uzuq qator — nomlari hali yo'q (U-041); ramka ustida kulrang yorliq «Olti oy». `pm-m12d12-reja` bo'lsa (dars qayta ochilgan) — o'quvchi rejasi kichik ko'rinishda.
- Variantlar (radio, o'ng; bir uzunlikda, bir shaklda — P-016):
  - Mahsulotimni davom ettirishga (29)
  - Yangi bir narsani o'rganishga (29)
  - Birinchi buyurtma yoki dasturga (31)
- Javob (har variantga o'zi; «Qiziq fikr!» — neytral, maqtov yo'q — J-026, T-028; P-016: hech bir tanlov yolg'onga chiqmaydi):
  - «Mahsulotimni …»: **Qiziq fikr!** Mahsulot — rejaning bir qismi. Bugun yoniga o'rganish va ishni ham yozasiz. (87)
  - «Yangi bir narsani …»: **Qiziq fikr!** O'rganish — rejaning bir qismi. Bugun yoniga mahsulot va ishni ham yozasiz. (87)
  - «Birinchi buyurtma …»: **Qiziq fikr!** Ish — rejaning bir qismi. Bugun yoniga mahsulot va o'rganishni ham yozasiz. (87)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; taxtadagi uch uzuq qator navbat bilan (100 ms) nom oladi — «Mahsulot» · «Ko'nikma» · «Ish», tanlangan variantga mos qator bir lahza accent bilan yonadi; oylar bo'sh qoladi (P-036 — 2-ekran kashfiyoti).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang va kim nimani tanlaganini sanamang — bugun har o'quvchi uchala yo'nalishni o'zi yozadi. «Buyurtma yoki dastur» — 10, 11-darsdagi ishning davomi.
  Sinfdan so'rang: «Uchalasidan qaysi biri uchun shu haftaning o'zida biror narsa qila olasiz?»
✎ Hook — o'quvchining o'z savoli (dars nomi) va o'z ishi (mahsulot, 10, 11-darslar). Uch variant — rejaning uch yo'nalishi oddiy so'z bilan («ish» — Ish yo'nalishi ma'nosida). Bitta to'g'ri javob yo'q — ballsiz so'rovnoma (13-Modul 11-dars naqshi); har variantga o'z javobi (bir xil matn hamma variantga emas — T-028 grep-nomzodi).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun keyingi olti oy uchun reja yozasiz.** (41)
- Mentor: Rejani o'zingiz yozasiz, Mentor misoli — faqat namuna. Yozgach, uni Mentor bilan yakkama-yakka ko'rasiz — navbat bilan. (119)
- Chap — kulrang yorliq «Dars oxirida — Mentor bilan yakkama-yakka: shaxsiy reja» (App.jsx osti so'zma-so'z, P-015) <!-- TAXMIN T20 --> + vizual `OltiOyReja` (kichik; o'zi yuradi — DE-200): uch qator nomi (Mahsulot · Ko'nikma · Ish) va olti oy ustuni navbat bilan chiziladi;
  kataklar bo'sh (uzuq); «Bugun» chizig'i yonida bayroqcha o'rni — uzuq doira (birinchi qadam keyin qo'yiladi). Mentor gaplari va sanalar ko'rinmaydi (2, 4-ekran kashfiyoti; SABOQ 33 — qator nomlari haqiqiy).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Mentor rejasidagi uch gapni joyiga qo'yasiz · `yo'nalish`
  - 02 · Birinchi oyga boshlanish kunini tanlaysiz · `birinchi qadam`
  - 03 · Mahsulot, ko'nikma va ish uchun o'z rejangizni yozasiz · `olti oylik reja`
  - 04 · Rejangizni Mentor bilan yakkama-yakka ko'rasiz · `yakkama-yakka`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Bu darsda yakkama-yakka — 10 daqiqa, navbat bilan (A-14): 6-ekranni birinchi saqlaganlardan boshlang. Farq: 11-Modul 15-darsida — roadmap, risklar va qadamlar; 12-Modul 11-darsida — pitch da'volari; 13-Modul 11-darsida — ortga qarash (shaxsiy hisobot); bugun — oldinga qarash.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011; «olti oylik reja», «yo'nalish», «birinchi qadam» — faqat kulrang teglarda va App.jsx ostida «shaxsiy reja» — TAYANCHGA SAVOL 10). Sarlavha — natija va'dasi (P-014). Mentorning birinchi gapi — sinf 4 va 13 (reja o'quvchiniki), ikkinchisi — navbat (A-14).

## 2 · Uch yo'nalish  ← QTushuncha (markaziy; ketma-ket 3 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · yo'nalish
- Sarlavha: **Mentor rejasidagi uch gap qayerga tushadi?** (42)
- Mentor: Har kartani o'qing va tugmalardan mosini bosing: Mahsulot, Ko'nikma yoki Ish. (77)
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Mentor rejasidagi uch gapdan nechtasi mahsulot haqida?** · Bittasi · Ikkitasi · Uchalasi —
  tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi; uch tugma shundan keyin yoqiladi.
- Vizual (≤ 3 blok: telefon · taxta va joriy karta · tugmalar qatori): **chapda** — telefon «Maydon Jamoa» (A-6) · **o'ngda** — `OltiOyReja` (Mentor misoli, to'liq; uch qator nomi, kataklar bo'sh) va uning ustida joriy gap kartasi (accent halqa) · **taxta ostida** — uch tugma: Mahsulot · Ko'nikma · Ish.
- Kartalar (navbat bilan; `MENTOR_GAPLAR` — tayanch 1.12 aynan, boshidagi yo'nalish nomisiz; to'liq gap natijada taxtada qaytadi): <!-- TAXMIN T15 -->
  1. «Davom ettiraman: uch tashkilotchi bilan "Doimiy o'yin"ni sinayman.» ✔ Mahsulot → karta Mahsulot qatoriga uchadi: qator nomi ostida chip «Davom ettiraman», 1-oy katagiga «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinash», 3-oy va 4-oy kataklariga Mentorning keyingi maqsadlari (A-6) navbat bilan tushadi; chip ostida kulrang sabab qatori: Sabab: uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas. (65)
     `QIzoh` (~3 s): Mahsulotda qaror bor — davom ettirish yoki to'xtatish; sababi son yoki yozuv bilan. (83)
  2. «Backend testlari.» ✔ Ko'nikma → karta Ko'nikma qatoriga uchadi: qator nomi ostida kulrang «Backend testlari», 1-oy katagiga «O'yinga qo'shilish yo'li uchun Backend testlarini yozish».
  3. «Diamond Challenge'ga jamoa bilan konsept.» ✔ Ish → karta Ish qatoriga uchadi: chip «Xalqaro dastur», ostida kulrang «Diamond Challenge'ga jamoa bilan konsept», 1-oy katagiga «Yana kamida bitta o'quvchi va maslahatchi topish», 2-oy katagiga «Maslahatchi bilan ro'yxatdan o'tish»;
     taxta ustida kulrang bayroq Diamond Challenge: topshirish muddati — 14.01.2027 (50) (rasmiy, tayanch 1.11; qaysi oy ustuniga tushishini kod bugungi sanadan aniqlaydi, olti oydan uzoq bo'lsa — o'ng chetda «›»). <!-- TAXMIN T14 -->
- **Harakat → Vizual o'zgarish:** tugma → to'g'ri bo'lsa karta qatorga uchadi (~1 s yashil), qator nomi ostiga chip va kulrang qator yoziladi, oylar kataklariga maqsadlar navbat bilan yoziladi; keyingi karta kiradi. Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-karta, «Ko'nikma» yoki «Ish»: Gap ilovaning o'zi haqida — o'rganish ham, dastur ham emas. (59)
  - 2-karta, «Mahsulot»: Backend — ilovaniki, lekin gap nimani o'rganish haqida. (55)
  - 2-karta, «Ish»: Bu buyurtma ham, dastur ham emas — o'rganiladigan narsa. (56)
  - 3-karta, «Mahsulot»: Bu ilovaning o'zi emas — dasturga ariza. (40)
  - 3-karta, «Ko'nikma»: Bu o'qish emas — xalqaro dasturga ariza. (40)
- Natija (bitta blok — E 42; `tugadi`: tugmalar yopiladi, telefon yig'iladi, taxta butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bittasi»; taxtada uch qator — Mentor gaplari to'liq, chip va kataklar bilan.
- Xulosa: Bizda olti oylik reja uch yo'nalishdan iborat: mahsulot, ko'nikma va ish. (73) — atamalar shu yerda (T-011)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Mentor misolida hamma oy to'lmagan: yaqin oylar aniqroq yozilgan. (65)
- Tugma (pastki): Avval belgilang → Gapni joylang (N/3) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Gap ilova, o'rganish yoki ariza haqidami — qaysi biri? (54)
- Keyingi bosiladigan joy: bashorat variantlari → uch tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Three Lines! (uch karta birinchi urinishda).
- O'qituvchi eslatmasi: Eng ko'p adashish — «Backend testlari»ni Mahsulotga qo'yish: Backend mahsulotniki, lekin bu gap — Mentor nimani o'rganishi haqida. Diamond Challenge konsepti ham mahsulotdan o'sadi, lekin u — dasturga ariza, ya'ni Ish yo'nalishi.
  Mentor misolida hamma oy to'lmagan: yaqin oy aniq, uzog'i — keyin aniqlashadi. Mentor gaplari — tayanch 1.12 aynan; sabab, oylar va kunlar — A-6 (TAYANCHGA SAVOL 5). Sinfga savol: «Sizning rejangizda mahsulotdan tashqari nima bor?»
✎ Sarlavha 0-ekran savoliga javob beradi: vaqt bitta narsaga emas — uch joyga (T-064). Bashorat zinapoyasi bitta o'lchovda (1 · 2 · 3); javob («bittasi») mahsulotni rejaning hammasi deb o'ylash xatosini ochadi.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — uy vazifalari ilovasi, P-002)
- Eyebrow: 1-savol (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Uy vazifalari ilovangizni davom ettirasiz. Rejaga qaysi sababni yozasiz?** (72)
  - A — Ko'p vaqt sarfladim, endi tashlolmayman (39)
  - ✔ B — Sanoq sahifasida har hafta qaytganlar bor (41)
  - C — Olti oyda uni butun maktab ishlatib ketadi (42)
  - D — Mentor davom ettirishimni aytib qo'ydi (38)
- Kalit: **B** (index 1). To'rttalasi bitta gap, tinish belgisiz; «davom ettir-» savolda va D da (kalit so'z faqat to'g'rida emas); to'g'ri javob yolg'iz eng uzun emas (O'lchov).
  Distraktorlar uch xil turkum: A — sarflangan vaqt (o'tmishdagi mehnat, dalil emas) · C — kelajak va'dasi · D — birovning qarori (qaror — o'quvchining o'zida, sinf 13).
- To'g'ri izohi: Sanoq sahifasi — dalil: kim qaytayotganini ko'rsatadi. (54)
- Xato izohlari (≤60):
  - A: Sarflangan vaqt ilova kerakligini ko'rsatadimi? (47)
  - C: Bu va'da. Hozir qaysi son yoki yozuv bor? (41)
  - D: Qaror sizniki — u qaysi dalilga tayanadi? (41)
  - (umumiy) Sabab — son yoki yozuv. Qaysi variantda bor? (44)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kichik taxta «Uy vazifalari ilovasi» — Mahsulot qatorida chip «Davom ettiraman», ostida yashil sabab qatori «sanoq: har hafta qaytganlar bor».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Real Reason! — birinchi urinishda to'g'ri.
- Izoh (MD): savol 2-ekran kartasining nusxasi emas (§106): boshqa mahsulot, Mentor sababi (yozma tasdiq) o'rniga — sanoq sahifasi. Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004): A hayotda his sifatida rost, lekin «sabab — son yoki yozuv» qoidasiga to'g'ri kelmaydi (2-ekran `QIzoh`).
  Ikkala trekka to'g'ri («ilova» — ikkinchi misolning o'zi).

## 4 · Birinchi qadam  ← QTushuncha (13-Modul javobi ko'chadi + 3 karta; P-064 — kuzatuvdan keyin harakat)
- Eyebrow: Tushuncha · birinchi qadam
- Sarlavha: **Birinchi oydagi maqsad qaysi kuni boshlanadi?** (45)
- Mentor: 1-oy katagidagi gapni o'qing va uni boshlab beradigan kartani bosing. (69)
- Vizual o'zi yuradi (bir marta, ~2 s, harakatdan oldin; `reduced-motion` — birdan): chapdan kichik varaq «13-Modul · shaxsiy hisobot» (Mentor misoli) kiradi — uch raqamli qator; 3-qator yonadi:
  «3 · Keyingi 4 hafta — To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.» (13-Modul tayanchi 1.11 aynan; olam matni — T-008) → qator uchib Mahsulot 1-oy katagiga tushadi, katak accent halqada;
  katak ustida kulrang yorliq: 13-Moduldagi «keyingi 4 hafta» javobidan (40). Varaq yig'iladi (≤ 3 blok: taxta · kartalar · natija). <!-- TAXMIN T15 -->
- Kartalar (uch variant bir vaqtda, taxta ostida; `QADAM_KARTALAR`; har kartada — harakat va kulrang «qachon»; Mentorning o'z gapi — «men» shaklida, T-008):
  - "Doimiy o'yin"ni hamma yoqtiradigan qilaman · vaqt topilganda (61)
  - ✔ Uch tashkilotchiga yozib, sinash kunini kelishaman · shanba (59)
  - Ilovani butun shaharga mashhur qilaman · olti oy ichida (55)
- **Harakat → Vizual o'zgarish:** to'g'ri karta → u kichrayib chizilgan bayroqchaga aylanadi va 1-oy katagining boshiga, «Bugun» chizig'idan keyingi shanba joyiga tushadi (bayroq ostida «shanba · {kun.oy}»); katak ~1 s yashil; qolgan ikki karta xiralashadi.
  Xato → karta silkinadi, bir lahza `err`, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-karta: Buni qachon qilib bo'lganingizni qanday bilasiz? (48)
  - 3-karta: Bu olti oyning natijasi — bir kunda qilinmaydi. (47)
- Natija (bitta blok — E 42; `tugadi`: kartalar yopiladi, taxta butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi.
- Xulosa: Sanasi bor, bir kunda qilinadigan aniq harakat — birinchi qadam deyiladi. (73) — atama shu yerda (T-011)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): 1-oy katagidagi gap — oylik maqsad: oy oxirigacha nimaga yetmoqchi ekaningiz. (77) <!-- TAXMIN T15 -->
- Tugma (pastki): Kartani tanlang → Davom etish
- Ipucha (40 s): Har kartadagi «qachon» qismiga qarang. (38)
- Keyingi bosiladigan joy: uch karta (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- Nishon yo'q (bitta tanlov; nishon — 5-ekran testida).
- O'qituvchi eslatmasi: Mentorning 1-oy maqsadi — 13-Modul shaxsiy hisobotidagi uchinchi javob: «keyingi 4 hafta» rejasi bugun olti oylik rejaning birinchi oyiga aylandi. «Test rejim» — Pro'da real pul yo'q.
  11-Modul 15-darsida «qadam» — riskni kamaytiradigan bitta aniq ish edi; bugun birinchi qadamning sanasi ham bor. Sana o'tsa — sababini yozib, yangi sana qo'yiladi (6-ekran kulrang qatori). Mentorning «shanba»si — namuna (TAYANCHGA SAVOL 5).
✎ Sarlavha savol — «qaysi kuni» (P-010); «oylik maqsad» va «birinchi qadam» sarlavhada emas, harakatdan keyin (T-011). Distraktorlar ikki xil: mavhum (qachon tugagani bilinmaydi) va olti oylik natija (va'da) — 5-ekran testidan boshqa olam.

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: 2-savol (savol ustida yorliq yo'q)
- Savol: **Kitob ilovangizning 1-oy maqsadi — sinfda almashish boshlansin. Birinchi qadam qaysi?** (85)
  - A — Ilovani hamma yoqtiradigan qilib chiqarish (42)
  - B — Vaqt topilganda dizaynini yangilab qo'yish (42)
  - C — Sinfdoshlar o'zi topib kelishini kutib turish (45)
  - ✔ D — Juma kuni uch sinfdoshga ilovani ko'rsatish (43)
- Kalit: **D** (index 3). To'rttalasi masdar shaklida, tinish belgisiz; «sinfdosh» C va D da (kalit so'z faqat to'g'rida emas); to'g'ri javob yolg'iz eng uzun emas (O'lchov).
  Distraktorlar uch xil turkum: A — mavhum natija (qachon bajarilgani bilinmaydi) · B — sanasiz (vaqt topilganda) · C — passiv kutish (harakat yo'q).
- To'g'ri izohi: Aniq kun bor, harakat bir kunda qilinadi. (41)
- Xato izohlari (≤60):
  - A: Hamma yoqtirganini qachon va qanday bilasiz? (44)
  - B: Vaqt topilganda — qaysi kun? Sanasi yo'q. (41)
  - C: Kutish — harakat emas. O'zingiz nima qilasiz? (45)
  - (umumiy) Birinchi qadamda nima bo'lishi kerak edi? (41)
- Javob topilgach (kichik, savol ostida): kitob ilovasining kichik taxtasi — 1-oy katagiga bayroqcha «juma» tushadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: First Step! — birinchi urinishda to'g'ri.
- Izoh (MD): savol 4-ekran kartalarining nusxasi emas (§106): boshqa mahsulot va boshqa maqsad; o'quvchi maqsadni harakatdan ajratadi. «Uch sinfdosh» — tanish doira (TAQIQLAR 3), ism yo'q. Ikkala trekka to'g'ri.

## 6 · Rejangiz  ← QMustaqil (USTAXONA 1/2 — bittadan karta, 3 yo'nalish; SABOQ 9, 13, 17, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · olti oylik reja
- Sarlavha: **Olti oylik rejangizni uch yo'nalishda yozing.** (45) <!-- TAXMIN T15 -->
- Mentor: Har kartani yuqoridan pastga to'ldirib, «Saqlash»ni bosing — Mentor misoli «Yordam»da. (86)
- Tepada — ixcham chiziq «Rejam · n/3» (yo'nalish nomlari, saqlangani ✓; bo'sh uzuq qatorlar yo'q — SABOQ 17).
- **Chapda — `OltiOyReja`** (o'quvchi rejasi, to'liq; joriy qator accent halqada) · **o'ngda — bitta katta karta** (joriy yo'nalish; tugmalar 1–3: Mahsulot · Ko'nikma · Ish — joriysi accent, saqlangani ✓). Maydonlar — yorliq input ichida (E 43: raqam belgisi + qisqa savol).
  1. **Mahsulot**
     - qaror tugmalari: «Davom ettiraman» · «To'xtataman»
     - ① sabab — placeholder Nega? Qaysi son yoki yozuv? (27) (≤ 120)
     - ② 1-oy maqsadi — placeholder Oy oxirigacha nimaga yetasiz? (29) (≤ 100). Maydon ustida kulrang taklif tugmasi (`pm-m11d11-refleksiya.javoblar.keyingi` bo'lsa): «13-Moduldagi rejangiz: «{keyingi}»» — bosilsa maydonga yoziladi (100 dan uzun bo'lsa — `QXato`, o'quvchi qisqartiradi).
     - ③ birinchi qadam — placeholder O'sha kuni aynan nima qilasiz? (30) (≤ 80)
     - ④ sana maydoni — kun tanlagich (⛔ «qur» da qurilmalarda sinaladi); ostida kulrang: Sana o'tsa — sababini yozib, yangi sana qo'yasiz. (49)
     - «To'xtataman» tanlansa — kulrang qator: To'xtatish ham — qaror. Foydalanuvchilaringizga aytishni rejaga qo'shing. (73)
  2. **Ko'nikma**
     - ① nima — placeholder Nimani o'rganasiz? (18) (≤ 80)
     - ② 1-oy maqsadi · ③ birinchi qadam · ④ sana maydoni — Mahsulotdagidek (kulrang qatori bilan).
  3. **Ish** <!-- TAXMIN T13 --> <!-- TAXMIN T14 -->
     - yo'l tugmalari: «Buyurtma» · «Stajirovka» · «Xalqaro dastur»
     - taklif tugmalari (kulrang; bor bo'lsa): «10-darsdagi buyurtma rejangiz: {nima} · {kim} · {qachon}» (`pm-m12d10-ish.buyurtma`; `qachon` — matn, sanaga aylantirilmaydi) → yo'l «Buyurtma», ① ga «{nima} — {kim}» yoziladi · «10-darsdagi xatlaringiz: {n} ta kompaniyaga» (`xatlar.length`) → yo'l «Stajirovka» ·
       «11-darsdagi dasturingiz: Diamond Challenge» (`pm-m12d11-dastur.dastur === 'diamond'`; `'boshqa'` — «11-darsdagi dasturingiz») → yo'l «Xalqaro dastur», ① ga «Diamond Challenge'ga ariza» (diamond bo'lsa).
     - ① nima — placeholder Aynan nima qilasiz? (19) (≤ 100)
     - yo'lga qarab bitta kulrang qator (TAQIQLAR 1, 3):
       - Buyurtma: Buyurtma — tanish doiradan; pul va kelishuv — ota-onangiz orqali. (65)
       - Stajirovka: Xat — bitta kompaniyaga bitta; javob kelmasa, qayta-qayta yozilmaydi. (69)
       - Xalqaro dastur: Ariza — maslahatchi bilan; shaxsiy ma'lumot — ota-onangiz xabardorligida. (73) · `dastur === 'diamond'` bo'lsa, ostida yana: Diamond Challenge: topshirish muddati — 14.01.2027. (51) ·
         `maslahatchi` `true` bo'lmasa: Maslahatchi hali yo'q — uni 1-oy maqsadiga qo'shsa bo'ladi. (59)
     - ② ③ ④ — Mahsulotdagidek.
  Tugmalar bir qatorda: «Saqlash» · o'ngda «Yordam».
- Tekshiruv (`QXato`, ≤60; maydon ostida; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
  - qaror yoki yo'l tanlanmagan (bloklaydi): Avval bittasini tanlang. (24)
  - maydon bo'sh (bloklaydi): Maydonni bo'sh qoldirmang — qisqa yozing. (41)
  - belgi chegarasidan uzun (bloklaydi): {N} belgidan oshdi — qisqartiring. (34)
  - sana tanlanmagan (bloklaydi): Birinchi qadamga sana qo'ying. (30)
  - sana o'tgan kun (bloklaydi): Bu kun o'tib ketgan — bugun yoki keyingi kunni tanlang. (55)
  - «@», «t.me/», «+998» yoki telefon shakli — 9 raqam (bloklaydi): Telefon va akkaunt nomi yozilmaydi. (35)
  - sana bugundan 31 kundan keyin (yumshoq): Birinchi qadam — birinchi oyda. Yaqinroq kun bormi? (51)
  - «albatta», «mashhur bo'l», «tez orada», «aniq bo'ladi», «katta bo'l», «hammasi» (yumshoq; 12-Modul `VADA_RE` naqshi): Bu va'da — oy oxirida aynan nima bo'ladi? (41)
  - sababda «ko'p vaqt», «mehnat qildim», «tashlolmayman», «afsus» (yumshoq): Sarflangan vaqt — sabab emas. Hozir qaysi dalil bor? (52)
  - sababda son ham, «sanoq», «tasdiq», «yozuv», «javob», «suhbat» ham yo'q (yumshoq): Sababga son yoki yozuv qo'shing. (32)
  - birinchi qadamda faqat «harakat qilaman», «o'rganaman», «yaxshilayman», «boshlayman», «o'ylab ko'raman» (yumshoq; 11-Modul 15-dars naqshi): Bu hali qadam emas: o'sha kuni aynan nima qilasiz? (50)
  - «investitsiya», «investor», «ulush» (yumshoq): Investitsiya so'ralmaydi — aniq harakat yozing. (47) <!-- TAXMIN T3 -->
  - «real to'lov», «pul olaman», «karta raqam» (yumshoq): Real pul — ota-ona roziligi va yuridik shaxs bilan. (51)
  - Ish kartasida «Upwork», «Fiverr», «Freelancer» (yumshoq): Bunday saytlar odatda 18 yoshdan — ota-ona bilan o'qing. (56) <!-- TAXMIN T13 -->
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; joriy kartaga qarab — Mentor misoli, A-6 aynan, + bitta yo'l-ko'rsatkich qator):
  1 — Mentor misolida: «Davom ettiraman» · sabab «Uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas.» · 1-oy «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinash» · birinchi qadam «Uch tashkilotchiga yozib, sinash kunini kelishish» — shanba.
      To'xtatish ham — qaror: sababini son yoki yozuv bilan yozing.
  2 — Mentor misolida: «Backend testlari» · 1-oy «O'yinga qo'shilish yo'li uchun Backend testlarini yozish» · birinchi qadam «Bitta kichik Backend testini yozib, ishga tushirish» — yakshanba.
      Kursda qiyin bo'lgan yoki mahsulotingizga kerak bo'lgan bitta narsani tanlang.
  3 — Mentor misolida: «Xalqaro dastur» · «Diamond Challenge'ga jamoa bilan konsept» · 1-oy «Yana kamida bitta o'quvchi va maslahatchi topish» · birinchi qadam «Konsept qoralamasini sinfdoshlarga ko'rsatish» — dushanba.
      Buyurtma yo'li bo'lsa — Mentorning 10-darsdagi rejasi kabi: «maktabdagi futbol to'garagining murabbiyi» uchun «to'garak uchun lending: mashg'ulot kunlari va yozilish tartibi».
      10-darsdagi buyurtma rejangiz yoki 11-darsdagi dasturingizdan oling; uchalasidan bittasi yetadi.
  Har kartada oxirgi qator: Uzoq oylarni keyin yozasiz — bugun 1-oy va birinchi qadam yetadi. (65)
- **Harakat → Vizual o'zgarish:** qaror yoki yo'l tugmasi → chip taxtadagi qator nomi ostiga uchadi; taklif tugmasi → matn maydonga sirg'alib yoziladi, tugma ✓ bilan xiralashadi;
  «Saqlash» → karta kichrayib taxtadagi o'z qatoriga uchadi: 1-oy katagiga maqsad, «Bugun» chizig'idan keyin sana joyiga bayroqcha «{kun.oy}», qator nomi ostida sabab yoki nima (~1 s yashil); hisoblagich n/3 o'sadi; keyingi karta kiradi.
  Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 3/3 → karta yopiladi, taxta butun enga (⛶), har qatorda ✎ (bosilsa — o'sha karta qayta ochiladi, o'sha tekshiruvlar bilan; SABOQ 29).
- Xulosa (3/3; o'quvchi ma'lumotidan — P-046): Uch yo'nalish yozildi: har birida 1-oy maqsadi va sanasi bor birinchi qadam. (76)
- Saqlash: `pm-m12d12-reja.yonalishlar` — har karta «Saqlash»ida o'z yozuvi (A-11 shartnomasi; `nishonlar[0]` — 1-oy, qolgani `null`), `savedAt`.
- Tugma (pastki): Uch yo'nalishni yozing (n/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: qaror yoki yo'l tugmalari (navbatma-navbat to'lqin) → joriy maydon (accent chegara) → «Saqlash» (maydonlar to'lgach halqada) → keyingi karta.
- Artefakt-strip (U-042): shu ekrandan — «Rejam · n/3» (ixcham); 7-ekranda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon: Six Months! (uch yo'nalish saqlanganda — bonus, ish bajarilgan ekranda — P-048).
- Mentor rejimi: forma o'rniga Mentor misolining to'liq taxtasi (A-6). Mentor statistikasi: «Reja saqlandi» (son); o'quvchilar ro'yxatida — saqlash vaqti (yakkama-yakka navbati, A-14). Reja matni Mentorga ham, proyektorga ham uzatilmaydi.
- O'qituvchi eslatmasi: ≈ 25 daqiqa. **Yakkama-yakka shu ekran paytida boshlanadi:** uch yo'nalishni birinchi saqlagan o'quvchini chaqiring (7-ekran). Eng ko'p xato: maqsad o'rniga va'da («mashhur bo'ladi») · birinchi qadam katta («ilovani tugataman») · sababda dalil yo'q.
  Sabab, maqsad, qadamni siz yozmaysiz — savol bilan yo'naltirasiz. «To'xtataman» — ham qaror: sababini so'rang, uyaltirmang; to'xtatish keyingi olti oy haqida — shu moduldagi darslarga tegmaydi.
  Ish yo'nalishida pul, buyurtmachi bilan uchrashuv, ariza — ota-ona bilan (TAQIQLAR 1, 3). Uchala yo'nalish — kurs shakli: o'quvchining ko'nikma yoki ish yo'li kichik bo'lsa ham bo'ladi.
✎ Bittadan karta (E 53): uch yo'nalish bir vaqtda emas. Taklif tugmalari — o'quvchining o'z oldingi ishidan (P-021, P-046); Mentor misoli faqat «Yordam»da (13-Modul 11-FILTR 22 — nusxa xavfi). 2–6-oy — 7-ekranda, ixtiyoriy (TAYANCHGA SAVOL 4).

## 7 · Mentor bilan yakkama-yakka  ← QMustaqil (USTAXONA 2/2 — bo'sh oylar + suhbat; SABOQ 9, 29, E 53)
- Eyebrow: Mustaqil ish · yakkama-yakka
- Sarlavha: **Rejangizni Mentor bilan 10 daqiqada ko'ring.** (44) <!-- TAXMIN T15 -->
- Mentor: Navbatingiz kelguncha bo'sh oylarni to'ldiring, chaqirganimda esa rejangizni ekraningizda ko'rsatasiz. (102)
- Tepada (kulrang, bitta qator): Reja matni Mentor ekraniga va proyektorga chiqmaydi. (52)
- **Chapda — `OltiOyReja`** (o'quvchi rejasi, to'liq; bo'sh kataklar bosiladi; tepada ixcham chiziq «Rejam · 3 yo'nalish») · **o'ngda — «Suhbat» kartasi**.
- **1-qism · Bo'sh oylar** (ixtiyoriy, kutayotganda):
  - taxta ustida kulrang qatorlar (bor bo'lsa, ko'pi bilan ikkita): 13-Modulda «uzoqroqda qoldi» deganlaringiz: {nomlar} (52) (`pm-m11d11-refleksiya.ishlar`, ko'pi bilan uchta nom, «…» bilan) · Diamond Challenge muddati qatori (6-ekrandagidek; Ish yo'li «Xalqaro dastur» va `dastur === 'diamond'` bo'lsa).
  - bo'sh katak bosiladi → katak kattalashib maydon ochiladi (yorliq ichida «{n}-oy maqsadi», ≤ 100) · «✓» bilan saqlanadi · bo'sh qoldirish ham mumkin.
  - Tekshiruv — 6-ekrandagi: telefon va akkaunt (bloklaydi) · va'da, investitsiya, real pul (yumshoq) · uzunlik (bloklaydi).
- **2-qism · Suhbat** (Mentor chaqirganda; karta doim ko'rinib turadi):
  - sarlavha: Suhbatda Mentor so'raydi: (25) + uch savol (kulrang, raqamli; `SUHBAT_SAVOL` — matn meniki, TAYANCHGA SAVOL 11):
    1. Uch yo'nalishdan qaysi biri siz uchun birinchi? (47)
    2. Birinchi qadamda sizga kim yordam beradi? (41)
    3. Birinchi qadamingiz bir kunga sig'adimi? (40)
  - tugmalar: «Suhbat bo'ldi» · «Navbatim kelmadi»
  - «Suhbat bo'ldi» → savol Rejada nima o'zgardi? (21) : «Hech narsa» · «Rejani yangilayman» (✎ — taxtadagi qator yoki katak 6-ekran kartasi bo'lib ochiladi, o'sha tekshiruvlar bilan) → «Saqlash».
  - «Navbatim kelmadi» → kulrang qator: Mentorga ayting — u siz bilan boshqa vaqtni kelishadi. (54) (⛔ tashkiliy — A-14); keyin «Suhbat bo'ldi» ga o'zgartirish mumkin.
- **Harakat → Vizual o'zgarish:** bo'sh katak bosilishi → katak kattalashib maydon ochiladi; «✓» → matn katakka yoziladi (~1 s yashil), keyingi bo'sh katakning yengil chegarasi yonadi; «Suhbat bo'ldi» → taxta sarlavhasi yonida kulrang belgi «Mentor bilan ko'rildi ✓» paydo bo'ladi;
  «Rejani yangilayman» → yo'nalish kartasi ochiladi, saqlanganda taxtadagi o'z qatoriga uchadi; «Navbatim kelmadi» → suhbat kartasi ixchamlanib, ostida kulrang qator qoladi.
- Xulosa (holatdan; P-046):
  - suhbat bo'ldi, o'zgarish yo'q: Rejangiz Mentor bilan ko'rildi, o'zgarish kerak bo'lmadi. (57)
  - suhbat bo'ldi, reja yangilandi: Rejangiz Mentor bilan ko'rildi va o'zingiz yangiladingiz. (57)
  - navbat kelmadi: Rejangiz yozildi; Mentor bilan suhbat hali bo'lmagan. (53)
- Saqlash: `pm-m12d12-reja.yonalishlar[i].nishonlar[k]` (har katak «✓»ida) · `suhbat` (`true` | `false`) · `savedAt`.
- Tugma (pastki): Suhbatni belgilang → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: navbatdagi bo'sh katak (yengil chegara) · «Suhbat bo'ldi» / «Navbatim kelmadi» (har birining o'z chegarasi) → «Davom etish».
- Nishon yo'q (suhbat — Mentorga signal; reja — 6-ekranda bonus bilan).
- Mentor rejimi: o'quvchilar ro'yxati — 6-ekranni saqlash vaqti tartibida (navbat); har qatorda «Reja saqlandi» va «Suhbat bo'ldi» signallari; suhbat taymeri 10:00 (12-Modul `TaymerChiziq` naqshi; faqat Mentor ekranida). Reja matni uzatilmaydi (A-9).
- O'qituvchi eslatmasi: Har suhbat — 10 daqiqa, taymer bilan. Reja — o'quvchining ekranida; siz savol berasiz, o'zgarishni o'quvchi o'zi kiritadi. Uch savol: qaysi yo'nalish birinchi · birinchi qadamda kim yordam beradi (ota-ona, sinfdosh, maslahatchi — Ish yo'nalishida ota-onani ham so'rang) · birinchi qadam bir kunga sig'adimi.
  Rejani baholamang, boshqalar bilan solishtirmang, «olti oyda katta bo'lasiz» kabi va'da bermang. 12–15 kishilik sinfda bitta darsda ≈ 4 kishiga yetadi: navbati kelmaganlar bilan vaqtni o'zingiz belgilang va o'quvchiga ayting (⛔ TAYANCHGA SAVOL 1).
  Kutayotganlar bo'sh oylarni to'ldiradi; uzoq oy bo'sh qolsa — xato emas.
✎ Sarlavhadagi «10 daqiqa» — tayanch 1.12 aynan (P-062: miqdor ekranda bir marta; Mentor gapida takrorlanmaydi). Suhbat belgisi — o'quvchining o'z belgisi, Mentor tasdig'i emas (sinf 9). Reja matni Mentor ekraniga chiqmaydi — 13-Modul 11-darsi naqshi (TAYANCHGA SAVOL 12).

## 8 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; yakkama-yakka va birinchi qadam birga; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy savol (savol ustida yorliq yo'q)
- Savol: **Suhbatda birinchi qadamingiz juda katta ekani bilindi. Nima qilasiz?** (68)
  - A — Qadamni Mentor o'zi yozib berishini so'rayman (45)
  - B — Katta qadamni o'zgartirmay, shunday qoldiraman (46)
  - ✔ C — Kichraytirib, bir kunlik qadamga aylantiraman (45)
  - D — Qadam sanasini o'chirib, keyinchalik qilaman (44)
- Kalit: **C** (index 2). To'rttalasi «…-aman» bilan tugaydi; vergul B, C, D da (tinish belgisi faqat to'g'rida emas); «qadam» to'rttalasida (kalit so'z faqat to'g'rida emas); to'g'ri javob yolg'iz eng uzun emas (O'lchov).
  Distraktorlar uch xil turkum: A — qarorni boshqaga berish (sinf 13) · B — suhbatdagi topilmani e'tiborsiz qoldirish · D — sanasiz qoldirish.
- To'g'ri izohi: Birinchi qadam bir kunga sig'adi — katta harakat bo'linadi. (59)
- Xato izohlari (≤60):
  - A: Reja sizniki: Mentor so'raydi, siz yozasiz. (43)
  - B: Bir kunga sig'maydigan qadam qanday boshlanadi? (47)
  - D: Sanasiz qadam qachon boshlanadi? (32)
  - (umumiy) Birinchi qadam qanday harakat edi — eslang. (43)
- Javob topilgach (kichik, savol ostida): Mentor taxtasi kichik — Mahsulot 1-oy bayrog'i «shanba» bir lahza yonadi, ostida kulrang «bir kunlik harakat».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon yo'q (yakuniy savol).
- Izoh (MD): savol 7-ekrandagi 3-savolning davomi (suhbatda topilgan narsa bilan nima qilinadi), 4, 5-ekranlarning nusxasi emas (§106). Arena 9 (sana o'tsa) va arena 10 (yakkama-yakkada reja bilan nima bo'ladi) bilan kalit ibora takrorlanmaydi (S-008).
  B hayotda o'quvchi Mentor bilan rozi bo'lmasa rost bo'lishi mumkinmi? — savol «juda katta ekani bilindi» deydi: bir kunga sig'maydigan harakat ta'rif bo'yicha birinchi qadam emas (sinf 8).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 2, 4-ekranlar — ballsiz; 6, 7-ekranlar «Saqlash» va suhbat belgisi — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
  Sinfda kim qanday reja yozgani sanalmaydi — podium faqat test ballari (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Davom ettirish sababi» · 5 — «2 — Birinchi qadam» · 8 — «Yakuniy — Katta qadam»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi; ustunlik tartibi — yuqoridan):
  - uch yo'nalish saqlangan va `suhbat === true`: **Olti oylik rejangiz yozildi va Mentor bilan ko'rildi.** (53)
  - uch yo'nalish saqlangan, `suhbat` `true` emas: **Rejangiz yozildi — Mentor bilan suhbat hali bo'lmagan.** (54)
  - 1–2 yo'nalish saqlangan: **Reja hali tugamagan: {n} / 3 yo'nalish.** (39)
  - birorta yo'nalish saqlanmagan: **Olti oylik reja hali yozilmagan.** (32)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; ta'riflar — T-042):
  - Bizda olti oylik reja uch yo'nalishdan iborat: mahsulot, ko'nikma va ish. (73)
  - Mahsulotda qaror bor — davom ettirish yoki to'xtatish; sababi son yoki yozuv bilan. (83)
  - Oylik maqsad — oy oxirigacha nimaga yetmoqchi ekaningiz. (56)
  - Sanasi bor, bir kunda qilinadigan aniq harakat — birinchi qadam. (64)
  - Sana o'tsa — sababini yozib, yangi sana qo'yasiz. (49)
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ota-onangiz · Nechta: uch birinchi qadam · Muddat: keyingi darsgacha
  - ① Rejangizni ota-onangizga ko'rsating: Ish yo'nalishidagi buyurtma, xat yoki ariza ular bilan kelishiladi. (104)
  - ② Uch birinchi qadamning sanasini telefoningiz kalendariga yozing. (64)
  - ③ Darsda qolgan qismni tugating: {holatga qarab — saqlanmagan yo'nalishlarni yozing · Mentor bilan suhbat vaqtini aniqlang}. Hammasi tugagan bo'lsa ③ ko'rinmaydi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Demo Day'ga tayyormisiz?» <!-- TAXMIN T20 -->
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): yakun sarlavhalari kalitdan yig'iladi: `yonalishlar.length`, `suhbat` (P-046). «Suhbat bo'ldi», lekin reja tugamagan — 3-holat (sarlavha suhbat haqida aytmaydi, rost qoladi). Uyga vazifada keyingi darslar va natijalar aytilmaydi (T-038).
  ① — ota-ona xabardorligi (TAQIQLAR 1, 3: buyurtmada pul, ariza) — majburiy, chunki Ish yo'nalishi shunga tayanadi; ② — yengil; ③ — faqat qolgan ish bo'lsa (sinf 14). «Kim bilan» — HwCard yorlig'i (13-Modul 11-dars bilan bir).
  «Demo Day'ga tayyormisiz?» — keyingi darsning nomi aynan (`00-NOMLAR.md`, DE-205); tayanch 9.13 bilan munosabati — TAYANCHGA SAVOL 9.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **Three Lines!** (2-ekran, uch karta birinchi urinishda) — Mentor gaplarini to'g'ri yo'nalishga qo'ydingiz (47)
- **Real Reason!** (3-ekran, 1-savol birinchi urinishda) — Davom ettirish uchun dalilli sababni topdingiz (46)
- **First Step!** (5-ekran, 2-savol birinchi urinishda) — Sanasi bor birinchi qadamni topdingiz (37)
- **Six Months!** (6-ekran, uch yo'nalish saqlanganda — bonus) — Rejangizni uch yo'nalishda yozib saqladingiz (44)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Six Months!, ish qilingan ekranda — P-048). 4-ekran (bitta tanlov), 7-ekran (suhbat — signal) va yakuniy savol nishonsiz. Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10 — 0; «My Plan!» band — olinmadi).
- ⚠️ «Nishon» — bu darsda faqat o'yin nishoni; rejadagi «oylik maqsad» shu sababli shunday nomlandi (TAYANCHGA SAVOL 3).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Davom ettirish sababi** — 1 Mahsulotda qaror bor: davom ettirish yoki to'xtatish. · 2 Qaror yonida sabab yoziladi. · 3 Sabab — son yoki yozuv: sanoq, yozma tasdiq, odamlar javobi.
  — Sinfga savol: Mahsulotingiz haqida qaysi son yoki yozuv sizda bor?
- **5 · Birinchi qadam** — 1 Oylik maqsad — oy oxirigacha nimaga yetmoqchi ekaningiz. · 2 Birinchi qadam uni boshlab beradi. · 3 U bir kunda qilinadi va sanasi bor.
  — Sinfga savol: Rejangizdagi birinchi qadam qaysi kuni?
- **8 · Katta qadam** — 1 Yakkama-yakkada rejangizni Mentor bilan ko'rasiz. · 2 O'zgarishni o'zingiz kiritasiz. · 3 Bir kunga sig'maydigan birinchi qadam kichraytiriladi.
  — Sinfga savol: Birinchi qadamingiz bir kunga sig'adimi?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bizda olti oylik reja nechta yo'nalishdan iborat? | Uchta: mahsulot, ko'nikma va ish <!-- TAXMIN T15 --> | Bu kursdagi shakl — mazmuni sizniki |
| Mahsulot yo'nalishida qanday qaror yoziladi? | Davom ettirish yoki to'xtatish — sababi bilan | Mentor misolida: davom ettiraman |
| Mahsulot qaroriga qanday sabab yoziladi? | Son yoki yozuv: sanoq, yozma tasdiq, odamlar javobi | Mentor misolida: uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas |
| Ko'nikma yo'nalishiga nima yoziladi? | Nimani o'rganishingiz | Mentor misolida: Backend testlari |
| Ish yo'nalishida qaysi uch yo'l bor? | Buyurtma, stajirovka yoki xalqaro dastur <!-- TAXMIN T13 --> | 10, 11-darsdagi rejangizdan |
| Oylik maqsad nima? | Oy oxirigacha nimaga yetmoqchi ekaningiz | Har yo'nalishga — oyiga bittadan |
| Birinchi qadam nima? | Sanasi bor, bir kunda qilinadigan aniq harakat | Mentor misolida: uch tashkilotchiga yozib, sinash kunini kelishish — shanba |
| Birinchi qadam sanasi o'tsa, nima qilinadi? | Sababi yoziladi va yangi sana qo'yiladi | Reja — va'da emas: o'zgarishi mumkin |
| 13-Moduldagi «keyingi 4 hafta» javobi rejaning qayeriga ko'chadi? | 1-oy maqsadiga | Mentor misolida — Mahsulot yo'nalishiga |
| Yakkama-yakka nima? | Mentor bilan bir o'quvchining suhbati | Bu darsda — 10 daqiqa, rejangiz haqida |
| Yakkama-yakkadan keyin rejani kim o'zgartiradi? | O'zingiz | Mentor savol beradi, qaror — sizniki |
| Buyurtmada pul va kelishuv kim orqali bo'ladi? | Ota-onangiz orqali | Birinchi buyurtma — tanish doiradan |
- §145: har javobdagi so'z darsda bor (uch yo'nalish — 2 · qaror, sabab, son yoki yozuv — 2, 3, 6 · ko'nikma, Ish yo'llari — 2, 6 · oylik maqsad — 4 · birinchi qadam — 4 · «sana o'tsa» — 6 · 13-Modul javobi — 4, 6 · yakkama-yakka — 1, 7 · ota-ona — 6).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q («Oylik maqsad nima?», «Birinchi qadam nima?», «Yakkama-yakka nima?» — atama → ta'rif). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md12/olchov.py` (pastda «O'lchov»).
1. Bu darsdagi olti oylik reja qaysi uch yo'nalishdan iborat? (58) (2)
   - ✔ Mahsulot, ko'nikma va ish (25)
   - Muammo, Bozor va Yechim (23)
   - Pitch, jonli demo va video (26)
   - Lending, ilova va Backend (25)
2. Mentor «Backend testlari»ni qaysi yo'nalishga qo'ydi? (53) (2)
   - Mahsulot — ilovaning o'zi uchun (31)
   - ✔ Ko'nikma — o'rganadigan narsa (29)
   - Ish — buyurtma yoki dastur uchun (32)
   - Hech qaysi — rejadan tashqari (29)
3. Mahsulot yo'nalishida qanday qaror yoziladi? (44) (2, 6)
   - Ilova rangini tanlash va nega (29)
   - Investordan qancha pul so'rash (30)
   - ✔ Davom ettirish yoki to'xtatish (30)
   - Kimdan va qachon baho olish (27)
4. Mahsulotni to'xtatish qarori haqida qaysi gap to'g'ri? (54) (2, 6)
   - To'xtatish — mag'lubiyat, yashiriladi (37)
   - To'xtatsangiz, ko'nikma ham to'xtaydi (37)
   - Faqat Mentor ruxsat bersagina bo'ladi (37)
   - ✔ Sababi bilan yozilsa, u ham qarordir (36)
5. Mentor mahsulotni davom ettirishiga qaysi sababni yozgan? (57) (2)
   - ✔ Uch tashkilotchining yozma tasdig'ini (37)
   - Mahalla guruhida 60 kishi borligini (35)
   - Ilovada funksiyalar juda ko'p ekanini (37)
   - Kimdir pul berishga va'da qilganini (35)
6. Oylik maqsad nimani aytadi? (27) (4)
   - Bir kunda qilinadigan aniq bitta harakatni (42)
   - ✔ Oy oxirigacha nimaga yetmoqchi ekaningizni (42)
   - Olti oy o'tgach bo'ladigan katta natijani (41)
   - Mentor sizga qo'ygan baho va uning izohini (42)
7. Birinchi qadamda qaysi ikki narsa bo'lishi kerak? (49) (4, 6)
   - Mentorning imzosi va tasdig'i (29)
   - Katta natija va uning narxi (27)
   - ✔ Aniq harakat va uning sanasi (28)
   - Do'stlar ismi va telefonlari (28)
8. Mentorning 1-oy maqsadi qayerdan ko'chdi? (41) (4)
   - 1-darsdagi Bozor bo'lagidan (27)
   - Demo stsenariysining oxiridan (29)
   - Diamond Challenge shartlaridan (30)
   - ✔ 13-Modul shaxsiy hisobotidan (28)
9. Birinchi qadam sanasi o'tdi, qilinmadi. Nima qilasiz? (53) (6)
   - ✔ Sababini yozib, yangi sana qo'yaman (35)
   - Baribir qilindi deb belgilab qo'yaman (37)
   - Rejaning hammasini o'chirib tashlayman (38)
   - Hech kimga aytmasdan, o'tib ketaman (35)
10. Yakkama-yakkada rejangiz bilan nima bo'ladi? (44) (7)
    - Butun sinfga proyektorda o'qib beriladi (39)
    - ✔ Mentor bilan ko'riladi, siz o'zgartirasiz (41)
    - Mentor uni o'zi boshqatdan yozib beradi (39)
    - Baholanadi va sinfda reyting e'lon qilinadi (43)
11. Birinchi buyurtmada pul va kelishuv kim orqali bo'ladi? (55) (6)
    - Buyurtmachining o'zi bilan, yolg'iz (35)
    - Sinfdoshingiz orqali, yashirin holda (36)
    - ✔ Ota-onangiz orqali, ular bilan birga (36)
    - Internetdagi notanish vositachi orqali (38)
12. Qaysi gap olti oylik rejaga to'g'ri yozilgan? (45) (4, 6)
    - 6-oy: ilovam hamma joyda mashhur bo'ladi (40)
    - 1-oy: hamma narsani o'rganib bo'laman (37)
    - 2-oy: qachondir bir narsani qilib ko'raman (42)
    - ✔ 1-oy: sinfda kitob almashishni boshlash (39)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (davom ettirish sababi — sanoq sahifasi) ↔ arena 5 (Mentor sababi — yozma tasdiq) · 5-ekran (qaysi biri birinchi qadam — juma kuni) ↔ arena 7 (birinchi qadamda nima bo'ladi) va 12 (rejaga qaysi gap) ·
  8-ekran (katta qadam — kichraytirish) ↔ arena 9 (sana o'tsa) va 10 (yakkama-yakkada nima bo'ladi).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004), har savolda uch xil turkum: 1 — pitch bo'laklari, dars artefaktlari, texnik qismlar · 2 — qolgan ikki yo'nalish va «rejadan tashqari» · 3 — dizayn, investitsiya (TAQIQLAR 1), baho · 4 — yashirish, noto'g'ri bog'liqlik, birovning ruxsati ·
  5 — Mentorning boshqa da'vosi (Bozor soni — rost, lekin sabab sifatida yozilmagan), funksiyalar ro'yxati, va'da · 6 — birinchi qadam bilan chalkashlik, olti oylik natija, baho · 7 — imzo, katta natija, shaxsiy ma'lumot · 8 — pitch, demo, dastur shartlari ·
  9 — yolg'on belgi, rejani tashlash, yashirish · 10 — ommaviy o'qish, qarorni berish, reyting · 11 — yolg'iz, yashirin, notanish (TAQIQLAR 1, 3) · 12 — va'da, mavhum katta gap, noaniq vaqt.
  Arena 5 B «60 kishi» — Mentor misolidagi rost son (tayanch 1.14), lekin u Bozor bo'lagi uchun; davom ettirish sababi — yozma tasdiq. Arena 12 to'rttalasi «N-oy: …» shaklida (belgi faqat to'g'rida emas).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — reja · yo'nalish · mahsulot · ko'nikma · ish · oylik maqsad · birinchi qadam · «sana» · yakkama-yakka · Maydon Jamoa · uyga vazifa banneri — reja · birinchi qadam · «sana». Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmNextStepsLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m12d12-v1` (14-Modul naqshi `pm-m12dN-v1`), `lessonTitle` — «Keyingi olti oyda nima qilasiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · test · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 5: 3, 8: 2 }; `yonalish: -1`, `qadam: -1` (2, 4-ekran — ballsiz; 2-ekranda nishon);
   6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 3, 5, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2 da `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s3/s5/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`OltiOyReja`** — bitta vizual (180; qolipda yo'q, yangi): qismlar `taxta` (3 qator × 6 ustun; qator nomi, chip — qaror yoki yo'l, kulrang qator — sabab yoki nima; katak — maqsad, bo'sh — uzuq; «Bugun» chizig'i; `bayroq` — sana kunining 1-oy ichidagi joyida) ·
   `telefon` («Maydon Jamoa», ≈170×272; «O'yin» ekrani — faqat s2) · `varaq` («13-Modul · shaxsiy hisobot», uch qator — faqat s4) · `muddat` (kulrang bayroq — `DC_MUDDAT` oyini kod bugungi sanadan aniqlaydi; olti oydan uzoq bo'lsa — o'ng chetda «›»).
   Rejimlar: `bosh` (s0) · `skelet` (s1) · `mentor` (s2, s4, s8 javobi, Mentor rejimi) · `oquvchi` (s6, s7) · `kichik` (s3, s5 javobi — ikkinchi misol) · `chiziq` (s6/s7 tepasi). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: oor-katak oor-qator oor-bayroq`).
   Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da: har yo'nalish alohida blok, oylar 3 × 2; telefon taxta ustida, kesilmaydi (E 41; DOM detektori bilan).
4. **Bitta manbalar (A-6 aynan):** `MENTOR_REJA` (3 × `{ tur, tanlov, gap (tayanch 1.12 aynan), sabab | nima, oylar: [6], birinchiQadam, kun: 'shanba' | 'yakshanba' | 'dushanba' }`) · `MENTOR_GAPLAR` (3 — tayanch 1.12, yo'nalish nomisiz; to'g'ri tugma) ·
   `MENTOR_13_JAVOB` (13-Modul tayanchi 1.11 — 3-javob aynan) · `QADAM_KARTALAR` (3 × `{ matn, qachon, tur: 'togri' | 'mavhum' | 'vada' }`) · `SUHBAT_SAVOL` (3) · `DC_MUDDAT` (`'2027-01-14'`, rasmiy — tayanch 1.11, 6).
   Mentor kunlari sanasi — `keyingiKun(kunNomi)` (dars kunidan keyingi shu nomli kun; kun.oy shaklida). Mentor rejimi, s0 (kalit bo'lsa), s2, s4, s6 (Yordam), s8 (javob vizuali) shulardan o'qiydi.
5. **s2** — `QBashorat` (Bittasi · Ikkitasi · Uchalasi; to'g'ri — bittasi) → 3 karta, uch tugma (Mahsulot · Ko'nikma · Ish), kalit `['mahsulot', 'konikma', 'ish']`; to'g'ri → karta qatorga uchadi, chip, kulrang qator, oylar (`MENTOR_REJA.oylar`), 3-kartada `muddat` bayrog'i;
   `QIzoh` 1-kartadan keyin (~3 s); `QXato` jadvali (2-ekran); natijada taxmin qatori + xulosa + oxirgi `QIzoh`; 40 s ipucha; nishon `threeLines`.
6. **s4** — `varaq` animatsiyasi (bir marta; `MENTOR_13_JAVOB` → Mahsulot 1-oy katagi) → `QADAM_KARTALAR` (3 ta bir vaqtda), to'g'ri → `bayroq` (`keyingiKun('shanba')`); `QXato` 2 turi (`tur` bo'yicha); xulosa + `QIzoh`; 40 s ipucha.
7. **s6** — o'qiydi `pm-m11d11-refleksiya.javoblar.keyingi`, `pm-m12d10-ish` (`buyurtma.kim`, `buyurtma.nima`, `buyurtma.qachon` — matn, `xatlar.length`), `pm-m12d11-dastur` (`dastur`, `maslahatchi`); uch karta ketma-ket; qaror va yo'l tugmalari; taklif tugmalari (takror bosish qo'shmaydi);
   maydonlar (yorliq ichida), kun tanlagich (`<input type="date">`, `min` — bugun; ⛔ telefon va laptop brauzerlarida sinaladi); tekshiruvlar (6-ekran ro'yxati: bloklaydigan va yumshoq; yumshoq — ikkinchi «Saqlash» o'tkazadi) —
   **PM-108 tartibida kamida 12 namuna bilan `node` da sinaladi** (masalan: «Sanoqda har hafta qaytganlar bor» o'tadi · «ko'p vaqt sarfladim» — yumshoq · «albatta mashhur bo'ladi» — yumshoq · «+998 90 …» bloklanadi · 81 belgili qadam bloklanadi · kecha sanasi bloklanadi · 40 kundan keyingi sana — yumshoq ·
   «Upwork'da profil» — yumshoq · «investor topaman» — yumshoq · «o'rganaman» yolg'iz — yumshoq · «Juma kuni uch sinfdoshga ko'rsataman» o'tadi; katta-kichik harf farqsiz). Saqlash → `pm-m12d12-reja.yonalishlar` (`tur` bo'yicha almashtiradi), `savedAt`. Ichki holat dars progressida (E 51).
8. **s7** — o'qiydi `pm-m11d11-refleksiya.ishlar` (`holat === 'uzoqroqda'`, `nom`, ko'pi bilan 3) va s6 natijasi; taxtadagi bo'sh katak → maydon (≤ 100) → `nishonlar[k]`; `SUHBAT_SAVOL`; «Suhbat bo'ldi» / «Navbatim kelmadi» → `suhbat`; «Rejani yangilayman» → s6 kartasi (o'sha tekshiruvlar);
   xulosa — uch holat. Ichki holat dars progressida (E 51).
9. **Mentor rejimi:** o'quvchilar ro'yxatida faqat signallar («Reja saqlandi» vaqti bilan — navbat · «Suhbat bo'ldi»; `PRACTICE_BASE`); suhbat taymeri 10:00 (12-Modul `TaymerChiziq` naqshi; faqat Mentor ekranida). Reja matni (sabab, nima, maqsadlar, qadam, sana) Mentorga ham, proyektorga ham uzatilmaydi. 0-ekrandagi sinf ovozlari — faqat variantlar soni.
10. Testlar s3/s5/s8 — `correctIdx` 1/3/2 = `INLINE_KEYS`; `RECAPS` {3, 5, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 5, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
11. `ACHIEVEMENTS` 4 (`threeLines`, `realReason`, `firstStep`, `sixMonths`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
12. s11 `QYakun`: sarlavha **to'rt holat** — `pm-m12d12-reja` (`yonalishlar.length`, `suhbat`) dan (P-046, E 54; ustunlik tartibi — 11-ekran); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50);
    `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③; ③ holatdan yig'iladi); `keyingi` — «Demo Day'ga tayyormisiz?». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
13. App.jsx `m12-12` qatoriga `comp: PmNextStepsLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 478-qator; osti haqida — TAYANCHGA SAVOL 10). Bu agent App.jsx ga tegmaydi.
14. **REPO — yo'q** (PM darsi; tayanch 3: `m14-dars-12-done` = `07-done`).
- Darvozalar: `npm run gates -- src/12-Modull/PmNextStepsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

## REPO
Yo'q — PM darsi; repo'ga yozilmaydi (tayanch 3: `m14-dars-08…13-done` = `07-done`). Reja matni repo'ga, GitHub'ga va boshqa joyga yuklanmaydi.

## Manbalar (08.10.2026; o'quvchiga ko'rinmaydi)
- Dars mazmuni — `00-MODUL-TAYANCH.md` **1.12** (aynan: uch yo'nalish, «oylik nishon va birinchi qadam sanasi», 13-Modul refleksiyasi o'qiladi, «Mentor bilan 10 daqiqa», Mentor misoli) · 1.10 (buyurtma — tanish doira, pul — ota-ona orqali; xat — bitta kompaniyaga bitta; Upwork — «odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing») ·
  1.11 (Diamond Challenge: maslahatchi, ariza, topshirish muddati **14.01.2027** — rasmiy) · 1.1, 1.14 (uch yozma tasdiq va «bu hali to'lov emas»; Bozor — «Boshqa mahallalarni hali tekshirmaganmiz.»; so'rov — «mahalladagi maydon egalari bilan tanishtiring») · 2 · 4 · 7 · 8 · 9 (9.13 — Demo Day).
- **Diamond Challenge** — tayanch 6 va `00-MANBA.md` 5 (diamondchallenge.org/competition, 08.10.2026; muddat «January 14, 2027 (5PM EST)»). Bu darsda yangi tashqi fakt yo'q; tashqi sahifa ochilmadi.
- **Upwork** — rasmiy matn tekshirilmagan (`00-MANBA.md` 5: sahifa 403); darsda faqat tayanch 1.10 dagi «odatda 18 yoshdan; … saytning o'zidan o'qing» (yumshoq tekshiruv matnida qisqa).
- 13-Modul: tayanch 1.4 (to'lov taklifi ekrani matni — «Doimiy o'yin — Pro'da», «Test rejim: pul yechilmaydi»; bu darsda telefonda faqat «O'yin» ekrani) · **1.11** (Mentorning 3-javobi aynan) · 8 (`pm-m11d11-refleksiya` sxemasi: `javoblar: { qarorim, notogri, keyingi }`, `ishlar[].holat` — `'uzoqroqda'`) · `11-PmReflection-v3.md` A-4 («uzoqroqda qoldi» ta'rifi) · `11-FILTR.md` 9, 22.
- 11-Modul `15-PmOneOnOne-v3.md` (A-3 «qadam» ta'rifi, A-8 yakkama-yakka tartibi) + `15-FILTR.md` 23 (12–15 kishi — vaqt) · 10-Modul `01-PmOkr-v3.md` («maqsad», «oylik maqsad» sarlavhasi) · 12-Modul tayanchi 2 («sanoq sahifasi», «qaytganlar foizi»), 9.43 a («dalil — son yoki yozuv»).
- Menyu — App.jsx 477–479 (grep 08.10): `m12-11` → `m12-12` «Keyingi olti oyda nima qilasiz?» (osti «Mentor bilan yakkama-yakka: shaxsiy reja») → `m12-13` «Demo Day'ga tayyormisiz?».
- Ekran yozish, kalendar ilovasi, kun tanlagich — umumiy so'z; tugma va menyu nomlari yozilmadi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ⛔ **Yakkama-yakka 10 daqiqa va sinf hajmi** — tayanch 1.12 «Mentor bilan 10 daqiqa». 12–15 kishilik sinfda 2–2,5 soat; bitta darsda ≈ 4 kishi. MD da: dars ichida navbat bilan (6-ekranni birinchi saqlaganlardan), qolganlar — «Navbatim kelmadi», vaqtni Mentor belgilaydi.
   Taklif — tanlov kerak: **(A)** shunday (10 daqiqa, navbat, qolganlar — Mentor belgilagan vaqtda; MD shu) · **(B)** dars ichida hammaga 4 daqiqadan (11-Modul 15-dars naqshi), 10 daqiqalik suhbat — keyin, ixtiyoriy · **(C)** dars ikki guruhga: yarmi 12-darsda, yarmi 13-dars oldidan. Tayanch 1.12 ga bir gap kerak.
2. **`pm-m12d12-reja` sxemasiga qo'shimchalar** (A-11): `tanlov` (mahsulot — `'davom' | 'toxtataman'`; ish — `'buyurtma' | 'stajirovka' | 'dastur'`) · `nima` (ko'nikma, ish) · `sabab` (mahsulot — tayanch 1.12 «+ sabab») ·
   `nishonlar` — `[string | null]` (6 o'rin, oy o'rni saqlanadi; tayanchda `[string] (≤6)`) · `suhbat: true | false | null`. Sabab: tayanch sxemasida mahsulot qarori va sababi, Ish yo'li va suhbat belgisi yo'q — yakun sarlavhasi va 7-ekran ularga tayanadi. Tayanch 8 ga qo'shishni taklif qilaman.
3. **«Nishon» → o'quvchi matnida «oylik maqsad»** — tayanch 1.12 va 2: «oylik nishon». Bu darsda o'yin nishonlari bor («Nishonlaringiz — n/4», «nishon sizniki») — bitta so'z ikki ma'noda bo'lardi (T-015). «Maqsad» — 10-Modul 1-darsidagi so'z (u yerda raqamsiz edi; bugun maqsadda son bo'lishi mumkin — «uch tashkilotchi»; 12-Modulda ham «maqsad 50»).
   Kalit maydoni `nishonlar` o'zgarmadi (faqat kodda). Ta'rif meniki: «oy oxirigacha nimaga yetmoqchi ekaningiz». Tayanch 2 jadvaliga qo'shishni taklif qilaman.
4. **Oylik maqsadlar soni** — tayanch: «har yo'nalishga oylik bitta nishon». MD da: 1-oy majburiy (6-ekran), 2–6-oy — ixtiyoriy (7-ekran, kutayotganda). Sabab: 18 katak + uch qadam + sana 25 daqiqaga sig'maydi; yaqin oy aniqroq. Muqobil: 1-oy va 6-oy majburiy.
5. **Mentor misolidagi yangi tafsilotlar** (A-6; tayanch 1.12 da faqat uch gap bor): mahsulot sababi («Uch tashkilotchi yozma tasdiq berdi — bu hali to'lov emas.» — 1.1 Raqamlar gapidan) · 1-oy maqsadlari (mahsulot — 13-Modul 3-javobidan; ko'nikma; ish) · 3-oy va 4-oy (1.1 so'rov va Bozor gapidan) ·
   uch birinchi qadam · kunlar (shanba · yakshanba · dushanba). Yangi son yo'q. Ish yo'nalishi — 11-dars Mentor holatining davomi (jamoa, maslahatchi, ro'yxat — 11 MD A-6 aynan); buyurtma namunasi — 10 MD `MENTOR_BUYURTMA` aynan (A-6). Tayanch 1.12 ga qo'shishni taklif qilaman — 13-darsda reja tilga olinsa, bir xil bo'lsin.
6. **«Keyingi 4 hafta» javobi — Mahsulot 1-oy maqsadiga** (taklif tugmasi bilan; o'quvchi o'zi qo'yadi yoki boshqa yo'nalishga yozadi). Tayanch: «javobi shu yerga ko'chadi» — qaysi yo'nalishga ekani aytilmagan; 13-Modul savoli mahsulot haqida edi.
7. **Qo'shimcha o'qish:** `pm-m11d11-refleksiya.ishlar` (`holat: 'uzoqroqda'` nomlari) — 7-ekran kulrang qatori (bo'sh oylar uchun material). Tayanch 4 jadvalida faqat kalit nomi; maydon — 13-Modul tayanchi 8 dan.
8. **10, 11-dars kalitlari** — parallel yozilgan MD lar tayanch 8 sxemasini aynan oldi (04:00 da o'qidim: 10 MD A-14 — `buyurtma.kim` rol ≤40, `.nima` ≤80, `.qachon` gaplashish kuni, matn ≤40; 11 MD A-13 — `dastur`, `maslahatchi: bool | null`). `qachon` — matn: taklif tugmasida ko'rinadi, sanaga aylantirilmaydi (birinchi qadam sanasini o'quvchi o'zi tanlaydi). Sxema keyin o'zgarsa — bu dars o'qishi moslanadi.
9. **«Demo Day» va tayanch 9.13** — 9.13: «faqat 13-darsda … va yakundagi «Keyingi dars» qatorida emas; 1–12-darslarda — «hakamlar oldida chiqish»». 12-dars yakunidagi «Keyingi dars — «Demo Day'ga tayyormisiz?»» — keyingi darsning nomi (`00-NOMLAR.md`, DE-205, MD_TOPSHIRIQ_2 12-qator).
   MD da shu nom aynan (boshqa joyda «Demo Day» yo'q). 9.13 «Keyingi dars» qatorini ham taqiqlasa — 13-dars nomini o'zgartirish yoki bu qatorni istisno qilish kerak.
10. **Menyu osti «shaxsiy reja»** (App.jsx 478) va atama «olti oylik reja» (tayanch 2) — bir narsaga ikki nom (T-014). Reja ekranida osti so'zma-so'z (P-015). Taklif: osti — «Mentor bilan yakkama-yakka: olti oylik reja» (App.jsx va `00-NOMLAR.md` — asosiy seans).
11. **Suhbatdagi uch savol** (`SUHBAT_SAVOL`) — mening matnim: qaysi yo'nalish birinchi · birinchi qadamda kim yordam beradi · birinchi qadam bir kunga sig'adimi. Tayanchda suhbat mazmuni yo'q.
12. **Reja matni Mentor ekraniga uzatilmaydi** — o'quvchi o'z ekranida ko'rsatadi (13-Modul 11-dars TS 18 naqshi; maxfiylik va jonli mexanizm sinalmagani). Muqobil — 11-Modul 15-dars «Mentor varag'i» (jonli; sinalmagan).
13. **«Birinchi qadam» ta'rifi** — «Sanasi bor, bir kunda qilinadigan aniq harakat» (mening matnim; 11-Modul 15-darsidagi «qadam — bitta aniq ish» bilan ko'prik). «ish» o'rniga «harakat» — bu darsda «Ish» yo'nalish nomi (T-015).
14. **Sana chegaralari** (kod qoidasi): o'tgan kun — bloklaydi; 31 kundan keyin — yumshoq («birinchi qadam — birinchi oyda»). Tayanchda chegara yo'q.
15. **«Bizda olti oylik reja uch yo'nalishdan iborat»** — kurs qolipi (sinf 4); tayanch 2 ta'rifi («uch yo'nalish, oylik nishon va birinchi qadam sanasi») ikki bosqichda ochiladi (2, 4-ekran).
16. **Diamond Challenge muddati qatori** (2, 6, 7-ekran) — rasmiy sana (tayanch 1.11). Ish yo'li «Xalqaro dastur» bo'lsa ko'rinadi; «qabul qilinasiz» yoki «ulgurasiz» deyilmaydi.
17. **Uyga vazifa ①** — rejani ota-onaga ko'rsatish (TAQIQLAR 1, 3: buyurtmada pul, ariza — ota-ona bilan). Ixtiyoriy emas deb yozdim (Ish yo'nalishi shunga tayanadi); foydalanuvchi ixtiyoriy desa — «Kim bilan» yorlig'i o'zgaradi.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — 6-ekran ≈ 25, 7-ekran ≈ 22 (yakkama-yakka shu paytda). Reja — «qur» pilotida 12–15 o'quvchi bilan taymer bilan o'lchanadi.
2. ⛔ **Yakkama-yakka sig'imi** (TAYANCHGA SAVOL 1) — «Navbatim kelmadi» qatori «Mentor boshqa vaqtni kelishadi» deydi: bu darsning va'dasi emas, o'qituvchiga topshiriq (O'qituvchi eslatmasi). Mentor buni qilmasa — qator yolg'on bo'lib qoladi.
3. ⛔ **Kun tanlagich** (`<input type="date">`) — telefon va laptop brauzerlarida ko'rinishi har xil; «qur» da sinaladi. Muqobil — kun chiplari («Shu hafta: dushanba … yakshanba»).
4. **«test» so'zi** — Mentor gaplarida ikki ma'noda: «Backend testlari» (tayanch aynan) va «test rejim» (13-Modul atamasi). O'quvchi ballik savollarni «savol» deb ko'radi. Auditor T-015 deyishi mumkin — Mentor gaplari aynan qoldi.
5. **2-ekran sortirovkasi oson** — gaplar yo'nalish nomisiz, lekin taxminiy: «Backend testlari» va Diamond Challenge Mahsulotga adashib qo'yilishi mumkin (xato izohlari shunga yo'naltirilgan). Bashorat («nechtasi mahsulot haqida») — asosiy chalkashlik.
6. **Mentor misolida bo'sh oylar** — tayanch «oylik bitta nishon» deydi, Mentor misolida 2, 5, 6-oy (mahsulot) va 2–6-oy (ko'nikma, ish) bo'sh. Auditor «namuna to'liq emas» deyishi mumkin; to'ldirilsa — yangi tafsilot to'qiladi (TAYANCHGA SAVOL 4, 5).
7. **«jamoa» Mentor gapida** («Diamond Challenge'ga jamoa bilan konsept») — tayanch aynan; tayanch 2: «jamoa» prozada futbol ma'nosida yo'q, bo'lak — bosh harf. Bu yerda — dastur jamoasi (uchinchi ma'no), faqat olam matnida.
8. **Diamond Challenge nomi matnda** — maket emas (TAQIQLAR 0 brend qoidasi asosan keyslar va «Maydon Jamoa» uchun). Kulrang bayroq va chipda — matn.
9. **Yumshoq tekshiruv so'zlari** (va'da, sarflangan vaqt, dalil so'zlari, «Upwork») — erkin matnda adashishi mumkin; bloklamaydi. `node` sinovida namunalar bilan.
10. **3-ekran B** («Sanoq sahifasida har hafta qaytganlar bor») — 12-Modul atamalari; o'quvchi o'z mahsulotida sanoq sahifasi bo'lmasligi mumkin (savol ikkinchi misol haqida).
11. **Arena 5** — to'g'ri javob Mentor misolidan eslash (sabab — yozma tasdiq); B «60 kishi» rost son — «sabab sifatida yozilganmi» degan savol bilan himoyalangan.
12. **«To'xtataman»** — o'quvchi mahsulotini shu modul oxirigacha ko'rsatadi; to'xtatish keyingi olti oy haqida (O'qituvchi eslatmasi). O'quvchi buni hozir to'xtatish deb tushunishi mumkin — ekranda alohida aytilmadi (Demo Day va'da qilinmaydi).
13. **Uyga vazifa ②** — «telefoningiz kalendari»: telefonsiz yoki kalendarsiz o'quvchi — qog'ozga yozadi (aytilmadi).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-10 taqsimot va ulgurmagan yo'l (6-ekran — har karta alohida saqlanadi, qolgani uyga ③; 7-ekran — bo'sh oylar ixtiyoriy, «Navbatim kelmadi»); ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi; tashqi kutish yo'q.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — kun tanlagich (Shubhali 3), yakkama-yakka sig'imi (Shubhali 2) — ⛔; Upwork — faqat tayanch 1.10 so'zi bilan; Diamond Challenge — faqat rasmiy muddat; kalendar — umumiy so'z, tugma nomi yo'q.
3. [x] **Saqlash kaliti — shartnoma** — A-11: tayanch 8 sxemasi + qo'shimchalar (TAYANCHGA SAVOL 2), har maydon, tipi, `suhbat` uch holati, `nishonlar` o'rni, kim yozadi (6, 7-ekran); ism, telefon, akkaunt, xodim ismi yozilmaydi; boshqa darsning kaliti faqat o'qiladi; kalit yo'q bo'lsa — nima bo'lishi yozilgan.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Bizda olti oylik reja …» (2-ekran, yakun, kartochka 1), «Mentor misolida» (2, 4, 6-ekran Yordam, kartochkalar), «Bu kursdagi shakl — mazmuni sizniki» (kartochka 1 izohi); Mentor misoli — faqat «Yordam»da (6-ekran).
5. [x] **Kafolat va sabab da'vosi yo'q** — reja — va'da emas (sana o'tsa — yangi sana; 6-ekran, yakun, kartochka 8, arena 9); «mashhur bo'ladi», «katta bo'laman» — faqat noto'g'ri variantlarda va yumshoq tekshiruvda; Diamond Challenge — «qabul qilinasiz» yo'q; «yozma tasdiq — bu hali to'lov emas».
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun to'rt holat, «hech narsa» holati alohida (11-ekran; E 54); «Suhbat bo'ldi», lekin reja tugamagan — «hali tugamagan»; 7-ekran xulosasi — uch holat; «Six Months!» faqat uch yo'nalish saqlanganda; nishon tavsiflari qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — birinchi qadam — «sanasi bor, bir kunda» (tekshiruv: sana majburiy, 31 kun yumshoq); oylik maqsad — 1-oy majburiy; mahsulot sababi — son yoki yozuv (yumshoq tekshiruv); «Rejam · n/3» — yo'nalishlar soni.
8. [x] **Test: bitta himoyalanadigan javob** — 3, 5, 8-ekran va arena: distraktorlar uch xil turkumdan (Kalit va arena izoh qatorlari), hayotda rost bo'lib qoladigan variant yo'q (8-ekran B — «juda katta ekani bilindi» bilan himoyalangan; arena 4 — «kurs tugaguncha to'xtatib bo'lmaydi» olinmadi), inkor-savol yo'q, to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] **Real odamlar xavfsizligi** — reja Mentor ekraniga va proyektorga chiqmaydi (7-ekran, KOD 9); sinfda solishtirilmaydi, sanalmaydi (0, 7, 9-ekran); telefon va akkaunt bloklanadi; Ish yo'nalishi — tanish doira, ota-ona, bitta xat, maslahatchi (6-ekran); uyga vazifa ① — ota-ona; o'quvchi Mentor nomidan tasdiqlamaydi («Suhbat bo'ldi» — o'z belgisi).
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — agent va tekshiruv akkaunti yo'q (PM darsi); rejani o'quvchi o'zi yozadi va o'zi o'zgartiradi (7-ekran, 8-ekran testi).
11. [x] **Web-trek teng yo'l** — PM darsi, blok yo'q; «mahsulot» so'zi (A-13); kalitlar ikkala trekda bir; trek kaliti o'qilmaydi.
12. [x] **Mentor misoli ichki izchil** — Mentor gaplari tayanch 1.12 aynan; 1-oy maqsadi — 13-Modul 3-javobining davomi (A-6); sabab — 1.1/1.14 halol gapi; 3, 4-oy — 1.1 dagi so'rov va Bozor gaplari; yangi son yo'q; keyingi darslar natijasi ochilmaydi; yangi tafsilot — TAYANCHGA SAVOL 5.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — qaror, sabab, maqsad, qadam va uning sanasi — o'quvchida; Mentor misoli — «Yordam»da; 7-ekran: Mentor savol beradi, o'quvchi o'zgartiradi; 8-ekran va arena 10 shu haqida.
14. [x] **Uyga vazifa yengil va aniq** — uch band; ① va ② — qisqa; ③ faqat qolgan qism bo'lsa; muddat — keyingi darsgacha; loyiha kuni emas.
15. [x] **Ayb da'vosi yo'q** — xato izohlari savol va harakatga chaqiradi; «To'xtatish ham — qaror», uyaltirilmaydi (6-ekran, O'qituvchi eslatmasi); «xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — keyingi darslar ekranda aytilmaydi (faqat «Keyingi dars» qatorida nomi); reja — niyat, va'da emas; «olti oyda katta bo'lasiz» yo'q (faqat noto'g'ri variantda).
17. [x] **Pul va investitsiya** — investitsiya so'ralmaydi (yumshoq tekshiruv, 6-ekran); real pul — «ota-ona roziligi va yuridik shaxs bilan»; «Doimiy o'yin» — test rejimda, «bu hali to'lov emas»; buyurtmada pul — ota-ona orqali (6-ekran, arena 11, kartochka 12).
18. [x] **Yosh va rasmiy shartlar** — Upwork kabi saytlar — «odatda 18 yoshdan» (yumshoq tekshiruv; aniq yosh da'vo qilinmaydi); Diamond Challenge — faqat rasmiy muddat (tayanch 1.11, 6); YC va lokal grantlar — tilga olinmaydi.
- [x] **RAD etilganlar (qayta ochilmaydi):** hook javobida «Qiziq fikr!» (0-ekran; bitta to'g'ri javob yo'q — «Aynan!» yo'q, J-026) · yakundagi «Keyingi dars — «…»» qatori (11-ekran) · Reja sarlavhasi — natija-gap (1-ekran) · ekranda ≤3 blok · keyssiz.
- [x] **12-Modul SABOQ E:** har variantning o'z chegarasi (E 40) · maketda hech narsa kesilmaydi (E 41) · taxmin qatori yashil xulosa ichida (2-ekran, E 42) · yorliq input ichida (6, 7-ekran, E 43) · bittadan karta (2, 6-ekran — E 53) · yakun standarti (E 50) · sarlavha har holatda rost (E 54).

## O'lchov
`md12/olchov.py` natijasi (qavsdagi sonlar skript bilan qo'yilgan: har sanaladigan matn belgilab olinib, uzunligi avtomatik yozildi):
```
Belgilar soni — bo'shliq bilan, ** siz (Python len). Qavsdagi uzunliklar: 185 ta — hammasi skript qo'ygan, qo'lda son yozilmagan.
Sarlavhalar (yakunning 4 holati va platforma sarlavhasi bilan): 11 ta · 25–54 · ≤55
Xulosalar: 6 ta · 53–76 · ≤110
Hook javoblari: 3 ta · 87–87 · ≤120
Hook variantlari: 3 ta · 29–31
To'g'ri izohlar: 3 ta · 41–59 · ≤60
Xato izohlari, QXato, ipucha, tekshiruv xabarlari: 36 ta · 24–59 · ≤60
QIzoh qatorlari: 3 ta · 65–83 · ≤110
Kulrang qatorlar, placeholder, savollar, uyga vazifa: 26 ta · 18–104
Nishon tavsiflari: 4 ta · 37–47 · ≤48
Endi siz bilasiz: 5 ta · 49–83
Bugungi asosiy fikr (A-2): 1 ta · 94–94 · ≤110
Hook variantlari: [29, 29, 31] | min/max +7%
Mentor gaplari: 0-ekran 2 gap (116) · 1-ekran 2 gap (119) · 2-ekran 1 gap (77) · 4-ekran 1 gap (69) · 6-ekran 1 gap (86) · 7-ekran 1 gap (102)
Sarlavha so'zlari (4+ harf) Mentorda: 0: 0/5 · 1: 1/6 · 2: 0/4 · 4: 0/6 · 6: 0/5 · 7: 1/5 — hech qayerda ≥50% bo'lmasligi kerak
Ekran test savollari: so'z soni [9, 11, 9] · ≤12
Arena savollari: so'z soni [9, 6, 5, 7, 7, 4, 7, 5, 7, 5, 8, 7] · ≤12
3-ekran: 39 · ✔41 · 42 · 38 | min/max 38/42 (+11%) | o'rtachadan og'ish 5%
5-ekran: 42 · 42 · 45 · ✔43 | min/max 42/45 (+7%) | o'rtachadan og'ish 5%
8-ekran: 45 · 46 · ✔45 · 44 | min/max 44/46 (+5%) | o'rtachadan og'ish 2%
4-ekran kartalari: 61 · ✔59 · 55 | min/max 55/61 (+11%) | o'rtachadan og'ish 6%
arena 1: ✔25 · 23 · 26 · 25 | min/max 23/26 (+13%) | o'rtachadan og'ish 7%
arena 2: 31 · ✔29 · 32 · 29 | min/max 29/32 (+10%) | o'rtachadan og'ish 6%
arena 3: 29 · 30 · ✔30 · 27 | min/max 27/30 (+11%) | o'rtachadan og'ish 7%
arena 4: 37 · 37 · 37 · ✔36 | min/max 36/37 (+3%) | o'rtachadan og'ish 2%
arena 5: ✔37 · 35 · 37 · 35 | min/max 35/37 (+6%) | o'rtachadan og'ish 3%
arena 6: 42 · ✔42 · 41 · 42 | min/max 41/42 (+2%) | o'rtachadan og'ish 2%
arena 7: 29 · 27 · ✔28 · 28 | min/max 27/29 (+7%) | o'rtachadan og'ish 4%
arena 8: 27 · 29 · 30 · ✔28 | min/max 27/30 (+11%) | o'rtachadan og'ish 5%
arena 9: ✔35 · 37 · 38 · 35 | min/max 35/38 (+9%) | o'rtachadan og'ish 5%
arena 10: 39 · ✔41 · 39 · 43 | min/max 39/43 (+10%) | o'rtachadan og'ish 6%
arena 11: 35 · 36 · ✔36 · 38 | min/max 35/38 (+9%) | o'rtachadan og'ish 5%
arena 12: 40 · 37 · 42 · ✔39 | min/max 37/42 (+14%) | o'rtachadan og'ish 6%
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```

## TAXMIN belgilari
Jami 32 ta `<!-- TAXMIN … -->` belgisi, 32 ta Tn-ishorasi (Tn · bo'lim). Qaror-0 javobi boshqacha bo'lsa — aynan shu joylar tuzatiladi.
- **T3** (2) — A. Darsning tayanchi — tushunchalar, atama · 6 · Rejangiz
- **T13** (7) — 14-Modul (kod: `src/12-Modull`) · 12-dars  · A. Darsning tayanchi — tushunchalar, atama · 6 · Rejangiz · Kartochkalar (12) — 10-ekran
- **T14** (4) — A. Darsning tayanchi — tushunchalar, atama · 2 · Uch yo'nalish · 6 · Rejangiz
- **T15** (12) — A. Darsning tayanchi — tushunchalar, atama · Darsning ipi va bitta vizual · 2 · Uch yo'nalish · 4 · Birinchi qadam · 6 · Rejangiz · 7 · Mentor bilan yakkama-yakka · Kartochkalar (12) — 10-ekran
- **T19** (2) — A. Darsning tayanchi — tushunchalar, atama
- **T20** (5) — 14-Modul (kod: `src/12-Modull`) · 12-dars  · 0 · Kirish · 1 · Reja · 11 · Dars yakuni

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 477–479 (grep 08.10) — `m12-11` «Qaysi xalqaro dasturga ariza berasiz?» → **`m12-12` «Keyingi olti oyda nima qilasiz?»** (osti «Mentor bilan yakkama-yakka: shaxsiy reja» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m12-13` «Demo Day'ga tayyormisiz?» (yakundagi «Keyingi dars» qatori; TAYANCHGA SAVOL 9). 0-ekran sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» Mentorining olti oylik rejasi (tayanch 1.12; 13-Modul 1.11 javobi); ikkinchi misol faqat testlarda (uy vazifalari, kitob almashish — P-002); keyssiz; metafora yo'q; bitta vizual — `OltiOyReja` (taxta · telefon 2-ekranda · 13-Modul varag'i 4-ekranda).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → gap qatorga uchadi, chip va oylar yoziladi), 4 (13-Modul javobi katakka uchadi; karta → bayroqcha 1-oyga tushadi) + 0, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md12/olchov.py`): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi ≤60 · nishon ≤48 — «O'lchov» bo'limi.
- [x] Atamalar oldingi darslar bilan bir (grep, A-3): yakkama-yakka, qadam — 11-Modul 15-dars · maqsad — 10-Modul 1-dars · dalil, sanoq sahifasi, qaytganlar — 12-Modul · shaxsiy hisobot, «uzoqroqda qoldi», Pro, «Doimiy o'yin», test rejim, yozma tasdiq — 13-Modul · buyurtma, stajirovka, xalqaro dastur, maslahatchi, ariza — 10, 11-dars ·
  yangi: yo'nalish, olti oylik reja, oylik maqsad, birinchi qadam — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («Davom ettiraman», «To'xtataman», «Saqlash», «Suhbat bo'ldi», «Navbatim kelmadi», «Rejani yangilayman»). ⚠️ «nishon» → «oylik maqsad» — TAYANCHGA SAVOL 3.
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (O'lchov); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 3-ekran B, 5-ekran D, 8-ekran C (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari yo'q (o'quvchi matnida 0; «albatta» — faqat tekshiruv ro'yxatida va meta bo'limlarda) · xulosalar «Bizda», «Mentor misolida» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-12`, «A1», «Modul 14», K-raqam, «keys», «pilot», «nishon» reja ma'nosida yo'q; modul raqami LMS bo'yicha — «13-Modulda»; dars raqami — «10-darsdagi», «11-darsdagi»); «KOD» ro'yxati 14 band, REPO — yo'q.
- [x] Karta T · P · S · PM: T-002 (prompt yo'q) · T-008 (Mentor gaplari, 13-Modul javobi, Mentor kartalari — olam matni) · T-011/PM-030 (yo'nalish va olti oylik reja — 2-ekran oxirida; oylik maqsad va birinchi qadam — 4-ekranda harakatdan keyin) · T-014/T-015 (A-5: ish, maqsad, qadam, test, jamoa, tanlov, nishon) ·
  T-016/T-017 (metafora yo'q) · T-024 · T-029/T-047 · T-038 · T-039 («rejangiz» — 6-ekranda yoziladi) · T-042 (ta'riflar so'zma-so'z: 2, 4-ekran, yakun, kartochka) · T-043 («Mentor misolida», «Bizda») · T-045 · T-048 · T-049 · T-052 (qadam, maqsad, yakkama-yakka ko'priklari) · T-064 · T-070 ·
  P-001 · P-002 · P-004 (6, 7 — o'z rejasi) · P-008 · P-010 · P-012 (testlar 3, 5, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-021 (taklif tugmalari — o'z ishidan) · P-025 · P-026 (kalit yo'q bo'lsa — o'zi yozadi) · P-033 · P-036 · P-046 · P-048 · P-052 · P-062 · P-064 · P-067 ·
  S-001 (savollar 4–10 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 · S-026 · S-027 · §106 · §119 · §144/§145 · PM-005 (2-tur) · PM-018 · PM-021 · PM-027 · J-026 (hook ballsiz) · SABOQ 1–39, E 40–55.
- [x] Halollik va xavfsizlik (TAQIQLAR 1, 3): reja shaxsiy (Mentor ekraniga chiqmaydi); investitsiya so'ralmaydi; buyurtmada pul — ota-ona orqali; xat — bitta kompaniyaga bitta; ariza — maslahatchi bilan; Upwork — «odatda 18 yoshdan»; va'da yo'q.
- [ ] ⛔ «qur» darvozalari ochiq: yakkama-yakka sig'imi (TAYANCHGA SAVOL 1, Shubhali 2), kun tanlagich (Shubhali 3), 90 daqiqa (Shubhali 1); TAYANCHGA SAVOL 2 (kalit qo'shimchalari) va 3 («oylik maqsad») — qaror kerak.
