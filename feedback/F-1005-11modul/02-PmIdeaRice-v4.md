# 2-dars «Beshta g'oyadan qaysi uchtasi qoladi?» — MD v4 (qayta loyiha, F-1015-177 zanjiri)

Fayl: `src/9-Modull/PmIdeaRiceLesson.jsx` · 16 ekran · Keyingi dars: «Ikki g'oyadan qaysi biri odamlarga kerak?»
Holat: 17.10.2026 — MD v4, **kodga mos** (qurildi 17.10, 12/12 darvoza). Namuna: https://claude.ai/artifact/1UtYr1PQbt8JUKU9GJQhax · Qarorlar (17.10, foydalanuvchi): **1A** test ma'no · **2A** RICE tugmalari ma'nosi bilan, bittalab · **3A** kod o'z RICE ma'lumoti bilan.
Asos: `arxiv/F-1015-177-oldin/02-PmIdeaRice-YAKUNIY-v3.md` (v3) — bu yerda «v3 dagidek» deyilgan joylar o'sha matn (5 g'oyaga moslangan: F-1015-185).

## A. Maqsad va qoidalar

**O'quvchi dars oxirida nima qila oladi**
1. G'oyani uch savol bilan saralaydi (bajariladimi · real auditoriya bormi · qiziqmi) va «yo'q» bo'lsa sababini aytadi.
2. RICE ning har sonini savol sifatida tushunadi: qamrov — «nechta odam?», ta'sir — «qanchalik yordam beradi?», ishonch — «dalil bormi?», mehnat — «necha hafta?».
3. O'z g'oyalariga RICE beradi va tartibni ko'radi: yuqori uchtasi qoladi, ikkitasi intervyuga.
4. Sonlar taxmin ekanini biladi: bitta son o'zgarsa, tartib o'zgaradi — RICE tanlovga yordam, hukm emas.

**Natija:** 5 → saralash → 4 → RICE → **3 g'oya**, ulardan **2 tasi** (`pm-m9d2-rice`: `otdi`, `baho`, `uchta`, `ikkita`, `sabab` — format o'zgarmaydi; 3-dars o'qiydi).

