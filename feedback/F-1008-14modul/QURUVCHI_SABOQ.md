# 14-Modul — quruvchi saboqlari (MAJBURIY; 08.10.2026, 1-to'lqin pilotlari: 01, 03)

> Har quruvchi / sadoqat / vizual / tuzatuvchi agent topshirig'iga shu fayl qo'shiladi. Uch manba: (A) 9–13-Modul saboqlari — foydalanuvchining qat'iy qoidalari;
> (C) 14-Modul MD lari, ChatGPT auditi Filtrlari (`NN-FILTR.md`, F-1008-559…571), GATE M (`GATE_M_JAVOB.md`), tayanch 9.1–9.90;
> (P) 14-Modul pilot ko'rigi — foydalanuvchi ko'rgach shu yerga yoziladi. Umumiy qonunga muhrlash — asosiy seansda.

## A. Oldingi modullar saboqlari — TO'LIQ o'qing

1. `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` (1–18) · `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` (A, B, C 19–31) · `feedback/F-1005-11modul/QURUVCHI_SABOQ.md` (D 32–39) ·
   `feedback/F-1006-12modul/QURUVCHI_SABOQ.md` (C va E 40–55 — 12-Modul pilot ko'rigi) · **`feedback/F-1007-13modul/QURUVCHI_SABOQ.md` (A 4-band «eng muhimlari», C kelishuvlari, P 1–9 — 13-Modul pilot ko'rigi, eng yangisi)** —
   beshalasi shu modulga to'liq tegishli. U yerdagi kalitlar (`pm-m8dN…`, `pm-m11dN…`) — O'SHA modullarniki; bu modulda — tayanch 2 va 8 (pastda C).
