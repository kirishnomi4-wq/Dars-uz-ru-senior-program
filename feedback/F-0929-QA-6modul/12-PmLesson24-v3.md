# 6-Modul (LMS: 8-Modul) · 12-dars (PM) «Bugun qaysi ish boshlanadi?» — MD v3

Fayl: `src/6-Modull/PmLesson24.jsx` · 16 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `12-PmLesson24-v2.md` + hozirgi kod (F-1004 PM 2-to'lqini va 32–35 saqlanadi). v3 o'zgargan ekranlarni to'liq yozadi; «kod dagidek» deyilgan joy matni koddan olinadi.
Oldingi dars: 11 «Loyiha kuni: mobil ilova» (GATE M M-q2) · keyingi: 13 «Loyiha kuni: to'liq tizim» (App.jsx `comp:`). Menyu nomi = `lessonTitle` = «Bugun qaysi ish boshlanadi?» (DE-205 ✓).
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: s3 = B, s5 = C, s7 = A, s11 = B (`INLINE_KEYS { s3: 1, s5: 2, s7: 0, s11: 1 }`, `correctIdx` shu); arena kaliti 0,3,2,1 · 1,0,2,3 · 0,2,1,3.
⚠️ `*.homework.jsx` ga tegilmaydi; HwCard matni o'zgarmaydi (PM-027: faqat emoji olinadi). Chiqish kaliti `pm-m6d12-yol` o'zgarmaydi — 14-dars undan `ufq === 'hozir'` qatorini o'qiydi.

---

## A. v3 qoidalari (v2 A-bo'limi o'z kuchida: bosh formula, yumshatilgan bosh qoida, «uch ufq — darsdagi sodda model», ikki savol alohida, bir nom qoidasi)

1. **Avval varaq, keyin nom (PM-107, D6).** «Ufq» so'zi 2-ekranda, o'quvchi varaqda vaqtni o'zi surib ishlar qachon boshlanishini ko'rgandan KEYIN, bir marta nomlanadi.
   0–1-ekranda atama yo'q — faqat aniq vaqtlar: «Hozir · Uch oydan keyin · Olti oydan keyin». «Ko'z yetadigan eng olis joy» metaforasi olindi — vaqt nomlari o'zi tushuntiradi.
2. **Tushuncha-ekran = harakat → varaq o'zgaradi (DE-184).** 2, 4, 9-ekranlar; har birining ostida **Harakat → Vizual o'zgarish** qatori. Ish tugagach harakat paneli yopiladi, varaq fokusga (199).
3. **Bitta vizual — reja varag'i** (pastda). Ufq bo'limlari rangsiz; rang faqat ish holati (D3). Avvalgi 🟢🟡🔵 ufq ranglari olinadi.
4. **Matn o'lchovi (162/164, MK §225):** sarlavha ≤55 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60.
5. **Toza yuza (185, D4):** tugma, variant, natija qatorida emoji yo'q (✅ 🛣 👆 📋 📜 🔮 olinadi). ✓ ✗ → ▶ — belgilar qoladi.
6. **Misol-ip — sartaroshxonaga navbat oladigan ilova** (v2 dagidek). O'quvchi bu ilovani qurmagan, shuning uchun hook «deylik» bilan ochiladi (T-039).
   Bir nom: «sartaroshxona **ilovasi**» («sartaroshxona tizimi» olinadi, T-014). «Navbat» so'zi faqat sartaroshga yozilish ma'nosida (T-015). Arena 1, 3, 4-savoldagi to'garak — P-002 ruxsati (test bandi).
7. **Atamalar (grep, 6-Modul):** ufq (faqat shu dars) · reja · ish · bosqich (faqat Tesla) · «ilovani yaratayotgan odam» (6, 14-dars bilan) · «Kod yozish» · «O'zingiz o'ylab ko'ring». Eyebrow «Reja» ishlatilmaydi — bu darsda «reja» mahsulot rejasi ma'nosida band (T-015), 1-ekran eyebrow'i «Maqsad» qoladi.

---

## Darsning ipi va bitta vizual

- **Hook:** sartaroshxona ilovasining yangi ishlari bitta ro'yxatda → «qaysinisidan boshlaysiz?» → ro'yxatda «Qachon boshlanadi?» ustuni bo'sh: ro'yxat buni aytmaydi.
- **Reja varag'i (`RejaVaraq`, dars bo'yi; bitta manba — `UFQLAR`, 180):** oq varaq, tepada kichik yorliq («Sartaroshxona ilovasi · reja»), ichida uch bo'lim ustma-ust:
  «Hozir» · «Uch oydan keyin» · «Olti oydan keyin». Har bo'limda chapda vaqt nomi, o'ngda ish kartalari, oxirida «N ta ish». Varaqning chap chetida vaqt chizig'i (Bugun → 3 oy → 6 oy).
  Ish kartasi holatlari: kulrang «hali boshlanmagan» · oq + accent chegara «boshlandi» · yashil «tayyor ✓» · qizil chiziq bir lahza «to'xtadi».
  Yangi karta bir lahza ajralib kiradi; `prefers-reduced-motion` da harakat to'xtaydi (DE-200).
