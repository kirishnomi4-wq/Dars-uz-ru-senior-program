# 6-Modul (LMS: 8-Modul) · 14-dars (PM) «Raqamingiz nimani isbotlaydi?» — MD v3

Fayl: `src/6-Modull/PmLesson25.jsx` · 16 ekran (tuzilma va ekran raqamlari o'zgarmaydi) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: `14-PmLesson25-v2.md`. v3 o'zgargan ekranlarni to'liq yozadi; «v2 dagidek» deyilgan joy matni v2 dan olinadi.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: s3 = 2-variant (`correctIdx 1`), s5 = 3 (`2`), s7 = 1 (`0`), s11 = 2 (`1`) — `INLINE_KEYS` bilan bir xil; arena kaliti o'zgarmaydi.
⚠️ Uyga vazifa (`HwCard`, `HW_STEPS`) — tegilmaydi (PM-027), faqat xabar qilinadi.
Guruh G4 (PM): PM-107 — avval aniq misol, keyin atama · PM-028/029 — keys · mustaqil ish `QMustaqil`. F-1004 PM 2-to'lqini (40–46, `DeckMock`) saqlanadi.

---

## A. Darsning tayanchi (v2 A o'z kuchida + v3 qoidalari)

1. **Bosh formula (o'zgarmaydi):** raqam → u nimani sanadi → u nimani ko'rsatadi. Bu — slaydning uch qatori.
2. **Ikki atama — misoldan KEYIN, bir marta (PM-107).** 2-ekranda o'quvchi oltita raqamni ikki tomonga joylaydi, shundan keyin tomonlar nom oladi:
   - **natija raqami** — tizim foydalanuvchi uchun bajargan ishni sanaydi (ta'rif dars bo'yi so'zma-so'z shu, T-042);
   - **mehnat raqami** — qurishga ketgan ishni sanaydi (satr, hafta, sahifa): rost, lekin natijani ko'rsatmaydi.
   Keyin faqat shu ikki nom. v2 da bir narsaning uch nomi bor edi — «dalil beradigan raqam», «tizim foydalanuvchi uchun bajargan ishni sanagan raqam»
   va «natija raqami» (T-014 sinonim) → hammasi **natija raqami**. «Dalil» — faqat nima berishi: «sahnada natija raqami — kuchli dalil» (2-ekran xulosasi, yakun, 11-karta).
   Dars nomidagi savolga javob shu: raqam isbotlamaydi, dalil beradi.
3. **Natija raqamida ikki daraja:** «ochdi» — foydalanish boshlangani · «javob oldi» — ish oxirigacha yetgani. Sahnaga ikkinchisi chiqadi.
4. **Uchinchi qator ehtiyotkor:** raqam nimani ko'rsatsa — shuni; «men …» emas; ikkinchi qatorni takrorlamaydi.
5. **«Natija» bir ma'noda (T-015):** dars matnida faqat «natija raqami». Kod ekranida `console.log` «qiymatni chiqaradi», shart «kutilgandek chiqdi»
   (v2: «natijani chiqaradi», «Uch natija to'g'ri chiqdi» — ikkinchi ma'no). Platforma so'zlari (podium «Natijalar», kompilyator paneli) — tegilmaydi.
6. **So'zlar (v2 dagidek):** raqamga izoh berish · ariza (lug'at izohi bilan, F-0929-23 qarori) · Kod yozish · O'zingiz o'ylab ko'ring · Rejangizda.
   «slayd» izohi olindi — 1–5-Modulda 71 darsda bor. Shior yo'q (T-042): «ilovani yaratayotgan odam — siz» → oddiy gap «… siz hal qilasiz».
7. **Toza yuza (185):** tugma, variant, karta, yorliq, recap'da emoji yo'q (v2 dagi 🔧 👥 🔎 🧭 🎯 💡 ⏳ 📄 ✅ 🤔 🚀 ⏹ ⌨️). O'yin qatlami (arena, nishon, podium) — mustasno.

## Darsning ipi va bitta vizual

- **Ip:** Demo Day sahnasi. Hook'da slaydda yolg'iz «41» → dars bo'yi slayd qatorlari yozilib boradi → 8-ekranda o'quvchi o'z tizimining slaydini yozadi →
  Demo Day 3 da u sahnaga chiqadi (App.jsx: m6-16, modulning oxirgi darsi).
- **Raqamlar manbai — 12-darsdagi navbat ilovasi** (sartaroshxonaga navbat oladigan ilova; PM-107 aniq misol, P-021 ko'prik). Oltita raqam bitta manbada (`RAQAMLAR`, 180),
  matnlari v2 dagidek (kod, juftlik, arena shularga bog'langan):
  `312 ta kod satri yozildi` · `5 hafta ishlandi` · `7 ta sahifa qilindi` — mehnat · `41 odam tizimni ochdi` · `9 odam telefondan ochdi` — natija, boshlandi ·
  `12 odam arizasiga javob oldi` — natija, oxirigacha.
- **Bitta vizual — Sahna (`SahnaSlayd`, dars bo'yi):** tepada oq slayd-karta (yorliq «Sahna ekrani»), ichida 3 qator: 1 — raqam (katta, mono) · 2 — u nimani sanadi ·
  3 — u nimani ko'rsatadi. Ostida **zal**: to'rtta chizilgan bosh-siluet (CSS doira + yarim doira, emoji emas) va ular ustida bitta **savol pufagi**.
  - Qator holatlari: bo'sh (kulrang uzuq chiziq — skelet) → yozildi (matn bir lahza ajralib kiradi) → joriy (accent chegara) → xato (`err` fon) → slayd to'liq (chap chetda yashil chiziq).
  - Zal: slayd to'liq gapirmaguncha pufakda savol («41 nima?» → «Bu nimani ko'rsatadi?»); to'liq bo'lsa pufak o'rnida yashil ✓.
  - Ishlatiladi: 0 · 1 · 4 · 5 (kichik) · 8 · 9 · 12. Airbnb (6) — o'z keys-maketi `DeckMock` (PM-029, F-1004 2-to'lqin — saqlanadi).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish · Demo Day sahnasi
- Sarlavha: **Sahnadagi bu slayd nima qiladi?** (31)
- Mentor: Modul oxiridagi Demo Day'da siz ham shu sahnaga chiqasiz. Zaldagi odamlar slaydingizni birinchi marta ko'radi.
- Maket (chap): Sahna — slaydda faqat `41`, 2–3-qator bo'sh chiziq; zal jim.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Ko'zga tashlanadi — katta raqam birinchi ko'rinadi (50)
  - Savol tug'diradi — odam «41 nima?» deb so'raydi (47)
- Javob (ikkalasida bir xil, maqtovsiz — J-026, 104-qonun): Ikkalasi ham bo'ladi. Lekin slayd 41 nimaning soni ekanini aytmaydi — bugun shuni yozasiz. (90)
- **Harakat → Vizual o'zgarish:** variantni tanlash → zal ustida savol pufagi chiqadi «41 nima?», slaydning ikki bo'sh qatori bir lahza yonib o'chadi (joy bo'sh).
  Jonli darsda ovozlar chizig'i — v2 dagidek.
✎ javob 196 → 90 (162) · «darrov» → «birinchi» (§221) · Mentordagi «slayd — taqdimotning bitta sahifasi» olindi · QKirish standarti (radio, DE-201) — F-1004-40 «bitta ustun» o'rniga qolip

## 1 · Reja  ← QReja
- Eyebrow: Maqsad
- Sarlavha: **Bugun sahna uchun bitta slayd yozasiz.** (38)
- Mentor: Bu slayd 12-darsdagi navbat ilovasi uchun yozilgan.
- Chap: «Dars oxirida — o'z tizimingiz uchun shunday slayd» + Sahna: qatorlar 0.9 s oraliqda o'zi yoziladi —
  `8` · `odam bugun navbatga yozildi` · `demak tizim navbatga yozishni oxirigacha bajaradi`; oxirida zal pufagi ✓.
- O'ng (01 · matn · teg):
  - 01 · Qaysi raqam foydalanuvchi haqida ekanini ajratasiz · `ajratish`
  - 02 · Slaydning qatorlarini birma-bir ochasiz · `slayd`
  - 03 · Airbnb taqdimotida raqam qayerda turganini ko'rasiz · `voqea`
  - 04 · O'z tizimingiz uchun slayd yozasiz · `sahna`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi.
✎ slayd yonidagi yorliqlar («raqam», «nimani sanadi», «nimani ko'rsatadi») olindi — ularni o'quvchi 4-ekranda o'zi ochadi (P-015) ·
demo slaydi navbat ilovasiga bog'landi; v2 dagi «8 odam arizasiga javob oldi» 2-ekrandagi «12 odam arizasiga javob oldi» bilan bir tizimda zid edi → boshqa raqam
(«bugun navbatga yozildi»), 4-ekran javobini ham ochmaydi · reja kartalari qo'shildi (QReja, DE-201)

## 2 · Ikki tomon  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · ikki xil raqam
- Sarlavha: **Bu raqam kimning ishini sanaydi?** (32)
- Mentor: Raqamlar 12-darsdagi navbat ilovasidan, hammasi rost. Har birini o'z tomoniga joylang.
- Izoh (bitta qator, `QIzoh`): Ariza — foydalanuvchi ilovada yuborgan navbat so'rovi. (54)
- Bashorat (ballsiz, 181): **Bu raqamlardan nechtasi foydalanuvchi haqida?** · 2 · 3 · 4 — tanlov saqlanadi.
- Vizual (ikki tomon, bir balandlikda):
  - chap **Tizimni qurish** — kod oynasi (bo'sh satr-skeleti), 6 katakli kalendar, varaqlar to'plami;
  - o'ng **Tizimdan foydalanish** — telefon ramkasi (191), ichida navbat ilovasi: sarlavha «Navbat», bo'sh ro'yxat;
  - tepada 6 raqam-karta, aralash tartibda.
- **Harakat → Vizual o'zgarish:** raqam-kartani bosib, tomonni bosish (yoki sudrash) → to'g'ri bo'lsa karta o'sha tomonga kiradi VA maket o'zgaradi:
  `312` — kod oynasida satrlar yozilib chiqadi, burchakda «312» · `5 hafta` — kalendarda 5 katak bo'yaladi · `7 sahifa` — varaqlar 7 qatlam bo'ladi ·
  `41` — telefonda «Ochildi: 41» qatori · `9` — ramka ostida «telefondan: 9» · `12` — telefonga «Navbatingiz tasdiqlandi» xabari tushadi, «Javob oldi: 12».
  Noto'g'ri tomon → karta silkinib qaytadi, bir qator (`QXato`):
  - qurish raqami foydalanish tomoniga: Bu raqam tizimni qurishga ketgan ishni sanaydi. (47)
  - foydalanish raqami qurish tomoniga: Bu raqam foydalanuvchi tomonida bo'lgan ishni sanaydi. (54)
- 6/6 da: tomonlar ustida nom paydo bo'ladi (atama — misoldan keyin, bir marta): chap **mehnat raqami**, o'ng **natija raqami**.
  Natija qatori (`QTaxmin`): «Taxminingiz: 2 · haqiqatda: 3» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Natija raqami tizim foydalanuvchi uchun bajargan ishni sanaydi. Sahnada u — kuchli dalil. (89)
- Tugma (pastki): 6 raqamni joylang (N/6) → Davom etish · `tugadi`: kartalar paneli yopiladi, ikki tomon butun enga (199).
- O'qituvchi eslatmasi: Mehnat raqamini «yomon» demang — u rost, faqat natijani ko'rsatmaydi. 41 va 9 haqidagi bahsni 4-ekranga qoldiring.
✎ 2 matn-karta akkordeoni («🔧 Men qilgan ish» / «👥 Tizim foydalanuvchi uchun qilgan ish» — «bosish → matn-karta», DE-184) → saralash + ikki maket o'zgaradi ·
atama saralashdan KEYIN (PM-107) · bashorat qo'shildi (181) · xulosa 2 blok (≈190) → 1 (89) · «mehnat raqami foydasiz emas» — o'qituvchi eslatmasi va 2-kartochkada

## 3 · 1-savol  ← QTest (✔ 2-variant, `correctIdx 1`)
- Eyebrow: Tekshiruv · natija raqami
- Savol: **Slaydga uch raqam taklif qilindi. Qaysi biri natija raqami?** (10 so'z)
  - Tizimni qurishda uch dasturchi qatnashdi (40)
  - ✔ Uch odamning arizasi ko'rib chiqildi (36)
  - Ariza formasiga uch hafta vaqt ketdi (36)
- To'g'ri izohi: Ariza ko'rib chiqildi — tizim foydalanuvchi uchun ish bajardi.
- Xato izohlari: 1 — Qurishda qatnashgan odamlar — mehnat raqami. (44) · 3 — Uch hafta — qurishga ketgan vaqt, ya'ni mehnat. (47) ·
  (umumiy) Tizim foydalanuvchi uchun nima qildi — shuni toping. (52)
✎ savol 15 → 10 so'z, atama bilan (misol-savol, T-070) · to'g'ri javob eng uzun edi (47/35/35) → 40/36/36 · izohlar ≤60

## 4 · Slayd qachon gapiradi  ← QTushuncha (markaziy; harakat saqlandi, natija vizualga o'tdi)
- Eyebrow: Tajriba · slaydning uch qatori
- Sarlavha: **Slayd qachon to'liq gapiradi?** (29)
- Mentor: Qatorlarni birma-bir oching va zaldagi savolga qarang.
- Chap — qadam-ro'yxati (`QQadamlar`, 163.8): 1 raqam · 2 nimani sanadi · 3 nimani ko'rsatadi (joriy — accent, o'tgani ✓). O'ng — Sahna.
- **Harakat → Vizual o'zgarish:** joriy qatorni bosish → slaydga qator yoziladi va zal pufagi o'zgaradi:
  1. `41` → pufak «41 nima?»
  2. `odam tizimni ochdi` → pufak «Bu nimani ko'rsatadi?»
  3. `demak odamlar tizimni ochib ko'rgan` → pufak o'rnida ✓, slayd chap chetida yashil chiziq.
  42 soniya harakatsizlikda bitta ipucha (javobni aytmaydi): Keyingi qatorni oching — zal yana nima so'rashini ko'ring.
- 2-bosqich (3/3 dan keyin, shu ekranda; savol kartalar USTIDA, kartalar bir balandlikda — F-1004-42):
  - Savol-qatori: Lekin «ochdi» — faqat foydalanish boshlangani. Qaysi raqam natijaga yaqinroq? (77)
  - Ikki raqam-karta: **9** odam tizimni telefondan ochdi · **12** odam arizasiga javob oldi (ballsiz; to'g'risi 12)
  - Tanlagach ikkala karta ostida izoh: 9 — Ochish — foydalanish endi boshlangani. (38) · 12 — Javob olish — ish oxirigacha yetgani. (37)
  - **Vizual:** `12` tanlansa slayd qayta yoziladi: `12` · `odam arizasiga javob oldi` · `demak tizim arizani oxirigacha ko'rib chiqa oladi`, zal ✓;
    `9` tanlansa slaydda `9`, pufak «Ish oxirigacha yetdimi?», 12-karta yonadi.
- Xulosa: Raqam uch qator bilan gapiradi; sahnaga ish oxirigacha yetganini ko'rsatgani chiqadi. (85)
- Tugma (pastki): Qatorlarni oching (N/3) → Bittasini tanlang → Davom etish · `tugadi`: qadam-ro'yxati yopiladi, slayd butun enga.
- Nishonlar: Slide Talker (3 qator ochildi), Result Finder (birinchi tanlov — 12) — v2 dagidek.
✎ har qatordan keyingi javob-matni → zal savol pufagi (natija vizualda, DE-184) · sarlavha buyruqdan savolga · tanlangan raqam slaydga chiqadi ·
2 blokli xulosa (≈140) → 1 (85) · duel izohlari 85 → ≤38 · ipucha emojisiz

## 5 · 2-savol  ← QTest (✔ 3-variant, `correctIdx 2`; eslash → qo'llash)
- Eyebrow: Tekshiruv · uchinchi qator
- Savol ustida kichik Sahna: `9` · `odam tizimni telefondan ochdi` · 3-qator bo'sh chiziq.
- Savol: **Slaydning uchinchi qatoriga nima yoziladi?** (5 so'z)
  - demak men tizimni yaxshi qurganman (34)
  - demak to'qqiz odam telefondan ochgan (36)
  - ✔ demak tizim telefonda ham ochiladi (34)
- To'g'ri izohi: Bu qator ikkinchisini takrorlamaydi va tizim haqida yangi gap aytadi.
- Xato izohlari: 1 — Uchinchi qator sizni emas, tizimni tanishtiradi. (48) · 2 — Bu ikkinchi qatorni qayta aytadi — yangi gap yo'q. (50) ·
  (umumiy) Uchinchi qator tizim haqida yangi gap aytadi. (45)
- Tanlagach: kichik slaydning 3-qatoriga tanlangan gap yoziladi (to'g'ri — yashil, xato — `err` fon).
✎ eslash-savol (to'g'ri javob = qator nomi «nimani ko'rsatishini»; arena 5-savol bilan bir kalit ibora — S-008) → qo'llash-savol: 8-ekrandagi ikki tekshiruv
(«men …», takror) shu yerda oldindan mashq qilinadi · ✔ o'rni 3 · `RECAPS[5]` savoli yangilanadi · ru «⌨️» olinadi

## 6 · Airbnb  ← QVoqea
- Eyebrow: Biznes olamidan (PM-028)
- Sarlavha: **Airbnb taqdimotida raqam qayerda turgan?** (40)
- Mentor: Airbnb — boshqa odamning uyida ijaraga turish sayti. U ishini birinchi marta investorlarga shu varaqlar bilan tushuntirgan.
- Nuqtalar (6) · yorliq **Airbnb · N/6** (bashorat kartasida ham) · maket `DeckMock` (11 varaq, «AirBed & Breakfast» o'z rangida, logotip yo'q, son o'ylab topilmagan — ustun-belgi).
- Bosqichlar (karta matni qisqa; karta cho'zilmaydi — F-1004-45):
  - 1/6 **O'ndan ortiq oddiy varaq** — Birinchi taqdimot shunday bo'lgan. · maket: 11 varaq yelpig'ichdek yoyiladi
  - 2/6 bashorat — **Varaqlardan biri raqam bilan gapirgan. U nimani ko'rsatgan?** · Saytda nechta uy borligini · ✔ Qiyinchilik qancha odamda borligini · Jamoada nechta odam ishlaganini
  - 3/6 **Raqam qaysi varaqda turgan** — Qiyinchilik va yechimdan keyingi varaqda: u qiyinchilikni qancha odam boshdan kechirayotganini ko'rsatgan. · maket: 3-varaq ko'tariladi, ustida ustun-belgi o'sadi
  - 4/6 bashorat — **Varaqlarni besh qadamga bo'lsak, raqamli qadam qayerda?** · Eng birinchi qadamda · ✔ Qiyinchilik va yechimdan keyin · Eng oxirida, jamoadan keyin
  - 5/6 **Raqamli qadam o'rtada** — 1 qiyinchilik · 2 yechim · **3 qiyinchilik qancha odamda** · 4 sayt · 5 jamoa (3-qadam yashil) · ostida: Besh qadam — bizning soddalashtirishimiz.
  - 6/6 **Taqdimot bugun ham ochiq** — Bu varaqlarni internetda topib, o'zingiz ko'rishingiz mumkin. · maket: manzil qatori «taqdimot · internetda ochiq»
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: …» yoki «Taxminingiz to'g'ri chiqdi».
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» yoki bashorat varianti → `DeckMock` holati o'zgaradi: kirish (11 varaq yoyiladi) → raqam (3-varaq ko'tariladi,
  ustun-belgi o'sadi) → besh qadam (3-qadam yashil yonadi) → ochiq (manzil qatori chiqadi). Bashoratda tanlangan variant ✓/✗ va `QTaxmin` qatori.
- Xulosa (6/6 dan keyin, ko'prik o'rnida, hisoblagichsiz): Airbnb'da raqam qiyinchilikning davomi bo'lgan. Slaydingizda ham raqam yolg'iz turmaydi. (88)
- Tugma (pastki): Keyingi bosqich (N/6) → Davom etish
- O'qituvchi eslatmasi — v2 dagidek (asl varaqlar internetda; raqam vaqtinchalik uy e'lonlari soni edi).
✎ eyebrow «Haqiqiy voqea» → «Biznes olamidan», yorliq «Airbnb · N/6» (PM-028) · sarlavha «Bizning olamdan mashhur voqea» → savol · brend izohi birinchi ko'rinishda —
Mentorda (S-018; v2 da sarlavhadan keyin 1/6 kartada edi) · «Topdingiz! / Adashdingiz —» → `QTaxmin` · 6/6 «eng ko'p o'rganiladigan taqdimotlardan biri» (manbasiz baho) olindi ·
ko'prik (≈230) → bitta xulosa (88); «… siz hal qilasiz» 8-ekran Mentoriga ko'chdi · fakt-manba v2 da (29.09, slidebean)

## 7 · 3-savol  ← QTest (✔ 1-variant, `correctIdx 0`; Airbnb qoidasi navbat ilovasiga)
- Eyebrow: Tekshiruv · Airbnb'dagidek
- Savol: **Slayd: «Sartaroshga navbat kutish qiyin». Keyingi varaqda qaysi raqam turadi?** (10 so'z)
  - ✔ Navbat kutib qiynalgan odamlar soni (35)
  - Ilovani qurishga ketgan haftalar soni (37)
  - Shahardagi sartaroshxonalar soni (32)
- To'g'ri izohi: Airbnb'dagidek: raqam qiyinchilik qancha odamda borligini ko'rsatadi.
- Xato izohlari: 2 — Bu mehnat raqami — qiyinchilik haqida gapirmaydi. (49) · 3 — Sartaroshxonalar soni qiyinchilik kattaligini aytmaydi. (55) ·
  (umumiy) Qiyinchilikdan keyingi varaq uning kattaligini ko'rsatadi. (58)
✎ eslash-savol (to'g'ri javob 6-ekran bashoratining o'zi edi, so'zma-so'z) → ko'chirish-savol: Airbnb qoidasi o'sha navbat ilovasiga · Airbnb'ni eslash savollari
arenada qoladi (8, 9) · `RECAPS[7]` yangilanadi

## 8 · Mustaqil ish  ← QMustaqil
- Eyebrow: Mustaqil ish
- Sarlavha: **Sahnaga chiqadigan slaydni yozing.** (34) — v2 dagidek
- Kirish qatori (kulrang, bitta; ikki tarmoq bir shaklda): Rejangizdagi hozirgi ish: «{12-darsdan saqlangan ish}». Tizimingiz uni bajarganini qaysi raqam ko'rsatadi?
  — 12-dars ma'lumoti yo'q bo'lsa: «tizimingizning asosiy ishi».
- Mentor: Qaysi raqam sahnaga chiqishini siz hal qilasiz — tizimni siz yaratyapsiz. Uchinchi qatorda ehtiyot bo'ling: raqam nimani ko'rsatsa, shuni yozing.
- Bitta ustun: Sahna (3 qator = qadamlar 1/2/3, joriy qator accent) → forma (bitta maydon) → Yordam · «Slaydga chiqarish» o'ngda (187).
- Maydon maslahati: 1 — Qaysi raqam sahnaga chiqadi? · 2 — Bu raqam nimani sanadi? · 3 — Bu raqam tizim haqida nimani ko'rsatadi?
- Tekshiruv (`QXato`, ≤60; faqat 1-qator bloklaydi, qolgani yo'naltiradi):
  - 1-qatorda son yo'q: Birinchi qatorga son yozing. (28)
  - 2-qatorda mehnat so'zi (kod, satr, hafta, soat, ekran, dastur, sahifa): Bu mehnat raqamiga o'xshaydi — natija raqamini toping. (54)
  - 3-qator 2-qatorni takrorlasa: Uchinchi qator yangi gap aytsin. (32)
  - 3-qator «men …» bilan boshlansa: Uchinchi qator siz haqingizda emas, tizim haqida. (49)
- Doimiy qator (forma ostida): Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz.
- Yordam: Tizimni kimdir sinagan bo'lsa — o'sha odamlarni sanang. Hali hech kim sinamagan bo'lsa — tizim bajargan ishlarni sanang.
- **Harakat → Vizual o'zgarish:** qatorni yozib «Slaydga chiqarish» → slaydga qator kiradi, joriy belgi keyingi qatorga o'tadi; tekshiruvdan o'tgan qator yashil chiziq
  oladi, o'tmagani `err` fonda va ostida bitta `QXato` qatori; zal pufagi qator bo'yicha («… nima?» → «Bu nimani ko'rsatadi?» → ✓).
  3/3 da forma yopiladi, slayd butun enga (199), har qator yonida ✎ (tahrirlash).
- Xulosa: Slaydingiz tayyor — u Demo Day 3 da shu holda sahnaga chiqadi. (62)
- Tugma (pastki): Uch qatorni yozing (N/3) → Davom etish
✎ F-1004-17 naqshi: TOPSHIRIQ kartasi (🎯 + 3 tekshiruv), «Qo'shimcha», «✅ Uch qator ham joyida», «… qatori slaydga chiqdi» xabari olindi — tekshiruv natijasi
slayd qatorining o'zida · 1/2/3 doiralar + alohida slayd → bitta slayd (qatorlar = qadamlar) · xabarlar 140 → ≤54 · zaxira «tizimni odamlarga ko'rsatish» gapga tushmasdi →
«tizimingizning asosiy ishi» · Mentor UI ta'rifi (T-047) → kim hal qiladi + ehtiyot qoidasi (arena 12-savoli shu yerdan) · ru «🧭» olinadi

## 9 · Uch juftlik  ← QTushuncha
- Eyebrow: Mashq · uch juftlik
- Sarlavha: **Qaysi raqam slaydga chiqadi?** (28)
- Mentor: Har juftlikda ikkala raqam ham rost, slaydda esa bitta joy bor.
- Juftlik hisoblagichi «1 / 3» · chapda ikki raqam-karta (bir balandlikda) · o'ngda Sahna (1–2-qator bo'sh).
- Juftliklar (✔ o'rni v2 dagidek; tanlagach ikkala karta ostida izoh):
  1. 312 ta kod satri yozildi — *mehnat raqami* · ✔ 41 odam tizimni ochdi — *natija raqami: foydalanish boshlangani*
  2. ✔ 9 odam telefondan ochdi — *natija raqami: tizim telefonda ham ochiladi* · 7 ta sahifa qilindi — *mehnat raqami*
  3. 41 odam tizimni ochdi — *foydalanish boshlangani* · ✔ 12 odam arizasiga javob oldi — *ish oxirigacha yetgani*
- **Harakat → Vizual o'zgarish:** kartani tanlash → tanlangan raqam slaydning 1–2-qatoriga yoziladi; to'g'ri bo'lsa zal ✓, xato bo'lsa zal pufagi:
  1–2-juftlikda «Bu foydalanuvchiga nima berdi?», 3-juftlikda «Ish oxirigacha yetdimi?». Keyin «Keyingi juftlik».
- Yordam (birinchi xatodan keyin): Bitta savol bering: bu raqam kimning ishini sanadi — tizimni qurgan odamningmi yoki foydalanuvchiningmi?
- Xulosa (3/3): Sahnaga natija raqami chiqadi; ikkalasi natija bo'lsa — ish oxirigacha yetgani. (79)
- Tugma (ichki): Keyingi juftlik / Yakunlash · (pastki): 3 juftlikda tanlang (N/3) → Davom etish · `tugadi`: kartalar yopiladi, slayd va uch tanlov qatori fokusga.
- O'qituvchi eslatmasi — v2 dagidek (juftlikda sherik slaydiga bitta savol).
✎ umumiy «✅ Sahnaga shu raqam chiqadi — u tizim foydalanuvchi uchun …» / «🤔 Bu raqam ham rost …» olindi (3-juftlikda ikkala raqam ham shunday — noto'g'ri edi;
izoh va zal yetadi, T-047) · sarlavha 49 → 28, savol · Mentor 3 gap → 1 · xulosa ≈150 → 79 · izohlar atama bilan

## 10 · Kod yozish  ← QKod
- Eyebrow: Kod yozish
- Sarlavha: **Natija raqamlarini ajratadigan kod yozamiz.** (43) — PM-082(a) sarlavha oilasi
- Mentor: Uch juftlikda qo'lda qilgan tanlovingizni endi kod bajaradi. Raqamlar o'sha navbat ilovasidan.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Kod raqamni qaysi maydonga qarab ajratadi?** · `son` · `nima` · ✔ `sanagani`
  - xato `son`: `son` faqat sonni saqlaydi — u nimani sanaganini aytmaydi. (56) · xato `nima`: `nima` — raqamning yozuvi; turini `sanagani` aytadi. (48)
- Chap (vazifa, 3 band): 1 Funksiya ro'yxat (massiv) qaytaradi · 2 Ro'yxatga faqat natija raqamlari tushadi · 3 Uchala `console.log` kutilgandek chiqdi
- Yordam: Bitta yozuvdan boshlang: birinchi raqamning `sanagani` qiymati `"natija"` mi? Ishlagach qolganlariga o'ting.
  Eslatma (JavaScript darslaridan): `function` — bitta vazifani bajaradigan kod bo'lagi · massiv — ro'yxat · `console.log` — qiymatni ekranga chiqaradi.
- O'ng: «Kompilyatorni ochish» — kompilyator: kodni yozib, shu yerning o'zida ishga tushiradigan oyna → `HtmlCompiler`, `app.js` (F-1004-18 «Console», F-1004-20 holati saqlanadi).
- Kod (v2 dan farqi — funksiya nomi va izohlar):
```js
// Navbat ilovasining raqamlari (juftliklardan tanish)
const royxat = [
  { son: 312, nima: "kod satri yozildi", sanagani: "mehnat" },
  { son: 41, nima: "odam tizimni ochdi", sanagani: "natija" },
  { son: 5, nima: "hafta ishlandi", sanagani: "mehnat" },
  { son: 12, nima: "odam arizasiga javob oldi", sanagani: "natija" }
];

function natijalar(raqamlar) {
  // natija raqamlari: avval son, keyin nima
  return [];   // shu joyni siz yozasiz
}

console.log(natijalar(royxat));
// ["41 odam tizimni ochdi", "12 odam arizasiga javob oldi"]
console.log(natijalar([]));
// []
console.log(natijalar([royxat[1]]));
// ["41 odam tizimni ochdi"]
```
- Kompilyator sarlavhasi: `app.js — natijalar funksiyasini yakunlang` · placeholder: `// natija raqamlarini yig'ib qaytaring`
- Shart xabarlari (≤60): 1 — Funksiya ro'yxat qaytarsin: to'rt raqamdan ikkitasi tushadi. (60) · 2 — Har yozuv «son nima» ko'rinishida; mehnat raqami tushmasin. (59) ·
  3 — Bo'sh ro'yxatga — bo'sh; bitta natija raqamiga — faqat o'zi. (60)
- **Harakat → Vizual o'zgarish:** darvozada `sanagani` tanlanadi → kod namunasida `sanagani` maydonlari bir lahza ajraladi; kod ishga tushganda Console'da ro'yxat chiqadi,
  shartlar birma-bir ✓ bo'ladi.
✎ darvoza «Dalil beradigan raqam nimani sanaydi?» (2- va 3-ekran savolining 3-takrori) → kod maydoni savoli (PM-082e: darsning o'z mini-mashqi) ·
`dalillar` → `natijalar` (T-014) · «Uch natija to'g'ri chiqdi», «natijani chiqaradi» → «kutilgandek chiqdi», «qiymatni chiqaradi» (T-015) ·
Eslatma Yordam ichiga (F-1004 m6-12 naqshi) · Yordamdagi «Qo'shimcha» olindi · «darhol» → «shu yerning o'zida» · 🔎 🛠 olindi

## 11 · Yakuniy savol  ← QTest (✔ 2-variant, `correctIdx 1`; ikki qoida birga)
- Eyebrow: Yakuniy tekshiruv
- Savol: **AvtoPizza boti uchun slayd. Sahnaga qaysi raqam chiqadi?** (9 so'z)
  - 25 odam botni ochib, menyuni ko'rdi (35)
  - ✔ 25 odamning buyurtmasi qabul qilindi (36)
  - Botni qurishga 900 qator kod yozildi (36)
- To'g'ri izohi: Buyurtma qabul qilindi — bot ishni oxirigacha bajardi.
- Xato izohlari: 1 — Menyuni ko'rish — foydalanish endi boshlangani. (47) · 3 — Kod satri — mehnat raqami, natija emas. (39) ·
  (umumiy) Natija raqamlaridan ish oxirigacha yetgani chiqadi. (51)
✎ «Sahnaga chiqadigan raqam qanday tanlanadi?» (qoidani eslash; to'g'ri javob eng uzun — 47/41/39) → tanish bot ustida ikki qoida birga: mehnat ↔ natija va
boshlandi ↔ oxirigacha (P-002: ikkinchi misol faqat testda, tanigan olamdan) · `RECAPS[11]` yangilanadi

## 12 · O'zingiz o'ylab ko'ring  ← QMustaqil (2 qadam)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Slaydingizni yoddan ayta olasizmi?** (34) — v2 dagidek
- Mentor: Avval {sherigingizga | ovoz chiqarib o'zingizga} ayting, keyin bir qatorda yozing.
- Qadamlar 1/2: 1 Sherigingizga ayting | Ovoz chiqarib ayting (taymer 1 daqiqa | 30 soniya — v2 dagidek) · 2 Endi bir qator yozing
- Vizual: 8-ekrandagi slaydingiz — qatorlar yopiq (kulrang chiziq). 8-ekran yozilmagan bo'lsa (mentor rejimi) — bo'sh slayd.
- Maydon maslahati: Sahnaga … chiqadi, u … ko'rsatadi
- **Harakat → Vizual o'zgarish:** taymer → aytish; qator yozilgach (≥8 belgi) yopiq slayd ochiladi — o'quvchi yozganini slayd bilan o'zi solishtiradi.
- Xulosa (yozgach): Bugungi qoida: sahnaga natija raqami chiqadi, yonida — u nimani ko'rsatishi. (76)
- Taymer tugmalari: 30 soniyani boshlash · To'xtatish · ↻ Yana 30 soniya (▶ ⏹ olinadi)
✎ eyebrow «· 2 qadam» olindi (P-062: 1/2 qadamlar bor) · Mentor 3 gap → 1 (savol maydon maslahatida) · yopiq slayd → yozgach ochiladi (o'z-o'zini tekshirish) ·
xulosa 🎯 va uzun ibora → atama bilan

## 13 · Natijalar (podium)  ← QNatija — v2 dagidek
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Natija raqami qaysi · 2 — Uchinchi qator · 3 — Airbnb'dagidek raqam · 4 — Bot slaydi

## 14 · Takrorlash  ← QKartochka
- Sarlavha: O'zingizni sinab ko'ring. (v2)

| Old tomon | Orqa |
|---|---|
| Natija raqami nimani sanaydi? | Tizim foydalanuvchi uchun bajargan ishni |
| Mehnat raqami nimani sanaydi? | Qurishga ketgan ishni — natijani emas |
| Gapiradigan slaydda nechta qator bor? | Uchta: raqam, u nimani sanadi, u nimani ko'rsatadi |
| Uchinchi qatorga nima yoziladi? | Raqam tizim haqida nimani ko'rsatishi — ortig'i emas |
| Yolg'iz raqam sahnada nima qiladi? | Savol tug'diradi, javob bermaydi |
| «Ochdi» va «javob oldi» — farqi nima? | Ochdi — foydalanish boshlangani; javob oldi — ish oxirigacha yetgani |
| Ikki natija raqamidan qaysi biri sahnaga chiqadi? | Ish oxirigacha yetganini ko'rsatgani |
| Airbnb taqdimotida raqam qayerda turgan? | Qiyinchilik va yechimdan keyin |
| Tizimni hali hech kim sinamagan bo'lsa-chi? | Tizim bajargan ishlar sanaladi |
| «Raqamga izoh berish» nima demak? | Yoniga u nimani sanagani va nimani ko'rsatishini yozish |
| Sahnada natija raqami nima beradi? | Kuchli dalil |

✎ «Dalil beradigan raqam» → «Natija raqami» (T-014) · 2-karta ta'rif bilan bir xil · 9-karta arena 11-savol vaziyati bilan · 11-karta yangi: dars nomidagi savolga javob (dalil)

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha: **Sahnaga chiqadigan slaydingiz yozildi.** (38) — v2 dagidek
- Endi siz bilasiz:
  - Natija raqami tizim foydalanuvchi uchun bajargan ishni sanaydi — sahnada u kuchli dalil.
  - Mehnat raqami (satr, hafta) qurishga ketgan ishni sanaydi — natijani ko'rsatmaydi.
  - Slayd uch qator bilan gapiradi: raqam, u nimani sanadi, u nimani ko'rsatadi.
  - Yo'q raqamni o'ylab topmaysiz — bor raqamga izoh berasiz.
- Uyga vazifa: `HwCard` — o'zgarmaydi (PM-027).
- Keyingi dars — Zaxira dars, so'ng Demo Day 3: IT-hamjamiyat oldida 3 daqiqalik pitch. Slaydingiz o'sha kuni sahnaga chiqadi.
- Nishonlar — pastda (mentor rejimida yo'q).
✎ «🚀» olindi (185) · «Keyingi dars — …» shakli (QYakun, DE-204) · 1–2-band ta'rif bilan so'zma-so'z (T-042) · App.jsx: m6-15 «Zaxira dars», m6-16 «Demo Day 3» ✓

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami
- **Slide Talker!** — Slaydning uch qatorini o'zingiz ochdingiz (4)
- **Result Finder!** — Ikki rost raqamdan natijaga yaqinini topdingiz (4)
- **Stage Ready!** — Sahnaga chiqadigan slaydni yozdingiz (8)
- **Number Duel!** — Uch juftlikda raqamni tanladingiz (9)

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
- **3 · Natija raqami va mehnat raqami** — 1 Natija raqami tizim foydalanuvchi uchun bajargan ishni sanaydi. · 2 Mehnat raqami (satr, hafta) qurishga ketgan ishni sanaydi. ·
  3 Har raqamdan so'rang: u kimning ishini sanadi? — savol: 3-ekran savoli
- **5 · Uchinchi qator** — 1 Slayd uch qator bilan gapiradi: raqam, u nimani sanadi, u nimani ko'rsatadi. · 2 Uchinchi qator ikkinchisini takrorlamaydi — yangi gap aytadi. ·
  3 U siz haqingizda emas, tizim haqida: raqam nimani ko'rsatsa, shuni. — savol: 5-ekran savoli
- **7 · Raqam qiyinchilikdan keyin** — 1 Airbnb taqdimotida raqam qiyinchilik va yechimdan keyin turgan. · 2 U qiyinchilikni qancha odam boshdan kechirayotganini ko'rsatgan. ·
  3 Slaydingizda ham raqam yolg'iz turmaydi — oldingi gapning davomi bo'ladi. — savol: 7-ekran savoli
- **11 · Sahnaga qaysi raqam chiqadi** — 1 Avval mehnat raqamini ajrating — u sahnaga chiqmaydi. · 2 Ikki natija raqamidan ish oxirigacha yetgani chiqadi. ·
  3 Raqam topilmasa, o'ylab topilmaydi — tizim bajargan ishlar sanaladi. — savol: 11-ekran savoli

## Jonli viktorina — 12 savol (✔ o'rni o'zgarmaydi, 3/3/3/3) — v2 matni, faqat:
- **2.** «28 ta rasm chizildi» qatori nimani sanaydi? — ✔ «Sizning mehnatingizni va ish jarayonini» (39 — eng uzun, «mehnat» faqat to'g'rida) → ✔ **Tizimni qurgan odamning ishini** (30);
  qolganlari o'zgarmaydi (42 · 31 · 35).
- **10.** distraktor «Chunki hafta soni doim o'zgarib turadi» («doim» — kafolat so'zi) → **Chunki haftalarni hech kim sanamaydi** (36).
- Qolgan 10 savol — v2 dagidek (1-savoldagi «kuchli dalil» — A-2 ma'nosida, qoladi).
- **Fon so'zlari** (R-008, kodda {uz, ru} bor): arena — raqam · dalil · slayd · qator · sahna · odam · mehnat · tizim (+ ✅ 🎤 🎯 — o'yin qatlami) ·
  uyga vazifa banneri — raqam · slayd · qator · odam · sahna (✅ 🎤 olinadi — pilot kabi faqat so'z).

---

## B. KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`)
1. Qolipga o'tish: s0 `QKirish` · s1 `QReja` · s2/s4/s9 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s11 `QTest` (`QuestionScreen` mantig'i o'zgarmaydi, DE-203) ·
   s6 `QVoqea` · s8/s12 `QMustaqil` · s10 `QKod` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')` (q13–q21).
2. `SahnaSlayd` — bitta vizual (180): `SLAYD_QATOR` (3 qator nomi) + qator holatlari + zal (4 siluet, pufak / ✓); 0, 1, 4, 5, 8, 9, 12-ekranlar shundan. `reduced-motion` — o'tishsiz.
3. `RAQAMLAR` — 6 raqam bitta manbada (`son`, `nima`, `tur: mehnat|natija`, `daraja: boshlandi|oxirigacha`); s2, s4 (`S4_ROWS`/`S4_DUO`), s9 (`JUFTLIKLAR`), s10 (`royxat`, `KOD_DATA`) shundan.
4. s2 — `S2_CARDS` akkordeon → saralash: bashorat (2/3/4) · 6 raqam-karta · ikki maket (kod oynasi/kalendar/varaq · telefon ramkasi) · 6/6 da atama yorliqlari.
5. s0 — `QKirish` (radio), javob 90 belgi, zal pufagi; `HOOK_OPTS[0]` «darrov» → «birinchi».
6. s1 — `DEMO_SLAYD`: yorliqlar (`sl-cap`) olinadi, 2–3-qator yangi matn (ru ham — hozirgi ru 2-qatori uz matniga mos emas); `QReja` qadamlari.
7. s4 — `say` qatori → zal pufagi; duel tanlovi slaydni qayta yozadi; `S4_DUO.why` qisqaradi; xulosa bitta; ipucha emojisiz.
8. Testlar s3/s5/s7/s11 — yangi matn, `correctIdx` 1/2/0/1 va `INLINE_KEYS` o'zgarmaydi; s5 savol ustida kichik `SahnaSlayd`; `RECAPS` 3/5/7/11 (`ask` + kartalar, `ic` emoji → 1/2/3);
   `Q_LABELS`; ru s5 savolidagi «⌨️» olinadi.
9. s6 — eyebrow, `Airbnb · N/6` yorlig'i (bashorat kartasida ham), sarlavha, Mentor (brend izohi); `K12_SLIDES[0]` va `[5]` matni; `hit/miss` → `QTaxmin`; ko'prik → bitta xulosa (hisoblagichsiz).
10. s8 — `wsp-task`, «Qo'shimcha», `done-mini`, `msg` olinadi; `stps` doiralari → slayd qatorlari; xabar matnlari; `ZAXIRA_ISH` → «tizimingizning asosiy ishi»; ru «🧭» olinadi.
11. s9 — umumiy `sfb` ok/ask qatorlari olinadi; tanlov slaydga yoziladi + zal; `why` matnlari; xulosa bitta.
12. s10 — `GATE_ITEMS` → maydon savoli (`son`/`nima`/`sanagani`); `dalillar` → `natijalar` (starter uz/ru, `KOD_TASK` title/brief, 3 `evalEquals` ifodasi, requirement yorliqlari va
    xabarlari); Eslatma Yordam ichiga; `klaunch-b` izohi.
13. s12 — `PairTimer` ▶ ⏹ olinadi; yopiq slayd → yozgach ochiladi; xulosa matni.
14. s14 `FLASHCARDS` (1, 2, 9-karta + 11-karta); s15 `RECAP` 4 band, «🚀» olinadi, «Keyingi dars — …»; `HW_TOKENS` dan ✅ 🎤 olinadi.
15. `ACHIEVEMENTS.proofFinder.desc`; arena `QUIZ_BANK` 2-savol ✔ matni, 10-savol distraktori.
16. App.jsx nomi — o'zgarmaydi (DE-205 ✓). **REPO — yo'q** (PM darsi).
- Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:jsx` · surat 1280 + 393.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi (205): m6-13 «Loyiha kuni: to'liq tizim» → **m6-14 «Raqamingiz nimani isbotlaydi?»** → m6-15 «Zaxira dars» → m6-16 «Demo Day 3».
- [✓] Bitta misol-ip: Demo Day sahnasi + 12-darsdagi navbat ilovasining 6 raqami; metafora yo'q; bitta vizual — `SahnaSlayd` (Airbnb — keys maketi, PM-029).
  Ikkinchi misol faqat testda: s7 sartaroshxona (o'sha ilova olami), s11 AvtoPizza boti (tanish olam, P-002).
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 9 (QTushuncha) + 0, 6, 8, 10, 12. Matn-karta qolmadi (s2 akkordeon, s4/s9 javob-matnlari — vizualga).
- [✓] O'lchov (skript bilan sanaldi): sarlavha 28–43 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa 62–89 · hook javobi 90 · xato izohi 28–60.
- [✓] Atamalar: natija raqami / mehnat raqami (yangi — misoldan keyin), ariza, raqamga izoh berish, Rejangizda — 6/12-v2 bilan bir xil; siz-forma; tugma ot-shaklda / siz-formada.
- [✓] Testlar: uzunlik teng (s3 40/36/36 · s5 34/36/34 · s7 35/37/32 · s11 35/36/36 — to'g'ri javob eng uzun emas); kalit so'z faqat to'g'rida emas; ✔ o'rni 1/2/0/1 o'zgarmagan.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [✓] Emoji yo'q (o'yin qatlami mustasno); kafolat so'zlari: «darrov» (s0), «darhol» (s10), «doim» (arena 10) olindi.
- [✓] Ichki kodlar yo'q (modul raqami ham — «5-Modul» o'rniga «AvtoPizza boti»); Airbnb fakti — v2 manbasi (slidebean, 29.09); «KOD» ro'yxati 16 band, REPO 0.
- [✓] Karta T · P · S · PM: T-014/015 (natija bir ma'noda, dalil sinonimi olindi) · T-042 (ta'rif bir xil, shior yo'q) · T-047 (UI ta'rifi Mentor'dan, «… slaydga chiqdi» xabari) ·
  T-048 (Airbnb izohi bir joyda) · P-015 (reja kashfiyotni aytmaydi) · P-062 (son bir marta) · P-064 (bashorat 2, 6) · S-008/T-070 (eslash → qo'llash, s5/s7) · S-018 (Airbnb izohi
  birinchi ko'rinishda) · S-026 (recap raqam) · PM-027 (HwCard) · PM-028/029 (keys) · PM-030/107 (misol → atama) · PM-082 (kod ekrani darvozasi saqlandi).
- [?] Ochiq: s2 saralash maketi (kod oynasi · kalendar · telefon) — ikki tomon bitta ekranda; telefonda (393) tomonlar ustma-ust turadi — vizual bosqichda ko'riladi.