2. Fidbek rasmlari: `feedback/F-1005-10modul/rasm/F-1005-174-*`, `F-1005-175-*`, `feedback/F-1005-11modul/rasm/F-1006-270-1dars-*.png` — o'z ekran turingizga o'xshashini Read bilan ko'ring.
3. **Tayyor namuna (faqat ko'rish; kod bo'lagi ko'chirilmaydi, darslar mustaqil — JR-14):** 13-Modul pilotlari (foydalanuvchi ko'rigidan o'tgan) —
   TEX: `src/11-Modull/PaymentWebhookLesson.jsx` (`TolovSahna`, `MashqSahifa`, `QKod` + `HtmlCompiler`, `ScreenBlok` bloklari, tekshiruv kartasi, `AiDavomCard`) ·
   PM: `src/11-Modull/PmMoneyTalkLesson.jsx` (`SuhbatVaraq`, QMustaqil ketma-ket karta, `.mt-katak` sanoq, yakun holatlari) ·
   12-Modul PM pitch: `src/10-Modull/PmGrowthPitchLesson.jsx` (`BeshDaqiqaSahna`, `ZAL_SAVOL`, `TEXNO_RE`, `normT`, pitch forma va detektorlar — 01 uchun eng yaqin) · `PmPitchReviewLesson.jsx` (roadmap solishtirish).
   Skelet tuzoqlari u yerda qanday chetlab o'tilganini ko'ring (`.zoomable.zoom-on`, `ou(eyebrow)`, `fon(T.accent)`, test ustidagi yorliq yo'q, `QKOD_ONG`).
4. Eng muhimlari (unutilsa — ekran RAD; 13-Modul SABOQ A4 + P1–P9 aynan): navbatdagi harakat doim ko'rinadi (bitta tugma — halqa, puls 3 marta, `scale` yo'q; variantlar — har birining o'z yengil chegarasi) ·
   bashorat tanlangach ixcham qator · taxmin natijasi yashil xulosa qutisining birinchi kichik qatori, `QIzoh` — oxirgi kichik qatori (E 42) · kartochkalar alohida ekran, Mentorsiz ·
   ekranda ≤ 3 blok · bo'sh ustun va matnsiz bo'sh chiziq yo'q · yakuniy holat bitta natija bloki, 1280×800 ga sig'adi · telefon maketi CHAPDA (≈170×272) · maketda hech narsa kesilmaydi (E 41) ·
   yashirin bosish yo'q · **odam figurasi chizilmaydi (P1)** — rol yorlig'i + pufak; zarur bo'lsa faqat 9-Modul `PmInterviewsOneLesson` dagi `Odam` · QKirish maketi ustunga sig'adi (P2) ·
   yo'riqnoma ko'rinmagan narsaga ishora qilmaydi — sanoq katakchalari (P3) · `max-content` + `zoom` taqiq (P5) · `.q-dd-chip` override yo'q (P7) · nom qatori `!tugadi` bilan yashirilmaydi (P8) ·
   son va chip qator oxirida bo'linmaydi — NBSP / `nowrap` (P9) · ⛶ ishlaydi · stilsiz element yo'q (`python3 feedback/F-1005-10modul/stilsiz.py <fayl>`) · ko'p maydonli bo'lak — bittadan (E 53) ·
   yakun — standart tarkib, «Bugungi asosiy fikr» qutisi yo'q (E 50), sarlavha har holatda rost (E 54) · har harakatli tugmani brauzerda haqiqiy click bilan sinang (E 47).

## C. 14-Modul kelishuvlari

- **MD = manba-haqiqat.** GATE M (`14M-GATE-1`, 08.10, F-1008-558) va 13 dars ChatGPT auditi Filtrlari (`NN-FILTR.md`) MD ichiga allaqachon kiritilgan — o'quvchi ko'radigan har `uz` satr MD dan so'zma-so'z.
  «✎», «Izoh (MD)», «Harakat → Vizual o'zgarish», «KOD», «REPO», «Manbalar», «TAYANCHGA SAVOL», «Shubhali joylar», «O'lchov», «GATE M — o'z tekshiruvim», «Oldindan tuzatiladigan sinflar», «(F-1008-NNN)», «(9.NN)» — ko'rsatma, ekranga chiqmaydi.
  «O'qituvchi eslatmasi» — faqat Mentor rejimida (MD aytgan joyda). Shubha bo'lsa — o'z `NN-FILTR.md` ingizni oching (hukm va sabab u yerda). Matn noqulay tuyulsa — o'zgartirmang, hisobotda «MD ga taklif».
- **MD ↔ SABOQ ziddiyati (vizual):** SABOQ ustun, matn MD dan o'zgarmaydi; har holat hisobotda «MD dan chetlashish (SABOQ N)».
- **Tayanch 9.1–9.90 — modul bo'yi kelishuvlar (`00-MODUL-TAYANCH.md` 9-bo'lim) — o'z darsingiz raqami tilga olingan har bandni o'qing.** Eng ko'p qaytadiganlari:
  hook javobi «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067), olib tashlanmaydi; sof so'rovnoma (J-026) — bitta javob uchala variantga ·
  tayanchdan tashqari son yo'q (1.14 — Mentor sonlari jadvali; Lighthouse va kod hajmi — ⛔ `MENTOR_OLCHOV` `null`, sahna «—») · universal ta'riflar «bu darsda» / «bu kursda» · kafolat so'zlari yo'q (T-020) ·
  «Keyingi bo'lak» tugmasi yo'q (9.70, 9.90) · markaziy artefakt ekranlarida `optionalLive` yo'q · PII detektori yozma maydonlarda (9.26: «@», «t.me/», «+998», 7+ raqam, havola bloklaydi; ism — kulrang qator) ·
  o'sish qadami «yetdi», bayramsiz (9.30) · mustaqil ish ikki qatlam — minimal → yaxshilash (9.31) · teg faqat tekshirilgan versiyaga, agent chatida parol yo'q (9.57, 9.58) ·
  Demo Day so'zi faqat 13-darsda (9.13) · nishon nomi — PM «!» bilan, Kod «!» siz (9.23).
