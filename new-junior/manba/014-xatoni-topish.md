# 14-dars. Amaliyot: xatoni topish va tuzatish

> **Holat: v1.1 — TASDIQLANDI (21.11, foydalanuvchi: 14·5–14·10 hammasi A; ko'rik sahifasi 8-versiya). Dars qurildi — «Qurishdagi qarorlar» 1–37.** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/014-xatoni-topish/`) shundan quriladi. Ochiq savol yo'q.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–13-dars bilan bir xil (`001-tanishuv.md`: 'Ekranlar ko'rinishi', 'Yordam va xato', 'Tovush', 'Solo' bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 14-dars («Xatoni topish va tuzatish», amaliyot — natija: xato ishlayotgan 5 ta dastur tuzatiladi; o'rganadi: dasturni qadam-baqadam tekshirib, xato joyini topadi; nega: bola xatodan qo'rqmasligi kerak; tekshiruv: xatoni topish, avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati va bu darsdagi yangilari — oxirida). Har xatoli dastur manba yozilganda dastur bilan simulyatsiya qilindi: nima bo'ladi, qayerda to'xtaydi, «Bitta qadam» bilan qahramon qaysi qadamda rasmdan chiqadi va **bitta o'zgartirish bilan qaysi tuzatishlar ishlaydi** (yo'nalish, son, o'chirish, qo'shish, joy almashtirish — hammasi sinab chiqildi; natija jadvalda). Dars qurilganda sinov — `sinov/dvigatel/xato.mjs` (**KOD**).
> **Bu — kursdagi ikkinchi amaliyot darsi**; qolip — 6-dars (`006-amaliyot.md`: huk → eslaymiz → reja → qoida → uch bekat [eslatma + to'rt pog'ona] → xulosa → o'qib berish → yakun). 6-darsdagi 15 · 3 «Xatoni toping» (`repeat 3` + `go to x: 5 y: 3`, joy almashtirish), 2-darsdagi «Xatoni topamiz» va 8-darsdagi 3-bekat dasturlari bu yerda takrorlanmaydi — xato turlari tanish, dasturlar va maydonlar yangi.
> 3–8-dars auditidan saboq (qo'llandi): sinf doskasidagi rasm va pog'ona nomi javobni ochmaydi — nom rasmniki yoki maydonniki, xato turi aytilmaydi; ikki pog'onaning tuzatilgan dasturi bir xil emas (jadval oxirida); maslahat yo'nalish beradi, javobni aytmaydi (A·2); 16-qadamda bola o'z oxirgi yechgan pog'onasini ko'radi (A·1); start, olma, yulduz, kulrang va savat kataklari bezakka tushmaydi (xato variantlarining izi bezak ustidan o'tishi mumkin — bezak to'siq emas).

## Pasport

- **Dars turi:** amaliyot (blokli). Yangi mavzu yo'q, yangi blok yo'q, yangi so'z yo'q. Yangi tugma bitta — «Bitta qadam» (**KOD**, «Savollar» 2).
- **Natija (dasturdan):** xato ishlayotgan 5 ta dastur tuzatiladi. **Bu manbada:** har bekatning 1–3-pog'onasi — bitta xatoli dastur: 9 ta dastur, ichida 9 xil xato (yo'nalish, takrorlash soni, `go to` soni, ortiqcha blok, yetishmaydigan blok, tartib, shart tomoni, hodisa tugmasi, random sonlari); ★ — qo'shimcha. Dastur natijasi — **kamida 5 tasi tuzatildi** (mentor jadvalida va «Tuzatuvchi» yutug'ida; «Savollar» 1).
- **Bola nimani mashq qiladi:** xatoni tasodifan o'zgartirib emas, **qadam-baqadam** topadi: avval ishga tushiradi (muammocha qayerda to'xtaganini ko'rsatadi), keyin «Bitta qadam» bilan har qadamdan keyin qahramon qayerda turganini rasm bilan solishtiradi — qahramon birinchi marta yo'ldan chiqqan joy xatoga eng yaqin joy; tuzatgach yana ishga tushiradi va **hamma holatni** sinaydi (ikkala labirint, har strelka, random'ning har soni). Darsdagi yagona fikr: **xato — topiladigan narsa: ishga tushiring, qadam-baqadam yuring, tuzating, yana sinang.**
- **Tekshiruv (dasturdan):** xatoni topish, avto — har pog'ona o'zi tekshiriladi (yulduz va olmalar · rasm tayyor · ikkala labirint · o'yin yutildi · savatlar); 3 · ★ — bola tuzgan dasturda aynan bitta xato bor (bitta o'zgartirish bilan ishlaydi; **KOD**). Mentorga — har pog'ona: bajardi · «Maslahat» · urinishlar · «Bitta qadam» ishlatdimi (**KOD**, LMS — modul tugagach, 93-qaror).
- **Vaqt:** reja 65 daqiqa, zaxira 15–25 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi pog'onalarga.
- **Uch bekat:** 1 · To'xtagan joy — 2 · Bitta qadam — 3 · Yashirin xato. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror); 3 · 3 da — olma dasturi (13-dars).
- **Oldingi darslar bilan bog'lanish:** 2-dars — «Xatoni topamiz» (tartib, joy almashtirish); 5-dars — `repeat`, kulrang rasm; 6-dars — «Maslahat» bir urinishdan keyin, tayyor dasturni tuzatish; 8-dars — ikki labirint va shart; 4-dars — o'yin va hodisa; 13-dars — random va savatlar. Bu dars ularning hammasini bitta usulga yig'adi. 13-dars yakunidagi va'da: «Keyingi darsda dasturlardagi xatolarni topib tuzatamiz.»

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–2 | Kiradi, maydonni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 2–6:30 | Savolga javob beradi: dastur tepalik o'rniga boshqa rasm chizdi — xatoni qanday topamiz? Sinf uchalasini sinaydi: oxirgi blokni tuzatsak — rasm yana boshqa, har xil o'zgartirsak — battar, qadam-baqadam yursak — 5-qadamda topildi | 2–4 |
| 6:30–8 | Muammochalarni eslaydi: har biri xato qayerdaligini ko'rsatadi | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10 | Bugungi qoidani ko'radi: «▶ Ishga tushir», «Bitta qadam», «Maslahat» bir urinishdan keyin | 7 |
| 10–21 | 1-bekat: ishga tushiradi, qayerda to'xtaganini ko'radi, tuzatadi | 8 |
| 21–23:30 | Ustoz «Bitta qadam»ni ko'rsatadi | 9–10 |
| 23:30–35 | 2-bekat: qadam-baqadam yurib, rasmdan chiqqan blokni topadi | 11 |
| 35–37 | Xulosa: xato qanday topiladi | 12 |
| 37–39:30 | Ustoz tasodifiy dasturni ko'p marta sinaydi | 13–14 |
| 39:30–54 | 3-bekat: ikki labirint, o'yin, savatlar — hamma holatni sinab, yashirin xatoni topadi; ★ da ustoz sinf oldida topadigan topishmoq tuzadi | 15 |
| 54–59 | Topishmog'ini sinfga o'qib beradi — ustoz uni qadam-baqadam topadi | 16 |
| 59–65 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10-daqiqada, birinchi natijasi (1-pog'ona: ishga tushirish, bitta tuzatish, yana ishga tushirish) — 11–12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida).

## So'zlar

Yangi so'z yo'q. Darsning fikri so'z emas, qoida: «Xato — topiladigan narsa» (4-, 12-, 17-qadam).

1–13-darsdan (ta'rifsiz, tanish): blok, dastur, qahramon, yulduz, olma, qadam, katak, maydon, labirint, devor, kulrang kataklar, rasm, takrorlash, shart, hodisa, tugma, dasturcha, tasodifiy son, savat, pog'ona, xato (dasturdagi — 98-qaror), tuzatish.
Bir ma'noga bitta so'z: «xato» (dasturdagi topiladigan narsa; «nuqson», «bug» deyilmaydi; bolaga 'xato qildingiz', 'noto'g'ri' deyilmaydi); «tuzatish» (xatoni; «to‘g‘rilash» deyilmaydi — 6-darsdagidek); «qadam-baqadam» (usul: har blokdan keyin qarash; «sekin», «birma-bir» deyilmaydi); «Bitta qadam» (tugma nomi; «qadam» — 1-darsdan bitta harakat: har bosishda qahramon bitta qadam yuradi — `move` yoki `go to`); «rasmdan chiqdi» (qahramon kulrang katakdan tashqariga yurdi — 5-darsdagi Ortiqvoy gapi); «sinash» (ishga tushirib ko'rish; «test qilish» deyilmaydi); «topishmoq» (3 · ★: ustoz sinf oldida topadigan bitta xatoli dastur).
Bu darsda AYTILMAYDI: «debugging», «otladka», «breakpoint» (dasturchilar so'zi — keyingi modullarda), xato turlarining nomlari bolaga (ular faqat ustoz varag'ida — «Savollar» 7), yangi blok.

## Maydon, labirint va bloklar

Har pog'ona o'z sahnasida (hammasi oldingi darslarda qurilgan — **tekshirish**, KOD 5):
- **Maydon** — 3–6-darsdagi bog' (7 × 5, X va Y, bezak: daraxtlar (1, 1) · (4, 3) · (6, 1), gullar (0, 4) · (2, 3) · (5, 4) · (6, 3) — devor emas). 1-bekat — yulduz va olmalar; 2-bekat — kulrang rasm (5-dars: o'tilgan katak oltin bo'ladi). Chetdan chiqish — turtilib to'xtaydi, «tuk», Kamvoy «Maydon tugadi!».
- **Ikki labirint** — 8-dars (3 · 1): dastur avval 1-labirintda, keyin 2-labirintda; har labirint yonida «✓» / «✕».
- **O'yin** — 4-dars (3 · 2): «▶ Boshlash», strelka dasturchalari, olmalar olingach yashirin yulduz ochiladi.
- **Savatlar** — 13-dars (3 · 3): olma dasturi, random'ning hamma soni sanab chiqiladi.

**Bloklar** — yangi blok yo'q. Javon — pog'onaniki (**KOD** 3 — yangi): 1–2-bekat va 3 · ★ — Harakat (to'rt `move`, `go to`) va Takrorlash (`repeat 2`); 3 · 1 — Shart, Takrorlash, Harakat (to'rt `move`); 3 · 2 — Hodisa, Harakat; 3 · 3 — `random`, `go to`.
**Tayyor dastur** har pog'onada bor (3 · ★ dan tashqari) — `prog: 'qoldir'` (6-dars 15 · 3 dagidek: bloklar Blockly'da, o'zgartirsa bo'ladi).
**Tuzatish yo'llari** (hammasi oldingi darslarda bor — **tekshirish**, KOD 9): son va tomonni bosib tanlash (`repeat`, `go to`, `if`, hodisa tugmasi, `random`); blokni tanlab «✕» bilan olib tashlash; ikki blokni bosib joyini almashtirish (95-qaror; bir `repeat` ichida — yangi, **KOD** 10); javondan blok qo'shish — dastur oxiriga, tanlangan `repeat` bo'lsa — uning ichiga (5-dars).
**Bloklar soni:** chegara ('N / M ta blok') — 1–2-bekat va 3-bekat pog'onalarida tayyor dastur yoki to'g'ri dasturning kattasi + 1: bola avval yangi blokni qo'shib, keyin eskisini «✕» bilan olib tashlay olsin (8 · 3 da `go to` dan keyin → qo'shish, 11 · 1 da ↓ qo'shish ham sig'adi). 8 · 1 — 5, 8 · 2 — 3, 8 · 3 — 4, 8 · ★ — 5; 11 · 1 — 6, 11 · 2 — 7, 11 · 3 — 7, 11 · ★ — 9; 15 · 1 — 6, 15 · 2 — 9, 15 · 3 — 3; 15 · ★ — 12 (o'zgarmaydi). Pog'ona tavsifidagi 'N ta blok' — tayyor dasturdagi bloklar soni, 'chegara M' — alohida.

**«Bitta qadam»** (**KOD** 1, «Savollar» 2): studiyada «▶ Ishga tushir» yonida ikkinchi tugma (asosiy emas — oq, coral hoshiya). Har bosishda qahramon **bitta qadam** yuradi (`move` yoki `go to`): o'sha blok yonadi va yonib qoladi. `repeat` sarlavhasi va `if` tekshiruvi alohida bosish emas — o'sha bosishda ko'rinadi: `repeat` yonida sanoq («2»), `if` yonida «✓ ha» / «✕ yo‘q»; `if` «✕ yo‘q» bo'lsa — o'sha bosish keyingi harakat blokigacha yuradi. Tugma ostida '3-qadam' — qahramon qadamlari (1-dars: 'bitta buyruq — bitta qadam'). Kulrang rasmda qahramon kulrangdan chiqqan qadamda dastur to'xtaydi, blok yonida belgi qoladi (urildi belgisidek), Ortiqvoy «Rasmdan chiqdi!» (**KOD** 2). To'xtagandan (rasmdan chiqdi, chet) keyingi bosish — boshidan. «▶ Ishga tushir» — qolganini odatdagidek bajaradi. Dastur o'zgarsa — keyingi «Bitta qadam» boshidan. Bosish «Maslahat» uchun urinish hisoblanadi. Tugma 1–2-bekatda va 3 · ★ da bor; 3-bekatning 1–3-pog'onalarida (ikki labirint, o'yin, savatlar) yo'q — u yerda usul 'hamma holatni sinash' («Savollar» 11).
**«Maslahat»** — 6-darsdagidek bir urinishdan keyin ochiladi (6-dars KOD 1 — tayyor): pog'ona ochilganda qulf, «Avval bir marta ishga tushiring».
**Masalada maqsad:** tuzatilgan dastur o'z sahnasida ishlaydi — yulduzda, olmalar olingan; rasm tayyor; ikkala labirintda yulduzda; o'yin yutildi; olma har savatga tusha oladi va savatdan chiqmaydi. Bola dasturni o'chirib, yangidan tuzsa ham qabul qilinadi — natija bas (2-, 8-darsdagidek), lekin bloklar chegaradan oshmaydi.

**Topshiriqlar va tekshiruv natijasi** (dastur bilan simulyatsiya qilingan; 'R3[↑]' — `repeat 3`, ichida `move up`; «→ ← ↑ ↓» — `move right/left/up/down`; 'go(x, y)' — `go to x: y:`; 'if→[→]' — `if path → then`, ichida `move right`; 'W↑[↓]' — `when ↑ key pressed`, ostida `move down`; 'go(R1-5, 2)' — `go to x: (random 1 to 5) y: 2`; 'N-blok' — dastur ustunida yuqoridan sanaganda, `repeat` va ichidagilar ham; «Bitta qadam» — nechanchi bosishda qahramon kulrangdan chiqadi; oxirgi ustun — tahrir qidiruvi: bitta o'zgartirish bilan ishlaydigan hamma tuzatish):

| Joy | Topshiriq | Tayyor dastur | Xato turi (faqat ustozga) | Nima bo'ladi (simulyatsiya) | Bitta qadam | Tuzatilgani | Bitta o'zgartirish bilan |
|---|---|---|---|---|---|---|---|
| Huk (2–4) | rasm «Tepalik»: start (0, 0); kulrang (0, 0), (1, 0), (2, 0), (2, 1), (2, 2), (3, 2), (4, 2), (5, 2) | R2[→] R3[↑] R3[→] | takrorlash soni | rasmdan chiqdi (2, 3), oxiri (5, 3) | 5-qadam — 4-blok (↑, `repeat` sanog'i «3»), (2, 3) | R2[→] R2[↑] R3[→] | faqat 2-`repeat` 3→2. A (oxirgi `repeat` 3→2) — yana chiqdi (2, 3), oxiri (4, 3); B (1-`repeat` 2→3) — chiqdi (3, 0) |
| 10 (ustoz) | rasm «Zinapoya»: start (2, 0); kulrang (2, 0), (3, 0), (3, 1), (4, 1), (4, 2), (5, 2), (5, 3) | R3[↑ →] | tartib (ichida) | rasmdan chiqdi (2, 1) | 1-qadam — 2-blok, (2, 1) | R3[→ ↑] | faqat ichidagi ikki blok joyini almashtirish |
| 8 · 1 | «Burilish»: start (0, 0); olma (4, 1); yulduz (4, 2) | R4[←] R2[↑] | yo'nalish | 2-blokda darrov to'xtadi (chet) — Kamvoy «Maydon tugadi!» | — (to'xtagan blok — xato blok) | R4[→] R2[↑] | faqat ← o'rniga → |
| 8 · 2 | «Pastga»: start (5, 3); olmalar (5, 2), (5, 1); yulduz (5, 0) | R5[↓] | takrorlash soni | yulduzga yetib, 4-safarda chet — 2-blokda to'xtadi | — | R3[↓] | faqat 5→3 |
| 8 · 3 | «Qator»: start (0, 0); olmalar (6, 2), (4, 2), (2, 2); yulduz (1, 2) | go(5, 2) R5[←] | `go to` soni | yulduzdan o'tib ketdi, (0, 2); olma (6, 2) qoldi — Kamvoy «Olma qoldi-ku!» (dvigatel avval olmani tekshiradi) | — (xato — 1-blok, muammocha oxirida) | go(6, 2) R5[←] | X 5→6 yoki `go to` dan keyin → qo'shish (21.11 mustaqil qidiruv — ikkinchisi ham ishlaydi); R5→R4 — olma (6, 2) baribir qoladi |
| 8 · ★ | «Ikki xato»: start (6, 0); olma (3, 0); yulduz (0, 2) | R6[→] R3[↑] | yo'nalish + takrorlash soni | 2-blokda darrov chet; birinchisi tuzatilsa R6[←] R3[↑] — yulduzdan o'tib ketdi (0, 3) | — | R6[←] R2[↑] | bitta o'zgartirish bilan yo'q — ataylab: ikki tuzatish, ikki ishga tushirish |
| 11 · 1 | rasm «Ilmoq»: start (0, 0); kulrang (0, 0), (0, 1), (0, 2), (1, 2), (2, 2), (3, 2) | R2[↑] ↑ R3[→] | ortiqcha blok | rasmdan chiqdi (0, 3), oxiri (3, 3) | 3-qadam — 3-blok (ortiqcha ↑), (0, 3) | R2[↑] R3[→] | 3-blokni «✕»; ↓ ni 2-o'ringa qo'shish ham o'tadi (↑ ↓ ↑ — kulrangda qoladi; 21.11 mustaqil qidiruv). 1-`repeat` 2→1 yo'li yo'q — dvigatelda `repeat` soni 2–10. Ortiqcha ↑ ni → ga almashtirish — (4, 2) chiqadi |
| 11 · 2 | rasm «Ilon»: start (0, 2); kulrang (0, 2), (1, 2), (2, 2), (2, 1), (2, 0), (3, 0), (4, 0) | → → ↓ → → | yetishmaydigan blok | rasmdan chiqdi (3, 1), oxiri (4, 1) | 4-qadam — 4-blok, (3, 1) | → → ↓ ↓ → → | ↓ ni 3- yoki 4-o'ringa qo'shish (javondan — oxiriga, keyin joy almashtirish) |
| 11 · 3 | rasm «Darvoza»: start (2, 0); kulrang (2, 0), (2, 1), (2, 2), (3, 2), (4, 2), (4, 1), (4, 0) | R2[↑] R2[↓] R2[→] | tartib | qahramon chap ustundan qaytib tushadi, rasmdan chiqdi (3, 0); oxiri (4, 0) — joyida | 5-qadam — 6-blok, (3, 0) (3–4-qadamda oltin iz ustidan qaytadi) | R2[↑] R2[→] R2[↓] | faqat 2- va 3-`repeat` joyini almashtirish |
| 11 · ★ | rasm «Uch ustun»: start (0, 0); kulrang X 0 (Y 0–3), X 3 (Y 0–4), X 5 (Y 0–3) — 13 ta | R3[↑] go(2, 0) R4[↑] go(5, 0) R3[↑] | `go to` soni (uzun dasturda) | rasmdan chiqdi (2, 0); oxiri (5, 3) — joyida | 4-qadam — 3-blok (`go to`), (2, 0) | R3[↑] go(3, 0) R4[↑] go(5, 0) R3[↑] | faqat X 2→3 |
| 14 (ustoz) | savatlar (2, 0)…(6, 0); Coddy (0, 2) | go(R2-7, 0) | random sonlari | tanlov 4, 2 — savatga, muammochasiz (sanab topiladigan muammocha — faqat «Sinov: 3 / 3» dan keyin, **KOD** 12); 7 — olma maydon chetida, Kamvoy «Maydon tugadi!» | — | go(R2-6, 0) | haqiqiy tasodifda uch ishga tushirishda 7 chiqishi — 42% (1 − (5/6)³; 21.11 tuzatildi, avval '41%') (shuning uchun ko'rish ekranida tanlov oldindan beriladi) |
| 15 · 1 | «Ikki labirint»: 1-labirint `#######` · `S···★##` · `#######`; 2-labirint `###·★` · `##··#` · `#··##` · `S·###` | R6[if→[→], if↓[↑]] | shart tomoni | 1-labirint — ★ (4 qadam); 2-labirint — 1 qadamda turib qoldi, Kamvoy «Oz qoldi!» | — (xato faqat 2-labirintda) | R6[if→[→], if↑[↑]] — 2-labirintda 7 qadam | faqat ikkinchi `if` tomoni ↓→↑. Son 4 dan kam bo'lsa — 2-labirintda yetmaydi |
| 15 · 2 | «Olma terish» (o'yin): start (0, 0); olmalar (2, 2), (5, 0); yulduz (3, 4), olmalar olingach ochiladi | W→[→] W←[←] W↑[↑] W↑[↓] | hodisa tugmasi | → va ← ishlaydi; ↑ bosilsa qahramon tepaga chiqib qaytib tushadi (ikki dasturcha), ↓ — Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…» | — (xato faqat ↑ va ↓ da) | 4-dasturcha W↓[↓] | ikkinchi `when ↑` tugmasini ↓ ga (birinchisini ↓ ga almashtirib yutish qabul qilinmaydi — har strelka o'z tomoniga yurishi kerak, **KOD** 11). Namuna o'yin: ↑↑ →→ ↓↓ →→→ ←← ↑↑↑↑ — 15 bosish, yo'li bezakka tegmaydi |
| 15 · 3 | «Savatlar»: (0, 2)…(5, 2); qahramon (3, 0) | go(R1-5, 2) | random sonlari | har ishga tushirishda savatga tushadi (1000 urug'dan 1000 tasida 10 marta ishga tushirishda ham), lekin (0, 2) ga hech qachon — Kamvoy «Bu savat bo‘sh qoladi!» («Sinov: 3 / 3» dan keyin, **KOD** 12) | — (xato faqat sanoqda) | go(R0-5, 2) | 1→0. R0-6 — (6, 2) da savat yo'q |
| 15 · ★ | «Topishmoq»: start (0, 0); olma (2, 2); yulduz (4, 2) | bolaning o'zi | — | tayyor sharti: dastur ishlamaydi, bitta o'zgartirish bilan ishlaydi, kamida 3 ta blok | — | (namuna R2[↑] R4[→]) | R2[↑] R3[→] — tayyor; R2[↑] R4[←] — tayyor; R4[→] R2[↑] — tayyor (olma qoladi; joy almashtirish); R2[↑] R4[→] — ishora 'Dastur ishlayapti! …' (muammocha emas); R3[↑] R5[→], go(4, 2) R2[↑] — ikki xato; → → — kam blok |

**Simulyatsiya xulosasi:**
- Har tayyor dastur haqiqatan ishlamaydi va (8 · ★ dan tashqari) **bitta o'zgartirish** bilan tuzaladi; tuzatish ko'p joyda yagona (11 · 2 da — bitta blokni ikki o'ringa qo'shish, natija bir xil). **21.11 mustaqil qidiruv** (`sinov/dvigatel/xato.mjs`, 68 tekshiruv) ikki joyda ikkinchi yo'lni topdi: 8 · 3 (`go to` dan keyin → qo'shish) va 11 · 1 (↓ qo'shish; 1-`repeat` 2→1 yo'li yo'q — dvigatelda `repeat` soni 2–10). Ikkalasi ham haqiqiy tuzatish — pog'ona natijani tekshiradi, qaysi yo'l bilan tuzatilgani muhim emas. Qolgan joylarda tasodifiy o'zgartirish ishlamaydi.
- To'xtagan joy va xato joyi: 8 · 1 da bir xil (birinchi pog'ona — oson); 8 · 2 da — to'xtagan blok ichida, xato soni; 8 · 3 da — xato birinchi blokda, muammocha oxirida chiqadi (2-bekatga ko'prik). 2-bekatda «Bitta qadam» qahramon kulrangdan chiqqan qadamni ko'rsatadi: 11 · 1, 11 · 2, 11 · ★, 10 da — xato blokning o'zi; huk va 11 · 3 da — undan keyingi blok (xato — son yoki tartib: 'chiqqan joy va undan oldingisi').
- 3-bekatdagi xatolarning hammasi «yashirin»: 15 · 1 — 1-labirintda ishlaydi; 15 · 2 — → va ← da ishlaydi; 15 · 3 — har ishga tushirishda savatga tushadi.
- Bezak: hamma start, olma, yulduz, kulrang va savat kataklari, hamma tuzatilgan yo'l va 15 · 2 namuna o'yini — bezakdan tashqarida. Xato variantlarining izi bezak ustidan o'tadi (huk (2, 3) gul, (4, 3) daraxt; 11 · 1 (2, 3) gul) — bezak to'siq emas (6-darsdagidek).
- Takrorlanmaydi: tuzatilgan dasturlarning hammasi har xil (15 ta: → ↑ … jadvaldagi 'Tuzatilgani' ustuni); 6-dars 14-qadam (R2[↑] R3[→] → R3[→] R2[↑], olma (3, 0), yulduz (3, 2)) va 15 · 3, 2- va 8-dars xatoli dasturlari bilan ustma-ust tushmaydi. Istisno — 15 · 1 ning tuzatilgani 8-dars 10-qadamdagi ustoz dasturi bilan bir xil (labirintlar boshqa; 'Tekshirilmagan joylar' 5).

## Yordam va xato

1–13-darsdagidek: xatoda muammocha — bitta gap, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga 'noto'g'ri', 'xato qildingiz' deyilmaydi; «xato» — dasturdagi topiladigan narsa (98-qaror). Muammocha — tanish to'rttasi va ularning tanish gaplari (2–13-darsdagi jadvallardan, o'zgarishsiz).
**«Maslahat»** — 6-darsdagidek: bir urinishdan keyin ochiladi; bosilsa — ustozda «Yordam so‘radi: N ta noutbuk», mentorga — 'maslahat bilan' belgisi.
Ishora qatorining boshida: 1-bekat — «Ishga tushiring — qayerda to‘xtaydi?»; 2-bekat — «Bitta qadam bilan yuring — qayerda rasmdan chiqadi?»; 3-bekat — pog'onaga qarab: 1 — «Ikkala labirintda ham sinang»; 2 — «Har strelkani bosib ko‘ring»; 3 — «Har savatga olma tusha oladimi?»; ★ — «Avval ishlaydigan dastur tuzing» (proyektor sarlavhasi «Hamma holatni sinang!» qoladi).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Kamvoy | qahramon maydon chetiga keldi (1-bekat) | «Maydon tugadi!» | «Qahramon shu blokda to‘xtadi. Shu blokni va undan oldingisini o‘qing» |
| Ortiqvoy | qahramon yulduzdan o'tib ketdi | «Ko‘payib ketdi!» | «Qahramon yulduzdan o‘tib ketdi. Qaysi blok uni uzoqqa olib bordi?» |
| Kamvoy | olma qoldi | «Olma qoldi-ku!» | 'Avval olmaga boring — u (x, y) da' |
| Kamvoy | dastur tugadi, qahramon boshqa katakda | «Yulduz bu yerda emas!» | «Qahramon (x, y) da. Yulduzning manzilini o‘qing» |
| Ortiqvoy | rasmdan chiqdi (oddiy ishga tushirishda — oxirida) | «Rasmdan chiqdi!» | «Qahramon (x, y) ga chiqdi — u kulrang emas. Bitta qadam bilan yuring» |
| Ortiqvoy | «Bitta qadam»da rasmdan chiqdi (**KOD** 2) | «Rasmdan chiqdi!» | «N-qadam: qahramon (x, y) ga chiqdi. Shu blokni va undan oldingisini o‘qing» |
| Kamvoy | kulrang katak qoldi | «Oz qoldi!» | «Kulrang katak qoldi — (x, y). Bitta qadam bilan yuring» |
| Kamvoy | 15 · 1: N-labirintda yetmadi | «Oz qoldi!» | «N-labirintda yulduzgacha yetmadi. O‘sha joyda if larni o‘qing» (8-dars gapi, oxiri — bu darsniki) |
| To'siqvoy | 15 · 1: devorga urildi | «Devor!» | 8-darsdagidek |
| Bo'shvoy | 15 · 2: bosilgan tugmaning dasturchasi yo'q | «Bu tugma uchun dasturcha yo‘q-ku…» | «↓ bosildi — uning dasturchasi yo‘q. Dasturchalarning tugmalarini o‘qing.» |
| Kamvoy | 15 · 2: o'yin yutildi, lekin strelka boshqa tomonga yuradi (**KOD** 11) | «Oz qoldi!» | «Har strelkani bosib ko‘ring: qaysi biri boshqa tomonga yuryapti?» |
| Kamvoy | 15 · 3: savatga olma hech qachon tushmaydi — «Sinov: 3 / 3» dan keyin (**KOD** 12) | «Bu savat bo‘sh qoladi!» | «(x, y) dagi savatga olma tushmaydi. random sonlarini tekshiring» (13-dars) |
| Ortiqvoy | 15 · 3: olma savat yo'q katakka tushdi — darhol; tanlanmagan son savat yo'q katakka tushadi — «Sinov: 3 / 3» dan keyin (**KOD** 12) | «Savat yo‘q-ku!» | 13-darsdagidek |
| Kamvoy | 15 · 3 va 14: olma maydon chetida — darhol | «Maydon tugadi!» | 13-darsdagidek |
| — | 15 · ★: dastur ishlayapti — xato yo'q (muammocha emas, ishora) | — | «Dastur ishlayapti! Endi bitta blokni o‘zgartiring — topishmoq bo‘lsin.» |
| Ortiqvoy | 15 · ★: bitta o'zgartirish bilan tuzalmaydi | «Ko‘payib ketdi!» | «Xato bittadan ko‘p. Topishmoqda bitta xato bo‘lsin» |
| Kamvoy | 15 · ★: 3 tadan kam blok | «Oz qoldi!» | «Topishmoqda kamida 3 ta blok bo‘lsin» |
| Bo'shvoy | dastur bo'sh | «Bu yerda hech narsa yo‘q-ku…» | «Avval blokni bosing — u dasturga qo‘shiladi» |
| Ortiqvoy | dastur to'ldi | «Joy qolmadi!» | «Dasturga N ta blok sig‘adi» |

Ikki sabab birga bo'lsa — avval to'xtash (chet, devor), keyin birinchi ko'ringani. Muammocha qahramonni yopmaydi (91-qaror).
15 · ★ da bola ishga tushirganda aynan bitta xato bo'lsa — odatdagi muammocha chiqmaydi: «Topishmoq tayyor!» va konfeti (**KOD** 4); boshqa holatlar — jadvaldagi gaplar. 15 · 2 da dvigatelning «▶ Boshlash»dagi '↑ uchun ikkita dasturcha bor — ikkalasi ham ishlaydi' ishorasi ko'rsatilmaydi (**KOD** 11).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:02 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «14-dars · Xatoni topish», sarlavha «Bugun xatolarni topamiz!». Coddy: «Salom! Bugun dasturlardagi xatolarni topib tuzatasiz.» O'ngda maydon, Coddy (0, 0) da. Pastda kichik karta «O‘tgan darsda»: `random 1 to 6` — «Tasodifiy son — Dastur o‘zi tanlaydigan son». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda dastur sonni o‘zi tanladi — o‘yin har safar boshqacha bo‘ldi.»
  2. «Bugun yangi blok yo‘q. Xatosi bor dasturlarni tuzatasiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; o'tgan darslarda muammocha chiqqan bir lahzani eslatadi — xato har dasturda bo'ladi, dasturchilar ham har kuni xato topadi; bugun ustoz tuzatib bermaydi — har kim o'zi topadi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «14-dars · Xatoni topish», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: xatoni qanday topamiz?

- **Vaqt:** 0:02–0:03:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Har karta — xatoni izlashning bir usuli: A — muammocha turgan joy (oxiri), B — tavakkal, C — qadam-baqadam. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Xatoni qanday topamiz?». Maydonda kulrang rasm «Tepalik» va Coddy chizgan oltin iz — rasm ustidan tepaga chiqib ketgan; Coddy (5, 3) da. O'ngda dastur: `repeat 2` ichida `move right`, `repeat 3` ichida `move up`, `repeat 3` ichida `move right` — «6 ta blok». Ortiqvoy «Rasmdan chiqdi!». Coddy: «Dastur tepalikni chizishi kerak edi. Boshqa rasm chiqdi.» Chapda uchta karta: A «Oxirgi blokni tuzatamiz» (oxirgi `repeat` hoshiyalangan rasmi) · B «Har xil o‘zgartirib ko‘ramiz» (son ro'yxati ochilgan blok rasmi) · C «Qadam-baqadam yuramiz» («Bitta qadam» tugmasi rasmi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Dasturda bitta xato bor. Rasm boshqacha chiqdi.»
  2. «Har kim noutbukida bitta kartani tanlasin: xatoni qanday topamiz?»
- **O'z so'zi bilan:** kulrang rasmni va oltin izni sinf bilan solishtiradi; kartalarni o'qiydi; sinf javoblarini o'qiydi. Xato qayerdaligini o'zi aytmaydi — buni sinov ko'rsatadi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol, rasm va uchta karta; Coddy: «Xatoni qaysi usul bilan topamiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz usullarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi va o'z dasturi bilan o'ynaladi (oxirgi `repeat 3` → 2; o'ngdagi dastur ustuni o'zgarmaydi): Coddy qaytadan chizadi — iz yana tepaga chiqib ketdi, (4, 3) da tugadi. Kartada: «✕ xato boshqa joyda».
  2. «Keyingi» — B kartasi o'z dasturi bilan (birinchi `repeat 2` → 3): iz pastki qatorning o'zidayoq rasmdan chiqdi — (3, 0). Kartada: «✕ rasm battar».
  3. «Keyingi» — C: tayyor xatoli dastur «Bitta qadam» bilan — dvigatel o'zi besh marta bosadi (9-dars «O‘ynab ko‘rsat» kabi). Har bosishda harakat bloki yonadi, Coddy bitta qadam: 1-, 2-qadam — o'ngga, oltin; 3-, 4-qadam — tepaga, oltin; 5-qadam — tepaga, (2, 3) — kulrang emas: to'xtadi, `repeat 3` yonida sanoq «3». Kartada: «✓ 5-qadamda topildi».
- **Tayanch gaplar:**
  1. «Muammocha oxirida chiqdi, lekin xato oxirida emas edi. Har xil o‘zgartirsak — battar.»
  2. «Qadam-baqadam yurdik: qahramon qayerda rasmdan chiqdi — xato o‘sha yerda.»
- **O'z so'zi bilan:** C da sinf bilan birga qadamlarni sanaydi («bir — oltin, ikki — oltin…»); 5-qadamda rasmdagi tepalik ikki katak, dastur esa uch marta tepaga yurganini ko'rsatadi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta) — sinovlarni dvigatel o'zi o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: qadam-baqadam yuramiz

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Qadam-baqadam yuramiz». A va B xira, C oltin; maydonda tuzatilgan dastur (ikkinchi `repeat 3` → 2) bilan to'liq oltin tepalik, 5-qadam katagida kichik belgi. Coddy: «Har qadamda qarayman: rasmdan chiqmadimmi?»
- **Tayanch gaplar:**
  1. «Xato — topiladigan narsa. Qadam-baqadam yursak, u o‘zi ko‘rinadi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Eslaymiz: muammochalar

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — eslatma · bola «Ustoz ekraniga qarang» («Eslaymiz: muammochalar»)
- **Sahna:** 6-darsdagi «Eslaymiz» o'rnida: to'rt muammocha birma-bir — har biri qaysi xatoga ishora qilishi. Yangi narsa yo'q (`raqam` ishi).
- **Qadamlar:**
  1. Proyektorda: yorliq «Eslaymiz», sarlavha «Muammocha — iz». Coddy: «Muammocha xato qayerdaligini ko‘rsatadi.» To'rt qator xira; «Keyingi» bosilganda birma-bir:
     - 1-bosish: «Bo‘shvoy — dastur bo‘sh yoki ichi bo‘sh»;
     - 2-bosish: «Kamvoy — yetmadi, qoldi yoki maydon tugadi»;
     - 3-bosish: «Ortiqvoy — ortiqcha yurdi»;
     - 4-bosish: «To‘siqvoy — devorga urildi».
     To'rtinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Muammocha — jazo emas. U yordamchi.»
  2. «Muammocha gapini o‘qing — u qayerga qarashni aytadi.»
- **O'z so'zi bilan:** har muammochaning tanish gapini eslatadi («Oz qoldi!», «Ko‘payib ketdi!», «Devor!»); bugun ular ko'p chiqadi — bu yaxshi: har biri iz.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · To'xtagan joy → 2 · Bitta qadam → 3 · Yashirin xato; cho'qqida kichik karta «Dars oxirida · topishmoq · Ustoz xatoni izlaydi» (kichik maydonda yulduz, olma va xira iz). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Har birida xatoni o‘zingiz topasiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: to‘xtagan joy, bitta qadam, yashirin xato.»
  2. «Dars oxirida o‘zingiz topishmoq tuzasiz — bitta xatoli dastur.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Bugungi qoida: o'zingiz topasiz

- **Vaqt:** 0:09–0:10 (1 daqiqa)
- **Bekat:** 1 · To'xtagan joy
- **Ekran:** proyektor — qoida (maydon: Coddy (0, 0), dastur bo'sh; uch qator) · bola «Ustoz ekraniga qarang» («Ustoz bugungi qoidani aytyapti»)
- **Sahna:** 6-darsdagi «Qoida» kabi: ustoz topshiriq yechmaydi — uch qator, har birida tugma rasmi va gap; «Keyingi» har bosishda bitta qatorni yoqadi (`raqam` ishi; 6-dars 'Qurishdagi qarorlar' 1).
- **Qadamlar:**
  1. Proyektorda: yorliq «Qoida», sarlavha «O‘zingiz topasiz». Maydonda Coddy (0, 0) da; dastur bo'sh. Coddy: «Avval ishga tushiring, keyin tuzating.» Uch qator xira.
  2. «Keyingi» — 1-qator yonadi: «▶ Ishga tushir» tugmasi rasmi — «Avval ishga tushiring — qayerda to‘xtaydi?».
  3. «Keyingi» — 2-qator: «Bitta qadam» tugmasi rasmi — «Har bosishda bitta qadam».
  4. «Keyingi» — 3-qator: qulfli «Maslahat» tugmasi rasmi — «Bir urinishdan keyin ochiladi».
- **Tayanch gaplar:**
  1. «Har pog‘onada dastur tayyor, unda xato bor. Men tuzatmayman — o‘zingiz topasiz.»
  2. «Avval ishga tushiring. Kerak bo‘lsa — Bitta qadam.»
  3. «Tuzatgach — yana ishga tushiring. Endi o‘zingiz.»
- **O'z so'zi bilan:** tuzatish yo'llarini eslatadi: sonni bosib tanlash, blokni «✕» bilan olib tashlash, ikki blokni bosib joyini almashtirish, `repeat` ni bosib — javondagi blokni uning ichiga qo'shish; qolib ketsa — qo'l ko'tarsin.
- **Ustoz qiladi:** «Keyingi»ni bosadi (uch marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · To'xtagan joy: pog'onalar

- **Vaqt:** 0:10–0:21 (11 daqiqa)
- **Bekat:** 1 · To'xtagan joy
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Ishga tushiring — muammocha to‘xtagan joyni ko‘rsatadi.» Chapda katta son «Uch xatoni tuzatdi 4 / 14» va belgilar, ostida «Har belgi — uch xatoni tuzatgan bitta bola»; o'ngda zinapoya: 1 «Burilish» · 2 «Pastga» · 3 «Qator» · ★ «Ikki xato» — har kartada start, olmalar va yulduz (dastur va iz chizilmaydi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval ishga tushiring. Muammocha qayerda chiqdi?»
  2. «To‘xtagan blokni o‘qing — va undan oldingisini ham.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; yechimni aytmaydi — «Qahramon qayerda to‘xtadi? U qayerga borishi kerak edi?» deb so'raydi; 3-pog'onada xato birinchi blokda ekanini darrov aytmaydi — bola o'zi topsin; ★ da «bittasini tuzatdingizmi? Yana ishga tushiring».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda Harakat (to'rt `move`, `go to`) va Takrorlash (`repeat 2`); maydon; dasturda tayyor bloklar; tasma yonida 'N / M ta blok'; «▶ Ishga tushir», «Bitta qadam»; «Maslahat» qulf bilan. Hamma pog'onada ishora boshida: «Ishga tushiring — qayerda to‘xtaydi?».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Burilish», ostida «Bitta xatoni toping.». Start (0, 0); olma (4, 1); yulduz (4, 2); dastur: `repeat 4` ichida `move left`, `repeat 2` ichida `move up`; 4 ta blok, chegara 5. «Maslahat»: «Yulduz qaysi tomonda? Blok qahramonni qaysi tomonga yurgizyapti?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Pastga», ostida «Bitta xatoni toping.». Start (5, 3); olmalar (5, 2), (5, 1); yulduz (5, 0); dastur: `repeat 5` ichida `move down`; 2 ta blok, chegara 3. «Maslahat»: «Qahramon yulduzdan keyin ham yurdi. Yulduzgacha nechta katak?»
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Qator», ostida «Bitta xatoni toping.». Start (0, 0); olmalar (6, 2), (4, 2), (2, 2); yulduz (1, 2); dastur: `go to x: 5 y: 2`, `repeat 5` ichida `move left`; 3 ta blok, chegara 4. «Maslahat»: «Qaysi olma qoldi? go to qahramonni qayerga sakratdi?»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Ikki xato», ostida «Bu dasturda ikkita xato bor.». Start (6, 0); olma (3, 0); yulduz (0, 2); dastur: `repeat 6` ichida `move right`, `repeat 3` ichida `move up`; 4 ta blok, chegara 5. «Maslahat»: «Bitta xatoni tuzating va yana ishga tushiring — ikkinchisi ko‘rinadi».
  Yetsa: «Yetib bordi!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** ishga tushiradi, muammochani o'qiydi, xato blokni topib tuzatadi (son, yo'nalish), yana ishga tushiradi.
- **Tekshiruv:** dastur tugaganda qahramon yulduzda, olmalar olingan, chetga urilmadi (avto); bloklar chegaradan oshmaydi.
- **Xatoda:** chet — Kamvoy «Maydon tugadi!»; o'tib ketdi — Ortiqvoy «Ko‘payib ketdi!»; olma qoldi — Kamvoy «Olma qoldi-ku!» (3-pog'onada shu chiqadi: dvigatel avval olmani tekshiradi); boshqa katak — Kamvoy «Yulduz bu yerda emas!»; joy qolmadi — Ortiqvoy «Joy qolmadi!»; `repeat` ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…».

## 9 · 2-bekat

- **Vaqt:** 0:21–0:22 (1 daqiqa)
- **Bekat:** 2 · Bitta qadam
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: bitta qadam»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · To'xtagan joy ✓, oltin yoy; Coddy 2-bekatda; 2 · Bitta qadam miltillaydi. Coddy: «Endi dastur to‘xtamaydi — rasm boshqa chiqadi.»
- **Tayanch gaplar:**
  1. «To‘xtagan joyni topdik. Endi xato to‘xtatmaydi — uni qadam-baqadam izlaymiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: bitta qadam

- **Vaqt:** 0:22–0:23:30 (1,5 daqiqa)
- **Bekat:** 2 · Bitta qadam
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz qadam-baqadam yuryapti — kuzating»)
- **Sahna:** 2-bekat topshiriq turini ko'rsatish — bolalarning pog'onalaridan boshqa rasm va boshqa xato.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Har bosishda bitta qadam». Maydonda kulrang rasm «Zinapoya» — (2, 0) dan (5, 3) gacha; Coddy (2, 0) da. Dasturda tayyor: `repeat 3` ichida `move up`, `move right` — «3 ta blok».
  2. «▶ Ishga tushir»: Coddy boshqa zinapoya chizadi — Ortiqvoy «Rasmdan chiqdi!».
  3. Ustoz «Bitta qadam»ni bosadi: `move up` yonadi, `repeat` yonida «1», Coddy (2, 1) ga — kulrang emas; dastur to'xtaydi, blok yonida belgi: '1-qadam: qahramon (2, 1) ga chiqdi'.
  4. Ustoz `move right` ni bosadi (tanlanadi), keyin `move up` ni — ikkalasining joyi almashadi. «▶ Ishga tushir» — «Rasm tayyor!» va konfeti.
- **Tayanch gaplar:**
  1. «Bitta qadam — har bosishda qahramon bitta qadam yuradi. Qahramon qayerda — rasm bilan solishtiramiz.»
  2. «Qahramon rasmdan chiqqan qadam — xatoga eng yaqin joy. Shu blokni va undan oldingisini o‘qiymiz.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** «Bitta qadam» `repeat` ichida ham ishlaydi — ichidagi bloklarni qadam-baqadam, sanoq bilan; tuzatgach har doim yana ishga tushiramiz.
- **Ustoz qiladi:** ishga tushiradi, «Bitta qadam»ni bosadi, ikki blok joyini almashtiradi, yana ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Bitta qadam: pog'onalar

- **Vaqt:** 0:23:30–0:35 (11,5 daqiqa)
- **Bekat:** 2 · Bitta qadam
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Qadam-baqadam!». Coddy: «Bitta qadam bilan yuring — rasmdan chiqqan joyni toping.» Chapda katta son «Uch xatoni tuzatdi 5 / 14» va belgilar; o'ngda zinapoya: 1 «Ilmoq» · 2 «Ilon» · 3 «Darvoza» · ★ «Uch ustun» — har kartada kulrang rasm (iz va dastur yo'q). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Bitta qadam bosing va qarang: qahramon kulrang katakdami?»
  2. «Rasmdan chiqqan qadamda dastur to‘xtaydi — shu blokni va undan oldingisini o‘qing.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Nechanchi qadamda chiqdi? Shu qadamda qaysi blok yonib turibdi?» deb so'raydi; 3-pog'onada qahramon oltin iz ustidan qaytganini darrov aytmaydi; ★ da uzun dasturni barmoq bilan qadam-baqadam yurishni so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; maydonda kulrang rasm; dasturda tayyor bloklar; 'N / M ta blok'; «Maslahat» qulf bilan. Hamma pog'onada ishora boshida: «Bitta qadam bilan yuring — qayerda rasmdan chiqadi?». Qahramon o'tgan katak oltin bo'ladi.
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Ilmoq», ostida «Bitta xatoni toping.». Start (0, 0); kulrang (0, 0)…(0, 2), (1, 2)…(3, 2); dastur: `repeat 2` ichida `move up`, `move up`, `repeat 3` ichida `move right`; 5 ta blok, chegara 6. «Maslahat»: «Bitta qadam bilan yuring: qaysi blokdan keyin qahramon rasmdan chiqdi?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Ilon», ostida «Bitta xatoni toping.». Start (0, 2); kulrang (0, 2), (1, 2), (2, 2), (2, 1), (2, 0), (3, 0), (4, 0); dastur: `move right`, `move right`, `move down`, `move right`, `move right`; 5 ta blok, chegara 7. «Maslahat»: «Qahramon qaysi qadamda rasmdan chiqdi? Rasmda o‘sha joyda qaysi tomonga yurish kerak?»
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Darvoza», ostida «Bitta xatoni toping.». Start (2, 0); kulrang (2, 0)…(2, 2), (3, 2), (4, 2)…(4, 0); dastur: `repeat 2` ichida `move up`, `repeat 2` ichida `move down`, `repeat 2` ichida `move right`; 6 ta blok, chegara 7. «Maslahat»: «Qahramon tepaga chiqqach, qaysi tomonga yurishi kerak edi?»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Uch ustun», ostida «Uzun dasturda bitta xato bor.». Start (0, 0); kulrang — uch ustun: X 0 (Y 0–3), X 3 (Y 0–4), X 5 (Y 0–3); dastur: `repeat 3` ichida `move up`, `go to x: 2 y: 0`, `repeat 4` ichida `move up`, `go to x: 5 y: 0`, `repeat 3` ichida `move up`; 8 ta blok, chegara 9. «Maslahat»: «Har sakrashdan keyin qahramon kulrang katakdami?»
  Tayyor bo'lsa: «Rasm tayyor!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** «Bitta qadam» bilan yuradi, qahramon kulrangdan chiqqan qadamni topadi, o'sha va oldingi blokni o'qiydi, tuzatadi (✕, javondan qo'shib joy almashtirish, ikki `repeat` joyini almashtirish, son), yana ishga tushiradi.
- **Tekshiruv:** kulrang kataklarning hammasi oltin, iz kulrangdan chiqmadi (avto); bloklar chegaradan oshmadi.
- **Xatoda:** rasmdan chiqdi — Ortiqvoy «Rasmdan chiqdi!»; kulrang qoldi — Kamvoy «Oz qoldi!»; chet — Kamvoy «Maydon tugadi!»; joy qolmadi — Ortiqvoy «Joy qolmadi!»; ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…».

## 12 · Xulosa: xato qanday topiladi

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Bitta qadam
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: xato qanday topiladi»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Xato — topiladi!». Coddy: «Avval ishga tushiraman, keyin qadam-baqadam qarayman.» Ikki karta: «▶ Ishga tushir — Muammocha joyni ko‘rsatadi» (muammocha rasmi) · «Bitta qadam — Qayerda rasmdan chiqqani ko‘rinadi» (tugma rasmi); o'ngda maydon — huk rasmi, to'liq oltin, 5-qadam katagida belgi.
- **Tayanch gaplar:**
  1. «Avval ishga tushiramiz. Xato to‘xtatmasa — qadam-baqadam yuramiz.»
  2. «Xato — qahramon rasmdan chiqqan joyda yoki undan oldinroq. Tuzatgach — yana ishga tushiramiz.»
- **O'z so'zi bilan:** 1–2-bekat doskasida ko'p bola qolgan pog'onani eslatadi (ismsiz) va o'sha dasturni sinf bilan birga qadam-baqadam o'qiydi — xatoni o'zi aytmaydi (ulgurmaganlar uyda — solo'da — qaytadi).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 3 · Yashirin xato
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: yashirin xato»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Yashirin xato miltillaydi. Coddy: «Oxirgi bekat: bir marta ishlagan dasturda ham xato bo‘lishi mumkin.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisida xato har safar ko‘rinmaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: ko'p marta sinaymiz

- **Vaqt:** 0:38–0:39:30 (1,5 daqiqa)
- **Bekat:** 3 · Yashirin xato
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz dasturni ko‘p marta sinayapti — kuzating»)
- **Sahna:** 3-bekat topshiriq turini ko'rsatish — bolalarning pog'onalaridan boshqa xato (bu yerda — maydondan chiqish, 15 · 3 da — bo'sh savat).
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Ko‘p marta sinaymiz». Maydonda savatlar (2, 0)…(6, 0); Coddy (0, 2) da. Olma dasturida tayyor: `go to x: (random 2 to 7) y: 0` — «2 ta blok».
  2. «▶ Ishga tushir»: «4» — olma (4, 0) savatiga tushadi, muammochasiz (bu darsda sanab topiladigan muammocha faqat «Sinov: 3 / 3» dan keyin chiqadi — **KOD** 12).
  3. Yana ikki marta: «2» — savatga; «7» — olma maydon chetida turtiladi, Kamvoy «Maydon tugadi!».
  4. Ustoz 7 ni 6 ga o'zgartiradi; uch marta ishga tushiradi — «Har safar boshqa joy!».
- **Tayanch gaplar:**
  1. «Ikki marta ishladi, uchinchisida chiqib ketdi. Xato yashirin edi.»
  2. «Dastur har holatda ishlasin: har labirintda, har tugmada, har sonda.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** 13-darsdagi «Sinov: 3 / 3»ni eslatadi; 8-darsdagi ikki labirintni eslatadi — bitta dastur, ikki holat; bugungi pog'onalarda «hamma holat» har xil: ikki labirint, to'rt strelka, random'ning sonlari.
- **Ustoz qiladi:** uch marta ishga tushiradi, sonni o'zgartiradi, yana uch marta ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Yashirin xato: pog'onalar

- **Vaqt:** 0:39:30–0:54 (14,5 daqiqa)
- **Bekat:** 3 · Yashirin xato
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Hamma holatni sinang!». Coddy: «Bir holatda ishladi — endi boshqasida sinang.» Chapda katta son «Uch xatoni tuzatdi 6 / 14» va belgilar, ostida «Har belgi — uch xatoni tuzatgan bitta bola»; o'ngda zinapoya: 1 «Ikki labirint» · 2 «Olma terish» · 3 «Savatlar» · ★ «Topishmoq» — kartalarda: 1 — ikki labirint; 2 — maydon, olmalar; 3 — savatlar; ★ — start, olma, yulduz. Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Bu bekatda dastur bir holatda ishlaydi, boshqasida — yo‘q. O‘sha holatni toping.»
  2. «Topishmoqda xato bitta bo‘lsin.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** 1-pog'onada «ikkala labirint ham ishladimi?»; 2-pog'onada «har strelkani bosib ko‘rdingizmi?»; 3-pog'onada «har savatga olma tusha oladimi?»; ★ da «Avval ishlaydigan dastur tuzing, keyin bitta blokni o‘zgartiring» — ustoz sinf oldida topadigan topishmoq.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; har pog'onada o'z sahnasi va javoni; dasturda tayyor bloklar (★ da — bo'sh); «Maslahat» qulf bilan; «Bitta qadam» — faqat ★ da. Ishora boshida — pog'onaga qarab: 1 — «Ikkala labirintda ham sinang»; 2 — «Har strelkani bosib ko‘ring»; 3 — «Har savatga olma tusha oladimi?»; ★ — «Avval ishlaydigan dastur tuzing».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Ikki labirint», ostida «Bitta xatoni toping.». Labirintlar 15 · 1 (jadval); dastur: `repeat 6` ichida `if path → then` (ichida `move right`) va `if path ↓ then` (ichida `move up`); 5 ta blok, chegara 6. «Maslahat»: «Qaysi labirintda to‘xtadi? O‘sha joyda if lar qaysi tomonni tekshiryapti?»
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Olma terish», ostida «Bitta xatoni toping.». Maydon; start (0, 0); olmalar (2, 2), (5, 0); yulduz (3, 4) yashirin; to'rt dasturcha: `when → key pressed` → `move right` · `when ← key pressed` → `move left` · `when ↑ key pressed` → `move up` · `when ↑ key pressed` → `move down`; 8 ta blok, chegara 9; asosiy tugma «▶ Boshlash». «Maslahat»: «Har strelka o‘z tomoniga yuryaptimi? Dasturchalarning tugmalarini o‘qing»
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Savatlar», ostida «Bitta xatoni toping.». Savatlar (0, 2)…(5, 2); qahramon (3, 0); olma dasturi: `go to x: (random 1 to 5) y: 2`; 2 ta blok, chegara 3. «Maslahat»: «random qaysi sonlarni tanlay oladi? Savatlar qaysi X larda?»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Topishmoq», ostida «Avval ishlaydigan dastur tuzing. Keyin bitta xato qo‘ying.». Start (0, 0); olma (2, 2); yulduz (4, 2); dastur bo'sh; 12 ta blok. «Maslahat»: «Bitta blokni o‘zgartiring: yo‘nalishini, sonini yoki o‘rnini». Erkin ijod (36-qaror).
  1-pog'onada ikkalasida yetsa: «Ikkalasida yetdi!»; 2-pog'onada: «Siz yutdingiz!»; 3-pog'onada: «Har safar boshqa joy!»; ★ da: «Topishmoq tayyor!»; konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** dasturni bir holatda sinaydi, ishlamaydigan holatni topadi, xatoni tuzatadi (shart tomoni, hodisa tugmasi, random soni), hamma holatda qayta sinaydi; ★ da topishmoq tuzadi.
- **Tekshiruv:** 1 — ikkala labirintda yulduzda, urilmadi; 2 — o'yin yutildi (ikkala olma, yulduz) va har strelka o'z tomoniga yuradi (birinchi `when ↑` ni ↓ ga almashtirib yutish qabul qilinmaydi — Kamvoy «Oz qoldi!», ishora «Har strelkani bosib ko‘ring: qaysi biri boshqa tomonga yuryapti?»; **KOD** 11); 3 — random'ning hamma soni savatda va har savatga tushadi, 3 marta ishga tushirildi (13-dars); ★ — dastur ishlamaydi, bitta o'zgartirish bilan ishlaydi, kamida 3 ta blok (avto, **KOD** 4).
- **Xatoda:** 1 — Kamvoy «Oz qoldi!» ('N-labirintda…'), To'siqvoy «Devor!»; 2 — Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…», Kamvoy «Oz qoldi!» (strelka boshqa tomonga); 3 — Kamvoy «Bu savat bo‘sh qoladi!», Ortiqvoy «Savat yo‘q-ku!» (sanab topilgani — «Sinov: 3 / 3» dan keyin; ishga tushirishda ko'ringani — darhol), Kamvoy «Maydon tugadi!»; ★ — ishora 'Dastur ishlayapti! …' (muammochasiz), Kamvoy «Oz qoldi!» («kamida 3 ta blok»), Ortiqvoy «Ko‘payib ketdi!» ('Xato bittadan ko‘p…'); aynan bitta xato bo'lsa — muammocha chiqmaydi, «Topishmoq tayyor!» va konfeti.

