# TUZATISH-SPETSIFIKATSIYASI — 7 bridge darsi PmLesson2 etaloniga (F-0924-01…10)

> **Muallif:** PM-Auditor (Aziz). Faqat spetsifikatsiya — kod tahrirlanmagan.
> **Manba-fidbek:** `feedback/F-0924-bridge-fidbek/FIDBEK_2026-09-24.md` + `img22…img29.png` (hammasi `BridgeKimUchun.jsx`dan).
> **Etalonlar:** `src/1-Modull/PmLesson2.jsx` (asosiy) · `PMLESSON2_ETALON_TARIX.md` 2-B/3-C/3-D/4 · `src/pm/PmUserStoryLesson.jsx` (P0) ·
> `src/1-Modull/PmLesson1.jsx` (Facebook keysi, Garvard fotosi) · `src/1-Modull/DeployLesson.jsx` (AI qadami, nusxa-panel, qadamlar) ·
> `DARS_ETALON.md` 155/156-qonun · `MATN_KORPUS.md` §22.
> ⚠️ Satr raqamlari 2026-09-24 holatida. Tahrirdan oldin har birini grep bilan qayta tasdiqlang.

## 0. Ish qoidalari (hamma rollar uchun)

1. **Senariy matni o'zgarmaydi**: sarlavhalar, test savollari va variantlari, xulosa-gaplar, keys-slaydlar.
   Faqat **qo'shiladi**: mentor-gap, yo'riq, tugma matni, izoh, vizual. Tushunarsiz tugma yorlig'i
   («Tepani…», «Sarlavhani almashtirish») almashtiriladi, chunki bu foydalanuvchining o'z fidbegi (F-0924-09).
2. Matn yozishdan oldin `MATN_KORPUS.md` o'qiladi (§22, §24, §27). Matn tegilgach `npm run lint:til <fayl>` 0 error.
3. Har tahrirdan keyin: `npm run gates -- <fayl>` (esbuild → jsx → dark → til → prompt) va `npm run lint:jsx` 0 topilma.
4. CSS izohiga **backtik yozilmaydi** (oq ekran xavfi, CLAUDE.md).
5. Dars nomlari suhbatda: «N-o'tish M-darsi «Nom»». Fayl nomi faqat qavsda. Qisqartmalar shu hujjatda:

| Qisqa | Fayl | Dars nomi |
|---|---|---|
| **B1** | `BridgeKimUchun.jsx` | «Kim uchun qilyapmiz?» (1-o'tish 1-dars · 2-o'tish 1-dars) |
| **B2** | `BridgeMuammoniTopamiz.jsx` | «Muammoni topamiz» (2-o'tish 2-dars) |
| **B3** | `BridgeBirinchiVersiya.jsx` | «Birinchi versiya va uni ko'rsatish» (2-o'tish 3-dars) |
| **B4** | `BridgeKimUchunMuammo.jsx` | «Kim uchun va qanday muammo?» (3/4-o'tish 1-dars) |
| **B5** | `BridgeNimaQuramiz.jsx` | «Nima quramiz va qachon tayyor?» (3/4-o'tish 2-dars) |
| **B6** | `BridgeQandayKorsatamiz.jsx` | «Qanday ko'rsatamiz?» (3-o'tish 3-dars) |
| **B7** | `BridgeMalumotIshonch.jsx` | «Ma'lumot, ishonch va «Qanday ishlaydi?»» (4-o'tish 3-dars) |

Ekran raqami — foydalanuvchi ko'radigan raqam (1 dan). Hamma fayl `src/bridge/lessons/` ichida.

---

# 1-BO'LIM. FIDBEK-SINFLARI

## SINF 1 — AI EKRANI (F-0924-01/02)

**Foydalanuvchi:** so'rov yig'mada yashiringan; uchta teng tugma bir qatorda — nima qilishni bilmadim; nusxalash bo'ldimi-yo'qmi noma'lum.

### (a) Etalonda qanday
- **So'rov doim ochiq, nusxa tugmasi panel boshida** — `DeployLesson.jsx:1199` `Screen4`, panel `1237–1244`:
  `.pr-panel` › `.pr-head` (`📝 AI uchun topshiriq` + `.pr-copy`) › `<pre className="pr-body">{text}</pre>`.
  Tugma: `copied ? '✓ Nusxalandi' : '📋 Nusxa olish'`, `.pr-copy.ok` — yashil fon. CSS `DeployLesson.jsx:3425–3431`.
- **Raqamli qadamlar** — `DeployLesson.jsx:743` `DoSteps`: `.dsx` karta, har qator `.dsx-row` + `.dsx-num` (1 → ✓),
  ochiq qadam `.open`, bajarilgani `.on`, keyingilari `.lock`; har qadamda `«✓ Bajardim»`; sarlavhada `0/4` sanog'i.
  CSS `3314–3340`. Qadam matni fe'l bilan boshlanadi: «`gemini.google.com` saytini oching, nusxalagan topshiriqni qo'ying va yuboring» (`:1331`).
- **Zaxira yo'l** — `DeployLesson.jsx:1257` `FallbackPanel`: `<details className="dsx-fb"><summary>🛟 Ochilmadimi?</summary>…`, **chap ustunda**,
  yopiq holatda. CSS `3416–3422`. Qonun: `DARS_ETALON.md` 155-qonun, 2-band («Zaxira yo'l ekranning O'ZIDA turadi — 🛟 sarlavhali yopiq `<details>`»).
- **Mentor-gap qadam ekranida** — `DeployLesson.jsx` `Screen5` (`mentor=`): «Qadamlar birma-bir ochiladi. Har birini kompyuteringizda bajaring va «✓ Bajardim»ni bosing.»
- AI nomi: sinfda **Gemini**, havola `gemini.google.com` (foydalanuvchi qarori 14.09).

### (b) Bridge'da qayerda buzilgan
Yettala darsda AI ekrani bitta qolipdan: `So'rovni ko'rish ▾` yig'masi (`open`/`promptOpen` sukutda `false`) + `📋 Nusxalash` + `gemini.google.com ↗` — raqamsiz, teng.
`copied` 2,2 soniyadan keyin `false`ga qaytadi, ya'ni «Nusxalandi» belgisi o'chib ketadi. Zaxira `Gemini ochilmasa ▾` — oddiy toggle-tugma, 🛟 `<details>` emas.
Mentor-gap hech birida yo'q. Navbat-pulsi faqat B5 da bor.

| Dars | Ekran | Komponent · satr | Yig'ma | Puls | Qo'shimcha |
|---|---|---|---|---|---|
| B1 | 17 | `ScreenAi` `:1456`, tugmalar `:1485–1487`, zaxira `:1491` | bor | yo'q | Senariydagi ekran-boshi gapi («AI sizga sarlavha variantlarini taklif qiladi. Qaysi biri qolishini o'zingiz tanlaysiz.», senariy 17-ekran) ekranga chiqmagan — o'rnida boshqa `lead-note` `:1479` |
| B2 | 15 | `ScreenAI` `:1581`, `:1614–1616`, zaxira `:1621` | bor | yo'q | — |
| B3 | 16 | `ScreenAi` `:1624`, `:1656–1658`, zaxira `:1662` | bor | yo'q | — |
| B4 | 16 | `ScreenAI` `:1416`, `:1450–1452`, zaxira `:1457` | bor | yo'q | — |
| B5 | 16 | `ScreenAI` `:1719`, `:1756–1758`, zaxira `:1763` | bor | bor | `:3377` — ikkalasi ochilsa so'rov ixcham oynaga yig'iladi (58-qonun) |
| B6 | 15 | `ScreenAi` `:1608`, `:1637–1639`, zaxira `:1643` | bor | yo'q | — |
| B7 | 16 | `ScreenAI` `:1580`, `:1614–1616`, zaxira `:1621` | bor | yo'q | — |

### (c) Retsept
- **Quruvchi:** 3-bo'limdagi `AiStep` komponentini yettala faylga qo'shadi va AI ekranining chap ustunini unga almashtiradi:
  1. so'rov `.pr-panel` ichida **doim ochiq** (`pr-body` `max-height: min(30vh,220px)` — ichida aylanadi, ekran skrollsiz qoladi, 58-qonun);
  2. uch raqamli qadam: **① So'rovni nusxalash → ② gemini.google.com ni ochish → ③ Javobni o'qib, bu yerga yozing**;
  3. ① bosilgach tugma **«✓ Nusxalandi»** bo'lib **qoladi** (2,2 soniyalik taymer olib tashlanadi), raqam ✓ ga aylanadi;
     ② havola bosilganda ✓; ③ o'ngdagi maydon to'lganda ✓ (`answered` prop);
  4. `Gemini ochilmasa ▾` → 🛟 `<details className="dsx-fb">` (chap ustun, yopiq), ichida hozirgi tayyor variantlar o'zgarishsiz;
  5. puls: `useTurnWalk` ① → ② bo'ylab (1-C, 88-qonun); ③ maydonning o'z pulsi (B1 `bfield` + `turnCls`).