**Ekran qoidalari (213-qonun, 217-qonun, F-1015-189):** bir vaqtda bitta faol narsa; ekranda bitta chegarali karta (ichida bo'limlar fon bilan, chiziqsiz); hech narsa kartasiz osilmaydi; bog'liq narsalar bog'langan holda ko'rinadi (savol → g'oya qatori, son → formula → chiziq); punktir yo'q; qadamlar va karta bir enda (720px). Ranglar — dars palitrasi; Instagram/Snapchat nomi — o'z rangida.

**Mentor misoli** (dars bo'yi bir xil): Jamoa yig'ish · Maydon pulini bo'lishish · Mahalla to'garaklari · Sinf uy vazifalari · Eski darsliklar. Saralash: 1–4 o'tadi; Eski darsliklar — «Bajariladimi?» ✕ «pul va yetkazish kerak». RICE (v3 dagidek): 24 · 5 · 20 · 3,75.

**Nima o'zgardi (v3 → v4):**

| v3 | v4 | Sabab |
|---|---|---|
| Kirish: yo'l + 5 qatorli jadval alohida | bitta karta: yo'l va Mentor g'oyalari ichida | 213 |
| Reja: «? ? ?» panjarasi | voronka 5 → 4 → 3 → 2 | tushunarli natija |
| Saralash: bashorat, savollar, jadval — uch qavat, punktir | bitta karta: savol tugmasi karta tepasida, qatorlarga ✓ / ✕, «Chetda» fon bilan | 213, 217 |
| To'rt son: 4 × 5 jadval | bitta g'oya, to'rt savol bittalab (javob so'z bilan + son), formula, keyin to'rt g'oya chiziqda | eng qiyin tushuncha bittalab |
| Test: RICE arifmetikasi | Test: ishonch 50% nimani bildiradi | qaror 1A |
| O'z RICE: erkin son, kasr tugmalar, 4 qator birdan | savollar bittalab, tayyor tugmalar ma'nosi bilan; natija chiziqlarda | qaror 2A |
| «Mentorning qaysi soniga «nega?»» | «Bitta son o'zgarsa, tartib o'zgaradimi?» — jonli chiziqlar | asosiy fikr ko'rinmasdi |
| Kod: Mentorning to'rt g'oyasi | o'z RICE ma'lumoti | qaror 3A |

## 0 · Kirish
- Eyebrow: Kirish · Sarlavha: Beshta g'oyadan *qaysi uchtasi* qoladi?
- Mentor: O'tgan darsda beshta g'oya yozildi, bitiruvgacha esa bittasi quriladi. O'zingizga yaqin javobni belgilang.
- Maket (chap, bitta karta — F-1015-193 A): «Mentorning g'oyalari · 5» · bitta gap: «Dars oxirida shulardan uchtasi qoladi. Qaysilari — savollar va sonlar aytadi.» · besh qator (raqam, nom), fon bilan, chiziqsiz. Yo'l «5 → ? → 3» va manba yorliqlari yo'q.
- Variantlar va javob — v3 dagidek («Uchalasi ham hisobga olinadi. Mentor beshta g'oyasini aynan shu uch tomondan ko'rib chiqdi.»).

## 1 · Reja
- Eyebrow: Reja · Sarlavha: Bugun beshta g'oyadan *uchtasini* tanlab olasiz.
- Mentor: User Story darsida hikoyalarga navbat belgilagansiz (prioritet). Bugun beshta g'oyaga navbatni savollar va sonlar bilan belgilaysiz.
- Chap (yorliq «Dars oxirida»): voronka — to'rt blok: **5** g'oyangiz → **4** uch savoldan o'tdi → **3** RICE da yuqori — shular qoladi → **2** tasi birinchi intervyuga (oxirgisi ajratilgan). Ostida yashil qator (F-1015-194 A): «Qo'lingizda: 3 g'oya, har birining RICE soni va har «chetda» ga bitta sabab.»
- Reja (3 band): 1. Har g'oyaga uchta «ha / yo'q» savol berasiz · 2. RICE ning to'rt savoli bilan baholaysiz · 3. Bitta son o'zgarsa, tartib nima bo'lishini ko'rasiz

## 2 · Uch savol (bitta karta)
- Eyebrow: Tushuncha · saralash · Sarlavha: Mentorning qaysi g'oyalari *uch savoldan* o'tadi?
- Mentor: Savolni bosing — har g'oya javob oladi. «Yo'q» olgan g'oya chetga o'tadi.
- Uch holat ketma-ket (F-1015-195 A, 213-qonun):
  1. Faqat bashorat kartasi: «Avval o'zingiz belgilab ko'ring» · Beshta g'oyadan nechtasi uch savoldan o'tadi? · 2 ta · 4 ta · 5 ta. Tugma: «Avval taxminingizni belgilang.»
  2. Tanlangach bashorat ixcham qatorga yig'iladi («Taxminingiz: 4 ta»), ostidan savol-karta keladi: tepada joriy savol tugmasi (faqat bittasi; o'tganlari ixcham «✓ Bajariladimi?»): 1. Bajariladimi? (6 haftada qura olasizmi?) · 2. Real auditoriya bormi? (gaplasha oladigan 5 tanishingiz bormi?) · 3. Qiziqmi? (bitiruvgacha shu ustida ishlaysizmi?)
     - Ostida g'oya qatorlari (ikki ustun); har qatorda faqat so'ralgan savollar kataklari + navbatdagisi uchun bitta «?» (? → ✓ ? → ✓ ✓ ? → ✓ ✓ ✓). «Qoldi: N» yo'q.
     - «Bajariladimi?» → Eski darsliklar ✕ — qator «Chetda» bo'limiga o'tadi (fon bilan, sababi ostida: pul va yetkazish kerak); keyingi savol kataklari unda yo'q («— —» emas).
  3. Uch savoldan keyin natija so'z bilan: o'tgan qatorlarda yashil «uch savoldan o'tdi»; chetdagi qatorda «Bajariladimi? — yo'q» + sabab. Karta ichida izoh: Bitta «yo'q» yetadi: keyingi savollar unga berilmaydi. G'oyalarni uch savol bilan ajratish saralash deyiladi.
- Natija/xulosa: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz: N ta · haqiqatda: 4 ta» · To'rttasi o'tdi, bittasi chetda. U o'chirilmadi — bu modulga mos kelmadi, xolos.
- Tugma: Avval taxminingizni belgilang. → Savollarni bosing (N/3) → Davom etish

## 3 · 1-savol — v3 dagidek (real auditoriya; ✔ B)

## 4 · RICE — to'rt savol (bitta karta)
- Eyebrow: Tushuncha · RICE · Sarlavha: G'oyani *to'rt savol* bilan baholaymiz.
- Mentor: «Jamoa yig'ish» g'oyamga to'rt savol beraman. Har javob — bitta son.
- Uch holat ketma-ket (F-1015-196 A, 213-qonun), hammasi bitta kartada:
  1. Savol bittadan: tepada «Mentorning g'oyasi · Jamoa yig'ish» + muammo; formula qatori doim ko'rinadi va to'lib boradi (60 × … × … ÷ … = …); ostida bitta javob-qatori (oxirgi berilgan: savol · javob so'z bilan · son) va joriy savol tugmasi. Bosilgach son tugmadan formula katagiga uchadi, oldingi javob-qatori ketadi.
     1. **Qamrov** — Bir oyda nechta odam ishlatadi? → 60 ta o'yinchi → **60**
     2. **Ta'sir** — Har biriga qanchalik yordam beradi? → katta: o'yin bo'ladi yoki bo'lmaydi → **2**
     3. **Ishonch** — Bunga dalil bormi? → dalil bor: 9-Modulda 5 kishidan 2 tasi aytgan → **80%**
     4. **Mehnat** — Necha haftada quriladi? → 4 hafta → **4**
  2. To'rttasidan keyin: formula to'liq 60 × 2 × 80% ÷ 4 = **24** · ostida izoh: Bu baho RICE deyiladi — to'rt so'zning bosh harflari: Reach, Impact, Confidence, Effort. Bu kursda mehnat haftada sanaladi. · Bashorat: Qamrovi eng katta «Mahalla to'garaklari» (80) to'rt g'oya ichida nechanchi bo'ladi? · Birinchi · Ikkinchi · Uchinchi
  3. Taxmindan keyin g'oya sarlavhasi, formula va savol-qatorlar ketadi; kartada faqat «Mentorning to'rt g'oyasi · RICE» chiziqlari (RICE bo'yicha tartiblangan): Jamoa yig'ish 24 · Mahalla to'garaklari 20 · Maydon pulini bo'lishish 5 · Sinf uy vazifalari 3,75; yuqori uchtasi yonida «Uchta». Taxmin ixcham qatorda karta ustida.
- Natija/xulosa: «Taxminingiz to'g'ri chiqdi ✓» yoki «… · haqiqatda: ikkinchi» · Qamrovi eng katta g'oya ikkinchi bo'ldi: ta'sir va ishonch ham hisobga olinadi. RICE — tanlovga yordam, hukm emas.
- Tugma: Savolni bosing (N/4) → Davom etish

## 5 · 2-savol (qaror 1A)
- Eyebrow: Tekshiruv · ishonch
- Savol: «Mahalla to'garaklari»da ishonch 50%. *Bu nimani bildiradi?*
  - G'oya yomon — uni chetga chiqarish kerak
  - To'garakka o'quvchilarning yarmi qatnashadi
  - Mehnati ikki baravar ko'p vaqt oladi
  - ✔ Hali hech kim bilan gaplashilmagan
- Izohlar: To'g'ri: 50% — dalil yo'q, faqat taxmin: Mentor bu g'oya bo'yicha hali hech kim bilan gaplashmagan. · A: Ishonch g'oya yaxshi-yomonligini emas, dalil bor-yo'qligini aytadi. · B: Ishonch odamlar sonini emas — taxminga ishonchni bildiradi. · C: Vaqtni mehnat o'lchaydi. · Umumiy: Ishonch qaysi savolga javob ekanini eslang: dalil bormi?
- INLINE_KEYS.s5 = 3 (o'zgarmaydi).

## 6 · Instagram Stories — v3 dagidek (K14; sahna kartasi bitta, chiziqsiz)
## 7 · 3-savol — v3 dagidek (✔ A)

## 8 · Saralash (o'z g'oyalari) — v3/F-1015-172–173 dagidek; tepadagi «Saralandi n / N» qatori karta bilan bir enda (720px); 5 g'oya (F-1015-185).
- Yakun (F-1015-197 A): keyingi bosqichga kamida **2** g'oya kerak (3 emas). Tugagach «G'oyalarim» kartasida: o'tganlar «O'tdi ✓»; har qatorda «Qayta ko'rish» so'z-tugmasi (✎ emas); chetdagi qatorda qaysi savolda «yo'q» va sabab («Real auditoriya bormi? — yo'q · 5 tanish topa olmayman»). 2 dan kam o'tsa — karta ichida rangli qator: «Keyingi bosqichga kamida 2 g'oya kerak. Chetdagilardan bittasini qayta ko'ring.» Karta tashqarisida kulrang yo'riq yo'q.
- Xulosa — bitta gap: «N ta g'oyadan k tasi uch savoldan o'tdi, N−k tasi chetda turibdi.» + «Uch savol g'oyani yoqqan-yoqmaganiga emas, sababga qarab saraladi.» (sabablar ro'yxati takrorlanmaydi — qatorlarda bor).

