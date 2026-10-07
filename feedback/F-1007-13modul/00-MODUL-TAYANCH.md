# 13-Modul — modul tayanchi (12 MD uchun bitta manba; har MD ning «A» bo'limi shundan oladi)

Qarorlar: `GATE_M_JAVOB.md` (Qaror-0, 24 band — MAJBURIY) · nomlar: `00-NOMLAR.md` · dastur, o'tilgan atamalar va rasmiy iqtiboslar: `00-MANBA.md` · taqiqlar: `00-TAQIQLAR.md`.
Bu fayldagi nom, raqam va so'zlar hamma darsda **aynan** shunday. Bu yerda yo'q tafsilot kerak bo'lsa — MD oxiridagi «TAYANCHGA SAVOL» ga yoziladi, o'zicha o'ylab topilmaydi.
«Maydon Jamoa» ning 12-Modul oxirigacha bo'lgan faktlari — `feedback/F-1006-12modul/00-MODUL-TAYANCH.md` (faqat o'qiladi; ziddiyat bo'lsa — shu faylning 1.0-bo'limi nima o'zgarganini aytadi).
Hamma raqam — **Mentor misoli** (mashq uchun yozilgan holat); o'quvchi matnida «Mentor misolida» / «bu misolda» deb chegaralanadi, statistika yoki tadqiqot deb aytilmaydi. Mentorning o'ylagani — yorliq **«Mentorning taxmini»**.
**Modul raqami o'quvchi matnida — LMS raqami** («12-Modul 9-darsi», «7-Modulda»); kod raqami (`m11-03`, `src/11-Modull`) faqat fayl yo'lida. Moslik: kod `5`→LMS 7 · `6`→8 · `7`→9 · `8`→10 · `9`→11 · `10`→12 · `11`→13.
⚠️ Bu modulda pul bor. **Real pul yo'q** — faqat test rejim; karta ma'lumoti hech qayerda yozilmaydi va ko'rsatilmaydi; maxfiy kalit faqat `.env` da (Qaror-0 6). Bu qoida har ekranga, har promptga, har maketga tegadi.

## 1. Misol-ip — «Maydon Jamoa» pul topa boshlaydi

### 1.0 Boshlanish nuqtasi (12-Moduldan, teg `m12-dars-10-done`) va 13-Modulda nima o'zgaradi
- **Mahsulot** (o'zgarmaydi): «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova; tashkilotchi o'yin e'lon qiladi, o'yinchilar «Qo'shilaman» ni bosadi; e'londa «8 / 10». Odamlar roli bilan, ismsiz: **tashkilotchi** · **o'yinchi**.
  Muammo gapi (so'zma-so'z, 11-Modul): «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.» Namuna o'yin — **Shanba, 18:00 · Mahalla maydoni · 8 / 10** (`id` 1).
- **12-Modul oxirida bor** (tayanch 1.1–1.12): lending (`lending/`, Umami) · real vaqt (socket.io, `oyin-ozgardi`) · «Hozir ko'ryapti» · jonli xabar · rejalashtirilgan eslatmalar (o'yin eslatmasi, uch kunlik) · login (telefon so'ralmaydi) · `namuna` ustuni ·
  «Hisobni o'chirish» · `hodisalar` jadvali va sanoq sahifasi (`SANOQ_KALITI`) · mehmon ko'rinishi · `lending/maxfiylik.html` (to'rt savol) · Android APK (EAS) + iPhone brauzer ko'rinishi · «Havolani ulashish» (lending manzili `?kanal=ilova`).
- **Sonlar (12-Modul 1.13; boshqa son yo'q):** ro'yxatdan o'tgan **44** (11 tasi sinfdosh) · asosiy harakatni qilgan **24** · qaytganlar foizi: birinchi haftada ochgan 61 qurilmadan 26 tasi ikkinchi haftada ham ochdi (**43%**) ·
  bosh raqam — haftada to'lgan o'yinlar: 1, keyin 3 · kanallarga **pul sarflanmagan** (postlar, guruh, sinf chati).
- **13-Modul uchun yangi Mentor faktlari (IP-q2 A — bitta jadval 1.13 da):** tashkilotchilar — **6** (`namuna = false`, kamida bitta o'yin e'lon qilgan hisob; ular 24 asosiy harakat ichida) · narx taxmini · suhbat va tasdiq natijalari · referal natijasi.
- **13-Modulda qo'shiladi** (repo, 3-bo'lim): `oyinchilar.pro_gacha` (Pro muddati) · `tolovlar` jadvali · `POST /tolov/webhook` · «mashq to'lov» sahifasi (`backend/` ichida) · «Doimiy o'yin» · `lending/oferta.html` · Telegram bot xabari (`oyinchilar.telegram_chat_id`) ·
  taklif kodi (`oyinchilar.taklif_kodi`, `taklif_qilgan_id`) · `XATOLAR.md`. Pro muddati tugagach o'zi to'xtaydi — **avtomatik yechish yo'q**.
- **Pul modeli (Qaror-0 1):** freemium — o'yinchilar uchun hamma narsa bepul (bugungi ilova o'zgarmaydi); tashkilotchi uchun **«Pro»** (30 kunlik pullik obuna) — bitta qulaylik: **«Doimiy o'yin»** — har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.
  Sabab (Mentor): tashkilotchi har hafta e'lonni qayta yozadi va odam chaqiradi — Pro shu ishni oladi; o'yinchilar bepul qoladi — ular bo'lmasa o'yin to'lmaydi.

### 1.1 Jalb qilish narxi va foydalanuvchi keltiradigan pul (1-dars)
- **jalb qilish narxi** — bir davrda kanallarga sarflangan pul ÷ shu davrda kelgan yangi foydalanuvchilar. **foydalanuvchi keltiradigan pul** — bitta foydalanuvchidan butun foydalanish davomida keladigan pul (sodda hisob: narx × necha oy to'laydi).
  Inglizchasi (kartochkada bir marta): CAC · LTV. Asosiy fikr: **foydalanuvchini jalb qilish narxi u keltiradigan puldan kam bo'lsagina mahsulot o'zini oqlaydi** — bu misolda jalb qilish narxi bepul kanallarda 0 so'm, keltiradigan pul esa hozircha taxmin (9.17).
- **Mentor hisobi (aynan):** 44 kishi ro'yxatdan o'tgan; kanallarga pul — **0 so'm** → jalb qilish narxi pulda **0 so'm**. Halol gap: «Bu misolda pul sarflanmagan — vaqt sarflangan. Bepul kanallar (o'z guruhi, sinf chati) chegarali.»
  Freemium'da o'yinchi **0 so'm** keltiradi; pul — faqat Pro olgan tashkilotchidan. Mentorning birinchi taxmini: Pro — **30 kun uchun 10 000 so'm**, tashkilotchi Pro'ni o'rtacha **3 oy** ushlab turadi → bitta Pro tashkilotchi keltiradigan pul **30 000 so'm**.
- **«Agar» hisobi (Mentorning taxmini — mashq hisobi):** pullik kanalga **60 000 so'm** sarflansa va **12** kishi ro'yxatdan o'tsa — bittasi **5 000 so'm**; ular ichida **1** tashkilotchi chiqsa — bitta tashkilotchini jalb qilish **60 000 so'm** → u keltiradigan puldan (30 000) ko'p: **bu misolda pullik kanal zarar**.
  Reklama narxi haqida fakt aytilmaydi (manba yo'q) — bu faqat «agar» hisobi.
- **Halol gap:** «43% — ilovani yana ochganlar; obunani davom ettirish bilan bir xil o'lchov emas.» «3 oy» va «10 000» — taxmin; o'quvchida ham taxmin bo'lsa, yorlig'i bilan yoziladi.
- **Kod mexanikasi (PM, kod oynasi — JS):** ikki funksiya — `jalbNarxi(sarf, yangi)` va `keltiradi(narx, oy)`; natija ikki sonni solishtiradi («o'zini oqlaydi» / «zarar»). Namuna sonlar — Mentorning; o'quvchi o'z sonlarini qo'yadi. `yangi` 0 bo'lsa — bo'lish yo'q, xabar.
- **O'quvchi:** o'z mahsuloti uchun — qaysi kanallardan qancha odam keldi (12-Modul 10-darsi hisoboti `pm-m10d10-hisobot` bo'lsa — undan), qancha pul sarflandi (ko'pincha 0), kim to'lashi mumkin, narx va oy taxmini. Saqlanadi `pm-m11d1-birlik`.

### 1.2 Monetizatsiya modellari (2-dars)
- **Besh model** (o'quvchi matnidagi nomlar; inglizchasi kartochkada): **bepul asos va pullik qo'shimcha** (freemium) · **pullik obuna** · **reklama** · **B2B** — «boshqa biznes to'laydi» (bir marta izoh) · **tranzaksiya** — «har to'lovdan ulush» (bir marta izoh; Database tranzaksiyasi bilan aralashmasin — 11-Modul 14-darsi so'zi boshqa ma'noda).
- **Mentor jadvali** (har model «Maydon Jamoa»ga qo'yiladi — Mentorning taxmini):
  1) bepul asos va pullik qo'shimcha — o'yinchilar bepul, tashkilotchi Pro → **tanlandi** · 2) pullik obuna (hamma to'laydi) — Telegram guruhi bepul; o'yinchilar ketishi mumkin, o'yin to'lmaydi ·
  3) reklama — 44 foydalanuvchida reklama beruvchiga deyarli foyda yo'q; o'smirlar ma'lumoti · 4) B2B — maydon egasi to'laydi: «Maydon Jamoa» bugun maydon egasiga xizmat qilmaydi, muammo gapida yo'q ·
  5) tranzaksiya — «Maydon pulini bo'lishish» (11-Modul roadmap'ida «uzoqroq»): boshqalar nomidan pul yig'ish — yuridik shaxs va shartnoma kerak.
- **K2 Telegram Premium** (5-bo'lim) — ko'prik: «Bu voqeada bepul Telegram qisqartirilmagan — Premium ustiga qulaylik qo'shgan. Mentor ham bepul qismni qisqartirmaydi.»
- **Kod mexanikasi (PM, Neon SQL Editor):** Pro kimga kerakligini sanash — tashkilotchilar soni:
  `SELECT COUNT(DISTINCT g.tashkilotchi_id) FROM oyinlar g JOIN oyinchilar o ON o.id = g.tashkilotchi_id WHERE o.namuna = false;` → Mentor misolida **6**. (Ustun nomlari — 11-Modul tayanchidagi jadvaldan; «qur» da Mentor repo'sida tekshiriladi.)
- Saqlanadi `pm-m11d2-model`: kim to'laydi, nima uchun to'laydi, nima bepul qoladi, sabab, rad etilgan modellar va sababi.

### 1.3 Webhook: to'lov Backend'ga qanday yetib keladi (3-dars, TEX — modul cho'qqisi)
- **7-Moduldan:** «Webhook — yangi xabar kelganda Telegram uni o'zi botning internetdagi manziliga (URL) yuboradi. Buning uchun botga internetda ochiq manzil kerak.» · «Bepul server uxlaydi; webhook xabari uni uyg'otadi.» Bugun — xuddi shu yo'l, lekin xabarni **to'lov xizmati** yuboradi.
- **To'lov oqimi sxemasi** (dastur natijasi; o'quvchi o'z mahsuloti uchun to'ldiradi, repo'da `README.md` «To'lov» bo'limi). Mentor sxemasi — besh qator:
  1) ilova → «To'lovga o'tish» → brauzerda to'lov sahifasi ochiladi · 2) to'lov xizmati → odam to'laydi yoki rad etadi (karta ma'lumoti faqat xizmatda) · 3) to'lov xizmati → **to'lov xabari** (webhook) → Backend `POST /tolov/webhook` ·
  4) Backend → imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, `200` qaytaradi · 5) ilova → Backend'dan Pro holatini qayta so'raydi (`GET /men`).
- **Uch g'oya** (o'quvchi matni; atamalar 2-bo'lim):
  **imzo** — xabar haqiqatan to'lov xizmatidan kelganini ko'rsatadigan belgi: xizmat maxfiy kalit bilan hisoblaydi, Backend o'sha kalit bilan qayta hisoblab solishtiradi; mos kelmasa — `401`, hech narsa yozilmaydi ·
  **takror xabar** — bitta to'lov haqidagi xabar ikki marta kelishi; bitta to'lov raqami bir marta sanaladi, ikkinchisiga `200` (xizmat qayta yubormasin), lekin ikkinchi yozuv va ikkinchi Pro yo'q ·
  **rad etilgan to'lov** — holat «rad»: yoziladi, Pro o'zgarmaydi, ilova «To'lov o'tmadi» ko'rsatadi.
- **«Mashq to'lov» xabari** (Qaror-0 7; Mentor misoli va o'quvchi bir xil shaklda): `POST /tolov/webhook` · tana `{ tolovRaqami, holat: 'tolandi' | 'rad', summa, oyinchiId }` · sarlavha `X-Imzo` = HMAC SHA-256 (tana, `TOLOV_KALITI`) ·
  javoblar: imzo mos emas → `401` · yangi to'lov → `200 { ok: true }` · takror → `200 { takror: true }` · holat «rad» → `200`, Pro o'zgarmaydi. `summa` so'mda (Payme tiyinda yuboradi — ko'prik gapida bir marta).
- **«Mashq to'lov» sahifasi** (Backend ichida `GET /tolov-mashq?oyinchi=…&summa=…`; sarlavha **«Mashq to'lov»**, ostida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.»): tugmalar **«To'lash (mashq)»** · **«Rad etish (mashq)»**;
  tekshiruv tugmalari (3-dars): **«Ikki marta yuborish»** · **«Imzosiz yuborish»**. Sahifa xabarni Backend'da imzolaydi — kalit brauzerga chiqmaydi. Payme yoki Click nomi va ko'rinishi taqlid qilinmaydi.
