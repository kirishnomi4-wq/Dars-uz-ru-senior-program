# 16-dars. Klonlar

> **Holat: v1.1 — QURILDI (21.11 kech, bosh seans; «Savollar» 1–10 tavsiya A bo'yicha — foydalanuvchi javobi kutilmoqda; qurishdagi qarorlar — oxirida).** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/016-klonlar/`) shundan quriladi.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–15-dars bilan bir xil (`001-tanishuv.md`: 'Ekranlar ko'rinishi', 'Yordam va xato', 'Tovush', 'Solo' bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 16-dars («Klonlar: bitta personajdan ko‘p nusxa», yangi mavzu — natija: osmondan ko'p dushman tushadi; o'rganadi: dastur ishlab turganda nusxa yaratadi; nega: ko'p dushmanli o'yinlar shusiz yasalmaydi; tekshiruv: avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida).
> 17–18-dars («Kosmik o'yin 1: raketa va o'q», «Kosmik o'yin 2: dushman, ball va jon») shu darsning sahnasi va bloklari ustiga quriladi: bugungi «Kosmos» maydoni, dushman va uning nusxalari keyingi ikki darsda qoladi («Savollar» 1).

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** osmondan ko'p dushman tushadi. **Bu manbada:** «Kosmos» maydoni (7 × 5, X va Y — 3-darsdagi maydon, kosmos rangida); tepada bitta dushman (asl). Dushmanning o'z dasturi bor («Dushman dasturi» — 13-darsdagi «Olma dasturi» kabi). Bola `create clone of myself` bloki bilan dushmandan **nusxa** yasaydi; har nusxa `when I start as a clone` dasturchasini bajaradi — tepadan pastga tushadi. `repeat 5` ichida — beshta nusxa, `random` bilan — har biri boshqa ustundan. 3-bekatda o'yin: qahramon pastda strelkalar bilan yuradi, dushmanlar tushadi, tegsa — jon kamayadi (12-dars).
- **Bola nimani tushunadi:** dushmanni besh marta chizish shart emas — dastur ishlab turganda o'zi undan nusxa yasaydi. Hamma nusxa **bitta dasturcha**ni bajaradi (`when I start as a clone`), lekin har biri o'z joyida. Asl tepada qoladi — nusxalar uning joyidan boshlaydi. Kerak bo'lmay qolgan nusxa o'chiriladi (`delete this clone`), aks holda yerda to'planib qoladi.
- **Tekshiruv (dasturdan):** avto. Har pog'onada dvigatel nusxalarni sanaydi (nechta yasaldi, nechtasi yerga yetdi, qaysi ustunlardan tushdi, maydondan chiqmadimi, yerda qolmadimi) va shart bajarilsa — «Hammasi tushdi!» (**KOD**). 3-bekatda — o'yin yutildi (hamma dushman tushib bo'ldi, jon qoldi).
- **Vaqt:** reja 68 daqiqa, zaxira 12–22 daqiqa (dars 80–90 daqiqa). Zaxira — 8-, 11- va 15-qadamdagi pog'onalarga.
- **Uch bekat:** 1 · Bitta nusxa — 2 · Ko'p nusxa — 3 · O'yin. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy; bola ishlaganda o'z qahramoni (94-qaror). 1–2-bekatda dastur **dushmanniki** (tasma boshida dushman rasmi, yonida «Dushman dasturi»); qahramon pastda o'z katagida turadi va kuzatadi. 3-bekatda qahramon strelkalar bilan yuradi (dasturchalari tayyor — «Boshqaruv», 11–12-darsdagidek), bola dushmanning dasturini tuzadi.
- **Oldingi darslar bilan bog'lanish:** 3-dars — maydon, X va Y, `go to`; 4-dars — hodisa, dasturcha, o'yin («▶ Boshlash»); 5-dars — `repeat`; 12-dars — jon, `game over`, «O‘yin tugadi»; 13-dars — `random`, «Olma dasturi» (dastur egasi — qahramon emas), «Har safar boshqa joy!». 15-dars yakunidagi va'da: «Keyingi darsda bitta qahramondan ko‘p nusxa yasaymiz.»

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, kosmos maydonini va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–7 | Savolga javob beradi: osmondan beshta dushman qanday tushadi? Sinf uchalasini sinaydi: bitta dushmanni besh marta tushirsak — bittadan tushadi; beshta dushman chizsak — beshta dastur; nusxa olsak — bitta dastur, beshta dushman | 2–4 |
| 7–8 | Yangi so'z: klon | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz `create clone of myself` va `when I start as a clone` bloklarini ko'rsatadi | 7 |
| 10:30–21 | Bitta nusxa yasaydi va uni yerga tushiradi | 8 |
| 21–23:30 | Ustoz `repeat` va `random` bilan ko'p nusxa yasaydi | 9–10 |
| 23:30–35 | Ko'p nusxa: beshta, har biri boshqa ustundan; ★ da dushman yomg'iri | 11 |
| 35–37 | Xulosa: klon | 12 |
| 37–40:30 | Ustoz o'yinni ko'rsatadi: yerda qolgan nusxa — `delete this clone` | 13–14 |
| 40:30–56 | O'yinga dushman dasturini tuzadi va o'ynaydi; ★ da o'z o'yini | 15 |
| 56–61 | Dushman dasturini sinfga o'qib beradi — ustoz Coddy bilan o'ynaydi | 16 |
| 61–68 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: 2 ta blok — nusxa yerga tushdi) — 11:30–12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| klon | dastur ishlab turganda yasalgan nusxa: ko'rinishi va dasturchasi aslniki bilan bir xil | 5 (va 12, 17) | uch bo'lak birma-bir: tepada bitta dushman (asl) → `create clone of myself` — yonida ikkinchisi paydo bo'ladi, ustida «nusxa» → uchalasi pastga tushadi, asl tepada, yozuv «Bitta dastur — ko‘p nusxa» |

Yordamchi so'zlar (ta'rifsiz, tushunarli): dushman, asl, nusxa, tushadi, yer (maydonning pastki qatori), o'chadi. 1–15-darsdan: blok, dastur, dasturcha, hodisa, qahramon, katak, maydon, X va Y, `go to`, takrorlash, tasodifiy son, o'yin, jon, «O‘yin tugadi».
Bir ma'noga bitta so'z: «nusxa» (bolaga gapda; «klon» — yangi so'zning o'zi va blok nomlari; ekranda «kopiya», «dubl» deyilmaydi); «asl» (birinchi dushman — nusxa yasaydigan; «ona», «bosh dushman» deyilmaydi); «tushadi» (tepadan pastga; 13-darsdagidek); «yer» (pastki qator, y 0; «pol», «tub» deyilmaydi); «o‘chadi» (nusxa `delete this clone` bilan; «yo‘qoladi», «o‘ladi» deyilmaydi).
Bu darsda AYTILMAYDI: «sprayt», «obyekt», «instance»; «forever» (cheksiz takrorlash); «wait» (kutish bloki — kursda yo'q: nusxalar orasidagi vaqtni dvigatel o'zi beradi); «o‘q» va «otish» (17-dars); ball (18-dars).

## Maydon, dushman va bloklar

**Maydon** («Kosmos», **KOD** 1) — 3-darsdagi maydon (7 × 5, X va Y sonlari, (0, 0) pastki chapda, Y tepaga; qahramon ostida «(x, y)» yorlig'i), kosmos rangida: kataklar to'q ko'k, bezak — yulduzchalar (devor emas, faqat rasm). Qahramon — pastki qatorda (y 0). Maydondan tashqari katak yo'q: nusxa y 0 dan pastga yurmoqchi bo'lsa — maydon chetida turtiladi, «tuk», Kamvoy «Maydon tugadi!» (3–6-darsdagidek).

**Dushman** (**KOD** 2) — kursdagi dushman rasmi (bosh tomonida ikki shoxcha, oval tana; `qismlar.mjs` dagi `dushman`). **Asl** — tepada (pog'onada ko'rsatilgan katakda, odatda (3, 4)), qimirlamaydi; dasturi — «Dushman dasturi». **Nusxa** — aslning ustida paydo bo'ladi (yengil «pup» va bir lahza oq hoshiya), o'zining `when I start as a clone` dasturchasini bajaradi. Har nusxa alohida yuradi, bir vaqtda bir nechtasi harakatda bo'lishi mumkin (**KOD** 3). Nusxa ustida kichik raqam yo'q (sanoq — sahna yonida: «Nusxa: 0 / 5», nusxa yasalganda o'sadi).

**Bloklar** — yangi oila **«Klon»** (rangi — «Savollar» 3; tavsiya: to'q sariq, Takrorlash yashil va Hodisa sariqdan farqli), Hodisa, Harakat, Takrorlash, `random`:

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `create clone of myself` | o'zimdan nusxa yasa | aslning joyida bitta nusxa paydo bo'ladi; nusxa darhol o'z dasturchasini boshlaydi, asl o'z dasturini davom ettiradi | **yangi**: 7-qadam |
| `when I start as a clone` | nusxa bo'lib boshlaganimda | hodisa (shapka) bloki — ostidagi bloklarni **har nusxa** bajaradi; aslning o'zi bajarmaydi | **yangi**: 7-qadam |
| `delete this clone` | bu nusxani o'chir | nusxa yo'qoladi (yengil «pup»); aslda hech narsa qilmaydi | **yangi**: 14-qadam |
| `when ▶ clicked` | ▶ bosilganda | dastur boshlanadi (12-darsdan) | 12-darsdan |
| `move down` | pastga yur | nusxa bir katak pastga tushadi | 2-darsdan |
| `go to x: y:` | X va Y ga bor | nusxa shu katakka sakraydi | 3-darsdan |
| `random 0 to 6` | tasodifiy son | `go to` ning X i — har nusxa boshqa ustun | 13-darsdan |
| `repeat 4` | takrorla | `move down` necha marta — nusxa shuncha pastga; `create clone` necha marta — shuncha nusxa | 5-darsdan |

**Bloklar soni:** har pog'onada chegara (N / M ta blok, to'lsa Ortiqvoy «Joy qolmadi!»); shapka bloklari ham sanaladi. Dasturda eng ko'pi 12 ta blok.
**Vaqt:** har blok — bir urish (≈ 0,7 soniya); `repeat 5` ichidagi `create clone` — beshta nusxa bir urishdan keyin bittadan paydo bo'ladi, oldingisi allaqachon tushayotgan bo'ladi — «dushman yomg'iri» o'zi chiqadi (`wait` bloki kerak emas, «Savollar» 4).
**Tekshiruv** (**KOD** 4): «▶ Ishga tushir» dan keyin hamma nusxa to'xtaguncha dvigatel kuzatadi: nechta nusxa yasaldi, har biri qayerda to'xtadi (yerdami, osilib qoldimi, maydondan chiqdimi), qaysi ustunlardan tushdi; random bo'lsa — hamma qiymatini sanab chiqadi (13-darsdagidek: nusxa maydondan chiqmasligi kerak). Shart bajarilsa — «Hammasi tushdi!» va konfeti, keyingi pog'ona o'zi ochiladi (100-qaror).
**Masalada maqsad:** kerakli sondagi nusxa yerga tushdi (y 0), har biri maydon ichida; 2-bekatda — har xil ustunlardan; 3-bekatda — o'yin yutildi.

**Topshiriqlar** (har biri dastur bilan simulyatsiya qilinadi — `sinov/dvigatel/klon.mjs`, **KOD** 12; C — `create clone of myself`, K[…] — `when I start as a clone` dasturchasi, R5[…] — `repeat 5`, go(R0-6, 4) — `go to x: (random 0 to 6) y: 4`):

| Joy | Topshiriq | Tayyor | Yechim (namuna) | Blok / chegara |
|---|---|---|---|---|
| Huk (2–4) | asl (3, 4); Coddy (3, 0); beshta dushman | — | A: R5[go(R0-6, 4) R4[↓]] — bitta dushman, navbat bilan; B: beshta dushman, har birida o'z dasturi; C: R5[C] · K[go(R0-6, 4) R4[↓]] | — |
| 7 (ustoz) | asl (3, 4); Coddy (6, 0) | — | ▶[C] · K[R4[↓]] | 5 / 5 |
| 8 · 1 | «Bitta nusxa»: asl (3, 4); qahramon (0, 0) | K[R4[↓]] | + ▶[C] | 5 / 5 |
| 8 · 2 | «Yerga»: asl (5, 4); qahramon (1, 0) | ▶[C] | + K[R4[↓]] | 5 / 5 |
| 8 · 3 | «Ikki nusxa»: asl (2, 4); qahramon (5, 0); 2 ta nusxa | K[R4[↓]] | ▶[C C] | 6 / 6 |
| 8 · ★ | «Boshqa ustun»: asl (3, 4); nusxa (1, 0) ga tushsin | ▶[C] | K[go(1, 4) R4[↓]] | 6 / 6 |
| 10 (ustoz) | asl (3, 4); Coddy (6, 0); 5 ta nusxa, har xil ustun | K[R4[↓]] | ▶[R5[C]] · K[go(R0-6, 4) R4[↓]] | 9 / 9 |
| 11 · 1 | «Beshta»: asl (3, 4); 5 ta nusxa | K[go(R0-6, 4) R4[↓]] | ▶[R5[C]] | 9 / 9 |
| 11 · 2 | «Har xil ustun»: 4 ta nusxa, kamida 2 xil ustun | ▶[R4[C]] · K[go(3, 4) R4[↓]] | random qo'yiladi: go(R0-6, 4) | 9 / 9 |
| 11 · 3 | «Chap yarmi»: nusxalar faqat 0–3 ustundan (o'ng tomonda qahramon) | ▶[R5[C]] | K[go(R0-3, 4) R4[↓]] | 9 / 9 |
| 11 · ★ | «Yomg‘ir»: 10 ta nusxa, hammasi yerga | — | ▶[R10[C]] · K[go(R0-6, 4) R4[↓]] | 9 / 9 |
| 14 (ustoz) | o'yin: 6 ta dushman; tayyor dastur `delete this clone` siz — nusxalar yerda qoladi | ▶[R6[C]] · K[go(R0-6, 4) R4[↓]] | + K oxiriga `delete this clone` | 10 / 10 |
| 15 · 1 | «Tozalang»: o'yin, 5 ta dushman; nusxa yerda qoladi | ▶[R5[C]] · K[go(R0-6, 4) R4[↓]] | + `delete this clone` | 10 / 10 |
| 15 · 2 | «Sakkizta»: o'yin, 8 ta dushman | K[go(R0-6, 4) R4[↓] D] | ▶[R8[C]] | 10 / 10 |
| 15 · 3 | «Tor yo‘l»: dushmanlar faqat 1–5 ustundan, qahramon chetda yashirinmasin | ▶[R6[C]] | K[go(R1-5, 4) R4[↓] D] | 10 / 10 |
| 15 · ★ | «O‘z o‘yiningiz»: dushman soni va ustunlar — bolaning o'zi | — | kamida 5 nusxa, random, `delete this clone`, o'yin yutildi | ≤ 12 |

(Simulyatsiya qurishda qilinadi — namunaviy yechimlar, xato variantlari va 3-bekat o'yinining yutish mumkinligi; Tekshirilmagan joylar, 1-band.)

**3-bekat o'yini** (**KOD** 5): «▶ Boshlash» — dushman dasturi boshlanadi (nusxalar tushadi) va shu payt qahramon strelkalar bilan yuradi (← → — pastki qatorda; ↑ ↓ — 3-bekatda yo'q, «Boshqaruv»da faqat ikki strelka). Jon — 3 (o'yin boshida, tayyor; 12-darsdagi kapsula «jon: 3»). Nusxa qahramon turgan katakka tushsa — jon −1, nusxa o'chadi, «tuk» (12-darsdagi kaktusga tegish kabi; tegish dasturchasi tayyor — «Savollar» 6). Jon 0 — «O‘yin tugadi». Hamma nusxa tushib bo'lsa va jon qolgan bo'lsa — «Siz yutdingiz!». Nusxa o'chmasa (`delete this clone` yo'q) — yerda qoladi va qahramonning yo'lini to'sadi (o'tib bo'lmaydi), Kamvoy «Yerda qolib ketdi!» (**KOD**).

## Yordam va xato

1–15-darsdagidek: har topshiriqda bitta «Maslahat» (bir urinishdan keyin ochiladi; ustozda «Yordam so‘radi: N ta noutbuk»); maslahat yo'nalish beradi, javobni aytmaydi. Xatoda muammocha — bitta gap, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga 'noto'g'ri', 'xato qildingiz' deyilmaydi.

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | dastur bo'sh, «▶ Ishga tushir» bosildi | «Bu yerda hech narsa yo‘q-ku…» | «Avval blokni bosing — u dasturga qo‘shiladi» |
| Bo'shvoy | `create clone` yo'q — nusxa yasalmadi | «Nusxa qani?» | «Nusxani create clone of myself bloki yasaydi» |
| Bo'shvoy | `when I start as a clone` yo'q yoki ostida blok yo'q — nusxa paydo bo'lib, turib qoldi | «Men nima qilay?» | «Nusxa when I start as a clone ostidagi bloklarni bajaradi» |
| Kamvoy | nusxa yerga yetmay to'xtadi | «Yerga yetmadi!» | «Nusxa (x, y) da to‘xtadi. Yergacha yana N ta katak» |
| Kamvoy | nusxa maydondan chiqmoqchi bo'ldi | «Maydon tugadi!» | «Nusxa yerdan ham pastga yurmoqchi bo‘ldi. move down necha marta?» (random bo'lsa — «random N ni tanladi. Maydonda X — 0 dan 6 gacha») |
| Kamvoy | nusxa kam | «Oz qoldi!» | «N ta nusxa tushishi kerak» |
| Ortiqvoy | nusxa ko'p | «Ko‘payib ketdi!» | «N ta nusxa tushishi kerak» |
| Kamvoy | 11 · 2: hamma nusxa bir ustundan | «Yana o‘sha joy!» | «Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying» |
| Ortiqvoy | 11 · 3, 15 · 3: nusxa kerakmas ustunga tushishi mumkin | «Bu yerga emas!» | «random N ni ham tanlashi mumkin. random sonlarini tekshiring» (N — ruxsat etilmagan birinchi son) |
| Kamvoy | 3-bekat: nusxa yerda qolib ketdi | «Yerda qolib ketdi!» | «Tushib bo‘lgan nusxa o‘chsin — delete this clone» |
| Ortiqvoy | dastur to'ldi | «Joy qolmadi!» | «Dasturga N ta blok sig‘adi» |

Ishora (muammochasiz): nusxalar harakatda — sahnadagi sanoq o'sadi; hammasi to'xtadi va shart bajarildi — «Hammasi tushdi!». Bir nechta sabab bo'lsa — avval birinchi ko'ringani (maydondan chiqish, yerga yetmaslik), keyin sanab topilgani. Muammocha qahramonni yopmaydi (91-qaror).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «16-dars · Klonlar», sarlavha «Bugun nusxa yasaymiz!». Coddy: «Salom! Bugun bitta dushmandan ko‘p nusxa yasaymiz.» O'ngda «Kosmos» maydoni, tepada bitta dushman, Coddy (3, 0) da. Pastda kichik karta «O‘tgan darsda»: rul va xarita — «Xakaton — Birga, oz vaqtda bitta narsa yasash». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda do‘stingiz bilan birga o‘yin yasadingiz.»
  2. «Bugun yangi bloklar: dastur o‘zi nusxa yasaydi.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; xakatonda kim qaysi o'yinni yasaganini eslatadi; bugungi maydon — kosmos, keyingi ikki darsda shu yerda kosmik o'yin yasaymiz.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «16-dars · Klonlar», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: beshta dushmanni qanday tushiramiz?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror), «qanday qilamiz?» (12-bo'lim 25-band). Avval dard: dushmanning dasturi tayyor — `repeat 4` [`move down`]; «▶»: bitta dushman tushadi, o'yin zerikarli. Kerak — osmondan beshta dushman. Uchala javob ham yangi boshlovchi o'ylaydigan fikr (12-bo'lim 8-band).
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Ko‘p dushmanni <em>qanday</em> tushiramiz?». Maydonda tepada bitta dushman, Coddy pastda. Coddy: «Bitta dushman tushdi. Bizga beshta kerak.» Chapda uchta karta: A «Bittasini besh marta tushiramiz» (bitta dushman va aylanma strelka rasmi) · B «Beshta dushman chizamiz» (beshta dushman, har biri ostida kichik dastur) · C «Dushmandan nusxa olamiz» (bitta dushman, yonida xira nusxalari). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Bizning dushman bitta. Osmondan beshta dushman qanday tushadi?»
  2. «Har kim noutbukida bitta kartani tanlasin.»
- **O'z so'zi bilan:** kartalarni o'qiydi; sinf javoblarini o'qiydi (faqat son). Qaysi usul yaxshi ekanini aytmaydi — buni sinov ko'rsatadi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Beshta dushmanni qaysi yo‘l bilan tushiramiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Sahna:** kartalar o'z dasturi bilan o'zi o'ynaladi (14–15-dars kabi; **KOD** 9). Har kartada kichik sanoq: osmonda bir vaqtda nechta dushman, dasturda nechta blok.
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kattalashadi: bitta dushman tushadi, tepaga qaytadi, yana tushadi… besh marta. Osmonda doim bitta. Kartada: «✕ bittadan tushadi».
  2. «Keyingi» — B: beshta dushman birdan tushadi, lekin dastur ustunida beshta bir xil dastur, «20 ta blok». Kartada: «✕ beshta bir xil dastur».
  3. «Keyingi» — C: tepadagi dushmandan bittadan nusxa chiqadi va tushadi — osmonda bir vaqtda uch-to'rttasi, dastur ustunida bitta dastur, «7 ta blok». Kartada: «✓ bitta dastur, beshta dushman».
- **Tayanch gaplar:**
  1. «Bittasini qayta-qayta tushirsak — osmonda doim bitta dushman. Beshta chizsak — beshta bir xil dastur.»
  2. «Nusxa olsak — dastur bitta, dushman esa ko‘p.»
- **O'z so'zi bilan:** A da «o‘yinda dushmanlar bir vaqtda tushishi kerak»; B da «yuzta dushman kerak bo‘lsa — yuzta dastur yozamizmi?»; C da tepadagi dushman joyidan qimirlamaganini ko'rsatadi — nusxalar undan chiqadi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta) — sinovlarni dvigatel o'zi o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: dastur o'zi nusxa yasaydi

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Dastur o‘zi <em>nusxa</em> yasaydi». A va B xira, C oltin; maydonda tepada asl, pastda beshta nusxa (har xil ustunda). Coddy: «Bitta dastur yozdik — dushman o‘zidan beshta nusxa yasadi.»
- **Tayanch gaplar:**
  1. «Dushmanni bir marta yasaymiz. Nusxalarni dastur o‘zi yasaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: klon

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z (uch bo'lak birma-bir, `raqam` ishi) · bola «Ustoz ekraniga qarang» («Yangi so‘z: klon»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Klon <em>nima</em>?». Coddy: «Klon — dastur ishlab turganda yasalgan nusxa.» Uch bo'lak xira.
  2. «Keyingi» — 1-bo'lak: tepada bitta dushman, ostida «Asl».
  3. «Keyingi» — 2-bo'lak: `create clone of myself` bloki; dushman yonida ikkinchisi, ustida «nusxa».
  4. «Keyingi» — 3-bo'lak: uchala nusxa pastga tushadi, asl tepada; yozuv «Bitta dastur — ko‘p nusxa». Ostida ta'rif: «Klon — Dastur ishlab turganda yasalgan nusxa».
- **Tayanch gaplar:**
  1. «Klon — nusxa. Ko‘rinishi ham, dasturchasi ham aslniki bilan bir xil.»
  2. «Asl joyida qoladi. Nusxa uning joyidan boshlaydi.»
- **O'z so'zi bilan:** hayotdan misol: printer bitta rasmdan ko'p nusxa chiqaradi; o'yinlarda yomg'ir tomchilari, yulduzlar, dushmanlar — ko'pincha nusxalar.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima <em>qilamiz</em>?». Tepalik: 1 · Bitta nusxa → 2 · Ko‘p nusxa → 3 · O‘yin; cho'qqida kichik karta «Dars oxirida · dushman yomg‘iri» (kichik kosmos maydoni, dushmanlar va qahramon). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Oxirida dushmanlardan qochadigan o‘yin.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: bitta nusxa, ko‘p nusxa, o‘yin.»
  2. «Dars oxirida o‘yiningizda osmondan dushmanlar tushadi — qochib qutulasiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: nusxa yasaymiz

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Bitta nusxa
- **Ekran:** proyektor — Blok studiya (ustoz, «Dushman dasturi»; asl (3, 4), Coddy (6, 0)) · bola «Ustoz ekraniga qarang» («Ustoz nusxa yasayapti — kuzating»)
- **Sahna:** 12-bo'lim 12-band — qadamma-qadam. Javonda yangi oila «Klon» (ikki blok) va Hodisa, Takrorlash, Harakat. Dastur bo'sh.
- **Qadamlar:**
  1. Ustoz `when ▶ clicked` va uning ostiga `create clone of myself` qo'yadi, «▶ Ishga tushir»: asl ustida nusxa paydo bo'ladi («pup») — va turib qoladi. Bo'shvoy «Men nima qilay?», ishora «Nusxa when I start as a clone ostidagi bloklarni bajaradi».
  2. Ustoz yangi dasturcha qo'yadi: `when I start as a clone` → `repeat 4` [`move down`]. «▶»: nusxa paydo bo'ladi va to'rt katak pastga tushadi — yerga. Asl tepada qoladi. «Hammasi tushdi!».
- **Tayanch gaplar:**
  1. «create clone of myself — o‘zimdan nusxa yasa. Mana, nusxa paydo bo‘ldi — lekin u nima qilishni bilmaydi.»
  2. «when I start as a clone — nusxa shu dasturchani bajaradi. Asl esa joyida qoladi.»
- **O'z so'zi bilan:** yangi oila rangini aytadi («to‘q sariq — klon bloklari»); ikki dasturcha borligini ko'rsatadi: biri asl uchun (▶ bosilganda), biri nusxa uchun.
- **Ustoz qiladi:** bloklarni qo'yadi, ikki marta ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · O'zingiz: bitta nusxa

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Bitta nusxa
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya, zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Nusxani <em>tushiring</em>!». Coddy: «Nusxa yasang — u yerga tushsin.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Bitta nusxa» · 2 «Yerga» · 3 «Ikki nusxa» · ★ «Boshqa ustun» — har kartada kichik kosmos maydoni (asl va nusxaning tushish joyi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Ikki dasturcha bor: biri — asl uchun, biri — nusxa uchun.»
  2. «Nusxa qayerda to‘xtadi? Yergacha yana nechta katak?»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** aylanadi; «nusxa paydo bo‘ldi-yu, yurmadi» degan bolaga — «nusxaning dasturchasi qani?»; 3-pog'onada ikki nusxa bitta ustundan ketma-ket tushishini ko'rsatadi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; yorliq «Mashq · 1-pog‘ona», sarlavha — pog'ona nomi, izoh — topshiriq (jadval); tasma boshida dushman rasmi va «Dushman dasturi»; N / M ta blok; sahna yonida «Nusxa: 0 / 1». Tugmalar: «Maslahat» (qulf bilan), «▶ Ishga tushir».
  - 1 «Bitta nusxa» — «Nusxa yasang: when ▶ clicked ostiga create clone of myself» (nusxaning dasturchasi tayyor).
  - 2 «Yerga» — «Nusxa yerga tushsin» (create clone tayyor).
  - 3 «Ikki nusxa» — «Ikkita nusxa yerga tushsin».
  - ★ «Boshqa ustun» — «Nusxa (1, 0) ga tushsin».
- **Bola qiladi:** bloklarni qo'yadi, ishga tushiradi, nusxa qayerda to'xtaganini ko'radi, tuzatadi.
- **Tekshiruv:** nusxalar soni va to'xtagan joyi (avto, **KOD** 4).
- **Xatoda:** Yordam va xato jadvali (nusxa qani, men nima qilay, yerga yetmadi, maydon tugadi, oz qoldi, ko'payib ketdi).

## 9 · 2-bekat

- **Vaqt:** 0:21–0:21:30 (0,5 daqiqa)
- **Bekat:** 2 · Ko'p nusxa
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: ko‘p nusxa»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Bitta nusxa ✓, oltin yoy; Coddy 2-bekatda; 2 · Ko‘p nusxa miltillaydi. Coddy: «Endi ko‘p nusxa — har biri boshqa joydan.»
- **Tayanch gaplar:**
  1. «Bitta nusxani yasadik. Endi beshtasini — va har biri boshqa ustundan.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: ko'p nusxa

- **Vaqt:** 0:21:30–0:23:30 (2 daqiqa)
- **Bekat:** 2 · Ko'p nusxa
- **Ekran:** proyektor — Blok studiya (ustoz; asl (3, 4), Coddy (6, 0); tayyor: ▶[C] · K[R4[↓]]) · bola «Ustoz ekraniga qarang» («Ustoz ko‘p nusxa yasayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz `create clone of myself` ni `repeat 5` ichiga qo'yadi, «▶»: besh nusxa bittadan paydo bo'ladi va hammasi bir ustundan tushadi — yerda ustma-ust, sanoq — beshta; Kamvoy «Yana o‘sha joy!». Ustoz: beshtasi bir joyda.
  2. Ustoz nusxa dasturchasining boshiga `go to x: (random 0 to 6) y: 4` qo'yadi, «▶»: har nusxa avval o'z ustuniga sakraydi, keyin tushadi — osmonda bir vaqtda uch-to'rttasi. «Hammasi tushdi!».
- **Tayanch gaplar:**
  1. «repeat 5 ichida create clone — beshta nusxa.»
  2. «Har nusxa o‘z random sonini tanlaydi — shuning uchun har biri boshqa ustundan tushadi.»
- **O'z so'zi bilan:** 13-darsdagi `random` ni eslatadi; nusxalar bir vaqtda harakatlanayotganini ko'rsatadi («dushman yomg‘iri»).
- **Ustoz qiladi:** ikki blok qo'shadi, ikki marta ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · O'zingiz: ko'p nusxa

- **Vaqt:** 0:23:30–0:35 (11,5 daqiqa)
- **Bekat:** 2 · Ko'p nusxa
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya, zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Dushman <em>yomg‘iri</em>!». Coddy: «Ko‘p nusxa yasang — har biri boshqa joydan.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya: 1 «Beshta» · 2 «Har xil ustun» · 3 «Chap yarmi» · ★ «Yomg‘ir». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Nechta nusxa kerak? repeat soni — shuncha.»
  2. «random qaysi ustunlarni tanlay oladi? Kerakmas joyga tushmaydimi?»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** 3-pog'onada qahramon o'ng tomonda turadi — dushmanlar unga tushmasin; ★ da o'nta nusxa — blok chegarasi o'zgarmaydi (repeat soni o'zgaradi, blok emas).
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; sahna yonida «Nusxa: 0 / 5».
  - 1 «Beshta» — «Beshta nusxa tushsin» (nusxaning dasturchasi tayyor).
  - 2 «Har xil ustun» — «Nusxalar har xil ustundan tushsin».
  - 3 «Chap yarmi» — «Nusxalar faqat chap yarmiga tushsin: 0 dan 3 gacha».
  - ★ «Yomg‘ir» — «O‘nta nusxa — hammasi yerga».
- **Bola qiladi:** `repeat` va `random` sonlarini tanlaydi, ishga tushiradi, kuzatadi.
- **Tekshiruv:** nusxalar soni, ustunlari (random qiymatlari sanab chiqiladi), yerga yetgani (avto).
- **Xatoda:** jadvaldagidek; 11 · 2 da — «Yana o‘sha joy!», 11 · 3 da — «Bu yerga emas!».

## 12 · Xulosa: klon

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Ko'p nusxa
- **Ekran:** proyektor — xulosa (ikki karta) · bola «Ustoz ekraniga qarang» («Xulosa: klon»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «<em>Klon</em>». Ikki karta: `create clone of myself` — «Asldan nusxa yasaydi» · `when I start as a clone` — «Har nusxa shuni bajaradi». Coddy: «Asl bitta. Nusxa — qancha kerak bo‘lsa.»
- **Tayanch gaplar:**
  1. «Asl nusxa yasaydi. Nusxa o‘z dasturchasini bajaradi.»
  2. «Yuzta dushman kerak bo‘lsa ham — dastur bitta.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:37:30 (0,5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: o‘yin»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · O‘yin miltillaydi. Coddy: «Endi dushmanlardan qochamiz!»
- **Tayanch gaplar:**
  1. «Oxirgi bekat: dushman yomg‘iri o‘yinga aylanadi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: yerda qolgan nusxa

- **Vaqt:** 0:37:30–0:40:30 (3 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — Blok studiya, o'yin rejimi (ustoz; Coddy (3, 0), «jon: 3»; tayyor dushman dasturi: ▶[R6[C]] · K[go(R0-6, 4) R4[↓]]) · bola «Ustoz ekraniga qarang» («Ustoz o‘yinni ko‘rsatyapti — kuzating»)
- **Sahna:** «Boshqaruv» qatori — ← → dasturchalari tayyor (11–12-darsdagidek, bloklar sanog'iga kirmaydi). Nusxa qahramonga tushsa — jon −1, nusxa o'chadi («tuk»).
- **Qadamlar:**
  1. Ustoz «▶ Boshlash»ni bosadi va ← → bilan qochadi: nusxalar tushadi va **yerda qoladi** — pastki qatorda dushmanlar to'planadi, Coddy ularning orasida qamalib qoladi. Kamvoy «Yerda qolib ketdi!», ishora «Tushib bo‘lgan nusxa o‘chsin — delete this clone».
  2. Ustoz nusxa dasturchasining oxiriga yangi blok `delete this clone` qo'yadi, yana o'ynaydi: har nusxa yerga tushgach o'chadi («pup»); bitta nusxa Coddy'ga tushadi — jon: 2. Hamma nusxa tushib bo'ldi — «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Nusxa yerga tushdi — endi u kerak emas. U yo‘lni to‘sib qoldi.»
  2. «delete this clone — bu nusxani o‘chir. Asl o‘chmaydi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** `delete this clone` yangi blok ekanini va «Klon» oilasida ekanini aytadi; 12-darsdagi jonni eslatadi.
- **Ustoz qiladi:** ikki marta o'ynaydi, bitta blok qo'shadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · O'zingiz: o'yin

- **Vaqt:** 0:40:30–0:56 (15,5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya, o'yin rejimi, zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Dushmandan <em>qoching</em>!». Coddy: «Dushman dasturini tuzing — keyin qochib yuting.» Chapda katta son «Uch pog‘onani tugatdi 6 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Tozalang» · 2 «Sakkizta» · 3 «Tor yo‘l» · ★ «O‘z o‘yiningiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Avval dushman dasturi, keyin o‘yin. Tushgan nusxa o‘chsin.»
  2. «Jon tugasa — yana boshlang. Dasturingiz to‘g‘ri bo‘lsa, yutish mumkin.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** qiyin bo'lsa — dushmanlar sonini kamaytirish mumkin emas (pog'ona sharti), lekin ← → ni oldindan bosib turish yordam beradi; ★ da o'z o'yini — dushmanlar soni va ustunlari bolaning o'zi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya, o'yin rejimi: sahnada «jon: 3», «Nusxa: 0 / 5»; «Boshqaruv» qatori (← →); asosiy tugma «▶ Boshlash».
  - 1 «Tozalang» — «Tushgan nusxa o‘chsin, keyin yuting» (dushman dasturi `delete this clone` siz tayyor).
  - 2 «Sakkizta» — «Sakkizta dushman — va yuting» (nusxa dasturchasi tayyor).
  - 3 «Tor yo‘l» — «Dushmanlar 1 dan 5 gacha ustundan tushsin» (asl qismi tayyor).
  - ★ «O‘z o‘yiningiz» — «Kamida beshta dushman — o‘yinni o‘zingiz tuzing».
- **Bola qiladi:** dushman dasturini tuzadi, «▶ Boshlash», ← → bilan qochadi; jon tugasa — qaytadan.
- **Tekshiruv:** dastur sharti («▶ Boshlash» bosilganda — muammochasiz) va o'yin yutildi (avto).
- **Xatoda:** jadvaldagidek; «Yerda qolib ketdi!»; jon 0 — «O‘yin tugadi» (12-dars), ishora «Jon tugadi. ▶ Boshlash — yana o‘ynang».

## 16 · Dushman dasturingizni o'qib bering

- **Vaqt:** 0:56–1:01 (5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — Blok studiya (ustoz, 15 · ★ maydoni, dushman dasturi bo'sh) · bola — oxirgi yechgan pog'onasi o'z dasturi bilan (A·1, 12–14-darsdagidek)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Dasturingizni <em>o‘qib bering</em>». Coddy: «Siz o‘qiysiz — men o‘ynayman.» Bola dushman dasturini o'qiydi, ustoz bloklarni qo'yadi va Coddy bilan o'ynaydi. Proyektorda ism yo'q.
- **Tayanch gaplar:**
  1. «Kim dushman dasturini o‘qib beradi? Avval asl, keyin nusxa.»
  2. «Nechta nusxa? Qaysi ustunlardan?»
- **O'z so'zi bilan:** sinf bilan birga o'ynaydi; nusxa o'chmasa nima bo'lishini eslatadi.
- **Ustoz qiladi:** bola o'qiganini qo'yadi, o'ynaydi.
- **Parta:** oxirgi yechgan pog'onasi (o'z dasturi bilan).
- **Bola qiladi:** o'qib beradi yoki tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 1:01–1:04 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz nusxa <em>yasadingiz</em>!». Bugungi so'z: «Klon — Dastur ishlab turganda yasalgan nusxa». Pastda: ✓ Bitta nusxa · ✓ Ko‘p nusxa · ✓ O‘yin. Kichik karta «Keyingi dars · 17 · Kosmik o‘yin 1».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: bitta nusxa, ko‘p nusxa, o‘yin.»
  2. «Bitta dastur — ko‘p nusxa. Tushgan nusxa o‘chadi.»
  3. «Keyingi darsda kosmik o‘yin: raketa o‘q otadi.»
- **O'z so'zi bilan:** «klon» nimaligini bolalardan aytdiradi; keyingi ikki darsda shu dushmanlar raketaga qarshi chiqishini aytadi.
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz nusxa yasadingiz!»; qahramon gapi «Bitta dushmandan ko‘p nusxa yasadim!»; «Siz bugun»: «ta nusxa yasadi» · «ta o‘yin yutdi» · «pog‘ona bajardi» (son kartaning boshida, haqiqiy son; 13–14-darsdagidek); maydonda qahramon, osmonda bir nechta nusxa; «Keyingi darsda kosmik o‘yinda ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:04–1:08 (4 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz <em>bugun</em>». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): «ta nusxa yasadi» · «ta o‘yin yutdi» · «pog‘ona bajardi»; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda kosmik o‘yin bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Bugun sinfimiz 600 ta nusxa yasadi!» (haqiqiy son bilan)
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–15-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»).
- 5-qadam: bo'laklarni bola o'zi yoqadi («Keyingi»).
- 7-, 10-, 14-qadam: dastur tayyor turadi — bola o'zi ishga tushiradi va o'zgartiradi (7: tayyor ▶[C] · K[R4[↓]]; 10: tayyor ▶[R5[C]] · K[go(R0-6, 4) R4[↓]], ishora «Har nusxa o‘z random sonini tanlaydi — ishga tushiring»; 14: tayyor `delete this clone` siz — bola o'zi qo'shadi, ishora «Nusxa dasturchasining oxiriga delete this clone qo‘ying»).
- Pog'ona bajarilsa — keyingisi o'zi ochiladi (100-qaror); 16- va 18-qadam yo'q.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-016-klonlar-v1`, kalit `jr016` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi.
- Yutuqlar: «Nusxachi» (`nusxachi`) — 1-bekatning 1-pog'onasi (birinchi nusxa yerga tushdi); «Dushman yomg‘iri» (`yomgir`) — 2-bekatning ★ pog'onasi (o'nta nusxa).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- **Bugungi asosiy fikr:** dushmanni bir marta yasaymiz — nusxalarni dastur o'zi yasaydi; har nusxa `when I start as a clone` ni bajaradi; tushgan nusxa o'chadi. Hukda, xulosada (12) va yakunda chiqadi.
- **Ikki dasturcha:** «asl uchun» (`when ▶ clicked` — nusxa yasaydi) va «nusxa uchun» (`when I start as a clone` — nusxa nima qiladi). Bola adashsa — «qaysi dasturchani asl bajaradi, qaysini nusxa?» deb so'rang.
- Yangi bloklar — uchta, oila «Klon» (to'q sariq): `create clone of myself` va `when I start as a clone` — 7-qadamda, `delete this clone` — 14-qadamda. Blok nomini o'zbekcha bir marta ayting.
- Nusxalar bir vaqtda harakatlanadi — bu normal: har nusxa o'z dasturchasini o'zi bajaradi.
- Yechimni aytmang: «Nusxa qayerda to‘xtadi? Yergacha nechta katak? Nechta nusxa kerak — repeat soni nechchi? random qaysi ustunlarni tanlaydi?»
- 3-bekat o'yini qiyin tuyulsa — dushmanlar sonini kamaytirish yo'q; ← → ni erta bosishni maslahat bering.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **«Kosmos» maydoni** — 3-darsdagi `maydon` (7 × 5, X va Y), kosmos rangida (kataklar to'q ko'k, bezak — yulduzchalar); dars uslubida (`DARS.maydon.dunyo: 'kosmos'`).
2. **Dushman (asl)** — maydonda alohida rasm (`qismlar.mjs` `dushman`), joyi — pog'onaning `asl: [x, y]`; dastur egasi — dushman (tasma boshida rasm va «Dushman dasturi», 13-darsdagi «Olma dasturi» kabi).
3. **Nusxalar** — bir vaqtda bir nechta: har nusxa o'z joyi (x, y) va o'z SVG rasmi bilan; `when I start as a clone` dasturchasi har nusxada alohida ijro (ijrochi.js — har nusxa uchun alohida `ijro`); harakat — `move`, `go to` (maydonBajar kabi, iz qoldirmaydi), maydon cheti — Kamvoy; `delete this clone` — nusxa olinadi.
4. **Tekshiruv** — `bosh.klon`: { soni, yer (hammasi y 0 da), ustun: 'xil' | [x…] (ruxsat etilgan ustunlar), maydon } — hamma nusxa to'xtagach; random qiymatlari sanab chiqiladi (13-dars `olmaDastur` usuli); «Nusxa: N / M» sanog'i.
5. **3-bekat o'yini** — `bosh.oyin` + `bosh.klon`: «▶ Boshlash» bilan dushman dasturi va qahramon boshqaruvi BIR VAQTDA (nusxalar ijrosi strelka bosishlarini to'smaydi); «Boshqaruv» qatori ← → (11–12-dars `bq-q`); jon 3 (kapsula), nusxa qahramon katagiga tushsa — jon −1, nusxa o'chadi, «tuk»; jon 0 — game over, «O‘yin tugadi»; hamma nusxa tushib bo'lsa — yutdi. Yerda qolgan nusxa — devor (qahramon o'ta olmaydi), Kamvoy «Yerda qolib ketdi!».
6. **Yangi bloklar** (`blockly.js`): `create_clone` (oddiy blok), `when_clone` (shapka — `BL_HODISA` ga), `delete_clone` (oddiy; ostidagi bloklar bajarilmaydi — nusxa o'chdi); yangi oila «Klon» (rang, javon tugmasi, `IKON`).
7. **Huk** (2–4): uch karta o'z dasturi bilan o'zi o'ynaladi — A: bitta dushman besh marta; B: beshta dushman — har birining dasturi (dastur ustunida beshta dastur); C: nusxalar.
8. **Javon** — pog'onaning o'z javoni (14-darsdagi `JAVON` usuli).
9. **Huk kartalari va doskalardagi kichik maydon** — kosmos rangida (asl va tushish joylari).
10. **Natija** — `DARS.natija`: «ta nusxa yasadi» (muvaffaqiyatli ishga tushirishlardagi hamma nusxa), «ta o‘yin yutdi», «pog‘ona bajardi» — bola va sinf bitta kalit bilan (13–14-darsdagidek).
11. **Solo** — 7, 10, 14-qadamda tayyor dastur (`prog: [jonli, solo]`).
12. **Sinov skripti** `sinov/dvigatel/klon.mjs` — har pog'ona namunaviy yechim va xato variantlari bilan (mustaqil hisob bilan solishtirish), 3-bekat o'yinining yutish mumkinligi (har urug'da), nusxalar bir vaqtda.

## Savollar (tavsiya — A)

**Qabul (25.11, foydalanuvchi — ko‘rik sahifasi 10-versiya): hammasi A.**

1. **Sahna — A: «Kosmos» maydoni (3-darsdagi maydon, kosmos rangida), qahramon pastda, dushmanlar tepadan; 17–18-darsda o'sha sahna** (raketa va o'q shu yerda). Sabab: dasturdagi natija «osmondan dushman tushadi» va keyingi ikki dars «kosmik o‘yin»; X va Y bola uchun tanish. **B** — bog' maydoni (11–13-darsdagi): **−** 17-darsda sahna almashadi.
2. **Dastur kimniki — A: dushmanniki («Dushman dasturi»), qahramon 1–2-bekatda kuzatadi** (13-dars «Olma dasturi» usuli). Sabab: nusxa — dushmanning nusxasi; qahramonning dasturi bilan aralashmaydi. **B** — qahramon dasturi ichida «dushman yasash»: **−** Scratch'dagi «har personajning o'z dasturi» fikri buziladi.
3. **«Klon» oilasining rangi — A: to'q sariq (Scratch'dagi «Control» rangiga yaqin), Hodisa sariq va Takrorlash yashildan farqli.** **B** — Hodisa oilasiga qo'shish (`when I start as a clone` — shapka): **−** «create clone» hodisa emas, bola adashadi.
4. **Vaqt — A: `wait` bloki yo'q; nusxalar orasidagi vaqtni dvigatel beradi (har blok — bir urish).** Sabab: 1-modulda `wait` o'tilmagan; repeat ichida create clone o'zi «yomg‘ir» beradi. **B** — `wait 1 second` bloki: **−** yangi blok, yangi tushuncha (vaqt).
5. **`delete this clone` — A: 3-bekatda, zarurat bilan (yerda qolgan nusxa yo'lni to'sadi).** **B** — 1-bekatdan boshlab: **−** 1-bekatda hojati ko'rinmaydi; **C** — umuman yo'q, yerga yetgan nusxa o'zi yo'qoladi: **−** Scratch'dan farq, 17-darsda o'q uchun baribir kerak.
6. **3-bekatda qahramon tegishi — A: tayyor (dvigatel): nusxa qahramonga tushsa — jon −1 va nusxa o'chadi;** bola faqat dushman dasturini tuzadi. Sabab: bitta yangi fikr bekatda; «tegish» sharti (`touching`) — 18-dars. **B** — bola qahramonga `when touching enemy` dasturchasini yozadi: **−** 3-bekatda ikki yangi narsa.
7. **3-bekatda strelkalar — A: faqat ← → (qahramon pastki qatorda).** **B** — to'rt strelka: **−** qahramon dushmanlar ichiga chiqib ketadi, o'yin «labirint»ga aylanadi.
8. **Huk — A: uch usul (bittasini besh marta · beshta chizish · nusxa); natija kartada** (80-qaror). **B** — ikki usul (A va C): **−** «beshta chizamiz» — eng ko'p o'ylanadigan javob, sinovsiz qoladi.
9. **Asl ko'rinadimi — A: ha, tepada turadi (nusxalar undan chiqadi).** Sabab: «nusxa aslning joyidan boshlaydi» ko'rinsin. **B** — asl yashirin (Scratch'da ko'pincha shunday): **−** nusxa qayerdan paydo bo'lgani ko'rinmaydi.
10. **Manba v1 tasdig'i** (umumiy).

## Tekshirilmagan joylar

1. Topshiriqlar va o'yin hali simulyatsiya qilinmagan (dvigatel qurilganda — `klon.mjs`): 3-bekat o'yini 9 yoshli uchun yutiladigan tezlikdami (nusxa har urishda bir katak; qahramon har bosishda bir katak).
2. Nusxalar bir vaqtda harakatlanganda zaif noutbukda sekinlashmaydimi (10 ta nusxa).
3. Vaqtlar taxminiy; 3-bekat (15,5 daqiqa) — o'yin va dastur birga.
4. «Kosmos» maydonining ranglari — qahramon va dushman ko'rinishi (kontrast) — qurilganda ko'z bilan.
5. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (v1.1, 21.11 kech)

1. **Dvigatel** — yangi `dvigatel/klon.js` (asl, nusxalar, har nusxa alohida ijro — bir vaqtda; tekshiruv; 3-bekat o'yini; huk kartalari `data-klon`), bloklar — `blockly.js` (`create_clone` C, `when_clone` H — boshli, `delete_clone` D), oila «Klon» `K` (to'q sariq #C98A00), `qismlar.mjs` (IKON, BL, OILA). Dushman gaplari — `DARS.klonGap` (dvigatelda dars matni yo'q).
2. **`delete this clone` ostiga blok ulanadi** (Blockly'da oxirgi blok emas — javondan bosilgan blok dasturcha oxiriga tushishi uchun); ostidagi bloklar bajarilmaydi — nusxa o'chdi.
3. **1 · ★ «Boshqa ustun»** — javonda 3-darsdagi `go to` (sonlar ro'yxatdan); 2–3-bekatda — son katakli `go to` (13-dars) va `random`.
4. **10-qadam (ustoz)** jonli darsda tayyor ▶[C] · K[R4[↓]] dan boshlanadi; solo'da tayyor dastur — oxirgisi (▶[R5[C]] · K[go(R0-6, 4) R4[↓]]), ishora «Har nusxa o‘z random sonini tanlaydi — ishga tushiring». 14-qadam jonli darsda ham tayyor dastur bilan (`delete this clone` siz).
5. **Sarlavhalar 18 belgigacha** (71-qaror, setka): 15-qadam doskasi «Dushmandan <em>qoching</em>!»; 12-qadam xulosasi «<em>Klon</em>» (13-darsdagidek — so'zning o'zi).
6. **Natija kartalari** — 13–14-darsdagidek uchinchi shaxsda, bola va sinf bitta kalit bilan: «ta nusxa yasadi» · «ta o‘yin yutdi» · «pog‘ona bajardi».
7. **Kosmos maydoni** — bezaksiz (yulduzchalar — fon, katakda emas); qahramon — o'z rasmi, dushman — binafsha (#8B5CF6).
8. **3-bekat o'yinining qiyinligi** — dodge-bot har pog'onada 6/6 yutdi (`sinov/dvigatel/klon.mjs`); passiv o'yinchiga ham nusxa tushadi (14-qadam, tanlov bilan — jon 2). O'yin oson tomonda — darsning fikri dastur, o'yin emas (Tekshirilmagan joylar, 1).
