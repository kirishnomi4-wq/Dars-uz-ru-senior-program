# 14-Modul · 6-dars «Demoga tayyorgarlik: risklar va B reja» — MD v3 (yangi dars, TEX — loyiha kuni shakli) <!-- TAXMIN T20 --> <!-- TAXMIN T9 -->

Fayl: `src/12-Modull/DemoPrepLesson.jsx` (kalit `m12-06`, App.jsx `type: 'Kod'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar — tayanch 4 «TEX loyiha kuni shakli») · faqat o'zbekcha (ru — 6-RU bosqichida) <!-- TAXMIN T9 -->
Dars yangi — hamma ekran noldan, to'liq yozildi. Dasturda TEX, shakli — loyiha kuni (T9); keyssiz (tayanch 5). Qolip: QKirish · QReja · QTushuncha · QTest · amaliyot bloki (QBlok) · QNatija · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx 472-qator, grep 08.10): «Demoga tayyorgarlik: risklar va B reja» · osti «demo stsenariysi, B reja va yangi funksiyani to'xtatish» · <!-- TAXMIN T20 -->
oldingi `m12-05` «Guruh pitchingizda nimani tuzatishni aytadi?» · keyingi `m12-07` «Investor ko'zi bilan: demo buzilmaydimi?».
Namuna (tuzilish, hajm; matn ko'chirilmadi): 13-Modul `05-PaymentDay-v3.md` + `05-FILTR.md` (loyiha kuni shakli, uch blok, holatga qarab yakun) · 12-Modul `09-RetentionDay-v3.md` (loyiha kuni, Mentor bosqichli gaplari) · pilot `07-PmDemoTest-v3.md` (keyingi dars — stsenariy, B reja, demo o'tishi shu MD dan o'qiladi).
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · yorliq input ichida (E 43) · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · maketda hech narsa kesilmaydi (E 41) · ko'p elementli mashq ketma-ket (E 53) · odamlar chizilmaydi.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **D** (`correctIdx 3`) · 7-ekran **B** (`correctIdx 1`) · arena A·B·C·D ×3. Final tartib-mashqi yo'q (loyiha kuni, 172).
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 6 · 2 ≈ 8 · Amaliyot 1 ≈ 20 · 4 ≈ 2 · 5 ≈ 6 · Amaliyot 2 ≈ 26 · 7 ≈ 2 · Amaliyot 3 ≈ 16 · podium, kartochkalar, yakun ≈ 4 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (Amaliyot 2 da video yozish va Backend uyg'onishi, Amaliyot 3 da brauzer ko'rinishini qayta eksport va Netlify kutiladi); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 11-band.
⚠️ **Halollik va xavfsizlik chegarasi (TAQIQLAR 1, 2, 3; tayanch 1.6) — har ekranga tegadi:** bugun mahsulotga **yangi funksiya qo'shilmaydi** (tayanch 1.0) · demo **namuna akkaunt** bilan va **real o'yinchilari yo'q o'yinda** (12-Modul tayanchi 9.44 c — real odamlarga jonli xabar bormasin, proyektorda haqiqiy foydalanuvchi ma'lumoti ko'rinmasin) ·
login, parol, `.env` qiymatlari `DEMO.md` ga, repo'ga, agent chatiga va videoga tushmaydi · **B reja videosi** laptopda faylda turadi — ommaviy joyga, sinf chatiga, repo'ga yuklanmaydi (TAQIQLAR 1 video qoidasi) <!-- TAXMIN T12 --> ·
«demo buzilmaydi», «demo o'tadi» kabi kafolat yo'q — natija faqat demo o'tishi bilan ko'riladi · Mentor misolining demo o'tishi vaqti va videosi — **⛔ «qur» pilotida** (MD da kutilgan shakl, son to'qilmaydi). <!-- TAXMIN T6 -->

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4: «repetitsiya qilingan demo»; tayanch 1.6):** dars oxirida o'quvchining o'z repo'sida, o'z mahsuloti va trekida:
   (a) `DEMO.md` — **demo stsenariysi** (tayyorlov qatorlari · besh qadam · «Keyin» — holatni boshiga qaytarish) va **risklar ro'yxati** (har risk + **B yo'l**) (Amaliyot 1);
   (b) demo uchun **namuna akkaunt** ikkala qurilmada, Backend **uyg'otib** ko'rilgan, **B reja** — demo stsenariysining ekran videosi laptopda faylda, `DEMO.md` da «B reja» bo'limi (Amaliyot 2); <!-- TAXMIN T8 -->
   (c) o'z repo'sida teg `m14-demo` — shundan keyin **yangi funksiya to'xtatildi**, va demo taymer bilan bir marta to'liq ko'rsatilgan — **demo o'tishi** (Amaliyot 3). <!-- TAXMIN T4 --> <!-- TAXMIN T10 -->
   Saqlanadi `pm-m12d6-demo` (12-band; 7 va 13-darslar o'qiydi). Teg `m14-dars-06-done` (tayanch 3). Yakun sarlavhasi holatga qarab (11-ekran, besh holat). **Uyga vazifa yo'q** (loyiha kuni — sinf 14). Keyingi darslar ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Demo — oldindan yozilgan qadamlar; har riskka B yo'l tayyor, teg qo'yilgach esa faqat tuzatish qilinadi. (104)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 11-Modul 15-darsi: **risk** — «Risk — rejaga xalaqit berishi mumkin bo'lgan narsa.» (11-Modul tayanchi 2). Bugun — bir gap bilan ko'prik (Amaliyot 1 3-qadam): rejaga emas, demoga. 11-Modulda riskka qarshi ish «qadam» deyilgan — bu darsda **«B yo'l»** (tayanch 1.6; «qadam» — demo stsenariysining qadami, T-015).
     Render bepul xizmati uxlashi — 11-Modulda risk sifatida o'tilgan («birinchi ochilish bir daqiqagacha»). Hook (0-ekran) shuni hakamlar oldidagi chiqishga ko'chiradi.
   - 11-Modul 16-darsi va 12-Modul 12-darsi: **jonli demo** — pitchda ilovani ishlatib ko'rsatish; zaxira — **ekran videosi** («jonli ko'rsatish ishlamasa, shuni ko'rsatasiz»); 12-Modulda ikki qurilmali jonli demo: birida bosiladi, ikkinchisida son o'zi o'zgaradi;
     demo — real odamlar qo'shilmagan o'yinda (Mentor — namuna o'yin «Shanba, 18:00»); demodan keyin «O'yindan chiqish» — son avvalgi holatiga qaytadi (12-Modul tayanchi 9.44 c; `12-PmGrowthPitch-v3.md` 8-ekran).
   - 12-Modul: **namuna akkaunt** — namuna ism va login bilan, `namuna = true`, sanoqqa kirmaydi (12-Modul tayanchi 1.7, 9.5) · **«Hozir ko'ryapti: N»** — shu o'yin ekranini hozir ochib turgan ulanishlar soni (12-Modul 4-darsi) · **mehmon ko'rinishi** — `GET /oyinlar` tokensiz (12-Modul 8-darsi) ·
     **brauzer ko'rinishi** — `npx expo export -p web` → `netlify deploy --prod --dir dist`; push'dan keyin o'zi yangilanmaydi (12-Modul tayanchi 9.28) · **yashirin oyna** — kompyuterdagi ikkinchi oyna, boshqa akkaunt bilan (12-Modul 9.35 b).
   - 14-Modul 1-darsi (pilot): **hakam** — «Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi.» (tayanch 9.12 — keyingi darslarda glosssiz) · pitch vaqti (bu mashqda): **Yechim — 90 soniya, jonli demo shu ichida** (tayanch 9.1). <!-- TAXMIN T19 -->
   - 14-Modul 3, 4-darslari: lending Lighthouse bilan o'lchangan (`pm-m12d3-tezlik`; 9.5) · demo yo'li sayqallangan — «Qo'shilaman» bosilgach tugma holatini o'zgartiradi, ikki marta bosilmaydi (tayanch 1.4). <!-- TAXMIN T5 --> <!-- TAXMIN T7 -->
   - Agent (Antigravity) · talab (qayerda · nima qilsin · nima buzilmasin) · push odati: `git status` — o'zgargan fayllar agent ro'yxati bilan bir xil, `.env` yo'q; `git add <fayl>` (tayanch 3) · **teg** — o'quvchi «Ortda qoldingizmi» qatorida Mentor teglarini ko'rgan (`git checkout -f m14-dars-NN-done`), o'zi teg qo'ymagan (grep `git tag` — 9–13-Modul MD larida 0).
4. **Bugun yangi — har biri hodisadan KEYIN, bir marta (T-011); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **demo stsenariysi** · **demo o'tishi** (tayanch 2, T10) — 2-ekranda, Mentor demosi ikki marta ko'rsatilgandan keyin, `QIzoh`da bitta gap: «Demoda bosiladigan qadamlar ro'yxati — demo stsenariysi; boshidan oxirigacha bir marta ko'rsatish — demo o'tishi.» <!-- TAXMIN T10 -->
     Kartochka 1, 2 va yakun 1-qatori — shu so'zlar. **«boshiga qaytarish»** — demo o'zgartirgan holatni keyingi o'tishdan oldin qaytarish (tayanch 9.10; 2-ekran — hodisa, xulosa).
   - **B yo'l** (tayanch 1.6) — Amaliyot 1 3-qadamda, Backend uxlagan hodisasi (0-ekran) va 11-Moduldagi risk ko'prigidan keyin: «Risk bo'lsa ham demo davom etishi uchun oldindan qilinadigan ish — B yo'l.» Qoida (kulrang qator): «B yo'lga yangi kod yozilmaydi: demodan oldin yangi kod — yangi risk.» (TAYANCHGA SAVOL 1)
   - **B reja** — tayanch 2 da o'zgarmaydigan atama, 11-Modulda «ekran videosi» edi; 5-ekranda ko'prik bilan: «Demo ishlamay qolsa, o'rniga ko'rsatiladigan oldindan yozilgan ekran videosi — B reja.» Mentor misolida — 60 soniya (tayanch 1.6, 1.14).
   - **uyg'otish** (tayanch 1.6) — demo oldidan Backend'ga bitta so'rov; hodisa 0-ekranda, ish Amaliyot 2 2-qadamda.
   - **yangi funksiya to'xtatildi** (tayanch 2; kartochkada «inglizchasi: feature freeze») — Amaliyot 3 2-qadamda, teg qo'yilgandan keyin: «Shu tegdan keyin demo kunigacha mahsulotga yangi narsa qo'shilmaydi — faqat tuzatish. Bu holat «yangi funksiya to'xtatildi» deyiladi.» Urug'i — Amaliyot 1 dagi «B yo'lga yangi kod yozilmaydi» qatori va 4-ekran D variantining izohi.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2):** <!-- TAXMIN T19 -->
   - **«demo»** — jonli demo (o'quvchining va Mentorning) yoki demo stsenariysi; **«demo o'tishi»** — boshidan oxirigacha bir marta. «progon», «sinov», «repetitsiya» (bu ma'noda), «demo-test» — yo'q. **«ko'rsatish»** — fe'l (demoni ko'rsatish).
   - **«qadam»** — demo stsenariysining qadami (5 ta) va amaliyot blokidagi qadam («1 · Ochish») — ikkalasi qolip so'zi (07 pilot bilan bir); riskka qarshi ish — «B yo'l», «qadam» emas.
   - **«risk»** — demoga xalaqit berishi mumkin bo'lgan narsa; besh risk nomi tayanch 1.6 aynan: «Internet yo'q» · «Backend uxlagan» · «Login esdan chiqdi» · «Ro'yxat bo'sh» · «Ikki marta bosish».
   - **«B yo'l»** — bitta riskka tayyorlangan ish; **«B reja»** — faqat ekran videosi (T-015: B reja — «Internet yo'q» riskining B yo'li). «zaxira reja» — yo'q (12-Modul 10-darsida boshqa ma'no).
   - **«uyg'otish»** — Backend'ga bitta so'rov; **«namuna akkaunt»** — demo uchun, sanoqqa kirmaydigan akkaunt (12-Modul). 7-darsdagi «tekshiruv akkaunti» (agent ochadi va `id` bo'yicha o'chiradi) bu darsda yo'q.
   - **«tayyorlov»** — demo boshlanishidan oldin belgilanadigan qatorlar (`DEMO.md` stsenariy bo'limida). **«zal»** — demo ko'rsatiladigan joy (12-Modul). **«hakam»** — glosssiz (9.12). **«sherik»** — hakam o'rnida o'tiradigan sinfdosh (ixtiyoriy, ismsiz).
   - **«teg»** — repo'dagi bir holatga qo'yilgan nom (`m14-demo`); **«tuzatish»** — demo yo'lidagi muammoni to'g'rilash (yangi funksiya emas). **tekshirish · tekshiruv** — o'z ishini ko'rish; «sinov» bu darsda yo'q.
   - **Ishlatilmaydi:** server (prozada), progon, sinov, demo-test, feature freeze (prozada — faqat kartochkada «inglizchasi»), «muzlatish», «zaxira reja», «Demo Day» (o'quvchi matnida — 9.13; «hakamlar oldida chiqish»), investitsiya, «jamoa» (prozada), A1/A2/A3, `m12-06`, «Modul 14», keys, pilot.
6. **Mentor misoli (tayanch 1.6, 1.14 — aynan; o'quvchi matnida «Mentor misolida»; yangi tafsilotlar — TAYANCHGA SAVOL bilan):**
   - **Demo stsenariysi (`MENTOR_STSENARIY`, 5 qadam; chip yorliqlari 07 pilot bilan bir: «1 Kirish · 2 O'yinlar · 3 Qo'shilish · 4 Ikkinchi telefon · 5 Hozir ko'ryapti»):** <!-- TAXMIN T8 -->
     1. Kirish: ilova ochiq, namuna akkaunt kirgan (42) · 2. O'yinlar: «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (52) · 3. Qo'shilish: «Qo'shilaman» — laptopda «9 / 10» (45) · 4. Ikkinchi telefon: son o'zi «9 / 10» bo'ladi (43) · 5. Hozir ko'ryapti: 2 (18)
     Vaqt — **Mentor rejasi: 60–90 soniya** (tayanch 1.14) · pitchda Yechim bo'lagi — 90 soniya, jonli demo shu ichida (9.1, bu mashqda).
   - **Tayyorlov (`MENTOR_TAYYORLOV`):** Backend uyg'otildi — ro'yxat chiqdi · ikkala qurilmada namuna akkaunt bilan kirilgan · demo holati boshida: «8 / 10», «Qo'shilaman» ko'rinadi · B reja videosi laptopda ochishga tayyor · telefon zaryadlangan (13-dars tayyorlovi bilan bir — tayanch 1.13).
     **Keyin (`MENTOR_KEYIN`, tayanch 9.10):** O'yindan chiqaman — yana «8 / 10» (33)
   - **Demo joyi (tayanch 1.6, 9.6; T8):** laptopdagi brauzerda Mentor ilovasining brauzer ko'rinishi (`maydon-jamoa-….netlify.app`) proyektorga · ikkinchi qurilma — **telefon brauzerida** o'sha manzil (APK yoki Expo Go emas — 9.6) · laptopda — 1-namuna akkaunt, telefonda — 2-namuna akkaunt. <!-- TAXMIN T8 -->
   - **Risklar va B yo'llar (`MENTOR_RISKLAR`; risk nomlari — tayanch 1.6 aynan; hodisa qatori va B yo'l — mening matnim, Mentorning o'z gapi «men» shaklida — T-008; TAYANCHGA SAVOL 2):**

   | Risk | Hodisa qatori (o'quvchiga, kartada) | B yo'l (Mentor misolida) |
   |---|---|---|
   | Internet yo'q | Zal Wi-Fi'i demo paytida uzilib qolishi mumkin. (47) | B reja: laptopdagi 60 soniyalik videoni ko'rsataman. (52) |
   | Backend uxlagan | Navbatingizni kutguncha ilovani hech kim ochmasligi mumkin. (59) | Navbatimdan bir necha daqiqa oldin demo yo'lini ochib, Backend'ni uyg'otaman. (77) |
   | Login esdan chiqdi | Kirish oynasi chiqsa, parol esdan chiqishi mumkin. (50) | Demodan oldin ikkala qurilmada namuna akkaunt bilan kirib qo'yaman. (67) |
   | Ro'yxat bo'sh | Demo kuni ro'yxatda birorta o'yin bo'lmasligi mumkin. (53) | Demo namuna o'yinda: «Shanba, 18:00» ro'yxatda turadi. (54) |
   | Ikki marta bosish | Hayajonda tugma tez ikki marta bosilishi mumkin. (48) | 4-darsdagi bosish javobi bor: «Qo'shilaman» bir bosishda holatini o'zgartiradi. (79) <!-- TAXMIN T7 --> |

   - **B reja gapi (`B_REJA_GAPI`; tayanch 9.9 — aynan, olam matni T-008):** «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» <!-- TAXMIN T8 -->
   - **Uyg'otish (Mentor misolida):** laptopda demo yo'lini ochish — ilova `GET /oyinlar` ni so'raydi (mehmon ko'rinishi uchun tokensiz ochiq — 12-Modul 8-darsi); Yordamda zaxira: brauzerda `https://maydon-jamoa-….onrender.com/oyinlar` — javobda o'yinlar ro'yxati (TAYANCHGA SAVOL 5).
   - **Video (Mentor misolida; ⛔ pilot):** laptop ekrani yozuvi, bitta demo o'tishi, 60 soniya; 4-qadam videoda ko'rinishi uchun laptopda ikki oyna yonma-yon — chapda demo yo'li (1-namuna akkaunt), o'ngda yashirin oynada o'sha o'yin (2-namuna akkaunt) (TAYANCHGA SAVOL 7). Fayl laptopda, repo papkasidan tashqarida.
   - ⛔ **«Qur» pilotida:** Mentorning demo o'tishi vaqti, video uzunligi, namuna o'yin demo kunida ro'yxatda turishi, telefon brauzerida real vaqt — haqiqiy laptop va telefonda; MD da vaqt — `{⛔ pilotda}`. Natija qanday chiqsa — shunday yoziladi (sinf 12).
7. **Raqamlar (faqat tayanch 1.14, 6 va 9.1 — boshqa son yo'q):** demo 5 qadam · Mentor rejasi 60–90 soniya · B reja video 60 soniya · Yechim bo'lagi 90 soniya (bu mashqda) · Render: **15 daqiqa** so'rovsiz qolsa uxlaydi, uyg'onishi **taxminan bir daqiqa** (rasmiy — «Manbalar») ·
   namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10» · «Hozir ko'ryapti: 2». Foydalanuvchi, tashkilotchi, tasdiq sonlari bu darsda aytilmaydi (sinf 12). «Bir necha daqiqa oldin» — son emas (uyg'otish 15 daqiqadan kam vaqt oldin bo'lishi Render qoidasidan kelib chiqadi).
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi (4-ekran; 07 pilot va 13-Modul arena 9 bilan bir olam). Metafora yo'q. Keys yo'q. Brend (Render, Netlify, Expo) — 11–13-Modul so'zi bilan.
9. **Xavfsizlik va halollik chegarasi (TAQIQLAR 1, 3; 12-Modul 9.44 c):**
   - demo — namuna akkaunt bilan, real o'yinchilari yo'q o'yinda — real odamlarga jonli xabar bormasin, proyektorda ularning ismi ko'rinmasin; namuna akkauntni agent ochadi (yo'q bo'lsa), `namuna = true` — sanoqqa kirmaydi; demo kunigacha kerak, shuning uchun bugun o'chirilmaydi;
   - login va parol — `DEMO.md`, repo, agent chati, video va kalitga yozilmaydi (o'quvchi o'zi biladi); `.env` qiymatlari agentga yuborilmaydi — xato bo'lsa faqat xato qatori;
   - B reja videosi: ekranda parol, `.env`, terminal, chat va haqiqiy foydalanuvchi ma'lumoti ko'rinmaydi; yuz va ovoz — ixtiyoriy (ekran yozuvi; ovoz shart emas); fayl laptopda — sinf chatiga, ommaviy joyga va repo'ga yuklanmaydi (tayanch 3: «demo videosi repo'da emas»; TAQIQLAR 1). <!-- TAXMIN T12 -->
   - sherik (hakam o'rnida) — ixtiyoriy, ismi hech qayerga yozilmaydi; kim kimdan tez o'tgani sanalmaydi;
   - kafolat yo'q: «demo buzilmaydi», «demo o'tadi» — yo'q; uyg'otishdan keyin ham «odatda» — natija ro'yxat chiqqanida ko'riladi; 3-darsda o'lchanmagan lending haqida «tez ochiladi» deyilmaydi (Amaliyot 1 2-qadam kulrang qatori).
10. **Kim nima yozadi (talab zinapoyasi):** Amaliyot 1 — stsenariy va B yo'llarni **o'quvchi o'zi** yozadi (Mentor namunasi «Yordam»da); `DEMO.md` ni agent so'zma-so'z ko'chiradi (tayyor prompt + `{demo yozuvi}` oldindan) ·
    Amaliyot 2 — namuna akkaunt talabi (tayyor + bitta joy `{demo yozuvi}`), uyg'otish va video — o'quvchi o'zi; `DEMO.md` «B reja» — agent (tayyor prompt + `{B reja yozuvi}` oldindan) · Amaliyot 3 — teg va demo o'tishi o'quvchining o'zida; yangi risk qatori — agent (tayyor prompt + uch joy).
    Kod yozilmaydi (yangi funksiya yo'q); tuzatish kerak bo'lsa — faqat tuzatish (Amaliyot 3 4-qadam). Mahsulot qarori (qaysi qadamlar, qaysi B yo'l, demo qaysi yozuvda) — o'quvchida (sinf 13).
11. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l (sinf 1):** taqsimot tepada. Kutishlar: Backend uyg'onishi (taxminan bir daqiqa — kutayotganda video uchun oynalarni tayyorlash), brauzer ko'rinishini qayta eksport va Netlify (Amaliyot 3 1-qadam — kutayotganda «Tayyorlov» qatorlari).
    «Davom etish» (SABOQ E 55): Amaliyot 1 — 3-qadamdan keyin (`DEMO.md` — Amaliyot 3 dan oldin, teg `DEMO.md` bilan qo'yilsin) · Amaliyot 2 — 2-qadamdan keyin (video — Amaliyot 3 dan keyin shu ekranga qaytib) · Amaliyot 3 — 2-qadamdan keyin (teg qo'yilgach).
    Blok bajarilgani — faqat 4-qadam «Bajardim»idan. Loyiha kunida «uyda» yo'q (sinf 14): ulgurmagan ish — yakun sarlavhasida (11-ekran). «Ortda qoldingizmi» — darsda bir marta, Amaliyot 1 da (tayanch 3).
12. **Saqlash kaliti (tayanch 8 — aynan):** o'qiydi `pm-m9d8-platforma` (`trek`; yo'q bo'lsa — `pm-m12d3-tezlik.trek`, u ham yo'q bo'lsa — Amaliyot 1 tepasida ikki chip «Mobil trek» · «Web-trek», tanlov dars holatida qoladi) · `pm-m12d3-tezlik` (Amaliyot 1 2-qadam kulrang qatori; 9.5) <!-- TAXMIN T5 --> → yozadi
    `pm-m12d6-demo` = `{ stsenariy: [string] (5), risklar: [{ risk, bYol }], video: bool | null, uygotish: bool | null, teg: bool | null, otishVaqt: n | null, savedAt }`. Maydonlar shartnomasi:
    `stsenariy` — Amaliyot 1 2-qadam «Saqlash»: besh qator, tartib o'zgarmaydi, bo'sh qator saqlanmaydi (har biri ≤60 belgi); «Tayyorlov» va «Keyin» qatorlari kalitda yo'q — `DEMO.md` va dars holatida (TAYANCHGA SAVOL 4) ·
    `risklar` — Amaliyot 1 3-qadam: har saqlangan karta `{ risk: <risk nomi>, bYol: <o'quvchi matni> }`; «Bu risk demongizda yo'q» bosilgan risk massivga kirmaydi; Amaliyot 3 4-qadamda yangi risk qo'shilishi mumkin (`risk` — o'quvchi yozgan qadam va nima bo'lgani); uzunligi 0–7 ·
    `uygotish` — Amaliyot 2 2-qadam: «Uyg'ondi — ro'yxat chiqdi» → `true` · «Ochilmadi» → `false` · tanlanmagan → `null` · `video` — Amaliyot 2 4-qadam: «Video tayyor» (uch tekshiruv belgilangan) → `true` · «Video hali yo'q» → `false` · `null` ·
    `teg` — Amaliyot 3 2-qadam: «Teg GitHub'da» → `true` · «Teg chiqmadi» → `false` · `null` · `otishVaqt` — Amaliyot 3 3-qadam taymeri, butun soniya; o'tilmagan → `null` · `savedAt` — har saqlashda.
    Kalitga login, parol, manzil (URL), video fayl nomi, sherik ismi yozilmaydi. Boshqa darsning kaliti yozilmaydi. Kod oynasi yo'q — `pm-m12d6-code` yo'q. 7-dars `stsenariy`, `video`, `uygotish` ni o'qiydi (07 pilot A-12); 13-dars — tayanch 8.
13. **Toza yuza (D4):** tugma, variant, maket va yorliqda emoji yo'q; ✓ ✕ › ✎ ↻ — belgilar. Laptop, telefon, Backend chirog'i, video oynasi, taymer chizig'i, `DEMO.md` kartasi — CSS/SVG; «Maydon Jamoa» nomi brauzer va telefon maketida o'z yashil rangida (11-Modul 9.62), logotip yo'q.
    Rang — holat foni (D3): rejadagidek / ishlayapti / video ochildi — `ok` · to'xtadi / sahifa ochilmadi / vaqt tugadi — `err` · uxlayapti / kutilmoqda — `ink2` · joriy / uyg'onmoqda — `accent`. Belgi-formula (→, =) o'quvchi izohida va test variantida yo'q — sahnada son o'zgarishi harakat bilan ko'rinadi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.4–1.7):** 4-darsda demo yo'li sayqallandi, 5-darsda guruh pitchga fidbek berdi. Bugun — demoning o'zi: qaysi qadamlar ko'rsatiladi, nima xalaqit berishi mumkin, internet uzilsa nima ko'rsatiladi; teg bilan yangi funksiya to'xtatiladi va demo bir marta to'liq o'tiladi. Keyingi dars uni ataylab buzib tekshiradi (ekranda va'da qilinmaydi).
- **Dars ipi:** 0 — navbat kutilganda ilova ochilmagan: birinchi bosish uzoq kutildi (Backend uxlagan) → 2 — Mentor demosi ikki marta: ikkinchisida 3-qadam to'xtaydi, holat boshiga qaytariladi → «demo stsenariysi», «demo o'tishi» → Amaliyot 1 (o'z stsenariysi va risklari, «B yo'l») →
  4 — kitob ilovasida keyingi o'tishdan oldin nima qilinadi → 5 — internet uzildi: kutish, havola, laptopdagi fayl → «B reja» → Amaliyot 2 (namuna akkaunt, uyg'otish, video) → 7 — uyg'otish qachon → Amaliyot 3 (teg — «yangi funksiya to'xtatildi»; taymer bilan demo o'tishi) → podium → kartochkalar → yakun.
- **Bitta vizual — «Demo sahnasi» (`DemoSahna`; bitta manba `MENTOR_STSENARIY` + `MENTOR_TAYYORLOV` + `MENTOR_KEYIN` + `MENTOR_RISKLAR` + `B_REJA_GAPI` + o'quvchi ma'lumoti `pm-m12d6-demo`; 163/180; 07 pilot sahnasi bilan bir xil qismlar — KOD 3):** <!-- TAXMIN T8 -->
  - **laptop brauzeri** (o'ngda, kattaroq; yorliq ramka ustida «laptop · proyektorga») — manzil satri `maydon-jamoa-….netlify.app`; ekranlar: «O'yinlar» ro'yxati · «O'yin» ekrani («Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman» yoki «O'yindan chiqish» · «Hozir ko'ryapti: N») · «Yuklanmoqda…» · «Sahifa ochilmadi» · video oynasi (o'ynatish chizig'i, «60 soniya»).
    Laptop ustida kichik **Backend chirog'i** (yorliq «Backend · Render»): kulrang «uxlayapti» → accent «uyg'onmoqda…» → yashil «ishlayapti». Wi-Fi belgisi (5-ekranda kesilgan).
  - **telefon** (chapda, ≈170×272; yorliq «2-qurilma · telefon brauzeri») — o'sha «O'yin» ekrani, tepada kichik manzil satri; son o'zi o'zgaradi. «Maydon Jamoa» nomi o'z yashil rangida.
  - **stsenariy chizig'i** (tepada, butun kenglikda) — besh chip «1 Kirish · 2 O'yinlar · 3 Qo'shilish · 4 Ikkinchi telefon · 5 Hozir ko'ryapti» (joriy — accent, o'tgani ✓, to'xtagani — qizil); ostida **taymer chizig'i** (12-Modul `TaymerChiziq` naqshi; yorliqlar «Mentor rejasi: 60–90 soniya» · 5-ekran va Amaliyot 3 da «Yechim bo'lagi: 90 soniya»).
  - **`DEMO.md` kartasi** (fayl ko'rinishi, mono sarlavhalar «## Stsenariy» · «## Risklar» · «## B reja») — 1-ekran (bo'sh qatorlar) va bloklarning o'ng tomoni (kutilgan natija).
  - Ishlatiladi: 0 (laptop + chiroq + qadam belgilari) · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (ikki o'tish va boshiga qaytarish) · 5 (Wi-Fi kesilgan, uch yo'l) · 3, 6, 8 (o'ng — kutilgan natija) · 4, 7 (javobdan keyin kichik ko'rinish).
  - Son almashganda bir lahza kattalashib qaytadi; `prefers-reduced-motion` da yurish va miltillash yo'q — holatlar birdan almashadi (DE-200). 393 kenglikda telefon brauzer ustida, o'lchami barqaror; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va sahna tugmasining o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Yakun:** demongizning stsenariysi, risklari va B rejasi `DEMO.md` da, teg `m14-demo` qo'yilgan, demo taymer bilan bir marta o'tilgan · keyingi dars — «Investor ko'zi bilan: demo buzilmaydimi?». <!-- TAXMIN T20 -->

---

## 0 · Kirish — birinchi bosish  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Ilova uzoq ochilmadi — birinchi bosishda nima bo'ladi?** (54)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - boshida: Mentor misolida boshqalar pitch aytguncha ilovani hech kim ochmadi — avval javobni tanlang. (91)
  - javobdan keyin: Endi laptopda «O'yinlar»ni bosing va nima bo'lishiga qarang. (60)
- Maket (`DemoSahna` «kirish» holati): o'ngda laptop brauzeri — `maydon-jamoa-….netlify.app`, «Maydon Jamoa» (o'z rangida), «O'yinlar» tugmasi (javobgacha xira); laptop ustida Backend chirog'i — kulrang, yozuvsiz (holati javobdan keyin ochiladi);
  chapda telefon (kulrang, «2-qurilma · telefon brauzeri»); tepada stsenariy chizig'ining besh chipi — kulrang (nomi hali aytilmaydi). Ramka ustida yorliq «Mentor misoli · Maydon Jamoa».
