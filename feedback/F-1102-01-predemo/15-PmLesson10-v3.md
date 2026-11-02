# 4-Modul «Frontend — React» · m3-14 «Ishlayotgan saytingizni qanday ko'rsatasiz?» — MD v3

Fayl: `src/3-Modull/PmLesson10.jsx` · **16 → 10 ekran** · uz (ru — 6-RU bosqichida, yangi matnlar uchun)
Fidbek: F-1102-01 (mentor, 02.11.2026): «pre demo day mavzusi juda cho'zilib ketibdi, 16 ta slayd. Demo Day'ga kerak bo'ladigan asosiy
tushunchalarni berib, qolganini olib tashlash kerak. Bolalar pitch qilishga ulgurmayapti».
Foydalanuvchi qarori (02.11): «olib tashlaymiz, haqiqiy darsga aylantiramiz, keraksizi kerak emas».
Fidbek: qator yoniga `>> …`. Tasdiqlangach (GATE M) dars shu holatga keltiriladi. ⚠️ Qolgan testlarda to'g'ri javob O'RNI o'zgarmaydi.

---

## A. Darsning tayanchi

- **O'rni:** 3-Modul (LMS 4-Modul) 15-dars. Oldingi: m3-13 «Praktika: Istalgan saytni qurish». Keyingi: m3-15 Zaxira dars → m3-16 **Demo Day** («guruh + mehmonlar oldida himoya»).
- **Darsning yangi vazifasi:** Demo Day'dan oldingi **repetitsiya**. Nazariya qisqa (~35 daq), qolgan vaqt (~40–45 daq) — har bola sinf oldida chiqib ko'rsatadi.
- **O'quvchi roli (110):** startapchi, saytini AI bilan o'zi qurgan. Ko'rsatuvni o'zi qiladi.
- **Tushunchalar (o'zgarmaydi):** ko'rsatuv (pitch) · kadr (gap + harakat) · bo'sh gap (ekranni takrorlagan gap) · bitta harakat va uning natijasi.
- **Misol-ip:** maydoncha.uz (maktab yonidagi maydonchani band qilish sayti) — o'zgarmaydi.
- **Bugungi asosiy fikr:** «Ko'rsatuvda ekran ko'rsatmaydigan narsani aytasiz va bitta joyni bosib natijani ko'rsatasiz.»

### Nima olib tashlanadi va nega

| Eski ekran | Nima edi | Nega olib tashlanadi |
|---|---|---|
| s2 · s3 | «Ishlaydigan sayt o'zini o'zi tushuntiradimi?» kartalar + test | Shu fikr hook (s0) xulosasida va s4 da bor — takror |
| s6 · s7 | Airbnb taqdimoti (4 bosqich, 2 bashorat) + test | Demo Day uchun shart emas; «tartib» uch kadrning o'zida bor |
| s10 | VS Code: tasdiq qatori kodi (10 daq) | Bu kod ishi, ko'rsatuv emas |
| s12 | Yoddan aytish, juftlikda 30 s | O'rnini yangi «Sahna» ekrani oladi (haqiqiy chiqish) |
| s14 | Takrorlash kartalari (10 ta) | Demo Day oldidan sinf vaqtini olmasin. >> qoldiraylikmi? |

### Yangi tartib va vaqt

| # | id | Ekran | Vaqt |
|---|---|---|---|
| 1 | s0 | Kirish: «Yoningizdagi odam nima deydi?» | 4 |
| 2 | s1 | Maqsad: uch kadr | 2 |
| 3 | s4 | Gapsiz ko'rsatuv — to'rt kadr | 6 |
| 4 | s5 | Test: bo'sh gap (ballik) | 2 |
| 5 | s8 | O'z ishingizga uch kadr yozing | 14 |
| 6 | s9 | Bosiladigan joyni tanlang | 4 |
| 7 | s11 | Yakuniy test (ballik) | 2 |
| 8 | s13 | Podium | 1 |
| 9 | **s16** | **YANGI · Sahna: navbat bilan ko'rsatuv** | **40–45** |
| 10 | s15 | Dars yakuni: uyga vazifa + CodeStrike | 3 (+ arena 8, vaqt qolsa) |
| | | **Jami** | **~80–87** |

> Sahna testlar va podiumdan KEYIN turadi: ballik qism tugaydi, darsning qolgan vaqti to'liq chiqishlarga qoladi.
> Vaqt yetmasa mentor arenani o'tkazib yuboradi, chiqishlar qisqarmaydi.

---

## O'zgarmaydigan ekranlar (matni aynan qoladi)

- **1 · s0 Kirish** ← QKirish — o'zgarmaydi.
- **2 · s1 Maqsad** ← QReja — o'zgarmaydi.
- **3 · s4 Gapsiz ko'rsatuv** ← QTushuncha — o'zgarmaydi.
- **4 · s5 Test «Qaysi gap ko'rsatuvga hech narsa qo'shmaydi?»** ← QTest — o'zgarmaydi (✔ C, indeks 2).
- **5 · s8 Uch kadr** ← QMustaqil — o'zgarmaydi.
- **6 · s9 Bosiladigan joy** ← QTushuncha (hotspot) — o'zgarmaydi.
- **7 · s11 Yakuniy test «Ko'rsatuvda bosiladigan joy qanday tanlanadi?»** ← QTest — o'zgarmaydi (✔ B, indeks 1).
- **8 · s13 Podium** — o'zgarmaydi.

---

## 9 · s16 Sahna: navbat bilan ko'rsatuv ← YANGI (QMustaqil turi, o'qish holatida)

🧑‍🏫 Bu slayd nima uchun: o'quvchilar Demo Day'dan oldin bir marta sinf oldida chiqib, uch kadrini ko'rsatib ko'radi.

- Eyebrow: Sahna · navbat bilan
- Sarlavha: **Uch kadringizni sinf oldida ko'rsating.** (39)
- Mentor: Navbatingiz kelganda saytingizni oching va uch kadringizni ayting. Har biringizga 2 daqiqa.
  >> 2 daqiqa to'g'rimi? (Demo Day'da har bolaga necha daqiqa beriladi?)

**O'quvchi ekrani (jonli dars):**
- Chap ustun — **uch kadr kartasi** (s8 da yozilgani, faqat o'qish uchun — 92e teleprompter):
  - Sarlavha-qator: «🎬 {ish} — uch kadr»
  - 1 · {gap} / 👆 {harakat} · 2 · … · 3 · …
  - «✎ Tahrirlash» — kichik tugma: «O'z ishingiz» ekraniga (s8) qaytaradi, tahrir o'sha yerda. *(kodda aniqlashtirildi)*
  - Uch kadr yozilmagan bo'lsa: «Uch kadr hali yozilmagan. «O'z ishingiz» ekraniga qaytib yozing.» + «← Qaytish» tugmasi.
- O'ng ustun — **tinglovchi kartasi**:
  - Yorliq: «👂 Boshqalar chiqqanda»
  - Matn: «Har chiqishdan keyin bitta savolga javob toping: u qaysi joyni bosdi va natija qayerda chiqdi?»
- Pastda tugma: **«Ko'rsatdim»** (chiqib bo'lgach o'quvchi o'zi bosadi).
- **Harakat → Vizual o'zgarish:** «Ko'rsatdim» bosiladi → tugma o'rnida yashil xulosa chiqadi (T-048: bir gap bir joyda); mentor ekranidagi ro'yxatda o'quvchi ismi yashil ✓ ga o'tadi. *(kodda aniqlashtirildi)*
- Xulosa (bosilgach): **«Ko'rsatuvingiz tayyor. Demo Day'da xuddi shunday chiqasiz.»** (53)

**O'quvchi ekrani (yakka — uyda yoki jonli darsdan tashqari):**
- O'sha uch kadr kartasi + tinglovchi kartasi o'rniga **2 daqiqalik taymer**:
  - «▶ 2 daqiqani boshlash» → doira sanaydi, yonida «Ovoz chiqarib ayting · ekranga qaramasdan»
  - Tugagach: «✓ Vaqt tugadi. Uch kadrni aytib chiqdingizmi?» + «↻ Yana 2 daqiqa»
- Keyin «Ko'rsatdim».

**Mentor ekrani (proyektor):**
- Katta taymer **2:00** — «▶ Boshlash» · «⏹ To'xtatish» · «↻ Qaytadan». Vaqt tugaganda doira kulrang bo'ladi va «Vaqt tugadi» yozuvi chiqadi (qizil emas — 7-qonun).
- Ostida — **«🎤 Ko'rsatganlar — 5/14»** ro'yxati: «Ko'rsatdim» bosganlar yashil ✓, qolganlari ✏️ (mavjud `MentorPracticeStats`).
- MentorNote: «Har chiqishdan keyin sinfdan bitta savol so'rang: qaysi joyni bosdi, natija qayerda chiqdi? Javob topilmasa, harakat aniq aytilmagan — o'sha kadrni birga tuzating. Vaqt yetmasa, chiqa olmaganlar uyga vazifaning to'liq variantini oladi.»
- «Davom etish» mentor uchun doim ochiq; o'quvchi ham bloklanmaydi (jonli darsda `optionalLive`).

✎ eskidan: s12 (juftlikda 30 s + bir qator yozish) o'rniga keldi. Senariydagi «bu darsda taymer yo'q» qarori (M1-D14 dan farq uchun) F-1102-01 bilan **bekor qilinadi** — mentor fidbeki: bolalar chiqishga ulgurmayapti.

---

## 10 · s15 Dars yakuni ← QYakun (2 joy o'zgaradi)

- Sarlavha: ~~«Ishingizning uch kadri yozildi.»~~ → **«Uch kadringiz tayyor — Demo Day'da shuni ko'rsatasiz.»** (50)
- «Endi siz bilasiz» — 4 qator o'zgarmaydi.
- Nishonlar: **4 → 3** (Silent Watch · Three Frames · Spot On). «Live Proof!» (VS Code ekrani) olib tashlanadi.
- Uyga vazifa kartasi — o'zgarmaydi (To'liq ~20 daq / Qisqa ~10 daq).
- MentorNote: ~~«Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa.»~~ →
  «Uy-vazifa: sinfda chiqib ulgurmaganlarga to'liq variant, chiqqanlarga qisqa. Muddat — keyingi darsgacha. Tekshirishda bitta savolga qarang: kadrda aytilgan harakatni saytda chindan bosib bo'ladimi?»
  (Arena haqidagi birinchi gap qoladi.)

---

## Qisqa takrorlash oynalari (RECAPS)
- «Bo'sh gap» (s5) va «Bitta harakat» (s11) — o'zgarmaydi. «Ekran nimani aytmaydi» (s3) va «Tartib tasodifiy emas» (s7) — ekranlari bilan ketadi.

## Jonli viktorina — CodeStrike (12 savol, ✔ 3/3/3/3)
9 savol o'zgarmaydi. Olib tashlangan ekranlarga tegishli 3 savol almashtiriladi:

| Ketadi | O'rniga (✔ o'rni) |
|---|---|
| «Airbnb o'z ishini nima bilan tushuntirgan?» (✔ B) | **«Tugmani bosdingiz, ekranda hech narsa o'zgarmadi. Odam nimani bilmaydi?»** — A) Saytning nomini · **B) Ish bajarilganini ✔** · C) Tugmaning rangini · D) Menyu qayerdaligini |
| «Airbnb taqdimoti nima bilan tugagan?» (✔ A) | **«Qaysi gap ko'rsatuvga yangi narsa qo'shadi?»** — **A) «Ilgari guruhda so'rab yurardik» ✔** · B) «Bu — bosh sahifa» · C) «Bu yerda qidiruv bor» · D) «Tepada menyu turibdi» |
| «Odam natijani ko'rishi uchun kodda nima kerak?» (✔ D) | **«Tinglovchi «qayerni bosdingiz?» deb so'radi. Bu nimani bildiradi?»** — A) Ko'rsatuv juda uzun bo'ldi · B) Sayt umuman ishlamadi · C) Gap ekranni takrorladi · **D) Harakat aniq aytilmadi ✔** |

