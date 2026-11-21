# 1-dars. Tanishuv: kompyuter, dasturlash va Blok studiya

> **Holat: qoralama v10.4 (2026-11-16) — etalon v3.3 da hamma ekran qabul; oxirgi tuzatishlar ko'rikda. Kod hali v9 da** (kod shu fayldan keyin quriladi; ungacha ustoz varag'i v10.4 matnini, dars esa v9 ni ko'rsatadi).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan HAR so'z shu yerda. Kod shu fayldan quriladi; matn o'zgarsa, avval shu fayl o'zgaradi. Ustoz varag'i (`?rol=varaq#/dars/1`) ham shu fayldan o'zi yig'iladi. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim — dars matni qoidalari). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 1-dars.
> «Rasm» qatorlari — ko'rik sahifasi shu kod bo'yicha sahnani chizadi; bolaga ko'rinmaydi.
> **v10 (15.11, foydalanuvchi fidbeki F-1115-01…09):** dars kirish bilan ochiladi — bu birinchi dars, kursda nima yasaymiz (01); yangi 3-sahna «Dasturlash nima?» — dasturlash va blokli dasturlash (01); blok rangi — blokning oilasi, studiyada rang doirachalari, tanishuvda har bola o'zi bosadi (02); dars ichida taxmin savoli yo'q — avval ko'rsatamiz, tekshiruvni amaliy topshiriq qiladi; savol faqat boshidagi hukda (03); bloklar inglizcha, Scratch'dagidek: `move right` · `move left` · `jump` · `say "Salom!"` — «de» yo'q (04, 07); bloklar mozaikadek ulanadi — ustma-ust, sudrab yoki bosib (05); bola o'z ma'lumotini blok nomlari bilan ko'radi, faqat o'z noutbukida; proyektorda sinf jami yo'q (08); ekranlarda vaqt yo'q — taymer, sahna soati, «Vaqt tugadi» olib tashlandi (09). Ustoz panelidagi «Ayting» qatori (06) — keyingi ish, bu versiyada yo'q.
> v10.1 (15.11 kech, F-1115-10/11): «sanash nuqtalari» → zonachalar va sakrash yoylari; ekranlar qat'iy setkada (etalon v3.1).
> **v10.2 (16.11, etalon v3 ko'rigi F-1116-01…06):** kirishda butun kurs emas — bloklardan nima yasaymiz: labirint, olma terish, kosmik o'yin (01); huk javobi «Unga buyruq **beramiz**» — «yozamiz» 3-sahnadagi «biz buyruqni yozmaymiz» bilan zid edi; butun darsda «dastur tuzamiz», «yozamiz» emas (02); sarlavha doim bir qatorda, faqat huk savoli ikki qatorgacha; reja sarlavhasi — savol «Bugun nima qilamiz?» (03); sinf doskasida pog'onalar — zinapoya (04); muammocha pufagida faqat uning gapi, maslahat — tugmada (05); bolaga «qadam» deyiladi: «Qadamlarni sanang», «Yulduzgacha necha qadam?» — «nuqta» so'zi yo'q (06). P2 uchun ikki yo'l (kartalar katta ekranda ham / faqat noutbukda) — foydalanuvchi tanlaydi, 2-sahnaga tanlovdan keyin kiradi.
> **v10.3 (16.11, etalon v3.2 ko'rigi F-1116-07…10):** 2-sahna — A yo'l (kartalar katta ekranda ham), javob kartalari rasmli (07–08); reja va yakun — bitta yo'l xaritasi: 4-sahnada boshi, 10- va 13-sahnada davomi, 16-sahnada oxiri (09–10); ikki ustunli ekranda chap ustunda bo'sh oraliq qolmaydi (07).
> **v10.4 (16.11, etalon v3.3 — hamma ekran qabul, izohlar F-1116-11…13):** huk — «uch taxmin, uch sinov»: javoblar ochilganda kartada nechta bola tanlagani, sinov natijasi kartaning o'zida (11); 1-sahnada vaqt so'z bilan — «Keyin — bloklardan o'yin», «Bugun esa…» (12); bo'sh joy mazmun bilan to'ladi, quti cho'zilmaydi — 3-sahnada kod tepada, bloklar pastda; 7-sahna doskasida katta yulduzchalar (13).
> Oldingi versiyalar tarixi (v1–v9) va «1-versiyadan farqi» jadvali: `../arxiv/manba-v9/001-tanishuv-v9.md`.

## Pasport

- **Dars turi:** yangi mavzu (blokli). Bu sinov darsi ham: bola va ota-ona kursni shu darsdan ko'radi.
- **Natija (dasturdan):** personaj ekranda yuradi va gapiradi.
- **Bola nimani tushunadi:** bloklardan nima yasaladi (labirint, olma terish, kosmik o'yin) va bugun birinchi qadam — qahramonni yurgizish; kompyuter o'zi hech narsa qilmaydi, unga buyruq kerak; kompyuterga buyruq berish — dasturlash; biz buyruqni yozmaymiz, bloklarni ulaymiz — bu blokli dasturlash; blok — bitta buyruq; blok rangi — uning oilasi; buyruqlar ro'yxati — dastur; kompyuter maqsadni «ko'rmaydi», faqat dasturda borini bajaradi.
- **Tekshiruv (dasturdan):** avto — personaj buyruqni bajardi.
- **Vaqt:** reja 70 daqiqa, zaxira 10–20 daqiqa (dars 80–90 daqiqa). Vaqt — faqat ustozning rejasi (shu fayl va ustoz varag'ida); ekranlarda soat va taymer yo'q (F-1115-09). Zaxira birinchi kun kirishiga va savollarga ketadi; ortib qolsa — 14-sahnaga (o'z sahnangiz) qo'shiladi.
- **Uch bekat:** 1 · Yurgizamiz — 2 · Gapirtiramiz — 3 · O'z sahnangiz. Pastdagi sahnalarda «Bekat» qatori — sahna darsning qaysi qismiga kirishi; reja xaritasi har yangi bekat boshida qaytadi.
- **Savol:** darsda bitta — boshidagi huk (2-sahna). Qolgan joyda avval ko'rsatamiz va tushuntiramiz; bola tushunganini amaliy topshiriq tekshiradi (F-1115-03).
- **Murojaat:** bolaga «siz» (tasdiqlangan 13.11).
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda sahnada Coddy; bola ishlaganda o'z qahramoni.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Sahnalar |
|---|---|---|
| 0–4 | Kiradi, Coddy bilan tanishadi; bu birinchi dars ekanini va bloklardan nima yasashini ko'radi | 1 |
| 4–10 | Savolga javob beradi: Coddy'ni yulduzga qanday olib boramiz? Sinf ikki usulni sinab ko'radi — baqiradi va sichqoncha bilan sudraydi — Coddy qimirlamaydi; ustoz blokni uch marta bosadi — Coddy yulduzga yetadi | 2 |
| 10–13 | Dasturlash nima, blokli dasturlash nima — ko'radi va eshitadi | 3 |
| 13–16 | Bugungi rejani va dars oxirida nima yasashini ko'radi, qahramon tanlaydi | 4 |
| 16–21 | Blok studiya bilan tanishadi: rang doirachalarini o'zi bosib chiqadi; birinchi dasturi bilan o'z qahramonini yulduzga olib boradi | 5 |
| 21–33 | Coddy bloklarni sanashini ko'radi, o'zi uch pog'onali masalani yechadi; xulosa: blok va dastur | 6–8 |
| 33–37 | O'rnidan turadi: ustozni «robot» qilib, inglizcha buyruqlar bilan boshqaradi | 9 |
| 37–52 | Yangi blok `say`ni ko'radi, qahramoniga ism va rang beradi, uni gapirtiradi, yonidagi do'stiga ko'rsatadi | 10–12 |
| 52–61 | Joy tanlab, o'z sahnasini yasaydi | 13–14 |
| 61–70 | Do'stlarining sahnasini ko'radi, o'zinikini ko'rsatadi; o'z noutbukida bugungi ma'lumotini ko'radi; yakun | 15–16 |

## So'zlar

Darsda beshta yangi so'z kiradi. Har biri alohida gapda, birinchi marta rasm bilan.

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| dasturlash | kompyuterga buyruq berish | 3 | Coddy va uning ustida tushayotgan blok |
| blokli dasturlash | buyruqni yozish o'rniga bloklarni ulash | 3 | bloklar mozaikadek ulanib tushadi |
| blok | bitta buyruq | 2, 3, 5, 8 | ko'k `move right` bloki |
| Blok studiya | bloklardan dastur yig'iladigan joy | 5 | to'rt qismli ekran: ranglar, bloklar, dastur, sahna |
| dastur | buyruqlar ro'yxati | 8 | ustma-ust ulangan bloklar |

Yordamchi so'zlar (ta'rifsiz, tushunarli): buyruq, ishga tushirish, qahramon, yulduz, sahna, pog'ona, rang (blok oilasi).
Bu darsda AYTILMAYDI (keyingi darslarniki): ketma-ketlik, tartib (2-dars), koordinata (3-dars), hodisa (4-dars), takrorlash (5-dars), algoritm, kod (bloklar ortidagi JavaScript — 19-dars «Kodini ko'rsat»; 3-sahnada faqat «dasturchilar buyruqni yozadi» deb bir qator ko'rsatiladi, so'z sifatida o'rgatilmaydi).
Bir ma'noga bitta so'z: «qahramon» (dasturda «personaj» deyilgan — bolaga doim «qahramon»); «blok» («g'isht», «bo'lak» deyilmaydi); «Ishga tushir» (tugma nomi; «start», «play» deyilmaydi).
**Til qoidasi (F-1115-07):** blok nomlari inglizcha (Scratch'dagidek) — boshqa hamma narsa o'zbekcha: tugmalar, topshiriq gapi, Coddy gapi, muammochalar, rang oilasining nomi. Har blok birinchi chiqqanda ustoz o'zbekcha ma'nosini bir marta aytadi («move right — o'ngga yur»). Gapda blok nomi o'zgarmaydi: «`move right` blokini qo'shing» (o'zbekcha qo'shimcha blokka emas, «blok» so'ziga qo'shiladi).

## Bloklar

Blok rangi — blokning **oilasi** (F-1115-02). 1-darsda ikkita oila:

| Oila (rang) | Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|---|
| Harakat (ko'k) | `move right` | o'ngga yur | qahramon o'ngga bir qadam yuradi | 2-sahna (ustoz), 5-sahna (bola) |
| Harakat (ko'k) | `move left` | chapga yur | qahramon chapga bir qadam yuradi | 7-sahna, 2-pog'ona |
| Harakat (ko'k) | `jump` | sakra | qahramon joyida bir marta sakraydi | 13-sahna |
| Gap (binafsha) | `say "Salom!"` | ayt | qahramon blok ichidagi yozuvni aytadi; yozuvni o'zgartirsa bo'ladi | 10-sahna |

Bloklar ranglari Scratch'dagidek: harakat — ko'k, gap — binafsha. Keyingi darslarda yangi oila kelsa (masalan, hodisa — sariq, 4-dars), u ham rang doirachalariga qo'shiladi. 1-darsda doirachalar faqat ikkita.

**Mozaika (F-1115-05).** Har blok — boshqotirma bo'lagi: tepasida o'yiq, pastida do'mboq. Dastur — ustma-ust ulangan bloklar ustuni. Blokni ikki yo'l bilan qo'shsa bo'ladi: sudrab dasturga olib borish (yaqinlashganda ulanadigan joy yonadi, qo'yib yuborsa «chiq» etib ulanadi) yoki blokni bosish (dasturning oxiriga o'zi ulanadi — 9 yoshli bola uchun). Dasturdagi blokni chetga sudrab chiqarsa yoki bosib «olib tashlash»ni tanlasa — u olib tashlanadi; uning ostidagi bloklar yuqoriga ko'tarilib ulanadi.
Bajarilayotgan blok yonib turadi. Dasturda eng ko'pi 12 ta blok.
Masalalarda maqsad doim bitta: dastur tugaganda qahramon yulduzda TURGAN bo'lsin. Yulduzdan o'tib ketsa — yetib bormagan hisoblanadi.

## Ekranlar ko'rinishi (hamma sahnada bir xil)

Tekis fonli ekran yo'q — har ekran o'sha hovlida (KONSEPSIYA 12-bo'lim, 15–16-band). Ekranning tuzilishi va shrifti — etalon sahifasida (`../etalon/etalon.html`, yig'ish: `node new-junior/etalon/yig.mjs`; shrift: Geologica sarlavha, Onest matn, JetBrains Mono kod); bu bo'lim — nima qayerda turishi.

- **Sarlavha (hamma ekranda):** savol yoki xulosa, **bir qatorda** (faqat 2-sahnadagi huk savoli ikki qatorgacha; F-1116-03), bitta kalit so'z ajratilgan; ostida bitta qisqa izoh. Sig'masa — so'z qisqaradi, shrift emas. Ekran tepasida faqat dars nomi — bekat chizig'i yo'q (KONSEPSIYA 38-qaror).
- **Savol (2-sahna; katta ekranda ham, bola noutbukida ham):** savol tepada chapda; o'ngda uchta rasmli karta — rang + belgi + qisqa gap: A ko'k, karnay · B to'q sariq, sichqoncha ko'rsatkichi · C binafsha, buyruq strelkasi (F-1116-08). Bola o'qimasdan ham taniydi. «Uch taxmin, uch sinov» (F-1116-11): javoblar ochilganda har kartaning belgisida nechta bola tanlagani (faqat son); har sinovdan keyin natija shu kartaning o'zida — «✕ qimirlamadi» (karta xiralashadi) yoki «✓ ishladi» (karta oltin).
- **Qahramon tanlash:** qahramonlar hovlida; sichqoncha ustiga borganda sakraydi.
- **«Katta ekranga qarang»:** kechki hovli, tepadan nur; yozuv tepada, qahramon pastda tepaga qarab turadi. Qo'shimcha qisqa gap («Tayyor!») yozuv ostida. Ataylab tinch.
- **Sinf taxtasi (proyektor):** qahramonlar tepalikda qator, yangi kelgani yuqoridan tushadi; ism yo'q, faqat son.
- **Reja (proyektor) — yo'l xaritasi (F-1116-09/10):** butun ekran hovli. Pastda yo'l: Coddy start zonachasida, keyin uchta katta bekat zonachasi — rangi o'sha oilaniki: 1 · Yurgizamiz (ko'k, harakat belgisi) · 2 · Gapirtiramiz (binafsha, gap belgisi) · 3 · O'z sahnangiz (oltin, yulduz); orasida sakrash yoylari, har bekat ostida yorlig'i. Tepada chapda sarlavha; o'ngda kichik karta — 4-, 10-, 13-sahnada «Dars oxirida: o'z sahnangiz» (jonli kichik rasm), 16-sahnada «Keyingi dars: 2 · Labirint». Xarita darsda to'rt marta chiqadi: reja (4-sahna), 2-bekat boshi (10-sahna), 3-bekat boshi (13-sahna), yakun (16-sahna). Qaytganda o'tilgan yoy oltin bo'ladi, bekat yorlig'ida ✓, Coddy keyingi bekatga sakrab o'tgan, navbatdagi bekat miltillaydi.
- **Ikki ustunli ekran:** chap ustunda bo'sh oraliq qolmaydi (F-1116-07) — joy **mazmun bilan** to'ladi: kattaroq yoki boshqacha joylashgan mazmun; quti cho'zilmaydi, ichida ham bo'sh joy qolmaydi (F-1116-13: «bo'sh joyni cho'zish muammoni yechmaydi»).
- **Blok studiya (Scratch tartibida, F-1115-05):** chap chetda — rang doirachalari ustuni (har biri rangi, belgisi va oila nomi bilan: «Harakat», «Gap»); undan o'ngda — tanlangan oilaning bloklari; o'rtada — dastur maydoni (ustma-ust ulangan bloklar, tepasida qahramonning yuzi); o'ngda — sahna. Pastda bitta asosiy tugma «Ishga tushir». Topshiriq gapi tepada; gapda blok nomi o'rniga blokning rasmi. Yulduzli masalada yerda zonachalar (KONSEPSIYA 67-qaror): qahramon start zonachasida turadi, har qadam — bitta raqamli zonacha, orasida sakrash yoyi; yulduz turgan zonacha oltin; o'tilgan yoy oltin bo'ladi. Sahnaning pastki 40% i — yo'l qatlami: topshiriq gapi, muammocha va pufaklar unga tushmaydi (68-qaror). Ustoz ko'rsatayotganda muammocha chiqadi, lekin «Maslahat» va «Yechimni ko'rsat» tugmalari yo'q. Muammocha tepalik ortidan ko'tarilib mo'ralaydi; qahramon va yulduzni yopmaydi. Yozuvni o'zgartirish kerak joylarda (12-sahna namunasi va 1-pog'onasi, 14-sahna) o'zgartirilmagan «Salom!» tebranib, sariq yonib chaqiradi; yozuvda doim qalam belgisi.
  Ko'ringan blok ishlaydi. «Ishga tushir» bosib bo'lmaydigan paytda uning o'rnida qulf belgisi va sababi turadi.
  Ustoz ko'rsatadigan studiyada (proyektor) Coddy `say` blokidagi gapni ovoz chiqarib aytadi: darsdagi tayyor gaplar («Salom!», «2 qadam yur», «Men Coddyman!», «Bu — mening kosmosim») oldindan yozilgan o'zbekcha ovoz bilan; ustoz o'zi yozgan boshqa gap — brauzerda o'zbek ovozi bo'lsa. Ovoz bo'lmasa jim, gap pufakda baribir chiqadi. Bola noutbuki darsda jim.
- **Sinf doskasi (proyektor, bolalar o'zi ishlayotganda — 5, 7, 12, 14, 15-sahna):** ustozning bo'sh ish joyi o'rniga. Tepada topshiriqning nomi; o'rtada topshiriq (7- va 12-sahnada — pog'ona zinapoyasi, F-1116-04: 1 → 2 → 3 → ★ kartalari chapdan o'ngga zinadek ko'tariladi, ostida yerda zonachalar sakrash yoylari bilan ulangan; har kartada raqam, kichik rasm — qahramon, yulduz va yo'nalish —, bir qatorli topshiriq va hozir shu pog'onada nechta bola); pastda tugatganlar soni va sinfning yulduzchalari (kim ekani ko'rinmaydi) hamda «Qiynalsangiz — "Maslahat"ni bosing». Vaqt yo'q (F-1115-09): sahnani ustoz o'zi tugatadi.
- **Darsdan oldin (bola noutbuki):** o'quvchi ustozdan oldin kirsa — kechki hovli va «Ustozni kutamiz», ostida «Dars hozir boshlanadi». Sinfda bo'sh o'rin qolmagan bo'lsa — «Sinfda bo'sh joy yo'q», ostida «Ustozga ayting». Ustoz ekrani ochilayotganda: «Dars ochilmoqda».
- **Dars eshigi (bolaga ko'rinmaydi):** `#/dars/1` — ikki karta: «Ustoz ekrani» («Darsni boshlash») va «O'quvchi ekrani» («Darsga kirish», ismi yoziladigan maydon bilan); pastda qisqa yo'riq va «Ikkalasi bitta sahifada (tez ko'rik)» havolasi.
- **Ustoz paneli (proyektor):** dars ekranining OSTIDA, har sahifada bir xil tasma — ustozning «pulti». Chapda: orqaga tugmasi, darsning bo'lagi va shu sahnadagi qadamlar (nuqtalar). O'rtada: hozir nima qilish kerak yoki nechta bola tayyor. O'ngda: «Keyingi» — doim shu joyda. Soat yo'q (F-1115-09). Ustoz avval ekrandagi ishni qilishi yoki sinfni kutishi kerak bo'lsa, «Keyingi» xira turadi, tayyor bo'lganda yonadi (bosilsa baribir ishlaydi). Bola noutbukida panel yo'q. (Keyingi ish, F-1115-06: o'rtadagi qatorga qo'shimcha «Ayting: «…»» — shu qadamning tayanch gapi.)
- **O'quvchining asosiy tugmasi:** coral (ustoznikidek; 18.11, 84-qaror), doim o'ng pastda, bir xil o'lchamda: «Tayyorman» (1-sahna), «Ishga tushir» (Blok studiya), «Tayyor!» (11-sahna). Pog'onali topshiriq bajarilgach, «Ishga tushir» o'rnida «Keyingi pog'ona» (yonida kichik «qayta ko'rish»): ekran o'zi almashmaydi. Tanlov ekranlarida (qahramon, javob kartalari, joy, rang doirachalari) tugma yo'q: tanlashning o'zi — harakat.

## Yordam va xato (hamma topshiriqda bir xil)

- Bola 7 soniya hech narsa bosmasa, bosilishi kerak bo'lgan joy miltillaydi (javobni emas, joyni ko'rsatadi).
- Xato chiqsa — muammocha keladi va bitta gap aytadi. Pufakda faqat shu gap, kichik; maslahat matni pufakka yozilmaydi — u «Maslahat» tugmasida (F-1116-05). «Xato», «noto'g'ri» so'zlari yozilmaydi.
- «Maslahat» tugmasi uch pog'onali: yo'nalish → toraytirish → deyarli javob.
- Uch urinishdan keyin «Yechimni ko'rsat» tugmasi chiqadi.
- **Yordam belgisi:** bola uch marta urinib o'ta olmasa yoki «Ustozni chaqir»ni bossa, uning noutbuki chetida sariq hoshiya yonadi. Proyektorda faqat son: «Yordam kerak: 2».
- **Proyektorga chiqmaydi:** bolaning ismi, bola yozgan so'z, kim qayerda qolib ketgani, bolaning shaxsiy ma'lumoti (F-1115-08). Faqat sonlar.

## Darsdan oldin (ustoz uchun)

Ustoz varag'ining boshida chiqadi (varaq shu fayldan o'zi yig'iladi).

- Shu varaqni o'qing: har sahnada nima deyiladi, ekranda nima chiqadi. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk. Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating va tushuntiring, keyin bolalar o'zi bajaradi.
- Bloklar inglizcha: `move right`, `move left`, `jump`, `say`. Har blok birinchi chiqqanda o'zbekcha ma'nosini bir marta ayting va rangini ayting: «ko'k — harakat», «binafsha — gap».
- Ustoz noutbuki proyektorga ulangan, ekran aynan takrorlanadi. Tovush yoqilgan — tovush faqat ustoz noutbukida, bola noutbuklari jim.
- Ustoz noutbukida dars eshigi → «Ustoz ekrani» → «Darsni boshlash». F tugmasi — to'liq ekran. Oldinga — ekran ostidagi «Keyingi» yoki o'ng strelka; orqaga — chap strelka.
- Har bola noutbukida dars eshigi → «O'quvchi ekrani» → «Darsga kirish». Ustozdan oldin kirgan bola «Ustozni kutamiz»ni ko'radi va ustoz ochishi bilan o'zi kiradi.
- 2-sahnada Coddy'ni sichqoncha bilan sudrab ko'rasiz (yoki bitta bolani chiqarasiz).
- 9-sahnadagi o'yin uchun sinfda 5–6 qadam yura oladigan bo'sh joy kerak.
- Coddy `say` blokidagi gapni ovoz chiqarib aytadi (10, 12, 13-sahna). Tovush yoqilganini tekshiring.
- Bolalar o'zi ishlayotganda (5, 7, 12, 14, 15-sahna) proyektorda sinf doskasi turadi. Ekranda soat yo'q: qachon to'xtashni siz hal qilasiz (varaqdagi daqiqalar — mo'ljal).
- Noutbuk chetida sariq hoshiya yongan bolaga boring: u uch marta urinib o'ta olmagan.

---

## 1 · Kirish

- **Vaqt:** 0:00–0:04 (4 daqiqa)
- **Bekat:** hali yo'q
- **Sahna:** ikki qadam.
- **Qadamlar:**
  1. Tanishuv. Hovli. Sarlavha: «1-dars · Tanishuv». Coddy salom berib turibdi, tepasida «Salom!» pufagi. Ostida kichik yozuv: «Kursning birinchi darsi».
  2. Bloklardan nima yasaymiz (F-1116-01: butun kurs emas — Blok studiya moduli). Uchta rasm birin-ketin chiqadi, har biri o'zi o'ynab turadi: labirint (qahramon yo'l topib yulduzga chiqadi; «2-dars»), olma terish (olmalar tushadi, qahramon tutadi, ball sanaladi; «11-dars»), kosmik o'yin (raketa o'q otadi, dushmanlar tepada; «17-dars»). Sarlavha: «Keyin — bloklardan o'yin». Coddy: «Salom! Men Coddy. Bugun esa meni yurgizishni o'rganasiz.» — vaqt so'z bilan aytiladi (F-1116-12): o'yinlar keyingi darslarda, bugun — Coddy'ni yurgizish; bola 1-darsda o'yin yasaymiz deb o'ylamaydi. Qanday yurgizishni aytmaydi: javob hukda ochiladi.
- **Tayanch gaplar:**
  1. «Bu — Coddy. U bugun men bilan birga ishlaydi.»
  2. «Keyingi darslarda bloklardan o'yin yasaymiz: labirint, olma terish, kosmik o'yin. Bugun esa Coddy'ni yurgizamiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi, o'zini tanishtiradi; bloklardan nima yasalishini rasmlar bo'yicha qisqa aytadi (kursda keyin sayt va bot ham bo'lishini bir gap bilan qo'shsa bo'ladi); hamma kirguncha bolalar bilan gaplashib turadi.
- **Ustoz satri:** Kirdi: 9 / 14 · Bloklardan nima yasaymiz
- **Parta:** «Salom, Aziz!» (ism tizimdan keladi), ostida «Kursning birinchi darsi»; pastki tasmada «Tayyor bo'lsangiz — tugmani bosing» va o'ngda asosiy tugma: «Tayyorman». Bosgach: «Katta ekranga qarang», ostida «Zo'r!».
- **Bola qiladi:** «Tayyorman»ni bosadi; rasmlarni ko'radi.
- **Tekshiruv:** tugma bosildi.
- **Rasm:** `sahna=ochiq; zona=hovli; aktyor=coddy:salom:oddiy:20; pufak=Salom!; us=Kirdi: 9 / 14; parta=tugma:Tayyorman`

## 2 · Savol: Coddy'ni qanday yurgizamiz?

- **Vaqt:** 0:04–0:10 (6 daqiqa)
- **Bekat:** hali yo'q (ustoz panelida: «Savol»)
- **Sahna:** Hovli. Coddy chapda, yulduz uch qadam narida. Dars savol bilan boshlanadi (metodikada — «huk»): savol, bolalarning javobi va ikki sinov. Bu — darsdagi yagona savol (F-1115-03). Besh qadamda ochiladi — har «Keyingi»da ekranda bitta yangi narsa.
- **Qadamlar:**
  1. Savol. Coddy va yulduz, orasida uchta sakrash yoyi. Sarlavha: «Coddy'ni yulduzga qanday olib boramiz?». O'ngda uchta rasmli javob kartasi — katta ekranda ham (A yo'l, 16.11). Bolalar noutbukda javob beradi.
  2. Sinf javoblari — uch taxmin (F-1116-11): har kartaning belgisida nechta bola tanlagani (faqat son, masalan A 3 · B 7 · C 4). Panelda: «Qaysi biri ishlaydi? Sinab ko'ramiz.»
  3. Birinchi sinov — baqiramiz. Tepada kichik «Sinf ovozi» spidometri. Bolalar baqiradi va tugmani bosadi — spidometr to'ladi (bosish to'xtasa, sekin pasayadi); «YUR!» pufaklari sinf tomondan, pastdan ko'tariladi — Coddy va yulduzni yopmaydi. To'lganda: «MAX!», pufaklar yo'qoladi, Coddy yonida «Baribir qimirlamadi!», yuzida savol belgisi. A kartasida: «✕ qimirlamadi», karta xiralashadi.
  4. Ikkinchi sinov — sudraymiz. Sarlavha: «Sichqoncha bilan sudrab ko'ramiz»; Coddy ustida sichqoncha qo'li ishora qilib turadi. Ustoz (yoki chaqirilgan bola) Coddy'ni tortadi: Coddy biroz cho'ziladi, qo'yib yuborilsa joyiga sakrab qaytadi — «Baribir qimirlamadi!». B kartasida: «✕ qimirlamadi».
  5. Javob. Sarlavha: «Coddy faqat buyruqni bajaradi». Osmondan ko'k `move right` bloki tushadi, yonida: «Buyruq — mana shu blok. Bosing!». Blok — haqiqiy tugma: ustoz bosadi, Coddy bir qadam yuradi. Uch bosishda Coddy yulduzda: «Buyruq ishladi — Coddy yulduzda!». Bosmaguncha «Keyingi» xira. Shu lahzada C kartasi oltin bo'ladi: «✓ ishladi», belgisida — 4 bola; yoylar oltin, Coddy yulduzda quvonadi. Har bolaning noutbukida o'z natijasi.
- **Tayanch gaplar:**
  1. «Coddy'ni yulduzga qanday olib boramiz? Noutbukda tanlang.»
  2. «Sinab ko'ramiz. Hammamiz birga: YUR!»
  3. «Coddy faqat buyruqni bajaradi. Buyruq — mana shu blok: move right, ya'ni o'ngga yur.»
- **O'z so'zi bilan:** sinf javoblarini o'qib beradi («ko'pchilik sudraymiz dedi — tekshiramiz»); ikki marta baqirtiradi («Balandroq!»); bir bolani chiqarib, Coddy'ni sichqoncha bilan sudratadi; «buyruq beramiz» deganlardan nega shunday deganini so'raydi.
- **Ustoz qiladi:** 4-qadamda Coddy'ni sichqoncha bilan sudraydi (yoki bolani chiqaradi); 5-qadamda tushgan blokni uch marta bosadi.
- **Ustoz satri:** har qadamda navbatdagi ish: Javob berdi: 12 / 14 · Javoblarni sinfga o'qib bering · «YUR!» bosildi: 137 marta · Coddy'ni sichqoncha bilan sudrang · Blokni bosing — Coddy yuradi (3 marta)
- **Parta:** 1-qadamda «Coddy'ni yulduzga qanday olib boramiz?» — uchta rasmli karta: «"YUR!" deb baqiramiz» · «Sichqoncha bilan sudraymiz» · «Unga buyruq beramiz» ✔; javobdan keyin: «Katta ekranga qarang», ostida «Javobingiz qabul qilindi». 3-qadamda butun ekranga bitta katta tugma: «YUR!» (bosilganda titraydi, hech narsa bo'lmaydi). Qolgan qadamlarda: «Katta ekranga qarang».
- **Bola qiladi:** javob tanlaydi; baqiradi va tugmani bosadi; sudrashni kuzatadi (yoki o'zi chiqib sudraydi).
- **Tekshiruv:** to'g'ri javob — uchinchisi. Baho qo'yilmaydi va «noto'g'ri» deyilmaydi: javobni sinov ko'rsatadi.
- **Rasm:** `sahna=ochiq; zona=hovli; aktyor=coddy:turadi:savol:18; yulduz=74; soz=YUR!; us=«YUR!» bosildi: 137 marta; parta=tugma:YUR!`

## 3 · Dasturlash nima?

- **Vaqt:** 0:10–0:13 (3 daqiqa)
- **Bekat:** hali yo'q (ustoz panelida: «Dasturlash nima?»)
- **Sahna:** hovli, Coddy yulduzda turibdi (hukning oxiri). To'rt qadam — har qadamda bitta gap va bitta jonli rasm. Savol yo'q (F-1115-03).
- **Qadamlar:**
  1. «Kompyuter o'zi hech narsa qilmaydi». Coddy mudrab turibdi; ustiga `move right` bloki tushadi — Coddy uyg'onib bir qadam yuradi. Ostida: «U faqat buyruqni bajaradi».
  2. «Kompyuterga buyruq berish — dasturlash». Yangi so'z ajratilgan. Ostida: «Buyruq beradigan odam — dasturchi».
  3. «Dasturchilar buyruqni yozadi». Tepada haqiqiy kodning ikki qatori (o'qish shart emas, faqat ko'rinish): `coddy.move("right")`; ostida «=» va o'sha buyruqlar — ikkita ko'k blok, mozaikadek ulangan (F-1116-13: ustma-ust, ustunning to'liq kengligida). Ostida: «Biz hozircha yozmaymiz — bloklarni ulaymiz».
  4. «Bu — blokli dasturlash». Uchta blok yuqoridan tushib, mozaikadek ulanadi («chiq-chiq-chiq»), keyin bajariladi: Coddy uch qadam yuradi. Ostida: «Scratch'da millionlab bolalar o'yinni shunday yasaydi. Siz ham».
- **Tayanch gaplar:**
  1. «Kompyuterga buyruq berish — dasturlash. Buyruq beradigan odam — dasturchi.»
  2. «Dasturchilar buyruqni yozadi. Biz hozircha bloklarni ulaymiz — bu blokli dasturlash.»
- **O'z so'zi bilan:** Scratch haqida bir gap («dunyoda bolalar o'yinni shunday yasaydi»); kursning oxirida bolalar haqiqiy kod ham yozishini aytadi — «avval bloklar, keyin kod».
- **Ustoz satri:** Dasturlash — buyruq berish · Blokli dasturlash — bloklarni ulash
- **Parta:** «Katta ekranga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.
- **Rasm:** `sahna=ochiq; zona=hovli; aktyor=coddy:turadi:oddiy:30; blok=yur,yur,yur; us=Dasturlash nima?; parta=kut`

## 4 · Reja va qahramon

- **Vaqt:** 0:13–0:16 (3 daqiqa)
- **Bekat:** hali yo'q (ustoz panelida: «Reja»)
- **Sahna:** uch qadam.
- **Qadamlar:**
  1. Reja — yo'l xaritasi (F-1116-09). Sarlavha — savol, bir qatorda: «Bugun nima qilamiz?» (F-1116-03). Coddy start zonachasida; uchta bekat birin-ketin yonadi: 1 · Yurgizamiz (ko'k) — 2 · Gapirtiramiz (binafsha) — 3 · O'z sahnangiz (oltin); orasida sakrash yoylari; 1-bekat miltillab qoladi. O'ngda tepada: «Dars oxirida» — o'z sahnangizning kichik jonli rasmi.
  2. Dars oxiridagi natija. Butun ekranda tayyor sahna o'zi o'ynab turadi: kosmosda yulduz-qahramon yuradi, «Salom! Men Zippiman» deydi, sakraydi, yana yuradi, «Bu — mening sahnam!» deydi. Sarlavha: «Dars oxirida: o'z sahnangiz».
  3. Sinf taxtasi. Birinchi o'rinda Coddy, ostida «Ustoz». Bola tanlagan sari uning qahramoni paydo bo'ladi — ismsiz. Tepada son: «9 / 14».
- **Tayanch gaplar:**
  1. «Bugun yo'limizda uchta bekat bor: yurgizamiz, gapirtiramiz, o'z sahnangizni yasaysiz.»
  2. «Dars oxirida har biringizda mana shunday sahna bo'ladi.»
  3. «Coddy — meniki. Har biringizga o'z qahramoningiz kerak. Bittasini tanlang.»
- **O'z so'zi bilan:** rangi bilan ismi keyin qo'yilishini aytadi; taxta to'lishini kutadi.
- **Ustoz satri:** Bugun nima qilamiz: uchta bekat · Dars oxirida — mana shunday sahna · Tanladi: 9 / 14
- **Parta:** 1- va 2-qadamda «Katta ekranga qarang». 3-qadamda «Qahramoningizni tanlang» — beshta qahramon; bittasi bosilishi bilan: «Katta ekranga qarang», ostida «Tayyor!».
- **Bola qiladi:** rejani va natijani ko'radi; bitta qahramonni bosadi.
- **Tekshiruv:** qahramon tanlandi.
- **Rasm:** `sahna=taxta; ismsiz=1; us=Tanladi: 9 / 14; parta=tanlov`

## 5 · Blok studiya: ranglar va birinchi dastur

- **Vaqt:** 0:16–0:21 (5 daqiqa)
- **Bekat:** 1 · Yurgizamiz
- **Sahna:** Blok studiya (Scratch tartibida): chapda rang doirachalari, yonida bloklar, o'rtada dastur maydoni, o'ngda sahna. Coddy chapda, yulduz uch qadam narida; yerda uchta zonacha. Studiya bilan tanishuv darsda shu yerda bir marta.
- **Qadamlar:**
  1. Studiya qismlari. Ekran xiralashadi, navbatdagi joy hoshiya bilan yonadi, yonida bir qatorli ishora: rang doirachalari («Ranglar — blok oilalari») → bloklar («Bloklar — buyruqlar») → dastur maydoni («Bloklarni shu yerga ulaymiz») → sahna («Natija shu yerda»).
  2. Ranglar. Ustoz ko'k doirachani bosadi: «Harakat» — `move right`, `move left`, `jump` chiqadi. Binafsha doirachani bosadi: «Gap» — `say "Salom!"` chiqadi. Sarlavha: «Har rang — bitta oila». Shu paytda bolalar noutbukida ham ikkala doirachani o'zi bosib chiqadi (F-1115-02); proyektorda: «Ikkala rangni bosdi: 11 / 14».
  3. Birinchi ulash. Ustoz `move right` blokni dastur maydoniga sudraydi — u «chiq» etib ulanadi; «Ishga tushir» — blok yonadi, Coddy bir qadam yuradi: «Bitta blok — bitta qadam». Coddy yulduzga yetmaydi — yetkazish bolalarning ishi.
  4. Sinf doskasi: «Sizning navbatingiz!»; topshiriq rasmi (qahramon → uchta zonacha → yulduz) va «Qahramoningizni yulduzga olib boring»; pastda «Yulduzga yetdi: 9 / 14» va sinfning yulduzchalari.
- **Tayanch gaplar:**
  1. «Har rang — bitta oila. Ko'k — harakat, binafsha — gap. Ikkalasini bosib ko'ring.»
  2. «Blokni dasturga ulayman. Endi «Ishga tushir». Bitta blok — bitta qadam.»
  3. «Endi o'zingiz: qahramoningizni yulduzga olib boring.»
- **O'z so'zi bilan:** ko'k oiladagi bloklarni o'zbekcha bir marta aytib o'tadi (move right — o'ngga yur, move left — chapga yur, jump — sakra); bugun ko'pi bilan ko'k bilan ishlashini aytadi; blokni sudrab ham, bosib ham qo'shsa bo'lishini ko'rsatadi; hamma yetkazguncha kutadi; javobni aytmaydi — «yulduzgacha necha qadam?» deb so'raydi.
- **Ustoz satri:** Yonib turgan joyni ko'rsating · Ikkala rangni bosdi: 11 / 14 · Blokni ulang va ishga tushiring · Yulduzga yetdi: 11 / 14 · yordam kerak: 1
- **Parta:** 1-qadamda «Katta ekranga qarang». 2-qadamda studiya ochiladi, ishora: «Rangli doirachalarni bosing» — ko'k va binafsha doirachalar miltillaydi; bola ikkalasini bosgach, ishora o'chadi va «Katta ekranga qarang» kichik yozuvi chiqadi (studiya yopilmaydi). 4-qadamda Blok studiya, sahnada bolaning o'z qahramoni; yerda uchta zonacha, uchinchisida yulduz. Topshiriq satri: «Qahramoningizni yulduzga olib boring».
- **Bola qiladi:** ikkala rang doirachasini bosadi; keyin qadamlarni sanaydi, uchta `move right` ulaydi, «Ishga tushir»ni bosadi.
- **Tekshiruv:** 2-qadamda — ikkala doiracha bosildi. 4-qadamda — dastur tugaganda qahramon yulduzda turibdi. Shunda: «Yetib bordi! Bu — sizning birinchi dasturingiz.» Dars boshidagi savol shu yerda yopiladi: sinf Coddy'ni baqirib ham, sudrab ham yulduzga olib bora olmadi — bola o'z qahramonini buyruq bilan olib bordi.
- **Xatoda:** blok qo'ymasdan ishga tushirsa — Bo'shvoy: «Bu yerda hech narsa yo'q-ku…»; yetmasa — Kamvoy «Oz qoldi!», o'tib ketsa — Ortiqvoy «Ko'payib ketdi!» (maslahatlari 7-sahnadagidek); uch urinishdan keyin «Yechimni ko'rsat».
- **Rasm:** `sahna=studiya; bekat=1; dastur=yur*; aktyor=coddy:turadi:xursand:30:yuradi; sinf=1; parta=studiya:momiq:yur,yur,yur*:yulduz`

## 6 · Ko'ramiz: Coddy bloklarni sanaydi

- **Vaqt:** 0:21–0:24 (3 daqiqa)
- **Bekat:** 1 · Yurgizamiz
- **Sahna:** Blok studiya. Yerda to'rtta zonacha: 1, 2, 3, 4; yulduz uchinchisida. Dasturda to'rtta `move right`. Savol yo'q — ustoz ko'rsatadi (F-1115-03; v9 dagi «Coddy qayerda to'xtaydi?» taxmini olib tashlandi).
- **Qadamlar:**
  1. Ishga tushirish. Sarlavha: «Yulduz 3 qadam narida. Dasturda 4 ta blok». Ustoz «Ishga tushir»ni bosadi: Coddy har blokda bir qadam yuradi, har blok yonadi va Coddy ustida son chiqadi — 1, 2, 3, 4. Yulduz oldidan o'tayotganda yulduz qichqiradi: «To'xta! Men shu yerdaman!» — Coddy baribir o'tib ketadi va 4-zonachada to'xtaydi.
  2. Tushuntirish. Sarlavha: «Coddy yulduzni ko'rmaydi» — ostida «U bloklarni sanaydi: 4 ta blok — 4 qadam». Coddy dasturni sekin qayta bajaradi, har blok yonadi va sanaladi. Ortiqvoy chetdan mo'ralaydi: «Ko'payib ketdi!» — xato bo'lsa shunaqa mehmonlar kelishi shu yerda ko'rinadi.
  3. Tuzatish. Ustoz oxirgi blokni dasturdan chetga sudrab chiqaradi (yoki bosib olib tashlaydi) va qayta ishga tushiradi: Coddy yulduzda to'xtaydi. Sarlavha: «3 ta blok — 3 qadam. Yulduzda!».
- **Tayanch gaplar:**
  1. «Qarang: yulduz uch qadam narida, men esa to'rtta blok qo'ydim.»
  2. «Coddy yulduzni ko'rmaydi. U faqat bloklarni sanaydi.»
  3. «Bitta blokni olib tashladim. Endi yulduzda to'xtadi.»
- **O'z so'zi bilan:** Ortiqvoyni tanishtiradi; «kompyuter faqat dasturda borini bajaradi» degan gapni ikki-uch bolaga qaytarib aytdiradi.
- **Ustoz satri:** Ishga tushiring · Tushuntiring: Coddy bloklarni sanaydi · Bitta blokni olib tashlang
- **Parta:** «Katta ekranga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q (bola buni 7-sahnaning 1-pog'onasida o'zi qo'llaydi).
- **Rasm:** `sahna=studiya; bekat=1; dastur=yur,yur,yur,yur; aktyor=coddy:turadi:oddiy:14; nuqta=4; yulduz=62; us=Coddy bloklarni sanaydi; parta=kut`

## 7 · O'zingiz: yulduzga yetkazing

- **Vaqt:** 0:24–0:31 (7 daqiqa)
- **Bekat:** 1 · Yurgizamiz
- **Sahna:** sinf doskasi (F-1116-04). Chapda: sarlavha «Endi o'zingiz!», Coddy: «Qiynalsangiz — "Maslahat"ni bosing.», pastda «Uch pog'onani tugatdi: 6 / 14» — katta son va 14 ta katta yulduzcha ikki qatorda, ostida «Har yulduz — uch pog'onani tugatgan bitta bola» (F-1116-13). O'ngda, hovlida — pog'ona zinapoyasi: 1, 2, 3 va ★ kartalari zinadek ko'tariladi, ostida yerda to'rtta zonacha sakrash yoylari bilan. Kartalarda: «Yulduzda to'xta» (rasm: qahramon yulduzdan o'tib ketadi) · «Yulduz orqada» (yulduz chapda) · «`move left` ham» (o'ngga o'tib, chapga qaytadi) · «Roppa-rosa 9 blok» (6 + 3); har birida hozir shu pog'onada nechta bola.
- **Tayanch gaplar:**
  1. «Endi o'zingiz. Uch pog'ona bor. Kim nechanchisigacha boradi?»
  2. (oxirida) «To'xtadik. Qo'llar klaviaturadan.»
- **O'z so'zi bilan:** 2-pog'onada yangi blok chiqishini aytadi: `move left` — chapga yur, u ham ko'k, demak harakat; sinfni aylanadi; sariq hoshiya yongan noutbukka boradi. Javobni aytmaydi — «Yulduzgacha necha qadam?» deb so'raydi.
- **Ustoz satri:** Tugatdi: 6 / 14 · sinfni aylaning · yordam kerak: 1
- **Parta:** Blok studiya, uch pog'ona ketma-ket. Har pog'onada yerda zonachalar — yulduz tomonga; yulduz turgan zonacha oltin.
  1-pog'ona. Dasturda tayyor oltita `move right`, yulduz to'rtinchi zonachada. Topshiriq satri: «Yulduzda to'xtasin — dasturni tuzating». Bola avval ishga tushiradi (qahramon yulduzdan o'tib ketadi), keyin ortiqcha bloklarni olib tashlaydi — 6-sahnada ustoz ko'rsatganini o'zi qo'llaydi.
  2-pog'ona. Yulduz qahramonning orqasida, ikki qadam chapda; ko'k oilaga `move left` qo'shiladi (doiracha bir marta miltillaydi). Topshiriq satri: «Yulduz orqada qoldi!»
  3-pog'ona. Yulduz uch qadam narida. Topshiriq satri: «Yulduzda to'xtang. Dasturda `move left` ham bo'lsin».
  Yulduzcha topshiriq (xohlaganlarga). 3-pog'onaning o'zi, lekin: «Roppa-rosa 9 ta blok bilan».
  Topshiriq bajarilgach, asosiy tugma «Keyingi pog'ona»ga aylanadi, yonida kichik «qayta ko'rish». Yulduzchadan keyin — «Erkin o'yin».
- **Bola qiladi:** qadamlarni sanaydi, bloklarni ulaydi, ishga tushiradi, blok qo'shadi yoki olib tashlaydi; keyingi pog'onaga o'zi o'tadi.
- **Tekshiruv:** dastur tugaganda qahramon yulduzda turibdi. 3-pog'onada qo'shimcha: dasturda kamida bitta `move left` bor. Yulduzchada: bloklar soni aynan 9 (6 ta `move right` va 3 ta `move left`). Shunda: «Yetib bordi! 4 ta blok.» (son dasturga qarab); yulduzchada: «9 ta blok! O'ngga 6, chapga 3.»
- **Xatoda:**
  Yulduzga yetmadi — Kamvoy: «Oz qoldi!» Maslahat: 1) «Yulduzgacha necha qadam? Qadamlarni sanang.» 2) «Dasturda 3 ta blok bor. Yulduzgacha 4 qadam.» 3) «Yana bitta `move right` qo'shing.» (yulduz orqada bo'lsa — «Yana bitta `move left` qo'shing.»)
  Yulduzdan o'tib ketdi — Ortiqvoy: «Ko'payib ketdi!» Maslahat: 1) «Qahramon qayerda to'xtashi kerak edi?» 2) «Dasturda 6 ta blok bor. Yulduzgacha 4 qadam.» 3) «Bitta blokni dasturdan chiqaring.»
  2-pog'onada qahramon o'ngga ketdi — Kamvoy: «Yulduz boshqa tomonda!» Maslahat: «`move left` blokini ishlating.»
  Dastur bo'sh — Bo'shvoy: «Bu yerda hech narsa yo'q-ku…»
  3-pog'onada `move left` yo'q — Kamvoy: «`move left` qani?» Maslahat: 1) «Oldinga ortiqroq yurib, keyin qaytsa bo'ladimi?» 2) «4 qadam o'ngga yursa, yulduzdan necha qadam o'tadi?» 3) «4 ta `move right` va 1 ta `move left` qo'ying.»
- **Rasm:** `sahna=doska; bekat=1; parta=studiya:momiq:yur,yur,yur,yur,yur,yur:yulduz`

## 8 · Xulosa: blok va dastur

- **Vaqt:** 0:31–0:33 (2 daqiqa)
- **Bekat:** 1 · Yurgizamiz (bajarilgani 10-sahna boshidagi xaritada ko'rinadi)
- **Sahna:** ikki qadam. Har so'z jonli namoyish bilan. Ikki so'zning ta'rifi darsda shu yerda bir marta aytiladi.
- **Qadamlar:**
  1. «Blok — bitta buyruq». Ekranda bitta katta `move right` bloki; u yonadi — Coddy bir qadam yuradi. To'xtovsiz takrorlanadi.
  2. «Dastur — buyruqlar ro'yxati». Uchta katta blok ustma-ust ulangan; birin-ketin yonadi, har birida Coddy bir qadam yuradi.
- **Tayanch gaplar:**
  1. «Blok — bitta buyruq.»
  2. «Dastur — buyruqlar ro'yxati. Siz hozir dastur tuzdingiz!»
- **O'z so'zi bilan:** «u yulduzni ko'rmaydi» degan gapni bolalardan ayttiradi; 7-sahnadan bitta misol so'raydi («kim yulduzchani yechdi? Dasturida nechta blok bor edi?»).
- **Ustoz satri:** Blok — bitta buyruq · Dastur — buyruqlar ro'yxati
- **Parta:** «Katta ekranga qarang».
- **Bola qiladi:** qaraydi; o'z dasturidan misol aytadi.
- **Tekshiruv:** yo'q.
- **Rasm:** `sahna=namoyish; bekat=1; dastur=yur,yur,yur; aktyor=coddy:turadi:oddiy:14; parta=kut`

## 9 · Harakatli o'yin: «Men robotman»

- **Vaqt:** 0:33–0:37 (4 daqiqa)
- **Bekat:** oraliq (1-bekat tugadi, 2-si hali ochilmagan)
- **Sahna:** sarlavha «O'yin: Men robotman». Coddy: «Menga faqat shu buyruqlarni bering!». Uchta ko'k buyruq kartasi — har birida Coddy o'sha harakatni to'xtovsiz qiladi: `move right` · `move left` · `jump`. To'rtinchi karta: chizib tashlangan «run!», «fly!» — «Boshqa buyruq yo'q».
- **Tayanch gaplar:**
  1. «Turamiz! Endi men robotman. Menga faqat shu uchta buyruqni inglizcha ayting.»
  2. «Bunday blok yo'q. Bor buyruqni ayting.»
  3. «Robot faqat bor buyruqni bajaradi. Ortiqcha ham emas, kam ham emas.»
- **O'z so'zi bilan:** «Meni doskagacha olib boring» deydi; har buyruqni aynan bajaradi («move right» — bir qadam, «jump» — bir marta); «run», «besh marta yur» desa, 2-gapni aytadi. Keyin bir bolani robot qiladi.
- **Ustoz satri:** O'yin: siz — robot, bolalar buyruq beradi
- **Parta:** «Hozir o'yin», ostida «Noutbukka tegmang»; bolaning qahramoni mudrab turibdi.
- **Bola qiladi:** o'rnidan turadi, inglizcha buyruq beradi; bir bola robot bo'ladi.
- **Tekshiruv:** yo'q.
- **Rasm:** `sahna=ochiq; zona=hovli; aktyor=coddy:tushuntiradi:oddiy:16; blok=yur,orqaga,sakra; us=O'yin: men robotman; parta=yopiq`

## 10 · Ko'ramiz: `say` bloki

- **Vaqt:** 0:37–0:40 (3 daqiqa)
- **Bekat:** 2 · Gapirtiramiz
- **Sahna:** Blok studiya. Binafsha oila — «Gap». Savol yo'q — ustoz ko'rsatadi (F-1115-03; v9 dagi «Coddy nima qiladi?» taxmini olib tashlandi).
- **Qadamlar:**
  1. Xarita qaytadi. Sarlavha: «Endi gapirtiramiz». Coddy 1-bekatga sakrab o'tadi, o'tilgan yoy oltin bo'ladi, «Yurgizamiz» yorlig'ida ✓; navbatdagi — Gapirtiramiz — miltillaydi.
  2. Yangi oila. Ustoz binafsha doirachani bosadi — `say "Salom!"` chiqadi. Blokni dasturga ulab ishga tushiradi: Coddy «Salom!» deydi (ovoz bilan). Sarlavha: «`say` — ichidagi yozuvni aytadi».
  3. Yozuv emas, blok hal qiladi. Ustoz blok ichidagi yozuvni «2 qadam yur»ga almashtiradi va ishga tushiradi: Coddy joyidan qimirlamaydi va «2 qadam yur» deb aytadi. Sarlavha: «Yurmadi — faqat aytdi». Ostida: «Nima qilishini blok hal qiladi, yozuv emas».
- **Tayanch gaplar:**
  1. «Yangi oila — binafsha, gap. Blok — say, ya'ni ayt. Ichidagi yozuvni Coddy aytadi.»
  2. «Ichiga "2 qadam yur" deb yozdim. Qarang: yurmadi — faqat aytdi. Nima qilishini blok hal qiladi.»
- **O'z so'zi bilan:** «Coddy yuradi, lekin jim — gapirtiramizmi?» deb boshlaydi; yurish uchun qaysi rang kerakligini bolalardan ayttiradi («ko'k!»).
- **Ustoz qiladi:** binafsha doirachani bosadi; blokni ulab ishga tushiradi; yozuvni almashtirib, yana ishga tushiradi.
- **Ustoz satri:** 2-bekat: gapirtiramiz · Binafsha rangni bosing, blokni ulang, ishga tushiring · Yozuvni «2 qadam yur»ga almashtiring · Yozuv emas, blok hal qiladi
- **Parta:** «Katta ekranga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q (bola buni 12-sahnada o'zi qo'llaydi).
- **Rasm:** `sahna=studiya; bekat=2; dastur=de:2 qadam yur*; aktyor=coddy:turadi:oddiy:14:gapiradi; pufak=2 qadam yur; us=Yozuv emas, blok hal qiladi; parta=kut`

## 11 · Ism va rang

- **Vaqt:** 0:40–0:43 (3 daqiqa)
- **Bekat:** 2 · Gapirtiramiz
- **Sahna:** sinf taxtasi: qahramonlar birin-ketin rangga kiradi. Ismlar ko'rinmaydi. Tepada son.
- **Tayanch gaplar:**
  1. «Qahramoningiz gapirishi uchun unga ism kerak.»
  2. «Ism qo'ying va rangini tanlang.»
- **O'z so'zi bilan:** yozishga qiynalgan bolaga «Tasodifiy ism» tugmasini ko'rsatadi.
- **Ustoz satri:** Tayyor: 10 / 14
- **Parta:** bitta ekran: tepada bolaning qahramoni; «Ism qo'ying» — yozish maydoni (12 harfgacha) va «Tasodifiy ism» tugmasi; ostida sakkizta rang. Pastki tasmada «Avval ism qo'ying» (ism yozilgach — «Tayyor bo'lsa — tugmani bosing») va o'ngda asosiy tugma: «Tayyor!». Ism faqat shu noutbukda ko'rinadi.
- **Bola qiladi:** ism yozadi yoki tasodifiysini oladi, rang tanlaydi.
- **Tekshiruv:** ism bo'sh emas.
- **Rasm:** `sahna=taxta; ismsiz=1; rangli=1; bekat=2; us=Tayyor: 10 / 14; parta=ism`

## 12 · O'zingiz: gapirtiramiz

- **Vaqt:** 0:43–0:52 (9 daqiqa)
- **Bekat:** 2 · Gapirtiramiz (bajarilgani 13-sahna boshidagi xaritada ko'rinadi)
- **Sahna:** avval ustozning ish joyi (bitta namuna), keyin sinf doskasi.
- **Qadamlar:**
  1. Ustoz namunasi. Blok studiyada tayyor `say "Salom!"` bloki; ishora: «Yozuvni bosing va o'zgartiring» — «Masalan: "Men Coddyman!"». Ustoz yozuvni bosadi, «Men Coddyman!» deb yozadi va ishga tushiradi: Coddy shuni aytadi. Shundan keyin «Keyingi» yonadi.
  2. Sinf doskasi: «O'zingiz: gapirtiramiz», to'rtta pog'ona kartasi va har birida nechta bola.
  3. Doska sarlavhasi almashadi: «Do'stingizga ko'rsating: qahramoningiz nima deydi?».
- **Tayanch gaplar:**
  1. «Yozuvni bosaman va o'zgartiraman: "Men Coddyman!" Endi o'zingiz.»
  2. (oxirida) «Yoningizdagi do'stingizga ko'rsating: qahramoningiz nima deydi?»
- **O'z so'zi bilan:** sinfni aylanadi; oxirida bolalar juft bo'lib bir-biriga ko'rsatadi.
- **Ustoz qiladi:** namunada yozuvni o'zi o'zgartiradi va ishga tushiradi.
- **Ustoz satri:** Yozuvni bosing, o'zgartiring, «Ishga tushir» · Tugatdi: 7 / 14 · sinfni aylaning · yordam kerak: 0 · Juft bo'lib ko'rsatishsin
- **Parta:** 1-qadamda «Katta ekranga qarang». Keyin Blok studiya, uch pog'ona ketma-ket. Ochiq oilalar: ko'k (`move right`, `move left`) va binafsha (`say "Salom!"`). Topshiriq bajarilgach — «Keyingi pog'ona».
  1-pog'ona. Topshiriq satri: «Qahramon ismini aytsin». Blok ichidagi yozuv bosilganda yozish maydoni ochiladi (30 harfgacha).
  2-pog'ona. Yulduz uch qadam narida, yerda uchta zonacha. Topshiriq satri: «Yulduzgacha borsin va gapirsin».
  3-pog'ona. Topshiriq satri: «Ikki xil gap aytsin, orasida yursin».
  Yulduzcha topshiriq. Topshiriq satri: «O'zi haqida uchta gap aytsin».
- **Bola qiladi:** blok ulaydi, yozuvni o'zgartiradi, yurish va gapirishni birga ishlatadi; oxirida yonidagi do'stiga ko'rsatadi.
- **Tekshiruv:** 1) yozuv «Salom!»dan boshqa va bo'sh emas, qahramon uni aytdi. 2) dastur tugaganda qahramon yulduzda turibdi va kamida bir marta gapirdi. 3) kamida ikkita har xil gap va ular orasida kamida bitta qadam. Yulduzcha: kamida uchta har xil gap.
- **Xatoda:**
  Yozuv bo'sh — Bo'shvoy: «Hech narsa demadi…» Maslahat: «Blok ichiga so'z yozing.»
  Gap yo'q — Kamvoy: «Yurdi, lekin jim…» Maslahat: «Binafsha `say` blokini qo'shing.»
  Yulduzga yetmadi yoki o'tib ketdi — Kamvoy yoki Ortiqvoy, 7-sahnadagi gaplari bilan.
  3-pog'onada gaplar bir xil — Kamvoy: «Ikkalasi bir xil-ku!» Maslahat: «Ikkinchi blokdagi yozuvni o'zgartiring.»
- **Rasm:** `sahna=studiya; bekat=2; dastur=de:Men Coddyman!*; aktyor=coddy:salom:xursand:30:gapiradi; pufak=Men Coddyman!; sinf=1; parta=studiya:momiq:yur,yur,yur,de*:pufak:Men Zippiman!`

## 13 · Ko'ramiz: ustozning sahnasi

- **Vaqt:** 0:52–0:54 (2 daqiqa)
- **Bekat:** 3 · O'z sahnangiz
- **Qadamlar:**
  1. Xarita qaytadi. Sarlavha: «Endi — o'z sahnangiz». Coddy 2-bekatga sakrab o'tadi; ikki yoy oltin, ikki yorliqda ✓; uchinchi bekat miltillaydi.
  2. Ustozning sahnasi (pastda).
- **Sahna:** avval uchta joy rasmi: Hovli, Kosmos, Suv osti. Ustoz Kosmosni tanlaydi. Ko'k oilada yangi blok ochiladi: `jump`. Coddy kosmosda yuradi, gapiradi, sakraydi.
- **Tayanch gaplar:**
  1. «Oxirgi bekat — eng qiziqi: har kim o'z sahnasini yasaydi.»
  2. «Yangi blok — jump, ya'ni sakra. U ham ko'k — demak, harakat.»
  3. «Meniki shunaqa chiqdi. Siznikisi boshqacha bo'lsin.»
- **O'z so'zi bilan:** joy tanlaganini aytib o'tadi.
- **Ustoz qiladi:** joy tanlaydi; dastur yig'adi: `move right`, `say "Men Coddyman!"`, `jump`, `say "Bu — mening kosmosim"`; ishga tushiradi; keyin dasturni tozalaydi.
- **Ustoz satri:** 3-bekat: o'z sahnangiz · Joy → 4 ta blok → ishga tushiring
- **Parta:** «Katta ekranga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.
- **Rasm:** `sahna=studiya; zona=kosmos; bekat=3; dastur=yur,de:Men Coddyman!,sakra*,de:Mening kosmosim; aktyor=coddy:turadi:xursand:40:sakraydi; us=Kosmos → 4 ta blok → ishga tushiring; parta=kut`

## 14 · O'zingiz: o'z sahnangiz

- **Vaqt:** 0:54–1:01 (7 daqiqa; zaxira vaqt ortib qolsa, shu sahnaga qo'shiladi)
- **Bekat:** 3 · O'z sahnangiz
- **Sahna:** sinf doskasi: «O'z sahnangizni yasang»; chapda uchta shart, har biri belgisi bilan: «Joy tanlang» · «Kamida 4 ta blok» · «O'zingiz yozgan gap»; o'ngda uchta joy rasmi, ostida o'sha joyni tanlaganlarning qahramonlari (ismsiz) va soni — bu tanlov, yutuq emas; pastda «Sahnasi tayyor: 8 / 14» va yulduzchalar, «Istaganingizni yasang — bu yerda xato yo'q».
- **Tayanch gaplar:**
  1. «Joy tanlang va o'z sahnangizni yasang. Uchta shart ekranda yozilgan.»
  2. (oxirida) «Oxirgi marta ishga tushirib ko'ring.»
- **O'z so'zi bilan:** sinfni aylanadi; yaxshi topilmani ovoz chiqarib maqtaydi («Qarang, uning qahramoni sakrab turib gapiryapti»).
- **Ustoz satri:** Sahnasi tayyor: 8 / 14 · yordam kerak: 1
- **Parta:** 1) «Joy tanlang» — uchta rasm: Hovli, Kosmos, Suv osti. 2) Blok studiya, ikkala oila va to'rttala blok ochiq. Topshiriq satri: «O'z sahnangizni yasang». Yonida uch shart, bajarilgani yashil belgi oladi: «Joy tanlandi» · «Kamida 4 ta blok» · «O'zingiz yozgan gap» (o'zgartirilmagan «Salom!» hisobga olinmaydi). Uchalasi bajarilgach va dastur ishga tushgach: «Sahna tayyor!».
- **Bola qiladi:** joy tanlaydi, dastur yig'adi, ishga tushirib ko'radi, o'zgartiradi.
- **Tekshiruv:** uch shart bajarildi va dastur kamida bir marta ishga tushdi. Xato yo'q: har bolaning sahnasi boshqacha.
- **Rasm:** `sahna=studiya; zona=hovli; bekat=3; dastur=yur,yur,de:Salom!; aktyor=coddy:turadi:oddiy:30; sinf=1; parta=joy`

## 15 · Ko'rsatish: galereya

- **Vaqt:** 1:01–1:06 (5 daqiqa)
- **Bekat:** 3 · O'z sahnangiz (bajarilgani 16-sahna boshidagi xaritada ko'rinadi)
- **Sahna:** Coddy quvonib turibdi, sarlavha: «Galereya», ostida «Do'stlaringizning sahnasini ko'ring». Proyektorda bolalarning ishi ko'rsatilmaydi.
- **Tayanch gaplar:**
  1. «Endi turing va ikki do'stingizning sahnasini ko'ring.»
  2. «Kim sinfga ko'rsatadi?»
  3. (ko'rsatgan bolaga) «Nechta blok ishlatdingiz? Qaysi blok sakratdi?»
- **O'z so'zi bilan:** bolalar sinfda aylanadi; keyin ikki-uch bola noutbukini ko'tarib sinfga ko'rsatadi; har biriga bittadan savol va qarsak.
- **Ustoz satri:** Bolalar aylanadi, keyin 2–3 bola ko'rsatadi
- **Parta:** bolaning sahnasi butun ekranda o'zi takror-takror o'ynaydi (tugma bosish shart emas); qahramon yirik, bloklar ko'rinmaydi, pastda bolaning ismi va qahramonining ismi.
- **Bola qiladi:** do'stlarining sahnasini ko'radi; xohlasa sinfga ko'rsatadi.
- **Tekshiruv:** yo'q.
- **Keyinroq:** serverga qo'shimcha qilinsa, ustoz tanlagan sahna proyektorda ham ko'rsatiladi (faqat ustoz tanlagani — bola yozgan so'z o'zi chiqib ketmaydi).
- **Rasm:** `sahna=ochiq; zona=hovli; bekat=3; aktyor=coddy:quvonadi:xursand:36; nom=Galereya; us=Galereya; parta=toliq:suv:jele:Men Zippiman!`

## 16 · Yakun

- **Vaqt:** 1:06–1:10 (4 daqiqa)
- **Bekat:** uchalasi bajarilgan
- **Sahna:** avval xarita — yo'l oxiri, bugungi so'zlar bilan birga (F-1116-10); keyin ekran qorayadi: Coddy labirint ichida, yuzida hayrat. Proyektorda sinf jami sonlar yo'q (F-1115-08): har bolaning ma'lumoti faqat o'z noutbukida.
- **Qadamlar:**
  1. Yo'l oxiri. Xarita qaytadi: Coddy oxirgi bekatga sakrab o'tadi, uchala yoy oltin, uchala yorliqda ✓, Coddy quvonadi, konfeti. Sarlavha: «Siz dastur tuzdingiz!»; ostida bugungi uchta so'z — «dasturlash» · «blok» · «dastur», har biri belgisi bilan (bekatlar rangi ikki oilani ham eslatadi: ko'k — harakat, binafsha — gap). O'ngda tepada: «Keyingi dars: 2 · Labirint» (kichik jonli labirint). Shu paytda bola noutbukida uning o'z ma'lumoti ochiladi.
  2. Keyingi darsning savoli: Coddy labirint ichida (devorli haqiqiy labirint, chiqish o'ng tepada, yulduz chiqishda).
- **Tayanch gaplar:**
  1. «Uchala bekatdan o'tdik: yurgizdik, gapirtirdik, sahna yasadik.»
  2. «Noutbukingizga qarang: bugun qaysi blokni necha marta ishlatdingiz?»
  3. «Kompyuter faqat dasturni bajaradi. Dasturni esa siz tuzasiz.»
  4. «Keyingi darsda Coddy labirintga kirib qoladi. Chiqarib olasizmi?»
- **O'z so'zi bilan:** uchala bekatni bolalardan sanatadi; ikki-uch boladan «qaysi blokni eng ko'p ishlatdingiz?» deb so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Ustoz satri:** Uchala bekatdan o'tdik — bugungi so'zlar · Keyingi dars: labirint
- **Parta:** 1-qadamdan bolaning o'z ma'lumoti (F-1115-08): sarlavha «Bugun uddaladingiz!», ostida o'z dasturlaridan yig'ilgan sonlar — blok ko'rinishida, rangi bilan: `move right × 14` · `move left × 3` · `jump × 2` · `say × 5` (ishlatilmagan blok ko'rsatilmaydi); o'z sahnasini yasagan bo'lsa — yashil belgi bilan «o'z sahnasini yasadi»; ostida «Zippi sizni keyingi darsda kutadi». «Sahnangiz saqlandi» deyilmaydi: saqlanadigan joy («Uy») hali yo'q.
- **Bola qiladi:** o'z ma'lumotini ko'radi; xohlasa ustozga aytadi.
- **Tekshiruv:** dars tugadi deb belgilanadi: 5-sahna, 7-sahnaning 1-pog'onasi va 12-sahnaning 1-pog'onasi bajarilgan bo'lsa — «personaj buyruqni bajardi».
- **Rasm:** `sahna=natija; us=Bugungi so'zlar; parta=yakun`

---

## «Uy» ko'rinishi (darsdan keyin)

- Ustoz ko'rsatgan sahnalar (2, 3, 5-ning tanishuvi, 6, 8, 10, 12-ning namunasi, 13) o'zi yuradi: Coddy ko'rsatadi, tayanch gaplar pastda yozuv bo'lib chiqadi, bola «Davom etish»ni bosadi.
- Huk savoli (2) bolaga beriladi; javobdan keyin Coddy natijani ko'rsatadi (baqirish va sudrashni bola o'zi sinab ko'radi).
- «O'zingiz» topshiriqlari (5, 7, 12, 14) — bolaning o'z qahramoni bilan, sinfdagidek.
- 1, 4, 11 — bola darsda qatnashmagan bo'lsa ochiladi (qahramon, ism, rang); qatnashgan bo'lsa o'tkazib yuboriladi.
- 9 o'rniga bitta taklif: «Uyda kimnidir robot qiling: uni inglizcha uchta buyruq bilan eshikkacha olib boring».
- 15 yo'q. 16 — bolaning o'z ma'lumoti.

## Ochiq savollar va tekshirilmagan joylar

1. **Vaqtlar taxminiy.** Sinfda o'lchanmagan. 70 daqiqa — reja; birinchi kuni kirish 5 daqiqadan uzoq cho'zilishi mumkin, shuning uchun zaxira qoldirilgan. Ekranda vaqt yo'q — ustoz o'zi boshqaradi.
2. **Bolaning birinchi dasturi 19-daqiqada** (v9 da 14-daqiqada edi): kirish kengaydi va «Dasturlash nima?» qo'shildi. Bu — tushuntirish uchun to'langan narx; bola undan oldin hukda ikki marta qatnashadi va 5-sahnada rang doirachalarini o'zi bosadi.
3. **9 yoshli va 13 yoshli bir sinfda.** Pog'onalar shu farq uchun qo'yildi, lekin 3-pog'ona va yulduzcha 12–13 yoshliga yetarlimi — bolalarda sinalmagan.
4. **Inglizcha blok nomlari (F-1115-07)** 9 yoshli, ingliz tilini bilmaydigan bolaga qanchalik oson — sinalmagan. Yumshatish: rang, belgi va ustozning bir martalik o'zbekcha izohi; 9-sahnadagi o'yinda bolalar nomlarni ovoz chiqarib aytadi.
5. **Mozaika (F-1115-05)** — Blok studiya qaytadan quriladi. Qaror (16.11): Blockly, avval bir kunlik sinov; sinov yomon chiqsa — o'zimiz quramiz. Sudrash sinf noutbukidagi sensorli panelda qanchalik oson — sinalmagan; shuning uchun bosib qo'shish ham qoladi.
6. **Ism yozish.** 9 yoshli bola sekin yozadi; «Tasodifiy ism» tugmasi bilan yumshatildi, sinash kerak.
7. **Ism tizimdan keladi deb faraz qilindi** (1-sahna: «Salom, Aziz!»).
8. **9-sahna o'yini** uchun sinfda ustoz 5–6 qadam yura oladigan joy kerak.
9. **Ruscha matn** hali yo'q; blok nomlari ruschada ham inglizcha qoladi.
10. **Yangi huk savoli bolalarda sinalmagan.**
11. **Coddy ovozi.** Tayyor gaplar oldindan yozilgan o'zbekcha ovoz bilan (edge-tts, Sardor; tijorat sharti tekshirilmagan). Ro'yxatda yo'q gap — brauzerning o'zbek ovoziga bog'liq. Bola yozgan gap ovoz chiqarib aytiladigan joyda (uy, galereya) qo'pol so'z filtri shart.
12. **Ustoz panelidagi «Ayting» qatori (F-1115-06)** — keyingi ish.
13. **1-sahnadagi o'yin rasmlari** (labirint, olma terish, kosmik o'yin) — etalonda sxematik; darsda o'sha darslarning (2, 11, 17) o'z sahnasidan olinadi.
14. ~~«Nuqta» yoki «zonacha»~~ — yopildi (16.11, F-1116-06): bolaga «qadam» deyiladi — «Qadamlarni sanang», «Yulduzgacha necha qadam?»; rasmda — zonacha. «Rasm» qatorlaridagi `nuqta=` kaliti — kod uchun, kod qayta qurilganda nomlanadi.
15. ~~P2 — ikki yo'l~~ — yopildi (16.11): A yo'l — javob kartalari katta ekranda ham (sinf javoblarni birga ko'radi, javob ochilishi kuchli).
17. **Bekat belgilari** (ko'k strelka, binafsha gap, oltin yulduz) bolaga «bugun nima qilamiz»ni yozuvsiz aytadimi — sinalmagan.
16. **Pog'ona zinapoyasidagi kichik rasmlar** proyektorda sinf oxiridan o'qiladimi — tekshirilmagan.