- **Taqiqlar — `00-TAQIQLAR.md` (o'qing).** Eng muhimi: investitsiya so'ralmaydi (pul summasi, ulush yo'q) · video — ixtiyoriy yuz/ism, havola kalitga yozilmaydi · yosh va rasmiy shartlar taxmin qilinmaydi ·
  hakamlar, investorlar ismsiz, gapi o'ylab topilmaydi · ichki kodlar o'quvchi matnida yo'q (A1/A2, `m12-NN`, «pilot», «TAXMIN», K12) · belgi-formula (→, =, +) o'quvchi izohida yo'q.
- **Atamalar** — `00-MODUL-TAYANCH.md` 2-bo'lim aynan (bir ma'no — bir so'z): «hakam» (1-darsda tug'iladi) · «Raqamlar» (Metrikalar emas) · «Keyingi qadam» (Keyin emas) · «savol-javob» · «hikoya» · «tezlik» (Lighthouse bahosi) ·
  «yuklanadigan kod hajmi» · «keyin yuklash» · «demo o'tishi» · «demo tekshiruvi» · «yangi funksiya to'xtatildi» · «stajirovka» · «Backend», «Database». Inglizcha nomlar tarjima qilinmaydi (Lighthouse, Expo, Render, Netlify, Upwork, Y Combinator, Diamond Challenge, Demo Day).
- **Saqlanadigan natija kalitlari** — tayanch 8 jadvali aynan (`pm-m12dN-…`; maydon nomlari ham; kod qoralamasi `pm-m12dN-code`). Boshqa dars o'qiydigan kalitni o'zgartirmang; kalitga ism, login, telefon, havola yozilmaydi.
  Oldingi modullardan o'qiladigan kalitlar (`pm-m9d8-platforma`, `pm-m10d12-pitch`, `pm-m10d10-hisobot`, `pm-m11d9-tasdiq`, `pm-m11d11-refleksiya`) bo'lmasa ham ekran ishlaydi (MD aytgan yo'l).
  **Haqiqiy shakllar (grep 08.10):** `pm-m10d12-pitch.bolaklar` = `{ muammo: { gap, dalil }, yechim: { gap, foydalar[] }, demo: {…}, raqamlar: { grafik[], nima, bosh, halolGap, manba }, keyingi: string }` (`src/10-Modull/PmGrowthPitchLesson.jsx` 609–626, 629–632) ·
  `pm-m10d10-hisobot` = `{ kunlar, royxat: { soni, manba, sana? }, tuzatishQator? }` (`PmUsersCheckLesson.jsx` 1362, 1445) ·
  `pm-m11d9-tasdiq` — 13-Modul tayanchi 8: `{ soralgan, tasdiqlar: [{ id, kim, narx, nima, gap, oldingiGap, qachon, manba, hisobga: bool }], aniqlashtirish, hozirYoq, javobsiz, tekshiruv, tuzatishSabab, savedAt }` —
  **13-Modul 9-dars kodi hali qurilmoqda (boshqa seans); kalit kodda yo'q — 01 «hisobga olinadigan tasdiqlar soni» = `tasdiqlar.filter(t => t.hisobga).length`, kalit yo'q bo'lsa — MD yo'li (9.28).**
- **Mentor misoli — «Maydon Jamoa»** (repo `maydon-jamoa`): nom o'z rangida (11-Modul 9.62 yashili — `src/9-Modull`, `src/10-Modull`, `src/11-Modull` darslaridagi rang bilan bir), logotip yo'q;
  namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10»; telefon maketi — 12/13-Modul darslaridagi ko'rinish (faqat ko'rish). Airbnb (K12) — `Brend` komponenti, #FF5A5F, logotipsiz, slaydlar oq, son yozilmaydi.
- **Amaliyot bloklari (TEX):** `ScreenBlok` + `QBlok` + `QPrompt`; hammasi o'quvchining o'z repo'sida. Agentga yoziladigan prompt matni sen-formada (MD aynan) — `lint:til` ogohlantirishi kutilgan, error emas.
  `{…}` yonidagi kulrang «masalan: …», «Yordam», «Ulgurmasangiz», tekshiruv kartasi «Kutilganidek» / «Boshqacha» (MD dagi joyda; dars holatida — `ccProgress`) — o'z faylingizda kichik o'rovchi bilan, **`src/qolip` ga tegilmaydi**, hisobotda «qolip taklifi».
  Blok «bajarildi» bayrog'i — faqat oxirgi (tekshiruv) «Bajardim»idan; «Davom etish» — MD aytgan qadamdan keyin (E 55); «Ortda qoldingizmi» — faqat MD aytgan blokda (03 — A1).
  Tartib (9.40, 9.45): lokal tekshiruv → `git status` → push → deploy → deploy'da tekshiruv. Quruvchi repo yaratmaydi; GitHub, Netlify, Render, Expo'ga hech narsa yubormaydi; `maydon-jamoa` ga tegmaydi.
- **Trek** — `pm-m9d8-platforma.trek` (`mobil` | `web`): MD dagi trek qatorlari; kalit yo'q bo'lsa — MD aytgan yo'l (03 — A1 chiplari).
- **Yakun** — MD dagi hamma holat sarlavhasi (har biri rost — E 54), ✓ va nishon faqat to'liq holatda; standart tarkib E 50; uyga vazifa — `HwCard` (alohida `.homework.jsx` yo'q); ichki skroll qutisi yo'q.
  AI bilan davom kartasi (PM-109, 13-Modul SABOQ P4) — faqat sherik/juftlik/real suhbat/tashqi kutish bor darsda, MD yakun bandida bo'lsa aynan; bo'lmasa — hisobotda «MD ga taklif» (01 va 03 da MD da yo'q — qo'shilmaydi).