## 16 · Topishmog'ingizni o'qib bering

- **Vaqt:** 0:54–0:59 (5 daqiqa)
- **Bekat:** 3 · Yashirin xato
- **Ekran:** proyektor — Blok studiya (ustoz, 15 · ★ maydoni: start (0, 0), olma (2, 2), yulduz (4, 2); dastur bo'sh) · bola — o'z oxirgi yechgan pog'onasi, o'z dasturi bilan («Dasturingizni ustozga o‘qib bering»; A·1; hech narsa yechmagan bolada — «Ustoz ekraniga qarang»)
- **Sahna:** 12-bo'lim 3-band: ★ ni bajargan bola topishmog'ini ovoz chiqarib o'qiydi («repeat 2: move up; repeat 3: move right»), ustoz o'sha bloklarni qo'yadi, ishga tushiradi — muammocha chiqadi; keyin ustoz o'zi «Bitta qadam» bilan yuradi va xato blokni topib tuzatadi; topishmoq egasi «Ha, shu» deb tasdiqlaydi. Sinfdan taxmin so'ralmaydi (59-qaror) — sinf kuzatadi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Topishmog‘ingizni o‘qib bering». Maydon, Coddy (0, 0) da; dastur bo'sh. Coddy: «Siz o‘qiysiz — men xatoni izlayman.»
  2. Bola o'qiydi; ustoz bloklarni qo'yadi; «▶ Ishga tushir» — muammocha; «Bitta qadam» — qadam-baqadam; xato topiladi va tuzatiladi; «▶ Ishga tushir» — «Yetib bordi!».
  3. Ikki-uch bola. ★ ni hech kim bajarmagan bo'lsa — ustoz tayyor topishmoq bilan (`repeat 2` ichida `move up`, `repeat 3` ichida `move right`) bir marta ko'rsatadi.
- **Tayanch gaplar:**
  1. «Kim topishmog‘ini o‘qib beradi? Blokma-blok, yuqoridan pastga.»
  2. «Kuzating: qahramon qayerda to‘xtadi va qayerga borishi kerak edi?»
- **O'z so'zi bilan:** topishmoq egasini maqtaydi; har topishmoqda xato boshqa joyda — usul esa bir xil: ishga tushiramiz, qadam-baqadam yuramiz.
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, ishga tushiradi, «Bitta qadam» bilan yuradi, tuzatadi.
- **Parta:** o'z oxirgi yechgan pog'onasi; shu ekranda qayta ishga tushirsa natija qayta sanalmaydi.
- **Bola qiladi:** topishmog'ini o'qiydi yoki do'stinikini kuzatadi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:59–1:02 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz xatolarni topdingiz!». Bugungi qoida (so'z o'rnida): «Xato — topiladigan narsa». Ostida to'rt kichik belgi: «Ishga tushiring · Qadam-baqadam yuring · Tuzating · Yana sinang». Pastda: ✓ To'xtagan joy · ✓ Bitta qadam · ✓ Yashirin xato. Kichik karta «Keyingi dars · 15 · Xakaton №1».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: to‘xtagan joy, bitta qadam, yashirin xato.»
  2. «Xato — topiladigan narsa: ishga tushiring, qadam-baqadam yuring, tuzating, yana sinang.»
  3. «Keyingi darsda do‘stingiz bilan juftlikda kichik o‘yin yasaysiz — xakaton.»
- **O'z so'zi bilan:** qoidani bolalardan aytdiradi («Xato to‘xtatmasa nima qilamiz?»); xakatonda ham xato chiqadi — bugungi usul o'sha yerda kerak; qiyin pog'onalar solo'da — uyda — qayta ochilishini aytadi.
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz xatolarni topdingiz!». Coddy o'rniga qahramon: «Xatolarni qadam-baqadam topib tuzatdingiz.» «Siz bugun»: N ta xato tuzatdi · N marta «Bitta qadam» bosdi · N pog‘ona bajardi (haqiqiy son; **KOD**). O'z qahramoni oxirgi yechgan pog'onasida, oltin izi bilan; «Keyingi darsda xakatonda ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:02–1:05 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta xato tuzatdi · N marta «Bitta qadam» bosdi · N pog‘ona bajardi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda xakaton!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Dasturchilar ham har kuni xato topib tuzatadi. Bugun siz ham shunday qildingiz.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–13-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»; C da ham — dvigatel «Bitta qadam»ni o'zi besh marta bosadi, jonli darsdagidek); natija kartaning o'zida.
- 5-, 7-qadam: «Keyingi»ni bola o'zi bosadi (qatorlar birma-bir yonadi).
- 10-qadam: dastur tayyor; bola o'zi «▶ Ishga tushir» va «Bitta qadam»ni bosadi, joy almashtirishni ham o'zi qiladi (ishora: «move right va move up ni bosing — joyi almashadi»).
- 14-qadam: dastur tayyor; bola uch marta ishga tushiradi (tanlov jonli darsdagidek: 4, 2, 7), sonni o'zi o'zgartiradi (ishora: «7 ni 6 ga o‘zgartiring»).
- «Maslahat» solo'da ham bir urinishdan keyin ochiladi.
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi. Jonli darsda ulgurilmagan pog'onalar shu yerda qayta ochiladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-014-xatoni-topish-v1`, kalit `jr014` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Tuzatuvchi» (`tuzatuvchi`) — 1–3-bekatning 1–3-pog'onalaridan kamida 5 tasi bajarildi (dasturdagi «5 ta dastur»; yutuqning yangi turi — son bo'yicha, **KOD** kichik); «Topishmoqchi» (`topishmoqchi`) — 15 · ★ bajarildi.
- **Mentor uchun** (6-dars KOD 3 kabi, **KOD**): har bola, har pog'ona (12 ta) — bajardi / bajarmadi · «Maslahat»ni ochdimi · necha marta ishga tushirdi · «Bitta qadam»ni ishlatdimi (3-bekatning 1–3-pog'onalarida — «—», tugma yo'q); «tuzatilgan dasturlar: N / 9». Faqat LMS natijasida, proyektorga chiqmaydi (12-bo'lim 2-band).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- **Bu — amaliyot darsi: yangi blok yo'q, siz xatoni tuzatib bermaysiz.** 10- va 14-qadamda faqat usulni ko'rsatasiz («Bitta qadam», ko'p marta sinash) — bolalarning pog'onalari boshqa maydonda, boshqa xato bilan.
- Darsda savol bitta — boshidagi huk. Mashq paytida xatoni aytmang: «Qahramon qayerda to‘xtadi? Qayerga borishi kerak edi? Nechanchi qadamda chiqdi?» — shu savollar bilan o'zi topsin.
- Bugungi asosiy fikr bitta: **xato — topiladigan narsa: ishga tushiring, qadam-baqadam yuring, tuzating, yana sinang.** Hukda, xulosada (12) va yakunda chiqadi.
- «Xato qildingiz» demang — «dasturda xato bor, uni topamiz». Muammocha chiqsa — maqtang: u iz beradi.
- **Bugungi to'qqiz xato** (faqat siz uchun — bolaga turi aytilmaydi; pog'ona nomi rasm yoki maydon nomi):

