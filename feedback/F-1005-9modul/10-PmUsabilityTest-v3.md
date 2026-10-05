# 9-Modul · 10-dars (PM) «Odam ilovangizda qayerda to'xtab qoladi?» — MD v3

Fayl: `src/7-Modull/PmUsabilityTestLesson.jsx` · kalit `m7-10` · 16 ekran (yangi dars — hamma ekran noldan) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi.
⚠️ Ballik testlar va to'g'ri javob o'rni: s3 = 2-variant (`correctIdx 1`), s5 = 4 (`3`), s7 = 1 (`0`), s11 = 3 (`2`) — `INLINE_KEYS` shu bilan quriladi; arena ✔ — A/B/C/D har biri 3 marta.
Oldingi dars: m7-09 «Loyiha kuni: MVP tayyor» · keyingi: m7-11 «Loyiha kuni: sinovdan keyingi tuzatish» (App.jsx 317-qator: menyu nomi = dars nomi, `sub` «sinov: tushuntirmang, kuzating»).
Tur (PM-005): **2-tur, sof PM** — artefakt yozma: sinov vazifasi + kuzatuv yozuvi; o'quvchi o'z artefaktini yozadi (s8, s12). Kod ekrani (s10) — PM tartibidagi koding (P-011), repo'ga tegmaydi.

---

