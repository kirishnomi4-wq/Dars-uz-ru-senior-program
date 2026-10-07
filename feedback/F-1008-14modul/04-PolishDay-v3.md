# 14-Modul · 4-dars «Loyiha kuni: demo uchun sayqal» — MD v3 (yangi dars, loyiha kuni) <!-- TAXMIN T20 -->

Fayl: `src/12-Modull/PolishDayLesson.jsx` (kalit `m12-04`, App.jsx `type: 'Proyekt'`, 470-qator) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar; podium umumiy shablon) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni (dasturda AI-PRAKT), keyssiz (tayanch 5). Qolip: QKirish · QReja · QTushuncha ×2 · QTest ×2 · QBlok ×3 · podium · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx 470-qator, `00-NOMLAR.md` 4-qator): «Loyiha kuni: demo uchun sayqal» · osti «demo yo'lidagi uch joy: bosish, yuklanish, muvaffaqiyat» · <!-- TAXMIN T20 -->
oldingi `m12-03` «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» · keyingi `m12-05` «Guruh pitchingizda nimani tuzatishni aytadi?».
Namuna (tuzilish, hajm): 13-Modul `08-WinBackDay-v3.md` + `08-FILTR.md` (loyiha kuni, uch blok, tekshiruv kartasi «Kutilganidek» / «Boshqacha», besh holatli yakun) · 12-Modul `04-LiveNotifyDay-v3.md` (uch blok, «Bajardim» qoidasi) ·
9-Modul `05-Animation-v3.md` (animatsiya so'zlari, «Harakatni kamaytirish», `prefers-reduced-motion`) · pilotlar `03-ProductSpeed-v3.md` (DevTools, yangi versiya, «Ortda qoldingizmi») va `07-PmDemoTest-v3.md` (4-dars natijasiga ishora) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · «Ortda qoldingizmi» — darsda bir marta, 1-amaliyotda (SABOQ 39).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** · 7-ekran **B** · final tartib-mashqi yo'q (loyiha kuni, 172) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2 ≈ 8 · Amaliyot 1 ≈ 20 · 4 ≈ 2 · 5 ≈ 7 · Amaliyot 2 ≈ 18 · 7 ≈ 2 · Amaliyot 3 ≈ 20 · podium, kartochkalar, yakun, arena ≈ 8 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (uch blokda agent kutishi va DevTools bilan tekshiruv; 3-amaliyotda brauzer ko'rinishini qayta chiqarish); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 10-band.
⚠️ **Chegara (tayanch 1.0, 1.4) — har ekranga tegadi:** yangi funksiya qo'shilmaydi — faqat demo yo'lidagi uch joyning ko'rinishi o'zgaradi; Backend'ga tegilmaydi; tekshiruv — real odamlar qo'shilmagan o'yinda (Mentor misolida namuna o'yin), har bosishdan keyin «O'yindan chiqish» (12-Modul tayanchi 9.44 c). <!-- TAXMIN T7 -->
Mentor misolida yangi son yo'q: sahnadagi yagona son — namuna o'yin «8 / 10» → «9 / 10» (tayanch 1.0, 1.14). «Demo buzilmaydi», «demo yarqiraydi» kabi da'vo yo'q — natija faqat o'quvchining o'z tekshiruvi bilan (sinf 5).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 1.4, 4):** dars oxirida o'quvchining o'z repo'sida, o'z mahsuloti va trekida **demo yo'lidagi uch joy** o'zgargan va o'zi tekshirgan: <!-- TAXMIN T7 -->
   1) **bosish javobi** — demo yo'lidagi asosiy tugma bosilishi bilan holatini o'zgartiradi (Mentor misolida «Qo'shilaman» → «Qo'shilmoqda…» va kichik kutish belgisi), javob kelguncha qayta bosilmaydi ·
   2) **yuklanish holati** — ro'yxat yuklanayotganda bo'sh joy o'rnida **joy egallovchi** kulrang kartalar (haqiqiy karta o'lchamida) ·
   3) **muvaffaqiyat** — ish bajarilganda kichik animatsiya (Mentor misolida «8 / 10» → «9 / 10» bir lahza kattalashib qaytadi) · qurilmada harakat kamaytirilgan bo'lsa — uch joyda ham animatsiya o'chadi, holat qoladi · yangi versiya chiqarilgan.
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m14-dars-04-start` (= `m14-dars-03-done`) → `m14-dars-04-done` (tayanch 3, aynan). <!-- TAXMIN T4 -->
   Uyga vazifa yo'q (loyiha kuni; sinf 14). Yangi saqlash kaliti yo'q (tayanch 4, 8: 4-dars faqat `pm-m9d8-platforma` ni o'qiydi; natija — repo).
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** Demo yo'lida ekran har bosish, kutish va natijaga javob beradi — hakam bosilganini, ma'lumot kelayotganini va ish bajarilganini ko'radi; harakat kamaytirilsa ham bu holatlar qoladi.
3. **Oldingi darslardan keladigan narsa (aynan; T-052):**
   - 9-Modul 5-darsi (`feedback/F-1005-9modul/05-Animation-v3.md`): **animatsiya** — «interfeysdagi ko'rinadigan harakat yoki holatning silliq o'zgarishi»; animatsiya odamga «bosildi», «o'zgardi», «tayyor» deb javob beradi · **ortiqcha harakat** — hech narsa demaydigan harakat ·
     **«Harakatni kamaytirish»** (qurilma sozlamasi, sahnada chizilgan kalit) · «Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.» · `transition`, `transform`, Motion (web). 9-Modul 8-darsi: **kutish belgisi** (aylanuvchi kichik belgi).
   - 11-Modul: tugmalar **«Qo'shilaman» → «Qo'shildingiz»** · **«O'yindan chiqish»** (tayanch 2, 228-qator) · **kutish yozuvi** «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» (`mobil/src/app/index.tsx`, teg `m11-dars-15-done`, 11-Modul tayanchi 9.95) ·
     prototipdagi animatsiya (11-Modul 1.6: «Qo'shilaman» dan keyin «8 / 10» → «9 / 10» silliq o'zgaradi — `prototip/`, web).
   - 12-Modul: **brauzer ko'rinishi** — yangi versiyada `npx expo export -p web` → `netlify deploy --prod --dir dist`, push'dan keyin o'zi yangilanmaydi (9.28) · **jonli demo** — real odamlar qo'shilmagan o'yinda (Mentor — namuna o'yin), keyin «O'yindan chiqish» (9.44 c) · `namuna = true` (9.5).
   - 13-Modul 12-darsi: yangi funksiya qo'shilmaydi, faqat tuzatish va tekshirish; agentning «tayyor» degani — da'vo (sinf 5).
   - 14-Modul 3-darsi: DevTools (F12 yoki Ctrl + Shift + I) · **sahifa siljishi** — `width` va `height` rasm joyini oldindan band qiladi, sahifa siljimaydi · **yuklanadigan kod hajmi** — ilovaning kodi. 1-darsi: **hakam** (glosssiz).
   - Agent (Antigravity) · talab (qayerda · nima qilsin · nima buzilmasin) · push odati: `git status` — o'zgargan fayllar agent ro'yxati bilan bir xil, `.env` yo'q; `git add <fayl>` (tayanch 3).
4. **Mazmun (tayanch 1.4 — aynan; tafsilotlar — TAYANCHGA SAVOL):** <!-- TAXMIN T7 -->
   - **Demo yo'lidagi uch joy** (hakam ko'radigan 1–2 daqiqa): 1) bosish javobi · 2) yuklanish holati · 3) muvaffaqiyat. Reja va bloklar shu tartibda (App.jsx osti so'zma-so'z — P-015); sahnadagi demo yo'li esa ekranlar tartibida: «O'yinlar» ochiladi (yuklanish) → «Qo'shilaman» (bosish) → son o'zgaradi (muvaffaqiyat).
   - **9-Moduldan farqi** (0, 2-ekran O'qituvchi eslatmasi): u yerda animatsiya qoidalari o'rganilgan; bu yerda — faqat demo yo'li, yangi funksiya yo'q. Bugun animatsiya so'zlari qayta o'rgatilmaydi — 5-ekranda faqat «Harakatni kamaytirish» eslanadi.
   - **`prefers-reduced-motion`** (tayanch 1.4): animatsiya o'chadi, holat qoladi — yozuv, kulrang kartalar, yangi son. Mobil trekda ilova telefon sozlamasini o'qiydi (React Native `AccessibilityInfo`); brauzer ko'rinishida bu `prefers-reduced-motion` orqali o'qiladi (Manbalar 1, 2); web-trekda — `prefers-reduced-motion` (9-Modul).
   - **Uch blok (tayanch 1.4):** A1 bosish javobi · A2 yuklanish holati · A3 muvaffaqiyat + reduced-motion tekshiruvi + yangi versiya. Har blok: talab → tekshirish (o'quvchi o'zi) → «Bajardim».
   - **Halol gaplar:** sayqal tezlikni oshirmaydi — kutish vaqti o'sha qoladi, faqat ekran kutishni ko'rsatadi (2-ekran QIzoh, 2-amaliyot QIzoh) · tez internetda kulrang kartalar bir lahza ko'rinib o'tishi yoki umuman ko'rinmasligi mumkin — shuning uchun tekshiruv sekin tarmoq bilan (A2) ·
     agentning «tayyor» degani — da'vo; ko'rinishni o'quvchi brauzerda o'zi ko'radi (A1–A3 QIzoh).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):** <!-- TAXMIN T19 -->
   - **sayqal** (yangi; 2-ekranda harakatdan keyin tug'iladi: «Demo yo'lidagi shunday kichik o'zgarishlar sayqal deyiladi.») — ta'rif yadrosi «demo yo'lidagi kichik o'zgarishlar» dars bo'yi so'zma-so'z (T-042): 2-ekran nom qatori, kartochka 1 (uch joy nomi bilan), «Endi siz bilasiz» 1. Kartochkada bir marta «inglizchasi: polish». Sarlavhalarda yo'q (T-011; dars nomida — App.jsx).
   - **demo yo'li** — demoda hakam ko'radigan ekranlar va bosishlar (Mentor misolida: «O'yinlar» → «O'yin» → «Qo'shilaman»; o'quvchi matnida strelkasiz, so'z bilan). «Demo stsenariysi», «demo o'tishi» — 6-dars so'zlari, bu darsda **ishlatilmaydi** (sinf 12).
   - **bosish javobi** (yangi; 1-amaliyot vazifa qatorida, 2-ekran sahnasidan keyin) — «Tugma bosilishi bilan o'z holatini o'zgartirishi — bosish javobi deyiladi.» **kutish belgisi** — 9-Modul so'zi. Tugma yozuvlari: «Qo'shilaman» · «Qo'shilmoqda…» (yangi, TAYANCHGA SAVOL 2) · «Qo'shildingiz».
   - **yuklanish holati** — ro'yxat yuklanayotgan payt ekranda ko'rinadigan narsa. **joy egallovchi** (yangi; 2-ekran 3-harakatidan keyin) — tayanch so'zi aynan: «Yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl — joy egallovchi.» Kartochkada «inglizchasi: skeleton».
     **kulrang karta** — Mentor misolidagi joy egallovchi (o'quvchi matnida «kulrang kartalar»). **kutish yozuvi** — 11-Modul so'zi, matni aynan.
   - **muvaffaqiyat** — ish bajarilganini ko'rsatadigan o'zgarish; **muvaffaqiyat animatsiyasi** — shu paytdagi kichik harakat (Mentor misolida son bir lahza kattalashib qaytadi).
   - **animatsiya** · **ortiqcha harakat** · **«Harakatni kamaytirish»** · `prefers-reduced-motion` — 9-Modul so'zlari, qayta ta'riflanmaydi. «harakat kamaytirilgan» — qurilma sozlamasi yoqilgan holat.
   - **namuna o'yin** — real odamlar qo'shilmagan o'yin (Mentor misolida «Shanba, 18:00 · Mahalla maydoni», `namuna = true` akkauntlar bilan — 12-Modul). **tekshirish · tekshiruv** — o'quvchining o'z ishi; «sinov» bu darsda **yo'q** (tayanch 2).
   - **agent** · **prompt** · **talab** · **trek** · **brauzer ko'rinishi** · **yangi versiya** · **DevTools** (3-dars) · **Network**, **Rendering** — Chrome DevTools bo'limlari (UI nomi, tarjima qilinmaydi — T-033); «Slow 4G», «No throttling», `prefers-reduced-motion: reduce` — UI yozuvlari.
   - **Ishlatilmaydi:** polish, skeleton, loader, spinner (prozada), «bezak», «yarqiraydi», «chiroyli qilish» (maqsad sifatida), demo stsenariysi, demo o'tishi, sinov, «tezlashdi» (bu darsda tezlik o'lchanmaydi), A1/A2/A3, `m12-04`, «Modul 14».
6. **Mentor misoli (tayanch 1.0, 1.4, 1.14 — aynan; o'quvchi matnida «Mentor misolida»):**
   - Demo yo'li ekranlari: **«O'yinlar»** (karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; yuklanayotganda kutish yozuvi) → **«O'yin»** («‹ O'yinlar» · «Shanba, 18:00 · Mahalla maydoni» · katta son «8 / 10» · tugma «Qo'shilaman»). Namuna o'yin — real odamlar qo'shilmagan (12-Modul 9.44 c).
   - Mentor sayqali (`m14-dars-04-done`; yangi tafsilot — TAYANCHGA SAVOL 2–5): «Qo'shilaman» bosilishi bilan «Qo'shilmoqda…» + kichik kutish belgisi, tugma o'chiq · «O'yinlar» yuklanayotganda **ikkita kulrang karta** (haqiqiy karta o'lchamida, ichida kulrang chiziqlar sokin miltillaydi), ostida kutish yozuvi qoladi ·
     qo'shilgach son «8 / 10» → «9 / 10» 0,3 soniya ichida biroz kattalashib, o'z o'lchamiga qaytadi; tugma «Qo'shildingiz» · harakat kamaytirilgan bo'lsa — miltillash, aylanish va kattalashish yo'q, holatlar harakatsiz almashadi.
   - **Sonlar:** faqat namuna o'yin «8 / 10» → «9 / 10» (tayanch 1.0). Boshqa son yo'q (1.14); statistika deyilmaydi (T-043). Kutish vaqti sahnada soniyasiz — «bir lahza» (son to'qilmaydi). «0,3 soniya» — Mentor talabidagi dizayn qiymati, o'lchov emas.
   - Mentor sayqalining haqiqiy ko'rinishi (kulrang kartalar soni, kutish belgisi shakli, Expo Go'da harakat kamaytirilganda kutish belgisi) — ⛔ «qur» pilotida Mentor repo'sida ko'riladi; MD dagi sahna — namuna.
7. **Metafora yo'q. Keyssiz** (tayanch 5). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: hakam (ismsiz, gapsiz), o'yinchi, tashkilotchi. Ikkinchi misol faqat 1-savolda — uy vazifalari ilovasi (P-002; 13-Modul TAQIQLAR 4 ro'yxatidan).
8. **Amaliyot bloki (tayanch 1.4; 13-Modul 8-dars naqshi):** to'rt qadamning hammasi o'quvchining **o'z repo'sida, o'z mahsuloti va trekida** (Ochish → Prompt → Ishga tushirish → Tekshirish). Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», `{…}` yonida kulrang «masalan: …», «Yordam»da to'liq talab).
   **Talab zinapoyasi:** A1 — tayyor talab + 4 joy (`{ilova papkasi}` oldindan, `{asosiy tugma}`, `{kutish yozuvi}`, `{avvalgidek ishlashi kerak bo'lgan ishlar}`) · A2 — + 3 joy (`{ilova papkasi}` oldindan, `{ro'yxat ekrani}`, `{kartada nima bor}`) · A3 — + 3 joy (`{ilova papkasi}` oldindan, `{muvaffaqiyat joyi}`, `{qanday harakat}`); reduced-motion qismi — tayyor.
   Prompt — agentga buyruq shaklida (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Har blokda: «Backend'ga tegma» va «Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil» (3-darsda yuklanadigan kod hajmi o'lchangan; yangi kutubxona uni oshirishi mumkin).
   Xato yo'li (har blok 3-qadamida, bitta gap): «Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»» Push odati — `git add <fayl>` (`git add .` emas).
   **Trek:** `pm-m9d8-platforma.trek` (yo'q bo'lsa — 1-amaliyot tepasida ikki tanlov tugmasi «Mobil trek» · «Web-trek»; tanlov dars holatida (`ccProgress`), boshqa darsning kalitiga yozilmaydi — sinf 3). `{ilova papkasi}` trekdan: `mobil/` | `prototip/`.
   Brauzerda ko'rish: mobil trek — `mobil/` da `npx expo start`, keyin terminalda `w` (ilova kompyuter brauzerida ochiladi; Manbalar 5) · web-trek — `prototip/` da `npm run dev` (03 pilot TS 14). Telefonda: mobil — Expo Go (`npx expo start`, odatda o'zi qayta yuklanadi; bo'lmasa terminalda `r`); web — telefon brauzerida sayt.
   **«Davom etish»:** A1 — 3-qadamdan keyin (push qilingan bo'lsa; tekshiruvni 3-amaliyotdagi umumiy tekshiruv bilan qilish mumkin) · A2 — 3-qadamdan keyin · A3 — 4-qadamdan keyin (yangi versiya va oxirgi tekshiruv). Blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h); yakun sarlavhasi shu bayroqlar va 4-qadamdagi tekshiruv kartalaridan («Kutilganidek» / «Boshqacha» — 13-Modul F-1007-466).
9. **Tekshiruv — o'quvchining o'z ko'zi bilan, agent — zaxira (sinf 10):** uch joyni o'quvchi o'zi ko'radi — kompyuter brauzerida, DevTools bilan: **Network** bo'limida «Slow 4G» (javob sekin keladi — bosish javobi va kulrang kartalar ko'rinadi) · **Rendering** bo'limida `prefers-reduced-motion: reduce` (harakat kamaytirilgan holat). Ochish yo'li — Manbalar 3, 4.
   Tekshiruv — **real odamlar qo'shilmagan o'yinda** (Mentor misolida — namuna o'yin «Shanba, 18:00»); har bosishdan keyin «O'yindan chiqish» bilan holat boshiga qaytariladi (tayanch 9.10, 12-Modul 9.44 c). Bunday yozuv bo'lmasa — agent bitta namuna yozuv ochadi (`namuna = true`), haqiqiy yozuvlarga tegilmaydi (1-amaliyot 1-qadam).
   Telefonda (Expo Go yoki telefon brauzeri) bir marta bosib ko'rish — 3-amaliyot 4-qadam. Telefonning «Harakatni kamaytirish» sozlamasi — menyu nomi yozilmaydi (P-028), ixtiyoriy.
10. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l:** taqsimot tepada. Backend o'zgarmaydi — Render kutishi yo'q; tashqi kutish faqat 3-amaliyotda (`netlify deploy`). Agent ishlayotganda — kodni ko'rsatadigan prompt (SABOQ 52, har blok 3-qadami).
    Har blokda «Ulgurmasangiz» qatori. Sig'masa — oldindan belgilangan qisqartirish: 1-amaliyot tekshiruvi 3-amaliyotdagi umumiy tekshiruvga qo'shiladi · 3-amaliyotda telefonda ko'rish o'tkazib yuboriladi. Yakun sarlavhasi holatga qarab (11-ekran). O'qituvchi eslatmasi — 1-ekranda.
11. **Saqlash kaliti (tayanch 8):** o'qiydi `pm-m9d8-platforma` (`trek`) → yozadi — **yo'q** (natija — repo, teg `m14-dars-04-done`). Blok holati, tekshiruv kartalari («Kutilganidek» / «Boshqacha»), trek tanlovi (kalit yo'q bo'lsa) — dars holatida (`ccProgress`). Ism, login, manzil hech qayerga yozilmaydi.
12. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; brauzer, telefon kengligidagi ilova, kulrang kartalar, kutish belgisi, kalit, demo yo'li chizig'i — CSS/SVG; «Maydon Jamoa» nomi ilova sarlavhasida o'z rangida (11-Modul yashili), logotipsiz (TAQIQLAR 0).
    Rang — holat foni (D3): javob beradi / qoldi — `ok`, jim / o'chdi — `err` yoki `ink2`, joriy — `accent`, kulrang kartalar — `line`/`ink2`. Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1) · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 («O'lchov» bo'limi, skript bilan).
13. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 08.10.2026; o'zim tekshirdim); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0). Hakamlar oldida chiqishda demo yo'li — «O'yinlar» → «O'yin» → «Qo'shilaman» — proyektorda ko'rinadi. Sekin javobda ekran bir lahza jim turadi: bosilgani ko'rinmaydi, ro'yxat o'rni bo'sh, son birdan almashadi. <!-- TAXMIN T8 -->
  Bugun Mentor yangi ekran ham, yangi tugma ham qo'shmaydi — o'sha uch joyni o'zgartiradi va har birini sekin tarmoqda hamda harakat kamaytirilgan holatda o'zi tekshiradi. O'quvchi xuddi shuni o'z demo yo'lida qiladi (uch blok).
- **Hook:** «Qo'shilaman» bosiladi — ekran jim → 2-ekranda butun demo yo'li «Oldin» va «Keyin»: yangi narsa qo'shilmadi, uch joy o'zgardi (sayqal, joy egallovchi) → 1-blok (bosish javobi) → 1-savol → 5-ekran: harakat kamaytirilsa nima qoladi → 2-blok (kulrang kartalar) → 2-savol → 3-blok (muvaffaqiyat, harakat kamaytirilgan holat, yangi versiya).
- **Bitta vizual — «demo yo'li sahnasi»** (`SayqalSahna`, bitta manba `SAYQAL_SAHNA`, 163/180): <!-- TAXMIN T8 -->
  - **brauzer oynasi** (yorliq ramka ustida «laptop · proyektorga»; o'lcham barqaror, ≈ 360×300; manzil satri `maydon-jamoa-….netlify.app`), ichida telefon kengligidagi ilova (brauzer ko'rinishi): **«O'yinlar»** — sarlavha «Maydon Jamoa» (o'z rangida), ro'yxat joyi (kutish yozuvi · kulrang kartalar · karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10») ·
    **«O'yin»** — «‹ O'yinlar», «Shanba, 18:00 · Mahalla maydoni», katta son «8 / 10», tugma «Qo'shilaman» / «Qo'shilmoqda…» (kichik kutish belgisi, tugma kulrang) / «Qo'shildingiz».
  - **tepada ikki tanlov tugmasi** (2-ekran): «Oldin» · «Keyin» — Mentor ilovasi sayqaldan oldin va keyin (bitta manba: `m14-dars-04-start` / `-done` ko'rinishi). Ostida kulrang yorliq: «Backend sekin javob beradi — namuna».
  - **pastda demo yo'li chizig'i** — uch nuqta, ekranlar tartibida: «yuklanish» · «bosish» · «muvaffaqiyat»; holat: kulrang (ko'rilmagan) → qizil (jim) → yashil (javob beradi); har nuqta ostida bitta qisqa yorliq.
  - **o'ngda** (5-ekran) chizilgan kalit «Harakatni kamaytirish» va jadval «Harakat · Holat» (P-057: har qator muhri — «o'chdi» kulrang / «qoldi» yashil ✓).
  - Holatlar almashadi: bosish nuqtasi (kichik doira) · kutish belgisi aylanadi · kulrang chiziqlar sokin miltillaydi · son bir lahza kattalashib qaytadi. `prefers-reduced-motion` da sahnaning o'z harakati to'xtaydi — holatlar harakatsiz almashadi (DE-200); kalit yoqilganda ham shunday (5-ekran).
  - Ishlatilishi: 0 («O'yin», «Oldin») · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (to'liq sahna, ikki tanlov tugmasi) · 5 (kalit + jadval) · bloklarning o'ng tomoni (kutilgan natija — sahnaning kattasi) · 4, 7 (javobdan keyingi kichik ko'rinish).
- **Yakun:** demo yo'lidagi uch joy o'zgardi va o'zingiz tekshirdingiz · uyga vazifa yo'q · keyingi dars — «Guruh pitchingizda nimani tuzatishni aytadi?». <!-- TAXMIN T20 -->

---

## 0 · Kirish — tugma bosildi, ekran jim  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Tugmani bosgach, ekranda birinchi nima o'zgardi?** (48)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - boshida: Hakam demoni proyektorda kuzatadi — sahnadagi «Qo'shilaman»ni bosing va ekranga qarang. <!-- TAXMIN T8 -->
  - javobdan keyin: Bugun hakam ko'radigan shunday joylar bilan ishlaysiz — «Davom etish»ni bosing.
- Maket (chap): `SayqalSahna` «Oldin» holatida — brauzer oynasi «laptop · proyektorga», ichida «O'yin» ekrani: «‹ O'yinlar» · «Shanba, 18:00 · Mahalla maydoni» · katta son «8 / 10» · tugma «Qo'shilaman» (halqada). Ramka ustida yorliq «Mentor misoli · Maydon Jamoa». O'ngdagi variantlar xira — tugma bosilmaguncha.
- **Harakat → Vizual o'zgarish:** «Qo'shilaman» → tugmada bosish nuqtasi (kichik doira) bir lahza ko'rinadi; keyin ekran **jim**: tugma yozuvi, rangi va son o'zgarmaydi, kutish belgisi yo'q → bir lahzadan keyin son birdan «9 / 10», tugma birdan «Qo'shildingiz».
  Shundan keyin o'ngdagi variantlar faollashadi (har birining o'z yengil chegarasi, navbatma-navbat to'lqin — E 40).
- Variantlar (radio, ballsiz):
  - Tugmaning rangi va yozuvi
  - Aylanadigan kutish belgisi
  - ✔ Bir lahza hech narsa
- Javob — 3-variant: **Aynan!** Bir lahza ekran jim turdi: bosilgani ham, kutish ham ko'rinmadi — son keyin birdan almashdi.
- Javob — 1-variant: **Qiziq fikr!** Tugma faqat son almashganda o'zgardi — undan oldin u avvalgidek turdi.
- Javob — 2-variant: **Qiziq fikr!** Kutish belgisi chiqmadi — ekran javob kelguncha bir xil turdi.
- Javobdan keyin: sahna ostida chiziq chiqadi — «bosildi» · kulrang uzuq oraliq (yorliq «ekranda o'zgarish yo'q») · «son o'zgardi»; tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Avval tugmani bosing → Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: «Qo'shilaman» (halqa) → uch variant → «Davom etish».
- ✎ Hook obyekti — darsning o'qitish obyekti (P-001): demo yo'lidagi tugma va jim ekran. Savol — ekranda ko'ringan narsa haqida (hakamning fikri emas — TAQIQLAR 0: hakam gapi va fikri o'ylab topilmaydi). Uchala variant «ekranda nima o'zgardi» shaklida; 1, 2-variant — 1-blokning o'zi (tugma yozuvi, kutish belgisi) — payoff ularni yolg'onga chiqarmaydi: «oldin bo'lmadi» (P-016, §119).
  «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). Jim oraliq — soniyasiz («bir lahza»); sahnadagi kechikish — namuna (son to'qilmaydi). 9-Modul 5-darsi hookidagi «ekran jim» g'oyasining davomi — bu safar hakam oldida (O'qituvchi eslatmasi, 1-ekran).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun demo yo'lingizdagi uch joy hakamga javob beradi.** (54)
- Mentor: Yangi funksiya qo'shmaysiz — hakam ko'radigan ekranlardagi uch joyni o'zgartirasiz, namuna «Yordam»da turadi.
- Chap — «Dars oxirida»: `SayqalSahna` **tayyor** holatda («Keyin»), bir marta o'zi yuradi (DE-200): «O'yinlar» — kulrang kartalar → karta o'sha joyga keladi → «O'yin» → «Qo'shilaman» → «Qo'shilmoqda…» → son «8 / 10» → «9 / 10» bir lahza kattalashib qaytadi, «Qo'shildingiz»;
  demo yo'li chizig'ining uch nuqtasi navbat bilan yashil yonadi. <!-- TAXMIN T7 -->
- O'ng — bugungi uch ish (tex-karta «01 · matn», bosilmaydi; teg yo'q — 172; tartib App.jsx osti so'zma-so'z: bosish, yuklanish, muvaffaqiyat — P-015): <!-- TAXMIN T7 -->
  - 01 · Bosish: tugma bosilishi bilan o'zgaradi
  - 02 · Yuklanish: ro'yxat o'rnida kulrang kartalar
  - 03 · Muvaffaqiyat: son kichik harakat bilan o'zgaradi
- Pastki qator (mono, kichik): o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m14-dars-04-start` · namuna `m14-dars-04-done` <!-- TAXMIN T4 -->
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Uch joy mobil va web-trekda bir xil.
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: bugun Backend'ga tegilmaydi — Render kutishi yo'q; uch blok ham ilova kodida (`mobil/` yoki `prototip/`). Tekshiruv kompyuter brauzerida, DevTools bilan: Network bo'limida «Slow 4G» va Rendering bo'limida `prefers-reduced-motion: reduce` — o'quvchilar ikkalasini birinchi marta ko'radi, 1-amaliyotda bir daqiqa ko'rsating.
  Tekshiruv faqat real odamlar qo'shilmagan o'yinda (Mentor — namuna o'yin), har bosishdan keyin «O'yindan chiqish»: real o'yinchilarga son o'zgarishi va jonli xabar bormasin (12-Modul 9.44 c). 9-Modulda animatsiya qoidalari o'rganilgan — bugun ular qayta o'qitilmaydi, faqat demo yo'liga qo'llanadi.
  Agent «yana chiroyli qilay» deb yangi animatsiya yoki yangi ekran taklif qilsa — rad etiladi (tayanch 1.0). Uyga vazifa yo'q.
- ✎ Sarlavha — natija va'dasi (P-014); yangi atama yo'q (T-011: «sayqal» — 2-ekranda tug'iladi; «hakam» — 1-darsdan). «demo yo'lingiz» — o'quvchida bor (12-Modul jonli demo, T-039). Uch qator — natija nomi, kashfiyot ochilmaydi. Mentor — «Bu…» bilan boshlanmaydi, sarlavhani takrorlamaydi.

## 2 · Demo yo'li: oldin va keyin  ← QTushuncha (bashorat + 4 harakat)
- Eyebrow: Tushuncha · demo yo'lidagi uch joy
- Sarlavha: **Yangi ekransiz demo yo'li qanday yaxshilanadi?** (46)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Avval taxminingizni belgilang, keyin sahnada «O'yinlar»ni oching.
  - 1-harakatdan keyin: Endi «O'yin» ekranida «Qo'shilaman»ni bosing.
  - 2-harakatdan keyin: Endi tepadagi «Keyin»ni bosing — Mentor o'zgartirgan ilova ochiladi.
  - 3-harakatdan keyin: Endi «Qo'shilaman»ni yana bir marta bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — qo'shiladigan narsa o'sish tartibida): **Mentor demo yo'lini yaxshilash uchun nima qo'shadi?** · Yangi narsa qo'shmaydi · Bitta yangi tugma · Bitta yangi ekran
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Sahna (`SayqalSahna`): tepada tanlov tugmalari «Oldin» (tanlangan) · «Keyin» (2-harakatdan oldin xira) · brauzer oynasi · pastda demo yo'li chizig'i (uch kulrang nuqta: yuklanish · bosish · muvaffaqiyat) · kulrang yorliq «Backend sekin javob beradi — namuna».
  Sahna tugmasi (chegarali, ramkadan tashqarida): «O'yinlar»ni ochish (halqada). Ostida kichik hisoblagich: «Ekranlar: 2 · tugmalar: o'sha».
- **Harakat → Vizual o'zgarish:**
  1. «O'yinlar»ni ochish («Oldin») → brauzerda «O'yinlar»: ro'yxat joyi oq, faqat kutish yozuvi «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» → bir lahzadan keyin karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10» birdan paydo bo'ladi, yozuv yo'qoladi →
     chiziqdagi «yuklanish» nuqtasi qizil, ostida yorliq «ro'yxat o'rni bo'sh turdi». Sahna o'zi kartani bosadi (bosish nuqtasi) — «O'yin» ekrani ochiladi, «Qo'shilaman» halqada.
  2. «Qo'shilaman» («Oldin») → 0-ekrandagidek: ekran jim, keyin son birdan «9 / 10», tugma «Qo'shildingiz» → «bosish» nuqtasi qizil «bosilgani ko'rinmadi», «muvaffaqiyat» nuqtasi qizil «son birdan almashdi». «Keyin» tugmasi faollashadi (halqada).
  3. «Keyin» → sahna boshidan qayta: «O'yinlar» ochiladi — ro'yxat joyida **ikkita kulrang karta** (haqiqiy karta o'lchamida, ichida kulrang chiziqlar sokin miltillaydi), ostida o'sha kutish yozuvi → karta birinchi kulrang karta o'rniga, o'sha o'lchamda keladi, ikkinchisi so'nadi; hech narsa sakramaydi →
     «yuklanish» nuqtasi yashil «nima kelishi ko'rindi». Nom qatori (bitta): Yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl — joy egallovchi. <!-- TAXMIN T19 -->
     Sahna o'zi kartani bosadi — «O'yin» ekrani, «Qo'shilaman» halqada.
  4. «Qo'shilaman» («Keyin») → tugma bosilishi bilan «Qo'shilmoqda…» bo'ladi, yonida kichik kutish belgisi aylanadi, tugma kulrang (o'chiq) → «bosish» nuqtasi yashil «bosilgani ko'rindi» → javob kelgach son «8 / 10» → «9 / 10» bir lahza kattalashib qaytadi, tugma «Qo'shildingiz» → «muvaffaqiyat» nuqtasi yashil «o'zgarish ko'rindi».
     Hisoblagich bir lahza accent bilan yonadi: «Ekranlar: 2 · tugmalar: o'sha». Nom qatori (bitta): Demo yo'lidagi shunday kichik o'zgarishlar sayqal deyiladi. <!-- TAXMIN T19 -->
  - Holat o'quvchi bosgan tartibdan chiziladi (P-046); noto'g'ri tanlov yo'q — qaror bashoratda, natija harakatda.
- Joriy qator (4/4 dan keyin, bitta): Ekranlar va tugmalar o'sha — o'zgargani uch joyning ko'rinishi. (63)
- Natija qatori (yashil xulosa qutisining birinchi kichik qatori, E 42): «Taxminingiz ✕ — aslida: yangi narsa qo'shmaydi» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda yangi ekran ham, tugma ham qo'shilmadi: bosish, yuklanish va natija endi ekranda ko'rinadi.
- Qator (`QIzoh`, qutining oxirgi kichik qatori): Sayqal kutishni qisqartirmaydi — ekran kutish borligini ko'rsatadi.
- Tugadi (199): harakat paneli, tanlov tugmalari va sahna tugmasi yopiladi; brauzer va demo yo'li chizig'i (uch yashil nuqta) butun enga, «muvaffaqiyat» nuqtasi fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/4) → Davom etish
- Keyingi bosiladigan joy: bashorat variantlari → «O'yinlar»ni ochish (halqa) → «Qo'shilaman» → «Keyin» → «Qo'shilaman» → «Davom etish».
- O'qituvchi eslatmasi: 9-Modulda o'quvchilar animatsiya «bosildi», «o'zgardi», «tayyor» deb javob berishini ko'rgan — bugungi uch joy shuning demo yo'lidagi o'rni. Kutish yozuvi 11-Modulda qo'shilgan: u qancha kutishni aytadi; kulrang kartalar — nima kelishini.
  Sayqal tezlikni oshirmaydi (3-darsda tezlik alohida o'lchangan) — kutish vaqti o'sha qoladi. Sahnadagi «Oldin» va «Keyin» — Mentor ilovasining namunasi; o'quvchi ilovasida «Oldin» holatda kutish yozuvi bo'lmasligi ham mumkin.
- ✎ Bitta g'oya (P-008): yangi funksiyasiz — o'sha ekranlarda uch joy (tayanch 1.4: «yangi funksiya yo'q», uch joy). T-011: hodisa sahnada → «joy egallovchi» (3-harakatdan keyin) → «sayqal» (4-harakatdan keyin, uch joy ko'ringach); «bosish javobi» — 1-amaliyot vazifa qatorida (nom qatori bitta ekranda ikkitadan oshmasin).
  Bashorat — bir o'lchov (qo'shiladigan narsa: hech narsa · tugma · ekran), o'sish tartibida (S-015). Sahnada son faqat «8 / 10» → «9 / 10» (tayanch 1.0); kechikish soniyasiz. Joy egallovchi haqiqiy karta o'lchamida — 3-darsdagi «joy oldindan band — sahifa siljimaydi» g'oyasi bilan bir (A2 talabi).
  Xulosa «Bu misolda» bilan chegaralangan (sinf 4). Ikkinchi kulrang karta so'nishi — sahna namunasi (Mentor ro'yxatidagi o'yinlar soni tayanchda yo'q; TAYANCHGA SAVOL 3).

