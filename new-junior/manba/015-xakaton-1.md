# 15-dars. Xakaton №1

> **Holat: v1.1 — 21.11: foydalanuvchi «Savollar» 1–13 hammasi A; audit filtri — «Qurishdagi qarorlar»; yangi savollar 14–18 — Qabul: A (21.11, foydalanuvchi, ko'rik 9-versiya).** v1 — qoralama (21.11; agent yozdi, tavsiya bo'yicha). Bu fayl — manba-haqiqat: dars papkasi (`../darslar/015-xakaton-1/`) shundan quriladi.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–14-dars bilan bir xil (`001-tanishuv.md`: 'Ekranlar ko'rinishi', 'Yordam va xato', 'Tovush', 'Solo' bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 15-dars («Xakaton №1», xakaton — natija: juftlikda 60 daqiqada kichik o'yin; o'rganadi: ishni bo'lishish va vaqtida tugatishni mashq qiladi; nega: o'rganganini erkin sharoitda va jamoada qo'llash; tekshiruv: jamoalar baholashi + mentor).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Bu manba yozilganda dvigatel faqat o'qildi (`dvigatel/qobiq.js`, `studiya.js` — grep): juftlik, sinf taymeri, baholash ekrani yo'q; «Do‘stingiz o‘ynaydi» rejimi (10-dars) va o'yin saqlash bor; «Maslahat» qulfi o'yin rejimida ham ochiladi (dvigatelda tuzatildi, 21.11). Simulyatsiya yurgizilmagan (CPU band) — namunaviy yechimlar oldingi darslar jadvallaridan olingan; dars qurilganda sinov — `sinov/dvigatel/xakaton.mjs` (**KOD** 15).
> **Bu — kursdagi birinchi xakaton.** `KONSEPSIYA.md` 4-bo'limi: «Yuqoridagi ritm faqat «yangi mavzu» uchun. Qolgan turlarga alohida, soddaroq qolip kerak» (7-bo'lim, 7-ochiq savol). Bu dars xakaton qolipining birinchi nusxasi: 6- va 14-dars (amaliyot) qolipidan olingan — huk → yangi so'z → reja → qoida → uch bekat → ko'rsatish → yakun; farqi — uch bekat bitta uzun juftlik ishi (60 daqiqa), ustoz ko'rsatuvlari deyarli yo'q («Savollar» 9).

## Pasport

- **Dars turi:** xakaton (blokli). Yangi mavzu yo'q, **yangi blok yo'q** — faqat 1–14-darsda o'tilgan bloklar. Yangi so'z bitta — «xakaton» («Savollar» 10). Yangi ish — juftlikda ishlash: haydovchi va xaritachi (**KOD** 1, 5; «Savollar» 15).
- **Natija (dasturdan):** juftlikda 60 daqiqada kichik o'yin. **Bu manbada:** juftlik ikki o'yindan birini tanlaydi — «Olma terish» (yangi birlashgan o'yin: 4-dars strelkalari + 11–12-dars ball/jon/qadam, «Quvonch» qismida 7-dars kostyum va tovushi; **KOD** 6) yoki «Labirint» (9–10-dars qismlari) — va unga **qismlarni** navbat bilan qo'shadi: birinchi qism (to'rt strelka) majburiy, yana ikkitasini juftlik o'zi tanlaydi, ★ — qo'shimcha. To'liq natija — 3 qism yasaldi, sinash ro'yxati to'liq, do'stlar o'ynab ko'rdi; yutuq uchun kamroq ham yetadi (LMS bo'limi, «Savollar» 2, 16).
- **Bola nimani mashq qiladi:** **ishni bo'lishish** — har qismni bitta haydovchi yasaydi, qism tayyor bo'lsa rollar almashadi (ikkalasi ham haydaydi, ikkalasi ham xaritaga qaraydi); **vaqtida tugatish** — avval o'ynaladigan o'yin (to'rt strelka), keyin qo'shimcha; har qismdan keyin o'yin o'ynaladi — vaqt tugasa ham qo'lda ishlaydigan o'yin qoladi; **sinash** — 14-dars usuli: hamma holatni sinash, tuzatish. Darsdagi yagona fikr: **ishni bo'lamiz, navbat bilan; avval o'yin ishlasin — keyin qo'shamiz.**
- **Tekshiruv (dasturdan: jamoalar baholashi + mentor):** avto — har qism o'zi tekshiriladi: 2-bekatda «qism tayyor», 3-bekatda sinash bandi (**KOD** 4, 9); **juftliklar baholashi** — do'st juftlik o'yinni o'ynaydi: yutdimi, o'yin buzilmadimi (avto; 'xatosiz' — o'yin muammochasiz tugadi, devorga urilish va `game over` — odatiy holat, buzilish emas) va «Sizga yoqdi:» (to'rt rasmli karta, **KOD** 10; «Savollar» 5, 18); **mentor** — darsdan keyin LMS'da har juftlik: qismlar, ro'yxat, kim qaysi qismni haydadi, do'stlar bahosi (**KOD** 13, LMS — modul tugagach, 93-qaror).
- **Vaqt:** reja 80 daqiqa, shundan juftlik ishi 60 daqiqa (10:30–1:10:30). Vaqtda zaxira yo'q — dars 80–90 daqiqa, reja eng qisqasiga sig'adi. **12-bo'lim 4-bandidan istisno** (reja 65–72 daqiqa) — «Savollar» 12. Zaxira vaqtda emas, hajmda: ★ qism va 16-qadamdagi ko'rsatish (3 → 1 juftlik).
- **Uch bekat:** 1 · Tanlaymiz — 2 · Yasaymiz — 3 · Sinaymiz. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (10-, 12-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob). 15-qadamdagi «Sizga yoqdi:» — savol emas, do'stning o'yiniga belgi (taxmin yo'q, to'g'ri javob yo'q; 59-qaror chegarasida — «Savollar» 5, 18).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda Coddy; juftlik o'yinida — **o'yin noutbuki egasining qahramoni** (94-qaror); ikkinchi bolaning qahramoni — o'z noutbukidagi «Juftlikdasiz» ekranida va yakunida («Savollar» 1). O'ylab topilgan personaj yo'q; rollar — rasm bilan: haydovchi — rul, xaritachi — xarita (odam qiyofasi yo'q).
- **Oldingi darslar bilan bog'lanish:** 14-dars yakunidagi va'da: «Keyingi darsda do‘stingiz bilan juftlikda kichik o‘yin yasaysiz — xakaton.»; 14-dars usuli («Xato — topiladigan narsa: ishga tushiring, qadam-baqadam yuring, tuzating, yana sinang», «Hamma holatni sinang!») — 3-bekatda. 10-dars — «Do‘stingiz o‘ynaydi» (o'yin rejimi, dastur yopiq) — 15-qadamda. 4, 7, 9, 10, 11, 12-dars — qismlarning bloklari. 6- va 14-dars — amaliyot qolipi, «Maslahat» bir urinishdan keyin.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–6 | Savolga javob beradi: ikki do'st, o'yin bitta — uni qanday yasaymiz? Sinf uchalasini sinaydi: ikkalamiz birga bossak — bir ishni ikki marta qilamiz, har kim o'zinikini yasasa — ikki yarim o'yin, ishni bo'lib navbat bilan — bitta to'liq o'yin | 2–4 |
| 6–7 | Yangi so'z: xakaton | 5 |
| 7–8 | Bugungi rejani ko'radi | 6 |
| 8–9:30 | Bugungi qoidani ko'radi: haydovchi, xaritachi, qism tayyor — o'ynaymiz, keyin almashamiz | 7 |
| 9:30–10:30 | Juftligi bilan bitta noutbuk oldiga o'tiradi | 8 |
| 10:30–15:30 | Juftlik o'yinni va ikki qismni tanlaydi | 9 |
| 15:30–47 | Navbat bilan yasaydi: 1-qism (to'rt strelka) → almashish → 2-qism → almashish → 3-qism → ★ | 10–11 |
| 47–58:30 | O'yinni hamma holatda sinaydi va tuzatadi | 12–14 |
| 58:30–1:10:30 | Keyingi stoldagi juftlikning o'yinini o'ynaydi, «Sizga yoqdi:» ni belgilaydi; qaytib, do'stlar qanday o'ynaganini ko'radi | 15 |
| 1:10:30–1:15:30 | Ikki-uch juftlik o'yini haqida aytadi | 16 |
| 1:15:30–1:20 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da (o'yin tanlash), birinchi natijasi (1-qism: to'rt strelka, o'yin o'ynaladi) — ~26–28-daqiqada (tanlash 5 daqiqa + bekat 0,5 + to'rt strelka 8 blok, 4-darsda ~12 daqiqa). 12-bo'lim 1-band (10–12 daqiqa) bo'yicha mustaqil ish 10:30 da boshlanadi; birinchi «g'alaba» kechroq — xakatonda tanlash va juftlik kelishuvi uchun to'langan narx (Tekshirilmagan joylar, 1-band).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam; «Savollar» 10).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| xakaton | birga, oz vaqtda bitta narsa yasash (bugun — juftlikda o'yin) | 5 (va 6, 17) | uch bo'lak birma-bir: rul va xarita belgilari, ostida «Juftlik» → «O‘yiningizda:» ro'yxati, uch band birin-ketin ✓ → maydonda tayyor o'yin o'zi o'ynaladi, tepada bayroqcha «Tayyor!» |

Yordamchi so'zlar (ta'rifsiz yoki rasm bilan, 7-qadamda bir marta): juftlik, haydovchi, xaritachi, qism, almashish, do'stlar o'ynaydi. 1–14-darsdan: blok, dastur, dasturcha, qahramon, yulduz, olma, oltin olma, kaktus, katak, maydon, labirint, devor, kalit, eshik, daraja, hodisa, tugma, strelka, shart, qoida, o'zgaruvchi, ball, jon, qadam, kostyum, tovush, o'yin, yutish, «O‘yin tugadi», ro'yxat, xato (dasturdagi — 98-qaror), tuzatish, sinash, hamma holat.

Bir ma'noga bitta so'z:
- «juftlik» — birga ishlaydigan ikki do'st («jamoa», «guruh» ekranda deyilmaydi; uch kishi bo'lsa ham — «juftlik», «Savollar» 8). Hukda va bolaga gapda — «do‘st» («Ikki do‘st, o‘yin esa bitta.»), «ikki kishi» deyilmaydi. Diqqat: 5-darsda ustoz ishorasida «Bir xil juftlik — N marta» (ikki blok) bor — «Savollar» 17.
- «haydovchi» — sichqoncha qo'lida, bloklarni qo'yadi, o'yinni o'ynab sinaydi; «xaritachi» — qism kartasini o'qiydi, nima kerakligini aytadi, kuzatadi (metafora — 7-qadamda ochiq aytiladi: «Biri rulda, biri xaritaga qaraydi.»; 9-bo'lim 9-band). «Yo‘lboshchi», «navigator», «driver», «pilot» deyilmaydi («Savollar» 15).
- «qism» — o'yinning bitta bo'lagi («To‘rt strelka», «Ball», «Jon»…); «vazifa», «bo‘lak» deyilmaydi; «topshiriq» va «pog‘ona» — mashq so'zlari, bu darsda ishlatilmaydi (10-dars «Savollar» 6: «pog‘ona» — mashq, «daraja» — o'yin).
- «almashish» — faqat rollar: haydovchi xaritachi bo'ladi va aksincha. 15-qadamda juftliklar stoldan stolga o'tganda 'almash' deyilmaydi — «keyingi stolga o‘tamiz».
- «sinash» — o'yinni hamma holatda o'ynab ko'rish (14-dars; «test qilish» deyilmaydi); «ro‘yxat» — «O‘yiningizda:» bandlari (10-dars; «chek-list» deyilmaydi).
- «do‘stlar o‘ynaydi» — boshqa juftlik o'yinni o'ynaydi; tugma — 10-darsdagidek «▶ Do‘stingiz o‘ynaydi»; «yoqdi» — do'stlarning belgisi («Sizga yoqdi:»). Do'st o'yinining natijasi — «yutdi» yoki «yulduzgacha yetmadi».

Bu darsda AYTILMAYDI: «baho», «ball» va «yulduzcha» baho ma'nosida (ball — 11-darsdagi o'zgaruvchi, yulduz — o'yindagi maqsad: baholashda ishlatilsa, ma'no aralashadi — «Savollar» 5), «g‘olib», «yutqazdi», «eng yaxshi o‘yin», «musobaqa»; ekranda daqiqa va taymer (63-qaror; «Savollar» 4); yangi blok (16-darsdagi klon); «Kodini ko‘rsat» (19-dars).

## Maydon, o'yinlar va qismlar

**Ikki o'yin** (`bosh` — oldingi darslardagi sahnalar; birga ishlashi **tekshirish kerak**, KOD 4, 6). Tanlash — 9-qadamda; o'yin noutbukida tanlangan o'yin dars oxirigacha saqlanadi (**KOD** 14).

**«Olma terish»** — yangi birlashgan o'yin (**KOD** 6) 11–12-darsdagi bog'da (7 × 5, X va Y, bezak — daraxtlar (1, 1) · (4, 3) · (6, 1), gullar (0, 4) · (2, 3) · (5, 4) · (6, 3), devor emas). Qahramon (0, 0); olmalar (2, 2), (5, 0), (3, 4); kaktuslar (4, 1), (1, 3) — qahramon o'ta olmaydi, turtiladi, «tuk» (12-dars); yulduz (6, 4) — olmalar terilgach ochiladi (4-dars). Oltin olma — faqat ★ «Oltin olma» tanlansa maydonda chiqadi (joyi — qurishda, bezak va boshqa narsalar katagida emas; «Savollar» 14). O'yin rejimi: «▶ Boshlash» / «■ To‘xtatish». Hech qaysi start, olma, kaktus, yulduz bezak katagida va (1, 2) da emas (11–12-dars qoidasi; **tekshirish kerak**, simulyatsiya — KOD 15).

