# 9-Modul (kod: `src/7-Modull`, kalit `m7-02`) · 2-dars (PM) «Besh odamdan nimani bilib olasiz?» — MD v3

Fayl: `src/7-Modull/PmFiveInterviewsLesson.jsx` (yangi, `src/skelet/NamunaDars.jsx` dan) · 16 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Menyu: «Besh odamdan nimani bilib olasiz?» · osti: «intervyu: bo'lib o'tgan ishni so'rash, 5 yozuv» (App.jsx `m7-02`, DE-205).
Oldingi dars: `m7-01` «Loyihangiz kimga kerak?» · keyingi: `m7-03` «Besh suhbatdan qaysi muammo chiqdi?».
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi.
Ballik testlar, to'g'ri javob o'rni: s3 = C (`correctIdx 2`) · s5 = A (`0`) · s7 = D (`3`) · s11 = B (`1`) — `INLINE_KEYS` shu bilan quriladi.
Dars hali yo'q — hamma ekran noldan yozilgan. Qavsdagi son — belgilar soni (skript bilan sanaldi).
Tashqi audit (ChatGPT) Filtri: `02-FILTR.md` — 05.10.2026 qo'llandi.

---

## A. Darsning tayanchi

1. **Bosh qoida (dars bo'yi bitta):** muammoni o'rganadigan intervyuda avval g'oyangizni aytmaysiz — odamdan oxirgi marta nima bo'lganini so'raysiz va eshitgan javobni u aytganidek yozasiz.
   Chegarasi (audit 1): bu — muammo bosqichining qoidasi. Tayyor saytni odamga berib kuzatish — boshqa ish (10-darsdagi sinov).
2. **Takror — yangi atama emas.** Texnika «Botingizni ishlatgan odamdan nimani so'raysiz?» darsida o'tilgan (`m5-08`, yakuniy MD `feedback/F-0928-QA-5modul/YAKUNIY/08-PmLesson20.md`).
   O'sha so'zlar aynan qoladi: **voqea savoli** — bo'lib o'tgan ishni so'ragan savol · **bo'sh savol** — javobidan bo'lib o'tgan ish bilinmaydigan savol ·
   **va'da** — hali bo'lmagan ish haqidagi javob · **eshitgan javob — u aytganidek** · **o'sha zahoti** yozish · «bitta odamning gapi hammaga yoyilmaydi».
   Bu darsdagi yangi qadam: u yerda odam botni ishlatgan edi, bu yerda sayt hali yo'q — shuning uchun **g'oya haqidagi savol ham bo'sh savol** (2-ekran xulosasi).
3. **Yangi so'zlar — misoldan KEYIN, bir marta (PM-030, T-011).** 4-ekranda o'quvchi o'yinchi bilan suhbatni oxirigacha olib boradi, shundan keyin nom beriladi:
   - **intervyu** — bitta odam bilan suhbat (ta'rif dars bo'yi so'zma-so'z shu, T-042; `m5-08` dagi «suhbat» bilan bir gapda tenglashadi, T-052);
   - **shablon** — har intervyuda bir xil to'rt qator (so'z o'smirga tanish, 1-ekrandan karta yorlig'i);
   - **yozuv** — to'ldirilgan shablon.
   Shablon qatorlari (dars bo'yi aynan shu nom, `SHABLON` bitta manbada, 180): **Kim bilan · Oxirgi marta nima bo'ldi? · O'shanda nima qildi? · Nima qiyin bo'ldi?**
4. **Inglizcha nom «custdev (customer development)» — faqat 14-ekran kartochkasida bir marta** (tayanch 2-bo'lim), qavsda izoh bilan. Boshqa joyda yo'q.
5. **Bir ma'no — bir so'z (T-014/015):** «maydon» — faqat futbol maydoni; forma joyi **qator** deyiladi, «maydon» emas · «band» — faqat egallangan
   (ro'yxat bandi ma'nosida ishlatilmaydi — kod vazifasida «shart») · «katak» ishlatilmaydi (4-darsdan «vaqt katagi») · «sinov», «hodisa», «talab», «mijoz» — bu darsda yo'q.
   «suhbat» — 1–3-ekranda (atama tug'ilguncha) va kitob voqeasida; 4-ekrandan keyin Maydon olamida — **intervyu**.
6. **Real odam (qaror 7):** darsda — sinfdosh bilan juftlikda bitta mashq intervyusi (9-ekran); uyga — besh real intervyu; 3-dars shu yozuvlar bilan boshlanadi.
   Tayanchdagi besh intervyu natija raqamlari bu darsda yo'q (ular 3-darsda).
7. **Toza yuza (185):** tugma, variant, karta, yorliq, recap'da emoji yo'q. O'yin qatlami (arena, nishon, podium) — mustasno.

## Darsning ipi va bitta vizual

- **Ip — «Maydon»:** mahalladagi futbol maydoni; muammo — kelasiz, band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak. Odamlar — **o'yinchi** va **maydon egasi** (ismsiz).
  Hook'da do'stga g'oya aytiladi → kelajak javobi (0) → o'yinchiga olti savol (2) → o'sha o'yinchi bilan intervyu, shablon yoziladi (4) → kitobdagi ona (6) →
  o'quvchining o'z muammosi uchun shablon (8) → sinfdosh bilan mashq yozuvi (9) → kod yozuvlarni tekshiradi (10) → uyda besh intervyu → 3-dars.
  Maydon egasi: 3 va 7-ekran savollari, 1-ekran namunasi va 10-ekran kodi. Bu — savol namunasi; 3-darsdagi besh yozuv — besh o'yinchi (GATE M K4).
- **Bitta vizual — «Suhbat va shablon» (`SuhbatShablon`, dars bo'yi):**
  - chapda **suhbatdosh**: chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas), ostida rol yorlig'i («o'yinchi» / «maydon egasi» / «sinfdosh») va **javob pufagi**;
    pufak ostida bitta kulrang yorliq — javob turi: «voqea» (yashil) · «va'da» · «javob savolda» · «baho» · «fikr»;
  - o'ngda **shablon kartasi** (yorliq «Shablon»): tepada ixcham sarlavha-qator «Muammo: …» (faqat 8–9-ekranda), ostida to'rt qator — har birida qator nomi (kulrang) va javob joyi.
  - Qator holatlari: bo'sh (uzuq chiziq — to'ldiriladigan joy, U-041) → joriy (accent chegara) → yozildi (javob qo'shtirnoqda, bir lahza ajralib kiradi) →
    xato (`err` fon) → to'liq yozuv (chap chetda yashil chiziq).
  - 4-ekranda karta yonida beshta kichik karta-izi: «1 / 5» (bittasi yozilgan, to'rttasi uzuq chiziq) — P-056.
  - ✎ Kod (05.10, quruvchi): «to'liq yozuv» — chap yon chiziq o'rniga butun karta yashil chegarada + «✓», yozilgan qator yashil fonda (SABOQ 7: kartada rangli yon chiziq yo'q). Matn o'zgarmagan.
  - Ishlatiladi: 0 (pufak) · 1 · 2 (suhbatdosh va pufak) · 4 · 8 · 9 · 12. Kitob voqeasi (6) — o'z keys-maketi `KitobSahna` (PM-029).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · bitta savol
- Sarlavha: **«Ishlatarmidingiz?» desangiz, do'stingiz nima deydi?** (52)
- Mentor: Bugungi misol — mahalladagi futbol maydoni: kelasiz, u esa band. Shu muammo uchun sayt g'oyasini do'stingizga aytdingiz.
- Maket (chap): chat oynasi. O'ngda sizning pufagingiz: «Maydonni oldindan band qiladigan sayt qilsam, ishlatarmidingiz?» · chapda do'st pufagi — uch nuqta (yozmoqda).
- Variantlar (radio, o'ng; bir uzunlikda):
  - «Ha, men ham ishlatardim» deydi (30)
  - «Bilmadim, ko'rish kerak» deydi (30)
- Javob (ikkalasida bir xil, maqtovsiz — J-026): Ikkalasi ham bo'lishi mumkin. Lekin ikkalasi ham kelajak haqida: maydonda oxirgi marta nima bo'lgani aytilmadi. (111)
- **Harakat → Vizual o'zgarish:** variantni tanlash → chatda uch nuqta o'rniga do'stning javobi pufak bo'lib tushadi, ostida kulrang yorliq «va'da» (ikkinchi variantda «fikr»).
  Jonli darsda: sinf ovozlari chizig'i — har variant va foizi.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun bitta suhbatni to'rt qatorga yozib olasiz.** (48)
- Mentor: Darsda sinfdoshingiz bilan mashq qilasiz, uyda — besh odam bilan.
- Chap: «Dars oxirida — to'rt qatorga yozilgan bitta suhbat» + shablon kartasi; qatorlar 0.9 s oraliqda o'zi yoziladi (maydon egasi namunasi):
  - Kim bilan — maydon egasi
  - Oxirgi marta nima bo'ldi? — «Kecha bir soatga uch kishi qo'ng'iroq qildi»
  - O'shanda nima qildi? — «Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim»
  - Nima qiyin bo'ldi? — «Kim birinchi qo'ng'iroq qilganini eslay olmadim»
  oxirida karta chetida yashil chiziq.
- O'ng (01 · matn · teg; bosilmaydi — P-015):
  - 01 · Qaysi savol bo'lib o'tgan ishni so'rashini ajratasiz · `savol`
  - 02 · O'yinchi bilan suhbatni to'rt qatorga yozasiz · `shablon`
  - 03 · Kitobdagi ona qaysi savolga voqeani aytganini ko'rasiz · `voqea`
  - 04 · O'z muammongiz bo'yicha sinfdoshingiz bilan suhbatlashasiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Ikki xil savol  ← QTushuncha
- Eyebrow: Takror · ikki xil savol
- Sarlavha: **Qaysi savol maydonda bo'lgan voqeani ochadi?** (44)
- Mentor: Botingizni ishlatgan odamdan nimani so'raganingizni eslang — o'sha qoida maydonda ham ishlaydi. Har savolni o'z tomoniga joylang.
- Bashorat (ballsiz, 181): **Bu savollardan nechtasi voqeani ochadi?** · 2 · 3 · 4 — tanlov saqlanadi.
- Vizual: tepada olti savol-karta (aralash tartibda) · ostida ikki tomon, bir balandlikda: chap **Bo'lib o'tgan ishni so'raydi** · o'ng **Bo'lib o'tgan ishni so'ramaydi** ·
  o'ng chetda suhbatdosh — o'yinchi (pufak bo'sh).
- Savollar (o'yinchiga) → o'yinchining javobi → yorliq:
  1. «Oxirgi marta maydonga qachon bordingiz?» → «O'tgan shanba, kechqurun.» → voqea
  2. «O'sha kuni maydon bo'shligini qanday bildingiz?» → «Bilmadik — borib ko'rdik.» → voqea
  3. «Oxirgi marta egasiga qachon qo'ng'iroq qildingiz?» → «O'tgan shanba, maydon oldida turib.» → voqea
  4. «Band qiladigan sayt bo'lsa, ishlatarmidingiz?» → «Ha, ishlatardim.» → va'da
  5. «Maydon topish qiyin, shundaymi?» → «Ha, qiyin.» → javob savolda
  6. «Shunday sayt yaxshi g'oyami?» → «Ha, ajoyib g'oya!» → baho
- **Harakat → Vizual o'zgarish:** savol-kartani bosib, tomonni bosish (yoki sudrash) → to'g'ri bo'lsa karta o'sha tomonga kiradi VA o'yinchi pufagida uning javobi chiqadi,
  ostida yorliq (voqea — yashil; va'da / javob savolda / baho — kulrang). Noto'g'ri tomon → karta silkinib qaytadi, bir qator (`QXato`):
  - voqea savoli o'ng tomonga: Bu savol bo'lib o'tgan kunni so'rayapti. (40)
  - 4 chap tomonga: Bu sayt hali yo'q — javobi va'da bo'ladi. (41)
  - 5 chap tomonga: Javobni savolning o'zi aytib qo'ydi. (36)
  - 6 chap tomonga: Bu savol g'oyangizga baho so'rayapti. (37)
- 6/6 da: tomonlar ustida `m5-08` dagi nom paydo bo'ladi: chap **voqea savoli**, o'ng **bo'sh savol**. Natija qatori (`QTaxmin`): «Taxminingiz: 2 · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: G'oya haqidagi savol ham bo'sh savol: javobida maydonda bo'lgan voqea yo'q. (75)
- Tugma (pastki): 6 savolni joylang (N/6) → Davom etish · `tugadi`: kartalar paneli yopiladi, ikki tomon va o'yinchi pufagi butun enga (199).
- ✎ Kod (05.10, quruvchi): olti karta tepada birdaniga emas — bittadan katta karta («N / 6») chiqadi va tanlangan tomonga uchib kiradi (SABOQ 9, 13); bashorat savoli shu karta ustida. Matn o'zgarmagan.
- O'qituvchi eslatmasi: 6-savoldagi maqtovni «yomon» demang — u rost his, faqat maydonda nima bo'lganini aytmaydi. Kitob voqeasi (6-ekran) shu haqda.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`)
- Eyebrow: Tekshiruv · maydon egasi
- Savol: **Maydon egasiga qaysi savol voqea savoli?** (6 so'z)
  - A «Band qiladigan sayt sizga kerak bo'ladimi?» (42)
  - B «Kelasi oy odam ko'payadi deb o'ylaysizmi?» (41)
  - ✔ C «Kecha qaysi soatga ko'p qo'ng'iroq bo'ldi?» (42)
  - D «Kecha ham qo'ng'iroq ko'p bo'ldi, shundaymi?» (44)
- To'g'ri izohi: Savol kechagi kunni so'rayapti — egasi bo'lgan voqeani aytadi.
- Xato izohlari: A — Bu savol g'oyani so'rayapti — javobi baho bo'ladi. (50) · B — Kelasi oy hali kelmagan — javobi taxmin bo'ladi. (48) ·
  D — Javobni savolning o'zi aytdi — egasi «ha» deydi. (48)
- Eslatma: «kecha» to'g'ri variant va D da bor (vaqt so'zi faqat to'g'rida emas, §135 C).
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 4 · Bitta intervyu  ← QTushuncha (markaziy)
- Eyebrow: Tajriba · bitta suhbat
- Sarlavha: **Bitta o'yinchidan nimani bilib olasiz?** (38)
- Mentor: Savolni siz tanlaysiz, o'sha o'yinchi javob beradi. Javob shablonning qaysi qatoriga tushishini kuzating.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8): 1 Oxirgi marta nima bo'ldi? · 2 O'shanda nima qildi? · 3 Nima qiyin bo'ldi? (joriy — accent, o'tgani ✓).
  Har qadamda ikki savol-tugma (bir uzunlikda). O'ng — suhbatdosh (o'yinchi) + shablon kartasi; 1-qator «Kim bilan — o'yinchi» oldindan yozilgan, qolgan uchtasi uzuq chiziq.
- Qadamlar (✔ — qatorni to'ldiradigan savol; o'rni almashib turadi):
  1. «Maydon topish sizga qiyinmi?» → «Ha, ba'zan qiyin.» → javob savolda ·
     ✔ «Oxirgi marta borganingizda nima bo'ldi?» → «O'tgan shanba sinfdoshlar bilan bordik — maydon band ekan.» → 2-qator
  2. ✔ «O'shanda nima qildingiz?» → «Egasiga qo'ng'iroq qildik — ko'tarmadi. Hovlida o'ynadik.» → 3-qator ·
     «Sayt bo'lsa, oldindan band qilarmidingiz?» → «Ha, band qilardim.» → va'da
  3. «Maydonlar umuman yetishmaydimi?» → «Bilmadim, balki yetishmaydi.» → fikr ·
     ✔ «O'sha kuni eng qiyini nima bo'ldi?» → «Yarim soat yo'l yurib keldik — bekorga.» → 4-qator
- **Harakat → Vizual o'zgarish:** savolni bosish → o'yinchi pufagida javob chiqadi.
  Voqea savoli bo'lsa javob pufakdan shablonning joriy qatoriga qo'shtirnoqda tushadi, qadam ✓ bo'ladi, keyingi qadam ochiladi.
  Bo'sh savol bo'lsa pufak ostida kulrang yorliq («javob savolda» / «va'da» / «fikr»), qator uzuq chiziq bo'lib qoladi, tanlangan tugma o'chadi — ikkinchisi qoladi.
  42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi): Qaysi savolning javobida kun yoki qilingan ish bo'ladi?
- 3/3 da (atama — misoldan keyin, bir marta; `QIzoh`): Bitta odam bilan shunday suhbat — intervyu. To'ldirilgan shablon — yozuv.
  Karta ustida yorliq **intervyu yozuvi**, yonida beshta karta-izi: «1 / 5».
- Xulosa: Bitta yozuv — bitta odamning voqeasi. Bu modulda besh odam bilan gaplashib, takrorini qidiramiz. (96) — 5 — modul topshirig'i, qonun emas (audit 2)
- Tugma (pastki): Savolni tanlang (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, shablon kartasi va «1 / 5» butun enga.
- Nishon: **First Record!** — uchala qadamda birinchi bosishda voqea savoli.
- Eslatma (`m5-08` bilan bog'lanish): «suhbat» so'zi o'sha darsdagi ma'noda; bu yerda u nom oladi — intervyu (T-052).

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`)
- Eyebrow: Tekshiruv · keyingi savol
- Iqtibos (savol ustida, suhbatdosh pufagida): O'yinchi: «Kelsak, maydon band ekan.»
- Savol: **Keyingi savolingiz qaysi?** (3 so'z)
  - ✔ A «Maydon band ekan — o'shanda nima qildingiz?» (42)
  - B «Sayt bo'lsa, maydonni band qilarmidingiz?» (41)
  - C «Maydonlar ko'pincha band bo'ladi, shundaymi?» (44)
  - D «Keyingi safar qachon borishni o'ylayapsiz?» (41)
- To'g'ri izohi: Savol o'sha voqeani davom ettiradi — shablonning keyingi qatori yoziladi.
- Xato izohlari: B — Bu sayt hali yo'q — javobi va'da bo'ladi. (41) · C — Javobni savolning o'zi aytdi — u «ha» deydi. (44) ·
  D — Bu kelajakni so'rayapti — voqeadan chiqib ketdingiz. (52)
- Tanlagach: pufak ostidagi kichik shablonda «O'shanda nima qildi?» qatori yonadi (to'g'ri — yashil, xato — `err` fon).
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 6 · Kitobdan · The Mom Test  ← QVoqea
- Eyebrow: Kitobdan (GATE M 02-q0; PM-028 ramkasi)
- Sarlavha: **Onangiz ham rostini aytadigan savol qanday bo'ladi?** (51)
- Mentor: «The Mom Test» — Rob Fitzpatrick degan tadbirkorning odamlar bilan qanday gaplashish haqidagi kitobi. U 2013-yilda chiqqan.
- Nuqtalar (5) · yorliq **The Mom Test · N/5** (bashorat kartasida ham) · maket `KitobSahna` (chizilgan: kitob muqovasi → oshxona stoli, ona va o'g'il siluetlari, planshet, javon; logotip yo'q, son o'ylab topilmagan).
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/5 **Kitob bitta misol bilan boshlanadi** — Muallif o'zi ham odamlar bilan noto'g'ri gaplashganini yozadi. Kitobda o'g'il onasi bilan ikki marta gaplashadi.
    · maket: muqova ochilib oshxona sahnasiga o'tadi
  - 2/5 bashorat — **O'g'il g'oyasini aytadi: planshetda ochiladigan taomlar kitobi. Onasi nima deydi?** · «Menga kerak emas» · «Bilmadim, ko'rish kerak» · ✔ «Ajoyib ekan, narxi ham yaxshi»
    (bir o'lchov — rozilik darajasi, o'sish tartibida, S-015)
  - 3/5 **Ona g'oyani maqtadi** — Ona yolg'on gapirmoqchi emas edi: o'g'lini xafa qilmaslik uchun maqtadi. O'g'il ilovani qurdi — uni hech kim, hatto onasi ham olmadi.
    · maket: ona pufagi «Ajoyib ekan!», ostida kulrang yorliq «baho»
  - 4/5 bashorat — **Ikkinchi suhbatda o'g'il boshqa savollar beradi. Qaysi biri ko'proq narsa ochadi?** · «Taomlar ilovasi sizga kerakmi?» · «Planshetda odatda nima qilasiz?» ·
    ✔ «O'zingizga oxirgi marta qaysi kitobni oldingiz?» (g'oya → odatda → oxirgi marta)
    · javobdan keyin bir qator (`QIzoh`): «Odatda» savoliga ona umumiy javob bergan: yangiliklar, o'yinlar.
  - 5/5 **«Oxirgi marta» savoli voqeani ochdi** — Uch oy oldin ona o'zi uchun go'shtsiz taomlar kitobini olgan. G'oya aytilmagani uchun u maqtamadi — voqeani aytdi.
    · maket: javonda bitta ochilgan kitob, yorliq «3 oy oldin»
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- ✎ Kod (05.10, quruvchi): SABOQ 8 — bosqich gapi Mentorda. 1/5 da Mentor: kitob izohi + bosqich matni; bashorat bosqichlarida Mentor birinchi gapni aytadi («O'g'il g'oyasini aytadi: …» · «Ikkinchi suhbatda …»), bashorat kartasida savol («Onasi nima deydi?» · «Qaysi biri ko'proq narsa ochadi?»). So'zlar aynan, faqat ikki joyga bo'lingan.
- Sahna yozuvlari (rasm ostida): 1 «Kitob · 2013» · 2 «Birinchi suhbat» · 3 «Maqtov» · 4 «Ikkinchi suhbat» · 5 «3 oy oldin»
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `KitobSahna` holati o'zgaradi: muqova → oshxona (o'g'il planshetni ko'rsatadi) →
  ona pufagi «Ajoyib ekan!» + yorliq «baho» → o'g'il planshetni qo'yadi, javonga ishora qiladi → javondagi kitob ochiladi, «3 oy oldin». Bashoratda tanlangan variant ✓/✗ va `QTaxmin`.
- Xulosa (5/5 dan keyin, ko'prik o'rnida): Kitob nomi shundan: ona ham rostini aytadigan savollar. Maydon intervyusida ham oxirgi voqea so'raladi. (103)
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish · nuqtalar ustida: Avval shu bosqichni tugating
- O'qituvchi eslatmasi: «rostini aytadi» — kitob nomidan; gap yolg'onda emas: g'oyani eshitgan odam muloyimlik qilib maqtaydi yoki kelajakni taxmin qiladi,
  o'tgan voqeani so'rasangiz — aniqroq javob olasiz (audit 3). Kitobdagi ona — muallif tuzgan misol, real voqea emas; bashoratlardan keyin buni sinfga ayting. Kitobdagi qoidalar real: g'oya o'rniga odamning hayoti,
  kelajak o'rniga o'tgan aniq voqea, kamroq gapirib ko'proq tinglash.
<!-- manba: Rob Fitzpatrick, «The Mom Test: how to talk to customers and learn if your business is a good idea when everyone is lying to you», v1.06 (Launched: August, 2013; Revised: August, 2014), foundercentric.com;
1-bob «The Mom Test», 11–17-betlar: «Your mom will lie to you the most (just 'cuz she loves you)» · «digital cookbooks for the iPad» · onaning javobi «that sounds amazing. And you're right, $40 is a good deal» ·
«nobody (even his mom) buys it» · «What do you usually do on it? … generic question» → «Read the news, play sudoku…» · «What's the last cookbook you did buy for yourself?» → «I bought a vegan cookbook about 3 months ago» ·
«Mom was unable to lie to us because we never talked about our idea» · uch qoida (11–17-betlar) · «questions that even your mom can't lie to you about». Sayt: https://www.momtestbook.com (05.10.2026 ochildi).
«vegan» → «go'shtsiz» (vegan kitob go'shtsiz — gap rost, soddaroq). -->

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; kitob qoidasi maydon egasiga)
- Eyebrow: Tekshiruv · kitobdagidek
- Savol: **Kitobdagi o'g'ildek, maydon egasiga qaysi savolni berasiz?** (8 so'z)
  - A «Band qilish saytim sizga foydali bo'ladimi?» (43)
  - B «Saytim bo'lsa, unga pul to'lab turarmidingiz?» (45)
  - C «Odatda kim band qilganini qayerga yozasiz?» (41)
  - ✔ D «Kecha kim band qilganini qayerga yozdingiz?» (42)
- To'g'ri izohi: Kitobdagidek: g'oya aytilmadi, kechagi voqea so'raldi.
- Xato izohlari: A — Bu savol g'oyangizga baho so'rayapti. (37) · B — Bu sayt hali yo'q — javobi va'da bo'ladi. (41) · C — «Odatda» savoliga umumiy javob keladi. (38)
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 8 · Shablonni tayyorlash  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Muammongiz bo'yicha kimdan nimani so'raysiz?** (44)
- Kirish qatori (kulrang, bitta; ikki tarmoq bir shaklda):
  - (1-darsda muammo tanlangan bo'lsa — `pm-m7d1-tanlangan`) O'tgan darsda tanlagan muammongiz: «{matn}». Shu bilan davom etasiz yoki ro'yxatingizdan (`pm-m7d1-muammolar`) boshqasini tanlaysiz.
  - (bo'lmasa) Atrofingizdagi bitta muammoni yozing.
- Mentor: Muammoga kim duch kelsa, o'shandan so'raysiz — maydonda bular o'yinchi va maydon egasi edi. Savolda g'oyangiz bo'lmasin.
- Bitta ustun: qadam-chiplari 1/2/3 → forma (har qadamda bitta qator) → Yordam · «Shablonga yozish» o'ngda (187) · ostida shablon kartasi.
- Qadamlar va qatorlar:
  - 1 Muammo — «Qaysi muammo haqida so'raysiz?» (ro'yxatdan bosib tanlash yoki yozish) → karta sarlavha-qatori «Muammo: …»
  - 2 Kimdan so'raysiz — «Bu muammoga kim duch keladi?» → karta sarlavha-qatori «Kimdan so'rayman: …»
  - 3 Birinchi savol — «Oxirgi marta nima bo'lganini qanday so'raysiz?» → «Oxirgi marta nima bo'ldi?» qatori ostida savolingiz (kulrang kursiv)
- Shablonda tayyor turadi (har intervyuda bir xil): «O'shanda nima qildi?» qatori ostida savol «O'shanda nima qildingiz?» · «Nima qiyin bo'ldi?» qatori ostida «Eng qiyini nima bo'ldi?».
- Izoh-qator (`QIzoh`, shablon kartasi ostida; audit 4): Uch savol — boshlash uchun tayanch. Odam qiziq narsa aytsa, o'sha joyni davom ettiring: «Keyin nima bo'ldi?» · «Nega shunday qildingiz?»
- Tekshiruv (`QXato`, ≤60; o'tmasa qator `err` fonda, yozilmaydi):
  - 2-qadamda «hamma», «odamlar», «har kim»: "Hamma" — juda keng. Aynan kim duch keladi? (43)
  - 3-qadamda kelajak yoki shart («bo'lsa», «-armidingiz», «kelasi», «keyingi»): Bu ish hali bo'lmagan — o'tgan kunni so'rang. (45)
  - 3-qadamda g'oya so'zi («sayt», «ilova», «bot», «g'oya»): Savolda g'oyangiz bor — odamning o'zi haqida so'rang. (53)
  - 3-qadamda «shundaymi», «to'g'rimi»: Bunga odam shunchaki «ha» deydi. (32)
  - o'tsa (yashil, bitta qator): Savol o'tgan voqeani so'rayapti — shablonga yozildi. (51)
- Yordam: Savolni «Oxirgi marta … qachon bo'ldi?» yoki «Oxirgi marta … bo'lganda nima bo'ldi?» deb boshlang. Muammoning ikki tomoni bo'lsa, ikkalasidan ham so'rang.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Shablonga yozish» → shablon kartasiga qator kiradi, joriy chip keyingisiga o'tadi; o'tmagan qator `err` fonda va ostida bitta `QXato`.
  3/3 da forma yopiladi, shablon kartasi butun enga (199), har qator yonida ✎ (sichqoncha ustida: Tahrirlash).
- Xulosa: Shablon tayyor: savolingiz g'oyani emas, odamning oxirgi voqeasini so'raydi. (76)
- Tugma (pastki): Uch qadamni yozing (N/3) → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Nishon: **Ready to Ask!**

## 9 · Juftlikda intervyu  ← QMustaqil
- Eyebrow: Juftlikda · mashq intervyu
- Sarlavha: **Sinfdoshingizdan nimani eshitasiz?** (34)
- Mentor (jonli darsda): Avval siz so'raysiz, keyin sherigingiz sizdan so'raydi. Javobni o'sha zahoti, u aytganidek yozing.
- Mentor (mustaqil rejimda): Yoningizdagi bir odamga savollaringizni bering. Javobni o'sha zahoti, u aytganidek yozing.
- Bitta ustun: qadam-chiplari 1/2/3 → forma → Yordam · «Yozuvga qo'shish» o'ngda · ostida 8-ekrandagi shablon kartasi (savollar bilan).
  1-qator «Kim bilan» oldindan yozilgan: jonli — «sinfdosh», mustaqil — «yoningizdagi odam» (✎ bilan o'zgartiriladi).
- Qadamlar (har qadamda tepada savol, ostida bitta qator «U nima dedi?»):
  - 1 Oxirgi marta nima bo'ldi? — savol: {8-ekrandagi birinchi savol}
  - 2 O'shanda nima qildi? — savol: «O'shanda nima qildingiz?»
  - 3 Nima qiyin bo'ldi? — savol: «Eng qiyini nima bo'ldi?»
- Tekshiruv (`QXato`, ≤60):
  - xulosa so'zi («kerak», «hamma», «ko'pchilik», «odatda»): Bu xulosaga o'xshaydi — u aytganidek yozing. (44)
  - qator bo'sh: tugma o'chiq emas, yonida qulf-yorliq: Sinfdoshingiz nima dedi — shuni yozing. (40)
- Yordam: Sinfdoshingizda bu voqea bo'lmagan bo'lsa — shuni yozing: bu ham javob. Kitobdagi yana bir qoida: kamroq gapiring, ko'proq tinglang.
- **Harakat → Vizual o'zgarish:** javobni yozib «Yozuvga qo'shish» → shablon qatoriga eshitgan javob qo'shtirnoqda kiradi, chap chetda yashil chiziq; xulosa so'zi bo'lsa qator `err` fonda.
  3/3 da forma yopiladi, karta ustida yorliq **mashq yozuvi**, karta butun enga, har qator yonida ✎.
- Xulosa: Mashq yozuvi tayyor: har qatorda eshitgan javob, u aytganidek. (62)
- ✎ Kod (05.10, quruvchi): xulosa so'zi tekshiruvi yumshoq — `err` + `QXato` chiqadi, xuddi shu matn bilan ikkinchi bosishda qabul qilinadi («kerak» rost iqtibosda ham bo'lishi mumkin). MD ga taklif: «Shunday qoldirsangiz — yana bosing» qatori.
- Tugma (pastki): Uch qatorni yozing (N/3) → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- O'qituvchi eslatmasi: juftlikka 6 daqiqa — 3 daqiqa birinchisi so'raydi, 3 daqiqa ikkinchisi. Sherigida voqea bo'lmasa, bu ham yozuv: «muammo unda yo'q» degani.
- Nishon: **Interviewer!**

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **Yozuvning bo'sh qatorlarini topadigan kod yozamiz.** (50) — PM-082(a) sarlavha oilasi
- Mentor: Uyda besh yozuv yig'asiz — har birida to'rt qator yozilganini endi kod tekshiradi. Yozuvlar Maydon intervyularidan.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **`yozuv.qildi` qiymati `""` bo'lsa, nima bilinadi?** · Odam hech narsa qilmagan · ✔ Bu qator hali yozilmagan · Intervyu umuman bo'lmagan
  - xato 1: Bo'sh qator — odam emas, siz yozmagan joy. (42) · xato 3: Boshqa qatorlar yozilgan — intervyu bo'lgan. (44)
- Chap (vazifa, 3 shart): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ro'yxatda faqat yozilmagan qatorlar nomi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Bitta qatordan boshlang: `yozuv.voqea === ""` bo'lsa, ro'yxatga `"voqea"` ni qo'shing. Ishlagach qolgan ikkitasiga o'ting.
  Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `if` — shart · `push` — ro'yxat oxiriga qo'shadi · `console.log` — qiymatni ekranga chiqaradi.
  Qo'shimcha: `yozuvlar` ga sinfdoshingizdan olgan mashq yozuvini qo'shing va tekshiring.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas).
- Kod:
```js
// Maydon intervyulari — uchta yozuv
const yozuvlar = [
  { kim: "o'yinchi",
    voqea: "O'tgan shanba bordik — maydon band ekan",
    qildi: "Egasiga qo'ng'iroq qildik — ko'tarmadi",
    qiyin: "Yarim soat yo'l yurib keldik — bekorga" },
  { kim: "maydon egasi",
    voqea: "Kecha bir soatga uch kishi qo'ng'iroq qildi",
    qildi: "",
    qiyin: "Kim birinchi qo'ng'iroq qilganini eslay olmadim" },
  { kim: "o'yinchi", voqea: "", qildi: "", qiyin: "" }
];

function yozilmagan(yozuv) {
  // yozilmagan qatorlarning nomini ro'yxatga yig'ing
  return [];   // shu joyni siz yozasiz
}

console.log(yozilmagan(yozuvlar[0]));
// []
console.log(yozilmagan(yozuvlar[1]));
// ["qildi"]
console.log(yozilmagan(yozuvlar[2]));
// ["voqea", "qildi", "qiyin"]
```
- Kod oynasi sarlavhasi: `app.js — yozilmagan funksiyasini yakunlang` · bo'sh fayldagi izoh: `// yozilmagan qatorlar nomini qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: to'liq yozuvga — bo'sh ro'yxat. (59) · 2 — Ro'yxatga faqat qiymati "" bo'lgan qator nomi tushsin. (54) ·
  3 — Uchinchi yozuvda uch qator yozilmagan — uchalasi chiqsin. (57)
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri javob → kod namunasidagi `""` qiymatlar bir lahza ajraladi; kod ishga tushganda Console'da uch ro'yxat chiqadi, shartlar birma-bir ✓.
- Tugma: ✓ Bajardim — kod ishladi · qulf-holat: Avval kod-savolini yeching
- ✎ Kod (05.10, quruvchi): «Bajardim» kod oynasi bir marta ochilgandan keyin yoqiladi (SABOQ 11: bir vaqtda bitta faol tugma — avval «Kompilyatorni ochish»).
- Tugmalar: Orqaga · ① Kod-savolini yeching → ② Kodni yozing → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Nishon: **Record Checker!**

## 11 · 4-savol  ← QTest (✔ B, `correctIdx 1`; yakuniy)
- Eyebrow: Yakuniy tekshiruv
- Iqtibos: O'yinchi: «Juma kuni egasiga uch marta qo'ng'iroq qildim — ko'tarmadi.»
- Savol: **Yozuvga qanday yozasiz?** (3 so'z) — distraktorlar mazmunga yaqinlashtirildi (audit, Qisman)
  - A «O'yinchilar egasiga ko'p qo'ng'iroq qilib, qattiq qiynaladi» (59)
  - ✔ B «Juma kuni egasiga uch marta qo'ng'iroq qildim — ko'tarmadi» (58)
  - C «Egasi juma kunlari telefoniga deyarli qaramasa kerak» (52)
  - D «Egasining o'rniga band qilish sayti kerakligi aytildi» (53)
- To'g'ri izohi: Yozuvga eshitgan javob tushadi — u aytganidek.
- Xato izohlari: A — Siz gapini hammaga yoydingiz — u o'zi haqida gapirdi. (53) · C — Bu sizning taxminingiz — u buni aytmadi. (40) ·
  D — Bu sizning xulosangiz — u sayt haqida gapirmadi. (48)
- Tugmalar: Orqaga · Javobni tanlang → Davom etish

## 12 · Mustahkamlash  ← QMustaqil (2 qadam; audit: yodlash o'rniga keyingi savol)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Odam qisqa javob bersa, keyin nima so'raysiz?** (45)
- Mentor: Maydon egasi bitta gap bilan javob berdi. Avval {sherigingizga | ovoz chiqarib o'zingizga} keyingi savolni ayting, keyin yozing.
- Vizual: suhbatdosh (maydon egasi) va uning pufagi: «Kecha ko'p qo'ng'iroq bo'ldi.» · ostida shablon kartasi, «O'shanda nima qildi?» qatori joriy (uzuq chiziq).
- Qadamlar 1/2: 1 Sherigingizga ayting | Ovoz chiqarib ayting · 2 Keyingi savolni yozing
  - Mustaqil taymer (30 s): 30 soniyani boshlash · Hozir ovoz chiqarib ayting · To'xtatish · Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli taymer (1 daqiqa): Har biringizga 30 soniyadan — avval A, keyin B. · 1 daqiqani boshlash · Hozir A gapiradi · Hozir B gapiradi · To'xtatish · ↻ Yana 1 daqiqa
- Qator maslahati: O'sha kun haqida nimani so'raysiz?
- Tekshiruv (`QXato`, 8-ekrandagi qoidalar va matnlar): kelajak yoki shart — Bu ish hali bo'lmagan — o'tgan kunni so'rang. · g'oya so'zi — Savolda g'oyangiz bor — odamning o'zi haqida so'rang. ·
  «shundaymi», «to'g'rimi» — Bunga odam shunchaki «ha» deydi. · o'tsa (yashil): Savol o'sha voqeani davom ettiryapti.
- Yordam: O'sha kunni so'rang: «O'shanda nima qildingiz?» yoki «Keyin nima bo'ldi?»
- **Harakat → Vizual o'zgarish:** savolni yozib «Saqlash» → savol o'quvchi pufagi bo'lib chiqadi. O'tsa — egasi davom etadi: «Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim.»,
  javob shablonning «O'shanda nima qildi?» qatoriga qo'shtirnoqda tushadi, chap chetda yashil chiziq. O'tmasa — egasi pufagi ostida kulrang yorliq («va'da» / «javob savolda» / «baho»), bitta `QXato`.
- Xulosa (yozgach): Qisqa javobdan keyin o'sha voqeani davom ettirasiz — yozuvning keyingi qatori shunday yoziladi. (95)
- Tugmalar: Orqaga · Davom etish

## 13 · Natijalar (podium)  ← QNatija
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Egasiga voqea savoli · 2 — Keyingi savol · 3 — Kitobdagidek savol · 4 — Yozuvga tushadigan gap

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (platforma standarti, QOLIP)

| Old tomon | Orqa tomon |
|---|---|
| Intervyu nima? | Bitta odam bilan suhbat |
| Yozuv nima? | To'ldirilgan shablon |
| Shablonda qaysi to'rt qator bor? | Kim bilan · Oxirgi marta nima bo'ldi · O'shanda nima qildi · Nima qiyin bo'ldi |
| Voqea savoli nima? | Bo'lib o'tgan ishni so'ragan savol |
| Bo'sh savol nima? | Javobidan bo'lib o'tgan ish bilinmaydigan savol |
| «Sayt bo'lsa, ishlatarmidingiz?» — nima xato? | Sayt hali yo'q: javobi va'da bo'ladi |
| Muammoni o'rganadigan intervyuda g'oyangizni avval aytasizmi? | Yo'q — avval odamning oxirgi voqeasini so'raysiz |
| Yozuvga nima tushadi? | Eshitgan javob — u aytganidek |
| Nega bitta intervyu yetmaydi? | Bitta yozuv — bitta odamning voqeasi; takrorni ko'rish uchun bir necha odam kerak |
| Maydon muammosi bo'yicha kimdan so'raysiz? | O'yinchidan va maydon egasidan |
| Kitobdagi ona g'oyani nega maqtadi? | O'g'lini xafa qilmaslik uchun — bu baho, voqea emas |
| Muammoni odamlar bilan intervyu orqali o'rganish inglizcha qanday ataladi? | Custdev (customer development) |

- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · 12/12 karta yodlandi · ↻ Qaytadan takrorlash

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Shablon va mashq yozuvingiz tayyor.** (35)
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): G'oya haqida so'rasangiz baho eshitasiz, oxirgi voqea haqida so'rasangiz — muammoni bilasiz.
- Arena tugmasi: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda mentor boshlamaguncha) Mentorni kuting
- Endi siz bilasiz:
  - Bitta odam bilan suhbat — intervyu, to'ldirilgan shablon — yozuv.
  - Muammoni o'rganadigan intervyuda avval g'oyangiz emas, odamning oxirgi voqeasi so'raladi.
  - Shablonda to'rt qator bor: kim bilan, oxirgi marta nima bo'ldi, o'shanda nima qildi, nima qiyin bo'ldi.
  - Yozuvga eshitgan javob tushadi — u aytganidek.
- Nishonlaringiz — n/4 (mentor rejimida yo'q)
- Uyga vazifa (`HwCard`; sarlavha «Uyda nima qilasiz?», P-025):
  - Karta: Kimdan: muammongizga duch keladigan odamlardan · Nechta: 5 ta intervyu · Muddat: keyingi darsgacha
  - Qadamlar (raqam-doirali):
    1. Muammongizga duch keladigan besh odamni toping; muammoning ikki tomoni bo'lsa — ikkalasidan ham.
    2. Har biriga shablondagi savollarni bering, g'oyangizni aytmang.
    3. Javobni o'sha zahoti, u aytganidek yozing: har intervyu — bitta yozuv.
    4. Besh yozuvni keyingi darsga olib keling.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — **«Besh suhbatdan qaysi muammo chiqdi?»** Besh yozuvingizdagi takrorlardan bitta muammoni tanlaysiz.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **First Record!** (4-ekran, uchala qadamda birinchi bosishda voqea savoli) — O'yinchi bilan suhbatda shablonning uch qatorini birinchi urinishda to'ldirdingiz
- **Ready to Ask!** (8-ekran) — Muammongiz uchun shablonni tayyorladingiz
- **Interviewer!** (9-ekran) — Sinfdoshingizdan intervyu olib, mashq yozuvini to'ldirdingiz
- **Record Checker!** (10-ekran) — Yozuvning yozilmagan qatorlarini kod bilan topdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · bosib davom eting · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz
1. (3-ekran) **Voqea savoli va bo'sh savol**
   1. Voqea savoli — Bo'lib o'tgan ishni so'ragan savol — **voqea savoli**. Javobida kun va qilingan ish bo'ladi.
   2. G'oya haqidagi savol — Sayt hali yo'q: «ishlatarmidingiz?» savoliga javob **va'da** bo'ladi.
   3. Javob savolda — «…, shundaymi?» savoliga odam shunchaki **«ha»** deydi.
   - Sinfga savol: Maydon egasidan kechagi kun haqida nimani so'rardingiz?
2. (5-ekran) **Voqeani davom ettiring**
   1. Keyingi savol — Odam voqeani aytdi: endi **«O'shanda nima qildingiz?»** deb so'raysiz.
   2. Keyingi qator — Har voqea savoli shablonning **keyingi qatorini** to'ldiradi.
   3. Chiqib ketish — «Keyingi safar…» savoli gapni **kelajakka** olib ketadi — qator yozilmaydi.
   - Sinfga savol: O'yinchi «maydon band ekan» dedi. Keyin nimani so'raysiz?
3. (7-ekran) **Onangiz ham rostini aytadi**
   1. Birinchi suhbat — G'oyani eshitgan ona o'g'lini xafa qilmaslik uchun **maqtadi**.
   2. Ikkinchi suhbat — G'oya aytilmadi: ona **oxirgi marta** nima bo'lganini aytdi.
   3. «Odatda» savoli — Unga **umumiy javob** keladi, «oxirgi marta» savoliga esa voqea.
   - Sinfga savol: Do'stingiz g'oyangizni maqtasa, bundan nima bilinadi?
4. (11-ekran) **Yozuvga nima tushadi**
   1. Eshitgan javob — Yozuvga **eshitgan javob** tushadi — u aytganidek.
   2. Xulosa va taxmin — Sizning **xulosangiz** ham, taxminingiz ham yozuvga tushmaydi.
   3. Bitta odam — Bitta odamning gapi **hammaga yoyilmaydi**: u o'zi haqida gapirdi.
   - Sinfga savol: Sinfdoshingizning javobini u aytganidek ayta olasizmi?

## Jonli viktorina (12 savol; ✔ o'rni A/B/C/D — har biri 3 marta)
1. Intervyu nima?
   - ✔ A — Bitta odam bilan suhbat
   - B — Ko'p odamga bitta e'lon
   - C — Sinfga g'oyani aytish
   - D — Odamni jim kuzatib turish
2. Yozuv nima?
   - A — Intervyu savollari ro'yxati
   - ✔ B — To'ldirilgan shablon
   - C — Intervyudan chiqqan xulosa
   - D — G'oyangiz haqidagi matn
3. «Sayt bo'lsa, ishlatarmidingiz?» — bu qanday savol?
   - A — Voqea savoli — maydonni so'radi
   - B — Voqea savoli — javobi qisqa
   - ✔ C — Bo'sh savol — javobi va'da
   - D — Bo'sh savol — savoli qisqa
4. «Oxirgi marta maydonga qachon bordingiz?» — bu qanday savol?
   - A — Bo'sh savol — kelajakni so'radi
   - B — Bo'sh savol — javobi «ha» bo'ladi
   - C — Voqea savoli — g'oyani so'radi
   - ✔ D — Voqea savoli — o'tgan kunni so'radi
5. Shablondagi to'rt qatordan biri qaysi?
   - A — Sayt sizga yoqdimi?
   - ✔ B — Nima qiyin bo'ldi?
   - C — Kelasi safar nima qilasiz?
   - D — Narxi qancha bo'lsin?
6. O'yinchi: «Maydon band ekan». Keyingi savol qaysi?
   - ✔ A — O'shanda nima qildingiz?
   - B — Sayt bo'lsa, band qilasizmi?
   - C — Maydon ko'p band bo'ladimi?
   - D — Keyin qachon borasiz?
7. Yozuvga qaysi gap tushadi?
   - A — Intervyudan siz chiqargan xulosa
   - B — Odam haqida sizning taxminingiz
   - C — Hammaga taalluqli umumiy gap
   - ✔ D — Eshitgan javob, u aytganidek
8. Kitobdagi ona g'oyani nega maqtadi?
   - A — U shunday ilovani qidirgan edi
   - B — Planshetda ko'p o'tirardi
   - ✔ C — O'g'lini xafa qilmaslik uchun
   - D — Taomlar kitobi unga kerak edi
9. Kitobda qaysi savol ko'proq narsa ochdi?
   - A — «Taomlar ilovasi sizga kerak bo'ladimi?»
   - B — «Planshetda odatda nima qilasiz?»
   - C — «Shunday ilovani sotib olarmidingiz?»
   - ✔ D — «Oxirgi marta qaysi kitobni oldingiz?»
10. Kitob nomi nimani anglatadi?
    - ✔ A — Onangiz ham rostini aytadigan savollar
    - B — Faqat onangizga beriladigan savollar
    - C — Onangizga g'oyani aytib ko'rish usuli
    - D — Onangiz bilan maslahatlashish qoidasi
11. Maydon muammosi bo'yicha kimdan intervyu olasiz?
    - A — Futbol o'ynamaydigan qo'shnidan
    - B — Sayt yasay oladigan do'stdan
    - ✔ C — O'yinchidan va maydon egasidan
    - D — G'oyani maqtaydigan sinfdoshdan
12. Nega bitta intervyu yetmaydi?
    - A — Bitta odam ko'p gapira olmaydi
    - ✔ B — Bitta yozuv — bitta odamning voqeasi
    - C — Shablonda to'rtta qator bor xolos
    - D — Ko'p odam maqtasa — g'oya to'g'ri (F-1005-93 A)
- ✔ taqsimoti: A — 1, 6, 10 · B — 2, 5, 12 · C — 3, 8, 11 · D — 4, 7, 9.
- ✎ Kod (05.10, quruvchi): 12-savol D varianti kodda «Ko'p odam maqtasa — g'oya to'g'ri» (vergul o'rniga tire) — `lint-tell`: tire faqat to'g'ri variantda bo'lmasin. MD ga taklif: shu shaklda.
- Kalit ibora to'g'ri javoblarda takrorlanmaydi (§138 C): «voqea» 3A/3B/4C distraktorlarida ham bor, «u aytganidek» faqat 7-savolda.
- Arena yozuvlari — umumiy shablon (Testni boshlash · Mentor testni boshlashini kuting… · Savol n/12 · Adashdingiz — 0 ball. Keyingisida olasiz. · Test yakunlandi! · jadval: TOP-5).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — intervyu · yozuv · savol · voqea · shablon · maydon · odam (+ 🎙️ ✅ — o'yin qatlami) ·
  uyga vazifa banneri — intervyu · yozuv · savol · odam (faqat so'z).

---

## B. KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. Yangi fayl `src/7-Modull/PmFiveInterviewsLesson.jsx` skeletdan; App.jsx `m7-02` qatoriga `comp: PmFiveInterviewsLesson` («qur» bosqichida, qaror 6) — nom va `sub` o'zgarmaydi (DE-205).
2. Qolip: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` ·
   s8/s9/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')` (q13–q21).
3. `SHABLON` — bitta manba (180): 4 qator `{ kalit: 'kim'|'voqea'|'qildi'|'qiyin', nom, savol }`; `SuhbatShablon` vizuali (suhbatdosh silueti + pufak + yorliq · shablon kartasi + qator holatlari ·
   «n / 5» izlari) — 0, 1, 2, 4, 8, 9, 12-ekranlar shundan. s10 kod yozuvlari ham shu kalitlar bilan. `reduced-motion` — o'tishsiz.
4. s2 — `S2_SAVOLLAR` (6: matn, javob, tur `voqea|vada|savolda|baho`); bashorat 2/3/4; saralash; 6/6 da tomon nomlari; `QXato` matnlari turga qarab.
5. s4 — `S4_QADAMLAR` (3 × 2 savol, ✔ o'rni 2/1/2); bo'sh savol bosilsa tugma o'chadi; 3/3 da `QIzoh` atama-qatori va «1 / 5»; 42 s ipucha; nishon `firstRecord`.
6. s6 — `KitobSahna` maketi (muqova → oshxona → pufak → javon), `MOM_SLIDES` 5 ta, 2 bashorat, `QTaxmin`, 4/5 dan keyin `QIzoh`; yorliq «The Mom Test · N/5»; manba izohi faylda ham.
7. s8 — o'qiydi: `pm-m7d1-tanlangan` (`{ matn, kim }`, tanlangan holda) va `pm-m7d1-muammolar` (ro'yxat); yo'q bo'lsa erkin qator; tekshiruv `RegExp` lari (kelajak, g'oya so'zi, «shundaymi», «hamma»); natija saqlanadi
   `pm-m7d2-shablon` = `{ muammo, kimdan, savol1 }` — s9, uyga vazifa va 3-dars uchun (tayanch 6-bo'lim).
8. s9 — jonli/mustaqil ikki Mentor matni; 1-qator «Kim bilan» standart qiymati rejimga qarab; xulosa-so'z tekshiruvi; mashq yozuvi `pm-m7d2-mashq` = `{ kim, voqea, qildi, qiyin }`.
9. s10 — `KOD_TASK`: starter (yuqoridagi kod), `yozilmagan` funksiyasi, 3 `evalEquals` (`yozilmagan(yozuvlar[0])` → `[]` · `[1]` → `["qildi"]` · `[2]` → `["voqea","qildi","qiyin"]`);
   darvoza-mashq 3 variant; `HtmlCompiler` `app.js`. Satrlar qo'shtirnoqda (apostrof — §135 D).
10. s12 — `PairTimer` (▶ ⏹ belgisiz); savol tekshiruvi s8 `RegExp` lari bilan; o'tsa egasi javobi «O'shanda nima qildi?» qatoriga tushadi.
11. Testlar s3/s5/s7/s11 — `correctIdx` 2/0/3/1, `INLINE_KEYS` shu bilan; `RECAPS` 3/5/7/11 (`ask` + 3 karta, raqam 1/2/3); `Q_LABELS`.
12. s14 `FLASHCARDS` (12); s15 `RECAP` 4 qator, `HW_STEPS` 4 qadam, «Keyingi dars — …», asosiy fikr.
13. Uyga vazifa — `HwCard` yakun ekranida; alohida `.homework.jsx` yo'q (GATE M M-q9 — TAYANCHGA SAVOL 3 yopildi).
14. Arena `QUIZ_BANK` 12 savol (✔ yuqoridagidek), fon so'zlari {uz, ru}. `ACHIEVEMENTS` 4 ta.
15. **REPO — yo'q** (PM darsi; `maydon` repo 4-darsdan, `dars-04-done`).
- Darvozalar: `npm run gates -- src/7-Modull/PmFiveInterviewsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL
1. ~~1-darsdagi ro'yxat kaliti~~ — **yopildi** (audit, GATE M M-q5): s8 `pm-m7d1-tanlangan` dan boshlanadi, ro'yxat `pm-m7d1-muammolar`; yo'q bo'lsa erkin qator (tayanch 6-bo'lim).
2. ~~Mentor misolidagi yozuvlar~~ — **yopildi** (GATE M K4): 3-darsdagi besh yozuv — besh o'yinchi; maydon egasi suhbati — savol namunasi. Tarix: Men yozdim: o'yinchi — «O'tgan shanba sinfdoshlar bilan bordik — maydon band ekan» · «Egasiga qo'ng'iroq qildik — ko'tarmadi. Hovlida o'ynadik» ·
   «Yarim soat yo'l yurib keldik — bekorga» (tayanchdagi «band edi» va «egasi telefonni ko'tarmadi» ga mos); maydon egasi — «Kecha bir soatga uch kishi qo'ng'iroq qildi» ·
   «Hammasiga «ha» dedim, keyin ikkitasiga qayta qo'ng'iroq qildim» · «Kim birinchi qo'ng'iroq qilganini eslay olmadim» (tayanchda egasi tomoni yo'q — o'zim qaror qildim).
   Tayanchdagi besh natija o'yinchi tilida («kelganimizda») — besh kishining hammasi o'yinchimi? Bu dars «ikki tomondan so'rang» deydi; 3-dars beshligida maydon egasi bo'lsa, natijalar bilan mos kelishi kerak.
3. **Uyga vazifa (`HwCard`) — yangi PM dars uchun homework faylini kim yozadi?** PM-027 mavjud fayllarni himoya qiladi; yangi darsda matn shu MD dan olinsinmi?
4. **Keys — kitobdagi misol (muallif tuzgan ona), real kompaniya voqeasi emas.** Manba kitobning o'zi (v1.06, 2013), lekin «Biznes olamidan» freymida bunday misol mosmi?
   Muqobil — real kompaniya voqeasi; Airbnb 7-Modul darsida (`m5-08`) allaqachon bor, takror bo'lardi.
5. **Besh real yozuv qayerga yoziladi va 3-darsga qanday yetadi?** (qisman yopildi: 2-dars `pm-m7d2-shablon`, `pm-m7d2-mashq` yozadi; besh real yozuv — 3-dars 8-ekranida qo'lda kiritiladi, 3-dars navbatida) Uyga vazifa «keyingi darsga olib keling» deydi; qog'ozdami, telefondami yoki dars sahifasidami — 3-dars MD si bilan kelishish kerak
   (9-ekrandagi mashq yozuvi va 8-ekrandagi shablon saqlash kaliti ham shu savolga bog'liq).

## Shubhali joylar
- 0-ekran Mentorida muammoning ikkinchi yarmi («bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak») qisqalik uchun olindi — u 2-ekranda (3-savol) va 4-ekranda ochiladi.
- 6-ekranda «go'shtsiz taomlar kitobi» — kitobda «vegan cookbook»; «go'shtsiz» rost, lekin to'liq ma'nosi emas.
- 6-ekran 3/5 kartasi ~120 belgi — boshqa kartalardan uzunroq.
- 9-ekran — darsdagi yagona real odam bilan ish; mustaqil rejimda (o'quvchi yolg'iz) «yoningizdagi odam» bo'lmasligi mumkin — bajarib bo'lmaydigan qadam (P-028) xavfi; zaxira kerakmi?
- 11-ekranda to'g'ri javob — iqtibosning aynan o'zi (`m5-08` 11-ekrani ham shunday); qoida shu bo'lgani uchun qoldirdim.
- Arena 5-savol («Shablondagi to'rt qatordan biri qaysi?») — eslash savoli, distraktorlar bo'sh savollar; juda oson bo'lishi mumkin.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): `m7-01` «Loyihangiz kimga kerak?» → **`m7-02` «Besh odamdan nimani bilib olasiz?»** → `m7-03` «Besh suhbatdan qaysi muammo chiqdi?» — App.jsx 308–310-qatorlar bilan mos.
- [x] Bitta misol-ip: «Maydon» (o'yinchi + maydon egasi) — 0, 1, 2, 3, 4, 5, 7, 10, 11; metafora yo'q; bitta vizual `SuhbatShablon`. Kitob voqeasi — freymlangan keys (91b), xulosasi Maydonga qaytadi.
  O'quvchining o'z muammosi — 8, 9 (P-004 shaxsiy ip).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 6, 8, 9, 10, 12. Matn-karta yo'q.
- [x] O'lchov (skript bilan sanaldi): sarlavha 32–52 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 62–103 · hook javobi 111 · xato izohi 32–59.
- [x] Atamalar `m5-08` YAKUNIY bilan bir xil (voqea savoli, bo'sh savol, va'da, eshitgan javob — u aytganidek, o'sha zahoti); tayanch atamalari (intervyu, yozuv, band, maydon egasi) aynan;
  inglizcha nom — bir marta (14-ekran, qavs bilan); siz-forma; tugmalar ot-shaklda.
- [x] Testlar: s3 42/41/42/44 · s5 42/41/44/41 · s7 43/45/41/42 (C va D farqi — faqat «odatda» ↔ «kecha», kitob qoidasi) · s11 49/48/49/43 — to'g'ri javob eng uzun emas; «kecha» faqat to'g'rida emas (s3 D); ✔ o'rni C/A/D/B; arena 3/3/3/3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno); kafolat so'zlari yo'q («har doim», «100%», «darrov», «albatta» — Mentor va variantlarda yo'q).
- [x] Ichki kodlar yo'q (o'quvchi matnida «7-Modul», «m5-08» yo'q — «Botingizni ishlatgan odamdan…» darsi mazmuni bilan eslatiladi); keys fakti — manba bilan (izohda);
  «KOD» ro'yxati 15 qator, REPO 0.
- [x] Karta T · P · S · PM: T-011/PM-030 (atama misoldan keyin, 4-ekran) · T-014/015 («maydon» bir ma'noda, forma joyi «qator»; «band» faqat egallangan) · T-042 (intervyu/yozuv ta'rifi bir xil) ·
  T-052 (suhbat → intervyu bir gapda) · T-039 (sayt «sizniki» deyilmaydi — «sayt g'oyasi») · P-013 (asosiy fikr) · P-015 (reja bosilmaydi, kashfiyotni aytmaydi) · P-025 (uyga vazifa karta + 4 qadam, yakunda o'sha) ·
  P-056 («1 / 5») · P-062 (son bir marta) · P-064/S-015 (bashorat zinapoya, 2 va 6) · S-004 (har distraktor dars qoidasi bo'yicha xato) · S-018 (kitob izohi Mentorda, birinchi ko'rinishda) ·
  S-026 (recap raqam) · PM-028/029 (keys qolipi, chizilgan maket) · PM-082 (kod ekrani darvozasi) · J-026 (hook maqtovsiz).
- [ ] Ochiq: TAYANCHGA SAVOL 5 (besh real yozuv — 3-dars navbatida); 9-ekran mustaqil rejim zaxirasi.