- **Qayerda:** 0 (ro'yxat holati) · 1 (o'zi yoziladi) · 2 (vaqt suriladi) · 4 (ishlar tushadi) · 6 (Tesla 2006 varag'i — o'sha komponent, bo'limlar o'rnida 3 bosqich) ·
  8 (o'quvchining o'z varag'i) · 9 (yana oltita ish tushadi) · 10 (terminal — varaqning kod ko'rinishi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Hammasi kerak — qaysinisidan boshlaysiz?** (40)
- Mentor: Sartaroshxonaga navbat oladigan ilova qilyapsiz, deylik. Ro'yxatdagi ishlarni birdan boshlab bo'lmaydi. (103, 2 gap)
- Maket: reja varag'i ro'yxat holatida — «Sartaroshxona ilovasi · yangi ishlar», 6 qator aralash tartibda (4-ekran tartibi ochilmasin):
  Sartaroshga baho qo'yish · Sartarosh ishlaridan surat qo'yish · Ilovada oldindan to'lash · Navbatdan bir soat oldin eslatma · Sartaroshning band kunlarini ko'rsatish · Manzilni sahifada ko'rsatish
- Savol (variantlar ustida): Siz qanday tanlardingiz?
- Variantlar (radio, teng uzunlikda): Eng oson ishdan — natija tez ko'rinadi (38) · Eng foydali ishdan — ko'p odamga kerak (38)
- Javob (ikkalasida bir xil — sof so'rovnoma: «Aynan!/Qiziq fikr!» yo'q, P-016, J-026):
  Ikkalasining ham sababi bor. Lekin ba'zi ish bugun umuman boshlanmaydi — unga kerak narsa hali yo'q. (100)
- **Harakat → Vizual o'zgarish:** variantni tanlash → varaqdagi har qator yonida yangi ustun «Qachon boshlanadi?» ochiladi, kataklarda faqat kulrang «?» — ro'yxat buni aytmaydi.
- MentorNote — kod dagidek.
✎ hook javobi 262 → 100 (162) · «Tizimingizga oltita yangi ish o'ylab topdingiz» → «deylik» (T-039) · eyebrow va Mentor sonni takrorlamaydi — son maketda (P-062) ·
  maket — aniq ishlar ro'yxati (PM-107) · eski 2-ekrandagi «Bitta ro'yxat» kartasining fikri shu yerga ko'chdi (bo'sh «?» ustun)

## 1 · Maqsad  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun har ish qachon boshlanishini yozasiz** (42) — kod dagidek
- Mentor: Ilovaga g'oya ko'p keladi, lekin hammasini bir vaqtda qurib bo'lmaydi. (70)
- Chap yorliq: Dars oxirida o'z tizimingizga shunday varaq yozasiz
- Chap: reja varag'i o'zi yoziladi (kod animatsiyasi saqlanadi), «Uch qatorli reja»:
  Hozir → Sartaroshxona telefon raqamini qo'shish · Uch oydan keyin → Doimiy mijozga tug'ilgan kun tabrigi · Olti oydan keyin → Sartaroshlar uchun alohida kirish
- O'ng yorliq: Bugungi 4 qadam
- Qadamlar (01 · matn · teg):
  - 01 · Oltita ishni bugun boshlab ko'rasiz · `sinov`
  - 02 · Tesla rejasi qanday bajarilganini ko'rasiz · `Tesla`
  - 03 · Yana oltita ishni o'z vaqtiga qo'yasiz · `mashq`
  - 04 · Rejani kod bilan guruhlaysiz · `kod`
- MentorNote — kod dagidek.
✎ PM reja ko'rinishi → QReja (DE-201) · Mentor «Bu — …» bilan boshlanardi (T-029) va chap yorliqni takrorlardi → NEGA · qator matni ot-shaklda («qo'shamiz» → «qo'shish», §224) ·
  🛣 va ✅ olindi (qator belgisi — ✓) · qadamlarda «ufq» yo'q — atama 2-ekranda

## 2 · Vaqt o'tsa, varaq  ← QTushuncha (qayta qurildi; PM-107)
- Eyebrow: Tushuncha · reja varag'i
- Sarlavha: **Vaqt o'tsa, varaqdagi ishlarga nima bo'ladi?** (44)
- Mentor: Vaqtni oldinga suring va har qatordagi ishga qarang. (52)
- Vizual: 1-ekrandagi o'sha varaq (uch qator), chap chetida vaqt chizig'i: ○ Bugun — ○ 3 oy o'tdi — ○ 6 oy o'tdi. Boshida hamma ish kulrang «hali boshlanmagan».
- Harakat paneli: bitta tugma «Vaqtni suring →» (har bosishda belgi bir joy pastga).
- **Harakat → Vizual o'zgarish:** tugmani bosish → vaqt belgisi navbatdagi joyga tushadi, o'sha qatordagi ish yonadi:
  - Bugun → «Hozir» qatori: telefon raqami «boshlandi»; qolgan ikkitasi kulrang;
  - 3 oy o'tdi → telefon raqami «tayyor ✓» (yashil), tabrik «boshlandi»;
  - 6 oy o'tdi → tabrik «tayyor ✓», alohida kirish «boshlandi».
  Har qatorda ish aynan o'z vaqtiga yetganda boshlanadi; tayyor bo'lish payti har xil.
- Bashorat yo'q: har qanday savol 3-ekran testi bilan bir xil bo'lib qolardi.
- Natija (tugadi): panel yopiladi, varaq butun enga; har qator yonida uning boshlanish belgisi (Bugun · 3 oy · 6 oy).
- Xulosa: Varaqdagi uchta vaqt — ufqlar. Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi. (95)
- Qator (xulosadan keyin, QIzoh): Uch va olti oy — mashq uchun tanlangan muddat; real loyihada boshqacha bo'lishi mumkin. (87)
- Tugma (pastki): Vaqtni suring (N/3) → Davom etish
✎ ikki matn-karta («Bitta ro'yxat» / «Uch vaqt bo'lagiga ajratilgan») + 2 abzats (≈330) → varaq + vaqt; atama harakatdan keyin, bitta xulosada (PM-107, DE-184) ·
  ufq metaforasi olindi (T-016) · «hozir · keyinroq · uzoqroq» → aniq vaqt nomlari (bir nom) · ta'rif so'zma-so'z flashcard va yakun bilan bir xil (T-042)

## 3 · 1-savol  ← QTest (✔ B — o'rni o'zgarmaydi)
- Eyebrow: Tekshiruv · ufq nimani aytadi
- Savol: **Ish eng uzoq ufqqa tushdi. Bu nimani bildiradi?** (47)
  - A · Ish bugun boshlanib, olti oy davom etadi (40)
  - B ✔ Ish faqat olti oydan keyin boshlanadi (37)
  - C · Ish bugun boshlanib, olti oyda tugaydi (38)
  - D · Ish rejadan butunlay chiqarib tashlandi (39) — M-q6
