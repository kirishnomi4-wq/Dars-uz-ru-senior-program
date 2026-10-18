# 9-Modul · 12-dars (PM) «Pitchingizda kimning hikoyasi bor?» — MD v3

Fayl: `src/7-Modull/PmUserStoryPitchLesson.jsx` (yangi) · kalit `m7-12` · 16 ekran · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi.
Dars yangi — hamma ekran noldan, to'liq yozilgan. Testlarda to'g'ri javob o'rni: s3 = 2-variant (`correctIdx 1`), s5 = 3 (`2`), s7 = 1 (`0`), s11 = 4 (`3`) — `INLINE_KEYS` shu bilan.
Menyu (App.jsx, DE-205): m7-11 «Loyiha kuni: sinovdan keyingi tuzatish» → **m7-12 «Pitchingizda kimning hikoyasi bor?»** (osti: «muammo, yechim va real foydalanuvchi») → m7-13 «Zaxira dars».
Tur (PM-005): 2-tur sof PM — artefakt yozma matn (uch slaydli pitch), mustaqil ish majburiy. Modulning oxirgi darsi.

---

Tashqi audit (ChatGPT) Filtri: `12-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (dastur):** muammo → yechim → foydalanuvchi pitchi, unda real odamning hikoyasi; sinfdosh oldida repetitsiya. Real foydalanuvchini pitchga taklif qilish — uyga vazifa (qaror 7).
2. **Bugungi asosiy fikr (P-013):** Pitchda raqam yonida bitta real odamning hikoyasi turadi. (12-ekran xulosasi va yakun — so'zma-so'z shu.)
3. **O'tilgan atamalar (8-Modul 14-dars YAKUNIY dan aynan):** slayd (taqdimotning bitta sahifasi) · raqam, u nimani sanadi, u nimani ko'rsatadi · mehnat raqami · «Sahna ekrani» ·
   «Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz» (bugungi juftligi: «Hikoyani o'ylab topmaysiz — yozuvingizdan olasiz»).
   Pitch (2-Moduldan: qisqa taqdimot) · intervyu · yozuv (intervyu yozuvi, kuzatuv yozuvi) · sinov · fikr va va'da (5-Modul 8-dars: «Ikkalasi ham fikr», «javobi va'da, qilingan ish emas») ·
   bo'lib o'tgan ish (m7-02 osti) · talab · agent · investor.
4. **Yangi atamalar — misoldan KEYIN, bir marta (PM-107):**
   - **hikoya** — bitta real odam bilan bo'lib o'tgan ish. (2-ekranda yorliq bo'lib tug'iladi, 4-ekran xulosasida ta'rif; ta'rif dars bo'yi so'zma-so'z shu, T-042.)
     Bu darsda «hikoya» faqat shu ma'noda (T-015). «User Story» atamasi (3-Modul: bir gaplik formula) o'quvchi matnida ishlatilmaydi — fayl nomida qoladi.
   - **repetitsiya** — sahnadan oldin pitchni ovoz chiqarib aytib ko'rish (12-ekran Mentori; reja tegida kulrang yorliq, P-015).
   - Juftlik (§146 — ikkala yarmi ham nomlanadi): **bo'lib o'tgan ish** ↔ **fikr yoki va'da** (4-ekranda saralashdan keyin).
5. **Raqam va hikoya vazifasi (dars bo'yi bitta gap, 2-ekran xulosasi):** Raqam — 5 suhbatda bu holat necha kishida chiqqani, hikoya — bitta odamda qanday bo'lgani.
6. **Uch slayd nomi (dastur):** Muammo · Yechim · Foydalanuvchi. Muammo slaydida — intervyudagi odamning hikoyasi (sayt hali yo'q edi); Foydalanuvchi slaydida — saytni sinovda ishlatgan odamning hikoyasi va tuzatilgan narsa.
7. **Odam ismsiz (tayanch):** hikoyada odamning ismi emas, kimligi aytiladi (o'yinchi, maydon egasi). Hikoyani aytishga ruxsat — uyga vazifada.
8. **So'zlar (bir ma'no — bir so'z):** sayt (frontend emas) · band qilish · vaqt katagi · o'yinchi · maydon egasi (mijoz, admin emas) · zal (pitchni tinglaydiganlar) · slayd (varaq emas — bu darsda Canva'da ham «slayd»).
9. **Toza yuza (185-qonun):** tugma, variant, karta, yorliq, recap'da emoji yo'q. O'yin qatlami (arena, nishon medali, podium) — mustasno.

## Darsning ipi va bitta vizual

- **Modul ipi — «Maydon»** (tayanch, o'zgarishsiz): muammo «Maydonga kelasiz — band; bo'sh vaqtni bilish uchun egasiga qo'ng'iroq qilish kerak» → 5 intervyu
  (4/5 «oxirgi marta kelganimizda maydon band edi», 3/5 «egasi telefonni ko'tarmadi», 2/5 «jamoaga odam yetmadi», 1/5 «pulni bo'lishish qiyin») → MVP (kun bo'yicha vaqt kataklari, band qilish) →
  sinov vazifasi «Shanba kuni soat 18:00 ga maydon band qiling» → kuzatuv: o'yinchi «Band qilish» tugmasini topa olmadi (forma ostida, ko'rinmaydi) → 11-darsda tuzatildi → **bugun pitch**.
- **Dars ipi:** hook'da ikki slayd (raqamli / odamning gapi) → 2-ekranda ular bitta slaydga birlashadi → 4-ekranda qaysi gap yozuvda borligi ajratiladi → 6-ekran Canva: muammo real odamlardan,
  pitchda ko'rinadigan qilingan → 8-ekranda «Maydon» pitchi uch slaydga yig'iladi → 9-ekranda o'quvchi o'z pitchini yozadi → 12-ekranda sinfdosh oldida aytadi → uyda real foydalanuvchiga.
- **Mentor misolidagi ikki hikoya (bitta manba `MAYDON`, 180-qonun):**
  - intervyu hikoyasi (o'yinchi gapi, 3-darsdagi **1-yozuv** so'zma-so'z — audit 2: agregat sonlardan hikoya yasalmaydi): «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.»
  - sinov hikoyasi: Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi. · tuzatish va qayta sinov (11-dars `SINOV.md`): Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi birinchi urinishda band qildi. (TAYANCHGA SAVOL 2)
- **Bitta vizual — Sahna (`PitchSahna`, dars bo'yi):** 8-Modul 14-dars «Sahna ekrani» slaydining davomi. Tepada 1–3 ta oq slayd-karta tasma bo'lib turadi
  (1 **Muammo** · 2 **Yechim** · 3 **Foydalanuvchi**; har birida bo'sh qatorlar), ostida **zal**: to'rtta chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas) va ular ustida bitta **savol pufagi**.
  - Qator holatlari: bo'sh (kulrang uzuq chiziq) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) → xato (`err` fon) → slayd to'liq (chap chetda yashil chiziq).
  - Zal: slayd to'lmaguncha pufakda savol («Bu qanday bo'lgan?», «Bu nechta odamda bo'lgan?», «Sayt nima qiladi?», «Kimdir ishlatib ko'rdimi?»); to'liq bo'lsa pufak o'rnida yashil ✓.
  - Ishlatiladi: 0 (ikki slayd) · 1 (uch slayd skeleti) · 2 (bitta slayd) · 8 · 9 · 12 (uch slayd). Canva (6) — o'z keys-maketi `CanvaMock` (PM-029). 4-ekranda yozuv kartalari (saralash maketi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · «Maydon» pitchi
- Sarlavha: **4 / 5 raqami ortida nima bor?** (28)
- Mentor: Sahnada «Maydon» pitchi — loyihaning qisqa taqdimoti. Ikkala slayd ham intervyu yozuvlaridan olingan, ikkalasi ham rost.
- Maket (chap): Sahna — ikki slayd yonma-yon (yorliq «Sahna ekrani»):
  - 1-slayd: katta `4 / 5`, ostida: 5 suhbatdan «maydon band edi» deganlar
  - 2-slayd: «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.»
  - ostida zal — jim.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Beshta suhbatdan to'rttasida shu holat chiqqani (47)
  - To'rt odamning har biri boshidan kechirgan kun (46)
- Javob (ikkalasiga bir xil, maqtovsiz — J-026): Ikkalasi ham rost. Raqam suhbatlarda necha kishida chiqqanini aytadi, hikoya — o'sha kunlardan birini. (102)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan slayd bir lahza ko'tariladi, zaldagi to'rt bosh unga buriladi; keyin ikki slayd orasida «+» belgisi paydo bo'ladi
  (ikkinchi slayd xiralashmaydi — ikkala tanlov teng, P-016). Jonli darsda ovozlar chizig'i — har variant va ovozlar soni.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun loyihangiz pitchini yozib, aytib ko'rasiz.** (48)
- Mentor: Intervyu va kuzatuv yozuvlaringizni yoningizga oling — bugun ular kerak bo'ladi.
- Chap: «Dars oxirida — pitch: muammo, yechim va real foydalanuvchi» + Sahna: uch slayd skeleti (nomlari Muammo · Yechim · Foydalanuvchi),
  kulrang chiziqlar 0.9 s oraliqda birma-bir to'q chiziqqa aylanadi (matnsiz — keyingi ekranlar javobini ochmaydi, P-015), oxirida zal ustida ✓.
- O'ng (01 · matn · teg; bosilmaydi):
  - 01 · Raqam yonida yana nima turishini ko'rasiz · `raqam`
  - 02 · Pitchga qaysi gap chiqishini ajratasiz · `yozuv`
  - 03 · Mashhur sayt muammoni qanday ko'rsatganini bilib olasiz · `biznes`
  - 04 · Loyihangiz pitchini yozib, sinfdoshga aytasiz · `repetitsiya`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Raqam va hikoya  ← QTushuncha (markaziy)
- Eyebrow: Tushuncha · raqam yonida
- Sarlavha: **Raqamdan keyin zal yana nimani so'raydi?** (40)
- Mentor: Raqam slaydini o'tgan modulda yozgansiz — endi unga yozuvdan bo'laklar qo'shib, zalga qarang.
- Bashorat (ballsiz, 181-qonun): **Qaysi holat muammoni aniqroq ko'rsatadi?** · Slaydda faqat raqam bo'lsa · Slaydda faqat bitta voqea bo'lsa · Ikkalasi birga bo'lsa — tanlov saqlanadi, qadamlar shundan keyin ochiladi.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8; joriysi accent, o'tgani ✓): 1 Raqamni qo'ying · 2 Raqam o'rniga bitta odam bilan bo'lgan voqeani qo'ying · 3 Ikkalasini birga qo'ying.
- O'ng — Sahna: bitta slayd **Muammo**, sarlavha qatori «Maydonga kelasiz — band», ostida ikki bo'sh qator.
- **Harakat → Vizual o'zgarish:** joriy qadam tugmasini bosish → slayd o'zgaradi va zal pufagi javob beradi:
  1. slaydga uch qator yoziladi: `4 / 5` · 5 suhbatdan «maydon band edi» deganlar · demak bu bitta odamning gapi emas → pufak «Bu qanday bo'lgan?»
  2. raqam chiqib ketadi, o'rniga: «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» → pufak «Bu nechta odamda bo'lgan?»
  3. ikkalasi birga: raqam tepada, gap ostida → pufak o'rnida ✓, slayd chap chetida yashil chiziq; qatorlar ustida yorliqlar paydo bo'ladi: **raqam** · **hikoya** (atama — misoldan keyin).
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ikkalasi birga bo'lsa» yoki «Taxminingiz to'g'ri chiqdi».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Keyingi qadamni bosing — zal yana nima so'rashini ko'ring.
- Xulosa: Raqam — 5 suhbatda bu holat necha kishida chiqqani, hikoya — bitta odamda qanday bo'lgani. (90)
- Tugma (pastki): Qadamlarni bajaring (N/3) → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, slayd butun enga (DE-199).
- O'qituvchi eslatmasi: 2-qadamdan keyin sinfdan so'rang — shu gapni eshitib, muammo nechta odamda ekanini bildingizmi?

## 3 · 1-savol  ← QTest (✔ 2-variant, `correctIdx 1`)
- Eyebrow: Tekshiruv · raqam yonida
- Savol: **Slaydda «4 / 5» turibdi. Yoniga yana nima qo'yasiz?** (9 so'z)
  - A — O'yinchilar sonini yana bir marta (33)
  - ✔ B — Bitta o'yinchi bilan bo'lgan ishni (34)
  - C — O'yinchilarga bergan savollaringizni (36)
  - D — Saytning bosh sahifasidan rasmni (32)
- To'g'ri izohi: Raqam 5 suhbatda necha kishida chiqqanini aytdi, bitta odamning ishi — qanday bo'lganini.
- Xato izohlari: A — Son takrorlansa ham, qanday bo'lgani aytilmaydi. (48) · C — Savollar ro'yxati muammo qanday bo'lganini aytmaydi. (52) ·
  D — Sayt rasmi yechimni ko'rsatadi, muammoni emas. (46) · umumiy — Zal muammo qanday bo'lganini bilishi kerak. (43)
- Yozuvlar (barcha testlarda bir xil, qolip): To'g'ri · Qaytadan urinib ko'ring · (jonli darsda xato tanlansa) To'g'ri javob: X — …

## 4 · Bo'lib o'tganmi?  ← QTushuncha (saralash; audit 5 — «yozuvda bor» va «bo'lib o'tgan ish» bir xil emas)
- Eyebrow: Tushuncha · yozuvdan olingan gap
- Sarlavha: **Qaysi gap haqiqatan bo'lib o'tgan?** (34)
- Mentor: Pitch uchun oltita gap yozildi. Yozuvni tekshirib, har birini o'z tomoniga joylang.
- Bashorat (ballsiz): **Olti gapdan nechtasi bo'lib o'tgan ish?** · 2 · 3 · 4
- Vizual (ikki tomon, bir balandlikda):
  - chap **Bo'lib o'tgan ish** — ostida ikki yozuv kartasi (tekshirish uchun):
    «Intervyu yozuvlari · 5» — 4 qator, yonida son: «oxirgi marta kelganimizda maydon band edi» 4 · «egasi telefonni ko'tarmadi» 3 · «jamoaga odam yetmadi» 2 · «pulni bo'lishish qiyin» 1;
    «Kuzatuv yozuvi · sinov» — 3 qator: «Band qilish» tugmasini topa olmadi · band bo'lgandan keyin nima bo'lganini tushunmadi · kunni almashtirishni sezmadi;
  - o'ng **Fikr yoki va'da** — bo'sh ustun (uzuq chiziqli joy, U-041);
  - tepada 6 gap-karta, aralash tartibda.
- Gaplar (to'g'ri tomoni — kodda `GAPLAR`):
  1. «O'tgan juma do'stlar bilan keldik — maydon band edi» — Bo'lib o'tgan ish (intervyu, 1-yozuv)
  2. «Kelishdan oldin egasiga qo'ng'iroq qilgandim, ko'tarmadi» — Bo'lib o'tgan ish (intervyu, 1-yozuv)
  3. Sinovda o'yinchi «Band qilish» tugmasini topa olmadi — Bo'lib o'tgan ish (kuzatuv, 1-qator)
  4. Bunday sayt hamma o'yinchiga kerak — Fikr yoki va'da
  5. O'yinchilar saytni albatta ishlatadi — Fikr yoki va'da
  6. Sayt juda qulay chiqdi — Fikr yoki va'da
- **Harakat → Vizual o'zgarish:** gap-kartani bosib, tomonni bosish (yoki sudrash) → «Bo'lib o'tgan ish»ga to'g'ri tushsa, yozuv kartasidagi mos qator yashil ajraladi va karta shu qator yoniga ixcham chip bo'lib o'tiradi;
  «Fikr yoki va'da»ga to'g'ri tushsa, karta o'ng ustunga tushadi, yozuv kartalari ustidan bir lahza kulrang chiziq o'tadi (mos qator topilmadi).
  Noto'g'ri tomon → karta silkinib qaytadi, bitta `QXato`:
  - voqea «Fikr yoki va'da»ga: Bu yerda odam bilan bo'lgan voqea bor — yozuvni o'qing. (55)
  - fikr «Bo'lib o'tgan ish»ga: Bu fikr yoki va'da — yozuvda bunday voqea yo'q. (47)
- 6/6 da tomonlar ostida nom paydo bo'ladi: chap **bo'lib o'tgan ish** · o'ng **fikr yoki va'da**. Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: 3».
- Xulosa: Hikoya — bitta real odam bilan bo'lib o'tgan ish. U yozuvdan olinadi, o'ylab topilmaydi. (88)
- Tugma (pastki): 6 gapni joylang (N/6) → Davom etish · `tugadi`: kartalar paneli yopiladi, ikki tomon butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xato bo'lsa) Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: «Sayt juda qulay chiqdi» kuzatuv yozuviga hatto zid — sinovda o'yinchi tugmani topa olmagan. Shuni sinfdan so'rang.

## 5 · 2-savol  ← QTest (✔ 3-variant, `correctIdx 2`; boshqa tanish olam — P-002)
- Eyebrow: Tekshiruv · hikoya
- Savol: **Navbat ilovasi pitchida qaysi gap hikoya bo'ladi?** (7 so'z) — navbat ilovasi: 8-Modul 12/14-darsdagi sartaroshxona ilovasi.
  - A — Bunday ilova hamma odamga kerak (31)
  - B — Odamlar ilovani albatta ishlatadi (33)
  - ✔ C — Kecha bir odam sartaroshda uzoq kutdi (37)
  - D — Ilova juda qulay va tushunarli chiqdi (37)
- To'g'ri izohi: Unda bitta odam bilan bo'lib o'tgan ish bor.
- Xato izohlari: A — Bu fikr: unda hech kim bilan bo'lgan ish yo'q. (46) · B — Bu va'da: odamlar hali hech narsa qilmagan. (43) ·
  D — «Qulay» degani fikr: kim, qachon, nima qildi — aytilmagan. (58) · umumiy — Bitta odam bilan bo'lib o'tgan ishni toping. (44)

## 6 · Canva  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Canva muammosi qayerdan chiqqan?** (32)
- Mentor: Canva — taqdimot va rasm yasaydigan sayt. Uni boshlagan Melanie Perkins avval universitetda o'qigan.
- Nuqtalar: 6 ta · yorliq **Canva · N/6** (bashorat kartasida ham) · maket `CanvaMock`: chizilgan dastur oynasi va taqdimot slaydlari; «Canva» nom-yorlig'i o'z rangida (182-qonun), logotip yo'q, son yo'q.
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/6 **Talabalarga dars bergan talaba** — Melanie universitetda o'qib yurib, boshqa talabalarga dizayn dasturlarini o'rgatgan. · maket: tugmalari ko'p dastur oynasi, oldida uchta talaba-siluet
  - 2/6 bashorat — **Talabalar nimaga qiynalgan?** · Chiroyli rang tanlashga · ✔ Tugmalar qayerdaligini o'rganishga · Ishni vaqtida topshirishga
  - 3/6 **Tugma qidirib o'tgan vaqt** — Melanie aytishicha, tugmalar qayerdaligini o'rganishning o'ziga juda ko'p vaqt ketgan. Bu muammoni u talabalarda o'z ko'zi bilan ko'rgan. ·
    maket: kursor tugmalar orasida adashib yuradi, tugmalar birma-bir yonib o'chadi
  - 4/6 **Uch yil pitch** — U g'oyasini investorlarga — loyihaga pul tikadigan odamlarga — uch yilga yaqin pitch qilgan. Har rad javobidan keyin taqdimotini yaxshilagan. ·
    maket: taqdimot slaydlari ustida bir necha marta rad belgisi (✗), har safar slaydlar qayta tartiblanadi
  - 5/6 bashorat — **Investor «sohangizni tushunmayapman» degan. Melanie qanday slayd qo'shgan?** · Jamoasini tanishtiradigan slayd · ✔ Dizayn qanchalik murakkabligini ko'rsatadigan slayd · Kelajakdagi daromadni ko'rsatadigan slayd
  - 6/6 **Muammo ko'rinadigan bo'ldi** — Yangi slayd hozirgi dizayn ishi qanday bo'lishini va qanchalik murakkabligini ko'rsatgan. · maket: taqdimotga yangi slayd kiradi — ichida ko'p qadamli chigal chiziq
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `CanvaMock` holati o'zgaradi: kirish (dastur oynasi + talabalar) → qidiruv (kursor adashadi) →
  pitch (rad belgilari, slaydlar qayta tartiblanadi) → yangi slayd (chigal chiziq). Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (6/6 dan keyin, hisoblagichsiz): Canva muammosi o'ylab topilmagan — Melanie uni talabalarda ko'rgan va pitchda ko'rinadigan qilgan. (98)
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish
- O'qituvchi eslatmasi: Melanie gaplari — Guy Kawasaki bilan suhbatdan (manba pastda). «Rad javobi» — investor pul tikmaslikka qaror qilgani.
- Manba (o'quvchiga ko'rinmaydi; 05.10.2026 ochib tekshirildi): Guy Kawasaki, «Remarkable People» — Melanie Perkins suhbati, https://guykawasaki.com/melanie-perkins-canva-ceo/ :
  «I was teaching design programs and students would struggle learning the very basics. It would take a very long time to learn where the buttons were…» ·
  «It was like three years of pitching» · «Every time we were rejected, we would refine our pitch deck» · investor «I don't understand your industry» deganda —
  «how the current design process works and how it's really complicated» sahifasi qo'shilgan. Universitet (Western Australia, 2007) — CNBC Make It, 09.01.2020,
  https://www.cnbc.com/2020/01/09/canva-how-melanie-perkins-built-a-3point2-billion-dollar-design-start-up.html (sahifa 403 berdi — qidiruv parchasi orqali; yil va universitet nomi o'quvchi matnida yo'q).

## 7 · 3-savol  ← QTest (✔ 1-variant, `correctIdx 0`; Canva qoidasi «Maydon»ga)
- Eyebrow: Tekshiruv · Canva'dagidek
- Savol: **Zal «Maydon» muammosini tushunmadi. Pitchga nima qo'shasiz?** (8 so'z)
  - ✔ A — Maydon band bo'lgan kun haqida slayd (36)
  - B — Saytni qurishga ketgan haftalar slaydi (38)
  - C — Saytning yangi dizayni haqida slayd (35)
  - D — Keyin qo'shiladigan to'lov slaydi (33)
- To'g'ri izohi: Canva'dagidek: muammo qanday bo'lishini ko'rsatadigan slayd qo'shiladi.
- Xato izohlari: B — Qurishga ketgan vaqt — mehnat raqami, muammo emas. (50) · C — Dizayn yechim haqida — muammoni ko'rsatmaydi. (45) ·
  D — To'lov keyin qilinadi — u muammoni ko'rsatmaydi. (48) · umumiy — Muammo qanday bo'lishini ko'rsating. (36)

## 8 · Uch slayd  ← QTushuncha
- Eyebrow: Tushuncha · uch slayd
- Sarlavha: **Qaysi hikoya qaysi slaydga chiqadi?** (35)
- Mentor: Beshta bo'lak «Maydon» yozuvlaridan va saytidan — har birini o'z slaydiga joylang.
- Qator (`QIzoh`, uch slayd ustida; audit 6): Foydalanuvchi slaydida kimligi emas, saytni ishlatganda nima bo'lgani ko'rinadi. (80)
- Bashorat (ballsiz): **Sinovdagi o'yinchining hikoyasi qaysi slaydga chiqadi?** · Muammo · Yechim · Foydalanuvchi
- Vizual: Sahna — uch slaydli tasma: 1 **Muammo** · 2 **Yechim** · 3 **Foydalanuvchi** (har birida bo'sh qatorlar); ostida zal.
- Bo'laklar (5, aralash tartibda — kodda `BOLAKLAR`):
  1. `4 / 5` · intervyuda «maydon band edi» deganlar → Muammo
  2. «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» → Muammo
  3. Sayt kun bo'yicha bo'sh vaqt kataklarini ko'rsatadi, katakni band qiladi → Yechim
  4. Sinovda o'yinchi shanba 18:00 ga band qilmoqchi bo'ldi, lekin «Band qilish» tugmasini topa olmadi → Foydalanuvchi
  5. Tugmani ekran pastiga qotirdik — qayta sinovda yangi o'yinchi birinchi urinishda band qildi → Foydalanuvchi (11-dars `SINOV.md`)
- **Harakat → Vizual o'zgarish:** bo'lakni tanlab, slaydni bosish (yoki sudrash) → to'g'ri bo'lsa bo'lak slaydga yoziladi (bir lahza ajralib kiradi), to'lgan slayd chap chetida yashil chiziq;
  zal pufagi to'lmagan birinchi slayd ustida turadi: Muammo — «Bu qanday bo'lgan?» · Yechim — «Sayt nima qiladi?» · Foydalanuvchi — «Kimdir ishlatib ko'rdimi?».
  Noto'g'ri slayd → bo'lak silkinib qaytadi, bitta `QXato`:
  - intervyu hikoyasi Foydalanuvchi slaydiga: Intervyuda sayt hali yo'q edi — bu muammo hikoyasi. (51)
  - sinov hikoyasi Muammo slaydiga: Bu odam saytni ishlatgan — u foydalanuvchi haqida. (50)
  - raqam boshqa slaydga: Bu raqam suhbatlarda necha kishida chiqqanini sanaydi. (54)
  - yechim gapi boshqa slaydga: Bu gap sayt nima qilishini aytadi. (34)
  - tuzatish boshqa slaydga: Bu sinovdan keyin tuzatilgan narsa. (35)
  5/5 da zal ✓; slayd nomlari ostida manba yorliqlari chiqadi: «intervyudan» · «saytdan» · «sinovdan». Natija qatori (`QTaxmin`).
- Xulosa: Muammo slaydiga intervyudagi odamning hikoyasi, foydalanuvchi slaydiga sinovdagi odamning hikoyasi chiqadi. (107)
- Tugma (pastki): 5 bo'lakni joylang (N/5) → Davom etish · `tugadi`: bo'laklar paneli yopiladi, uch slayd butun enga.
- Nishon sharti (151-qonun): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- O'qituvchi eslatmasi: Sinfdan so'rang — intervyudagi o'yinchi nega foydalanuvchi slaydiga chiqmaydi? (U paytda sayt hali yo'q edi.)

## 9 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Loyihangiz pitchini uch slaydda yozing.** (39)
- Mentor: Yozuvlaringizni yoningizga oching. Hikoyadagi odamning ismini emas, kimligini yozing.
- Bitta ustun: Sahna (uch slayd; qatorlar = qadamlar 1/2/3/4, joriy qator accent) → forma (har qadamda bitta maydon) → Yordam · «Slaydga chiqarish» o'ngda (187-qonun).
- Qadamlar va maydon maslahati (placeholder, §32 — qisqa, tayyor javobsiz):
  1. raqam (Muammo slaydi) — Necha kishidan nechtasi shu muammoni aytdi?
  2. muammo hikoyasi (Muammo slaydi) — Kim edi, nima qilmoqchi edi, nima bo'ldi?
  3. yechim (Yechim slaydi) — Saytingiz shu muammoni qanday hal qiladi?
  4. sinov hikoyasi (Foydalanuvchi slaydi) — Sinovda odam nimaga qoqildi, siz nimani tuzatdingiz?
- Tekshiruv (`QXato`, ≤60; faqat 1-qadam bloklaydi, qolgani yo'naltiradi; javob forma ostida, yozilgan zahoti — 106d):
  - 1-qadamda son yo'q: Raqam qatoriga intervyudagi sonni yozing. (41)
  - 2/4-qadamda «hamma», «ko'pchilik», «har kim»: Hikoya bitta odam haqida — u kim edi? (37)
  - 2/4-qadamda «albatta», «kerak», «yoqadi», «qulay», «zo'r»: Fikrga o'xshaydi — yozuvda aynan shunday gap bormi? (51)
  - o'tgan qator (ikki tomonlama javob, 106d-a): qator slayd ichida yashil chiziq oladi — alohida maqtov-matni yo'q.
- Doimiy qator (forma ostida): Hikoyani o'ylab topmaysiz — yozuvingizdan olasiz.
- Yordam: Real odam bilan hali gaplashmagan bo'lsangiz — sinfdosh bilan mashqdagi yozuvni oling. Sinovdan keyin hali tuzatmagan bo'lsangiz — topilgan muammoni yozing.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Slaydga chiqarish» → qator o'z slaydiga kiradi, joriy belgi keyingi qatorga o'tadi; tekshiruvdan o'tgan qator yashil chiziq oladi,
  o'tmagani `err` fonda va ostida bitta `QXato`; zal pufagi slayd bo'yicha («Bu qanday bo'lgan?» → «Sayt nima qiladi?» → «Kimdir ishlatib ko'rdimi?» → ✓).
  4/4 da forma yopiladi, uch slayd butun enga (DE-199), har qator yonida ✎ (tahrirlash).
- Xulosa: Pitchingizning uch slaydi tayyor: muammo, yechim va foydalanuvchi. (66)
- Tugma (pastki): To'rt qatorni yozing (N/4) → Davom etish
- Artefakt-strip (U-042): shu ekrandan — «Pitchim» (ixcham, uch slayd holati «2/3»); 10, 12, 14, 15-ekranlarda ko'rinadi, test, arena va podiumda yo'q.

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **Bo'lib o'tgan ishlarni ajratadigan kod yozamiz.** (46) — PM-082(a) sarlavha oilasi
- Mentor: Gaplarni qo'lda ajratgan edingiz — endi shu ishni kod bajaradi. Gaplar o'sha «Maydon» pitchidan.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Kod gapni qaysi qiymatga qarab ajratadi?** · `matn` · `qism` · ✔ `turi`
  - xato `matn`: `matn` — gapning o'zi; uning turi alohida yozilgan. (49, belgisiz)
  - xato `qism`: `qism` — slayd nomi; gapning turini aytmaydi. (45, belgisiz)
- Chap (vazifa, 3 band): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ro'yxatga faqat bo'lib o'tgan ishlar tushadi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Bitta gapdan boshlang: uning `turi` qiymati `"bo'lib o'tgan ish"` mi? Ishlagach qolganlariga o'ting.
  Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `console.log` — qiymatni ekranga chiqaradi.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas).
- Kod:
```js
// «Maydon» pitchi uchun yozilgan gaplar (saralashdan tanish)
const gaplar = [
  { matn: "O'tgan juma keldik — maydon band edi", qism: "muammo", turi: "bo'lib o'tgan ish" },
  { matn: "Bunday sayt hamma o'yinchiga kerak", qism: "muammo", turi: "fikr" },
  { matn: "«Band qilish» tugmasini topa olmadi", qism: "foydalanuvchi", turi: "bo'lib o'tgan ish" },
  { matn: "Sayt juda qulay chiqdi", qism: "foydalanuvchi", turi: "fikr" }
];