- **Real xizmatlar — ko'prik (rasmiy, 07.10.2026; o'quvchi matnida bir gap, iqtibos — Manbalar):** Payme Merchant API'da Payme o'zi merchant serveriga so'rov yuboradi; «javob yo'qolsa, xuddi shu so'rovni qayta yuboradi» ·
  Click Shop API'da ikki so'rov (Prepare, Complete), imzo `sign_string` (md5), xato kodi `-4 Already paid` · Stripe: «bir xabar bir necha marta kelishi mumkin — ishlangan xabar raqamlarini yozib qo'ying». Telegram ham (7-Modul botingiz): webhook so'roviga maxfiy token sarlavhasi qo'shiladi, javob `2XX` bo'lmasa — qayta yuboradi.
- **Uxlagan Backend (WH-q1 A):** bir gap — «Bepul Backend uxlagan bo'lsa, to'lov xabari kechikishi mumkin; xizmat qayta yuboradi — shuning uchun takror xabar himoyasi kerak.» Buzib ko'rish — 5-darsda (va'da qilinmaydi — T-038; faqat O'qituvchi eslatmasida).
- **Kod oynasi (TEX, JS):** namuna `qabulQil(xabar, yozilganlar)` → `'yangi' | 'takror' | 'rad'` — o'quvchi takror tekshiruvini yozadi (namuna obyekt, «haqiqiy Backend emas» izohi). Imzo hisoblash kod oynasida yo'q — u repo blokida (Node `crypto`).
- **Repo (ikki blok):** A1 — `backend/`: `tolovlar` jadvali (`id` · `tolov_raqami` UNIQUE · `oyinchi_id` · `summa` · `holat` · `yaratilgan`) + `POST /tolov/webhook` (imzo · takror · rad) + `TOLOV_KALITI` `.env` da (`git status` da `.env` ko'rinmasligi tekshiriladi) ·
  A2 — «mashq to'lov» sahifasi va webhook testi: «Imzosiz yuborish» → `401`; «Ikki marta yuborish» → `tolovlar` da bitta qator; «Rad etish (mashq)» → qator «rad». Pro va ilova bu darsda **o'zgarmaydi** (4-dars ishi). `README.md` «To'lov» bo'limi — sxema.
- Saqlanadi `pm-m11d3-oqim` (o'quvchi sxemasi: qatorlar).

### 1.4 Narx va to'lov taklifi ekrani (4-dars, PM+PRAKT)
- **Narx — uch usul** (dastur: xarajat · raqobat · qiymat; Mentor misoli):
  **xarajat** — bugun Backend, Database, lending, o'rnatish fayli bepul rejalarda (0 so'm). Render bepul xizmatni «production uchun tavsiya qilmaydi» va u uxlaydi; eng arzon pullik veb-xizmat — **oyiga 7 dollar** (render.com/pricing, 07.10.2026) ≈ **83 000 so'm** (Markaziy bank kursi 07.10.2026: 1 dollar = 11 790,79 so'm). «Agar Mentor uxlamaydigan Backend'ga o'tsa — oyiga ≈ 83 000 so'm.» ·
  **raqobat** — tashkilotchi bugun o'yinni Telegram guruhida bepul yig'adi · **qiymat** — «Doimiy o'yin» tashkilotchining har haftalik ishini (e'lonni qayta yozish va odam chaqirish) o'zi qiladi.
- **Mentor narxi (Mentorning taxmini):** **30 kun — 15 000 so'm** (1-darsdagi 10 000 taxmini xarajatga qarab ko'tarildi): 6 tashkilotchi × 15 000 = 90 000 so'm — «hammasi olsa ham, Backend xarajati zo'rg'a qoplanadi». Narx 6-darsdagi suhbatlarda tekshiriladi.
- **To'lov taklifi ekrani** (Mentor ilovasi, so'zma-so'z): sarlavha **«Doimiy o'yin — Pro'da»** · matn «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · narx «30 kun — 15 000 so'm» · tugma **«To'lovga o'tish»** · pastda kulrang «Test rejim: pul yechilmaydi».
  («Pro shartlari» havolasi — 7-darsdan.) Inglizchasi «paywall» — kartochkada bir marta.
- **«Doimiy o'yin»:** «E'lon berish» ekranida belgi **«Har hafta takrorlansin»** — Pro bo'lmasa to'lov taklifi ekrani ochiladi; Pro bo'lsa — o'yin «doimiy» bo'ladi. Keyingi haftaning o'yini **`GET /oyinlar` so'ralganda** yaratiladi (oldingisining vaqti o'tgan bo'lsa) — Backend uxlashi mumkin, shuning uchun vaqtga bog'langan ish yo'q (Mentor qarori).
- **Bloklar:** A1 — Pro holati (`oyinchilar.pro_gacha` — sana yoki bo'sh; `GET /men` javobida `pro`, `proGacha`) va «Doimiy o'yin» (belgi, keyingi o'yin yaratilishi) · A2 — to'lov yo'li: «To'lovga o'tish» → brauzerda «mashq to'lov» (3-dars) → «To'lash (mashq)» → webhook → `pro_gacha` = bugun + 30 kun → ilova qaytganda Pro'ni ko'radi.
  Tekshirish: Pro yoqildi; «Har hafta takrorlansin» endi to'lov ekranini ochmaydi. Web-trek — xuddi shu yo'l saytda. Karta formasi yo'q (PW-q0 A).
- **Do'kon qoidalari (rasmiy, 07.10.2026):** Google Play billing qoidasi — «Play-distributed apps» uchun; Apple 3.1.1 — App Store'dagi ilovalar uchun. Mentor ilovasi Android'da APK (do'kondan emas), iPhone'da brauzer ko'rinishi — shuning uchun to'lov web sahifa orqali.
  O'quvchi matnida bir gap: «Ilova do'kon orqali tarqatilmaydi — shuning uchun to'lov brauzerdagi sahifada.» O'qituvchi eslatmasida: ilova keyinchalik do'konga chiqsa, do'konning ichki xarid qoidasi tegishi mumkin.
- Saqlanadi `pm-m11d4-narx`.

### 1.5 Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz (5-dars)
- **Dars g'oyasi:** 4-darsda agent «to'lov ishlaydi» degan — bu da'vo. Bugun to'lov oqimining qolgan holatlari quriladi va to'rt usul bilan buzib tekshiriladi (12-Modul 5-darsi buzish yozuvi: nima qildim · nima kutdim · nima bo'ldi → **buzildi** / **buzilmadi**).
- **To'rt buzish usuli** («mashq to'lov» tugmalari bilan; faqat o'z mahsulotida): 1) **ikki marta yuborish** · 2) **kechiktirib yuborish** — sahifa xabarni 70 soniya kutib yuboradi (uxlagan Backend o'rnida; Render uyg'onishi ≈1 daqiqa) · 3) **rad etish** · 4) **noto'g'ri imzo**.
  «Kechiktirib yuborish» — mashq sahifasining tugmasi; haqiqiy uxlashni kutish shart emas (bir gap: «haqiqiy bepul Backend 15 daqiqa so'rovsiz qolsa uxlaydi»).
- **Mentor misolida topilgan ikki muammo** (Mentor repo'sida `m13-dars-05-start` aynan shu holatda; tekshirilmaguncha «muammo bor» deyilmaydi — ⛔ «qur» darvozasi):
  1) **Ikki marta kelgan xabar Pro'ni ikki marta uzaytirdi** — `tolovlar` da bitta qator (3-dars himoyasi ishladi), lekin Pro 60 kunga uzaydi. Sabab: Pro'ni uzaytiradigan qator takror tekshiruvidan oldin ishlaydi. Tuzatish: Pro faqat yangi yozilgan to'lovdan keyin uzayadi (bitta tranzaksiyada).
  2) **Kechikkan xabar: sahifa «To'lov o'tmadi» dedi, keyin Pro yoqildi** — ilova esa eski holatda qoldi. Sabab: sahifa javobni 10 soniya kutib, «o'tmadi» deb yozgan. Tuzatish: sahifa «Javob kutilmoqda» ko'rsatadi; ilova qaytganda va «Qayta tekshirish» bosilganda `GET /men` ni qayta so'raydi.
  Rad etish va noto'g'ri imzo — **buzilmadi** (rad — Pro yoqilmadi; imzo — `401`). «Buzilmadi» ham natija.
- **Uch blok:** A1 — qolgan holatlar: «To'lov o'tmadi — qayta urinib ko'ring» · ilovada «Javob kutilmoqda» · Pro muddati tugashi (keyingi «Doimiy o'yin» yaratilmaydi, e'lon qilingan o'yinlar qoladi) · «mashq to'lov»ga «Kechiktirib yuborish», «Noto'g'ri imzo» (9.35) ·
  A2 — to'rt usul bilan buzish va yozuv (kod yozilmaydi; `BUZISH.md` ga «To'lov» bo'limi) · A3 — topilganlar agentga **yozuv bilan** beriladi, **«Tuzatish qilindi»** (ish fakti), o'sha usul bilan qayta tekshiriladi («qayta tekshiruvda takrorlanmadi» / «yana buzildi»).
- Saqlanadi `pm-m11d5-buzish` (12-Modul `pm-m10d5-buzish` shakli; `usul: 'ikki' | 'kech' | 'rad' | 'imzo'`).

### 1.6 Pul haqida suhbat (6-dars)
- **Suhbat — sotish emas, savol** (Qaror-0 11). Mentor skripti (to'rt savol, so'zma-so'z): 1) «Hozir o'yinni qanday yig'asiz va bunga haftada qancha vaqt ketadi?» · 2) «Bunga hozir pul sarflaysizmi — nimaga?» ·
  3) «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa — olarmidingiz? Nega?» · 4) (javob «yo'q» yoki «qimmat» bo'lsa) «Qancha bo'lsa olardingiz?» — javob **so'zma-so'z** yoziladi; Mentor ko'ndirmaydi, «o'ylab ko'ring» demaydi.
- **Javob belgilari:** **ha** · **qimmat** · **yo'q** · **javob yo'q**. Javob — taxmin emas, odamning o'z gapi; narx haqida **dalil**, isbot emas (12-Modul 11-darsi: dalil — son yoki yozuv).
- **Mentor misolining uch suhbati** (mahalla futbol guruhi tashkilotchilari — guruh egasining ruxsati bilan, rol bilan, ismsiz):
  1-tashkilotchi: «Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.» → **ha** · 2-tashkilotchi: «Telegram guruhi tekin-ku, pul to'lamayman.» → **yo'q** (4-savolga: «Hech qancha — guruh yetadi.»; narx yo'q) · 3-tashkilotchi: «15 000 qimmat. 10 000 bo'lsa olardim.» → **qimmat** (10 000).
  Mentor xulosasi: «Uch suhbat — kichik son: narx haqida dalil, isbot emas. Narx hozircha qoladi, "qimmat" javobi yozib qo'yildi.»
- **Rol o'yini** (darsda, juftlikda): bittasi auditoriya roli (Mentor misolida — tashkilotchi), ikkinchisi skriptni aytadi va javobni yozadi; keyin almashadi. Mashq javobi — `tur: 'mashq'`.
- **Real suhbatlar** (SU-q0 A; 12-Modul xavfsizlik ro'yxati kuchda): o'z auditoriyasidagi tanish odamlar — 11-Modulda intervyu bergan odamlar, sinfdosh, ota-ona, mahalla guruhidagi tanish (guruh egasining ruxsati bilan).
  Notanishga yozilmaydi; uchrashuv taklifi kelsa — faqat kattalar bilan. Darsda — rol o'yini va imkon bo'lsa bitta real suhbat (sinfdosh auditoriya bo'lsa); qolgani — uyga vazifa (3 suhbatgacha), ota-onaga aytib.
  Sinfda kim qancha suhbat qilganini qo'l ko'tartirib sanash yo'q (12-Modul 9.39 e).
- Saqlanadi `pm-m11d6-suhbat`.

### 1.7 Oferta va maxfiylik siyosati (7-dars, PM+PRAKT)
- **Oferta** — FK 369-modda (O'zbekiston Respublikasining kodeksi, lex.uz/docs/-111189, 07.10.2026): «Shartnomaning barcha asosiy shartlarini o'z ichiga olgan, taklif kiritayotgan shaxsning javob qaytargan har qanday shaxs bilan … shartnoma tuzishga bo'lgan xohish-irodasi bilinib turgan taklif oferta (ommaviy oferta) hisoblanadi.»
  O'quvchi matnida sodda: «Oferta — hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan. Odam to'lasa — shu shartlarga rozi bo'ladi.» Manba qatori — kartochkada va O'qituvchi eslatmasida.
- **Mentor ofertasi** — `lending/oferta.html`, sarlavha **«Pro shartlari»**, tepada **«Mashq hujjati — real to'lov qabul qilinmaydi»**, oxirida **«Bu hujjat yuridik maslahat emas.»**; olti band (so'zma-so'z):
  1) Kim taklif qiladi — «[real ishga tushirishda — yuridik shaxs yoki YaTT]» · 2) Nima beriladi — «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi · 3) Narx va muddat — 30 kun, 15 000 so'm; muddat tugagach Pro o'zi to'xtaydi, pul avtomatik yechilmaydi ·
  4) Pro tugasa — e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi · 5) Bekor qilish va pulni qaytarish — «[real ishga tushirishda yoziladi; mashqda pul yechilmaydi]» · 6) Aloqa — «[real ishga tushirishda]».