- To'g'ri izohi: Ufq ishning uzunligini emas, boshlanish paytini aytadi. (55)
- Xato izohlari:
  - A: Bugun boshlansa, «Hozir»da turardi; ufq uzunlikni aytmaydi. (59)
  - C: Bugun boshlansa, «Hozir»da turardi; ufq tugashni aytmaydi. (58)
  - D: Uzoq ufqdagi ish ham varaqda qoladi — o'chmaydi. (48)
  - (umumiy): Varaqni eslang: ish o'z ufqiga yetganda nima bo'ldi? (52)
✎ savol 56 → 47 (164) · «boshlan-» ildizi faqat to'g'rida edi (§138-C) → uchala variantda · ✔ eng uzun emas (S-006) · xato izohlari 70 → ≤60, to'g'ri javobni aytmaydi (S-010)

## 4 · Har ishni bugun boshlab ko'ring  ← QTushuncha (kashfiyot saqlanadi, varaqqa o'tdi)
- Eyebrow: Sinov · uch ufqli reja
- Sarlavha: **Har ishni bugun boshlab ko'ring.** (32) — kod dagidek
- Mentor: Ish to'xtasa, uning sababini o'qing: nimasi hali yo'q? (54)
- Harakat paneli: «Sartaroshxona ilovasining ishlari» — oltita karta (4-ekran oltiligi, kod `ISHLAR`), har birida «▶ Bugun boshlash».
- Vizual: reja varag'i, uch bo'lim bo'sh.
- **Harakat → Vizual o'zgarish:** «▶ Bugun boshlash» → karta varaqqa uchadi:
  - boshlansa — «Hozir» bo'limiga tushadi, accent chegara «boshlandi»;
  - to'xtasa — «Hozir» oldida bir lahza qizil chiziq bilan to'xtaydi, keyin o'zi kutgan narsa tayyor bo'ladigan bo'limga ko'chadi (kulrang «kutyapti»);
  har bosishda karta ostida bitta fakt-qator; bo'lim oxirida «N ta ish» o'sadi.
- Fakt-qatorlar:
  - surat: Boshlandi — suratlar sartaroshlarning telefonida bor. (53)
  - eslatma: Boshlandi — bot xabar yubora oladi. (35)
  - manzil: Boshlandi — manzillar Database'da yozilgan. (43)
  - baho: To'xtadi — baho uchun avval real navbat kerak, u hali yo'q. (59)
  - kunlar: To'xtadi — band kunlar real navbatlardan chiqadi, ular hali yo'q. (65)
  - to'lash: To'xtadi — ishonch kerak, u baholardan keladi; to'lov ulanishi ham kerak. (73)
- 2-bosqich (6/6 dan keyin; ballsiz tanlov, `QBashorat` shaklida):
  **«Oldindan to'lash»ni «Uch oydan keyin»ga ko'chirsangiz, nima bo'ladi?** (69) — Uch oyda boshlanadi · Baribir to'xtaydi
  - **Harakat → Vizual o'zgarish:** tanlov → karta «Uch oydan keyin» bo'limiga ko'chadi, «3 oy» belgisida qizil chiziq bilan to'xtaydi va «Olti oydan keyin»ga qaytadi (ikkala tanlovda ham).
  - Natija qatori (`QTaxmin`): «Taxminingiz: uch oyda boshlanadi · haqiqatda: baribir to'xtadi» yoki «Taxminingiz to'g'ri chiqdi».
  - Izoh (bitta qator): Uch oyda baholar endi kela boshlaydi — ishonch hali yo'q. (57)
- Natija (tugadi): panel yopiladi, varaq butun enga — Hozir 3 · Uch oydan keyin 2 · Olti oydan keyin 1.
- Xulosa: Ishni ufqqa bizning xohishimiz emas, unga kerak narsaning tayyor bo'lish payti qo'yadi. (87) — yakundagi «Bugungi asosiy fikr» bilan so'zma-so'z bir xil
- Tugma (pastki): ① Har ishni boshlab ko'ring (N/6) → ② Ko'chirish savoliga javob bering → Davom etish
- MentorNote — kod dagidek («sartaroshxona tizimi» → «ilovasi»).
✎ ufq ranglari (`.road/.stop`) → reja varag'i, rang faqat ish holati (D3) · ikki yashil yakun (done-mini + ✅ natija) → `QTaxmin` + bitta xulosa ·
  fakt-qatorlar qisqardi (to'lash 230 → 73; «to'lov ulanishi» sharti saqlandi — v2 audit) · Mentor sarlavhani takrorlamaydi (225) · kashfiyot mexanikasi o'zgarmaydi

## 5 · 2-savol  ← QTest (✔ C — o'rni o'zgarmaydi)
- Eyebrow: Tekshiruv · ish nimani kutadi
- Savol: **«Sartaroshga baho qo'yish» nega bugun boshlanmaydi?** (51)
  - A · Boshqa ishlar undan oldin qilinishi kerak (41)
  - B · Uni kutayotgan odam juda kam bo'lgan (36)
  - C ✔ Unga kerak narsa hali paydo bo'lmagan (37)
  - D · Uni qurishga juda ko'p vaqt ketadi (34) — M-q6
- To'g'ri izohi: Baho uchun real navbatlar kerak — ular hali yo'q. (49)
- Xato izohlari:
  - A: Tartib muhim, lekin baho boshqa ishni kutmayapti. (49)
  - B: Odam soni muhim, lekin u ishni to'xtatmaydi. (44)
  - D: Uzoq ish ham bugun boshlanishi mumkin edi. (42)
  - (umumiy): Ish to'xtaganda chiqqan qatorni eslang: nimasi yo'q edi? (56)
✎ savol 56 → 51 («ishi» olindi) · to'g'ri izohi 2 gap → 1 · xato izohlari 67 → ≤60, to'g'ri javob ifodasini aytmaydi (S-010)

## 6 · Tesla  ← QVoqea (PM keys)
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Uzoq reja qayerdan boshlanadi?** (30)
- Karta yorlig'i: «Tesla · N/6»; sahnada «Tesla» nom-yorlig'i o'z rangida, logotip yo'q (PM-028/029).
- Sahna (186): reja varag'i «2006 · QISQA YOZUV» — 1 Qimmat mashina — oz sonda · 2 Arzonrog'i — ko'proq sonda · 3 Eng arzoni — ko'pchilik uchun.
  Bashorat kadrida keyingi qator yopiq (`pre`), javob sahnada ochilmaydi.
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» → varaqda navbatdagi qator ochiladi va ajraladi; 5–6-kartada oldingi qatordan keyingisiga strelka chiziladi
  (yonida kichik yozuv «pul») — bosqich oldingisiga tayangani ko'rinadi.
