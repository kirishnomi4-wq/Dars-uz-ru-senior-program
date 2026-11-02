# 5-Modul «Ma'lumot va bog'lanishlar» · m4-15 «Qanday ishlaydi?» deb so'rashsa — MD v3

Fayl: `src/4-Modull/PmLesson14.jsx` · **16 → 11 ekran** · uz (ru — yangi/o'zgargan matnlar uchun)
Fidbek: F-1102-01 sinf-supurishi (02.11.2026). Mentor fidbeki m3-14 haqida edi, foydalanuvchi qarori: «boshqa darsda ham shu muammo bo'lsa navbat bilan».
Bu dars xuddi o'sha qolipda: 16 ekran, senariy vaqti 82 + 8 bufer = 90 daqiqa, «sahna-taymeri YO'Q» — chiqishga vaqt rejalanmagan.
Fidbek: qator yoniga `>> …`. ⚠️ Qolgan testlarda to'g'ri javob O'RNI o'zgarmaydi.

---

## A. Darsning tayanchi

- **O'rni:** 4-Modul (LMS 5-Modul) 15-dars. Oldingi: m4-14 «Feedback bilan yaxshilash — AvtoStoyanka». Keyingi: m4-16 Zaxira → m4-17 **Demo Day** («jonli fullstack demo»).
- **Darsning yangi vazifasi:** Demo Day'dan oldingi **repetitsiya**: saytni ko'rsatish + «Qanday ishlaydi?» savoliga uch gap bilan javob. Nazariya ~40 daq, chiqishlarga ~35–40 daq.
- **Tushunchalar (o'zgarmaydi):** texnik so'z · uch qavat (sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi) · texnik qaror va uning sababi (odamga foydasi).
- **Misol-ip:** AvtoStoyanka — o'zgarmaydi.
- **Bugungi asosiy fikr (o'zgarmaydi):** «Qarab turgan odam kodni emas, saytingiz unga nima qilib berishini eshitadi.»

### Nima olib tashlanadi va nega

| Eski ekran | Nima edi | Nega |
|---|---|---|
| s3 | Test: «texnik so'zli javob odamga nima beradi» | s2 xulosasini takrorlaydi («Rost javob ham notanish so'z bilan aytilsa, odamga yetib bormaydi») |
| s6 · s7 | Airbnb besh qadami + test | Demo Day uchun shart emas |
| s10 | VS Code: holat-qatori kodi | Kod ishi, ko'rsatuv emas |
| s12 | Yoddan aytish (juftlik) | O'rnini «Sahna» oladi |
| s14 | Takrorlash kartalari | m3-14 dagi qaror bilan bir xil |

### Yangi tartib va vaqt

| # | id | Ekran | Vaqt |
|---|---|---|---|
| 1 | s0 | Kirish: «Band joylar o'chib ketmaydimi?» — qaysi javob | 4 |
| 2 | s1 | Maqsad: uch qavat | 2 |
| 3 | s2 | Ikki javob — texnik so'z | 4 |
| 4 | s4 | Uch qavat kesimi | 6 |
| 5 | s5 | Test: qaysi qavat eslab qoladi (ballik) | 2 |
| 6 | s8 | Uch qavatingizga uch gap | 14 |
| 7 | s9 | Uch qaror — uch sabab | 6 |
| 8 | s11 | Yakuniy test (ballik) | 2 |
| 9 | s13 | Podium | 1 |
| 10 | **s16** | **YANGI · Sahna: navbat bilan ko'rsatuv** | **35–40** |
| 11 | s15 | Dars yakuni: uyga vazifa + CodeStrike | 3 (+ arena 8, vaqt qolsa) |
| | | **Jami** | **~80–85** |

> >> s9 (qaror-sabab, 6 daq) — Demo Day'da «nega shunday qildingiz?» savoliga tayyorlaydi, yakuniy test ham shunga tayanadi. Shuning uchun qoldirdim. Kerak emas desangiz — olib tashlanadi, yakuniy test almashadi.

---

## O'zgaradigan bitta joy: s0 Kirish
- Javobdan keyingi gap: ~~«Ikkala javob ham rost. Keyingi ekranda ikkalasini yonma-yon qo'yib, qaysi biri savol bergan odamga yetib borishini ko'ramiz.»~~ — **o'zgarmaydi** (keyingi ekran baribir s2 — ikki javob yonma-yon). ✓
- Qolgan ekranlar (s1, s2, s4, s5, s8, s9, s11, s13) — **matni aynan qoladi**.

---

## 10 · s16 Sahna: navbat bilan ko'rsatuv ← YANGI (m3-14 «Sahna» bilan bir mexanika)

🧑‍🏫 Bu slayd nima uchun: o'quvchilar Demo Day'dan oldin bir marta sinf oldida saytini ko'rsatib, «Qanday ishlaydi?» savoliga javob berib ko'radi.

- Eyebrow: Sahna · navbat bilan
- Sarlavha: **Sinf oldida «Qanday ishlaydi?»ga javob bering.** (46)
- Mentor: Navbatingiz kelganda saytingizni oching, bitta joyni bosib ko'rsating va uch qavatni oddiy so'z bilan ayting. Har biringizga 2 daqiqa.

**O'quvchi ekrani (jonli dars):**
- Chap — **uch gap kartasi** (s8 da yozilgani, faqat o'qish uchun):
  - «🏢 Uch qavatingiz — uch gap» (s8 dagi sarlavha aynan)
  - Sahifa · {gap} / Server · {gap} / Baza · {gap}
  - «✎ Tahrirlash» → s8 ekraniga qaytaradi.
  - Yozilmagan bo'lsa: «Uch gap hali yozilmagan. Orqaga qaytib, uch qavatingizga gap yozing.» + «← Qaytish» (s8 ga).
- O'ng — **tinglovchi kartasi**: «Boshqalar chiqqanda» · «Har chiqishdan keyin bitta savolga javob toping: u texnik so'z ishlatdimi? Ishlatgan bo'lsa — qaysi?»
- Pastda **«Ko'rsatdim»** → tugma o'rnida xulosa: **«Javobingiz tayyor. Demo Day'da xuddi shunday aytasiz.»**

**Yakka o'quvchi:** tinglovchi kartasi o'rniga 2 daqiqalik taymer («Ovoz chiqarib ayting · ekranga qaramasdan»).

**Mentor ekrani:** katta taymer 2:00 (▶ Boshlash · ⏹ To'xtatish · ↻ Qaytadan) + tinglovchi kartasi + «Ko'rsatganlar» ro'yxati.
- MentorNote: «Har chiqishdan keyin sinfdan bitta savol so'rang: texnik so'z bo'ldimi? Bo'lgan bo'lsa, o'sha gapni birga oddiy so'z bilan qayta ayting. Vaqt yetmasa, chiqa olmaganlar uyga vazifaning to'liq variantini oladi.»

✎ Senariydagi «sahna-taymeri YO'Q» qarori F-1102-01 bilan bekor.

---

## 11 · s15 Dars yakuni
- «Endi siz bilasiz» (4 qator), «Bugungi asosiy fikr» — o'zgarmaydi.
- Sarlavha: ~~«Uch qavatingizni oddiy tilda aytdingiz.»~~ → **«Uch gapingiz tayyor — Demo Day'da shuni aytasiz.»** (48) — m3-14 bilan bir shakl.
- Nishonlar: **4 → 3** (Three Floors · Plain Talk · Good Reason). «On Screen!» (VS Code) chiqadi.
- MentorNote: ~~«Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa variant.»~~ →
  «Uy-vazifa: sinfda chiqib ulgurmaganlarga to'liq variant, chiqqanlarga qisqa.» (qolgani o'zgarmaydi)
- Uyga vazifa kartasi — o'zgarmaydi.

## Qisqa takrorlash oynalari
- s5 va s11 niki qoladi (yangi indeks: 4 va 7). s3 va s7 niki ekranlari bilan ketadi.

## CodeStrike (12 savol, ✔ 3/3/3/3)
9 savol qoladi. Almashadigan 3 ta:

| Ketadi | O'rniga (✔ o'rni saqlanadi) |
|---|---|
| «Airbnb besh qadamida qaysi biri yo'q edi?» (✔ A) | **«Sizdan «nega PostgreSQL?» deb so'rashdi. Qaysi javob odamga yetib boradi?»** — **A) «Telefon o'chsa ham joylar saqlanadi» ✔** · B) «Chunki u relyatsion baza» · C) «Chunki SQL so'rovlari tez» · D) «Chunki hamma shuni ishlatadi» |
| «Airbnb ishini avval nima bilan tushuntirgan?» (✔ C) | **«Qaysi gap texnik so'zsiz aytilgan?»** — A) «Ma'lumot PostgreSQL'da turadi» · B) «Server POST so'rovni oladi» · **C) «Bitta joy ikki odamga tushmaydi» ✔** · D) «Sahifa React'da yozilgan» |
| «Ko'rinmas qavat ishlayotganini odam qanday ko'radi?» (✔ D) | **«Tinglovchi «tushunmadim» dedi. Nima qilasiz?»** — A) Texnik so'zni qayta aytasiz · B) Kodni ekranda ochasiz · C) Tezroq gapirib berasiz · **D) Oddiy so'z bilan qayta aytasiz ✔** |

