# 6-Modul (LMS: 8-Modul) · 3-dars «Arxitektura patternlari» — MD v3

Fayl: `src/6-Modull/ArchPatternsLesson.jsx` · 20 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `03-ArchPatterns-v2.md` (5 tayanch fikr, oshxona metaforasi — 29.09 tasdiqlangan) + hozirgi kod (F-1004-31 sarlavha tuzatishlari bilan).
v3 **har ekranni** yozadi: 0, 2, 3, 5, 7, 9, 10, 13 matn-kartadan harakatga aylandi, 6 va 12 (bor mashq) chizmaga ulandi, 16 — repo ustida; testlarda faqat matn o'zgardi.
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti): `INLINE_KEYS = { s4: 3, s8: 1, s11: 0, s14: 2, s15: 0, practice: -1 }`; arena 0-1-2-3 aylanma.

Menyu nomi (App.jsx `m6-03`): **Arxitektura patternlari** · sub «MVC, mikroservis — sodda tilda» — o'zgarmaydi (DE-205).
Oldingi dars: `m6-02` «Bitta gapni uch kishi bir xil tushunadimi?» (PM, mini-do'kon varag'i; oxiri: «Keyingi dars — Arxitektura patternlari … (MVC, monolit, mikroservis)»).
Keyingi dars: `m6-04` «AI-agent nima».

---

## A. Darsning tayanchi