- Kartalar:
  1. **2006-yil** — Tesla — elektr avtomobil ishlab chiqaradigan kompaniya. 2006-yilda u uzoq rejasini qisqa, hamma o'qiy oladigan yozuv qilib ochiq e'lon qildi. O'shanda kompaniyaning bironta mashinasi hali sotuvda yo'q edi. — kod dagidek
  2. Bashorat: **Reja qaysi mashinadan boshlangan?** — Arzon, hammabop mashinadan (26) · O'rtacha narxli mashinadan (26) · ✔ Qimmat sport-mashinadan (23)
     → `QTaxmin`: «Taxminingiz: … · haqiqatda: qimmat sport-mashinadan» / «Taxminingiz to'g'ri chiqdi»
  3. **Birinchi bosqich** — Reja qimmat sport-mashinadan boshlandi: u oz sonda chiqarildi, ko'p odam uni sotib ololmasdi.
  4. Bashorat: **Reja bo'yicha keyingi mashina nima bilan qurilishi kerak edi?** — Bankdan olingan qarz puli bilan · ✔ Birinchi mashinadan tushgan pul bilan · Boshqa kompaniyaning yordami bilan → `QTaxmin`
  5. **Ikkinchi bosqich** — Reja shunday edi: birinchi mashinadan tushgan pul keyingisiga sarflanadi. Amalda investorlar puli ham qo'shildi, lekin tartib rejadagidek qoldi: arzonroq mashina chiqdi, uni ko'proq odam ola oldi.
  6. **Uchinchi bosqich** — Keyin undan ham arzon mashina qurildi. Qisqa yozuvdagi reja o'n yildan ortiq bajarildi. (87)
- Xulosa (6-kartadan keyin): Reja bo'yicha har bosqichga oldingisidan tushgan pul kerak edi, shuning uchun ular ketma-ket boshlandi. (99)
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish · bashoratda «Avval o'zingiz belgilang»
- Manba: E. Musk, «The Secret Tesla Motors Master Plan (just between you and me)», Tesla blogi, 2006-08-02 (Roadster 2008 → Model S 2012 → Model 3 2017; 2010 — DOE qarzi).
  Reja matni: «sport-mashina → shu pulga arzonroq mashina → shu pulga undan ham arzon mashina».
