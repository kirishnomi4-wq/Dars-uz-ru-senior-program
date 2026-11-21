# 4-dars. Hodisalar: tugma bosilganda

> **Holat: v1.1 — QORALAMA (2026-11-20; tavsiya bo'yicha qurildi; v1.1 — mustaqil audit tuzatishlari, «Audit tuzatishlari» bo'limi). Foydalanuvchi tasdig'i kutilmoqda.** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/004-hodisalar/`) shundan quriladi. Savollar — oxirida («Savollar»), har birida tavsiya.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–3-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 4-dars («Hodisalar: tugma bosilganda» — natija: personaj strelkalar bilan yuradi; tekshiruv: avto).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida). Maydondagi har topshiriq dastur bilan tekshiriladi (sinov — `sinov/dvigatel/hodisa.mjs`).

## Pasport

- **Dars turi:** yangi mavzu (blokli).
- **Natija (dasturdan):** personaj strelkalar bilan yuradi.
- **Bola nimani tushunadi:** oldingi darslarda dastur «Ishga tushir» bosilganda bir marta, boshidan oxirigacha bajarilardi. Endi dastur **kutadi**: tugma bosilsa — o'sha tugmaning dasturchasi ishlaydi. Tugma bosilishi — **hodisa**. Har tugmaga o'z dasturchasi (o'z «when» bloki bilan); bir tugmani necha marta bossangiz — dasturcha shuncha marta ishlaydi. Qahramonni endi o'yindagidek, o'zingiz boshqarasiz.
- **Tekshiruv (dasturdan):** avto — o'yinda qahramon strelkalar bilan yulduzga (olmalarga) yetdi; hodisa bloklari to'g'ri tugmaga ulangan.
- **Vaqt:** reja 66 daqiqa, zaxira 14–24 daqiqa (dars 80–90 daqiqa). Zaxira — 15-qadamdagi o'yinga.
- **Uch bekat:** 1 · Bitta tugma — 2 · To'rt tugma — 3 · O'yin. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror).
- **3-dars bilan bog'lanish:** 3-darsda bola qahramonni manzilga dastur bilan olib bordi (go to, move); yakunda «Keyingi darsda qahramon strelka tugmalari bilan yuradi» degan va'dani eshitdi. Bu dars o'sha maydonda: dastur endi oldindan hammasini aytmaydi — tugmani kutadi.

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–2 | Kiradi, maydonni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 2–9 | Savolga javob beradi: yulduz har safar boshqa joyda chiqadi — qahramonni unga qanday olib boramiz? Sinf uchalasini sinaydi: tayyor dastur va «Ishga tushir» yulduzga yetmaydi, strelka tugmasi — yetadi. Javob va yangi so'z: hodisa | 2–5 |
| 9–10 | Bugungi rejani ko'radi | 6 |
| 10–12 | Ustoz `when → key pressed` blokini ko'rsatadi | 7 |
| 12–24 | Bitta, keyin ikkita tugmaga dasturcha tuzadi va o'zi o'ynab ko'radi | 8 |
| 24–26 | Ustoz to'rt tugmali boshqaruvni ko'rsatadi | 9–10 |
| 26–38 | To'rt tugma bilan yulduzga va olmalarga boradi | 11 |
| 38–40 | Xulosa: hodisa | 12 |
| 40–55 | Ustoz o'yinni ko'rsatadi; bola «Olma terish» o'yinini tuzadi va o'ynaydi | 13–15 |
| 55–60 | Dasturchalarini sinfga o'qib beradi — ustoz Coddy bilan o'ynaydi | 16 |
| 60–66 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil natijasi — 12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida).

## So'zlar

Darsda bitta yangi so'z kiradi — alohida ekranda, rasm bilan (5-qadam).

| So'z | Bolaga aytiladigan ma'nosi | Qayerda kiradi | Rasmi |
|---|---|---|---|
| hodisa | biror narsa sodir bo'lishi: tugma bosildi — dastur ishga tushadi | 5 (va 12, 17) | uch bo'lak birma-bir: klaviaturadagi → tugmasi bosiladi → `when → key pressed` bloki yonadi → qahramon bitta katak o'ngga yuradi |

Yordamchi so'zlar (ta'rifsiz, tushunarli): tugma, strelka, bosish, kutadi, o'yin, boshqarish. 1–3-darsdan: blok, dastur, buyruq, qahramon, yulduz, olma, qadam, katak, maydon, manzil, ketma-ketlik, pog'ona.
Bir ma'noga bitta so'z: «tugma» (klaviaturadagi; «klavisha» deyilmaydi); «strelka» (→ ← ↑ ↓ tugmalari; «o'q» deyilmaydi — 3-darsda o'q so'zi yo'q edi); «dasturcha» (bitta «when» bloki va uning ostidagi bloklar; «skript» deyilmaydi); «o'yin» (▶ Boshlash bosilgandan ■ To'xtatish gacha — dastur tugmani kutadigan payt); «hodisa» (tugma bosilishi — bu darsda faqat shu).
Bu darsda AYTILMAYDI (keyingi darslarniki): takrorlash (5-dars), kostyum, tovush bloklari (7-dars), shart (8-dars), o'zgaruvchi (11-dars), sichqoncha hodisasi va «click» (JavaScript'da keyin).

