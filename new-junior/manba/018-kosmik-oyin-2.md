# 18-dars. Kosmik o'yin 2: dushman, ball va jon

> **Holat: v1 — QORALAMA (21.11 kech, bosh seans; «Savollar» 1–10 tavsiya A bo'yicha yozildi — foydalanuvchi javobi kutilmoqda, qurish tavsiya bo'yicha).** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/018-kosmik-oyin-2/`) shundan quriladi.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–17-dars bilan bir xil (`001-tanishuv.md`: 'Ekranlar ko'rinishi', 'Yordam va xato', 'Tovush', 'Solo' bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 18-dars («Kosmik o‘yin 2: dushman, ball va jon», loyiha — natija: to'liq ishlaydigan kosmik o'yin; o'rganadi: klon, shart va o'zgaruvchini birlashtiradi; nega: modul mavzulari bitta ishda uchrashadi; tekshiruv: chek-list).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida).
> **Loyiha juftligining ikkinchi darsi** (17-dars bilan): o'yin 17-darsda saqlangan dastur bilan ochiladi (raketa va o'q). Saqlanmagan bo'lsa — tayyor dastur (17-dars namunasi).

## Pasport

- **Dars turi:** loyiha (blokli). Yangi blok bitta — `when touching enemy` (11-darsdagi `when touching apple` ning yangi turi). Yangi so'z yo'q: dars uch eski so'zni bitta o'yinda uchrashtiradi — klon (16), o'zgaruvchi (11), shart (8) («Savollar» 2).
- **Natija (dasturdan):** to'liq ishlaydigan kosmik o'yin. **Bu manbada:** 17-darsdagi o'yinga uchinchi personaj — **Dushman** qo'shiladi: u o'zidan nusxa yasaydi, nusxalar tepadan tushadi (16-dars). O'q dushmanga tegsa — ikkalasi o'chadi va `ball` bittaga oshadi (11-dars). Dushman raketaga tegsa — `jon` bittaga kamayadi; jon 0 bo'lsa — `game over` (12-dars). Hamma dushman tushib bo'lsa va jon qolsa — «Siz yutdingiz!».
- **Bola nimani tushunadi:** katta o'yin — eski bloklardan yig'iladi. Har personaj o'z ishini qiladi: dushman — tushadi, o'q — uradi va ball beradi, raketa — yuradi va jonini saqlaydi. Klon ko'p dushman beradi, o'zgaruvchi ball va jonni sanaydi, shart o'yinni to'xtatadi. 
- **Tekshiruv (dasturdan):** chek-list (avto, 17-darsdagidek). 3-bekatda besh band: «Dushmanlar tushadi» · «O‘q urganda ball» · «Tekkanda jon» · «Jon tugasa — o‘yin tugaydi» · «O‘yin yutildi». Beshalasi ✓ — o'yin tayyor. Chek-list LMS natijasiga ham boradi (**KOD**, LMS — modul tugagach, 93-qaror).
- **Vaqt:** reja 68 daqiqa, zaxira 12–22 daqiqa (dars 80–90 daqiqa). Zaxira — 15-qadamdagi to'liq o'yinga.
- **Uch bekat:** 1 · Dushman — 2 · Ball — 3 · Jon. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda raketada Coddy; bola ishlaganda raketa oynachasida o'z qahramoni (94-qaror). Dastur ustunida uch personaj kartasi: «Raketa» · «O‘q» · «Dushman».
- **Oldingi darslar bilan bog'lanish:** 17-dars — personaj, raketa (← →), o'q (space — nusxa, tepaga uchadi, o'chadi), nishonlar, chek-list, saqlangan o'yin; 16-dars — dushman nusxalari (`create clone of myself`, `when I start as a clone`, `go to x: (random 0 to 6) y: 4`, `repeat 4` [`move down`], `delete this clone`); 11-dars — `ball`, `set`, `change`, `when touching apple`; 12-dars — `jon`, `change jon by -1`, `if jon = 0 then`, `game over`; 8-dars — shart. 17-dars yakunidagi va'da: «Keyingi darsda osmondan dushmanlar tushadi — ball va jon ham bo‘ladi.»

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, o'z kosmik o'yinini va tepadagi dushmanni ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–7 | Savolga javob beradi: dushmanni urdik — ballni kim sanaydi? Sinf uchalasini sinaydi: ustoz doskada sanasa — o'yin bilmaydi; har dushmanga alohida ball bloki — nusxalar ko'p, bloklar ham ko'p; o'q tegsa — `ball` o'zgaruvchisi +1 | 2–4 |
| 7–8 | Eslaydi: klon, o'zgaruvchi, shart — bugun uchalasi bitta o'yinda | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz «Dushman» personajini va uning dasturini ko'rsatadi | 7 |
| 10:30–21 | Dushman dasturini tuzadi: bitta, beshta, har xil ustun; ★ da o'q dushmanni uradi | 8 |
| 21–23 | Ustoz ballni ko'rsatadi: o'q dushmanga tekkanda | 9–10 |
| 23–33 | Ball qo'shadi: o'q tekkanda +1, o'yin boshida 0, har dushman 2 ball; ★ da rekord | 11 |
| 33–35 | Xulosa: uch personaj — uch ish | 12 |
| 35–38 | Ustoz jonni ko'rsatadi: dushman raketaga tekkanda, jon tugasa — o'yin tugadi | 13–14 |
| 38–55 | Jon qo'shadi va to'liq o'yinni tugatadi — ro'yxat to'ladi; ★ da o'z o'yini | 15 |
| 55–60 | O'z o'yinini sinfga ko'rsatadi — ustoz o'ynaydi | 16 |
| 60–68 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: bitta dushman tushdi) — 12-daqiqada (12-bo'lim 1-band).

## So'zlar

Darsda yangi so'z yo'q («Savollar» 2). 5-qadam — «Eslaymiz»: uch eski so'z bitta ekranda, har biri bugungi o'yindagi ishi bilan.

| So'z | Ma'nosi (darsdan) | Bugun o'yinda | Rasmi |
|---|---|---|---|
| klon | Dastur ishlab turganda yasalgan nusxa (16-dars) | dushman nusxalari tushadi | uchta tushayotgan dushman |
| o‘zgaruvchi | Nomi bor quti, ichida son (11-dars) | `ball` va `jon` | ikki kapsula «ball: 0» · «jon: 3» |
| shart | Avval tekshiradi, keyin bajaradi (8-dars) | `if jon = 0 then` → `game over` | `if` bloki va «O‘yin tugadi» taxtasi |

Yordamchi so'zlar (ta'rifsiz, tushunarli): dushman, tushadi, uradi, tegadi, ball, jon, rekord. 1–17-darsdan: personaj, raketa, o'q, nusxa (klon), o'zgaruvchi, shart, hodisa, o'yin, ro'yxat «O‘yiningizda:».
Bir ma'noga bitta so'z: «dushman» (tushadigan personaj; 17-darsdagi «nishon» bu darsda yo'q); «tegadi» (dushman raketaga; o'q dushmanga); «uradi» (o'q — dushmanni); «o‘chadi» (nusxa, 16-dars); «ball» va «jon» (o'zgaruvchi nomlari — kod nomi va o'zbekcha so'z bir xil).
Bu darsda AYTILMAYDI: «forever», «touching» sharti (`if touching`), «o‘ldirish», «otishma».

## Maydon, personajlar va bloklar

**Maydon** — 17-darsdagi «Kosmos» (7 × 5). Raketa pastki qatorda (start (3, 0)), o'q — raketa ichida (17-dars). **Dushman** — 16-darsdagi binafsha dushman; asli tepada (3, 4) da turadi, nusxalari `go to` bilan o'z ustuniga boradi va tushadi. **Sahnadagi sonlar** (12-darsdagi kapsulalar): chap yuqorida «ball: 0», «jon: 3» — dasturda ishlatilgan o'zgaruvchilar; o'ng yuqorida «Dushman: N» (16-darsdagi sanoq).

**Uch personaj** (17-dars kartalari, **KOD** 1): «Raketa» · «O‘q» · «Dushman». Har birining o'z dasturi. 1-bekatda «Dushman» kartasi tanlangan.

**Tegish** (**KOD** 2):
- o'q nusxasi dushman nusxasi bilan bir katakka kirsa — ikkalasi o'chadi; o'q dasturidagi `when touching enemy` dasturchasi ishlaydi (bo'lsa);
- dushman nusxasi raketa katagiga kirsa (yoki raketa dushmanga yursa) — dushman o'chadi, raketa silkinadi («tuk»); raketa dasturidagi `when touching enemy` dasturchasi ishlaydi;
- yerga tushgan dushman o'chmasa — 16-darsdagidek «Yerda qolib ketdi!».

**Bloklar** — hammasi javonda (loyiha): Hodisa (`when → key pressed`, `when ▶ clicked`, `when touching enemy` — **yangi tur**), Harakat (`move right`, `move left`, `move up`, `move down`, `go to x: (random 0 to 6) y: 4`), Takrorlash (`repeat`), Klon (`create clone of myself`, `when I start as a clone`, `delete this clone`), O'zgaruvchi (`set ball to 0`, `change ball by 1`), Shart (`if jon = 0 then`), `game over`.

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon |
|---|---|---|---|
| `when touching enemy` | dushmanga tekkanda | 11-darsdagi `when touching apple` ning yangi turi: tur ro'yxati `apple` · `gold apple` · `cactus` · `enemy` (**KOD** 3). O'q dasturida — o'q dushmanni urganda; raketa dasturida — dushman raketaga tekkanda | **yangi tur**: 10-qadam |
| `set ball to 0` · `change ball by 1` | (11-dars) | `ball` — o'q urganda | 11-darsdan; 10-qadam |
| `set jon to 3` · `change jon by -1` | (12-dars) | `jon` — dushman tekkanda | 12-darsdan; 14-qadam |
| `if jon = 0 then` · `game over` | (12-dars) | jon tugasa — o'yin tugadi | 12-darsdan; 14-qadam |
| klon bloklari, `repeat`, `go to x: (random 0 to 6) y: 4` | (16-dars) | dushman nusxalari | 16-darsdan; 7-qadam |

**O'yin** (17-darsdagidek): «▶ Boshlash» / «■ To‘xtatish»; sahna ustida «O‘yin: ← → va space». `when ▶ clicked` — hamma personajda (raketada — `set`, dushmanda — nusxalar). Dushman nusxalari bittadan, oralig'i bilan chiqadi (**KOD** 4: dushmanning `when ▶ clicked` dasturchasi asta bajariladi — har blokdan keyin 0,9 soniya). O'yin tugashi: hamma dushman nusxasi o'chdi (urildi, raketaga tegdi yoki yerda o'chdi) va jon 0 emas — «Siz yutdingiz!»; `game over` — «O‘yin tugadi».

**Chek-list** «O‘yiningizda:» (3-bekat, **KOD** 5): «Dushmanlar tushadi» (kamida 3 dushman nusxasi tushdi) · «O‘q urganda ball» (o'q dushmanni urdi va ball oshdi) · «Tekkanda jon» (dushman raketaga tegdi va jon kamaydi) · «Jon tugasa — o‘yin tugaydi» (dasturda `if jon = 0 then` → `game over`) · «O‘yin yutildi».

**Dastur** — 17-darsda saqlangan raketa va o'q dasturi (`K+'per'`); yo'q bo'lsa — tayyor. Dushman dasturi 1-bekatda bo'sh boshlanadi (1-pog'onada tayyor bo'lak). Pog'onadan pog'onaga — bolaning o'z dasturi (17-dars `prog: 'per'`). Har personaj dasturida eng ko'pi 10 ta blok.

**Topshiriqlar** (har biri dastur bilan simulyatsiya qilinadi — `sinov/dvigatel/kosmik2.mjs`, **KOD** 7; ▶[…] — `when ▶ clicked`, K[…] — `when I start as a clone`, T[…] — `when touching enemy`, C — `create clone`, D — `delete this clone`, G — `go to x: (random 0 to 6) y: 4`, R4[↓] — `repeat 4` [`move down`]):

| Joy | Topshiriq | Personaj | Tayyor | Yechim (namuna) | Tekshiruv |
|---|---|---|---|---|---|
| Huk (2–4) | dushman bitta, o'q uni uradi | — | — | A: ustoz doskada sanaydi — o'yinda son yo'q; B: har dushmanga alohida ball bloki (beshta dushman — beshta dastur); C: O'q T[change ball by 1] — bitta blok, har urilgan dushman +1 | — |
| 7 (ustoz) | «Dushman» kartasi, dastur bo'sh | Dushman | raketa, o'q (17) | ▶[R3[C]] · K[G R4[↓] D] | — |
| 8 · 1 | «Bitta dushman» | Dushman | K[G R4[↓] D] | + ▶[C] | 1 nusxa tushdi |
| 8 · 2 | «Beshta» | Dushman | ▶[C] · K[G R4[↓] D] | ▶[R5[C]] | 5 nusxa |
| 8 · 3 | «Har xil ustun» | Dushman | ▶[R5[C]] · K[R4[↓] D] | + G (K boshiga) | 5 nusxa, kamida 2 xil ustun (16-dars kabi; «Qurishdagi qarorlar» 3) |
| 8 · ★ | «O‘q uradi» | hammasi | oldingi | o'ynaydi: kamida 3 dushmanni uradi | 3 urildi |
| 10 (ustoz) | ball: o'qqa T[+1], raketaga ▶[set ball 0] | O'q | 1-bekat | O'q T[change ball by 1] | — |
| 11 · 1 | «Ball» | O'q | O'q: bo'sh T | + `change ball by 1` | ball ≥ 1 |
| 11 · 2 | «Boshidan 0» | Raketa | T[+1]; ▶ yo'q | + ▶[set ball to 0]; ikki marta o'ynaydi | ikkinchi o'yin 0 dan |
| 11 · 3 | «Har dushman — 2 ball» | O'q | T[+1] | +1 → +2 | ball = 2 × urilgan |
| 11 · ★ | «Rekord» | hammasi | oldingi | bitta o'yinda ball ≥ 8 | ball ≥ 8 |
| 14 (ustoz) | jon: raketaga ▶[set jon 3], T[−1; if jon = 0 → game over] | Raketa | 2-bekat | o'ynaydi, ataylab tegadi — jon 0 — «O‘yin tugadi» | — |
| 15 · 1 | «Jon» | Raketa | ▶[set jon to 3] · T[ ] | + `change jon by -1` | tegdi — jon 2 |
| 15 · 2 | «O‘yin tugaydi» | Raketa | T[−1] | + `if jon = 0 then` → `game over` | jon aynan 0 da tugadi |
| 15 · 3 | «To‘liq o‘yin» | hammasi | oldingi | yutadi: jon > 0, ball ≥ 3 | ro'yxat 5 / 5 |
| 15 · ★ | «O‘z o‘yiningiz» | hammasi | oldingi | kamida 8 dushman (repeat soni), o'zi o'ynab yutadi | 8+ dushman, yutdi |

## Yordam va xato

1–17-darsdagidek. Bu darsdagi farqlar:

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | dushman dasturida `create clone` yo'q | «Dushman qani?» | «Dushman nusxasini create clone of myself yasaydi — Dushman dasturida» |
| Kamvoy | o'q urdi, ball o'zgarmadi | «Ball qani?» | «O‘q dushmanni urdi. O‘q dasturida when touching enemy ostiga — change ball by 1» |
| Kamvoy | ikkinchi o'yin eski balldan boshlandi | «Eski ball!» | «O‘yin boshida ball 0 bo‘lsin — set ball to 0» |
| Kamvoy | dushman tegdi, jon o'zgarmadi | «Jon qani?» | «Dushman tegdi. Raketa dasturida when touching enemy ostiga — change jon by -1» |
| Kamvoy | jon 0 — o'yin davom etyapti | «Jon tugadi-ku!» | «Jon 0 bo‘lsa — o‘yin tugasin: if jon = 0 then → game over» |
| Kamvoy | dushman yerda qoldi | «Yerda qolib ketdi!» | «Tushib bo‘lgan dushman o‘chsin — delete this clone» (16-dars) |
| Kamvoy | pog'ona sharti bajarilmadi | «Oz qoldi!» | pog'onaning o'z gapi |

Muammocha raketani yopmaydi (91-qaror). «O‘yin tugadi» — muammo emas (12-dars): yana o'ynasa bo'ladi.

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «18-dars · Kosmik o‘yin 2», sarlavha «Dushmanlar <em>keldi</em>!». Coddy: «Salom! Bugun o‘yinimiz to‘liq bo‘ladi.» O'ngda «Kosmos» maydoni: pastda raketa, tepada binafsha dushman. Pastda kichik karta «O‘tgan darsda»: raketa va o'q — «Personaj — O‘yindagi har bir qatnashchi: o‘z rasmi va o‘z dasturi bor». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda raketa o‘q otdi.»
  2. «Bugun osmondan dushmanlar tushadi. O‘yinda ball va jon bo‘ladi.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** o'tgan darsdagi o'yin saqlanganini aytadi — bugun shu o'yinni tugatamiz.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «18-dars · Kosmik o‘yin 2», «Salom, Aziz!»; asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: ballni kim sanaydi?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror).
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Ballni <em>kim</em> sanaydi?». Maydonda raketa, tepada dushman. Coddy: «O‘q dushmanni urdi. Ball qanday oshadi?» Chapda uchta karta: A «Doskada o‘zimiz sanaymiz» (bo'r va doska) · B «Har dushmanga ball bloki» (beshta dushman, har birida blok) · C «O‘q tegsa — ball +1» (o'q va «ball: 1» kapsulasi). Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «O‘q dushmanni urdi. Ball qanday oshadi?»
  2. «Har kim noutbukida bitta kartani tanlasin.»
- **O'z so'zi bilan:** kartalarni o'qiydi; sinf javoblarini o'qiydi (faqat son).
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Ballni qaysi yo‘l bilan sanaymiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang».
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Sahna:** kartalar o'z dasturi bilan o'zi o'ynaladi (16–17-darsdagidek; **KOD** 6).
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A: o'q dushmanni uradi; sahnada son yo'q, doskada bo'r chizig'i — o'yin ballni bilmaydi. Kartada: «✕ o‘yin bilmaydi».
  2. «Keyingi» — B: beshta dushman, har birining dasturida ball bloki; kartada «5 ta dastur · 10 ta blok». Kartada: «✕ dushman ko‘p — blok ham ko‘p».
  3. «Keyingi» — C: o'q dasturida bitta `when touching enemy` → `change ball by 1`; uch dushman urildi — «ball: 3». Kartada: «✓ bitta blok — har dushman +1».
- **Tayanch gaplar:**
  1. «Biz sanasak — o‘yin bilmaydi. Har dushmanga blok — dushman ko‘p bo‘lsa, blok ham ko‘p.»
  2. «O‘q tegsa — ball +1. Bitta blok hamma dushmanga ishlaydi.»
- **O'z so'zi bilan:** 11-darsdagi olma terishni eslatadi: «olma terilsa — ball +1 edi».
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: o'q tegsa — ball

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «O‘q tegsa — <em>ball</em>». A va B xira, C oltin; maydonda «ball: 3». Coddy: «Ballni o‘yinning o‘zi sanaydi.»
- **Tayanch gaplar:**
  1. «Ballni o‘yin o‘zi sanaydi — o‘zgaruvchi bilan.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Eslaymiz: klon, o'zgaruvchi, shart

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — eslaymiz (uch bo'lak birma-bir, `raqam` ishi) · bola «Ustoz ekraniga qarang» («Eslaymiz: uch so‘z»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Eslaymiz», sarlavha «Bugun uchalasi <em>birga</em>». Coddy: «Uchta so‘z — bitta o‘yin.» Uch bo'lak xira.
  2. «Keyingi» — 1-bo'lak: uch tushayotgan dushman, «Klon — dushmanlar».
  3. «Keyingi» — 2-bo'lak: «ball: 0» · «jon: 3», «O‘zgaruvchi — ball va jon».
  4. «Keyingi» — 3-bo'lak: `if` bloki va «O‘yin tugadi» taxtasi, «Shart — o‘yin tugaydi». O'ngda: «Bugun bitta o‘yinda» — «Klon · O‘zgaruvchi · Shart».
- **Tayanch gaplar:**
  1. «Klon — ko‘p dushman. O‘zgaruvchi — ball va jon. Shart — jon tugasa, o‘yin tugaydi.»
  2. «Hammasini bilasiz. Bugun bitta o‘yinga yig‘amiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima <em>qilamiz</em>?». Tepalik: 1 · Dushman → 2 · Ball → 3 · Jon; cho'qqida kichik karta «Dars oxirida · to‘liq o‘yin». Coddy: «Uchta bekat. Oxirida o‘yin to‘liq bo‘ladi.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: dushman, ball, jon.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: dushman

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Dushman
- **Ekran:** proyektor — Blok studiya (ustoz; raketa va o'q dasturi tayyor; personaj «Dushman» tanlangan, dastur bo'sh) · bola «Ustoz ekraniga qarang» («Ustoz dushman yasayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz uchinchi kartani ko'rsatadi: «Dushman». Dushman dasturi bo'sh.
  2. Ustoz `when ▶ clicked` → `repeat 3` [`create clone of myself`] va `when I start as a clone` → `go to x: (random 0 to 6) y: 4` → `repeat 4` [`move down`] → `delete this clone` qo'yadi; «▶ Boshlash» — uch dushman tushadi, ustoz o'q bilan uradi.
- **Tayanch gaplar:**
  1. «Uchinchi personaj — dushman. Uning dasturi 16-darsdagidek.»
  2. «O‘q dushmanga tegsa — ikkalasi o‘chadi.»
- **Ustoz qiladi:** dushman dasturini tuzadi, o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · O'zingiz: dushman

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Dushman
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'yin), zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Dushmanlar <em>tushsin</em>!». Coddy: «Dushman dasturini tuzing.» Chapda «Uch pog‘onani tugatdi 4 / 14»; o'ngda zinapoya: 1 «Bitta dushman» · 2 «Beshta» · 3 «Har xil ustun» · ★ «O‘q uradi». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Dushman kartasini bosing. Avval asl — nusxa yasaydi, keyin nusxa — tushadi.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; personaj kartalari uchtasi ochiq, «Dushman» tanlangan; raketa va o'q — bolaning 17-darsdagi dasturi.
  - 1 «Bitta dushman» — «▶ bosilganda bitta dushman tushsin».
  - 2 «Beshta» — «Beshta dushman tushsin».
  - 3 «Har xil ustun» — «Dushmanlar har xil ustundan tushsin».
  - ★ «O‘q uradi» — «Uchta dushmanni o‘q bilan uring».
- **Bola qiladi:** dushman dasturini tuzadi, o'ynaydi.
- **Tekshiruv:** nusxalar soni / ustunlar / urilgan dushmanlar (avto).

## 9 · 2-bekat

- **Vaqt:** 0:21–0:21:30 (0,5 daqiqa)
- **Bekat:** 2 · Ball
- **Ekran:** proyektor — reja tepaligi (1 ✓) · bola «Ustoz ekraniga qarang» («2-bekat: ball»)
- **Qadamlar:**
  1. Tepalik; 1 · Dushman ✓; Coddy 2-bekatda. Coddy: «Endi ball — o‘q urganda.»
- **Tayanch gaplar:**
  1. «Dushmanlar tushadi. Endi har urilgan dushman ball beradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: ball

- **Vaqt:** 0:21:30–0:23 (1,5 daqiqa)
- **Bekat:** 2 · Ball
- **Ekran:** proyektor — Blok studiya (ustoz; uch dastur tayyor; personaj «O‘q») · bola «Ustoz ekraniga qarang» («Ustoz ball qo‘shyapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «O‘q» kartasini bosadi va `when touching enemy` qo'yadi; ostiga `change ball by 1`. O'ynaydi — har urilgan dushman: «ball» +1.
  2. Ustoz «Raketa» kartasini bosadi: `when ▶ clicked` → `set ball to 0`. Yana o'ynaydi — ball 0 dan boshlanadi.
- **Tayanch gaplar:**
  1. «when touching enemy — dushmanga tekkanda. O‘q dasturida: o‘q urdi — ball +1.»
  2. «O‘yin boshida ball 0 — set ball to 0.»
- **O'z so'zi bilan:** 11-darsdagi `when touching apple` bilan solishtiradi.
- **Ustoz qiladi:** bloklarni qo'yadi, o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · O'zingiz: ball

- **Vaqt:** 0:23–0:33 (10 daqiqa)
- **Bekat:** 2 · Ball
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'yin), zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Ball <em>yig‘ing</em>!». Coddy: «O‘q urganda ball oshsin.» Chapda «Uch pog‘onani tugatdi 5 / 14»; o'ngda zinapoya: 1 «Ball» · 2 «Boshidan 0» · 3 «Har dushman — 2 ball» · ★ «Rekord». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Ball qaysi personajda oshadi? Kim dushmanni uradi?»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; uch personaj; sahnada «ball: 0».
  - 1 «Ball» — «O‘q urganda ball oshsin».
  - 2 «Boshidan 0» — «Har o‘yin ball 0 dan boshlansin. Ikki marta o‘ynang».
  - 3 «Har dushman — 2 ball» — «Har urilgan dushman 2 ball bersin».
  - ★ «Rekord» — «Bitta o‘yinda 8 ball yig‘ing».
- **Bola qiladi:** ball bloklarini qo'yadi, o'ynaydi.
- **Tekshiruv:** ball soni (avto).

## 12 · Xulosa: uch personaj — uch ish

- **Vaqt:** 0:33–0:35 (2 daqiqa)
- **Bekat:** 2 · Ball
- **Ekran:** proyektor — xulosa (uch karta) · bola «Ustoz ekraniga qarang» («Xulosa: uch personaj»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Uch personaj — <em>uch ish</em>». Uch karta: raketa — «Raketa» «yuradi» · o'q — «O‘q» «uradi va ball beradi» · dushman — «Dushman» «tushadi». Coddy: «Har personaj o‘z ishini qiladi.»
- **Tayanch gaplar:**
  1. «Har personaj o‘z ishini qiladi — birga o‘yin bo‘ladi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:35–0:35:30 (0,5 daqiqa)
- **Bekat:** 3 · Jon
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: jon»)
- **Qadamlar:**
  1. Tepalik; 1 ✓, 2 ✓; Coddy 3-bekatda. Coddy: «Endi jon — ehtiyot bo‘ling!»
- **Tayanch gaplar:**
  1. «Oxirgi bekat: dushman raketaga tegsa — jon kamayadi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: jon

- **Vaqt:** 0:35:30–0:38 (2,5 daqiqa)
- **Bekat:** 3 · Jon
- **Ekran:** proyektor — Blok studiya, o'yin (ustoz; uch dastur tayyor; personaj «Raketa») · bola «Ustoz ekraniga qarang» («Ustoz jonni ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Ustoz raketa dasturiga: `when ▶ clicked` ostiga `set jon to 3`; `when touching enemy` → `change jon by -1` → `if jon = 0 then` → `game over`.
  2. O'ynaydi va ataylab dushman ostida turadi — jon 2, 1, 0 — «O‘yin tugadi». Sahna yonida ro'yxat «O‘yiningizda:» — «Tekkanda jon» va «Jon tugasa — o‘yin tugaydi» ✓.
- **Tayanch gaplar:**
  1. «Raketa dasturida: dushman tegdi — jon −1.»
  2. «Jon 0 bo‘lsa — o‘yin tugaydi. 12-darsdagi shart.»
  3. «Endi o‘zingiz — va yuting!»
- **Ustoz qiladi:** bloklarni qo'yadi, o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · O'zingiz: to'liq o'yin

- **Vaqt:** 0:38–0:55 (17 daqiqa)
- **Bekat:** 3 · Jon
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'yin), zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «O‘yinni <em>tugating</em>!». Coddy: «Jonni qo‘shing — keyin yuting.» Chapda «Uch o‘yinni yutdi 6 / 14»; o'ngda zinapoya: 1 «Jon» · 2 «O‘yin tugaydi» · 3 «To‘liq o‘yin» · ★ «O‘z o‘yiningiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Ro‘yxatdagi besh band — hammasi ✓ bo‘lsin.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** 2-pog'onada jonni ataylab tugatib sinashni aytadi — o'yin aynan 0 da tugashi kerak.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya, o'yin rejimi; sahnada «ball: 0» · «jon: 3»; ro'yxat «O‘yiningizda:».
  - 1 «Jon» — «Dushman tegsa, jon kamaysin».
  - 2 «O‘yin tugaydi» — «Jon 0 bo‘lsa — o‘yin tugasin. Sinab ko‘ring».
  - 3 «To‘liq o‘yin» — «Yuting: kamida 3 ball, jon qolsin».
  - ★ «O‘z o‘yiningiz» — «Kamida 8 ta dushman — yuting».
- **Bola qiladi:** dasturini to'ldiradi, o'ynaydi.
- **Tekshiruv:** chek-list to'liq (avto).

## 16 · O'yiningizni ko'rsating

- **Vaqt:** 0:55–1:00 (5 daqiqa)
- **Bekat:** 3 · Jon
- **Ekran:** proyektor — Blok studiya (ustoz; to'liq o'yin) · bola — oxirgi yechgan pog'onasi (A·1)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «O‘yiningizni <em>ko‘rsating</em>». Coddy: «Siz aytasiz — men o‘ynayman.» Bola o'z o'yini qoidasini aytadi (nechta dushman, ball, jon), ustoz o'ynaydi. Proyektorda ism yo'q.
- **Tayanch gaplar:**
  1. «Kim o‘yinining qoidasini aytib beradi? Nechta dushman? Ball qachon oshadi? Jon qachon kamayadi?»
- **Parta:** oxirgi yechgan pog'onasi.
- **Bola qiladi:** aytib beradi yoki tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 1:00–1:03 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «O‘yin <em>tayyor</em>!». «Bugun bitta o‘yinda»: «Klon · O‘zgaruvchi · Shart» — «Dushman, ball va jon». Pastda: ✓ Dushman · ✓ Ball · ✓ Jon. Kichik karta «Keyingi dars · 19 · Bloklar ortidagi kod».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: dushman, ball, jon. O‘yiningiz tayyor!»
  2. «Keyingi darsda o‘yiningizning kodini ko‘ramiz — bloklar ortida nima bor.»
- **Parta:** yorliq «Sizning natijangiz», sarlavha «O‘yin tayyor!»; «Siz bugun»: «ta dushman urdi» · «ta o‘yin yutdi» · «pog‘ona bajardi»; ro'yxat «O‘yiningizda:»; «O‘yiningiz saqlandi.» (faqat saqlansa); «Keyingi darsda o‘yiningizning kodini ko‘ramiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi.

## 18 · Sinfimiz bugun

- **Vaqt:** 1:03–1:08 (5 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz <em>bugun</em>». Coddy: «Hammangiz zo‘r ishladingiz!» Jami (ismsiz): «ta dushman urdi» · «ta o‘yin yutdi» · «pog‘ona bajardi». Panelda «Darsni yakunlash».
  2. «Darsni yakunlash» — «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda kod bilan!».
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–17-darsdagidek (88-qaror). Farqi: 3-qadamda uchala kartani bola o'zi sinaydi; 7-, 10-, 14-qadamda dastur tayyor (bola o'zi o'ynaydi); 16- va 18-qadam yo'q. 17-darsda saqlangan o'yin bo'lmasa — raketa va o'q tayyor dastur bilan.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-018-kosmik-oyin-2-v1`, kalit `jr018` (**KOD**: modul tugagach, 93-qaror).
- Yutuqlar: «Himoyachi» (`himoyachi`) — 1-bekatning ★ (o'q dushmanni urdi); «Kosmik o‘yinchi» (`kosmik`) — 3-bekatning 3-pog'onasi (to'liq o'yin yutildi).

## Darsdan oldin (ustoz uchun)

- **Bugungi asosiy fikr:** yangi narsa deyarli yo'q — klon, o'zgaruvchi va shart bitta o'yinda uchrashadi. Har personaj o'z ishini qiladi.
- **Uch karta:** «Raketa» · «O‘q» · «Dushman». Ball — o'q dasturida (o'q uradi), jon — raketa dasturida (raketaga tegadi). Bola adashsa: «Kim dushmanni uradi? Kimga dushman tegadi?»
- **Yangi blok bitta:** `when touching enemy` — 11-darsdagi `when touching apple` ning yangi turi.
- 17-darsda o'yini saqlanmagan bola uchun raketa va o'q tayyor keladi — bu xato emas.
- Yechimni aytmang: «Ball qaysi personajda oshadi? O‘yin boshida ball nechchi? Jon 0 bo‘lsa nima bo‘lishi kerak?»

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **Uch personaj** — 17-dars kartalariga «Dushman»; dushman — klon personaji (asli tepada, nusxalari tushadi).
2. **Ikki xil nusxa** bir o'yinda: o'q nusxalari (tepaga) va dushman nusxalari (pastga) — klon.js holati personajga bog'lanadi (hozir bitta).
3. **`when touching enemy`** — `when touching` ning yangi turi (`DARS.dushmanTegish`); o'q dasturida — o'q urganda, raketa dasturida — dushman tekkanda.
4. **Dushmanlar oralig'i** — dushmanning `when ▶ clicked` dasturchasi asta (har blokdan keyin 0,9 soniya).
5. **Chek-list** — besh band.
6. **Huk** — uch karta o'z sahnasi bilan.
7. **Sinov** `sinov/dvigatel/kosmik2.mjs` (har pog'ona — bot o'ynaydi).
8. **Natija** — «ta o‘yin yutdi» (yutilgan o'yinlar; 3-bekatda — chek-list to'liq).