✎ eyebrow «Haqiqiy voqea» → «Biznes olamidan», yorliq «Tesla · N/6» (PM-028) · sarlavha «qisqa yozuvga sig'adimi?» (shakl — v2 tahlilida yolg'on model) → boshlanish ·
  1-bashorat bitta o'lchovda — narx, o'sish tartibida (S-015; ballsiz, KOD `ans` 1 → 2) · «Topdingiz!/Adashdingiz» → `QTaxmin` ·
  «hamma sotib oladigan» → «undan ham arzon» (kafolat so'zi; reja matnida «even more affordable») · strelka — 7-savolning javobi sahnada ko'rinadi ·
  ko'prik-gap («ilovani yaratayotgan odam … endi shu reja sizniki») 8-ekran Mentoriga — keyingi ekran test (T-064)

## 7 · 3-savol  ← QTest (✔ A — o'rni o'zgarmaydi)
- Eyebrow: Tekshiruv · uzoq reja
- Savol: **Tesla misolida uzoq rejaning asosiy xususiyati nima?** (52) — kod dagidek
  - A ✔ Har bosqich oldingisiga tayanib boshlanadi (42)
  - B · Hamma bosqich bir vaqtning o'zida boshlanadi (44)
  - C · Reja har oy boshidan to'liq qaytadan yoziladi (45)
  - D · Reja eng arzon mashinadan boshlab yoziladi (42) — M-q6
- To'g'ri izohi: Ikkinchi mashinaga birinchisidan tushgan pul kerak edi. (55)
- Xato izohlari:
  - B: Birdan boshlansa, ikkinchi mashinaga pul qayerdan kelardi? (58)
  - C: Tesla bitta rejani o'n yildan ortiq bajardi. (44)
  - D: Tesla rejasi qimmat sport-mashinadan boshlangan. (48)
  - (umumiy): Varaqdagi qatorlar qanday ochildi — birdanmi, birin-ketinmi? (60)
✎ ✔ eng uzun edi (50 vs 37) → tenglashdi (S-006) · to'g'ri izohi 2 gap → 1 («ochiq e'lon» qo'shimchasi olindi — arena 11-savolida qoladi) · xato izohlari 85 → ≤60

## 8 · Rejangizga uch ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Uch ufqqa uchta ish yozing.** (27) — kod dagidek
- Mentor: Rejani kod emas, ilovani yaratayotgan odam tuzadi — bugun bu siz. Har ishga savol bering: buni bugun boshlab bo'ladimi? (119, 2 gap)
- (6-darsdan saqlangan bo'lsa, bitta kulrang qator — kod dagidek): 6-darsdagi chegaralaringiz: … Rejangiz ularni buzmasin.
- Chiplar 1/2/3: Hozir · Uch oydan keyin · Olti oydan keyin
- Forma: bitta maydon, sarlavhasi — joriy ufq; placeholder: «Bugun qaysi ish boshlanadi?» · «Uch oydan keyin qaysi ish boshlanadi?» · «Olti oydan keyin qaysi ish boshlanadi?» · «Saqlash» o'ngda
- Javob-qatorlari (bloklamaydi, yo'naltiradi):
  - takror: Bu ish rejangizda bor — boshqa ish yozing. (42)
  - bo'sh so'z: Bu hali ish emas. Tizimingiz nima qilishini yozing. (51)
  - «Hozir»da kutadigan ish: Bu ishga hali yo'q narsa kerak — uni keyingi ufqqa yozing. (58)
  - uchalasi bugun: Uchalasi bugun boshlanadi — kutadigan bitta ish toping. (55)
  - qisqa: Qisqa qoldi: ish nomini to'liq yozing. (38)
- Yordam (yopiq) — kod dagidek: O'zingizga ikki savol bering: buni bugun boshlab bo'ladimi? Bo'lmasa, nimasi hali yo'q? Ikkinchi savolning javobi ufqni o'zi ko'rsatadi.
- Natija (3/3): forma yopiladi, o'quvchining reja varag'i fokusga — 1-ekrandagi shaklda «Rejangiz», har qatorda ✎.
- Xulosa: Rejangiz saqlandi: har ish o'z ufqida turibdi. (46)
- Tugma (pastki): ① «Hozir» ufqiga bitta ish yozing → ② Yana N ufq qoldi → Davom etish
✎ eyebrow sonsiz (§223) · ko'prik-gap 6-ekrandan Mentorga (T-064) · Mentorning ikkinchi yarmi («nima kerak va qachon tayyor») Yordamda bor — takror olindi ·
  «yuqorida allaqachon yozilgan» → «rejangizda bor» (yozish paytida ro'yxat ko'rinmaydi, §211) · javob-qatorlari 95–130 → ≤60 · «✓ Yozildi» qatori olindi (varaq o'zi ko'rsatadi, T-047) ·
  natija — o'quvchining varag'i (bitta vizual)

## 9 · Yana oltita ish  ← QTushuncha (harakat saqlanadi; o'ng ustun → varaq)
- Eyebrow: Mashq
- Sarlavha: **Har ishni o'z ufqiga qo'ying.** (29) — kod dagidek
- Mentor: Har javobdan keyin sabab ochiladi — aynan u to'g'ri qo'yishni o'rgatadi. (72)
- Sahna qatori (QIzoh): Sartaroshxona ilovasi ishlayotganiga bir necha oy bo'ldi: har kuni navbat olinyapti, birinchi baholar endi kelyapti. (116)
- Harakat paneli: joriy ish kartasi «N / 6» + uch tugma: Hozir · Uch oydan keyin · Olti oydan keyin. Vizual: reja varag'i, uch bo'lim.
- **Harakat → Vizual o'zgarish:** ufq tugmasini bosish → karta varaqning tanlangan bo'limiga uchadi; noto'g'ri bo'lsa bo'lim bir lahza qizil chegara oladi va karta o'z bo'limiga ko'chadi;
  karta ostida sabab-qatori ochiladi; bo'limdagi «N ta ish» o'sadi. (Eski o'ng ustundagi «Oltita ish» ro'yxati o'rniga.)
- Javob qatori: to'g'ri — Shu ufqda turadi. · uzoqroq tanlansa — Bu ish kutmaydi — unga kerak narsa allaqachon bor. (50) · yaqinroq — Buni hali boshlab bo'lmaydi — nimasi yetishmayapti? (51)
- Sabab-qatorlari:
  - Ismi bo'yicha sartarosh qidirish — Sartaroshlarning ismi Database'da allaqachon yozilgan. (M-q0)
  - Navbatni bekor qilish tugmasi — Navbatlar tushib turibdi — bekor qilishni bugun qo'shsa bo'ladi. (kod)
  - Ilovada tungi ko'rinish — Ilova ishlab turibdi — ranglarni bugun o'zgartirsa bo'ladi. (kod)
  - Uchinchi tashrifga chegirma — Ko'pchilik hozircha bir-ikki marta kelgan — uchinchi tashrif hali yo'q. (71)
  - Sartaroshlar ro'yxati — kim ko'p maqtalgan — Ro'yxat baholardan tuziladi — baholar hali oz. (46)
  - Boshqa shaharga ochish — Avval bitta shaharda sartaroshlar yetarli bo'lishi kerak. (57)
- Karta tugmasi (o'ngda): Keyingi ish → · oxirgisida: Rejani ko'rish
- Yordam — birinchi xatodan keyin, kod dagidek.
- Natija (tugadi): panel yopiladi, varaq butun enga — Hozir 3 · Uch oydan keyin 2 · Olti oydan keyin 1.
- Xulosa: Bu rejada eng ko'p ish — «Hozir»da: ularga kerak narsa allaqachon bor. (70)
✎ o'ng ustundagi ro'yxat → reja varag'i, karta bo'limga uchadi (DE-184) · Mentor 2 gap/200 → 1 gap/72 · «yangi oltita ish turibdi» olindi (P-062) ·
  sabab-qatorlari 100 → ≤71 · xulosa «reja odatda shunday ko'rinadi» → «bu rejada» (T-043; F-0929-23 qisman) · eyebrow «Tekshiruv» → «Mashq» (ballik testlar bilan aralashmasin, T-015)

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish · VS Code
- Sarlavha: **Rejani ufqlarga ajratadigan kod yozamiz.** (40) — kod dagidek
- 1-bosqich (darvoza-savol, ballsiz) — Mentor: Avval bitta savol — keyin kod yoziladi.
  - Savol: Kod `reja[3].ufq` ni chiqarsa, terminalda nima ko'rinadi?
  - To'rtinchi ishning nomi (23) · ✔ To'rtinchi ishning ufqi (23) · Rejadagi ufqlar soni (20)
  - Xato bosilsa (silkinadi + qator): Nuqtadan keyin yozilgan maydonning qiymati chiqadi. (51)
- 2-bosqich — Mentor: Qo'lingiz bilan ufqqa qo'ygan ishlarni endi kod xuddi shunday guruhlaydi.
  - Chap: «Kod nima chiqarsin» — 1 Uch ufq sarlavhasi chiqadi · 2 Har sarlavha ostida o'z ishlari · 3 Ish boshqa sarlavha ostiga tushmaydi · Yordam (yopiq: Eslatma + Uch qadam — kod dagidek) · «Bajardim — uch sarlavha chiqdi» o'ngda
  - O'ng: `reja.js` muharriri (kod `KD_CODE`; birinchi izoh qatori: `// reja.js — sartaroshxona ilovasining uch ufqli rejasi`), ostida terminal.
  - Terminal paneli «Kutilgan natija» (boshidan xira — 12-q1 A):
    ```
    $ node reja.js
    == hozir ==
       - Sartarosh suratlari
       - Eslatma xabari
       - Manzilni ko'rsatish
    == uch-oy ==
       - Sartaroshga baho qo'yish
       - Band kunlar
    == olti-oy ==
       - Oldindan to'lash
    ```
- **Harakat → Vizual o'zgarish:** «Bajardim» → terminaldagi kutilgan natija xiradan to'liq rangga o'tadi, uch sarlavha ketma-ket bir lahza ajraladi — bu 4-ekrandagi varaqning kod ko'rinishi.
✎ kutilgan natija qo'shildi — aniq maqsad (PM-107, QA «aniqroq kodlar») · darvoza variantlari «ishning ish nomi» → «ishning nomi» · xato qatori 85 → 51 ·
  F-1004-35 (ikki ustun bir balandlikda, Eslatma Yordam ichida, «Bajardim» o'ngda) saqlanadi

## 11 · 4-savol (yakuniy)  ← QTest (✔ B — o'rni o'zgarmaydi)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Ishni qaysi ufqqa qo'yishni nima hal qiladi?** (44) — kod dagidek
  - A · Ishga qancha vaqt kerak bo'lishi (32)
  - B ✔ Kerak narsa qachon tayyor bo'lishi (34)
  - C · Ishni qancha odam so'rab turgani (32)
  - D · Ishni ro'yxatga qachon yozganimiz (33) — M-q6
- To'g'ri izohi: Ufqni kerak narsaning tayyor bo'lish payti belgilaydi, xohishimiz emas. (71)
- Xato izohlari:
  - A: Ish uzun bo'lishi mumkin, lekin u ufqni tanlamaydi. (51)
  - C: Odam soni bitta ufq ichidagi tartibni aytadi. (45)
  - D: Ro'yxatga oldin yozilgani ufqni tanlamaydi. (43)
  - (umumiy): Varaqdagi to'xtagan ishlarni eslang: ularga nima yetishmadi? (60)
✎ «kerak» faqat to'g'rida edi va ✔ eng uzun edi (38 vs 25) → tenglashdi (§138-C, S-006) · to'g'ri izohi 115 → 71 · xato izohlari 75–110 → ≤60

## 12 · O'zingiz o'ylab ko'ring  ← QMustaqil (2 qadam)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Uch qatoringizni yoddan ayta olasizmi?** (38) — kod dagidek
- Mentor: Ekranga qaramasdan javob bering: olti oydagi ishingizga nima kerak va u qachon tayyor bo'ladi? — kod dagidek
- 1-qadam: Ovoz chiqarib o'zingizga ayting (jonlida: Sherigingizga ayting) + taymer 30 s / 1 daqiqa — kod dagidek
- 2-qadam: Endi shu javobni bir qatorda yozing · placeholder «Olti oydagi ishimga ... kerak, u ... tayyor bo'ladi»
- Xulosa (yozgach): Ishni qachon boshlash mumkinligini unga kerak narsalar va shartlar belgilaydi. (78)
✎ eyebrow «· 2 qadam» olindi — qadam raqamlari ekranda (P-062) · xulosa oldidagi «Bugungi qoida:» olindi (yakundagi «Endi siz bilasiz» bilan so'zma-so'z bir xil, T-042)

## 13 · Natijalar  ← QNatija — kod dagidek (F-1004-21, bitta karta)

## 14 · Takrorlash  ← QKartochka (10 karta)
- Sarlavha: **O'zingizni sinab ko'ring.** — kod dagidek

| Old tomon | Orqa |
|---|---|
| Ufq nima? | Ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi |
| Bugungi darsda nechta ufq bilan ishladik? | Uchta: hozir · uch oydan keyin · olti oydan keyin (mashq uchun tanlangan muddatlar) |
| Ishni ufqqa nima qo'yadi? | Unga kerak narsa qachon tayyor bo'lishi |
| Ish qachon boshlanadi? | Unga kerak narsa va shartlar tayyor bo'lganda; hech narsa kutmasa — bugunoq |
| «Olti oydan keyin» ufqi nimani bildiradi? | Ish olti oydan keyin boshlanadi — olti oy davom etmaydi |
| Sartaroshxona rejasida qaysi ufqda ish ko'p bo'ldi? | «Hozir»da — ularga kerak narsa allaqachon bor edi |
| «Hozir» ufqiga qanday ish yoziladi? | Bugun boshlanadigani — hech narsa kutmaydigani |
| Tesla rejasi qaysi mashinadan boshlangan? | Oz sonda chiqarilgan qimmat sport-mashinadan (2006) |
| Tesla rejasida har bosqichga nima kerak edi? | Oldingi mashinadan tushgan pul |
| Nechta odam so'ragani nimani aytadi? | Bitta ufq ichida qaysi ish oldin qilinishini |

✎ 6-karta «Odatda eng yaqinida» (umumiy qonun) → «Sartaroshxona rejasida» (T-043) · 9-karta «bosqichlar qanday joylashgan» (7-savol javobini takrorlardi) → bosqichga nima kerak edi

## 15 · Yakun  ← QYakun (PM: HwCard)
- Chiplar: Dars tugadi · N/4 to'g'ri
- Sarlavha: **Endi har ish qachon boshlanishini ayta olasiz.** (46)
- Bugungi asosiy fikr — Ishni ufqqa bizning xohishimiz emas, unga kerak narsaning tayyor bo'lish payti qo'yadi. — kod dagidek
- Endi siz bilasiz:
  - Ufq — ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi; bugun uch ufq bilan ishladik.
  - Ishni qachon boshlash mumkinligini unga kerak narsalar va shartlar belgilaydi.
  - Uzoq rejada har bosqich oldingisiga tayanadi — Tesla rejasi shunday bajarildi.
  - Rejani kod emas, ilovani yaratayotgan odam tuzadi.
- CODE STRIKE + arena — kod dagidek (platforma standarti, 192).
- Uyga vazifa — HwCard matni o'zgarmaydi; 📝 🗂 👆 olinadi (PM-027).
- Keyingi dars — «Loyiha kuni: to'liq tizim». Web, mobil, bot, Backend va Database'ni bitta ishlaydigan tizimga ulaysiz. (M-q0: «baza» → «Database»)
- Fon so'zlari (uz; kod bosqichida {uz, ru}, R-008):
  - Arena (`QZ_BG_SHAPES`): ufq · reja · ish · muddat · boshlanadi · kerak · hozir · bosqich · varaq + 🟢 🔵 (o'yin qatlami); 🛣 → «varaq» («yo'l» izi).
  - Uyga vazifa banneri (`HW_TOKENS`): ufq · reja · ish · muddat · boshlanadi — «yo'l», 🟢, 🔵 olinadi (pilot naqshi, D4).
✎ sarlavha qo'l harakatini («yozdingiz») emas, ko'nikmani nomlaydi (T-049), 1-ekran va'dasiga javob · «— ya'ni siz» shiori olindi (T-042) · Tesla bandi qo'shildi (3–5 band)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomlar o'zgarmaydi (inglizcha). Faqat Road Builder! tavsifi: «Uch ufqli rejani oxirigacha yurdingiz» («yo'l» izi) → «Oltita ishni sinab, rejani to'ldirdingiz».
Plan Writer! (8) · Horizon Master! (9) · Code Planner! (10) — kod dagidek.

**Qisqa takrorlash oynalari** (3 karta; PM darsida belgi o'rniga raqam 1/2/3 — S-026):
1. (3) **Ufq ishning boshlanish paytini aytadi** — 1 Ufq nima: Ishlar qachon boshlanishiga qarab ajratilgan vaqt bo'lagi. Bugungi darsda uch ufq: hozir · uch oydan keyin · olti oydan keyin (mashq uchun tanlangan muddatlar). ·
   2 Uzunlik emas, boshlanish — kod dagidek · 3 Savolni ishga bering — kod dagidek · Sinfga savol: Rejangizdagi qaysi ish bugun boshlanadi?
2. (5) sarlavha «Ish kutgan narsasini kutadi» (tavtologiya) → **Ish kerak narsasi tayyor bo'lganda boshlanadi** · 3 karta — kod dagidek · Sinfga savol — kod dagidek
3. (7) **Uzoq reja — ketma-ket bosqichlar** — 1 Tesla misolida — kod dagidek · 2 Har bosqich oldingisini kutdi — kod dagidek ·
   3 «Reja yashirin qog'oz emas» (darsda o'rgatilmagan da'vo) → **Bosqichga nima kerak edi:** Oldingi mashinadan tushgan pul — reja shunday yozilgan edi. · Sinfga savol — kod dagidek
4. (11) 1–2 — kod dagidek · 3 «Rejaning shakli … reja shunday ko'rinadi» → **Bugungi rejada:** «Hozir»da ish ko'p edi — ularga kerak narsa allaqachon bor edi. (T-043)

**Jonli viktorina — o'zgargan savollar (✔ o'rni o'zgarmaydi):**
- 8. «Uch ufqli reja odatda qanday ko'rinadi?» → **Sartaroshxona rejasida ish qayerda ko'p bo'ldi?** — variantlar kod dagidek (✔ D «Yaqinida ish ko'p, uzog'ida oz») — T-043
- 9. ✔ A «Eng tez boshlanadigani — u keyingisiga yo'l ochadi» → **Eng yaqini — keyingisi unga tayanadi** (36); qolgan uchta kod dagidek (38/38/39) — «yo'l» izi va Tesla bilan noaniq bog'lanish olindi
- Qolgan 10 savol — kod dagidek (v2 tahriri bilan).

---

## B. Kod bosqichida (KOD)

1. **`RejaVaraq`** — bitta komponent (163/180): bo'limlar `UFQLAR` dan (0, 1, 2, 4, 8, 9-ekran), Tesla qatorlari `REJA_QATOR` dan (6-ekran); ish holatlari kulrang · boshlandi · tayyor · to'xtadi;
   vaqt chizig'i; `.road/.stop/.s1demo/.dfc` va ufq ranglari (hozir/uch-oy/olti-oy) olinadi (D3); `// qolip-maket:` e'loni; `zoom` (⛶, q17).
2. **s0** `QKirish` (DE-201): maket — varaq ro'yxat holati (aralash tartib), tanlovdan keyin «Qachon boshlanadi?» ustuni; javob bitta (100), «Aynan!» yo'q.
3. **s1** `QReja`: chap `RejaVaraq` demo, o'ng 4 qadam «01 · matn · teg»; `DEMO_QATOR` ot-shaklda.
4. **s2** yangi `QTushuncha`: vaqt 3 joy, `tugadi` (q18), `zoom`; `S2_CARDS` olinadi; `SCREEN_INTENTS.s2` yangilanadi.
5. **s4** `QTushuncha`: karta varaqqa uchadi; ko'chirish → `QBashorat` + `QTaxmin` + bitta `QXulosa`; `ISHLAR.fakt` qisqa matn; `KOCH_OPTS.res` dagi ✅ olinadi; `YOL_KEY` saqlanadi.
6. **s6** `QVoqea`: eyebrow, «Tesla · N/6», nom-yorlig'i; varaqda strelka 1→2, 2→3; 1-bashorat variantlari va `ans` 1 → 2 (ballsiz); hit/miss → `QTaxmin`; ko'prik-gap olinadi; `REJA_QATOR[2]` «Eng arzoni — ko'pchilik uchun».
7. **s8** `QMustaqil`: eyebrow, Mentor, javob-qatorlari, «✓ Yozildi» olinadi, natija `RejaVaraq` (o'quvchining); `OUT_KEY` shakli o'zgarmaydi (14-dars o'qiydi).
8. **s9** `QTushuncha`: o'ng `wsp-task` → `RejaVaraq`; `ISHLAR9.sabab` (3 ta); xulosa; `tugadi`.
9. **s10** `QKod`: terminal «Kutilgan natija» bloki; `GATE_OPTS` matni; `cmt-tip`; `KD_CODE` birinchi izoh qatori (uz + ru).
10. **Testlar s3/s5/s7/s11** → `QTest` (DE-203, q20): variant matnlari (indeks o'zgarmaydi), `explainCorrect`, `explainWrong`.
11. **s12** eyebrow; xulosa oldidagi «Bugungi qoida:» olinadi.
12. **s14** `QKartochka` (DE-204): 6- va 9-karta. **s15** `QYakun`: sarlavha, 4 band; HwCard 📝 🗂 👆 (PM-027).
13. **RECAPS** — belgi → raqam (S-026); 5-sarlavha, 7-3 va 11-3 matni.
14. **Arena** 8, 9-savol matni; `QZ_BG_SHAPES` 🛣 → «varaq»; `HW_TOKENS` «yo'l», 🟢, 🔵 → «muddat» ({uz, ru}, R-008).
15. `ACHIEVEMENTS.roadBuilder.desc`.
16. «sartaroshxona tizimi» → «sartaroshxona ilovasi» (s4 laganchasi, s9 sahnasi, MentorNote'lar, `KD_CODE`); s10 MentorNote «s4 va s9 dagi ish» → «sinov va mashqdagi ish» (ichki kod).
17. `SCREEN_INTENTS` — s0, s2, s4, s6, s9, s10 yangi mazmunga.
18. **App.jsx `sub`** (m6-12): «uch ufq: hozir, …» → «hozir, uch oydan keyin, olti oydan keyin» — atama menyuda darsdan oldin turmasin (PM-107). Foydalanuvchi qarori (pastda S1).

REPO: yo'q (PM darsi).

Darvozalar (kod bosqichida): `npm run gates -- src/6-Modull/PmLesson24.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip-rejim 0 · `lint-qolip` q13–q21 · `lint:jsx` · surat 1280 + 393 (0, 2, 4, 6, 9, 10, 15).

---

## Foydalanuvchi qarori kerak — hal qilindi: A (GATE M, 05.10)

- **S1** (hal qilindi: A — asosiy seans App.jsx da) App.jsx menyu osti yozuvi «uch ufq: …» — atama darsdan oldin ko'rinadi (PM-107). A — «hozir, uch oydan keyin, olti oydan keyin» · B — qoladi. Tavsiya: A.
- **S2** (hal qilindi: A — boshidan xira) 10-ekran: kutilgan terminal natijasi boshidanoq xira ko'rinsinmi (A) yoki faqat «Bajardim»dan keyin (B)? Tavsiya: A — o'quvchi nimaga intilishini ko'radi, kodni bermaydi.

---

## GATE M — o'z tekshiruvim

- [✓] Oldingi/keyingi dars va menyu nomi — App.jsx bilan mos (11 → 12 → 13; `lessonTitle` = menyu nomi; yakunda «Keyingi dars — «Loyiha kuni: to'liq tizim»») (205)
- [✓] Bitta misol-ip (sartaroshxona ilovasi; arena to'garagi — P-002) · metafora yo'q (ufq metaforasi olindi) · bitta vizual dars bo'yi — reja varag'i (0–10-ekran)
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 9 (+ 0 hook, 6 voqea, 10 kod) — matn-karta yo'q (eski 2-ekran kartalari olindi)
- [✓] Sarlavha ≤55 (27–52; test savollari 44–52) · Mentor ≤2 gap, sarlavhani takrorlamaydi ·
      xulosa ≤110 (46–99) · hook javobi 100 · xato izohi ≤60 (44–60)
- [✓] Atamalar oldingi darslar bilan bir xil («ilovani yaratayotgan odam», «Kod yozish», «O'zingiz o'ylab ko'ring») · siz-forma · qator/teg ot-shaklda (§224) · «navbat» bitta ma'noda
- [✓] Testlar: uzunlik teng (farq ≤3), kalit ildiz («boshlan-», «kerak») faqat to'g'rida emas · ✔ o'rni o'zgarmagan (B · C · A · B; `INLINE_KEYS` bilan tekshirildi) ·
      4 variant (GATE M M-q6 A: D oxiriga, ✔ o'rni va jonli statistika o'zgarmaydi)
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — 11-ekran testi)
- [✓] Emoji yo'q (tugma/variant/natija; o'yin qatlami — arena, nishon, podium — mustasno) · kafolat so'zlari olindi («hamma sotib oladigan», «— ya'ni siz»)
- [✓] Ichki kodlar yo'q (o'quvchi matnida «s4», «4-ekran» yo'q — MentorNote'dagi «s4 va s9» KOD bosqichida «sinov va mashq»ga) · Tesla — manba bilan · «KOD» ro'yxati 18 band
- [✓] Karta: T (T-011/014/015/016/029/039/042/043/047/048/049/064) · P (P-001/002/010/015/016/036/052/055/062/064/067) · S (S-001/004/006/008/010/015/018/025/026) ·
      PM (PM-017/020/027/030 = PM-107; PM-028/029 keys) — ko'rildi. Ochiq: S-015 4-bashorat (pul manbai — daraja emas, turkum) — v2 dagidek qoldirildi.

---

## GATE M javobi qo'llandi (05.10)

- M-q0 · «baza» → «Database»: 4-ekran «manzil» fakt-qatori, 9-ekran «qidirish» sabab-qatori, yakundagi «Keyingi dars» qatori.
- M-q1 · «chegara» — 8-ekrandagi «6-darsdagi chegaralaringiz» qatori allaqachon shu so'z bilan, o'zgarish yo'q.
- M-q2 · 11-dars nomi «Loyiha kuni: mobil ilova» (sarlavhadagi «Oldingi dars» qatori); darsning o'zida 11-dars tilga olinmaydi.
- M-q6 · 4 ta PM testiga (3, 5, 7, 11-ekran) D varianti oxiriga qo'shildi, uzunligi boshqalar bilan teng (34–42), xato izohi bilan; ✔ o'rni (B · C · A · B) va `INLINE_KEYS` o'zgarmaydi.
- M-q3/q4/q5/q7/q8/q9/q10 · PM darsi — repo, amaliyot bloki, uyga vazifa olinishi va teglar tegishli emas (HwCard qoladi).
- 12-q0 A · App.jsx `sub` «hozir, uch oydan keyin, olti oydan keyin» — asosiy seans; darsning o'zida 0–1-ekranda «ufq» atamasi yo'q (A-qoida 1).
- 12-q1 A · 10-ekran «Kutilgan natija» terminali boshidan xira, «Bajardim»dan keyin to'liq rangga o'tadi.