Tashqi audit (ChatGPT) Filtri: `10-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi

1. **Bosh qoida (ta'rif dars bo'yi so'zma-so'z bir xil, T-042):** «Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.»
   Ekranlarda bo'laklab ochiladi: s2 — kuzatish va yozish · s4 — yordam bermaslik · s6/s7 — vazifa · s11 — to'rttasi birga.
2. **Atamalar (bir ma'no — bir so'z, tayanch 2-bo'lim):**

| So'z | Ma'nosi (darsdagi ta'rif) | Ishlatilmaydi |
|---|---|---|
| **sinov** | real odam saytni o'zi ishlatadi, siz kuzatasiz | «usability test» — faqat 1-kartochka izohida, bir marta · «test qilish», «sinab ko'rish» (sinov ma'nosida) |
| **sinov vazifasi** | odamga beriladigan bitta gap: u nimaga erishsin («Shanba kuni soat 18:00 ga maydon band qiling.») | topshiriq, ssenariy |
| **to'xtash** · to'xtadi | odam keyingi qadamni topishda qiynalgan joy: jim qolishi, uzoq qidirishi yoki noto'g'ri joyni bosishi mumkin (audit 1) | qotib qoldi, adashdi (sarlavhada) |
| **kuzatuv yozuvi** | sinovda odam nima qilgani va qayerda to'xtagani — vaqti bilan | varaq, hisobot, protokol |
| **muammo** | to'xtashning ortidagi sabab (s9 da yozuvdan chiqariladi) | bug, nuqson |
| intervyu · yozuv | 2-darsdagidek: bitta odam bilan suhbat; yozuv — shablonga yozilgani | suhbat varag'i |
| sayt · vaqt katagi · band qilish · o'yinchi · maydon egasi | tayanchdagidek | ilova (faqat dars nomida — App.jsx), slot, bron, mijoz, admin |

   - «Maydon» — faqat futbol maydoni va mahsulot nomi. Forma qatorlari «ism va telefon yoziladigan joy» deyiladi — **«maydon» so'zi forma ma'nosida ishlatilmaydi** (T-015).
   - «Taxmin» — faqat ballsiz bashorat (`QTaxmin`); test izohlarida «fikringiz», «xulosangiz».
3. **Avval misol, keyin atama (PM-030):** s2 da o'quvchi o'yinchini kuzatib, uchta to'xtashni o'zi yozadi — shundan keyin varaq «Kuzatuv yozuvi», sahna «Sinov» nomini oladi.
4. **Fakt va muammo ajratiladi:** yozuvga — ko'rilgan harakat (s2, s3, s12); muammo — yozuvdan keyin (s9). 2-darsdagi «eshitgan javob — u aytganidek» qoidasining sinovdagi juftligi: «ko'rgan harakat — u qilganidek».
5. **O'tilgan darslarga ko'priklar (takror, yangi mavzu emas):**
   - 2-dars intervyu (bo'lib o'tgan ishni so'rash) → bugun so'ramaysiz, kuzatasiz (s2 Mentor, 2-kartochka, arena 2).
   - AvtoPizza botida «qayerda to'xtab qoldingiz?» deb so'ragansiz (m5-09) → bugun to'xtashni o'zingiz ko'rasiz (s2 O'qituvchi eslatmasi).
   - AvtoStoyanka (m4-14): o'z ishingizdagi kamchilikni o'zingiz ko'rmaysiz → s1 Mentor (nega boshqa odam kerak).
   - 9-dars: MVP tayyor va deploy qilingan → bugun uni birinchi marta boshqa odam ishlatadi.
6. **Toza yuza (185):** tugma, variant, karta, yorliq, recap'da emoji yo'q. Belgilar ✓ ✗ → ‹ › — ruxsat. O'yin qatlami (arena, nishon, podium) — mustasno.
7. **Keys — haqiqiy voqea, manba bilan (s6):** «300 million dollarlik tugma» — Jared M. Spool, «The $300 Million Button», 14.01.2009,
   https://articles.centercentre.com/three_hund_million_button/ (05.10.2026 ochib tekshirildi: forma «Email Address, Password, Login, Register, Forgot Password»;
   sinovda odamlarga xarid ro'yxati va pul berilgan, vazifa — xaridni oxiriga yetkazish; yangi xaridorlar ro'yxatdan o'tishni xohlamagan, iqtibos
   «I'm not here to enter into a relationship. I just want to buy something.»; oldin kelganlarning ko'pi parolni eslay olmagan; tuzatish — «Register» o'rniga «Continue» va
   «You do not need to create an account to make purchases on our site.»; natija — xaridorlar 45% ko'paygan, birinchi oy +15 mln $, birinchi yil +300 mln $). Magazin nomi maqolada aytilmagan.

## Darsning ipi va bitta vizual

- **Ip:** 9-darsda tayyor bo'lgan «Maydon» (repo `maydon`, teg `dars-09-done`) birinchi marta boshqa odam qo'lida. Mentor sinov o'tkazgan — bitta o'yinchi, bitta vazifa:
  **«Shanba kuni soat 18:00 ga maydon band qiling.»** O'quvchi shu sinovni kuzatadi (s2) → yordam bersa nima bo'lishini ko'radi (s4) → yozuvdan uch muammo chiqarib, birinchi
  tuzatiladiganini o'zi tanlaydi (s9; 11-dars shu tanlov bilan boshlanadi) → o'z saytiga vazifa yozadi (s8) → sinfdoshi bilan juftlikda sinov o'tkazadi (s12) → uyda real odam bilan (uyga vazifa).
- **Mentor sinovi — bitta manba (`SINOV`, 180):** s0, s2, s4, s9, s10 shundan o'qiydi. Vaqtlar sinov boshidan (m:ss):

| Vaqt | O'yinchi nima qildi | Telefonda | To'xtash? |
|---|---|---|---|
| 0:00 | Saytni ochdi | «‹ Bugun ›» (kichik strelkalar), 16:00–21:00 kataklari | — |
| 0:00–0:25 | Bugungi kataklarni tepaga-pastga surib, shanbani qidirdi | barmoq halqasi kataklar ustida aylanadi | **ha** (25 s) |
| 0:25 | «›» ni bosib, shanbaga o'tdi | sarlavha «‹ Shanba ›» | — |
| 0:29 | 18:00 katagini bosdi | ostida ism va telefon yoziladigan joy ochiladi | — |
| 0:41 | Ism va telefonni yozdi | «Band qilish» tugmasi forma ostida — telefon ekranidan pastda, ko'rinmaydi | — |
| 0:41–1:43 | Tugmani qidirdi. 1:10 da so'radi: «Qanday yuboriladi?» Mentor: «O'zingiz qanday deb o'ylaysiz?» 1:43 da ekranni tasodifan surib, tugmani ko'rdi va bosdi | halqa forma ustida aylanadi; 1:43 da ekran suriladi | **ha** (62 s) |
| 1:43–2:01 | «Band qilindi» belgisi chiqib, yo'qoldi; 18 soniya qarab turdi, katakni yana bosdi: «Bo'ldimi?» | katak rangi o'zgaradi, belgi chiqib ketadi | **ha** (18 s) |

  Yozuvdan chiqadigan uch muammo (tayanch 3-bo'lim oxiri — **aynan shu uchtasi**, s9): kunni almashtirishni sezmadi · «Band qilish» tugmasini topa olmadi — u forma ostida,
  ko'rinmaydi · band bo'lgandan keyin nima bo'lganini tushunmadi. Birinchi tuzatiladigani (11-dars, `dars-11-done`) — **tugma**: usiz vazifa bajarilmaydi.
- **Bitta vizual — Sinov sahnasi (`SinovSahna`, dars bo'yi):** chapda telefon ramkasi (191) — «Maydon» sayti; ustida o'yinchining **barmoq halqasi** (CSS doira, emoji emas) va tepada
  **vaqt hisoblagichi** (m:ss). O'ngda **yozuv** — oq karta: tepada «Vazifa: «…»», ostida qatorlar «vaqt · nima qildi».
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — skelet) → yozildi (bir lahza ajralib kiradi) → to'xtash (accent chegara, o'ngda yorliq «to'xtadi») →
    yozilmadi (kulrang, chizilgan — s4) → birinchi (yorliq «Birinchi» — s9, s12) → xato (`err` fon — s8, s12 tekshiruvi).
  - Halqa holatlari: harakatda — joydan joyga silliq o'tadi · to'xtashda — bir joyda sokin aylanadi, hisoblagich accent rangda · pufaklar: o'yinchi (chapda), siz (o'ngda).
  - Ishlatiladi: 0 · 1 · 2 · 4 · 8 · 9 · 12. s6 — o'z keys-maketi (`FormaMaket`, PM-029). Hammasi `prefers-reduced-motion` da o'tishsiz.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · birinchi odam
- Sarlavha: **Sinfdoshingiz «Maydon»da to'xtab qoldi. Nima qilasiz?** (53)
- Mentor: O'tgan darsda «Maydon» tayyor bo'ldi. Endi uni birinchi marta boshqa odam ishlatyapti.
- Maket (chap): Sinov sahnasi — telefonda «‹ Bugun ›» va kataklar; barmoq halqasi kataklar ustida aylanadi, hisoblagich sekin yuradi (0:08 → 0:12); yozuv bo'sh.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Qayerni bosishni ko'rsataman (28)
  - Jim turib, nima qilishini ko'raman (34)
- Javob (ikkalasida bir xil, maqtovsiz — J-026): Oddiy vaziyatda yordam berish mumkin. Bugun esa saytni sinayapmiz: ko'rsatsangiz, tushunarsiz joyni ko'rmay qolasiz. (116)
- **Harakat → Vizual o'zgarish:** variantni tanlash → hisoblagich to'xtaydi, telefon ustida savol pufagi chiqadi «U qayerda to'xtadi?»; yozuvning birinchi qatori bir lahza yonib o'chadi (joy bo'sh).
  Jonli darsda — sinf ovozlari chizig'i (har variant va foizi).
- Tugma (pastki): Bittasini tanlang → Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun odam qayerda to'xtashini ko'rib, yozasiz.** (47)
- Mentor: Saytni o'zingiz qurgansiz — qayerni bosishni bilasiz. Uni birinchi marta ochgan odam bilmaydi.
- Chap: «Dars oxirida — shunday yozuv: odam nima qildi va qayerda to'xtadi» + yozuv qatorlari 0.9 s oraliqda o'zi yoziladi (javob ochilmaydi — matn kulrang chiziq):
  `0:00 · ━━━━━━` · `0:14 · ━━━━━━━━  to'xtadi` · `0:31 · ━━━━━` · `0:58 · ━━━━━━━  to'xtadi`; oxirida bitta qator yonida «Birinchi».
- O'ng (01 · matn · teg):
  - 01 · Odam qayerda to'xtashini kuzatib, yozasiz · `kuzatish`
  - 02 · Yordam bersangiz, yozuvda nima qolishini ko'rasiz · `yordam`
  - 03 · Odamga beriladigan vazifani yozasiz · `vazifa`
  - 04 · Sinfdoshingiz bilan bir-biringizni kuzatasiz · `juftlik`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
- Reja = dars ta'rifi (App.jsx `sub` «sinov: tushuntirmang, kuzating») — «sinov» so'zi reja yuzasida yo'q, u 2-ekranda misoldan keyin tug'iladi (T-011, P-014).

## 2 · Sinovni kuzating  ← QTushuncha
- Eyebrow: Tushuncha · kuzatish
- Sarlavha: **O'yinchi «Maydon»da qayerda to'xtaydi?** (38)
- Mentor: 2-darsda odamdan bo'lib o'tgan ishini so'ragansiz. Bugun so'ramaysiz: o'yinchi vazifani bajaradi, siz har to'xtashini yozasiz.
- Yozuv tepasida (bitta qator, `QIzoh`): Vazifa: «Shanba kuni soat 18:00 ga maydon band qiling.»
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»): **O'yinchi necha marta to'xtaydi?** · 1 · 2 · 3 — tanlov saqlanadi.
- Vizual: Sinov sahnasi — telefon (bugungi kataklar) · yozuv (bo'sh qatorlar, nomsiz). Telefon tepasida kichik yorliq «×5» (sinov tezlashtirib ko'rsatiladi).
- **Harakat → Vizual o'zgarish:** «Sinovni boshlash» → sinov `SINOV` bo'yicha ×5 tezlikda yuradi: halqa harakat qiladi, telefon ekrani o'zgaradi, hisoblagich yuradi.
  To'xtash paytida halqa bir joyda aylanadi, hisoblagich accent bo'ladi. O'quvchi **«To'xtashni yozish»** ni bosadi → yozuvga qator tushadi (accent, yorliq «to'xtadi»):
  1. `0:00–0:25 · Bugungi kataklarni surib, shanbani qidirdi`
  2. `0:41–1:43 · Tugmani qidirdi, «Qanday yuboriladi?» deb so'radi` — 1:10 da telefon ustida ikki pufak: o'yinchi «Qanday yuboriladi?» · siz «O'zingiz qanday deb o'ylaysiz?»
  3. `1:43–2:01 · «Band qilindi» chiqqach, katakni yana bosdi`
  - Harakat paytida bosilsa (`QXato`): Hozir u to'g'ri yo'lda ketyapti — bu to'xtash emas. (51)
  - To'xtash bosilmay o'tib ketsa, sinov shu joyda pauza qiladi (`QXato`): Bu yerda u qiynaldi — to'xtashni yozing. (40) · tugma pulsda.
  - Hisoblagich yonida «Yozildi: N» (jami aytilmaydi — bashorat javobini ochmaydi, P-040).
