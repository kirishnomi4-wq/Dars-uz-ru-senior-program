# 13-dars. Tasodifiy son

> **Holat: v1.1 — QURILDI (21.11 tun, avtopilot: «Savollar» 1–11 tavsiya A bo'yicha; qurishda qabul qilingan qarorlar — oxirida, «Qurishdagi qarorlar» 1–12). Foydalanuvchi ko'rigi kutilmoqda — QA saytda «ko‘rikda».** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/013-tasodifiy-son/`) shundan quriladi. Eng muhimi — 1–2-savol (tasodifiy son nimaga ishlatiladi, blok qanday) va 6-savol (11–12-dars bilan bog'lanish).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–12-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 13-dars («Tasodifiy son» — natija: olmalar har safar boshqa joydan tushadi; o'rganadi: dastur har safar boshqa son tanlay olishi; nega: o'yin har safar bir xil bo'lmasligi uchun; tekshiruv: avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Har topshiriq manba yozilganda dastur bilan simulyatsiya qilindi — **tasodif urug' (seed) bilan, qayta tekshiriladigan**: random sonlarining hamma qiymati sanab chiqildi, har topshiriq 2000 urug' bilan uch martadan ishga tushirildi, o'yinlar 2000 urug' bilan o'ynaldi (natija jadvalda). Dars qurilganda sinov — `sinov/dvigatel/tasodif.mjs` (**KOD**).
> **11–12-dars manbalari hali yo'q** (parallel yozilmoqda). Bu yerda taxmin: 11-darsda «Olma terish» o'yini va o'zgaruvchi bloklari `set ball to 0`, `change ball by 1`; 12-darsda `change jon by -1` va «O‘yin tugadi». Bu dars o'zgaruvchiga **tayanmaydi** — o'yinda hisob 4-darsdagidek «Olma: N / 5» («Savollar» 6). 11–12-dars boshqacha chiqsa, 1-qadamdagi «O‘tgan darsda» kartasi va 3-bekat o'yinining hisobi moslanadi; darsning tuzilishi o'zgarmaydi.
> 3–8-dars auditidan saboq (qo'llandi): sinf doskasidagi rasm va pog'ona nomi javobni ochmaydi (kartada faqat savatlar — dastur va sonlar yo'q); ikki pog'onaning javobi bir xil emas (jadval oxirida tekshiruv); maslahat yo'nalish beradi, javobni aytmaydi (A·2); 16-qadamda bola o'z oxirgi yechgan pog'onasini ko'radi (A·1); savat, olma va qahramon katagi bezak kataklariga tushmaydi.

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** olmalar har safar boshqa joydan tushadi. **Bu manbada:** olmaning dasturi, masalan `go to x: (random 0 to 6) y: 2` — har ishga tushirishda dastur X ni o'zi tanlaydi va olma tepadan o'sha katakka tushadi. 3-bekatda «Olma terish» o'yini: har olma olinganda yangisi boshqa joyga tushadi — o'yin har safar boshqacha, uni yodlab olib bo'lmaydi.
- **Bola nimani tushunadi:** son har doim dasturga yozib qo'yilmaydi. `random 2 to 4` bloki har safar 2 dan 4 gacha sonlardan **birini o'zi tanlaydi** — qaysi birini, oldindan bilib bo'lmaydi, lekin doim shu sonlardan biri. Shuning uchun «dan … gacha» sonlarini o'ylab tanlash kerak: ko'p bo'lsa — olma maydondan yoki savatdan chiqadi, kam bo'lsa — ba'zi savatlarga hech qachon tushmaydi. Tasodifiy dasturni **bir necha marta** ishga tushirib tekshiramiz: bir marta ishlagani — hali hammasi emas.
- **Tekshiruv (dasturdan):** avto. Dvigatel random sonlarining hamma qiymatini sanab chiqadi (har tushish o'z savatida, har savatga tushish mumkin) va bola dasturni kamida 3 marta ishga tushiradi — olma kamida 2 xil joyga tushishi kerak (**KOD**). 3-bekatda — o'yin yutildi (5 olma) va olma dasturi o'sha shartdan o'tdi.
- **Vaqt:** reja 65 daqiqa, zaxira 15–25 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi pog'onalarga.
- **Uch bekat:** 1 · Bitta son — 2 · Ikki son — 3 · O'yin. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror). **Yangi:** 1–2-bekatda dastur **olmaniki** — har `go to` bitta olmani tushiradi; qahramon o'z katagida turib kuzatadi va olma savatga tushsa quvonadi. 3-bekatda o'yin: qahramon strelkalar bilan yuradi (dasturchalari tayyor), bola olmaning dasturini tuzadi («Savollar» 4).
- **Oldingi darslar bilan bog'lanish:** 3-dars — `go to x: y:` (X 0–6, Y 0–4, sonlar bosib tanlanadi); 4-dars — o'yin («▶ Boshlash», strelka dasturchalari, «Olma terish», «Olma: N / M»); 5-dars — `repeat`; 11–12-dars — o'yin va o'zgaruvchi (taxmin). 4-darsdagi qochadigan yulduz ro'yxat bo'yicha ko'chardi — ikkinchi marta o'ynasangiz, uni yodlab olsa bo'lardi. Bugun dastur joyni o'zi tanlaydi.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, maydonni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–8 | O'yinni ko'radi: olma doim bir joyga tushadi, Coddy qimirlamay yutadi. Savol: olma har safar boshqa joyga qanday tushadi? Sinf uchalasini ikki o'yin bilan sinaydi: boshqa son — yana bir xil, uch joy navbat bilan — yana bir xil, «dastur o'zi tanlasin» — har o'yin boshqacha. Javob va yangi so'z: tasodifiy son | 2–5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz `random` blokini ko'rsatadi | 7 |
| 10:30–21 | Olmani bir qatordagi yoki bir ustundagi savatlarga tushiradi: bitta son tasodifiy | 8 |
| 21–23:30 | Ustoz X ga ham, Y ga ham random qo'yadi | 9–10 |
| 23:30–34 | Olmani to'rtburchak savatlarga tushiradi; ★ da uchta olma birdan | 11 |
| 34–36 | Xulosa: tasodifiy son | 12 |
| 36–39:30 | Ustoz «Olma terish» o'yinini ko'rsatadi | 13–14 |
| 39:30–54 | O'yinga olma dasturini tuzadi va o'ynaydi; ★ da o'z o'yinini | 15 |
| 54–59 | Olma dasturini sinfga o'qib beradi — ustoz Coddy bilan o'ynaydi | 16 |
| 59–65 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: 2 ta blok, uch marta ishga tushirish) — 11:30–12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| tasodifiy son | dastur o'zi tanlaydigan son: `random 2 to 4` — 2, 3 yoki 4 dan biri; qaysi biri — oldindan bilmaymiz | 5 (va 12, 17) | uch bo'lak birma-bir: zar va `random 1 to 6` bloki → «▶» — blok ustida «4» → yana «▶» — «2», yozuv «Har safar boshqa son» |

Yordamchi so'zlar (ta'rifsiz, tushunarli): savat, tushadi, dan … gacha, har safar, istalgan, olma dasturi, zar. 1–12-darsdan: blok, dastur, buyruq, qahramon, olma, katak, maydon, manzil, X va Y, takrorlash, hodisa, tugma, strelka, o'yin, dasturcha, pog'ona (o'zgaruvchi, ball, jon — 11–12-darsdan, taxmin).
Bir ma'noga bitta so'z: «tanlaydi» (dastur sonni; «o‘ylab topadi», «chiqaradi» deyilmaydi); «tasodifiy son» (tushuncha; ekranda «tasodif», «random son» deyilmaydi; blok nomi — `random`, ustoz bir marta «random — tasodifiy» deydi); «tushadi» (olma tepadan katakka; «qo‘nadi», «paydo bo‘ladi» deyilmaydi); «savat» (olma tushishi kerak bo'lgan katak; «nishon», «joy» deyilmaydi); «dan … gacha» («0 dan 6 gacha»; «oraliq», «diapazon» ekranda yo'q); «har safar» (har ishga tushirishda, har olmada; «har gal» deyilmaydi); «olma dasturi» (olmaning bloklari; 3-bekatda «Qahramon» va «Olma» — ikki dastur).
Bu darsda AYTILMAYDI (keyingi darslarniki yoki kursda yo'q): Math.random va aralashtirish (85-dars), «ehtimollik», «omad», klon (16-dars), «forever» (cheksiz takrorlash), «go to random position» (Scratch'dagi tayyor «tasodifiy joy» bloki — bu kursda yo'q: joyni bola X va Y bilan o'zi aytadi).

## Maydon, savatlar va bloklar

Maydon — 3–6-darsdagi bog' (7 × 5, X va Y sonlari, (0, 0) pastki chapda, Y tepaga; qahramon ostida «(x, y)» yorlig'i). Bezak: daraxtlar (1, 1) · (4, 3) · (6, 1), gullar (0, 4) · (2, 3) · (5, 4) · (6, 3) — devor emas. **Hech qaysi savat, qahramon katagi va namuna yechimning hech qaysi tushishi bezak katagida emas** (simulyatsiya — jadval ostida). Maydondan tashqari katak yo'q: `go to` X 7 yoki Y 5 ni olsa — olma maydon chetida turtilib to'xtaydi, «tuk», Kamvoy «Maydon tugadi!» (3–6-darsdagidek).

**Savatlar** (**KOD**): olma tushishi kerak bo'lgan kataklar — yerda kichik to'qima savat (rangi tinch, kulrang rasm kataklari bilan adashmaydi). 1·★ da ikki guruh — savat ustida kichik raqam «1» va «2» (qaysi olma). 3-bekat ★ da savat yo'q.

**Olma dasturi** (**KOD**, «Savollar» 4): 1–2-bekatda dastur egasi — olma (tasma boshida olma rasmi, yonida «Olma dasturi»). Olma dasturida `go to x: y:` — **bitta olma tepadan shu katakka tushadi** (tushish harakati, yengil «tup»); keyingi `go to` — yana bitta olma, oldingisi savatida qoladi. «▶ Ishga tushir» yana bosilsa — olmalar olinadi, oldingi tushgan joylari xira belgi bo'lib qoladi (pog'ona tugaguncha): bola har safar boshqa joyga tushganini ko'radi. Qahramon o'z katagida turadi, olma savatga tushsa quvonadi.

**Bloklar** — uch oila: yangi `random` (oila va rang — «Savollar» 3), Harakat (ko'k: `go to`), Takrorlash (yashil: 2·★ uchun). Hodisa, Shart, Gap, `move` javonda yo'q (3-bekatda qahramonning strelka dasturchalari tayyor turadi — o'qiladi, o'zgartirilmaydi).

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `random 1 to 10` | tasodifiy son, 1 dan 10 gacha | **oval son bloki** — o'zi bajarilmaydi, son katagiga qo'yiladi (`go to` ning X yoki Y si; `repeat` soni). Har ishga tushirishda «dan … gacha» sonlaridan birini tanlaydi; ijro paytida blok ustida tanlangan son kichik pufakda ko'rinadi («4»). Ikkala soni bosib tanlanadi (0–10). Qo'yish: `go to` dagi sonni bosing — ro'yxat oxirida «random» bandi (bosish yo'li); yoki javondan katakka sudrang (**KOD**) | **yangi**: 7-qadam |
| `go to x: y:` | X va Y ga bor | olma dasturida — bitta olma shu katakka tushadi; javonda `go to x: 0 y: 0` | 3-darsdan |
| `repeat 2` | takrorla | 2·★ da: ichidagi `go to` necha marta — shuncha olma | 5-darsdan |

**Bloklar soni:** random ham blok — `go to x: (random 0 to 6) y: 2` = 2 ta blok; ikkala soni random bo'lsa — 3 ta. Har pog'onada chegara (5-darsdagidek: "N / M ta blok", to'lsa Ortiqvoy «Joy qolmadi!»). Dasturda eng ko'pi 12 ta blok.
**Tekshiruv** (**KOD**): har «▶ Ishga tushir»dan keyin dvigatel random sonlarining **hamma qiymatini sanab chiqadi** — olma qayerlarga tushishi mumkin: hammasi o'z savatida va har savatga tushish mumkin bo'lsa — dastur to'g'ri. Bola buni ko'zi bilan ham ko'rsin: tasma yonida «Sinov: N / 3»; uch marta ishga tushirgach va olma kamida 2 xil joyga tushgach — «Har safar boshqa joy!» va konfeti. Uch marta ham bir joyga tushsa (tasodif) — «Olma yana o‘sha joyga tushdi — bu ham tasodif. Yana bir marta».
**Masalada maqsad:** olma har safar savatga tushadi, istalgan savatga tushishi mumkin va ishga tushirganda har safar boshqa joy chiqadi. 3-bekatda — o'yinda 5 ta olma terildi.

**Topshiriqlar va tekshiruv natijasi** (dastur bilan simulyatsiya qilingan; «go(R0-6, 2)» — `go to x: (random 0 to 6) y: 2`; «R3[…]» — `repeat 3`; «Blok» — random ham sanaladi; «3 ta sinovda 2 xil» — 2000 urug'dan nechtasida birinchi uch ishga tushirishdayoq 2 xil joy chiqdi, qavsda — eng ko'pi nechanchi ishga tushirish kerak bo'ldi):

| Joy | Topshiriq | Yechim (namuna) | Blok / chegara | Natija (simulyatsiya) |
|---|---|---|---|---|
| Huk (2–4) | pastki qator; Coddy (3, 0); har kartada ikki o'yin, har o'yinda 3 ta olma | C: go(R0-6, 0) | 2 / — | A go(5, 0): 5 · 5 · 5 va 5 · 5 · 5 — ✕; B navbat bilan go(1, 0), go(5, 0), go(3, 0): 1 · 5 · 3 va 1 · 5 · 3 — ✕; C (tanlov oldindan berilgan): 4 · 1 · 6 va 2 · 5 · 0 — ✓. Haqiqiy tasodifda C ning ikki o'yini aynan bir xil chiqishi — 5000 urug'dan 13 ta (≈ 1 / 343) |
| 7 (ustoz) | savatlar (1, 0)…(5, 0); Coddy (6, 2) | go(R1-5, 0) | 2 / 2 | javondagi `random 1 to 10` bilan — 7…10 maydondan tashqarida (tanlov «8» — Kamvoy «Maydon tugadi!»); R1-5 — tanlov 4, 2, 5 — tayyor |
| 8 · 1 | «Butun qator»: savatlar (0, 2)…(6, 2); qahramon (3, 0) | go(R0-6, 2) | 2 / 2 | tayyor; 3 ta sinovda 2 xil — 98,5% (5). R1-10 — (7, 2) maydondan tashqari; R1-6 — (0, 2) savatga hech qachon tushmaydi; go(3, 2) — random yo'q; y 0 — (0, 0) da savat yo'q |
| 8 · 2 | «Uchta savat»: (2, 0), (3, 0), (4, 0); qahramon (0, 2) | go(R2-4, 0) | 2 / 2 | tayyor; 88,1% (9). R0-6 — (0, 0) da savat yo'q; R2-5 — (5, 0) da savat yo'q; R3-4 — (2, 0) bo'sh qoladi |
| 8 · 3 | «Ustun»: (3, 0)…(3, 4); qahramon (5, 2) | go(3, R0-4) | 2 / 2 | tayyor; 96,5% (6). Random X da — go(R0-4, 3): (0, 3) da savat yo'q; Y R0-6 — (3, 5) maydondan tashqari |
| 8 · ★ | «Ikki olma»: savat «1» — (1, 4), (2, 4), (3, 4); savat «2» — (5, 0), (6, 0); qahramon (3, 2) | go(R1-3, 4) go(R5-6, 0) | 4 / 4 | tayyor; 96,6% (6). Tartib almashsa — 1-olma (5, 0) ga, u «2» savat; bitta `go to` — 1 ta olma; R0-3 — (0, 4) gulga |
| 10 (ustoz) | savatlar (3, 1)…(5, 2), 6 ta; Coddy (1, 0); tayyor go(R3-5, 1) | go(R3-5, R1-2) | 3 / 3 | tayyor dastur: (3, 2), (4, 2), (5, 2) savatlariga hech qachon tushmaydi (Kamvoy); ikkinchi random bilan — tanlov (5, 2), (3, 1), (4, 2) — tayyor |
| 11 · 1 | «Kichik kvadrat»: (0, 2), (1, 2), (0, 3), (1, 3); qahramon (3, 2) | go(R0-1, R2-3) | 3 / 3 | tayyor; 93,0% (7). Faqat X random go(R0-1, 2) — (0, 3) bo'sh; X va Y almashsa go(R2-3, R0-1) — (2, 0) da savat yo'q |
| 11 · 2 | «To‘rtburchak»: (2, 0)…(4, 1), 6 ta; qahramon (0, 2) | go(R2-4, R0-1) | 3 / 3 | tayyor; 96,6% (6). Y R0-2 — (2, 2) da savat yo'q; X R1-4 — (1, 0) da savat yo'q (va (1, 1) daraxt) |
| 11 · 3 | «Katta to‘rtburchak»: (2, 0)…(5, 2), 12 ta; qahramon (0, 0) | go(R2-5, R0-2) | 3 / 3 | tayyor; 99,2% (5). X R2-6 — (6, 0) da savat yo'q (va (6, 1) daraxt); Y R0-3 — (2, 3) gulga |
| 11 · ★ | «Olma yomg‘iri»: (3, 0)…(5, 1), 6 ta; qahramon (1, 2); har ishga tushirishda 3 ta olma | R3[go(R3-5, R0-1)] | 4 / 4 | tayyor; 100% (3). repeat yo'q — 1 ta olma; `repeat 2` — 2 ta olma |
| 14 (ustoz) | o'yin: savatlar (0, 0)…(6, 0); Coddy (3, 2) | go(R0-6, 0) | 2 / 2 | 5 olma: 3…28 bosish (2000 urug'); urug' 7 — olmalar 0, 0, 6, 4, 3 (14 bosish), urug' 8 — 1, 4, 2, 4, 4 (11) — o'yinlar har xil |
| 15 · 1 | «Bog‘ o‘rtasi»: (3, 0)…(5, 2), 9 ta; qahramon (4, 4); tayyor dastur go(4, 1) | go(R3-5, R0-2) | 3 / 3 | tayyor dastur — random yo'q (Kamvoy «Yana o‘sha joy!», o'yin boshlanmaydi); yechim bilan 5 olma — 5…20 bosish |
| 15 · 2 | «Tepa qator»: (1, 4)…(4, 4); qahramon (3, 2) | go(R1-4, 4) | 2 / 2 | 5 olma — 2…16 bosish. R0-4 — (0, 4) gulga |
| 15 · 3 | «Chap ustun»: (0, 0)…(0, 3); qahramon (3, 0) | go(0, R0-3) | 2 / 2 | 5 olma — 3…18 bosish. R0-4 — (0, 4) gulga |
| 15 · ★ | «O‘z o‘yiningiz»: savat yo'q; qahramon (3, 2) | bolaning o'zi (namuna go(R2-5, R0-2)) | ≤ 3 | tayyor sharti: random bor, olma hech qachon maydondan chiqmaydi va daraxt yoki gulga tushmaydi, kamida 2 joy; o'yin yutildi. go(R0-6, 2), go(R2-5, R0-2), go(3, R0-4) — tayyor; go(R0-6, R0-4) — (0, 4) gulga; go(R0-6, R0-2) — (1, 1) daraxtga; go(2, 2) — random yo'q |

**Simulyatsiya xulosasi:**
- Bezak: hamma savat, qahramon katagi va namuna yechimlarning hamma tushishi bezakdan tashqarida; savatlar to'rtburchaklari daraxt va gullar orasidagi bo'sh joylarda — shuning uchun «dan … gacha»ni kengaytirgan xato varianti o'zi daraxt yoki gulga tegadi (11 · 2, 11 · 3, 15 · 2, 15 · 3, 15 · ★) — bola sonni o'ylab tanlashga majbur.
- Maydondan chiqish: namuna yechimlarning hech biri chiqmaydi; javondagi `random 1 to 10` ni o'zgartirmasa — X da 7…10 (4/10), Y da 5…10 maydondan tashqarida (7-qadamda ataylab ko'rsatiladi).
- Uch ishga tushirish yetadimi: savat ko'p bo'lsa — deyarli doim (99%); 8 · 2 (3 ta savat) — 12% hollarda uch marta ham bir xil, «Yana bir marta» (eng ko'pi 9 marta, 2000 urug').
- Javoblar takrorlanmaydi: har pog'ona va ustoz ekranining yechimi boshqa (go(R1-5, 0) · go(R0-6, 2) · go(R2-4, 0) · go(3, R0-4) · go(R1-3, 4) go(R5-6, 0) · go(R3-5, R1-2) · go(R0-1, R2-3) · go(R2-4, R0-1) · go(R2-5, R0-2) · R3[go(R3-5, R0-1)] · go(R0-6, 0) · go(R3-5, R0-2) · go(R1-4, 4) · go(0, R0-3)). Huk C va 14-qadam (ustoz) bir xil dastur — ikkalasi ham ustozniki.
- Har pog'onada random X da ham (8 · 1, 8 · 2), Y da ham (8 · 3, 15 · 3) bor — "random faqat X uchun" degan yolg'on qoida tug'ilmaydi.

## Yordam va xato

1–12-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); maslahat yo'nalish beradi, javobni aytmaydi (A·2). Xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga "noto'g'ri", "xato qildingiz" deyilmaydi. Bu darsda devor yo'q — To'siqvoy chiqmaydi. Ishorada random tanlagan son va katak bor (**KOD**).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | dastur bo'sh, «Ishga tushir» bosildi | «Bu yerda hech narsa yo‘q-ku…» | «Avval blokni bosing — u dasturga qo‘shiladi» |
| Kamvoy | shu ishga tushirishda olma maydondan tashqariga tushdi | «Maydon tugadi!» | «random 8 ni tanladi. Maydonda X — 0 dan 6 gacha» (tanlangan son bilan; Y bo'lsa — «Maydonda Y — 0 dan 4 gacha») |
| Ortiqvoy | olma savat yo'q katakka tushdi | «Savat yo‘q-ku!» | «Olma (x, y) ga tushdi — u yerda savat yo‘q. random sonlarini tekshiring» |
| Ortiqvoy | bu safar savatga tushdi, lekin random savatdan tashqarini ham tanlashi mumkin | «Savat yo‘q-ku!» | «random 5 ni ham tanlashi mumkin — olma (5, 0) ga tushadi. random sonlarini tekshiring» (birinchi shunday son va katak bilan; u katak maydondan tashqarida bo'lsa — «random 7 ni ham tanlashi mumkin — maydonda X 0 dan 6 gacha») |
| Kamvoy | biror savatga olma hech qachon tushmaydi | «Bu savat bo‘sh qoladi!» | «(x, y) dagi savatga olma tushmaydi. random sonlarini tekshiring» |
| Kamvoy | dasturda random yo'q — olma doim bir joyga | «Yana o‘sha joy!» | «Son doim bir xil. Son o‘rniga random qo‘ying» |
| Kamvoy | 8 · ★, 11 · ★: olma kam | «Oz qoldi!» | «N ta olma tushishi kerak» |
| Ortiqvoy | 8 · ★, 11 · ★: olma ko'p; 3-bekatda dasturda bittadan ortiq `go to` | «Ko‘payib ketdi!» | «N ta olma tushishi kerak» (3-bekatda: «O‘yinda bitta olma: dasturda bitta go to bo‘lsin») |
| Ortiqvoy | 8 · ★: olma boshqa raqamli savatga tushdi | «Savat yo‘q-ku!» | «1-olma «1» savatlarga tushsin. Birinchi go to — 1-olma» |
| Kamvoy | 15 · ★: olma daraxt yoki gulga tushishi mumkin | «Daraxtga tushadi!» (gul bo'lsa — «Gulga tushadi!») | «random (x, y) ni ham tanlashi mumkin — u yerda daraxt» |
| Ortiqvoy | dastur to'ldi — yangi blok qo'shilmadi | «Joy qolmadi!» | «Dasturga N ta blok sig‘adi» |

Ishora (muammochasiz): «Sinov: 1 / 3» — «Yana ishga tushiring — olma qayerga tushadi?»; uch marta bir joy — «Olma yana o‘sha joyga tushdi — bu ham tasodif. Yana bir marta».
Bir nechta sabab bo'lsa — avval shu safar ko'ringani (maydondan tashqari, savat yo'q), keyin sanab topilgani. 3-bekatda tekshiruv «▶ Boshlash» bosilganda: olma dasturi shartdan o'tmasa — muammocha chiqadi va o'yin boshlanmaydi (4-darsdagi «Men nimani kutaman?» kabi). Muammocha qahramonni yopmaydi (91-qaror).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «13-dars · Tasodifiy son», sarlavha «Bugun o‘yin har safar boshqacha!». Coddy: «Salom! Bugun dastur sonni o‘zi tanlaydi.» O'ngda maydon, Coddy (3, 0) da. Pastda kichik karta «O‘tgan darsda»: `change jon by -1` — «Jon — Tugasa, o‘yin tugaydi» (12-dars manbasidan aynan olinadi — "Tekshirilmagan joylar" 2). Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda o‘yinga jon qo‘shdik.»
  2. «Bugun olma har safar boshqa joyga tushadi.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 11–12-darsdagi «Olma terish» o'yinini eslatadi; o'tgan dars oxiridagi va'dani aytadi — bugun shu.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «13-dars · Tasodifiy son», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: olma har safar boshqa joyga qanday tushadi?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Avval dard: o'yinda olma doim bir joyga tushadi — Coddy qimirlamay yutadi. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Olma har safar boshqa joyga qanday tushadi?» (ikki qator). Maydonda o'yin: Coddy (3, 0) da; tepadan olma (3, 0) ga tushadi — Coddy oldi, «Olma: 1 / 3»; yana (3, 0) ga — «2 / 3»; yana — «3 / 3». Hech qanday tugma bosilmaydi. Coddy: «Qimirlamay yutdim. Olma doim shu yerga tushadi.» Maydon ustida kichik yozuv «Har o‘yin boshqacha bo‘lsin». Chapda uchta karta: A «Boshqa son qo‘yamiz» (`go to x: 5 y: 0` rasmi) · B «Navbat bilan uch joy» (`go to x: 1 y: 0`, `go to x: 5 y: 0`, `go to x: 3 y: 0` rasmi, yonida «1-olma · 2-olma · 3-olma») · C «Dastur o‘zi tanlasin» (`go to x: (random 0 to 6) y: 0` rasmi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Olma doim bir joyga tushadi — o‘ynash qiziq emas. Har o‘yin boshqacha bo‘lsin.»
  2. «Har kim noutbukida bitta kartani tanlasin: qanday qilamiz?»
- **O'z so'zi bilan:** Coddy qimirlamaganini sinf bilan kuzatadi; kartalarni o'qiydi; sinf javoblarini o'qiydi. Kartadagi `random` blokini tushuntirmaydi — buni sinov ko'rsatadi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi yo‘l bilan har o‘yin boshqacha bo‘ladi?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; maydonda «1-o‘yin»: uchta olma birin-ketin tushadi — (5, 0), (5, 0), (5, 0); kartada qator «1-o‘yin: 5 · 5 · 5». Keyin «2-o‘yin» — yana 5, 5, 5; qator «2-o‘yin: 5 · 5 · 5». Kartada: «✕ ikki o‘yin bir xil» (**KOD**: huk kartasi — ikki o'yin, sonlar qatori).
  2. «Keyingi» — B: «1-o‘yin: 1 · 5 · 3», «2-o‘yin: 1 · 5 · 3». Kartada: «✕ yana bir xil».
  3. «Keyingi» — C: dasturda yangi blok — `random 0 to 6`; har olmada blok ustida tanlangan son. «1-o‘yin: 4 · 1 · 6», «2-o‘yin: 2 · 5 · 0». Kartada: «✓ har o‘yin boshqacha» va konfeti.
- **Tayanch gaplar:**
  1. «Boshqa son ham, navbat ham — ikkinchi o‘yinda o‘sha-o‘sha. Yodlab olsa bo‘ladi.»
  2. «Uchinchisida sonni dastur o‘zi tanladi — har o‘yin boshqacha.»
- **O'z so'zi bilan:** A va B da ikki qatorni sinf bilan solishtiradi («bir xilmi?»); 4-darsdagi qochadigan yulduzni eslatadi — u ham ro'yxat bo'yicha ko'chardi; C da tanlangan sonlarni sinf bilan o'qiydi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: dastur o'zi tanlaydi

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Dastur o‘zi tanlaydi». A va B xira, C oltin; maydonda C ning olti tushgan joyi xira belgi bilan. Coddy: «Endi olma qayerga tushishini men ham bilmayman.»
- **Tayanch gaplar:**
  1. «Sonni o‘zimiz yozmaymiz — dastur har safar o‘zi tanlaydi. Shuning uchun har o‘yin boshqacha.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: tasodifiy son

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: tasodifiy son»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Tasodifiy son nima?». Coddy: «Tasodifiy son — dastur o‘zi tanlaydigan son.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (3–5-darsdagi `raqam` ishi):
     - 1-bosish: zar va `random 1 to 6` bloki yonma-yon; yozuv «1 dan 6 gacha — zar kabi»;
     - 2-bosish: blok yonadi, ustida «4», zar to'rtni ko'rsatadi; yozuv «Bu safar — 4»;
     - 3-bosish: yana — «2»; yozuv «Har safar boshqa son» (**KOD**: oldindan chizilgan uch holat).
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Tasodifiy son — dastur o‘zi tanlaydigan son. Qaysi biri — oldindan bilmaymiz.»
  2. «random 1 to 6 — 1 dan 6 gacha istalgan son. Lekin 7 hech qachon chiqmaydi.»
- **O'z so'zi bilan:** hayotdan misol: zar tashlash — 1 dan 6 gacha, qaysi biri tushishini hech kim bilmaydi; «kim boshlaydi?» deb sanash; telefon o'yinlarida sovg'a har safar boshqa joyda chiqadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Bitta son → 2 · Ikki son → 3 · O'yin; cho'qqida kichik karta «Dars oxirida · o‘z o‘yiningiz · Dasturini o‘qib berasiz» (kichik maydonda savatlar va tushgan olmalar). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Birinchisidan boshlaymiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: bitta son, ikki son, o‘yin.»
  2. «Dars oxirida olmalari har safar boshqa joyga tushadigan o‘z o‘yiningizni tuzasiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: random bloki

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Bitta son
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz random blokini ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «random — tasodifiy son». Javonda yangi oila (rang doirachasi), unda `random 1 to 10`; Harakat oilasida `go to x: 0 y: 0`; Takrorlash oilasida `repeat 2`. Maydonda pastki qatorda 5 ta savat — (1, 0)…(5, 0); Coddy (6, 2) da. Tasma boshida olma rasmi va «Olma dasturi»; dastur bo'sh, «0 / 2 ta blok», «Sinov: 0 / 3».
  2. Ustoz javondan `go to x: 0 y: 0` ni bosadi — dasturda; Y — 0 (savatlar pastki qatorda).
  3. X dagi sonni bosadi — ro'yxat (0…6, oxirida «random») — «random»: `go to x: (random 1 to 10) y: 0`; «2 / 2 ta blok».
  4. «▶ Ishga tushir»: blok ustida «8» — olma o'ng chetga tushib turtiladi, «tuk»; Kamvoy «Maydon tugadi!» (ishora «random 8 ni tanladi. Maydonda X — 0 dan 6 gacha»).
  5. Ustoz random sonlarini bosib 1 va 5 ni tanlaydi: `random 1 to 5`. «▶ Ishga tushir» uch marta: «4» — olma (4, 0) savatiga tushadi; «2» — (2, 0); «5» — (5, 0). Har tushgan joyda xira belgi qoladi; «Sinov: 3 / 3»; «Har safar boshqa joy!» va konfeti.
- **Tayanch gaplar:**
  1. «random — tasodifiy. Dastur shu sonlar orasidan birini o‘zi tanlaydi.»
  2. «Sonlarni savatlarga qarab tanlaymiz: 1 dan 5 gacha.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** yangi oilaning rangini aytadi («Savollar» 3); `random` — oval: u o'zi yurmaydi, boshqa blokning soni o'rnida turadi; sonni bosib «random» tanlashni sekin ko'rsatadi (3-darsdagi `go to` sonlaridek); «8» — maydonda yo'q son: shuning uchun sonlarni o'zimiz cheklaymiz; tasodifiy dasturni bir marta emas, bir necha marta sinaymiz.
- **Ustoz qiladi:** `go to` qo'yadi, X ga random qo'yadi, ishga tushiradi, sonlarni o'zgartiradi, uch marta ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Bitta son: pog'onalar

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Bitta son
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Savatlarni o‘qing va random sonlarini tanlang.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Butun qator» · 2 «Uchta savat» · 3 «Ustun» · ★ «Ikki olma» (har kartada savatlar va qahramon — bola ham shuni ko'radi; dastur va sonlar yo'q). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval savatlarni o‘qing: X i qaysi sondan qaysi songacha? Y i-chi?»
  2. «Uch marta ishga tushiring — har safar savatga tushyaptimi?»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; yechimni aytmaydi — «Eng chapdagi savatning X i nechchi? Eng o‘ngdagisiniki-chi?» deb so'raydi; 3-pog'onada savatlar ustma-ust ekanini darrov aytmaydi — bola o'zi ko'rsin.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda `random 1 to 10`, Harakat (`go to`), Takrorlash (`repeat 2`); maydonda savatlar; tasma boshida «Olma dasturi», yonida «0 / N ta blok» va «Sinov: 0 / 3». Hamma pog'onada ishora boshida: «Savatlarning X va Y sini o‘qing».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Butun qator», ostida «Olma istalgan savatga tushsin.». Savatlar (0, 2)…(6, 2); qahramon (3, 0); 2 ta blok. «Maslahat»: «Savatlar bitta qatorda — Y bir xil. X qaysi sondan qaysi songacha?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Uchta savat», ostida «Olma faqat savatlarga tushsin.». Savatlar (2, 0), (3, 0), (4, 0); qahramon (0, 2); 2 ta blok. «Maslahat»: «Eng chapdagi savatning X i — boshi, eng o‘ngdagisiniki — oxiri».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Ustun», ostida «Savatlar ustma-ust.». Savatlar (3, 0)…(3, 4); qahramon (5, 2); 2 ta blok. «Maslahat»: «Bu safar qaysi son o‘zgaradi: X mi yoki Y mi?»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Ikki olma», ostida «1-olma «1» savatlarga, 2-olma «2» savatlarga.». Savatlar «1» — (1, 4), (2, 4), (3, 4); «2» — (5, 0), (6, 0); qahramon (3, 2); 4 ta blok. «Maslahat»: «Har olmaga o‘z go to. Birinchi go to — 1-olma».
  Tayyor bo'lsa: «Har safar boshqa joy!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** `go to` qo'yadi, kerakli songa random qo'yadi, «dan … gacha»ni tanlaydi, uch marta ishga tushiradi, kerak bo'lsa sonlarni tuzatadi.
- **Tekshiruv:** random sonlarining hamma qiymati — savatlarda va har savatga tushish mumkin; kamida 3 marta ishga tushirildi, olma kamida 2 xil joyga tushdi (avto); bloklar chegaradan oshmaydi.
- **Xatoda:** maydondan tashqari — Kamvoy «Maydon tugadi!»; savat yo'q katak — Ortiqvoy «Savat yo‘q-ku!»; savat bo'sh qoladi — Kamvoy «Bu savat bo‘sh qoladi!»; random yo'q — Kamvoy «Yana o‘sha joy!»; ★ da olma kam yoki ko'p — Kamvoy «Oz qoldi!» / Ortiqvoy «Ko‘payib ketdi!»; joy qolmadi — Ortiqvoy «Joy qolmadi!».

## 9 · 2-bekat

- **Vaqt:** 0:21–0:22 (1 daqiqa)
- **Bekat:** 2 · Ikki son
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: ikki son»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Bitta son ✓, oltin yoy; Coddy 2-bekatda; 2 · Ikki son miltillaydi. Coddy: «Endi X ham, Y ham tasodifiy.»
- **Tayanch gaplar:**
  1. «Bitta tasodifiy sonni bildik. Endi ikkalasi tasodifiy bo‘ladi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: ikki son

- **Vaqt:** 0:22–0:23:30 (1,5 daqiqa)
- **Bekat:** 2 · Ikki son
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz ikkinchi random qo‘yyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Ikki son — ikki random». Maydonda savatlar to'rtburchagi — (3, 1)…(5, 2), ikki qator, 6 ta; Coddy (1, 0) da. Dasturda tayyor: `go to x: (random 3 to 5) y: 1` — «2 / 3 ta blok».
  2. «▶ Ishga tushir»: «4» — olma (4, 1) savatiga tushadi; Kamvoy «Bu savat bo‘sh qoladi!» (ishora «(3, 2) dagi savatga olma tushmaydi. random sonlarini tekshiring»).
  3. Ustoz Y dagi sonni bosadi — «random»; sonlarni 1 va 2 ga: `go to x: (random 3 to 5) y: (random 1 to 2)` — «3 / 3 ta blok».
  4. «▶ Ishga tushir» uch marta: (5, 2), (3, 1), (4, 2) — «Har safar boshqa joy!».
- **Tayanch gaplar:**
  1. «Bitta random — bitta son. Savatlar ikki qatorda bo‘lsa, Y ham tasodifiy bo‘lsin.»
  2. «X ning o‘z random i, Y ning o‘z random i. Har biri o‘z sonlari bilan.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** birinchi ishga tushirishda olma savatga tushdi, lekin ustki qatordagi savatlarga hech qachon tushmas edi — dastur buni o'zi sanab aytdi; X va Y ning sonlarini alohida o'qiydi: X — 3 dan 5 gacha, Y — 1 dan 2 gacha.
- **Ustoz qiladi:** ishga tushiradi, Y ga random qo'yadi, sonlarni tanlaydi, uch marta ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Ikki son: pog'onalar

- **Vaqt:** 0:23:30–0:34 (10,5 daqiqa)
- **Bekat:** 2 · Ikki son
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Ikkala son tasodifiy!». Coddy: «Savatlarning chetlarini toping — X va Y uchun.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya: 1 «Kichik kvadrat» · 2 «To‘rtburchak» · 3 «Katta to‘rtburchak» · ★ «Olma yomg‘iri». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Chap pastki savat va o‘ng yuqori savat — ularning X va Y si sizga kerak.»
  2. «Daraxt va gulga tushmasin — sonlarni ortiqcha olmang.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «X qaysi sondan qaysi songacha? Y-chi?» deb so'raydi; 3-pog'onada daraxtlar savatlarga juda yaqin ekanini darrov aytmaydi — muammocha o'zi ko'rsatadi; ★ da «Bitta olmaning dasturi bor bo‘lsa, uchtasi uchun nima qilamiz?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; maydonda savatlar; «0 / N ta blok», «Sinov: 0 / 3». Hamma pog'onada ishora boshida: «X ga ham, Y ga ham random».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Kichik kvadrat», ostida «To‘rtta savat.». Savatlar (0, 2), (1, 2), (0, 3), (1, 3); qahramon (3, 2); 3 ta blok. «Maslahat»: «Savatlar ikki ustun va ikki qator: X qaysi sonlar? Y qaysi sonlar?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «To‘rtburchak», ostida «Olti savat.». Savatlar (2, 0)…(4, 1); qahramon (0, 2); 3 ta blok. «Maslahat»: «Chap pastki va o‘ng yuqori savatni toping — ularning X va Y sini o‘qing».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Katta to‘rtburchak», ostida «O‘n ikki savat.». Savatlar (2, 0)…(5, 2); qahramon (0, 0); 3 ta blok. «Maslahat»: «Chetdagi savatlardan bitta katak ham chiqmasin — yonida daraxt bor».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Olma yomg‘iri», ostida «Bir ishga tushirishda uchta olma.». Savatlar (3, 0)…(5, 1); qahramon (1, 2); 4 ta blok. «Maslahat»: «Bitta olmaning dasturini repeat ichiga qo‘ying».
  Tayyor bo'lsa: «Har safar boshqa joy!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** `go to` qo'yadi, X ga ham, Y ga ham random qo'yadi, sonlarni tanlaydi, uch marta ishga tushiradi; ★ da `repeat` ichiga qo'yadi.
- **Tekshiruv:** 8-qadamdagidek (avto); ★ — har ishga tushirishda 3 ta olma, har biri savatda.
- **Xatoda:** 8-qadamdagidek; daraxt yoki gul katagi savat emas — Ortiqvoy «Savat yo‘q-ku!».

## 12 · Xulosa: tasodifiy son

- **Vaqt:** 0:34–0:36 (2 daqiqa)
- **Bekat:** 2 · Ikki son
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: tasodifiy son»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Tasodifiy son». Coddy: «Dastur sonni o‘zi tanladi — har safar boshqa.» Ikki karta: «Tasodifiy son — Dastur o‘zi tanlaydigan son» (`random` bloki, ustida «4») va «random 2 to 4 — 2, 3 yoki 4» (`random 2 to 4` bloki); o'ngda maydon — 10-qadamdagi savatlar va tushgan joylar belgilari.
- **Tayanch gaplar:**
  1. «Tasodifiy son — dastur o‘zi tanlaydigan son.»
  2. «random 2 to 4 — 2, 3 yoki 4. Qaysi biri — bilmaymiz, lekin shu sonlardan biri.»
- **O'z so'zi bilan:** 1–2-bekat doskasida ko'p bola qolgan pog'onani eslatadi (ismsiz) va o'sha savatlarni sinf bilan birga o'qiydi: eng chetdagi savatlar qayerda — yechimni aytmaydi; «nega uch marta ishga tushirdik?» — bir marta savatga tushgani dastur to'g'ri degani emas.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:36–0:37 (1 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: o‘yin»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · O'yin miltillaydi. Coddy: «Oxirgi bekat: o‘yin har safar boshqacha.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — olma terish o‘yini.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: o'yin

- **Vaqt:** 0:37–0:39:30 (2,5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — Blok studiya (ustoz, maydon, o'yin) · bola «Ustoz ekraniga qarang» («Ustoz o‘ynayapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «O‘yin: olma terish». Maydonda pastki qatorda 7 ta savat — (0, 0)…(6, 0); Coddy (3, 2) da. Dastur ustunida ikki qism: tepada kichik karta «Qahramon» — to'rt strelka dasturchasi (tayyor, 4-darsdagidek, xira — o'zgartirilmaydi); ostida «Olma dasturi» — bo'sh. Asosiy tugma «▶ Boshlash».
  2. Ustoz olma dasturiga `go to x: (random 0 to 6) y: 0` ni qo'yadi.
  3. «▶ Boshlash»: sahna ustida «O‘yin: strelkalarni bosing · Olma: 0 / 5»; blok ustida «5» — olma (5, 0) ga tushadi. Ustoz ↓ ↓ → → — Coddy olmani oldi: «Olma: 1 / 5»; olma dasturi yana ishlaydi — «1»: yangi olma (1, 0) ga. Ustoz yana bitta olmani oladi, keyin «■ To‘xtatish».
  4. «▶ Boshlash» yana: birinchi olma endi (2, 0) ga tushadi — «Bu safar boshqa joy».
- **Tayanch gaplar:**
  1. «Qahramonni strelkalar bilan yurgizamiz. Olmani esa dastur tushiradi.»
  2. «Olma olindi — olma dasturi yana ishlaydi, random yana son tanlaydi.»
  3. «Endi o‘zingiz: olma dasturini tuzing va o‘ynang.»
- **O'z so'zi bilan:** qahramonning dasturchalari tayyor — bugun biz olmaning dasturini tuzamiz; ikkinchi o'yin birinchisiga o'xshamadi — o'yin yodlab olinmaydi; o'yin 5 ta olmagacha.
- **Ustoz qiladi:** olma dasturini tuzadi, o'yinni boshlaydi, strelkalar bilan ikki olmani oladi, to'xtatadi, yana boshlaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · O'yin: pog'onalar

- **Vaqt:** 0:39:30–0:54 (14,5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «O‘yiningizni tuzing!». Coddy: «Olma dasturini tuzing, keyin o‘ynang.» Chapda katta son «Uch o‘yinni yutdi 6 / 14» va belgilar; o'ngda zinapoya: 1 «Bog‘ o‘rtasi» · 2 «Tepa qator» · 3 «Chap ustun» · ★ «O‘z o‘yiningiz» (kartalarda savatlar va qahramon; ★ da — faqat qahramon). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval olma dasturi: random sonlari savatlarga qarab. Keyin «▶ Boshlash».»
  2. «Beshta olmani terganingizda — yutdingiz.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; o'yinni ikki marta boshlagan boladan «olmalar o‘sha joyga tushdimi?» deb so'raydi; ★ da «Olmalaringiz qayerga tushadi — daraxtlarga tegmaydimi?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur ustunida «Qahramon» kartasi (tayyor) va «Olma dasturi»; javon o'sha; asosiy tugma «▶ Boshlash» / «■ To‘xtatish»; o'yinda sahna ustida «O‘yin: strelkalarni bosing · Olma: N / 5». Hamma pog'onada ishora boshida: «Olma dasturini tuzing, keyin ▶ Boshlash».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Bog‘ o‘rtasi», ostida «Olma dasturida random yo‘q.». Savatlar (3, 0)…(5, 2); qahramon (4, 4); olma dasturida tayyor `go to x: 4 y: 1`; 3 ta blok. «Maslahat»: «Savatlar uch ustun va uch qator — qaysi sonlarga random kerak?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Tepa qator», ostida «Savatlar eng tepada.». Savatlar (1, 4)…(4, 4); qahramon (3, 2); 2 ta blok. «Maslahat»: «Ikki chetda gul bor — chetdagi savatlarning X ini o‘qing».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Chap ustun», ostida «Savatlar chap chetda.». Savatlar (0, 0)…(0, 3); qahramon (3, 0); 2 ta blok. «Maslahat»: «Tepada gul bor — eng yuqori savatning Y ini o‘qing».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «O‘z o‘yiningiz», ostida «Olmalar qayerga tushishini o‘zingiz tanlang.». Savat yo'q; qahramon (3, 2); 3 ta blok. «Maslahat»: «Daraxt va gullar orasidagi bo‘sh joyni toping — X va Y sini o‘qing». Erkin ijod (36-qaror).
  Yutsa: «Siz yutdingiz!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** olma dasturini tuzadi (1-pog'onada — tayyor dasturga random qo'shadi), «▶ Boshlash»ni bosadi, strelkalar bilan beshta olmani teradi; ★ da olmalar qayerga tushishini o'zi tanlaydi.
- **Tekshiruv:** «▶ Boshlash» bosilganda — olma dasturi 8-qadamdagi sanoqdan o'tdi (1–3: savatlar bilan; ★: random bor, maydondan chiqmaydi, daraxt va gulga tushmaydi, kamida 2 joy) va bitta `go to`; o'yinda 5 ta olma terildi (avto).
- **Xatoda:** random yo'q — Kamvoy «Yana o‘sha joy!» (o'yin boshlanmaydi); savat yo'q — Ortiqvoy «Savat yo‘q-ku!»; savat bo'sh qoladi — Kamvoy «Bu savat bo‘sh qoladi!»; ikki `go to` — Ortiqvoy «Ko‘payib ketdi!»; ★ da daraxt yoki gul — Kamvoy «Daraxtga tushadi!» / «Gulga tushadi!»; dastur bo'sh — Bo'shvoy.

## 16 · Olma dasturingizni o'qib bering

- **Vaqt:** 0:54–0:59 (5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — Blok studiya (ustoz, maydon savatsiz, Coddy (3, 2) da, olma dasturi bo'sh) · bola — o'z oxirgi yechgan pog'onasi, o'z dasturi bilan («Dasturingizni ustozga o‘qib bering»; A·1; hech narsa yechmagan bolada — «Ustoz ekraniga qarang»)
- **Sahna:** 12-bo'lim 3-band: bola olma dasturini ovoz chiqarib o'qiydi («go to x: random 2 to 5, y: random 0 to 2»), ustoz o'sha bloklarni qo'yadi va o'ynaydi. Bolaning dasturi o'z savatlari uchun tuzilgan — bezakka tushmaydi (jadval), proyektordagi maydonda ham olma faqat bo'sh joylarga tushadi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Olma dasturingizni o‘qib bering». Maydon, Coddy (3, 2) da; olma dasturi bo'sh. Coddy: «Siz o‘qiysiz — men teraman.»
  2. Bola o'qiydi; ustoz `go to` qo'yadi, random va sonlarni tanlaydi; «▶ Boshlash» — sinf olmalar qayerlarga tushishini ko'radi, ustoz 2–3 olmani teradi.
  3. Ikki-uch bola (★ ni bajarganlar birinchi).
- **Tayanch gaplar:**
  1. «Kim olma dasturini o‘qib beradi? Avval X, keyin Y: qaysi sondan qaysi songacha.»
  2. «Kuzating: olmalar qayerlarga tushyapti?»
- **O'z so'zi bilan:** bolani maqtaydi; sinf bilan olmalar tushgan joylarni bolaning sonlari bilan solishtiradi («3 dan 5 gacha — hammasi shu ustunlarda»).
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, o'yinni boshlaydi va bir necha olmani teradi.
- **Parta:** o'z oxirgi yechgan pog'onasi; shu ekranda qayta ishga tushirsa natija qayta sanalmaydi.
- **Bola qiladi:** dasturini o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:59–1:02 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «O‘yiningiz har safar boshqacha!». Bugungi so'z: «Tasodifiy son — Dastur o‘zi tanlaydigan son». Pastda: ✓ Bitta son · ✓ Ikki son · ✓ O'yin. Kichik karta «Keyingi dars · 14 · Xatoni topish».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: bitta son, ikki son, o‘yin.»
  2. «Bugungi so‘z — tasodifiy son: dastur o‘zi tanlaydigan son.»
  3. «Keyingi darsda dasturlardagi xatolarni topib tuzatamiz.»
- **O'z so'zi bilan:** «tasodifiy son» nimaligini bolalardan aytdiradi; zar misolini qaytaradi; qiyin pog'onalar solo'da — uyda — qayta ochilishini aytadi.
- **Parta:** yorliq «Sizning natijangiz», sarlavha «O‘yiningiz har safar boshqacha!». Coddy o'rniga qahramon: «Olmalarni dastur o‘zi tanlagan joylarga tushirdingiz.» «Siz bugun»: N ta random qo‘ydi · N ta olma tushirdi · N ta olma terdi (haqiqiy son; **KOD**). O'z qahramoni maydonda, oxirgi o'yinining savatlari va olmalari bilan; «Keyingi darsda xatolarni topamiz — ko‘rishguncha!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:02–1:05 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta random qo‘ydi · N ta olma tushirdi · N ta olma terdi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda xatolarni topamiz!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Kompyuter o‘yinlarida ham shunday: sovg‘a va to‘siq har safar boshqa joyda chiqadi.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–12-darsdagidek (88-qaror). Farqi:
- 2-qadam: o'yin (olma doim (3, 0) ga) o'zi yuradi; 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 5-qadam: «Keyingi»ni bola o'zi bosadi (bo'laklar birma-bir yonadi).
- 7, 10-qadam (ustoz ko'rsatadi): dastur tayyor turadi (7 da — `random 1 to 10` bilan, 10 da — bitta random bilan); bola o'zi «▶ Ishga tushir»ni bosadi, ishora sonlarni o'zgartirishni aytadi («random sonlarini 1 va 5 ga o‘zgartiring», «Y ga ham random qo‘ying»). Tanlovlar jonli darsdagidek oldindan berilgan (7-qadam: 8, keyin 4, 2, 5; 10-qadam: (4, 1), keyin (5, 2), (3, 1), (4, 2)).
- 14-qadam: olma dasturi tayyor; bola o'zi «▶ Boshlash»ni bosadi va o'ynaydi.
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi. Bola pog'onalarida tasodif — haqiqiy.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-013-tasodifiy-son-v1`, kalit `jr013` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Zar» (`zar`) — 8-qadamda 1-pog'ona bajarildi (birinchi tasodifiy dastur); «Bog‘bon» (`bogbon`) — 15-qadamda 1-pog'ona bajarildi (birinchi tasodifiy o'yin yutildi).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Darsda savol bitta — boshidagi huk (olma doim bir joyga tushadi). Qolgan joyda bolalardan taxmin so'ramang: avval ko'rsating, keyin bolalar o'zi bajaradi.
- Yangi blok: `random 1 to 10` — tasodifiy son. U oval: o'zi yurmaydi, `go to` ning sonlari o'rnida turadi. Qo'yishni sekin ko'rsating: `go to` dagi sonni bosing → ro'yxat oxirida «random». Ikkala sonini ham bosib tanlash mumkin.
- Bugungi asosiy fikr bitta: **dastur sonni o'zi tanlaydi — biz faqat «dan … gacha»ni aytamiz; shuning uchun tasodifiy dasturni bir necha marta sinaymiz.** Hukda, xulosada va 3-bekatda (o'yin) chiqadi.
- 1–2-bekatda dastur olmaniki: har `go to` — bitta olma tushadi. Qahramon faqat kuzatadi. 3-bekatda qahramonning strelka dasturchalari tayyor — bolalar faqat olma dasturini tuzadi.
- «Sinov: 1 / 3» — ataylab: bir marta savatga tushgani hali hammasi emas. «Bu savat bo‘sh qoladi!» chiqsa — dastur random'ning hamma sonini o'zi sanab ko'rgan: bola sonlarni kengaytirishi kerak.
- Ko'rish ekranlarida (huk, 7, 10, 14) random tanlagan sonlar oldindan berilgan — ko'rsatuv rejadagidek chiqadi. Bola pog'onalarida tasodif haqiqiy.
- 16-qadamda bolaning ismi proyektorga chiqmaydi: bola dasturini o'zi o'qiydi, siz bosasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **`random` bloki** (Blockly: oval son bloki — `go to` ning X va Y, `repeat` soni katagiga ulanadi; ikki son maydoni — JrSon ro'yxati 0–10, oq kapsula; javonda `random 1 to 10`; oila va rang — «Savollar» 3). Bosish yo'li: son katagini bosganda JrSon ro'yxatining oxirida «random» bandi — tanlansa, katakka `random 1 to 10` ulanadi (sudrashsiz yo'l, 9-bo'lim 6-band). Blok sanog'ida 1 ta. «Kodini ko'rsat»da (19-dars) — `Math.floor(Math.random() * …)` (o'sha darsda).
2. **Ijro:** tugunning son maydoni son yoki `{ r: [a, b] }`; ijroda har safar yangi son (`TASODIF()` — brauzerda `Math.random`, sinovda urug'li); blok ustida tanlangan son pufagi (ijro tugaguncha). **Ko'rish ekranlarida** (huk, 7, 10, 14, 5-qadam rasmi) — `studiya[id].tanlov: [8, 4, 2, 5]` — sonlar shu tartibda (jonli va solo'da).
3. **Olma dasturi** (`bosh.olmaDastur: true`): dastur egasi — olma (tasma boshida olma rasmi, «Olma dasturi»); `go to` — yangi olma tepadan o'sha katakka tushadi (harakat + «tup»), oldingilari qoladi; qayta ishga tushirishda olmalar olinadi, tushgan joylar xira belgi bo'lib qoladi (pog'ona davomida); qahramon o'z katagida (`bosh.q`), olma savatga tushsa quvonadi.
4. **Savatlar va baho** (`bosh.savat: [[x, y]…]` yoki guruhlar `[[…], […]]` — 8 · ★; `bosh.olmaSoni`): random qiymatlarini sanab chiqish — chet · savat yo'q · savat bo'sh qoladi · random yo'q · olma soni · guruh (yuqoridagi jadval va muammochalar); «Sinov: N / 3» va kamida 2 xil joy; «Har safar boshqa joy!».
5. **O'yin + olma dasturi** (`bosh.oyin` + `olmaDastur`, 4-dars o'yini asosida): qahramonning to'rt strelka dasturchasi tayyor, o'qish uchun (`prog` — o'zgarmas karta «Qahramon»); «▶ Boshlash» — avval olma dasturi bahosi (4; o'tmasa — muammocha, o'yin boshlanmaydi); olma tushadi; qahramon olma katagiga kirsa — olindi, «Olma: N / 5», olma dasturi qayta ishlaydi; 5 ta — «Siz yutdingiz!». ★ (`erkinOlma`): savatsiz — random bor, chet yo'q, daraxt/gul yo'q, kamida 2 joy.
6. **Huk kartalari:** har kartada ikki o'yin × 3 olma, karta ostida ikki qator son («1-o‘yin: 5 · 5 · 5»); C — `tanlov`; natija kartada.
7. **5-qadam ko'rinishi** — uch holat oldindan chiziladi (`raqam` ishi): zar va blok · «4» · «2».
8. **Natija va yutuqlar** — `DARS.natija`: «ta random qo‘ydi» (muvaffaqiyatli dasturlardagi random bloklari), «ta olma tushirdi» (savatga tushgan olmalar), «ta olma terdi» (o'yinda); yutuqlar `zar`, `bogbon`. 16-qadam — A·1 (`'oxirgi'`, mavjud).
9. **Simulyatsiya sinovi** `sinov/dvigatel/tasodif.mjs` — yuqoridagi jadvaldagi har yechim, xato varianti va o'yin, urug'li tasodif bilan (bu manba uchun yozilgan namuna skript: `s13.mjs`, «Tekshirilmagan joylar» 12).

## Savollar (tavsiya — A)

1. **Tasodifiy son nimaga ishlatiladi? — A: olma tushadigan joy — `go to` ning X va Y si, savatlar bilan.** Sabab: dastur natijasi aynan shu («olmalar har safar boshqa joydan tushadi»); savatlar «dan … gacha»ni o'ylab tanlashga majbur qiladi — ko'p ham, kam ham bo'lmasin; 3-darsdagi X va Y takrorlanadi. **B** — qahramonning o'zi tasodifiy joyga sakraydi (dastur qahramonniki, olma yo'q): oddiyroq (KOD 3 kerak emas), lekin natija «olmalar tushadi» emas va o'yinda ma'nosi yo'q. **C** — `repeat` sonida (necha qadam tasodifiy): maqsad tekshirib bo'lmaydi — «yulduzga yetsin» degan masala tasodif bilan buziladi.
2. **Blok — A: oval `random 1 to 10`, son katagiga qo'yiladi** (Scratch'dagi «pick random» kabi; JavaScript'da `Math.random` — 85-dars). Bosish yo'li — son ro'yxatidagi «random» bandi. **B** — `pick random 1 to 10` (Scratch so'zma-so'z: uzun — `go to x: (pick random 0 to 6) y: (pick random 0 to 2)` dastur ustuniga sig'masligi mumkin). **C** — alohida blok `go to random x` (oval yo'q, sudrash ham yo'q — lekin «son» tushunchasi yashirinadi va 85-darsga ko'prik bo'lmaydi). Javonda boshlang'ich sonlar 1 va 10 — ataylab: bola ikkalasini ham o'zi tanlaydi (5-darsdagi `repeat 2` kabi).
3. **Oila va rang — A: 11-dars o'zgaruvchi bloklari bilan bitta oila** («son beradigan bloklar» — ball, jon, tasodifiy son; javonda yangi rang qo'shilmaydi). 11-dars manbasi yo'q — oila nomi va rangi o'sha yerda hal bo'ladi. **B** — alohida oila «Tasodif», yangi rang (band ranglar ko'p: ko'k, binafsha, to'q sariq, yashil, feruza, pushti, kulrang-ko'k, magenta, coral, sariq, oltin — o'n ikkinchisi adashtiradi).
4. **Dastur egasi — A: 1–2-bekatda olma** (har `go to` — bitta olma tushadi, qahramon kuzatadi); **3-bekatda o'yin: qahramon dasturchalari tayyor + bola tuzadigan olma dasturi** (KOD 3, 5). Sabab: bola bitta yangi narsaga — randomga — e'tibor beradi; olma «o'zi tushadi» — natijaga mos. **B** — 3-bekatda qahramonning dasturchalarini ham bola tuzadi (4-darsdagidek) — 5 daqiqa qo'shiladi, mavzudan chalg'itadi.
5. **Tekshiruv — A: dvigatel random'ning hamma qiymatini sanaydi + kamida 3 marta ishga tushirish va 2 xil joy.** Sabab: tasodifan uch marta savatga tushsa ham xato sezilmay qolmaydi; bola esa «har safar boshqa»ni ko'zi bilan ko'radi. **B** — faqat 3 marta ishga tushirish (sanashsiz): `random 0 to 6` da 7 ta savatdan bittasi tushib qolsa ham o'tib ketadi.
6. **11–12-dars bilan bog'lanish — A: o'yin hisobi «Olma: N / 5» (4-dars yozuvi); o'zgaruvchi bloklari bu darsda ishlatilmaydi.** 11–12-dars manbasi tayyor bo'lgach — o'yinda ball (va jon) o'sha darslardagidek ko'rinadi, bolaga yangi ish qo'shilmaydi. **B** — 3-bekatda olma dasturiga `change ball by 1` (olma olinganda) — 11-darsni takrorlaydi, lekin olma dasturi ikki hodisali bo'lib qoladi («tushganda» va «olinganda»).
7. **Huk — A: «ikki o‘yin × uch olma» — kartada ikki qator son.** Bolalar «bir xil» ni sonlardan ko'radi. **B** — «ko'zni yumib»: ustoz 1-o'yindagi tugmalarni 2-o'yinda yodidan bosadi (A va B da yutadi, C da yo'q) — kuchliroq, lekin sinov 4–5 daqiqa.
8. **Ko'rish ekranlarida tanlov oldindan berilgan — A** (7-qadamda «8» albatta chiqadi — maydondan tashqarisi ko'rinadi; hukdagi C — «4 · 1 · 6 / 2 · 5 · 0»). **B** — haqiqiy tasodif (7-qadamda 60% hollarda «8» kabi son chiqmaydi — ustoz o'sha gapni aytolmaydi).
9. **Erkin ijod — A: 3-bekatning ★ pog'onasi «O‘z o‘yiningiz»** (36-qaror; shart: random bor, olma maydondan chiqmaydi, daraxt va gulga tushmaydi; 16-qadamda sinfga o'qib beriladi). **B** — ★ ham savatli yopiq masala (97-qaror istisnosi).
10. **Bekat nomlari — A: «Bitta son · Ikki son · O‘yin».** **B** — «Qator · To‘rtburchak · O‘yin» (savat shakli bo'yicha; lekin 8 · 3 — ustun, qatorga to'g'ri kelmaydi).
11. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi natija 11:30–12-daqiqada; uch marta ishga tushirish ~10 soniya (har tushish ~0,7 s + tushish harakati). Huk sinovi uzaysa — 5-qadamni qisqartirish kerak.
2. **11–12-dars manbalari yo'q.** 1-qadamdagi «O‘tgan darsda» kartasi (`change jon by -1` — «Jon — Tugasa, o‘yin tugaydi»), 1-tayanch gap («o‘yinga jon qo‘shdik») va 11–12-dars o'yini («Olma terish» — 4-dars o'yini asosida, olma katakda) — taxmin. Agar 11–12-darsda o'yin vaqt bilan yursa (olma tepadan qator-qator tushadi, qahramon pastda ushlaydi), 3-bekat o'yini shunga moslanadi: olma dasturi o'zgarmaydi (`go to x: (random …) y: 4`), faqat tushish yo'li uzayadi.
3. `random` oval bloki Blockly'da `go to` katagiga ulanganda blok kengayadi — `go to x: (random 0 to 6) y: (random 0 to 2)` dastur ustuniga sig'adimi, shrift kichraymaydimi (setka darvozasi; sig'masa — `go to` bloki ikki qatorga bo'linadi: X tepada, Y pastda; «Savollar» 2-B dagi uzun yozuv bundan ham keng).
4. «Bu savat bo‘sh qoladi!» — dvigatelning sanog'i, bola uch ishga tushirishda buni ko'zi bilan ko'rmaydi. 9 yoshli bola uchun tushunarlimi (ishorada aniq savat bor) — sinfda kuzatiladi.
5. 8 · 2 (3 ta savat) — 12% hollarda uch marta ham bir xil joy, «Yana bir marta» (eng ko'pi 9 marta, 2000 urug'). Bola «buzildi» deb o'ylashi mumkin — ishoradagi «bu ham tasodif» gapi yetadimi.
6. Tasodif «har safar boshqa» emas — ba'zan bir xil son chiqadi (hukdagi C da ham: haqiqiy tasodifda ikki o'yin aynan bir xil chiqishi ≈ 1/343). Dasturdagi natija «har safar boshqa joydan» — bolaga «har safar boshqa son» deyilganda bu nozik joy ishorada aytiladi («bu ham tasodif»).
7. Ko'rish ekranlarida tanlov oldindan berilgan (KOD 2) — solo'da ham. Bola solo'da 7-qadamni ikki marta ochsa, o'sha sonlar qaytadi — sezsa, «tasodif emas-ku» deyishi mumkin.
8. Olma qahramon turgan katakka tushsa — darrov olinadi (bosishsiz, 14-qadam urug' 7 dagi ikkinchi olma). Ataylab qoldirildi — «to‘g‘ri qo‘lingizga tushdi»; noqulay bo'lsa — olma qahramon katagidan qochadi (KOD).
9. Savat rasmi kulrang rasm kataklari (5–6-dars) bilan adashmasin — etalon ranglari bilan solishtiriladi.
10. 7-qadamda olma maydon chetidan «tashqariga tushishi» qanday ko'rinadi (chetda turtilib to'xtaydimi yoki maydon tepasida qoladimi) — qurishda ko'riladi.
11. 3-bekat 15 · 1 tayyor dasturi `go to x: 4 y: 1` — «▶ Boshlash»da o'yin boshlanmaydi (muammocha). Bola «o'yin ishlamayapti» deb o'ylashi mumkin; Kamvoy ishorasi yetadimi — sinfda ko'riladi.
12. Simulyatsiya — manba yozilganda kichik node skripti bilan (dvigatelning nusxasi emas, uning qoidalari bo'yicha qayta yozilgan; vaqtinchalik papkada, loyihada saqlanmagan): `/tmp/claude-1000/-home-kali-Desktop-internetLesson/3510bd46-e15e-496a-a632-ef7559f330ca/scratchpad/m13/s13.mjs` (`dvig.mjs` bilan). Dars qurilganda haqiqiy dvigatel bilan `sinov/dvigatel/tasodif.mjs` (KOD 9) — farq bo'lsa, jadval tuzatiladi.
13. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (21.11, avtopilot — foydalanuvchi ko'rigi kutilmoqda; har birida tanlangan yo'l, istalganini keyin o'zgartirsa bo'ladi)

1. **«Savollar» 1–11 — hammasi tavsiya (A) bo'yicha:** random `go to` ning X va Y si uchun, savatlar bilan; oval `random 1 to 10` son katagiga; O'zgaruvchi oilasida (jigarrang — 11-darsdagi); 1–2-bekatda olma dasturi, 3-bekatda o'yin; hamma qiymatni sanab chiqish + 3 marta, 2 xil joy; o'yinda «Olma: N / 5»; huk — ikki o'yin × uch olma; ko'rish ekranlarida tanlov oldindan; ★ «O‘z o‘yiningiz».
2. **`go to` — son katakli yangi blok** (13-darsdan): X va Y — son katagi (ro'yxatdan 0…6 / 0…4, oxirida «random»); 3–10-darsdagi `go to` o'zgarmadi. random bloki katakdan ✕ bilan olinsa — son qaytadi.
3. **Javondan random bosilsa** — tanlangan (yoki oxirgi) `go to` ning bo'sh son katagiga tushadi (avval X, keyin Y); bo'sh katak yo'q bo'lsa — qo'shilmaydi, ishora «random — sonning o‘rniga: avval go to qo‘ying». Javondan katakka sudrash (manbadagi ikkinchi yo'l) yo'q — javon bloklari bosiladi (9-bo'lim 6-band).
4. **`repeat` sonida random yo'q** — manbada topshiriq yo'q (11 · ★ da `repeat 3` doimiy son); kerak bo'lsa keyingi darslarda.
5. **Huk (2-qadam):** «olma doim (3, 0) ga — Coddy qimirlamay yutdi» — o'yin animatsiyasi emas, natija rasmi («Olma: 3 / 3»); solo'da ham shunday (manba: solo'da o'zi yuradi).
6. **Olma tushishi** — tepadan tushish harakati va yengil «qadam» tovushi; maydondan tashqarisi — chetda turtiladi, «tuk». Oldingi ishga tushirishdagi olmalar — xira belgi (pog'ona davomida).
7. **«Sinov: N / 3»** — dastur o'zgarsa sanoq boshidan; muammochali ishga tushirish sanalmaydi.
8. **Ortiqvoy «random 5 ni ham tanlashi mumkin…»** — ikki random bo'lsa, savatdan chiqaradigan koordinataning soni aytiladi (birinchi topilgan katak).
9. **3-bekat o'yini:** olma qahramon turgan katakka tushsa — darhol olinadi va yangisi tushadi; «Qahramon» qatori (to'rt strelka) — bosilsa ochiladi, o'zgartirilmaydi (11-darsdagi «Boshqaruv» qatori kabi).
10. **Natija:** «ta random qo‘ydi» — muvaffaqiyatli pog'onalar dasturidagi random bloklari (yig'indi); «ta olma tushirdi» — muvaffaqiyatli sinovlarda savatga tushgan olmalar; «ta olma terdi» — o'yinlarda.
11. **3-bekat doskasining katta soni** — «Uch o‘yinni yutdi» (3-pog'ona).
12. **Manba matni:** «noto'g'ri», «xato qildingiz», «Tekshirilmagan joylar», «random faqat X uchun», «N / M ta blok» — oddiy qo'shtirnoqda (ekran gapi emas); belgilar, namunaviy sonlar va muammocha namunalari ustoz varag'ida.