## Maydon va bloklar

Maydon — 3-darsdagi bog' (7 × 5, X va Y sonlari, daraxt va gullar — bezak, qahramon ostida «(x, y)» yorlig'i). Qahramon maydon chetidan chiqmaydi — chetda turtilib turadi, «tuk» (o'yin to'xtamaydi; muammocha chiqmaydi — bola boshqa strelkani bosadi).

**Bloklar** — ikki oila: yangi **Hodisa** (to'q sariq) va Harakat (ko'k). Gap (binafsha) — javonda boshidan bor, faqat 15 · ★ da kerak bo'ladi (savol 4·8).

| Blok | O'zbekcha ma'nosi (ustoz bir marta aytadi) | Nima qiladi | Qachon ochiladi |
|---|---|---|---|
| `when → key pressed` | → tugmasi bosilganda | **boshli blok**: tepasida ulanadigan joy yo'q — dasturcha shundan boshlanadi; ostidagi bloklar shu tugma bosilganda bajariladi. Tugma bosib tanlanadi: → ← ↑ ↓ space (**KOD**) | **yangi**: 7-qadam |
| `move right` · `move left` · `move up` · `move down` | o'ngga · chapga · tepaga · pastga yur | bitta katak | 2-darsdan |
| `go to x: y:` | X va Y ga bor | aytilgan katakka sakraydi | 3-darsdan; 11 · ★ da |
| `say` | ayt | qahramon gapiradi | 1-darsdan; 15 · ★ da |

Yangi oila rangi — ustoz aytadi: «Hodisa oilasi — to‘q sariq. Hodisa bloki doim dasturchaning tepasida turadi.»
**Ish maydoni:** endi bir nechta dasturcha bo'ladi — dastur ustunida ostma-ost, oralarida bo'sh joy bilan (ustun tor — yonma-yon sig'maydi; ostida «N ta dasturcha»). Hodisa blokisiz qolgan bloklar xira — ular hech qachon bajarilmaydi (bolaga ko'rinadi: «Bu bloklar hech qachon ishlamaydi — tepasiga hodisa bloki qo‘ying»).
**O'yin:** studiyada asosiy tugma «▶ Boshlash» (o'rniga «▶ Ishga tushir» emas). Bosilsa — o'yin boshlanadi: sahna ustida kichik yozuv «O‘yin: strelkalarni bosing», tugma «■ To‘xtatish»ga aylanadi. Bola klaviaturada strelka bossa — o'sha tugmaning dasturchasi ishlaydi (bloklar yonadi), qahramon yuradi. Bir dasturcha ishlayotganda yana bosilsa — navbat kutmaydi, o'tkazib yuboriladi (**KOD**). Ustoz ekranida o'yin paytida → va ← tugmalari qadam almashtirmaydi (**KOD** — qobiq).
**Tekshiruv:** o'yin paytida qahramon yulduzga yetsa — «Yetib bordi!», konfeti, o'yin to'xtaydi. Olmalar — qahramon katagiga kirganda olinadi; hammasi olinmaguncha yulduz yashirin (15-qadam).

**Topshiriqlar va tekshiruv natijasi** (dastur bilan tekshiriladi; «W→» — `when → key pressed`, ostida bloklar):