function hikoyalar(royxat) {
  // bo'lib o'tgan ishlarning matni
  return [];   // shu joyni siz yozasiz
}

console.log(hikoyalar(gaplar));
// ["O'tgan juma keldik — maydon band edi", "«Band qilish» tugmasini topa olmadi"]
console.log(hikoyalar([gaplar[2]]));
// ["«Band qilish» tugmasini topa olmadi"]
console.log(hikoyalar([gaplar[1], gaplar[0]]));
// ["O'tgan juma keldik — maydon band edi"]
```
- Boshlang'ich kod tekshiruvi (§140-B): `return []` hech bir kutilgan natijaga teng emas — tegilmagan kod 0/3.
- Kod oynasi sarlavhasi: `app.js — hikoyalar funksiyasini yakunlang` · placeholder: `// bo'lib o'tgan ishlarni yig'ib qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: to'rt gapdan ikkitasi tushadi. (58) · 2 — Ro'yxatga faqat bo'lib o'tgan ish tushsin, fikr emas. (53) ·
  3 — Kichik ro'yxatda ham faqat yozuvdan olingani qolsin. (52)
- **Harakat → Vizual o'zgarish:** darvozada `turi` tanlanadi → kod namunasida `turi` qiymatlari bir lahza ajraladi; kod ishga tushganda Console'da ro'yxat chiqadi, shartlar birma-bir ✓ bo'ladi.

