# 19-dars. Bloklar ortidagi kod: «Kodini ko'rsat»

> **Holat: v1 — QORALAMA (22.11 tun, bosh seans; «Savollar» 1–10 tavsiya A bo'yicha yozildi — foydalanuvchi javobi kutilmoqda, qurish tavsiya bo'yicha).** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/019-bloklar-ortidagi-kod/`) shundan quriladi.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–18-dars bilan bir xil (`001-tanishuv.md`: 'Ekranlar ko'rinishi', 'Yordam va xato', 'Tovush', 'Solo' bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 19-dars («Bloklar ortidagi kod: «Kodini ko'rsat»», yangi mavzu — natija: o'z o'yinining JavaScript kodini ko'radi va kodda 2 ta sonni o'zgartiradi; o'rganadi: har blok bitta JavaScript qatoriga mos kelishini ko'radi; nega: 3-modulda JavaScript notanish til emas, tanish bloklar yozuvi bo'lib boshlanadi; tekshiruv: blok ↔ kod moslash, avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida).
> 18-darsdagi va'da: «Keyingi darsda o‘yiningizning kodini ko‘ramiz — bloklar ortida nima bor.» O'yin — 18-darsda saqlangan kosmik o'yin (uch personaj); saqlanmagan bo'lsa — tayyor (18-dars namunasi).

## Pasport

- **Dars turi:** yangi mavzu. Yangi blok yo'q. Yangi so'z bitta — «kod» («Savollar» 2). Studiyaga yangi tugma — «Kodini ko‘rsat» (**KOD** 1): dastur ustuni yonida shu personaj dasturining JavaScript kodi.
- **Natija (dasturdan):** o'z o'yinining JavaScript kodini ko'radi va kodda 2 ta sonni o'zgartiradi. **Bu manbada:** 1-bekatda blok va kod qatorini moslaydi (blokni bosadi — qatori yonadi, qatorni bosadi — bloki yonadi); 2-bekatda kodda sonni o'zgartiradi (dushmanlar soni, ball, jon) — blok ham o'zi o'zgaradi, o'yin yangi son bilan o'ynaladi; 3-bekatda faqat kodni o'qib, raketa qayerga borishini oldindan aytadi.
- **Bola nimani tushunadi:** bloklar — dasturning bir ko'rinishi, kod — ikkinchi ko'rinishi; ikkalasi bitta dastur. Har blok — bitta qator. Kompyuter aslida kodni bajaradi. Kodda son o'zgarsa — blokda ham, o'yinda ham o'zgaradi.
- **Tekshiruv (dasturdan):** blok ↔ kod moslash (avto) — 1-bekat pog'onalari; kodda 2 ta son o'zgardi (avto) — 2-bekat; natijani oldindan aytish (avto) — 3-bekat.
- **Vaqt:** reja 68 daqiqa, zaxira 12–22 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamga.
- **Uch bekat:** 1 · Blok va qator — 2 · Kodda son — 3 · Kodni o‘qiymiz. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda raketada Coddy; bola ishlaganda raketa oynachasida o'z qahramoni (94-qaror). Dastur ustunida uch personaj kartasi (18-dars): «Raketa» · «O‘q» · «Dushman».
- **Oldingi darslar bilan bog'lanish:** 18-dars — uch personajli kosmik o'yin (saqlangan); 3-dars — koordinata, natijani oldindan aytish (bayroqcha); 5-dars — `repeat`; 11–12-dars — `ball`, `jon`; 13-dars — `random`; 16-dars — klon. 1-dars manbasidagi so'z: «kod (bloklar ortida …)» — shu darsda.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–1:30 | Kiradi, o'z kosmik o'yinini ko'radi, «Tayyorman»ni bosadi | 1 |
| 1:30–7 | Savolga javob beradi: dasturni yozuv bilan qanday yozamiz? Sinf uchalasini sinaydi: «o‘ngga yur» — kompyuter tushunmaydi; «→» — belgi, buyruq emas; `moveRight();` — raketa yurdi | 2–4 |
| 7–8 | Yangi so'z: kod | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10:30 | Ustoz «Kodini ko‘rsat»ni bosadi, blok va qatorni ko'rsatadi | 7 |
| 10:30–21 | O'z o'yinining kodini ochadi; blokning qatorini, qatorning blokini topadi; ★ da yangi blok — yangi qator | 8 |
| 21–23 | Ustoz kodda sonni o'zgartiradi — blok ham o'zgaradi | 9–10 |
| 23–34 | Kodda son o'zgartiradi: dushmanlar soni, ball, jon; ★ da o'z o'yini | 11 |
| 34–36 | Xulosa: bitta dastur — ikki ko'rinish | 12 |
| 36–39 | Ustoz kodni o'qib, raketa qayerga borishini aytadi | 13–14 |
| 39–55 | Kodni o'qiydi va oldindan aytadi; ★ da kodni o'zi tuzatadi | 15 |
| 55–60 | O'z kodidan bitta qatorni sinfga o'qib beradi | 16 |
| 60–68 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10:30 da, birinchi natijasi (1-pog'ona: kod ochildi) — 11-daqiqada (12-bo'lim 1-band).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| kod | dastur yozuv ko'rinishida: har blok — bitta qator | 5 (va 12, 17) | uch bo'lak birma-bir: `move right` bloki → uning qatori `moveRight();` → raketa dasturi bloklarda va kodda yonma-yon, yozuv «Bitta dastur — ikki ko‘rinish» |

Yordamchi so'zlar (ta'rifsiz, tushunarli): qator, yozuv, JavaScript (tilning nomi — «kod tili»), son. 1–18-darsdan: blok, dastur, dasturcha, personaj, hodisa, takrorlash, o'zgaruvchi, ball, jon, shart, nusxa (klon), random, X va Y, bayroqcha.
Bir ma'noga bitta so'z: «kod» (dasturning yozuvi; «matn», «skript» deyilmaydi); «qator» (kodning bir satri; «satr» emas); «Kodini ko‘rsat» (tugma; «kodga o‘tish» emas).
Bu darsda AYTILMAYDI (keyingi darslarniki): `for`, «sikl» (80-dars), `let`, «qiymat» (3-modul), `if / else` (56-dars), `===` va taqqoslash (55-dars), `Math.random` (85-dars), «funksiya», «qavs», «nuqtali vergul» — ustoz bu belgilarni «kodning tinish belgilari» deb bir marta aytadi, nomlamaydi.

## Studiya: «Kodini ko‘rsat» va kod

**«Kodini ko‘rsat»** (**KOD** 1) — dastur ustunining tepasida, sarlavha yonida tugma; bosilsa — dastur ustunining o'ng yonida (javon va dastur orasida emas, dastur ustunining ichida, bloklar ostida emas — yonma-yon: chapda bloklar, o'ngda kod) kod oynasi ochiladi, tugma yozuvi «Kodni yopish» bo'ladi; yana bosilsa — yopiladi. Kod oynasi — to'q fon, monospace yozuv, qator raqamlari chapda. Kod — tanlangan personajning dasturi; personaj almashsa — kod ham almashadi.

**Kod qatorlari** (**KOD** 2 — kod yasovchi; har blok — bitta qator, ichiga oladigan blok — ochiluvchi va yopiluvchi qator):

| Blok | Kod qatori |
|---|---|
| `when ▶ clicked` | `onStart(() => {` … `});` |
| `when → key pressed` (← ↑ ↓ space) | `onKey("right", () => {` … `});` («left», «up», «down», «space») |
| `when touching enemy` | `onTouch("enemy", () => {` … `});` |
| `when I start as a clone` | `onClone(() => {` … `});` |
| `move right` · `move left` · `move up` · `move down` | `moveRight();` · `moveLeft();` · `moveUp();` · `moveDown();` |
| `go to x: 3 y: 0` | `goTo(3, 0);` |
| `go to x: (random 0 to 6) y: 4` | `goTo(random(0, 6), 4);` |
| `repeat 4` | `for (let i = 0; i < 4; i++) {` … `}` |
| `create clone of myself` · `delete this clone` | `createClone();` · `deleteClone();` |
| `set ball to 0` | `ball = 0;` |
| `change ball by 1` · `change jon by -1` | `ball = ball + 1;` · `jon = jon - 1;` |
| `if jon = 0 then` | `if (jon === 0) {` … `}` |
| `game over` | `gameOver();` |
| `play sound qadam` | `playSound("qadam");` |

Yopiluvchi qatorlar (`});`, `}`) — xira (blok emas). Dasturchalar orasida bo'sh qator.

**Blok ↔ qator** (**KOD** 3): kod ochiq bo'lsa, dastur ustunidagi blok bosilsa — blok tanlanadi (95-qaror, coral hoshiya) va kodda uning qatori yonadi (coral fon); kod qatori bosilsa — o'sha qator va uning bloki yonadi. Bosish dasturni o'zgartirmaydi.

**Kodda son** (**KOD** 4): kod ochiq bo'lsa, qatordagi sonlar — oq kapsula (blokdagidek); son bosilsa — blokdagi o'sha son ro'yxati ochiladi (o'sha sonlar); tanlansa — kodda ham, blokda ham son o'zgaradi. Sanoq: «Kodda o‘zgargan son: N».

**Kod — o'yinda:** o'yin («▶ Boshlash») kod ochiq bo'lganda ham ishlaydi; bajarilayotgan blokning qatori ham yonadi (sariq — bloklardagidek).

**Topshiriqlar** (har biri dastur bilan simulyatsiya qilinadi — `sinov/dvigatel/kod.mjs`, **KOD** 7):

| Joy | Topshiriq | Personaj | Tayyor | Bola nima qiladi | Tekshiruv |
|---|---|---|---|---|---|
| Huk (2–4) | dasturni yozuv bilan | — | → bosilsa raketa yursin | A «o‘ngga yur» · B «→» · C `moveRight();` | — |
| 7 (ustoz) | «Kodini ko‘rsat» | Raketa | 18-dars o'yini | ochadi, blok bosadi — qator yonadi | — |
| 8 · 1 | «Kodni oching» | hammasi | o'z o'yini | «Kodini ko‘rsat», uch personaj kodini ko'radi | uchala personaj kodi ochildi |
| 8 · 2 | «Qaysi qator?» | Dushman | o'z o'yini | belgilangan blokning qatorini bosadi (3 marta) | 3 ta to'g'ri qator |
| 8 · 3 | «Qaysi blok?» | O'q | o'z o'yini | belgilangan qatorning blokini bosadi (3 marta) | 3 ta to'g'ri blok |
| 8 · ★ | «Yangi qator» | Raketa | o'z o'yini | raketa dasturiga `play sound` qo'yadi — kodda yangi qator | kodda `playSound` |
| 10 (ustoz) | kodda son | Dushman | o'z o'yini | `i < 5` dagi 5 ni 8 qiladi — blokda ham 8, o'ynaydi — 8 dushman | — |
| 11 · 1 | «Ko‘p dushman» | Dushman | o'z o'yini | kodda dushmanlar sonini 8 qiladi, o'ynaydi | `repeat` soni ≥ 8 va o'ynaldi |
| 11 · 2 | «Ikki ball» | O'q | o'z o'yini | `ball = ball + 1;` → `+ 2`, o'ynaydi | bitta dushman — ball +2 |
| 11 · 3 | «Ko‘proq jon» | Raketa | o'z o'yini | `jon = 3;` → `5`, o'ynaydi | o'yin boshida jon 5 |
| 11 · ★ | «O‘z sonlaringiz» | hammasi | o'z o'yini | kodda yana ikki sonni o'zgartiradi va yutadi | 2 son o'zgardi, yutdi |
| 14 (ustoz) | kodni o'qish | Raketa | `goTo(1, 0);` `moveRight();` `moveRight();` | bayroqcha (3, 0) ga, «Tekshiramiz» | — |
| 15 · 1 | «Ikki qadam» | Raketa | `goTo(0, 0);` `moveRight();` `moveRight();` `moveUp();` | bayroqcha qo'yadi | (2, 1) |
| 15 · 2 | «Takrorlash» | Raketa | `goTo(1, 0);` `for … < 4 …` [`moveRight();`] | bayroqcha | (5, 0) |
| 15 · 3 | «Orqaga» | Raketa | `goTo(6, 2);` `for … < 3 …` [`moveLeft();`] `moveUp();` | bayroqcha | (3, 3) |
| 15 · ★ | «Nishonga» | Raketa | `goTo(0, 0);` `for … < 2 …` [`moveRight();`] `moveUp();` | kodda sonni o'zgartiradi — raketa ★ (5, 1) ga borsin | raketa (5, 1) da |

3-bekatning 1–3-pog'onasida bloklar yashirin — dastur ustunida faqat kod (**KOD** 5: «faqat kod» rejimi; «Tekshiramiz»dan keyin bloklar ham ko'rinadi). ★ pog'onada bloklar ko'rinib turadi: koddagi son bosilganda Blockly ro'yxati bloklar ustunida ochiladi, yashirin ustunda u ko'rinmaydi (22.11, to'liq sinovda topildi).

## Yordam va xato

1–18-darsdagidek. Bu darsdagi farqlar:

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Kamvoy | 8 · 2 — boshqa qator bosildi | «Bu boshqa qator!» | «Belgilangan blokka qarang: uning so‘zi qaysi qatorda?» |
| Kamvoy | 8 · 3 — boshqa blok bosildi | «Bu boshqa blok!» | «Qatordagi so‘zga qarang: qaysi blok shunday?» |
| Kamvoy | 11 — son o'zgarmadi | «Oz qoldi!» | «Kodda son o‘zgarmadi — qatordagi sonni bosing» |
| Kamvoy | 15 — bayroqcha boshqa katakda | «Boshqa katak!» | 3-dars gapi — qahramonning haqiqiy manzili bilan (Qahramon … da to‘xtadi. Dasturni qaytadan sanang: X qancha, Y qancha) |
| Kamvoy | pog'ona sharti bajarilmadi | «Oz qoldi!» | pog'onaning o'z gapi |

Muammocha raketani yopmaydi (91-qaror). Xato qatorda «xato» so'zi yo'q (98-qaror).

---

## 1 · Kirish

- **Vaqt:** 0:00–0:01:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «19-dars · Bloklar ortidagi kod», sarlavha «Bloklar <em>ortida</em> nima bor?». Coddy: «Salom! Bugun bloklar ortiga qaraymiz.» O'ngda «Kosmos» maydoni: raketa, o'q, dushman. Pastda kichik karta «O‘tgan darsda»: uch personaj kartasi — «Kosmik o‘yin tayyor bo‘ldi». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda kosmik o‘yinimiz to‘liq bo‘ldi.»
  2. «Bugun o‘yinimizning ichiga qaraymiz: bloklar ortida nima bor?»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** o'yin saqlanganini aytadi — bugun o'sha o'yinning kodini ko'ramiz.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «19-dars · Bloklar ortidagi kod», «Salom, Aziz!»; asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: dasturni yozuv bilan qanday yozamiz?

- **Vaqt:** 0:01:30–0:03:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror).
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Dasturni <em>yozuv</em> bilan qanday yozamiz?». Maydonda raketa. Chapda blok `when → key pressed` [`move right`]. Coddy: «Shu bloklarni yozuv bilan yozsak — qanday bo‘ladi?» Uchta karta: A «o‘ngga yur» · B «→» · C `moveRight();`. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Bloklarni yozuv bilan yozsak — qanday bo‘ladi?»
  2. «Har kim noutbukida bitta kartani tanlasin.»
- **O'z so'zi bilan:** kartalarni o'qiydi; sinf javoblarini o'qiydi (faqat son).
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi yozuvni kompyuter bajaradi?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang».
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yozuvlarni sinayapti — kuzating»)
- **Sahna:** har karta o'zi sinaladi (16–18-darsdagidek; **KOD** 6): yozuv kod oynasiga tushadi, → bosiladi.
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A: «o‘ngga yur» kod oynasida, → — raketa joyida; kartada «✕ kompyuter bu so‘zni bilmaydi».
  2. «Keyingi» — B: «→» — raketa joyida; kartada «✕ belgi — buyruq emas».
  3. «Keyingi» — C: `moveRight();` — qator yonadi, raketa bitta katak o'ngga; kartada «✓ raketa yurdi».
- **Tayanch gaplar:**
  1. «Kompyuter faqat o‘z so‘zlarini biladi. Bu so‘zlar — JavaScript tilida.»
  2. «moveRight — «o‘ngga yur» degani. Kompyuter shuni bajaradi.»
- **O'z so'zi bilan:** inglizcha so'zni o'zbekchaga o'giradi: move — yur, right — o'ng.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: har blok — bitta qator

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Har blok — <em>bitta qator</em>». A va B xira, C oltin; chapda blok `move right` va qator `moveRight();` yonma-yon. Coddy: «Bloklar ortida kod turadi.»
- **Tayanch gaplar:**
  1. «Har blok ortida bitta qator bor. Kompyuter aslida shu qatorlarni bajaradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: kod

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z (uch bo'lak birma-bir, `raqam` ishi) · bola «Ustoz ekraniga qarang» («Yangi so‘z: kod»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Kod <em>nima</em>?». Coddy: «Kod — dastur yozuv ko‘rinishida.» Uch bo'lak xira.
  2. «Keyingi» — 1-bo'lak: blok `move right`, ostida «Blok».
  3. «Keyingi» — 2-bo'lak: qator `moveRight();`, ostida «Qator».
  4. «Keyingi» — 3-bo'lak: raketa dasturi — chapda bloklar, o'ngda kod; yozuv «Bitta dastur — ikki ko‘rinish». Ostida ta'rif: «Kod — Dastur yozuv ko‘rinishida: har blok — bitta qator».
- **Tayanch gaplar:**
  1. «Kod — dastur yozuv ko‘rinishida. Har blok — bitta qator.»
  2. «Bloklar — kodning rasmli ko‘rinishi. Katta dasturchilar kodni o‘zi yozadi.»
- **O'z so'zi bilan:** 3-modulda kodni o'zlari yozishini aytadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima <em>qilamiz</em>?». Tepalik: 1 · Blok va qator → 2 · Kodda son → 3 · Kodni o‘qiymiz; cho'qqida kichik karta «Dars oxirida · kodni o‘qiysiz». Coddy: «Uchta bekat. Oxirida kodni o‘qiysiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: blok va qator, kodda son, kodni o‘qish.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: «Kodini ko‘rsat»

- **Vaqt:** 0:09–0:10:30 (1,5 daqiqa)
- **Bekat:** 1 · Blok va qator
- **Ekran:** proyektor — Blok studiya (ustoz; uch personaj dasturi tayyor, «Raketa» tanlangan) · bola «Ustoz ekraniga qarang» («Ustoz kodni ochyapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Kodini ko‘rsat»ni bosadi — dastur ustunida bloklar yonida kod.
  2. Ustoz `move right` blokini bosadi — `moveRight();` qatori yonadi; `onKey("right", () => {` qatorini bosadi — `when → key pressed` bloki yonadi.
  3. Ustoz «Dushman» kartasini bosadi — kod ham almashadi.
- **Tayanch gaplar:**
  1. «Kodini ko‘rsat — dasturning yozuvi chiqadi.»
  2. «Blokni bosaman — uning qatori yonadi. Qatorni bosaman — bloki yonadi.»
- **Ustoz qiladi:** bosadi, ko'rsatadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · O'zingiz: blok va qator

- **Vaqt:** 0:10:30–0:21 (10,5 daqiqa)
- **Bekat:** 1 · Blok va qator
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'z o'yini), zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Qatorni <em>toping</em>!». Coddy: «Blok va qatorni moslang.» Chapda «Uch pog‘onani tugatdi 4 / 14»; o'ngda zinapoya: 1 «Kodni oching» · 2 «Qaysi qator?» · 3 «Qaysi blok?» · ★ «Yangi qator». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Blokning so‘zi qatorda ham bor: move right — moveRight.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; uch personaj kartasi; o'z o'yini.
  - 1 «Kodni oching» — «Uchala personajning kodini oching».
  - 2 «Qaysi qator?» — «Belgilangan blokning qatorini bosing» (sanoq «Topildi: N / 3» — N: nechtasi topildi).
  - 3 «Qaysi blok?» — «Belgilangan qatorning blokini bosing» (sanoq «Topildi: N / 3» — N: nechtasi topildi).
  - ★ «Yangi qator» — «Raketa dasturiga play sound qo‘shing — kodda nima paydo bo‘ladi?».
- **Bola qiladi:** kodni ochadi, moslaydi.
- **Tekshiruv:** ochilgan kodlar / to'g'ri topilgan qator va bloklar / yangi qator (avto).

## 9 · 2-bekat

- **Vaqt:** 0:21–0:21:30 (0,5 daqiqa)
- **Bekat:** 2 · Kodda son
- **Ekran:** proyektor — reja tepaligi (1 ✓) · bola «Ustoz ekraniga qarang» («2-bekat: kodda son»)
- **Qadamlar:**
  1. Tepalik; 1 · Blok va qator ✓; Coddy 2-bekatda. Coddy: «Endi kodda sonni o‘zgartiramiz.»
- **Tayanch gaplar:**
  1. «Blok va qatorni moslay olamiz. Endi kodning o‘zini o‘zgartiramiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: kodda son

- **Vaqt:** 0:21:30–0:23 (1,5 daqiqa)
- **Bekat:** 2 · Kodda son
- **Ekran:** proyektor — Blok studiya (ustoz; o'yin tayyor, «Dushman» tanlangan, kod ochiq) · bola «Ustoz ekraniga qarang» («Ustoz kodni o‘zgartiryapti — kuzating»)
- **Qadamlar:**
  1. Ustoz `for (let i = 0; i < 5; i++) {` qatoridagi 5 ni bosadi, 8 ni tanlaydi — `repeat` blokida ham 8.
  2. «▶ Boshlash» — sakkizta dushman tushadi.
- **Tayanch gaplar:**
  1. «Kodda sonni o‘zgartirdim — blokda ham o‘zgardi. Bu bitta dastur.»
  2. «Bu qatordagi 5 — repeat ning soni: necha marta.»
- **Ustoz qiladi:** sonni o'zgartiradi, o'ynaydi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · O'zingiz: kodda son

- **Vaqt:** 0:23–0:34 (11 daqiqa)
- **Bekat:** 2 · Kodda son
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (o'yin, kod ochiq), zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Kodni <em>o‘zgartiring</em>!». Coddy: «Kodda sonni o‘zgartiring — o‘ynang.» Chapda «Uch pog‘onani tugatdi 5 / 14»; o'ngda zinapoya: 1 «Ko‘p dushman» · 2 «Ikki ball» · 3 «Ko‘proq jon» · ★ «O‘z sonlaringiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Sonni kodda o‘zgartiring, blokda emas.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; kod ochiq; bloklar — o'z o'yini.
  - 1 «Ko‘p dushman» — «Kodda dushmanlar sonini 8 qiling va o‘ynang».
  - 2 «Ikki ball» — «Har dushman 2 ball bersin — kodda o‘zgartiring».
  - 3 «Ko‘proq jon» — «O‘yin 5 jon bilan boshlansin».
  - ★ «O‘z sonlaringiz» — «Kodda yana ikki sonni o‘zgartiring va yuting».
- **Bola qiladi:** kodda sonni o'zgartiradi, o'ynaydi.
- **Tekshiruv:** son o'zgardi va o'yin shu son bilan o'ynaldi (avto).

## 12 · Xulosa: bitta dastur — ikki ko'rinish

- **Vaqt:** 0:34–0:36 (2 daqiqa)
- **Bekat:** 2 · Kodda son
- **Ekran:** proyektor — xulosa (ikki karta) · bola «Ustoz ekraniga qarang» («Xulosa: kod»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «<em>Kod</em>». Ikki karta: bloklar — «Bloklar» «sudrab ulaymiz» · kod — «Kod» «kompyuter shuni bajaradi». Coddy: «Bitta dastur — ikki ko‘rinish.»
- **Tayanch gaplar:**
  1. «Bloklar va kod — bitta dastur. Bittasi o‘zgarsa, ikkinchisi ham o‘zgaradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:36–0:36:30 (0,5 daqiqa)
- **Bekat:** 3 · Kodni o‘qiymiz
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: kodni o‘qiymiz»)
- **Qadamlar:**
  1. Tepalik; 1 ✓, 2 ✓; Coddy 3-bekatda. Coddy: «Endi bloksiz — faqat kod!»
- **Tayanch gaplar:**
  1. «Oxirgi bekat: bloklar yo‘q, faqat kod. Raketa qayerga borishini kodni o‘qib aytamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: kodni o'qiymiz

- **Vaqt:** 0:36:30–0:39 (2,5 daqiqa)
- **Bekat:** 3 · Kodni o‘qiymiz
- **Ekran:** proyektor — Blok studiya (ustoz; faqat kod: `goTo(1, 0);` `moveRight();` `moveRight();`) · bola «Ustoz ekraniga qarang» («Ustoz kodni o‘qiyapti — kuzating»)
- **Qadamlar:**
  1. Ustoz qatorlarni bittadan o'qiydi: (1, 0) ga bor, o'ngga, o'ngga. (3, 0) katagini bosadi — bayroqcha.
  2. «Tekshiramiz» — qatorlar bittadan yonadi, raketa yuradi, bayroqchada to'xtaydi; bloklar ham ko'rinadi.
- **Tayanch gaplar:**
  1. «Kodni o‘qiymiz: har qator — bitta qadam.»
  2. «Avval o‘ylaymiz, keyin tekshiramiz.»
- **Ustoz qiladi:** o'qiydi, bayroqcha qo'yadi, tekshiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · O'zingiz: kodni o'qiymiz

- **Vaqt:** 0:39–0:55 (16 daqiqa)
- **Bekat:** 3 · Kodni o‘qiymiz
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya (faqat kod, maydon), zinapoya 1 · 2 · 3 · ★
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Kodni <em>o‘qing</em>!». Coddy: «O‘qing — keyin tekshiring.» Chapda «Uch pog‘onani tugatdi 6 / 14»; o'ngda zinapoya: 1 «Ikki qadam» · 2 «Takrorlash» · 3 «Orqaga» · ★ «Nishonga». Panelda: «Yordam so‘radi: 1 ta noutbuk».
  2. Oxirida: «To‘xtadik. Qo‘llar klaviaturadan.»
- **Tayanch gaplar:**
  1. «Barmog‘ingiz bilan qatorlarni bittadan o‘qing.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur ustunida faqat kod; maydonda raketa.
  - 1 «Ikki qadam» — «Raketa qayerda to‘xtaydi? Katakni bosing».
  - 2 «Takrorlash» — «Raketa qayerda to‘xtaydi? Katakni bosing».
  - 3 «Orqaga» — «Raketa qayerda to‘xtaydi? Katakni bosing».
  - ★ «Nishonga» — «Kodda sonni o‘zgartiring — raketa yulduzga borsin».
- **Bola qiladi:** kodni o'qiydi, bayroqcha qo'yadi, tekshiradi.
- **Tekshiruv:** bayroqcha to'g'ri katakda / raketa yulduzda (avto).

## 16 · Kodingizni o'qib bering

- **Vaqt:** 0:55–1:00 (5 daqiqa)
- **Bekat:** 3 · Kodni o‘qiymiz
- **Ekran:** proyektor — Blok studiya (ustoz; kosmik o'yin, kod ochiq) · bola — oxirgi yechgan pog'onasi (A·1)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Kodingizni <em>o‘qib bering</em>». Coddy: «Bitta qatorni o‘qing — men blokini topaman.» Bola o'z kodidan bitta qatorni o'qiydi, ustoz blokini topadi. Proyektorda ism yo'q.
- **Tayanch gaplar:**
  1. «Kim kodidan bitta qatorni o‘qib beradi? Qaysi blok ekan?»
- **Parta:** oxirgi yechgan pog'onasi.
- **Bola qiladi:** o'qib beradi yoki tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 1:00–1:03 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Bloklar ortida — <em>kod</em>!». Bugungi so'z: «Kod — Dastur yozuv ko‘rinishida: har blok — bitta qator». Pastda: ✓ Blok va qator · ✓ Kodda son · ✓ Kodni o‘qiymiz. Kichik karta «Keyingi dars · 20 · Takrorlash va test».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: blok va qator, kodda son, kodni o‘qish.»
  2. «Keyingi darsda modulni takrorlaymiz — kichik test bo‘ladi.»
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Kodni o‘qidim!»; «Siz bugun»: «ta qatorni topdi» · «ta sonni o‘zgartirdi» · «pog‘ona bajardi»; «Keyingi darsda takrorlaymiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi.

## 18 · Sinfimiz bugun

- **Vaqt:** 1:03–1:08 (5 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz <em>bugun</em>». Coddy: «Hammangiz zo‘r ishladingiz!» Jami (ismsiz): «ta qatorni topdi» · «ta sonni o‘zgartirdi» · «pog‘ona bajardi». Panelda «Darsni yakunlash».
  2. «Darsni yakunlash» — «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda takrorlaymiz!».
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–18-darsdagidek (88-qaror). Farqi: 3-qadamda uchala kartani bola o'zi sinaydi; 7-, 10-, 14-qadamda ekran tayyor (bola o'zi bosadi); 16- va 18-qadam yo'q. 18-darsda saqlangan o'yin bo'lmasa — tayyor o'yin.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-019-bloklar-ortidagi-kod-v1`, kalit `jr019` (**KOD**: modul tugagach, 93-qaror).
- Yutuqlar: «Kod o‘quvchi» (`kodchi`) — 1-bekatning 3-pog'onasi (blok ↔ qator); «Kod ustasi» (`kodusta`) — 2-bekatning 3-pog'onasi (kodda 2 ta son — dasturdagi natija).

## Darsdan oldin (ustoz uchun)

- **Bugungi asosiy fikr:** bloklar va kod — bitta dastur, ikki ko'rinish. Har blok — bitta qator; kompyuter kodni bajaradi.
- **«Kodini ko‘rsat»** — dastur ustunidagi tugma. Kodda sonni bosib o'zgartirsa bo'ladi — blok ham o'zgaradi.
- Kodning tinish belgilari (qavs, nuqtali vergul) nomlanmaydi: «kodning tinish belgilari, kompyuterga kerak». `for`, `let`, `===` — tushuntirilmaydi: «bu qatordagi 5 — necha marta».
- Yechimni aytmang: «Blokning so‘zi qatorda qanday yozilgan? Qaysi qatorda son bor? Raketa birinchi qatordan keyin qayerda?»

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **«Kodini ko‘rsat»** — studiya tugmasi va kod oynasi (dastur ustuni ichida, bloklar yonida); personaj almashsa kod ham.
2. **Kod yasovchi** — Blockly dasturi → qatorlar (jadvaldagidek; har qator — o'z bloki bilan bog'liq).
3. **Blok ↔ qator** — bosilsa ikkalasi yonadi; o'yinda bajarilayotgan qator ham yonadi.
4. **Kodda son** — kapsula, bosilsa blokdagi ro'yxat; tanlansa blok ham o'zgaradi.
5. **«Faqat kod» rejimi** — bloklar yashirin (3-bekat); «Tekshiramiz»dan keyin bloklar ham.
6. **Huk** — uch karta: yozuv kod oynasida, → bosiladi.
7. **Sinov** `sinov/dvigatel/kod.mjs` — har blok turi uchun qator (jadval), moslash, son tahriri, oldindan aytish.
8. **Natija** — «ta qatorni topdi», «ta sonni o‘zgartirdi».

## Savollar (tavsiya — A)

1. **Kod ko'rinishi — A: haqiqiy JavaScript** (Code.org «Show code» kabi): `moveRight();`, `for (let i = 0; i < 4; i++) {`, `ball = ball + 1;`, `if (jon === 0) {`. 3-modulda xuddi shu yozuv. **B** — soddalashtirilgan (`repeat(4) {`, `if (jon = 0) {`): **−** 3-modulda boshqa yozuvni qayta o'rganadi.
2. **Yangi so'z — A: bitta, «kod».** «JavaScript» — tilning nomi (yordamchi). **B** — ikki so'z: kod va JavaScript.
3. **Kod oynasi joyi — A: dastur ustuni ichida, bloklar yonida** (blok va qator ko'z oldida yonma-yon). **B** — sahna o'rnida: **−** o'yin ko'rinmaydi.
4. **Asos o'yin — A: 18-darsdagi o'z kosmik o'yini** (dasturdagi «o'z o'yinining kodi»). **B** — yangi kichik dastur: **−** «o'z o'yini» yo'qoladi.
5. **Kodda son — A: son bosiladi, blokdagi ro'yxat ochiladi** (xatosiz; harflar yozilmaydi). **B** — klaviatura bilan yozish: **−** qavs va nuqtali vergul buziladi — 9–10 yosh uchun erta.
6. **Kodni klaviatura bilan yozish — A: yo'q** (3-modulda). **B** — bitta qatorni o'zi yozadi.
7. **3-bekat — A: «Kodni o‘qiymiz» (bloksiz, oldindan aytish, 3-dars mexanizmi).** **B** — moslash o'yini (vaqtga).
8. **O'zgaruvchi e'loni (`let ball = 0;`) — A: kodda yo'q** (har qator — bitta blok). **B** — tepada xira qator.
9. **Natija sonlari — A: «ta qatorni topdi» · «ta sonni o‘zgartirdi» · «pog‘ona bajardi».**
10. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Kod oynasi kengligi: uch ustunli studiyada (javon · dastur · sahna) dastur ustuni bloklar + kod uchun yetadimi — qurishda o'lchanadi (kerak bo'lsa kod ochiqda javon toraytiriladi).
2. Uzun qator (`for (let i = 0; i < 4; i++) {`) dastur ustuniga sig'ishi — 1280 px da.
3. Ruscha matn hali yo'q.
