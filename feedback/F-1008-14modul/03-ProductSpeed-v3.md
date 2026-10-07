# 14-Modul · 3-dars «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» — MD v3 (yangi dars, TEX — modulning texnik cho'qqisi) <!-- TAXMIN T20 -->

Fayl: `src/12-Modull/ProductSpeedLesson.jsx` (kalit `m12-03`, App.jsx `type: 'Kod'`) · **19 ekran** (13 dars ekrani + 3 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, keyssiz (tayanch 5). Qolip: texnik dars (QKirish, QReja, QTushuncha, QTest, QKod, QTartib) + 3 amaliyot bloki (QBlok). Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx `m12-03`, 469-qator): «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz» · osti «Lighthouse, rasmlar va yuklanadigan kod hajmi — oldin va keyin» · <!-- TAXMIN T20 -->
oldingi `m12-02` «Mahsulotingiz hikoyasini qanday aytasiz?» · keyingi `m12-04` «Loyiha kuni: demo uchun sayqal».
Namuna (tuzilish, hajm): 13-Modul `03-PaymentWebhook-v3.md` + `03-FILTR.md` (TEX cho'qqi shakli, sahna, kod oynasi, bloklar, halol talab) · 12-Modul `02-WebSocketBasics-v3.md` (TEX, kod oynasi) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · ko'p maydonli forma — bitta karta, yorliq input ichida (E 43) · odamlar chizilmaydi.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 3-ekran **B** · 6-ekran **D** · 8-ekran **A** · 10-ekran **C** · 12-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2–3 ≈ 7 · 4–6 ≈ 10 · 7–8 ≈ 6 · 9–10 ≈ 7 · 11 (kod oynasi) ≈ 8 · 12 ≈ 3 · A1 ≈ 15 · A2 ≈ 16 · A3 ≈ 10 · podium, kartochkalar, yakun ≈ 3 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (uch blokda uch tashqi kutish bor: Lighthouse o'lchovi, Netlify yangilanishi, kod hajmi buyrug'i); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 11-band.
⚠️ **Sonlar chegarasi (tayanch 1.3, 1.14; T6) — har ekranga tegadi:** Mentor misolining Lighthouse bahosi, LCP, CLS, TBT va kod hajmi — **⛔ pilotda o'lchanadi**; MD da faqat `{…}` joy, son to'qilmaydi. Dars sahnasidagi hamma son — yo `{…}` (Mentor o'lchovi, «qur» da), yo rasmiy chegara (0–49 · 50–89 · 90–100; 2,5 soniya; 0,1; 200 ms — Manbalar). <!-- TAXMIN T6 -->
«Tezlashdi» so'zi o'quvchi matnida faqat oldin va keyin soni bilan turadi; hech bir ekran «mahsulot tezlashadi» deb va'da qilmaydi (TAQIQLAR 1, sinf 5).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.3):** dars oxirida o'quvchining o'z repo'sida `TEZLIK.md` — o'z lendingining Lighthouse o'lchovi (Mobile rejimi) va ilovasining yuklanadigan kod hajmi **oldin va keyin**; orada ikki tuzatish qilingan (rasmlar · keraksiz kutubxona yoki fayl) va yangi versiya chiqarilgan. <!-- TAXMIN T5 -->
   Natija darsda saqlanadi: `pm-m12d3-tezlik` (12-band). Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m14-dars-03-done` (`m14-dars-03-start` = `m14-dars-02-done` = `m14-dars-01-start` = `m13-dars-12-done`, tayanch 3). <!-- TAXMIN T4 -->
   Yangi funksiya qo'shilmaydi (tayanch 1.0) — o'quvchi matnida (A2 1-qadam): «Bugun ilovaga yangi narsa qo'shilmaydi: agent «yana bir narsa qo'shay» desa — «Yo'q, faqat talabdagi ish» deng.»
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** Tezlik his bilan emas, o'lchov bilan bilinadi: Lighthouse bahosi va uch son (LCP, CLS, TBT) sahifa qayerda sekinlashganini ko'rsatadi; tuzatishdan keyin xuddi shu sharoitda qayta o'lchab, farq son bilan aytiladi.
3. **Oldingi darslardan keladigan narsa (aynan):**
   - 12-Modul 1-darsi: **lending** — «mahsulotni bitta sahifada tanishtiradigan sayt» (`lending/index.html`, `lending/style.css`; Netlify'da alohida sayt; repo'ga ulangan — push'dan keyin odatda o'zi yangilanadi, 12-Modul 9.28). Mentor lendingi: sarlavha «Mahalla futboliga jamoani bir joyda yig'ing», uch foyda, asosiy tugma «Qo'shilmoqchiman», sahifada telefon maketi («O'yinlar» ekrani). Ikkala trekda ham bor (web-trekda — saytdan alohida sahifa).
   - 11–12-Modul: trek `pm-m9d8-platforma.trek` (`mobil` | `web`) · mobil — `mobil/` (Expo), brauzer ko'rinishi `npx expo export -p web` → `netlify deploy --prod --dir dist` · web — `prototip/` (React + Vite), Netlify · APK — `eas build -p android --profile preview`, o'zi yangilanmaydi (12-Modul 1.7, 9.28).
   - 13-Modul 12-darsi: «barqarorlashtirish» — asosiy yo'llar buzish yozuvi bilan tekshirilgan, «Tuzatish qilindi» odati, yangi versiya. Bugungi ko'prik (1-ekran): o'tgan safar mahsulot buzilmasligi tekshirilgan — bugun u qanchalik tez ochilishi o'lchanadi.
   - Agent (Antigravity) · talab (qayerda · nima qilsin · nima buzilmasin) · push odati: `git status` — o'zgargan fayllar agent ro'yxati bilan bir xil, `.env` yo'q; `git add <fayl>` (tayanch 3).
4. **Mazmun (tayanch 1.3 — aynan; tushuncha tartibi — topshiriq «Pilotlarga xos eslatmalar» 3, T-011):** avval hodisa (sahifa sekin ochiladi, tugma pastga sakraydi) → o'lchov (Lighthouse bahosi) → uch son (LCP · CLS · TBT, har biri vaziyatdan) → ikki tuzatish → qayta o'lchov.
   - **Nima o'lchanadi (bu darsning qarori — TAYANCHGA SAVOL 1):** Lighthouse — **lending**, Mobile rejimi, ikkala trekda bir xil; **yuklanadigan kod hajmi** — ilova: mobil trekda Expo Atlas (`mobil/`), web-trekda `npm run build` natijasi (`prototip/`). Ilova sahifasining (sayt yoki brauzer ko'rinishi) Lighthouse o'lchovi — uyga vazifa 2. <!-- TAXMIN T5 -->
   - **Lighthouse** (rasmiy, tayanch 6): baho 0–100 — **0–49 qizil · 50–89 to'q sariq · 90–100 yashil**; bahoga kiradi: LCP 25% · TBT 30% · CLS 25% · FCP 10% · Speed Index 10%. Darsda uchtasi tushuntiriladi — **LCP · CLS · TBT**; FCP va Speed Index — faqat nomi bilan (2-ekran sahnasida kulrang qator).
   - **Ikki tuzatish (tayanch 1.3):** 1) **rasmlar** (lendingda) — kerakdan katta rasm fayli kichraytiriladi · har `<img>` ga `width` va `height` · **pastdagi** rasmlarga `loading="lazy"` (birinchi ekrandagi, LCP rasmiga emas — rasmiy ogohlantirish) · 2) **keraksiz kutubxona yoki fayl** (ilovada) — agent ro'yxat va dalil ko'rsatadi, o'quvchi tanlaydi, agent o'chirishdan oldin «Davom et» ni kutadi (sinf 13).
   - **Halol qoidalar (o'quvchi matnida):** baho har o'lchashda biroz farq qilishi mumkin — oldin va keyin bir xil sharoitda (o'sha sahifa, Mobile rejimi, Incognito oyna) · baho 100 bo'lishi shart emas («extremely challenging to achieve and not expected» — rasmiy) · «tezlashdi» — faqat oldin va keyin soni bilan.
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — aynan):** <!-- TAXMIN T19 -->
   - **tezlik** — mahsulot qanchalik tez ochilishi va javob berishi. **Lighthouse bahosi** — Lighthouse'ning 0–100 bahosi (UI'dagi bo'lim nomi — «Performance»; o'quvchi matnida faqat UI yorlig'i sifatida, 2-ekran va A1; prozada «performance» yo'q).
   - **LCP** — eng katta element ko'rinish vaqti (o'quvchi matnida: «birinchi ekrandagi eng katta rasm yoki matn ko'ringan vaqt», soniyada; 4-ekran). **CLS** — sahifa siljishi (birliksiz son; 5-ekran). **TBT** — sahifa javob bermagan vaqt (millisekundda; 9-ekran).
   - **yuklanadigan kod hajmi** — ilova ochilganda yuklanadigan kod hajmi; kartochkada «inglizchasi: bundle» (9-ekran). **keyin yuklash** — ekrandan tashqaridagi rasm faqat kerak bo'lganda yuklanadi (`loading="lazy"`); kartochkada «inglizchasi: lazy load» (7-ekran).
   - **birinchi ekran** — sahifa ochilganda pastga aylantirmasdan ko'rinadigan qism (7-ekran; 12-Modul 8-darsidagi «ilova ochilgandagi birinchi ekran» bilan bir ma'noda — birinchi ko'rinadigan joy). **pastdagi rasm** — birinchi ekrandan pastdagi rasm.
   - **Mobile rejimi** — Lighthouse'dagi «Device: Mobile» sozlamasi (tayanchdagi «mobil rejim»); «mobil trek» bilan aralashmasligi uchun o'quvchi matnida doim UI yozuvi bilan: «Mobile rejimi» (TAYANCHGA SAVOL 12).
   - **oldin · keyin** — tuzatishdan oldingi va keyingi o'lchov (karta, `TEZLIK.md` ustunlari). **TEZLIK.md** — repo ildizidagi o'lchov fayli (tayanch 3).
   - **tekshirish · tekshiruv** — o'z ishini ko'rish (bloklar). «sinov» bu darsda yo'q (tayanch 2: faqat real odam bilan). «test» — faqat ballik savol (o'quvchiga «savol»).
   - **agent** · **prompt** · **talab** · **trek** · **brauzer ko'rinishi** · **APK** · **yangi versiya** (o'zgargan qismning odamlarga chiqarilgan nusxasi — 13-Modul 12-darsi).
   - **Ishlatilmaydi:** performance, bundle, lazy load (prozada — faqat kartochkada «inglizchasi»), optimizatsiya, «paket», «dangasa yuklash», «tezlashadi» (va'da shaklida), A1/A2/A3, `m12-03`, «Modul 14».
6. **Mentor misolidagi sonlar (tayanch 1.14 — aynan):** 3-dars — Lighthouse va kod hajmi **⛔ pilotda o'lchanadi**. MD da: `{oldin baho}`, `{oldin LCP}`, `{oldin CLS}`, `{oldin TBT}`, `{oldin kB}` va «keyin» juftlari — «qur» da Mentor lendingi va `mobil/` da haqiqiy o'lchov bilan to'ldiriladi. <!-- TAXMIN T6 -->
   Mentor misoli — mobil trek (Maydon Jamoa — mobil ilova, tayanch 1.0): kod hajmi — Expo Atlas. Mentor lendingidagi qaysi rasm katta, qaysi kutubxona keraksiz — ⛔ pilotda (agent ro'yxati); MD da `{…}`. Boshqa son yo'q; statistika deyilmaydi (T-043).
   Rasmiy chegaralar (son emas, qoida — Manbalar 1–5): 0–49 · 50–89 · 90–100 · LCP 2,5 soniya yoki kamroq · CLS 0,1 yoki kamroq · TBT (Mobile) 200 ms gacha — yashil · vaznlar 10/10/25/30/25.
   Kod oynasi va sahnadagi namuna qiymatlar (son emas, shakl): rasm `width="180"` `height="320"` (namuna sahifa, 9-band) — TAYANCHGA SAVOL 4.
7. **Metafora yo'q. Keyssiz** (tayanch 5: K13 Telegram «yetkazish tezligi» — mos emas). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: tashkilotchi, o'yinchi, hakam (faqat 0-ekran Mentor gapida, ismsiz, gapisiz). Lighthouse, Expo Atlas, Netlify, Chrome — asbob nomlari (T-033: tarjima qilinmaydi), logotipsiz.
8. **Kod — kim nima yozadi:** lending va ilovadagi o'zgarishni **agent** qiladi (A2 talabi); **o'lchashni o'quvchi o'zi qiladi** (A1, A3 — Lighthouse va kod hajmi buyrug'i; sinf 10). Kod oynasida (11-ekran) o'quvchi `width`, `height`, `loading` atributlarini qo'lda yozadi — namuna sahifada («haqiqiy lending emas» — oynadagi izohda ochiq).
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; brauzer, rasm joyi, baho doirasi, vaqt chizig'i, kod ustuni — CSS/SVG; «Maydon Jamoa» nomi sahna brauzer satrida va sahifa sarlavhasida o'z rangida (11-Modul yashili); logotip yo'q.
   Rang — holat foni (D3): yaxshi / joyida — `ok`, siljidi / javobsiz — `err`, joriy — `accent`, kutilmoqda — `ink2`. **Lighthouse doirasining uch rangi** (qizil · to'q sariq · yashil) — Lighthouse'ning o'z ko'rinishi, maket ichida (brend rangi kabi; KOD 3, Shubhali 10); rang ma'nosi o'quvchi matnida so'z bilan aytiladi (2-ekran shkalasi).
10. **Trek (tayanch 4, 1.3):** Lighthouse qadami ikkala trekda bir xil (lending). Farq — kod hajmi o'lchovida (A1 2-qadam, A3 2-qadam: mobil — Expo Atlas, web — `npm run build`), A2 da `{ilova papkasi}` (`mobil/` | `prototip/`) va A3 «Yangi versiya» qadamida. Trek `pm-m9d8-platforma.trek` dan; yo'q bo'lsa — A1 tepasida ikki chip «Mobil trek» · «Web-trek», tanlov `pm-m12d3-tezlik.trek` ga yoziladi (boshqa darsning kalitiga emas — sinf 3).
11. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l:** taqsimot tepada. Lighthouse o'lchovi paytida o'quvchi kutadi (30–60 soniya — rasmiy); Netlify yangilanishini kutayotganda — kodni ko'rsatadigan prompt (A2 3-qadam, SABOQ 52); APK navbati dars oqimini to'xtatmaydi (A3 4-qadam).
    Ulgurmasa: A3 (qayta o'lchash) — uyga vazifa 1; yakun sarlavhasi holatga qarab (18-ekran). «Davom etish»: A1 — 2-qadamdan keyin (sonlar saqlangach), A2 — 3-qadamdan keyin, A3 — 2-qadamdan keyin (SABOQ E 55); blok bajarilgani — faqat 4-qadam «Bajardim»idan.
    Pilotda 90 daqiqadan oshsa — oldindan belgilangan qisqartirish: 2-ekranda «Desktop» qadami olib tashlanadi · 9-ekranning 3-qadami avtomatik o'tadi · A3 «Yangi versiya» qadami (brauzer ko'rinishi va APK) uyga o'tadi. O'qituvchi eslatmasi — 1-ekranda.
12. **Saqlash kaliti (tayanch 8 — aynan, pilot kaliti):** o'qiydi `pm-m9d8-platforma` (`trek`; yo'q bo'lsa — tanlov) → yozadi `pm-m12d3-tezlik` = <!-- TAXMIN T5 -->
    `{ trek: 'web' | 'mobil', oldin: { baho: n | null, lcp, cls, tbt, bundleKb: n | null }, keyin: { … }, tuzatishlar: [string] (≤2), savedAt }`.
    Birliklar (son yolg'iz emas — maydon ta'rifida, kartada ko'rinadi): `baho` — 0–100 butun son · `lcp` — soniya (`n | null`) · `cls` — birliksiz son (`n | null`) · `tbt` — millisekund (`n | null`) · `bundleKb` — kB (`n | null`; mobil — Expo Atlas, web — `npm run build`). `null` — o'lchanmagan (uch holat: son · `null` · kalit yo'q).
    `oldin` — A1 2-qadam «Saqlash»; `keyin` — A3 2-qadam «Saqlash» (qayta o'lchansa yangilanadi); `tuzatishlar` — A1 4-qadamdagi tanlov (masalan «rasmlar: o'lcham, width/height, keyin yuklash» · «kutubxona: {nomi}»; tanlanmagani yozilmaydi). `trek` — o'qilgan yoki tanlangan qiymat.
    Kalitga manzil (URL), ism, login yozilmaydi. Kod oynasi qoralamasi — `pm-m12d3-code`. Boshqa darsning kaliti yozilmaydi. `pm-m12d3-tezlik` ni 6-dars o'qiydi (tayanch 8).
13. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 08.10.2026; tayanch 6 va o'zim tekshirganlarim); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0); 12-Modulda unga lending qurilgan. Bugun Mentor lendingini Lighthouse bilan o'lchaydi, rasm siljishi va kech kelgan katta rasmni ko'radi, ilovaning keraksiz kodini topadi,
  ikki tuzatishdan keyin xuddi shu sharoitda qayta o'lchaydi. O'quvchi xuddi shuni o'z lendingi va ilovasida qiladi (11-ekran, A1–A3).
- **Hook:** «Ochish» bosiladi — sahifa sekin chiziladi, rasm kech keladi, «Qo'shilmoqchiman» pastga sakraydi → «sababini qanday topasiz?» → 2-ekranda o'lchov asbobi (Lighthouse bahosi) → 4-ekranda eng katta narsa (LCP) → 5-ekranda siljish (CLS) va `width`/`height` →
  7-ekranda pastdagi rasmlar (keyin yuklash) → 9-ekranda ilova sahifasi: tugma bosilmaydi (TBT) va keraksiz kutubxona (yuklanadigan kod hajmi) → 11-ekranda kod oynasi → 12-ekranda ish tartibi → A1 (oldin) → A2 (ikki tuzatish) → A3 (keyin va yangi versiya).
- **Bitta vizual — «brauzer + Lighthouse paneli» sahnasi** (bitta manba `TEZLIK_SAHNA`, 163/180; topshiriq: «brauzer maketi (sahifa yuklanishi, rasm siljishi) + baho doirasi»):
  - **chapda brauzer oynasi** telefon kengligida (ramka ≈200×360, o'lcham barqaror; yorliq ramka ustida «brauzer · Mobile rejimi»): manzil satri `maydon-jamoa-….netlify.app` (lending) yoki brauzer ko'rinishi manzili (9-ekran); ostida yuklanish chizig'i.
    Sahifa — **lending (namuna)**: «Maydon Jamoa» (o'z rangida) · sarlavha «Mahalla futboliga jamoani bir joyda yig'ing» · **tepadagi rasm** — telefon maketi surati («O'yinlar» ekrani; kulrang joy → rasm) · tugma «Qo'shilmoqchiman» · «Uch foyda» qatori ·
    birinchi ekran chegarasi (kulrang uzuq chiziq, yorliq «birinchi ekran» — faqat 7-ekranda) · **pastdagi ikki rasm** («O'yin» va «E'lon berish» ekranlari suratlari) — TAYANCHGA SAVOL 3.
    9-ekranda sahifa — **ilova (brauzer ko'rinishi)**: «O'yinlar» · karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · tugma «Qo'shilaman».
  - **o'ngda Lighthouse paneli** (logotipsiz, yorliq «Lighthouse»): tepada sozlama qatori `Mode: Navigation` · `Device: Mobile | Desktop` · `Categories: Performance` va tugma «Analyze page load» (2-ekranda) ·
    **baho doirasi** (0–100; ostida uch bo'lakli shkala: 0–49 qizil · 50–89 to'q sariq · 90–100 yashil — son o'z bo'lagida yonadi) · besh qator: FCP · Speed Index (kulrang) · LCP · TBT · CLS (qalin, o'z ekranida yonadi) — qiymatlar `{…}` ⛔ ·
    **vaqt chizig'i** (4, 7-ekranlar): «ochildi» → «birinchi matn» → «eng katta narsa» (LCP belgisi) → «hamma rasm» · 9-ekranda o'rnida qizil chiziq «javob yo'q» · **kod ustuni** (9-ekran): bloklar «ilova kodi» · «kerakli kutubxonalar» · «ishlatilmaydigan kutubxona» (kulrang, chizilgan).
  - Holatlar: kulrang (kutilmoqda) → oq (bor) → accent (joriy) → yashil (joyida / yashil oraliq) → qizil (siljidi / javobsiz). Yangi rasm bir lahza ajralib kiradi; tugma siljishi — bir silkinish. `prefers-reduced-motion` da yuklanish chizig'i yurmaydi — holatlar animatsiyasiz almashadi (DE-200).
  - Ishlatilishi: 0 (lending, panel javobdan keyin) · 1 (tayyor holat: oldin · keyin) · 2 · 4 · 5 (+ kod kartasi ostida) · 7 · 9 (ilova sahifasi + kod ustuni) · 13–15 kutilgan natija (Lighthouse hisoboti maketi).
- **Yakun:** lendingingiz o'lchandi, ikki joy tuzatildi va qayta o'lchandi — farq `TEZLIK.md` da son bilan · keyingi dars — «Loyiha kuni: demo uchun sayqal». <!-- TAXMIN T20 -->

---

## 0 · Kirish — sahifa sekin ochiladi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Sahifangiz sekin ochilsa, sababini qanday topasiz?** (50)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Hakamlar oldida kutish uzoq tuyuladi — «Ochish» ni bosing va sahifani kuzating.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket (chap): `TEZLIK_SAHNA` brauzeri — manzil satri `maydon-jamoa-….netlify.app`, sahifa bo'sh (oq); ramka ostida tugma «Ochish» (halqada). Lighthouse paneli hali yo'q.
- **Harakat → Vizual o'zgarish:** «Ochish» → yuklanish chizig'i sekin o'sadi; avval «Maydon Jamoa» va sarlavha matni chiqadi; rasm joyi bo'sh, «Qo'shilmoqchiman» tugmasi sarlavhaning ostida turadi; keyin tepadagi rasm keladi va tugma pastga sakraydi (bir silkinish, qizil iz); chiziq oxirigacha yetadi.
  Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz; har birining o'z yengil chegarasi — E 40):
  - Sahifani boshqa kompyuterda ochib ko'raman
  - ✔ Sahifani o'lchov asbobi bilan tekshiraman
  - Agentga «sahifani tezlashtir» deb yozaman
- Javob — 2-variant: **Aynan!** O'lchov qaysi joy sekinligini son bilan ko'rsatadi — tuzatish o'sha joydan boshlanadi. (93)
- Javob — 1-variant: **Qiziq fikr!** Boshqa kompyuterda boshqacha ochilishi mumkin — lekin qaysi joy sekinligi bilinmaydi. (97)
- Javob — 3-variant: **Qiziq fikr!** Agent ham nimani tuzatishni bilishi kerak — avval buni o'lchov ko'rsatadi. (86)
- Javobdan keyin: o'ngda **Lighthouse paneli** tug'iladi — bo'sh baho doirasi va kulrang «?»; tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): sahifa sekin ochilishi va uning sababi. Uchala variant «o'quvchi nima qiladi» shaklida; 1-variant — 2-ekrandagi «bir xil sharoit» urug'i, 3-variant — agentning «tezlashtirdim» degani da'vo ekanining urug'i (sinf 5). P-016: payoff hech bir tanlovni yolg'onga chiqarmaydi.
  «Hakamlar oldida» — modul olami (Demo Day), hakam ismsiz va gapsiz (TAQIQLAR 0). Sahnadagi lending — namuna (12-Modul 1.1 matnlari + pastdagi ikki rasm — TAYANCHGA SAVOL 3). Kutish soniyasi aytilmaydi va ko'rsatilmaydi (son to'qilmaydi).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun lendingingizni o'lchab, ikki joyni tuzatasiz.** (51)
- Mentor: 13-Modulda mahsulotingiz buzilmasligini tekshirgansiz — bugun u qanchalik tez ochilishini o'lchaysiz. «Tezlashdi» deyish uchun bitta shart bor: oldin va keyin soni.
- Chap — «Dars oxirida»: `TEZLIK_SAHNA` tayyor holatda — lending (rasmlar joyida, tugma joyida) va Lighthouse doirasi ikki holatda: «Oldin · `{oldin baho}`» → «Keyin · `{keyin baho}`» (⛔ pilotda o'lchanadi — «qur» da Mentor soni; MD da son yo'q). <!-- TAXMIN T6 -->
  Bir marta o'zi yuradi (DE-200): doira «oldin» sonidan «keyin» soniga o'tadi. Sahna ostida `TEZLIK.md` kartasining bitta qatori: «Oldin · Keyin».
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` so'zlari bilan — P-015):
  - 01 · Sahifa tezligini son bilan o'lchash · `Lighthouse`
  - 02 · Rasm kelganda sahifa siljimasligi · `rasmlar`
  - 03 · Ilovadagi keraksiz kodni olib tashlash · `yuklanadigan kod hajmi`
  - 04 · Oldin va keyin sonlarini solishtirish · `oldin va keyin`
- Pastki qator (mono, kichik): o'z repo'ngiz — `lending/` va `TEZLIK.md` · Mentor misoli `maydon-jamoa` · tayyor holat `m14-dars-03-done` <!-- TAXMIN T4 -->
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: darsning og'ir qismi — 11-ekran (kod oynasi) va uch blok (har birida tashqi kutish: Lighthouse 30–60 soniya, Netlify yangilanishi, Expo Atlas yoki `npm run build`). 2-ekrandagi «Desktop» qadamiga ortiqcha vaqt bermang.
  Sinf interneti sekin yoki o'zgaruvchan bo'lsa, sonlar boshqacha chiqadi — har o'quvchi oldin va keyinni **bir xil joyda, bir xil sharoitda** o'lchasin (Incognito oyna, Mobile rejimi, o'sha sahifa). Brauzerga qo'shilgan dasturlar (Extensions) va antivirus natijaga ta'sir qiladi (rasmiy, Manbalar 2).
  Bugun yangi funksiya qo'shilmaydi: agent «yana bir narsa qo'shay» desa — rad etiladi (tayanch 1.0). Vaqt yetmasa — A-bo'lim 11-banddagi qisqartirish.

## 2 · Lighthouse bahosi  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · Lighthouse bahosi
- Sarlavha: **Sahifa qanchalik tez ochilishini nima o'lchaydi?** (48)
- Mentor (bosqichga qarab):
  - boshida: Chrome ichida o'lchov asbobi bor — o'ngdagi «Analyze page load» ni bosing.
  - 1-qadamdan keyin: Endi tepadagi «Desktop» ni bosib, bahoni yana bir ko'ring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **Bu asbob sahifaga qanday baho beradi?** · 1 dan 5 gacha · 0 dan 10 gacha · 0 dan 100 gacha
- Sahna: chapda brauzer (lending, ochilgan holat) · o'ngda Lighthouse paneli: sozlama qatori `Mode: Navigation` · `Device: Mobile` (tanlangan) `| Desktop` · `Categories: Performance` · tugma «Analyze page load» (halqada); baho doirasi bo'sh. Qadam belgilari tugma yonida (SABOQ 21): 1 O'lchang · 2 Desktop.
- **Harakat → Vizual o'zgarish:**
  1. «Analyze page load» → brauzerdagi sahifa boshidan qayta ochiladi (0-ekrandagidek, qisqa); panelda doira chiziladi → o'rtada `{oldin baho}` ⛔, doira shu son turgan oraliq rangida; shkalada o'sha bo'lak yonadi; ostida besh qator chiqadi:
     FCP · Speed Index (kulrang) · **LCP** · **TBT** · **CLS** — har birining qiymati `{…}` ⛔ («qur» da Mentor lendingining haqiqiy o'lchovi). <!-- TAXMIN T6 -->
     Nom qatori 1 (bitta): Chrome ichidagi o'lchov asbobi — Lighthouse; u sahifaga 0 dan 100 gacha baho beradi — Lighthouse bahosi. <!-- TAXMIN T19 -->
     «Desktop» halqaga o'tadi.
  2. «Desktop» → sozlama `Device: Desktop` ga o'tadi, sahifa keng oynada qayta ochiladi → doirada boshqa o'lchov `{desktop baho}` ⛔; doira yonida kulrang yorliq «boshqa sharoit». Bir lahzadan keyin sozlama o'zi «Mobile» ga qaytadi, doirada yana `{oldin baho}`.
     Nom qatori 2 (bitta): Shkala: 0–49 — qizil, 50–89 — to'q sariq, 90–100 — yashil.
- Natija qatori — yashil xulosaning birinchi kichik qatori (E 42): «Taxminingiz ✕ — aslida: 0 dan 100 gacha» (yoki «Taxminingiz to'g'ri chiqdi ✓»). Hamma tushuncha-ekranda shunday; QIzoh — shu qutining oxirgi kichik qatori.
- Xulosa: Bu darsda tezlik Lighthouse bahosi bilan o'lchanadi: oldin va keyin — o'sha sahifa, o'sha rejimda. (98)
- Qator (`QIzoh`, xulosadan keyin, bitta): Baho har o'lchashda biroz farq qilishi mumkin; 100 shart emas — Lighthouse buni «juda qiyin» deydi.
- Tugadi (199): sozlama qatori va qadam belgilari yopiladi, doira va besh qator fokusga; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
- O'qituvchi eslatmasi: vaznlar (Lighthouse 10): LCP 25% · TBT 30% · CLS 25% · FCP 10% · Speed Index 10% (Manbalar 1). Mobile va Desktop — Lighthouse ikki xil sharoitda o'lchaydi; shuning uchun darsda faqat Mobile. Sahnadagi `{desktop baho}` — Mentor lendingining haqiqiy Desktop o'lchovi («qur»);
  agar Mobile bilan bir xil chiqsa — 2-qadam yorlig'i «bu safar bir xil chiqdi» bo'ladi, xulosa ikkala holatda rost.
✎ T-011 tartibi: hodisa (o'lchash) → «Lighthouse» → «Lighthouse bahosi»; LCP, TBT, CLS — bu ekranda faqat qator nomi, ta'rifsiz (keyingi ekranlar ochadi — P-036). «Analyze page load», «Mode», «Device», «Categories», «Performance», «Mobile», «Desktop» — Lighthouse UI yozuvlari (T-024, T-033; Manbalar 2).
  Bashorat — bir o'lchov, o'sish tartibida (S-015). Rang legendasi so'z bilan — nom qatori 2 (KORPUS §134: rangga ma'no yuklansa — legenda matnda).

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **Oldin va keyingi bahoni qanday o'lchaysiz?**
  - Oldin Mobile rejimida, keyin Desktop rejimida
  - ✔ Ikkalasini o'sha sahifada, Mobile rejimida
  - Oldin Lighthouse bilan, keyin agentdan so'rab
  - Oldin lendingda, keyin ilova sahifasida
- Kalit: **B** (index 1). To'rttalasi «qachon/qayerda — qanday» shaklida; «Mobile» ikki variantda, «Oldin» uch variantda (shakl-telli yo'q, §147).
- To'g'ri izohi: Solishtirish uchun ikkala o'lchov bir xil sharoitda: o'sha sahifa, o'sha rejim.
- Xato izohlari (≤60):
  - A: Rejim almashsa, baho boshqa sharoitda chiqadi. (46)
  - C: Agentning gapi — da'vo; keyingi son qayerda? (44)
  - D: Ikki xil sahifa — ikki xil son; nimani solishtirasiz? (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktorlar uch turkumdan (sinf 8): boshqa sharoit (A — rasmiy o'zgaruvchanlik manbasi «testing on different devices») · o'lchov o'rniga da'vo (C) · boshqa sahifa (D). Uchalasi hayotda ham solishtirishni buzadi.

## 4 · Eng katta narsa — LCP  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · LCP
- Sarlavha: **Sahifadagi eng katta narsa qachon ko'rinadi?** (44)
- Mentor (bosqichga qarab):
  - boshida: Lendingni qadamma-qadam oching — «Sekin ochish» ni bosing.
  - 1-qadamdan keyin: Endi o'sha narsani sahifaning o'zida bosib ko'rsating.
- Bashorat (ballsiz; tanlangach ixcham qator): **Odam sahifani qachon «ochildi» deb sezadi?** · Birinchi harf chiqqanda · Eng katta narsa chiqqanda · Hamma rasm yuklanganda
- Sahna: chapda brauzer (lending, bo'sh) · o'ngda **vaqt chizig'i** (4 belgi kulrang: «ochildi» · «birinchi matn» · «eng katta narsa» · «hamma rasm») va Lighthouse panelidan bitta qator «LCP · `{oldin LCP}` s» ⛔ (kulrang). <!-- TAXMIN T6 --> Ostida tugma «Sekin ochish» (halqada). Qadam belgilari: 1 Sekin ochish · 2 Eng kattasini toping.
- **Harakat → Vizual o'zgarish:**
  1. «Sekin ochish» → sahifa bosqichma-bosqich chiziladi: oq → «Maydon Jamoa» va sarlavha (chiziqda «birinchi matn» yonadi) → tepadagi rasm (chiziqda «eng katta narsa» accent bilan yonadi) → pastdagi rasmlar («hamma rasm»). Brauzerdagi sahifa bosiladigan bo'ladi (sarlavha, rasm, tugma — har birining o'z yengil chegarasi).
  2. Eng katta narsani bosish →
     - tepadagi rasm → rasm accent ramkaga olinadi, chiziqdagi «eng katta narsa» belgisi Lighthouse qatoriga «LCP» bo'lib uchadi (qator qalinlashadi);
     - sarlavha yoki tugma → u bir marta silkinadi, bir qator (`QXato`, ≤60): Bu ham ko'rinadi — lekin undan kattaroq narsa bormi? (52)
     Nom qatori (bitta): Birinchi ekrandagi eng katta rasm yoki matn ko'ringan vaqt — LCP; soniyada o'lchanadi.
- Natija qatori: «Taxminingiz ✕ — aslida: eng katta narsa chiqqanda» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda eng katta narsa — tepadagi rasm: u kech kelsa, LCP ham kech bo'ladi. (79)
- Qator (`QIzoh`, xulosadan keyin, bitta): Rasmiy tavsiya: LCP 2,5 soniya yoki kamroq bo'lsin.
- Tugadi (199): qadam belgilari yopiladi, sahifa va vaqt chizig'i yonma-yon fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
- O'qituvchi eslatmasi: LCP — eng katta rasm, matn bloki yoki video (rasmiy, Manbalar 3). Mentor lendingida LCP qaysi element ekani — ⛔ «qur» da Lighthouse hisobotidan tekshiriladi; boshqa chiqsa (masalan sarlavha matni), sahna va xulosa o'sha elementga moslanadi.
  «Birinchi harf» (FCP) — bahoning 10 foizi, darsda nomi bilan; o'quvchi so'rasa: «birinchi matn yoki rasm chiqqan vaqt».
✎ Bashorat — bir o'lchovning uch darajasi, vaqt bo'yicha o'sish tartibida (S-015). «Eng katta narsa» — o'quvchi so'zi, atama ta'rifida «element» o'rniga «rasm yoki matn» (T-009). Sahna — namuna lending (TAYANCHGA SAVOL 3).

## 5 · Sahifa siljishi — CLS  ← QTushuncha (bashorat + 2 qadam; kod kartasi)
- Eyebrow: Tushuncha · CLS
- Sarlavha: **Rasm kelganda tugma nega pastga sakraydi?** (41)
- Mentor (bosqichga qarab):
  - boshida: Avval «Sahifani ochish» ni, keyin «Qo'shilmoqchiman» ni bosing.
  - 1-qadamdan keyin: Endi rasmga o'lcham yozing — «`width` va `height`» o'chirgichini yoqing.
- Bashorat (ballsiz; tanlangach ixcham qator): **Rasm kelganda tugma nima bo'ladi?** · Joyida qoladi · Pastga suriladi
- Sahna: chapda brauzer (lending; tepadagi rasm joyi bo'sh, balandligi yo'q — tugma sarlavhaning ostida) · o'ngda Lighthouse panelidan qator «CLS · `{oldin CLS}`» ⛔ (kulrang; <!-- TAXMIN T6 -->) · brauzer ostida tugma «Sahifani ochish» (halqada) va o'chirgich «`width` va `height`: yo'q» (xira, 1-qadamgacha bosilmaydi).
  Qadam belgilari: 1 Bosib ko'ring · 2 O'lcham yozing.
- Kod kartasi (sahna ostida — E 46; o'qish uchun — P-065), yorlig'i `lending/index.html` · tepadagi rasm; ikki holat, o'chirgichga qarab:
  ```html
  <img src="oyinlar.png" alt="O'yinlar ekrani">
  ```
  ```html
  <img src="oyinlar.png" alt="O'yinlar ekrani"
       width="180" height="320">
  ```
  Karta ostida kulrang bir qator: `width` va `height` — rasmning sahifadagi o'lchami, pikselda; brauzer joyni rasm kelmasdan band qiladi.
- **Harakat → Vizual o'zgarish:**
  1. «Sahifani ochish» → sarlavha va tugma chiqadi, «Qo'shilmoqchiman» halqada; o'quvchi uni bosadi → aynan shu lahza rasm keladi, tugma pastga sakraydi (qizil iz), bosish rasmga tushadi — rasm ustida kichik yorliq «bosish shu yerga tushdi»; CLS qatori qizil.
     Nom qatori 1 (bitta): Ko'rinib turgan narsa joyidan siljishi — sahifa siljishi; Lighthouse uni CLS deb o'lchaydi (birliksiz son).
     O'chirgich faollashadi, halqaga o'tadi.
  2. O'chirgich «`width` va `height`: bor» → kod kartasi ikkinchi holatga o'tadi (yangi qator yashil yonadi) → sahifa qayta ochiladi: rasm o'rnida 180 × 320 kulrang joy oldindan turadi, tugma uning ostida; rasm kelganda tugma joyida qoladi (yashil), bosish tugmaga tushadi — «Qo'shilmoqchiman» bosildi; CLS qatori yashil.
- Natija qatori: «Taxminingiz ✕ — aslida: pastga suriladi» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda `width` va `height` rasm uchun joyni oldindan band qiladi — tugma siljimaydi. (88)
- Qator (`QIzoh`, xulosadan keyin, bitta): Rasmiy tavsiya: CLS 0,1 yoki kamroq bo'lsin.
- Tugadi (199): o'chirgich va qadam belgilari yopiladi, ikki holat yonma-yon fokusga («o'lchamsiz — tugma siljidi» · «o'lcham bilan — joyida»); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
- O'qituvchi eslatmasi: rasmiy (web.dev): «we recommend adding `width` and `height` attributes to all `<img>` tags» — brauzer joyni oldindan band qiladi. CSS'da `height: auto` bo'lsa, rasm nisbati saqlanadi (11-ekran namunasi shunday).
  Mentor lendingidagi tepadagi rasmning haqiqiy o'lchami — ⛔ «qur» da (sahnadagi 180 × 320 — namuna, TAYANCHGA SAVOL 4).
✎ «Sakraydi» — 0-ekran hookining o'z so'zi bilan javob (T-064). 1-qadam — o'quvchining o'z harakati siljish natijasini his qiladi (bosish rasmga tushadi); sahna bosishni rasm kelishi bilan bog'laydi (vizual bosqichda — bosish payti emas, sahna holati; Shubhali 9). Uch blok: sahna · tugmalar · kod kartasi (SABOQ 26).

## 6 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Rasm kelganda tugma siljidi. Nima qilasiz?**
  - Tugmaga yorqinroq rang va soya beraman
  - Rasmga `loading="lazy"` yozaman
  - Sahifani boshqa brauzerda ochaman
  - ✔ Rasmga `width` va `height` yozaman
- Kalit: **D** (index 3). To'rttalasi «…ga/…ni … qilaman» shaklida; «Rasmga» ikki variantda, kod ikki variantda (shakl-telli yo'q).
- To'g'ri izohi: `width` va `height` rasm joyini oldindan band qiladi — tugma siljimaydi.
- Xato izohlari (≤60):
  - A: Rang o'zgarsa ham rasm joyi bo'sh qoladi. (41)
  - B: Bu rasm tepada — uning joyini nima band qiladi? (47)
  - C: Boshqa brauzerda ham rasm o'lchami oldindan noma'lum. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktor turkumlari: dizayn (A) · noto'g'ri atribut (B — keyin yuklash siljishni yo'qotmaydi; tepadagi rasmga qo'yilmasligi — 7-ekran) · tashqi muhit (C). «Tezroq internet» varianti ataylab yo'q — haqiqiy hayotda rasm sahifa chizilishidan oldin kelib, siljish ko'rinmasligi mumkin (TAQIQLAR 7).

## 7 · Pastdagi rasmlar — keyin yuklash  ← QTushuncha (bashorat + 3 qadam)
- Eyebrow: Tushuncha · keyin yuklash
- Sarlavha: **Ko'rinmayotgan rasmni qachon yuklash kerak?** (43)
- Mentor (bosqichga qarab):
  - boshida: Ikki usulni solishtiring — avval «Hammasi birdan» ni bosing.
  - 1-qadamdan keyin: Endi pastdagi ikki rasmni keyinga qoldiring — «Keyin yuklash» ni bosing.
  - 2-qadamdan keyin: Shu atributni tepadagi rasmga ham qo'yib ko'ring — «Tepadagisiga ham» ni bosing.
- Bashorat (ballsiz; tanlangach ixcham qator): **Pastdagi rasm qachon yuklansa yaxshi?** · Sahifa ochilishi bilan · Unga yaqinlashganda · Faqat bosilganda
- Sahna: chapda brauzer (lending, uzun sahifa; birinchi ekran chegarasi — kulrang uzuq chiziq, yorliq «birinchi ekran»; pastdagi ikki rasm chiziqdan pastda) · o'ngda ro'yxat «Yuklanmoqda» — uch rasm nomi va hisoblagich «Yuklangan: n / 3» · vaqt chizig'ida «eng katta narsa» belgisi (4-ekrandan).
  Ostida tugmalar «Hammasi birdan» (halqada) · «Keyin yuklash» · «Tepadagisiga ham» (keyingilari xira). Qadam belgilari: 1 Hammasi birdan · 2 Keyin yuklash · 3 Tepadagisiga ham.
- **Harakat → Vizual o'zgarish:**
  1. «Hammasi birdan» → sahifa ochiladi; uchala rasm bir vaqtda yuklana boshlaydi — o'quvchi hali pastga aylantirmagan bo'lsa ham «Yuklangan: 3 / 3»; ro'yxatda pastdagi ikki rasm qatori kulrang yorliq bilan «hali ko'rinmagan».
  2. «Keyin yuklash» → pastdagi ikki rasmda `loading="lazy"` yozuvi chiqadi → sahifa qayta ochiladi: faqat tepadagi rasm yuklanadi — «1 / 3»; pastdagilar o'rnida kulrang joy (o'lchami band). Sahifa o'zi sekin pastga aylanadi: rasmga yaqinlashganda u yuklanadi — «2 / 3», «3 / 3».
     Nom qatori (bitta): Ekrandan tashqaridagi rasm faqat kerak bo'lganda yuklanadi — keyin yuklash: `loading="lazy"`. <!-- TAXMIN T19 -->
  3. «Tepadagisiga ham» → tepadagi rasmda ham `loading="lazy"` → sahifa qayta ochiladi: tepadagi rasm odatdagidan kech chiqadi, vaqt chizig'idagi «eng katta narsa» belgisi o'ngga suriladi va qizil bo'ladi; tepadagi `loading="lazy"` yozuvi qizil chiziladi.
- Natija qatori: «Taxminingiz ✕ — aslida: unga yaqinlashganda» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda `loading="lazy"` faqat pastdagi rasmlarda: tepadagi rasm sahifa bilan birga yuklanadi. (97)
- Qator (`QIzoh`, xulosadan keyin, bitta): Rasmiy ogohlantirish: birinchi ekrandagi rasmga, ayniqsa LCP rasmiga, keyin yuklash qo'yilmaydi.
- Tugadi (199): tugmalar va qadam belgilari yopiladi, sahna «Keyin yuklash» holatida fokusga (tepadagi rasm — oddiy, pastdagilar — `loading="lazy"`); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
- O'qituvchi eslatmasi: rasmiy (web.dev): «Don't lazy-load images that are likely to be in-viewport when the page loads, especially LCP images.» · keyin yuklanadigan rasmlarga ham `width` va `height` (aks holda brauzer ularni 0 × 0 deb hisoblab, hammasini birdan yuklashi mumkin — Manbalar 4).
  `loading="lazy"` ni qo'llab-quvvatlamaydigan eski brauzer atributni e'tiborsiz qoldiradi — sahifa buzilmaydi (rasmiy). «Qancha yaqinlashganda» — brauzerning o'zi hal qiladi; darsda masofa aytilmaydi.
  Brauzer rasmni ekranga yetmasdan ancha oldin yuklay boshlaydi: qisqa sahifada pastdagi rasm ham sahifa bilan birga kelishi mumkin (sinaldi — Manbalar 8); sahna uzun sahifani ko'rsatadi.
✎ «Keyin yuklash» — tayanch 2 atamasi (T-011: harakatdan keyin nom). 3-qadam — rasmiy ogohlantirishni ko'rsatadi, sahna «kech chiqadi» ni chizadi, sekund aytmaydi (son to'qilmaydi). «birinchi ekran» — shu ekranda tug'iladi (yorliq + A-5 ta'rifi).

## 8 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **`loading="lazy"` qaysi rasmga yoziladi?**
  - ✔ Sahifaning pastidagi rasmga
  - Birinchi ekrandagi katta rasmga
  - Sahifadagi hamma rasmlarga
  - Eng kichik hajmli rasmga
- Kalit: **A** (index 0). To'rttalasi «… rasmga» shaklida.
- To'g'ri izohi: Pastdagi rasm unga yaqinlashganda yuklanadi; tepadagisi sahifa bilan birga.
- Xato izohlari (≤60):
  - B: Bu rasm birinchi ko'rinadi — kechiksa, LCP ham kechikadi. (57)
  - C: Tepadagi rasm ham kechikadi — LCP nima bo'ladi? (47)
  - D: Hajm emas, joyi muhim: rasm sahifaning qayerida? (48)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktorlar: LCP xatosi (B — rasmiy ogohlantirish) · ortiqcha umumlashtirish (C) · noto'g'ri belgi — hajm (D). Inkor-savol emas (S-006): «qaysi rasmga yozilmaydi» o'rniga «qaysi rasmga yoziladi».

## 9 · Javob bermagan vaqt — TBT va kod hajmi  ← QTushuncha (bashorat + 3 qadam)
- Eyebrow: Tushuncha · yuklanadigan kod hajmi
- Sarlavha: **Sahifa ko'rinib turibdi — tugma nega bosilmayapti?** (50)
- Mentor (bosqichga qarab):
  - boshida: Endi ilovaning brauzer ko'rinishini oching — «Ochish va bosish» ni bosing.
  - 1-qadamdan keyin: Bu ilova kodida ishlatilmaydigan kutubxona bor — «Olib tashlash» ni bosing.
  - 2-qadamdan keyin: Endi «Qayta ochish» ni bosing va farqni ko'ring.
- Bashorat (ballsiz; tanlangach ixcham qator): **Tugma bosilmagan paytda brauzer nima qilyapti?** · Rasmlarni yuklayapti · Kodni bajaryapti · Hech narsa qilmayapti
- Sahna: chapda brauzer — manzil satri brauzer ko'rinishi (`….netlify.app`), sahifa: «O'yinlar» · karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10» · tugma «Qo'shilaman» · o'ngda **kod ustuni** «Yuklanadigan kod» (uch blok: «ilova kodi» · «kerakli kutubxonalar» · «ishlatilmaydigan kutubxona» — kulrang, ustida «hech qayerda ishlatilmaydi») va
  Lighthouse panelidan qator «TBT · ms» (kulrang). Ostida tugmalar «Ochish va bosish» (halqada) · «Olib tashlash» · «Qayta ochish» (xira). Qadam belgilari: 1 Ochib bosing · 2 Olib tashlang · 3 Qayta bosing.
- **Harakat → Vizual o'zgarish:**
  1. «Ochish va bosish» → sahifa chiqadi, o'quvchi «Qo'shilaman» ni bosadi → tugma javob bermaydi (kichik soat belgisi); kod ustunidagi bloklar birma-bir accent bilan yonadi («bajarilmoqda»); brauzer ostida qizil chiziq «javob yo'q» o'sib boradi →
     oxirgi blok tugagach bosish o'tadi: karta «9 / 10»; qizil chiziq to'xtaydi. TBT qatori qizil.
     Nom qatori 1 (bitta): Sahifa bosishga javob bera olmagan vaqt — TBT; millisekundda o'lchanadi.
  2. «Olib tashlash» → «ishlatilmaydigan kutubxona» bloki ustundan chiqib ketadi; ustun qisqaradi; ustun ostidagi yorliq «oldin» → «keyin» (bar uzunligi, son yo'q).
     Nom qatori 2 (bitta): Ilova ochilganda yuklanadigan hamma kod — yuklanadigan kod hajmi; mobil trekda uni Expo Atlas ko'rsatadi. <!-- TAXMIN T19 --> <!-- TAXMIN T5 -->
  3. «Qayta ochish» → sahifa qayta chiqadi, «Qo'shilaman» bosiladi → bloklar kamroq — qizil chiziq qisqaroq qoladi, bosish ertaroq o'tadi: «9 / 10». Ikki chiziq yonma-yon: «oldin» (uzun) · «keyin» (qisqa).
- Natija qatori: «Taxminingiz ✕ — aslida: kodni bajaryapti» (yoki «Taxminingiz to'g'ri chiqdi ✓»).
- Xulosa: Bu misolda kod kamaygach brauzer ertaroq bo'shadi va tugma ertaroq javob berdi. (79)
- Qator (`QIzoh`, xulosadan keyin, bitta): Lighthouse'da Mobile rejimida TBT 200 ms gacha bo'lsa — yashil.
- Tugadi (199): tugmalar yopiladi, ikki chiziq va qisqargan kod ustuni fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish
- O'qituvchi eslatmasi: rasmiy (Lighthouse): TBT — sahifa sichqoncha bosishi, ekranga teginish yoki klaviaturaga javob bera olmagan umumiy vaqt; 50 ms dan uzun ish — «long task», shundan ortig'i sanaladi; birinchi tavsiya — keraksiz JavaScript'ni kamaytirish (Manbalar 5).
  Vite hujjati ham: «the JavaScript size itself is related to the execution time» (Manbalar 7). Sahnadagi kutubxona — namuna: Mentor ilovasida qaysi kutubxona keraksizligi ⛔ «qur» da agent ro'yxatidan; topilmasa — sahna «namuna» deb qoladi, A2 da 2-tuzatish «yo'q» bo'ladi (TAYANCHGA SAVOL 5).
✎ T-011: hodisa (tugma javobsiz) → TBT; hodisa (kutubxona chiqdi, ustun qisqardi) → yuklanadigan kod hajmi. Xulosa «Bu misolda» — har kutubxona olib tashlanishi TBT ni o'zgartirmaydi (T-045); tayanch 7.5 — sabab da'vosi chegaralangan. Bu ekranda sahifa — ilova (bitta vizual, boshqa sahifa — 13-Modul 2-ekrani naqshi).
  Son yo'q: «oldin / keyin» — chiziq uzunligi; Mentor kB soni — A3 kutilgan natijasida `{…}` ⛔.

## 10 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **Sahifa ochilayotganda tugma bosilmadi. Qaysi son buni ko'rsatadi?**
  - LCP — eng katta narsa vaqti
  - CLS — sahifa siljishi
  - ✔ TBT — javob bermagan vaqt
  - Yuklangan rasmlar soni
- Kalit: **C** (index 2). Uchtasi «nom — ma'no» shaklida, bittasi oddiy son (tire faqat to'g'rida emas).
- To'g'ri izohi: TBT sahifa bosish va teginishga javob bera olmagan vaqtni o'lchaydi.
- Xato izohlari (≤60):
  - A: LCP ko'rinishni o'lchaydi — bosishga javobni-chi? (49)
  - B: Tugma joyida turgan edi — siljish bo'lmagan. (44)
  - D: Rasmlar soni vaqt emas — kutilgan vaqtni nima o'lchaydi? (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Distraktor turkumlari: boshqa Lighthouse soni — ko'rinish (A) va siljish (B) · Lighthouse soni emas (D). Savol vaziyatdan (S-001), 9 so'z.

## 11 · Rasm joyi va keyin yuklash  ← QKod
- Eyebrow: Kod yozish · rasmlar
- Sarlavha: **Rasm kelganda tugma joyida qoladigan kod yozamiz.** (49) — §19 sarlavha oilasi
- Mentor: Namunadagi uchala rasmda o'lcham yo'q, `loading="lazy"` esa noto'g'ri rasmda turibdi — tuzatasiz. Atributlarni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. Tepadagi rasmdan `loading="lazy"` ni olib tashlang va unga `width="180"`, `height="320"` yozing.
  2. Pastdagi ikki rasmga `loading="lazy"`, `width="180"` va `height="320"` yozing.
  3. Natija oynasida «Qayta ochish» ni bosing: «Tugma siljishi: 0 px» chiqsin.
- Yordam: Atribut `<img` va `>` orasiga, bo'sh joy bilan yoziladi; qiymati qo'shtirnoq ichida: `width="180"`. Tugma hali siljisa — tepadagi rasmda `width` va `height` ikkalasi bormi, qarang.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — boshlang'ich holat (o'quvchi tahrirlaydi):
    ```html
    <style>
      img { display: block; max-width: 180px; height: auto; }
      .foydalar { height: 900px; }
    </style>
    <h1>Mahalla futboliga jamoani bir joyda yig'ing</h1>
    <img class="tepa" alt="O'yinlar ekrani" loading="lazy">
    <button class="tugma">Qo'shilmoqchiman</button>
    <p class="siljish">Tugma siljishi: rasm kutilmoqda</p>
    <button class="qayta">Qayta ochish</button>
    <div class="foydalar">Uch foyda</div>
    <img class="past" alt="O'yin ekrani">
    <img class="past" alt="E'lon berish ekrani">
    ```
  - `namuna.js` — tayyor, o'zgarmaydi (tepasida izoh ochiq):
    ```js
    // Sekin internet o'rnida NAMUNA (haqiqiy rasm serveri emas):
    // tepadagi rasm 1 soniyadan keyin keladi.
    const tugma = document.querySelector('.tugma');
    const yozuv = document.querySelector('.siljish');

    function surat(matn) {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"'
        + ' width="720" height="1280">'
        + '<rect width="720" height="1280" fill="#E9E6DF"/>'
        + '<text x="60" y="160" font-size="80">' + matn + '</text>'
        + '</svg>';
      return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    function ochish() {
      const tepa = document.querySelector('.tepa');
      tepa.removeAttribute('src');
      yozuv.textContent = 'Tugma siljishi: rasm kutilmoqda';
      const oldin = tugma.getBoundingClientRect().top;
      setTimeout(function () {
        tepa.onload = function () {
          const keyin = tugma.getBoundingClientRect().top;
          const farq = Math.round(Math.abs(keyin - oldin));
          yozuv.textContent = 'Tugma siljishi: ' + farq + ' px';
        };
        tepa.src = surat('Tepadagi rasm');
      }, 1000);
    }

    document.querySelectorAll('.past').forEach(function (rasm) {
      rasm.src = surat('Pastdagi rasm');
    });
    document.querySelector('.qayta').addEventListener('click', ochish);
    ochish();
    ```
- Kod oynasi sarlavhasi: `index.html — rasm joyi oldindan band`
- Shart xabarlari (≤60):
  - 1 — Tepadagi rasmda `width` va `height` bor. (40)
  - 2 — Tepadagi rasmda `loading="lazy"` yo'q. (38)
  - 3 — Pastdagi ikki rasmda `loading`, `width`, `height` bor. (54)
- **Harakat → Vizual o'zgarish:** boshlang'ich kodda natija oynasida sarlavha va tugma; bir soniyadan keyin tepadagi rasm keladi, tugma pastga suriladi — «Tugma siljishi: N px» (N — 0 dan katta; namuna Chrome'da ≈300 px ko'rsatdi, o'zim sinadim — Manbalar 8).
  Tepadagi rasmga `width`, `height` yozilgach: kulrang joy oldindan turadi, rasm kelganda tugma joyida — «Tugma siljishi: 0 px» (1-shart ✓). `loading="lazy"` olib tashlansa — 2-shart ✓; pastdagilar to'ldirilsa — 3-shart ✓.
  Kod o'zgarsa natija oynasi boshidan ochiladi. «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Bu kodda tepadagi rasm sahifa bilan birga, pastdagilar keyin yuklanadi; tugma siljimaydi. (89)
- Qator (`QIzoh`, xulosadan keyin): Bu oynada rasm serveri — namuna: rasm bir soniyada keladigan qilib yasalgan.
✎ Tekshiruv — atributlar bo'yicha (sinxron; `checks.attr` + bitta «yo'q» sharti — KOD 10); «0 px» qatori — o'quvchiga natija, shart emas (kechikish 1 soniya — tekshiruv oynasining 50 ms chegarasidan uzun). Qiymatlar 180 × 320 — namuna (Mentor lendingidagi rasm o'lchami emas; TAYANCHGA SAVOL 4).
  Faqat `width` yozilsa siljish qoladi (nisbat uchun ikkalasi kerak) — Yordamning ikkinchi gapi shu holat uchun. Pastdagi rasmlarning keyin yuklanishi bu oynada ko'rsatilmaydi (sahifa qisqa — brauzer ularni baribir yuklaydi; sinaldi) — 7-ekran sahnasi ko'rsatgan.
  `namuna.js` satrlarida apostrofli so'z yo'q (`'Tepadagi rasm'`, `'Pastdagi rasm'` — ataylab); `index.html` matni HTML'da — apostrof joyida.

## 12 · Ish tartibi (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Tezlashtirish ishi qaysi tartibda qilinadi?** (43)
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — 188; bo'lak ko'rinishi — E 44):
  1. Sahifani Mobile rejimida o'lchash
  2. Sonlarni «Oldin» deb yozish
  3. Agentdan rasm va kutubxona ro'yxatini olish
  4. Ikki tuzatishni tanlab qilish
  5. Xuddi shu sharoitda qayta o'lchash
  6. Oldin va keyin sonlarini solishtirish
