# Avtopilot paytida yig'ilgan savollar (2026-09-27, foydalanuvchi bozorda)

Foydalanuvchi: «avtopilotda ishlaver, halol … nima savollar yig'ilgan bo'lsa javob beraman; ehtiyotkorlik va sifat».
Har savolda — men nima qildim (xavfsiz default) va nimani tasdiqlashingiz kerak.

## S1 · M2-0 — JsIntro yangi metaforasi: **futbol jamoasi** (tanladim, tasdiqlang)
Siz «almashtirilsin» dedingiz, metafora oilasini agent tanlaydi deb kelishgandik. **Futbol jamoasi**ni tanladim:
darsning 6-ekranida («Futbol jamoasi, tanangiz, hatto sayt — bari sistema») u allaqachon misol sifatida turibdi.
O'smirga yaqin (95-qonun), «komponent — o'z vazifasi» (darvozabon · himoyachi · yarim himoyachi · hujumchi), «bog'lanish — pas»,
«hammasi birga ishlaydi — hujum» — uchala g'oya ham to'g'ridan-to'g'ri o'tadi.
Muqobil: «shahar» (boshqaruv markazi · elektr stansiyasi · yo'llar) — mavhumroq.
- Ekranlar soni, tartibi va test kalitlari O'ZGARMAYDI; faqat matn/rasm-belgilari va s0 dagi «Tinch/Yugur» holati moslanadi.
- **Tasdiqlang:** futbol jamoasi qolsinmi yoki boshqasi?

## S2 · Anatomiya-lint 2-Modulning 3 ta boshqa darsida — metafora EMAS, tegmadim
- PeanStack s? — «video ostidagi **yurakcha**ni bosasiz» = YouTube'dagi «like» belgisi (❤️ tugma), a'zo emas.
- PracticeLesson2 — «AI **miyangizni** o'qiy olmaydi» = ibora («fikringizni o'qiy olmaydi»).
- PracticeLesson1 (ru) — «сердце» (ilovalarning «yuragi» ibora).
Taklif: bular qoladi, til-lint `anatomiya-metaforasi` ga istisno yoziladi (yurakcha · miyangizni o'qiy · ru «сердце» shu gapda).
Muqobil: «yurakcha» → «❤️ tugmasi», «miyangizni o'qiy olmaydi» → «fikringizni o'qiy olmaydi». **Qaysi biri?**

## S3 · Ruscha rejimda qolgan o'zbekcha domen/fayl nomlari (1-Modul)
Htmllesson1 14-ekran: `sayt.uz`, `oyinlar.html`, `men.html` — ular ekrandagi kod (`href="oyinlar.html"`) bilan bir xil bo'lishi
kerak, shuning uchun ru-rejimda ham QOLDIRDIM. Faqat mustaqil yozuvlar tarjima qilindi (`sahifa.html` → `page.html`,
GitHub nick to'ldiruvchisi, forma kod-bo'laklari). **Shu yetarlimi**, yoki ru uchun kod bilan birga fayl nomlarini ham almashtiraymi?

---
## Javoblar (17:26, foydalanuvchi)
- **S2:** «taklifing maqul — shundayligicha qoldirib, lint qoidasida istisno» → `til-lint-rules.json` anatomiya-metaforasi
  `except` ga 3 ibora qo'shildi (+ `exceptNote`). PeanStack · PracticeLesson1 · PracticeLesson2: 0; JsIntro 16× (qoida tirik).
- **S3:** «ha yetarli» — `sayt.uz`/`oyinlar.html` ru-rejimda qoladi.
- **S1:** foydalanuvchi tushunmadi — soddaroq tushuntirildi (misollar bilan), qaror kutilmoqda.
- **S1:** foydalanuvchi «mayli futbol jamoasi» (18:42) — tavsiya: s5 misollarida «tanangiz» → «maktab» (futboldan boshqa neytral misol ham qolsin).

## S4 · Yangi darvoza `npm run lint:undef` — gates'ga qo'shaymi? (JARAYON o'zgarishi, sizning roziligingiz kerak)
JsVarsLesson 6-ekranda **prod'dagi bug** topildi: kod oynasida e'lon qilinmagan `{score}` — o'quvchi birinchi qiymatni
qo'yishi bilan dars **oq ekran** beradi (HEAD da qayta chiqarib isbotlandi: `score is not defined`). esbuild, lint:jsx,
ru-walk, page-audit — hech biri ushlamagan. Tuzatildi (`{ball}`).
Keyin butun `src/` ni oxlint `no-undef` bilan tekshirdim — boshqa bunday bug YO'Q (buzuq nusxani papkaga qo'yib, skaner
uni topishi isbotlandi). Vosita qo'shildi: `npm run lint:undef` (`oxlint-undef.json`).
**Taklif:** `gates` ga 7-darvoza qilib qo'shish (≈2 soniya). **Ha / yo'q?**
⚠️ JsVars LMS'da eski (buzuq) holda — keyingi yuklashda albatta yangilanishi kerak.