- 2:01 da (sinov tugadi): yozuv tepasida nom paydo bo'ladi **«Kuzatuv yozuvi»**, telefon ustida yorliq **«Sinov»** (atama — misoldan keyin, bir marta).
  Natija qatori (`QTaxmin`): «Taxminingiz: 2 · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Real odam saytni o'zi ishlatadi, siz kuzatasiz — bu sinov deyiladi. Intervyuda so'raysiz, sinovda ko'rasiz. (107)
- Tugma (pastki): Sinovni boshlang → To'xtashlarni yozing (Yozildi: N) → Davom etish · `tugadi`: tugmalar paneli yopiladi, telefon va kuzatuv yozuvi butun enga (199) · «↻ Qaytadan» (ikkinchi tugma).
- O'qituvchi eslatmasi: AvtoPizza botida «qayerda to'xtab qoldingiz?» deb so'ragan edingiz — bugun javobni odamning o'zidan emas, uning harakatidan olasiz. Sinfga savol: «Siz o'yinchining o'rnida qayerda to'xtardingiz?»

## 3 · 1-savol  ← QTest (✔ 2-variant, `correctIdx 1`)
- Eyebrow: Tekshiruv · kuzatuv yozuvi
- Savol: **Sinfdoshingiz 18:00 katagi oldida to'xtadi. Yozuvga nima yoziladi?** (9 so'z)
  - 0:40 · 18:00 katagi juda kichik ekan (36)
  - ✔ 0:40 · Katakka qarab turdi, bosmadi (35)
  - 0:40 · Odamlar kataklarni tushunmaydi (37)
  - 0:40 · Sayt unga yoqmagan bo'lsa kerak (38)
- To'g'ri izohi: Yozuvga u nima qilgani tushadi — siz ko'rgan harakat.
- Xato izohlari (≤60): 1 — Kichikligi — sizning xulosangiz. U nima qildi? (44) · 3 — Bitta odamdan hamma haqida gap chiqmaydi. (42) ·
  4 — Bu sizning fikringiz: u buni aytmadi ham, qilmadi ham. (53) · (umumiy) Odam nima qilganini toping — ko'rgan harakatingizni. (54)
- Tanlagach: kichik yozuv-qatorda tanlangan gap ko'rinadi (to'g'ri — yashil chiziq, xato — `err` fon).