- Uyalar: 6 ta, har birida faqat raqam va «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib mos emas — bo'lakni bosib qaytaring. (43)
- Xulosa (yechilgach, bir marta): Bu darsda avval o'lchanadi, keyin tuzatiladi; «tezlashdi» — faqat oldin va keyin soni bilan. (92)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
✎ O'qitiladigan nuqtalar: 1 → 4 (avval o'lchov, keyin tuzatish — tuzatishdan keyin «oldin» soni yo'qoladi) va 5 → 6 (bir xil sharoit, son bilan solishtirish). «Bu darsda» — kurs tartibi, umumiy qonun emas (sinf 4). Bo'laklar — ot-shaklda (KORPUS §224).

## 13 · Amaliyot 1 — o'lchash: «Oldin»  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq)
- Eyebrow: Amaliyot 1 · o'z mahsulotingiz
- Sarlavha: **Lendingingizni o'lchab, sonlarni «Oldin» deb yozing.** (52)
- Mentor: Avval o'lchaysiz, keyin tuzatasiz — «1 · Ochish»dan boshlang.
- Model (tayanch 3, 13-Modul 12-dars bloki): to'rt qadamning hammasi o'quvchining o'z lendingi va ilovasida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab). Qadam nomlari: Ochish · O'lchash · Prompt · Tekshirish (13-Modul 12-darsi naqshi — o'lchash o'z qadamida).
- Trek (A-bo'lim 10): `pm-m9d8-platforma.trek` bo'lsa — kulrang qator «Trekingiz: mobil» (yoki «web»); yo'q bo'lsa — ikki chip «Mobil trek» · «Web-trek» (tanlov `pm-m12d3-tezlik.trek` ga). <!-- TAXMIN T5 -->
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Chrome'da yangi Incognito oyna oching: Ctrl + Shift + N (Mac: ⌘ + Shift + N). Unda lendingingiz manzilini oching (Netlify'dagi).
     DevTools'ni oching: F12 yoki Ctrl + Shift + I (Mac: Cmd + Option + I). Panellar qatoridan «Lighthouse» ni tanlang. Sozlang: Mode — «Navigation», Device — «Mobile», Categories — faqat «Performance».
     Incognito nega kerak — bir gap: brauzerga qo'shilgan dasturlar (Extensions) natijaga aralashmasin; Lighthouse hujjati shunday maslahat beradi.
  2. **O'lchash** — «Analyze page load» ni bosing va hisobotni kuting (odatda 30–60 soniya). Hisobotdan to'rt sonni kartaga yozing — bitta karta «Oldin», yorliq input ichida (E 43):
     `1 · Lighthouse bahosi (0–100)` · `2 · LCP, soniya` · `3 · CLS` · `4 · TBT, ms`.
     Keyin ilovangizning yuklanadigan kod hajmi — beshinchi maydon `5 · Kod hajmi, kB` (trekka qarab bitta yo'l ko'rinadi):
     - mobil trek — terminalda `mobil/` papkasida: `EXPO_ATLAS=true npx expo export`, keyin `npx expo-atlas .expo/atlas.jsonl`. Brauzerda Atlas oynasi ochiladi — Android uchun yuklanadigan kod hajmini yozing.
       Windows PowerShell'da birinchi buyruq boshqacha: `$env:EXPO_ATLAS="true"; npx expo export`. Ishlamasa — agentdan so'rang: «Expo Atlas'ni shu kompyuterda ishga tushirish buyrug'ini ayt. Hech narsani o'zgartirma.»
     - web-trek — terminalda `prototip/` papkasida: `npm run build`. Terminal har faylning hajmini kB da ko'rsatadi — `.js` fayllar hajmini yozing (bir nechta bo'lsa, qo'shib).
     Hajm MB da chiqsa — kartadagi «MB» chipini tanlang, dars kB ga aylantiradi. «Saqlash» → `pm-m12d3-tezlik.oldin` (bo'sh maydon — `null`).
     Mobil trekda bir gap: `.expo/` papkasi push qilinmaydi — Atlas fayli ichida loyiha sozlamalari bor (Expo hujjati: faqat ishonchli odamga). `git status` da `.expo/` ko'rinsa — agentga: «`.expo/` papkasini `.gitignore` ga qo'sh.»
  3. **Prompt** — qavslar kartadan oldindan to'ldirilgan (yonida kulrang namuna); tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: repo ildizi — yangi fayl `TEZLIK.md`; `lending/` va `{ilova papkasi}` — faqat o'qish uchun.
     > Nima qilsin: `TEZLIK.md` ga «Tezlik» sarlavhasini, ostiga «Sahifa: lending · Mobile · Incognito · {bugungi sana}» qatorini va jadval yoz: ustunlar «Son · Oldin · Keyin»; qatorlar: Lighthouse bahosi — {baho} · LCP, s — {LCP} · CLS — {CLS} · TBT, ms — {TBT} · Kod hajmi, kB ({qayerdan}) — {kB}. «Keyin» ustuni bo'sh qolsin.
     > Keyin hech narsani o'zgartirmasdan ikki ro'yxat ber. 1) `lending/` dagi har rasm: fayl nomi, fayl hajmi, sahifada qanday o'lchamda ko'rinadi, `width` va `height` bormi, birinchi ekrandami yoki pastdami. 2) `{ilova papkasi}package.json` dagi kutubxonalardan kodda hech qayerda ishlatilmaganlari — har biri uchun qayerda va qanday qidirganingni ko'rsat.
     > Nima buzilmasin: `TEZLIK.md` dan boshqa faylga tegma. `.env` fayllariga tegma. O'zgargan fayllarni ayt.
     Qavslar (oldindan): {ilova papkasi} — trekdan: `mobil/` yoki `prototip/` · {baho}, {LCP}, {CLS}, {TBT}, {kB} — «Oldin» kartasidan · {qayerdan} — trekdan: «Expo Atlas» yoki «npm run build» · {bugungi sana} — dars sanasi.
     Agent tugatgach: `git status` — faqat `TEZLIK.md` (va `.gitignore`, agar qo'shilgan bo'lsa), `.env` va `.expo/` yo'q; `git add TEZLIK.md` → `git commit -m "tezlik oldin"` → `git push`.
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: repo ildizi — yangi fayl `TEZLIK.md`; `lending/` va `mobil/` — faqat o'qish uchun.
     > Nima qilsin: `TEZLIK.md` ga «Tezlik» sarlavhasini, ostiga «Sahifa: lending · Mobile · Incognito · {sana}» qatorini va jadval yoz: ustunlar «Son · Oldin · Keyin»; qatorlar: Lighthouse bahosi — {oldin baho} · LCP, s — {oldin LCP} · CLS — {oldin CLS} · TBT, ms — {oldin TBT} · Kod hajmi, kB (Expo Atlas) — {oldin kB}. «Keyin» ustuni bo'sh qolsin.
     > Keyin hech narsani o'zgartirmasdan ikki ro'yxat ber. 1) `lending/` dagi har rasm: fayl nomi, fayl hajmi, sahifada qanday o'lchamda ko'rinadi, `width` va `height` bormi, birinchi ekrandami yoki pastdami. 2) `mobil/package.json` dagi kutubxonalardan kodda hech qayerda ishlatilmaganlari — har biri uchun qayerda va qanday qidirganingni ko'rsat.
     > Nima buzilmasin: `TEZLIK.md` dan boshqa faylga tegma. `.env` fayllariga tegma. O'zgargan fayllarni ayt.
     Yordam ostida kulrang qator: Mentor misolining sonlari — «qur» da o'lchanadi; bu yerda `{…}`. <!-- TAXMIN T6 -->
  4. **Tekshirish** — (1) GitHub'da `TEZLIK.md` ni oching: jadvaldagi sonlar kartangizdagi bilan bir xilmi. (2) Agent ro'yxatlarida har band yonida dalil bormi: rasm — fayl hajmi va joyi; kutubxona — qayerda qidirilgani. Dalilsiz band — tanlanmaydi.
     (3) Ikki tuzatishni tanlang — tanlov kartasi (bittadan): «1-tuzatish — rasmlar» (ro'yxatdagi rasm(lar)ni belgilang yoki «Lendingda rasm yo'q») · «2-tuzatish — kutubxona yoki fayl» (bittasini belgilang yoki «Keraksizi topilmadi»). «Saqlash» → `pm-m12d3-tezlik.tuzatishlar`.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Lighthouse hisoboti maketi — doira `{oldin baho}` ⛔ va to'rt qator `{oldin LCP}` s · `{oldin CLS}` · `{oldin TBT}` ms; ostida Atlas kartasi — «Android · `{oldin kB}` kB» ⛔; ostida fayl kartasi `TEZLIK.md`: <!-- TAXMIN T6 -->
  «Tezlik» · «Sahifa: lending · Mobile · Incognito · {sana}» · jadval (Oldin ustuni to'la, Keyin — bo'sh). Pastda agent ro'yxatining ikki qatori: «{rasm fayli} — {hajmi} — pastda — `width` yo'q» · «{kutubxona} — `mobil/` da import yo'q» (⛔ «qur» da Mentor repo'sidan).
