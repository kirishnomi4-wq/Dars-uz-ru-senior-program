# 13-Modul · 10-dars «Loyiha kuni: taklif havolasi va mukofot» — MD v3 (yangi dars, loyiha kuni qolipi)

Fayl: `src/11-Modull/ReferralDayLesson.jsx` (kalit `m11-10`, App.jsx `type: 'Proyekt'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni, keyssiz (Qaror-0 21). Qolip: QKirish · QReja · QTushuncha ×2 · QTest ×2 · QBlok ×3 · podium · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx 453–455): `m11-09` «Kim haqiqatan to'lashga tayyor?» → **`m11-10` «Loyiha kuni: taklif havolasi va mukofot»** (osti «unikal havola, sanoq va mukofot») → `m11-11` «Mahsulotingiz hozir qayerda?».
Namuna (tuzilish, hajm): 12-Modul `09-RetentionDay-v3.md` + `09-FILTR.md` (loyiha kuni shakli, tekshiruv yozuvlarini o'chirish, «kodda bor, telefonda tekshirilmagan») · 10-Modul `02-EventTracking-v3.md` + `02-FILTR.md` (sanoq: o'lchov birligi, Umami va o'z jadvalimiz bir o'lchov emas) · pilot `03` (13-Modul blok shakli) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · ko'p elementli mashq ketma-ket (bir vaqtda bitta karta — E 53) · odam chizilsa — real ko'rinishda (SABOQ 36; bu darsda odam chizilmaydi).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** · 7-ekran **A** · final tartib-mashqi yo'q (loyiha kuni, 172) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2 ≈ 7 · Amaliyot 1 ≈ 20 · 4 ≈ 2 · 5 ≈ 6 · Amaliyot 2 ≈ 16 · 7 ≈ 2 · Amaliyot 3 ≈ 25 · podium, kartochkalar, yakun, arena ≈ 7 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (uch blokda uch Render kutishi; 3-amaliyotda brauzer ko'rinishini yangilash va ikki tekshiruv akkaunti); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 12.
⚠️ **Pul chegarasi (TAQIQLAR 1, Qaror-0 15):** mukofot — pul ham, chegirma ham emas: **test rejimdagi Pro muddati** (Pro'ning bepul haftasi). Bu darsda to'lov sahifasi, to'lov taklifi ekrani va «mashq to'lov» ishlatilmaydi; karta ma'lumoti hech qayerda yozilmaydi va chizilmaydi.
⚠️ **Real odamlar (TAQIQLAR 3, Qaror-0 16):** havola faqat tanish doiraga; «do'stingni taklif qil — sovg'a» kabi bosim yo'q; sinfda kim nechta odam taklif qilgani sanalmaydi; darsdagi tekshiruv — tekshiruv akkauntlari bilan, keyin «Hisobni o'chirish» bilan o'chiriladi.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.10):** dars oxirida o'quvchining o'z repo'sida **taklif havolasi, sanoq va mukofot ishlaydi**: har hisobning o'z taklif kodi (6 belgi) va havolasi · havola ochgan sahifa taklif kodini ko'rsatadi ·
   ro'yxatdan o'tish formasida «Taklif kodi (bo'lsa)» → yangi hisobda taklif qilgan yoziladi · sanoq (Umami — tashrif, Database — hisob) · mukofot faqat qoidaga mos taklif uchun (yangi hisob asosiy harakat qilgach; bir qurilma va namuna hisob sanalmaydi; haftasiga ko'pi bilan 2).
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m13-dars-10-start` (= `m13-dars-09-done` = `m13-dars-08-done`) → `m13-dars-10-done` (tayanch 3, aynan). Saqlanadigan yangi kalit yo'q (tayanch 8: loyiha kunlari 8, 10, 12 yangi kalit yozmaydi).
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** Har foydalanuvchining o'z taklif havolasi kim kimni taklif qilganini ko'rsatadi; mukofot — pul emas — faqat qoidaga mos taklif uchun beriladi, bir haftalik kichik son esa o'sishni isbotlamaydi.
3. **Oldingi darslardan keladigan narsa (aynan):**
   - 12-Modul 6-darsi (tayanch 1.6): havola oxiridagi kanal belgisi `?kanal=…` — lending uni o'qib, Umami'ga `tashrif` yozuvini kanal bilan yuboradi (kanal bo'yicha son shundan; 12-Modul 9.38 h). Kod oynasida `URLSearchParams` bilan o'qilgan.
   - 12-Modul 7-darsi (tayanch 1.7): ro'yxatdan o'tish `POST /royxat { ism, login, parol }` · `oyinchilar.namuna` (forma doim `false` yozadi; namuna va tekshiruv akkauntlari — `true`) · **qurilma ID** — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi (web-trekda — brauzer ID, 10-Modul) ·
     **«Hisobni o'chirish»** («Rostdan o'chirasizmi?»; hisob va qatnashuv yozuvlari o'chadi, e'lon qilingan o'yinlar qoladi — 12-Modul 9.8) · `lending/maxfiylik.html` (to'rt savol) · lendingdagi «Qanday qo'shilaman» bo'limi: «Android: ilovani o'rnatish» · «iPhone: brauzerda ochish».
   - 12-Modul 10-darsi (tayanch 9.42 e): «Havolani ulashish» — e'lon berilgach «O'yin» ekranida; tashkilotchi lending manzilini `?kanal=ilova` bilan o'z jamoasiga yuboradi. **Hamma tashkilotchida havola bir xil — kim ulashgani bilinmaydi** (tayanch 1.10). Bugungi dars shu tugmaning davomi; tugma nomi o'zgarmaydi.
   - 12-Modul 9.23: **asosiy harakat** — «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan» (SQL — A2) · 9.28: yangi versiya — Backend push'dan keyin Render'da, lending Netlify'da odatda o'zi yangilanadi; brauzer ko'rinishi — `npx expo export -p web` → `netlify deploy --prod --dir dist`; **APK o'zi yangilanmaydi** — yangi fayl, lendingdagi havola almashtiriladi.
   - 12-Modul 9.35, 9.37 g, 9.41 i: tekshiruv akkaunti va yozuvlari haqiqiy sanoqdan chiqariladi — 7-darsdan keyin «Hisobni o'chirish» yo'li bilan yoki agent aytgan `id` bo'yicha; o'quvchi `DELETE` yozmaydi.
   - 13-Modul 4-darsi (tayanch 1.4): Pro holati — `oyinchilar.pro_gacha` (sana yoki bo'sh), `GET /men` javobida `pro`, `proGacha`. Pro muddati tugagach o'zi to'xtaydi — avtomatik yechish yo'q (tayanch 1.0).
4. **Mazmun (tayanch 1.10 — aynan):**
   - **Taklif kodi** — har hisobga (`oyinchilar.taklif_kodi`), 6 belgi: katta harf va raqam. **Taklif havolasi** — lending manzili `?taklif=<taklif kodi>&kanal=taklif`; lending taklif kodini ko'rsatadi: «Taklif kodi: AB12CD».
     Ilovada «Havolani ulashish» endi shaxsiy havolani ulashadi (nomi va joyi o'zgarmaydi). Namuna taklif kodi — `AB12CD` (tayanch 1.10 dagi ko'rinish; Mentor misolidagi bir tashkilotchiniki — TAYANCHGA SAVOL 2).
   - **Formadagi taklif kodi:** ro'yxatdan o'tish formasida maydon **«Taklif kodi (bo'lsa)»** — APK o'rnatilganda havoladagi taklif kodi ilovaga o'tmaydi, shuning uchun u qo'lda yoziladi (**Mentor qarori**; o'quvchi matnida halol aytiladi — 2-ekran). Yozilgani — `oyinchilar.taklif_qilgan_id`.
     `10-done` da taklif kodi katta harf bilan solishtiriladi — kichik harf bilan yozilgani qabul qilinmaydi (tayanch 1.10, 1.12). O'quvchi matnida bu aytilmaydi (keyingi darsning topilmasi oldindan ochilmaydi — sinf 12); faqat O'qituvchi eslatmasida.
   - **Sanoq:** lending — Umami, `tashrif` kanal «taklif» bilan · Database — taklif kodi bilan ro'yxatdan o'tganlar (`taklif_qilgan_id`, `namuna = false`) · asosiy harakat — 12-Modul 9.23 SQL i shu hisoblar ichida. Umami'ga faqat kanal ketadi — taklif kodi yuborilmaydi (TAYANCHGA SAVOL 12).
   - **Mukofot (Qaror-0 15):** taklif qilgan odamga **Pro'ning bepul haftasi** (`pro_gacha` 7 kunga uzayadi; pul ham, chegirma ham emas; test rejimdagi pullik obuna muddati).
     **Shart (Qaror-0 16 — uch shart va cheklov):** 1) taklif kodi bilan ochilgan **yangi hisob asosiy harakatni qilgach** · 2) o'zini taklif qilish (ikki hisob **bir qurilma ID** da) sanalmaydi · 3) **namuna** hisob sanalmaydi · cheklov: bitta taklif qilgan **hisobga** haftasiga ko'pi bilan **2** mukofot (Backend odamni emas, hisobni taniydi — F-1007-468).
     Havola faqat tanish doiraga; «do'stingni taklif qil — sovg'a» bosimi yo'q.
   - **Mentor natijasi (bir hafta; tayanch 1.10, 1.13 — aynan):** taklif havolasi bilan lending ochilgan — **18** (Umami; o'quvchi matnida «tashrif» — TAYANCHGA SAVOL 4) · taklif kodi bilan ro'yxatdan o'tgan **7** hisob · ulardan asosiy harakatni qilgan **4** ·
     shulardan **1** tasi taklif qilgan bilan bir qurilmada — sanalmadi · mukofot **3** ta (**2** tashkilotchiga) · jami ro'yxatdan o'tgan **51** (44 + 7).
     Halol gap (so'zma-so'z): «Bir hafta va 7 hisob — kichik son: taklif yo'li ishlaganini ko'rsatadi, o'sishni isbotlamaydi.» **51 — baho yoki g'alaba deb aytilmaydi** (12-Modul «50 — baho emas» qoidasi): unda 11 sinfdosh va bir qurilmadagi hisob ham bor.
   - **«Bir qurilma» qoidasining halol chegarasi:** u faqat bir qurilmani ushlaydi — ikkinchi qurilmadan (ikkinchi telefon, kompyuterdagi yashirin oyna) ochilgan hisobni ajrata olmaydi; haftalik cheklov shuning uchun ham bor (3-amaliyot QIzohi).
     Bir qurilmadagi ikki hisob — o'zini taklif qilish ham, oiladagi bitta telefon ham bo'lishi mumkin: qoida ikkalasini ajratmaydi, sabab haqida xulosa yo'q (5-ekran joriy qatori).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **taklif havolasi · taklif kodi** — har hisobning o'z 6 belgili kodi va shu kod yozilgan havola (Mentor misolida ulashish tugmasi — tashkilotchining «O'yin» ekranida; F-1007-468); 2-ekranda harakatdan keyin tug'iladi (T-011). Kartochkada bir marta «inglizchasi: referral». Ishlatilmaydi: referal (prozada), invite, promo-kod.
     ⚠️ «kod» yolg'iz — faqat dastur kodi ma'nosida (agent promptidagi «Yozgan kodingda», «kod qatori», «kodda bor»); referal ma'nosida **doim «taklif kodi»** (T-015). Sahna tugmasi ham «Taklif kodini yozish».
   - **taklif qilgan** — havolani ulashgan hisob egasi (Mentor misolida — tashkilotchi) · **taklif kodi bilan ochilgan hisob** — yangi hisob («taklif qilingan» shakli ishlatilmaydi: «taklif qilgan» bilan ikki harfga farq qiladi — S-040).
   - **mukofot** — taklif uchun beriladigan narsa; Mentor misolida Pro'ning bepul haftasi (pul emas). Ishlatilmaydi: bonus, sovg'a, keshbek, chegirma (mukofot ma'nosida).
   - **mukofot qoidasi** — uch shart va haftalik cheklov (5-ekran, 3-amaliyot). «Suiiste'mol» o'quvchi matnida yo'q — «o'zini taklif qilish» (aniq harakat).
   - **sanoq** — Umami'dagi tashriflar va Database'dagi hisoblar; **tashrif** — lending ochilishi (Umami) · **hisob** — ro'yxatdan o'tgan foydalanuvchi (Database) · **qurilma** — qurilma ID bo'yicha. Uch birlik bir-biridan ayirilmaydi (sinf 7).
   - **hisob** — o'quvchi matnida doim «hisob» («Hisobni o'chirish», «Hisobdan chiqish» bilan bir so'z); «akkaunt» ishlatilmaydi (T-014). **tekshiruv akkaunti** — darsda tekshirish uchun ochilib, keyin o'chiriladigan hisob (12-Modul «tekshiruv akkaunti»).
   - **asosiy harakat** — Mentor misolida: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan (12-Modul 9.23). **namuna** — `namuna = true` hisob (12-Modul 7-darsi). **qurilma ID** · **brauzer ID** (web-trek).
   - **Pro** · **pullik obuna** (doim ikki so'z) · **test rejim** — 13-Modul tayanchi 2. **tekshirish · tekshiruv** — o'z ishini ko'rish; «sinov» bu darsda yo'q; «test» — faqat «test rejim».
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **APK** · **o'rnatish fayli** · **brauzer ko'rinishi** · **Neon SQL Editor**.
   - **Ishlatilmaydi:** referal, invite, bonus, sovg'a, keshbek, akkaunt, «Modul 13», A1/A2/A3, `m11-10`, server (prozada), hodisa (`tashrif` — «tashrif» deb ataladi), «ekran» dars ekrani ma'nosida (faqat ilova va telefon ekrani — T-064).
6. **Mentor misolidagi sonlar (tayanch 1.10, 1.13 — aynan):** 18 (tashrif) · 7 (hisob) · 4 (hisob) · 1 (hisob) · 3 (mukofot) · 2 (tashkilotchi) · 51 (hisob, 44 va 7) · 7 kun · 2 (haftalik cheklov).
   Har son yonida birligi; statistika yoki tadqiqot deyilmaydi (T-043). Boshqa son yo'q: Mentor misolida Pro'ni test rejimda yoqqanlar soni va Telegram'ni ulaganlar soni **yo'q** — to'qilmaydi (tayanch 1.13). Taklif qilgan ikki tashkilotchi orasida mukofot qanday bo'lingani — aytilmaydi (TAYANCHGA SAVOL 3).
7. **Metafora yo'q. Keyssiz** (Qaror-0 21). Real kompaniya, brend yo'q. Qahramon yo'q — odamlar roli bilan: tashkilotchi, yangi o'yinchi, sherik, sinfdosh (sahna yorliqlari «1-telefon · tashkilotchi», «2-telefon · yangi o'yinchi»).
8. **Amaliyot bloki (tayanch 4, 12-Modul modeli aynan):** to'rt band (Ochish → Prompt → Ishga tushirish → Tekshirish) — hammasi o'quvchining **o'z repo'sida, o'z mahsuloti va trekida**; 5-band yo'q. Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam»da to'liq prompt).
   **Talab zinapoyasi:** uchala blokda tayyor talab + `{…}` joylari — mahsulot qarori joyida o'quvchida (sinf 13), yonida kulrang «masalan: …» (Mentor misolidan). Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.»
   Xato yo'li (har blok 3-bandida, bitta gap): «Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»» Push odati: `git status` → `git add <fayl>` (`git add .` emas).
   Har blokda Render kutayotganda — agentdan kod qatorlarini ko'rsatishni so'raydigan prompt (SABOQ 52). Blok bajarilgani — faqat 4-band «Bajardim»idan (12-Modul 9.36 h).
9. **Mukofot va pul:** mukofot — `pro_gacha` 7 kunga uzayishi (o'tgan yoki bo'sh bo'lsa — bugundan); to'lov yo'q, karta yo'q, to'lov xabari yo'q. O'quvchi mahsulotida pullik qulaylik (4-darsda qurgan) bo'lsa — mukofot uning bepul muddati;
   bo'lmasa — mukofot qatoriga «hozircha yo'q» yoziladi: qoida baribir har taklifning natijasini yozadi (3-amaliyot «Ochish»). Pul, chegirma, narsa — hech bir holatda.
10. **Xavfsizlik (TAQIQLAR 3; 12-Modul tayanchi 1.6 — olti bandli ro'yxat kuchda):** havola faqat tanish doiraga, bitta xabarni ko'p guruhga tashlamaslik, notanishga yozmaslik (1-amaliyot «Ochish», arena 12) ·
    darsda havola real foydalanuvchilarga yuborilmaydi — tekshiruv o'zingizda; sherik faqat tekshiruv akkaunti ochadi va uni o'chiradi · sinfda kim nechta odam taklif qilgani sanalmaydi (O'qituvchi eslatmasi) · ilovadagi qoida qatori bosimsiz — shart aytadi, chorlamaydi (3-amaliyot) ·
    taklif kodida ism va login yo'q; Umami'ga taklif kodi ketmaydi; yangi qurilma ID yozuvi maxfiylik siyosatida ochiq aytiladi (3-amaliyot).
11. **Uyga vazifa yo'q** (tayanch 4: loyiha kunlari). Yakunda HwCard yo'q; ulgurmagan ish — yakun sarlavhasi holatga qarab aytadi (sinf 6). O'rnatish fayli navbatda qolsa — havola **keyingi dars boshida** almashtiriladi, «uyda» deyilmaydi (12-Modul 9.41 h).
12. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l:** taqsimot tepada. Har blokda «Ulgurmasangiz» qatori; «Ortda qoldingizmi» — darsda bir marta, 1-amaliyotda (SABOQ 39). «Davom etish» — 1 va 2-amaliyotda faqat 4-band «Bajardim»idan keyin (keyingi blok o'sha kodga — ro'yxatdan o'tishga — tegadi: 12-Modul 9.41 i, 09-FILTR 39; SABOQ E 55 — «avval MD»),
    3-amaliyotda — 3-banddan keyin (oxirgi blok); blok bayrog'i — faqat 4-banddan.
    Tashqi kutish (Render deploy, brauzer ko'rinishini chiqarish, o'rnatish fayli navbati) dars oqimini to'xtatmaydi: Render kutilganda kod qatorlarini o'qish, o'rnatish fayli 3-amaliyot oxirida boshlanadi, navbat podium va arena paytida yuradi.
    Yakun sarlavhasi holatga qarab — olti holat (11-ekran); mobil trekda qo'shimcha yorliq «O'rnatish fayli navbatda». O'qituvchi eslatmasi — 1-ekranda.
13. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, brauzer, Backend tuguni, konvert, chiziq — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida (11-Modul yashili); logotip yo'q; rang — faqat holat foni (D3).
    Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 — «O'lchov» bo'limi (skript bilan).
14. **Saqlash kaliti:** o'qiydi — `pm-m9d8-platforma.trek` (`mobil` | `web`; yo'q bo'lsa — har blokda ikkala trek qatori ko'rinadi, kalitga yozilmaydi). Yangi `pm-…` kaliti yo'q. Blok bayroqlari, 1-amaliyotdagi qavs qiymatlari (3-amaliyotga oldindan qo'yiladi),
    3-amaliyot tekshiruv kartasi va «Havola almashtirildi» / «Fayl navbatda» tanlovi — dars holatida (`ccProgress`). Kalitga va holatga ism, login, taklif kodi, qurilma ID yozilmaydi.
15. **Trek (tayanch 4):** har blokda mobil va web yo'li; farq — «Ochish»da va «Yordam» ostida bir gap. Web-trekda: qurilma ID o'rnida — brauzer ID (10-Modul) · «Havolani ulashish» o'rnida — saytdagi ulashish yoki «Nusxalash» joyi ·
    havola va forma bitta brauzerda ochilsa, sayt taklif kodini havoladan formaga o'zi qo'yishi mumkin (maydon baribir tahrirlanadi) · APK va brauzer ko'rinishi yo'q — push'dan keyin Netlify saytni odatda o'zi yangilaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» 12-Modulda «Havolani ulashish» tugmasini oldi — lekin hamma tashkilotchida havola bir xil. Bugun har hisobning o'z taklif kodi va havolasi bo'ladi: havola lendingni ochadi, taklif kodi formaga yoziladi, Backend kim kimni taklif qilganini biladi,
  qoidaga mos taklif uchun Pro'ning bepul haftasi beriladi. Mentor misolida bir haftalik natija — kichik son, o'sishning isboti emas. O'quvchi xuddi shuni o'z mahsulotida qiladi (uch blok).
- **Hook:** ikki tashkilotchi bir xil havolani yubordi → «kim taklif qilgani qayerda ko'rinadi?» → 2-ekranda taklif havolasi yo'li va APK'da taklif kodi o'tmasligi → 1-amaliyot (taklif kodi va havola) → 5-ekranda Mentor misolining bir haftasi va mukofot qoidasi →
  2-amaliyot (formadagi taklif kodi va sanoq) → 3-amaliyot (mukofot va uch shart).
- **Bitta vizual — «taklif yo'li» sahnasi** (bitta manba `TAKLIF_SAHNA`, 163/180):
  - **chapda «1-telefon · tashkilotchi»** (ramka ≈170×272, o'lcham barqaror; yorliq ramka ustida): «Maydon Jamoa» nomi o'z rangida; «O'yin» ekrani — «Shanba, 18:00 · Mahalla maydoni · 8 / 10», tugma «Havolani ulashish».
  - **o'rtada tepada «brauzer · lending»** — manzil satri `maydon-jamoa-….netlify.app/…`; «Qanday qo'shilaman» bo'limi: (taklif kodi kelsa) «Taklif kodi: AB12CD» · «Ro'yxatdan o'tishda shu taklif kodini yozing.» · «Android: ilovani o'rnatish» · «iPhone: brauzerda ochish»; burchakda kichik quti «Umami · kanal».
  - **o'rtada pastda «Backend» tuguni** — ichida mini-jadval `oyinchilar` (ustunlar: `taklif_kodi` · `taklif_qilgan_id`; 5-ekranda va 3-amaliyotda — `mukofot`).
  - **o'ngda «2-telefon · yangi o'yinchi»** — avval «Maydon Jamoa o'rnatilmagan» (kulrang), keyin «Ro'yxatdan o'tish» formasi: «Ism» · «Login» · «Parol» · «Taklif kodi (bo'lsa)».
  - **konvert** — havola (1-telefondan lendingga, ustida kichik yorliq «tanish chati») · «APK» (lendingdan 2-telefonga) · so'rov `POST /royxat` (2-telefondan Backend'ga). Uzuq chiziq oldida konvert so'nadi («taklif kodi ilovaga o'tmadi»).
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (yozildi / mos) → qizil (sanalmadi). Yangi qator jadvalga bir lahza ajralib kiradi. `prefers-reduced-motion` da konvert yurmaydi, holatlar bir zumda almashadi (DE-200).
  - Ishlatilishi: 0 (1-telefon + ikki chat pufagi) · 1 (tayyor holat, kashfiyotsiz) · 2 (to'liq yo'l) · 5 (Backend kengaygan: sanoq qutilari + hisob kartalari + qoida kartasi) · bloklarning o'ng tomoni (kutilgan natija).
- **Yakun:** taklif havolasi, sanoq va mukofot qoidasi tayyor · uyga vazifa yo'q · keyingi dars — «Mahsulotingiz hozir qayerda?».

---

## 0 · Kirish — bir xil havola  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Yangi o'yinchini kim taklif qilgani qayerda ko'rinadi?** (54)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: 12-Modulda Mentor ilovasiga «Havolani ulashish» qo'shildi — tashkilotchilar havolani o'z jamoasiga yuboradi; javobni tanlang.
  - javobdan keyin: Bugun har hisobga o'z havolasi beriladi — «Davom etish»ni bosing.
- Maket (chap): «1-telefon · tashkilotchi» — «O'yin» ekrani «Shanba, 18:00 · Mahalla maydoni · 8 / 10», tugma «Havolani ulashish» (kulrang, bosilmaydi — maket).
  Telefon yonida ikki chat pufagi, ustida kichik yorliq: «bir tashkilotchi» · «boshqa tashkilotchi»; ikkalasida bir xil havola `maydon-jamoa-….netlify.app/?kanal=ilova`. Pufaklar ostida kichik kulrang quti «Umami · kanal: ilova».
- Variantlar (radio, ballsiz; har birining o'z yengil chegarasi — E 40):
  - Havolada — unda kim yuborgani yozilgan (38)
  - ✔ Hech qayerda — havola hammada bir xil (37)
  - Formada — yangi o'yinchi o'zi yozadi (36)
- Javob — 2-variant: **Aynan!** Mentor ilovasida hamma tashkilotchi bir xil havolani ulashadi — kim yuborgani hech qayerda yozilmaydi. (109)
- Javob — 1-variant: **Qiziq fikr!** Hozirgi havolada faqat `?kanal=ilova` bor: u kanalni aytadi, kim yuborganini emas. (94)
- Javob — 3-variant: **Qiziq fikr!** O'yinchi aytsa bilinardi — lekin hozir formada buni yozadigan joy yo'q. (83)
- **Harakat → Vizual o'zgarish:** variant tanlanadi → ikki pufakdagi havola bir lahza accent bilan yonadi va ustma-ust tushadi (ikkalasi bir xil) → Umami qutisi ostida kulrang qator chiqadi: «kanal: ilova · kim yuborgani — yozilmagan».
  Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11); javob matni variantlar ostida.
- Ballsiz (J-026: `correct: false` hammaga; «Aynan!» / «Qiziq fikr!» — kurs qonuni T-028, T-067). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: sinfdan so'rang: «Siz ishlatadigan ilovalarda «do'stingizni chaqiring» degan joy bormi — u kim chaqirganini qayerdan biladi?» Javoblarni sanamang va to'g'ri-noto'g'ri demang — 2-ekranda ko'rinadi.
- ✎ Hook obyekti — darsning o'qitish obyekti (P-001): kim taklif qilgani. Uch variant «qayerda — nega» shaklida; 1 va 3-variant — bugungi yechimning ikki qismi (havolada taklif kodi, formada taklif kodi): payoff ularni yolg'onga chiqarmaydi, faqat **hozirgi** holatni aytadi (P-016).
  Mentor gapida javob yo'q (hook javobi Mentorda aytilmaydi). Havola — 12-Modul 9.42 e (aynan). Atama «taklif havolasi» hali yo'q (T-011) — 2-ekranda harakatdan keyin.

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun har hisobning o'z taklif kodi bo'ladi.** (44)
- Mentor: Havola, sanoq va mukofotni uch blokda qurasiz — talab tayyor, qavslarini o'z mahsulotingiz bilan to'ldirasiz.
- Chap — «Dars oxirida» + kulrang yorliq **unikal havola, sanoq va mukofot** (App.jsx osti so'zma-so'z, P-015; atama faqat yorliqda) + vizual: sahna **tayyor** holatda, bir marta o'zi yuradi (DE-200) —
  1-telefonda «Havolani ulashish» yonadi → havola qatori `…/?taklif=AB12CD&kanal=taklif` lendingga uchadi → lendingda «Taklif kodi: AB12CD» chiqadi. Shu yerda to'xtaydi: forma va mukofot ko'rsatilmaydi (2 va 5-ekran kashfiyoti — P-036; SABOQ D 33 — haqiqiy nomlar, bo'sh chiziq yo'q).
- O'ng — bugungi uch ish (tex-karta «01 · matn», bosilmaydi; teg yo'q — 172):
  - 01 · Har hisobning o'z havolasi (26)
  - 02 · Havola bilan kelganlar sanaladi (31)
  - 03 · Mukofot — faqat qoidaga mos taklifga (36)
- Pastki qator (mono, kichik): o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m13-dars-10-start` · namuna `m13-dars-10-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Bu darsda pul yo'q: mukofot — test rejimdagi Pro muddati.
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- Keyingi bosiladigan joy: «Boshlaymiz».
- O'qituvchi eslatmasi: eng og'ir qism — 3-amaliyot (ikki tekshiruv akkaunti, brauzer ko'rinishini yangilash, tozalash). Sinfda havolalarni bir-biriga yubortirmang va kim nechta odam taklif qilganini so'ramang (qo'l ko'tartirmang) — sherikning tekshiruvi tekshiruv akkaunti bilan, keyin o'chiriladi.
  Mukofot — pul emas: test rejimdagi Pro muddati. «Do'stingizni taklif qiling — sovg'a oling» kabi gap aytmang. Mentor misolidagi 51 ni bayram qilmang: unda 11 sinfdosh va bir qurilmadagi hisob ham bor; bu o'quvchilarga me'yor emas.
  F-1007-468: talabda kod bo'shliqsiz va katta harfga o'tkazilib solishtiriladi — kichik harf 12-darsga ataylab qoldirilmaydi (9.51; ilgari: «Mentor talabida katta-kichik harf haqida gap yo'q — 12-dars topadi»); o'quvchi o'zi topsa — o'z mahsulotida tuzatsin.
- ✎ Sarlavhada yangi atama yo'q (T-011): «o'z havolasi» — «taklif havolasi» 2-ekranda tug'iladi; atamalar kulrang yorliqda. «unikal» — App.jsx so'zi, faqat yorliqda (TAYANCHGA SAVOL 24). Uch qator ot-shaklda (§224); reja qatorlarida «taklif kodi» yo'q (2-ekranda tug'iladi); 03 qatori qoidani ochmaydi (P-015).

## 2 · Havoladan ilovagacha  ← QTushuncha (bashorat + 4 harakat)
- Eyebrow: Tushuncha · havola yo'li
- Sarlavha: **O'rnatilgan ilova kim taklif qilganini biladimi?** (48)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval taxminingizni belgilang, keyin chap telefonda «Havolani ulashish»ni bosing.
  - 1-harakatdan keyin: Endi har tashkilotchining o'z havolasi bor — u taklif havolasi deyiladi; brauzerda «Havolani ochish»ni bosing.
  - 2-harakatdan keyin: Havoladagi olti belgi — taklif kodi; endi lendingdagi «Android: ilovani o'rnatish»ni bosing.
  - 3-harakatdan keyin: Ilova o'rnatildi — endi o'ng telefonda «Taklif kodini yozish»ni bosing.
  - tugagach: To'rt harakat tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»; kirishda karta yengil ko'tariladi, variantlar navbat bilan): **Yangi o'yinchi havola orqali APK o'rnatdi. Ilova kim taklif qilganini biladimi?** · Ha — havoladan biladi · Yo'q — o'yinchi o'zi yozadi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Sahna (`TAKLIF_SAHNA`, to'liq): chapda «1-telefon · tashkilotchi» — «O'yin» ekrani, «Havolani ulashish» (halqada) · o'rtada tepada brauzer (manzil satri bo'sh, kulrang) · o'rtada pastda «Backend» — `oyinchilar` jadvalida bitta qator: `AB12CD` · «tashkilotchi» ·
  o'ngda «2-telefon · yangi o'yinchi» — kulrang «Maydon Jamoa o'rnatilmagan». Sahna tugmalari (chegarali, ramkadan tashqarida): «Havolani ochish» (brauzer ostida) · «Taklif kodini yozish» (2-telefon ostida); «Android: ilovani o'rnatish» — lending ichida.
- **Harakat → Vizual o'zgarish:**
  - 1) «Havolani ulashish» (1-telefon) → Backend'dagi `AB12CD` qatori bir lahza yonadi → 1-telefon ustida havola qatori: `maydon-jamoa-….netlify.app/?taklif=AB12CD&kanal=taklif` (`AB12CD` qismi accent) → konvert «havola» (yorliq «tanish chati») brauzerga uchadi.
  - 2) «Havolani ochish» → brauzer manzil satrida havola; «Qanday qo'shilaman» bo'limida qator sirg'alib chiqadi: «Taklif kodi: AB12CD» · ostida «Ro'yxatdan o'tishda shu taklif kodini yozing.»; burchakdagi kichik quti «Umami · kanal: taklif · +1 tashrif» (qutiga taklif kodi tushmaydi).
  - 3) «Android: ilovani o'rnatish» → konvert «APK» brauzerdan 2-telefonga → 2-telefonda «Maydon Jamoa» → «Ro'yxatdan o'tish» formasi: «Ism» · «Login» · «Parol» · «Taklif kodi (bo'lsa)» — **bo'sh**;
    havola qatori brauzer chetida so'nadi, yonida kulrang yorliq «taklif kodi ilovaga o'tmadi».
  - 4) «Taklif kodini yozish» → maydonga `AB12CD` harfma-harf yoziladi → forma tugmasi «Ro'yxatdan o'tish» o'zi bosiladi → konvert `POST /royxat` Backend'ga → `oyinchilar` ga yangi qator sirg'alib kiradi va ~1 s yashil yonadi: «yangi hisob · taklif qilgan: tashkilotchi».
  - Holat o'quvchi bosgan tartibdan chiziladi (P-046); noto'g'ri tanlov yo'q — qaror bashoratda, natija harakatda.
- Joriy qator (4/4 dan keyin, bitta): Umami faqat kanalni sanaydi; kim taklif qilganini Database biladi. (66)
- Natija qatori (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz ✕ — aslida: yo'q, o'yinchi taklif kodini o'zi yozadi» yoki «Taxminingiz to'g'ri chiqdi ✓».
- Xulosa: Mentor ilovasida havoladagi taklif kodi o'rnatilgan APK'ga o'tmaydi — shuning uchun formada maydon bor. (103)
- Tugadi (199): harakat paneli va sahna tugmalari yopiladi; sahna butun enga, Backend'dagi yangi qator fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/4) → Davom etish
- Keyingi bosiladigan joy: bashorat variantlari → «Havolani ulashish» (halqada) → «Havolani ochish» → «Android: ilovani o'rnatish» → «Taklif kodini yozish» → «Davom etish» (har safar faqat navbatdagisi faol, qolgani xira).
- O'qituvchi eslatmasi: iPhone'dagi brauzer ko'rinishida ham Mentor ilovasi taklif kodini qo'lda so'raydi — bitta qoida (TAYANCHGA SAVOL 17). Web-trekda havola va forma bitta brauzerda ochilsa, sayt taklif kodini havoladan formaga o'zi qo'yishi mumkin — bu 2-amaliyotda o'quvchining tanlovi.
- ✎ Bitta g'oya (P-008): havoladagi taklif kodi APK'ga o'tmaydi — shuning uchun forma (tayanch 1.10, Mentor qarori — halol aytiladi). Atamalar harakatdan keyin (T-011): «taklif havolasi» — 1-harakatdan, «taklif kodi» — 2-harakatdan keyin Mentor gapida.
  Sarlavha va bashoratda yangi atama yo'q (T-011): hook savoli («kim taklif qilgani») davom etadi, «taklif kodi» faqat harakatdan keyin; «kod» yolg'iz ishlatilmaydi (T-015). Joriy qator — 2-amaliyotdagi sanoqqa ko'prik (Umami va Database — ikki birlik). Bashorat — ikki daraja (S-015).
  «tanish chati» — konvert yorlig'i: havola tanish doiraga ketadi (TAQIQLAR 3). 1-savol shu qoidaning sababini so'raydi, sahnani qaytarmaydi (§106).

## 3 · Amaliyot 1 — taklif kodi va havola  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Har hisobning o'z taklif kodi va havolasi bo'lsin.** (50)
- Mentor: Talab tayyor — uchta qavsni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Har hisobga taklif kodi beriladi; ulashiladigan havolada shu taklif kodi turadi va havola ochgan sahifa uni ko'rsatadi.
- Bandlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching — oxirgi loyiha kunidan (8-dars) keyingi holat. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»
     Ikki savolga javob toping: mahsulotingizda havola qayerdan ulashiladi? Havola kimni qayerga olib boradi — lendingga yoki to'g'ri saytingizga? (Mentor misolida: «O'yin» ekranidagi «Havolani ulashish» — lending manzili.)
     Mahsulotingizda ulashish tugmasi bo'lmasa — havola hisob sahifasida «Nusxalash» bilan tursin: qayerda turishini qavsga o'zingiz yozasiz.
     Bugun havolani faqat o'zingizda tekshirasiz. Keyin ulashsangiz — faqat tanishlaringizga: 12-Moduldagi olti bandli ro'yxat kuchda (bitta xabarni ko'p guruhga tashlamaslik, notanishga yozmaslik).
     Web-trekda: «Havolani ulashish» o'rnida — saytingizdagi ulashish yoki «Nusxalash» joyi; havola lendingga yoki saytingizga olib borishi mumkin — tanlov sizda.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — foydalanuvchilar jadvali va `GET /men`; {ulashish joyi}; {havola ochadigan sahifa}.
     > Nima qilsin: har hisobga taklif kodi bo'lsin — yangi ustun `taklif_kodi`: 6 belgi, katta harf va raqam, jadvalda noyob. Yangi hisobga ro'yxatdan o'tishda berilsin (noyoblik to'qnashsa — yangi kod bilan qayta yozilsin, oldindan tekshirib emas), mavjud hisoblarning har biriga bir marta berilsin (qayta ishga tushsa ham bor kod almashmasin). Kod maxfiy emas: u bo'yicha hisob haqida hech narsa ko'rsatilmasin. `GET /men` javobiga `taklifKodi` qo'sh.
     > {ulashish joyi} shu havolani ulashsin: {havola manzili}`?taklif=`taklif kodi`&kanal=taklif`. Tugma nomi va joyi o'zgarmasin.
     > {havola ochadigan sahifa} manzilda `taklif` bo'lsa, qator ko'rsatsin: «Taklif kodi: …» va ostida «Ro'yxatdan o'tishda shu taklif kodini yozing.» `kanal` belgisi avvalgidek Umami'ga ketsin; taklif kodi Umami'ga yuborilmasin.
     > Nima buzilmasin: ro'yxatdan o'tish, kirish, Pro va boshqa `?kanal=` havolalar avvalgidek ishlasin; mavjud hisoblar o'chmasin va o'zgarmasin (faqat taklif kodi qo'shilsin); taklif kodida ism va login bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ulashish joyi} — «masalan: `mobil/` — «O'yin» ekranidagi «Havolani ulashish» tugmasi»
     - {havola ochadigan sahifa} — «masalan: `lending/` — bosh sahifadagi «Qanday qo'shilaman» bo'limi»
     - {havola manzili} — «masalan: lending manzili (Netlify)»
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — `oyinchilar` jadvali va `GET /men`; `mobil/` — «O'yin» ekranidagi «Havolani ulashish» tugmasi; `lending/` — bosh sahifadagi «Qanday qo'shilaman» bo'limi.
     > Nima qilsin: har hisobga taklif kodi bo'lsin — yangi ustun `taklif_kodi`: 6 belgi, katta harf va raqam, jadvalda noyob. Yangi hisobga ro'yxatdan o'tishda berilsin (noyoblik to'qnashsa — yangi kod bilan qayta yozilsin, oldindan tekshirib emas), mavjud hisoblarning har biriga bir marta berilsin (qayta ishga tushsa ham bor kod almashmasin). Kod maxfiy emas: u bo'yicha hisob haqida hech narsa ko'rsatilmasin. `GET /men` javobiga `taklifKodi` qo'sh.
     > «Havolani ulashish» shu havolani ulashsin: lending manzili + `?taklif=`taklif kodi`&kanal=taklif`. Tugma nomi va joyi o'zgarmasin.
     > Lending manzilda `taklif` bo'lsa, «Qanday qo'shilaman» bo'limida qator ko'rsatsin: «Taklif kodi: …» va ostida «Ro'yxatdan o'tishda shu taklif kodini yozing.» `kanal` belgisi avvalgidek Umami'ga ketsin; taklif kodi Umami'ga yuborilmasin.
     > Nima buzilmasin: ro'yxatdan o'tish, kirish, Pro va boshqa `?kanal=` havolalar avvalgidek ishlasin; mavjud hisoblar o'chmasin va o'zgarmasin (faqat taklif kodi qo'shilsin); taklif kodida ism va login bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida «O'yin» ekrani o'rniga saytingizdagi ulashish yoki «Nusxalash» joyi turadi; havola saytingizga olib borsa — taklif kodini sayt ko'rsatadi, qolgani o'sha.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "taklif kodi va havola"`, `git push`.
     Backend o'zgardi — Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin); lending Netlify'da odatda o'zi yangilanadi. Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`).
     Kutayotganda agentdan yozgan kodini ko'rsatishni so'rang (SABOQ 52; «Nusxalash» bilan):
     > Yozgan kodingda uch joyni fayl nomi va qator raqami bilan ko'rsat: taklif kodi yasaladigan qator, mavjud hisoblarga taklif kodi beriladigan joy va havola yig'iladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har gapini o'zingiz ko'ring (jadval va ustun nomlari — mahsulotingizdagidek):
     (1) Neon SQL Editor'da: `SELECT COUNT(*) FROM oyinchilar WHERE taklif_kodi IS NULL;` → «Run» — `0` bo'lishi kerak (taklif kodisiz hisob yo'q).
         Keyin: `SELECT taklif_kodi FROM oyinchilar GROUP BY taklif_kodi HAVING COUNT(*) > 1;` — natija bo'sh bo'lishi kerak (bir xil taklif kodi ikki hisobda yo'q).
     (2) O'z taklif kodingizni ko'ring: `SELECT taklif_kodi FROM oyinchilar WHERE login = '{loginingiz}';`
     (3) Ilovada «Havolani ulashish»ni bosing va havolani faqat o'zingizga yuboring yoki nusxalang. Havolada `?taklif=` va olti belgi bo'lishi kerak — (2) dagi taklif kodingiz bilan bir xil.
     (4) Havolani telefon brauzerida oching: «Qanday qo'shilaman» bo'limida «Taklif kodi: …» — o'sha olti belgi turishi kerak.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (uch kadr bir marta o'zi yuradi):
  - telefon: «O'yin» ekrani → «Havolani ulashish» → ulashish oynasida havola `maydon-jamoa-….netlify.app/?taklif=AB12CD&kanal=taklif`
  - brauzer: lending «Qanday qo'shilaman» — «Taklif kodi: AB12CD» · «Ro'yxatdan o'tishda shu taklif kodini yozing.» · «Android: ilovani o'rnatish» · «iPhone: brauzerda ochish»
  - Neon natijasi: `COUNT` — «0» (taklif kodisiz hisob yo'q)
  - web-trekda: brauzer oynasi — saytdagi havola va «Nusxalash», ochilgan sahifada «Taklif kodi: …».
- Tekshiruv kartasi (4-band oxirida, «Bajardim»dan oldin; dars holatida — 3, 8-darslar naqshi; F-1007-468): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Har hisobda taklif kodi bor; havola uni olib boradi va sahifa uni ko'rsatadi. (77)
- Qator (`QIzoh`, natija ostida, bitta): Umami'ga faqat kanal ketadi: taklif kodi va uni kim ochgani u yerda yozilmaydi. (79)
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-10-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. Qanday ishlashini ko'rasiz, o'z repo'ngizdagi ishni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Ulgurmasangiz: Render kutilganda agent ko'rsatgan qatorlarni o'qing. Tekshiruvni 2-amaliyotdan keyinga surmang — u ham ro'yxatdan o'tish kodiga tegadi, keyin qaysi o'zgarish buzganini ajratish qiyin. «Davom etish» 4-band «Bajardim»idan keyin ochiladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ Talab zinapoyasi — tayyor talab + 3 joy (sinf 13: ulashish joyi va havola qayerga olib borishi — mahsulot qarori). Taklif kodi formati — tayanch 1.10 aynan. Mavjud hisoblarga taklif kodi berish — yangi ustun to'ldiriladi, hech narsa o'chirilmaydi (qaytarib bo'lmaydigan o'zgarish emas — 12-Modul 9.39 b tegmaydi).
  Umami'ga taklif kodi ketmasligi — maxfiylik qarori (TAYANCHGA SAVOL 12). «Faqat o'zingizga yuboring» — darsda real odamlarga havola yuborilmaydi (A-bo'lim 10). Agentning «tayyor» degani — da'vo; isbot — Neon natijasi va lendingdagi qator.

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Mentor formasida nega «Taklif kodi (bo'lsa)» maydoni bor?** (8 so'z)
  - A · Umami faqat kanal belgisini sanagani uchun (42)
  - B · Taklif kodi olti belgidan iborat bo'lgani uchun (47)
  - C · ✔ APK'ga havoladagi taklif kodi o'tmagani uchun (45)
  - D · Taklif kodi majburiy maydon bo'lgani uchun (42)
- Kalit: **C** (index 2). To'rttalasi «… uchun» shaklida, bir xil qurilma (S-002); «taklif kodi» — B, C, D da (kalit so'z faqat to'g'rida emas); to'g'ri variant yolg'iz eng uzun emas (O'lchov).
  Distraktorlar uch turkumdan (sinf 8): A — rost, lekin mos emas (Umami haqida; maydonning sababi emas) · B — rost, lekin mos emas (taklif kodi formati) · D — yanglish tasavvur: maydon majburiy (aslida «(bo'lsa)»).
- To'g'ri izohi: Taklif kodi APK'ga o'tmaydi — yangi o'yinchi uni yozadi. (56)
- Xato izohlari (≤60):
  - A: Umami kanalni sanaydi — bu rost. Maydon nega formada? (53)
  - B: Taklif kodi olti belgili — bu rost. Ilovaga qanday yetadi? (58)
  - D: Maydon nomidagi «(bo'lsa)» nimani aytadi? (41)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda yo'l ko'rindi; savol uning sababini so'raydi — javob sahnadan ko'chirilmaydi (§106). «Mentor formasida» — chegarasi (sinf 4): boshqa ilovalarda yo'l boshqacha bo'lishi mumkin, savol faqat Mentor ilovasi haqida.

## 5 · Qaysi taklif uchun mukofot?  ← QTushuncha (bashorat + 5 harakat; hisob kartalari bittadan — E 53)
- Eyebrow: Tushuncha · mukofot qoidasi
- Sarlavha: **Qaysi hisob uchun mukofot beriladi?** (35)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor misolida bir haftalik sanoq bor — avval taxminingizni belgilang, keyin «Sanoqni ochish»ni bosing.
  - 1-harakatdan keyin: Endi to'rt hisobni bittadan «Qoidadan o'tkazish» bilan tekshiring.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; tanlangach ixcham qator; o'sish tartibida — S-015): **Asosiy harakat qilgan hisoblarning nechtasi uchun mukofot beriladi?** · Yarmidan kami · Ko'pi · Hammasi.
- Vizual (`TAKLIF_SAHNA` — Backend kengaygan holat):
  - Chap tepada — sanoq qutilari (kulrang, sonsiz; ustida kichik yorliq «Mentor misolida · bir hafta»): «Umami · tashrif» — «Database · taklif kodi bilan ochilgan hisob» — «asosiy harakat qilgan hisob». Qutilar orasida ingichka chiziq (ayirish belgisi yo'q).
  - Chap pastda — hisob kartasi joyi (bitta katta karta; «Hisob N / 4»); karta ostida tugma «Qoidadan o'tkazish» (halqada, SABOQ 21) — 1-harakatgacha xira.
  - O'ngda — tekshiruv kartasi «Mukofot qoidasi» (ostida kulrang yorliq «Mentor misolida»): uch bo'sh katak — «Yangi hisob, asosiy harakat qildi» · «Taklif qilgan bilan boshqa qurilmada» · «Namuna hisob emas»;
    ostida qator «Mukofot: 0» va kulrang qoida qatori «Bir hisobga — haftasiga ko'pi bilan 2».
- Hisob kartalari (shu tartibda; Mentor misoli — tayanch 1.10: 4 hisobdan 1 tasi bir qurilmada; tartib — sahna uchun, TAYANCHGA SAVOL 5):
  1. «Hisob 1 / 4» — «taklif kodi bilan ochilgan · asosiy harakat: bor · qurilma: taklif qilganniki emas · namuna: yo'q» → ✓ · ✓ · ✓
  2. «Hisob 2 / 4» — xuddi shunday → ✓ · ✓ · ✓
  3. «Hisob 3 / 4» — «… qurilma: taklif qilganniki bilan bir xil …» → ✓ · ✗ · ✓ — qizil qator: Bir qurilmada — mukofot yo'q. (29)
  4. «Hisob 4 / 4» — 1-karta kabi → ✓ · ✓ · ✓
- **Harakat → Vizual o'zgarish:**
  - 1) «Sanoqni ochish» → qutilarga son navbat bilan yoziladi (har biri bir lahza kattalashib qaytadi): «18 tashrif» → «7 hisob» → «4 hisob»; qutilar ostida ikki kulrang qator chiqadi:
    «Jami ro'yxatdan o'tgan: 51 (44 + 7)» · «tashrif va hisob — har xil o'lchov, ayirilmaydi». Birinchi hisob kartasi tushadi, «Qoidadan o'tkazish» faol bo'ladi.
  - 2–5) Har kartada «Qoidadan o'tkazish» → o'ngdagi uch katakka ✓ yoki ✗ navbat bilan «tushadi» (SABOQ 19) → hammasi ✓ bo'lsa karta yashil chegara oladi, «Mukofot: N» bir lahza kattalashib +1 bo'ladi va karta chapda ixcham ✓ qatorga yig'iladi;
    ✗ bo'lsa karta qizil chegara bilan so'nadi, ✗ katak yonida qizil qator chiqadi, «Mukofot» o'zgarmaydi. Keyingi karta tushadi, kataklar bo'shaydi.
  - 4 kartadan keyin «Mukofot: 3» yonida kichik qator chiqadi: «2 tashkilotchiga»; qoida qatori yonida ✓ «cheklovdan oshmadi».
  - Holat kartalar tartibidan chiziladi; noto'g'ri tanlov yo'q — qaror bashoratda.
- Joriy qator (4/4 dan keyin, bitta): Bir qurilma — o'zini taklif qilish ham, oiladagi bitta telefon ham bo'lishi mumkin: qoida ajratmaydi. (101)
- Natija qatori (yashil qutining birinchi kichik qatori): «Taxminingiz ✕ — aslida: ko'pi (to'rttadan uchtasi)» yoki «Taxminingiz to'g'ri chiqdi ✓».
- Xulosa: Bu misolda mukofot yangi hisob asosiy harakat qilgach beriladi; bir qurilmadagi va namuna hisob sanalmaydi. (107)
- QIzoh (yashil qutining oxirgi kichik qatori — E 42): Bir hafta va 7 hisob — kichik son: taklif yo'li ishlaganini ko'rsatadi, o'sishni isbotlamaydi. (97)
- Tugadi (199): harakat paneli yopiladi; sanoq qutilari, ixcham kartalar va qoida kartasi butun enga, «Mukofot: 3 · 2 tashkilotchiga» fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Sanoqni oching → Hisoblarni tekshiring (N/4) → Davom etish
- Keyingi bosiladigan joy: bashorat variantlari → «Sanoqni ochish» → «Qoidadan o'tkazish» (har kartada) → «Davom etish».
- O'qituvchi eslatmasi: 51 — 50 ga yetganini bayram qilmang: sonda 11 sinfdosh va mukofotga sanalmagan bir qurilmadagi hisob ham bor. «Bir hafta va 7 hisob — kichik son» gapini o'qib bering.
  Haftalik cheklov bu misolda mukofotni to'xtatmadi (uch mukofot — ikki tashkilotchiga); u qanday ishlashi — 3-amaliyotda, kod qatorida.
- ✎ Sonlar — tayanch 1.10, 1.13 aynan; har qutida birligi (sinf 7); 18 — «tashrif» (TAYANCHGA SAVOL 4); 51 va «44 + 7» — maketda, Mentor matnida yo'q (TAQIQLAR 5 — formula faqat maketda).
  Kataklar — Qaror-0 16 ning uch sharti; haftalik cheklov — alohida qator (to'rtinchi katak emas: u hisobga emas, taklif qilganga tegishli). «Yangi hisob» katagi Mentorning to'rt hisobida doim ✓ (to'rttasi asosiy harakat qilganlar) — 7 dan 4 ga o'tish qutilarda ko'rinadi.
  Joriy qator — sabab haqida xulosa yo'q (sinf 5): qoida natijani aytadi. QIzoh — tayanch halol gapi so'zma-so'z («7 kishi» — TAYANCHGA SAVOL 6). 2-savol qoidani boshqa holatda so'raydi (§106).

## 6 · Amaliyot 2 — formadagi taklif kodi va sanoq  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈16 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Formadagi taklif kodi taklif qilgan hisobni topsin.** (51)
- Mentor: Havoladagi taklif kodi ilovaga o'tmaydi — formaga maydon qo'shasiz; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Ro'yxatdan o'tish formasida majburiy bo'lmagan «Taklif kodi (bo'lsa)» maydoni bor; to'g'ri taklif kodi bilan ochilgan hisobda taklif qilgan yoziladi va u sanoqda ko'rinadi.
- Bandlar (hammasi o'z repo'ngizda):
  1. **Ochish** — ro'yxatdan o'tish formangizni oching (ilovada yoki saytda). Ikki savolga javob toping: maydon formaning qayerida turadi? Taklif kodi topilmasa, odam nimani ko'radi?
     (Mentor misolida: maydon «Parol» ostida; xabar — «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.»)
     Web-trekda: havola va forma bitta brauzerda ochilsa, saytingiz taklif kodini havoladan maydonga o'zi qo'yishi mumkin — xohlasangiz, buni qavsga yozing; maydon baribir tahrirlanadi.
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — ro'yxatdan o'tish yo'li va foydalanuvchilar jadvali; {forma joyi}.
     > Nima qilsin: formada yangi maydon «Taklif kodi (bo'lsa)» — majburiy emas. Taklif kodi yozilsa, bo'shliqlari olib tashlanib katta harfga o'tkazilsin (ab12cd ham AB12CD), keyin Backend shu `taklif_kodi` li hisobni topsin va yangi hisobga yozsin: `taklif_qilgan_id`. Topilmasa — hisob ochilmasin va maydon ostida chiqsin: «{topilmasa xabar}». Bo'sh qolsa — hisob avvalgidek ochilsin.
     > Nima buzilmasin: taklif kodisiz ro'yxatdan o'tish, kirish va {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; mavjud hisoblar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {forma joyi} — «masalan: `mobil/` — «Ro'yxatdan o'tish» ekrani, «Parol» maydoni ostida»
     - {topilmasa xabar} — «masalan: Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — «masalan: o'yin e'loni, qo'shilish, Pro va Telegram xabari»
     Tekshiruv («Nusxalash» bosilganda, bloklaydi): bu joyda kamida ikkita ish vergul bilan bo'lmasa yoki «hammasi», «ilova» kabi bitta so'z bo'lsa — Ikkita aniq ish yozing: masalan, kirish, e'lon berish. (54) (F-1007-461 sinfi)
     Yordam (Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — `POST /royxat` va `oyinchilar` jadvali; `mobil/` — «Ro'yxatdan o'tish» ekrani, «Parol» maydoni ostida.
     > Nima qilsin: formada yangi maydon «Taklif kodi (bo'lsa)» — majburiy emas. Taklif kodi yozilsa, bo'shliqlari olib tashlanib katta harfga o'tkazilsin (ab12cd ham AB12CD), keyin Backend shu `taklif_kodi` li hisobni topsin va yangi hisobga yozsin: `taklif_qilgan_id`. Topilmasa — hisob ochilmasin va maydon ostida chiqsin: «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.» Bo'sh qolsa — hisob avvalgidek ochilsin.
     > Nima buzilmasin: taklif kodisiz ro'yxatdan o'tish, kirish va o'yin e'loni, qo'shilish, Pro va Telegram xabari avvalgidek ishlasin; mavjud hisoblar o'zgarmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» — saytingizdagi ro'yxatdan o'tish formasi; manzilda `taklif` bo'lsa, maydon shu taklif kodi bilan to'lib turishi mumkin — qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "formada taklif kodi"` → `git push`. Render'da yangi deploy tugashini kuting.
     Kutayotganda agentga (SABOQ 52; «Nusxalash» bilan):
     > Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: taklif kodi bo'yicha hisob qidiriladigan qator va `taklif_qilgan_id` yoziladigan qator. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — tekshiruv akkaunti bilan; oxirida uni o'chirasiz:
     (1) Ilovada (Expo Go) «Hisobdan chiqish» → «Ro'yxatdan o'tish»: «Taklif kodi (bo'lsa)» maydoni turibdi. Avval yo'q taklif kodini yozing (masalan, `ZZZZZZ`) — hisob ochilmasligi va xabar chiqishi kerak.
     (2) Tekshiruv akkaunti oching: ism — «Tekshiruv», login — `tekshiruv1` (haqiqiy emas), taklif kodi — 1-amaliyotda lendingda ko'rgan taklif kodingiz, aynan o'sha ko'rinishda.
     (3) Neon SQL Editor'da: `SELECT taklif_qilgan_id FROM oyinchilar WHERE login = 'tekshiruv1';` — sizning hisobingiz `id` si chiqishi kerak (o'zingiznikini: `SELECT id FROM oyinchilar WHERE login = '{loginingiz}';`).
     (4) Sanoq — Mentor misolidagi so'rovlar (nomlar — mahsulotingizdagidek; asosiy harakat — 12-Modulda sanagan so'rovingizga `taklif_qilgan_id IS NOT NULL` sharti qo'shiladi):
         `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false AND taklif_qilgan_id IS NOT NULL;` — taklif kodi bilan ochilgan hisoblar: hozir tekshiruv akkaunti ham shu yerda (1).
         `SELECT COUNT(*) FROM oyinchilar o WHERE o.namuna = false AND o.taklif_qilgan_id IS NOT NULL AND (EXISTS (SELECT 1 FROM ishtirokchilar i WHERE i.oyinchi_id = o.id AND i.holat IN ('qoshildi', 'keladi')) OR EXISTS (SELECT 1 FROM oyinlar g WHERE g.tashkilotchi_id = o.id));` — ulardan asosiy harakat qilgani: hozir `0`.
         Umami'da `tashrif` yozuvlarini kanal bo'yicha oching — «taklif» kanalida 1-amaliyotda ochgan havolangiz ko'rinishi kerak (ko'rinmasa — biroz kutib, sahifani yangilang).
     (5) Tekshiruv akkauntini o'chiring: ilovada «Hisobni o'chirish» → «Rostdan o'chirasizmi?» — tasdiqlang. Birinchi so'rovni qayta yurgizing — son bittaga kamayishi kerak. Keyin o'z hisobingizga qayta kiring.
     Web-trekda: shu tekshiruv — saytingizda, kompyuterdagi yashirin oynada; «Hisobni o'chirish» — saytdagi o'sha tugma.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki kadr bir marta o'zi yuradi):
  - telefon: «Ro'yxatdan o'tish» — «Ism: Tekshiruv» · «Login: tekshiruv1» · «Parol: ••••••» · «Taklif kodi (bo'lsa): AB12CD»; oldingi kadrda `ZZZZZZ` ostida qizil qator «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.»
  - Neon natijalari: `taklif_qilgan_id` — tashkilotchi hisobining `id` si · taklif kodi bilan ochilgan — «1» · asosiy harakat qilgan — «0» · o'chirilgandan keyin — «0»; yorliq «tekshiruv akkaunti — keyin o'chiriladi»
  - web-trekda: brauzer oynasi — sayt formasi, maydon havoladan to'lgan.
- Tekshiruv kartasi (4-band oxirida, «Bajardim»dan oldin; dars holatida — 3, 8-darslar naqshi; F-1007-468): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Taklif kodi bilan ochilgan hisob taklif qilganga bog'landi va sanoqda ko'rindi; tekshiruv akkaunti o'chirildi. (108)
- Qator (`QIzoh`, natija ostida): Sinfdagi tekshiruv akkaunti haqiqiy sanoqqa qo'shilmaydi — shuning uchun u o'chiriladi. (85)
- Ulgurmasangiz: Umami tekshiruvini dars oxiriga qoldiring; tekshiruv akkauntini o'chirishni o'tkazib yubormang. «Davom etish» 4-band «Bajardim»idan keyin ochiladi — 3-amaliyot ham ro'yxatdan o'tish kodiga tegadi.
- Nishon (bonus): Code Counted — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ Talab zinapoyasi — tayyor talab + 3 joy. Xabar matni — TAYANCHGA SAVOL 13; noto'g'ri taklif kodida hisob ochilmaydi (aks holda odam taklif kodini xato yozganini bilmay qoladi). Katta-kichik harf — talabda yo'q (A-bo'lim 4; O'qituvchi eslatmasi 1-ekranda).
  Tekshiruv akkaunti forma orqali ochiladi (`namuna = false`) — sanoqda ko'rinishi uchun; «Hisobni o'chirish» bilan o'chiriladi (12-Modul 9.37 g, sinf 10). Asosiy harakat SQL — 12-Modul 9.23 + bitta shart (⛔ «qur»: `ishtirokchilar`, `oyinlar.tashkilotchi_id` nomlari — tayanch 6).
  Umami — tashrif, Database — hisob: ikki son ayirilmaydi (5-ekran). Umami interfeysidagi menyu nomlari yozilmadi — umumiy so'z (P-028).

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (yorliqsiz — SABOQ 6)
- Savol: **Mentor qoidasida taklif qilganning telefonida ochilgan hisob o'yinga qo'shildi. Mukofot?** (10 so'z)
  - A · ✔ Berilmaydi — bir qurilmadagi hisob sanalmaydi (45)
  - B · Beriladi — asosiy harakat qilgani yetarli (41)
  - C · Beriladi — taklif kodi formaga to'g'ri yozilgan (47)
  - D · Berilmaydi — o'yinga qo'shilish sanalmaydi (42)
- Kalit: **A** (index 0). «Beriladi / Berilmaydi — sabab» shaklida, ikkitadan (S-006); distraktorlar uch turkumdan (sinf 8): B — faqat 1-shartga qaraydi · C — taklif kodi to'g'riligi (qoidaning sharti emas) · D — asosiy harakat ta'rifini noto'g'ri tushunish.
- To'g'ri izohi: Taklif qilgan bilan bir qurilmada — bu hisob sanalmaydi. (56)
- Xato izohlari (≤60):
  - B: Asosiy harakat bor. Hisob qaysi qurilmada ochilgan? (51)
  - C: Taklif kodi to'g'ri — lekin qurilma-chi? (40)
  - D: Mentor misolida o'yinga qo'shilish — asosiy harakat. (52)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 5-ekranda Mentorning to'rt hisobi; savol — yangi holat («taklif qilganning telefonida» — bir qurilma ma'nosi so'z bilan), javob kartadan ko'chirilmaydi (§106). «Mentor qoidasida» — chegarasi (sinf 4).

## 8 · Amaliyot 3 — mukofot va uch shart  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈25 daq)
- Eyebrow: Amaliyot 3 · o'z repo'ngiz
- Sarlavha: **Mukofot faqat qoidaga mos taklif uchun berilsin.** (48)
- Mentor: Mukofot qoidasini o'z mahsulotingiz uchun qavslarda yozasiz; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Taklif kodi bilan ochilgan hisob birinchi marta asosiy harakat qilganda mukofot bir marta tekshiriladi: bir qurilma va namuna hisob sanalmaydi, haftalik cheklov bor.
- Bandlar (hammasi o'z repo'ngizda):
  1. **Ochish** — uch savolga javob toping: mahsulotingizda asosiy harakat nima (12-Modulda sanagansiz)? Mukofot nima bo'ladi? Bir hisobga haftasiga nechta?
     (Mentor misolida: asosiy harakat — o'yinga qo'shilish yoki o'yin e'lon qilish; mukofot — Pro'ning bepul haftasi, test rejimda; haftasiga ko'pi bilan 2.)
     Mukofot — pul, chegirma yoki narsa emas. Mahsulotingizda pullik qulaylik bo'lsa (4-darsda qurgansiz) — mukofot uning bepul muddati; bo'lmasa — mukofot qavsiga «hozircha yo'q — faqat natija yozilsin» deb yozing: qoida baribir har taklifning natijasini yozadi.
     Qoida qurilmani taniydi: ilova hisob ochilgan va havola ulashilgan qurilmaning ID sini Backend'ga yuboradi. Web-trekda — brauzer ID (10-Modul).
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring ({ulashish joyi} — 1-amaliyotda yozganingiz, oldindan qo'yiladi):
     > Qayerda: `backend/` — foydalanuvchilar jadvali, ro'yxatdan o'tish va asosiy harakat yo'llari; {ulashish joyi}; `lending/maxfiylik.html`.
     > Nima qilsin: ilova ro'yxatdan o'tishda, hisobga kirishda va havola ulashilganda shu qurilma ID sini Backend'ga yuborsin; Backend uni hisobning qurilmalari ro'yxatiga yozsin (yangi jadval: hisob va qurilma ID jufti noyob; eskisi o'chmaydi — hisob bir nechta qurilmada ishlatilishi mumkin).
     > Taklif kodi bilan ochilgan hisob birinchi marta {asosiy harakat} — asosiy harakat avval saqlansin; keyin alohida Database ishida Backend bir marta tekshirsin: 1) ikkala hisob ham namuna emas; 2) yangi hisob ochilgan qurilma ID si taklif qilganning qurilmalari ichida yo'q (taklif qilganning qurilmasi hali yozilmagan bo'lsa — mukofot yo'q); 3) taklif qilgan hisob shu hafta (dushanbadan yakshanbagacha, Toshkent vaqti) {haftalik cheklov} tadan kam mukofot olgan — sanashda taklif qilgan hisob qatori qulflansin (bir vaqtdagi ikki so'rov ham cheklovdan oshirmasin).
     > Natijani yangi jadvalga yoz — taklif natijalari: kim taklif qilgan, kim taklif qilingan (bitta hisobga bitta yozuv, noyob), natija — `berildi`, `bir-qurilma`, `namuna`, `nomalum` yoki `cheklov`, va vaqti. `berildi` bo'lsa, shu Database ishining ichida: {mukofot}. Taklif qilingan hisob o'chirilsa — yozuv qoladi, undagi hisob havolasi bo'shatiladi (haftalik sanoq buzilmasin). Tekshiruvda xato bo'lsa — asosiy harakat buzilmasin: xato logga yozilsin, yozuv qo'shilmasin, keyingi asosiy harakatda yana tekshirilsin.
     > {ulashish joyi} ostida bitta kulrang qator: «{qoida qatori}».
     > `lending/maxfiylik.html` dagi «Qaysi ma'lumot?» va «Nima uchun?» javoblariga qo'sh: «Taklif kodi bilan kelgan hisoblarda kim kimni taklif qilgani, mukofot natijasi va vaqti, hisob ishlatilgan qurilma ID lari saqlanadi — mukofotni qoidaga ko'ra berish va bir qurilma ID li hisoblarni ajratish uchun.» Mukofot bo'lsa — `lending/oferta.html` ga (7-dars) «Taklif mukofoti» bandi: qoida qatori va qachon berilmasligi (namuna hisob, bir qurilma ID, taklif qilganning qurilmasi noma'lum, haftalik cheklov). Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.
     > Nima buzilmasin: pul, chegirma yoki boshqa narsa berilmasin — faqat {mukofot}; asosiy harakat avvalgidek ishlasin; qurilma ID dan boshqa ma'lumot so'ralmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {asosiy harakat} — «masalan: o'yinga qo'shilsa yoki o'yin e'lon qilsa»
     - {haftalik cheklov} — «masalan: 2»
     - {mukofot} — «masalan: taklif qilganning `pro_gacha` si 7 kunga uzaysin (o'tgan yoki bo'sh bo'lsa — bugundan)»
     - {qoida qatori} — «masalan: Siz taklif qilgan yangi o'yinchi o'yinga qo'shilsa yoki o'yin e'lon qilsa — Pro'ga 7 kun qo'shiladi (haftasiga ko'pi bilan 2 marta).»
     Yordam (Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `backend/` — `oyinchilar` jadvali, `POST /royxat`, `POST /oyinlar` va `POST /oyinlar/:id/qoshilish`; `mobil/` — «Ro'yxatdan o'tish» ekrani va «O'yin» ekranidagi «Havolani ulashish» tugmasi; `lending/maxfiylik.html`.
     > Nima qilsin: ilova ro'yxatdan o'tishda, hisobga kirishda va «Havolani ulashish» bosilganda shu qurilma ID sini Backend'ga yuborsin; Backend uni `oyinchi_qurilmalari` ga yozsin (`oyinchi_id` va `qurilma_id` jufti noyob; eskisi o'chmaydi).
     > Taklif kodi bilan ochilgan hisob birinchi marta o'yinga qo'shilsa yoki o'yin e'lon qilsa — qo'shilish yoki e'lon avval saqlansin; keyin alohida Database ishida Backend bir marta tekshirsin: 1) ikkala hisob ham namuna emas; 2) yangi hisob ochilgan qurilma ID si taklif qilganning `oyinchi_qurilmalari` ichida yo'q (taklif qilganniki hali yozilmagan bo'lsa — mukofot yo'q); 3) taklif qilgan hisob shu hafta (dushanbadan yakshanbagacha, Toshkent vaqti) 2 tadan kam mukofot olgan — sanashda taklif qilganning `oyinchilar` qatori qulflansin (`FOR UPDATE`).
     > Natijani yangi jadvalga yoz: `taklif_natijalari` — `id`, `taklif_qilgan_id`, `taklif_qilingan_id` (noyob; hisob o'chirilsa — bo'shatiladi, yozuv qoladi), `natija` (`berildi` · `bir-qurilma` · `namuna` · `nomalum` · `cheklov`), `yaratilgan`. `berildi` bo'lsa, shu Database ishining ichida taklif qilganning `pro_gacha` si 7 kunga uzaysin (o'tgan yoki bo'sh bo'lsa — bugundan). Tekshiruvda xato bo'lsa — qo'shilish va e'lon buzilmasin: xato logga yozilsin, yozuv qo'shilmasin, keyingi harakatda yana tekshirilsin.
     > «Havolani ulashish» ostida bitta kulrang qator: «Siz taklif qilgan yangi o'yinchi o'yinga qo'shilsa yoki o'yin e'lon qilsa — Pro'ga 7 kun qo'shiladi (haftasiga ko'pi bilan 2 marta).»
     > `lending/maxfiylik.html` dagi «Qaysi ma'lumot?» va «Nima uchun?» javoblariga qo'sh: «Taklif kodi bilan kelgan hisoblarda kim kimni taklif qilgani, mukofot natijasi va vaqti, hisob ishlatilgan qurilma ID lari saqlanadi — mukofotni qoidaga ko'ra berish va bir qurilma ID li hisoblarni ajratish uchun.» Mukofot bo'lsa — `lending/oferta.html` ga (7-dars) «Taklif mukofoti» bandi: qoida qatori va qachon berilmasligi (namuna hisob, bir qurilma ID, taklif qilganning qurilmasi noma'lum, haftalik cheklov). Gapni kod bilan solishtir: kodda shu ish uchun saqlanadigan, lekin gapda yo'q ma'lumot bo'lsa — uni ayt, o'zing qo'shma.
     > Nima buzilmasin: pul, chegirma yoki boshqa narsa berilmasin — faqat Pro muddati; o'yin e'loni va qo'shilish avvalgidek ishlasin; qurilma ID dan boshqa ma'lumot so'ralmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): qurilma ID o'rnida — brauzer ID (10-Modulda yasagansiz); «Havolani ulashish» o'rnida — 1-amaliyotdagi ulashish joyingiz; qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "taklif mukofoti va qoida"` → `git push`. Render'da yangi deploy tugashini kuting; maxfiylik sahifasi Netlify'da odatda o'zi yangilanadi.
     Mobil trekda brauzer ko'rinishini ham yangilang — 2-tekshiruvga kerak: `npx expo export -p web` → `netlify deploy --prod --dir dist` (12-Moduldagi yo'l). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Kutayotganda agentga (SABOQ 52; «Nusxalash» bilan):
     > Yozgan kodingda to'rt joyni fayl nomi va qator raqami bilan ko'rsat: namuna tekshiriladigan qator, qurilma ID lar solishtiriladigan qator, haftalik cheklov sanaladigan qator va mukofot beriladigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — uch tekshiruv akkaunti bilan; o'z hisobingiz ishlatilmaydi — haqiqiy Pro muddatingiz o'zgarmaydi (F-1007-468). Har biridan keyin tekshiruv kartasida «Kutilganidek» yoki «Boshqacha»ni tanlang:
     (1) Agent ko'rsatgan to'rt qatorni o'qing: avval namuna, qurilma va cheklov tekshiriladi, mukofot — eng oxirida; asosiy harakat mukofot tekshiruvidan oldin saqlanadi.
     (2) **Taklif qiluvchi** — telefoningizda «Hisobdan chiqish» → ro'yxatdan o'tish formasida tekshiruv akkaunti `tekshiruv1` (shu qurilma ID si yoziladi). Neon: `SELECT id, taklif_kodi FROM oyinchilar WHERE login = 'tekshiruv1';` — kodni yozib oling.
     (3) **Bir xil ID** — shu telefonda «Hisobdan chiqish» → `tekshiruv1` kodi bilan `tekshiruv2` → asosiy harakat — real foydalanuvchilarga tegmaydigan joyda (Mentor misolida — namuna o'yinga «Qo'shilaman»).
         Neon (jadval nomi — agent aytganidek; Mentor misolida `taklif_natijalari`): `tekshiruv2` ning natijasi — `bir-qurilma`; `tekshiruv1` ning `pro_gacha` si o'zgarmagan. Kartada belgilang.
     (4) **Boshqa ID** — sherigingiz o'z telefoni brauzerida ilovangizning brauzer ko'rinishini ochadi (web-trekda — saytingizni), `tekshiruv1` kodi bilan `tekshiruv3` ochadi va xuddi shu asosiy harakatni qiladi.
         Sherik bo'lmasa — o'zingiz kompyuterdagi yashirin oynada: bu boshqa qurilma emas, boshqa brauzer ID (alohida xotira) — qoida uchun shunisi yetadi.
         Neon: `tekshiruv3` ning natijasi — `berildi`; `tekshiruv1` ning `pro_gacha` si 7 kunga uzaygan. Kartada belgilang.
         Ikkalasi ham bo'lmasa — agentga: «Tekshiruv uchun ro'yxatdan o'tish yo'li bilan bitta hisob och (namuna ism va login, haqiqiy emas), taklif kodi — {tekshiruv1 kodi}, qurilma ID — yangi tasodifiy; namuna o'yinga qo'shil. Qaysi hisob va qaysi `id` ekanini ayt.»
     (5) Tozalash — agentga: «Bugungi tekshiruv hisoblari (`tekshiruv1`, `tekshiruv2`, `tekshiruv3`) va ularning taklif natijalari, qurilma yozuvlarini `id` lari bilan ko'rsat. Men «Davom et» desam — faqat shularni o'chir.»
         Ro'yxatni o'qing, keyin «Davom et». Neon: `SELECT COUNT(*) FROM oyinchilar WHERE login LIKE 'tekshiruv%';` → `0`.
     (6) Maxfiylik sahifangizni va ofertangizni oching — yangi gap va «Taklif mukofoti» bandi turibdi. Namuna va haftalik cheklov — (1) da kodda ko'rdingiz; bugun tekshiruv akkaunti bilan sinalmaydi.
     «Boshqacha» bo'lsa — agentga: «{tekshiruv}: kutganim {nima kutdim}, bo'ldi {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → o'sha tekshiruvni qayta qiling (tekshiruv akkauntini yana oching va o'chiring).
     Oxirida (mobil trek): odamlardagi ilova uchun yangi o'rnatish fayli kerak — `eas build -p android --profile preview`. Navbatni kutmang: «Bajardim»ni bosing va davom eting.
     Fayl dars oxirigacha tayyor bo'lsa — lendingdagi «Android: ilovani o'rnatish» havolasini almashtiring; bo'lmasa — keyingi dars boshida.
- Tekshiruv kartasi (chapda, 4-band ichida; ikkitasi — (3) va (4), bittadan): nima qilinadi · nima kutiladi · tugmalar «Kutilganidek» · «Boshqacha» — dars holatida (`ccProgress`), yangi `pm-…` kaliti yo'q.
- Blok ostida (faqat mobil trekda, oxirgi «Bajardim»dan keyin; ikki tugma, bittasi tanlanadi): «Havola almashtirildi» · «Fayl navbatda» — yakundagi yorliq shundan (12-Modul 9-darsi naqshi).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (uch kadr bir marta o'zi yuradi):
  - Neon jadvali `taklif_natijalari` (uch ustun: taklif qilgan · taklif qilingan · `natija`): `tekshiruv1` · `tekshiruv2` · `bir-qurilma` (qizil) → `tekshiruv1` · `tekshiruv3` · `berildi` (yashil)
  - `tekshiruv1` qatori: `pro_gacha` — «+7 kun» (yashil, bir lahza) · yorliq «tekshiruv hisobi — keyin o'chiriladi»
  - telefon: «O'yin» ekrani — «Havolani ulashish», ostida kulrang qoida qatori: «Siz taklif qilgan yangi o'yinchi o'yinga qo'shilsa yoki o'yin e'lon qilsa — Pro'ga 7 kun qo'shiladi (haftasiga ko'pi bilan 2 marta).»
  - web-trekda: o'sha jadval va sayt sahifasi.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - ikkalasi «Kutilganidek» — Bir xil ID dagi hisob sanalmadi, boshqa ID dagisi mukofot berdi; tekshiruv izlari tozalandi. (92)
  - birortasi «Boshqacha» — Tekshiruv tugamagan: «Boshqacha» chiqqanini tuzatib, qayta tekshiring. (70)
  - faqat bir xil ID belgilangan — Bir xil ID tekshirildi; boshqa ID tekshiruvi qoldi. (51)
- Kulrang qator (yashil ostida): Namuna va haftalik cheklov — kodda bor, tekshiruv akkaunti bilan sinalmagan. (74)
- Qator (`QIzoh`, natija ostida): Qoida bir xil qurilma ID ni ushlaydi; boshqa ID dagi hisobni ajratmaydi — shuning uchun haftalik cheklov bor. (109)
- Ulgurmasangiz: (4) boshqa ID tekshiruvini keyingi dars boshiga qoldiring — (5) tozalash ham o'sha paytda; tekshiruv akkauntlarini o'chirishni o'tkazib yubormang. «Davom etish» 3-banddan keyin ochiladi.
- Nishon (bonus): Rule Checked — oxirgi «Bajardim»da, ikkala tekshiruv belgilangan bo'lsa (natijasidan qat'i nazar — tavsif qilingan ishni aytadi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ Talab zinapoyasi — tayyor talab + 4 joy (mahsulot qarori: asosiy harakat, cheklov soni, mukofot, qoida qatori) + `{ulashish joyi}` 1-amaliyotdan (dars holati). Uch shart va cheklov — Qaror-0 16, tayanch 1.10 aynan; `oyinchi_qurilmalari`, `taklif_natijalari` holatlari (F-1007-468), hafta chegarasi, `nomalum`, qoida qatori, maxfiylik gapi — TAYANCHGA SAVOL 7–11, 16, 19.
  Tekshiruv: bir qurilma — o'quvchining o'z telefoni (agentsiz); boshqa qurilma — sherik birinchi, yashirin oyna ikkinchi, agent — zaxira (sinf 10). Tekshiruv akkauntlari forma orqali (`namuna = false`) — aks holda 1-shart ularni sanamaydi; tekshiruvdan keyin darhol o'chiriladi (12-Modul 9.37 g) — TAYANCHGA SAVOL 18.
  F-1007-468: taklif qiluvchi ham tekshiruv hisobi (`tekshiruv1`) — o'quvchining haqiqiy Pro muddati o'zgarmaydi, qaytarish (`UPDATE`) yo'q. Namuna va cheklov — telefonda sinalmagan; yashil qator buni da'vo qilmaydi, kulrang qator ochiq aytadi (12-Modul 09-FILTR 40 naqshi).
  Yashirin oyna «boshqa ID» bo'lib o'tadi (o'sha kompyuter, boshqa brauzer xotirasi) — QIzohdagi halol chegara aynan shu (bir odam ikki qurilma bilan qoidani chetlab o'ta oladi). Brauzer ko'rinishi — ⛔ «qur» (Shubhali 6).

## 9 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Formadagi taklif kodi» · 7 — «2 — Bir qurilma»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (texnik darslar standarti, 192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ Uch blok bajarildi (faqat uchala blok bajarilgan va 3-amaliyotda ikkala tekshiruv «Kutilganidek» bo'lsa; aks holda yorliq yo'q) · {N}/2 to'g'ri ·
  mobil trekda, 3-amaliyotda «Fayl navbatda» tanlangan bo'lsa — kulrang yorliq «O'rnatish fayli navbatda»
- Sarlavha (bloklar holatiga qarab, P-046; sinf 6 — har holat rost, E 54):
  - uchala blok, hamma kartalar «Kutilganidek»: **Havola, sanoq va mukofotning ikki holati tekshirildi.** (53)
  - 1 yoki 2-blok kartasi «Boshqacha»: **Taklif yo'li qurildi — bitta joyni tuzatish qoldi.** (50)
  - uchala blok, «Boshqacha» bor yoki bitta tekshiruv qolgan: **Havola va sanoq tayyor — mukofot tekshiruvi tugamagan.** (54)
  - 1 va 2-blok («Kutilganidek»): **Havola va sanoq tayyor — mukofot qoidasi qoldi.** (47)
  - faqat 1-blok («Kutilganidek»): **Havola tayyor — formadagi taklif kodi va mukofot qoldi.** (55)
  - 3-blok bor, lekin 1 yoki 2-blok yo'q: **Mukofot qoidasi bor — oldingi bloklarni tugating.** (49)
  - hech biri: **Taklif havolasi hali qurilmagan — bloklarni tugating.** (53)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5):
  - Taklif havolasi — hisobning o'z taklif kodi yozilgan havola.
  - Mentor ilovasida havoladagi taklif kodi APK'ga o'tmaydi — shuning uchun formada maydon bor.
  - Bu darsda Umami tashrifni kanal bilan sanaydi; kim taklif qilganini Database biladi.
  - Bu misolda mukofot yangi hisob asosiy harakat qilgach beriladi; bir qurilmadagi va namuna hisob sanalmaydi.
  - Mentor misolidagi bir haftalik 7 hisob taklif yo'li ishlaganini ko'rsatadi, o'sishni isbotlamaydi.
- Uyga vazifa — yo'q (loyiha kuni; tayanch 4). `uyga: null`. «O'rnatish fayli navbatda» yorlig'i ostida bitta qator: Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.
- Keyingi dars — «Mahsulotingiz hozir qayerda?»: roadmap bilan solishtirish va shaxsiy hisobot.
- Nishonlaringiz — N/4
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- ✎ «tekshirildi» — faqat hamma kartalar «Kutilganidek»da (o'quvchi o'zi ko'rgan natija); «mukofot ishlaydi» deyilmaydi — namuna va cheklov sinalmagan, sarlavha «ikki holati» deydi (F-1007-468). «tayyor» — o'sha blok kartasi «Kutilganidek» bo'lsa. Sarlavhalar trek bo'yicha farq qilmaydi (havola, sanoq, mukofot ikkala trekda bor).
  «Endi siz bilasiz» — bilim, ikkala trekka to'g'ri (2-qator «Mentor ilovasida» bilan chegaralangan). «Keyingi dars» qatori — App.jsx `m11-11` nomi va osti (T-038: boshqa joyda va'da yo'q).

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Own Link** — Formada taklif kodi maydoni nega kerakligini topdingiz (4-ekran, 1-savol)
- **Fair Reward** — Bir qurilmadagi hisob mukofotga sanalmasligini topdingiz (7-ekran, 2-savol)
- **Code Counted** — Taklif kodi bilan ochilgan tekshiruv akkauntini sanab, o'chirdingiz (2-amaliyot, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- **Rule Checked** — Bir xil ID va boshqa ID holatini tekshirdingiz (3-amaliyot, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q; tavsif — qilingan ish, «mukofot ishlaydi» emas
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 07.10: Own Link · Fair Reward · Code Counted · Rule Checked — 0). Ikki blok nishoni — ish uchun (P-048), tekin emas.

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: PM qismi — raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Taklif kodi APK'ga havoladan o'tmaydi»
   - 1 · Havola lendingni ochadi: «Taklif kodi: AB12CD».
   - 2 · APK o'rnatiladi — taklif kodi ilovaga o'tmaydi.
   - 3 · Yangi o'yinchi taklif kodini formaga o'zi yozadi.
   - Sinfga savol: Taklif kodisiz ham ro'yxatdan o'tsa bo'ladimi?
2. 2-savol (7-ekran) — «Mukofot qoidasining uch sharti»
   - 1 · Yangi hisob asosiy harakat qildi.
   - 2 · Taklif qilgan bilan boshqa qurilmada ochilgan.
   - 3 · Namuna hisob emas; haftasiga ko'pi bilan 2 mukofot.
   - Sinfga savol: Oiladagi bitta telefondan ochilgan hisob sanaladimi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Taklif havolasi nima? | Har foydalanuvchining o'z havolasi: unda uning taklif kodi bor | Inglizchasi: referral |
| Taklif havolasi ochilsa, lendingda nima ko'rinadi? | «Taklif kodi: …» qatori | Ostida: «Ro'yxatdan o'tishda shu taklif kodini yozing.» |
| 12-Modulda «Havolani ulashish» bilan nima ulashilardi? | Hammada bir xil lending havolasi — `?kanal=ilova` bilan | Kim ulashgani bilinmasdi |
| Mentor ilovasida havoladagi taklif kodi APK'ga o'tadimi? | Yo'q — shuning uchun formada «Taklif kodi (bo'lsa)» maydoni bor | Yangi o'yinchi uni lendingdan ko'rib yozadi |
| Kim kimni taklif qilgani qayerda yoziladi? | Database'da — yangi hisobda taklif qilgan yoziladi | Umami'ga faqat kanal ketadi |
| Mukofot pul yoki chegirma bo'la oladimi? | Yo'q — Mentor misolida u Pro'ning bepul haftasi | Test rejimdagi pullik obuna muddati |
| Mukofot qachon beriladi? | Taklif kodi bilan ochilgan yangi hisob asosiy harakat qilgach | Mentor misolida: o'yinga qo'shilsa yoki o'yin e'lon qilsa |
| Mentor qoidasida qaysi hisob mukofotga sanalmaydi? | Taklif qilgan bilan bir qurilmadagi va namuna hisob | Bir hisobga haftasiga ko'pi bilan 2 mukofot |
| «Bir qurilma» qoidasi nimani ajrata olmaydi? | Ikkinchi qurilmadan ochilgan hisobni | Shuning uchun haftalik cheklov ham bor |
| Mentor misolida bir haftada taklif kodi bilan nechta hisob ochildi? | 7 ta; 4 tasi asosiy harakat qildi | Mukofot — 3 ta: bitta hisob taklif qilgan bilan bir qurilmada edi |
| Umami'dagi tashrif va Database'dagi hisob — bir o'lchovmi? | Yo'q — biri sahifa ochilishi, biri ro'yxatdan o'tgan hisob | Shuning uchun ular ayirilmaydi |
| Nega sinfdagi tekshiruv akkaunti o'chiriladi? | U haqiqiy foydalanuvchi emas — sanoqqa qo'shilmasin | «Hisobni o'chirish» bilan |

- S-027: har old tomon — to'liq savol, «?» bilan. Har javobdagi so'z darsda bor (taklif havolasi, taklif kodi, lending qatori — 2, A1 · APK — 2, 4 · Umami, kanal, Database — 2, A1 QIzoh · mukofot, shartlar — 5, A3 · ikkinchi qurilma — A3 QIzoh · 7, 4 — 5 · tashrif va hisob — 5, A2 · «Hisobni o'chirish» — A2, A3 QIzoh).
- Kartochkalar arena savollarining nusxasi emas (har biri boshqa shaklda — §144).
- Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
Har savolni aytgan ekran — qavsda. Uzunliklar — `md10/olchov.py` (pastda «O'lchov»).
1. Ikki tashkilotchi 12-Moduldagi bir xil havolani yubordi. Umami nimani ko'radi? (0)
   - ✔ A — Tashrif «ilova» kanalidan kelganini
   - B — Havolani qaysi tashkilotchi yuborganini
   - C — Tashkilotchining login va ismini
   - D — Kim ro'yxatdan o'tib, o'ynaganini
2. Mentor misolida taklif kodi nimadan iborat? (2, A1)
   - A — Ismdan va oxirida ikki raqamdan
   - ✔ B — Olti belgidan: katta harf va raqam
   - C — Telefon raqamining oxirgi qismidan
   - D — O'yin raqamidan va e'lon kunidan
3. Taklif havolasi ochilganda Mentor lendingi Umami'ga nima yuboradi? (2, A1)
   - A — Taklif kodini va kanal belgisini
   - B — Taklif qilgan hisobning loginini
   - ✔ C — Faqat kanal belgisini: «taklif»
   - D — Hech narsa — Umami havolani ko'rmaydi
4. Taklif kodisiz kelgan odam Mentor ilovasida ro'yxatdan o'ta oladimi? (A2)
   - A — Yo'q — taklif kodi majburiy maydon
   - B — Yo'q — faqat havola orqali kirsa bo'ladi
   - C — Ha — lekin faqat iPhone'dagi brauzerda
   - ✔ D — Ha — maydon «(bo'lsa)», majburiy emas
5. Mentor misolida taklif uchun mukofot nima? (5)
   - ✔ A — Pro'ning bepul haftasi, test rejimda
   - B — Taklif qilgan odamga so'mda pul
   - C — Keyingi pullik obunaga chegirma
   - D — Yangi hisobga Pro'ning bir oylik muddati
6. Taklif kodi bilan ochilgan hisob hali hech narsa qilmagan. Mukofot-chi? (5)
   - A — Bor — ro'yxatdan o'tgani yetarli
   - ✔ B — Hali yo'q — asosiy harakat kutiladi
   - C — Bor — taklif kodi to'g'ri yozilgan
   - D — Yo'q — bu hisob endi umuman sanalmaydi
7. Mentor qoidasida bir hisobga haftasiga nechta mukofot? (5, A3)
   - A — Har taklif uchun — hech cheklovsiz
   - B — Bitta — oyiga faqat bir marta
   - ✔ C — Ko'pi bilan ikkita — haftasiga
   - D — Faqat birinchi taklif uchun
8. Ikkinchi telefoni bor odam o'zini taklif qildi. «Bir qurilma» qoidasi-chi? (A3)
   - A — Ushlaydi — taklif kodi bir xil
   - B — Ushlaydi — ikki login o'xshash
   - C — Ushlamaydi — asosiy harakat yo'q
   - ✔ D — Ushlamaydi — qurilmalar har xil
9. Mentor misolida 18 tashrif va 7 hisob. Ayirsa bo'ladimi? (5)
   - ✔ A — Yo'q — biri tashrif, biri hisob
   - B — Ha — 11 kishi ro'yxatdan o'tmagan
   - C — Ha — 11 qurilma ilovani o'chirgan
   - D — Yo'q — Umami sonlari ishonchsiz
10. Mentor misolida jami ro'yxatdan o'tgan — 51. Bu son nima? (5)
   - A — Har hafta o'yinga keladigan odamlar
   - ✔ B — Avvalgi 44 va taklif kodi bilan ochilgan 7 hisob
   - C — Faqat taklif havolasi orqali ochilgan hamma hisob
   - D — 50 maqsadiga yetildi — endi ish tugadi
11. Sinfda tekshiruv akkaunti ochdingiz. Keyin nima qilasiz? (A2, A3)
   - A — Sanoqda qoldirasiz — u ham hisob
   - B — Login va parolini o'zgartirasiz
   - ✔ C — «Hisobni o'chirish» bilan o'chirasiz
   - D — Sherigingizga berib, ishlatib turasiz
12. Havolangizni qayerga yuborasiz? (A1, 12-Modul olti bandli ro'yxat)
   - A — Shahar futbol kanaliga — odam ko'p
   - B — Mahalla guruhiga — egasidan so'ramay
   - C — Tanimagan tashkilotchilarga — shaxsiyga
   - ✔ D — O'z jamoangizga — siz a'zo guruhga

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Ha/Yo'q savollari — 4 (Ha/Yo'q), 6 (Bor/Yo'q), 8 (Ushlaydi/Ushlamaydi), 9 (Ha/Yo'q): har birida ikkitadan (S-006). 1 — distraktorlar uch turkumdan (kim yuborgani · shaxsiy ma'lumot · Database ma'lumoti); 6 — D «umuman sanalmaydi» — vaqtinchalik holatni doimiy deb o'qish yanglishi. Uchala noto'g'ri variant bitta turkumdan emas (sinf 8): 2 — ism, telefon (shaxsiy) va o'yin (hisobga bog'liq emas) · 3 — taklif kodi, login, «ko'rmaydi» · 12 — a'zo emas, ruxsatsiz, notanish (olti bandli ro'yxatning uch xil bandi).
10 — D «ish tugadi» — 51 ni baho deb o'qish yanglishi (A-bo'lim 4: 51 — baho emas); C — «hammasi taklif bilan» yanglishi. Kafolat so'zlari variantlarda ham yo'q («doim», «har doim» — 0).
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari ru'da ham o'sha; R-008): taklif havolasi · taklif kodi · `?taklif=` · `kanal=taklif` · «Havolani ulashish» · «Taklif kodi (bo'lsa)» · sanoq · tashrif · hisob · qurilma ID · mukofot · Pro · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **2 (C)** · s7 **0 (A)**; bloklar (3, 6, 8) — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m11-10-v1`, `lessonTitle` — «Loyiha kuni: taklif havolasi va mukofot». App.jsx `m11-10` ga `comp: ReferralDayLesson` — «qur» bosqichida (asosiy seans).
2. **Bitta manba (180):** `TAKLIF_SAHNA` (1-telefon, brauzer/lending, Backend tuguni va `oyinchilar` mini-jadvali, 2-telefon va forma; konvert turlari `havola` · `apk` · `sorov`; holat ranglari D3) · `NAMUNA_KOD` (`AB12CD`) · `NAMUNA_HAVOLA` (`maydon-jamoa-….netlify.app/?taklif=AB12CD&kanal=taklif`) ·
   `ESKI_HAVOLA` (`…/?kanal=ilova` — 0-ekran) · `MENTOR_SANOQ` (18 tashrif · 7 hisob · 4 hisob · 51 — 44 va 7 · mukofot 3 · 2 tashkilotchiga · bir qurilma 1) · `HISOBLAR` (5-ekran: 4 karta, 3-chi — bir qurilma) · `QOIDA_KATAKLAR` (uch katak + cheklov qatori) ·
   `QOIDA_QATORI` (ilovadagi kulrang qator — A3 kutilgan natija) · `XABAR_TOPILMADI` («Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.») — 0, 1, 2, 5-ekranlar, bloklar o'ngi va kartochka shundan o'qiydi.
3. **`TaklifSahna`** komponenti (nusxa emas — 12-Modul 9-darsdagi ikki telefonli sahna naqshida, darslar mustaqil): `telefonlar` (1 yoki 2), `brauzer` (bo'sh · lending · lending + taklif kodi), `forma` (yo'q · bo'sh · to'ldirilgan), `jadval` (qatorlar), `konvertlar`, `qutilar` (Umami), `kengaygan` (5-ekran).
   Telefon ≈170×272, yorliq ramka ustida; brauzer — nuqtalar + manzil satri; Backend — qorong'i tugun, mini-jadval. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ts-ulash ts-och ts-apk ts-yoz ts-sanoq ts-qoida`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4). Karta maydoni hech bir holatda chizilmaydi.
4. **0-ekran `QKirish`:** maket — 1-telefon («O'yin» ekrani) + ikki chat pufagi (bir xil havola) + Umami qutisi; javobdan keyin pufaklardagi havola yonib ustma-ust tushadi va kulrang qator chiqadi (kirish animatsiyasi, SABOQ 19).
5. **2-ekran `QTushuncha`:** `QBashorat`/`QTaxmin` (yopilmaydi — ixcham qator; natija yashil qutining birinchi qatori — E 42), to'rt harakat navbat bilan (faol tugma halqada, qolganlari xira), konvert animatsiyalari, lending qatori, Umami qutisi «+1 tashrif»,
   APK konverti va bo'sh maydon («taklif kodi ilovaga o'tmadi» yorlig'i), maydonga harfma-harf yozish, `POST /royxat` konverti, jadvalga yangi qator, joriy qator, `zoom`, `tugadi`. Holat bosishlar ro'yxatidan (P-046).
6. **5-ekran `QTushuncha`:** `QBashorat`/`QTaxmin`, «Sanoqni ochish» → `MENTOR_SANOQ` qutilari navbat bilan (son bir lahza kattalashadi) va ikki kulrang qator; `HISOBLAR` bittadan («Hisob N / 4»), «Qoidadan o'tkazish» → `QOIDA_KATAKLAR` ga ✓/✗ navbat bilan (60–120 ms),
   yashil/qizil karta, «Mukofot: N», qizil qator (`QXato` ≤60), 4 kartadan keyin «2 tashkilotchiga» va «cheklovdan oshmadi»; o'tgan kartalar ixcham qator bo'lib qoladi (SABOQ 9, 13, 17); joriy qator, QIzoh (yashil qutining oxirgi qatori), `zoom`, `tugadi`.
7. **4 va 7-ekran `QTest`** — matn yuqoridagidek; to'g'ri izoh ≤60, xato izohlari ≤60.
8. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (12-Modul 9-darsi naqshi): har blok **4 band**, hammasi o'quvchining o'z repo'sida; 5-band yo'q. Prompt — tayyor talab + `{…}` joylar, yonida kulrang «masalan» (bo'sh qiymat bilan); «Yordam» — Mentor misolidagi to'liq prompt; web gapi — «Yordam» ostida.
   - 1-amaliyot joylari: `{ulashish joyi}`, `{havola ochadigan sahifa}`, `{havola manzili}` — o'quvchi kiritgan `{ulashish joyi}` dars holatida saqlanadi va 3-amaliyot promptiga oldindan qo'yiladi (tahrirlanadi).
   - 2-amaliyot: `{forma joyi}`, `{topilmasa xabar}`, `{avvalgidek ishlashi kerak bo'lgan ishlar}`. 3-amaliyot: `{asosiy harakat}`, `{haftalik cheklov}`, `{mukofot}`, `{qoida qatori}` + oldindan `{ulashish joyi}`.
   - Trek — `pm-m9d8-platforma.trek` dan o'qiladi (yozilmaydi): bo'lsa — faqat o'sha trekning web/mobil gapi; yo'q bo'lsa — ikkala gap ko'rinadi (pilot `03` naqshi).
   - 3-amaliyot 4-bandida tekshiruv kartasi (2 ta, bittadan): «Kutilganidek» / «Boshqacha» → dars holatida (`ccProgress`); yashil xabar va yakun sarlavhasi shu qiymatlardan. 3-amaliyot ostida (mobil trek) ikki tugma «Havola almashtirildi» · «Fayl navbatda» — dars holatida; yakun yorlig'i shundan.
   - «Davom etish»: 1 va 2-amaliyotda — 4-band «Bajardim»idan keyin (keyingi blok o'sha kodga tegadi — 12-Modul 9.41 i; SABOQ E 55 «avval MD»); 3-amaliyotda — 3-banddan keyin; blok bayrog'i — faqat 4-band «Bajardim»idan. «Ortda qoldingizmi» — faqat 1-amaliyotda (SABOQ 39): `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-10-done`.
   - O'ng: 1-amaliyot — telefon + brauzer + Neon natijasi · 2-amaliyot — telefon formasi + Neon natijalari · 3-amaliyot — Neon jadvali + telefon (qoida qatori). Web-trekda o'ng maket brauzer oynasi (trek bo'yicha).
   - `QIzoh`: har blokda bitta; 3-amaliyotda yashil qator holatga qarab ikki matn va ostida kulrang qator. `ACH_TRIGGERS`: 4 → Own Link · 7 → Fair Reward · 2-amaliyot oxirgi «Bajardim» → Code Counted · 3-amaliyot oxirgi «Bajardim» (ikkala tekshiruv belgilangan) → Rule Checked.
   - ⚠️ Qolipda yo'q (12-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», bloklararo oldindan qo'yilgan qiymat, qadam ichidagi «Yordam», tekshiruv kartasi, «Ulgurmasangiz» qatori, O'qituvchi eslatmasi — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
9. `RECAPS` 2 (kalit = 4 va 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 0·1·2·3 ×3) · flashcard 12 (`sflash`, Mentor yo'q, «Kartani bosing — javob ochiladi»; SABOQ 12, 16) · `QZ_BG_SHAPES` fon so'zlari {uz, ru}, emoji yo'q.
10. **11-ekran `QYakun`:** sarlavha — bloklar holati va 3-amaliyot tekshiruv kartasidan (olti holat); ✓ yorliq faqat to'liq holatda; yorliq «O'rnatish fayli navbatda» va ostidagi qator — 3-amaliyotdagi tanlovdan; `recap` 5 qator; `uyga: null`; `keyingi` matni yuqoridagidek.
11. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). Yakunda «Bugungi asosiy fikr» yo'q (E 50). `narrow` faqat 4, 7, 9-ekranlarda (171).
12. **Darvozalar:** `npm run gates -- src/11-Modull/ReferralDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.
13. ru — uz tasdiqlangach, bir yo'la (6-RU). Yangi atamalar ruschasi — tayanch 10 jadvalida (taklif havolasi, mukofot; «taklif» — RU bosqichida qayta ko'riladi).

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-10-start` = `m13-dars-09-done` = `m13-dars-08-done` → `m13-dars-10-done`, tayanch 3)
1. `backend/` — `oyinchilar.taklif_kodi` (6 belgi, `A–Z` va `0–9`, UNIQUE): yangi hisobga `POST /royxat` da yasaladi (to'qnashsa — qayta yasaladi); mavjud hisoblarga bir martalik migratsiya bilan (o'chirish yo'q). `GET /men` javobiga `taklifKodi`.
2. `mobil/` — «O'yin» ekranidagi «Havolani ulashish» (12-Modul `m12-dars-10-done` tugmasi; ulashish usuli o'zgarmaydi): ulashiladigan matn — `{LENDING}/?taklif=${taklifKodi}&kanal=taklif`. Tugma nomi va joyi o'zgarmaydi.
3. `lending/index.html` — `URLSearchParams` bilan `taklif` o'qiladi: «Qanday qo'shilaman» bo'limida «Taklif kodi: …» va «Ro'yxatdan o'tishda shu taklif kodini yozing.»; Umami `tashrif` — faqat `kanal` bilan (taklif kodi yuborilmaydi).
4. `backend/` `POST /royxat { ism, login, parol, taklifKodi?, qurilmaId? }` — `taklifKodi` bo'sh bo'lmasa: bo'shliqsiz va katta harfga o'tkazilib solishtiriladi (F-1007-468: talabda bor; avval kichik harf 12-darsga topilma sifatida qoldirilgan edi — 9.51, 12-Modul 9.37 a ga zid); topilmasa — `400` va «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.», hisob ochilmaydi;
   topilsa — `taklif_qilgan_id`. `mobil/` «Ro'yxatdan o'tish» — «Parol» ostida «Taklif kodi (bo'lsa)».
5. `backend/` — `oyinchi_qurilmalari` (`oyinchi_id`, `qurilma_id`, UNIQUE juft; ro'yxatdan o'tishda, kirishda va «Havolani ulashish» bosilganda — `POST /men/qurilma { qurilmaId }`, token bilan) · `taklif_natijalari` (`id`, `taklif_qilgan_id`, `taklif_qilingan_id` UNIQUE, `ON DELETE SET NULL`, `natija`, `yaratilgan`) — F-1007-468: avvalgi `oyinchilar.qurilma_id` (oxirgisi) va `mukofot`, `mukofot_vaqti` o'rniga.
   Tekshiruv `POST /oyinlar` va `POST /oyinlar/:id/qoshilish` saqlangach, alohida tranzaksiyada (xato asosiy harakatni qaytarmaydi): hisobda `taklif_qilgan_id` bor va `taklif_natijalari` da yozuvi yo'q bo'lsa → taklif qilganning `oyinchilar` qatori `FOR UPDATE` → (1) ikkalasi `namuna = false`, aks holda `namuna` · (2) taklif qilganning `oyinchi_qurilmalari` bo'sh — `nomalum`; yangi hisob qurilmasi ular ichida — `bir-qurilma` ·
   (3) taklif qilganning shu haftadagi (`date_trunc('week', …)` — dushanba, `Asia/Tashkent`) `taklif_natijalari` dagi `berildi` lari soni ≥ 2 — `cheklov` · aks holda `berildi` va taklif qilganning `pro_gacha = GREATEST(COALESCE(pro_gacha, now()), now()) + interval '7 days'`. Natija yoziladi (UNIQUE — bir hisob bir marta); yozuv bo'lmasa (xato) — keyingi harakatda qayta tekshiriladi.
6. `mobil/` — «Havolani ulashish» ostida kulrang qator (`QOIDA_QATORI`, A3 Yordam aynan). Brauzer ko'rinishida qurilma ID — ilovaning o'z saqlash joyidan (12-Modul qurilma ID si; web'da brauzer xotirasi).
7. `lending/maxfiylik.html` — «Qaysi ma'lumot?» va «Nima uchun?» javoblariga: «Taklif kodi bilan kelgan hisoblarda kim kimni taklif qilgani, mukofot natijasi va vaqti, hisob ishlatilgan qurilma ID lari saqlanadi — mukofotni qoidaga ko'ra berish va bir qurilma ID li hisoblarni ajratish uchun.» · `lending/oferta.html` — «Taklif mukofoti» bandi (qoida qatori + berilmaydigan to'rt holat; F-1007-468).
8. `README.md` — yangi «Taklif» bo'limi (taklif kodi, havola, formadagi maydon, mukofot qoidasi — uch shart va cheklov, `mukofot` holatlari, «bir qurilma» qoidasining chegarasi); «Darslar va teglar» jadvaliga `m13-dars-10-done`.
9. ⛔ Muhrdan oldin («qur» darvozasi): Render deploy; Expo Go'da va brauzer ko'rinishida forma, xabar, `taklif_qilgan_id`; «Hisobdan chiqish» qurilma ID ni o'chirmasligi (bir qurilma tekshiruvi shunga bog'liq — Shubhali 5); ikki tekshiruv (bir qurilma — `bir-qurilma`, Pro o'zgarmaydi; boshqa qurilma — `berildi`, Pro +7 kun) va tozalash;
   `ishtirokchilar.holat`, `oyinlar.tashkilotchi_id` nomlari (tayanch 6); namuna o'yin (`id` 1) hali bor-yo'qligi (12-Modul 9.44 oxiri); uchala blok vaqti (taymer). Mentor tekshiruv akkauntlari va Pro qaytarish — muhrdan oldin. Natija boshqacha chiqsa — MD haqiqiy natijaga moslanadi.
   Yangi APK tayyorlanib, lending havolasi almashtiriladi.

## Manbalar (o'zim tekshirdim, 07.10.2026; o'quvchiga ko'rinmaydi)
Bu darsda yangi tashqi xizmat fakti yo'q — barcha texnik va xizmat qadamlari oldingi modullar tayanchidan (rasmiy hujjat bilan tekshirilgan) olindi; yangi tashqi sahifa ochmadim. Tugma va menyu nomlari taxmin qilinmadi (Umami, Render, Netlify, Neon — umumiy so'z).
1. 13-Modul tayanchi 1.10, 1.13, 2, 3 (07.10.2026) — mexanika, shartlar, Mentor natijasi, atamalar, teglar; `GATE_M_JAVOB.md` Qaror-0 15, 16, 21, 22.
2. 12-Modul tayanchi 1.6 (`?kanal=`, Umami `tashrif` va kanal; olti bandli xavfsizlik ro'yxati), 1.7 (login, `namuna`, qurilma ID ta'rifi, «Hisobni o'chirish», maxfiylik siyosati, lendingdagi ikki havola), 9.8, 9.23 (asosiy harakat SQL), 9.28 (Netlify: `npx expo export -p web` → `netlify deploy --prod --dir dist` — rasmiy hujjat),
   9.37 g (tekshiruv akkauntini o'chirish), 9.38 h (Umami `tashrif`), 9.41 b (hafta — dushanbadan yakshanbagacha), 9.42 e («Havolani ulashish» — `?kanal=ilova`), 9.44 c (namuna o'yin).
3. 12-Modul tayanchi 1.7 / 6: EAS — `eas build -p android --profile preview` (rasmiy); APK o'zi yangilanmaydi.
4. 10-Modul `02-EventTracking-v3.md` A-bo'lim 9 (MDN `localStorage`: yashirin oynada ma'lumot alohida va oxirgi yashirin oyna yopilganda tozalanadi) va `02-FILTR.md` 1 (Umami Visitors — sessiyalar; o'z jadvalimiz bilan bir o'lchov emas) → «tashrif» so'zi, yashirin oyna — «boshqa qurilma».
5. Kursdagi so'zlar (grep, 07.10): «Havolani ulashish» — 12-Modul `10-PmUsersCheck-v3.md` 78, 291 · «Qanday qo'shilaman», «Android: ilovani o'rnatish», «iPhone: brauzerda ochish» — 12-Modul tayanchi 1.1, 1.7 · `maydon-jamoa-….netlify.app` — 12-Modul MD lari · `POST /royxat { ism, login, parol }` — 12-Modul tayanchi 1.7 · `pro_gacha`, `GET /men` — 13-Modul tayanchi 1.4.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Hook** — maket: 1-telefon va ikki tashkilotchining bir xil `?kanal=ilova` havolasi; variantlar «Havolada …» · ✔ «Hech qayerda — havola hammada bir xil» · «Formada …» (ballsiz, J-026). 1 va 3-variant — bugungi yechimning ikki qismi; payoff ularni yolg'onga chiqarmaydi.
2. **Namuna taklif kodi `AB12CD`** — tayanch 1.10 dagi lending ko'rinishidan; 2-ekran sahnasi va kutilgan natijada Mentor misolidagi bir tashkilotchining taklif kodi sifatida (qaysi tashkilotchi — aytilmaydi).
3. **«mukofot 3 ta (2 tashkilotchiga)» — o'qilishi:** men «uch mukofot ikki tashkilotchiga berildi» deb o'qidim (bittasi 2, bittasi 1 — haftalik cheklov ichida) — 12-Modulda «Havolani ulashish» faqat e'lon bergan tashkilotchida, shuning uchun taklif qilganlar tashkilotchilar.
   O'quvchi matnida faqat «Mukofot: 3 · 2 tashkilotchiga» (bo'linishi aytilmaydi). Agar «3 tadan 2 tasi tashkilotchiga, 1 tasi o'yinchiga» nazarda tutilgan bo'lsa — ayting: o'yinchida ham ulashish joyi kerak bo'ladi (hozir yo'q).
4. **18 — «tashrif»** (tayanch 1.13 da «qurilma», 1.10 «Sanoq» qatorida «(tashrif)»): Umami qurilmani emas, ochilishni sanaydi (12-Modul 9.38 h; 10-Modul 02-FILTR 1) — o'quvchi matnida «18 tashrif». Tayanch 1.13 ni «tashrif» ga almashtirish taklifi.
5. **5-ekran hisob kartalarining tartibi** (bir qurilmadagi — 3-karta) va karta ichidagi yozuvlar («asosiy harakat: bor», «namuna: yo'q») — sahna uchun; namuna «yo'q» — forma doim `false` yozadi (12-Modul 1.7).
6. **Halol gap «Bir hafta va 7 hisob …»** — so'zma-so'z qoldirildi (QIzoh). Lekin 7 — hisob, ulardan biri taklif qilgan bilan bir qurilmada: «kishi» aniq emas. Taklif: «Bir hafta va 7 hisob — …» (tayanch 1.10 da).
7. ✅ (F-1007-468: `oyinchi_qurilmalari` — hisobning hamma qurilmalari; «oxirgisi» bir qurilmadagi o'zini taklif qilishni boshqa qurilmadek ko'rsatishi mumkin edi) **`oyinchilar.qurilma_id`** (tayanchda yo'q): «bir qurilma» shartini tekshirish uchun hisobga qurilma ID yoziladi — ro'yxatdan o'tishda va «Havolani ulashish» bosilganda (oxirgisi). Taklif qilganning eski hisobi (12-Moduldan) qurilmasi faqat ulashganda ma'lum bo'ladi.
8. ✅ (F-1007-468: `taklif_natijalari` — alohida jadval; taklif qilingan hisob o'chsa ham haftalik sanoq buzilmaydi) **`oyinchilar.mukofot` va `mukofot_vaqti`** (tayanchda yo'q): taklif kodi bilan ochilgan hisobda natija — `berildi` · `bir-qurilma` · `namuna` · `nomalum` · `cheklov`; haftalik cheklov shu yozuvlardan sanaladi; bir hisob — bir marta.
9. **`nomalum`:** taklif qilganning qurilma ID si hali yozilmagan bo'lsa (12-Moduldan beri havola ulashmagan) — mukofot berilmaydi (o'zini taklif qilishni tekshirib bo'lmaydi). Muqobili — berish; men xavfsizini tanladim. F-1007-468: bu holat ofertadagi «Taklif mukofoti» bandida ochiq aytiladi; kirishda ham qurilma yoziladi — holat kamayadi.
10. **Hafta** — dushanbadan yakshanbagacha, Toshkent vaqti (12-Modul 9.41 b ma'nosi); cheklovga yetganda shu taklif uchun mukofot berilmaydi va keyingi haftaga o'tmaydi (`cheklov`).
11. **Mukofot payti** — taklif kodi bilan ochilgan hisob **birinchi marta** asosiy harakat qilganda (o'yinga qo'shilish yoki e'lon); keyin o'yindan chiqsa — mukofot qaytarib olinmaydi. `pro_gacha`: o'tgan yoki bo'sh bo'lsa — bugundan 7 kun.
12. **Umami'ga faqat kanal** — taklif kodi Umami'ga yuborilmaydi (analitika va hisob bog'lanmasin); kim taklif qilgani — faqat Database'da.
13. **Noto'g'ri taklif kodi** — hisob ochilmaydi, xabar «Bunday taklif kodi topilmadi — tekshiring yoki maydonni bo'sh qoldiring.» (F-1007-468: kichik harf endi qabul qilinadi — talabda katta harfga o'tkaziladi).
14. **Lending qatori** «Taklif kodi: AB12CD» ostida — «Ro'yxatdan o'tishda shu taklif kodini yozing.» (tayanchda faqat birinchi qator).
15. **Mavjud hisoblarga taklif kodi** — 1-amaliyotda bir martalik (migratsiya; o'chirish yo'q).
16. **Ilovadagi qoida qatori** (tayanchda yo'q): «Havolani ulashish» ostida kulrang «Siz taklif qilgan yangi o'yinchi o'yinga qo'shilsa yoki o'yin e'lon qilsa — Pro'ga 7 kun qo'shiladi (haftasiga ko'pi bilan 2 marta).» — shartni ochiq aytish uchun (7-dars «shartlarni ochiq aytish» ruhida); chorlov va bosim yo'q.
    Kerak emas desangiz — olib tashlanadi (mukofot jim beriladi). Shu bilan: 7-darsdagi «Pro shartlari» (oferta) ga mukofot bandi kerakmi — 7-dars uchun savol.
17. **Brauzer ko'rinishida ham taklif kodi qo'lda** (iPhone) — bitta qoida; web-trek saytida esa havoladan formaga o'zi qo'yish — o'quvchining tanlovi.
18. **Darsdagi tekshiruv yo'li:** bir qurilma — o'z telefonida tekshiruv akkaunti; boshqa qurilma — sherik telefon brauzerida brauzer ko'rinishi, yo'q bo'lsa yashirin oyna, oxirgi zaxira — agent. Tekshiruv akkauntlari forma orqali (`namuna = false` — aks holda 1-shart ularni sanamaydi), tekshiruvdan keyin «Hisobni o'chirish»;
    tekshiruvdan qolgan `pro_gacha` agent orqali qaytariladi. 12-Modul 9.35 a dagi «tekshiruv akkaunti `namuna = true`» qoidasidan farq — ataylab (mukofot faqat `false` da).
19. **Maxfiylik siyosatiga gap** (tayanchda yo'q; 8-darsdagi Telegram chat raqami qatori naqshi): qurilma ID ning yangi ishlatilishi ochiq aytiladi.
20. **«hisob» so'zi** — o'quvchi matnida «akkaunt» o'rniga doim «hisob» (tayanchda «namuna akkauntlar» — o'quvchi matnida «namuna hisob»).
21. **Nishonlar:** Own Link · Fair Reward · Code Counted · Rule Checked (grep 0).
22. **Yakun sarlavhalari** — olti holat (3-amaliyot tekshiruv kartasi bilan).
23. **Talab zinapoyasi** — uchala blokda tayyor talab + `{…}` joylar (tayanch 4 modeli); 3-amaliyotga `{ulashish joyi}` 1-amaliyotdan oldindan qo'yiladi (dars holati).
24. **App.jsx osti «unikal havola, sanoq va mukofot»** — «unikal» o'smir uchun og'irroq: faqat reja yorlig'ida (P-015 aynan); o'quvchi matnida «o'z havolasi». `00-NOMLAR.md` ostini «o'z havolasi, sanoq va mukofot» ga almashtirish taklifi (asosiy seans qarori).
25. **«Havolani ulashish» joyi o'zgarmaydi** — «O'yin» ekranida, e'lon berilgach (tashkilotchi); taklif kodi esa har hisobda bor (o'yinchida ulashish tugmasi bugun qo'shilmaydi).
26. **Mukofot o'quvchi mahsulotida** — 4-darsdagi pullik qulaylikning bepul muddati; yo'q bo'lsa — «hozircha yo'q», qoida natijani baribir yozadi.
27. **«Davom etish» 1 va 2-amaliyotda — faqat tekshiruvdan keyin** (keyingi blok ro'yxatdan o'tish kodiga tegadi — 12-Modul 9.41 i); 3-amaliyotda — 3-banddan keyin. Render kutishi vaqtni cho'zsa — Shubhali 1.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — uch blokda uch Render kutishi (1 va 2-amaliyotda tekshiruv kutishdan keyin — «Davom etish» erta ochilmaydi), 3-amaliyotda brauzer ko'rinishini yangilash va ikki tekshiruv akkaunti; 3-amaliyot ≈25 daqiqa — reja. Pilotda taymer; sig'masa — 3-amaliyotning (4) boshqa qurilma tekshiruvi keyingi dars boshiga (Ulgurmasangiz yo'li bor) yoki qoida qatori olib tashlanadi (foydalanuvchi qarori).
2. ⛔ **APK'da havoladagi taklif kodi o'tmasligi** — Mentor qarori (tayanch 1.10); do'kondan o'rnatilmagan APK uchun shunday deb oldim, rasmiy manba bilan tekshirmadim. Darsda «Mentor ilovasida» bilan chegaralangan.
3. **Umami interfeysida `tashrif` ni kanal bo'yicha ko'rish yo'li** — menyu nomlari yozilmadi («kanal bo'yicha oching» — umumiy so'z); Umami'da yozuv qancha vaqtda ko'rinishi — o'lchanmagan («biroz kutib, sahifani yangilang»).
4. **Umami'dagi o'z ochilishingiz** — 1-amaliyot tekshiruvidagi tashrif ham `taklif` kanalida sanaladi (Umami yozuvini o'chirmaymiz); 12-Moduldagi «o'z qurilmangiz ham sanaladi» qoidasi bilan bir, lekin kichik sonda sezilarli — O'qituvchi eslatmasiga qo'shish mumkin.
5. ⛔ **«Hisobdan chiqish» qurilma ID ni o'chirmasligi** — 12-Modulda qurilma ID qayerda saqlanishi tayanchda yo'q; o'chsa, bir qurilma tekshiruvi (3-amaliyot (3)) «boshqa qurilma» bo'lib chiqadi. «Qur» da Mentor repo'sida tekshiriladi.
6. ⛔ **Brauzer ko'rinishi** — 12-Modulda ham «qur» darvozasi edi (9.39 k); sherik telefonida ochilishi, unda ro'yxatdan o'tish, qurilma ID (brauzer xotirasi) va «Hisobni o'chirish» — sinalmagan.
7. **Yashirin oynada qurilma ID** — brauzer xotirasi alohida bo'lgani uchun «boshqa qurilma» bo'lib o'tadi (MDN, 10-Modul); ba'zi brauzerlarda yashirin oyna ichida bir nechta varaq bitta xotirani ulashadi — tekshiruvda bitta varaq ishlatilsin.
8. **`ishtirokchilar.holat`, `oyinlar.tashkilotchi_id`** — 12-Modul 9.23 SQL idan; ustun nomlari Neon'da «qur» da tekshiriladi (tayanch 6 «Tekshirilmagan»).
9. **Namuna o'yin (`id` 1)** 13-Modulda hali bormi — 12-Modul 9.44 oxirida ochiq savol; yo'q bo'lsa tekshiruv akkaunti uchun real foydalanuvchilarsiz o'yin kerak bo'ladi (tashkilotchi o'zi e'lon qilgan alohida o'yin — lekin u o'chmaydi).
10. **Mavjud hisoblarga taklif kodi berish** — migratsiyani agent qanday qilishi (jadval yaratish usuli 11-Modul loyihasidagi kabi) — agentning tanloviga qoladi; tekshiruv — Neon'dagi ikki `SELECT`.
11. ✅ **Kichik harf** — F-1007-468: talabda (A2) kod katta harfga o'tkazilib solishtiriladi; 12-dars Mentor misoli pilot natijasidan (9.51).
12. **Agent tekshiruv akkaunti** (zaxira) — ro'yxatdan o'tish yo'li bilan yangi qurilma ID yuborishi: agent API'ga so'rov yubora olishi (Render) — 12-Modul 9.35 a dagi kabi «qur» da.
13. ✅ (F-1007-468: qaytarish yo'q — taklif qiluvchi `tekshiruv1`) **`pro_gacha` ni qaytarish** — agent `UPDATE` qiladi; o'quvchi yozib olgan qiymat xato bo'lsa, Pro muddati noto'g'ri qoladi (test rejim — pul yo'q, zarar yo'q, lekin sanoq halolligi uchun (2) va (5) ni solishtirish kerak).
14. **«Havolani ulashish» ulashish usuli** — 12-Modulda «qur» da tanlangan; qurilma ID yuborish shu tugmaga qo'shiladi — ulashish oynasi ochilishidan oldin so'rov o'tmasa, tugma kechikishi mumkin (agentning tanloviga qoladi).
15. **Mukofot berilgani tashkilotchiga ko'rinishi** — Pro holati 4-darsdagi ko'rinishda (`GET /men`); «sizga 7 kun qo'shildi» kabi alohida xabar yo'q (kerak bo'lsa — keyingi ish, bugun yo'q).
16. **Siyosat gapi va saqlanadigan ma'lumot** (7-dars Filtri sinfi, F-1007-465) — Mentor gapi faqat qurilma ID ni aytadi; `oyinchilar` da yana `taklif_qilgan_id` (kim taklif qilgani) va `mukofot` saqlanadi. Promptga «kodda saqlanadigan, lekin gapda yo'q ma'lumotni ayt» qo'shildi; Mentor gapining o'zi — 10-dars auditida.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + 13-Modul pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔ pilot taymeri; A-bo'lim 12; har blokda «Ulgurmasangiz»; Render kutilganda kod qatorlarini o'qish (uchala blok, 3-band); tekshiruv keyingi blokdan keyinga surilmaydi (bir kodga tegadi — 12-Modul 9.41 i); o'rnatish fayli navbati kutilmaydi; «sig'adi» deyilmagan (Shubhali 1).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Shubhali 1, 2, 5, 6 (⛔); Umami menyu nomlari va kutish vaqti — umumiy so'z (Shubhali 3); Render, Netlify, Neon tugma nomlari yozilmadi; buyruqlar — 12-Modul tayanchidan (rasmiy); REPO 9.
3. [x] **Saqlash kaliti — shartnoma** — yangi kalit yo'q (tayanch 8); o'qiydi faqat `pm-m9d8-platforma.trek`, yozmaydi (yo'q bo'lsa — ikkala gap; 12-Modul 9-darsidagi «kalitga yozish» yo'li olinmadi — dars boshqa darsning kalitiga yozmaydi); dars holatiga ism, login, taklif kodi, qurilma ID yozilmaydi (A-bo'lim 14).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor ilovasida» (2-ekran xulosasi, 1-savol, «Endi siz bilasiz» 2), «Bu misolda» (5-ekran xulosasi), «Mentor qoidasida» (2-savol, arena 6, 7), «Mentor misolida» (bloklar «Ochish»), mukofot o'quvchi mahsulotida — o'z qarori (A3 «Ochish», joylar).
5. [x] **Kafolat va sabab da'vosi yo'q** — «bo'lishi kerak», «odatda», «mumkin»; agentning «tayyor» degani — da'vo (A1 ✎); bir qurilma — sabab haqida xulosa yo'q (5-ekran joriy qatori); 7 hisob — «o'sishni isbotlamaydi»; «mukofot ishlaydi» deyilmaydi (yakun ✎, A3 kulrang qator); kafolat so'zlari — 0 (O'lchov grep).
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — 11-ekran olti holat, har biri rost («hech biri», «3-blok bor, oldingilar yo'q» alohida); ✓ yorliq faqat to'liq holatda; A3 yashil xabari ikki holatli + kulrang qator; blok bayrog'i faqat 4-banddan; Rule Checked tavsifi — qilingan ish.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — birliklar: tashrif (Umami) · hisob (Database) · qurilma (qurilma ID); «ayirilmaydi» — 5-ekran, arena 9, kartochka 11; 18 — «tashrif» (TAYANCHGA SAVOL 4); sanoq SQL lari darsda bajariladigan (A2 (4)).
8. [x] **Test: bitta himoyalanadigan javob** — 1-savol: A, B — «rost, lekin mos emas», D — yanglish tasavvur (uch turkum); 2-savol: B, C, D — uch xil xato; arena 2, 3, 12 — turkumlar ✎ da; «Mentor formasida», «Mentor qoidasida» chegarasi; uzunlik ±15% (O'lchov); ✔ yolg'iz eng uzun emas.
9. [x] **Real odamlar xavfsizligi** — havola darsda faqat o'zingizga (A1 (3)); keyin — tanish doira va olti bandli ro'yxat (A1 «Ochish», arena 12); sinfda sanash yo'q (1-ekran O'qituvchi eslatmasi); bosim yo'q — qoida qatori shart aytadi (A3); tekshiruv akkaunti — haqiqiy emas, o'chiriladi; sherik — o'z tekshiruv akkaunti bilan.
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — A1, A2: o'quvchi Neon'da va telefonda o'zi; A3: bir qurilma — o'z telefoni, boshqa qurilma — sherik → yashirin oyna → agent; tekshiruv akkauntlari «Hisobni o'chirish» bilan; Pro qaytarish — agent `id` bo'yicha (o'quvchi `UPDATE` yozmaydi).
11. [x] **Web-trek teng yo'l** — har blokda web gapi («Ochish» va «Yordam» ostida): ulashish joyi, havoladan formaga, brauzer ID, yashirin oyna; kutilgan natijada brauzer oynasi; sarlavhalar va yakun ikkala trekka rost; «mahsulotingiz».
12. [x] **Mentor misoli ichki izchil** — sonlar tayanch 1.13 aynan, boshqa son yo'q (A-bo'lim 6); 12-darsning topilmasi (kichik harf) oldindan ochilmagan (faqat O'qituvchi eslatmasi); «Havolani ulashish» — 12-Modul joyida; yangi tafsilotlar — TAYANCHGA SAVOL 2–19.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — mahsulot qarorlari `{…}` da (ulashish joyi, havola sahifasi, forma joyi, xabar, asosiy harakat, cheklov, mukofot, qoida qatori); qaytarib bo'lmaydigan o'zgarish yo'q (ustun qo'shiladi, hech narsa o'chirilmaydi — tekshiruv akkauntlari ham o'quvchining o'z yo'li bilan).
14. [—] **Uyga vazifa yengil va aniq** — loyiha kuni, uyga vazifa yo'q; «uyda» so'zi yo'q (grep); navbatdagi o'rnatish fayli — «keyingi dars boshida».
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …», «Boshqacha» → kutgan/bo'ldi; «sizda emas», «xatongiz emas» — 0.
16. [x] **Kelajak va'dasi yo'q** — lending va ilovadagi qatorlar faqat hozir ishlaydigan narsani aytadi (taklif kodi, qoida); kelajak — faqat «Keyingi dars» qatorida va o'rnatish fayli havolasi gapida; 12-dars faqat O'qituvchi eslatmasida.
+ **12-Modul tayanchi 7 (11-Modul sinflari):** holatga qarab yakun [x] · da'vo isbot emas [x] (7 hisob, bir qurilma, «Kutilganidek») · maxfiy qiymat agentga va ochiq joyga chiqmaydi [x] (har blok 3-bandi; Umami'ga taklif kodi ketmaydi) · tashqi xizmat haqida faqat rasmiy hujjat [x] (Manbalar — oldingi tayanchlardan) ·
  har sonning manbasi va o'lchovi [x] (A-bo'lim 6, 5-ekran qutilari) · tayanchda yo'q narsa to'qilmagan [x] (TAYANCHGA SAVOL 1–27) · saqlash kaliti o'qiydigan darsdan [x] · test: bitta javob [x] · keys [—] (keyssiz, Qaror-0 21) · 90 daqiqa [x] · bir ma'no — bir so'z [x] («taklif kodi» ↔ «kod», «hisob» ↔ «akkaunt», «tashrif») ·
  web-trek [x] · agent va o'quvchi ishi ajratilgan [x] · o'smir xavfsizligi [x].
+ **13-Modulga xos (pul):** real pul yo'q [x] (mukofot — test rejimdagi Pro muddati; tepada, A-bo'lim 9, arena 5) · karta ma'lumoti hech qayerda [x] (bu darsda to'lov ekrani yo'q; maketlarda karta maydoni chizilmaydi — KOD 3) · «mashq to'lov» taqlidi [—] (bu darsda «mashq to'lov» yo'q) ·
  «test rejim» belgisi har to'lov ekranida [—] (to'lov ekrani yo'q; Pro mukofot bilan to'lovsiz uzayadi, reja pastki qatorida «test rejimdagi Pro muddati») · narx — «Mentorning taxmini» [—] (narx yo'q) · suhbat va tasdiqda bosim yo'q [x] — taklifda: «do'stingni taklif qil — sovg'a» yo'q, qoida qatori bosimsiz ·
  oferta — shablon [—] (7-dars; mukofot bandi — TAYANCHGA SAVOL 16) · mukofot — pul emas [x] (Qaror-0 15: pul ham, chegirma ham emas — A3 prompti «Nima buzilmasin»).

## O'lchov (scratchpad `md10/olchov.py`, 07.10.2026; yakuniy fayl bo'yicha; F-1007-468 da o'zgargan qatorlar Python `len` bilan qayta o'lchandi, 08.10)
Belgilar — oddiy `len` (`**` va «✔» siz); qavsdagi har son skript bilan tekshirildi va tuzatildi (`olchov.py --fix`; birinchi yurishda 36 ta qo'lda yozilgan son noto'g'ri edi, 4 ta chegaradan oshgan joy — 2 to'g'ri izoh, 1 sarlavha, 1 QIzoh — qisqartirildi;
arena 5, 7, 10 da ✔ yolg'iz eng uzun edi — distraktorlar uzaytirildi; 1-savol D varianti ±15% dan chiqqan edi — qisqartirildi). Ballik testlar ±15%, arena ±20% (o'rtachadan).
Mentor gaplari — interaktiv ekranlarda bitta gap; 0-ekran boshidagi gap 125 belgi (bitta gap, ikki qism «—» va «;» bilan — 12-Modul 9-darsida 112–129).

```
## Sarlavhalar (≤55)
   54  Yangi o'yinchini kim taklif qilgani qayerda ko'rinadi?
   44  Bugun har hisobning o'z taklif kodi bo'ladi.
   48  O'rnatilgan ilova kim taklif qilganini biladimi?
   50  Har hisobning o'z taklif kodi va havolasi bo'lsin.
   35  Qaysi hisob uchun mukofot beriladi?
   51  Formadagi taklif kodi taklif qilgan hisobni topsin.
   48  Mukofot faqat qoidaga mos taklif uchun berilsin.
   53  Havola, sanoq va mukofotning ikki holati tekshirildi.
   50  Taklif yo'li qurildi — bitta joyni tuzatish qoldi.
   54  Havola va sanoq tayyor — mukofot tekshiruvi tugamagan.
   47  Havola va sanoq tayyor — mukofot qoidasi qoldi.
   55  Havola tayyor — formadagi taklif kodi va mukofot qoldi.
   49  Mukofot qoidasi bor — oldingi bloklarni tugating.
   53  Taklif havolasi hali qurilmagan — bloklarni tugating.
## Xulosalar (≤110)
  103  Mentor ilovasida havoladagi taklif kodi o'rnatilgan APK'ga o'tmaydi — shuning uchun formada maydon bor.
  107  Bu misolda mukofot yangi hisob asosiy harakat qilgach beriladi; bir qurilmadagi va namuna hisob sanalmaydi.
## Hook javoblari (≤120) va variantlari
  109  Aynan! Mentor ilovasida hamma tashkilotchi bir xil havolani ulashadi — kim yuborgani hech qayerda yozilmaydi.
   94  Qiziq fikr! Hozirgi havolada faqat `?kanal=ilova` bor: u kanalni aytadi, kim yuborganini emas.
   83  Qiziq fikr! O'yinchi aytsa bilinardi — lekin hozir formada buni yozadigan joy yo'q.
## To'g'ri izohlar (≤60)
   56  Taklif kodi APK'ga o'tmaydi — yangi o'yinchi uni yozadi.
   56  Taklif qilgan bilan bir qurilmada — bu hisob sanalmaydi.
## Xato izohlari va qizil qator (≤60)
   53  A: Umami kanalni sanaydi — bu rost. Maydon nega formada?
   58  B: Taklif kodi olti belgili — bu rost. Ilovaga qanday yetadi?
   41  D: Maydon nomidagi «(bo'lsa)» nimani aytadi?
   29  Bir qurilmada — mukofot yo'q.
   51  B: Asosiy harakat bor. Hisob qaysi qurilmada ochilgan?
   40  C: Taklif kodi to'g'ri — lekin qurilma-chi?
   52  D: Mentor misolida o'yinga qo'shilish — asosiy harakat.
## Yashil, joriy, QIzoh, kulrang qatorlar (≤110)
   66  Umami faqat kanalni sanaydi; kim taklif qilganini Database biladi.
   77  Har hisobda taklif kodi bor; havola uni olib boradi va sahifa uni ko'rsatadi.
   79  Umami'ga faqat kanal ketadi: taklif kodi va uni kim ochgani u yerda yozilmaydi.
  101  Bir qurilma — o'zini taklif qilish ham, oiladagi bitta telefon ham bo'lishi mumkin: qoida ajratmaydi.
   97  Bir hafta va 7 hisob — kichik son: taklif yo'li ishlaganini ko'rsatadi, o'sishni isbotlamaydi.
  108  Taklif kodi bilan ochilgan hisob taklif qilganga bog'landi va sanoqda ko'rindi; tekshiruv akkaunti o'chirildi.
   85  Sinfdagi tekshiruv akkaunti haqiqiy sanoqqa qo'shilmaydi — shuning uchun u o'chiriladi.
   92  Bir xil ID dagi hisob sanalmadi, boshqa ID dagisi mukofot berdi; tekshiruv izlari tozalandi.
   70  Tekshiruv tugamagan: «Boshqacha» chiqqanini tuzatib, qayta tekshiring.
   51  Bir xil ID tekshirildi; boshqa ID tekshiruvi qoldi.
   64  Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.
   74  Namuna va haftalik cheklov — kodda bor, tekshiruv akkaunti bilan sinalmagan.
  109  Qoida bir xil qurilma ID ni ushlaydi; boshqa ID dagi hisobni ajratmaydi — shuning uchun haftalik cheklov bor.
## Reja qatorlari
   26  Har hisobning o'z havolasi
   31  Havola bilan kelganlar sanaladi
   36  Mukofot — faqat qoidaga mos taklifga
## Mentor gaplari (gap soni · belgi)
  1 gap · 125  12-Modulda Mentor ilovasiga «Havolani ulashish» qo'shildi — tashkilotchilar havolani o'z jamoasiga yuboradi; j
  1 gap ·  65  Bugun har hisobga o'z havolasi beriladi — «Davom etish»ni bosing.
  1 gap · 109  Havola, sanoq va mukofotni uch blokda qurasiz — talab tayyor, qavslarini o'z mahsulotingiz bilan to'ldirasiz.
  1 gap ·  81  Avval taxminingizni belgilang, keyin chap telefonda «Havolani ulashish»ni bosing.
  1 gap · 110  Endi har tashkilotchining o'z havolasi bor — u taklif havolasi deyiladi; brauzerda «Havolani ochish»ni bosing.
  1 gap ·  92  Havoladagi olti belgi — taklif kodi; endi lendingdagi «Android: ilovani o'rnatish»ni bosing.
  1 gap ·  71  Ilova o'rnatildi — endi o'ng telefonda «Taklif kodini yozish»ni bosing.
  1 gap ·  63  To'rt harakat tugadi — natijani taxminingiz bilan solishtiring.
  1 gap ·  90  Talab tayyor — uchta qavsni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
  1 gap · 104  Mentor misolida bir haftalik sanoq bor — avval taxminingizni belgilang, keyin «Sanoqni ochish»ni bosing.
  1 gap ·  66  Endi to'rt hisobni bittadan «Qoidadan o'tkazish» bilan tekshiring.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap ·  93  Havoladagi taklif kodi ilovaga o'tmaydi — formaga maydon qo'shasiz; «1 · Ochish»dan boshlang.
  1 gap ·  86  Mukofot qoidasini o'z mahsulotingiz uchun qavslarda yozasiz; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  Mentor formasida nega «Taklif kodi (bo'lsa)» maydoni bor? · 8 so'z · [42, 47, 45, 42] · eng uzun 47 / eng qisqa 42 · ✔C · OK
      A   42  Umami faqat kanal belgisini sanagani uchun
      B   47  Taklif kodi olti belgidan iborat bo'lgani uchun
      C✔  45  APK'ga havoladagi taklif kodi o'tmagani uchun
      D   42  Taklif kodi majburiy maydon bo'lgani uchun
  Mentor qoidasida taklif qilganning telefonida ochilgan hisob o'yinga qo'shildi. Mukofot? · 10 so'z · [45, 41, 47, 42] · eng uzun 47 / eng qisqa 41 · ✔A · OK
      A✔  45  Berilmaydi — bir qurilmadagi hisob sanalmaydi
      B   41  Beriladi — asosiy harakat qilgani yetarli
      C   47  Beriladi — taklif kodi formaga to'g'ri yozilgan
      D   42  Berilmaydi — o'yinga qo'shilish sanalmaydi
## Arena (12) — ✔ o'rni va variant uzunliklari (±20%)
   1. ✔A · [35, 39, 32, 33] · OK  Ikki tashkilotchi 12-Moduldagi bir xil havolani yubordi. Umami nimani ko'radi?
   2. ✔B · [31, 34, 34, 32] · OK  Mentor misolida taklif kodi nimadan iborat?
   3. ✔C · [32, 32, 31, 37] · OK  Taklif havolasi ochilganda Mentor lendingi Umami'ga nima yuboradi?
   4. ✔D · [34, 40, 38, 37] · OK  Taklif kodisiz kelgan odam Mentor ilovasida ro'yxatdan o'ta oladimi?
   5. ✔A · [36, 31, 31, 40] · OK  Mentor misolida taklif uchun mukofot nima?
   6. ✔B · [32, 35, 34, 38] · OK  Taklif kodi bilan ochilgan hisob hali hech narsa qilmagan. Mukofot-chi?
   7. ✔C · [34, 29, 30, 27] · OK  Mentor qoidasida bir hisobga haftasiga nechta mukofot?
   8. ✔D · [30, 30, 32, 31] · OK  Ikkinchi telefoni bor odam o'zini taklif qildi. «Bir qurilma» qoidasi-chi?
   9. ✔A · [31, 33, 33, 31] · OK  Mentor misolida 18 tashrif va 7 hisob. Ayirsa bo'ladimi?
  10. ✔B · [35, 48, 49, 38] · OK  Mentor misolida jami ro'yxatdan o'tgan — 51. Bu son nima?
  11. ✔C · [32, 31, 36, 37] · OK  Sinfda tekshiruv akkaunti ochdingiz. Keyin nima qilasiz?
  12. ✔D · [34, 36, 39, 34] · OK  Havolangizni qayerga yuborasiz?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Kafolat so'zlari
  o'quvchi matnida 0 — butun fayldagi topilmalar faqat MD izohlarida («doim ko'rinadi», «bir zumda almashadi», «darhol o'chiriladi» — ✎, A-bo'lim, GATE M; o'quvchiga ko'rinmaydi).
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m11-09` «Kim haqiqatan to'lashga tayyor?» → **`m11-10` «Loyiha kuni: taklif havolasi va mukofot»** (osti «unikal havola, sanoq va mukofot» — 1-ekran yorlig'i) → `m11-11` «Mahsulotingiz hozir qayerda?» (osti «roadmap bilan solishtirish va shaxsiy hisobot» — yakundagi «Keyingi dars»); App.jsx 453–455, 07.10 o'qildi.
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`); metafora yo'q; keyssiz; bitta vizual — `TaklifSahna` (0, 1, 2, 5-ekranlar, bloklar o'ngi — bitta manba); o'quvchining o'z mahsuloti — uch blok.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (to'rt harakat: ulashish → havola · ochish → lendingda taklif kodi · o'rnatish → bo'sh maydon · yozish → jadvalda yangi qator), 5 (sanoq qutilari; to'rt karta → kataklar ✓/✗, «Mukofot: N»); 0-ekran javobdan keyin o'zgaradi.
  Bashoratlar tanlangach ixcham qator; faol element halqada, Mentor shu harakatni aytadi; har ekranda «Keyingi bosiladigan joy».
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 — «O'lchov» bo'limi.
- [x] Atamalar tayanch 2 va oldingi darslar bilan bir xil (grep): taklif havolasi, taklif kodi, mukofot — 13-Modul tayanchi 2 · qurilma ID, namuna, «Hisobni o'chirish», asosiy harakat, `?kanal=` — 12-Modul · brauzer ID — 10-Modul; siz-forma; tugma va yorliqlar ot-shaklda yoki siz-formada;
  agent promptlari — T-002 istisnosi; lending, forma va ilova qatorlari — olam ichidagi matn (T-008).
- [x] Testlar: variantlar bir shaklda, uzunligi ±15% (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas; Beriladi / Berilmaydi 2/2 · ✔: s4 C · s7 A · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [—] Final: tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (grep: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «kafolat» — o'quvchi matnida 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — o'quvchiga «1-amaliyot»; `m11-10`, kod raqami, «pilot» yo'q); modul raqami LMS bo'yicha («12-Modulda», «10-Modul»); «ekran» faqat ilova va telefon ekrani; tarixiy voqea yo'q; «KOD» (13) va «REPO» (9) ro'yxati to'liq.
- [x] Karta T · P · S (+ PM) ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (taklif havolasi va taklif kodi — harakatdan keyin; sarlavhalarda yangi atama yo'q) · T-014/015 («taklif kodi» ↔ «kod», «hisob», «tashrif») · T-016/017 (metafora yo'q) · T-024 · T-029 · T-034 · T-039 («havolangiz» — 1-amaliyotdan keyin) ·
  T-042 · T-043 («Mentor misolida», «Bu misolda», «Mentor qoidasida») · T-044 · T-045 (APK — «Mentor ilovasida»; bir qurilma qoidasining chegarasi ochiq) · T-047 · T-048 · T-049 · T-052 · T-064 · T-066 · T-070 («taklif qilgan» ↔ «taklif kodi bilan ochilgan hisob») ·
  P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-026 · P-028 · P-036 · P-046 · P-048 · P-052 · P-055 · P-059 · P-062 · P-063 (`QOIDA_KATAKLAR`, `MENTOR_SANOQ`) · P-064 · P-067 ·
  S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-018 (brend yo'q) · S-019 · S-020 · S-026 · S-040 · PM-018 · SABOQ 6, 9, 11, 12, 13, 16, 17, 19–31, 36, 39, E 40–55.
- [x] Tekshiruv: `npm run lint:til feedback/F-1007-13modul/10-ReferralDay-v3.md` — **0 error, 0 warn** (07.10.2026; birinchi yurishda 4 error — MD izohidagi maket so'zi (`chip-uz` qoidasi) «quti» ga almashtirildi; 2 warn — ru so'zlari va va'da iborasi izohdan olindi).