⚠️ CRM Learn'dagi savollar ham — LMS'ga chiqarishda (oxirida, hammasi birga).

---

## KOD — ✅ 02.11 bajarildi (GATE M tasdiqlandi; s9 qoladi)
1. `SCREEN_META` / `screens` / `SCREEN_INTENTS`: s3, s6, s7, s10, s12, s14 chiqadi; s16 qo'shiladi (tartib yuqorida).
2. `RECAPS` (5 → 4, 11 → 7) · `Q_LABELS` · `INLINE_KEYS` (s3, s7, `koding` chiqadi; `sahna: -1`).
3. `ACHIEVEMENTS` / `ACH_TRIGGERS`: `onScreen` / s10 chiqadi; nishon to'ri 3 ustun.
4. `QUIZ_BANK`: 3 savol (uzunlik-tell darvozasi bilan).
5. Sahna — m3-14 dagi `ScreenSahna` / `SahnaTimer` naqshi, ma'lumot `pm-m4d15-pitch.qavatlar` (yoki s8 javobi) dan; `onGo` prop.
6. O'lik kod va CSS o'chiriladi; fayl boshidagi izoh; `pm-senariylar/M4-D15-Arxitektura-Pitch.md` ga F-1102-01 eslatmasi.
7. RU yangi matnlarga · gates · `lint:jsx` · ru-walk · suratlar (1280 · 390 · ru).
8. LMS — oxirida, boshqa darslar bilan birga (foydalanuvchi qarori 02.11).