## 9 · RICE bahosi (qaror 2A)
- Eyebrow: Mustaqil ish · Sarlavha: G'oyalaringizga *RICE* bering.
- Mentor: Har g'oyaga to'rt savol: javobni tanlang — son o'zi qo'yiladi.
- Bitta karta: tepada «Baholanganlar · n / k» (har qator: yechim, RICE, ✎), ostida joriy g'oya («n-g'oya»: yechim qalin, muammo kulrang). Savollar bittalab ochiladi (javob berilgach keyingisi; javob berilgani ixcham qator «Qamrov · 30 ga yaqin · 30» ↻ bilan):
  1. **Qamrov** — Bir oyda nechta odam ishlatadi? · 10 ga yaqin (10) · 30 ga yaqin (30) · 60 ga yaqin (60) · 100 dan ko'p (100)
  2. **Ta'sir** — Har biriga qanchalik yordam beradi? · ozgina (0,5) · sezilarli (1) · katta (2) · juda katta (3)
  3. **Ishonch** — Bunga dalilingiz bormi? · faqat taxmin (50%) · kimdir aytgan (80%) · sanab ko'rganman (100%)
  4. **Mehnat** — Necha haftada qurasiz? · 1 · 2 · 3 · 4 · 5 · 6 hafta (6 tanlansa kulrang qator: «6 hafta — butun modul: «Bajariladimi?» javobini qayta ko'ring.»)
  - Formula qatori (doim ko'rinadi, to'lib boradi): 30 × … × … ÷ … = …
  - Tugmalar: Yordam · Saqlash (to'rt javobsiz: «Hali javob berilmagan savol bor.»)
  - Yordam: Mentorning «Jamoa yig'ish» javoblari namuna sifatida (60 ta o'yinchi · katta · 9-Modulda 2 kishi aytgan · 4 hafta).
- Hammasi baholangach (F-1015-198 A): karta ichida chiziqlar (RICE bo'yicha), yuqori uchtasi «Uchta» (2 ta o'tgan bo'lsa — «O'tganlar»); teng baho — qatorning o'zida «N-bilan teng»; har yuqori qatorda «Intervyuga» tugmasi (RICE taklifi — birinchi ikkitasi belgilangan), almashtirsa sabab qatori. Karta ichida bitta qator: «Intervyuga ikkitasi belgilangan. Boshqasini xohlasangiz, almashtiring.» (2 ta bo'lsa: «Ikkalasi intervyuga boradi.»). Alohida «Baho teng…» qatori va pastki yashil xulosa yo'q.
- Saqlash formati o'zgarmaydi: `baho: [{ goya, qamrov, tasir, ishonch, mehnat, rice }]`.

