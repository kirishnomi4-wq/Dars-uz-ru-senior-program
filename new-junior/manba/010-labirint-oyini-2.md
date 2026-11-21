# 10-dars. Labirint o'yini 2

> **Holat: v1.2 — TASDIQLANDI (21.11 ~00:30, tavsiya bo'yicha: foydalanuvchi «mustaqil … tayyor degan darajaga keltiraylik» — «Qurishdagi qarorlar» 1–13 hammasi A, istalganini keyin o'zgartirsa bo'ladi). QURILDI (2026-11-20 kech; qurishdagi aniqlashtirishlar — oxirida «Qurishdagi qarorlar»). v1.1 — QORALAMA (2026-11-20; tavsiya bo'yicha yozildi — savollar oxirida («Savollar»), har birida tavsiya A; v1.1 — 8-dars manbasiga va 9-dars v1.1 ga moslandi, oxirida «Moslash» bo'limi). Foydalanuvchi tasdig'i kutilmoqda.** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/010-labirint-oyini-2/`) shundan quriladi. Dars 9-dars manbasining (`009-labirint-oyini-1.md`) davomi: o'sha o'yin, o'sha dastur, o'sha maydon; shart bloki — 8-darsdagi `if path → then` (9-darsdagi qoida: har strelka yurishdan oldin tekshiradi — «yo‘l bo‘lsa — yuradi»).
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–9-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 10-dars («Labirint o'yini 2» — natija: 2 darajali tayyor o'yin; o'rganadi: tayyor ishini kengaytirishni o'rganadi; nega: ishni keyingi darsda davom ettirish ko'nikmasi; tekshiruv: chek-list).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Har labirint (huk, ustoz namoyishi, har pog'onaning namunasi) manba yozilganda dastur bilan simulyatsiya qilindi: eng qisqa yo'l, burilishlar, boshi berk yo'llar, eshik yo'lni to'sishi, kalitga yo'l, borib qaytish (natija jadvallarda). Dars qurilganda sinov — `sinov/dvigatel/labirint.mjs` ga 10-dars qismi (**KOD**).
> **97-qarorning va'dasi shu darsda bajariladi:** «o'z labirintini yasash — 9–10-darsdagi «Labirint o'yini»da». Bola o'yiniga ikkinchi darajani o'zi yasaydi (labirint yasash — dvigatelga yangi ish, **KOD**: kataklarni bosib devor qo'yish va olish) va do'stiga o'ynatadi.

## Pasport

- **Dars turi:** loyiha (blokli), 9-darsning davomi. Yangi blok yo'q; yangi ish — labirint yasash (**KOD**); yangi so'z bitta — «daraja».
- **Natija (dasturdan):** 2 darajali tayyor o'yin. **Bu manbada:** 1-daraja — 9-darsdagi labirint (D1), 2-daraja — bolaning o'zi yasagan labirinti (devorlar, kalit, eshik, yulduz); ikkalasi bitta dastur bilan o'ynaladi: «▶ Boshlash» — 1-daraja, yutsa — 2-daraja ochiladi. Oxirida o'yinni yoningizdagi do'stingiz o'ynaydi.
- **Bola nimani tushunadi:** tayyor ishini buzmasdan kengaytirish mumkin — o'yin dasturi (boshqaruv va qoida) o'zgarmaydi, unga yangi labirint qo'shiladi. Har labirint — o'yinning bitta **darajasi**; biri yutilsa, keyingisi ochiladi. Labirint yasaganda yulduzga yo'l qolishi kerak — aks holda o'yinni hech kim yuta olmaydi; yasagan labirintini avval o'zi o'ynab ko'radi. Qiyin labirint — uzun yo'l, ko'p burilish, boshi berk yo'llar, chetdagi kalit; qiyinligini son bilan o'lchash mumkin (kompyuter yo'lni o'zi sanaydi).
- **Tekshiruv (dasturdan):** chek-list (avto) — «O‘yiningizda:» ro'yxati, besh band: «To‘rt strelka» · «Qoida» · «2-daraja: kalit va eshik» · «Ikki daraja yutildi» · «Do‘stingiz o‘ynadi». Har pog'onada labirint sharti o'zi o'lchanadi (devorlar soni, yo'l uzunligi, burilishlar, boshi berk yo'llar, eshik, kalit). Chek-list LMS natijasiga ham boradi (mentor ko'radi; **KOD**, modul tugagach).
- **Vaqt:** reja 64 daqiqa, zaxira 16–26 daqiqa (dars 80–90 daqiqa). Zaxira — 8- va 11-qadamdagi labirint yasashga (bolalar uzoq bezaydi) yoki 16-qadamga.
- **Uch bekat:** 1 · O'z labirintingiz — 2 · Kalit va eshik — 3 · Ikki daraja. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda Coddy (Coddy'ning o'yini); bola ishlaganda o'z qahramoni va o'z o'yini (94-qaror).
- **9-dars bilan bog'lanish:** 9-darsda bola labirint o'yini yasadi (to'rt strelka, har birida qoida «yo‘l bo‘lsa — yuradi», kalit va eshik) va yakunda «Keyingi darsda o‘yiningizga ikkinchi labirint qo‘shasiz — uni o‘zingiz yasaysiz.» degan va'dani eshitdi. Bu dars o'sha o'yin bilan ochiladi (**KOD**: o'yin saqlangan). 9-darsda bo'lmagan bolaga tayyor o'yin ochiladi («Savollar» 4).

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–2 | Kiradi, o'z o'yinini ko'radi (9-darsdagi), «Tayyorman»ni bosadi | 1 |
| 2–7 | Savolga javob beradi: o'yinga ikkinchi labirintni qanday qo'shamiz? Sinf uchalasini sinaydi: yangi o'yinda boshqaruv yo'q, labirintni o'zgartirsa — labirint baribir bitta, ikkinchi labirint qo'shsa — ikkalasi o'sha dastur bilan o'ynaladi | 2–4 |
| 7–8 | Yangi so'z: daraja | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz labirint yasashni ko'rsatadi | 7 |
| 10:30–23 | O'z labirintini yasaydi va o'ynab ko'radi: devorlar → uzun yo'l → burilishlar → ★ boshi berk yo'llar | 8 |
| 23–26 | Ustoz kalit va eshik qo'yishni ko'rsatadi | 9–10 |
| 26–37 | Labirintiga kalit va eshik qo'yadi: eshik yo'lni to'sadi → kalit chetda → ★ uzun daraja | 11 |
| 37–39 | Xulosa: daraja | 12 |
| 39–42 | Ustoz ikki darajali o'yinni boshidan oxirigacha o'ynaydi | 13–14 |
| 42–50 | O'z o'yinini ikkala darajasi bilan yutadi; ★ adashmasdan | 15 |
| 50–58 | Do'stining o'yinini o'ynaydi; o'z joyiga qaytib, do'sti qanday o'ynaganini ko'radi | 16 |
| 58–64 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: kamida 6 ta devor va o'zi o'ynab yutdi) — 12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida; chegarada — «Tekshirilmagan joylar» 2).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| daraja | o'yindagi bitta labirint; biri yutilsa, keyingisi ochiladi | 5 (va 12, 17) | uch bo'lak birma-bir: 1-labirint, ostida «1-daraja» → qahramon yulduzda, yozuv «2-daraja!» → 2-labirint, ostida «2-daraja», tepada «Daraja: 2 / 2» |

Yordamchi so'zlar (ta'rifsiz, tushunarli): labirint yasash, asbob, devor qo'yish, sinab ko'rish, uzun yo'l, burilish, boshi berk yo'l, borib qaytish, do'stingiz, joy almashish. 1–9-darsdan: blok, dastur, dasturcha, qahramon, yulduz, qadam, katak, labirint, devor, urildi, kalit, eshik, start, manzil, X va Y, hodisa, tugma, strelka, shart, tekshiradi, ha, yo'q, qoida, o'yin, yutish, pog'ona.
Bir ma'noga bitta so'z: «daraja» (o'yindagi bitta labirint; «level», «bosqich» deyilmaydi; «pog'ona» — faqat mashq: «Mashq · 1-pog‘ona» — «Savollar» 6); «labirint yasash» (kataklarni bosib devor qo'yish; ekranda «chizish», «muharrir» deyilmaydi); «devor» (asbob nomi ham «Devor»; «buta» deyilmaydi); «yo‘l» (o'lchov qatorida — startdan yulduzgacha eng qisqa yo'l, qadamlarda: «Yo‘l: 14 qadam»); «burilish» (yo'l yo'nalishini o'zgartirgan joy); «boshi berk yo‘l» (yulduzga olib bormaydigan, oxiri devor yo'lak); «sinab ko‘rish» (o'z labirintini o'ynash; «test», «tekshirish» deyilmaydi); «ro‘yxat» («O‘yiningizda:» bandlari; bolaga «chek-list» deyilmaydi); «do‘stingiz» (41-qaror).
Bu darsda AYTILMAYDI (keyingi darslarniki): o'zgaruvchi, ball, jon (11–12-dars), tasodifiy son (13-dars), «level», saqlash fayli.

## Maydon, o'yin va labirint yasash

**Maydon** — 9-darsdagidek: 7 × 5 bog' maydoni, X va Y sonlari, butalar — devor, start doim (0, 0). **O'yin** — 9-darsdagidek (strelka dasturchalari, har birida qoida — `if path … then`; shartsiz `move` devorga urilsa — o'yin to'xtaydi; kalit va eshik, «▶ Boshlash» / «■ To‘xtatish»), endi darajalar bilan (**KOD**): sahna tepasida «Daraja: 1 / 2»; daraja yutilsa — «2-daraja!» (~1,4 soniya, 100-qarordagi pog'ona kabi), keyingi labirint ochiladi, qahramon startda, kalit qo'lda emas; oxirgi daraja yutilsa — «Siz yutdingiz!», konfeti, o'yin to'xtaydi. Shartsiz urilib o'yin to'xtasa — «▶ Boshlash» yana 1-darajadan. Dastur hamma darajada bitta.

**Bolaning o'yini** (**KOD**): dars 9-darsdagi o'yin bilan ochiladi — bolaning dasturchalari va 1-daraja (D1). 9-darsda bo'lmagan yoki o'yini saqlanmagan bolaga — tayyor o'yin: to'rt strelka (har birida qoida) va D1 (kirishda bolaga aytiladi). O'yin dars davomida saqlanadi; 2-daraja — pog'onadan pog'onaga o'sha labirint (bola uni o'zgartirib boradi).

**Labirint yasash** (**KOD**, 8- va 11-qadam; «Savollar» 1): studiyada javon o'rnida «Labirint» asboblari — to'rtta katta tugma: «Devor» (buta rasmi, boshida tanlangan) · «Kalit» · «Eshik» · «Yulduz». Dastur ustunida — bolaning o'yin dasturi (o'zgartirsa bo'ladi). Sahna — 2-daraja; boshida faqat start (0, 0) va yulduz (6, 4).
- Asbobni bosing — u tanlanadi (coral hoshiya, 95-qarordagi tanlash). Katakni bosing: «Devor» bilan — devor qo'yiladi, yana bosilsa — olinadi; «Kalit», «Eshik», «Yulduz» bilan — o'sha narsa shu katakka qo'yiladi (har biri bitta: oldingi joyidan ko'chadi; katakdagi devor olinadi); kalit yoki eshik turgan katakni o'sha asbob bilan yana bosish — olib tashlaydi.
- Start (0, 0) ga hech narsa qo'yilmaydi (ishora «Start — (0, 0). Unga hech narsa qo‘yilmaydi»). Yulduzni olib tashlab bo'lmaydi — faqat ko'chiriladi.
- **O'lchov qatori** sahna ostida — har bosishda o'zi yangilanadi: pog'onaning sharti va hozirgi son («Devor: 4 / 6», «Yo‘l: 10 / 14 qadam», «Burilish: 4 / 5», «Boshi berk yo‘l: 1 / 2», «Kalit ✓ · Eshik ✓», «Borib qaytish: bor»). Yulduzga yo'l yo'q bo'lsa — «Yo‘l yo‘q» va Kamvoy «Yo‘l yo‘q!». Yo'l — kalit va eshik bilan hisoblanadi (kalitsiz eshik — devor).
- Asosiy tugma — «▶ Sinab ko‘rish»: shu darajani o'yin rejimida o'ynash (strelkalar, qoida); «■ To‘xtatish» — yana labirint yasashga. O'ynayotganda asboblar xira.
- **Pog'ona bajarildi:** o'lchov sharti bajarildi va bola shu labirintni o'zi o'ynab yutdi — «Labirint tayyor!» va konfeti; keyingi pog'ona o'zi ochiladi (o'sha labirint bilan).

**O'lchovlar** (dvigatel hisoblaydi; manba simulyatsiyasi ham shunday hisobladi): «yo‘l» — startdan yulduzgacha eng qisqa yo'l (qadamlar; kalit bo'lsa — kalit orqali); «burilish» — eng qisqa yo'llar orasidagi eng kam burilishlar soni; «boshi berk yo‘l» — oxiri: ochiq katak (start, yulduz, kalit emas), atrofidagi to'rt katakdan faqat bittasi ochiq; «eshik yo‘lni to‘sadi» — eshik devor bo'lsa, yulduzga yo'l yo'q; «kalitga yo‘l» — kalitga eshikdan o'tmasdan yetiladi; «borib qaytish» — eng qisqa yo'lda qahramon bir katakdan ikki marta o'tadi.

**Do'st o'ynaydi** (**KOD**, 16-qadam): bola noutbukida «Do‘stingiz o‘ynaydi» tugmasi — o'yin rejimi, faqat sahna va «▶ Boshlash»; dastur ustuni va asboblar yopiq (do'st o'yinni o'zgartirmaydi). Do'st o'ynab bo'lgach (yoki «■ To‘xtatish»), egasi o'z joyiga qaytganda ko'radi: «Do‘stingiz o‘ynadi: 2 / 2 daraja · 3 marta devor oldida to‘xtadi» va 2-darajada do'stining yo'li — oltin iz.

**Bloklar** — 9-darsdagi to'rt oila (Hodisa, Harakat, Shart, Tovush), javonda o'yin rejimidagi ekranlarda (14, 15) va labirint yasashda «Labirint · Bloklar» almashtirgichi orqali (**KOD**). Yangi blok yo'q. Dasturda eng ko'pi 16 ta blok (9-darsdagidek).
**Chek-list** — «O‘yiningizda:» ro'yxati, sahna yonida (9-darsdagidek, **KOD**): «To‘rt strelka» · «Qoida» · «2-daraja: kalit va eshik» (2-darajada eshik yo'lni to'sadi va kalitga yo'l bor) · «Ikki daraja yutildi» (ikkala daraja bitta o'yinda ketma-ket) · «Do‘stingiz o‘ynadi» (do'st kamida 1-darajani o'ynadi — 16-qadam). Dars boshida 9-darsdagi bandlar ✓ bo'lib keladi.

### Labirintlar

Belgilar 9-darsdagidek: `S` — start (0, 0), `★` — yulduz, `#` — devor, `·` — yo'l, `K` — kalit, `E` — eshik; yuqori qator — y = 4. Ustoz labirintlari va huk labirintlari — aynan shunday; bolaning pog'onalari uchun — **namuna** (bitta mumkin bo'lgan labirint: shart bajarilganini va keyingi pog'ona sharti hali bajarilmaganini ko'rsatadi; har bolaniki boshqa bo'ladi, ekranga chiqmaydi).

| Nomi | Xarita (tepadan pastga) | Yulduz · kalit · eshik | Eng qisqa yo'l | O'lchov | Qayerda |
|---|---|---|---|---|---|
| D1 — 1-daraja (9-dars) | `##···#★` · `#K#·##·` · `#·#··E·` · `#·#·###` · `S···###` | ★ (6, 4) · K (1, 3) · E (5, 2) | `→↑↑↑↓↓↓→→↑↑→→→↑↑` (16) | 17 devor, burilish 6, eshik to'sadi, borib qaytish bor | 2–4, 14, 15, 16 |
| D1-B — huk: 1-daraja o'zgartirildi | `##··##★` · `#K#·##·` · `#····E·` · `#·#·###` · `S···###` (D1: (2, 2) dagi devor olindi, (4, 4) ga devor qo'yildi) | ★ (6, 4) · K (1, 3) · E (5, 2) | `→↑↑↑↓→→→→→↑↑` (12) | 17 devor | 3 |
| Z — huk: Coddy'ning 2-labirinti | `····#·★` · `·##·#·#` · `·#··#·#` · `·#·##··` · `S······` | ★ (6, 4) | `→→→→→↑↑↑↑→` (10) | 11 devor, burilish 2 | 3 (A va C) |
| BOSH — 2-daraja boshida | `······★` · `·······` · `·······` · `·······` · `S······` | ★ (6, 4) | `→→→→→→↑↑↑↑` (10) | 0 devor, burilish 1 | 7, 8 · 1 (boshi) |
| U1 — ustoz labirinti | `··#···★` · `·##·#·#` · `····#··` · `·##·##·` · `S······` | ★ (6, 4) | `→→→↑↑↑↑→→→` (10) | 10 devor, burilish 2 | 7, 10 |
| U1-X — ustoz yo'lni yopdi | U1 + (5, 4) ga devor | ★ (6, 4) | yo'q | «Yo‘l yo‘q» | 7 |
| U1-E — eshik keraksiz | U1 + eshik (3, 4) | ★ (6, 4) · E (3, 4) | (6, 0) → (6, 2) → (5, 2) → (5, 4) orqali eshiksiz yo'l bor | eshik to'smaydi — Ortiqvoy «Eshik keraksiz!» | 10 |
| U2 — ustoz: kalit va eshik | `··#··E★` · `·##·#·#` · `K···#··` · `·##·##·` · `S······` | ★ (6, 4) · K (0, 2) · E (5, 4) | `↑↑→→→↑↑→→→` (10) | eshik to'sadi, kalitga yo'l bor | 10, 14 |
| N1 — namuna 8 · 1 | `······★` · `·##·##·` · `·······` · `·#·##·#` · `S······` | ★ (6, 4) | `→→→→→↑↑→↑↑` (10) | **8 devor** (≥ 6 ✓); yo'l 10 (< 14 — 8 · 2 hali emas) | 8 · 1 |
| N2 — namuna 8 · 2 | `······★` · `····###` · `·······` · `######·` · `S······` | ★ (6, 4) | `→→→→→→↑↑←←←↑↑→→→` (16) | **yo'l 16** (≥ 14 ✓); burilish 4 (< 5 — 8 · 3 hali emas) | 8 · 2 |
| N3 — namuna 8 · 3 | `#####·★` · `#···#·#` · `#·#·#·#` · `#·#···#` · `S·#####` | ★ (6, 4) | `→↑↑↑→→↓↓→→↑↑↑→` (14) | **burilish 6** (≥ 5 ✓); boshi berk 0 (< 2 — ★ hali emas) | 8 · 3 |
| NY — namuna 8 · ★ | `·####·★` · `····#·#` · `#·#·#·#` · `#·#····` · `S··###·` (N3 + 5 katak ochildi) | ★ (6, 4) | `→↑↑↑→→↓↓→→↑↑↑→` (14) | **boshi berk 3** — (0, 4), (2, 0), (6, 0) (≥ 2 ✓) | 8 · ★ |
| NK1 — namuna 11 · 1 | `·####E★` · `····#·#` · `#K#·#·#` · `#·#····` · `S··###·` (NY + kalit va eshik) | ★ (6, 4) · K (1, 2) · E (5, 4) | `→↑↑↑→→↓↓→→↑↑↑→` (14) | **eshik to'sadi ✓, kalitga yo'l ✓**; borib qaytish yo'q (11 · 2 hali emas) | 11 · 1 |
| NK2 — namuna 11 · 2 | `K####E★` · `····#·#` · `#·#·#·#` · `#·#····` · `S··###·` (kalit (0, 4) ga — boshi berk yo'lga) | ★ (6, 4) · K (0, 4) · E (5, 4) | `→↑↑↑←↑↓→→→↓↓→→↑↑↑→` (18) | **borib qaytish bor ✓**; yo'l 18 (< 20 — ★ hali emas) | 11 · 2 |
| NKY — namuna 11 · ★ | `·K···E★` · `·#·####` · `·#·····` · `######·` · `S······` (bola labirintni qayta qurdi) | ★ (6, 4) · K (1, 4) · E (5, 4) | `→→→→→→↑↑←←←←↑↑←→→→→→` (20) | **yo'l 20 ✓**, eshik to'sadi, kalitga yo'l, borib qaytish bor | 11 · ★ |

Hamma namunada yo'l bor va eng qisqa yo'l devorga urilmasdan yutiladi (shart bir marta ham «yo‘q» bermaydi). To'liq o'yin (qoida bilan, eng qisqa yo'llar): D1 → U2 — 26 bosish; D1 → NK1 — 30; D1 → NKY — 36; ikkala daraja yutiladi, 0 marta «yo‘q». Har pog'ona namunasi keyingi pog'ona shartini bajarmaydi — ya'ni har pog'onada bola labirintini haqiqatan o'zgartiradi (dastur bilan tekshirilgan).

### Pog'ona shartlari

| Pog'ona | Shart (o'lchov qatorida) | Namuna |
|---|---|---|
| 8 · 1 «Devorlar» | kamida 6 ta devor · yulduzga yo'l bor · o'zi o'ynab yutdi | N1: 8 devor |
| 8 · 2 «Uzun yo‘l» | yo'l kamida 14 qadam · o'zi yutdi | N2: 16 |
| 8 · 3 «Burilishlar» | yo'lda kamida 5 burilish · o'zi yutdi | N3: 6 |
| 8 · ★ «Boshi berk yo‘llar» | kamida 2 ta boshi berk yo'l · o'zi yutdi | NY: 3 |
| 11 · 1 «Kalit va eshik» | eshik yulduzga yo'lni to'sadi · kalitga eshiksiz yetiladi · o'zi yutdi | NK1 |
| 11 · 2 «Kalit chetda» | yuqoridagi + borib qaytish bor · o'zi yutdi | NK2: 18 qadam |
| 11 · ★ «Uzun daraja» | yuqoridagi (11 · 1) + yo'l kamida 20 qadam · o'zi yutdi | NKY: 20 |
| 15 · 1 «Ikki daraja» | «▶ Boshlash» bilan ikkala daraja ketma-ket yutildi · ro'yxatda to'rt band ✓ | D1 → bolaning 2-darajasi |
| 15 · ★ «Adashmasdan» | ikkala daraja yutildi, shart bir marta ham «yo‘q» bermadi (devor tomonga bosilmadi) | eng qisqa yo'llar bilan — 0 marta «yo‘q» |

Har pog'onada faqat o'z sharti so'raladi (oldingi pog'ona shartini buzsa ham — masalan devorni olib tashlasa — qabul qilinadi; yo'l bo'lishi doim shart).

