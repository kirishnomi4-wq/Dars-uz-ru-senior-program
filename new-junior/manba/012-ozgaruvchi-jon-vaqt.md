# 12-dars. O'zgaruvchi: jon va vaqt

> **Holat: v1.1 — QURILDI (21.11 tun, avtopilot: «Savollar» 1–10 tavsiya A bo'yicha; qurishda qabul qilingan qarorlar — oxirida, «Qurishdagi qarorlar» 1–13). Foydalanuvchi ko'rigi kutilmoqda — QA saytda «ko‘rikda».** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/012-ozgaruvchi-jon-vaqt/`) shundan quriladi. Dars 11-dars manbasining (`011-ozgaruvchi-ball.md`) davomi: o'sha o'yin, o'sha O'zgaruvchi oilasi. Eng muhimi — 1-savol (vaqt — soniya emas, **qadamlar**) va 2-savol (shart bloki `if jon = 0 then` — 8-darsdagi `if … then` ramkasi).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–11-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 12-dars («O'zgaruvchi: jon va vaqt» — natija: jon tugasa «O'yin tugadi» chiqadi; o'rganadi: bir nechta o'zgaruvchini shart bilan ishlatadi; nega: o'zgaruvchi va shart birga ishlashini ko'rish; tekshiruv: avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Har topshiriq manba yozilganda kichik dastur bilan simulyatsiya qilindi (natija jadvalda: eng qisqa yo'l kaktusga tegmay, yakuniy ball, jon va qadam, o'yin qaysi bosishda tugashi, xato variantlari); dars qurilganda sinov — `sinov/dvigatel/ozgaruvchi.mjs` ga 12-dars qismi (**KOD**).
> **Shart bu darsda kam va bir xil shaklda:** faqat ikki qoidada — `if jon = 0 then` va `if qadam = 0 then`, ichida doim `game over`. Ramka — 8-darsdagi `if … then` (Shart oilasi, C-blok); 8-darsning shart nomi o'zgarsa, faqat ramka yozuvi o'zgaradi. 9-darsdagi `when any key pressed` faqat 3-bekatda.

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** jon tugasa «O‘yin tugadi» chiqadi. **Bu manbada:** 11-darsdagi olma terish o'yiniga kaktuslar qo'shiladi. Kaktusga tegsa — jon kamayadi (`when touching cactus` ostida `change jon by -1`); jon 0 bo'lsa — shart: `if jon = 0 then` ichida `game over`, sahnada katta yozuv «O‘yin tugadi». **Vaqt — qadamlar** («Savollar» 1): har bosishda `qadam` bittaga kamayadi, 0 bo'lsa ham o'yin tugaydi.
- **Bola nimani tushunadi:** bitta o'yinda bir nechta o'zgaruvchi bo'ladi — har birining o'z nomi va o'z soni (`ball`, `jon`, `qadam`). O'zgaruvchi kamayishi ham mumkin: `change jon by -1`. Shart o'zgaruvchining sonini tekshiradi: «jon 0 ga tengmi?» — «ha» bo'lsa, o'yin tugaydi; «yo‘q» bo'lsa — davom etadi. Bitta hodisa bir nechta o'zgaruvchini o'zgartira oladi (kaktus — jonni ham, ballni ham).
- **Tekshiruv (dasturdan):** avto. 1-bekatning 1–2-pog'onasida va 3-bekatning 1-pog'onasida bola o'z qoidasini **sinaydi**: ataylab kaktusga tegadi (yoki qadamni tugatadi) — o'yin jon (qadam) aynan 0 bo'lganda tugashi kerak: na erta, na kech. Qolgan pog'onalarda o'yin yutildi va o'zgaruvchilar aytilgan sonda; dasturda jon (qadam) qoidasi bor.
- **Vaqt:** reja 63 daqiqa, zaxira 17–27 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi o'yinlarga.
- **Uch bekat:** 1 · Jon — 2 · Ball va jon — 3 · Qadam. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror).
- **Oldingi darslar bilan bog'lanish:** 11-dars — o'zgaruvchi `ball`, `set` va `change`, `when ▶ clicked`, `when touching apple`, son o'yindan o'yinga saqlanishi; yakunidagi va'da: «Keyingi darsda o‘yinda jon bo‘ladi: jon tugasa — o‘yin tugaydi.» 8-dars — shart (`if … then`, «ha / yo‘q»); 9-dars — o'yin qoidasi va `when any key pressed`; 4-dars — o'yin rejimi. Bu dars 11-darsdagi bog' maydonida, o'yin rejimida.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, maydonni, kaktusni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–8 | Savolga javob beradi: Coddy'da 3 ta jon — jon tugaganda o'yinni qanday tugatamiz? Sinf uchalasini sinaydi: «tegsa — tugasin» — birinchi tegishda tugaydi, «jonni kamaytiramiz» — jon −1 bo'ladi-yu o'yin davom etadi, «kamaytirib, tekshiramiz» — jon 0 da tugaydi. Javob va yangi so'z: jon | 2–5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz jon qoidasini ko'rsatadi: `change jon by -1`, `if jon = 0 then`, `game over` | 7 |
| 10:30–21 | Jon qoidasini tuzadi va sinaydi; keyin kaktuslar orasidan yulduzga boradi | 8 |
| 21–24 | Ustoz bitta o'yinda ball va jonni ko'rsatadi | 9–10 |
| 24–35 | Ball va jon bilan o'ynaydi: oltin olma jon beradi, kaktus ballni ham oladi, ★ bitta jon bilan 10 ball | 11 |
| 35–37 | Xulosa: jon — o'zgaruvchi, shart uni tekshiradi | 12 |
| 37–52 | Ustoz qadam qoidasini ko'rsatadi; bola qadam qoidasini tuzadi, qadam tugamasdan yutadi, ★ da o'z o'yinining sonlarini tanlaydi | 13–15 |
| 52–57 | O'yinining qoidalarini sinfga o'qib beradi — ustoz Coddy bilan o'ynaydi | 16 |
| 57–63 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: 3 ta blok, to'rt bosish — qoida ishladi) — 12–13-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida; chegarada — "Tekshirilmagan joylar" 1).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| jon | o'yinchining qolgan imkoniyati; o'zgaruvchi — 0 bo'lsa, o'yin tugaydi | 5 (va 12, 17) | uch bo'lak birma-bir: kapsula «jon: 3» va uchta yurakcha → Coddy kaktusga tegadi, `change jon by -1` yonadi — «jon: 2», bitta yurakcha xira → yana ikki tegish — «jon: 0», `if jon = 0 then` yonida «✓ ha», katta yozuv «O‘yin tugadi» |

Yordamchi so'zlar (ta'rifsiz, tushunarli): kaktus, tegish, kamayadi, minus, teng, o'yin tugadi, qoida, qadam, istalgan tugma. 1–11-darsdan: blok, dastur, dasturcha, qahramon, yulduz, olma, oltin olma, katak, maydon, hodisa, tugma, strelka, o'yin, yutish, shart, ha, yo'q, o'zgaruvchi, ball, son, pog'ona.
Bir ma'noga bitta so'z: «jon» (o'zgaruvchi va o'yin so'zi; «hayot», «yurak» deyilmaydi — yurakcha faqat 5-qadam rasmida); «kamayadi» (manfiy son bilan `change`: «jon bittaga kamayadi»; «ayiriladi», «tushadi» deyilmaydi; ustoz −1 ni «minus bir» deb o'qiydi); «teng» (`=` — «jon 0 ga teng»; «barobar» deyilmaydi); «o‘yin tugadi» (`game over` va sahnadagi yozuv; «yutqazdingiz», «mag‘lub» deyilmaydi); «tegish» (kaktusga — 9-darsdagi «tegdi» bilan bir so'z; «urilish» deyilmaydi); «qadam» (bitta bosish — bitta qadam, 1-darsdan; o'zgaruvchi `qadam` — qolgan qadamlar; «yurish», «vaqt» deyilmaydi — «Savollar» 1); «qoida» (9-darsdagidek: o'yinda nima bo'lishini aytadigan shart — «jon qoidasi», «qadam qoidasi»).
Bu darsda AYTILMAYDI (keyingi darslarniki): tasodifiy son (13-dars), «yoki», «va» (ikki shart birga), «katta», «kichik» (`<`, `>` — 55-dars), «aks holda» (else), «forever», soniya va taymer («Savollar» 1-B tanlansa — kiradi), «qiymat», o'zgaruvchi yaratish, «daraja» bilan o'zgaruvchi.

## Maydon, o'yin va bloklar

**Maydon va o'yin** — 11-darsdagidek: bog' (7 × 5, X va Y, bezak — daraxtlar (1, 1) · (4, 3) · (6, 1), gullar (0, 4) · (2, 3) · (5, 4) · (6, 3), devor emas), «▶ Boshlash» / «■ To‘xtatish», olmalar terilgach yashirin yulduz chiqadi (olmasiz pog'onada yulduz boshidan ko'rinadi), boshqaruv tayyor qatorda («Boshqaruv: → ← ↑ ↓»), o'yinning o'z olma hisobi yo'q. Hech qaysi start, olma, oltin olma, kaktus va yulduz bezak kataklarida va (1, 2) da emas — simulyatsiyada tekshirildi.
**Kaktus** (**KOD**, «Savollar» 5): maydonda yangi narsa. Qahramon kaktus katagiga o'ta olmaydi — joyidan qo'zg'almaydi, turtiladi, «tuk» (devordek, 9-dars); shu lahzada `when touching cactus` dasturchasi ishlaydi. Har urinish — bitta tegish. Kaktus joyida qoladi.
**Sahnadagi sonlar:** chap yuqorida ostma-ost kapsulalar — dasturda ishlatilgan har o'zgaruvchi: «ball: 0», «jon: 3», «qadam: 12» (11-darsdagi kapsula, **KOD**: bir nechta). Kamayganda qahramon ustida «−1» uchadi. Har pog'ona o'zgaruvchilar 0 bilan ochiladi — sonni o'yin boshida `set` qo'yadi.
**O‘yin tugadi** (**KOD**): `game over` bajarilganda o'yin shu zahoti to'xtaydi — qolgan bloklar bajarilmaydi; sahnaning yuqori qismida katta yog'och taxta «O‘yin tugadi» (qahramonni yopmaydi), «■ To‘xtatish» yana «▶ Boshlash» bo'ladi. Bu muammo emas — yana o'ynasa bo'ladi.
**Bitta bosishda tartib** (9-darsdagidek, **KOD**): 1) bosilgan strelkaning dasturchasi — qahramon yuradi yoki kaktusga tegadi; olma terilsa yoki kaktusga tegilsa — shu zahoti `when touching …` dasturchasi; 2) `when any key pressed` dasturchasi; 3) tekshiruv: hamma olma terilgan va qahramon yulduzda — yutdi. Shuning uchun `qadam` 0 bo'lgan bosishda qahramon yulduzga yetsa ham — o'yin tugadi: «qadam: 12» — 11 ta bosish («Savollar» 7).

**Bloklar** — to'rt oila: O'zgaruvchi (jigarrang, 11-dars), Shart (kulrang-ko'k, 8-dars; yangi blok), Hodisa (to'q sariq; yangi blok va yangi tur) va Harakat (ko'k; boshqaruv ichida). Gap, Takrorlash, Ko'rinish, Tovush javonda yo'q.

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `change jon by -1` | jonga minus bir qo'sh — jon bittaga kamayadi | 11-darsdagi `change`; o'zgaruvchi ro'yxatida endi `ball`, `jon`, `qadam`; son ro'yxatida −3, −2, −1 ham (**KOD**) | 11-darsdan; jon va minus — 7-qadam |
| `when touching cactus` | kaktusga tekkanda | 11-darsdagi `when touching apple` ning yangi turi: tur ro'yxati `apple` · `gold apple` · `cactus` (**KOD**) | yangi tur: 7-qadam |
| `if jon = 0 then` | agar jon 0 ga teng bo'lsa, unda | **C-blok** (8-darsdagi `if … then` kabi): o'zgaruvchining sonini tekshiradi — aytilgan songa teng bo'lsa («✓ ha») ichidagi bloklar bajariladi, bo'lmasa («✕ yo‘q») — bajarilmaydi. O'zgaruvchi ro'yxatdan, son ro'yxatdan 0–10; belgi faqat «=» (**KOD**, «Savollar» 2) | **yangi**: 7-qadam |
| `game over` | o'yin tugadi | o'yinni to'xtatadi, sahnada «O‘yin tugadi» (**KOD**, «Savollar» 4) | **yangi**: 7-qadam |
| `when any key pressed` | istalgan tugma bosilganda | 9-darsdagi: har bosishda, strelka dasturchasidan keyin | 9-darsdan; 14-qadam |
| `set … to …` · `when ▶ clicked` · `when touching apple` · `change ball by 1` | (11-dars) | o'yin boshi va ball | 11-darsdan |

Yangi blok rangi — ustoz aytadi: «if — Shart oilasidan, 8-darsdagidek. game over — Hodisa oilasida, o‘yin bloklari yonida.»
**Shart ko'rinishi** (8-darsdagidek): `if` yonida «✓ ha» (oltin) yoki «✕ yo‘q» (xira), tovushsiz.
**Dasturchalar** ostma-ost; **dasturda eng ko'pi 16 ta blok** (boshqaruv qatoridan tashqari; bu darsdagi eng uzun dastur — 14 ta: o'yin boshi 4, olma 2, kaktus 4, qadam 4).
**Dastur pog'onadan pog'onaga o'tadi** (`prog: 'oldingi'`). 1-bekat 1-pog'onasi tayyor bo'lak bilan ochiladi: boshqaruv, `when ▶ clicked` → `set jon to 3`, bo'sh `when touching cactus`. 2-bekat — bolaning 1-bekat dasturi bilan (yo'q bo'lsa — tayyor jon qoidasi). **3-bekat — tayyor o'yin bilan** («Savollar» 8): boshqaruv, `when ▶ clicked` → `set ball to 0`, `set jon to 3`; `when touching apple` → `change ball by 1`; `when touching cactus` → `change jon by -1`, `if jon = 0 then` → `game over` (9 ta blok).

### Topshiriqlar va tekshiruv natijasi

Dastur bilan simulyatsiya qilingan. Belgilar: «▶[jon 3]» — `when ▶ clicked` ostida `set jon to 3`; «K[−1; =0]» — `when touching cactus` ostida `change jon by -1` va `if jon = 0 then` → `game over`; «O[+1]» — `when touching apple` → `change ball by 1`; «OO[jon +1]» — `when touching gold apple` → `change jon by 1`; «Q» — `when any key pressed` → `change qadam by -1`, `if qadam = 0 then` → `game over`. «Sinov» — qoidani sinash pog'onasi (o'yin 0 da tugashi kerak), «Yutish» — o'yinni yutish. Yo'l — kaktusga tegmagan eng qisqa yo'l (dastur hisoblagan).

| Joy | Maydon (start · olmalar · oltin · kaktuslar · yulduz) | Yechim | Bosish | Natija (simulyatsiya) |
|---|---|---|---|---|
| Huk (2–4) | (0, 0) · — · — · (2, 0) · — ; jon 3 | C: ▶[jon 3] K[−1; =0] | ustoz `→→→→→` (tayyor) | A — K[`game over`]: 2-bosishda (1-tegish) tugadi, jon 3 — «✕ jon 3 — tugadi»; B — K[−1]: 4 tegish, jon −1, o'yin davom — «✕ jon −1»; C — 3-tegishda (4-bosish) jon 0, tugadi — «✓ jon 0 — tugadi» |
| 7 (ustoz) | (0, 0) · — · — · (0, 1), (3, 0) · — | ▶[jon 3] K[−1; =0] | `↑↑↑` | 3 tegish — jon 0, o'yin tugadi |
| 8 · 1 Sinov | (0, 0) · — · — · (2, 0), (0, 2) · — | ▶[jon 3] (tayyor) + K[−1; =0] | `→→→→` (masalan) | 3-tegishda jon 0 — tugadi. Shartsiz K[−1] — jon −1, davom (Kamvoy «Jon tugadi-ku!»); `if jon = 1` — 2-tegishda, jon 1 da tugadi (Ortiqvoy «Erta tugadi!») |
| 8 · 2 Sinov | (3, 0) · — · — · (2, 0), (4, 0), (3, 1) · — | ▶[jon 4] K[−2; =0] | `↑→` | 2-tegishda jon 0 — tugadi. −1 qoldi — 4-tegishda tugadi (Kamvoy «Kaktus kam oldi!»); jon 3 qoldi — 3 → 1 → −1, davom (Kamvoy «Jon tugadi-ku!») |
| 8 · 3 Yutish | (0, 0) · — · — · (1, 0), (2, 1), (3, 0), (3, 2), (5, 1), (4, 4) · (6, 0) | ▶[jon 2] K[−1; =0] | 12 `↑→↑→↑→→→→↓↓↓` | yutdi, jon 2. Bitta tegish — yutdi, jon 1; ikki tegish — o'yin tugadi |
| 8 · ★ Yutish | (0, 0) · — · — · (1, 0), (0, 2), (2, 2), (2, 0), (4, 1), (4, 2), (3, 4), (5, 0), (6, 2) · (6, 0) | ▶[jon 1] K[−1; =0] | 12 `↑→→→↑↑→→↓↓→↓` | yutdi, jon 1. Bitta tegish — o'yin tugadi |
| 10 (ustoz) | (0, 0) · (2, 0), (3, 2), (5, 2) · — · (1, 0), (3, 1), (4, 2), (6, 0) · (6, 4) | ▶[ball 0, jon 3] O[+1] K[−1; =0] | ataylab `→` + 14 | bitta tegish — jon 2; ball 3; yutdi |
| 11 · 1 Yutish | (0, 0) · (0, 3), (3, 1), (5, 2) · — · (1, 0), (2, 1), (4, 1), (3, 3) · (6, 0) | ▶[ball 0, jon 3] O[+1] K[−1; =0] | 14 | ball 3, jon 3 — yutdi. Ball qismi yo'q — Bo'shvoy birinchi olmada |
| 11 · 2 Yutish | (6, 0) · (4, 0), (2, 2), (0, 1) · (5, 2) · (3, 0), (3, 2), (0, 2) · (3, 4) | ▶[ball 0, jon 1] O[+1] OO[jon +1] K[−1; =0] | 17 | ball 3, jon 2 — yutdi. Oltin ballga qo'shdi — ball 4, jon 1 (Kamvoy «Jon-chi?»); oltinsiz — jon 1 (Bo'shvoy «Oltin olma-chi?») |
| 11 · 3 Yutish | (0, 0) · (2, 0), (0, 3), (3, 3) · — · (1, 0), (3, 1), (2, 2), (3, 4), (4, 2) · (5, 2) | ▶[ball 0, jon 3] O[+1] K[jon −1, ball −2; =0] | 15 | tegmasdan — ball 3, jon 3; bitta tegish — ball 1, jon 2 (ikkalasi yutish). Ball −2 yo'q, bitta tegish — ball 3 (Kamvoy «Kaktus-chi?») |
| 11 · ★ Yutish | (0, 0) · (2, 0), (2, 2), (4, 0), (4, 2), (3, 4) · — · (1, 0), (3, 0), (3, 1), (3, 2), (5, 0) · (6, 0) | ▶[ball 0, jon 1] O[+2] K[−1; =0] | 18 | ball 10, jon 1 — yutdi. O[+1] qoldi — ball 5 (Kamvoy «Ball kam!») |
| 14 (ustoz) | (0, 0) · — · — · — · (4, 0) | ▶[qadam 6] Q | `↑↑↓↓↑↑`, keyin `→→→→` | 1-o'yin: 6-bosishda qadam 0 — tugadi; 2-o'yin: 4 bosish — yutdi, qadam 2 |
| 15 · 1 Sinov | (0, 0) · — · — · — · (6, 2); tayyor o'yin | + ▶[qadam 5] Q | `→→→→→` (masalan) | 5-bosishda qadam 0 — tugadi (yulduzgacha 8 ta). `if qadam = 1` — 4-bosishda (Ortiqvoy «Erta tugadi!»); shartsiz — qadam −1, davom (Kamvoy «Qadam tugadi-ku!») |
| 15 · 2 Yutish | (0, 0) · (2, 0), (3, 2), (5, 2) · — · (3, 0), (2, 2), (4, 1) · (5, 0) | ▶[…, qadam 12] Q | 9 `→→↑→↑→→↓↓` | ball 3, qadam 3 — yutdi. 2 ta ortiqcha bosish — yutdi, qadam 1; 3 ta — o'yin tugadi; qadam 5 qoldi — 5-bosishda tugadi |
| 15 · 3 Yutish | (6, 0) · (4, 0), (3, 2), (5, 2) · — · (5, 0), (3, 0), (4, 2), (2, 2), (3, 3) · (0, 0) | ▶[ball 0, jon 2, qadam 16] O[+1] K[−1; =0] Q | 14 | ball 3, jon 2, qadam 2 — yutdi. Bitta tegish — jon 1, qadam 1, yutdi; qadam 14 — 14-bosishda tugadi |
| 15 · ★ Yutish (erkin) | (0, 0) · (2, 0), (0, 3), (5, 2), (3, 4) · — · (3, 0), (3, 2), (4, 1), (2, 4), (1, 3) · (6, 4) | bolaning o'zi (namuna ▶[ball 0, jon 3, qadam 25] O[+5] K Q) | 20 | tayyor sharti: ▶ ostida uchala `set`, jon va qadam qoidasi, yutdi. Namuna — ball 20, qadam 5. Qadam 20 — 20-bosishda tugadi (yo'l 20 bosish — kamida 21 kerak) |

**Javoblar takrorlanmaydi:** har pog'onada bolaning yangi ishi boshqa — 1-bekat: jon qoidasini tuzish · jon 4 va −2 · jon 2 bilan yutish · jon 1 bilan yutish (8 · 3 va 8 · ★ da dastur faqat bitta son bilan farq qiladi — ish o'yinning o'zida: tor yo'l); 2-bekat: ball qismini qo'shish · oltin olma → jon · kaktus → ball ham · olma → 2 ball; 3-bekat: qadam qoidasi · qadam 12 · jon 2 va qadam 16 · o'z sonlari. Ustoz ko'rsatganlari bolanikidan farq qiladi: huk — kaktus bitta va jon tayyor; 7 — boshqa maydon; 10 — jon 3, ball 3; 14 — qadam 6, kaktussiz. Yo'llar ham har xil (eng qisqa yo'llarning hech qaysi ikkitasi bir xil emas).

## Yordam va xato

1–11-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); maslahat yo'nalish beradi, javobni aytmaydi (A·2). Xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga "noto'g'ri", "xato qildingiz" deyilmaydi (98-qaror). **«O‘yin tugadi» muammo emas:** yutish pog'onasida jon yoki qadam tugasa — muammocha chiqmaydi, ishora qatorida faqat «Jon tugadi. ▶ Boshlash — yana o‘ynang» (yoki «Qadam tugadi. Qisqaroq yo‘l toping. ▶ Boshlash — yana o‘ynang»).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | kaktusga tegdi, `when touching cactus` ostida blok yo'q | «Tegdim — nima qilay?» | «Kaktusga tekkanda jon kamaysin — dasturchaga blok ulang» |
| Kamvoy | jon (qadam) 0 dan pastga tushdi, o'yin davom etyapti | «Jon tugadi-ku!» («Qadam tugadi-ku!») | «Jon −1 bo‘ldi, o‘yin esa davom etyapti. Jon 0 bo‘lganda o‘yin tugashi uchun shart kerak» (haqiqiy son bilan; **KOD**) |
| Ortiqvoy | `game over` jon (qadam) 0 bo'lmasdan ishladi | «Erta tugadi!» | «Jon 2 qoldi, o‘yin esa tugadi. Shart qachon «ha» deydi — sonni tekshiring» (**KOD**) |
| Bo'shvoy | `if` ichi bo'sh | «Ichi bo‘sh-ku…» | «if ichiga blok qo‘ying — shart «ha» bo‘lsa, u bajariladi» (8-darsdagidek) |
| Kamvoy | 8 · 2: o'yin 0 da tugadi, lekin kaktus har tegishda 2 ta jon olmadi | «Kaktus kam oldi!» | «Kaktus har tegishda 2 ta jon olsin» |
| Bo'shvoy | olma terildi, olma dasturchasi yo'q (2–3-bekat) | «Olma terildi, ball-chi?» | 11-darsdagidek |
| Bo'shvoy | oltin olma terildi, dasturchasi yo'q | «Oltin olma-chi?» | «Oltin olmaga o‘z dasturchasi kerak — hodisa blokida turini tanlang» |
| Kamvoy | 11 · 2: oltin olma terildi, jon o'zgarmadi | «Jon-chi?» | «Oltin olma jon bersin — uning dasturchasini tekshiring» |
| Kamvoy | 11 · 3: kaktusga tegildi, ball o'zgarmadi (yoki yutdi, kaktus dasturchasida ball yo'q) | «Kaktus-chi?» | «Kaktus jonni ham, 2 ballni ham olsin — kaktus dasturchasini tekshiring» |
| Kamvoy / Ortiqvoy | yutdi, ball aytilgandan kam / ko'p | «Ball kam!» / «Ball ko‘p!» | 11-darsdagidek (haqiqiy sonlar bilan) |
| Kamvoy | yutish pog'onasida yutdi, lekin jon (qadam) qoidasi yo'q | «Qoida-chi?» | «Jon 0 bo‘lsa, o‘yin tugashi kerak: kaktus dasturchasida shart bormi?» (qadam uchun — «har bosishda ishlaydigan dasturchada») |
| Kamvoy | 15 · 1: qadam o'zgarmayapti (2-bosishdan keyin) | «Qadam-chi?» | «Har bosishda qadam kamaysin: qaysi hodisa bloki har bosishda ishlaydi?» |
| Kamvoy | 15 · ★: tayyor sharti bajarilmadi | «Oz qoldi!» | yetishmagan bandi bilan: «O‘yin boshida jon va qadamni qo‘ying» · «Qadam qoidasi kerak» |

Bir bosishda ikki sabab bo'lsa — avval o'yin tugashi (`game over`) bilan bog'liq gap. Muammocha qahramonni yopmaydi (91-qaror).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «12-dars · Jon va qadam», sarlavha «Bugun o‘yinda jon bo‘ladi!». Coddy: «Salom! Bugun kaktusdan ehtiyot bo‘lamiz.» O'ngda maydon, Coddy (0, 0) da, yonida kaktus. Pastda kichik karta «O‘tgan darsda»: kapsula «ball: 3» — «O‘zgaruvchi — Kompyuter eslab qoladigan son». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda kompyuter ballni eslab qoldi.»
  2. «Bugun o‘yinda jon bo‘ladi: jon tugasa — o‘yin tugaydi.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; o'tgan darsdagi `ball` va «ball 6» voqeasini eslatadi; bolalar o'ynagan o'yinlardagi jonni eslatadi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «12-dars · Jon va qadam», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: jon tugasa, o'yinni qanday tugatamiz?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Coddy'da 3 ta jon; kaktusga tegsa — bitta jon ketadi; jon tugaganda o'yin tugashi kerak. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Jon tugasa, o‘yinni qanday tugatamiz?» (ikki qator). Maydon: Coddy (0, 0) da, kaktus (2, 0) da; kapsula «jon: 3». Coddy: «Menda 3 ta jon. Kaktusga tegsam, bittasi ketadi.» Chapda uchta karta: A «Tegsa — o‘yin tugasin» (`when touching cactus` ostida `game over` rasmi) · B «Jonni kamaytiramiz» (ostida `change jon by -1`) · C «Kamaytiramiz va tekshiramiz» (ostida `change jon by -1` va `if jon = 0 then` ichida `game over`). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Coddy’da 3 ta jon. Jon tugaganda o‘yin tugashi kerak.»
  2. «Har kim noutbukida bitta kartani tanlasin: qanday tugatamiz?»
- **O'z so'zi bilan:** kartalarni o'qiydi; telefon o'yinlaridagi jonni eslatadi; sinf javoblarini o'qiydi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi yo‘l bilan o‘yinni tugatamiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; Coddy o'zi bosadi (tayyor bosishlar `→→→→→`, **KOD**): bitta qadam, keyin kaktusga tegadi — darhol «O‘yin tugadi»; kapsula «jon: 3». Kartada: «✕ jon 3 — tugadi».
  2. «Keyingi» — B: Coddy kaktusga to'rt marta tegadi — «jon: 2», «1», «0», «−1»; o'yin davom etyapti. Kartada: «✕ jon −1».
  3. «Keyingi» — C: «jon: 2», «1», «0» — `if` yonida «✓ ha», «O‘yin tugadi». Kartada: «✓ jon 0 — tugadi».
- **Tayanch gaplar:**
  1. «A da jon bo‘lsa ham o‘yin tugadi. B da jon tugadi, o‘yin esa tugamadi.»
  2. «C da jon kamaydi, shart uni tekshirdi: jon 0 — o‘yin tugadi.»
- **O'z so'zi bilan:** C da jonni sinf bilan sanaydi (3, 2, 1, 0); B da «kompyuter sonni sanadi, lekin nima qilishni bilmadi — unga hech kim aytmadi».
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: kamaytiramiz va tekshiramiz

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Kamaytiramiz va tekshiramiz». A va B xira, C oltin; maydonda Coddy kaktus oldida, kapsula «jon: 0», taxta «O‘yin tugadi». Coddy: «Jon 0 bo‘ldi — shart «ha» dedi, o‘yin tugadi.»
- **Tayanch gaplar:**
  1. «Jon — o‘zgaruvchi: kaktus uni kamaytiradi. Shart tekshiradi: jon 0 bo‘lsa — o‘yin tugaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: jon

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: jon»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Jon nima?». Coddy: «Jon — nechta imkoniyatim qolgani.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (`raqam` ishi):
     - 1-bosish: kapsula «jon: 3», yonida uchta yurakcha; yozuv «O‘yin boshida — 3 ta jon»;
     - 2-bosish: Coddy kaktusga tegadi, `change jon by -1` yonadi — «jon: 2», bitta yurakcha xira; yozuv «Tegdi — jon kamaydi»;
     - 3-bosish: yana ikki tegish — «jon: 0», `if jon = 0 then` yonida «✓ ha», taxta «O‘yin tugadi»; yozuv «Jon 0 — o‘yin tugadi».
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Jon — o‘yinchining qolgan imkoniyati. 0 bo‘lsa — o‘yin tugaydi.»
  2. «Jon ham o‘zgaruvchi: nomi — jon, soni kamayib boradi.»
- **O'z so'zi bilan:** bolalar o'ynagan o'yinlardan misol (yurakchalar, «3 ta urinish»); ball — ortadi, jon — kamayadi, ikkalasi o'zgaruvchi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Jon → 2 · Ball va jon → 3 · Qadam; cho'qqida kichik karta «Dars oxirida · o‘yiningiz · ball, jon va qadam bilan» (kichik maydon, uchta kapsula). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Avval jon.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: jon, ball va jon, qadam.»
  2. «Dars oxirida o‘yiningizda uchta o‘zgaruvchi bo‘ladi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: jon qoidasi

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Jon
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz jon qoidasini ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Jon kamayadi — shart tekshiradi». Javonda: O'zgaruvchi (`set ball to 0`, `change ball by 1` — ro'yxatda endi `ball`, `jon`, `qadam`), Shart oilasida yangi blok `if ball = 0 then`, Hodisada `when ▶ clicked`, `when touching apple` va yangi blok `game over`. Dasturda «Boshqaruv» va tayyor `when ▶ clicked` → `set jon to 3`. Maydonda Coddy (0, 0) da, kaktuslar (0, 1), (3, 0) da.
  2. Ustoz javondan `when touching apple` ni bosadi — turini «cactus» ga almashtiradi: `when touching cactus`. Ostiga `change ball by 1` — o'zgaruvchini `jon` ga, sonni −1 ga almashtiradi.
  3. Ostiga `if ball = 0 then` — o'zgaruvchini `jon` ga almashtiradi: `if jon = 0 then`; ichiga `game over`.
  4. «▶ Boshlash»: «jon: 3». ↑ — Coddy kaktusga tegadi, «−1», «jon: 2», `if` yonida «✕ yo‘q»; ↑ — «jon: 1»; ↑ — «jon: 0», «✓ ha», «O‘yin tugadi».
- **Tayanch gaplar:**
  1. «Kaktusga tegsa — jon kamayadi: change jon by -1.»
  2. «if jon = 0 — agar jon 0 ga teng bo‘lsa. Unda — game over.»
  3. «Endi o‘zingiz: avval qoidangizni sinab ko‘ring.»
- **O'z so'zi bilan:** «−1» ni «minus bir» deb o'qiydi: «songa minus birni qo‘shsak — bittaga kamayadi»; `if` — 8-darsdagi Shart oilasi, «ha» bo'lsa ichidagisi bajariladi; `game over` — Hodisa oilasida, o'yin bloklari yonida; ro'yxatdan o'zgaruvchini tanlashni sekin ko'rsatadi.
- **Ustoz qiladi:** to'rt blok qo'shadi, turini, o'zgaruvchini va sonni tanlaydi, «▶ Boshlash», ↑ ni uch marta bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Jon: pog'onalar

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Jon
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Jon qoidasi!». Coddy: «Avval qoidani sinang, keyin ehtiyot bo‘lib o‘ynang.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Uch jon» · 2 «Achchiq kaktus» · 3 «Ehtiyot bo‘ling» · ★ «Bitta jon» (har kartada qahramon va kaktuslar rasmi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Birinchi ikki pog‘onada qoidani sinaysiz: ataylab kaktusga teging — jon 0 bo‘lganda o‘yin tugasin.»
  2. «Keyin kaktuslarga tegmay yulduzga boring.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; «Jon nechchi bo‘ldi? Shart nima dedi?» deb so'raydi; 2-pog'onada «jon 3 bilan, kaktus 2 olsa — 0 bo‘ladimi?» deb so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda O'zgaruvchi, Shart (`if ball = 0 then`), Hodisa (`when ▶ clicked`, `when touching apple`, `game over`); dasturda «Boshqaruv», `when ▶ clicked` → `set jon to 3` va bo'sh `when touching cactus`; sahnada «jon: 0» (o'yin boshida «3»). Hamma pog'onada ishora boshida: «Kaktusga tekkanda jon kamaysin, jon 0 bo‘lsa — o‘yin tugasin».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Uch jon», ostida «Qoidani sinang: kaktusga 3 marta tegsa — o‘yin tugasin.». Start (0, 0); kaktuslar (2, 0), (0, 2); yulduz yo'q. «Maslahat»: «Kaktusga tekkanda ikki ish: jon kamayadi, keyin shart uni tekshiradi».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Achchiq kaktus», ostida «Jon 4. Kaktus har tegishda 2 ta jon oladi.». Start (3, 0); kaktuslar (2, 0), (4, 0), (3, 1); yulduz yo'q. «Maslahat»: «Ikki son bor: o‘yin boshidagi jon va kaktus oladigan jon».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Ehtiyot bo‘ling», ostida «Jon 2. Kaktuslarga tegmay yulduzga yeting.». Start (0, 0); kaktuslar (1, 0), (2, 1), (3, 0), (3, 2), (5, 1), (4, 4); yulduz (6, 0). «Maslahat»: «Yo‘lni oldindan ko‘z bilan chizing — kaktuslarni aylanib o‘ting».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Bitta jon», ostida «Jon 1. Bitta tegish — o‘yin tugaydi.». Start (0, 0); kaktuslar (1, 0), (0, 2), (2, 2), (2, 0), (4, 1), (4, 2), (3, 4), (5, 0), (6, 2); yulduz (6, 0). «Maslahat»: «Avval tor joyni toping — undan qanday o‘tasiz?».
  1–2-pog'onada qoida to'g'ri ishlasa: «O‘yin tugadi» taxtasi, keyin «Shart ishladi: jon 0 — o‘yin tugadi!» va konfeti; 3, ★ da yutsa: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** kaktus dasturchasiga `change` va `if` + `game over` ni qo'shadi, o'zgaruvchi va sonlarni tanlaydi, «▶ Boshlash»; 1–2-pog'onada ataylab tegadi, 3, ★ da ehtiyot bo'lib o'ynaydi.
- **Tekshiruv:** sinov — o'yin `game over` bilan tugadi va shu lahzada jon = 0 (2-pog'onada — 2 tegishda) (avto); yutish — o'yin yutildi va dasturda jon qoidasi bor.
- **Xatoda:** kaktus dasturchasi bo'sh — Bo'shvoy «Tegdim — nima qilay?»; jon 0 dan o'tdi — Kamvoy «Jon tugadi-ku!»; erta tugadi — Ortiqvoy «Erta tugadi!»; `if` ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…»; 2-pog'onada kaktus 1 ta oldi — Kamvoy «Kaktus kam oldi!».

## 9 · 2-bekat

- **Vaqt:** 0:21–0:22 (1 daqiqa)
- **Bekat:** 2 · Ball va jon
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: ball va jon»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Jon ✓, oltin yoy; Coddy 2-bekatda; 2 · Ball va jon miltillaydi. Coddy: «Endi olmalar ham bor: ball ham, jon ham.»
- **Tayanch gaplar:**
  1. «Jon qoidasi tayyor. Endi bitta o‘yinda ikki o‘zgaruvchi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: ball va jon

- **Vaqt:** 0:22–0:24 (2 daqiqa)
- **Bekat:** 2 · Ball va jon
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz ball va jonni ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Ikki o‘zgaruvchi — bitta o‘yin». Maydonda Coddy (0, 0) da, olmalar (2, 0), (3, 2), (5, 2), kaktuslar (1, 0), (3, 1), (4, 2), (6, 0); yulduz yashirin. Dasturda «Boshqaruv», `when ▶ clicked` → `set jon to 3`, jon qoidasi (7-qadamdagi).
  2. Ustoz `when ▶ clicked` ostiga `set ball to 0` qo'shadi; javondan `when touching apple` → `change ball by 1`. Sahnada ikki kapsula: «ball: 0», «jon: 3».
  3. «▶ Boshlash»; ustoz ataylab → bosadi — kaktusga tegdi, «jon: 2»; keyin teradi — «ball: 1», «2», «3»; yulduz (6, 4) da chiqadi, yetadi — «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Bitta o‘yinda ikki o‘zgaruvchi: ball va jon. Har birining o‘z nomi, o‘z soni.»
  2. «Olma — ballga qo‘shadi, kaktus — jonni kamaytiradi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** ikkala son o'yin boshida `set` bilan qo'yiladi — bitta `when ▶ clicked` ostida ikki blok; kapsulalar dasturda ishlatilgan o'zgaruvchilar uchun chiqadi.
- **Ustoz qiladi:** uch blok qo'shadi, «▶ Boshlash», o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Ball va jon: pog'onalar

- **Vaqt:** 0:24–0:35 (11 daqiqa)
- **Bekat:** 2 · Ball va jon
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Ball ham, jon ham!». Coddy: «Olmalarni tering, kaktuslardan ehtiyot bo‘ling.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya: 1 «Ikki o‘zgaruvchi» · 2 «Jon sovg‘asi» · 3 «Qimmat kaktus» · ★ «Toza o‘yin». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Har pog‘ona tepasida o‘yin qoidasi yozilgan: nima ballga qo‘shadi, nima jonni kamaytiradi.»
  2. «Sahnadagi ikki songa qarab o‘ynang.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Oltin olma qaysi songa qo‘shadi?» deb so'raydi; 3-pog'onada bitta dasturcha ikki o'zgaruvchini o'zgartira olishini darrov aytmaydi — bola o'zi topsin.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur 8-qadamdagi dasturi bilan ochiladi (yo'q bo'lsa — tayyor jon qoidasi bilan); sahnada kapsulalar. Hamma pog'onada ishora boshida: «Ball va jon — ikkala son ham o‘yin boshida qo‘yiladi».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Ikki o‘zgaruvchi», ostida «Jon 3, ball 0 dan. Har olma — 1 ball.». Start (0, 0); olmalar (0, 3), (3, 1), (5, 2); kaktuslar (1, 0), (2, 1), (4, 1), (3, 3); yulduz (6, 0); kerak — ball 3. «Maslahat»: «Ball uchun ikki joy: o‘yin boshi va olmaga tekkanda».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Jon sovg‘asi», ostida «Jon 1. Oltin olma 1 ta jon beradi.». Start (6, 0); olmalar (4, 0), (2, 2), (0, 1); oltin olma (5, 2); kaktuslar (3, 0), (3, 2), (0, 2); yulduz (3, 4); kerak — ball 3, oltin olma terilganda jon 2. «Maslahat»: «Oltin olma qaysi o‘zgaruvchini o‘zgartiradi?».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Qimmat kaktus», ostida «Kaktus jonni ham, 2 ballni ham oladi.». Start (0, 0); olmalar (2, 0), (0, 3), (3, 3); kaktuslar (1, 0), (3, 1), (2, 2), (3, 4), (4, 2); yulduz (5, 2); jon 3. «Maslahat»: «Bitta dasturcha ikki o‘zgaruvchini o‘zgartira oladi».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Toza o‘yin», ostida «Jon 1. Har olma — 2 ball. Ball 10 bo‘lsin.». Start (0, 0); olmalar (2, 0), (2, 2), (4, 0), (4, 2), (3, 4); kaktuslar (1, 0), (3, 0), (3, 1), (3, 2), (5, 0); yulduz (6, 0). «Maslahat»: «Olmalar orasida kaktuslar ustuni bor — qayerdan aylanib o‘tasiz?».
  Yutsa va sonlar to'g'ri: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** ball qismini qo'shadi, yangi dasturcha (oltin olma) va kaktus dasturchasiga yangi blok qo'shadi, sonlarni tanlaydi, o'ynaydi.
- **Tekshiruv:** o'yin yutildi (avto) va: 1 — ball 3; 2 — ball 3, oltin olma terilganda jon 1 ga ko'paydi; 3 — kaktus dasturchasida `change ball by -2` bor (tegilgan bo'lsa — ball har tegishda 2 ga kamaydi); ★ — ball 10.
- **Xatoda:** ball qismi yo'q — Bo'shvoy «Olma terildi, ball-chi?»; oltin olma dasturchasi yo'q — Bo'shvoy «Oltin olma-chi?»; oltin olma jon bermadi — Kamvoy «Jon-chi?»; kaktus ballni olmadi — Kamvoy «Kaktus-chi?»; ball kam / ko'p — Kamvoy «Ball kam!» / Ortiqvoy «Ball ko‘p!»; jon tugadi — ishora «Jon tugadi. ▶ Boshlash — yana o‘ynang».

## 12 · Xulosa: jon

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Ball va jon
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: jon»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Jon». Coddy: «Shart o‘zgaruvchining sonini tekshiradi.» Ikki karta: «change jon by -1 — Jon bittaga kamayadi» (`change` bloki) va «if jon = 0 then — Jon 0 bo‘lsa: «ha»» (`if` bloki, ichida `game over`); o'ngda maydon — Coddy yulduzda, kapsulalar «ball: 3», «jon: 2».
- **Tayanch gaplar:**
  1. «O‘yinda bir nechta o‘zgaruvchi bo‘ladi — har birining o‘z nomi.»
  2. «Shart o‘zgaruvchining sonini tekshiradi: jon 0 bo‘lsa — o‘yin tugaydi.»
- **O'z so'zi bilan:** hukdagi B kartani eslatadi — kompyuter jonni sanadi, lekin shartsiz nima qilishni bilmadi; 8-darsdagi shart «yo‘l bormi?» deb tekshirardi, bugungi — «jon 0 mi?».
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 3 · Qadam
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: qadam»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Qadam miltillaydi. Coddy: «Oxirgi bekat: qadamlar ham tugaydi.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — qadam.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: qadam qoidasi

- **Vaqt:** 0:38–0:40 (2 daqiqa)
- **Bekat:** 3 · Qadam
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz qadam qoidasini ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Har bosish — bitta qadam». Maydonda Coddy (0, 0) da, yulduz (4, 0) da (ko'rinib turadi), kaktus va olma yo'q. Dasturda «Boshqaruv» va bo'sh `when ▶ clicked`. Javonda Hodisada `when any key pressed` (9-darsdagi).
  2. Ustoz `when ▶ clicked` ostiga `set qadam to 6`; javondan `when any key pressed` → ostiga `change qadam by -1`, `if qadam = 0 then` → ichiga `game over`.
  3. «▶ Boshlash»: «qadam: 6». Ustoz ataylab ↑ ↑ ↓ ↓ ↑ ↑ — har bosishda «−1»: 5, 4, 3, 2, 1, 0 — «✓ ha», «O‘yin tugadi».
  4. «▶ Boshlash» yana: «qadam: 6»; → → → → — Coddy yulduzda, «qadam: 2», «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Har bosish qadamdan bittasini oladi. Qadam 0 bo‘lsa — o‘yin tugaydi.»
  2. «Yulduzga qadam tugamasdan yeting: qadam 0 bo‘lgan bosishda o‘yin tugaydi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** `when any key pressed` — 9-darsdagi qoida dasturchasi: har bosishda, strelkadan keyin; bu o'yinda vaqt qadam bilan o'lchanadi — sekin o'ynasangiz ham qadam o'sha; «qadam: 6» — 5 ta qadam qo'yib yutsa bo'ladi (6-bosish o'yinni tugatadi).
- **Ustoz qiladi:** to'rt blok qo'shadi, ikki marta o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Qadam: pog'onalar

- **Vaqt:** 0:40–0:52 (12 daqiqa)
- **Bekat:** 3 · Qadam
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Qadamni sanang!». Coddy: «Avval yo‘lni sanang, keyin o‘ynang.» Chapda katta son «Uch pog‘onani tugatdi 6 / 14» va belgilar; o'ngda zinapoya: 1 «Besh qadam» · 2 «Qisqa yo‘l» · 3 «Hammasi birga» · ★ «O‘z o‘yiningiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval qadam qoidasini sinang: qadam 0 bo‘lganda o‘yin tugasin.»
  2. «Keyin yo‘lni sanab o‘ynang — qadam yetsin.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Yulduzgacha nechta bosish? Qadam nechta?» deb so'raydi; ★ da «O‘yiningiz qiyin bo‘lsinmi yoki oson?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur tayyor o'yin bilan ochiladi (boshqaruv, ball va jon — «Maydon, o'yin va bloklar»); javonda `when any key pressed` ham bor; sahnada kapsulalar. Hamma pog'onada ishora boshida: «Har bosishda qadam kamaysin, qadam 0 bo‘lsa — o‘yin tugasin».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Besh qadam», ostida «Qadam 5. Qoidani sinang: 5-bosishda o‘yin tugasin.». Start (0, 0); yulduz (6, 2) (5 qadamda yetib bo'lmaydi). «Maslahat»: «Har bosishda ishlaydigan hodisa bloki kerak — 9-darsdagi qoida kabi».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Qisqa yo‘l», ostida «Qadam 12. Olmalarni terib, yulduzga yeting.». Start (0, 0); olmalar (2, 0), (3, 2), (5, 2); kaktuslar (3, 0), (2, 2), (4, 1); yulduz (5, 0); kerak — ball 3. «Maslahat»: «Bosishdan oldin yo‘lni barmoq bilan sanang».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Hammasi birga», ostida «Jon 2, qadam 16. Uch o‘zgaruvchi — bitta o‘yin.». Start (6, 0); olmalar (4, 0), (3, 2), (5, 2); kaktuslar (5, 0), (3, 0), (4, 2), (2, 2), (3, 3); yulduz (0, 0); kerak — ball 3. «Maslahat»: «Uchala son o‘yin boshida qo‘yiladi — when ▶ clicked ostini tekshiring».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «O‘z o‘yiningiz», ostida «Jon, qadam va olma ballini o‘zingiz tanlang.». Start (0, 0); olmalar (2, 0), (0, 3), (5, 2), (3, 4); kaktuslar (3, 0), (3, 2), (4, 1), (2, 4), (1, 3); yulduz (6, 4). «Maslahat»: «Qadam yo‘lga yetsin: avval sanang, keyin sonni tanlang». Erkin ijod (36-qaror).
  1-pog'onada qoida to'g'ri ishlasa: «O‘yin tugadi», keyin «Shart ishladi: qadam 0 — o‘yin tugadi!» va konfeti; 2–3-pog'onada yutsa: «Siz yutdingiz!»; ★ da: «O‘yiningiz tayyor!».
- **Bola qiladi:** qadam qoidasini tuzadi, sonlarni tanlaydi, o'ynaydi; ★ da o'z sonlarini tanlaydi.
- **Tekshiruv:** 1 — o'yin `game over` bilan 5-bosishda tugadi, qadam = 0 (avto); 2–3 — yutdi, ball 3, qadam ≥ 1 (3 da jon ≥ 1); ★ — `when ▶ clicked` ostida uchala `set`, jon va qadam qoidasi bor, yutdi.
- **Xatoda:** qadam o'zgarmayapti — Kamvoy «Qadam-chi?»; qadam 0 dan o'tdi — Kamvoy «Qadam tugadi-ku!»; erta tugadi — Ortiqvoy «Erta tugadi!»; qadam tugadi (o'yinda) — ishora «Qadam tugadi. Qisqaroq yo‘l toping. ▶ Boshlash — yana o‘ynang»; ★ sharti — Kamvoy «Oz qoldi!».

## 16 · O'yiningiz qoidalarini o'qib bering

- **Vaqt:** 0:52–0:57 (5 daqiqa)
- **Bekat:** 3 · Qadam
- **Ekran:** proyektor — Blok studiya (ustoz, 15 · ★ maydoni, dasturda faqat «Boshqaruv») · bola — o'z oxirgi yechgan pog'onasi (A·1)
- **Sahna:** 12-bo'lim 3-band: bola o'yinining dasturini ovoz chiqarib o'qiydi («▶ bosilganda: jon 2, qadam 25. Kaktusga tekkanda: jon minus bir; agar jon 0 bo‘lsa — o‘yin tugadi…»), ustoz o'sha bloklarni qo'yadi va o'ynaydi; sinf sonlarni kuzatadi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Qoidalaringizni o‘qib bering». Maydon, Coddy (0, 0) da; dasturda faqat «Boshqaruv». Coddy: «Siz o‘qiysiz — men o‘ynayman.»
  2. Bola o'qiydi; ustoz bloklarni qo'yadi, sonlarni tanlaydi; «▶ Boshlash» — o'ynaydi (ataylab bir marta kaktusga tegadi).
  3. Ikki-uch bola.
- **Tayanch gaplar:**
  1. «Kim o‘yinining qoidalarini o‘qib beradi? Avval o‘yin boshi, keyin har dasturcha.»
  2. «Kuzating: jon va qadam qanday kamayadi.»
- **O'z so'zi bilan:** bolani maqtaydi; qaysi o'yin qiyinroq ekanini sinf bilan aytishadi (jon kam, qadam kam).
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, o'ynaydi.
- **Parta:** bola noutbukida o'z oxirgi yechgan pog'onasi o'z dasturi bilan qayta ochiladi, ishora «Dasturingizni ustozga o‘qib bering»; hech narsa yechmagan bolada — «Ustoz ekraniga qarang». Shu ekranda qayta o'ynasa natija qayta sanalmaydi.
- **Bola qiladi:** dasturini o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:57–1:00 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «O‘yiningizda jon bor!». Bugungi so'z: «Jon — O‘yinchining qolgan imkoniyati». Pastda: ✓ Jon · ✓ Ball va jon · ✓ Qadam. Kichik karta «Keyingi dars · 13 · Tasodifiy son».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: jon, ball va jon, qadam.»
  2. «Bugungi so‘z — jon: o‘yinchining qolgan imkoniyati. Shart uni tekshiradi.»
  3. «Keyingi darsda olmalar har safar boshqa joyda chiqadi — tasodifiy son.»
- **O'z so'zi bilan:** «jon» nimaligini va o'yin qachon tugashini bolalardan aytdiradi; ikki-uch boladan o'z o'yinidagi jon va qadamni so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «O‘yiningizda jon bor!». Coddy o'rniga qahramon: «Jon tugasa — o‘yin tugaydi. Qoidani o‘zim tuzdim!» «Siz bugun»: N ta o‘yin yutdi · N ta shart qo‘ydi · N ta o‘zgaruvchi ishlatdi (haqiqiy son; **KOD**). O'z qahramoni ★ maydonida, kapsulalar bilan; «Keyingi darsda tasodifiy son bilan ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:00–1:03 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta o‘yin yutdi · N ta shart qo‘ydi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda tasodifiy son bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Har o‘yinda qoida bor — siz endi uni o‘zingiz tuzasiz.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–11-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); Coddy tayyor bosishlar bilan o'zi yuradi; natija kartaning o'zida.
- 5-qadam: «Keyingi»ni bola o'zi bosadi (bo'laklar birma-bir yonadi).
- 7, 10, 14-qadam (ustoz ko'rsatadi): dastur tayyor turadi, bola o'zi «▶ Boshlash» va strelkalarni bosadi (ishora: 7-qadamda «↑ ni uch marta bosing — kaktusga teging», 14-qadamda «Avval istalgan strelkani 6 marta bosing, keyin yulduzga boring»).
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-012-ozgaruvchi-jon-vaqt-v1` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Jon qo‘riqchisi» (`qoriqchi`) — 8-qadamda 1-pog'ona bajarildi (birinchi jon qoidasi ishladi); «Uch o‘zgaruvchi» (`uchala`) — 15-qadamda 3-pog'ona bajarildi.

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk (o'yinni qanday tugatamiz). Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating, keyin bolalar o'zi bajaradi.
- Yangi bloklar: `if jon = 0 then` — agar jon 0 ga teng bo'lsa, unda (Shart oilasi, 8-darsdagi ramka); `game over` — o'yin tugadi (Hodisa oilasi). Yangi narsalar: kaktus (`when touching cactus`), manfiy son (`change jon by -1` — «minus bir», jon bittaga kamayadi), o'zgaruvchilar ro'yxati (`ball`, `jon`, `qadam`). 3-bekatda 9-darsdagi `when any key pressed`.
- Bugungi asosiy fikr bitta: **o'yinda bir nechta o'zgaruvchi bo'ladi; shart o'zgaruvchining sonini tekshiradi — jon 0 bo'lsa, o'yin tugaydi.** Hukda (B karta — sanadi, lekin tugatmadi), xulosada va 3-bekatda (qadam ham shu qoida bilan) chiqadi.
- 1-bekatning 1–2-pog'onasida va 3-bekatning 1-pog'onasida bolalar ataylab yutqazadi — bu qoidani sinash; «O‘yin tugadi» chiqsa, «Shart ishladi!» deb maqtang.
- «O‘yin tugadi» — muammo emas: yana «▶ Boshlash». Bolaga «yutqazdingiz» demang.
- Qadam: «qadam: 12» — 11 ta bosishda yutish kerak (12-bosishda qadam 0 bo'ladi va o'yin tugaydi). 14-qadamda shuni ko'rsating.
- 16-qadamda bolaning ismi proyektorga chiqmaydi: bola dasturini o'zi o'qiydi, siz bosasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **Kaktus** — maydon xaritasida yangi belgi va rasm; qahramon o'ta olmaydi (turtiladi, «tuk»); har urinishda `when touching cactus` (11-darsdagi `when touching` blokining yangi turi `cactus`).
2. **Bir nechta o'zgaruvchi:** `DARS.ozgaruvchi: ['ball', 'jon', 'qadam']`; `set` / `change` / `if` bloklarida o'zgaruvchi ro'yxati; har pog'ona o'zgaruvchilari 0 bilan ochiladi; sahnada dasturda ishlatilgan har o'zgaruvchiga kapsula (ostma-ost); «−1» pufagi.
3. **Manfiy son:** `change` son ro'yxatiga −3, −2, −1 (dars e'lonida); blokda «-1» ko'rinishi.
4. **Shart bloki `if [o‘zgaruvchi] = [son] then`** — 8-darsdagi `if … then` C-bloki (Shart oilasi rangi), sharti: o'zgaruvchi ro'yxati, «=», son ro'yxati 0–10; ijroda `t.ha = h.v[o‘zgaruvchi] === son`; «✓ ha / ✕ yo‘q» (8-darsdagi ko'rinish, tovushsiz).
5. **`game over` bloki** (Hodisa oilasi): o'yinni shu zahoti to'xtatadi (qolgan bloklar va bosish tartibining keyingi bosqichlari bajarilmaydi); «O‘yin tugadi» taxtasi; asosiy tugma «▶ Boshlash».
6. **`when any key pressed`** (9-dars, `any` tanlovi) — bosish tartibining 2-bosqichi; 9-darsda qurilmagan bo'lsa — shu darsda.
7. **Baho — ikki tur:** `bosh.sinov: { ozg: 'jon', bosish|tegish: N }` — o'yin `game over` bilan, o'sha lahzada o'zgaruvchi 0 va (bo'lsa) tegishlar soni N → «Shart ishladi: jon 0 — o‘yin tugadi!»; erta tugadi — Ortiqvoy; 0 dan o'tdi — Kamvoy (darhol, o'yin davom etayotganda). `bosh.kerak: { ball, jonOshdi, kaktusBall, qoida: ['jon'] }` — yutdi va shartlar; qoida yo'q — Kamvoy «Qoida-chi?».
8. **Muammochalar** — yuqoridagi jadval (o'zgaruvchi nomi va haqiqiy son bilan).
9. **Huk kartalari** — o'yin rejimida tayyor bosishlar (`data-bos="→→→→→"`); A — `game over` darhol, B — jon −1 gacha, C — jon 0 da tugaydi; natija kartada.
10. **5-qadam rasmi** — uch holat (`raqam` ishi): kapsula va yurakchalar 3 → 2 → 0, «O‘yin tugadi».
11. **3-bekatning tayyor o'yini** — 15 · 1 tayyor dastur bilan ochiladi (bolaning 2-bekat dasturi emas).
12. **Natija va yutuqlar** — `DARS.natija`: «ta o‘yin yutdi» (yutish pog'onalari), «ta shart qo‘ydi» (muvaffaqiyatli dasturlardagi `if`), «ta o‘zgaruvchi ishlatdi» (bolaning dasturlaridagi har xil o'zgaruvchilar, 3 gacha); yutuqlar `qoriqchi`, `uchala`. 16-qadam — A·1 (`'oxirgi'`, mavjud).
13. **Simulyatsiya sinovi** — `sinov/dvigatel/ozgaruvchi.mjs` ga 12-dars qismi: yuqoridagi jadvaldagi har yechim, eng qisqa yo'l (kaktusga tegmay), o'yin tugash bosishi va xato variantlari.

## Savollar (tavsiya — A)

1. **Vaqt — A: qadamlar.** O'zgaruvchi `qadam` — o'yin boshida `set qadam to 12`, har bosishda `when any key pressed` → `change qadam by -1`, `if qadam = 0 then` → `game over`. Sabab: 9 yoshli bola soniya bosimi ostida klaviaturada o'ynamaydi; o'yin sekin bolaga ham adolatli; jon qoidasining aynan o'zi — bir qolip ikki marta, fikr mustahkamlanadi; yo'lni oldindan sanash (3-dars) foyda beradi; simulyatsiya aniq. Tanlansa — ekrandagi dars nomi «Jon va qadam», `dastur/DASTUR.md` dagi 12-dars nomini foydalanuvchi o'zi o'zgartiradi (11-dars yakunidagi «Keyingi dars» ham). **B** — soniya taymeri: o'zgaruvchi `vaqt`, yangi hodisa `every second` («har soniyada»), 30 dan 0 gacha; dasturdagi so'zga aniq mos, lekin 14 bola har xil tezlikda, kichik strelkalar — ko'pchilik vaqt bilan yutqazadi; ekranda sanab tushadigan soniya — 63-qarordagi «ekranda vaqt yo'q» ruhiga ham zid ko'rinadi. **C** — sekundomer: `vaqt` faqat ortadi (shartsiz), oxirida «vaqt: 47» — bosimsiz, lekin shart faqat jonda qoladi.
2. **Shart bloki — A: `if jon = 0 then` — 8-darsdagi `if … then` C-bloki, sharti: o'zgaruvchi ro'yxatdan «=» son ro'yxatdan (faqat «teng»).** Bola o'zgaruvchining o'zini tekshirayotganini ko'radi. **B** — 9-darsdagi shart ro'yxatiga tayyor tanlov «jon tugadi» (`if out of lives then`): sodda, lekin o'zgaruvchi ko'rinmaydi va qadam uchun yana bitta tanlov kerak. **C** — «=», «<», «>» uchalasi: taqqoslash — 55-dars, erta.
3. **Manfiy son — A: `change jon by -1` (Scratch'dagidek), ustoz «minus bir» deb o'qiydi.** **B** — ro'yxatda «−1» o'rniga so'z bilan («1 kam») — blok Scratch va JavaScript'dan uzoqlashadi.
4. **`game over` oilasi — A: Hodisa** (o'yin bloklari bir joyda: «▶ bosilganda», tugma, tegish, o'yin tugadi). **B** — Shart oilasi (Scratch'da `stop all` boshqaruv oilasida, `if` bilan). **C** — yangi oila «O‘yin» (yangi rang — ranglar ko'payadi).
5. **Kaktus — A: devordek (o'tib bo'lmaydi), har urinish — bitta tegish.** Yo'l haqiqatan to'siladi, ehtiyot bo'lib o'ynash kerak bo'ladi. **B** — qahramon kaktus katagiga kiradi (olmadek), jon kamayadi, kaktus qoladi — yo'l to'silmaydi, kaktus ustidan yugurib o'tib ketsa bo'ladi.
6. **Qoidani sinash pog'onalari (8 · 1, 8 · 2, 15 · 1) — A: bola ataylab tegadi / qadamni tugatadi, o'yin 0 da tugasa — «Shart ishladi!».** Bu DASTUR'dagi natijaning o'zi («jon tugasa «O'yin tugadi» chiqadi»). **B** — dvigatel qoidani o'zi sinaydi (ko'rinmas qahramon bilan) — KOD ko'p, bola o'z qoidasi ishlaganini ko'rmaydi.
7. **Qadam 0 bo'lgan bosishda yulduzga yetsa — A: o'yin tugadi** (bosish tartibi 9-darsdagidek: strelka → istalgan tugma → yulduz; «qadam: 12» — 11 ta bosish; 14-qadamda ustoz ko'rsatadi). **B** — yulduz avval tekshiriladi (yutadi), lekin sahnada «qadam: 1» qolib ketadi — sanoq bolaga chalkash ko'rinadi.
8. **3-bekat tayyor o'yin bilan ochiladi — A** (ball + jon, 9 blok; 2-bekatdagi «oltin olma — jon», «kaktus — ball» o'zgarishlari 3-bekat maydonlariga aralashmaydi). **B** — bolaning 2-bekat dasturi bilan (`prog: 'oldingi'`).
9. **Erkin ijod — 3-bekatning ★ pog'onasi «O‘z o‘yiningiz»** (36-qaror; o'z jon, qadam, olma ballari; 16-qadamda sinfga o'qib beriladi). B — ★ yopiq masala.
10. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi natija 12–13-daqiqada — chegarada (1-pog'onada to'rt blok va to'rtta tanlov: tur, o'zgaruvchi, son, `if` o'zgaruvchisi). Kechiksa — 1-pog'onada `change jon by -1` tayyor turadi, bola faqat shartni qo'shadi.
2. **8–9-dars manbalari tasdiqlanmagan:** `if … then` ramkasining nomi va rangi (8-dars), `when any key pressed` (9-dars, «any» tanlovi). O'zgarsa — bu darsda faqat ikki qoida (jon, qadam) va 14-qadam moslanadi.
3. Manfiy son 9 yoshliga: «−1» va «minus bir» tushunarlimi; tushunilmasa — «Savollar» 3-B.
4. Dastur ustuni: 3-bekatda 14 ta blok (boshqaruv qatoridan tashqari), ichida ikki `if` — sig'adimi, shrift kichraymaydimi (setka darvozasi).
5. Bolalar ataylab yutqazishi (1-bekat 1–2-pog'ona) — sinfda kulgi va shovqin; vaqt yetadimi.
6. «qadam: 12 — 11 ta bosish» qoidasi — bola 12-bosishda yulduzga yetib, «O‘yin tugadi» ni ko'rsa xafa bo'ladimi; tushunilmasa — «Savollar» 7-B.
7. Jon 0 dan o'tib ketishi (jon 3, kaktus −2: 3 → 1 → −1) — «=» hech qachon «ha» demaydi; 8 · 2 da shunday xato varianti bor (Kamvoy «Jon tugadi-ku!»). 9 yoshli bola sababini tushunadimi.
8. 11 · 3 «Qimmat kaktus» — bola kaktusga tegmasa, kaktus dasturchasi faqat ko'rinishidan tekshiriladi (blok bor-yo'qligi); o'ynab isbotlanmaydi.
9. 13-dars manbasi hali yo'q — 17-qadamdagi «Keyingi dars · 13 · Tasodifiy son» va «olmalar har safar boshqa joyda chiqadi» gapi DASTUR'dan olindi.
10. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (21.11, avtopilot — foydalanuvchi ko'rigi kutilmoqda; har birida tanlangan yo'l, istalganini keyin o'zgartirsa bo'ladi)

1. **«Savollar» 1–10 — hammasi tavsiya (A) bo'yicha:** vaqt — qadamlar; shart `if jon = 0 then` (8-darsdagi ramka, faqat «=»); manfiy son «−1»; `game over` — Hodisa oilasida; kaktus — devordek; sinov pog'onalari; qadam 0 bo'lgan bosishda o'yin tugaydi; 3-bekat tayyor o'yin bilan; ★ «O‘z o‘yiningiz».
2. **Sinov pog'onasida (15 · 1) yulduzga yetish — yechim emas:** «Oz qoldi!», «Qadam 5 bo‘lsin: 5-bosishda o‘yin tugasin» (qadam katta qo'yilsa yetib borsa bo'lardi). Qadam 0 da, lekin 5-bosishda emas tugasa — xuddi shu gap. Manbada bu holat yo'q edi.
3. **15 · ★ «Oz qoldi!» — uchinchi band** «Jon qoidasi kerak» (manbada ikki band edi, shartda esa jon qoidasi ham bor).
4. **Kapsulalar rangi:** ball — jigarrang (11-dars), jon — qizil, qadam — ko'k; sahnada faqat dasturda ishlatilgan o'zgaruvchilar (ostma-ost). Manbada rang aytilmagan.
5. **«O‘yin tugadi»** — sahna yuqorisida yog'och taxta (qahramonni yopmaydi), «tuk» tovushi; «▶ Boshlash» bilan yana o'ynasa bo'ladi.
6. **Kaktus rasmi** — tuvakdagi yashil kaktus; tegilganda qahramon turtiladi va joyida qoladi (9-darsdagi devordek).
7. **Dastur pog'onadan pog'onaga if ichidagilari bilan** o'tadi (Blockly'ning o'z saqlash shaklida); 2-bekat — bolaning 1-bekat dasturi bilan (yo'q bo'lsa — tayyor jon qoidasi), 3-bekat — tayyor o'yin bilan.
8. **7, 10, 14-qadam:** jonli darsda dasturda faqat manbadagi tayyor qism (ustoz qolganini javondan qo'shadi); solo'da to'liq dastur tayyor turadi va ishora ko'rsatiladi.
9. **Natija:** «ta o‘yin yutdi» — yutish pog'onalari (sinov pog'onasi sanalmaydi); «ta shart qo‘ydi» va «ta o‘zgaruvchi ishlatdi» — eng ko'pi (yig'indi emas: dastur pog'onadan pog'onaga o'tadi, yig'indi bitta shartni o'n marta sanardi). Sinf natijasi — bolalar sonlarining yig'indisi.
10. **11 · 2 oltin olma dasturchasi yo'q** — 12-darsdagi gap («…hodisa blokida turini tanlang»; 11-darsda «olma turini»).
11. **«Jon tugadi-ku!» / «Qadam tugadi-ku!»** — bir o'yinda bir marta chiqadi, o'yin davom etadi (manba: «o‘yin davom etyapti»).
12. **3-bekat zinapoyasi:** 1-pog'ona («Besh qadam») kartasida yulduz chizilgan — maydonda boshqa narsa yo'q; qolgan kartalarda yulduz yo'q (javobni ochmaydi).
13. **Manba matni:** «Yordam va xato»dagi «noto'g'ri», «xato qildingiz» va «Tekshirilmagan joylar» havolasi — oddiy qo'shtirnoqda (ekran gapi emas); 7, 10, 14-qadamdagi namunaviy sonlar va muammocha namunalari ustoz varag'ida.