- Variantlar (radio, o'ng; bir shaklda — «Ro'yxat/Ilova … », P-016):
  - Ro'yxat odatdagidek bir-ikki soniyada chiqadi (45)
  - ✔ Ro'yxat bir daqiqagacha chiqmay turishi mumkin (46)
  - Ilova xato berib, sahifa yopilib qolishi mumkin (47)
- Javob:
  - 2-variant: **Aynan!** Render'ning bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi. Birinchi so'rov uni taxminan bir daqiqada uyg'otadi. (120)
  - 1-variant: **Qiziq fikr!** Odatda shunday. Lekin bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi va taxminan bir daqiqada uyg'onadi. (117)
  - 3-variant: **Qiziq fikr!** Bunday ham bo'lishi mumkin. Mentor misolida ro'yxat chiqdi — faqat uxlagan Backend uyg'ongandan keyin. (114)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi, javob qatori chiqadi, «O'yinlar» faollashadi (halqa) → «O'yinlar» bosiladi → laptopda «Yuklanmoqda…», Backend chirog'i kulrang «uxlayapti» → accent «uyg'onmoqda…» (ostida kichik soat bir necha soniya yuradi, yorliq «taxminan bir daqiqa» — animatsiya, o'lchov emas) →
  ro'yxat chiqadi: «Shanba, 18:00 · Mahalla maydoni · 8 / 10», chiroq yashil «ishlayapti»; stsenariy chizig'ining 2-chipi ustida kulrang yorliq «Backend uxlagan edi». Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (hook; J-026: `correct: false` hammaga; ✔ — faqat MD belgisi: qaysi javobga «Aynan!»). Tugma: Javobni tanlang → «O'yinlar»ni bosing → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «O'yinlar» (halqa) → «Davom etish».