✔ taqsimoti saqlanadi (A/B/D o'rniga A/B/D). ⚠️ CodeStrike savollari CRM Learn'da ham turibdi — LMS'ga chiqarishda savollar ham qayta yuklanadi.

## Kartochkalar
- Ekran olib tashlansa — kartochkalar ham ketadi. >> qoldirilsa: Airbnb va kod kartasi o'rniga 2 ta yangi karta yoziladi (10 ta bo'lishi kerak).

---

## KOD — ✅ 02.11 bajarildi (GATE M tasdiqlandi; savollar tavsiya bo'yicha: 2 daqiqa · kartochkalar chiqdi · Sahna podiumdan keyin)
1. `SCREEN_META` · `screens` · `SCREEN_INTENTS`: s2, s3, s6, s7, s10, s12, s14 chiqadi; `s16` (Sahna) qo'shiladi; tartib — yuqoridagi jadval. id'lar o'zgarmaydi (LMS tahlili uchun), yangi ekran yangi id oladi.
2. `RECAPS` kalitlari yangi indeksga (s5 → 3, s11 → 6). `INLINE_KEYS`: s3, s7, `koding` chiqadi; `sahna: -1` (ishtirok) qo'shiladi.
3. `ACHIEVEMENTS` / `ACH_TRIGGERS`: `liveProof` / s10 chiqadi.
4. `QUIZ_BANK`: 3 savol almashadi (yuqorida); uzunlik-tell ≤1.4× darvoza bilan tekshiriladi.
5. Sahna ekrani: mavjud bo'laklardan — uch kadr kartasi (s8 `kdr-list`), taymer (`PairTimer` 120 s yakka/mentor varianti), `MentorPracticeStats` / `StudentPracticePulse`. Yangi mexanika yozilmaydi.
6. Olib tashlangan ekranlarning kodi va CSS'i (S2_CARDS, K12, KD_*, ScreenReflection, Flashcards) o'chiriladi — o'lik kod qolmaydi.
7. Yakun sarlavhasi va MentorNote. Fayl boshidagi izoh («16 ta», «taymer YO'Q») yangilanadi; `pm-senariylar/M3-D14-Frontend-Pitch.md` ga F-1102-01 eslatmasi.
8. Progress: ekranlar soni o'zgargani uchun eski saqlangan holat (`progRead(lessonId, TOTAL_SCREENS)`) o'zi tashlanishi tekshiriladi.
9. RU: yangi/o'zgargan matnlar (`ru:`), keyin `ru-gate` · `ru-walk`.
10. Darvozalar: `npm run gates -- src/3-Modull/PmLesson10.jsx` 12/12 · `lint:jsx` 0 · `lint:til` 0 · ekran suratlari (1280 · 1366 · 390).
11. LMS: yangi versiya (v7) — G retsepti (farq → paket → yuklash → muhr) + CRM'da CodeStrike savollari. Faqat buyruq bilan.

## Keyingi navbat (sinf-supurish)
Demo Day oldidan PM darslari ekran soni: m1-12 `PmLesson3` 10 · m2-13 `PmLesson6` 11 · m3-14 `PmLesson10` **16** · m4-15 `PmLesson14` **16**.
Shu dars yopilgach — **m4-15 `PmLesson14`** «Qanday ishlaydi? deb so'rashsa» xuddi shu usulda ko'riladi.

## GATE M — o'z-tekshiruv
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos
- [x] Bitta misol-ip (maydoncha) — Airbnb ketgach ikkinchi olam ham qolmadi
- [x] Yangi ekranda «Harakat → Vizual o'zgarish» bor
- [x] Sarlavhalar ≤55 · Mentor ≤2 gap · xulosa ≤110
- [x] Atamalar o'sha: ko'rsatuv · kadr · gap · harakat · natija
- [x] Qolgan testlarda ✔ o'rni o'zgarmagan; arena 3/3/3/3 saqlangan
- [x] Yangi mexanika yo'q — mavjud bo'laklar qayta ishlatiladi
