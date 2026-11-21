# 6-dars. Amaliyot: harakat va takrorlash

> **Holat: v1.2 — QORALAMA, QURILDI (2026-11-20; manbani agent yozdi, bosh seans filtri — «Filtr qarorlari», qurish — «Qurishdagi qarorlar»). Foydalanuvchi tasdig'i kutilmoqda.** Bu fayl — manba-haqiqat: dars papkasi (`../darslar/006-amaliyot/`) shundan quriladi.
> Bu fayl — dars manbasi: bola va ustoz ko'radigan har so'z shu yerda. Qoidalar: `../KONSEPSIYA.md` (12-bo'lim), `../etalon/QONUNLAR.md`. Shakl va ko'rinish — 1–5-dars bilan bir xil (`001-tanishuv.md`: «Ekranlar ko'rinishi», «Yordam va xato», «Tovush», «Solo» bo'limlari shu darsga ham amal qiladi; bu yerda faqat farqi yoziladi). Dasturdagi o'rni: `../dastur/DASTUR.md`, 1-modul, 6-dars («Amaliyot: harakat va takrorlash» — natija: 3 ta topshiriq mustaqil bajariladi; o'rganadi: bloklarni yordamsiz, o'zi tanlab ishlatadi; nega: kim nimani tushunmaganini ko'rish uchun; tekshiruv: avto + mentor).
> Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi (tutuq belgisi ham — ‘ va ’). **KOD** belgisi — dvigatelda hali yo'q, qurish kerak bo'lgan narsa (ro'yxati oxirida; bu darsda uchta). Maydondagi har topshiriq manba yozilganda dastur bilan simulyatsiya qilindi (har oila uchun eng kam blok soni ham hisoblandi — natija jadvalda); dars qurilganda sinov — `sinov/dvigatel/amaliyot.mjs` (**KOD**).
> **Bu — kursdagi birinchi amaliyot darsi.** `KONSEPSIYA.md` 4-bo'limi: «Yuqoridagi ritm faqat «yangi mavzu» uchun. Qolgan turlarga alohida, soddaroq qolip kerak». Bu dars amaliyot qolipining birinchi nusxasi («Savollar» 9).

## Pasport

- **Dars turi:** amaliyot (blokli). Yangi mavzu yo'q, yangi blok yo'q, yangi so'z yo'q.
- **Natija (dasturdan):** 3 ta topshiriq mustaqil bajariladi. **Bu manbada: «topshiriq» — bekat** (1 · Yo'l — 2 · Rasm — 3 · Hammasi birga); bekat bajarildi — uning 1–3-pog'onasi bajarildi (★ — qo'shimcha).
- **Bola nimani mashq qiladi:** 2–5-darsdagi bloklar (`move`, `go to`, `repeat`) javonda birga turadi — qaysi biri kerakligini bola **o'zi tanlaydi**. Ustoz yechimni ko'rsatmaydi. Har pog'onada bloklar soni cheklangan — chegara «noto'g'ri» oilani o'zi chiqarib tashlaydi (masalan, bitta blok sig'sa — faqat `go to`). Darsdagi yagona fikr: **har ishga — o'z bloki; kerak bo'lsa ular bir dasturda birga ishlaydi.**
- **Tekshiruv (dasturdan):** avto — har pog'ona o'zi tekshiriladi (yulduz va olmalar · kulrang rasm · tuzatilgan dastur); mentor — darsdan keyin har bolaning pog'onalar jadvali (bajardi · «Maslahat»ni ochdi · urinishlar; **KOD**, LMS — modul tugagach, 93-qaror).
- **Vaqt:** reja 65 daqiqa, zaxira 15–25 daqiqa (dars 80–90 daqiqa). Zaxira — 11- va 15-qadamdagi pog'onalarga.
- **Uch bekat:** 1 · Yo'l — 2 · Rasm — 3 · Hammasi birga. Reja tepaligi 6-qadamda; har bekat boshida qaytadi (9-, 13-qadam); yakunda (17-qadam) uchala bekat ✓.
- **Savol:** darsda bitta — boshidagi huk (2–4-qadam: savol, uch sinov, javob). Amaliyot darsida ham huk bor («Savollar» 1).
- **Murojaat:** bolaga «siz».
- **Kim nima bilan ishlaydi:** ustoz ko'rsatganda maydonda Coddy; bola ishlaganda o'z qahramoni (kurs bo'yi saqlanadi, 94-qaror).
- **Oldingi darslar bilan bog'lanish:** 5-darsda bola `repeat` bilan rasm chizdi va yakunda «Keyingi darsda o‘rganganlarimizni o‘zingiz ishlatasiz — amaliyot.» degan va'dani eshitdi. Bu dars o'sha maydonda (o'yin rejimi yo'q, yana «▶ Ishga tushir»): 2-dars (ketma-ketlik, tartib), 3-dars (`go to`), 5-dars (`repeat`) bitta javonda. 4-darsdagi hodisa bloklari bu darsda yo'q («Savollar» 5).

## Bola nima qiladi (qisqa)

| Daqiqa | Bola nima qiladi | Qadamlar |
|---|---|---|
| 0–2 | Kiradi, maydonni va Coddy'ni ko'radi, «Tayyorman»ni bosadi | 1 |
| 2–6:30 | Savolga javob beradi: dasturga 3 ta blok sig'adi, yo'lda 4 ta olma — qaysi bloklar bilan yetamiz? Sinf uchalasini sinaydi: ikkita repeat sig'maydi, go to olmalardan sakrab o'tadi, go to va repeat birga — yetadi | 2–4 |
| 6:30–8 | Uch blokni eslaydi: move · go to · repeat | 5 |
| 8–9 | Bugungi rejani ko'radi | 6 |
| 9–10 | Bugungi qoidani ko'radi: hamma blok javonda, chegara, «Maslahat» bir urinishdan keyin | 7 |
| 10–21 | 1-bekat: yulduzga yo'l — move, go to yoki ikkalasi | 8 |
| 21–23 | Ustoz kulrang rasm topshirig'ini eslatadi | 9–10 |
| 23–35 | 2-bekat: chiziq, eshik, keng zinapoya, ★ to'lqin — repeat bilan | 11 |
| 35–37 | Xulosa: har ishga — o'z bloki | 12 |
| 37–39:30 | Ustoz dasturni tuzatishni eslatadi | 13–14 |
| 39:30–54 | 3-bekat: hamma blok birga; tayyor dasturni tuzatadi; ★ da o'z rasmini chizadi | 15 |
| 54–59 | Rasmining dasturini sinfga o'qib beradi — ustoz Coddy bilan chizadi | 16 |
| 59–65 | O'z natijasini va sinf natijasini ko'radi | 17–18 |

Bolaning birinchi mustaqil ishi — 10-daqiqada, birinchi natijasi (1-pog'ona, 4 ta blok) — 11–12-daqiqada (12-bo'lim 1-band: 10–12 daqiqa ichida).

## So'zlar

Yangi so'z yo'q. Darsning fikri so'z emas, qoida: «Har ishga — o‘z bloki» (4-, 12-, 17-qadam).

1–5-darsdan (ta'rifsiz, tanish): blok, dastur, buyruq, qahramon, yulduz, olma, qadam, katak, maydon, manzil, X va Y, ketma-ketlik, takrorlash, rasm, kulrang kataklar, uzun dastur, pog'ona, xato (dasturdagi — 98-qaror).
Bir ma'noga bitta so'z: «tanlaysiz» (blokni o'zi tanlaydi; «topasiz», «o‘ylab topasiz» deyilmaydi); «sakraydi» (`go to` ishi — 3-darsdagidek); «chegara» bolaga aytilmaydi — ekranda «N / M ta blok», gapda «nechta blok sig‘adi» (5-darsdagidek); «tuzatish» (tayyor dasturdagi xato — «to‘g‘rilash» deyilmaydi); «Maslahat» (tugma nomi; «yordam», «ishora» deyilmaydi).
Bu darsda AYTILMAYDI: yangi blok yoki oila, hodisa bloklari (4-dars, bu javonda yo'q), kostyum va tovush (7-dars), shart (8-dars), ichma-ich takrorlash.

## Maydon va bloklar

Maydon — 3–5-darsdagi bog' (7 × 5, X va Y sonlari, (0, 0) pastki chapda, Y tepaga; qahramon ostida «(x, y)» yorlig'i). Bezak: daraxtlar (1, 1) · (4, 3) · (6, 1), gullar (0, 4) · (2, 3) · (5, 4) · (6, 3) — devor emas. **Hech qaysi start, olma, yulduz va kulrang katak bezak katagida emas; hech qaysi yechim yo'li bezak katagidan o'tmaydi** (simulyatsiya — jadval ostida). O'tilgan kataklar oltin iz bilan qoladi. Chetdan chiqish — 3–5-darsdagidek: turtilib to'xtaydi, «tuk», Kamvoy «Maydon tugadi!». O'yin rejimi yo'q — asosiy tugma «▶ Ishga tushir».

**Bloklar** — ikki oila, hammasi darsning boshidan javonda (7-qadamdan boshlab bola ishlatadi):

| Blok | Oila | Nima qiladi | Qayerdan |
|---|---|---|---|
| `move right` · `move left` · `move up` · `move down` | Harakat (ko'k) | bitta katak | 2-dars |
| `go to x: y:` | Harakat (ko'k) | aytilgan katakka bir sakrashda; sonlar bosib tanlanadi (X 0–6, Y 0–4) | 3-dars |
| `repeat 2` | Takrorlash (yashil) | ichidagi bloklarni aytilgan son marta (2–10); bosilsa tanlanadi — keyingi bloklar ichiga tushadi, yana bosilsa — tashqariga | 5-dars |

Javonda yo'q: hodisa (`when → key pressed`), `say`.
**Bloklar soni:** 5-darsdagidek — repeat ham, ichidagi har blok ham sanaladi; har pog'onaning o'z chegarasi, tasma yonida «0 / N ta blok»; to'lsa — Ortiqvoy «Joy qolmadi!». Dasturda eng ko'pi 12 ta blok.
**Topshiriq turlari** — hammasi 3- va 5-darsda qurilgan: yulduzga yetish (olmalar bilan, «o‘tib ketdi» ajratiladi) · kulrang rasm · qisqartirish (uzun dastur sarlavha ostida strelkalar bilan) · erkin rasm. Yangi tur bitta emas — **tayyor dasturni tuzatish** (15 · 3): bola ekranida dastur tayyor turadi (`prog: 'qoldir'`, bloklar Blockly'da — o'zgartirsa bo'ladi); bu 5-darsdagi ustoz ekranlarining o'zi, faqat bola pog'onasida — qurishda tekshiriladi.
**Rasm va `go to`:** kulrang rasmda `go to` sakrashi faqat **qo'ngan katakni** bo'yaydi; sakrash yo'li (punktir) rasmga kirmaydi — dvigatel shunday (o'tilgan kataklar ro'yxati). Shu tufayli 15 · 2 da ikki bo'lakli rasm `go to` bilan chiziladi.
**«Maslahat»** — bir urinishdan keyin ochiladi («Savollar» 3, **KOD**): pog'ona ochilganda tugma qulf belgisi bilan turadi, yonida «Avval bir marta ishga tushiring»; birinchi «▶ Ishga tushir»dan keyin ochiladi. Maslahat — yo'nalish (qaysi oila, qayerdan boshlash), tayyor dastur emas.

**Topshiriqlar va tekshiruv natijasi** (dastur bilan simulyatsiya qilingan; «R5[→]» — `repeat 5`, ichida `move right`; «→ ← ↑ ↓» — `move right/left/up/down`; «go(x, y)» — `go to x: y:`; «Blok» — takrorlash ichidagilar bilan; «Eng kam» — har oila to'plami bilan chegara ichida yechish mumkinmi: **M** — faqat move, **M+R** — move va repeat, **M+G** — move va go to, **Hammasi**):

| Joy | Topshiriq | Yechim (namuna) | Blok / chegara | Eng kam (simulyatsiya) | Natija |
|---|---|---|---|---|---|
| Huk (2–4) | Coddy (0, 0); olmalar (1, 2)…(4, 2); yulduz (5, 2); 3 ta blok sig'adi | C: go(0, 2) R5[→] | 3 / 3 | M 7 · M+R 4 · M+G 5 · Hammasi 3 — faqat aralash sig'adi | A — R2[↑] R5[→] (4 blok): sig'gan qismi R2[↑] — (0, 2), 0 olma, ✕; B — go(5, 2): (5, 2), olmalar qoldi, ✕; C — (5, 2), 4 olma, ✓ |
| 5 | ustoz: eslatma, maydon tinch | — | — | — | — |
| 8 · 1 | start (0, 0); olma (0, 2); yulduz (2, 2) | ↑ ↑ → → | 4 / 4 | M 4 · M+R 4 · Hammasi 2 — hamma yo'l sig'adi | (2, 2), olma, yetdi. Teskari tartib → → ↑ ↑ — yulduzga yetadi, olma qoladi (Kamvoy «Olma qoldi-ku!») |
| 8 · 2 | start (0, 0); yulduz (6, 4); olma yo'q | go(6, 4) | 1 / 1 | M 10 · M+R 4 · M+G 1 — faqat go to | (6, 4), yetdi |
| 8 · 3 | start (0, 0); olmalar (2, 4), (3, 4); yulduz (4, 4) | go(2, 4) → → | 3 / 3 | M 8 · M+R 4 · M+G 3 — go to shart | (4, 4), 2 olma, yetdi; go(2, 4) go(3, 4) go(4, 4) ham yetadi; faqat go(4, 4) — olmalar qoladi |
| 8 · ★ | start (0, 0); olmalar (3, 0), (6, 2); yulduz (2, 4) | go(3, 0) go(6, 2) go(2, 4) | 3 / 3 | M yo'q · M+R 6 · M+G 3 | (2, 4), 2 olma, yetdi. Tartib go(3, 0) go(2, 4) go(6, 2) — yulduz ustidan o'tadi (Ortiqvoy «Ko‘payib ketdi!») |
| 10 | ustoz: kulrang (2, 0), (2, 1), (2, 2), (3, 2), (4, 2); Coddy (2, 0); tayyor dastur ↑ ↑ → → | ↑ ↑ → → | 4 | — | rasm tayyor (eslatma — qisqartirilmaydi) |
| 11 · 1 | «Chiziq»: kulrang (0, 2)…(6, 2); start (0, 2) | R6[→] | 2 / 2 | M 6 · M+R 2 | rasm tayyor; R7[→] — chetga urildi (Kamvoy «Maydon tugadi!») |
| 11 · 2 | «Eshik»: (0, 0)–(3, 2) to'rtburchagining cheti, 10 katak, ichida daraxt (1, 1); start (0, 0) | R3[→] R2[↑] R3[←] R2[↓] | 8 / 8 | M 9 · M+R 7 | rasm tayyor; R2[↑] R3[→] R2[↓] R3[←] ham tayyor; 9 ta `move` — sig'maydi |
| 11 · 3 | «Keng zinapoya»: uzun ↑ → → ↑ → → (6 blok); start (2, 0) | R2[↑ → →] | 4 / 4 | M 6 · M+R 4 | rasm bir xil, (6, 2) da tugaydi. Ichidagi tartib R2[→ → ↑] — boshqa zinapoya (Ortiqvoy «Rasmdan chiqdi!») |
| 11 · ★ | «To‘lqin»: uzun ↑ ↑ → ↓ ↓ → ↑ ↑ → ↓ ↓ → (12 blok); start (2, 0) | R2[↑ ↑ → ↓ ↓ →] | 7 / 7 | M 12 · Hammasi 7 | rasm bir xil, (6, 0) da tugaydi; boshqa 7 blokli yechim ham bor (R4[→] go(2, 1) R3[↑ → ↓]) — teng |
| 14 | ustoz: Coddy (0, 0); olma (3, 0); yulduz (3, 2); tayyor dastur R2[↑] R3[→] | R3[→] R2[↑] | 4 | — | tayyor dastur: (3, 2) ga yetadi, olma qoladi; joyi almashtirilsa — olma, yetdi |
| 15 · 1 | «Ustun»: start (0, 0); olmalar (3, 1), (3, 2), (3, 3); yulduz (3, 4) | go(3, 1) R3[↑] | 3 / 3 | M 7 · M+R 4 · M+G 4 · Hammasi 3 — faqat aralash | (3, 4), 3 olma, yetdi; go(3, 0) R4[↑] ham yetadi |
| 15 · 2 | «Teng belgisi»: kulrang (0, 0)…(3, 0) va (0, 2)…(3, 2), 8 katak; start (0, 0) | R3[→] go(0, 2) R3[→] | 5 / 5 | M va M+R — yo'q (ikki bo'lak orasidan o'tib bo'lmaydi) · Hammasi 5 | rasm tayyor; R3[→] go(3, 2) R3[←] ham tayyor; go to siz R3[→] R2[↑] R3[←] — (3, 1) ga chiqadi (Ortiqvoy «Rasmdan chiqdi!») |
| 15 · 3 | «Xatoni toping»: start (0, 0); olmalar (5, 2), (5, 1); yulduz (5, 0); tayyor dastur R3[↓] go(5, 3) | go(5, 3) R3[↓] (joyini almashtirish) | 3 / 3 | Hammasi 3 · M+G 3 | tayyor dastur: birinchi `move down` da chet (Kamvoy «Maydon tugadi!»); tuzatilgan — (5, 0), 2 olma, yetdi; go(5, 2) R2[↓] va go(5, 1) ↑ go(5, 0) ham yetadi — teng |
| 15 · ★ | o'z rasmi: start (0, 0); kulrang yo'q | bolaning o'zi (namuna R2[→ → ↑] go(5, 0) R3[↑] — zinapoya va minora, 7 blok) | ≤ 12 | — | dasturda go to ham, repeat ham bor va dastur chetga urilmay tugadi — tayyor (**KOD**: shart); namuna (5, 3) da tugaydi |

**Simulyatsiya xulosasi:**
- Maydondan chiqish: yechimlarning hech biri chiqmaydi (chetga urilish faqat ataylab ko'rsatilgan xato variantlarida: 11 · 1 dagi R7[→], 15 · 3 dagi tayyor dastur).
- Bezak: hamma start, olma, yulduz, kulrang katak — bezakdan tashqarida; hamma namuna yechim yo'li bezakka tegmaydi (11 · 3 dagi xato tartib R2[→ → ↑] — (6, 1) daraxt ustidan o'tadi; xato varianti, daraxt to'sqinlik qilmaydi). 11 · 2 «Eshik» ichida daraxt (1, 1) qoladi (5-darsdagi kvadratdagidek).
- Chegara yetadi: har pog'onada namuna yechim chegaraga teng yoki kam; 11 · ★ — aynan 7.
- Javoblar takrorlanmaydi: yulduz-topshiriqlar oxirgi kataklari — huk (5, 2) · 8 · 1 (2, 2) · 8 · 2 (6, 4) · 8 · 3 (4, 4) · 8 · ★ (2, 4) · 15 · 1 (3, 4) · 15 · 3 (5, 0) — hammasi har xil; ustoz ko'rsatuvlari (10, 14) ham bola pog'onalari bilan ustma-ust tushmaydi (8 · 2 dagi `go to` — (6, 4), hukdagi B — (5, 2)). Rasmlar to'rttasi ham har xil shakl.
- Oila tanlovi rostdan kerak: 8 · 2 — faqat go to sig'adi; 8 · 3 va ★ — go to siz sig'maydi; 11 · 1–★ — repeat siz sig'maydi; 15 · 1 va huk — faqat go to + repeat birga sig'adi; 15 · 2 — go to siz chizib bo'lmaydi.

## Yordam va xato

1–5-darsdagidek: xatoda muammocha — bitta gap, ishora qatorida nima qilish kerakligi; dastur o'zgarsa — ketadi. Bolaga «noto'g'ri», «xato qildingiz» deyilmaydi. Bu darsda devor yo'q — To'siqvoy chiqmaydi.
**Farqi — «Maslahat»:** pog'ona ochilganda qulf («Avval bir marta ishga tushiring»); birinchi «▶ Ishga tushir»dan keyin ochiladi; xatoda sariq yonadi (1–5-darsdagidek). Bosilsa — ustozda «Yordam so‘radi: N ta noutbuk» (o'zgarmaydi) va bolaning shu pog'onasiga «maslahat bilan» belgisi (mentorga, **KOD** — LMS). Ishora qatorining boshida hamma pog'onada (8, 15-qadam): «Qaysi blok kerak — o‘zingiz tanlang».

| Muammocha | Qachon | Pufakda | Ishora qatorida |
|---|---|---|---|
| Bo'shvoy | dastur bo'sh, «Ishga tushir» bosildi | «Bu yerda hech narsa yo‘q-ku…» | «Avval blokni bosing — u dasturga qo‘shiladi» |
| Bo'shvoy | repeat ichi bo'sh | «Ichi bo‘sh-ku…» | «repeat ichiga blok qo‘ying» |
| Ortiqvoy | dastur to'ldi — yangi blok qo'shilmadi | «Joy qolmadi!» | «Dasturga N ta blok sig‘adi. Boshqa blok tanlang» (chegara soni bilan; 5-darsdagi «repeat ichiga qo‘ying» o'rniga — bu darsda javob go to ham bo'lishi mumkin) |
| Kamvoy | 1–3-bekat yulduz topshirig'i: dastur tugadi, qahramon boshqa katakda | «Yulduz bu yerda emas!» | «Qahramon (x, y) da. Yulduzning manzilini o‘qing» (qahramonning haqiqiy manzili bilan) |
| Ortiqvoy | qahramon yulduz ustidan o'tib ketdi | «Ko‘payib ketdi!» | «Qahramon yulduzdan o‘tib ketdi — oxirgi blokni tekshiring» |
| Kamvoy | olma qoldi | «Olma qoldi-ku!» | «Avval olmaga boring — u (x, y) da» |
| Kamvoy | 2–3-bekat rasm: kulrang katak qoldi | «Oz qoldi!» | «Kulrang katak qoldi — (x, y). Son va yo‘nalishni tekshiring» |
| Ortiqvoy | 2–3-bekat rasm: iz kulrangdan chiqdi | «Rasmdan chiqdi!» | «Qahramon (x, y) ga chiqdi — u kulrang emas. Kerak bo‘lsa — sakrang» |
| Kamvoy | qahramon maydon chetiga keldi | «Maydon tugadi!» | «Qahramon shu blokda to‘xtadi. Son va yo‘nalishni tekshiring» (15 · 3 da: «Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring») |
| Kamvoy | 15 · ★: go to yoki repeat yo'q | «Oz qoldi!» | «Dasturda go to ham, repeat ham bo‘lsin» (**KOD**) |

---

## 1 · Kirish

- **Vaqt:** 0:00–0:02 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — kirish · bola — kirish → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: «6-dars · Amaliyot», sarlavha «Bugun hammasini o‘zingiz tuzasiz!». Coddy: «Salom! Bugun bloklarni o‘zingiz tanlaysiz.» O'ngda maydon, Coddy (0, 0) da. Pastda kichik karta «O‘tgan darsda»: `repeat 3` ichida `move right` — «Takrorlash — Bir ishni ko‘p marta bajarish». Panelda: «Kirdi: 12 / 14».
- **Tayanch gaplar:**
  1. «O‘tgan darsda takrorlash bilan rasm chizdik.»
  2. «Bugun yangi blok yo‘q — o‘rganganlarimizni o‘zingiz ishlatasiz.»
  3. «Noutbukda «Tayyorman» tugmasini bosing.»
- **O'z so'zi bilan:** salomlashadi; 5-darsdagi bitta rasmni eslatadi (kvadrat yoki zinapoya); bugun ustoz yechib bermasligini aytadi — har kim o'zi tuzadi.
- **Ustoz satri:** Kirdi: 12 / 14
- **Parta:** «6-dars · Amaliyot», «Salom, Aziz!»; tasmada «Tayyor bo‘lsangiz — tugmani bosing», asosiy tugma «Tayyorman». Bosgach: «Ustoz ekraniga qarang».
- **Bola qiladi:** «Tayyorman»ni bosadi.
- **Tekshiruv:** tugma bosildi.

## 2 · Savol: qaysi bloklar bilan yetamiz?

- **Vaqt:** 0:02–0:03:30 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol · bola — savol (kartalar) → «Ustoz ekraniga qarang»
- **Sahna:** huk — «uch taxmin, uch sinov» (80-qaror). Har karta — o'tgan darslardan bitta yo'l: A — faqat takrorlash (5-dars), B — faqat sakrash (3-dars), C — ikkalasi birga. Bu — darsdagi yagona savol.
- **Qadamlar:**
  1. Proyektorda: yorliq «Savol», sarlavha «Qaysi bloklar bilan yetamiz?». Maydon: Coddy (0, 0) da, olmalar (1, 2)…(4, 2), yulduz (5, 2) da; maydon ustida kichik yozuv «Dasturga 3 ta blok sig‘adi». Coddy: «Yo‘lda 4 ta olma. Hammasini terib, yulduzga boramiz.» Chapda uchta karta: A «Ikkita repeat» (`repeat 2` ichida `move up`, `repeat 5` ichida `move right` rasmi) · B «go to bilan sakraymiz» (`go to x: 5 y: 2` rasmi) · C «Sakrab, keyin takrorlaymiz» (`go to x: 0 y: 2` va `repeat 5` ichida `move right` rasmi). Har kartada nechta bola tanlagani o'sib boradi. Panelda: «Javob berdi: 14 / 14», tugma «Sinab ko‘ramiz ›».
- **Tayanch gaplar:**
  1. «Qahramon olmalarni terib, yulduzga yetsin. Dasturga faqat 3 ta blok sig‘adi.»
  2. «Har kim noutbukida bitta kartani tanlasin: qaysi bloklar bilan yetamiz?»
- **O'z so'zi bilan:** kartalarni o'qiydi; olmalarni sinf bilan sanaydi; sinf javoblarini o'qiydi. Kartadagi bloklarni sanamaydi — buni sinov ko'rsatadi.
- **Ustoz satri:** Javob berdi: 14 / 14
- **Parta:** o'sha savol va uchta karta; Coddy: «Qaysi yo‘l bilan yulduzga yetamiz?»; ishora «Birini tanlang». Tanlagach — «Ustoz ekraniga qarang» («Javobingiz qabul qilindi»).
- **Bola qiladi:** bitta kartani tanlaydi.
- **Tekshiruv:** baho yo'q — javobni sinovlar ko'rsatadi.

## 3 · Uch sinov

- **Vaqt:** 0:03:30–0:05:30 (2 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — savol (sinov holatlari) · bola «Ustoz ekraniga qarang» («Ustoz yo‘llarni sinayapti — kuzating»)
- **Qadamlar:**
  1. Ustoz «Sinab ko‘ramiz ›»ni bosadi — A: kartada to'rt blok, to'rtinchisi (`move right`) xira, yonida «4 / 3» (5-darsdagi A kartasidek, animatsiyasiz). Sig'gan qism ishlaydi: Coddy ikki qadam tepaga yurib (0, 2) da to'xtaydi — olma yo'q. Kartada: «✕ sig‘madi: 4 ta blok».
  2. «Keyingi» — B: Coddy bitta sakrashda yulduz katagiga tushadi, olmalar joyida qoladi. Kartada: «✕ olmalar qoldi».
  3. «Keyingi» — C: Coddy (0, 2) ga sakraydi, keyin repeat bilan besh qadam o'ngga — har qadamda olma, yulduzda konfeti. Kartada: «✓ 3 ta blok».
- **Tayanch gaplar:**
  1. «repeat ham blok — ikkita repeat to‘rt blok bo‘ldi. go to esa olmalardan sakrab o‘tdi.»
  2. «go to sakratdi, repeat terib bordi — ikki xil blok birga ishladi.»
- **O'z so'zi bilan:** A da bloklarni sinf bilan sanaydi (repeat ham, ichidagisi ham); C da Coddy qadamlarini sanaydi (1 … 5).
- **Ustoz qiladi:** «Keyingi»ni bosadi (ikki marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi; o'z taxmini sinalganini ko'radi.
- **Tekshiruv:** natija kartaning o'zida (80-qaror).

## 4 · Javob: bloklar birga ishlaydi

- **Vaqt:** 0:05:30–0:06:30 (1 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — javob · bola «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Javob», sarlavha «Bloklar birga ishlaydi». A va B xira, C oltin; maydonda Coddy yulduzda, (0, 0) dan (0, 2) gacha punktir sakrash izi va 2-qatorda oltin iz. Coddy: «go to sakratdi, repeat olma terdi.»
- **Tayanch gaplar:**
  1. «Bir dasturda har xil bloklar birga ishlaydi. Qaysi blok kerakligini o‘zingiz tanlaysiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 5 · Eslaymiz: uch blok

- **Vaqt:** 0:06:30–0:08 (1,5 daqiqa)
- **Bekat:** hali yo'q
- **Ekran:** proyektor — eslatma · bola «Ustoz ekraniga qarang» («Eslaymiz: uch blok»)
- **Sahna:** 1–5-darsdagi «Yangi so'z» ekranining o'rnida — qisqa takrorlash. Yangi narsa yo'q; uch qator birma-bir yonadi (3–5-darsdagi `raqam` ishi).
- **Qadamlar:**
  1. Proyektorda: yorliq «Eslaymiz», sarlavha «Uch blok — uch ish». Coddy: «Har blok o‘z ishini qiladi.» Uch qator xira; «Keyingi» bosilganda birma-bir:
     - 1-bosish: `move right` bloki — «Bitta katak yuradi»;
     - 2-bosish: `go to x: y:` bloki — «Manzilga sakraydi»;
     - 3-bosish: `repeat` bloki (ichida `move right`) — «Ichidagini ko‘p marta bajaradi».
     O'ngda maydon, Coddy (0, 0) da (harakatsiz). Uchinchisidan keyin «Keyingi» — keyingi qadam.
- **Tayanch gaplar:**
  1. «move — bitta katak. go to — manzilga sakraydi. repeat — ko‘p marta.»
  2. «Bugun shu uchtasini o‘zingiz tanlab ishlatasiz.»
- **O'z so'zi bilan:** har blokning darsini eslatadi (2-dars labirint, 3-dars X va Y, 5-dars rasm); ranglarni aytadi: ko'k — Harakat, yashil — Takrorlash.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi va eshitadi.
- **Tekshiruv:** yo'q.

## 6 · Reja

- **Vaqt:** 0:08–0:09 (1 daqiqa)
- **Bekat:** reja — uchala bekat
- **Ekran:** proyektor — reja tepaligi · bola «Ustoz ekraniga qarang» («Bugun: uchta bekat»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Reja», sarlavha «Bugun nima qilamiz?». Tepalik: 1 · Yo'l → 2 · Rasm → 3 · Hammasi birga; cho'qqida kichik karta «Dars oxirida · o‘z rasmingiz · Dasturini o‘qib berasiz» (kichik maydonda namuna: zinapoya va minora — 15 · ★ namunasi). Coddy startda, 1-bekat miltillaydi. Coddy: «Uchta bekat. Har birida o‘zingiz tuzasiz.» Panelda tugma «Boshladik ›».
- **Tayanch gaplar:**
  1. «Bugun uchta bekat: yo‘l, rasm, hammasi birga.»
  2. «Dars oxirida go to va repeat bilan o‘z rasmingizni chizasiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 7 · Bugungi qoida: o'zingiz

- **Vaqt:** 0:09–0:10 (1 daqiqa)
- **Bekat:** 1 · Yo'l
- **Ekran:** proyektor — Blok studiya (ustoz, maydon; dastur bo'sh) · bola «Ustoz ekraniga qarang» («Ustoz bugungi qoidani aytyapti»)
- **Sahna:** 1–5-darsdagi «Ko'ramiz» o'rnida: ustoz topshiriq yechmaydi — studiyaning uch joyini ko'rsatadi (`raqam` ishi; studiya ekranida — qurishda tekshiriladi).
- **Qadamlar:**
  1. Proyektorda: yorliq «Qoida», sarlavha «Bugun — o‘zingiz». Javonda ikki oila: Harakat (to'rt `move` va `go to`), Takrorlash (`repeat 2`). Maydonda Coddy (0, 0) da, yulduz yo'q. Coddy: «Avval maydonga qarang, keyin blok tanlang.»
  2. «Keyingi» — javon hoshiyalanadi, yonida yozuv «Hamma blok shu yerda — o‘zingiz tanlaysiz».
  3. «Keyingi» — tasma yonidagi «0 / 3 ta blok» hoshiyalanadi: «Nechta blok sig‘adi — shu yerda».
  4. «Keyingi» — «Maslahat» tugmasi qulf belgisi bilan hoshiyalanadi: «Maslahat bir urinishdan keyin ochiladi».
- **Tayanch gaplar:**
  1. «Bugun topshiriqlarni men yechmayman — o‘zingiz tuzasiz.»
  2. «Avval maydonni o‘qing: qahramon qayerda, yulduz qayerda, nechta blok sig‘adi.»
  3. «Maslahat bir marta ishga tushirgandan keyin ochiladi. Endi o‘zingiz.»
- **O'z so'zi bilan:** muammocha chiqsa — bu xato emas, qayerda to'xtaganini ko'rsatadi; bir pog'onada qolib ketsa, qo'l ko'tarsin.
- **Ustoz qiladi:** «Keyingi»ni bosadi (uch marta).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 8 · Yo'l: pog'onalar

- **Vaqt:** 0:10–0:21 (11 daqiqa)
- **Bekat:** 1 · Yo'l
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Endi o‘zingiz!». Coddy: «Yulduzga boring — blokni o‘zingiz tanlang.» Chapda katta son «Uch pog‘onani tugatdi 4 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Burchak» · 2 «Eng uzoq katak» · 3 «Tepa qator» · ★ «Uchta blok» — har kartada topshiriq rasmi (start, olmalar, yulduz — bola ham shuni ko'radi; yechim chizilmaydi) va hozir shu pog'onada nechta bola. Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Avval o‘ylang: qaysi blok kerak? Nechta blok sig‘adi?»
  2. «Muammocha qayerda to‘xtaganini ko‘rsatadi — o‘sha joydan tuzating.»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** sinfni aylanadi; yechimni aytmaydi — «Qahramon qayerda? Yulduz qayerda? Nechta blok sig‘adi?» deb so'raydi; doskaga qarab ko'p bola qaysi pog'onada turganini kuzatadi («Darsdan oldin» — pog'ona va ko'nikma jadvali).
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javonda Harakat (to'rt `move`, `go to`) va Takrorlash (`repeat 2`); maydon; tasma yonida «0 / N ta blok»; «Maslahat» qulf bilan («Avval bir marta ishga tushiring»). Hamma pog'onada ishora boshida: «Qaysi blok kerak — o‘zingiz tanlang».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Burchak», ostida «Olmani olib, yulduzga boring.». Start (0, 0); olma (0, 2); yulduz (2, 2); 4 ta blok. «Maslahat»: «Olma yo‘lda — avval olmaga boring».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Eng uzoq katak», ostida «Yulduz — eng uzoq burchakda.». Start (0, 0); yulduz (6, 4); 1 ta blok. «Maslahat»: «Bitta blok bilan uzoqqa — sakrash kerak. Yulduzning X va Y sini o‘qing».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Tepa qator», ostida «Ikki olma, keyin yulduz.». Start (0, 0); olmalar (2, 4), (3, 4); yulduz (4, 4); 3 ta blok. «Maslahat»: «Birinchi olmaga sakrang — qolgani yonma-yon».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «Uchta blok», ostida «Ikki olma, keyin yulduz.». Start (0, 0); olmalar (3, 0), (6, 2); yulduz (2, 4); 3 ta blok. «Maslahat»: «Har biri uzoqda — har biriga bitta sakrash. Yulduz — oxirida».
  Yetsa: «Yetib bordi!» va konfeti; keyingi pog'ona o'zi ochiladi (100-qaror).
- **Bola qiladi:** maydonni o'qiydi, blokni o'zi tanlaydi, dastur tuzadi, ishga tushiradi, kerak bo'lsa tuzatadi.
- **Tekshiruv:** dastur tugaganda qahramon yulduzda, olmalar olingan (avto); bloklar chegaradan oshmaydi (dastur o'zi qo'ymaydi).
- **Xatoda:** boshqa katak — Kamvoy «Yulduz bu yerda emas!»; o'tib ketdi — Ortiqvoy «Ko‘payib ketdi!»; olma qoldi — Kamvoy «Olma qoldi-ku!»; joy qolmadi — Ortiqvoy «Joy qolmadi!»; chet — Kamvoy «Maydon tugadi!»; repeat ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…».

## 9 · 2-bekat

- **Vaqt:** 0:21–0:22 (1 daqiqa)
- **Bekat:** 2 · Rasm
- **Ekran:** proyektor — reja tepaligi (1-bekat ✓) · bola «Ustoz ekraniga qarang» («2-bekat: rasm»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 · Yo'l ✓, oltin yoy; Coddy 2-bekatda; 2 · Rasm miltillaydi. Coddy: «Endi oltin iz bilan rasm chizamiz.»
- **Tayanch gaplar:**
  1. «Yo‘l bekatidan o‘tdik. Endi kam blok bilan rasm chizamiz.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 10 · Eslaymiz: kulrang rasm

- **Vaqt:** 0:22–0:23 (1 daqiqa)
- **Bekat:** 2 · Rasm
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz rasm topshirig‘ini eslatyapti»)
- **Sahna:** topshiriq turini eslatish — ustoz qisqartirmaydi, yechim ko'rsatmaydi; faqat «kulrang — oltin» qoidasini bir marta ko'rsatadi.
- **Qadamlar:**
  1. Proyektorda: yorliq «Eslaymiz», sarlavha «Kulrang — chiziladigan rasm». Maydonda kulrang kataklar (2, 0), (2, 1), (2, 2), (3, 2), (4, 2); Coddy (2, 0) da. Dasturda tayyor 4 ta blok: `move up`, `move up`, `move right`, `move right`.
  2. «▶ Ishga tushir»: o'tgan har kulrang katak oltin bo'ladi; «Rasm tayyor!».
- **Tayanch gaplar:**
  1. «Kulrang kataklar — chiziladigan rasm. Hammasi oltin bo‘lsa — tayyor.»
  2. «Endi o‘zingiz: rasmlarni kam blok bilan chizing.»
- **O'z so'zi bilan:** qaysi burchakdan boshlash ahamiyatsiz; kulrangdan chiqmaslik kerak.
- **Ustoz qiladi:** ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 11 · Rasm: pog'onalar

- **Vaqt:** 0:23–0:35 (12 daqiqa)
- **Bekat:** 2 · Rasm
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Rasm chizing!». Coddy: «Kulrang kataklarni kam blok bilan oltin qiling.» Chapda katta son «Uch pog‘onani tugatdi 5 / 14» va belgilar; o'ngda zinapoya: 1 «Chiziq» · 2 «Eshik» · 3 «Keng zinapoya» · ★ «To‘lqin» — har kartada kulrang rasm (bola ham shuni ko'radi). Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Bir xil qadamlar ko‘p bo‘lsa — repeat.»
  2. «Uzun dasturni o‘qing: qaysi bo‘lak takrorlanyapti?»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** «Tomonda nechta katak?» deb so'raydi; 3-pog'onada va ★ da barmoq bilan uzun dasturdagi bo'laklarni ajratishni so'raydi — o'zi ajratmaydi.
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; maydonda kulrang kataklar; tasma yonida «0 / N ta blok»; «Maslahat» qulf bilan. Ishora boshida — 1–2-pog'onada «Kulrang kataklar ustidan yuring», 3-pog'ona va ★ da «Uzun dasturda takrorlanadigan bo‘lakni toping». Qahramon o'tgan katak oltin bo'ladi.
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Chiziq», ostida «Butun qatorni chizing.». Start (0, 2); kulrang — (0, 2)…(6, 2); 2 ta blok. «Maslahat»: «Qatorda nechta qadam? Bir xil qadamni repeat ichiga qo‘ying».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Eshik», ostida «Eshikning chetini chizing.». Start (0, 0); kulrang — (0, 0)–(3, 2) to'rtburchagining cheti, ichida daraxt; 8 ta blok. «Maslahat»: «Har tomonga bitta repeat — kataklarni sanang».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Keng zinapoya», ostida «4 ta blok bilan chizing. Uzun dastur: ↑ → → ↑ → →». Start (2, 0); 4 ta blok. «Maslahat»: «Uzun dastur ikkita bir xil bo‘lakdan iborat».
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «To‘lqin», ostida «7 ta blok bilan chizing. Uzun dastur: ↑ ↑ → ↓ ↓ → ↑ ↑ → ↓ ↓ →». Start (2, 0); 7 ta blok. «Maslahat»: «Uzun dasturning birinchi yarmi ikkinchisiga teng».
  1–2-pog'onada tayyor bo'lsa: «Rasm tayyor!»; 3-pog'ona va ★ da: «Qisqartirdingiz!»; konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** tomonlarni sanaydi yoki takrorlanadigan bo'lakni topadi, repeat qo'yadi, ishga tushiradi.
- **Tekshiruv:** kulrang kataklarning hammasi oltin, iz kulrangdan chiqmadi (avto); bloklar chegaradan oshmadi; qaysi burchakdan, qaysi tomonga chizgani ahamiyatsiz.
- **Xatoda:** kulrang qoldi — Kamvoy «Oz qoldi!»; iz kulrangdan chiqdi — Ortiqvoy «Rasmdan chiqdi!»; joy qolmadi — Ortiqvoy «Joy qolmadi!»; chet — Kamvoy «Maydon tugadi!»; repeat ichi bo'sh — Bo'shvoy «Ichi bo‘sh-ku…».

## 12 · Xulosa: har ishga — o'z bloki

- **Vaqt:** 0:35–0:37 (2 daqiqa)
- **Bekat:** 2 · Rasm
- **Ekran:** proyektor — xulosa · bola «Ustoz ekraniga qarang» («Xulosa: har ishga — o‘z bloki»)
- **Qadamlar:**
  1. Proyektorda: yorliq «Xulosa», sarlavha «Har ishga — o‘z bloki». Coddy: «Avval o‘ylayman, keyin blokni tanlayman.» Uch karta: `move right` — «Bir-ikki qadam» · `go to x: y:` — «Uzoq joyga — bitta sakrash» · `repeat 3` (ichida `move right`) — «Bir xil qadam ko‘p bo‘lsa»; o'ngda maydon — Coddy va hukdagi yo'l (sakrash izi va oltin iz).
- **Tayanch gaplar:**
  1. «Bir-ikki qadam — move. Uzoq joy — go to. Bir xil qadam ko‘p — repeat.»
  2. «Kerak bo‘lsa, ular bir dasturda birga ishlaydi.»
- **O'z so'zi bilan:** 1–2-bekat doskasida ko'p bola qolgan pog'onani eslatadi (ismsiz) va o'sha maydonni sinf bilan birga o'qiydi: nima berilgan, nechta blok sig'adi — yechimni aytmaydi (ulgurmaganlar uyda — solo'da — qaytadi).
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 13 · 3-bekat

- **Vaqt:** 0:37–0:38 (1 daqiqa)
- **Bekat:** 3 · Hammasi birga
- **Ekran:** proyektor — reja tepaligi (1, 2 ✓) · bola «Ustoz ekraniga qarang» («3-bekat: hammasi birga»)
- **Qadamlar:**
  1. Proyektorda: tepalik; 1 ✓, 2 ✓, oltin yoylar; Coddy 3-bekatda; 3 · Hammasi birga miltillaydi. Coddy: «Oxirgi bekat: hamma blok birga.»
- **Tayanch gaplar:**
  1. «Ikki bekatdan o‘tdik. Oxirgisida go to va repeat birga kerak bo‘ladi.»
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

## 14 · Eslaymiz: dasturni tuzatish

- **Vaqt:** 0:38–0:39:30 (1,5 daqiqa)
- **Bekat:** 3 · Hammasi birga
- **Ekran:** proyektor — Blok studiya (ustoz, maydon) · bola «Ustoz ekraniga qarang» («Ustoz dasturni tuzatyapti — kuzating»)
- **Sahna:** 15 · 3 dagi tayyor dastur turini eslatish: dastur tayyor, ishga tushiriladi, muammocha qayerda to'xtaganini ko'rsatadi, bloklarning joyi almashtiriladi (95-qaror — 2-darsdagi tanlash). Bola topshirig'idan boshqa maydon va boshqa xato (bu yerda — olma qoladi, 15 · 3 da — chet).
- **Qadamlar:**
  1. Proyektorda: yorliq «Eslaymiz», sarlavha «Tayyor dasturni tuzatamiz». Maydon: Coddy (0, 0) da, olma (3, 0), yulduz (3, 2). Dasturda tayyor: `repeat 2` ichida `move up`, `repeat 3` ichida `move right` — «4 ta blok».
  2. «▶ Ishga tushir»: Coddy tepaga, keyin o'ngga yurib yulduzga yetadi, olma qoladi — Kamvoy «Olma qoldi-ku!».
  3. Ustoz `repeat 3` ni bosadi (tanlanadi), keyin `repeat 2` ni bosadi — joyi almashadi. «▶ Ishga tushir» — olma, yulduz, konfeti.
- **Tayanch gaplar:**
  1. «Avval dasturni o‘qing, keyin ishga tushiring — muammocha qayerda to‘xtaganini ko‘rsatadi.»
  2. «Bloklar to‘g‘ri, tartibi boshqa — joyini almashtiramiz.»
  3. «Endi o‘zingiz.»
- **O'z so'zi bilan:** 2-darsdagi «Xatoni topamiz» bekatini eslatadi; blokni bosib tanlash va ikkinchisini bosib almashtirishni sekin ko'rsatadi.
- **Ustoz qiladi:** ishga tushiradi, ikki blokni bosib joyini almashtiradi, yana ishga tushiradi.
- **Parta:** «Ustoz ekraniga qarang».
- **Bola qiladi:** kuzatadi.
- **Tekshiruv:** yo'q.

## 15 · Hammasi birga: pog'onalar

- **Vaqt:** 0:39:30–0:54 (14,5 daqiqa)
- **Bekat:** 3 · Hammasi birga
- **Ekran:** proyektor — sinf doskasi · bola — Blok studiya: 1 → 2 → 3 → ★ → «Ustoz ekraniga qarang»
- **Qadamlar:**
  1. Proyektorda: yorliq «Mashq», sarlavha «Hammasi birga!». Coddy: «Kerakli bloklarni o‘zingiz tanlang.» Chapda katta son «Uch pog‘onani tugatdi 6 / 14» va belgilar, ostida «Har belgi — uch pog‘onani tugatgan bitta bola»; o'ngda zinapoya: 1 «Ustun» · 2 «Teng belgisi» · 3 «Xatoni toping» · ★ «O‘z rasmingiz» — kartalarda: 1 — start, olmalar, yulduz; 2 — kulrang rasm; 3 — start, olmalar, yulduz (tayyor dastur ham, uning tuzatilgani ham chizilmaydi); ★ — faqat start. Panelda: «Yordam so‘radi: 1 ta noutbuk».
- **Tayanch gaplar:**
  1. «Bu bekatda bitta oila yetmaydi — go to va repeat birga kerak.»
  2. «Tayyor dasturni avval ishga tushiring: qayerda to‘xtaydi?»
  3. (oxirida) «To‘xtadik. Qo‘llar klaviaturadan.»
- **O'z so'zi bilan:** 2-pog'onada «chiziqlar orasidan yurish mumkinmi?» deb so'raydi; 3-pog'onada xatoni darrov aytmaydi — bola o'zi topsin; ★ da «Rasmingiz nimaga o‘xshaydi?».
- **Ustoz satri:** Yordam so‘radi: 1 ta noutbuk
- **Parta:** Blok studiya; javon to'liq; tasma yonida «0 / N ta blok» (3-pog'onada «3 / 3 ta blok»); «Maslahat» qulf bilan. Hamma pog'onada ishora boshida: «Qaysi blok kerak — o‘zingiz tanlang».
  1-pog'ona. Yorliq «Mashq · 1-pog‘ona», sarlavha «Ustun», ostida «Uch olma, keyin yulduz.». Start (0, 0); olmalar (3, 1), (3, 2), (3, 3); yulduz (3, 4); 3 ta blok. «Maslahat»: «Bitta sakrash, keyin bir xil qadamlar».
  2-pog'ona. Yorliq «Mashq · 2-pog‘ona», sarlavha «Teng belgisi», ostida «Ikki chiziqni chizing.». Start (0, 0); kulrang — (0, 0)…(3, 0) va (0, 2)…(3, 2); 5 ta blok. «Maslahat»: «Chiziqlar orasidan yurmang — ikkinchisiga sakrang».
  3-pog'ona. Yorliq «Mashq · 3-pog‘ona», sarlavha «Xatoni toping», ostida «Dastur tayyor — bitta xatosi bor.». Start (0, 0); olmalar (5, 2), (5, 1); yulduz (5, 0); dasturda tayyor: `repeat 3` ichida `move down`, `go to x: 5 y: 3`; 3 ta blok. «Maslahat»: «To‘xtagan blokni o‘qing: qahramon qayerdan yurishi kerak edi? Bloklar tartibini o‘ylang»
  ★ qo'shimcha. Yorliq «Mashq · ★ qo‘shimcha», sarlavha «O‘z rasmingiz», ostida «go to va repeat bilan o‘z rasmingizni chizing.». Start (0, 0); kulrang yo'q; 12 ta blok. «Maslahat»: «Bir bo‘lakni chizing, keyin go to bilan sakrab, yana chizing». Erkin ijod (36-qaror).
  1-, 3-pog'onada yetsa: «Yetib bordi!»; 2-pog'onada: «Rasm tayyor!»; ★ da: «Rasmingiz tayyor!»; konfeti; keyingi pog'ona o'zi ochiladi.
- **Bola qiladi:** go to va repeat ni birga ishlatadi; tayyor dasturni ishga tushiradi, xatoni topib tuzatadi; ★ da o'z rasmini chizadi.
- **Tekshiruv:** 1, 3 — qahramon yulduzda, olmalar olingan; 2 — rasm tayyor; ★ — dasturda go to ham, repeat ham bor va dastur chetga urilmay tugadi (avto). 3-pog'onada har qanday tuzatish qabul (chegarada): joy almashtirish, go to sonini o'zgartirish, boshqa yechim — teng.
- **Xatoda:** 8- va 11-qadamdagidek; 3-pog'onada tayyor dastur — Kamvoy «Maydon tugadi!» («Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring»); ★ da go to yoki repeat yo'q — Kamvoy «Oz qoldi!» («Dasturda go to ham, repeat ham bo‘lsin»).

## 16 · Rasmingiz dasturini o'qib bering

- **Vaqt:** 0:54–0:59 (5 daqiqa)
- **Bekat:** 3 · Hammasi birga
- **Ekran:** proyektor — Blok studiya (ustoz, maydon, dastur bo'sh) · bola — oxirgi yechgan pog'onasi o'z dasturi bilan («Dasturingizni ustozga o‘qib bering»; A·1, 20.11); hech narsa yechmagan bolada — «Ustoz ekraniga qarang»
- **Sahna:** 12-bo'lim 3-band: bola 15 · ★ dagi rasmining (yoki biror pog'onasining) dasturini ovoz chiqarib o'qiydi («repeat 2: move right, move right, move up; go to x: 5 y: 0; repeat 3: move up»), ustoz o'sha bloklarni qo'yadi va ishga tushiradi. Proyektorda ism yo'q.
- **Qadamlar:**
  1. Proyektorda: yorliq «Ko‘rsatish», sarlavha «Dasturingizni o‘qib bering». Maydon, Coddy (0, 0) da; dastur bo'sh. Coddy: «Siz o‘qiysiz — men chizaman.»
  2. Bola o'qiydi; ustoz bloklarni qo'yadi, sonlarni tanlaydi; «▶ Ishga tushir» — sinf qanday rasm chiqqanini ko'radi.
  3. Ikki-uch bola. Vaqt qolsa — doskada ko'p bola qolgan pog'onaning yechimini tuzgan bola o'qiydi.
- **Tayanch gaplar:**
  1. «Kim rasmining dasturini o‘qib beradi? Blokma-blok, yuqoridan pastga.»
  2. «Kuzating: qanday rasm chiqadi?»
- **O'z so'zi bilan:** bolani maqtaydi; rasmga sinf bilan nom qo'yadi; bir xil rasmni boshqa bloklar bilan chizgan bola bo'lsa — ikkalasini solishtiradi (yo'l ko'p).
- **Ustoz qiladi:** bola aytgan bloklarni qo'yadi, ishga tushiradi.
- **Parta:** o'z ekrani — o'qib berish uchun.
- **Bola qiladi:** dasturini o'qiydi yoki do'stinikini tinglaydi.
- **Tekshiruv:** yo'q.

## 17 · Yakun

- **Vaqt:** 0:59–1:02 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — yakun · bola — o'z natijasi
- **Qadamlar:**
  1. Proyektorda: yorliq «Yakun», sarlavha «Siz o‘zingiz tuzdingiz!». Bugungi qoida (so'z o'rnida): «Har ishga — o‘z bloki». Pastda: ✓ Yo'l · ✓ Rasm · ✓ Hammasi birga. Kichik karta «Keyingi dars · 7 · Kostyum va tovush».
- **Tayanch gaplar:**
  1. «Uchala bekatdan o‘tdik: yo‘l, rasm, hammasi birga.»
  2. «Bugun bloklarni o‘zingiz tanladingiz: har ishga — o‘z bloki.»
  3. «Keyingi darsda qahramon kostyumini almashtiradi va ovoz chiqaradi.»
- **O'z so'zi bilan:** qoidani bolalardan aytdiradi («Uzoq joyga qaysi blok?»); qiyin pog'onalar solo'da — uyda — qayta ochilishini aytadi.
- **Parta:** yorliq «Sizning natijangiz», sarlavha «Siz o‘zingiz tuzdingiz!». Coddy o'rniga qahramon: «Bloklarni o‘zingiz tanlab, dastur tuzdingiz.» «Siz bugun»: N pog‘ona bajardi · N ta go to qo‘ydi · N ta repeat qo‘ydi (haqiqiy son). O'z qahramoni maydonda, ★ rasmining oltin izi bilan (bo'lsa); «Keyingi darsda kostyum va tovush bilan ko‘rishamiz!».
- **Bola qiladi:** o'z natijasini ko'radi.
- **Tekshiruv:** dars tugadi deb belgilanadi (oxirgi ekran).

## 18 · Sinfimiz bugun

- **Vaqt:** 1:02–1:05 (3 daqiqa)
- **Bekat:** uchalasi ✓
- **Ekran:** proyektor — sinf natijasi · bola — o'z natijasi (17-qadam)
- **Qadamlar:**
  1. Proyektorda: yorliq «Sinf natijasi», sarlavha «Sinfimiz bugun». Coddy: «Hammangiz o‘zingiz tuzdingiz!» Butun sinf jami (haqiqiy son, ismsiz): N pog‘ona bajardi · N ta go to qo‘ydi · N ta repeat qo‘ydi; o'ngda bolalar qahramonlari. Panelda asosiy tugma «Darsni yakunlash».
  2. «Darsni yakunlash» bosilsa — proyektorda «Dars tugadi!», ostida «Ko‘rishguncha — keyingi darsda kostyum va tovush bilan!»; bolalar noutbukida «Dars tugadi. Ko‘rishguncha!» va konfeti.
- **Tayanch gaplar:**
  1. «Hammangiz o‘zingiz tuzdingiz!» (keyin raqamlarni o'qiydi)
  2. «Dasturchi ham shunday ishlaydi: avval o‘ylaydi, keyin blokni tanlaydi.»
- **Ustoz qiladi:** «Darsni yakunlash»ni bosadi.
- **Parta:** 17-qadamdagi o'z natijasi; yakunlangach — «Dars tugadi. Ko‘rishguncha!».
- **Bola qiladi:** qaraydi.
- **Tekshiruv:** yo'q.

---

## Solo: bola darsni ustozsiz o'tadi

1–5-darsdagidek (88-qaror). Farqi:
- 3-qadam: bola uchala kartani o'zi sinaydi (har kartada «▶ Sinab ko‘rish»); natija kartaning o'zida.
- 5-, 7-qadam: «Keyingi»ni bola o'zi bosadi (qatorlar birma-bir yonadi).
- 10-, 14-qadam (ustoz eslatadi): dastur tayyor turadi, bola o'zi «▶ Ishga tushir»ni bosadi; 14 da joy almashtirishni ham o'zi qiladi (ishora: «Ikki repeat ni bosing — joyi almashadi»).
- «Maslahat» solo'da ham bir urinishdan keyin ochiladi.
- Solo'da yo'q qadamlar: 16 (o'qib berish — sinfsiz bo'lmaydi) va 18 (sinf natijasi). Sinf doskalari (8, 11, 15) o'rniga bola darhol o'z ekranini ko'radi; solo 17-qadamdagi o'z natijasi bilan tugaydi.
- Pog'ona bajarilgach keyingisi o'zi ochiladi (100-qaror); har studiya ekranida «Keyingi ›» — o'tkazib yuborsa bo'ladi. Jonli darsda ulgurilmagan pog'onalar shu yerda qayta ochiladi.

## LMS (CoddyCamp) bilan ulanish

- Dars nomi: `junior-006-amaliyot-v1`, kalit `jr006` (**KOD**: server ro'yxatiga — modul tugagach, 93-qaror).
- Dars tugagan deb belgilanadi: bola oxirgi ekranga yetdi. Yutuqlar: «Yo‘lchi» (`yolchi`) — 8-qadamda 3-pog'ona bajarildi (go to shart bo'lgan birinchi yo'l); «Usta» (`usta`) — 15-qadamda 3-pog'ona bajarildi (tayyor dastur tuzatildi).
- **Mentor uchun** (dasturdagi «Avto + mentor», **KOD**): har bola, har pog'ona (12 ta) — bajardi / bajarmadi · «Maslahat»ni ochdimi · necha marta ishga tushirdi. Bekat «mustaqil bajarildi» — uning 1–3-pog'onasi maslahatsiz bajarilgan. Faqat LMS natijasida (ustoz va mentor ko'radi), proyektorga chiqmaydi (12-bo'lim 2-band).

## Darsdan oldin (ustoz uchun)

- Shu faylni o'qing: har qadamda ekranda nima chiqadi, nima deysiz. Aytiladigan gaplar 2–3 tadan; qolganini o'z so'zingiz bilan.
- **Bu — amaliyot darsi: yangi blok yo'q, siz topshiriq yechmaysiz.** 10- va 14-qadamdagi eslatmalarda faqat topshiriq turini ko'rsatasiz (kulrang rasm, tayyor dasturni tuzatish) — bolalarning pog'onalari boshqa maydonda.
- Darsda savol bitta — boshidagi huk. Mashq paytida bolaga yechim aytmang: «Qahramon qayerda? Yulduz qayerda? Nechta blok sig‘adi?» — shu uch savol bilan o'zi topsin.
- «Maslahat» bir urinishdan keyin ochiladi — ataylab: bola avval o'zi sinaydi. Qulfni ochib bermang.
- Bugungi asosiy fikr bitta: **har ishga — o'z bloki; kerak bo'lsa ular birga ishlaydi.** Hukda, xulosada (12) va yakunda chiqadi.
- **Doskada kim qayerda** — faqat son (har pog'onada nechta bola). Ko'p bola bir pog'onada tursa, bu nimani tushunmaganini ko'rsatadi:

| Ko'p bola turgan pog'ona | Nima qiyin | Siz nima qilasiz |
|---|---|---|
| 8 · 1 «Burchak» | yo'nalish va tartib (2-dars) | «Olmaga avval qaysi tomonga yuramiz?» |
| 8 · 2 «Eng uzoq katak» | qaysi blok bitta bo'lib uzoqqa olib boradi (3-dars) | «1 ta blok sig‘adi — qaysi blok sakraydi?» |
| 8 · 3, 8 · ★ | go to sonlarini o'qish, tartib | X va Y ni sinf bilan o'qing (yechimsiz) |
| 11 · 1, 11 · 2 | repeat soni, tomonlarni sanash (5-dars) | «Tomonda nechta katak?» |
| 11 · 3, 11 · ★ | takrorlanadigan bo'lakni topish | barmoq bilan uzun dasturni bo'laklarga bo'lishni so'rang |
| 15 · 1, 15 · 2 | ikki oilani birga ishlatish | hukdagi C kartasini eslating |
| 15 · 3 «Xatoni toping» | dasturni o'qish, tartib | «Ishga tushiring — qayerda to‘xtadi?» |

  12-qadamda shu jadval bo'yicha bitta qiyin maydonni sinf bilan birga o'qing (yechimni aytmang). Ismli ro'yxat darsdan keyin LMS natijasida.
- 16-qadamda bolaning ismi proyektorga chiqmaydi: bola dasturini o'zi o'qiydi, siz bosasiz.

---

## Dvigatelga kerak bo'ladigan yangi narsalar (KOD)

Bu darsda uchta yangi narsa (1–3); qolgani — sinov va tekshirish.

1. **Kechiktirilgan «Maslahat»** (`DARS.studiya[id].maslahatKeyin: true` yoki darsga umumiy `DARS.maslahatKeyin`): pog'ona ochilganda «Maslahat» qulf belgisi bilan (32-band), yonida «Avval bir marta ishga tushiring»; birinchi «▶ Ishga tushir»dan keyin ochiladi; solo'da ham. Bosilsa — hozirgidek «Yordam so‘radi» + bolaning shu pog'onasiga belgi (4-band uchun).
2. **Erkin rasm sharti — ikki oila** (15 · ★): `bosh.erkinRasm: { kerak: ['x', 'p'] }` — dasturda kamida bitta `go to` va bitta `repeat` (ichi bo'sh emas), dastur chetga urilmay tugadi; bo'lmasa Kamvoy «Oz qoldi!» («Dasturda go to ham, repeat ham bo‘lsin»). Rasm 17-qadamda qayta chiziladi (5-darsdagidek — `go to` sakrashi punktir bilan).
3. **LMS mentor natijasi:** har pog'ona — bajardi, maslahat ochdi, ishga tushirishlar soni (yutuqlar va «oxirigacha o'tdi» yonida). Modul tugagach, server bilan birga (93-qaror).
4. *(tekshirish, yangi kod kutilmaydi)* Javonda ikki oila — Harakat (`go to` bilan) va Takrorlash; `repeat` tanlangan bo'lsa `go to` ham ichiga tushadi (bola qo'ysa — ishlaydi). Huk A kartasi: «4 / 3» va xira to'rtinchi blok — dars `qismlar.mjs` dagi rasm, sinov `data-dastur="uu"`. 7-qadam — studiya ekranida `raqam` ishi (uch joy hoshiyasi).
5. *(tekshirish)* Bola pog'onasida tayyor dastur (15 · 3, `prog: 'qoldir'`) — Blockly'ga tushadi, o'zgartirsa bo'ladi; `gap.chet` — «Qahramon shu blokda to‘xtadi. Bloklar tartibini tekshiring».
6. *(tekshirish)* Rasm topshirig'ida `go to`: qo'ngan katak bo'yaladi, sakrash yo'li hisoblanmaydi (hozirgi `h.yol`) — 15 · 2 shunga tayanadi.
7. **Simulyatsiya sinovi** `sinov/dvigatel/amaliyot.mjs` — yuqoridagi jadvaldagi har yechim, har xato varianti va chegara (5-darsdagi `takror.mjs` kabi).

## Savollar (tavsiya — A)

1. **Amaliyot darsida huk bormi? — A: ha, qisqa (4,5 daqiqa, 2–4-qadam).** Huk bu yerda ikki ish qiladi: uch karta — uch o'tgan dars (faqat takrorlash · faqat sakrash · ikkalasi), ya'ni eslatish; javobi — darsning qoidasi («bloklar birga ishlaydi»). Sabab: 13.11 fidbeki — «faqat amaliyot bo‘lib qolgan; huk, reja ko‘rinmadi»; 12-bo'lim 11-band. **B** — huksiz: 2 daqiqalik «Eslaymiz» va darhol ish (birinchi natija ~6-daqiqada) — dars «mashqlar to'plami»ga o'xshab qoladi.
2. **Qisqa takrorlash — A: 5-qadam «Uch blok — uch ish»** (bitta ekran, uch qator birma-bir) **+ 10- va 14-qadamdagi bir daqiqalik eslatmalar** (faqat topshiriq turi, boshqa maydonda, yechimsiz). **B** — har bekat oldidan to'liq «Ko'ramiz» (ustoz o'xshash masalani yechadi) — mustaqillik kamayadi, dars maqsadiga zid. **C** — eslatmasiz (7-qadamdan to'g'ri 8 ga) — rasm va tuzatish turlarini unutgan bola birinchi daqiqalarni yo'qotadi.
3. **«Maslahat» — A: bir urinishdan keyin ochiladi** (qulf + sabab; maslahat matni — yo'nalish, tayyor dastur emas; **KOD** 1). Bola avval o'zi sinaydi, lekin tiqilib qolmaydi. **B** — maslahat yo'q (faqat muammocha) — 9 yoshli bola uzoq qolib ketadi, ustoz 14 bolaga yetmaydi. **C** — 1–5-darsdagidek darhol — «yordamsiz» natija o'lchanmaydi.
4. **Ustoz doskasida «kim qayerda» — A: faqat son** (hozirgi zinapoya: har pog'onada nechta bola; «Yordam so‘radi: N») **+ «Darsdan oldin»dagi «pog'ona → nima qiyin» jadvali + ismli jadval faqat darsdan keyin LMS'da** (**KOD** 3). Proyektorga ism chiqmaydi (12-bo'lim 2-band). **B** — zinapoya kartalarida ikkinchi son «maslahat ochdi: N» (**KOD**, kichik) — qiyin pog'ona aniqroq ko'rinadi. **C** — bola noutbuki chetida «yordam kerak» belgisi — 92-qarorda olib tashlangan sariq hoshiyani qaytaradi.
5. **Hodisa bloklari (4-dars) — A: bu darsda yo'q.** Mavzu nomi — «harakat va takrorlash»; o'yin rejimida `repeat` ishlamaydi (o'yin dasturchalari takrorlash ichini o'qimaydi — **KOD** bo'lardi). **B** — 3-bekat ★ o'yin (strelkalar + repeat).
6. **15 · 3 — A: «Xatoni toping»** (tayyor dastur, bloklar tartibi xato; dvigatelda bor). Dasturni o'qish va tartib (2-dars) bir pog'onada tekshiriladi. **B** — «Oldindan ayting» `repeat` bilan (bayroqcha, 3-dars turi): `repeat` ni kim tushunmaganini yaxshiroq ko'rsatadi, lekin **KOD** — tayyor HTML dasturda takrorlash ichini ijrochi daraxt qilib o'qishi kerak (hozir tekis o'qiladi). Eslatma: 14-dars «Xatoni topish va tuzatish» butun dars shu mavzuda — A undan bitta kichik bo'lakni oldindan oladi.
7. **★ erkin rasm sharti — A: go to ham, repeat ham** (**KOD** 2, kichik) — «Hammasi birga» bekatiga mos. **B** — 5-darsdagidek «ichida kamida ikki blokli repeat» (kod yo'q, lekin 5-dars ★ ni takrorlaydi).
8. **Bekat nomlari — A: «Yo‘l · Rasm · Hammasi birga».** **B** — «Harakat · Takrorlash · Aralash» (oila nomlari — natija emas, 4-bo'lim 2-band).
9. **Amaliyot qolipi — A: shu tuzilish 1-moduldagi keyingi amaliyot darslarining qolipi bo'ladi** (huk → eslaymiz → reja → qoida → 3 bekat [bir daqiqalik eslatma + 4 pog'ona] → xulosa-qoida → o'qib berish → yakun); `KONSEPSIYA.md` 4-bo'limi va 7-ochiq savolga shu dars bolalarda sinalgach yoziladi. **B** — qolip 14-darsdan («Xatoni topish») keyin, ikki amaliyot solishtirilib.
10. **Manba v1 tasdig'i.**

## Tekshirilmagan joylar

1. Vaqtlar taxminiy. Birinchi natija 11–12-daqiqada (8 · 1, 4 ta blok); huk sinovi uzaysa — 5-qadamni qisqartirish kerak.
2. «Maslahat» qulfi 9 yoshli bolani asabiylashtiradimi — sinfda kuzatiladi; asabiylashtirsa, qulf faqat 1-pog'onada olib tashlanadi.
3. 8 · 2 «Eng uzoq katak» — «0 / 1 ta blok» yozuvining o'zi javobga ishora (bitta blok — demak `go to`). Ataylab: chegarani o'qish ham ko'nikma; lekin pog'ona juda oson bo'lib qolishi mumkin.
4. Huk C kartasi («Sakrab, keyin takrorlaymiz») eng murakkab ko'rinadi — sinf haqiqatan bo'linadimi (12-bo'lim 25-band); A («Ikkita repeat») 5-darsdan keyin kuchli taxmin bo'lishi kutiladi — repeat ham sanalishi esdan chiqadi.
5. 15 · 2 «Teng belgisi»: `go to` sakrash izi (punktir) (3, 0) dan (0, 2) ga rasm ustidan o'tadi — ko'rinishi qurishda tekshiriladi; iz rasmga kirmaydi.
6. 11 · ★ «To‘lqin» — chegara aynan 7, ichida 6 blokli repeat: Blockly dastur ustuniga sig'adimi (5-dars 11 · ★ dagi kabi — setka darvozasi).
7. 15 · 3 — bola pog'onasida tayyor dastur birinchi marta; Blockly'ga to'g'ri tushishi qurishda tekshiriladi (**KOD** 5).
8. 12-qadamda ustoz qiyin maydonni sinf bilan «o'qiydi» — 59-qaror («dars ichida savol yo'q») bilan chegarada: ustoz savolni o'zi beradi va o'zi javob beradi, sinfdan taxmin so'ramaydi.
9. 18-qadamda sinf jami — 64-qarorda «Sinfimiz bugun»dagi jami sonlar bekor qilingan, lekin 1–5-darsda bu qadam bor; shu darslardagidek qoldirildi.
10. Daraxt (1, 1) — 3-darsdagi ochiq savol (uni (1, 2) ga ko'chirish): bu darsda (1, 2) — 8 · 1 yo'lida (olma va yulduz orasida); daraxt ko'chsa, 8 · 1 yo'li daraxt ustidan o'tadi (to'sqinlik qilmaydi), lekin olma/yulduz katagiga tushmaydi.
11. 7-darsdagi «O‘tgan darslarda» kartasi va bu darsdagi «Keyingi dars · 7 · Kostyum va tovush» — 7-dars manbasidagi «7-dars · Kostyum va tovush» nomi bilan bir xil.
12. Ruscha matn hali yo'q.

## Filtr qarorlari (v1.1, 20.11 — bosh seans)

1. **Topshiriqlar simulyatsiyasi qabul** — bezak kataklari, chegara, oila tanlovi, takrorlanmaslik tekshirilgan (jadval). Daraxt 6-darsda (1, 1) da qoladi (4–5-dars maydoni; 3-darsdagi (1, 2) faqat 3-darsga — u yerda start (1, 1) edi).
2. **A·2 (maslahat yo'nalish beradi):** 8 · 1 «Avval tepaga, keyin o‘ngga» → «Olma yo‘lda — avval olmaga boring»; 15 · 3 «Avval sakrash, keyin pastga yurish» → «To‘xtagan blokni o‘qing: qahramon qayerdan yurishi kerak edi? Bloklar tartibini o‘ylang». Qolganlari — yo'nalish.
3. **A·1 (16-qadam):** bola noutbukida oxirgi yechgan pog'onasi o'z dasturi bilan (3–5-darsdagidek, `'oxirgi'`).
4. **18-qadam «Sinfimiz bugun»** — 1–5-darsdagidek qoldirildi; 64-qaror bilan ziddiyat foydalanuvchiga savol (ko'rik sahifasi).
5. **KOD 1 (kechiktirilgan «Maslahat»)** va **KOD 2 (`erkinRasm.kerak`)** — qurishda qilinadi; KOD 3 (mentor natijasi) — modul tugagach (93-qaror).

## Qurishdagi qarorlar (v1.2, 20.11 — dars papkasi `../darslar/006-amaliyot/`)

1. **7-qadam «Bugun — o‘zingiz»** studiya ekranidagi hoshiyalar o'rniga **uch qator** (5-qadamdagidek, `raqam` ishi): kichik bloklar — «Hamma blok shu yerda — o‘zingiz tanlaysiz»; «0 / 3 ta blok» yozuvi — «Nechta blok sig‘adi — shu yerda»; qulfli «Maslahat» tugmasi rasmi — «Maslahat bir urinishdan keyin ochiladi». Sabab: studiyaning ichki joylariga hoshiya qo'yish yangi dvigatel ishi edi; gaplar va tartib o'sha.
2. **5-qadam qatorlari** — kichik blok belgilari (5-darsdagidek): to'liq bloklar ekranga sig'masdi (setka darvozasi).
3. **Huk kartalari** — kichik dastur ikki qatorda (A: `repeat 2` ↑ / `repeat 5` → xira, ostida «4 / 3»; C: go to (0, 2) / `repeat 5` →); bir qatorda karta eniga sig'masdi.
4. **Doskalar:** «Har belgi — uch pog‘onani tugatgan bitta bola» 8- va 15-qadamda; 11-qadamda yo'q (Coddy gapi ikki qatorga tushadi — doska ish zonasidan chiqardi).
5. **Muammocha gaplari** — manbadagidek, darsga xos: «o‘tib ketdi» — «oxirgi blokni tekshiring»; «kulrang qoldi» — «Son va yo‘nalishni tekshiring»; «rasmdan chiqdi» — «Kerak bo‘lsa — sakrang» (dvigatel: `gap.otibKetdi`, `gap.rasmKam`, `gap.rasmChiqdi`; «(x, y)» — qolgan yoki chiqqan katak). «Joy qolmadi!» ishorasi — `DARS.joyQolmadi` («Dasturga N ta blok sig‘adi. Boshqa blok tanlang»).
6. **14-qadam solo'da** — tayyor dastur olma qoldirsa, ishora «Ikki repeat ni bosing — joyi almashadi» (`gap.olmasiz` [jonli, solo] juftligi; jonli darsda standart gap).
7. **Natija kartalari ranglari** 5-darsdagidek: repeat — 5-darsdagi Takrorlash kartasi rangi, go to — Harakat ko'k, pog'ona — yutuq rangi.
8. **KOD 1** (`DARS.maslahatKeyin`) va **KOD 2** (`erkinRasm.kerak`) — dvigatelga qo'shildi (studiya.js, sahna.js); 1–5-darsda o'chiq (oltin namunasi farq 0).
9. **Sinovlar:** `sinov/dvigatel/amaliyot.mjs` (mustaqil simulyatsiya: har yechim va xato varianti, qulf, chegara, huk, tayyor dastur), `sinov/demo/006-toliq-dars.mjs`, `006-solo.mjs`, `006-tovush.mjs`.

