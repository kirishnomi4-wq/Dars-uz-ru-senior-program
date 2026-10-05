# 9-Modul (kod: `src/7-Modull`) · 11-dars «Loyiha kuni: sinovdan keyingi tuzatish» — MD v3 (loyiha kuni qolipi)

Fayl: `src/7-Modull/MvpIterationLesson.jsx` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (F-1005-88: kartochka alohida ekran, P-058 dan farq — foydalanuvchi qarori 05.10) · faqat o'zbekcha (ru — 6-RU bosqichida)
Qolip: 172-qonun (8 + 3) va 173-qonun (blok repo ustida) · namuna: `feedback/F-0929-QA-6modul/08-PipelineProject-v3.md` · dars yangi — hamma ekran noldan.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **B**; arena 12 savol — A·B·C·D ×3 (A B C D A B C D A B C D).
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58 (A1 ≈ 15 · A2 ≈ 25 · A3 ≈ 18).
Menyu nomi (DE-205): App.jsx `m7-11` — «Loyiha kuni: sinovdan keyingi tuzatish», menyu osti «eng muhim bitta muammo tuzatiladi» ·
oldingi dars `m7-10` «Odam ilovangizda qayerda to'xtab qoladi?» · keyingi `m7-12` «Pitchingizda kimning hikoyasi bor?» (App.jsx `comp` — «qur» bosqichida, asosiy seans).

---