## 11 · Yakuniy savol  ← QTest (✔ 4-variant, `correctIdx 3`; ikki qoida birga, boshqa tanish olam)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Navbat ilovasi pitchi: foydalanuvchi slaydiga nima chiqadi?** (8 so'z)
  - A — Intervyuda navbat kutib qiynalganlar soni (41)
  - B — Ilovani hamma albatta ishlatadi degan gap (41)
  - C — Ilovani qurishga ketgan besh haftalik ish (41)
  - ✔ D — Sinovda bir odam vaqt tanlay olmagani (37)
- To'g'ri izohi: Foydalanuvchi slaydiga ilovani sinovda ishlatgan odamning hikoyasi chiqadi.
- Xato izohlari: A — Bu son intervyudan — u muammo slaydiga chiqadi. (47) · B — Bu va'da: hali bo'lib o'tmagan. (31) ·
  C — Bu mehnat raqami — foydalanuvchi haqida emas. (45) · umumiy — Ilovani ishlatgan odamning hikoyasini toping. (45)

## 12 · Repetitsiya  ← QMustaqil (2 qadam)
- Eyebrow: Mashq · sinfdosh oldida
- Sarlavha: **Pitchingizni 1 daqiqada tushuntira olasizmi?** (44)
- Mentor: Sahnadan oldin pitchni ovoz chiqarib aytib ko'rish repetitsiya deyiladi. Avval {sinfdoshingizga | o'zingizga} 1 daqiqada ayting, keyin bir qator yozing.
- Qadamlar 1/2: 1 Sinfdoshingizga ayting | Ovoz chiqarib ayting · 2 Endi bir qator yozing
  - Jonli taymer (juftlik, 2 daqiqa): Har biringizga 1 daqiqadan — avval A, keyin B. · 2 daqiqani boshlash · Hozir A gapiradi · Hozir B gapiradi · To'xtatish · Yana 2 daqiqa
  - Mustaqil taymer (1 daqiqa): 1 daqiqani boshlash · Hozir ovoz chiqarib ayting · To'xtatish · Yana 1 daqiqa
