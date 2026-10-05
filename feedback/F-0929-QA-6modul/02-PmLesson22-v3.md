# 6-Modul (LMS: 8-Modul) · 2-dars «Bitta gapni uch kishi bir xil tushunadimi?» — MD v3

Fayl: `src/6-Modull/PmLesson22.jsx` · 16 ekran (tartib va `SCREEN_META` o'zgarmaydi) · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `02-PmLesson22-v2.md` + hozirgi kod (F-1004-04 va Q3 A Altair paneli — saqlanadi). v3 har ekranni qolip turi bilan yozadi; «v2 dagidek» deyilgani matni koddan olinadi.
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti, `INLINE_KEYS`): **s3 = B · s5 = A · s7 = C · s11 = B**. Arena 12 savol: ✔ o'rni koddagidek (3/3/3/3).
Oldingi dars — 1-dars «Komponentlardan tizim» · keyingi — 3-dars «Arxitektura patternlari» (App.jsx `m6-01`, `m6-03`). Menyu nomi = dars nomi (205) — o'zgarmaydi.

---

## A. Darsning tayanchi

**Bosh g'oya (dars bo'yi bitta, «Bugungi asosiy fikr»):**
> Bitta gapni har kim boshqacha tushunishi mumkin. Shuning uchun fikrni yozib, aniqlashtiramiz.

**To'rt katak (savollari dars bo'yi aynan shunday, `KATAKLAR` — bitta manba; katak nomida emoji yo'q):**
Muammo — Nima qiynayapti? · Kim — Aynan kim qiynalyapti? · Yechim — Nima quriladi? · O'lchov — Natijani qaysi sondan bilamiz?

**Atamalar (bir ma'no — bir so'z):**
- **varaq** — to'rt katakli yozuv (dars bo'yi «bitta varaq», «bir varaq» emas);
- **katak** — varaqning bitta qismi; **qator** — katakka yozilgan javob;
- **bo'sh katak** — umuman yozilmagan (kod topadi) · **javobsiz katak** — qatori bor, lekin o'z savoliga javob bermaydi (odam topadi). Ikkalasi aralashtirilmaydi (T-015);
- **taxmin** — dasturchi bo'sh joyni o'zi to'ldirishi; **og'zaki** ↔ **yozilgan**;
- **PRD** — faqat 4-ekranda, varaq to'lgandan KEYIN, bir marta (PM-107): «mahsulot talablari hujjati (Product Requirements Document)».

**Misol-ip:** basseyn (hook, 2, 4, 9, 10-ekran) → o'quvchining mini-do'koni (8-ekran — modul ipi, o'z artefakti; `pm-m6d2-prd` 6 va 12-darsga o'tadi).
Keys — Microsoft (6-ekran, «Biznes olamidan»). Metafora yo'q.

## Darsning ipi va bitta vizual (163/180)