- O'qituvchi eslatmasi: Render uxlashi 11-Modulda risk sifatida o'tilgan («birinchi ochilish bir daqiqagacha») — sinfdan so'rang: «Pitch paytida sizda nima ishlamay qolgan?» Javoblarni taxtaga yozing — ular bugungi risklar ro'yxatiga o'xshab chiqadi; kim nima deganini sanamang.
  Hakamlar oldidagi chiqishda boshqalar pitch aytayotganda 15 daqiqa tez o'tadi — uyg'otish navbatdan oldin qilinadi (Amaliyot 2).
✎ Hook obyekti — darsning o'qitish obyekti (P-001): demo va uning birinchi riski. Uchala variant — o'quvchining o'z kutishi (P-016); 1 va 3-variant hayotda bo'lishi mumkin — javob ularni yolg'onga chiqarmaydi («odatda shunday», «bunday ham bo'lishi mumkin»). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067).
  Render fakti — rasmiy («spins down … 15 minutes», «about one minute» — Manbalar 1); «uyg'otish» atamasi hali aytilmaydi (Amaliyot 2 da ish sifatida). Stsenariy chiplari nomsiz — atama 2-ekranda (T-011).

## 1 · Bugun tayyorlaymiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun demongizni hakamlar oldiga tayyorlaysiz.** (46)
- Mentor: Har blokni avval Mentor misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Bugun mahsulotga yangi narsa qo'shilmaydi. (120)
- Chap — «Dars oxirida»: sahna **tayyor** holatda, bir marta o'zi yuradi (DE-200): `DEMO.md` kartasi — uch sarlavha «## Stsenariy» · «## Risklar» · «## B reja», ostida kulrang uzuq qatorlar (U-041: bugun to'ladigan joy; mazmun ochilmaydi — P-015);
  yonida teg belgisi `m14-demo`; ostida taymer chizig'i bir marta oxirigacha yuradi (yorliqsiz).
- O'ng — bugungi uch qadam (tex-karta «01 · matn», bosilmaydi; qadam ostida teg yo'q — loyiha kuni naqshi; so'zlar App.jsx `sub` bilan — P-015):
  - 01 · Demo stsenariysi va risklar
  - 02 · Namuna akkaunt, uyg'otish va B reja videosi
  - 03 · Yangi funksiyani to'xtatish va demoni bir marta ko'rsatish
- Pastki qator (mono, kichik): o'z repo'ngiz — `DEMO.md`, teg `m14-demo` · Mentor misoli `maydon-jamoa` · boshlang'ich `m14-dars-06-start` · namuna `m14-dars-06-done` <!-- TAXMIN T4 -->
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: og'ir qism — Amaliyot 2 (namuna akkaunt, Backend uyg'onishi, video yozish). Telefon proyektorga ulanmaydi: demo laptop brauzerida, telefon — ikkinchi qurilma (tekshirilmagan yo'l kursda ishlatilmaydi). <!-- TAXMIN T8 -->
  Juftlikda qulay: biri laptopda, ikkinchisi telefonda kuzatadi — har kim baribir o'z mahsulotini tayyorlaydi. Bugun kod yozilmaydi; agent faqat `DEMO.md` ni yozadi va kerak bo'lsa namuna akkaunt ochadi.
✎ Sarlavha — natija va'dasi (P-014), yangi atama yo'q («hakam» — 1-darsdan, 9.12). «B reja» — dars nomidagi so'z (o'zgarmaydigan atama, tayanch 2); ta'rifi 5-ekranda. 02-qadam — tayanch 1.6 dagi uch ish, App.jsx `sub` tartibida; «B reja videosi» — o'quvchi matnida «B reja» faqat video (T-015), qolgan ikkitasi — Amaliyot 2 sarlavhasida «B yo'llar».

## 2 · Demoni ikkinchi marta ko'rsatish  ← QTushuncha (bashorat + 3 harakat, ketma-ket)
- Eyebrow: Tushuncha · demo stsenariysi
- Sarlavha: **Demoni ikkinchi marta ko'rsatsangiz, nima bo'ladi?** (50)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval taxminingizni belgilang, keyin «Demoni ko'rsatish»ni bosing. (66)
  - 1-harakatdan keyin: Endi xuddi shu demoni «Yana bir marta» bilan ko'rsating. (56)
  - 2-harakatdan keyin: 3-qadam to'xtadi — «Boshiga qaytarish»ni bosing. (48)
  - tugagach: Natijani taxminingiz bilan solishtiring. (40)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bir o'lchov, o'sish tartibida): **Mentor demoni ikkinchi marta ko'rsatsa, nima bo'ladi?** · Birinchisidek o'tadi (20) · O'rtasida to'xtaydi (19) · Boshidanoq ochilmaydi (21) —
  tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi; «Demoni ko'rsatish» shundan keyin yoqiladi.
