# 9-dars. Labirint o'yini 1

> **Holat: v1.2 — TASDIQLANDI (21.11 ~00:30, tavsiya bo'yicha: foydalanuvchi «mustaqil … tayyor degan darajaga keltiraylik» — «Qurishdagi qarorlar» 1–11 hammasi A, istalganini keyin o'zgartirsa bo'ladi). QURILDI (2026-11-20 kech; qurishdagi aniqlashtirishlar — oxirida «Qurishdagi qarorlar»). v1.1 — QORALAMA (2026-11-20; tavsiya bo'yicha yozildi — savollar oxirida («Savollar»), har birida tavsiya A; v1.1 — 8-dars manbasiga moslandi, oxirida «Moslash» bo'limi). Foydalanuvchi tasdig'i kutilmoqda.** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/009-labirint-oyini-1/`) shundan quriladi. Shart bloki — 8-darsdagi `if path → then` (`008-shart.md`): nomi, oilasi, rangi, «✓ ha / ✕ yo‘q» belgisi va so'zlari aynan o'sha. O'yin qoidasi shu blok bilan yoziladi: har strelka yurishdan oldin tekshiradi — «yo‘l bo‘lsa — yuradi» («Savollar» 1).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–8-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 9-dars («Labirint o'yini 1» — natija: labirintning 1-darajasi ishlaydi; o'rganadi: harakat, shart va hodisani bitta o'yinda birlashtiradi; nega: bloklar birinchi marta to'liq o'yinga aylanadi; tekshiruv: chek-list).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Har labirint manba yozilganda dastur bilan simulyatsiya qilindi: eng qisqa yechim, zarur strelkalar, shartsiz va shartli o'yin, huk ketma-ketligi, kalit va eshik (natija jadvallarda). Dars qurilganda sinov — `sinov/dvigatel/labirint.mjs` (**KOD**).
> **Bu — kursdagi birinchi loyiha darsi** (10-dars bilan juftlik: 10-dars shu o'yinni davom ettiradi). `KONSEPSIYA.md` 4-bo'limi: loyiha qolipi hali loyihalanmagan. Bu dars «yangi mavzu» ritmini saqlaydi (huk, reja, uch bekat, xulosa), lekin uch bekat — **bitta o'yinning uch qismi**: bola har pog'onada o'sha o'yin dasturini davom ettiradi («Savollar» 13).
> 3–5-dars auditidan saboq (8-darsdagidek): sinf doskasidagi rasm va pog'ona nomi javobni ochmaydi; ikki pog'onaning javobi bir xil emas; maslahat yo'nalish beradi, javobni aytmaydi (A·2); 16-qadamda bola o'z oxirgi yechgan pog'onasini ko'radi (A·1). Qanday qo'llangani — oxirida.

## Pasport

- **Dars turi:** loyiha (blokli). Yangi blok yo'q: 8-darsdagi `if path → then` birinchi marta hodisa bilan — strelka dasturchasi ichida; yangi so'z bitta — «qoida» («Savollar» 4).
- **Natija (dasturdan):** labirintning 1-darajasi ishlaydi. **Bu manbada:** bolaning labirint o'yini — strelkalar bilan boshqariladi (hodisa + harakat); har strelka yurishdan oldin yo'lni tekshiradi (shart — o'yin qoidasi «yo‘l bo‘lsa — yuradi»), shuning uchun o'yinchi adashib devor tomonga bossa ham qahramon devorga urilmaydi va o'yin davom etadi; qahramon kalitni olib eshikdan o'tadi va yulduzga yetsa — o'yin yutildi. Shu labirint 10-darsda «1-daraja» bo'ladi; «daraja» so'zi bu darsda aytilmaydi (10-dars).
- **Bola nimani tushunadi:** o'yin — boshqaruv, qoida va maqsad. Boshqaruv — har strelkaga o'z dasturchasi (4-dars). Labirintda shartsiz `move` devorga urilsa — o'yin to'xtaydi (2- va 8-darsdagidek: urilgan blokda dastur to'xtaydi), bitta adashgan bosish — hammasi boshidan. Qoida — shart: «agar o‘ngda yo‘l bo‘lsa — unda o‘ngga yur» (8-darsdagi `if path → then`), har strelka dasturchasida o'z tomoni bilan. Endi o'yinchi adashsa, qahramon devor oldida turadi («✕ yo‘q»), o'yin davom etadi: dastur har bosishda qaytadan tekshiradi. Bitta dasturchada uchalasi — hodisa (tugma bosildi), shart (yo'l bormi?), harakat (yur). Maqsad — avval kalit, keyin eshik, keyin yulduz (2-darsdagi tartib); kalitsiz eshik ham shart uchun devor. **Dastur bir marta tuziladi — har labirintda ishlaydi** (8-darsdagi «dastur bitta» fikri): bola pog'onadan pog'onaga o'z dasturini olib o'tadi, labirint esa almashadi (10-darsning asosi).
- **Tekshiruv (dasturdan):** chek-list (avto). 3-bekatda sahna yonida to'rt band — o'yin bajargani sari o'zi belgilanadi: «To‘rt strelka» · «Qoida» · «Kalit va eshik» · «Yulduz». To'rtalasi ✓ — o'yin tayyor. Chek-list LMS natijasiga ham boradi — mentor ko'radi (**KOD**, LMS — modul tugagach, 93-qaror).
- **Vaqt:** reja 65 daqiqa, zaxira 15–25 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi pog'onalarga (o'yin — bolalar ko'proq o'ynaydi).
- **Uch bekat:** 1 · Boshqaruv — 2 · Qoida — 3 · Kalit va yulduz. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda labirintda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror).
- **Oldingi darslar bilan bog'lanish:** 2-dars — labirint, devor, urilish, kalit va eshik («avval kalit, keyin eshik»); 3-dars — X va Y, `go to`; 4-dars — o'yin («▶ Boshlash», strelka dasturchalari; olmalar va qochadigan yulduz); 7-dars — tovush; 8-dars — shart (`if path → then`, Shart oilasi, «✓ ha / ✕ yo‘q»; «dastur bitta — har labirintda ishlaydi»). 1-darsning kirishida bola «Bloklardan o‘yin yasaymiz» (labirint) rasmini ko'rgan (69-qaror). Bu dars ularning hammasini bitta o'yinga yig'adi. 8-dars yakunidagi va'da — «Keyingi darsda harakat, shart va tugmalardan o‘yin yasaymiz — labirint o‘yini.» — shu; «O‘tgan darsda» kartasi — 8-darsning bugungi so'zi: «Shart — Ha bo‘lsa, ichidagisi bajariladi».

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–2 | Kiradi, labirintni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 2–7 | Ustoz o'yinni o'ynaydi va bir marta adashib devor tomonga bosadi — Coddy urildi, o'yin to'xtadi. Savol: adashsangiz ham o'yin to'xtamasin — qanday qilamiz? Sinf uchalasini o'sha 11 bosish bilan sinaydi: devorlarni kamaytirish ham, adashgan tugmani olib tashlash ham yordam bermaydi; «yurishdan oldin tekshirsin» — yordam beradi | 2–4 |
| 7–8 | Yangi so'z: qoida | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10 | Ustoz labirintda strelka dasturchalarini ko'rsatadi | 7 |
| 10–20 | O'yin boshqaruvini tuzadi: har pog'onada bitta yangi strelka (→, ↑, ↓, ★ da ←) | 8 |
| 20–23:30 | Ustoz strelkalarga qoida qo'shadi | 9–10 |
| 23:30–35 | Har strelkasiga qoida qo'shadi va o'ynaydi; ★ da qahramon yurganda tovush chalinadi | 11 |
| 35–37 | Xulosa: qoida | 12 |
| 37–40 | Ustoz kalit va eshikni o'yinda ko'rsatadi | 13–14 |
| 40–54 | Labirint o'yinini tugatadi — ro'yxat to'ladi; ★ da startga qaytish tugmasini qo'shadi | 15 |
| 54–59 | Qoidasini sinfga o'qib beradi — ustoz Coddy bilan o'ynaydi | 16 |
| 59–65 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10-daqiqada, birinchi natijasi (1-pog'ona: bitta dasturcha, besh bosish) — 11-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| qoida | o'yinda nima bo'lishini aytadigan shart: «agar o‘ngda yo‘l bo‘lsa — unda o‘ngga yur» | 5 (va 12, 17) | uch bo'lak birma-bir: `when → key pressed` ostida `if path → then`, ichida `move right` → o'ngda yo'l: «✓ ha», Coddy bir qadam yuradi → o'ngda devor: «✕ yo‘q», ichidagi blok xira, Coddy devor oldida turadi, o'yin davom etadi |

Yordamchi so'zlar (ta'rifsiz, tushunarli): o'yin, yutish, start, adashib bosish, ehtiyot bo'lib, boshi berk yo'l. 1–8-darsdan: blok, dastur, dasturcha, qahramon, yulduz, qadam, katak, labirint, devor, yo'l, urildi, kalit, eshik, ketma-ketlik, manzil, X va Y, hodisa, tugma, strelka, shart, tekshiradi, ha, yo'q, tomon, tovush, pog'ona.
Bir ma'noga bitta so'z: «qoida» (o'yindagi shart — `if` va uning ichidagisi birga: «yo‘l bo‘lsa — yuradi»; «shart» — tekshiriladigan narsa, «yo‘l bormi?», 8-darsdagidek: «qoida shart bilan yoziladi»; «talab», «tartib» deyilmaydi — «tartib» 2-darsdan bloklar tartibi); «`if` bloki» (blok nomi, 8-dars); «tekshiradi» (dastur shartni; «ko‘radi», «sezadi», «biladi» deyilmaydi — 8-dars); «ha» / «yo‘q» (shartning natijasi, 8-dars); «yo‘l» (qahramon o'ta oladigan katak — `path`); «devor» (butalar; gapda «buta», «to‘siq» deyilmaydi; maydon cheti va kalitsiz eshik ham shart uchun devor — 8-dars: «labirintdan tashqari — devor», yopiq eshik — devor); «urildi» (shartsiz `move` devorga yurdi — 2- va 8-darsdagidek; «tegdi» deyilmaydi); «o‘yin to‘xtadi» (urilganda; «yutqazdingiz», «o‘yin tugadi» deyilmaydi); «tomon» (o'ng, chap, tepa, past — strelka bilan; «yo‘nalish» deyilmaydi, 8-dars); «start» ((0, 0) — qahramon o'yinni boshlaydigan katak; «boshlanish», «boshi» deyilmaydi); «yutish» (o'yinni; «g‘alaba» deyilmaydi); «dasturcha» (4-dars); «ro‘yxat» (3-bekatdagi «O‘yiningizda:» bandlari; bolaga «chek-list» deyilmaydi — bu so'z faqat ustoz va mentor uchun).
Bu darsda AYTILMAYDI (keyingi darslarniki): daraja (10-dars), o'zgaruvchi, ball, jon (11–12-dars), tasodifiy son (13-dars), «forever» (cheksiz takrorlash), «aks holda» / else (56-dars), «yoki», «va», «istalgan tugma», kostyum bloklari («Savollar» 9).

## Maydon va bloklar

**Labirint** — 3–7-darsdagi bog' maydoni (7 × 5, X va Y sonlari, (0, 0) pastki chapda, Y tepaga; qahramon ostida «(x, y)» yorlig'i), endi butalar bilan: butalar — devor (2- va 8-darsdagi labirint chizmasi, 99-qaror), qolgan kataklar — toshli yo'lka. Daraxt va gul bezaklari yo'q. **Start doim (0, 0)** — 15 · ★ dagi startga qaytish tugmasi shu yerga olib boradi; 10-darsdagi ikkinchi labirint ham shu yerdan boshlanadi («Savollar» 3). **KOD**: maydonda devor, kalit va eshik (hozir faqat katak sahnasida bor) va 8-darsdagi `shart(h, yon)` maydonda ham.

**O'yin** (4-darsdagidek): asosiy tugma «▶ Boshlash» / «■ To‘xtatish», sahna ustida «O‘yin: strelkalarni bosing». **Bitta bosishda tartib** (**KOD**): 1) bosilgan strelkaning dasturchasi; ichida `if` bo'lsa — avval tekshiruv, 8-darsdagi ko'rinish: `if` yonadi, o'sha tomondagi katak 0,35 soniya belgilanadi, `if` yonida «✓ ha» yoki «✕ yo‘q», tovushsiz; 2) keyin tekshiruv: qahramon yulduzda — «Siz yutdingiz!», konfeti, o'yin to'xtaydi. Bir bosish tugamaguncha keyingisi o'tkazib yuboriladi (4-dars).
**Devorga urilish** (**KOD**, «Savollar» 2): shartsiz `move` butaga, maydon chetiga yoki kalitsiz eshikka yursa — qahramon joyida silkinadi, «tuk», To'siqvoy «Devor!» va **o'yin to'xtaydi** (2- va 8-darsdagidek: urilgan blokda dastur to'xtaydi, blok «urildi» belgisi bilan qoladi). «▶ Boshlash» — qaytadan, startdan (kalit ham boshidan). Shart bilan devor tomonga bosilsa — «✕ yo‘q», qahramon turadi, o'yin davom etadi; bu muammocha emas, o'yin.
**Kalit va eshik** (2-dars): kalit katagiga kirganda olinadi (qahramon yonida kalit belgisi); eshik kalit bilan ochiladi va ochiq qoladi; kalitsiz eshik — devor: shart «yo‘q» beradi (8-dars), ustida Kamvoy pufagi «Kalit qani?» (o'yin to'xtamaydi; **KOD**). 15 · ★ da startga qaytilsa ham kalit qo'lda qoladi, ochilgan eshik ochiq qoladi («Savollar» 7).

**Bloklar** — to'rt oila, hammasi javonda boshidan (loyiha — bola o'zi tanlaydi; «Savollar» 10): Hodisa (to'q sariq), Harakat (ko'k), Shart (kulrang-ko'k, 8-dars), Tovush (pushti, 7-dars).

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon kerak |
|---|---|---|---|
| `when → key pressed` | → tugmasi bosilganda | dasturcha shundan boshlanadi; tugma bosib tanlanadi: → ← ↑ ↓ space | 4-darsdan; 7-qadamdan |
| `if path → then` | agar o'ngda yo'l bo'lsa, unda | C-shaklli blok (8-dars): avval tekshiradi — o'sha tomondagi katak yo'lmi; «ha» bo'lsa — ichidagi bloklar bajariladi, «yo‘q» bo'lsa — bajarilmaydi. Tomon bosib tanlanadi: → ← ↑ ↓. Hodisa bloki ostida — har bosishda qaytadan tekshiradi | 8-darsdan; 10-qadam |
| `move right` · `move left` · `move up` · `move down` | o'ngga · chapga · tepaga · pastga yur | bitta katak; shartsiz devorga yursa — urildi, o'yin to'xtaydi | 2-darsdan |
| `play sound qadam` | tovushni chal: qadam | qisqa tovush, qahramon ustida «♪ qadam»; tovush bosib tanlanadi: qadam · sakrash · jiring · tuk (7-dars; bola noutbuki jonli darsda jim — 86-qaror) | 7-darsdan; 11 · ★ |
| `go to x: 0 y: 0` | X va Y ga bor | aytilgan katakka sakraydi; 15 · ★ da — startga qaytish tugmasi. Javonda `go to x: 0 y: 0` (3-darsdagidek) | 3-darsdan; 15 · ★ |

Ustoz shart oilasini 8-darsdagi gap bilan eslatadi: «Shart oilasi — kulrang-ko‘k. Bu blok avval tekshiradi, keyin bajaradi.»
**Dasturchalar** ostma-ost, har biri o'z hodisa bloki bilan (4-dars); ostida «N ta dasturcha». Hodisasiz bloklar xira. **Dasturda eng ko'pi 16 ta blok** (**KOD**: 4- va 8-darsda 12): boshqaruv qoida bilan 12 (to'rt dasturcha × 3) + 11 · ★ dagi tovush 1 + 15 · ★ dagi startga qaytish 2 = 15.
**`if` ni dasturchaga qo'yish** (**KOD**, 4- va 8-dars qoidalari birga; «Savollar» 14): hodisa blokini bosing — dasturcha tanlanadi (coral hoshiya); javondan `if path →` bosilsa — u o'sha dasturcha oxiriga tushadi va tanlanadi; keyin bosilgan `move` — `if` ichiga. Dasturchadagi eski `move` «✕» bilan olib tashlanadi (yoki sudrab `if` ichiga olinadi — Blockly). Tanlangan `if` bo'lganda javondan yana `if` — undan keyin, o'sha joyda tushadi (8-dars).
**Dastur pog'onadan pog'onaga o'tadi** (4-darsdagi `prog: 'oldingi'`): har pog'ona bolaning oldingi dasturi bilan ochiladi, labirint almashadi. Dars boshidagi birinchi pog'ona — bo'sh dastur.
**Chek-list** (3-bekat, **KOD**): sahna yonida kichik ro'yxat «O‘yiningizda:» — «To‘rt strelka» (→ ← ↑ ↓ ning har biriga dasturcha bor), «Qoida» (har strelka dasturchasidagi `move` — `if path` ichida, shart tomoni `move` niki bilan bir xil; va o'yinda shart kamida bir marta «yo‘q» berdi — qahramon devor oldida turdi), «Kalit va eshik» (o'yinda kalit olindi va eshik ochildi), «Yulduz» (o'yin yutildi). Band bajarilganda ✓ bo'ladi; ro'yxat butun dars bo'yi to'planadi (2-bekatda bajarilgan qoida ham sanaladi). Qahramonni va labirintni yopmaydi.

### Labirintlar

Belgilar: `S` — start (doim (0, 0)), `★` — yulduz, `#` — devor (buta), `·` — yo'l, `K` — kalit, `E` — eshik. Yuqori qator — maydonning tepasi (y = 4), pastki qator — y = 0. Hamma xarita 7 × 5. «Zarur strelkalar» — ularning birortasisiz yulduzga yo'l yo'q (dastur bilan hisoblangan).

| Nomi | Xarita (tepadan pastga) | Yulduz · kalit · eshik | Eng qisqa yechim | Zarur strelkalar | Qayerda |
|---|---|---|---|---|---|
| H — huk asosi | `###···★` · `#···#·#` · `#·#···#` · `#···#·#` · `S·#···#` | ★ (6, 4) | `→↑→→↑→→↑↑→` (10) | → ↑ | 2–4 |
| H-A — devorlar kamroq | `###···★` · `#·····#` · `#·····#` · `#·····#` · `S·#···#` (H dan 3 devor olindi: (4, 3), (2, 2), (4, 1)) | ★ (6, 4) | `→↑→→→→↑↑↑→` (10) | → ↑ | 3 |
| N — namoyish | `#######` · `#######` · `##···★#` · `##·####` · `S··####` | ★ (5, 2) | `→→↑↑→→→` (7) | → ↑ | 7 |
| B1 — to'g'ri yo'l | `··#####` · `·#····#` · `·#·##·#` · `·######` · `S····★#` | ★ (5, 0) | `→→→→→` (5) | → | 8 · 1 |
| B2 — tepaga | `····★##` · `·##·###` · `·##·#··` · `·#··#·#` · `S··##··` | ★ (4, 4) | `→→↑→↑↑↑→` (8) | → ↑ | 8 · 2 |
| B3 — pastga ham | `#·#####` · `#·#####` · `#···###` · `#·#·###` · `S·#··★#` | ★ (5, 0) | `→↑↑→→↓↓→→` (9) | → ↑ ↓ | 8 · 3 |
| BY — orqaga | `#······` · `#·####★` · `#·····#` · `#####·#` · `S·····#` | ★ (6, 3) | `→→→→→↑↑←←←←↑↑→→→→→↓` (19) | → ← ↑ ↓ | 8 · ★ |
| R — qoida namoyishi | `#######` · `#·····★` · `#·#####` · `#···###` · `S·#####` | ★ (6, 3) | `→↑↑↑→→→→→` (9) | → ↑ | 10 |
| Q1 — qoida | `###···★` · `###·###` · `#···###` · `#·#####` · `S·#####` | ★ (6, 4) | `→↑↑→→↑↑→→→` (10) | → ↑ | 11 · 1 |
| Q2 — ilon yo'l | `★######` · `·######` · `·····##` · `####·##` · `S····##` | ★ (0, 4) | `→→→→↑↑←←←←↑↑` (12) | → ← ↑ | 11 · 2 |
| Q3 — boshi berk yo'llar | `·#···#★` · `·#·#·#·` · `···#···` · `#·##·#·` · `S·#···#` | ★ (6, 4) | `→↑↑→↑↑→→↓↓→→↑↑` (14) | → ↑ ↓ | 11 · 3 |
| QY — qadam tovushi | `#···#··` · `#·#·#·#` · `··#···#` · `·####·★` · `S····##` | ★ (6, 1) | `↑↑→↑↑→→↓↓→→↓→` (13) | → ↑ ↓ | 11 · ★ |
| KN — kalit namoyishi | `#######` · `#K·E··★` · `##·####` · `##·####` · `S··####` | ★ (6, 3) · K (1, 3) · E (3, 3) | `→→↑↑↑←→→→→→` (11) | → ← ↑ | 14 |
| K1 — kalit va eshik | `#######` · `##·####` · `##··E·★` · `##·####` · `S·K####` | ★ (6, 2) · K (2, 0) · E (4, 2) | `→→↑↑→→→→` (8) | → ↑ | 15 · 1 |
| D1 — labirint o'yini | `##···#★` · `#K#·##·` · `#·#··E·` · `#·#·###` · `S···###` | ★ (6, 4) · K (1, 3) · E (5, 2) | `→↑↑↑↓↓↓→→↑↑→→→↑↑` (16) | → ↑ ↓ | 15 · 2, 15 · ★, 16 (10-darsda — «1-daraja») |

Hamma labirintda: yechim bor; eng qisqa yechim shartsiz ham, shart bilan ham devorga bir marta ham urilmasdan yutadi (o'ylab o'ynasa — yutiladi); kalitli labirintlarda (KN, K1, D1) eshik yulduzga yagona yo'lni to'sadi va kalitga eshiksiz yetiladi; KN va D1 da kalit yo'ldan chetda — borib, orqaga qaytiladi. Eng qisqa yechimlarning hech qaysi ikkitasi bir xil emas. 1-bekatda har pog'ona bitta yangi strelkani talab qiladi: B2 → bilan yechilmaydi, B3 → ↑ bilan yechilmaydi, BY → ↑ ↓ bilan yechilmaydi (dastur bilan tekshirilgan).

### Topshiriqlar va tekshiruv natijasi

Dastur bilan simulyatsiya qilingan. «W→[→]» — `when → key pressed`, ostida `move right` (shartsiz); «W→[if→[→]]» — `when → key pressed`, ostida `if path → then`, uning ichida `move right`; «Qoida» — to'rt strelka dasturchasining har biri shu shaklda, o'z tomoni bilan (12 ta blok); «→ ← ↑ ↓» — bosilgan strelkalar; «yo‘q» — shart «✕ yo‘q» berdi, qahramon turdi; «urildi» — shartsiz blok devorga urildi, o'yin to'xtadi.

| Joy | Labirint | Dastur | Bloklar / 16 | Simulyatsiya |
|---|---|---|---|---|
| Huk (2) | H | to'rt strelka, shartsiz (tayyor) | 8 | dvigatel 11 bosish: `→↑→→↑→↑→↑↑→` (7-bosish — adashgan ↑): 7-bosishda (4, 2) da tepadagi devorga urildi — o'yin to'xtadi (yulduzgacha 4 qadam qolgan edi) |
| Huk (3) · A | H-A | o'sha | 8 | o'sha 11 bosish: adashgan ↑ endi ochilgan (4, 3) ga yurdi, Coddy boshqa yo'ldan ketdi; 10-bosishda (5, 4) da maydon chetiga urildi — «✕ baribir urildi» |
| Huk (3) · B | H | ↑ dasturchasi olib tashlandi | 6 | o'sha 11 bosish: 2-bosish ↑ — dasturcha yo'q, Coddy turdi; 3-bosishda (1, 0) da o'ngdagi devorga urildi — «✕ ↑ kerak joyda yurmadi» |
| Huk (3) · C | H | Qoida (tayyor) | 12 | o'sha 11 bosish: 7-bosishda «yo‘q» — Coddy turdi; 11-bosishda yulduzda — «✓ adashsa ham yutdi» |
| Huk (4) | H | Qoida | 12 | ustoz ataylab startda ↑ («yo‘q»), keyin `→↑→→↑→→↑↑→` — yutdi (11 bosish, 1 «yo‘q») |
| 7 | N | W→[→] W↑[↑] | 4 | ustoz startda ↑ — (0, 1) devor: urildi, o'yin to'xtadi; «▶ Boshlash», `→→↑↑→→→` — yutdi |
| 8 · 1 | B1 | W→[→] | 2 | `→→→→→` — yutdi |
| 8 · 2 | B2 | + W↑[↑] | 4 | `→→↑→↑↑↑→` (yoki `↑↑↑↑→→→→`) — yutdi |
| 8 · 3 | B3 | + W↓[↓] | 6 | `→↑↑→→↓↓→→` — yutdi |
| 8 · ★ | BY | + W←[←] | 8 | `→→→→→↑↑←←←←↑↑→→→→→↓` (19) — yutdi |
| 10 | R | W→[→] W↑[↑] (tayyor) → W→[if→[→]] W↑[if↑[↑]] | 4 → 6 | shartsiz `→↑↑→` — 4-bosishda (1, 2) da urildi, o'yin to'xtadi; shart bilan `→↑↑→` («yo‘q») `↑→→→→→` — yutdi (10 bosish, 1 «yo‘q») |
| 11 · 1 | Q1 | Qoida | 12 | ataylab devor tomonga (masalan startda ↑ — «yo‘q»), keyin `→↑↑→→↑↑→→→` — yutdi (11 bosish). Shart: Qoida bor, kamida bir «yo‘q», yutdi. Xato varianti: ↑ dasturchasida `if path →` (ichida `move up`) — qahramon (1, 0) da qoladi: o'ngda devor, har ↑ da «yo‘q» |
| 11 · 2 | Q2 | o'sha | 12 | `→→→→↑↑←←←←↑↑` — yutdi. ← dasturchasi yo'q bo'lsa (8 · ★ ni o'tkazgan bola) — ← bosilganda Bo'shvoy, qahramon (4, 2) da qoladi; bola W←[if←[←]] ni qo'shadi |
| 11 · 3 | Q3 | o'sha | 12 | `→↑↑→↑↑→→↓↓→→↑↑` — yutdi; boshi berk yo'lga kirsa (masalan (0, 4) da ↑ — «yo‘q») — qahramon turadi, orqaga qaytadi: `→↑↑←↑↑↑↓↓→→↑↑→→↓↓→→↑↑` (21, 1 «yo‘q») — yutdi |
| 11 · ★ | QY | Qoida + bitta `if` ichida `move` bilan `play sound` | 13 | `↑↑→↑↑→→↓↓→→↓→` — yutdi; o'sha strelka bilan har yurishda tovush, devor tomonga bosilsa («yo‘q») — jim. Shart: `play sound` `if` ichida, o'yinda kamida bir marta chalindi, yutdi |
| 14 | KN | Qoida | 12 | ustoz: kalitsiz `→→↑↑↑→` — eshik oldida «yo‘q», Kamvoy «Kalit qani?», Coddy turadi; keyin `←→→→→→` — kalit, eshik ochildi, yutdi (12 bosish, 1 «yo‘q») |
| 15 · 1 | K1 | o'sha | 12 (13) | `→→↑↑→→→→` — kalit (yo'lda), eshik, yutdi |
| 15 · 2 | D1 | o'sha | 12 (13) | `→↑↑↑↓↓↓→→↑↑→→→↑↑` (16) — kalit chetda (borib qaytadi), eshik, yutdi; chek-list to'rtala band ✓ — «O‘yiningiz tayyor!» |
| 15 · ★ | D1 | + `when space key pressed` → `go to x: 0 y: 0` | 14 (15) | `→↑↑↑` (kalit) · space (startga; kalit qo'lda) · `→→→↑↑→→→↑↑` — 15 bosishda yutdi (orqaga yurib qaytsa — 16). Shart: startga qaytish kamida bir marta ishladi, yutdi |

## Yordam va xato

1–8-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga «noto'g'ri», «xato qildingiz» deyilmaydi. **Maslahat yo'nalish beradi, javobni aytmaydi** (A·2): savol yoki qayerga qarash kerakligi, tayyor bloklar ro'yxati emas. Shart bilan devor tomonga bosish o'zi muammocha emas — bu o'yin («✕ yo‘q», qahramon turadi).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | «▶ Boshlash» bosildi, dasturda hodisa bloki yo'q | «Men nimani kutaman?» | «Avval hodisa blokini qo‘ying: when … key pressed» (4-darsdagidek) |
| Bo'shvoy | o'yinda strelka bosildi, uning dasturchasi yo'q | «Bu tugma uchun dasturcha yo‘q-ku…» | «↑ tugmasi uchun when ↑ key pressed bloki kerak» (bosilgan tugma bilan; 4-darsdagidek) |
| Kamvoy | hodisa blokining ostida blok yo'q | «Tugma bosildi, lekin men nima qilay?» | «Hodisa blokining ostiga move blokini ulang» |
| — | strelka va move tomoni mos emas (masalan `when ↑` ostida `move right`) — faqat ishora | — | «↑ bosildi — qahramon o‘ngga yurdi. Dasturchani tekshiring» (**KOD**) |
| To'siqvoy | 1-bekat: shartsiz `move` devorga urildi — o'yin to'xtadi | «Devor!» | «O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»» (**KOD**) |
| To'siqvoy | 2-bekatdan: shartsiz `move` devorga urildi — o'yin to'xtadi | «Devor!» | «Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring» (8-dars gapi; **KOD**) |
| To'siqvoy | `if` ichidagi `move` shart tekshirmagan tomonga yurib urildi | «Devor!» | «Shart bir tomonni tekshirdi, blok boshqa tomonga yurdi» (8-dars gapi; **KOD**) |
| — | shart tomoni `move` nikidan boshqa, qahramon qimirlamay qoldi (har safar «yo‘q») — faqat ishora | — | «↑ bosildi — shart → tomonni tekshirdi» (haqiqiy tugma va tomon bilan; **KOD**) |
| Bo'shvoy | `if` ichi bo'sh | «Ichi bo‘sh-ku…» | «if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi» (8-dars gapi) |
| — | 2-bekatdan: qoida faqat ba'zi strelkalarda — faqat ishora | — | «↓ dasturchasi yo‘lni tekshirmaydi» (shartsiz dasturcha tugmasi bilan; **KOD**) |
| Kamvoy | kalitsiz eshik: shart «yo‘q» berdi (o'yin to'xtamaydi) yoki shartsiz `move` eshikka urildi (o'yin to'xtadi) | «Kalit qani?» | «Eshik yopiq. Avval kalitni oling» (2-darsdagidek) |
| Ortiqvoy | dastur to'ldi — yangi blok qo'shilmadi | «Joy qolmadi!» | «Dasturga 16 ta blok sig‘adi» |
| Kamvoy | 11 · ★: tovush qahramon turganda ham chalindi (`play sound` `if` dan tashqarida) | «Men yurmadim-ku!» | «Tovush qahramon turganda ham chalindi. U faqat yurganda chalinsin» (**KOD**) |
| Kamvoy | 11 · ★: yutdi, tovush bir marta ham chalinmadi | «Oz qoldi!» | «Qahramon yurganda tovush chalinsin» |
| Kamvoy | 15 · ★: startga qaytish tugmasi qahramonni startga emas, boshqa katakka olib bordi | «Bu start emas!» | «Qahramon (3, 2) ga bordi. Start — (0, 0)» (haqiqiy manzil bilan; **KOD**) |
| Kamvoy | 15 · ★: yutdi, startga qaytish bir marta ham ishlamadi | «Oz qoldi!» | «Bitta tugma qahramonni startga qaytarsin» |

Ikki sabab birga bo'lsa — avval urilish (o'yin o'sha yerda to'xtaydi). Muammocha qahramonni yopmaydi (91-qaror); labirintda — buta burchagida, qahramondan uzoqrog'ida (2-darsdagi 2b-A).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:02 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «9-dars · Labirint o‘yini», sarlavha «Bugun labirint o‘yini yasaymiz!». Coddy: «Salom! Bugun bloklardan haqiqiy o‘yin yig‘asiz.» O'ngda labirint H, Coddy startda, yulduz burchakda. Pastda kichik karta «O‘tgan darsda»: `if path → then` bloki — «Shart — Ha bo‘lsa, ichidagisi bajariladi» (8-dars yakunidagi bugungi so'z). Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «Bugun bloklardan o‘yin yasaymiz: labirint o‘yini.»
  2. «Hamma narsa tanish: strelkalar, devor, kalit va shart.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 1-darsdagi «Bloklardan o‘yin yasaymiz» rasmini eslatadi — o'sha labirint o'yinini bugun o'zlari yasaydi; 4-darsdagi o'yinni eslatadi (olmalar, qochadigan yulduz) — bugun o'yin labirintda; bugun va keyingi dars — bitta o'yin ustida.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «9-dars · Labirint o‘yini», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: adashsangiz ham o'yin to'xtamasin

- **Vaqt:** 0:02–0:03:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Avval dalil (6-bo'lim 6-band): labirintda bitta adashgan bosish o'yinni to'xtatadi — sinf buni o'z ko'zi bilan ko'radi. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol». Labirint H, Coddy startda; dasturda tayyor to'rt strelka dasturchasi (shartsiz). Ustoz «▶ Boshlash»ni, keyin panelda «O‘ynab ko‘rsat»ni bosadi — dvigatel 11 ta strelkani o'zi, tartib bilan bosadi (sahna ustida har bosilgan strelka bir zum chiqadi). Coddy yulduz tomon yuradi; yulduzga 4 qadam qolganda 7-bosish — adashgan ↑: tepada devor — Coddy urildi, silkinadi, «tuk», To'siqvoy «Devor!», o'yin to'xtadi (**KOD**: huk ketma-ketligi).
  2. Sarlavha «O‘yin to‘xtamasin. Qanday qilamiz?» (ikki qator; v1.2 — «Qurishdagi qarorlar» 1). Coddy: «Bitta adashgan bosish — o‘yin to‘xtadi. Hammasi boshidan!» Chapda uchta karta: A «Devorlarni kamaytiramiz» (buta rasmi va «−») · B «Adashgan tugmani olib tashlaymiz» (↑ tugmasi va «✕») · C «Yurishdan oldin tekshirsin» (strelka va «yo‘l bormi?» belgisi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Bitta adashib bosdim — o‘yin to‘xtadi. Endi hammasi boshidan.»
  2. «O‘yinchi adashsa ham o‘yin to‘xtamasin. Qanday qilamiz? Har kim bitta kartani tanlasin.»
- **O'z so'zi bilan:** «Siz ham o‘yinda adashib bosganmisiz?» deb so'raydi; Coddy qayerda urilganini ko'rsatadi; kartalarni o'qiydi; sinf javoblarini o'qiydi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi biri o‘yinni to‘xtatmaydi?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:06 (2,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz o‘yinlarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; labirint H-A (uchta devor olingan). O'sha 11 bosish: adashgan ↑ endi ochilgan katakka yuradi — Coddy boshqa yo'ldan ketadi va 10-bosishda maydon chetiga urildi, o'yin to'xtadi. Kartada: «✕ baribir urildi».
  2. «Keyingi» — B: labirint H, dasturdan ↑ dasturchasi olib tashlanadi. O'sha 11 bosish: 2-bosish ↑ — dasturcha yo'q, Coddy qimirlamaydi (bu yerda ↑ kerak edi); 3-bosishda devorga urildi. Kartada: «✕ ↑ kerak joyda yurmadi».
  3. «Keyingi» — C: labirint H, dasturchalar tayyor qoida bilan almashadi — har birida `if path … then` (o'z tomoni), ichida `move`. O'sha 11 bosish: har bosishda `if` yonadi, katak belgilanadi — «✓ ha», Coddy yuradi; 7-bosishda «✕ yo‘q» — tepada devor, Coddy turadi, o'yin davom etadi; 11-bosishda yulduzda — konfeti. Kartada: «✓ adashsa ham yutdi».
- **Tayanch gaplar:**
  1. «Devorlarni kamaytirsak — boshqa joyda urildi. Tugmani olib tashlasak — kerak joyda yurmadi.»
  2. «Uchinchisi har bosishda tekshirdi: yo‘l bormi? Devor bo‘lsa — turdi.»
- **O'z so'zi bilan:** har sinovdan oldin «qani, ko‘ramiz»; C da «yo‘q» chiqqan bosishni sinf bilan topadi — bu 8-darsdagi shart ekanini bolalar o'zi aytsin.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: yo'l bo'lsa — yuradi

- **Vaqt:** 0:06–0:07 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Yo‘l bo‘lsa — yuradi». A va B xira, C oltin. Ustoz «▶ Boshlash», startda ataylab ↑ ni bosadi — «✕ yo‘q», Coddy turadi; keyin `→↑→→↑→→↑↑→` — Coddy yulduzga yetadi, konfeti. Coddy: «Adashsangiz ham turaman — devorga urilmayman.»
- **Tayanch gaplar:**
  1. «Har strelka yurishdan oldin tekshiradi: yo‘l bo‘lsa — yuradi, devor bo‘lsa — turadi.»
  2. «Adashsangiz ham o‘yin davom etadi.»
- **O'z so'zi bilan:** 8-darsdagi `if path → then` endi o'yinda — tugma bosilganda tekshiradi; haqiqiy labirint o'yinlarida ham qahramon devorga qarab bosilsa joyida turadi; kalit va eshik ham bugun o'yinda bo'ladi (3-bekat).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: qoida

- **Vaqt:** 0:07–0:08 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: qoida»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Qoida nima?». Coddy: «Qoida — o‘yinda nima bo‘lishini aytadigan shart.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (`raqam` ishi):
     - 1-bosish: `when → key pressed` ostida `if path → then`, ichida `move right`; yozuv «→ bosilsa: yo‘l bormi?»;
     - 2-bosish: labirint bo'lagi, Coddy, o'ngida yo'l — «✓ ha», Coddy bir qadam yuradi; yozuv «Yo‘l bor — yuradi»;
     - 3-bosish: Coddy, o'ngida devor — «✕ yo‘q», ichidagi blok xira, Coddy joyida; yozuv «Devor — turadi. O‘yin davom etadi» (**KOD**: oldindan chizilgan uch holat).
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Qoida — o‘yinda nima bo‘lishini aytadigan shart.»
  2. «Qoidani if bloki bilan yozamiz: agar yo‘l bo‘lsa — unda yur.»
- **O'z so'zi bilan:** hayotdan: har o'yinning qoidasi bor — futbolda to'p chiziqdan chiqsa, o'yin to'xtaydi; shashkada faqat qiya yuriladi. Bizning o'yinda qoida — qahramon qanday yuradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Boshqaruv → 2 · Qoida → 3 · Kalit va yulduz; cho'qqida kichik karta «Dars oxirida · o‘z labirint o‘yiningiz · Qoidasini o‘qib berasiz». Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat — bitta o‘yin. Boshqaruvdan boshlaymiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: boshqaruv, qoida, kalit va yulduz.»
  2. «Uchalasi — bitta o‘yin. Har bekatda o‘yiningizga yangi narsa qo‘shasiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: labirintda strelkalar

- **Vaqt:** 0:09–0:10 (1 daqiqa)
- **Bekat:** 1 · Boshqaruv
- **Ekran:** proyektor — Blok studiya (ustoz, labirint N) · bola «Ustoz ekraniga qarang» («Ustoz boshqaruvni ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Labirintda strelkalar». Javonda to'rt oila: Hodisa, Harakat, Shart, Tovush. Labirint N, Coddy (0, 0) da; dastur bo'sh, «0 ta dasturcha».
  2. Ustoz `when → key pressed`, ostiga `move right`; yana `when → key pressed` — tugmasini bosib ↑ ni tanlaydi, ostiga `move up`. «2 ta dasturcha».
  3. «▶ Boshlash»: ustoz startda ↑ ni bosadi — tepada devor: Coddy urildi, «tuk», To'siqvoy «Devor!», o'yin to'xtadi. Yana «▶ Boshlash»: → → ↑ ↑ → → → — yulduzda: «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «4-darsdagi o‘yin — endi labirintda: har strelkaga o‘z dasturchasi.»
  2. «Devorga urilsa — o‘yin to‘xtaydi, 2-darsdagidek. Ehtiyot bo‘lib bosing.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** labirint 3-darsdagi maydonda — qahramon ostida manzil yorlig'i; dastur har pog'onada saqlanib, keyingisiga o'tadi — yangi labirintda kerak bo'lsa, yangi strelka qo'shiladi; urilib qolsangiz — «▶ Boshlash» bilan qaytadan.
- **Ustoz qiladi:** dasturchalarni tuzadi, «▶ Boshlash», strelkalarni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Boshqaruv: pog'onalar

- **Vaqt:** 0:10–0:20 (10 daqiqa)
- **Bekat:** 1 · Boshqaruv
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Boshqaruvni tuzing!». Coddy: «Yulduzga yetish uchun qaysi strelkalar kerak?» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya — kichik labirint rasmlari (yo'l va yechim chizilmaydi — faqat start, devor va yulduz): 1 «To‘g‘ri yo‘l» · 2 «Tepaga» · 3 «Pastga ham» · ★ «Orqaga». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval yo‘lni ko‘z bilan kuzating: qaysi tomonga yuriladi?»
  2. «Dasturingiz keyingi pog‘onaga o‘tadi. Yangi labirintga yangi strelka kerak bo‘lsa — qo‘shasiz.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; javobni aytmaydi — «Yo‘l qayerda buriladi? U yerda qaysi strelkani bosasiz?» deb so'raydi; «Maslahat»ni bosgan bolalarga boradi; urilib qayta boshlagan bolaga — «Bunga 2-bekatda yechim bor».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda to'rt oila; labirint; tasma yonida «N ta dasturcha» va «0 / 16 ta blok». Har pog'ona oldingi pog'onadagi dastur bilan ochiladi (1-pog'ona — bo'sh). Hamma pog'onada ishora boshida: «Yulduzga qaysi strelkalar olib boradi?».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «To‘g‘ri yo‘l», ostida «Qahramoningizni yulduzga olib boring.». Labirint B1. «Maslahat»: «Yulduz qaysi tomonda? O‘sha strelkaga dasturcha tuzing».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Tepaga», ostida «Yo‘l tepaga buriladi.». Labirint B2. «Maslahat»: «Yo‘l qayerda buriladi? U yerda qaysi strelka kerak?».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Pastga ham», ostida «Yo‘l tepaga chiqib, pastga tushadi.». Labirint B3. «Maslahat»: «Qahramon pastga ham yurishi kerak. Qaysi dasturcha hali yo‘q?».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Orqaga», ostida «Uzun yo‘l — to‘rt tomonga.». Labirint BY. «Maslahat»: «Yo‘l orqaga ham qaytadi. Qaysi strelka yetishmayapti?».
  Yutsa: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** strelka dasturchalarini tuzadi, «▶ Boshlash», o'ynaydi; kerak bo'lsa yangi strelka qo'shadi.
- **Tekshiruv:** o'yinda qahramon yulduzga yetdi (avto). Bola dasturchalarga hozirdan shart qo'ysa ham — qabul qilinadi.
- **Xatoda:** urildi — To'siqvoy «Devor!», o'yin to'xtadi («▶ Boshlash» — qaytadan); hodisa bloki yo'q — Bo'shvoy «Men nimani kutaman?»; strelkaning dasturchasi yo'q — Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…»; hodisa ostida blok yo'q — Kamvoy; strelka va move tomoni mos emas — ishora.

## 9 · 2-bekat

- **Vaqt:** 0:20–0:21 (1 daqiqa)
- **Bekat:** 2 · Qoida
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: qoida»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Boshqaruv ✓, oltin yoy; Coddy 2-bekatda; 2 · Qoida miltillaydi. Coddy: «Endi o‘yinga qoida qo‘shamiz — adashsangiz ham urilmaysiz.»
- **Tayanch gaplar:**
  1. «Boshqaruv tayyor. Endi o‘yinga qoida qo‘shamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: qoida

- **Vaqt:** 0:21–0:23:30 (2,5 daqiqa)
- **Bekat:** 2 · Qoida
- **Ekran:** proyektor — Blok studiya (ustoz, labirint R) · bola «Ustoz ekraniga qarang» («Ustoz qoida qo‘shyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Yurishdan oldin tekshiradi». Labirint R, Coddy (0, 0) da. Dasturda ikki dasturcha (tayyor): `when → key pressed` → `move right` va `when ↑ key pressed` → `move up`; «4 / 16 ta blok».
  2. «▶ Boshlash»: → ↑ ↑, keyin → — o'ngda devor: Coddy urildi, «Devor!», o'yin to'xtadi.
  3. Ustoz → dasturchasidagi `move right` ni «✕» bilan olib tashlaydi; hodisa blokini bosadi (dasturcha tanlanadi), javondan `if path →` — dasturcha ostiga tushadi va tanlanadi; javondan `move right` — `if` ichiga. ↑ dasturchasida ham shunday: `if path →` — tomonni bosib ro'yxatdan «↑» ni tanlaydi, ichiga `move up`. «6 / 16 ta blok».
  4. «▶ Boshlash»: → ↑ ↑, keyin → — `if` yonadi, «✕ yo‘q», Coddy devor oldida turadi, o'yin davom etadi; ↑ → → → → → — «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Yurishdan oldin tekshiramiz: agar o‘ngda yo‘l bo‘lsa — unda o‘ngga yur.»
  2. «Har strelkaga o‘z sharti, o‘sha tomon bilan: ↑ dasturchasida — if path ↑.»
  3. «Endi o‘zingiz: to‘rtala strelkangizga qoida qo‘shing.»
- **O'z so'zi bilan:** `if` ni dasturchaga qo'yishni sekin, ikki marta ko'rsatadi (avval hodisa blokini bosib tanlash); ↑ dasturchasida `if path →` qolsa nima bo'lishini sinf bilan o'ylaydi — ishga tushirmasdan; qoida har bosishda qaytadan tekshiriladi — 8-darsdagi `repeat` dagidek; «Shart oilasi — kulrang-ko‘k. Bu blok avval tekshiradi, keyin bajaradi.»
- **Ustoz qiladi:** shartsiz o'ynab urilishni ko'rsatadi, ikki dasturchaga shart qo'yadi, tomonni tanlaydi, «▶ Boshlash», ataylab devor tomonga bosadi, keyin yutadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Qoida: pog'onalar

- **Vaqt:** 0:23:30–0:35 (11,5 daqiqa)
- **Bekat:** 2 · Qoida
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Qoida qo‘shing!». Coddy: «Har strelka avval tekshirsin — adashsangiz ham o‘yin davom etadi.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya (kichik labirintlar, yo'lsiz): 1 «Qoida» · 2 «Ilon yo‘l» · 3 «Boshi berk yo‘llar» · ★ «Qadam tovushi». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval qoida, keyin o‘yin. Qoidani sinash uchun ataylab devor tomonga bosing.»
  2. «Qahramon turdimi? Demak, qoida ishladi.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Bu strelka qaysi tomonni tekshiryapti? Qaysi tomonga yuradi?» deb so'raydi (8-darsdagi savol); 3-pog'onada boshi berk yo'lni barmoq bilan ko'rsatadi — oxirigacha yurib ko'rmasdan, ko'z bilan tekshirish foydali.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur 8-qadamdagi dasturchalar bilan ochiladi (yo'q bo'lsa — bo'sh). Hamma pog'onada ishora boshida: «Har strelka yurishdan oldin tekshirsin».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Qoida», ostida «Har strelkaga qoida qo‘shing. Ataylab devor tomonga bosing — keyin yuting.». Labirint Q1. «Maslahat»: «Strelka bosilganda qahramon avval nimani tekshirsin? Qaysi tomonni?».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Ilon yo‘l», ostida «Yo‘l uch marta buriladi.». Labirint Q2. «Maslahat»: «Yo‘l chapga ham ketadi. Strelkalaringizni tekshiring».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Boshi berk yo‘llar», ostida «Qaysi yo‘l yulduzga olib boradi?». Labirint Q3. «Maslahat»: «Avval ko‘z bilan yo‘lni toping, keyin bosing».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Qadam tovushi», ostida «Qahramon yurganda tovush chalinsin — turganda jim.». Labirint QY. «Maslahat»: «if ichidagi bloklar qachon bajariladi? Tovush qachon chalinsin?». Erkin ijod (36-qaror) — tovushni va strelkani bola o'zi tanlaydi.
  Yutsa: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** har strelka dasturchasiga shart qo'yadi (tomonini tanlaydi), qoidani ataylab sinaydi, o'ynaydi; ★ da `if` ichiga tovush qo'shadi.
- **Tekshiruv:** 1-pog'ona — har strelka dasturchasidagi `move` `if path` ichida, shart tomoni `move` niki bilan bir xil; o'yinda shart kamida bir marta «yo‘q» berdi va o'yin yutildi; 2–3-pog'ona — o'sha qoida bilan o'yin yutildi; ★ — `play sound` biror `if` ichida (`move` bilan birga), o'yinda kamida bir marta chalindi va o'yin yutildi (avto).
- **Xatoda:** shartsiz blok urildi — To'siqvoy «Devor!» («Bu blok yo‘lni tekshirmay yurdi…»), o'yin to'xtadi; shart boshqa tomon — To'siqvoy «Devor!» (urilsa) yoki ishora (qimirlamasa); `if` ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…»; qoida ba'zi strelkalarda yo'q — ishora; ← dasturchasi yo'q — Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…»; joy qolmadi — Ortiqvoy «Joy qolmadi!»; ★ da tovush turganda ham chalindi — Kamvoy «Men yurmadim-ku!».

## 12 · Xulosa: qoida

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Qoida
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: qoida»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Qoida». Coddy: «Har strelka avval tekshiradi, keyin yuradi.» Ikki karta: «Qoida — O‘yinda nima bo‘lishini aytadigan shart» (`when → key pressed` → `if path → then` → `move right`) va «Har strelkaga — o‘z sharti» (to'rt dasturchaning kichik rasmi: → ← ↑ ↓, har birida o'z tomoni); o'ngda labirint Q3 — Coddy boshi berk yo'l oxirida «✕ yo‘q», turadi.
- **Tayanch gaplar:**
  1. «Qoida — o‘yinda nima bo‘lishini aytadigan shart.»
  2. «Qoida har bosishda tekshiriladi: yo‘l bo‘lsa — yuradi, devor bo‘lsa — turadi.»
- **O'z so'zi bilan:** bitta dasturchada uchalasi — hodisa, shart, harakat; dastur pog'onadan pog'onaga o'zgarmadi — labirintlar almashdi, o'yin esa har birida ishladi: bitta dastur — ko'p labirint (8-darsdagi fikr; keyingi darsda shu kerak bo'ladi).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 3 · Kalit va yulduz
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: kalit va yulduz»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Kalit va yulduz miltillaydi. Coddy: «Oxirgi bekat: kalit, eshik va yulduz.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — o‘yiningizni tugatamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: kalit va eshik

- **Vaqt:** 0:38–0:40 (2 daqiqa)
- **Bekat:** 3 · Kalit va yulduz
- **Ekran:** proyektor — Blok studiya (ustoz, labirint KN) · bola «Ustoz ekraniga qarang» («Ustoz kalitni ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Avval kalit, keyin eshik». Labirint KN: kalit chetda (1, 3), eshik (3, 3), eshik ortida yulduz. Dasturda to'rt strelka, har birida qoida. Sahna yonida chek-list «O‘yiningizda:» — «To‘rt strelka» ✓, «Qoida» ✓, «Kalit va eshik», «Yulduz».
  2. «▶ Boshlash»: ustoz → → ↑ ↑ ↑ → — eshik yopiq: shart «✕ yo‘q», Coddy eshik oldida turadi, Kamvoy «Kalit qani?».
  3. Ustoz: ← — kalit (Coddy yonida kalit belgisi); → → → → → — eshik ochiladi, yulduz: «Siz yutdingiz!». Chek-listda «Kalit va eshik» ✓, «Yulduz» ✓.
- **Tayanch gaplar:**
  1. «Kalitsiz eshik — devor kabi: shart «yo‘q» deydi.»
  2. «Avval kalit, keyin eshik — 2-darsdagi tartib.»
  3. «Ro‘yxatdagi to‘rt band ✓ bo‘lsa — o‘yiningiz tayyor.»
- **O'z so'zi bilan:** kalit chetda bo'lsa — borib, orqaga qaytiladi (2-dars); kalitni olgach eshik yo'l bo'ladi — shart endi «ha» deydi; chek-list o'zi belgilanadi — o'yin nimani bajarganini ko'rsatadi.
- **Ustoz qiladi:** «▶ Boshlash», strelkalarni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Labirint o'yini: pog'onalar

- **Vaqt:** 0:40–0:54 (14 daqiqa)
- **Bekat:** 3 · Kalit va yulduz
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «O‘yiningizni tugating!». Coddy: «Kalitni oling, eshikdan o‘ting, yulduzga yeting.» Chapda katta son «O‘yini tayyor 6 / 14», ostida «Har belgi — o‘yini tayyor bitta bola»; o'ngda zinapoya (kichik labirintlar, yo'lsiz): 1 «Kalit va eshik» · 2 «Labirint o‘yini» · ★ «Startga qaytish». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «O‘yiningizni tugating: ro‘yxatdagi to‘rt band ✓ bo‘lsin.»
  2. «Kalit uzoqda bo‘lsa — borib, orqaga qaytasiz.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Avval qayerga borasiz?» deb so'raydi; chek-listda ✓ bo'lmagan bandni bola o'zi topsin — «Qaysi band hali bo‘sh? Nega?»; ★ ni bajargan boladan — «Startga qaytish qayerda foyda berdi?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur 11-qadamdagi dasturchalar bilan ochiladi; sahna yonida chek-list «O‘yiningizda:» (2-bekatda bajarilgan qoida ✓ bo'lib keladi). Hamma pog'onada ishora boshida: «Avval kalit, keyin eshik».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Kalit va eshik», ostida «Avval kalit, keyin eshik.». Labirint K1. «Maslahat»: «Kalit qayerda? Eshikdan oldin o‘sha yerga boring».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Labirint o‘yini», ostida «O‘yiningizni tugating: hamma band ✓ bo‘lsin.». Labirint D1. «Maslahat»: «Kalit yo‘ldan chetda. Ro‘yxatda qaysi band bo‘sh?». Yutsa va chek-list to'lsa: «O‘yiningiz tayyor!» va konfeti (chek-listda bo'sh band qolsa — «Siz yutdingiz!» va ishora «Ro‘yxatda bo‘sh band bor: …»).
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Startga qaytish», ostida «Bitta tugma qahramonni startga qaytarsin.». Labirint D1 (o'sha). «Maslahat»: «Qaysi tugma hali bo‘sh? U bosilganda qahramon qayerga borsin?».
  1-pog'onada yutsa: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** o'ynaydi, chek-listni to'ldiradi; ★ da startga qaytish dasturchasini qo'shadi va o'yinda ishlatadi.
- **Tekshiruv:** 1-pog'ona — kalit olindi, eshik ochildi, yutildi; 2-pog'ona — yutildi va chek-list to'rtala band ✓ (avto); ★ — bo'sh tugma dasturchasidagi `go to x: 0 y: 0` o'yinda kamida bir marta qahramonni startga qaytardi va o'yin yutildi.
- **Xatoda:** kalitsiz eshik — Kamvoy «Kalit qani?»; shartsiz blok urildi — To'siqvoy «Devor!», o'yin to'xtadi; strelka dasturchasi yo'q — Bo'shvoy; joy qolmadi — Ortiqvoy; ★ da startga emas — Kamvoy «Bu start emas!»; ★ da startga qaytish ishlatilmadi — Kamvoy «Oz qoldi!».

## 16 · Qoidangizni o'qib bering

- **Vaqt:** 0:54–0:59 (5 daqiqa)
- **Bekat:** 3 · Kalit va yulduz
- **Ekran:** proyektor — Blok studiya (ustoz, labirint D1; Coddy'ning to'rt strelka dasturchasi tayyor, shartsiz) · bola — o'z oxirgi yechgan pog'onasi, o'z dasturi bilan (A·1; hech narsa yechmagan bolada — «Ustoz ekraniga qarang»)
- **Sahna:** 12-bo'lim 3-band: bola yozgan narsa proyektorga o'zi chiqmaydi — bola qoidasini ovoz chiqarib o'qiydi, ustoz o'sha bloklarni qo'yadi va sinf bilan o'ynaydi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Qoidangizni o‘qib bering». Coddy: «Siz qoidani o‘qiysiz — men shu qoida bilan o‘ynayman.»
  2. Bola o'qiydi: «when → key pressed, if path → then, move right» — har strelka uchun (★ qilgan bola — tovushi va startga qaytish tugmasi bilan); ustoz Coddy dasturchalariga o'sha shartlarni qo'yadi; «▶ Boshlash» — sinf qaysi strelkani bosishni aytadi; bir marta ataylab devor tomonga — sinf qoida ishlaganini ko'radi (Coddy turdi).
  3. Ikki-uch bola (har xil: tovushli, tovushsiz, startga qaytishli).
- **Tayanch gaplar:**
  1. «Kim qoidasini o‘qib beradi? Avval tugma, keyin shart tomoni, keyin ichidagi blok.»
  2. «Sinf, qaysi strelkani bosay?»
- **O'z so'zi bilan:** bolani maqtaydi; bola o'qishda biror strelkaning shartini tashlab ketsa — o'sha strelka bilan Coddy devorga urilib, o'yin to'xtaydi: «Ko‘rdingizmi: tekshirmagan blok devorga uriladi» (8-darsdagi gap).
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, o'ynaydi.
- **Parta:** o'z oxirgi yechgan pog'onasi — dasturchalari, labirint va oxirgi yutgan yo'li (oltin iz); ishora «Qoidangizni ustozga o‘qib bering»; shu ekranda qayta o'ynasa natija qayta sanalmaydi.
- **Bola qiladi:** qoidasini o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:59–1:02 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz labirint o‘yini yasadingiz!». Bugungi so'z: «Qoida — O‘yinda nima bo‘lishini aytadigan shart». Pastda: ✓ Boshqaruv · ✓ Qoida · ✓ Kalit va yulduz. Kichik karta «Keyingi dars · 10 · Labirint o‘yini 2».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: boshqaruv, qoida, kalit va yulduz.»
  2. «Bugungi so‘z — qoida: o‘yinda nima bo‘lishini aytadigan shart.»
  3. «Keyingi darsda o‘yiningizga ikkinchi labirint qo‘shasiz — uni o‘zingiz yasaysiz.»
- **O'z so'zi bilan:** «qoida» nimaligini bolalardan aytdiradi; ikki-uch boladan qahramoni necha marta devor oldida to'xtaganini so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz labirint o‘yini yasadingiz!». Coddy o'rniga qahramon (o'z ismi bilan): «Strelkalar, qoida va kalit — o‘yinim tayyor.» «Siz bugun»: N marta tugma bosdi · N marta devor oldida to‘xtadi · N labirint yutdi (haqiqiy son; **KOD**). Chek-list «O‘yiningizda:» (to'rt band, ✓ lari bilan). O'z qahramoni D1 da, yulduz yonida; «O‘yiningiz saqlandi — keyingi darsda davom etamiz.» (faqat o'yin haqiqatan saqlansa — 12-bo'lim 28-band; **KOD**).
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:02–1:05 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N marta tugma bosdi · N marta devor oldida to‘xtadi · N labirint yutdi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda o‘z labirintingiz bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Har bir o‘yinda shunday qoidalar bor — endi ularni o‘zingiz yozasiz.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–8-darsdagidek (88-qaror). Farqi:
- 2-qadam: «O‘ynab ko‘rsat»ni bola o'zi bosadi (dvigatel 11 bosishni o'zi bajaradi).
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 4-qadam: bola o'zi o'ynaydi (ishora «Endi o‘zingiz: ataylab devor tomonga bosing, keyin yuting»).
- 5-qadam: «Keyingi»ni bola o'zi bosadi.
- 7, 10, 14-qadam (ustoz ko'rsatadi): dastur tayyor turadi (10-qadamda — ikki dasturcha qoida bilan), bola o'zi «▶ Boshlash» va strelkalarni bosadi; 10-qadamda ishora «Ataylab devor tomonga bosing — qoidani ko‘ring».
- Solo'da yo'q qadamlar: 16 (o'qib berish) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi. O'yin solo'da ham saqlanadi (noutbukda) — 10-darsda ochiladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-009-labirint-oyini-1-v1` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Qoida» (`qoida`) — 11-qadamda 1-pog'ona bajarildi (birinchi qoida ishladi); «Labirint o‘yini» (`labirint_oyini`) — 15-qadamda 2-pog'ona bajarildi (chek-list to'liq).
- Natijaga chek-list ham boradi: to'rt band — bajarildi / bajarilmadi (mentor ko'radi; **KOD**).
- Bolaning o'yini (dasturchalari va D1 dagi holat) saqlanadi — 10-darsda ochiladi (**KOD**: jonli darsda serverda, demo va solo'da noutbukda — 94-qarordagi qahramon kabi).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Bu — loyiha darsi: yangi blok yo'q, hamma narsa tanish (2, 3, 4, 7, 8-dars). Yangi — ularni bitta o'yinga yig'ish: 8-darsdagi `if path → then` endi hodisa bloki ostida. Darsda savol bitta — boshidagi huk.
- Bugungi asosiy fikr: **o'yin = boshqaruv + qoida + maqsad. Qoida — shart: agar yo'l bo'lsa, unda yur; adashsangiz ham o'yin davom etadi.** Hukda, 10-qadamda va xulosada chiqadi.
- 1-bekatda shartsiz urilish o'yinni to'xtatadi — bolalar qaytadan boshlaydi. Bu ataylab: 2-bekatda qoida shu muammoni hal qiladi.
- `if` ni dasturchaga qo'yishni 10-qadamda sekin, ikki marta ko'rsating: avval hodisa blokini bosing (dasturcha tanlanadi), keyin javondan `if`, keyin `move`. Eng ko'p uchraydigan xato — shart tomoni strelkaniki bilan bir xil emas (↑ dasturchasida `if path →`): javobni aytmang, «Bu strelka qaysi tomonni tekshiryapti?» deb so'rang.
- Dastur pog'onadan pog'onaga o'tadi — bola o'z o'yinini davom ettiradi, labirint almashadi. Bola dasturini o'chirib yubormasin.
- 8-qadam ★ ni o'tkazgan bolada ← dasturchasi bo'lmaydi — 11-qadam 2-pog'onada kerak bo'ladi; muammocha buni o'zi aytadi.
- 2-bekatda bolalar ataylab devor tomonga bosadi — bu qoidani sinash, xato emas.
- O'yin paytida proyektorda → va ← qadam almashtirmaydi — keyingi qadamga «Keyingi» tugmasi bilan o'ting. «To‘xtadik. Qo‘llar klaviaturadan.» kelishuvini dars boshida eslating.
- 16-qadamda bolaning ismi proyektorga chiqmaydi: bola qoidasini o'zi o'qiydi, siz tuzasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **Maydonda labirint:** `maydonHtml` ga devor (buta chizmasi — `katakHtml` dagi), kalit va eshik (`katakHtml` dagi chizmalar); maydon xaritasi belgilari `#`, `K`, `E`. `maydonBajar`: kalit olish va eshik ochilishi (2-dars `sahna.js` katak ishidan). 8-darsdagi `shart(h, yon)` (8-dars KOD 3 — katak sahnasi uchun yozilgan) maydonda ham: buta, maydon cheti va kalitsiz eshik — devor; tekshiruv ko'rinishi o'sha (katak 0,35 soniya, «✓ ha» / «✕ yo‘q», tovushsiz).
2. **Labirint o'yinida urilish:** shartsiz `move` devorga — qahramon silkinadi, «tuk», To'siqvoy «Devor!», o'yin to'xtaydi, blok «urildi» belgisi bilan qoladi (2- va 8-dars qoidasi o'yin rejimida). Faqat devorli sahnada — 4-darsdagi maydon chetidagi «tuk, o'yin davom etadi» o'zgarmaydi («Savollar» 2). «▶ Boshlash» — startdan, kalit boshidan.
3. **Shart hodisa dasturchasida:** 8-darsdagi ijro (KOD 2: `if` tugunini tekshirib, «ha» bo'lsa ichkiga kirish) o'yin rejimida, har bosishda; tekshiruv ko'rinishi vaqti ham «bir bosish» ichida (keyingi bosish shundan keyin).
4. **`if` ni dasturchaga qo'yish:** tanlangan dasturcha (hodisa bloki bosilgan) + javondan `if` — dasturcha oxiriga, o'zi tanlanadi; keyingi javondan `move` — `if` ichiga; tanlangan `if` + javondan `if` — undan keyin (8-dars KOD 5 ning hodisa dasturchasidagi varianti).
5. **Huk:** «O‘ynab ko‘rsat» — panel tugmasi; dvigatel kartaga yozilgan tugmalar ketma-ketligini (11 bosish, 7-si adashgan ↑) 0,4 soniyadan bosadi, har bosilgan strelka sahna ustida bir zum ko'rinadi; uch karta — A o'z labirinti (H-A), B o'z dasturi (↑ dasturchasisiz), C qoidali dasturi bilan; natija kartada («✕ baribir urildi» / «✕ ↑ kerak joyda yurmadi» / «✓ adashsa ham yutdi»). 4-qadam — ustoz o'zi o'ynaydi.
6. **Kalitsiz eshikda Kamvoy pufagi** — shart «yo‘q» berganda o'yin to'xtamasdan (~1,5 soniya); shartsiz urilganda — o'yin to'xtaydi, pufak o'sha.
7. **Pog'ona shartlari:** `qoida: true` (statik: har strelka dasturchasidagi `move` — `if path` ichida, shart tomoni `move` niki bilan bir xil), `yoq: 1` (o'yinda shart kamida bir marta «yo‘q» berdi), `tovush: 'if'` (★ — `play sound` `if` ichida va chalindi), `start: true` (15 · ★ — `go to x: 0 y: 0` li dasturcha ishladi); ishoralar: qoida ba'zi strelkalarda yo'q, shart tomoni boshqa (qimirlamadi), strelka va `move` tomoni mos emas, «Men yurmadim-ku!», «Bu start emas!».
8. **Chek-list** (sahna yonida, butun dars bo'yi to'planadi): «To‘rt strelka», «Qoida», «Kalit va eshik», «Yulduz»; 15 · 2 sharti — to'rtala ✓; 17-qadamda natijada; LMS natijasida.
9. **O'yinni saqlash:** bolaning dasturchalari va D1 — 10-dars uchun (jonli darsda serverda, demo va solo'da noutbukda). «O‘yiningiz saqlandi» gapi faqat saqlanganda.
10. **Blok chegarasi 16**; to'rt C-blokli dasturcha (har biri hodisa + `if` + `move`, ★ da tovush) va space dasturchasi ostma-ost — dastur ustuniga sig'ishi (setka darvozasi).
11. **Natija turlari:** «marta tugma bosdi» (yutilgan o'yinlardagi bosishlar), «marta devor oldida to‘xtadi» (shart «yo‘q» bergan bosishlar), «labirint yutdi»; yutuqlar `qoida`, `labirint_oyini`.
12. **Simulyatsiya sinovi** `sinov/dvigatel/labirint.mjs` — yuqoridagi jadvallardagi har yechim (shartsiz va shartli), huk ketma-ketligi (uch karta), xato holatlari (shartsiz urilish, shart tomoni boshqa, ← siz).

## Savollar (tavsiya — A)

Bu yerda «[8-dars]» belgili savollar — **8-darsga ta'sir qiladi** (8-dars manbasi bilan birga hal qilinadi).

1. [8-dars] **Qoida — 8-darsdagi `if path → then`, har strelka dasturchasida: «yo‘l bo‘lsa — yuradi»** (`when → key pressed` → `if path → then` → `move right`; 12 ta blok). Sabab: 8-dars bloki o'zgarmaydi; 8-dars «Savollar» 1 ning o'zi shuni kutadi («strelka bosilganda ham urilmaydi»); DASTUR'dagi «harakat, shart va hodisani bitta o'yinda» — bitta dasturchada uchalasi. Narxi: v1 dagi «ko‘zni yumib yutib bo‘lmasin» g'oyasi ketdi — qoida o'yinni qiyinlashtirmaydi, adolatli qiladi (adashgan bosish o'yinni buzmaydi); o'yinning qiyinligi — kalit, eshik, boshi berk yo'llarda. **B** — v1 dagi «devorga tegsa — startga» (`when any key pressed` → `if touching wall then` → `go to x: 0 y: 0`): o'yin qiyinroq va hukda kuchliroq, lekin `if path` bilan yozib bo'lmaydi («aks holda» ham, «yo‘q bo‘lsa» ham yo'q) — Shart oilasiga **yangi shart** `touching wall` kerak (8-dars «Savollar» 1, 5 va KOD 1–3 ga ta'sir: blokda shart ro'yxati, ijroda «shu bosishda urildimi» holati) va hodisa blokiga «any» tanlovi. **C** — sirpanish: `when → key pressed` → `repeat 6` → `if path → then` → `move right` (8-darsdagi «devorgacha» — strelka bosilsa qahramon devorgacha yuradi; jumboq o'yin). Qiziq, 8-dars bilan to'liq mos, lekin hamma labirint qayta loyihalanadi va 10-darsdagi o'lchovlar (qadam, burilish) o'zgaradi.
2. **Labirint o'yinida shartsiz urilish — o'yin to'xtaydi** (To'siqvoy «Devor!»; 2- va 8-darsdagi «urilgan blokda dastur to'xtaydi» qoidasi). Sabab: shartning foydasi ko'rinadi — huk va 2-bekat shunga tayanadi. B — 4-darsdagidek «tuk», o'yin davom etadi (unda shart faqat «tuk» ni yo'qotadi — huk ishlamaydi, qoidaga ehtiyoj sezilmaydi). Farq: 4-darsdagi maydon chetida o'yin to'xtamas edi, bu yerda labirintda to'xtaydi — ustoz 7-qadamda aytadi.
3. [8-dars] **Sahna — 3–7-darsdagi 7 × 5 bog' maydoni, X va Y bilan, butalar devor.** Sabab: 15 · ★ dagi `go to x: 0 y: 0` startni manzil bilan aytadi (3-dars bilimi); 10-darsdagi ikkinchi labirint shu maydonda yasaladi (katakni bosish — 3-darsdagi `mdBosilgan`). Narxi: 8-darsdagi `shart(h, yon)` katak sahnasi uchun yozilgan — maydonga ham kerak (8-dars KOD 3 ga bitta jumla). B — 8-darsdagi katak labirint (X/Y siz): shart dvigatelda tayyor bo'ladi, lekin o'yin rejimi (hodisa) katak sahnasiga ko'chiriladi va 15 · ★ boshqa bo'ladi (`go to` siz).
4. **Yangi so'z — «qoida»** (o'yindagi shart: `if` va ichidagisi birga). B — loyiha darsida yangi so'z yo'q, 5-qadam o'rniga «Eslaymiz: shart».
5. **Huk — «adashsangiz ham o‘yin to‘xtamasin»**, uch karta bir xil 11 bosish bilan sinaladi (dvigatel bosadi): devorlarni kamaytirish · adashgan tugmani olib tashlash · yurishdan oldin tekshirish. B — huksiz: dars 8-darsdagi shartni eslash bilan boshlanadi (C kartasi 8-darsdagi javobga o'xshaydi — sinf bo'linmasligi mumkin, «Tekshirilmagan joylar» 1).
6. **«Urildi» — 2- va 8-darsdagi so'z** (v1 dagi «tegdi / tegsa» olib tashlandi). B — yo'q (8-dars so'zi qat'iy).
7. **Devor — buta, maydon cheti va kalitsiz eshik** (8-dars: labirintdan tashqari va yopiq eshik — devor; eshikda Kamvoy «Kalit qani?» ham chiqadi). 15 · ★ da startga qaytganda kalit qo'lda qoladi, ochilgan eshik ochiq qoladi. B — qaytganda hammasi boshidan.
8. **Blok chegarasi — 16** (4- va 8-darsda 12). Sabab: qoidali boshqaruv o'zi 12 ta. B — 14 (unda 11 · ★ va 15 · ★ birga sig'maydi: 15 ta).
9. [8-dars] **Yulduzlar: 11 · ★ — qadam tovushi (`play sound` `if` ichida), 15 · ★ — startga qaytish tugmasi (`when space key pressed` → `go to x: 0 y: 0`).** Sabab: v1 dagi «yulduzda gapiring» `touching star` ni talab qilardi — 8-darsda yo'q; tovush «ichidagi bloklar faqat «ha» bo'lsa bajariladi» ni o'yinda ko'rsatadi. 8-dars manbasida (Pasport, «Oldingi darslar») «kostyum va tovush bloklari, hodisa va `go to` 9-darsda shart bilan birga keladi» deyilgan — bu darsda kostyum bloki yo'q: 8-dars gapi «tovush bloki» ga tuzatiladimi yoki 11 · ★ kostyum bilan bo'ladimi (B: `switch costume to xursand` `if` ichida — yurganda xursand) — bir qaror kerak. C — `say` bilan (v1).
10. **Javonda hamma oila boshidan** (Hodisa, Harakat, Shart, Tovush; loyiha — bola o'zi tanlaydi, 6-dars kabi). B — oilalar bekatma-bekat ochiladi (Shart — 10-qadamdan).
11. **8 · ★ ni o'tkazgan bola ← siz qoladi** — 11 · 2 ← ni talab qiladi, Bo'shvoy ishorasi bilan bola o'zi qo'shadi; chek-list ham to'rt strelkani so'raydi. B — 8-qadam 3-pog'onasi ← ni ham talab qilsin (bir pog'onada ikki yangi strelka).
12. **Chek-list bola ekranida** («O‘yiningizda:» to'rt band, avto). B — chek-list faqat mentor uchun (LMS'da), bolada yo'q.
13. **Loyiha darsi — «yangi mavzu» ritmida** (huk, reja, uch bekat, xulosa, o'qib berish) — kursdagi birinchi loyiha qolipi shu. B — loyiha uchun alohida qolip (masalan huksiz, bitta katta ish) — KONSEPSIYA 7-ochiq savoli.
14. [8-dars] **`if` ni dasturchaga qo'yish — hodisa blokini bosib tanlab, javondan `if`, keyin `move`** (eski `move` «✕» bilan olib tashlanadi; 8-dars KOD 5 ga hodisa dasturchasi varianti). B — tanlangan `move` ni javondan bosilgan `if` o'z ichiga oladi (bir bosish; tomonni bola baribir o'zi tanlaydi) — yangi «o'rab olish» ishi, 8-darsda ham ishlatsa bo'ladi.
15. **Manba v1.1 tasdig'i.**

## Tekshirilmagan joylar

1. Huk: C kartasi («Yurishdan oldin tekshirsin») 8-darsdagi huk javobiga («Yo‘l bo‘lsa yuramiz») o'xshaydi — bolalar o'tgan darsni eslab darrov C ni tanlashi mumkin, sinf bo'linmaydi (12-bo'lim 25-band). B kartasi («Adashgan tugmani olib tashlaymiz») bolaga jiddiy taxmin bo'lib ko'rinadimi — sinalmagan.
2. Vaqtlar taxminiy. O'yinda bolalar ko'p o'ynaydi — 11- va 15-qadam cho'zilishi mumkin (zaxira shu yerga).
3. 1-bekatda urilish o'yinni to'xtatadi: BY (19 bosish) da qayta-qayta boshlash asabga tegishi mumkin — ★ bo'lgani uchun qabul qilindi; sinfda kuzatiladi.
4. Tekshiruv ko'rinishi (har bosishda 0,35 soniya) o'yinni sekinlashtiradimi — bolalar tez bosadi, bosishlar o'tkazib yuboriladi; kerak bo'lsa o'yin rejimida qisqaroq (KOD 3).
5. Besh dasturcha, to'rttasi C-blokli (15 ta blok) — Blockly dastur ustuniga sig'adimi, shrift kichraymaydimi — qurishda o'lchanadi (setka darvozasi).
6. `if` ni mavjud dasturchaga qo'yish (eski `move` ni olib tashlash, hodisani tanlash, `if`, tomon, `move`) — to'rt strelkaga 9 yoshliga uzoqmi; «Savollar» 14-B tezroq.
7. Shart tomoni xatosi (↑ dasturchasida `if path →`) — eng ko'p uchraydi deb kutilmoqda; ishora yetadimi — sinfda ko'riladi.
8. 4-darsdagi maydon chetida «tuk, o'yin davom etadi», bu yerda — «o'yin to'xtadi»: bola chalkashadimi.
9. 14 bola birdan klaviaturada o'ynaydi — sinf shovqini (4-darsdagidek).
10. Uzun sarlavhalar («Adashsangiz ham o‘yin to‘xtamasin. Qanday qilamiz?», «Siz labirint o‘yini yasadingiz!») sig'adimi — setka darvozasida o'lchanadi (71-qaror: sig'masa so'z qisqaradi).
11. Ruscha matn hali yo'q.

## Audit saboqlari qanday qo'llandi (3–5-dars auditidan)

1. **Doska javobni ochmaydi:** sinf doskasidagi zinapoya kartalarida faqat labirint (start, devor, kalit, eshik, yulduz) — yo'l, iz va yechim chizilmaydi; pog'ona nomi — labirintning belgisi («Ilon yo‘l», «Boshi berk yo‘llar»), yechim emas.
2. **Ikki pog'onaning javobi bir xil emas:** har pog'onaning eng qisqa yechimi boshqacha (dastur bilan tekshirildi); 1-bekatda har pog'ona yangi strelka talab qiladi. 2-bekatning 2- va 3-pog'onasida dastur o'zgarmaydi — bu ataylab (bitta dastur — ko'p labirint), o'ynaladigan yo'l esa boshqa.
3. **Maslahat yo'nalish beradi, javobni aytmaydi** (A·2): maslahatlar savol yoki qayerga qarash kerakligi («Qaysi tomonni?», «Qaysi tugma hali bo‘sh?»); tayyor blok ro'yxati yo'q. Xatodagi ishoralar 8-darsdagi gaplar bilan (nima bo'lganini aytadi, tayyor dastur bermaydi).
4. **16-qadamda bola o'z oxirgi yechgan pog'onasini ko'radi** (A·1): dasturchalari, labirint va oltin iz; hech narsa yechmagan bolada — «Ustoz ekraniga qarang» (8-darsdagidek).

## Moslash (20.11, 8-dars bilan)

v1 8-dars manbasidan oldin yozilgan edi va shart blokini taxmin qilgan edi (`if touching wall then`, `touching star`). 8-dars `if path → then` ni tanladi — bu dars unga moslandi:
1. **Shart bloki** — `if path → then` (8-dars): nomi, Shart oilasi, kulrang-ko'k rangi, tomon tanlash (→ ← ↑ ↓), «✓ ha / ✕ yo‘q» belgisi (tovushsiz), «tekshiradi», «ha / yo‘q», «yo‘l», «tomon», «bajarilmaydi» so'zlari aynan o'sha. `touching wall`, `touching star` olib tashlandi — 8-darsda yo'q. Sabab: kurs bo'yi bir ma'no — bir so'z.
2. **Qoida qayta loyihalandi:** «agar devorga tegsa — unda startga qayt» o'rniga «agar yo‘l bo‘lsa — unda yur», har strelka dasturchasida (`when → key pressed` → `if path → then` → `move right`). Sabab: «devorga tegdi» ni `if path` bilan yozib bo'lmaydi (else ham, «yo‘q bo‘lsa» ham yo'q); 8-dars «Savollar» 1 ning o'zi shu birikmani kutadi. Eski variant — «Savollar» 1-B (8-darsga yangi shart kerak).
3. **`when any key pressed` («any» tanlovi) olib tashlandi** — qoida endi har strelkada; hodisa blokiga yangi tanlov kerak emas (KOD kamaydi).
4. **O'yin qoidasi — shartsiz urilish o'yinni to'xtatadi** (2- va 8-darsdagi «urilgan blokda dastur to'xtaydi»); v1 da «tuk, o'yin davom etadi» edi. Sabab: aks holda shartning o'yindagi foydasi ko'rinmaydi («Savollar» 2).
5. **Huk qayta loyihalandi:** «ko‘zni yumib yutib bo‘lmasin» (22 bosish) o'rniga «adashsangiz ham o‘yin to‘xtamasin» (11 bosish, 7-si adashgan ↑). Kartalar: A «Devorlarni kamaytiramiz» (yangi labirint H-A) · B «Adashgan tugmani olib tashlaymiz» · C «Yurishdan oldin tekshirsin». H-B (kalit va eshik kartasi) olib tashlandi. Simulyatsiya: A — 10-bosishda chetga urildi, B — 3-bosishda urildi, C — 11-bosishda yutdi (1 «yo‘q»).
6. **«Tegdi / tegsa» → «urildi»** (2- va 8-dars so'zi); «qoida sezadi» → «shart tekshiradi». 5-qadam rasmi, 10-, 12-qadam, xulosa va yakun gaplari shunga moslandi.
7. **Ustoz namoyishlari:** 7-qadam — startda ↑: endi urildi, o'yin to'xtadi (v1 da «tuk, hech narsa»); 10-qadam — ikki dasturchaga shart qo'yish (v1 da «any» qoida dasturchasi); 14-qadam — kalitsiz eshik oldida «✕ yo‘q» (v1 da «startga qaytdi»). Hammasi qayta simulyatsiya qilindi.
8. **Yulduz pog'onalari:** 11 · ★ «Gapiradigan qoida» → «Qadam tovushi» (`play sound` `if` ichida; 7-dars bloki); 15 · ★ «Yulduzda gapiring» (`touching star`) → «Startga qaytish» (`when space key pressed` → `go to x: 0 y: 0`; D1 da 15 bosish, yo'l 16). Javonda Gap oilasi o'rniga Tovush. Sabab: `touching star` 8-darsda yo'q; 8-dars 9-darsga tovush va `go to` ni va'da qilgan.
9. **Blok chegarasi 14 → 16** (qoidali boshqaruv 12 ta; eng ko'p yechim 15).
10. **Chek-list «Qoida» bandi, pog'ona shartlari, muammochalar, natija** («N marta qoida ishladi» → «N marta devor oldida to‘xtadi») va KOD ro'yxati yangi qoidaga moslandi; To'siqvoy, Bo'shvoy gaplari 8-darsdagidek.
11. **4-dars qarorlari bilan:** «Oldingi darslar» va 1-qadamda 4-darsdagi o'yin — olmalar va qochadigan yulduz (4·10, 4·11). A·1 (16-qadamda o'z oxirgi yechgan pog'onasi, 8-dars shaklida) va A·2 (maslahatlar — yo'nalish; v1 dagi «if ichiga yana bitta blok: avval gap, keyin startga» kabi javob aytadigan maslahatlar olib tashlandi).
12. **O'zgarmadi:** dars tuzilishi (uch bekat, 18 qadam, vaqtlar), maydon va 1–3-bekatdagi labirintlar (B1–BY, R, Q1–QY, KN, K1, D1 — xaritalar o'sha; eng qisqa yechimlar shartsiz ham, shart bilan ham urilmay yutadi — qayta simulyatsiya qilindi), kalit va eshik, saqlash, LMS.

## Qurishdagi qarorlar (20.11 kech, v1.2 — dars qurilganda o'lchov va sinovdan chiqqanlar; tavsiya bo'yicha, ko'rik sahifasida savol)

1. **Huk sarlavhasi qisqardi:** «Adashsangiz ham o‘yin to‘xtamasin. Qanday qilamiz?» proyektorda uch qator bo'ldi (setka darvozasi: huk savoli ikki qatorgacha; «Tekshirilmagan joylar» 10). 71-qaror bo'yicha so'z qisqardi: **«O‘yin to‘xtamasin. Qanday qilamiz?»**. «Adashgan bosish» fikri Coddy gapida qoladi: «Bitta adashgan bosish — o‘yin to‘xtadi. Hammasi boshidan!»; ustozning tayanch gapi o'zgarmadi.
2. **Dasturchalar ikki ustunda** (Tekshirilmagan joylar 5): to'rt qoidali dasturcha (12 blok) dastur ustuniga eng kichik o'qiladigan masshtabda ham sig'madi — Blockly sig'maganini yuqoriga itarib, dasturchalar ustma-ust tushdi (surat). Yechim: dastur ustuni kengroq (javon biroz tor, labirint ~120 px tor), dasturchalar ikki ustunda — qo'shilish tartibida, qisqaroq ustunga. Yozuv 4–8-darsdagidek o'qiladi. Rad etilgan: kichikroq masshtab (16 blokda yozuv ~6 px).
3. **Tasma:** «N ta dasturcha» va «n / 16 ta blok» ikki qatorda (bir qatorga sig'masdi).
4. **«O‘ynab ko‘rsat» — bitta tugma** (2-qadam): ustoz avval «▶ Boshlash», keyin «O‘ynab ko‘rsat» bosmaydi — bitta «▶ O‘ynab ko‘rsat» o'yinni boshlab, 11 bosishni o'zi bajaradi. Bosilgan strelka sahnaning o'ng yuqori burchagida bir zum ko'rinadi. Huk kartalaridagi o'yinlarda dastur ko'rinmaydi (huk — savol ekrani); 4-qadamdagi javob o'yini ham shunday (dasturi ko'rinmaydigan qoida).
5. **5-qadam rasmi:** labirint H (pastki qatorda o'ngda yo'l, keyin devor — aynan kerakli holat); alohida «butun buta» labirint og'ir ko'rindi.
6. **Chek-list joyi:** javon ustunining pastida (labirintni ham, qahramonni ham yopmaydi); 17-qadamda — labirint ustida, chapda.
7. **«Yulduz» bandi** faqat ro'yxat ko'rinadigan o'yinda belgilanadi (14- va 15-qadam): aks holda 1-bekatdagi har yutish uni oldindan ✓ qilib, 3-bekatda band ma'nosiz bo'lardi. «To‘rt strelka» va «Qoida» — dars bo'yi to'planadi (manbadagidek).
8. **Chegara 16:** har studiya ekranining o'z chegarasi — to'lganda Ortiqvoy «Joy qolmadi!» (4–8-darsda chegara topshiriqda bo'lmasa faqat ishora chiqardi).
9. **15 · 2 bo'sh band bilan yutsa:** «Siz yutdingiz! Ro‘yxatda bo‘sh band bor: …» (bitta ishora qatorida), konfeti, pog'ona sanalmaydi.
10. **Natija sonlari** — faqat yutilgan o'yinlardan (4-darsdagidek; audit 20.11): «marta tugma bosdi» — o'sha o'yindagi bosishlar, «marta devor oldida to‘xtadi» — o'sha o'yindagi «yo‘q»lar, «labirint yutdi» — yutilgan pog'onalar.
11. **Hali qilinmagan (KOD, keyinroq):** chek-list LMS natijasida (8-band; LMS — modul tugagach, 93-qaror); jonli darsda o'yinni serverda saqlash (9-band) — hozir noutbukda (`jr-labirint-oyini`), 10-dars shundan o'qiydi.