- **Skelet tuzoqlari** (skelet 05.10 dan beri tuzatilmagan — o'z faylingizda hal qiling): test ustidagi «To'g'ri javobni tanlang» yo'q · `bashorat={!taxmin && …}` ishlatilmaydi ·
  `practice: ou(title)` → `ou(eyebrow)` · `QZ_BG_SHAPES` — darsning o'z atamalari (`{ uz, ru }`, emoji va «Frontend/Backend» yo'q) · `rgba(255,79,40,…)` → `fon(T.accent)` ·
  `QKod` o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi · global `.mentor` klassi bilan to'qnashmang (dars elementlariga o'z prefiksi: 01 — `.ip-`, 03 — `.tz-`) ·
  ⛶: `.zoomable.zoom-on` qoidasi (E 48) + `.q-fokus:has(.zoom-on)` va voqea konteyneri `:has(.zoom-on) { animation: none; transform: none; }` ·
  `HtmlCompiler` faqat birinchi JS faylni ulaydi va tekshiruv 50 ms da async ni kutmaydi — 03 11-ekran tekshiruvlari sinxron (atribut), «Tugma siljishi» qatori `namuna.js` da; `IMG_FALLBACK` `src` siz `<img>` da ishlamaydi (03 MD KOD 10).
- **Har darsda qaytgan sinflar (birinchi kundanoq):** o'quvchi javobini tekshiruvchi regex — ikki tilli · `tr()` modul darajasida chaqirilmaydi (render ichida yoki funksiyada) · maket va chat satrlari `{ uz, ru }` ·
  sonli ruscha satrlarda ko'plik shakli · ekrandagi nom = matndagi nom · o'quvchi gapidagi «N-ekran» — hisoblagich 1 dan sanaydi (MD 0 dan) · detektorlar **PM-108: kamida 10 namuna bilan `node` da** sinaladi, natija hisobotga.
- **Agent tuzog'i:** Write/Bash `\uXXXX` ni harfga aylantirishi mumkin — kirill va belgilarni to'g'ridan-to'g'ri yozing; CSS shablon-satri ichida (izohda ham) BACKTIK yo'q; bir qatorli funksiya ichida `//` yo'q.
- **Lokal server:** 14-Modul porti **5176** (5175 — 13-Modul, 5174 — 12-Modul, 5173 — AILM, 5300 — 11-Modul; ularga tegmang). Server ishga tushirmang va to'xtatmang.
- **Hali sinalmagan narsalar («qur» darvozalari — ⛔):** Mentor lendingining Lighthouse va kod hajmi sonlari (03 `MENTOR_OLCHOV` — `null`), LCP elementi va rasm o'lchami, 90 daqiqa taymeri (01, 03), 10-ekran olti bo'lak 1280×800 (01).
  Dars fayli MD bo'yicha quriladi (`null` → «—»); sinov boshqacha chiqsa — MD va dars keyin birga tuzatiladi. Hisobotda «sinalmagan» ro'yxati.
- **App.jsx** — asosiy seans ulaydi (`m12-01`, `m12-03` — `comp` qo'yilgan); quruvchi App.jsx ga tegmaydi. `src/11-Modull` (13-Modul) boshqa seansda qurilmoqda — faqat o'qing.

## P. 14-Modul pilot ko'rigi (foydalanuvchi) — ko'rgandan keyin yoziladi

Foydalanuvchi 08.10 kunduzi 1-darsni ko'rdi — 7 fidbek (F-1008-573…579). 1-darsda tuzatildi; sinflar 2-to'lqinda OLDINDAN qo'llanadi:
1. **Asosiy tinglovchi — bitta urg'uli karta, bir nechta kichik yorliq emas** (574, 576). Uchta mayda «hakam ?» yorlig'i UI ni buzadi va urg'u yo'qoladi. Bitta karta: accent 2px chegara, rol belgisi (1-darsda portfel; odam figurasi emas — 13-Modul P1),
   nomi katta (16px, 800), yonida uning savollari 15px — har birida «?» yoki yashil ✓; bir qatorda (nom va savollar yonma-yon). Namuna: `src/12-Modull/PmInvestorPitchLesson.jsx` `Investor`, `.ip-ivr`.
   MD da «uchta qiyofa», «hakam pufaklari», «6 ta kichik qiyofa» deyilgan joylar (02, 05, 08, 10, 13 — grep 08.10) — shu kartaga aylantiriladi; ko'p odam kerak bo'lsa — kichik doirachalar qatori (figura emas). Rol nomi — dars MD sidagi rol (1-darsda «Investor»; 5, 8, 13-darslarda — foydalanuvchi qarori kutilmoqda).
2. **Uzuq (dashed) chiziq ma'no bo'lagida yo'q** (574). Taymerdagi «savol-javob» kabi alohida bo'lak — yaxlit och accent (`accentSoft` + 1px ichki chegara), yorlig'i accent rangda. Uzuq chegara — faqat bo'sh uya / «hali tekshirilmagan» holati.
3. **«Uchadi» deyilgan harakat — ko'rinib uchadi** (575). Karta o'z joyiga (bo'lak ichidagi raqamli qatorga) ekranda uchib boradi (o'lchab, `position: fixed` nusxa, ~0,6 s), qator to'ladi; manbasiz/xato narsa — kulrang uzuq qator + silkinish. Bo'sh qatorlar oldindan ko'rinadi (raqamli, 13-Modul P3).
   «translateX(-70px) bilan yo'qolish» — rad (qayerga ketgani ko'rinmaydi). Tugagach sahna butun enga yoyiladi.
