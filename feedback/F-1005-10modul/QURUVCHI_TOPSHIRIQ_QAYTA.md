# 10-Modul — pilotlarni qayta qurish (2 va 10-darslar, 2 agent)

> Foydalanuvchi ruxsati: 06.10.2026 ~00:00 — «rejang maqul», «avtopilot … agentlarni ishlatib … sifatli» + 22 rasmli fidbek (F-1005-174, F-1005-175).
> Har agent — faqat o'z fayli. MD ga tegilmaydi (o'zgarish kerak bo'lsa — hisobotda «MD ga taklif»). Commit, push, deploy — YO'Q.

| Agent | Fayl (`src/8-Modull/`) | MD | Fidbek rasmlari (`feedback/F-1005-10modul/rasm/`) |
|---|---|---|---|
| Q2 | `EventTrackingLesson.jsx` (TEX, 18 ekran) | `02-EventTracking-v3.md` | `F-1005-174-2dars-1…8.png` |
| Q10 | `PmYearPathLesson.jsx` (PM, 16 ekran) | `10-PmYearPath-v3.md` | `F-1005-175-10dars-9…24.png` |

## O'qish tartibi
1. `QURUVCHI_SABOQ.md` — TO'LIQ, ayniqsa yangi **C qismi (19–30)**. Bu qayta qurishning o'zagi.
2. O'z rasmlaringiz — har birini Read bilan ko'ring. Rasmdagi holatni o'zingiz qayta yasang (`node .shot10.tmp.mjs` — pastda).
3. O'z MD ingiz (ekranlar bo'limi) — matn so'zma-so'z qoladi; o'zgarayotgani — ko'rinish, joylashuv, harakat.
4. Faylingiz allaqachon ishlaydi (gates 12/12): kerakli ekranlarni qayta yozing, qolganini buzmang. `SCREEN_META`, kalitlar, `QUIZ_BANK`, saqlanadigan natija kalitlari — o'zgarmaydi.
5. Namuna (faqat ko'rish, ko'chirilmaydi): `src/6-Modull/PmLesson22.jsx` `AltairMock`, `src/6-Modull/PmLesson25.jsx` `DeckMock` — jonli sahna qanday qurilgan.

## Q2 · 2-dars «Hodisalar tizimi» — F-1005-174