- Hammasi bajarilgach (yashil): «Oldin» sonlari yozildi va ikki tuzatish tanlandi — endi ularni qilasiz. (72)
- Qator (`QIzoh`, natija ostida, bitta): Agent ro'yxati — taklif: qaysi tuzatishni qilishni siz tanladingiz.
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-03-done` — <!-- TAXMIN T4 -->
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi.
- Ulgurmasangiz: Lighthouse uzoq kutilsa — 2-qadamdan keyin «Davom etish» ochiladi (sonlar saqlangan bo'lsa); 3–4-qadam 2-amaliyot boshida qilinadi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: o'lchovni o'quvchi o'zi qiladi (sinf 10) — agent faqat faylni yozadi va ro'yxat beradi; Atlas buyrug'i ishlamasa agent faqat buyruqni aytadi. «Ichida loyiha sozlamalari bor» — Expo hujjatidagi «contains inlined environment variables … treat it like your source code» ning sodda shakli (Manbalar 6). <!-- TAXMIN T5 -->
  Ro'yxatdagi «birinchi ekrandami» — agentning bahosi; o'quvchi A2 4-qadamda telefonda o'zi ko'radi. Kutubxonani o'chirish — A2 da, dalil va «Davom et» bilan (sinf 13).
- O'qituvchi eslatmasi: DevTools'da «Lighthouse» paneli ko'rinmasa — panellar qatoridagi «»» belgisi ostida bo'ladi (⛔ pilotda ko'riladi). Lighthouse o'lchovi paytida boshqa ilovalarni yopish so'raladi — sharoit bir xil bo'lsin. Sonlarni sinfda qo'l ko'tartirib solishtirilmaydi (TAQIQLAR 3).

## 14 · Amaliyot 2 — ikki tuzatish  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈16 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Rasmlarni tuzating va keraksiz kodni olib tashlang.** (51)
- Mentor: Talab tayyor — tanlagan ikki tuzatishingiz qavslarga qo'yilgan; «1 · Ochish»dan boshlang.
- Talab zinapoyasi: tayyor talab + 4 joy (`{rasmlar}`, `{kutubxona}` — 1-amaliyot tanlovidan; `{ilova papkasi}` — trekdan; `{avvalgidek ishlashi kerak bo'lgan ishlar}` — o'quvchi yozadi). 1-amaliyotda «Lendingda rasm yo'q» yoki «Keraksizi topilmadi» tanlangan bo'lsa — talabning o'sha bandi ko'rinmaydi.
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Tepada kulrang qator — 1-amaliyotdagi tanlovingiz: «1-tuzatish: {rasmlar} · 2-tuzatish: {kutubxona}».
     Bugun ilovaga yangi narsa qo'shilmaydi: agent «yana bir narsa qo'shay» desa — «Yo'q, faqat talabdagi ish» deng.
  2. **Prompt** — qavslarni tekshiring va to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `lending/` — rasmlar va `index.html`; `{ilova papkasi}` — `package.json` va kod.
     > Nima qilsin: 1) Rasmlar: {rasmlar} ni sahifada ko'rinadigan o'lchamidan katta bo'lmaydigan qilib kichraytir, fayl nomi va turi o'zgarmasin. `lending/index.html` dagi har `<img>` ga haqiqiy `width` va `height` yoz. Birinchi ekrandan pastdagi rasmlarga `loading="lazy"` qo'y, birinchi ekrandagi rasmga qo'yma.
     > 2) Kutubxona: {kutubxona} kodda ishlatilmasligini qayta tekshir va qayerda qidirganingni ko'rsat. Men «Davom et» deb yozmagunimcha o'chirma; keyin uni `{ilova papkasi}package.json` dan olib tashla.
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; lending ko'rinishi o'zgarmasin. Rasmni kichraytirish uchun loyihaga yangi kutubxona qo'shma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {rasmlar} — oldindan: 1-amaliyot tanlovi · «masalan: telefon maketi surati (`lending/` dagi fayl nomi)»
     - {kutubxona} — oldindan: 1-amaliyot tanlovi · «masalan: ro'yxatdagi, kodda ishlatilmaydigan kutubxona nomi»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — bo'sh · «masalan: kirish, «O'yinlar» ro'yxati, qo'shilish, «Qo'shilmoqchiman» tugmasi»
     Tekshiruv («Nusxalash» bosilganda, bloklaydi): bu joyda kamida ikkita ish vergul bilan bo'lmasa yoki «hammasi», «ilova» kabi bitta so'z bo'lsa — Ikkita aniq ish yozing: masalan, kirish, qo'shilish. (52)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek; nomlar ⛔ «qur» da 1-amaliyot ro'yxatidan):
     > Qayerda: `lending/` — rasmlar va `index.html`; `mobil/` — `package.json` va kod.
     > Nima qilsin: 1) Rasmlar: {Mentor rasmlari} ni sahifada ko'rinadigan o'lchamidan katta bo'lmaydigan qilib kichraytir, fayl nomi va turi o'zgarmasin. `lending/index.html` dagi har `<img>` ga haqiqiy `width` va `height` yoz. Birinchi ekrandan pastdagi rasmlarga `loading="lazy"` qo'y, birinchi ekrandagi rasmga qo'yma.
     > 2) Kutubxona: {Mentor kutubxonasi} kodda ishlatilmasligini qayta tekshir va qayerda qidirganingni ko'rsat. Men «Davom et» deb yozmagunimcha o'chirma; keyin uni `mobil/package.json` dan olib tashla.
     > Nima buzilmasin: kirish, «O'yinlar» ro'yxati, qo'shilish, real vaqt va «Qo'shilmoqchiman» tugmasi avvalgidek ishlasin; lending ko'rinishi o'zgarmasin. Rasmni kichraytirish uchun loyihaga yangi kutubxona qo'shma. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent kutubxona dalilini ko'rsatadi: qidiruv natijasida import yo'q bo'lsa — «Davom et» deb yozing; import topilsa — «To'xta, o'chirma» deb yozing (2-tuzatish qilinmaydi).
     Agent tugatgach: `git status` — o'zgargan fayllar agent ro'yxati bilan bir xil, `.env` va `.expo/` yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "tezlik: rasmlar va kutubxona"`, `git push`. Netlify lendingni yangilaydi — odatda bir necha daqiqa.
     Kutayotganda agentdan o'zgargan joyni ko'rsatishni so'rang (SABOQ 52; «Nusxalash» bilan):
     > O'zgartirgan kodingda ikki joyni fayl nomi va qator raqami bilan ko'rsat: `loading="lazy"` qo'yilgan `<img>` qatorlari va birinchi ekrandagi rasm qatori. Har biri nega shunday ekanini bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har gapini o'zingiz ko'ring:
     (1) Lendingingizni telefoningizda oching: tepadagi rasm aylantirmasdan ko'rinadimi, rasmlar xira yoki cho'zilgan emasmi, «Qo'shilmoqchiman» (yoki sizdagi asosiy tugma) bosiladimi.
     (2) `lending/index.html` da tepadagi rasm qatorida `loading="lazy"` yo'q, hamma `<img>` da `width` va `height` bor.
     (3) Ilova ishlaydimi: mobil trek — `npx expo start` → Expo Go'da asosiy yo'l (Mentor misolida: kirish → «O'yinlar» → «Qo'shilaman»); web-trek — `prototip/` da `npm run dev` va o'sha yo'l brauzerda.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.» → push → qayta tekshiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: fayl kartasi — `lending/index.html` (o'zgardi: `width`, `height`, pastdagilarga `loading="lazy"`) · `lending/{rasm fayli}` (kichraytirildi; hajmi `{oldin}` → `{keyin}` ⛔) · `mobil/package.json` (− `{kutubxona}` ⛔) · `mobil/package-lock.json` (o'zgardi);
  ostida kod bo'lagi — tepadagi va pastdagi `<img>` qatorlari (5-ekran kod kartasi shaklida, Mentor fayl nomlari ⛔); ostida telefon kengligidagi lending — rasmlar joyida.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - ikkala tuzatish qilindi — Ikki tuzatish qilindi — endi xuddi shu sharoitda qayta o'lchaysiz. (66)
  - bittasi «yo'q» bo'lgan — Bitta tuzatish qilindi — ikkinchisi uchun keraksiz narsa topilmadi. (67)
- Qator (`QIzoh`, natija ostida, bitta): Agentning «tayyor» degani — da'vo; tezlik o'zgargani 3-amaliyotdagi sonlardan bilinadi.
- Ulgurmasangiz: Netlify kutishi cho'zilsa — 4-qadamning (1) bandi 3-amaliyot boshida; «Davom etish» 3-qadamdan keyin ochiladi (SABOQ E 55). Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tuzatish talabini o'quvchi tanlovi to'ldiradi (sinf 13 — Mentorning qarori yo'q); kutubxonani o'chirish — qaytarib bo'ladigan (Git), lekin baribir dalil va «Davom et» bilan (sinf 13). Rasmni kichraytirish asbobini agent tanlaydi — loyihaga kutubxona qo'shilmaydi (Shubhali 5).
  «Tuzatish qilindi» atamasi bu blokda «… qilindi» shaklida; «tezlashdi» — faqat 3-amaliyotdan keyin son bilan (sinf 5). Web-trekda `npm run dev` — 11-Modul `prototip/` odati (TAYANCHGA SAVOL 14).
- O'qituvchi eslatmasi: agent rasmni o'zgartira olmasa (asbob yo'q) — o'quvchi faqat `width`, `height` va `loading` qismini qiladi; yakunda «1-tuzatish» baribir qilingan sanaladi (atributlar bor). Kutubxona olib tashlangach ilova ochilmasa — `git revert` emas, agentga xato qatori (eng sodda yo'l); kerak bo'lsa o'qituvchi yordam beradi.

## 15 · Amaliyot 3 — qayta o'lchash: «Keyin» va yangi versiya  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈10 daq)
- Eyebrow: Amaliyot 3 · o'z mahsulotingiz
- Sarlavha: **Xuddi shu sharoitda qayta o'lchang va solishtiring.** (51)
- Mentor: Sharoit o'sha qolsin: o'sha sahifa, Mobile rejimi, Incognito oyna — «1 · Ochish»dan boshlang.
- Qadamlar (o'z mahsulotingizda; nomlar: Ochish · Qayta o'lchash · TEZLIK.md · Yangi versiya — 13-Modul 12-darsi 3-amaliyot naqshi):
  1. **Ochish** — Netlify'da lendingning yangi versiyasi chiqqanini ko'ring (sahifani oching: rasmlar yangisi). Yangi Incognito oyna → lending → DevTools → «Lighthouse»: Mode — «Navigation», Device — «Mobile», Categories — faqat «Performance» (1-amaliyotdagidek).
  2. **Qayta o'lchash** — «Analyze page load» → to'rt son kartaga «Keyin» (yonida kulrang — «Oldin» sonlari). Kod hajmi — 1-amaliyotdagi o'sha buyruq bilan (mobil — Expo Atlas, web — `npm run build`). «Saqlash» → `pm-m12d3-tezlik.keyin`.
     Karta ostida solishtirish (bittadan qator, har biri sondan chiziladi — P-046): «Lighthouse bahosi: {oldin} edi, {keyin} bo'ldi — oshdi / o'zgarmadi / kamaydi» · LCP, CLS, TBT, kod hajmi — «kamaydi / o'zgarmadi / oshdi» (bular uchun kamaygani — yaxshi; yashil · kulrang · qizil).
     Ostida bir qator: Baho har o'lchashda biroz farq qilishi mumkin — shuning uchun sonning o'zi yoziladi, «tezlashdi» so'zi emas. Bir son boshqalarga teskari ketsa — yana bir marta o'lchang va ikkalasini yozing.
  3. **TEZLIK.md** — «Nusxalash» bilan agentga yuboring (qavslar kartadan oldindan):
     > Qayerda: `TEZLIK.md`.
     > Nima qilsin: «Keyin» ustuniga sonlarni yoz: Lighthouse bahosi — {baho} · LCP, s — {LCP} · CLS — {CLS} · TBT, ms — {TBT} · Kod hajmi, kB — {kB}. Jadval ostiga «Tuzatishlar» sarlavhasini va ikki qatorni yoz: {tuzatishlar}. Xulosa yoki baho so'zi qo'shma — faqat sonlar.
     > Nima buzilmasin: «Oldin» ustuni o'zgarmasin. Boshqa faylga tegma. O'zgargan fayllarni ayt.
     Agent tugatgach: `git status` — faqat `TEZLIK.md`; `git add TEZLIK.md` → `git commit -m "tezlik keyin"` → `git push`.
  4. **Yangi versiya** — o'zgargan ilovani odamlarga chiqaring (trekka qarab bitta yo'l ko'rinadi; 12-Modul 9.28):
     - mobil trek — brauzer ko'rinishi: `mobil/` da `npx expo export -p web`, keyin `netlify deploy --prod --dir dist` · APK — yangi o'rnatish fayli: `eas build -p android --profile preview`; tayyor bo'lgach lendingdagi «Android: ilovani o'rnatish» havolasi almashtiriladi (APK o'zi yangilanmaydi). Navbatni kutmang — dars davom etadi.
     - web-trek — push'dan keyin Netlify saytni odatda o'zi yangilaydi; telefoningizda ochib ko'ring, eski ko'rinsa — `prototip/` da `netlify deploy --prod`.
     2-tuzatish qilinmagan bo'lsa (kutubxona olib tashlanmagan) — ilova o'zgarmagan: bu qadamda «Ilova o'zgarmadi» ni bosing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: ikki Lighthouse doirasi yonma-yon — «Oldin · `{oldin baho}`» · «Keyin · `{keyin baho}`» ⛔; ostida to'rt qator juft (`{oldin LCP}` → `{keyin LCP}` …) va Atlas «`{oldin kB}` → `{keyin kB}` kB» ⛔; <!-- TAXMIN T6 -->
  ostida `TEZLIK.md` — Oldin va Keyin ustunlari to'la, «Tuzatishlar»: «rasmlar: o'lcham, width/height, keyin yuklash» · «kutubxona: {Mentor kutubxonasi}» ⛔; pastda terminal kartasi — `netlify deploy --prod --dir dist` natijasidagi manzil qatori (`….netlify.app`).
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6; sonlardan):
  - baho oshgan — Lighthouse bahosi {oldin} edi, endi {keyin} — sonlar TEZLIK.md da. (66)
  - baho oshmagan — Baho oshmadi — sonlar TEZLIK.md da; qaysi son o'zgarganini qarang. (66)
- Qator (`QIzoh`, natija ostida, bitta): Kod hajmi va baho alohida sonlar: biri kamayib, ikkinchisi o'zgarmasligi mumkin.
- Ulgurmasangiz: 4-qadam (brauzer ko'rinishi va APK) — uyga vazifa 1; 2-qadamdan keyin «Davom etish» ochiladi. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Measured Twice — 2-qadam «Saqlash»ida, «Oldin» va «Keyin» ikkalasi saqlangan bo'lsa (natijadan qat'i nazar — tavsif qilingan ishni aytadi; 13-Modul GATE M M-q6 A naqshi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: solishtirish kartasi faqat sonlardan; «tezlashdi» so'zi kartada yo'q — «oshdi / kamaydi» (sinf 5, tayanch 1.3). «Bir son boshqalarga teskari ketsa — yana bir marta o'lchang» — Lighthouse o'zgaruvchanligi uchun (rasmiy, Manbalar 2); o'lchov sonini (necha marta) dars belgilamaydi.
  `TEZLIK.md` ga xulosa so'zi yozilmaydi — o'quvchi pitchda (8, 13-darslar) shu sonlardan foydalanishi mumkin, lekin bu dars va'da qilmaydi (sinf 16).
- O'qituvchi eslatmasi: APK navbati uzoq bo'lishi mumkin (12-Modul: bepul navbat sekin) — podium va arena paytida yuradi. Lending push bilan yangilanmagan bo'lsa — Netlify sahifasida oxirgi yangilanish holatini ko'ring (tugma nomlari — umumiy so'z).

## 16 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 3 blok «Bajardim» (`PRACTICE_BASE`). QKod (11) — `practice: -1`.
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Bir xil sharoit» · 6 — «2 — Rasm joyi» · 8 — «3 — Keyin yuklash» · 10 — «4 — Javob bermagan vaqt» · 12 — «Yakuniy — ish tartibi»

## 17 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 18 · Yakun  ← QYakun (texnik darslar standarti, 192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ Oldin va keyin o'lchandi (faqat `oldin` va `keyin` ikkalasi saqlangan bo'lsa; aks holda yorliq yo'q) · {N}/5 to'g'ri
- Sarlavha (holatga qarab, P-046; sinf 6 — o'quvchi qilgan ishni aytadi, har holat rost — E 54):
  - `oldin` va `keyin` bor, baho oshgan — **Lighthouse bahosi {oldin} edi, endi {keyin}.** (≤55)
  - `oldin` va `keyin` bor, baho oshmagan — **Ikki o'lchov tayyor — farq TEZLIK.md da sonlarda.** (49)
  - `oldin` bor, 2-amaliyot bajarilgan, `keyin` yo'q — **Tuzatish qilindi — qayta o'lchash qoldi.** (40)
  - `oldin` bor, 2-amaliyot bajarilmagan — **«Oldin» sonlari yozildi — tuzatish hali qilinmagan.** (51)
  - hech biri — **Lending hali o'lchanmagan — qadamlarni uyda bajaring.** (53)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5):
  - Lighthouse sahifaga 0 dan 100 gacha baho beradi; oldin va keyin bir xil sharoitda o'lchanadi.
  - LCP — eng katta narsa ko'ringan vaqt, TBT — sahifa bosishga javob bermagan vaqt.
  - `width` va `height` rasm joyini oldindan band qiladi — sahifa siljimaydi.
  - `loading="lazy"` faqat pastdagi rasmga yoziladi, birinchi ekrandagisiga emas.
  - «Tezlashdi» — faqat oldin va keyin soni bilan aytiladi.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z mahsulotingiz · nechta — ikki ish · muddat — keyingi darsgacha):
  1. **Tugatish** — darsda ulgurmagan qismni bajaring: «Keyin» sonlari `TEZLIK.md` da bo'lsin; ilova o'zgargan bo'lsa — yangi versiyasi chiqsin (brauzer ko'rinishi, APK havolasi yoki sayt).
  2. **Ilova sahifasi** — Lighthouse'ni ilovangiz sahifasida ham ishlating (web-trek — sayt, mobil trek — brauzer ko'rinishi), xuddi shu sozlama bilan; sonlarni `TEZLIK.md` ga alohida qator qilib yozing. <!-- TAXMIN T5 -->
- Keyingi dars — «Loyiha kuni: demo uchun sayqal» <!-- TAXMIN T20 -->
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Shift Stopper** — Tugma siljiganda rasmga nima yozilishini topdingiz (6-ekran, 2-savol)
- **Lazy Below** — Keyin yuklash qaysi rasmga yozilishini topdingiz (8-ekran, 3-savol)
- **Quick Tap** — Tugma javob bermagan vaqtni qaysi son ko'rsatishini topdingiz (10-ekran, 4-savol)
- **Measured Twice** — Mahsulotingizni oldin va keyin o'zingiz o'lchadingiz (15-ekran, 2-qadam «Saqlash») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10: Shift Stopper · Lazy Below · Quick Tap · Measured Twice — 0).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod, qolganida raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Bir xil sharoit»
   - 1 · O'sha sahifa — oldin ham, keyin ham lending.
   - O'sha rejim · `Device: Mobile`
   - 3 · Incognito oyna — qo'shilgan dasturlar aralashmaydi.
   - Sinfga savol: Oldin Desktop'da, keyin Mobile'da o'lchasangiz, farq nimadan chiqqanini qanday bilasiz?
2. 2-savol (6-ekran) — «Rasm joyi»
   - 1 · Rasm kelguncha joyi bo'sh — tugma tepada.
   - Rasm keldi, tugma suriladi · CLS
   - Joy oldindan band · `width="180" height="320"`
   - Sinfga savol: Tugma pastga sakrasa, odam qayerni bosib qo'yishi mumkin?
3. 3-savol (8-ekran) — «Keyin yuklash»
   - Pastdagi rasm · `loading="lazy"`
   - 2 · Unga yaqinlashganda yuklanadi.
   - 3 · Tepadagi rasm — sahifa bilan birga, atributsiz.
   - Sinfga savol: Tepadagi rasm kech chiqsa, Lighthouse'dagi qaysi son o'zgaradi?
4. 4-savol (10-ekran) — «Javob bermagan vaqt»
   - 1 · Sahifa ko'rinadi, lekin brauzer kodni bajaryapti.
   - Bosish javobsiz qolgan vaqt · TBT, ms
   - 3 · Bu misolda kod kamaygach, tugma ertaroq javob berdi.
   - Sinfga savol: Kutubxonani o'chirishdan oldin nega dalil so'raladi?
5. Final (12-ekran) — «Ish tartibi»
   - 1 · O'lchash · 2 · «Oldin»
   - 3 · Ro'yxat · 4 · Ikki tuzatish
   - 5 · Qayta o'lchash · 6 · Solishtirish
   - Sinfga savol: Avval tuzatib, keyin o'lchasangiz, nimani bilolmay qolasiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Lighthouse nima? | Chrome ichidagi sahifani o'lchaydigan asbob | Undagi bo'lim nomi Performance — tezlik; baho 0 dan 100 gacha |
| Lighthouse bahosining ranglari qanday? | 0–49 qizil, 50–89 to'q sariq, 90–100 yashil | 100 bo'lishi shart emas — Lighthouse buni juda qiyin deydi |
| LCP nima? | Birinchi ekrandagi eng katta rasm yoki matn ko'ringan vaqt | Soniyada; rasmiy tavsiya — 2,5 soniya yoki kamroq |
| CLS nima? | Ko'rinib turgan narsalarning joyidan siljishi | Birliksiz son; rasmiy tavsiya — 0,1 yoki kamroq |
| TBT nima? | Sahifa bosishga javob bera olmagan vaqt | Millisekundda; Mobile rejimida 200 ms gacha — yashil |
| Rasm siljimasligi uchun unga nima yoziladi? | `width` va `height` | Brauzer rasm joyini oldindan band qiladi |
| Keyin yuklash nima? | Ekrandan tashqaridagi rasm faqat kerak bo'lganda yuklanishi | `loading="lazy"`; inglizchasi: lazy load |
| Birinchi ekrandagi rasm qanday yuklanadi? | Sahifa bilan birga — `loading="lazy"` siz | Ayniqsa LCP rasmi: kechiksa, LCP ham kechikadi |
| Yuklanadigan kod hajmi nima? | Ilova ochilganda yuklanadigan kod hajmi | Inglizchasi: bundle. Mobil trekda Expo Atlas ko'rsatadi |
| Web-trekda kod hajmini qayerda ko'rasiz? | `npm run build` natijasida | `.js` fayllar hajmi, kB da |
| Oldin va keyin qanday sharoitda o'lchanadi? | O'sha sahifa, Mobile rejimi, Incognito oyna | Baho har o'lchashda biroz farq qilishi mumkin |
| «Tezlashdi» deyish uchun nima kerak? | Oldin va keyingi sonlar | Ular `TEZLIK.md` da yoziladi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Lighthouse bahosi qaysi oraliqda bo'ladi? ✔ 0 dan 100 gacha · 10 dan 50 gacha · 0 dan 5 gacha · 1 dan 50 gacha
2. Lighthouse bahosida yashil rang qaysi oraliq? 50 dan 89 gacha · ✔ 90 dan 100 gacha · 0 dan 49 gacha · 70 dan 100 gacha
3. Lighthouse 100 ball haqida nima deydi? Har sahifa uchun majburiy · Faqat Desktop rejimida bor · ✔ Juda qiyin va kutilmaydi · Faqat yangi saytlarda bo'ladi
4. LCP uchun rasmiy tavsiya qancha? 0,1 soniya yoki kamroq · 200 ms yoki kamroq · 25 soniya yoki kamroq · ✔ 2,5 soniya yoki kamroq
5. CLS qanday birlikda o'lchanadi? ✔ Birliksiz son, masalan 0,05 · Soniyada, masalan 2,5 soniya · Millisekundda, masalan 200 ms · Kilobaytda, masalan 300
6. Lighthouse bahosida qaysi sonning ulushi eng katta? LCP — 25 foiz · ✔ TBT — 30 foiz · CLS — 25 foiz · FCP — 10 foiz
7. Tepadagi rasmga keyin yuklash qo'yilsa, nima bo'lishi mumkin? CLS nolga tushadi · Kod hajmi kamayadi · ✔ LCP kechikishi mumkin · Rasm umuman chiqmaydi
8. Mobil trekda yuklanadigan kod hajmini nima ko'rsatadi? Lighthouse bahosi · Netlify sahifasi · Render sozlamasi · ✔ Expo Atlas oynasi
9. Lighthouse'ni qaysi oynada ishga tushirasiz? ✔ Incognito oynasida · Netlify sahifasida · Antigravity oynasida · Expo Atlas oynasida
10. Mobile rejimida TBT qachon yashil bo'ladi? 600 ms dan ko'p bo'lsa · ✔ 200 ms gacha bo'lsa · 2500 ms gacha bo'lsa · 1000 ms dan ko'p bo'lsa
11. Kutubxonani o'chirishdan oldin agent nimani ko'rsatadi? Lighthouse bahosini · Yangi kutubxona nomini · ✔ Kodda ishlatilmaganini · Sahifa siljishini
12. «Tezlashdi» deyish uchun nima kerak? Agentning «tayyor» degani · Sahifaning yangi ko'rinishi · Sinfdoshning «tez» degani · ✔ Oldin va keyingi sonlar

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): Lighthouse · LCP · CLS · TBT · `width` · `height` · `loading="lazy"` · keyin yuklash · yuklanadigan kod hajmi · Expo Atlas · `npm run build` · Mobile · Incognito · TEZLIK.md · oldin · keyin · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 19 ekran: hook · rule · exploration · test · exploration ×2 · test · exploration · test · exploration · test · practice(kod) · test(final, `scope: 'final'`) · practice(blok) ×3 · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **1 (B)** · s6 **3 (D)** · s8 **0 (A)** · s10 **2 (C)** · s12 sentinel **0**; QKod (11) va bloklar (13, 14, 15) — `practice: -1`. `LESSON_META.lessonId` — `m12-03-v1`.
2. **Bitta manba (180):** `TEZLIK_SAHNA` (brauzer: sahifa turi `lending` | `ilova`, holatlar `bosh` · `matn` · `rasmKeldi` · `siljidi` · `joyBand`; Lighthouse paneli: sozlama qatori, doira, shkala, besh qator, vaqt chizig'i, kod ustuni) · `LENDING_NAMUNA` (sarlavha, tepadagi rasm, tugma, «Uch foyda», pastdagi ikki rasm — 12-Modul 1.1 matnlari + TAYANCHGA SAVOL 3) ·
   `LH_CHEGARA` (0–49 · 50–89 · 90–100; LCP 2,5 s; CLS 0,1; TBT 200 ms — Manbalar) · `MENTOR_OLCHOV` (`oldin`, `keyin`, `desktop` — hammasi `null`, «qur» da Mentor o'lchovi bilan to'ldiriladi; `null` bo'lsa sahna `{…}` o'rniga «—» ko'rsatadi va ⛔ darvoza yiqiladi) · `ISH_TARTIBI` (6 bo'lak) — 0–2, 4, 5, 7, 9, 12–15-ekranlar va kartochka shundan o'qiydi.
3. **`TezlikSahna`** komponenti: chapda brauzer (≈200×360, yorliq ramka ustida; manzil satri; yuklanish chizig'i; sahifa — `lending` yoki `ilova`), o'ngda Lighthouse paneli (logotipsiz). **Doira ranglari** — Lighthouse'ning o'z uch rangi (qizil · to'q sariq · yashil) maket ichida, alohida `LH_RANG` konstantasi (D3 tokenlaridan tashqarida — brend rangi kabi; q13 darvozasi uchun izoh bilan — Shubhali 10);
   qolgan hamma holat foni — D3 tokenlari (`ok`, `err`, `ink2`, `accent`). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: tz-ochish tz-analyze tz-desktop tz-sekin tz-element tz-bos tz-olcham tz-hammasi tz-keyin tz-tepa tz-ilova tz-olib tz-qayta`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **0-ekran:** «Ochish» → sahna holatlari ketma-ket (`bosh` → `matn` → `rasmKeldi`/`siljidi`), keyin variantlar faol; javobdan keyin Lighthouse paneli tug'iladi (kirish animatsiyasi). Kutish soni ko'rsatilmaydi.