- **Metodist:** har AI ekraniga mentor-gap (Sinf 2 qolipi). B1 uchun senariydagi yo'qolgan gapni shu gap sifatida qaytaradi
  («AI sizga sarlavha variantlarini taklif qiladi. Qaysi biri qolishini o'zingiz tanlaysiz. Avval so'rovni nusxalang.»).
  ③ qadam yorlig'i har darsda o'z maydonini nomlaydi (2-bo'lim jadvali).
- **Dizayn:** 1280×800 va 1440×900 da skrollsiz sig'ishini tekshiradi; `.pr-copy.ok` rangi `T.success` (DeployLesson aksenti to'q sariq edi — bridge'da `T.accent` binafsha).
- **Qonun-eslatma:** senariyda so'rov yig'maga 400 belgi qoidasi tufayli solingan edi (B1 senariy, E'tiroz 1). Foydalanuvchi F-0924-01 da uni bekor qildi → so'rov-quti belgi-hisobiga **kirmaydi**. Bu istisno `PM_DARS_ETALON.md`ga yangi raqamli qonun bo'lib muhrlanadi (tuzatishdan keyin).

---

## SINF 2 — MENTOR-GAP (F-0924-03)

**Foydalanuvchi:** mentor gapi faqat boshidagi 2 sahifada, qolganlarida umuman yo'q.

### (a) Etalonda qanday
- `PmLesson2.jsx` — **10 ta** `<Mentor>`: `:1120` (s0) · `:1175` (s1) · `:1197` (s2) · `:1240` (s3) · `:1285` (s5) · `:1331` (s6) · `:1376` (s8) · `:1425` (s11) · `:1461` (s14) · `:1701` (koding).
  Hammasi `.head` sarlavhasidan **darhol keyin**, vizualdan **oldin**. Komponent `:762–778`.
- Qolip (`PMLESSON2_ETALON_TARIX.md` 2-B, 3-D · `MATN_KORPUS.md:297` §22): **NEGA (sabab) + BITTA aniq chorlov, element o'z nomi bilan**.
  Namuna `:1285`: «Yaxshi sahifada ishlamaydigan bo'lim bo'lmaydi — hammasining aniq **vazifasi** bor. Pastdagi beshta bo'limni birma-bir bosing: bosganingizda uning vazifasi ochiladi.»
  Namuna `:1425`: «Uchta bo'lakni to'g'ri tartibga joylang, so'ng **«Sahifani sinab ko'rish»** tugmasini bosing — foydalanuvchi sahifangizni tepadan pastgacha o'qib chiqadi.»
- Qoidalar (3-D): puls **qayerni**, mentor **nima va nega** — ikkalasi bir halqani ko'rsatadi; interaktiv ekranda ≤1 gap (oddiyda ≤2);
  gap ko'rsatkich-so'z bilan boshlanmaydi («Bu…», «Hammasini…» — korpus §24); bo'lak sanalmaydi (63-qonun); chorlovda «tugmani bosing» emas — «**«Hikoyani qurish»**ni bosing».
- **Mentor-gap YO'Q bo'ladigan joylar:** test (QuestionScreen), podium, flashcard, yakun (2-B oxiri). `MentorNote` («Eslatma» chipi) — mentor-gap **emas**, u faqat real mentorga.
- P0 ham shu tartibda: `PmUserStoryLesson.jsx` — `Screen0…3`, `ScreenStoryWorkshop`, `ScreenPeer`, `ScreenClinic`, `ScreenPriority`, `ScreenCoding`, `Screen11`. Juftlik (`ScreenPeer`) ekranida ham mentor-gap bor.

### (b) Bridge'da qayerda buzilgan
Hisob: `<Mentor` soni — B1 2 · B2 2 · B3 4 · B4 2 · B5 2 · B6 4 · B7 4 (PmLesson2 da 10). Har darsda Maqsad ekranida bor, qolgani deyarli bo'sh.

**Mentor-gap YO'Q (qo'shiladi)** — test/podium/flashcard/yakun hisobga olinmagan:

| Dars | Ekranlar | Soni |
|---|---|---|
| B1 | 3 · 4 · 6 · 7 · 9 · 10 · 12 · 13 · 15 · 16 · 17 · 18 | 12 |
| B2 | 1 · 3 · 5 · 6 · 7 · 9 · 10 · 12 · 14 · 15 | 10 |
| B3 | 1 · 3 · 4 · 6 · 7 · 9 · 15 · 16 · 17 | 9 |
| B4 | 1 · 3 · 5 · 6 · 8 · 9 · 11 · 13 · 15 · 16 · 17 | 11 |
| B5 | 1 · 3 · 5 · 6 · 8 · 10 · 12 · 13 · 15 · 16 · 17 | 11 |
| B6 | 1 · 6 · 8 · 12 · 13 · 14 · 15 · 16 | 8 |
| B7 | 1 · 3 · 4 · 10 · 13 · 14 · 15 · 16 · 17 | 9 |
| **Jami** | | **70** |

**Mentor-gap BOR, lekin qolipga tushmaydi (NEGA yo'q yoki ko'rsatkich-so'z bilan boshlanadi):**
- B1:646 (1-ekran) «Javobni birozdan keyin birga bilib olamiz.» — chorlov ham, NEGA ham yo'q. Bu senariy matni — **saqlanadi, oldiga** NEGA + chorlov qo'shiladi.
- B3:1319 (11) · B6:762 (3) · B7:1208 (12) — «Chiziq tushgan so'zlarni bosing.» — faqat yo'riq, NEGA yo'q.
- B6:883 (5) «Belgilangan qism uchun hayotdan o'xshatishni bosing.» — NEGA yo'q.
- B7:922 (6) «Bu darsda ikki holat bilan ishlaymiz…» va B7:1021 (8) «Bu — ilovamizning e'loni…» — «Bu» bilan boshlanadi (§24).

### (c) Retsept
- **Metodist** — 70 ta yangi + 7 ta zaif gapni yozadi (uz+ru). Har gap: 1-yarmi NEGA (predmet nomi bilan boshlanadi), 2-yarmi bitta harakat,
  **ekrandagi element o'z yorlig'i bilan qo'shtirnoqda**. Chorlov o'sha ekrandagi puls-halqasining 1-qadamini aytadi.
  Yo'riq hozir faqat `NavNext` yorlig'ida turgan ekranlarda (masalan B1-3 «Ikkala odamni bosib ko'ring») o'sha yo'riq mentor-gapga ko'chadi, NavNext o'zgarmaydi.
- **Quruvchi** — gapni `.head` dan keyin, vizualdan oldin `<Mentor>{tr({uz:<>…</>, ru:<>…</>})}</Mentor>` bilan qo'yadi (3-bo'lim, 2-qolip). Kalit so'z `<b style={{ color: T.ink }}>`.
- **Dizayn** — gap qo'shilgach 1280×800 da skrollsiz sig'ishini tekshiradi; sig'masa `Stage` `narrow` emas, vizual ixchamlashadi.
- **Tekshiruv (3-D.7):** har interaktiv ekranda (a) gap va puls bir halqadami (b) NEGA bormi (c) element nomi bilanmi (d) ≤1 gapmi.

---

## SINF 3 — HOOK / 1-EKRAN DIZAYNI (F-0924-04)

**Foydalanuvchi (img24):** 1-sahifa dizayni yaxshi emas.

### (a) Etalonda qanday — `PmLesson2.jsx:1097` `Screen0`
- `Stage` **`narrow` emas** — to'liq kenglik, `Zoomable` › `Split` ikki ustun (`:1121–1143`).
- **Chap:** ikki chip-tugma `«Tartibli» / «Aralash»` (`.chip` / `.chip-on`, `:1125–1126`) + jonli `PagePreview` (`:1128`) — o'quvchi ikki ko'rinishni **o'zi solishtiradi**.
- **O'ng:** `p.eyebrow` «Sizningcha, ikkalasining farqi nimada?» (`:1131`) + 3 ta `.hook-option` radio (`:1138`).
- Tanlagach `.hook-ack` — farqni ochadi (`:1140`). Har tanlov `correct:true` (hook ballanmaydi).
- Puls ikki bosqichda: avval ko'rilmagan chip (`cmpHint`, `:1106`), keyin variantlar to'lqini (`voteHint`, `turn-wave w1/w2/w3`).
- Mentor-gap `:1120` — elementlarni nomlaydi: «pastdagi **«Tartibli»** va **«Aralash»** tugmalarini bosib, ikki ko'rinishni solishtiring. So'ng savolga javobingizni variantlardan belgilang.»

### (b) Bridge'da qanday
| Dars | Hook | Holat |
|---|---|---|
| B1 | `ScreenHook` `:613` | `narrow` (680px, `:643`) — sarlavha + zaif mentor + 3 radio. Vizual yo'q. Mentor-rejimda ovoz bo'lmasa ham `0%` chiziqlari chiqadi (`revealViz` `:639`, img24) — «buzilgan» ko'rinadi |
| B2 | `:757` | `split` + `HookScene` bor ✓; mentor-gap yo'q |
| B3 | `:684` | `BrowserFrame hk-site` bor ✓; mentor-gap yo'q |
| B4 | `:632` | `narrow` (`:659`), vizual yo'q, faqat radio; mentor-gap yo'q |
| B5 | `:703` | `tk-pair` ikki topshiriq-kartasi ✓ (solishtiruv bor); mentor-gap yo'q |
| B6 | `:593` | `split hk-split` ✓; mentor-gap yo'q |
| B7 | `:617` | `narrow` (`:644`), vizual yo'q; mentor-gap yo'q |

Yettalasida `hook-ack` yo'q — senariy javobni keyingi ekranga qoldirgan (B1: 3-ekranda ochiladi). Bu senariy qarori.

### (c) Retsept
- **Dizayn + quruvchi (B1, B4, B7):** `narrow` olib tashlanadi, `Split`: chapda **mavjud** vizual, o'ngda `p.eyebrow` + variantlar.
  - B1: chapda `OlxScheme` (`:589`, fayldagi o'z komponenti) — `lit`/`onPick`siz, faqat ko'rinish. Sarlavha «OLX sayti kim uchun qilingan?» yonida sahifa ko'rinib turadi.
  - B4: chapda brendsiz internet-do'kon sxemasi (fayldagi `BrowserFrame` + kartochka-chiziqlar; B1 `olx-list` naqshi).
  - B7: chapda telefon-ramkada «kecha ko'rilgan video» kartasi (B7 hook matnining o'zi vizualga aylanadi, yangi matn qo'shilmaydi).
- **Jonli (hamma 7):** `hvote` faqat `totalVotes > 0` bo'lganda chiqadi; nol ovozda — `done-mini` chip «👥 Ovozlar kutilmoqda…». Mentor proyektorida bo'sh `0%` jadvali chiqmaydi.
- **Metodist (hamma 7):** hook mentor-gapi. B1 da senariy gapi saqlanadi: «OLX'ga har kuni minglab odam kiradi — lekin sayt hammaga emas, aniq odamlarga qilingan. Sahifaga qarang va o'ngdagi javoblardan birini belgilang. Javobni birozdan keyin birga bilib olamiz.» (namuna; yakuniy matn metodistniki).
- **Bahsli (foydalanuvchiga):** tanlagandan keyin qisqa `hook-ack` («Javobingiz qabul qilindi — to'g'risini 3-sahifada ko'ramiz») qo'shilsinmi? PmLesson2 da `hook-ack` javobni darhol ochadi (56/79-qonun), bridge senariysi esa ochishni kechiktiradi.

---

## SINF 4 — TUSHUNARSIZ EKRAN (F-0924-05, B1-4 «Sarlavhani almashtirish», img25–26)

### Nega tushunilmaydi (img25 → img26)
1. **Bitta tugma, ikki holat, nomi yo'q.** `⇄ Sarlavhani almashtirish` (`:781`) holatni aylantiradi, lekin o'quvchi hozir **qaysi** holatda ekanini va nima bilan solishtirayotganini bilmaydi.
2. **Yo'riq yo'q.** Mentor-gap yo'q; yo'riq faqat `NavNext`da («Sarlavhani almashtirib ko'ring», `:772`), u ekran pastida.
3. **Xulosa ko'rinib turgan holatga zid.** Ikkala holat ko'rilgach `frame-success` (`:791`) chiqadi: «So'zlari tushunarli, lekin bu gap sotuvchi haqida emas…».
   U 2-holatda ham turadi. img26 da ekranda «Keraksiz narsangizni uydan chiqmay soting» + «bu men!», pastida esa «bu gap sotuvchi haqida emas». O'quvchi ko'rayotgani va o'qiyotgani bir-biriga qarshi.
4. **O'ng karta aloqasi izohsiz.** `person big dim/me` (`:784`) — kulrang karta nimani anglatishi, sahifa bilan qanday bog'liqligi aytilmagan.
- Xuddi shu mexanika **B1-12** `ScreenNew` (`:1142`, tugma `:1161` «Tepani almashtirish», xulosa `:1172`) — va u yerda «tepa» so'zi ham tushunarsiz (Sinf 8).
- Boshqa 6 darsda `flip`/`sw-btn` mexanikasi yo'q (grep: faqat B1:768 va B1:1146).

### (a) Etalon — `PmLesson2.jsx:1183` `Screen2` (chip-solishtiruv)
- Ikki **nomli** chip: `«Tepada: birinchi blok»` / `«Tepada: tugma»` (`:1202–1203`), faol holat `.chip-on`.
- Sukutda 1-holat ochiq → puls **ko'rilmagan** chipda (`pend2` + `useTurnWalk`, `:1187–1188`; 1-C.5 sukut-tuzog'i).
- **Har holatning o'z hukm-kartasi:** `frame-success` «TUSHUNARLI» + sabab / `frame-warn` «TUSHUNARSIZ» + sabab (`:1208–1210`, CSS `.frame-warn` `:2713`).
- Ikkalasi ko'rilgach **alohida** `frame-soft` xulosa (`:1211`) — u holatga bog'lanmaydi.
- Mentor `:1197`: NEGA («qolish yoki ketish shu yerda hal bo'ladi») + chorlov («Pastdagi ikki tugmani bosib, farqni o'zingiz ko'ring»).

### (c) Retsept
- **Quruvchi (B1-4, B1-12):** `sw-btn`/`flip` → 3-bo'limdagi `ChipCompare` naqshi (ikki chip + `turnCls(lit, k, pend.length > 1)`).
  - B1-4 chiplari: «1 · Hamma uchun» / «2 · Sotuvchi uchun».
  - B1-12 chiplari: «1 · Faqat qidiruv» / «2 · Bu nima va kim uchun».
  - `NavNext` yorlig'i: «Ikkala sarlavhani ko'ring» (B1-4) · «Ikkala variantni ko'ring» (B1-12).
- **Quruvchi + metodist:** har holat ostida o'z hukmi (`frame-warn` 1-holatda, `frame-success` 2-holatda).
  Senariy xulosasi (`:791`, `:1172`) **so'zma-so'z** qoladi, lekin holatdan ajratilib, ikkalasi ko'rilgach `frame-soft` bo'lib chiqadi.
  Hukm-gaplarni metodist yozadi (qo'shimcha matn), masalan 1-holat: «Sotuvchi o'zini tanimadi» · 2-holat: «Sotuvchi: "bu men!"».
- **Dizayn:** o'ng karta ustiga yorliq «Sahifani o'qiyotgan odam:» (B1-4) / «Saytga birinchi marta kirgan odam:» (B1-12); `dim` holatda karta ostida 🤷.
- **Metodist:** mentor-gap (Sinf 2), masalan B1-4: «Sotuvchi sahifani ochganda avval o'zi haqidagi gapni qidiradi. Pastdagi **«1 · Hamma uchun»** va **«2 · Sotuvchi uchun»**ni bosib, u qaysi birida o'zini taniganini ko'ring.»

---

## SINF 5 — TEST DIZAYNI (F-0924-06, img27)

### (a) Etalon — `PmLesson2.jsx:641–743` `QuestionScreen` + savol-props (`Screen4` `:1263`)
- Savol bloki (`question`): `<p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p>` +
  `<h2 className="title h-ask" style={{ marginTop: 8 }}>… <span className="italic" style={{ color: T.accent }}>kalit</span> …</h2>`.
  `.h-ask` = Source Serif (`.title`), `clamp(19px,2.6vw,27px)`, `line-height 1.32` (`:2690`). **Bitta** sarlavha — raqobatchi karta yo'q.
- `.screen` `justifyContent: 'safe center'` (`:691`).
- Variantlar ixchamlashadi: `gap: picked !== null ? 8 : 11` (`:694`); padding `picked !== null ? 'clamp(9px,1.3vw,12px) …' : 'clamp(13px,1.9vw,17px) …'` (`:706`) — izoh chiqqanda ekran skrollsiz qoladi.
- Harf: oddiy `mono small`, `minWidth 20`, to'g'rida `T.success` (`:707`).
- Xato tanlov `.option-picked-wrong` — **binafsha** (`T.accentSoft`/`T.accent`, `:2663`): ayblamaydi.
- Izoh sarlavhasi: «To'g'ri» / «Qaytadan urinib ko'ring» (`:721`); mentor ochganda «✓ To'g'ri javob: A — …» (`:716`).
- `explainWrong` **har variant uchun alohida** (`:1266`: `1`, `2`, `3`, `default`), avval variantning to'g'ri tomonini tan oladi.
- Birinchi urinish xato bo'lsa — «📖 Qisqa takrorlash» `RecapOverlay` (`:734–736`, `RECAPS` `:370`).

### (b) Bridge'da qanday (7 dars × 4 test — `QuestionScreen` + `TestQ`)
| Farq | Bridge (B1 misolida) | PmLesson2 |
|---|---|---|
| Savol bloki | `TestQ` `:798`: `.tq-card` (oq karta, 5px chap hoshiya, soya) ichida `.tq-story` **Georgia serif** `clamp(17px,2.4vw,23px)` + ostida `.tq-ask` Manrope 800 `clamp(16.5px,2.2vw,21px)` (CSS `:2718–2721`) — ikki sarlavha raqobatlashadi, lead savoldan kattaroq | eyebrow + bitta `h2.title.h-ask` |
| «To'g'ri javobni tanlang» | yo'q | bor |
| Joylashuv | `justifyContent: 'center'` `:423` | `'safe center'` |
| Variant o'lchami | doimiy padding `clamp(13px,1.9vw,17px)`, `gap 9` (`:426`, `:440`) → izoh + jonli panel bilan ichki skroll paydo bo'ladi (img27 o'ngdagi aylantirish chizig'i) | tanlagach ixchamlashadi |
| Harf | `.opt-abc` 27px to'ldirilgan doira, ✓/✗ (`:441`, CSS `:2722–2725`) | `mono small` harf |
| Xato rangi | `.option-picked-wrong` **qizil** `T.errSoft/T.err` (`:2600`) | binafsha |
| Izoh sarlavhasi | «Topdingiz!» / «Qaytadan ko'ring» (`:455`) | «To'g'ri» / «Qaytadan urinib ko'ring» |
| Har variant izohi | B1: T1 (5-ekran), T2 (8) — faqat `default`; T4 (14) — `3` + `default`. B2: T1 (4), T3 (11), T4 (13) — faqat `default`. B5: T4 (11) — faqat `default`. B3/B4/B6/B7 — to'liq ✓ | har variant alohida |
| Qisqa takrorlash | faqat B2 va B5 da bor | bor |

Test ekranlari: B1 5·8·11·14 · B2 4·8·11·13 · B3 5·8·12·14 · B4 4·7·10·12 · B5 4·7·9·11 · B6 4·7·9·11 · B7 5·7·9·11.
Satrlar (`QuestionScreen` / `TestQ` / `.tq-card`): B1 385/798/2720 · B2 451/924/2752 · B3 386/884/2858 · B4 375/796/2648 · B5 458/883/2891 · B6 385/797/2883 · B7 374/784/2777.

### (c) Retsept
- **Dizayn:** `TestQ` va uning CSS'i 3-bo'lim, 3-qolipga almashtiriladi (7 fayl). Lead matni **o'zgarmaydi** — faqat serif kartadan oddiy `tq-lead` qatoriga o'tadi (Manrope, `T.ink2`), savol `h-ask` bo'ladi.
- **Quruvchi:** `QuestionScreen`da `'safe center'`, variantlarni ixchamlash, harf, `.option-picked-wrong` rangi, izoh sarlavhalari — PmLesson2 qiymatlari bilan (3-bo'lim).
- **Metodist:** yetishmayotgan `explainWrong` kalitlari (B1 T1/T2/T4, B2 T1/T3/T4, B5 T4) — har noto'g'ri variantga alohida izoh (qo'shimcha matn; variantlar o'zi tegilmaydi).
  `ask` ichidagi kalit so'zni `<span className="italic" style={{ color: T.accent }}>` bilan belgilash — metodist tanlaydi (bu matnni emas, faqat ko'rinishni o'zgartiradi).
- **Quruvchi (ixtiyoriy, bahsli):** qolgan 5 darsga `RECAPS` + «📖 Qisqa takrorlash» (B2/B5 dagi naqsh). Bu kontent-qo'shimcha — foydalanuvchi tasdig'i bilan.
- ⚠️ P0 (`PmUserStoryLesson.jsx:1642` `TestQ`, CSS `:3179–3181`) ham serif-karta ishlatadi. Bu 2-tur naqshi. Foydalanuvchi bridge uchun aniq PmLesson2 (1-tur) dizaynini so'radi — P0 ga tegilmaydi.

---

## SINF 6 — KEYS RASMLARI VA QIZIQTIRISH (F-0924-07)

### (a) Etalonda qanday
- **Foto:** `PmLesson1.jsx:1078–1098` — `PHOTO_SET` (`img` to'liq URL + `emoji` + `bg` gradient + `alt` uz/ru) va `Photo` komponenti:
  rasm yuklanmasa emoji qoladi, dars to'xtamaydi (`onError`). CSS `.k-photo` `:3892–3893` (`width: min(360px,100%)`, `height: clamp(120px,18vw,180px)`, `object-fit: cover`).
  Slaydda: `{cur.photo ? <Photo kind={cur.photo} /> : <span className="k-ic">{cur.ic}</span>}`.
- **Qiziqtirish (PmLesson1 `ScreenKeys`):** mentor-gap voqeani «mashhur sir» qilib ochadi: «Biznesdagi mashhur voqea: dunyodagi eng katta ijtimoiy tarmoq qanday boshlangan? Slaydlarni **birma-bir** oching.»
  Birinchi slayd brendni aytmaydi («2004-yil. Bir universitet talabasi oddiy sayt ochdi…»), bashorat hikoya **o'rtasida**, brend oxirida ochiladi («Bugun uni Facebook nomi bilan bilamiz»).
  Slayd ichida o'z boshqaruvi `← Oldingi · nuqtalar · Keyingisi →` (puls bilan). `NavNext` faqat oxirida ochiladi.
- **Qonun:** `DARS_ETALON.md` 156-qonun (12-S, ~`:2970–3031`):
  1. brend birinchi ko'rinishda bir qatorli izoh oladi (har darsda qaytariladi);
  2. «Maket fotoni kutmaydi» — chizib bo'ladigan referent maket bilan, foto faqat chizib bo'lmaydiganga (Garvard binosi);
  3. MAKET FILTRI: o'qitadigan joyga qo'yiladi, bezakka emas;
  4. maket/rasm javobni oldindan aytmasin — bashoratdan **keyin** chiqadi (§186);
  5. `alt`/`aria-label` uz+ru; rasm faqat loyiha media-kutubxonasidan (`go.coddycamp.uz/uploads/media_library/…`), tashqi havola emas.
- **Rasm manbasi:** loyihada `public/` papka **yo'q**. Rasmlar faqat media-kutubxona URL'i orqali. Ro'yxat va reja: `feedback/F-0921-rasm/RASMLAR.md`.

**Media-kutubxonadagi mavjud rasmlar (src bo'ylab grep, mentor avataridan tashqari):**
| URL (…/media_library/) | Nima | Qayerda |
|---|---|---|
| `801be58d0e9f80878c76c1265e1adcf2.jpg` | **Garvard universiteti binosi** | `PmLesson1.jsx:1080` |
| `cf55a3f1c3e9436d5febcd736ed7fc43.jpg` · `8ee7730e97c67473a424ccfeff49ab20.jpg` · `3ea816621e0d8ecd5e534ec28051d4d5.jpg` | tog' / mushuk / raketa | `Htmllesson2.jsx` `PHOTO_SET` |
| `58ebafabd92e2e3a80d86b7bb7e88eda.png` | profil (qizcha) | `Htmllesson2.jsx`, `HtmlPractice.jsx` |
| `42c17f8b…jpg` · `75a3bc4b…jpg` · `dd05e461…jpg` · `e85744ab…jpg` | o'yin/klub mavzusidagi rasmlar | `PracticeLesson2.jsx` |

Bridge keyslariga mos keladigani **faqat Garvard fotosi**. Qolganlari uchun loyihada tayyor **maketlar** bor:
| Maket | Fayl · satr | Nima ko'rsatadi | Eslatma |
|---|---|---|---|
| `CutMock` | `src/7-Modull/PmLesson31.jsx:370` (CSS `.cut-*` ~`:1181`) | Burbn ro'yxati ustidan chizilgan → Instagram (rasm · filtr · like) | `aria-label` faqat uz — bridge'da `tr({uz,ru})` qilinadi; `picked !== null` dan keyin (`:412`) |
| `NfMock` | `src/4-Modull/PmLesson11.jsx:986` (CSS `.nf-*` `:2970+`, 9 qoida) | ikki xil bosh sahifa yonma-yon | bashoratdan keyingi slaydda |
| `DeckMock` | `src/2-Modull/PmLesson6.jsx:1015` (CSS `.dk-*` `:2982+`) | o'nta oddiy varaq, 1-si «MUAMMO» (`ochiq`) | uz+ru tayyor |

### (b) Bridge'da qanday — 7 keys, hammasida `<img>` 0 (faqat mentor avatari), mentor-gap 0
| Dars | Ekran | Keys · satr | Rasm/maket | Qiziqtirish | 156-izoh |
|---|---|---|---|---|---|
| B1 | 6 | Facebook `ScreenCase:835`, `FB_SLIDES:830` | yo'q (faqat emoji 🎓🏫🌍) | brend sarlavhada darhol; bashorat birinchi; 3 quruq slayd | Facebook — tanish ✓ |
| B2 | 6 | Airbnb (matras) `:1039`, `K_PREDICT:1025` | yo'q | bashorat-savol yaxshi («2007-yil, San-Fransisko…») | ✓ `:1026` «turar joy topib beradigan xizmat» |
| B3 | 7 | Instagram/Burbn `:972`, `IG_SLIDES:966` | yo'q | — | Burbn ✓ «degan ilova» |
| B4 | 6 | Uzum `:881`, `K_PREDICT:867` | yo'q | — | hook `:663` «internet-do'kon» ✓ |
| B5 | 6 | Instagram/Burbn `:976` (B3 bilan bir xil matn — senariyda tasdiqlangan, boshqa yo'l) | yo'q | — | ✓ |
| B6 | 6 | Airbnb (taqdimot) `:934`, `AB_PREDICT:920` | yo'q | — | ❌ sarlavhada `:947` izohsiz |
| B7 | 4 | Netflix `:815`, `K_PREDICT:805` | yo'q | — | ❌ `:806` izohsiz |

Umumiy: slayd `NavNext` orqali varaqlanadi («Keyingi bosqich (1/3)») — slayd ichida o'z boshqaruvi yo'q (PmLesson1 dan farq).

### (c) Retsept
- **Quruvchi + dizayn:**
  - **B1-6:** `PHOTO_SET.garvard` + `Photo` + `.k-photo` (PmLesson1 dan) — 1-slaydga («2004 — bitta universitet»). `alt` uz+ru. Rasm ostida izoh «Garvard universiteti (Amerikadagi mashhur universitet)» (156-qonun 1-band — qo'shimcha).
  - **B3-7 va B5-6:** `CutMock` — bashorat javobidan keyingi 2-slaydda («surat, filtr va izoh qoldi»). `aria-label` → `tr({uz,ru})`.
  - **B7-4:** `NfMock` — bashoratdan keyingi 1-slaydda («har kimning bosh sahifasi o'ziniki»).
  - **B6-6:** `DeckMock ochiq={i >= AB_PREDICT.openAt}` — varaqlar slaydida.
  - **B2-6:** mos rasm yo'q (RASMLAR.md A3 — «havo matrasi qo'yilgan xona» hali yuklanmagan) → hozircha `Photo` emoji-rejimida (🛏️ + gradient), rasm kelgach URL qo'shiladi. **Foydalanuvchidan rasm so'raladi.**
  - **B4-6:** 22.09 filtri (RASMLAR.md B4 — «ilova ekrani darsning gapini ko'rsatmaydi») bo'yicha rasm qo'yilmaydi. Faqat mentor-gap va qiziqtirish.
- **Quruvchi:** slayd ichiga `k-nav` (`← Oldingi · nuqtalar · Keyingisi →`, puls `useTurnHint`) — PmLesson1 `ScreenKeys` naqshi. `NavNext` oxirgi slaydgacha qulf, yorlig'i aniq shartni aytadi («Avval voqeani oxirigacha oching»).
- **Metodist:** 7 keys mentor-gapi — qiziqtirish + chorlov, PmLesson1 qolipida («Biznesdagi mashhur voqea: … Avval taxminingizni belgilang, so'ng slaydlarni birma-bir oching.»).
  156-izoh: B6 da Airbnb (birinchi ko'rinishda), B7 da Netflix («film va seriallar ko'rsatadigan xizmat»).
  Slayd matnlari (senariy) o'zgarmaydi.
- **Tekshiruv:** `CLICK='.kp-chip' SHOT_LANG=ru node scripts/shot-screen.mjs <fayl> <ekran-1>` — maket qorong'i/ruscha rejimda ko'z bilan ko'riladi (156-qonun tekshiruvi).

---

## SINF 7 — YO'NALTIRISHSIZ EKRAN (F-0924-08, B1-10, img28)

### Nega B1-10 da nima bosishni bilib bo'lmaydi
- Bosiladigan joylar — chapdagi sxema qismlari (`OlxScheme onPick`, `:1104`). Ularda raqam ham, yozuv ham yo'q.
- O'ngdagi `Qidiruv qatori / Kategoriyalar / E'lon berish` kartalari (`.spot`, `:1107`) **tugmaga o'xshaydi**, lekin `div` — bosilmaydi. O'quvchi ularni bosadi, hech narsa bo'lmaydi.
- Yo'riq faqat `NavNext` yorlig'ida («OLX sahifasidagi uch joyni bosing (1/3)», `:1100`). img28 da ekran pastidagi navigatsiya umuman ko'rinmaydi, img22 da yarmi kesilgan. Bridge qobig'ida (TopBar + brauzer paneli) `NavNext` ko'rish maydonidan chiqib ketishi mumkin — **dizayn tekshirsin** (ishga tushirib tasdiqlanmagan, faqat skrinshotlardan).
- Mentor-gap yo'q.

### (a) Etalon — puls + mentor mehnat-taqsimoti (`PMLESSON2_ETALON_TARIX.md` 3-C, 3-D)
- Puls — **qayerni**: ~2,6s harakatsizlikdan keyin FAQAT BITTA element yonadi (`TURN_HINT_MS 2600`); yurish `useTurnWalk(pending)`; to'lqin teng variantlarda; testda javobgacha puls yo'q.
- Mentor — **nima va nega**: PmLesson2 s3 (`:1240`) «Pastdagi uchta saytni **birma-bir bosing** — har birida bo'limlar qaysi tartibda turgani ochiladi.»
- PmLesson2 s3 (`:1245`): bosiladigan ro'yxat — ikonka + nom + ✓ (`seen`), o'ngda natija. **Bosiladigan narsa aniq tugma**, izoh-karta tugmaga o'xshamaydi (`frame-dash` «Bir saytni bosing»).

### (b) Yo'naltirishsiz ekranlar ro'yxati
**A. Mentor-gap yo'q, yo'riq faqat NavNext da** — Sinf 2 jadvalidagi 70 ekran (hammasi).
**B. Puls ham yo'q (interaktiv ekran):**
| Dars | Ekranlar |
|---|---|
| B1 | 17 (AI) |
| B2 | 15 (AI), 16 (sherik) |
| B3 | 6 (tarozi `ScreenScale:926` — mentor ham yo'q), 11 (chiziq), 16 (AI) |
| B4 | 16 (AI) |
| B5 | — |
| B6 | 3 (chiziq), 15 (AI) |
| B7 | 12 (chiziq), 16 (AI) |
**C. Bosilmaydigan narsa tugmaga o'xshaydi:** B1-10 `.spot` kartalari (`:1107`). Boshqa darslarda shunday ro'yxat bo'lsa — dizayn 👦 o'qishda tekshiradi.
**D. Eng og'ir (ikkalasi yo'q):** B3-6.

### (c) Retsept
- **Quruvchi (B1-10):** `.spot` kartalar `button` bo'ladi va `pick(s.k)` chaqiradi — ikki tomon ham ishlaydi; sxemadagi uch joyga ①②③ raqam-belgi (`OLX_SPOTS` tartibida).
  Puls chap sxemada qoladi (bir lahzada bitta — 88-qonun).
- **Quruvchi (B-jadval):** 11 ekranga puls (1-C tartibi: harakat-zanjiri → navbat → naqsh). «Chiziq» ekranlarida — ko'rilmagan past so'zlar bo'ylab `useTurnWalk`. Tarozida — 1-savol → 2-savol.
- **Metodist:** 70 mentor-gap (Sinf 2). B1-10 namuna: «Saytning eng ko'zga tashlanadigan joyi — birinchi kelgan odam qiladigan ishi. Chapdagi sahifada uchta joyni birma-bir bosing.»
- **Dizayn:** TopBar bilan bridge qobig'ida 1920×893 (brauzer paneli bilan) va 1280×800 da `NavNext` ko'rinishini tekshiradi (`--bo` hisobi, `BridgeKimUchun.jsx:2466–2470`).

---

## SINF 8 — TUSHUNARSIZ SO'Z (F-0924-09, «Tepani almashtirish», img29)

### (a) Etalon
- `PMLESSON2_ETALON_TARIX.md` 4-bo'lim — taqiq-lug'at: «qavat (tepa/past qavat)» → aniq nom; «chalkash», «mavhum», «tushunish oson», «ko'z tashlang», «ketib qoladi», «sinov mijozi» va hokazo.
- 4-B gap-qoliplari: harakat-fe'llar aniq (qarang · bosing · tanlang · solishtiring); «tugmani bosing» emas — tugma nomi bilan.
- PmLesson2 «tepa» o'rniga **«yuqori qismi»** deydi (s2 mentor `:1197` «sahifaning **yuqori qismini** ko'radi»); chip yorlig'i esa holatni to'liq nomlaydi («Tepada: birinchi blok»).

### (b) 7 darsdagi tugma va yorliqlar (grep: `<button`, `NavNext`, `<a` ichidagi uz-satrlar)
| Dars · satr | Hozir | O'rniga | Kim |
|---|---|---|---|
| B1:1161 | «⇄ Tepani almashtirish» | ikki chip: «1 · Faqat qidiruv» / «2 · Bu nima va kim uchun» | quruvchi |
| B1:1150 | NavNext «Tepani almashtirib ko'ring» | «Ikkala variantni ko'ring» | quruvchi |
| B1:781 | «⇄ Sarlavhani almashtirish» | ikki chip: «1 · Hamma uchun» / «2 · Sotuvchi uchun» | quruvchi |
| B1:772 | NavNext «Sarlavhani almashtirib ko'ring» | «Ikkala sarlavhani ko'ring» | quruvchi |
| 7 dars AI | «So'rovni ko'rish ▾» | o'chiriladi (so'rov doim ochiq) | quruvchi |
| 7 dars AI | «📋 Nusxalash» | «① 📋 So'rovni nusxalash» → «✓ Nusxalandi» | quruvchi |
| 7 dars AI | «gemini.google.com ↗» | «② gemini.google.com ni ochish ↗» | quruvchi |
| 7 dars AI | «Gemini ochilmasa ▾» | «🛟 Gemini ochilmadimi?» (`<details>`) | quruvchi |
| B1:1506 | «✓ Sahifaga qo'yish» | saqlanadi; ③ qadam yorlig'i ustida | — |
| B5 ~`:1578` | «Birinchi shu» | «Shundan boshlayman» | metodist tasdiqlaydi |

Qolgan tugmalar (Davom etish · Orqaga · Saqlash · Keyingi bosqich (1/3) · Avval taxminingizni tanlang · ✓ Bildim · ✗ Takrorlash · 🔓 Natijani ochish · Boshlaymiz →) — lug'atga mos ✓.
«▶ Avto» — arenaning mentor-boshqaruvi, o'quvchi-matn emas ✓. Taqiq-oila grep (chalkash · mavhum · tushunish oson · UX · ko'z tashlang · ketib qoladi · slot · hero · CTA) — 0 ✓.
«mijoz» B2:1475 — haqiqiy xaridor ma'nosida («taksi xizmati mijozlari») ✓.

### (c) Retsept va bahsli joylar
- **Quruvchi:** jadvaldagi yorliqlar (uz+ru juft; ru ham xuddi shu ma'noda — «Переключить верх» ham o'chadi).
- **Metodist:** `MATN_KORPUS.md`ga juftlik: ❌ «Tepani almashtirish» → ✅ nomli ikki chip + sabab + F-0924-09; `til-lint-rules.json`ga qoida: `\bTepani\b` (tugma/yorliq kontekstida).
- **Bahsli (foydalanuvchi qarori):**
  1. «tepasida» senariy matnlarida: B1:807 (T1 lead), B1:904, B1:1172 (xulosa), B1:1237 (T4 varianti), B1:1795 (arena), B1:2371/2385/2386 (flashcard/recap), B4:806 (T1 lead). Foydalanuvchi «tepa» ni tushunarsiz dedi. Lekin «senariy matni o'zgarmaydi» qoidasi bor. Taklif: «sahifa boshida» yoki «sahifaning yuqori qismida» (PmLesson2 so'zi). **Tasdiqsiz tegilmaydi.**
  2. B7 da «qavat» 13 marta (ilova qatlamlari metaforasi: «Uch qavat», «Tekshiradigan qavat»…). PmLesson2 taqiq-lug'atida «qavat» bor, lekin boshqa ma'noda (header/main/footer). B7 senariysining markaziy metaforasi — tegilmaydi, faqat qayd.

---

## SINF 9 — BOSHQA KATTA FARQLAR (PmLesson2 da bor, bridge'da yo'q)

| # | Naqsh | PmLesson2 | Bridge | Taklif · rol |
|---|---|---|---|---|
| 9.1 | **Holat-hukmi kartasi** `frame-warn` (amber «TUSHUNARSIZ») ↔ `frame-success` | `:1209–1210`, CSS `:2713` | 7 darsda `frame-warn` 0 | ChipCompare bilan birga (Sinf 4) · dizayn |
| 9.2 | **`Zoomable`** ⛶ (vizualni katta ekranda ko'rish, proyektor uchun) | `:1076–1094`, 19 joy | B1/B2/B4/B5/B7 — 0; B3, B6 — 1 tadan | split-vizualli ekranlarga · quruvchi |
| 9.3 | **«📖 Qisqa takrorlash»** (xato 1-urinishdan keyin) | `:734`, `RECAPS:370` | faqat B2, B5 | bahsli — kontent-qo'shimcha · metodist + quruvchi |
| 9.4 | **explainWrong har variantga** | `:1266` | B1, B2, B5 da chala (Sinf 5) | metodist |
| 9.5 | **Qoida-plakat** ekrani (dars g'oyasi bitta gapda) | `Screen14:1456` | 7 darsda yo'q (Maqsaddan tashqari `rule` turi 0) | **bahsli** — yangi ekran = senariy + relslar o'zgaradi (SCREEN_META/INLINE_KEYS/QUIZ_BANK). Foydalanuvchi qaroriga |
| 9.6 | **Xato tanlov ayblamaydi** — binafsha, qizil emas | `.option-picked-wrong` `:2663` | qizil (7 dars) | dizayn (Sinf 5) |
| 9.7 | **Hook — solishtiruv** | Screen0 | B1/B4/B7 da vizual yo'q | Sinf 3 |
| 9.8 | **Mentor-proyektorda bo'sh statistika chiqmaydi** (90-qonun, 1-D) | — | hook `hvote` 0% (B1 img24; qolgan 6 darsda ham `revealViz` shu shart bilan) | jonli (Sinf 3) |
| 9.9 | **Keys slaydi o'z boshqaruvi bilan** | PmLesson1 `k-nav` | `NavNext` varaqlaydi | Sinf 6 |

✅ Borlari (farq yo'q): navbat-pulsi kodi (`useTurnHint/useTurnWalk/turnCls/waveCls`), `MentorNote` chipi, sinov-simulyatori (B1-15 «Sotuvchi o'qisin» — PmLesson2 CustomerRun sinfi), bosqichma-bosqich ochish (B1-13 — PmLesson2 s5/s6 sinfi), `ccProgress`, flashcard, podium, arena.

---

# 2-BO'LIM. DARS-BO'YICHA ISH-RO'YXATI

Belgilar: **Q** quruvchi · **D** dizayn · **M** metodist · **J** jonli. «MG» = mentor-gap (Sinf 2 qolipi). «Test-qolip» = Sinf 5 retsepti (TestQ + QuestionScreen).

### B1 — «Kim uchun qilyapmiz?» (`BridgeKimUchun.jsx`, 21 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | `narrow` olib tashlanadi, `Split`: chapda `OlxScheme`, o'ngda eyebrow + variantlar; MG (senariy gapi saqlanadi + NEGA/chorlov qo'shiladi); `hvote` faqat ovoz bo'lsa | D · Q · M · J |
| 3 Ikki odam | MG («Ikkala odamni bosing» yo'rig'i NavNext'dan gapga ko'chadi) | M · Q |
| 4 «Hamma uchun» | ChipCompare: «1 · Hamma uchun» / «2 · Sotuvchi uchun»; har holatga hukm; senariy xulosasi holatdan ajraladi; o'ng kartaga yorliq; MG; NavNext «Ikkala sarlavhani ko'ring» | Q · D · M |
| 5·8·11·14 Test | Test-qolip; T1 (5), T2 (8) — har variantga explainWrong; T4 (14) — 0/1/2 variantlarga izoh | D · Q · M |
| 6 Facebook | Garvard `Photo` 1-slaydga + izoh; slayd ichida `k-nav`; MG (qiziqtirish) | Q · D · M |
| 7 Karta | MG | M |
| 9 O'z g'oyangiz | MG | M |
| 10 OLX bosh sahifasi | `.spot` → bosiladigan `button`; sxemada ①②③; MG | Q · D · M |
| 12 Yangi sayt | ChipCompare: «1 · Faqat qidiruv» / «2 · Bu nima va kim uchun»; «Tepani…» o'chadi; hukm-kartalari; MG | Q · D · M |
| 13 Kartadan sahifaga | MG | M |
| 15 Tartib (img23) | MG («Bo'limlarni sudrab joylang, so'ng **«Sotuvchi o'qisin»**ni bosing» — 75-qonun qolipi) | M |
| 16 O'z sahifangiz | MG | M |
| 17 AI (img22) | `AiStep`; senariydagi yo'qolgan gap MG bo'lib qaytadi; ③ = «Yoqqan sarlavhani **«Birinchi blok»** maydoniga yozing»; puls | Q · M |
| 18 Juftlik | MG | M |
| 19–21 | tegilmaydi | — |

### B2 — «Muammoni topamiz» (`BridgeMuammoniTopamiz.jsx`, 19 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | MG (`HookScene` va variantlar bor); `hvote` sharti | M · J |
| 3 Belgilar · 5 Sharhlar · 7 Gap yig'ish · 9 Muammo-karta · 10 Ilova · 12 Juftlash · 14 Yechimlar | MG (7 ta) | M · Q |
| 4·8·11·13 Test | Test-qolip; T1 (4), T3 (11), T4 (13) — har variantga explainWrong | D · Q · M |
| 6 Airbnb | slayd ichida `k-nav`; `Photo` emoji-rejimida (🛏️) — rasm kelgach URL; MG | Q · M · foydalanuvchi (rasm) |
| 15 AI | `AiStep`; ③ = savollar maydoni; MG; puls | Q · M |
| 16 Sherikka so'rash | MG bor — puls qo'shiladi | Q |

### B3 — «Birinchi versiya va uni ko'rsatish» (`BridgeBirinchiVersiya.jsx`, 20 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | MG; `hvote` sharti | M · J |
| 3 Bo'laklar · 4 Tugash · 9 Ro'yxat · 15 Besh gap · 17 Juftlik | MG (5 ta) | M |
| 5·8·12·14 Test | Test-qolip (explainWrong to'liq ✓) | D · Q |
| 6 Tarozi | MG + puls (1-savol → 2-savol) — hozir ikkalasi yo'q | M · Q |
| 7 Instagram | `CutMock` (bashoratdan keyin, `aria-label` uz+ru); `k-nav`; MG | Q · D · M |
| 10 Mening versiyam · 13 O'xshatish | MG bor — NEGA tekshiriladi | M |
| 11 Chiziq | MG «Chiziq tushgan so'zlarni bosing.» ga NEGA qo'shiladi; puls (past so'zlar bo'ylab yurish) | M · Q |
| 16 AI | `AiStep`; ③ = tinglovchi javobi maydoni; MG; puls | Q · M |

### B4 — «Kim uchun va qanday muammo?» (`BridgeKimUchunMuammo.jsx`, 20 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | `narrow` olib tashlanadi, `Split`: chapda brendsiz internet-do'kon sxemasi; MG; `hvote` sharti | D · Q · M · J |
| 3 Ikki odam · 5 Belgilar · 8 Gap yig'ish · 9 Ilova · 11 Natija · 13 Juftlash · 15 Tekshiruv · 17 Juftlik | MG (8 ta) | M |
| 4·7·10·12 Test | Test-qolip (explainWrong to'liq ✓) | D · Q |
| 6 Uzum | rasm qo'yilmaydi (22.09 filtri); `k-nav`; MG (qiziqtirish) | Q · M |
| 14 Karta | MG bor — NEGA tekshiriladi | M |
| 16 AI | `AiStep`; ③ = «foydalanuvchi rolidagi» javob maydoni; MG; puls | Q · M |

### B5 — «Nima quramiz va qachon tayyor?» (`BridgeNimaQuramiz.jsx`, 20 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | MG (`tk-pair` bor); `hvote` sharti | M · J |
| 3 Qismlar · 5 Bo'lish · 8 Katak · 10 Tayyormi · 12 Qadamlar · 13 Hikoya · 15 Shartlar · 17 Sherik | MG (8 ta) | M |
| 4·7·9·11 Test | Test-qolip; T4 (11) — har variantga explainWrong | D · Q · M |
| 6 Instagram | `CutMock` (B3 bilan bir xil joyda); `k-nav`; MG | Q · D · M |
| 14 Bo'laklar | MG bor; «Birinchi shu» tugmasi → «Shundan boshlayman» | M · Q |
| 16 AI | `AiStep` (puls allaqachon bor — `AiStep`ga ko'chadi); ③ = sinov-savollari maydoni; MG | Q · M |

### B6 — «Qanday ko'rsatamiz?» (`BridgeQandayKorsatamiz.jsx`, 19 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | MG (split bor); `hvote` sharti | M · J |
| 3 Chiziq | MG «Chiziq tushgan so'zlarni bosing.» ga NEGA; puls | M · Q |
| 4·7·9·11 Test | Test-qolip (explainWrong to'liq ✓) | D · Q |
| 5 O'xshatish | MG ga NEGA qo'shiladi | M |
| 6 Airbnb | `DeckMock` (`ochiq` openAt dan keyin); `k-nav`; MG + 156-izoh (Airbnb birinchi ko'rinishda) | Q · D · M |
| 8 Ekran-gap · 12 Besh gap · 13 Kadrlar · 14 Kursi · 16 Juftlik | MG (5 ta) | M |
| 10 Uch kadr | MG bor — NEGA tekshiriladi | M |
| 15 AI | `AiStep`; ③ = «ota-ona rolidagi» javob; MG; puls | Q · M |

### B7 — «Ma'lumot, ishonch va «Qanday ishlaydi?»» (`BridgeMalumotIshonch.jsx`, 20 ekran)
| Ekran | Nima qilinadi | Rol |
|---|---|---|
| 1 Hook | `narrow` olib tashlanadi, `Split`: chapda telefon-ramkada video kartasi; MG; `hvote` sharti | D · Q · M · J |
| 3 Xotira · 10 Qavatlar · 13 Maydonlar · 14 Ochiq/yopiq · 15 Qavat-bo'shliq · 17 Juftlik | MG (6 ta) | M |
| 4 Netflix | `NfMock` (bashoratdan keyin); `k-nav`; MG + 156-izoh (Netflix) | Q · D · M |
| 5·7·9·11 Test | Test-qolip (explainWrong to'liq ✓) | D · Q |
| 6 Kim ko'radi · 8 E'lon | MG «Bu…» bilan boshlanadi → predmetdan boshlanadigan qilib qayta yoziladi (§24) | M |
| 12 Chiziq | MG ga NEGA; puls | M · Q |
| 16 AI | `AiStep`; ③ = maxfiylik javoblari maydoni; MG; puls | Q · M |

**Tartib (hamma dars uchun):** Q (3-bo'lim komponentlari 7 faylga) → D → M (matn; `lint:til` 0) → J (`hvote` sharti) → `npm run gates -- <fayl>` + `lint:jsx` → 👦 2-o'qish (`OQUVCHI_DARVOZA.md`) → foydalanuvchi ko'rigi.

---

# 3-BO'LIM. UMUMIY NAQSH-KODI (bir marta yoziladi — 7 faylga ko'chiriladi)

> Har faylda `tr`, `T`, `useTurnHint`, `useTurnWalk`, `turnCls`, `Mentor` allaqachon bor. `copyText` B1/B3/B4/B6/B7 da bor (B1:1409); B2 va B5 ga B1 dan ko'chiriladi.
> Bu yerdagi CSS JSX ichidagi `<style>{`…`}</style>` satriga qo'yiladi — **izohga backtik yozilmaydi**.

## 3.1 `AiStep` (Sinf 1)

```jsx
// ===== AI QADAMI (F-0924-01/02) — so'rov doim ochiq · ① nusxalash → ② Gemini → ③ javobni yozish.
// Manba: DeployLesson Screen4 (.pr-panel/.pr-copy) + DoSteps (.dsx raqamlari) + FallbackPanel (.dsx-fb, 155-qonun).
// «Nusxalandi» holati QAYTIB O'CHMAYDI — o'quvchi ① bajarilganini doim ko'radi.
const AiStep = ({ prompt, answerLabel, answered, fallbackTitle, fallback }) => {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const pend = [!copied && 'copy', !opened && 'open'].filter(Boolean);
  const lit = useTurnWalk(pend); // ③ ning pulsi — o'ngdagi maydonning o'zida (turnCls bilan)
  const doCopy = async () => { const ok = await copyText(prompt); if (ok) setCopied(true); };
  const Row = ({ n, done, children }) => (
    <li className={`ais-row ${done ? 'on' : ''}`}><span className="ais-num">{done ? '✓' : n}</span><div className="ais-body">{children}</div></li>
  );
  return (
    <div className="ais fade-up delay-1">
      <div className="pr-panel">
        <div className="pr-head"><span className="pr-lbl">📝 {tr({ uz: "AI uchun so'rov", ru: 'Запрос для AI' })}</span></div>
        <pre className="pr-body">{prompt}</pre>
      </div>
      <ol className="ais-steps">
        <Row n={1} done={copied}>
          <button type="button" className={`pr-copy ${copied ? 'ok' : ''}${turnCls(lit, 'copy', pend.length > 1)}`} onClick={doCopy}>
            {copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: "📋 So'rovni nusxalash", ru: '📋 Скопировать запрос' })}
          </button>
        </Row>
        <Row n={2} done={opened}>
          <a className={`ais-link${turnCls(lit, 'open', pend.length > 1)}`} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" onClick={() => setOpened(true)}>
            {tr({ uz: 'gemini.google.com ni ochish ↗', ru: 'Открыть gemini.google.com ↗' })}
          </a>
          <span className="ais-d">{tr({ uz: "So'rovni qo'ying va yuboring", ru: 'Вставьте запрос и отправьте' })}</span>
        </Row>
        <Row n={3} done={answered}><span className="ais-t">{answerLabel}</span></Row>
      </ol>
      <details className="dsx-fb">
        <summary>🛟 {fallbackTitle || tr({ uz: 'Gemini ochilmadimi?', ru: 'Gemini не открылся?' })}</summary>
        <div className="dsx-fb-body">{fallback}</div>
      </details>
    </div>
  );
};
```
Ishlatish (B1-17): chap ustun `<AiStep prompt={prompt} answered={put} answerLabel={tr({ uz: <>Yoqqan sarlavhani <b>«Birinchi blok»</b> maydoniga yozing</>, ru: <>Впишите понравившийся заголовок в поле <b>«Первый блок»</b></> })} fallback={/* hozirgi ai-alts ro'yxati o'zgarishsiz */} />`.
O'ng ustun (maydon + «✓ Sahifaga qo'yish» + qoida-gapi) o'zgarmaydi. `open`/`setOpen`, `fallback`/`setFallback` state'lari va `ai-row` tugmalari o'chadi.

```css
/* AiStep — manba DeployLesson 3314-3340, 3416-3431; aksent bridge binafshasi */
.ais { display: flex; flex-direction: column; gap: 10px; }
.pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
.pr-head { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid ${T.line}; }
.pr-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
.pr-body { margin: 0; padding: 13px 15px; max-height: min(30vh, 220px); overflow-y: auto; white-space: pre-wrap; word-break: break-word; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }
.pr-copy { border: none; border-radius: 10px; padding: 9px 16px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; transition: background 0.18s; }
.pr-copy.ok { background: ${T.success}; }
.ais-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.ais-row { display: flex; align-items: flex-start; gap: 11px; border-radius: 12px; padding: 10px 12px; background: ${T.bg}; }
.ais-row.on { background: ${T.successSoft}; }
.ais-num { width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; background: ${T.accent}; color: #fff; }
.ais-row.on .ais-num { background: ${T.success}; }
.ais-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; align-items: flex-start; }
.ais-link { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; text-decoration: none; border-radius: 10px; padding: 8px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
.ais-d, .ais-t { font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink2}; line-height: 1.45; }
.dsx-fb { background: ${T.paper}; border-radius: 12px; padding: 11px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
.dsx-fb > summary { cursor: pointer; list-style: none; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.5vw,14px); color: ${T.accent}; }
.dsx-fb > summary::-webkit-details-marker { display: none; }
.dsx-fb[open] > summary { margin-bottom: 9px; }
.dsx-fb-body { display: flex; flex-direction: column; gap: 8px; }
@media (prefers-reduced-motion: reduce) { .pr-copy { transition: none; } }
```
Qorong'i rejim: `npm run gates` ichidagi dark-lint tekshiradi (`T.*` tokenlaridan tashqari qattiq rang yo'q).

## 3.2 Mentor-gap qolipi (Sinf 2)

```jsx
<div className="head"><h2 className="title h-title fade-up">{/* senariy sarlavhasi — o'zgarmaydi */}</h2></div>
<Mentor>{tr({
  uz: <>{/* NEGA: predmet bilan boshlanadi, bitta gap */}. Pastdagi <b style={{ color: T.ink }}>«{/* element yorlig'i */}»</b>{/* ni bosing / tanlang / solishtiring */}.</>,
  ru: <>{/* ПОЧЕМУ */}. Нажмите <b style={{ color: T.ink }}>«{/* ярлык */}»</b> внизу.</>,
})}</Mentor>
{/* shundan keyin vizual (split / BrowserFrame / …) */}
```
Tekshiruv-ro'yxati (metodist, har gap uchun): ☐ NEGA bor · ☐ «Bu/Shu/Hammasi» bilan boshlanmaydi · ☐ element ekrandagi yorlig'i bilan · ☐ puls turgan halqani aytadi ·
☐ interaktivda 1 gap (oddiyda ≤2) · ☐ bo'lak sanalmaydi («5 bo'lakni» emas) · ☐ test/podium/flashcard/yakunda **yo'q** · ☐ uz+ru.

## 3.3 Test-savol: `TestQ` + `QuestionScreen` (Sinf 5)

```jsx
// PmLesson2 savol-qolipi (Screen4:1263): eyebrow + bitta h-ask. Lead (senariy matni) — oddiy qator, serif-karta EMAS.
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    <p className="eyebrow" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p>
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);
```
```css
/* O'chadi: .tq-card, .tq-story, .tq-ask */
.tq { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.tq-lead { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(14.5px,1.8vw,16px); line-height: 1.5; color: ${T.ink2}; }
.h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; margin: 0; }
.option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }
```
`QuestionScreen` ichida (PmLesson2 `:691–721` qiymatlari):
- `.screen` → `justifyContent: isMentorLive ? 'flex-start' : 'safe center'`;
- variantlar konteyneri → `gap: picked !== null ? 8 : 11`;
- har variant → `padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)'`;
- harf → `<span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>` (`.opt-abc` doirasi o'rniga);
- izoh sarlavhasi → «To'g'ri» / «Qaytadan urinib ko'ring»; mentor-reveal → `✓ To'g'ri javob: ${harf} — ${variant}`.
Ball-relsi (`onAnswer`, `submitAnswer`, `recordAttempt`, `INLINE_KEYS`) **tegilmaydi**. 7 faylda `QuestionScreen` bir xil — o'zgarish bir xil qo'llanadi (B7 da qo'shimcha `renderMode` prop bor — saqlanadi).

## 3.4 Keys-rasm bloki (Sinf 6)

```jsx
// PmLesson1:1078-1098 dan. Rasm yuklanmasa emoji qoladi — dars to'xtamaydi (155/156-qonun).
const PHOTO_SET = {
  garvard: {
    img: 'https://go.coddycamp.uz/uploads/media_library/801be58d0e9f80878c76c1265e1adcf2.jpg',
    emoji: '🎓', bg: 'linear-gradient(160deg,#f0e3d0,#fbf6ee)',
    alt: { uz: 'Garvard universiteti binosi', ru: 'Здание Гарвардского университета' },
  },
  // B2: matras: { img: '' /* rasm kelgach */, emoji: '🛏️', bg: '…', alt: { uz: '…', ru: '…' } },
};
const Photo = ({ kind }) => {
  const sc = PHOTO_SET[kind];
  const [failed, setFailed] = useState(false);
  if (!sc) return null;
  if (sc.img && !failed) return <span className="k-photo" style={{ background: sc.bg }}><img src={sc.img} alt={tr(sc.alt)} onError={() => setFailed(true)} /></span>;
  return <div className="k-slide-ic">{sc.emoji}</div>;
};
// Slaydda (bridge k-slide):  {c.photo ? <Photo kind={c.photo} /> : <div className="k-slide-ic">{c.ic}</div>}
// Maket (bashoratdan KEYIN, §186):  {bet !== null && i === 1 && <CutMock />}   ·   <DeckMock ochiq={i >= AB_PREDICT.openAt} />
```
```css
.k-photo { display: block; width: min(360px, 100%); height: clamp(120px,18vw,180px); border-radius: 12px; overflow: hidden; margin: 0 auto; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.4); }
.k-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
```
Maket ko'chirishda: komponent + uning CSS bloki birga ko'chadi (`.cut-*` PmLesson31 · `.nf-*` PmLesson11 · `.dk-*` PmLesson6).
`aria-label` uz+ru bo'ladi (CutMock hozir faqat uz). Ko'chirilgach CSS-qoplama grep: JSX dagi har yangi klassning CSS'i bor-yo'qligi tekshiriladi.

## 3.5 `ChipCompare` — ikki holatli solishtiruv (Sinf 4)

```jsx
// PmLesson2 Screen2:1183 naqshi. Sukutda 1-holat ochiq → puls KO'RILMAGAN chipda (1-C.5).
const [v, setV] = useState(0);
const [seen, setSeen] = useState(() => new Set([0]));
const pend = [0, 1].filter(k => !seen.has(k));
const lit = useTurnWalk(pend, !isMentor);
const pick = (k) => { setV(k); setSeen(p => { const s = new Set(p); s.add(k); return s; }); };
const both = seen.size >= 2;
// …
<div className="fade-up delay-1" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  {CHIPS.map((c, k) => (
    <button key={k} type="button" className={`chip ${v === k ? 'chip-on' : ''}${turnCls(lit, k, pend.length > 1)}`} onClick={() => pick(k)}>{tr(c)}</button>
  ))}
</div>
{/* vizual (BrowserFrame) — v ga qarab */}
{v === 0
  ? <div className="frame-warn fade-step" key="w">{/* 1-holat hukmi — metodist */}</div>
  : <div className="frame-success fade-step" key="s">{/* 2-holat hukmi — metodist */}</div>}
{both && <div className="frame-soft fade-step">{/* SENARIY XULOSASI — so'zma-so'z */}</div>}
```
`.chip`, `.chip-on`, `.frame-warn` CSS — `PmLesson2.jsx:2665–2667`, `:2713` dan (bridge'da yo'q; `AMBER`/`AMBER_SOFT` tokenlari B1:33–34 da bor).

---

## Yakuniy hisob

| Sinf | Buzilgan joy | Asosiy rol |
|---|---|---|
| 1 AI | 7 ekran (har darsda 1) | quruvchi · metodist |
| 2 Mentor-gap | 70 yangi + 7 zaif | metodist · quruvchi |
| 3 Hook | 7 (3 tasida vizual yo'q, 7 tasida MG yo'q, 7 tasida bo'sh `hvote`) | dizayn · jonli · metodist |
| 4 Tushunarsiz ekran | 2 (B1-4, B1-12) | quruvchi · dizayn · metodist |
| 5 Test | 28 ekran dizayni + 7 testda explainWrong chala | dizayn · quruvchi · metodist |
| 6 Keys | 7 (5 tasiga rasm/maket, 2 tasi qarorga) | quruvchi · dizayn · metodist |
| 7 Yo'naltirishsiz | 70 (MG) + 11 (puls ham yo'q) + 1 (soxta tugma) | quruvchi · metodist · dizayn |
| 8 So'z | 4 tugma/yorliq + 7×4 AI yorlig'i; 2 bahsli | quruvchi · metodist |
| 9 Boshqa | 9 naqsh (3 tasi bahsli) | turli |

**Foydalanuvchi qaroriga (tasdiqsiz tegilmaydi):**
1. Senariy matnidagi «tepasida» (B1 7 joy, B4 1 joy) — «sahifa boshida»ga almashtirilsinmi?
2. Hook'da `hook-ack` (tanlagach qisqa javob) qo'shilsinmi — yoki senariydagidek 3-ekrangacha kutilsinmi?
3. B2 Airbnb keysi uchun rasm («havo matrasi qo'yilgan xona») media-kutubxonaga yuklanadimi?
4. «Qoida-plakat» ekrani qo'shilsinmi (yangi ekran — senariy va relslar o'zgaradi)?
5. «📖 Qisqa takrorlash» qolgan 5 darsga qo'shilsinmi (kontent-qo'shimcha)?
6. B7 «qavat» metaforasi — qoladimi?

**Muhrlash (tuzatishdan keyin, B-retsept 4-qadam):** `MATN_KORPUS.md` — «Tepani almashtirish», zaif mentor-gaplar, «So'rovni ko'rish» juftliklari ·
`PM_DARS_ETALON.md` — yangi raqamli qonunlar: (a) AI qadami = doim ochiq so'rov + raqamli 3 qadam + doimiy «✓ Nusxalandi» · (b) ikki holatli solishtiruv = nomli chiplar + har holatga o'z hukmi (bitta ⇄ tugma taqiq) · (c) bosilmaydigan izoh-karta tugmaga o'xshamaydi ·
tekshiruvchi rol-fayliga ov-bandi: «mentor-gap faqat Maqsad ekranida» sinfi (`grep -c "<Mentor"` ≥ interaktiv ekranlar soni).