- Vizual (≤ 3 blok: sahna · sahna tugmalari · natija): tepada stsenariy chizig'i va taymer (yorliq «Mentor rejasi: 60–90 soniya») · o'ngda laptop brauzeri («O'yin» ekrani, 1-namuna akkaunt) · chapda telefon (2-namuna akkaunt) ·
  sahna ostida uch tugma (chegarali, navbat bilan yoqiladi): «Demoni ko'rsatish» · «Yana bir marta» · «Boshiga qaytarish».
- **Harakat → Vizual o'zgarish:**
  1. «Demoni ko'rsatish» → besh chip navbat bilan yonadi (≈10 s animatsiya; taymer chizig'i oxirigacha yuradi — animatsiya vaqti son emas): 1 laptopda ilova ochiq, akkaunt kirgan → 2 «O'yinlar» — «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → 3 «Qo'shilaman» bosiladi, laptopda «9 / 10», tugma «O'yindan chiqish» bo'ladi →
     4 telefonda «8 / 10» o'zi «9 / 10» bo'ladi (son bir lahza kattalashadi) → 5 «Hozir ko'ryapti: 2». Beshala chip ✓.
  2. «Yana bir marta» → qadam belgilari kulrangga qaytadi; 1 ✓ → 2 ✓ (ro'yxatda «9 / 10») → 3: laptopda «Qo'shilaman» yo'q — o'rnida «O'yindan chiqish» turibdi; chip qizil, ustida kulrang yorliq «Mentor allaqachon qo'shilgan» → 4, 5 — kulrang (yetib bormadi); telefonda «9 / 10» o'zgarmaydi.
  3. «Boshiga qaytarish» → laptopda «O'yindan chiqish» bosiladi → «8 / 10», «Qo'shilaman» qaytadi; telefonda «8 / 10»; qadam belgilari kulrang, tayyor. Stsenariy chizig'i ostida ikki kulrang qator sirg'alib chiqadi:
     «Tayyorlov: o'yin «8 / 10», «Qo'shilaman» ko'rinadi» va «Keyin: o'yindan chiqaman — yana «8 / 10»».
  Noto'g'ri harakat yo'q — tugmalar navbat bilan yoqiladi; qaror bashoratda, natija harakatda (P-046).
- Natija (bitta blok — E 42; `tugadi`: tugmalar yopiladi, sahna butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: o'rtasida to'xtaydi».
- Xulosa: Bu misolda demo o'yindagi sonni o'zgartiradi: keyingi ko'rsatishdan oldin holat boshiga qaytariladi. (100)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Demoda bosiladigan qadamlar ro'yxati — demo stsenariysi; boshidan oxirigacha bir marta ko'rsatish — demo o'tishi. (113) — ikki atama shu yerda tug'iladi (T-011) <!-- TAXMIN T10 -->
- Tugma (pastki): Avval belgilang → Tugmalarni navbat bilan bosing (N/3) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing — laptop va telefonga qarang. (53)
- Keyingi bosiladigan joy: bashorat variantlari → joriy sahna tugmasi (halqa) → «Davom etish».
- O'qituvchi eslatmasi: Ma'lumot o'zgartiradigan har demo (qo'shilish, buyurtma, xabar) ikkinchi marta ko'rsatishdan oldin boshiga qaytariladi — Mentor misolida «O'yindan chiqish» (12-Modul 12-darsida ham shunday edi). Sinfdan so'rang: «Sizning demongizda qaysi qadam ma'lumotni o'zgartiradi?»
  Demo stsenariysi — umumiy qolip emas: o'quvchida qadamlar boshqa bo'ladi; besh qadam — bu mashqdagi shakl (sinf 4).
✎ Sarlavha 0-ekrandan keyingi savol: demo bir marta ishladi — ikkinchi marta-chi? (T-064). Atamalar faqat ikki o'tishdan keyin (T-011; tugma nomlarida «o'tish» so'zi yo'q). Bitta g'oya (P-008): demo holatni o'zgartiradi — tayyorlov va «Keyin» qatori kerak (tayanch 9.10).
  «Mentor allaqachon qo'shilgan» — Mentor misolining sahna holati (`O'yindan chiqish` 12-Modulda bor); boshqa sabab to'qilmaydi.

## 3 · Amaliyot 1 — stsenariy va risklar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Demongizning stsenariysi va risklarini yozing.** (46)
- Mentor: Qadamlar va risklarni o'z demongizdan yozasiz, Mentor namunasi «Yordam»da; «1 · Ochish»dan boshlang. (100)
- Model (tayanch 4, 1.6): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam»da Mentor matni). Talab zinapoyasi: stsenariy va B yo'llar — o'quvchining o'z matni; `DEMO.md` — tayyor prompt + oldindan to'ldirilgan `{demo yozuvi}`.
  Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — `pm-m12d3-tezlik.trek`; ikkalasi ham yo'q bo'lsa — blok tepasida «Mobil trek» · «Web-trek» chiplari, tanlov dars holatida qoladi).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.
     Demo yo'lingizni laptop brauzerida oching (mobil trekda — brauzer ko'rinishi, web-trekda — saytingiz). Telefonda o'sha manzilni brauzerda oching — bu ikkinchi qurilma. <!-- TAXMIN T8 -->
     Kulrang qator: APK yoki Expo Go emas: yangi versiyadan keyin sahifani yangilasangiz, ikkala ekranda bir xil versiya bo'ladi. (109)
     Mahsulotingizda ikkinchi qurilmada ko'rinadigan o'zgarish bo'lmasa — demo bitta laptopda, telefon kerak emas.
  2. **Stsenariy** — chapda besh qator va «Keyin» qatori (yorliq input ichida — E 43): «1 · Qaysi ekran va zal nimani ko'radi?» … «5 · …» · «Keyin · Holatni qanday boshiga qaytarasiz?». Har qator — bitta qadam, qisqa. «Saqlash».
     Kulrang qator (`pm-m12d3-tezlik.keyin.baho` bor bo'lsa): 3-darsda lendingingiz o'lchangan: Lighthouse bahosi {oldin} va {keyin}. Tezlik haqida shu son bilan gapiring. (109) <!-- TAXMIN T5 -->
     (`keyin.baho` yo'q bo'lsa): Lending tezligi o'lchanmagan — demoda «tez ochiladi» demang. (60)
     Yordam (Mentor misolidan, A-6): 1 Kirish: ilova ochiq, namuna akkaunt kirgan · 2 O'yinlar: «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · 3 Qo'shilish: «Qo'shilaman» — laptopda «9 / 10» · 4 Ikkinchi telefon: son o'zi «9 / 10» bo'ladi · 5 Hozir ko'ryapti: 2 · Keyin: O'yindan chiqaman — yana «8 / 10».
     Tekshiruv (`QXato`, ≤60; «Saqlash» bosilganda):
     - qator bo'sh (bloklaydi): Besh qadamni yozing — har qatorga bittadan. (43)
     - qator 60 belgidan uzun (yumshoq): Qadamni qisqartiring: ekran va zal ko'radigan narsa. (52)
     - «Keyin» bo'sh (yumshoq): Holat o'zgaradimi? O'zgarmasa — «kerak emas» deb yozing. (56)
     - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana bosing. (35)
  3. **Risklar** — tepada ikki kulrang qator (birinchi kartadan oldin, bir marta):
     11-Modulda risk — rejaga xalaqit berishi mumkin bo'lgan narsa edi; bugun — demoga. (82)
     Risk bo'lsa ham demo davom etishi uchun oldindan qilinadigan ish — B yo'l. (74) — atama shu yerda tug'iladi (T-011: hodisa — 0-ekran va kartaning hodisa qatori)
     Keyin besh karta, bittadan (E 53; «Risk n / 5»): tepada hodisa qatori (katta) → ostida risk nomi (kulrang yorliq) → maydon (yorliq input ichida): «B yo'l · Oldindan nima qilasiz?». Kartalar tartibi — A-6 jadvali (Internet yo'q · Backend uxlagan · Login esdan chiqdi · Ro'yxat bo'sh · Ikki marta bosish).
     Karta ostida tugmalar bir qatorda: «Keyingi risk» (asosiy; beshinchisida — «Saqlash») · «Bu risk demongizda yo'q» (ikkinchi) · o'ngda «Yordam».
     Kartalar ostida doimiy kulrang qator: B yo'lga yangi kod yozilmaydi: demodan oldin yangi kod — yangi risk. (68)
     Yordam — joriy riskning Mentor B yo'li (A-6 jadvali). «Internet yo'q» kartasida qo'shimcha: «B reja — laptopdagi oldindan yozilgan ekran videosi (11-Modulda jonli ko'rsatish ishlamasa ko'rsatilgan video); uni Amaliyot 2 da yozasiz.»
     Tekshiruv (`QXato`, ≤60; «Keyingi risk» yoki «Saqlash» bosilganda):
     - bo'sh (bloklaydi): B yo'lni yozing: demodan oldin nima qilasiz? (44)
     - «yangi» yoki «qo'sh» bilan birga «kod», «tugma» yoki «funksiya» bo'lsa (yumshoq): Bu — yangi kod. Demodan oldin tayyor ishni yozing. (50)
     - «umid», «omad», «yaxshi ishlaydi», «hammasi joyida» kabi so'z bo'lsa (yumshoq): Buni demodan oldin qanday qilasiz? Bitta ishni yozing. (54)
     «Bu risk demongizda yo'q» → karta ixcham kulrang qatorga yig'iladi («Login esdan chiqdi · demoda yo'q»), keyingisi kiradi.
  4. **`DEMO.md`** — «Nusxalash»ni bosing va Antigravity'ga yuboring (`{demo yozuvi}` oldindan to'ldirilgan — 2, 3-qadamdan):
     > Loyiha ildizida `DEMO.md` faylini yarat (fayl bor bo'lsa — faqat «## Stsenariy» va «## Risklar» bo'limlarini yangila). Pastdagi yozuvimni so'zma-so'z ko'chir: «## Stsenariy» — avval «Tayyorlov» qatorlari, keyin besh qadam raqam bilan, oxirida «Keyin» qatori; «## Risklar» — har qator «risk — B yo'l».
     > Login, parol va `.env` qiymatlari bu faylga yozilmaydi. Faylning boshqa joyiga va boshqa fayllarga tegma. Nima yozganingni ayt.
     > {demo yozuvi}
     Qavs: {demo yozuvi} — «Tayyorlov» to'rt qatori (kurs qatorlari: «Backend uyg'otildi» · «Ikkala qurilmada namuna akkaunt bilan kirilgan» · «Demo holati boshida» · «B reja videosi laptopda ochishga tayyor») + besh qadam + «Keyin» + saqlangan risklar.
     Agent tugatgach: `DEMO.md` ni yozuvingiz bilan solishtiring; `git status` — faqat `DEMO.md`, `.env` yo'q → `git add DEMO.md` → `git commit -m "demo stsenariysi va risklar"` → `git push`.
     Xato chiqsa — faqat xato qatorini agentga yuboring (`.env` qiymatlarini emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt.»
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam bitta qatorga yig'iladi (✓), keyingisi ochiladi · 2-qadam «Saqlash» → besh qator o'ngdagi `DEMO.md` kartasining «## Stsenariy» bo'limiga uchadi · 3-qadam «Keyingi risk» → karta ixcham qatorga yig'iladi («risk · B yo'l» — uzun matn qisqartiriladi, SABOQ 29), keyingisi kiradi; «Saqlash» → «Risklar · N ✓» ·
  4-qadamdan keyin yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok): `DEMO.md` kartasi — «## Stsenariy» (Tayyorlov — `MENTOR_TAYYORLOV`; besh qadam — `MENTOR_STSENARIY`; Keyin — `MENTOR_KEYIN`) va «## Risklar» (besh qator — A-6 jadvali); tepada kichik sahna: laptop va telefon. Web-trekda: o'sha karta, brauzerda `….netlify.app`.
- Hammasi bajarilgach (yashil): Stsenariy va risklar `DEMO.md` da — endi B yo'llarni tayyorlaysiz. (64)
- Saqlanadi: `pm-m12d6-demo.stsenariy` (2-qadam) · `.risklar` (3-qadam) · `savedAt` (A-12).
- Pastki qator (kichik; darsda bir marta — tayanch 3): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-06-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz. <!-- TAXMIN T4 -->
- Ulgurmasangiz: 3-qadamdan keyin (risklar saqlangach) «Davom etish» ochiladi; 4-qadam (`DEMO.md`) — Amaliyot 3 dan oldin, shu ekranga qaytib: teg `DEMO.md` bilan qo'yilsin. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: stsenariy qatorlari bitta ro'yxatda (E 53 — uzun matnga; qadamlar qisqa va tartibi bir qarashda ko'rinishi kerak — 03 OZ-AUDIT 16 naqshi); risklar — juft maydon (risk + B yo'l), bittadan. Besh risk — tayanch 1.6 ro'yxati; o'quvchi «Bu risk demongizda yo'q» bilan chiqaradi (sinf 4).
  «B yo'l» ta'rifi — 0-ekrandagi hodisadan keyin (T-011); «yangi kod — yangi risk» qatori «yangi funksiya to'xtatildi» ga ko'prik (Amaliyot 3). Tayyorlov qatorlari — kurs qatorlari (o'quvchi tahrirlamaydi — Amaliyot 3 1-qadamda belgilaydi; TAYANCHGA SAVOL 4).
- O'qituvchi eslatmasi: eng ko'p xato — B yo'lga «yaxshi ishlaydi» yoki «agentga tuzattiraman» yozish: «Demodan oldin aniq nima qilasiz?» deb so'rang. Login va parol `DEMO.md` ga yozilmasin — repo GitHub'da. 3-darsda lending o'lchanmagan bo'lsa, o'quvchi pitchda «tez ochiladi» demasin.

## 4 · 1-savol ✔ (jonli ball)  ← QTest (✔ D, `correctIdx 3`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Kitob almashish demosida «Olaman» bosildi. Keyingi o'tishdan oldin nima qilasiz?**
  - A — Sahifani yangilayman, holat o'zi qaytadi (40)
  - B — Hech narsa qilmayman, demo yana shunday o'tadi (46)
  - C — Agentga «Olaman» qayta chiqadigan kod yozdiraman (48)
  - ✔ D — Kitobni qaytarib, holatni boshiga keltiraman (44)
- Kalit: **D** (index 3). To'rttalasi bir shaklda — birinchi shaxs fe'li bilan («-aman»), tire va qavs hech birida yo'q; uzunlik — «O'lchov». To'g'ri javob yolg'iz eng uzun emas.
  Distraktorlar uch xil turkum (sinf 8): A — yangilash afsonasi (ma'lumot Backend'da qoladi) · B — e'tiborsizlik (2-ekrandagi ikkinchi o'tish) · C — yangi kod (Amaliyot 1 dagi «yangi kod — yangi risk»).
- To'g'ri izohi: Ma'lumot o'zgardi — keyingi o'tish boshidan boshlanadi. (55)
- Xato izohlari (≤60):
  - A: «Olaman» Backend'ga yozildi. Yangilash uni o'chiradimi? (55)
  - B: Ikkinchi o'tishda «Olaman» tugmasi ekranda bo'ladimi? (53)
  - C: Demodan oldin yangi kod — yangi risk. Tayyor ish bormi? (55)
  - (umumiy) Mentor 2-ekranda ikkinchi o'tishdan oldin nima qildi? (53)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kitob ilovasining telefon maketi — «Olingan» yozuvi → «Qaytarish» bosiladi → «Olaman» qaytadi; ustida accent «boshiga qaytdi».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Fresh Start — birinchi urinishda to'g'ri.
- Izoh (MD): savol 2-ekrandan ko'chirilmaydi (§106): boshqa mahsulot, boshqa tugma; savol «nima qilasiz?» — qoida (boshiga qaytarish) yangi holatda. «Olaman» — ikkinchi misolning o'z tugmasi (o'ylab topilgan, P-002; TAYANCHGA SAVOL 18).
  A hayotda ba'zan rost bo'ladi (ma'lumot faqat sahifada bo'lsa) — lekin savolda «Olaman» Backend'ga yoziladigan ish (izohda aytiladi); S-004.

## 5 · Internet uzildi  ← QTushuncha (bashorat + 3 harakat, ketma-ket)
- Eyebrow: Tushuncha · B reja
- Sarlavha: **Internet uzildi — demoni qanday davom ettirasiz?** (48)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor misolida 2-qadamda zal Wi-Fi'i uzildi — avval taxminingizni belgilang. (77)
  - 1-harakatdan oldin: «Internet qaytishini kutish»ni bosing va taymerga qarang. (57)
  - 1-harakatdan keyin: Endi «Havoladagi video»ni bosing. (33)
  - 2-harakatdan keyin: Oxirgisi — «Laptopdagi video fayl». (35)
  - tugagach: Natijani taxminingiz bilan solishtiring. (40)
- Bashorat (ballsiz, `QBashorat`, «Avval o'zingiz belgilab ko'ring»; S-015 — o'sish tartibida): **Uch yo'ldan nechtasi Yechim bo'lagining 90 soniyasiga sig'adi?** · Bittasi (7) · Ikkitasi (8) · Uchalasi (8) — tanlangach ixcham qator natijagacha turadi.
- Vizual (≤ 3 blok): tepada stsenariy chizig'i — 1, 2-chip ✓, 2-chip ustida qizil «internet yo'q»; ostida taymer chizig'i, yorliq «Yechim bo'lagi: 90 soniya» (bu mashqda — 9.1) · o'ngda laptop: Wi-Fi belgisi kesilgan, «O'yinlar» o'rnida «Sahifa ochilmadi» ·
  sahna ostida uch tugma (chegarali, navbat bilan yoqiladi): «Internet qaytishini kutish» · «Havoladagi video» · «Laptopdagi video fayl». Telefon bu ekranda yo'q (≤ 3 blok).
- **Harakat → Vizual o'zgarish:**
  1. «Internet qaytishini kutish» → taymer chizig'i bir necha soniyada oxirigacha yuradi (yorliq «0 → 90 soniya» — animatsiya), Wi-Fi belgisi kesilgancha qoladi → chiziq qizil, ustida «Yechim bo'lagi vaqti tugadi»; tugma yonida qizil ✕.
  2. «Havoladagi video» → laptopda yangi oyna: manzil satrida «video havolasi», sahifada «Sahifa ochilmadi — internet yo'q» (qizil); tugma yonida ✕.
  3. «Laptopdagi video fayl» → laptopda video oynasi ochiladi, o'ynatish chizig'i «60 soniya»; video ichida stsenariy chiplari 1 → 5 navbat bilan yonadi (videodagi demo); ekran tepasida pufak (Mentor, olam matni — T-008): «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.»;
     taymer chizig'i yashil, 90 soniya ichida; tugma yonida ✓.
- Natija (bitta blok — E 42; `tugadi`): yashil xulosa qutisi — birinchi kichik qator: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bittasi».
- Xulosa: Bu misolda internet uzilganda faqat laptopdagi video fayl ochildi — havolaga ham internet kerak. (96)
- `QIzoh`: Demo ishlamay qolsa, o'rniga ko'rsatiladigan oldindan yozilgan ekran videosi — B reja. (86) (11-Modulda — ekran videosi; T-052 ko'prigi kartochka 6 izohida)
- Tugma (pastki): Avval belgilang → Tugmalarni navbat bilan bosing (N/3) → Davom etish
- Ipucha (40 s): Yoqilgan tugmani bosing — internetsiz nima ochiladi? (52)
- Keyingi bosiladigan joy: bashorat variantlari → joriy sahna tugmasi (halqa) → «Davom etish».
- O'qituvchi eslatmasi: «Kutish» va «havola» — hayotda tez-tez tanlanadigan yo'l; bu misolda internet qaytmadi. Telefon internetini laptopga ulash ham yo'l bo'lishi mumkin, lekin telefon demoning ikkinchi qurilmasi va u ham internetga bog'liq — B reja internetsiz ochilishi kerak.
  Video ommaviy joyga, sinf chatiga yuklanmaydi va repo'ga qo'shilmaydi (Amaliyot 2). Ekran yozish vositasi har kompyuterda boshqacha — umumiy so'z bilan ayting.
✎ Sarlavha 0-ekran va Amaliyot 1 dagi «Internet yo'q» riskining davomi; «B reja» — dars nomidagi so'z, ta'rif shu yerda (QIzoh). Bitta g'oya (P-008): internetsiz faqat laptopdagi fayl ochiladi. Natija sahnada, matn sababni oldindan aytmaydi (P-036).
  Uch yo'l — Mentor misolining sahnasi; «bu misolda internet qaytmadi» (xulosa «Bu misolda» bilan — sinf 4). B reja gapi — 9.9 aynan.

## 6 · Amaliyot 2 — namuna akkaunt, uyg'otish va B reja  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈26 daq)
- Eyebrow: Amaliyot 2 · o'z demongiz
- Sarlavha: **B yo'llarni tayyorlang: akkaunt, uyg'otish va B reja.** (53)
- Mentor: Har ishni o'z demongizda qilib, o'zingiz tekshirasiz; «1 · Namuna akkaunt»dan boshlang. (87)
- Model: to'rt qadam o'quvchining o'z mahsulotida; agent faqat namuna akkaunt (kerak bo'lsa) va `DEMO.md` uchun. O'ngda «kutilgan natija · namuna: Maydon Jamoa». Talab zinapoyasi: 1-qadam — tayyor talab + bitta joy `{demo yozuvi}` · 4-qadam — tayyor talab + `{B reja yozuvi}` oldindan.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Namuna akkaunt** — kulrang ko'prik qatori: 12-Modulda demo uchun ochilgan, sanoqqa kirmaydigan akkaunt — namuna akkaunt. (77)
     Qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: Database — faqat demo uchun namuna akkauntlar va demo ko'rsatiladigan {demo yozuvi}. Kod va fayllarni o'zgartirma.
     > Nima qilsin: demo uchun ikkita namuna akkaunt bormi — tekshir. Yo'q bo'lsa och: namuna ism va login bilan, haqiqiy emas, foydalanuvchilar sanog'iga tushmaydigan. {demo yozuvi} da haqiqiy foydalanuvchilar bormi — ayt. Bo'lsa, birinchi namuna akkauntdan shunday yangi {demo yozuvi} yarat.
     > Ikkala akkauntning loginini menga ayt. Nima buzilmasin: haqiqiy foydalanuvchilarning akkauntlari va yozuvlariga tegma; `.env` ga tegma. Nima o'zgartirganingni ayt.
     Qavs yonida kulrang namuna (Mentor misolidan): {demo yozuvi} — «masalan: o'yin «Shanba, 18:00 · Mahalla maydoni»».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab: «{demo yozuvi}» o'rnida «o'yin «Shanba, 18:00 · Mahalla maydoni»», «foydalanuvchilar sanog'iga tushmaydigan» o'rnida «`namuna = true`».
     Keyin laptopda 1-namuna akkaunt, telefonda 2-namuna akkaunt bilan kiring va demo yozuvini ikkalasida oching.
     Qalin qator: **Login va parol `DEMO.md` ga, repo'ga, chatga va videoga yozilmaydi — ularni o'zingiz bilasiz.**
  2. **Uyg'otish** — laptopda demo yo'lini yangilang: ilova Backend'ga so'rov yuboradi. Birinchi ochilish taxminan bir daqiqa cho'zilishi mumkin; ro'yxat chiqsa — Backend uyg'ondi.
     Kulrang qator: Hakamlar oldida chiqishda buni navbatingizdan bir necha daqiqa oldin qilasiz: 15 daqiqa so'rovsiz qolsa, Backend yana uxlaydi. (126)
     Tanlang: **«Uyg'ondi — ro'yxat chiqdi»** · **«Ochilmadi»**. «Ochilmadi» bosilsa — agentga faqat xato qatori: «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»
     Kutayotganda: video uchun boshqa oyna va bildirishnomalarni yoping (3-qadam).
     Yordam — Mentor misolida: brauzerda `https://maydon-jamoa-….onrender.com/oyinlar` — javobda o'yinlar ro'yxati chiqadi (bu manzil kirmagan odamga ham ochiq — 12-Modulda).
  3. **Video** — kompyuteringizdagi ekran yozish vositasi bilan demo stsenariysini bir marta o'ting va yozing: tayyorlovdan «Hozir ko'ryapti»gacha, bu mashqda — 60 soniyaga yaqin.
     Yozishdan oldin: parol kiritiladigan joy, `.env`, terminal, chat va boshqa oynalar ekranda ko'rinmasin. Ovoz shart emas. Videoni repo papkasiga emas, laptopdagi boshqa papkaga saqlang — `git add` bilan GitHub'ga tushib qolmasin. Keyin demo holatini boshiga qaytaring («Keyin» qatoringiz).
     Yordam — Mentor misolida: laptopda ikki oyna yonma-yon — chapda demo yo'li (1-namuna akkaunt), o'ngda yashirin oynada o'sha o'yin (2-namuna akkaunt): 4-qadam videoda ham ko'rinadi.
  4. **Tekshirish va `DEMO.md`** — video faylni laptopda ochib, oxirigacha ko'ring va uch qatorni belgilang: (1) beshala qadam ko'rinadi · (2) parol, `.env` va haqiqiy foydalanuvchi ismi ko'rinmaydi · (3) fayl laptopda, havola emas.
     Belgilang: **«Video tayyor»** (uchala qator belgilangan) · **«Video hali yo'q»**. B reja gapingiz — oldindan yozilgan, tahrirlanadi: «Internet uzildi — shu demoning {N} soniyalik videosini ko'rsataman.»
     Keyin «Nusxalash» bilan Antigravity'ga:
     > `DEMO.md` ga «## B reja» bo'limini qo'sh: pastdagi yozuvimni so'zma-so'z ko'chir. Login, parol, video fayl nomi va manzili yozilmaydi. Faylning qolgan qismiga va boshqa fayllarga tegma.
     > {B reja yozuvi}
     Qavs: {B reja yozuvi} — «Video: laptopda, {N} soniya, repo'da emas» · «Gap: {B reja gapi}» · «Uyg'otish: navbatdan bir necha daqiqa oldin, demo yo'lini ochib» · «Namuna akkaunt: laptop va telefonda oldindan kirilgan» (video yo'q bo'lsa — «Video: hali yo'q»).
     `git status` — video ro'yxatda yo'q, faqat `DEMO.md` → `git add DEMO.md` → `git commit -m "demo: B reja"` → `git push`.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam bitta qatorga yig'iladi (✓) · 2-qadam tanlovi → o'ngdagi Backend chirog'i kulrang → yashil (yoki kulrang qoladi) · 4-qadam «Video tayyor» → o'ngda video oynasi bir marta o'ynaydi, `DEMO.md` kartasiga «## B reja» qatorlari tushadi · oxirida yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok): laptop — video oynasi «60 soniya», tepada pufak — B reja gapi (A-6) · `DEMO.md` kartasi «## B reja»: «Video: laptopda, 60 soniya, repo'da emas» · «Gap: Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» ·
  «Uyg'otish: navbatdan bir necha daqiqa oldin, demo yo'lini ochib» · «Namuna akkaunt: laptop va telefonda oldindan kirilgan» · Backend chirog'i yashil. Mentor videosining haqiqiy uzunligi — ⛔ pilotda (`{⛔}`). Web-trekda: o'sha karta, `….netlify.app`.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - «Uyg'ondi» va «Video tayyor»: Akkaunt, uyg'otish va B reja tayyor — hammasi `DEMO.md` da. (57)
  - «Video hali yo'q»: Akkaunt va uyg'otish tayyor — B reja videosi hali yo'q. (55)
  - «Ochilmadi»: Backend ochilmadi — xato qatori agentda, B yo'llar hali tugamagan. (66)