## 3 · Amaliyot 1 — bosish javobi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Tugma bosilishi bilan o'zgarsin, qayta bosilmasin.** (50)
- Mentor: Talab tayyor — demo yo'lingizdagi asosiy tugmani o'zingiz yozasiz; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Demo yo'lidagi asosiy tugma bosilishi bilan yozuvini o'zgartiradi va javob kelguncha qayta bosilmaydi. Tugma bosilishi bilan o'z holatini o'zgartirishi — bosish javobi deyiladi.
- Trek (A-bo'lim 8): `pm-m9d8-platforma.trek` bo'lsa — kulrang qator «Trekingiz: mobil» (yoki «web»); yo'q bo'lsa — ikki tanlov tugmasi «Mobil trek» · «Web-trek» (tanlov dars holatida).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching — 3-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.
     Bugun ilovaga yangi narsa qo'shilmaydi: agent «yana bir narsa qo'shay» desa — «Yo'q, faqat talabdagi ish» deng.
     Demo yo'lingizni ilovada bir marta bosib chiqing va ikki savolga javob toping: hakam oldida qaysi tugmani bosasiz? Javob kelguncha tugmada qanday yozuv tursin? (Mentor misolida: «O'yin» ekranidagi «Qo'shilaman»; yozuv «Qo'shilmoqda…».)
     Tekshirish uchun real odamlar qo'shilmagan yozuv kerak (Mentor misolida — namuna o'yin «Shanba, 18:00»). Bunday yozuv bo'lmasa — agentga «Nusxalash» bilan yuboring:
     > Demo tekshiruvi uchun bitta namuna yozuv yarat: {namuna yozuv}. `namuna = true` bo'lsin, haqiqiy foydalanuvchilarning yozuvlariga tegma. Kodni o'zgartirma. Qaysi yozuv va qaysi `id` ekanini ayt.
     Qavs yonida kulrang namuna: {namuna yozuv} — «masalan: o'yin «Juma, 18:00 · Mahalla maydoni», kerak 10, hali hech kim qo'shilmagan».
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `{ilova papkasi}` — {asosiy tugma} turgan ekran. Backend'ga tegma.
     > Nima qilsin: {asosiy tugma} bosilishi bilan, javob kelishini kutmasdan, tugma yozuvi «{kutish yozuvi}» ga almashsin, yonida kichik kutish belgisi chiqsin va tugma o'chiq bo'lsin — javob kelguncha qayta bosilmasin, ikkinchi so'rov yuborilmasin.
     > Javob kelgach — tugma avvalgi yakuniy holatiga o'tsin (ilovada qanday bo'lsa, shunday). Xato kelsa — tugma yana bosiladigan bo'lsin va ilovadagi xato xabari avvalgidek chiqsin.
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin. Yangi ekran, yangi tugma yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ilova papkasi} — oldindan, trekdan: `mobil/` yoki `prototip/`
     - {asosiy tugma} — «masalan: «O'yin» ekranidagi «Qo'shilaman»»
     - {kutish yozuvi} — «masalan: Qo'shilmoqda…»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — «masalan: kirish, «O'yinlar» ro'yxati, «O'yindan chiqish», jonli son»
     Tekshiruv («Nusxalash» bosilganda, bloklaydi): bu joyda kamida ikkita ish vergul bilan bo'lmasa yoki «hammasi», «ilova» kabi bitta so'z bo'lsa — Ikkita aniq ish yozing: masalan, kirish, ro'yxat. (49)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `mobil/` — «O'yin» ekrani, «Qo'shilaman» tugmasi. Backend'ga tegma.
     > Nima qilsin: «Qo'shilaman» bosilishi bilan, javob kelishini kutmasdan, tugma yozuvi «Qo'shilmoqda…» ga almashsin, yonida kichik kutish belgisi chiqsin va tugma o'chiq bo'lsin — javob kelguncha qayta bosilmasin, ikkinchi qo'shilish so'rovi yuborilmasin.
     > Javob kelgach — tugma «Qo'shildingiz» bo'lsin (avvalgidek). Xato kelsa — tugma yana «Qo'shilaman» bo'lsin va ilovadagi xato xabari avvalgidek chiqsin.
     > Nima buzilmasin: kirish, «O'yinlar» ro'yxati, «O'yindan chiqish», jonli son va «Hozir ko'ryapti» avvalgidek ishlasin. Yangi ekran, yangi tugma yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida `mobil/` o'rnida `prototip/` va saytingizdagi asosiy tugma turadi; qolgani o'sha.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q, `backend/` o'zgarmagan; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "sayqal: bosish javobi"`, `git push`.
     Brauzerda oching: mobil trek — `mobil/` da `npx expo start`, keyin terminalda `w` (ilova kompyuter brauzerida ochiladi); web-trek — `prototip/` da `npm run dev`.
     Kutayotganda agentga («Nusxalash» bilan; SABOQ 52):
     > Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: tugma o'chiq bo'ladigan qator va javob kelgach tugma qaytadigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har gapini o'zingiz ko'ring (kompyuter brauzerida):
     (1) DevTools'ni oching (F12 yoki Ctrl + Shift + I; Mac: Cmd + Option + I) → **Network** bo'limi → tepadagi ro'yxatdan «Slow 4G» ni tanlang. Endi javob sekin keladi.
     (2) Real odamlar qo'shilmagan o'yinni (yoki 1-qadamdagi namuna yozuvni) oching va asosiy tugmani **tez ikki marta** bosing. Tugma birinchi bosishdayoq yozuvini o'zgartirishi va bosilmasligi kerak; javob kelgach — yakuniy holat, natija (Mentor misolida son) bir marta o'zgaradi.
     (3) «O'yindan chiqish» (yoki mahsulotingizdagi shunday tugma) bilan holatni boshiga qaytaring.
     (4) Network bo'limida «No throttling» ni tanlang — keyingi ishlar odatdagi tezlikda bo'lsin.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (uch kadr bir marta o'zi yuradi): «O'yin» ekrani — «Qo'shilaman» → «Qo'shilmoqda…» (kichik kutish belgisi, tugma kulrang; ustida ikki bosish doirasi, ikkinchisi yonida kulrang yorliq «yuborilmadi») → «Qo'shildingiz», son «9 / 10»;
  ostida DevTools parchasi — Network bo'limi, ro'yxatda «Slow 4G» tanlangan. Web-trekda o'sha tugma sayt sahifasida.
- Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin; dars holatida — 13-Modul F-1007-466 naqshi): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Tugma bosilishi bilan o'zgaradi; javob kelguncha qayta bosilmaydi. (66)
- Qator (`QIzoh`, natija ostida, bitta): Agentning «tayyor» degani — da'vo; tugmani sekin tarmoqda o'zingiz ko'rdingiz. (78)
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-04-done` — <!-- TAXMIN T4 -->
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `mobil/.env` ga o'z qiymatlaringizni yozasiz.
- Ulgurmasangiz: «Davom etish» 3-qadamdan keyin ochiladi (push qilingan bo'lsa) — 4-qadamni 3-amaliyotdagi umumiy tekshiruv bilan birga qiling. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A1 — tayyor talab + 4 joy; mahsulot qarori (qaysi tugma, qanday yozuv, nima buzilmasin) o'quvchida (sinf 13). «Javob kelgach — avvalgi yakuniy holat» — o'quvchi ilovasida tugmaning keyingi holati har xil bo'lishi mumkin (tayyor qism umumiy). Xato holati — tugma qotib qolmasin (bosish javobining teskari xavfi).
  Ikki marta bosish — talabning o'zi («qayta bosilmasin»); bu blokda o'quvchi buni sekin tarmoqda bir marta ko'radi. Demo sharoitidagi qayta ko'rish — 7-darsning ishi, bu yerda va'da qilinmaydi (sinf 12, 16; 07 MD TAYANCHGA SAVOL 15). <!-- TAXMIN T7 -->
  Namuna yozuv — `namuna = true` (12-Modul 9.5), o'chirilmaydi: u demo uchun ham kerak bo'lishi mumkin (TAYANCHGA SAVOL 9). Backend'ga tegilmaydi — so'rovni ikkinchi marta yubormaslik ilova tomonida.
- O'qituvchi eslatmasi: DevTools'ni birinchi marta ochayotganlarga Network bo'limini proyektorda ko'rsating; «Slow 4G» faqat shu oynada ishlaydi. Ilovada xato xabari bo'lmasa — agent uni qo'shmaydi (yangi funksiya emas, tayyor holat qoladi); o'quvchi buni «Boshqacha» deb belgilamaydi.
  Tugma yozuvi o'quvchi ilovasida boshqacha bo'ladi («Yuborilmoqda…», «Saqlanmoqda…») — muhimi, bosilgani ko'rinsin.

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Uy vazifalari ilovasida «Yuborish» sekin javob beradi. Tugma nima qilsin?**
  - A · Javob kelguncha o'zgarmay, avvalgidek tursin
  - B · Har bosilganda vazifani qaytadan yuborsin
  - C · ✔ Bosilishi bilan o'zgarib, qayta bosilmasin
  - D · Bosilganda boshqa ekranga o'tib ketaversin
- Kalit: **C** (index 2). To'rttalasi «tugma nima qilsin» shaklida (fe'l «-sin»); qo'shtirnoq, tire hech birida yo'q; «qayta» B va C da (kalit so'z faqat to'g'rida emas); to'g'ri variant yolg'iz eng uzun emas (O'lchov).
- To'g'ri izohi: Bosilgani shu zahoti ko'rinadi, ikkinchisi yuborilmaydi.
- Xato izohlari (≤60):
  - A: Bir lahza jim tugmani odam yana bosmaydimi?
  - B: Bitta vazifa ikki marta yuborilsa, nima bo'ladi?
  - D: Ekran almashsa, yuborilganini qayerdan bilasiz?
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida): telefon maketida «Yuborish» → «Yuborilmoqda…» (kulrang, kichik kutish belgisi) — chizilgan, logotipsiz.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Tap Echo — birinchi urinishda to'g'ri.
- ✎ Ikkinchi misol (P-002) — uy vazifalari ilovasi; savol ekrandan ko'chirilmaydi (§106): darsda «Qo'shilaman», savolda boshqa tugma va boshqa ish. Distraktorlar uch turkumdan (sinf 8): jim qolish (A — sayqalsiz holat) · ikki marta yuborish (B — ikkinchi bosish yo'li ochiq) · chalg'itish (D — natija ko'rinmaydi).
  D hayotda ham yaxshi javob emas: yuborilgani ko'rinmaydi va qayta bosish yo'li baribir ochiq. «Bosilishi bilan» — darsning o'z so'zi; to'g'ri izohdagi «shu zahoti» T-020 ro'yxatida yo'q.

## 5 · Harakat kamaytirilsa  ← QTushuncha (bashorat + 2 harakat; solishtirish jadvali — P-057)
- Eyebrow: Tushuncha · harakatni kamaytirish
- Sarlavha: **Harakat kamaytirilsa, ekranda nima qoladi?** (42)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: 9-Modulda «Harakatni kamaytirish» kalitini ko'rgansiz — avval taxminingizni belgilang.
  - bashoratdan keyin: Endi o'ngdagi «Harakatni kamaytirish» kalitini yoqing.
  - 1-harakatdan keyin: Endi «O'yin» ekranida «Qo'shilaman»ni bosing va jadvalni kuzating.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; tanlangach ixcham qator; S-015 — qoladigan narsa o'sish tartibida): **Harakat kamaytirilsa, sayqaldan nima qoladi?** · Hech narsa qolmaydi · Faqat yozuvlar qoladi · Yozuv, kartalar va son qoladi
- Chap: `SayqalSahna` «Keyin» holatida (brauzer, «O'yinlar» ekrani). O'ng: chizilgan kalit «Harakatni kamaytirish» (o'chiq; halqada) va jadval «Harakat · Holat» — olti bo'sh qator (bitta manba `HARAKAT_HOLAT`):
  «kulrang kartalar miltillashi» · «kulrang kartalar» · «kutish belgisi aylanishi» · «Qo'shilmoqda… yozuvi» · «son kattalashishi» · «9 / 10».
- **Harakat → Vizual o'zgarish:**
  1. «Harakatni kamaytirish» → kalit yashil; sahna «O'yinlar»ni qayta ochadi: ikkita kulrang karta turadi, lekin chiziqlar miltillamaydi; karta o'sha joyga silliq kirishsiz keladi →
     jadvalda: «kulrang kartalar miltillashi — o'chdi» (kulrang muhr) · «kulrang kartalar — qoldi» (yashil ✓). Sahna o'zi kartani bosadi — «O'yin» ekrani, «Qo'shilaman» halqada.
  2. «Qo'shilaman» → tugma «Qo'shilmoqda…» bo'ladi, kutish belgisi aylanmaydi (harakatsiz turadi); son «8 / 10» → «9 / 10» kattalashmasdan almashadi, tugma «Qo'shildingiz» →
     jadvalda navbat bilan: «kutish belgisi aylanishi — o'chdi» · «Qo'shilmoqda… yozuvi — qoldi» · «son kattalashishi — o'chdi» · «9 / 10 — qoldi».
     Nom qatori (bitta; 9-Modul ta'rifi aynan): Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.
  - Holat bosishlar tartibidan (P-046); jadval faqat yuqoridagi olti qatorni ko'rsatadi, boshqa hech narsa qo'shilmaydi (P-057).
- Natija qatori (yashil xulosa qutisining birinchi kichik qatori, E 42): «Taxminingiz ✕ — aslida: yozuv, kartalar va son qoladi» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Harakat kamaytirilsa, animatsiya o'chadi: yozuv, kulrang kartalar va yangi son qoladi.
- Qator (`QIzoh`, qutining oxirgi kichik qatori): Telefondagi ilova bu sozlamani telefonning o'zidan o'qiydi.
- Tugadi (199): kalit va harakat paneli yopiladi; brauzer va jadval (uch «o'chdi», uch «qoldi») butun enga, «qoldi» ustuni fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Harakatlarni bajaring (N/2) → Davom etish
- Keyingi bosiladigan joy: bashorat variantlari → kalit (halqa) → «Qo'shilaman» → «Davom etish».
- O'qituvchi eslatmasi: 9-Modulda aytilgan: ba'zi odamlarga ko'p harakat noqulay — boshi aylanishi mumkin, ular qurilmada harakatni kamaytiradi (MDN, Manbalar 2). Hakam ham, sinfdagi mehmon ham shunday sozlamada bo'lishi mumkin — demo holati baribir tushunarli qolishi kerak.
  Sahnadagi kalit — chizilgan (9-Modul 12-ekran naqshi); haqiqiy sozlama nomi qurilmaga qarab boshqacha. Darsda tekshiruv — kompyuter brauzerida, DevTools'ning Rendering bo'limida (3-amaliyot).
- ✎ Bitta g'oya (P-008): animatsiya o'chadi, holat qoladi (tayanch 1.4) — uch joyda ham. 9-Modulda o'tilgan qoida qayta o'qitilmaydi — o'sha ta'rif nom qatorida aynan (T-052), mobil trek uchun QIzoh (telefon sozlamasi; Manbalar 1). Jadval — solishtirish sahnasi: har tomon o'z shaklida, muhr gapga (P-057).
  2-savol shu qoidani boshqa joyda — telefonda, muvaffaqiyat animatsiyasida so'raydi (§106). 2-amaliyot (kulrang kartalar) shu ekrandan keyin — joy egallovchi bu yerda ham ko'rinadi, miltillashi esa 3-amaliyotda harakat kamaytirilgan holatda tekshiriladi.

## 6 · Amaliyot 2 — yuklanish holati  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈18 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Ro'yxat kelguncha o'rnida kulrang kartalar tursin.** (50)
- Mentor: Kulrang kartalar ro'yxatingiz kartalariga o'xshasin — namuna «Yordam» ortida; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): <!-- TAXMIN T7 --> Demo yo'lidagi ro'yxat yuklanayotganda bo'sh joy o'rnida joy egallovchi kulrang kartalar turadi — haqiqiy karta o'lchamida, ro'yxat kelganda hech narsa siljimaydi.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — o'z repo'ngiz, 1-amaliyotdan keyingi kod. Kompyuter brauzerida ilovangizni oching, DevTools → Network → «Slow 4G» va demo yo'lingizdagi ro'yxat ekranini yangilang: ro'yxat kelguncha ekranda nima turadi?
     Ikki savolga javob toping: qaysi ekran hakam oldida birinchi yuklanadi? Bitta kartada nimalar bor — kulrang karta shuni takrorlaydi? (Mentor misolida: «O'yinlar» ro'yxati; kartada kun va soat, maydon, son.)
     Mahsulotingizda kutish yozuvi bo'lsa — u qoladi: u qancha kutishni aytadi, kulrang kartalar — nima kelishini. Keyin Network bo'limida «No throttling» ga qaytaring.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `{ilova papkasi}` — {ro'yxat ekrani}. Backend'ga tegma.
     > Nima qilsin: ro'yxat yuklanayotganda bo'sh joy o'rnida joy egallovchi chiqsin: ikkita kulrang karta — haqiqiy karta o'lchamida va shaklida, ichida {kartada nima bor} o'rnida kulrang chiziqlar; chiziqlar sokin miltillasin.
     > Ro'yxat kelganda kartalar kulrang kartalar o'rniga, o'sha joyga chiqsin — ekrandagi boshqa narsalar siljimasin. Kutish yozuvi bo'lsa — joy egallovchi ostida qolsin. Ro'yxat bo'sh kelsa yoki xato bo'lsa — ilovadagi avvalgi xabar chiqsin, kulrang kartalar qolib ketmasin.
     > Nima buzilmasin: 1-amaliyotdagi tugma, ro'yxatni yangilash va kartani bosib o'yinni ochish avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ilova papkasi} — oldindan, trekdan: `mobil/` yoki `prototip/`
     - {ro'yxat ekrani} — «masalan: «O'yinlar» ekrani, o'yinlar ro'yxati»
     - {kartada nima bor} — «masalan: kun va soat, maydon, «8 / 10» kabi son»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `mobil/` — «O'yinlar» ekrani (`mobil/src/app/index.tsx`), o'yinlar ro'yxati. Backend'ga tegma.
     > Nima qilsin: ro'yxat yuklanayotganda bo'sh joy o'rnida joy egallovchi chiqsin: ikkita kulrang karta — o'yin kartasi o'lchamida va shaklida, ichida kun va soat, maydon va son o'rnida kulrang chiziqlar; chiziqlar sokin miltillasin.
     > Ro'yxat kelganda o'yin kartalari kulrang kartalar o'rniga, o'sha joyga chiqsin — ekrandagi boshqa narsalar siljimasin. «O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» yozuvi joy egallovchi ostida qolsin. Ro'yxat bo'sh kelsa yoki xato bo'lsa — ilovadagi avvalgi xabar chiqsin, kulrang kartalar qolib ketmasin.
     > Nima buzilmasin: «Qo'shilaman» tugmasi (1-amaliyot), pastga tortib yangilash va kartani bosib o'yinni ochish avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida `prototip/` va saytingizdagi ro'yxat sahifasi; qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "sayqal: joy egallovchi"` → `git push`. Brauzerda yangilang (mobil — `npx expo start` ishlab turgan bo'lsa, odatda o'zi qayta yuklanadi; bo'lmasa terminalda `r`; web — `npm run dev`).
     Kutayotganda agentga («Nusxalash» bilan):
     > Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: kulrang kartalar chiqadigan shart va kulrang karta o'lchami yozilgan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — o'zingiz ko'ring:
     (1) DevTools → Network → «Slow 4G» (yoki «3G»), ro'yxat ekranini yangilang: bo'sh joy o'rnida kulrang kartalar turishi, chiziqlar sokin miltillashi kerak.
     (2) Ro'yxat kelganda kartalar o'sha joyga chiqishi kerak: tugmalar, sarlavha va boshqa narsalar sakramaydi.
     (3) «No throttling» ni tanlab yana yangilang: kulrang kartalar bir lahza ko'rinib o'tishi yoki umuman ko'rinmasligi mumkin — bu ham to'g'ri.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (bir marta o'zi yuradi): «O'yinlar» — ikkita kulrang karta va ostida kutish yozuvi → karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10» birinchi kulrang karta o'rniga, ikkinchisi so'nadi; yonida kulrang yorliq «sahifa siljimadi».
  Ostida DevTools parchasi — Network, «Slow 4G». Web-trekda — sayt sahifasidagi ro'yxat.
- Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Ro'yxat kelguncha kulrang kartalar turdi; kartalar o'sha joyga chiqdi. (70)
- Qator (`QIzoh`, natija ostida, bitta): Kulrang kartalar kutishni qisqartirmaydi — nima kelishini ko'rsatadi. (69)
- Ulgurmasangiz: «Davom etish» 3-qadamdan keyin ochiladi — 4-qadamni 3-amaliyotdagi umumiy tekshiruv bilan birga qiling. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Grey Cards — 4-qadam «Bajardim»ida (natijadan qat'i nazar — tavsif qilingan ishni aytadi; 13-Modul M-q6 A naqshi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A2 — tayyor talab + 3 joy; ro'yxat ekrani va karta tarkibi — o'quvchi qarori (sinf 13). «Ikkita kulrang karta» — talabning tayyor qismi (tayanch 1.4 «kulrang kartalar»; soni — TAYANCHGA SAVOL 3).
  «Haqiqiy karta o'lchamida» — 3-darsdagi `width`/`height` g'oyasi bilan bir (joy oldindan band — sahifa siljimaydi); bu darsda CLS o'lchanmaydi, o'quvchi ko'z bilan ko'radi (sinf 7: «siljimaydi» — ekranda ko'rinadigan narsa). Bo'sh ro'yxat va xato — kulrang kartalar qolib ketmasligi (holat yolg'on bo'lmasin).
- O'qituvchi eslatmasi: «Slow 4G» bilan ham ro'yxat tez kelsa — «3G» ni tanlang. Kulrang kartalar soni o'quvchi ro'yxatidagi yozuvlar soniga teng bo'lishi shart emas: muhimi, birinchi karta o'z joyida chiqsin. Kutish yozuvi yo'q mahsulotda u qo'shilmaydi (yangi funksiya emas).

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (yorliqsiz — SABOQ 6)
- Savol: **Mentor misolida telefonda harakat kamaytirilgan. Qo'shilgach son qanday o'zgaradi?**
  - A · O'zgarmaydi — animatsiya o'chgani uchun
  - B · ✔ Harakatsiz almashib, «9 / 10» bo'ladi
  - C · Kattalashib qaytib, «9 / 10» bo'ladi
  - D · Faqat sahifa yangilanganda o'zgaradi
- Kalit: **B** (index 1). «9 / 10» qo'shtirnoqda — B va C da (kalit belgisi faqat to'g'rida emas); tire — faqat A da; to'g'ri variant yolg'iz eng uzun emas (O'lchov).
- To'g'ri izohi: Animatsiya o'chadi, yangi son esa baribir ko'rinadi.
- Xato izohlari (≤60):
  - A: Animatsiya o'chdi. Holat ham o'chishi kerakmi?
  - C: Kattalashish — animatsiya. Sozlama uni qoldiradimi?
  - D: Sozlama harakatga tegadi, yangilashga emas.
- Javob topilgach (`QuestionScreen` `vizual`, kichik): telefon maketida son «8 / 10» → «9 / 10» harakatsiz almashadi, yonida kichik kalit «Harakatni kamaytirish» yoqilgan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Still Shows — birinchi urinishda to'g'ri.
- ✎ Yangi vaziyat (§106): 5-ekranda kompyuterdagi sahna va jadval; bu yerda — telefon va muvaffaqiyat animatsiyasi (3-amaliyot oldidan). Distraktorlar uch turkumdan (sinf 8): holat ham o'chadi deb o'ylash (A) · sozlama e'tiborsiz (C) · yolg'on mexanizm — yangilash kerak (D).
  «Mentor misolida» — talab shunday yozilgan (Yordam A3); boshqa ilovada animatsiya boshqacha bo'lishi mumkin, B shu talab bo'yicha yagona (sinf 8). Ballik testlar ketma-ket emas (4, 7 — P-012).

## 8 · Amaliyot 3 — muvaffaqiyat, harakat kamaytirilgan holat va yangi versiya  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 3 · o'z repo'ngiz
- Sarlavha: **Natijada ekran kichik harakat bilan javob bersin.** (49)
- Mentor: Animatsiya qisqa bo'lsin va harakat kamaytirilganda o'chsin; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): <!-- TAXMIN T7 --> Ish bajarilganda ekrandagi o'zgarish kichik animatsiya bilan ko'rinadi; harakat kamaytirilgan qurilmada uch joyda ham animatsiya o'chadi, holat qoladi.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — o'z repo'ngiz, 2-amaliyotdan keyingi kod. Demo yo'lingiz oxirida nima o'zgaradi — son, yozuv yoki belgi? Shu joyda qanday kichik harakat bo'lsin? (Mentor misolida: «O'yin» ekranidagi son «8 / 10» → «9 / 10» bir lahza kattalashib qaytadi.)
     9-Modul qoidasi: harakat «bajarildi» deb javob bersin — uzoq, takrorlanadigan yoki ekran bo'ylab katta harakat ortiqcha.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `{ilova papkasi}` — {muvaffaqiyat joyi}; 1–2-amaliyotdagi tugma va kulrang kartalar. Backend'ga tegma.
     > Nima qilsin: 1) Ish bajarilganda {muvaffaqiyat joyi} da kichik animatsiya bo'lsin: {qanday harakat}. Animatsiya qisqa bo'lsin va bir marta o'ynasin.
     > 2) Qurilmada harakatni kamaytirish yoqilgan bo'lsa — bu animatsiya, kulrang kartalar miltillashi va kutish belgisi aylanishi bo'lmasin; yangi holat harakatsiz almashsin: yozuv, kulrang kartalar va yangi qiymat ko'rinib tursin. Sozlamani qanday o'qiganingni ayt.
     > Nima buzilmasin: 1–2-amaliyotdagi tugma va kulrang kartalar avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ilova papkasi} — oldindan, trekdan: `mobil/` yoki `prototip/`
     - {muvaffaqiyat joyi} — «masalan: «O'yin» ekranidagi son «8 / 10»»
     - {qanday harakat} — «masalan: son biroz kattalashib, o'z o'lchamiga qaytsin»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `mobil/` — «O'yin» ekranidagi son; 1–2-amaliyotdagi «Qo'shilaman» tugmasi va «O'yinlar» ekranidagi kulrang kartalar. Backend'ga tegma.
     > Nima qilsin: 1) Qo'shilish muvaffaqiyatli bo'lganda son («8 / 10» → «9 / 10») 0,3 soniya ichida biroz kattalashib, o'z o'lchamiga qaytsin. Animatsiya bir marta o'ynasin; son boshqa sabab bilan o'zgarsa (jonli son) — animatsiya bo'lmasin.
     > 2) Telefonda harakatni kamaytirish yoqilgan bo'lsa — React Native `AccessibilityInfo` orqali bil (brauzer ko'rinishida u `prefers-reduced-motion` ni o'qiydi) — son kattalashmasin, kulrang kartalar miltillamasin, kutish belgisi aylanmasin; yangi holat harakatsiz almashsin: «Qo'shilmoqda…» yozuvi, kulrang kartalar va yangi son ko'rinib tursin.
     > Nima buzilmasin: «Qo'shilaman» tugmasi va kulrang kartalar avvalgidek ishlasin. Yangi ekran yoki yangi funksiya qo'shma. Animatsiya uchun yangi kutubxona qo'shma — loyihada bor vosita bilan qil. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): `prototip/` da sozlama `prefers-reduced-motion` orqali o'qiladi (9-Modul: `@media (prefers-reduced-motion: reduce)`); qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "sayqal: muvaffaqiyat va harakatni kamaytirish"` → `git push`. Keyin **yangi versiya** (trekka qarab bitta yo'l ko'rinadi):
     - mobil trek — brauzer ko'rinishi: `mobil/` da `npx expo export -p web`, keyin `netlify deploy --prod --dir dist` (12-Modul buyruqlari; push'dan keyin o'zi yangilanmaydi).
     - web-trek — push'dan keyin Netlify saytni odatda o'zi yangilaydi; bir necha daqiqa kuting.
     Kutayotganda agentga («Nusxalash» bilan):
     > Yozgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: harakatni kamaytirish sozlamasi o'qiladigan qator va son animatsiyasi boshlanadigan qator. Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — yangi versiyada, hakam ko'radigandek (kompyuter brauzerida, laptopda): <!-- TAXMIN T8 -->
     (1) Yangi versiyani oching, DevTools → Network → «Slow 4G». Demo yo'lini boshidan oxirigacha bosib chiqing: kulrang kartalar → asosiy tugma bosilishi bilan o'zgaradi → natijada kichik animatsiya. «O'yindan chiqish» bilan holatni boshiga qaytaring.
     (2) Rendering bo'limini oching: Ctrl + Shift + P (Mac: Cmd + Shift + P) → «rendering» deb yozing → «Show Rendering». «Emulate CSS media feature prefers-reduced-motion» ro'yxatidan `prefers-reduced-motion: reduce` ni tanlang va sahifani yangilang.
         Demo yo'lini yana bosib chiqing: miltillash, aylanish va kattalashish yo'q — yozuv, kulrang kartalar va yangi son ko'rinib turadi. Holatni boshiga qaytaring.
     (3) Rendering'da tanlovni «No emulation» ga, Network'da «No throttling» ga qaytaring.
     (4) Telefoningizda bir marta oching (mobil — Expo Go yoki telefon brauzerida brauzer ko'rinishi; web — sayt) va asosiy tugmani bosing: o'sha uch joy ko'rinadimi. Holatni boshiga qaytaring.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.» → push → yangi versiya → qayta tekshiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (ikki qator, bir marta o'zi yuradi): yuqorida — «O'yin»: «Qo'shilmoqda…» → son «9 / 10» bir lahza kattalashib qaytadi, «Qo'shildingiz»; pastda o'sha kadr, yorliq «prefers-reduced-motion: reduce» — son harakatsiz almashadi, kutish belgisi harakatsiz.
  Ostida terminal kartasi — `netlify deploy --prod --dir dist` natijasidagi manzil qatori (`….netlify.app`). Web-trekda — sayt sahifasi va Netlify'dagi oxirgi yangilanish qatori.
- Tekshiruv kartasi (4-qadam oxirida, «Bajardim»dan oldin): «Kutilganidek» · «Boshqacha». «Boshqacha» bo'lsa yashil qator o'rnida kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring. (64)
- Hammasi bajarilgach (yashil, «Kutilganidek» da): Natijada kichik animatsiya bor; harakat kamaytirilganda holat qoldi. (68)
- Qator (`QIzoh`, natija ostida, bitta; faqat mobil trekda): APK o'zi yangilanmaydi — bugun demo brauzer ko'rinishida tekshirildi. (69)
- Ulgurmasangiz: (4) telefonda ko'rishni o'tkazib yuboring — kompyuterdagi tekshiruv asosiy. Avvalgi bloklarning 4-qadami qolgan bo'lsa — shu yerdagi (1) va (2) bilan birga qiling va o'sha bloklarda ham «Bajardim»ni bosing. «Davom etish» 4-qadamdan keyin ochiladi.
- Nishon (bonus): Calm Mode — 4-qadam «Bajardim»ida (natijadan qat'i nazar — tavsif qilingan ishni aytadi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A3 — tayyor talab + 3 joy; animatsiya shakli o'quvchi qarori (sinf 13), reduced-motion qismi — tayyor (texnik). «Sozlamani qanday o'qiganingni ayt» — agent tanlovini o'quvchi ko'radi (mobil — `AccessibilityInfo`, web — `prefers-reduced-motion`; Manbalar 1, 2).
  Tekshiruv — DevTools emulyatsiyasi bilan (telefon sozlamasini o'zgartirish shart emas — menyu nomi yozilmaydi, P-028). Brauzer ko'rinishida `prefers-reduced-motion` ni React Native Web o'qiydi (Manbalar 2) — kompyuterdagi tekshiruv mobil trek uchun ham ishlaydi; Expo Go'da (native) ko'rinishi ⛔ pilot (Shubhali 3).
  Yangi versiya — 12-Modul 9.28; APK bu darsda qayta tayyorlanmaydi (demo — brauzerda, tayanch 9.6; TAYANCHGA SAVOL 8). «Jonli son» o'zgarganda animatsiya yo'q — muvaffaqiyat o'quvchining o'z harakatiga javob (9-Modul: «bosildi», «tayyor»).
- O'qituvchi eslatmasi: Rendering bo'limi topilmasa — DevTools'ning «More tools» menyusida ham bor (Manbalar 3); Chrome versiyasiga qarab joyi o'zgarishi mumkin. Emulyatsiya faqat shu oynada ishlaydi. Netlify yangilanishini kutayotganda — kodni ko'rsatadigan prompt.
  Animatsiya bir xil emas — o'quvchi o'z harakatini tanlaydi; ortiqcha harakat (uzun, takrorlanadigan, ekran bo'ylab) bo'lsa — 9-Modul qoidasini eslating. Sinfda kimning animatsiyasi «chiroyliroq» ekani solishtirilmaydi.

## 9 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Bosish javobi» · 7 — «2 — Harakat kamaytirilsa»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (KORPUS §61; SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ Uch blok bajarildi (faqat 3-amaliyot 4-qadami bajarilganda; aks holda yorliq yo'q) · {N}/2 to'g'ri
- Sarlavha (bloklar va tekshiruv kartalari holatiga qarab, P-046; sinf 6 — o'quvchi qilgan va ko'rgan ishni aytadi, har holat rost — E 54; ustunlik tartibi — yuqoridan):
  - uchala blok, hammasi «Kutilganidek»: **Demo yo'lidagi uch joy o'zgardi va tekshirildi.** (47)
  - bajarilgan blokda «Boshqacha» bor: **Sayqal qilindi — tuzatiladigan joy qoldi.** (41)
  - 1 va 2-blok («Kutilganidek»), 3-blok yo'q: **Bosish va yuklanish tayyor — muvaffaqiyat qoldi.** (48)
  - kamida bitta blok, lekin yuqoridagilar emas: **Sayqal boshlandi — qolgan joylar hali tugamagan.** (48)
  - hech bir blok bajarilmagan: **Demo yo'li hali sayqallanmagan — bloklarni bajaring.** (52)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5):
  - Sayqal — demo yo'lidagi kichik o'zgarishlar; yangi funksiya qo'shilmaydi.
  - Bosish javobi: tugma bosilishi bilan o'zgaradi va javob kelguncha qayta bosilmaydi.
  - Joy egallovchi haqiqiy karta o'lchamida bo'lsa, ro'yxat kelganda sahifa siljimaydi.
  - Muvaffaqiyat animatsiyasi qisqa bo'ladi va ish bajarilganini ko'rsatadi.
  - Harakat kamaytirilsa, animatsiya o'chadi: yozuv, kulrang kartalar va yangi son qoladi.
- Uyga vazifa — yo'q (loyiha kuni; sinf 14). `uyga: null`.
- Keyingi dars — «Guruh pitchingizda nimani tuzatishni aytadi?» <!-- TAXMIN T20 -->
- Nishonlaringiz — N/4
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- ✎ «o'zgardi va tekshirildi» — o'quvchi uchala blokda sekin tarmoq va harakat kamaytirilgan holatni o'zi ko'rgan va «Kutilganidek»ni tanlagan («Bajardim» — ish fakti, natija emas — 13-Modul F-1007-466); «demo tayyor», «demo buzilmaydi» deyilmaydi (sinf 5, 16).
  «hali tugamagan» — qisman bajarilgan, tartibsiz holat (E 54); «hech narsa» — alohida sarlavha, «uyda» yo'q (loyiha kuni, sinf 14). Sarlavhalar ikkala trekka to'g'ri. «Keyingi dars» qatori — App.jsx `m12-05` nomi (T-038: boshqa joyda va'da yo'q).

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Tap Echo** — Tugma bosilishi bilan nima qilishini topdingiz (4-ekran, 1-savol)
- **Still Shows** — Harakatsiz ham yangi son ko'rinishini topdingiz (7-ekran, 2-savol)
- **Grey Cards** — Kulrang kartalarni sekin tarmoqda o'zingiz tekshirdingiz (2-amaliyot, 4-qadam «Bajardim») — bonus, birinchi urinish sharti yo'q
- **Calm Mode** — Harakat kamaytirilgan holatni o'zingiz tekshirdingiz (3-amaliyot, 4-qadam «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10: Tap Echo · Still Shows · Grey Cards · Calm Mode — 0). Ikki blok nishoni — ish uchun (P-048), tekin emas; tavsif «tekshirdingiz» — natija da'vosi emas.

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: koddan bitta qator yoki raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Bosish javobi»
   - 1 · Tugma bosilishi bilan yozuvini o'zgartiradi.
   - 2 · Javob kelguncha u o'chiq — qayta bosilmaydi.
   - 3 · Javob kelgach — yakuniy holat, masalan «Qo'shildingiz».
   - Sinfga savol: Demo paytida tugma jim tursa, siz nima qilgan bo'lardingiz?
2. 2-savol (7-ekran) — «Harakat kamaytirilsa»
   - 1 · Animatsiya o'chadi: miltillash, aylanish, kattalashish.
   - 2 · Holat qoladi: yozuv, kulrang kartalar, yangi son.
   - Saytda buni ko'rsatadi · `prefers-reduced-motion`
   - Sinfga savol: Harakat kamaytirilganda tugma yozuvi nega qolishi kerak?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Sayqal nima? | Demo yo'lidagi kichik o'zgarishlar: bosish javobi, yuklanish holati va muvaffaqiyat | Yangi funksiya qo'shilmaydi. Inglizchasi: polish |
| Mentor misolida demo yo'li qaysi ekranlardan iborat? | «O'yinlar» va «O'yin» ekranlaridan | Hakam ularni proyektorda ko'radi |
| Bosish javobi nima? | Tugma bosilishi bilan o'z holatini o'zgartirishi | Javob kelguncha tugma qayta bosilmaydi |
| Mentor misolida «Qo'shilaman» bosilgach nima chiqadi? | «Qo'shilmoqda…» yozuvi va kichik kutish belgisi | Javob kelgach — «Qo'shildingiz» |
| Joy egallovchi nima? | Yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl | Inglizchasi: skeleton |
| Kulrang kartalar qanday o'lchamda bo'ladi? | Haqiqiy kartalar o'lchamida | Ro'yxat kelganda sahifa siljimaydi |
| Kutish yozuvi va kulrang kartalarning farqi nima? | Yozuv qancha kutishni aytadi, kartalar nima kelishini ko'rsatadi | Mentor misolida ikkalasi birga turadi |
| Muvaffaqiyat animatsiyasi qanday bo'ladi? | Qisqa va bir marta | Mentor misolida son bir lahza kattalashib qaytadi |
| Harakat kamaytirilsa nima o'chadi? | Animatsiya: miltillash, aylanish, kattalashish | Holat qoladi: yozuv, kulrang kartalar, yangi son |
| Saytda harakat kamaytirilganini nima ko'rsatadi? | `prefers-reduced-motion` | Telefondagi ilova buni telefon sozlamasidan o'qiydi |
| Javobni sekin qilib qanday tekshirasiz? | DevTools'da Network bo'limida «Slow 4G» bilan | Keyin «No throttling» ga qaytaring |
| Animatsiya uchun nega yangi kutubxona qo'shilmaydi? | Yuklanadigan kod hajmi oshishi mumkin | Loyihada bor vosita bilan qilinadi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (har biri 3 marta); ekran savollarining nusxasi emas (§144)
1. Bu darsda demo yo'lidagi qaysi uch joy o'zgaradi? (1, 2)
   - ✔ Bosish, yuklanish va muvaffaqiyat
   - Kirish, ro'yxatdan o'tish va chiqish
   - Rasmlar, kutubxona va kod hajmi
   - Lending, maxfiylik va oferta sahifasi
2. Sayqaldan keyin demo yo'lida nima o'zgaradi? (2)
   - Ekranlar soni va ularning tartibi
   - ✔ O'sha ekranlarda uch joy ko'rinishi
   - Backend va Database'ning tuzilishi
   - Ilovaning nomi va bosh ekrani rangi
3. Javob sekin kelsa, «Qo'shilaman» bosilgach qanday turadi? (2, 3)
   - Avvalgidek turadi, yana bosish mumkin
   - Yo'qolib, o'rnida bo'sh joy qoladi
   - ✔ «Qo'shilmoqda…» yozuvi bilan, o'chiq
   - «Qo'shildingiz» bo'lib, bosiladi
4. Joy egallovchi qayerda turadi? (2, 6)
   - Ekranning eng tepasida, kichik bo'lib
   - Alohida ekranda, ro'yxatdan oldin
   - Tugmaning ichida, yozuv o'rnida
   - ✔ Ma'lumot o'rnida, uning o'lchamida
5. Kulrang kartalar nega haqiqiy karta o'lchamida bo'ladi? (6)
   - ✔ Ro'yxat kelganda sahifa siljimasin
   - Kartalar chiroyliroq ko'rinsin deb
   - Backend javobi tezroq kelsin deb
   - Kutish yozuvi kerak bo'lmasin deb
6. Kutish yozuvi bo'lsa, kulrang kartalar nima beradi? (2, 6)
   - Ro'yxatni tezroq yuklab beradi
   - ✔ Nima kelishini oldindan ko'rsatadi
   - Backend'ni demo oldidan uyg'otadi
   - Kutish yozuvini butunlay almashtiradi
7. Harakat kamaytirilgan qurilmada sayqaldan nima qoladi? (5)
   - Hech narsa qolmaydi — hammasi o'chadi
   - Faqat animatsiyalar qoladi, yozuvsiz
   - ✔ Yozuv, kulrang kartalar va yangi son
   - Faqat aylanadigan kutish belgisi
8. Harakat kamaytirilganini DevTools'da qayerda tanlaysiz? (8)
   - Network bo'limidagi ro'yxatda
   - Lighthouse bo'limidagi sozlamada
   - Console bo'limidagi qatorlarda
   - ✔ Rendering bo'limidagi ro'yxatda
9. Ro'yxat sekin kelishini DevTools'da qanday ko'rasiz? (3, 6)
   - ✔ Network'da «Slow 4G» ni tanlab
   - Lighthouse'da «Mobile» ni tanlab
   - Rendering'da «reduce» ni tanlab
   - Console'da xato qatorini o'qib
10. Muvaffaqiyat animatsiyasi qanday bo'lishi kerak? (8)
    - Uzun: ekran bo'ylab bayram chiqadi
    - ✔ Qisqa: bir marta o'ynab, to'xtaydi
    - Doimiy: son to'xtamay miltillaydi
    - Takroriy: har soniyada qaytadan
11. Animatsiya uchun nega yangi kutubxona qo'shilmaydi? (3, 6, 8)
    - Kutubxona faqat web'da ishlaydi
    - Agent kutubxona o'rnata olmaydi
    - ✔ Kod hajmi oshib ketishi mumkin
    - Kutubxona Backend'ni sekinlatadi
12. Sayqal ishlashini qanday bilasiz? (3, 6, 8)
    - Agent «hammasi tayyor» deb yozadi
    - Kod ichida animatsiya so'zi bor
    - Sinfdosh «chiroyli chiqibdi» deydi
    - ✔ Sekin tarmoqda o'zingiz ko'rasiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Izoh: 1 — boshqa darslarning ishi (12, 13, 14-Modul 3-dars) · 3 — qo'shtirnoq C va D da (to'g'ridan tashqari ham) · 5 — 3-dars g'oyasi (joy oldindan band) · 7 — 5-ekran qoidasi, so'zma-so'z nusxa emas (bashorat ballsiz edi) · 8, 9 — amaliyot asboblari (to'rt bo'lim haqiqiy, faqat bittasi to'g'ri) · 10 — 9-Modul «ortiqcha harakat» · 11 — 3-dars bilan ko'prik · 12 — sinf 5 (agent so'zi — da'vo).
Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri (S-004), har savolda kamida ikki turkum; haqiqiy hayotda rost bo'lib qoladigan variant chiqarildi (masalan 6-savolda «tezroq yuklab beradi» — sayqal tezlikni oshirmaydi (2-ekran QIzoh)).
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari ru'da ham o'sha; R-008): sayqal · bosish javobi · joy egallovchi · «Qo'shilmoqda…» · kulrang kartalar · `prefers-reduced-motion` · Slow 4G · Rendering · «8 / 10» · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **2 (C)** · s7 **1 (B)**; bloklar (3, 6, 8) — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m12-04-v1`, `lessonTitle` — «Loyiha kuni: demo uchun sayqal». App.jsx `m12-04` (470-qator) ga `comp: PolishDayLesson` + import — «qur» bosqichida (asosiy seans); bu agent App.jsx ga tegmaydi.
2. **Bitta manba (180):** `SAYQAL_SAHNA` (brauzer: ekranlar `oyinlar` · `oyin`; ro'yxat holatlari `bosh` (kutish yozuvi) · `kulrang` · `karta`; tugma holatlari `qoshilaman` · `qoshilmoqda` · `qoshildingiz`; son `8 / 10` → `9 / 10`; rejimlar `oldin` · `keyin` · `kamaytirilgan`) ·
   `DEMO_YOLI` (uch nuqta: `yuklanish` · `bosish` · `muvaffaqiyat`; har biri `oldin`/`keyin` yorlig'i bilan — 2-ekran matnlari) · `KUTISH_YOZUVI` («O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» — 11-Modul 9.95 aynan) · `TUGMA_YOZUVLARI` · `HARAKAT_HOLAT` (5-ekran, olti qator) ·
   `YORDAM_A1` · `YORDAM_A2` · `YORDAM_A3` · `NAMUNA_YOZUV` (A1 1-qadam) — ekranlar, bloklar o'ngi va kartochka shundan o'qiydi.
3. **`SayqalSahna`** komponenti (qolipda yo'q, yangi): brauzer oynasi (≈360×300, o'lcham barqaror; yorliq «laptop · proyektorga»; manzil satri), ichida telefon kengligidagi ilova; tepada tanlov tugmalari «Oldin» · «Keyin»; pastda demo yo'li chizig'i; 5-ekranda o'ngda chizilgan kalit «Harakatni kamaytirish» va jadval.
   Animatsiyalar (sahnaning o'zi): bosish doirasi, kutish belgisi aylanishi, kulrang chiziqlar miltillashi (sokin, ~1,5 s davr), son kattalashishi (bir marta). `kamaytirilgan` rejimda va `prefers-reduced-motion` da — harakatsiz almashish (DE-200). «Maydon Jamoa» nomi — 11-Modul yashili. Logotip/emoji yo'q (D4).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: sq-qoshil sq-oyinlar sq-oldin sq-keyin sq-kalit`). Maketda hech narsa kesilmaydi (E 41); 393 kenglikda brauzer o'lchami barqaror.
4. **0-ekran `QKirish`:** maket — `SayqalSahna` `oldin`, «O'yin» ekrani; «Qo'shilaman» bosilmaguncha variantlar xira; bosilgach jim oraliq (sahna ~1,5 s, son ko'rsatilmaydi), keyin son va tugma birdan; javobdan keyin «bosildi · ekranda o'zgarish yo'q · son o'zgardi» chizig'i.
5. **2-ekran `QTushuncha`:** `QBashorat`/`QTaxmin` (yopilmaydi — ixcham qator), to'rt harakat navbat bilan (faol tugma halqada, qolganlari xira), «Keyin» tugmasi 2-harakatdan keyin faollashadi, sahna o'zi kartani bosadi (1, 3-harakatdan keyin), ikki nom qatori (3 va 4-harakatdan keyin), hisoblagich, joriy qator, `zoom`, `tugadi`. Holat bosishlar ro'yxatidan (P-046).
6. **5-ekran `QTushuncha`:** `QBashorat`, kalit (yoqilganda sahna `kamaytirilgan`), «Qo'shilaman», `HARAKAT_HOLAT` jadvali — har qatorga muhr navbat bilan (60–120 ms; SABOQ 19), nom qatori, `QIzoh`, `zoom`, `tugadi`. Jadval — «Harakat · Holat», muhr «o'chdi» (`ink2`) / «qoldi» (`ok`, ✓).
7. **4 va 7-ekran `QTest`** — matn yuqoridagidek; javobdan keyingi kichik vizual (`QuestionScreen` `vizual`, SABOQ 4); to'g'ri izoh bitta qisqa gap, xato izohlari ≤60.
8. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (13-Modul 8-darsi naqshi): har blok **4 qadam**, hammasi o'quvchining o'z repo'sida. `{…}` joylari — A1: 4 (`{ilova papkasi}` oldindan), A2: 3 (`{ilova papkasi}` oldindan), A3: 3 (`{ilova papkasi}` oldindan); bo'sh joylar yonida kulrang «masalan»; «Yordam» — `YORDAM_A1…A3`; web gapi — «Yordam» ostida, trek `pm-m9d8-platforma` dan (yo'q — A1 tanlov tugmalari, dars holatida).
   - A1 1-qadam — namuna yozuv prompti («Nusxalash» bilan, `{namuna yozuv}`); A1 2-qadam — `{avvalgidek…}` tekshiruvi (kamida ikki ish, QXato 45). Har blok 3-qadamida kodni ko'rsatadigan prompt (SABOQ 52). DevTools yo'riqlari — oddiy matn (tugma emas).
   - A3 3-qadam — trekka qarab bitta yo'l ko'rinadi (mobil — `npx expo export -p web` → `netlify deploy --prod --dir dist`; web — Netlify o'zi). A3 `QIzoh` — faqat mobil trekda.
   - «Davom etish»: A1 — 3-qadamdan keyin · A2 — 3-qadamdan keyin · A3 — 4-qadamdan keyin (E 55; MD qarori). Blok bayrog'i — faqat 4-qadam «Bajardim»idan; har blok 4-qadamida tekshiruv kartasi «Kutilganidek» · «Boshqacha» — dars holatida (`ccProgress`), yangi `pm-…` kaliti yo'q.
   - «Ortda qoldingizmi» — faqat A1 da (SABOQ 39), teg `m14-dars-04-done`. `ACH_TRIGGERS`: 4 → Tap Echo · 7 → Still Shows · A2 4-qadam «Bajardim» → Grey Cards · A3 4-qadam «Bajardim» → Calm Mode.
   - ⚠️ Qolipda yo'q (12–13-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan to'ldirilgan qavs, qadam ichidagi «Yordam», «Ulgurmasangiz», O'qituvchi eslatmasi, tekshiruv kartasi, trek tanlov tugmalari — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
9. `RECAPS` 2 (kalit = 4 va 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 0·1·2·3 ×3) · flashcard 12 (`sflash`, Mentor yo'q, «Kartani bosing — javob ochiladi»; SABOQ 12, 16) · `QZ_BG_SHAPES` fon so'zlari {uz, ru}, emoji yo'q.
10. **11-ekran `QYakun`:** sarlavha — blok bayroqlari va tekshiruv kartalaridan (besh holat, ustunlik tartibi); ✓ yorliq faqat A3 bajarilganda; `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; `uyga: null`; `keyingi` — yuqoridagi matn. «Bugungi asosiy fikr» qutisi yo'q (E 50).
11. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). `narrow` faqat 4, 7, 9-ekranlarda (171).
12. **Darvozalar:** `npm run gates -- src/12-Modull/PolishDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda; haqiqiy click bilan har tugma (E 47).
    ⚠️ CSS izohida va matn konstantalarida backtik yo'q (CLAUDE.md). `{…}` qavslar — matn (prompt qavsi), JSX ifodasi emas.
13. ru — uz tasdiqlangach, bir yo'la (6-RU; «sayqal», «joy egallovchi» — tayanch 10 lug'atidagi taklif, RU bosqichida o'lchanadi; «Qo'shilmoqda…» — yangi).

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m14-dars-04-start` = `m14-dars-03-done` → `m14-dars-04-done`, tayanch 3) <!-- TAXMIN T4 -->
1. **Bosish javobi** (`mobil/` — «O'yin» ekrani): «Qo'shilaman» bosilishi bilan «Qo'shilmoqda…» + kichik kutish belgisi, tugma o'chiq; javob kelgach «Qo'shildingiz»; xatoda — yana «Qo'shilaman» va avvalgi xato xabari. Ikkinchi qo'shilish so'rovi yuborilmaydi (ilova tomonida). Backend o'zgarmaydi.
2. **Joy egallovchi** (`mobil/src/app/index.tsx` — «O'yinlar»): ro'yxat yuklanayotganda ikkita kulrang karta (o'yin kartasi o'lchamida, kulrang chiziqlar sokin miltillaydi), ostida kutish yozuvi (11-Modul 9.95, o'zgarmaydi); ro'yxat kelganda kartalar o'sha joyga; bo'sh ro'yxat va xatoda — avvalgi xabar.
3. **Muvaffaqiyat animatsiyasi** (`mobil/` — «O'yin»): qo'shilish muvaffaqiyatli bo'lganda son 0,3 soniya ichida biroz kattalashib qaytadi (bir marta); jonli son o'zgarganda — animatsiyasiz. Yangi kutubxona yo'q (loyihadagi vosita bilan).
4. **Harakatni kamaytirish:** `AccessibilityInfo.isReduceMotionEnabled()` va `reduceMotionChanged` (brauzer ko'rinishida — `prefers-reduced-motion`) — son kattalashmaydi, kulrang chiziqlar miltillamaydi, kutish belgisi aylanmaydi; holatlar harakatsiz almashadi.
5. **Yangi versiya:** brauzer ko'rinishi — `npx expo export -p web` → `netlify deploy --prod --dir dist`; APK bu tegda qayta tayyorlanmaydi (demo — brauzerda, tayanch 9.6; TAYANCHGA SAVOL 8). `README.md` — «Darslar va teglar» jadvaliga `m14-dars-04-done`.
6. ⛔ **Muhrdan oldin («qur» darvozasi):** Mentor brauzer ko'rinishida «Slow 4G» bilan uch joy · Rendering `prefers-reduced-motion: reduce` bilan uch joy (React Native Web o'qishi) · Expo Go'da (Android va iPhone) telefon sozlamasi bilan · kulrang kartalar soni va ko'rinishi Mentor ro'yxatiga mos ·
   `npx expo start` → `w` Mentor loyihasida ishlashi · uch blokning vaqti (taymer). Natija boshqacha chiqsa — MD va sahna haqiqiy natijaga moslanadi.

| Teg | Repo holati |
|---|---|
| `m14-dars-04-start` (= `m14-dars-03-done`) | 3-dars oxiri; «O'yinlar» da kutish yozuvi, «Qo'shilaman» — sayqalsiz |
| `m14-dars-04-done` | bosish javobi · joy egallovchi kartalar · muvaffaqiyat animatsiyasi + harakatni kamaytirish · yangi versiya (brauzer ko'rinishi) |

## Manbalar (o'zim tekshirdim, 08.10.2026; o'quvchiga ko'rinmaydi)
1. React Native — `reactnative.dev/docs/accessibilityinfo` (o'zim, 08.10.2026): `isReduceMotionEnabled()` — «Query whether reduce motion is currently enabled. Returns a promise which resolves to a boolean.» · `reduceMotionChanged` — «Fires when the state of the reduce motion toggle changes» (Android'da «Transition Animation Scale» … «Animation off» ham). Sahifada web haqida gap yo'q. → A-4, A3 Yordam, REPO 4, 5-ekran QIzoh.
2. React Native Web — `github.com/necolas/react-native-web`, `packages/react-native-web/src/exports/AccessibilityInfo/index.js` (o'zim, 08.10.2026; master): `isReduceMotionEnabled` va `reduceMotionChanged` — `window.matchMedia('(prefers-reduced-motion: reduce)')` orqali → brauzer ko'rinishida DevTools emulyatsiyasi mobil trek uchun ham ishlaydi (A3 4-qadam).
   MDN — `developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion` (o'zim, 08.10.2026): «used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion» · `reduce` — «the setting on their device for reduced motion» · «Such animations can trigger discomfort for those with vestibular motion disorders.» → 5-ekran O'qituvchi eslatmasi, kartochka 10.
3. Chrome DevTools — `developer.chrome.com/docs/devtools/rendering` va `…/rendering/emulate-css` (o'zim, 08.10.2026; sahifalar 13.04.2022 yangilangan): Command Menu — «Control+Shift+P» (Mac «Command+Shift+P») → «rendering» → «Show Rendering»; yoki «More Tools > Rendering» · «Emulate CSS media feature prefers-reduced-motion» → `prefers-reduced-motion: reduce`. → A3 4-qadam, arena 8.
4. Chrome DevTools — `developer.chrome.com/docs/devtools/network/reference#throttling` (o'zim, 08.10.2026; sahifa 16.07.2024 yangilangan): «Throttling» ro'yxati — «Fast 4G», «Slow 4G», «3G», «Offline»; «No throttling» — shu ro'yxatda. DevTools'ni ochish — `developer.chrome.com/docs/devtools/open` (03 pilot Manbalar 2: «F12 or Ctrl + Shift + I», Mac «Cmd + Option + I»). → A1, A2 4-qadam, arena 9, kartochka 11.
5. Expo CLI — `docs.expo.dev/more/expo-cli` (o'zim, 08.10.2026): `npx expo start` dan keyin «W» — «Open the project in a web browser» · «R» — «Reload the app on any connected device». → A-8, A1 3-qadam, A2 3-qadam.
6. Kursdagi so'zlar va Mentor holati (grep, 08.10): 9-Modul `05-Animation-v3.md` (animatsiya ta'rifi, «bosildi», «o'zgardi», «tayyor», 12-ekran «Harakatni kamaytirish», `prefers-reduced-motion` nom qatori) · 9-Modul `08-PmDesignMotion-v3.md` («kutish belgisi») ·
   11-Modul tayanchi 1.6 (prototip animatsiyasi), 2 / 228-qator (tugmalar «Qo'shilaman» → «Qo'shildingiz», «O'yindan chiqish»), 9.95 (kutish yozuvi matni, `mobil/src/app/index.tsx`, `m11-dars-15-done`) · 12-Modul tayanchi 9.5 (`namuna`), 9.28 (brauzer ko'rinishi buyruqlari), 9.44 c (jonli demo — namuna o'yin, «O'yindan chiqish») ·
   13-Modul tayanchi 3 (teglar, push odati) · 14-Modul pilotlari 03 (DevTools, «Ortda qoldingizmi»), 07 (A-3: 4-dars «bosish javobi», TS 15). → A-3, bloklar, kartochka 7.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Kutish yozuvi va joy egallovchi birga** — tayanch 1.4 «bo'sh ekran o'rniga kulrang kartalar» deydi, lekin Mentor ilovasida 11-Modul 15-darsidan beri «O'yinlar» da kutish yozuvi bor (9.95). Qaror: yozuv qoladi, kulrang kartalar uning ustida (yozuv — qancha kutish, kartalar — nima keladi). 2-ekran «Oldin» holati — oq maydon + kutish yozuvi.
   Muqobil — kulrang kartalar yozuv o'rniga (yozuv olib tashlanadi): 11-Modul kutish yozuvining sababi (Render uyg'onishi — bir daqiqagacha) yo'qoladi, shuning uchun olmadim.
2. **«Qo'shilmoqda…»** — kutish paytidagi tugma yozuvi (yangi; 12-Modul «Ulanmoqda…» naqshi) + kichik kutish belgisi; javobdan keyin «Qo'shildingiz» (11-Modul). Xatoda — yana «Qo'shilaman» va ilovadagi avvalgi xato xabari (yangi xabar matni yo'q).
3. **Kulrang kartalar soni — ikkita** (Mentor talabi va sahna); Mentor ro'yxatidagi o'yinlar soni tayanchda yo'q — sahnada bitta karta keladi, ikkinchi kulrang karta so'nadi (sahna namunasi). O'quvchi talabida «ikkita» — tayyor qism; o'quvchi o'zgartirishi mumkin.
4. **Muvaffaqiyat animatsiyasi** (Mentor): son 0,3 soniya ichida biroz kattalashib qaytadi, bir marta; jonli son (boshqa odam qo'shilgani) o'zgarganda animatsiya yo'q — muvaffaqiyat o'z harakatiga javob. «0,3 soniya» — dizayn qiymati (9-Modul `transition` naqshi), statistika emas; tayanch 1.14 ga kirmaydi deb oldim.
5. **Kulrang chiziqlar «sokin miltillaydi»** — joy egallovchining o'zi ham animatsiya; harakat kamaytirilganda to'xtaydi (5-ekran jadvali, A3 talabi). Tayanchda miltillash yo'q — qo'shmasa ham bo'ladi (unda 5-ekran jadvali besh qatorga tushadi).
6. **Tekshiruv asbobi — Chrome DevTools** (Network «Slow 4G», Rendering `prefers-reduced-motion: reduce`) — tayanchda tekshiruv yo'li aytilmagan; rasmiy hujjatdan (Manbalar 3, 4). Telefon sozlamasi bilan tekshirish — ixtiyoriy, menyu nomisiz.
7. **Mobil trekda brauzerda ko'rish — `npx expo start`, keyin `w`** (Expo CLI, Manbalar 5) — kursda bu yo'l ilgari ishlatilmagan (12-Modul faqat `npx expo export -p web` + Netlify). Rad etilsa — A1, A2 tekshiruvi ham Netlify'dagi brauzer ko'rinishida (har blokda eksport — vaqt ko'payadi).
8. **APK bu darsda qayta tayyorlanmaydi** — demo brauzerda (tayanch 1.6, 9.6: ikkinchi qurilma ham telefon brauzeri); 3-dars A3 da APK bor edi. A3 `QIzoh` (mobil): «APK o'zi yangilanmaydi — bugun demo brauzer ko'rinishida tekshirildi.»
9. **Namuna yozuv** (A1 1-qadam) — real odamlar qo'shilmagan o'yin bo'lmasa, agent `namuna = true` yozuv ochadi va **o'chirilmaydi** (demo uchun ham kerak bo'lishi mumkin — 6-dars «ro'yxat bo'sh» riski, tayanch 1.6). 7-dars tekshiruv akkauntidan farqi — bu yozuv sanoqqa kirmaydi va qoladi. O'chirish kerak bo'lsa — 6-dars qarori.
10. **Backend'ga tegilmaydi** — uch joy ham ilova tomonida; ikkinchi qo'shilish so'rovi ilova tomonida to'xtatiladi (Backend'dagi takror himoyasi — bu darsda yo'q; 7-dars ikki marta bosishni demo sharoitida ko'radi).
11. **Bloklar tartibi** — tayanch 1.4 (bosish · yuklanish · muvaffaqiyat), demo yo'li esa ekranlar tartibida (yuklanish · bosish · muvaffaqiyat). Reja va bloklar — tayanch tartibida (App.jsx osti), sahnadagi chiziq — ekranlar tartibida.
12. **Nishonlar:** Tap Echo · Still Shows · Grey Cards · Calm Mode (grep 0); ikki blok nishoni — ish uchun (13-Modul 8-dars naqshi, M-q6 A).
13. **Yakun — besh holat** (uchala «Kutilganidek» · «Boshqacha» bor · 1–2-blok · qisman · hech narsa); «hech narsa» — «1-amaliyotdan boshlang» (loyiha kunida «uyda» yo'q).
14. **2-savol** — «Mentor misolida» bilan (talab shunday yozilgan); boshqa ilovada animatsiya boshqacha bo'lishi mumkin — savol Mentor talabiga bog'langan.
15. **1-savoldagi ikkinchi misol** — uy vazifalari ilovasi, «Yuborish» va «Yuborilmoqda…» (P-002; 13-Modul TAQIQLAR 4 ro'yxatidan).
16. **«demo yo'li»** — bu darsdagi so'z (hakam ko'radigan ekranlar va bosishlar); 6-darsdagi «demo stsenariysi» bilan bir ma'noga o'tmasligi uchun bu darsda «stsenariy», «demo o'tishi» ishlatilmadi. 6-dars agenti «demo yo'li» ni qanday ishlatishi — to'lqin kelishuvi kerak bo'lishi mumkin (07 pilot ham «demo yo'li» ishlatgan).

## Shubhali joylar (ishonchim komil emas)
**⛔ «qur» darvozasi (pilotda sinaladi — o'lchanmaguncha da'vo emas):**
1. ⛔ **90 daqiqa** — uch blok, har birida agent kutishi va DevTools tekshiruvi; 3-amaliyotda `netlify deploy`. Pilotda taymer; sig'masa — A-10 qisqartirish.
2. ⛔ **Mentor sayqalining haqiqiy ko'rinishi** — kulrang kartalar, kutish belgisi, son animatsiyasi Mentor repo'sida (`m14-dars-04-done`) agent qilganidan; sahna shunga moslanadi.
3. ⛔ **Expo Go'da harakatni kamaytirish** — `AccessibilityInfo` telefon sozlamasini o'qiydi (rasmiy), lekin React Native'ning o'z kutish belgisi (masalan `ActivityIndicator`) sozlamada to'xtaydimi — tekshirilmagan; talab «aylanmasin» deydi, agent yo'lini o'zi tanlaydi.
4. ⛔ **`npx expo start` → `w`** — Mentor loyihasida web ochilishi (rasmiy hujjatda «may require webpack» eslatmasi bor; loyihada `npx expo export -p web` ishlaydi — 12-Modul). Ishlamasa — Netlify'dagi brauzer ko'rinishi.
5. ⛔ **DevTools UI nomlari** («Network», «Slow 4G», «No throttling», «Show Rendering», «Emulate CSS media feature prefers-reduced-motion», «No emulation») — rasmiy hujjatdan (Manbalar 3, 4), lekin Chrome versiyasiga qarab o'zgarishi mumkin; «No emulation» yozuvi hujjatda aniq ko'rilmadi.
6. ⛔ **Emulyatsiya va sahifani yangilash** — Rendering emulyatsiyasi DevTools ochiq turganda yangilangan sahifada saqlanadi deb oldim; ilova sozlamani faqat ochilishda o'qisa — yangilash shart (talabda `reduceMotionChanged` bor).

**Boshqa shubhalar:**
7. **«Slow 4G» bilan ham javob tez kelishi** — sinf internetiga bog'liq; «3G» — zaxira (A2 O'qituvchi eslatmasi).
8. **Kulrang kartalar o'quvchi ro'yxatidagi yozuvlar sonidan ko'p bo'lsa** — ortiqcha kulrang karta so'nadi; pastda boshqa element bo'lsa, u siljishi mumkin. Talab «boshqa narsalar siljimasin» deydi — agent yechimi (masalan balandlik) pilotda ko'riladi.
9. **Web-trek o'quvchisida Motion** (11-Modul prototipi) — bor bo'lsa agent shu bilan qiladi; yo'q bo'lsa CSS `transition` (9-Modul). «Yangi kutubxona qo'shma» ikkala holatda ham to'g'ri.
10. **Telefonda «Harakatni kamaytirish» sozlamasini o'quvchi qayerdan topadi** — menyu nomi yozilmadi (P-028); darsdagi asosiy tekshiruv — DevTools.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔ pilot taymeri; A-10 (qisqartirish tartibi); har blokda «Ulgurmasangiz»; Backend o'zgarmaydi — Render kutishi yo'q; «sig'adi» deyilmagan (Shubhali 1).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — DevTools UI nomlari rasmiy hujjatdan (Manbalar 3, 4) + ⛔ Chrome versiyasi (Shubhali 5); Expo `w` — rasmiy + ⛔ (4); Expo Go'dagi harakatni kamaytirish — ⛔ (3); telefon sozlamasi — menyu nomisiz; Netlify — 12-Modul buyruqlari.
3. [x] **Saqlash kaliti — shartnoma** — yangi kalit yozilmaydi (tayanch 4, 8); o'qiydi faqat `pm-m9d8-platforma.trek`; blok holati, tekshiruv kartalari, trek tanlovi — dars holatida; boshqa darsning kalitiga yozilmaydi; ism, login, manzil yozilmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (0, 2, 7-ekran, kartochka 2, 4, 7, 8, bloklar «Ochish»), «Bu misolda» (2-ekran xulosa); uch joy — o'quvchi o'z tugmasi, ro'yxati va muvaffaqiyat joyini tanlaydi (`{…}`); «Qo'shilmoqda…» — namuna.
5. [x] **Kafolat va sabab da'vosi yo'q** — «demo buzilmaydi», «yarqiraydi», «tezlashdi» yo'q; sayqal kutishni qisqartirmaydi (2-ekran QIzoh, A2 QIzoh, kartochka 7); agentning «tayyor» degani — da'vo (A1 QIzoh, arena 12); kulrang kartalar tez internetda ko'rinmasligi ham to'g'ri (A2); kafolat so'zlari o'quvchi matnida 0 (O'lchov).
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — 11-ekran besh sarlavha (hech narsa holati alohida); ✓ yorliq faqat A3 bajarilganda; blok bayrog'i 4-qadamdan; yashil qator faqat «Kutilganidek» da; Grey Cards, Calm Mode — «tekshirdingiz».
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — bosish javobi: «bosilishi bilan … javob kelguncha qayta bosilmaydi» — o'quvchi tez ikki marta bosib ko'radi; joy egallovchi: «haqiqiy karta o'lchamida … siljimaydi» — ko'z bilan; harakat kamaytirilgan holat — Rendering emulyatsiyasi bilan.
8. [x] **Test: bitta himoyalanadigan javob** — 1-savol: D hayotda ham yaxshi javob emas (✎); 2-savol: «Mentor misolida» bilan bog'langan (TS 14); distraktorlar uch turkumdan; uzunlik ±15% (O'lchov); ✔ yolg'iz eng uzun emas; arena 8, 9 — to'rt bo'lim ham haqiqiy, bittasi to'g'ri.
9. [x] **Real odamlar xavfsizligi** — tekshiruv faqat real odamlar qo'shilmagan o'yinda, keyin «O'yindan chiqish» (A-9, A1, 1-ekran eslatmasi); namuna yozuv `namuna = true`, haqiqiy yozuvlarga tegilmaydi; hakam — ismsiz, gapsiz, fikri o'ylab topilmaydi (0-ekran ✎); sinfda animatsiyalar solishtirilmaydi (A3 eslatmasi).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — uch joyni o'quvchi DevTools bilan o'zi ko'radi; agent faqat kodni yozadi va namuna yozuvni ochadi; «Boshqacha» → agentga aniq gap.
11. [x] **Web-trek teng yo'l** — har blokda `{ilova papkasi}` trekdan, web gapi «Yordam» ostida; web tekshiruvi — `npm run dev` va o'sha DevTools; harakatni kamaytirish — `prefers-reduced-motion` (9-Modul); yangi versiya — Netlify o'zi; sarlavhalar ikkala trekka to'g'ri.
12. [x] **Mentor misoli ichki izchil** — «8 / 10» → «9 / 10», «Qo'shilaman» / «Qo'shildingiz», kutish yozuvi — oldingi modullardan aynan; 6, 7-darslar natijasi ochilmagan (ikki marta bosishning demo sharoiti — 7-dars, va'da qilinmagan); yangi tafsilotlar — TAYANCHGA SAVOL 1–5.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — A1: tugma, kutish yozuvi, nima buzilmasin · A2: ro'yxat ekrani, karta tarkibi · A3: muvaffaqiyat joyi, harakat shakli — `{…}` da; Mentor qarorlari faqat «Yordam»da va kulrang namunada.
14. [—] **Uyga vazifa yengil va aniq** — loyiha kuni, uyga vazifa yo'q; ulgurmagan ish — yakun sarlavhasida («1-amaliyotdan boshlang»), «uyda» yo'q.
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …»; «xatongiz emas», «sizda emas» — 0.
16. [x] **Kelajak va'dasi yo'q** — «demo buzilmaydi», «hakamga yoqadi» yo'q; 5–7-darslar aytilmaydi; kelajak — faqat yakundagi «Keyingi dars» qatori.
17. [—] **Pul va investitsiya** — bu darsda pul yo'q (Pro, to'lov demo yo'lida tilga olinmaydi).
18. [—] **Yosh va rasmiy shartlar** — xalqaro sayt va dastur yo'q; tashqi asboblar (Chrome DevTools, Expo, React Native) — faqat rasmiy hujjatdagi faktlar (Manbalar 1–5).
+ **Tashqi auditda RAD etilganlar** — hook «Aynan!» / «Qiziq fikr!» saqlangan [x] · yakundagi «Keyingi dars — «…»» qatori [x] · Reja sarlavhasi — natija-gap [x] · ekranda ≤3 blok [x] · bank so'zi — keyssiz [—].
+ **12-Modul SABOQ E** — har variantning o'z chegarasi (0, 2, 5) [x] · maketda kesilmaydi (brauzer o'lchami barqaror) [x] · taxmin qatori yashil xulosa ichida (2, 5) [x] · yorliq input ichida [—] (forma yo'q — prompt qavslari) · bittadan karta [—] (ko'p maydonli forma yo'q) · yakun standart [x] · sarlavha har holatda rost [x].

## O'lchov (scratchpad `m14/md04/olchov.py`, 08.10.2026; yakuniy fayl bo'yicha)
Belgilar — oddiy `len` (`**`, ✔ va HTML izohsiz). `!!!` — chegaradan oshgan joy: yakuniy yurishda **0** (oldingi yurishlarda topilganlari tuzatildi: 2 sarlavha (56, 57) · 1 to'g'ri izoh (61) · 1-savolda va arenaning 2, 4, 7-savolida to'g'ri variant yolg'iz eng uzun edi · arena 2 da og'ish 23% — variantlar tenglashtirildi; qavsdagi belgilar soni skript natijasiga moslandi).
Ballik testlar ±15%, arena ±15% maqsad (±20% chegara). Mentor gaplari — «…» ichidagi nuqta sanalmaydi; interaktiv ekranlarda bitta gap. Kafolat va taqiq so'zlari — KOD bo'limidan oldingi butun matnda (o'quvchi matni + MD izohlari; 53, 55-qatordagi «sinov», «tezlashdi» — A-5 «Ishlatilmaydi» ro'yxati).
Mexanik tekshiruv (`vositalar/mdtekshir.py`): ekran 12/12 · arena A3 B3 C3 D3 · uzun yo'q · keyingi dars ✓ · `lint:til` 0 error, 0 warn; taqiq naqshlari faqat meta bo'limlarda (A-5, kartochka «Inglizchasi», sinflar ro'yxati, KOD).

```
## Sarlavhalar (≤55)
   48     Tugmani bosgach, ekranda birinchi nima o'zgardi?
   54     Bugun demo yo'lingizdagi uch joy hakamga javob beradi.
   46     Yangi ekransiz demo yo'li qanday yaxshilanadi?
   50     Tugma bosilishi bilan o'zgarsin, qayta bosilmasin.
   42     Harakat kamaytirilsa, ekranda nima qoladi?
   50     Ro'yxat kelguncha o'rnida kulrang kartalar tursin.
   49     Natijada ekran kichik harakat bilan javob bersin.
   25     O'zingizni sinab ko'ring.
   47     Demo yo'lidagi uch joy o'zgardi va tekshirildi.
   41     Sayqal qilindi — tuzatiladigan joy qoldi.
   48     Bosish va yuklanish tayyor — muvaffaqiyat qoldi.
   48     Sayqal boshlandi — qolgan joylar hali tugamagan.
   52     Demo yo'li hali sayqallanmagan — bloklarni bajaring.
## Xulosalar (≤110)
  102     Bu misolda yangi ekran ham, tugma ham qo'shilmadi: bosish, yuklanish va natija endi ekranda ko'rinadi.
   86     Harakat kamaytirilsa, animatsiya o'chadi: yozuv, kulrang kartalar va yangi son qoladi.
## Hook javoblari (≤120)
   99     Aynan! Bir lahza ekran jim turdi: bosilgani ham, kutish ham ko'rinmadi — son keyin birdan almashdi.
   82     Qiziq fikr! Tugma faqat son almashganda o'zgardi — undan oldin u avvalgidek turdi.
   74     Qiziq fikr! Kutish belgisi chiqmadi — ekran javob kelguncha bir xil turdi.
## To'g'ri izohlar (bitta gap, ≤60)
   56     Bosilgani shu zahoti ko'rinadi, ikkinchisi yuborilmaydi.
   52     Animatsiya o'chadi, yangi son esa baribir ko'rinadi.
## Xato izohlari (≤60)
   43     A: Bir lahza jim tugmani odam yana bosmaydimi?
   48     B: Bitta vazifa ikki marta yuborilsa, nima bo'ladi?
   47     D: Ekran almashsa, yuborilganini qayerdan bilasiz?
   46     A: Animatsiya o'chdi. Holat ham o'chishi kerakmi?
   51     C: Kattalashish — animatsiya. Sozlama uni qoldiradimi?
   43     D: Sozlama harakatga tegadi, yangilashga emas.
## Joriy / QIzoh / yashil / shart qatorlari (≤110)
   74     nom: Yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl — joy egallovchi.
   59     nom: Demo yo'lidagi shunday kichik o'zgarishlar sayqal deyiladi.
   63     Joriy qator : Ekranlar va tugmalar o'sha — o'zgargani uch joyning ko'rinishi.
   67     Qator (`QIzo: Sayqal kutishni qisqartirmaydi — ekran kutish borligini ko'rsatadi.
   49     QXato: Ikkita aniq ish yozing: masalan, kirish, ro'yxat.
   64     kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.
   66     Hammasi baja: Tugma bosilishi bilan o'zgaradi; javob kelguncha qayta bosilmaydi.
   78     Qator (`QIzo: Agentning «tayyor» degani — da'vo; tugmani sekin tarmoqda o'zingiz ko'rdingiz.
   79     nom: Qurilmada harakat kamaytirilganini sayt `prefers-reduced-motion` orqali biladi.
   59     Qator (`QIzo: Telefondagi ilova bu sozlamani telefonning o'zidan o'qiydi.
   64     kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.
   70     Hammasi baja: Ro'yxat kelguncha kulrang kartalar turdi; kartalar o'sha joyga chiqdi.
   69     Qator (`QIzo: Kulrang kartalar kutishni qisqartirmaydi — nima kelishini ko'rsatadi.
   64     kulrang: Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.
   68     Hammasi baja: Natijada kichik animatsiya bor; harakat kamaytirilganda holat qoldi.
   69     Qator (`QIzo: APK o'zi yangilanmaydi — bugun demo brauzer ko'rinishida tekshirildi.
## Reja qatorlari
   39     Bosish: tugma bosilishi bilan o'zgaradi
   43     Yuklanish: ro'yxat o'rnida kulrang kartalar
   48     Muvaffaqiyat: son kichik harakat bilan o'zgaradi
## Mentor gaplari (gap soni · belgi)
  1 gap ·  87  Hakam demoni proyektorda kuzatadi — sahnadagi «Qo'shilaman»ni bosing va ekranga qarang.
  1 gap ·  79  Bugun hakam ko'radigan shunday joylar bilan ishlaysiz — «Davom etish»ni bosing.
  1 gap · 109  Yangi funksiya qo'shmaysiz — hakam ko'radigan ekranlardagi uch joyni o'zgartirasiz, namuna «Yordam»da turadi.
  1 gap ·  65  Avval taxminingizni belgilang, keyin sahnada «O'yinlar»ni oching.
  1 gap ·  45  Endi «O'yin» ekranida «Qo'shilaman»ni bosing.
  1 gap ·  68  Endi tepadagi «Keyin»ni bosing — Mentor o'zgartirgan ilova ochiladi.
  1 gap ·  43  Endi «Qo'shilaman»ni yana bir marta bosing.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap ·  92  Talab tayyor — demo yo'lingizdagi asosiy tugmani o'zingiz yozasiz; «1 · Ochish»dan boshlang.
  1 gap ·  86  9-Modulda «Harakatni kamaytirish» kalitini ko'rgansiz — avval taxminingizni belgilang.
  1 gap ·  54  Endi o'ngdagi «Harakatni kamaytirish» kalitini yoqing.
  1 gap ·  66  Endi «O'yin» ekranida «Qo'shilaman»ni bosing va jadvalni kuzating.
  1 gap ·  40  Natijani taxminingiz bilan solishtiring.
  1 gap · 103  Kulrang kartalar ro'yxatingiz kartalariga o'xshasin — namuna «Yordam» ortida; «1 · Ochish»dan boshlang.
  1 gap ·  86  Animatsiya qisqa bo'lsin va harakat kamaytirilganda o'chsin; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  Uy vazifalari ilovasida «Yuborish» sekin javob beradi. Tugma nima qilsin? · 10 so'z · [44, 41, 42, 42] · ✔C · og'ish 4% OK
      A   44  Javob kelguncha o'zgarmay, avvalgidek tursin
      B   41  Har bosilganda vazifani qaytadan yuborsin
      C✔  42  Bosilishi bilan o'zgarib, qayta bosilmasin
      D   42  Bosilganda boshqa ekranga o'tib ketaversin
  Mentor misolida telefonda harakat kamaytirilgan. Qo'shilgach son qanday o'zgaradi? · 9 so'z · [39, 37, 36, 36] · ✔B · og'ish 5% OK
      A   39  O'zgarmaydi — animatsiya o'chgani uchun
      B✔  37  Harakatsiz almashib, «9 / 10» bo'ladi
      C   36  Kattalashib qaytib, «9 / 10» bo'ladi
      D   36  Faqat sahifa yangilanganda o'zgaradi
## Arena (12) — ✔ o'rni va uzunliklar (±15% maqsad, ±20% chegara)
   1. ✔A · 8 so'z · [33, 36, 31, 37] · og'ish 9% OK  Bu darsda demo yo'lidagi qaysi uch joy o'zgaradi?
   2. ✔B · 6 so'z · [33, 35, 34, 35] · og'ish 4% OK  Sayqaldan keyin demo yo'lida nima o'zgaradi?
   3. ✔C · 7 so'z · [37, 34, 36, 32] · og'ish 8% OK  Javob sekin kelsa, «Qo'shilaman» bosilgach qanday turadi?
   4. ✔D · 4 so'z · [37, 33, 31, 34] · og'ish 10% OK  Joy egallovchi qayerda turadi?
   5. ✔A · 7 so'z · [34, 34, 32, 33] · og'ish 4% OK  Kulrang kartalar nega haqiqiy karta o'lchamida bo'ladi?
   6. ✔B · 7 so'z · [30, 34, 33, 37] · og'ish 10% OK  Kutish yozuvi bo'lsa, kulrang kartalar nima beradi?
   7. ✔C · 6 so'z · [37, 36, 36, 32] · og'ish 9% OK  Harakat kamaytirilgan qurilmada sayqaldan nima qoladi?
   8. ✔D · 5 so'z · [29, 32, 30, 31] · og'ish 5% OK  Harakat kamaytirilganini DevTools'da qayerda tanlaysiz?
   9. ✔A · 6 so'z · [30, 32, 31, 30] · og'ish 4% OK  Ro'yxat sekin kelishini DevTools'da qanday ko'rasiz?
  10. ✔B · 5 so'z · [34, 34, 33, 31] · og'ish 6% OK  Muvaffaqiyat animatsiyasi qanday bo'lishi kerak?
  11. ✔C · 6 so'z · [31, 31, 30, 32] · og'ish 3% OK  Animatsiya uchun nega yangi kutubxona qo'shilmaydi?
  12. ✔D · 4 so'z · [33, 31, 34, 32] · og'ish 5% OK  Sayqal ishlashini qanday bilasiz?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Kafolat va taqiq so'zlari (KOD dan oldingi butun matn)
  24 naqsh (T-020 kafolat so'zlari · kelajak va'dasi · ayb gapi · TAQIQLAR 5 taqiq so'zlari · «Demo Day»): o'quvchi matnida 0.
  Meta: «sinov» — 53, 55-qator; «tezlashdi» — 55-qator (A-5 «Ishlatilmaydi» ro'yxati).
## Ekranlar
  12 ekran
   0 · Kirish — tugma bosildi, ekran jim  ← QKirish
   1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari)
   2 · Demo yo'li: oldin va keyin  ← QTushuncha (bashorat + 4 harakat)
   3 · Amaliyot 1 — bosish javobi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
   4 · 1-savol ✔ (jonli ball)  ← QTest
   5 · Harakat kamaytirilsa  ← QTushuncha (bashorat + 2 harakat; solishtirish jadvali — P-057)
   6 · Amaliyot 2 — yuklanish holati  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈18 daq)
   7 · 2-savol ✔ (jonli ball)  ← QTest
   8 · Amaliyot 3 — muvaffaqiyat, harakat kamaytirilgan holat va yangi versiya  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
   9 · Natijalar (podium) — umumiy shablon
   10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
   11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50)
```

## TAXMIN belgilari
Jami 23 ta `<!-- TAXMIN Tn -->` belgisi (qavsda — nechta joyda). Qaror-0 javobi boshqacha bo'lsa — aynan shu joylar tuzatiladi.
- **T4** (4) — teglar `m14-dars-04-start` / `-done`, «Ortda qoldingizmi» birinchi blokda — A-1 · 1-ekran pastki qatori · 3-ekran (Amaliyot 1) «Ortda qoldingizmi» · REPO sarlavhasi
- **T7** (8) — sayqal joylari: bosish javobi · yuklanish holati (joy egallovchi) · muvaffaqiyat; reduced-motion; yangi funksiya yo'q — sarlavha bloki (chegara) · A-1 · A-4 · 1-ekran (tayyor holat, uch qator) · 3-ekran ✎ (ikki marta bosish va 7-dars) · 6-ekran vazifa · 8-ekran vazifa
- **T8** (4) — demo laptop brauzerida, proyektorga (mobil trekda — brauzer ko'rinishi) — ip · bitta vizual (yorliq «laptop · proyektorga») · 0-ekran Mentori · 8-ekran 4-qadam (hakam ko'radigandek tekshirish)
- **T19** (3) — atamalar: sayqal (polish), joy egallovchi (skeleton) — A-5 · 2-ekran ikki nom qatori
- **T20** (4) — dars nomlari — sarlavha qatori · menyu qatori · ip «Yakun» · yakun «Keyingi dars»
- Ishlatilmagan: T1–T3, T5, T6, T9–T18 (pitch, tezlik o'lchovi, 6/9-dars shakli, demo o'tishi, video, frilans, dasturlar — bu darsga tegmaydi). T10 («demo o'tishi») ataylab ishlatilmadi — 6-dars so'zi (TAYANCHGA SAVOL 16).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 469–471 (grep 08.10) — `m12-03` «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» → **`m12-04` «Loyiha kuni: demo uchun sayqal»** (osti «demo yo'lidagi uch joy: bosish, yuklanish, muvaffaqiyat» — 1-ekran uch qatori shu tartibda) →
  `m12-05` «Guruh pitchingizda nimani tuzatishni aytadi?» (yakundagi «Keyingi dars» qatori; `mdtekshir.py` ✓). `comp` — «qur» da (asosiy seans).
- [x] Bitta misol-ip («Maydon Jamoa», namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10»); ikkinchi misol faqat 1-savolda (uy vazifalari ilovasi — P-002); metafora yo'q; keyssiz; bitta vizual — `SayqalSahna` (brauzer «laptop · proyektorga» + demo yo'li chizig'i; 5-ekranda kalit va jadval — o'sha sahna); o'quvchining o'z mahsuloti — uch blok.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0 («Qo'shilaman» → jim ekran → son birdan) · 2 (to'rt harakat: «Oldin» yo'li → uch qizil nuqta · «Keyin» → kulrang kartalar, «Qo'shilmoqda…», son animatsiyasi → uch yashil nuqta) · 5 (kalit → jadvalga «o'chdi / qoldi» muhrlari); testlarda javobdan keyingi kichik vizual. Matn-karta bilan almashtirilgan harakat yo'q (P-067).
  Bashoratlar tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor aynan shu harakatni aytadi (SABOQ 11, 19–30; E 40).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri va xato izohi ≤60 — «O'lchov» (eng uzun: sarlavha 54, xulosa 102, hook javobi 99, to'g'ri izoh 55, xato izohi 51).
- [x] Atamalar oldingi darslar bilan bir xil (grep): animatsiya, ortiqcha harakat, «Harakatni kamaytirish», `prefers-reduced-motion`, kutish belgisi — 9-Modul · «Qo'shilaman» / «Qo'shildingiz», «O'yindan chiqish», kutish yozuvi — 11-Modul · brauzer ko'rinishi, `namuna`, namuna o'yin — 12-Modul ·
  yangi: sayqal, joy egallovchi (tayanch 2 ta'rifi aynan), bosish javobi — hodisadan keyin; siz-forma; tugma va yorliqlar ot-shaklda («Oldin», «Keyin», «Qo'shilmoqda…», «Kutilganidek»); agent promptlari — buyruq shaklida (T-002); «sinov», «demo o'tishi», «demo stsenariysi» o'quvchi matnida yo'q.
- [x] Testlar: variantlar bir shaklda, uzunligi ±15% (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z / tire / qo'shtirnoq faqat to'g'rida emas · ✔: s4 C · s7 B · arena A·B·C·D ×3 (A B C D aylanma) · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [—] Final: tartib-mashqi yo'q (loyiha kuni, 172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (skript grep: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «bir zumda», «kafolat» — KOD dan oldingi matnda 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — o'quvchiga «1-amaliyot»; `m12-04`, «Modul 14», «pilot», «TAXMIN», «keys», polish/skeleton — faqat kartochkada «Inglizchasi»); modul raqami LMS bo'yicha («9-Modulda», «11-Modulda», «3-darsda»); tarixiy voqea yo'q; «KOD» (13 band) va «REPO» (6 band + jadval) to'liq.
- [x] Karta T · P · S (+ PM) ko'rildi: T-002 · T-008 (tugma yozuvlari, kutish yozuvi — olam matni) · T-009 · T-010 · T-011 (joy egallovchi, sayqal — 2-ekranda harakatdan keyin; bosish javobi — 1-amaliyotda; sarlavhalarda yangi atama yo'q) · T-014/015 («demo» — demo yo'li ma'nosida; «sinov» yo'q; «holat» — ekran holati) ·
  T-016/017 (metafora yo'q) · T-024 · T-029 (Mentor «Bu…» bilan boshlanmaydi) · T-033 (DevTools, Network, Rendering — UI nomi) · T-039 («demo yo'lingiz», «mahsulotingiz» — bor) · T-042 (ta'rif yadrosi so'zma-so'z) · T-043 («Bu misolda», «Mentor misolida») · T-045 (sayqal tezlikni oshirmaydi — ochiq) · T-047 · T-048 · T-049 · T-052 · T-064 · T-066 · T-070 ·
  P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-021 · P-026 (xato yo'li har blokda) · P-028 (DevTools va Expo — rasmiy hujjat; telefon menyusi yozilmadi) · P-036 · P-046 · P-048 · P-052 · P-057 (5-ekran jadvali) · P-059 · P-062 · P-063 (`SAYQAL_SAHNA`, `HARAKAT_HOLAT`, `KUTISH_YOZUVI`) · P-064 · P-067 ·
  S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-019 · S-020 · S-026 · S-040 · PM-030 · SABOQ 6, 9, 11, 12, 16, 17, 19–31, 36, 39, E 40–55.
- [x] Tekshiruv: `npm run -s lint:til -- feedback/F-1008-14modul/04-PolishDay-v3.md` — **0 error, 0 warn** (avvalgi yurishda 4 error va 2 warn — tanlov tugmasi so'zi, taqiq so'z, buyruq shakli izohi, ruscha so'z — tuzatildi).
- [x] Halollik va xavfsizlik (TAQIQLAR 1–3; tayanch 1.0, 1.4): yangi funksiya yo'q; Backend'ga tegilmaydi; tekshiruv faqat real odamlar qo'shilmagan o'yinda, «O'yindan chiqish» bilan; Mentor sayqalining haqiqiy ko'rinishi — ⛔ pilot; yangi son yo'q; «demo buzilmaydi», «tezlashdi» yo'q.