5. **2-ekran:** «Analyze page load» → doira `MENTOR_OLCHOV.oldin.baho` gacha chiziladi; shkala bo'lagi yonadi; besh qator (FCP, Speed Index — kulrang). «Desktop» → `MENTOR_OLCHOV.desktop.baho`, keyin o'zi «Mobile» ga qaytadi. Ikki son teng bo'lsa — yorliq «bu safar bir xil chiqdi».
6. **4-ekran:** vaqt chizig'i 4 belgi; 2-qadamda sahifa elementlari bosiladigan (har birining o'z yengil chegarasi — E 40); to'g'ri element — `LENDING_NAMUNA.lcp` (sukutda tepadagi rasm; ⛔ «qur» da Mentor Lighthouse hisobotidagi LCP elementiga qarab).
7. **5-ekran:** 1-qadam — bosish payti rasm kelishi bilan bog'langan sahna holati (vaqtga tayanmaydi: bosilganda `rasmKeldi` → `siljidi` → bosish belgisi rasm ustida); o'chirgich 2-holat — kod kartasi almashadi, `joyBand` holati. Kod kartalari sahna ostida (E 46).
8. **7-ekran:** uch qadam; hisoblagich «Yuklangan: n / 3»; 2-qadamda avtomatik sekin aylantirish (reduced-motion'da — aylantirishsiz, rasmlar ketma-ket yonadi); 3-qadamda vaqt chizig'idagi «eng katta narsa» belgisi o'ngga suriladi (qizil).
9. **9-ekran:** sahifa `ilova` (brauzer ko'rinishi; karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10»); kod ustuni uch blok; 1-qadamda qizil chiziq va bloklar navbat bilan; 2-qadamda blok chiqadi; 3-qadamda ikki chiziq yonma-yon (son yo'q, faqat uzunlik).
10. **11-ekran (QKod) → `HtmlCompiler`** (ikki fayl: `index.html` — o'quvchi · `namuna.js` — tayyor, yagona JS fayl). Tekshiruvlar — atributlar (sinxron): (1) `.tepa` da `width` va `height` bor (`checks.attr`) · (2) `.tepa` da `loading` yo'q yoki `lazy` emas (yangi «yo'q» sharti — kichik o'rovchi, `src/compilator` ga tegilmaydi; bo'lmasa runtime `querySelector('.tepa').getAttribute('loading') !== 'lazy'`) ·
    (3) ikkala `.past` da `loading="lazy"`, `width`, `height` (`querySelectorAll` — ikkalasi). «Tugma siljishi» qatori — `namuna.js` hisoblaydi (1 soniya kechikish; tekshiruv emas). «Bajardim» shartlar ✓ bo'lgach ochiladi (§19). Qoralama kaliti `pm-m12d3-code`.
    Sinaldi (08.10, Chrome headless 390×700, scratchpad `md03/test.mjs`): boshlang'ich kod — «Tugma siljishi: 302 px» · to'g'ri kod — «0 px» · tepadagi `loading="lazy"` olib tashlanib, o'lchamsiz — «302 px». `HtmlCompiler` ning `IMG_FALLBACK` i `src` siz `<img>` da ishlamaydi (xato hodisasi yo'q) — «qur» da ko'riladi.
    ⚠️ Starter fayllar `.jsx` ichida shablon-satr — izohlarda backtik yo'q (CLAUDE.md); `namuna.js` JS satrlarida apostrofli so'z yo'q; qatorlar ≤70 belgi (SABOQ 37) — O'lchov bo'limi.
11. **13, 14, 15-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (`{…}` joylari). A1: «Oldin» kartasi (bitta karta, 5 maydon, yorliq input ichida — E 43; o'nlik vergul va nuqta ikkalasi qabul; «kB | MB» chipi — MB ×1000, Shubhali 8) → `pm-m12d3-tezlik.oldin`; 3-qadam prompti kartadan oldindan; 4-qadam tanlov kartasi (bittadan) → `tuzatishlar`.
    A2: `{rasmlar}`, `{kutubxona}` ← `tuzatishlar`; «yo'q» tanlansa talab bandi yashiriladi; `{avvalgidek…}` tekshiruvi (kamida ikki ish, QXato 51). A3: «Keyin» kartasi → `keyin`; solishtirish qatorlari sonlardan (yo'nalish: baho — oshgani yaxshi, LCP/CLS/TBT/kB — kamaygani yaxshi); 3-qadam prompti `keyin` va `tuzatishlar` dan; 4-qadam trekka qarab; «Ilova o'zgarmadi» tugmasi (2-tuzatish yo'q bo'lsa).
    Trek: `pm-m9d8-platforma.trek` → bo'lmasa A1 chiplari → `pm-m12d3-tezlik.trek`. «Davom etish»: A1 — 2-qadamdan keyin, A2 — 3-qadamdan keyin, A3 — 2-qadamdan keyin (E 55); blok bayrog'i — faqat 4-qadam «Bajardim»idan. «Ortda qoldingizmi» — faqat A1 (SABOQ 39).
    `ACH_TRIGGERS`: A3 2-qadam «Saqlash» (`oldin` va `keyin` bor) → Measured Twice. ⚠️ Qolipda yo'q (12–13-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam», son kartasi, solishtirish qatorlari, «Ulgurmasangiz» — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
12. `RECAPS` 5 (kalit = 3, 6, 8, 10, 12) · `Q_LABELS` {3, 6, 8, 10, 12} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 6 → Shift Stopper, 8 → Lazy Below, 10 → Quick Tap, A3 → Measured Twice) · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi») · `HW_TOKENS` fon so'zlari {uz, ru}.
13. Yakun sarlavhasi `pm-m12d3-tezlik` (`oldin`, `keyin`; baho taqqoslash — butun son) va 2-amaliyot blok bayrog'idan; `{oldin}`, `{keyin}` — o'quvchining sonlari (sarlavha ≤55 — ikki uch xonali son bilan ham).
14. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). Yakunda «Bugungi asosiy fikr» yo'q (E 50).
15. **Darvozalar:** `npm run gates -- src/12-Modull/ProductSpeedLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m14-dars-03-start` = `m14-dars-02-done` = `m13-dars-12-done` → `m14-dars-03-done`, tayanch 3) <!-- TAXMIN T4 -->
1. **O'lchov «oldin»** (⛔ «qur» darvozasi): Mentor lendingi (Netlify) — Chrome Incognito, DevTools → Lighthouse, Navigation · Mobile · Performance → baho, LCP, CLS, TBT; `mobil/` da `EXPO_ATLAS=true npx expo export` → `npx expo-atlas .expo/atlas.jsonl` — Android kod hajmi; 2-ekran uchun Desktop bahosi. Sonlar `MENTOR_OLCHOV` va MD ning `{…}` joylariga. <!-- TAXMIN T6 -->
2. **`TEZLIK.md`** (repo ildizi): «Tezlik» · «Sahifa: lending · Mobile · Incognito · {sana}» · jadval «Son · Oldin · Keyin» (Lighthouse bahosi · LCP, s · CLS · TBT, ms · Kod hajmi, kB (Expo Atlas)) · «Tuzatishlar» — ikki qator.
3. **Rasmlar** (`lending/`): agent ro'yxatidagi katta rasm(lar) sahifadagi o'lchamiga yaqin kichraytiriladi (nom va tur o'zgarmaydi) · har `<img>` — `width`, `height` · birinchi ekrandan pastdagilarga `loading="lazy"`, tepadagisiga yo'q (tayanch 3 teg 03).
4. **Kutubxona** (`mobil/`): agent dalil bilan topgan ishlatilmaydigan kutubxona `package.json` dan olib tashlanadi; topilmasa — `TEZLIK.md` «Tuzatishlar» da «kutubxona: keraksizi topilmadi» (tayanch 3 «keraksiz kutubxona olib tashlangan» — ⛔ pilot natijasi).
5. **Yangi versiya:** lending — push (Netlify) · brauzer ko'rinishi — `npx expo export -p web` → `netlify deploy --prod --dir dist` · APK — `eas build -p android --profile preview`, lendingdagi havola almashtiriladi · «Darslar va teglar» jadvaliga `m14-dars-03-done`.
6. **O'lchov «keyin»** — 1-banddagi sharoitda; sonlar `TEZLIK.md` va `MENTOR_OLCHOV.keyin` ga. Muhrdan oldin (⛔): Lighthouse UI yozuvlari Chrome versiyasida (Shubhali 2), Atlas oynasidagi Android hajmi qayerda (Shubhali 3), Windows PowerShell buyrug'i (Shubhali 4), Mentor lendingining LCP elementi (4-ekran), 90 daqiqa.

| Teg | Repo holati |
|---|---|
| `m14-dars-03-start` (= `m13-dars-12-done`) | 13-Modul oxiri; `TEZLIK.md` yo'q |
| `m14-dars-03-done` | `TEZLIK.md` (oldin/keyin) · lending rasmlari (o'lcham, `width`/`height`, pastdagilarga `loading="lazy"`) · `mobil/package.json` — keraksiz kutubxona olib tashlangan (⛔) · yangi versiya |

## Manbalar (o'zim tekshirdim yoki tayanch 6 orqali, 08.10.2026; o'quvchiga ko'rinmaydi)
1. Lighthouse — `developer.chrome.com/docs/lighthouse/performance/performance-scoring` (tayanch 6 / MANBA 5 va o'zim, 08.10.2026): vaznlar — First Contentful Paint 10% · Speed Index 10% · Largest Contentful Paint 25% · Total Blocking Time 30% · Cumulative Layout Shift 25% ·
   «0 to 49 (red): Poor; 50 to 89 (orange): Needs Improvement; 90 to 100 (green): Good» · «A 'perfect' score of 100 is extremely challenging to achieve and not expected.» · «A lot of the variability in your overall Performance score and metric values is not due to Lighthouse.» —
   sabablar: A/B testlar, tarmoq yo'li, boshqa qurilma, «Browser extensions that inject JavaScript and add/modify network requests», antivirus → 2-ekran, 3-savol, A1, arena 1–3, 6.
2. Chrome DevTools Lighthouse paneli — `developer.chrome.com/docs/devtools/lighthouse` va `developer.chrome.com/docs/lighthouse/overview` (o'zim, 08.10.2026): panel «Lighthouse»; rejimlar «Navigation» (sukut), «Timespan», «Snapshot»; Device «Mobile» / «Desktop»; kategoriya «Performance»; «Click **Analyze page load**»; «After 30 to 60 seconds, Lighthouse gives you a report»;
   «It is often recommend to run Lighthouse in incognito mode but even then this may still be subject to these influences.» · DevTools'ni ochish — `developer.chrome.com/docs/devtools/open`: Windows/Linux «F12 or Ctrl + Shift + I», Mac «Fn + F12 or Cmd + Option + I» ·
   Incognito — `support.google.com/chrome/answer/95464`: «Ctrl + Shift + n» (Windows/Linux/ChromeOS), «⌘ + Shift + n» (Mac) → A1, A3, arena 9.
3. LCP — `web.dev/articles/lcp` (o'zim, 08.10.2026): «LCP reports the render time of the largest image, text block, or video visible in the viewport, relative to when the user first navigated to the page.» · «sites should strive to have Largest Contentful Paint of 2.5 seconds or less» → 4-ekran, kartochka 3, arena 4.
   CLS — `web.dev/articles/cls`: «A layout shift occurs any time a visible element changes its position from one rendered frame to the next.» · «strive to have a CLS score of 0.1 or less» · sabablardan biri — «Images or videos with unknown dimensions»; CLS — birliksiz son (ta'sir ulushi × masofa ulushi) → 5-ekran, kartochka 4, arena 5.
4. Keyin yuklash — `web.dev/articles/browser-level-image-lazy-loading` (tayanch 6 / MANBA 5 va o'zim, 08.10.2026): `<img src="image.png" loading="lazy" alt="…" width="200" height="200">` · «Don't lazy-load images that are likely to be in-viewport when the page loads, especially LCP images.» ·
   «we recommend adding `width` and `height` attributes to all `<img>` tags» (o'lchamsiz keyin yuklanadigan rasm 0×0 deb olinishi mumkin) · qo'llab-quvvatlamaydigan brauzer atributni e'tiborsiz qoldiradi → 5, 7, 8, 11-ekranlar, arena 7.
5. TBT — `developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time` (o'zim, 08.10.2026): «TBT measures the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses.» · FCP va Time to Interactive orasidagi long task'lar; «any task that executes for more than 50 ms is a long task» ·
   Mobile chegaralari: 0–200 ms yashil · 200–600 to'q sariq · 600 dan ortiq qizil · tavsiya — keraksiz JavaScript'ni kamaytirish → 9-ekran, kartochka 5, arena 10.
6. Expo — `docs.expo.dev/guides/analyzing-bundles` (tayanch 6 / MANBA 5 va o'zim, 08.10.2026): `EXPO_ATLAS=true npx expo start` (Shift + M) · `EXPO_ATLAS=true npx expo start --no-dev` · `EXPO_ATLAS=true npx expo export` → `npx expo-atlas .expo/atlas.jsonl` · Atlas fayli «contains inlined environment variables» — «treat it like your source code and only share it with people you trust» ·
   web: `npx expo export -p web` → `npx lighthouse <url> --view`; SDK 51+ (tayanch 6). Windows'dagi muhit o'zgaruvchisi yozuvi hujjatda yo'q → Shubhali 4. → A1, A3, arena 8.
7. Vite — `vite.dev/config/build-options` (o'zim, 08.10.2026): `build.reportCompressedSize` (sukut `true`) — «Enable/disable gzip-compressed size reporting» · `build.chunkSizeWarningLimit` (500) — «Limit for chunk size warnings (in kB). It is compared against the uncompressed chunk size as the JavaScript size itself is related to the execution time.» → web-trek kod hajmi (A1, A3), 9-ekran O'qituvchi eslatmasi. Terminal chiqishining aniq ko'rinishi — Shubhali 3.
8. Kod oynasi namunasi — o'zim sinadim (08.10.2026, Chrome headless, `playwright-core`, oyna 390×700, scratchpad `md03/test.mjs`): boshlang'ich `index.html` → «Tugma siljishi: 302 px»; tepadagi rasmga `width="180" height="320"` → «0 px»; faqat `loading="lazy"` olib tashlansa — «302 px»; qisqa sahifada pastdagi `loading="lazy"` rasmlar baribir yuklandi (brauzer masofasi katta) → 11-ekran ✎.
9. Kursdagi so'zlar (grep, 08.10): lending — 12-Modul tayanchi 1.1 (`lending/index.html`, Netlify, «Qo'shilmoqchiman», telefon maketi) · `npx expo export -p web`, `netlify deploy --prod --dir dist`, `eas build -p android --profile preview` — 12-Modul tayanchi 1.7, 9.28 · `prototip/` (React + Vite) — 11-Modul tayanchi 3 ·
   «yangi versiya», 3-amaliyot qadam nomlari — 13-Modul `12-StabilizeDay-v3.md` · «birinchi ekran» — 12-Modul `08-PmDropOff-v3.md` (ilova ochilgandagi birinchi ekran) · Lighthouse, lazy load, bundle — kursda birinchi marta (MANBA 4).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Nima o'lchanadi** (eng muhimi; T5): tayanch 1.3 — «web (lending + sayt yoki iPhone brauzer ko'rinishi) — Lighthouse … mobil trek — Expo Atlas … + brauzer ko'rinishiga Lighthouse». Kalit sxemasida bitta `baho` bor (tayanch 8, pilot — «shu holicha majburiy»). Qaror:
   **Lighthouse — lending (ikkala trekda bir xil)**: rasmlar shu yerda (12-Modul 1.1 telefon maketi), HTML — `width`/`height`/`loading` to'g'ridan-to'g'ri, kod oynasidagi bilim ko'chadi; Mentor ham mobil trek — uning yagona HTML sahifasi lending. **Kod hajmi — ilova** (mobil — Expo Atlas, web — `npm run build`).
   1-tuzatish (rasm) lending bahosida, 2-tuzatish (kutubxona) kod hajmida ko'rinadi. Ilova sahifasining Lighthouse o'lchovi — uyga vazifa 2. Boshqacha bo'lsa (masalan Lighthouse — ilova sahifasi): 0, 2, 4, 5, 7-ekran sahnasi va A1–A3 qadamlari o'zgaradi; kalitga `sahifa` maydoni kerak bo'ladi.
2. **Web-trek kod hajmi — `npm run build`** (Vite chiqishidagi `.js` fayllar hajmi; Manbalar 7). Tayanchda web uchun kod hajmi yo'q (faqat Lighthouse) — `bundleKb` web-trekda ham yoziladi (`null` emas). Rad etilsa — web-trekda 5-maydon yashiriladi, 2-tuzatishning dalili faqat uyga vazifa 2 dagi o'lchov.
3. **Sahnadagi lending** — 12-Modul 1.1 matnlari (sarlavha, «Qo'shilmoqchiman», telefon maketi) + **pastdagi ikki rasm** («O'yin», «E'lon berish» ekranlari suratlari) — tayanchda pastdagi rasm yo'q; keyin yuklashni ko'rsatish uchun qo'shdim, sahna «namuna». «Qur» da Mentor lendingiga moslanadi (pastda rasm bo'lmasa — Mentor lendingiga qo'shilmaydi, sahna namuna bo'lib qoladi).
4. **Namuna o'lcham 180 × 320** (kod oynasi, 5-ekran kod kartasi, recap) — telefon ekrani nisbati (9:16 ga yaqin); Mentor lendingidagi haqiqiy o'lcham emas. Fayl nomlari `oyinlar.png` — 5-ekran kod kartasida namuna.
5. **9-ekran kutubxonasi** — «ishlatilmaydigan kutubxona» (nomsiz). Mentor ilovasida topilmasa — sahna namuna; A2 «Keraksizi topilmadi» yo'li va yakun shuni rost aytadi. Tayanch 3 teg 03 «keraksiz kutubxona olib tashlangan» — ⛔ pilot natijasiga bog'liq.
6. **`tuzatishlar`** — A1 4-qadamda tanlov yoziladi («rasmlar: …», «kutubxona: …»; «yo'q» tanlangani yozilmaydi); A2 shu tanlovni o'qiydi. Tayanchda qaysi qadamda yozilishi aytilmagan.
7. **Birliklar kalitda** — maydon nomi tayanchdagidek (`lcp`, `cls`, `tbt`, `bundleKb`), birlik ta'rifda: soniya · birliksiz · ms · kB; karta birlikni ko'rsatadi. «Son yolg'iz emas» — birlik maydon nomiga qo'shilsinmi (`lcpS`, `tbtMs`) — qaror sizda; 6-dars shu kalitni o'qiydi.
8. **Yakun — besh holat** (18-ekran): baho oshgan (sonlar bilan) · oshmagan · tuzatish qilingan (2-amaliyot bayrog'i), keyin yo'q · faqat oldin · hech narsa. «Tezlashdi» so'zi hech bir holatda yo'q — sonlar o'zi aytadi.
9. **Nishonlar:** Shift Stopper · Lazy Below · Quick Tap · Measured Twice (grep 0); Measured Twice — natijadan qat'i nazar (13-Modul M-q6 A naqshi).
10. **Hook** — «Hakamlar oldida kutish uzoq tuyuladi» (Mentor gapi; hakam gapisiz); variantlar: boshqa kompyuter · ✔ o'lchov asbobi · agentga «tezlashtir». Topshiriqdagi «demo paytida sahifa sekin ochiladi» — sahna lending (demo stsenariysi 6-darsda, u yerga tegmadim).
11. **«Performance»** — o'quvchi matnida faqat Lighthouse UI yorlig'i sifatida (A1 1-qadam, 2-ekran sahnasi, kartochka 1 izohi «Undagi bo'lim nomi Performance — tezlik»). Tayanch 2 «performance (prozada)» ni taqiqlaydi, T19 «Performance nomi bilan» ga ruxsat beradi.
12. **«Mobile rejimi»** (tayanchda «mobil rejim») — «mobil trek» bilan bir darsda ikki ma'no bo'lmasligi uchun Lighthouse yozuvi bilan (T-015).
13. **«birinchi ekran»** — «sahifa ochilganda pastga aylantirmasdan ko'rinadigan qism» (tayanch 1.3 so'zi); 12-Modul 8-darsida «ilova ochilgandagi birinchi ekran» — yaqin ma'no. Boshqa so'z kerakmi (masalan «sahifa tepasi»)?
14. **Web-trek tekshiruvi** A2 4-qadamda `npm run dev` (11-Modul `prototip/` odati deb oldim — tayanchda aniq buyruq yo'q).
15. **A3 «Yangi versiya»** — APK yangi build darsda boshlanadi, navbat kutilmaydi (12-Modul 9.28, 13-Modul 12-darsi naqshi); kutubxona olib tashlanmagan bo'lsa — «Ilova o'zgarmadi».
16. **«Oldin» kartasi** — bitta karta, besh qisqa son maydoni (E 53 «bittadan karta» — uzun matnli maydonlar uchun; sonlar qisqa — bir kartada). Rad etilsa — sonlar bittadan.
17. **«Sonlarni sinfda solishtirilmaydi»** — reyting yo'q (TAQIQLAR 3); O'qituvchi eslatmasida.
18. **Uyga vazifa ikki bandi** (tugatish · ilova sahifasini o'lchash) — yengil (sinf 14); 2-band tayanch 1.3 ning ilova sahifasi qismini qoplaydi.
19. **Reja sarlavhasi** «Bugun lendingingizni o'lchab, ikki joyni tuzatasiz.» va to'rt qadam (teglar `sub` so'zlaridan: Lighthouse · rasmlar · yuklanadigan kod hajmi · oldin va keyin).
20. **«Ortda qoldingizmi»** — faqat A1 da, teg `m14-dars-03-done` (tayanch 3). O'lchov darsida Mentor repo'si o'quvchiga faqat ko'rish uchun (o'lchash uchun deploy kerak) — gap o'zgarishsiz qoldi.

## Shubhali joylar (ishonchim komil emas)
**⛔ «qur» darvozasi (pilotda sinaladi — o'lchanmaguncha da'vo emas):**
1. ⛔ **Mentor sonlari** — Lighthouse (oldin/keyin, Desktop), LCP, CLS, TBT, Expo Atlas kB; Mentor lendingidagi rasmlar va LCP elementi (4-ekran); keraksiz kutubxona — hammasi `{…}`, «qur» da Mentor repo'sida o'lchanadi (tayanch 1.14, T6).
2. ⛔ **Lighthouse UI yozuvlari** («Lighthouse» paneli, «Navigation», «Mobile», «Performance», «Analyze page load») — rasmiy hujjatdan (08.10), lekin Chrome versiyasiga qarab farq qilishi mumkin; panel «»» ostida yashirinishi — pilotda.
3. ⛔ **Expo Atlas oynasi** — Android kod hajmi qayerda va qaysi birlikda (kB/MB) ko'rinishi; **`npm run build`** chiqishining ko'rinishi (Vite) — o'zim ko'rmadim, umumiy so'z bilan yozildi.
4. ⛔ **Windows PowerShell** — `$env:EXPO_ATLAS="true"; npx expo export` (PowerShell sintaksisi; Expo hujjatida yo'q); zaxira — agentdan buyruq so'rash.
5. ⛔ **Agent rasmni kichraytira oladimi** (Antigravity muhitida, loyihaga kutubxona qo'shmasdan) — pilotda; bo'lmasa A2 O'qituvchi eslatmasidagi yo'l (faqat atributlar).
6. ⛔ **90 daqiqa** — uch blok, uch tashqi kutish; taymer bilan pilotda (A-11 qisqartirish).
7. ⛔ **Kod oynasi `HtmlCompiler` ichida** — `src` siz `<img>` va `width`/`height` bilan joy band bo'lishi, «Tugma siljishi» hisobi: oddiy Chrome sahifasida sinaldi (Manbalar 8), platforma oynasida emas; «yo'q» sharti (`loading` tepada bo'lmasin) — yangi o'rovchi (KOD 10).

**Boshqa shubhalar:**
8. **MB → kB** — ×1000 deb oldim (Atlas 1000 yoki 1024 ishlatishi noma'lum); oldin va keyin bir xil birlikda o'lchangani uchun farq yo'nalishi to'g'ri qoladi.
9. **5-ekran 1-qadami** — bosish «rasm kelgan lahzaga» bog'langan sahna; haqiqiy sahifada siljish vaqtga bog'liq. Sahna buni «bosish shu yerga tushdi» deb ko'rsatadi — vizual bosqichda tabiiy ko'rinishi kerak.
10. **Lighthouse ranglari** (qizil · to'q sariq · yashil) — D3 tokenlarida to'q sariq yo'q; maket ichida Lighthouse'ning o'z ko'rinishi (`LH_RANG`). q13 darvozasi buni xato deb ushlashi mumkin — quruvchi izoh bilan ruxsat oladi yoki asosiy seans qaror qiladi.
11. **Lending Netlify'da push bilan yangilanadi** — 12-Modul tayanchidan (9.28: «odatda o'zi yangilanadi»); o'quvchining lendingi qo'lda deploy qilingan bo'lsa — A2 3-qadamdagi gap rost bo'lmaydi; A3 O'qituvchi eslatmasi.
12. **Mobile va Desktop bahosi farqi** (2-ekran 2-qadam) — odatda farq qiladi, lekin Mentor lendingida bir xil chiqishi mumkin; KOD 5 ikkala holatni ko'zda tutadi.
13. **LCP «soniyada»** — Lighthouse hisoboti LCP ni «s» bilan ko'rsatadi deb oldim (rasmiy chegaralar soniyada); kichik qiymatlarda boshqacha ko'rsatishi mumkin — karta maydoni soniya.
14. **Lending o'quvchida rasmsiz bo'lishi** — unda 1-tuzatish «Lendingda rasm yo'q» bo'ladi (A1 4-qadam), baho ozroq o'zgaradi; yakun sarlavhasi buni rost aytadi («baho oshmadi»). Lighthouse bahosi lendingda allaqachon yuqori bo'lishi ham mumkin — darsning maqsadi o'lchash tartibi, katta farq emas.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔ pilot taymeri; A-bo'lim 11 (qisqartirish tartibi); har blokda «Ulgurmasangiz»; «sig'adi» deyilmagan (Shubhali 6).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Lighthouse UI yozuvlari rasmiy hujjatdan (Manbalar 2) + ⛔ Chrome versiyasi (Shubhali 2); Atlas va Vite chiqishi — umumiy so'z (Shubhali 3); PowerShell (4); Netlify tugmalari — «Netlify sahifasida … umumiy so'z»; Mentor sonlari — `{…}` ⛔ (1).
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d3-tezlik` tayanch 8 aynan (A-12): maydonlar, tiplar, birliklar, `null` — o'lchanmagan; `trek` o'z kalitiga; manzil, ism, login yozilmaydi; boshqa darsning kaliti yozilmaydi; kod oynasi — `pm-m12d3-code` (TAYANCHGA SAVOL 6, 7).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — xulosalar «Bu misolda», «Bu darsda», «Bu kodda»; final xulosasi «Bu darsda avval o'lchanadi…»; ikki tuzatish — «tanlagan ikki tuzatishingiz» (o'quvchi tanlovi); sahna — «namuna».
5. [x] **Kafolat va sabab da'vosi yo'q** — «tezlashdi» faqat son bilan (12-ekran, A3, yakun, kartochka 12, arena 12); 9-ekran xulosasi «Bu misolda»; A2 QIzohi «Agentning «tayyor» degani — da'vo»; A3 kartasida «oshdi / kamaydi», «tezlashdi» yo'q; kafolat so'zlari («darhol», «har doim», «albatta», «100%») o'quvchi matnida 0 (O'lchov grep).
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — 18-ekran besh sarlavha (hech narsa holati alohida); ✓ yorliq faqat ikkala o'lchovda; A2, A3 yashil xabari ikki holatli; blok bayrog'i 4-qadamdan; Measured Twice tavsifi qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — LCP (soniya), CLS (birliksiz), TBT (ms), kod hajmi (kB) — birlik bilan; Lighthouse bahosi — 0–100, Mobile rejimi; rasmiy chegaralar son bilan (2,5 s · 0,1 · 200 ms); «tez» — doim baho yoki son bilan.
8. [x] **Test: bitta himoyalanadigan javob** — har testda distraktorlar kamida ikki turkumdan (3, 6, 8, 10-ekran ✎); haqiqiy hayotda rost bo'lib qolishi mumkin bo'lganlar chiqarildi («tezroq internet», «rasmsiz sahifada 100»); uzunlik ±15% (O'lchov); ✔ yolg'iz eng uzun emas.
9. [—] **Real odamlar xavfsizligi** — bu darsda real odam bilan ish yo'q. Tegadigani: sonlar sinfda qo'l ko'tartirib solishtirilmaydi (A1 O'qituvchi eslatmasi); `.expo/` va `.env` push qilinmaydi (A1, A2); hakam — ismsiz, gapsiz (0-ekran).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — Lighthouse va kod hajmini o'quvchi o'zi o'lchaydi (A1, A3); agent faqat fayl yozadi va ro'yxat beradi; Atlas buyrug'i ishlamasa agent faqat buyruqni aytadi; A2 tekshiruvini o'quvchi telefonda va ilovada o'zi qiladi.
11. [x] **Web-trek teng yo'l** — Lighthouse qadami ikkala trekda bir xil (lending); kod hajmi — web uchun `npm run build` (rasmiy Vite hujjati — to'qilmagan); A2 `{ilova papkasi}` va tekshiruv, A3 yangi versiya — har trek uchun bitta yo'l.
12. [x] **Mentor misoli ichki izchil** — lending matnlari 12-Modul 1.1 aynan; ilova kartasi «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; 1.14 jadvalidan boshqa son yo'q (3-dars — ⛔); 4-dars (sayqal) va 6-dars (demo) natijalari ochilmagan; yangi tafsilot — TAYANCHGA SAVOL 3, 4, 5.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — `{rasmlar}`, `{kutubxona}` — o'quvchi tanlovi; `{avvalgidek…}` — o'quvchi yozadi; kutubxonani o'chirish — dalil va «Davom et» (A2 3-qadam); koddan bilinmaydigan narsa so'ralmagan.
14. [x] **Uyga vazifa yengil va aniq** — ikki band, muddat bilan; 2-band — bitta o'lchov; ixtiyoriy narsa majburiydek aytilmagan.
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. Tuzat.», «{nima} talabdagidek emas: …»; «xatongiz emas», «sizda emas» — 0 (grep).
16. [x] **Kelajak va'dasi yo'q** — «mahsulot tezlashadi» yo'q; `TEZLIK.md` da xulosa so'zi yo'q (faqat sonlar); pitchda ishlatish — faqat ✎ da, va'da emas; keyingi dars — faqat yakundagi qatorda.
17. [—] **Pul va investitsiya** — bu darsda pul yo'q (Pro, to'lov tilga olinmaydi).
18. [—] **Yosh va rasmiy shartlar** — xalqaro sayt va dastur yo'q; tashqi asboblar (Lighthouse, Expo, Vite, Chrome) — faqat rasmiy hujjatdagi faktlar (Manbalar 1–7).
+ **Tashqi auditda RAD etilganlar** — hook «Aynan!» / «Qiziq fikr!» saqlangan [x] · yakundagi «Keyingi dars — «…»» qatori [x] · Reja sarlavhasi — natija-gap [x] · ekranda ≤3 blok [x] · bank so'zi — keyssiz [—].
+ **12-Modul SABOQ E** — har variantning o'z chegarasi (0, 4) [x] · maketda kesilmaydi (brauzer o'lchami barqaror) [x] · taxmin qatori yashil xulosa ichida [x] · yorliq input ichida (A1, A3 kartalari) [x] · bittadan karta (A1 4-qadam tanlovi) [x] · yakun standart [x].

## O'lchov (scratchpad `md03/olchov.py` + `md03/olchov2.py`, 08.10.2026; yakuniy fayl bo'yicha)
Belgilar — oddiy `len` (✔ va boshidagi bo'shliqsiz). `!!!` — chegaradan oshgan joy: yakuniy yurishda **0** (oldingi yurishda topilgan 1 yakun sarlavhasi (59), 1 test (✔ yolg'iz eng uzun), 2 arena qatori (✔ yolg'iz eng uzun · ±15%) tuzatildi; 35 ta yozilgan belgi soni o'lchovga moslandi).
Mentor gaplari — interaktiv ekranlarda bitta gap, 1-ekran (reja) va 11-ekran (kod oynasi) — ikki gap. Sarlavha ≈ Mentor so'z ulushi — 0-ekranda 50% edi (Mentor gapi almashtirildi), 4-ekran 2-qadam gapi almashtirildi.
Kafolat va taqiq so'zlari («darhol», «har doim», «albatta», «100%», «kafolat», «tezlashadi», «optimizatsiya») — o'quvchi matnida **0**; MD dagi uchrashuvlar faqat qoida qatorlarida (tepadagi chegara, A-5 «Ishlatilmaydi», sinf 5 o'z tekshiruvi). «performance», «bundle», «lazy load» — o'quvchi matnida faqat UI yorlig'i «Performance» (2-ekran, A1, A3) va kartochkadagi «inglizchasi» (7, 9); qolgani — URL, kalit nomi `bundleKb`, MD izohlari.
`npm run -s lint:til` — **TOZA** (0 error, 0 warn; birinchi yurishda 6 error — `ekran-nomi-tarjimasi` 5, `tavsiya-etiladi` 1 — va 4 warn `toladi-fe'l` — qatorlar qayta yozildi).

```
## Sarlavhalar (≤55)
    50 Sahifangiz sekin ochilsa, sababini qanday topasiz?
    51 Bugun lendingingizni o'lchab, ikki joyni tuzatasiz.
    48 Sahifa qanchalik tez ochilishini nima o'lchaydi?
    44 Sahifadagi eng katta narsa qachon ko'rinadi?
    41 Rasm kelganda tugma nega pastga sakraydi?
    43 Ko'rinmayotgan rasmni qachon yuklash kerak?
    50 Sahifa ko'rinib turibdi — tugma nega bosilmayapti?
    49 Rasm kelganda tugma joyida qoladigan kod yozamiz.
    43 Tezlashtirish ishi qaysi tartibda qilinadi?
    52 Lendingingizni o'lchab, sonlarni «Oldin» deb yozing.
    51 Rasmlarni tuzating va keraksiz kodni olib tashlang.
    51 Xuddi shu sharoitda qayta o'lchang va solishtiring.
    25 O'zingizni sinab ko'ring.
    44 [yakun] Lighthouse bahosi {oldin} edi, endi {keyin}.
    49 [yakun] Ikki o'lchov tayyor — farq TEZLIK.md da sonlarda.
    40 [yakun] Tuzatish qilindi — qayta o'lchash qoldi.
    51 [yakun] «Oldin» sonlari yozildi — tuzatish hali qilinmagan.
    53 [yakun] Lending hali o'lchanmagan — qadamlarni uyda bajaring.
## Xulosalar (≤110)
    98 (yozilgan 98) Bu darsda tezlik Lighthouse bahosi bilan o'lchanadi: oldin va keyin — o'sha sahifa, o'sha rejimda.
    79 (yozilgan 79) Bu misolda eng katta narsa — tepadagi rasm: u kech kelsa, LCP ham kech bo'ladi.
    88 (yozilgan 88) Bu misolda `width` va `height` rasm uchun joyni oldindan band qiladi — tugma siljimaydi.
    97 (yozilgan 97) Bu misolda `loading="lazy"` faqat pastdagi rasmlarda: tepadagi rasm sahifa bilan birga yuklanadi.
    79 (yozilgan 79) Bu misolda kod kamaygach brauzer ertaroq bo'shadi va tugma ertaroq javob berdi.
    89 (yozilgan 89) Bu kodda tepadagi rasm sahifa bilan birga, pastdagilar keyin yuklanadi; tugma siljimaydi.
    92 (yozilgan 92) Bu darsda avval o'lchanadi, keyin tuzatiladi; «tezlashdi» — faqat oldin va keyin soni bilan.
## Hook javoblari (≤120)
    93 (yozilgan 93) Aynan! O'lchov qaysi joy sekinligini son bilan ko'rsatadi — tuzatish o'sha joydan boshlanadi.
    97 (yozilgan 97) Qiziq fikr! Boshqa kompyuterda boshqacha ochilishi mumkin — lekin qaysi joy sekinligi bilinmaydi.
    86 (yozilgan 86) Qiziq fikr! Agent ham nimani tuzatishni bilishi kerak — avval buni o'lchov ko'rsatadi.
## Xato izohlari / QXato / shart / yashil (≤60 / ≤110)
    46 (yozilgan 46) Rejim almashsa, baho boshqa sharoitda chiqadi.
    44 (yozilgan 44) Agentning gapi — da'vo; keyingi son qayerda?
    53 (yozilgan 53) Ikki xil sahifa — ikki xil son; nimani solishtirasiz?
    52 (yozilgan 52) [QXato] Bu ham ko'rinadi — lekin undan kattaroq narsa bormi?
    41 (yozilgan 41) Rang o'zgarsa ham rasm joyi bo'sh qoladi.
    47 (yozilgan 47) Bu rasm tepada — uning joyini nima band qiladi?
    53 (yozilgan 53) Boshqa brauzerda ham rasm o'lchami oldindan noma'lum.
    57 (yozilgan 57) Bu rasm birinchi ko'rinadi — kechiksa, LCP ham kechikadi.
    47 (yozilgan 47) Tepadagi rasm ham kechikadi — LCP nima bo'ladi?
    48 (yozilgan 48) Hajm emas, joyi muhim: rasm sahifaning qayerida?
    49 (yozilgan 49) LCP ko'rinishni o'lchaydi — bosishga javobni-chi?
    44 (yozilgan 44) Tugma joyida turgan edi — siljish bo'lmagan.
    56 (yozilgan 56) Rasmlar soni vaqt emas — kutilgan vaqtni nima o'lchaydi?
    40 (yozilgan 40) Tepadagi rasmda `width` va `height` bor.
    38 (yozilgan 38) Tepadagi rasmda `loading="lazy"` yo'q.
    54 (yozilgan 54) Pastdagi ikki rasmda `loading`, `width`, `height` bor.
    43 (yozilgan 43) [tartib] Tartib mos emas — bo'lakni bosib qaytaring.
    52 (yozilgan 52) [tekshiruv] Ikkita aniq ish yozing: masalan, kirish, qo'shilish.
## Bloklar «Hammasi bajarilgach» (≤110)
    72 (yozilgan 72) «Oldin» sonlari yozildi va ikki tuzatish tanlandi — endi ularni qilasiz.
    66 (yozilgan 66) Ikki tuzatish qilindi — endi xuddi shu sharoitda qayta o'lchaysiz.
    67 (yozilgan 67) Bitta tuzatish qilindi — ikkinchisi uchun keraksiz narsa topilmadi.
    66 (yozilgan 66) Lighthouse bahosi {oldin} edi, endi {keyin} — sonlar TEZLIK.md da.
    66 (yozilgan 66) Baho oshmadi — sonlar TEZLIK.md da; qaysi son o'zgarganini qarang.
## Mentor gaplari (gap soni · belgi)
    1 gap 79 | 0 · Kirish — sahifa sekin ochiladi  ← | Hakamlar oldida kutish uzoq tuyuladi — «Ochish» ni bosing va sahifani kuzating.
    1 gap 41 | 0 · Kirish — sahifa sekin ochiladi  ← | Endi o'ngdagi javoblardan birini tanlang.
    2 gap 164 | 1 · Reja  ← QReja | 13-Modulda mahsulotingiz buzilmasligini tekshirgansiz — bugun u qanchalik tez ochilishini 
    1 gap 74 | 2 · Lighthouse bahosi  ← QTushuncha ( | Chrome ichida o'lchov asbobi bor — o'ngdagi «Analyze page load» ni bosing.
    1 gap 58 | 2 · Lighthouse bahosi  ← QTushuncha ( | Endi tepadagi «Desktop» ni bosib, bahoni yana bir ko'ring.
    1 gap 58 | 4 · Eng katta narsa — LCP  ← QTushunc | Lendingni qadamma-qadam oching — «Sekin ochish» ni bosing.
    1 gap 54 | 4 · Eng katta narsa — LCP  ← QTushunc | Endi o'sha narsani sahifaning o'zida bosib ko'rsating.
    1 gap 63 | 5 · Sahifa siljishi — CLS  ← QTushunc | Avval «Sahifani ochish» ni, keyin «Qo'shilmoqchiman» ni bosing.
    1 gap 72 | 5 · Sahifa siljishi — CLS  ← QTushunc | Endi rasmga o'lcham yozing — «`width` va `height`» o'chirgichini yoqing.
    1 gap 60 | 7 · Pastdagi rasmlar — keyin yuklash  | Ikki usulni solishtiring — avval «Hammasi birdan» ni bosing.
    1 gap 72 | 7 · Pastdagi rasmlar — keyin yuklash  | Endi pastdagi ikki rasmni keyinga qoldiring — «Keyin yuklash» ni bosing.
    1 gap 80 | 7 · Pastdagi rasmlar — keyin yuklash  | Shu atributni tepadagi rasmga ham qo'yib ko'ring — «Tepadagisiga ham» ni bosing.
    1 gap 74 | 9 · Javob bermagan vaqt — TBT va kod  | Endi ilovaning brauzer ko'rinishini oching — «Ochish va bosish» ni bosing.
    1 gap 75 | 9 · Javob bermagan vaqt — TBT va kod  | Bu ilova kodida ishlatilmaydigan kutubxona bor — «Olib tashlash» ni bosing.
    1 gap 48 | 9 · Javob bermagan vaqt — TBT va kod  | Endi «Qayta ochish» ni bosing va farqni ko'ring.
    2 gap 163 | 11 · Rasm joyi va keyin yuklash  ← QK | Namunadagi uchala rasmda o'lcham yo'q, `loading="lazy"` esa noto'g'ri rasmda turibdi — tuz
    1 gap 43 | 12 · Ish tartibi (final)  ← QTartib ( | Bo'laklarni bajariladigan tartibda joylang.
    1 gap 61 | 13 · Amaliyot 1 — o'lchash: «Oldin»   | Avval o'lchaysiz, keyin tuzatasiz — «1 · Ochish»dan boshlang.
    1 gap 89 | 14 · Amaliyot 2 — ikki tuzatish  ← am | Talab tayyor — tanlagan ikki tuzatishingiz qavslarga qo'yilgan; «1 · Ochish»dan boshlang.
    1 gap 93 | 15 · Amaliyot 3 — qayta o'lchash: «Ke | Sharoit o'sha qolsin: o'sha sahifa, Mobile rejimi, Incognito oyna — «1 · Ochish»dan boshla
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  ✔B · 6 so'z · [45, 42, 45, 39] · o'rtacha 42.8 · OK  Oldin va keyingi bahoni qanday o'lchaysiz?
      A  45  Oldin Mobile rejimida, keyin Desktop rejimida
      B  42  Ikkalasini o'sha sahifada, Mobile rejimida
      C  45  Oldin Lighthouse bilan, keyin agentdan so'rab
      D  39  Oldin lendingda, keyin ilova sahifasida
  ✔D · 6 so'z · [38, 31, 33, 34] · o'rtacha 34.0 · OK  Rasm kelganda tugma siljidi. Nima qilasiz?
      A  38  Tugmaga yorqinroq rang va soya beraman
      B  31  Rasmga `loading="lazy"` yozaman
      C  33  Sahifani boshqa brauzerda ochaman
      D  34  Rasmga `width` va `height` yozaman
  ✔A · 4 so'z · [27, 31, 26, 24] · o'rtacha 27.0 · OK  `loading="lazy"` qaysi rasmga yoziladi?
      A  27  Sahifaning pastidagi rasmga
      B  31  Birinchi ekrandagi katta rasmga
      C  26  Sahifadagi hamma rasmlarga
      D  24  Eng kichik hajmli rasmga
  ✔C · 8 so'z · [27, 21, 25, 22] · o'rtacha 23.8 · OK  Sahifa ochilayotganda tugma bosilmadi. Qaysi son buni ko'rsatadi?
      A  27  LCP — eng katta narsa vaqti
      B  21  CLS — sahifa siljishi
      C  25  TBT — javob bermagan vaqt
      D  22  Yuklangan rasmlar soni
## Arena (12)
  ✔A · 5 so'z · [15, 15, 13, 14] · o'rtacha 14.2 · OK  1. Lighthouse bahosi qaysi oraliqda bo'ladi?
  ✔B · 6 so'z · [15, 16, 14, 16] · o'rtacha 15.2 · OK  2. Lighthouse bahosida yashil rang qaysi oraliq?
  ✔C · 6 so'z · [25, 26, 24, 29] · o'rtacha 26.0 · OK  3. Lighthouse 100 ball haqida nima deydi?
  ✔D · 5 so'z · [22, 18, 21, 22] · o'rtacha 20.8 · OK  4. LCP uchun rasmiy tavsiya qancha?
  ✔A · 4 so'z · [27, 28, 29, 23] · o'rtacha 26.8 · OK  5. CLS qanday birlikda o'lchanadi?
  ✔B · 7 so'z · [13, 13, 13, 13] · o'rtacha 13.0 · OK  6. Lighthouse bahosida qaysi sonning ulushi eng katta?
  ✔C · 8 so'z · [17, 18, 21, 21] · o'rtacha 19.2 · OK  7. Tepadagi rasmga keyin yuklash qo'yilsa, nima bo'lishi mumkin?
  ✔D · 7 so'z · [17, 16, 16, 17] · o'rtacha 16.5 · OK  8. Mobil trekda yuklanadigan kod hajmini nima ko'rsatadi?
  ✔A · 5 so'z · [18, 18, 20, 19] · o'rtacha 18.8 · OK  9. Lighthouse'ni qaysi oynada ishga tushirasiz?
  ✔B · 6 so'z · [22, 19, 20, 23] · o'rtacha 21.0 · OK  10. Mobile rejimida TBT qachon yashil bo'ladi?
  ✔C · 6 so'z · [19, 22, 22, 17] · o'rtacha 20.0 · OK  11. Kutubxonani o'chirishdan oldin agent nimani ko'rsatadi?
  ✔D · 5 so'z · [25, 27, 25, 23] · o'rtacha 25.0 · OK  12. «Tezlashdi» deyish uchun nima kerak?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Kod oynasi qatorlari (≤70)
  qatorlar: 46 · eng uzuni: 67
```

## TAXMIN belgilari (Tn · ekran) — jami 29 ta `<!-- TAXMIN Tn -->`
- **T4** (4) — repo teglari (`m14-dars-03-start/-done`, «Ortda qoldingizmi»): A-bo'lim · 1 · Reja · 13 · Amaliyot 1 · REPO
- **T5** (7) — nima o'lchanadi (Lighthouse — lending; kod hajmi — Expo Atlas / build; uyga vazifa 2 — ilova sahifasi): A-bo'lim ×3 · 9 · Javob bermagan vaqt · 13 · Amaliyot 1 ×2 · 18 · Yakun
- **T6** (10) — Mentor sonlari yo'q — `{…}` ⛔ pilot: tepa (sonlar chegarasi) · A-bo'lim · 1 · Reja · 2 · Lighthouse bahosi · 4 · Eng katta narsa · 5 · Sahifa siljishi · 13 · Amaliyot 1 ×2 · 15 · Amaliyot 3 · REPO
- **T19** (4) — atamalar (tezlik, Lighthouse bahosi, keyin yuklash, yuklanadigan kod hajmi): A-bo'lim · 2 · Lighthouse bahosi · 7 · Pastdagi rasmlar · 9 · Javob bermagan vaqt
- **T20** (4) — dars nomi va keyingi dars nomi: sarlavha va menyu qatori ×2 · Darsning ipi va bitta vizual · 18 · Yakun
Boshqa TAXMIN lar (T1–T3, T7–T18) bu darsga tegmaydi: pitch, sayqal, demo, video, frilans, dasturlar — 3-darsda yo'q (T8 «demo laptop brauzerida» — hookda ishlatilmadi, sahna lending).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m12-02` «Mahsulotingiz hikoyasini qanday aytasiz?» → **`m12-03` «Mahsulot tezligi: o'lchaymiz va tezlashtiramiz»** (osti «Lighthouse, rasmlar va yuklanadigan kod hajmi — oldin va keyin», 469-qator) → `m12-04` «Loyiha kuni: demo uchun sayqal»; reja teglari `sub` so'zlari bilan; yakundagi «Keyingi dars» — `00-NOMLAR.md` 4-qator (T20).
- [x] Bitta misol-ip («Maydon Jamoa»: lending → ilova; hook → bloklar); metafora yo'q; bitta vizual — `TezlikSahna` (brauzer + Lighthouse paneli; 9-ekranda o'sha brauzerda ilova sahifasi); o'quvchining o'z mahsuloti — 11-ekran (namuna) va uch blok. Keyssiz (tayanch 5).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 5, 7, 9 (va 0, 11, 12, 13–15) — matn-karta yo'q; bashoratlar tanlangach ixcham qator; har harakatli ekranda faol element halqada, Mentor aynan shu tugmani nomi bilan aytadi (bosqichga qarab).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — O'lchov bo'limi (0 ta oshish).
- [x] Atamalar tayanch 2 bilan bir xil (tezlik, Lighthouse bahosi, yuklanadigan kod hajmi, keyin yuklash; LCP · CLS · TBT — tayanch 1.3 ta'riflari); «Mobile rejimi» — UI yozuvi bilan (TAYANCHGA SAVOL 12); siz-forma; tugma ot-shaklda («Nusxalash», «Bajardim», «Saqlash»); agent promptlari — T-002 istisnosi; `lint:til` TOZA.
- [x] Testlar: variantlar bir shaklda, uzunligi ±15% (skript), ✔ yolg'iz eng uzun emas; kod/kalit so'z/tire faqat to'g'rida emas (`loading="lazy"`, «Mobile», «—» distraktorlarda ham) · ✔: s3 B · s6 D · s8 A · s10 C · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (3, 6, 8, 10, 12).
- [x] Final: uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q (o'quvchi matnida 0 — O'lchov).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — faqat MD izohlarida; o'quvchiga «1-amaliyot»…; `m12-03`, «pilot», «TAXMIN», «bundle», «lazy load» — yo'q, inglizchasi faqat kartochkada); modul raqami LMS bo'yicha («13-Modulda», «12-Modul»); tarixiy voqea yo'q · «KOD» (15) va «REPO» (6) ro'yxati to'liq.
- [x] Karta (`QURISH_KARTASI.md`) T · P · S ko'rildi: T-002 · T-008 (agent promptlari, `TEZLIK.md` matni) · T-009 · T-010 · T-011 (Lighthouse → Lighthouse bahosi → LCP → CLS → keyin yuklash → TBT → yuklanadigan kod hajmi — hammasi harakatdan keyin; sarlavhalarda yangi atama yo'q, LCP/CLS/TBT faqat test savolida va 10-ekran variantlarida, o'z ekranidan keyin) ·
      T-014/015 («mobil trek» ↔ «Mobile rejimi» ajratildi; «sinov» yo'q; «test» faqat ballik savol) · T-016/017 (metafora yo'q) · T-024 (Lighthouse UI yozuvlari aynan) · T-029 · T-034 · T-039 («lendingingiz», «mahsulotingiz» — 12–13-Moduldan bor) · T-042 · T-043 (sonlar — `{…}` yoki rasmiy chegara) · T-045 (9-ekran «Bu misolda») ·
      T-047 · T-048 · T-049 · T-052 (lending — 12-Modul so'zi bilan) · T-064 (5-ekran sarlavhasi hook so'zi «sakraydi» bilan) · T-066 · T-070 · P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-021 (1-ekran ko'prigi 13-Modul barqarorlashtirishdan) · P-025 · P-026 · P-028 (UI nomlari rasmiy, qolgani ⛔) · P-036 · P-046 (A3 solishtirish, yakun — sonlardan) · P-052 · P-055 · P-062 · P-063 (`ISH_TARTIBI`, `LH_CHEGARA`) · P-064 · P-065 (5-ekran kod kartasi) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 · S-019 (rang ma'nosi 2-ekranda o'rgatilgan; arena 2 savolida son kalitda takrorlanmaydi) · S-020 (LCP, CLS, TBT — test oldidan o'z ekranida ochilgan) · S-026 · S-040 · SABOQ 9, 11, 12, 13, 16, 17, 19–31, E 40–55.
