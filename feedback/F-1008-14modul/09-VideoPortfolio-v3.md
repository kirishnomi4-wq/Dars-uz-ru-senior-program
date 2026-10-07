# 14-Modul · 9-dars «Video-portfolio: 3 daqiqada o'zingiz va mahsulot» — MD v3 (yangi dars, TEX — loyiha kuni shaklida) <!-- TAXMIN T20 --> <!-- TAXMIN T9 -->

Fayl: `src/12-Modull/VideoPortfolioLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-09`, App.jsx `type: 'Kod'` · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar; podium umumiy shablon) · faqat o'zbekcha (ru — 6-RU bosqichida) <!-- TAXMIN T9 -->
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, loyiha kuni shakli (tayanch 4: «8 ekran + 3 blok + kartochkalar»), keyssiz (tayanch 5). Qolip: QKirish · QReja · QTushuncha ×2 · QTest ×2 · QBlok ×3 · podium · QKartochka · QYakun. Kod oynasi yo'q. <!-- TAXMIN T18 -->
Menyu (DE-205, App.jsx 474–476, grep 08.10): `m12-08` «Final pitchingiz 5 daqiqaga tayyormi?» → **`m12-09` «Video-portfolio: 3 daqiqada o'zingiz va mahsulot»** (osti: «ssenariy, ekran yozuvi va havola», `type: 'Kod'`) → `m12-10` «Birinchi buyurtmani qayerdan topasiz?». <!-- TAXMIN T20 -->
Namuna (tuzilish, hajm; matn ko'chirilmadi): 13-Modul `08-WinBackDay-v3.md` + `08-FILTR.md` (loyiha kuni: 12 ekran, uch blok, tekshiruv kartasi, yakun holatlari) · pilot `07-PmDemoTest-v3.md` (14-Modul kelishuvlari, B reja, demo yo'li, o'lchov) · 11-Modul `16-PmPrototypePitch-v3.md` (ekran videosi zaxirasi — telefonning ekran yozuvi).
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p elementli mashq ketma-ket, bir vaqtda bitta karta (E 53) · yorliq input ichida (E 43) · ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) ·
«Ortda qoldingizmi» darsda bir marta, 1-amaliyotda · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q), sarlavha har holatda rost (E 54).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** (`correctIdx 2`) · 7-ekran **B** (`correctIdx 1`) · final tartib-mashqi yo'q (loyiha kuni, 172) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2 ≈ 7 · Amaliyot 1 ≈ 20 · 4 ≈ 2 · 5 ≈ 6 · Amaliyot 2 ≈ 25 · 7 ≈ 2 · Amaliyot 3 ≈ 15 · podium, kartochkalar, yakun, arena ≈ 8 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (12–15 o'quvchi bir xonada ovoz yozadi — navbat kerak bo'lishi mumkin; qayta yozish bor); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 10-band.
⚠️ **Video qoidasi (TAQIQLAR 1, 3; tayanch 1.9, T12) — har ekranga tegadi:** yuz va ism — **ixtiyoriy** (ekran yozuvi va ovoz yetarli) · video **hamma ko'radigan joyga joylanmaydi** — kompyuterda fayl yoki «faqat havola bilan ko'rinadigan joy» · videoni kimgadir ko'rsatish — **ota-ona roziligi bilan** ·
ekranda maxfiy kalit, `.env`, login, boshqa odamlarning ma'lumoti va yozishmasi **ko'rinmaydi** · video havolasi hech qayerga yozilmaydi (saqlash kaliti, sinf chati, repo, README) · video repo'ga qo'shilmaydi · sinfda o'quvchi videolari proyektorga chiqarilmaydi, kim yuzi bilan yozgani sanalmaydi. <!-- TAXMIN T12 -->
Ekran yozish vositasi — umumiy so'z («kompyuteringizdagi ekran yozish vositasi»); aniq dastur, menyu va tugma nomi — **⛔ pilotda tekshiriladi** (tayanch 1.9, 6). «Faqat havola bilan» joy — xizmat nomi aytilmaydi (tekshirilmagan; yosh chegarasi taxmin qilinmaydi — TAQIQLAR 1).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 1.9, 4):** dars oxirida o'quvchining **o'z mahsuloti haqida 3 daqiqagacha bo'lgan video** — uch bo'lak: **Kimman** (bir gap; ism ixtiyoriy) · **Nima qurdim** (hikoya lahzasi va ekran yozuvi: jonli demo) · **Qanday ishlayman** (bitta qaror va uning sababi). <!-- TAXMIN T12 -->
   Video o'quvchining kompyuterida fayl bo'lib turadi (repo papkasidan tashqarida); o'quvchi uni o'zi ko'rib tekshirgan (maxfiy narsa ko'rinmadi · 3 daqiqaga sig'di). Havola — faqat ota-ona roziligi bo'lsa, «faqat havola bilan ko'rinadigan joy»ga. <!-- TAXMIN T12 -->
   Dasturdagi maqsad (MANBA 1, 9-qator): «O'zi va mahsuloti haqida 3 daqiqalik video (frilans/stajirovka uchun)» — o'quvchi matnida «frilans», «stajirovka» yo'q (10-darsda tug'iladi, T-011); maqsad «sizni tanimaydigan odamga» deb aytiladi. <!-- TAXMIN T13 -->
   Saqlanadi `pm-m12d9-video` (12-band; 10-dars o'qiydi). Kod o'zgarmaydi: teg `m14-dars-09-done` = `m14-dars-07-done` (tayanch 3 — video repo'ga yozilmaydi). Uyga vazifa yo'q (loyiha kuni; sinf 14). <!-- TAXMIN T4 -->
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** 3 daqiqalik video sizni uch bo'lakda tanishtiradi; ekranda faqat ko'rsatsa bo'ladigan narsa turadi. (99)
3. **Oldingi darslardan keladigan narsa (aynan; qayta o'rgatilmaydi — T-052):**
   - 2-dars (tayanch 1.2): **hikoya** — bitta odam, bitta lahza, o'zgarish; Mentor misoli: «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.» → «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.» · funksiyalar ro'yxati — hikoya emas ·
     **o'zini videoga yozish** — telefonda, o'zi bir marta ko'radi (uch savol), video telefonda qoladi. Kalit `pm-m12d2-hikoya` (`kim`, `lahza`, `ozgarish`).
   - 6-dars (tayanch 1.6): demo stsenariysi (Mentor misolida 5 qadam: kirish → «O'yinlar» → o'yinga qo'shilish → ikkinchi telefonda son o'zgaradi → «Hozir ko'ryapti») · **B reja** — 60 soniyalik ekran videosi · Backend'ni **uyg'otish** — bitta so'rov · **namuna akkaunt** (A2 bloki) · demo laptopdagi brauzerda (mobil trekda — brauzer ko'rinishi). <!-- TAXMIN T8 -->
     Kalit `pm-m12d6-demo` (`stsenariy` — qo'shimcha o'qish, TAYANCHGA SAVOL 5). Har o'tishdan keyin demo holati boshiga qaytariladi (Mentor misolida — o'yindan chiqish, yana «8 / 10»; tayanch 9.10).
   - 4-dars (tayanch 1.4): qo'shilgach «8 / 10» → «9 / 10» kichik animatsiya (muvaffaqiyat) — bitta qurilmada ko'rinadi; videoning demo qismi shunga tayanadi. <!-- TAXMIN T7 -->
   - 11-Modul 16-darsi: ilovani ishlatayotgan ekran videosi — telefonning ekran yozuvi bilan (zaxira). 12-Modul: lending (Mentor lendingi sarlavhasi «Mahalla futboliga jamoani bir joyda yig'ing»), `namuna` ustuni (`namuna = true` — haqiqiy bo'lmagan akkaunt), Neon SQL Editor, login (telefon so'ralmaydi).
   - 12–13-Modul: push odati — `git status` (o'zgargan va yangi fayllar ro'yxati), `git add <fayl>`; `.env` `git status` da ko'rinmasligi tekshiriladi · Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa (tayanch 6).
   - 13-Modul 11-darsi (13M tayanch 1.11): Mentor roadmap'i — «maydon pulini bo'lishish — uzoqroqda qoldi (sabab: muammo gapidan kelmaydi)». Muammo gapi (11-Modul): «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.»
4. **Mazmun (tayanch 1.9 — aynan; tafsilotlar — TAYANCHGA SAVOL):**
   - **Uch bo'lak — 3 daqiqa:** Kimman · Nima qurdim · Qanday ishlayman (bo'lak nomlari dars bo'yi shu shaklda, bosh harf bilan). Bu mashqdagi vaqt rejasi: Kimman ≈ 0:20 · Nima qurdim ≈ 1:50 · Qanday ishlayman ≈ 0:50 (jami 3:00; TAYANCHGA SAVOL 2). Haqiqiy vaqtni o'quvchi o'zi taymer bilan ko'radi (A1 3-qadam, A3 3-qadam).
   - **Mentor misolining ssenariysi** (bitta manba `MENTOR_SSENARIY`; olam matni — «men» shaklida, T-008; TAYANCHGA SAVOL 1):
     - **Kimman** (ekranda — lending): «Men g'oyadan boshlab ishlaydigan ilovagacha mahsulot quraman, kodni agent bilan yozaman.» (tayanch 1.1 Jamoa bo'lagidan: «g'oya, mahsulot va kod (agent bilan)»; ism aytilmaydi)
     - **Nima qurdim** (ekranda — ilovaning brauzer ko'rinishi): «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi. Shuning uchun «Maydon Jamoa»ni qurdim.» → demo (6-dars stsenariysining 1–3-qadami va 4-dars animatsiyasi): «O'yinlar» → «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «Qo'shilaman» → «9 / 10» →
       «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.» (tayanch 1.2 aynan; ikkinchi telefon va «Hozir ko'ryapti» videoda yo'q — bitta ekran yozuvi; TAYANCHGA SAVOL 8) <!-- TAXMIN T8 -->
     - **Qanday ishlayman** (ekranda — «O'yinlar»): «Maydon pulini bo'lishishni keyinga qoldirdim, chunki muammo boshqa: o'yinchilar odam yig'ishda qiynaladi.» (13M tayanch 1.11 qarori va 11-Modul muammo gapi)
   - **Ekranda ko'rinmasligi kerak bo'lgan to'rt joy** (bitta manba `MAXFIY_ROYXAT`; 5-ekran, A2 1-qadam, A3 2-qadam): maxfiy kalit va `.env` (kod oynasi) · login (kirish sahifasi) · boshqa odamlarning ma'lumoti (Neon jadvali: ism, login) · yozishma (chat xabari oynasi). A3 da beshinchi qator — ovozda maktab, telefon, manzil.
     5-ekrandagi to'rt kadr — **mashq kadri** («agar Mentor hozir yozishni boshlasa, ekranda nima turardi»), Mentorning haqiqiy yozuvi yoki voqeasi emas (TAYANCHGA SAVOL 10).
   - **Kim ko'radi (T12):** yozish — sinfda, kompyuterda; tekshiruvdan oldin video hech qayerga yuklanmaydi. Havola — faqat ota-ona roziligi bo'lsa va faqat «faqat havola bilan ko'rinadigan joy»ga; kimga yuborish — ota-ona bilan. Rozilik hali bo'lmasa — video fayl bo'lib qoladi: bu ham tayyor natija (A3 4-qadam). <!-- TAXMIN T12 -->
   - **Halol gaplar:** «Yuz va ism — ixtiyoriy: ekran yozuvi va ovoz yetarli.» (0-ekran, kartochka 5) · «Yozuvga tushgan narsa video faylida qoladi.» (5-ekran) · «Video faqat bor narsani ko'rsatadi.» (2-ekran xato izohi) · tekshiruvni o'quvchi o'zi qiladi — videoni boshidan oxirigacha o'zi ko'radi (A3).
5. **Atamalar (bir ma'no — bir so'z, T-014/T-015; tayanch 2):**
   - **video-portfolio** — tayanch 2: «o'zi va mahsuloti haqida 3 daqiqalik video». Darsdagi ta'rif, so'zma-so'z: «O'zingiz va mahsulotingiz haqidagi 3 daqiqalik video — video-portfolio.» Tug'iladi 2-ekranda — harakatdan keyin (`QIzoh`, T-011); yakun 1-qatori, kartochka 1, arena 1 — shu so'zlar. Ishlatilmaydi: rezyume-video, «reels». <!-- TAXMIN T19 -->
   - **ssenariy** — videoda nima aytilishi va ekranda nima ko'rinishi, uch bo'lakda (App.jsx osti so'zi). **ekran yozuvi** — kompyuter ekranida bo'layotganini ovoz bilan birga videoga yozish (tayanch 1.9; App.jsx osti); vosita — «ekran yozish vositasi».
     6-darsdagi demo stsenariysi o'quvchi matnida nomi bilan aytilmaydi (A1 da «6-darsdan olindi» kulrang yorlig'i bilan oldindan yoziladi) — «ssenariy» / «stsenariy» bir darsda yonma-yon turmasin (TAYANCHGA SAVOL 9).
   - **havola** · **faqat havola bilan ko'rinadigan joy** (tayanch 1.9 so'zi) · **hamma ko'radigan joy** — kanal, ochiq sahifa (o'quvchi matnida «ommaviy» o'rniga). **ota-ona roziligi**.
   - **maxfiy kalit** · **`.env`** · **login** (12-Modul) · **boshqa odamlarning ma'lumoti** · **yozishma** · **namuna akkaunt** (6-dars; `namuna = true` — 12-Modul) · **B reja** (6-dars — faqat 60 soniyalik video ma'nosida) · **uyg'otish** (6-dars).
   - **Kimman · Nima qurdim · Qanday ishlayman** — bo'lak nomlari, bosh harf bilan, qo'shtirnoqsiz yorliqda, matnda «…» ichida.
   - **tekshirish · tekshiruv** — o'quvchining o'z ishi; «sinov» bu darsda yo'q. **agent** (Antigravity) · **prompt** · **talab** — faqat A2 1-qadamdagi namuna akkaunt promptida.
   - **Ishlatilmaydi:** reels, vlog, «kontent», montaj (bu darsda video kesilmaydi — qayta yoziladi), ommaviy (prozada), frilans, stajirovka, buyurtmachi (10-dars), Demo Day (tayanch 9.13), demo stsenariysi (o'quvchi matnida — 9-band), ekran videosi (bu darsda «ekran yozuvi»; B reja — «B reja videosi»), A1/A2/A3, `m12-09`, «Modul 14», keys, pilot, daftar.
6. **Mentor misolidagi sonlar (tayanch 1.14 — boshqa son yo'q):** «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10» · lahzadagi «8 kishi», «2 kishi» (1.2) · B reja — 60 soniya · Render — 15 daqiqa, ≈1 daqiqa (rasmiy) · video — 3 daqiqa (dastur).
   Bu mashqdagi vaqt rejasi 0:20 · 1:50 · 0:50 — **reja**, o'lchov emas (TAYANCHGA SAVOL 2). Mentor videosining haqiqiy uzunligi va kadrlari — **⛔ pilotda** (`{…}`). Foydalanuvchi, tashkilotchi, tasdiq sonlari bu darsda aytilmaydi (videoda Raqamlar bo'lagi yo'q).
7. **Metafora yo'q. Keyssiz** (tayanch 5). Ikkinchi misol faqat testda (P-002): kitob almashish ilovasi (4-ekran) — 13-Modul va 7-dars testlaridagi olam. Qahramon yo'q — odamlar roli bilan: o'yinchi, tashkilotchi, sinfdosh, ota-ona. <!-- TAXMIN T18 -->
8. **Amaliyot bloki (tayanch 1.9; 13-Modul 8-dars shakli):** uch blok — **Amaliyot 1** ssenariy (uch bo'lak) · **Amaliyot 2** yozish · **Amaliyot 3** tekshirish va havola. To'rt qadamning hammasi o'quvchining **o'z mahsulotida**, o'z kompyuterida; Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam»da Mentor misoli). <!-- TAXMIN T12 -->
   Agent faqat bitta joyda — namuna akkaunt yo'q bo'lsa (A2 1-qadam; talab: qayerda · nima qilsin · nima buzilmasin; agentga buyruq shaklida — T-002). Kod o'zgarmaydi; mahsulot ochilmasa — xato yo'li (bitta gap) va B reja videosi.
   Blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h). «Davom etish»: A1 — 2-qadamdan (uch bo'lak yozilgach) · A2 — 3-qadamdan (fayl belgilangach) · A3 — 2-qadamdan (maxfiy joylar belgilangach) keyin (E 55).
9. **Xavfsizlik va halollik chegarasi (TAQIQLAR 1, 3; tayanch 1.9; sinf 9):** <!-- TAXMIN T12 -->
   - yuz va ism — ixtiyoriy; kamera — faqat ota-ona rozi bo'lsa (A2 2-qadam); «Kimman» kartasiga ism yozilmaydi (kalitga tushmasin — sinf 3); maktab, telefon, manzil — videoda ham, ovozda ham yo'q (2-ekran karta 3, A3 5-qator);
   - tekshiruvdan oldin video hech qayerga yuklanmaydi; havola — ota-ona roziligi bilan, faqat «faqat havola bilan ko'rinadigan joy»ga; havola dars formasiga, kalitga, sinf chatiga, repo'ga, README'ga yozilmaydi; kimga yuborish — ota-ona bilan;
   - demo — namuna akkaunt bilan; haqiqiy foydalanuvchilarning ismi va yozuvlari ekranda yo'q; Neon va kod oynasi yozish paytida yopiq; maxfiy narsa ko'rinsa — video hech kimga yuborilmaydi, o'chiriladi va qayta yoziladi (A3 2-qadam);
   - Mentor ota-ona nomidan rozilik bermaydi; o'quvchi tanlovni o'zi belgilaydi (A3 4-qadam); sinfda o'quvchi videosi proyektorga chiqarilmaydi; kim yuzi bilan yozgani, kim havola qilgani sanalmaydi (KOD 11);
   - `.env` qiymatlari, token va kalitlar agentga yuborilmaydi; xato chiqsa — faqat xato qatori. Mentor misolining videosi va havolasi o'quvchiga berilmaydi (⛔ pilotda — faqat «qur» ichki namunasi).
10. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan) va ulgurmagan yo'l:** taqsimot tepada. Har blokda «Ulgurmasangiz» qatori. Ovoz yozish — sinfda shovqin: O'qituvchi eslatmasida navbat yo'li (Shubhali 3).
    Ekran yozish vositasi ishlamasa — telefonning ekran yozuvi (11-Modul zaxirasi), demo yo'li telefon brauzerida. Mahsulot ochilmasa — «Nima qurdim» bo'lagida 6-darsdagi B reja videosi ekranda ochib ko'rsatiladi (P-026: natija bitta tashqi narsaga osilib qolmaydi).
    Yakun sarlavhasi holatga qarab (11-ekran, besh holat). Uyga vazifa yo'q (sinf 14); havola — ota-ona roziligi bo'lgandagina, ixtiyoriy (majburiydek aytilmaydi).
11. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; ✓ ✕ › ✎ ↻ — belgilar. «Maydon Jamoa» — brauzer maketida o'z yashil rangida (11-Modul 9.62), logotipsiz. Yozuv belgisi — CSS doira (`err` token) + vaqt; kamera joyi — uzuq doira (bo'sh joy — U-041).
    Rang — faqat holat foni (D3): yopilgan joy — `ok` · ko'rinib qolgan joy — `err` · vaqt chizig'idan oshgan qism — `err` · joriy bo'lak — `accent` · kutish — `ink2`. Sahnada odam yuzi, ism, haqiqiy login va kalit qiymati chizilmaydi (maketda — kulrang chiziq yoki `…`).
    Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 («O'lchov» bo'limi, skript bilan).
12. **Saqlash kalitlari (tayanch 8 — shartnoma; sinf 3):**
    - **o'qiydi:** `pm-m12d2-hikoya` — `lahza`, `ozgarish` («Nima qurdim» kartasi oldindan: `lahza + ' ' + ozgarish`; `kim` — hikoyadagi odam, bu darsda alohida ko'rsatilmaydi) ·
      qo'shimcha (TAYANCHGA SAVOL 5): `pm-m12d6-demo.stsenariy` («Nima qurdim» kartasida demo qatori oldindan, kulrang yorliq «6-darsdan olindi») · `pm-m9d8-platforma.trek` (A2 1-qadam yo'li). Yo'q bo'lsa — maydon bo'sh, kulrang namuna (Mentor misoli) «Yordam»da.
    - **yozadi:** `pm-m12d9-video` = `{ bolaklar: { kim, nima, qanday }, bor: bool | null, tekshiruv: { maxfiyYoq: bool | null, sigdi: bool | null }, savedAt }` (tayanch 8, aynan). Maydonlar shartnomasi:
      `bolaklar.kim` — «Kimman» gapi (≤160; ism yozilmaydi — kartada kulrang qator) · `bolaklar.nima` — «Nima qurdim»: lahza va demoda ko'rsatiladigan qadamlar (≤300) · `bolaklar.qanday` — «Qanday ishlayman»: qaror va sababi (≤200); har biri — matn yoki `null` (yozilmagan); A1 4-qadam «Saqlash»da yoziladi.
      `bor` — **video bor**: A2 3-qadam «Video saqlandi» → `true` · «Yozolmadim» → `false` · belgilanmagan → `null` (TAYANCHGA SAVOL 3) ·
      `tekshiruv.maxfiyYoq` — A3 2-qadam: besh qatorning hammasi «Ko'rinmadi» / «Aytilmadi» → `true`; birortasi «Ko'rindi» / «Aytildi» → `false`; to'liq belgilanmagan → `null` (qayta yozilib, qayta tekshirilsa — yangilanadi) ·
      `tekshiruv.sigdi` — A3 3-qadam: «3 daqiqagacha» → `true` · «3 daqiqadan oshdi» → `false` · `null` · `savedAt` — har saqlashda.
      **Kalitga yozilmaydi:** havola, ota-ona javobi, yuz bor-yo'qligi, video fayl nomi va joyi, ism, maktab, login. A3 4-qadam tanlovi va bloklar «Bajardim»i — dars holatida (`ccProgress`). Dars boshqa darsning kalitiga yozmaydi. Kod qoralamasi kaliti yo'q (kod oynasi yo'q).
13. **Trek (tayanch 1.0, 1.6):** video ikkala trekda laptopda yoziladi: demo yo'li — laptop brauzerida (mobil trekda — ilovaning brauzer ko'rinishi, web-trekda — saytingiz). PM qismi (0–2, 4, 5, 7) — ikkala trekka bir xil. Farq — faqat A2 1-qadamdagi bir gap (qaysi manzil ochiladi). O'quvchi matnida «mahsulotingiz», «demo yo'lingiz» (sinf 11). <!-- TAXMIN T8 -->

## Darsning ipi va bitta vizual

- **Modul ipi:** 2-darsda o'quvchi hikoyasini telefonda yozib, o'zi ko'rgan — video telefonda qoldi. 6-darsda demo yo'li, B reja videosi va namuna akkaunt tayyorlandi. Bugun — sizni tanimaydigan odam ham ko'rishi mumkin bo'lgan video: uch bo'lak, 3 daqiqa, ekranda faqat ko'rsatsa bo'ladigan narsa, kimga — ota-ona bilan. <!-- TAXMIN T12 -->
- **Dars ipi:** 0 — bu videoda yuzingiz shartmi? (yo'q — ekran yozuvi va ovoz) → 2 — oltita kartadan qaysilari 3 daqiqaga sig'adi → uch bo'lak va «video-portfolio» → Amaliyot 1 — o'z ssenariysi va ovoz chiqarib o'qish (taymer) → 4 — «Qanday ishlayman» bo'lagiga qaysi gap mos (kitob almashish ilovasi) →
  5 — yozishdan oldin ekranda yopiladigan to'rt joy → Amaliyot 2 — tayyorlash, yozish, fayl repo'dan tashqarida → 7 — `.env` ochiq qolsa-chi? → Amaliyot 3 — o'zi ko'rib tekshiradi, vaqt, kim ko'radi → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Video sahnasi» (`VideoSahna`, dars bo'yi; 163/180; bitta manba `VIDEO_BOLAKLAR` + `MENTOR_SSENARIY` + `MAXFIY_KADRLAR` + o'quvchi ma'lumoti `pm-m12d9-video`):**
  - **laptop ekrani** (chapda, kattaroq; yorliq ramka ustida «laptop · ekran yozuvi»): brauzer oynasi — manzil satri `maydon-jamoa-….netlify.app`, ichida lending yoki ilova («O'yinlar», o'yin e'loni «Shanba, 18:00 · Mahalla maydoni · 8 / 10», «Qo'shilaman»); 5-ekranda — boshqa oynalar (kod oynasi, kirish sahifasi, Neon jadvali, chat xabari).
    Ekran tepasida **yozuv belgisi** — doira + vaqt «0:00» (yozuv paytida vaqt yuradi); o'ng pastki burchakda **kamera joyi** — uzuq doira, ostida kulrang «yuz — ixtiyoriy»; pastda **ovoz chizig'i** (yozuv paytida to'lqin).
  - **vaqt chizig'i** (laptop ostida, butun kenglikda): 0:00 dan 3:00 gacha, uch bo'lak joyi (bo'sh — uzuq chiziq; to'lgani — bo'lak nomi va vaqti bilan); 3:00 dan oshgan qism — `err` fonda, chiziq tashqarisiga chiqib turadi.
  - **fayl kartasi** (o'ngda, ixcham): «video · fayl» — holati: «kompyuterda · repo papkasidan tashqarida» · «faqat havola bilan» (qulf belgisi chizilgan, emoji emas) — A2, A3 o'ng tomonida.
  - Ishlatiladi: 0 (laptop + kamera joyi + ovoz chizig'i) · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (vaqt chizig'i + karta) · 5 (laptop: to'rt kadr) · A1–A3 o'ng (kutilgan natija) · 4, 7 (javobdan keyin kichik ko'rinish).
  - Holatlar: kulrang (bo'sh) → oq (bor) → accent (joriy) → yashil (yopildi / sig'di) → qizil (ko'rinib qoldi / oshdi). `prefers-reduced-motion` da vaqt yurmaydi, to'lqin yo'q — holatlar birdan almashadi (DE-200). 393 kenglikda vaqt chizig'i laptop ostida, hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · karta tanlansa vaqt chizig'iga uchib tushadi · topilgan joy xiralashadi va yorliq oladi · yangi qator ~1 s yashil yonadi. Bezak-harakat yo'q.
- **Yakun:** video yozildi va o'zi tekshirdi (holatga qarab) · uyga vazifa yo'q · keyingi dars — «Birinchi buyurtmani qayerdan topasiz?». <!-- TAXMIN T20 -->

---

## 0 · Kirish  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **O'zingiz haqidagi videoda yuzingiz ko'rinishi shartmi?** (54)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - boshida: 2-darsdagi video telefoningizda qoldi — bugungisini esa sizni tanimaydigan odam ham ko'rishi mumkin. (100)
  - javobdan keyin: Bugun shunday videoni o'z mahsulotingiz haqida yozasiz — «Davom etish»ni bosing. (80)
- Maket (chap; `VideoSahna` «kirish» holati): laptop brauzerida Mentor misolining lendingi — sarlavha «Mahalla futboliga jamoani bir joyda yig'ing»; ekran tepasida yozuv belgisi «0:00» (hali yurmaydi); o'ng pastki burchakda kamera joyi — kulrang doira, ichida «?»; pastda ovoz chizig'i — tekis, kulrang.
  Ramka ustida yorliq «Mentor misoli · Maydon Jamoa».
- Variantlar (radio, o'ng; bir shaklda — P-016; har birining o'z yengil chegarasi — E 40):
  - Ha — yuzsiz videoga kamroq ishonishadi (38)
  - ✔ Yo'q — ekran yozuvi va ovozim yetadi (36)
  - Ha — yuz bilan birga ism ham kerak (34)
- Javob:
  - to'g'riga: **Aynan!** Bu kursda yuz va ism — ixtiyoriy: mahsulotingizni ekran yozuvi va ovozingiz ko'rsatadi. (94)
  - 1-variantga: **Qiziq fikr!** Yuz bilan ham yozsa bo'ladi. Bu kursda esa yuz — ixtiyoriy: buni ota-onangiz bilan hal qilasiz. (107)
  - 3-variantga: **Qiziq fikr!** Ko'p videoda ism ham, yuz ham bor. Bu kursda ikkalasi ixtiyoriy: ekran va ovoz yetadi. (98)
- **Harakat → Vizual o'zgarish:** variant tanlanadi → tanlangan variant accent chegara bilan qotadi (ixcham qator bo'lib qoladi — SABOQ 11) → kamera joyi uzuq doiraga aylanadi, ostida kulrang yorliq «yuz — ixtiyoriy» → ovoz chizig'ida to'lqin yuradi, yorliq «ovoz» → yozuv belgisidagi vaqt bir necha soniya yuradi va to'xtaydi. Sahna har uch tanlovda bir xil o'zgaradi (P-036: javobni oldindan ochmaydi, keyin ko'rsatadi).
- Ballsiz (J-026: `correct: false` hammaga; jonli darsda sinf ovozlari chizig'i — har variant va ovozlar soni, ism yo'q). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (navbatma-navbat to'lqin) → «Davom etish» (halqa).
- O'qituvchi eslatmasi: Sinfdan so'rang: «2-darsdagi videoni ko'rganingizda birinchi nimani sezdingiz?» Javobni sanamang. 2-darsdagi video telefonda qoldi; bugungisi qolmasligi mumkin — shuning uchun yuz, ism va kim ko'rishi dars boshidayoq aytiladi. <!-- TAXMIN T12 -->
- ✎ Hook — o'quvchining o'z tajribasi (2-darsda o'zini videoga yozgan, tayanch 1.2) va o'smirning birinchi xavotiri (kameraga chiqishim shartmi?) (P-016: aniq narsa + o'z ishi). ✔ — tayanch 1.9 qoidasi: «yuz va ism — ixtiyoriy» (T12). Payoff boshqa variantlarni yolg'onga chiqarmaydi: yuz bilan yozish mumkin, faqat shart emas (KORPUS §119). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). Javob Mentor gapida oldindan aytilmaydi. <!-- TAXMIN T12 -->

## 1 · Reja  ← QReja (172: tayyor natija + 3 qator; teg yo'q)
- Eyebrow: Reja
- Sarlavha: **Bugun o'zingiz va mahsulotingiz haqida video yozasiz.** (53)
- Mentor: Avval nima aytishingizni yozasiz, keyin ekran yozuvi bilan aytasiz; Mentor misoli «Yordam»da turadi. (100)
- Chap — kulrang yorliq «ssenariy, ekran yozuvi va havola» (App.jsx osti so'zma-so'z, P-015) + vizual (`VideoSahna`, tayyor holat, bir marta o'zi yuradi — DE-200): vaqt chizig'idagi uch bo'lak joyi navbat bilan chiziladi (nomsiz — nomlari 2-ekranda), yozuv belgisidagi vaqt 3:00 gacha yuradi, oxirida o'ngda fayl kartasi «video · fayl» paydo bo'ladi.
- O'ng — bugungi uch ish (tex-karta «01 · matn», bosilmaydi; teg yo'q — 172):
  - 01 · Video ssenariysini yozasiz
  - 02 · Ekran yozuvi bilan videoni yozasiz
  - 03 · Videoni tekshirib, kim ko'rishini hal qilasiz
- Pastki qator (mono, kichik): Bugun kod o'zgarmaydi: video repo'ga qo'shilmaydi · Mentor misoli `maydon-jamoa` · namuna `m14-dars-09-done` <!-- TAXMIN T4 -->
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; videoni o'z mahsulotingiz haqida yozasiz.
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Video — o'quvchining shaxsiy ma'lumoti: yuz, ism, ovoz. Yuz va ism — ixtiyoriy; video hamma ko'radigan joyga joylanmaydi; havola — faqat ota-ona roziligi bilan va faqat «faqat havola bilan ko'rinadigan joy»ga; havola hech qayerga yozilmaydi. <!-- TAXMIN T12 -->
  Ota-ona roziligi qanday olinishi — maktab tartibida (TAYANCHGA SAVOL 6); darsda o'quvchi o'zi belgilaydi, Mentor uning yoki ota-onasi nomidan tasdiqlamaydi. Rozilik bo'lmasa ham dars to'liq o'tadi: video kompyuterda fayl bo'lib qoladi.
  Ovoz: 12–15 o'quvchi bir xonada bir vaqtda gapirsa, ovozlar bir-biriga tushadi — imkon bo'lsa Amaliyot 2 ni navbat bilan (3–4 kishidan) qiling, qolganlar shu payt Amaliyot 1 dagi ovoz chiqarib o'qishni tugatadi yoki navbatini kutib, ekranini tayyorlaydi (⛔ pilotda ko'riladi).
  Ekran yozish vositasining nomi va tugmalari bu darsda yozilmagan (⛔ pilotda — sinf kompyuterlarida tekshiriladi); ishlamasa — telefonning ekran yozuvi (11-Modul zaxirasi). O'quvchi videolarini proyektorga chiqarmang; kim yuzi bilan yozgani sanalmaydi. Uyga vazifa yo'q.
- ✎ Sarlavha — natija va'dasi (P-014); yangi atama yo'q (T-011: «video-portfolio» — 2-ekranda tug'iladi). «mahsulotingiz» — o'quvchida bor (T-039). Uch qator App.jsx ostining uch so'ziga mos (ssenariy · ekran yozuvi · havola); «uch bo'lak» — 2-ekran kashfiyoti, reja aytmaydi (P-015).

## 2 · Videoga nima sig'adi?  ← QTushuncha (bashorat + 6 karta, bittadan — SABOQ 9, E 53)
- Eyebrow: Tushuncha · uch bo'lak
- Sarlavha: **3 daqiqalik videoga nima sig'adi?** (33)
- Mentor (bosqichga qarab, har biri bitta gap):
  - harakat paytida: Har kartani o'qing va «Videoga» yoki «Videoga emas»ni bosing. (61)
  - tugagach: Natijani taxminingiz bilan solishtiring. (40)
  (Birinchi harakat — bashorat; yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — o'sish tartibida): **Oltita kartadan nechtasi videoga kiradi?** · Ikkitasi · Uchtasi · To'rttasi — tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi; kartalar shundan keyin ochiladi.
- Vizual (≤ 3 blok: karta · vaqt chizig'i · natija): **tepada** — joriy karta («Karta n / 6»; ichida matn va kulrang taxminiy vaqt «≈ m:ss · bu mashqda»), ostida ikki tugma «Videoga» · «Videoga emas» · **pastda** — vaqt chizig'i 0:00–3:00 (bo'sh, uch bo'lak joyi uzuq chiziqda).
- Kartalar (shu tartibda; bitta manba `KARTALAR_UCH`; ✔ — «Videoga»):
  1. Men kimman — bir gap (20) · ≈ 0:20 · ✔ Videoga
  2. Ilovadagi hamma funksiyalar ro'yxati (36) · ≈ 2:00 · Videoga emas
  3. Maktabim, sinfim va telefon raqamim (35) · ≈ 0:10 · Videoga emas
  4. Bitta lahza va ishlayotgan demo (31) · ≈ 1:50 · ✔ Videoga
  5. Keyingi oyda qo'shiladigan funksiyalar (38) · ≈ 0:40 · Videoga emas
  6. Bitta qarorim va uning sababi (29) · ≈ 0:50 · ✔ Videoga
- **Harakat → Vizual o'zgarish:**
  - to'g'ri «Videoga» → karta kichrayib vaqt chizig'iga uchib tushadi va o'z joyini egallaydi (accent, ichida vaqt); keyingi karta kiradi.
  - to'g'ri «Videoga emas» → karta kulrang bo'lib chetga suriladi, ostida kichik yorliq qoladi (2 — «ro'yxat», 3 — «shaxsiy ma'lumot», 5 — «hali yo'q»); keyingi karta kiradi.
  - xato «Videoga» (2, 3, 5-karta) → kartaning vaqti chiziqqa qizil bo'lak bo'lib tushadi: 2-kartada chiziq 3:00 dan oshib ketadi, 3-kartada bo'lak ustida qulf chizig'i, 5-kartada bo'lak uzuq va kulrang («hali yo'q»); bir lahzadan keyin bo'lak qaytib chiqadi, tugma silkinadi, bitta `QXato`:
    - 2: Ro'yxat — hikoya emas. Vaqt chizig'iga qarang. (46)
    - 3: Bu shaxsiy ma'lumot. Videoni ko'rgan odamga kerakmi? (52)
    - 5: Video faqat bor narsani ko'rsatadi. Bu funksiya bormi? (54)
  - xato «Videoga emas» (1, 4, 6-karta) → chiziqdagi o'sha bo'lak joyi bir lahza qizil uzuq chiziq bilan yonadi (bo'sh qoladi), bitta `QXato`:
    - 1: Sizni tanimagan odam kim gapirayotganini biladimi? (50)
    - 4: Demosiz nima qurganingiz qanday ko'rinadi? (42)
    - 6: Qanday ishlashingizni videoda nima ko'rsatadi? (46)
  - 6/6 dan keyin: kartalar va tugmalar yopiladi; vaqt chizig'idagi uch bo'lakka nomlari yoziladi (navbat bilan, ~1 s yashil): **Kimman · 0:20** · **Nima qurdim · 1:50** · **Qanday ishlayman · 0:50** — chiziq 3:00 da to'liq tugaydi.
  - Holat o'quvchi bosgan tartibdan chiziladi (P-046).
- Natija (bitta blok — E 42; `tugadi`: harakat paneli yopiladi, vaqt chizig'i va laptop butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: uchtasi».
- Xulosa: Bu misolda 3 daqiqaga uch bo'lak sig'di: kimman, nima qurdim va qanday ishlayman. (81)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): O'zingiz va mahsulotingiz haqidagi 3 daqiqalik video — video-portfolio deyiladi. (80) — atama shu yerda tug'iladi (T-011) <!-- TAXMIN T19 -->
- Tugma (pastki): Avval belgilang → Kartalarni ajrating (N/6) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Bu karta sizni tanimagan odamga nimani ko'rsatadi? (50)
- Keyingi bosiladigan joy: bashorat variantlari → «Videoga» · «Videoga emas» (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Fits Three (oltita karta birinchi urinishda).
- O'qituvchi eslatmasi: Vaqtlar — bu mashqdagi reja (0:20 · 1:50 · 0:50), o'lchov emas: o'quvchi o'z vaqtini Amaliyot 1 da taymer bilan ko'radi. 2-karta — 2-darsdagi qoida (funksiyalar ro'yxati — hikoya emas). 3-karta — maktab, sinf va telefon videoga kerak emas; ism esa ixtiyoriy (0-ekran).
- ✎ Bitta g'oya (P-008): 3 daqiqaga uch bo'lak sig'adi (tayanch 1.9). Distraktor kartalar uch xil: ro'yxat (2-dars qoidasi) · shaxsiy ma'lumot (TAQIQLAR 3) · va'da (TAQIQLAR 2: «faqat bor narsa»). Kartalardagi vaqtlar — mashq kartasi (Mentor o'lchovi emas — TAYANCHGA SAVOL 2). ✔ kartalar tartibi aralash (1, 4, 6), vaqt chizig'iga esa o'z tartibida tushadi.
  «Kimman · Nima qurdim · Qanday ishlayman» — nomlar harakatdan keyin chiziqda paydo bo'ladi (T-011); sarlavhada yangi atama yo'q. Bashorat — bitta o'lchovning uch darajasi (S-015).

## 3 · Amaliyot 1 — ssenariy  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 1 · o'z mahsulotingiz
- Sarlavha: **Uch bo'lakni o'z mahsulotingiz haqida yozing.** (45)
- Mentor: Har bo'lak — bitta karta, namuna «Yordam»da; «1 · Ochish»dan boshlang. (70)
- Vazifa (qadamlar ustida, bitta qator): Kimman, Nima qurdim va Qanday ishlayman — har biri o'z gapingiz bilan, ovoz chiqarib o'qilganda 3 daqiqaga sig'sin. (115)
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi; hammasi o'z mahsulotingiz haqida):
  1. **Ochish** — demo yo'lingizni laptop brauzerida oching (mobil trekda — ilovaning brauzer ko'rinishi, web-trekda — saytingiz). Uni videoda ko'rsatasiz. <!-- TAXMIN T8 -->
     Bu videoni sizni tanimaydigan odam ko'rishi mumkin: u sizni ham, mahsulotingizni ham birinchi marta ko'radi. Shuning uchun har bo'lak qisqa va aniq bo'ladi.
     Kulrang qator (faqat `pm-m12d2-hikoya` bo'lsa): 2-darsdagi hikoyangiz «Nima qurdim» kartasiga oldindan yozildi. (63)
  2. **Uch bo'lak** — chapda bitta katta karta (joriy bo'lak; tepada raqamli doiralar 1/2/3: Kimman · Nima qurdim · Qanday ishlayman — joriy accent, tayyori ✓). Yorliq input ichida (E 43):
     - **1 · Kimman** — placeholder Kim ekaningiz va nima qilishingiz — bir gap (43); karta ostida kulrang qator: Ismingizni bu yerga yozmang: xohlasangiz, videoda o'zingiz aytasiz. (67)
     - **2 · Nima qurdim** — placeholder Qaysi lahza o'zgardi va demoda nimani bosasiz? (46); oldindan: `pm-m12d2-hikoya` dan lahza va o'zgarish, `pm-m12d6-demo.stsenariy` dan demo qadamlari (ikkalasi tahrirlanadi; yonida kulrang yorliq «2-darsdan olindi» / «6-darsdan olindi»).
     - **3 · Qanday ishlayman** — placeholder Qaysi qarorni qildingiz va nega? (32)
     Karta ostida tugmalar bir qatorda: «Keyingi bo'lak» (asosiy; uchinchi kartada — «Tayyor») · o'ngda «Yordam».
     Yordam (bosilsa ochiladi) — Mentor misoli (A-4, `MENTOR_SSENARIY`), uchala bo'lak to'liq, har biri ostida ekranda nima ko'rinishi (lending · ilova · «O'yinlar»).
     Tekshiruv (`QXato`, «Keyingi bo'lak» / «Tayyor» bosilganda; PM-108 tartibida kamida 8 namuna bilan sinaladi — KOD 7):
     - bo'sh (bloklaydi): Bu bo'lakni bir gap bilan yozing. (33)
     - «Kimman»da 7 va undan ko'p raqam ketma-ket yoki «maktab» so'zi (yumshoq): Maktab va telefon videoga kerak emas — olib tashlang. (53)
     - «Nima qurdim»da beshdan ko'p vergul (yumshoq): Bu ro'yxatga o'xshaydi. Bitta lahza va demo yetadimi? (53)
     - «Qanday ishlayman»da «chunki», «sababi», «uchun» va «:» yo'q (yumshoq): Qarorning sababini ham yozing: nega shunday qildingiz? (54)
     - yumshoq xatodan keyin (yorliq): Shunday qoldirsangiz — yana bosing. (35)
     **Harakat → Vizual o'zgarish:** «Keyingi bo'lak» → karta ixcham ✓ qatorga yig'ilib tepaga tushadi (bo'lak nomi · gapning boshi; SABOQ 17, 29) va o'ngdagi vaqt chizig'ida o'sha bo'lak joyi oq bo'ladi; keyingi karta kiradi. Ixcham qator ✎ bilan qayta ochiladi.
  3. **Ovoz chiqarib o'qish** — «Taymer»ni bosing va ssenariyni pastroq ovozda o'qing; «Nima qurdim»da demo yo'lini bir marta bosib chiqing. Har bo'lak tugaganda chapdagi bo'lakni bosing (1 → 2 → 3).
     **Harakat → Vizual o'zgarish:** bo'lak bosilganda vaqt chizig'ida u o'z uzunligida chiziladi (o'quvchining vaqti); 3:00 dan oshsa — oshgan qism `err`. Oxirida bir qator (holatdan):
     - sig'di: 3 daqiqaga sig'di. (18)
     - oshdi: 3 daqiqadan oshdi — eng uzun bo'lakni qisqartiring va yana o'qing. (66)
     Taymer vaqti saqlanmaydi — bu mashq; videoning haqiqiy vaqti — Amaliyot 3 da.
  4. **Tayyor ssenariy** — uch bo'lak bitta kartada; «Saqlash» → `pm-m12d9-video.bolaklar` (A-12). Ostida kulrang qator: Ssenariyni qog'ozga yozib oling yoki telefoningizda oching: yozish paytida dars oynasi ekranda turmasin. (104)
     Karta ostida «Nusxalash» (matn telefonga yoki boshqa joyga o'tkazish uchun).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok): Mentor misolining ssenariy kartasi — uch bo'lak (A-4 aynan) va har biri yonida ekranda nima ko'rinishi; ostida vaqt chizig'i — bu mashqdagi reja 0:20 · 1:50 · 0:50 (yorliq «reja · bu mashqda»). Mentorning o'qish vaqti — ⛔ pilotda (`{…}`).
- Hammasi bajarilgach (yashil): Ssenariy yozildi va ovoz chiqarib o'qildi. (42)
- Pastki qator (kichik; darsda bir marta — tayanch 3): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-09-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. Bugun kod o'zgarmaydi — namuna faqat ko'rish uchun; videoni o'z mahsulotingiz haqida yozasiz. <!-- TAXMIN T4 -->
- Ulgurmasangiz: «Qanday ishlayman»ni bitta gap qiling; ovoz chiqarib o'qishni yozishdan oldin bir marta qiling. «Davom etish» 2-qadamdan keyin ochiladi (uch bo'lak yozilgach). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: ssenariy — o'quvchining o'z mahsulot qarori (sinf 13): Mentor misoli faqat «Yordam»da. «Kimman»ga ism yozilmaydi — kalit shartnomasi (sinf 3, tayanch 8). Ovoz chiqarib o'qish — 3 daqiqani o'quvchi o'zi taymer bilan ko'radi (MD_TOPSHIRIQ_2 9-band). «Ortda qoldingizmi» — tayanch 3 qoidasi; bu darsda kod yo'q, shuning uchun gapi halol: namuna faqat ko'rish uchun.
  Ssenariyni qog'ozga ko'chirish — yozish paytida dars oynasi (va undagi ism bo'lishi mumkin bo'lgan formalar) ekran yozuviga tushmasin. «daftar» so'zi ishlatilmadi.
- O'qituvchi eslatmasi: Eng ko'p uchraydigan holat — «Nima qurdim» funksiyalar ro'yxatiga aylanadi: «Qaysi lahzani o'zgartirdingiz?» deb so'rang. «Qanday ishlayman»da qaror bo'lmasa — «Nimani qilmaslikka qaror qildingiz?» deb so'rang (Mentor misoli shunday).

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Kitob almashish ilovangiz videosida «Qanday ishlayman» bo'lagiga qaysi gap mos?** (79)
  - A · Ilovada uch narsa bor: qidiruv, chat, xarita (44)
  - B · Keyingi oyda kitob yetkazish ham qo'shiladi (43)
  - C · ✔ Xaritani qo'shmadim: kitob sinfda almashiladi (45)
  - D · Ilovani 12 ta sinfdoshim ishlatadi va maqtaydi (46)
- Kalit: **C** (index 2). To'rttalasi bir shaklda (bitta gap, nuqtasiz); tire va qavs hech birida yo'q; «:» — A va C da (belgi faqat to'g'rida emas); «xarita» — A va C da; uzunlik — «O'lchov».
  Distraktorlar uch xil turkum (sinf 8): A — funksiyalar ro'yxati (2-dars qoidasi) · B — va'da (faqat bor narsa) · D — foydalanuvchilar haqida da'vo va maqtov (qaror emas).
- To'g'ri izohi: Qaror va uning sababi qanday ishlashingizni ko'rsatadi. (55)
- Xato izohlari (≤60):
  - A: Bu — funksiyalar ro'yxati. Qaysi qarorni qildingiz? (51)
  - B: Bu — va'da. Video bugun bor narsani ko'rsatadimi? (49)
  - D: Bu — ilovani kim ishlatishi. Qaror qayerda? (43)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): vaqt chizig'ida «Qanday ishlayman · 0:50» bo'lagi accent bilan yonadi, ichida C gapining boshi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Real Reason — birinchi urinishda to'g'ri.
- ✎ Savol ekrandan ko'chirilmaydi (§106): 2-ekran kartalari bo'laklarni ajratdi, bu savol — bo'lak ichiga qaysi gap mos (boshqa mahsulot, P-002). «12 sinfdoshim» — D variantining o'z soni (kitob ilovasi — mashq olami), tayanchdagi son emas; S-019: savolda son yo'q.

## 5 · Yozishdan oldin  ← QTushuncha (bosib toping, 4 kadr bittadan — P-040, E 53)
- Eyebrow: Tushuncha · ekranni tayyorlash
- Sarlavha: **Yozishdan oldin ekranda nimani yopasiz?** (39)
- Mentor (bosqichga qarab, har biri bitta gap):
  - harakat paytida: Har kadrda videoni ko'rgan odam ko'rmasligi kerak bo'lgan joyni bosing. (71)
  - tugagach: Chapdagi to'rt qator — Amaliyot 2 dagi tayyorlash ro'yxatingiz. (63)
- Bashorat yo'q (P-064: kuzatuv ekrani emas — har kadrda o'quvchi o'zi topadi; bashorat 2-ekranda).
- Vizual (≤ 3 blok): **o'ngda** — `VideoSahna` laptopi, joriy **mashq kadri** («Kadr n / 4», ustida kulrang yorliq «mashq kadri · Mentor misoli»); yozuv belgisi «0:00» · **chapda** — «Yozishdan oldin» ro'yxati (bo'sh, to'rt qator joyi uzuq chiziqda) va hisoblagich «Yopiladigan joy: n / 4» (P-040).
- Kadrlar (bitta manba `MAXFIY_KADRLAR`; har kadrda bitta yopiladigan joy va bitta ko'rsatsa bo'ladigan joy):
  1. Kod oynasi: chapda fayllar ro'yxati (`backend/`, `mobil/`) · ochiq fayl `backend/.env` — ikki qator `DATABASE_URL=…` va `JWT_SECRET=…` (qiymat o'rnida kulrang chiziq).
     Topilsa: `.env` qatorlari xiralashadi, yorliq maxfiy kalit · `.env` (21) · ro'yxatga qator: Kod oynasi va `.env` yopiq (26)
  2. Brauzer: ilovaning kirish sahifasi — login maydonida yozilgan login (maketda `…`), parol nuqtalari, «Kirish» tugmasi.
     Topilsa: login maydoni xiralashadi, yorliq login (5) · ro'yxatga: Namuna akkaunt bilan oldindan kirilgan (38)
  3. Brauzerdagi ikkinchi oyna: Neon SQL Editor — `oyinchilar` jadvali, ustunlar `ism` va `login` (qiymatlar kulrang chiziq).
     Topilsa: jadval xiralashadi, yorliq boshqa odamlarning ma'lumoti (28) · ro'yxatga: Neon va boshqa jadvallar yopiq (30)
  4. Demo ekrani («O'yinlar», «Shanba, 18:00 · Mahalla maydoni · 8 / 10») va burchakda chiqib turgan xabar oynasi «Sinf chati» (ikki kulrang qator).
     Topilsa: xabar oynasi xiralashadi, yorliq yozishma (8) · ro'yxatga: Chat va pochta oynalari yopiq (29)
- **Harakat → Vizual o'zgarish:** yopiladigan joy bosiladi → o'sha joy xiralashadi va `ok` chegarali yorliq oladi; chapdagi ro'yxatga yangi qator ~1 s yashil yonib tushadi; hisoblagich «n / 4» o'sadi; keyingi kadr kiradi.
  Ko'rsatsa bo'ladigan joy bosilsa (1 — fayllar ro'yxati, 2 — «Kirish» tugmasi, 3 — sahifa sarlavhasi «SQL Editor», 4 — demo ekrani) → o'sha joy bir lahza kulrang ramka oladi, bitta `QXato`: Buni ko'rsatsa bo'ladi. Kimga zarar beradigan joy qaysi? (56)
  4/4 dan keyin: kadr yopiladi; laptopda toza ekran — faqat demo yo'li; chapda to'rt qatorli ro'yxat to'liq, butun enga.
- Natija (bitta blok — E 42; `tugadi`, ⛶): yashil xulosa qutisi.
- Xulosa: Bu misolda to'rt joy yopildi: maxfiy kalit, login, odamlar jadvali va chat. (75)
- `QIzoh` (qutining oxirgi kichik qatori): Yozuvga tushgan narsa video faylida qoladi — shuning uchun ekran yozishdan oldin tayyorlanadi. (94)
- Tugma (pastki): Joylarni toping (N/4) → Davom etish
- Ipucha (40 s): Bu kadrda qaysi yozuv faqat sizga tegishli? (43)
- Keyingi bosiladigan joy: joriy kadr (laptop ramkasi yengil to'lqinda) → «Davom etish».
- Nishon: Clean Screen (to'rt kadr birinchi urinishda — ko'rsatsa bo'ladigan joy bosilmagan).
- O'qituvchi eslatmasi: Kadrlar — mashq kadri, Mentorning haqiqiy yozuvi emas. 2-kadr — login ko'rinmasligi uchun demo yo'liga namuna akkaunt bilan **oldindan** kiriladi (6-darsdagi namuna akkaunt). 3-kadr — Neon'da haqiqiy foydalanuvchilarning ismi va logini bor: u oyna yozish paytida yopiq.
  Ovoz ham yozuvga tushadi: maktab, telefon, manzil aytilmaydi (Amaliyot 3 da tekshiriladi).
- ✎ Bitta g'oya (P-008): ekranda nima tursa, video faylida shu qoladi — yozishdan oldin tayyorlanadi (TAQIQLAR 1: maxfiy kalit, `.env`, login, boshqa odamlarning ma'lumoti va yozishmasi). To'rt kadr — `MAXFIY_ROYXAT` ning to'rt qatori (P-063: Amaliyot 2 1-qadam va Amaliyot 3 2-qadam shu const dan).
  «Bosib toping» — o'quvchi nechtasini izlashini biladi (P-040). 3-kadrda ilova ekrani emas, Neon jadvali: ilovada ismlar qayerda ko'rinishi tayanchda yo'q (Shubhali 7). «Kimga zarar» — xato izohi savol shaklida, javobni aytmaydi (S-010).

## 6 · Amaliyot 2 — yozish  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈25 daq)
- Eyebrow: Amaliyot 2 · o'z videongiz
- Sarlavha: **Ekranni tayyorlab, videoni ssenariy bo'yicha yozing.** (52)
- Mentor: Avval to'rt joyni yopasiz, keyin yozasiz; «1 · Tayyorlash»dan boshlang. (71)
- Vazifa (qadamlar ustida, bitta qator): Ekranda faqat demo yo'li; ssenariy qog'ozda yoki telefonda; video fayl repo papkasidan tashqarida. (98)
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Tayyorlash** — chapda ro'yxat (`MAXFIY_ROYXAT`, to'rt qator; har birini bosib ✓ qiling):
     (1) Kod oynasi va `.env` yopiq · (2) Namuna akkaunt bilan oldindan kirilgan · (3) Neon va boshqa jadvallar yopiq · (4) Chat va pochta oynalari yopiq.
     Keyin: Backend'ni 6-darsdagidek bitta so'rov bilan uyg'oting (bepul Backend uxlab qolgan bo'lsa, birinchi ochilish bir daqiqagacha cho'zilishi mumkin). Demo holatini boshiga qaytaring (Mentor misolida — o'yindan chiqish: yana «8 / 10»).
     Demo yo'li: mobil trekda — ilovaning brauzer ko'rinishi, web-trekda — saytingiz; laptop brauzerida, namuna akkaunt bilan. <!-- TAXMIN T8 -->
     2-qatordagi namuna akkaunt yo'q bo'lsa — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: Database — faqat o'zing ochadigan namuna akkaunt va uning yozuvlari. Kod va fayllarni o'zgartirma.
     > Nima qilsin: video uchun bitta namuna akkaunt och: namuna ism va login bilan, haqiqiy emas, foydalanuvchilar sanog'iga tushmaydigan. Loginini ayt. Shu akkauntdan {demo uchun namuna} tayyorla. Qaysi yozuvlarni yaratganingni `id` lari bilan ayt.
     > Nima buzilmasin: kod, `.env` va haqiqiy foydalanuvchilarning hisoblari va yozuvlariga tegma. Nima o'zgartirganingni ayt.
     Qavs yonida kulrang namuna (Mentor misolidan): {demo uchun namuna} — «masalan: namuna o'yinchilar bilan «Shanba, 18:00 · Mahalla maydoni» o'yini, 8 / 10».
     Mahsulot ochilmasa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat, yangi narsa qo'shma.» Vaqt yetmasa — «Nima qurdim» bo'lagida 6-darsdagi B reja videongizni ekranda ochib ko'rsatasiz.
     Ssenariy — qog'ozda yoki telefonda (Amaliyot 1, 4-qadam); dars oynasini yozishdan oldin yoping.
  2. **Yozish** — kompyuteringizdagi ekran yozish vositasini oching va ovoz (mikrofon) yozilishini yoqing. Kamera — faqat ota-onangiz rozi bo'lsa; bo'lmasa o'chiq qoladi. Ismni aytish — ixtiyoriy. <!-- TAXMIN T12 -->
     Yozishni boshlang va ssenariy bo'yicha ayting: «Kimman» (ekranda — lending yoki bosh sahifa) → «Nima qurdim» (lahza, keyin demo yo'li) → «Qanday ishlayman». Vaqtni telefoningizdagi taymer yoki vositaning o'z hisoblagichi bilan kuzating.
     Adashsangiz — to'xtamang, gapni qaytadan ayting; boshidan yozish — faqat vaqt qolsa.
     Kompyuterda ekran yozish ishlamasa — telefoningizning ekran yozuvi bilan yozing: demo yo'lini telefon brauzerida oching (11-Modulda ekran videosini shunday yozgansiz).
  3. **Video fayl** — videoni repo papkangizdan tashqaridagi papkaga saqlang. Repo papkasida terminalda `git status` — video fayl ro'yxatda ko'rinmasligi kerak; ko'rinsa — faylni repo'dan tashqariga ko'chiring va `git status` ni qayta ko'ring.
     Video hech qayerga yuklanmaydi — hozircha faqat kompyuteringizda. Belgilang: **«Video saqlandi»** · **«Yozolmadim»** → `pm-m12d9-video.bor`.
  4. **Birinchi ko'rish** — video faylni oching va birinchi 20 soniyani ko'ring: ovozingiz eshitiladimi, ekran o'qiladimi? Tanlang: **«Ovoz va ekran bor»** · **«Ovoz yo'q»**.
     «Ovoz yo'q» bo'lsa — kulrang qator: Vositada mikrofon yoqilganini tekshirib, qayta yozing. (54) To'liq tekshiruv — Amaliyot 3 da.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki blok; bir marta o'zi yuradi): laptop — yozuv belgisi va vaqt yuradi; kadrlar navbat bilan: lending → «O'yinlar» → «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «Qo'shilaman» → «9 / 10» → «O'yinlar»; vaqt chizig'ida uch bo'lak yonadi · ostida fayl kartasi «video · fayl · repo papkasidan tashqarida» va terminal kartasi — `git status` natijasida video fayl yo'q.
  Mentor videosining haqiqiy uzunligi va kadrlari — ⛔ pilotda (`{…}`). Web-trekda — o'sha, brauzerda sayt.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - «Video saqlandi» va «Ovoz va ekran bor»: Video yozildi va repo papkasidan tashqarida saqlandi. (53)
  - «Yozolmadim» yoki «Ovoz yo'q»: Video hali tayyor emas — qaysi qadamda to'xtaganingiz belgilandi. (65)
- Ulgurmasangiz: video bir marta yozilsa yetarli; qayta yozish — faqat Amaliyot 3 tekshiruvidan keyin, kerak bo'lsa. «Davom etish» 3-qadamdan keyin ochiladi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: ekranni tayyorlash — 5-ekranning to'rt qatori (P-063). Agent faqat namuna akkaunt uchun (sinf 10 — o'quvchi o'zi yozadi va o'zi ko'rib tekshiradi). Namuna akkaunt — 6-dars A2 dan; bu yerda faqat yo'q bo'lsa (TAYANCHGA SAVOL 7).
  Video repo'ga qo'shilmaydi (tayanch 3, 1.6) — `git status` bilan o'quvchi o'zi ko'radi; `.gitignore` ga yozish talab qilinmaydi (repo o'zgarmaydi — `-done` = `-start`). Ekran yozish vositasi nomi yo'q (⛔ — sinf 2). Kamera — ota-ona roziligi bilan (T12).
- O'qituvchi eslatmasi: Ovoz — navbat bilan (1-ekran eslatmasi). Ba'zi kompyuterlar ekran yozishdan oldin ruxsat so'raydi — bu ⛔ pilotda ko'riladi; ruxsat oynasi chiqsa, o'quvchiga yordam bering. Video fayl katta bo'lishi mumkin — kompyuterda joy borligini darsdan oldin tekshiring.

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (yorliqsiz — SABOQ 6)
- Savol: **Yozishni boshlamoqchisiz, ekranda `.env` ochiq turibdi. Nima qilasiz?** (69)
  - A · Avval yozaman, o'sha joydan esa tez o'taman (43)
  - B · ✔ Avval faylni yopaman, keyin yozishni boshlayman (47)
  - C · Agentdan videodagi kalitni yashirishni so'rayman (48)
  - D · Yozaman, videoni faqat sinfdoshimga yuboraman (45)
- Kalit: **B** (index 1). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); tire va qavs yo'q; «Avval» A va B da, «yozaman» A va D da (kalit so'z faqat to'g'rida emas); uzunlik — «O'lchov»; to'g'ri javob yolg'iz eng uzun emas.
  Distraktorlar uch xil turkum (sinf 8): A — tez o'tkazish (kadr faylda qoladi) · C — keyin yashirish (kalit allaqachon faylda; agentga tayanish) · D — tanish odamga yuborish (kalit baribir ko'rinadi).
- To'g'ri izohi: Yozuvga tushmagan narsa videoda ham ko'rinmaydi. (48)
- Xato izohlari (≤60):
  - A: Tez o'tsa ham kadr faylda qoladi. Undan oldin-chi? (50)
  - C: Kalit yozuvga tushgach, u faylda bor. Undan oldin-chi? (54)
  - D: Sinfdoshga ham kalit ko'rinadi. Yozishdan oldin-chi? (52)
- Javob topilgach (kichik): laptop maketida `.env` oynasi yopiladi, faqat demo yo'li qoladi, yozuv belgisi yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- ✎ Yangi vaziyat (§106): 5-ekranda o'quvchi joyni topdi; bu savol — topgach nima qilinadi (yozishdan oldin yopish) va nega keyin tuzatib bo'lmaydi. Distraktorlar hayotda rost bo'lib qolmaydi: C — video ichidagi kalit faylda qoladi, D — tanish odam ham boshqa odam (TAQIQLAR 1).
  Arena 5 (chat oynalari) va arena 10 (tekshiruvda ko'rinib qoldi) bilan kalit ibora takrorlanmaydi (S-008).

## 8 · Amaliyot 3 — tekshirish va havola  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq)
- Eyebrow: Amaliyot 3 · o'z tekshiruvingiz
- Sarlavha: **Videoni o'zingiz ko'rib, kim ko'rishini hal qiling.** (51)
- Mentor: Videoni boshidan oxirigacha o'zingiz ko'rasiz — bu tekshiruv sizniki; «1 · Ko'rish»dan boshlang. (96)
- Vazifa (qadamlar ustida, bitta qator): Videoda maxfiy narsa yo'q, u 3 daqiqaga sig'adi va kim ko'rishini siz ota-onangiz bilan hal qilasiz. (100) <!-- TAXMIN T12 -->
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ko'rish** — videoni boshidan oxirigacha bir marta ko'ring (2-darsdagidek). Shoshilmang: shubhali joyda to'xtatib qarang.
  2. **Maxfiy joylar** — chapda besh qator (`MAXFIY_ROYXAT` + ovoz qatori); har biriga tanlang:
     (1) Maxfiy kalit va `.env` — «Ko'rinmadi» · «Ko'rindi» · (2) Login — «Ko'rinmadi» · «Ko'rindi» · (3) Boshqa odamlarning ismi va ma'lumoti — «Ko'rinmadi» · «Ko'rindi» ·
     (4) Chat va boshqa yozishmalar — «Ko'rinmadi» · «Ko'rindi» · (5) Maktab, telefon, manzil (ovozda ham) — «Aytilmadi» · «Aytildi».
     Birortasi «Ko'rindi» yoki «Aytildi» bo'lsa — kulrang qator: Bu videoni hech kimga yubormang va o'chiring; ekranni tayyorlab, qayta yozing. (78) → Amaliyot 2 ga qaytish tugmasi «Qayta yozish»; qayta yozilgach — shu qadam qayta belgilanadi.
     → `pm-m12d9-video.tekshiruv.maxfiyYoq`.
  3. **Vaqt** — video oynasida yozilgan uzunlikni ko'ring. Tanlang: **«3 daqiqagacha»** · **«3 daqiqadan oshdi»** → `tekshiruv.sigdi`.
     Oshgan bo'lsa — kulrang qator: Qaysi bo'lak uzun chiqdi? Vaqt bo'lsa, o'shani qisqartirib qayta yozing. (72)
  4. **Kim ko'radi** — tanlang: **«Ota-onam rozi»** · **«Hali gaplashmadim»**. <!-- TAXMIN T12 -->
     - «Ota-onam rozi»: Videoni ota-onangiz bilan tanlagan, faqat havola bilan ko'rinadigan joyga yuklang — hamma ko'radigan joyga emas. (112) Ostida qalin qator: **Havolani dars formasiga, sinf chatiga va repo'ga yozmang; kimga yuborishni ota-onangiz bilan hal qilasiz.**
     - «Hali gaplashmadim»: Video kompyuteringizda fayl bo'lib qoladi — bu ham tayyor natija. Kimgadir ko'rsatish — ota-onangiz roziligi bilan. (115)
     Tanlov kalitga yozilmaydi (dars holatida — A-12). Ota-onangiz roziligini Mentor bermaydi va tasdiqlamaydi.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki blok): tekshiruv kartasi — besh qator, kutilgan holat («Ko'rinmadi» / «Aytilmadi» — `ok`), vaqt qatori `{…}` (⛔ pilotda — Mentor videosining haqiqiy uzunligi) · ostida fayl kartasi: «video · fayl» → (tanlovga qarab) «faqat havola bilan» belgisi yoki «kompyuterda».
  Mentor misolida tekshiruv natijasi — ⛔ «qur» pilotida, haqiqiy videodan.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - `maxfiyYoq === true` va `sigdi === true`: Video tekshirildi: maxfiy narsa yo'q, 3 daqiqaga sig'di. (56)
  - boshqasi: Tekshiruv belgilandi — tuzatiladigan joy yozuvda turibdi. (57)
- Ulgurmasangiz: 2-qadam — eng muhimi: «Davom etish» shundan keyin ochiladi. Vaqt va havola — dars oxirida. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Self Review — 4-qadam «Bajardim»ida (natijadan qat'i nazar — tavsif qilingan ishni aytadi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tekshiruvni o'quvchi o'zi qiladi — videoni o'zi ko'radi (sinf 10). «Ko'rindi» → video yuborilmaydi va o'chiriladi (kalit faylda qolgan; tekshiruvgacha video hech qayerga ketmagani uchun kalit almashtirish talab qilinmaydi — O'qituvchi eslatmasi; TAYANCHGA SAVOL 11). Yashil xulosa — faqat ikkala tekshiruv `true` da (sinf 6).
  «Hali gaplashmadim» — to'liq tugagan yo'l (P-026, sinf 14: havola ixtiyoriy, majburiydek aytilmaydi); uyga vazifa emas. Xizmat nomi aytilmaydi (tekshirilmagan; yosh chegarasi — TAQIQLAR 1).
- O'qituvchi eslatmasi: Video yuborilgan bo'lsa-yu, unda maxfiy kalit ko'ringan bo'lsa — kalit almashtiriladi (13-Modul odati: yangi kalit `.env` da va Render'da). Tekshiruvgacha video hech qayerga ketmaydi — shuning uchun qayta yozish yetadi.
  Havola masalasida o'quvchini shoshirmang: «Hali gaplashmadim» — to'g'ri javob. Kim havola qilganini so'ramang va sanamang.

## 9 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 2 savol (skelet infrasi); 2, 5-ekranlar — ballsiz, nishon bilan; bloklar «Bajardim» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Qanday ishlayman bo'lagi» · 7 — «2 — Yozishdan oldin»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (KORPUS §61; SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ Uch blok bajarildi (faqat Amaliyot 3 4-qadami bajarilganda; aks holda yorliq yo'q) · {N}/2 to'g'ri
- Sarlavha (`pm-m12d9-video` va blok bayroqlaridan, P-046; ustunlik tartibi — yuqoridan; har holat rost — E 54, sinf 6):
  - `bor === true`, `maxfiyYoq === true`, `sigdi === true`: **Video-portfolio tayyor — o'zingiz tekshirdingiz.** (48)
  - `bor === true`, `maxfiyYoq === false` yoki `sigdi === false`: **Video yozildi — tekshiruvda tuzatiladigan joy chiqdi.** (53)
  - `bor === true`, tekshiruv to'liq emas (`null` bor): **Video yozildi — tekshiruv hali tugamagan.** (41)
  - `bolaklar` yozilgan, `bor !== true`: **Ssenariy yozildi — video hali yozilmagan.** (41)
  - hech narsa yozilmagan: **Video-portfolio ssenariysi hali yozilmagan.** (43)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5; T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 1-qator — ta'rif, T-042):
  - O'zingiz va mahsulotingiz haqidagi 3 daqiqalik video — video-portfolio. (71)
  - Video uch bo'lakdan iborat: kimman, nima qurdim va qanday ishlayman. (68)
  - Yuz va ism — ixtiyoriy: ekran yozuvi va ovoz mahsulotni ko'rsatadi. (67)
  - Yozishdan oldin `.env`, login, boshqa odamlar ma'lumoti va chat oynalari yopiladi. (82)
  - Video repo'ga qo'shilmaydi; kimga ko'rsatishni ota-onangiz bilan hal qilasiz. (77) <!-- TAXMIN T12 -->
- Uyga vazifa — yo'q (loyiha kuni; sinf 14). `uyga: null`.
- Keyingi dars — «Birinchi buyurtmani qayerdan topasiz?» <!-- TAXMIN T20 -->
- Nishonlaringiz — N/4
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- ✎ «tayyor» — faqat o'quvchi o'zi ikki tekshiruvni `true` belgilaganda (sinf 6); havola sarlavhaga kirmaydi — havola ixtiyoriy va kalitda yo'q. «hali tugamagan», «hali yozilmagan» — E 54. «Keyingi dars» qatori — App.jsx `m12-10` nomi so'zma-so'z (T-038: boshqa joyda va'da yo'q; osti — «frilans», «stajirovka» — yozilmadi: 10-darsda tug'iladi, T-011).

---

## Nishonlar (4) — inglizcha nom; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Fits Three** (2-ekran, oltita karta birinchi urinishda) — Videoga sig'adigan uch bo'lakni topdingiz (41)
- **Real Reason** (4-ekran, 1-savol birinchi urinishda) — Qaror va sababi bor gapni tanladingiz (37)
- **Clean Screen** (5-ekran, to'rt kadr birinchi urinishda) — Yozishdan oldin yopiladigan joylarni topdingiz (46)
- **Self Review** (8-ekran, Amaliyot 3 4-qadam «Bajardim» — bonus) — Videongizni o'zingiz ko'rib tekshirdingiz (41)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Self Review, ish qilingan ekranda — P-048); natija «Ko'rindi» yoki «oshdi» bo'lsa ham beriladi (tavsif tekshirishni aytadi, «toza» demaydi). 7-ekran (2-savol) nishonsiz. Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10: Fits Three · Real Reason · Clean Screen · Self Review — 0; «Three Parts» band edi — olinmadi).

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: kodsiz kartada raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
1. 1-savol (4-ekran) — «Qanday ishlayman» bo'lagi
   - 1 · Video uch bo'lakdan iborat: kimman, nima qurdim, qanday ishlayman.
   - 2 · «Qanday ishlayman» — bitta qaror va uning sababi.
   - 3 · Funksiyalar ro'yxati va va'da bu bo'lakka kirmaydi.
   - Sinfga savol: Mahsulotingizda qaysi qarorni sababi bilan ayta olasiz?
2. 2-savol (7-ekran) — Yozishdan oldin
   - 1 · Ekranda nima tursa, video faylida shu qoladi.
   - 2 · `.env`, login, boshqa odamlar ma'lumoti va chat oynalari yopiladi.
   - 3 · Shundan keyingina yozish boshlanadi.
   - Sinfga savol: Hozir ekraningizda qaysi oynani yopish kerak?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md09/olchov.py` (pastda «O'lchov»).
1. Video-portfolio nima? (2)
   - ✔ O'zingiz va mahsulot haqida 3 daqiqalik video (45)
   - Ilovaning hamma funksiyasi sanalgan uzun video (46)
   - Sinf kanali uchun 3 daqiqalik reklama videosi (45)
   - Kodni qatorma-qator tushuntiradigan uzun video (46)
2. «Kimman» bo'lagida nima aytiladi? (2, 3)
   - Maktabim va sinfimni to'liq aytib beraman (41)
   - ✔ Kim ekanim va nima qilishimni bir gapda (39)
   - Ilovadagi o'nta funksiyani sanab beraman (40)
   - Bir gapda keyingi oydagi rejamni aytaman (40)
3. Bu videoda yuz va ism qanday bo'ladi? (0)
   - Ikkalasi ham videoda bo'lishi shart (35)
   - Yuz shart, ismni aytish kerak emas (34)
   - ✔ Ikkalasi ham shart emas, ixtiyoriy (34)
   - Ism shart, yuzni ko'rsatish kerak emas (38)
4. Yozishdan oldin Backend'ni nega uyg'otasiz? (6)
   - Video sifati yaxshiroq chiqishi uchun (37)
   - Ovoz balandroq va tiniq yozilishi uchun (39)
   - Demo oynasi chiroyliroq ko'rinishi uchun (40)
   - ✔ Demo boshida uzoq kutib qolmaslik uchun (39)
5. Yozishdan oldin qaysi oynalarni yopasiz? (5, 6)
   - ✔ Chat va pochta oynalarini (25)
   - Demo ochiq turgan oynasini (26)
   - Yozish vositasining oynasini (28)
   - Lending ochiq turgan oynani (27)
6. Demoda haqiqiy foydalanuvchilar ko'rinmasligi uchun nima qilasiz? (5, 6)
   - Ular ko'ringan joydan tez o'taman (33)
   - ✔ Namuna akkaunt bilan ko'rsataman (32)
   - Haqiqiy akkauntim bilan ko'rsataman (35)
   - Videoni qisqaroq qilib yozib olaman (35)
7. Video faylni qayerda saqlaysiz? (6)
   - Repo papkasida, kod yonida (26)
   - Sinf chatida, yo'qolmasin deb (29)
   - ✔ Repo papkasidan tashqarida (26)
   - README fayli yonida, repo'da (28)
8. `git status` da video fayl ko'rindi. Bu nimani bildiradi? (6)
   - Video GitHub'ga ham yuklanib ketdi (34)
   - Video fayl ochilmaydigan bo'ldi (31)
   - Video 3 daqiqaga sig'may qoldi (30)
   - ✔ Fayl repo papkasi ichida turibdi (32)
9. Video 3 daqiqaga sig'ganini qanday bilasiz? (8)
   - ✔ Video oynasidagi vaqtni ko'raman (32)
   - Agentdan so'rab, shundan bilaman (32)
   - Ssenariy qisqa bo'lsa, sig'adi (30)
   - Fayl hajmiga qarab bilib olaman (31)
10. Tekshiruvda login ko'rinib qoldi. Nima qilasiz? (8)
    - Videoni shundayligicha qoldirib yuboraman (41)
    - ✔ O'chirib, ekranni tayyorlab, qayta yozaman (42)
    - Faqat bitta tanish sinfdoshimga yuboraman (41)
    - Parol ko'rinmadi, login ko'rinsa bo'laveradi (44)
11. Mahsulotingiz bugun ochilmadi. «Nima qurdim»da nima qilasiz? (3, 6)
    - Mentor misolini o'zimniki deb ko'rsataman (41)
    - Ochilmagan sahifani uzoq kutib turaman (38)
    - ✔ 6-darsdagi B reja videosini ko'rsataman (39)
    - B rejasiz, bu bo'lakni olib tashlayman (38)
12. Ota-onangiz rozi. Videoni qayerga joylaysiz? (8)
    - Ijtimoiy tarmoqdagi ochiq sahifamga (35)
    - Sinf kanaliga, hamma ko'rib tursin deb (38)
    - Repo'ga, havolasini README'ga yozib (35)
    - ✔ Faqat havola bilan ko'rinadigan joyga (37)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 4-ekran (qaysi gap «Qanday ishlayman»ga mos) ↔ arena 2 («Kimman») · 7-ekran (`.env` ochiq — yopish) ↔ arena 5 (chat oynalari) va arena 10 (tekshiruvda ko'rindi).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004), har savolda uch xil turkum: 1 — ro'yxat, reklama (hamma ko'radigan joy), kod · 2 — shaxsiy ma'lumot, ro'yxat, va'da · 3 — ikkalasi shart, bittasi shart (ikki tomondan) ·
  4 — video sifati, ovoz, ko'rinish (uyg'otish demoni kutishsiz qiladi — tayanch 6) · 5 — demoning o'zi, yozuv vositasi, mahsulot sahifasi · 6 — tez o'tkazish, haqiqiy akkaunt, qisqartirish · 7 — repo ichida, chat (hamma ko'radigan joy), repo'da · 8 — yuklandi deb o'ylash, fayl buzildi deb o'ylash, vaqt bilan aralashtirish ·
  9 — agent, taxmin, noto'g'ri o'lchov · 10 — qoldirish, tanish odamga yuborish, «login maxfiy emas» · 11 — o'zganikini o'ziniki qilish (halollik), kutish, bo'lakni tashlash · 12 — ochiq sahifa, sinf kanali, repo (havola README'da).
- **Fon so'zlari** (R-008, kodda {uz, ru}): video · ssenariy · ekran yozuvi · Kimman · Nima qurdim · Qanday ishlayman · 3 daqiqa · havola · Maydon Jamoa. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Video-portfolio nima? | O'zingiz va mahsulotingiz haqidagi 3 daqiqalik video | Uch bo'lak: kimman, nima qurdim, qanday ishlayman |
| «Kimman» bo'lagida nima aytiladi? | Kim ekaningiz va nima qilishingiz — bir gapda | Ism ixtiyoriy; maktab va telefon kerak emas |
| «Nima qurdim» bo'lagi nimadan boshlanadi? | Hikoyangizdagi bitta lahzadan | Keyin ishlayotgan demo |
| «Qanday ishlayman» bo'lagida nima aytiladi? | Bitta qaror va uning sababi | Funksiyalar ro'yxati emas |
| Videoda yuzingiz ko'rinishi shartmi? | Yo'q, ixtiyoriy | Ekran yozuvi va ovoz yetarli |
| Yozishdan oldin ekranda nimani yopasiz? | Kod oynasi va `.env`, Neon jadvali, chat oynalari | Yozuvga tushgan narsa faylda qoladi |
| Login ko'rinmasligi uchun nima qilasiz? | Namuna akkaunt bilan oldindan kirasiz | 6-darsdagi namuna akkaunt |
| Video fayl qayerda saqlanadi? | Repo papkasidan tashqarida | `git status` da ko'rinmasligi kerak |
| Video 3 daqiqaga sig'ganini qanday bilasiz? | Video oynasidagi vaqtga qaraysiz | Tekshiruvni o'zingiz qilasiz |
| Tekshiruvda maxfiy narsa ko'rindi. Nima qilasiz? | Videoni o'chirib, ekranni tayyorlab, qayta yozasiz | Hech kimga yubormaysiz |
| Videoni kimgadir ko'rsatish uchun nima kerak? | Ota-onangiz roziligi | Joy — faqat havola bilan ko'rinadigan |
| Video havolasi qayerga yoziladi? | Hech qayerga: dars formasiga ham, sinf chatiga ham, repo'ga ham | Kimga yuborishni ota-onangiz bilan hal qilasiz |
- §145: har javobdagi so'z darsda bor (video-portfolio, uch bo'lak — 2 · lahza, qaror va sabab — 2, 3, 4 · yuz va ism — 0 · yopiladigan joylar, namuna akkaunt — 5, 6 · repo papkasidan tashqarida, `git status` — 6 · vaqt, o'chirib qayta yozish, ota-ona roziligi, havola — 8).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q (1-karta — atamadan ta'rifga). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. **Skelet:** yangi fayl `src/12-Modull/VideoPortfolioLesson.jsx` — skeletdan; palitra `qolipRang('tex')`, `qolipCss(T)`. `LESSON_META.lessonId` — `m12-09-v1`, `lessonTitle` — «Video-portfolio: 3 daqiqada o'zingiz va mahsulot». App.jsx `m12-09` ga `comp: VideoPortfolioLesson` + import — «qur» bosqichida (asosiy seans; nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 475-qator). Bu agent App.jsx ga tegmaydi.
2. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary. `INLINE_KEYS`: s4 **2 (C)** · s7 **1 (B)**; 2, 5-ekran — ballsiz (`uchBolak: -1`, `maxfiy: -1`), nishon bilan; bloklar (3, 6, 8) — `practice: -1`, signal `PRACTICE_BASE + ekran`. Final tartib-mashqi yo'q (172). `narrow` — 4, 7, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s5 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2 da `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s4/s7 `QTest` (`QuestionScreen` mantig'i, DE-203) · s3/s6/s8 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s9 podium · `sflash` `QKartochka` · s11 `QYakun`.
3. **`VideoSahna`** — bitta vizual (180; qolipda yo'q, yangi): qismlar `laptop` (brauzer: manzil satri, lending / «O'yinlar» / o'yin e'loni / «Qo'shilaman»; 5-ekran oynalari — kod oynasi, kirish sahifasi, Neon jadvali, chat xabari) · `yozuvBelgisi` (doira + vaqt) · `kamera` (uzuq doira, «yuz — ixtiyoriy») · `ovoz` (to'lqin chizig'i) ·
   `chiziq` (0:00–3:00, uch bo'lak joyi, oshgan qism `err`) · `xira` (xiralashgan joy + yorliq) · `fayl` (video fayl kartasi: «kompyuterda · repo papkasidan tashqarida» | «faqat havola bilan»). Rejimlar: `kirish` · `tayyor` · `bolak` · `maxfiy` · `natija`.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: vs-karta vs-joy vs-chiziq`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Odam yuzi, ism, haqiqiy login va kalit qiymati hech bir holatda chizilmaydi; logotip yo'q (D4). 393 da hech narsa kesilmaydi (E 41).
4. **Bitta manbalar (180; A-4 aynan):** `VIDEO_BOLAKLAR` (3 × `{ id: 'kim' | 'nima' | 'qanday', nom, reja: 20 | 110 | 50, placeholder }`) · `KARTALAR_UCH` (2-ekran: 6 × `{ matn, vaqt, togri: bool, yorliq, xato }`) · `MAXFIY_KADRLAR` (5-ekran: 4 × `{ kadr, joy, yorliq, aldoqchi, qator }`) ·
   `MAXFIY_ROYXAT` (5-ekran natijasi, A2 1-qadam, A3 2-qadam: 4 qator + A3 da ovoz qatori) · `MENTOR_SSENARIY` (uch bo'lak matni va ekrandagi joy — A-4) · `NAMUNA_PROMPT` (A2 1-qadam). Ekranlar, bloklar o'ngi, Yordam, recap va kartochka shulardan o'qiydi.
5. **s0 `QKirish`:** maket — `VideoSahna` `kirish`; javobdan keyin kamera joyi uzuq doiraga, ovoz chizig'ida to'lqin, yozuv vaqti bir necha soniya yuradi (uchala tanlovda bir xil). Ballsiz (J-026). Jonli darsda — sinf ovozlari chizig'i (faqat soni).
6. **s2 `QTushuncha`:** `QBashorat` (Ikkitasi · Uchtasi · To'rttasi) → 6 karta bittadan (`KARTALAR_UCH`), ikki tugma; to'g'ri «Videoga» — karta chiziqqa uchadi; xato — chiziqda qizil bo'lak (2 — 3:00 dan oshadi, 3 — qulf chizig'i, 5 — uzuq kulrang) qaytib chiqadi + `QXato`; 6/6 — bo'lak nomlari chiziqda;
   natijada taxmin qatori + xulosa + `QIzoh` (atama); 40 s ipucha; nishon `fitsThree`. Holat bosishlar ro'yxatidan (P-046).
7. **s3 (`QBlok`, 4 qadam):** 1-qadam — kulrang qator (`pm-m12d2-hikoya` bo'lsa) · 2-qadam — uch karta ketma-ket (E 53), oldindan to'ldirish (`hikoya.lahza + ' ' + hikoya.ozgarish`; `pm-m12d6-demo.stsenariy` — bir qatorda, kulrang yorliq «6-darsdan olindi»); tekshiruvlar (bo'sh — bloklaydi; «Kimman»: `/\d{7,}|maktab/i` — yumshoq; «Nima qurdim»: vergul > 5 — yumshoq; «Qanday ishlayman»: `/chunki|sabab|uchun|:/i` yo'q — yumshoq; ikkinchi bosish o'tkazadi) — **PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi** ·
   3-qadam — dars taymeri, uch bo'lak tugmasi, vaqt chizig'ida o'quvchi vaqti (saqlanmaydi) · 4-qadam — «Saqlash» → `pm-m12d9-video.bolaklar` (`savedAt`), «Nusxalash» (ssenariy matni); «Ortda qoldingizmi» (darsda bir marta) shu blokda; «Davom etish» 2-qadamdan keyin (uchala bo'lak bo'sh emas).
8. **s6 (`QBlok`, 4 qadam):** 1-qadam — `MAXFIY_ROYXAT` to'rt qatori (bosib ✓), trek bo'yicha bir gap (`pm-m9d8-platforma.trek`; yo'q — ikkalasi), `NAMUNA_PROMPT` (`{demo uchun namuna}`, kulrang namuna) · 2-qadam — matn (vosita nomi yo'q) · 3-qadam — «Video saqlandi» / «Yozolmadim» → `bor` · 4-qadam — «Ovoz va ekran bor» / «Ovoz yo'q» (dars holatida); «Davom etish» 3-qadamdan keyin; yashil xulosa — ikki holat.
9. **s8 (`QBlok`, 4 qadam):** 2-qadam — besh qator, har biri ikki tugma → `tekshiruv.maxfiyYoq` (hammasi «yo'q» → `true`, birortasi «bor» → `false`, to'liq emas → `null`); «Ko'rindi» bo'lsa — «Qayta yozish» (s6 ga o'tadi; qaytgach 2-qadam qayta belgilanadi) · 3-qadam → `tekshiruv.sigdi` · 4-qadam — ikki tanlov (dars holatida, kalitga yozilmaydi), havola uchun maydon **yo'q** ·
   «Davom etish» 2-qadamdan keyin; nishon `selfReview` (4-qadam «Bajardim»); yashil xulosa — ikki holat.
10. **s5 `QTushuncha`:** 4 kadr bittadan (`MAXFIY_KADRLAR`), har kadrda ikki bosiladigan joy (`joy` — to'g'ri, `aldoqchi` — `QXato`); to'g'ri → xira + yorliq, chapdagi ro'yxatga qator; hisoblagich «n / 4»; 4/4 — toza laptop, ro'yxat butun enga; xulosa, `QIzoh`; 40 s ipucha; nishon `cleanScreen` (aldoqchi bosilmagan).
11. **Mentor rejimi va maxfiylik:** o'quvchilar ro'yxatida faqat signallar (A1–A3 «Bajardim», bloklar holati); o'quvchining ssenariy matni, video, tanlovlari (yuz, ota-ona, havola) Mentorga ham, proyektorga ham chiqmaydi. Kim yuzi bilan yozgani, kim havola qilgani sanalmaydi. 0-ekran — faqat variantlar soni.
12. Testlar s4/s7 — `correctIdx` 2/1 = `INLINE_KEYS`; `RECAPS` {4, 7} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {4, 7}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
   `ACHIEVEMENTS` 4 (`fitsThree`, `realReason`, `cleanScreen`, `selfReview`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
13. **s11 `QYakun`:** sarlavha — besh holat (`pm-m12d9-video` va blok bayroqlaridan; ustunlik tartibi — 11-ekran); ✓ yorliq faqat A3 bajarilganda; `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; `uyga: null`; `keyingi` — yuqoridagi matn; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50). Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. ⚠️ Qolipda yo'q (12–13-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, O'qituvchi eslatmasi, ikki tugmali tanlov, A1 ichidagi taymer — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
- Darvozalar: `npm run gates -- src/12-Modull/VideoPortfolioLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `stilsiz.py` · `lint:layout` 1280/1366/390 · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md). `{…}` qavslar — matn (prompt qavsi), JSX ifodasi emas.
- ru — uz tasdiqlangach, bir yo'la (6-RU; tayanch 10 lug'atidagi «video-portfolio» taklifi; «ssenariy», «ekran yozuvi», «Kimman · Nima qurdim · Qanday ishlayman» — RU bosqichida o'lchanadi).

## REPO — `maydon-jamoa` («qur» bosqichida; push — buyruq bilan; `m14-dars-09-start` = `m14-dars-08-done` → `m14-dars-09-done` = `-start` = `m14-dars-07-done`, tayanch 3) <!-- TAXMIN T4 -->
1. **Kod o'zgarmaydi.** Video, ssenariy va havola repo'ga yozilmaydi (tayanch 3: «08…13-done = 07-done»). README'ga ham qator qo'shilmaydi (aks holda `-done` va `07-done` bir xil bo'lmay qoladi).
2. ⛔ **Muhrdan oldin («qur» pilotida, Mentor kompyuterida — repo'da emas):** Mentor misolining videosi `MENTOR_SSENARIY` bo'yicha yoziladi (lending → brauzer ko'rinishi «O'yinlar» → «8 / 10» → «Qo'shilaman» → «9 / 10» → «O'yinlar»), namuna akkaunt bilan; uzunligi, kadrlari va tekshiruv natijasi — haqiqiy videodan (A1–A3 o'ng tomoni, `{…}`).
   Natija qanday chiqsa — shunday yoziladi (3 daqiqadan oshsa — vaqt rejasi tuzatiladi). Mentor videosi o'quvchiga berilmaydi va hech qayerga yuklanmaydi; dars maketi — chizilgan.
3. ⛔ Sinf kompyuterida: ekran yozish vositasi (nomi, mikrofon, ruxsat so'rovi, faqat bitta oynani yozish imkoni), telefonning ekran yozuvi zaxirasi, video fayl hajmi va 12–15 o'quvchi ovozi — pilotda ko'riladi.
4. Shart: teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida) — `m14-dars-09-done` = `m14-dars-07-done`.

## Manbalar (08.10.2026; o'quvchiga ko'rinmaydi)
- Dars mazmuni, uch bo'lak, video qoidasi, ekran yozish vositasi ⛔, `pm-m12d9-video` — `00-MODUL-TAYANCH.md` 1.9, 8 (aynan); teg — 3; ekran soni va shakli — 4 (T9); keyssiz — 5; video qoidasi — `00-TAQIQLAR.md` 1, 3; dastur qatori — `00-MANBA.md` 1 (9-qator: «O'zi va mahsuloti haqida 3 daqiqalik video (frilans/stajirovka uchun)»).
- Hikoya lahzasi va 2-dars videosi — tayanch 1.2 · demo yo'li, B reja, uyg'otish, namuna akkaunt — tayanch 1.6 · «8 / 10» → «9 / 10» animatsiyasi — 1.4 · boshiga qaytarish — 9.10 · «Demo Day» o'quvchi matnida yo'q — 9.13.
- Mentor «Qanday ishlayman» qarori — 13-Modul tayanchi 1.11 (roadmap: «maydon pulini bo'lishish — uzoqroqda qoldi (sabab: muammo gapidan kelmaydi)») · muammo gapi — 13-Modul tayanchi 1.0 (11-Modul so'zi) · «Kimman» — 14-Modul tayanchi 1.1 Jamoa bo'lagi.
- Lending sarlavhasi «Mahalla futboliga jamoani bir joyda yig'ing», login (telefon so'ralmaydi), `namuna` ustuni — 12-Modul tayanchi 1.1, 1.7, 9.5 · Neon SQL Editor, `oyinchilar` (`ism`, `login`) — 12-Modul tayanchi 1.7 (`POST /royxat { ism, login, parol }`).
- Telefonning ekran yozuvi — zaxira (11-Modul `16-PmPrototypePitch-v3.md`, 11-ekran va uyga vazifa ③; 12-Modul tayanchi 1.10 jonli demo zaxirasi).
- Render bepul xizmati — 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa (tayanch 6, render.com/docs/free, 06.10.2026). Yangi tashqi fakt bu darsda yo'q: ekran yozish vositalari, video xizmatlari va ularning yosh chegarasi — tekshirilmagan, darsda nomi aytilmaydi (tayanch 6 «Tekshirilmagan»).
- `git status` yangi (kuzatilmayotgan) faylni ro'yxatda ko'rsatadi — 12–13-Modul push odati (tayanch 3: «`git status` — … `.env` yo'q»).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor misolining uch bo'lagi** (A-4, `MENTOR_SSENARIY`) — tayanch 1.9 da yo'q. Kimman — 1.1 Jamoa bo'lagidan: «Men g'oyadan boshlab ishlaydigan ilovagacha mahsulot quraman, kodni agent bilan yozaman.» · Nima qurdim — 1.2 lahzasi (aynan) + demo · Qanday ishlayman — 13M 1.11 roadmap qarori:
   «Maydon pulini bo'lishishni keyinga qoldirdim, chunki muammo boshqa: o'yinchilar odam yig'ishda qiynaladi.» Muqobil (13M 1.11 Mentor javobi 1): «Pro'ni o'yinchiga emas, tashkilotchiga qo'ydim: o'yinchilar bepul qoladi — ular bo'lmasa o'yin to'lmaydi.» — pul va test rejim izohi kerak bo'lgani uchun olmadim.
2. **Vaqt rejasi 0:20 · 1:50 · 0:50** (jami 3:00) — tayanchda bo'laklar vaqti yo'q; demo 60–90 soniya (1.14) + lahza ≈20 soniya = «Nima qurdim» 1:50. 2-ekran kartalari va A1 kutilgan natijasidagi vaqt — «bu mashqda» yorlig'i bilan.
3. **`pm-m12d9-video.bor` ma'nosi** — «video bor» (A2 3-qadam) deb oldim: sxema uch blokka mos (A1 → `bolaklar`, A2 → `bor`, A3 → `tekshiruv`). Havola holati kalitga yozilmaydi (dars holatida). 10-dars xatida «video-portfolio — havola bo'lsa» kerak bo'lsa — taklif: `havola: bool | null` (havolaning o'zi emas, bor-yo'qligi).
   Kelishuv (10 MD, 08.10 o'qildi): 10-dars `bolaklar.kim`, `bolaklar.nima` va `bor === true` ni o'qiydi («Video havolasini uyda, yuborishdan oldin qo'shasiz.») — bu ma'noga mos; lekin rozilik bo'lmasa havola yo'q, shuning uchun 10-dars qatoriga «ota-onangiz rozi bo'lsa» qo'shilishi taklif.
4. **`bolaklar` uzunligi** — `kim` ≤160, `nima` ≤300, `qanday` ≤200; «Kimman»ga ism yozilmaydi (kartada kulrang qator). `bolaklar.kim` (o'quvchi o'zi) va `pm-m12d2-hikoya.kim` (hikoyadagi odam) — bir nom, ikki ma'no; kodda aralashmasligi uchun KOD 7 da ajratildi. Nom o'zgartirish kerakmi (`kimman`)?
5. **Qo'shimcha o'qish** (saboq 6): `pm-m12d6-demo.stsenariy` («Nima qurdim» demo qatori oldindan) va `pm-m9d8-platforma.trek` (A2 1-qadam). Tayanch 4/8 da 9-dars faqat `pm-m12d2-hikoya` ni o'qiydi.
6. **Ota-ona roziligi qachon va qanday** — tayanchda «ota-ona roziligi» bor, tartibi yo'q. MD: darsda o'quvchi o'zi belgilaydi («Ota-onam rozi» · «Hali gaplashmadim»), rozilik yo'q bo'lsa video fayl bo'lib qoladi — to'liq natija; kamera — faqat rozilik bo'lsa. Taklif: maktab darsdan oldin ota-onalarga xabar beradi (O'qituvchi eslatmasi). Uyga vazifa yo'q (sinf 14).
7. **Namuna akkaunt** — 6-dars A2 da tayyorlanadi (tayanch 1.6); 9-darsda bo'lmasa — agent ochadi (A2 1-qadam prompti) va u demo uchun qoladi (o'chirilmaydi). 6-dars MD si bilan kelishuv kerak (nomi, `namuna = true`, qoladimi).
8. **Videodagi demo** — 6-dars stsenariysining 1–3-qadami va 4-dars animatsiyasi («8 / 10» → «9 / 10» bitta ekranda); 4–5-qadam (ikkinchi telefon, «Hozir ko'ryapti») videoda yo'q — bitta ekran yozuvi. Ikkinchi qurilmani ham ko'rsatish kerakmi — qaror.
9. **«ssenariy» / «stsenariy» imlosi** — App.jsx `m12-09` osti va tayanch 1.9: «ssenariy»; tayanch 2, 1.6 va 06/07 MD lar: «demo stsenariysi». Bu darsda o'quvchi matnida faqat «ssenariy» (demo stsenariysi nomi bilan aytilmaydi — «6-darsdan olindi»). Taklif: modul bo'yi bitta imlo (imlo lug'atida — «ssenariy»).
10. **5-ekran to'rt kadri** — mashq kadri (Mentorning haqiqiy yozuvi emas): `.env` · login · Neon jadvali (`ism`, `login`) · chat xabari. Ilova ekranidagi ismlar o'rniga Neon jadvali olindi — ilovada qatnashchilar ismi ko'rinishi tayanchda yo'q (Shubhali 7).
11. **«Ko'rindi» bo'lsa** — video o'chiriladi va qayta yoziladi; tekshiruvgacha video hech qayerga ketmagani uchun kalit almashtirish talab qilinmaydi (O'qituvchi eslatmasida — yuborilgan bo'lsa almashtiriladi). Video kesish (montaj) — yo'q: vosita nomi tekshirilmagan.
12. **Video fayl repo papkasidan tashqarida** — `git status` bilan tekshiriladi; `.gitignore` ga video turi qo'shilmaydi (repo o'zgarmasin — `-done` = `07-done`). Qo'shish kerak bo'lsa — REPO va teg jadvali o'zgaradi.
13. **Telefonning ekran yozuvi — zaxira** (11-Modul) va **B reja videosi — mahsulot ochilmasa** «Nima qurdim»da ekranda ochib ko'rsatiladi (6-dars videosi; P-026).
14. **Ovoz va sinf shovqini** — O'qituvchi eslatmasida navbat (3–4 kishidan) taklifi; tayanchda yo'q, ⛔ pilotda ko'riladi.
15. **«ekran yozuvi» va «ekran videosi»** — 11–12-Modul va 6-dars B rejasida «ekran videosi»; bu darsda App.jsx ostidagi «ekran yozuvi» (yozish jarayoni va natijasi), B reja — «B reja videosi». Modul bo'yi bir so'z kerakmi — qaror.
16. **Nishonlar** — Fits Three · Real Reason · Clean Screen · Self Review (grep 08.10 — band emas; «Three Parts» band edi).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — Amaliyot 2 ≈ 25 daqiqa ichida: ekranni tayyorlash, Backend'ni uyg'otish, yozish (3 daqiqa + adashsa qayta), fayl va `git status`; navbat bilan yozilsa — vaqt cho'ziladi. «Qur» pilotida 12–15 o'quvchi bilan taymer; sig'masa — qayta yozish va havola tushib qoladi (yakun holati rost aytadi).
2. ⛔ **Ekran yozish vositasi** — sinf kompyuterlarida bormi, nomi, mikrofonni qanday yoqishi, ruxsat so'rovi, faqat bitta oynani yoza oladimi — pilotda. Matnda faqat umumiy so'z; A1 4-qadamda ssenariy qog'ozga — shu noaniqlik uchun.
3. ⛔ **Sinf shovqini va ovoz sifati** — bir xonada ko'p o'quvchi ovoz yozadi; quloqchin mikrofoni bo'lishi mumkin; pilotda ko'riladi.
4. ⛔ **«Faqat havola bilan ko'rinadigan joy»** — qaysi xizmat, uning sozlamasi va yosh chegarasi — tekshirilmagan; darsda nomi aytilmaydi, tanlash — ota-ona bilan. Auditor «qaysi joy?» deb so'rashi mumkin — qaror foydalanuvchida.
5. ⛔ **Mentor videosi** — uzunligi, kadrlari, tekshiruv natijasi — pilotda (REPO 2); hozir `{…}`.
6. **Video fayl hajmi** — 3 daqiqalik ekran yozuvi katta bo'lishi mumkin (disk joyi); O'qituvchi eslatmasida «joyni oldindan tekshiring». Aniq hajm aytilmadi.
7. **Ilovada qatnashchilar ismi** — «O'yin» ekranida ismlar ko'rinishi tayanchda yo'q; shuning uchun 5-ekranda «boshqa odamlarning ma'lumoti» — Neon jadvali. Ilovada ham ko'rinsa — namuna akkaunt va namuna o'yin buni yopadi (A2 1-qadam).
8. **Telefonning ekran yozuvi** — telefon modeliga bog'liq; 11-Modulda faqat uyga vazifa sifatida aytilgan; pilotda ko'riladi.
9. **Kartochkalar ekrani sarlavhasi «O'zingizni sinab ko'ring.»** — qolip (platforma) sarlavhasi, o'zgartirilmaydi; «sinab» ildizi darsda faqat shu yerda.
10. **«Kimman» tekshiruvi** — 7+ raqam yoki «maktab» so'zi — yumshoq; manzil va maktab nomi boshqacha yozilsa ushlanmaydi. Asosiy himoya — kartadagi qator va A3 5-qatori.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — sarlavha bloki va A-10 (taqsimot, ulgurmagan yo'l); har blokda «Ulgurmasangiz» (3, 6, 8-ekran); ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi (faqat videoning 3 daqiqasi — o'quvchi o'zi ko'radi).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — ekran yozish vositasi (umumiy so'z, Shubhali 2), «faqat havola bilan» joy (Shubhali 4), telefonning ekran yozuvi (Shubhali 8), Mentor videosi (REPO 2) — ⛔; tugma va menyu nomi yozilmadi; Render — tayanch 6.
3. [x] **Saqlash kaliti — shartnoma** — A-12: tayanch 8 sxemasi aynan, har maydon, tipi, `bool | null` uch holat, qaysi qadam yozadi; havola, ota-ona javobi, ism, fayl nomi yozilmaydi; «Kimman»ga ism yozilmaydi (kartada qator); boshqa darsning kaliti faqat o'qiladi (TAYANCHGA SAVOL 3, 5).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Bu misolda» (2, 5-ekran xulosalari), «bu mashqda» (vaqt rejasi), «Bu kursda yuz va ism — ixtiyoriy» (0-ekran), «mashq kadri» (5-ekran); Mentor ssenariysi faqat «Yordam»da va o'ng tomonda.
5. [x] **Kafolat va sabab da'vosi yo'q** — «tayyor» faqat o'quvchi o'zi ikki tekshiruvni belgilaganda (11-ekran); video haqida «hech kim ko'rmaydi» deyilmaydi — «tekshiruvdan oldin hech qayerga yuklanmaydi», «faqat havola bilan»; kafolat so'zlari yo'q.
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun besh holat, «hech narsa» holati alohida (11-ekran; E 54); bloklar yashil xulosasi holatga qarab (6, 8-ekran — ikkitadan); Self Review tavsifi tekshirishni aytadi; blok bajarilgani — 4-qadam «Bajardim»idan.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «3 daqiqaga sig'di» — video oynasidagi uzunlik 3:00 dan oshmagan (A3 3-qadam); «maxfiy narsa yo'q» — besh qatorning hammasi «Ko'rinmadi» / «Aytilmadi» (A3 2-qadam); video-portfolio ta'rifi dars bo'yi so'zma-so'z (2-ekran, yakun, kartochka 1, arena 1).
8. [x] **Test: bitta himoyalanadigan javob** — 4, 7-ekran va arena: distraktorlar uch xil turkumdan (Kalit qatorlari va arena izohi), hayotda rost bo'lib qoladigan variant yo'q (7-ekran D — tanish odam ham boshqa odam), inkor-savol yo'q (arena 12 — «Ota-onangiz rozi. Qayerga joylaysiz?»), to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] **Real odamlar xavfsizligi** — yuz va ism ixtiyoriy (0, 6-ekran), tekshiruvdan oldin video hech qayerga yuklanmaydi, havola — ota-ona roziligi bilan va hech qayerga yozilmaydi (8-ekran, qalin qator), maktab va telefon yo'q (2-ekran, A1, A3), boshqa odamlar ma'lumoti ekranda yo'q (5-ekran, namuna akkaunt), Mentor ota-ona nomidan tasdiqlamaydi (1, 8-ekran), sinfda sanalmaydi va proyektorga chiqmaydi (KOD 11).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — ssenariy, yozish, tekshirish — o'quvchi (3, 6, 8-ekran); agent faqat namuna akkaunt (6-ekran 1-qadam) va xato bo'lsa; videoni o'quvchi o'zi ko'rib tekshiradi (8-ekran Mentori).
11. [x] **Web-trek teng yo'l** — demo yo'li ikkala trekda laptop brauzerida (A-13; 3, 6-ekran 1-qadam — bir gap); web usuli to'qilmadi.
12. [x] **Mentor misoli ichki izchil** — lahza va «8 / 10» → «9 / 10» — tayanch 1.2, 1.4, 1.6 aynan; «Kimman» — 1.1 Jamoa bo'lagi so'zlari; qaror — 13M 1.11; yangi son yo'q; keyingi darsning natijasi ochilmadi; yangi tafsilotlar — TAYANCHGA SAVOL 1, 2, 10.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — uch bo'lak o'quvchida (3-ekran), `{demo uchun namuna}` — o'quvchida; Mentor misoli faqat «Yordam»da va kutilgan natijada.
14. [x] **Uyga vazifa yengil va aniq** — loyiha kunida uyga vazifa yo'q (`uyga: null`); havola ixtiyoriy — «Hali gaplashmadim» to'liq natija (8-ekran), majburiydek aytilmaydi.
15. [x] **Ayb da'vosi yo'q** — xato yo'li: «Shu xato chiqdi: {xato}. Tuzat, yangi narsa qo'shma.» (6-ekran); «Ovoz yo'q» → aniq qadam; «xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — videoda faqat bor narsa (2-ekran 5-karta, 4-ekran B); keyingi darslar aytilmaydi (faqat yakundagi «Keyingi dars» qatori); «Demo Day» yo'q (tayanch 9.13).
17. [x] **Pul va investitsiya** — bu darsda pul yo'q; «Qanday ishlayman»da Pro qarori olinmadi (TAYANCHGA SAVOL 1) — maydon puli faqat «keyinga qoldirilgan funksiya» sifatida; investitsiya yo'q.
18. [x] **Yosh va rasmiy shartlar** — video xizmatlari va ularning yosh chegarasi aytilmaydi (tekshirilmagan — 8-ekran ✎, Shubhali 4); Render — tayanch 6 dagi rasmiy fakt.
- [x] **RAD etilganlar (qayta ochilmaydi):** hookdagi «Aynan!» / «Qiziq fikr!» (0-ekran) · yakundagi «Keyingi dars — «…»» qatori (11-ekran) · Reja sarlavhasi — natija-gap (1-ekran) · ekranda ≤3 blok · keyssiz.
- [x] **12-Modul SABOQ E:** har variantning o'z chegarasi (E 40) · maketda hech narsa kesilmaydi (E 41) · taxmin qatori yashil xulosa ichida (2-ekran, E 42) · yorliq input ichida (3-ekran, E 43) · bittadan karta (2, 3, 5-ekran — E 53) · yakun standarti (E 50) · sarlavha har holatda rost (E 54) · «Davom etish» qachon — MD da aniq (E 55).

## O'lchov
`md09/olchov.py` natijasi (qavsdagi sonlar skript bilan qo'yilgan: har sanaladigan matn belgilab olinib, uzunligi avtomatik yozildi):
```
Belgilar soni — bo'shliq bilan, ** siz (Python len). Qavsdagi uzunliklar: 158 ta — hammasi skript qo'ygan, qo'lda son yozilmagan.
Sarlavhalar (yakunning 5 holati va platforma sarlavhasi bilan): 13 ta · 25–54 · ≤55
Xulosalar: 2 ta · 75–81 · ≤110
Hook javoblari: 3 ta · 94–107 · ≤120
Hook variantlari: 3 ta · 34–38
To'g'ri izohlar: 2 ta · 48–55 · ≤60
Xato izohlari, QXato, ipucha, shart xabarlari: 20 ta · 33–56 · ≤60
QIzoh qatorlari: 2 ta · 80–94 · ≤110
Kulrang qatorlar, vazifa qatorlari, placeholder, yorliqlar, bloklar yashil xulosasi: 29 ta · 5–115
2-ekran karta matnlari: 6 ta · 20–38
Nishon tavsiflari: 4 ta · 37–46 · ≤48
Endi siz bilasiz: 5 ta · 67–82 · ≤110
Bugungi asosiy fikr (A-2): 1 ta · 99–99 · ≤110
Mentor gaplari: 0-ekran 1 gap (100) · 0-ekran 1 gap (80) · 1-ekran 1 gap (100) · 2-ekran 1 gap (61) · 2-ekran 1 gap (40) · 3-ekran 1 gap (70) · 5-ekran 1 gap (71) · 5-ekran 1 gap (63) · 6-ekran 1 gap (71) · 8-ekran 1 gap (96)
Sarlavha so'zlari (4+ harf) Mentorda: 0: 0/6 · 1: 1/6 · 2: 1/4 · 3: 0/4 · 5: 0/5 · 6: 0/6 · 8: 2/5 — hech qayerda ≥50% bo'lmasligi kerak
Test savoli (4-ekran): 10 so'z (79 belgi)
Test savoli (7-ekran): 8 so'z (69 belgi)
Hook variantlari (0-ekran): 38 · ✔36 · 34 | min/max 34/38 (+12%) | o'rtachadan eng katta og'ish 6%
4-ekran: 44 · 43 · ✔45 · 46 | min/max 43/46 (+7%) | o'rtachadan eng katta og'ish 3%
7-ekran: 43 · ✔47 · 48 · 45 | min/max 43/48 (+12%) | o'rtachadan eng katta og'ish 6%
arena 1: ✔45 · 46 · 45 · 46 | min/max 45/46 (+2%) | o'rtachadan eng katta og'ish 1%
arena 2: 41 · ✔39 · 40 · 40 | min/max 39/41 (+5%) | o'rtachadan eng katta og'ish 2%
arena 3: 35 · 34 · ✔34 · 38 | min/max 34/38 (+12%) | o'rtachadan eng katta og'ish 8%
arena 4: 37 · 39 · 40 · ✔39 | min/max 37/40 (+8%) | o'rtachadan eng katta og'ish 5%
arena 5: ✔25 · 26 · 28 · 27 | min/max 25/28 (+12%) | o'rtachadan eng katta og'ish 6%
arena 6: 33 · ✔32 · 35 · 35 | min/max 32/35 (+9%) | o'rtachadan eng katta og'ish 5%
arena 7: 26 · 29 · ✔26 · 28 | min/max 26/29 (+12%) | o'rtachadan eng katta og'ish 6%
arena 8: 34 · 31 · 30 · ✔32 | min/max 30/34 (+13%) | o'rtachadan eng katta og'ish 7%
arena 9: ✔32 · 32 · 30 · 31 | min/max 30/32 (+7%) | o'rtachadan eng katta og'ish 4%
arena 10: 41 · ✔42 · 41 · 44 | min/max 41/44 (+7%) | o'rtachadan eng katta og'ish 5%
arena 11: 41 · 38 · ✔39 · 38 | min/max 38/41 (+8%) | o'rtachadan eng katta og'ish 5%
arena 12: 35 · 38 · 35 · ✔37 | min/max 35/38 (+9%) | o'rtachadan eng katta og'ish 5%
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```

## TAXMIN belgilari
Jami 35 ta `<!-- TAXMIN Tn -->` belgisi (qavsda — nechta joyda; Tn · bo'lim). Qaror-0 javobi boshqacha bo'lsa — aynan shu joylar tuzatiladi.
- **T4** (4) — A-bo'lim · 1 · Reja · 3 · Amaliyot 1 — ssenariy · REPO
- **T7** (1) — A-bo'lim
- **T8** (5) — A-bo'lim · 3 · Amaliyot 1 — ssenariy · 6 · Amaliyot 2 — yozish
- **T9** (2) — sarlavha bloki
- **T12** (14) — sarlavha bloki · A-bo'lim · ip va vizual · 0 · Kirish · 1 · Reja · 6 · Amaliyot 2 — yozish · 8 · Amaliyot 3 — tekshirish va havola · 11 · Yakun
- **T13** (1) — A-bo'lim
- **T18** (2) — sarlavha bloki · A-bo'lim
- **T19** (2) — A-bo'lim · 2 · Videoga nima sig'adi?
- **T20** (4) — sarlavha bloki · ip va vizual · 11 · Yakun

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 474–476 (grep 08.10) — `m12-08` «Final pitchingiz 5 daqiqaga tayyormi?» → **`m12-09` «Video-portfolio: 3 daqiqada o'zingiz va mahsulot»** (osti «ssenariy, ekran yozuvi va havola» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m12-10` «Birinchi buyurtmani qayerdan topasiz?» (yakundagi «Keyingi dars» qatori, osti bilan).
- [x] Bitta misol-ip — «Maydon Jamoa» (lahza — 1.2, demo — 1.6, qaror — 13M 1.11); ikkinchi misol faqat testda (kitob almashish ilovasi — P-002); keyssiz; metafora yo'q; bitta vizual — `VideoSahna` (laptop · yozuv belgisi · kamera joyi · ovoz · vaqt chizig'i · fayl kartasi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (karta → vaqt chizig'i; xato — qizil bo'lak), 5 (joy → xira + ro'yxat qatori) + 0 (kamera joyi, ovoz), 3 (karta → ✓ qator; o'qish → chiziqda vaqt); testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md09/olchov.py`): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi ≤60 — «O'lchov» bo'limi.
- [x] Atamalar oldingi darslar bilan bir (grep, tayanch 2; A-3, A-5): hikoya, lahza — 2-dars · B reja, uyg'otish, namuna akkaunt — 6-dars · login, `namuna`, Neon — 12-Modul · `git status` — 12–13-Modul · yangi: video-portfolio (misoldan keyin, ta'rif dars bo'yi bir xil), ssenariy, ekran yozuvi (App.jsx osti) ·
  siz-forma; tugmalar ot-shaklda yoki siz-formada («Videoga», «Videoga emas», «Keyingi bo'lak», «Video saqlandi», «Ota-onam rozi»). Agentga prompt — buyruq shaklida (T-002).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (O'lchov); to'g'ri javob yolg'iz eng uzun emas; kalit so'z va «:» faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 4-ekran C, 7-ekran B (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ ↻ — belgilar) · kafolat so'zlari yo'q · xulosalar «Bu misolda» bilan chegaralangan · «sinov» — o'quvchi matnida yo'q (faqat platforma sarlavhasi).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-09`, «A1», «Modul 14», K-raqam, «pilot» yo'q; bloklar — «Amaliyot 1–3»; modul raqami LMS bo'yicha — «11-Modulda», «2-darsdagi», «6-darsdagi»); «KOD» ro'yxati 14 band, REPO 4 band.
- [x] Karta T · P · S: T-002 (agent prompti) · T-008 (Mentor ssenariysi — olam matni) · T-011 (video-portfolio — 2-ekranda harakatdan keyin) · T-014/T-015 (A-5; «ssenariy» bitta imlo) · T-016/T-017 (metafora yo'q) · T-024 · T-029/T-047 · T-038 · T-039 · T-042 · T-043 · T-045 (yozuvga tushgan narsa faylda — yolg'on model yo'q) · T-048 · T-049 · T-052 · T-064 · T-070 ·
  P-001 · P-002 · P-004 · P-008 · P-012 (testlar 4, 7 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-026 (B reja va telefon zaxirasi) · P-028 · P-033 · P-036 · P-040 (5-ekran «n / 4») · P-046 · P-048 · P-052 · P-059 · P-062 · P-063 (`MAXFIY_ROYXAT`) · P-064 · P-067 ·
  S-001 · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 · S-026 · S-027 · §106 · §119 · §144/§145 · J-026 (hook ballsiz) · SABOQ 1–39, E 40–55.
- [x] Video xavfsizligi (TAQIQLAR 1, 3; tayanch 1.9, T12): yuz va ism ixtiyoriy; video hamma ko'radigan joyga joylanmaydi; havola — ota-ona roziligi bilan, hech qayerga yozilmaydi va kalitga tushmaydi; ekranda maxfiy narsa yo'qligini o'quvchi o'zi tekshiradi; video repo'ga qo'shilmaydi.
- [ ] ⛔ «qur» darvozalari ochiq: ekran yozish vositasi va sinf shovqini (Shubhali 2, 3), «faqat havola bilan» joy (Shubhali 4), Mentor videosi (REPO 2), 90 daqiqa (Shubhali 1) — pilot va foydalanuvchi qarori kerak; TAYANCHGA SAVOL 3 (`bor` ma'nosi), 6 (ota-ona roziligi tartibi), 9 (imlo) — qaror kerak.