- **Maxfiylik siyosatiga to'lov bandi** (`lending/maxfiylik.html`; 07.10 aniqlashtirildi — 9.29): «Qaysi ma'lumot?» ga — «Karta ma'lumotini Maydon Jamoa ko'rmaydi va saqlamaydi: haqiqiy to'lovda uni to'lov xizmati qabul qiladi, bu mashqda karta umuman so'ralmaydi. Biz saqlaymiz: to'lov raqami, kim to'lagani (hisob), holati (to'landi yoki rad etildi), summa, sana va Pro muddati.» ·
  «Nima uchun?» ga — «To'lov raqami, hisob, holat va summa — to'lovni bir marta hisoblash va «to'lovim qayerda?» savoliga javob berish uchun. Pro muddati — Pro'ni yoqish va to'xtatish uchun.»
- **Halollik (TOLOV-q1 A):** bir gap — «Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; bu kursda emas.» Manba — FK 27-modda (14–18 yoshli bitimni ota-onaning yozma roziligi bilan tuzadi). «Qonunga to'liq mos», «yurist tekshirgan» — yo'q.
- **Bloklar:** A1 — oferta: agent shablon bo'yicha yozadi, koddan bilinmaydigan joyni «[savol]» qoldiradi, o'quvchi to'ldiradi (12-Modul 9.39 f naqshi) · A2 — siyosatga to'lov bandi + havolalar: lending pastida va to'lov taklifi ekranida **«Pro shartlari»**; push, Netlify, telefonda ochib tekshirish.
- Saqlanadi `pm-m11d7-hujjat`.

### 1.8 Loyiha kuni: ketayotgan foydalanuvchini qaytarish (8-dars)
- **12-Modul 9-darsidan farqi:** u yerda ilova o'zi oldindan qo'ygan eslatma — ilova yopiq paytda **yangi e'lon bor-yo'qligini bilmaydi** (halol chegara). Bugun — **Backend** biladigan haqiqiy o'zgarish haqida, ilova yopiq bo'lsa ham, **Telegram bot** orqali (Qaror-0 14).
- **Nega ketishadi (Mentor misoli):** 12-Modul soni — 61 qurilmadan 26 tasi qaytgan, 35 tasi qaytmagan. Mentor qaytmagan **5** tanish o'yinchiga yozdi (sinfdosh va guruh, ruxsat bilan): **3** — «yangi o'yin chiqqanini bilmadim» · **1** — «telefonda joy qolmadi, ilovani o'chirdim» · **1** — javob bermadi.
  Halol gap: «5 kishi — kichik son: sabab haqida dalil, isbot emas.»
- **Mexanika (Mentor misoli):** ilovada **«Telegram'da xabar olish»** → ilova bir martalik kod bilan havola ochadi `t.me/<bot>?start=<kod>` → odam botda «Start» ni bosadi → Backend'ning Telegram webhook'i (7-Modul naqshi) kodni tekshiradi va `oyinchilar.telegram_chat_id` ni yozadi.
  Xabar (bitta tur): odam ilgari qo'shilgan **«Doimiy o'yin»** keyingi haftaga e'lon qilinganda — «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni — 0 / 10» (xabar o'yin yaratilgan paytda ketadi — unda hali hech kim yo'q; 07.10 tuzatildi, 9.38). Haftasiga ko'pi bilan ikkita (12-Modul qoidasi; Telegram xabarlarini Backend sanaydi).
  Ilovada **«Telegram xabarlarini o'chirish»** — chat raqami o'chiriladi, xabar to'xtaydi. Xabardagi havola `?kanal=telegram` bilan — ilova ochilsa sanoq yozuvi `telegramdan-ochdi`.
- **Rasmiy faktlar (07.10.2026):** «Bots can't start conversations with users. A user must either add them to a group or send them a message first.» · `start` parametri — `A-Z`, `a-z`, `0-9`, `_`, `-`, 64 belgigacha ·
  webhook so'roviga `X-Telegram-Bot-Api-Secret-Token` sarlavhasi (setWebhook `secret_token`) · javob `2XY` bo'lmasa, Telegram so'rovni qayta yuboradi · bitta chatga sekundiga bittadan ko'p xabar yo'q.