- Saqlanadi: `pm-m12d6-demo.uygotish` (2-qadam) · `.video` (4-qadam) · `savedAt` (A-12).
- Ulgurmasangiz: 2-qadamdan keyin «Davom etish» ochiladi; video — Amaliyot 3 dan keyin, shu ekranga qaytib. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon: Plan B Ready — 4-qadam «Bajardim»ida, «Video tayyor» belgilangan bo'lsa (ish bajarilgan ekran — P-048).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: sarlavhada «B yo'llar» — uch ish (akkaunt — «Login esdan chiqdi» va «Ro'yxat bo'sh», uyg'otish — «Backend uxlagan», video — «Internet yo'q»); «B reja» faqat video (T-015). Namuna akkaunt — o'chirilmaydi (demo kunigacha kerak; 7-darsdagi tekshiruv akkauntidan farqi — TAYANCHGA SAVOL 6).
  Demo yozuvida real odamlar bo'lmasligi — 12-Modul 9.44 c (real odamlarga jonli xabar bormasin). Ekran yozish vositasi — umumiy so'z (tayanch 1.9; ⛔). Video tekshiruvi o'quvchining o'zida (sinf 10).
- O'qituvchi eslatmasi: video yozishdan oldin ekranga birga qarang — ochiq chat, parol saqlagich oynasi, terminal ko'rinmasin. Video sinf chatiga yuborilmaydi. Namuna akkaunt paroli `DEMO.md` ga yozilmaganini tekshiring.
  Telefon brauzerida real vaqt ishlashini kuzating: telefon kirgan bo'lishi kerak (kirmagan odamning ekrani o'zi yangilanmaydi — 12-Modul).