## Yordam va xato

1–9-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi; labirint yoki dastur o'zgarsa — ketadi. Bolaga «noto'g'ri», «xato qildingiz» deyilmaydi. **Maslahat yo'nalish beradi, javobni aytmaydi** (qaror A-2): qayerga qarash kerakligi, tayyor labirint emas. Labirint yasashda yagona javob yo'q — har bolaniki boshqa.

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Kamvoy | labirint yasashda yulduzga yo'l yo'q (o'lchovda «Yo‘l yo‘q»; «▶ Sinab ko‘rish» bosilsa ham) | «Yo‘l yo‘q!» | «Yulduzga yo‘l yo‘q. Qaysi devorni olib tashlaysiz?» (**KOD**) |
| Kamvoy | o'zi yutdi, lekin pog'ona sharti bajarilmagan | «Oz qoldi!» | «Yo‘l: 12 qadam. Kerak: kamida 14» (pog'onaning o'lchovi, haqiqiy son bilan; **KOD**) |
| — | shart bajarildi, lekin hali o'ynab ko'rilmagan — faqat ishora | — | «Labirint tayyor. Endi o‘zingiz o‘ynab ko‘ring — «Sinab ko‘rish»» |
| — | start bosildi — faqat ishora | — | «Start — (0, 0). Unga hech narsa qo‘yilmaydi» |
| Kamvoy | 2-darajada eshik bor, kalit yo'q yoki kalitga eshikdan o'tmasdan yetib bo'lmaydi | «Kalit qani?» | «Kalitga eshikdan o‘tmasdan yetib bo‘ladigan joy toping» (**KOD**) |
| Ortiqvoy | eshik yo'lni to'smaydi — yulduzga eshiksiz ham boriladi | «Eshik keraksiz!» | «Yulduzga eshikdan o‘tmay ham boriladi. Eshik yo‘lni to‘ssin» (**KOD**) |
| Bo'shvoy | o'yinda strelka bosildi, uning dasturchasi yo'q (9-darsdagi dasturda yo'q bo'lsa) | «Bu tugma uchun dasturcha yo‘q-ku…» | «↓ tugmasi uchun when ↓ key pressed bloki kerak» (bosilgan tugma bilan) |
| To'siqvoy | o'yinda shartsiz `move` devorga urildi — o'yin to'xtadi (9-darsda qoida qo'shilmagan strelka) | «Devor!» | «Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring» (8-dars gapi) |
| Kamvoy | kalitsiz eshik: shart «yo‘q» berdi (o'yin to'xtamaydi) yoki shartsiz `move` eshikka urildi (o'yin to'xtadi) | «Kalit qani?» | «Eshik yopiq. Avval kalitni oling» |
| — | 15 · ★: shart «yo‘q» berdi (devor tomonga bosildi) — faqat ishora | — | «Devor tomonga bosildi. Qaytadan — «▶ Boshlash»» |
| Kamvoy | 15 · 1: ikkala daraja yutildi, ro'yxatda bo'sh band bor | «Oz qoldi!» | «Ro‘yxatda bo‘sh band bor: Qoida» (birinchi bo'sh band nomi bilan) |

Muammocha qahramonni va bola bosayotgan katakni yopmaydi (91-qaror; labirintda — buta burchagida, 2b-A).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:02 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «10-dars · Labirint o‘yini 2», sarlavha «Bugun o‘yiningizni davom ettiramiz!». Coddy: «Salom! O‘tgan darsdagi o‘yiningiz saqlangan. Bugun uni kattalashtiramiz.» O'ngda Coddy'ning o'yini — labirint D1. Pastda kichik karta «O‘tgan darsda»: `when → key pressed` → `if path → then` → `move right` — «Qoida — O‘yinda nima bo‘lishini aytadigan shart». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda labirint o‘yini yasadik: strelkalar, qoida, kalit.»
  2. «Bugun o‘sha o‘yinni davom ettiramiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; o'tgan darsdagi o'yinni eslatadi (qoida nima qilardi?); haqiqiy dasturchilar ham o'yinni bir kunda emas, bo'lib-bo'lib yasaydi — tayyor ish ustiga qo'shib boradi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «10-dars · Labirint o‘yini 2», «Salom, Aziz!»; ostida kichik karta «O‘yiningiz ochildi: 1 ta labirint» (9-darsdagi o'yin bo'lmasa — «Tayyor o‘yin ochildi: to‘rt strelka, qoida va labirint»; **KOD**); tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: ikkinchi labirintni qanday qo'shamiz?

- **Vaqt:** 0:02–0:03:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Avval dalil: bitta labirintli o'yin tez tugaydi. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol». Coddy'ning o'yini (D1, to'rt strelka va qoida). Ustoz «▶ Boshlash» — dvigatel yo'lni o'zi o'ynaydi (16 bosish), Coddy yulduzda — «Siz yutdingiz!», o'yin tugadi (**KOD**: huk — avto o'yin).
  2. Sarlavha «Ikkinchi labirintni qanday qo‘shamiz?» (ikki qator; v1.2 — «Qurishdagi qarorlar» 13). Coddy: «Bitta labirint tez tugadi. Yana bittasi kerak.» Chapda uchta karta: A «Yangi o‘yin ochamiz» (bo'sh studiya rasmi) · B «Labirintni o‘zgartiramiz» (labirint va devor qo'yayotgan qo'l) · C «Ikkinchi labirint qo‘shamiz» (ikki labirint, orasida strelka). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «O‘yin bitta labirint bilan tez tugadi. Unga ikkinchi labirint kerak.»
  2. «Qanday qo‘shamiz? Har kim bitta kartani tanlasin.»
- **O'z so'zi bilan:** kartalarni o'qiydi; sinf javoblarini o'qiydi («ko‘pchilik B ni tanladi — tekshiramiz»).
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi yo‘l bilan o‘yin uzunroq bo‘ladi?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:06 (2,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A: yangi o'yin ochiladi — labirint Z, dastur bo'sh. «▶ Boshlash», ustoz → ni bosadi — Coddy qimirlamaydi, Bo'shvoy «Men nimani kutaman?». Kartada: «✕ boshqaruv va qoida yo‘q».
  2. «Keyingi» — B: Coddy'ning labirinti o'zgaradi (D1 → D1-B: bitta devor olinadi, bittasi qo'yiladi); «▶ Boshlash» — dvigatel o'ynaydi, Coddy yutadi; sahna tepasida «Daraja: 1 / 1» — labirint baribir bitta. Kartada: «✕ labirint baribir bitta».
  3. «Keyingi» — C: o'yinga ikkinchi labirint (Z) qo'shiladi, sahna tepasida «Daraja: 1 / 2». «▶ Boshlash» — Coddy D1 ni yutadi, «2-daraja!», labirint Z ochiladi, Coddy uni o'sha strelkalar va o'sha qoida bilan yutadi (dvigatel Z da 11 bosish o'ynaydi: (5, 2) da bir marta devor tomonga → — «✕ yo‘q», Coddy turadi) — «Siz yutdingiz!». Kartada: «✓ ikki labirint, dastur o‘sha».
- **Tayanch gaplar:**
  1. «Yangi o‘yinda dastur yo‘q — boshqaruvni ham, qoidani ham boshidan tuzish kerak.»
  2. «Labirintni o‘zgartirsak — o‘yin baribir bitta labirint. Qo‘shsak — ikkita, dastur esa o‘sha.»
- **O'z so'zi bilan:** C da ikkinchi labirintdagi «✕ yo‘q» ni ko'rsatadi — devor tomonga bosildi, Coddy turdi: qoida ikkala labirintda ishladi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta); A da → ni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: dastur bitta, labirint ko'p

- **Vaqt:** 0:06–0:07 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Dastur bitta, labirint ko‘p». A va B xira, C oltin; o'ngda ikki labirint yonma-yon (D1 va Z), ularning ostida bitta dastur ustuni. Coddy: «Strelkalar va qoida ikkala labirintda ishladi.»
- **Tayanch gaplar:**
  1. «Tayyor o‘yinni buzmaymiz — unga yangi labirint qo‘shamiz.»
  2. «Dastur bitta: boshqaruv va qoida hamma labirintda ishlaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: daraja

- **Vaqt:** 0:07–0:08 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: daraja»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Daraja nima?». Coddy: «Daraja — o‘yindagi bitta labirint.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (`raqam` ishi):
     - 1-bosish: labirint D1, ostida «1-daraja»;
     - 2-bosish: Coddy yulduzda, yozuv «2-daraja!»;
     - 3-bosish: labirint Z, ostida «2-daraja», tepada «Daraja: 2 / 2»; yozuv «Biri yutilsa — keyingisi ochiladi».
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Daraja — o‘yindagi bitta labirint. Biri yutilsa, keyingisi ochiladi.»
  2. «O‘tgan darsdagi labirint — o‘yiningizning 1-darajasi. Bugun 2-darajani o‘zingiz yasaysiz.»
- **O'z so'zi bilan:** telefondagi o'yinlarda ham darajalar bor — har biri qiyinroq; mashqdagi «pog'ona» — darsdagi topshiriq, «daraja» — o'yinning ichida (ikkalasini adashtirmaslik).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · O'z labirintingiz → 2 · Kalit va eshik → 3 · Ikki daraja; cho'qqida kichik karta «Dars oxirida · ikki darajali o‘yin · Do‘stingiz o‘ynaydi». Coddy startda, 1-bekat miltillaydi. Coddy: «Bugun 2-darajani o‘zingiz yasaysiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: o‘z labirintingiz, kalit va eshik, ikki daraja.»
  2. «Dars oxirida o‘yiningizni do‘stingiz o‘ynaydi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: labirint yasaymiz

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · O'z labirintingiz
- **Ekran:** proyektor — Blok studiya (ustoz, labirint yasash; 2-daraja) · bola «Ustoz ekraniga qarang» («Ustoz labirint yasayapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Labirint yasaymiz». Javon o'rnida «Labirint» asboblari: «Devor» (tanlangan) · «Kalit» · «Eshik» · «Yulduz». Dastur ustunida Coddy'ning o'yin dasturi. Sahna — 2-daraja (BOSH): start (0, 0), yulduz (6, 4); tepada «Daraja: 2 / 2»; ostida o'lchov «Devor: 0 · Yo‘l: 10 qadam».
  2. Ustoz kataklarni bosadi — devorlar paydo bo'ladi (U1 ning 10 ta devori); har bosishda o'lchov yangilanadi: «Devor: 10 · Yo‘l: 10 qadam».
  3. Ustoz (5, 4) ni ham bosadi — yulduzga yo'l yopiladi: o'lchovda «Yo‘l yo‘q», Kamvoy «Yo‘l yo‘q!». Yana bosadi — devor olinadi, «Yo‘l: 10 qadam».
  4. «▶ Sinab ko‘rish»: ustoz strelkalar bilan o'ynaydi — «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Katakni bosing — devor. Yana bosing — devor ketadi.»
  2. «Yo‘l yo‘q bo‘lsa — o‘yinni hech kim yuta olmaydi. Yo‘lni kompyuter o‘zi sanaydi.»
  3. «Labirint tayyor bo‘lsa — avval o‘zingiz o‘ynab ko‘ring. Endi o‘zingiz.»
- **O'z so'zi bilan:** start (0, 0) o'zgarmaydi — har daraja shu yerdan boshlanadi (9-darsdagi startga qaytish tugmasi ham shu yerga olib boradi); yulduzni «Yulduz» asbobi bilan boshqa joyga qo'ysa bo'ladi; «Yo‘l: N qadam» — startdan yulduzgacha eng qisqa yo'l.
- **Ustoz qiladi:** devor qo'yadi va oladi, «▶ Sinab ko‘rish», o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · O'z labirintingiz: pog'onalar

- **Vaqt:** 0:10:30–0:23 (12,5 daqiqa)
- **Bekat:** 1 · O'z labirintingiz
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (labirint yasash): 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Labirintingizni yasang!». Coddy: «Har pog‘onada labirintingiz qiyinroq bo‘ladi.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya — kartalarda shartning belgisi va soni (labirint rasmi yo'q — har bolaniki boshqa, namuna ham ko'rsatilmaydi): 1 «Devorlar · 6» · 2 «Uzun yo‘l · 14» · 3 «Burilishlar · 5» · ★ «Boshi berk yo‘llar · 2». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «O‘z labirintingizni yasang. Har pog‘onada bitta shart — sahna ostida son.»
  2. «Labirint tayyor bo‘lsa — o‘zingiz o‘ynab yuting.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; javobni aytmaydi — «Yo‘lni qanday uzaytirasiz?», «Qayerda burilsin?» deb so'raydi; bu yerda yagona javob yo'q — har labirint o'ziga xos.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya — labirint yasash (asboblar, dastur ustuni, 2-daraja, o'lchov qatori). Pog'onalar bitta labirintni o'zgartirib boradi (1-pog'ona — BOSH dan). Hamma pog'onada ishora boshida: «Katakni bosing — devor. Tayyor bo‘lsa — «Sinab ko‘rish»».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Devorlar», ostida «Kamida 6 ta devor qo‘ying va o‘ynab ko‘ring.». O'lchov «Devor: 0 / 6 · Yo‘l: 10 qadam». «Maslahat»: «Devorlar yo‘lni to‘smasin: yulduzga yo‘l qolsin».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Uzun yo‘l», ostida «Yo‘l kamida 14 qadam bo‘lsin.». O'lchov «Yo‘l: 10 / 14 qadam». «Maslahat»: «To‘g‘ri yo‘lni devor bilan to‘sing — qahramon aylanib o‘tsin».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Burilishlar», ostida «Yo‘l kamida 5 marta burilsin.». O'lchov «Burilish: 1 / 5». «Maslahat»: «Uzun to‘g‘ri yo‘lak bormi? Uni devor bilan bo‘ling».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Boshi berk yo‘llar», ostida «Yulduzga olib bormaydigan 2 ta yo‘lak qo‘shing.». O'lchov «Boshi berk yo‘l: 0 / 2». «Maslahat»: «Yo‘ldan chetga qisqa yo‘lak oching — oxiri devor bo‘lsin». Erkin ijod (36-qaror, 97-qaror) — butun bekat shu.
  Shart bajarilsa va bola o'zi yutsa: «Labirint tayyor!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** devor qo'yadi va oladi, o'lchovga qaraydi, «▶ Sinab ko‘rish» bilan o'ynaydi.
- **Tekshiruv:** pog'onaning o'lchov sharti bajarildi va bola shu labirintni o'zi o'ynab yutdi (avto).
- **Xatoda:** yo'l yo'q — Kamvoy «Yo‘l yo‘q!»; yutdi, lekin shart bajarilmagan — Kamvoy «Oz qoldi!» (haqiqiy son bilan); hali o'ynamagan — ishora; start bosildi — ishora; o'yinda devor tomonga bosdi — qoida: «✕ yo‘q», qahramon turadi (bu o'yin, muammocha emas).

## 9 · 2-bekat

- **Vaqt:** 0:23–0:24 (1 daqiqa)
- **Bekat:** 2 · Kalit va eshik
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: kalit va eshik»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · O'z labirintingiz ✓, oltin yoy; Coddy 2-bekatda; 2 · Kalit va eshik miltillaydi. Coddy: «Endi labirintingizga kalit va eshik qo‘yamiz.»
- **Tayanch gaplar:**
  1. «Labirintingiz bor. Endi unga kalit va eshik qo‘yamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: kalit va eshik qo'yamiz

- **Vaqt:** 0:24–0:26 (2 daqiqa)
- **Bekat:** 2 · Kalit va eshik
- **Ekran:** proyektor — Blok studiya (ustoz, labirint yasash; U1) · bola «Ustoz ekraniga qarang» («Ustoz eshik qo‘yyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Eshik yo‘lni to‘ssin». Sahna — ustozning 2-darajasi (U1); o'lchov «Yo‘l: 10 qadam».
  2. Ustoz «Eshik» asbobini tanlaydi, (3, 4) ni bosadi — eshik. O'lchovda yo'l bor (12 qadam — eshiksiz, pastdan aylanib; v1.2) — Ortiqvoy «Eshik keraksiz!»: qahramon pastdan aylanib, eshiksiz yetib boradi (ustoz barmog'i bilan ko'rsatadi).
  3. Ustoz eshikni (5, 4) ga qo'yadi — yulduzga kirish yagona: o'lchovda «Yo‘l yo‘q», Kamvoy «Kalit qani?».
  4. «Kalit» asbobi — (0, 2) ni bosadi: «Kalit ✓ · Eshik ✓ · Yo‘l: 10 qadam» (U2). «▶ Sinab ko‘rish»: kalit, eshik, yulduz — «Siz yutdingiz!».
- **Tayanch gaplar:**
  1. «Eshik yo‘lni to‘ssin: yulduzga faqat eshikdan o‘tib boriladi.»
  2. «Kalit eshikdan oldin bo‘lsin — eshikdan o‘tmasdan yetib boriladigan joyda.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** eshik keraksiz bo'lsa — o'yin oson; kalit eshik ortida qolsa — o'yinni hech kim yuta olmaydi; kalit yo'ldan chetda bo'lsa — qiyinroq (borib qaytiladi).
- **Ustoz qiladi:** eshik va kalit qo'yadi, ko'chiradi, «▶ Sinab ko‘rish».
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Kalit va eshik: pog'onalar

- **Vaqt:** 0:26–0:37 (11 daqiqa)
- **Bekat:** 2 · Kalit va eshik
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (labirint yasash): 1 → 2 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Kalit va eshik qo‘ying!». Coddy: «Avval kalit, keyin eshik — endi sizning labirintingizda.» Chapda katta son «Ikki pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya (belgi va son, labirint rasmisiz): 1 «Kalit va eshik» · 2 «Kalit chetda» · ★ «Uzun daraja · 20». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Eshik yo‘lni to‘ssin, kalit eshikdan oldin bo‘lsin.»
  2. «Kalit chetda bo‘lsa — o‘yinchi borib, orqaga qaytadi.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Yulduzga qaysi katakdan kiriladi?», «Kalitga eshiksiz yetib boriladimi?» deb so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya — labirint yasash; labirint 8-qadamdagi bilan ochiladi. Hamma pog'onada ishora boshida: «Asbobni tanlang, keyin katakni bosing».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Kalit va eshik», ostida «Eshik yo‘lni to‘ssin, kalit eshikdan oldin bo‘lsin.». O'lchov «Kalit — · Eshik —» (qo'yilgach ✓). «Maslahat»: «Yulduzga qaysi katakdan kiriladi? Eshikni o‘sha yo‘lga qo‘ying».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Kalit chetda», ostida «Kalitga borib, orqaga qaytilsin.». O'lchov «Borib qaytish: yo‘q» (bo'lsa — «bor»). «Maslahat»: «Yo‘ldan chetdagi yo‘lak bormi? Kalitni o‘sha yerga qo‘ying».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Uzun daraja», ostida «Yo‘l kamida 20 qadam bo‘lsin.». O'lchov «Yo‘l: 14 / 20 qadam». «Maslahat»: «Kalit va yulduz bir-biridan uzoqroq bo‘lsa — yo‘l uzayadi».
  Shart bajarilsa va bola o'zi yutsa: «Labirint tayyor!» va konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** kalit va eshik qo'yadi, ko'chiradi, devorlarni o'zgartiradi, o'ynab ko'radi.
- **Tekshiruv:** pog'onaning o'lchov sharti bajarildi va bola o'zi yutdi (avto). 1-pog'ona bajarilsa, ro'yxatdagi «2-daraja: kalit va eshik» ✓.
- **Xatoda:** kalit yo'q yoki kalitga eshiksiz yetib bo'lmaydi — Kamvoy «Kalit qani?»; eshik to'smaydi — Ortiqvoy «Eshik keraksiz!»; yo'l yo'q — Kamvoy «Yo‘l yo‘q!»; shart bajarilmagan — Kamvoy «Oz qoldi!».

## 12 · Xulosa: daraja

- **Vaqt:** 0:37–0:39 (2 daqiqa)
- **Bekat:** 2 · Kalit va eshik
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: daraja»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Daraja». Coddy: «Yangi daraja — yangi labirint. Dastur o‘sha.» Ikki karta: «Daraja — O‘yindagi bitta labirint» (ikki labirint rasmi, «1 → 2») va «Dastur bitta — darajalar ko‘p» (dastur ustuni rasmi); o'ngda Coddy U2 da yulduzda.
- **Tayanch gaplar:**
  1. «Daraja — o‘yindagi bitta labirint.»
  2. «Labirintni yasadik — dastur o‘zgarmadi, o‘yin baribir ishladi.»
- **O'z so'zi bilan:** katta o'yinlarda yuzlab daraja bor — dasturchilar har biri uchun yangi dastur yozmaydi, yangi labirint (xarita) yasaydi; ikki-uch boladan labirintining yo'li necha qadam ekanini so'raydi (bola o'zi aytadi).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:39–0:40 (1 daqiqa)
- **Bekat:** 3 · Ikki daraja
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: ikki daraja»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Ikki daraja miltillaydi. Coddy: «Oxirgi bekat: ikki darajani birga o‘ynaymiz.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — o‘yinni boshidan oxirigacha o‘ynaymiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: ikki daraja

- **Vaqt:** 0:40–0:42 (2 daqiqa)
- **Bekat:** 3 · Ikki daraja
- **Ekran:** proyektor — Blok studiya (ustoz, o'yin; D1 → U2) · bola «Ustoz ekraniga qarang» («Ustoz o‘yinni o‘ynayapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «Ikki daraja». Sahna — 1-daraja (D1), tepada «Daraja: 1 / 2»; sahna yonida ro'yxat «O‘yiningizda:» (to'rt band ✓, «Ikki daraja yutildi» va «Do‘stingiz o‘ynadi» — bo'sh).
  2. «▶ Boshlash»: ustoz 1-darajani o'ynaydi — yulduz, «2-daraja!»; labirint U2 ochiladi, Coddy startda.
  3. Ustoz 2-darajani o'ynaydi: kalit, eshik, yulduz — «Siz yutdingiz!». Ro'yxatda «Ikki daraja yutildi» ✓.
- **Tayanch gaplar:**
  1. «▶ Boshlash — o‘yin 1-darajadan boshlanadi. Yutsangiz — 2-daraja ochiladi.»
  2. «Ro‘yxatdagi bandlar ✓ bo‘lsa — o‘yin do‘stingizga tayyor.»
- **O'z so'zi bilan:** 2-darajada kalit yana yo'q — har daraja boshidan (kalit labirintniki).
- **Ustoz qiladi:** «▶ Boshlash», o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Ikki daraja: pog'onalar

- **Vaqt:** 0:42–0:50 (8 daqiqa)
- **Bekat:** 3 · Ikki daraja
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'yin): 1 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Ikki darajani yuting!». Coddy: «O‘yiningizni boshidan oxirigacha o‘ynang.» Chapda katta son «Ikki darajani yutdi 6 / 14», ostida «Har belgi — ikki darajani yutgan bitta bola»; o'ngda zinapoya: 1 «Ikki daraja» · ★ «Adashmasdan». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «O‘yiningizni boshidan o‘ynang: avval 1-daraja, keyin o‘zingiz yasagan 2-daraja.»
  2. «Ro‘yxatda bo‘sh band bo‘lsa — avval shuni to‘ldiring.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** ro'yxatda bo'sh band qolgan bolaga boradi — «Qaysi band bo‘sh? Uni nima to‘ldiradi?» (strelka yoki qoida yetishmasa — bloklar bilan, 2-daraja sharti — labirint bilan).
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya — o'yin: javonda bloklar (dasturni tuzatsa bo'ladi), «Labirint» tugmasi bilan 2-darajani o'zgartirsa ham bo'ladi; sahna — 1-daraja, tepada «Daraja: 1 / 2»; sahna yonida ro'yxat «O‘yiningizda:». Ishora boshida: «▶ Boshlash — 1-darajadan».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Ikki daraja», ostida «Boshidan o‘ynang: ikkala darajani yuting.». «Maslahat»: «Ro‘yxatda bo‘sh band bormi? Avval shuni to‘ldiring». Yutsa va to'rt band ✓ bo'lsa: «O‘yiningiz tayyor!» va konfeti.
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Adashmasdan», ostida «Ikkala darajani bir marta ham devor tomonga bosmay yuting.». «Maslahat»: «Shoshilmang: har bosishdan oldin yo‘lga qarang». Yutsa: «Siz yutdingiz!» va konfeti.
- **Bola qiladi:** o'z o'yinini o'ynaydi, ro'yxatni to'ldiradi; ★ da ehtiyot bo'lib o'ynaydi.
- **Tekshiruv:** 1-pog'ona — «▶ Boshlash» bilan ikkala daraja ketma-ket yutildi va ro'yxatda to'rt band ✓ («Do‘stingiz o‘ynadi» — 16-qadamda); ★ — ikkala daraja yutildi, shart bir marta ham «yo‘q» bermadi (avto).
- **Xatoda:** strelka dasturchasi yo'q — Bo'shvoy; shartsiz urildi — To'siqvoy «Devor!», o'yin to'xtadi; ★ da devor tomonga bosildi — ishora «Qaytadan — «▶ Boshlash»»; kalitsiz eshik — Kamvoy «Kalit qani?»; yutdi, lekin ro'yxatda bo'sh band — Kamvoy «Oz qoldi!» (band nomi bilan).

## 16 · Do'stingiz o'ynasin

- **Vaqt:** 0:50–0:58 (8 daqiqa)
- **Bekat:** 3 · Ikki daraja
- **Ekran:** proyektor — sinf doskasi (do'st o'ynaydi) · bola — «Do‘stingiz o‘ynaydi» (o'yin rejimi), keyin o'z natijasi
- **Sahna:** 97-qaror: o'z labirintini do'stiga o'ynatadi. 12-bo'lim 3-band: bola yasagan narsa proyektorga chiqmaydi — bolalar joy almashadi, har kim do'stining o'yinini **o'sha noutbukda** o'ynaydi. Proyektorda ism yo'q, faqat son.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Do‘stingiz o‘ynasin» (v1.2 — «Qurishdagi qarorlar» 13). Coddy: «Do‘stingiz yasagan labirintni siz yuta olasizmi?» Chapda katta son «O‘ynab ko‘rildi: 9 / 14», ostida «Har belgi — do‘sti o‘ynab ko‘rgan bitta o‘yin»; o'ngda ikki noutbuk rasmi va strelka (joy almashish). Panelda: «Keyingi».
  2. Bola noutbukida «Do‘stingiz o‘ynaydi» tugmasini bosadi — o'yin rejimi: faqat sahna va «▶ Boshlash», «Daraja: 1 / 2»; dastur va asboblar yopiq. Bolalar yoningizdagi do'st bilan joy almashadi va bir-birining o'yinini o'ynaydi (ikkala daraja).
  3. Ustoz «Joyingizga qayting» deydi. Har bola o'z noutbukida ko'radi: «Do‘stingiz o‘ynadi: 2 / 2 daraja · 3 marta devor oldida to‘xtadi» va 2-darajada do'stining yo'li — oltin iz. Ro'yxatda «Do‘stingiz o‘ynadi» ✓.
- **Tayanch gaplar:**
  1. «Yoningizdagi do‘stingiz bilan joy almashing. Uning o‘yinini o‘ynang — dasturiga tegmang.»
  2. «Joyingizga qayting: do‘stingiz qanday o‘ynaganini ko‘ring.»
- **O'z so'zi bilan:** juftlarni aytadi (toq bo'lsa — uchtadan, aylana bo'lib); do'stingiz qayerda qiynalgan bo'lsa — labirintning eng qiyin joyi o'sha; kim do'stining labirintini bir marta ham devor tomonga bosmay yutdi — qo'l ko'taradi (ism ekranga chiqmaydi).
- **Ustoz qiladi:** juftlarni aytadi, «Keyingi»ni bosadi.
- **Parta:** «Do‘stingiz o‘ynaydi» o'yin rejimi (do'sti o'ynaydi) → o'z natijasi: do'stining natijasi va yo'li (3–4-dars auditidan; qaror A-1 — bola o'z o'yinini va undagi yo'lni ko'radi).
- **Bola qiladi:** do'stining o'yinini o'ynaydi; qaytib, o'z o'yinida do'stining yo'lini ko'radi.
- **Tekshiruv:** «Do‘stingiz o‘ynadi» — do'st kamida 1-darajani o'ynadi (avto).

## 17 · Yakun

- **Vaqt:** 0:58–1:01 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz ikki darajali o‘yin yasadingiz!». Bugungi so'z: «Daraja — O‘yindagi bitta labirint». Pastda: ✓ O'z labirintingiz · ✓ Kalit va eshik · ✓ Ikki daraja. Kichik karta «Keyingi dars · 11 · O‘zgaruvchi: ball».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: o‘z labirintingiz, kalit va eshik, ikki daraja.»
  2. «Bugungi so‘z — daraja: o‘yindagi bitta labirint.»
  3. «Keyingi darsda o‘yinda ball sanaymiz: kompyuter sonni eslab qoladi.»
- **O'z so'zi bilan:** «daraja» nimaligini bolalardan aytdiradi; ikki-uch boladan do'sti labirintini yuta oldimi, so'raydi (bola o'zi aytadi — ekranga chiqmaydi).
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz ikki darajali o‘yin yasadingiz!». Coddy o'rniga qahramon (o'z ismi bilan): «Ikki daraja — birini o‘zim yasadim!» «Siz bugun»: N ta devor qo‘ydi · N qadam — labirintingiz yo‘li · N daraja yutdi (haqiqiy son; **KOD**); «Do‘stingiz o‘ynadi: 2 / 2 daraja». Ro'yxat «O‘yiningizda:» (besh band). O'z qahramoni 2-darajada, yulduz yonida; «O‘yiningiz saqlandi.» (faqat haqiqatan saqlansa — 12-bo'lim 28-band; **KOD**); «Keyingi darsda ball bilan ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:01–1:04 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami (haqiqiy son, ismsiz): N ta labirint yasaldi · N ta o‘yinni do‘st o‘ynadi · N daraja yutildi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda ball bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Bugun 14 ta yangi labirint yasaldi — har biri o‘ziga xos.» (haqiqiy son bilan)
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–9-darsdagidek (88-qaror). Farqi:
- 2–3-qadam: avto o'yinni va uch kartani bola o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 5-qadam: «Keyingi»ni bola o'zi bosadi.
- 7, 10-qadam (ustoz ko'rsatadi): ustozning labirinti (U1, U2) tayyor turadi; bola o'zi bitta devor qo'yib-olib ko'radi va «▶ Sinab ko‘rish»ni bosadi (ishora «Katakni bosing — devor. Yana bosing — devor ketadi»).
- 14-qadam: bola Coddy'ning ikki darajali o'yinini o'zi o'ynaydi.
- 16-qadam: «Kimgadir o‘ynating» — uydagilardan biri o'ynasa bo'ladi («Do‘stingiz o‘ynaydi» tugmasi o'sha; natija o'sha ko'rinishda); «Keyingi ›» bilan o'tkazsa ham bo'ladi (ro'yxatdagi beshinchi band bo'sh qoladi).
- Solo'da yo'q qadam: 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›».

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-010-labirint-oyini-2-v1` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Labirint yasovchi» (`yasovchi`) — 8-qadamda 1-pog'ona bajarildi (birinchi o'z labirinti); «Ikki daraja» (`ikki_daraja`) — 15-qadamda 1-pog'ona bajarildi.
- Natijaga chek-list (besh band) va 2-darajaning o'lchovlari (devor, yo'l, burilish) boradi — mentor ko'radi (**KOD**).
- Bolaning o'yini (dastur, 1- va 2-daraja) saqlanadi (**KOD**) — keyingi darslarda kerak bo'lishi mumkin (masalan 21–22-dars «Shaxsiy o'yin»; «Savollar» 8).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- Bu — 9-darsning davomi: bola o'z o'yini bilan ishlaydi. Darsdan oldin tekshiring: 9-darsda bo'lmagan bolalar kim — ularga tayyor o'yin ochiladi (o'zi), ularga 1-qadamda bir og'iz ayting.
- Bugungi asosiy fikr: **tayyor o'yinni buzmaymiz — unga yangi daraja qo'shamiz; dastur bitta, labirint ko'p.** Hukda, xulosada va 14-qadamda chiqadi.
- Yangi ish — labirint yasash: asbobni tanlang, katakni bosing. 7-qadamda sekin, ikki marta ko'rsating; «Yo‘l yo‘q!» holatini ataylab ko'rsating.
- Labirint yasashda yagona javob yo'q. Bolaga «bunday qiling» deb labirint chizib bermang — o'lchov qatoridagi songa qaratib savol bering.
- Bolalar labirintni uzoq bezaydi — 8-qadamda vaqtni kuzating; ★ ga ulgurmaganlar 11-qadamga o'tsin (labirint o'zi saqlanadi).
- 16-qadamda juftlarni oldindan o'ylab qo'ying (yoningizdagi do'st; toq bo'lsa — uchtadan). Joy almashganda bola do'stining dasturiga tegmaydi — «Do‘stingiz o‘ynaydi» rejimida dastur yopiq.
- O'yin paytida proyektorda → va ← qadam almashtirmaydi — keyingi qadamga «Keyingi» tugmasi bilan o'ting.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **Labirint yasash** (studiya ishi `ish: 'labirint'`): javon o'rnida to'rt asbob («Devor» · «Kalit» · «Eshik» · «Yulduz»; tanlash — coral hoshiya); katakni bosish — devor qo'yish/olish, kalit/eshik/yulduz qo'yish (har biri bitta, ko'chadi), o'sha asbob bilan qayta bosish — kalit/eshikni olish; start (0, 0) himoyalangan, yulduz faqat ko'chadi. Katak bosilishi — 3-darsdagi `mdBosilgan` (maydonda katakni topish) asosida. «Labirint · Bloklar» almashtirgichi (dasturni ham tuzatish uchun).
2. **O'lchov qatori** (sahna ostida, har bosishda): eng qisqa yo'l (kalit va eshik bilan, BFS), eng kam burilish (eng qisqa yo'llar orasida), devorlar soni, boshi berk yo'llar soni, eshik to'sadimi, kalitga eshiksiz yo'l, borib qaytish; «Yo‘l yo‘q» va Kamvoy. Manba simulyatsiyasidagi hisoblash bilan bir xil (sinov shu jadval bilan solishtiradi).
3. **Pog'ona shartlari** (`kerak: { devor: 6 }`, `{ yol: 14 }`, `{ burilish: 5 }`, `{ boshiBerk: 2 }`, `{ eshik: true }`, `{ qaytish: true }`, `{ eshik: true, yol: 20 }`) + `sinab: true` (bola shu labirintni o'yin rejimida o'zi yutdi); «Oz qoldi!» ishorasi haqiqiy son bilan; «Eshik keraksiz!», «Kalit qani?».
4. **Darajalar:** o'yin = labirintlar ro'yxati [1-daraja, 2-daraja]; «▶ Boshlash» — 1-darajadan (shartsiz urilib o'yin to'xtasa ham — 9-dars KOD 2); yutilsa «2-daraja!» va keyingi labirint (qahramon startda, kalit labirintniki — har daraja boshidan); sahna tepasida «Daraja: 1 / 2»; «▶ Sinab ko‘rish» — faqat tahrirlanayotgan daraja.
5. **9-dars o'yinini ochish:** saqlangan dasturchalar va D1 (jonli darsda serverdan, demo va solo'da noutbukdan); yo'q bo'lsa — tayyor o'yin (to'rt strelka, har birida qoida, + D1) va kirishdagi karta. 9-darsdagi ro'yxat bandlari ✓ bo'lib keladi.
6. **«Do‘stingiz o‘ynaydi» rejimi:** o'yin rejimi, dastur va asboblar yopiq; do'stning natijasi (yutgan darajalar, devor oldida to'xtashlar — shart «yo‘q» bergan bosishlar) va 2-darajadagi yo'li egasining noutbukida saqlanadi va ko'rsatiladi; sinf doskasida «O‘ynab ko‘rildi: N / 14» (son).
7. **Huk:** avto o'yin (dvigatel eng qisqa yo'lni o'zi o'ynaydi) — 2-qadamda D1, 3-qadamda B (D1-B, «Daraja: 1 / 1») va C (D1 → Z, «Daraja: 1 / 2»); A — bo'sh dastur, ustoz → bosadi, Bo'shvoy; C da Z — 11 bosish, (5, 2) da bitta → «yo‘q» bilan; natija kartada.
8. **Chek-list** besh band (9-dars ro'yxatining davomi); 15 · 1 sharti — to'rt band; LMS natijasida.
9. **Saqlash:** bolaning o'yini (dastur, 1- va 2-daraja) — keyingi darslar uchun; «O‘yiningiz saqlandi» faqat saqlanganda.
10. **Natija turlari:** «ta devor qo‘ydi» (2-darajadagi devorlar), «qadam — labirintingiz yo‘li» (2-darajaning eng qisqa yo'li), «daraja yutdi» (yutilgan darajalar); sinf — «ta labirint yasaldi», «ta o‘yinni do‘st o‘ynadi»; yutuqlar `yasovchi`, `ikki_daraja`.
11. **Simulyatsiya sinovi** — `sinov/dvigatel/labirint.mjs` ga 10-dars qismi: yuqoridagi jadvallardagi har labirintning o'lchovlari (dvigatel hisobi manbadagi son bilan bir xil), har namuna o'z pog'onasini bajaradi va keyingisini bajarmaydi, to'liq o'yin (D1 → U2) yutiladi, «Do‘stingiz o‘ynaydi» rejimida dastur o'zgarmaydi.

## Savollar (tavsiya — A)

1. **Labirint yasash — sodda: to'rt asbob, katakni bosish** (devor qo'yish/olish; kalit, eshik, yulduz — bittadan, ko'chadi); start (0, 0) qotgan. Sabab: start qotgan bo'lsa, har daraja bir joydan boshlanadi va 9-darsdagi startga qaytish tugmasi (15 · ★, `go to x: 0 y: 0`) ikkala darajada to'g'ri ishlaydi; bosish — sudrashsiz yo'l (9-bo'lim 6-band). **B** — start ham ko'chadi (unda startga qaytish tugmasi 2-darajada boshqa katakka olib boradi — yangi tushuncha kerak). **C** — faqat devor (kalit va eshik qo'yilmaydi) — 2-bekat bo'lmaydi.
2. **Pog'onalar — o'lchanadigan shartlar** (devor ≥ 6, yo'l ≥ 14, burilish ≥ 5, boshi berk ≥ 2; eshik to'sadi, kalit chetda, yo'l ≥ 20) va sahna ostida jonli o'lchov; har pog'onada bola o'zi o'ynab yutishi shart. Sabab: erkin ish, lekin yo'nalish bor; «qiyin labirint» son bilan ko'rinadi; yutib bo'lmaydigan labirint do'stga bormaydi. B — erkin, shartsiz (faqat «yo‘l bor» va «o‘zi yutdi»), pog'onalarsiz.
3. **Do'stga o'ynatish — joy almashish** (o'sha noutbukda, «Do‘stingiz o‘ynaydi» rejimi; egasi do'stining yo'lini ko'radi). Sabab: bola ishi proyektorga chiqmaydi (12-bo'lim 3-band), serverga yangi narsa kerak emas. B — ustoz 2–3 labirintni proyektorda qayta yasaydi (bola manzillarni aytadi) — uzoq va ism bilan bog'lanadi. C — do'st o'z noutbukidan ulanadi (server orqali almashish — keyin).
4. **9-darsda bo'lmagan bola — tayyor o'yin** (to'rt strelka, har birida qoida, D1; kirishda aytiladi). B — dars boshida o'yinni tez qayta yig'adi (5 daqiqa; birinchi natija kechikadi).
5. **Yangi so'z — «daraja»** (o'yindagi bitta labirint). B — yangi so'z yo'q (loyiha darsi).
6. **«Pog'ona» (mashq) va «daraja» (o'yin) bir darsda.** A — ikkalasi qoladi, ajratiladi: pog'ona — faqat «Mashq · 1-pog‘ona» yorlig'ida, daraja — faqat o'yin ichida («Daraja: 1 / 2»), ustoz 5-qadamda bir marta farqini aytadi. B — loyiha darslarida mashq pog'onasi o'rniga «topshiriq» (lekin 1–9-darsda pog'ona; zinapoya doskasi bilan bog'liq).
7. **Huk — «ikkinchi labirintni qanday qo‘shamiz?»**, uch karta: yangi o'yin · labirintni o'zgartirish · ikkinchi labirint qo'shish. B — huk yo'q, dars 9-darsdagi o'yin bilan darhol boshlanadi (loyiha davomi).
8. **Bolaning o'yini saqlanadi** — 21–22-dars («Shaxsiy o'yin 1–2») uchun ham. B — faqat shu dars ichida.
9. **2-darajada kalit — labirintniki:** daraja almashganda kalit qo'lda qolmaydi (har daraja boshidan). B — kalit keyingi darajaga o'tadi (2-darajada eshik kalitsiz ochilib qoladi — tavsiya etilmaydi).
10. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Labirint yasash bolalarni uzoq ushlab qolishi mumkin (bezash zavqi) — 8- va 11-qadam cho'zilsa, zaxira shu yerga; 15-qadam qisqaradi.
2. Birinchi natija 12-daqiqada — chegarada; huk uzaysa, 5-qadam qisqaradi.
3. «Burilish» va «boshi berk yo‘l» o'lchovlari 9 yoshliga tushunarlimi — sinfda ko'riladi (ustoz barmoq bilan ko'rsatadi). «Burilish» — eng qisqa yo'llar orasidagi eng kami: bola boshqa yo'l bilan yursa, sanagani ekrandagidan ko'p chiqishi mumkin.
4. Kataklarni bosish sinf sichqonchasiz noutbukida qulaymi (33-qaror: tugmalar katta) — katak o'lchami 7 × 5 da yetarli bo'lishi kerak, qurishda o'lchanadi.
5. 16-qadam: 14 bola birdan joy almashadi — sinf tartibi; toq son; do'st o'ynayotganda egasi qayerda turadi — sinfda ko'riladi.
6. 9-dars o'yini saqlanmagan (jonli serverda) holatlari — internet uzilishi va boshqa noutbuk (doiradan tashqari — texnik ish, 12-bo'lim yakuni).
7. 9-dars manbasi (v1.1) va 8-dars manbasi tasdiqlanmagan. Shart bloki va so'zlar 8-darsdagidek (`if path → then`, «urildi», «✓ ha / ✕ yo‘q»); 9-darsda qoida boshqacha tanlansa («Savollar» 1-B — «devorga tegsa — startga») — 10-darsdagi 15 · ★, 16-qadamdagi do'st natijasi va kirish kartasi yana moslanadi.
8. 11-dars manbasi hali yo'q — 17-qadamdagi «Keyingi dars · 11 · O‘zgaruvchi: ball» va «ball sanaymiz» gapi DASTUR'dan olindi.
9. Uzun sarlavhalar («Siz ikki darajali o‘yin yasadingiz!», «Bugun o‘yiningizni davom ettiramiz!») bir qatorga sig'adimi — setka darvozasida o'lchanadi (71-qaror).
10. Ruscha matn hali yo'q.

## Audit saboqlari qanday qo'llandi (3–5-dars auditidan)

1. **Doska javobni ochmaydi:** 8- va 11-qadam doskasidagi kartalarda faqat shartning belgisi va soni — namuna labirint ham, bolalarning labirinti ham chizilmaydi.
2. **Ikki pog'onaning javobi bir xil emas:** har pog'ona namunasi o'z shartini bajaradi va keyingi pog'ona shartini bajarmaydi (dastur bilan tekshirildi) — bola har pog'onada labirintini haqiqatan o'zgartiradi.
3. **Maslahat yo'nalish beradi, javobni aytmaydi** (qaror A-2): «qayerga qarang» va «nimani o'zgartiring» — tayyor labirint yo'q.
4. **16-qadamda bola o'z o'yinini va undagi yo'lni ko'radi** (qaror A-1): do'sti o'ynab bo'lgach — do'stining natijasi va 2-darajadagi yo'li (oltin iz) bolaning o'z noutbukida.

## Moslash (20.11, 8-dars bilan)

v1 8- va 9-dars manbalaridan oldin, ular bilan parallel yozilgan edi: 9-darsdagi qoida «devorga tegsa — startga» (`when any key pressed` → `if touching wall then` → `go to x: 0 y: 0`) deb olingan edi. 8-dars `if path → then` ni tanladi, 9-dars v1.1 qoidani unga moslab qayta loyihaladi — bu dars ham moslandi:
1. **Qoida — 9-darsdagidek:** har strelka dasturchasida `if path … then` («yo‘l bo‘lsa — yuradi»); `when any key pressed`, `touching wall`, `go to` li qoida olib tashlandi. Kirish kartasi «O‘tgan darsda» — `when → key pressed` → `if path → then` → `move right`. Sabab: kurs bo'yi bir ma'no — bir so'z; 8-darsda boshqa shart yo'q.
2. **«Startga qaytdi» → «devor oldida to‘xtadi»** (16-qadamdagi do'st natijasi, «Do‘st o‘ynaydi» KOD 6). Sabab: yangi qoida qahramonni startga qaytarmaydi — devor oldida turadi; so'z 8-dars yakunidagi «Qahramon devor oldida to‘xtaydi» bilan bir.
3. **15 · ★ «Startga qaytmasdan» → «Adashmasdan»:** shart — ikkala daraja yutildi va shart bir marta ham «yo‘q» bermadi (devor tomonga bosilmadi); namuna — eng qisqa yo'llar, 0 marta «yo‘q». Ishora «Devor tomonga bosildi. Qaytadan — «▶ Boshlash»».
4. **Muammochalar:** To'siqvoy — shartsiz `move` urildi, o'yin to'xtadi, 8-dars gapi bilan («Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring»); kalitsiz eshik — shart «yo‘q» (o'yin to'xtamaydi) yoki shartsiz urilish (to'xtaydi). «Tegdi» so'zi olib tashlandi — «urildi» (2-, 8-dars).
5. **Huk C:** Z da qoida ko'rinsin deb dvigatel 11 bosish o'ynaydi — (5, 2) da bitta → «✕ yo‘q» (simulyatsiya: shart bilan 11-bosishda yutdi; shartsiz o'sha ketma-ketlik 8-bosishda urilardi). A va B o'zgarmadi.
6. **7-qadam:** start (0, 0) nega qotgan — endi qoida uchun emas: har daraja shu yerdan boshlanadi, 9-darsdagi startga qaytish tugmasi (15 · ★) ikkala darajada to'g'ri ishlaydi («Savollar» 1 sababi ham shunday).
7. **Bloklar:** to'rt oila — Hodisa, Harakat, Shart, Tovush (9-darsda Gap o'rniga Tovush); blok chegarasi 14 → 16 (9-darsdagidek).
8. **Qayta simulyatsiya:** D1 va hamma 2-daraja labirintlari (U2, NK1, NKY) eng qisqa yo'l bilan shart «yo‘q» bermasdan yutiladi; to'liq o'yin D1 → U2 — 26, D1 → NK1 — 30, D1 → NKY — 36 bosish (o'zgarmadi). Labirint yasash, o'lchovlar, namunalar va pog'ona shartlari (8, 11-qadam) shartga bog'liq emas — o'zgarmadi.
9. **4-dars va 3–5-dars qarorlari bilan:** A·1 (16-qadamda bola o'z o'yinini va do'stining yo'lini ko'radi) va A·2 (maslahatlar yo'nalish beradi) o'zgarishsiz amal qiladi; 4-darsdagi qochadigan yulduz bu darsga tegishli emas.
10. **O'zgarmadi:** dars tuzilishi, vaqtlar, yangi so'z «daraja», labirint yasash, darajalar, «Do‘stingiz o‘ynaydi», LMS.

## Qurishdagi qarorlar (20.11 kech, v1.2 — dars qurilganda o'lchov va sinovdan chiqqanlar; tavsiya bo'yicha, ko'rik sahifasida savol)

1. **Huk A:** ustoz → ni qo'lda bosmaydi — dvigatel A kartasini ham o'zi sinaydi (yangi o'yin: labirint Z, dastur bo'sh) — bosish bo'ladi, Coddy qimirlamaydi, Bo'shvoy «Men nimani kutaman?»; natija kartada. Uchala karta bir xil ishlaydi (solo'da ham).
2. **«Labirint · Bloklar» almashtirgichi** — oila tugmalari qatorida birinchi «Labirint» (buta belgisi): tanlansa — javon o'rnida to'rt asbob; boshqa oila tanlansa — bloklar (dasturni tuzatish uchun). Labirint yasash ekranlari «Labirint» tanlangan holda ochiladi.
3. **O'lchov qatori sahnaning tepasida** (pastda X sonlari turadi); «Daraja: 2 / 2» — o'ng yuqori burchakda. O'yin («Sinab ko‘rish») paytida o'lchov yashirinadi, asboblar xira.
4. **Muammocha tartibi:** eshik yo'lni to'smasa — Ortiqvoy «Eshik keraksiz!» (kalit bo'lmasa ham); to'sadi, lekin kalit yo'q yoki eshik ortida — Kamvoy «Kalit qani?»; keyin — Kamvoy «Yo‘l yo‘q!». 10-qadamdagi U1-E da yo'l 12 qadam (eshiksiz, pastdan aylanib) — v1.1 dagi «yo'l o'zgarmaydi» tuzatildi.
5. **«Oz qoldi!» ishoralari** (manbada faqat yo'l uchun misol bor edi) — har shart o'z soni bilan: «Devor: 4 ta. Kerak: kamida 6» · «Yo‘l: 12 qadam. Kerak: kamida 14» · «Burilish: 3. Kerak: kamida 5» · «Boshi berk yo‘l: 1. Kerak: kamida 2» · «Borib qaytish: yo‘q. Kalitni yo‘ldan chetga qo‘ying» · «Eshik qo‘ying — yulduzga yo‘lni to‘ssin».
6. **Borib qaytish** — eshik yo'lni to'sib, kalit kerak bo'lsa: hamma eng qisqa yo'lda biror katakdan ikki marta o'tilsa — «bor» (dvigatel buni to'liq qidiruv bilan aniqlaydi; sinov — hamma eng qisqa yo'llarni sanab, boshqa usulda).
7. **15 · 1 bo'sh band bilan yutsa:** Kamvoy «Oz qoldi!», ishora «Ro‘yxatda bo‘sh band bor: Qoida» (birinchi bo'sh band), pog'ona sanalmaydi.
8. **«Do‘stingiz o‘ynaydi» — bitta tugma** «▶ Do‘stingiz o‘ynaydi» (o'yin rejimi, dastur va asboblar yo'q); o'yin yutilsa yoki «■ To‘xtatish» bosilsa — natija shu ekranda («Joyingizga qayting» va son), 2-darajada do'stining yo'li — oltin iz. Do'st «o'ynadi» — kamida bir qadam yurdi. Doskadagi «O‘ynab ko‘rildi» — 10-pog'ona sifatida sanaladi. Solo'da ham shu ekran («Keyingi ›» bilan o'tkazsa bo'ladi).
9. **Natija:** «ta devor qo‘ydi» va «qadam — labirintingiz yo‘li» — oxirgi bajarilgan labirint yasash pog'onasidagi 2-daraja; «daraja yutdi» — 15-qadam o'yinlarida yutilgan darajalar. Sinf: «ta labirint yasaldi» — kamida bitta yasash pog'onasini bajargan bolalar.
10. **Dasturchalar ikki ustunda** (9-dars «Qurishdagi qarorlar» 2 — o'sha sabab).
11. **Saqlash:** bolaning 2-darajasi noutbukda (`jr-labirint-daraja2` — keyingi darslar ham o'qiydi), dasturi — dars kaliti bilan; jonli darsda serverda saqlash — LMS bilan, modul tugagach (93-qaror).
12. **1-qadam kartasi** (bola noutbukida): 9-darsdagi o'yin saqlangan bo'lsa — «O‘yiningiz ochildi: 1 ta labirint», aks holda — «Tayyor o‘yin ochildi: to‘rt strelka, qoida va labirint».
13. **Ikki sarlavha qisqardi** (setka darvozasi, 71-qaror): huk «O‘yinga ikkinchi labirintni qanday qo‘shamiz?» uch qator bo'lardi — **«Ikkinchi labirintni qanday qo‘shamiz?»**; 16-qadam «Do‘stingiz o‘yinini o‘ynang» chap ustunga sig'madi — **«Do‘stingiz o‘ynasin»** (qadam nomi bilan bir); tayanch gaplar o'zgarmadi. 16-qadamda bola noutbukida — strelkalar rasmi; solo'da ishora «Kimgadir o‘ynating — uydagilardan biri o‘ynasa bo‘ladi».