- **Shaxsiy ma'lumot:** Telegram chat raqami — faqat xabar yuborish uchun, «o'chirish»da o'chadi; maxfiylik siyosatiga bir qator (A3). Telegram yosh chegarasi aytilmaydi (12-Modul tayanchi 6). Bot tokeni — `TELEGRAM_BOT_TOKEN` (`.env`), agentga yuborilmaydi.
- **Uch blok:** A1 — bot va ulanish (**yangi bot** BotFather'da — 7-Moduldagi botning webhook'i boshqa Backend'ga ulangan, botda bitta webhook; kod bilan /start; 9.39) · A2 — «yana e'lon qilindi» xabari va haftalik chegara · A3 — o'chirish, `telegramdan-ochdi` sanoq yozuvi, siyosatga qator.
  O'quvchi mahsulotida «Doimiy o'yin» bo'lmasa — xabar o'z mahsulotidagi haqiqiy o'zgarish haqida (talabni o'quvchi yozadi; «Ochish» qadamida bir gap). Web-trek — xuddi shu (bot trekka bog'liq emas).
- Uyga vazifa yo'q (loyiha kuni). Yangi kalit yo'q.

### 1.9 Kim haqiqatan to'lashga tayyor? (9-dars)
- **Tasdiq** — odamning **yozma** javobi: «narx X bo'lsa, … uchun to'layman» (chat xabari yoki qog'oz). **Real to'lov emas**; oldindan to'lov, karta, «mashq to'lov» bilan to'latish — yo'q (SU-q1 A). O'quvchi yozuvi: **rol** (ism emas) · narx · nima uchun · qachon · so'zma-so'z gap.
  Skrinshot kerak bo'lsa — ism va telefon ko'rinmasin.
- **Mentor misoli:** 6 tashkilotchidan so'raldi (6-darsdagi uchtasi ham) → **3 yozma tasdiq**: 1-tashkilotchi — 15 000 so'm, «Doimiy o'yin» uchun · 4-tashkilotchi — 15 000 so'm («har shanba o'zim yozishdan charchadim») · 3-tashkilotchi — **10 000** so'm («15 000 qimmat»);
  **2** — «hozir yo'q» (biri — 2-tashkilotchi: Telegram tekin) · **1** — javob bermadi. Halol gap: «Uchta tasdiq — ikkitasi 15 000 da, bittasi 10 000 da: narx haqida dalil, isbot emas.»
- **Mentor tekshiruvi — uch savol** (12-Modul 10-darsi shakli; javob **qabul** yoki **tuzatish**, yakka rejimda «Tuzatish topilmadi»): «Kim tasdiqladi?» (rol — mahsulot auditoriyasidanmi; o'zi yoki sinfdosh-o'yinchi emas) ·
  «Narx va nima uchun yozilganmi?» · «So'zma-so'z va bosimsiz olinganmi?». Mentor misoli — **qabul**. 3 ga yetmaslik — tuzatish sababi emas (halol natija va keyingi qadam); bosim bilan olingan yoki o'zi yozgan «tasdiq» — **tuzatish**.
- Saqlanadi `pm-m11d9-tasdiq`.

### 1.10 Loyiha kuni: taklif havolasi va mukofot (10-dars)
- **12-Modul davomi:** «Havolani ulashish» lending manzilini `?kanal=ilova` bilan ulashardi — kim ulashgani bilinmasdi. Bugun har foydalanuvchining o'z **taklif havolasi**.
- **Mexanika (Mentor misoli):** har hisobga **taklif kodi** (`oyinchilar.taklif_kodi`, 6 belgi: katta harf va raqam) · havola — lending manzili `?taklif=<kod>&kanal=taklif` · lending kodni ko'rsatadi: «Taklif kodi: AB12CD» ·
  ro'yxatdan o'tish formasida maydon **«Taklif kodi (bo'lsa)»** — APK o'rnatilganda havoladagi kod ilovaga o'tmaydi, shuning uchun kod qo'lda yoziladi (Mentor qarori; `10-done` da kod katta harf bilan solishtiriladi — kichik harf muammosini 12-dars topadi, 1.12) ·
  yozilgani `oyinchilar.taklif_qilgan_id`. Ilovada «Havolani ulashish» endi shaxsiy havolani ulashadi (nomi o'zgarmaydi).
- **Sanoq:** lending — Umami `kanal=taklif` (tashrif) · Database — taklif kodi bilan ro'yxatdan o'tganlar · asosiy harakat — 12-Modul 9.23 SQL i shu hisoblar ichida.
- **Mukofot (REF-q0 A):** taklif qilgan odamga **Pro'ning bepul haftasi** (`pro_gacha` + 7 kun; pul ham, chegirma ham emas). Shart (REF-q1 A): taklif qilingan **yangi hisob** **asosiy harakatni** qilgach;
  o'zini taklif qilish (ikki hisob **bir qurilma ID** da) va namuna akkauntlar sanalmaydi; bitta odamga haftasiga ko'pi bilan **2** mukofot. Havola faqat tanish doiraga; «do'stingni taklif qil — sovg'a» bosimi yo'q.
- **Mentor natijasi (bir hafta):** taklif havolasi bilan lendingga tashriflar **18** (Umami — tashrifni sanaydi, qurilmani emas) · taklif kodi bilan ro'yxatdan o'tgan **7** hisob · ulardan asosiy harakatni qilgan **4** · shulardan **1** tasi taklif qilgan bilan bir qurilmada — sanalmadi · mukofot **3** ta (**2** tashkilotchiga) ·
  jami ro'yxatdan o'tgan **51** (44 + 7). Halol gap: «Bir hafta va 7 hisob — kichik son: taklif havolasi ishlaganini ko'rsatadi, o'sishni isbotlamaydi.»
- **Uch blok:** A1 — taklif kodi va havola (lending kodni ko'rsatadi) · A2 — formadagi kod va sanoq · A3 — mukofot va suiiste'mol qoidasi (bir qurilma, namuna, haftalik cheklov). Uyga vazifa yo'q.

### 1.11 Mahsulotingiz hozir qayerda? (11-dars)
- **Roadmap** (11-Modul 6-darsi, `pm-m9d6-roadmap`: uch ufq — hozir · keyinroq · uzoqroq) bilan hozirgi mahsulot solishtiriladi; har ish — **bajarildi** · **kechikdi** · **olib tashlandi** · **yangi qo'shildi** + bir qator sabab.
- **Mentor misoli** (11-Modul 1.5 roadmap'i): F1 o'yin e'loni va qo'shilish · F2 o'yin kuni tasdiq · F3 chiqish va navbat — **bajarildi** (11-Modul) · o'yindan oldin eslatma — **bajarildi** (12-Modul) · ro'yxat o'zi yangilanadi — **bajarildi** (12-Modul) ·
  maydon pulini bo'lishish — **uzoqroqda qoldi** (sabab: muammo gapidan kelmaydi; 2-darsda solishtirildi) · **yangi qo'shildi:** lending, Pro va test to'lov, Telegram xabari, taklif havolasi (sabab: 50 foydalanuvchi va pul — 12–13-Modul ishi).
- **Shaxsiy hisobot — uch savol** (DARS-q1 A): «O'z qarorim bilan nima qildim?» · «Qaysi qarorim noto'g'ri chiqdi va buni qaysi dalil ko'rsatdi?» · «Keyingi 4 haftada nima qilaman?».
  Mentor javoblari: 1) «Pro'ni o'yinchiga emas, tashkilotchiga qo'ydim.» · 2) «1-darsda narxni 10 000 deb o'yladim — xarajatni hisoblamagan edim; 4-darsdagi xarajat hisobi buni ko'rsatdi.» · 3) «To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.»
- **K17 Tesla** (5-bo'lim) — ko'prik: «Bu voqeada reja ochiq yozilgan va bosqichma-bosqich bajarilgan. Roadmap ham shuning uchun yoziladi: keyin nima bajarilganini solishtirish uchun.»
- **12-Modul 11-darsidan farqi:** u yerda pitch da'volari va dalillari; **11-Modul 15-darsidan farqi:** u yerda Demo Day oldidan reja va risklar. Bugun — ortga qarash: mahsulot va o'zim. 12 ekran, kod ekrani yo'q, repo'ga yozmaydi.
- Saqlanadi `pm-m11d11-refleksiya`.

### 1.12 Loyiha kuni: barqarorlashtirish (12-dars)
- **Besh tekshiruv** (asosiy yo'llar; har biri buzish yozuvi bilan — nima qildim · nima kutdim · nima bo'ldi): 1) kirish va ro'yxat · 2) asosiy harakat (o'yin e'loni, qo'shilish) · 3) to'lov oqimi (muvaffaqiyatli, rad, takror) · 4) taklif havolasi · 5) eslatma yoki Telegram xabari.
  Yangi funksiya qo'shilmaydi. Performance va «investor ko'zi bilan» demo-test — bu darsda yo'q (14-Modul ishi; o'quvchi matnida va'da qilinmaydi).
- **Mentor misoli natijasi:** 1, 2, 3 — **buzilmadi** · 4 — **buzildi**: taklif kodi kichik harf bilan yozilsa qabul qilinmadi → tuzatish: kod katta harfga o'tkazilib solishtiriladi ·
  5 — **buzildi**: ikki telefon bir vaqtda «O'yinlar» ni ochganda keyingi «Doimiy o'yin» ikki marta yaratildi va Telegram xabari ikki marta ketdi (agent 4-darsda «bir marta yaratiladi» degan — tekshirilmagan da'vo edi) →
  tuzatish: Database cheklovi — bitta doimiy o'yin seriyasida bitta sana uchun bitta o'yin; ikkinchi urinish jimgina o'tkazib yuboriladi (3-darsdagi «takror xabar» g'oyasi — bir ish bir marta). Ikkalasi «Tuzatish qilindi», qayta tekshiruvda takrorlanmadi.
  (07.10 o'zgardi — 9.26: eski 5-topilma «Pro tugagan tashkilotchining o'yini yana e'lon qilindi» 7-darsdagi oferta 4-bandi va 5-dars A1 bilan zid edi.)
- **`XATOLAR.md`** (repo ildizida): har topilma — usul · natija · holat (tuzatildi / qoldi + sabab). Qolgan topilma — yashirilmaydi.
- **Uch blok:** A1 — besh tekshiruv · A2 — eng muhim 1–2 muammoni tuzatish (yozuv bilan) · A3 — qayta tekshirish, `XATOLAR.md`, yangi versiya (push; brauzer ko'rinishi — qayta eksport; APK — yangi o'rnatish fayli, havola almashtiriladi — 12-Modul 9.28).

### 1.13 Mentor misolining sonlari — bitta jadval (13-Modul; boshqa son yo'q)

| Dars | Son | Birlik · yorliq |
|---|---|---|
| boshlanish (12-Modul 1.13) | ro'yxatdan o'tgan 44 (11 sinfdosh) · asosiy harakat 24 · qaytganlar 61 dan 26 (43%) · to'lgan o'yinlar 1, keyin 3 | hisob · qurilma · o'yin |
| 1 | tashkilotchilar **6** · kanallarga pul **0 so'm** · narx taxmini **10 000 so'm / 30 kun** · **3 oy** · keltiradigan pul **30 000 so'm** · «agar»: **60 000 so'm → 12 kishi → 5 000 so'm**, **1** tashkilotchi → **60 000 so'm** | Mentorning taxmini (narx, oy, «agar») |
| 2 | tashkilotchilar **6** (SQL) | hisob, namunasiz |
| 4 | Render pullik veb-xizmat **7 dollar/oy ≈ 83 000 so'm** (kurs 11 790,79, 07.10.2026) · narx **15 000 so'm / 30 kun** · 6 × 15 000 = **90 000 so'm** | rasmiy narx · Mentorning taxmini |
| 6 | 3 suhbat: **ha** (15 000) · **yo'q** · **qimmat** (10 000) | yozuv |
| 8 | qaytmagan **35** qurilma (61 − 26) · Mentor yozgan **5**: «bilmadim» **3** · «o'chirdim» **1** · javobsiz **1** | qurilma · odam (yozuv) |
| 9 | so'ralgan **6** · tasdiq **3** (15 000 — 2, 10 000 — 1) · «hozir yo'q» **2** · javobsiz **1** · Mentor tekshiruvi — qabul | odam (rol) |
| 10 | taklif havolasi bilan tashrif **18** · ro'yxatdan o'tgan **7** · asosiy harakat **4** · bir qurilma — **1** · mukofot **3** (2 tashkilotchiga) · jami **51** | tashrif (Umami) · hisob |
| 12 | 5 tekshiruv: buzilmadi **3** · buzildi **2** → tuzatildi **2** | tekshiruv |
Har xil o'lchovdagi sonlar (qurilma · hisob · tashrif · odam) bir-biridan ayirilmaydi. Mentor misolida Telegram'ni ulaganlar soni va Pro'ni test rejimda yoqqanlar soni **yo'q** — to'qilmaydi.

## 2. Atamalar (bir ma'no — bir so'z; ATAMA-q0 A, q1 A)

Oldingi modullardan o'zgarmaydi: Backend · Database · agent (Antigravity) · prompt · talab (qayerda · nima qilsin · nima buzilmasin) · tekshirish (o'z ishi) · sinov (faqat real odam bilan) · bosh raqam · metrika · foiz · gipoteza · muammo gapi · pitch ·
Mentor tekshiruvi (qabul / tuzatish) · yakkama-yakka · roadmap · ufq (hozir · keyinroq · uzoqroq) · asosiy harakat («hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan») · maxfiy kalit · shaxsiy ma'lumot · maxfiylik siyosati · lending · kanal · post ·
qadamlar · qaytganlar foizi · qurilma ID · sanoq sahifasi · sanoq yozuvi · eslatma · jonli xabar · buzish yozuvi · «Tuzatish qilindi» · da'vo · dalil (son yoki yozuv · manba · qachon) · trek · deploy · APK · brauzer ko'rinishi · login · webhook (7-Modul).

| So'z | Ma'nosi (ta'rif — so'zma-so'z) | Ishlatilmaydi |
|---|---|---|
| jalb qilish narxi | bir davrda kanallarga sarflangan pul ÷ shu davrda kelgan yangi foydalanuvchilar (1-dars); kartochkada bir marta «inglizchasi: CAC» | CAC (prozada), akvizitsiya |
| foydalanuvchi keltiradigan pul | bitta foydalanuvchidan butun foydalanish davomida keladigan pul; sodda hisob — narx × necha oy to'laydi (1-dars); kartochkada «inglizchasi: LTV» | LTV (prozada), «foydalanuvchi qiymati» («qiymat» — 4-darsda boshqa ma'noda) |
| to'lovchi | pul to'laydigan foydalanuvchi; Mentor misolida — Pro oladigan tashkilotchi (1-dars); ikki son bitta to'lovchi uchun solishtiriladi | mijoz (bu ma'noda), xaridor |
| pullik kanal | pul to'lab post chiqariladigan kanal — faqat 1-darsdagi «agar» mashqida; reklama narxi haqida fakt aytilmaydi | reklama kanali («reklama» — 2-darsda model nomi) |
| monetizatsiya modeli | mahsulot qanday pul topishi (2-dars); dars nomida — «pul topadi» | biznes-model (bu ma'noda) |
| bepul asos va pullik qo'shimcha | asosiy ish hamma uchun bepul, qo'shimcha qulaylik pullik; kartochkada «inglizchasi: freemium» | freemium (prozada), «shareware» |
| pullik obuna | ma'lum muddatga to'lanadigan foydalanish (Mentor: Pro — 30 kun); **doim ikki so'z** (ATAMA-q1 A) | «obuna» yolg'iz (kanal obunasi bilan aralashadi), podpiska |
| reklama · B2B · tranzaksiya | reklama — boshqa kompaniya e'loni uchun to'laydi · B2B — boshqa biznes to'laydi · tranzaksiya — har to'lovdan ulush (bu darsda; 11-Modul 14-darsidagi Database tranzaksiyasi — boshqa ma'no, 1.5 da «bitta tranzaksiyada» faqat REPO/Yordamda) | — |
| Pro · «Doimiy o'yin» | Pro — Mentor ilovasining 30 kunlik pullik obunasi; «Doimiy o'yin» — Pro'dagi bitta qulaylik: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi | premium, VIP |
| narx · xarajat · raqobat · qiymat | narx — odam to'laydigan pul · xarajat — mahsulotni ushlab turish uchun sarflanadigan pul · raqobat — odam bugun shu ishni nima bilan qiladi · qiymat — mahsulot odamga nima beradi (4-dars) | tannarx, kompetitor, «value» |
| to'lov taklifi ekrani | ilovada pullik qulaylik bosilganda chiqadigan ekran: nima ochiladi, narx, «To'lovga o'tish»; kartochkada «inglizchasi: paywall» | paywall (prozada), «pullik devor» |
| to'lov sahifasi · to'lov xizmati | to'lov sahifasi — brauzerda ochiladigan, odam to'laydigan sahifa · to'lov xizmati — pulni qabul qiladigan kompaniya (Click, Payme) | ekvayring, platyojka |
| to'lov xabari | to'lov xizmati Backend'ga yuboradigan xabar (to'landi yoki rad etildi); texnik nomi — **webhook** (7-Modulda o'tilgan) | callback, notifikatsiya |
| imzo | xabar haqiqatan to'lov xizmatidan kelganini ko'rsatadigan belgi: xizmat uni maxfiy kalit bilan hisoblaydi, Backend o'sha kalit bilan qayta hisoblab solishtiradi (3-dars) | podpis, «sign» (prozada) |
| takror xabar | bitta to'lov haqidagi xabar ikki marta kelishi; to'lov raqami bir marta sanaladi (3-dars); kartochkada «inglizchasi: idempotency» (12-Modul «takror hodisa» naqshi) | dublikat, idempotentlik (prozada) |
| rad etilgan to'lov | to'lov o'tmagan holat: yoziladi, Pro yoqilmaydi; ekranda «To'lov o'tmadi» | failed payment, «xato to'lov» |
| test rejim | real pul yechilmaydigan to'lov holati; bu modulda — «mashq to'lov» bilan; kartochkada «inglizchasi: sandbox» | sandbox (prozada), «test holati» (12-Modul eslatma testi — boshqa ma'no) |
| mashq to'lov | o'quvchi o'z Backend'ida quradigan test to'lov sahifasi va xabari: karta so'ralmaydi, pul yechilmaydi | soxta to'lov, fake |
| oferta | hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan; odam to'lasa — shu shartlarga rozi bo'ladi (FK 369-modda — ommaviy oferta) | dogovor (bu ma'noda), «qoidalar» |
| suhbat (pul haqida) | narx haqida real odam bilan savol-javob; sotish emas (6-dars) | sotuv, ko'ndirish, «skript-sotuv» |
| tasdiq | odamning yozma javobi: «narx X bo'lsa, … uchun to'layman»; real to'lov emas (9-dars). ⚠️ «kelishini tasdiqladi» (qadam) — boshqa ma'no: 9-darsda faqat «yozma tasdiq» | predzakaz, oldindan to'lov |
| taklif havolasi · taklif kodi | har foydalanuvchining o'z havolasi va 6 belgili kodi (10-dars); kartochkada «inglizchasi: referral» | referal (prozada), invite |
| mukofot | taklif uchun beriladigan narsa — Mentor misolida Pro'ning bepul haftasi (pul emas) | bonus, sovg'a, keshbek |
| Telegram xabari | Backend Telegram bot orqali yuboradigan xabar (8-dars); «eslatma» — telefon ekraniga ilova chiqaradigan xabar (12-Modul) — ikkalasi aralashmaydi | push, rassilka |
| barqarorlik tekshiruvi | asosiy yo'llarni buzish yozuvi bilan tekshirish (12-dars) | stabilizatsiya (prozada), QA |
| XATOLAR.md | topilmalar ro'yxati fayli (12-dars) | bug-list |

**Bir darsda bir ma'no (T-015):** «hodisa» — 13-Modulda faqat analitika (sanoq yozuvi) ma'nosida, kam ishlatiladi · «qiymat» — faqat 4-dars usuli · «tasdiq» — 9-darsda «yozma tasdiq»; qadam «kelishini tasdiqladi» o'z nomi bilan ·
«test» — ballik savol yoki «test rejim»; «sinov» — faqat real odam · «xabar» — to'lov xabari (3, 5) / Telegram xabari (8) / jonli xabar (12-Modul) — har darsda birinchi uchrashganda to'liq nomi bilan · «obuna» — doim «pullik obuna».

## 3. Repo — Mentor misoli `maydon-jamoa` (davomi) va o'quvchining o'z repo'si

- **Mentor repo'si:** `github.com/Azizbekcrypto/maydon-jamoa` (bu seans faqat «qur» da, buyruq bilan yozadi). Teglar `m13-dars-NN-start` / `m13-dars-NN-done` (`yechim` tarmog'ida); **`m13-dars-01-start` = `m12-dars-10-done`**.
  Papkalar: `mobil/` · `backend/` · `prototip/` · `lending/` (o'zgarmaydi; yangi fayllar ichida).
- **O'quvchi:** o'z final repo'sida, o'z mahsuloti va trekida — har blokning hamma qadami. «Ortda qoldingizmi» — darsda bir marta, birinchi blokda (12-Modul SABOQ 39):
  `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m13-dars-NN-done` — **o'z repo'ngizdan tashqarida, yangi papkada**; «oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi».
- **`.env`:** `backend/.env` — `DATABASE_URL`, `JWT_SECRET`, `SANOQ_KALITI` (12-Modul) + **`TOLOV_KALITI`** (3-dars) + **`TELEGRAM_BOT_TOKEN`**, **`TELEGRAM_SIR`** (webhook `secret_token`, 8-dars) — hammasi maxfiy kalit. Agentga xato yuborilganda: faqat xato qatori.
- **Push odati:** `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil, `.env` ro'yxatda yo'q; `git add <fayl>` (`git add .` / `-A` emas).

| Teg | Dars | Repo holati (dars oxirida) |
|---|---|---|
| `m13-dars-01…02` | 1, 2 · PM | repo'ga yozilmaydi (`-done` = `-start`) |
| `m13-dars-03-done` | 3 · webhook | `tolovlar` jadvali · `POST /tolov/webhook` (imzo `X-Imzo`, takror, rad) · `GET /tolov-mashq` sahifasi («To'lash (mashq)», «Rad etish (mashq)», «Ikki marta yuborish», «Imzosiz yuborish») · `TOLOV_KALITI` · `README.md` «To'lov» |
| `m13-dars-04-done` | 4 · narx | `oyinchilar.pro_gacha` · `GET /men` da `pro`, `proGacha` · to'lov taklifi ekrani · «Har hafta takrorlansin» va keyingi o'yin `GET /oyinlar` da · webhook Pro'ni 30 kun uzaytiradi |
| `m13-dars-05-start` | 5 · boshlanish | = `04-done`; `README.md` da eslatma: «bu holatda ikki muammo bor — 5-darsda topiladi» (1.5) |
| `m13-dars-05-done` | 5 · to'lovni buzish | «Kechiktirib yuborish», «Noto'g'ri imzo» tugmalari · ikki muammo tuzatilgan (Pro bir marta · «Javob kutilmoqda» va qayta so'rash) · «To'lov o'tmadi», Pro tugashi · `BUZISH.md` «To'lov» |
| `m13-dars-06-done` | 6 · PM | = `05-done` |
| `m13-dars-07-done` | 7 · hujjatlar | `lending/oferta.html` · `lending/maxfiylik.html` ga to'lov bandi · «Pro shartlari» havolasi (lending, to'lov taklifi ekrani) |
| `m13-dars-08-done` | 8 · Telegram | `oyinchilar.telegram_chat_id` · bir martalik kod · Telegram webhook (`TELEGRAM_SIR`) · «yana e'lon qilindi» xabari (haftasiga ≤2) · «Telegram'da xabar olish» / «Telegram xabarlarini o'chirish» · `telegramdan-ochdi` · siyosatga qator |
| `m13-dars-09-done` | 9 · PM | = `08-done` |
| `m13-dars-10-done` | 10 · taklif | `oyinchilar.taklif_kodi`, `taklif_qilgan_id`, `qurilma_id`, `mukofot`, `mukofot_vaqti` (9.36) · lending kodni ko'rsatadi · formada «Taklif kodi (bo'lsa)» · mukofot (Pro + 7 kun; bir qurilma, namuna, haftasiga ≤2) |
| `m13-dars-11-done` | 11 · PM | = `10-done` |
| `m13-dars-12-done` | 12 · barqarorlik | ikki tuzatish (taklif kodi katta-kichik harf · keyingi doimiy o'yin bir marta — Database cheklovi) · `XATOLAR.md` · yangi versiya |

## 4. Darslar — qisqa topshiriq

| № | Fayl (MD) | Tip · ekranlar | Darsning bitta natijasi | Keys | Kalit (o'qiydi → yozadi) | Kod mexanikasi | Eng yaqin namuna (MD + FILTR) |
|---|---|---|---|---|---|---|---|
| 1 | `01-PmUnitEconomics-v3.md` | PM (keyssiz) · 12–14 | o'z mahsuloti uchun jalb qilish narxi va foydalanuvchi keltiradigan pul — taxmin yorlig'i bilan | keyssiz | `pm-m10d10-hisobot`, `pm-m10d6-kanallar` → `pm-m11d1-birlik` | kod oynasi (JS): ikki funksiya | 12M `10-PmUsersCheck-v3.md` · 12M `12-PmGrowthPitch-v3.md` (kod oynasi) |
| 2 | `02-PmMonetization-v3.md` | PM · ≈15–16 | beshta modeldan biri asoslangan tanlov | K2 Telegram Premium | `pm-m9d5-prd`, `pm-m11d1-birlik` → `pm-m11d2-model` | Neon SQL: tashkilotchilar soni | 12M `10-PmUsersCheck-v3.md` (keys K5 ekrani, Neon) · 12M `01-PmLanding-v3.md` |
| 3 | `03-PaymentWebhook-v3.md` | TEX (cho'qqi) · 18–20 | to'lov oqimi sxemasi + webhook testi (imzo, takror, rad) | keyssiz | `pm-m9d8-platforma` → `pm-m11d3-oqim` | kod oynasi (takror tekshiruvi) + 2 repo bloki | 12M `02-WebSocketBasics-v3.md` · 12M `05-BreakAndFix-v3.md` · 10M `05-SecurityBasics-v3.md` |
| 4 | `04-PmPricing-v3.md` | PM+PRAKT · 12 | asoslangan narx; to'lov taklifi ekrani test rejimda ishlaydi | keyssiz | `pm-m11d2-model`, `pm-m11d3-oqim` → `pm-m11d4-narx` | 2 amaliyot bloki | 12M `07-PmFiftyUsers-v3.md` · 12M `03-PmRealtimeSpec-v3.md` |
| 5 | `05-PaymentDay-v3.md` | loyiha kuni · 12 | to'lov oqimi to'liq; to'rt usul bilan buzilgan, topilgani tuzatilgan va qayta tekshirilgan | keyssiz | `pm-m11d4-narx` → `pm-m11d5-buzish` | 3 blok | 12M `05-BreakAndFix-v3.md` · 12M `04-LiveNotifyDay-v3.md` |
| 6 | `06-PmMoneyTalk-v3.md` | PM (keyssiz) · 12 | skript; rol o'yini; narx bo'yicha real suhbatlar yozuvi (darsda va uyda — 3 tagacha) | keyssiz | `pm-m11d4-narx`, `pm-m9d3-intervyu` → `pm-m11d6-suhbat` | kod ekrani yo'q | 12M `06-PmChannels-v3.md` · 11M `03-PmInterviewsOne-v3.md` · 12M `11-PmPitchReview-v3.md` (12 ekranli shakl) |
| 7 | `07-PmTerms-v3.md` | PM+PRAKT · 12 | oferta va siyosatdagi to'lov bandi saytda | keyssiz | `pm-m11d4-narx` → `pm-m11d7-hujjat` | 2 amaliyot bloki | 10M `06-PmTrustAudit-v3.md` · 12M `07-PmFiftyUsers-v3.md` |
| 8 | `08-WinBackDay-v3.md` | loyiha kuni · 12 | Telegram xabari ishlaydi, o'chiriladi va sanaladi | keyssiz | `pm-m9d8-platforma` | 3 blok | 12M `09-RetentionDay-v3.md` · 12M `04-LiveNotifyDay-v3.md` |
| 9 | `09-PmPayCheck-v3.md` | PM (keyssiz) · 12 | kamida 3 yozma tasdiq (yoki halol natija) + Mentor tekshiruvi | keyssiz | `pm-m11d6-suhbat`, `pm-m11d4-narx` → `pm-m11d9-tasdiq` | kod ekrani yo'q | 12M `10-PmUsersCheck-v3.md` (Mentor tekshiruvi) · 12M `11-PmPitchReview-v3.md` |
| 10 | `10-ReferralDay-v3.md` | loyiha kuni · 12 | taklif havolasi, sanoq va mukofot ishlaydi | keyssiz | `pm-m9d8-platforma` | 3 blok | 12M `09-RetentionDay-v3.md` · 10M `02-EventTracking-v3.md` |
| 11 | `11-PmReflection-v3.md` | PM · 12 (qisqa) | roadmap bilan solishtirish va shaxsiy hisobot | K17 Tesla | `pm-m9d6-roadmap`, `pm-m9d15-reja` → `pm-m11d11-refleksiya` | kod ekrani yo'q | 12M `11-PmPitchReview-v3.md` · 11M `15-PmOneOnOne-v3.md` |
| 12 | `12-StabilizeDay-v3.md` | loyiha kuni · 12 | besh tekshiruv, 1–2 tuzatish, `XATOLAR.md`, yangi versiya | keyssiz | `pm-m11d5-buzish` | 3 blok | 12M `05-BreakAndFix-v3.md` · 12M `09-RetentionDay-v3.md` |

- **Ekran tuzilishi:** PM (keys bilan, ≈15–16) — 12-Modul 10-dars ritmi: QKirish · QReja · QTushuncha · QTest · QTushuncha · QTest · QVoqea (keys) · QTest · QMustaqil · QMustaqil · QKod · yakuniy QTest · podium · kartochkalar · yakun.
  Keyssiz PM (1, 6, 9, 11 — 12 ekran; 1-dars kod oynasi bilan 13–14): kirish · reja · tushuncha · test · tushuncha · test · mustaqil 1 · mustaqil 2 (juftlik + yakka rejim) · [kod oynasi] · yakuniy test · podium · kartochkalar · yakun.
  PM+PRAKT (4, 7 — 12): kirish · reja · tushuncha · test · tushuncha · mustaqil ish · A1 · A2 · yakuniy test · podium · kartochkalar · yakun.
  Loyiha kuni (5, 8, 10, 12 — 12): kirish · bugun quramiz · tushuncha · A1 · test · tushuncha · A2 · test · A3 · podium · kartochkalar · yakun. TEX (3 — 18–20): texnik dars (QTushuncha, QKod, QTest) + 2 repo bloki.
- **Amaliyot bloki** — 12-Modul modeli aynan: 4 band (Ochish → Prompt → Ishga tushirish → Tekshirish), o'quvchining o'z repo'sida; `{…}` joylari yonida kulrang «masalan: …» (Mentor misolidan), o'ngda «kutilgan natija · namuna: Maydon Jamoa», «Yordam» — Mentor misolidagi to'liq prompt.
  Prompt — qayerda · nima qilsin · nima buzilmasin; agentga — sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Blok bajarilgani — faqat oxirgi (tekshiruv) «Bajardim»idan (12-Modul 9.36 h).
- **Trek:** har blokda mobil va web yo'li; farq — «Ochish» qadamida yoki «Yordam»da bir gap. Trek `pm-m9d8-platforma.trek` dan; yo'q bo'lsa — o'quvchi tanlaydi.
- **Uyga vazifa:** PM va TEX — yakun kartasida (`HwCard`), o'z mahsuloti bo'yicha; loyiha kunlari (5, 8, 10, 12) — yo'q, ulgurmagan ish yakun sarlavhasida; **6-dars** — real suhbatlarning qolgani (3 tagacha).
- **Vaqt:** har dars ≈90 daqiqa; har MD A-bo'limida taqsimot. ⛔ Taqsimot — reja: «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas.
- **Oldingi / keyingi dars** — `00-NOMLAR.md`: 1-darsdan oldin «Zaxira dars» (12-Modul); 12-darsdan keyin «Zaxira dars».
- **PM darslarida kod mexanikasi ketma-ket takrorlanmaydi:** 1 — kod oynasi (JS) · 2 — Neon SQL · 4 — bloklar · 6 — yo'q · 7 — bloklar · 9 — yo'q · 11 — yo'q.

## 5. Keyslar — faqat K1–K19 banki (`PM_Prompt_v8.md`, PM-016) — Qaror-0 21

Qoida: bankdan tashqari keys, raqam, sana va natija qo'shilmaydi; raqam faqat yili bilan; «raqamsiz» keysga raqam qo'shilmaydi; Mentor gapida — bank so'zi (toraytirilmaydi, kuchaytirilmaydi); ko'prik — «umumiy joy», tenglik emas; sahna bankda yo'q natijani chizmaydi.
Keys ekrani — «Biznes olamidan», «{Brend} · N/M», nom o'z rangida, tanish maketda, jonli sahna (logotipsiz). Mashhur odamlar — faqat mahsulot qarori uchun.

| Dars | Keys | Bank matni (aynan shu faktlar) | Brend izohlari (S-018) | Darsdagi ko'prik |
|---|---|---|---|---|
| 2 | **K2 Telegram Premium** (mintaqaviy) | Pullik obuna 2022-yil iyunda ishga tushgan. Bepul Telegram qisqartirilmagan — Premium ustiga qulaylik qo'shadi. 2024-yilda obunachilar uch barobar ko'paygan (12 mln gacha; 2025-yil mayda — 15 mln), Telegram birinchi marta foydaga chiqqan. 2024-yil daromadi 1 mlrd dollardan oshgan (monetizatsiya darsida summa aytilishi mumkin — bank qoidasi) | «Telegram — xabar almashish ilovasi» · «Telegram Premium — Telegram'ning pullik obunasi» | bu voqeada bepul qism qisqartirilmagan, pullik qism ustiga qulaylik qo'shgan — Mentor ham o'yinchilar uchun bepul qismni qisqartirmaydi. «15 mln», «1 mlrd» — o'quvchiga maqsad emas |
| 11 | **K17 Tesla** | 2006-yilda Musk Tesla'ning «maxfiy master-rejasi»ni e'lon qilgan: avval qimmat sport mashinasi kichik seriyada → shu pulga arzonroq mashina → shu pulga ommaviy mashina. Reja ochiq bo'lgan va o'n yildan ortiq bajarilgan. Raqamsiz | «Tesla — elektromobil ishlab chiqaradigan kompaniya» | bu voqeada reja ochiq yozilgan va bosqichma-bosqich bajarilgan — roadmap ham keyin nima bajarilganini solishtirish uchun yoziladi |
1, 4, 6, 9-darslar va TEX, loyiha kunlari (3, 5, 8, 10, 12) — keyssiz. Bosh-keys modul ichida takrorlanmaydi; boshqa darsning keysi tilga olinmaydi.
Mintaqaviy qoida: K2 — 2-darsda (12-Modulda K1 12-darsda edi). Bankning ruscha asli — `PM_Prompt_v8.md` (grep «К2», «К17»).

## 6. Tekshirilgan faktlar (07.10.2026, rasmiy hujjat; agent boshqacha yozmaydi) — to'liq iqtiboslar `00-MANBA.md` 5-bo'limda

- **Stripe:** hisob ochiladigan davlatlar ro'yxatida O'zbekiston yo'q (stripe.com/global). Webhook: live — uch kungacha qayta yuboradi; sandbox — bir necha soatda uch marta; bir xabar bir necha marta kelishi mumkin; tartib kafolatlanmaydi; imzo `Stripe-Signature` (HMAC SHA-256); javob tez `2xx` (docs.stripe.com/webhooks).
- **Payme Business:** kassa bilan faqat yuridik shaxslar (YaTT ham); sandbox kaliti (TEST_KEY) — merchant kabinetida veb-kassa yaratilgach; kassada bitta Endpoint URL; protokol JSON-RPC 2.0, Basic-auth, `200` javob; so'rovlar faqat Payme IP manzillaridan;
  «javob yo'qolsa — xuddi shu so'rov qayta yuboriladi», sandbox ba'zi so'rovlarni ataylab ikki marta yuboradi — javob birinchisi bilan bir xil bo'lishi kerak; to'lanmagan tranzaksiya 12 soatda bekor; summa tiyinda (developer.help.paycom.uz).
- **Click:** Shop API — Prepare (`action = 0`) va Complete (`action = 1`); imzo `sign_string` = md5(`click_trans_id` + `service_id` + `secret_key` + `merchant_trans_id` + [`merchant_prepare_id` — faqat Complete'da] + `amount` + `action` + `sign_time`);
  xato kodlari: `0` Success · `-1` SIGN CHECK FAILED · `-2` Incorrect parameter amount · `-3` Action not found · `-4` Already paid · `-5` User does not exist · `-6` Transaction not found · `-8` Error in request from click · `-9` Transaction cancelled
  (rasmiy kod: github.com/click-llc/click-integration-django `click/utils.py`). Ma'lumotlar (`service_id`, `secret_key`) — Click Merchant'ga ulangandan keyin (rasmiy GitHub README).
- **Telegram Bot API:** «Bots can't start conversations with users. A user must either add them to a group or send them a message first.» (core.telegram.org/bots) · `start` parametri — `A-Z a-z 0-9 _ -`, 64 belgigacha (core.telegram.org/bots/features) ·
  setWebhook `secret_token` → sarlavha `X-Telegram-Bot-Api-Secret-Token`; javob `2XY` bo'lmasa, so'rov qayta yuboriladi (core.telegram.org/bots/api) · bitta chatga sekundiga bittadan ko'p xabar yuborilmaydi (bots/faq).
- **Render:** bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa; production uchun tavsiya qilinmaydi (render.com/docs/free, 06.10) · eng arzon pullik veb-xizmat — **7 dollar/oy** (render.com/pricing, 07.10).
- **Markaziy bank kursi:** 07.10.2026 — 1 AQSH dollari = 11 790,79 so'm (cbu.uz). Darsda «taxminan 83 000 so'm» — sana bilan.
- **Do'kon qoidalari:** Google Play — «Play-distributed apps requiring or accepting payment for access to in-app features or services … must use Google Play's billing system» (support.google.com/googleplay/android-developer/answer/9858738) · Apple 3.1.1 — App Store ilovalari uchun (developer.apple.com/app-store/review/guidelines).
- **Qonun (lex.uz/docs/-111189 — O'zbekiston Respublikasining kodeksi, qisqa «FK»; to'liq nomi lint qoidasiga soxta tushadi — MEXANIZM-TAKLIF):** 27-modda — 14–18 yoshli bitimlarni ota-ona (farzandlikka oluvchi, homiy) yozma roziligi bilan tuzadi; roziliksiz — o'z ish haqi va daromadini tasarruf etish, o'z intellektual faoliyati natijasi muallifi huquqi · 369-modda — ommaviy oferta (1.7 iqtibosi).
- **12-Moduldan (o'zgarmagan):** Expo Go — sinash vositasi; APK o'zi yangilanmaydi; brauzer ko'rinishi — Netlify, qayta eksport; Umami tashrif va hodisa; «Shaxsga doir ma'lumotlar to'g'risida»gi Qonun (10-Modul 6-darsi).

**Tekshirilmagan — MD da «Shubhali joylar»ga yoziladi, taxmin qilib to'ldirilmaydi:** Click va Payme komissiyasi (ochiq narx sahifasi topilmadi — darsda komissiya aytilmaydi) · Click test vositasi qayerda va kimga beriladi ·
Render bepul xizmatda kechikkan xabar real vaqtda qancha kutishi (mashqda «Kechiktirib yuborish» bilan almashtirildi) · Telegram'da botni bloklagan foydalanuvchiga yuborilganda qaytadigan javob · Neon'da `oyinlar.tashkilotchi_id` ustun nomi (11-Modul jadvali — «qur» da Mentor repo'sida) ·
O'zbekistonda YaTT yoki «o'zini o'zi band qilgan» bo'lish yosh chegarasi (darsda aytilmaydi) · Expo, Netlify, Telegram, BotFather tugma va menyu nomlari — umumiy so'z bilan.

## 7. Oldindan tuzatiladigan sinflar (12-Modulning 12 ta Filtr faylidan sanaldi + 12-Modul tayanchi 7 — MD yozishda BIRINCHI KUNDANOQ)

Sanoq: qaysi sinf 12-Modul `NN-FILTR.md` larining nechtasida **qabul** qilingan (o'z sanog'im, 07.10). Har MD oxirida agent shu ro'yxatni band-ma-band belgilaydi (`[x]` + ekran yoki `[—]` + sabab).

1. **90 daqiqa — reja, o'lchov emas** (11 dars: 01–05, 07–12). A-bo'limda vaqt taqsimoti; har blokda «Ulgurmasangiz» yo'li; tashqi kutish dars oqimini to'xtatmaydi; ⛔ «qur» pilotida taymer; «sig'adi» deyilmaydi.
2. **Tekshirilmagan tashqi qadam — «qur» darvozasi** (9 dars: 02–09, 12). Haqiqiy telefon, xizmat interfeysi, kechikish vaqti — «pilotda sinaladi» deb belgilanadi; tugma va menyu nomi, narx, limit — 6-bo'limdan yoki rasmiy manba va sana bilan; qolgani umumiy so'z.
3. **Saqlash kaliti — shartnoma** (8 dars: 01, 03, 05, 06, 08, 10, 11, 12). Har maydon nimani saqlashi, tipi (`bool | null`), uch holatli qiymat, real/mashq (`tur`), son yolg'iz emas (surati, maxraji, davri bilan), manba — haqiqiy yo'l; dars boshqa darsning kalitiga yozmaydi; kalitga ism, login, telefon yozilmaydi. Sxemalar — 8-bo'lim.
4. **Mentor misoli va kurs qolipi — umumiy qoida emas** (7 dars: 01, 02, 03, 06, 07, 09, 12). «Bu kursda …», «Bu mashqda …», «Mentor misolida …», «bu voqeada …»; kurs artefakti (to'rt band, uch savol, besh tekshiruv) o'quvchi mahsulotiga majburiy shakl emas.
5. **Kafolat va sabab da'vosi yo'q** (6 dars: 02, 03, 04, 05, 09, 12). «Har doim», «hech qachon», «o'zi tanlaydi» → «agentning tanloviga qoladi» · sahna sababni emas, natijani ko'rsatadi · «tuzatildi» → **«Tuzatish qilindi»** (ish fakti) va «qayta tekshiruvda takrorlanmadi» (natija) ·
   «isbot emas» — nimaning isboti emasligi aytiladi · «eslatma qaytardi», «to'lov ishlaydi», «tasdiq oldi = sotdi» kabi sabab da'volari yo'q.
6. **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** (6 dars: 04, 06, 07, 08, 09, 12). Blok bajarilgani — faqat tekshiruv «Bajardim»idan; yakun sarlavhasi 3–5 holatli, har biri rost; nishon tavsifi qilingan ishni aytadi, da'vo qilmaydi.
7. **Ta'rif sanaladigan va darsdagi amaliyotga mos** (5 dars: 06, 07, 08, 10, 11). Birligi aytiladi (qurilma · hisob · odam · tashrif); ikki o'lchov bitta nomda emas; «eng kam», «eng past» — darsda nechtasi olinsa, shunga mos.
8. **Test: bitta himoyalanadigan javob** (5 dars: 02, 05, 08, 11, 12). Distraktor turkumi bir xil bo'lmaydi (kamida bittasi boshqa qoidani buzadi); test izohida noto'g'ri model yo'q; ikkinchi variant ham to'g'ri bo'lib qolmasin; savol mijoz/o'quvchi nuqtai nazaridan.
9. **Real odamlar xavfsizligi** (5 dars: 06, 07, 08, 10, 12). Ota-ona bandi Mentor bilan yopilmaydi; sinfda qo'l ko'tartirib sanash yo'q; o'quvchi Mentor nomidan tasdiqlamaydi («Mentorga ko'rsatdim»); spam va bosim yo'q; bir chatga 12–15 bir xil xabar yo'q; ixtiyoriy narsa majburiydek aytilmaydi.
10. **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** (4 dars: 03, 04, 05, 09). Tekshiruv akkauntini agent o'zi ochadi va `id` bo'yicha `WHERE` bilan o'chiradi; sinfdagi sun'iy yozuv haqiqiy sanoqdan chiqariladi.
11. **Web-trek teng yo'l** (4 dars: 02, 05, 08, 09). «Mahsulotingiz» (o'quvchi haqida); web usuli to'qilmaydi — bo'lmasa rasmiy yo'l yoki umumiy so'z.
12. **Mentor misoli ichki izchil** (4 dars: 08, 09, 11, 12). Bitta dalil ikki da'voda emas; Mentor gaplari darsdan darsga bir xil; keyingi darsning sonlari oldindan ochilmaydi; sahna uchun kerak bo'lgan har yangi tafsilot tayanchga.
13. **O'quvchi talabida Mentorning qarori yo'q** (3 dars: 05, 07, 10). Mahsulot qarori `{…}` joyida o'quvchida; qaytarib bo'lmaydigan o'zgarish — agent ro'yxat ko'rsatadi, o'quvchi «Davom et» deydi; koddan bilinmaydigan — «[savol]».
14. **Uyga vazifa yengil va aniq** (3 dars: 05, 06, 10). Hajmi real; maqsadga yetganlarga ixtiyoriy; loyiha kunida «uyda» yo'q.
15. **Ayb da'vosi yo'q** (2 dars + 4 MD supurish: 01, 02). «Bu sizning xatongiz emas», «xato ko'pincha sozlamada, sizda emas» → aniq keyingi qadam.
16. **Kelajak va'dasi yo'q** (2 dars: 01, 06). Lending, post, oferta, to'lov taklifi ekranida faqat hozir ishlaydigan narsa; «tez orada», «shu hafta chiqadi» yo'q.
+ **12-Modul tayanchi 7 (11-Modul sinflari)** — kuchda: holatga qarab yakun · da'vo isbot emas · maxfiy qiymat agentga va ochiq joyga chiqmaydi · tashqi xizmat haqida faqat rasmiy hujjat · har sonning manbasi va o'lchovi · tayanchda yo'q narsa to'qilmaydi ·
  saqlash kaliti o'qiydigan darsdan · test: bitta himoyalanadigan javob · keys: bank so'zi aynan · 90 daqiqa · bir ma'no — bir so'z · web-trek teng · agent va o'quvchi ishi ajratilgan · o'smir xavfsizligi.
+ **13-Modulga xos (pul):** real pul yo'q · karta ma'lumoti hech qayerda (maket, prompt, kalit, skrinshot) · «mashq to'lov» Payme/Click ko'rinishini taqlid qilmaydi · «test rejim» belgisi har to'lov ekranida · narx — «Mentorning taxmini» · suhbat va tasdiqda bosim yo'q · oferta — shablon, «yuridik maslahat emas».

**Tashqi auditda har safar RAD etilganlar (qayta ochilmaydi — Filtrda grep bilan qonun ko'rsatiladi):** hookdagi «Aynan!» / «Qiziq fikr!» (T-028, T-067 — kurs qonuni; 12-Modulda 9 darsda rad) · yakundagi «Keyingi dars — «…»» qatori (P-023, T-075; T-038 faqat va'dani taqiqlaydi) ·
Reja sarlavhasi — natija-gap (P-014) · PM kod ekrani sarlavhasi «…digan kod yozamiz» oilasi · o'quvchiga tayyor Backend yoki starter berish · ekranga qo'shimcha maydon yoki blok (P-008, ≤3 blok) · bank so'zini yumshatish · tasdiqlangan qarorlar (`GATE_M_JAVOB.md`).

## 8. Darslar orasida saqlanadigan natija (kalit `pm-m11dN-<nima>`)

Qoida: dars oldingi dars natijasini o'qiydi; yo'q bo'lsa — o'quvchi o'zi yozadi. Kod oynasi qoralamasi — `pm-m11dN-code`. Shaxsiy ma'lumot (ism, login, telefon, Telegram chat raqami) hech bir kalitga yozilmaydi. Har yozuvda `savedAt`.
⚠️ 2–12-darslar sxemalari — pilotlardan keyin (9-bo'lim) aniqlashtiriladi; pilot kalitlari (1, 3, 6) — shu holicha majburiy.

| Kalit | Yozadi | O'qiydi | Tarkib |
|---|---|---|---|
| `pm-m10d10-hisobot`, `pm-m10d6-kanallar` (12-Modul) | — | 1-dars | ro'yxatdan o'tganlar, kanallar |
| `pm-m9d5-prd`, `pm-m9d6-roadmap`, `pm-m9d15-reja`, `pm-m9d8-platforma`, `pm-m9d3-intervyu` (11-Modul) | — | 2 · 11 · 11 · 3, 8, 10 · 6 | muammo/yechim · roadmap · reja holatlari · trek · intervyu bergan odamlar (rol) |
| `pm-m11d1-birlik` | 1-dars | 2, 4-darslar | `{ tur: 'real' \| 'mashq', davr, kanallar: [{ nom, sarf, yangi }], jalbNarxi, kimTolaydi, narxTaxmin, oyTaxmin, keltiradi, xulosa: 'oqlaydi' \| 'zarar' \| 'nomalum', savedAt }` — `sarf` so'mda (0 bo'lishi mumkin); `yangi` = 0 bo'lsa `jalbNarxi` = null |
| `pm-m11d2-model` | 2-dars | 4, 7, 11-darslar | `{ model: 'freemium' \| 'obuna' \| 'reklama' \| 'b2b' \| 'tranzaksiya', kim, nima, bepul, sabab, rad: [{ model, sabab }], soni: n \| null, soniManba: 'database' \| 'taxmin' \| null, savedAt }` — `soni` — to'lovchi bo'lishi mumkin bo'lganlar; `soniManba` — Neon'dan sanalganmi yoki taxminmi (9.37) |
| `pm-m11d3-oqim` | 3-dars | 4, 5-darslar | `{ qatorlar: [{ id, kim, nima, kimga }] (3–6), test: { imzo: bool \| null, takror: bool \| null, rad: bool \| null }, savedAt }` — `id` barqaror; `test` — webhook testi natijasi (ish fakti) |
| `pm-m11d4-narx` | 4-dars | 5, 6, 7, 9-darslar | `{ xarajat: { oylik, manba }, raqobat, qiymat, narx, davrKun, ekran: { sarlavha, matn, tugma }, ishlaydi: bool, savedAt }` |
| `pm-m11d5-buzish` | 5-dars | 12-dars | `{ urinishlar: [{ usul: 'ikki' \| 'kech' \| 'rad' \| 'imzo', qildim, kutdim, boldi, buzildi: bool \| null, tuzatishQilindi: bool, qayta: 'takrorlanmadi' \| 'takrorlandi' \| null }], savedAt }` |
| `pm-m11d6-suhbat` | 6-dars (9-dars uy suhbatlarini qo'shadi) | 9, 11-darslar | `{ skript: [4], suhbatlar: [{ id, tur: 'real' \| 'mashq', kim (rol), hozir: string \| null, gap (so'zma-so'z), javob: 'ha' \| 'qimmat' \| 'yoq' \| 'javobsiz', narxi: n \| null, qachon }] (real 0–3 + mashq 0–1), xulosa: string \| null, savedAt }` — `kim` — rol, munosabat qavsda («tashkilotchi (mahalla guruhidagi tanish)»), ism emas · `hozir` — 1, 2-savol javobi (hozir nima qiladi, nimaga sarflaydi) · `gap` — 3, 4-savol javobi · `narxi` — «ha»da skriptdagi narx, «qimmat»/«yo'q»da 4-savolda aytilgan son, «javob yo'q»da `null` (9.6) |
| `pm-m11d7-hujjat` | 7-dars | 11-dars | `{ bandlar: [{ id, matn, savol: bool }] (6), siyosatBand, havolalar: { lending: bool, ekran: bool }, chiqdi: bool, savedAt }` |
| `pm-m11d9-tasdiq` | 9-dars | 11-dars | `{ soralgan: n, tasdiqlar: [{ id, kim (rol), narx, nima, gap, qachon, manba: 'chat' \| 'qogoz' }], hozirYoq: n, javobsiz: n, tekshiruv: 'qabul' \| 'tuzatish' \| 'topilmadi', tuzatishSabab \| null, savedAt }` |
| `pm-m11d11-refleksiya` | 11-dars (o'qiydi: `pm-m9d6-roadmap`, `pm-m9d15-reja`, `pm-m11d1-birlik`, `pm-m11d2-model`, `pm-m11d4-narx`) | — (14-Modul) | `{ ishlar: [{ nom, ufq, holat: 'bajarildi' \| 'kechikdi' \| 'olib-tashlandi' \| 'uzoqroqda' \| 'yangi', sabab }], javoblar: [string \| null × 3], savedAt }` (9.41) |
Loyiha kunlari (5 dan tashqari: 8, 10, 12) va 3-darsdan boshqa TEX qismi yangi kalit yozmaydi; 12-dars natijasi — repo'dagi `XATOLAR.md`.

## 9. To'lqin kelishuvlari (pilot MD lardan — 2-to'lqin uchun MAJBURIY)

Pilotlar: `01-PmUnitEconomics-v3.md` (PM) · `03-PaymentWebhook-v3.md` (TEX, cho'qqi) · `06-PmMoneyTalk-v3.md` (real suhbat). Manba — ularning «TAYANCHGA SAVOL» bo'limlari (07.10, o'z tekshiruvim); ChatGPT auditi Filtridan keyin to'ldiriladi.
**2-to'lqin uchun MAJBURIY.** Ziddiyat bo'lsa — shu bo'lim to'g'ri.

1. **To'lov namunalari (3-dars TS 3, 4):** to'lov raqami `m-101`, `m-102`… (mashq; soxta); Mentor hisobi `oyinchiId: 7`; imzo ko'rinishi qisqartirilgan (`7c1e…`) — kalitdan hisoblanmagan. Summa: 3-darsda **10 000** (1-darsdagi taxmin), 4-darsdan **15 000**.
   «Mashq to'lov» sahifasida qator **«Maydon Jamoa — Pro, 30 kun · {summa} so'm»** (nima uchun to'lanayotgani ko'rinadi); o'quvchida — `{nima uchun to'lov}`.
2. **Webhook javoblari (3-dars TS 5–7, 24):** tekshiruv tartibi — **imzo → takror → rad**; rad ham yoziladi va `200 { ok: true }` (sabab: «to'lovim qayerda?» desa, o'tmagan to'lov ham Backend'da ko'rinadi); `holat` faqat `tolandi` / `rad`, boshqasi — `400`.
3. **Imzo texnikasi (3-dars TS 9, 10):** imzo xom tana bo'yicha hisoblanadi (NestJS `rawBody`) va `timingSafeEqual` bilan solishtiriladi — faqat REPO va agent promptida; o'quvchi matnida «imzo mos keldimi» darajasida. ⛔ «qur»: `rawBody` 11-Modul loyihasidagi NestJS da.
4. **«Mashq to'lov» ichki yo'li (3-dars TS 11):** sahifa `POST /tolov-mashq/yubor` ga yuboradi, Backend xabarni imzolab o'zining ochiq manzilidagi `POST /tolov/webhook` ga haqiqiy so'rov qiladi. ⛔ «qur»: Render bepul xizmati o'z manziliga so'rov yubora olishi; bo'lmasa — webhook funksiyasi ichkaridan chaqiriladi (imzo tekshiruvi baribir o'tadi), MD va REPO yangilanadi.
5. **«server» so'zi:** bizning Backend haqida — faqat «Backend» («sahifa xabarni Backend'da imzolaydi»); «server» — faqat «boshqa kompaniya serveri» iborasida (haqiqiy to'lov xizmati). 07.10 da 3-darsda 4 joy tuzatildi.
6. **To'lov oqimi sxemasi (3-dars TS 12):** uch ustun — **kim · nima qiladi · kimga** (`pm-m11d3-oqim.qatorlar`); Mentor sxemasining 2-qatorida «kim» — **Tashkilotchi** (to'laydi yoki rad etadi), 1-qatorda «kimga» — Brauzer. `test` maydoni: «Kutilganidek» → `true`, «Boshqacha» → `false`, bosilmagan → `null`.
7. **4-darsdan mashq sahifasi himoyasi (3-dars TS 23 — qaror):** Pro webhook bilan yoqila boshlagach, «To'lovga o'tish» avval Backend'dan (token bilan) **yangi to'lov raqamini** oladi — `POST /tolov/boshlash` → `{ tolovRaqami, havola }`; «mashq to'lov» sahifasi faqat shu raqam bilan ishlaydi (raqamsiz yoki begona raqam — xato). Haqiqiy xizmatlarda ham avval chek yaratiladi (Payme «Инициализация платежей» — tayanch 6).
8. **Atama «tekshiruv»:** dastur so'zi «webhook testi» o'quvchi matnida — **«tekshiruv»** (T-015: «test» — ballik savol yoki test rejim); kalit maydoni `test` ichki.
9. **«skript» (6-dars TS 1):** hozircha Qaror-0 so'zi bilan **«skript»** (ta'rifi 6-darsda: «suhbatda beriladigan savollar ro'yxati»). Muqobil «suhbat savollari» — GATE M sahifasida foydalanuvchiga savol (9-Modulda «Umami skripti» kod ma'nosida; ruschada «скрипт» sotuvga yaqin). Javobgacha 9-dars ham «skript».
10. **Suhbat yozuvi (6-dars TS 3, 6–10):** `pm-m11d6-suhbat` — 8-bo'lim jadvali (yangi `hozir`; «real 0–3 + mashq 0–1»; `kim` — rol + munosabat qavsda; `narxi` qoidasi; `xulosa` — string yoki null). **Uy suhbatlari** 9-darsda kiritiladi (yo'q bo'lsa — o'quvchi o'zi yozadi); 6-dars qayta ochilib yozuv qo'shilmaydi.
11. **«Pul olinmaydi — "ha" desa ham»** (6-dars TS 11): «ha» — so'z, to'lov emas; to'lov sahifasi va «mashq to'lov» havolasi suhbatdagi odamga berilmaydi (6, 9-darslar).
12. **To'laydigan rol tanishlar orasida bo'lmasa** (6-dars TS 20 — qaror): model reklama yoki B2B bo'lgan o'quvchi — real suhbat faqat to'lashi mumkin bo'lgan rol bilan; tanish doirada yo'q bo'lsa — mashq yozuvi va halol natija («to'laydigan rol tanishlarim orasida yo'q»); notanish biznesga yozilmaydi.
13. **Darsdagi real suhbat** (6-dars TS 12): faqat sherik o'quvchi mahsulotida to'laydigan rol bo'lsa; ko'p o'quvchida darsda faqat mashq yozuvi — yakun bu holatni rost aytadi.
14. **Sotish gaplari (anti-namuna, 6-dars TS 5):** ekranda «Mentor bunday demaydi» belgisi bilan; ichidagi da'vo («boshqa tashkilotchilar ham oldi») — yolg'onligi ochiq: bu misolda hech kim olmagan.
16. **1-dars atamalari (1-dars TS 1, 2):** «to'lovchi» va «pullik kanal» — 2-bo'lim jadvalida (07.10 qo'shildi); 2, 4, 9-darslar shu so'zlar bilan.
17. **Asosiy fikr (1-dars TS 7):** «… bu misolda jalb qilish narxi bepul kanallarda 0 so'm, keltiradigan pul esa hozircha taxmin» — 0 so'm fakt, taxmin emas (1.1 tuzatildi).
18. **«O'zini oqlaydi» — faqat kanal xarajati bo'yicha (1-dars TS 18):** muhr yonida yorliq «kanalga sarflangan pul bo'yicha»; mahsulotning boshqa xarajatlari — 4-darsda. Sarflangan pul 0 bo'lsa ham shu muhr — ostida halol qator majburiy.
19. **`pm-m11d1-birlik` aniqlashtirildi (1-dars TS 3–5, 12):** `kanallar` — o'quvchi bilsa kanal bo'yicha, bilmasa bitta birlashgan qator (`nom` — kanal nomlari vergul bilan) · `kimTolaydi` — rol matni · `'hamma foydalanuvchi'` · `null` («Hozircha bilmayman») ·
    `xulosa` — `'oqlaydi'` · `'zarar'` · `'nomalum'` (tenglik va to'lovchilar soni noma'lum holat — `'nomalum'`) · `tur: 'mashq'` sonlari keyingi darslarda o'quvchining haqiqiy sonlari deb ko'rsatilmaydi (kulrang «mashq sonlari»).
20. **Mentor davri (1-dars TS 6):** jalb qilish narxi uchun davr — «ishga tushgandan keyingi ikki hafta» (12-Modul 1.13: ikki hafta o'tib 44).
21. **Pro 1-darsda (1-dars TS 8):** «Mentorning rejasi» yorlig'i bilan (ilovada hali yo'q); 2-darsda — Mentor tanlovi va sababi; 4-darsdan — ilovada.
22. **Tashkilotchilar 6 (1-dars TS 13):** 1-darsda Mentor fakti sifatida aytiladi; 2-darsdagi Neon SQL — o'quvchi o'z to'lovchi bo'lishi mumkin bo'lganlarini sanaydi, Mentor misolida natija 6 (1-dars bilan bir).
23. **To'lovni boshlash yozuvi (4-dars TS):** `POST /tolov/boshlash` yangi to'lov raqamini alohida jadvalga yozadi (`boshlangan_tolovlar`), `tolovlar` ga emas — aks holda 3-darsdagi takror tekshiruvi birinchi to'lov xabarini «takror» deb olardi.
24. **Pro uzaytirish (4-dars TS):** Pro yo'q yoki tugagan — bugundan +30 kun; Pro bor — muddat oxiridan +30 kun. Ilovada qator «Pro: {sana}gacha»; to'lov taklifi ekranidan orqaga qaytish bor.
25. **`GET /men` (4-dars):** 13-Modulda yangi yo'l (11–12-Modulda yo'q edi): token bilan; `pro` (`pro_gacha` hozirdan keyin), `proGacha`; tokensiz `401`.
26. **«Doimiy o'yin» Backend tomoni:** `oyinlar.doimiy` (sukut — yolg'on); `POST /oyinlar` da `doimiy: true` faqat Pro'dagi tashkilotchidan, aks holda `403` · keyingi o'yin `GET /oyinlar` so'ralganda, oldingisining vaqti o'tgan bo'lsa — `kun + 7`, o'sha soat, maydon, kerakli odamlar, tashkilotchi (4-dars) ·
    **Pro muddati tugashi** — 5-dars A1 da (keyingi o'yin faqat Pro muddati ichida yaratiladi; e'lon qilinganlar qoladi) → 7-darsda oferta 4-bandi kodda **bor** · **bir vaqtdagi ikki so'rovda takror yaratilish** — 12-dars topadi (1.12, 5-tekshiruv).
27. **Mashq to'lov va real foydalanuvchilar (4-dars TS):** test rejimda Pro'ni mashq to'lov bilan istalgan hisob yoqa oladi (pul yo'q) — GATE M sahifasida foydalanuvchiga savol (A: shunday — test rejim belgisi bilan; B: faqat namuna va tekshiruv akkauntlariga).
28. **Modeli boshqa o'quvchi (4-dars TS):** modeli reklama, B2B yoki tranzaksiya bo'lsa — mashq uchun bitta pullik qulaylik quradi (o'z mahsulotidagi eng yaqin); bo'lmasa — «Ochish» qadamida bir gap.
29. **Siyosat to'lov bandi (7-dars TS 1; 7-dars Shubhali):** «Qaysi ma'lumot?» va «Nima uchun?» ga ikkiga bo'linadi; matni — 1.7 (aniqlashtirildi: kim to'lagani, holat, mashqda karta umuman so'ralmaydi).
30. **Havolalar (7-dars TS 2):** to'lov taklifi ekranida «Pro shartlari» va «Maxfiylik siyosati» — ikkalasi (Qaror-0 13); lendingda — ikkalasi pastki qatorda.
31. **`pm-m11d7-hujjat` (7-dars TS 3):** `bandlar[].savol` — `bool | null` (null — hali tekshirilmagan); `pm-m10d1-lending.manzil` o'qiladi (havolalar uchun).
32. **YaTT** — birinchi ko'rinishda «YaTT (yakka tartibdagi tadbirkor)» (T-036); keyin «YaTT».
33. **Yangi versiya va o'rnatish fayli (7-dars TS 5 — qaror):** ilova o'zgargan darslarda (4, 5, 7, 8, 10) — `git push` (Render) va brauzer ko'rinishi qayta eksport (12-Modul 9.28); **yangi APK** — faqat **10-darsda** (taklif kodi formasi odamlarga kerak) va **12-darsda** (ilova o'zgargan bo'lsa — 9.45). 4, 5, 7, 8-darslarda APK yangilanmaydi —
    Pro va Telegram ulanishi Expo Go yoki brauzer ko'rinishida tekshiriladi (EAS bepul rejasi oyiga 15 build, navbat sekin — tayanch 6).
34. **Tekshiruv akkauntlari (7-dars TS 6):** to'lov taklifi ekranini ko'rish uchun Pro'siz hisob kerak — 12-Modul tekshiruv akkaunti qoidasi (agent ochadi, `namuna = true`, ishdan keyin `id` bo'yicha o'chiriladi).
35. **5-dars bloklari va ikki muammo (5-dars TS 1, 2):** 1-amaliyot — «To'lov o'tmadi — qayta urinib ko'ring», ilovada «Javob kutilmoqda» (qaytganda bir marta so'raydi), Pro muddati tugashi, «mashq to'lov»ga ikki yangi tugma («Kechiktirib yuborish», «Noto'g'ri imzo» — 2-amaliyotda kod yozilmaydi);
    2-muammo tuzatishi — **sahifada** «Javob kutilmoqda» va ilovada **«Qayta tekshirish»** (1.5). Shunday qilib Mentor misolida 2-muammo 2-amaliyotda haqiqatan ko'rinadi. Har urinish oldidan Pro Neon'da bo'shatiladi (`WHERE id` bilan); muddat tugashi `pro_gacha = CURRENT_DATE - 1` bilan tekshiriladi.
36. **Taklif tafsilotlari (10-dars TS):** `oyinchilar.qurilma_id` (ro'yxatdan o'tishda va «Havolani ulashish» bosilganda yoziladi; «Hisobdan chiqish» uni o'chirmaydi) · `mukofot` (`berildi` · `bir-qurilma` · `namuna` · `cheklov` · `nomalum`) va `mukofot_vaqti` ·
    hafta — dushanbadan yakshanbagacha, cheklovga yetgan taklif keyingi haftaga o'tmaydi · Umami'ga taklif kodi yuborilmaydi · noto'g'ri kodda xabar chiqadi · «mukofot 3 (2 tashkilotchiga)» — uch mukofot ikki tashkilotchiga (biri ikkita).
    Tekshiruv: bir qurilma — o'z telefoni; boshqa qurilma — sherik yoki kompyuterdagi yashirin oyna (halol chegara: yashirin oyna ham «boshqa qurilma» bo'lib o'tadi); tekshiruv akkauntlari «Hisobni o'chirish» bilan o'chiriladi, Pro muddati agent orqali qaytariladi.
37. **2-dars kaliti (2-dars TS 1):** `pm-m11d2-model.soniManba` — `'database'` · `'taxmin'` · `null` (8-bo'lim). Reklama sababidan «foyda» so'zi olib tashlangan (K2 dagi «foydaga chiqqan» bilan bir darsda ikki ma'no bo'lmasin).
38. **Telegram xabari matni (8-dars TS 1):** «… yana e'lon qilindi · Mahalla maydoni — 0 / 10» — xabar yangi o'yin yaratilgan paytda ketadi; «3 / 10» ishlatilmaydi (1.8 tuzatildi).
39. **Bot va ulanish (8-dars TS 4 va ulanish tafsilotlari):** faqat **yangi bot** (7-Modul botining webhook'i o'z Backend'ida) · bir martalik kod — 16 belgi, 10 daqiqa amal qiladi · yo'llar `POST /telegram/kod` (ilova kod so'raydi) va `POST /telegram/webhook` (Telegram, `X-Telegram-Bot-Api-Secret-Token` bilan) ·
    bot nomi `getMe` orqali · takror `update_id` qayta ishlanmaydi (3-darsdagi takror xabar qoidasi) · bot faqat shaxsiy chatda yozadi · chat raqami Neon so'rovida ham ko'rsatilmaydi (`telegram_chat_id IS NOT NULL AS ulangan`).
40. **Haftalik chegara va havola (8-dars TS):** `telegram_xabarlar` jadvali — chegara faqat Telegram xabarlari uchun (ilova eslatmalari 12-Modul qoidasi bo'yicha alohida); hafta — dushanbadan yakshanbagacha, `Asia/Tashkent` · xabardagi havola brauzer ko'rinishini ochadi (APK havola orqali ochilmaydi) ·
    tekshiruv: agent o'tgan vaqtli 3 tekshiruv o'yinini tayyorlaydi, o'quvchi o'z Telegram'ida 2 xabar kelganini va 3-si kelmaganini ko'radi, keyin tekshiruv yozuvlari `id` bo'yicha o'chiriladi · Telegram'i yo'q o'quvchi — sherigining Telegram'ida yoki faqat kod va jadval bo'yicha (halol yo'l).
41. **11-dars holatlari (11-dars TS 1, 2, 4):** besh holat — **bajarildi · kechikdi · olib tashlandi · uzoqroqda qoldi · yangi qo'shildi** (Mentor misoli 1.11 dagi «uzoqroqda qoldi» shu ro'yxatga kiradi); holat **bugungi** holat bo'yicha, ufqqa qarab qo'yiladi —
    F3 «Chiqish va navbat» 11-Modul 15-darsida «kechikdi» bo'lgan, bugun — «bajarildi» (kartada «11-Modulda kechikkan edi» qatori bilan). Kalitga `ufq`; `javoblar` — `string | null`. Dalil tugmasi `pm-m11d1-birlik`, `pm-m11d4-narx` dan o'qiydi.
42. **Mentorning 3-javobi (11-dars TS 6):** «To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.» — «tasdiq» so'zi shu darsdagi «O'yin kuni tasdiq» (F2) bilan to'qnashmasin; «test rejimda» — real to'lov emasligi aniq (1.11 tuzatildi).
43. **«tekshiruv akkaunti»** — 12-Modul atamasi, butun modulda bitta so'z (07.10: 07, 08, 10, 12 va tayanchdagi 106 ta «tekshiruv hisobi» almashtirildi); ilova tugmalari «Hisobdan chiqish», «Hisobni o'chirish» — o'zgarmaydi.
44. **12-dars tafsilotlari (12-dars TS):** sahnadagi tekshiruv «Doimiy o'yini» — **«Juma, 18:00 · Mahalla maydoni»** (namuna o'yin «Shanba, 18:00» bilan to'qnashmasin); 5-tekshiruv usuli — agent tekshiruv o'yinining vaqtini o'tgan haftaga suradi, ikki telefonda bir vaqtda «O'yinlar» ochiladi ·
    `XATOLAR.md` qatori — usul · natija · «Tuzatish qilindi · qayta tekshiruvda takrorlanmadi» yoki «qoldi + sabab» · uchinchi belgi «Mahsulotimda hali yo'q» (tekshiriladigan yo'l o'quvchi mahsulotida bo'lmasa) · qaysi topilma avval tuzatiladi — foydalanuvchiga ta'sir qiladigani (pul, ma'lumot) birinchi.
45. **Yangi versiya 12-darsda (12-dars TS 5; 9.33 aniqlashtirildi):** Mentor misolida ikkala tuzatish `backend/` da — yangi versiya faqat Render'da; APK va brauzer ko'rinishi — ilova o'zgargan bo'lsagina (o'quvchi uchun shartli).
46. **9-dars tafsilotlari (9-dars TS):** Mentor xabari (chatda) — MD 9 dagi matn, o'zgarmas qator bilan «Bu to'lov emas — pul so'ramayman. Yozmasangiz ham bo'ladi.» · javob bermaganlar — 5 va 6-tashkilotchi (2-tashkilotchi va 5-tashkilotchi — «hozir yo'q», 6-tashkilotchi — javobsiz) ·
    darsda xabar faqat 6-darsdagi real suhbatdoshga yoki to'lovchi sinfdoshga, ota-ona biladigan tanish doirada; qolgani uyda · ko'p o'quvchida darsda yozma tasdiq 0 — yakun buni rost aytadi.
47. **`pm-m11d9-tasdiq` qo'shimchalari (9-dars TS 6):** `xabar` (yuborilgan matn), `keyingiQadam` (3 ga yetmasa), `tekshiruv: null` (hali tekshirilmagan) va o'zgarmas shart (`tasdiqlar[].gap` va `narx` bo'sh emas); `pm-m11d2-model.kim` o'qiladi.
    Darsdan keyin kelgan yozma tasdiqlar kalitga kiritilmaydi — o'quvchining o'z yozuvida qoladi va 11-darsdagi shaxsiy hisobotda tilga olinishi mumkin; `pm-m11d6-suhbat.xulosa` 9-darsda yozilmaydi.
15. **3-savol — bo'lajak harakat haqida** (6-dars Shubhali 3): skript avval o'tgan va hozirgi ishni so'raydi (1, 2-savol), 3-savol javobi «so'z — hali to'lov emas», «narx haqida dalil, isbot emas» deb chegaralanadi (11-Modul intervyu qoidasi bilan ziddiyat — chegarasi shu).

## 10. Ruscha lug'at (6-RU bosqichi uchun; grep bilan o'lchangan — 9, 10, 11, 12-Modul kodi, 51 fayl, 07.10.2026)

Qoida (11-Modul saboqi): ruscha atama taxmin bilan yozilmaydi — avval oldingi modullardagi ruschasi o'lchanadi; lug'atda yo'q atama — RU bosqichida o'lchanadi va hisobotga yoziladi. Ekrandagi nom = matndagi nom (maket ru da qanday ko'rinsa, Mentor gapi shunday ataydi).

| uz | ru | o'lchov (joy) · izoh | ishlatilmaydi |
|---|---|---|---|
| «Maydon Jamoa» · tashkilotchi · o'yinchi | «Maydon Jamoa» (lotincha) · организатор · игрок | 67 · 421 | Майдон, админ |
| Backend · Database · deploy | Backend · Database (lotincha) · деплой | деплой 26 (lotincha deploy 11 — eski) | бэкенд, база данных |
| «Yordam» (tugma, panel) | «Подсказка» | 9–11-Modul hammasi; 12-Modulda ba'zan «Помощь» — 13-Modulda faqat «Подсказка» | «Помощь» |
| «Bajardim» · «Davom etish» · «Ortda qoldingizmi» | «Готово» · «Продолжить» · «Отстали?» | 24 · 649 · 15 | «Сделал» |
| Mentor misolida · Mentorning taxmini | в примере Ментора · Предположение Ментора | 156 · 2 | пример наставника |
| Mentor tekshiruvi · qabul · tuzatish | проверка Ментора · принять · исправить | 10 (11-Modul lug'ati) | проверка наставника |
| talab · agent · prompt · tekshirish · sinov | требование · агент · промпт · проверка · тест | 299 · — · — · 587 · 206 | ТЗ, испытание |
| dalil | довод | 80 (11-Modul: «довод, не доказательство»; telefondagi isbot ma'nosida — «подтверждение») | — |
| qadam · foiz · gipoteza · sanoq | шаг · процент · гипотеза · подсчёт | 322 · 82 · 28 · 53 | доля |
| lending · kanal · post · havola | лендинг · канал · пост · ссылка | 54 · 82 · 118 · 117 | — |
| eslatma · jonli xabar | напоминание · живое сообщение | 114 · 38 (12-Modul) | уведомление (eslatma ma'nosida) |
| maxfiylik siyosati · «Hisobni o'chirish» | политика конфиденциальности · «Удалить аккаунт» | 17 · 12-Modul | — |
| Telegram bot | Telegram-бот | 9, 10-Modul | бот (yolg'iz, odam haqida) |
| narx · to'lov | цена · оплата | 18 · 22 | стоимость, платёж (prozada) |
| mashq (mashq to'lov) | тренировочный (тренировочная оплата) | «mashq intervyu» → «тренировочное интервью» (9-Modul) | фейковый, учебный |
| test rejim | тестовый режим | ⚠️ 12-Modulda «test holati» (eslatma testi) ham «тестовый режим», 11-Modulda «тестовое состояние» — 13-Modulda «test holati» ishlatilmaydi | песочница (prozada) |
| xavfsizlik · imzo | безопасность · подпись | 9 · 3 | — |
| **Yangi (13-Modul; RU bosqichida o'lchab tasdiqlanadi):** jalb qilish narxi · foydalanuvchi keltiradigan pul · pullik obuna · to'lov taklifi ekrani · to'lov xabari · takror xabar · rad etilgan to'lov · oferta · tasdiq (yozma) · taklif havolasi · mukofot | стоимость привлечения · деньги от пользователя · платная подписка · экран оплаты · уведомление об оплате · повторное уведомление · отклонённая оплата · оферта · письменное подтверждение · пригласительная ссылка · награда | taklif — RU bosqichida qayta ko'riladi; «приглашение» 9–12-Modulda 1 joy | — |
