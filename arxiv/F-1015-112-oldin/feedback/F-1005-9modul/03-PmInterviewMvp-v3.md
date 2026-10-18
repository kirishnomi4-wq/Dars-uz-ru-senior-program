# 9-Modul · 3-dars (PM) «Besh suhbatdan qaysi muammo chiqdi?» — MD v3

Fayl: `src/7-Modull/PmInterviewMvpLesson.jsx` · kalit `m7-03` · 17 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Oldingi dars: 2 «Besh odamdan nimani bilib olasiz?» · keyingi: 4 «Mini-MVP arxitekturasi» (App.jsx 7-blok). Menyu nomi = `lessonTitle` = «Besh suhbatdan qaysi muammo chiqdi?» (205).
Dars yo'q — hamma ekran noldan. Tashqi audit (ChatGPT) Filtri: `03-FILTR.md` — 05.10.2026 qo'llandi (03-q0 A).
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatda quriladi.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: s3 = B, s5 = D, s7 = A, s12 = C (`INLINE_KEYS { s3: 1, s5: 3, s7: 0, s12: 2 }`);
arena kaliti 0,2,1,3 · 1,0,3,2 · 3,1,2,0 (A/B/C/D har biri 3 marta).

---

## A. Darsning tayanchi

1. **Dars turi (PM-005):** 2-tur, sof PM — artefakt yozma: bitta muammo gapi + uch quti ro'yxati (USTAXONA: 8 va 10-ekran). Kod ekrani (11) — 1-tur qismi (87): shikoyatlarni sanaydigan kod.
2. **Dars natijasi (00-MODUL-TAYANCH 4-bo'lim):** o'quvchining besh yozuvidan 1 muammo gapi + «Qilamiz / Keyin / Qilmaymiz» ro'yxati.
3. **Boshlanishi (qaror 7):** dars uyga vazifadagi besh intervyu yozuvi bilan ochiladi. 0–7 va 9-ekranda — Mentor misoli «Maydon» yozuvlari; 8, 10, 13-ekranda — o'quvchining
   o'z yozuvlari (yo'q bo'lsa — sinfdoshining yozuvlari). Real odam bilan yangi ish bu darsda yo'q.
4. **Avval misol, keyin nom (PM-107):** «muammo gapi» nomi 4-ekranda, ikki shikoyat birlashib karta o'zi yozilgandan keyin bir marta beriladi; «MVP» yangi atama emas —
   9-ekranda «Dekompozitsiya» darsidagi ta'rif so'zma-so'z qaytariladi (T-052).
5. **Asosiy ko'nikma:** bir kishi aytgani emas — ko'p yozuvda chiqqan shikoyat kuchli belgi (keyin og'irligi ham qaraladi: «bir soat kutdik, uyga qaytdik»; audit 1); uni bitta gapga aylantirish; imkoniyatlarni ikki savol bilan uch qutiga ajratish.
6. **Bugungi asosiy fikr (P-013, yakunda va 13-ekran xulosasida so'zma-so'z):** Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi.
7. **Matn o'lchovi (162/164, MK §218/219/225):** sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
8. **Toza yuza (D4):** tugma, variant, natija qatorida emoji yo'q; ✓ ✗ → ▸ — belgilar. O'yin qatlami (arena, nishon medali, podium) mustasno.

### Atamalar (bir ma'no — bir so'z; grep: 5 va 6-Modul YAKUNIY, `src/2-Modull/PmLesson5.jsx`, `src/3-Modull/PmLesson8.jsx`, `src/pm/PmUserStoryLesson.jsx`)

| So'z | Ma'nosi (darsda) | Qayerdan · ishlatilmaydi |
|---|---|---|
| intervyu | bitta odam bilan suhbat | tayanch; sarlavhadagi «suhbat» 2-ekranda tenglashtiriladi: «Har intervyu — bitta odam bilan suhbat» (T-052) · inglizcha atama yo'q |
| yozuv | bitta intervyuning shablonga yozilgani | tayanch, 2-dars · «varaq», «hisobot» yo'q |
| shikoyat | yozuvda odam aytgan, nimasi noqulay bo'lgani (u aytganidek) | 5-Modul 9-dars (§221 «shikoyatni emas, nimani berasiz?») · TAYANCHGA SAVOL 8 |
| muammo | ko'p odamda bor qiyinchilik; ikki shikoyat bitta asosiy qiyinchilikni ko'rsatsa — bitta muammo | 1-dars · «og'riq», «dard» yo'q |
| muammo gapi | kim, qachon va nimadan qiynalishini aytadigan bitta gap (2-Modul qolipi); unda yechim yo'q | faqat shu dars (12-dars pitchi o'qishi mumkin) |
| sanoq · nechta yozuvda | shikoyat chiqqan yozuvlar soni, «4 / 5» | m5-09 «nechta odam aytgan», m3-05 «nechta odam so'raydi» · **«takror» ishlatilmaydi** — «Takrorlash» (kartochkalar) va «Qisqa takrorlash» bilan to'qnashadi (T-015) |
| imkoniyat | mahsulot qila oladigan bitta ish (feature) | m2-07 «Oltala imkoniyat», LUG'AT «feature → imkoniyat» · «funksiya» yo'q (JS funksiyasi bilan to'qnashadi, T-015) |
| MVP | mahsulotning ish beradigan eng sodda birinchi versiyasi | m2-07, so'zma-so'z · yangi atama emas |
| «Qilamiz» · «Keyin» · «Qilmaymiz» | uch quti nomi (dastur, App.jsx `sub`) | «Keyin» = m2-07 «keyinga qoldirilganlar» (backlog): o'chirilmaydi, navbati suriladi · ravish «keyin» quti yonida ishlatilmaydi — «so'ng» |
| doska | darsning bitta vizuali (pastda) | LUG'AT («matritsa → doska») |
| o'yinchi · maydon egasi | «Maydon»ning ikki foydalanuvchisi | tayanch · «mijoz», «admin» yo'q |
| vaqt katagi · band qilish | bitta soatlik oraliq · katakni egallash | tayanch («ishlatilmaydi» ustuni) |

Bir so'z — bir ma'no ogohlantirishlari (T-015): «maydon» faqat futbol maydoni («forma maydoni» deyilmaydi — «katak», «qator»); «izoh» faqat Instagram'dagi izoh (izoh-tushuntirish o'quvchi matnida yo'q); «baho» faqat «Maydonga baho» imkoniyati.

### Misol-ip — «Maydon» (00-MODUL-TAYANCH 1-bo'lim, aynan)

- Mahsulot: mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. Odamlar ismsiz: o'yinchi · maydon egasi.
- Besh intervyu natijasi: 5 kishidan 4 tasi — «maydon band edi»; 3 tasi — «egasi telefonni ko'tarmadi»; 2 tasi — «jamoaga odam yetmadi»; 1 tasi — «pulni bo'lishish qiyin».
- Tanlangan muammo — darsdagi muammo gapi (GATE M 03-q0; qolip — 2-Modul «Kim, qayerda, nimadan qiynaldi?»: kim · qachon · nimadan qiynaladi; butun dars bo'yi bitta manba `MUAMMO_GAP`):
  **«O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»** · dalil «5 yozuvdan 4 tasida». Band qilishga dalil: 1, 2, 4-yozuvda o'yinchi kelishdan oldin egasiga qo'ng'iroq qilgan.
- MVP chegarasi: **Qilamiz** — kun bo'yicha vaqt kataklari · katakni band qilish · egasi uchun bandlar ro'yxati; **Keyin** — to'lov · jamoa yig'ish · vaqt bo'shasa — eslatma;
  **Qilmaymiz** — maydonga baho · o'yinchilar chati.
- Ikkinchi olam faqat test bandida (P-002): maktab oshxonasi (5-ekran, arena 1).

**Besh yozuv** (bitta manba `YOZUVLAR`; taqsimot — TAYANCHGA SAVOL 1; olam ichidagi gap, T-008):

| Yozuv | Odam aytgani (u aytganidek) | Shikoyatlar |
|---|---|---|
| 1-yozuv · o'yinchi | «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» | band · telefon |
| 2-yozuv · o'yinchi | «Shanba kuni bordik, maydon band ekan. Egasiga ikki marta qo'ng'iroq qildim — telefonni ko'tarmadi.» | band · telefon |
| 3-yozuv · o'yinchi | «Kecha kechqurun keldik, maydon band edi. Bir soat kutdik, so'ng uyga qaytdik.» | band |
| 4-yozuv · o'yinchi | «Yakshanba maydon band edi, egasi telefonni ko'tarmadi. Ertasiga keldik — endi jamoaga odam yetmadi.» | band · telefon · jamoa |
| 5-yozuv · o'yinchi | «**Eng yomoni — pulni bo'lishish!** Har safar kimdir "keyin beraman" deydi. Jamoaga odam ham yetmadi: guruhda yozdik, ikki kishi kelmadi.» | jamoa · pul |

Sanoq: band 4/5 · telefon 3/5 · jamoa 2/5 · pul 1/5 (tayanch bilan aynan). «Band» va «telefon» birga — 1, 2, 3, 4-yozuv = 4/5.

---

## Darsning ipi va bitta vizual

- **Hook:** besh yozuvdan biri juda qattiq yozilgan (pul) → «qaysi muammoni birinchi hal qilardingiz?» → yozuvning o'zi sanoqni aytmaydi.
- **Doska (`SanoqDoska`, dars bo'yi; bitta manba — `YOZUVLAR`, `SHIKOYATLAR`, `MUAMMO_GAP`, `IMKONIYATLAR`, 180):** oq karta, tepada kichik yorliq «"Maydon" · besh yozuv». Uch qavat:
  1. **Yozuvlar qatori** — besh kichik yorliq «1 · 2 · 3 · 4 · 5» (ochilmagan — kulrang, ochilgan — accent chegara).
  2. **Shikoyatlar** — har qatorda shikoyat (qo'shtirnoqda) + besh nuqta (qaysi yozuvlarda bor — bo'yaladi) + son «n / 5»; qatorlar son bo'yicha saralanadi.
     4-ekrandan tepada **muammo kartasi** (accent chegara): uch bo'lak — kulrang yorliqlar «kim» · «qachon» · «nimadan qiynaladi» — va «5 yozuvdan 4 tasida».
  3. **Uch quti** — «Qilamiz · Keyin · Qilmaymiz», bo'sh joy uzuq chiziqli (U-041), har qutida «N ta».
  Holatlar: kulrang «hali ochilmagan» · accent «hozir» · yashil ✓ «o'z joyida» · qizil chiziq bir lahza «boshqa qutiga». Yangi qator yoki karta bir lahza ajralib kiradi;
  `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Doska ⛶ ichida kattalashadi (`zoom`, q17).
- **Qayerda:** 0 (besh yozuv, «? / 5») · 1 (bo'sh shakl) · 2 (shikoyatlar tushadi) · 4 (ikki qator birlashadi, muammo kartasi) · 8 (o'quvchining doskasi) · 9 (imkoniyatlar qutilarga) ·
  10 (o'quvchining uch qutisi) · 11 (terminal — doskaning kod ko'rinishi) · 13 (muammo kartasi). 6-ekran (Burbn) — o'z sahnasi (telefon maketi), doska yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Qaysi muammoni birinchi hal qilardingiz?** (40)
- Mentor: «Maydon» uchun besh o'yinchi bilan intervyu qilindi — yozuvlar shu yerda. Uyga vazifadagi o'z yozuvlaringiz ham bugun kerak bo'ladi. (2 gap)
- Maket (chap): doskaning yozuvlar qavati — besh yozuv-kartasi (A-bo'lim jadvali), 5-yozuv boshqalardan uzun, birinchi gapi qalin. Kartalar o'qiladi, bosilmaydi.
- Variantlar (radio, teng uzunlikda):
  - Eng qattiq aytilganini — odam juda qiynalgan (44)
  - Eng ko'p aytilganini — ko'p odam qiynalgan (42)
- Javob (ikkalasida bir xil — sof so'rovnoma: «Aynan!/Qiziq fikr!» yo'q, P-016, J-026):
  Ikkalasining ham sababi bor. Lekin yozuvning o'zi buni aytmaydi — avval har shikoyat nechta yozuvda borligini sanaymiz. (119)
- **Harakat → Vizual o'zgarish:** variantni tanlash → har kartadagi shikoyat ostiga kulrang chiziq tushadi va yonida «? / 5» belgisi ochiladi — sanoq hali yo'q.
- Jonli darsda: sinf ovozlari — har variant va foizi.
- Tugma (pastki): Bittasini tanlang → Davom etish
- MentorNote: Uyga vazifani qilmagan o'quvchilarga ayting: mustaqil ishda sinfdoshining yozuvlari bilan ishlaydi. Hook'da to'g'ri javob yo'q — ikkala tanlovni ham qo'llang.

## 1 · Maqsad  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun yozuvlardan muammo va MVP ro'yxatini tuzasiz** (50)
- Mentor: Besh yozuvda gap ko'p, lekin birinchi versiya bitta muammoni hal qiladi. (72)
- Chap yorliq: Dars oxirida o'z g'oyangiz uchun shu doskani to'ldirasiz
- Chap: doskaning bo'sh shakli — tepada bo'sh muammo qatori «? / 5», pastda uch quti «Qilamiz · Keyin · Qilmaymiz»; kataklar ichida kulrang skelet-chiziqlar navbat bilan paydo bo'ladi (matnsiz — 4 va 9-ekran kashfiyotini ochmaydi, P-015).
- O'ng yorliq: Bugungi 4 qadam
- Qadamlar (01 · matn · teg; bosilmaydi):
  - 01 · Besh yozuvdagi shikoyatlarni sanaysiz · `sanoq`
  - 02 · Eng ko'p chiqqanini bitta gapga yozasiz · `muammo`
  - 03 · Imkoniyatlarni uch qutiga ajratasiz · `MVP`
  - 04 · Shikoyatlarni kod bilan sanaysiz · `kod`
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Besh yozuv  ← QTushuncha
- Eyebrow: Tushuncha · sanoq
- Sarlavha: **Bitta shikoyat nechta yozuvda chiqadi?** (38)
- Mentor: Har intervyu — bitta odam bilan suhbat. Yozuvlarni birma-bir oching va doskaga qarang. (2 gap)
- Bashorat (ballsiz, `QBashorat`, yozuv ochilishidan oldin; yorliq «Avval o'zingiz belgilab ko'ring»):
  **Pul haqidagi qattiq gap nechta yozuvda chiqadi?** — Bittasida · Ikki-uchtasida · To'rt-beshtasida (bitta o'lchov, o'sish tartibida, S-015)
- Harakat paneli: besh yozuv-kartasi, har birida «Ochish».
- Vizual: doska — yozuvlar qatori kulrang, shikoyatlar qavati bo'sh.
- **Harakat → Vizual o'zgarish:** «Ochish» → karta matni ochiladi, undagi shikoyatlar doskaga uchadi:
  - doskada shunday qator bo'lsa — o'sha qatorda navbatdagi nuqta bo'yaladi, son o'sadi («2 / 5»);
  - yangi shikoyat bo'lsa — yangi qator paydo bo'ladi;
  - qatorlar son bo'yicha o'zi saralanadi; yozuvlar qatorida ochilgan raqam accent bo'ladi.
- Natija qatori (`QTaxmin`, 5/5 dan keyin): «Taxminingiz: … · haqiqatda: bittasida» yoki «Taxminingiz to'g'ri chiqdi».
- Natija (tugadi): panel yopiladi, doska butun enga — «Maydon band edi» 4 / 5 · «Egasi telefonni ko'tarmadi» 3 / 5 · «Jamoaga odam yetmadi» 2 / 5 · «Pulni bo'lishish qiyin» 1 / 5.
- Xulosa: Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz. (109) — yakundagi «Endi siz bilasiz» 1-band bilan so'zma-so'z
- Tugma (pastki): Yozuvlarni oching (N/5) → Davom etish
- MentorNote: Sinfdan so'rang: «Qaysi yozuvni ochganda doska eng ko'p o'zgardi?» Javob — yangi qator chiqqanda emas, bor qatorga nuqta qo'shilganda.

## 3 · 1-savol  ← QTest (✔ B)
- Eyebrow: Tekshiruv · bitta yozuv
- Savol: **Bir o'yinchi qattiq shikoyat qildi — bu nima degani?** (52)
  - A · Bu maydonning eng katta muammosi ekan (37)
  - B ✔ Bu hozircha faqat shu odamning gapi (35)
  - C · Boshqa o'yinchilar ham shunday o'ylaydi (39)
  - D · Sayt aynan shu shikoyatdan boshlanadi (37)
- To'g'ri izohi: Qattiq gap ham bitta yozuvda chiqsa, bir odamniki bo'lib qoladi. (64)
- Xato izohlari:
  - A: Qattiq aytilgani — ko'p odamda borligi emas. (44)
  - C: Boshqalar nima degani — ularning yozuvlarida. (45)
  - D: Bitta gapdan boshlansa, qolgan to'rt kishi-chi? (47)
  - (umumiy): Doskani eslang: qattiq gap nechta yozuvda chiqdi? (49)
- Yozuvlar, jonli rejim, tugmalar — platforma standarti (`QTest`, DE-203).

## 4 · Ikki shikoyat — bitta muammo  ← QTushuncha
- Eyebrow: Tushuncha · muammo gapi
- Sarlavha: **Ikki shikoyat ortida qanday bitta muammo bor?** (45)
- Mentor: Ikki qatorni bosib, har biri nega bo'lganini o'qing. (52)
- Vizual: 2-ekran natijasidagi doska; ikki tepa qator accent chegarada, qolgan ikkitasi kulrang.
- Harakat paneli: ikki qator-tugma — «Maydon band edi» · «Egasi telefonni ko'tarmadi» (ochilmaguncha «›», ochilgach ✓, U-013).
- **Harakat → Vizual o'zgarish:** qatorni bosish → doskadagi o'sha qator ostida «Nega?» qatori ochiladi (yozuvlardan):
  - «Maydon band edi» → Kelishdan oldin bo'sh vaqtni bilishmagan va uni band qila olishmagan. (69)
  - «Egasi telefonni ko'tarmadi» → Vaqtni bilish va band qilishning yo'li bitta — qo'ng'iroq. U ishlamadi. (71)
- Bashorat (ikkala qator ochilgach; ballsiz `QBashorat`): **Ikki qator bitta muammoga qo'shilsa, u nechta yozuvda bo'ladi?** — 3 tasida · 4 tasida · 7 tasida (o'sish tartibida)
  - **Harakat → Vizual o'zgarish:** tanlov → ikki qator bir-biriga suriladi, «telefon» nuqtalari (1, 2, 4) «band» nuqtalari (1, 2, 3, 4) ustiga tushadi — yangi nuqta qo'shilmaydi;
    qatorlar o'rnida muammo kartasi ochiladi va o'zi yoziladi: «kim» — O'yinchilar · «qachon» — maydonga borishdan oldin · «nimadan qiynaladi» — bo'sh vaqtni bilish va uni band qilishda · «5 yozuvdan 4 tasida».
  - Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 4 tasida» yoki «Taxminingiz to'g'ri chiqdi».
  - Qator (`QIzoh`): Telefon haqida gapirgan uch kishi «band edi» ham degan — ular o'sha to'rt yozuvda. (82)
- Natija (tugadi): panel yopiladi, doska butun enga — tepada muammo kartasi, ostida kulrang ikki qator (2 / 5, 1 / 5).
- Xulosa: Ikki shikoyat bitta asosiy qiyinchilikni ko'rsatdi. Muammo gapi shuni aytadi — unda sayt ham, ilova ham yo'q. (109)
- Tugma (pastki): ① Ikki qatorni oching (N/2) → ② Taxminingizni belgilang → Davom etish

## 5 · 2-savol  ← QTest (✔ D)
- Eyebrow: Tekshiruv · muammo gapi
- Savol: **Oshxona haqidagi qaysi gap muammo gapi?** (39) — ikkinchi olam test bandida (P-002)
  - A · Oshxonaga oldindan buyurtma ilovasi kerak (41)
  - B · Tanaffusda oshxonada odam juda ko'p bo'ladi (43)
  - C · Menga oshxonadagi somsa umuman yoqmaydi (39)
  - D ✔ O'quvchilar tanaffusda ovqat ola olmaydi (40)
- To'g'ri izohi: Gapda kim, qachon va nimadan qiynalgani bor — yechim yo'q. (58)
- Xato izohlari:
  - A: Bu yechim — muammo gapida ilova bo'lmaydi. (42)
  - B: Odam ko'pligi rost, lekin kim nimadan qiynaldi? (47)
  - C: Bu bitta odamga yoqmagani, ko'pchilikning muammosi emas. (59)
  - (umumiy): Muammo kartasini eslang: unda qanday uch bo'lak bor edi? (56)

## 6 · Burbn  ← QVoqea (PM keys)
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Ko'p imkoniyatli ilovadan nima qoldi?** (37)
- Karta yorlig'i: «Burbn · N/6»; 5-kartada sahnada «Instagram» nom-yorlig'i o'z rangida ochiladi (sir-brend — ochilish qadamida), logotip yo'q (PM-028/029).
- Sahna (186): chizilgan telefon ekrani — «Burbn» menyusi, to'rt qator chizilgan belgi bilan: Joyni belgilash · Uchrashuv rejasi · Ball yig'ish · Surat joylash.
  Bashorat kadrlarida keyingi o'zgarish yopiq (`pre`), javob sahnada ochilmaydi.
- **Harakat → Vizual o'zgarish:** «Keyingi» → sahna navbat bilan o'zgaradi: 3-kartada «Surat joylash» qatori ajraladi, qolgan uchtasi xiralashadi; 5-kartada uch qator chiziladi va yo'qoladi,
  qolgan ekranda «Surat · Izoh · Layk», nom-yorliq «Burbn» → «Instagram»; 6-kartada sana yorlig'i «2010 · 6-oktabr» va «3 oyga yetmay · 1 000 000» qatori.
- Kartalar:
  1. **Burbn** — Ikki kishi Burbn degan telefon ilovasini qildi. Unda do'stlar qayerdaligini belgilar, uchrashuv rejasini tuzar, uchrashgani uchun ball yig'ar va surat joylar edi.
  2. Bashorat: **Ishlatganlar ko'pincha nechta imkoniyatdan foydalandi?** — Bittasidan · Ikki-uchtasidan · To'rttalasidan (o'sish tartibida, S-015)
     → `QTaxmin`: «Taxminingiz: … · haqiqatda: bittasidan — surat joylashdan» / «Taxminingiz to'g'ri chiqdi»
  3. **Odamlar nima qildi** — Ikkalasi odamlar ilovada nima qilayotganini kuzatdi. Jamoa odamlar surat joylashga ko'proq tortilayotganini ko'rdi.
  4. Bashorat: **Jamoa to'rt imkoniyatdan nechtasini qoldirdi?** — Bittasini · Ikki-uchtasini · To'rttalasini (o'sish tartibida) → `QTaxmin`
  5. **Qaror** — Jamoa suratdan boshqa hamma narsani olib tashladi: surat, unga izoh va layk qoldi. Ilovaga yangi nom berildi — Instagram.
     Kulrang qator (S-018, brend javob bo'lgani uchun izoh javobdan keyin): Instagram — surat va video joylanadigan ilova.
  6. **2010-yil 6-oktabr** — Instagram chiqdi. Uch oyga yetmay unda bir million odam ro'yxatdan o'tdi.
- Xulosa (6-kartadan keyin): Bu misolda jamoa odamlar ko'p qilgan bitta ishni qoldirdi, qolganini olib tashladi. (83)
- Tugma (pastki): Keyingi (N/6) → Davom etish · bashoratda «Avval o'zingiz belgilang»
- Manba (o'quvchiga ko'rinmaydi):
  - M. G. Siegler, «A Pivotal Pivot», TechCrunch, 2010-11-08 — https://techcrunch.com/?p=241149 (Systrom'ning Quora javobi: Burbn'da «check in to locations, make plans, earn points for hanging out with friends, post pictures»;
    «basically cut everything in the Burbn app except for its photo, comment, and like capabilities. What remained was Instagram»).
  - Wikipedia, «Instagram» (History) — https://en.wikipedia.org/wiki/Instagram (Burbn — Systrom va Krieger'ning check-in ilovasi; «refocused their app on photo-sharing, which had become
    a popular feature among its users»; 2010-10-06 App Store).
  - TechCrunch, 2010-12-21 — Instagram 1 million foydalanuvchiga uch oydan kam vaqtda yetdi (audit manbasi; havola «qur» da tekshiriladi). «Ikki oy» (Wikipedia) o'rniga «uch oyga yetmay» — xavfsizroq.

## 7 · 3-savol  ← QTest (✔ A)
- Eyebrow: Tekshiruv · Burbn qarori
- Savol: **Burbn jamoasi suratni nega qoldirdi?** (36)
  - A ✔ Odamlar ilovada shunga ko'p tortilardi (38)
  - B · Jamoaning o'zi suratni yaxshi ko'rardi (38)
  - C · Suratni qurish eng kam vaqt olgan edi (37)
  - D · Bitta foydalanuvchi shuni so'ragan edi (38)
- To'g'ri izohi: Jamoa odamlar ilovada ko'pincha nima qilganiga qaradi. (54)
- Xato izohlari:
  - B: Voqeani eslang: jamoa kimni kuzatdi? (36)
  - C: Voqeada vaqt haqida gap bo'lmadi — jamoa nimaga qaradi? (55)
  - D: Bitta odam so'ragani — bir kishining gapi. (42)
  - (umumiy): Uchinchi kartani eslang: odamlar ilovada nima qilardi? (54)

## 8 · Sizning muammo gapingiz  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Besh yozuvingiz qaysi muammoni aytyapti?** (37)
- Mentor: Uyga vazifadagi besh yozuvingizni oching; yo'q bo'lsa, sinfdoshingiznikini oling. Avval sanang, so'ng yozing. (2 gap)
- Qadam-tugmalari 1/2/3: Shikoyatlar · Kim · Qachon va nimadan qiynaladi
- Forma (bitta ustun, «Saqlash» o'ngda):
  - ① qator «Shikoyat» (placeholder «Odam aytgan shikoyat…») + «Nechta yozuvda?» — 1 · 2 · 3 · 4 · 5 tugmalari + «Qo'shish»; qatorlar o'quvchining doskasiga tushadi, son bo'yicha saralanadi
    (kamida 2 qator; ko'pi bilan 5).
  - ② «Kim qiynaladi?» (placeholder shu savolning o'zi)
  - ③ «Qachon va nimadan qiynaladi?» + ostida «5 yozuvdan [n] tasida» — n doskadagi eng ko'p sondan olinadi, o'zgartirsa bo'ladi.
  - Yig'ilgan gap (③ dan keyin, muammo kartasi shaklida): «{Kim} {qachon va nimadan qiynaladi}. 5 yozuvdan {n} tasida chiqdi.»
    Tekshiruv-juftlik (PM-020): «O'yinchilar» + «maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi» → «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi. 5 yozuvdan 4 tasida chiqdi.»
- Javob-qatorlari (bloklamaydi, yo'naltiradi, ≤60):
  - ③ da yechim so'zi (sayt, ilova, bot, «kerak»): Bu yechim. Odam nimadan qiynalishini yozing. (44)
  - ② «hamma»: «Hamma» — juda keng. Yozuvlarda kim gapirgan edi? (49)
  - n = 1: Bu bitta yozuvda chiqdi — ko'proq yozuvda chiqqanini oling. (59)
  - qisqa: Qisqa qoldi: to'liq yozing. (27)
- Yordam (yopiq): Yozuvlarni birma-bir o'qing va har shikoyat yoniga chiziqcha qo'ying. Ikki shikoyat bitta asosiy qiyinchilikni ko'rsatsa, ularni bitta qatorga yozing.
- Natija (3/3): forma yopiladi, o'quvchining doskasi fokusga — shikoyat qatorlari sanog'i bilan, tepada o'z muammo kartasi, ✎.
- Xulosa: Muammo gapingiz saqlandi — imkoniyatlar endi shu gapga qarab tanlanadi. (71)
- Tugma (pastki): ① Kamida ikki shikoyat qo'shing → ② Kim qiynalishini yozing → ③ Nimadan qiynalishini yozing → Davom etish
- MentorNote: Yozuvi yo'q o'quvchini yozuvi bor sherigi bilan juftlang — bitta yozuvlar to'plami, ikki muammo gapi. Ikki shikoyatni birlashtirgan o'quvchidan qaysi qiyinchilik ularni birlashtirganini so'rang.

## 9 · Uch quti  ← QTushuncha (mashq)
- Eyebrow: Mashq · MVP chegarasi
- Sarlavha: **Maydonning birinchi versiyasiga nima kiradi?** (44)
- Mentor: «Qilamiz» qutisi — MVP: mahsulotning ish beradigan eng sodda birinchi versiyasi. Ikki savol — bugun birinchi versiyani kichik saqlash uchun; universal qoida emas. (2 gap, audit 4)
- Ikki savol (harakat paneli tepasida, bitta manba `IKKI_SAVOL` — 9, 10-ekran va 4-recap, P-063):
  1 · Busiz muammo hal bo'ladimi? · 2 · Yozuvlarda unga sabab bormi?
- Harakat paneli: joriy imkoniyat kartasi «N / 8» + uch tugma: Qilamiz · Keyin · Qilmaymiz. Vizual: doska — tepada «Maydon» muammo kartasi, pastda uch quti.
- **Harakat → Vizual o'zgarish:** quti tugmasini bosish → karta doskaning tanlangan qutisiga uchadi; noto'g'ri bo'lsa quti bir lahza qizil chegara oladi va karta o'z qutisiga ko'chadi;
  karta ostida sabab-qatori ochiladi; qutidagi «N ta» o'sadi.
- Kartalar (navbat — aralash; kod `IMKONIYATLAR`) va sabab-qatorlari:
  - O'yinchilar chati → Qilmaymiz — Gaplashishdan shikoyat yo'q — jamoa guruhda yozishadi. (54)
  - Kun bo'yicha vaqt kataklari → Qilamiz — Bo'sh vaqtni aynan shu kataklar ko'rsatadi. (43)
  - To'lov → Keyin — Pul haqida bitta yozuv bor, lekin band qilish pulsiz ham ishlaydi. (66)
  - Egasi uchun bandlar ro'yxati → Qilamiz — Egasi bandlarni ko'rmasa, maydonni boshqaga berib yuborishi mumkin. (67)
  - Maydonga baho → Qilmaymiz — Besh yozuvda maydon sifatidan shikoyat yo'q. (44)
  - Jamoa yig'ish → Keyin — Jamoa haqida ikki yozuv bor, lekin bo'sh vaqtni busiz ham bilib, band qilsa bo'ladi. (77)
  - Katakni band qilish → Qilamiz — Bo'sh vaqtni ko'rib band qila olmasa, kelguncha boshqa odam egallaydi. (70)
  - Vaqt bo'shasa — eslatma → Keyin — Muammoga yordam beradi, lekin kataklar busiz ham bo'sh vaqtni ko'rsatadi. (73)
- Javob qatori: to'g'ri — Shu qutida turadi. · noto'g'ri yo'nalish bo'yicha (≤60):
  - «Qilamiz» kerak edi: Busiz muammo hal bo'lmaydi — u MVP'da kerak. (45)
  - «Qilamiz» tanlandi, kerak emas edi: Muammo busiz ham hal bo'ladi — MVP'ga shart emas. (49)
  - «Keyin» kerak edi, «Qilmaymiz» tanlandi: Yozuvlarda bunga sabab bor — o'chirmang, keyinga suring. (56)
  - «Qilmaymiz» kerak edi, «Keyin» tanlandi: Besh yozuvda bunga sabab topilmadi. (35)
- Karta tugmasi (o'ngda): Keyingi imkoniyat → · oxirgisida: Qutilarni ko'rish
- Yordam — birinchi xatodan keyin (P-033): Ikki savolni tartib bilan bering: avval — busiz muammo hal bo'ladimi? «Ha» bo'lsa — yozuvlarda unga sabab bormi?
- Natija (tugadi): panel yopiladi, doska butun enga — Qilamiz 3 · Keyin 3 · Qilmaymiz 2; tepada muammo kartasi.
- Xulosa: Bu misolda MVP'ga uchta imkoniyat kirdi: ularsiz muammo hal bo'lmaydi. (70)
- Qator (xulosadan keyin, `QIzoh`): «Keyin» — «Dekompozitsiya» darsidagi keyinga qoldirilganlar: hech narsa o'chirilmaydi, navbati suriladi. (104)
- Tugma (pastki): Imkoniyatlarni qutilarga qo'ying (N/8) → Davom etish

## 10 · Sizning uch qutingiz  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Hozir nimani qurmaslik kerak?** (30)
- Mentor: Muammo gapingiz tepada turibdi — har imkoniyatni unga solishtiring. (67)
- Tepada (kulrang, 8-ekrandan): o'quvchining muammo kartasi.
- Qadam-tugmalari 1/2/3: Qilamiz · Keyin · Qilmaymiz
- Forma: joriy qutiga imkoniyat yoziladi (har biri «Qo'shish», qutida bir nechta); placeholder:
  «Qaysi imkoniyatsiz muammo hal bo'lmaydi?» · «Qaysi imkoniyat keyin kerak bo'ladi?» · «Yozuvlarda qaysi imkoniyatga sabab yo'q?» · «Saqlash» o'ngda.
  Har qutida kamida bitta.
- Javob-qatorlari (bloklamaydi, ≤60):
  - takror: Bu imkoniyat boshqa qutida bor — bittasini tanlang. (51)
  - bo'sh so'z («yaxshi», «chiroyli», «qulay»): Bu hali imkoniyat emas: mahsulot nima qila olsin? (49)
  - «Qilamiz»da 3 tadan ko'p: «Qilamiz»da uchtadan ko'p: har biriga birinchi savolni qayta bering. (68 — yorliq qatori, xato izohi emas)
  - qisqa: Qisqa qoldi: imkoniyatni to'liq yozing. (39)
- Yordam (yopiq): `IKKI_SAVOL` — Har imkoniyatga ikki savol bering: busiz muammo hal bo'ladimi? «Ha» bo'lsa — yozuvlarda unga sabab bormi?
- Natija (3/3): forma yopiladi, o'quvchining doskasi fokusga — tepada muammo gapi, pastda uch quti o'z imkoniyatlari bilan, har qatorda ✎.
- Xulosa: Uch qutingiz saqlandi: «Qilamiz» — sizning MVP'ingiz. (53)
- Tugma (pastki): ① «Qilamiz»ga imkoniyat yozing → ② Yana N quti qoldi → Davom etish
- MentorNote: «Qilamiz»da beshta-oltita imkoniyat bo'lsa, bittasini oling va so'rang: busiz muammo hal bo'ladimi?

## 11 · Kod yozish  ← QKod
- Eyebrow: Kod yozish · VS Code
- Sarlavha: **Shikoyatlarni sanaydigan kod yozamiz.** (37)
- 1-bosqich (darvoza-savol, ballsiz) — Mentor: Avval bitta savol — so'ng kod yoziladi.
  - Savol: Kod `yozuvlar[4]` ni chiqarsa, terminalda nima ko'rinadi?
  - To'rtinchi yozuvdagi shikoyatlar · ✔ Beshinchi yozuvdagi shikoyatlar · Yozuvlarning umumiy soni
  - Xato bosilsa (silkinadi + qator): Ro'yxatda sanash 0 dan boshlanadi. (34)
- 2-bosqich — Mentor: Doskada qo'lingiz bilan sanagan shikoyatlarni endi kod xuddi shunday sanaydi. (77)
  - Chap: «Kod nima chiqarsin» — 1 To'rt shikoyat, har biri alohida qatorda · 2 Har qator yonida — nechta yozuvda · 3 Sonlar doskadagi bilan bir xil
  - Yordam (yopiq):
    - Eslatma (JavaScript darslaridan): `yozuvlar[j]` — j-indeksdagi yozuv (indeks 0 dan boshlanadi) · `.includes(s)` — ro'yxatda s bormi (5-Modulda ishlatgansiz) ·
      `for` — yozuvlarni birma-bir ko'rib chiqadi (sikl) · `if (...)` — shart rost bo'lsa, qavs ichidagi qator ishlaydi · `son = son + 1` — songa bitta qo'shadi ·
      **terminal** — `node sanoq.js` yozib natijani ko'radigan oyna
    - Uch qadam: 1. Ichkariga ikkinchi sikl: `for (let j = 0; j < yozuvlar.length; j++)` · 2. Ichida shart: `if (yozuvlar[j].includes(s))` · 3. Shart rost bo'lsa: `son = son + 1;`
  - Tugma: Bajardim — to'rt qator chiqdi (o'ngda)
  - O'ng: VS Code oynasi `sanoq.js` (qo'lda yoziladi; sichqoncha ustida: Kod nusxalanmaydi — o'zingiz terib yozasiz), ostida terminal:
    ```js
    // sanoq.js — «Maydon» intervyulari: har shikoyat nechta yozuvda chiqdi

    // Kodda shikoyatlarni bitta so'z bilan yozamiz: band, telefon, jamoa, pul
    const yozuvlar = [
      ["band", "telefon"],
      ["band", "telefon"],
      ["band"],
      ["band", "telefon", "jamoa"],
      ["jamoa", "pul"],
    ];

    const shikoyatlar = ["band", "telefon", "jamoa", "pul"];

    for (let i = 0; i < shikoyatlar.length; i++) {
      const s = shikoyatlar[i];   // s — shu aylanishda sanalayotgan shikoyat
      let son = 0;
      // Shu yerga: yozuvlar'ni ikkinchi sikl bilan aylanib chiqing,
      // yozuvda s bo'lsa, son'ga bitta qo'shing (Yordam ▸)
      console.log(s + " — " + son + " / " + yozuvlar.length);
    }
    ```
  - Terminal paneli «Kutilgan natija» (boshidan xira, 12-q1 A naqshi):
    ```
    $ node sanoq.js
    band — 4 / 5
    telefon — 3 / 5
    jamoa — 2 / 5
    pul — 1 / 5
    ```
- **Harakat → Vizual o'zgarish:** «Bajardim» → terminaldagi kutilgan natija xiradan to'liq rangga o'tadi, to'rt qator ketma-ket bir lahza ajraladi — bu 2-ekrandagi doskaning kod ko'rinishi.
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Tugmalar: Orqaga · Avval kod-savolini yeching → ② Kodni yozing va tugmani bosing → Davom etish

## 12 · 4-savol (yakuniy)  ← QTest (✔ C)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Imkoniyatni «Qilamiz» qutisiga nima kiritadi?** (45)
  - A · Muammoni ko'p o'yinchi aytgani (30)
  - B · Uni jamoaning o'zi yoqtirgani (29)
  - C ✔ Busiz muammo hal bo'lmasligi (28)
  - D · Uni yozuvda kimdir aytgani (26)
- To'g'ri izohi: «Qilamiz»ga faqat busiz muammo hal bo'lmaydigan imkoniyat kiradi. (65)
- Xato izohlari:
  - A: Ko'p aytilgani muammoni tanlaydi, imkoniyatni emas. (51)
  - B: Burbn jamoasi o'z xohishiga emas, odamlarga qaradi. (51)
  - D: Yozuvda bor bo'lsa ham, u «Keyin»da turishi mumkin. (51)
  - (umumiy): Qutilarga ajratishdagi birinchi savolni eslang. (47)

## 13 · O'zingiz o'ylab ko'ring  ← QMustaqil (2 qadam)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Siz aslida qaysi muammoni hal qilyapsiz?** (40)
- Mentor: Ekranga qaramasdan ayting: kim, qachon, nimadan qiynaladi va bu nechta yozuvda chiqdi? (86)
- 1-qadam: (mustaqil rejimda) Ovoz chiqarib o'zingizga ayting / (jonli darsda) Sherigingizga ayting — taymer 30 s / 1 daqiqa, platforma standarti.
- 2-qadam: Endi shu gapni bir qatorda yozing · placeholder «… … qiynaladi. 5 yozuvdan … tasida chiqdi.»
- Xulosa (yozgach): Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi. (89) — «Bugungi asosiy fikr» bilan so'zma-so'z
- Tugmalar: Orqaga · Davom etish

## 14 · Natijalar  ← QNatija — platforma standarti (bitta karta, U-048; jonli reyting / podium)

## 15 · Takrorlash  ← QKartochka (11 karta)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon | Orqa |
|---|---|
| Shikoyat qachon kuchli belgi bo'ladi? | Ko'p yozuvda chiqqanda — keyin uning og'irligi ham qaraladi |
| Bitta yozuvdagi qattiq gap kimniki? | Bir odamniki |
| «Maydon»da qaysi shikoyat eng ko'p chiqdi? | «Maydon band edi» — 5 yozuvdan 4 tasida |
| «Maydon» muammo gapi qanday? | O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi |
| Muammo gapida qanday uch bo'lak bor? | Kim · qachon · nimadan qiynaladi |
| Muammo gapida nima bo'lmaydi? | Yechim — sayt ham, ilova ham |
| MVP nima? | Mahsulotning ish beradigan eng sodda birinchi versiyasi |
| «Qilamiz» qutisiga qanday imkoniyat kiradi? | Busiz muammo hal bo'lmaydigani |
| «Keyin» bilan «Qilmaymiz» farqi nima? | «Keyin»ga yozuvlarda sabab bor, «Qilmaymiz»ga yo'q |
| Burbn'dan nima qoldi? | Surat, izoh va layk — ilova Instagram bo'ldi (2010) |
| `yozuvlar[j].includes(s)` nima qiladi? | j-indeksdagi yozuvda s bor-yo'qligini tekshiradi |

- Tugmalar, oxirgi holat — platforma standarti (`QKartochka`, 174).

## 16 · Yakun  ← QYakun (PM: HwCard)
- Eyebrow: Dars yakuni
- Belgi: ✓ Dars tugadi (yonida: N/4 to'g'ri)
- Sarlavha: **Muammo gapingiz va MVP chegarangiz tayyor.** (43)
- Bugungi asosiy fikr — Ko'p yozuvda chiqqan shikoyat — kuchli belgi; birinchi versiya shu bitta muammoni hal qiladi.
- CODE STRIKE + arena — platforma standarti (192).
- Endi siz bilasiz:
  - Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.
  - Muammo gapi kim, qachon va nimadan qiynalishini aytadi — unda yechim yo'q.
  - MVP — mahsulotning ish beradigan eng sodda birinchi versiyasi; «Qilamiz»ga busiz muammo hal bo'lmaydigan imkoniyat kiradi.
  - Burbn jamoasi odamlar ko'p qilgan bitta ishni qoldirdi — ilova Instagram bo'ldi.
- Nishonlaringiz — n/4
- Uyga vazifa (`HwCard` yakun ekranida — alohida `.homework.jsx` yo'q, GATE M M-q9; PM-025):
  - Kim uchun: o'z g'oyangiz · Nechta: 1 muammo gapi va uch quti · Muddat: keyingi darsgacha
  - ① O'z besh yozuvingizni qayta o'qing va har shikoyat nechta yozuvda chiqqanini sanang.
  - ② Eng ko'p chiqqanini bitta muammo gapiga yozing: kim, qachon, nimadan qiynaladi.
  - ③ Imkoniyatlarni uch qutiga ajrating — «Qilamiz»da faqat busiz muammo hal bo'lmaydiganlari qolsin.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Mini-MVP arxitekturasi». «Maydon»ning «Qilamiz» qutisidagi uch imkoniyat uchun sayt, Backend va Database'ni bitta chizmaga chizasiz.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Fon so'zlari (uz; kod bosqichida {uz, ru}, R-008):
  - Arena (`QZ_BG_SHAPES`): yozuv · shikoyat · muammo · sanoq · MVP · qilamiz · keyin · qilmaymiz · intervyu (+ o'yin qatlami shakllari)
  - Uyga vazifa banneri (`HW_TOKENS`): yozuv · muammo · MVP · quti · sanoq

---

## Nishonlar (4; nomlar inglizcha, PM an'anasi)
- **Pattern Spotter!** (2-ekran) — Besh yozuvni ochib, shikoyatlarni sanadingiz
- **Problem Writer!** (8-ekran) — O'z muammo gapingizni yozdingiz
- **Scope Keeper!** (9-ekran) — Sakkizta imkoniyatni uch qutiga ajratdingiz
- **Code Counter!** (11-ekran) — Shikoyatlarni kod bilan sanadingiz
- Yozuvlar — platforma standarti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; PM darsida belgi o'rniga raqam 1/2/3 — S-026)
Yorliq: Qayta tushuntirish · tugmalar — platforma standarti.

1. (3-ekran) **Bitta yozuv — bir odamning gapi**
   1. Qattiq gap — Pul haqidagi gap eng qattiq aytilgan edi, lekin u faqat **bitta yozuvda** chiqdi.
   2. Sanoq — Har shikoyat nechta yozuvda chiqqanini sanaymiz: «Maydon band edi» — **5 yozuvdan 4 tasida**.
   3. Muammo — Bitta yozuvdagi gap bir odamniki. Ko'p yozuvda chiqqani — kuchli belgi; keyin uning og'irligini ham qaraymiz.
   - Sinfga savol: Yozuvlaringizda qaysi shikoyat eng ko'p chiqdi?
2. (5-ekran) **Muammo gapi qiyinchilikni aytadi**
   1. Ikki shikoyat, bitta qiyinchilik — «Band edi» va «telefonni ko'tarmadi» bitta asosiy qiyinchilikni ko'rsatdi: bo'sh vaqtni oldindan bilib, band qilib bo'lmaydi.
   2. Uch bo'lak — **kim**, **qachon**, **nimadan qiynaladi**: «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.»
   3. Yechim yo'q — Muammo gapida sayt ham, ilova ham yo'q: yechim qutilarda tanlanadi.
   - Sinfga savol: Muammo gapingizga yechim kirib qolmadimi?
3. (7-ekran) **Burbn odamlar ko'p qilgan ishni qoldirdi**
   1. To'rt imkoniyat — Burbn'da joy belgilash, uchrashuv rejasi, ball va surat joylash bor edi.
   2. Odamlar nima qildi — Jamoa kuzatdi: odamlar **surat joylashga** ko'proq tortilardi.
   3. Qaror — Suratdan boshqasi olib tashlandi — ilova **Instagram** bo'ldi (2010).
   - Sinfga savol: Yozuvlaringizda odamlar ko'pincha nima qilgani aytilgan?
4. (12-ekran) **«Qilamiz»ga busiz muammo hal bo'lmaydigani kiradi**
   1. Birinchi savol — Busiz muammo hal bo'ladimi? «Yo'q» — **Qilamiz**.
   2. Ikkinchi savol — «Ha» bo'lsa: yozuvlarda unga sabab bormi? Bor — **Keyin**, yo'q — **Qilmaymiz**.
   3. «Maydon»da — «Qilamiz»da uchta: vaqt kataklari · band qilish · egasi uchun bandlar ro'yxati.
   - Sinfga savol: «Qilamiz» qutingizdagi qaysi imkoniyat birinchi savoldan o'tmaydi?

## Jonli viktorina (12 savol, ✔; to'g'ri javob o'rni: A 1·6·12 · B 3·5·10 · C 2·8·11 · D 4·7·9)
1. Oshxona haqida besh intervyu qildingiz, deylik. Qaysi shikoyatdan boshlaysiz?
   - ✔ To'rt yozuvda chiqqanidan
   - Eng qattiq aytilganidan
   - O'zingizga qiziq bo'lganidan
   - Oxirgi yozuvdagisidan
2. Qaysi gap muammo gapi bo'la oladi?
   - Maydonni band qiladigan sayt kerak
   - Shanba kuni futbol o'ynash juda yoqadi
   - ✔ O'yinchilar bo'sh vaqtni bila olmaydi
   - Mahallada futbol o'ynaydiganlar ko'p
3. Bitta o'yinchi «chat kerak» dedi. Bu nimani bildiradi?
   - Chat — MVP'ning eng muhim qismi
   - ✔ Hozircha bu bir odamning gapi
   - Hamma o'yinchiga chat kerak ekan
   - Chatni bugunoq qurish kerak
4. MVP nima?
   - Mahsulotning eng chiroyli to'liq versiyasi
   - Barcha imkoniyati bor oxirgi versiyasi
   - Faqat rasmi chizilgan birinchi versiyasi
   - ✔ Ish beradigan eng sodda birinchi versiya
5. «Keyin» qutisidagi imkoniyat bilan nima bo'ladi?
   - Butunlay o'chirib tashlanadi
   - ✔ Saqlanadi, navbati suriladi
   - Bugunoq MVP'ga qo'shiladi
   - Boshqa mahsulotga beriladi
6. «Jamoa yig'ish» nega «Keyin» qutisida?
   - ✔ Yozuvda bor, lekin MVP busiz ishlaydi
   - Uni hech bir yozuvda hech kim aytmagan
   - Busiz MVP bo'sh vaqtni ko'rsatmaydi (F-1005-93 A)  ✎ oldin «Busiz bo'sh vaqtni bilib bo'lmaydi»; kodda: «Busiz MVP bo'sh vaqtni ko'rsatmaydi» — lint-tell (`gates`): «MVP» faqat ✔ variantda edi; MD ga taklif
   - Uni besh yozuvning hammasida aytishgan
7. «Maydonga baho» nega «Qilmaymiz» qutisida?
   - Uni qurish juda qiyin bo'lgani uchun
   - Jamoaning o'ziga u yoqmagani uchun
   - Uni ko'p o'yinchi so'ragani uchun
   - ✔ Yozuvlarda unga sabab yo'qligi uchun
8. «Egasi uchun bandlar ro'yxati»siz nima bo'ladi?
   - Hech narsa — bu ro'yxat o'yinchilarga kerak emas
   - O'yinchilar sayt kataklarini umuman ko'ra olmaydi
   - ✔ Egasi maydonni boshqaga berib yuborishi mumkin
   - Sayt ochilmaydi va hech kim band qila olmaydi
9. Burbn jamoasi qaysi imkoniyatni qoldirdi?
   - Joyni belgilashni
   - Uchrashuv rejasini
   - Ball yig'ishni
   - ✔ Surat joylashni
10. Burbn jamoasi qarorni nimaga qarab qildi?
    - Jamoaning o'z xohishiga qarab
    - ✔ Odamlar nima qilganiga qarab
    - Eng oson imkoniyatga qarab
    - Bitta odamning gapiga qarab
11. Kodda `yozuvlar[j].includes("band")` nimani tekshiradi?
    - Yozuvlar soni nechtaligini
    - Birinchi yozuv nimaligini
    - ✔ j-yozuvda «band» bormi
    - «band» so'zi uzunligini
12. Ikki shikoyat bitta qiyinchilikni ko'rsatsa, nima qilasiz?
    - ✔ Ikkalasini bitta muammo gapiga yozaman
    - Ulardan birini o'chirib, bittasini qoldiraman
    - Har biri uchun alohida sayt qilaman
    - Ikkalasini ham «Keyin» qutisiga qo'yaman

Arena yozuvlari — umumiy shablon (platforma standarti, o'zgarmaydi).

---

## KOD (qolipda yo'q yoki «qur» bosqichida yoziladigan joylar)

1. **`SanoqDoska`** — bitta komponent (163/180): `YOZUVLAR` (5 ta: matn + shikoyat kalitlari), `SHIKOYATLAR` (4 ta: kalit, matn, «Nega?» qatori), `MUAMMO_GAP` (kim, nima),
   `IMKONIYATLAR` (8 ta: nom, quti, sabab), `IKKI_SAVOL` dan; uch qavat (yozuvlar · shikoyatlar + muammo kartasi · uch quti); holatlar kulrang · accent · yashil ✓ · qizil chiziq;
   nuqtalar ustma-ust tushishi (4-ekran birlashish); `// qolip-maket:` e'loni; `zoom` (⛶, q17); `prefers-reduced-motion`.
2. **s0** `QKirish` (DE-201): maket — besh yozuv-kartasi; tanlovdan keyin «? / 5» belgisi; javob bitta, `correct: false` hammaga (J-026).
3. **s1** `QReja`: chap — doskaning bo'sh shakli (skelet-chiziqlar), o'ng — 4 qadam «01 · matn · teg».
4. **s2** `QTushuncha`: besh «Ochish»; `QBashorat` + `QTaxmin`; qatorlar saralanishi; `tugadi` (q18); nishon `patternSpotter`.
5. **s4** `QTushuncha`: ikki qator-tugma (toggle, U-013); «Nega?» qatorlari; ikkinchi `QBashorat` (3 · 4 · 7) + `QTaxmin` + `QIzoh`; birlashish animatsiyasi; muammo kartasi o'zi yoziladi; `tugadi`.
6. **s6** `QVoqea`: telefon maketi (chizilgan belgilar, emoji emas); yorliq «Burbn · N/6», 5-kartada «Instagram» nom-yorlig'i; 2 bashorat ballsiz (`ans` — 0, 0) + `QTaxmin`; manba — fayl izohida.
7. **s8** `QMustaqil`: shikoyat qatori + 1–5 tugmalari + «Qo'shish»; ② ③ yozuv qatorlari; yig'ilgan gap; javob-qatorlari detektorlari (yechim so'zlari: sayt, ilova, bot, kerak · «hamma» · n = 1 · qisqa);
   `OUT_KEY` `pm-m7d3-muammo` = `{ shikoyatlar: [{ t, n }], kim, nima, n }`; nishon `problemWriter`. Yozuvlar soni 5 sukutda (TAYANCHGA SAVOL 3).
8. **s9** `QTushuncha` (mashq): 8 karta, 3 tugma, sabab-qatorlari, 4 yo'nalishli javob qatori, Yordam birinchi xatodan keyin; `tugadi`; nishon `scopeKeeper` (birinchi urinish).
9. **s10** `QMustaqil`: uch quti, ko'p qatorli; javob-qatorlari; `OUT_KEY` `pm-m7d3-mvp` = `{ qilamiz: [], keyin: [], qilmaymiz: [] }`.
10. **s11** `QKod`: darvoza-savol (`GATE_OPTS`, ✔ 1); `sanoq.js` (`KD_CODE`, uz + ru izohlar); terminal «Kutilgan natija» boshidan xira; nishon `codeCounter`.
11. **Testlar s3/s5/s7/s12** → `QTest` (DE-203, q20): `INLINE_KEYS { s3: 1, s5: 3, s7: 0, s12: 2 }`, `explainCorrect`, `explainWrong` (variant bo'yicha + umumiy).
12. **s13** `QMustaqil` 2 qadam: taymer (30 s / 1 daqiqa), bir qatorlik yozish joyi.
13. **s15** `QKartochka` (DE-204, 11 karta). **s16** `QYakun`: sarlavha, asosiy fikr, 4 band, HwCard (3 qadam), «Keyingi dars».
14. **RECAPS** (3, 5, 7, 12) — raqam 1/2/3 (S-026), `Q_LABELS` / `SCORED_IDX` bilan mos (S-025).
15. **Arena** `QUIZ_BANK` 12 savol, kalitlar 0,2,1,3 · 1,0,3,2 · 3,1,2,0; `QZ_BG_SHAPES`, `HW_TOKENS` ({uz, ru}, R-008).
16. `ACHIEVEMENTS` (4), `LESSON_META` `{ lessonId: 'pm-m7d3-v1', lessonTitle: 'Besh suhbatdan qaysi muammo chiqdi?' }`, `SCREEN_INTENTS` — 17 ekran.
17. **Artefakt-strip** (U-042): «Doskam» — 8-ekrandan; 8, 10, 11, 13-ekran, recap va uyga vazifada ko'rinadi; test, arena, podiumda yo'q.
18. **App.jsx** `m7-03` qatoriga `comp: PmInterviewMvpLesson` («qur» bosqichida, asosiy seans); `sub` — TAYANCHGA SAVOL 7.

✎ Qurish (05.10.2026, quruvchi) — kodda MD dan chetlashishlar (o'quvchi matni o'zgarmagan; taklif sifatida):
- 2-ekran: bashorat tanlanmaguncha pastki tugma — «Avval o'zingiz belgilang» (6-ekran yozuvi); yozuvlar bittadan ochiladi (oxirgi ochilgani to'liq + keyingisi «Ochish», SABOQ 9).
- 4-ekran: qator-tugma faqat ochiladi (yopilmaydi); «Nega?» qatorlari birlashish paytida yashiriladi.
- 6-ekran: bashorat kartalarida (2, 4) Mentor va sahna oldingi kartadagidek (pre); 4-karta natijasi «haqiqatda: bittasini».
- 8, 10-ekran: javob-qatori ostida pilot qatori «Shunday qoldirsangiz — yana «Saqlash»ni bosing.» (10-ekranda «Qo'shish»ni); ✎ → «Tahrirlash» tugmasi (10-ekranda butun qutilar uchun bitta).
- 11-ekran: VS Code oynasi uzun izoh qatorlarini gorizontal suradi; «Bajardim»dan keyin tugma «✓ Bajardim — to'rt qator chiqdi».
- 16-ekran: «Bugungi asosiy fikr» yashil kartada CODE STRIKE ustida (QYakun da alohida joy yo'q).
- Artefakt-strip «Doskam» (KOD 17): faqat uyga vazifa kartasida; 8, 10, 13-ekranda o'quvchining kartasi o'zi; 11-ekranda yo'q (kod «Maydon» yozuvlari bilan).

REPO: yo'q (PM darsi, teg yo'q).
Darvozalar (kod bosqichida): `npm run gates -- src/7-Modull/PmInterviewMvpLesson.jsx` · `lint:olchov` 0 · `lint:emoji` qolip-rejim 0 · `lint-qolip` q13–q21 · `lint:jsx` · surat 1280 + 393 (0, 2, 4, 6, 9, 11, 16).

---

## TAYANCHGA SAVOL

1. **Besh yozuvning taqsimoti** (kim nimani aytgan): 1 — band + telefon · 2 — band + telefon · 3 — band · 4 — band + telefon + jamoa · 5 — jamoa + pul.
   Nega: tayanch faqat jami sonlarni beradi (4 · 3 · 2 · 1); 4-ekrandagi birlashish va 11-ekrandagi kod aniq taqsimotni talab qiladi. Shu taqsimotda «band» va «telefon» birga = 4/5 —
   tayanchdagi tanlangan muammo bilan mos. 2-dars MD si Mentor misolida yozuv namunasini bersa — matnlar solishtiriladi.
2. ~~Beshalasi o'yinchimi~~ — **yopildi** (GATE M K4, audit): besh yozuv — besh o'yinchi; maydon egasi suhbati 2-darsda savol namunasi. Tarix: Nega: tayanch gaplari o'yinchi tilida («kelganimizda», «egasi … ko'tarmadi»). 2-dars egasi bilan ham intervyu qilsa — 6-yozuv kerakmi?
3. **Yozuv shabloni bo'limlari va joyi (2-dars).** Men yozuv kartasini «N-yozuv · o'yinchi» + odam aytgan gaplar (u aytganidek) deb oldim. 2-dars shabloni boshqa bo'lsa (masalan «Qachon? · Nima bo'ldi? · Nima qildi?») —
   kartalar shunga keltiriladi. Besh real yozuv qayerda turadi (qog'oz, telefon, 2-dars `OUT_KEY`)? 8-ekran hozir qo'lda kiritishni oladi.
4. **«Eslatma» = «Vaqt bo'shasa — eslatma»** (bo'sh vaqt chiqsa xabar). Nega: qutilar qoidasida «Keyin» = yozuvlarda sabab bor; «o'yindan oldin eslatma» bo'lsa, yozuvlarda sababi yo'q va u «Qilmaymiz»ga tushardi.
   Boshqa darslarda eslatma boshqa ma'noda kelsa — kelishish kerak.
5. **«Chat» = «O'yinchilar chati»**, «Qilmaymiz» sababi — 5-yozuvdagi «guruhda yozdik» (jamoa guruhda gaplashadi). **«Baho» = «Maydonga baho»**, sababi — yozuvlarda maydon sifatidan shikoyat yo'q.
6. **Qutilar qoidasi — ikki savol** («Busiz muammo hal bo'ladimi?» · «Yozuvlarda unga sabab bormi?»). 7, 9, 11-darslar «Qilamiz» qutisini tilga olsa — shu so'zlar bilan.
7. **App.jsx `sub` «takrorlar, …»** — darsda «takror» so'zi yo'q (kartochkalar «Takrorlash» va «Qisqa takrorlash» bilan to'qnashadi, T-015) va reja «sub» bilan so'zma-so'z mos bo'lishi kerak (P-015).
   Taklif: `sub` → «sanoq, bitta muammo, qilamiz / keyin / qilmaymiz» (App.jsx — asosiy seans).
8. **«shikoyat» atamasi** tayanch jadvalida yo'q; men qo'shdim: shikoyat — yozuvda odam aytgani, muammo — ko'p yozuvdagi shikoyatlar ortidagi qiyinchilik. 10 va 12-darslar bilan bir xil bo'lsin.
9. **Muammo gapi shakli:** «{Kim} {qachon va nimadan qiynaladi}. 5 yozuvdan {n} tasida chiqdi.» Maydon: «O'yinchilar maydonga borishdan oldin bo'sh vaqtni bilish va uni band qilishda qiynaladi.» —
   GATE M 03-q0 (tayanch 1-bo'limda ham shu gap). 12-dars pitchidagi muammo gapi shu bilan so'zma-so'z bo'lsin.
10. **Keys — Burbn → Instagram (2010).** Modulning boshqa darsi ham Instagram'ni olsa — takrorlanmasin. (3-Modul m3-05 da Instagram Stories voqeasi bor — boshqa voqea.)
11. **`OUT_KEY`'lar** `pm-m7d3-muammo`, `pm-m7d3-mvp` — 7 va 12-darslar o'qishi mumkin; nomlar asosiy seans bilan kelishiladi.

---

## GATE M — o'z tekshiruvim

- [x] Oldingi/keyingi dars va menyu nomi — App.jsx 7-blok bilan mos (m7-02 «Besh odamdan nimani bilib olasiz?» → m7-03 → m7-04 «Mini-MVP arxitekturasi»; yakunda «Keyingi dars — «Mini-MVP arxitekturasi»») (205)
- [x] Bitta misol-ip («Maydon»; oshxona — faqat 5-ekran testi va arena 1, P-002) · metafora yo'q · bitta vizual dars bo'yi — doska (0, 1, 2, 4, 8, 9, 10, 11, 13); 6-ekran — keys sahnasi
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 9 (+ 0 hook, 6 voqea, 11 kod) — matn-karta yo'q
- [x] Sarlavha ≤55 (36–52; test savollari 36–52) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (53–100) · hook javobi 119 · xato izohi ≤60 (34–57).
      Istisno: 9-ekran `QIzoh` qatori 104 (xulosa emas, ≤110) va 10-ekran «Qilamiz»da uchtadan ko'p» qatori 68 (yorliq, xato izohi emas)
- [x] Atamalar oldingi darslar bilan bir xil (grep: MVP — m2-07 so'zma-so'z; «imkoniyat» — m2-07 va LUG'AT; «nechta yozuvda» — m5-09/m3-05 naqshi; `includes` — 5-Modul) · siz-forma ·
      quti nomlari tayanch va App.jsx dagidek · «takror», «funksiya» va tayanchning «ishlatilmaydi» so'zlari yo'q
- [x] Testlar: 4 variant, uzunlik farqi ≤5, ✔ eng uzun emas (s3 35 / s5 40 vs 43 / s7 38 teng / s12 28 vs 30) · kalit ildiz faqat to'g'rida emas («muammo» s12 da A va C da; «olmaydi» shakli s5 da — C «yoqmaydi» bilan) ·
      ✔ o'rni yangi dars uchun shu yerda belgilandi (B · D · A · C)
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — 12-ekran testi). Uch quti mashqi (9) Mentor/yorliq orqali tartibni ochmaydi: ikki savol — vosita, javob — mexanikada
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («har doim», «100%», «darrov» — yo'q; 5-yozuvdagi «har safar» — olam ichidagi gap, T-008)
- [x] Ichki kodlar o'quvchi matnida yo'q («s4», «Modul 9» yo'q; «2-ekrandagi doska» faqat MD izohida) · Burbn/Instagram — manba bilan (TechCrunch 2010-11-08, Wikipedia) · «KOD» ro'yxati 18 band
- [x] Karta T · P · S · PM ko'rildi: T-008/011/014/015/016/024/029/039/042/043/047/048/049/052/064/070 · P-001/002/008/010/013/014/015/016/025/033/036/046/048/052/053/062/063/064/067 ·
      S-001/002/004/006/008/010/015/018/019/025/026 · PM-005/017/020/025/027/030 (PM-107).
      Ochiq: T-039 — 0-ekran Mentori uyga vazifani qilgan deb oladi (qaror 7), qilmaganlar uchun 8-ekranda sinfdosh yo'li.