## 4 · Yordam bersangiz-chi?  ← QTushuncha
- Eyebrow: Tajriba · yordam
- Sarlavha: **Yordam bersangiz, yozuvda nima qoladi?** (38)
- Mentor: Bu safar o'yinchi to'xtagan har joyda unga yo'lni ko'rsating. Keyin ikki yozuvni solishtiring.
- Bashorat (ballsiz): **Ko'rsatsangiz, yozuvda nechta to'xtash qoladi?** · 0 · 1 · 3
- Vizual: Sinov sahnasi — o'sha vazifa, yangi bo'sh yozuv (sarlavhasi «Ko'rsatdingiz»).
- **Harakat → Vizual o'zgarish:** sinov qayta yuradi; har to'xtash boshlanganda sinov pauza qiladi va bitta tugma chiqadi **«Ko'rsatish»** (N/3). Bosilganda:
  telefon ustida sizning pufagingiz (1 — «Strelkani bosing» · 2 — «Pastga suring, tugma o'sha yerda» · 3 — «Bo'ldi, band qilindi»), halqa shu zahoti kerakli joyga o'tadi,
  hisoblagich 2–3 soniyada davom etadi; yozuvdagi o'sha qator kulrang va chizilgan: «yozilmadi».
- 3/3 da: ikki yozuv yonma-yon (bir balandlikda): chap **«Kutdingiz»** (2-ekrandan) — 3 to'xtash · 2:01 · o'ng **«Ko'rsatdingiz»** — 0 to'xtash · 0:30.
  Natija qatori (`QTaxmin`).
- Xulosa: Ko'rsatsangiz, odam tezroq davom etadi, lekin o'sha joyni o'zi topa olarmidi — buni bilmay qolasiz. (99) — vizualdagi «0 to'xtash» — bu simulyatsiyada (audit 2)
- Tugma (pastki): Har to'xtashda ko'rsating (N/3) → Davom etish · `tugadi`: tugma paneli yopiladi, ikki yozuv butun enga.
- O'qituvchi eslatmasi: Ko'rsatish yomon odat emas — darsda bir-biringizga yordam berasiz. Faqat sinov paytida yordam to'xtash joyini yashiradi.

## 5 · 2-savol  ← QTest (✔ 4-variant, `correctIdx 3`)
- Eyebrow: Tekshiruv · yechimni ko'rsatmaysiz
- Savol: **O'yinchi so'radi: «Endi nimani bosaman?» Nima deysiz?** (7 so'z)
  - «Pastga suring, tugma o'sha yerda» (34)
  - «Avval kunni, keyin vaqtni tanlaysiz» (37)
  - «Bering, bu joyini o'zim qilaman» (33)
  - ✔ «O'zingiz qanday deb o'ylaysiz?» (32)
- To'g'ri izohi: Savol unga qaytdi — u o'zi qidiradi, siz to'xtashni yozasiz.
- Xato izohlari (≤60): 1 — Bu yordam: tugmani o'zi topishi endi bilinmaydi. (47) · 2 — Bu tushuntirish: u qayerda to'xtashi yozilmay qoladi. (51) ·
  3 — Siz qilsangiz, to'xtash yozuvga tushmaydi. (42) · (umumiy) Javob bermang — savolni unga qaytaring. (40)

## 6 · Internet-magazin  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Internet-magazin xaridorlari qayerda to'xtab qolgan?** (52)
- Mentor: Jared Spool — odamlar saytni qanday ishlatishini o'rganadigan tadqiqotchi. Bu voqeani u 2009-yilda yozgan, magazin nomini aytmagan.
- Nuqtalar (6) · yorliq **Internet-magazin · N/6** (bashorat kartasida ham) · maket `FormaMaket` (chizilgan forma: ikki qator, ikki tugma, bitta havola; logotip yo'q).
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi):
  - 1/6 **Xarid oxirida — oddiy forma** — Savatni to'ldirib, xaridga o'tgan odam forma ko'rardi: email, parol, «Kirish», «Ro'yxatdan o'tish» va «Parolni unutdingizmi?». · maket: forma chiziladi
  - 2/6 **Sinov: ro'yxat va pul** — Tadqiqotchilar odamlarga xarid ro'yxati va pul berishdi. Vazifa bitta edi: xaridni oxiriga yetkazish. · maket: forma yonida ro'yxat-karta va barmoq halqasi
  - 3/6 bashorat — **Formaga yetgan odamlar bilan nima bo'ldi?** · Forma ularni to'xtatmadi · Ba'zilari formada ikkilandi · ✔ Forma xaridga to'siq bo'ldi
  - 4/6 **Kuzatuvda nima ko'rindi** — Yangi xaridorlar ro'yxatdan o'tishni xohlamadi. Bittasi aytdi: «Men bu yerga tanishgani kelmadim. Shunchaki xarid qilmoqchiman.» Oldin kelganlarning ko'pi parolini eslay olmadi. · maket: forma ustida halqa aylanadi, ikki pufak
  - 5/6 bashorat — **Dizaynerlar formada nimani o'zgartirdi?** · ✔ Bitta tugmaning yozuvini almashtirdi · Formani butunlay olib tashladi · Saytni boshidan qayta qurdi
  - 6/6 **Bitta tugma** — «Ro'yxatdan o'tish» o'rniga «Davom etish» qo'yildi va bitta gap: xarid uchun ro'yxatdan o'tish shart emas. Xarid qilgan mijozlar soni 45% oshdi, birinchi yilda magazin qo'shimcha 300 million dollar oldi. · maket: tugma yozuvi almashadi, yonida ustun-belgi o'sadi «+45%»
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `FormaMaket` holati o'zgaradi: forma chiziladi → ro'yxat-karta va halqa → halqa forma ustida aylanadi
  (to'xtash — s2 dagidek belgi) → pufaklar → «Ro'yxatdan o'tish» yozuvi «Davom etish» ga almashadi, ustun-belgi o'sadi. Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (6/6 dan keyin, hisoblagichsiz): Vazifada qaysi tugmani bosish aytilmagan — shuning uchun formadagi to'xtash ko'rindi. (85)
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish
- O'qituvchi eslatmasi: Raqamlar maqoladan (45% — xarid qilgan mijozlar soni, maqolada «The number of customers purchasing went up by 45%»; 15 mln $ — birinchi oy; 300 mln $ — birinchi yil). Magazin nomini taxmin qilmang — maqolada yo'q.

## 7 · 3-savol  ← QTest (✔ 1-variant, `correctIdx 0`; keys qoidasi «Maydon» egasiga)
- Eyebrow: Tekshiruv · Internet-magazindagidek
- Savol: **Internet-magazindagidek: maydon egasiga qaysi vazifani berasiz?** (7 so'z)
  - ✔ «Ertaga kim band qilganini bilib oling» (39)
  - «Kirishni bosib, parolingizni yozing» (37)
  - «Ega sahifasi sizga yoqdimi, ayting» (36)
  - «Ro'yxat qayerdaligini o'zim ko'rsataman» (41)
- To'g'ri izohi: Vazifa natijani aytadi — qayerni bosishni ega o'zi topadi.
- Xato izohlari (≤60): 2 — Bu qadamlarni aytadi: to'xtash ko'rinmay qoladi. (45) · 3 — Bu fikr so'raydi: ega bajaradigan ish yo'q. (42) ·
  4 — Ko'rsatsangiz, ega qayerda to'xtashini bilmaysiz. (48) · (umumiy) Ega nimaga erishishi kerakligini toping. (42)

## 8 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Odamga maqsadni qanday aytasiz?** (30)
- Mentor: «Qilamiz» ro'yxatingizdagi asosiy ishni oling. Vazifada odam nimaga erishishini yozing — qayerni bosishni emas.
- Bitta ustun: yozuv sarlavhasi «Vazifa: ━━━━» (skelet; telefon ramkasida yorliq «Sizning saytingiz») → forma (bitta qator) → Yordam · «Saqlash» o'ngda (187).
- Ipucha (placeholder, §32): Odam nimaga erishsin?
- Tekshiruv (`QXato`, ≤60; faqat bo'sh qator bloklaydi, qolgani — maslahat, qaror o'quvchida; audit):
  - bo'sh: Odam nimaga erishsin — shuni yozing. (36)
  - qatorda tugma/qadam so'zi (bosing, tugma, katak, menyu, oching, tanlang) — maslahat: Bu gap maqsadni aytyaptimi yoki yo'lni ham ko'rsatyaptimi? (58)
  - qatorda «?» yoki «yoqdimi», «qanday ekan»: Bu fikr so'raydi. Odam bajaradigan ishni yozing. (47)
  - 15 belgidan qisqa — maslahat: Vazifa to'liq gap bo'lsin: nima va qachon. (40)
- Yordam (sukutda yopiq): «Maydon» vazifasida qaysi tugmani bosish yo'q — faqat natija bor: kun, soat va band qilish. Saytingizda odam oxirida nimaga ega bo'ladi? Shuni yozing.
- **Harakat → Vizual o'zgarish:** gap yozib «Saqlash» → yozuv sarlavhasiga «Vazifa: «…»» kiradi (yashil chiziq); tekshiruvdan o'tmasa sarlavha `err` fonda va ostida bitta `QXato`.
  Saqlangach forma yopiladi, yozuv butun enga, sarlavha yonida ✎ (tahrirlash).
- Xulosa: Vazifangiz tayyor. Uni sinfdoshingizga o'qib berasiz — qolganini u o'zi qiladi. (79)
- Tugma (pastki): Vazifani yozing → Davom etish
- Zaxira (o'z sayti hali ishlamasa): «Maydon» vazifasi bilan davom etadi — sinfdoshi «Maydon» ni sinaydi (teg `dars-09-done`). Kirish qatorida bir marta: Saytingiz hali ishlamasa, «Maydon» bilan davom eting. (55)

## 9 · Birinchi qaysi?  ← QTushuncha (o'quvchining o'z tanlovi; 11-dars shu tanlov bilan boshlanadi)
- Eyebrow: Mashq · birinchi tuzatiladigan
- Sarlavha: **Qaysi to'xtash birinchi tuzatiladi?** (35)
- Mentor: Yozuvdagi har to'xtash ortida bitta muammo bor. Uchalasini ko'rib, birinchisini o'zingiz tanlang.
- Chapda uch karta (2-ekrandagi yozuv qatori + muammo; bir balandlikda; ochiladigan — «›», ko'rilgach ✓, U-013):
  - `0:00–0:25` · **Kunni almashtirishni sezmadi**
  - `0:41–1:43` · **«Band qilish» tugmasini topa olmadi — u forma ostida, ko'rinmaydi**
  - `1:43–2:01` · **Band bo'lgandan keyin nima bo'lganini tushunmadi**
- O'ngda: Sinov sahnasi (telefon + kuzatuv yozuvi, 2-ekrandagi uch qator).
- 1-bosqich — **Harakat → Vizual o'zgarish:** kartani bosish → telefonda o'sha joy ko'rinadi (kun: «‹ ›» strelkalari halqada · tugma: forma ostidagi tugma ekran chetidan yarim chiqib turadi · band:
  «Band qilindi» belgisi chiqib yo'qoladi) va yozuvdagi o'sha qator ajraladi; karta ostida savol va javob:
  **Bu to'xtash vazifani to'xtatadimi?**
  - Kun — Yo'q: 25 soniyadan keyin o'zi topdi. (42)
  - Tugma — Ha: tasodifan surmaganda band qila olmasdi. (51)
  - Band — Yo'q: band bo'ldi, u faqat ishonmadi. (44)
- 2-bosqich (3/3 ko'rilgach, shu ekranda): savol-qatori **Birinchi tuzatiladiganini tanlang** → bitta kartani bosish → u **«Birinchi»** uyasiga o'tadi (sig'im 1), qolgan ikkitasi
  «Keyin» qatoriga (kulrang). Telefonda tanlangan joy accent halqada, yozuvdagi qator yonida yorliq «Birinchi».
  - Tugma tanlansa: natija qatori yo'q, shu zahoti xulosa.
  - Kun yoki band tanlansa (`QTaxmin` shaklida, ballsiz): Tanlovingiz: {kun | band} · Mentor tanlovi: tugma — usiz band qilib bo'lmaydi. + ikkinchi tugma «Tanlovni almashtirish».
    O'quvchi o'z tanlovida qolishi mumkin — saqlanadigan tanlov uniki (S-008).
- Xulosa: Bu sinovda vazifani tugatishga to'sqinlik qilgan to'xtashdan boshlaymiz. Qolgan ikkitasi navbatda turadi. (105)
- Tugma (pastki): Uch kartani ko'ring (N/3) → Birinchisini tanlang → Davom etish · `tugadi`: kartalar paneli yopiladi, telefon va yozuv («Birinchi» yorlig'i bilan) butun enga.
- Nishon: First Fix (birinchi tanlov — tugma).
- O'qituvchi eslatmasi: Tanlovni sinfda muhokama qiling: «Kun» ham, «band» ham haqiqiy muammo — faqat vazifani to'xtatmaydi. Tugmani tuzatish — keyingi dars ishi.

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **To'xtashlarni topadigan kod yozamiz.** (36) — PM-082(a) sarlavha oilasi
- Mentor: 2-ekranda to'xtashni ko'zingiz bilan topdingiz, endi kod harakatlar orasidagi uzun tanaffusni belgilaydi. Bu — ehtimoliy to'xtash: muammo ekanini siz kuzatuv bilan tekshirasiz.
- Darvoza-mashq (kod oldidan, ballsiz): **Harakatlar 41 va 103-soniyada. Orasida necha soniya o'tdi?** · 41 · ✔ 62 · 103
  - xato `41`: 41 — birinchi harakat vaqti. Ikkalasining farqini toping. (49) · xato `103`: 103 — ikkinchi harakat vaqti. 103 dan 41 ni ayiring. (48)
- Chap (vazifa, 3 band): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ikki harakat orasi chegaradan uzun bo'lsa, ro'yxatga qator tushadi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Qo'shni ikki harakatni oling: `royxat[i]` va `royxat[i + 1]`. Orasi — `royxat[i + 1].t - royxat[i].t`. Ishlagach `for` bilan hammasini aylanib chiqing.
  Eslatma (JavaScript darslaridan): `for` — bir ishni ro'yxat bo'ylab takrorlaydi · `push` — ro'yxat oxiriga qo'shadi · `console.log` — qiymatni ekranga chiqaradi.
- O'ng: platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`, `app.js`). Mentor gapi: Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz.
  «Kompilyator» ta'riflanmaydi (MATN_ETALONI lug'ati: oyna kompilyator emas).
- Kod:
```js
// O'yinchining harakatlari: t — sinov boshidan necha soniya o'tgani
const harakatlar = [
  { t: 0,   nima: "saytni ochdi" },
  { t: 25,  nima: "shanbaga o'tdi" },
  { t: 29,  nima: "18:00 katagini bosdi" },
  { t: 41,  nima: "ism va telefonni yozdi" },
  { t: 103, nima: "Band qilish tugmasini bosdi" },
  { t: 121, nima: "katakni yana bosdi" }
];

function toxtashlar(royxat, chegara) {
  // ikki harakat orasi chegaradan uzun bo'lsa — to'xtash
  return [];   // shu joyni siz yozasiz
}

console.log(toxtashlar(harakatlar, 15));
// ["saytni ochdi: 25 soniya", "ism va telefonni yozdi: 62 soniya", "Band qilish tugmasini bosdi: 18 soniya"]
console.log(toxtashlar(harakatlar, 60));
// ["ism va telefonni yozdi: 62 soniya"]
console.log(toxtashlar([], 15));
// []
```
- Kod oynasi sarlavhasi: `app.js — toxtashlar funksiyasini yakunlang` · placeholder: `// to'xtashlarni yig'ib qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: chegara 15 da uchta qator. (51) · 2 — Har qator «harakat: N soniya» ko'rinishida bo'lsin. (47) ·
  3 — Bo'sh ro'yxatga — bo'sh; chegara 60 da faqat bitta qator. (54)
- **Harakat → Vizual o'zgarish:** darvozada `62` tanlanadi → kod namunasida `t: 41` va `t: 103` qatorlari bir lahza ajraladi, orasida «62» chizig'i; kod ishga tushganda Console'da
  ro'yxat chiqadi, shartlar birma-bir ✓ bo'ladi.

## 11 · Yakuniy savol  ← QTest (✔ 3-variant, `correctIdx 2`; qoidaning to'rt qismi birga)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Qaysi sinov qoidaga to'liq mos o'tkazildi?** (6 so'z)
  - Saytni tushuntirib, keyin vazifa berdi (38)
  - Vazifa berdi, to'xtaganda tugmani ko'rsatdi (43)
  - ✔ Vazifa berdi, jim kuzatib, to'xtashni yozdi (43)
  - Saytni ko'rsatib, «yoqdimi?» deb so'radi (40)
- To'g'ri izohi: Vazifa berildi, tushuntirilmadi, yordam berilmadi va to'xtash yozildi.
- Xato izohlari (≤60): 1 — Oldindan tushuntirsangiz, to'xtash joylari yo'qoladi. (51) · 2 — Ko'rsatish — yordam: to'xtash yozuvdan yo'qoladi. (47) ·
  4 — Bu fikr so'rash: sinovda odam vazifa bajaradi. (47) · (umumiy) To'rt qismni tekshiring: vazifa, tushuntirish, yordam, yozuv. (59)

## 12 · Juftlikda sinov  ← QMustaqil (3 qadam)
- Eyebrow: Juftlikda sinov
- Sarlavha: **Sinfdoshingiz saytingizda qayerda to'xtaydi?** (44)
- Mentor: {jonli: Avval siz vazifa berib kuzatasiz, keyin rollarni almashasiz. | mustaqil: Uydagi biror kishiga saytingizni bering va kuzating.} Savol bersa — unga qaytaring.
- Qadamlar 1/2/3 (QQadamlar):
  1. **Vazifani o'qib bering** — 8-ekrandagi vazifa yozuv sarlavhasida; tugma «Sinovni boshlash» → taymer 0:00 dan yuradi (3 daqiqa — darsdagi mashq uchun limit, keyin o'zi to'xtaydi).
  2. **To'xtashlarni yozing** — «To'xtashni yozish» bosilganda yozuvga taymer vaqti bilan yangi qator qo'shiladi; ipucha «Qayerda, nima qildi?». Odam hech qayerda to'xtamasa —
     «To'xtash bo'lmadi» (bu ham natija: 3-qadam o'tkazib yuboriladi).
  3. **Birinchisini belgilang** — har qator yonida savol «Vazifani to'xtatdimi?» (Ha / Yo'q); bitta qatorni bosib «Birinchi» qilasiz → «Saqlash».
- Vizual: o'quvchining kuzatuv yozuvi — sarlavhada vazifasi, qatorlar vaqt bilan. 8-ekran yozilmagan bo'lsa (yoki mentor rejimi) — «Maydon» vazifasi.
- Tekshiruv (`QXato`, ≤60): qator bo'sh — Odam nima qilganini yozing. (28) · qatorda xulosa so'zi (yomon, noqulay, chalkash, kerak) — Bu xulosa. Odam nima qilganini yozing. (39)
- **Harakat → Vizual o'zgarish:** «To'xtashni yozish» → yozuvga vaqtli qator kiradi (accent, «to'xtadi»); matn yozilgach qator oddiy holatga o'tadi; 3-qadamda tanlangan qator «Birinchi»
  yorlig'ini oladi; «Saqlash» → yozuv chap chetida yashil chiziq, forma yopiladi, yozuv butun enga (199), har qator yonida ✎.
- Xulosa: Kuzatuv yozuvingiz tayyor: vazifa, to'xtashlar va birinchi tuzatiladigani. (74)
- Tugma (pastki): Sinovni o'tkazing (N/3) → Davom etish
- O'qituvchi eslatmasi: Juftliklarni oldindan bo'ling. Har sinov 3 daqiqa, keyin almashish. Kuzatuvchi faqat «O'zingiz qanday deb o'ylaysiz?» deydi — boshqa gap yo'q.
  Darsdagi sinfdosh — mashq; real odam bilan sinov — uyga vazifa.

## 13 · Natijalar (podium)  ← QNatija
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Yozuvga nima yoziladi · 2 — Savolni qaytarish · 3 — Egaga vazifa · 4 — To'g'ri o'tgan sinov

## 14 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon | Orqa | Izoh |
|---|---|---|
| Sinov nima? | Real odam saytni o'zi ishlatadi, siz kuzatasiz | Inglizcha — usability test |
| Sinov intervyudan nimasi bilan farq qiladi? | Intervyuda so'raysiz, sinovda kuzatasiz | Javob — odamning harakatida |
| Sinovning qoidasi qanday? | Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz | To'rt qism — bitta gap |
| To'xtash nima? | Odam keyingi qadamni topishda qiynalgan joy: jim qoladi, qidiradi yoki noto'g'ri bosadi | Yozuvga vaqti bilan tushadi |
| Kuzatuv yozuviga nima tushadi? | Odam nima qilgani va qayerda to'xtagani | Ko'rgan harakat — u qilganidek |
| Yozuvga nima tushmaydi? | Sizning xulosangiz | «Katak kichik» — xulosa |
| Odam «Endi nimani bosaman?» desa-chi? | «O'zingiz qanday deb o'ylaysiz?» | Savol unga qaytadi |
| Sinovda yordam bersangiz nima bo'ladi? | To'xtash yozuvdan yo'qoladi | Odam tez tugatadi, yozuv bo'sh |
| Yaxshi sinov vazifasi nimani aytadi? | Odam nimaga erishishini | Qaysi tugmani bosishni emas |
| Maydon sinovida birinchi qaysi to'xtash tuzatildi? | Vazifani tugatishga to'sqinlik qilgani | «Maydon»da — tugma |
| Internet-magazinda nima o'zgardi? | «Ro'yxatdan o'tish» o'rniga «Davom etish» | Xarid qilgan mijozlar soni 45% oshdi |
| Real odam bilan sinovni kimga berasiz? | Saytingiz mo'ljallangan odamga | Sinfdosh — darsdagi mashq |

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Kuzatuv yozuvi tayyor: birinchi tuzatish aniq.** (46)
- Endi siz bilasiz:
  - Sinov — real odam saytni o'zi ishlatadi, siz kuzatasiz.
  - Bu darsdagi sinovda: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.
  - Kuzatuv yozuviga xulosangiz emas, odam nima qilgani vaqti bilan tushadi.
  - Maydon sinovida birinchi — vazifani tugatishga to'sqinlik qilgan to'xtash.
- Uyga vazifa (`HwCard`, P-025): **Kim bilan:** 2-darsda intervyu bergan odamlardan ikkitasi · **Nechta:** 2 ta sinov · **Muddat:** keyingi darsgacha
  1. Sinov vazifangizni o'qib bering va telefonni (yoki laptopni) bering.
  2. Tushuntirmang, yordam bermang — har to'xtashni vaqti bilan yozing.
  3. Vazifani to'xtatgan to'xtashni «Birinchi» deb belgilang va yozuvni keyingi darsga olib keling.
- Keyingi dars — «Loyiha kuni: sinovdan keyingi tuzatish». Sinovda topilgan birinchi to'xtashni agent bilan tuzatasiz.
- Nishonlar — pastda (mentor rejimida yo'q).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Silent Observer!** — Sinovda uchala to'xtashni o'zingiz yozdingiz (2)
- **Task Giver!** — Sinov vazifangizni qoidaga mos yozdingiz (8)
- **First Fix!** — Vazifani to'xtatadigan to'xtashni birinchi tanladingiz (9)
- **Pair Tester!** — Sinfdoshingiz bilan sinov o'tkazib, yozuvni saqladingiz (12)

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida raqam 1/2/3)
- **3 · Yozuvga nima tushadi** — 1 Odam nima qilgani — siz ko'rgan harakat, vaqti bilan. · 2 Xulosangiz («katak kichik») yozuvga tushmaydi. ·
  3 Bitta odamdan hamma haqida gap chiqarilmaydi. — savol: 3-ekran savoli
- **5 · Savolni qaytaring** — 1 Sinovda yechimni ko'rsatib bermaysiz: ko'rsatsangiz, qiyinchilik ko'rinmay qoladi. · 2 Odam so'rasa: «O'zingiz qanday deb o'ylaysiz?» ·
  3 Jim qolsa — kutasiz va vaqtini yozasiz. — savol: 5-ekran savoli
- **7 · Vazifa natijani aytadi** — 1 Internet-magazinda vazifa bitta edi: xaridni oxiriga yetkazish. · 2 Qaysi tugmani bosish aytilmagan — shuning uchun forma to'xtash bo'lib ko'rindi. ·
  3 Vazifada odam nimaga erishishi yoziladi, qadamlar emas. — savol: 7-ekran savoli
- **11 · Sinovning to'rt qismi** — 1 Vazifa berasiz. · 2 Yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz. · 3 Qayerda to'xtaganini vaqti bilan yozasiz. — savol: 11-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni: A 1·6·9 · B 3·5·11 · C 2·8·12 · D 4·7·10 — har biri 3 marta)
1. Sinov nima?
   - A ✔ Real odam saytni ishlatadi, siz kuzatasiz
   - B Siz saytni ishlatasiz, odam sizni kuzatadi
   - C Odamdan sayt haqidagi fikrini so'raysiz
   - D Saytni o'zingiz qayta-qayta ishlatib ko'rasiz
2. Sinov intervyudan nimasi bilan farq qiladi?
   - A Sinovda odamga ko'proq savol beriladi
   - B Intervyuda odam saytni o'zi ishlatadi
   - C ✔ Sinovda so'ramaysiz — odamni kuzatasiz
   - D Sinovda faqat sinfdoshlaringiz qatnashadi
3. O'yinchi 25 soniya hech narsa bosmadi. Bu nima?
   - A Sayt juda sekin ochilayotganining belgisi
   - B ✔ To'xtash — yozuvga vaqti bilan tushadi
   - C Odam saytni yoqtirmaganining belgisi
   - D Sinov shu yerda tugaganining belgisi
4. Sinovda odamga yordam bersangiz, yozuvda nima bo'ladi?
   - A Yozuvga ko'proq to'xtash tushadi
   - B Yozuv avvalgidek o'zgarmay qoladi
   - C Odam to'xtagan joylar ikki marta yoziladi
   - D ✔ To'xtash joyi yozuvga tushmay qoladi
5. Yaxshi sinov vazifasi nimani aytadi?
   - A Qaysi tugmalarni bosish kerakligini
   - B ✔ Odam nimaga erishishi kerakligini
   - C Sayt qaysi qismlardan qurilganini
   - D Odamga sayt yoqqan-yoqmaganini
6. Qaysi biri sinov vazifasi bo'la oladi?
   - A ✔ «Shanba kuni soat 18:00 ga maydon band qiling»
   - B «18:00 katagini bosib, ism va telefonni yozing»
   - C «Sayt sizga qulaymi? Fikringizni aytib bering»
   - D «Pastdagi «Band qilish» tugmasini topib bosing»
7. Kuzatuv yozuviga qaysi qator tushadi?
   - A «Tugma juda noqulay joyga qo'yilgan ekan»
   - B «Hamma odam bunday formani yomon ko'radi»
   - C «Sayt menga ham chalkash tuyuldi»
   - D ✔ «Tugmani qidirib, 1 daqiqa ekranni surdi»
8. Internet-magazinda odamlar qayerda to'xtab qolgan?
   - A Savatga narsalarni solayotgan paytda
   - B Kerakli narsani qidiruvdan izlayotganda
   - C ✔ Email va parol so'raydigan formada
   - D Yetkazib berish manzilini yozayotganda
9. Internet-magazinda nima o'zgartirildi?
   - A ✔ «Ro'yxatdan o'tish» o'rniga «Davom etish»
   - B Formaga yana bitta qator qo'shib qo'yildi
   - C Sayt boshidan to'liq qayta qurib chiqildi
   - D Ro'yxatdan o'tganlarga chegirma berildi
10. Uch to'xtashdan qaysi biri birinchi tuzatiladi?
   - A Sinovning eng oxirida bo'lgani
   - B Eng qisqa vaqt olgan to'xtash
   - C O'zingizga eng qiziq tuyulgani
   - D ✔ Vazifani to'xtatib qo'yadigani
11. Real odam bilan sinovni kim bilan o'tkazasiz?
   - A Saytni qurgan o'zingiz bilan
   - B ✔ Saytingiz mo'ljallangan odam bilan
   - C Saytni oldin ko'rgan dasturchi bilan
   - D Sinfdagi eng a'lochi o'quvchi bilan
12. Sinovdan keyin kuzatuv yozuvi bilan nima qilasiz?
   - A Uni o'chirib, yangisini boshidan boshlayman
   - B Hamma to'xtashni bir kunning o'zida tuzataman
   - C ✔ Birinchi tuzatiladigan to'xtashni tanlayman
   - D Odamdan yozuvni tasdiqlashini so'rayman
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — sinov · kuzatish · to'xtash · vazifa · yozuv · tugma · vaqt · odam (+ o'yin qatlami belgilari) ·
  uyga vazifa banneri — sinov · vazifa · to'xtash · yozuv · odam.

---

## B. KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; yangi fayl — hamma band yangi)
1. Fayl `src/7-Modull/PmUsabilityTestLesson.jsx` (skeletdan, pilotdan emas — JR-14); App.jsx m7-10 qatoriga `comp: PmUsabilityTestLesson` («qur» bosqichida; nom va `sub` o'zgarmaydi — DE-205 ✓).
2. Qolip: s0 `QKirish` · s1 `QReja` · s2/s4/s9 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6 `QVoqea` ·
   s8/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')` (q13–q21).
3. `SINOV` — Mentor sinovi bitta manbada (A-bo'lim jadvali: `t`, `nima`, `ekran`, `toxtash: bool`, `pufak`); s0, s2, s4, s9 va s10 (`harakatlar` — faqat bosish/yozish qatorlari) shundan.
   `MUAMMOLAR` — uch karta (`joy: kun|tugma|band`, `vaqt`, `nomi`, `toxtatadi: bool`, `izoh`).
4. `SinovSahna` — bitta vizual (180): telefon ramkasi («Maydon»: «‹ Bugun / Shanba ›», kataklar, forma, ekran ostidagi tugma, «Band qilindi» belgisi) + barmoq halqasi + hisoblagich +
   pufaklar (o'yinchi / siz) + yozuv (qator holatlari: bo'sh · yozildi · to'xtash · yozilmadi · birinchi · xato). `reduced-motion` — o'tishsiz, halqa harakatsiz.
5. s2 — ×5 ijro (`requestAnimationFrame` yoki `setInterval`, reduced-motion da qadam-baqadam «Keyingi»); «To'xtashni yozish» to'xtash oynasida bosilsa qator, tashqarida — `QXato`;
   o'tkazib yuborilgan to'xtashda pauza; «Yozildi: N» (jami yo'q); 3/3 da «Kuzatuv yozuvi» / «Sinov» yorliqlari; `QBashorat` + `QTaxmin`.
6. s4 — o'sha ijro, har to'xtashda pauza + «Ko'rsatish» (N/3); yonma-yon ikki yozuv (s2 natijasi — saqlangan holatdan; s2 o'tilmagan bo'lsa `SINOV` dan to'liq yozuv).
7. s6 — `FormaMaket` (CSS chizilgan forma: 2 qator, «Kirish» / «Ro'yxatdan o'tish», havola; ro'yxat-karta; ustun-belgi «+45%»); `K_SLIDES` 6 bosqich, 2 bashorat, yorliq «Internet-magazin · N/6».
8. s8 — vazifa tekshiruvi (regex, PM-032: ≥8 namuna uz+ru sinovi; «tanlab», «bosib o'tib» kabi to'g'ri gaplar bloklanmasin); saqlangan vazifa s12 va uyga vazifa banneriga o'tadi.
9. s9 — kartalar akkordeon emas: bosish → telefon holati o'zgaradi (DE-184); 2-bosqich — uya «Birinchi» (sig'im 1), «Tanlovni almashtirish»; **tanlov saqlanadi — 11-dars o'qiydi**
   (kalit nomi — TAYANCHGA SAVOL 4); nishon `firstFix` — birinchi tanlov `tugma`.
10. s10 — darvoza-mashq (41 · 62 · 103), `KOD_TASK` (title, brief, starter uz/ru), 3 `evalEquals` (chegara 15 → 3 qator · 60 → 1 qator · bo'sh → bo'sh), requirement xabarlari.
11. s12 — `PairTimer` (3 daqiqa, ▶ ⏹ belgisiz yozuvlar: «Sinovni boshlash» · «To'xtatish»), «To'xtashni yozish» taymer vaqtini oladi, «To'xtash bo'lmadi», Ha/Yo'q savoli, «Birinchi»;
    jonli/mustaqil Mentor matni; xulosa so'zi tekshiruvi (PM-032).
12. Testlar s3/s5/s7/s11 — `correctIdx` 1/3/0/2 = `INLINE_KEYS`; `RECAPS` 3/5/7/11 (raqamli kartalar); `Q_LABELS`; arena `QUIZ_BANK` 12 (A/B/C/D 3/3/3/3).
13. s14 `FLASHCARDS` 12 · s15 `RECAP` 4 band (A-1 ta'rifi so'zma-so'z), `HW_STEPS` 3 qadam (yakun ekranida aynan shu), «Keyingi dars — …» · `ACHIEVEMENTS` 4.
14. Uyga vazifa — `HwCard` yakun ekranida; alohida `.homework.jsx` yo'q (GATE M M-q9).
15. **REPO — bu darsda yo'q** (PM darsi; teg yo'q). Lekin s2/s9 maketi `dars-09-done` holatiga tayanadi — REPO talabi TAYANCHGA SAVOL 3 da.
- Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim)
1. **Mentor sinovining tafsiloti** — bitta o'yinchi, vaqtlar (0:25 · 1:43 · 2:01), 1:10 dagi «Qanday yuboriladi?», tugmani tasodifan surib topgani, «Bo'ldimi?» deb katakni yana bosgani.
   Nega: uch muammo bitta sinovda bir-biriga zid bo'lmasligi uchun (tugmani topa olmasa, keyingi muammo bo'lmasdi). 11-dars shu sinovga tayanadi — o'sha MD bilan mos bo'lishi kerak.
2. **Kun almashtirgich ko'rinishi «‹ Bugun ›» (kichik strelkalar)** — «kunni almashtirishni sezmadi» muammosi shu bilan tushuntiriladi. 7-dars (kun almashtiriladi) va 8-dars (dizayn) maketi bilan mosmi?
3. **`dars-09-done` repo holati** (9-dars agenti / «qur» bosqichi uchun): telefon kengligida «Band qilish» tugmasi forma ostida — birinchi ekranda ko'rinmaydi; «Band qilindi» belgisi qisqa chiqib
   yo'qoladi; kun almashtirgich kichik. Aks holda 10-dars sinovi repo'dagi saytga to'g'ri kelmaydi. `dars-11-done` faqat tugmani tuzatadi (tayanch jadvali bilan bir xil).
4. **s9 tanlovi qayerda saqlanadi** (localStorage kaliti nomi) — 11-dars «shu tanlov bilan boshlanadi»; kalit nomini o'ylab topmadim, 11-dars bilan birga belgilanishi kerak.
5. **Uyga vazifa hajmi** — «2-darsda intervyu bergan odamlardan ikkitasi · 2 ta sinov». Tayanchda soni yo'q; 11-dars real yozuvlar bilan boshlanadi — soni u yerda ham bir xil bo'lsin.
6. **Juftlik sinovi taymeri — 3 daqiqa** (har kishiga), keyin rollar almashadi. Darsga sig'ishi uchun tanladim.
7. **Keys «300 million dollarlik tugma»** (Jared Spool, 2009) — 9-Modulning boshqa darslarida ishlatilmasin (PM-016: bosh-keys modulda takrorlanmaydi). 8-dars (dizayn) yoki 12-dars uni olsa — ziddiyat.
8. **PM darsida `QKod` ekrani** (s10) — P-011 PM tartibi va namuna (m6-14) bo'yicha qo'ydim; 9-Modul PM darslarida koding saqlanadimi — modul bo'yi qaror kerak.
9. **«Sinov» va «to'xtash» atamalari** — 11-dars va 12-dars ham aynan shu so'zlarni ishlatishi kerak (12-dars pitchida «real foydalanuvchi hikoyasi» — sinov yozuvidan).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 316–318 — m7-09 «Loyiha kuni: MVP tayyor» → **m7-10 «Odam ilovangizda qayerda to'xtab qoladi?»** → m7-11 «Loyiha kuni: sinovdan keyingi tuzatish». `comp` hali yo'q («qur» da ulanadi).
- [x] Bitta misol-ip: «Maydon», bitta sinov vazifasi («Shanba kuni soat 18:00 ga maydon band qiling.»), tayanchdagi uch muammo aynan; metafora yo'q; bitta vizual — `SinovSahna`.
  Ikkinchi misol faqat keys (s6, `FormaMaket` — PM-029) va testda tanish olamdan (s7 — o'sha «Maydon»ning egasi, P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 9 (QTushuncha) + 0, 6, 8, 10, 12. Matn-karta yo'q (s9 kartasi bosilganda telefon holati o'zgaradi).
- [x] O'lchov (skript bilan sanaldi — `lint:til` dan keyin): sarlavha 35–52 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 72–105 · hook javobi 106 · xato izohi 28–59.
- [x] Atamalar: sinov / to'xtash / kuzatuv yozuvi / sinov vazifasi — A-2 jadvali; intervyu, yozuv, sayt, vaqt katagi, band qilish, o'yinchi, maydon egasi — tayanchdagidek; «usability test» — 1-kartochka izohida bir marta;
  «maydon» forma ma'nosida yo'q (T-015); siz-forma; tugmalar ot-shaklda («Sinovni boshlash», «To'xtashni yozish», «Ko'rsatish», «Saqlash», «Tanlovni almashtirish»).
- [x] Testlar: 4 variant, uzunlik teng (s3 35–38 · s5 32–37 · s7 36–41 · s11 38–43) — to'g'ri javob yolg'iz eng uzun emas (s11 da 2 va 3 teng); vaqt belgisi «0:40» hamma variantda (s3);
  «vazifa berdi» ikki variantda, «to'xtash» ikki variantda (s11). ✔ o'rni 2/4/1/3 — yangi dars.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno); kafolat so'zlari yo'q («har doim», «100%», «darrov», «darhol», «doim» — grep 0, faqat shu qatorda).
  Arena: 12 savol, ✔ A 1·6·9 · B 3·5·11 · C 2·8·12 · D 4·7·10 (skript bilan sanaldi); to'g'ri variant hech qaysi savolda yolg'iz eng uzun emas.
- [x] Ichki kodlar yo'q (modul raqami o'rniga «AvtoPizza boti», «AvtoStoyanka», «2-darsda»); keys — manba bilan (Spool 2009, sahifa ochib tekshirildi 05.10); «KOD» ro'yxati 15 band.
- [x] Karta T · P · S · PM: T-011/PM-030 (sinov atamasi s2 da misoldan keyin) · T-014/015 (bir so'z, «maydon» bir ma'noda) · T-024 (tugma oti) · T-039 (saytingiz — 9-darsda MVP bor; yo'q bo'lsa zaxira) ·
  T-042 (qoida va ta'rif so'zma-so'z bir xil) · T-047 (ekranda ko'ringanini Mentor aytmaydi) · P-001 (bitta ip) · P-014/015 (reja kashfiyotni ochmaydi) · P-016 (hook ikki variant teng) ·
  P-025 (uyga vazifa karta + yakunda aynan) · P-040 (yozildi hisoblagichi) · P-046 (s9, s12 holat o'quvchi tanlovidan) · P-064 (bashorat s2, s4) · S-002/S-004 (har xato variant qoidaga ko'ra xato) ·
  S-008 (s9 tanlovi jazolanmaydi; arena kalit iboralari darsdagi testlardan farqli) · S-015 (bashorat zinapoya) · S-018 (Jared Spool izohi birinchi ko'rinishda) · S-026 (recap raqam) · PM-005 (2-tur) ·
  PM-016 (keys yangi) · PM-028/029 (keys yorlig'i, chizilgan maket).
- [ ] Ochiq: s2 ×5 ijro — 7–10 soniya testida «qachon bosaman?» tushunarlimi, surat va 👦 o'qishda ko'riladi; telefonda (393) telefon va yozuv ustma-ust — vizual bosqichda.

---

## ✎ Kodda chetlashishlar (quruvchi, 05.10.2026) — o'quvchi matni o'zgartirilmagan, MD ga taklif

- ✎ s0: yozuv kartasi tepasida sinov vazifasi qatori turadi (MD: «yozuv bo'sh») — bo'sh karta ma'nosiz ko'rinmasin (SABOQ 4); qatorlar bo'sh qoladi.
- ✎ s6: SABOQ 8 bo'yicha bosqich gapi Mentorda, har bosqichda almashadi; MD dagi Mentor gapi (Jared Spool izohi) 1/6 da sahnada tanishtiruv qatori bo'lib turadi (S-018).
  Bashorat bosqichlarida (3/6, 5/6) Mentor: «Avval o'zingiz belgilab ko'ring.» — MD ga qo'shilsin. Sahnadagi ikkinchi pufak — «••••• ?» (parol), birinchisi iqtibos bo'lagi.
- ✎ s8, s12: maslahat-tekshiruvdan keyin ikkinchi qator «Shunday qoldirsangiz — yana «Saqlash»ni bosing.» (1-dars naqshi) — MD ga qo'shilsin.
- ✎ s12: 2→3-qadam o'tish tugmasi «Birinchisini belgilang →»; «Birinchi» tanlanmay saqlansa — «Bitta qatorni bosib, «Birinchi» qiling.» — MD ga qo'shilsin.
- ✎ Arena 2 va 3-savol to'g'ri varianti: tire faqat to'g'ri variantda edi (lint-tell) — «Sinovda so'ramaysiz, odamni kuzatasiz» · «To'xtash: yozuvga vaqti bilan tushadi».