4. **PM drag-drop — karta dastasi** (577). 8-Modul `PmPitchRehearsalLesson.jsx` 8-ekran naqshi: o'ngda bittadan oq karta (2px accent, «n / N», qo'shtirnoqda gap, orqasida dasta soyasi), chapda uyalar; karta doim tanlangan — o'quvchi faqat uyani bosadi
   yoki kartani sudraydi (HTML5 drag). «Avval gapni tanlang, so'ng joyni bosing» ikki bosqichi — rad: sichqoncha bosishda 6+ px siljisa, tanlash sudrash deb o'qilib, gap joylashmay qolardi. To'q binafsha to'ldirilgan chip (`.q-dd-chip`) — faqat TEX darsdagi kod bo'lagi uchun.
5. **Asosiy natija matni kichik emas** (578). Sahna ichidagi bo'lak matni ≥14px, yakuniy natija (Mentor qoralamasi, o'quvchi pitchi) 15px; uzun gap «…» bilan kesilmaydi (2–3 qator). 1920×1080 da ham ko'zga kichik ko'rinmasin.
6. **Tugagan holat 1280×800 ga sig'ishi — haqiqiy bosish bilan o'lchanadi** (`feedback/F-1008-14modul/vositalar/yur.mjs`: ekranni oxirigacha bosib, `.q-xulosa` pastki chegarasi ≤ pastki panel tepasi). Shots vositasi faqat boshlang'ich holatni oladi — tugagan holatni ko'rsatmaydi.
7. **⛶ — vizualning o'z burchagida** (583). Skeletdagi `≥1200px: right: -42px` (kontentdan tashqarida) — rad; `top: 8px; right: 8px` (vizual ichida). Har darsda.
8. **Gap/ish tartibi — har darsda karta dastasi** (588; P4 kengaytirildi): TEX darsdagi yakuniy tartib ham (gaplar, kod emas) — to'q to'ldirilgan `.q-dd-chip` emas; `QTartib` o'rniga dars faylidagi dasta (`ProductSpeedLesson.jsx` `TartibDasta`), `QTushuncha` ichida (q15), `tugadi` bilan (q18), yechilgach bir ustun.
9. **Amaliyot bloki tugagach — kam element** (590): bajarilgan qadamlar ro'yxati yashirinadi (tugadi kartasi aytadi), «Ortda qoldingizmi» faqat blok davomida, o'ngda bitta asosiy natija (repo fayli). Qadam bo'yicha almashadigan Mentor gapi va bajarilgan qadamning yopilishi — foydalanuvchi tasdiqladi (589).
10. **Kartochka — qizil/zarg'aldoq emas** (593): orqa yuz `T.ink` (qolipdagi `#FF8A3D → accent` gradiyent o'rniga), old yuz chegarasi `fon(accent, .45)`, ipucha matni `ink2` (nuqta accent). PM darsida gradiyent zarg'aldoq-binafsha chiqardi.
11. **«Mehr» — real ko'rinish** (580–582, 584–586, 591, 592): sahna/maketda bo'sh, kichik, «—» bilan to'la, haqiqatga o'xshamagan narsa — rad. Haqiqiy sonlarsiz o'lchov maketi (ikki «—» doira) ko'rsatilmaydi. Tanish brend saytlari yo'nalishi — foydalanuvchi qarori kutilmoqda (08.10, jurnal F-580…593).