Tashqi audit (ChatGPT) Filtri: `11-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida `maydon` repo'sida «Band qilish» tugmasi telefon ekranida forma bilan birga ko'rinadi (`dars-11-done`);
   sinfdosh o'sha vazifa bilan qayta sinaydi, natija `SINOV.md` da yozilgan. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
   Sayt, Backend, Database, band qilish, Umami — `dars-09-done` dan tayyor. Bugungi yagona yangi narsa: **kuzatuvni talabga aylantirish va tuzatishni qayta sinash**.
2. **Bugungi asosiy fikr (P-013):** Sinovdan keyin vazifani to'xtatgan bitta muammo talab bilan tuzatiladi va o'sha vazifa bilan qayta sinaladi.
3. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim aynan):**
   - **sinov** — real odam saytni ishlatadi, siz kuzatasiz (o'tgan dars). **qayta sinov** — tuzatishdan keyin o'sha vazifa bilan yana sinov.
   - **vazifa** — sinovda o'yinchiga beriladigan bitta ish: «Shanba kuni soat 18:00 ga maydon band qiling.» (10-dars, aynan).
   - **kuzatuv** — sinovda ko'rilgan bitta holat («tugmani topa olmadi»); **kuzatuv yozuvi** — kuzatuvlar yozilgan varaq. «Sinov yozuvi» deyilmaydi.
   - **talab** — agentga yoziladigan vazifa matni: **qayerda · nima qilsin · nima buzilmasin** (7-darsdan tanish). Kuzatuv — nima bo'lgani, talab — nima qilish.
   - **iteratsiya** — kuzatish → tuzatish → qayta sinov takrori (AvtoPizza botidan tanish so'z: «Tinglaysiz, eng muhimini tuzatasiz, yana tinglaysiz»).
   - **uch qadam** — `ochdi → vaqtni tanladi → band qildi` (6-dars, Umami hodisalari); bugun u vazifa qayerda to'xtaganini ko'rsatadi.
   - **keyin** — navbatga qo'yilgan muammo (3-darsdagi «qilamiz / keyin / qilmaymiz» bilan bir so'z).
   - **sayt** (React, `web/`) · **Backend** (NestJS, `backend/`) · **Database** (Neon) · **vaqt katagi** · **band qilish / band** · **o'yinchi** · **maydon egasi** · **hodisa** — tayanchdagidek.
   - **forma** — ism va telefon yoziladigan qism. **«maydon» so'zi forma qatori uchun ishlatilmaydi** (T-015, §202) — faqat maydonning o'zi va «Maydon» nomi.
   - **tekshirish** — o'zingiz brauzerda ko'rasiz (A2); **sinov** — boshqa odam ishlatadi (A3). Ikkalasi aralashmaydi (T-015).
   - **agent** — Antigravity agenti; dastur nomi faqat ochish va yuborish qadamida («Antigravity'da oching», «Antigravity'ga yuboring»).
4. **Metafora yo'q.**
5. **Kod yozish — Antigravity (173.1).** Prompt faqat *qayerda · nima qilsin · nima buzilmasin* deydi (173.4); texnologiya repo'da.
   Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» Promptlar agentga buyruq shaklida (T-002).
6. **Real odam (qaror 7, 8):** darsda — sinfdosh bilan juftlikda qayta sinov (A3); o'z MVP — har blok oxiridagi «O'z g'oyangiz» qadami, ishlash uyda.
7. **Toza yuza (185, D4):** tugma va variantlarda emoji yo'q; telefon maketi chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3). ★ — belgi (FIKRLAR.md naqshi).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (Mentor misoli, repo `maydon`) — mahalladagi mini-futbol maydonchasini band qiladigan sayt. 10-dars sinovi uch kuzatuv berdi (tayanch 3-bo'lim oxiri):
  1) «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi · 2) band bo'lgandan keyin nima bo'lganini tushunmadi · 3) kunni almashtirishni sezmadi.
  Eng muhimi — 1 (bugun tuzatiladi); 2 va 3 — «keyin» (bitta tuzatish, keyin yana sinov).
- **Hook:** kuzatuv yozuvi ochiladi — uch muammo → «Endi nima qilasiz?» → eng muhimini tuzatib, qayta sinash.
- **Bitta vizual — «Maydon» telefoni + kuzatuv yozuvi (`MAYDON` + `KUZATUV`, dars bo'yi, 163/180):**
  - **Telefon maketi** (ramka, ekran chegarasi aniq): tepada «Maydon» · kun qatori «‹ Bugun ›» (kichik o'qchalar) ·
    vaqt kataklari: 16:00 bo'sh · 17:00 band · 18:00 bo'sh · 19:00 bo'sh · 20:00 band · 21:00 bo'sh (bo'sh — oq, band — kulrang «band»).
    18:00 bosilganda katak ostida forma ochiladi: «Shanba · 18:00–19:00» · Ism · Telefon · «Band qilish».
  - **Ikki holat:** *oldin* (`dars-09-done`) — «Band qilish» telefon ramkasidan pastda, xira (ekranda ko'rinmaydi) ·
    *keyin* (`dars-11-done`) — «Band qilish» ekran pastida qotib turadi, forma bilan birga ko'rinadi. Band qilingach: katak band, «Band qilindi» belgisi.
  - **Kuzatuv yozuvi kartasi** (telefon yonida): «Kuzatuv yozuvi · Maydon», vazifa qatori, uch kuzatuv. Har kuzatuvning telefonda o'z joyi bor
    (1 — forma osti, 2 — «Band qilindi» belgisi, 3 — kun qatori) — u yerda nuqta yonadi.
  - **Uch qadam** (karta ostida, uch tugun): `ochdi → vaqtni tanladi → band qildi` — tugun kulrang → yashil; uzilgan joy — qizil uzuq chiziq; tugundan keyin «?» — noaniq.
  - Holatlar — kuzatuv qatori: oq (yozilgan) → accent (tanlangan) → qizil nuqta (telefonda joyi) → ★ «Birinchi» (accent) → yashil «tuzatildi» · kulrang «Keyin».
  - Ishlatilishi: 0 (uch nuqta) · 1 (*keyin* holati, «Qayta sinov: vazifa bajarildi») · 2 (uch qadam + qatorlar) · 4 (talab yig'ilganda telefon javob beradi) ·
    A1, A3 o'ng tomoni — `SINOV.md` fayl-kartasi (kuzatuv yozuvining fayldagi shakli, bitta manba `KUZATUV`) · A2 — telefonning kattasi (*keyin*).
  - `prefers-reduced-motion` da holatlar silliq animatsiyasiz, bir zumda almashadi.
- **Yakun:** o'yinchi to'xtagan joy tuzatildi va qayta sinaldi · keyingi dars — pitch: muammo, yechim va sinovdagi real odamning hikoyasi.

---

## 0 · Kirish — kuzatuv yozuvi ochiladi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Sinovdan uch muammo chiqdi. Qayerdan boshlaysiz?** (48)
- Mentor: O'tgan darsdagi sinovdan kuzatuv yozuvlari qoldi — «Maydon» yozuvini ochish uchun «Sinovni ko'rish»ni bosing.
- Maket (chap): «Maydon» telefoni *oldin* holatida (Shanba, 18:00 tanlangan, forma ochiq: Ism, Telefon; tugma ramkadan pastda) · yonida bo'sh kuzatuv yozuvi kartasi,
  tepasida vazifa: «Shanba kuni soat 18:00 ga maydon band qiling.» · tugma «Sinovni ko'rish».
- **Harakat → Vizual o'zgarish:** «Sinovni ko'rish» bosish → kartada uch kuzatuv birin-ketin yoziladi, har biri telefondagi joyida qizil nuqta bo'lib yonadi:
  1. «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi. (nuqta — forma osti, ramka chegarasi)
  2. Band bo'lgandan keyin nima bo'lganini tushunmadi. (nuqta — «Band qilindi» belgisi joyi)
  3. Kunni almashtirishni sezmadi. (nuqta — «‹ Bugun ›» qatori)
  Uchinchi nuqtadan keyin savol ochiladi.
- Savol: **Birinchi nima qilasiz?** (AvtoPizza botidagi kirish savoli bilan bir so'z)
  - Uchalasini bitta promptda agentga tuzattiraman (46)
  - ✔ Eng muhimini tuzatib, o'sha vazifa bilan sinayman (49)
  - O'yinchiga keyingi safar saytni oldindan tushuntiraman (54)
- Javob — 2-variant: **Aynan!** Bitta tuzatish, keyin o'sha vazifa bilan qayta sinov. Shu takror — iteratsiya. (85)
- Javob — 1-variant: **Qiziq fikr!** Uchtasini birga tuzatsangiz, nima yordam berganini ajratish qiyin. Bittadan tuzatib, qayta sinaymiz. (111)
- Javob — 3-variant: **Qiziq fikr!** Har o'yinchiga tushuntirib bo'lmaydi — sayt o'zi tushunarli bo'lsin. Eng muhimini tuzatib, qayta sinaymiz. (118)
✎ (quruvchi, 05.10) Kodda 1-variant javobi `lint:olchov` da 123 > 120 belgi chiqdi — «qaysi o'zgarish yordam berganini» → «nima yordam berganini» (kartochka 3 va arena 3 so'zi). MD qatori o'zgartirilmadi — tasdiq kutiladi.
- Javobdan keyin: kuzatuv yozuvi ostida bo'sh «Talab» qatori paydo bo'ladi (uzuq chiziq — bugun to'ldiriladi, U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida o'yinchi to'xtagan joy tuzatiladi.** (47)
- Mentor: «Maydon» — namuna: har blok oxirida xuddi shu ishni o'z MVP'ingiz uchun yozasiz. Tuzatishni Antigravity agenti qiladi, siz talab yozasiz va qayta sinaysiz.
- Chap — «Dars oxirida»: telefon *keyin* holatida, bir marta o'zi yuradi (DE-200): Shanba → 18:00 → forma (Ism, Telefon) → ekran pastidagi «Band qilish» bosiladi →
  katak «band» bo'ladi, «Band qilindi» belgisi chiqadi. Ostida yashil qator: «Qayta sinov: vazifa bajarildi».
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Kuzatuv yozuvi faylga yoziladi, eng muhimi tanlanadi
  - 02 · Eng muhim bitta muammo talab bilan tuzatiladi
  - 03 · O'sha vazifa bilan qayta sinov o'tkaziladi
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-09-done` · tayyor namuna `dars-11-done`
- Tugmalar: Orqaga · Boshlaymiz
✎ 02-qadam App.jsx menyu osti yozuvi bilan so'zma-so'z mos («eng muhim bitta muammo tuzatiladi», P-015). Kuzatuv qatorlarining holati rejada ko'rsatilmaydi —
  qaysi muammo eng muhimligi 2-ekranning kashfiyoti (P-015, 178).

