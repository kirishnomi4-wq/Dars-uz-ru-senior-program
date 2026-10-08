# 13-Modul — quruvchi saboqlari (MAJBURIY; 08.10.2026, 1-to'lqin pilotlari: 03, 06)

> Har quruvchi / sadoqat / vizual / tuzatuvchi agent topshirig'iga shu fayl qo'shiladi. Uch manba: (A) 9–12-Modul saboqlari — foydalanuvchining qat'iy qoidalari;
> (C) 13-Modul MD lari, ChatGPT auditi Filtrlari (`NN-FILTR.md`), GATE M (`GATE_M_JAVOB.md`) va 11-Modul «qur» dan keyingi sinflar (`00-SEANS_PROMPT.md` 3-bo'lim 6);
> (P) 13-Modul pilot ko'rigi — foydalanuvchi ko'rgach shu yerga yoziladi. Umumiy qonunga muhrlash — asosiy seansda.

## A. Oldingi modullar saboqlari — TO'LIQ o'qing

1. `feedback/F-1005-9modul/QURUVCHI_SABOQ.md` (1–18) · `feedback/F-1005-10modul/QURUVCHI_SABOQ.md` (A, B, C 19–31) · `feedback/F-1005-11modul/QURUVCHI_SABOQ.md` (D 32–39) ·
   **`feedback/F-1006-12modul/QURUVCHI_SABOQ.md` (C va E 40–55 — eng yangisi, 12-Modul pilot ko'rigi)** — to'rtalasi shu modulga to'liq tegishli.
   U yerdagi atamalar va kalitlar (`pm-m8dN-…`, `pm-m9dN-…`, `pm-m10dN-…`) — O'SHA modullarniki; bu modulda — tayanch 2 va 8 (pastda C).
   12-Modul SABOQ 32 «bir guruhda bitta halqa» — bekor (E 40: har variantning o'z yengil chegarasi).
2. Fidbek rasmlari: `feedback/F-1005-10modul/rasm/F-1005-174-*`, `F-1005-175-*`, `feedback/F-1005-11modul/rasm/F-1006-270-1dars-*.png` — o'z ekran turingizga o'xshashini Read bilan ko'ring.
3. **Tayyor namuna (faqat ko'rish; kod bo'lagi ko'chirilmaydi, darslar mustaqil):** 12-Modul darslari skeletdan qurilgan va pilot ko'rigidan o'tgan —
   PM: `src/10-Modull/PmDropOffLesson.jsx`, `PmChannelsLesson.jsx` (QMustaqil ketma-ket karta, yorliq input ichida, yakun E 50) ·
   TEX: `src/10-Modull/WebSocketBasicsLesson.jsx` (QTushuncha sahnalari, QKod, amaliyot `ScreenBlok`, «ws-chorla» halqasi), `BreakAndFixLesson.jsx` (tekshiruv kartasi, blok bayrog'i).
   Skelet tuzoqlari u yerda qanday chetlab o'tilganini ko'ring (`.zoomable.zoom-on`, `ou(eyebrow)`, `fon(T.accent)`, test ustidagi yorliq yo'q).
4. Eng muhimlari (unutilsa — ekran RAD): navbatdagi harakat doim ko'rinadi (bitta tugma — halqa, puls 3 marta, `scale` yo'q; variantlar — har birining o'z yengil chegarasi) ·
   bashorat tanlangach ixcham qator · taxmin natijasi yashil xulosa qutisining birinchi kichik qatori, `QIzoh` — oxirgi kichik qatori (E 42) · kartochkalar alohida ekran, Mentorsiz ·
   ekranda ≤ 3 blok · bo'sh ustun va matnsiz bo'sh chiziq yo'q · yakuniy holat bitta natija bloki, 1280×800 ga sig'adi · telefon maketi CHAPDA (≈170×272) · maketda hech narsa kesilmaydi (E 41) ·
   yashirin bosish yo'q · odamlar real ko'rinishda · ⛶ ishlaydi · stilsiz element yo'q (`python3 feedback/F-1005-10modul/stilsiz.py <fayl>`) · ko'p maydonli bo'lak — bittadan (E 53) ·
   yakun — standart tarkib, «Bugungi asosiy fikr» qutisi yo'q (E 50), sarlavha har holatda rost (E 54) · har harakatli tugmani brauzerda haqiqiy click bilan sinang (E 47).

## C. 13-Modul kelishuvlari

- **MD = manba-haqiqat.** GATE M (13M-GATE-1, 07.10.2026) va ChatGPT auditi Filtrlari (`NN-FILTR.md`, F-1007-459…) MD ichiga allaqachon kiritilgan. O'quvchi ko'radigan har `uz` satr MD dan so'zma-so'z.
  «✎», «Izoh (MD)», «Harakat → Vizual o'zgarish», «KOD», «REPO», «Manbalar», «TAYANCHGA SAVOL», «Shubhali joylar», «O'lchov», «GATE M — o'z tekshiruvim», «Oldindan tuzatiladigan sinflar» — ko'rsatma, ekranga chiqmaydi.
  «O'qituvchi eslatmasi» — faqat Mentor rejimida (MD aytgan joyda). Matnda «(F-1007-NNN)», «(9.5x)», «(tayanch …)» kabi havolalar — izoh, ekranga chiqmaydi. Shubha bo'lsa — o'z `NN-FILTR.md` ingizni oching.
  Matn noqulay tuyulsa — o'zgartirmang, hisobotda «MD ga taklif».
- **MD ↔ SABOQ ziddiyati (vizual):** SABOQ ustun, matn MD dan o'zgarmaydi; har holat hisobotda «MD dan chetlashish (SABOQ N)». Reja/kirish vizualida «bo'sh qator» deyilsa — SABOQ 33 (haqiqiy mazmun, keyingi ekran javobini ochmasdan).
- **Taqiqlar — `00-TAQIQLAR.md` (o'qing).** Eng muhimi: **real pul yo'q** — to'lov faqat test rejimda; har to'lov ekrani maketida kulrang «Test rejim: pul yechilmaydi»; **karta formasi (raqam, muddat, CVV) hech qayerda chizilmaydi**;
  narx yonida kulrang «Mentorning taxmini» (MD qayerda desa); maxfiy kalit qiymati (`sk_…`, `whsec_…` kabi) ekranda, kodda, misolda yo'q — faqat nomi (`.env` da turadi). Telegram — asbob, keys emas.
- **Atamalar** — `00-MODUL-TAYANCH.md` 2-bo'lim aynan (bir ma'no — bir so'z): «Backend», «Database» (prozada «server», «baza» yo'q) · «Pro» va «pullik obuna» · «test rejim» · «to'lov taklifi ekrani» ·
  «yozma tasdiq» · «suhbat» · «tekshiruv» («sinov» yo'q) · «Antigravity» (agent asbobi; o'quvchi matnida «VS Code» yo'q). Kafolat so'zlari («har doim», «darrov», «100%», «albatta», «hech qachon») yo'q.
- **Saqlanadigan natija kalitlari** — tayanch 8 jadvali aynan (`pm-m11dN-…`; maydon nomlari ham; kod qoralamasi `pm-m11dN-code`). Boshqa dars o'qiydigan kalitni o'zgartirmang; kalitga ism, login, telefon yozilmaydi.
  Oldingi modullardan o'qiladigan kalitlar (`pm-m9d6-roadmap`, `pm-m9d8-platforma`, `pm-m10dN-…`) bo'lmasa ham ekran ishlaydi (MD aytgan yo'l).
  `tur: 'mashq' | 'real'` — MD qanday desa; mashq sonlari real sanoqqa kirmaydi.
- **Hook javobi** — MD qanday desa: «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067), olib tashlanmaydi; PM `QKirish` sof so'rovnoma bo'lsa (J-026) — bitta javob uchala variantga.
- **Mentor misoli — «Maydon Jamoa»** (repo `maydon-jamoa`): nom o'z rangida (11-Modul 9.62 yashili — `src/9-Modull` va `src/10-Modull` darslaridagi rang bilan bir), logotip yo'q;
  namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; to'lov taklifi ekrani «Doimiy o'yin — Pro'da» · «30 kun — 15 000 so'm» · «To'lovga o'tish» · «Test rejim: pul yechilmaydi» (tayanch 1.4; MD dagi son aynan).
  Telefon maketi — 12-Modul darslaridagi ko'rinish (faqat ko'rish).
- **Amaliyot bloklari (TEX/loyiha kuni):** `ScreenBlok` + `QBlok` + `QPrompt`; hammasi o'quvchining o'z repo'sida. Agentga yoziladigan prompt matni sen-formada (MD aynan) — `lint:til` ogohlantirishi kutilgan, error emas.
  `{…}` yonidagi kulrang «masalan: …», «Yordam», «Ulgurmasangiz», **tekshiruv kartasi «Kutilganidek» / «Boshqacha»** (MD dagi joyda; dars holatida — `ccProgress`, yangi `pm-…` kaliti yo'q) —
  o'z faylingizda kichik o'rovchi bilan, **`src/qolip` ga tegilmaydi**, hisobotda «qolip taklifi». Blok «bajarildi» bayrog'i — faqat oxirgi (tekshiruv) «Bajardim»idan; yakun sarlavhasi shu bayroqlar va kartalardan (MD).
  Quruvchi repo yaratmaydi; GitHub, Netlify, Render, to'lov xizmatiga hech narsa yubormaydi; `maydon-jamoa` ga tegmaydi.
- **Trek** — `pm-m9d8-platforma.trek` (`mobil` | `web`): MD dagi trek qatorlari; kalit yo'q bo'lsa — MD aytgan yo'l.
- **Yakun** — MD dagi hamma holat sarlavhasi (har biri rost — E 54), ✓ va nishon faqat to'liq holatda; standart tarkib E 50; uyga vazifa — `HwCard` (alohida `.homework.jsx` yo'q); ichki skroll qutisi yo'q.
- **Skelet tuzoqlari** (skelet 05.10 dan beri tuzatilmagan — o'z faylingizda hal qiling): test ustidagi «To'g'ri javobni tanlang» yo'q · `bashorat={!taxmin && …}` ishlatilmaydi ·
  `practice: ou(title)` → `ou(eyebrow)` · `QZ_BG_SHAPES` — darsning o'z atamalari (MD «Fon so'zlari» bo'lsa — o'sha), `{ uz, ru }`, emoji va «Frontend/Backend» yo'q · `rgba(255,79,40,…)` → `fon(T.accent)` ·
  `QKod` o'ng ustun propi — 9-Modul 1-dars `QKOD_ONG` yechimi · global `.mentor` klassi bilan to'qnashmang (dars elementlariga o'z prefiksi: 03 — `.pw-`, 06 — `.mt-`) ·
  ⛶: `.zoomable.zoom-on` qoidasi (E 48) + `.q-fokus:has(.zoom-on)` va voqea konteyneri `:has(.zoom-on) { animation: none; transform: none; }` (aks holda oyna joyida ochiladi) ·
  `HtmlCompiler` faqat birinchi JS faylni ulaydi va tekshiruv 50 ms da async ni kutmaydi — kod oynasida hisobga oling va sinab ko'ring.
- **11-Modul «qur» dan keyin har darsda qaytgan sinflar (birinchi kundanoq):** o'quvchi javobini tekshiruvchi regex — ikki tilli (o'zbekcha so'z bilan birga ruscha ham) ·
  `tr()` modul darajasida chaqirilmaydi (render ichida yoki funksiyada) · maket va chat satrlari `{ uz, ru }` (bir tilli `{ t: '…' }` emas), fon so'zlari ham ·
  sonli ruscha satrlarda ko'plik shakli (1 платёж · 2 платежа · 5 платежей) · ekrandagi nom = matndagi nom (Mentor gapi tugmani qanday ataydi — maketda shunday yozilgan) ·
  o'quvchi gapidagi «N-ekran» — hisoblagich 1 dan sanaydi (MD 0 dan).
- **Telefon va akkaunt nomi tekshiruvi** (06 — 6, 7-ekran va boshqa yozish maydonlari; MD aynan): «@», «t.me/», «+998» yoki 9 raqamli telefon shakli — bloklaydi; boshqa ketma-ket 7+ raqam — yumshoq (F-1007-464). PM-108: kamida 10 namuna bilan `node` da sinang.
- **Agent tuzog'i:** Write/Bash `\uXXXX` ni harfga aylantirishi mumkin — kirill va belgilarni to'g'ridan-to'g'ri yozing; CSS shablon-satri ichida (izohda ham) BACKTIK yo'q; bir qatorli funksiya ichida `//` yo'q.
- **Lokal server:** 13-Modul porti 5175 (5173 — AILM, 5174 — 12-Modul, 5300 — 11-Modul; ularga tegmang). Server ishga tushirmang va to'xtatmang — suratlar uchun `konveyer/vositalar/shots.mjs` / `ekran.mjs` yetadi.
- **Hali sinalmagan narsalar («qur» darvozalari — ⛔):** real telefon, Expo Go, Render'dagi Backend, to'lov xizmatining test kabineti. Dars fayli MD bo'yicha quriladi; sinov boshqacha chiqsa — MD va dars keyin birga tuzatiladi.
- **App.jsx** — asosiy seans ulaydi (`m11-03`, `m11-06` — `comp`); quruvchi App.jsx ga tegmaydi.

- **AI bilan davom (PM-109, F-1007-475):** sherik/juftlik/real suhbat bor darsda yakunga `AiDavomCard` naqshi (06 dagi: sarlavha · 2 gap yo'riq · so'rov `<pre>` · nusxalash tugmasi; mentor rejimida yo'q). So'rov darsning misol-ipi ustida, AI sherik rolini o'ynaydi.
- **Yo'riqnoma ko'rinmagan narsaga ishora qilmaydi (F-1007-474, F-1007-479):** bashorat yoki Mentor gapi hali ekranda yo'q narsani («oltita gap», «har karta») aytsa, o'quvchi uni qidiradi — matn «hozir keladi» deb aytadi va sanoq ko'rinadi (6 katakcha; jadvalda bo'sh qatorlar).

## P. 13-Modul pilot ko'rigi (foydalanuvchi) — ko'rgandan keyin yoziladi

Foydalanuvchi 08.10 ertalab 03 va 06 ni ko'rdi — 8 fidbek (F-1007-473…480), hammasi tuzatildi va tasdiqlandi. Sinflar (2-to'lqinda OLDINDAN qo'llanadi):
1. **Odam figurasi chizilmaydi** (473). Hook/sahna uchun o'z SVG odamchasi — rad. Rol kerak bo'lsa: rol yorlig'i + pufak («tashkilotchi · …»); figura zarur bo'lsa — faqat 9-Modul `PmInterviewsOneLesson` dagi tayyor `Odam` (telefon ushlagan), o'z chizmasi emas.
2. **QKirish maketi ustunga sig'sin** (473, 476). `q-split` 1fr/1fr; maket ≥ 480 px bo'lsa variantlarga yopishadi yoki orada bo'shliq qoladi. Fayl ichida: `.<prefiks>-k .q-split { grid-template-columns: max-content minmax(0,1fr); gap: 28px }` (≥761). 06 va 03 namunasi.
3. **Yo'riqnoma ko'rinmagan narsaga ishora qilmaydi** (474, 479). Bashorat/Mentor gapi hali ekranda yo'q narsani («oltita gap», «har karta») aytsa — o'quvchi qidiradi. Mentor bosqichga qarab (bashoratgacha: «Avval … belgi qo'ying — keyin N karta birma-bir keladi»), sanoq ko'rinadi: N katakcha (06 `.mt-katak`) yoki jadvalda bo'sh uzuq qatorlar (03 `.pw-sx-r.bosh`).
4. **AI bilan davom kartasi — PM-109** (475). Sherik/juftlik/real suhbat/Render kutish bor darsda yakunga `AiDavomCard` (06/03 naqshi: `card` · sarlavha «Erta tugatdingizmi? AI bilan davom eting» · 2 gap yo'riq · so'rov `<pre>` · «So'rovni nusxalash»; mentor rejimida yo'q). AI sherik rolini o'ynaydi (tashkilotchi, to'lov xizmati, tekshiruvchi), o'quvchi o'z ishini o'zi qiladi; so'rov darsning misol-ipi ustida. MD yakun bandida matn bor bo'lsa — aynan; bo'lmasa shu naqshda yozing va hisobotda «MD ga taklif».
5. **`max-content` ustun + `zoom` — taqiq** (477). Chrome `grid-template-columns: max-content` ichidagi `zoom:.8` elementni 1,9× hisoblaydi (968 px) — yakun holatida ustun aniq px (`512px minmax(0,1fr)`).
6. **To'lov sahifasi maketi — tanish ko'rinish** (478). Telefon/brauzerdagi to'lov sahifasi «qora-oq matnli varaq» emas: Payme ko'rinishi (03 `MashqSahifa`: `PAYME_RANG #00B5B5` sarlavha «Payme · mashq», kichik «Mashq to'lov», savdogar nomi o'z rangida, summa 17 px, tugma Payme rangida, pastda «Karta so'ralmaydi, pul yechilmaydi»). Karta maydoni, CVV, muddat — hech qachon. 05, 07-darslarda to'lov sahifasi shu naqshda.
7. **`.q-dd-chip` rangiga override yo'q** (480). Faqat shrift o'zgartiriladi; `background`/`color`/`border` — qolipniki (accent). `code` ichida: `rgba(255,255,255,.22)` fon.
8. **Harakat → vizual o'zgarish tugagach ham qoladi** (03 sadoqat): nom qatori (atama ta'rifi) `!tugadi` bilan yashirilmaydi; O'qituvchi eslatmasida ekran raqami 1 dan (hisoblagich bilan bir xil).
9. **Son va kod chipi qator oxirida bo'linmaydi** (03 vizual): «8 / 10», «10 000» — `\u00a0`; chip/`code` — `white-space: nowrap`; 390 px da keng jadval — `max-content` ustunlar + gorizontal aylanish.

**A-to'lqin tekshiruvidan (08.10, 01·02·04·05 sadoqat + vizual) — B/C to'lqinda OLDINDAN:**
10. **LiveGate sarlavhasi:** skeletda `title={tr({ uz: 'Tizim arxitekturasi darsi' … })}` qolgan — `title={tr(LESSON_META.lessonTitle)}` ga almashtiring (07–12 skeletlarida 08.10 da tuzatildi; boshqa joyda ko'rsangiz — tuzating).
11. **Tugagan holat sinf noutbukiga sig'adi (199, A4):** skelet `Stage` avto-skrolli faqat telefonda (`isNarrow`). Har ekranning YAKUN holatini 1280×773 va 1366×768 da o'lchang: yashil xulosa/QXulosa pastki panel ustida bo'lsin. Avval yakun maketini ixchamlang (yig'ilgan kartalar ≤260 px, sahna kichrayadi); sig'masa — o'z faylingizdagi `Stage` da desktopda ham tugash signalida natijaga skroll. 01, 05 da topildi.
12. **Bashorat va Mentor — ko'rinmagan tugmaga ishora yo'q (P3 kengaytmasi):** «tugmalarni bosing», «ikkala rolni bosing» desa — tugmalar va sahna bashoratgacha HAM ko'rinib turadi, `disabled` bilan (06 Screen2 naqshi); `harakat={taxmin && …}` / `vizual={taxmin && …}` bilan yashirmang. 01, 02 da topildi.
13. **Maket ichidagi mayda shrift:** telefon/brauzer maketi ichida ham ≥ 10 px, majburiy taqiq yozuvi («Karta so'ralmaydi, pul yechilmaydi») ≥ 10 px (03 `MashqSahifa`). ⛶ kontentni kattalashtirmaydi — unga tayanmang. 05 da 8 px topildi.
14. **Rostlik (E 54) — «hammasi» gaplari:** «To'rt urinish yozildi», «hammasi buzilmadi», «karta o'zgartirildi» kabi yashil qator faqat shart TO'LIQ bajarilganda; qisman holatda `null` yoki qisman gap. `null` (belgilanmagan) qiymat «yo'q/buzilmadi» deb sanalmaydi. 02, 05 da topildi.
15. **Ichki havola ekranga chiqmaydi:** O'qituvchi eslatmasida ham «(tayanch 1.0)», «(SABOQ …)», «(F-…)» yo'q. «Yangilash» — saqlangandan keyingi tugma (MD aytsa). O'qituvchi eslatmasi MD dagi HAR blok uchun (04 da butunlay tushib qolgan edi).