- **Hook:** murabbiy bitta gap aytdi → uch dasturchi uch xil ilova qurdi → «nega?».
- **Bitta vizual — «Varaq va uch ekran»** (bitta manba: `KATAKLAR` + `UCH_EKRAN`, CSS bilan chizilgan, emoji va logotip yo'q):
  - **Varaq** — oq varaq, 2×2 to'rt katak; katak ichida nom, savol (kulrang) va qator. Holatlar: bo'sh («· · ·») → yozilmoqda → to'la → javobsiz (qizil halqa) → topildi (yashil halqa).
  - **Uch ekran** — uchta telefon ramkasi (191) «1-dasturchi · 2-dasturchi · 3-dasturchi». Har ekran burchagida **mini-varaq** (2×2 kichik katak — dasturchi qo'lidagi varaq):
    uzuq katak — yozilmagan (dasturchi taxmin qiladi), yashil katak — varaqdan o'qidi, qizil — javobsiz.
    Taxmin ekranlari: ① «Ro'yxatga yozilish» — Ism · Telefon · [Yuborish] ② «Guruhlar jadvali» — Du 18:00 · Chor 18:00 · Juma 18:00 ③ «Bo'sh joylar» — Bugun 18:00 · 3 joy (band tugmasi yo'q).
    Bir xil ekran (varaq to'lgach, uchalasida): «Bugun 18:00 · 3 bo'sh joy · [Band qilish]».
  - Ishlatiladi: 0 (uch xil ekran) · 1 (bo'sh varaq) · 2 (xotira → 7-kunda uch ekran) · 4 (varaq yozilib chiqadi → ekranlar bir xil) · 6 (Altair varag'i) · 8 (o'z varag'i) · 9 (uch varaq → ekranlar ajraladi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · basseyn
- Sarlavha: **Bitta gap — nega uch xil ilova chiqdi?** (38)
- Mentor: Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz. Murabbiy dasturchilarga bitta gap aytdi.
- Maket (chap): murabbiy pufagi «Joy band qiladigan ilova kerak.» → uchta chiziq → uch ekran (taxmin ekranlari ①②③, A bo'lim).
- Variantlar (radio, o'ng): Gap juda qisqa aytilgan · Har kim boshqacha tushungan
- Javob (ikkalasiga bir xil, maqtovsiz — J-026, P-016): Ikkala sabab ham bor: gap faqat og'zaki aytildi, aytilmagan joyini har dasturchi o'zicha to'ldirdi. (99)
- **Harakat → Vizual o'zgarish:** variantni tanlash → murabbiy pufagi ostida kulrang yorliq «faqat og'zaki» chiqadi, har ekran burchagida **bo'sh mini-varaq** (to'rt uzuq katak)
  paydo bo'ladi: dasturchi qo'lida yozilgan narsa yo'q, ekran — uning taxmini.
- Tugma (pastki): Bittasini tanlang → Davom etish
✎ F-1004-04 «uch dasturchi natijasi hook'da» — kodda yo'q edi (faqat gap-karta); endi uch ekran shu yerda · karta va variantlardagi emoji olindi (185) · mentor 3 gap → 2 · javob 160 → 99, «Bugun … yozasiz» quyrug'i olindi (§218)

## 1 · Reja  ← QReja
- Eyebrow: Dars rejasi
- Sarlavha: **Bugun mini-do'koningiz uchun bitta varaq to'ldirasiz.** (53)
- Mentor: Oldingi darsda tizim chizmasini yig'dingiz. Kod yozishdan oldin yana bir qadam bor — nima qurilishini yozish.
- Chap: «Dars oxirida: kod yozishdan oldin — bitta varaq, to'rt katak» (App.jsx ta'rifi bilan bir xil, P-015) + bo'sh varaq chizilib chiqadi (kataklarda faqat nom va savol).
- O'ng (01 · matn · teg):
  - 01 · Og'zaki gap va yozilgan qatorni solishtirasiz · `og'zaki · yozma`
  - 02 · Murabbiydan so'rab, basseyn varag'ini to'ldirasiz · `basseyn`
  - 03 · Microsoft qanday boshlanganini ko'rasiz · `1975`
  - 04 · O'z varag'ingizni yozib, kod bilan tekshirasiz · `varaq.js`
- Tugma: Orqaga · Boshlaymiz
✎ «Maqsad» → QReja standarti (DE-201): «01» kartalar qo'shildi · mentor 1-darsga ko'prik bo'ldi («To'rt katak, har birida bitta qator» — varaq o'zi ko'rsatadi, T-047) · «Boshlaymiz →» strelkasi tugma ichida emas

## 2 · Og'zaki va yozilgan  ← QTushuncha (qayta qurildi)
- Eyebrow: Tajriba · bitta gap
- Sarlavha: **Og'zaki gap va yozilgan qator — farqi nimada?** (45)
- Mentor: Vaqtni oldinga suring va uch dasturchi gapni qanday eslashini kuzating.
- Bashorat (ballsiz, 181): **Bir haftadan keyin uch dasturchi og'zaki gapni qanday eslaydi?** · Uchalasi bir xil · Ikkitasi bir xil · Uchalasi har xil
- Vizual: chap ustun «Og'zaki» — murabbiy pufagi, ostida uch dasturchining xotira-pufagi; o'ng ustun «Varaqda» — bitta qator «Joy band qiladigan ilova», ostida uch dasturchi o'sha qatorni o'qiydi.
- Vaqt-kalit (3 qadam): 1-kun · 3-kun · 7-kun
- **Harakat → Vizual o'zgarish:** kalitni keyingi kunga surish →
  - 1-kun: uch xotira-pufak bir xil — «Joy band qiladigan ilova»;
  - 3-kun: har pufakda bitta so'z xira tortadi, boshqasi o'rniga kiradi — «Joy ko'rsatadigan ilova» · «Band qiladigan ilova» · «Joy band qiladigan ilova»;
  - 7-kun: pufaklar uch xil — «Ro'yxatga yozadigan ilova» · «Guruhlar jadvali ilovasi» · «Bo'sh joy ko'rsatadigan ilova», har biri hook'dagi o'z ekraniga aylanadi.
  O'ngdagi varaq qatori uch qadamda ham o'zgarmaydi (har qadamda bir lahza yonib, «o'sha qator» belgisini oladi).
- Natija qatori: «Taxminingiz: … · haqiqatda: uchalasi har xil» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa (7-kun): Og'zaki gapni har kim o'zicha eslaydi, yozilgan qator hammaga bir xil ko'rinadi. (80)
- Tugma (pastki): Vaqtni suring (N/3) → Davom etish
✎ ikki matn-karta (bosib ochiladi) → vaqt-kalit + xotira-pufaklari (184) · bashorat qo'shildi · xulosa ikki gap + qo'shimcha gap → bitta gap · «Shuning uchun ish … yozilgan qator bilan boshlanadi» recap'ga o'tdi (1-qayta tushuntirish)

## 3 · 1-savol  ← QTest (✔ B)
- Eyebrow: Tekshiruv · yozilgan qator
- Savol: **Nima kerakligini sizga og'zaki aytishdi. Ish boshlashdan oldin birinchi nima qilasiz?** (11 so'z)
  - A · Eshitganimni yodda saqlab, kod yozaman (38)
  - B · ✔ Eshitganimni qatorga yozib olaman (33)
  - C · Qatorni ish tugagach yozib qo'yaman (35)
  - D · Eshitganimni do'stimga aytib beraman (36) — yangi
- To'g'ri izohi: Yozilgan qator ertaga ham, uch kishida ham bir xil turadi. (58)
- Xato izohlari:
  - A: Yodda saqlangan gap ham og'zaki — ertaga boshqacha eslanadi. (60)
  - C: Ish tugagach yozish kech: har kim o'zicha qurib bo'lgan. (56)
  - D: Do'stingiz ham uni og'zaki eshitadi va o'zicha eslaydi. (55)
✎ 4-variant oxiriga qo'shildi (QTest A–D; ✔ o'rni o'zgarmaydi) · to'g'ri izohi 2 gap → 1 · xato izohlari 74/73 → ≤60

## 4 · Bitta varaq  ← QTushuncha (markaziy; F-1004-04 saqlanadi)
- Eyebrow: Tajriba · bitta varaq
- Sarlavha: **Murabbiydan nimani so'rash kerak edi?** (37)
- Mentor: Katakni bosing — bu murabbiyga savol, javobi o'sha katakka yoziladi.
- Vizual: chapda murabbiy pufagi «Basseynga joy band qiladigan ilova kerak.» va «Basseyn ilovasi» varag'i (to'rt bo'sh katak, bosiladi); o'ngda uch ekran (hook'dagi taxmin ekranlari, bo'sh mini-varaq bilan).
- Murabbiyning javoblari (katak bosilgach yoziladi, oldindan aytilmaydi — 98b):
  - Muammo — Odamlar kelib, guruh to'lib qolganini ko'radi va bekorga qaytadi
  - Kim — Haftada ikki marta suzishga keladiganlar
  - Yechim — Bo'sh joyni ko'rsatib, joyni band qiladigan ilova
  - O'lchov — Bekorga qaytganlar haftasiga 20 tadan 4 taga tushsin
- **Harakat → Vizual o'zgarish:** katakni bosish → katakdan savol pufagi murabbiyga uchadi, javob katakka harfma-harf yoziladi VA uch ekrandagi mini-varaqning
  o'sha katagi bir vaqtda yashil bo'ladi. 4/4 da uch ekran bir lahza xiralashib, **bir xil** ekranga qayta chiziladi: «Bugun 18:00 · 3 bo'sh joy · [Band qilish]».
- Ipucha (42 soniyadan): Yana bitta katakni bosing.
- Tugagach (199): varaq chetga kichrayadi, uch bir xil ekran butun enga chiqadi; Mentor almashadi:
  **Bunday varaqni PRD deyishadi — mahsulot talablari hujjati (Product Requirements Document). Katta jamoada u bir necha sahifa, bizda — to'rt katak.**
- Xulosa: To'rt katak yozildi — uch dasturchi endi bir xil ilova quradi. (61)
- Tugma (pastki): Kataklarni bosing (N/4) → Davom etish
✎ «▶ Endi nima qurishadi?» tugmasi va uchta matn-karta («Bo'sh joy ko'rinadi · Joy band qilinadi») olindi — natija ekranlarning o'zida, har bosishda (184) ·
sarlavha buyruqdan savolga (164) · O'lchov qatori: «10 tadan 2 taga (oldin 10 tadan 10 ta → keyin 2 ta)» chalkash edi (hamma qaytgandek) → «haftasiga 20 tadan 4 taga» ·
PRD atamasi varaq to'lgandan keyin, bir marta (PM-107) — saqlandi

## 5 · 2-savol  ← QTest (✔ A)
- Eyebrow: Tekshiruv · o'lchov katagi
- Savol: **«Natijani qaysi sondan bilamiz?» katagiga qaysi qator yozilishi mumkin?** (9 so'z)
  - A · ✔ Kuniga 30 kishi joy band qiladi (31)
  - B · Uch murabbiy ham ilovadan mamnun (32)
  - C · Ilova ikki barobar qulay bo'ladi (32)
  - D · Ilova chiroyli va zamonaviy chiqadi (35) — yangi
- To'g'ri izohi: Odamlar sonini sanab bo'ladi — natija shu sondan ko'rinadi. (59)
- Xato izohlari:
  - B: «Uch murabbiy» o'zgarmaydi, mamnunlikni esa sanab bo'lmaydi. (60)
  - C: Qulaylikni o'lchaydigan son yo'q — uni sanab bo'lmaydi. (55)
  - D: «Chiroyli» va «zamonaviy»ni ham sanab bo'lmaydi. (48)
✎ «Kunda 30 odam» → «Kuniga 30 kishi» (uzunlik tenglashdi) · 4-variant — 8-ekrandagi «bo'sh so'zlar» sinfidan · izohlar ≤60

## 6 · Microsoft qanday boshlandi?  ← QVoqea (PM keys)
- Eyebrow: **Biznes olamidan** (PM-028)
- Sarlavha: **Microsoft qanday boshlandi?** (27)
- Mentor: Microsoft — bugun Windows'ni chiqaradigan kompaniya. (S-018, bir marta)
- Yorliq: **Microsoft · N/6** · nuqtalar (faqat ko'rilgan bosqichga qaytadi)
- Sahna: **Altair paneli** dars bo'yi bitta (Q3 A, 186 — kodda bor): chiroqlar qatori, kichik kalitlar, ekran va klaviatura yo'q. «Microsoft» nom-yorlig'i o'z rangida 5-bosqichda chiqadi (logotip yo'q).
- Bosqichlar:
  1. **1975-yil** — Bill Geyts va Pol Allen jurnalda yangi kompyuter haqida o'qidi. Uning nomi — Altair. *(sahna: panel; ostida bitta kulrang qator «ekran ham, klaviatura ham yo'q — faqat kalitlar va chiroqlar»)*
  2. **Bashorat** (ballsiz, keysdagi yagona — S-015): **Ular kompaniyaga «Bizda Altair uchun til bor» deyishdi. Til qanday holatda edi?** ·
     ✔ Hali yozilmagan edi · Yarmi yozilgan edi · To'liq tayyor edi *(pre-kadr: chiroqlar o'chiq, yorliq yashirin)* → «Taxminingiz: … · haqiqatda: hali yozilmagan edi»
  3. **Va'da** — BASIC — kompyuterga buyruq yoziladigan til. U hali yozilmagan edi, lekin nima va qaysi kompyuter uchun qurilishi aniq edi. *(sahna: chiroqlar o'chiq, yorliq «BASIC — hali yozilmagan»)*
  4. **Taxminan ikki oy** — Ular tilni Altair qo'llanmasiga qarab yozishdi va universitet kompyuterida, Altairga o'xshatilgan dasturda sinashdi. *(sahna: lenta o'sadi «BASIC · yozilmoqda · ≈ 2 oy»)*
  5. **Ko'rsatuv kuni** — Allen tilni haqiqiy Altairga birinchi marta o'sha kuni yukladi. Til birinchi urinishdayoq ishladi — Microsoft shundan boshlandi. *(sahna: chiroqlar yonadi, teletayp «MEMORY SIZE?», «Microsoft» nom-yorlig'i)*
  6. **Ish aniq gapdan boshlandi** — Nima (BASIC tili) va kim uchun (Altair egalari) boshidan aniq edi. Sizning varag'ingiz — shunday aniq gapning to'rt katakli shakli.
     *(sahna: darsning o'z varag'i — Yechim «BASIC tili» va Kim «Altair egalari» yashil, Muammo va O'lchov xira)*
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» → Altair paneli o'sha bosqich holatiga o'tadi (o'chiq → lenta → chiroqlar + teletayp → varaq); bashoratda tanlov → chiroqlar
  hali o'chiqligi ochiladi.
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish
- Manba (v2, 29.09, tekshirilgan): Harvard Gazette, Wikipedia «Altair BASIC» — Allen'ning 8080 emulyatori PDP-10 da, qo'llanma bo'yicha; ≈8 hafta; ko'rsatuv 1975-yil mart, MITS, birinchi urinishda «MEMORY SIZE?».
✎ eyebrow «💾 Haqiqiy voqea» → «Biznes olamidan», yorliq «Haqiqiy voqea · N/7» → «Microsoft · N/6» (PM-028) · ikkinchi bashorat («qachon ishga tushirishdi?») olindi —
keysda bitta bashorat (S-015), fakti 5-bosqich matnida · bashorat variantlari o'sish tartibida · har slayd ≤2 gap · 🎲 yorliq emojisi olindi · 6-bosqich varag'i darsning o'z
`Varaq` ko'rinishida (bitta vizual) · Microsoft izohi qo'shildi (S-018)

## 7 · 3-savol  ← QTest (✔ C)
- Eyebrow: Tekshiruv · ko'rsatuv kuni
- Savol: **Til haqiqiy Altairda birinchi urinishdayoq ishladi. Nega?** (7 so'z)
  - A · Ular Altairni oldindan uyda sinab ko'rgan edi (45)
  - B · Kompaniya ularga tayyor tilni berib qo'ygan edi (47)
  - C · ✔ Nima va qaysi kompyuter uchun qurishni bilishgan (48)
  - D · Ular tilni muddatidan ancha oldin tugatishgan edi (49) — yangi
- To'g'ri izohi: Maqsad aniq edi: ular Altair qo'llanmasiga qarab yozib, unga o'xshatilgan dasturda sinashdi. (92)
- Xato izohlari:
  - A: Haqiqiy Altair ularda yo'q edi — sinash imkoni bo'lmagan. (57)
  - B: Tilni kompaniya emas, Geyts va Allenning o'zi yozdi. (52)
  - D: Tez yozish emas — nima qurilishi aniq bo'lgani yordam berdi. (60)
✎ savol 13 so'z → 7 (S-001) · variantlar 40/40/53 → 45–49 (✔ eng uzun edi, endi D uzunroq) · to'g'ri izohi 3 gap → 1

## 8 · Mustaqil ish · o'z varag'ingiz  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Mini-do'koningiz uchun bitta varaq to'ldiring.** (46)
- Mentor: Do'kon hali yo'q bo'lsa, sinfdoshlarga sotsa bo'ladigan bitta narsani tanlang. Har katakka bitta qatorda javob yozing.
- Qadam-doiralar: 1 Muammo · 2 Kim · 3 Yechim · 4 O'lchov (yozilgani yashil ✓, joriysi accent)
- Forma: bitta maydon, namuna-matn = joriy katak savoli (emojisiz): «Nima qiynayapti?» · «Aynan kim qiynalyapti?» · «Nima quriladi?» · «Natijani qaysi sondan bilamiz?» · «Saqlash» o'ngda
- Yozayotgandagi javoblar (bitta qator):
  - Qisqa qoldi: to'liq gap bilan yozing. (37)
  - (Muammo, bo'sh so'zlar) Bu muammo emas: odam nimadan qiynalyapti? (41)
  - (Kim, «hamma/odamlar») «Hamma» — bu kim? Yoshi, joyi yoki ishi bilan yozing. (53)
  - (Yechim = Muammo) Bu Muammo qatori. Bu yerga nima qurilishini yozing. (51)
  - (O'lchov, sonsiz) Son yozing: oldin qancha edi, keyin qancha bo'lsin. (51)
  - ✓ Qatoringizda son bor — natijani shu sondan bilasiz. (53)
  - ✓ Qator to'liq — endi saqlashingiz mumkin. (42)
- Yordam: Ikki savol bering: kimdir shu ishdan qiynalyaptimi? Qiynalgani sonda ko'rinadimi? · Qo'shimcha: Varag'ingizni ovoz chiqarib o'qing — to'rt qator bitta ish haqida gapiryaptimi?
- **Harakat → Vizual o'zgarish:** «Saqlash» → doira yashil ✓, forma keyingi katakka o'tadi; 4/4 da forma yopiladi, **to'liq varaq** («Sizning varag'ingiz») fokusga chiqadi —
  katakni bosib qatorini qayta yozish mumkin (izoh: «Katakni bosib qatorini qayta yozishingiz mumkin.»).
- Xulosa: Varag'ingiz tayyor: har katakda o'z savoliga javob. (51)
✎ ikki ustun → bitta ustun (QMustaqil) · o'ngdagi «Sizning varag'ingiz» ro'yxati olindi (doiralar takrori, §223) · «Qo'shimcha» Yordam ichida ·
«✅ To'rt katak ham yozildi — varaq saqlandi» → bitta yashil xulosa · namuna-matndan katak emojisi olindi · javob qatorlari 61–85 → ≤55

## 9 · Uch varaqni tekshiring  ← QTushuncha (qayta qurildi: uch ekran qo'shildi)
- Eyebrow: Tekshiruv · uch varaq
- Sarlavha: **Qaysi katak o'z savoliga javob bermayapti?** (42)
- Mentor: Uch varaqni birin-ketin o'qing. Hammasi to'g'ri bo'lsa — «Javobsiz katak yo'q» tugmasini bosing. (sarlavha so'zlarini takrorlamaydi — §225)
- Vizual: chapda joriy varaq (bosiladi) + tugma «Javobsiz katak yo'q»; o'ngda uch ekran — boshida sokin skelet (javobni oldindan bermaydi, §217).
- Varaqlar (birin-ketin; katak qatorlari koddagidek, nomdagi emoji olinadi):
  1. «Murabbiy uchun kunlik ro'yxat» — javobsiz: **Yechim** («Murabbiyning ishini oson qiladigan ilova»)
     Izoh: Nima qurilishi aytilmagan. Aniq qator: «Murabbiyga kunlik ro'yxatni ko'rsatadigan sahifa». (90)
  2. «Mashg'ulotdan oldin eslatma» — javobsiz: **Kim** («Hamma foydalanuvchilar»)
     Izoh: Bu kim — ko'chada tanib bo'lmaydi. Aniq qator: «Joyni band qilib, boshqa ishga ketadiganlar». (93)
  3. «Guruh tanlash» — javobsiz katak yo'q
     Izoh: To'rt katak ham o'z savoliga javob berdi — uch ekran bir xil. (61)
- **Harakat → Vizual o'zgarish:** javobsiz katakni bosish → katak qizil halqa oladi, uch ekrandagi mini-varaqda o'sha katak qizil bo'ladi va **ekranlar o'sha jihatda ajraladi**:
  1-varaq (Yechim) — «Kunlik ro'yxat» · «Murabbiylar chati» · «Ish jadvali»; 2-varaq (Kim) — ekran sarlavhasi «Bolalar uchun» · «Kattalar uchun» · «Hamma uchun».
  3-varaqda «Javobsiz katak yo'q» → mini-varaqlar to'liq yashil, uch ekran bir xil. Noto'g'ri katak → katak silkinadi, ekranlar o'zgarmaydi.
- Xato izohlari (≤60):
  - (javob beradigan katak bosildi) Bu katak o'z savoliga javob beryapti. (37)
  - (javobsiz bor varaqda «Javobsiz katak yo'q») Bitta katak savoliga javob bermayapti — qayta o'qing. (53)
  - 2 xatodan keyin: Yechim — nima quriladi, Kim — aniq guruh, O'lchov — son. (56)
- Yordam (birinchi xatodan keyin): Har katakni o'z savoli bilan qo'shib o'qing: qatori shu savolga javob beryaptimi?
- Tugma (izohdan keyin, o'ngda): Keyingi varaq · oxirida Tekshiruvni yakunlash
- Tugagach (199): uch kichik varaq yonma-yon (javobsiz katagi qizil belgili, uchinchisi yashil) fokusga chiqadi.
- Xulosa: Har katakni o'z savoli bilan o'qisangiz, javobsiz qator ko'rinib qoladi. (72)
- Tugma (pastki): Varaqlarni tekshiring (N/3) → Davom etish
✎ varaq nomi emojisi (📅🔔🏊) olindi · ekranlar qo'shildi — javobsiz katak nimaga olib kelishi ko'rinadi (184) · Kim izohidagi «✗ Hamma · ✗ Odamlar · ✓ …» qatori olindi
(8-ekran javobi va kartochka bilan takror) · «✅ N varaqda javobsiz katak topdingiz …» va pastki ro'yxat → bitta xulosa · sarlavha savolga (164) · mentor tugma nomini aynan aytadi (T-024)

## 10 · Kod yozish · VS Code  ← QKod
- Eyebrow: Kod yozish · VS Code
- Sarlavha: **Bo'sh katakni topadigan kod yozamiz.** (36) — PM-82a oilasi
- Mentor: Qatorning ma'nosini odam o'qiydi, mashina esa faqat yozilgan-yozilmaganini ko'radi.
- Chap (82c — panel chapda, kod o'ngda; ikki ustun bir balandlik — 190):
  - Darvoza-savol (82e, kod bilan birga ko'rinadi): **varaq1 da qaysi katak bo'sh?** · Muammo · ✔ O'lchov · Kim — topilgach «Bajardim» ochiladi.
    Xato bo'lsa: varaq1 ni qatorma-qator o'qing: qaysi qator «""» bilan tugaydi? (≤60)
  - Vazifa (3 band):
    1. `NOMLAR` bo'ylab yuring.
    2. Qiymati bo'sh (`""`) bo'lsa, nomni `natija` ga qo'shing.
    3. `node varaq.js` — uch natija pastdagidek chiqsin.
  - Kutilgan natija: `varaq1 → ["olchov"]` · `varaq2 → ["muammo", "kim"]` · `varaq3 → ["yechim"]`
  - Yordam: Bitta katakdan boshlang: `varaq1.olchov` bo'shmi? Ishlagach qolgan uchtasiga o'ting. · Qo'shimcha: `tayyormi(varaq)` funksiyasini qo'shing — bo'sh katak bo'lmasa `true`, aks holda `false` qaytarsin.
  - Tugma (o'ngda): Bajardim
- O'ng: VS Code oynasi `varaq.js` (qo'lda yoziladi, nusxalanmaydi — 82d) · bo'laklar «Uch varaq» · «Funksiya» · terminal `$ node varaq.js` — kod koddagidek (`KD_CODE` o'zgarmaydi).
- **Harakat → Vizual o'zgarish:** «Bajardim» → terminalda uch qator birin-ketin chiqadi, «Kutilgan natija» qatorlari yashil ✓ bo'ladi; panel yopiladi, kod oynasi va terminal fokusga (199).
- Xulosa: Endi kod bo'sh katakni o'zi topadi, ma'nosini esa siz tekshirasiz. (66)
✎ darvoza-savol «Qaysi katakda son bo'lishi shart?» (5-ekran takrori) → kodning o'ziga bog'liq «varaq1 da qaysi katak bo'sh?»; endi kod yashirilmaydi ·
mentor 2 gap → 1 (ikkinchisi kodda ko'rinadi, T-047; sarlavha so'zlari — «katak», «topadi», «kod» — mentordan olindi, §225) · vazifa 2 shart → QKod 3 band · tugma «✓ VS Code'da yozdim — uch natija to'g'ri chiqdi» → «Bajardim» · «Kodni yozing va tugmani bosing» ichki yorlig'i olindi

## 11 · 4-savol (yakuniy)  ← QTest (✔ B)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Kim katagi bo'sh, dasturchi so'ramay ishni boshladi. Nima bo'ladi?** (9 so'z)
  - A · Ish to'xtaydi, kod umuman yozilmaydi (36)
  - B · ✔ Kim uchun qurishni o'zi taxmin qiladi (37)
  - C · Qolgan uch katak ham bekor bo'ladi (34)
  - D · Ilova hamma uchun birdek qulay chiqadi (38) — yangi
- To'g'ri izohi: Bo'sh katakni dasturchi o'z taxmini bilan to'ldiradi — bilmasangiz, so'rab aniqlashtiring. (90)
- Xato izohlari:
  - A: Ish to'xtamaydi — dasturchi baribir quradi, taxmin bilan. (57)
  - C: Qolgan kataklar joyida — faqat bo'sh katak taxmin bo'ladi. (58)
  - D: «Hamma uchun» ham taxmin — aniq guruh emas. (43)
✎ savol 14 so'z, 3 qism → 9 so'z, 2 qism (S-001) · to'g'ri izohi 3 gap → 1 (v2 dagi «bilmasangiz — so'rang» qoidasi saqlandi) · 4-variant — 9-ekrandagi «Hamma foydalanuvchilar» xatosidan

## 12 · O'zingiz o'ylab ko'ring  ← QMustaqil
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Qaysi katak eng qiyin bo'ldi?** (29)
- Mentor: Avval ovoz chiqarib ayting, keyin bir qatorda yozing: nega aynan shu katak? (jonli darsda: «… sherigingizga ayting …»)
- Qadam-doiralar: 1 Ayting · 2 Yozing
  - 1: taymer — yakka «30 soniyani boshlash» / juftlikda «1 daqiqani boshlash» (A, keyin B); tugagach «Vaqt tugadi — aytib bo'ldingiz.»
  - 2: forma, namuna-matn «… katagi qiyin bo'ldi, chunki …»
- **Harakat → Vizual o'zgarish:** taymer → halqa kamayadi; yozgach forma yopiladi, yozilgan qator fokusga.
- Xulosa: Qiyin katakni bilasiz — keyingi varaqni o'sha katakdan boshlang. (64)
✎ eyebrow «… · 2 qadam» → raqam faqat doiralarda (§223) · taymer tugmalaridagi ▶ ⏹ ↻ olindi (185) · «Barakalla!» olindi · xulosa «Bugungi qoida: aniq yozilmasa — dasturchi taxmin
qiladi» (shior, T-042; asosiy fikr yakunda turadi) → ish natijasi

## 13 · Natijalar (podium) — v2 dagidek
- «Bu sessiyaga hali hech kim qo'shilmagan» → umumiy shablon (B bo'lim, `KATTA_TOZALASH.md`).

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.** (standart)

| Old tomon | Orqa |
|---|---|
| Og'zaki gap bilan yozilgan qatorning farqi nima? | Og'zaki gapni har kim o'zicha eslaydi, yozilgan qator hammaga bir xil |
| PRD nima? | Mahsulot talablari hujjati (Product Requirements Document) |
| Bugun PRD'ning qaysi sodda shaklini to'ldirdik? | Bitta varaq, to'rt katak |
| «Muammo» katagida nima turadi? | Odamni nima qiynayotgani |
| «Kim» katagida nima turadi? | Qiynalayotgan odamlarning aniq guruhi |
| «Yechim» katagida nima turadi? | Nima qurilishi |
| «O'lchov» katagida nima turadi? | Natijani ko'rsatadigan son: oldin qancha, keyin qancha |
| Katak bo'sh qolsa nima bo'ladi? | Dasturchi uni o'z taxmini bilan to'ldiradi |
| «Hamma foydalanuvchilar» Kim katagiga yaraydimi? | Yo'q — aniq guruh kerak: yoshi, joyi yoki ishi bilan |
| Kod varaqda nimani topadi? | Umuman yozilmagan katakni; ma'nosini odam tekshiradi |
| Geyts va Allen tilni qanday sinashdi? | Altairga o'xshatilgan dasturda, universitet kompyuterida |

✎ 10 → 11: «PRD ning inglizcha to'liq nomi» kartasi PRD kartasiga qo'shildi (takror) · yangi: «Hamma foydalanuvchilar» (9-ekran) va «Kod nimani topadi» (10-ekran) ·
1-karta 2-ekran xulosasi bilan bir xil («eslaydi»)

## 15 · Dars yakuni  ← QYakun
- Yorliq: Dars tugadi · {N}/4 to'g'ri
- Sarlavha: **Endi fikrni to'rt katakli varaqqa yoza olasiz.** (46)
- Bugungi asosiy fikr — Bitta gapni har kim boshqacha tushunishi mumkin. Shuning uchun fikrni yozib, aniqlashtiramiz.
- CODE STRIKE (arena) — platforma standarti (192)
- Endi siz bilasiz:
  - Og'zaki gapni har kim o'zicha eslaydi — yozilgan qator hammaga bir xil ko'rinadi.
  - PRD — mahsulot talablari hujjati; eng sodda shakli — bitta varaq, to'rt katak.
  - To'rt katak — Muammo, Kim, Yechim, O'lchov — har biri o'z savoliga javob beradi.
  - Katak bo'sh qolsa, dasturchi taxmin qiladi — bilmasangiz, so'rab aniqlashtiring.
- Nishonlar (yakunda)
- Uyga vazifa — `HwCard` (PM, o'zgarmaydi — PM-027; faqat xabar: ichidagi 📝 🗂 👆 emojilari olinadi): varaqni bir odamga o'qib berish · u qayta so'ragan katakni belgilash ·
  o'sha katak qatorini yangidan yozish (qisqa: O'lchov sonini qayerdan bilishni bir qatorda yozish).
- Keyingi dars — **Arxitektura patternlari:** tizimni tuzishning sinab ko'rilgan usullari.
✎ sarlavha «… to'ldirdingiz» (qo'l harakati) → ko'nikma (T-049) · 1-xulosa «tushunadi» → «eslaydi» (2-ekran bilan bir so'z) · «🚀» olindi · keyingi dars qatoridagi
«(MVC, monolit, mikroservis)» olindi — App.jsx ta'rifi 3-darsda

---

## Qisqa takrorlash oynalari (har ballik test — 3 karta; belgi o'rniga raqam — S-026)

- **3-ekran · Yozilgan qator hammada bir xil**
  1. Og'zaki gap va yozilgan qator — Og'zaki gapni har kim o'zicha eslaydi, yozilgan qator hammaga bir xil ko'rinadi.
  2. Ish qayerdan boshlanadi — Shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi.
  3. Bugun sinab ko'ring — Og'zaki topshiriqni bir qatorda yozib olsangiz, keyin qaytib o'qiysiz. · Sinfga savol: Bugun kimdir sizga og'zaki topshiriq berdimi — uni qanday yozib olardingiz?
- **5-ekran · O'lchov katagida son turadi**
  1. Katakning savoli — «Natijani qaysi sondan bilamiz?»
  2. Sanab bo'lmaydigan qator — Qulaylik, mamnunlik, chiroylilikni sanab bo'lmaydi — ular bu katakka tushmaydi.
  3. Oldin va keyin — Son bugun qanchaligini bilsangiz, keyin qancha bo'lganini ham ko'rasiz. · Sinfga savol: Bugun sanab ko'rsa bo'ladigan qaysi son bor?
- **7-ekran · Avval aniq gap, keyin kod** (eski sarlavha «Avval aytilgan, keyin yozilgan» — «aytilgan» og'zakini eslatardi)
  1. Ish aniq gapdan boshlandi — Geyts va Allen nima qurishini (BASIC) va qaysi kompyuter uchun (Altair) boshidan bilishardi.
  2. Ko'rsatuv kuni — Tilni Altairga o'xshatilgan dasturda sinashdi, haqiqiy Altairda u birinchi urinishdayoq ishladi.
  3. Gap oldin turadi — Nima qurilishi oldindan aniq bo'lsa, ish bir yo'nalishda ketadi. · Sinfga savol: Varag'ingizda nima qurilishi qaysi katakda turibdi?
- **11-ekran · Bo'sh katak — taxmin**
  1. Bo'sh katak ishni to'xtatmaydi — Dasturchi uni o'z taxmini bilan to'ldiradi.
  2. To'rttasi ham yoziladi — To'rt katak to'lsa, dasturchi taxmin qilmaydi — varaqdan o'qiydi.
  3. Bilmasangiz — so'rang — Javobini bilmagan katakni taxmin bilan emas, so'rab to'ldirasiz. · Sinfga savol: Qaysi katagingiz eng bo'sh turibdi — nega?
- Oyna yorlig'i «📖 Qayta tushuntirish» → «Qayta tushuntirish»; oxirgi tugma «✓ Tushunarli — davom etamiz» o'zgarmaydi.

## Jonli viktorina (CODE STRIKE) — 12 savol, ✔ o'rni koddagidek (3/3/3/3)
1. Sinfdoshingizga loyiha g'oyangizni og'zaki aytdingiz. Nima xavfi bor? — ✔ U g'oyani o'zicha tushunib, boshqa narsa qiladi · U g'oyani eshitib, **shu zahoti** yoqtirib qoladi · U g'oyani eslab qolishga ko'p vaqt sarflaydi · U g'oyani qog'ozga yozib berishni so'raydi ✎ «darrov» (kafolat so'zi, §221)
2. Dasturchi «menga PRD bering» dedi. U nimani so'rayapti? — Ilovaning tayyor kodini · Ishning narxi yozilgan qog'ozni · Ilova ekranlarining rasmini · ✔ Nima qurilishi yozilgan hujjatni
3. «Odam qaysi kuni yozilganini eslay olmaydi» — qaysi katakka tushadi? — Kim katagiga · Yechim katagiga · ✔ Muammo katagiga · O'lchov katagiga
4. «Aynan kim qiynalyapti?» katagida qaysi qator to'g'ri yozilgan? — Ilovadan foydalanadigan hamma odam · ✔ Ertalabki mashg'ulotga qatnaydiganlar · Ilovani to'lab beradigan tashkilot · Kodni yozadigan dasturchilar guruhi
5. Yechim katagiga qaysi qator tushadi? — Zamonaviy va tez ishlaydigan ilova · ✔ Qatnash kunlarini belgilaydigan sahifa · Ikki hafta ichida tugatiladigan ish · JavaScript tilida yoziladigan kod
6. O'lchov katagi nima uchun kerak? — ✔ Ish natija berganini sanab ko'rsatadi · Ilova narxini oldindan hisoblab beradi · Dasturchilar sonini aniqlab beradi · Ish necha kun davom etishini aytadi
7. O'lchov katagi to'ldirilmasa, nima yo'qoladi? — Ishni umuman boshlash imkoni · Varaqning qolgan uch katagi · ✔ **Sonni oldin-keyin solishtirish** · Dasturchiga to'lanadigan haq
   ✎ ✔ «Ish natija berdimi degan javob» 6-savol kaliti bilan bir ibora edi (S-008); variantlar 28–30 belgiga tenglashdi
8. Varaq to'ldirilgandan keyin uch dasturchi nima qurdi? — Har biri o'zicha boshqa narsa qurdi · Uchalasi ham ishni boshlay olmadi · Ikkitasi qurdi, uchinchisi qura olmadi · ✔ Uchalasi ham bir xil ekran qurdi
9. Geyts va Allen ishni qanday tartibda qildi? — ✔ Avval nima qurishini aytdi, keyin yozdi · Avval tilni yozdi, keyin murojaat qildi · Avval Altairni sotib oldi, keyin yozdi · Avval sinovdan o'tkazdi, keyin va'da berdi
10. Til hali yozilmagan payt ular nima qildi? — Altairni sotib olib, uyga olib keldi · Kompaniyaga tayyor tilni pochtada yubordi · ✔ Kompaniyaga «bizda til bor» deb va'da berdi · Jurnalga maqola yozib chiqardi
11. Varaq qachon tayyor bo'ladi? — Kamida ikkita katagi yozilganda · ✔ Har katakda savolga aniq javob bo'lganda · Kod bilan birga topshirilganda · Uzun gaplar bilan to'ldirilganda
12. Varaq to'ldirilmasa, qaror kimning qo'liga o'tadi? — Ilovani ochgan odamning · Basseyn murabbiysining · Sinov o'tkazadigan odamning · ✔ Kod yozadigan dasturchining

**Fon so'zlari** (R-008; kodda `{uz, ru}` — bor): arena — varaq · katak · qator · savol · o'lchov · muammo · yechim · kim (+ 3 belgi — arena istisnosi); uyga vazifa banneri — varaq · katak · qator · savol · o'lchov.

## Nishonlar (inglizcha nom qoladi; medal belgisi — o'yin qatlami)
Right Question! — To'rt savolni murabbiydan o'zingiz so'radingiz · One Pager! — To'rt katakni ham to'ldirdingiz · Sharp Eye! — Uch varaqni ham to'g'ri o'qib chiqdingiz ·
Code Check! — Kod endi bo'sh katakni o'zi topadi. Nishon qoidasi qatori: «Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.» (🏅 olinadi).

---

## B. Darsdan tashqariga chiqadigan narsalar
- «sessiya» (podium) — umumiy shablon → `KATTA_TOZALASH.md` (v2 dan).
- To'rt katak savollari 6, 12, 14-darsda ham ishlatilsa — aynan shu shaklda (v2 dan; G4 MD v3 larida tekshiriladi).

## KOD — kod bosqichida (19 band)
1. **`UchEkran`** — bitta vizualning ikkinchi yarmi: uch telefon ramkasi (191) + mini-varaq (2×2); holatlar: taxmin · katak yashil · bir xil · ajralgan · skelet. Ma'lumot — `UCH_EKRAN`
   (taxmin ekranlari ①②③, bir xil ekran, 9-ekran ajralish variantlari). 0, 2, 4, 9-ekran shundan o'qiydi (180). `// qolip-maket:` e'loni.
2. `KATAKLAR` dan `ic` emojilari olinadi (8-ekran namuna-matni, `wsp-task`).
3. s0 → `QKirish`: maket (pufak + `UchEkran`), radio 2 variant, javob bitta; `gapcard` va `HOOK_OPTS.ic` olinadi; `correct:false` (J-026) saqlanadi.
4. s1 → `QReja` (4 qadam, mono teg); `Varaq draw` chapda qoladi.
5. s2 → `QTushuncha` + `QBashorat` + vaqt-kalit (3 qadam) + xotira-pufaklari; `S2_CARDS` olinadi; `zoom`, `tugadi`.
6. s4 → `QTushuncha`: `bosq2` tugmasi, `.qayta` kartalari va `S4_QAYTA` olinadi; katak bosilganda `UchEkran` mini-varaq katagi yashil; 4/4 → bir xil ekran, `tugadi`, Mentor PRD ga.
   `S4_JAVOB.olchov` yangi matn. `onAnswer … correct` (nishon) 4/4 dan keyin — bayram qoplamasi ekranlar qayta chizilgandan KEYIN (eski izoh mantig'i saqlanadi). MentorNote yangilanadi (eski «birinchi bosqich» yo'q).
7. s3, s5, s7, s11 → `QTest` (DE-203, q20): 4-variant oxiriga (✔ indeks o'zgarmaydi: s3=1, s5=0, s7=2, s11=1 — `INLINE_KEYS` tegilmaydi); `explainCorrect` bitta gap; s7, s11 savol matni.
8. s6 → `QVoqea`: eyebrow «Biznes olamidan», yorliq «Microsoft · N/6»; `K_SLIDES` 7 → 6 (ikkinchi `predict` olinadi, 1-bashorat chiplari o'sish tartibida, `ans: 0`); `ic` maydonlari,
   💾 🎲 olinadi; 5-bosqichda «Microsoft» nom-yorlig'i; 6-bosqich `alt-sheet` → `Varaq` (Yechim + Kim to'la). Mentor qatori qo'shiladi.
9. s8 → `QMustaqil`: bitta ustun, `wsp-task` olinadi, «Qo'shimcha» Yordam ichida, `done-mini` → `QXulosa`, javob qatorlari yangi matn.
10. s9 → `QTushuncha`: `UchEkran` (skelet → ajralish/bir xil); `S9_VARAQLAR.ic` olinadi; `sabab` yangi matn (Kim ❌/✅ qatori olinadi); `clean-btn` «Javobsiz katak yo'q»;
    `varaq-sum` + `done-mini` → tugadi holati + `QXulosa`.
11. s10 → `QKod`: darvoza-savol kod bilan bir vaqtda (`stage2` yashirishi olinadi), `GATE_OPTS` savoli/izohi yangi; vazifa 3 band; «Bajardim»; bajarilgach terminal natijasi (tugadi).
12. s12 → `QMustaqil`: qadam-doiralar «Ayting · Yozing», taymer tugmalaridan ▶ ⏹ ↻ va «Barakalla!» olinadi; xulosa yangi.
13. s14 → `QKartochka` (DE-204): 11 karta.
14. s15 → `QYakun`: sarlavha, recap 4 qator, keyingi dars qatori (🚀 olinadi); `HwCard` — faqat emoji olinadi (PM-027).
15. `RECAPS` (3, 5, 7, 11): `ic` → 1/2/3 (S-026), matnlar yangi; 7-ekran sarlavhasi; oyna yorlig'idan 📖 olinadi.
16. `QUIZ_BANK`: 1-savol B variant, 7-savol variantlari (✔ indeks 2 o'zgarmaydi).
17. Nav-yorliqlardan ①② va 👆 olinadi: «Kataklarni bosing (N/4)», «Vaqtni suring (N/3)», «Varaqlarni tekshiring (N/3)» (187 — tugma o'ngda).
18. `AchRule` qatoridan 🏅 olinadi; `SCREEN_INTENTS` s0, s2, s4, s9, s10 yangilanadi.
19. Darvozalar: `npm run gates -- src/6-Modull/PmLesson22.jsx` 12/12 · `gates:qolip` q13–q21 · `lint:olchov` 0 · `lint:emoji` qolip-rejim 0 · `lint:jsx` · surat 1280 + 393.

REPO: yo'q (PM darsi).

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi — App.jsx bilan mos (m6-01 «Komponentlardan tizim» · m6-03 «Arxitektura patternlari»; menyu = `LESSON_META` nomi)
- [✓] Bitta misol-ip (basseyn → o'z mini-do'koni, keys — Microsoft); metafora yo'q · bitta vizual «Varaq va uch ekran» (0, 1, 2, 4, 6, 8, 9-ekran)
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0, 2, 4, 6, 8, 9, 10, 12 (testlar 3/5/7/11, podium, kartochka — tur bo'yicha shart emas)
- [✓] Sarlavha ≤55 (eng uzuni 53, 1-ekran — brauzerda bitta qator tekshiriladi) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (eng uzuni 80) · hook javobi 99 · xato izohi ≤60
- [✓] Atamalar: varaq/katak/qator/taxmin dars bo'yi bitta; «bo'sh» ↔ «javobsiz» ajratilgan; 1-xulosa «tushunadi» → «eslaydi» (2-ekran bilan bir so'z) · siz-forma; formula-qator yo'q; tugmalar ot-shakl/siz-forma
- [✓] Testlar: variantlar 33–38 / 31–35 / 45–49 / 34–38 belgi; ✔ eng uzun emas; ✔ o'rni o'zgarmagan (B · A · C · B); arena ✔ 3/3/3/3
- [✓] Final: bu darsda tartib-mashqi yo'q (yakuniy — 11-ekran QTest)
- [✓] Emoji yo'q (o'quvchi yuzasida: katak, variant, tugma, eyebrow, recap, yakun) — qolganlari nishon/arena/podium · kafolat so'zlari: arena «darrov» olindi; «har doim», «100%» yo'q
- [✓] Ichki kodlar yo'q · tarixiy voqea manba bilan (6-ekran) · «KOD» ro'yxati 19 band
- [✓] Karta T · P · S · PM: T-011/PM-030 (PRD artefaktdan keyin) · T-039 (mini-do'kon — modul ipi, 2-Moduldan) · T-042/049 (yakun, 12-ekran xulosasi) · T-047 (mentor ko'rinib
  turganini aytmaydi) · P-015 (reja = App ta'rifi) · P-052/067 (bitta vizual, harakat) · P-064 (bashorat 2-ekranda) · S-001 (savollar ≤12 so'z) · S-008 (arena 6/7 takror) ·
  S-015 (keysda 1 bashorat, o'sish tartibi) · S-018 (Microsoft izohi) · S-026 (recap raqam) · PM-027 (HwCard) · PM-028/029 (keys yorlig'i, chizilgan sahna)
- [✓] P-016 hook: ikkala tanlov teng, javob bitta (shox yo'q), maqtov yo'q (J-026)
- Ochiq (foydalanuvchi hal qiladi — hisobotda): 6-ekran ikkinchi bashorat olinishi (S-015) · 10-ekran darvoza-savoli mazmuni · testlarga 4-variant