## 2 · Qaysi muammo eng muhim?  ← QTushuncha
- Eyebrow: Tushuncha · eng muhim muammo
- Sarlavha: **Uch muammodan qaysi biri eng muhim?** (35)
- Mentor: Bu sinovda asosiy vazifani tugatishga to'sqinlik qilgan muammodan boshlaymiz — har kuzatuv qatorini bosing. Uchala muammo bitta o'yinchining bitta sinovidan.
- Bashorat (ballsiz, 181): **Ulardan nechtasi vazifani to'xtatadi?** · Bittasi · Ikkitasi · Uchalasi — tanlov saqlanadi.
- **Harakat → Vizual o'zgarish:** o'quvchi kuzatuv qatorini bosadi → telefonda o'sha joy accent ramka oladi, uch qadam shu muammo bilan bosib o'tiladi:
  - 3-qator (kunni sezmadi) → kun qatori ramkada; uch qadamda «ochdi → vaqtni tanladi» chizig'i uzunroq yo'l bilan aylanib o'tadi, keyin uchala tugun yashil.
    Yorliq: «Vazifa bajariladi — kechroq» (33)
  - 1-qator (tugmani topa olmadi) → forma osti ramkada, tugma ramkadan pastda xira; uch qadamda «vaqtni tanladi → band qildi» chizig'i qizil va uzun (62 soniya qidirdi, tasodifan surib topdi).
    Yorliq: «Vazifaga to'sqinlik qildi» (26)
  - 2-qator (band bo'lgach tushunmadi) → «Band qilindi» belgisi ramkada; uch qadamning uchalasi yashil, oxirida «?».
    Yorliq: «Vazifa bajariladi — lekin noaniq» (32)
  3/3 dan keyin: 1-qator ★ «Birinchi» oladi, 2 va 3 kulrang bo'lib «Keyin» guruhiga suriladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: bittasi — «Band qilish» tugmasi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Maydon'da tugma birinchi: usiz band qilish tasodifga qoladi. Bittadan tuzatsangiz, ajratish oson. (97)
- Tugadi (199): harakat paneli yopiladi, telefon + uch qadam butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugma (pastki): Qatorlarni ko'ring (N/3) → Davom etish
✎ Nega bittasi (topshiriq): xulosaning ikkinchi gapi — uchtasi birga tuzatilsa, qaysi biri yordam berganini ajratish qiyin (audit 2). Son ekranda bir marta: sarlavhada «Uch», tugmada N/3 (P-062).

## A1 · Amaliyot 1 — kuzatuv yozuvi `SINOV.md` ga  ← amaliyot bloki (≈15 daq)
- Eyebrow: Amaliyot 1 · SINOV.md
- Sarlavha: **Kuzatuvni faylga yozing va eng muhimini belgilang.** (50)
- Mentor: Yozuv repo'da tursa, talab va qayta sinov ham shu faylda yig'iladi; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Ikki terminal: `backend` da `npm run start:dev`, `web` da `npm run dev`.
     Brauzerda `localhost:5173` ni oching, F12, keyin Ctrl+Shift+M — sahifa telefon o'lchamida ochiladi.
     «‹ Bugun ›» dagi «›» o'qchasi bilan Shanbaga o'ting va 18:00 ni bosing: «Band qilish» ekranda ko'rinmayotganini o'zingiz ko'ring.
  2. **Yozish** — repo ildizida `SINOV.md` faylini yarating. Shablonni «Nusxalash» bilan qo'ying va o'tgan darsdagi kuzatuvlarni yozing.
     Prompt qutisi (Shablon → SINOV.md · Nusxalash):
     ```
     # SINOV — {sayt nomi}
     Vazifa: {sinovdagi vazifa}
     | № | Kuzatuv | Vazifaga ta'siri | Navbat |
     |---|---|---|---|
     | 1 | {…} | to'sqinlik qildi / kechikdi / noaniq qoldi | ★ birinchi / keyin |
     ```
  3. **Tanlash** — har kuzatuvga «Vazifaga ta'siri» ustunini yozing: vazifaga to'sqinlik qildimi, uni kechiktirdimi yoki natija noaniq qoldimi.
     To'sqinlik qilganini ★ bilan belgilang, qolganiga — «keyin».
  4. **O'z g'oyangiz** — shu shablonni o'z g'oyangizga yozing: o'z MVP'ingiz papkasida `SINOV.md`, uydagi sinov kuzatuvlari va ★.
     Sinov o'tkazmagan bo'lsangiz — tanaffusda sinfdoshingizga MVP'ingizni bering, bitta vazifa ayting va kuzating.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (fayl-karta `SINOV.md`):
  ```
  # SINOV — Maydon
  Vazifa: Shanba kuni soat 18:00 ga maydon band qiling.
  | № | Kuzatuv                                                  | Vazifaga ta'siri          | Navbat      |
  | 1 | «Band qilish» tugmasini topa olmadi — forma ostida       | to'sqinlik qildi          | ★ birinchi  |
  | 2 | Band bo'lgandan keyin nima bo'lganini tushunmadi         | bajarildi, lekin noaniq   | keyin       |
  | 3 | Kunni almashtirishni sezmadi                             | kechikdi                  | keyin       |
  ```
- Hammasi bajarilgach (yashil): Kuzatuv repo'da: bitta muammo ★, qolgani «keyin» navbatida. (59)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-11-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 5-Modul `FIKRLAR.md` naqshi (fayl repo ildizida, shablon «Nusxalash» bilan, ★) — §221: joy aniq, natija tekshiriladi.
  1-qadamdagi «o'zingiz ko'ring» — o'zgarish ko'rsatiladi, aytilmaydi (179): A2 dan keyingi farqni o'quvchi o'z ko'zi bilan solishtiradi.

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Egaga vazifa: «Shanba bandlarini ko'ring». Qaysi muammoni birinchi tuzatasiz?** (9 so'z)
  - Parolni bir marta xato yozdi, keyin kirdi (41)
  - Ro'yxatni uzun dedi, lekin shanbani topdi (41)
  - ✔ Kirish tugmasini bosdi, ro'yxat ochilmadi (41)
  - Ranglarni xira dedi, bandlarni ko'rib chiqdi (44)
- Kalit: **C** (index 2). To'g'ri variant eng uzun emas; vergul hamma variantda.
- To'g'ri izohi: Ro'yxat ochilmasa, ega shanba bandlarini ko'ra olmaydi. (55)
- Xato izohlari (≤60):
  - A: Bir xato bo'ldi, lekin ega kirdi. Vazifa to'xtadimi? (52)
  - B: Uzun ro'yxat noqulay. Shanba bandlari topildimi? (48)
  - D: Rang haqidagi fikr foydali. Bandlar ko'rindimi? (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Ikkinchi misol — faqat test bandida, tanish olamdan (P-002): maydon egasi va uning sahifasi (`POST /kirish` → `GET /bandlar`, tayanch 3-bo'lim).
  Ta'rif-savol («qaysi muammo birinchi?» — mezon) arenada (2-savol), bu yerda — misol-savol (T-070).

