# F-1022-01 · REJA — PM darslarini «startapchi AI bilan o'zi quradi» mantig'iga o'tkazish

Muddat: **yakshanba 26.10.2026 — prodga (LMS).** Bugun: chorshanba 22.10.
Qonun: `PM_DARS_ETALON.md` 110 (rol) · 111 (mentor «Bu slayd nima uchun»). Uy vazifalari (`*.homework.jsx`) — TEGILMAYDI.

**Kelishilgan tamoyil (22.10, foydalanuvchi tasdig'i):** rol almashadi (dasturchi → AI), **atama qoladi va o'z nomi bilan aytiladi** — o'quvchi startapchi, ertaga «PRD», «qabul shartlari», «prioritet» desa bilishi kerak. Tartib har darsda: haqiqiy vaziyat (AI bilan) → tushunchaning nomi → yakunda ikkalasi birga. Gap aytuvchi — **ustoz** («murabbiy» emas).

## 0. Har darsga bir xil qo'llanadigan 5 qadam

1. **Ekranma-ekran jadval** «hozir → bo'ladi» (pilot namunasi `PmLesson9-v2-EKRANLAR.md`) → foydalanuvchi tasdig'i → shundan keyingina kod.
2. **Matn + mexanika** uz va ru birga; test to'g'ri javoblari o'rni, ekran soni, ballar o'zgarmaydi.
3. **Mentor ekrani:** kirish-ekranda natija o'quvchilar tanlashidan oldin ochilmaydi («Natijani ochish» tugmasi); har ekranda «Bu slayd nima uchun:» qatori (111-qonun).
4. **Darvozalar:** `npm run gates -- <fayl>` 12/12 · `lint:til` `dasturchi-topshiriq` 0 (dars `allowFiles`dan o'chiriladi) · `smoke` · 👦 rol-moslik (har ekranni o'quvchi o'z nomidan aytib bera oladimi).
5. **Jurnal:** `JURNAL.md` + `PM_PIPELINE_STATE.md`; versiya `LMS_REESTR` da yangilanadi (`lms-farq`).

## 1. Darslar — hozir / muammo / yechim

### 1) m3-10 «Qachon «tayyor» deb ayta olamiz?» — `src/3-Modull/PmLesson9.jsx` · CHUQUR · PILOT · ✅ KOD 22.10
- **Hozir:** o'quvchi — dasturchiga ish bergan PM. Dasturchi «tayyor» deydi, o'quvchi qabul qiladi. «Dasturchi» 22 joy.
- **Muammo (ekranlar):** 01 kirish («dasturchidan so'ragandingiz»), 03 ikki karta («dasturchi ishlaydi deganda / siz tayyor deganda»), 04 va 06 testlar, 09 mustaqil ish («dasturchi tayyor deganda tekshirasiz»), 10 qabul tartibi («dasturchiga beramiz → dasturchi yozadi»), 15 kartalar (3 ta), arena 3 xato variant. 01-ekranda mentor ekranida natija oldindan ochiq, bo'sh buyurtma yashil «yuborildi ✓».
- **Yechim:** ish bajaruvchi va «tayyor» deydigan — **AI (Gemini)**. Qabul tartibi: shartlarni yozamiz → promptga qo'shamiz → AI yozadi → o'zimiz bosib tekshiramiz → «tayyor». 01: natija «Natijani ochish» bilan, bo'sh buyurtma qizil. **Atama:** Cyberpunk ko'prigida «bunday ro'yxatni **qabul shartlari** — Acceptance Criteria deyishadi», 09 mustaqil ish sarlavhasida, yakunda «qabul shartlari — AI'ga yozishdan oldin yoziladigan, keyin o'zim tekshiradigan ro'yxat». To'liq jadval: `PmLesson9-v2-EKRANLAR.md` (tasdiqlangan 22.10).

### 2) m3-05 «Qaysi ishni birinchi qilasiz?» — `src/3-Modull/PmLesson8.jsx` · CHUQUR · ✅ KOD 22.10
- **Hozir:** darsning ikki o'qidan biri — **vaqt**, uni **dasturchi aytadi**. 01 kirish: har ish yonida «🧑‍💻 Dasturchi: N kun». 03 teoriya-karta «Vaqtni dasturchi aytadi». 09 mustaqil ish: «har biriga dasturchi qancha vaqt ketishini yozib berdi». 10 tekshiruv: «Dasturchi kataklarni ko'rib chiqdi: ikki ish endi boshqacha vaqt oladi» — butun ekran shu ustiga qurilgan. Mentor eslatmasi: «juftlikda: biri dasturchi, biri tanlaydigan odam». Arena: «Kodni yozadigan dasturchi», «Sayt buyurtma qilgan odam».
- **Muammo:** o'quvchi vaqtni kimdan oladi? Uning dasturchisi yo'q — u ishni AI bilan o'zi qiladi.
- **Yechim (22.10 qaror: sodda, texnikaga tortmasdan):** dars **prioritet** haqida qoladi — ikki savol: «kimga ko'p kerak?» va «qancha ish oladi?». Vaqtni **o'quvchi o'zi baholaydi** (katta ish / kichik ish), «dasturchi aytdi» yo'q, AI o'q sifatida kirmaydi. 01: «⏱ ~1 kun / ~1 hafta» (o'z bahosi). 03 karta: «Qancha ish olishini o'zingiz chamalaysiz». 09: «har ish yoniga qancha ish olishini yozdingiz». 10 tekshiruv mexanikasi qoladi, sabab: «qilib ko'rganingizda ikki ish uzoqroq chiqdi — kataklar qayta ko'riladi». Eslatma: «juftlikda: biri vaqtni chamalaydi, biri tanlaydi». Arena variantlari: «Ishni qiladigan odam — siz», «Saytdan foydalanadigan odam». **Atama:** «navbat belgilash (prioritet)» o'z nomi bilan. **AI faqat ko'prikda va yakunda:** «birinchi tanlagan ishingizni ertaga AI'dan so'raysiz — qolganlari keyin».

### 3) m6-02 «Bitta gapni uch kishi bir xil tushunadimi?» — `src/6-Modull/PmLesson22.jsx` · CHUQUR · 📋 JADVAL 22.10 (`PmLesson22-v2-EKRANLAR.md`, tasdiq kutilmoqda)
- **Hozir:** markaziy metafora — murabbiy (buyurtmachi) **uch dasturchiga** og'zaki gap aytdi → uch xil ilova; varaq (PRD) to'lsa → uch dasturchi bir xil ekran. «Bo'sh katak — dasturchi taxmin qiladi» (12-test, kartalar, arena 3 savol, yakun-qoida). «Dasturchi» 20 joy.
- **Muammo:** o'quvchi bu yerda kim? Uch dasturchidan biri emas, PM ham emas. Aslida u — murabbiy uchun ilovani AI bilan o'zi qiladigan odam.
- **Yechim (22.10 qaror: aralash — PRD atamasi + haqiqiy AI; gap aytuvchi — USTOZ, «murabbiy» emas):** 01 kirish: «Ustozingiz sizga bitta gap aytdi: «Basseynga joy band qiladigan ilova kerak». Siz uni Gemini'ga uch marta yozdingiz — uch xil ilova chiqdi» (uch ilova vizuali qoladi, «uch dasturchi» → «uch urinish»). 04 test: «Og'zaki aytilsa, AI har safar boshqacha tushunadi». 05 yadro: o'quvchi ustozga to'rt savol beradi, varaq to'ladi → **varaqning nomi ochiq aytiladi: «bu PRD»** → «Bu varaq — ikki narsa birdan: startapchining PRD'si va AI'ga beriladigan to'liq prompt. To'liq PRD — AI har safar bir xil quradi». 12-test: «Varaqning «Kim» katagi bo'sh qoldi. AI hech kimdan so'ramay, o'zi taxmin qilib yozdi. Natijada nima bo'ladi?». Qoida: «Aniq yozilmasa — AI taxmin qiladi». Kartalar («PRD nima?» qoladi)/arena: «uch dasturchi» → «AI», «dasturchi taxmin qiladi» → «AI taxmin qiladi»; arena «Menga PRD bering — nimani so'rayapti?» qoladi, so'rovchi «hamkor». O'quvchi o'z mini-do'koniga PRD to'ldiradi. Geyts/Allen keysi o'zgarmaydi. **«Murabbiy» 21 joy:** gap aytuvchi → «ustoz» (ru «наставник»); keyslardagi basseyn xodimlari («uch murabbiy» foydalanuvchi sifatida, v1 keys) o'z nomida qoladi.

### 4) m4-12 «Ilova nimani yozib qoladi?» — `src/4-Modull/PmLesson13.jsx` · QISMAN · 📋 JADVAL 22.10 (`PmLesson13-16-18-12-v2-EKRANLAR.md`)
- **Hozir:** 10-ekran: «**Dasturchining** sxemasini uch shartdan o'tkazing — dasturchi «Kitob navbati» ishiga shu sxemani taklif qildi». 06-test: variant «Dasturchi e'londa yo'q ustunni xohlaganda», izohlar «dasturchining xohishi ustun ochmaydi». 04: variant «Dasturchilarga topshiriq qilib». Amazon keysi — uchinchi shaxs, qoladi.
- **Yechim:** 10: «**AI** taklif qilgan sxemani uch shartdan o'tkazing — Gemini «Kitob navbati» uchun shu sxemani berdi, shartga mos kelmagan ustunni bosing» (mexanika aynan qoladi). 06: «AI e'londa yo'q ustunni qo'shganda» / «Ustunni AI emas, e'londagi gap ochadi». 04: «AI'ga prompt qilib». Arena/kartalar tekshiriladi. ~9 joy. **Atama:** «sxema» o'z nomida. (22.10: tasdiqlandi.)

### 5) m4b-02 «Bitta xato — nechta odam ketadi?» — `src/4b-Modull/PmLesson16.jsx` · QISMAN
- **Hozir:** 05 yadro: xato tutiladigan uch nuqta — «**Dasturchi stolida**, kod yozilayotganda / testda / odamlarda»; 06-test «Dasturchi nosozlikni kod yozilayotganda tutdi»; karta-fakt «dasturchi shu zahoti tuzatdi»; mentor eslatmasi «dasturchi bu kartadan nimani tuzatadi?».
- **Yechim:** o'quvchi o'zi dasturchi: «**Sizning stolingizda**, AI bilan kod yozayotganda» / «Siz nosozlikni kod yozayotganda tutdingiz» / «test tutdi — siz shu zahoti tuzatdingiz» / eslatma «o'quvchi bu kartadan nimani tuzatadi?». Cyberpunk keysi qoladi. ~6 joy, mexanika o'zgarmaydi. (22.10: tasdiqlandi.)

### 6) m4c-06 «Saytingiz hozir ochilyaptimi?» — `src/4c-Modull/PmLesson18.jsx` · QISMAN
- **Hozir:** 04-test variant «Ertalab saytga kirgan dasturchi» (+izoh), 03 «…birinchi bo'lib kirgan odam ko'radi — dasturchi emas», 09 variant «Saytni yozgan dasturchi yozib qo'ygan».
- **Yechim:** «Ertalab saytga kirgan siz» / «…kirgan odam ko'radi — siz emas» / «Siz o'zingiz yozib qo'ygan». 4 joy. (22.10: tasdiqlandi.)

### 7) m4-07 «Sinfdoshingiz sahifangizni ochsa…» — `src/4-Modull/PmLesson12.jsx` · 1 JOY
- 04-test xato varianti «Dasturchilarga eslatma sifatida» → «O'zingizga eslatma sifatida».

### 8) 1-o'tish «Nima quramiz va qachon tayyor?» — `src/bridge/lessons/BridgeNimaQuramiz.jsx` · CHUQUR · LMS EMAS
- **Hozir:** User Story «dasturchiga topshiriq» deb o'rgatiladi: «Dasturchiga ikki xil topshiriq keldi», «Dasturchi faqat topshiriqqa qarab ishlaydi», «Shartlarni dasturchi bilan kelishamiz», «Dasturchi: «Tugma ishlaydi»». 26 joy.
- **Yechim:** User Story = **AI'ga beriladigan aniq prompt**: «Gemini'ga ikki xil prompt yozdingiz — qaysi biri unga tushunarli?», «AI faqat yozilganiga qarab quradi», «Shartlarni o'zimiz uchun yozamiz, AI «tayyor» desa tekshiramiz». Alohida sayt (coddycamp-bridge), yakshanba LMS reliziga kirmaydi — undan keyin.

### Tegilmaydi (tekshirildi, to'g'ri)
m1-02, m1-12, m3-02 (P0), m3-14, m4-15, m4a-02, m4c-02, 7–14-Modul PM darslari (Maydon Jamoa olami), bridge qolgan 4 dars (xato-variantlardagi «dasturchilar jamoasi» — uchinchi shaxs).

## 2. Jadval (yakshanba 26.10 prod)

| Kun | Ish | Chiqish |
|---|---|---|
| **Chor 22.10** | ✅ m3-10 kod · ✅ m3-05 kod · 📋 m6-02 + 4 qisman jadval | PmLesson9, PmLesson8 tayyor; 5 jadval tasdiqda |
| **Pay 23.10** | jadvallar tasdig'i → m6-02 kod → gates · m4-12 kod | PmLesson22, PmLesson13 tayyor |
| **Jum 24.10** | m4b-02, m4c-06, m4-07 kod → gates · 7 darsda mentor-rejim ko'rik | 7 dars tayyor |
| **Shan 25.10** | smoke-lms 7/7 · QA sayt (vercel) · foydalanuvchi ko'rigi · tuzatishlar | 7 dars QA'da |
| **Yak 26.10** | tuzatishlar → `lms-farq` → paket (7 dars) → yuklash (`YUKLASH_PROTOKOLI`) → `lms-farq muhrla` → commit (buyruq bilan) | PROD |
| keyin | bridge «Nima quramiz» → bridge-sayt · `allowFiles` bo'sh → qoida to'liq kuchda | — |

## 3. Qaror kerak bo'lgan 2 nuqta
1. **Yig'ish qaysi previewMode bilan:** `build-lms` hozir yangi adapterli `previewMode.js` ni qo'yadi (F-1021-10). IT OK bersa — yakshanba 172 dars birga qayta yig'iladi (bitta reliz). OK bo'lmasa — 7 dars ham yangi adapter bilan chiqadi: aralash davr (eski overlay + yangi adapter) — ishlaydi, lekin IT bilan kelishiladi.
2. ~~m3-05 vaqt manbai~~ — **22.10 yopildi:** «o'zingiz chamalaysiz», AI o'q emas (foydalanuvchi: «juda texnikaga tortib ketma»).