**«Labirint»** — 9–10-darsdagi bog' labirinti: 1-daraja — D1 (9-dars labirinti, 10-dars jadvalidagi xarita: ★ (6, 4) · K (1, 3) · E (5, 2)); start doim (0, 0). O'yin rejimi va darajalar — 10-dars («Daraja: 1 / 2», «2-daraja!»). 2-daraja — juftlik o'zi yasaydi (10-dars labirint yasash asboblari: «Devor» · «Kalit» · «Eshik» · «Yulduz»).

**Qismlar** — juftlik 1-qismdan keyin yana ikkitasini tanlaydi (★ — vaqt qolsa, ro'yxatda alohida). Har qism — oldingi darsdagi natija. Tekshiruv ikki xil (**KOD** 4, 9):
- **Qism tayyor (2-bekat)** — qismning bloklari qo'yildi va o'yin bir marta buzilmay o'ynaldi;
- **sinash bandi (3-bekat)** — shu qism hamma holatda to'g'ri ishlaydi (o'sha darsning chuqur sharti).

1-qism — majburiy (ekranda belgisi yo'q; 9-qadamda kartasida «Bu qismsiz o‘yin yurmaydi»).

| O'yin | Qism (ekranda) | Qism kartasida (xaritachi o'qiydi) | Bloklar (namuna) · hajm belgisi | Qaysi darsdan | Qism tayyor (2-bekat, avto) | Sinash bandi (3-bekat, avto) |
|---|---|---|---|---|---|---|
| Olma terish | 1 «To‘rt strelka» | «Har strelka qahramonni o‘z tomoniga yurgizsin» | `when → key pressed` → `move right` × 4 (to'rt tomon) — 8 blok · «8 ta blok» | 4 | to'rt strelkaning har biriga dasturcha bor; o'yin bir marta buzilmay o'ynaldi | «Har strelka o‘z tomoniga» — har strelka bosildi va o'z tomoniga yurdi (14-dars KOD 11) |
| | 2 «Ball» | «Olma terilsa — ballga 1. O‘yin noldan boshlansin» | `when ▶ clicked` → `set ball to 0`; `when touching apple` → `change ball by 1` — 4 blok · «4 ta blok» | 11 | `set ball` — `when ▶ clicked` ostida, `change ball` — olma hodisasida; o'yin bir marta buzilmay o'ynaldi | «Ikki marta o‘ynadik — ball noldan boshlandi» (yutganda ball = 3, ikkinchi o'yinda ham noldan) |
| | 3 «Jon» | «Kaktusga tegsa — jon kamaysin. Jon 0 — o‘yin tugaydi.» | `when ▶ clicked` → `set jon to 3`; `when touching cactus` → `change jon by -1`, `if jon = 0 then` → `game over` — 6 blok · «6 ta blok» | 12 | jon bloklari qo'yildi (`set` — `when ▶ clicked` ostida, `change` va `if` — kaktus hodisasida); o'yin bir marta buzilmay o'ynaldi | «Jon 0 da tugaydi» — aynan 0 da, na erta, na kech (12-dars) |
| | 4 «Qadam» | «Har bosishda qadam kamaysin. Qadam 0 — o‘yin tugaydi. Qadam yulduzgacha yetsin.» | `when ▶ clicked` → `set qadam to 20`; `when any key pressed` → `change qadam by -1`, `if qadam = 0 then` → `game over` — 6 blok · «6 ta blok» | 12 | qadam bloklari qo'yildi; `set qadam` soni eng qisqa yo'ldan kam emas (kam bo'lsa — ishora «Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi»); o'yin bir marta buzilmay o'ynaldi | «Qadam 0 da tugaydi» — aynan 0 da; yutish ham mumkin |
| | 5 «Quvonch» | «Olma terilsa — qahramon xursand, tovush chalinsin» | `when touching apple` → `switch costume to xursand`, `play sound jiring` — 3 blok · «3 ta blok» | 7 | kostyum va tovush bloklari olma hodisasida; o'yin bir marta buzilmay o'ynaldi | «Olma terilganda — xursand va ♪» |
| | ★ «Oltin olma» | «Oltin olma — 10 ball» | maydonda oltin olma (★ tanlansa); `when touching gold apple` → `change ball by 10` — 2 blok · «2 ta blok» | 11 | oltin olma terilganda ball 10 ga ko'paydi; «Ball» qismi bo'lmasa — ★ ochilmaydi | — (umumiy «O‘yin yutildi») |
| Labirint | 1 «Strelka va qoida» | «Har strelka yurishdan oldin tekshirsin» (9-dars ishorasi) | `when → key pressed` → `if path → then` → `move right` × 4 — 12 blok · «12 ta blok» | 9 | to'rt strelkaning har birida `move` — `if path` ichida, shart tomoni `move` niki bilan bir xil (9-dars); 1-daraja bir marta buzilmay o'ynaldi | «Devor tomonga bosildi — urilmadi» |
| | 2 «2-daraja» | «2-daraja bo‘lsin: labirintni o‘zingiz yasang, kamida 6 ta devor» | labirint yasash (asboblar) · «6 ta devor» | 10 | kamida 6 devor, yulduzga yo'l bor (10-dars 8 · 1); «▶ Sinab ko‘rish» bilan bir marta buzilmay o'ynaldi | «Ikki daraja yutildi» — «▶ Boshlash» bilan ketma-ket (10-dars) |
| | 3 «Kalit va eshik» | «Eshik yo‘lni to‘ssin, kalit eshikdan oldin bo‘lsin.» (10-dars 11 · 1) | asboblar «Kalit», «Eshik» · «2 ta asbob» | 10 | 10-dars 11 · 1 sharti: 2-darajada eshik yo'lni to'sadi, kalitga eshiksiz yetiladi; bir marta buzilmay o'ynaldi. «2-daraja» qismisiz ochilmaydi | «Kalitsiz eshik ochilmadi» |
| | 4 «Qadam tovushi» | «Qahramon yurganda tovush chalinsin — turganda jim.» (9-dars 11 · ★) | biror `if` ichida, `move` bilan birga `play sound qadam` — 1 blok · «1 ta blok» | 9 (11 · ★), 7 | `play sound` — `if` ichida, o'yinda kamida bir marta chalindi | «Yurganda ♪, turganda jim» |
| | 5 «Startga qaytish» | «Bitta tugma qahramonni startga qaytarsin.» (9-dars 15 · ★) | `when space key pressed` → `go to x: 0 y: 0` — 2 blok · «2 ta blok» | 9 (15 · ★) | bo'sh tugma dasturchasida `go to x: 0 y: 0`; o'yin bir marta buzilmay o'ynaldi | «Tugma bosildi — qahramon startda» |
| | ★ «Uzun daraja» | «Yo‘l kamida 20 qadam bo‘lsin.» (10-dars 11 · ★) | labirint yasash · «20 qadam» | 10 (11 · ★) | o'lchov qatorida yo'l kamida 20 qadam, o'zi o'ynadi; «2-daraja» qismisiz ochilmaydi | — (umumiy «O‘yin yutildi») |

- Har qism tayyor bo'lganda o'yin baribir o'ynaladi — qismlar bir-biriga bog'liq emas. **Istisno:** ★ «Oltin olma» — «Ball» qismisiz ochilmaydi; labirintda «Kalit va eshik» va ★ «Uzun daraja» — «2-daraja» qismisiz ochilmaydi (ular 2-darajaga qo'yiladi). Shuning uchun vaqt qaerda tugasa ham, qo'lda ishlaydigan o'yin qoladi (darsning fikri: «avval o‘yin ishlasin — keyin qo‘shamiz»).
- **Tanlanmagan qism muammocha chiqarmaydi** (**KOD** 6 talabi): masalan «Jon» tanlanmagan bo'lsa ham kaktus maydonda turadi — qahramon unga tegsa, faqat turtiladi va «tuk» (12-dars), Bo'shvoy chiqmaydi.
- **Javon** — hamma o'tilgan bloklar, oila bo'yicha (Hodisa, Harakat, Shart, O'zgaruvchi, Ko'rinish, Tovush, Takrorlash; `random` — O'zgaruvchi oilasida, 13-dars); oila tugmalari bilan (**KOD** 7). Labirintda — «Labirint» oila tugmasi (10-dars asboblari; yasash qismlarida ochiladi).
- **Bloklar soni:** chegara — «Olma terish» 30, «Labirint» 30 («N / 30 ta blok»). `when ▶ clicked` bloki bitta, umumiy: ikki qismda bo'lsa — bittaga kam. Eng uzun namuna «Olma terish»da — 1 + «Jon» + «Qadam»: 8 + 6 + 6 − 1 = 19; ★ bilan (1 + «Ball» + «Jon» + ★) — 8 + 4 + 6 − 1 + 2 = 19. Labirintda — 1 + «Qadam tovushi» + «Startga qaytish»: 12 + 1 + 2 = 15 (9-darsdagidek). Dastur ustuniga sig'adimi — **tekshirish kerak** (setka; KOD 7).
- **Tayyor dastur yo'q** — dastur bo'sh boshlanadi (xakaton: o'yinni juftlik o'zi yasaydi).
- «Bitta qadam» (14-dars KOD 1) — o'yin rejimida yo'q (14-dars 3-bekatdagidek); usul — hamma holatni sinash.
- Tovush: jonli darsda bola noutbuki jim (86-qaror) — «Quvonch» va «Qadam tovushi» qismida qahramon ustida ♪ va tovush nomi belgisi (7-dars) ko'rinadi, tekshiruv belgi bo'yicha.

**Rollar va almashish** (**KOD** 5; «Savollar» 1, 3): o'yin noutbukining sahnasi yonida «O‘yiningizda:» ro'yxati — tanlangan qismlar; hozirgi qism yonida rul belgisi va «Haydovchi», xarita belgisi va «Xaritachi». Qism tayyor bo'lsa — «Qism tayyor!» va konfeti, ~1,4 soniyadan keyin (100-qaror kabi; dvigatelda `otKeyin` — har qismda yangidan, ekran bitta bo'lgani uchun) rul va xarita joy almashadi, ishora «Almashing: sichqoncha — do‘stingizga» va asosiy tugma «Almashdik»; bosilgach — keyingi qism ochiladi. Har qismda kim haydagani yoziladi (mentorga; 1-haydovchi — noutbuk egasi, 2-haydovchi — do'sti). Uchtalik juftlikda — rul uchinchi bolaga ham navbat bilan o'tadi (ishora «Almashing: sichqoncha — navbatdagi do‘stingizga»).

**Qism kartasi** — studiyada doim ochiq turadi (bosib ochilmaydi): sarlavha — qism nomi, ostida kartadagi gap (jadval, xaritachi ovoz chiqarib o'qiydi), yonida hajm belgisi va «Maslahat» (qulf bilan — bir urinishdan keyin, 6-dars KOD 1; urinish — o'yin rejimidagi o'yin ham; qulf har qismda yangidan). «Maslahat» — dars raqami va savol, blok nomisiz; ostida kerakli bloklar oilasining rangi (javondagi oila tugmasi rangi). Maslahat yo'nalish beradi, tayyor dastur emas:
- «To‘rt strelka» — «4-dars. Qaysi strelkaning dasturchasi hali yo‘q?»
- «Ball» — «11-dars. Olma terilganda qaysi hodisa ishlaydi? Ball qayerda noldan boshlanadi?»
- «Jon» — «12-dars. Kaktusga tegilganda qaysi hodisa ishlaydi? O‘yin qachon tugashi kerak?»
- «Qadam» — «12-dars. Har bosishda qaysi hodisa ishlaydi? Qadam nechtadan boshlansa, yulduzgacha yetadi?»
- «Quvonch» — «7-dars. Olma terilganda qaysi hodisa ishlaydi? Qahramon qanday ko‘rinsin?»
- ★ «Oltin olma» — «11-dars. Oltin olma terilganda ball nechtaga ko‘paysin?»
- «Strelka va qoida» — «9-dars. Strelka yurishdan oldin nimani tekshirsin?»
- «2-daraja» — «10-dars. Devorlar yulduzga yo‘lni to‘smayaptimi?»
- «Kalit va eshik» — «10-dars. Yulduzga qaysi katakdan kiriladi? Kalitga eshikdan o‘tmay yetsa bo‘ladimi?»
- «Qadam tovushi» — «9-dars. Qahramon qachon yuradi? Tovush qachon chalinsin?»
- «Startga qaytish» — «9-dars. Qaysi tugma hali bo‘sh? U bosilganda qahramon qayerga borsin?» (9-dars maslahati)
- ★ «Uzun daraja» — «10-dars. Kalit va yulduz bir-biridan uzoqroq bo‘lsa — yo‘l uzayadi.» (10-dars maslahati)

## Yordam va xato

1–14-darsdagidek: xatoda muammocha — bitta gap, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga 'noto'g'ri', 'xato qildingiz' deyilmaydi; «xato» — dasturdagi topiladigan narsa (98-qaror). Har qismning muammochalari — o'sha darsdagi jadvaldagidek, o'zgarishsiz: to'rt strelka — 4-dars (Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…», Kamvoy «Tugma bosildi, lekin men nima qilay?»); qoida, qadam tovushi, startga qaytish — 9-dars (To'siqvoy «Devor!», Kamvoy «Men yurmadim-ku!», «Bu start emas!»); 2-daraja, kalit va eshik — 10-dars (Kamvoy — yo'l yo'q, «Kalit qani?»; Ortiqvoy — eshik keraksiz); ball — 11-dars; jon va qadam — 12-dars; kostyum va tovush — 7-dars. «Maslahat» bosilsa — ustozda «Yordam so‘radi: N ta noutbuk» (o'zgarmaydi).
Ishora qatorining boshida: 1-bekat — «Avval o‘yinni tanlang»; 2-bekat — «Xaritachi kartani o‘qisin»; 3-bekat — «Hamma holatni sinang».

Bu darsdagi farqlar:

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| — | qism tayyor — almashish (muammocha emas, ishora) | — | «Almashing: sichqoncha — do‘stingizga» |
| Kamvoy | 3-bekat: sinash bandi bajarilmadi (masalan, jon 0 dan o'tdi — o'yin tugamadi) | «Oz qoldi!» | «Ro‘yxatda: Jon — o‘yin jon 0 bo‘lganda tugashi kerak» (qism nomi va sharti bilan, **KOD** 9) |
| — | «Qadam»: `set qadam` soni eng qisqa yo'ldan kam | — | «Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi» (**KOD** 4) |
| Ortiqvoy | dastur to'ldi | «Joy qolmadi!» | «Dasturga N ta blok sig‘adi» (N — 30) |
| Bo'shvoy | dastur bo'sh, «▶ Boshlash» bosildi | «Men nimani kutaman?» | «Avval 1-qismni yasang: «To‘rt strelka»» (labirintda — «Avval 1-qismni yasang: «Strelka va qoida»») |
| Kamvoy | 3-bekat: tugamagan qism o'yinni buzyapti (masalan, `when touching cactus` ostida bo'sh `if`) | «Oz qoldi!» | «Tugamagan qism: N. Tugating yoki olib tashlang — o‘yin ishlasin» (N — qism nomi; **KOD** 9) |
| — | 15-qadam: do'stlar o'ynayotganda — o'yindagi muammochalar odatdagidek (do'st ko'radi); «Maslahat» yo'q | — | — |

2-bekatda qism tayyor bo'lmasa (bloklar yetishmaydi yoki o'yin buzildi) — qismning o'z muammochalari (o'sha darsdagidek); qism nomi bilan alohida muammocha yo'q. Ikki sabab birga bo'lsa — avval to'xtash (chet, devor), keyin birinchi ko'ringani. Muammocha qahramonni yopmaydi (91-qaror).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «15-dars · Xakaton №1», sarlavha «Bugun juftlikda o‘yin yasaymiz!». Coddy: «Salom! Bugun do‘stingiz bilan birga o‘yin yasaysiz.» O'ngda maydon, Coddy (0, 0) da. Pastda kichik karta «O‘tgan darsda»: «Bitta qadam» tugmasi rasmi — «Xato — Topiladigan narsa». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda xatolarni topib tuzatdik.»
  2. «Bugun yangi blok yo‘q. Do‘stingiz bilan bitta o‘yin yasaysiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 1–14-darsda nimalar o'tilganini bir gapda eslatadi (strelkalar, labirint, ball, jon, tasodifiy olma); bugun ustoz o'yin yasab bermaydi — juftliklar o'zi yasaydi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «15-dars · Xakaton №1», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: bitta o'yinni qanday yasaymiz?

- **Vaqt:** 0:01:30–0:03 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror), «qanday qilamiz?» (12-bo'lim 25-band). Har karta — ikki do'stning birga ishlash usuli: A — birga bosish, B — alohida-alohida, C — ishni bo'lib, navbat bilan. Uchalasi ham yangi boshlovchi o'ylaydigan fikr (12-bo'lim 8-band). Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Bitta o‘yinni qanday yasaymiz?». Maydonda Coddy, uchta olma; yon tomonda ikki noutbuk rasmi. Coddy: «Ikki do‘st, o‘yin esa bitta.» Chapda uchta karta: A «Ikkalamiz birga bosamiz» (bitta sichqonchaga ikki qo'l rasmi) · B «Alohida-alohida yasaymiz» (ikki noutbuk rasmi) · C «Ishni bo‘lamiz, navbat bilan» (rul va xarita rasmi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Bugun har o‘yinni ikki do‘st yasaydi. Qanday qilib?»
  2. «Har kim noutbukida bitta kartani tanlasin.»
- **O'z so'zi bilan:** kartalarni o'qiydi; sinf javoblarini o'qiydi (faqat son). Qaysi usul yaxshi ekanini aytmaydi — buni sinov ko'rsatadi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Ikki do‘st bitta o‘yinni qanday yasaydi?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03–0:05 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz usullarni sinayapti — kuzating»)
- **Sahna:** kartalar o'z dasturi bilan o'zi o'ynaladi (14-dars 'Qurishdagi qarorlar' 5 kabi; **KOD** 12). Odam qiyofasi yo'q — ikki kursor (coral va oltin) va ikki noutbuk rasmi.
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kattalashadi: ikki kursor bir vaqtda javonga boradi — ikkalasi ham o'sha dasturchani yasaydi: dasturga ikkita `when → key pressed` va ikkita `move right` tushadi, ↑ uchun hech narsa yo'q. «▶ Boshlash»: → bosilsa Coddy ikki katak sakraydi (ikki dasturcha), ↑ bosilsa — Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…». Kartada: «✕ ikkalamiz bir ishni qildik».
  2. «Keyingi» — B: ikki noutbuk rasmi, ikkita alohida o'yin. Chapdagisida strelkalar bor, ball yo'q — Coddy yuradi, «ball» ko'rinmaydi; o'ngdagisida ball dasturchasi bor, strelka yo'q — Coddy qimirlamaydi. Kartada: «✕ ikki yarim o‘yin».
  3. «Keyingi» — C: bitta noutbuk; ro'yxat «O‘yiningizda:» — 1 «To‘rt strelka» (rul belgisi) ✓ → rul va xarita joy almashadi → 2 «Ball» ✓. «▶ Boshlash»: Coddy uch olmani teradi, «ball: 3», yulduz ochiladi, «Siz yutdingiz!». Kartada: «✓ bitta to‘liq o‘yin».
- **Tayanch gaplar:**
  1. «Birga bossak — bir ishni ikki marta qilamiz. Alohida-alohida yasasak — ikki yarim o‘yin.»
  2. «Ishni bo‘ldik: biri yasaydi, biri yordam beradi. Keyin almashadi.»
- **O'z so'zi bilan:** C da rollar almashgan lahzani ko'rsatadi — birinchi qismni bittasi yasadi, ikkinchisini ikkinchisi; o'yin har qismdan keyin ishlab turibdi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta) — sinovlarni dvigatel o'zi o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: ishni bo'lamiz, navbat bilan

- **Vaqt:** 0:05–0:06 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Ishni bo‘lamiz, navbat bilan». A va B xira, C oltin; maydonda tayyor o'yin (uch olma terilgan, Coddy yulduzda); ro'yxatda ikki qism ✓, har birining yonida rul — biri coral, biri oltin. Coddy: «Har qismni bittangiz yasaysiz. Keyin almashasiz.»
- **Tayanch gaplar:**
  1. «Ishni bo‘lamiz, navbat bilan. Avval o‘yin ishlasin — keyin qo‘shamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: xakaton

- **Vaqt:** 0:06–0:07 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z (uch bo'lak birma-bir, `raqam` ishi) · bola «Ustoz ekraniga qarang» («Yangi so‘z: xakaton»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Xakaton nima?». Coddy: «Xakaton — birga, oz vaqtda bitta narsa yasash.» Uch bo'lak xira.
  2. «Keyingi» — 1-bo'lak: rul va xarita, ostida «Juftlik».
  3. «Keyingi» — 2-bo'lak: ro'yxat, uch band birin-ketin ✓.
  4. «Keyingi» — 3-bo'lak: tayyor o'yin o'zi o'ynaladi, bayroqcha «Tayyor!». Ostida ta'rif: «Xakaton — Birga, oz vaqtda bitta narsa yasash» va yozuv «Bugun — juftlikda o‘yin».
- **Tayanch gaplar:**
  1. «Xakaton — birga, oz vaqtda bitta narsa yasash.»
  2. «Dasturchilar ham shunday qiladi: bir necha kishi bitta narsani birga yasaydi.»
- **O'z so'zi bilan:** kursda yana xakatonlar bo'lishini aytadi; bugun har juftlik o'z o'yinini yasaydi — do'stlar o'ynab ko'radi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (uch marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:07–0:08 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Tanlaymiz → 2 · Yasaymiz → 3 · Sinaymiz; cho'qqida kichik karta «Dars oxirida · do‘stlar o‘ynaydi» (kichik maydon, olmalar va yulduz). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Oxirida o‘yiningizni do‘stlar o‘ynaydi.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: tanlaymiz, yasaymiz, sinaymiz.»
  2. «Dars oxirida o‘yiningizni boshqa juftlik o‘ynaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Bugungi qoida: rul va xarita

- **Vaqt:** 0:08–0:09:30 (1,5 daqiqa)
- **Bekat:** 1 · Tanlaymiz
- **Ekran:** proyektor — qoida (uch qator) · bola «Ustoz ekraniga qarang» («Ustoz bugungi qoidani aytyapti»)
- **Sahna:** 6- va 14-darsdagi «Qoida» kabi: uch qator, har birida rasm va gap; «Keyingi» har bosishda bitta qatorni yoqadi (`raqam` ishi).
- **Qadamlar:**
  1. Proyektorda: yorliq «Qoida», sarlavha «Rul va xarita». Coddy: «Biri rulda, biri xaritaga qaraydi.» Uch qator xira.
  2. «Keyingi» — 1-qator: rul rasmi — «Haydovchi — Bloklarni qo‘yadi».
  3. «Keyingi» — 2-qator: xarita rasmi — «Xaritachi — Kartani o‘qiydi, kuzatadi».
  4. «Keyingi» — 3-qator: aylanma strelka rasmi — «Qism tayyor — o‘ynaymiz, keyin almashamiz».
- **Tayanch gaplar:**
  1. «Haydovchi — sichqoncha qo‘lida. Xaritachi — kartani o‘qiydi, nima kerakligini aytadi.»
  2. «Qism tayyor bo‘lsa — almashasiz. Ikkalangiz ham haydaysiz.»
  3. «Xaritachi sichqonchaga tegmaydi — gapirib yordam beradi.»
- **O'z so'zi bilan:** metaforani ochiq aytadi («bu — mashina emas, rul va xarita rollarni eslab qolish uchun»); do'stga gapirish qoidasi — qo'pol so'z yo'q, «“buni qo‘y” o‘rniga “shuni qo‘yib ko‘raylik”»; qolib ketsa — avval «Maslahat», keyin qo'l ko'tarish.
- **Ustoz qiladi:** «Keyingi»ni bosadi (uch marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Juftligingizni toping

- **Vaqt:** 0:09:30–0:10:30 (1 daqiqa)
- **Bekat:** 1 · Tanlaymiz
- **Ekran:** proyektor — sinf doskasi (juftliklar soni) · bola — juftlik tanlovi (**KOD** 1)
- **Sahna:** juftliklarni ustoz darsdan oldin tuzib qo'ygan («Savollar» 8; ism proyektorga chiqmaydi — ustoz og'zaki aytadi). Juftlik bitta noutbuk oldida o'tiradi («Savollar» 1).
- **Qadamlar:**
  1. Proyektorda: yorliq «Juftlik», sarlavha «Juftligingizni toping». Coddy: «Bitta noutbuk, ikki do‘st.» Chapda katta son «Juftlik bo‘ldi 0 / 7», o'ngda bitta noutbuk va ikki stul rasmi. Panelda: «Keyingi».
  2. Bola noutbukida ikki katta karta: «O‘yin shu noutbukda» (noutbuk va rul rasmi) · «O‘yin do‘stimning noutbukida» (strelka rasmi). Juftlik birini o'yin noutbuki qiladi. Ikkinchi noutbukda — do'stining qahramoni tanlanadi (o'yin noutbuklaridagi qahramonlar rasmi, ism yo'q; ishora «Do‘stingizning qahramonini bosing»; **KOD** 2), keyin «Juftlikdasiz» ekrani (qahramon, rul va xarita; «Siz do‘stingizning noutbukida ishlaysiz. Dars oxirida natija shu yerda ham chiqadi.»). Doskadagi son o'sadi.
- **Tayanch gaplar:**
  1. «Juftligingiz bilan bitta noutbuk oldiga o‘tiring.»
  2. «Bitta noutbukda «O‘yin shu noutbukda»ni bosing, ikkinchisida — «O‘yin do‘stimning noutbukida».»
- **O'z so'zi bilan:** juftlarni aytadi (toq bo'lsa — bitta uchtalik); qaysi noutbuk o'yin noutbuki bo'lishini juftlik o'zi kelishadi.
- **Ustoz qiladi:** juftlarni aytadi, son 7 / 7 bo'lgach «Keyingi»ni bosadi.
- **Ustoz satri:** Juftlik bo‘ldi: 7 / 7
- **Parta:** ikki karta → o'yin noutbukida «Ustoz ekraniga qarang», ikkinchisida do'stining qahramoni → «Juftlikdasiz».
- **Bola qiladi:** do'sti yoniga o'tiradi, kartani tanlaydi.
- **Tekshiruv:** har noutbukda tanlov bor; o'yin noutbuklari soni = juftliklar soni (avto, **KOD** 1).

## 9 · Tanlaymiz: o'yin va qismlar

- **Vaqt:** 0:10:30–0:15:30 (5 daqiqa) — **juftlik ishi boshlandi**
- **Bekat:** 1 · Tanlaymiz
- **Ekran:** proyektor — sinf doskasi · bola (o'yin noutbuki) — o'yin tanlash → qismlar → «Ustoz ekraniga qarang»; ikkinchi noutbuk — «Juftlikdasiz»
- **Qadamlar:**
  1. Proyektorda: yorliq «Xakaton», sarlavha «O‘yinni tanlang!». Coddy: «Avval kelishib oling: qaysi o‘yin, qaysi qismlar.» Chapda katta son «Tanladi 3 / 7»; o'ngda ikki karta — «Olma terish» va «Labirint», har birining ostida nechta juftlik tanlagani (faqat son). Panelda: «Yordam so‘radi: 0 ta noutbuk».
  2. O'yin noutbukida: ikki katta karta, har birida kichik maydon rasmi (o'zi o'ynamaydi; «Savollar» 14) — «Olma terish» (bog', olmalar, kaktuslar, yulduz) · «Labirint» (D1). Tanlash — bosishning o'zi (12-bo'lim 22-band).
  3. Keyin ro'yxat: 1-qism belgilangan va qulf bilan («To‘rt strelka» yoki «Strelka va qoida» — «Bu qismsiz o‘yin yurmaydi»); qolgan to'rtta qism — kartalar (nomi, kartadagi gap, hajm belgisi — «4 ta blok» kabi): bosilsa — tanlanadi va kartasi ochiladi; yana bosilsa — tanlov olinadi. Juftlik ikkitasini tanlaydi. Labirintda «Kalit va eshik» kartasi «2-daraja» tanlanmaguncha xira, ostida «2-daraja bilan». ★ — alohida, xira («Vaqt qolsa»). Asosiy tugma «Tanladik» (ikki qism tanlangach yonadi).
  4. «Tanladik» bosilsa — «Birinchi haydovchi sichqonchani olsin.», asosiy tugma «Tayyormiz». Keyin «Ustoz ekraniga qarang» («Ustoz yasashni ochadi»).
- **Tayanch gaplar:**
  1. «Ikkalangiz kelishib oling: qaysi o‘yin, qaysi ikki qism.»
  2. «Birinchi qism hammada bir xil — usiz o‘yin yurmaydi.»
- **O'z so'zi bilan:** juftliklarni aylanadi; kelisha olmagan juftlikka — «har kim bittadan qism tanlasin»; qiyin qismdan qo'rqqanga — «hammasi o‘tgan darslarda bor edi»; labirint tanlaganlarga — «Labirintda birinchi qism uzunroq — ikkinchi qismni osonidan tanlang.».
- **Ustoz satri:** Yordam so‘radi: 0 ta noutbuk
- **Parta:** yorliq «Xakaton · Tanlaymiz»; o'yin kartalari → qismlar ro'yxati (qism bosilsa — tanlanadi va kartasi ochiladi; yana bosilsa — tanlov olinadi) → «Tanladik» → «Tayyormiz».
- **Bola qiladi:** do'sti bilan kelishib, o'yinni va ikki qismni tanlaydi; birinchi haydovchi sichqonchani oladi.
- **Tekshiruv:** o'yin va ikki qism tanlandi (avto).

## 10 · 2-bekat

- **Vaqt:** 0:15:30–0:16 (0,5 daqiqa)
- **Bekat:** 2 · Yasaymiz
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: yasaymiz»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Tanlaymiz ✓, oltin yoy; Coddy 2-bekatda; 2 · Yasaymiz miltillaydi. Coddy: «Endi navbat bilan yasaysiz.»
- **Tayanch gaplar:**
  1. «Avval o‘yin ishlasin: birinchi qism — strelkalar. Tayyor bo‘lsa — o‘ynab ko‘ring va almashing.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 11 · Yasaymiz: navbat bilan

- **Vaqt:** 0:16–0:47 (31 daqiqa)
- **Bekat:** 2 · Yasaymiz
- **Ekran:** proyektor — sinf doskasi · bola (o'yin noutbuki) — Blok studiya: 1-qism → almashish → 2-qism → almashish → 3-qism → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Xakaton», sarlavha «Navbat bilan yasaymiz!». Coddy: «Qism tayyor bo‘lsa — o‘ynab ko‘ring va almashing.» Chapda katta son «Uch qism tayyor 2 / 7», ostida «Har belgi — o‘yini tayyor bitta juftlik»; o'ngda zinapoya (72-qaror): 1 «1-qism» · 2 «2-qism» · 3 «3-qism» · ★ «Qo‘shimcha» — har kartada rul belgisi va hozir shu qismda nechta juftlik (faqat son; qism nomlari yo'q — juftliklar har xil tanlagan). Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Ustoz o'rtada (taxminan 30-daqiqada) bir marta, og'zaki: «Yarmidan o‘tdik. 1-qism tayyor bo‘lmasa — hozir faqat shuni tugating. Tayyor bo‘lsa — keyingisi.» (ekranda vaqt yo'q — 63-qaror; «Savollar» 4).
  3. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.» — qism tugamagan bo'lsa ham dastur saqlanadi.
- **Tayanch gaplar:**
  1. «Haydovchi bloklarni qo‘yadi, xaritachi kartani o‘qiydi.»
  2. «Har qismdan keyin o‘ynab ko‘ring. O‘yin ishlasa — almashing.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** juftliklarni aylanadi; xaritachidan so'raydi: «Kartada nima deyilgan? Do‘stingiz shuni qilyaptimi?»; uzoq almashmagan juftlikka — «qism tayyormi? Unda rul do‘stingizga»; bitta bola hammasini qilayotgan bo'lsa — rolni eslatadi; yechimni aytmaydi, qaysi darsda o'tilganini eslatadi («ball — 11-darsda, olma terish o‘yinida»).
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda hamma oila (oila tugmalari); sahna — tanlangan o'yin; yonida ro'yxat «O‘yiningizda:» (qismlar, hozirgisi yonida rul va «Haydovchi», xarita va «Xaritachi»); «N / 30 ta blok»; asosiy tugma «▶ Boshlash» (labirintda 2-daraja yasashda — «▶ Sinab ko‘rish», 10-dars); qism kartasi doim ochiq. Ishora boshida: «Xaritachi kartani o‘qisin».
  Qism yorlig'i «Xakaton · 1-qism», sarlavha — qism nomi («To‘rt strelka»), ostida kartadagi gap («Har strelka qahramonni o‘z tomoniga yurgizsin»), yonida hajm belgisi va «Maslahat» (qulf bilan). Qism tayyor bo'lsa: «Qism tayyor!» va konfeti; rul va xarita joy almashadi; ishora «Almashing: sichqoncha — do‘stingizga»; asosiy tugma «Almashdik» → keyingi qism ochiladi. Uch qism tayyor bo'lsa: «O‘yiningiz tayyor!» va ★ ochiladi («Vaqt qolsa — qo‘shimcha qism»; «Olma terish»da — «Ball» qismi bo'lsa, labirintda — «2-daraja» qismi bo'lsa; bo'lmasa ★ yo'q).
- **Bola qiladi:** haydovchi — bloklarni qo'yadi, o'ynab ko'radi; xaritachi — kartani o'qiydi, nima kerakligini aytadi, o'yinni kuzatadi; qism tayyor bo'lgach almashadi.
- **Tekshiruv:** har qism — «qism tayyor»: bloklari qo'yildi va o'yin bir marta buzilmay o'ynaldi (jadval, avto, **KOD** 4); har qismda kim haydagani yoziladi (**KOD** 5); bloklar chegaradan oshmaydi.
- **Xatoda:** qismning o'z muammochalari (o'sha darsdagidek — Yordam va xato bo'limi); dastur bo'sh — Bo'shvoy «Men nimani kutaman?» («Avval 1-qismni yasang: «To‘rt strelka»»); joy qolmadi — Ortiqvoy «Joy qolmadi!».

## 12 · 3-bekat

- **Vaqt:** 0:47–0:47:30 (0,5 daqiqa)
- **Bekat:** 3 · Sinaymiz
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: sinaymiz»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Sinaymiz miltillaydi. Coddy: «Endi o‘yinni do‘stlar o‘ynashidan oldin sinaymiz.»
- **Tayanch gaplar:**
  1. «Yangi qism boshlamaymiz. Endi bor o‘yinni sinaymiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · Ko'ramiz: hamma holatni sinaymiz

- **Vaqt:** 0:47:30–0:48:30 (1 daqiqa)
- **Bekat:** 3 · Sinaymiz
- **Ekran:** proyektor — Blok studiya (ustoz, «Olma terish», Coddy; dastur tayyor: to'rt strelka va jon qismi, jon qismida xato — `change jon by -1` o'rniga `change jon by -2`) · bola «Ustoz ekraniga qarang» («Ustoz o‘yinni sinayapti — kuzating»)
- **Sahna:** 14-dars 3-bekat usulining eslatmasi — bir holatda ishlagan o'yin boshqasida buziladi. Bolalarning o'yinidan boshqa (ustoz o'yinida «Ball» qismi yo'q). «Jon» qismi tayyor (bloklar qo'yilgan, o'yin buzilmay o'ynalgan) — xatoni sinash bandi topadi (jadval: «Qism tayyor» va «sinash bandi» farqi).
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Hammasini sinaymiz». O'ngda ro'yxat: «To‘rt strelka» ✓ · «Jon» ✓ (yasaldi), ostida «Sinash»: ikki bo'sh band.
  2. «▶ Boshlash»: ustoz olmalarni teradi, kaktusga tegmaydi — «Siz yutdingiz!». Sinash bandi «Har strelka o‘z tomoniga» ✓.
  3. Yana «▶ Boshlash»: ustoz ataylab kaktusga tegadi — ikki tegishda jon: −1, o‘yin tugamadi. Kamvoy «Jon tugadi-ku!» (12-darsdagidek), ro‘yxatda «Jon» bandi bo‘sh qoladi. Ustoz −2 ni −1 ga o‘zgartiradi, uch marta tegadi — jon 0 da «O‘yin tugadi». Sinash bandi «Jon 0 da tugaydi» ✓.
- **Tayanch gaplar:**
  1. «Yutdik — lekin bu hali hammasi emas. Kaktusga ataylab tegib ko‘ramiz.»
  2. «Xato — topiladigan narsa. Tuzatdik — yana sinaymiz.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** 14-darsdagi «Hamma holatni sinang!» ni eslatadi; xaritachi ro'yxatni ovoz chiqarib o'qiydi, haydovchi sinaydi; keyin almashadi.
- **Ustoz qiladi:** ikki marta o'ynaydi, sonni o'zgartiradi, yana o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 14 · Sinaymiz: ro'yxat

- **Vaqt:** 0:48:30–0:58:30 (10 daqiqa)
- **Bekat:** 3 · Sinaymiz
- **Ekran:** proyektor — sinf doskasi · bola (o'yin noutbuki) — Blok studiya, sinash ro'yxati bilan
- **Qadamlar:**
  1. Proyektorda: yorliq «Xakaton», sarlavha «Sinang va tuzating!». Coddy: «Ro‘yxatdagi har bandni sinang.» Chapda katta son «Ro‘yxati to‘liq 2 / 7», ostida «Har belgi — o‘yini sinalgan bitta juftlik». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Xaritachi ro‘yxatni o‘qiydi, haydovchi sinaydi. Bitta band — bitta haydovchi, keyin almashing.»
  2. «Tugamagan qism o‘yinni buzmasin: tugating yoki olib tashlang.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Kaktusga ataylab tegib ko‘rdingizmi? Har strelkani bosdingizmi? Ikki marta o‘ynadingizmi — ball noldan boshlandimi?»; 1–2 qismli juftlikni maqtaydi — «o‘yiningiz ishlaydi, bu — asosiysi».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya (dastur o'zgartirsa bo'ladi); ro'yxat «O‘yiningizda:» — har tayyor qism ostida sinash bandi (jadvalning oxirgi ustuni; **KOD** 9; dvigatel o'zi o'lchaydi, ✓ o'zi qo'yiladi):
  - «To‘rt strelka» — «Har strelka o‘z tomoniga» · «Strelka va qoida» — «Devor tomonga bosildi — urilmadi»;
  - «Ball» — «Ikki marta o‘ynadik — ball noldan boshlandi»;
  - «Jon» — «Jon 0 da tugaydi» · «Qadam» — «Qadam 0 da tugaydi»;
  - «Quvonch» — «Olma terilganda — xursand va ♪» · «Qadam tovushi» — «Yurganda ♪, turganda jim»;
  - «2-daraja», «Kalit va eshik» — «Ikki daraja yutildi» · «Kalitsiz eshik ochilmadi»;
  - «Startga qaytish» — «Tugma bosildi — qahramon startda»;
  - hammasi uchun — «O‘yin yutildi».
  Tugamagan qism ro'yxatda xira, yonida «tugamagan». Hammasi ✓ bo'lsa: «O‘yiningiz sinaldi!» va konfeti; ishora «Endi do‘stlar o‘ynashini kuting».
- **Bola qiladi:** xaritachi bandni o'qiydi, haydovchi o'sha holatni o'ynab ko'radi; buzilsa — 14-dars usulida topadi va tuzatadi; har bandda almashadi.
- **Tekshiruv:** sinash ro'yxati (avto); tugamagan qism o'yinni buzmaydi (avto).
- **Xatoda:** qismlarning muammochalari; sinash bandi bajarilmadi — Kamvoy «Oz qoldi!» («Ro‘yxatda: Jon — o‘yin jon 0 bo‘lganda tugashi kerak»); tugamagan qism — Kamvoy «Oz qoldi!» («Tugamagan qism: N. Tugating yoki olib tashlang — o‘yin ishlasin»).

## 15 · Do'stlar o'ynaydi

- **Vaqt:** 0:58:30–1:10:30 (12 daqiqa) — **juftlik ishi tugadi (60 daqiqa)**
- **Bekat:** 3 · Sinaymiz
- **Ekran:** proyektor — sinf doskasi (do'stlar o'ynaydi) · bola (o'yin noutbuki) — «▶ Do‘stingiz o‘ynaydi» (o'yin rejimi) → «Sizga yoqdi:» → o'z natijasi; ikkinchi noutbuk — «Juftlikdasiz»
- **Sahna:** 10-dars 16-qadam mexanikasi (**KOD** 10): o'yin noutbuki joyida qoladi, juftliklar keyingi stolga o'tadi — har juftlik keyingi stoldagi o'yinni o'ynaydi (soat mili bo'yicha aylana; vaqt bo'lsa — yana bittasini). O'yin rejimida dastur va ro'yxat yopiq — do'stlar o'yinga tegmaydi. O'ynagach — «Sizga yoqdi:» (to'rt rasmli karta, kamida bittasi; «Savollar» 5, 18). Proyektorda ism ham, juftlik bahosi ham yo'q — faqat son (12-bo'lim 2-band). Bu — darsning baholashi: «ishlaydi» (sinash ro'yxati, 14-qadam), «xatosiz» (o'yin muammochasiz tugadi — devorga urilish va `game over` odatiy holat, buzilish emas; avto), «qiziq» (do'stlar belgisi).
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Do‘stlar o‘ynaydi». Coddy: «Do‘stlaringiz yasagan o‘yinni siz yuta olasizmi?» Chapda katta son «O‘ynab ko‘rildi 0 / 7», ostida «Har belgi — do‘stlar o‘ynagan bitta o‘yin»; o'ngda stollar aylanasi va strelka (keyingi stolga o'tish). Panelda: «Keyingi».
  2. O'yin noutbukida juftlik «▶ Do‘stingiz o‘ynaydi» tugmasini bosadi (10-darsdagidek) — faqat sahna va «▶ Boshlash» (labirintda «Daraja: 1 / 2»). Juftliklar keyingi stolga o'tadi va o'ynaydi.
  3. O'ynab bo'lgach (yutsa, «O‘yin tugadi» chiqsa yoki «■ To‘xtatish») — sarlavha «Sizga yoqdi:», to'rt karta — «Qiziq» (porlagan yulduz rasmi) · «Chiroyli» (gul rasmi) · «Quvnoq» (qahramonning xursand kostyumi rasmi) · «Yana o‘ynayman» (▶ belgisi va aylanma strelka rasmi); kamida bittasini bosadi, asosiy tugma «Tayyor». «Hech narsa» tanlovi yo'q.
  4. Ustoz «Joyingizga qayting» deydi. O'yin noutbukida egasi ko'radi: «Do‘stlaringiz o‘ynadi: yutdi · 2 marta kaktusga tegdi · Yoqdi: Qiziq, Chiroyli» (yutmagan bo'lsa — «yulduzgacha yetmadi»; bir necha marta o'ynalgan bo'lsa — «Do‘stlaringiz N marta o‘ynadi:», «N marta yutdi», «N marta kaktusga tegdi» (sonlar jamlanadi); 'yutqazdi' deyilmaydi; haqiqiy son va belgilar). Labirintda — do'stlarning yo'li ham, oltin iz (10-dars; faqat labirintda). Ro'yxatda «Do‘stlar o‘ynadi» ✓.
- **Tayanch gaplar:**
  1. «Keyingi stolga o‘tamiz. O‘yinni o‘ynang — dasturiga tegmang.»
  2. «O‘ynab bo‘lgach — sizga nima yoqdi, belgilang.»
  3. «Joyingizga qayting: do‘stlar qanday o‘ynaganini ko‘ring.»
- **O'z so'zi bilan:** aylanma yo'nalishni qo'l bilan ko'rsatadi; o'ynayotganlarga — «Yuta olmasangiz ham — zo‘r: do‘stlaringiz o‘yinning qiyin joyini ko‘radi.»; do'stlar qayerda qiynalgan bo'lsa — o'yinning eng qiyin joyi o'sha (10-dars gapi); qaytgan juftlikka — «do‘stlaringiz qaysi joyda to‘xtadi?».
- **Ustoz qiladi:** aylanmani boshlaydi, son 7 / 7 bo'lgach «Joyingizga qayting» deydi, «Keyingi»ni bosadi.
- **Ustoz satri:** O‘ynab ko‘rildi: 7 / 7
- **Parta:** «▶ Do‘stingiz o‘ynaydi» o'yin rejimi → «Sizga yoqdi:» (do'stlar) → o'z natijasi: do'stlarning natijasi, belgilari (labirintda — yo'li ham).
- **Bola qiladi:** do'stlarning o'yinini o'ynaydi va belgilaydi; qaytib, o'z o'yinida do'stlar natijasini ko'radi.
- **Tekshiruv:** «Do‘stlar o‘ynadi» — kamida bitta juftlik o'yinni o'ynadi va belgiladi (avto).

## 16 · O'yiningiz haqida ayting

- **Vaqt:** 1:10:30–1:15:30 (5 daqiqa)
- **Bekat:** 3 · Sinaymiz
- **Ekran:** proyektor — ko'rsatish (ikki o'yin kartasi va uch savol) · bola — o'z natijasi (15-qadam oxiri)
- **Sahna:** KONSEPSIYA 4-bo'lim 5-band (oxirida ko'rsatish) va 12-bo'lim 3-band: bola ishi proyektorga o'zi chiqmaydi. Juftlik o'z joyida turib, og'zaki aytadi («Savollar» 11 — A); proyektorda — faqat yordamchi savollar va tanlangan o'yin turi kartasi (ism yo'q).
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «O‘yiningiz haqida ayting». Coddy: «Juftlik o‘z o‘yini haqida aytadi.» Uch qator: «O‘yinda nima bor» · «Kim qaysi qismni yasadi» · «Eng qiyin joyi». O'ngda ikki karta — «Olma terish», «Labirint»; ustoz aytayotgan juftlik o'yini turini bosadi — karta yonadi.
  2. Ikki-uch juftlik (har biri ~1,5 daqiqa): ikkalasi ham gapiradi — biri birinchi qatorga, ikkinchisi — ikkinchisiga.
- **Tayanch gaplar:**
  1. «Qaysi juftlik o‘yini haqida aytadi? Ikkalangiz ham gapiring.»
  2. «Har juftlik o‘z qismlarini tanladi — shuning uchun o‘yinlar har xil.»
- **O'z so'zi bilan:** har juftlikni maqtaydi — nimasi uchun (ishni bo'lgani, almashgani, xatoni topgani); «eng yaxshi» demaydi, o'yinlarni solishtirmaydi.
- **Ustoz qiladi:** juftlikni tanlaydi (ko'ngillilar birinchi), o'yin turi kartasini bosadi.
- **Parta:** o'z natijasi (15-qadamdagi).
- **Bola qiladi:** o'yini haqida aytadi yoki do'stlarini tinglaydi.
- **Tekshiruv:** yo'q (mentor bahosi — LMS'da, «LMS» bo'limi).

## 17 · Yakun

- **Vaqt:** 1:15:30–1:18:30 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz o‘yin yasadingiz!». Bugungi so'z: «Xakaton — Birga, oz vaqtda bitta narsa yasash». Ostida to'rt kichik belgi: «Ishni bo‘lamiz · Navbat bilan · Avval o‘yin ishlasin · Keyin qo‘shamiz». Pastda: ✓ Tanlaymiz · ✓ Yasaymiz · ✓ Sinaymiz. Kichik karta «Keyingi dars · 16 · Klonlar».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: tanladik, navbat bilan yasadik, sinadik.»
  2. «Ishni bo‘ldik, navbat bilan. Avval o‘yin ishladi — keyin qo‘shdik.»
  3. «Keyingi darsda bitta qahramondan ko‘p nusxa yasaymiz.»
- **O'z so'zi bilan:** «xakaton» nimaligini bolalardan aytdiradi; «vaqt oz bo‘lsa nima qilamiz?» — «avval ishlaydigan o‘yin»; uyda o'yinini o'zi davom ettirishi mumkinligini aytadi (solo).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz o‘yin yasadingiz!». Coddy o'rniga qahramon: «Do‘stim bilan birga yasadik!» «Ikkalangiz bugun:» — «ta qism yasadingiz» · «ikkalangiz ham haydadingiz ✓» · «marta o‘ynab ko‘rildi» (son kartaning boshida, haqiqiy son; «ikkalangiz ham haydadingiz ✓» — faqat ikkalasi ham kamida bitta qism haydagan bo'lsa; **KOD** 13; «Qurishdagi qarorlar» 31); ro'yxat «O‘yiningizda:»; o'z qahramoni o'yin maydonida; «O‘yiningiz saqlandi.» (faqat haqiqatan saqlansa — 12-bo'lim 28-band; **KOD** 14); «Keyingi darsda klonlar bilan ko‘rishamiz!». Ikkinchi noutbukda — o'sha natija (ustoz orqali uzatiladi, **KOD** 2; yetib kelmasa — «Bugun juftlikda o‘yin yasadingiz!» va qahramon).
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran) — ikkala noutbukda.

## 18 · Sinfimiz bugun

- **Vaqt:** 1:18:30–1:20 (1,5 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta o‘yin yasaldi · N ta qism · Do‘stlar N marta o‘ynadi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda klonlar bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Bugun 7 ta o‘yin yasaldi — har biri boshqacha.» (haqiqiy son bilan)
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–14-darsdagidek (88-qaror; KONSEPSIYA 2-bo'lim: darsga kelmagan bola «Uy»da darsni to'liq o'tadi). Farqi («Savollar» 7):
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 5-, 7-qadam: «Keyingi»ni bola o'zi bosadi.
- 7-qadam ostida solo ishorasi: «Bugun siz bir o‘zingiz: haydovchi ham, xaritachi ham — siz. Avval kartani o‘qing, keyin yasang.»
- 8-qadam (juftlik) solo'da yo'q. 9-, 11-, 14-qadam — o'sha ekranlar, rol belgilari va almashish yo'q (qism tayyor — keyingisi o'zi ochiladi, 100-qaror).
- 13-qadam: ustoz o'yini tayyor turadi; bola o'zi ikki marta o'ynaydi, kaktusga tegadi, −2 ni −1 ga o'zgartiradi (ishora «Kaktusga ataylab tegib ko‘ring — jon 0 da tugaydimi?»).
- 15-qadam: «Kimgadir o‘ynating» — uydagilardan biri o'ynasa bo'ladi (10-dars solo; tugma «▶ Do‘stingiz o‘ynaydi» o'sha, «Sizga yoqdi:» ham); «Keyingi ›» bilan o'tkazsa ham bo'ladi (ro'yxatdagi band bo'sh qoladi).
- Solo'da yo'q qadamlar: 8, 16 (sinfsiz bo'lmaydi), 18. Sinf doskalari (9, 11, 14, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadam bilan tugaydi.
- Jonli darsdagi juftlik o'yini (o'yin noutbukida saqlangan) solo'da shu noutbukda ochiladi — bola uni uyda davom ettirsa bo'ladi; boshqa noutbukda — yangi o'yin (**KOD** 14).

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-015-xakaton-1-v1`, kalit `jr015` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi (ikkala noutbukda ham — ikkinchi bola o'z noutbukida dars qadamlarini «Juftlikdasiz» ekrani bilan o'tadi).
- Yutuqlar («Savollar» 6, 16): «Xakatonchi» (`xakatonchi`) — o'yin ishlaydi (1-qism tayyor) va do'stlar o'ynadi; «Ikki haydovchi» (`ikki_haydovchi`) — juftlikda ikkalasi ham kamida bitta qism yasadi. Ikkalasi ham juftlikdagi har bolaga (ikkinchi bolaga — ustoz orqali, **KOD** 2).
- **Mentor uchun** (**KOD** 13): har juftlik — o'yin turi; qismlar (tayyor / tugamagan) va har qismni kim haydadi; sinash ro'yxati; «Maslahat» necha marta ochildi; do'stlar o'ynadi: yutdi yoki yulduzgacha yetmadi, necha marta to'xtadi, «Yoqdi» belgilari. Faqat LMS natijasida, proyektorga chiqmaydi (12-bo'lim 2-band). Mentor bahosi — shu jadval bo'yicha (DASTUR: «Jamoalar baholashi + mentor»); ustoz izohi — LMS'da, darsdan keyin (**KOD**, tekshirish kerak: LMS'da izoh maydoni bormi).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- **Bu — xakaton: yangi blok yo'q, siz o'yin yasab bermaysiz.** Ko'rsatuv bitta — 13-qadam (sinash). Qolgan vaqt juftliklar ishlaydi, siz aylanasiz.
- **Juftliklarni oldindan tuzing** («Savollar» 8): yoningizdagi do'st asosida, lekin 1–14-dars natijasiga qarab — kuchi juda farq qiladigan ikki bolani birga qo'ymang (biri hammasini qilib qo'yadi). Toq bo'lsa — bitta uchtalik. Ism proyektorga chiqmaydi — juftlarni og'zaki ayting.
- Bugungi asosiy fikr: **ishni bo'lamiz, navbat bilan; avval o'yin ishlasin — keyin qo'shamiz.** Hukda, javobda, 10-qadamda va yakunda chiqadi.
- Vaqt ekranda yo'q (63-qaror) — bekatni siz «Keyingi» bilan almashtirasiz. Mo'ljal: 47-daqiqada «Yasaymiz» tugaydi (qism tugamagan bo'lsa ham), 58:30 da sinash ro'yxati tugaydi. 11-qadam o'rtasida bir marta og'zaki: «Yarmidan o‘tdik. 1-qism tayyor bo‘lmasa — hozir faqat shuni tugating. Tayyor bo‘lsa — keyingisi.»
- Vaqtda zaxira yo'q (reja 80 daqiqa). Kechikib qolsangiz: 16-qadamda bitta juftlik; ★ qismni hech kimga eslatmang. 15-qadamni qisqartirmang — bu darsning baholashi.
- **Aylanganda — rolga qarang, dasturga emas:** «Kim haydovchi? Xaritachi, kartada nima deyilgan?». Bitta bola hammasini qilayotgan bo'lsa — almashishni eslating. Xaritachi sichqonchaga tegmaydi.
- Labirint tanlagan juftlikka: birinchi qism (12 blok) uzunroq — ikkinchi qismni osonidan tanlasin.
- Yechimni aytmang — qaysi darsda o'tilganini ayting: to'rt strelka — 4-dars; qoida, qadam tovushi, startga qaytish — 9-dars; 2-daraja, kalit va eshik, uzun daraja — 10-dars; ball, oltin olma — 11-dars; jon, qadam — 12-dars; kostyum va tovush — 7-dars.
- «Sizga yoqdi:» da yomon belgi yo'q — har o'yin kamida bitta «yoqdi» oladi. «Eng yaxshi o‘yin», «kim yutdi» demang; o'yinlarni solishtirmang.
- **Mentor ro'yxati** (aylanganda yodda tuting, darsdan keyin LMS'da): ikkalasi ham haydadimi · 3-bekat boshida o'yin ishlardimi (1-qism) · sinash ro'yxati to'liqmi · do'stlar o'ynaganda o'yin buzilmadimi.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

Bu darsda yangilari: juftlik (1, 2), o'yin va qism tanlash (3), qism tekshiruvi (4), rollar (5), birlashgan o'yin (6), katta javon (7), qism kartasi (8), sinash ro'yxati (9), do'stlar bahosi (10), doskalar (11), huk (12), natija (13); qolgani — tekshirish.

1. **Juftlik tanlovi** (8-qadam): bola ekranida ikki karta «O‘yin shu noutbukda» · «O‘yin do‘stimning noutbukida»; ikkinchisida — do'stining qahramonini tanlash (KOD 2), keyin «Juftlikdasiz» ekrani — dars qadamlari bo'yicha yuradi (bekat xaritalari, yakun), studiya yo'q. Ustoz panelida «Juftlik bo‘ldi: N / M» (M = noutbuklar / 2, pastga yaxlitlanadi: 13 bola — 5 juft + 1 uchtalik = 6). Bola → ustoz xabari (`qobiq.js` `bildir`) — yangi tur.
2. **Natija ikkinchi bolaga — ustoz orqali** («Savollar» 14): server o'zgarmaydi. Ism yo'q — ikkinchi noutbuk juftlik qahramoni bilan bog'lanadi (8-qadamda do'stining qahramonini bosadi: o'yin noutbuklaridagi qahramonlar rasmi). O'yin noutbuki natijasi va yutuqlari (qismlar, kim haydadi, do'stlar o'ynadi) ustoz ekraniga keladi, ustoz ekrani uni o'sha qahramonga bog'langan noutbukka uzatadi (sinf aloqasi, bola → ustoz → bola). Yetib kelmasa — mentor LMS'da ikkinchi bolaga qo'lda belgilaydi.
3. **O'yin va qism tanlash ekrani** (9-qadam): ikki o'yin kartasi — kichik maydon rasmi (o'zi o'ynamaydi; «Savollar» 14), tanlash — bosish; qismlar ro'yxati (1-qism qotgan, «Bu qismsiz o‘yin yurmaydi»; to'rttasidan 2 tasi tanlanadi; bosilsa — tanlanadi va kartasi ochiladi, yana bosilsa — tanlov olinadi; har kartada hajm belgisi; «Kalit va eshik» — «2-daraja» tanlanmaguncha xira; ★ alohida), «Tanladik» faqat ikkita tanlanganda yonadi; tanlov saqlanadi.
4. **Qism tekshiruvi** (`bosh.qismlar: [...]`, har biriga shart): **qism tayyor** (2-bekat) — qismning bloklari qo'yildi (statik: jadvaldagi bloklar o'z hodisasida) va o'yin bir marta buzilmay o'ynaldi (o'yin muammochasiz tugadi — devorga urilish va `game over` odatiy holat, buzilish emas). Labirint yasash qismlari — 10-dars o'lchovlari (`kerak: { devor: 6 }`, `{ eshik: true }`, `{ yol: 20 }`) va `sinab: true`. Chuqur shartlar — KOD 9 (sinash bandlari). «Qadam» — `set qadam` soni eng qisqa yo'ldan kam bo'lsa, ishora «Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi». «Qism tayyor!» — qism nomi bilan. Bog'liqlik: ★ «Oltin olma» — «Ball» bo'lsa; «Kalit va eshik», ★ «Uzun daraja» — «2-daraja» bo'lsa.
5. **Rollar va almashish**: ro'yxatda rul/xarita belgilari («Haydovchi», «Xaritachi»); qism tayyor → ~1,4 s (`otKeyin` — har qismda yangidan: ekran bitta, `__otadi` bayrog'i har qismda tozalanadi) → belgilar joy almashadi, ishora, asosiy tugma «Almashdik» → keyingi qism; har qismga «kim haydadi» (1- yoki 2-haydovchi; uchtalikda 3) yoziladi. Ekranda vaqt yo'q.
6. **Birlashgan o'yin «Olma terish»** (**tekshirish kerak**) — yangi o'yin: 4-dars strelka dasturchalari (boshqaruv tayyor emas — bola yasaydi) + 11–12-dars o'zgaruvchilari (`ball`, `jon`, `qadam`), kaktus, `game over`; ★ tanlansa — oltin olma; «Quvonch» uchun 7-dars kostyum va tovushi. **Tanlanmagan qism muammocha chiqarmaydi** (masalan, «Jon» yo'q — kaktusga tegish faqat turtadi, «tuk»; Bo'shvoy yo'q). Labirint — 9–10-dars o'yini o'zgarishsiz (darajalar, yasash). Qismlar istalgan tartibda va birikmada.
7. **Javon — hamma o'tilgan bloklar** (oila tugmalari bilan; `DARS.javon`), blok chegarasi 30 — dastur ustuniga sig'ishi va ko'p dasturcha (setka, ikki brauzerda) **tekshirish kerak**.
8. **Qism kartasi + «Maslahat»** — studiyada doim ochiq (sarlavha, gap, hajm belgisi, «Maslahat»); bosib ochish faqat 9-qadamda. Qulfli «Maslahat» (6-dars KOD 1 — tayyor; o'yin rejimidagi o'yin ham urinish — dvigatelda tuzatildi, 21.11; qulf har qismda yangidan): dars raqami va savol (blok nomisiz) va kerakli bloklar oilasining rangi.
9. **Sinash ro'yxati** (3-bekat): har tayyor qism ostida sinash bandi — dvigatel o'lchaydi (har strelka bosildi va o'z tomoniga; devor tomonga bosildi — urilmadi; ikki o'yin, ball noldan; jon/qadam aynan 0 da; kostyum va «♪»; yurganda «♪», turganda jim; ikki daraja; kalitsiz eshik yopiq; tugma — qahramon startda; o'yin yutildi); bajarilmasa — Kamvoy «Oz qoldi!», «Ro‘yxatda: <qism> — <shart>»; tugamagan qism — xira, «tugamagan»; tugamagan qism o'yinni buzsa — Kamvoy ishorasi.
10. **«Do‘stlar o‘ynaydi»** — 10-dars KOD 6 (`ish: 'sahnaOyin', dost`, tugma «▶ Do‘stingiz o‘ynaydi») asosida juftlik uchun: o'yin rejimi, dastur va ro'yxat yopiq; o'yin yutilsa, «O‘yin tugadi» chiqsa yoki «■ To‘xtatish» bosilsa — «Sizga yoqdi:» to'rt rasmli karta («Qiziq · Chiroyli · Quvnoq · Yana o‘ynayman», kamida bittasi, «Tayyor»); avto: yutdi / yulduzgacha yetmadi, to'xtashlar (kaktus, devor, «O‘yin tugadi»); labirintda — do'stlarning yo'li (oltin iz); egasiga natija. Bir noutbukda bir necha juftlik o'ynasa — hammasi yig'iladi («Do‘stlaringiz 2 marta o‘ynadi: 1 marta yutdi · …»). Sinf doskasida «O‘ynab ko‘rildi: N / M».
11. **Doskalar**: 8 — «Juftlik bo‘ldi»; 9 — «Tanladi» + ikki o'yin kartasi va son; 11 — zinapoya 1-qism · 2-qism · 3-qism · ★ (72-qaror), katta son «Uch qism tayyor»; 14 — «Ro‘yxati to‘liq»; 15 — «O‘ynab ko‘rildi». Hammasi juftlik bo'yicha (bola emas).
12. **Huk** (2–4-qadam): uch karta o'z dasturi bilan o'zi o'ynaladi — A: ikki kursor bir dasturchani ikki marta yasaydi, Bo'shvoy; B: ikki yarim o'yin yonma-yon; C: ro'yxat, almashish, «Siz yutdingiz!».
13. **Natija va yutuqlar** — `DARS.natija`: «Ikkalangiz bugun:», «ta qism yasadingiz», «ikkalangiz ham haydadingiz ✓», «do‘stlar N marta o‘ynadi»; sinf — «ta o‘yin yasaldi», «ta qism», «Do‘stlar N marta o‘ynadi»; yutuqlar `xakatonchi` (1-qism tayyor va do'stlar o'ynadi), `ikki_haydovchi` (ikkalasi ham kamida bitta qism yasadi); mentor jadvali (LMS bo'limi).
14. **Saqlash**: juftlik o'yini (o'yin turi, dastur, 2-daraja) o'yin noutbukida — solo'da davom ettirish va 21–22-dars («Shaxsiy o'yin») uchun (10-dars KOD 9 kabi); «O‘yiningiz saqlandi» faqat saqlanganda.
15. **Sinov skripti** `sinov/dvigatel/xakaton.mjs` — har o'yin turining har qismi namunaviy yechimi bilan (jadval), birikmalar (1 + istalgan 2; bog'liq qismlar; hammasi + ★), qism tayyor va sinash bandlari, tanlanmagan qism muammochasizligi, «Do‘stlar o‘ynaydi»da dastur o'zgarmasligi; bezak kataklari.
16. *Kerak emas* — 16-qadam og'zaki («Savollar» 11 — A); juftlik o'yinini proyektorga chiqarish qurilmaydi.

## Savollar (tavsiya — A)

1. **Juftlik nechta noutbukda? — A: bitta o'yin noutbuki, navbat bilan (haydovchi va xaritachi); ikkinchi noutbukda «Juftlikdasiz» ekrani** (dars qadamlari bilan yuradi, LMS ulanishi qoladi). Sabab: dasturdagi natija — **bitta** o'yin va «ishni bo'lishish»; dvigatelda har pog'ona — bitta dastur, ikki noutbukdagi dasturni bitta o'yinga qo'shish yo'li yo'q; bitta ekranda ikkalasi bir narsaga qaraydi («Ustoz, sizda boshqa-ku» — 3-bo'lim); 9 va 13 yoshli birga ishlay oladi. **+** KOD kichik (1, 5); **−** xaritachi zerikishi mumkin — shuning uchun uning aniq ishi bor (karta, sinash ro'yxati) va har qismda almashish. **B** — ikki noutbuk, har kim o'z qismini (biri boshqaruv, biri ball): **+** har kimning qo'lida sichqoncha; **−** dasturlarni birlashtirish — katta KOD (server, ikki dasturni bitta o'yinga, ziddiyatlar), huk C javobi o'zgaradi (B karta javob bo'lib qoladi). **C** — bitta noutbuk, ikkinchisi yopiq: **+** KOD eng kam; **−** ikkinchi bola LMS'da «darsni tugatmadi» bo'lib qoladi. **Qabul: A (21.11).**
2. **O'yin turi — A: ikki o'yin («Olma terish», «Labirint») + qismlar ro'yxati** (1-qism majburiy, 2 tasi tanlanadi, ★). Sabab: 60 daqiqada «nima yasaymiz» ga vaqt ketmaydi; har qism — tanish darsning natijasi, o'zi tekshiriladi (dasturdagi «jamoalar baholashi»ga asos: «ishlaydi» o'lchanadi); juftliklar har xil qism tanlab, har xil o'yin oladi (9-bo'lim: «hammada bir xil natija» olinmaydi). **B** — to'liq erkin (bo'sh maydon, hamma blok): **+** ijod ko'p; **−** 9 yoshli juftlik g'oyada adashadi, tekshiruv yo'q, «vaqtida tugatish» o'lchanmaydi. **C** — bitta o'yin hammaga («Olma terish»): **+** KOD eng kam; **−** tanlov yo'q, 9–10-dars labirint yasashi ishlatilmaydi. «Qochadigan yulduz» (4-dars huki) — tavsiya etilmaydi: u bolaning bloki emas edi (yulduz ro'yxat bo'yicha ko'chardi, `bosh.qoch`) — yasash uchun yangi blok kerak, xakatonda yangi blok yo'q (v1 da o'xshash ishni «Tasodifiy olma» qismi qilardi — 14-savol bo'yicha olib tashlandi). **Qabul: A (21.11).**
3. **Ishni bo'lishish qanday ko'rinadi — A: qism bo'yicha — har qism bitta haydovchi; qism tayyor bo'lsa ekranda almashish** (rul ↔ xarita, «Almashdik»). Sabab: almashish ishning tabiiy chegarasida (yarim dastur qolmaydi); vaqtsiz (63-qaror); kim qaysi qismni yasagani yoziladi (mentor, «Ikki haydovchi»). **B** — vaqt bo'yicha (har 8–10 daqiqada ustoz «almashing» deydi): **+** teng vaqt; **−** ish o'rtasida uziladi, ekranda vaqt kerak bo'ladi yoki ustoz har juftlikni kuzatadi. **C** — rollarsiz, o'zlari kelishadi: **−** kuchlirog'i hammasini qiladi. **Qabul: A (21.11).**
4. **Vaqt boshqaruvi — A: ekranda vaqt yo'q (63-qaror o'z kuchida); bekat chegarasini ustoz «Keyingi» bilan ochadi; mo'ljal faqat ustoz varag'ida; 11-qadam o'rtasida bitta og'zaki eslatma; «vaqtida tugatish» — tartib bilan o'rgatiladi** («avval o'yin ishlasin»: 1-qism majburiy, har qismdan keyin o'yin ishlaydi). Sabab: foydalanuvchi 15.11 da taymer, «Vaqt tugadi» va sahna soatini olib tashlagan (F-1115-09); 9 yoshli taymer ostida shoshib, almashishni unutadi. **−** dasturdagi «vaqtida tugatishni mashq qiladi» vaqtni ko'rmasdan mashq qilinadi — bahsli. **B** — xakaton istisnosi: sinf doskasida katta taymer (har bekat), «Vaqt tugadi»: **+** haqiqiy xakaton hissi, vaqt ko'rinadi; **−** 63-qarorni o'zgartiradi (foydalanuvchi qarori kerak), proyektordagi taymer bolalarni ishdan chalg'itadi. **C** — taymer emas, «yo'l» ko'rinishi: doskada bekat yo'lagi to'lib boradi (raqamsiz qum soati) — **+** yumshoq; **−** baribir ekranda vaqt (63-qarorga yaqin), yangi KOD. **Qabul: A (21.11).**
5. **Baholash — A: do'stlar o'ynaydi (10-dars mexanikasi, keyingi stolga o'tib) + to'rt rasmli karta, kamida bittasi; «ishlaydi» va «xatosiz» — avto** (sinash ro'yxati; do'stlar o'ynaganda o'yin buzilmadi). Proyektorda faqat son, juftlik bahosi yo'q; g'olib yo'q. Sabab: har o'yin kamida bitta «yoqdi» oladi — ranjitmaydi; past baho yo'q; «ball» va «yulduz» so'zlari o'yindagi ma'nosida qoladi (bir ma'no — bir so'z); 59-qaror: bu taxmin savoli emas, to'g'ri javobi yo'q — lekin «savol faqat hukda» (12-bo'lim 37-band) chegarasida, shuning uchun so'roq gapi emas, belgi. Kartalar nomi va sarlavha — 18-savol. **B** — yulduzcha 1–5 uch mezonga (ishlaydi, qiziq, xatosiz): **+** tanish shakl, mentor uchun son; **−** past baho ranjitadi, bolalar do'stiga yuqori, boshqaga past qo'yadi, «yulduz» ma'nosi aralashadi. **C** — og'zaki (ustoz 2–3 juftlikdan so'raydi): **+** KOD yo'q; **−** natija yozilmaydi, LMS'ga bormaydi, dasturdagi «jamoalar baholashi» yo'q. **Qabul: A (21.11).**
6. **Natija va yutuqlar — A: LMS'ga modul tugagach (93-qaror); yutuqlar «Xakatonchi» va «Ikki haydovchi», juftlikdagi har bolaga** (KOD 2; sharti — 16-savol). Sabab: «ishni bo'lishish» o'z yutug'iga ega bo'lsin; ikkinchi bola adolatsiz qolmasin. **B** — bitta yutuq, faqat o'yin noutbuki egasiga: **+** KOD 2 kerak emas; **−** ikkinchi bola yutuqsiz. **Qabul: A (21.11).**
7. **Solo — A: bor — bola o'zi haydovchi ham, xaritachi ham; 8, 16, 18-qadam yo'q; 15-qadam — «Kimgadir o‘ynating»** (88-qaror; KONSEPSIYA 2-bo'lim: kelmagan bola darsni uyda o'tadi; 10-dars solo). **B** — solo yo'q, «Bu dars faqat sinfda»: **+** xakatonning ma'nosi (juftlik) buzilmaydi; **−** kelmagan bola 16-darsga xakatonsiz keladi, 2-bo'lim qoidasi buziladi. **Qabul: A (21.11).**
8. **Juftliklar qanday tuziladi — A: ustoz darsdan oldin tuzadi — yoningizdagi do'st asosida, 1–14-dars natijasiga qarab (kuchi juda farq qiladiganlar birga emas); toq bo'lsa — bitta uchtalik.** Sabab: 10-dars 16-qadamdagi «yoningizdagi do'st» (joydan turish kam); bir yoshdagi/darajadagi juftlikda ikkalasi ham haydaydi; tanlanmay qolgan bola bo'lmaydi. **B** — tasodif (dvigatel taqsimlaydi): **+** adolatli ko'rinadi; **−** 14 bola joyidan turadi, kuchsiz + kuchli tushishi mumkin, KOD. **C** — bolalar o'zi tanlaydi: **−** kimdir yolg'iz qoladi (ranjitadi). **Qabul: A (21.11).**
9. **Xakaton qolipi — A: amaliyot qolipi (6, 14-dars) asosida — huk bor**, uch bekat bitta uzun juftlik ishiga aylanadi, ustoz ko'rsatuvi bitta (13-qadam); 7-ochiq savoldagi «boss darsi» namunasi hali ko'rilmagan. **B** — huksiz: dars kirishdan keyin darhol juftlik ishi (8 daqiqa yutiladi; **−** «nega navbat bilan» bolaga ko'rinmaydi, almashish qoidasi buyruqqa aylanadi). **Qabul: A (21.11).**
10. **«Xakaton» — A: yangi so'z, alohida ekranda (5-qadam)** — kursda yana 4 ta xakaton bor (34, 88, 105, 138-dars). **B** — faqat dars nomida, ta'rifsiz (1 daqiqa yutiladi). **Qabul: A (21.11).**
11. **Ko'rsatish (16-qadam) — A: juftlik og'zaki aytadi, proyektorda uch yordamchi qator va o'yin turi kartasi** (12-bo'lim 3-band; bolalar o'yinni 15-qadamda o'ynab bo'lgan). **B** — ustoz tanlagan juftlik o'yini proyektorga chiqadi (server, KONSEPSIYA 5-ochiq savol): **+** sinf ko'radi; **−** server kelishuvi, vaqt. **C** — 16-qadam yo'q (5 daqiqa zaxiraga): **−** KONSEPSIYA 4-bo'lim 5-band (oxirida ko'rsatish) yo'q. **Qabul: A (21.11)** — KOD 16 kerak emas.
12. **Vaqt rejasi — A: juftlik ishi 60 — 9–15-qadam, do'stlar o'ynashi bilan; 12-bo'lim 4-bandidan istisno;** zaxira hajmda (★ qism, 16-qadam 3 → 1 juftlik). v1 da reja 81 edi; v1.1 da 18-qadam 1,5 daqiqa — reja 80, vaqtda zaxira yo'q. Sabab: dasturdagi «60 daqiqa» va 80–90 daqiqalik dars birga sig'ishi uchun. **B** — 60 daqiqa faqat yasash va sinash (9–14), do'stlar o'ynashi alohida: reja ~90, zaxira yo'q — **−** dars uzayadi. **C** — juftlik ishi 50 daqiqa, reja 71 (4-band bajariladi): **−** dasturdagi «60 daqiqa» bajarilmaydi. **Qabul: A (21.11).**
13. **Manba v1 tasdig'i.** **Qabul: A (21.11)** — audit takliflari bilan v1.1 («Qurishdagi qarorlar»).
14. **Soddalashtirish to'plami — A — Qabul (21.11, foydalanuvchi): «Tasodifiy olma» qismi olib tashlanadi (keyingi xakatonga); labirintdagi «Qadam» qismi olib tashlanadi; ★ «Oltin olma» faqat ★ tanlansa maydonda chiqadi; o'yin tanlash ekrani — o'zi o'ynaydigan kartalar emas, kichik maydon rasmi; natija ikkinchi bolaga ustoz orqali** (server o'zgarmaydi; ism yo'q — juftlik qahramoni bilan bog'lanadi). Sabab: har o'yinda tanlanadigan qism to'rttadan (teng); KOD 6 dan 13-dars olma dasturi va labirintdagi o'zgaruvchi ketadi; `kichik.js` jonli nusxasi kerak emas; KOD 2 server kelishuvisiz. **B** — hammasi v1 dagidek (5 ta tanlanadigan qism, tasodifiy olma, labirintda qadam, jonli kartalar, server orqali bog'lash): **−** katta KOD (ikki dasturli olma, labirintda o'zgaruvchi, server).
15. **Rol nomi — A — Qabul (21.11, foydalanuvchi): «haydovchi · xaritachi».** Sabab: rasm (xarita) bilan bir so'z, 9 yoshliga oson. **B** — «haydovchi · yo‘lboshchi» (v1).
16. **Yutuqlar sharti — A — Qabul (21.11, foydalanuvchi): «Xakatonchi» — o'yin ishlaydi (1-qism tayyor) va do'stlar o'ynadi; «Ikki haydovchi» — ikkalasi ham kamida bitta qism yasadi.** Sabab: sekin juftlik ham yutuqsiz qolmaydi; darsning fikri — «avval o‘yin ishlasin». **B** — 3 qism kerak, sinash ro'yxati to'liq (v1 dagidek).
17. **5-dars ishorasi «Bir xil juftlik — N marta» — A — Qabul (21.11, foydalanuvchi): «Bir xil ikki blok — N marta» ga almashtiriladi** (5-dars va dvigatel — bosh seans qiladi; bu manbada faqat qayd). Sabab: bir ma'noga bitta so'z — 15-darsdan «juftlik» — ikki do'st. **B** — qoladi.
18. **«Nimasi yoqdi?» — A — Qabul (21.11, foydalanuvchi): sarlavha «Sizga yoqdi:», kartalar «Qiziq · Chiroyli · Quvnoq · Yana o‘ynayman».** Sabab: so'roq gapi emas (12-bo'lim 37-band), hamma karta — yaxshi belgi («Qiyin» ranjitishi mumkin edi). **B** — v1 dagi «Nimasi yoqdi?» va «Qiziq · Qiyin · Chiroyli · Kulgili».

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi «g'alaba» (1-qism) ~26–28-daqiqada — 12-bo'lim 1-band (10–12 daqiqa) bilan to'qnashadi: mustaqil ish 10:30 da boshlanadi, lekin tanlash 5 daqiqa, to'rt strelka 8 blok. Kelisha olmagan juftlik 9-qadamni cho'zadi. Vaqtda zaxira yo'q (reja 80).
2. 31 daqiqada uch qism — 9 yoshli juftlikka ko'pmi: to'rt strelka (8 blok, 4-darsda 12 daqiqa) + ball (4 blok) + jon (6 blok). Labirintda 1-qism 12 blok — og'irroq (ustoz «ikkinchi qismni osonidan tanlang» deydi); 2-daraja yasash uzoq (10-dars: bolalar uzoq bezaydi).
3. Birlashgan «Olma terish» (4, 7, 11, 12-dars imkoniyatlari birga, tanlanmagan qism muammochasiz; KOD 6) — dvigatelda sinalmagan; namunaviy yechimlar simulyatsiya qilinmagan (CPU band) — dars qurilishidan oldin `xakaton.mjs` bilan.
4. «Olma terish» maydoni (olmalar, kaktuslar, oltin olma joyi) yangi — 11–12-darsdagi joylar bilan takrorlanmasligi va bezakka tushmasligi tekshirilmagan; «Qadam» qismida `set qadam to 20` yetarlimi (olmalar + kaktus aylanib o'tish + yulduz).
5. Bitta noutbukda ikki bola — sichqonchani almashish sinfda ishlaydimi; xaritachi rostdan gapiradimi yoki qaraydimi (sinfda kuzatiladi).
6. «Juftlik» so'zi 5-darsda bloklar haqida ishlatilgan («Bir xil juftlik — N marta» — `studiya.js` ishorasi) — «Savollar» 17 (bosh seans).
7. «Haydovchi / xaritachi» — bolalarga tushunarli metaforami — «Savollar» 15.
8. «Sizga yoqdi:» kartalari rasmlari — «Quvnoq» (kulgan yuz emoji emas — 161-qaror; qahramonning xursand kostyumi) va «Yana o‘ynayman» (▶ va aylanma strelka) qurishda tanlanadi.
9. 15-qadamda 14 bola birdan keyingi stolga o'tadi — sinf tartibi; uchtalik juftlik aylanmada qanday yuradi.
10. Ikkinchi noutbuk 60 daqiqa «Juftlikdasiz» ekranida — bola u yerda boshqa narsa ochib o'tirmaydimi (sinf tartibi; doiradan tashqari).
11. Natijani ustoz orqali uzatish (KOD 2) — ustoz ekrani yopilsa yoki ikkinchi noutbuk qahramonni noto'g'ri tanlasa nima bo'ladi; bo'lmasa ikkinchi bolaning natijasi mentor qo'lida.
12. 16-dars manbasi yo'q — «Keyingi dars · 16 · Klonlar» va «bitta qahramondan ko‘p nusxa» DASTUR'dan.
13. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (v1.1, 21.11)

Dars hali qurilmagan — bu bandlar v1 → v1.1 audit filtri (matn auditi va dvigatel auditi takliflari, foydalanuvchi qabul qilgan) va «Savollar» 14–18 ning A tavsiyasi.

1. **Ustoz namoyishi (13-qadam)** — −2 bilan ikki tegishda jon: −1, o'yin tugamaydi (shart faqat tenglik — 12-dars `if jon = 0 then`); v1 dagi «ikki tegishda «O‘yin tugadi»» noto'g'ri edi. Solo ishorasi — «Kaktusga ataylab tegib ko‘ring — jon 0 da tugaydimi?» (yechimni aytmaydi).
2. **«Qism tayyor» va sinash bandi ajratildi** — 2-bekat: bloklar qo'yildi va o'yin bir marta buzilmay o'ynaldi; 3-bekat: hamma holatda to'g'ri. Jadvalda yangi ustun «Sinash bandi», KOD 4 / 9 shunga; Kamvoy «Ro‘yxatda: …» — endi 3-bekat qatori. Sabab: v1 da qism tayyor sharti chuqur edi, 13-qadamdagi «Jon ✓, lekin xato» bilan to'qnashardi.
3. **«Bu qism shart» → «Bu qismsiz o‘yin yurmaydi»**; jadvaldagi «(shart)» olib tashlandi (izohda '1-qism — majburiy'). Sabab: «shart» — 8-dars bloki so'zi.
4. **Maslahatlar** — dars raqami va savol, blok nomisiz (12 ta, «Qism kartasi» ostida); KOD 8 da «bloklar rasmi» → oila rangi. Sabab: maslahat yechimni aytmaydi.
5. **Kim sinaydi** — o'ynab sinaydigan haydovchi; xaritachi «Kartani o‘qiydi, kuzatadi» (7-qadam, Pasport, So'zlar).
6. **7-qadam sarlavhasi «Rul va xarita»** (18 belgiga sig'adi), Coddy «Biri rulda, biri xaritaga qaraydi.».
7. **Labirint bog'liqligi** — «Kalit va eshik», ★ «Uzun daraja» — «2-daraja» qismisiz ochilmaydi (istisno sifatida yozildi; 9-qadamda karta xira, «2-daraja bilan»).
8. **10-qadam tayanch gapi va Bo'shvoy ishorasi** — darsning fikri bilan («Avval o‘yin ishlasin…», «Avval 1-qismni yasang: «To‘rt strelka»» / «… «Strelka va qoida»»).
9. **«Xakaton» ta'rifi** — «birga, oz vaqtda bitta narsa yasash» (kursdagi boshqa xakatonlarga ham to'g'ri); bugungi holat alohida «Bugun — juftlikda o‘yin». 5-qadam sarlavhasi «Xakaton nima?», Coddy ta'rifni aytadi; «Bugun — kursdagi birinchi xakaton.» olib tashlandi.
10. **Huk** — Coddy (4-qadam) «Har qismni bittangiz yasaysiz…»; «biri ko‘rsatadi» → «biri yordam beradi»; A natijasi «✕ ikkalamiz bir ishni qildik» va tayanch gap «bir ishni ikki marta qilamiz» (v1 dagi «talashib qoldik» sinovda ko'rinmasdi); B «Alohida-alohida yasaymiz».
11. **«ikki kishi» → «do‘st»** (2-qadam Coddy, tayanch gap, Parta; So'zlar).
12. **«Nimasi yoqdi?» → «Sizga yoqdi:»** va to'rt yangi karta (18-savol); 15-qadam 2-tayanch gapi ham shunga moslandi («sizga nima yoqdi, belgilang»).
13. **Do'st o'yini natijasi** — «yutdi» / «yulduzgacha yetmadi», bir necha marta — «Do‘stlaringiz 2 marta o‘ynadi: 1 marta yutdi · …»; ustoz gapi «Yuta olmasangiz ham — zo‘r…».
14. **«g'olib yo'q» olib tashlandi** (5-qadam) — ijobiy shakl: har juftlik o'z o'yinini yasaydi, do'stlar o'ynab ko'radi.
15. **Stol o'tishda 'almash' yo'q** — «keyingi stolga o‘tamiz» (15-qadam, So'zlar, doska); 'almashish' — faqat rollar.
16. **Qism kartasi studiyada doim ochiq**; bosib ochish faqat 9-qadamda (tanlash / tanlovni olish).
17. **«Qadam» kartasi** — «Qadam yulduzgacha yetsin.» qo'shildi va ishora «Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi» («Yordam va xato», KOD 4).
18. **9–10-dars qismlari aynan o'sha manbalardan** — «Strelka va qoida» — «Har strelka yurishdan oldin tekshirsin»; «Tovush» → «Qadam tovushi» (9-dars 11 · ★ gapi); «Startga qaytish» — 9-dars 15 · ★ gapi, sinash bandi «Tugma bosildi — qahramon startda»; «Kalit va eshik» — 10-dars 11 · 1 gapi; ★ «Uzun daraja» — 10-dars 11 · ★ gapi; sinash bandi «Ikki daraja yutildi» (10-dars ro'yxat bandi; v1 da «Ikkala daraja»).
19. **«2-daraja» kartasi** — «2-daraja bo‘lsin: labirintni o‘zingiz yasang, kamida 6 ta devor».
20. **Yakundagi to'rt belgi** — darsning yagona fikri bilan aynan («Ishni bo‘lamiz · Navbat bilan · Avval o‘yin ishlasin · Keyin qo‘shamiz»).
21. **Natija** — «Ikkalangiz bugun: …» (juftlik natijasi; v1 dagi «haydovchi / yo‘lboshchi» bo'yicha qism sanog'i ketdi); KOD 13.
22. **Vaqt** — 18-qadam 1,5 daqiqa, reja 80, vaqtda zaxira yo'q; birinchi natija ~26–28-daqiqa (v1 dagi 20–22 tanlashni hisobga olmagan); M = noutbuklar / 2, pastga (v1 da «yuqoriga» — uchtalik bilan juftliklar soni ortib ketardi).
23. **Blok hisobi** — har qism `when ▶ clicked` bilan sanaladi (Ball 4, Jon 6, Qadam 6; v1 da Ball 4 u bilan, Jon/Qadam 5 usiz edi), umumiy `when ▶ clicked` — bittaga kam; eng uzuni 19 (Olma), 15 (Labirint).
24. **Vaqt eslatmasi va qoida** — 11-qadam eslatmasi aniq ish aytadi («1-qism tayyor bo‘lmasa — hozir faqat shuni tugating…»); qoida 3-qatori «Qism tayyor — o‘ynaymiz, keyin almashamiz»; labirint uchun ustoz gapi (9-qadam, «Darsdan oldin»); qism kartalarida hajm belgisi («N ta blok»; yasash qismlarida «6 ta devor», «2 ta asbob», «20 qadam»).
25. **Mayda matn** — «Birinchi haydovchi sichqonchani olsin.», «Tayyormiz», doska «O‘yinni tanlang!», 16-qadam qatorlari va Coddy, 8-qadam kartalari va «Juftlikdasiz» matni, «gapirib yordam beradi», «“buni qo‘y” o‘rniga “shuni qo‘yib ko‘raylik”», solo ishorasi, «Bitta band — bitta haydovchi…», «58:30 da sinash ro'yxati tugaydi», 16-qadam 2-tayanch gapi, «Do‘stlar N marta o‘ynadi», «… klonlar bilan!», tugma «▶ Do‘stingiz o‘ynaydi» va «O‘yin tugadi» holati, kirish sarlavhasi «Bugun juftlikda o‘yin yasaymiz!».
26. **«Yo‘lboshchi» → «xaritachi»** hamma joyda (15-savol; B variantida qoldi).
27. **Dvigatel auditi** — `bosh.olmaHisob` havolasi ketdi; «Olma terish» — yangi birlashgan o'yin (KOD 6), 13-dars «ikki dastur» da'vosi ketdi; tanlanmagan qism muammocha chiqarmaydi — KOD 6 talabi; 'xatosiz' ta'rifi (Pasport, 15-qadam, KOD 4); «Do‘stingiz o‘ynaydi» oltin izi — faqat labirintda; `otKeyin` — har qismda yangidan (KOD 5); Maslahat qulfi o'yinda ham ochiladi (dvigatelda tuzatildi, 21.11; KOD 8); natija ikkinchi bolaga — ustoz orqali (KOD 2, server o'zgarmaydi); KOD 16 — kerak emas.
28. **14-savol A kiritildi** — «Tasodifiy olma» va labirint «Qadam» jadvaldan, sinash ro'yxatidan, muammochalardan («Maydon tugadi!»), KOD 4 / 6 / 9 / 15 dan, «Darsdan oldin» va «Tekshirilmagan joylar» dan olib tashlandi; ★ «Oltin olma» faqat ★ tanlansa maydonda; o'yin tanlash kartalari — kichik maydon rasmi (KOD 3). Har o'yinda tanlanadigan qism — to'rttadan.
29. **16-savol A kiritildi** — yutuqlar sharti (LMS bo'limi, KOD 13); Pasportdagi «o'yin tayyor» — to'liq natija sifatida qoldi.
30. **Bosh seans (21.11):** 13-qadam sarlavhasi «Hammasini sinaymiz» (studiya ustuni, 18 belgigacha); 13-qadamda jon 0 dan o'tganda — 12-darsning o'z muammochasi Kamvoy «Jon tugadi-ku!» (muammochalar o'sha darsdagidek); 3-qadam tayanch gapi «Alohida-alohida yasasak — ikki yarim o‘yin.» (B karta nomi bilan bir so'z); «Jon» kartasi «Jon 0 — o‘yin tugaydi.» («Qadam» kartasi bilan bir zamon).
31. **Bosh seans, qurish (21.11 kech):** natija kartalarida son kartaning boshida turadi — «Do‘stlar N marta o‘ynadi» (sinf) va «do‘stlar N marta o‘ynadi» (bola) o'rniga **«N marta o‘ynab ko‘rildi»** (15-qadam doskasidagi «O‘ynab ko‘rildi» so'zi bilan bir xil). Bola kartalari: «N ta qism yasadingiz» · «ikkalangiz ham haydadingiz ✓» (faqat ikkalasi ham haydagan bo'lsa) · «N marta o‘ynab ko‘rildi».
32. **Huk kartalari** — rasm (A: sichqoncha va ikki kursor · B: ikki noutbuk · C: rul va xarita); kartadagi dastur maydonda o'zi o'ynaladi (A: → — ikki katak, ↑ — Bo'shvoy; B: ikki yarim o'yin ketma-ket — strelkalar ballsiz, keyin ball strelkasiz; C: to'liq o'yin, ro'yxat «1 To‘rt strelka ✓ · 2 Ball ✓»). Kursorlarning javonga borib blok yasashi chizilmaydi — natija bir xil, KOD kam.
33. **Ro'yxat «O‘yiningizda:»** — maydon ostida bir qator (studiyada sahna yonida joy yo'q): qismlar, hozirgisi yonida «Haydovchi» va «Xaritachi» belgilari; 3-bekatda tayyor qism ortidan sinash bandi, oxirida «O‘yin yutildi» va «Do‘stlar o‘ynadi».
34. **3-bekat va do'stlar ekranida «Maslahat» tugmasi yo'q** (manbada shu bekatlar uchun maslahat matni yo'q; 15-qadamda — «Maslahat yo'q»).
35. **Qism tayyor sharti — o'yin seansi:** «▶ Boshlash» dan to o'yin tugaguncha (yutdi, «O‘yin tugadi», devor yoki «■ To‘xtatish»), kamida bitta bosish va muammochasiz; devorga urilish va «O‘yin tugadi» buzilish emas.
36. **Solo natijasi:** bola bir o'zi — «Ikkalangiz bugun:» o'rniga «Siz bugun:», qahramon gapi «O‘yinni o‘zim yasadim!»; «ikkalangiz ham haydadingiz ✓» kartasi yo'q (bitta haydovchi).
37. **«Quvonch» qismi hozirgi bo'lsa va olma dasturchasi yo'q** — Bo'shvoy «Tegdim — nima qilay?» (12-darsdagi gap; 11-darsning «Olma terildi, ball-chi?» si ball haqida — bu qismga to'g'ri kelmaydi), ishora o'sha: «Olmaga tekkanda nima bo‘lsin? Buning uchun o‘z hodisa bloki bor».