## 4 · Kuzatuvdan talab  ← QTushuncha
- Eyebrow: Tushuncha · kuzatuvdan talab
- Sarlavha: **Kuzatuvdan qanday talab chiqadi?** (32)
- Mentor: Agentga shikoyat emas, vazifa kerak — «Qayerda» qatoridan boshlab har qatorga bitta bo'lak tanlang.
- Chapda: ★ kuzatuv (bitta qator): «Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi.
  Ostida talabning uch qatori — **Qayerda** · **Nima qilsin** · **Nima buzilmasin**; har qatorda ikki bo'lak (tartib kodda aralashtiriladi):
  - Qayerda: ✓ «vaqt katagi bosilgach ochiladigan forma» · tuzoq «butun saytda»
  - Nima qilsin: ✓ «tugma forma bilan birga ekranda ko'rinsin va ism, telefon qatorini yopmasin» · tuzoq «tugma chiroyliroq bo'lsin»
  - Nima buzilmasin: ✓ «bandni saqlash, kataklar va `band-qildi` hodisasi» · tuzoq «hech narsa o'zgarmasin»
  Tuzoqlar bitta xato-sinf — umumiy gap (S-040).
- **Harakat → Vizual o'zgarish:** o'quvchi bo'lakni tanlaydi → telefon maketi javob beradi:
  - Qayerda ✓ → forma accent ramka bilan ajraladi · tuzoq → butun telefon xira ramka oladi, silkinadi: «Butun sayt — agent qayerdan boshlaydi?» (38)
  - Nima qilsin ✓ → «Band qilish» ramka ichiga, ekran pastiga ko'tariladi (*keyin* holati) · tuzoq → tugma rangi o'zgaradi, lekin ramkadan pastda qoladi:
    «Tugma chiroyli, lekin baribir ko'rinmaydi.» (42)
  - Nima buzilmasin ✓ → kataklar, forma va uch qadamning uch tuguni yashil ✓ oladi · tuzoq → tugma joyiga qaytib tushadi: «Hech narsa o'zgarmasa, tugma ham joyida qoladi.» (47)
  3/3 dan keyin talab kartasi yig'iladi (uch qator, `SINOV.md` dagi shakl):
  ```
  Qayerda: vaqt katagi bosilgach ochiladigan forma
  Nima qilsin: tugma forma bilan birga ekranda ko'rinsin va ism, telefon qatorini yopmasin
  Nima buzilmasin: bandni saqlash, kataklar va band-qildi hodisasi
  ```
  Qator (`QIzoh`, talab kartasi ostida; audit): Tugmaning joyi o'zgaradi, bandni saqlash esa o'zgarmaydi. (57)
- Xulosa: Kuzatuv nima bo'lganini aytadi, talab — nima qilishni. Aniq talabni agent to'g'riroq talqin qiladi. (99)
- Tugadi (199): bo'laklar paneli yopiladi, telefon (*keyin*) + talab kartasi fokusga; vizual ⛶ ichida.
- Tugma (pastki): Talabni yig'ing (N/3) → Davom etish
✎ 5-Modul so'zi: «Odam aytgan gap — shikoyat, Antigravity'ga esa vazifa kerak» (BotFeedbackIteration A1) — Mentor gapida takrorlandi.
  «Nima qilsin» tuzog'i (rang) 5-savol va arena 6 bilan bir g'oya: talab sababga tegadi — tugma ko'rinmasdi, joyi tuzatiladi.