| Joy | Topshiriq | Yechim (dasturchalar) | Strelkalar (namuna) | Natija |
|---|---|---|---|---|
| Huk (2–4) | yulduz (4, 2) da, yurish paytida qochadi: A — 3-qadamdan keyin (2, 3) ga, B — (5, 1) ga, C — 2-bosishdan keyin (1, 4) ga; Coddy (0, 0) | C: strelkalar | → → ← ↑↑↑↑ | A — dastur → → → → ↑ ↑: (4, 2), ✕; B — o'sha dastur yana (4, 2), ✕; C — ustoz strelkalar bilan qochgan yulduz ortidan (1, 4), ✓ |
| 7 | ustoz: W→ move right; yulduz (3, 0) | W→ move right | → → → | yetdi |
| 8 · 1 | yulduz (4, 0), start (0, 0) | W→ move right | → ×4 | yetdi |
| 8 · 2 | yulduz (2, 0), start (5, 0) — chapda | W← move left (W→ bo'lsa ham bo'ladi) | ← ×3 | yetdi |
| 8 · 3 | yulduz (3, 2), start (0, 0) | W→ move right + W↑ move up | → → → ↑ ↑ (tartib ixtiyoriy) | yetdi |
| 8 · ★ | yulduz (6, 4), start (0, 0); «→ bir bosishda ikki katak» | W→ move right, move right + W↑ move up | → → → ↑ ↑ ↑ ↑ | yetdi (→ 3 marta yetadi) |
| 10 | ustoz: to'rt dasturcha; yulduz (5, 3) | W→ r · W← l · W↑ u · W↓ d | ↑↑↑ →×5 | yetdi |
| 11 · 1 | yulduz (4, 4), start (0, 0) | to'rt dasturcha | → ×4 ↑ ×4 | yetdi |
| 11 · 2 | olma (2, 3), yulduz (5, 0), start (0, 0) | to'rt dasturcha | ↑↑↑ →→ ↓↓↓ →→→ | olma, yetdi |
| 11 · 3 | olma (1, 4), olma (5, 4), yulduz (3, 0), start (3, 2) | to'rt dasturcha | ↑↑ ←← … | ikkala olma, yetdi |
| 11 · ★ | yulduz (6, 4), start (0, 0); «space — boshiga qayt» | to'rt dasturcha + W space go to x: 0 y: 0 | → ×6 ↑ ×4; space | yetdi; space — (0, 0) ga qaytadi |
| 14 | ustoz: «Olma terish» — 3 olma (2, 1), (5, 3), (6, 0), yulduz (0, 4) yashirin, hammasi olingach ochiladi | to'rt dasturcha | — | 3 olma → yulduz → yetdi |
| 15 · 1 | 3 olma: (1, 2), (4, 4), (6, 2); yulduz (0, 4) | to'rt dasturcha | — | yetdi |
| 15 · 2 | 5 olma: (0, 4), (2, 0), (3, 3), (5, 2), (6, 4); yulduz (3, 1) | to'rt dasturcha | — | yetdi |
| 15 · ★ | o'z o'yini: W space — `say` (o'z gapi); 3 olma (2, 2), (5, 3), (1, 4); yulduz (6, 0) | to'rt dasturcha + W space say | — | yetdi va kamida bitta o'z gapi aytildi |

Dasturda eng ko'pi 12 ta blok (hodisa bloklari bilan).

## Yordam va xato

1–3-darsdagidek: har topshiriqda bitta «Maslahat» (ishora qatorida; ustozda «Yordam so‘radi: N ta noutbuk»); xatoda muammocha — bitta gap, «Maslahat» sariq yonadi, ishora qatorida nima qilish kerakligi. Bolaga «noto'g'ri» deyilmaydi. O'yin paytida chetga urilish — muammochasiz («tuk» va turtilish yetadi).

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | «▶ Boshlash» bosildi, dasturda hodisa bloki yo'q | «Men nimani kutaman?» | «Avval hodisa blokini qo‘ying: when … key pressed» |
| Bo'shvoy | o'yinda strelka bosildi, lekin bu tugmaning dasturchasi yo'q | «Bu tugma uchun dasturcha yo‘q-ku…» | «→ tugmasi uchun when → key pressed bloki kerak» (bosilgan tugma bilan; **KOD**) |
| Kamvoy | hodisa blokining ostida blok yo'q | «Tugma bosildi, lekin men nima qilay?» | «Hodisa blokining ostiga move blokini ulang» |
| Ortiqvoy | bitta tugmaga ikkita dasturcha (ikkalasi ishlaydi — qahramon ikki katak yuradi) — faqat ishora, muammocha emas | — | «→ uchun ikkita dasturcha bor — ikkalasi ham ishlaydi» |

---

## 1 · Kirish

- **Vaqt:** 0:00–0:02 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «4-dars · Hodisalar», sarlavha «Bugun qahramonni boshqaramiz!». Coddy: «Salom! Bugun meni o‘zingiz boshqarasiz.» O'ngda maydon, Coddy (0, 0) da. Pastda kichik karta «O‘tgan darsda»: `go to x: 4 y: 2` — «Koordinata — Katakning manzili». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda qahramonni manzilga dastur bilan olib bordik.»
  2. «Bugun dastur tugmani kutadi — qahramonni o‘zingiz boshqarasiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; o'tgan darsdan koordinatani eslatadi («(4, 2) — qaysi katak?»).
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «4-dars · Hodisalar», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: qahramonni yulduzga qanday olib boramiz?

- **Vaqt:** 0:02–0:04 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Yulduz qochib yuradi — Coddy yurayotganda boshqa katakka sakraydi (4·10 A, 20.11). Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Yulduz qochsa, qanday yetamiz?». Maydon, Coddy (0, 0) da, yulduz (4, 2) da. Coddy: «Yulduz qochib yuradi. Qanday yetamiz?» Chapda uchta karta: A «Tayyor dastur» (kichik dastur → → → → ↑ ↑) · B «Ishga tushirni qayta bosamiz» (▶ belgisi) · C «Strelka bosilganda yursin» (→ ← ↑ ↓ tugmalari rasmi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Bu — o‘yin: yulduz qochib yuradi.»
  2. «Har kim noutbukida bitta kartani tanlasin: qahramonni yulduzga qanday olib boramiz?»
- **O'z so'zi bilan:** kartalarni o'qiydi; sinf javoblarini o'qiydi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi yo‘l bilan yulduzga yetamiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:04–0:07 (3 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A kartasi kattalashadi; yulduz (4, 2) da. Coddy tayyor dastur bilan yuradi; uchinchi qadamdan keyin yulduz (2, 3) ga sakrab qochadi; Coddy baribir (4, 2) ga boradi — yulduz yo'q. Kartada: «✕ yulduz boshqa joyda» (**KOD**: huk kartasi `data-qoch` — N-qadamdan keyin yulduz sakraydi).
  2. «Keyingi» — B: yulduz yana (4, 2) da; o'sha dastur qayta yuradi, yulduz endi (5, 1) ga qochadi; Coddy yana (4, 2) ga. Kartada: «✕ yana o‘sha yo‘l».
  3. «Keyingi» — C: yulduz (4, 2) da; sahnada «O‘yin: strelkalarni bosing». Ustoz → → bosadi — yulduz (1, 4) ga qochadi; ustoz ← ↑ ↑ ↑ ↑ bosadi — Coddy har bosishda bitta katak yuradi, yulduzga yetadi, konfeti. Kartada: «✓ yetib bordi». Tayyor dastur qochgan yulduzga moslasha olmaydi, strelka — moslashadi.
- **Tayanch gaplar:**
  1. «Tayyor dastur har safar bir xil yo‘ldan yuradi — yulduz esa qochadi.»
  2. «Strelka bosilganda yursa — qahramonni o‘zimiz boshqaramiz.»
- **O'z so'zi bilan:** C da «qaysi strelkani bosay?» deb sinfdan so'raydi.
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta), C da strelkalarni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: dastur tugmani kutadi

- **Vaqt:** 0:07–0:08 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Dastur tugmani kutadi». A va B xira, C oltin; maydonda Coddy yulduzda. Coddy: «Siz bosasiz — men yuraman.»
- **Tayanch gaplar:**
  1. «Tayyor dastur oldindan hammasini aytadi. O‘yinda esa dastur kutadi: tugma bosilsa — yuradi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Yangi so'z: hodisa

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — yangi so'z · bola «Ustoz ekraniga qarang» («Yangi so‘z: hodisa»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Yangi so‘z», sarlavha «Hodisa nima?». Coddy: «Hodisa — biror narsa sodir bo‘lishi: tugma bosildi.» Uch bo'lak xira; «Keyingi» bosilganda birma-bir (3-darsdagi `raqam` ishi):
     - 1-bosish: klaviatura rasmidagi → tugmasi bosiladi, yozuv «Tugma bosildi»;
     - 2-bosish: `when → key pressed` bloki yonadi, yozuv «Dasturcha ishladi»;
     - 3-bosish: Coddy bitta katak o'ngga yuradi, yozuv «Qahramon yurdi».
     Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «Hodisa — biror narsa sodir bo‘lishi. Bugun hodisa — tugma bosildi.»
  2. «Dastur hodisani kutadi va unga javob beradi.»
- **O'z so'zi bilan:** hayotdan misol: eshik qo'ng'irog'i — tugma bosilsa, jiringlaydi; telefon ekranini bosish.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:09–0:10 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Bitta tugma → 2 · To'rt tugma → 3 · O'yin; cho'qqida kichik karta «Dars oxirida · o‘yin · Olma terish». Coddy: «Uchta bekat. Birinchisidan boshlaymiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: bitta tugma, to‘rt tugma, o‘yin.»
  2. «Dars oxirida o‘z o‘yiningizni o‘ynaysiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Ko'ramiz: when → key pressed

- **Vaqt:** 0:10–0:12 (2 daqiqa)
- **Bekat:** 1 · Bitta tugma
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz hodisa blokini ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «when → key pressed — tugma bosilganda». Javonda yangi oila «Hodisa» (to'q sariq doiracha), unda `when → key pressed`; Harakat oilasida to'rt `move`. Maydonda yulduz (3, 0), Coddy (0, 0). Dastur bo'sh.
  2. Ustoz hodisa blokini qo'shadi, ostiga `move right` ulaydi (Harakat oilasiga o'tib). «▶ Boshlash» — sahnada «O‘yin: strelkalarni bosing».
  3. Ustoz → ni uch marta bosadi — har bosishda dasturcha yonadi, Coddy bitta katak; yulduzda konfeti, o'yin to'xtaydi.
  4. Ustoz yana hodisa blokini qo'shadi va undagi → ni bosadi — ro'yxatdan ← ni tanlaydi, ostiga `move left`. Sekin, ikki marta (8-qadamning 2-pog'onasi shuni talab qiladi; audit 20.11).
- **Tayanch gaplar:**
  1. «when → key pressed — → tugmasi bosilganda. Ostidagi bloklar shu payt bajariladi.»
  2. «Hodisa bloki doim tepada turadi — dasturcha shundan boshlanadi.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** to'q sariq — yangi oila; «▶ Boshlash» bosilmaguncha strelka ishlamaydi (o'yin boshlanmagan).
- **Ustoz qiladi:** blok qo'shadi, «▶ Boshlash», → ni uch marta bosadi; keyin ikkinchi dasturchada tugmani ro'yxatdan ← ga almashtiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Bitta tugma: pog'onalar

- **Vaqt:** 0:12–0:24 (12 daqiqa)
- **Bekat:** 1 · Bitta tugma
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Dasturcha tuzing, «Boshlash»ni bosing va strelka bilan yuring.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «O‘ngga» · 2 «Chapga» · 3 «Ikki tugma» · ★ «Ikki katak». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval dasturcha tuzing, keyin «Boshlash» — va strelkani bosing.»
  2. «Har tugmaga — o‘z dasturchasi.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; «Qaysi tugmani bosyapsiz? Uning dasturchasi bormi?» deb so'raydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda Hodisa (`when → key pressed`) va Harakat; maydon. Hamma pog'onada ishora boshida: «Dasturcha tuzing, keyin ▶ Boshlash».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «O‘ngga», ostida «→ bosilganda qahramon o‘ngga yursin.». Yulduz (4, 0). «Maslahat»: «Hodisa bloki tepada turadi — uning ostiga qahramon nima qilishini qo‘ying».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Chapga», ostida «Yulduz chapda.». Qahramon (5, 0), yulduz (2, 0). «Maslahat»: «Hodisa blokidagi tugmani bosib, boshqa strelkani tanlash mumkin».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Ikki tugma», ostida «Yulduz (3, 2) da.». «Maslahat»: «Har strelkaga o‘z dasturchasi kerak».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Ikki katak», ostida «→ bir bosishda ikki katak yursin.». Yulduz (6, 4). «Maslahat»: «Bitta bosishda ikki katak — hodisa ostiga nechta blok kerak?».
  Yetsa: «Yetib bordi!» va konfeti; o'yin to'xtaydi.
- **Bola qiladi:** dasturcha tuzadi, «▶ Boshlash», strelkalarni bosadi.
- **Tekshiruv:** o'yinda qahramon yulduzga yetdi (avto); ★ da → dasturchasida kamida ikkita `move right`.
- **Xatoda:** hodisa bloki yo'q — Bo'shvoy «Men nimani kutaman?»; bosilgan tugmaning dasturchasi yo'q — Bo'shvoy «Bu tugma uchun dasturcha yo‘q-ku…»; hodisa ostida blok yo'q — Kamvoy.

## 9 · 2-bekat

- **Vaqt:** 0:24–0:25 (1 daqiqa)
- **Bekat:** 2 · To'rt tugma
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: to‘rt tugma»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Bitta tugma ✓; Coddy 2-bekatda. Coddy: «Endi to‘rt strelka — qahramon istalgan tomonga yuradi.»
- **Tayanch gaplar:**
  1. «Bitta tugmani bildik. Endi to‘rtta — to‘liq boshqaruv.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Ko'ramiz: to'rt tugma

- **Vaqt:** 0:25–0:26:30 (1,5 daqiqa)
- **Bekat:** 2 · To'rt tugma
- **Ekran:** proyektor — Blok studiya (ustoz) · bola «Ustoz ekraniga qarang» («Ustoz to‘rt tugmani ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «To‘rt tugma — to‘rt dasturcha». Dasturda tayyor to'rtta dasturcha yonma-yon: → move right · ← move left · ↑ move up · ↓ move down. Yulduz (5, 3).
  2. «▶ Boshlash»; ustoz ↑ ↑ ↑ va → ×5 bosadi — Coddy yulduzda.
- **Tayanch gaplar:**
  1. «To‘rt tugma — to‘rt dasturcha. Har biri o‘z tugmasini kutadi.»
  2. «Endi o‘zingiz.»
- **Ustoz qiladi:** «▶ Boshlash», strelkalarni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · To'rt tugma: pog'onalar

- **Vaqt:** 0:26:30–0:38 (11,5 daqiqa)
- **Bekat:** 2 · To'rt tugma
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «To‘rt tugma!». Coddy: «To‘rtta dasturcha tuzing va qahramonni boshqaring.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14»; o'ngda zinapoya: 1 «To‘rt strelka» · 2 «Olma, keyin yulduz» · 3 «Ikki olma» · ★ «Boshiga qayt». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «To‘rtta dasturcha — to‘rt strelka. Keyin «Boshlash» va o‘ynang.»
  2. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya. 2-pog'onadan dastur oldingi pog'onadagi dasturchalari bilan ochiladi (**KOD**: `prog: 'oldingi'`), qayta tuzish shart emas.
  1-pog'ona. Sarlavha «To‘rt strelka», ostida «Yulduz (4, 4) da.». «Maslahat»: «Qahramon to‘rt tomonga yura olsin: qaysi strelkalar hali dasturchasiz?».
  2-pog'ona. Sarlavha «Olma, keyin yulduz», ostida «Olma (2, 3) da, yulduz (5, 0) da.». «Maslahat»: «Avval olmaga boring, keyin yulduzga».
  3-pog'ona. Sarlavha «Ikki olma», ostida «Qahramon (3, 2) da. Ikkala olmani oling, keyin yulduzga.». Olma (1, 4), (5, 4); yulduz (3, 0). «Maslahat»: «Ikki olma orasidan qaysi qator bilan o‘tish qisqa?».
  ★ qo'shimcha. Sarlavha «Boshiga qayt», ostida «space bosilganda qahramon (0, 0) ga qaytsin.». Yulduz (6, 4). «Maslahat»: «space bosilganda qahramon boshiga qaytsin: qaysi blok bitta sakrashda manzilga olib boradi?». Tekshiruv: yulduzga yetdi va o'yinda kamida bir marta space bilan (0, 0) ga qaytdi.
  Yetsa: «Yetib bordi!» va konfeti.
- **Bola qiladi:** to'rt dasturcha tuzadi, o'ynaydi.
- **Tekshiruv:** avto.
- **Xatoda:** 8-qadamdagidek; olma qoldi — Kamvoy «Olma qoldi-ku!» (yulduz olmalar olinmaguncha ko'rinadi, lekin yetsa — «Avval olmani oling»).

## 12 · Xulosa: hodisa

- **Vaqt:** 0:38–0:40 (2 daqiqa)
- **Bekat:** 2 · To'rt tugma
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: hodisa»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Hodisa». Coddy: «Tugma bosildi — dastur ishladi.» Ikki karta: «Hodisa — Biror narsa sodir bo‘lishi: tugma bosildi» (klaviatura rasmi) va «when → key pressed — Tugma bosilganda» (blok rasmi, ostida move right); o'ngda maydon va Coddy.
- **Tayanch gaplar:**
  1. «Hodisa — biror narsa sodir bo‘lishi. Dastur hodisani kutadi va javob beradi.»
  2. «Har tugmaga o‘z dasturchasi.»
- **O'z so'zi bilan:** «Telefoningizda qanday hodisalar bor?» (ekranni bosish, qo'ng'iroq keldi).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi; misol aytadi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:40–0:41 (1 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: o‘yin»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓; Coddy 3-bekatda. Coddy: «Oxirgi bekat: haqiqiy o‘yin — «Olma terish».»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisi — o‘yin.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Ko'ramiz: «Olma terish»

- **Vaqt:** 0:41–0:43 (2 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — Blok studiya (ustoz) · bola «Ustoz ekraniga qarang» («Ustoz o‘yinni ko‘rsatyapti — kuzating»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘ramiz», sarlavha «O‘yin: olma terish». Maydonda 3 olma: (2, 1), (5, 3), (6, 0); yulduz ko'rinmaydi; sahna tepasida hisob «Olma: 0 / 3» (**KOD**). Dasturda to'rtta dasturcha (tayyor).
  2. «▶ Boshlash»; ustoz strelkalar bilan olmalarni teradi — hisob «1 / 3», «2 / 3», «3 / 3»; uchinchisidan keyin yulduz paydo bo'ladi (0, 4) da; uch bosishdan keyin yulduz (3, 2) ga sakrab qochadi; ustoz ortidan borib tutadi — konfeti, «Yetib bordi!» (**KOD** 4·11 A: `bosh.qoch` — har uch bosishda ro'yxatdagi navbatdagi katakka).
- **Tayanch gaplar:**
  1. «O‘yin qoidasi: hamma olmani tering — keyin yulduz chiqadi. Yulduz qochadi — tutib oling.»
  2. «Dasturchalar o‘sha-o‘sha. O‘yin — siz bosgan tugmalardan.»
- **Ustoz qiladi:** «▶ Boshlash», strelkalarni bosadi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · O'yin: pog'onalar

- **Vaqt:** 0:43–0:55 (12 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «O‘ynang!». Coddy: «Olmalarni tering, keyin yulduzni tuting!» Chapda katta son «O‘yinni yutdi 6 / 14», ostida «Har belgi — o‘yinni yutgan bitta bola»; o'ngda zinapoya: 1 «Uch olma» · 2 «Besh olma» · ★ «O‘z o‘yiningiz». Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Dasturchalar tayyor — endi o‘ynang: hamma olmani tering, keyin yulduzni tuting.»
  2. «★ da space bosilganda qahramoningiz o‘z gapini aytsin.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; dastur 11-qadamdagi dasturchalari bilan ochiladi (yo'q bo'lsa — bo'sh). Sahna tepasida «Olma: 0 / N».
  1-pog'ona. Sarlavha «Uch olma». Olmalar (1, 2), (4, 4), (6, 2); yulduz (0, 4) — yashirin; chiqqach uch bosishdan keyin (3, 1) ga qochadi. Ostida «Olmalarni tering, keyin yulduzni tuting — u qochadi!». «Maslahat»: «Eng yaqin olmadan boshlang».
  2-pog'ona. Sarlavha «Besh olma». Olmalar (0, 4), (2, 0), (3, 3), (5, 2), (6, 4); yulduz (3, 1) — yashirin; chiqqach har uch bosishda qochadi: (0, 2), keyin (5, 0). «Maslahat»: «Yo‘lni oldindan ko‘z bilan chizing».
  ★ qo'shimcha. Sarlavha «O‘z o‘yiningiz», ostida «space bosilganda qahramoningiz gapirsin.». Olmalar (2, 2), (5, 3), (1, 4); yulduz (6, 0). Javonda Gap oilasi ochiladi (`say`). «Maslahat»: «Gap oilasidagi blokni space dasturchasiga ulang — gapni o‘zingiz yozing». Erkin ijod (36-qaror).
  Yutsa: «Siz yutdingiz!» va konfeti.
- **Bola qiladi:** o'ynaydi; ★ da o'z gapini qo'shadi.
- **Tekshiruv:** hamma olma olindi va qahramon yulduzga yetdi (avto); ★ — yana space bilan o'z gapi (standart «Salom!» emas) aytildi.

## 16 · Dasturchalaringizni o'qib bering

- **Vaqt:** 0:55–1:00 (5 daqiqa)
- **Bekat:** 3 · O'yin
- **Ekran:** proyektor — Blok studiya (ustoz, dastur bo'sh) · bola — o'z ekrani (o'zgarmaydi)
- **Sahna:** 12-bo'lim 3-band: bola o'z dasturchalarini ovoz chiqarib o'qiydi («→ bosilganda — move right…»), ustoz o'shalarni tuzadi va sinf bilan o'ynaydi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Dasturchalaringizni o‘qib bering». Maydonda 3 olma; dastur bo'sh. Coddy: «Siz o‘qiysiz — men o‘sha tugmalarni kutaman.»
  2. Bola o'qiydi, ustoz tuzadi, «▶ Boshlash» — sinf qaysi tugmani bosishni aytadi, ustoz bosadi.
- **Tayanch gaplar:**
  1. «Kim dasturchalarini o‘qib beradi? Qaysi tugma — nima qiladi?»
  2. «Sinf, qaysi strelkani bosay?»
- **Ustoz qiladi:** tuzadi, o'ynaydi.
- **Parta:** o'z ekrani — o'qib berish uchun.
- **Bola qiladi:** o'qiydi yoki aytadi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 1:00–1:03 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz o‘yin tuzdingiz!». Bugungi so'z: «Hodisa — Biror narsa sodir bo‘lishi». Pastda: ✓ Bitta tugma · ✓ To'rt tugma · ✓ O'yin. Kichik karta «Keyingi dars · 5 · Takrorlash».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: bitta tugma, to‘rt tugma, o‘yin.»
  2. «Bugungi so‘z — hodisa: biror narsa sodir bo‘lishi, tugma bosildi.»
  3. «Keyingi darsda qahramon bir blok bilan ko‘p marta yuradi — takrorlash.»
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz o‘yin tuzdingiz!». Coddy o'rniga qahramon (o'z ismi bilan): «Tugmalar bilan boshqardingiz va o‘yinni yutdingiz.» «Siz bugun»: N marta tugma bosdi · N olma terdi · N marta yutdi (haqiqiy son; **KOD**). «Keyingi darsda takrorlash bilan ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi.

## 18 · Sinfimiz bugun

- **Vaqt:** 1:03–1:06 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz zo‘r ishladingiz!» Butun sinf jami: N marta tugma bosdi · N olma terdi · N marta yutdi; o'ngda bolalar qahramonlari. Panelda «Darsni yakunlash».
  2. «Darsni yakunlash» — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda takrorlash bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!».
- **Tayanch gaplar:**
  1. «Hammangiz zo‘r ishladingiz!» (keyin raqamlarni o'qiydi)
  2. «Har bir o‘yin shunday ishlaydi: dastur tugmani kutadi.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi.
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–3-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); C da o'zi strelkalarni bosadi.
- 5-qadam: «Keyingi»ni bola o'zi bosadi.
- 7, 10, 14-qadam: dastur tayyor — bola o'zi «▶ Boshlash» va strelkalarni bosadi.
- Solo'da yo'q qadamlar: 16 va 18. Sinf doskalari o'rniga darhol o'z ekrani.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-004-hodisalar-v1` (modul tugagach, 93-qaror).
- Yutuqlar: «Boshqaruvchi» (`boshqaruv`) — 11-qadamda 1-pog'ona (to'rt strelka); «O‘yinchi» (`oyinchi`) — 15-qadamda 1-pog'ona yutildi.

## Darsdan oldin (ustoz uchun)

- Darsda savol bitta — boshidagi huk. Qolgan joyda avval ko'rsating, keyin bolalar o'zi bajaradi.
- Yangi oila — Hodisa (to'q sariq). Hodisa bloki doim dasturchaning tepasida. Bir dasturda bir nechta dasturcha bo'ladi — har tugmaga o'zi.
- O'yin «▶ Boshlash» bilan boshlanadi; ungacha strelka ishlamaydi. O'yin paytida proyektorda → va ← qadam almashtirmaydi — keyingi qadamga «Keyingi» tugmasi bilan o'ting.
- Bolalar o'ynayotganda sinf shovqinli bo'ladi — «To‘xtadik. Qo‘llar klaviaturadan.» degan kelishuvni dars boshida eslating.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

1. **Hodisa oilasi va `when [→] key pressed` bloki** (Blockly: boshli blok — tepasida ulanish yo'q; tugma ro'yxatdan: → ← ↑ ↓ space; to'q sariq rang; javonda doiracha «Hodisa»).
2. **Bir nechta dasturcha:** Blockly ish maydonida yonma-yon (har biri o'z ustunida, tartib bilan joylashadi); «N ta dasturcha»; hodisasiz bloklar xira. 1–3-darslarda avvalgidek bitta dastur (DARS bayrog'i bilan).
3. **O'yin rejimi:** «▶ Boshlash» / «■ To‘xtatish»; klaviatura hodisalari (faqat o'z oynasida); har tugmaning dasturchasi ijrochi bilan bajariladi (bir paytda bitta); sahna ustida «O‘yin: strelkalarni bosing»; ustoz ekranida o'yin paytida → ← qadam almashtirmaydi.
4. **O'yin tekshiruvi:** yulduzga yetdi (olmalar olingach), olma hisobi «Olma: N / M», hamma olma olinganda yashirin yulduz ochiladi; ★ shartlari (ikki move bitta dasturchada; space bilan (0, 0) ga qaytdi; space bilan o'z gapi).
5. **Huk kartalari — o'yin:** A va B kartasi yulduzni ko'chiradi va tayyor dasturni yurgizadi; C — o'yin rejimini yoqadi (ustoz strelka bosadi).
6. **Oldingi pog'ona dasturi** — 11- va 15-qadamda dastur oldingi pog'onadagi dasturchalar bilan ochiladi.
7. **Natija turlari:** dasturcha soni (muvaffaqiyatli dasturlardagi hodisa bloklari), terilgan olmalar, yutilgan o'yinlar.

## Savollar (tavsiya — A)

1. **Hodisa oilasi rangi — to‘q sariq** (#F08A24 atrofida; sariq faqat «bajarilyapti» uchun band, 95-qaror). B — Scratch'dagidek sariq (lekin «bajarilyapti» porlashi bilan adashadi).
2. **Bloklar yozuvi — `when → key pressed`** (Scratch'dagi «when [right arrow] key pressed» qisqa ko'rinishi; tugma strelka belgisi bilan). B — `when right arrow key pressed` (to'liq inglizcha so'z).
3. **O'yin tugmasi — «▶ Boshlash» / «■ To‘xtatish»** (studiyadagi «▶ Ishga tushir» o'rniga — ma'nosi boshqa: dastur bajarilmaydi, kutadi). B — «▶ Ishga tushir» qoladi.
4. **Huk:** A «Tayyor dastur» · B «Ishga tushirni qayta bosamiz» · C «Strelka bosilganda yursin» — yulduz har sinovda ko'chadi. B — huk boshqacha (masalan qahramonni sichqoncha bilan sudrash — 1-darsda bor edi).
5. **«Dasturcha» so'zi** (bitta hodisa bloki va uning ostidagi bloklar). B — «skript» (Scratch so'zi).
6. **O'yin paytida chetga urilish — muammochasiz** (faqat «tuk» va turtilish — o'yin to'xtamasin). B — 3-darsdagidek Kamvoy «Maydon tugadi!» (o'yin to'xtaydi).
7. **Erkin ijod — 15 · ★ «O‘z o‘yiningiz»** (space — o'z gapi).
8. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy.
2. 14 bola bir vaqtda klaviaturada o'ynaydi — sinf shovqini; ustozning «To‘xtadik» kelishuvi sinfda tekshiriladi.
3. Bola strelka tugmasini juda tez bossa — dasturcha tugaguncha keyingi bosish o'tkazib yuboriladi; bu sezilarli bo'lsa, navbat qo'yish kerak (sinfda kuzatiladi).
4. Noutbuk klaviaturasida strelkalar kichik — 9 yoshli bola uchun qiyinmi.
5. Ruscha matn hali yo'q.

## Audit tuzatishlari (v1.1, 20.11 — mustaqil audit agenti, filtrdan o'tganlari)

1. **Natijada «N dasturcha tuzdi» o'rniga «N marta tugma bosdi»** — yutilgan o'yinlardagi haqiqiy tugma bosishlar. Avvalgi son haqiqiy emas edi: oldingi pog'onadan kelgan dasturchalar har yutuqda qayta sanalardi (31-qonun).
2. **7-qadamda ustoz ← ni tanlashni ko'rsatadi** (8 · 2 shuni talab qiladi, avval ko'rsatilmagan edi).
3. **11 · 1 yulduzi (4, 4) da** — (4, 3) daraxt katagi edi.
4. **So'zlar:** «Hodisa — biror narsa sodir bo‘lishi» («nimadir bo'lishi» g'ayritabiiy edi); «Bu tugma uchun dasturcha yo‘q-ku…»; yangi so'z ekranida «Dasturcha ishladi» (bu darsda «Ishga tushir» yo'q).
5. **Manba kodga tenglashtirildi:** olmalar 14-qadamda (5, 3), 15 · 1 da (6, 2) — avvalgi joylar daraxt katagi edi; dasturchalar ostma-ost; 12-qadamda strelkalar rasmi yo'q (maydon kataklarini yopardi).

## Foydalanuvchi qarorlari (20.11, ko'rik sahifasi — 4·1–4·12 A, A·1 A, A·2 A)

1. **4·10 — huk:** yulduz har sinov boshida (4, 2) da va **yurish paytida qochadi** (A — 3-qadamdan keyin (2, 3) ga, B — (5, 1) ga, C — o'yinda 2-bosishdan keyin (1, 4) ga). Tayyor dastur moslasha olmaydi, strelka — moslashadi. KOD: huk kartasi `data-qoch` «N:x,y».
2. **4·11 — 3-bekat qoidasi:** qochadigan yulduz — olmalar terilib yulduz chiqqach, har uch bosishda ro'yxatdagi navbatdagi katakka sakraydi (14-qadam: (3, 2); 15 · 1: (3, 1); 15 · 2: (0, 2), (5, 0); ★ — qochmaydi). Ro'yxat tugagach joyida qoladi. Huk g'oyasi o'yinda yopiladi. KOD: `bosh.qoch { har, joy }`.
3. **4·12 — 5-qadam:** «Qahramon yurdi» yonganda Coddy haqiqatan (1, 0) ga sakraydi (KOD: maydon `kes.yur`).
4. **A·1 — 16-qadam:** bola ekranida o'z oxirgi yechgan pog'onasi (dasturchalari va maydoni) — o'qib berish uchun.
5. **A·2 — maslahatlar** yo'nalish beradi, javobni aytmaydi.