- Maydon maslahati: (juftlikda) Sinfdoshingiz qaysi odamni va uning qaysi muammosini eslab qoldi? | (mustaqil) Qaysi odamning hikoyasini va muammosini aytdingiz?
- Vizual: 9-ekrandagi pitch — uch slayd, qatorlar yopiq (kulrang chiziq). 9-ekran yozilmagan bo'lsa (mentor rejimi) — «Maydon» pitchi yopiq holda.
- **Harakat → Vizual o'zgarish:** taymer → aytish; qator yozilgach (≥8 belgi) yopiq slaydlar ochiladi — o'quvchi eslab qolingan odam qaysi slaydda turganini o'zi ko'radi.
- Xulosa (yozgach): Bugungi qoida: pitchda raqam yonida bitta real odamning hikoyasi turadi. (72)
- Tugmalar: Orqaga · Davom etish
- O'qituvchi eslatmasi (`MentorNote`): Tinglovchi baho bermaydi — faqat eslab qolgan odamini aytadi. Hikoya esda qolmagan bo'lsa, u raqam yonida turibdimi — birga tekshiring.
- Nishon: Rehearsal Done (taymer tugagach va qator yozilgach).

## 13 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti.
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Raqam yoniga nima · 2 — Qaysi gap hikoya · 3 — Canva'dagidek · 4 — Foydalanuvchi slaydi

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon | Orqa tomon |
|---|---|
| Raqam va hikoya pitchda nimani ko'rsatadi? | Raqam — 5 suhbatda necha kishida chiqqani; hikoya — bitta odamda qanday bo'lgani |
| Hikoya nima? | Bitta real odam bilan bo'lib o'tgan ish |
| Hikoya qayerdan olinadi? | Intervyu yoki kuzatuv yozuvidan — o'ylab topilmaydi |
| «Bunday sayt hammaga kerak» — hikoyami? | Yo'q, bu fikr: unda bo'lib o'tgan ish yo'q |
| Raqam yolg'iz tursa, zal nimani so'raydi? | «Bu qanday bo'lgan?» |
| Pitch qaysi uch slayddan iborat? | Muammo, yechim va foydalanuvchi |
| Muammo va foydalanuvchi slaydida kimning hikoyasi turadi? | Muammoda — intervyudagi odamning; foydalanuvchida — saytni sinovda ishlatgan odamning |
| Sinov hikoyasi yonida nima turadi? | Sinovdan keyin tuzatilgan narsa |
| Canva g'oyasi qayerdan chiqqan? | Melanie Perkins dars bergan talabalar tugma qidirib qiynalganidan |
| Investor tushunmaganda Canva pitchiga nima qo'shilgan? | Dizayn qanchalik murakkabligini ko'rsatadigan slayd |
| Repetitsiya nima? | Sahnadan oldin pitchni ovoz chiqarib aytib ko'rish |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 11/11 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi atama darsda bor (hikoya — 2/4, repetitsiya — 12, Canva — 6, «Bu qanday bo'lgan?» — 2).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Pitchingizda endi real odamning hikoyasi bor.** (45)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Endi siz bilasiz (modul yo'li):
  - Mahsulot — odamlar o'z muammosi uchun ishlatadigan narsa; u real odamning muammosidan boshlanadi.
  - Muammoni o'rganadigan intervyuda odamning fikri emas, bo'lib o'tgan ishi so'raladi.
  - Agent MVP qurishda talabingizga tayanadi, siz natijani tekshirasiz; animatsiya uni jonli qiladi.
  - Sinovda tushuntirilmaydi — odam qayerda to'xtashi kuzatiladi.
  - Pitchda raqam yonida bitta real odamning hikoyasi turadi.
- Uyga vazifa (karta, P-025): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: sinovda saytingizni ishlatgan real odam · Nechta: 1 pitch · Muddat: zaxira darsgacha
  - ① Sinovda saytingizni ishlatgan odamdan ruxsat so'rang: hikoyasini ismsiz aytasiz.
  - ② Uni pitchingizni tinglashga taklif qiling va 1 daqiqada aytib bering. Kelolmasa — ruxsati bilan hikoyani ismsiz boshqa tinglovchiga ayting.
  - ③ Hikoya u bilan bo'lgandek aytildimi — so'rang; tuzatsa, slaydga yozing.
  - Karta ostida (bitta kulrang qator): Real odam hali sinamagan bo'lsa — avval u bilan sinov o'tkazing, keyin pitch.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — Zaxira dars: ortda qolgan ishni yetkazasiz va pitchni sayqallaysiz.
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Story Finder!** (4-ekran, birinchi urinishda xatosiz) — Olti gapdan yozuvda borini ajratdingiz
- **Pitch Builder!** (8-ekran, birinchi urinishda xatosiz) — «Maydon» pitchini uch slaydga yig'dingiz
- **Real Voice!** (9-ekran, 4/4) — Pitchingizning to'rt qatorini yozdingiz
- **Rehearsal Done!** (12-ekran) — Pitchingizni ovoz chiqarib aytdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Raqam yonida hikoya** — 1 Raqam 5 suhbatda necha kishida chiqqanini ko'rsatadi. · 2 Hikoya bitta odamda u qanday bo'lganini ko'rsatadi. ·
  3 Pitchda ikkalasi bitta slaydda yonma-yon turadi. — Sinfga savol: 3-ekran savoli
- **5 · Hikoya — bo'lib o'tgan ish** — 1 Hikoya — bitta real odam bilan bo'lib o'tgan ish. · 2 «Hammaga kerak» — fikr, «albatta ishlatadi» — va'da. ·
  3 Ikkalasida ham bo'lib o'tgan ish yo'q, ular hikoya emas. — Sinfga savol: 5-ekran savoli
- **7 · Canva'dagidek** — 1 Melanie Perkins talabalarga dizayn dasturlarini o'rgatgan. · 2 Talabalar tugmalar qayerdaligini o'rganishga qiynalgan. ·
  3 Investor tushunmaganda, u muammoni ko'rsatadigan slayd qo'shgan. — Sinfga savol: 7-ekran savoli
- **11 · Kimning hikoyasi qaysi slaydda** — 1 Muammo slaydida — intervyudagi odamning hikoyasi. · 2 Foydalanuvchi slaydida — saytni sinovda ishlatgan odamning hikoyasi. ·
  3 Sinov hikoyasi yonida tuzatilgan narsa turadi. — Sinfga savol: 11-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144 va uning qo'shimcha bandi): boshqa holat, boshqa so'z.
1. «5 kishidan 4 tasi» zalga nimani aytadi?
   - ✔ A — Beshta intervyudan nechtasida chiqqanini
   - B — Muammo bir odamda qanday kechganini
   - C — Saytni nechta odam qurganini
   - D — Intervyu qancha davom etganini
2. Pitchda faqat hikoya bor. Yoniga nima qo'yiladi?
   - A — Yana bitta shunday hikoya
   - ✔ B — Intervyudan olingan raqam
   - C — Saytning rangli rasmi
   - D — Jamoa a'zolari ro'yxati
3. Pitch uchun to'rt gap. Qaysi biri fikr?
   - A — «Kelganimizda maydon band edi»
   - B — «Egasi telefonni ko'tarmadi»
   - ✔ C — «Bu sayt juda yaxshi chiqdi»
   - D — «Tugmani topa olmadim»
4. «O'yinchilar saytni albatta ishlatadi» — bu qanday gap?
   - A — Intervyudan olingan hikoya
   - B — Sinovda yozilgan kuzatuv
   - C — Muammoni sanagan raqam
   - ✔ D — Hali bo'lib o'tmagan va'da
5. Yozuvda: «egasi telefonni ko'tarmadi». Pitchga nima yozasiz?
   - ✔ A — Yozuvdagi gapni o'zgartirmasdan
   - B — Maydon egalari telefon ko'tarmaydi
   - C — Egasi o'yinchilarni yoqtirmaydi
   - D — Egasi bilan janjal bo'lib o'tgan
6. Intervyudagi o'yinchining hikoyasi qaysi slaydga chiqadi?
   - A — Foydalanuvchi slaydiga
   - ✔ B — Muammo slaydiga
   - C — Yechim slaydiga
   - D — Uchala slaydga ham
7. Pitch slaydlari qaysi tartibda boradi?
   - A — Yechim → muammo → foydalanuvchi
   - B — Foydalanuvchi → muammo → yechim
   - ✔ C — Muammo → yechim → foydalanuvchi
   - D — Muammo → foydalanuvchi → yechim
8. «Ko'pchilik bo'sh vaqtni bilmaydi» hikoya bo'lishi uchun nima kerak?
   - A — Muammoni boshqacha nomlash
   - B — Gapni ikki barobar uzaytirish
   - C — Yoniga katta raqam qo'yish
   - ✔ D — Bitta odam va uning ishi
9. Melanie Perkins har rad javobidan keyin nima qilgan?
   - ✔ A — Taqdimotini yaxshilagan
   - B — Boshqa g'oyaga o'tgan
   - C — Pitch qilishni to'xtatgan
   - D — Faqat raqamlarni ko'paytirgan
10. Sinovdagi odamni pitchda qanday tilga olasiz?
    - A — To'liq ismi va familiyasi bilan
    - ✔ B — Kimligi bilan, masalan o'yinchi
    - C — Telefon raqami bilan birga
    - D — Sinfi va maktabi nomi bilan
11. Repetitsiyada sinfdoshingiz nima qiladi?
    - A — Pitchingizga ball qo'yadi
    - B — Pitchni siz uchun aytadi
    - ✔ C — Eslab qolganini aytib beradi
    - D — Slaydlaringizni qayta yozadi
12. Sinovda o'yinchi tugmani topa olmadi. Pitchda keyin nima aytiladi?
    - A — Intervyudagi raqam qaytadan
    - B — Saytni qurgan haftalar soni
    - C — Keyin qo'shiladigan to'lov
    - ✔ D — Tugma qanday tuzatilgani

- Arena yozuvlari — umumiy shablon (8-Modul 14-dars YAKUNIY dagidek).
- **Fon so'zlari** (R-008, {uz, ru}): arena — pitch · hikoya · raqam · slayd · yozuv · odam · sahna · sinov · uyga vazifa banneri — pitch · hikoya · slayd · odam (faqat so'z, emojisiz).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/7-Modull/PmUserStoryPitchLesson.jsx`; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m7d12-v1` · «Pitchingizda kimning hikoyasi bor?».
2. Ekran turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (darsning `QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s9/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` (podium) · s14 `QKartochka` · s15 `QYakun`.
3. **`PitchSahna` — qolipda yo'q, yangi** (bitta vizual, 180-qonun): 1–3 slaydli tasma + zal (4 siluet, savol pufagi / ✓), qator holatlari (bo'sh · yozildi · joriy · xato · to'liq), `reduced-motion`.
   Asos — 8-Modul 14-dars «Sahna ekrani» slaydi (`src/6-Modull/PmLesson25.jsx`, `sl-*` CSS); umumiy qolipga ko'chirish K-020 tartibida (shubhada — dars ichida nusxa). Ishlatiladi: 0, 1, 2, 8, 9, 12.
4. `MAYDON` — bitta manba (180-qonun): muammo gapi · intervyu takrorlari (4 qator + son) · intervyu hikoyasi · yechim gapi · sinov vazifasi · kuzatuv (3 qator) · tuzatish. s0, s2, s4, s8, s10 shundan o'qiydi.
5. s2 — `QBashorat` (uch holat) → `QQadamlar` (uch qadam) → slayd almashinuvi + zal pufagi; 3-qadamda `raqam`/`hikoya` yorliqlari; `QTaxmin`; 40 s ipucha.
6. s4 — `GAPLAR` (6: `matn`, `tomon`, `yozuvQatori`) + yozuv maketi (intervyu 4 qator, kuzatuv 3 qator; mos qator yashil, «topilmadi» chizig'i); bashorat 2/3/4; 6/6 da yorliqlar; nishon — birinchi urinish.
7. s6 — `CanvaMock` (yangi keys-maketi: dastur oynasi + tugmalar, kursor, taqdimot slaydlari, rad belgilari, «chigal chiziq» slaydi); `K_CANVA` 6 bosqich; `.ksc-brand` «Canva» o'z rangida (182-qonun; rang tasdig'i — TAYANCHGA SAVOL 8).
8. s8 — `BOLAKLAR` (5: `matn`, `slayd`, `xato`); bashorat; zal pufagi to'lmagan birinchi slayd ustida; 5/5 da manba yorliqlari.
9. s9 — 4 qadamli forma, `LS` kalit `pm-m7d12-pitch` ({raqam, muammoHikoya, yechim, sinovHikoya, savedAt}); tekshiruv funksiyasi (son · «hamma|ko'pchilik|har kim» · «albatta|kerak|yoqadi|qulay|zo'r») —
   PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi; artefakt-strip «Pitchim» (U-042). Oldingi darslar artefakti bo'lsa — kulrang ma'lumot qatori (TAYANCHGA SAVOL 4).
10. s10 — `KOD_TASK` (gaplar, `hikoyalar`), 3 `evalEquals` ifodasi, `GATE_ITEMS` (`matn`/`qism`/`turi`), requirement yorliqlari va xabarlari; starter 0/3 (§140-B).
11. s12 — `PairTimer`: juftlik 2 daqiqa (A 1 + B 1), mustaqil 1 daqiqa; s9 slaydlari yopiq → qator yozilgach ochiladi; ▶ ⏹ belgilari yo'q.
12. Jonli ball: `INLINE_KEYS` = { s3: 1, s5: 2, s7: 0, s11: 3, saralash: -1, slaydlar: -1, practice: -1, koding: -1, repetitsiya: -1 }; `RECAPS` 3/5/7/11; `Q_LABELS`;
    `QUIZ_BANK` 12 (✔ 0/1/2/3 har biri 3 marta) + `set_quiz_keys`; `SCREEN_META` == screens; `SCREEN_INTENTS`.
13. `ACHIEVEMENTS` 4 · `FLASHCARDS` 11 · `RECAP` 5 · `HW_TOKENS` · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
14. Uyga vazifa — yangi dars, `HwCard` mazmuni shu MD dan (PM-027 faqat mavjud homework fayllariga tegishli; yangi fayl ochish — TAYANCHGA SAVOL 6).
15. App.jsx m7-12 qatoriga `comp: PmUserStoryPitchLesson` ulash (nom va osti o'zgarmaydi — DE-205 ✓).
16. **REPO — yo'q** (PM darsi; `maydon` repo'ga tegilmaydi).
- Darvozalar: `npm run gates -- src/7-Modull/PmUserStoryPitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

✎ Qurishda koddagi chetlashishlar (quruvchi, 05.10.2026; o'quvchi matni o'zgarmagan):
- ✎ Slayd to'liq — «chap chetda yashil chiziq» o'rniga yashil halqa va nom yonida ✓ (SABOQ 7, lint-dizayn D1 — rangli yon chiziq taqiq). s9 o'tgan qatori — qator ostida yashil chiziq.
- ✎ s4 va s8: gaplar va bo'laklar bittadan katta karta bo'lib chiqadi, tomon yoki slayd tugma bilan tanlanadi (SABOQ 9); sudrash yo'q.
- ✎ s6: 1/6 da Mentor pufagida MD Mentor gapi va 1/6 bosqich gapi birga (3 gap, SABOQ 8); 2/6 va 5/6 da bashorat savolini Mentor aytadi, kartada yorliq «Canva · N/6» va variantlar.
- ✎ s2: joriy qadam tugmasi matni — qadam nomining o'zi (MD da tugma yozuvi yo'q).
- ✎ s12: slaydlar ochilgach zal ustida ✓. Taymer tugmalarida ↻ belgisi yo'q (MD yozuvi aynan).
- ✎ `INLINE_KEYS` dagi `saralash` va `slaydlar` — s4/s8 tugaganda mentor paneliga mashq signali (500+ zonasi) yuboriladi (jsx-lint talabi).

---

## TAYANCHGA SAVOL
1. **Yopildi (audit 2):** hikoya agregat sonlardan yasalmaydi — 3-darsdagi 1-yozuv so'zma-so'z olindi. Tarix: **Intervyu hikoyasi — ikki ibora bitta odamda.** «O'tgan juma do'stlar bilan keldik — maydon band edi. Kelishdan oldin vaqt band qilmoqchi bo'lib egasiga qo'ng'iroq qilgandim, ko'tarmadi.» — tayanchdagi ikki iborani bitta o'yinchiga berdim
   («qo'ng'iroq qildik» qo'shildi). Nega: hikoya uchun bitta odam kerak; 4 + 3 > 5, ya'ni kamida ikki kishi ikkalasini aytgan. Taklif: tayanchga shu matnli bitta yozuv qo'shilsin (2, 3, 10-dars ham ishlatishi mumkin).
2. **Yopildi:** tuzatish va qayta sinov — 11-dars `SINOV.md` dagi so'zlar bilan («tugmani ekran pastiga qotirdik», «yangi o'yinchi birinchi urinishda band qildi»). Tarix: **Tuzatish qanday bo'lgan.** «"Band qilish" tugmasini ko'rinadigan joyga chiqardik» — tayanchda faqat «tuzatiladi». 11-dars MD dagi aniq so'z bilan bir xil qilish kerak (masalan, «formadan tepaga»).
3. **Tuzatishdan keyin qayta sinov bormi?** Natija tayanchda yo'q — pitchda «endi topdi» deyilmadi (o'ylab topilmaydi). Bo'lsa, foydalanuvchi slaydi kuchliroq bo'ladi.
4. **Oldingi darslar artefakti.** 2-dars (intervyu yozuvlari), 3-dars (muammo + son), 10-dars (kuzatuv yozuvi), 11-dars (tuzatish) localStorage'da saqlanadimi va qaysi kalit bilan — 9-ekran ularni ko'rsatishi uchun.
5. **Pitch uzunligi.** Repetitsiya taymeri 1 daqiqa (juftlikda 2) — dastur aytmaydi; uch slaydga yetadi deb tanladim.
6. **Uyga vazifa fayli** — yopildi (GATE M M-q9): faqat yakun kartasida (`HwCard`), alohida `.homework.jsx` yo'q.
7. **Foydalanuvchi slaydida raqam.** Sinovchilar soni tayanchda yo'q — slaydda raqam qo'yilmadi, faqat hikoya va tuzatish.
8. **Canva rangi.** `.ksc-brand` uchun Canva brend rangi (#00C4CC yoki #7D2AE8) — tasdiq kerak; logotip qo'yilmaydi.
9. **Real foydalanuvchi ishtiroki qayerda tekshiriladi.** Uyga vazifa muddati «zaxira darsgacha» — zaxira dars qurilmaydi; natija keyingi modulda ko'riladimi.

## Shubhali joylar (ishonchim komil emas)
- s0 variantlari: «beshtadan to'rttasi» degani — og'zaki shakl; «besh kishidan to'rttasi» ham bo'ladi (uzunlik tenglashadi).
- s2 bashorat varianti «odamning gapi» — atama («hikoya») hali tug'ilmagani uchun shunday; o'qilishi og'ir bo'lsa, «bitta odamning gapi».
- s2 zal pufaklari («Bu qanday bo'lgan?» / «Bu nechta odamda bo'lgan?») — model, haqiqiy zal emas; `QTaxmin` «haqiqatda» so'zi shu modelga ishora qiladi.
- s4 «Yozuvda bor / yo'q» → nomlar «bo'lib o'tgan ish / fikr yoki va'da»: yozuvda ham fikr bo'lishi mumkin (odam «yaxshi ekan» desa). Bu misolda tenglik rost; umumiy qonun qilib aytilmadi (T-043).
- s6 Canva: manba Melanie talabalar hikoyasini pitchga qo'yganini aytmaydi — matnda faqat manbadagi gaplar: muammoni talabalarda ko'rgan, uch yil pitch, har raddan keyin yaxshilagan, murakkablik slaydi qo'shilgan.
  «Investor muammoni ko'rdi» kabi xulosa yozilmadi. Canva — Toshkent o'smiriga maktab taqdimotidan tanish deb oldim (tekshirilmagan).
- s9 tekshiruvidagi «kerak» so'zi to'g'ri hikoyada ham chiqishi mumkin («qo'ng'iroq qilish kerak edi») — shuning uchun faqat yo'naltiradi, bloklamaydi. «zo'r» — lint:til warn (detektor ro'yxati, o'quvchi matni emas).
- s10 kod ekrani dars vaqtiga og'ir bo'lsa — PM-082 bo'yicha qoladi, lekin olib tashlash mumkin (repetitsiya — darsning asosiy natijasi).
- s11 C varianti «besh haftalik ish» — 8-Modul 14-dars navbat ilovasi raqami («5 hafta ishlandi»); tanish raqam, lekin variant matnida yolg'iz son.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (DE-205): App.jsx m7-11 «Loyiha kuni: sinovdan keyingi tuzatish» → **m7-12 «Pitchingizda kimning hikoyasi bor?»** → m7-13 «Zaxira dars»; reja chap matni App.jsx ostiga mos («muammo, yechim va real foydalanuvchi»).
- [x] Bitta misol-ip — «Maydon» (tayanch faktlari: 4/3/2/1 intervyu, sinov vazifasi, «Band qilish» tugmasi); metafora yo'q; bitta vizual — `PitchSahna`. Ikkinchi misol faqat testda (s5, s11 — navbat ilovasi, tanish olam, P-002); Canva — keys (PM-029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 12. Matn-karta yo'q.
- [x] O'lchov (python bilan sanaldi, qavsdagi sonlar): sarlavha 31–50 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 66–107 · hook javobi 80 · xato izohi 31–58.
- [x] Atamalar oldingi darslar bilan bir xil (grep: 8-Modul 14-dars YAKUNIY — slayd, raqam/nimani sanadi/nimani ko'rsatadi, mehnat raqami, «Sahna ekrani»; 5-Modul 8-dars — fikr, va'da, bo'lib o'tgan ish);
  siz-forma; formula ot-shaklda («Muammo → yechim → foydalanuvchi»), tugma siz-formada yoki ot-shaklda (§222/224).
- [x] Testlar: 4 variant, uzunlik yaqin (s3 33/34/36/32 · s5 31/33/37/37 · s7 36/38/35/33 · s11 41/41/41/37 — to'g'ri javob eng uzun emas); kalit so'z, strelka, qavs faqat to'g'rida emas
  (arena 10 da «» olindi, arena 7 da strelka hamma variantda); ✔ o'rni 1/2/0/3 (yangi dars).
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), shuning uchun uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami — nishon, arena, podium — mustasno; ✓ ✗ «+» — belgilar); kafolat gaplari yo'q («albatta» faqat va'da namunasi sifatida — o'rgatilayotgan xato).
- [x] Ichki kodlar o'quvchi matnida yo'q («o'tgan modulda», «navbat ilovasi» — raqamsiz); Canva fakti — manba bilan (Guy Kawasaki suhbati, ochib tekshirildi); «KOD» ro'yxati 16 band, REPO 0.
- [x] Karta T · P · S · PM ko'rildi: T-011/PM-107 (hikoya, repetitsiya — misoldan keyin) · T-014/015 (hikoya bir ma'noda, «User Story» ishlatilmadi, «slayd» — varaq emas) · T-039 («pitchingiz» faqat 9-ekrandan keyin; reja «loyihangiz pitchini») ·
  T-042 (ta'rif va bugungi qoida so'zma-so'z) · T-043 (s4 shubhali bandda) · T-047/P-036 (Mentor natijani aytmaydi) · T-064 (s9 xulosasi keyingi ekranni va'da qilmaydi) · P-013 (bugungi asosiy fikr) · P-015 (reja demo matnsiz) ·
  P-025 (uyga vazifa karta) · P-033 · P-046 (s9 slaydlari o'quvchi yozganidan) · P-048 (nishon — ish qilingan ekranda) · P-052/P-057 (s4 solishtirish) · P-062 (son bir marta) · P-064 va 181-qonun (bashorat 2, 4, 6, 8) ·
  S-001 (savollar 7–9 so'z) · S-004/S-010 · S-006 (inkor-savol yo'q) · S-008 (kalit ibora takrorlanmaydi) · S-018 (Canva izohi Mentorda, birinchi ko'rinishda) · S-026 · §140-B (starter 0/3) · §144/145 ·
  PM-005 (2-tur) · PM-018 (odam roli bilan, ismsiz) · PM-027 (yangi uyga vazifa — savol 6) · PM-028/029 (keys yorlig'i, o'z maketi) · PM-082 (kod darvozasi) · PM-108 (s9 tekshiruvi sinaladi) · J-026 (hook maqtovsiz).
- [?] Ochiq: s4 da ikki tomon + ikki yozuv kartasi telefonda (393 px) sig'ishi — vizual bosqichda ko'riladi (U-006).