## A2 · Amaliyot 2 — agent talab bo'yicha tuzatadi  ← amaliyot bloki (≈25 daq)
- Eyebrow: Amaliyot 2 · talab → tuzatish
- Sarlavha: **Agent «Band qilish» tugmasini ko'rinadigan qilsin.** (50)
- Mentor: Talabda joy aniq bo'lsa, agent o'zgartirgan narsani tekshirish oson; «1 · Talab»dan boshlang.
- Qadamlar:
  1. **Talab** — `SINOV.md` oxiriga talabni yozing (shablon «Nusxalash» bilan):
     Prompt qutisi (Shablon → SINOV.md · Nusxalash):
     ```
     ## Talab (1-tuzatish)
     Qayerda: {qayerda}
     Nima qilsin: {nima qilsin}
     Nima buzilmasin: {nima buzilmasin}
     ```
  2. **Prompt** — talabning uch qatorini qavslarga qo'ying, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `web/` dagi saytda tuzat. Qayerda: **{qayerda}**. Nima qilsin: **{nima qilsin}**.
     > Nima buzilmasin: **{nima buzilmasin}**. `backend/` ga tegma, o'zgargan fayl va qatorlarni ayt.
  3. **Ishga tushirish** — sahifa o'zi yangilandi, terminalda xato yo'q. Agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff` (nima o'zgargani ko'rinadi) — faqat `web/` dagi forma o'zgarganmi; keyin brauzerda talabning har qatorini tekshiring.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — telefon o'lchamida: Shanba, 18:00 → «Band qilish» ekranda ko'rinadi.
     Keyin eski narsalar: ism va telefonni yozib band qiling — katak «band» bo'ladi, «Band qilindi» belgisi chiqadi.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: qavslarga o'z `SINOV.md`'ingizdagi ★ kuzatuvdan chiqqan talabni qo'ying va faylga saqlang.
     Uyda uni o'z MVP'ingiz papkasida Antigravity'ga yuborasiz.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (telefon maketi, *keyin* holati, kattasi):
  - Maydon · ‹ Shanba ›
  - 16:00 bo'sh · 17:00 band · **18:00 tanlangan** · 19:00 bo'sh · 20:00 band · 21:00 bo'sh
  - Shanba · 18:00–19:00 · Ism · Telefon
  - ekran pastida qotgan: [Band qilish]
- Hammasi bajarilgach (yashil): «Band qilish» ekranda ko'rinadi, band qilish eskidek ishlaydi. (62)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-11-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi (o'zaro tekshiruv, 05.10): o'quvchining o'z saytida tugma ko'rinib tursa — u sinovidagi ★ muammoni xuddi shu uch qator bilan tuzatadi.
  Mentor misoli (tugma forma ostida) — `dars-11-start` da; ortda qolganlar shundan boshlaydi.
✎ 5-Modul A2 naqshi: «Boshqa joyga tegma, o'zgargan qatorlarni ayt» (§221), 4-qadam — avval tuzatilgan joy, keyin eski narsalar.
  «Tekshirish» — o'quvchining o'zi; «sinov» so'zi A3 ga qoldi (T-015).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Kuzatuv: kunni almashtirishni sezmadi. Qaysi talab aniq?** (7 so'z)
  - Kun tanlash joyi qulay bo'lsin, hech narsa buzilmasin (53)
  - ✔ Kun qatori boshqa kunni ko'rsatsin, kataklar qolsin (51)
  - O'yinchi kunni sezmadi, endi shu joy tezroq tuzatilsin (54)
  - Kun qatori, kataklar va forma noldan qayta yozilsin (51)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas (C bilan teng); to'rttalasi bir shaklda («…sin»), «buzilmasin» to'g'rida ham, A da ham; «Kun qatori» D da ham.
- To'g'ri izohi: Joy, nima qilish va nima buzilmasligi bor; qanday ko'rsatishni keyin tanlaysiz. (79)
- Xato izohlari (≤60):
  - A: «Qulay» — agent aynan nimani o'zgartiradi? (42)
  - C: Bu kuzatuvning o'zi. Qayerda nima qilinsin — aytildimi? (55)
  - D: Noldan yozilsa, ishlab turgan qism ham buzilishi mumkin. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ 3-kuzatuv (keyingi iteratsiyalardan biri) — o'quvchi talabni yangi kuzatuvga ko'chiradi; 4-ekran bo'laklari takrorlanmaydi (S-008).
  D — «Botni noldan, butunlay qayta yozaman» (AvtoPizza boti, kirish savoli) bilan bir xato-sinf.

## A3 · Amaliyot 3 — chiqarish va qayta sinov  ← amaliyot bloki (≈18 daq)
- Eyebrow: Amaliyot 3 · qayta sinov
- Sarlavha: **Tuzatishni chiqaring va o'sha vazifa bilan sinang.** (50)
- Mentor: Tuzatish ishladimi — buni siz emas, o'yinchi ko'rsatadi; «1 · Chiqarish»dan boshlang.
- Qadamlar:
  1. **Chiqarish** — terminalda (`maydon` papkasida) uch buyruq. Push'dan keyin sayt 9-darsdagi deploy orqali yangilanadi.
     Prompt qutisi (Siz → terminal · Nusxalash):
     ```
     git add -A
     git commit -m "11-dars: «Band qilish» tugmasi ko'rinadi"
     git push
     ```
  2. **Qayta sinov** — sinfdoshingizga telefonda sayt manzilini bering va vazifani o'qing: «Shanba kuni soat 18:00 ga maydon band qiling.»
     Imkon bo'lsa — saytni oldin ishlatmagan odamga bering. O'sha sinfdosh bo'lsa, u yo'lni eslab qolgan bo'lishi mumkin: natijani shuni hisobga olib yozing.
     Tushuntirmang, kuzating. Sayt yangilanmagan bo'lsa — laptopda telefon o'lchamida (`localhost:5173`) sinang.
  3. **Yozish** — natijani `SINOV.md` oxiriga yozing (shablon):
     Prompt qutisi (Shablon → SINOV.md · Nusxalash):
     ```
     ## Qayta sinov (1-tuzatishdan keyin)
     Kim: {yangi odam / o'sha odam} · Vazifaga ta'siri: {…} · Kuzatuv: {nima ko'rdingiz}
     Keyingi: {«keyin» ro'yxatidagi navbatdagi muammo}
     ```
  4. **O'z g'oyangiz** — shu shablonni o'z g'oyangizga yozing: uyda tuzatishdan keyin o'sha vazifani yangi odamga (bo'lmasa — o'sha odamga) bering va natijani o'z `SINOV.md`'ingizga qo'shing.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (fayl-karta `SINOV.md`, oxirgi ikki bo'lim):
  ```
  ## Talab (1-tuzatish)
  Qayerda: vaqt katagi bosilgach ochiladigan forma
  Nima qilsin: tugma forma bilan birga ekranda ko'rinsin va ism, telefon qatorini yopmasin
  Nima buzilmasin: bandni saqlash, kataklar va band-qildi hodisasi

  ## Qayta sinov (1-tuzatishdan keyin)
  Kim: yangi odam · Vazifaga ta'siri: to'sqinlik yo'q · Kuzatuv: tugmani birinchi urinishda topdi, band qildi
  Keyingi: band bo'lgandan keyin nima bo'lganini tushunmadi
  ```
- Hammasi bajarilgach (yashil): Bitta iteratsiya tugadi: kuzatish → tuzatish → qayta sinov. Keyingisi «keyin» ro'yxatidan. (90)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-11-done`
- Nishon (bonus): Fix and Retest — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ 5-Modul A3 naqshi (push → serverda tekshirish → qayta o'lchash, Mentor «buni siz emas, o'sha odam aytadi»). 2-qadam — 10-darsning o'z so'zi («tushuntirmang, kuzating»).
  2-qadamdagi zaxira yo'l — P-026 (yakuniy va'da bitta tashqi bog'liqlikka osilmaydi). Formula ot-shaklda (§224).

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 3 — «1 — Eng muhim muammo» · 5 — «2 — Aniq talab».

## 7 · Takrorlash  ← QKartochka (alohida ekran — F-1005-88, foydalanuvchi qarori 05.10)
- Sarlavha: O'zingizni sinab ko'ring.
- 12 karta — «Kartochkalar» jadvali.
- Mentor yo'q (KORPUS §61). Karta ostida, birinchi bosishgacha: Kartani bosing — javob ochiladi · karta yuzi halqada (F-1005-91 B).
- Tugmalar: Orqaga · Yakunlash → (platforma shakli)

## 8 · Yakun — keyingi dars  ← QYakun
- Eyebrow: Tayyor · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Birinchi tuzatish tayyor — qayta sinov yozildi.** (46)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (3):
  - Bu sinovda vazifaga to'sqinlik qilgan muammo birinchi tuzatildi, qolgani navbatda
  - Kuzatuvdan talab yozasiz: qayerda, nima qilsin, nima buzilmasin
  - Tuzatishdan keyin o'sha vazifa bilan qayta sinaysiz
- Uyga vazifa — yo'q (172.4: ish repo'da; o'z MVP — bloklardagi «O'z g'oyangiz» qadami).
- Keyingi dars — «Pitchingizda kimning hikoyasi bor?». Bugun o'yinchi to'xtagan joy tuzatildi. Pitchda muammo, yechim va sinovdagi real odamning hikoyasi bo'ladi.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Stop Finder** — Vazifani to'xtatgan muammoni topdingiz (3-ekran, 1-savol)
- **Clear Request** — Aniq talabni tanladingiz (5-ekran, 2-savol)
- **Fix and Retest** — Tuzatishni o'sha vazifa bilan qayta sinadingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Vazifani to'xtatgan muammo birinchi»
   - `to'xtadi` · Vazifa shu yerda uzildi — Birinchi tuzatiladi, ★ oladi.
   - `bajarildi` · Vazifa qiyin, lekin bajarildi — «keyin» navbatiga.
   - `1` · Bir vaqtda bitta tuzatish — Keyin o'sha vazifa bilan qayta sinov.
   - Sinfga savol: Nega uchala muammoni birga tuzatmaymiz?
2. 2-savol (5-ekran) — «Talab: qayerda · nima qilsin · nima buzilmasin»
   - `Qayerda` · Aniq joy — Forma yoki kun qatori, «butun sayt» emas.
   - `Nima qilsin` · Sababga tegadi — Tugma ko'rinmasdi, shuning uchun joyi tuzatiladi.
   - `Nima buzilmasin` · Ishlab turgani — Band qilish, kataklar, `band-qildi` hodisasi.
   - Sinfga savol: «Kunni sezmadi» — talabning «Qayerda» qatoriga nima yoziladi?
✎ Emoji o'rniga koddan / fayldan bitta qator (S-026): `SINOV.md` ustun qiymatlari va talab qatorlari nomi.

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Sinovdan uch muammo chiqdi. Nechtasini birga tuzatasiz? | Bittasini | Keyin o'sha vazifa bilan, imkon bo'lsa yangi odamda sinaysiz |
| Maydon sinovida qaysi muammo birinchi tuzatildi? | Vazifaga to'sqinlik qilgani | Boshqa holatda yana: nechta odamda takrorlandi, ta'siri qancha |
| Nega bir vaqtda bitta muammo tuzatiladi? | Nima yordam berganini ajratish osonroq | Uchtasi birga tuzatilsa, ajratish qiyin |
| Kuzatuv bilan talabning farqi nima? | Kuzatuv nima bo'lganini, talab nima qilishni aytadi | «Topa olmadi» → «ekranda ko'rinsin» |
| Talab qaysi uch qismdan iborat? | Qayerda, nima qilsin, nima buzilmasin | AvtoPizza botidagi «aniq o'zgarish» ham shu shaklda |
| Tugma ko'rinmasdi. «Chiroyliroq qil» nega yetmaydi? | Sababga tegmaydi | Tugmaning joyi tuzatiladi, rangi emas |
| «Nima buzilmasin» qatoriga nima yoziladi? | Ishlab turgan, kerakli narsalar | Band qilish, kataklar, `band-qildi` hodisasi |
| Agent tuzatdi. Birinchi nimani o'qiysiz? | O'zgargan fayl va qatorlarni | Faqat kerakli joy o'zgarganmi |
| Muammo telefonda chiqdi. Laptopda qanday ko'rasiz? | Brauzerni telefon o'lchamiga o'tkazib | F12, keyin Ctrl+Shift+M |
| Qayta sinovda qaysi vazifa beriladi? | O'sha vazifa | «Shanba kuni soat 18:00 ga maydon band qiling.» |
| Qayta sinovda o'yinchi qiynalsa? | Tushuntirmaysiz, kuzatasiz | Qiynalgan joy — keyingi kuzatuv |
| Kuzatish → tuzatish → qayta sinov. Bu takror nima? | Iteratsiya | Har aylanishda sayt biroz yaxshilanadi |

✎ 5-Modul so'zlari takrorlandi: iteratsiya, chastota va ta'sir, «aniq o'zgarish» (talab bilan bir gapda tenglashtirildi — T-052).
  Kartalar «Endi siz bilasiz» qatorlarini so'zma-so'z takrorlamaydi (§216).

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A B C D A B C D A B C D
1. Sinovdan uch muammo chiqdi. Birinchi nima qilinadi? ✔ Eng muhimini tuzatib, yana sinaladi · Uchalasi bitta promptda tuzatiladi · O'yinchiga sayt qanday ishlashi aytiladi · Sayt noldan, boshqatdan qayta yoziladi
2. Maydon sinovida qaysi muammo birinchi tuzatildi? Eng oson va tez tuzatiladigani · ✔ Odam vazifani bajara olmagani · Kuzatuvda eng oxirgi yozilgani · Eng ko'p so'z bilan yozilgani
3. Nega bir vaqtda bitta muammo tuzatiladi? Agent bittadan ko'pini tushunmaydi · Ikkinchisi keyin o'zi tuzalib qoladi · ✔ Nima yordam berganini ajratish oson · Qolgan muammolar muhim emas
4. «Tugmani topa olmadi» — bu nima? Agentga beriladigan talab · Sayt kodidagi xato qator · Agentga yuboriladigan prompt · ✔ Sinovda yozilgan kuzatuv
5. Talab qaysi uch qismdan iborat? ✔ Qayerda, nima qilsin, nima buzilmasin · Kim, qachon va qancha vaqt ichida · Muammo, sabab va kimning aybi · Sarlavha, matn va rasmning joyi
6. Tugma ko'rinmasdi. «Chiroyliroq qil» nega yetmaydi? Agent rang so'zlarini tushunmaydi · ✔ Tugmaning joyi o'zgarmay qoladi · Chiroyli tugma sekinroq ochiladi · Talabga rang yozib bo'lmaydi
7. «Nima buzilmasin» qatoriga nima yoziladi? Tuzatilishi kerak bo'lgan joy · Agent qo'shishi kerak bo'lgan narsa · ✔ Ishlab turgan, kerakli narsalar · O'yinchining ismi va telefoni
8. Agent tuzatdi. Birinchi nimani o'qiysiz? Agentning «tayyor» degan gapini · Loyihadagi hamma fayllarni · README'dagi eski yozuvlarni · ✔ O'zgargan fayl va qatorlarni
9. Muammo telefonda chiqdi. Laptopda qanday ko'rasiz? ✔ Brauzerni telefon o'lchamiga o'tkazib · Terminalda Backend'ni qayta yoqib · Sahifani katta ekranda yangilab · Database jadvalini ochib ko'rib
10. Qayta sinovda o'yinchiga qaysi vazifa beriladi? Yangi, qiyinroq boshqa vazifa · ✔ Birinchi sinovdagi o'sha vazifa · Faqat tuzatilgan tugmani bosish · Vazifasiz, o'zi aylanib ko'rsin
11. Qayta sinovda o'yinchi qiynalsa, nima qilasiz? Tugmani barmog'ingiz bilan ko'rsatasiz · Saytni qanday ishlatishni aytib berasiz · ✔ Tushuntirmaysiz, kuzatib yozasiz · Sinovni to'xtatib, keyinga qoldirasiz
12. Kuzatish → tuzatish → qayta sinov. Bu takror nima? Deploy · Talab · Sinov rejasi · ✔ Iteratsiya (F-1005-93 A)
   ✎ (quruvchi, 05.10) Kodda «Pitch» → «Sinov rejasi» (10-darsdan tanish): `lint-tell` — to'g'ri «Iteratsiya» eng uzun (×1.67 ≥ 1.45, error). MD qatori o'zgartirilmadi — tasdiq kutiladi.

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Fon so'zlari: sinov · kuzatuv · talab · iteratsiya · «Band qilish» · `SINOV.md` · Shanba 18:00 · `dars-11-done` · `web/` · Antigravity · qayta sinov · uch qadam · `POST /bandlar` · Ctrl+Shift+M
✎ To'g'ri variant eng uzun emas (S-006): 1 (35 / 34·40·38) · 5 (37 / 33·29·31) · 9 (37 / 33·31·31) — eng uzun, lekin farq 4 belgigacha; kodda tekshiriladi.
  Strelka faqat 12-savol matnida (variantlarda yo'q). Arenadagi 3 va 12 — 3-ekran va kartochkalar bilan bir fikr, boshqa so'z bilan (S-008).

---

## KOD — razrabotkada qilinadigan narsalar
1. Yangi fayl `src/7-Modull/MvpIterationLesson.jsx` — `src/skelet/NamunaDars.jsx` dan (JR-14, pilotdan nusxa yo'q); palitra `qolipRang('tex')`.
2. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards · summary (F-1005-88). `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **1 (B)**; `practice: -1`.
3. **`MAYDON` + `KUZATUV` + `MaydonTel` + `KuzatuvKarta` + `UchQadam`** — bitta manba (180): telefon maketi ikki holatda (*oldin* — tugma ramkadan pastda, *keyin* — ekran pastida qotgan),
   uch kuzatuv (matn, telefondagi joyi, uch qadamga ta'siri: `kech` · `uzildi` · `noaniq`), uch qadam — uch tugun. 0, 1, 2, 4-ekranlar va A1–A3 o'ng tomoni shundan o'qiydi;
   `SINOV.md` fayl-kartasi ham `KUZATUV` dan yig'iladi. Bosiladigan qismlar: `// qolip-maket: mt-katak kz-qator tl-bolak`. Logotip/emoji yo'q (D4).
4. 0-ekran `QKirish` (maket = `MaydonTel` *oldin* + `KuzatuvKarta`, «Sinovni ko'rish»dan keyin variantlar). 2-ekran `QTushuncha` (`zoom`, `tugadi`, `QBashorat` + `QTaxmin`).
   4-ekran `QTushuncha` — uch qator × ikki `QChip` (`holat`, tuzoqda `silk`), telefon tanlovga javob beradi; `QXato` bitta qator.
5. 3 va 5-ekran `QTest` + darsning `QuestionScreen`; xato izohlari ≤60.
6. **`ScreenBlok`** (skeletdan): A1 — 4 qadam, A2 — 5, A3 — 4; oxirgi qadam «O'z g'oyangiz» (qaror 8; 173.2 dagi 4 qadamdan bittasi ortiq — `steps` uzunligi erkin).
   `kimga`: Shablon → SINOV.md · Siz → Antigravity · Siz → terminal. O'ng: A1/A3 — `SINOV.md` fayl-kartasi, A2 — `MaydonTel` *keyin* (kattasi).
   `ortda`: A1 `dars-11-start`, A2/A3 `dars-11-done` (ikkalasida oldin `git fetch … --tags`). 4-qadam nomi A2 da «Brauzerda tekshirish».
7. `RECAPS` 2 (kalit 3 va 5) · `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Stop Finder, 5-ekran → Clear Request, A3 oxirgi «Bajardim» → Fix and Retest.
8. 7-ekran `QKartochka` (alohida, 12 karta; hisoblagichlar ↻ O'rganilmoqda · N · ✓ Bildim · N) · 8-ekran `QYakun`: `uyga` yo'q, `recap` 3 qator, `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol, kalitlar A·B·C·D ×3 (yuqoridagi tartib); fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m7-11-v1`. `narrow` faqat 3, 5, 6-ekranlarda (171).
11. App.jsx `m7-11` qatoriga `comp: MvpIterationLesson` — asosiy seans («qur» bosqichi).
12. Darvozalar: `npm run gates -- src/7-Modull/MvpIterationLesson.jsx` 12/12 · `lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/390 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar («qur» bosqichi)
1. **`dars-09-done` da xato holat bo'lishi shart:** telefon o'lchamida (≈390×844) Shanba 18:00 bosilganda forma ochiladi, «Band qilish» ekrandan pastda — ko'rinmaydi.
   Namuna ma'lumotda Shanba 18:00 bo'sh. (9-dars qurilishi bilan kelishiladi — B-bo'lim.)
2. **`dars-11-done`** = `dars-09-done` + bitta tuzatish commit:
   - `web/` forma: «Band qilish» telefon ekranida forma bilan birga ko'rinadi (ekran pastida qotgan); kataklar, `POST /bandlar`, `band-qildi` hodisasi, animatsiyalar o'zgarmagan;
   - `SINOV.md` (repo ildizi, Maydon namunasi): vazifa, uch kuzatuv jadvali (★ / keyin), «Talab (1-tuzatish)», «Qayta sinov (1-tuzatishdan keyin)» — A1/A3 o'ng tomonidagidek;
   - README «Darslar va teglar» jadvaliga 11-dars qatori (10-dars — kodsiz, tegi yo'q).
3. `dars-10-*` teg yo'q: A1 boshlang'ich holati — `dars-09-done`.

## B. Bu darsdan tashqariga chiqadigan narsalar (hozir tegilmaydi)
- 9-dars MD si va repo: `dars-09-done` da tugma forma ostida, telefon ekranidan tashqarida qolishi kerak (aks holda bugungi muammo qayta chiqmaydi).
- 10-dars MD si: kuzatuv yozuvi shu uch qator bilan va «kuzatuv yozuvi» so'zi bilan bo'lishi; vazifa matni aynan «Shanba kuni soat 18:00 ga maydon band qiling.»
- 7-dars MD si: «talab» atamasi va uch qismi (qayerda · nima qilsin · nima buzilmasin) shu yerda kiritiladi deb olindi.
- 12-dars MD si: pitchdagi «real foydalanuvchi hikoyasi» `SINOV.md` dagi qayta sinov yozuvidan olinishi mumkin (keyingi dars ko'prigi shunga tayanadi).

---

## TAYANCHGA SAVOL
1. ~~Uch kuzatuv bitta odamdanmi?~~ — **yopildi** (GATE M K5, audit 3): bitta o'yinchi, bitta sinov, uch to'xtash. Tarix: 1 («tugmani topa olmadi») bo'lsa, o'sha odamda 2 («band bo'lgach tushunmadi») chiqmaydi. Men yozuvda odam sonini aytmadim (sarlavha «Kuzatuv yozuvi»),
   2-ekran esa xronologiyani emas, har muammo uch qadamni qayerda sekinlatishi yoki uzishini ko'rsatadi.
   3-kuzatuv («sezmadi») ta'siri — «kech topdi, vazifa bajarildi» deb olindi; 10-dars yozuvi boshqacha bo'lsa, 2-ekran yorlig'i o'zgaradi. 10-dars yozuvi ikki sinovdan (sinfdosh + uydagi odam) bo'lsa — shunday deb yozish mumkin.
2. **`SINOV.md` fayli** (repo ildizi) — tayanchda yo'q; 5-Modul `FIKRLAR.md` naqshi. 10-dars yozuvni qayerda saqlaydi (dars formasi)? Bu darsda faylga ko'chiriladi.
3. **Tuzatish shakli** — «Band qilish» ekran pastida qotib turadi (forma bilan birga ko'rinadi). Tayanchda faqat «tuzatilgan»; 4-ekran bo'laklari va `dars-11-done` shunga bog'liq.
4. **Repo manzili** `github.com/Azizbekcrypto/maydon` va o'quvchi clone qiladimi yoki fork — «Ortda qoldingizmi» dagi `git fetch … --tags` qatori shunga bog'liq (P-028: manzil «qur»da tekshiriladi).
5. **9-darsdagi deploy** qayerda va push'dan keyin o'zi yangilanadimi — A3 1-qadami shunga tayanadi; zaxira yo'l — laptopda telefon o'lchami.
6. **Telefon o'lchami** — F12 → Ctrl+Shift+M (Chrome). O'quvchilar boshqa brauzerda bo'lsa, yozuv o'zgaradi.
7. **«O'z g'oyangiz» qadami** — 173.2 «4 qadam» deydi, qaror 8 «har blok oxirida bitta qadam». Men qo'shimcha qadam qildim (A1 4, A2 5, A3 4). Qadam nomi «O'z g'oyangiz» — boshqa loyiha kunlari bilan bir xil bo'lishi kerak.
8. **1-test ikkinchi misoli** — maydon egasi sinovi (vazifa: shanba bandlarini ko'rish) va to'rt kuzatuv shu test uchun o'ylab topildi (P-002 ruxsati); tayanchda ega sinovi yo'q.
9. **Keyingi iteratsiya tartibi** — A3 namunasida «Keyingi: 2-muammo». 2-test 3-muammo uchun talab namunasi beradi («boshqa kunni ko'rsatsin» — yechim emas, natija; audit 5). Tartibni men tanladim.
10. **«kuzatuv yozuvi» va «sinov yozuvi»** — topshiriqda «sinov yozuvlari», tayanch 4-jadvalda «kuzatuv yozuvi». Men «kuzatuv yozuvi»ni oldim (T-014).
11. **«talab» va «aniq o'zgarish»** — 7-dars MD si ularni allaqachon tenglashtirgan bo'lsa, bu darsdagi kartochka izohi («AvtoPizza botidagi «aniq o'zgarish» ham shu shaklda») qisqaradi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-10` «Odam ilovangizda qayerda to'xtab qoladi?» → **`m7-11` «Loyiha kuni: sinovdan keyingi tuzatish»** → `m7-12` «Pitchingizda kimning hikoyasi bor?»; reja 02-qadami menyu osti yozuvi bilan so'zma-so'z.
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · bitta vizual dars bo'yi — «Maydon» telefoni + kuzatuv yozuvi + uch qadam (`MAYDON`/`KUZATUV`; 0, 1, 2, 4, bloklar). Ikkinchi misol faqat 1-testda (ega).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (qator → telefon joyi + uch qadam), 4 (bo'lak → telefon javob beradi); 0-ekran ham harakatli.
- [x] Sarlavha ≤55 bitta qator (32–54) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavha so'zlarini takrorlamaydi · xulosalar ≤110 (59–99) · hook javobi ≤120 (85/113/118) · xato izohlari ≤60 (42–56).
  Belgilar skript bilan sanaldi; yakuniy hukm — `lint:olchov` / `lint:sarlavha` kodda.
- [x] Atamalar tayanch bilan bir xil (sayt · Backend · Database · vaqt katagi · band qilish · o'yinchi · talab · agent · hodisa); 5-Modul so'zlari (iteratsiya, chastota va ta'sir, «aniq o'zgarish», «Boshqa joyga tegma, o'zgargan qatorlarni ayt») grep bilan olindi;
  siz-forma, promptlar agentga buyruq shaklida (T-002), tugmalar ot-shaklda, formula ot-shaklda (§224). «maydon» forma qatori ma'nosida yo'q (T-015).
- [x] Testlar: variantlar teng (41–44 · 51–54), to'g'ri variant eng uzun emas; «buzilmasin» to'g'rida ham, xatoda ham; strelka/qavs yo'q; ✔ o'rni 3-ekran C, 5-ekran B · arena A·B·C·D ×3.
  ✗ qisman: arena 1, 5, 9 da to'g'ri variant 2–4 belgi uzunroq — kodda tenglashtiriladi (S-006).
- [x] Final tartib-mashqi yo'q (172), uya izohi talabi qo'llanmaydi; 4-ekran bo'laklari tartibi kodda aralashtiriladi.
- [x] Emoji yo'q (★ ✓ → ‹ › — belgilar; nishon medali — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — yo'q).
- [x] Ichki kodlar yo'q (o'quvchi matnida modul raqami, «T6», «P1» yo'q; «5-Modul» faqat MD izohlarida, o'quvchiga — «AvtoPizza boti») · tarixiy voqea yo'q · «KOD» (12) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S (+ PM): T-002/011/014/015/029/039/047/049/052/064 · P-001/002/013/014/015/026/028/036/052/059/062/064/067 · S-001/002/004/006/008/010/015/026/040 — ko'rildi.
  ✗ P-028: repo manzili va deploy yo'li tayanchda yo'q — TAYANCHGA SAVOL 4, 5; «qur» bosqichida tiriklik tekshiriladi.