## 10 · Son o'zgarsa tartib (juftlik / yakka)
- Eyebrow: Juftlikda ish (yakka rejimda: Mustaqil ish) · Sarlavha: Bitta son o'zgarsa, *tartib* o'zgaradimi?
- Yakka rejim — Mentor: «Mahalla to'garaklari»da ishonchni 50% qo'ygandim — hali hech kim bilan gaplashmaganman. Agar 5 kishi «ha, kerak» desa-chi?
  - Bitta karta: tepada tanlov «Mahalla to'garaklari · ishonch»: 50% — taxmin · 80% — dalil bor; ostida to'rt g'oya chiziqlari (jonli qayta tartiblanadi)
  - 80% tanlansa: Mahalla to'garaklari 32 — birinchi o'ringa chiqadi; xulosa: Bitta son o'zgardi — «Mahalla to'garaklari» birinchi o'ringa chiqdi. Shuning uchun har songa sabab yoziladi, RICE esa tanlovga yordam beradi, hukm qilmaydi.
- Juftlik rejimi — Mentor: Birinchi o'rindagi g'oyangizni sherigingizga ko'rsating — u bitta sonni tanlab, «nega?» deb so'raydi.
  - Bitta karta: g'oya sonlari (bosiladi) → taymer 1:00 → ✓ Son qoladi · ✎ Sonni o'zgartiraman (o'sha savol tugmalari ochiladi) → ostida o'z uchta g'oyasi chiziqlari jonli qayta tartiblanadi; xulosalar — v3 dagidek.
- Tugma: Tanlang → Davom etish

## 11 · Kod (qaror 3A)
- v3 dagidek (VS Code, `rice.js` qo'lda), lekin `goyalar` — o'quvchining baholangan g'oyalari (`pm-m9d2-rice.baho` + 1-dars nomlari, `nom` — yechimning qisqa ko'rinishi); topilmasa — Mentorning to'rt g'oyasi va izoh `// g'oyalaringiz topilmadi — Mentorning to'rttasi`.
- Shart 3 va «Kutilgan natija» — o'quvchi ma'lumotidan hisoblangan yuqori uchtasi («1. … — 24»).
- Sarlavha: G'oyalaringizni *RICE bo'yicha* tartiblaydigan kod yozamiz.

## 12 · Yakuniy savol — v3 dagidek (✔ C)

## 14 · Kartochkalar — v3 dagidek, ikki karta almashadi:
| «Ta'sir qaysi sonlar bilan belgilanadi?» → «So'z bilan: ozgina 0,5 · sezilarli 1 · katta 2 · juda katta 3» |
| «Bu kursda ishonch qachon 80% bo'ladi?» → «Kimdir aytgan bo'lsa — dalil bor; faqat o'zingiz o'ylagan bo'lsa 50%» |

## 15 · Yakun — v3 dagidek; «Endi siz bilasiz» 2-qatori: «Har son — bitta savolga javob: nechta odam, qanchalik yordam, dalil bormi, necha hafta.»

## Jonli viktorina — v3 dagidek, 7-savol almashadi (to'g'ri o'rni C saqlanadi):
7. Ishonch 50% dan 80% ga ko'tarilsa, RICE nima bo'ladi? · Kamayadi — mehnat oshadi · O'zgarmaydi — qamrov bir xil · ✔ Oshadi — g'oya yuqoriga chiqishi mumkin · Nolga tushadi — dalil yo'q

## Qurilishda aniqlangan (17.10) — kod shunday
- **Reja voronkasi** — yuqoridan pastga torayadigan to'rt blok (5 · 4 · 3 · 2), oxirgisi to'q rangda; strelkasiz (shakli o'zi yo'nalishni ko'rsatadi).
- **4-ekran bashorati** karta ichida, formula ostida (fon bilan bo'lim). Chiziqlar avval kirish tartibida chiqadi, ~1 s dan keyin RICE bo'yicha qayta tartiblanadi — «Mahalla to'garaklari» uchinchidan ikkinchiga siljiydi. Har chiziq ostida «80 × 1 × 50% ÷ 2».
- **5-ekran** — testdan keyingi vizual yo'q (F-1015-175: javob izohi yetarli).
- **9-ekran**: javob tugmasi — so'z + son ostida («30 ga yaqin / 30»); mehnat — 1…6 va «hafta». Natijada «Uchta» guruhi va har qatorda «Intervyuga» tugmasi (RICE taklifi — birinchi ikkitasi belgilangan); almashtirilsa «Nega aynan shu ikkitasi?» qatori.
- **10-ekran yakka**: ishonch tugmalari «50% — taxmin · 80% — dalil bor»; 80% tanlanganda xulosa chiqadi (50% ga qaytsa xulosa yashiriladi). Qadamlar qatori faqat juftlikda.
- **11-ekran kodi**: o'quvchining kamida ikkita (F-1015-197) baholangan g'oyasi bo'lsa — ular (nom so'z chegarasida 30 belgigacha), aks holda Mentorning to'rttasi. Tayyor qismda baho bir xonagacha yaxlitlanadi: `g.baho = Math.round(rice(g) * 10) / 10;` — terminal «26.666…» emas, «26.7» chiqaradi; «Kutilgan natija» va 3-shart aynan shu hisobdan.
- Eski RICE jadvali (`RiceJadval`), ta'sir/ishonch shkalalari va «Mentorning qaysi soniga «nega?»» sahnasi koddan olib tashlandi.
- **17.10 ko'rik (F-1015-193…199):** 0-ekran yo'lsiz · reja 3 band + «Qo'lingizda» · 2 va 4-ekran uch holat (taxmin avval, bittadan) · 8-ekran shart 2 + «Qayta ko'rish» · 9-ekran teng belgisi qatorda, bitta izoh qatori · Natijalar o'zgarmagan. Yakka rejimda «Pair Review» nishoni yo'q (F-1015-191).