## 7 · 2-savol ✔ (jonli ball)  ← QTest (✔ B, `correctIdx 1`)
- Eyebrow: Mashq · 2-savol (savol ustida yorliq yo'q)
- Savol: **Hakamlar oldida chiqishdan oldin Backend'ni qachon uyg'otasiz?**
  - A — Ertalab, darsga kelishdan oldin, uyda (37)
  - ✔ B — Navbatimdan bir necha daqiqa oldin (34)
  - C — Demo boshlangach, «O'yinlar»ni bosganda (39)
  - D — Kerak emas: agent «ishlaydi» degan edi (38)
- Kalit: **B** (index 1). Uchtasi vaqt bilan, D — sabab bilan javob beradi; ikki nuqta — faqat D da (to'g'rida yo'q); uzunlik — «O'lchov».
  Distraktorlar uch xil turkum (sinf 8): A — erta (15 daqiqadan ko'p o'tadi) · C — kech (birinchi bosish uyg'otadi, lekin zal taxminan bir daqiqa kutadi — reja sifatida noto'g'ri, yolg'on fakt emas — S-004) · D — agent da'vosi.
- To'g'ri izohi: Demo 15 daqiqa ichida boshlanadi — Backend hali uyg'oq. (55)
- Xato izohlari (≤60):
  - A: Uyg'otgandan keyin 15 daqiqa so'rovsiz o'tsa-chi? (49)
  - C: Birinchi bosishdan keyin zal qancha kutadi? (43)
  - D: Agentning gapi — da'vo. Backend 15 daqiqada nima qiladi? (56)
  - (umumiy) Bepul Backend necha daqiqa so'rovsiz qolsa uxlaydi? (51)
- Javob topilgach (kichik): Backend chirog'i yashil «ishlayapti», ostida qisqa chiziq «uyg'otish → navbat → demo» — 15 daqiqa ichida (chiziqli chizma, matn emas).
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Wake Up — birinchi urinishda to'g'ri.
- Izoh (MD): savol Amaliyot 2 dan ko'chirilmaydi (§106): u yerda uyg'otish qilindi, bu yerda — qachon qilinishi; hook (0-ekran) — nima bo'lishi. «Bir necha daqiqa» — son emas, 15 daqiqadan kam (Render qoidasi). P-012: 4 va 7-ekranlar ketma-ket emas.

## 8 · Amaliyot 3 — teg va demo o'tishi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈16 daq)
- Eyebrow: Amaliyot 3 · o'z repo'ngiz
- Sarlavha: **Teg qo'ying va demoni boshidan oxirigacha o'ting.** (49)
- Mentor: Tegdan keyin faqat tuzatish qilasiz, demoni esa taymer bilan o'tasiz; «1 · Tayyorlov»dan boshlang. (98)
- Model: to'rt qadam o'quvchining o'z repo'sida va demosida; agent faqat yangi risk qatori uchun (4-qadam). Sherik — hakam o'rnida, ixtiyoriy.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Tayyorlov** — terminalda `git status`: o'zgargan fayl yo'q (hammasi push qilingan). Mobil trekda — brauzer ko'rinishini yangilang (push'dan keyin o'zi yangilanmaydi): `npx expo export -p web` → `netlify deploy --prod --dir dist`. Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Keyin `DEMO.md` dagi «Tayyorlov» qatorlarini bittadan belgilang (✓): Backend uyg'otildi · ikkala qurilmada namuna akkaunt bilan kirilgan · demo holati boshida · B reja videosi laptopda ochishga tayyor (`video` `true` bo'lmasa — qator kulrang «video hali yo'q»).
     Kutayotganda (eksport, Netlify) — tayyorlov qatorlarini belgilang.
  2. **Teg** — terminalda, navbat bilan («Nusxalash» bilan):
     `git tag m14-demo` → `git push origin m14-demo` (javobda `* [new tag] m14-demo -> m14-demo`) → `git ls-remote --tags origin` — ro'yxatda `refs/tags/m14-demo` qatori bo'lsin.
     Kulrang qatorlar: Oddiy `git push` tegni olib ketmaydi — teg alohida yuboriladi. (60) · «tag 'm14-demo' already exists» chiqsa — teg qo'yilgan: faqat push va tekshiruv. (80)
     Keyin ikki qator (yashil quti ichida, «Bajardim» dan keyin — atama shu yerda tug'iladi, T-011): Shu tegdan keyin demo kunigacha mahsulotga yangi narsa qo'shilmaydi — faqat tuzatish. (85) · Bu holat «yangi funksiya to'xtatildi» deyiladi. (47)
     Ko'prik (kulrang): «Ortda qoldingizmi»dagi `m14-dars-…-done` — Mentor repo'sidagi teg; bugun o'z repo'ngizga tegni o'zingiz qo'ydingiz. (114) <!-- TAXMIN T4 -->
     Belgilang: **«Teg GitHub'da»** · **«Teg chiqmadi»** («chiqmadi» — xato qatorini agentga: «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»).
  3. **Demo o'tishi** — «Taymer»ni bosing va `DEMO.md` dagi stsenariy bo'yicha demo qiling; har qadamdan keyin chapdagi qadamni bosing: **✓** (rejadagidek) yoki **✕** (bosilsa — «Nima bo'ldi» bir qator). Oxirida «Taymerni to'xtatish».
     Taymer chizig'ida ikki belgi: «Mentor rejasi: 60–90 soniya» · «Yechim bo'lagi: 90 soniya» (bu mashqda). Sherik bo'lsa — laptop ekraniga qarab, hakam o'rnida o'tiradi; ismi hech qayerga yozilmaydi.
     Shart xabari (≤60): «✕» bosilib, «Nima bo'ldi» bo'sh bo'lsa — Qaysi qadamda nima bo'lganini bir qatorda yozing. (49)
  4. **Natija va boshiga qaytarish** — vaqtingiz kartada (soniya). 90 soniyadan oshsa — kulrang qator: Qaysi qadam cho'zildi? Stsenariyni qisqartirish mumkinmi? (57)
     ✕ qadam bo'lsa — «Nusxalash» bilan Antigravity'ga:
     > `DEMO.md` dagi «## Risklar» bo'limiga bitta qator qo'sh: «{qadam}: {nima bo'ldi} — {B yo'l}». Boshqa joyga va boshqa fayllarga tegma.
     Qavslar: {qadam}, {nima bo'ldi} — 3-qadamdan oldindan · {B yo'l} — bo'sh, kulrang «masalan: tayyorlovda shu ekranni oldindan ochaman».
     → `git add DEMO.md` → `git commit -m "demo: yangi risk"` → `git push`. Tuzatish kerak bo'lsa — faqat tuzatish, yangi funksiya to'xtatilgan: agentga «{qadam} demoda {nima bo'ldi}. Faqat shuni tuzat, yangi narsa qo'shma, o'zgargan fayllarni ayt.»
     Oxirida «Keyin» qatoringiz bo'yicha demo holatini boshiga qaytaring.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam yig'iladi (✓) · 2-qadam «Teg GitHub'da» → o'ngdagi terminal kartasida ikki javob qatori yashil yonadi, `DEMO.md` kartasi yonida teg belgisi `m14-demo` · 3-qadam — har ✓ stsenariy chipini yashil, ✕ — qizil qiladi, taymer chizig'i yuradi ·
  4-qadam — vaqt kartasi; ✕ qatori `DEMO.md` «## Risklar» oxiriga uchadi; «boshiga qaytdi» kulrang yorlig'i · oxirida yashil yakun qatori.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok): terminal kartasi (mono): `$ git push origin m14-demo` → `* [new tag] m14-demo -> m14-demo` · `$ git ls-remote --tags origin` → `… refs/tags/m14-demo` ·
  stsenariy chizig'i (besh chip) va taymer «Mentor rejasi: 60–90 soniya», Mentor o'tishi vaqti — `{⛔ pilotda}` · laptop va telefon: «9 / 10» → «Keyin» → «8 / 10».
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - teg bor, beshala ✓: Teg qo'yildi, demoning beshala qadami rejadagidek o'tdi. (56)
  - ✕ bor: Teg qo'yildi, demo o'tdi — rejadagidek bo'lmagan qadam `DEMO.md` da. (66)
  - «Teg chiqmadi»: Demo o'tdi — teg hali GitHub'da yo'q, xato qatori agentda. (58)
- Saqlanadi: `pm-m12d6-demo.teg` (2-qadam) · `.otishVaqt` (3-qadam) · `.risklar` (4-qadamdagi yangi qator) · `savedAt` (A-12).
- Ulgurmasangiz: 2-qadamdan keyin (teg qo'yilgach) «Davom etish» ochiladi; demo o'tishi — dars oxirida, shu ekranga qaytib (yakun sarlavhasi aytadi). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Demo Freeze — 4-qadam «Bajardim»ida, «Teg GitHub'da» va taymer to'xtatilgan bo'lsa (natijadan qat'i nazar — tavsif qilingan ishni aytadi; 152).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: teg — o'quvchining o'z repo'sida (tayanch 1.6); buyruqlar va javob qatorlari git 2.53 da sinab ko'rilgan (scratchpad `md06/gitsinov`; «Manbalar» 3). Tartib: teg → o'tish — teg «to'xtatish» boshlanishi; o'tishda topilgan muammo — tuzatish (TAYANCHGA SAVOL 10).
  «Rejadagidek» — 7-darsdagi «xatosiz» ta'rifi bilan bir (9.10: beshala qadam rejadagidek; vaqt belgi emas). Vaqt saqlanadi (`otishVaqt`), lekin baho emas. «Demo buzilmaydi» deyilmaydi (sinf 5).
- O'qituvchi eslatmasi: kim kimdan tez o'tgani sanalmaydi. Mobil trekda eksport unutilsa, demo eski versiyada ko'rsatiladi — 1-qadamni o'tkazib yubormang. Teg qo'yilgandan keyin agentga «yana bir narsa qo'shay» desa — «Yo'q, faqat tuzatish».

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (4, 7); 2, 5-ekranlar — ballsiz; 3, 6, 8-ekranlar «Bajardim» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 4 — «1 — Keyingi o'tishdan oldin» · 7 — «2 — Uyg'otish qachon»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan, 3 marta yengil tebranadi, kattalashishsiz (E 49); ostida: Kartani bosing — javob ochiladi.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (172; SABOQ E 50 standarti)
- Yorliqlar (tepada): ✓ `DEMO.md` tayyor (faqat Amaliyot 1 4-qadami bajarilgan bo'lsa; aks holda yorliq yo'q) · {N}/2 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; ustunlik tartibi — yuqoridan; har biri o'quvchi qilgan ishni aytadi):
  - Amaliyot 1, 2, 3 bajarilgan; `video: true`, `teg: true`, o'tishda beshala qadam ✓: **Demo bir marta to'liq o'tdi — B reja va teg tayyor.** (51)
  - `otishVaqt` bor, lekin video, teg, ✕ qadam yoki bajarilmagan blok qolgan: **Demo bir marta o'tdi — hali tugamagan ish bor.** (46)
  - Amaliyot 1 bajarilgan, demo o'tishi yo'q: **Stsenariy va risklar yozildi — demo o'tishi qoldi.** (50)
  - stsenariy saqlangan, Amaliyot 1 bajarilmagan: **Demoga tayyorgarlik hali tugamagan.** (35)
  - stsenariy saqlanmagan: **Demo stsenariysi bugun hali yozilmagan.** (39)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 1-qator — ta'rif, T-042):
  - Demoda bosiladigan qadamlar ro'yxati — demo stsenariysi. (56)
  - Demo ma'lumotni o'zgartirsa, keyingi o'tishdan oldin holat boshiga qaytariladi. (79)
  - Har riskka B yo'l oldindan tayyorlanadi — demo kuni yangi kod yozilmaydi. (73)
  - B reja videosi laptopda faylda turadi: internet uzilsa ham ochiladi. (68)
  - Teg qo'yilgach yangi funksiya to'xtatiladi — faqat tuzatish qilinadi. (69)
- Uyga vazifa — yo'q (tayanch 4, sinf 14: loyiha kuni; ish repo'da — uch blok o'z mahsulotingizda).
- Keyingi dars — «Investor ko'zi bilan: demo buzilmaydimi?» <!-- TAXMIN T20 -->
- Nishonlaringiz — N/4 (pastda; mentor rejimida yo'q)
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): sarlavha kalitdan (`pm-m12d6-demo`: `stsenariy`, `video`, `teg`, `otishVaqt`) va blok bayroqlaridan (ccProgress: 4-qadam «Bajardim»; o'tishdagi ✓/✕ — dars holati) yig'iladi (P-046). «Keyingi dars» qatori — `00-NOMLAR.md` 7-qator, so'zma-so'z, quyruqsiz (T-038; tayanch 7 «RAD etilganlar»).
  Birinchi holat «to'liq o'tdi» — beshala qadam ✓ bo'lsa; «demo buzilmaydi» ma'nosida emas (sinf 5).

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami; §184: qilingan ishni aytadi)
- **Fresh Start** (4-ekran, 1-savol birinchi urinishda) — Keyingi o'tishdan oldin holatni qaytarishni tanladingiz (55)
- **Wake Up** (7-ekran, 2-savol birinchi urinishda) — Backend'ni qachon uyg'otishni topdingiz (39)
- **Plan B Ready** (6-ekran, Amaliyot 2 4-qadam «Bajardim», «Video tayyor») — B reja videosini yozib, oxirigacha tekshirdingiz (48)
- **Demo Freeze** (8-ekran, Amaliyot 3 4-qadam «Bajardim»; teg va taymer — bonus) — Teg qo'yib, demoni taymer bilan bir marta o'tdingiz (51)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Demo Freeze, ish qilingan ekranda — P-048; ✕ qadam bo'lsa ham beriladi — tavsif «rejadagidek» demaydi). Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10 — 0).

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: kodsiz kartada raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **4 · Keyingi o'tishdan oldin** — 1 Demo ma'lumotni o'zgartiradi: Mentor qo'shildi, son «9 / 10». · 2 Ikkinchi o'tishda «Qo'shilaman» yo'q — 3-qadam to'xtaydi. · 3 Shuning uchun har o'tishdan keyin holat boshiga qaytariladi.
  — Sinfga savol: Demongizda qaysi qadam ma'lumotni o'zgartiradi?
- **7 · Uyg'otish qachon** — 1 Render'ning bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi. · 2 Birinchi so'rov uni taxminan bir daqiqada uyg'otadi. · 3 Shuning uchun navbatdan bir necha daqiqa oldin demo yo'li ochiladi.
  — Sinfga savol: Navbatingiz uzoq bo'lsa, uyg'otishni qachon qilasiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Demo stsenariysi nima? | Demoda bosiladigan qadamlar ro'yxati | Mentor misolida — besh qadam, 60–90 soniya |
| Demo o'tishi nima? | Demoni boshidan oxirigacha bir marta ko'rsatish | Taymer bilan o'tiladi |
| Nega har o'tishdan keyin holat boshiga qaytariladi? | Demo ma'lumotni o'zgartiradi — keyingi o'tish boshidan boshlanishi kerak | Mentor misolida — o'yindan chiqish, yana «8 / 10» |
| Bu darsda risk nima? | Demoga xalaqit berishi mumkin bo'lgan narsa | 11-Modulda — rejaga xalaqit beradigan narsa edi |
| B yo'l nima? | Risk bo'lsa ham demo davom etishi uchun oldindan qilinadigan ish | Yangi kod emas |
| B reja nima? | Demo ishlamay qolsa ko'rsatiladigan oldindan yozilgan ekran videosi | 11-Modulda — ekran videosi; Mentor misolida 60 soniya |
| B reja videosi qayerda turadi? | Demo ochiladigan laptopda, faylda | Havola internetsiz ochilmaydi; repo'ga qo'shilmaydi |
| Bepul Backend qachon uxlab qoladi? | 15 daqiqa so'rovsiz qolganda | Render; uyg'onishi taxminan bir daqiqa |
| Backend'ni qanday uyg'otasiz? | Navbatdan bir necha daqiqa oldin demo yo'lini ochib | Ro'yxat chiqsa — uyg'ondi |
| Demoni qaysi akkaunt bilan ko'rsatasiz? | Namuna akkaunt bilan — ikkala qurilmada oldindan kirilgan | Sanoqqa kirmaydi; parol `DEMO.md` ga yozilmaydi |
| «Yangi funksiya to'xtatildi» nimani bildiradi? | Tegdan keyin faqat tuzatish, yangi narsa qo'shilmaydi | Inglizchasi: feature freeze; teg `m14-demo` |
| Tegni GitHub'ga qanday chiqarasiz? | `git push origin m14-demo` buyrug'i bilan | Oddiy `git push` tegni olib ketmaydi |
- §145: har javobdagi so'z darsda bor (demo stsenariysi, demo o'tishi, boshiga qaytarish — 2 · risk, B yo'l — Amaliyot 1 · B reja, laptopdagi fayl — 5 · uyg'otish, namuna akkaunt — Amaliyot 2, 0 · teg, yangi funksiya to'xtatildi, `git push origin` — Amaliyot 3).
- S-027: har old tomon — to'liq savol, «?» bilan. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). «inglizchasi: feature freeze» — darsda bir marta, faqat shu kartada (tayanch 2).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md06/olchov.py` (pastda «O'lchov»).
1. Demoda nimani oldindan yozib qo'yasiz? (2, 3)
   - ✔ A — Bosiladigan qadamlar ro'yxatini (31)
   - B — Hakamlar beradigan savollarni (29)
   - C — Ilovadagi hamma funksiyalarni (29)
   - D — Sinfdoshlar fikrlari ro'yxatini (31)
2. Demoning besh qadami bir marta ko'rsatildi. Bu nima? (2)
   - A — Demo stsenariysining yangi ko'rinishi (37)
   - ✔ B — Boshidan oxirigacha bitta demo o'tishi (38)
   - C — Demoga yangi qadam qo'shilgan holati (36)
   - D — Hakamlarning demo haqida qo'ygan bahosi (39)
3. Mentor «O'yindan chiqish»ni qachon bosadi? (2)
   - A — Demoning eng birinchi qadamida (30)
   - B — Hakamlar savol bera boshlaganda (31)
   - ✔ C — Har demo o'tishi tugagandan keyin (33)
   - D — Faqat internet uzilib qolgan paytda (35)
4. «Backend uxlagan» riskiga qaysi biri B yo'l? (3)
   - A — Agentga uxlamaydigan kod yozdirib qo'yish (41)
   - B — Hakamdan bir daqiqa kutib turishni so'rash (42)
   - C — Demoni tashlab, Raqamlar bo'lagini aytish (41)
   - ✔ D — Navbatdan oldin demo yo'lini ochish (35)
5. B reja videosini nega havolada emas, faylda saqlaysiz? (5)
   - ✔ A — Internet uzilsa ham u ochiladi (30)
   - B — Faylni hakamlar o'zlari yuklab oladi (36)
   - C — Havolani agent o'chirib yuborishi mumkin (40)
   - D — Fayl repo'ga o'zi qo'shilib boradi (34)
6. Demoni qaysi akkaunt bilan ko'rsatasiz? (6)
   - A — Eng faol o'yinchining akkaunti bilan (36)
   - ✔ B — Sanoqqa kirmaydigan namuna akkaunt bilan (40)
   - C — Sinfdoshingizning shaxsiy akkaunti bilan (40)
   - D — Demo kuni ochilgan yangi akkaunt bilan (38)
7. B reja videosini yozishdan oldin ekrandan nimani yopasiz? (6)
   - A — Demo yo'lidagi «O'yinlar» ro'yxatini (36)
   - B — Taymer va stsenariy qadamlarini (31)
   - ✔ C — Parol, `.env` va chat oynalarini (30)
   - D — Mahsulot nomi yozilgan sarlavhani (33)
8. Bepul Backend qachon uxlab qoladi? (0, 6)
   - A — Demo stsenariysi tugashi bilan (30)
   - B — Teg GitHub'ga chiqqanidan keyin (31)
   - C — Laptop proyektorga ulanganda (28)
   - ✔ D — 15 daqiqa so'rovsiz qolganda (28)
9. `m14-demo` tegidan keyin mahsulotda nima qilinadi? (8)
   - ✔ A — Faqat tuzatish, yangi funksiya yo'q (35)
   - B — Faqat yangi funksiyalar qo'shiladi (34)
   - C — Repo o'chirilib, qaytadan ochiladi (34)
   - D — Demo videosi repo'ga yuklab qo'yiladi (37)
10. Tegni GitHub'ga qaysi buyruq chiqaradi? (8)
    - A — Oddiy `git push`, teg o'zi ketadi (31)
    - ✔ B — `git push origin m14-demo` buyrug'i (33)
    - C — Faqat `git tag m14-demo` o'zi yetadi (34)
    - D — `git add m14-demo`, keyin commit (30)
11. Ikkinchi qurilma — telefon. Demo unda qayerda ochiladi? (3)
    - A — Telefonga o'rnatilgan APK ilovada (33)
    - B — Hakamning telefonida, havola bilan (34)
    - ✔ C — Telefon brauzerida, o'sha manzilda (34)
    - D — Sinfdosh telefonida, uning akkauntida (37)
12. Demo o'tishida bir qadam rejadagidek bo'lmadi. Nima qilasiz? (8)
    - A — Yashiraman, hakam baribir bilmaydi (34)
    - B — O'rniga yangi funksiya qo'shaman (32)
    - C — Hech narsa, keyingi safar o'tadi (32)
    - ✔ D — Uni `DEMO.md` risklariga yozaman (30)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006; «O'lchov»); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 4-ekran (kitob ilovasi — boshiga qaytarish) ↔ arena 3 (Mentor qachon chiqadi) · 7-ekran (uyg'otish qachon) ↔ arena 4 (B yo'l tanlovi) va arena 8 (qachon uxlaydi).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004), har savolda uch xil turkum: 1 — hakam gapi, funksiyalar ro'yxati, boshqa odam fikri · 2 — stsenariy o'zgarishi, yangi qadam, baho · 3 — vaqt (boshida), boshqa voqea, faqat bitta risk ·
  4 — yangi kod, tayyorlanmagan iltimos, demoni tashlab ketish · 5 — hakamga yuborish, agentga ayb, repo'ga yuklash · 6 — haqiqiy foydalanuvchi, boshqa odamning akkaunti, kech ochilgan akkaunt (login riski) · 7 — demo qismi, dars asbobi, mahsulot nomi ·
  8 — stsenariy, teg, proyektor · 9 — teskari qoida, repo'ni o'chirish, videoni repo'ga · 10 — teg o'zi ketmaydi, faqat mahalliy teg, noto'g'ri buyruq · 11 — APK (o'zi yangilanmaydi — Amaliyot 1), hakam telefoni, boshqa odam akkaunti · 12 — yashirish, yangi funksiya, e'tiborsizlik.
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — demo · stsenariy · o'tish · risk · B reja · teg · taymer · Maydon Jamoa. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. **Skelet:** yangi fayl `src/12-Modull/DemoPrepLesson.jsx`; palitra `qolipRang('tex')`, `qolipCss(T)`; `LESSON_META.lessonId` — `m12-06-v1` (03 pilot naqshi `m12-03-v1`), `lessonTitle` — «Demoga tayyorgarlik: risklar va B reja».
   `SCREEN_META` 12: hook · plan · concept · practice(blok) · test · concept · practice(blok) · test · practice(blok) · stats · flashcards (`sflash`) · summary. `INLINE_KEYS`: s4 **3 (D)** · s7 **1 (B)**; uch blok — `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 4, 7, 9-ekranlar. Final tartib-mashqi yo'q (172).
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s4/s7 `QTest` (`QuestionScreen` mantig'i, DE-203) · s3/s6/s8 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
2. **Bitta manbalar (A-6 aynan, 180):** `MENTOR_STSENARIY` (5 qator) · `STSENARIY_CHIP` (5 yorliq — 07 pilot bilan bir) · `MENTOR_TAYYORLOV` · `TAYYORLOV_KURS` (o'quvchi uchun to'rt qator) · `MENTOR_KEYIN` · `RISKLAR` (5 × `{ id: 'internet' | 'backend' | 'login' | 'royxat' | 'ikki', nom, hodisa, mentorBYol }`) ·
   `B_REJA_GAPI` · `B_REJA_YOLLAR` (5-ekran: 3 × `{ nom, natija: 'vaqt' | 'ochilmadi' | 'video' }`) · `DEMO_MD` (fayl kartasi shabloni: bo'limlar va qatorlar). s0–s8, Yordamlar, kutilgan natija, kartochka va arena shulardan o'qiydi.
3. **`DemoSahna`** — bitta vizual (qolipda yo'q; 07 pilotdagi `DemoSahna` bilan bir xil qismlar — darslar mustaqil: nusxa, import emas; «qur» da bitta umumiy komponent qilish — asosiy seans qarori, `src/qolip` ga tegilmaydi):
   qismlar `laptop` (brauzer: manzil satri, «O'yinlar» / «O'yin» / «Yuklanmoqda…» / «Sahifa ochilmadi» / video oynasi; Wi-Fi belgisi; Backend chirog'i `uxlayapti` · `uygonmoqda` · `ishlayapti`) · `telefon` (o'sha o'yin, son, «Hozir ko'ryapti») · `stsenariy` (5 chip + taymer chizig'i, 12-Modul `TaymerChiziq` naqshi, ikki belgi) · `demoMd` (fayl kartasi).
   Rejimlar: `kirish` (s0) · `tayyor` (s1) · `ikkiOtish` (s2: `korsatish` · `yana` · `qaytarish`) · `internetYoq` (s5: `kutish` · `havola` · `fayl`) · `natija` (s3/s6/s8 o'ng). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ds-oyinlar ds-korsat ds-yana ds-qaytar ds-kutish ds-havola ds-fayl ds-qadam`).
   `reduced-motion` — o'tishsiz. 393 da telefon brauzer ustida, kesilmaydi (E 41). Rangli yon chiziq yo'q. «Maydon Jamoa» — o'z yashil rangida, logotipsiz (D4).
4. **s0** — variantlar (radio) → javob qatori → «O'yinlar» faollashadi (halqa) → `kirish` animatsiyasi (≈6 s: «Yuklanmoqda…», chiroq `uxlayapti` → `uygonmoqda` → `ishlayapti`, ro'yxat); ballsiz (`correct: false`, J-026); sinf ovozlari chizig'i — faqat variantlar soni.
5. **s2** — `QBashorat` (3) → uch sahna tugmasi qulf bilan navbat (`korsatish` → `yana` → `qaytarish`); `yana` da 3-chip `err`, 4–5 kulrang, laptopda «O'yindan chiqish»; `qaytarish` dan keyin ikki kulrang qator (tayyorlov va «Keyin»); taxmin qatori + xulosa + `QIzoh` (ikki atama); 40 s ipucha.
6. **s5** — `QBashorat` (3) → uch sahna tugmasi navbat bilan; `kutish` — taymer 0 → 90 (≈3 s), `err`; `havola` — «Sahifa ochilmadi — internet yo'q»; `fayl` — video oynasi (≈6 s, ichida qadam belgilari 1 → 5), pufak `B_REJA_GAPI`; taxmin qatori («Bittasi») + xulosa + `QIzoh`.
7. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (`{…}` joylari). Har blok **4 qadam**; «Davom etish»: s3 — 3-qadamdan, s6 — 2-qadamdan, s8 — 2-qadamdan keyin (A-11, E 55); blok bayrog'i — faqat 4-qadam «Bajardim»idan.
   - **s3:** trek chiplari (kalit yo'q bo'lsa) · 2-qadam — `StsenariyForma` (5 + «Keyin» qatori, yorliq input ichida — E 43; `pm-m12d3-tezlik` kulrang qatori — `keyin.baho` bor/yo'q) · 3-qadam — `RiskKarta` (5, bittadan; «Bu risk demongizda yo'q»; QXato uch turi) ·
     4-qadam prompti `{demo yozuvi}` ← dars holati (`TAYYORLOV_KURS` + 5 qadam + «Keyin» + risklar, «risk — B yo'l»). Tekshiruvlar **PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi** (masalan: «Navbatdan oldin uyg'otaman» o'tadi · «agentga yangi tugma qo'shtiraman» yumshoq · «umid qilaman» yumshoq · bo'sh bloklaydi · 61 belgili qadam yumshoq).
     «Ortda qoldingizmi» — faqat shu blokda (tayanch 3).
   - **s6:** 1-qadam prompti (`{demo yozuvi}`, kulrang namuna; Yordam — Mentor talabi) · 2-qadam — ikki tugma → `uygotish` · 3-qadam — matn va Yordam (kod yo'q) · 4-qadam — uch belgi (checkbox), «Video tayyor» faqat uchalasi belgilanganda faol, «Video hali yo'q» doim faol → `video`; B reja gapi maydoni (oldindan `B_REJA_GAPI` shakli, `{N}` — o'quvchi) ; `{B reja yozuvi}` ← dars holati.
   - **s8:** 1-qadam — trek qatorlari (`mobil` — eksport buyruqlari, `web` — Netlify), `TAYYORLOV_KURS` belgilari (dars holati; `video !== true` — 4-qator kulrang) · 2-qadam — uch buyruq «Nusxalash» bilan, ikki tugma → `teg`, yashil qutida ikki qator (atama) ·
     3-qadam — `Taymer` (12-Modul `TaymerChiziq` naqshi; ikki belgi 60–90 va 90) + stsenariy ro'yxati (`pm-m12d6-demo.stsenariy`), har qadamda ✓ / ✕ (+ «Nima bo'ldi»); «Taymerni to'xtatish» → `otishVaqt` (butun soniya) · 4-qadam — vaqt kartasi, >90 kulrang qator; ✕ bo'lsa prompt (`{qadam}`, `{nima bo'ldi}` oldindan, `{B yo'l}` bo'sh) va `risklar` ga yangi yozuv.
   - ⚠️ Qolipda yo'q (12–13-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam», `StsenariyForma`, `RiskKarta`, `Taymer`, «Ulgurmasangiz» qatori, «O'qituvchi eslatmasi» (o'quvchi yuzasida yo'q) — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
8. **Saqlash:** `pm-m12d6-demo` (A-12 shartnomasi aynan) — `stsenariy` (s3 2-qadam), `risklar` (s3 3-qadam; s8 4-qadam qo'shadi), `uygotish`, `video` (s6), `teg`, `otishVaqt` (s8), `savedAt`. Kalit oldin bor bo'lsa — formalar to'ldirilgan holda ochiladi; ✎ — qayta ochish. Login, parol, URL yozilmaydi.
   O'qiladi: `pm-m9d8-platforma.trek` · `pm-m12d3-tezlik` (`trek`, `oldin.baho`, `keyin.baho`).
9. `RECAPS` 2 (kalit = 4, 7; `ic` → 1/2/3 + `ask`) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 4 → `freshStart` · 7 → `wakeUp` · s6 4-qadam «Bajardim» + `video === true` → `planBReady` · s8 4-qadam «Bajardim» + `teg === true` + `otishVaqt !== null` → `demoFreeze`) ·
   `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys` · `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008) · `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda · `SCREEN_INTENTS`.
10. **s11 `QYakun`:** sarlavha **besh holat** (11-ekran, ustunlik tartibi) — `pm-m12d6-demo` va blok bayroqlaridan, o'tishdagi ✓/✕ — dars holatidan (P-046, E 54); ✓ yorlig'i — s3 4-qadam bayrog'idan; `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; `uyga` yo'q; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50); `keyingi` — «Investor ko'zi bilan: demo buzilmaydimi?». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
11. **Mentor rejimi:** o'quvchilar ro'yxatida faqat signallar (uch blok «Bajardim»; `PRACTICE_BASE`); o'quvchi stsenariysi, B yo'llari va B reja gapi Mentorga ham, proyektorga ham chiqmaydi (o'z mahsuloti; login tasodifan yozilsa ham ko'rinmasin). Kim nechta soniyada o'tgani sanalmaydi.
12. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). Javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
13. **Darvozalar:** `npm run gates -- src/12-Modull/DemoPrepLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) · `lint:til` 0 · `stilsiz.py` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
    ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md). `{…}` qavslar — matn (prompt qavsi), JSX ifodasi emas. Terminal buyruqlari kartada — oddiy matn.
14. App.jsx `m12-06` qatoriga `comp: DemoPrepLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 472-qator). Bu agent App.jsx ga tegmaydi.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m14-dars-06-start` = `m14-dars-05-done` (= `04-done`) → `m14-dars-06-done`, tayanch 3) <!-- TAXMIN T4 -->
1. **`DEMO.md`** (repo ildizi): «## Stsenariy» — `MENTOR_TAYYORLOV`, `MENTOR_STSENARIY` (5), `MENTOR_KEYIN` · «## Risklar» — A-6 jadvalidagi besh qator «risk — B yo'l» · «## B reja» — «Video: laptopda, 60 soniya, repo'da emas» · «Gap: {B_REJA_GAPI}» · «Uyg'otish: …» · «Namuna akkaunt: …» (login va parolsiz). <!-- TAXMIN T8 -->
2. **Teg `m14-demo`** — `DEMO.md` commit'ida (`yechim` tarmog'ida), `git push origin m14-demo`. Shundan keyingi teglar (`m14-dars-07-…`) — faqat tuzatish (7-dars). Demo videosi repo'da yo'q (tayanch 3).
3. **Kod o'zgarmaydi** (yangi funksiya yo'q). Namuna akkauntlar va demo o'yini — Database'da (`namuna = true`); 12-Modulda bor bo'lsa — yangisi ochilmaydi.
4. **`README.md`** — «Darslar va teglar» jadvaliga 6-dars qatori va `m14-demo` («yangi funksiya to'xtatildi» nuqtasi).
5. ⛔ **Muhrdan oldin:** Mentor laptopida (brauzer ko'rinishi) va haqiqiy telefonda (telefon brauzeri): ikki namuna akkaunt bilan demo o'tishi — vaqt, telefonda real vaqt va «Hozir ko'ryapti: 2»; namuna o'yin «Shanba, 18:00» demo kunida ro'yxatda ko'rinadimi; Render uyg'onishi;
   video yozish (ikki oyna yonma-yon) va uzunligi; agent namuna akkaunt promptiga qanday javob beradi (bor akkauntni topadimi). Natija qanday chiqsa — MD (6, 8-ekran kutilgan natija, `{⛔}` joylari) shunga moslanadi.
6. Shart: teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida).

## Manbalar (08.10.2026; o'quvchiga ko'rinmaydi)
1. **Render** bepul xizmati — render.com/docs/free (08.10.2026, WebFetch): «Render spins down a Free web service that goes 15 minutes without receiving any inbound traffic.» · «This process takes about one minute.» — tayanch 6 va `00-MANBA.md` 5 bilan bir (o'quvchi matnida «taxminan bir daqiqa»).
2. Dars mazmuni, Mentor demo stsenariysi, risklar, B reja, uyg'otish, teg — `00-MODUL-TAYANCH.md` 1.6, 1.14, 2, 3, 8, 9.1, 9.5, 9.6, 9.9, 9.10, 9.12, 9.13 (aynan); dastur qatori — `00-MANBA.md` 1 (6-qator: «Stresssiz jonli ko'rsatish; texnik risklar, B reja; feature freeze» · natija «Repetitsiya qilingan demo»).
3. **Git teglari** — git-scm.com bu tunda ochilmadi (ECONNRESET, 08.10); o'rniga rasmiy qo'llanma sahifalari lokal `git 2.53.0` da (`man git-push` — «tag <tag> expands to refs/tags/<tag>:refs/tags/<tag>»; `man git-ls-remote` — `--tags`, chiqishda `refs/tags/…`) va amalda sinaldi (scratchpad `md06/gitsinov`):
   `git tag m14-demo` → `git push origin m14-demo` → `* [new tag] m14-demo -> m14-demo` · `git ls-remote --tags origin` → `<hash>	refs/tags/m14-demo` · takror `git tag m14-demo` → `fatal: tag 'm14-demo' already exists` · oddiy `git push` → `Everything up-to-date` (teg ketmaydi).
4. Jonli demo, namuna o'yin, «O'yindan chiqish», ikkinchi qurilma — 12-Modul tayanchi 9.44 c va `12-PmGrowthPitch-v3.md` 8-ekran; namuna akkaunt (`namuna = true`) — 12-Modul tayanchi 1.7, 9.5, 9.35; mehmon ko'rinishi (`GET /oyinlar` tokensiz) — 12-Modul tayanchi 1.8;
   brauzer ko'rinishi qayta eksporti — 12-Modul tayanchi 9.28; «Hozir ko'ryapti» — 12-Modul tayanchi 1.4; yashirin oyna — 12-Modul tayanchi 9.35 b.
5. Risk ta'rifi — 11-Modul tayanchi 2 («rejaga xalaqit berishi mumkin bo'lgan narsa»), `15-PmOneOnOne-v3.md`; ekran videosi zaxirasi — 11-Modul `16-PmPrototypePitch-v3.md` (YAKUNIY 273, 346).
6. Ekran yozish vositasi, telefonni proyektorga ulash — tekshirilmagan (tayanch 6): umumiy so'z, nomi va menyusi yozilmadi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **«B yo'l» ta'rifi** — tayanchda faqat «har risk + B yo'l». Men: «Risk bo'lsa ham demo davom etishi uchun oldindan qilinadigan ish — B yo'l.» + qoida «B yo'lga yangi kod yozilmaydi». 7-dars (07 A-5) «riskning oldini olish — demodan oldin qilinadigan ish» deydi — mos.
2. **Mentor B yo'llari va hodisa qatorlari** (A-6 jadvali) — tayanchda yo'q, men yozdim. «Ro'yxat bo'sh» — namuna o'yin «Shanba, 18:00»; «Ikki marta bosish» — 4-darsdagi bosish javobi (T7; haqiqiy holati 7-darsda tekshiriladi, bu yerda va'da qilinmaydi). <!-- TAXMIN T7 -->
3. **Mentor stsenariysining besh qatori** — tayanch 1.6 nomlari asosida (`MENTOR_STSENARIY`); 07 pilotning chip yorliqlari va Amaliyot 1 dagi `{demo stsenariysi}` namunasi bilan bir. 7-dars ularni bir qatorda ko'rsatadi — qatorlar qisqa (≤60).
4. **Tayyorlov va «Keyin» qatorlari kalitda yo'q** — `stsenariy` (5) shartnomasi saqlandi; ular `DEMO.md` da va dars holatida. 13-dars tayyorlovni (tayanch 1.13) kalitdan o'qishi kerak bo'lsa — `tayyorlov: [string]`, `keyin: string` qo'shish taklifi.
5. **Uyg'otish usuli** — o'quvchiga umumiy yo'l: demo yo'lini laptopda ochish (ilova Backend'ga so'rov yuboradi); Mentor Yordamida — `…onrender.com/oyinlar` (12-Modul mehmon ko'rinishi). Vaqt — «navbatdan bir necha daqiqa oldin» (son yo'q; 15 daqiqadan kam — Render qoidasi).
6. **Namuna akkaunt — ikkita** (laptop va telefon), `namuna = true`, demo yozuvi real foydalanuvchisiz (12-Modul 9.44 c); bugun o'chirilmaydi — 7, 13-darslar va hakamlar oldidagi chiqish uchun kerak. 7-darsdagi tekshiruv akkaunti (o'chiriladi) — boshqa narsa.
7. **Video — laptop ekrani yozuvi**; 4-qadam (telefon) videoda ko'rinmaydi — Mentor misolida laptopda ikki oyna yonma-yon (o'ngda yashirin oynada 2-namuna akkaunt). O'quvchi uchun — Yordamda, majburiy emas. ⛔ pilot.
8. **Video repo papkasidan tashqarida saqlanadi** (tasodifiy `git add` dan himoya) va `DEMO.md` da fayl nomi yozilmaydi.
9. **Teg o'quvchining o'z repo'sida `m14-demo`** (tayanch 1.6); tekshiruv — `git ls-remote --tags origin` (GitHub sahifasi nomlari taxmin qilinmadi). Teg o'chirish yoki ko'chirish (`-f`) o'rgatilmaydi.
10. **Amaliyot 3 tartibi: teg → demo o'tishi.** Teg — «yangi funksiya to'xtatildi» boshlanishi; o'tishda topilgan muammo — tuzatish (to'xtatishdan keyin ham mumkin). Muqobil: o'tish → teg (teg «o'tgan versiya»ga) — tanlov sizda.
11. **`pm-m12d3-tezlik` o'qilishi** (9.5) — Amaliyot 1 2-qadamda kulrang qator: lending bahosi oldin/keyin bo'lsa — «shu son bilan gapiring», bo'lmasa — «tez ochiladi» demang. Va trek zaxirasi. <!-- TAXMIN T5 -->
12. **`risklar` massivi** — besh umumiy risk karta bilan, «Bu risk demongizda yo'q» bilan chiqariladi; Amaliyot 3 da yangi risk qo'shiladi; uzunligi 0–7. Tayanch 8 da uzunlik yozilmagan.
13. **Uyga vazifa yo'q** (loyiha kuni, sinf 14). B reja videosi darsda ulgurilmasa — 7-darsning uyga vazifasi ① uni so'raydi (07 pilot) — bu darsda va'da qilinmaydi.
14. **B reja gapi** — `DEMO.md` da o'quvchining o'z gapi (shakli Mentor gapidan, `{N}` soniya); kalitda yo'q. Mentor gapi — 9.9 aynan. <!-- TAXMIN T8 -->
15. **«B reja» va «B yo'l»** — o'quvchi matnida «B reja» faqat video (T-015). Tayanch 1.6 uch ishni «A2 B reja (video, uyg'otish, namuna akkaunt)» deb yozadi; men Reja 02 ni «Namuna akkaunt, uyg'otish va B reja videosi», Amaliyot 2 sarlavhasini «B yo'llarni tayyorlang: akkaunt, uyg'otish va B reja.» qildim — App.jsx `sub` so'zi («B reja») saqlandi.
16. **Brauzer ko'rinishini qayta eksport** — Amaliyot 3 1-qadamda (mobil trek): 3, 4-darslardagi o'zgarishlar brauzer ko'rinishiga o'zi chiqmaydi (12-Modul 9.28). Teg qo'yishdan oldin.
17. **«Yechim bo'lagi: 90 soniya»** (9.1) — 5-ekran va Amaliyot 3 taymerida chegara sifatida; «bu mashqda». Demo o'tishi vaqti baho emas.
18. **1-savol ikkinchi misoli** — kitob almashish ilovasi va uning «Olaman» tugmasi (o'ylab topilgan, P-002; 07 pilot va 13-Modul arena 9 bilan bir olam).
19. **Telefon zaryadi** tayyorlov qatorida — Mentor misolida (tayanch 1.13 dagi 13-dars tayyorlovidan); o'quvchining kurs tayyorlovi — to'rt qator (zaryadsiz), qo'shsa bo'ladi.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — Amaliyot 2 ≈ 26 daqiqa (namuna akkaunt, Backend uyg'onishi taxminan bir daqiqa, video yozish va ko'rish). Pilotda 12–15 o'quvchi bilan taymer bilan o'lchanadi; oshsa — video Amaliyot 3 dan keyinga (ulgurmagan yo'l bor) yoki 7-darsga (foydalanuvchi qarori).
2. ⛔ **Ekran yozish vositasi** — har kompyuterda boshqacha (nomi, ovoz yozish, fayl joyi); umumiy so'z. Ba'zi maktab kompyuterlarida yozish cheklangan bo'lishi mumkin — pilotda.
3. ⛔ **Namuna o'yin demo kunida ro'yxatda turadimi** — «Shanba, 18:00» sanasi o'tgan bo'lsa ilova uni yashirishi mumkin; pilotda Mentor repo'sida. O'quvchi mahsulotida ham — 1-qadam promptida agent «haqiqiy foydalanuvchilar bormi» deb tekshiradi, sana emas.
4. ⛔ **Mentorning demo o'tishi vaqti va videosi** — `{⛔ pilotda}`; 60–90 soniya — Mentor rejasi (tayanch 1.14), o'lchov emas.
5. ⛔ **Telefon brauzerida real vaqt va «Hozir ko'ryapti: 2»** — brauzer ko'rinishida 12-Modulda ishlagan; haqiqiy telefonda (Android, iPhone) pilotda.
6. **Kirilgan akkaunt demo kunigacha chiqib ketishi** (sessiya muddati) — shuning uchun tayyorlov qatori demo oldidan qayta belgilanadi; muddat tilga olinmadi (tekshirilmagan).
7. **Laptopda ikki oyna yonma-yon** (video, Yordam) — kichik ekranda telefon kengligidagi sahifa sig'adi deb oldim; pilotda.
8. **`git push origin m14-demo`** — GitHub autentifikatsiyasi o'quvchida 11-Moduldan sozlangan deb oldim (push odati); muammo bo'lsa — xato qatori agentga.
9. **«Wi-Fi», «modem rejimi»** — O'qituvchi eslatmasida umumiy so'z; telefon internetini laptopga ulash darsda yo'l sifatida o'rgatilmaydi.
10. **Kartochkalar ekrani sarlavhasi «O'zingizni sinab ko'ring.»** — qolip (platforma) sarlavhasi; «sinab» ildizi darsda faqat shu yerda (07 Shubhali 11 bilan bir).
11. **0-ekran hook** — 11-Modulda o'tilgan Render uyqusini qaytaradi (o'quvchi javobni bilishi mumkin); maqsad — hakamlar oldidagi chiqishga ko'chirish. Auditor «ma'lum javob» desa — hook obyekti dars obyekti (P-001).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-11 taqsimot; har blokda «Ulgurmasangiz» (A1 — 3-qadamdan, A2 — 2-qadamdan, A3 — 2-qadamdan); tashqi kutishda ish (uyg'onish — oynalarni tayyorlash, eksport — tayyorlov qatorlari); ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — ekran yozish vositasi (umumiy so'z, Shubhali 2), telefon brauzeri va real vaqt (Shubhali 5), namuna o'yin (Shubhali 3), Mentor vaqti va videosi (REPO 5) — ⛔; Render — rasmiy (Manbalar 1); git — lokal rasmiy qo'llanma va sinov (Manbalar 3); GitHub UI nomlari yozilmadi.
3. [x] **Saqlash kaliti — shartnoma** — A-12: tayanch 8 sxemasi aynan, har maydon, tipi, `bool | null` uch holat, qaysi qadam yozadi; tayyorlov/«Keyin» kalitda yo'q (TS 4); login, parol, URL, video nomi yozilmaydi; boshqa darsning kaliti faqat o'qiladi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (0, 5-ekran Mentor, bloklar Yordami), «Bu misolda» (2, 5-ekran xulosalari), «bu mashqda» (besh qadam, 90 soniya, 60 soniya); besh risk — «Bu risk demongizda yo'q» (3-ekran); stsenariy — o'quvchining o'zi.
5. [x] **Kafolat va sabab da'vosi yo'q** — «demo buzilmaydi» yo'q; uyg'otish natijasi — «ro'yxat chiqsa» (6-ekran); «to'liq o'tdi» — beshala qadam ✓ bo'lsa (11-ekran), «buzilmaydi» ma'nosida emas; agentning «ishlaydi» degani — da'vo (7-ekran D).
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun besh holat, «hech narsa» holati alohida (11-ekran; E 54); bloklar yashil xulosasi holatga qarab (6-ekran — 3, 8-ekran — 3); «Video tayyor» faqat uch tekshiruv belgilangach; nishon tavsiflari ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «rejadagidek» (har qadam ✓/✕, 8-ekran; 9.10 bilan bir), demo o'tishi vaqti — soniya; «uyg'ondi» — ro'yxat chiqqani; ta'riflar dars bo'yi so'zma-so'z (A-4, 2, 3, 5-ekran, kartochkalar, yakun).
8. [x] **Test: bitta himoyalanadigan javob** — 4, 7-ekran va arena: distraktorlar uch xil turkumdan (Kalit va arena izoh qatorlari); «rost, lekin mos emas» faqat ochiq aytilgan joyda (7-ekran C); inkor-savol yo'q (arena 7 «nimani yopasiz?»); to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] **Real odamlar xavfsizligi** — demo namuna akkaunt bilan, real o'yinchilarsiz (A-9, 6-ekran 1-qadam); proyektorda haqiqiy ma'lumot yo'q; sherik ismsiz (8-ekran); video ommaviy emas, chatga yuborilmaydi (5, 6-ekran); kim kimdan tez o'tgani sanalmaydi (8-ekran, KOD 11).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — uyg'otish, video tekshiruvi, teg va demo o'tishi — o'quvchi; agent — `DEMO.md`, namuna akkaunt (yo'q bo'lsa). Tekshiruv akkaunti bu darsda yo'q; namuna akkaunt o'chirilmaydi — sababi aytilgan (A-9, TS 6).
11. [x] **Web-trek teng yo'l** — demo ikkala trekda laptop brauzerida (A-6, 3-ekran 1-qadam); farq — brauzer ko'rinishini eksport (8-ekran 1-qadam) va Yordamdagi manzil; web usuli to'qilmadi (Netlify — 12-Modul so'zi).
12. [x] **Mentor misoli ichki izchil** — stsenariy, «8 / 10» → «9 / 10», B reja gapi, 60–90 va 60 soniya — tayanch 1.6, 1.14, 9.9 aynan; 07 pilot chiplari bilan bir; keyingi dars natijasi ochilmadi; yangi tafsilotlar — TAYANCHGA SAVOL 2, 3, 6, 7.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — stsenariy, B yo'l, `{demo yozuvi}`, B reja gapi — o'quvchida; Mentor qarorlari faqat «Yordam»da; agent `DEMO.md` ga so'zma-so'z ko'chiradi.
14. [x] **Uyga vazifa yengil va aniq** — loyiha kuni: uyga vazifa yo'q; ulgurmagan ish — yakun sarlavhasida.
15. [x] **Ayb da'vosi yo'q** — xato yo'li: «Shu xato chiqdi: {xato}. …» (3, 6, 8-ekran); «xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — «demo buzilmaydi», «hakamlar yoqtiradi» yo'q; keyingi dars ekranda aytilmaydi (faqat yakundagi «Keyingi dars» qatori); «Demo Day» o'quvchi matnida yo'q (9.13).
17. [x] **Pul va investitsiya** — bu darsda pul yo'q; Pro va to'lov demo stsenariysida yo'q; investitsiya tilga olinmaydi.
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q; Render — faqat rasmiy fakt (Manbalar 1).
- [x] **RAD etilganlar (qayta ochilmaydi):** hookdagi «Aynan!» / «Qiziq fikr!» (0-ekran) · yakundagi «Keyingi dars — «…»» qatori (11-ekran) · Reja sarlavhasi — natija-gap (1-ekran) · ekranda ≤3 blok · keyssiz.
- [x] **12-Modul SABOQ E:** har variantning o'z chegarasi (E 40) · maketda hech narsa kesilmaydi (E 41) · taxmin qatori yashil xulosa ichida (2, 5-ekran — E 42) · yorliq input ichida (3-ekran 2, 3-qadam — E 43) · bittadan karta (risklar — E 53) · yakun standarti (E 50) · sarlavha har holatda rost (E 54) · «Davom etish» joyi MD da (E 55).

## O'lchov
`md06/olchov.py` natijasi (qoralamadagi har sanaladigan matn belgilab olinib, uzunligi skript bilan yozildi):
```
Belgilar soni — bo'shliq bilan, ** va ` siz (Python len). Qavsdagi hamma uzunlik skript bilan qo'yilgan (qo'lda son yozilmagan): 166 ta.
Sarlavhalar: 12 ta · 35–54 · ≤55
Xulosalar: 2 ta · 96–100 · ≤110
Hook javoblari: 3 ta · 114–120 · ≤120
Hook variantlari: 3 ta · 45–47
To'g'ri izohlar: 2 ta · 55–55 · ≤60
Xato izohlari, QXato, ipucha, shart xabarlari: 18 ta · 35–56 · ≤60
QIzoh qatorlari (13M 05-FILTR: 113 qabul): 4 ta · 47–113 · ≤115
Bloklar yashil xulosasi: 7 ta · 55–66 · ≤110
Kulrang qatorlar, hodisa qatorlari, B yo'l namunalari: 22 ta · 47–126
Nishon tavsiflari: 4 ta · 39–55 · ≤60
Endi siz bilasiz: 5 ta · 56–79 · ≤110
Bashorat variantlari: 6 ta · 7–21
Bugungi asosiy fikr (A-2): 1 ta · 104–104 · ≤110
Stsenariy qatorlari (Mentor): 6 ta · 18–52 · ≤60
Mentor gaplari: 0-ekran 1 gap (91) · 0-ekran 1 gap (60) · 1-ekran 2 gap (120) · 2-ekran 1 gap (66) · 2-ekran 1 gap (56) · 2-ekran 1 gap (48) · 2-ekran 1 gap (40) · 3-ekran 1 gap (100) · 5-ekran 1 gap (77) · 5-ekran 1 gap (57) · 5-ekran 1 gap (33) · 5-ekran 1 gap (35) · 5-ekran 1 gap (40) · 6-ekran 1 gap (87) · 8-ekran 1 gap (98)
Sarlavha so'zlari (4+ harf) Mentorda: 0: 1/7 · 1: 1/5 · 2: 2/6 · 3: 0/4 · 5: 2/6 · 6: 1/5 · 8: 1/5 · 11: 0/6 — hech qayerda ≥50% bo'lmasligi kerak
test 1 (ekran 4): 40 · 46 · 48 · ✔44 | min/max 40/48 | o'rtachadan eng katta og'ish 10%
test 2 (ekran 7): 37 · ✔34 · 39 · 38 | min/max 34/39 | o'rtachadan eng katta og'ish 8%
Ballik testlar ✔: {'D': 1, 'B': 1}
arena 1: ✔31 · 29 · 29 · 31 | min/max 29/31 | o'rtachadan eng katta og'ish 3%
arena 2: 37 · ✔38 · 36 · 39 | min/max 36/39 | o'rtachadan eng katta og'ish 4%
arena 3: 30 · 31 · ✔33 · 35 | min/max 30/35 | o'rtachadan eng katta og'ish 9%
arena 4: 41 · 42 · 41 · ✔35 | min/max 35/42 | o'rtachadan eng katta og'ish 12%
arena 5: ✔30 · 36 · 40 · 34 | min/max 30/40 | o'rtachadan eng katta og'ish 14%
arena 6: 36 · ✔40 · 40 · 38 | min/max 36/40 | o'rtachadan eng katta og'ish 6%
arena 7: 36 · 31 · ✔30 · 33 | min/max 30/36 | o'rtachadan eng katta og'ish 11%
arena 8: 30 · 31 · 28 · ✔28 | min/max 28/31 | o'rtachadan eng katta og'ish 6%
arena 9: ✔35 · 34 · 34 · 37 | min/max 34/37 | o'rtachadan eng katta og'ish 6%
arena 10: 31 · ✔33 · 34 · 30 | min/max 30/34 | o'rtachadan eng katta og'ish 6%
arena 11: 33 · 34 · ✔34 · 37 | min/max 33/37 | o'rtachadan eng katta og'ish 7%
arena 12: 34 · 32 · 32 · ✔30 | min/max 30/34 | o'rtachadan eng katta og'ish 6%
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
Hook variantlari: 45 · 46 · 47
Bashorat variantlari: 20 · 19 · 21 · 7 · 8 · 8
Xatolar: 0
```

## TAXMIN belgilari
Jami 35 ta `<!-- TAXMIN Tn -->` belgisi (qavsda — nechta joyda). Qaror-0 javobi boshqacha bo'lsa — aynan shu joylar tuzatiladi.
- **T4** (5) — A-bo'lim · 1-ekran · 3-ekran · 8-ekran · REPO
- **T5** (4) — A-bo'lim · 3-ekran · TAYANCHGA SAVOL
- **T6** (1) — sarlavha bloki
- **T7** (3) — A-bo'lim · TAYANCHGA SAVOL
- **T8** (9) — A-bo'lim · Darsning ipi va bitta vizual · 1-ekran · 3-ekran · REPO · TAYANCHGA SAVOL
- **T9** (2) — sarlavha qatori · Fayl qatori
- **T10** (3) — A-bo'lim · 2-ekran
- **T12** (2) — sarlavha bloki · A-bo'lim
- **T19** (2) — A-bo'lim
- **T20** (4) — sarlavha qatori · sarlavha bloki · Darsning ipi va bitta vizual · 11-ekran

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 471–473 (grep 08.10) — `m12-05` «Guruh pitchingizda nimani tuzatishni aytadi?» → **`m12-06` «Demoga tayyorgarlik: risklar va B reja»** (osti «demo stsenariysi, B reja va yangi funksiyani to'xtatish» — 1-ekran uch qadami shu tartibda) →
  `m12-07` «Investor ko'zi bilan: demo buzilmaydimi?» (yakundagi «Keyingi dars» qatori).
- [x] Bitta misol-ip — «Maydon Jamoa» demosi (tayanch 1.6); ikkinchi misol faqat testda (kitob almashish — P-002); keyssiz; metafora yo'q; bitta vizual — `DemoSahna` (laptop · telefon · stsenariy chizig'i · `DEMO.md` kartasi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 0 («O'yinlar» → uyg'onish), 2 (ikki o'tish + boshiga qaytarish), 5 (uch yo'l) + bloklar 3, 6, 8; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md06/olchov.py`): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi ≤60 — «O'lchov» bo'limi.
- [x] Atamalar oldingi darslar bilan bir (grep, tayanch 2; A-3): risk (11-Modul), ekran videosi → B reja (11-Modul), namuna akkaunt, yashirin oyna, brauzer ko'rinishi, «Hozir ko'ryapti» (12-Modul), hakam (1-dars) · yangi: demo stsenariysi, demo o'tishi, B yo'l, uyg'otish, yangi funksiya to'xtatildi — hodisadan keyin, ta'rif dars bo'yi bir xil ·
  siz-forma; tugmalar ot-shaklda yoki holat yozuvi («Demoni ko'rsatish», «Boshiga qaytarish», «Video tayyor», «Teg GitHub'da»). Agentga prompt — buyruq shaklida (T-002).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (O'lchov); to'g'ri javob yolg'iz eng uzun emas; kalit so'z, tire, ikki nuqta faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 4-ekran D, 7-ekran B (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ ↻ — belgilar) · kafolat so'zlari yo'q · xulosalar «Bu misolda» bilan chegaralangan · «sinov», «Demo Day» — o'quvchi matnida yo'q.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-06`, «A1», «Modul 14», K-raqam, «pilot» yo'q; bloklar — «Amaliyot 1–3»; modul raqami LMS bo'yicha — «11-Modulda», «12-Modulda», «3-darsda»); «KOD» ro'yxati 14 band, REPO 6 band.
- [x] Karta T · P · S: T-002 (promptlar) · T-008 (Mentor B yo'llari, B reja gapi — olam matni) · T-011 (demo stsenariysi, demo o'tishi — 2-ekran oxirida; B yo'l — Amaliyot 1 da hodisadan keyin; B reja — 5-ekran; yangi funksiya to'xtatildi — teg qo'yilgandan keyin) · T-014/T-015 (A-5: «B reja» — faqat video) ·
  T-016/T-017 (metafora yo'q) · T-024 · T-029/T-047 · T-038 · T-039 («demongiz» — 4-darsdan bor) · T-042 · T-043 · T-045 · T-048 · T-049 · T-052 (risk, ekran videosi, namuna akkaunt, teg ko'priklari) · T-064 · T-070 ·
  P-001 · P-002 · P-004 (ikkinchi qurilmasiz demo yo'li) · P-008 · P-012 (4, 7 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-026 · P-028 · P-033 · P-036 · P-046 · P-048 · P-052 · P-059 · P-062 · P-064 · P-067 ·
  S-001 · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 · S-026 · S-027 · §102 · §106 · §119 · §144/§145 · J-026 (hook ballsiz) · SABOQ 1–39, E 40–55.
- [x] Halollik va xavfsizlik (TAQIQLAR 1, 2, 3; tayanch 1.6): yangi funksiya yo'q; namuna akkaunt va real odamlarsiz demo; login/parol hech qayerda; video laptopda, ommaviy emas; Mentor vaqti va videosi to'qilmadi (⛔).
- [ ] ⛔ «qur» darvozalari ochiq: Mentor demo o'tishi va videosi (REPO 5), namuna o'yin (Shubhali 3), telefon brauzerida real vaqt (Shubhali 5), 90 daqiqa (Shubhali 1) — pilot va foydalanuvchi qarori kerak; TAYANCHGA SAVOL 4 (tayyorlov kalitda), 10 (teg tartibi), 15 (Reja 02 so'zi) — qaror kerak.
