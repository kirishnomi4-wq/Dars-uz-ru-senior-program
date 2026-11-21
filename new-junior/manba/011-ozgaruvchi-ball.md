# 11-dars. O'zgaruvchi: ball sanash

> **Holat: v1.1 — QURILDI (21.11 tun, avtopilot: «Savollar» 1–11 tavsiya A bo'yicha; qurishda qabul qilingan qarorlar — oxirida, «Qurishdagi qarorlar» 1–14). Foydalanuvchi ko'rigi kutilmoqda — QA saytda «ko‘rikda».** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/011-ozgaruvchi-ball/`) shundan quriladi. Eng muhimi — 1-savol (o'zgaruvchi bloklari va rangi) va 2-savol (o'zgaruvchi nomi o'zbekcha — `ball`).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–10-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 11-dars («O'zgaruvchi: ball sanash» — natija: olma terish o'yini, ball sanaladi; o'rganadi: kompyuter sonni eslab qolishi va o'zgartirishi; nega: ball, jon va vaqt shusiz bo'lmaydi; tekshiruv: qiymatni oldindan aytish, avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Har topshiriq manba yozilganda kichik dastur bilan simulyatsiya qilindi (natija jadvalda: eng qisqa yo'l, yakuniy ball, xato variantlari, oldindan aytish javoblari); dars qurilganda sinov — `sinov/dvigatel/ozgaruvchi.mjs` (**KOD**).
> 3–8-dars auditidan saboq: sinf doskasidagi rasm va pog'ona nomi javobni ochmaydi; ikki pog'onaning javobi bir xil emas (jadval ostida tekshiruv); maslahat yo'nalish beradi, javobni aytmaydi (A·2); 16-qadamda bola o'z oxirgi yechgan pog'onasini ko'radi (A·1); start, olma, oltin olma va yulduz bezak kataklariga tushmaydi.

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** olma terish o'yini, ball sanaladi. **Bu manbada:** 4-darsdagi «Olma terish» o'yini, lekin endi ballni bolaning dasturi sanaydi: `when touching apple` ostida `change ball by 1` — olmaga tekkanda ballga 1 qo'shiladi; `when ▶ clicked` ostida `set ball to 0` — o'yin noldan boshlanadi. Sahnada ball ko'rinib turadi: «ball: 3».
- **Bola nimani tushunadi:** kompyuter sonni eslab qoladi — **o'zgaruvchida**. O'zgaruvchining nomi bor (`ball`) va soni bor (sahnada «ball: 3»). `change` songa qo'shadi, `set` sonni qo'yadi (avvalgi son unutiladi). Kompyuter sonni o'zi nolga qaytarmaydi — o'yin qayta boshlansa ham eslab turadi; shuning uchun o'yin boshida `set ball to 0`. Dasturni o'qib, oxirida ball nechchi bo'lishini oldindan aytsa bo'ladi.
- **Tekshiruv (dasturdan):** qiymatni oldindan aytish (avto) — 3-bekatda bola tayyor dasturni o'qiydi, oxirida ball nechchi bo'lishini **son kartalaridan** tanlaydi, keyin «▶ Tekshirish» bilan o'zi tekshiradi (3-darsdagi bayroqcha o'rniga son kartasi; sinfga savol emas — har bolaning o'z topshirig'i, 3-dars «Qarorlar» 5). 1–2-bekatda ham avto: o'yin yutildi va ball aytilgan songa teng.
- **Vaqt:** reja 63 daqiqa, zaxira 17–27 daqiqa (dars 80–90 daqiqa). Zaxira — 8- va 11-qadamdagi o'yinlarga (bolalar ko'proq o'ynaydi).
- **Uch bekat:** 1 · Ball — 2 · Noldan — 3 · Oldindan aytamiz. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror).
- **Oldingi darslar bilan bog'lanish:** 4-dars — «Olma terish» o'yini («▶ Boshlash», strelka dasturchalari, yashirin yulduz); u yerda olma hisobini («Olma: N / M») o'yinning o'zi ko'rsatardi — bugun sanashni bolaning dasturi qiladi. 3-dars — oldindan aytish (bayroqcha). 5-dars — `repeat` (3-bekatdagi tayyor dasturda bor, bola faqat o'qiydi). 9–10-dars — labirint o'yini; 10-dars yakunidagi va'da: «Keyingi darsda o‘yinda ball sanaymiz: kompyuter sonni eslab qoladi.» — shu dars. Bu dars 3–6-darsdagi bog' maydonida (devorsiz), o'yin rejimida; labirint, kalit, eshik va shart bloki bu darsda yo'q.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, maydonni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–8 | Savolga javob beradi: Coddy uch olma teradi — ekranda ballni qanday sanaymiz? Sinf uchalasini sinaydi: `say "1"` — doim «1», uchta `say` — birinchi olmadayoq «3», `change ball by 1` — ball 1, 2, 3. Javob va yangi so'z: o'zgaruvchi | 2–5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz `change ball by 1` va `when touching apple` bloklarini ko'rsatadi | 7 |
| 10:30–21 | O'yiniga ball qo'shadi: har olma 1 ball → 2 ball → oltin olma → ★ oltin olma 10 ball | 8 |
| 21–24 | Ustoz o'yinni ikki marta o'ynaydi — ball noldan boshlanmaydi; `set ball to 0` ni ko'rsatadi | 9–10 |
| 24–35 | O'yinni noldan, 10 balldan, 3 balldan boshlaydi; ★ da o'z o'yinining sonlarini o'zi tanlaydi | 11 |
| 35–37 | Xulosa: o'zgaruvchi | 12 |
| 37–52 | Ustoz dasturni o'qib, ballni oldindan aytadi; bola to'rt dasturning yakuniy balini oldindan aytadi | 13–15 |
| 52–57 | O'yinining dasturini sinfga o'qib beradi — ustoz Coddy bilan o'ynaydi | 16 |
| 57–63 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: 2 ta blok, o'n bosish) — 12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida). 5-darsga qaraganda kirish va huk 1 daqiqa qisqa — shu sababli.

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| o'zgaruvchi | kompyuter eslab qoladigan son; uning nomi bor, soni o'zgaradi | 5 (va 12, 17) | uch bo'lak birma-bir: ustida «ball» yorlig'i bor quti, ichida «0» → `change ball by 1` yonadi, qutidagi son «1» ga almashadi → yana ikki marta — «3», sahnadagi «ball: 3» |

Yordamchi so'zlar (ta'rifsiz, tushunarli): ball, son, nom, qo'shish, o'yin boshi, oltin olma, son kartasi, oldindan aytish. 1–10-darsdan: blok, dastur, dasturcha, buyruq, qahramon, yulduz, olma, qadam, katak, maydon, hodisa, tugma, strelka, o'yin, yutish, takrorlash, marta, pog'ona.
Bir ma'noga bitta so'z: «o‘zgaruvchi» (tushuncha; ekranda «xotira», «quti», «yacheyka» deyilmaydi — quti faqat 5-qadam rasmida va ustozning o'z so'zida); «ball» (o'zgaruvchining nomi va o'yindagi son; «hisob», «ochko» deyilmaydi); «son» (o'zgaruvchida turgani; «qiymat» deyilmaydi — «Savollar» 3); «qo‘shish» (`change` ning bu darsdagi ishi; «oshirish», «ko‘paytirish» deyilmaydi); «qo‘yish» (`set` ning ishi — «ballni 0 qil»; «tozalash», «nollash» deyilmaydi); «o‘yin boshi» («▶ Boshlash» bosilgan lahza — `when ▶ clicked`); «terish» (olmani — qahramon olmaga tekkanda olma teriladi; «yig‘ish» deyilmaydi); «tekkanda» (`when touching` ning ma'nosi, 9-darsdagi «tegdi» bilan bir so'z); «son kartasi» (3-bekatda tanlanadigan javob; «variant» deyilmaydi).
Bu darsda AYTILMAYDI (keyingi darslarniki): jon, qadam o'zgaruvchisi, `game over`, ayirish va manfiy son, kaktus, shart bilan o'zgaruvchi (12-dars), tasodifiy son (13-dars), «qiymat», `let`, `var` (JavaScript — 3-modul), o'zgaruvchi yaratish (nom yozish — «Savollar» 4).

## Maydon, o'yin va bloklar

**Maydon** — 4–6-darsdagi bog' (7 × 5, X va Y sonlari, (0, 0) pastki chapda, Y tepaga; qahramon ostida «(x, y)» yorlig'i). Bezak: daraxtlar (1, 1) · (4, 3) · (6, 1), gullar (0, 4) · (2, 3) · (5, 4) · (6, 3) — devor emas. Hech qaysi start, olma, oltin olma va yulduz bezak kataklarida va (1, 2) da (3-darsdagi daraxt joyi) emas — simulyatsiyada tekshirildi.
**O'yin** — 4-darsdagidek: asosiy tugma «▶ Boshlash» / «■ To‘xtatish», sahna ustida kichik yozuv «O‘yin: strelkalarni bosing». Hamma olma terilgach yashirin yulduz chiqadi; qahramon yulduzga yetsa — yutdi. Yulduz qochmaydi (4-darsdagi `bosh.qoch` bu darsda yo'q). Chetga urilish — «tuk», muammochasiz. **Farqi:** o'yinning o'z olma hisobi («Olma: N / M») yo'q — sanashni bolaning dasturi qiladi (**KOD**: `bosh.olmaHisob: false`).
**Oltin olma** (**KOD**): maydonda yangi narsa — oltin rangli olma; oddiy olmadek teriladi va yulduz uchun sanaladi, lekin o'z hodisasi bor (`when touching gold apple`).
**Sahnadagi ball** (**KOD**): sahnaning chap yuqori burchagida kapsula «ball: 0» — O'zgaruvchi oilasi rangida. Son o'zgarganda kapsula bir lahza kattalashadi, qahramon ustida kichik «+1» uchadi va «bos» tovushi chalinadi. Kapsula qahramonni yopmaydi. Dasturda o'zgaruvchi bloki bo'lsa ko'rinadi.
**Son o'yindan o'yinga saqlanadi** (**KOD**, «Savollar» 8): «■ To‘xtatish» yoki yutgandan keyin «▶ Boshlash» qayta bosilsa — qahramon startga, olmalar joyiga qaytadi, ball esa o'zgarmaydi (kompyuter eslab turadi). Ballni faqat `set` boshqa songa qo'yadi. 2-bekat pog'onalari «ball: 5» bilan ochiladi — o'tgan o'yindan qolgan ball (`bosh.v: { ball: 5 }`).
**Boshqaruv tayyor** (**KOD**, «Savollar» 6): to'rt strelka dasturchasi (4-darsdagi, `when → key pressed` + `move right` va hokazo) har pog'onada tayyor — dastur ustunining tepasida yig'ilgan bitta qator «Boshqaruv: → ← ↑ ↓»; bosilsa ochiladi. Bloklar sanog'iga kirmaydi.

**Bloklar** — uch oila: yangi **O'zgaruvchi** (rang — «Savollar» 1), Hodisa (to'q sariq; ikki yangi blok) va Harakat (ko'k; faqat boshqaruv ichida). Gap, Takrorlash, Shart, Ko'rinish va Tovush javonda yo'q (3-bekatdagi tayyor dasturda `repeat` bor — bola o'qiydi, qo'ymaydi).

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `change ball by 1` | ballga 1 qo'sh | o'zgaruvchidagi songa aytilgan sonni qo'shadi; sahnadagi ball o'zgaradi. O'zgaruvchi ro'yxatdan (bu darsda faqat `ball`), son ro'yxatdan: 1, 2, 3, 4, 5, 10 (**KOD**) | **yangi**: 7-qadam |
| `when touching apple` | olmaga tekkanda | **boshli blok** (4-darsdagi `when → key pressed` kabi): qahramon olma katagiga kirib olmani terganda ostidagi bloklar bajariladi. Olma turi bosib tanlanadi: `apple` (olma) · `gold apple` (oltin olma) (**KOD**) | **yangi**: 7-qadam (oltin olma — 8 · 3) |
| `set ball to 0` | ballni 0 qil | o'zgaruvchiga aytilgan sonni qo'yadi — avvalgi son unutiladi. Son ro'yxatdan: 0–10, 12, 14, 16, 18, 20, 25, 30 (**KOD**) | **yangi**: 10-qadam |
| `when ▶ clicked` | «▶ Boshlash» bosilganda | **boshli blok**: o'yin boshlanganda bir marta, birinchi strelkadan oldin ishlaydi (**KOD**) | **yangi**: 10-qadam |
| `when → key pressed` · `move …` | (4-dars) | boshqaruv — tayyor qatorda | 4-darsdan |

Yangi oila rangi — ustoz aytadi: «O‘zgaruvchi oilasi — jigarrang. Bu bloklar sonni eslab qoladi va o‘zgartiradi.»
**Bitta bosishda tartib** (9-darsdagidek, **KOD**): 1) bosilgan strelkaning dasturchasi — qahramon yuradi; yangi katakda olma bo'lsa, u teriladi va shu zahoti `when touching apple` (yoki `gold apple`) dasturchasi ishlaydi; 2) tekshiruv: hamma olma terilgan va qahramon yulduzda — yutdi. Bir bosish tugamaguncha keyingisi o'tkazib yuboriladi (4-dars).
**Dasturchalar** ostma-ost, har biri o'z hodisa bloki bilan (4-dars). Hodisasiz bloklar xira. **Dasturda eng ko'pi 12 ta blok** (boshqaruv qatoridan tashqari; bu darsdagi eng uzun dastur — 6 ta).
**Dastur pog'onadan pog'onaga o'tadi** (4-darsdagi `prog: 'oldingi'`): har pog'ona bolaning oldingi dasturi bilan ochiladi, maydon almashadi. 1-bekat 1-pog'onasi — faqat boshqaruv bilan. 3-bekatda dastur tayyor (o'qish uchun).

**Oldindan aytish topshirig'i** (3-bekat, **KOD**, «Savollar» 5): dastur tayyor — `when ▶ clicked` ostida bloklar; javon yopiq, bloklar bosilsa ham o'zgarmaydi. Sahnada maydon o'rniga katta kapsula «ball: ?», ostida bir qatorda **oltita son kartasi** (bir xil ko'rinishda, o'sish tartibida; qahramon chapda — kartalar uni yopmaydi). Karta bosilsa tanlanadi (coral hoshiya), boshqasi bosilsa — tanlov o'tadi. Asosiy tugma «▶ Tekshirish» — karta tanlanguncha xira, yonida «Avval sonni tanlang» (12-bo'lim 32-band). Bosilsa: bloklar birma-bir yonadi, har blok yonida kichik yozuv paydo bo'ladi («ball: 3») va kapsuladagi son o'zgaradi; oxirida son tanlangan kartaga teng — «Oldindan aytdingiz!» va konfeti. Teng bo'lmasa — Kamvoy (pastda); bola dasturni qayta o'qib, boshqa kartani tanlab qayta tekshirsa bo'ladi; pog'ona to'g'ri aytilganda hisoblanadi, natijada esa faqat **birinchi urinishda** aytilganlari sanaladi.

### Topshiriqlar va tekshiruv natijasi

Dastur bilan simulyatsiya qilingan. Belgilar: «▶[0]» — `when ▶ clicked` ostida `set ball to 0`; «O[+1]» — `when touching apple` ostida `change ball by 1`; «OO[+5]» — `when touching gold apple` ostida `change ball by 5`; «→ ← ↑ ↓» — bosilgan strelkalar (eng qisqa yo'l, dastur hisoblagan). Har o'yinda yulduz hamma olma terilgach chiqadi.

| Joy | Maydon (start · olmalar · oltin · yulduz) | Yechim | Bosish (eng qisqa) | Natija (simulyatsiya) |
|---|---|---|---|---|
| Huk (2–4) | (0, 0) · (2, 0), (4, 0), (5, 2) · — · yulduzsiz | C: O[+1] | ustoz: `→→→→→↑↑` (7, tayyor) | A — O[`say "1"`]: gaplar 1, 1, 1 — «✕ doim 1»; B — O[`say "1"`, `say "2"`, `say "3"`]: birinchi olmadayoq 1, 2, 3 (keyin yana 1, 2, 3) — «✕ birdan 3»; C — ball 1, 2, 3 — «✓ ball: 3» |
| 7 (ustoz) | (0, 0) · (2, 0), (3, 2), (5, 2) · — · (5, 0) | O[+1] | 9 `→→→↑↑→→↓↓` | ball 3, yutdi |
| 8 · 1 | (0, 0) · (0, 2), (3, 1), (4, 0) · — · (6, 0) | O[+1] | 10 `↑↑→→→↓→↓→→` | ball 3 / 3 — yutdi. Dasturchasiz — ball 0 (Bo'shvoy birinchi olmada) |
| 8 · 2 | (0, 0) · (2, 1), (3, 4), (5, 2), (6, 0) · — · (0, 3) | O[+2] | 19 | ball 8 / 8 — yutdi. O[+1] qoldi — ball 4 (Kamvoy «Ball kam!») |
| 8 · 3 | (6, 4) · (3, 2), (0, 0) · (5, 0) · (3, 4) | O[+1] OO[+5] | 17 | ball 7 / 7 — yutdi. Oltin dasturchasiz — 2; oltin ham +1 — 3 |
| 8 · ★ | (3, 0) · (0, 0), (0, 3), (5, 2), (6, 4) · (3, 4) · (2, 1) | O[+2] OO[+10] | 20 | ball 18 / 18 — yutdi. O[+1] qoldi — 14 |
| 10 (ustoz) | 7-qadamdagi maydon | O[+1] → + ▶[0] | 9 + 9 + 9 | 1-o'yin: ball 3; 2-o'yin (set yo'q): 3 dan davom — ball 6; `set ball to 0` bilan — ball 3 |
| 11 · 1 | (0, 0) · (1, 3), (3, 1), (5, 2), (6, 0) · — · (4, 4); ochilganda «ball: 5» | ▶[0] O[+1] | 18 | ball 4 / 4 — yutdi. Set yo'q — 9 (Ortiqvoy «Ball ko‘p!») |
| 11 · 2 | (6, 0) · (4, 0), (2, 2), (0, 1) · — · (3, 4); «ball: 5» | ▶[10] O[+1] | 13 | ball 13 / 13 — yutdi. ▶[0] qoldi — 3 (Kamvoy «Ball kam!») |
| 11 · 3 | (0, 0) · (3, 0), (5, 3) · (2, 4) · (6, 0); «ball: 5» | ▶[3] O[+2] OO[+4] | 16 | ball 11 / 11 — yutdi. Oldingi dastur (▶[10] O[+1], oltinsiz) — 12 (Ortiqvoy) |
| 11 · ★ | (0, 0) · (2, 1), (5, 2) · (4, 4), (0, 3) · (6, 0); «ball: 5» | bolaning o'zi (namuna ▶[5] O[+3] OO[+10]) | 18 | tayyor sharti: ▶ ostida `set ball`, ikkala olma turiga dasturcha, yutdi, ball 0 dan katta. Namuna — ball 31 |

**Oldindan aytish** (3-bekat; dastur `when ▶ clicked` ostida; «R3[+2]» — `repeat 3` ichida `change ball by 2`):

| Joy | Dastur | Javob | Ball qadamma-qadam | Son kartalari | Kartadagi xato sonlar qayerdan |
|---|---|---|---|---|---|
| 14 (ustoz) | `set 0`, +2, +2, +1 | 5 | 0 → 2 → 4 → 5 | 2 3 4 5 6 7 | — |
| 15 · 1 | `set 3`, +1, +5 | 9 | 3 → 4 → 9 | 3 4 5 6 8 9 | 6 — set unutildi; 3 — faqat set; 5 — faqat oxirgi; 4, 8 — bitta change tushib qoldi |
| 15 · 2 | `set 0`, R3[+2] | 6 | 0 → 2 → 4 → 6 | 2 3 4 5 6 8 | 2 — bir marta; 3 — repeat soni; 5 — 3 + 2; 4, 8 — 2 yoki 4 marta |
| 15 · 3 | `set 0`, +5, `set 1`, +1 | 2 | 0 → 5 → 1 → 2 | 0 1 2 5 6 7 | 6 — ikkinchi set unutildi; 7 — set qo'shildi deb; 1 — set'da to'xtadi; 5 — birinchi qism |
| 15 · ★ | `set 4`, R2[+3, +2] | 14 | 4 → 7 → 9 → 12 → 14 | 9 10 11 14 15 19 | 9 — bir marta; 10 — set unutildi; 11 — faqat oxirgi blok takrorlandi; 19 — uch marta |

**Javoblar takrorlanmaydi:** bolaning pog'onalarida yakuniy ball har xil — 1-bekat 3 · 8 · 7 · 18; 2-bekat 4 · 13 · 11; 3-bekat 9 · 6 · 2 · 14 (ustoz ko'rsatganlari — 3 va 5). Yechim ham har xil: 1-bekat +1 · +2 · (+1, oltin +5) · (+2, oltin +10); 2-bekat set 0 · set 10 · (set 3, +2, oltin +4). Faqat 8 · 1 va hukdagi (7, 10-qadam) ball 3 bir xil — ustoz ko'rsatgani va bolaning birinchi pog'onasi (dastur ham bir xil, maydon boshqa — 1-pog'ona ustoz ko'rsatganining takrori).

## Yordam va xato

1–10-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); maslahat yo'nalish beradi, javobni aytmaydi (A·2). Xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga "noto'g'ri", "xato qildingiz" deyilmaydi (98-qaror). O'yin paytida chetga urilish — muammochasiz.

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | olma terildi, lekin `when touching apple` dasturchasi yo'q (o'yin to'xtamaydi) | «Olma terildi, ball-chi?» | «Olmaga tekkanda nima bo‘lsin? Buning uchun o‘z hodisa bloki bor» (**KOD**) |
| Bo'shvoy | oltin olma terildi, `gold apple` dasturchasi yo'q | «Oltin olma-chi?» | «Oltin olmaga o‘z dasturchasi kerak — hodisa blokida olma turini tanlang» |
| Kamvoy | hodisa blokining ostida blok yo'q | «Tegdim, lekin nima qilay?» | «Hodisa blokining ostiga O‘zgaruvchi oilasidan blok ulang» |
| Kamvoy | yutdi, ball aytilgandan kam | «Ball kam!» | «Ball N — M bo‘lishi kerak. Har olma necha ball?» (haqiqiy sonlar bilan; `set` bo'lsa-yu kam bo'lsa — «O‘yin boshida ball nechchi bo‘lishi kerak?»; **KOD**) |
| Ortiqvoy | yutdi, ball aytilgandan ko'p | «Ball ko‘p!» | `set` yo'q bo'lsa — «Ball N — M bo‘lishi kerak. O‘yin boshida ball K edi» (pog'ona ochilgandagi son); bo'lsa — «Ball N — M bo‘lishi kerak. Sonlarni tekshiring» (**KOD**) |
| Bo'shvoy | `when ▶ clicked` ostida blok yo'q | «Boshlandi, lekin nima qilay?» | «O‘yin boshida ball nechchi bo‘lsin? Shu blokning ostiga ulang» |
| Kamvoy | 3-bekat: ball tanlangan kartaga teng emas | «Boshqa son!» | «Ball N bo‘ldi. Dasturni qaytadan o‘qing: har blokdan keyin ball nechchi?» |
| Kamvoy | 11 · ★: tayyor sharti bajarilmadi | «Oz qoldi!» | yetishmagan bandi bilan: «O‘yin boshida ballni qo‘ying» · «Oltin olmaga ham dasturcha qo‘ying» |

Yutdi-yu ball aytilgan son emas — o'yin to'xtaydi, konfeti yo'q, muammocha chiqadi; pog'ona hisoblanmaydi. Muammocha qahramonni yopmaydi (91-qaror).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «11-dars · O‘zgaruvchi: ball», sarlavha «Bugun o‘yinda ball sanaymiz!». Coddy: «Salom! Bugun kompyuter sonni eslab qoladi.» O'ngda maydon, Coddy (0, 0) da, uchta olma. Pastda kichik karta «O‘tgan darsda»: ikki labirint rasmi — «Daraja — O‘yindagi bitta labirint» (10-dars). Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda o‘yiningizga ikkinchi daraja qo‘shdingiz.»
  2. «Bugun o‘yinda ball sanaymiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 4-darsdagi «Olma terish» o'yinini eslatadi; o'tgan dars oxiridagi va'dani aytadi — bugun shu.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «11-dars · O‘zgaruvchi: ball», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: ballni qanday sanaymiz?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Coddy uch olma teradi; har olma — 1 ball; ball ekranda chiqishi kerak. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Ballni qanday sanaymiz?». Maydon: Coddy (0, 0) da, olmalar (2, 0), (4, 0), (5, 2) da; maydon ustida kichik yozuv «Har olma — 1 ball». Coddy: «Uch olma teraman. Ekranda ball chiqsin.» Chapda uchta karta: A «Coddy «1» desin» (`when touching apple` ostida `say "1"` rasmi) · B «Bir, ikki, uch desin» (ostida `say "1"`, `say "2"`, `say "3"`) · C «Kompyuter sonni eslab qolsin» (ostida `change ball by 1` va kichik kapsula «ball: 0»). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Coddy uchta olma teradi. Har olma — 1 ball. Ball ekranda chiqsin.»
  2. «Har kim noutbukida bitta kartani tanlasin: qanday sanaymiz?»
- **O'z so'zi bilan:** kartalarni o'qiydi; 4-darsda olma hisobini o'yin o'zi ko'rsatganini eslatadi — bugun o'yinni o'zimiz tuzamiz, ballni ham o'zimiz sanaymiz; sinf javoblarini o'qiydi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Ballni qaysi yo‘l bilan sanaymiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; Coddy o'zi yuradi (tayyor bosishlar `→→→→→↑↑`, **KOD**): har olmada pufak «1» — birinchida ham, uchinchida ham. Kartada: «✕ doim 1».
  2. «Keyingi» — B: birinchi olmadayoq pufaklar ketma-ket «1», «2», «3»; keyingi olmalarda yana «1, 2, 3». Kartada: «✕ birdan 3».
  3. «Keyingi» — C: sahnada kapsula «ball: 0»; har olmada qahramon ustida «+1», kapsula «ball: 1», «ball: 2», «ball: 3». Kartada: «✓ ball: 3».
- **Tayanch gaplar:**
  1. «say faqat aytadi — u sonni eslab qolmaydi.»
  2. «Kompyuter sonni eslab qoldi va har olmada unga 1 qo‘shdi.»
- **O'z so'zi bilan:** C da sinf bilan sanaydi (1, 2, 3); B da «Coddy olmani sanamadi — yodlangan gapni aytdi».
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: kompyuter sonni eslab qoladi

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Kompyuter sonni eslab qoladi». A va B xira, C oltin; maydonda Coddy (5, 2) da, kapsula «ball: 3». Coddy: «Men 3 ni eslab qoldim.»
- **Tayanch gaplar:**
  1. «Ball — kompyuter eslab qolgan son. Har olmada unga 1 qo‘shiladi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: o'zgaruvchi

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: o‘zgaruvchi»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «O‘zgaruvchi nima?». Coddy: «O‘zgaruvchi — men eslab qoladigan son.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (`raqam` ishi):
     - 1-bosish: quti, ustida yorliq «ball», ichida «0»; yozuv «Nomi — ball, soni — 0»;
     - 2-bosish: yonida `change ball by 1` yonadi, qutidagi son «1» ga almashadi; yozuv «change — songa qo‘shadi»;
     - 3-bosish: yana ikki marta — «2», «3»; yonida sahnadagi kapsula «ball: 3»; yozuv «Nomi o‘sha — soni o‘zgardi».
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «O‘zgaruvchi — kompyuter eslab qoladigan son. Uning nomi bor.»
  2. «Soni o‘zgarib turadi — shuning uchun o‘zgaruvchi.»
- **O'z so'zi bilan:** hayotdan misol: futbol tablosidagi hisob, telefon zaryadining foizi — nomi bir, soni o'zgaradi; quti rasmini ko'rsatib: «kompyuter sonni nomli qutida saqlaydi».
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Ball → 2 · Noldan → 3 · Oldindan aytamiz; cho'qqida kichik karta «Dars oxirida · olma terish o‘yini · ball sanaladi» (kichik maydon, kapsula «ball: 7»). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Avval ballni sanaymiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: ball, noldan, oldindan aytamiz.»
  2. «Dars oxirida o‘yiningiz ballni o‘zi sanaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: change bloki

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Ball
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz ball sanashni ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «change — ballga qo‘sh». Javonda yangi oila «O‘zgaruvchi» (rang doirachasi), unda `change ball by 1`; Hodisa oilasida yangi blok `when touching apple`. Dasturda tayyor qator «Boshqaruv: → ← ↑ ↓». Maydonda Coddy (0, 0) da, olmalar (2, 0), (3, 2), (5, 2) da; sahnada kapsula «ball: 0».
  2. Ustoz javondan `when touching apple` ni bosadi — yangi dasturcha; keyin `change ball by 1` — u hodisa ostiga ulanadi.
  3. «▶ Boshlash»; ustoz strelkalar bilan teradi (`→→→↑↑→→↓↓`): har olmada «+1» — «ball: 1», «ball: 2», «ball: 3»; yulduz (5, 0) da chiqadi, Coddy yetadi — «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Olmaga tekkanda — ballga 1 qo‘shiladi.»
  2. «ball — o‘zgaruvchining nomi. Sahnada — uning soni.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** rangini aytadi: «O‘zgaruvchi oilasi — jigarrang. Bu bloklar sonni eslab qoladi va o‘zgartiradi.»; `when touching apple` — «olmaga tekkanda», hodisa — 4-darsdagidek; `change` dagi son bosib tanlanadi (3-darsdagi `go to` sonlaridek); boshqaruv tayyor — 4-darsda tuzgansiz.
- **Ustoz qiladi:** ikki blok qo'shadi, «▶ Boshlash», strelkalarni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Ball: pog'onalar

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Ball
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Ball sanang!». Coddy: «Olmaga tekkanda ballga qo‘shing.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Uch olma» · 2 «Ikki ball» · 3 «Oltin olma» · ★ «Oltin — 10» (har kartada qahramon va olmalar rasmi; yulduz chizilmaydi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Har pog‘ona tepasida yozilgan: har olma necha ball.»
  2. «O‘ynab ko‘ring: ball aytilgan son bo‘lsin.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; «Ball nechchi bo‘lishi kerak? Sahnada nechchi?» deb so'raydi; 3-pog'onada oltin olma uchun ikkinchi dasturcha kerakligini darrov aytmaydi — bola o'zi topsin.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda O'zgaruvchi (`change ball by 1`) va Hodisa (`when touching apple`); dasturda «Boshqaruv: → ← ↑ ↓»; sahnada «ball: 0». Hamma pog'onada ishora boshida: «Olmaga tekkanda ballga qancha qo‘shilsin?».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Uch olma», ostida «Har olma — 1 ball. Ball 3 bo‘lsin.». Start (0, 0); olmalar (0, 2), (3, 1), (4, 0); yulduz (6, 0). «Maslahat»: «Qaysi hodisa bloki olmaga tekkanda ishlaydi?».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Ikki ball», ostida «Har olma — 2 ball. Ball 8 bo‘lsin.». Start (0, 0); olmalar (2, 1), (3, 4), (5, 2), (6, 0); yulduz (0, 3). «Maslahat»: «change blokidagi son — har olmada qancha qo‘shilishi».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Oltin olma», ostida «Olma — 1 ball, oltin olma — 5 ball.». Start (6, 4); olmalar (3, 2), (0, 0); oltin olma (5, 0); yulduz (3, 4). «Maslahat»: «Oltin olmaga o‘z dasturchasi kerak: hodisa blokida olma turini tanlang».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Oltin — 10», ostida «Olma — 2 ball, oltin olma — 10 ball.». Start (3, 0); olmalar (0, 0), (0, 3), (5, 2), (6, 4); oltin olma (3, 4); yulduz (2, 1). «Maslahat»: «Ikkala dasturchadagi sonni tekshiring».
  Yutsa va ball to'g'ri: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** hodisa blokini va `change` ni qo'shadi, sonni (3-pog'onadan olma turini ham) tanlaydi, «▶ Boshlash», o'ynaydi.
- **Tekshiruv:** o'yin yutildi va ball = aytilgan son (avto).
- **Xatoda:** dasturcha yo'q — Bo'shvoy «Olma terildi, ball-chi?»; oltin olma dasturchasi yo'q — Bo'shvoy «Oltin olma-chi?»; hodisa ostida blok yo'q — Kamvoy «Tegdim, lekin nima qilay?»; ball kam — Kamvoy «Ball kam!»; ball ko'p — Ortiqvoy «Ball ko‘p!».

## 9 · 2-bekat

- **Vaqt:** 0:21–0:22 (1 daqiqa)
- **Bekat:** 2 · Noldan
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: noldan»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Ball ✓, oltin yoy; Coddy 2-bekatda; 2 · Noldan miltillaydi. Coddy: «Endi o‘yinni qaytadan boshlaymiz.»
- **Tayanch gaplar:**
  1. «Ballni sanadik. Endi o‘yin qayta boshlanganda nima bo‘lishini ko‘ramiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: set bloki

- **Vaqt:** 0:22–0:24 (2 daqiqa)
- **Bekat:** 2 · Noldan
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz o‘yinni qayta boshlayapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «set — ballni 0 qil». 7-qadamdagi o'yin: Coddy (0, 0) da, uchta olma, dasturda «Boshqaruv» va `when touching apple` → `change ball by 1`; sahnada «ball: 0».
  2. «▶ Boshlash», ustoz teradi — «ball: 3», «Siz yutdingiz!».
  3. «▶ Boshlash» yana: Coddy startga, olmalar joyiga qaytadi — kapsula «ball: 3» turibdi. Ustoz teradi — «ball: 4», «5», «6». Sahna ustida yozuv «Olma 3 ta — ball 6».
  4. Javonda yangi bloklar: Hodisada `when ▶ clicked`, O'zgaruvchida `set ball to 0`. Ustoz `when ▶ clicked` ni bosadi — yangi dasturcha; `set ball to 0` — ostiga ulanadi. «▶ Boshlash» — kapsula «ball: 0»; teradi — «ball: 3».
- **Tayanch gaplar:**
  1. «Kompyuter sonni o‘zi unutmaydi — o‘yin qayta boshlansa ham eslab turadi.»
  2. «O‘yin boshida ballni 0 qilamiz: when ▶ clicked — set ball to 0.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** set va change farqi: set — sonni qo'yadi (avvalgisi unutiladi), change — songa qo'shadi; futbol o'yini boshida tablo 0:0 bo'ladi; `when ▶ clicked` — «▶ Boshlash» bosilganda, strelkalardan oldin bir marta.
- **Ustoz qiladi:** ikki marta o'ynaydi, ikki blok qo'shadi, yana o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Noldan: pog'onalar

- **Vaqt:** 0:24–0:35 (11 daqiqa)
- **Bekat:** 2 · Noldan
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «O‘yinni boshlang!». Coddy: «O‘yin boshida ballni o‘zingiz qo‘ying.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya: 1 «Noldan» · 2 «Sovg‘a» · 3 «Uch va oltin» · ★ «O‘z o‘yiningiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Har pog‘ona o‘tgan o‘yindan qolgan ball bilan ochiladi — sahnaga qarang.»
  2. «O‘yin boshida ball nechchi bo‘lishini set bloki aytadi.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «O‘yin boshida ball nechchi? Olmadan keyin-chi?» deb so'raydi; ★ da «O‘yiningizda olma necha ball beradi?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda O'zgaruvchi (`set ball to 0`, `change ball by 1`) va Hodisa (`when ▶ clicked`, `when touching apple`); dastur 8-qadamdagi dasturi bilan ochiladi (yo'q bo'lsa — boshqaruv va `when touching apple` → `change ball by 1`); sahnada «ball: 5» va kichik yozuv «O‘tgan o‘yindan qolgan ball». Hamma pog'onada ishora boshida: «O‘yin boshida ball nechchi bo‘lishi kerak?».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Noldan», ostida «O‘yin 0 dan boshlansin. Har olma — 1 ball.». Start (0, 0); olmalar (1, 3), (3, 1), (5, 2), (6, 0); yulduz (4, 4); kerak — ball 4. «Maslahat»: «O‘yin boshlanganda qaysi hodisa bloki ishlaydi?».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Sovg‘a», ostida «O‘yin 10 balldan boshlansin. Har olma — 1 ball.». Start (6, 0); olmalar (4, 0), (2, 2), (0, 1); yulduz (3, 4); kerak — 13. «Maslahat»: «set blokidagi son — o‘yin boshidagi ball».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Uch va oltin», ostida «O‘yin 3 balldan. Olma — 2, oltin olma — 4 ball.». Start (0, 0); olmalar (3, 0), (5, 3); oltin olma (2, 4); yulduz (6, 0); kerak — 11. «Maslahat»: «Uchta son bor: o‘yin boshi, olma, oltin olma — har birini tekshiring».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «O‘z o‘yiningiz», ostida «Boshidagi ballni va olmalar necha ball berishini o‘zingiz tanlang.». Start (0, 0); olmalar (2, 1), (5, 2); oltin olmalar (4, 4), (0, 3); yulduz (6, 0). «Maslahat»: «set va change bloklaridagi sonlarni o‘zingiz tanlang — keyin o‘ynab ko‘ring». Erkin ijod (36-qaror).
  1–3-pog'onada yutsa va ball to'g'ri: «Siz yutdingiz!» va konfeti; ★ da: «O‘yiningiz tayyor!».
- **Bola qiladi:** `when ▶ clicked` va `set` ni qo'shadi, sonlarni tanlaydi, o'ynaydi; ★ da o'z sonlarini tanlaydi.
- **Tekshiruv:** o'yin yutildi va ball = aytilgan son (avto). ★ — `when ▶ clicked` ostida `set ball`, ikkala olma turiga dasturcha bor, o'yin yutildi, ball 0 dan katta.
- **Xatoda:** set yo'q (5 dan boshlandi) — Ortiqvoy «Ball ko‘p!» («Ball 9 — 4 bo‘lishi kerak. O‘yin boshida ball 5 edi»); ball kam — Kamvoy «Ball kam!»; `when ▶ clicked` ostida bo'sh — Bo'shvoy «Boshlandi, lekin nima qilay?»; ★ sharti — Kamvoy «Oz qoldi!».

## 12 · Xulosa: o'zgaruvchi

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Noldan
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: o‘zgaruvchi»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «O‘zgaruvchi». Coddy: «Nomi bir xil — soni o‘zgaradi.» Ikki karta: «set ball to 0 — Sonni qo‘yadi» (`set` bloki) va «change ball by 1 — Songa qo‘shadi» (`change` bloki); o'ngda maydon — Coddy yulduzda, kapsula «ball: 3».
- **Tayanch gaplar:**
  1. «set — sonni qo‘yadi. change — songa qo‘shadi.»
  2. «O‘yin boshida — set, olmada — change.»
- **O'z so'zi bilan:** 10-qadamdagi «ball 6» ni eslatadi — set bo'lmasa, kompyuter eski sonni eslab turadi; o'zgaruvchi o'yinda boshqa narsani ham sanaydi (keyingi darsda — jon).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 3 · Oldindan aytamiz
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: oldindan aytamiz»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Oldindan aytamiz miltillaydi. Coddy: «Oxirgi bekat: dasturni o‘qib, ballni oldindan aytamiz.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — oldindan aytamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: dasturni o'qib, ballni oldindan aytamiz

- **Vaqt:** 0:38–0:40 (2 daqiqa)
- **Bekat:** 3 · Oldindan aytamiz
- **Ekran:** proyektor — Blok studiya (ustoz, oldindan aytish) · bola «Ustoz ekraniga qarang» («Ustoz dasturni o‘qiyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Ball nechchi bo‘ladi?». Dasturda tayyor: `when ▶ clicked`, ostida `set ball to 0`, `change ball by 2`, `change ball by 2`, `change ball by 1`. Sahnada katta kapsula «ball: ?», ostida son kartalari 2 3 4 5 6 7; Coddy chapda.
  2. Ustoz bloklarni yuqoridan pastga o'qiydi — har «Keyingi» bosishda blok yonida kichik yozuv (**KOD**): «ball: 0», «ball: 2», «ball: 4», «ball: 5».
  3. Ustoz «5» kartasini bosadi — u tanlanadi.
  4. «▶ Tekshirish»: bloklar birma-bir yonadi, kapsula 0 → 2 → 4 → 5 — kartaga teng: «Oldindan aytdingiz!», konfeti.
- **Tayanch gaplar:**
  1. «Dasturni yuqoridan pastga o‘qing: set — sonni qo‘yadi, change — qo‘shadi.»
  2. «Oxirgi son — javob. Kartani bosing, keyin tekshiring.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** sanashni barmoq bilan ko'rsatadi; «set kelsa — sanashni shu sondan boshlaymiz».
- **Ustoz qiladi:** «Keyingi»ni bosadi (to'rt marta), kartani bosadi, «▶ Tekshirish»ni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Oldindan aytamiz: pog'onalar

- **Vaqt:** 0:40–0:52 (12 daqiqa)
- **Bekat:** 3 · Oldindan aytamiz
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Oldindan ayting!». Coddy: «Dasturni o‘qing, sonni tanlang, keyin tekshiring.» Chapda katta son «Uch marta oldindan aytdi 6 / 14» va belgilar; o'ngda zinapoya: 1 «Uch blok» · 2 «Takrorlash» · 3 «Ikki set» · ★ «Ichida ikki blok» (kartalarda faqat dastur bloklarining kichik rasmi — son kartasi chizilmaydi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Dasturni yuqoridan pastga o‘qing: har blokdan keyin ball nechchi?»
  2. «Sonni tanlang, keyin «Tekshirish»ni bosing.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Ikkinchi set kelganda oldingi son nima bo‘ladi?» deb so'raydi; 2-pog'onada 5-darsdagi `repeat` ni eslatadi; ★ da «repeat ichidagi ikki blok — ikkalasi ham takrorlanadi».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dasturda tayyor bloklar (bola o'zgartirmaydi — o'qiydi); javon yopiq; sahnada «ball: ?» va oltita son kartasi. Asosiy tugma «▶ Tekshirish» — karta tanlanguncha xira, yonida «Avval sonni tanlang». Hamma pog'onada ishora boshida: «Dasturni o‘qing: oxirida ball nechchi bo‘ladi?».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Uch blok». Dastur: `set ball to 3`, `change ball by 1`, `change ball by 5`. Kartalar: 3 4 5 6 8 9. «Maslahat»: «set — boshlanish soni. Keyin har change ni qo‘shib boring».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Takrorlash». Dastur: `set ball to 0`, `repeat 3` ichida `change ball by 2`. Kartalar: 2 3 4 5 6 8. «Maslahat»: «repeat ichidagi blok necha marta bajariladi?».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Ikki set». Dastur: `set ball to 0`, `change ball by 5`, `set ball to 1`, `change ball by 1`. Kartalar: 0 1 2 5 6 7. «Maslahat»: «Dasturda ikkita set bor. set nima qilishini eslang».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Ichida ikki blok». Dastur: `set ball to 4`, `repeat 2` ichida `change ball by 3`, `change ball by 2`. Kartalar: 9 10 11 14 15 19. «Maslahat»: «Har safar repeat ichidagi ikkala blok ham bajariladi».
  To'g'ri: kapsuladagi son kartaga teng — «Oldindan aytdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** dasturni o'qiydi, sanaydi, kartani bosadi (o'zgartirsa bo'ladi), «▶ Tekshirish»ni bosadi.
- **Tekshiruv:** dastur tugaganda ball = tanlangan karta (avto). Boshqa son bo'lsa kartani almashtirib qayta tekshirsa bo'ladi; pog'ona to'g'ri aytilganda hisoblanadi; natijada faqat birinchi urinish sanaladi.
- **Xatoda:** Kamvoy «Boshqa son!» («Ball N bo‘ldi. Dasturni qaytadan o‘qing: har blokdan keyin ball nechchi?»).

## 16 · O'yiningiz dasturini o'qib bering

- **Vaqt:** 0:52–0:57 (5 daqiqa)
- **Bekat:** 3 · Oldindan aytamiz
- **Ekran:** proyektor — Blok studiya (ustoz, 7-qadamdagi maydon, dasturda faqat «Boshqaruv») · bola — o'z oxirgi yechgan pog'onasi (A·1)
- **Sahna:** 12-bo'lim 3-band: bola o'yinining dasturini ovoz chiqarib o'qiydi («▶ bosilganda — ballni 5 qil. Olmaga tekkanda — ballga 3 qo‘sh. Oltin olmaga tekkanda — ballga 10 qo‘sh»), ustoz o'sha bloklarni qo'yadi va o'ynaydi; sinf ball qanday o'zgarishini kuzatadi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Dasturingizni o‘qib bering». Maydon, Coddy (0, 0) da, olmalar; dasturda faqat «Boshqaruv»; kapsula «ball: 0». Coddy: «Siz o‘qiysiz — men o‘ynayman.»
  2. Bola o'qiydi; ustoz bloklarni qo'yadi, sonlarni tanlaydi; «▶ Boshlash» — teradi, sinf ballni kuzatadi.
  3. Ikki-uch bola.
- **Tayanch gaplar:**
  1. «Kim o‘yinining dasturini o‘qib beradi? Avval o‘yin boshi, keyin olmalar.»
  2. «Kuzating: ball qanday o‘zgaradi.»
- **O'z so'zi bilan:** bolani maqtaydi; o'yin oxiridagi balni sinf bilan sanaydi.
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, o'ynaydi.
- **Parta:** bola noutbukida o'z oxirgi yechgan pog'onasi o'z dasturi (3-bekatda — tayyor dasturi va tanlagan kartasi) bilan qayta ochiladi, ishora «Dasturingizni ustozga o‘qib bering»; hech narsa yechmagan bolada — «Ustoz ekraniga qarang». Shu ekranda qayta o'ynasa natija qayta sanalmaydi.
- **Bola qiladi:** dasturini o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:57–1:00 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz ball sanadingiz!». Bugungi so'z: «O‘zgaruvchi — Kompyuter eslab qoladigan son». Pastda: ✓ Ball · ✓ Noldan · ✓ Oldindan aytamiz. Kichik karta «Keyingi dars · 12 · Jon va qadam» («Savollar» 10).
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: ball sanadik, noldan boshladik, oldindan aytdik.»
  2. «Bugungi so‘z — o‘zgaruvchi: kompyuter eslab qoladigan son.»
  3. «Keyingi darsda o‘yinda jon bo‘ladi: jon tugasa — o‘yin tugaydi.»
- **O'z so'zi bilan:** «o‘zgaruvchi» nimaligini bolalardan aytdiradi; ikki-uch boladan eng katta balini so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz ball sanadingiz!». Coddy o'rniga qahramon: «Olmalarni terdim — kompyuter ballni eslab qoldi.» «Siz bugun»: N ta olma terdi · eng katta ball: N · N marta oldindan aytdi (haqiqiy son; **KOD**). O'z qahramoni maydonda, kapsula «ball: N» (eng katta ball); «Keyingi darsda jon bilan ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:00–1:03 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta olma terdi · N marta oldindan aytdi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda jon bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Kompyuter bir sonni ham, mingta sonni ham unutmaydi.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–10-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); Coddy tayyor bosishlar bilan o'zi yuradi; natija kartaning o'zida.
- 5, 14-qadam: «Keyingi»ni bola o'zi bosadi (bo'laklar va blok yonidagi yozuvlar birma-bir yonadi).
- 7, 10-qadam (ustoz ko'rsatadi): dastur tayyor turadi, bola o'zi «▶ Boshlash» va strelkalarni bosadi (10-qadamda ikki marta o'ynaydi, keyin `set` tayyor qo'shiladi va yana o'ynaydi); 14-qadamda kartani o'zi tanlaydi (ishora: «5 kartasini bosing, keyin «Tekshirish»»).
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-011-ozgaruvchi-ball-v1` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Hisobchi» (`hisobchi`) — 8-qadamda 1-pog'ona bajarildi (birinchi ball); «Oldindan bildi» (`bildi`) — 15-qadamda 3-pog'ona birinchi urinishda aytildi (ikki set).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk (ball qanday sanaladi). Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating, keyin bolalar o'zi bajaradi. 3-bekatdagi «oldindan aytish» — har bolaning o'z topshirig'i (son kartasini tanlaydi va o'zi tekshiradi), sinfga savol emas.
- Yangi oila — O'zgaruvchi (jigarrang), ikki blok: `change ball by 1` — ballga 1 qo'sh; `set ball to 0` — ballni 0 qil. Hodisada ikki yangi blok: `when touching apple` — olmaga tekkanda (olma turi tanlanadi: olma yoki oltin olma); `when ▶ clicked` — «▶ Boshlash» bosilganda. Birinchi chiqqanda bir marta ayting; sonni bosib tanlashni sekin ko'rsating.
- Bugungi asosiy fikr bitta: **kompyuter sonni eslab qoladi — o'zgaruvchida; `change` qo'shadi, `set` qo'yadi.** Hukda, 10-qadamda («ball 6») va 3-bekatda chiqadi.
- 4-darsda olma hisobini o'yinning o'zi ko'rsatardi — bu darsda yo'q. Bola «avval o‘zi sanardi-ku» desa: «Bugun o‘yinni o‘zimiz tuzamiz — ballni ham o‘zimiz sanaymiz».
- Boshqaruv (to'rt strelka) tayyor turadi — bolalar uni qayta tuzmaydi; bosilsa ochiladi.
- 2-bekat pog'onalari «ball: 5» bilan ochiladi — bu ataylab: set bo'lmasa, o'yin eski sondan boshlanadi.
- 16-qadamda bolaning ismi proyektorga chiqmaydi: bola dasturini o'zi o'qiydi, siz bosasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **O'zgaruvchi oilasi va ikki blok:** `set ball to 0`, `change ball by 1` (Blockly; Blockly'ning o'z `variables_set` bloklari emas — bola o'zgaruvchi yaratmaydi): o'zgaruvchi maydoni — JrSon ro'yxati (`DARS.ozgaruvchi: ['ball']`), son maydoni — JrSon ro'yxati (`set`: 0–10, 12, 14, 16, 18, 20, 25, 30; `change`: 1, 2, 3, 4, 5, 10 — dars e'lonida); oq kapsula, strelkasiz (3-darsdagi `go to` sonlaridek); rang — «Savollar» 1; javonda doiracha «O‘zgaruvchi»; `BL_TUR` ga ikki yangi tur.
2. **Ikki yangi hodisa bloki:** `when ▶ clicked` — o'yin boshida bir marta, birinchi bosishdan oldin; `when touching apple` — tur ro'yxati `apple` / `gold apple`; qahramon olma katagiga kirganda, o'sha strelka dasturchasining ichida, yurishdan keyin darhol (9-darsdagi bosish tartibi).
3. **O'zgaruvchilar holati:** `h.v` (pog'ona e'loni `bosh.v`, bo'lmasa oldingi o'yindan qolgani yoki 0); «▶ Boshlash» qayta bosilganda qahramon va olmalar qaytadi, `h.v` esa o'zgarmay qoladi — boshqa songa faqat `set` qo'yadi.
4. **Sahnadagi kapsula:** chap yuqorida «ball: N», oila rangida; o'zgarganda kattalashish, qahramon ustida «+N» pufagi, «bos» tovushi; qahramonni yopmasligi setka darvozasida tekshiriladi.
5. **O'yinning olma hisobi o'chiriladi** (`bosh.olmaHisob: false`): tepa yozuv faqat «O‘yin: strelkalarni bosing»; yashirin yulduz qoidasi qoladi.
6. **Oltin olma** — maydon xaritasida yangi belgi va rasm; yulduz uchun olma qatori bilan sanaladi.
7. **Boshqaruv qatori:** to'rt strelka dasturchasi yig'ilgan bitta qator (Blockly `collapse` yoki o'z HTML), bosilsa ochiladi; blok sanog'iga kirmaydi; `prog` bilan pog'onadan pog'onaga o'tadi.
8. **Baho:** `bosh.kerak: { ball: N }` — yutdi va ball = N → «Siz yutdingiz!»; aks holda Kamvoy «Ball kam!» / Ortiqvoy «Ball ko‘p!» (ishora `set` bor-yo'qligiga qarab); 11 · ★ — erkin shart (`set` bor, ikkala tur dasturchasi bor, ball > 0).
9. **Oldindan aytish (son kartalari):** `bosh.bashoratSon: [kartalar]`; dastur tayyor va o'zgarmaydi; sahnada katta kapsula «ball: ?» va kartalar qatori; «▶ Tekshirish» (karta tanlanguncha xira); har blok yonida «ball: N» yozuvi — ijroda va 14-qadamda ustozning «Keyingi»si bilan (3-darsdagi «X: 2» yozuvi kabi); birinchi urinish natijaga alohida yoziladi.
10. **Huk kartalari:** o'yin rejimida tayyor bosishlar ketma-ketligi (Coddy o'zi yuradi, `data-bos="→→→→→↑↑"`); A — har olmada `say "1"`, B — uch `say` ketma-ket, C — `change` va kapsula.
11. **5-qadam rasmi** — uch holat oldindan chiziladi (`raqam` ishi): quti «ball» 0 → 1 → 3.
12. **Muammochalar** — yuqoridagi jadval (Bo'shvoy olma/oltin olma/▶ dasturchasi, Kamvoy/Ortiqvoy ball, Kamvoy «Boshqa son!»).
13. **Natija va yutuqlar** — `DARS.natija`: «ta olma terdi» (yutilgan o'yinlarda), «eng katta ball» (yangi tur — yig'indi emas, eng kattasi), «marta oldindan aytdi» (3-bekat, birinchi urinish); yutuqlar `hisobchi`, `bildi`. 16-qadam — A·1 (`'oxirgi'`, mavjud).
14. **Simulyatsiya sinovi** `sinov/dvigatel/ozgaruvchi.mjs` — yuqoridagi jadvallardagi har yechim, xato varianti va oldindan aytish javobi (5-darsdagi `takror.mjs` kabi; manba simulyatsiyasining skripti — sessiya qoralamasida, qurishda shu faylga ko'chiriladi).

## Savollar (tavsiya — A)

1. **O'zgaruvchi bloklari — A: ikki blok `set ball to 0` va `change ball by 1` (Scratch'dagidek), oila «O‘zgaruvchi», rang — jigarrang (#A86B32 atrofida: yog'och quti rangi — 5-qadamdagi rasm bilan bir).** Band ranglar: ko'k — Harakat, binafsha — Gap, to'q sariq — Hodisa, yashil — Takrorlash, feruza — Ko'rinish, pushti — Tovush, kulrang-ko'k — Shart, magenta — Ortiqvoy, coral — tugma va tanlov, sariq — «bajarilyapti», oltin — iz va yulduz. **B** — qizil (MakeCode'dagi o'zgaruvchi rangi): coral tugma va tanlov bilan adashadi. **C** — Scratch'dagi to'q sariq: Hodisa oilasi bilan bir xil — rad.
2. **O'zgaruvchi nomi — A: o'zbekcha `ball` (12-darsda `jon`, `qadam`).** Blok so'zlari inglizcha (60-qaror), o'zgaruvchi nomini esa dasturchi o'zi qo'yadi — Scratch'da ham, JavaScript'da ham; sahnada «ball: 3» bolaga darrov tushunarli. **B** — inglizcha `score` (`lives`, `time`) — Scratch namunalaridagidek, lekin bola yana uch inglizcha so'z yodlaydi va sahnada «score: 3».
3. **«Son», «qiymat» emas — A.** Bolaga: «o‘zgaruvchining soni». «Qiymat» — 3-modulda, JavaScript bilan (`let ball = 0`). **B** — «qiymat» hozirdan (DASTUR'dagi tekshiruv nomi «qiymatni oldindan aytish»).
4. **O'zgaruvchi ro'yxatdan — A: bola yangi o'zgaruvchi yaratmaydi** (bu darsda faqat `ball`, 12-darsda `jon`, `qadam` ham). **B** — «O‘zgaruvchi yaratish» tugmasi (nomni bola yozadi) — 12-dars ★ yoki 2-modul; yozilgan nom proyektorga chiqmaydi (12-bo'lim 3-band), qo'pol so'z filtri kerak.
5. **Oldindan aytish — A: oltita son kartasi, o'sish tartibida; xato kartalar — haqiqiy adashishlar (set unutildi, bir marta sanaldi…); qayta tanlasa bo'ladi, natijada faqat birinchi urinish.** **B** — + / − tugmali son (0–20): taxmin qilish qiyinroq, lekin bosish ko'p va kichik bolaga sekin. **C** — 3-darsdagidek istalgan urinish hisoblanadi (birinchi xatodan keyin javob ekranda ko'rinadi — oldindan aytish yo'qoladi).
6. **Boshqaruv — A: to'rt strelka dasturchasi tayyor, bitta yig'ilgan qatorda (bosilsa ochiladi, sanoqdan tashqari).** Bugungi fikr — o'zgaruvchi; dastur ustuni qisqa qoladi (12-darsda 15 ta blokgacha). **B** — to'rt dasturcha ochiq (4-darsdagidek): 8 ta blok qo'shiladi, 12-darsda ustunga sig'maydi.
7. **Olma hodisasi — A: hodisa bloki `when touching apple` (olma turi ro'yxatdan).** **B** — har strelka dasturchasiga shart `if touching apple then` (8–9-dars bloki): to'rt marta takror, va 8-dars sharti hali tasdiqlanmagan — shart bu darsda umuman yo'q.
8. **Son o'yindan o'yinga saqlanadi — A** (Scratch'dagidek; `set` ning kerakligi 10-qadamda ko'zga ko'rinadi). **B** — dvigatel har «▶ Boshlash» da ballni 0 qiladi: `set` faqat noldan boshqa son uchun kerak bo'ladi, 2-bekatning asosi yo'qoladi.
9. **Erkin ijod — 2-bekatning ★ pog'onasi «O‘z o‘yiningiz»** (36-qaror; o'z sonlari; 16-qadamda sinfga o'qib beriladi). B — ★ ham yopiq masala, erkin ijod yo'q (97-qaror istisnosi).
10. **17-qadamdagi «Keyingi dars · 12 · Jon va qadam»** — 12-dars «Savollar» 1 (vaqt — qadamlar) A bo'lsa; B bo'lsa — «Jon va vaqt».
11. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi natija 12-daqiqada — chegarada; huk sinovi uzaysa, 5-qadamni qisqartirish kerak.
2. Huk: A va B ikkalasi `say` bilan — sinf haqiqatan bo'linadimi (12-bo'lim 25-band); 4-darsdagi avtomat olma hisobini eslagan bola C ni darrov tanlashi mumkin.
3. Son kartalarini qayta tanlash — bola o'ylamasdan kartalarni birma-bir sinab chiqadimi (natijada faqat birinchi urinish sanaladi, lekin pog'ona baribir ochiladi). Sinfda kuzatiladi.
4. Jigarrang proyektorda to'q sariq Hodisa bilan ajraladimi — etalon ranglar bilan solishtiriladi.
5. 8 · 2, 8 · ★, 11 · 1 va 11 · ★ yo'llari uzun (18–20 bosish) — 4-darsdagi 15 · 2 ga yaqin; o'yin uzaysa, olma bittaga kamaytiriladi.
6. «Son o'yindan o'yinga saqlanadi» — solo'da va 16-qadamda (A·1 qayta ochilgan pog'ona) ball qaysi sondan boshlanadi: tavsiya — pog'ona e'lonidagi son.
7. 9–10-dars manbalari tasdiqlanmagan: 1-qadamdagi «O‘tgan darsda» kartasi («Daraja — O‘yindagi bitta labirint») va 10-dars yakunidagi va'da shulardan olindi.
8. «Ikki ball» (8 · 2) va «Oltin — 10» (8 · ★) nomi pog'ona qoidasini aytadi — javobni emas (son — topshiriq sharti); doskada son kartasi va yulduz chizilmaydi.
9. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (21.11, avtopilot — foydalanuvchi ko'rigi kutilmoqda; har birida tanlangan yo'l, istalganini keyin o'zgartirsa bo'ladi)

1. **«Savollar» 1–11 — hammasi tavsiya (A) bo'yicha qurildi:** O'zgaruvchi oilasi jigarrang (`#A86B32`), nom `ball`, «son» so'zi, bola o'zgaruvchi yaratmaydi, son kartalari (6 ta, birinchi urinish), boshqaruv yig'ilgan qatorda, olma — hodisa bloki, son o'yindan o'yinga saqlanadi, ★ «O‘z o‘yiningiz», keyingi dars «12 · Jon va qadam».
2. **1-bekatda ball har o'yin pog'ona sonidan (0) boshlanadi; 10-qadamdan (2-bekat) boshlab saqlanadi.** Sabab: 1-bekatda `set` bloki hali yo'q — ball saqlansa, birinchi urinishda adashgan bola (masalan 8 · 2 da +1 qoldirib 4 olgan) qayta o'ynaganda 4 + 8 = 12 bo'lib, pog'onani hech qachon yecha olmaydi. 1-bekatda bola baribir birinchi yutishdayoq keyingi pog'onaga o'tadi — saqlanish u yerda ko'rinmasdi. 10-qadamda ustoz o'yinini ikki marta o'ynaydi — «ball 6» shu yerda ko'rinadi (`bosh.saqla`). Ustoz varag'ida aytilgan.
3. **Boshqaruv qatori — o'z HTML (Blockly emas):** dastur sarlavhasi ostida «Boshqaruv: → ← ↑ ↓», o'yinda bosilgan strelka qatorda bir lahza yonadi; qator bosilsa — to'rt dasturcha rasmi ochiladi (o'qish uchun, o'zgarmaydi), «Boshqaruv tayyor — bloklar sanog‘iga kirmaydi».
4. **Javon:** 1-bekatda (7–8-qadam) `when ▶ clicked` va `set` ko'rinadi, lekin yopiq (bosilmaydi) — 1-darsdagi «hali o‘rgatilmagan bloklar» kabi; 10-qadamdan ochiq. 3-bekatda javon butunlay yopiq, dastur bloklari bosilmaydi, sudralmaydi, sonlari o'zgarmaydi.
5. **Kamvoy «Ball kam!» `set` bor bo'lsa — ishora manbadagidek faqat «O‘yin boshida ball nechchi bo‘lishi kerak?»** (son sahnada va sarlavha ostida ko'rinib turadi).
6. **11 · ★ — yetishmagan bandga uchinchisi qo'shildi:** ball 0 dan katta bo'lmasa — «Olmalar ball bersin — change blokidagi sonni tanlang» (manbada ikki band edi, shartlar to'rtta).
7. **«Oldindan bildi» yutug'i** — 3-bekat 3-pog'onasi birinchi urinishda aytilganda o'quvchi xabari (`bildi`); LMS'ga ulanish modul tugagach (93-qaror).
8. **Kapsula «ball: N»** — sahnaning chap yuqorisida, lekin maydondagi «Y ↑» yozuvini yopmasin deb biroz o'ngroqda (setka darvozasi). 2-bekatda ostida kichik yozuv «O‘tgan o‘yindan qolgan ball».
9. **3-bekat ishorasi:** boshida tasmada «Dasturni o‘qing: oxirida ball nechchi bo‘ladi?»; «▶ Tekshirish» karta tanlanguncha xira, bosilsa — «Avval sonni tanlang» (12-bo'lim 32-band). Tekshirishda har blok yonida «ball: N» yozuvi chiqadi va kapsula o'zgaradi.
10. **Huk:** kapsula faqat C kartasi sinalganda ko'rinadi (A va B da `say` — pufaklar); B kartasida uch pufak birinchi olmada ketma-ket.
11. **5-qadam rasmi** — ochiq quti, ustida yorliq «ball», ichida son: 0 → 1 → 3 (uchinchi bosishda); chap qatorda kichik quti, `change ball by 1` bloki va «ball: 3» kapsulasi.
12. **16-qadam (A·1):** 3-bekat pog'onasi bolaning tanlagan kartasi bilan qayta ochiladi (dastur o'qish uchun, javon yopiq).
13. **Dvigatel:** hodisa bloklari umumlashtirildi (`when_key`, `when_touch`, `when_start` — dasturcha boshlaydi); 1–10-darslar natijasi o'zgarmadi (oltin namuna farq 0 — HOLAT.md jurnali).
14. **Manba matni:** «Yordam va xato»dagi «noto'g'ri», «xato qildingiz» — ekran gapi emas, qo'shtirnog'i oddiy qilindi (matn darvozasi ularni ekranda qidirmasin); 10-qadam va 3-bekatdagi namunaviy gaplar («ball: 4», «Ball 9 — 4 bo‘lishi kerak…») ustoz varag'ida.