## S5 · JsLoops «Sikl zavodi» richaglari tepasidagi 3px rangli chiziq (kichik, didga oid)
BOSHLANISH · SHART · QADAM richaglari tepasida har biri o'z rangidagi ingichka chiziq bor. 159-qonun chap chiziqni
(stripe) taqiqlaydi, bu esa TEPA chiziq va uch qismni koddagi ranglar bilan bog'laydi — ma'noli deb QOLDIRDIM.
**Olib tashlaymi yoki qolsinmi?**

## Agentlarning boshqa savollari — namuna bo'yicha o'zim hal qildim (xabar uchun)
- JsVars/JsConditions: placeholder javobning o'zi edi (`let name = "Aziza"`, `if (score > 90) {`, `} else {`) → `let …`, `if (…) {`, `} … {` (V2/159/17).
- JsVars s13/s15 yashil «Juda yaxshi!» qutisi — QOLDI (tugmada «✓ Bajarildi» yo'q, natijani faqat u aytadi).
- JsConditions s11 kassir xulosasi — olingani qoldi (mentor aytadi).
- JsLoops s1 «→ ikkalasini birga ishlatsak» — olindi (H1) · s7 kartalardagi katta 🔢/❓ — olindi (H3) · s6 hisoblagich — QOLDI (aylanish soni ≠ `i`).
- JsFunctions s13 (15-ekran) mashq placeholder'lari (`function salom() { return "Salom!" }` …) — QOLDI: bu test emas, yo'naltirilgan
  yozish mashqi, vazifa matni kodni bo'lakma-bo'lak aytadi. Istasangiz «function …» ga qisqartiraman.
- JsFunctions «mashinasozlik» / «Endi haqiqiy mashinasozsiz!» — QOLDI (darsning «zarar mashinasi» metaforasi). So'z og'ir tuyulsa ayting.
- JsFunctions s8: terminal `10 + 3 = 13` ko'rsatardi, kod esa `kuch * 3 + bonus` = 33 qaytaradi — agent tuzatdi (mazmun xatosi edi).

## JsIntro (M2-0) — futbol jamoasi QO'LLANDI (ko'z bilan ko'rildi: s0 · s2 · s3 · s5 · s8)
- Tana → jamoa: 🧤 Darvozabon · 🛡️ Himoyachi · 🎯 Yarim himoyachi · 🥅 Hujumchi; «Tinch / Hujum», ⚽ «pas soni»; bog'lanish = pas; s5: jamoa · **maktab** · sayt.
- Bosh-agent qo'shimchasi: s0 mentor javobni savoldan OLDIN aytardi («darvozabon uzatadi… hammasi birga» → «Gol nega urildi?»; eski tana versiyasida ham shunday edi) —
  endi «Gol urilishi uchun kimlar ishlaydi? «Hujum»ni bosib, o'zingiz ko'ring» (§217, induktiv). s7 xato qutisidagi takror «Pijamada ko'chada qolasiz» olindi (I3).
- Tekshiruv: gates 6/6 · kalit aynan · anatomiya 0 · lint:undef 0 · ru qoldiq «AGAR» — CodeStrike banner tokeni (soxta).

## S6 · PeanStack 17-ekran (yakuniy BAHOLANADIGAN test): bo'sh katak ichidagi maslahatlar javobni deyarli aytadi
Sudrab joylash katakchalari ichida: «hammasi mijozning bosishidan boshlanadi» · «omborga yoziladi» · «oxirida javob qaytadi».
Har biri o'z katagining javobiga ishora qiladi (159/17). 1-Modul HtmlPractice'dagi «eng yuqorida / birinchi bo'lim» kabi joy-maslahatlari
esa qolgan edi (siz e'tiroz bildirmagansiz). **Taklif:** baholanadigan testda maslahatni «1-qadam · 2-qadam …» ga almashtirish.
Hozircha QOLDIRDIM. **Almashtiraymi?**
- PeanStack s5 ⛶ tugmasi terminal burchagini ozgina yopadi (oldindan bor, layout-lint yopilish deb ushlamadi) — qoldirdim.

## S7 · Ruscha rejimda KOD ichidagi o'zbekcha nomlar (PracticeLesson1: 14 so'z, oldindan bor)
Ru-rejimda kod oynalarida o'zbekcha qoladi: o'zgaruvchi/funksiya nomlari (`tugma`, `matn`, `xato()`, `ko'rsat()`),
kod izohlari (`// tugma BOSILGANDA bu funksiya ishlaydi`, `// bo'sh`) va satrlar (`"Ism kiriting!"`, `"yorug'"`).
Kod ikkala tilda BIR XIL, kompilyator-tekshiruvlari shu nomlarga bog'langan — shuning uchun TEGMADIM (HEAD'da ham 14).
**Taklif:** nomlar qoladi (ru o'quvchi ham shu kodni yozadi); faqat kod IZOHLARI `tr()` bilan ruschaga o'tkaziladi.
Bu butun 2-Modul bo'ylab alohida kichik ish (KATTA_TOZALASH'ga yozaman). **Ma'qulmi?**

## 2-to'lqin agent savollari — namuna bo'yicha hal qilindi
- Practice2: «eng zo'r natijani» → «eng yaxshi natijani» · tanlangan chip yumshoq fon + halqa (boshqa darslar bilan bir xil) · ⛶ qoldi.
- Practice3: s1 qoida-kartasi va mentor — QOLDI (I1: asosiy qoida) · s10 izohidan «To'g'ri!» va «keyingi darsda» va'dasi olindi (159/5, HP3).
- Practice1: `til-lint` `jon-kiritish` qoidasi CSS darslari uchun yozilgan («jon — JS darslarining so'zi»), JS darslarida xato ishlardi →
  qoida Js*/Practice*/PeanStack fayllariga ishlamaydigan qilindi; LMS katalog nomi «Практика 1 — Оживляем сайт» ASL holiga qaytarildi
  (agent o'zgartirgan edi); Practice4 dagi 1-dars nomi ham qaytarildi.
- Practice4: s1 «cho'qqi» kartasi — QOLDI; s13 «MVP tayyor» tegi — topilmadi (faqat recap'da), tegilmadi.
- **S5** (21:25, foydalanuvchi «olsang mayli yoki yumshat»): JsLoops richag chizig'i OLINDI — rang fon/halqa/yorliqda bor. gates 6/6. S6/S7 + reja sahifasi: https://claude.ai/artifact/VX7jdvzy1QGZeinHwVoBTG

---
## Javoblar 2 (22:03, foydalanuvchi, qaror sahifasi VX7jdvzy…)
- **S6: B** (maslahatsiz; «C ham yaxshi») → PeanStack s15 kataklari faqat raqam. 7/7, kalit aynan.
- **S7: C** → Practice1 kod oynalarida 12 joy (izoh + holat-satrlari + xabar) tr; «Ism kiriting» mashq-tekshiruviga tegilmadi; uz sayt xabari koddagi bilan moslandi. ru qoldiq endi faqat nomlar (tugma/matn/xato/ko'rsat). RU_I18N_SPEC 9-bo'lim.
- **S4: Ha** → gates.mjs ga `undef` (7/7); CLAUDE.md E-2 yangilandi. Buzuq nusxa bilan isbot: undef 🔴.
- **UV: PM uy vazifalari UMUMAN kerak emas** («PM uyga vazifalarni alohida boshqacha qilarkanmiz — PMni umuman o'ylama»). Uy vazifasi bosqichi F-0926-06 dan chiqarildi.
- **PM7: faqat tugma** → PmLesson7 .btn T.ink → accent; 7/7. ⚠️ Topildi: PmLesson7 ru-rejimda 111 o'zbekcha so'z (tarjima qilinmagan) — PM, tegilmadi, xabar.

## 3-Modul — agent savollari, namuna bo'yicha hal qilindi
- ReactPropsReuse s15 (baholanadigan yakuniy test): mentor «Yozing: <GameCard + name={g} + />» va placeholder `<GameCard name={g} />` javobni AYNAN aytardi →
  S6 namunasi: mentor «komponent va uning name prop'i (jingalak qavs bilan)», placeholder `<… />` (uz+ru). 7/7, kalit aynan.
- ReactPropsReuse s0: rentgen yoqilmaguncha variantlar xira va bosilmaydi — QOLDI (P2 bosiladigan narsa haqida).
- ReactFirstComponent s15 (baholanadigan): mentor «<GameCard + name="…" + />» va placeholder `<GameCard name="Blox Fruits" />` → «kartochkani name prop'i bilan chaqiring», `<… />` (uz+ru). 7/7, kalit aynan. s6 ru ochilgan panel 20–25px — «o'quvchi ochgan panel» sinfi, tegilmadi.
- ReactIntro s10: ikkala like bosilgach rasm 148→84px (jadval sig'sin) · s11: React Native chiplari kod ostiga (ru'da tugmalar ortiga tushardi) — QABUL (layout-lint E=0 uz/ru bilan o'lchangan).
- ReactStateEffect s15 (baholanadigan): mentor «const [likes, setLikes] = useState(0)» va placeholder javobni aynan aytardi → «shu ikkalasini beradigan xotira qatorini yozing — boshlang'ich qiymati 0», placeholder `const […] = …` (uz+ru). 7/7.
  s11/s15 javobgacha bo'sh natija-oyna — QOLDI (P1) · s0 bosishgacha zaxira qator (sakrash bo'lmasin) — QOLDI.
- ApiPost s16 va 3 ta darsning s15 teg-yozuvlari (tagpill) kod bo'lagini aytardi → tavsifga (S6 kengaytmasi, TOZALASH_PROMPT'ga qoida). ApiPost «Ha, o'chirilsin» qizil — QOLDI (xavfli amal).
- RouterPractice s14: namuna Route qatorlari (mavjud kod-kontekst) — QOLDI · s6/s13 birinchi bosishgacha bo'sh o'ng ustun — QOLDI (159/3).
- CrudPractice s9 bo'sh natija-oyna — QOLDI · s6 TOP olib tashlanganda ham yashil ramka chiqardi → faqat TOP qo'yilganda (flash && g.top).
- BuildSite s14 bo'sh natija-oyna — QOLDI · s10 «narx?» (xato alomati, qaysi kod — o'quvchi topadi) — QOLDI.
- ApiGet s5/s6/s10 qadam-tugmalari (.stepbtn, bir to'plam) to'liq accent → oq fon + accent halqa (159/4) — QABUL.
- ProjectDay s13 yashil quti mentor gapini qisman takrorlardi → «Ko'rdingizmi? Mavzu o'zgardi — usul o'sha.» qoldi (C3).
  s14 (baholanadigan): maydon nomlari (b.price/b.days) faqat debug ekranida bir marta ko'ringan edi → kod-oynaga ma'lumot shakli izohi `// b: { price, days }` (kontekst, RouterPractice namunasi); formula o'quvchida.
  Test ustidagi «To'g'ri javobni tanlang» ko'z-yorlig'i — QOLDI (umumiy test shabloni, mentor yo'q — G1 emas).

## 4-Modul — agent savollari, namuna bo'yicha
- NodeServer s2 «Server = dastur» kartasi (mentorga yaqin) — QOLDI (Practice3/4 «asosiy qoida kartasi» namunasi, ustun bo'sh qolmasin) · s14 javobdan keyin bo'sh o'ng ustun — QOLDI (natija xulosada bir marta).
- DbSqlNosql: s2/s8/s13 yangi xulosa beradigan yashil qutilar — QOLDI (I1/E3) · s14 bosishgacha bo'sh o'ng ustun — QOLDI · bosh-agent: s0 NoSQL yonma-yon hujjatda «Tog' sayohati» chetdan kesilardi (layout-lint ushlamadi, suratda topildi) → json-view pre-wrap.
- DataIntro s15/s15b teglar kanvas yonida (vertikal) — QABUL (surat uz+ru ko'rildi) · s0 variantlar serverni yoqqunga qadar disabled — QOLDI.
- PostgresCrud s6: tanlovgacha kodda `WHERE narx < 100000`, jadval filtrsiz edi → kod `WHERE …` (S7: kod = natija).
- FullstackConnect s3 (scored:false, yo'naltirilgan): «(eski usul)» va xira oqim-sxemasi — QOLDI (mentor o'zi «hozir eski ro'yxatdan oladi, to'g'ri manbani tanlang» deb qo'yadi; 159/17 topish kerak bo'lgan savolga tegishli) · s0 xira variantlar (hali bosilmaydi) — QOLDI.
- FullstackProjectDay s11 yangi gapli takeaway — QOLDI · s14 bo'sh tarix yo'rig'i — OLINDI (P1) · s3/s5 kichik vbadge to'la fon — QOLDI (LOUD katta fon uchun).
- ApiPostman s10 «API method = baza amali» (SQL moslik — yangi) — QOLDI · s2 yakuniy belgi yo'q, tugmalardagi ✓ yetarli (G2).
- AuthEnv s6 201-qutisi (yangi xulosa) — QOLDI · s15 holat-teglari xira (bosilmaydi) — QOLDI.
- FullstackFeedback s8 «Dashboard yoqildi» yashil qutisi (yangi xulosa) — QOLDI (I1/E3, AuthEnv s6 bilan bir xil).
- NestArchAlive: s9/s15 xulosa-qutisi («Har yangi bo'lim — doim shu 5 qadam…») yangi umumiy qoida beradi — QOLDI (I1/E3). s18 «Keyingi ekranda tekshiramiz» — keyingi ekranga ko'prik (73-qonun keyingi DARS va'dasi haqida) — QOLDI. s19 javobdan oldingi «Parolni shifrlash — oshpazning ishi» olingani — 159/17 + S6 (tasdiqlangan), QOLDI olingan holda; javobdan keyingi izoh (qator 1052) buni aytadi.
- Jest s7 kod izohi «qatorlarni o'ng tomondan tanlang →» → «qatorlarni tanlang» (159/11, bosh-agent).
- NestArchPractice s10 kod izohi «o'ng tomondan tanlang →» → «qatorlarni tanlang» (159/11, bosh-agent; Jest bilan bir xil).
- EdgeCases s5 ru: «ikki» → «два» (sarlavha + orderTotal kirishi, S7; bosh-agent). s6 xulosa-kartasi — ekran xulosasi, alohida QOLDI (160/6: harakatdan keyingi izoh).
- FullPipeline s11 TABLO dan keyingi yashil quti («repo sahifasiga kirgan har kim… bir qarashda biladi») — yangi ma'no, QOLDI (I1/E3). s10 telefon kartasi balandligi — did, tegilmadi (ertalabki savolga kirmaydi — mayda).
- FullProPipeline s15 (baholanadi): mentor «Production'ni Staging'dan oldin qo'ysangiz…» — javob qismi, olindi (S6/159/17, bosh-agent).