**Tayanch fikrlar (v2 dagidek, dars bo'yi shu va faqat shu):**
1. **Pattern** — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli. U tayyor kod emas.
2. **MVC** — kodni vazifasi bo'yicha 3 qismga ajratish usuli. Kanon gap (T-042, so'zma-so'z bir xil): **View ko'rsatadi, Controller yo'naltiradi, Model ma'lumot va qoidalar bilan ishlaydi, Database saqlaydi.**
3. **Database (PostgreSQL) — Model emas.** Database saqlaydi, Model u bilan ishlaydi.
4. **Ikki xil savol:** MVC — bitta ilova *ichidagi* tartib. Monolit yoki mikroservis — tizim *nechta ilovaga* bo'lingani.
5. **Tanlov formulasi yo'q:** kichik loyihada monolit ko'pincha qulay; tizim va jamoa kattalashsa, bo'limni alohida xizmatga ajratish foydali bo'lishi mumkin.

**Atamalar (bir ma'no — bir so'z, T-014):** pattern · MVC · View (ko'rinish) · Controller (yo'naltiruvchi) · Model (ma'lumot va qoidalar) · **Database** (PostgreSQL) ·
ilova · bo'lim (Mahsulotlar · Savat · To'lov · Foydalanuvchilar) · xizmat · monolit · mikroservis · joylashtirish (deploy) · miqyoslash (scaling) · so'rov · javob.
Ishlatilmaydi: «baza» (1-dars tugun nomi — Database; pastda 1-savol), DB, biznes-mantiq, marketplace, startap, MVP, arxitektor, «darrov», «har doim».

**Misol-ip (P-001):** 1-darsdagi do'kon sayti — mini-do'kon (Telefon 2 500 000 · Quloqchin 300 000; 2-darsda uning varag'i yozilgan). Hook, chizma, testlar — shu do'kon.
Ikkinchi misol faqat 12-ekran tavsiflarida (P-002). Amaliyot — o'quvchining o'z boti (`TelegramBotNest`, 5-Modul) — misol-ko'prik o'quvchi ishidan (P-021).

**Metafora:** oshxona (4a-Modul Nest darslari) — faqat 3-ekranda, bir marta: ofitsiant = Controller · oshpaz va retseptlar = Model · ombor = Database · zal va menyu = View.

**Ekran qoidalari (04.10 qonunlari):** har tushuncha-ekranda bitta harakat → chizma o'zgaradi (DE-184), ostida «Harakat → Vizual o'zgarish» qatori ·
vizual ⛶ ichida (DE-200) · ish tugagach harakat paneli yopiladi, chizma butun enga chiqib fokusga keladi (DE-199) · bashorat ballsiz (181: 5 va 9-ekran) ·
sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi (§225) · yashil xulosa ≤110, bitta (202) · xato izohi ≤60 · tugma/variantda emoji yo'q (185) ·
ichki tugma o'ngda (187) · tugma siz-formada yoki ot-shaklda, zanjir ot-shaklda (§222/224).

---

## Darsning ipi va bitta vizual

- **Hook:** do'kon 100 ta faylga o'sdi, mijoz «narx noto'g'ri» deb yozdi → tartibsiz va tartibli papka → «pattern».
- **Bitta vizual — «Do'kon chizmasi»** (`DOKON` — bitta manba, 180). Ikki ko'rinish, bitta chizma:
  - **ichki ko'rinish (MVC):** chapda do'kon sahifasi maketi (1-dars `SiteMock`: Telefon · Quloqchin · «Mahsulotlar» tugmasi) = **View**;
    o'rtada server qutisi ichida **Controller** (`controllers/`) → **Model** (`models/`) — uchalasi bitta ingichka ramkada «MVC»;
    ramka tashqarisida, pastda **Database** silindri (PostgreSQL). 3, 5, 6, 7, 13-ekran.
  - **tashqi ko'rinish (tizim):** server qutisi kichrayib, katta ramka — «do'kon backend ilovasi» — ichida 4 bo'lim: Mahsulotlar · Savat · To'lov · Foydalanuvchilar
    (har birida kichik «C · M» belgisi — MVC har bo'lim ichida). Mikroservisda ramka 4 ga bo'linadi, xizmatlar orasida tarmoq chiziqlari. 2, 9, 10, 12-ekran.
  - **Holatlar:** kulrang (yopiq) → oq karta + nom (ochilgan) → accent chegara (joriy) → yashil (ishladi) → qizil (xato / to'xtadi).
    So'rov — chizmada yuradigan konvert (so'rov — modul rangi, javob — yashil; 1-dars `SysMap` bilan bir xil). Logotip va emoji yo'q (D4, Q3 A).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Kerakli kodni qaysi loyihada tezroq topasiz?** (44)
- Mentor: 1-darsdagi do'kon o'sib, 100 ta faylga yetdi. Mijoz yozdi: «Telefon narxi noto'g'ri chiqyapti».
- Maket (chap): ikki papka yonma-yon —
  `tartibsiz/` — `index.js` · `kod2.js` · `stuff.js` · `final_ROST.js` · `yana_bir.js` · kulrang «+95 fayl» ·
  `tartibli/` — `views/` · `controllers/` · `models/` (yopiq papkalar, izohsiz).
- Variantlar (radio, o'ng): Tartibsiz loyihada · Tartibli loyihada · Ikkalasida bir xil
- Javob — 2-variant: **Aynan!** Tartibli loyihada har fayl o'z vazifasiga qarab turadi. Bunday sinalgan tartib — pattern. (96)
- Javob — 1 yoki 3: **Qiziq fikr!** Tartibsizda fayllarni bittalab ochasiz, tartiblida narx kodi o'z papkasida. Bunday tartib — pattern. (112)
- **Harakat → Vizual o'zgarish:** variantni tanlash → ikkala maketda qidiruv boshlanadi: `tartibsiz/` da fayllar bittalab miltillab o'tadi
  (hisoblagich «ochildi: 1 … 37»), `tartibli/` da `models/` ochiladi va `mahsulot.model.ts` birinchi qadamda yonadi.
✎ sarlavha 63 → bitta qator · hook javobi 257/229 → ≤120 · variantlar teng uzunlikda (oldin «fayl ko'p bo'lsa, kuchli loyiha» — g'alati tuzoq) ·
«Ikki loyihani ko'rish» tugmasi olindi — maket darhol ko'rinadi, harakat = tanlov · «darrov topiladi» (kafolat so'zi) olindi · ❌/✅ papka belgilari olindi (185)

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun do'kon kodini tartibga solamiz.** (37)
- Mentor: Nest darslarida Controller yozganingizda shunday usullardan birini ishlatgansiz. Endi uning nomini bilib olasiz.
- Chap: «Dars oxirida shunday deya olasiz:» — «Mini-do'kon — monolit, ichi MVC bo'yicha tuzilgan.» + kichik Do'kon chizmasi: View · Controller · Model · Database,
  ular orasida so'rov va javob konverti aylanib yuradi (DE-201, 1-dars rejasi kabi).
- O'ng (01 · matn · teg):
  - 01 · MVC — kodning uch qismi · `mvc`
  - 02 · Do'kon kodini qismlarga joylash · `moslash`
  - 03 · Monolit yoki mikroservis — qachon qaysi biri · `tizimni bo'lish`
  - 04 · Tizimni bir jumlada ta'riflash · `bir jumla`
✎ sarlavha 59 → 1 qator (natija va'dasi, P-014) · Mentor 3 gap → 2 («Yaxshi xabar:» olindi) · «boshqa dasturchi darrov tushunadi» olindi · telefon rejimidagi «4 qadamni ko'rish» tugmasi — QReja o'zi hal qiladi

## 2 · Pattern nima?  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · pattern
- Sarlavha: **Pattern nima?** (13)
- Mentor: Har bo'lim uchun fayllarni tartiblang va natijalarni solishtiring.
- Vizual: Do'kon chizmasi, tashqi ko'rinish — 3 qator: Mahsulotlar · Savat · To'lov; har qatorda 3 bo'sh uya `views/` · `controllers/` · `models/`,
  yonida o'sha bo'limning tartibsiz fayl uyumi.
- **Harakat → Vizual o'zgarish:** bo'lim qatorini bosish → uning fayllari uyumdan uchib, o'z uyasiga tushadi:
  `MahsulotlarSahifa.jsx` → views/, `mahsulot.controller.ts` → controllers/, `mahsulot.model.ts` → models/ (Savat va To'lov ham shunday, fayl nomlari o'zgacha).
  3/3 da uchala qator ustidan bitta uzuq ramka chiziladi — «bir xil shakl», fayl nomlari esa har qatorda ajralib turadi.
- Xulosa: Pattern — sinab ko'rilgan usul: shakl har bo'limda bir xil, kod esa har safar o'zingizniki. (91)
- Tugma (pastki): Bo'limlarni tartiblang (N/3) → Davom etish
✎ «Hayotdan misol?» → 3 matn-karta (futbol, qurilish, kod) olindi — misol endi ip ichida (184, P-001) · ta'rif sarlavhadan xulosaga: avval harakat, keyin atama (T-011) ·
«tayyor kod emas» endi ko'rinadi: shakl bir xil, fayllar har xil · 🧩 olindi

## 3 · MVC'ning uch qismi  ← QTushuncha (qayta qurildi)
- Eyebrow: Pattern · MVC
- Sarlavha: **MVC'ning har qismi do'konda nima qiladi?** (40)
- Mentor: Nest darslaridagi oshxonani eslang: ofitsiant buyurtmani oladi, oshpaz pishiradi, ombor saqlaydi. Maketdagi joylarni bosing — kod qismi chizmada ochiladi.
- Chap — do'kon sahifasi maketi, 4 nuqta (pulsatsiya halqasi, 168):
  - mahsulot kartochkasi → **View** · ko'rinish — «ko'rsatadi» · *oshxonada: zal va menyu*
  - «Mahsulotlar» tugmasi → **Controller** · yo'naltiruvchi — «so'rovni qabul qilib, yo'naltiradi» · *oshxonada: ofitsiant*
  - narx «2 500 000» → **Model** · ma'lumot va qoidalar — «narx bor va manfiy emas» · *oshxonada: oshpaz va retseptlar*
  - yangilash belgisi (sahifa yangilansa ham ro'yxat turadi) → **Database** · PostgreSQL — «saqlaydi» · *oshxonada: ombor*
- O'ng — Do'kon chizmasi, ichki ko'rinish (Mahsulotlar bo'limi).
- **Harakat → Vizual o'zgarish:** maketdagi joyni bosish → chizmada o'sha qism kulrangdan oq kartaga aylanadi (nom + qo'shtirnoqli vazifa + kulrang «oshxonada: …»),
  maketdagi joydan qismgacha chiziq bir lahza yonadi. Database ochilganda u «MVC» ramkasidan **tashqarida** paydo bo'ladi, Model bilan chiziq ustida yorliq:
  «Model emas — saqlaydi». 4/4 da chizma to'liq.
- Xulosa: View ko'rsatadi, Controller yo'naltiradi, Model ma'lumot va qoidalar bilan ishlaydi, Database saqlaydi. (103)
- Tugma (pastki): Qismlarni toping (N/4) → Davom etish
✎ 3 pick-row + matn-karta → maket + chizma (pilot 2-ekran naqshi) · ta'rif-sarlavha (52) → savol · alohida sariq «Baza — Model emas» kartasi olindi — chizmada ko'rinadi ·
xulosa 114 → kanon gap · «Baza» → «Database» · «asosan React», «Nest'dagi controllerlar» → 6-ekran kod bo'laklarida · 🗄️ olindi

## 4 · 1-savol  ← QTest (v2 dagidek, izohlar qisqardi)
- Eyebrow: Mashq · 1-savol
- Savol: **MVC'da foydalanuvchi ko'radigan qism qaysi?**
- Variantlar: A Controller — so'rovni yo'naltiradi · B Model — ma'lumot bilan ishlaydi · C Hech qaysi — bu MVC'ga kirmaydi · **✔ D View — sahifa va tugmalar**
- Kalit: `INLINE_KEYS.s4 = 3`, `correctIdx={3}` — o'zgarmaydi.
- To'g'ri izohi: View — sahifa, tugmalar va rasmlar; qoidalar boshqa qismda. (59)
- Xato izohlari:
  - A: Controller so'rovni yo'naltiradi — u ekranda ko'rinmaydi. (57)
  - B: Model ma'lumot va qoidalar bilan ishlaydi, ekranda emas. (56)
  - C: MVC'ning uchala harfidan biri aynan ko'rinadigan qism. (54)
✎ to'g'ri izohidan «To'g'ri!» olindi · xato izohlari 72–92 → ≤60 va to'g'ri javobni aytmaydi (S-010)

## 5 · So'rovning yo'li  ← QTushuncha (bashorat + qadamlar, qayta qurildi)
- Eyebrow: Tajriba · so'rov yo'li
- Sarlavha: **«Mahsulotlar» bosilgach so'rov qayerga boradi?** (46)
- Mentor: So'rovni o'zingiz yo'naltiring: har qadamda keyingi qismni bosing.
- Bashorat (ballsiz, 181): **So'rovni birinchi qaysi qism qabul qiladi?** · View · Controller · Model — tanlov saqlanadi.
- Qadam-ro'yxati (chapda, 163.8): 1 «Mahsulotlar» bosildi · 2 Controller qabul qildi · 3 Model Database'dan oldi · 4 Controller View'ga berdi · 5 Sahifada ro'yxat
- Joriy qadam kartasi (chizma ostida, bitta qator): masalan «Controller so'rovni qabul qildi va Model'ga yo'naltirdi.»
- **Harakat → Vizual o'zgarish:** maketda «Mahsulotlar» bosiladi → konvert chiqadi; o'quvchi chizmadagi KEYINGI qismni bosadi → konvert o'sha qismga uchadi,
  chiziq yashil, chapdagi qadam ✓. Model bosilganda konvert o'zi Database'ga tushib, ikki qator (Telefon, Quloqchin) bilan yashil javob bo'lib qaytadi.
  Oxirida View bosiladi → maketda mahsulotlar ro'yxati paydo bo'ladi. Noto'g'ri qism — qism silkinadi, bir qator:
  View → Model: Bu tuzilmada View Model'ga to'g'ridan bormaydi. (47) · Controller → Database: Database bilan Model ishlaydi. (30)
- Natija qatori: «Taxminingiz: … · haqiqatda: Controller» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: So'rov Controller → Model → View yo'lidan o'tdi: View ma'lumotni Controller orqali oldi. (88)
- Tugma (pastki): Yo'lni yuring (N/5) → Davom etish
✎ «Keyingi qadam» bosib kuzatish → o'quvchi keyingi qismni o'zi tanlaydi (pilot 3-ekran) · sarlavha javobni aytardi («So'rovni avval Controller qabul qiladi») → savol ·
xulosa 189 (4 gap) → 1 gap · 🖥️🎮🗄️ tugunlari → chizilgan chizma

## 6 · Do'kon kodi qaysi qismga tushadi?  ← QTushuncha (saralash, nishon «Role Mapper»)
- Eyebrow: Moslash · do'kon kodi
- Sarlavha: **Do'kon kodi MVC'ning qaysi qismiga tushadi?** (43)
- Mentor: MVC — texnologiya emas, kodning vazifasi. Kodni o'qing va chizmadagi mos qismni bosing.
- Kod bo'laklari (navbat bilan, chapda «Kod bo'lagi N/3», texnologiya nomi yozilmaydi):
  1. → View
     ```jsx
     function Mahsulotlar({ royxat }) {
       return royxat.map(m => <Karta nom={m.nom} narx={m.narx} />);
     }
     ```
  2. → Controller
     ```ts
     @Get('products')
     royxat() {
       return this.mahsulotlar.hammasi();
     }
     ```
  3. → Model
     ```ts
     qoshish(m) {
       if (!m.nom) throw new Error('Nom kerak');
       return this.repo.save(m);
     }
     ```
- **Harakat → Vizual o'zgarish:** chizmadagi qismni bosish → to'g'ri bo'lsa kod bo'lagi o'sha qism kartasiga uchib kiradi (karta ichida kod qatorlari);
  Model'ga tushganda `repo.save` qatoridan Database'gacha chiziq yonadi. Noto'g'ri → qism silkinadi, bir qator:
  1: Bu kod ro'yxatni sahifada chizadi. (34) · 2: Bu kod so'rovni qabul qilib, ishni boshqasiga beradi. (53) · 3: Bu kod qoidani tekshirib, ma'lumotni yozadi. (44)
- Nishon sharti: `AchRule` (umumiy matn, o'zgarmaydi).
- Xulosa: Sahifa kodi — View, so'rovni qabul qiladigan kod — Controller, qoida kodi — Model. (82)
- Tugma (pastki): Kodni joylang (N/3) → Davom etish
✎ matn-tavsiflar → 3–4 qatorli haqiqiy kod (P-065) · tugma-ro'yxat → chizmaning o'zi bosiladi · muvaffaqiyat matni 226 → 1 gap · bitta umumiy xato → har bo'lakka o'z mezoni (S-010) ·
Model bo'lagida «narx manfiy» o'rniga «nom kerak» — 8-ekran testining javobi oldindan berilmasin

## 7 · Xato chiqdi  ← QTushuncha (qayta qurildi)
- Eyebrow: Foyda · xatoni topish
- Sarlavha: **Xato chiqdi: qaysi qismni ochasiz?** (34)
- Mentor: Mijozlar xatolar haqida yozdi. Har xabar uchun chizmadagi qismni bosing.
- Xabarlar (navbat bilan, chapda, chat-pufak):
  1. «Mahsulot rasmi sahifada chiqmayapti» → View
  2. «`/savat` manzili topilmadi» → Controller
  3. «Savatdagi jami summa noto'g'ri» → Model
- **Harakat → Vizual o'zgarish:** qismni bosish → chizmada o'sha qism papkasi ochiladi, faylda xato qatori qizil yonadi
  (`views/MahsulotlarSahifa.jsx` — `<img src={rasm}>` · `controllers/savat.controller.ts` — `@Get('savat')` qatori yo'q · `models/savat.model.ts` — `jami()`);
  pastdagi hisoblagich: «ochilgan papka: 1» — yonida kulrang «patternsiz: 100 ta fayl». Noto'g'ri → silkinish + bir qator:
  1: Rasm ekranda ko'rinadi — uni qaysi qism chizadi? (48) · 2: Manzilni so'rovni qabul qiladigan qism belgilaydi. (50) · 3: Summa hisobi — qoida. Qoidalar qaysi qismda? (44)
- Xulosa: Har kod o'z qismida: xatoni bitta papkadan topasiz, jamoada ham kim qayerda ishlashi aniq. (90)
- Tugma (pastki): Xatolarni toping (N/3) → Davom etish
✎ 4 foyda-chip + matn-karta → 3 xato xabari, xato chizmada topiladi (184) · «Tartib» va «Xatoni topish» — harakatda, «Jamoa» — xulosada, «AI» — 13-ekran xulosasida (takror bo'lmasin, T-048) ·
xulosa 164 → 1 gap · 3-xabar «narx manfiy» emas — 8-ekran testi takrorlanmasin

## 8 · 2-savol  ← QTest (savol qisqardi)
- Eyebrow: Mashq · 2-savol
- Savol: **Nest'dagi «narx manfiy bo'lmasin» qoidasini tekshiradigan kod MVC'ning qaysi qismi?** (83)
- Variantlar: A View — natija sahifada ko'rinadi · **✔ B Model — ma'lumot va uning qoidalari** · C Controller — kod backend'da turibdi · D Hech qaysi — kod MVC'dan tashqarida
- Kalit: `INLINE_KEYS.s8 = 1`, `correctIdx={1}` — o'zgarmaydi.
- To'g'ri izohi: Qoidalar Model'da: Controller bu kodni chaqiradi, Database esa saqlaydi. (72)
- Xato izohlari:
  - A: Natija sahifada ko'rinadi, lekin View qoidani tekshirmaydi. (59)
  - C: Backend'da turgan har kod ham Controller emas. (46)
  - D: Qoida ham MVC'ning bitta qismida turadi. (40)
✎ savol 113 → qisqa (S-001; «bazaga yozadigan» olindi — tuzoq «backend'da» qoldi) · variantlardan «chunki» olindi (uzunlik teng) · izohlar ≤60

## 9 · Hamma bo'lim bitta ilovada  ← QTushuncha (bashorat, qayta qurildi)
- Eyebrow: Tizimni bo'lish · bitta ilova
- Sarlavha: **Hamma bo'lim bitta ilovada bo'lsa, nima bo'ladi?** (48)
- Mentor: MVC — bitta ilova ichidagi tartib edi. Endi boshqa savol: tizim nechta ilovadan iborat?
- Vizual: chizma tashqi ko'rinishga o'tadi — MVC ramkasi kichrayib, «do'kon backend ilovasi» ramkasidagi 4 bo'limdan biriga aylanadi
  (Mahsulotlar · Savat · To'lov · Foydalanuvchilar, har birida «C · M»). Chapda sahifa maketi, pastda Database — ramkadan tashqarida.
- Bashorat (ballsiz): **To'lov bo'limida jiddiy xato chiqsa, nima bo'ladi?** · Faqat To'lov to'xtaydi · Butun ilova to'xtashi mumkin
- **Harakat → Vizual o'zgarish** (2 harakat):
  1. «Joylashtirish (deploy)» → ilova serverga bir marta chiqadi: 4 bo'lim birga yashil yonadi; hisoblagich «ilova: 1 · joylashtirish: 1»;
     ramka ustida yorliq paydo bo'ladi: **monolit — bitta ilova**.
  2. «To'lov'da xato» → To'lov qizil, so'ng butun ramka kulrang; maketda mahsulotlar o'rnida yuklanish belgisi, «Savatga» bosilmaydi (1-dars 9-ekran bilan bir xil).
- Natija qatori: «Taxminingiz: … · haqiqatda: butun ilova to'xtadi».
- Xulosa: Monolit — bitta ilova: sodda boshlanadi, lekin jiddiy xato hammasini to'xtatishi mumkin. (88)
- Tugma (pastki): Ilovani sinang (N/2) → Davom etish
✎ 🏢 matn-blok + «Plus va minusi?» → bashorat + ikki sinov, plus va minus chizmada (184) · atama sarlavhadan yorliqqa — harakatdan keyin (T-011) ·
Mentor 4 gap → 2 («ikki xil savol» saqlandi) · deploy izohi tugma yorlig'ida (4c-Modulda o'tilgan) · «Ko'p loyihalar monolitdan boshlanadi» → 11-ekran va kartochka ·
bo'limlar bitta manbadan (`DOKON.bolimlar`): oldin 9-ekranda «savat», 10-ekranda «yetkazish» edi

## 10 · Bo'limlarni ajratamiz  ← QTushuncha (qayta qurildi)
- Eyebrow: Tizimni bo'lish · alohida xizmatlar
- Sarlavha: **Bo'limlarni alohida ilovalarga ajratsak-chi?** (44)
- Mentor: Tizim va jamoa kattalashganda shunday qilish foydali bo'lishi mumkin. Har bo'limni bosing, keyin sinab ko'ring.
- **Harakat → Vizual o'zgarish:**
  1. bo'limni bosish (×4) → u monolit ramkasidan chiqib, o'z ramkasiga o'tadi; xizmatlar orasida tarmoq chiziqlari chiziladi;
     hisoblagich «ilovalar: 1 → 4 · ulanishlar: 0 → 3 · joylashtirish: 4». 4/4 da yorliq: **mikroservis — alohida xizmatlar**.
  2. «To'lov'da xato» → faqat To'lov qizil, qolgan uchtasi yashil; maketda mahsulotlar va savat ishlaydi, faqat to'lov qatori kulrang: «To'lov vaqtincha ishlamayapti».
  3. «Bayram: to'lovga yuk» → To'lov yonida ikkinchi nusxa paydo bo'ladi (×2), yorliq: **miqyoslash (scaling)**.
- Xulosa: Mikroservisda xato va yuk bitta xizmatda qoladi, lekin xizmatlarni ulash va kuzatish murakkab. (94)
- Tugma (pastki): Ajrating va sinang (N/6) → Davom etish
✎ «Mikroservislarga bo'lish» bitta tugma + plus/minus matn-kartalari (209/142) → ajratish + ikki sinov: plus — chizmada (xato bitta xizmatda, nusxa ×2),
minus — hisoblagichda (ilovalar 4, ulanishlar 3) · sarlavhadagi atama olindi (T-011) · «Yetkazish» → «Foydalanuvchilar» (9-ekran bilan bitta manba)

## 11 · 3-savol  ← QTest (v2 dagidek, izohlar qisqardi)
- Eyebrow: Mashq · 3-savol
- Savol: **Yangi, kichik loyiha, jamoada 2 kishi. Qaysi biri qulayroq?**
- Variantlar: **✔ A Monolit — sodda, keyin bo'lish ham mumkin** · B Mikroservis — zamonaviy, shuning uchun doim yaxshi · C Ikkalasini birga — har ehtimolga qarshi · D Farqi yo'q — xohlaganini tanlasa bo'ladi
- Kalit: `INLINE_KEYS.s11 = 0`, `correctIdx={0}` — o'zgarmaydi.
- To'g'ri izohi: Kichik loyiha va jamoaga monolit sodda, tez va arzon; kerak bo'lsa keyin bo'linadi. (83)
- Xato izohlari:
  - B: Zamonaviy degani har loyihaga mos degani emas. (46)
  - C: Ikkalasi birga — eng murakkab yo'l. (35)
  - D: Kichik loyihada farq bor: biri ancha sodda. (43)
✎ to'g'ri izohi 3 gap → 1 · C variantdan «ishonch» olindi · «Ortiqcha murakkablashtirmang» — qisqa takrorlash kartasida qoladi

## 12 · Tizimni ajrating  ← QTushuncha (ajratish, nishon «Right Size»)
- Eyebrow: Hayotiy · tizimni ajrating
- Sarlavha: **Monolitmi yoki mikroservismi?** (29)
- Mentor: Tavsifni o'qing va tizim qanday bo'linganini tanlang.
- Tavsiflar (navbat bilan, chapda «Tizim N/3»):
  1. Kichik do'kon sayti: React sahifalar, bitta Nest backend va bitta Database. → Monolit
  2. Katta onlayn bozor: to'lov, qidiruv va yetkazish — har biri alohida ilova, har biriga o'z jamoasi qaraydi. → Mikroservis
  3. Yangi loyiha: tezda ishlaydigan birinchi versiya kerak, jamoa 2 kishi. → Monolit
- Tugmalar (o'ngda): Monolit · bitta ilova | Mikroservis · alohida xizmatlar
- **Harakat → Vizual o'zgarish:** to'g'ri tanlov → tavsif o'ngda kichik chizmaga aylanadi: monolit — bitta ramka, ichida bo'limlar;
  mikroservis — alohida ramkalar va tarmoq chiziqlari (9–10-ekran chizmasi). Noto'g'ri → tugma silkinadi: Hammasi bitta ilovadami yoki alohidami — qayta qarang. (54)
- Nishon sharti: `AchRule`.
- Xulosa: Bu tavsiflarda: kichik loyiha — bitta ilova, katta va ko'p jamoali tizim — alohida xizmatlar. (93)
- Tugma (pastki): Ajrating (N/3) → Davom etish
✎ muvaffaqiyat matni harakatni takrorlardi («Barchasi to'g'ri! … ayta olasiz», T-049) → nima o'rganilgani · 3-tavsifdan «MVP» izohi olindi (bu darsda kerak emas) ·
2-tavsifda «alohida xizmat» → «alohida ilova» (tugma yorlig'ini so'zma-so'z takrorlamaydi) · Mentordan «arxitektor» olindi · 🏢/🧩 olindi · xato izohi 79 → ≤60

## 13 · Bir jumlada  ← QTushuncha (gap to'ldirish, qayta qurildi)
- Eyebrow: Bir jumlada
- Sarlavha: **Do'konni bir jumlada qanday ta'riflaysiz?** (41)
- Mentor: Pattern nomlari — dasturchilarning umumiy tili. Bo'sh joylarni to'ldiring, fayl o'zi yoziladi.
- Jumla (chapda, 3 bo'sh joy, har birida 2 variant):
  «Mini-do'kon — **[1]**. Ichi MVC bo'yicha: View — React sahifalari, Controller — Nest controllerlari, Model — **[2]**. Ma'lumot **[3]** saqlanadi.»
  - [1]: **monolit** | mikroservis — xato: Do'konda bitta Nest backend bor — bu bitta ilova. (49)
  - [2]: **ma'lumot va qoidalar kodi** | PostgreSQL jadvallari — xato: PostgreSQL saqlaydi, Model u bilan ishlaydi. (44)
  - [3]: **Database'da (PostgreSQL)** | Model ichida — xato: Model ma'lumot bilan ishlaydi, saqlash — boshqa ish. (52)
- O'ng: `ARXITEKTURA.md` fayl-karta + kichik Do'kon chizmasi. Fayl tepasida kulrang qator: «Patternsiz: “Bu yerda fayl bor, u boshqasini chaqiradi, keyin Database'ga…”».
- **Harakat → Vizual o'zgarish:** variantni tanlash → jumlaga so'z tushadi, `ARXITEKTURA.md` ga qator yoziladi va chizmada o'sha qism yonadi
  (monolit — ramka, Model — Model kartasi, Database — silindr). 3/3 da patternsiz qator xiralashadi, jumla to'liq.
- Xulosa: Pattern nomlari bilan tizim bir jumlaga sig'adi: dasturchi ham, AI ham uni tez tushunadi. (89)
- Tugma (pastki): Jumlani to'ldiring (N/3) → Davom etish
✎ «Pattern bilan-chi?» tayyor jumlani ochardi → o'quvchi jumlani o'zi yig'adi; tuzoq-variantlar ikki asosiy xatoni tutadi (Model va Database bir narsa emas; MVC va monolit — ikki xil savol) ·
xulosa 168 → 1 gap · «AI yozgan kodni o'zingiz tekshirasiz» → 16-ekran 3-qadamiga · 🙈/🎯 olindi · sarlavha «Tizimingizni» → «Do'konni» (T-039)

## 14 · 4-savol  ← QTest (savol va variantlar qisqardi)
- Eyebrow: Mashq · 4-savol
- Savol: **Katta do'kon: 5 ta jamoa, bayramda to'lovga yuk oshadi. Qaysi usul mosroq?** (74)
- Variantlar: A Monolit — hammasi bitta ilovada qolsin · B Hech qaysi — hozirgidek qolaversin · **✔ C Mikroservis — to'lov alohida xizmatga** · D Faqat MVC — ichki tartib yetadi
- Kalit: `INLINE_KEYS.s14 = 2`, `correctIdx={2}` — o'zgarmaydi.
- To'g'ri izohi: To'lovni alohida kuchaytirasiz, har jamoa o'z xizmatini alohida yangilaydi. (75)
- Xato izohlari:
  - A: 5 jamoa bitta ilovada bir-biriga xalaqit berishi mumkin. (56)
  - B: Katta tizimda tuzilish ayniqsa muhim. (37)
  - D: MVC — ilova ichi; bu savol tizim bo'linishi haqida. (51)
✎ savol 130 → qisqa (S-001) · variantlar 38–45 → teng · to'g'ri izohi 3 gap → 1 · A izohi to'g'ri javobni aytardi («to'lovni alohida kuchaytirib bo'lmaydi») → mezon

## 15 · So'rov yo'lini yig'ing (final, nishon «Request Flow»)  ← QTartib
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **MVC'da so'rov yo'lini to'g'ri tartibda yig'ing.** (47)
- Mentor: Bo'laklarni sudrab yoki bosib joylang.
- Bo'laklar (to'g'ri tartibda): So'rov · Controller · Model · View · Foydalanuvchiga
- Uya izohi: «bu yerga qo'ying» (har uyada bir xil — tartibni ochmaydi)
- Xato (bitta qator): Tartib xato. So'rovni birinchi kim qabul qiladi? (48)
- Yechilgach xulosa: Yo'l tayyor: So'rov → Controller → Model → View → Foydalanuvchiga. (66)
- Kalit: `INLINE_KEYS.s15 = 0` (birinchi urinish to'g'ri), `FLOW_ORDER` o'zgarmaydi.
✎ sarlavha 61 → 1 qator («Oxirgi qadam:» olindi) · uya izohlari rol-izoh edi («kim qabul qiladi», «ma'lumot qayerdan olinadi») — tartibni ochardi → «bu yerga qo'ying» ·
xato qatoridan ⚠️ va takror olindi (112 → ≤60) · «MVC shu tartibda ishlaydi» (umumlashtirish, T-043) olindi · `DragDropOrder` nusxasi → `QTartib` (q20)

## 16 · Amaliyot · Botingiz arxitekturasi  ← amaliyot bloki (173, `ScreenBlok`)
- Eyebrow: Amaliyot · ARXITEKTURA.md
- Sarlavha: **Botingizni bir jumlada ta'riflang.** (34)
- Mentor: 5-Modulda qurgan botingiz ham tizim. Kodini oching va arxitekturasini faylga yozing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. Uchta faylni toping: `src/api/telegram/telegram.controller.ts` ·
     `src/core/entity/buyurtma.entity.ts` · `src/api/buyurtma/buyurtma.service.ts`.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Repo ildizida `ARXITEKTURA.md` yarat. Birinchi qator: «{bot nomi} — {monolit yoki mikroservis}.»
     > Keyin uch qator: Controller — {fayl}, Model — {fayllar}, View — {foydalanuvchi ko'radigan narsa}.
     > Oxirgi qator: ma'lumot qayerda saqlanadi. Kodga tegma.
  3. **Tekshirish** — `ARXITEKTURA.md` ni oching: har fayl nomi `src/` da bormi? AI yozgan har qatorni o'zingiz tekshiring.
     Xato bo'lsa: «Shu qator xato: {qator}. Tuzat.»
  4. **Saqlash** — terminalda: `git add ARXITEKTURA.md` · `git commit -m "arxitektura"`.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)», fayl-karta `ARXITEKTURA.md`:
  ```
  AvtoPizza — monolit: bitta Nest ilovasi.
  Controller — telegram.controller.ts: serverda Telegram xabarini qabul qiladi.
  Model — buyurtma.entity.ts, buyurtma.service.ts: buyurtma shakli va uni Database'ga yozish.
  View — botning Telegram'dagi xabarlari va tugmalari.
  Ma'lumot — PostgreSQL (Neon) Database'da saqlanadi.
  ```
- **Harakat → Vizual o'zgarish:** har «Bajardim» → chapdagi qadam ✓, o'ngdagi fayl-kartada o'sha qadamga mos qator ajraladi (3-qadamda — fayl nomlari, 4-qadamda — «commit» belgisi).
- Hammasi bajarilgach (yashil): Botingiz endi bir jumlada ta'riflangan — ARXITEKTURA.md repo'da turadi. (71)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan `git checkout -f dars-10-done`
- Jonli: `PRACTICE_BASE + ekran` zonasi, ball yo'q (`practice: -1` o'zgarmaydi).
✎ «AI yordamchida» 4 belgilanadigan band (kod yo'q, natija yo'q) → repo ustida aniq ish va ko'rinadigan natija — `ARXITEKTURA.md` (173, §221) ·
«Esda tuting: ikki xil savol» matni → prompt qolipining o'zida (1-qator — tizim, keyingi 3 qator — MVC) · 💡 olindi ·
3–4-qadam nomlari bu darsga moslandi: kod yozilmaydi, bot ishga tushirilmaydi (pastda 2-savol)

## 17 · Natijalar (podium)  — o'zgarmaydi (umumiy shablon)
- Faqat `Q_LABELS[15]`: «5 — Oqim tartibi» → «5 — So'rov yo'li» (T-014: dars bo'yi bitta nom).

## 18 · Takrorlash  ← QKartochka (12 karta, tepadan, 174)

| Old tomon | Orqa | Izoh |
|---|---|---|
| Pattern nima? | Sinab ko'rilgan yechim usuli | Ko'p uchraydigan muammo uchun; tayyor kod emas |
| MVC qaysi uchta so'zdan tuzilgan? | Model, View, Controller | Kodni vazifasi bo'yicha 3 qismga ajratish |
| Foydalanuvchi ko'radigan qism qaysi? | View | Sahifa, tugmalar, rasmlar |
| So'rovni qabul qilib, ishni yo'naltiradigan qism? | Controller | Nest'dagi controllerlar shu ishni qiladi |
| Ma'lumot va qoidalar bilan qaysi qism ishlaydi? | Model | Ma'lumotni esa Database saqlaydi |
| PostgreSQL — Model'ning o'zimi? | Yo'q | Database saqlaydi, Model u bilan ishlaydi |
| MVC'da so'rovni birinchi kim qabul qiladi? | Controller | Keyin Model'dan ma'lumot olib, View'ga beradi |
| MVC va monolit/mikroservis — bitta savolmi? | Yo'q, ikki xil | MVC — ilova ichi; monolit/mikroservis — tizim qanday bo'lingani |
| Hamma bo'lim bitta ilovada — bu nima? | Monolit | Sodda boshlanadi, bitta joylashtirish |
| Bir nechta alohida xizmatdan tuzilgan tizim? | Mikroservis | Har xizmat alohida ishlaydi va joylashtiriladi |
| Yangi kichik loyiha uchun ko'pincha nima qulay? | Monolit | Soddadan boshlang — kerak bo'lsa keyin bo'linadi |
| Yuk ko'p tushgan xizmatga nusxa qo'shish nima deyiladi? | Miqyoslash (scaling) | Masalan, bayramda to'lov xizmatiga ikkinchi nusxa |
✎ «baza» → «Database» (5, 6-karta) · 9-karta «Hamma asosiy qism» → «Hamma bo'lim» (9-ekran so'zi) · 12-karta 10-ekrandagi sinovga bog'landi

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/202/204)
- Yuqori yorliqlar: ✓ Patternlarni o'rgandingiz · N/5 to'g'ri
- Sarlavha: **Endi tizimni pattern bilan ta'riflaysiz.** (40)
- CTA: CODE STRIKE (arena) — o'zgarmaydi.
- Endi siz bilasiz:
  - Pattern — ko'p uchraydigan muammoning sinab ko'rilgan yechim usuli
  - MVC: View ko'rsatadi, Controller yo'naltiradi, Model ma'lumot va qoidalar bilan ishlaydi
  - Database (PostgreSQL) saqlaydi — Model u bilan ishlaydi
  - MVC — ilova ichi; monolit yoki mikroservis — tizim qanday bo'lingani
  - Kichik loyiha — ko'pincha monolit; tizim va jamoa kattalashsa, bo'lim alohida xizmatga ajratiladi
- Uyga vazifa (`uyga`):
  - **Ta'riflang** — 2-darsdagi mini-do'kon varag'ingizga bir jumla qo'shing: monolitmi yoki mikroservismi, ichi MVC bo'yicha qanday?
  - **Moslang** — varaqdagi bitta funksiyani (masalan, savat) View / Controller / Model'ga ajrating: har biriga bitta fayl nomi
  - **Qaror** — botingizga mikroservis kerakmi? Bir gap bilan nega.
- Keyingi dars (`keyingi`): Keyingi dars — «AI-agent nima»: agent tizimning qaysi qismida turadi?
✎ uyga vazifa endi aniq artefaktlarga bog'langan — 2-dars varag'i va bot (oldin «loyihangiz» — qaysi loyiha ekani aytilmagan; botni ta'riflash 16-ekranda bajarildi) · 📝/🚀 olindi (185) · «Baza» → «Database»

---

## Nishonlar (4) — nom va shart o'zgarmaydi (o'yin qatlami: medal belgisi qoladi)
- **Role Mapper** — Kod bo'laklarini View, Controller va Model'ga to'g'ri joyladingiz (6)
- **Right Size** — Monolit va mikroservisni tavsifdan ajratdingiz (12)
- **Split Smart** — Qachon xizmatlarga bo'lish foydali ekanini bildingiz (14)
- **Request Flow** — MVC'da so'rov yo'lini to'g'ri tizdingiz (15)

## Qisqa takrorlash oynalari (5 — har ballik testga 3 karta; belgi o'rnida kod qatori yoki raqam, S-026)
1. (4) **View — ko'rinish:** `<Mahsulotlar />` Foydalanuvchi ko'radigan qism — sahifa, tugmalar, rasmlar · `views/` Ko'rsatadi — qoidalar boshqa qismda ·
   3 V = View — MVC'ning V harfi · Sinfga savol: Foydalanuvchi ko'radigan qism qaysi?
2. (8) **Model — ma'lumot va qoidalar:** `if (!m.nom)` Ma'lumot va qoidalar — Model ma'lumot qanday bo'lishini va u bilan ishlashni belgilaydi ·
   `repo.save(m)` Database — Model emas: PostgreSQL saqlaydi, Model u bilan ishlaydi · `@Get()` Backend'dagi har kod ham Controller emas — qoidalar Model'da ·
   Sinfga savol: «Narx manfiy bo'lmasin» qoidasi qaysi qismda turadi?
3. (11) **Kichik loyiha — ko'pincha monolit:** 1 Soddadan boshlang — kichik loyihaga monolit sodda, tez va arzon · 2 Ortiqcha murakkablashtirmang — mikroservis murakkablik qo'shadi ·
   3 Keyin bo'lasiz — kerak bo'lsa, monolitni keyinroq bo'lish mumkin · Sinfga savol: Kichik jamoa, yangi loyiha — nima qulay?
4. (14) **Mikroservis qachon foydali:** 1 Jamoa ko'p — har jamoa o'z xizmatini alohida yangilaydi · 2 Yuk bir xizmatda — o'shani alohida kuchaytirasiz (miqyoslash) ·
   3 Xato kamroq tarqaladi — bitta xizmatdagi muammo butun tizimga kamroq ta'sir qiladi · Sinfga savol: Qaysi holatlarda tizimni xizmatlarga bo'lish foydali bo'lishi mumkin?
5. (15) **MVC'da so'rov yo'li:** `@Get('products')` So'rov — Controller'ga · `this.mahsulotlar.hammasi()` Controller — Model'dan oladi · `<Mahsulotlar />` Natija — View'da ·
   oqim: So'rov → Controller → Model → View → Foydalanuvchiga · Sinfga savol: Nega bu tuzilmada View ma'lumotni Model'dan o'zi olmaydi?
✎ 🖥️👁️🎯🗄️💾⚙️🏢⚖️📈👥💥🎮 → kod qatori (1, 2, 5; 1-oyna 3-karta — raqam) yoki raqam (3, 4) · 2-oyna «doim Controller emas» → «har kod ham Controller emas» · 5-oyna oqim oxiri «Javob» → «Foydalanuvchiga» (final bilan bir xil)

## Jonli viktorina (arena, 12 savol) — ✔ o'rni o'zgarmaydi (0-1-2-3 × 3), faqat matn
1. MVC'da foydalanuvchi ko'radigan qism qaysi? **✔ View — ko'rinish** · Controller — yo'naltiruvchi · Model — ma'lumot va qoidalar · Hech qaysi qism mos emas
2. Ma'lumot va uning qoidalari bilan MVC'ning qaysi qismi ishlaydi? View — ma'lumotni ko'rsatadi · **✔ Model — ma'lumot va qoidalar** · Controller — so'rovni yo'naltiradi · MVC'dan butunlay tashqarida
3. So'rovni qabul qilib, ishni yo'naltiradigan qism qaysi? View — ko'rinish · Model — ma'lumot va qoidalar · **✔ Controller — yo'naltiruvchi** · Database — PostgreSQL
4. «Hamma bo'lim bitta ilovada» — bu qaysi usul? Mikroservis · MVC tartibi · Frontend qismi · **✔ Monolit**
5. Alohida ishlaydigan va alohida joylashtiriladigan bir nechta xizmat — bu? **✔ Mikroservis** · Monolit · MVC tartibi · Frontend qismi
6. Kichik yangi loyiha, jamoa kichik. Ko'pincha nima qulay? Mikroservis — zamonaviyroq · **✔ Monolit — soddadan boshlang** · Ikkalasini birga ishlatish · Hech qaysi usul kerak emas
7. MVC'da so'rovni birinchi bo'lib kim qabul qiladi? Model · View · **✔ Controller** · Database
8. Yuk ko'p tushgan xizmatga yana bir nusxa qo'shish nima deyiladi? Qayta yozish · Joylashtirish (deploy) · Xatoni tuzatish · **✔ Miqyoslash (scaling)**
9. Pattern nima? **✔ Sinab ko'rilgan yechim usuli** · Yangi dasturlash tili nomi · Database'ning bir turi · Tayyor ko'chiriladigan kod
10. PostgreSQL MVC tuzilmasida nima qiladi? Controller'ning o'zi — so'rovni boshqaradi · **✔ Ma'lumotni saqlaydi — Model u bilan ishlaydi** · View'ning o'zi — sahifani ko'rsatadi · Model'ning o'zi — boshqa narsa kerak emas
11. Mikroservisning asosiy foydasi nimada? Soddalik va arzonlik · Hammasi bitta katta faylda · **✔ Qismlarni alohida kuchaytirish** · Kod yozish shart emasligi
12. Nest'dagi controller MVC'da qaysi qism? View — ko'rinish · Model — ma'lumot va qoidalar · Database — ma'lumot saqlash · **✔ Controller — yo'naltiruvchi**
✎ 3, 7, 9, 12: «Baza», «Ma'lumotlar bazasi» → «Database» · 4–5: «MVC», «Frontend» → «MVC tartibi», «Frontend qismi» (lint-tell #5 ×1.38) · 9: to'g'ri javob qisqardi (lint-tell #9 ×1.26) ·
4-savol «Hamma asosiy qism» → «Hamma bo'lim» · ru variantlar uz bilan mos emas (4: Serverless/Peer-to-peer; 7: «Сразу в…», «(центр)» — to'g'rida qavs) → KOD, ru bosqichi

**Fon so'zlari (R-008, uz; kod bosqichida {uz, ru}):**
- arena (`QZ_BG_SHAPES`): MVC · View · Controller · Model · Database · PostgreSQL · monolit · mikroservis · xizmat · so'rov → javob · miqyoslash · pattern
  (✎ «so'rov→amal» → «so'rov → javob» (1-dars konverti) · «baza» → «Database» · «scaling» → «miqyoslash» · arena belgilari ⚙️🧩🏢 → «pattern»)
- uyga vazifa (`HW_TOKENS`): ARXITEKTURA.md · monolit · MVC · Database (✎ umumiy «amaliyot · loyiha · mashq · natija» → darsning o'z so'zlari)

---

## B. Kod bosqichida (KOD)
1. **Qolip:** dars `src/qolip` ga o'tadi — 0 `QKirish` · 1 `QReja` · 2, 3, 5, 6, 7, 9, 10, 12, 13 `QTushuncha` (`zoom={Zoomable}`, `tugadi` — DE-199/200) ·
   4, 8, 11, 14 `QuestionScreen` → `QTest` (DE-203) · 15 `QTartib` (`DragDropOrder` nusxasi olinadi, q20) · 16 `ScreenBlok` · 18 `QKartochka` · 19 `QYakun` (q21). Palitra 9 token (q13).
2. **`DOKON` — bitta manba (180):** `mvc` (View/Controller/Model/Database: nom, vazifa, oshxona yorlig'i, papka), `bolimlar` (Mahsulotlar · Savat · To'lov · Foydalanuvchilar),
   `fayllar` (2-ekran: bo'lim × 3 fayl), `kodlar` (6-ekran), `xabarlar` (7-ekran). `MVC`, `MVC_ROLES`, `MAP_ITEMS`, `HUB_STEPS`, `MICRO_SERVICES`, `SYSTEMS` shundan o'qiydi yoki olinadi.
3. **`DokonChizma` komponenti:** ichki/tashqi ko'rinish, tugun holatlari (kulrang · oq · joriy · yashil · qizil), konvert (1-dars `SysMap` animatsiyasi, `reduced-motion` — sakrash),
   bo'lim ajralishi, nusxa ×2, hisoblagichlar. Sahifa maketi — 1-dars `SiteMock` naqshi (yuklanish · bo'sh · ro'yxat holatlari). `// qolip-maket:` e'loni (q14).
4. **Bashorat** (5, 9) — `QBashorat` + `QTaxmin`, ballsiz, `onAnswer` ga kirmaydi.
5. **0-ekran:** «Ikki loyihani ko'rish» tugmasi va `tried` olinadi; javobdan keyin papka-qidiruv animatsiyasi. Hook `onAnswer` — hozirgidek (`stage: 'hook'`).
6. **6-ekran:** `MAP_ITEMS.comp` (matn) → `kod` (3–4 qator, `CodeLines`), har bo'lakka o'z xato qatori; maqsad — chizma qismi (alohida tugma-ro'yxat yo'q).
7. **7-ekran:** `BEN` (4 chip) → 3 xabar; xato qatori qizil, «ochilgan papka» hisoblagichi.
8. **13-ekran:** gap to'ldirish (3 × 2 variant, tuzoq-izohlar), `ARXITEKTURA.md` fayl-kartasi jonli yoziladi.
9. **15-ekran:** `hints` (rol-izohlar) → qolip standarti «bu yerga qo'ying»; xato va xulosa matni MD'dagidek.
10. **16-ekran:** `ScreenCityPractice` (`ScreenLivePractice` + checklist) → `ScreenBlok` (5-Modul `BotAiProjectLesson` namunasi): 4 qadam, `PromptBox` (`{…}` pill), `FileCard` kutilgan natija,
    `.ab-tail` zaxira tegi. 3–4-qadam nomlari: «Tekshirish» · «Saqlash».
11. **Matn:** barcha sarlavha/Mentor/xulosa/izohlar MD'dagidek — `lint:olchov` shu dars 34 warn → 0.
12. **Testlar:** 4, 8, 11, 14 `explainCorrect` dan «To'g'ri!» olinadi; 8 va 14 savol matni va variantlari qisqaradi — `correctIdx`, `INLINE_KEYS` tegilmaydi.
13. **RECAPS:** `ic` emoji → kod qatori (4, 8, 15) yoki raqam (11, 14); 8-oyna 3-karta matni; 15-oyna `RcFlow` oxiri «Foydalanuvchiga».
14. **QUIZ_BANK:** 3, 4, 5, 7, 9, 12-savol variant matnlari (o'rin o'zgarmaydi); ru 4 va 7-savol variantlari uz bilan moslanadi (ru bosqichi).
15. **Fon so'zlari:** `QZ_BG_SHAPES`, `HW_TOKENS` — yuqoridagi ro'yxat, {uz, ru}.
16. **Kartochkalar:** `CITY_FLASHCARDS` → `KARTALAR` (nom), 5, 6, 9, 12-karta matni.
17. **Yakun:** `RECAP`, `HOMEWORK`, `keyingi` qatori MD'dagidek; 📝/🚀/🏅 tugma va yorliqlardan olinadi (nishon medali qoladi).
18. **Podium:** `Q_LABELS[15]` «5 — So'rov yo'li».
19. **Nishon kalitlari** (`cityPlanner`, `oneTowerVsDistrict`, `splitBlock`, `trafficRoute`) — ichki nom, o'zgarmaydi (progress saqlovi buzilmasin).
20. **Darvozalar:** `npm run gates -- src/6-Modull/ArchPatternsLesson.jsx` 12/12 · `lint:olchov` 0 warn · `lint:emoji` qolip 0 · `lint-qolip` q13–q21 0 · `lint:tell` 0 ·
    `lint:layout` 1280/1366/390 · surat (1280 + 393).

**REPO:** o'zgarish yo'q. Amaliyot o'quvchining 5-Modul holati ustida (`dars-10-done`), kod yozilmaydi — faqat `ARXITEKTURA.md` qo'shiladi; namuna ekranda.

## C. Siz hal qiladigan savollar
1. **«Database» yoki «baza»?** 1-dars (pilot) tugun nomi — «Database» (92 joy); 4, 8, 13-darslar — «baza». Bu MD 1-dars bilan bir xil «Database» yozdi
   (dars 1-darsning tizim xaritasini davom ettiradi). Tavsiya: **modul bo'yi «Database»**, 4/8/13-darslarning v3 MD'si shunga ergashadi.
2. **Amaliyot qadamlari nomi:** 173-qonunda 4 qadam har darsda bir xil (Ochish · Prompt · Ishga tushirish · Telegramda tekshirish). Bu darsda kod yozilmaydi va bot ishga tushmaydi.
   Tavsiya: **3–4-qadam «Tekshirish» · «Saqlash»** (qadam bajarib bo'ladigan bo'lsin, P-028); muqobili — 173 nomlari, 3–4-qadam matni «faylni oching» bo'ladi.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi — App.jsx bilan mos (205): m6-02 → **Arxitektura patternlari** → m6-04 «AI-agent nima»; yakunda «Keyingi dars — «AI-agent nima»».
- [✓] Bitta misol-ip (1-dars do'koni, mini-do'kon); metafora bitta (oshxona), faqat 3-ekranda · bitta vizual dars bo'yi — «Do'kon chizmasi» (`DOKON`).
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0, 2, 3, 5, 6, 7, 9, 10, 12, 13 (+16 amaliyot). Matn-karta qolmadi.
- [✓] Sarlavha ≤55 (eng uzuni 9-ekran, qavsdagi son) · Mentor ≤2 gap, sarlavha so'zini takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — sonlar qavsda.
- [✓] Atamalar: 1-dars bilan «Database», «so'rov/javob», «Frontend/Backend» bir xil; «bo'lim» — 4a-Modul Nest bo'limlari ma'nosida; siz-forma; zanjir ot-shaklda (So'rov → Controller…); tugmalar ot-shaklda.
  ✗ modul darajasida: 4/8/13-darslarda «baza» — C-1 savol.
- [✓] Testlar: ✔ o'rni o'zgarmagan (s4=3, s8=1, s11=0, s14=2, s15=0; arena 0-1-2-3); variantlar teng uzunlikda, qavs/strelka faqat to'g'rida emas (arena 7 ru «(центр)» — KOD 14).
- [✓] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [✓] Emoji yo'q (nishon medali va arena — o'yin qatlami) · kafolat gaplari yo'q («darrov» olindi; «doim» faqat 11-savol tuzoq-variantida — noto'g'ri fikrning o'zi).
- [✓] Ichki kodlar o'quvchi matnida yo'q · tarixiy voqea yo'q · «KOD» ro'yxati 20 band.
- [✓] Karta T · P · S: T-011 (atama harakatdan keyin: 2, 9, 10) · T-014 · T-016 · T-039 (13-ekran) · T-042 (kanon gap) · T-043 («ko'pincha», «mumkin») · T-049 (12-ekran) ·
  P-001/002/021 · P-015 · P-055 (5-ekran) · P-064 (5, 9) · P-065 (6-ekran kod) · P-067 · P-068 · S-001 (8, 14) · S-010 · S-026 · S-008 (7-ekran 8-testni takrorlamaydi).