| Pog'ona | Xato | Qayerda ko'rinadi | Ko'p bola tursa — siz nima qilasiz |
|---|---|---|---|
| 8 · 1 «Burilish» | yo'nalish (`move left` o'rniga `move right`) | 2-blokda darrov to'xtaydi | «Yulduz qaysi tomonda?»; `repeat` ni bosib, ichiga javondan blok qo'shishni eslating |
| 8 · 2 «Pastga» | takrorlash soni (5 o'rniga 3) | yulduzdan keyin chetda | «Yulduzgacha nechta katak?» |
| 8 · 3 «Qator» | `go to` soni (X 5 o'rniga 6) | oxirida: Kamvoy «Olma qoldi-ku!» (yulduzdan ham o'tib ketdi) | «Eng o‘ngdagi olmaning X i nechchi?» |
| 11 · 1 «Ilmoq» | ortiqcha `move up` | 3-qadamda rasmdan chiqadi | «Rasmda tepaga nechta katak? Dasturda nechta?» |
| 11 · 2 «Ilon» | yetishmaydigan `move down` | 4-qadamda | javondan qo'shilgan blok oxiriga tushishini va joy almashtirishni eslating |
| 11 · 3 «Darvoza» | tartib (ikki `repeat`) | 5-qadamda; oldin iz ustidan qaytadi | «Tepaga chiqqach — qaysi tomonga?» |
| 15 · 1 «Ikki labirint» | shart tomoni (`if path ↓` o'rniga `↑`) | faqat 2-labirintda | 8-darsdagi «har qadamdan oldin tekshiradi»ni eslating |
| 15 · 2 «Olma terish» | hodisa tugmasi (ikkinchi `↑` — `↓` bo'lishi kerak) | faqat ↑ va ↓ bosilganda | «Har strelkani bittadan bosib ko‘ring» |
| 15 · 3 «Savatlar» | random sonlari (1 o'rniga 0) | olma (0, 2) ga hech qachon tushmaydi — faqat muammocha aytadi | «Chap chetdagi savatning X i nechchi?» |

  12-qadamda shu jadval bo'yicha bitta qiyin pog'onani sinf bilan qadam-baqadam o'qing (xatoni aytmang). Ismli ro'yxat darsdan keyin LMS natijasida.
- 16-qadamda topishmoqni sinfdan topishni so'ramang — o'zingiz «Bitta qadam» bilan yuring, sinf kuzatadi. Bolaning ismi proyektorga chiqmaydi.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

Bu darsda yangilari: «Bitta qadam» (1), rasmdan chiqish (2), pog'ona javoni (3), topishmoq tekshiruvi (4), natija hisoblagichlari (6), ichki joy almashtirish (10), 15 · 2 ishora bayrog'i (11), savat tahlili kech (12); qolgani — tekshirish.

1. **«Bitta qadam» tugmasi** (studiya; `ijroTartibi` generatori `KUT` o'rniga bosishni kutadi): «▶ Ishga tushir» yonida, oq tugma coral hoshiya bilan; har bosishda qahramon bitta qadam yuradi (`move` yoki `go to`); `repeat` sarlavhasi va `if` tekshiruvi alohida bosish emas — o'sha bosishda ko'rinadi (`repeat` yonida sanoq, `if` yonida «✓ ha» / «✕ yo‘q»; «✕ yo‘q» bo'lsa — bosish keyingi harakat blokigacha yuradi); bajarilgan blok yonib qoladi; tugma ostida «N-qadam» — qahramon qadamlari; to'xtagandan (rasmdan chiqdi, chet) keyingi bosish — boshidan; «▶ Ishga tushir» — qolganini odatdagi tezlikda; dastur o'zgarsa — boshidan; bosish «Maslahat» uchun urinish hisoblanadi; 1–2-bekat va 3 · ★ da bor, 3-bekatning 1–3-pog'onalarida (ikki labirint, o'yin, savatlar) yo'q. Huk (3-qadam) C kartasida dvigatel o'zi besh marta bosadi (9-dars «O‘ynab ko‘rsat» kabi), 5-qadamda to'xtaydi. Keyingi darslarda ham qoladi («Savollar» 2). Natijaga: bosishlar soni.
2. **Qadamda rasmdan chiqish** (qadam rejimi; rasm kataklari sahnadan olinadi — `bosh.kulrang` yo'q): qahramon kulrang bo'lmagan katakka yurgan qadamda ijro to'xtaydi, blok yonida belgi (urildi belgisidek), Ortiqvoy «Rasmdan chiqdi!», ishora «N-qadam: qahramon (x, y) ga chiqdi. Shu blokni va undan oldingisini o‘qing». Oddiy ishga tushirishda — 5-darsdagidek (oxirida, ishora «… Bitta qadam bilan yuring»).
3. **Pog'onaning o'z javoni** (`studiya[id].javon`, dars javonidan ustun) — yangi: har pog'onaning o'z javoni; va bir darsda uch sahna turi (maydon, ikki labirint, o'yin, savatlar).
4. **Topishmoq tekshiruvi** (`bosh.topishmoq: true`, 15 · ★): dastur ishlamaydi va **bitta o'zgartirish** bilan ishlaydi — dvigatel o'zi qidiradi: har blok uchun yo'nalish (to'rt `move`), son (`repeat` 2–10, `go to` X 0–6, Y 0–4), o'chirish, har o'ringa `move` qo'shish, bir daraja ichida joy almashtirish; 12 blokgacha bu bir necha yuz sinov (ko'zga sezilmaydi; simulyatsiya — `sinov/dvigatel/xato.mjs` dagi `tahrirlar`); kamida 3 ta blok. Bola ishga tushirganda aynan bitta xato bo'lsa — odatdagi muammocha chiqmaydi: «Topishmoq tayyor!» va konfeti; boshqa holatlar — «Yordam va xato» jadvalidagi gaplar. Topishmoq 16-qadam uchun saqlanadi (A·1, `'oxirgi'`).
5. *(tekshirish)* 8-dars ikki labirinti, 4-dars o'yini va 13-dars savatlari — tayyor bo'lgach shu darsda `prog: 'qoldir'` bilan ishlaydi; 15 · 2 da tayyor dasturcha `when ↑ key pressed` ikki marta (ikkalasi ishlaydi — 4-dars qoidasi; ishorasi bu pog'onada yashiriladi — KOD 11).
6. **Natija va yutuqlar** — `DARS.natija`: «ta xato tuzatdi» (1–3-bekat 1–3-pog'onalari — ekran ro'yxati, 2-dars shakli), «marta «Bitta qadam» bosdi», «pog‘ona bajardi»; yutuqlar `tuzatuvchi` (yangi tur — bajarilgan pog'onalar soni ≥ 5), `topishmoqchi`; mentor natijasi (6-dars KOD 3 + «Bitta qadam»).
7. **Simulyatsiya sinovi** `sinov/dvigatel/xato.mjs` — jadvaldagi har tayyor dastur (nima bo'ladi, qayerda to'xtaydi), «Bitta qadam» chiqish qadami, tahrir qidiruvi (bitta o'zgartirish bilan ishlaydiganlar ro'yxati jadvaldagidek), topishmoq namunalari.
8. *(tekshirish)* Kechiktirilgan «Maslahat» (6-dars KOD 1) — o'zgarishsiz.
9. *(tekshirish)* Tuzatish yo'llari: dasturdagi `repeat` bosilib tanlansa — javondan bosilgan blok uning ichiga tushadi (5-dars; 8 · 1, 8 · ★ da kerak); javondan qo'shilgan blok — dastur oxiriga, keyin joy almashtirish (95-qaror; 11 · 2); hodisa blokidagi tugmani almashtirish (4-dars; 15 · 2); `if` tomoni (8-dars; 15 · 1); random sonlari (13-dars; 15 · 3, 14).
10. **Bir ota ichida joy almashtirish** (yangi): bir `repeat` ichidagi ikki blokni bosib, joyini almashtirish (10-qadam: `repeat 3` ichida `move up` va `move right`). 10-qadam o'zgarmaydi.
11. **15 · 2 bayroqlari** (yangi): dvigatel «▶ Boshlash»da yozadigan «↑ uchun ikkita dasturcha bor — ikkalasi ham ishlaydi» ishorasi bu pog'onada ko'rsatilmaydi; tekshiruv — o'yin yutildi va har strelka o'z tomoniga yuradi (birinchi `when ↑` ni ↓ ga almashtirib yutish qabul qilinmaydi — Kamvoy «Oz qoldi!», ishora «Har strelkani bosib ko‘ring: qaysi biri boshqa tomonga yuryapti?»).
12. **Savat tahlili kech** (yangi, bayroq; 14-qadam va 15 · 3): dvigatel savatlarni birinchi ishga tushirishdayoq sanab aytadi — bu darsda sanab topiladigan muammocha («Bu savat bo‘sh qoladi!», «Savat yo‘q-ku!» — tanlanmagan son uchun) faqat «Sinov: 3 / 3» dan keyin chiqadi; ishga tushirishda ko'ringani (olma maydon chetida — Kamvoy «Maydon tugadi!», olma savat yo'q katakka tushdi — Ortiqvoy «Savat yo‘q-ku!») — darhol.

## Savollar (tavsiya — A)

1. **Qabul: A (21.11).** **Dasturdagi «5 ta dastur» — A: 9 ta asosiy pog'ona (har biri — bitta xatoli dastur, 9 xil xato) + 3 ★; dastur natijasi — kamida 5 tasi tuzatildi** («Tuzatuvchi» yutug'i va mentor jadvali). Sabab: amaliyot qolipi (6-dars: uch bekat × to'rt pog'ona) saqlanadi; 9 yoshli 5 tasiga, 13 yoshli 12 tasiga yetadi (12-bo'lim 6-band). **B** — aynan 5 ta dastur (1-bekat 2, 2-bekat 2, 3-bekat 1 pog'ona + ★ lar) — mashq kam, tez bola 30-daqiqada tugatadi.
2. **Qabul: A (21.11).** **«Bitta qadam» tugmasi — A: ha, studiyada «▶ Ishga tushir» yonida, keyingi darslarda ham qoladi** (KOD 1–2). Qadam rejimida qahramon rasmdan chiqqan qadamda to'xtaydi. Sabab: dasturdagi ko'nikma — «qadam-baqadam tekshirish» — o'z tugmasisiz faqat gap bo'lib qoladi; 1-darsdan «Bitta buyruq — bitta qadam» qoidasi bor. **B** — yangi tugma yo'q, sekin ijro (2 barobar sekin) — kod kam, lekin bola qaysi qadamda to'xtashni o'zi tanlay olmaydi. **C** — oddiy ishga tushirishda ham rasmdan chiqqan blok belgilanadi — topish juda oson bo'ladi, 2-bekat ma'nosini yo'qotadi.
3. **A (21.11).** **Huk — A: «Xatoni qanday topamiz?» — uch usul** (oxirgi blok · har xil o'zgartirish · qadam-baqadam), har biri sinab ko'riladi (12-bo'lim 25-band: «qanday qilamiz?»). **B** — «Qaysi blok xato?» — uch blokdan birini tanlash: bu usul emas, taxmin; bola bugun nima o'rganishini ko'rmaydi.
4. **A (21.11).** **Bekatlar — A: usul bo'yicha — «To‘xtagan joy · Bitta qadam · Yashirin xato»** (har bekat — xatoni topishning bir yo'li). **B** — mavzu bo'yicha («Harakat · Takrorlash · Shart va o‘yin»; 6-darsga yaqin) — «qadam-baqadam» bekat bo'lib ko'rinmaydi, xato turlari bekatlarga tarqab ketadi.
5. **Qabul: A (21.11).** **3-bekatda uch xil sahna (ikki labirint, o'yin, savatlar) — A** («yashirin xato» uch xil ko'rinishda; 8-, 4-, 13-dars qismlari tayyor bo'lsa — yangi KOD yo'q). **B** — hammasi ikki labirintda: dvigatel sodda, lekin 8-dars 3-bekatini takrorlaydi va 13-darsdagi tasodif tekshirilmaydi.
6. **Qabul: A (21.11).** **Erkin ijod — A: 3-bekat ★ «Topishmoq»** — bola bitta xatoli dastur tuzadi, 16-qadamda ustoz uni sinf oldida qadam-baqadam topadi (KOD 4). Sabab: xatoni ataylab qo'ygan bola uni boshqa tomondan ko'radi; 'xatodan qo'rqmaslik' (dasturdagi «nega») — xato o'yinga aylanadi. **B** — ★ yopiq masala (97-qaror istisnosi; 16-qadamda oxirgi pog'ona o'qiladi).
7. **A (21.11).** **Xato turi bolaga aytiladimi — A: yo'q** (pog'ona nomi — rasm yoki maydon nomi; tur — faqat ustoz varag'ida). Sabab: tur aytilsa — topishning o'zi qoladi (3–5-dars auditidagi «nom javobni ochmasin» qoidasi). **B** — yakunda «bugun 9 xil xato» kartasi (bola o'z yutug'ini ko'radi, lekin 17-qadam uzayadi).
8. **A (21.11).** **Tuzatish yo'llari — A: faqat bor yo'llar** (son va tomon ro'yxati, «✕», joy almashtirish, tanlangan `repeat` ichiga qo'shish). Huk va ustoz ko'rsatuvlarida tuzatish — son va joy almashtirish (blok almashtirish ko'rsatilmaydi). **B** — yangi qoida: dasturdagi blok tanlangan paytda javondan blok bosilsa — o'rniga tushadi (KOD; 8 · 1 va 8 · ★ bitta harakatga qisqaradi, lekin 5-darsdagi «tanlangan repeat — ichiga» bilan ziddiyat).
9. **A (21.11).** **Amaliyot qolipi — A: 6-dars qolipi o'zgarishsiz** (huk → eslaymiz → reja → qoida → uch bekat → xulosa → o'qib berish → yakun); 6-dars «Savollar» 9-B dagi «ikki amaliyot solishtirilgach» — shu dars bilan solishtiriladi: farq faqat eslaymiz (bloklar o'rniga muammochalar) va bekatlar (topshiriq turlari o'rniga usullar).
10. **A (21.11).** **Manba v1 tasdig'i.**
11. **3-bekatda «Bitta qadam» — A: yo'q (tavsiya)** — 1–3-pog'onalarda (ikki labirint, o'yin, savatlar) usul 'hamma holatni sinash'; tugma 1–2-bekat va 3 · ★ da. **B** — bor. **Qabul: A (21.11, foydalanuvchi).**
12. **Topishmoqni kim topadi — A: ustoz, sinf kuzatadi (tavsiya)** (16-qadam; 59-qaror — sinfdan taxmin so'ralmaydi). **B** — yonidagi do'st. **Qabul: A (21.11, foydalanuvchi).**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi natija 11–12-daqiqada (8 · 1: ishga tushirish, `repeat` ni tanlab ichiga `move right` qo'shish, `move left` ni «✕», yana ishga tushirish — 4 harakat); huk sinovi uzaysa — 5-qadamni qisqartirish kerak.
2. «Bitta qadam» 9 yoshli uchun: 11 · ★ da 12 qadam — ko'p bosish zeriktiradimi; bola «▶ Ishga tushir» bilan aralashtiradimi.
3. 8 · 1 va 8 · ★ — yo'nalishni almashtirish uchun mavjud `repeat` ni tanlab, javondan blokni uning ichiga qo'shish (5-dars) va eskisini «✕» — dvigatelda mavjud `repeat` bosilganda ham «ichiga» tushadimi (KOD 9; yo'q bo'lsa — kichik qo'shimcha).
4. 11 · 2 — javondan qo'shilgan `move down` dastur oxiriga tushadi, keyin 4-blok bilan joy almashtiriladi: bola shu ikki harakatni topadimi (maslahat sanashga yo'naltiradi, harakatni aytmaydi).
5. 15 · 1 ning tuzatilgan dasturi (R6[if→[→], if↑[↑]]) — 8-dars 10-qadamdagi ustoz dasturi bilan bir xil (labirintlar boshqa). Ikki shartli juftliklarning to'rttasi ham 8-darsda ishlatilgan — boshqa yo'l yo'q.
6. 15 · 2: ↑ bosilganda ikki dasturcha ketma-ket ishlaydi — qahramon tepaga chiqib qaytadi; tez bo'lsa, bola «qimirlamadi» deb o'ylashi mumkin — ko'rinish qurishda tekshiriladi.
7. 15 · 3 va 14 — 13-dars manbasiga bog'liq (savatlar, «random sonlarining hamma qiymatini sanash», «Sinov: 3 / 3»); 13-dars manbasi tasdiqlanmagan — u yerda 5-savol B tanlansa, 15 · 3 boshqa xato bilan almashtiriladi (masalan, maydondan chiqish).
8. 15 · ★ «Topishmoq»: ishlaydigan dasturni ataylab buzish 9 yoshli uchun tushunarlimi; 'bitta o'zgartirish' qoidasi muammocha gaplari bilan yetadimi. 3 dan kam blokli «topishmoq» (masalan, bitta `go to`) — taqiqlangan.
9. 16-qadam — ustoz sinfga savol bermaydi, o'zi qadam-baqadam yuradi (59-qaror chegarasida, 6-dars «Tekshirilmagan joylar» 8 kabi).
10. Xato variantlarining izi bezak ustidan o'tadi (huk (2, 3) gul, (4, 3) daraxt; 11 · 1 (2, 3) gul) — bezak to'siq emas, lekin rasmda iz gul ustida ko'rinadimi.
11. 1-qadamdagi «O‘tgan darsda» kartasi — 13-dars manbasidan (`random 1 to 6` — «Tasodifiy son — Dastur o‘zi tanlaydigan son»); 13-dars yakunidagi «Keyingi dars · 14 · Xatoni topish» bilan nom bir xil. 15-dars (Xakaton №1) manbasi yo'q — «Keyingi dars · 15 · Xakaton №1» nomi DASTUR'dan.
12. 18-qadamda sinf jami — 64-qaror bilan ziddiyat (6-dars «Filtr qarorlari» 4) — 1–13-darsdagidek qoldirildi.
13. Simulyatsiya: `sinov/dvigatel/xato.mjs` — mustaqil hisob (68 tekshiruv, 21.11).
14. Ruscha matn hali yo'q.

## Qurishdagi qarorlar (v1.1, 21.11)

1. **Blok chegarasi** — tayyor yoki to'g'ri dasturning kattasi + 1 (8 · 1 — 5 … 15 · 3 — 3; 15 · ★ — 12, o'zgarmadi); pog'ona tavsifida 'N ta blok' — tayyor dastur, 'chegara M' — alohida; 11 · 2 dagi '6 ta blok' → '5 ta blok, chegara 7'. Sabab: bola avval yangi blokni qo'shib, keyin eskisini «✕» bilan olib tashlay olsin (8 · 3, 11 · 1 ning ikkinchi yo'li ham sig'adi). Oqibati: 'Masalada maqsad'dagi 'chegara tayyor dasturdan oshmaydi' → 'bloklar chegaradan oshmaydi'.
2. **`repeat` soni 2–10** — 11 · 1 dagi '1-`repeat` 2→1' yo'li jadvaldan va simulyatsiya xulosasidan olib tashlandi; qoladi: 3-blokni «✕», ↓ ni 2-o'ringa qo'shish. Sabab: dvigatelda `repeat` 1 yo'q. KOD 4 da 2–10 avvaldan yozilgan edi.
3. **`repeat` ichida joy almashtirish** — KOD 9 (tekshirish) dan yangi KOD 10 ga ('bir ota ichida joy almashtirish'); 'Tuzatish yo'llari'da havola. Sabab: dvigatelda yo'q. 10-qadam o'zgarmadi.
4. **15 · 2 ishorasi** — '↑ uchun ikkita dasturcha bor…' bu pog'onada ko'rsatilmaydi (KOD 11, bayroq); 'Yordam va xato' jadvali ostida eslatma, KOD 5 da havola. Sabab: ishora xatoni ochib qo'yadi.
5. **Huk (2–4-qadam)** — kartalar o'z dasturi bilan o'ynaladi, dastur ustuni o'zgarmaydi; C — dvigatel «Bitta qadam»ni o'zi besh marta bosadi (9-dars «O‘ynab ko‘rsat» kabi); tuzatilgan dastur 4-qadamda (to'liq oltin tepalik); 'Ustoz qiladi' — faqat «Keyingi». Sabab: huk — savol ekrani (9-dars hukidagidek, kartalar o'zi o'ynaladi); tuzatish — javob ekranida.
6. **Javon — har pog'onaning o'zi** (KOD 3 — yangi, 'agar yo'q bo'lsa' emas).
7. **8 · 3 muammochasi** — Kamvoy «Olma qoldi-ku!» (dvigatel avval olmani tekshiradi): jadval, 8-qadam 'Xatoda', ustoz varag'i jadvali.
8. **«Bitta qadam»** — har bosishda qahramon bitta qadam (`move` / `go to`); `repeat` sarlavhasi va `if` tekshiruvi alohida bosish emas; «✕ yo‘q» — keyingi harakatgacha; «N-qadam» — qahramon qadamlari; to'xtagandan keyin — boshidan; bosish — urinish; 3-bekatning 1–3-pog'onalarida yo'q (1–2-bekat va 3 · ★ da bor). 'Maydon, labirint va bloklar' bo'limidagi «Bitta qadam» bandi, KOD 1, 'So'zlar' (tugma ta'rifi), 15-qadam 'Parta'. Oxirgi qism — 'Savollar' 11.
9. **3 · ★ «Topishmoq»** — aynan bitta xato bo'lsa odatdagi muammocha chiqmaydi: «Topishmoq tayyor!» va konfeti (KOD 4, jadval ostida, 15-qadam 'Xatoda').
10. **Eskirgan havolalar** — KOD 4: `sinov/dvigatel/xato.mjs` (`tahrirlar`); 'Tekshirilmagan joylar' 13: scratchpad yo'li o'rniga `sinov/dvigatel/xato.mjs` (68 tekshiruv); KOD 1: `ijroTartibi` generatori; KOD 2: `bosh.kulrang` yo'q, rasm kataklari sahnadan; KOD boshi va sarlavha izohi: yangilari ro'yxati (1, 2, 3, 4, 6, 10, 11, 12).
11. **Savatlar (14-qadam, 15 · 3)** — sanab topiladigan muammocha faqat «Sinov: 3 / 3» dan keyin (KOD 12, bayroq); ko'ringani — darhol. 14-qadam: «4» — muammochasiz, «2» — savatga, «7» — Kamvoy «Maydon tugadi!»; Ortiqvoy «Savat yo‘q-ku!» ('random 7 ni ham…') olib tashlandi.
12. **15 · 2 tekshiruvi** — yutildi va har strelka o'z tomoniga (birinchi `when ↑` → ↓ qabul qilinmaydi — Kamvoy «Oz qoldi!», yangi jadval qatori); jadvaldagi tuzatish — 'ikkinchi `when ↑` tugmasini ↓ ga'.
13. **Topishmoqni ustoz topadi** (16-qadam) — 15 · ★ ostidagi gap, 15-qadam 2-tayanch gapi, reja kartasi, 'Bola nima qiladi', 'So'zlar', 15-qadam 'O'z so'zi bilan' — 'do'st' o'rniga ustoz. 'Savollar' 12.
14. **5-qadam** — Kamvoy «Yetmadi, qoldi yoki maydon tugadi»; 2-tayanch gap — «Muammocha gapini o‘qing — u qayerga qarashni aytadi.»
15. **'Bola nima qiladi'** — 'zinapoya' → 'tepalik' (huk rasmi nomi).
16. **14-qadam sarlavhasi** — «Ko‘p marta sinaymiz» (qadam nomi 'Ko'ramiz: ko'p marta sinaymiz' avvaldan shunday).
17. **4-qadam** — sarlavha va qadam nomi «Qadam-baqadam yuramiz» (huk C kartasi bilan bir so'z).
18. **3-qadam tayanch gapi** — «Har xil o‘zgartirsak — battar.» (B kartasi nomi bilan bir so'z; 'tavakkal' ketdi).
19. **2-qadam Parta Coddy** — «Xatoni qaysi usul bilan topamiz?» ('usul' — huk so'zi: uch karta — uch usul).
20. **16-qadam tayanch gapi** — «Kuzating: qahramon qayerda to‘xtadi va qayerga borishi kerak edi?»
21. **8 · 3 maslahati** — «Qaysi olma qoldi? go to qahramonni qayerga sakratdi?» (muammocha bilan bir xil boshlanadi); ustoz varag'i — «Eng o‘ngdagi olmaning X i nechchi?»
22. **11 · 2 maslahati** — «Qahramon qaysi qadamda rasmdan chiqdi? Rasmda o‘sha joyda qaysi tomonga yurish kerak?» (2-bekat usuli — qadam).
23. **15 · 2 Bo'shvoy ishorasi** — «↓ bosildi — uning dasturchasi yo‘q. Dasturchalarning tugmalarini o‘qing.» (eski gap yechimni aytardi).
24. **15 · ★ 'dastur ishlayapti'** — muammocha emas, ishora («Dastur ishlayapti! Endi bitta blokni o‘zgartiring — topishmoq bo‘lsin.»); jadvalda muammocha '—'.
25. **3-bekat ishora boshi** — pog'onaga qarab (1 · 2 · 3 · ★ — o'z gapi); proyektor sarlavhasi «Hamma holatni sinang!» qoldi.
26. **7-qadam** — 6-darsdagidek uch qator (tugma rasmi + gap, `raqam` ishi): «▶ Ishga tushir» · «Bitta qadam — Har bosishda bitta qadam» · «Maslahat — Bir urinishdan keyin ochiladi»; maydonda Coddy (0, 0), dastur bo'sh (yechimsiz namuna ketdi). Sabab: studiya ichiga hoshiya — yangi dvigatel ishi (6-dars 'Qurishdagi qarorlar' 1).
27. **13-qadam Coddy** — «…bir marta ishlagan dasturda ham xato bo‘lishi mumkin.»
28. **11-qadam 2-tayanch gap** — «Rasmdan chiqqan qadamda dastur to‘xtaydi — shu blokni va undan oldingisini o‘qing.»
29. **10-qadam** — 'birma-bir' → 'qadam-baqadam' (bir ma'noga bitta so'z).
30. **12-qadam 2-tayanch gap** — «Xato — qahramon rasmdan chiqqan joyda yoki undan oldinroq. Tuzatgach — yana ishga tushiramiz.»
31. **15-qadam 1–3-pog'ona yo'rig'i** — doim «Bitta xatoni toping.» (★ — o'z gapi).
32. **17-qadam to'rt belgi** — «Ishga tushiring · Qadam-baqadam yuring · Tuzating · Yana sinang» (darsning yagona fikri bilan aynan).
33. **1-qadam 2-tayanch gap** — «Bugun yangi blok yo‘q. Xatosi bor dasturlarni tuzatasiz.»; 2-qadam Coddy — «…Boshqa rasm chiqdi.»
34. **15-qadam doskasi** — «Har belgi — uch xatoni tuzatgan bitta bola» (8-qadamdagidek; 6-darsda 8- va 15-qadamda bor).
35. **Mayda** — 'Tekshirilmagan joylar' 2: 11 · ★ da 12 qadam (yangi «Bitta qadam» bo'yicha: 3 + 1 + 4 + 1 + 3); birinchi natija — 'bitta tuzatish'; jadvalda «Savat yo‘q-ku!» / «Maydon tugadi!» — ikki qator; ustoz varag'i 15 · 3 — 'olma (0, 2) ga hech qachon tushmaydi — faqat muammocha aytadi'; izoh so'zlari ('noto'g'ri', 'xato qildingiz', 'Ekranlar ko'rinishi' va boshqa bo'lim nomlari, 'xatodan qo'rqmaslik', 'bitta o'zgartirish') — oddiy qo'shtirnoqda (ekran gapi emas).
36. **Bosh seans tuzatishlari (agent topgan ziddiyatlar, 21.11):** «Bitta qadam» yangi ma'nosi bo'yicha — Pasport «har qadamdan keyin», 10-qadam sarlavhasi «Har bosishda bitta qadam», 1-tayanch gapi; «Savollar» 2 — 1-darsdagi aniq gap «Bitta buyruq — bitta qadam»; solo 3-qadam — C da dvigatel o'zi bosadi; mentor jadvalida 3-bekat 1–3-pog'onalari — «—»; 5-qadam 1-tayanch gapi «Muammocha — jazo emas. U yordamchi.» (2-gap bilan takror edi); 15 · ★ maslahati «Bitta blokni o‘zgartiring: yo‘nalishini, sonini yoki o‘rnini» (ostidagi gap bilan takror edi); 15 · 2 maslahati «Har strelka o‘z tomoniga yuryaptimi? Dasturchalarning tugmalarini o‘qing» (tekshiruv gapi bilan bir so'z); 15 · 3 maslahati «random qaysi sonlarni tanlay oladi? Savatlar qaysi X larda?» (ishora boshi bilan takror edi); holat qatori — ochiq savollar 11, 12.
37. **Qurishda (setka, 21.11):** uch sarlavha bir qatorga sig'masdi — 71-qaror bo'yicha qisqardi: 5-qadam «Muammocha — iz» (5-qadam 'O'z so'zi bilan' dagi «har biri iz»), 7-qadam «O‘zingiz topasiz», 12-qadam «Xato — topiladi!» (to'liq qoida «Xato — topiladigan narsa» yakunda va tayanch gaplarda qoladi). Huk maydoni ostidagi xato dastur rasmi olib tashlandi — maydonning pastki qatorini yopardi (99-qaror); dastur o'zgarishi kartalarda ko'rinadi. 5-qadam qatorlari bitta qatorda: «Bo‘shvoy — dastur bo‘sh yoki ichi bo‘sh» kabi.
