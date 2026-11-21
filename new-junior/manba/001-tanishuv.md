# 1-dars. Tanishuv: kompyuter, dasturlash va Blok studiya

> **Holat: v11 (2026-11-18) — manba = demo.** Bu matn boshliq tasdiqlagan demoga (`public/demo.html`, 16.11; manbasi 19.11 dan `../dvigatel/` va `../darslar/001-tanishuv/`) aynan tenglashtirildi: 25 qadam, har qadamda ekranda nima yozilgani, ustoz nima deydi, bola nima qiladi. Demoda yangiroq bo'lgan hamma narsa (16–18.11 qarorlari) shu yerga yozildi; matnda bo'lib, demoda yo'q bo'lgan 10 ta narsa bo'yicha foydalanuvchi qaror berdi (18.11): xato qahramonchasi demoga qo'shildi (1-B), qolgan to'qqiztasi matndan olib tashlandi (2–10-A). Sahifa: https://claude.ai/artifact/Y7WRAL9BiNudUQ51BZtLGA
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Matn o'zgarsa, avval shu fayl, keyin demo (`darslar/001-tanishuv/ekranlar.mjs` — ekranlar, `darslar/001-tanishuv/qadamlar.mjs` — qadamlar va ustoz varag'i, `dvigatel/studiya.js` — studiya gaplari). Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 1-dars.
> Qo'shtirnoq ichidagi gaplar demodagi bilan harfma-harf bir xil (tutuq belgisi ham — ‘ va ’). «Ekran» qatorida — demodagi ekran nomi (P — proyektor, B — bola noutbuki).
> **v11.2 (2026-11-19, dvigatel 4d — KONSEPSIYA 95-qaror):** dasturdagi blok bosilsa endi **tanlanadi** (coral hoshiya, yonida «✕»); boshqa blok bosilsa — ikkalasining joyi almashadi, o'sha blok yana bosilsa — tanlov bekor, «✕» — olib tashlaydi. Shu bilan bog'liq gaplar: «Ortiqcha blokni bosing, keyin ✕» (12-qadam), «Bir qadam ortiqcha! Ortiqcha blokni bosing, keyin ✕» (xatoda), «Siz ham ortiqcha blokni bosing, keyin ✕» (ustozda). **Tasdiqlandi** (19.11 kech, foydalanuvchi: 1-A, 2-A — oldin/keyin sahifasi https://claude.ai/artifact/Mx6bDNXeFMiugKH3447tH2).
> **v11.1 (2026-11-19):** ★ pog'ona muammochalari demoga moslandi (foydalanuvchi qarori 2-A): «9 tadan kam blok — Kamvoy» qatori olib tashlandi (olma va yulduzga 9 tadan kam blok bilan yetib bo'lmaydi, dastur 10 blokgacha), Ortiqvoy — faqat gap bloki qo'shilganda (10 blok). Qarori 3-A bilan demoda tuzatilgan ikki joy ham yozildi: «Qahramon» — bosilgan qahramon oltin tagchaga o'tadi; «Joy tanlang» — o'ngda tanlangan joy.
> Oldingi versiyalar: v10.4 (16.11) — `../arxiv/manba-v10/001-tanishuv-v10.4.md`; v1–v9 — `../arxiv/manba-v9/001-tanishuv-v9.md`.

## Pasport

- **Dars turi:** yangi mavzu (blokli). Bu sinov darsi ham: bola va ota-ona kursni shu darsdan ko'radi.
- **Natija (dasturdan):** qahramon ekranda yuradi va gapiradi.
- **Bola nimani tushunadi:** kompyuter o'zi hech narsa qilmaydi — unga buyruq kerak; ovoz bilan ham, sichqoncha bilan surib ham Coddy qimirlamaydi, blokdagi buyruq bilan yuradi; kompyuterga buyruq berish — dasturlash; dasturchi buyruqni yozadi, biz bloklarni ulaymiz — ikkalasi bir xil; blok — bitta buyruq; blok rangi — uning ishi (ko'k — harakat, binafsha — gap); dastur — ketma-ket buyruqlar; Coddy yulduzni «ko'rmaydi», faqat bloklarni sanaydi; `say` faqat gapiradi, yurgizmaydi.
- **Tekshiruv (dasturdan):** avto — qahramon buyruqni bajardi (birinchi dastur: qahramon yulduzga yetdi).
- **Vaqt:** reja 70 daqiqa, zaxira 10–20 daqiqa (dars 80–90 daqiqa). Vaqt — faqat ustozning mo'ljali (shu faylda); ekranlarda soat va taymer yo'q. Zaxira birinchi kun kirishiga va savollarga ketadi; ortib qolsa — 22-qadamga (o'z sahnangiz).
- **Uch bekat:** 1 · Harakatlantirish — 2 · Gapirtirish — 3 · Sahna yaratish. Reja tepaligi darsda ikki marta chiqadi (8- va 16-qadam), yakunda (24-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–6-qadam: savol va uch sinov). Qolgan joyda avval ko'rsatamiz, bola tushunganini amaliy topshiriq tekshiradi.
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda sahnada Coddy; bola ishlaganda o'z qahramoni (9-qadamda tanlaydi).
- **Ikki yo'l:** jonli dars (ustoz proyektorda boshqaradi, bolalar noutbukda ergashadi) va solo (bola darsni ustozsiz o'zi o'tadi — pastda «Solo» bo'limi).

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–4 | Ismini yozib kiradi, Coddy bilan tanishadi, modulda nima yasashini ko'radi, «Tayyorman»ni bosadi | 1 |
| 4–10 | Savolga javob beradi: Coddy'ni yulduzga qanday olib boramiz? Sinf uch taxminni sinaydi: «YUR!» deydi — Coddy qimirlamaydi; sichqoncha bilan ko'chiradi — qimirlamaydi; ustoz blokni uch marta bosadi — Coddy yulduzga yetadi | 2–6 |
| 10–13 | «Dasturlash nima?» — ko'radi va eshitadi | 7 |
| 13–16 | Bugungi rejani ko'radi, o'z qahramonini tanlaydi | 8–9 |
| 16–21 | Blok studiyada ikkala rang doirachasini o'zi bosadi; birinchi dasturi bilan qahramonini yulduzga olib boradi | 10–11 |
| 21–31 | Coddy bloklarni sanashini ko'radi va ortiqcha blokni o'zi olib tashlaydi; pog'onalarni yechadi (orqaga qaytish, olma, ★ aniq 9 blok) | 12–13 |
| 31–37 | Xulosa: blok va dastur; o'rnidan turib ustozni «robot» qiladi | 14–15 |
| 37–50 | Yangi blok `say`ni ko'radi, qahramoniga ism va rang beradi, unga o'zi gap yozadi | 16–20 |
| 50–61 | Ustozning sahnasini ko'radi, joy tanlab o'z sahnasini yasaydi | 21–22 |
| 61–70 | Do'stining sahnasini ko'radi, o'zinikini ko'rsatadi; o'z natijasini va sinf natijasini ko'radi | 23–25 |

## So'zlar

Darsda uchta yangi so'z kiradi (qaror 5-A, 18.11). Har biri alohida ekranda, rasm bilan.

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| dasturlash | kompyuterga buyruq berish | 7 (va 24) | dasturchi yozgan ikki qator kod = ikkita ulangan blok |
| blok | bitta buyruq | 5, 14 (va 24) | ko'k `move right` bloki |
| dastur | ketma-ket buyruqlar | 14 (va 24) | ustma-ust ulangan uchta `move right` |