| № | Ekran | Foydalanuvchi | Yechim (shu bo'yicha qiling) |
|---|---|---|---|
| 1 | hamma | «telefon ekrani qisqarmasin, hozir rasmdagiday tursin» (rasm 1) | Telefon maketi hamma ekran va holatda rasm 1 dagi o'lchamda (≈170×272). Bosh ekran holati ham, 6-ekrandagi ikki telefon ham. |
| 2 | 0 · kirish | «bandlar, Umami · Maydon — kerakmasmi? to'ldirib turibdi» (rasm 1) | `bandlar` jadvali va «Umami · Maydon» kartasi olib tashlanadi. O'rniga band qilingach telefon yonida **ikki jonli hisoblagich**: «Maydon jadvali: +1 band ✓» (qator sirg'alib kiradi, yashil) va «Umami: 0» (reklama to'sgichi belgisi bilan, kulrang). Savol variantlari o'ngda qoladi. |
| 3 | 1 · reja | «oddiy telefon bilan Sayt · React farqini vizual his qilmadim» (rasm 2) | Telefon = sayt (SABOQ 23): «Sayt · React» va `hodisaYoz` — telefon ramkasi ustidagi yorliq; alohida «Sayt» qutisi yo'q; `POST /hodisalar` chizig'i telefondan Backend'ga. Hamma chizma ekranlarida (0, 1, 2, 4, 6, 9, 10, 11, A1/A2) shu. |
| 4 | 2 · hodisa | «telefon chap tomonda bo'ladi, Sayt/React o'ng tomonda; savolga animatsiya — mehr bilan, jonsiz qilma» (rasm 3) | Telefon CHAPDA, chizma O'NGDA (SABOQ 21); qadamlar ro'yxati alohida ustun emas — tugma telefon ostida. Bashorat kartasi kirish animatsiyasi bilan, variantlar navbat bilan (SABOQ 19). Har bosishda so'rov konverti telefondan Backend'ga uchadi, so'ng `hodisalar` ga yangi qator yashil bo'lib kiradi. |
| 5 | 2 · yakun | «elementi ko'p, tushunarsiz va jonsiz» (rasm 4) | `bandlar` jadvali bu ekranda yo'q (mavzu — hodisa). Izoh + «Taxminingiz» + xulosa → bitta natija bloki (SABOQ 25). 1280×800 ga sig'adi. |
| 6 | 4 · Backend tekshiruvi | «navbat bilan qil, hammasi palapartish» (rasm 5) | Bir vaqtda BITTA katta so'rov kartasi → «Yuborish» → konvert Backend'ga uchadi → 201: jadvalga qator; 400: qizil «rad» qaytadi + bir qator sabab → keyingi karta. O'tganlari pastda bitta ixcham qator (`ochdi ✓ · Band qildi ✗ · …`). «Tekshiruvni o'chirib ko'ring» bosqichi ham shu oqimda. |
| 7 | 6 · brauzer ID | «bu page ham yaxshi emas» (rasm 6) | Ikki telefon CHAPDA yonma-yon, to'liq o'lchamda; har birining ostida o'z tugmasi («Ochish», «Yangilash»); brauzer xotirasi — telefon ichida pastki kichik qator; jadval O'NGDA. Bo'sh chap ustun va suzib yurgan tugma yo'q. |
| 8 | 6 · yakun | «bo'lmaydi» (rasm 7) | SABOQ 25: bitta natija bloki, bir ekranga sig'adi, ichki skroll yo'q. |
| 9 | 8 · kod | «chap tomon juda bo'sh, oyna jonsiz — minimalizm yaxshi, ammo juda jonsiz, bu general» (rasm 8) | Chap karta cho'zilmaydi. Vazifa ostida **mini-telefon**: uch chaqiruv qachon «yonishini» ko'rsatadi (sahifa ochildi → katak bosildi → 201), har biri vazifa raqami bilan. Koddagi uchta «shu yerga» joyi 1, 2, 3 raqamli accent belgi bilan ajraladi; vazifa bandiga sichqoncha borsa koddagi mos joy va mini-telefondagi mos qadam yonadi. |
| 10 | qolgan ekranlar | «bu general» | 9, 10, 11, 12, A1, A2, yakun — C 19–30 bo'yicha qayta ko'ring (ayniqsa 21–26). |

## Q10 · 10-dars «Bir yilda nimalarni qurdingiz?» — F-1005-175

| № | Ekran | Foydalanuvchi | Yechim (shu bo'yicha qiling) |
|---|---|---|---|
| 1 | 0 · kirish | «pastdagini zo'r animatsiya qil, mehr ber, juda jonsiz» — modul nomlari qatori (rasm 9) | Portfolio maketi ostidagi chiziq: kattaroq, nomlar bir tomonda o'qiladigan; ekranga kirganda chiziq 1 dan 10 gacha chizilib boradi, modul nomlari navbat bilan chiqadi; javobdan keyin portfolio «Loyihalarim» bo'limi bilan chiziq solishtiriladi (kursda ko'p modul — portfolio'da kam loyiha). Mayda nuqtalar qatori yo'q (SABOQ 27). |
| 2 | 1 · reja | «buni ham zo'r, mehr bersang bo'ladi» (rasm 11, 12) | Chap ustun bo'sh (SABOQ 20): «Dars oxirida» — chiziqning jonli oldindan ko'rinishi: loyiha kartalari navbat bilan chiziqqa tushadi, oxirida «Keyin» katagi yonadi; ustunni to'ldiradi. |
| 3 | 2 · vaqt chizig'i | «juda kichkina, tushunarsiz; «bo'lgan bo'lsa — o'zingiz qo'shasiz» tugma borderdan chiqib ketibdi» (rasm 13, 14) | Chiziq katta va o'qiladigan (SABOQ 27): ikki qator (1–5 va 6–10) yoki har modulga ≥ 90 px; tanlangan karta katta, bosilganda chiziqdagi joyiga uchib tushadi. 1-modul ostidagi yozuv — oddiy kulrang chip, doira/pufak emas, chegaradan chiqmaydi. Yakundagi «bitta sahifa», «prodda ishlayotgan sayt» — pufak emas, chip. |
| 4 | 6 · Uzum (3/4) | «bu ko'p element» (rasm 16) | SABOQ 26: sahna + bitta vaqt qatori + bashorat. Takrorlangan yorliqlar (`ertasi kuni yetkazish`, `o'z mashinalari · topshirish punkti`) faqat o'z bosqichida, keyin yo'qoladi; chiziq ostidagi «muammodan» kabi pufaklar — bosqichida bir marta. |
| 5 | 6 · Uzum yakuni | «biroz ko'p element, tartibsiz» (rasm 17) | SABOQ 25: bitta natija bloki (taxmin qatori + xulosa); sahna kichrayadi yoki yig'iladi; bir ekranga sig'adi. |
| 6 | 7 · keyingi qadam | «elementlar slishkom mehrsiz, yaxshi tartiblash kerak» (rasm 18, 19) | Kartalar halqasi (glow) bir-biriga qo'shilib ketmasin; uch karta tartibli ustun yoki qator, «Keyin» katagi yonida; karta bosilganda katakka uchadi, uch belgi («bitta · aniq · chiziqdan o'sadi») navbat bilan ✓/✗ bo'ladi. Chiziq — 9 va 10 modul pastki nuqtalari bilan, lekin o'qiladigan o'lchamda. Telefon ko'rinishi (05.10 tuzatilgan) buzilmasin. |
| 7 | 9 · mustaqil ish | «bu page bo'lmaydi, dizayn umuman to'g'ri kelmayapti» (rasm 20) | SABOQ 29: bir vaqtda bitta katta karta (modul nomi · Qurdim · O'rgandim · tugmalar); yuqorida ixcham chiziq — har modul holat belgisi bilan (✓ · joriy · o'tkazildi), bosilsa o'sha modul kartasi ochiladi. 10 ta mayda karta yo'q. |
| 8 | 9 · to'ldirilgach | «ortiqroqda qil» (rasm 21) | Uzun matn kartani cho'zmaydi: ixcham ko'rinishda qisqartiriladi (…), to'liq matn faqat joriy kartada. Joy kengroq. |
| 9 | 10 · 30 soniya + Keyin | «umuman tushunarsiz» (rasm 22) | O'quvchi chizig'i toza: to'ldirilgan loyihalar — nomli chip (qisqartirilgan), o'tkazilgani — kulrang «o'tkazildi» chip. 1-qadam: katta taymer (aylana yoki katta son) + bitta tugma; 2-qadam: «Keyin» formasi. Bir vaqtda bitta qadam katta. |
| 10 | 10 · Keyin formasi | «tushunarsiz; oyoqni qo'ymaylik — bridge'da juda g'alati, yoqimsiz» (rasm 23) | SABOQ 28: ︵ yoylar («oyoq») HAMMA joydan olib tashlanadi (`yc-yoy`, o'tkazilgan nuqta yoyi). «Qaysi loyihadan o'sadi?» tugmalari qisqartirilgan nomlar bilan, bir-ikki qatorda tartibli. |
| 11 | 11 · kod | «bu yerda ham qara» (rasm 24) | Chap karta bo'sh (SABOQ 20): savol ostida natija oldindan ko'rinishi — funksiya qaytaradigan qatorlar (chiplar) savolga javob berilgach navbat bilan paydo bo'ladi; karta cho'zilmaydi. |
| 12 | qolgan ekranlar | «bu general» | 3, 4, 5, 8, 12, 13–15 — C 19–30 bo'yicha qayta ko'ring. |

## Texnik
- Suratlar: `cd /home/kali/Desktop/internetLesson && CHROME=/usr/bin/google-chrome SHOT_W=1280 SHOT_H=800 node .shot10.tmp.mjs <fayl> <ekran>` — oxirgi qator — surat yo'li.
  Env: `CLICK='sel1,sel2'` (ekran ichida bosish), `CLICK_WAIT=ms`, `SHOT_WAIT=ms`, `SHOT_LANG=ru`, `EVAL='js'`. zsh: o'lchamni ALOHIDA o'zgaruvchi bilan bering.
  Hamma ekran: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qayta/desk` (+ `SHOT_W=393`).
- Har o'zgarishdan keyin: `npm run gates -- <fayl>` **12/12** · `npm run -s lint:til -- <fayl>` 0 error.
- **Oldin/keyin:** har bandning rasmdagi holatini qayta yasab «keyin» suratini oling (1280 va 393), hisobotda yo'lini yozing — men o'zim ham ko'raman.
- Telefon (393) ko'rinishi buzilmasin; 05.10 tuzatishlari (⛶ telefonda alohida qatorda, 7-ekran 1–8 bitta qatorda, kod paneli o'raladi) saqlanadi.
- Vaqtinchalik fayllar — scratchpad ichida `<NN>-qayta/`. Turn-byudjeti ≤ 130. Faylni qayta-qayta to'liq o'qima (grep/sed oraliq). Savol bermang.
- Hisobot: har band — nima qilindi, surat yo'li, «4/4» (SABOQ 30) · darvozalar aynan · MD ga taklif · hal bo'lmagan joy.
