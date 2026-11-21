# 8-dars. Shart: agar … unda

> **Holat (20.11 kech): QURILDI tavsiya bo'yicha — `../darslar/008-shart/`, oxirida «Qurishdagi qarorlar»; savollar ko'rik sahifasida (8·1–8·4).** Avvalgi holat: v1 — QORALAMA (2026-11-20; tavsiya bo'yicha yozildi — savollar oxirida («Savollar»), har birida tavsiya A). Foydalanuvchi tasdig'i kutilmoqda.** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/008-shart/`) shundan quriladi. Eng muhimi — 1-savol (shart turi: «yo‘l bormi») va 3-savol (har topshiriqda ikki labirint, dastur bitta).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–7-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 8-dars («Shart: agar … unda» — natija: devorga tegsa to'xtaydigan personaj; o'rganadi: vaziyatga qarab har xil ish qilish; nega: shartsiz o'yinda qoida bo'lmaydi; tekshiruv: xatoni topish, avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Har topshiriq manba yozilganda dastur bilan simulyatsiya qilindi (natija jadvalda: har yechim, eng kam son, xato variantlari); dars qurilganda sinov — `sinov/dvigatel/shart.mjs` (**KOD**).
> 3–5-dars auditidan saboq: sinf doskasidagi rasm va pog'ona nomi javobni ochmaydi (3-bekatda nom — belgisi, xato turi emas); ikki pog'onaning javobi bir xil emas (jadval oxirida tekshiruv); maslahat yo'nalish beradi, javobni aytmaydi (A·2); 16-qadamda bola o'z oxirgi yechgan pog'onasini ko'radi (A·1). Bu dars labirintda — daraxt, gul va X/Y yo'q, shuning uchun bezak kataklari va koordinata qoidasi bu yerga tegishli emas.

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** devorga tegsa to'xtaydigan personaj. **Bu manbada:** qahramon devor oldida to'xtaydi — urilmaydi: har qadamdan oldin dastur tekshiradi, «yo‘l bormi?»; yo'l bo'lsa — yuradi, devor bo'lsa — turadi. 7-dars yakunidagi va'da («Keyingi darsda qahramon devorga tegsa to‘xtaydi — shart.») shu.
- **Bola nimani tushunadi:** `if` bloki shartni tekshiradi; shart «ha» bo'lsa — ichidagi bloklar bajariladi, «yo‘q» bo'lsa — bajarilmaydi. `repeat` ichida shart **har safar qaytadan** tekshiriladi — shuning uchun bitta dastur har xil labirintda ishlaydi: qayerda yo'l bo'lsa yuradi, qayerda devor bo'lsa to'xtaydi yoki boshqa tomonga buriladi. Bu — «vaziyatga qarab har xil ish».
- **Tekshiruv (dasturdan):** xatoni topish (avto) — 3-bekatda bola tayyor dasturdagi xatoni topib tuzatadi: dastur ikkala labirintda devorga urilmay yulduzga yetadi. 1–2-bekatda ham har topshiriqda **ikki labirint, dastur bitta** — sanab yozilgan dastur ikkalasiga birdan to'g'ri kelmaydi, shart kerak bo'ladi.
- **Vaqt:** reja 65 daqiqa, zaxira 15–25 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi pog'onalarga.
- **Uch bekat:** 1 · Devorgacha — 2 · Ikki shart — 3 · Xatoni topamiz. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda labirintda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror).
- **Oldingi darslar bilan bog'lanish:** 2-darsda qahramon labirintda devorga urilar edi — dastur devorni «sezmas edi» (002 manbasi: «devor bu darsda shart emas»). 3–7-darsda bola maydonda ishladi; 5-darsda `repeat` ni oldi. Bu dars yana 2-darsdagi labirintda (tepadan qaralgan bog', 99-qaror), «▶ Ishga tushir» bilan: endi dastur yurishdan oldin tekshiradi. 7-darsdagi kostyum va tovush bloklari, 4-darsdagi hodisa va 3-darsdagi `go to` bu darsda javonda yo'q — ular 9-darsda («Labirint o‘yini») shart bilan birga keladi.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, labirintni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–8 | Savolga javob beradi: ikki labirint, ikkalasida yulduz devor oldida, lekin uzoqligi har xil — bitta dastur bilan qanday yetamiz? Sinf uchalasini sinaydi: sanab yursak — biri yetmaydi, ko'p yursak — devorga uriladi, «yo‘l bo‘lsa yuramiz» — ikkalasida yetadi. Javob va yangi so'z: shart | 2–5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz `if` blokini ko'rsatadi | 7 |
| 10:30–21 | Devorgacha yuradi: pastga, tepaga, burchak, ★ uch tomon — har birida ikki labirint | 8 |
| 21–24 | Ustoz bitta `repeat` ichiga ikki shart qo'yadi — zinapoya | 9–10 |
| 24–36 | Ikki shart bilan zinapoyalardan o'tadi, ★ tog' | 11 |
| 36–38 | Xulosa: shart | 12 |
| 38–54 | Ustoz xatoni topadi; bola uchta dasturdagi xatoni tuzatadi, ★ da o'z sayrini tuzadi | 13–15 |
| 54–59 | Dasturini sinfga o'qib beradi — ustoz uni bog'da ishga tushiradi | 16 |
| 59–65 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona, 3 ta blok) — 11:30–12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida). 5-darsga qaraganda kirish va huk 1 daqiqa qisqa — shu sababli.

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| shart | tekshiriladigan narsa: «yo‘l bormi?» Ha bo'lsa — `if` ichidagi bloklar bajariladi, yo'q bo'lsa — bajarilmaydi | 5 (va 12, 17) | uch bo'lak birma-bir: o'ngda yo'l — `if path → then` yonida «✓ ha», Coddy bir qadam yuradi → o'ngda devor — «✕ yo‘q», ichidagi blok xira, Coddy turadi → `repeat 6` ichida o'sha `if`: sanoq 1…6, uch marta «ha», uch marta «yo‘q» — Coddy devor oldida to'xtadi |

Yordamchi so'zlar (ta'rifsiz, tushunarli): agar, unda, tekshirish, ha, yo'q, tomon, ikki labirint, zinapoya, tog', sayr. 1–7-darsdan: blok, dastur, buyruq, qahramon, yulduz, qadam, katak, labirint, devor, yo'l, urildi, xato, tuzatish, takrorlash, marta, ichiga, pog'ona.
Bir ma'noga bitta so'z: «shart» (tekshiriladigan narsa; ekranda «savol», «qoida» deyilmaydi); «`if` bloki» (blok nomi; ustoz bir marta «if — agar, then — unda» deb aytadi); «tekshiradi» (dastur shartni; «ko‘radi», «sezadi», «biladi» deyilmaydi — 1-darsdagi «Coddy yulduzni ko‘rmaydi» fikri buzilmasin); «ha» / «yo‘q» (shartning natijasi; «to‘g‘ri / noto‘g‘ri», «rost / yolg‘on» deyilmaydi); «yo‘l» (qahramon o'ta oladigan katak — `path`; 2-darsdagidek); «devor» (butalar; «buta», «to‘siq» deyilmaydi — 2-darsdagidek); «bajarilmaydi» (shart «yo‘q» bo'lganda ichidagi blok; «o‘tkazib yuboriladi», «tashlab ketiladi» deyilmaydi); «tomon» (o'ng, chap, tepa, past — strelka bilan; «yo‘nalish» deyilmaydi); «1-labirint», «2-labirint» (bitta topshiriqdagi ikki labirint; «chap», «o‘ng labirint», «birinchi bog‘» deyilmaydi).
Bu darsda AYTILMAYDI (keyingi darslarniki): «aks holda», else (56-dars, JavaScript bilan), «yoki», «va», taqqoslash (55-dars), «… gacha takrorla» / while (86-dars), «sensor», «mantiq», hodisa bilan shart (9-dars), o'zgaruvchi (11-dars), kostyum va tovush bloklari (7-dars javoni bu darsda yo'q).

## Labirint, bloklar va shart

Sahna — 2-darsdagi labirint (tepadan qaralgan bog', 99-qaror): butalar — devor, toshli yo'lka — yo'l; labirintdan tashqari — devor. O'tilgan kataklarda oltin iz. Devorga yurgan blok — qahramon joyida silkinadi, «tuk», dastur shu blokda to'xtaydi (To'siqvoy, 2-darsdagidek). X va Y yo'q. Kalit va eshik bu darsda yo'q.
**Ikki labirint, dastur bitta** (**KOD**, «Savollar» 3): har topshiriqda (huk, ko'rish ekranlari, 1–3-bekat pog'onalari; 15 · ★ dan tashqari) sahnada ikkita labirint — yorlig'i «1» va «2», har birida o'z qahramoni startda. «▶ Ishga tushir» bosilsa, dastur avval 1-labirintda, keyin 2-labirintda bajariladi (dasturdagi bloklar ikkala safar ham yonadi); har labirint yonida natija: «✓» yoki «✕». 1-labirintda o'tmasa — 2-labirint yurmaydi (muammocha 1-labirint haqida). Ikkalasida yulduzga yetsa — «Ikkalasida yetdi!» va konfeti. Tik (baland) labirintlar yonma-yon, keng labirintlar ustma-ust — qaysi biri katakni kattaroq ko'rsatsa.

**Bloklar** — uch oila: yangi **Shart** (rang — «Savollar» 4), Takrorlash (yashil, 5-dars) va Harakat (ko'k). Gap, Hodisa, Ko'rinish, Tovush va `go to` javonda yo'q.

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `if path → then` | agar o'ngda yo'l bo'lsa, unda | **C-shaklli blok** (5-darsdagi `repeat` kabi): ichiga bloklar qo'yiladi. Avval shartni tekshiradi — o'sha tomondagi katak yo'lmi; «ha» bo'lsa — ichidagi bloklar tartib bilan bajariladi, «yo‘q» bo'lsa — bajarilmaydi; keyin dastur `if` dan keyingi blokka o'tadi. Tomon bosib tanlanadi: → ← ↑ ↓ (4-darsdagi `when → key pressed` strelkalaridek; javonda `if path →`; «Savollar» 5) (**KOD**) | **yangi**: 7-qadam |
| `repeat 2` | takrorla | ichidagi bloklarni aytilgan son marta (2–10) — ichida `if` bo'lsa, shart har safar qaytadan tekshiriladi | 5-darsdan |
| `move right` · `move left` · `move up` · `move down` | o'ngga · chapga · tepaga · pastga yur | bitta katak | 2-darsdan |

Yangi oila rangi — ustoz aytadi: «Shart oilasi — kulrang-ko‘k. Bu blok avval tekshiradi, keyin bajaradi.»
**Tekshiruv ko'rinishi** (**KOD**, «Savollar» 6): `if` yonadi; shu tomondagi katak 0,35 soniya belgilanadi — yo'l bo'lsa oltin hoshiya, devor bo'lsa buta biroz silkinadi; `if` yonida «✓ ha» (oltin) yoki «✕ yo‘q» (xira). Tekshiruv — qadam emas: sakrash ham, tovush ham yo'q (12-bo'lim 13-band: bir qadam — bitta sakrash va bitta tovush faqat `move` da). «Yo‘q» bo'lsa ichidagi bloklar yonmaydi.
**Ichiga qo'yish** (**KOD**, 5-darsdagi tanlash qoidasi `if` ga ham): javondan `if` bosilsa — u dasturga tushadi (tanlangan `repeat` bo'lsa — uning ichiga) va **tanlanadi** (coral hoshiya); keyin bosilgan `move` lar `if` ichiga tushadi. Tanlangan `if` bo'lganda javondan yana `if` bosilsa — yangisi undan keyin, o'sha joyda (ichiga emas) tushadi va tanlanadi — bitta `repeat` ichida ikki shart shunday qo'yiladi. Javondan `repeat` bosilsa — doim tashqariga, dastur oxiriga (ichma-ich takrorlash bu darsda yo'q). Tanlangan blokni yana bossangiz — tanlov bekor. Sudrash (Blockly) ham ishlaydi; joy almashtirish (95-qaror) — bir blok ichida.
**Bloklar soni:** `repeat`, `if` va ichidagi har blok sanaladi (`repeat 6` + `if path → then` + `move right` = 3 ta blok). Har topshiriqda chegara (5-darsdagidek: «N / M ta blok», to'lsa Ortiqvoy «Joy qolmadi!»). Dasturda eng ko'pi 12 ta blok.
**Masalada maqsad:** dastur tugaganda qahramon ikkala labirintda ham yulduzda turibdi va hech qayerda devorga urilmadi. Yulduz — yo'lning oxirida, devor oldida (2-darsdagidek: undan o'tib bo'lmaydi). `repeat` soni yetarli bo'lsa, kattarog'i ham bo'ladi — ortiqcha safarlarda shart «yo‘q» beradi, qahramon yulduzda turadi (jadvalda «kamida N»; N…10 — hammasi teng).

**Labirintlar** (belgilar 2-darsdagidek: `S` — start, `★` — yulduz, `#` — devor, `·` — yo'l; yuqori qator — labirintning tepasi):

| Nomi | 1-labirint | 2-labirint | Qayerda |
|---|---|---|---|
| H — huk | `#######` · `S··★###` · `#######` | `#######` · `S····★#` · `#######` | 2–4 |
| N7 — ko'rish | `#######` · `###★··S` · `#######` | `#######` · `★·····S` · `#######` | 7 |
| 1·1 Pastga | `#S#` · `#·#` · `#★#` · `###` · `###` · `###` | `#S#` · `#·#` · `#·#` · `#·#` · `#·#` · `#★#` | 8 |
| 1·2 Tepaga | `###` · `###` · `#★#` · `#·#` · `#·#` · `#S#` | `#★#` · `#·#` · `#·#` · `#·#` · `#·#` · `#S#` | 8 |
| 1·3 Burchak | `#######` · `##★####` · `##·####` · `S··####` | `#######` · `#######` · `####★##` · `S····##` | 8 |
| 1·★ Uch tomon | `S#★####` · `·#·####` · `···####` · `#######` | `S####★#` · `·####·#` · `·####·#` · `······#` | 8 |
| N10 — ko'rish | `####★` · `###··` · `##··#` · `#··##` · `S·###` | `######★` · `####···` · `##···##` · `S··####` | 10, 12 |
| 2·1 Pastga zinapoya | `S··##` · `##·##` · `##··★` · `#####` | `S·#####` · `#··####` · `##··###` · `###···★` | 11 |
| 2·2 Chapga zinapoya | `★·###` · `#··##` · `##··#` · `###·S` | `★·#####` · `#····##` · `####··S` | 11 |
| 2·3 Chapga va pastga | `###·S` · `#···#` · `#·###` · `★·###` | `######S` · `###····` · `★···###` | 11 |
| 2·★ Tog‘ | `#######` · `##···##` · `#··#··#` · `S·###·★` | `##···##` · `#··#·##` · `··##··#` · `S####·★` | 11 |
| N14 — ko'rish | `######` · `###★·S` · `######` | `######` · `★····S` · `######` | 14 |
| 3·1 Qimirlamaydi | `#######` · `S···★##` · `#######` | `#######` · `S·····★` · `#######` | 15 |
| 3·2 Yulduzdan keyin | `###★#` · `##··#` · `#··##` · `S·###` | `####★#` · `###··#` · `###·##` · `S···##` | 15 |
| 3·3 Darrov urildi | `S####` · `··###` · `#···#` · `###·★` | `S··####` · `##····#` · `#####·★` | 15 |
| Sayr — 15 · ★ va 16 (bitta, yulduzsiz) | `·#···#·` · `···#···` · `·#·S·#·` · `···#···` · `·#···#·` | — | 15, 16 |

**Topshiriqlar va tekshiruv natijasi** (dastur bilan simulyatsiya qilingan; «R6[if→[→]]» — `repeat 6`, ichida `if path → then`, uning ichida `move right`; «→ ← ↑ ↓» — `move right/left/up/down`; «Blok» — hammasi sanaladi; «kamida N» — `repeat` soni N…10 bo'lsa ham shu natija):

| Joy | Yechim | Blok / chegara | Natija (simulyatsiya) |
|---|---|---|---|
| Huk (2–4) | C: R6[if→[→]] (kamida 5) | 3 / — | A — R3[→]: 1-labirint ★, 2-labirintda yetmadi (yulduzgacha 2 katak); B — R6[→]: 1-labirintda 4-qadamda devorga urildi; C — ikkalasida ★ (3 va 5 qadam) |
| 7 (ustoz) | R6[if←[←]] (kamida 6) | 3 / 3 | ikkalasida ★ (3 va 6 qadam). R2[←] — 1-da yetmadi; R6[←] — 1-da urildi; R5[if←[←]] — 2-da yetmadi |
| 8 · 1 | R5[if↓[↓]] (kamida 5) | 3 / 3 | ikkalasida ★ (2 va 5 qadam). R2[↓] — 2-da yetmadi; R5[↓] — 1-da urildi; R5[if→[↓]] — qimirlamadi (shart boshqa tomon) |
| 8 · 2 | R5[if↑[↑]] (kamida 5) | 3 / 3 | ikkalasida ★ (3 va 5). R3[↑] — 2-da yetmadi; R5[↑] — 1-da urildi; R4[if↑[↑]] — 2-da yetmadi |
| 8 · 3 | R4[if→[→]] R2[if↑[↑]] (kamida 4 va 2) | 6 / 6 | ikkalasida ★. Bitta repeat ichida ikki shart R4[if→[→], if↑[↑]] (5 blok) — ham ★. R4[→] R2[↑] — 1-da urildi; R4[if→[→]] R2[↑] — 2-da urildi |
| 8 · ★ | R3[if↓[↓]] R5[if→[→]] R3[if↑[↑]] (kamida 3, 5, 3) | 9 / 9 | ikkalasida ★ (6 va 11 qadam). R2[↓] R2[→] R2[↑] — 2-da urildi; oxirgisi R2 — 2-da yetmadi |
| 10 (ustoz) | R6[if→[→], if↑[↑]] (kamida 6) | 5 / 5 | ikkalasida ★ (8 va 9 qadam). Bitta shart R6[if→[→]] — 1-da yetmadi (1 qadamda to'xtadi). Teskari tartib if↑, if→ — kamida 7 |
| 11 · 1 | R6[if→[→], if↓[↓]] (kamida 6; teskari tartib — ham 6) | 5 / 5 | ikkalasida ★ (6 va 9). Ikki repeat R6[if→[→]] R6[if↓[↓]] — 6 blok, sig'maydi (va 1-da yetmaydi) |
| 11 · 2 | R6[if←[←], if↑[↑]] (kamida 6; teskari — 6) | 5 / 5 | ikkalasida ★ (7 va 8). R5 — 2-da yetmadi |
| 11 · 3 | R7[if←[←], if↓[↓]] (kamida 7; teskari tartib if↓, if← — kamida 6) | 5 / 5 | ikkalasida ★ (7 va 8). R6[if←[←], if↓[↓]] — 2-da yetmadi |
| 11 · ★ | R4[if→[→], if↑[↑]] R4[if→[→], if↓[↓]] (ishlaydigan juftlar: 3 va 5+, yoki 4+ va 4+; audit 20.11) | 10 / 10 | ikkalasida ★ (10 va 12). Bitta repeat ichida uch shart R10[if→, if↑, if↓] — 1-da yetmadi (qahramon tepaga chiqib, yana pastga qaytadi). Birinchi repeat 2 — 2-da yetmadi; ikkinchisi 2 — 1-da yetmadi |
| 14 (ustoz) | tayyor: R2[if←[←]] → tuzatish: son kamida 5 | 3 / 3 | xatoli: 1-labirint ★, 2-da yetmadi (2 qadam). R4 — hali 2-da yetmadi; R5 — ikkalasida ★ |
| 15 · 1 | tayyor: R7[if↑[→]] → shart tomoni → : R7[if→[→]] | 3 / 3 | xatoli: 1-labirintda qimirlamadi (har safar «yo‘q»). Tuzatilgan — ikkalasida ★ (4 va 6) |
| 15 · 2 | tayyor: R8[if→[→], ↑] → ↑ ni yangi `if path ↑ then` ichiga: R8[if→[→], if↑[↑]] | 4 → 5 / 5 | xatoli: 1-labirintda qahramon zinapoya bo'ylab yulduzga yetadi, keyingi safar `move up` devorga urildi (To'siqvoy, shartsiz blok); 2-labirintda birinchi safardayoq urilardi. Tuzatilgan — ikkalasida ★ (6 va 7); tartibi teskari bo'lsa ham ★ |
| 15 · 3 | tayyor: R8[if↓[↓], if→[↓]] → ikkinchi `if` ichida → : R8[if↓[↓], if→[→]] | 5 / 5 | xatoli: 1-labirintda 1-qadam pastga, keyin ikkinchi `if` ichidagi `move down` urildi (To'siqvoy, shart boshqa tomon). Tuzatilgan — ikkalasida ★ (7 va 8). Ikkinchi shartni ↓ ga almashtirish (R8[if↓[↓], if↓[↓]]) — yetmadi |
| 15 · ★ | bolaning o'zi (masalan R10[if→[→], if↑[↑]]) | ≤ 12 | tayyor sharti: kamida ikki `if` (har xil tomon), urilmadi, kamida 4 qadam. Namuna — 5 qadam, tepa o'ng burchakka boradi. R6[if→[→], if←[←]] — 12 qadam, borib-qaytadi — tayyor. R10[if↑[↑]] R10[if→[→]] — 1 qadam, kam |
| 16 | bolaning dasturi Sayr bog'ida | — | jadvaldagi hamma yechim (hamma `move` `if` ichida) Sayr bog'ida urilmay yuradi: R7[if→[→]] — 1 qadam, R8[if→[→], if↑[↑]] — 5, R6[if←[←], if↑[↑]] — 5, R5[if↓[↓]] — 0 (pastda devor) |

**Javoblar takrorlanmaydi:** bolaning pog'onalarida har yechim boshqa — 1-bekat ↓ · ↑ · (→ keyin ↑) · (↓ → ↑); 2-bekat (→ ↓) · (← ↑) · (← ↓) · tog'; 3-bekat tuzatilganlari → · (→ ↑) · (↓ va → tartibida). Ustoz ko'rsatganlari bolaning masalasidan farq qiladi (huk →, 7 ←, 10 (→ ↑), 14 — son). Bir xil yo'nalish juftligi faqat ustoz ekrani bilan bolaniki orasida: 15 · 2 ning tuzatilgani — 10-qadam dasturi; 15 · 3 — 11 · 1 ning teskari tartibi (bola uni yangidan yozmaydi, tayyor dasturdagi bitta blokni almashtiradi).

## Yordam va xato

1–7-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); maslahat yo'nalish beradi, javobni aytmaydi (A·2). Xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga «noto'g'ri», «xato qildingiz» deyilmaydi; «xato» — dasturdagi topiladigan narsa (98-qaror, 3-bekat nomi). Ishorada labirint raqami bor (**KOD**).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | dastur bo'sh, «Ishga tushir» bosildi | «Bu yerda hech narsa yo‘q-ku…» | «Avval blokni bosing — u dasturga qo‘shiladi» |
| Bo'shvoy | `if` ichi bo'sh | «Ichi bo‘sh-ku…» | «if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi» (**KOD**) |
| Bo'shvoy | `repeat` ichi bo'sh | «Ichi bo‘sh-ku…» | «repeat ichiga blok qo‘ying» (5-darsdagidek) |
| To'siqvoy | shartsiz `move` devorga urildi | «Devor!» | «N-labirint: bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring» (**KOD**) |
| To'siqvoy | `if` ichidagi `move` shart tekshirmagan tomonga yurib urildi | «Devor!» | «N-labirint: shart bir tomonni tekshirdi, blok boshqa tomonga yurdi» (**KOD**: urilgan blokning `if` i va tomoni solishtiriladi) |
| Kamvoy | dastur tugadi, qahramon yulduzgacha yetmadi | «Oz qoldi!» | «N-labirintda yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring» (**KOD**) |
| Ortiqvoy | dastur to'ldi — yangi blok qo'shilmadi | «Joy qolmadi!» | «Dasturga N ta blok sig‘adi» (2-bekatda qo'shimcha: «Ikki shartni bitta repeat ichiga sig‘diring») |
| Kamvoy | 15 · ★: `if` bittadan kam yoki hammasi bir tomonga | «Oz qoldi!» | «Ikki if qo‘ying — har xil tomonga» |
| Kamvoy | 15 · ★: qahramon 4 katakdan kam yurdi | «Oz qoldi!» | «Qahramon kam yurdi. Boshqa tomonlarni tekshiring» |

Ikki sabab birga bo'lsa — avval urilish (dastur o'sha yerda to'xtaydi). Muammocha qahramonni yopmaydi (91-qaror); labirintda — buta burchagida, qahramondan uzoqrog'ida (2b-A).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «8-dars · Shart», sarlavha «Bugun qahramon devorga urilmaydi!». Coddy: «Salom! Bugun yurishdan oldin yo‘lni tekshiraman.» O'ngda labirint (2-darsdagi bog'), Coddy startda. Pastda kichik karta «O‘tgan darsda»: `switch costume to` — «Animatsiya — Kostyumlar navbat bilan almashadi». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda qahramonni jonlantirdik.»
  2. «Bugun qahramon devorga urilmaydi — avval yo‘lni tekshiradi.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 2-darsdagi labirintni eslatadi — qahramon devorga urilardi, To'siqvoy «Devor!» derdi; o'tgan dars oxiridagi va'dani aytadi — bugun shu.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «8-dars · Shart», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: bitta dastur bilan qanday yetamiz?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Ikki labirint, ikkalasida yulduz devor oldida, lekin biri yaqin, biri uzoq; dastur esa bitta. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Bitta dastur bilan qanday yetamiz?» (ikki qator). Ustma-ust ikki labirint (H): «1» — yulduz 3 katak narida, «2» — 5 katak narida; ikkalasida yulduzdan keyin devor; har birida Coddy startda. Labirintlar ustida kichik yozuv «Dastur bitta — ikkala labirintda ishlasin». Coddy: «Ikkala yulduz devor oldida. Lekin uzoqligi har xil.» Chapda uchta karta: A «Sanab yuramiz» (`repeat 3` ichida `move right` rasmi) · B «Ko‘p yuramiz» (`repeat 6` ichida `move right` rasmi) · C «Yo‘l bo‘lsa yuramiz» (`move right` va «yo‘l bormi?» belgisi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Qahramon ikkala labirintda yulduzga yetsin. Dastur esa bitta.»
  2. «Har kim noutbukida bitta kartani tanlasin: qanday yetamiz?»
- **O'z so'zi bilan:** kartalarni o'qiydi; ikki labirintdagi kataklarni sinf bilan sanaydi (3 va 5); sinf javoblarini o'qiydi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol, ikki labirint va uchta karta; Coddy: «Qaysi yo‘l bilan ikkala yulduzga yetamiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; dasturda `repeat 3` ichida `move right`. 1-labirintda Coddy 3 qadam yuradi — yulduzda, «✓»; keyin 2-labirintda o'sha dastur: 3 qadam, yulduzgacha 2 katak qoldi — «✕». Kartada: «✕ 2-labirintda yetmadi» (**KOD**: huk kartasi ikki labirintda).
  2. «Keyingi» — B: `repeat 6` ichida `move right`. 1-labirintda Coddy 3 qadam yuradi, yulduz ustidan to'rtinchi qadamda devorga urildi — silkinadi, «tuk», To'siqvoy «Devor!». Kartada: «✕ devorga urildi».
  3. «Keyingi» — C: dasturda yangi blok — `repeat 6`, ichida `if path → then`, uning ichida `move right`; yonida «3 ta blok». 1-labirintda: har safar `if` yonadi, o'ngdagi katak belgilanadi — «✓ ha», Coddy qadam tashlaydi; to'rtinchi safardan «✕ yo‘q» — devor, Coddy yulduzda turadi. 2-labirintda — 5 marta «ha», keyin «yo‘q». Ikkalasida konfeti. Kartada: «✓ ikkalasida yetdi».
- **Tayanch gaplar:**
  1. «Sanab yursak — faqat birida yetdi. Ko‘p yursak — devorga urildi.»
  2. «Uchinchisi har qadamdan oldin tekshirdi: yo‘l bormi?»
- **O'z so'zi bilan:** B da «Devorda baribir to‘xtaydi-ku» degan fikrni eslatadi — to'xtadi, lekin urilib; C da «ha» va «yo‘q» larni sinf bilan birga aytadi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: yo'l bo'lsa — yuradi

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Yo‘l bo‘lsa — yuradi». A va B xira, C oltin; ikkala labirintda Coddy yulduzda, oltin iz. Coddy: «Yo‘l bo‘lsa yuraman, devor bo‘lsa turaman.»
- **Tayanch gaplar:**
  1. «Dastur har qadamdan oldin tekshiradi: yo‘l bormi? Bor bo‘lsa — yuradi, devor bo‘lsa — turadi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: shart

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: shart»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Shart nima?». Coddy: «Shart — tekshiriladigan narsa: yo‘l bormi?» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (3–5-darsdagi `raqam` ishi):
     - 1-bosish: kichik labirint bo'lagi, Coddy, o'ngida yo'l; `if path → then` ichida `move right`; `if` yonida «✓ ha», Coddy bir qadam yuradi; yozuv «Yo‘l bor — ichidagi blok bajariladi»;
     - 2-bosish: Coddy, o'ngida devor; o'sha blok; «✕ yo‘q», ichidagi blok xira, Coddy joyida; yozuv «Devor — ichidagi blok bajarilmaydi»;
     - 3-bosish: `repeat 6` ichida o'sha `if`; hukdagi 1-labirint; sanoq 1…6 — «ha, ha, ha», keyin «yo‘q, yo‘q, yo‘q»; Coddy devor oldida to'xtadi; yozuv «Har safar qaytadan tekshiradi» (**KOD**: oldindan chizilgan uch holat).
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Shart — tekshiriladigan narsa. if bloki tekshiradi: yo‘l bormi?»
  2. «Ha bo‘lsa — ichidagi bloklar bajariladi. Yo‘q bo‘lsa — bajarilmaydi.»
- **O'z so'zi bilan:** hayotdan misol: «Agar svetoforda yashil yonsa — o‘tamiz», «Agar yomg‘ir yog‘sa — soyabon olamiz»: avval tekshiramiz, keyin qilamiz; tekshirmasak — ho'l bo'lamiz.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Devorgacha → 2 · Ikki shart → 3 · Xatoni topamiz; cho'qqida kichik karta «Dars oxirida · o‘z sayringiz · Dasturini o‘qib berasiz». Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Birinchisidan boshlaymiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: devorgacha, ikki shart, xatoni topamiz.»
  2. «Dars oxirida shart bilan o‘z sayringizni tuzasiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: if bloki

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Devorgacha
- **Ekran:** proyektor — Blok studiya (ustoz, ikki labirint) · bola «Ustoz ekraniga qarang» («Ustoz if blokini ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «if — agar … unda». Javonda yangi oila «Shart» (rang doirachasi), unda `if path →`; Takrorlash oilasida `repeat 2`; Harakat oilasida to'rt `move`. Ustma-ust ikki labirint (N7): Coddy o'ng chetda, yulduz chapda — 1-labirintda 3 katak narida, 2-labirintda 6 katak. Dastur bo'sh, «0 / 3 ta blok».
  2. Ustoz javondan `repeat 2` ni bosadi — dasturda, tanlangan (coral hoshiya); sonni bosadi — «6».
  3. Javondan `if path →` ni bosadi — `repeat` ichiga tushadi va tanlanadi; shart yonidagi «→» ni bosadi — ro'yxat (→ ← ↑ ↓), «←» ni tanlaydi: `if path ← then`.
  4. Javondan `move left` ni bosadi — `if` ichiga tushadi; «3 / 3 ta blok».
  5. «▶ Ishga tushir»: 1-labirint — sanoq «1», `if` yonadi, chapdagi katak oltin, «✓ ha», Coddy qadam; … «4» — «✕ yo‘q», buta silkinadi, Coddy yulduzda turadi; «5», «6» — «yo‘q». «1» yonida «✓». Keyin 2-labirint — 6 qadam. «Ikkalasida yetdi!», konfeti.
- **Tayanch gaplar:**
  1. «if — agar. Shart — yo‘l bormi? Ha bo‘lsa — ichidagi blok bajariladi.»
  2. «repeat har safar qaytadan tekshiradi. Devorga yetsa — qahramon to‘xtaydi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** rangini aytadi: «Shart oilasi — kulrang-ko‘k. Bu blok avval tekshiradi, keyin bajaradi.»; `if` ning ham ichi bor — `repeat` dagidek, javondan bosilsa ichiga tushadi; shart tomonini bosib tanlashni sekin ko'rsatadi (4-darsdagi strelkalardek); son 6 — uzunroq yo'lga yetsin, qisqasida shart o'zi to'xtatadi.
- **Ustoz qiladi:** `repeat` qo'shadi, sonni tanlaydi, `if` qo'yadi, tomonni tanlaydi, ichiga blok qo'yadi, ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Devorgacha: pog'onalar

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Devorgacha
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Har qadamdan oldin tekshiring — ikkala labirintda ham.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda pog'onalar: 1 «Pastga» · 2 «Tepaga» · 3 «Burchak» · ★ «Uch tomon» (kichik rasmlarda — labirintlar va yulduz; iz va dastur yo'q). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Dastur ikkala labirintda ishlasin. Sanash yordam bermaydi — shart qo‘ying.»
  2. «repeat soni uzunroq yo‘lga yetsin.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; «Qaysi labirintda to‘xtadi? Shart qaysi tomonni tekshiryapti?» deb so'raydi; 3-pog'onada yo'l ikki bo'lak ekanini darrov aytmaydi — bola o'zi ko'rsin.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda Shart (`if path →`), Takrorlash (`repeat 2`), Harakat (to'rt `move`); sahnada ikki labirint; tasma yonida «0 / N ta blok». Hamma pog'onada ishora boshida: «Ikkala labirintda ham yetsin — dastur bitta».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Pastga», ostida «Ikkala yulduz pastda.». Labirintlar 1 · 1 (yonma-yon); 3 ta blok. «Maslahat»: «Yo‘l qancha — bilmaymiz. Har qadamdan oldin pastni tekshiring».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Tepaga», ostida «Ikki yo‘l — uzunligi har xil.». Labirintlar 1 · 2; 3 ta blok. «Maslahat»: «repeat soni uzun yo‘lga yetsin — qisqasida shart o‘zi to‘xtatadi».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Burchak», ostida «Avval o‘ngga, keyin tepaga.». Labirintlar 1 · 3; 6 ta blok. «Maslahat»: «Yo‘l ikki bo‘lak: har bo‘lakka o‘z repeat va o‘z sharti».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Uch tomon», ostida «Pastga, o‘ngga, tepaga.». Labirintlar 1 · ★; 9 ta blok. «Maslahat»: «Har burilish — yangi repeat. Har birida shart o‘z tomonini tekshirsin».
  Ikkalasida yetsa: «Ikkalasida yetdi!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** `repeat` qo'shadi, sonni tanlaydi, ichiga `if` qo'yadi, tomonni tanlaydi, ichiga `move` qo'yadi, ishga tushiradi.
- **Tekshiruv:** dastur tugaganda qahramon ikkala labirintda yulduzda, hech qayerda urilmadi (avto); bloklar chegaradan oshmaydi (dastur o'zi qo'ymaydi).
- **Xatoda:** shartsiz blok urildi — To'siqvoy «Devor!»; shart boshqa tomon — To'siqvoy «Devor!» yoki Kamvoy «Oz qoldi!»; yetmadi — Kamvoy «Oz qoldi!»; joy qolmadi — Ortiqvoy «Joy qolmadi!»; ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…».

## 9 · 2-bekat

- **Vaqt:** 0:21–0:22 (1 daqiqa)
- **Bekat:** 2 · Ikki shart
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: ikki shart»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Devorgacha ✓, oltin yoy; Coddy 2-bekatda; 2 · Ikki shart miltillaydi. Coddy: «Endi bitta repeat ichida ikki shart.»
- **Tayanch gaplar:**
  1. «Devorgacha yurishni bildik. Endi dastur burilishda ham yo‘lni tekshiradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: ikki shart

- **Vaqt:** 0:22–0:24 (2 daqiqa)
- **Bekat:** 2 · Ikki shart
- **Ekran:** proyektor — Blok studiya (ustoz, ikki labirint) · bola «Ustoz ekraniga qarang» («Ustoz ikki shart qo‘yyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Ikki shart — zinapoya». Ikki labirint (N10): ikkalasida yo'l zinapoya bo'lib o'ngga va tepaga ketadi — 1-labirintda zinapoya qadamlari bittadan, 2-labirintda ikkitadan. Dasturda tayyor: `repeat 6` ichida `if path → then`, uning ichida `move right` — «3 / 5 ta blok».
  2. «▶ Ishga tushir»: 1-labirintda Coddy bir qadam o'ngga yuradi, keyin har safar «✕ yo‘q» — turib qoldi; Kamvoy «Oz qoldi!».
  3. Ustoz `if` ni bosadi (tanlanadi), javondan `if path →` — undan keyin tushadi va tanlanadi; tomonni «↑» ga; javondan `move up` — ichiga. «5 / 5 ta blok».
  4. «▶ Ishga tushir»: har safar ikki shart navbat bilan tekshiriladi — o'ngda yo'l bo'lsa o'ngga, tepada yo'l bo'lsa tepaga; Coddy zinapoyadan chiqadi; 2-labirintda ham. «Ikkalasida yetdi!».
- **Tayanch gaplar:**
  1. «Bitta shart — bitta tomon. Zinapoyada ikki tomon kerak.»
  2. «Har safar ikkala shart tekshiriladi: o‘ngda yo‘l bo‘lsa — o‘ngga, tepada yo‘l bo‘lsa — tepaga.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** bitta dastur — har joyda har xil ish: bir joyda o'ngga yurdi, boshqa joyda tepaga; ikkinchi `if` ni qo'yish uchun avval birinchisini bosib tanlash kerak (yangisi undan keyin tushadi).
- **Ustoz qiladi:** ishga tushiradi, ikkinchi `if` qo'shadi, tomonni tanlaydi, ichiga blok qo'yadi, yana ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Ikki shart: pog'onalar

- **Vaqt:** 0:24–0:36 (12 daqiqa)
- **Bekat:** 2 · Ikki shart
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Zinapoyadan o‘ting!». Coddy: «Har safar ikki tomonni tekshiring.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda pog'onalar: 1 «Pastga zinapoya» · 2 «Chapga zinapoya» · 3 «Chapga va pastga» · ★ «Tog‘». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Bitta repeat — ichida ikki shart. Har shart o‘z tomonini tekshiradi.»
  2. «Yo‘l qaysi ikki tomonga ketyapti? Shu tomonlarni tekshiring.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Qaysi tomonni birinchi tekshirasiz?» deb so'raydi — ikkala tartib ham bo'ladi, faqat ba'zan `repeat` soni ko'proq kerak; ★ da «Tog‘ning cho‘qqisida qahramon qayerda turadi?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; sahnada ikki labirint; tasma yonida «0 / N ta blok». Hamma pog'onada ishora boshida: «Bitta repeat — ichida ikki shart».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Pastga zinapoya», ostida «O‘ngga va pastga.». Labirintlar 2 · 1; 5 ta blok. «Maslahat»: «Yo‘l qaysi ikki tomonga ketyapti? Har tomonga bitta if».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Chapga zinapoya», ostida «Qahramon o‘ng chetda.». Labirintlar 2 · 2; 5 ta blok. «Maslahat»: «Qahramondan yulduzga qarang: qaysi ikki tomonni tekshirish kerak?»
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Chapga va pastga», ostida «2-labirint uzunroq.». Labirintlar 2 · 3; 5 ta blok. «Maslahat»: «2-labirintda yetmasa — repeat soni yetadimi?»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Tog‘», ostida «Chiqamiz, keyin tushamiz.». Labirintlar 2 · ★; 10 ta blok. «Maslahat»: «Tog‘ ikki bo‘lak: chiqish va tushish. Har bo‘lakka o‘z repeat».
  Ikkalasida yetsa: «Ikkalasida yetdi!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** `repeat` qo'shadi, ichiga ikki `if` qo'yadi, tomonlarni tanlaydi, ichlariga `move` qo'yadi, ishga tushiradi.
- **Tekshiruv:** ikkala labirintda yulduzda, urilmadi (avto).
- **Xatoda:** 8-qadamdagidek; ikki `repeat` qo'yib sig'masa — Ortiqvoy «Joy qolmadi!» («Dasturga 5 ta blok sig‘adi. Ikki shartni bitta repeat ichiga sig‘diring»).

## 12 · Xulosa: shart

- **Vaqt:** 0:36–0:38 (2 daqiqa)
- **Bekat:** 2 · Ikki shart
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: shart»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Shart». Coddy: «Avval tekshiraman, keyin yuraman.» Ikki karta: «Shart — Ha bo‘lsa, ichidagisi bajariladi» (`if` rasmi, yonida «✓ ha» va «✕ yo‘q») va «if path → then — Agar o‘ngda yo‘l bo‘lsa» (`if path → then` ichida `move right` bloki); o'ngda 10-qadamdagi ikki labirint — zinapoyalarning oltin izi.
- **Tayanch gaplar:**
  1. «Shart — tekshiriladigan narsa: yo‘l bormi?»
  2. «Ha bo‘lsa — ichidagisi bajariladi. Yo‘q bo‘lsa — bajarilmaydi.»
- **O'z so'zi bilan:** bitta dastur ikki xil labirintda ishladi — chunki har safar tekshirdi; vaziyatga qarab har xil ish: bir joyda o'ngga, boshqa joyda tepaga, devor oldida — to'xtadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:38–0:39 (1 daqiqa)
- **Bekat:** 3 · Xatoni topamiz
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: xatoni topamiz»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Xatoni topamiz miltillaydi. Coddy: «Oxirgi bekat: dasturdagi xatoni topamiz.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — xatoni topamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: xatoni topamiz

- **Vaqt:** 0:39–0:41:30 (2,5 daqiqa)
- **Bekat:** 3 · Xatoni topamiz
- **Ekran:** proyektor — Blok studiya (ustoz, ikki labirint) · bola «Ustoz ekraniga qarang» («Ustoz xatoni topyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Xato qayerda?». Ikki labirint (N14): Coddy o'ng chetda, yulduz chapda — 1-labirintda 2 katak, 2-labirintda 5 katak. Dasturda tayyor: `repeat 2` ichida `if path ← then`, uning ichida `move left` — «3 ta blok».
  2. «▶ Ishga tushir»: 1-labirint — yetdi, «✓»; 2-labirint — 2 qadam, yulduzgacha 3 katak qoldi; Kamvoy «Oz qoldi!» («2-labirintda yulduzgacha yetmadi…»).
  3. Ustoz ko'rsatadi: qayerda to'xtadi — 2-labirintda; o'sha joyda dasturni o'qiydi: shart tomoni — chap, ichidagi blok — chapga, son — 2: atigi ikki marta tekshiradi. Sonni «5» ga almashtiradi.
  4. «▶ Ishga tushir»: ikkalasida yetdi — «Xatoni tuzatdingiz!».
- **Tayanch gaplar:**
  1. «Avval ishga tushiramiz: qaysi labirintda, qayerda to‘xtadi?»
  2. «Keyin dasturni o‘qiymiz: shart tomoni, ichidagi blok, son. Xato shulardan birida.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** 2-darsdagi «Xatoni topamiz»ni eslatadi — u yerda bloklar tartibi edi, bugun shartda ham xato bo'ladi; xatoni topish — dasturchining kundalik ishi.
- **Ustoz qiladi:** ishga tushiradi, sonni almashtiradi, yana ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Xatoni topamiz: pog'onalar

- **Vaqt:** 0:41:30–0:54 (12,5 daqiqa)
- **Bekat:** 3 · Xatoni topamiz
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Xatoni tuzating!». Coddy: «Avval ishga tushiring — qayerda to‘xtaganiga qarang.» Chapda katta son «Uch xatoni tuzatdi 6 / 14» va belgilar; o'ngda pog'onalar: 1 «Qimirlamaydi» · 2 «Yulduzdan keyin» · 3 «Darrov urildi» · ★ «O‘z sayringiz» (nomlar — bola ishga tushirganda ko'radigan belgi; xato turi aytilmaydi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Har pog‘onada tayyor dastur bor, unda bitta xato. Avval ishga tushiring.»
  2. «Qayerda to‘xtadi? O‘sha joyda shartni va ichidagi blokni o‘qing.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** barmoq bilan dasturni o'qitadi: «Bu if qaysi tomonni tekshiryapti? Ichida qaysi tomonga yuradi?»; 2-pog'onada qahramon yulduzga yetib, keyin urilishini sinf bilan muhokama qilmaydi — bola o'zi ko'rsin; ★ da «Qahramoningiz bog‘da qayerga boradi — oldindan o‘ylab ko‘ring».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; 1–3-pog'onada dasturda tayyor bloklar (xatoli); sahnada ikki labirint; tasma yonida «N / M ta blok». Hamma pog'onada ishora boshida: «Ishga tushiring — qayerda to‘xtaydi?».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Qimirlamaydi», ostida «Bitta xatoni toping.». Labirintlar 3 · 1; dastur: `repeat 7` ichida `if path ↑ then`, uning ichida `move right`; 3 ta blok. «Maslahat»: «Shart qaysi tomonni tekshiryapti? Qahramon qaysi tomonga yurishi kerak?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Yulduzdan keyin», ostida «Bitta xatoni toping.». Labirintlar 3 · 2; dastur: `repeat 8` ichida `if path → then` (ichida `move right`) va `move up`; 5 ta blok. «Maslahat»: «Qaysi blok urildi? U yurishdan oldin yo‘lni tekshiradimi?»
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Darrov urildi», ostida «Bitta xatoni toping.». Labirintlar 3 · 3; dastur: `repeat 8` ichida `if path ↓ then` (ichida `move down`) va `if path → then` (ichida `move down`); 5 ta blok. «Maslahat»: «Har if ni o‘qing: qaysi tomonni tekshiradi, ichida qaysi tomonga yuradi?»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «O‘z sayringiz», ostida «Shart bilan bog‘da sayr qiling.». Sayr bog'i — bitta labirint, yulduzsiz, qahramon o'rtada; dastur bo'sh; 12 ta blok. «Maslahat»: «Ikki if qo‘ying — har xil tomonga. Qahramon qayerga borishini oldindan o‘ylang». Erkin ijod (36-qaror).
  1–3-pog'onada ikkalasida yetsa: «Xatoni tuzatdingiz!» va konfeti; ★ da: «Sayringiz tayyor!».
- **Bola qiladi:** tayyor dasturni ishga tushiradi, qayerda to'xtaganini ko'radi, shartni yoki blokni almashtiradi (tomonni bosib tanlaydi, blokni «✕» bilan olib tashlab yangisini qo'yadi), qayta ishga tushiradi; ★ da o'z sayrini tuzadi.
- **Tekshiruv:** 1–3 — dastur ikkala labirintda yulduzga yetdi, urilmadi (avto; bola dasturni o'chirib, yangidan tuzsa ham qabul qilinadi — natija bas, 2-darsdagidek). ★ — kamida ikki `if` (har xil tomonga), devorga urilmadi, qahramon kamida 4 katak yurdi.
- **Xatoda:** 8-qadamdagidek (To'siqvoy «Devor!» — ikki holati, Kamvoy «Oz qoldi!», Ortiqvoy «Joy qolmadi!», Bo'shvoy); ★ da shart bajarilmasa — Kamvoy «Oz qoldi!» («Ikki if qo‘ying — har xil tomonga» yoki «Qahramon kam yurdi. Boshqa tomonlarni tekshiring»).

## 16 · Dasturingizni o'qib bering

- **Vaqt:** 0:54–0:59 (5 daqiqa)
- **Bekat:** 3 · Xatoni topamiz
- **Ekran:** proyektor — Blok studiya (ustoz, Sayr bog'i, dastur bo'sh) · bola — o'z oxirgi yechgan pog'onasi, o'z dasturi bilan (A·1; hech narsa yechmagan bolada — «Ustoz ekraniga qarang»)
- **Sahna:** 12-bo'lim 3-band: bola dasturini ovoz chiqarib o'qiydi («repeat 8: if path → then move right; if path ↑ then move up»), ustoz o'sha bloklarni Sayr bog'ida qo'yadi va ishga tushiradi. Bolaning dasturi boshqa labirint uchun yozilgan bo'lsa ham bog'da devorga urilmaydi — hamma yurish shart ichida (jadval, 16-qator): sinf «bu qoida yangi joyda nima qiladi» ni ko'radi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Dasturingizni o‘qib bering». Sayr bog'i, Coddy o'rtada; dastur bo'sh. Coddy: «Siz o‘qiysiz — men bog‘da yuraman.»
  2. Bola o'qiydi; ustoz `repeat` qo'yadi, sonni tanlaydi, `if` larni, tomonlarni va ichidagi bloklarni qo'yadi; «▶ Ishga tushir» — sinf Coddy qayerga borganini ko'radi.
  3. Ikki-uch bola (★ ni bajarganlar birinchi).
- **Tayanch gaplar:**
  1. «Kim dasturini o‘qib beradi? Avval repeat soni, keyin har if: qaysi tomon, ichida nima.»
  2. «Kuzating: bu dastur bog‘da qayerga boradi?»
- **O'z so'zi bilan:** bolani maqtaydi; shartsiz `move` bo'lsa va Coddy urilsa — «Ko‘rdingizmi: tekshirmagan blok yangi joyda devorga uriladi».
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, ishga tushiradi.
- **Parta:** o'z oxirgi yechgan pog'onasi («Dasturingizni ustozga o‘qib bering»); shu ekranda qayta ishga tushirsa natija qayta sanalmaydi.
- **Bola qiladi:** dasturini o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:59–1:02 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Qahramon devor oldida to‘xtaydi!». Bugungi so'z: «Shart — Ha bo‘lsa, ichidagisi bajariladi». Pastda: ✓ Devorgacha · ✓ Ikki shart · ✓ Xatoni topamiz. Kichik karta «Keyingi dars · 9 · Labirint o‘yini».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: devorgacha, ikki shart, xatoni topamiz.»
  2. «Bugungi so‘z — shart: ha bo‘lsa, ichidagisi bajariladi.»
  3. «Keyingi darsda harakat, shart va tugmalardan o‘yin yasaymiz — labirint o‘yini.»
- **O'z so'zi bilan:** «shart» nimaligini bolalardan aytdiradi; ikki-uch boladan qaysi xatoni topgani so'raladi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Qahramon devor oldida to‘xtaydi!». Coddy o'rniga qahramon: «Har qadamdan oldin yo‘lni tekshirdingiz.» «Siz bugun»: N ta shart qo‘ydi · N ta labirintdan o‘tdi · N ta xato tuzatdi (haqiqiy son; **KOD**). O'z qahramoni oxirgi yechgan labirintida, oltin izi bilan; «Keyingi darsda labirint o‘yinida ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:02–1:05 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta shart qo‘ydi · N ta labirintdan o‘tdi · N ta xato tuzatdi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda labirint o‘yini bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Robot-changyutgich ham shunday ishlaydi: avval tekshiradi, keyin yuradi.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–7-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 5-qadam: «Keyingi»ni bola o'zi bosadi (bo'laklar birma-bir yonadi).
- 7, 10-qadam (ustoz ko'rsatadi): dastur to'liq tayyor turadi (10-qadamda — ikki shart bilan), bola o'zi «▶ Ishga tushir»ni bosadi.
- 14-qadam: xatoli dastur tayyor; bola ishga tushiradi, ishora «repeat sonini kattaroq qiling va qayta ishga tushiring» — sonni o'zi almashtiradi.
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-008-shart-v1` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Tekshiruvchi» (`tekshiruvchi`) — 8-qadamda 1-pog'ona bajarildi (birinchi shartli dastur); «Izquvar» (`izquvar`) — 15-qadamda 1-pog'ona bajarildi (birinchi tuzatilgan xato).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk (ikki labirint). Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating, keyin bolalar o'zi bajaradi.
- Yangi blok: `if path → then` — agar o'ngda yo'l bo'lsa, unda. Yangi oila — Shart (kulrang-ko'k). Birinchi chiqqanda bir marta ayting; tomonni bosib tanlashni va blokni `if` **ichiga** qo'yishni sekin ko'rsating: javondan `if` bossangiz — u tanlanadi, keyin bosgan `move` ingiz uning ichiga tushadi; ikkinchi `if` uchun birinchisini bosib tanlang — yangisi undan keyin tushadi.
- Bugungi asosiy fikr bitta: **dastur har qadamdan oldin tekshiradi — yo'l bo'lsa yuradi, devor bo'lsa turadi; shuning uchun bitta dastur har xil labirintda ishlaydi.** Hukda, xulosada va 16-qadamda (bog'da) chiqadi.
- Bugun har topshiriqda ikki labirint: dastur avval 1-da, keyin 2-da yuradi. Bola «1-labirintda ishladi-ku» desa — ikkinchisini ko'rsating: sanab yozilgan dastur faqat bittasiga to'g'ri keladi.
- `repeat` soni — uzunroq yo'lga yetadigan; ortiqchasi zarar qilmaydi (shart «yo‘q» beradi, qahramon turadi). «Qancha qo‘yay?» desa — «uzun yo‘lni sanang».
- 3-bekatda dasturni o'chirib yangidan yozish ham qabul qilinadi, lekin avval «qayerda to‘xtadi?» deb so'rang — xatoni o'qib topish bugungi tekshiruv.
- 16-qadamda bolaning ismi proyektorga chiqmaydi: bola dasturini o'zi o'qiydi, siz bosasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **Shart oilasi va `if path → then` bloki** — Blockly C-blok (`repeat` kabi: tepasi va pasti ulanadi, ichiga bloklar); tomon maydoni JrSon ro'yxati → ← ↑ ↓ (4-darsdagi `BL_TUGMALAR` ning to'rt strelkasi, space'siz; oq kapsula, strelkasiz); rang — «Savollar» 4; `BL_TUR` ga yangi tur (masalan 'a'); javonda `if path →` (`data-yon`). `blTugun` / `blIchma` / `blQur` / `blIchiBosh` — `if` ham (ichki + tomon).
2. **Ijro:** tugun `{ tur: 'a', yon, ichki }`. `ijroTartibi(daraxt, belgi = true)` `if` tugunini beradi; `ijro` uni sahnaga tekshirtiradi (`t.ha = sahna.shart(h, yon)`), generator davom etganda `t.ha` bo'lsa ichkiga kiradi (for-of tanasi generatordan oldin ishlaydi — natija o'z vaqtida tayyor). Belgisiz (blok sanog'i, natija) — ichki bir marta sanaladi, hozirgidek. «Yo‘q» bo'lsa ichidagi bloklar yonmaydi.
3. **Katak sahnasida `shart(h, yon)`:** keyingi katak devor emas (labirintdan tashqari va yopiq eshik — devor); ko'rinish 0,35 soniya: tekshirilgan katak hoshiyasi (yo'l — oltin) yoki buta silkinishi; `if` yonida «✓ ha» / «✕ yo‘q»; tovushsiz, sakrashsiz.
4. **Ikki labirint (egizak):** topshiriqda ikki xarita; sahnada yorliq «1», «2»; joylashuv — katak kattaroq chiqadigani (ustma-ust yoki yonma-yon); dastur navbat bilan (2-labirint oldidan qahramon startda, bloklar belgisi tozalanadi); har labirint yonida «✓» / «✕»; birinchisida o'tmasa ikkinchisi yurmaydi; baho — ikkalasi «yetdi»; muammocha gaplarida labirint raqami; `gap.yetdi` «Ikkalasida yetdi!». Huk kartalari ham ikki labirintda (A: «1» ✓, «2» ✕).
5. **Bosib ichiga qo'yish `if` ga:** javondan `if` — dastur oxiriga yoki tanlangan `repeat` ichiga, o'zi tanlanadi; tanlangan `if` + javondan `move` — ichiga; tanlangan `if` + javondan `if` — undan keyin (o'sha daraja), yangisi tanlanadi; javondan `repeat` — doim tashqariga.
6. **Muammochalar:** To'siqvoy ikki gapi (shartsiz blok / shart boshqa tomon — urilgan blokning ota `if` i va tomoni bo'yicha); Bo'shvoy — ichi bo'sh `if`; Kamvoy va To'siqvoy gaplarida «N-labirint».
7. **Tayyor dasturlar `if` bilan** (10, 14, 15 · 1–3) — `blQur` ro'yxatida `{ t: 'a', yon, ichki }`.
8. **Erkin sayr (15 · ★):** bitta labirint, yulduzsiz; tayyor — kamida ikki `if` har xil tomonga, urilmadi, kamida 4 qadam; «Sayringiz tayyor!»; Kamvoy gaplari (yuqoridagi jadval).
9. **5-qadam ko'rinishi** — uch holat oldindan chiziladi (`raqam` ishi): ✓ ha / ✕ yo‘q / `repeat` ichida sanoq bilan.
10. **Natija va yutuqlar** — `DARS.natija`: «ta shart qo‘ydi» (muvaffaqiyatli dasturlardagi `if` bloklari), «ta labirintdan o‘tdi» (yulduzga yetilgan har labirint; yangi hisob — pog'onada 2 tagacha, eng ko'pi 22), «ta xato tuzatdi» (15 · 1–3, 2-dars shakli — ekran ro'yxati); yutuqlar `tekshiruvchi`, `izquvar`. 16-qadam — A·1 (`'oxirgi'`, mavjud); proyektorda Sayr bog'i.
11. **Simulyatsiya sinovi** `sinov/dvigatel/shart.mjs` — yuqoridagi jadvaldagi har yechim, eng kam son va xato varianti (5-darsdagi `takror.mjs` kabi).

## Savollar (tavsiya — A)

1. **Shart turi — A: «yo‘l bormi» (`if path → then`, tomon ro'yxatdan).** Sabab: ichiga faqat yurish qo'yiladi — «yo‘l bo‘lsa — yur»; else'siz ham to'liq ma'no beradi; qahramon devorga urilmay, devor oldida to'xtaydi (dastur natijasi va 7-dars va'dasi aynan shu); 9-darsdagi o'yinda `when → key pressed` → `if path → then` → `move right` — strelka bosilganda ham urilmaydi. **B** — «devor bormi» (`if wall → then`): «devorga tegsa» so'zma-so'z, lekin ichiga boshqa tomonga yurish qo'yiladi va undan keyingi blok baribir bajariladi — else'siz yechimlar chalkash (devorda tepaga, keyin baribir o'ngga), o'yinda urilishni to'xtatmaydi. **C** — maydonda «yulduzda bo‘lsa» / «olma ustida bo‘lsa»: devor yo'q — dastur natijasiga («devorga tegsa…») mos emas.
2. **«Aks holda» (else) — yo'q; faqat «agar … unda».** «Yo‘q bo‘lsa — bajarilmaydi» yetadi; else — 56-darsda, JavaScript'dagi `if / else` bilan. B — `if … else` bloki 2-bekatda (ikki og'izli blok — 9 yoshliga birinchi darsda og'ir, dastur ustuni ham uzayadi).
3. **Har topshiriqda ikki labirint, dastur bitta — navbat bilan (avval 1, keyin 2).** Sabab: shart kerakligini halol ko'rsatadi — bitta labirintda sanab yozish ham ishlaydi, ikkitasida — yo'q; «vaziyatga qarab har xil ish» ko'zga ko'rinadi. B — ikkalasida bir vaqtda (ikki qahramon birga yuradi — chiroyli, lekin dasturda bitta blok bir labirintda bajarilib, ikkinchisida bajarilmaydi — qaysi blok yonayotgani chalkashadi). C — bitta labirint va blok chegarasi (shartsiz ham yechiladi — shartning ma'nosi yo'qoladi).
4. **Shart oilasi rangi — kulrang-ko'k (#5B80A5 atrofida — Blockly'ning o'z «Logic» rangi; MakeCode'da ham shart shu rangda, takrorlash esa yashil — 5-dars bilan mos).** Band ranglar: ko'k — Harakat, binafsha — Gap, to'q sariq — Hodisa, yashil — Takrorlash, feruza — Ko'rinish, pushti — Tovush (7-dars), magenta — Ortiqvoy, coral — tugma va tanlov, sariq — «bajarilyapti», oltin — iz. B — salatrang (#8DBF2E — yorqin, lekin «yashil» bilan adashishi mumkin). C — Takrorlash bilan bitta oila (Scratch'dagi «Boshqaruv» — 5-darsdagi oila nomi o'zgaradi).
5. **Blok yozuvi — `if path → then`** (Scratch «if … then» kabi; «unda» dastur nomida bor). B — `if path →` (qisqa — ichma-ich dasturga osonroq sig'adi, «then» yo'qoladi). C — `if path right then` (so'z bilan — 4-darsdagi `when → key pressed` strelka bilan, mos emas).
6. **Tekshiruv ko'rinishi — `if` yonida «✓ ha / ✕ yo‘q», tekshirilgan katak 0,35 soniya yonadi, tovushsiz.** B — tovush bilan («tik» — lekin 13-band: tovush — qadam belgisi, tekshiruv qadam emas). C — faqat katak (belgi yo'q — «ha / yo‘q» so'zi ko'rinmaydi).
7. **16-qadam — proyektorda Sayr bog'i** (bola o'z labirinti uchun yozgan dastur yangi bog'da urilmay yuradi — bugungi fikrning eng yaxshi isboti; dvigatelga yangi narsa kerak emas). B — ustoz panelida xarita tanlash (bolaning o'z pog'onasi labirintlari; KOD ko'proq).
8. **Erkin ijod — 3-bekatning ★ pog'onasi «O‘z sayringiz»** (36-qaror; shart: ikki `if` har xil tomonga, urilmasin, kamida 4 qadam; 16-qadamda sinfga o'qib beriladi). B — ★ ham yopiq masala (97-qaror istisnosi; erkin ijod 9–10-darsga — o'z labirinti bilan).
9. **Bekatlar tartibi — Devorgacha → Ikki shart → Xatoni topamiz** (dastur tekshiruvi «xatoni topish» oxirgi bekatda; xatolar ikki shartli dasturda ham bo'ladi). B — 2-darsdagidek xato o'rtada: Devorgacha → Xatoni topamiz → Ikki shart (xatolar faqat bitta shartli dasturda).
10. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi natija 11:30–12-daqiqada — chegarada; huk uzaysa, 5-qadamni qisqartirish kerak. Ikki labirint bilan har ishga tushirish 2 barobar uzoq (8 · ★ da ~15 soniya) — sinfda o'lchanadi.
2. Ikki labirint sahnaga sig'adimi: 7 × 4 lik ikki labirint ustma-ust yoki 3 × 6 lik ikkitasi yonma-yon — kataklar kichrayadi, qahramon proyektorda ko'rinadimi (setka darvozasi).
3. Dastur ustuni: 11 · ★ — 10 blok, uch qavat (`repeat` → `if` → `move`), `if path → then` uzun yozuvi bilan — sig'adimi, shrift kichraymaydimi (5-darsdagi 11 · ★ dagidek o'lchanadi; sig'masa — «Savollar» 5-B).
4. Huk: B «Ko‘p yuramiz» kuchli taxmin («devorda baribir to‘xtaydi») — yaxshi; C kartasi yangi blok rasmini ko'rsatadi — sinf haqiqatan bo'linadimi (12-bo'lim 25-band).
5. «Yo‘q» safarlar: `repeat` soni katta bo'lsa, qahramon yulduzda turib qoladi, sanoq esa davom etadi — bola «buzildi» deb o'ylashi mumkin; «✕ yo‘q» belgisi yetarlimi — sinfda ko'riladi.
6. 15 · 2: qahramon yulduzga yetadi, keyin urildi — «yetdi-ku» degan e'tiroz bo'lishi mumkin; dvigatel urilishni baribir muvaffaqiyatsiz deb biladi (2-dars qoidasi: dastur urilmay tugasin). Ustoz tushuntiradi: dastur hali tugamagan edi.
7. 16-qadam: bolaning dasturida shartsiz `move` bo'lsa, Sayr bog'ida urilishi mumkin — bu ataylab (ustozning «O'z so'zi bilan» gapi), lekin bola uchun noqulay bo'lmasinmi.
8. 15 · 3 ning tuzatilgani 11 · 1 ning teskari tartibli varianti, 15 · 2 niki — 10-qadamdagi ustoz dasturi; bola ularni yangidan yozmaydi (bitta blokni almashtiradi), lekin sinfda «buni qilgandik-ku» degan taassurot bo'lishi mumkin.
9. Bosib ichiga qo'yish: tanlangan `if` ga yangi `if` — ichiga emas, undan keyin; 9 yoshli shu farqni tushunadimi (5-darsdagi «tanlangan repeat ga repeat — tashqariga» bilan bir xil mantiq).
10. Rang (kulrang-ko'k) proyektorda Harakat ko'kidan ajraladimi — etalon ranglar bilan solishtiriladi.
11. 7-dars hali qurilmagan; 1-qadamdagi «O‘tgan darsda» kartasi 7-dars manbasidan («Animatsiya — Kostyumlar navbat bilan almashadi»). 9-dars manbasi yo'q — «Keyingi dars · 9 · Labirint o‘yini» nomi DASTUR'dan; 9-darsda `when … key pressed` + `if path … then` birikmasi kutiladi (1-savol shunga tayyorlaydi).
12. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (20.11 — dars papkasi `../darslar/008-shart/`; manba savollari — tavsiya A bo'yicha)

1. **Dvigatel (KOD 1–7, 10):** Shart oilasi (kulrang-ko'k #5B80A5) va `if_path` C-bloki (tomon — JrSon → ← ↑ ↓); ijrochi `if` tugunini beradi, sahna tekshirgach (`t.ha`) «ha» bo'lsa ichiga kiradi (`ijroTartibi`); labirint sahnasida `katakShart` — tekshirilgan katakda vaqtinchalik ramka (yo'l — oltin, devor — uzuq qizil; statik chizma o'zgarmaydi), blokda «✓ ha» / «✕ yo‘q»; tekshiruv 0,35 soniya (qadam emas). Javon: tanlangan takrorlash + if — ichiga, tanlangan if + if — undan keyin; C-blok tanlovi javon bosilganda saqlanadi (sinov topgan xato).
2. **Ikki labirint bir oynada** (`.egiz`: keng labirintlar ustma-ust, tiklari yonma-yon; har birida «1» / «2» yorlig'i va ✓ / ✕); dastur avval 1-, yetsa 2-labirintda. Faol labirint DOM'da birinchi, ko'rinish tartibi CSS `order` bilan. Huk kartalari ham egizakda (`data-daraxt` — ichma-ich dastur).
3. **Muammocha gaplari** manbadagidek: To'siqvoyning ikki gapi (urilgan blokning ota shart bloki bo'yicha), «N-labirintda yulduzgacha yetmadi…», ichi bo'sh if, erkin sayr (kamShart / kamYurdi); 2-bekatda «Joy qolmadi!» ishorasi — topshiriq bo'yicha (`TOP.joyQolmadi`).
4. **Natija:** «ta shart qo‘ydi» — dasturdagi shart bloklari (har biri bir marta; birinchi qurishda takrorlash aylanishlari ham sanalardi — to'liq dars sinovi ushladi), «ta labirintdan o‘tdi» — egizakda 2 ta (sayr sanalmaydi), «ta xato tuzatdi» — 15 · 1–3.
5. **Solo:** 7-qadamda dastur tayyor; 10-qadamda ikki shart bilan to'liq tayyor (ikkinchi shart `.solo-faqat` — jonli darsda olib tashlanadi, ustoz o'zi qo'shadi); 14-qadamda ishora «repeat sonini kattaroq qiling va qayta ishga tushiring».
6. **Setka:** 5-qadam qatorlari ixchamroq; 1-qadamdagi «O‘tgan darsda» — kichik kostyum belgisi; 11-qadam doskasida «Har belgi — …» izohi (ish zonasi bo'sh qolardi).
7. **Sinovlar:** `sinov/dvigatel/shart.mjs` 38/38 (mustaqil labirint simulyatori), `008-toliq-dars.mjs` 45/45 (natija: 24 · 22 · 3, 4 · 6 · 1, 28 · 28 · 4), `008-solo.mjs` 30/30, `008-tovush.mjs` 4/4, setka toza, matn — qolgani meta/dinamik.