Yordamchi so'zlar (ta'rifsiz, tushunarli): buyruq, ishga tushirish, qahramon, yulduz, sahna, pog'ona, zonacha, rang (blok oilasi), Blok studiya (ekranning nomi).
«Blokli dasturlash» alohida so'z sifatida o'rgatilmaydi: 7-qadamda «Dasturchi yozadi = Biz ulaymiz. Ikkalasi bir xil.» deb ko'rsatiladi; 1-qadamda «Blokli dasturlash modulimizda» — modul nomi. Scratch haqida — ustozning o'z so'zi (7-qadam).
Bu darsda AYTILMAYDI (keyingi darslarniki): «ketma-ketlik» atama sifatida (2-dars; 1-darsda faqat «ketma-ket buyruqlar» — dastur ta'rifida), koordinata (3-dars), hodisa (4-dars), takrorlash (5-dars), algoritm, kod (bloklar ortidagi JavaScript — 19-dars; 7-qadamda faqat «Dasturchi yozadi» qatori ko'rinadi).
Bir ma'noga bitta so'z: «qahramon» (dasturda «personaj» — bolaga doim «qahramon»); «blok» («g'isht», «bo'lak» deyilmaydi); «Ishga tushir» (tugma nomi); «qadam» (bolaga «Qadamlarni sanang», «Yulduzgacha necha qadam?»; rasmda — zonacha).
**Til qoidasi:** blok nomlari inglizcha (Scratch'dagidek) — boshqa hamma narsa o'zbekcha. Har blok birinchi chiqqanda ustoz o'zbekcha ma'nosini bir marta aytadi («move right — o'ngga yur»). Gapda blok nomi o'zgarmaydi: «`move left` blokidan foydalaning» (qo'shimcha «blok» so'ziga qo'shiladi).

## Bloklar

Blok rangi — blokning **oilasi** (ishi). 1-darsda ikkita oila:

| Oila (rang) | Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|---|
| Harakat (ko'k) | `move right` | o'ngga yur | qahramon o'ngga bir zonacha sakrab o'tadi | 5-qadam (ustoz bosadi), 11-qadam (bola) |
| Harakat (ko'k) | `move left` | chapga yur | qahramon chapga bir zonacha o'tadi | 13-qadam, 2-pog'ona |
| Harakat (ko'k) | `jump` | sakra | qahramon joyida bir marta sakraydi | 15-qadam (o'yinda tanishadi), 21–22-qadam (studiyada) |
| Gap (binafsha) | `say "Salom!"` | ayt | qahramon blok ichidagi yozuvni pufakda aytadi; yozuvni o'zgartirsa bo'ladi (30 harfgacha) | 17-qadam |

Hali ochilmagan blok javonda kulrang (bosilmaydi). Keyingi darslarda yangi oila kelsa, u ham rang doirachalariga qo'shiladi.

**Blok studiya — Blockly 13.4.0 asosida** (18.11; ko'rinish tasdiqlangan demodagi bilan bir xil). Bloklar javoni va rang doirachalari — oddiy tugmalar; «Dastur» ustunini Blockly boshqaradi. Blok ikki yo'l bilan qo'shiladi: javondagi blokni **bosish** (dasturning oxiriga o'zi ulanadi — 9 yoshli bola uchun asosiy yo'l) yoki dastur ichida **sudrash** (yaqinlashganda ulanadi). Dasturdagi blok **bosilsa — tanlanadi** (95-qaror, 19.11): coral hoshiya, yonida «✕»; ishora «Tanlandi: boshqa blokni bosing yoki ✕». Boshqa blok bosilsa — ikkalasining joyi almashadi («Bloklar joyi almashdi»); o'sha blok yana bosilsa — tanlov bekor; «✕» — blok olib tashlanadi («Blok olib tashlandi»), ostidagilari yuqoriga ko'tarilib ulanadi. Javondan blok qo'shilsa yoki «Ishga tushir» bosilsa — tanlov bekor bo'ladi. Bajarilayotgan blok sariq hoshiya bilan yonadi. Dasturda eng ko'pi 10 ta blok («Dastur to‘ldi — 10 ta blokdan ko‘p bo‘lmaydi»). Dastur ostida son: «3 ta blok».
Masalalarda maqsad: dastur tugaganda qahramon yulduzda TURGAN bo'lsin. Yulduzdan o'tib ketsa — yetmagan hisoblanadi.

## Ekranlar ko'rinishi (hamma qadamda bir xil)

Ko'rinish — `../etalon/` (shablonlar, qat'iy setka, qonunlar `QONUNLAR.md`); bu bo'lim — nima qayerda turishi.

- **Ekran tepasida:** «1-dars · Tanishuv»; ostida kichik yorliq (masalan «Mashq · 1-pog‘ona», «Yangi so‘z») va sarlavha **bir qatorda** (faqat 2-qadamdagi huk savoli ikki qatorgacha), bitta kalit so'z ajratilgan. Bekat chizig'i yo'q.
- **Coddy gapi:** sarlavha ostida kichik Coddy va bitta gap (≤ 12 so'z).
- **Huk kartalari (2–6-qadam):** uchta rasmli karta — A «“YUR!” deb aytamiz», B «Sichqoncha bilan ko‘chiramiz», C «Unga buyruq beramiz». Proyektorda har kartada nechta bola tanlagani (haqiqiy son). Har sinovdan keyin natija o'sha kartaning o'zida: «✕ qimirlamadi» yoki «✓ ishladi».
- **Bola noutbukida «Ustoz ekraniga qarang»:** kechki hovli, tepadan nur, bitta yozuv; ostida kichik gap — qadamga qarab («Ustozni tinglang», «Yangi so‘z: dasturlash», «Ustoz blokni bosadi — Coddy’ni kuzating»…). Tugma yo'q — ataylab tinch.
- **Reja — tepalik (8- va 16-qadam):** yo'l tepalikka ko'tariladi: 1 · Harakatlantirish → 2 · Gapirtirish → 3 · Sahna yaratish, har bekat bir pog'ona baland; cho'qqida — kichik karta «Dars oxirida · Bu — mening sahnam! · O‘z sahnangiz». O'tilgan bekatda ✓ va oltin yoy; navbatdagi bekat miltillaydi.
- **Blok studiya:** chap chetda rang doirachalari («Harakat», «Gap»); yonida tanlangan oilaning bloklari (oq javon); o'rtada «Dastur» ustuni (tepasida qahramonning yuzi); o'ngda sahna. Yulduzli masalada yerda zonachalar: start, raqamli zonachalar, yulduz turgan zonacha oltin, orasida sakrash yoylari (o'tilgani oltin bo'ladi). Sahnaning pastki 40% i — yo'l qatlami: topshiriq gapi, muammocha va pufaklar unga tushmaydi. Hech qaysi blok qahramonni yopmaydi.
- **Bola noutbukining pastki tasmasi:** chapda «Maslahat», o'rtada bir qatorli ishora (nima qilish kerakligi yoki natija), o'ngda asosiy tugma — coral, doim o'ng pastda: «Tayyorman» (1-qadam), «Ishga tushir» (studiya), «Tayyor!» (19-qadam). Tanlov ekranlarida (javob kartalari, qahramon, joy) tugma yo'q — tanlashning o'zi harakat.
- **Ustoz paneli (proyektor ostida, har qadamda bir xil):** chapda «‹ Orqaga»; o'rtada — hozir nima qilish kerak yoki haqiqiy son («Kirdi: 12 / 14», «Yordam so‘radi: 1 ta noutbuk»); o'ngda asosiy tugma — coral, doim shu joyda, doim bir xil: «Keyingi ›» (2-qadamda «Sinab ko‘ramiz ›», 8-qadamda «Boshladik ›», 25-qadamda «Darsni yakunlash»). Studiya qadamlarida yonida «▶ Ishga tushir». O'ng tepada kichik xira qator (sichqoncha borganda yorishadi; sinfga deyarli ko'rinmaydi): «‹», qadam tanlash, «Ovoz yoqiq / Ovoz o‘chiq», «To‘liq ekran», aloqa belgisi. Klaviatura: o'ng strelka — oldinga, chap — orqaga, F — to'liq ekran. Proyektorda «Ustozga: …» satri yo'q (qaror 1-A) — ustozga kerak gap varaqda.
- **Proyektorga chiqmaydi:** bolaning ismi, bola yozgan so'z, kim qayerda qolib ketgani. Faqat sonlar (nechta bola tanladi, yetdi, tayyor; sinf jami qadamlar).

## Yordam va xato (hamma topshiriqda bir xil)

- **«Maslahat»** — har topshiriqda bitta aniq maslahat; bosilganda ishora qatorida chiqadi (masalan, «Avval olmagacha sanang, keyin olmadan yulduzgacha»). Uch pog'onali maslahat va «Yechimni ko‘rsat» tugmasi yo'q (qaror 2-A; qiyin darslar uchun — 6, 14-dars — dvigatelga keyin qo'shiladi).
- **Muammocha (qaror 1-B, 18.11; etalon B3, 73-qaror):** xato chiqqanda sahnada kichik qahramoncha chiqadi va bitta gap aytadi. Pufakda faqat shu gap, kichik, uchi muammochaga qaragan; «Maslahat» tugmasi sariq yonadi; ishora qatorida — nima qilish kerakligi. Muammocha qahramonni yopmaydi (qahramon chapda bo'lsa — o'ng tomonda chiqadi). Dastur o'zgarsa (blok qo'shilsa yoki olinsa, yozuv o'zgarsa) yoki qayta ishga tushirilsa — ketadi. «Xato», «noto'g'ri» so'zlari yozilmaydi.

  | Muammocha | Qachon | Pufakda |
  |---|---|---|
  | Bo'shvoy (havorang arvohcha) | dastur bo'sh, «Ishga tushir» bosildi | «Bu yerda hech narsa yo‘q-ku…» |
  | Kamvoy (to'q sariq) | yulduzga yetmadi | «Oz qoldi!» |
  | Kamvoy | qahramon yulduzning teskari tomoniga yurdi | «Yulduz boshqa tomonda!» |
  | Kamvoy | olmani olmay yulduzga keldi (3-pog'ona, ★) | «Olma qoldi-ku!» |
  | Ortiqvoy (pushti) | yulduzdan o'tib ketdi yoki ★ da yo'l to'g'ri, lekin gap bloki ham qo'shilgan (10 blok) | «Ko‘payib ketdi!» |
  | Bo'shvoy | `say` yozuvi bo'sh | «Hech narsa demadi…» |
  | Kamvoy | `say` yozuvi o'zgartirilmagan | «Hali ham «Salom!» deyapti» |

  O'z sahnangizda (22-qadam) muammocha yo'q: u erkin ish, shartlar ro'yxati o'zi ko'rsatadi.
- **Yordam so'rash:** bola «Maslahat»ni bossa, ustoz panelida son o'sadi: «Yordam so‘radi: N ta noutbuk» — ustoz o'sha bolalarga boradi. Alohida «Ustozni chaqir» tugmasi va noutbuk chetidagi sariq hoshiya yo'q (qaror 4-A).
- 7 soniya kutib bosiladigan joyni miltillatish yo'q (qaror 3-A; bolalar sinovida kerak bo'lsa qo'shiladi). Yo'l-yo'riq kerak joyda ishora o'zi miltillaydi (10-qadam: rang doirachasi).

## Tovush (qaror 3-A, 18.11)

- Coddy ovoz chiqarib gapirmaydi — matn yetarli. Tovush — qisqa ishora tovushlari: blok bosildi, qadam, sakrash, yulduzga yetdi (konfeti bilan), muammo.
- Jonli darsda tovush **faqat ustoz noutbukida** (proyektor karnayida); bola noutbuklari jim (14 ta noutbuk birdan chalinmasin). Solo'da — bola noutbukida.
- Ustoz ekranining o'ng tepasidagi kichik qatorda «Ovoz yoqiq / Ovoz o‘chiq» tugmasi; tanlov shu noutbukda eslab qolinadi.

## Solo: bola darsni ustozsiz o'tadi (qaror 4-A, 5-A, 18.11)

- **Qachon:** LMS'da bola ustoz darsni boshlashidan oldin kirsa — «Dars hali boshlanmadi», ostida «Ustozni kutasizmi yoki darsni o‘zingiz o‘tasizmi?» va ikki tugma: «Ustozni kutaman» · «O‘zim o‘taman». «Ustozni kutaman» → «Ustozni kutyapmiz», ostida «Ustoz darsni boshlashi bilan ekran o‘zi ochiladi.» (yonida yana «O‘zim o‘taman»); ustoz kirishi bilan bola sinfga o'zi o'tadi. Demoda solo — eshikdagi «O‘quvchi — o‘zi (ustozsiz)».
- **Nima:** butun dars — boshidan «Dars tugadi»gacha. Bola ustoz ekranlarini (P) ham o'z noutbukida ko'radi va «Keyingi ›»ni o'zi bosadi. Sinf sonlari yo'q. Bolaning o'zi bajaradigan joylar: 3-qadamda «YUR!»ni bosadi («Coddy qimirlamadi — ovoz bilan ishlamaydi»), 4-qadamda Coddy'ni o'zi sichqoncha bilan ko'chiradi, 5-qadamda blokni o'zi uch marta bosadi («Blokni bosing · 0 / 3»), 12-qadamda Coddy'ni o'zi ishga tushiradi («Ishga tushiring — Coddy qadamlarni sanaydi» → «Bitta blok ortiqcha — endi o‘zingiz tuzatasiz»). Ustozga qaratilgan gaplar bolaga moslangan (11-qadam: «Yetib bordi! Zo‘r!»).
- **Solo'da yo'q qadamlar:** 15 (o'yin «Men robotman» — sinfsiz bo'lmaydi) va 25 (sinf natijasi). 23-qadamda bola o'z sahnasining qayta-qayta o'ynashini ko'radi. Sinf taxtalari (9, 11, 13, 19, 22) o'rniga bola darhol o'z ekranini ko'radi; solo 24-qadamdagi o'z natijasi bilan tugaydi.
- Sahifa yangilansa — bola qolgan joyidan davom etadi. Natija LMS'ga «solo» deb boradi.

## LMS (CoddyCamp) bilan ulanish

- Dars CRM'ga bitta fayl bo'lib yuklanadi (`../lms/OQI.md`). Ustoz LMS'dan kirsa — sinf ochiladi; bola — ismi LMS'dan keladi (eshikda yozmaydi).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Birinchi dastur» (`yulduz`) — 11-qadamda qahramon yulduzga yetdi; «O‘z sahnam» (`sahna`) — 22-qadamda sahna tayyor.
- Ustoz «Darsni yakunlash»ni bossa — sessiya yopiladi, natija LMS'ga boradi. Tugatgan bola qayta kirsa — «Bu dars tugagan», ostida «Keyingi darsda ko‘rishguncha!».

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk. Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating, keyin bolalar o'zi bajaradi.
- Bloklar inglizcha: `move right`, `move left`, `jump`, `say`. Har blok birinchi chiqqanda o'zbekcha ma'nosini bir marta ayting va rangini: «ko‘k — harakat», «binafsha — gap».
- Ustoz noutbuki proyektorga ulangan, ekran aynan takrorlanadi. Proyektor karnayi yoqilgan bo'lsin; o'ng tepadagi qatorda «Ovoz yoqiq».
- Ustoz LMS'dan darsni ochadi (demoda: eshik → «Ustoz ekrani»). F — to'liq ekran; oldinga — «Keyingi ›» yoki o'ng strelka; orqaga — «‹ Orqaga» yoki chap strelka.
- Bolalar LMS'dan kiradi. Ustozdan oldin kirgan bola «Ustozni kutaman»ni bosib kutadi — ustoz ochishi bilan o'zi kiradi.
- 4-qadamda bitta bolani chiqarib, Coddy'ni sichqoncha bilan ko'chirtirasiz.
- 15-qadamdagi o'yin uchun sinfda 5–6 qadam yura oladigan bo'sh joy kerak.
- Bolalar o'zi ishlayotganda (11, 13, 20, 22-qadam) proyektorda — nechta bola bajargani va «Yordam so‘radi: N ta noutbuk». Ekranda soat yo'q: qachon to'xtashni siz hal qilasiz (daqiqalar — mo'ljal).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:04 (4 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P1 · bola B0 → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «1-dars · Tanishuv», sarlavha «Bugun birinchi dasturingizni tuzasiz!». Coddy: «Salom! Men Coddy. Bugun birga dasturlashni o‘rganamiz!» Pastda — «Blokli dasturlash modulimizda»: uchta jonli rasm — Labirint (2-darsda), Olma yig‘amiz (11-darsda), Kosmik o‘yin (17-darsda). Panelda: «Kirdi: 12 / 14» (haqiqiy son).
- **Tayanch gaplar:**
  1. «Bu — Coddy. Bugun birga dasturlashni o‘rganamiz.»
  2. «Shu modulda bloklardan o‘yin ham yasaymiz: labirint, olma yig‘amiz, kosmik o‘yin. Bugun esa birinchi dasturingizni tuzasiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi, o'zini tanishtiradi; o'yinlar keyingi darslarda ekanini aytadi (bola bugun o'yin yasaymiz deb o'ylamasin); hamma kirguncha bolalar bilan gaplashib turadi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «1-dars · Tanishuv», «Salom, Aziz!» (ism LMS'dan; demoda eshikda yoziladi — «Darsga kirish», «Ismingizni yozing»); tasmada «Tayyor bo‘lsangiz — tugmani bosing» va asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi; rasmlarni ko'radi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: Coddy'ni qanday olib boramiz?

- **Vaqt:** 0:04–0:06 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P2 · bola P2N → «Ustoz ekraniga qarang»
- **Sahna:** dars savol bilan boshlanadi (metodikada — «huk»): savol, bolalarning javobi, keyin uch sinov (3–5-qadam) va javob (6-qadam). Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Coddy’ni yulduzga qanday olib boramiz?». Hovlida Coddy va yulduz, orasida uchta zonacha. Coddy: «Qaysi biri ishlaydi? Sinab ko‘ramiz.» O'ngda uchta rasmli karta (A, B, C); har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Coddy’ni yulduzga qanday olib boramiz? Har kim noutbukida bitta javobni bossin.»
  2. «Qaysi biri ishlaydi? Sinab ko‘ramiz.»
- **O'z so'zi bilan:** sinf javoblarini o'qib beradi («ko‘pchilik sichqoncha bilan dedi — tekshiramiz»).
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi biri ishlaydi deb o‘ylaysiz?»; ishora «Birini tanlang». Bosgach — «Ustoz ekraniga qarang».
- **Bola qiladi:** bitta javobni tanlaydi.
- **Tekshiruv:** baho yo'q, «noto'g'ri» deyilmaydi — javobni sinovlar ko'rsatadi.

## 3 · 1-sinov: YUR!

- **Vaqt:** 0:06–0:07 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P2S · bola BY
- **Qadamlar:**
  1. Proyektorda: yorliq «1-sinov · A», sarlavha «Hammamiz birga: YUR!». Coddy: «“YUR!” deng va tugmani bosing!» A kartasi sinalyapti (chegarasi miltillaydi); kartalar ostida «Sinf ovozi» o'lchagichi — bolalar bosgan sari to'ladi, «YUR!» pufaklari ko'tariladi (Coddy'ni yopmaydi). Coddy qimirlamaydi. Panelda: «“YUR!” dedi: 9 bola». Keyin A kartasida «✕ qimirlamadi».
- **Tayanch gaplar:**
  1. «Uchgacha sanaymiz — hammamiz “YUR!” deymiz va tugmani bir marta bosamiz.»
- **O'z so'zi bilan:** «Balandroq!» deb yana bir marta aytdiradi; «Coddy qimirladimi?» deb so'raydi.
- **Ustoz satri:** “YUR!” dedi: 9 bola
- **Parta:** «Bosing va «YUR!» deng!», ostida «Butun sinf birga»; butun ekranda katta «YUR!» tugmasi; ishora «Bir marta bosing — ovozingiz sinfga qo‘shiladi». Bosgach: tugmada ✓, «Ovozingiz sinfga qo‘shildi!».
- **Bola qiladi:** «YUR!» deydi va tugmani bir marta bosadi.
- **Tekshiruv:** yo'q (bola o'rganadi: ovoz bilan kompyuter ishlamaydi).

## 4 · 2-sinov: sichqoncha bilan ko'chiramiz

- **Vaqt:** 0:07–0:08 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P2B · bola «Ustoz ekraniga qarang» («Bir o‘quvchi Coddy’ni sichqoncha bilan ko‘chiradi»)
- **Qadamlar:**
  1. Proyektorda: yorliq «2-sinov · B», sarlavha «Sichqoncha bilan ko‘chiramiz». Coddy: «Meni sichqoncha bilan ko‘chirib ko‘ring!» Coddy'ni haqiqatan sudrasa bo'ladi: u biroz ergashadi, qo'yib yuborilsa joyiga sakrab qaytadi — yo'l bo'ylab yurmaydi. B kartasida «✕ qimirlamadi»; panelda «Coddy joyiga qaytdi — sichqoncha bilan ham bo‘lmadi».
- **Tayanch gaplar:**
  1. «Kim chiqib Coddy’ni sichqoncha bilan yulduzga ko‘chiradi?»
- **O'z so'zi bilan:** bir bolani chiqaradi; Coddy qaytganda «Yetdimi?» deb so'raydi.
- **Ustoz qiladi:** bolani chiqaradi (yoki o'zi sudraydi).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi (biri chiqib ko'chiradi).
- **Tekshiruv:** yo'q (qahramonni qo'l bilan surish ham ishlamaydi).

## 5 · 3-sinov: buyruq

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P2K · bola «Ustoz ekraniga qarang» («Ustoz blokni bosadi — Coddy’ni kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «3-sinov · C», sarlavha «Unga buyruq beramiz». Coddy: «Bitta buyruq — bitta qadam!» C kartasi ostida ko'k `move right` bloki — haqiqiy tugma; ishora «Blokni bosing · 0 / 3». Har bosishda Coddy bitta zonachaga sakraydi, yoy oltin bo'ladi; uchinchisida yulduzda: «Yulduzga yetdi! · 3 / 3».
- **Tayanch gaplar:**
  1. «Bu — blok. Ichida buyruq: move right, ya’ni o‘ngga yur.»
  2. «Bitta buyruq — bitta qadam.»
- **Ustoz qiladi:** blokni uch marta bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi, qadamlarni birga sanaydi.
- **Tekshiruv:** yo'q (blokdagi buyruq ishlaydi: bitta blok — bitta qadam).

## 6 · Javob

- **Vaqt:** 0:09–0:10 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P2C · bola «Ustoz ekraniga qarang» («Coddy faqat blokni tushunadi»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Coddy faqat blokni tushunadi». Coddy: «“YUR!” ham buyruq, lekin men faqat blokni tushunaman.» A va B — «✕ qimirlamadi», C — «✓ ishladi».
- **Tayanch gaplar:**
  1. «Coddy faqat blokni tushunadi. Ovoz ham, sichqoncha ham ishlamadi — blok ishladi.»
- **O'z so'zi bilan:** bola «“YUR!” ham buyruq-ku» desa — to'g'ri, lekin Coddy faqat blokdagi buyruqni tushunadi; C ni tanlaganlardan nega shunday deganini so'raydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q. Darsning asosiy fikri: kompyuter faqat o'zi tushunadigan buyruqni — blokni — bajaradi.

## 7 · Dasturlash nima?

- **Vaqt:** 0:10–0:13 (3 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** P3 · bola «Ustoz ekraniga qarang» («Yangi so‘z: dasturlash»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Dasturlash nima?». Coddy: «Dasturlash — kompyuterga buyruq berish.» Ostida ikki ustun: «Dasturchi yozadi» — ikki qator kod `coddy.move("right")` (o'qish shart emas, faqat ko'rinish); «=»; «Biz ulaymiz» — ikkita ulangan `move right`. Pastda: «Ikkalasi bir xil. Biz bloklardan foydalanamiz.»
- **Tayanch gaplar:**
  1. «Dasturlash — kompyuterga buyruq berish.»
  2. «Dasturchi buyruqni yozadi, biz bloklarni ulaymiz. Ikkalasi bir xil.»
- **O'z so'zi bilan:** Scratch haqida bir gap («dunyoda millionlab bolalar o‘yinni shunday yasaydi»); kursning oxirida haqiqiy kod ham yozishini aytadi — «avval bloklar, keyin kod».
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 8 · Reja

- **Vaqt:** 0:13–0:14 (1 daqiqa)
- **Bekat:** reja
- **Ekran:** P4 · bola «Ustoz ekraniga qarang» («Bugungi reja: uch bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Bugungi reja», sarlavha «Bugun nima o‘rganamiz?». Yo'l tepalikka ko'tariladi: 1 · Harakatlantirish → 2 · Gapirtirish → 3 · Sahna yaratish; cho'qqida — kichik karta «Dars oxirida · Bu — mening sahnam! · O‘z sahnangiz». Navbatdagi bekat miltillaydi. Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: harakatlantiramiz, gapirtiramiz, o‘z sahnangizni yaratasiz.»
  2. «Dars oxirida har biringizda o‘z sahnangiz bo‘ladi.»
- **O'z so'zi bilan:** uch bekatni pastdan yuqoriga ko'rsatadi: har bekat — bir pog'ona baland.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q (dars qayerga borishini biladi).

## 9 · Qahramon tanlash

- **Vaqt:** 0:14–0:16 (2 daqiqa)
- **Bekat:** reja
- **Ekran:** P4T · bola BQ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Qahramon tanlash», sarlavha «Qahramoningizni tanlang». Coddy: «Men — ustozning yordamchisiman. Sizda o‘z qahramoningiz bo‘ladi.» Sinf taxtasi: birinchi o'rinda Coddy («Ustoz»), bola tanlagan sari uning qahramoni paydo bo'ladi — ismsiz; son «Tanladi 9 / 14».
- **Tayanch gaplar:**
  1. «Coddy — meniki. Har biringizga o‘z qahramoningiz kerak. Bittasini tanlang.»
- **O'z so'zi bilan:** ismi va rangi keyin qo'yilishini aytadi; taxta to'lishini kutadi.
- **Ustoz satri:** Tanladi: 9 / 14
- **Parta:** yorliq «Qahramon», «Qahramoningizni tanlang»; Coddy: «Birini tanlang — bugun unga buyruq berasiz.»; beshta qahramon: Momiq, Jele, Katak, Zippi, Nihol (sichqoncha ustiga borganda sakraydi); ishora «Birini tanlang». Bosilgan qahramon oltin tagchaga o'tadi, yozuvi qorayadi; bosgach — «Ustoz ekraniga qarang».
- **Bola qiladi:** bitta qahramonni bosadi.
- **Tekshiruv:** qahramon tanlandi.

## 10 · Ranglar

- **Vaqt:** 0:16–0:18 (2 daqiqa)
- **Bekat:** 1 · Harakatlantirish
- **Ekran:** B1 (proyektorda ham, bola noutbukida ham — bir xil studiya)
- **Sahna:** Blok studiya bilan birinchi tanishuv. Ustoz ham, bolalar ham ranglarni o'zi bosadi (qaror 8-A: alohida «studiya qismlari» sayohati va ustozning ulash namoyishi yo'q — «bitta blok — bitta qadam» 5-qadamda ko'rsatilgan).
- **Qadamlar:**
  1. Yorliq «Blok studiya», sarlavha «Ko‘k blok yurgizadi, binafsha blok gapirtiradi». Ekran xira, faqat rang doirachalari yorqin; ishora «👈 Ko‘k doirachani bosing» — ko'k doiracha miltillaydi. Bosilsa — «Harakat» bloklari chiqadi (`move right` ochiq; `move left`, `jump` hali kulrang), ishora «Endi binafshani bosing». Binafsha bosilsa — «Gap» bloki. Ikkalasi bosilgach: «Zo‘r!», xiralik ketadi. Tasmada: «Ikkala rangni bosing · 0 / 2» → «2 / 2».
- **Tayanch gaplar:**
  1. «Bu — Blok studiya. Har rang — bitta oila: ko‘k — harakat, binafsha — gap.»
  2. «Ikkala rangni bosib ko‘ring.»
- **O'z so'zi bilan:** ko'k oiladagi bloklarni o'zbekcha bir marta aytib o'tadi (move right — o'ngga yur; qolganlari keyin ochiladi).
- **Ustoz qiladi:** proyektorda ikkala doirachani bosib ko'rsatadi.
- **Parta:** o'sha studiya va o'sha ishora.
- **Bola qiladi:** ikkala rang doirachasini bosadi.
- **Tekshiruv:** ikkala doiracha bosildi (blokning rangi — uning ishi).

## 11 · Birinchi dastur

- **Vaqt:** 0:18–0:21 (3 daqiqa)
- **Bekat:** 1 · Harakatlantirish
- **Ekran:** P5A · bola B2 → B4 → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Qahramoningizni yulduzga olib boring.» Katta son «Yulduzga yetdi 6 / 14» va belgilar, ostida «Har belgi — yulduzga yetgan bitta bola». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Endi o‘zingiz: qahramoningizni yulduzga olib boring.»
  2. «Blokni bosing — u dasturga qo‘shiladi. Keyin «Ishga tushir».»
- **O'z so'zi bilan:** sinfni aylanadi; javobni aytmaydi — «Yulduzgacha necha qadam?» deb so'raydi; «Maslahat»ni bosgan bolalarga boradi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya, yorliq «Mashq · 1-pog‘ona», sarlavha «Qahramoningizni yulduzga olib boring.». Sahnada bolaning o'z qahramoni start zonachasida, yerda zonachalar 1–4, yulduz 3-zonachada. Dastur bo'sh: «Blokni shu yerga ulang». Ishora: «Qadamlarni sanang: yulduzgacha nechta?». «Maslahat»: «Yulduzgacha katakchalarni barmog‘ingiz bilan sanang».
  Yetib borsa: «Yetib bordi!» va konfeti; keyin ekran: «Yetib bordi! Birinchi dasturingiz.», chapda «Qayta ko‘rish» (o'sha dastur yana o'ynaydi), ishora «Zo‘r! Ustoz keyingisini ko‘rsatadi».
- **Bola qiladi:** qadamlarni sanaydi, uchta `move right` qo'shadi, «Ishga tushir»ni bosadi.
- **Tekshiruv:** dastur tugaganda qahramon yulduzda turibdi. Dars boshidagi savol shu yerda yopiladi: Coddy'ni ovoz bilan ham, sichqoncha bilan ham yulduzga olib bora olmadik — bola o'z qahramonini buyruq bilan olib bordi. Yutuq: «Birinchi dastur».
- **Xatoda:** bo'sh dastur — Bo'shvoy «Bu yerda hech narsa yo‘q-ku…» (ishora «Avval blokni bosing — u dasturga qo‘shiladi»); yetmasa — Kamvoy «Oz qoldi!» («Oz qoldi! Yana bitta blok qo‘shing»); o'tib ketsa — Ortiqvoy «Ko‘payib ketdi!» («Bir qadam ortiqcha! Ortiqcha blokni bosing, keyin ✕»).

## 12 · Coddy sanaydi

- **Vaqt:** 0:21–0:24 (3 daqiqa)
- **Bekat:** 1 · Harakatlantirish
- **Ekran:** P6 · bola «Ustoz ekraniga qarang» («Ustoz Coddy’ni yurgizyapti — kuzating») → B3X → B3Y
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «4 ta blok bilan ishga tushiramiz». Dasturda to'rtta `move right`, yerda zonachalar 1–4, yulduz 3-zonachada. Panelda: «Ishga tushiring — Coddy yurgach, bolalarda topshiriq ochiladi».
  2. Ustoz «▶ Ishga tushir»ni bosadi: har blok yonadi, Coddy yuzida son — 1, 2, 3, 4; yulduz qichqiradi: «To‘xta! Men shu yerdaman!» — Coddy baribir o'tib ketadi. Sarlavha: «4 ta blok — 4 qadam», ostida «Bizga 3 qadam kerak edi — bitta blok ortiqcha.». Shu payt bolalar noutbukida topshiriq ochiladi; panelda: «Bolalarda topshiriq ochildi. Siz ham ortiqcha blokni bosing, keyin ✕».
- **Tayanch gaplar:**
  1. «Qarang: yulduz uch qadam narida, men esa to‘rtta blok qo‘ydim.»
  2. «Coddy yulduzni ko‘rmaydi. U faqat bloklarni sanaydi.»
  3. «Endi o‘zingiz tuzating: ortiqcha blokni olib tashlang.»
- **O'z so'zi bilan:** «kompyuter faqat dasturda borini bajaradi» degan gapni ikki-uch bolaga qaytarib aytdiradi.
- **Ustoz qiladi:** «▶ Ishga tushir»ni bosadi; xohlasa ortiqcha blokni bosib, «✕» bilan olib tashlab, qayta ishga tushiradi — Coddy yulduzda to'xtaydi.
- **Parta:** yorliq «Mashq · xatoni tuzating», sarlavha «Bir qadam ortiqcha!»; dasturda to'rtta `move right`. Ishora: «Ortiqcha blokni bosing, keyin ✕». «Maslahat»: «Coddy qayerda to‘xtadi? Yulduzgacha nechta blok kerak — sanang». To'g'ri bo'lsa: «To‘g‘ri! 3 ta blok — 3 qadam», «Xatoni o‘zingiz tuzatdingiz!».
- **Bola qiladi:** ortiqcha blokni bosadi, «✕» bilan olib tashlaydi va ishga tushiradi.
- **Tekshiruv:** qahramon yulduzda turibdi (xatoni o'zi topib tuzatdi: har blok — bitta qadam).
- **Xatoda:** 11-qadamdagidek (Kamvoy / Ortiqvoy / Bo'shvoy).

## 13 · Pog'onalar

- **Vaqt:** 0:24–0:31 (7 daqiqa)
- **Bekat:** 1 · Harakatlantirish
- **Ekran:** P5 · bola B2P → B2Q → B2Y → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Qiynalsangiz — «Maslahat»ni bosing.» Chapda katta son «Uch pog‘onani tugatdi 3 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola». O'ngda pog'ona zinapoyasi — kartalar zinadek ko'tariladi, har birida nechta bola bajargani: 1 «Yulduzda to‘xtang» · 2 «Orqaga qayting» · 3 «Olma, keyin yulduz» · ★ «Aniq 9 ta blok». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Endi o‘zingiz. Pog‘onalar bor: biri tugasa, keyingisi o‘zi ochiladi.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** 2-pog'onada yangi blok ochilishini aytadi: `move left` — chapga yur, u ham ko'k, demak harakat; sinfni aylanadi; javobni aytmaydi — «Qahramon qaysi tomonga yurishi kerak?» deb so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya, pog'onalar ketma-ket; bajarilgach keyingisi o'zi ochiladi (1-pog'ona — 11-qadamdagi birinchi dastur).
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Orqaga qayting», ostida «Yulduz orqada qoldi.». Qahramon 3-zonachada, yulduz 1-zonachada; ko'k oilada `move left` ochiladi. Ishora: «Qahramon qaysi tomonga yurishi kerak?». «Maslahat»: «Yulduz qaysi tomonda? O‘sha tomonga yuradigan blokni toping». Yetib borsa: «Yetib bordi! move left bilan orqaga qaytdingiz».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Olma, keyin yulduz», ostida «Olmani oling va yulduzga qayting.». Zonachalar 1–4, olma 4-zonachada, yulduz 3-zonachada. Ishora: «Olma qaysi zonachada? Avval o‘sha yerga boring». «Maslahat»: «Avval olmagacha sanang, keyin olmadan yulduzgacha». Yetib borsa: «Zo‘r! Olma ham, yulduz ham!».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Aniq 9 ta blok», ostida «Olma va yulduz — 9 ta blok bilan.». Zonachalar 1–6, olma 6-zonachada, yulduz 3-zonachada. Ishora: «Olmagacha nechta qadam? Yulduzga qaytish uchun-chi?». «Maslahat»: «Yo‘l ikki bo‘lak: olmagacha va olmadan yulduzgacha — har birini sanang».
- **Bola qiladi:** qadamlarni sanaydi, bloklarni qo'shadi va olib tashlaydi, ishga tushiradi.
- **Tekshiruv:** dastur tugaganda qahramon yulduzda turibdi; 3-pog'ona va ★ da — olma olingan; ★ da — bloklar soni aynan 9.
- **Xatoda:** yetmadi — Kamvoy «Oz qoldi!»; 2-pog'onada o'ngga yurdi — Kamvoy «Yulduz boshqa tomonda!» («Yulduz orqada qoldi — move left kerak»); o'tib ketdi — Ortiqvoy «Ko‘payib ketdi!»; olma olinmadi — Kamvoy «Olma qoldi-ku!» («Avval olmani oling — u 4-zonachada»); ★ da yo'l to'g'ri, lekin gap bloki ham qo'shilgan — Ortiqvoy («Yo‘l to‘g‘ri, lekin 10 ta blok — 9 ta bo‘lishi kerak»); bo'sh — Bo'shvoy.

## 14 · Xulosa: blok va dastur

- **Vaqt:** 0:31–0:33 (2 daqiqa)
- **Bekat:** 1 · Harakatlantirish
- **Ekran:** P9 · bola «Ustoz ekraniga qarang» («Xulosa: blok va dastur»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Blok va dastur». Coddy: «Bugungi ikki so‘z — eslab qoling.» Ikki karta: «Blok — Bitta buyruq» (bitta `move right`) va «Dastur — Ketma-ket buyruqlar» (uchta ulangan `move right`); o'ngda Coddy bloklar bilan yuradi.
- **Tayanch gaplar:**
  1. «Blok — bitta buyruq.»
  2. «Dastur — ketma-ket buyruqlar. Siz hozir dastur tuzdingiz!»
- **O'z so'zi bilan:** «Coddy yulduzni ko‘radimi?» deb so'raydi; pog'onalardan misol so'raydi («kim ★ ni yechdi? Dasturida nechta blok bor edi?»).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi; o'z dasturidan misol aytadi.
- **Tekshiruv:** yo'q.

## 15 · O'yin: «Men robotman»

- **Vaqt:** 0:33–0:37 (4 daqiqa)
- **Bekat:** 1-bekat oxiri
- **Ekran:** P10 · bola «Ustoz ekraniga qarang» («O‘yin: ustozga buyruq bering!»)
- **Qadamlar:**
  1. Proyektorda: yorliq «O‘yin», sarlavha «Men — robotman!». Coddy: «Menga faqat shu buyruqlarni bering!» Uchta ko'k karta: `move right` «Bir qadam o‘ngga» · `move left` «Bir qadam chapga» · `jump` «Sakraydi»; to'rtinchisi: «Boshqa buyruqni bilmayman». Panelda: «O‘yin: siz — robot, bolalar buyruq beradi».
- **Tayanch gaplar:**
  1. «Turamiz! Endi men robotman. Menga faqat shu uchta buyruqni inglizcha ayting.»
  2. «Bunday buyruqni bilmayman. Bor buyruqni ayting.»
  3. «Robot faqat bilgan buyruqni bajaradi.»
- **O'z so'zi bilan:** sinfga orqa o'girib turadi — shunda o'ng va chap bolalarniki bilan bir xil bo'ladi; «Meni doskagacha olib boring» deydi; har buyruqni aynan bajaradi (`jump` — bu yerda birinchi marta: sakra); «run», «besh marta yur» desa — 2-gapni aytadi. Keyin bir bolani robot qiladi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** o'rnidan turadi, inglizcha buyruq beradi; bir bola robot bo'ladi.
- **Tekshiruv:** yo'q (buyruq aniq bo'lishi kerak — kompyuter faqat bilganini qiladi).

## 16 · 2-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 2 · Gapirtirish
- **Ekran:** P4B · bola «Ustoz ekraniga qarang» («Reja: 1-bekat o‘tildi»)
- **Qadamlar:**
  1. Proyektorda reja tepaligi qaytadi: yorliq «Bugungi reja · 2-bekat», sarlavha «Endi qahramonimiz gapiradi!». 1-bekat ✓, yoyi oltin, Coddy birinchi pog'onada; 2 · Gapirtirish miltillaydi.
- **Tayanch gaplar:**
  1. «Birinchi bekatni o‘tdik — endi qahramonimiz gapiradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 17 · `say` bloki

- **Vaqt:** 0:38–0:39 (1 daqiqa)
- **Bekat:** 2 · Gapirtirish
- **Ekran:** P7A · bola «Ustoz ekraniga qarang» («Yangi blok: say»)
- **Qadamlar:**
  1. Proyektorda studiya: yorliq «Yangi blok · say — ayt», sarlavha «say blokiga «2 qadam yur» yozdik». Binafsha oila «Gap» — `say "Salom!"`; dasturda bitta `say "2 qadam yur"`. Coddy hali jim. Ustoz «▶ Ishga tushir»ni bosadi: Coddy «2 qadam yur» deb aytadi, lekin joyidan qimirlamaydi; panelda «Gapirdi, lekin yurmadi».
- **Tayanch gaplar:**
  1. «Yangi oila — binafsha, gap. Blok — say, ya’ni ayt. Ichidagi yozuvni Coddy aytadi.»
  2. «Ichiga “2 qadam yur” deb yozdik. Qarang…»
- **Ustoz qiladi:** «▶ Ishga tushir»ni bosadi, keyin «Keyingi ›».
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 18 · `say`: natija

- **Vaqt:** 0:39–0:40 (1 daqiqa)
- **Bekat:** 2 · Gapirtirish
- **Ekran:** P7 · bola «Ustoz ekraniga qarang» («say faqat gapiradi»)
- **Qadamlar:**
  1. Proyektorda: sarlavha «Gapirdi, lekin yurmadi», ostida «say faqat gapiradi, yurgizmaydi.»; Coddy yonida pufak «2 qadam yur».
- **Tayanch gaplar:**
  1. «say faqat gapiradi, yurgizmaydi. Nima qilishini blok hal qiladi, yozuv emas.»
- **O'z so'zi bilan:** «Nega yurmadi?» deb so'raydi; yurish uchun qaysi rang kerakligini bolalardan aytdiradi («ko‘k!»).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi, javob beradi.
- **Tekshiruv:** yo'q.

## 19 · Ism va rang

- **Vaqt:** 0:40–0:43 (3 daqiqa)
- **Bekat:** 2 · Gapirtirish
- **Ekran:** P4I · bola B6 → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Qahramoningiz», sarlavha «Qahramoningizga ism qo‘ying». Coddy: «Rangini ham o‘zingiz tanlang.» Sinf taxtasi: qahramonlar rangga kiradi, ismlar ko'rinmaydi; son «Ism berdi 9 / 14».
- **Tayanch gaplar:**
  1. «Qahramoningiz gapirishi uchun unga ism kerak. Ism qo‘ying va rangini tanlang.»
- **O'z so'zi bilan:** yozishga qiynalgan bolaga «Ism tanlab ber» tugmasini ko'rsatadi.
- **Ustoz satri:** Ism berdi: 9 / 14
- **Parta:** o'sha sarlavha va Coddy gapi; «Ism» — yozish maydoni (12 harfgacha, ostida «5 / 12 harf»), «🎲 Ism tanlab ber» (Bulut, Chaqmoq, Shamol, Quvnoq, Yulduzcha, To‘lqin, Mitti, Olov); «Rang» — sakkizta rang, qahramon darhol o'sha rangga kiradi. Tasmada «Tayyor bo‘lsa — tugmani bosing» va «Tayyor!». Ism faqat shu noutbukda ko'rinadi.
- **Bola qiladi:** ism yozadi yoki tanlatadi, rang tanlaydi, «Tayyor!»ni bosadi.
- **Tekshiruv:** ism bo'sh emas.

## 20 · Gapirtiramiz

- **Vaqt:** 0:43–0:50 (7 daqiqa)
- **Bekat:** 2 · Gapirtirish
- **Ekran:** B7 (proyektorda ham — ustoz namunasi; bola noutbukida — o'z qahramoni bilan) → «Ustoz ekraniga qarang»
- **Sahna:** bitta topshiriq (qaror 6-A: gapirtirish pog'onalari va do'stga ko'rsatish yo'q; `say` 22-qadamda o'z sahnasida yana ishlatiladi).
- **Qadamlar:**
  1. Yorliq «Mashq», sarlavha «Qahramoningizga gap yozing». Binafsha oila ochiq; dasturda `say "Salom!"`; yozuv yonida «✎ Yozing · 13 / 30». Ustoz proyektorda namuna ko'rsatadi: yozuvni bosadi, o'z gapini yozadi, ishga tushiradi.
- **Tayanch gaplar:**
  1. «Binafsha blokdagi yozuvni bosing va o‘zingiz yozing. Keyin «Ishga tushir».»
- **O'z so'zi bilan:** «Men Momiqman!» — faqat namuna, har kim o'z gapini yozsin; sinfni aylanadi.
- **Ustoz qiladi:** namunada yozuvni o'zi o'zgartiradi va ishga tushiradi.
- **Parta:** o'sha studiya, sahnada bolaning o'z qahramoni (o'z ismi va rangi bilan). Yozuv bosilganda yozish ochiladi (30 harfgacha). «Maslahat»: «Binafsha blokdagi yozuvni bosing va o‘zingiz yozing». To'g'ri bo'lsa: qahramon o'sha gapni pufakda aytadi, «Qahramoningiz gapirdi!».
- **Bola qiladi:** yozuvni o'zgartiradi, ishga tushiradi.
- **Tekshiruv:** dasturda `say` bor, yozuvi bo'sh emas va «Salom!»dan boshqa; qahramon uni aytdi.
- **Xatoda:** ishora «Yozuvni bosib, o‘zingiz yozing — keyin yana ishga tushiring»; yozuv o'zgartirilmagan — Kamvoy «Hali ham «Salom!» deyapti»; yozuv bo'sh — Bo'shvoy «Hech narsa demadi…»; blok olib tashlangan (dastur bo'sh) — Bo'shvoy «Bu yerda hech narsa yo‘q-ku…».

## 21 · Ustozning sahnasi

- **Vaqt:** 0:50–0:52 (2 daqiqa)
- **Bekat:** 3 · Sahna yaratish
- **Ekran:** P11 · bola «Ustoz ekraniga qarang» («Ustoz o‘z sahnasini ko‘rsatyapti»)
- **Qadamlar:**
  1. Proyektorda studiya: yorliq «Ko‘ramiz · ustozning sahnasi», sarlavha «Coddy kosmosda», ostida «jump — sakraydi. Ko‘k blok, demak harakat.». Dasturda: `move right`, `say "Mening kosmosim!"`, `jump`, `move right`. Ustoz «▶ Ishga tushir»ni bosadi: Coddy yuradi, gapiradi, sakraydi; panelda «Siznikisi boshqacha bo‘lsin!».
- **Tayanch gaplar:**
  1. «Oxirgi bekat — har kim o‘z sahnasini yaratadi.»
  2. «jump — o‘yinda tanishgan blok: sakraydi. U ham ko‘k — demak, harakat.»
  3. «Meniki shunaqa chiqdi. Siznikisi boshqacha bo‘lsin.»
- **Ustoz qiladi:** «▶ Ishga tushir»ni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 22 · O'z sahnangiz

- **Vaqt:** 0:52–1:01 (9 daqiqa; zaxira vaqt ortib qolsa, shu qadamga qo'shiladi)
- **Bekat:** 3 · Sahna yaratish
- **Ekran:** P12 · bola B8A → B8 → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «O‘z sahnangizni yarating!». Coddy: «Endi navbat sizda! Qahramoningiz uchun kichik dastur tuzing.» Shartlar: «Joy tanlang» · «Kamida 2 ta harakat bloki» · «O‘zingiz yozgan gap» · «★ Qo‘shimcha: jump». Son «Sahnasi tayyor 8 / 14»; uchta joy va har birini nechta bola tanlagani: Hovli 3 · Kosmos 7 · Suv osti 4 (bu tanlov, yutuq emas). Panelda: «Sahnasi tayyor: 8 / 14 · yordam kerak: 1».
- **Tayanch gaplar:**
  1. «Joy tanlang va o‘z sahnangizni yarating. Shartlar ekranda yozilgan.»
  2. (oxirida) «Oxirgi marta ishga tushirib ko‘ring.»
- **O'z so'zi bilan:** sinfni aylanadi; yaxshi topilmani ovoz chiqarib maqtaydi («Qarang, uning qahramoni sakrab turib gapiryapti»).
- **Ustoz satri:** Sahnasi tayyor: 8 / 14 · yordam kerak: 1
- **Parta:** 1) yorliq «O‘z sahnangiz», «Joy tanlang»; Coddy: «Qahramoningiz shu joyda o‘ynaydi.»; uchta rasm: Hovli, Kosmos, Suv osti; tanlangani halqa bilan belgilanadi va o'ngda o'sha joy qahramon bilan ko'rinadi. 2) Blok studiya, ikkala oila va to'rttala blok ochiq; sarlavha «O‘z sahnangizni yarating!»; yonida shartlar — bajarilgani ✓ oladi: «Joy» · «2 ta harakat» · «O‘z gapingiz» (o'zgartirilmagan «Salom!» hisobga olinmaydi) · «★ jump». Shartlar bajarilib, dastur ishga tushgach: «✓ Sahna tayyor!», ishora «Sahna tayyor! Yana o‘zgartirsangiz bo‘ladi». Bajarilmagan bo'lsa ishora: «Yana harakat bloki kerak (kamida 2 ta)» yoki «Binafsha blokka o‘zingiz gap yozing». «Maslahat»: «Ko‘k doirachani bosing — harakat bloklari; binafsha — gap».
- **Bola qiladi:** joy tanlaydi, dastur tuzadi, ishga tushirib ko'radi, o'zgartiradi.
- **Tekshiruv:** joy, kamida 2 ta harakat bloki, o'zi yozgan gap va dastur kamida bir marta ishga tushdi. Xato yo'q: har bolaning sahnasi boshqacha. Yutuq: «O‘z sahnam».

## 23 · Ko'rgazma

- **Vaqt:** 1:01–1:06 (5 daqiqa)
- **Bekat:** 3 · Sahna yaratish
- **Ekran:** P13 · bola B9
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rgazma», sarlavha «Do‘stingizning sahnasi». Coddy: «Yoningizdagi do‘stingizning sahnasini ko‘ring.» Panelda: «Keyin 2–3 bola ko‘rsatadi. So‘rang: «Qahramoni nima qildi?»». Bolalarning ishi proyektorga chiqmaydi.
- **Tayanch gaplar:**
  1. «Yoningizdagi do‘stingizning sahnasini ko‘ring.»
  2. «Kim sinfga ko‘rsatadi?»
  3. (ko'rsatgan bolaga) «Qahramoningiz nima qildi?»
- **O'z so'zi bilan:** ikki-uch bola noutbukini ko'tarib ko'rsatadi; har biriga bittadan savol va qarsak.
- **Parta:** bolaning sahnasi butun ekranda o'zi qayta-qayta o'ynaydi (o'z joyida); pastda ismi va qahramonining ismi (masalan «Aziz · Zippi»), ishora «Sahnangiz qayta-qayta o‘ynaydi».
- **Bola qiladi:** do'stining sahnasini ko'radi; xohlasa sinfga ko'rsatadi.
- **Tekshiruv:** yo'q.

## 24 · Yakun

- **Vaqt:** 1:06–1:08 (2 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** P8 · bola B5
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz dastur tuzdingiz!». Bugungi uch so'z: «Dasturlash — Kompyuterga buyruq berish» · «Blok — Bitta buyruq» · «Dastur — Ketma-ket buyruqlar». Kichik karta «Keyingi dars · 2 · Labirint». Pastda: ✓ Harakatlantirish · ✓ Gapirtirish · ✓ Sahna yaratish. (Qaror 9-A: alohida «labirint savoli» qadami yo'q.)
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: harakatlantirdik, gapirtirdik, sahna yaratdik.»
  2. «Noutbukingizga qarang: bugun nima qildingiz?»
  3. «Keyingi darsda — labirint.»
- **O'z so'zi bilan:** uch so'zni bolalardan aytdiradi; ikki-uch boladan noutbukidagi sonlarni so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Birinchi dasturingiz tayyor!». Coddy: «Qahramoningizni harakatlantirdingiz, gapirtirdingiz va o‘z sahnangizni yaratdingiz.» «Siz bugun»: N qadam · N sakrash · N gap · N sahna — bolaning o'z muvaffaqiyatli dasturlaridan (haqiqiy son). O'z qahramoni o'z joyida; «Keyingi darsda labirintda ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 25 · Sinfimiz bugun

- **Vaqt:** 1:08–1:10 (2 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** P14 · bola B5
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): 210 qadam · 28 sakrash · 54 gap · 12 sahna; o'ngda bolalar tanlagan qahramonlar. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda labirintda!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti. LMS'da sessiya yopiladi, natija LMS'ga boradi.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Kompyuter faqat dasturni bajaradi. Dasturni esa siz tuzasiz.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 24-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q (jamoa bo'lib nimaga erishganini ko'radi).

---

## «Uy» ko'rinishi (darsdan keyin) — keyingi ish

Solo (yuqorida) — darsni ustozsiz o'tish yo'li, u tayyor. Alohida «Uy» (darsdan keyin qaytib kirish, saqlangan sahnalar) hali yo'q; shuning uchun bolaga «Sahnangiz saqlandi» deyilmaydi. Taklif (qurilmagan): ustoz ko'rsatgan qadamlar solo'dagidek; 15-qadam o'rniga — «Uyda kimnidir robot qiling: uni inglizcha uchta buyruq bilan eshikkacha olib boring».

## Ochiq savollar va tekshirilmagan joylar

1. **Vaqtlar taxminiy.** Sinfda o'lchanmagan; 25 qadamga v10.4 dagi daqiqalardan taqsimlandi. 70 daqiqa — reja; birinchi kuni kirish uzoq cho'zilishi mumkin, zaxira shuning uchun.
2. **9 yoshli va 13 yoshli bir sinfda.** Pog'onalar shu farq uchun; 3-pog'ona va ★ 12–13 yoshliga yetarlimi — sinalmagan.
3. **Inglizcha blok nomlari** 9 yoshli, ingliz tilini bilmaydigan bolaga qanchalik oson — sinalmagan. Yumshatish: rang, belgi, ustozning bir martalik o'zbekcha izohi, 15-qadamdagi o'yin.
4. **Blockly (18.11)** — sinf noutbukidagi sensorli panelda sudrash qanchalik oson — sinalmagan; shuning uchun asosiy yo'l — bosib qo'shish.
5. **Ism yozish.** 9 yoshli bola sekin yozadi; «Ism tanlab ber» bilan yumshatildi — sinash kerak.
6. **15-qadam o'yini** uchun sinfda 5–6 qadam yura oladigan joy kerak.
7. **Ruscha matn** hali yo'q; blok nomlari ruschada ham inglizcha qoladi.
8. **Huk savoli va uch sinov** bolalarda sinalmagan.
9. **Muammochalar (18.11)** — bola ularni xato emas, yordam deb qabul qiladimi — sinalmagan.
10. **Bola yozgan gap** (20, 22-qadam) proyektorga chiqmaydi; kelajakda ko'rgazmada ustoz tanlagan sahna proyektorga chiqsa — qo'pol so'z filtri shart.
11. **1-qadamdagi o'yin rasmlari** (labirint, olma yig'amiz, kosmik o'yin) — sxematik; o'sha darslar (2, 11, 17) qurilganda ularning o'z sahnasidan olinadi.
12. **Uch pog'onali maslahat, 7 soniyada miltillash, «Ustozni chaqir»** (18.11 da olib tashlandi) — bolalar sinovida kerak bo'lsa qaytariladi.

## Foydalanuvchi qarori (20.11 kech, ko'rik sahifasi U-1 A)

**A·2** — maslahatlar yo'nalish beradi, javobni aytmaydi: 5 ta almashtirildi (masalan «Olmagacha 6 ta move right, yulduzga 3 ta move left: 6 + 3 = 9» → «Yo‘l ikki bo‘lak: olmagacha va olmadan yulduzgacha — har birini sanang»). 1-darsda o'qib berish qadami yo'q — A·1 tegmaydi. Oltin namunasi shu o'zgarish uchun qayta yozildi.