## Savollar (tavsiya — A)

1. **Dushman — A: uchinchi personaj (o'z kartasi va dasturi), 16-darsdagi dastur.** **B** — dushman tayyor (bola dasturlamaydi): **−** «klonni birlashtiradi» yo'qoladi.
2. **Yangi so'z — A: yo'q; 5-qadam — «Eslaymiz» (klon, o'zgaruvchi, shart).** **B** — yangi so'z «o‘yin qoidasi»: **−** 9-darsdagi «qoida» bilan sinonim.
3. **Tegish — A: dvigatel (o'q va dushman bir katakda — ikkalasi o'chadi; dushman raketaga — dushman o'chadi) + `when touching enemy` hodisasi.** **B** — `if touching` sharti va `forever`: **−** ikki yangi blok, 19-darsgacha kerak emas.
4. **Ball — A: o'q dasturida** (kim uradi — o'sha ball beradi). **B** — dushman dasturida (`when touching bullet`): **−** ikki yangi tur.
5. **Jon — A: raketa dasturida, 12-darsdagi `if jon = 0 then` → `game over`.**
6. **Dushmanlar oralig'i — A: dvigatel sekinlashtiradi** (dushmanning ▶ dasturchasi 0,9 soniyalik qadam bilan) — yangi blok (`wait`) kerak emas. **B** — `wait 1 seconds` bloki: **−** yangi blok.
7. **Chek-list — A: besh band** (17-darsdagi to'rt band — ichida bor).
8. **Natija sonlari — A: «ta dushman urdi» · «ta o‘yin yutdi» · «pog‘ona bajardi».**
9. **17-dars dasturi — A: saqlangan bo'lsa — o'shani ochadi, bo'lmasa tayyor.**
10. **Manba v1 tasdig'i.**

## Qurishdagi qarorlar (22.11, sinovlar yozilganda — bosh seans; foydalanuvchi ko'rigiga)

1. **1–2-bekatda «Jon qani?» yo'q.** Dushman raketaga tegsa — dushman o'chadi, raketa silkinadi, gap chiqmaydi; «Jon qani?» faqat 3-bekatda (jon 14-qadamda o'tiladi). Oldin 1-bekatda ham chiqib, bolani hali o'tilmagan `change jon by -1` ga undardi.
2. **«Jon qani?» o'yin oxirida ham qoladi** (3-bekat, jon pog'onalari): tegdi, jon o'zgarmadi — oxirida ham shu gap (ball uchun «Ball qani?» kabi). Oldin oxirida «Ataylab dushman ostida turing» chiqardi — bola tekkan bo'lsa ham.
3. **8 · 3 «Har xil ustun» — kamida 2 xil ustun** (3 emas; 16-darsdagi «xil» bilan bir xil). Besh nusxa tasodifan ikki ustunga tushsa, oldin «5 ta dushman tushsin» chiqardi (beshtasi tushgan bo'lsa ham). Endi: beshtadan kam — «5 ta dushman tushsin»; hammasi bir ustunda — «Hammasi bir ustundan tushdi…».
4. **8 · 3 tayyor dastur** — bolaning saqlangan dushman dasturi emas, jadvaldagi tayyor bo'lak (`go to` siz; `progYoq`, 2- va 3-bekat 1-pog'onasidagidek). Oldin bolaning 2-pog'onadagi dasturida `go to random` bor edi — pog'ona ▶ bilan o'zi yechilardi.
5. **Ochiq savol:** 8 · 3 da tayyor bo'lakda `go to` yo'q, lekin oxirgi gap «Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying» (16-darsdan) — almashtiriladigan son yo'q. Tavsiya: «Hammasi bir ustundan tushdi. Nusxa boshiga go to x: (random 0 to 6) y: 4 qo‘ying».

## Tekshirilmagan joylar

1. Topshiriqlar hali simulyatsiya qilinmagan (qurilganda — `kosmik2.mjs`): tezlik (dushman qadam 0,6 soniya, o'q 0,38 soniya) va jon 3 bilan o'yin yutiladigan bo'lishi.
2. 11 · ★ «Rekord» 8 ball — bot bilan o'lchanadi (dushmanlar soni bolaning dasturidan).
3. Ruscha matn hali yo'q.
